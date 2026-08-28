---
schema_version: "1"
issue: "6"
title: "Problem publishing, discovery, follows, and need signals"
branch: "feat/6-problem-directory-foundation"
work_state: "review"
contributors: "@samir1234khans"
base_commit: "fac47e1a3b7e376be9d73122e478ff9b0675e3c4"
last_verified_commit: "5dad1ad8061d5f9753d088ace1a77c262428ac62"
updated_at_utc: "2026-08-28T19:12:00Z"
pull_request: "61"
verification_state: "database_and_application_gates_green_final_pr_ci_pending"
---

# Issue #6 agent handoff

## Outcome

Build the first problem-first product slice: signed-out visitors can discover and read published Problems, while active signed-in contributors can draft, publish, revise, follow, and maintain one reversible **“I need this”** signal per Problem without exposing private identities or treating raw signal count as governance authority.

## Delivered checkpoint

- Immutable PostgreSQL schema for Problems, revisions, follows, need signals, interaction events, and moderation events.
- Explicit grants plus forced Row Level Security and privacy-safe public read models.
- Aggregate need/follow counts without publishing who signalled or followed.
- Validated create/revise lifecycle with a create-only typed RPC, stable published slugs, public revision history, and safe draft/close/reopen/archive behavior.
- Reversible `I need this` and follow operations, optional private signal context, interaction rate limiting, and service-only moderation.
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

## Verification checkpoint

The self-removing finalizer rebuilt the database from migrations, passed **132 pgTAP assertions**, passed warning-level database lint, regenerated the committed database types, ran the pinned formatter and lint, passed strict TypeScript, passed **60 unit tests**, and completed the production build on `5dad1ad8061d5f9753d088ace1a77c262428ac62`.

The branch was then brought up to the operations-enabled current `main` without dropping Problem work. This documentation commit intentionally triggers final ordinary pull-request CI so browser and database evidence are attached to the current combined head before merge.

## Remaining before merge

1. Require Branch policy, Repository health, Application CI/browser evidence, and Database CI to pass on the current PR head.
2. Update PR #61 with the exact verified head and make it review-ready.
3. Squash-merge and close issue #6 as completed.
4. Remove this temporary handoff during canonical post-merge reconciliation and promote issue #7 as the next active product branch.

## Security-sensitive areas

- public/private Problem tables and aggregate read models;
- author/moderator capability decisions;
- immutable revision history and status transitions;
- need-signal/follow uniqueness and reversal;
- public aggregation without identity disclosure;
- interaction-rate abuse controls;
- plain-text content and deceptive-link handling.
