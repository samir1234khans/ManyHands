---
schema_version: "1"
project: "ManyHands"
repository: "samir1234khans/ManyHands"
default_branch: "main"
current_milestone: "v0.1 — Foundation"
status_verified_at_utc: "2026-08-27T22:45:18Z"
snapshot_main_commit: "1f829d82381a865fba34df139d5faaa33275cc3b"
primary_active_issue: "5"
primary_active_branch: "feat/5-github-auth-profile"
primary_active_commit: "e36d0cbe1fafd18b3c252cb8f84cbfece2d6d4b1"
primary_active_status: "in_progress"
primary_active_pr: "35"
---

# ManyHands agent and contributor guide

This file is the operational entry point for AI agents and human collaborators. It is a **verified snapshot**, not a substitute for GitHub. Before changing code, confirm that the issue, pull request, branch, commit, and CI state still match this file.

## Read this first

1. Verify the current `main` commit and open pull requests.
2. Read the active GitHub issue completely, including comments and explicit non-goals.
3. Inspect the issue branch and its matching file under `docs/agent-status/`.
4. Read the relevant product, architecture, security, database, and ADR documents.
5. Correct stale status before relying on it.
6. Never claim a test passed, a feature completed, or a pull request merged without exact evidence.

## Product summary

ManyHands is a problem-first coordination platform for ambitious open-source software. People gather around an unmet need, form one or more solution projects, publish evidence-backed progress, identify concrete contribution needs, and move code work through GitHub.

**ManyHands owns coordination. GitHub owns code.**

## Source-of-truth hierarchy

### Product and architecture

1. `docs/CONSTITUTION.md`
2. `docs/PRODUCT.md`
3. Accepted ADRs under `docs/decisions/`
4. `docs/ARCHITECTURE.md`
5. The active issue and its acceptance criteria
6. This file

### Live implementation state

1. Merged code on `main`
2. The active pull request and its exact tested commit
3. The active issue and its comments
4. The active branch
5. The matching `docs/agent-status/issue-<number>.md`
6. This snapshot
7. Chat summaries and prior AI statements

When sources disagree, verify GitHub and update the stale document. Do not make the contradiction disappear by guessing.

## Non-negotiable rules

- Public exploration must not require signup.
- One Problem may support multiple Projects.
- Progress comes from milestones and evidence, not vanity percentages.
- Ordinary GitHub authentication must not silently request repository-installation access.
- Row Level Security is defense in depth; server-side authorization remains mandatory.
- Private email, OAuth tokens, service-role keys, reports, and moderator notes never enter public read models.
- Suspended or deleted contributors retain attribution without retaining unnecessary personal data.
- Accessibility and constrained-device behavior are acceptance criteria.
- AI assistance never removes human accountability.
- Do not add empty packages, services, or abstractions merely to imitate a future architecture.

## Current verified snapshot

### Completed on `main`

- Issue #3: reproducible TypeScript/pnpm workspace, accessible Next.js shell, unit/browser tests, and application CI.
- Issue #4: local Supabase/PostgreSQL foundation, immutable migrations, explicit grants, forced RLS, stable attribution, generated types, pgTAP tests, and Database CI.

### Active product work

| Issue | Branch | Pull request | State | Last recorded commit | Handoff |
|---|---|---|---|---|---|
| #5 — GitHub sign-in and contributor profiles | `feat/5-github-auth-profile` | Draft #35 | `in_progress` | `e36d0cbe1fafd18b3c252cb8f84cbfece2d6d4b1` | `docs/agent-status/issue-5.md` |

Issue #6 remains blocked until the complete identity/profile vertical slice is merged.

## Repository map

- `apps/web/` — Next.js application and HTTP/UI boundary.
- `packages/domain/` — domain language and centralized capability decisions.
- `packages/data/` — generated database types and typed data boundaries.
- `supabase/migrations/` — immutable PostgreSQL migrations.
- `supabase/tests/database/` — pgTAP grants, RLS, lifecycle, and negative tests.
- `tests/unit/` — fast application and domain tests.
- `tests/e2e/` — production-server browser verification.
- `docs/decisions/` — accepted Architecture Decision Records.
- `docs/agent-status/` — temporary issue-specific operational handoffs.
- `scripts/` — repository validation used locally and in CI.

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
2. Comment before taking substantial work so maintainers can prevent duplication.
3. Create one short-lived issue branch from current `main`.
4. Preserve the issue's non-goals and security boundaries.
5. Read nearby code and tests before introducing abstractions.
6. Add negative authorization and failure-path tests at every trust boundary.
7. Commit coherent checkpoints; do not use status documents as a substitute for Git history.
8. Update the matching issue handoff before pausing, requesting review, or transferring work.
9. Open a draft pull request early when work is valuable but incomplete.
10. Make a pull request review-ready only after the exact head passes the relevant gates.
11. After merge, remove the active handoff and let the branch be deleted automatically.

## Handoff requirements

A useful handoff records:

- exact issue, branch, pull request, base commit, and last verified commit;
- completed work versus intended work;
- acceptance-criteria state;
- decisions another contributor must not accidentally reverse;
- next safe action;
- blockers and their owners;
- security-sensitive areas;
- checks actually run and their exact results.

Use `not run` or `pending` instead of inventing a green result.

## Stale-status handling

A status entry older than seven days is not automatically abandoned, but it must be re-verified. Mark it `needs_reverification` when the branch moved beyond the recorded commit, the pull request changed materially, CI regressed, or the GitHub issue disagrees with the file.

Never overwrite another contributor's active work merely because a timestamp is old. Inspect the issue and branch first.

## Never place these in status files

- API keys, OAuth secrets, tokens, passwords, private keys, or production environment values.
- Private user data, security-report details, or moderator notes.
- Unredacted logs containing sensitive values.
- Personal speculation about contributors.
- Long chat transcripts.
- Unsupported claims that work is complete or verified.

## Stop and ask for review when

- a change conflicts with the constitution, product contract, or an accepted ADR;
- a migration changes identity, authorization, deletion, or public-data semantics;
- GitHub OAuth or GitHub App permissions expand;
- a security boundary is unclear;
- the only way to continue is to erase attribution, bypass tests, expose secrets, or pretend uncertainty does not exist.
