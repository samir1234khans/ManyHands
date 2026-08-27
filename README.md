# ManyHands

> **Big problems. Built together.**

ManyHands is a **problem-first community for creating ambitious open-source software**. It helps people gather around a shared need, form a team, make progress visible, and move contribution work into GitHub without trying to replace GitHub.

The idea is simple:

> Here is a problem people care about. Here is what is already being built. Here is what the project needs next. Here is how you can help.

## Status

ManyHands is in its **foundation phase**. The product contract, architecture, contribution model, governance, and first roadmap are being established before application code is added.

This repository is also the first project ManyHands will coordinate. **ManyHands will build ManyHands.**

## Why this exists

Large open-source projects often fail before the code becomes the hard part. People cannot easily find one another, understand the current state, see where help is needed, or tell whether a project is alive.

GitHub is excellent at hosting code and reviewing changes. ManyHands is the missing coordination layer around it:

- start with a real problem, not an empty repository;
- show multiple possible projects or solutions under that problem;
- publish milestones, evidence, health, and current needs;
- match willing contributors to clear ways of helping;
- hand code, issues, and pull requests to GitHub;
- make stalled projects honest and transferable instead of quietly abandoned.

## The core loop

1. A person publishes a problem worth solving.
2. Other people signal **“I need this”**, follow it, and improve its definition.
3. A project forms under the problem and links its GitHub repository.
4. The project publishes milestones and specific contribution needs.
5. A contributor chooses **“I can help”** and is handed a clear path into GitHub.
6. GitHub activity becomes understandable progress inside ManyHands.
7. Healthy projects grow; stalled projects ask for a new steward instead of becoming a mystery.

## Product boundary

**ManyHands owns coordination. GitHub owns code.**

ManyHands will not become another source-code host, a generic social network, a private gig marketplace, or an all-purpose project-management suite. The first release focuses on discovery, formation, contribution, progress, and stewardship.

Read the full product contract in [`docs/PRODUCT.md`](docs/PRODUCT.md) and the non-negotiable principles in [`docs/CONSTITUTION.md`](docs/CONSTITUTION.md).

## Help build it

Start with the [open issues](../../issues), especially [`good first issue`](../../issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22) and [`help wanted`](../../issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22).

Before contributing, read:

- [`CONTRIBUTING.md`](CONTRIBUTING.md)
- [`docs/ROADMAP.md`](docs/ROADMAP.md)
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)
- [`docs/AI_CONTRIBUTIONS.md`](docs/AI_CONTRIBUTIONS.md)
- [`GOVERNANCE.md`](GOVERNANCE.md)

### The official forking policy

🍴 **Fork it. Make it better. Make me jealous.**

**Copy the homework. Improve the homework. Send the homework back.**

Seriously: submit a pull request, launch your own flavor, or build the version that makes the original look undercaffeinated. Just keep covered improvements open so everyone—including the upstream project—can learn from them and use them under the same license.

ManyHands uses the GNU Affero General Public License so users of modified networked versions can obtain the corresponding source. See [`docs/LICENSING.md`](docs/LICENSING.md) for the practical explanation.

## Working agreements

- Problem first, code second.
- Browsing and learning should not require an account.
- Contributions are judged by quality, evidence, and community safety—not résumé, employer, geography, or popularity.
- Progress must be supported by visible evidence; vanity percentages are not enough.
- AI assistance is welcome, but humans remain accountable for every contribution.
- Accessibility, privacy, security, and moderation are product requirements.
- Decisions that affect the architecture or community are recorded publicly.

## Initial technology direction

The accepted starting direction is a TypeScript web application, a PostgreSQL database, GitHub authentication plus a least-privilege GitHub App, and a self-hostable deployment model. The exact implementation contract is in [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) and can evolve through Architecture Decision Records.

## License

Copyright © 2026 Samir Khan and ManyHands contributors.

ManyHands is free software licensed under **GNU AGPL v3 or later**. See [`LICENSE`](LICENSE) and [`docs/LICENSING.md`](docs/LICENSING.md).
