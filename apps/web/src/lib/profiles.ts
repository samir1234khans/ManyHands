import "server-only";

import type {
  ContributorProfileRow,
  PublicProfileDirectoryRow,
  ServerSupabaseClient,
} from "@manyhands/data";

import { parseStoredPublicLinks, type PublicProfileLink } from "./auth/profile-input";
import { getPublicSupabaseConfig } from "./env";
import { createServerSupabaseClient } from "./supabase/server";

export interface PublicContributorProfile {
  readonly accountId: string;
  readonly availability: "unavailable" | "limited" | "open";
  readonly biography: string | null;
  readonly displayName: string;
  readonly handle: string;
  readonly interests: readonly string[];
  readonly languages: readonly string[];
  readonly nonCodeRoles: readonly string[];
  readonly publicLinks: readonly PublicProfileLink[];
  readonly skills: readonly string[];
  readonly timezone: string | null;
  readonly updatedAt: string | null;
}

export interface PublicProfileListResult {
  readonly configured: boolean;
  readonly profiles: readonly PublicContributorProfile[];
}

function normalizePublicProfile(
  row: PublicProfileDirectoryRow,
): PublicContributorProfile | null {
  if (!row.account_id || !row.handle || !row.display_name || !row.availability) {
    return null;
  }

  return {
    accountId: row.account_id,
    availability: row.availability,
    biography: row.biography,
    displayName: row.display_name,
    handle: row.handle,
    interests: row.interests ?? [],
    languages: row.languages ?? [],
    nonCodeRoles: row.non_code_roles ?? [],
    publicLinks: parseStoredPublicLinks(row.public_links),
    skills: row.skills ?? [],
    timezone: row.timezone,
    updatedAt: row.updated_at,
  };
}

export async function listPublicProfiles(): Promise<PublicProfileListResult> {
  if (!getPublicSupabaseConfig()) {
    return { configured: false, profiles: [] };
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("profile_directory")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(60);

  if (error) {
    return { configured: true, profiles: [] };
  }

  return {
    configured: true,
    profiles: (data ?? []).flatMap((row) => {
      const profile = normalizePublicProfile(row);
      return profile ? [profile] : [];
    }),
  };
}

export async function getPublicProfileByHandle(
  handle: string,
): Promise<PublicContributorProfile | null> {
  if (!getPublicSupabaseConfig()) {
    return null;
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("profile_directory")
    .select("*")
    .eq("handle", handle.toLowerCase())
    .maybeSingle();

  return error || !data ? null : normalizePublicProfile(data);
}

export async function getOwnContributorProfile(
  supabase: ServerSupabaseClient,
  accountId: string,
): Promise<ContributorProfileRow | null> {
  const { data, error } = await supabase
    .from("contributor_profiles")
    .select("*")
    .eq("account_id", accountId)
    .maybeSingle();

  return error ? null : data;
}
