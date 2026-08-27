# Contributing to ManyHands

Thank you for helping build a place where people can undertake work that is too large for one person.

## Start here

1. Read the [constitution](docs/CONSTITUTION.md), [product contract](docs/PRODUCT.md), and [roadmap](docs/ROADMAP.md).
2. Find an open issue. New contributors should prefer issues marked `good first issue` or `help wanted`.
3. Comment that you would like to work on it and describe your intended approach. A maintainer will help prevent duplicate effort.
4. Fork the repository, create a short-lived branch, make the change, test it, and open a pull request.

For a substantial product or architecture change, open a proposal before implementation. Small fixes do not need ceremony.

## Forking is encouraged

🍴 **Fork it. Improve it. Make us mildly jealous.**

Copy the homework. Improve the homework. Send the homework back.

Pull requests are welcome, and independent versions are welcome. Please preserve the project’s open-source obligations and clearly distinguish an independent fork from the official ManyHands instance.

## Branching model

ManyHands uses GitHub Flow. There is **no permanent `develop` branch**. `main` should remain releasable; work happens on short-lived branches and enters through pull requests.

Use one of these forms:

- `feat/<issue-number>-short-name`
- `fix/<issue-number>-short-name`
- `docs/<issue-number>-short-name`
- `chore/<issue-number>-short-name`
- `security/<issue-number>-short-name`

Do not mix unrelated changes in one branch.

## Commit style

Use clear, imperative commit messages. Conventional Commit prefixes are preferred:

- `feat:` user-visible capability
- `fix:` bug or regression
- `docs:` documentation only
- `test:` test-only work
- `refactor:` behavior-preserving code change
- `chore:` repository or tooling maintenance
- `security:` security hardening

## Pull-request requirements

A pull request should:

- link the issue it addresses;
- explain the problem and the chosen approach;
- remain small enough to review honestly;
- include or update tests for behavior changes;
- include screenshots or recordings for visible UI changes;
- include accessibility notes for interaction changes;
- update documentation and an ADR when the contract changes;
- disclose material AI assistance as described in [the AI contribution policy](docs/AI_CONTRIBUTIONS.md);
- contain no secrets, personal data, copied proprietary code, or dependencies with unclear licensing.

Draft pull requests are encouraged for early design feedback. A draft is not a request for final review.

## Quality bar

Once application code exists, the required local checks will be exposed through repository scripts. Until then, documentation and foundation changes must pass the repository-health workflow.

A contribution is not finished merely because it compiles. It must preserve authorization boundaries, keyboard access, useful error states, data integrity, and the documented product model.

## Product language

Use these terms consistently:

- **Problem**: an unmet need worth solving.
- **Project**: one proposed or active solution under a problem.
- **Contribution need**: a specific way a person can help.
- **Steward**: the accountable caretaker of a project.
- **Evidence**: a verifiable signal of progress, such as a release, merged pull request, demo, or completed milestone.

See [the domain model](docs/DOMAIN_MODEL.md) for authoritative definitions.

## Review and merge

Maintainers may request changes, split an oversized pull request, or decline work that conflicts with the constitution or accepted scope. Decisions should explain the reason and point to the relevant contract.

Squash merging is preferred so each pull request becomes one understandable change on `main`.

## Community safety

Participation is governed by the [Code of Conduct](CODE_OF_CONDUCT.md). Security vulnerabilities must follow [SECURITY.md](SECURITY.md), not a public issue.

## Licensing contributions

By submitting a contribution, you certify that you have the right to submit it and agree that it will be distributed under the repository’s GNU AGPL v3-or-later license. See [docs/LICENSING.md](docs/LICENSING.md).
