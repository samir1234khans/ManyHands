# Deployment and release runbook

## Environments

Use separate local, preview/test, and production environments. Preview deployments must never inherit production Supabase secrets or production user data. The official service may use Vercel and managed Supabase, but neither is part of the domain model.

## Required configuration

Public application configuration:

- `SITE_URL` — exact canonical HTTPS origin in production;
- `NEXT_PUBLIC_SUPABASE_URL` — target Supabase API origin;
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` — browser-safe key constrained by explicit grants and RLS.

Server-only configuration:

- `SUPABASE_SECRET_KEY` or the local-only service-role fallback where explicitly required;
- GitHub OAuth client secret for authentication provider configuration;
- future GitHub App secrets only when issue #10 ships.

Secrets belong in the deployment platform's protected secret store. Never copy production values into preview, source control, CI logs, screenshots, handoffs, or public incident notes.

## Release sequence

1. Identify the exact reviewed commit and verify required CI on that SHA.
2. Confirm schema migration compatibility and inspect destructive/locking changes.
3. Confirm required environment variables exist in the target environment.
4. Take or verify the required database backup checkpoint before a risky schema change.
5. Apply migrations once from the reviewed migration history. Never edit a migration already used by another environment.
6. Deploy the application built from the same reviewed commit.
7. Verify `/api/health/live` returns `200`.
8. Verify `/api/health/ready` returns `200` against the target database.
9. Exercise a small signed-out product read and the source/license links.
10. Record deployment commit, migration version, operator, time, and any deviation.

## Migration failure

Prefer forward-fixing schema migrations. Rolling application code backward while leaving a newer incompatible schema in place can create a second incident.

If a migration fails:

1. stop further rollout;
2. preserve logs with secrets redacted;
3. identify whether the failed migration committed any transaction;
4. do not manually edit the migration history table to make CI green;
5. write a corrective migration when the database can safely move forward;
6. restore from backup only when data integrity cannot be recovered safely in place.

## Application rollback versus forward fix

Rollback the application only when the previous application version remains compatible with the current database and the rollback does not reintroduce a known security defect. Otherwise deploy a focused forward fix.

## Production access

Use the smallest set of named operators necessary. Administrative database and deployment access is not ordinary contributor access. Record emergency access and remove temporary elevation after the incident or release.

## Verification still required before public production claims

- real preview deployment from a reviewed commit;
- production environment isolation review;
- hosted readiness check;
- release exercise with recorded evidence;
- rollback or forward-fix exercise;
- production source-link and AGPL notice verification.
