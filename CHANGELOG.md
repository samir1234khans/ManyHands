# Changelog

All notable changes to ManyHands will be documented here.

The format follows Keep a Changelog principles, and releases will use semantic versioning once application releases begin.

## [Unreleased]

### Added

- Product constitution and product contract.
- Initial domain model and architecture direction.
- Governance, contribution, conduct, security, licensing, and AI-assistance policies.
- Complete GNU AGPL v3 license text and an `AGPL-3.0-or-later` project notice.
- Reusable open-source project blueprint and maintainer playbook.
- Repository templates, taxonomy, milestones, and health automation.
- Pinned Node.js and pnpm workspace with strict TypeScript and reproducible dependency locking.
- Production-shaped Next.js App Router shell with accessible loading, error, and not-found states.
- Server-rendered public homepage that remains readable without JavaScript.
- Vitest unit checks plus Playwright production smoke tests and narrow/wide screenshot evidence.
- Pull-request CI for formatting, linting, type checking, tests, production build, and browser verification.
- Official ESLint compatibility bridge for the current Next.js lint preset on ESLint 10.
- Pinned Supabase CLI and CLI-generated local PostgreSQL/Supabase project configuration.
- Immutable identity/profile migration with a private account boundary, explicit grants, forced RLS, and a `security_invoker` public directory view.
- Stable internal attribution that survives authentication deletion while optional profile data is anonymized.
- Capability-based application authorization for profile, project-scoped, moderator, and suspended-account cases.
- Transactional pgTAP tests for schema shape, grants, cross-user RLS, suspension, and deletion/anonymization.
- Isolated Database CI for clean reset, migration history, database tests, PostgreSQL linting, generated-type drift, evidence upload, and stack teardown.
- Generated `public` and `private` database types exposed through the real `packages/data` boundary.
- Database operations, data lifecycle/retention, and stable-identity Architecture Decision Record.
- Local development, repository-shape, environment, dependency, database, lifecycle, and troubleshooting documentation.
