import "server-only";

import type { Database } from "@manyhands/data";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { requirePublicSupabaseConfig } from "@/lib/env";

export async function createServerSupabaseClient() {
  const { publishableKey, url } = requirePublicSupabaseConfig();
  const cookieStore = await cookies();

  return createServerClient<Database>(url, publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet, _headers) {
        try {
          cookiesToSet.forEach(({ name, options, value }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Components cannot write cookies. The root Proxy refreshes
          // and returns session cookies before protected components render.
        }
      },
    },
  });
}

export type ServerSupabaseClient = Awaited<ReturnType<typeof createServerSupabaseClient>>;
