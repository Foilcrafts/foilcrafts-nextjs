// Foil Crafts auth middleware (proxy).
// Runs on every request EXCEPT static assets. Refreshes the Supabase session
// and gates protected routes based on the user's status in profiles.

import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";


// ─────────────────────────────────────────────────────────────────────────────
// Route classification
// ─────────────────────────────────────────────────────────────────────────────

// Public marketing pages — anyone can see these.
const PUBLIC_PATHS = [
  "/",
  "/about",
  "/foiling",
  "/digital-printing",
  "/cut-plates-embossing",
  "/catalogs",
  "/contact",
];

// Auth-related pages — public, but redirect AWAY if already logged in.
const AUTH_PATHS = [
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
];

// Routes that require a logged-in user (any status).
const AUTHED_ANY_STATUS_PATHS = ["/pending-approval"];

// Routes that require status='approved'.
const APPROVED_ONLY_PATHS = ["/library"];

// Routes that require role='admin'.
const ADMIN_ONLY_PATHS = ["/admin"];

function startsWithAny(path: string, list: readonly string[]): boolean {
  return list.some((p) => path === p || path.startsWith(`${p}/`));
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Refresh the auth cookies on every request — required for Supabase SSR.
  const { supabaseResponse, user, supabase } = await updateSession(request);

  // ── Public marketing pages ─────────────────────────────────────────────
  if (PUBLIC_PATHS.includes(pathname)) {
    return supabaseResponse;
  }

  // ── Auth pages: if already logged in, send to /library (approved) or
  //    /pending-approval (still pending) ───────────────────────────────────
  if (startsWithAny(pathname, AUTH_PATHS)) {
    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("status")
        .eq("id", user.id)
        .single();
      if (profile?.status === "approved") {
        return NextResponse.redirect(new URL("/library", request.url));
      }
      return NextResponse.redirect(new URL("/pending-approval", request.url));
    }
    return supabaseResponse;
  }

  // ── /pending-approval ─ requires login (any status) ────────────────────
  if (startsWithAny(pathname, AUTHED_ANY_STATUS_PATHS)) {
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return supabaseResponse;
  }

  // ── Approved-only routes (/library, /api/asset) ────────────────────────
  if (startsWithAny(pathname, APPROVED_ONLY_PATHS)) {
    if (!user) {
      const url = new URL("/login", request.url);
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
    const { data: profile } = await supabase
      .from("profiles")
      .select("status")
      .eq("id", user.id)
      .single();
    if (profile?.status !== "approved") {
      return NextResponse.redirect(new URL("/pending-approval", request.url));
    }
    return supabaseResponse;
  }

  // ── Admin-only routes ──────────────────────────────────────────────────
  if (startsWithAny(pathname, ADMIN_ONLY_PATHS)) {
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, status")
      .eq("id", user.id)
      .single();
    if (profile?.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return supabaseResponse;
  }

  // Default: pass through (e.g. /auth/confirm, future routes).
  return supabaseResponse;
}

// Skip middleware for static assets — improves performance significantly.
// Note we DO run on /api/asset/* (handled inside the matcher OR via APPROVED_ONLY_PATHS above).
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico
     * - /images/* (public marketing images — never gated)
     * - file extensions for images / fonts / etc.
     */
    "/((?!_next/static|_next/image|favicon\\.ico|images/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|woff|woff2|ttf|otf)$).*)",
  ],
};
