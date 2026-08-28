# ManyHands documentation map

This page helps contributors find the right source without reading the repository alphabetically. GitHub issues, pull requests, merged commits, and CI are authoritative for live execution state; documents explain the contract and how to work safely.

## Start here

A first-time contributor can understand the project in this order:

1. [`../README.md`](../README.md) — mission, current product status, local setup, and the open-source invitation.
2. [`../AGENTS.md`](../AGENTS.md) — verified operational snapshot, active branch, commands, source hierarchy, and handoff rules.
3. [`CONSTITUTION.md`](CONSTITUTION.md) — promises every product, architecture, governance, and funding decision must preserve.
4. [`PRODUCT.md`](PRODUCT.md) — users, v0 scope, explicit non-goals, critical flows, and success tests.
5. [`GLOSSARY.md`](GLOSSARY.md) — plain-language terms, deliberate distinctions, and a complete Problem-to-Evidence example.
6. [`../CONTRIBUTING.md`](../CONTRIBUTING.md) — how to claim work, branch, verify, open a pull request, and clean up.
7. [`ROADMAP.md`](ROADMAP.md) and the [public roadmap issue](https://github.com/samir1234khans/ManyHands/issues/2) — dependency-aware implementation order.
8. [`BRANCHING.md`](BRANCHING.md) — issue-linked branch naming, promotion, handoff, review, merge, and cleanup.

After that, follow the path matching the work you intend to do.

## Document authority

### Normative contracts

These define commitments. A conflicting change requires an explicit proposal and coordinated updates, not a quiet implementation shortcut.

- [`CONSTITUTION.md`](CONSTITUTION.md) — highest-level product and community promises.
- [`PRODUCT.md`](PRODUCT.md) — product scope, users, flows, rules, and success criteria.
- [`DOMAIN_MODEL.md`](DOMAIN_MODEL.md) — authoritative meanings, relationships, states, and authorization invariants.
- [`../GOVERNANCE.md`](../GOVERNANCE.md) — roles, decisions, conflicts, succession, and removal.
- [`../CODE_OF_CONDUCT.md`](../CODE_OF_CONDUCT.md) — required community behavior and enforcement scope.
- [`../SECURITY.md`](../SECURITY.md) — vulnerability reporting and baseline security requirements.
- [`../LICENSE`](../LICENSE), [`../NOTICE`](../NOTICE), and [`LICENSING.md`](LICENSING.md) — legal terms and practical AGPL guidance.

### Accepted decisions

Architecture Decision Records explain durable choices that would otherwise be repeatedly rediscovered.

- [`decisions/README.md`](decisions/README.md) — ADR statuses, template, and numbering.
- [`decisions/0001-problem-first-github-boundary.md`](decisions/0001-problem-first-github-boundary.md) — ManyHands owns coordination; GitHub owns code.
- [`decisions/0002-initial-technology-direction.md`](decisions/0002-initial-technology-direction.md) — TypeScript, Next.js, PostgreSQL/Supabase, modular monolith, and GitHub integration direction.
- [`decisions/0003-stable-identity-and-public-read-models.md`](decisions/0003-stable-identity-and-public-read-models.md) — stable internal identity, privacy-safe profiles, explicit grants, and RLS.

Write a new ADR when a decision changes a durable boundary, trust model, data-ownership rule, deployment model, major dependency direction, or another choice future contributors would repeatedly debate. Routine implementation choices belong in the issue or pull request.

### Operational guidance and playbooks

These explain how to apply the contracts and decisions.

- [`ARCHITECTURE.md`](ARCHITECTURE.md) — system boundaries, modules, trust model, data consistency, observability, and delivery strategy.
- [`AUTHENTICATION.md`](AUTHENTICATION.md) — GitHub OAuth, session refresh, configuration, privacy, return intent, and account-administration boundaries.
- [`ACCESSIBILITY.md`](ACCESSIBILITY.md) — WCAG 2.2 AA target, keyboard/focus, semantics, forms, announcements, reflow, motion, constrained devices, automation, and manual evidence.
- [`DEVELOPMENT.md`](DEVELOPMENT.md) — local setup, repository shape, commands, CI, dependency policy, testing, and troubleshooting.
- [`DATABASE.md`](DATABASE.md) — local Supabase, migrations, grants, RLS, pgTAP, generated types, and database operations.
- [`DATA_LIFECYCLE.md`](DATA_LIFECYCLE.md) — retention, suspension, export, deletion, and attribution-preserving anonymization.
- [`BRANCHING.md`](BRANCHING.md) — branch lifecycle and work promotion.
- [`AI_CONTRIBUTIONS.md`](AI_CONTRIBUTIONS.md) — responsible AI assistance, disclosure, prohibited practices, and human accountability.
- [`MAINTAINER_PLAYBOOK.md`](MAINTAINER_PLAYBOOK.md) — issue quality, triage, review, release, inactivity, and recognition.
- [`LAUNCH_PLAYBOOK.md`](LAUNCH_PLAYBOOK.md) — founding-community launch conditions, outreach, recognition, and dogfooding.
- [`REPOSITORY_SETTINGS.md`](REPOSITORY_SETTINGS.md) — intended GitHub settings, rulesets, merge policy, labels, milestones, Actions, and security controls.
- [`OPEN_SOURCE_PROJECT_BLUEPRINT.md`](OPEN_SOURCE_PROJECT_BLUEPRINT.md) — reusable setup for future community projects.
- [`ROADMAP.md`](ROADMAP.md) — phase outcomes, current state, and dependency-aware next work.
- [`../CHANGELOG.md`](../CHANGELOG.md) — notable repository and product changes.

### Plain-language, design, and research evidence

These help implementation and decision-making but do not silently override normative contracts.

- [`GLOSSARY.md`](GLOSSARY.md) — plain-language reading aid; `DOMAIN_MODEL.md` remains authoritative.
- [`design/README.md`](design/README.md) — design-evidence authority and contribution rules.
- [`design/PRODUCT_INFORMATION_ARCHITECTURE.md`](design/PRODUCT_INFORMATION_ARCHITECTURE.md) — working routes, state tables, responsive rules, and low-fidelity wireframes; parent issue #22 remains open for comprehension testing.
- [`research/README.md`](research/README.md) — research scope, dating, source, and interpretation rules.
- [`research/PROBLEM_FIRST_GAP.md`](research/PROBLEM_FIRST_GAP.md) — initial problem-first hypothesis and validation wedge.
- [`research/2026-08-adjacent-platforms.md`](research/2026-08-adjacent-platforms.md) — dated adjacent-platform comparison, counterarguments, interview guides, and experiments; parent issue #21 remains open for field evidence.

### Temporary operational handoffs

- [`agent-status/README.md`](agent-status/README.md) — when and how to create an issue-specific handoff.
- [`agent-status/issue-5.md`](agent-status/issue-5.md) — merged identity checkpoint and remaining hosted/manual evidence.
- [`agent-status/issue-6.md`](agent-status/issue-6.md) — current Problem-directory implementation handoff.
- [`agent-status/issue-14.md`](agent-status/issue-14.md) — merged accessibility checkpoint and remaining manual/future-route evidence.
- [`agent-status/issue-21.md`](agent-status/issue-21.md) — merged research checkpoint and remaining field validation.
- [`agent-status/issue-22.md`](agent-status/issue-22.md) — merged information-architecture checkpoint and remaining comprehension review.
- [`../AI_agent.md`](../AI_agent.md) — compatibility pointer to canonical [`../AGENTS.md`](../AGENTS.md); it intentionally contains no duplicate status.

A handoff can remain after a checkpoint merge when the parent issue still owns real manual, hosted, or field evidence. GitHub remains authoritative when a handoff becomes stale.

## Reading paths by contribution type

### Engineering

1. [`ARCHITECTURE.md`](ARCHITECTURE.md)
2. [`DEVELOPMENT.md`](DEVELOPMENT.md)
3. [`DOMAIN_MODEL.md`](DOMAIN_MODEL.md)
4. [`ACCESSIBILITY.md`](ACCESSIBILITY.md)
5. Relevant ADRs under [`decisions/`](decisions/README.md)
6. [`DATABASE.md`](DATABASE.md) and [`DATA_LIFECYCLE.md`](DATA_LIFECYCLE.md) for schema, identity, authorization, or lifecycle work
7. The active issue and matching handoff under [`agent-status/`](agent-status/README.md)

### Identity, security, and privacy

1. [`../SECURITY.md`](../SECURITY.md)
2. [`AUTHENTICATION.md`](AUTHENTICATION.md)
3. [`ARCHITECTURE.md`](ARCHITECTURE.md), especially trust boundaries and threat model
4. [`DATABASE.md`](DATABASE.md)
5. [`DATA_LIFECYCLE.md`](DATA_LIFECYCLE.md)
6. [`ACCESSIBILITY.md`](ACCESSIBILITY.md), especially accessible authentication and destructive operations
7. [`decisions/0003-stable-identity-and-public-read-models.md`](decisions/0003-stable-identity-and-public-read-models.md)
8. Relevant migrations, negative tests, issue, pull request, and handoff

Report vulnerabilities privately through [`../SECURITY.md`](../SECURITY.md); never place exploit details in a public issue or status file.

### Product, design, and content

1. [`CONSTITUTION.md`](CONSTITUTION.md)
2. [`PRODUCT.md`](PRODUCT.md)
3. [`GLOSSARY.md`](GLOSSARY.md)
4. [`DOMAIN_MODEL.md`](DOMAIN_MODEL.md)
5. [`design/PRODUCT_INFORMATION_ARCHITECTURE.md`](design/PRODUCT_INFORMATION_ARCHITECTURE.md)
6. [`ACCESSIBILITY.md`](ACCESSIBILITY.md)
7. [`ROADMAP.md`](ROADMAP.md)
8. Current research evidence and the relevant product issue

### Research and validation

1. [`CONSTITUTION.md`](CONSTITUTION.md)
2. [`PRODUCT.md`](PRODUCT.md)
3. [`research/README.md`](research/README.md)
4. [`research/PROBLEM_FIRST_GAP.md`](research/PROBLEM_FIRST_GAP.md)
5. [`research/2026-08-adjacent-platforms.md`](research/2026-08-adjacent-platforms.md)
6. Issue #21 and any dated interview/experiment evidence

### Community, moderation, and contributor care

1. [`../CODE_OF_CONDUCT.md`](../CODE_OF_CONDUCT.md)
2. [`../GOVERNANCE.md`](../GOVERNANCE.md)
3. [`PRODUCT.md`](PRODUCT.md), especially users and product rules
4. [`ACCESSIBILITY.md`](ACCESSIBILITY.md)
5. [`MAINTAINER_PLAYBOOK.md`](MAINTAINER_PLAYBOOK.md)
6. [`LAUNCH_PLAYBOOK.md`](LAUNCH_PLAYBOOK.md)
7. [`AI_CONTRIBUTIONS.md`](AI_CONTRIBUTIONS.md)

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
7. Operations issue #16 for deployment, backup/restore, export, recovery, and self-hosting work

### AI-assisted contributors

1. [`../AGENTS.md`](../AGENTS.md)
2. [`AI_CONTRIBUTIONS.md`](AI_CONTRIBUTIONS.md)
3. [`BRANCHING.md`](BRANCHING.md)
4. [`agent-status/README.md`](agent-status/README.md)
5. The relevant normative, technical, design, and research documents for the issue

## Keeping this map accurate

When adding, renaming, or removing documentation:

1. place it in the appropriate authority section;
2. state whether it is normative, an accepted decision, operational guidance, research/design evidence, or a temporary handoff;
3. update affected reading paths;
4. verify every relative link from GitHub's rendered `docs/README.md` view;
5. avoid duplicating the full contents of the linked document;
6. update live-status claims only from exact GitHub evidence.

A useful map should make the repository easier to enter without becoming a second copy of the repository.
