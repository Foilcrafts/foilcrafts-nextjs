import { AuthCard } from "@/components/AuthCard";
import { ResetPasswordForm } from "@/components/auth-forms";

export const metadata = {
  title: "Set new password — Foil Crafts",
};

export default function ResetPasswordPage() {
  return (
    <AuthCard
      eyebrow="Reset Password"
      title="Set a new <em>password.</em>"
      sub="Choose something at least 8 characters long."
    >
      <ResetPasswordForm />
    </AuthCard>
  );
}
