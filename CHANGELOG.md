# Changelog

All notable changes to ManyHands will be documented here.

The format follows Keep a Changelog principles, and releases will use semantic versioning once application releases begin.

## [Unreleased]

### Added

- Product constitution, product contract, authoritative domain model, and architecture direction.
- Governance, contribution, conduct, security, licensing, accessibility, and AI-assistance policies.
- Complete GNU AGPL v3 license text and an `AGPL-3.0-or-later` project notice.
- Reusable open-source project blueprint, maintainer playbook, launch playbook, documentation map, and plain-language glossary.
- Repository templates, declarative taxonomy, milestones, branch guidance, ownership, and health automation.
- Pinned Node.js and pnpm workspace with strict TypeScript and reproducible dependency locking.
- Production-shaped Next.js App Router shell with shared navigation, accessible loading/error/not-found states, and server-rendered public content that remains meaningful without JavaScript.
- Vitest unit checks plus Playwright production verification and narrow/wide screenshot evidence.
- Pull-request CI for formatting, linting, type checking, unit tests, production build, browser verification, and evidence upload.
- Official ESLint compatibility bridge for the current Next.js lint preset on ESLint 10.
- Pinned Supabase CLI and CLI-generated local PostgreSQL/Supabase project configuration.
- Immutable identity/profile migrations with a private account boundary, explicit grants, forced RLS, and `security_invoker` public read models.
- Stable internal attribution that survives authentication deletion while optional profile data is anonymized.
- Capability-based application authorization for profile, project-scoped, moderator, suspended-account, and lifecycle-sensitive cases.
- Transactional pgTAP tests for schema shape, grants, cross-user RLS, suspension, deletion/anonymization, and identity application operations.
- Isolated Database CI for clean reset, migration history, pgTAP, PostgreSQL linting, generated-type drift, evidence upload, and stack teardown.
- Generated `public` and `private` database types exposed through the real `packages/data` boundary.
- Database operations, data lifecycle/retention, authentication, accessibility, and stable-identity Architecture Decision documentation.
- GitHub sign-in intent and safe failure recovery, cookie-backed session refresh, same-origin return paths, and privacy-safe structured identity events.
- Public People directory and contributor profiles backed only by privacy-safe read models.
- Privacy-controlled profile editing with accessible field errors, input preservation, HTTPS-only public links, handle-conflict recovery, and visibility controls.
- Account settings, local sign-out, recent-authentication checks, suspension/deletion-pending behavior, service-restricted administration, and attribution-preserving account deletion with compensation.
- Public Accessibility route, dedicated barrier-reporting issue form, shared-footer entry point, WCAG 2.2 AA engineering baseline, and browser regressions for keyboard entry, landmarks, narrow reflow, textual status, and reduced motion.
- Dated adjacent-platform research covering competitors, complements, substitutes, historical cautions, strongest evidence for and against the hypothesis, interview guides, falsifiable signals, and experiments.
- Versioned product information architecture with navigation, routes, state tables, responsive rules, accessible interaction guidance, content rules, a small semantic component/token direction, and low-fidelity desktop/mobile wireframes.
- Canonical `AGENTS.md` collaboration context with issue-specific handoffs, secret scanning, source hierarchy, and staleness validation.
- Issue-linked branch naming, draft-work promotion, conflict-safe rebasing, automatic merged-branch deletion, and audited stale-branch cleanup.

### Changed

- Promoted independently useful research, design, identity, profile, account-lifecycle, and accessibility checkpoints to `main` while keeping parent issues open for remaining hosted, manual, field, and comprehension evidence.
- Advanced the primary product milestone from foundation to `v0.2 — Problems` and claimed issue #6 on `feat/6-problem-directory-foundation` with draft PR #61.
- Made issue #6 and operations issue #16 ready for dependency-safe execution; later Project, Contribution Need, and Evidence work remains gated by their parent models.
- Reconciled duplicate accessibility work into one tested history and closed the superseded draft without discarding its commits or discussion.
