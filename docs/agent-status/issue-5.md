---
schema_version: "1"
issue: "5"
title: "GitHub sign-in, account lifecycle, and contributor profiles"
branch: "feat/5-github-auth-profile"
work_state: "in_progress"
contributors: "@samir1234khans"
base_commit: "1f829d82381a865fba34df139d5faaa33275cc3b"
last_verified_commit: "e36d0cbe1fafd18b3c252cb8f84cbfece2d6d4b1"
updated_at_utc: "2026-08-27T22:45:18Z"
pull_request: "35"
verification_state: "pending_full_ci"
---

# Issue #5 agent handoff

## Outcome

Deliver the first complete identity vertical slice: public browsing without signup, GitHub sign-in only when identity is required, privacy-respecting contributor profiles, safe sign-out and session failure behavior, account suspension/deletion semantics, and return to the action that initiated authentication.

## Acceptance criteria status

| Criterion | State | Evidence |
|---|---|---|
| Public pages remain readable while signed out | foundation complete | Existing server-rendered application and browser tests |
| Protected actions explain identity and return safely after sign-in | in progress | OAuth start/callback and return-path validation on draft PR #35 |
| GitHub OAuth permissions are minimized | in progress | Ordinary Supabase GitHub provider flow; no GitHub App installation |
| Private GitHub email is never public by default | foundation complete | Public profile schema excludes email and OAuth records |
| Profile create/edit/view is accessible | pending | UI not implemented |
| Invalid, expired, revoked, and duplicate callback states fail safely | in progress | Callback/error foundations exist; complete tests pending |
| Suspension prevents protected writes without erasing attribution | foundation complete | Forced RLS, centralized authorization, and pgTAP coverage from issue #4 |
| Account deletion preserves history safely | foundation complete at data layer | Anonymization migration and lifecycle tests; product UI pending |
| Cross-user profile edits are denied | foundation complete | RLS and authorization tests from issue #4 |
| Logs contain no token or private profile field | in progress | Privacy-safe identity-event helper exists; audit pending |

## Completed in this branch

- Refreshed the active branch from current `main` without losing React or GitHub Actions updates.
- Recorded Supabase SSR dependencies in the generated lockfile through a one-time self-removing workflow.
- Added Supabase SSR server, proxy, and administration clients.
- Added GitHub OAuth start and PKCE callback routes.
- Added return-path sanitization and open-redirect protection.
- Added provider-denied and callback-error foundations.
- Added current-account, recent-sign-in, environment, structured-event, and profile-validation boundaries.
- Added a database migration and pgTAP file for identity application operations.
- Added environment and local GitHub provider configuration examples.
- Opened draft PR #35 so the work is visible and continuously tested.

## Decisions made

- Ordinary GitHub login remains separate from the future GitHub App installation.
- Session-derived identity is revalidated server-side before trusted operations.
- Service-role access stays in server-only modules.
- Return destinations must be same-origin application paths.
- Profiles remain private by default until a user explicitly changes visibility.
- This draft is not mergeable merely because the security foundation exists; the complete accessible user journey and negative tests remain required.

## Remaining work

1. Inspect the first complete CI results on draft PR #35 and repair all failures before expanding UI scope.
2. Add sign-in explanation and safe configuration-error pages.
3. Add the public contributor directory and public profile pages.
4. Add authenticated profile editing with field-level accessible errors and handle-conflict behavior.
5. Add account settings, sign-out, recent-authentication, deletion, suspended, and deletion-pending experiences.
6. Add identity navigation to the public shell.
7. Add unit and end-to-end tests for success, denial, invalid/expired/revoked sessions, suspension, and deletion.
8. Regenerate database types for the new RPCs and verify drift.
9. Add authentication setup, security, environment, and operational documentation.
10. Run full application, database, repository-health, and browser evidence checks on the exact review candidate.

## Next safe action

Review the CI results for commit `e36d0cbe1fafd18b3c252cb8f84cbfece2d6d4b1`. Fix structural, type, migration, formatting, and test failures before implementing the profile UI.

## Known blockers

- A real hosted GitHub OAuth configuration is not required for local structural work, but final production verification needs a Supabase project and GitHub OAuth application configured outside the repository.
- No code blocker is currently known; CI evidence is pending.

## Security-sensitive areas

- `apps/web/src/app/auth/`
- `apps/web/src/lib/auth/`
- `apps/web/src/lib/supabase/`
- `apps/web/src/proxy.ts`
- `supabase/migrations/20260827123000_add_identity_application_api.sql`
- account deletion, service-role operations, cookie mutation, redirect handling, and structured logs

## Verification at the last checkpoint

| Check | Result | Exact commit |
|---|---|---|
| Main refresh and conflict resolution | passed by repository operation | `4117b98550fd7194f4980b135ac5919c9c37718b` |
| Dependency lockfile generation | passed | `e36d0cbe1fafd18b3c252cb8f84cbfece2d6d4b1` |
| Repository health | pending PR CI | `e36d0cbe1fafd18b3c252cb8f84cbfece2d6d4b1` |
| Application CI | pending PR CI | `e36d0cbe1fafd18b3c252cb8f84cbfece2d6d4b1` |
| Database CI | pending PR CI | `e36d0cbe1fafd18b3c252cb8f84cbfece2d6d4b1` |
| Browser evidence | not run for identity flows | `e36d0cbe1fafd18b3c252cb8f84cbfece2d6d4b1` |

## Handoff notes

The earlier branch was four commits behind `main`. It was refreshed with a two-parent merge commit because rewriting the shared AI/human checkpoint would have invalidated recorded commit IDs. The overlapping web package retained the newer React `19.2.8` versions from `main` and the Supabase/workspace dependencies from issue #5.
