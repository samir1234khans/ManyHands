# ManyHands operations

This directory is the operational contract for the official ManyHands service and for competent self-hosters. It records what the source can prove, what an operator must configure, and which claims still require live evidence.

## Current source-level capabilities

- `GET /api/health/live` proves the Next.js process can serve a minimal request without depending on the database.
- `GET /api/health/ready` checks whether public database access is configured and responsive without exposing credentials or raw provider errors.
- `GET /api/export/public` provides a versioned JSON export built only from privacy-safe public read models. It fails closed when dependencies are unavailable instead of inventing partial success.
- Operational events use bounded correlation IDs, allow-listed fields, sanitized reason codes, and no token, email, report, or moderation content.
- Database migrations, RLS tests, generated types, application checks, and browser smoke tests run in CI.

## What this does not prove

Source tests do **not** prove that a production service is deployed, that a hosted alert fired, that backups exist, that a restore succeeded, or that another operator has independently self-hosted the product. Those require dated external evidence and remain open work under issue #16.

## Runbooks

- [`DEPLOYMENT.md`](DEPLOYMENT.md) — environments, secrets, migration sequencing, deployment and recovery decisions.
- [`BACKUP_RESTORE.md`](BACKUP_RESTORE.md) — backup ownership, restore procedure, provisional objectives, and drill evidence.
- [`INCIDENTS.md`](INCIDENTS.md) — severity, containment, recovery, communication, and post-incident expectations.
- [`SELF_HOSTING.md`](SELF_HOSTING.md) — minimum services, configuration, GitHub OAuth, database lifecycle, upgrades, source obligations, and portability.
- [`PUBLIC_EXPORT.md`](PUBLIC_EXPORT.md) — public export schema, privacy boundary, ordering, failure semantics, and compatibility policy.

## Evidence rule

Operational statements use one of three labels:

- **source verified** — enforced by code, tests, or repository configuration;
- **operator configured** — requires deployment-platform or hosted-database settings that are not stored in Git;
- **drill verified** — requires a dated exercise or real incident record.

Do not promote an operator-configured or drill-verified claim to “complete” because a Markdown checklist exists.
