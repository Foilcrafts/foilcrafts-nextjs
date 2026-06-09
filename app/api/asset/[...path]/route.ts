/*
 * Protected asset stream.
 *
 * Files live in /public/protected/ but are NOT served by Next.js's static
 * handler directly — they're behind this API route which:
 *   1. Verifies the request has an authenticated user (middleware already
 *      blocks unauthed traffic at /api/asset/*, but we re-check here as
 *      defence in depth).
 *   2. Verifies the user's profile.status is 'approved'.
 *   3. Streams the requested file with the right Content-Type.
 *
 * URL shape: /api/asset/catalogues/foil-crafts-catalog-26.pdf
 * Filesystem: <project>/public/protected/catalogues/foil-crafts-catalog-26.pdf
 *
 * Defence-in-depth: even if /public/protected/* were exposed by misconfig,
 * the file content is only served via this gated handler, so middleware
 * gating remains the security boundary.
 */

import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { readFile, stat } from "fs/promises";
import { join, resolve, sep, extname } from "path";

const ROOT = process.cwd();
const PROTECTED_ROOT = join(ROOT, "public", "protected");

// MIME type lookup — small allowlist so we don't serve weird extensions.
const MIME: Record<string, string> = {
  ".pdf": "application/pdf",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
};

export async function GET(
  request: Request,
  context: { params: Promise<{ path: string[] }> }
) {
  // ── 1. Auth check (defence-in-depth; middleware already ran) ───────────
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("status")
    .eq("id", user.id)
    .single();
  if (profile?.status !== "approved") {
    return new NextResponse("Forbidden — pending approval", { status: 403 });
  }

  // ── 2. Resolve + validate the path (no traversal) ──────────────────────
  const { path } = await context.params;
  if (!path || path.length === 0) {
    return new NextResponse("Not Found", { status: 404 });
  }

  const requested = join(...path);
  const fullPath = resolve(PROTECTED_ROOT, requested);

  // Path-traversal guard — fullPath must remain under PROTECTED_ROOT.
  if (!fullPath.startsWith(PROTECTED_ROOT + sep) && fullPath !== PROTECTED_ROOT) {
    return new NextResponse("Bad Request", { status: 400 });
  }

  // Extension allowlist.
  const ext = extname(fullPath).toLowerCase();
  if (!MIME[ext]) {
    return new NextResponse("Forbidden — file type not allowed", { status: 403 });
  }

  // ── 3. Read + stream the file ──────────────────────────────────────────
  try {
    const stats = await stat(fullPath);
    if (!stats.isFile()) {
      return new NextResponse("Not Found", { status: 404 });
    }
    const data = await readFile(fullPath);
    return new NextResponse(new Uint8Array(data), {
      status: 200,
      headers: {
        "Content-Type": MIME[ext],
        "Content-Length": String(stats.size),
        "Content-Disposition": `inline; filename="${path[path.length - 1]}"`,
        // Authenticated users may share devices — don't cache aggressively.
        "Cache-Control": "private, no-store, max-age=0",
      },
    });
  } catch {
    return new NextResponse("Not Found", { status: 404 });
  }
}
