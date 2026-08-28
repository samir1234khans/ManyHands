---
schema_version: "1"
issue: "6"
title: "Problem publishing, discovery, follows, and need signals"
branch: "feat/6-problem-directory-foundation"
work_state: "claimed"
contributors: "@samir1234khans"
base_commit: "d10005d2646d04a3997c6022468f2a4dab581688"
last_verified_commit: "540585796a4d7473461e44fae51c168e2482a817"
updated_at_utc: "2026-08-28T04:12:00Z"
pull_request: "61"
verification_state: "draft_pr_open_checkpoint_not_yet_verified"
---

# Issue #6 agent handoff

## Outcome

Build the first problem-first product slice: signed-out visitors can discover and read published Problems, while active signed-in contributors can draft, publish, revise, follow, and maintain one reversible **“I need this”** signal per Problem without exposing private identities or treating raw signal count as governance authority.

## First implementation checkpoint

1. Add immutable PostgreSQL migrations for Problems, public revision history, follows, need signals, aggregate public read models, explicit grants, forced RLS, and safe lifecycle transitions.
2. Extend centralized authorization and input/state validation without weakening the identity boundary.
3. Add server-rendered `/problems`, `/problems/[slug]`, and protected authoring routes with useful signed-out and degraded states.
4. Add reversible follow and need-signal actions with explicit status feedback and one active signal per account/problem.
5. Add pgTAP, unit, build, and Playwright evidence for public reads, owner writes, cross-user denial, suspension, duplicate signals, reversal, safe text rendering, JavaScript-disabled reading, and narrow-screen behavior.

## Guardrails

- A Problem describes an unmet need rather than forcing one implementation.
- Multiple Projects may eventually form under one Problem.
- Public aggregate demand must not reveal who signalled privately.
- No arbitrary popularity score, comments feed, recommendation algorithm, or repository requirement enters this slice.
- User text is rendered as plain text for the first checkpoint; unsafe HTML is never trusted.
- RLS is defense in depth; server actions still enforce centralized capability decisions.
- Rate-limit and abuse-analysis requirements must be represented in the database/application contract before public write flows are called complete.

## Current state

Draft PR #61 is open. The recorded checkpoint contains the issue-linked branch claim and implementation plan; feature code and issue-specific verification remain pending.

## Next safe action

Design the database contract and negative authorization tests first, then generate types and add the smallest public read experience on top of that verified boundary.

## Likely sensitive areas

- new public/private Problem tables and aggregate read models;
- author/moderator capability decisions;
- revision history and status transitions;
- need-signal/follow uniqueness and reversal;
- public aggregation without identity disclosure;
- unsafe content, deceptive links, and rate-limit abuse.
