---
schema_version: "1"
issue: "5"
title: "GitHub sign-in, account lifecycle, and contributor profiles"
branch: "feat/5-github-auth-profile"
work_state: "merged"
contributors: "@samir1234khans"
base_commit: "8a864a20c41ae1be5a43293ea42f044a59e52e7c"
last_verified_commit: "fd72cdec49ef89f1bb402f13ebdf004cdd4697f2"
updated_at_utc: "2026-08-28T04:06:00Z"
pull_request: "35"
verification_state: "reviewable_checkpoint_merged_parent_evidence_open"
---

# Issue #5 agent handoff

## Merged checkpoint

PR #35 was promoted to `main` as `fd72cdec49ef89f1bb402f13ebdf004cdd4697f2` after Repository Health, Application CI, Database CI, unit tests, strict TypeScript, production build, browser journeys, pgTAP, database lint, and generated-type drift all passed on its exact review head.

The merged slice includes:

- optional GitHub sign-in intent and clear explanation before provider redirect;
- same-origin return-path sanitization and safe PKCE callback handling;
- cookie-backed Supabase session refresh and server-only administration clients;
- safe configuration, provider-denied, invalid/reused callback, expired-session, revoked-session, and unknown-error experiences;
- public People directory and public profile routes backed only by the privacy-safe `profile_directory` read model;
- authenticated profile editing with accessible field errors, preserved values, handle-conflict recovery, HTTPS-only public links, IANA timezone validation, and explicit visibility;
- reusable public header, footer, and profile-card components;
- account settings, local sign-out, recent-authentication checks, suspension/deletion-pending behavior, and attribution-preserving account deletion with compensation;
- centralized capability authorization plus RLS/pgTAP cross-user, suspension, restoration, deletion-lock, and lifecycle evidence;
- privacy-safe structured identity events that exclude tokens, private email, and profile payloads.

## Parent issue remains open

The merged checkpoint is useful and persistent, but issue #5 is not closed because these acceptance-evidence items remain:

1. Configure GitHub OAuth and Supabase in a non-production hosted environment without committing credentials.
2. Record a successful real-provider callback, cookie refresh, sign-out, and return-intent journey.
3. Verify real revoked/expired provider behavior rather than only deterministic local failure paths.
4. Complete and record manual keyboard and screen-reader review of sign-in, profile editing, settings, suspended/deletion-pending states, and destructive deletion.
5. Review the final hosted logs and telemetry for token, private-email, and profile-field leakage.

## Decisions that must not be reversed

- Ordinary GitHub login is separate from future GitHub App installation and repository permission.
- Public exploration remains available without an account.
- Session-derived identity is revalidated server-side before trusted operations.
- Service-role access stays in server-only modules.
- Profiles remain private by default until explicitly changed.
- Destructive operations require recent verified authentication.
- Authentication deletion preserves neutral historical attribution while scrubbing optional profile data.

## Next safe action

Treat the implementation on `main` as the code baseline. Add hosted/manual evidence to issue #5 without creating a competing identity branch unless a concrete defect requires an issue-linked fix branch.

## Security-sensitive areas

- `apps/web/src/app/auth/`
- `apps/web/src/app/profile/`
- `apps/web/src/app/settings/`
- `apps/web/src/lib/auth/`
- `apps/web/src/lib/supabase/`
- `apps/web/src/proxy.ts`
- `supabase/migrations/20260827123000_add_identity_application_api.sql`
- cookie mutation, redirect handling, recent authentication, service-role operations, account deletion, and structured logs
