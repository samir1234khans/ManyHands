"use server";

import type { Route } from "next";
import { redirect } from "next/navigation";

import { getCurrentAccountContext } from "@/lib/auth/current-account";
import { logIdentityEvent } from "@/lib/auth/events";
import { isRecentSignIn } from "@/lib/auth/recent-sign-in";
import { createSignInPath } from "@/lib/auth/return-path";
import { getServerSupabaseSecret } from "@/lib/env";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

function settingsError(reason: string): never {
  redirect(`/settings?error=${encodeURIComponent(reason)}` as Route);
}

export async function deleteAccountAction(formData: FormData): Promise<never> {
  const confirmation = formData.get("confirmation");
  if (confirmation !== "DELETE") {
    settingsError("confirmation");
  }

  const context = await getCurrentAccountContext();
  if (!context) {
    redirect(createSignInPath("/settings", "account"));
  }

  if (context.status !== "active") {
    settingsError("account_inactive");
  }

  if (!isRecentSignIn(context.user.last_sign_in_at)) {
    settingsError("recent_authentication_required");
  }

  if (!getServerSupabaseSecret()) {
    settingsError("administration_unavailable");
  }

  const { error: requestError } = await context.supabase.rpc("request_account_deletion");
  if (requestError) {
    logIdentityEvent({
      name: "account_deletion",
      outcome: "failed",
      reason: "request_lock",
      route: "/settings",
    });
    settingsError("deletion_request_failed");
  }

  const admin = createAdminSupabaseClient();
  const { error: deletionError } = await admin.auth.admin.deleteUser(context.user.id);

  if (deletionError) {
    await admin.rpc("restore_failed_account_deletion", {
      target_auth_user_id: context.user.id,
    });
    logIdentityEvent({
      name: "account_deletion",
      outcome: "failed",
      reason: "auth_delete",
      route: "/settings",
    });
    settingsError("deletion_failed_compensated");
  }

  await context.supabase.auth.signOut({ scope: "local" });
  logIdentityEvent({ name: "account_deletion", outcome: "completed", route: "/settings" });
  redirect("/?account=deleted");
}
