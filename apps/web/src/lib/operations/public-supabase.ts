import "server-only";

import type { Database } from "@manyhands/data";
import { createClient } from "@supabase/supabase-js";

import { getPublicSupabaseConfig } from "../env";

export function createPublicOperationsClient() {
  const config = getPublicSupabaseConfig();

  if (!config) {
    return null;
  }

  return createClient<Database>(config.url, config.publishableKey, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
  });
}
