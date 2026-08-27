# Roadmap

The roadmap is ordered to reach the self-hosting milestone without building a social network around an empty product.

## Phase 0 — Contribution-ready foundation

**Outcome:** a stranger can understand the mission, choose work, and submit a reviewable contribution.

- Constitution, product contract, domain model, architecture, governance, security, and licensing.
- Issue and pull-request templates.
- Repository health workflow and ownership rules.
- Public issue map with a small set of honest `good first issue` tasks.
- Recommended repository settings and branch policy.

## Phase 1 — Production foundation

**Outcome:** a deployable, tested application shell with secure identity and data foundations.

- pnpm workspace and TypeScript configuration.
- Next.js web application with accessible layout and error boundaries.
- Supabase local development, migrations, typed access, and Row Level Security baseline.
- GitHub sign-in, account lifecycle, and public contributor profile.
- CI for lint, type checking, tests, build, migrations, and dependency review.
- Preview and production deployment documentation.

## Phase 2 — Problems and demand

**Outcome:** people can publish and discover unmet needs before any project exists.

- Create, edit, view, and revise problems.
- “I need this” signal and follow state.
- Problem discovery, filters, and moderation.
- Duplicate and existing-solution guidance.
- Public revision and freshness indicators.

## Phase 3 — Projects and contribution

**Outcome:** a team can form under a problem and turn interest into actionable work.

- Projects under problems with scope and explicit non-goals.
- Stewardship, team membership, and role policies.
- Contribution needs with skills, acceptance criteria, and onboarding.
- “I can help” flow, acknowledgement, claim, redirect, and decline states.
- Milestones, blockers, evidence, and derived progress.
- Project health and stewardship handoff.

## Phase 4 — GitHub bridge

**Outcome:** code activity becomes understandable product progress without duplicating GitHub.

- GitHub App creation and installation flow.
- Repository linking and permission review.
- Signed, idempotent webhook ingestion.
- Normalized issues, pull requests, releases, commits, and repository metadata.
- Sync freshness, failure, revocation, rename, transfer, and archive handling.
- Evidence links and activity summaries.

## Phase 5 — Discovery, trust, and self-hosting

**Outcome:** the community can discover useful work safely, and ManyHands can coordinate its own development.

- Search and feed by problem, project, need, skill, platform, and health.
- Reports, moderation queue, audit trail, rate limits, and appeals baseline.
- Founding contributor recognition.
- Publish **Build ManyHands** inside the application.
- Route repository visitors into the live ManyHands project.
- Complete the stranger-to-merged-contribution acceptance test.

## Later, only after evidence

- Additional code forges.
- Notifications beyond essential email/in-app updates.
- Project recommendations and matching assistance.
- Localization at scale.
- Federation between self-hosted instances.
- Funding, donations, or bounties with separate governance safeguards.
- Native mobile experiences.

## Definition of “ready for community help”

The repository is ready when:

- the purpose and non-goals are clear;
- the application architecture is documented;
- new issues contain outcomes and acceptance criteria;
- at least two small tasks are genuinely safe for a newcomer;
- a pull request is validated automatically;
- maintainers can respond and review;
- security and conduct reporting paths exist;
- the first implementation branch is tied to an issue;
- the official roadmap does not depend on contributors magically appearing.

## Release shape

No date is promised before the production foundation is measured. Use milestone names rather than speculative deadlines:

- `v0.1 — Foundation`
- `v0.2 — Problems`
- `v0.3 — Projects`
- `v0.4 — GitHub Bridge`
- `v0.5 — ManyHands Builds ManyHands`
- `v1.0 — Stable Contributor Loop`
