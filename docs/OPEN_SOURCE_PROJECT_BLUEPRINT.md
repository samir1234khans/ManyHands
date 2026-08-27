# Reusable Open-Source Project Blueprint

ManyHands is intentionally setting up its repository in a way that can be reused for future community projects.

## Before code

Create and agree on:

1. **Problem statement** — who experiences the need and what evidence exists.
2. **Product contract** — core users, flows, scope, non-goals, and success test.
3. **Constitution** — promises that should not drift under delivery pressure.
4. **Domain model** — shared nouns, states, relationships, and invariants.
5. **Architecture direction** — boundaries, trust model, data ownership, and deployment.
6. **Governance** — roles, decisions, conflicts, succession, and handoff.
7. **License** — chosen before accepting outside contributions.
8. **Safety baseline** — conduct, vulnerability reporting, moderation, privacy, and abuse risks.

## Repository minimum

```text
README.md
LICENSE
CONTRIBUTING.md
GOVERNANCE.md
CODE_OF_CONDUCT.md
SECURITY.md
CHANGELOG.md
docs/
  CONSTITUTION.md
  PRODUCT.md
  DOMAIN_MODEL.md
  ARCHITECTURE.md
  ROADMAP.md
  decisions/
.github/
  CODEOWNERS
  PULL_REQUEST_TEMPLATE.md
  ISSUE_TEMPLATE/
  workflows/
```

## Issue system

Create one roadmap issue and one issue per real outcome. Each issue needs acceptance criteria and a named owner or an explicit `help wanted` state.

Recommended starting labels:

- type: `bug`, `enhancement`, `documentation`, `security`
- participation: `good first issue`, `help wanted`, `needs decision`
- area: `identity`, `problems`, `projects`, `contributions`, `github`, `discovery`, `trust`, `accessibility`, `infrastructure`
- state: `blocked`, `needs reproduction`, `needs design`, `ready`

Do not create dozens of empty epics merely to look organized.

## Branch model

Use a protected `main` and short-lived issue branches. Avoid a permanent `develop` branch until a release process genuinely requires it. Tie branches and pull requests to issues.

## Contributor launch test

Before publicly asking for help, ask a person unfamiliar with the project to:

1. explain the mission from the README;
2. find a suitable issue;
3. understand local setup;
4. make a small change;
5. run validation;
6. submit a pull request;
7. understand what happens next.

Every point of confusion becomes repository work.

## Community launch

- Publish a small number of valuable, well-scoped issues.
- Keep building visibly instead of waiting passively.
- Respond quickly enough that a contributor does not disappear into silence.
- Celebrate non-code work.
- Show honest progress and blockers.
- Invite forks without confusing them with the official instance.
- Create a handoff path before the original maintainer needs one.

## Reuse rule

Copy this structure, then rewrite the product-specific content. Do not cargo-cult technology or governance that does not fit the new project.
