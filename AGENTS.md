---
schema_version: "1"
project: "ManyHands"
repository: "samir1234khans/ManyHands"
default_branch: "main"
current_milestone: "v0.2 — Problems"
status_verified_at_utc: "2026-08-28T04:12:00Z"
snapshot_main_commit: "d10005d2646d04a3997c6022468f2a4dab581688"
primary_active_issue: "6"
primary_active_branch: "feat/6-problem-directory-foundation"
primary_active_commit: "540585796a4d7473461e44fae51c168e2482a817"
primary_active_status: "claimed"
primary_active_pr: "61"
---

# ManyHands agent and contributor guide

This file is the operational entry point for AI agents and human collaborators. It is a **verified snapshot**, not a substitute for GitHub. Before changing code, confirm that the issue, pull request, branch, commit, and CI state still match this file.

## Read this first

1. Verify current `main`, open pull requests, and the active issue branch.
2. Read the active issue completely, including comments, dependencies, acceptance criteria, and non-goals.
3. Read the matching file under `docs/agent-status/`.
4. Read the relevant product, domain, architecture, security, accessibility, database, research, and design documents.
5. Correct stale status before relying on it.
6. Never claim a test passed, a feature completed, or a pull request merged without exact evidence.

## Product summary

ManyHands is a problem-first coordination platform for ambitious open-source software. People gather around an unmet need, form one or more solution Projects, publish Evidence-backed progress, identify concrete Contribution Needs, and move code work through GitHub.

**ManyHands owns coordination. GitHub owns code.**

## Source-of-truth hierarchy

### Product and architecture

1. `docs/CONSTITUTION.md`
2. `docs/PRODUCT.md`
3. `docs/DOMAIN_MODEL.md`
4. Accepted ADRs under `docs/decisions/`
5. `docs/ARCHITECTURE.md`
6. The active issue and its acceptance criteria
7. Working research/design evidence
8. This file

### Live implementation state

1. Merged code on `main`
2. The active pull request and its exact tested commit
3. The active issue and comments
4. The active branch
5. The matching issue handoff
6. This snapshot
7. Chat summaries and prior AI statements

When sources disagree, verify GitHub and update the stale document. Do not make contradictions disappear by guessing.

## Non-negotiable rules

- Public exploration must not require signup.
- One Problem may support multiple Projects.
- Progress comes from Milestones and Evidence, not vanity percentages.
- Ordinary GitHub authentication must not silently request repository-installation access.
- Row Level Security is defense in depth; server-side authorization remains mandatory.
- Private email, OAuth tokens, service-role keys, reports, and moderator notes never enter public read models.
- Suspended or deleted contributors retain attribution without retaining unnecessary personal data.
- Accessibility and constrained-device behavior are acceptance criteria.
- AI assistance never removes human accountability.
- Do not add empty packages, services, or abstractions merely to imitate a future architecture.

## Current verified snapshot

### Merged on `main`

- Issue #3 application foundation: pinned workspace, strict TypeScript, server-rendered Next.js shell, tests, production build, and application CI.
- Issue #4 data foundation: immutable migrations, stable identity, explicit grants, forced RLS, generated types, pgTAP, and isolated database CI.
- Issue #19 documentation map and issue #20 plain-language glossary.
- Issue #21 research checkpoint through PR #58: dated adjacent-platform evidence, counterarguments, interview guides, and experiments. Parent issue remains open for field validation.
- Issue #22 design checkpoint through PR #59: versioned information architecture, state tables, and low-fidelity wireframes. Parent issue remains open for comprehension testing.
- Issue #5 identity checkpoint through PR #35: GitHub sign-in intent and safe errors, session boundary, public People/profile routes, privacy-controlled profile editing, account settings, sign-out, suspension-aware writes, and attribution-preserving deletion. Parent issue remains open for hosted-provider and manual evidence.
- Issue #14 accessibility checkpoint through PR #57: public statement, reporting form, engineering baseline, shared navigation entry point, and browser regressions. Parent issue remains open for manual and future route-specific evidence.

### Primary active product work

| Issue | Branch | Pull request | State | Recorded checkpoint | Handoff |
|---|---|---|---|---|---|
| #6 — Problems, follows, and “I need this” | `feat/6-problem-directory-foundation` | Draft #61 | `claimed` | `540585796a4d7473461e44fae51c168e2482a817` | `docs/agent-status/issue-6.md` |

The first checkpoint must establish the database and authorization boundary before adding public and authenticated Problem flows.

### Dependency-aware next work

1. #6 — Problem directory, revisions, follows, and need signals.
2. #16 — deployment, health, observability, backup/restore, export, and self-hosting foundation in parallel.
3. #7 — solution Project formation after the Problem model is merged.
4. #8 — actionable Contribution Needs and “I can help” after Project roles exist.
5. #9 — Milestones, blockers, Evidence, and derived progress alongside #8 after Project roles exist.

Issues #10–#17 remain dependency-gated unless their issue explicitly permits a safe parallel checkpoint.

## Repository map

- `apps/web/` — Next.js application, HTTP, server action, and UI boundary.
- `packages/domain/` — domain language and centralized capability decisions.
- `packages/data/` — generated database types and typed data boundaries.
- `supabase/migrations/` — immutable PostgreSQL migrations.
- `supabase/tests/database/` — pgTAP grants, RLS, lifecycle, and negative tests.
- `tests/unit/` — fast application and domain tests.
- `tests/e2e/` — production-server browser verification.
- `docs/decisions/` — accepted Architecture Decision Records.
- `docs/design/` — working design evidence, not a replacement for normative contracts.
- `docs/research/` — dated research evidence and falsifiable validation plans.
- `docs/agent-status/` — temporary issue-specific operational handoffs.
- `scripts/` — repository and branch-context validation.

## Branch model

`main` is the only long-lived integration branch. There is no permanent `develop` branch and no placeholder branch for unclaimed work.

Same-repository branches use:

- `feat/<issue>-<slug>`
- `fix/<issue>-<slug>`
- `docs/<issue>-<slug>`
- `chore/<issue>-<slug>`
- `security/<issue>-<slug>`
- `research/<issue>-<slug>`
- `design/<issue>-<slug>`
- `test/<issue>-<slug>`
- `refactor/<issue>-<slug>`

Read `docs/BRANCHING.md` before creating, reviving, handing off, or deleting a branch.

## Required commands

### Repository and application

- `pnpm agent:check`
- `pnpm format:check`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm build`
- `pnpm test:e2e`
- `pnpm verify`
- `pnpm verify:full`

### Database

- `pnpm db:start`
- `pnpm db:reset`
- `pnpm db:test`
- `pnpm db:lint`
- `pnpm db:stop`

Do not report a command as passing unless it passed on the exact commit being reported.

## Working protocol

1. Work from a GitHub issue with a clear outcome and acceptance criteria.
2. Comment or claim the issue before substantial work.
3. Create one short-lived issue branch from current `main`.
4. Preserve dependencies, non-goals, security boundaries, and accessibility requirements.
5. Read nearby code, migrations, and tests before introducing abstractions.
6. Add negative authorization and failure-path tests at every trust boundary.
7. Commit coherent checkpoints; do not use status documents instead of Git history.
8. Update the matching handoff before pausing, requesting review, or transferring work.
9. Open a draft pull request early when work is valuable but incomplete.
10. Make a pull request review-ready only after the exact head passes relevant gates.
11. Merge independently useful, dependency-safe checkpoints; keep parent issues open when field/manual evidence remains.
12. After merge, remove obsolete handoffs and let merged branches be deleted automatically.

## Handoff requirements

A useful handoff records:

- exact issue, branch, pull request, base commit, and last verified commit;
- completed work versus intended work;
- acceptance-criteria state;
- decisions another contributor must not reverse;
- next safe action;
- blockers and owners;
- security-sensitive areas;
- checks actually run and exact results.

Use `not run` or `pending` instead of inventing a green result.

## Stale-status handling

A status entry older than seven days is not automatically abandoned, but it must be re-verified. Mark it `needs_reverification` when the branch moved beyond the recorded commit, the pull request changed materially, CI regressed, or the issue disagrees with the file.

Never overwrite another contributor's active work merely because a timestamp is old. Inspect the issue and branch first.

## Never place these in status files

- API keys, OAuth secrets, tokens, passwords, private keys, or production environment values.
- Private user data, security-report details, or moderator notes.
- Unredacted logs containing sensitive values.
- Personal speculation about contributors.
- Long chat transcripts.
- Unsupported claims that work is complete or verified.

## Stop and request review when

- a change conflicts with the constitution, product contract, domain model, or accepted ADR;
- a migration changes identity, authorization, deletion, public-data, moderation, or evidence semantics;
- GitHub OAuth or GitHub App permissions expand;
- a security boundary is unclear;
- the only way to continue is to erase attribution, bypass tests, expose secrets, or pretend uncertainty does not exist.
