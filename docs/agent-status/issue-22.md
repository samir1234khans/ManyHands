---
schema_version: "1"
issue: "22"
title: "Product information architecture and accessible core flows"
branch: "design/22-product-information-architecture"
work_state: "merged"
contributors: "@samir1234khans"
base_commit: "c2574d150ee3c82172092e6d49f446f43dfbac91"
last_verified_commit: "8a864a20c41ae1be5a43293ea42f044a59e52e7c"
updated_at_utc: "2026-08-28T03:46:00Z"
pull_request: "59"
verification_state: "information_architecture_checkpoint_merged_comprehension_review_open"
---

# Issue #22 agent handoff

## Merged checkpoint

PR #59 merged the versioned product information-architecture and low-fidelity interaction handoff as `8a864a20c41ae1be5a43293ea42f044a59e52e7c`.

The checkpoint defines:

- signed-out, signed-in, and moderator navigation;
- route and entity hierarchy for Problem → multiple Projects → Contribution Needs / Milestones / Evidence;
- directory, detail, authoring, and operational page structures;
- Problem, Project, Need, **“I need this”**, **“I can help”**, Milestone, Evidence, Health, profile, and account-state behavior;
- desktop and mobile low-fidelity wireframes and state diagrams;
- responsive, keyboard, screen-reader, focus, reduced-motion, contrast, announcement, and content rules;
- a deliberately small semantic token and component inventory tied to real flows;
- an engineering delivery sequence, UI acceptance notes, comprehension script, and open questions.

The document is working design guidance. It does not override `CONSTITUTION.md`, `PRODUCT.md`, or `DOMAIN_MODEL.md`.

## Parent issue remains open

Issue #22 still requires:

1. Run the comprehension script with at least one person unfamiliar with ManyHands.
2. Record whether they distinguish Problem, Project, Contribution Need, Milestone, Evidence, and Health without coaching.
3. Test whether the consequences of **“I need this”** and **“I can help”** are understood before authentication.
4. Revise terminology, hierarchy, and mobile behavior from evidence rather than preference.
5. Add route-specific implementation and accessibility evidence as issues #6–#14 ship.

## Decisions that must not be reversed

- Problem and Project remain structurally and visually distinct.
- Multiple Projects under one Problem are compared fairly without declaring a popularity winner.
- Non-code Contribution Needs receive equal legitimacy.
- Mobile and constrained devices are primary design contexts, not collapsed desktop leftovers.
- Status and Health are understandable without color or motion alone.
- Polished visual styling follows route, state, and recovery clarity.

## Next safe action

Use the issue #6 Problem directory and authoring flow as the first implementation/comprehension test. Record misunderstandings and update this handoff rather than silently changing the normative model.
