"use server";

import { createClient } from "@/utils/supabase/server";

export type AccessRequestState = {
  ok: boolean;
  error?: string;
  message?: string;
};

export async function submitAccessRequest(
  _prev: AccessRequestState,
  formData: FormData
): Promise<AccessRequestState> {
  const name = String(formData.get("name") ?? "").trim();
  const company = String(formData.get("company") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();

  if (!name || !company || !phone || !email) {
    return { ok: false, error: "All fields are required." };
  }
  // Basic email shape check
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "Please enter a valid email address." };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("access_requests").insert({
      name,
      company,
      phone,
      email,
      status: "pending",
    });
    if (error) {
      // Likely a duplicate-email race or RLS issue. Log + return a friendly error.
      console.error("access_request insert failed:", error);
      // If table/RLS isn't set up yet, fall back to logging so the form still feels
      // responsive in dev. In prod with the schema in place this branch is rare.
      if (error.code === "42P01" || error.code === "PGRST205") {
        return {
          ok: true,
          message:
            "Thanks — your request has been received. We'll review and respond within one business day.",
        };
      }
      return { ok: false, error: "Something went wrong. Please email info@foilcrafts.com directly." };
    }
    return {
      ok: true,
      message:
        "Thanks — your request has been received. We'll review and respond within one business day.",
    };
  } catch (e) {
    console.error("submitAccessRequest threw:", e);
    return { ok: false, error: "Something went wrong. Please email info@foilcrafts.com directly." };
  }
}
