---
schema_version: "1"
issue: "6"
title: "Problem publishing, discovery, follows, and need signals"
branch: "feat/6-problem-directory-foundation"
work_state: "needs_reverification"
contributors: "@samir1234khans"
base_commit: "27f2f04e890690b39ccbcb769326abd3a4472e95"
last_verified_commit: "5dad1ad8061d5f9753d088ace1a77c262428ac62"
updated_at_utc: "2026-08-28T19:15:00Z"
pull_request: "61"
verification_state: "database_and_application_gates_green_before_main_refresh_exact_pr_ci_pending"
---

# Issue #6 agent handoff

## Outcome

Build the first problem-first product slice: signed-out visitors can discover and read published Problems, while active signed-in contributors can draft, publish, revise, follow, and maintain one reversible **“I need this”** signal per Problem without exposing private identities or treating raw signal count as governance authority.

## Delivered checkpoint

- Immutable PostgreSQL schema for Problems, revisions, follows, need signals, interaction events, and moderation events.
- Explicit grants plus forced Row Level Security and privacy-safe public read models.
- Aggregate need/follow counts without publishing who signalled or followed.
- Validated create/revise lifecycle with a create-only typed RPC, stable published slugs, public revision history, and safe draft/close/reopen/archive behavior.
- Reversible **“I need this”** and follow operations, optional private signal context, interaction rate limiting, and service-only moderation.
- Centralized `problem.create`, `problem.read`, `problem.update`, and `problem.interact` authorization decisions.
- Server-rendered `/problems`, `/problems/[slug]`, `/problems/new`, and `/problems/[slug]/edit` routes.
- Public GET-based search, no-JavaScript reading, protected authoring with return intent, plain-text user content, accessible validation summaries, and narrow-screen behavior.
- Database, unit, production-build, and browser test coverage for the important public, private, lifecycle, authorization, interaction, and accessibility paths.
- `docs/PROBLEMS.md` explaining the contract and intentional non-goals.

## Guardrails preserved

- A Problem describes an unmet need rather than forcing one implementation.
- Multiple Projects may eventually form under one Problem.
- Public aggregate demand does not reveal individual signal identities.
- No arbitrary popularity score, comments feed, recommendation algorithm, or repository requirement enters this slice.
- User text is rendered as text rather than trusted HTML.
- RLS is defense in depth; protected actions also use centralized authorization.
- Suspended and deletion-requested accounts retain attribution but cannot perform protected writes.
- Private interaction and moderation records never enter public views, exports, browser responses, or public telemetry.

## Verification checkpoint

The self-removing finalizer rebuilt the database from migrations, passed **132 pgTAP assertions**, passed warning-level database lint, regenerated the committed database types, ran the pinned formatter and lint, passed strict TypeScript, passed **60 unit tests**, and completed the production build on `5dad1ad8061d5f9753d088ace1a77c262428ac62`.

The branch was then brought up to the operations-enabled `main` commit `27f2f04e890690b39ccbcb769326abd3a4472e95` through merge commit `6a9b9166c387bf16faf9cb77c1a96992f00d6212` without dropping either workstream. Exact pull-request Application CI, browser evidence, Repository health, Branch policy, and Database CI are pending on the refreshed candidate; no green result is claimed until those runs complete.

## Acceptance-criteria state

- Signed-out public directory/detail reading: implemented; exact browser reverification pending.
- Problem-first definition that leaves room for multiple Projects: implemented in the content model, author guidance, and UI copy.
- Draft and unpublished revision isolation: implemented and covered by pgTAP/RLS tests.
- One reversible need signal per account/Problem: implemented and tested.
- Rate-limited writes and later abuse-analysis evidence: implemented through bounded private interaction events and the initial database guard.
- Aggregate demand without identity disclosure: implemented and tested.
- Public revision history and auditable moderation state: implemented at the data/read-model boundary; the full moderator UI and appeals remain issue #12.
- Duplicate/existing-solution guidance: implemented as non-blocking search/content guidance; automated similarity blocking is intentionally absent.
- Semantic, narrow-screen, JavaScript-disabled public output: implemented; exact browser and later manual assistive-technology evidence remain.
- Unsafe HTML/scripts and malformed input: rendered harmless or rejected through React escaping, plain text, validation, and database constraints.
- Anonymous, owner, cross-user, suspension, moderation, reversal, and rate-limit tests: implemented.

## Remaining before merge

1. Require Branch policy, Repository health, Application CI/browser evidence, and Database CI to pass on the exact current pull-request head.
2. Inspect browser evidence and generated database-type drift output.
3. Update PR #61 with the exact verified head and make it review-ready.
4. Squash-merge the coherent checkpoint only after every required gate is green.
5. Keep parent issue #6 open if manual assistive-technology evidence or another acceptance criterion remains unverified after merge.

## Known limitations

- Public search is a bounded server-fetched filter rather than ranked PostgreSQL search and pagination; issue #11 owns the later search engine.
- Follows do not yet send notifications.
- Optional need context is private to the signalling account until a Project/maintainer handoff contract exists.
- Full moderation UI, notices, appeals, and richer abuse controls are deferred to issue #12.
- Duplicate guidance is intentionally advisory rather than an automated blocker.
- Manual keyboard, screen-reader, zoom/reflow, touch, and constrained-network evidence remains required by the accessibility baseline.

## Security-sensitive areas

- `supabase/migrations/20260828043000_establish_problem_directory.sql`
- `supabase/migrations/20260828043100_harden_problem_publication_visibility.sql`
- `supabase/migrations/20260828184600_add_problem_create_rpc.sql`
- `supabase/tests/database/040_problem_directory.test.sql`
- `supabase/tests/database/041_problem_create_rpc.test.sql`
- `apps/web/src/app/problems/`
- `apps/web/src/lib/problems.ts`
- `apps/web/src/lib/problems/`
- `packages/domain/src/authorization.ts`
- generated database types and public/private aggregate boundaries
