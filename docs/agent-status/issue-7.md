---
schema_version: "1"
issue: "7"
title: "Project formation, membership, stewardship, and honest status"
branch: "feat/7-project-formation"
work_state: "in_progress"
contributors: "@samir1234khans"
base_commit: "1031d6d7f2773d44ff189dfde3f67aafc52da1f8"
last_verified_commit: "1031d6d7f2773d44ff189dfde3f67aafc52da1f8"
updated_at_utc: "2026-08-28T19:52:00Z"
pull_request: "67"
verification_state: "implementation_plan_candidate_ci_pending"
---

# Issue #7 agent handoff

## Outcome

Deliver the first Project vertical slice under the merged Problem model: multiple solution Projects may coexist fairly under one Problem, each with explicit scope, non-goals, license, governance, onboarding, team roles, accountable stewardship, truthful lifecycle, and public status.

## Promoted contract

PR #65 merged at `1031d6d7f2773d44ff189dfde3f67aafc52da1f8` after exact-head repository, application/browser/axe, and database verification. `docs/PROJECTS.md` and the executable domain tests now establish:

- one parent Problem per Project and fair coexistence of alternatives;
- explicit Project lifecycle transitions;
- activation requirements for steward, license, scope, non-goals, governance, and onboarding;
- steward, maintainer, and contributor meaning;
- the final-steward departure guard;
- the invariant that ManyHands membership never grants GitHub repository permission;
- planned public/private data, route, accessibility, and negative-test boundaries.

## Active implementation checkpoint

Draft PR #67 on `feat/7-project-formation` begins the persistent database-to-browser implementation from that exact merged contract.

Current branch work:

- `docs/PROJECTS_IMPLEMENTATION_PLAN.md` defines the Project, membership, lifecycle-history, stewardship, RLS, RPC, generated-type, route, test, rollout, and rollback sequence.
- The first code checkpoint is intentionally ordered as immutable migration plus negative pgTAP evidence before generated TypeScript or user interface work.
- No Project table, RPC, public route, or protected management flow is claimed yet.

## Decisions another contributor must preserve

- Each Project belongs to exactly one Problem; multiple Projects may coexist without a winner flag.
- A Project cannot activate without a steward, license, scope, non-goals, governance, and onboarding information.
- The final steward cannot silently leave an active or proposed Project.
- Project membership is scoped and never grants GitHub repository access.
- Status changes must be explicit; no-op writes must not fabricate activity.
- Current public team context is separate from private invitations, internal reasons, reports, and moderation evidence.
- RLS will be defense in depth; server-side capability checks remain mandatory.

## Next safe action

1. Add the immutable Project, membership, lifecycle-history, and stewardship migration.
2. Add the negative pgTAP/RLS test plan in the same checkpoint.
3. Run a clean reset and warning-level database lint before generating types.
4. Add the minimum transactional RPC surface, including concurrent final-steward protection.
5. Regenerate types and extend centralized capabilities before public routes.

## Verification state

The active branch starts from `main` commit `1031d6d7f2773d44ff189dfde3f67aafc52da1f8`. The implementation-plan candidate and this handoff are awaiting Branch policy, Repository health, Application CI/browser evidence, and Database CI. `last_verified_commit` remains the verified base until an exact branch head completes those gates.

## Known limitations

- The active branch currently contains the implementation plan and handoff, not persistent Project behavior.
- Repository linking and verified GitHub permissions remain issue #10.
- Contribution Needs remain issue #8; Milestones and Evidence remain issue #9.
- Manual accessibility evidence must be recorded as the actual Project routes are implemented.

## Security-sensitive areas for the next checkpoint

- parent-Problem authorization;
- Project activation and lifecycle transitions;
- membership invitation/removal and role changes;
- final-steward concurrency;
- suspension and deletion-requested account behavior;
- private invitation/removal/moderation data;
- future repository-link claims and GitHub permission separation.
