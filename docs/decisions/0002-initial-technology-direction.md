# 0002 — Initial technology direction

- Status: accepted
- Date: 2026-08-27
- Deciders: lead maintainer

## Context

ManyHands needs a production-capable web stack that AI-assisted and human contributors can understand, that works with GitHub, and that can be self-hosted without operating a large distributed system.

## Decision

Start with:

- TypeScript and pnpm workspaces;
- Next.js for the public and authenticated web application;
- PostgreSQL on Supabase for relational data;
- Supabase Auth with GitHub as the initial identity provider;
- a separate GitHub App for repository permissions and webhooks;
- PostgreSQL search before a dedicated search service;
- a modular monolith with explicit domain packages;
- Vercel plus Supabase for the official deployment, with self-hosting documentation;
- unit, integration, and Playwright end-to-end tests.

Package versions will be selected and pinned in the implementation pull request.

## Consequences

- Identity and GitHub repository installation remain separate security boundaries.
- Managed services speed the official deployment, while migrations and application code remain portable.
- Contributors work in one repository and one primary language.
- The project avoids microservices and real-time infrastructure until evidence requires them.

## Alternatives considered

- A bespoke backend plus separate SPA: viable but adds deployment and contract overhead before the domain is proven.
- GitHub OAuth tokens for all repository access: rejected because persistent repository integration should use a GitHub App and least-privilege installation tokens.
- A separate search engine from day one: rejected as premature.
- A permanent `develop` branch: rejected in favor of protected `main` and short-lived GitHub Flow branches.

## Revisit when

Measured limitations in deployment portability, database scale, search quality, job reliability, or team ownership justify a change. Record that change in a new ADR.
