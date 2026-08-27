import "server-only";

import type { Database } from "@manyhands/data";
import { createClient } from "@supabase/supabase-js";

import {
  ApplicationConfigurationError,
  getServerSupabaseSecret,
  requirePublicSupabaseConfig,
} from "../env";

export function createAdminSupabaseClient() {
  const { url } = requirePublicSupabaseConfig();
  const secret = getServerSupabaseSecret();

  if (!secret) {
    throw new ApplicationConfigurationError(
      "A server-only Supabase secret is required for account administration.",
    );
  }

  return createClient<Database>(url, secret, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
  });
}
