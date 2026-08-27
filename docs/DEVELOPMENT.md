# Development Guide

This guide covers the runnable application and secure database foundations introduced by issues #3 and #4. Product meaning and trust boundaries remain authoritative in the constitution, product contract, domain model, architecture document, data-lifecycle policy, and ADRs.

Read these before changing a trust boundary:

- [`ARCHITECTURE.md`](ARCHITECTURE.md)
- [`DOMAIN_MODEL.md`](DOMAIN_MODEL.md)
- [`DATABASE.md`](DATABASE.md)
- [`DATA_LIFECYCLE.md`](DATA_LIFECYCLE.md)
- [`decisions/`](decisions/README.md)

## Toolchain contract

ManyHands pins a production LTS toolchain so contributors and CI execute the same dependency graph:

- Node.js `24.19.0`, recorded in `.nvmrc` and `.node-version`;
- pnpm `11.20.0`, recorded in the root `packageManager` field;
- Supabase CLI `2.115.0`, recorded in the root dependency graph;
- PostgreSQL `17`, recorded in `supabase/config.toml`;
- a committed `pnpm-lock.yaml` installed with `--frozen-lockfile` in CI.

Install the pinned package manager if your version manager does not activate it automatically:

```bash
npm install --global pnpm@11.20.0
```

Do not replace the project Supabase CLI with an unpinned global version in CI or review instructions.

## Prerequisites

Application-only work requires Node.js and pnpm.

Database work additionally requires Docker Desktop, Docker Engine, or a compatible Docker runtime. The local Supabase stack is isolated and disposable; it does not require access to the official hosted project.

Check the tools:

```bash
node --version
pnpm --version
docker version
pnpm exec supabase --version
```

## First application run

```bash
git clone https://github.com/samir1234khans/ManyHands.git
cd ManyHands
pnpm install --frozen-lockfile
cp apps/web/.env.example apps/web/.env.local
pnpm dev
```

Visit `http://localhost:3000`.

The only current web environment setting is optional:

```dotenv
SITE_URL=http://localhost:3000
```

`SITE_URL` is server-only and supplies the canonical metadata origin. Do not prefix server secrets with `NEXT_PUBLIC_`. Never commit `.env`, `.env.local`, access tokens, credentials, private reports, or production data.

The local public Supabase URL and publishable key will be wired into the application in issue #5. Service-role and secret keys must never enter browser code.

## First database run

```bash
pnpm db:start
pnpm db:reset
pnpm db:test
pnpm db:lint
```

Delete the local stack when finished:

```bash
pnpm db:stop
```

The local database is reconstructed from immutable migrations and the deliberately safe seed. Do not depend on mutable local rows.

## Commands

### Application and repository

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Run the Next.js development server. |
| `pnpm format` | Format application, packages, tests, and maintained configuration files. |
| `pnpm format:check` | Verify formatting without changing files. |
| `pnpm lint` | Run ESLint with zero warnings allowed. |
| `pnpm typecheck` | Type-check the application, domain policy, configuration, unit tests, and browser tests. |
| `pnpm test` | Run the fast Vitest suite. |
| `pnpm build` | Create a production Next.js build. |
| `pnpm test:e2e` | Start the existing production build and run Playwright smoke tests. |
| `pnpm verify` | Run formatting, linting, type checking, unit tests, and production build. |
| `pnpm verify:full` | Run `verify` and then the browser suite. |

### Database

| Command | Purpose |
| --- | --- |
| `pnpm db:start` | Start the isolated local Supabase database. |
| `pnpm db:reset` | Rebuild from every migration and the safe seed. |
| `pnpm db:test` | Run pgTAP schema, grant, RLS, and lifecycle tests. |
| `pnpm db:lint` | Lint PostgreSQL code in `public` and `private` and fail on warnings. |
| `pnpm db:stop` | Delete the local stack without preserving mutable state. |
| `pnpm exec supabase migration list --local` | Inspect applied local migrations. |
| `pnpm exec supabase migration new descriptive_name` | Create the next migration filename with the pinned CLI. |
| `pnpm exec supabase gen types typescript --local --schema public,private` | Generate database TypeScript types. |

Use `pnpm exec supabase <command> --help` before adding or changing a CLI invocation.

## Browser testing

Install the browser once before running Playwright locally:

```bash
pnpm exec playwright install chromium
pnpm build
pnpm test:e2e
```

The browser suite writes wide and narrow screenshots under `test-results/screenshots/`. CI uploads `test-results/` and `playwright-report/` as the `application-browser-evidence` artifact, even when a browser test fails.

## Current repository shape

```text
apps/
  web/
    src/app/                    # Route layouts, pages, route states, and global CSS
    src/lib/                    # Small application-owned configuration or helpers

packages/
  domain/
    src/authorization.ts        # Typed application capability policy and domain errors
  data/
    src/database.types.ts       # Generated PostgreSQL/Supabase types; never hand-edit

supabase/
  config.toml                   # CLI-generated local project contract
  migrations/                   # Immutable reviewed SQL migrations
  seed.sql                      # Synthetic, non-personal, secret-free seed
  tests/database/               # Transactional pgTAP schema, RLS, and lifecycle tests

tests/
  unit/                         # Fast application and policy tests
  e2e/                          # Production-server Playwright tests

docs/                           # Product, security, lifecycle, and engineering contracts
```

A package exists only when it carries a real boundary and consumer.

Current package responsibilities:

- `packages/domain` owns entities, state transitions, typed capability decisions, and domain errors. It does not import database clients or framework code.
- `packages/data` owns generated schema types and, when needed, small typed repository implementations. It may depend on domain types; domain must not depend on data.

Intended future destinations remain:

- `packages/github` for the GitHub App, webhook normalization, and sync adapters;
- `packages/ui` for accessible components shared by multiple features;
- `packages/config` only if configuration is genuinely reused beyond the root setup.

A new package must document its responsibility, public API, dependency direction, tests, and why it cannot remain application-local.

## Rendering and accessibility baseline

The public homepage is a Server Component with no client-side state. Its meaningful text and links are present in the server response and are covered by a Playwright context with JavaScript disabled.

Every route contribution must preserve:

- semantic landmarks and heading order;
- a keyboard-visible focus indicator and working skip link;
- useful link and button names;
- status that does not depend on color alone;
- readable narrow-screen reflow;
- reduced-motion behavior;
- safe, generic visitor-facing error messages.

`error.tsx` deliberately avoids rendering the error object, digest, stack, environment values, or server details. Log sensitive failures only through an approved observability boundary.

## Authorization workflow

A protected action needs all of these layers:

1. a typed capability request in `packages/domain`;
2. a server-boundary call to `requireAuthorization`;
3. validation of all untrusted input;
4. a least-privilege table/function grant;
5. an RLS policy that enforces the same ownership or scope invariant close to the data;
6. positive and negative tests;
7. safe error and structured-log behavior that does not expose private resource data.

Do not make authorization decisions from:

- a hidden button or route link;
- user-editable provider metadata;
- `NEXT_PUBLIC_` configuration;
- GitHub repository membership alone;
- scattered `isAdmin`, `isOwner`, or `isSubscribed` booleans;
- a client-provided account, project, or moderator ID.

Suspension is checked before every protected capability. Project-scoped roles do not imply global moderation.

## Migration workflow

Create each migration with the pinned CLI:

```bash
pnpm exec supabase migration new descriptive_name
```

Then implement and verify it:

```bash
pnpm db:reset
pnpm exec supabase migration list --local
pnpm db:test
pnpm db:lint
```

Once a migration reaches `main`, it is immutable. Fix later problems with a new migration and regression test. Do not rename, reorder, edit, or delete merged migration files.

Schema changes and generated database types must be reviewed together.

## Seed policy

`supabase/seed.sql` currently contains no records.

Future seeds must be:

- visibly synthetic;
- deterministic and safe to reset;
- free of personal data and copied production identifiers;
- free of tokens, passwords, JWTs, provider secrets, and service-role keys;
- free of schema changes that belong in migrations.

Destructive test fixtures belong inside transactional database tests, not a shared seed.

## Data lifecycle

Before adding an optional field or durable entity, document:

- why it is needed;
- visibility and default visibility;
- create/read/update/delete capabilities;
- suspension behavior;
- account-deletion behavior;
- retention and export behavior;
- logging, search, analytics, notification, backup, and third-party effects;
- matching allowed and denied tests.

See [`DATA_LIFECYCLE.md`](DATA_LIFECYCLE.md).

## CI behavior

### Application CI

`Application CI` runs on pull requests and pushes to `main` with read-only repository contents permission. It:

1. installs the pinned Node and pnpm versions;
2. performs a frozen-lockfile installation;
3. checks formatting and linting;
4. type-checks all maintained TypeScript;
5. runs unit and authorization-policy tests;
6. builds the production application;
7. installs Chromium;
8. starts the production server and runs browser smoke tests;
9. uploads the browser report, traces on retry, failures, and viewport screenshots.

### Database CI

`Database CI` also uses read-only repository permission and no production secrets. It:

1. installs the pinned dependency graph and Supabase CLI;
2. starts an isolated local database;
3. resets from immutable migrations and the safe seed;
4. validates migration history;
5. runs pgTAP schema, grants, RLS, suspension, and deletion tests;
6. lints the `public` and `private` schemas and fails on warnings;
7. regenerates TypeScript database types and checks drift;
8. uploads database evidence;
9. deletes the isolated stack even after failure.

### Repository health

`Repository health` checks required contracts, runtime pins, licensing, secret hygiene, YAML syntax, taxonomy integrity, database foundation files, and whitespace.

No pull-request job receives application or production database secrets. Future workflows must request write permissions explicitly and narrowly.

## Dependency policy

Keep runtime dependencies unusually small. Before adding one, confirm:

- the problem cannot be solved clearly with the existing platform;
- maintenance and release activity are healthy;
- the license is compatible with AGPL distribution;
- browser and server bundle cost is understood;
- install scripts and native binaries are justified;
- the dependency does not blur a documented trust boundary.

The Supabase CLI is development-only, pinned, locked, and used to reproduce the reviewed database contract. It is not shipped in the browser application.

Dependabot monitors both GitHub Actions and the pnpm workspace.

## Troubleshooting

### Wrong Node, pnpm, or Supabase version

```bash
node --version
pnpm --version
pnpm exec supabase --version
```

Use the versions recorded at the repository root. Reinstall dependencies after changing Node or pnpm.

### Frozen lockfile failure

Do not bypass the check in a pull request. Run `pnpm install`, inspect why the lockfile changed, and commit the reviewed lockfile with the related manifest change.

### Docker unavailable

```bash
docker version
```

Start Docker and retry `pnpm db:start`.

### Supabase local ports already used

Inspect `supabase/config.toml`, identify the conflicting process, and stop it. Do not change the committed port contract casually.

### Database reset failure

Read the first failing migration. If that migration is already merged, add a corrective migration; never edit history. Reproduce from `pnpm db:stop`, `pnpm db:start`, and `pnpm db:reset`.

### An update returns zero rows

Check:

1. the application capability decision;
2. table and column grants;
3. the RLS `SELECT`, `USING`, and `WITH CHECK` policies.

An RLS-protected PostgreSQL update requires a matching select path.

### Database type drift

Reset from scratch and regenerate with the pinned CLI. Inspect migrations and exposed schemas. Never hand-edit the generated file to match an assumption.

### Browser executable missing

```bash
pnpm exec playwright install chromium
```

On Linux CI or a fresh Linux machine, `--with-deps` can install required system libraries.

### Stale Next.js output

```bash
rm -rf apps/web/.next
pnpm build
```

Never commit `.next`, Supabase local runtime state, browser reports, test results, environment files, logs, or TypeScript build-info files.
