import Link from "next/link";
import { AuthCard } from "@/components/AuthCard";
import { ForgotPasswordForm } from "@/components/auth-forms";

export const metadata = {
  title: "Forgot password — Foil Crafts",
};

export default function ForgotPasswordPage() {
  return (
    <AuthCard
      eyebrow="Reset Password"
      title="Forgot your <em>password?</em>"
      sub="Enter your email and we'll send you a link to set a new one."
      footer={
        <>
          Remembered? <Link href="/login">Back to sign in →</Link>
        </>
      }
    >
      <ForgotPasswordForm />
    </AuthCard>
  );
}
