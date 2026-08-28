import type { PublicProfileDirectoryRow } from "@manyhands/data";

import { siteConfig } from "../site-config";

export const PUBLIC_EXPORT_SCHEMA_VERSION = "2026-08-01" as const;

function normalizeRevision(candidate: string | undefined): string | null {
  const value = candidate?.trim().toLowerCase();
  return value && /^[0-9a-f]{40}$/.test(value) ? value : null;
}

function normalizeProfile(row: PublicProfileDirectoryRow) {
  if (!row.account_id || !row.display_name || !row.handle || !row.availability) {
    return null;
  }

  return {
    account_id: row.account_id,
    handle: row.handle,
    display_name: row.display_name,
    biography: row.biography,
    availability: row.availability,
    skills: row.skills ?? [],
    non_code_roles: row.non_code_roles ?? [],
    interests: row.interests ?? [],
    languages: row.languages ?? [],
    timezone: row.timezone,
    public_links: row.public_links ?? [],
    updated_at: row.updated_at,
  };
}

export function buildPublicExport(
  profileRows: readonly PublicProfileDirectoryRow[],
  generatedAt: string,
  revision = process.env.VERCEL_GIT_COMMIT_SHA,
) {
  const contributors = profileRows
    .flatMap((row) => {
      const normalized = normalizeProfile(row);
      return normalized ? [normalized] : [];
    })
    .sort((left, right) => left.handle.localeCompare(right.handle));

  return {
    schema_version: PUBLIC_EXPORT_SCHEMA_VERSION,
    generated_at: generatedAt,
    source: {
      repository: siteConfig.repositoryUrl,
      license: siteConfig.licenseName,
      license_url: siteConfig.licenseUrl,
      revision: normalizeRevision(revision),
    },
    data: {
      contributors,
    },
  } as const;
}
