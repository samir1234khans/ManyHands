"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { logIdentityEvent } from "@/lib/auth/events";
import { getPublicSupabaseConfig } from "@/lib/env";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function signOutAction(): Promise<never> {
  if (getPublicSupabaseConfig()) {
    const supabase = await createServerSupabaseClient();
    await supabase.auth.signOut({ scope: "local" });
  }

  logIdentityEvent({ name: "sign_out", outcome: "completed", route: "/auth/sign-out" });
  revalidatePath("/", "layout");
  redirect("/");
}
