import Link from "next/link";
import { AuthCard } from "@/components/AuthCard";
import { LoginForm } from "@/components/auth-forms";

export const metadata = {
  title: "Sign in — Foil Crafts",
};

export default function LoginPage() {
  return (
    <AuthCard
      eyebrow="Trade Partner"
      title="Welcome back to the <em>library.</em>"
      sub="Sign in to view the complete archive — foiling, digital, cut plates, and the Collection 26 catalogue."
      footer={
        <>
          No account yet? <Link href="/signup">Request access →</Link>
        </>
      }
    >
      <LoginForm />
    </AuthCard>
  );
}
