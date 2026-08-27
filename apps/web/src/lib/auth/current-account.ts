import "server-only";

import {
  accountStatuses,
  createAccountPrincipal,
  type AccountPrincipal,
  type AccountStatus,
} from "@manyhands/domain";
import type { User } from "@supabase/supabase-js";

import { getPublicSupabaseConfig } from "@/lib/env";
import {
  createServerSupabaseClient,
  type ServerSupabaseClient,
} from "@/lib/supabase/server";

export interface CurrentAccountContext {
  readonly accountId: string;
  readonly principal: AccountPrincipal;
  readonly status: AccountStatus;
  readonly supabase: ServerSupabaseClient;
  readonly user: User;
}

function isAccountStatus(value: unknown): value is AccountStatus {
  return typeof value === "string" && accountStatuses.includes(value as AccountStatus);
}

export async function getCurrentAccountContext(): Promise<CurrentAccountContext | null> {
  if (!getPublicSupabaseConfig()) {
    return null;
  }

  const supabase = await createServerSupabaseClient();
  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();
  const subject = claimsData?.claims?.sub;

  if (claimsError || typeof subject !== "string") {
    return null;
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user || user.id !== subject) {
    return null;
  }

  const { data: accountRows, error: accountError } = await supabase.rpc(
    "current_account_context",
  );
  const account = accountRows?.[0];

  if (
    accountError ||
    !account ||
    typeof account.account_id !== "string" ||
    !isAccountStatus(account.status)
  ) {
    return null;
  }

  return {
    accountId: account.account_id,
    principal: createAccountPrincipal({ accountId: account.account_id, status: account.status }),
    status: account.status,
    supabase,
    user,
  };
}
