# Roadmap

The roadmap is ordered to reach the self-hosting contributor-loop milestone without building a social network around an empty product. Progress is reported as completed outcomes and linked Evidence, never as a hand-entered percentage.

## Current verified state — 28 August 2026

### Merged foundation

- Contributor-ready repository, governance, security, licensing, issue taxonomy, documentation map, glossary, and CI.
- Strict-TypeScript/pnpm workspace and server-rendered Next.js application with production, unit, and browser verification.
- Reproducible PostgreSQL/Supabase foundation with immutable migrations, stable internal identity, explicit grants, forced RLS, generated types, pgTAP, and isolated database CI.
- GitHub identity/profile/account-lifecycle checkpoint: optional sign-in intent, safe errors, sessions, People directory, public profiles, profile editing, settings, sign-out, suspension-aware writes, and attribution-preserving deletion.
- Public accessibility checkpoint: statement, barrier-reporting form, shared navigation entry point, engineering baseline, and browser regressions.
- Contributor documentation map and plain-language domain glossary.
- Adjacent-platform research checkpoint with counterarguments, interviews, experiments, and falsifiable signals.
- Product information-architecture checkpoint with routes, state tables, responsive rules, and low-fidelity wireframes.

### Parent issues intentionally still open

- **#5 Identity:** hosted GitHub OAuth, real-provider session/revocation evidence, and final manual assistive-technology review remain.
- **#14 Accessibility:** manual evidence and route-specific audits continue across every future core journey.
- **#21 Research:** interviews and experiments must test the desk-research hypothesis.
- **#22 Product design:** unfamiliar-user comprehension testing must validate terminology and hierarchy.
- **#18 Repository administration:** GitHub settings and ruleset controls still require administrator-level configuration and verification.

A merged checkpoint means useful, verified work is persistent on `main`; it does not erase unmet parent acceptance criteria.

## Next five execution workstreams

### 1. Issue #6 — Problems and demand

**Outcome:** signed-out visitors can discover and understand unmet needs before a Project exists; active signed-in contributors can draft, publish, revise, follow, and maintain one reversible **“I need this”** signal per Problem.

First checkpoint:

- Problem, revision, follow, and need-signal database contracts;
- explicit grants, forced RLS, public aggregate read models, and negative tests;
- public directory/detail routes and protected authoring;
- safe plain-text content, freshness, status, and reversible signals;
- keyboard, narrow-screen, JavaScript-disabled, and failure-state evidence.

Active branch: `feat/6-problem-directory-foundation`; draft PR #61.

### 2. Issue #16 — Operations and self-hosting

**Outcome:** a competent operator can deploy, observe, back up, restore, export, and safely recover the same application without private oral knowledge.

This work can proceed in parallel with #6 because its dependencies—application and database foundations—are merged. The first checkpoint should establish environment inventory, health/readiness, privacy-safe structured observability, deployment/self-hosting guides, backup/restore drill procedure, versioned public export contract, release checklist, and incident/rollback runbook.

### 3. Issue #7 — Project formation

**Outcome:** multiple solution Projects can form under one Problem with explicit scope, non-goals, license, governance, membership, and accountable stewardship.

This begins only after the Problem model from #6 is merged. Project membership must remain distinct from GitHub repository permission.

### 4. Issue #8 — Contribution Needs and “I can help”

**Outcome:** Projects publish bounded, reviewable Contribution Needs and contributors receive an explicit acknowledgement, pairing, redirect, decline, withdrawal, inactivity, or completion path.

This begins after Project roles and stewardship from #7 exist.

### 5. Issue #9 — Milestones, blockers, Evidence, and derived progress

**Outcome:** public progress explains its basis through outcomes, blockers, freshness, and verifiable artifacts rather than arbitrary percentages or commit volume.

This can proceed alongside #8 after Project roles exist, with shared review of status and evidence semantics.

## Phase 0 — Contributor-ready foundation

**Outcome:** a stranger can understand the mission, choose work, and submit a reviewable contribution.

Implemented:

- Constitution, product contract, domain model, architecture, governance, security, accessibility, and licensing.
- Issue and pull-request templates, public roadmap, taxonomy, milestones, ownership, and repository-health automation.
- Documentation map, glossary, branching guidance, maintainer and launch playbooks.
- Problem-gap and adjacent-platform research checkpoints.
- Product information-architecture and low-fidelity interaction checkpoint.

Remaining before broad community launch:

- Apply and verify administrator-level repository controls in #18.
- Continue field research, comprehension review, and manual accessibility evidence in their parent issues.

## Phase 1 — Production foundation

**Outcome:** a deployable, tested application shell with secure identity and data foundations.

Implemented:

- pnpm workspace, strict TypeScript, Next.js App Router, shared public shell, and safe loading/error/not-found behavior.
- Supabase local development, immutable migrations, generated types, explicit grants, forced RLS, and database tests.
- Optional GitHub sign-in intent and callback boundary, public contributor profiles, profile editing, settings, sign-out, and account lifecycle.
- CI for formatting, lint, type checking, unit tests, production build, browser verification, migration reset, pgTAP, database lint, and generated-type drift.
- Public accessibility statement and regression baseline.

Remaining:

- Hosted OAuth and real-provider evidence under #5.
- Reproducible deployment, observability, backup/restore, export, and self-hosting under #16.
- Manual accessibility evidence under #14.

## Phase 2 — Problems and demand

**Outcome:** people can publish and discover unmet needs before any Project exists.

- Create, edit, publish, close, archive, and revise Problems.
- **“I need this”** signal and follow state.
- Public directory, detail, freshness, and duplicate/existing-solution guidance.
- Safe content and permission-aware author/moderator controls.
- Aggregate demand without exposing private identity choices.

Primary issue: #6.

## Phase 3 — Projects and contribution

**Outcome:** teams can form under Problems and turn interest into actionable work and understandable progress.

- Projects with scope, non-goals, license, governance, stewardship, and role policies (#7).
- Contribution Needs with outcome, reviewer, skills/non-code roles, onboarding, and acceptance criteria (#8).
- **“I can help”** acknowledgement, pairing, redirect, decline, withdrawal, inactivity, and completion (#8).
- Milestones, blockers, Evidence, freshness, corrections, and derived progress (#9).
- Health, pause/archive, and stewardship handoff (#13).

## Phase 4 — GitHub bridge

**Outcome:** code activity becomes understandable product progress without duplicating GitHub.

- Least-privilege GitHub App installation separate from ordinary login.
- Repository linking and permission review.
- Signed, idempotent webhook ingestion and append-only inbox.
- Normalized issues, pull requests, releases, selected commits/tags, and repository lifecycle events.
- Backfill, incremental sync, rate-limit handling, freshness, degraded/revoked states, and retry tools.
- Evidence links back to GitHub as the authoritative code source.

Primary issue: #10 after #7 and #9.

## Phase 5 — Discovery, trust, and dogfooding

**Outcome:** the community can find useful work safely, and ManyHands coordinates its own development.

- Public search and filters across Problems, Projects, Contribution Needs, skills, platforms, Health, and freshness (#11).
- Reports, scoped moderation, rate limits, immutable audit history, and appeals (#12).
- Honest stale/paused/needs-steward behavior and responsible handoff (#13).
- Verified, opt-in founding-contributor recognition without a status economy (#15).
- Publish **Build ManyHands** inside the application and complete the stranger-to-merged-contribution loop (#17).

## Later, only after evidence

- Additional code forges.
- Notifications beyond essential updates.
- Recommendations or matching assistance.
- Localization at scale.
- Federation between self-hosted instances.
- Funding, donations, or bounties with separate governance safeguards.
- Native mobile applications.

## Definition of ready for community help

A workstream is ready when:

- the purpose, dependencies, non-goals, and acceptance criteria are clear;
- the architecture and data boundary are understood;
- a short-lived issue branch and visible draft pull request exist;
- negative authorization and failure-path evidence are planned;
- accessibility, privacy, security, and operations risks are named;
- maintainers can review and respond;
- useful partial work can merge without falsely closing the parent outcome.

## Release shape

No date is promised before the production foundation is measured. Use outcome milestones rather than speculative deadlines:

- `v0.1 — Foundation`
- `v0.2 — Problems`
- `v0.3 — Projects`
- `v0.4 — GitHub Bridge`
- `v0.5 — ManyHands Builds ManyHands`
- `v1.0 — Stable Contributor Loop`
