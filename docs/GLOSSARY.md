# ManyHands glossary

This glossary explains ManyHands product language in everyday terms. It is a reading aid, not a replacement for the authoritative [`DOMAIN_MODEL.md`](DOMAIN_MODEL.md). When the two disagree, the domain model wins and the conflict should be raised for review rather than silently “fixed” here.

## One example from beginning to evidence

Imagine people who use Linux for professional creative work repeatedly say:

> “I need a dependable way to edit large, layered images with non-destructive adjustments, color management, keyboard-driven workflows, and files I can exchange with clients.”

That statement describes an unmet workflow. It does **not** require the community to copy or name a particular proprietary product.

In ManyHands, that journey could look like this:

1. A person publishes the **Problem**: professional Linux users lack a dependable workflow for certain large, layered image-editing jobs.
2. Other people add a reversible **Need signal**—“I need this”—and optionally provide context or evidence.
3. More than one **Project** may form under the same Problem:
   - a native desktop editor focused on the missing professional workflow;
   - a compatibility and interoperability project improving an existing open-source editor;
   - a browser-based collaborative editor with a narrower scope.
4. Each Project identifies a **Steward**, scope, non-goals, license, governance, **Milestones**, and current **Contribution needs**.
5. A color scientist may offer research, a designer may specify interaction behavior, a technical writer may improve onboarding, a tester may validate large files, a translator may localize terminology, and an engineer may implement a feature.
6. Selecting “I can help” creates **Contribution interest**. It does not silently assign the work.
7. The Project acknowledges, pairs, redirects, accepts, or respectfully declines the offer and gives an exact GitHub or onboarding handoff.
8. Merged work, a verified design decision, a research result, a passing benchmark, or a release becomes **Evidence** for a Milestone.
9. A timestamped **Health snapshot** explains whether the Project is active, blocked, paused, completed, or seeking a new Steward.
10. If the Steward must step away, a recorded **Stewardship handoff** transfers responsibility without erasing prior work or credit.

The same Problem remains understandable even if one Project pauses or another solution appears later.

## People and identity

### User

A **User** is a person with an authenticated ManyHands account, initially established through GitHub sign-in. Authentication proves which account is acting; it does not automatically make the person a Project Steward, maintainer, moderator, or repository administrator.

People can browse public Problems, Projects, progress, and Contribution needs without becoming a User. ManyHands asks for authentication only when an action needs identity, persistence, permissions, or abuse protection.

### Contributor profile

A **Contributor profile** is optional, user-chosen context that helps others understand how someone may want to participate. It can include skills, non-code roles, interests, coarse availability, languages, timezone preference, and public links.

It is not a résumé score, employment promise, public email directory, or guarantee of future work. Private identity data, OAuth records, tokens, moderation notes, and security telemetry do not belong in a public profile.

### Person with a problem

A **Person with a problem** experiences, observes, or can credibly describe an unmet need. They do not need to be a developer or already know the correct implementation. Their most useful contribution may be evidence, affected-user context, constraints, existing alternatives, and feedback.

### Potential contributor

A **Potential contributor** is someone looking for a useful way to help. They may be an engineer, designer, researcher, writer, tester, translator, accessibility specialist, domain expert, moderator, community organizer, or another kind of collaborator.

### Project steward

A **Project steward** is the accountable caretaker of a Project. The Steward keeps scope and status honest, responds to contributors, protects the contribution process, and initiates a handoff when they cannot continue.

Stewardship is responsibility, not permanent ownership. A Steward cannot erase prior contributors, Evidence, decisions, or public history merely because they currently lead the Project.

### Maintainer

A **Maintainer** is a trusted contributor with review and merge responsibilities in a defined area or Project. Maintainer authority follows demonstrated responsibility and can be narrowed by area.

A Project maintainer role inside ManyHands is not automatically the same as GitHub repository permissions; those systems are connected but remain separate authorization boundaries.

### Moderator

A **Moderator** is trusted to enforce community rules, review reports, and take proportionate safety actions. Moderation authority is separate from code skill and from ordinary Project membership.

A project-scoped role never grants automatic access to private global reports or global moderation controls.

### Explorer or user of a project

An **Explorer** is someone who wants to find, compare, follow, use, or support open-source solutions. They may never contribute code or create an account, and the public product must still be useful to them.

## The problem-first structure

### Problem

A **Problem** is an unmet need that is understandable without reading code or accepting one chosen implementation. It explains who is affected, what the situation is, what evidence exists, what alternatives already exist, and why those alternatives are insufficient.

One Problem may support multiple Projects. “Build my exact clone of product X” is not yet a good Problem statement; it should be reframed around the underlying users, workflow, constraints, and evidence.

Problem states are `draft`, `open`, `validated`, `closed`, and `archived`.

### Need signal — “I need this”

A **Need signal** is one User’s reversible statement that a Problem matters to them. They may add optional context, but the signal is not a vote that gives them control over a Project, guarantees an implementation, or determines which solution wins.

Each User can maintain at most one active Need signal per Problem. Aggregate counts need abuse protection and must not reveal private identity choices beyond the User’s visibility settings.

### Follow

A **Follow** is a subscription to public updates for a Problem or Project. It expresses interest in receiving updates, not demand, authority, Project membership, or a work commitment.

Notification channel preferences are separate from the Follow itself.

### Project

A **Project** is one proposed or active solution under exactly one Problem. It has its own solution statement, scope, explicit non-goals, Steward, governance, license, health, Milestones, repository connections when code exists, and current Contribution needs.

Several Projects may pursue the same Problem. ManyHands may help people compare their scope, Evidence, health, and current needs, but it must not declare a popularity winner simply because one Project arrived first or collected more attention.

Project states are `proposed`, `forming`, `active`, `blocked`, `paused`, `needs_steward`, `completed`, and `archived`.

### Project membership

**Project membership** records a User’s relationship and capabilities within a Project. Initial roles are Steward, maintainer, contributor, and—where appropriate—project-scoped moderator.

Roles grant specific capabilities; they are not a social rank. Skills such as design, research, documentation, translation, testing, and community work belong in contribution/profile context rather than being treated as authorization roles.

## Turning interest into work

### Contribution need

A **Contribution need** is a specific, bounded way a person can help a Project now. It should explain the outcome, why it matters, skills or context, expected shape of effort, reviewer, onboarding steps, dependencies, blockers, linked GitHub or external work item, and acceptance criteria.

“Help us build everything” is not a Contribution need. “Test 20 representative layered files, record import failures, and provide reproducible fixtures for the assigned reviewer” can be one.

Contribution-need states are `open`, `claimed`, `in_progress`, `blocked`, `done`, and `cancelled`.

### Contribution interest — “I can help”

**Contribution interest** is a person’s offer to help with a particular Contribution need. It is not automatically a claim, assignment, contract, or promise that the contributor will finish.

The Project can acknowledge, accept, pair, redirect, or respectfully decline the offer. The contributor can withdraw. The history remains auditable so people are not silently ignored or removed from the record.

### Claim

A **Claim** means a Project has explicitly connected a contributor or pair to the work under the Project’s rules. It should have a clear next action, reviewer, and inactivity policy.

It is stronger than “I can help” but still not permanent ownership. If circumstances change, the work can be reopened without erasing useful partial contributions or blaming a volunteer for becoming unavailable.

### Onboarding handoff

An **Onboarding handoff** is the exact next place and context a contributor needs to begin—for example, a GitHub issue, design brief, research protocol, test fixture, or documented community process.

ManyHands does not replace GitHub code review. The handoff should reduce ambiguity and then move authoritative code work to GitHub.

## Progress and trust

### Milestone

A **Milestone** is an outcome-oriented checkpoint with user value and clear completion criteria. It can have dependencies, an estimated time window, a state, and Evidence requirements.

A Milestone is not merely a bucket containing tasks. “Import and export 20 representative layered files without data loss, backed by fixtures and tests” is an outcome. “Do parser tasks” is not sufficient.

Milestone states are `planned`, `active`, `blocked`, `complete`, and `cancelled`.

### Evidence

**Evidence** is a verifiable artifact supporting a progress claim. Examples include a merged pull request, release, commit/tag, passing benchmark, demo deployment, research result, design decision, accessibility audit, or completed external deliverable.

Evidence includes its source, type, observed time, verification state, and who or what recorded it. A hopeful update, unverified link, commit count, or manually typed percentage is not Evidence by itself.

### Derived progress

**Derived progress** is a summary calculated from Milestone states and their Evidence. It should explain its basis so another person can reproduce the conclusion.

ManyHands deliberately avoids an arbitrary progress field. A percentage without outcome definitions and evidence can look precise while communicating almost nothing.

### Repository link

A **Repository link** connects a Project to an authoritative GitHub repository. It records repository and installation identity, permission scope, default branch, sync status, freshness, and revocation state.

It does not store User OAuth tokens as product data, and GitHub repository permission does not automatically grant ManyHands stewardship or moderation authority.

### Health snapshot

A **Health snapshot** is an explainable, timestamped assessment of a Project using Evidence and Steward input. It may describe verified activity, reviewer responsiveness, blockers, Milestone movement, stale updates, a missing Steward, or a failed repository connection.

Health is descriptive, contextual, and time-bound. It is not a moral judgement, quality guarantee, universal score, or reputation score for individual contributors.

### Freshness

**Freshness** tells a reader when information or external synchronization was last verified. It helps distinguish a genuinely inactive Project from a temporarily failed GitHub sync or a slow-but-deliberate research cadence.

Freshness does not mean every Project must commit daily. The expected cadence and type of work matter.

### Blocker

A **Blocker** is a named condition preventing a Milestone, Contribution need, or Project outcome from moving safely. A useful Blocker identifies its impact, owner or dependency, current next action, and resolution history.

“Blocked” should not be used as a vague substitute for an update.

## Continuity and safety

### Stewardship handoff

A **Stewardship handoff** is a recorded transfer of accountability from an outgoing Steward to an incoming Steward. It records the reason, current state, unresolved risks, required access changes, acceptance, and timestamps.

A handoff preserves Project history, Evidence, decisions, and prior attribution. It is not a silent rename of the owner field.

### Report

A **Report** is a private or appropriately scoped safety signal about content, a User, a Project, a contribution interaction, or behavior. It includes a reason, relevant context, state, and access controls.

Sensitive report details are never public product content and must not be copied into public issues or AI handoff files.

### Moderation action

A **Moderation action** is a proportionate, auditable response to a Report or policy violation. It records the actor, scope, reason, previous and new state, time, private notes where necessary, public explanation where safe, and appeal state.

Moderation history cannot be silently rewritten, and a Moderator materially involved in a case should not decide it alone.

### Account status

**Account status** describes whether a User’s global account is active, suspended, awaiting deletion, or anonymized. It is separate from Project membership and repository permissions.

Suspension prevents protected writes without deleting attribution. Account deletion removes the external authentication connection and unnecessary optional personal data while preserving neutral historical credit where the integrity of Project history requires it.

## Important distinctions

### Problem versus Project

- **Problem:** the unmet need and affected context.
- **Project:** one solution attempt.

A Problem survives the failure, pause, completion, or replacement of one Project.

### “I need this” versus a vote that grants authority

- **Need signal:** demand context from one User.
- **Authority:** comes from defined governance and roles, not the size of a reaction count.

High demand can guide discovery and validation, but it does not appoint a Steward or select a winning implementation.

### “I can help” versus a binding work claim

- **Contribution interest:** an offer to begin a conversation.
- **Claim:** an acknowledged, explicit work connection with a next action.

Neither should trap a volunteer indefinitely.

### Milestone versus task list

- **Milestone:** the outcome and evidence that make progress meaningful.
- **Tasks:** possible steps used to reach the outcome.

Completing many tasks does not complete a Milestone if its outcome is not met.

### Evidence versus optimistic status text

- **Evidence:** a verifiable artifact with provenance and time.
- **Status text:** a human explanation that may be useful but is not proof by itself.

Both can be shown, but they must not be confused.

### Steward versus permanent owner

- **Steward:** currently accountable and able to hand responsibility onward.
- **Permanent owner:** implies control that cannot be transferred or challenged.

ManyHands uses stewardship language because open-source work should survive the availability of one person.

### Health versus contributor reputation

- **Health:** a contextual snapshot of a Project and its operating conditions.
- **Contributor reputation:** a judgement about a person.

ManyHands does not turn project activity into a universal score for people.

## Terms we deliberately avoid or qualify

### “Owner”

Use **Steward**, maintainer, author, copyright holder, repository administrator, or account holder—whichever responsibility is actually meant. “Owner” hides important differences and can imply permanent control.

### “Progress percentage”

Use Milestone state, completion criteria, Evidence, blockers, and freshness. A derived percentage may be displayed only when its inputs and meaning are explicit; it is never entered as an unsupported number.

### “Follower”

Use **Follow** for a subscription to updates. Do not turn follows into a popularity economy or personal audience score.

### “Winner”

Use “relevant,” “healthy,” “active,” “completed,” or “best fit for this stated constraint” when evidence supports it. A Problem can support multiple Projects, and ManyHands does not crown a permanent winner by attention alone.

### “Assigned by AI”

Use “suggested,” “matched with explanation,” or “recommended for review” if a future system assists discovery. A model cannot silently commit a person to volunteer work or grant Project authority.

### “Dead project”

Use `paused`, `needs_steward`, `completed`, or `archived` with an explanation and freshness. Inactivity may be deliberate, seasonal, or caused by a failed integration; insulting labels do not help a responsible handoff.

## Related documents

- [`DOMAIN_MODEL.md`](DOMAIN_MODEL.md) — authoritative entities, states, relationships, and invariants.
- [`PRODUCT.md`](PRODUCT.md) — users, v0 scope, flows, success measures, and product rules.
- [`CONSTITUTION.md`](CONSTITUTION.md) — promises that must survive implementation changes.
- [`ARCHITECTURE.md`](ARCHITECTURE.md) — technical boundaries, authorization, public/private data, and GitHub integration.
- [`README.md`](README.md) — documentation map and role-specific reading paths.
