"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
  signUp,
  signIn,
  requestPasswordReset,
  updatePassword,
  type AuthState,
} from "@/app/actions/auth";

const INITIAL: AuthState = {};

function Alert({ state }: { state: AuthState }) {
  if (state.error) {
    return (
      <div className="auth-alert auth-alert--err" role="alert">
        {state.error}
      </div>
    );
  }
  if (state.message) {
    return (
      <div className="auth-alert auth-alert--ok" role="status">
        {state.message}
      </div>
    );
  }
  return null;
}

export function LoginForm() {
  const [state, action, pending] = useActionState(signIn, INITIAL);
  return (
    <form action={action}>
      <Alert state={state} />
      <div className="auth-field">
        <label htmlFor="email">
          Email <span className="req">*</span>
        </label>
        <input id="email" name="email" type="email" autoComplete="email" required />
      </div>
      <div className="auth-field">
        <label htmlFor="password">
          Password <span className="req">*</span>
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </div>
      <button type="submit" className="auth-submit" disabled={pending}>
        {pending ? "Signing in..." : "Sign in"}
      </button>
      <div style={{ marginTop: 12, textAlign: "center", fontSize: 13 }}>
        <Link href="/forgot-password" style={{ color: "var(--ash)", textDecoration: "underline" }}>
          Forgot your password?
        </Link>
      </div>
    </form>
  );
}

export function SignupForm() {
  const [state, action, pending] = useActionState(signUp, INITIAL);
  return (
    <form action={action}>
      <Alert state={state} />
      <div className="auth-field">
        <label htmlFor="name">
          Name <span className="req">*</span>
        </label>
        <input id="name" name="name" type="text" autoComplete="name" required />
      </div>
      <div className="auth-field">
        <label htmlFor="company">
          Company <span className="req">*</span>
        </label>
        <input
          id="company"
          name="company"
          type="text"
          autoComplete="organization"
          required
        />
      </div>
      <div className="auth-field">
        <label htmlFor="phone">
          Phone <span className="req">*</span>
        </label>
        <input id="phone" name="phone" type="tel" autoComplete="tel" required />
      </div>
      <div className="auth-field">
        <label htmlFor="email">
          Email <span className="req">*</span>
        </label>
        <input id="email" name="email" type="email" autoComplete="email" required />
      </div>
      <div className="auth-field">
        <label htmlFor="password">
          Password <span className="req">*</span> <span style={{ opacity: .5 }}>(min 8 characters)</span>
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
        />
      </div>
      <button type="submit" className="auth-submit" disabled={pending}>
        {pending ? "Creating account..." : "Request access"}
      </button>
    </form>
  );
}

export function ForgotPasswordForm() {
  const [state, action, pending] = useActionState(requestPasswordReset, INITIAL);
  return (
    <form action={action}>
      <Alert state={state} />
      <div className="auth-field">
        <label htmlFor="email">
          Email <span className="req">*</span>
        </label>
        <input id="email" name="email" type="email" autoComplete="email" required />
      </div>
      <button type="submit" className="auth-submit" disabled={pending}>
        {pending ? "Sending..." : "Send reset link"}
      </button>
    </form>
  );
}

export function ResetPasswordForm() {
  const [state, action, pending] = useActionState(updatePassword, INITIAL);
  return (
    <form action={action}>
      <Alert state={state} />
      <div className="auth-field">
        <label htmlFor="password">
          New password <span className="req">*</span>
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
        />
      </div>
      <div className="auth-field">
        <label htmlFor="confirm">
          Confirm new password <span className="req">*</span>
        </label>
        <input
          id="confirm"
          name="confirm"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
        />
      </div>
      <button type="submit" className="auth-submit" disabled={pending}>
        {pending ? "Updating..." : "Update password"}
      </button>
    </form>
  );
}
