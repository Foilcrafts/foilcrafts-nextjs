"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";

// Defence-in-depth: re-check the caller is admin inside each action.
// Middleware also blocks non-admins from reaching the /admin pages.
async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "admin") throw new Error("Forbidden");
  return supabase;
}

export async function approveUser(formData: FormData): Promise<void> {
  const userId = String(formData.get("userId") ?? "");
  if (!userId) return;
  const supabase = await requireAdmin();
  await supabase
    .from("profiles")
    .update({ status: "approved", approved_at: new Date().toISOString() })
    .eq("id", userId);
  revalidatePath("/admin");
}

export async function rejectUser(formData: FormData): Promise<void> {
  const userId = String(formData.get("userId") ?? "");
  if (!userId) return;
  const supabase = await requireAdmin();
  await supabase
    .from("profiles")
    .update({ status: "rejected" })
    .eq("id", userId);
  revalidatePath("/admin");
}

export async function revokeUser(formData: FormData): Promise<void> {
  const userId = String(formData.get("userId") ?? "");
  if (!userId) return;
  const supabase = await requireAdmin();
  await supabase
    .from("profiles")
    .update({ status: "pending", approved_at: null })
    .eq("id", userId);
  revalidatePath("/admin");
}
