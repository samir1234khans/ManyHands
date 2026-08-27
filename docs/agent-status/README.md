# Agent status handoffs

This directory holds **temporary, issue-specific operational handoffs** for work that spans sessions, contributors, or AI agents.

GitHub remains authoritative. A handoff helps the next collaborator resume safely; it does not replace the issue, branch, pull request, commits, or CI evidence.

## File naming

Use:

```text
docs/agent-status/issue-<issue-number>.md
```

One active issue has at most one canonical handoff file. Several contributors may update that file through the issue branch instead of creating competing summaries.

## When to create one

Create a handoff when work:

- will continue across multiple sessions;
- involves more than one contributor or agent;
- crosses a security, data, architecture, or migration boundary;
- has a valuable partial implementation that should not be lost;
- is blocked and needs a precise resumption point.

Tiny documentation fixes do not need ceremony.

## Required update moments

Update the handoff:

1. after a coherent implementation checkpoint;
2. when an important decision is made;
3. when a blocker appears or clears;
4. before pausing or transferring work;
5. before marking a pull request review-ready;
6. after CI establishes evidence on a new exact head.

Do not update it for every tiny commit.

## Template

```md
---
schema_version: "1"
issue: "123"
title: "Short issue title"
branch: "feat/123-short-slug"
work_state: "in_progress"
contributors: "@example"
base_commit: "40-character commit"
last_verified_commit: "40-character commit"
updated_at_utc: "YYYY-MM-DDTHH:MM:SSZ"
pull_request: "456"
verification_state: "pending_ci"
---

# Issue #123 agent handoff

## Outcome

Describe the user-visible or operational result.

## Acceptance criteria status

| Criterion | State | Evidence |
|---|---|---|
| Example | pending | — |

## Completed in this branch

List committed work only.

## Decisions made

Record decisions another contributor might accidentally reverse. Link an ADR when the decision is durable.

## Remaining work

Keep this ordered. Put the next safe action first.

## Next safe action

One precise action that can begin without reconstructing the whole issue.

## Known blockers

Write `none` when none exist. Otherwise identify the dependency, owner, and evidence.

## Security-sensitive areas

List trust boundaries and files that require extra review.

## Verification at the last checkpoint

| Check | Result | Exact commit |
|---|---|---|
| Formatting | not run | `...` |
| Type-check | not run | `...` |
| Tests | not run | `...` |
| Build | not run | `...` |

## Handoff notes

Record unusual failures, abandoned approaches, setup constraints, and facts likely to save the next contributor time.
```

## Removal after merge

The issue branch should remove its handoff before merge when practical. Otherwise, remove it in immediate post-merge cleanup. The issue and pull request preserve the permanent historical record.

Do not turn this directory into an archive of completed work.
