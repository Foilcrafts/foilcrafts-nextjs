import { createClient } from "@/utils/supabase/server";
import { signOut } from "@/app/actions/auth";
import { AuthCard } from "@/components/AuthCard";

export const metadata = {
  title: "Awaiting approval — Foil Crafts",
};

export default async function PendingApprovalPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Display the user's email + signed-up name for clarity.
  const email = user?.email ?? "your account";
  const { data: profile } = user
    ? await supabase
        .from("profiles")
        .select("full_name, company, status, created_at")
        .eq("id", user.id)
        .single()
    : { data: null };

  const name = profile?.full_name ?? null;
  const company = profile?.company ?? null;

  return (
    <AuthCard
      eyebrow="Awaiting Approval"
      title="Your request is <em>under review.</em>"
      sub={
        name
          ? `Thanks ${name} — we've received your access request${company ? ` from ${company}` : ""}. Our team typically responds within one business day. You'll receive an email at ${email} the moment your account is approved.`
          : `Thanks — we've received your access request for ${email}. Our team typically responds within one business day. You'll receive an email the moment your account is approved.`
      }
      footer={
        <form action={signOut}>
          <button
            type="submit"
            style={{
              background: "transparent",
              border: 0,
              color: "var(--oxblood)",
              textDecoration: "underline",
              textUnderlineOffset: 3,
              cursor: "pointer",
              fontFamily: "var(--sans)",
              fontSize: 14,
            }}
          >
            Sign out
          </button>
        </form>
      }
    >
      <div className="auth-alert auth-alert--ok" style={{ marginBottom: 0 }}>
        <strong style={{ display: "block", marginBottom: 8 }}>
          What happens next?
        </strong>
        Our team reviews each trade-partner request manually. Once approved,
        you&rsquo;ll get an email confirming access — log in here and the full
        library will unlock immediately. If urgent, email info@foilcrafts.com.
      </div>
    </AuthCard>
  );
}
