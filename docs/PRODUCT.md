# ManyHands Product Contract

## Vision

Enable people who share a meaningful problem to find one another, form credible open-source projects, and coordinate work large enough that no one person should have to carry it alone.

## Positioning

ManyHands is a **problem registry, project formation layer, progress directory, and contributor bridge for open source**.

It is not a code host. It connects to GitHub and turns repository activity into a human-readable picture of purpose, health, progress, and opportunity.

## Primary users

### Person with a problem

They may not be a developer. They can describe an unmet need, explain who it affects, provide evidence, discover existing work, and signal demand.

### Potential contributor

A developer, designer, researcher, writer, tester, translator, domain expert, or community organizer who wants a clear way to help.

### Project steward

A person accountable for direction, contributor response, truthful status, and continuity of a project.

### Explorer or user

Someone who wants to discover, follow, use, compare, or support open-source solutions without contributing code.

### Moderator

A trusted community member who handles spam, harmful content, impersonation, disputes, and policy enforcement.

## Core concepts

- A **Problem** explains an unmet need and affected people.
- A **Project** is one solution attempt under a problem.
- A **Contribution need** states exactly what help is wanted.
- A **Milestone** defines an outcome and its evidence.
- A **GitHub link** connects a project to repositories and activity.
- A **Health state** tells people whether work is forming, active, blocked, paused, seeking stewardship, completed, or archived.

## v0 contributor-ready scope

The first production slice must support:

1. Public browsing without signup.
2. GitHub sign-in for persistent actions.
3. Contributor profiles with skills, interests, availability, and links.
4. Problem publishing, editing, following, and **“I need this”** demand signals.
5. Multiple projects under a problem.
6. Project team roles, stewardship, and contribution needs.
7. **“I can help”** interest with an explicit handoff to a GitHub issue or onboarding instruction.
8. Milestones with evidence-backed progress.
9. A GitHub App connection for repository metadata, issues, pull requests, releases, and activity summaries.
10. Search and discovery by problem, platform, domain, skill, health, and current need.
11. Basic reports, moderation, rate limits, and audit history.
12. Project health, stale-data indicators, pause/archive states, and stewardship handoff.
13. A visible founding-contributor experience.
14. **Build ManyHands** published as the first project on ManyHands.

## Explicit non-goals for v0

- Hosting Git repositories or replacing GitHub pull requests.
- Real-time chat, voice rooms, or a Discord replacement.
- Paid freelancing, bounties, escrow, or employment matching.
- AI-generated projects or automatic contributor assignment.
- Complex reputation scores, follower economies, or engagement farming.
- Native mobile applications.
- Supporting every source-code forge on day one.
- A full Jira-style task manager.
- Private enterprise workspaces.
- Percentage progress entered by hand without milestone evidence.

## Critical user flows

### Discover and support a problem

A visitor finds a problem, understands who needs it and why, sees existing projects, reviews evidence, signals “I need this,” and follows updates. Signup happens only at the signal/follow step.

### Join a project

A contributor finds a project needing their skill, reads its goal and health, selects “I can help,” answers any onboarding question, and receives the exact GitHub issue or instruction needed to begin.

### Form a project

A signed-in user proposes a solution under an existing problem, defines scope and governance, names a steward, links or plans a repository, publishes initial milestones, and lists the first contribution needs.

### Understand progress

A visitor sees milestone state, last verified activity, recent releases or merged changes, blockers, and whether the project needs a steward. GitHub evidence is linked directly.

### Hand off an inactive project

A steward pauses a project or marks it `needs_steward`, explains current state, preserves history, and accepts a responsible transfer without deleting prior attribution.

## Self-hosting acceptance test

ManyHands has reached its first meaningful milestone when a stranger can:

1. discover **Build ManyHands** inside the product;
2. understand its current milestones and health;
3. find a contribution need matching their skill;
4. enter the GitHub contribution flow without private instructions;
5. submit a useful contribution;
6. receive review and have the work merged;
7. see that contribution reflected back as understandable progress.

## Success measures

Early success is not raw signup count. Measure:

- time from first visit to a relevant problem or project;
- percentage of open contribution needs with a clear GitHub handoff;
- contributor activation: interest → started work → submitted contribution;
- maintainer response time and unacknowledged contribution needs;
- merged first contributions from people outside the founding team;
- project health updates and honest stale/paused transitions;
- repeat contributors and new maintainers;
- successful stewardship handoffs;
- accessibility and safety defects in core flows.

## Product rules

- A problem must be understandable without a repository.
- A project must belong to a problem.
- A project must always have an accountable steward or explicitly request one.
- “I need this” is demand evidence, not a popularity contest; ranking must resist manipulation.
- “I can help” is not a commitment until accepted or connected to actionable work.
- Public progress must identify its source and freshness.
- Moderation decisions and privileged changes require audit records.
- Browsing remains public even if account features grow later.
