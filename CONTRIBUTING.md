# Contributing to ManyHands

Thank you for helping build a place where people can undertake work that is too large for one person.

## Start here

1. Read [`AGENTS.md`](AGENTS.md), the [constitution](docs/CONSTITUTION.md), [product contract](docs/PRODUCT.md), and [roadmap](docs/ROADMAP.md).
2. Find an open issue. New contributors should prefer issues marked `good first issue` or `help wanted`.
3. Comment with the outcome you want to own and your intended approach. This prevents duplicate effort and lets maintainers share hidden context.
4. Fork the repository unless you are an official maintainer, then create one short-lived issue branch from current `main`.
5. Update the matching agent handoff when work spans sessions or contributors.
6. Open a draft pull request when a coherent checkpoint is useful but incomplete.
7. Run the relevant quality gates and make the pull request review-ready only when the exact head is verified.

For a substantial product or architecture change, open a proposal before implementation. Small fixes do not need ceremony, but they still need a clear issue or reproducible context.

## Forking is encouraged

🍴 **Fork it. Make it better. Make me jealous.**

**Copy the homework. Improve the homework. Send the homework back.**

Pull requests and independent versions are welcome. Build a cleaner version, a stranger version, or the version that proves us delightfully wrong. Preserve the project’s open-source obligations and distinguish an independent fork from the official ManyHands instance.

## Branching model

ManyHands uses GitHub Flow. `main` is the only long-lived integration branch. There is **no permanent `develop` branch**, and unclaimed issues do not receive placeholder branches.

Use:

- `feat/<issue-number>-short-name`
- `fix/<issue-number>-short-name`
- `docs/<issue-number>-short-name`
- `chore/<issue-number>-short-name`
- `security/<issue-number>-short-name`
- `research/<issue-number>-short-name`
- `design/<issue-number>-short-name`
- `test/<issue-number>-short-name`
- `refactor/<issue-number>-short-name`

Examples:

```text
feat/5-github-auth-profile
docs/19-documentation-map
research/21-adjacent-platform-study
```

Do not mix unrelated changes in one branch. Read [`docs/BRANCHING.md`](docs/BRANCHING.md) for claiming, refreshing, promoting, handing off, and cleaning up work.

## Agent and collaborator handoffs

`AGENTS.md` is the concise operational index. Work that spans sessions or contributors uses `docs/agent-status/issue-<number>.md` on the active branch.

Before pausing or transferring work, record:

- exact issue, branch, pull request, base commit, and last verified commit;
- completed versus planned work;
- acceptance-criteria state;
- decisions and security-sensitive areas;
- next safe action and blockers;
- checks actually run.

GitHub wins when a handoff disagrees with the issue, branch, PR, or CI evidence. Correct the stale handoff instead of guessing.

## Commit style

Use clear, imperative commit messages. Conventional Commit prefixes are preferred:

- `feat:` user-visible capability
- `fix:` bug or regression
- `docs:` documentation only
- `test:` test-only work
- `refactor:` behavior-preserving code change
- `chore:` repository or tooling maintenance
- `security:` security hardening

A coherent checkpoint is more useful than dozens of noisy “work in progress” commits. Do not rewrite a shared branch after other people or agents have recorded its commit IDs without coordinating the change.

## Pull-request requirements

A pull request should:

- link the issue it addresses;
- explain the problem, outcome, non-goals, and chosen approach;
- remain small enough to review honestly;
- distinguish completed, pending, blocked, and unverified work;
- include or update tests for behavior and failure paths;
- include screenshots or recordings for visible UI changes;
- include accessibility notes for interaction changes;
- update documentation and an ADR when the contract changes;
- update `AGENTS.md` or the matching issue handoff when repository status changes;
- disclose material AI assistance as described in [`docs/AI_CONTRIBUTIONS.md`](docs/AI_CONTRIBUTIONS.md);
- contain no secrets, personal data, copied proprietary code, or dependencies with unclear licensing.

Draft pull requests are encouraged for early design feedback and valuable partial implementation. A draft is not a request for final review and must not be merged merely because CI happens to be green.

## Quality bar

Run the relevant commands from the repository root:

```bash
pnpm agent:check
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Database work also runs:

```bash
pnpm db:start
pnpm db:reset
pnpm db:test
pnpm db:lint
pnpm db:stop
```

User-facing work requires browser verification and evidence. A contribution is not finished merely because it compiles. It must preserve authorization boundaries, keyboard access, useful error states, data integrity, and the documented product model.

## Product language

Use these terms consistently:

- **Problem**: an unmet need worth solving.
- **Project**: one proposed or active solution under a problem.
- **Contribution need**: a specific way a person can help.
- **Steward**: the accountable caretaker of a project.
- **Evidence**: a verifiable signal of progress, such as a release, merged pull request, demo, or completed milestone.

See [the domain model](docs/DOMAIN_MODEL.md) for authoritative definitions.

## Review, merge, and cleanup

Maintainers may request changes, split an oversized pull request, or decline work that conflicts with the constitution or accepted scope. Decisions should explain the reason and point to the relevant contract.

Squash merging is preferred so each pull request becomes one understandable change on `main`. Merged same-repository branches are deleted automatically. Do not reuse a merged branch; create a fresh branch from current `main` for new work.

After merge, remove the issue from active status, remove its temporary handoff, confirm CI on `main`, and promote the next dependency honestly.

## Community safety

Participation is governed by the [Code of Conduct](CODE_OF_CONDUCT.md). Security vulnerabilities must follow [SECURITY.md](SECURITY.md), not a public issue.

## Licensing contributions

By submitting a contribution, you certify that you have the right to submit it and agree that it will be distributed under the repository’s GNU AGPL v3-or-later license. See [docs/LICENSING.md](docs/LICENSING.md).
