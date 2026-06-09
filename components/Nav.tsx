// Nav — server component wrapper.
// Fetches the current user + profile from Supabase (server-side, no flash),
// then passes auth state down to the client-side NavClient which handles
// scroll, drawer, and all interactive behaviour.

import { createClient } from "@/utils/supabase/server";
import { NavClient } from "@/components/NavClient";

export async function Nav() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let userName: string | null = null;
  let isAdmin = false;

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, role")
      .eq("id", user.id)
      .single();

    // Display first name if available, otherwise email prefix
    const fullName = profile?.full_name ?? null;
    userName = fullName
      ? fullName.split(" ")[0]
      : (user.email?.split("@")[0] ?? "Account");

    isAdmin = profile?.role === "admin";
  }

  return <NavClient userName={userName} isAdmin={isAdmin} />;
}
