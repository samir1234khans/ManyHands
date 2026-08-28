# ManyHands

> **Big problems. Built together.**

ManyHands is a **problem-first community for creating ambitious open-source software**. It helps people gather around a shared need, form a team, make progress visible, and move contribution work into GitHub without trying to replace GitHub.

The idea is simple:

> Here is a problem people care about. Here is what is already being built. Here is what the project needs next. Here is how you can help.

## Status

ManyHands is **pre-alpha**. The contributor-ready repository and production-shaped application shell are complete. The source also contains the first secure PostgreSQL/Supabase foundation: reproducible local migrations, stable internal accounts, privacy-safe contributor profiles, explicit grants, Row Level Security, lifecycle/anonymization tests, typed application authorization, generated schema types, and isolated database CI.

GitHub sign-in, public contributor profiles, profile editing, and account lifecycle experiences are visible as active work in [draft PR #35](../../pull/35) for [issue #5](../../issues/5). Consult [`AGENTS.md`](AGENTS.md) and the issue handoff before joining that branch. The remaining GitHub administrator controls are tracked transparently in [issue #18](../../issues/18) and should be completed before broad contributor launch.

This repository is also the first project ManyHands will coordinate. **ManyHands will build ManyHands.**

## Why this exists

Large open-source projects often fail before the code becomes the hard part. People cannot easily find one another, understand the current state, see where help is needed, or tell whether a project is alive.

GitHub is excellent at hosting code and reviewing changes. ManyHands is the missing coordination layer around it:

- start with a real problem, not an empty repository;
- show multiple possible projects or solutions under that problem;
- publish milestones, evidence, health, and current needs;
- match willing contributors to clear ways of helping;
- hand code, issues, and pull requests to GitHub;
- make stalled projects honest and transferable instead of quietly abandoned.

## The core loop

1. A person publishes a problem worth solving.
2. Other people signal **“I need this”**, follow it, and improve its definition.
3. A project forms under the problem and links its GitHub repository.
4. The project publishes milestones and specific contribution needs.
5. A contributor chooses **“I can help”** and is handed a clear path into GitHub.
6. GitHub activity becomes understandable progress inside ManyHands.
7. Healthy projects grow; stalled projects ask for a new steward instead of becoming a mystery.

## Product boundary

**ManyHands owns coordination. GitHub owns code.**

ManyHands will not become another source-code host, a generic social network, a private gig marketplace, or an all-purpose project-management suite. The first release focuses on discovery, formation, contribution, progress, and stewardship.

Read the full product contract in [`docs/PRODUCT.md`](docs/PRODUCT.md) and the non-negotiable principles in [`docs/CONSTITUTION.md`](docs/CONSTITUTION.md).

## Run it locally

### Requirements

- Node.js **24.19.0**
- pnpm **11.20.0**
- Docker Desktop or Docker Engine for database work

The repository records the Node version in `.nvmrc` and `.node-version`, the exact package manager in `package.json`, and the pinned Supabase CLI in the committed dependency graph.

### Application

```bash
npm install --global pnpm@11.20.0
pnpm install --frozen-lockfile
cp apps/web/.env.example apps/web/.env.local
pnpm dev
```

Open `http://localhost:3000`. `SITE_URL` is optional for local development; the application falls back to that same origin.

### Database

```bash
pnpm db:start
pnpm db:reset
pnpm db:test
pnpm db:lint
```

Delete the disposable local stack when finished:

```bash
pnpm db:stop
```

The database is rebuilt from immutable migrations and a deliberately non-personal, secret-free seed. A hosted Supabase project or production credential is not required.

### Quality commands

```bash
pnpm agent:check
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

For the production-browser smoke suite and screenshot artifacts:

```bash
pnpm exec playwright install chromium
pnpm build
pnpm test:e2e
```

Run every non-browser gate with `pnpm verify`.

Read:

- [`docs/README.md`](docs/README.md) for role-based reading paths and the authority of each document;
- [`docs/GLOSSARY.md`](docs/GLOSSARY.md) for plain-language product terms, distinctions, and one complete example;
- [`docs/DEVELOPMENT.md`](docs/DEVELOPMENT.md) for setup, commands, package boundaries, CI, and troubleshooting;
- [`docs/DATABASE.md`](docs/DATABASE.md) for migrations, grants, RLS, tests, generated types, and local database operations;
- [`docs/DATA_LIFECYCLE.md`](docs/DATA_LIFECYCLE.md) for retention, suspension, export, deletion, and anonymization;
- [`docs/BRANCHING.md`](docs/BRANCHING.md) for claiming, promoting, handing off, reviewing, and cleaning up work.

## Repository shape

```text
apps/
  web/                    # Next.js App Router application

packages/
  domain/                 # Typed capability policies and domain invariants
  data/                   # Generated database types and typed data boundaries

supabase/
  config.toml             # CLI-generated local project contract
  migrations/             # Immutable PostgreSQL migrations
  tests/database/         # pgTAP grants, RLS, suspension, and deletion tests
  seed.sql                # Synthetic, non-personal, secret-free seed

tests/
  unit/                   # Fast application and authorization-policy tests
  e2e/                    # Production-server browser smoke tests

scripts/                  # Repository and branch-context validation

docs/
  agent-status/           # Temporary issue-specific collaboration handoffs
  decisions/              # Architecture Decision Records
```

Shared packages exist only when a real boundary and consumer exist. Empty placeholder packages are deliberately avoided.

## Security and privacy baseline

- Public browsing and learning do not require an account.
- Authentication identity is separate from stable ManyHands attribution and authorization.
- Email, OAuth records, tokens, reports, and moderator notes do not belong in public profiles.
- Public database access requires explicit grants plus Row Level Security.
- Server actions must also enforce the centralized capability policy; RLS is defense in depth.
- Suspended users retain attribution but cannot perform protected writes.
- Account deletion detaches the authentication identity and scrubs optional profile data while preserving neutral historical attribution.
- Production or service-role secrets never enter the browser, repository, seed, test output, status handoff, or pull-request workflow.

## Help build it

Start with the [public roadmap](../../issues/2), the issues marked [`ready`](../../issues?q=is%3Aissue+is%3Aopen+label%3Aready), or the newcomer-safe work marked [`good first issue`](../../issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22) and [`help wanted`](../../issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22).

Before contributing, read:

- [`AGENTS.md`](AGENTS.md)
- [`docs/README.md`](docs/README.md)
- [`docs/GLOSSARY.md`](docs/GLOSSARY.md)
- [`CONTRIBUTING.md`](CONTRIBUTING.md)
- [`docs/BRANCHING.md`](docs/BRANCHING.md)
- [`docs/ROADMAP.md`](docs/ROADMAP.md)
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)
- [`docs/AI_CONTRIBUTIONS.md`](docs/AI_CONTRIBUTIONS.md)
- [`GOVERNANCE.md`](GOVERNANCE.md)

### The official forking policy

🍴 **Fork it. Make it better. Make me jealous.**

**Copy the homework. Improve the homework. Send the homework back.**

Seriously: submit a pull request, launch your own flavor, or build the version that makes the original look undercaffeinated. Just keep covered improvements open so everyone—including the upstream project—can learn from them and use them under the same license.

ManyHands uses the GNU Affero General Public License so users of modified networked versions can obtain the corresponding source. See [`docs/LICENSING.md`](docs/LICENSING.md) for the practical explanation.

## Working agreements

- Problem first, code second.
- Browsing and learning should not require an account.
- Contributions are judged by quality, evidence, and community safety—not résumé, employer, geography, or popularity.
- Progress must be supported by visible evidence; vanity percentages are not enough.
- AI assistance is welcome, but humans remain accountable for every contribution.
- Accessibility, privacy, security, and moderation are product requirements.
- Decisions that affect the architecture or community are recorded publicly.
- Valuable partial work is promoted through draft pull requests instead of being hidden on forgotten branches.

## Initial technology direction

The accepted starting direction is a strict-TypeScript Next.js application, a PostgreSQL/Supabase data foundation, GitHub authentication plus a least-privilege GitHub App, and a self-hostable deployment model.

The exact implementation contract is in [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) and evolves through reviewed Architecture Decision Records in [`docs/decisions`](docs/decisions/README.md).

## License

Copyright © 2026 Samir Khan and ManyHands contributors.

ManyHands is free software licensed under **GNU AGPL v3 or later**. See [`LICENSE`](LICENSE) and [`docs/LICENSING.md`](docs/LICENSING.md).
