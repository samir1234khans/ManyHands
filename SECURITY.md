# Security Policy

## Supported versions

ManyHands is pre-release software. Until the first supported release, security fixes are applied to `main`; no older version is promised support.

## Report a vulnerability privately

Please **do not open a public issue** for a suspected vulnerability.

Preferred route:

1. Use GitHub’s private vulnerability reporting or a private security advisory for this repository when available.
2. Otherwise contact the lead maintainer privately using the contact information on `@samir1234khans`’s GitHub profile.

Include only what is necessary:

- affected component and version or commit;
- reproduction steps or a minimal proof of concept;
- expected and actual behavior;
- realistic impact;
- any suggested mitigation;
- whether the issue has been disclosed elsewhere.

For database or authorization findings, include the principal/role, target table or capability, expected denial, actual result, and whether the finding reproduces after `pnpm db:reset`. Do not include production rows, tokens, cookies, JWTs, provider payloads, or service-role credentials.

Do not access data that is not yours, degrade service, persist access, or publish exploit details before a fix and coordinated disclosure.

## What happens next

The maintainers will validate the report, assess impact, prepare a fix, and coordinate disclosure. Exact timing depends on severity and complexity. Good-faith researchers will be credited unless they prefer anonymity.

A database or authorization fix must include a regression test for the denied path. A merged migration is never edited in place; corrective schema changes use a new migration.

## Security design requirements

Contributions must preserve these baseline controls:

- least-privilege GitHub OAuth and GitHub App permissions;
- server-side authorization for every protected action;
- centralized, typed capability policy rather than scattered UI booleans;
- explicit PostgreSQL grants plus Row Level Security on every exposed table;
- denial-by-default and negative tests for anonymous, cross-user, cross-project, moderator, and suspended-account cases;
- private account, token, report, moderation-note, and security-telemetry data kept out of public read models;
- narrowly scoped database functions with fixed `search_path`, explicit execute grants, and no caller-selected identity when `auth.uid()` is sufficient;
- signed and replay-safe webhook processing;
- encrypted secrets and no tokens, cookies, JWTs, provider payloads, or optional profile text in logs;
- strict validation and safe rendering of user Markdown, links, profile URLs, and uploaded assets;
- rate limits and abuse controls on public writes;
- auditable moderator and administrator actions;
- minimal collection of personal data and a documented lifecycle before adding optional fields;
- immutable migrations, reproducible clean-database resets, database linting, and generated-type drift checks;
- dependency review and explicit protection against cross-project privilege escalation.

The architecture document records the initial threat model and trust boundaries. [`docs/DATABASE.md`](docs/DATABASE.md) defines the database security contract, and [`docs/DATA_LIFECYCLE.md`](docs/DATA_LIFECYCLE.md) defines suspension, retention, deletion, and anonymization behavior.
