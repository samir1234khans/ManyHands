# Problem directory implementation contract

This document explains the first issue #6 implementation checkpoint. It applies the normative meanings in [`PRODUCT.md`](PRODUCT.md) and [`DOMAIN_MODEL.md`](DOMAIN_MODEL.md); it does not redefine them.

## Product boundary

A **Problem** describes an unmet need before one repository or implementation becomes the default answer.

The first checkpoint supports:

- private drafts;
- publication and public revision history;
- public discovery and detail pages;
- one reversible **“I need this”** signal per active account and Problem;
- one reversible follow per active account and Problem;
- optional private need-signal context;
- aggregate public need/follow counts without exposing identities;
- close, reopen, and archive transitions for previously published Problems;
- moderation restriction/removal through a service-only operation;
- bounded interaction telemetry for abuse analysis and rate limiting.

It deliberately does not support Projects, comments, notifications, recommendation feeds, rich HTML, governance weight from signal counts, or automatically generated Problems.

## Database objects

The schema is introduced through immutable migrations under `supabase/migrations/`.

### Public tables

- `public.problems` — current Problem definition and lifecycle state.
- `public.problem_revisions` — immutable snapshots of meaningful definition changes.
- `public.problem_need_signals` — private per-account demand state and optional private context.
- `public.problem_follows` — private per-account follow state.

### Private tables

- `private.problem_interaction_events` — bounded append-only interaction transitions used for abuse analysis and the initial rate limit.
- `private.problem_moderation_events` — moderation-state history and private reasons.

### Public read model

`public.problem_directory` is a `security_invoker` view. It exposes only:

- published, closed, or previously published archived Problems;
- clear moderation state;
- public Problem content and freshness;
- optional public profile name/handle;
- aggregate need-signal and follow counts.

It never exposes signal/follow account identifiers or private signal context.

## Lifecycle

Allowed application transitions are:

```text
new → draft
new → published

draft → draft
 draft → published

published → published
published → closed
published → archived

closed → closed
closed → published
closed → archived

archived → archived
```

Important consequences:

- A draft is private to its author and authorized moderation/administration boundaries.
- A published slug becomes stable.
- Closing states that the documented need is no longer currently open; reopening creates a new revision.
- Archiving preserves previously public history. An unpublished draft cannot become public merely by being archived.
- Moderation restriction/removal hides the Problem and its public revision history without erasing the author's private record or prior attribution.

## Revision history

Every successful create or update through `public.save_problem` records an immutable `problem_revisions` snapshot.

- The first private draft revision is not public.
- A publication or later public update creates a public revision.
- Public readers see only public revisions while the parent Problem remains in a public, clear state.
- The author can inspect their complete revision history, including the initial draft.
- Every update to an existing Problem requires a 5–500 character change summary.

The current table is mutable because it represents the latest definition; the revision table preserves historical meaning.

## Authorization and RLS

Application authorization is centralized in `packages/domain/src/authorization.ts` through:

- `problem.create`
- `problem.read`
- `problem.update`
- `problem.interact`

Server actions check those capabilities. The database then enforces the same boundary again.

### Public reads

Anonymous and authenticated users may read a Problem only when:

- status is `published`, `closed`, or a previously published `archived` record;
- `published_at` is present;
- moderation state is `clear`.

### Owner reads

An authenticated account can read its own drafts and moderated Problem records. This preserves author visibility without publishing them.

### Writes

No ordinary client role receives direct insert, update, or delete grants on Problem tables. Writes use narrowly granted `SECURITY DEFINER` functions with empty `search_path` values:

- `public.save_problem`
- `public.toggle_problem_need_signal`
- `public.toggle_problem_follow`
- `public.current_problem_interactions`

An active internal account is required. Suspended and deletion-requested accounts retain attribution but cannot write.

### Moderation

`public.admin_set_problem_moderation` is executable only by `service_role`. The first checkpoint intentionally does not expose a moderator UI; issue #12 will add scoped moderator capabilities, conflict handling, notices, appeals, and full audit behavior.

## “I need this”

The signal is designed as demand context, not reputation or governance.

- Each active account has at most one current signal per Problem through a composite primary key.
- Calling the toggle again removes the current signal.
- Optional context is limited to 500 characters and is visible only to the signalling account in this checkpoint.
- Public readers see only an aggregate count.
- Signal count does not rank contributors, grant decision power, reserve future work, or prove market demand.
- Every add/remove transition writes a private event for abuse analysis.

## Follows

A follow is also unique and reversible per account/Problem.

The first checkpoint records state but does not promise notifications. The UI says so explicitly. Notification delivery should not be added until there is a clear, non-spammy update contract.

## Rate limiting and abuse analysis

The initial database guard rejects a signal/follow transition when the account already has 30 Problem interaction events within ten minutes.

This is intentionally simple and auditable. It is not the complete platform abuse system. Issue #12 must later add identity/IP/context-aware controls, reporting, moderator review, appeals, and operational metrics.

The private event table must not enter public exports, browser responses, or public telemetry.

## Input and content safety

The first checkpoint renders Problem text as plain text.

- React escapes markup.
- No raw HTML renderer is used.
- Title, summary, context, evidence, alternatives, list counts, and item lengths are bounded in application validation and database constraints.
- Slugs are lowercase letters, numbers, and single hyphens.
- Published slugs cannot change.
- Platform and tag values are normalized and deduplicated.
- Existing-solution guidance is useful but does not automatically block a distinct need.

A future Markdown feature requires a separate safe-rendering contract, deceptive-link handling, test fixtures, and security review.

## Public routes

- `/problems` — server-rendered directory, query form, empty/degraded states, and no-JavaScript explanation.
- `/problems/[slug]` — public definition, aggregate demand, author context, freshness, and public revisions.
- `/problems/new` — protected authoring flow with sign-in intent.
- `/problems/[slug]/edit` — protected owner revision and lifecycle flow.

Public reading remains useful without JavaScript. Search uses a normal GET form. When Supabase is not configured, the application shows an honest degraded state rather than a stack trace or invented content.

## Accessibility

Issue #6 inherits [`ACCESSIBILITY.md`](ACCESSIBILITY.md).

The checkpoint includes:

- semantic headings, sections, lists, forms, labels, and status text;
- visible skip-link destination;
- server-rendered public content and GET search;
- accessible form error summaries and associated field errors;
- preserved form values after validation failure;
- text alternatives for lifecycle and moderation state instead of color-only meaning;
- 320-pixel reflow checks;
- explicit consequences before authentication and before adding a need signal;
- reduced-motion and forced-colors compatibility inherited from the shared shell.

Manual screen-reader, keyboard, zoom/reflow, touch, and constrained-network evidence remains required before the parent issue can close.

## Verification

Run:

```bash
pnpm db:start
pnpm db:reset
pnpm db:test
pnpm db:lint
pnpm typecheck
pnpm test
pnpm build
pnpm test:e2e
pnpm db:stop
```

The database suite covers:

- function and table privileges;
- forced RLS and `security_invoker` read models;
- private drafts and revisions;
- publication and public revision visibility;
- unique reversible need/follow state;
- aggregate counts without public identities;
- cross-account write denial;
- stable published slugs;
- moderation restriction and owner visibility;
- suspended-account write denial;
- interaction-rate limiting.

The browser suite covers signed-out/degraded reading, no-JavaScript search, authentication intent, query escaping, narrow-screen overflow, and shared navigation.

## Known limitations

- Public search is an in-memory filter over the bounded server-fetched public read model. Issue #11 will add PostgreSQL-backed ranked search, stable pagination, explainable filters, and quality measurement.
- Optional need context is not yet visible to maintainers because Projects and contributor handoff do not exist.
- Follows do not deliver notifications.
- Moderator UI, notices, appeals, and richer abuse controls are deferred to issue #12.
- Duplicate guidance is a search link and content instruction, not automated similarity blocking.
- Rich text is intentionally absent.
