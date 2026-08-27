# Maintainer Playbook

## The maintainer’s first job

Keep work understandable. Contributors should not have to reverse-engineer hidden plans, and project pages should not imply progress that cannot be verified.

## Issue quality

Every implementation issue should include:

- the user or operational problem;
- why it matters now;
- scope and explicit non-goals;
- acceptance criteria;
- dependencies and risk;
- likely files or modules when known;
- test, accessibility, security, data, and documentation expectations;
- whether it is safe for a first-time contributor.

Do not apply `good first issue` to vague cleanup or a task that requires undocumented architecture knowledge.

## Claiming work

A comment expressing interest is acknowledged before work is treated as claimed. Avoid indefinite ownership: if a contributor becomes unavailable, thank them, preserve their work, and reopen the task without blame.

Pair contributors when a task is educational or crosses specialties. “I can help” should create connection, not competition.

## Triage rhythm

Regularly review:

- unanswered contributor comments;
- unreviewed pull requests;
- security and moderation reports;
- blocked or stale issues;
- issues incorrectly marked beginner-friendly;
- architecture decisions that are happening only in chat;
- project status that lacks fresh evidence.

## Pull-request review

Review in this order:

1. Does the change solve the stated problem?
2. Does it preserve the constitution and product boundary?
3. Is authorization and data exposure correct?
4. Is the behavior tested, accessible, and operable?
5. Is the code understandable and appropriately scoped?
6. Are documentation, migrations, and dependencies responsible?

Separate required changes from optional suggestions. Explain the principle behind a request so the review teaches rather than merely blocks.

## Merge and release

Prefer squash merges with a meaningful title. Do not merge failing checks, unresolved security concerns, accidental generated files, or unexplained dependency expansion.

Every release should identify user-visible changes, migration requirements, known limitations, security notes, and contributor credit.

## Handling inactivity

An inactive project is not a failure to hide. Mark it paused or `needs_steward`, preserve its history, document blockers, and make handoff possible.

## Recognition

Credit code, design, writing, research, moderation, translation, testing, and community work. Do not reduce contribution to commit count.

## AI-assisted pull requests

Confirm that the human author understands the change, ran relevant checks, verified licensing, and disclosed material assistance. Large generated changes without a reviewable rationale should be split or closed.
