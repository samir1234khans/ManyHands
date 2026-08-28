# Self-hosting ManyHands

ManyHands should remain operable by a competent community without privileged oral knowledge from the founding maintainer.

## Minimum services

- Node.js and pnpm versions pinned by the repository;
- a PostgreSQL 17-compatible database with Supabase-compatible Auth/Data API capabilities for the current implementation;
- a server capable of running the Next.js production build;
- a GitHub OAuth App for sign-in;
- a TLS-capable public origin for real deployments;
- a secret store outside the Git repository.

A future GitHub App becomes necessary only when repository synchronization ships under issue #10.

## Bootstrap

1. Fork or clone the repository.
2. Install the pinned Node.js and pnpm versions.
3. Install dependencies with `pnpm install --frozen-lockfile`.
4. Configure environment values documented in `.env.example` and `docs/AUTHENTICATION.md`.
5. Start or provision the database.
6. Apply every immutable migration in order.
7. Run database tests and generated-type drift checks against a non-production environment.
8. Build with `pnpm build` and start the production application.
9. Verify `/api/health/live` and `/api/health/ready`.
10. Verify source and AGPL license links in the rendered interface.

## Upgrades

- fetch reviewed upstream commits;
- read release/migration notes before deployment;
- back up production before migration work whose failure could threaten availability or data integrity;
- apply new migrations once, in order;
- deploy the compatible application commit;
- run health and representative product checks;
- keep a record of the deployed commit and migration head.

Never rewrite a migration that has already been used by a shared environment.

## Portability

The current application uses Next.js, PostgreSQL/Supabase, and GitHub. Managed Vercel and Supabase hosting are convenient official defaults, not constitutional requirements. If a managed feature becomes required for correctness, document the equivalent capability a self-hoster must provide.

## Source and license obligations

ManyHands is AGPL-3.0-or-later. A networked modified version must provide users the corresponding source as required by the license. Keep a visible source-code link and appropriate legal notice in the running application. Independent forks must not misrepresent themselves as the official ManyHands service.

## Independent self-hosting evidence

Before issue #16 is called complete, someone other than the founding maintainer should follow the instructions from a fresh environment and record missing assumptions, failed steps, deployment duration, and any corrective documentation or code changes.
