import Link from "next/link";
import { AuthCard } from "@/components/AuthCard";
import { SignupForm } from "@/components/auth-forms";

export const metadata = {
  title: "Request access — Foil Crafts",
};

export default function SignupPage() {
  return (
    <AuthCard
      eyebrow="Trade Partner · Request Access"
      title="Apply for the <em>library.</em>"
      sub="Trade enquiries only. Once your details are verified by our team, you'll receive an email with full access to the archive."
      footer={
        <>
          Already approved? <Link href="/login">Sign in →</Link>
        </>
      }
    >
      <SignupForm />
    </AuthCard>
  );
}
