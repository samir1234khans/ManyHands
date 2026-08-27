# Database Development and Security

This document is the operating contract for the ManyHands PostgreSQL/Supabase foundation introduced by issue #4. It explains how to run the database locally, how schema changes are reviewed, where authorization belongs, and how private data remains separate from public read models.

Product meaning remains authoritative in [`DOMAIN_MODEL.md`](DOMAIN_MODEL.md). The broader system boundary remains authoritative in [`ARCHITECTURE.md`](ARCHITECTURE.md).

## Goals

The database foundation must make these properties routine rather than heroic:

- a fresh checkout can build an isolated local database from zero;
- every merged migration is immutable and reproducible;
- public data access is explicit rather than inherited from old defaults;
- Row Level Security denies protected access unless a reviewed policy allows it;
- application authorization remains centralized and independently testable;
- generated TypeScript types represent the reviewed schema;
- destructive tests cannot touch a shared or production database;
- seed data contains no secrets or personal data;
- account suspension and deletion preserve attribution without preserving optional personal data.

## Toolchain

The root dependency graph pins:

- Node.js `24.19.0`;
- pnpm `11.20.0`;
- Supabase CLI `2.115.0`;
- PostgreSQL `17` through the generated local Supabase configuration.

The Supabase CLI is a reviewed development dependency. Do not replace it with an unpinned global version in CI.

## Prerequisites

Local database development requires:

1. the pinned Node.js and pnpm versions;
2. Docker Desktop, Docker Engine, or another Docker-compatible runtime;
3. enough local disk space for the Supabase service images;
4. the ports declared in `supabase/config.toml` to be available.

No hosted Supabase project, production key, service-role key, or OAuth provider is required to run the local database tests.

## First local database run

From the repository root:

```bash
pnpm install --frozen-lockfile
pnpm db:start
pnpm db:reset
pnpm db:test
pnpm db:lint
```

Stop and remove the isolated stack when finished:

```bash
pnpm db:stop
```

`db:stop` uses `--no-backup`. Local state is disposable by design; the migrations and safe seed are the reproducible source of truth.

## Database commands

| Command | Purpose |
| --- | --- |
| `pnpm db:start` | Start the local Supabase database services. |
| `pnpm db:reset` | Recreate the database and apply every migration followed by the safe seed. |
| `pnpm db:test` | Run the pgTAP database and RLS suites. |
| `pnpm db:lint` | Run PostgreSQL linting for the `public` and `private` schemas and fail on warnings. |
| `pnpm db:stop` | Delete the local stack without preserving mutable local state. |
| `pnpm exec supabase migration list --local` | Inspect local migration history. |
| `pnpm exec supabase gen types typescript --local --schema public,private` | Generate TypeScript types from the current local schema. |

Use `pnpm exec supabase <command> --help` before introducing a new CLI command or option. The CLI contract evolves and should not be guessed from memory.

## Repository shape

```text
packages/
  domain/
    src/authorization.ts           # Central application capability policy
  data/
    src/database.types.ts          # Generated schema types; do not hand-edit
supabase/
  config.toml                      # CLI-generated local project configuration
  migrations/
    *_descriptive_name.sql         # Immutable reviewed migrations
  seed.sql                         # Synthetic, non-personal, secret-free seed
  tests/database/
    *_schema.test.sql              # Schema, grant, and policy assertions
    *_rls.test.sql                 # Allowed and denied actor paths
.github/workflows/
  database-ci.yml                  # Isolated clean-database verification
```

A directory is added only when it carries real implementation. Empty architecture placeholders are not useful boundaries.

## Schema boundaries

### `auth`

Supabase Auth owns authentication identities and sessions. ManyHands does not add product authorization fields to user-editable authentication metadata.

An authentication identity answers **who signed in**. It does not answer **what that person may do**.

### `private`

`private` contains internal identity and lifecycle records plus narrowly scoped authorization helpers. It is not listed as a Data API schema.

Current private data includes:

- stable internal account identifiers;
- the detachable reference to `auth.users`;
- global account status;
- suspension, deletion-request, and anonymization timestamps;
- a bounded internal suspension reason.

Client roles have no direct table privileges on `private.accounts`.

### `public`

`public` contains product data that may need Data API access. A table being in `public` does **not** make every row public.

Every public table must:

1. receive explicit grants for only the required operations;
2. enable Row Level Security;
3. add both positive and negative policy tests;
4. avoid private email, OAuth records, tokens, reports, moderator notes, abuse signals, and security telemetry;
5. expose signed-out data through a deliberately reviewed read model.

The initial `public.contributor_profiles` table stores only user-chosen profile information. `public.profile_directory` is a `security_invoker` view restricted to explicitly public profiles.

## Stable internal identity

ManyHands uses a stable internal account identifier rather than using `auth.users.id` as the permanent attribution key everywhere.

This allows the external authentication identity to be detached during deletion while project history can continue to reference a neutral former-contributor record.

The lifecycle trigger performs these operations when an authentication identity is deleted:

- clears the `auth_user_id` link;
- changes account status to `anonymized`;
- records the anonymization timestamp;
- replaces the public label with `Former contributor`;
- removes biography, avatar, skills, interests, languages, timezone, availability, and public links;
- preserves the stable account and profile row for historical attribution.

This foundation does not claim that every future domain table should retain data forever. Each future table must define its own deletion and retention behavior before it is added.

## Account status

The initial account statuses are:

- `active` — protected writes may be considered by application policy and RLS;
- `suspended` — attribution and permitted reads remain, but protected writes are denied;
- `deletion_requested` — lifecycle processing has been requested and privileged writes are denied;
- `anonymized` — authentication identity and optional profile data have been removed while neutral attribution remains.

Project membership never changes global account status. Repository permissions never imply a ManyHands account capability.

## Grants and Row Level Security

Grants and RLS solve different problems:

- a grant determines whether a role may attempt an operation on an object;
- an RLS policy determines which rows that role may affect after the operation is available.

Both layers are required.

The migration revokes legacy implicit access and grants only the required surface:

- `anon` can select profile rows that RLS marks public;
- `authenticated` can select rows allowed by public, member, or owner policies;
- `authenticated` can update only approved profile columns;
- no client role can reassign `account_id`;
- no client role can insert or delete a profile directly;
- no client role can select the private account table directly;
- `service_role` retains server-only maintenance access and must never enter a browser bundle.

An interface hiding an action is a usability choice, not a security boundary. Every protected server action must call the application authorization policy and then rely on RLS as defense in depth.

## Application authorization

`packages/domain/src/authorization.ts` answers capability questions through typed requests such as:

```ts
decideAuthorization(principal, {
  capability: "profile.update",
  resource: profile,
});
```

The policy currently proves these invariants:

- public profile reading does not require an account;
- private profile reading is owner-only;
- profile updates require an active owner;
- suspended accounts cannot perform protected writes;
- project updates require a steward or maintainer role for the exact project;
- a project-scoped moderator is not a global moderator;
- private report access requires an active global moderator.

Server boundaries should use `requireAuthorization` and handle `AuthorizationError` without exposing private resource existence or policy internals to visitors.

Do not scatter `isAdmin`, `isOwner`, or `isSubscribed` checks through UI components.

## Migration workflow

### Create a migration

Always let the pinned CLI create the filename:

```bash
pnpm exec supabase migration new descriptive_name
```

Then edit only the new migration.

### Verify a migration

```bash
pnpm db:start
pnpm db:reset
pnpm exec supabase migration list --local
pnpm db:test
pnpm db:lint
```

A migration is not complete until it applies to an empty database and its denied paths are tested.

### After merge

A migration merged into `main` is immutable. Never edit, rename, reorder, or delete it to fix a later problem. Add a corrective migration instead.

This rule preserves reproducible installs and makes production history auditable.

## Function security

Database functions require explicit review because they can accidentally bypass RLS.

Rules:

- prefer invoker behavior;
- keep privileged helpers outside exposed schemas;
- set an empty or explicitly safe `search_path`;
- revoke default `PUBLIC` execution;
- grant execution only to roles that need it;
- never accept a caller-selected account identifier when `auth.uid()` can establish identity;
- never add `SECURITY DEFINER` merely to make a permission error disappear;
- add negative tests for every privileged function.

The two current-account helpers are intentionally narrow `SECURITY DEFINER` functions. They live in `private`, accept no arguments, use an empty `search_path`, and return only the current internal account identifier. Their execution grants are explicit.

## Database tests

Database tests live under `supabase/tests/database` and run inside transactions that roll back.

The initial suites cover:

- schema and enum existence;
- RLS enabled and forced;
- direct table and column grants;
- exclusion of private identity fields from public read models;
- `security_invoker` view behavior;
- authentication-to-account provisioning;
- anonymous, signed-in owner, and cross-user reads;
- owner updates and cross-user update denial;
- project-scoped versus global authorization policy;
- suspended-user write denial;
- account deletion and profile anonymization;
- preservation of neutral attribution.

A test that proves an allowed path without proving the matching denied path is incomplete for protected data.

## Seed policy

`supabase/seed.sql` is deliberately empty at this stage.

Seed data must never contain:

- real names, emails, phone numbers, profile text, or OAuth identifiers;
- production UUIDs copied from logs or screenshots;
- API keys, JWTs, provider secrets, service-role keys, or webhook secrets;
- moderator notes, reports, abuse signals, or customer content;
- schema changes that belong in a migration.

Future development fixtures must be visibly synthetic and reproducible.

## Generated types and drift

The database schema generates `packages/data/src/database.types.ts`. That file is evidence of the reviewed schema, not a hand-maintained model.

Database CI regenerates the types from a clean local database. A difference between generated output and the committed file is schema drift and must fail the pull request.

When a reviewed migration intentionally changes the schema:

1. reset the local database;
2. regenerate types with the pinned CLI;
3. inspect the diff for unexpected private or public fields;
4. commit the migration and generated type change together;
5. rerun all database and application checks.

## Database CI

`Database CI` uses a disposable GitHub-hosted runner and performs this sequence:

1. installs the pinned dependency graph;
2. starts the isolated local Supabase database;
3. resets from every immutable migration and the safe seed;
4. verifies local migration history;
5. runs pgTAP database and RLS tests;
6. lints the `public` and `private` schemas and fails on warnings;
7. generates TypeScript types and checks drift;
8. uploads database evidence;
9. deletes the local stack even after failure.

The workflow receives no production database URL or application secret.

## Production boundary

Issue #4 creates a portable local foundation. It does not provision or mutate the official hosted Supabase project.

Before a hosted project is connected:

- environment naming and secret ownership must be documented;
- preview and production projects must be separated;
- migration promotion and rollback procedures must be reviewed;
- backups, restore drills, observability, and export remain tracked in issue #16;
- GitHub OAuth setup and application sessions remain tracked in issue #5;
- service-role usage must stay in server-only code with a narrow operational purpose.

## Troubleshooting

### Docker is unavailable

```bash
docker version
```

Start the Docker runtime and retry `pnpm db:start`.

### Ports are already in use

Inspect the port values in `supabase/config.toml`. Stop the conflicting local service rather than changing committed ports casually; all contributors and CI should share a predictable local contract.

### A migration fails after being merged

Do not edit the merged file. Create a corrective migration with `supabase migration new`, reproduce the failure from a clean reset, and add a regression test.

### An update affects zero rows

Check all three layers:

1. the application capability decision;
2. the table and column grant;
3. the RLS `SELECT`, `USING`, and `WITH CHECK` policies.

A PostgreSQL RLS update also requires the row to be selectable.

### Generated types changed unexpectedly

Reset from scratch and regenerate again. If the difference remains, inspect migration history and the exposed schema list before accepting it. Never edit the generated file to silence drift.

### A test needs production-like data

Create the smallest synthetic fixture inside the transactional test. Do not copy production data into a local seed or CI artifact.
