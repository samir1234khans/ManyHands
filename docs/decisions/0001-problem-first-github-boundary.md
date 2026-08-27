# 0001 — Problem-first product with GitHub as the code system

- Status: accepted
- Date: 2026-08-27
- Deciders: lead maintainer

## Context

GitHub already provides repositories, issues, commits, pull requests, releases, and code review. The unmet need is helping people gather around a problem, form credible teams, understand progress, and find a specific way to contribute.

Building another code host would consume the project without validating this coordination problem.

## Decision

ManyHands will model problems independently from repositories and allow multiple projects under one problem. It will own discovery, project formation, contribution needs, milestones, progress interpretation, health, and stewardship.

GitHub remains the authoritative system for code and code-review activity. ManyHands links and summarizes GitHub evidence through a least-privilege GitHub App.

## Consequences

- A useful problem can exist before a repository.
- A project can link more than one repository.
- GitHub outages or revoked access must appear as degraded sync, not corrupt ManyHands state.
- ManyHands does not implement pull requests, commit browsing, or a general issue tracker in v0.
- Product language must distinguish demand, project progress, and code activity.

## Alternatives considered

- Build a complete Git hosting platform: rejected as unnecessary and strategically distracting.
- Use only GitHub topics and issues: rejected because it does not create a problem-first directory or cross-project coordination layer.
- Make every problem equal one repository: rejected because multiple solutions and pre-code formation are core requirements.

## Revisit when

Revisit only if supporting another forge or self-hosted Git service requires a generalized code-host adapter. The problem-first boundary remains constitutional.
