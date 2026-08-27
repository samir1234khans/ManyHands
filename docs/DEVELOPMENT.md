# Development Guide

This guide covers the runnable application foundation introduced by issue #3. Product meaning and trust boundaries remain authoritative in the constitution, product contract, domain model, architecture document, and ADRs.

## Toolchain contract

ManyHands pins a production LTS toolchain so contributors and CI execute the same dependency graph:

- Node.js `24.19.0`, recorded in `.nvmrc` and `.node-version`;
- pnpm `11.20.0`, recorded in the root `packageManager` field;
- a committed `pnpm-lock.yaml` installed with `--frozen-lockfile` in CI.

Install the pinned package manager if your version manager does not activate it automatically:

```bash
npm install --global pnpm@11.20.0
```

## First local run

```bash
git clone https://github.com/samir1234khans/ManyHands.git
cd ManyHands
pnpm install --frozen-lockfile
cp apps/web/.env.example apps/web/.env.local
pnpm dev
```

Visit `http://localhost:3000`.

The only current environment setting is optional:

```dotenv
SITE_URL=http://localhost:3000
```

`SITE_URL` is server-only and supplies the canonical metadata origin. Do not prefix server secrets with `NEXT_PUBLIC_`. Never commit `.env`, `.env.local`, access tokens, credentials, private reports, or production data.

## Commands

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Run the Next.js development server. |
| `pnpm format` | Format the application and actively maintained configuration files. |
| `pnpm format:check` | Verify formatting without changing files. |
| `pnpm lint` | Run ESLint with zero warnings allowed. |
| `pnpm typecheck` | Type-check application, configuration, unit, and browser-test TypeScript. |
| `pnpm test` | Run the fast Vitest suite. |
| `pnpm build` | Create a production Next.js build. |
| `pnpm test:e2e` | Start the existing production build and run Playwright smoke tests. |
| `pnpm verify` | Run formatting, linting, type checking, unit tests, and production build. |
| `pnpm verify:full` | Run `verify` and then the browser suite. |

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
    src/app/              # Route layouts, pages, route states, and global CSS
    src/lib/              # Small application-owned configuration or helpers

tests/
  unit/                   # Fast tests that do not require a browser
  e2e/                    # Production-server Playwright tests

docs/                     # Product and engineering contracts
```

The repository does not contain empty `packages/` placeholders. Create a shared package only when at least one real consumer and a meaningful boundary exist.

When roadmap work needs them, the intended destinations are:

- `packages/domain` for entities, state transitions, capability policies, and domain errors;
- `packages/data` for typed database access and repositories;
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

`error.tsx` deliberately avoids rendering the error object, digest, stack, environment values, or server details. Log sensitive failures only through a later approved observability boundary.

## CI behavior

`Application CI` runs on pull requests and pushes to `main` with read-only repository contents permission. It:

1. installs the pinned Node and pnpm versions;
2. performs a frozen-lockfile installation;
3. checks formatting and linting;
4. type-checks all maintained TypeScript;
5. runs unit tests;
6. builds the production application;
7. installs Chromium;
8. starts the production server and runs browser smoke tests;
9. uploads the browser report, traces on retry, failures, and viewport screenshots.

No pull-request job receives application secrets. Future workflows must request write permissions explicitly and narrowly.

## Dependency policy

Keep runtime dependencies unusually small. Before adding one, confirm:

- the problem cannot be solved clearly with the existing platform;
- maintenance and release activity are healthy;
- the license is compatible with AGPL distribution;
- browser and server bundle cost is understood;
- install scripts and native binaries are justified;
- the dependency does not blur a documented trust boundary.

Dependabot monitors both GitHub Actions and the pnpm workspace after the lockfile exists.

## Troubleshooting

### Wrong Node or pnpm version

```bash
node --version
pnpm --version
```

Use the versions recorded at the repository root. Reinstall dependencies after changing either tool.

### Frozen lockfile failure

Do not bypass the check in a pull request. Run `pnpm install`, inspect why the lockfile changed, and commit the reviewed lockfile with the related manifest change.

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

Never commit `.next`, browser reports, test results, environment files, logs, or TypeScript build-info files.
