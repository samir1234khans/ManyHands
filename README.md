# ManyHands

> **Big problems. Built together.**

ManyHands is a **problem-first community for creating ambitious open-source software**. It helps people gather around a shared need, form one or more solution projects, make progress understandable, and move code work into GitHub without trying to replace GitHub.

The idea is simple:

> Here is a problem people care about. Here is what is already being built. Here is what the project needs next. Here is how you can help.

## Status

ManyHands is **pre-alpha**, but the foundation is now substantially real rather than aspirational.

Merged on `main`:

- a contributor-ready open-source repository with governance, security, licensing, issue taxonomy, CI, and newcomer documentation;
- a strict-TypeScript Next.js application with server-rendered public content, production builds, unit tests, browser tests, and screenshot evidence;
- reproducible PostgreSQL/Supabase migrations with stable internal identity, explicit grants, forced Row Level Security, generated types, pgTAP tests, and isolated database CI;
- GitHub sign-in intent and safe error recovery, cookie-backed sessions, a public People directory, public contributor profiles, privacy-controlled profile editing, account settings, sign-out, suspension-aware writes, and attribution-preserving deletion;
- a public accessibility statement, barrier-reporting form, engineering baseline, and browser regression checks;
- a dated adjacent-platform research brief and a versioned product information-architecture/wireframe handoff.

The merged checkpoints do **not** close every parent issue. Issue [#5](../../issues/5) remains open for hosted GitHub OAuth verification, real-provider session evidence, and final manual assistive-technology review. Issue [#14](../../issues/14) remains open for manual and future route-specific accessibility evidence. Issue [#21](../../issues/21) remains open for interviews and validation experiments. Issue [#22](../../issues/22) remains open for unfamiliar-user comprehension testing and refinement.

The primary product implementation path is now issue [#6](../../issues/6): publish, discover, follow, and signal **“I need this”** around Problems. Operations issue [#16](../../issues/16) can proceed in parallel. Consult [`AGENTS.md`](AGENTS.md) for the exact active branch, pull request, and verified checkpoint.

This repository is also the first project ManyHands will coordinate. **ManyHands will build ManyHands.**

## Why this exists

Large open-source projects often fail before code becomes the hard part. People cannot easily find one another, understand the current state, see where help is needed, or tell whether a project is alive.

GitHub is excellent at hosting code and reviewing changes. ManyHands is the coordination layer around it:

- start with a real problem, not an empty repository;
- show multiple possible projects or solutions under that problem;
- publish milestones, Evidence, Health, and current Contribution Needs;
- match willing contributors to clear ways of helping;
- hand code, issues, and pull requests to GitHub;
- make stalled projects honest and transferable instead of quietly abandoned.

## The core loop

1. A person publishes a Problem worth solving.
2. Other people signal **“I need this”**, follow it, and improve its definition.
3. One or more Projects form under the Problem and link their GitHub repositories.
4. Each Project publishes milestones, Evidence, and specific Contribution Needs.
5. A contributor chooses **“I can help”** and receives a clear path into useful work.
6. GitHub activity becomes understandable progress inside ManyHands.
7. Healthy Projects grow; stalled Projects ask for a new Steward instead of becoming a mystery.

## Product boundary

**ManyHands owns coordination. GitHub owns code.**

ManyHands will not become another source-code host, a generic social network, a private gig marketplace, or an all-purpose project-management suite. The first release focuses on discovery, formation, contribution, progress, and stewardship.

Read the full product contract in [`docs/PRODUCT.md`](docs/PRODUCT.md), the plain-language terms in [`docs/GLOSSARY.md`](docs/GLOSSARY.md), and the non-negotiable principles in [`docs/CONSTITUTION.md`](docs/CONSTITUTION.md).

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

Open `http://localhost:3000`. `SITE_URL` is optional for local development; the application falls back to that origin.

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

The database is rebuilt from immutable migrations and a deliberately non-personal, secret-free seed. A hosted Supabase project or production credential is not required for local database verification.

### Quality commands

```bash
pnpm agent:check
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

For the production-browser suite and screenshot artifacts:

```bash
pnpm exec playwright install chromium
pnpm build
pnpm test:e2e
```

Run every non-browser gate with `pnpm verify` and the full application/browser suite with `pnpm verify:full`.

## Documentation entry points

- [`docs/README.md`](docs/README.md) — role-based reading paths and document authority.
- [`docs/GLOSSARY.md`](docs/GLOSSARY.md) — plain-language product terms and a complete worked example.
- [`docs/AUTHENTICATION.md`](docs/AUTHENTICATION.md) — GitHub OAuth, session, privacy, and configuration boundaries.
- [`docs/ACCESSIBILITY.md`](docs/ACCESSIBILITY.md) — WCAG 2.2 AA target, interaction rules, automation, and manual evidence.
- [`docs/design/PRODUCT_INFORMATION_ARCHITECTURE.md`](docs/design/PRODUCT_INFORMATION_ARCHITECTURE.md) — working IA, routes, state tables, and low-fidelity wireframes.
- [`docs/research/2026-08-adjacent-platforms.md`](docs/research/2026-08-adjacent-platforms.md) — dated adjacent-platform evidence, counterarguments, and experiments.
- [`docs/DEVELOPMENT.md`](docs/DEVELOPMENT.md) — setup, commands, package boundaries, CI, and troubleshooting.
- [`docs/DATABASE.md`](docs/DATABASE.md) — migrations, grants, RLS, tests, generated types, and operations.
- [`docs/DATA_LIFECYCLE.md`](docs/DATA_LIFECYCLE.md) — retention, suspension, export, deletion, and anonymization.
- [`docs/BRANCHING.md`](docs/BRANCHING.md) — claiming, promoting, handing off, reviewing, and cleaning up work.

## Repository shape

```text
apps/
  web/                    # Next.js App Router application

packages/
  domain/                 # Typed capability policies and domain invariants
  data/                   # Generated database types and typed data boundaries

supabase/
  config.toml             # Local project contract
  migrations/             # Immutable PostgreSQL migrations
  tests/database/         # pgTAP grants, RLS, lifecycle, and negative tests
  seed.sql                # Synthetic, non-personal, secret-free seed

tests/
  unit/                   # Fast application and domain tests
  e2e/                    # Production-server browser verification

docs/
  agent-status/           # Temporary issue-specific operational handoffs
  decisions/              # Architecture Decision Records
  design/                 # Working interaction and information-architecture evidence
  research/               # Dated product evidence and validation plans

scripts/                  # Repository and branch-context validation
```

Shared packages exist only when a real boundary and consumer exist. Empty placeholder packages are deliberately avoided.

## Security, privacy, and accessibility baseline

- Public browsing and learning do not require an account.
- Authentication identity is separate from stable ManyHands attribution and authorization.
- Ordinary GitHub sign-in does not install the GitHub App or request repository access.
- Email, OAuth records, tokens, reports, and moderator notes do not belong in public profiles.
- Public database access requires explicit grants plus Row Level Security.
- Server actions enforce centralized capability policy; RLS is defense in depth.
- Suspended users retain attribution but cannot perform protected writes.
- Account deletion detaches authentication identity and scrubs optional profile data while preserving neutral history.
- Production or service-role secrets never enter the browser, repository, seed, test output, handoff, or pull-request workflow.
- Keyboard, assistive technology, zoom/reflow, reduced motion, forced colors, touch, narrow screens, and constrained networks are acceptance criteria.

## Help build it

Start with the [public roadmap](../../issues/2), the issues marked [`ready`](../../issues?q=is%3Aissue+is%3Aopen+label%3Aready), or the genuinely newcomer-safe work marked [`good first issue`](../../issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22) and [`help wanted`](../../issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22).

Before contributing, read:

- [`AGENTS.md`](AGENTS.md)
- [`docs/README.md`](docs/README.md)
- [`docs/GLOSSARY.md`](docs/GLOSSARY.md)
- [`CONTRIBUTING.md`](CONTRIBUTING.md)
- [`docs/BRANCHING.md`](docs/BRANCHING.md)
- [`docs/ROADMAP.md`](docs/ROADMAP.md)
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)
- [`docs/ACCESSIBILITY.md`](docs/ACCESSIBILITY.md)
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
- Progress must be supported by visible Evidence; vanity percentages are not enough.
- AI assistance is welcome, but humans remain accountable for every contribution.
- Accessibility, privacy, security, moderation, and operability are product requirements.
- Decisions that affect architecture or community are recorded publicly.
- Valuable partial work is promoted through draft pull requests instead of hidden on forgotten branches.

## Initial technology direction

The accepted starting direction is a strict-TypeScript Next.js application, a PostgreSQL/Supabase data foundation, GitHub authentication plus a least-privilege GitHub App, and a self-hostable deployment model.

The exact implementation contract is in [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) and evolves through reviewed Architecture Decision Records in [`docs/decisions`](docs/decisions/README.md).

## License

Copyright © 2026 Samir Khan and ManyHands contributors.

ManyHands is free software licensed under **GNU AGPL v3 or later**. See [`LICENSE`](LICENSE) and [`docs/LICENSING.md`](docs/LICENSING.md).
