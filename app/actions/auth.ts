"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";

// ─────────────────────────────────────────────────────────────────────────────
// All server actions take FormData (so they can be used with React 19's
// progressive form enhancement). They return either { error } objects (so the
// client can render an alert) or call redirect() on success.
// ─────────────────────────────────────────────────────────────────────────────

export type AuthState = { error?: string; message?: string };

function getOrigin() {
  return headers().then((h) => {
    const proto = h.get("x-forwarded-proto") ?? "http";
    const host = h.get("host") ?? "localhost:3100";
    return `${proto}://${host}`;
  });
}

export async function signUp(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const company = String(formData.get("company") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();

  if (!email || !password) return { error: "Email and password are required." };
  if (password.length < 8) return { error: "Password must be at least 8 characters." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Please enter a valid email address." };
  }

  const supabase = await createClient();
  const origin = await getOrigin();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/confirm`,
      data: {
        full_name: name || undefined,
        company: company || undefined,
        phone: phone || undefined,
      },
    },
  });

  if (error) {
    // Common case: "User already registered"
    return { error: error.message };
  }

  // Insert/upsert the profile row with status='pending' — admin must approve before access.
  if (data.user) {
    await supabase.from("profiles").upsert(
      {
        id: data.user.id,
        email,
        full_name: name || null,
        company: company || null,
        phone: phone || null,
        status: "pending",
      },
      { onConflict: "id" }
    );
  }

  return {
    message:
      "Account created. Check your inbox to confirm your email — once confirmed, our team will review your access request within one business day.",
  };
}

export async function signIn(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) return { error: "Email and password are required." };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: "Incorrect email or password." };
  }

  revalidatePath("/", "layout");
  redirect("/library");
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}

export async function requestPasswordReset(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!email) return { error: "Email is required." };

  const supabase = await createClient();
  const origin = await getOrigin();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/reset-password`,
  });
  if (error) return { error: "Could not send reset link. Try again later." };
  return {
    message:
      "If an account exists with that email, a password reset link has been sent. Check your inbox.",
  };
}

export async function updatePassword(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");
  if (password.length < 8)
    return { error: "Password must be at least 8 characters." };
  if (password !== confirm) return { error: "Passwords do not match." };

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  redirect("/library");
}
