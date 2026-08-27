# ManyHands documentation map

This page helps you find the right document without reading the repository in alphabetical order.

## Start here

A first-time contributor can understand the project in roughly this order:

1. [`../README.md`](../README.md) — mission, current product status, local setup, and the open-source invitation.
2. [`../AGENTS.md`](../AGENTS.md) — verified operational status, active branch, commands, source-of-truth hierarchy, and handoff rules.
3. [`CONSTITUTION.md`](CONSTITUTION.md) — promises that product, architecture, governance, and funding decisions must preserve.
4. [`PRODUCT.md`](PRODUCT.md) — users, v0 scope, explicit non-goals, critical flows, and the self-hosting acceptance test.
5. [`../CONTRIBUTING.md`](../CONTRIBUTING.md) — how to claim work, create a branch, verify changes, open a pull request, and clean up afterward.
6. [`ROADMAP.md`](ROADMAP.md) and the [public roadmap issue](https://github.com/samir1234khans/ManyHands/issues/2) — implementation order and current outcomes.
7. [`BRANCHING.md`](BRANCHING.md) — issue-linked branch naming, draft-work promotion, handoff, review, merge, and cleanup.

After that, choose the path matching the work you intend to do.

## Document authority

Not every document has the same role.

### Normative contracts

These define commitments. A change that conflicts with them requires an explicit proposal and coordinated updates, not a quiet implementation shortcut.

- [`CONSTITUTION.md`](CONSTITUTION.md) — highest-level product and community promises.
- [`PRODUCT.md`](PRODUCT.md) — product scope, users, flows, rules, and success criteria.
- [`DOMAIN_MODEL.md`](DOMAIN_MODEL.md) — authoritative meanings, relationships, states, and authorization invariants.
- [`../GOVERNANCE.md`](../GOVERNANCE.md) — roles, decision process, conflicts, succession, and removal.
- [`../CODE_OF_CONDUCT.md`](../CODE_OF_CONDUCT.md) — required community behavior and enforcement scope.
- [`../SECURITY.md`](../SECURITY.md) — vulnerability reporting and baseline security requirements.
- [`../LICENSE`](../LICENSE), [`../NOTICE`](../NOTICE), and [`LICENSING.md`](LICENSING.md) — legal terms and the practical AGPL explanation.

### Accepted decisions

Architecture Decision Records explain decisions that are costly to rediscover or difficult to reverse. An accepted ADR takes precedence over general guidance until it is superseded by another ADR.

- [`decisions/README.md`](decisions/README.md) — status values, ADR template, and numbering rules.
- [`decisions/0001-problem-first-github-boundary.md`](decisions/0001-problem-first-github-boundary.md) — ManyHands owns coordination; GitHub owns code.
- [`decisions/0002-initial-technology-direction.md`](decisions/0002-initial-technology-direction.md) — TypeScript, Next.js, PostgreSQL/Supabase, modular monolith, and GitHub integration direction.
- [`decisions/0003-stable-identity-and-public-read-models.md`](decisions/0003-stable-identity-and-public-read-models.md) — stable internal identity, privacy-safe public profile models, explicit grants, and RLS.

Write a new ADR when a decision changes a durable boundary, trust model, data-ownership rule, deployment model, major dependency direction, or another choice future contributors would otherwise repeatedly debate. Routine implementation choices belong in the issue or pull request instead.

### Operational guidance and playbooks

These explain how to apply the contracts and decisions. They should be updated when the real workflow changes.

- [`ACCESSIBILITY.md`](ACCESSIBILITY.md) — WCAG 2.2 AA target, interaction rules, automated checks, and manual evidence protocol.
- [`ARCHITECTURE.md`](ARCHITECTURE.md) — system boundaries, modules, GitHub integration rules, threat model, data consistency, observability, and delivery strategy.
- [`DEVELOPMENT.md`](DEVELOPMENT.md) — local setup, repository shape, commands, CI, dependency policy, testing, accessibility, and troubleshooting.
- [`DATABASE.md`](DATABASE.md) — local Supabase, migrations, grants, RLS, pgTAP, generated types, and database operations.
- [`DATA_LIFECYCLE.md`](DATA_LIFECYCLE.md) — retention, suspension, export, deletion, and attribution-preserving anonymization.
- [`BRANCHING.md`](BRANCHING.md) — branch lifecycle and work promotion.
- [`AI_CONTRIBUTIONS.md`](AI_CONTRIBUTIONS.md) — responsible AI assistance, disclosure, prohibited practices, and human accountability.
- [`MAINTAINER_PLAYBOOK.md`](MAINTAINER_PLAYBOOK.md) — issue quality, triage, review, release, inactivity, and recognition.
- [`LAUNCH_PLAYBOOK.md`](LAUNCH_PLAYBOOK.md) — founding-community launch conditions, outreach, recognition, and dogfooding loop.
- [`REPOSITORY_SETTINGS.md`](REPOSITORY_SETTINGS.md) — intended GitHub settings, rulesets, merge policy, labels, milestones, Actions, and security controls.
- [`OPEN_SOURCE_PROJECT_BLUEPRINT.md`](OPEN_SOURCE_PROJECT_BLUEPRINT.md) — reusable setup for future community projects.
- [`ROADMAP.md`](ROADMAP.md) — phase outcomes and release shape.
- [`../CHANGELOG.md`](../CHANGELOG.md) — notable repository and product changes.

### Temporary operational handoffs

- [`agent-status/README.md`](agent-status/README.md) — when and how to create an issue-specific handoff.
- [`agent-status/issue-5.md`](agent-status/issue-5.md) — current identity-work handoff. This file is temporary and should disappear after issue #5 merges.
- [`../AI_agent.md`](../AI_agent.md) — compatibility pointer to the canonical [`../AGENTS.md`](../AGENTS.md); it intentionally contains no duplicate status.

GitHub issues, pull requests, commits, and CI remain authoritative when a temporary handoff becomes stale.

## Reading paths by contribution type

### Engineering

1. [`ARCHITECTURE.md`](ARCHITECTURE.md)
2. [`DEVELOPMENT.md`](DEVELOPMENT.md)
3. [`ACCESSIBILITY.md`](ACCESSIBILITY.md)
4. [`DOMAIN_MODEL.md`](DOMAIN_MODEL.md)
5. Relevant ADRs under [`decisions/`](decisions/README.md)
6. [`DATABASE.md`](DATABASE.md) and [`DATA_LIFECYCLE.md`](DATA_LIFECYCLE.md) for schema, identity, authorization, or lifecycle work
7. The active issue and its matching handoff under [`agent-status/`](agent-status/README.md)

### Product and design

1. [`CONSTITUTION.md`](CONSTITUTION.md)
2. [`PRODUCT.md`](PRODUCT.md)
3. [`DOMAIN_MODEL.md`](DOMAIN_MODEL.md)
4. [`ROADMAP.md`](ROADMAP.md)
5. [`ARCHITECTURE.md`](ARCHITECTURE.md), especially public/private data and accessibility constraints
6. The product-design and research issues linked from the public roadmap

### Security and privacy review

1. [`../SECURITY.md`](../SECURITY.md)
2. [`ARCHITECTURE.md`](ARCHITECTURE.md), especially trust boundaries and threat model
3. [`ACCESSIBILITY.md`](ACCESSIBILITY.md), especially accessible authentication and public reporting
4. [`DATABASE.md`](DATABASE.md)
5. [`DATA_LIFECYCLE.md`](DATA_LIFECYCLE.md)
6. [`decisions/0003-stable-identity-and-public-read-models.md`](decisions/0003-stable-identity-and-public-read-models.md)
7. Relevant migrations, negative tests, and the active issue handoff

Report a vulnerability privately through the route documented in [`../SECURITY.md`](../SECURITY.md); never place exploit details in a public issue or status file.

### Community, moderation, and contributor care

1. [`../CODE_OF_CONDUCT.md`](../CODE_OF_CONDUCT.md)
2. [`../GOVERNANCE.md`](../GOVERNANCE.md)
3. [`PRODUCT.md`](PRODUCT.md), especially users and product rules
4. [`MAINTAINER_PLAYBOOK.md`](MAINTAINER_PLAYBOOK.md)
5. [`LAUNCH_PLAYBOOK.md`](LAUNCH_PLAYBOOK.md)
6. [`AI_CONTRIBUTIONS.md`](AI_CONTRIBUTIONS.md)

### Maintainers

1. [`../AGENTS.md`](../AGENTS.md)
2. [`../GOVERNANCE.md`](../GOVERNANCE.md)
3. [`MAINTAINER_PLAYBOOK.md`](MAINTAINER_PLAYBOOK.md)
4. [`BRANCHING.md`](BRANCHING.md)
5. [`REPOSITORY_SETTINGS.md`](REPOSITORY_SETTINGS.md)
6. [`ROADMAP.md`](ROADMAP.md)
7. [`LAUNCH_PLAYBOOK.md`](LAUNCH_PLAYBOOK.md)

### Operations and self-hosting

1. [`DEVELOPMENT.md`](DEVELOPMENT.md)
2. [`DATABASE.md`](DATABASE.md)
3. [`DATA_LIFECYCLE.md`](DATA_LIFECYCLE.md)
4. [`ARCHITECTURE.md`](ARCHITECTURE.md), especially deployment, observability, and consistency
5. [`REPOSITORY_SETTINGS.md`](REPOSITORY_SETTINGS.md)
6. [`LICENSING.md`](LICENSING.md)
7. Operations issue #16 for deployment, backups, export, recovery, and self-hosting work still in progress

### AI-assisted contributors

1. [`../AGENTS.md`](../AGENTS.md)
2. [`AI_CONTRIBUTIONS.md`](AI_CONTRIBUTIONS.md)
3. [`BRANCHING.md`](BRANCHING.md)
4. [`agent-status/README.md`](agent-status/README.md)
5. The relevant normative and technical documents for the issue

## Keeping this map accurate

When adding, renaming, or removing a documentation file:

1. place it in the appropriate section above;
2. state whether it is normative, an accepted decision, operational guidance, or a temporary handoff;
3. update any affected reading paths;
4. verify every relative link from GitHub’s rendered `docs/README.md` view;
5. avoid duplicating the full contents of the linked document.

A useful map should make the repository easier to enter without becoming a second copy of the repository.