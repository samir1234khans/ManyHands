# Project database-to-browser implementation plan

**Issue:** #7  
**Branch:** `feat/7-project-formation`  
**Base:** `1031d6d7f2773d44ff189dfde3f67aafc52da1f8`  
**Status:** active implementation plan; no Project table or route is claimed until its exact checkpoint passes CI.

This plan turns the merged contract in [`PROJECTS.md`](PROJECTS.md) into a sequence of independently reviewable database, authorization, server-rendered, and management checkpoints. It deliberately starts with persistent invariants and negative tests before adding UI.

## Outcome

The first complete Project vertical slice will allow:

- signed-out visitors to browse public Projects under a public Problem and understand status, scope, non-goals, license, stewardship, and last meaningful update;
- active signed-in contributors to propose a Project under an existing Problem;
- a proposal to activate only after every accountability requirement is present;
- authorized Project members to manage lifecycle, membership, and stewardship without gaining global or GitHub permissions;
- the final steward to hand off responsibility, pause, request stewardship, complete, or archive rather than silently leaving;
- attribution and public history to survive role changes, suspension, removal, and account deletion.

## Delivery checkpoints

### Checkpoint A — immutable data and RLS foundation

Add one immutable migration plus pgTAP coverage for the persistent model.

#### `public.projects`

Planned core columns:

- stable UUID primary key;
- `problem_id` referencing an existing `public.problems` row;
- stable, unique public slug;
- creator account and current lifecycle state;
- solution statement and intended users;
- scope and explicit non-goals;
- technical direction;
- SPDX-compatible license identifier or bounded public license text;
- governance URL or bounded governance summary;
- onboarding summary;
- meaningful lifecycle timestamps;
- revision/update counters only where they express real public history;
- moderation state separate from ordinary Project lifecycle.

The Project must not rewrite or own the parent Problem. Multiple public Projects may reference the same Problem.

#### `public.project_memberships`

Planned current-state columns:

- Project and account composite identity;
- current role: steward, maintainer, or contributor;
- current membership state;
- accepted and ended timestamps;
- public-visibility choice where current team display requires it.

Current membership is not the audit record.

#### Append-only history

Add append-only records for:

- Project lifecycle transitions;
- membership invitations/requests, acceptance, decline, role changes, removal, and departure;
- stewardship handoff or request-for-steward events.

Public history must exclude private invitation messages, internal removal reasons, reports, moderation evidence, email, and provider identity.

#### Public read models

Create `security_invoker` views for:

- a Project directory ordered by stable, explainable fields;
- Project detail with parent Problem context;
- public current team context;
- public lifecycle history.

The views must permit sibling Projects under one Problem and must not expose a winner flag, private membership state, or GitHub permission claim.

#### Grants and RLS

- Revoke legacy/default grants and opt in only required operations.
- Enable and force RLS on every persistent table.
- Anonymous users read only public, clear, intentionally published records.
- Authenticated users may read their own private proposal/membership state where required.
- Direct table writes remain unavailable to ordinary clients; writes use narrow RPCs.
- Service-role operations are explicit and tested, not inferred from table ownership.

### Checkpoint B — transactional application API

Every `SECURITY DEFINER` function uses an empty search path, derives caller identity from the session, validates bounded input, and exposes the least return data necessary.

Planned operations:

- create a private Project proposal under an existing readable Problem;
- revise a proposal or active Project when the caller has the required capability;
- activate only after the executable activation assessment and database invariants pass;
- pause, resume, request stewardship, complete, or archive through explicit transition rules;
- invite/request membership and accept/decline without leaking private invitation data;
- change roles through scoped capabilities;
- leave or remove membership while preserving history;
- hand off stewardship transactionally;
- prevent concurrent final-steward departures;
- apply service-only moderation state without conflating it with lifecycle.

The database must enforce the final-steward invariant even when two requests race. Application checks alone are insufficient.

### Checkpoint C — generated types and centralized authorization

- Regenerate committed `public` and `private` database types from a clean migrated database.
- Add real data-package aliases for Project directory/detail/membership rows.
- Extend centralized authorization with narrowly named capabilities such as Project create, read, update, lifecycle, membership, and stewardship operations.
- Keep global moderation, Project membership, and GitHub repository permission distinct.
- Add unit tests for anonymous, contributor, maintainer, steward, suspended, deletion-requested, and cross-Project cases.

### Checkpoint D — public server-rendered experience

Add the smallest useful public experience before protected management complexity:

- `/projects` — public directory and useful unconfigured/empty state;
- `/projects/[slug]` — Project detail with parent Problem, status, scope, non-goals, license, governance/onboarding, steward/team context, and last meaningful update;
- sibling Project links on the parent Problem without declaring a winner.

Requirements:

- meaningful output without client JavaScript;
- stable canonical URLs;
- semantic headings and relationship labels;
- textual lifecycle state rather than color-only status;
- 320-pixel reflow and high-zoom resilience;
- axe checks plus manual evidence planning;
- no repository-verification claim before issue #10.

### Checkpoint E — protected proposal and management journeys

Add:

- `/problems/[problem-slug]/projects/new` for proposal;
- `/projects/[slug]/edit` for authorized scope/accountability updates;
- `/projects/[slug]/team` for invitations, roles, departure, and stewardship handoff.

Protected routes must explain identity before redirecting and preserve same-origin return intent. Forms need persistent labels, visible constraints, input preservation, field-associated errors, an error summary, and explicit destructive consequences.

## Required database evidence

The first migration checkpoint is not review-ready without tests for:

- two or more public active Projects under one Problem;
- a nonexistent, private, restricted, or removed parent Problem;
- anonymous public reads and private proposal isolation;
- activation missing each required accountability field;
- creator, contributor, maintainer, steward, global moderator, and unrelated-account boundaries;
- cross-Project writes;
- suspended and deletion-requested accounts;
- stable public slugs and truthful timestamps;
- no-op transitions not creating fake activity;
- final active steward departure;
- concurrent stewardship handoff/departure;
- membership invitation privacy;
- role removal with preserved attribution/history;
- moderation hiding public output without erasing records;
- membership never granting GitHub repository permission.

## Required application and browser evidence

- public directory/detail rendering when configured;
- useful degraded state when Supabase is absent or unavailable;
- signed-out and JavaScript-disabled reading;
- safe return intent before proposal/management;
- inaccessible or unauthorized routes fail without leaking resource existence;
- validation preserves data and associates errors;
- lifecycle and stewardship consequences are readable;
- sibling Projects remain visible and understandable;
- unsafe markup and deceptive links are harmless;
- narrow viewport, zoom/reflow, reduced motion, forced colors, touch targets, and keyboard operation;
- axe scans with no disabled rules;
- manual evidence recorded using `docs/accessibility/MANUAL_TEST_TEMPLATE.md` as routes become real.

## Rollout and rollback

- Migrations are immutable after merge.
- A checkpoint may merge only when a clean database reset, pgTAP suite, warning-level database lint, generated-type drift check, application suite, browser evidence, and repository-health checks pass on the exact head.
- Public views should remain empty rather than exposing partial/private data when no Project is published.
- The first release does not require a data backfill because no Project production records exist yet.
- Rollback of application code must remain compatible with already-applied migrations; forward-fix is preferred when reverting would strand durable records.

## Explicitly deferred

- Contribution Needs and “I can help” (#8);
- Milestones, blockers, Evidence, and derived progress (#9);
- GitHub App installation, repository verification, and synchronization (#10);
- ranked search/recommendations (#11);
- complete reporting, appeals, and moderation UI (#12);
- Project Health automation and wider stewardship workflows (#13);
- paid roles, bounties, organizations, private enterprise workspaces, comments, and chat.

## Immediate next actions

1. Write the immutable Project/membership/history migration and its negative pgTAP plan together.
2. Run a clean reset before generating any TypeScript boundary.
3. Add only the smallest RPC surface needed for proposal, activation, lifecycle, membership, and stewardship invariants.
4. Regenerate committed types and extend centralized capabilities.
5. Publish the public directory/detail checkpoint before protected team-management UI.
