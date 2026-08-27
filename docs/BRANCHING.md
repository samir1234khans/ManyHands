# Branching and Work Promotion

ManyHands uses a deliberately small branch model so contributors can see what is active, avoid duplicate effort, and review work before it reaches `main`.

## Core rule

`main` is the only long-lived integration branch. It should remain releasable and understandable.

ManyHands does **not** use permanent `develop`, `staging`, personal, AI-agent, or milestone branches. Environments are deployments of reviewed commits, not extra integration histories.

## Branch types

| Prefix | Use |
|---|---|
| `feat/<issue>-<slug>` | User-visible capability |
| `fix/<issue>-<slug>` | Defect or regression |
| `docs/<issue>-<slug>` | Documentation-only change |
| `chore/<issue>-<slug>` | Repository, dependency, or tooling maintenance |
| `security/<issue>-<slug>` | Security-sensitive remediation |
| `research/<issue>-<slug>` | Evidence, interviews, or research deliverable |
| `design/<issue>-<slug>` | Product, content, interaction, or visual design |
| `test/<issue>-<slug>` | Focused test infrastructure or coverage |
| `refactor/<issue>-<slug>` | Behavior-preserving structural change |

Use lower-case words separated by hyphens. Same-repository branches must contain the GitHub issue number.

Examples:

```text
feat/5-github-auth-profile
docs/19-documentation-map
research/21-adjacent-platform-study
fix/48-profile-return-path
security/52-webhook-replay-window
```

## Before creating a branch

1. Read the issue and its dependencies.
2. Comment with the intended approach.
3. Wait for acknowledgement when the work is substantial or likely to overlap.
4. Fetch current `main`.
5. Create exactly one branch for the issue outcome.
6. Add or update `docs/agent-status/issue-<number>.md` when the work will span more than one session or contributor.

Do not create placeholder branches for every open issue. An unclaimed issue is represented by the issue, not by an empty ref.

## External contributors

External contributors normally work in a fork. Use the same naming pattern when practical, but branch-name enforcement applies only to branches hosted in the official repository.

A fork is not second-class work. The pull request, tests, evidence, and review determine whether work is promoted.

## One branch, one outcome

A branch should normally correspond to one issue and one pull request. Do not accumulate unrelated fixes because they were nearby.

When a useful unrelated problem is found:

1. open or locate its issue;
2. record enough evidence to reproduce it;
3. create a separate branch from current `main`.

This keeps review honest and rollback possible.

## Promote valuable work early

Open a **draft pull request** when a branch contains a coherent, valuable checkpoint but is not finished. A draft pull request:

- makes the work discoverable;
- runs CI against the branch;
- gives collaborators a stable review and discussion location;
- prevents a useful branch from becoming invisible private context;
- does not imply that the work is safe to merge.

The pull-request body and issue handoff must distinguish completed, pending, blocked, and unverified work.

## Keeping a branch current

Refresh a branch from current `main` before requesting final review.

- Rebase is preferred while one author controls a private or fork branch and no recorded handoff depends on its commit IDs.
- Merge `main` into the branch when several collaborators or agents share it and rewriting history would invalidate recorded commits or active review.
- Resolve dependency and generated-file conflicts intentionally. Never choose “ours” or “theirs” across a security-sensitive file without reading both states.

After refreshing, update the handoff's base and verified commit fields.

## Work states

Use these terms consistently in handoffs:

- `ready` — scoped and unclaimed.
- `claimed` — a contributor has announced intent but no meaningful branch checkpoint exists yet.
- `in_progress` — implementation or research is active.
- `blocked` — a named dependency prevents safe progress.
- `review` — the exact pull-request head is ready for review.
- `needs_reverification` — status or CI evidence is stale.
- `merged` — the work reached `main`; remove it from the active index.

A draft pull request can remain `in_progress`. An open pull request is not automatically review-ready.

## Review and merge

Before review-ready status:

- refresh from current `main`;
- update the issue handoff;
- run relevant focused checks;
- run every required CI gate on the exact head;
- inspect generated artifacts and visible UI evidence;
- explain migrations, authorization, security, privacy, accessibility, dependency, and rollback risk;
- mark unresolved uncertainty honestly.

Squash merge is preferred so one pull request becomes one understandable change on `main`.

## Cleanup

Merged same-repository branches are deleted automatically by `.github/workflows/delete-merged-branch.yml`. Repository settings should also enable automatic branch deletion as defense in depth.

After merge:

1. confirm the expected commit is on `main`;
2. close the issue as completed only when its acceptance criteria are met;
3. remove the issue from `AGENTS.md` active work;
4. delete its temporary `docs/agent-status/issue-<number>.md` file in the merging change or immediate cleanup;
5. promote the next dependency in the repository taxonomy;
6. do not reuse the merged branch for unrelated work.

If work is abandoned before merge, preserve useful commits through a draft PR or a documented handoff before deleting the branch.

## Stale branches

Age alone does not prove abandonment. Before cleanup, inspect:

- open pull requests;
- ahead/behind and content differences against `main`;
- issue comments and assignees;
- agent handoffs;
- whether squash-merged work already exists on `main` under different commit IDs.

A stale branch with no unique useful content should be deleted. A stale branch with useful unique work should first be promoted through a draft pull request or transplanted onto a fresh issue branch from current `main`.

## Initial branch audit — 27 August 2026

The repository audit classified:

- `feat/5-github-auth-profile` — **active and promoted** through draft PR #35; refreshed from current `main` and given a reproducible dependency lockfile.
- `chore/34-branch-governance` — temporary branch implementing this policy.
- completed foundation, roadmap, documentation-status, and license branches — verified as merged, superseded, or behind current `main`, then scheduled for deletion through the one-time cleanup workflow.

The audit deliberately preserves Git history and merged pull requests as evidence. Deleting a stale branch does not erase its commits, pull-request discussion, attribution, or merged result.
