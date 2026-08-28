# Public export contract

`GET /api/export/public` is the portable export of data already intended for anonymous public reading.

## Version

Current schema version: `2026-08-01`.

Schema versions are explicit because public export is an interoperability contract. Additive compatible fields can keep the current version; removing, renaming, or changing the meaning of fields requires a new version and migration notes.

## Current data

The first source-verified export contains public contributor profiles from `public.profile_directory`, sorted by handle. Private and members-only profiles never enter the export because the route reads the privacy-safe public view rather than internal tables.

After the Problem directory is merged, the export should add public Problems through its privacy-safe public read model in a reviewed follow-up rather than bypassing domain permissions.

## Never export through this route

- authentication identities or provider records;
- email addresses;
- OAuth or GitHub App tokens;
- service-role or deployment credentials;
- private/member-only profile fields;
- private need-signal context;
- reports, moderation notes, abuse signals, IP data, or security telemetry;
- data removed by public visibility or moderation policy.

## Failure behavior

If public database access is unconfigured or unavailable, the route returns `503` with a minimal source/license envelope and reason code. It does not return an empty successful dataset that could be mistaken for authoritative export evidence.

Responses use `Cache-Control: no-store` while the contract is pre-release. The response exposes a bounded request ID for operational correlation but no raw provider error.

## Provenance

Successful exports include:

- schema version;
- generation time;
- repository URL;
- license and license URL;
- deployment revision when a valid 40-character Git commit is supplied by the deployment environment.
