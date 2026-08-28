---
schema_version: "1"
issue: "7"
title: "Project formation, membership, stewardship, and honest status"
branch: "design/7-project-formation-contract"
work_state: "in_progress"
contributors: "@samir1234khans"
base_commit: "793782732af032d9014dad3b935950ec2d013a29"
last_verified_commit: "793782732af032d9014dad3b935950ec2d013a29"
updated_at_utc: "2026-08-28T19:35:00Z"
pull_request: "0"
verification_state: "contract_implementation_not_yet_verified"
---

# Issue #7 agent handoff

## Outcome

Deliver the first Project vertical slice under the merged Problem model: multiple solution Projects may coexist fairly under one Problem, each with explicit scope, non-goals, license, governance, onboarding, team roles, accountable stewardship, truthful lifecycle, and public status.

## Current checkpoint

This branch begins with a substantive contract rather than an empty placeholder:

- `docs/PROJECTS.md` defines the Problem→Project relationship, lifecycle, activation requirements, roles, final-steward rule, membership history, GitHub boundary, public read model, accessibility obligations, negative evidence, and delivery sequence.
- `packages/domain/src/projects.ts` encodes the initial lifecycle transition table, activation-gap assessment, final-steward departure guard, and the invariant that ManyHands membership never grants GitHub repository permission.
- `tests/unit/project-contract.test.ts` exercises the accountability, lifecycle, stewardship, and permission boundaries.

## Decisions another contributor must preserve

- Each Project belongs to exactly one Problem; multiple Projects may coexist without a winner flag.
- A Project cannot activate without a steward, license, scope, non-goals, governance, and onboarding information.
- The final steward cannot silently leave an active or proposed Project.
- Project membership is scoped and never grants GitHub repository access.
- Status changes must be explicit; no-op writes must not fabricate activity.
- Current public team context is separate from private invitations, internal reasons, reports, and moderation evidence.
- RLS will be defense in depth; server-side capability checks remain mandatory.

## Next implementation checkpoint

1. Review the contract against issue #7 and the existing Problem/identity boundaries.
2. Add immutable Project, membership, history, and stewardship migrations with explicit grants and forced RLS.
3. Add transactional activation, lifecycle, membership, and final-steward operations plus pgTAP negative tests.
4. Generate typed data boundaries and extend centralized Project authorization.
5. Add the smallest server-rendered public Project directory/detail routes before protected management flows.

## Verification state

The branch starts from accessibility-hardened `main` commit `793782732af032d9014dad3b935950ec2d013a29`. The new contract code, tests, and documentation have not yet passed the pull-request gates. The exact branch commit and pull request will replace the placeholder values above after the first commit is created.

## Known limitations

- No Project database, public route, or protected management flow exists in this checkpoint yet.
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
