import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { signOut } from "@/app/actions/auth";
import { approveUser, rejectUser, revokeUser } from "@/app/actions/admin";

export const metadata = {
  title: "Admin · Access Requests — Foil Crafts",
};

type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  company: string | null;
  phone: string | null;
  status: "pending" | "approved" | "rejected";
  role: string | null;
  created_at: string;
  approved_at: string | null;
};

type FilterStatus = "pending" | "approved" | "rejected" | "all";

function fmt(iso: string | null): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "—";
  }
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const supabase = await createClient();
  const sp = await searchParams;
  const filter = (sp.status as FilterStatus | undefined) ?? "pending";

  // Fetch all profiles + status counts for tabs.
  const [profilesRes, countsRes] = await Promise.all([
    supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false }),
    supabase.from("profiles").select("status"),
  ]);
  const profiles: Profile[] = (profilesRes.data as Profile[]) ?? [];
  const counts: Record<string, number> = { pending: 0, approved: 0, rejected: 0 };
  for (const p of (countsRes.data ?? []) as { status: string }[]) {
    counts[p.status] = (counts[p.status] ?? 0) + 1;
  }
  const total = profiles.length;
  const filtered =
    filter === "all" ? profiles : profiles.filter((p) => p.status === filter);

  return (
    <div className="admin-wrap">
      <div className="admin-inner">
        <div className="admin-head">
          <div>
            <div className="admin-head__sub">Admin · Access Requests</div>
            <h1 className="admin-head__title">
              Trade-partner <em>access.</em>
            </h1>
            <div className="admin-head__meta" style={{ marginTop: 12 }}>
              Total profiles: {total}
            </div>
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <Link
              href="/library"
              style={{
                padding: "12px 22px",
                border: "1px solid var(--ink)",
                borderRadius: 100,
                fontFamily: "var(--mono)",
                fontSize: 12,
                letterSpacing: ".15em",
                textTransform: "uppercase",
                color: "var(--ink)",
              }}
            >
              Library →
            </Link>
            <form action={signOut}>
              <button
                type="submit"
                style={{
                  padding: "12px 22px",
                  background: "transparent",
                  border: "1px solid var(--ash)",
                  color: "var(--ash)",
                  borderRadius: 100,
                  fontFamily: "var(--mono)",
                  fontSize: 12,
                  letterSpacing: ".15em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                }}
              >
                Sign out
              </button>
            </form>
          </div>
        </div>

        <div className="admin-tabs">
          {(["pending", "approved", "rejected", "all"] as const).map((s) => (
            <Link
              key={s}
              href={`/admin?status=${s}`}
              className={`admin-tab${filter === s ? " active" : ""}`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
              {s !== "all" && (
                <span className="admin-tab__count">{counts[s] ?? 0}</span>
              )}
            </Link>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="admin-table">
            <div className="admin-empty">No {filter} requests.</div>
          </div>
        ) : (
          <div className="admin-table">
            <div className="admin-row admin-row--head">
              <div>Name / Email</div>
              <div>Company</div>
              <div>Phone</div>
              <div>Requested</div>
              <div style={{ textAlign: "right" }}>Status / Actions</div>
            </div>
            {filtered.map((p) => (
              <div key={p.id} className="admin-row">
                <div>
                  <div className="admin-cell__primary">
                    {p.full_name ?? "—"}
                  </div>
                  <div className="admin-cell__secondary">{p.email}</div>
                </div>
                <div className="admin-cell__primary" style={{ fontSize: 16 }}>
                  {p.company ?? "—"}
                </div>
                <div className="admin-cell__meta">{p.phone ?? "—"}</div>
                <div className="admin-cell__meta">{fmt(p.created_at)}</div>
                <div className="admin-actions">
                  {p.status === "pending" && (
                    <>
                      <form action={approveUser}>
                        <input type="hidden" name="userId" value={p.id} />
                        <button
                          type="submit"
                          className="admin-btn admin-btn--approve"
                        >
                          Approve
                        </button>
                      </form>
                      <form action={rejectUser}>
                        <input type="hidden" name="userId" value={p.id} />
                        <button
                          type="submit"
                          className="admin-btn admin-btn--reject"
                        >
                          Reject
                        </button>
                      </form>
                    </>
                  )}
                  {p.status === "approved" && (
                    <>
                      <span className="admin-badge admin-badge--approved">
                        Approved · {fmt(p.approved_at)}
                      </span>
                      <form action={revokeUser}>
                        <input type="hidden" name="userId" value={p.id} />
                        <button
                          type="submit"
                          className="admin-btn admin-btn--revoke"
                          title="Revert to pending"
                        >
                          Revoke
                        </button>
                      </form>
                    </>
                  )}
                  {p.status === "rejected" && (
                    <>
                      <span className="admin-badge admin-badge--rejected">
                        Rejected
                      </span>
                      <form action={approveUser}>
                        <input type="hidden" name="userId" value={p.id} />
                        <button
                          type="submit"
                          className="admin-btn admin-btn--approve"
                        >
                          Approve
                        </button>
                      </form>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
