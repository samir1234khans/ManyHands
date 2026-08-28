# Project formation contract

**Status:** working, executable contract for issue #7. This document defines the first safe implementation boundary; it does not claim that the Project database or user interface already exists.

A ManyHands **Problem** describes an unmet need. A **Project** is one proposed or operating solution under that Problem. The Problem remains independently understandable, and more than one Project may coexist without the earliest or loudest team becoming the permanent default.

## Product outcome

The first Project vertical slice should let:

- a signed-out visitor see the Projects attached to a public Problem and understand how they differ;
- an active signed-in contributor propose a Project with explicit scope and accountability;
- a Project become active only after it has a steward, license, scope, non-goals, governance, and onboarding information;
- authorized members maintain Project status and membership without receiving unrelated global or GitHub permissions;
- a Project pause, request stewardship, complete, or archive without disguising inactivity;
- attribution and role/status history survive removal, suspension, and handoff.

## Relationship to Problems

Each Project belongs to exactly one existing Problem.

The relationship has four invariants:

1. The parent Problem is not rewritten into the Project’s marketing statement.
2. A Project cannot make itself the official or exclusive answer merely by existing first.
3. Multiple active, paused, completed, or archived Projects may be visible under the same Problem.
4. Project status, popularity, repository activity, or need-signal count never deletes or hides a credible sibling Project by default.

A future merge or recommendation model may help people compare approaches, but it must preserve alternatives and explain its evidence.

## Project lifecycle

The first domain contract uses these states:

| State | Meaning | Public behavior |
|---|---|---|
| `proposed` | The solution definition is being prepared and is not yet an operating Project. | Visible only to authorized participants until the proposal is intentionally published by the later application boundary. |
| `active` | The Project has the required accountability fields and is accepting work. | Public, with steward, scope, license, governance/onboarding context, and last meaningful update. |
| `paused` | Work is intentionally stopped; the reason and next review point should be explicit. | Public and clearly labelled as paused without implying recent progress. |
| `seeking_steward` | The Project cannot continue normally without a new accountable steward. | Public, with a direct stewardship need rather than a vague “inactive” badge. |
| `completed` | The stated Project outcome is complete for the recorded scope. | Public with completion Evidence and no implication that every possible solution is finished. |
| `archived` | The record is retained but no longer operated. | Public when it was previously public, with historical attribution and an archival explanation. |

Allowed meaningful transitions are deliberately narrow:

- `proposed` → `active` or `archived`;
- `active` → `paused`, `seeking_steward`, `completed`, or `archived`;
- `paused` → `active`, `seeking_steward`, or `archived`;
- `seeking_steward` → `active`, `paused`, or `archived`;
- `completed` → `archived`;
- `archived` has no ordinary outgoing transition.

A no-op status write is not a lifecycle transition and must not create fake activity.

## Activation requirements

A proposal cannot become active until all of these are present:

- at least one current steward;
- a declared software or content license;
- a concrete solution scope;
- explicit non-goals;
- governance information or a public governance link;
- an onboarding summary describing how a new participant begins.

The executable domain helper `evaluateProjectActivation` reports every missing requirement rather than returning one opaque failure. The later form and server action should map those gaps to accessible field errors and preserve entered values.

Activation readiness does not prove quality, popularity, feasibility, or endorsement. It proves only that the Project is accountable enough to operate publicly.

## Membership and roles

The first membership roles are:

### Steward

A steward is accountable for truthful Project scope, status, membership, and handoff. A steward may delegate work but cannot delegate away responsibility without a recorded transfer.

### Maintainer

A maintainer can operate the Project within centrally granted capabilities. Maintainer status is scoped to one Project and does not create global moderation or account-administration permission.

### Contributor

A contributor is a recognized Project participant. Contributor membership may support attribution and onboarding, but it does not automatically authorize scope, status, membership, or stewardship changes.

Project-level moderation, where required, remains a separate authorization concern. It must not be smuggled into ordinary membership roles.

## Final-steward rule

The last steward cannot silently leave an active or proposed Project.

Before departure, one of these must happen:

- another steward accepts responsibility;
- the Project is explicitly paused;
- the Project enters `seeking_steward`;
- the Project is completed or archived with an honest public record.

The executable helper `evaluateProjectMemberDeparture` encodes the first domain version of this rule. The database implementation must enforce the same invariant transactionally so concurrent requests cannot leave an active Project stewardless.

## Membership transitions and history

The data slice should support explicit, auditable transitions rather than overwriting one role field:

- invitation or membership request;
- acceptance or decline;
- role change;
- voluntary departure;
- removal by an authorized capability;
- stewardship handoff;
- suspension-derived write lock without erasing prior attribution.

A public Project page may show current public team information. Private invitation details, internal removal reasons, reports, email, OAuth identity, and moderator evidence never belong in the public read model.

## GitHub boundary

**ManyHands Project membership never grants GitHub repository permission.**

A steward, maintainer, or contributor may have no access to a linked repository. Conversely, a GitHub collaborator may not be a ManyHands Project member. Repository installation and permission review belong to issue #10.

The first Project slice may store a public repository-link placeholder or user-supplied public URL, but it must not:

- install the ManyHands GitHub App;
- request repository permissions;
- infer stewardship from a GitHub role;
- claim that a repository is verified before the GitHub bridge verifies it.

The executable helper `projectMembershipGrantsRepositoryPermission` intentionally returns `false` for every membership role.

## Fair presentation of sibling Projects

The public Problem page should present sibling Projects using understandable evidence such as:

- Project status;
- scope and non-goals;
- last meaningful update;
- steward and team context;
- later Milestones, Evidence, Contribution Needs, and Health.

The first slice should use stable, explainable ordering, not a “winner” score. Raw follows, early attention, maintainer fame, employer, geography, or repository stars must not silently erase alternatives.

## Planned data boundary

The database implementation should introduce immutable migrations for at least:

- `projects` with parent Problem, slug, lifecycle, scope, non-goals, intended users, technical direction, license, governance, onboarding, and meaningful timestamps;
- `project_memberships` with current role/state and account references;
- append-only membership and role history;
- append-only Project status history;
- stewardship handoff/request records;
- a privacy-safe public Project directory/detail read model;
- narrowly scoped SECURITY DEFINER operations for proposal, activation, lifecycle, membership, and stewardship transitions.

Every exposed object requires explicit grants. Tables require forced RLS. SECURITY DEFINER functions require an empty search path, no caller-controlled identity parameter, bounded input, and negative tests.

Server actions must still enforce centralized capabilities. RLS remains defense in depth.

## Planned route boundary

The first server-rendered route shape is expected to include:

- `/projects` — public Project directory or a useful degraded state;
- `/projects/[slug]` — public Project detail;
- `/problems/[problem-slug]/projects/new` — protected proposal flow;
- `/projects/[slug]/edit` — authorized scope/status management;
- `/projects/[slug]/team` — authorized membership and stewardship management.

The exact route names may change through reviewed implementation, but the outcomes and authorization boundaries above should not quietly disappear.

Public pages must remain meaningful without client JavaScript. Protected routes must explain identity before redirecting and preserve safe return intent.

## Accessibility requirements

Project formation is not complete when only the pointer-based happy path works.

The first slice must include:

- logical headings and landmarks for Problem → Project relationships;
- textual status rather than color-only badges;
- persistent labels and constraints for proposal fields;
- error summaries and field associations that preserve entered data;
- keyboard-operable membership and lifecycle actions;
- explicit consequences for pause, archive, removal, and stewardship handoff;
- usable reflow at 320 CSS pixels and high zoom;
- reduced-motion and forced-colors behavior;
- axe coverage plus manual evidence using `docs/accessibility/MANUAL_TEST_TEMPLATE.md`.

## Required negative evidence

Before a database-to-browser checkpoint is review-ready, tests should cover:

- two active Projects under one Problem without one hiding the other;
- a Project referencing a nonexistent or unauthorized Problem;
- activation without a steward or another required accountability field;
- cross-Project scope, status, or membership writes;
- contributor or maintainer attempts to perform steward-only operations;
- final active steward departure;
- concurrent stewardship changes;
- suspended and deletion-requested accounts;
- role removal with preserved historical attribution;
- membership that does not create GitHub permission;
- public reads that exclude private invitations and internal reasons;
- unsafe markup, deceptive links, malformed input, and narrow-screen output.

## Intentional non-goals for the first slice

- selecting an official winning Project;
- GitHub App installation or repository synchronization;
- Contribution Needs or “I can help” flows, which belong to issue #8;
- Milestones, blockers, Evidence, or derived progress, which belong to issue #9;
- recommendation feeds, reputation, bounties, paid roles, or private enterprise workspaces;
- a general organization/teams product;
- comments or chat.

## Delivery sequence

1. Review this domain and interaction contract against issue #7 and the Problem model.
2. Implement immutable migrations, RLS, lifecycle operations, generated types, and pgTAP evidence.
3. Extend centralized Project capabilities and server-side data boundaries.
4. Add the smallest public directory/detail experience.
5. Add proposal, lifecycle, team, and stewardship journeys.
6. Run exact-head application, browser, database, accessibility, privacy, and rollback review.

A coherent checkpoint may reach `main` before every field exercise is complete, but remaining evidence must stay explicit on issue #7. Green automation never converts unknown manual behavior into a passing result.
