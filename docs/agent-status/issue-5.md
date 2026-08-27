---
schema_version: "1"
issue: "5"
title: "GitHub sign-in, account lifecycle, and contributor profiles"
branch: "feat/5-github-auth-profile"
work_state: "in_progress"
contributors: "@samir1234khans"
base_commit: "1f829d82381a865fba34df139d5faaa33275cc3b"
last_verified_commit: "2467c163bca8eed622901a10aa8fa3cac44a8864"
updated_at_utc: "2026-08-27T23:10:44Z"
pull_request: "35"
verification_state: "foundation_ci_green"
---

# Issue #5 agent handoff

## Outcome

Deliver the first complete identity vertical slice: public browsing without signup, GitHub sign-in only when identity is required, privacy-respecting contributor profiles, safe sign-out and session failure behavior, account suspension/deletion semantics, and return to the action that initiated authentication.

## Acceptance criteria status

| Criterion | State | Evidence |
|---|---|---|
| Public pages remain readable while signed out | foundation complete | Existing server-rendered application plus successful browser smoke suite on `2467c163` |
| Protected actions explain identity and return safely after sign-in | in progress | OAuth start/callback and return-path validation are committed; explanation UI remains |
| GitHub OAuth permissions are minimized | foundation complete | Ordinary Supabase GitHub provider flow; no GitHub App installation or repository permission request |
| Private GitHub email is never public by default | foundation complete | Public profile schema excludes email and OAuth records |
| Profile create/edit/view is accessible | pending | Visible profile UI is not implemented |
| Invalid, expired, revoked, and duplicate callback states fail safely | in progress | Callback/error foundations exist; complete browser and service tests remain |
| Suspension prevents protected writes without erasing attribution | foundation complete | Forced RLS, centralized authorization, and pgTAP coverage |
| Account deletion preserves history safely | foundation complete at data layer | Anonymization and lifecycle tests pass; product settings/deletion UI remains |
| Cross-user profile edits are denied | foundation complete | RLS and authorization tests pass |
| Logs contain no token or private profile field | in progress | Privacy-safe identity-event helper exists; final audit remains |

## Completed in this branch

- Refreshed the active branch from current `main` without losing React or GitHub Actions updates.
- Recorded Supabase SSR dependencies in the generated lockfile through a one-time self-removing workflow.
- Added Supabase SSR server, proxy, and administration clients.
- Added GitHub OAuth start and PKCE callback routes.
- Added return-path sanitization and open-redirect protection.
- Added provider-denied and callback-error foundations.
- Added current-account, recent-sign-in, environment, structured-event, and profile-validation boundaries.
- Added service-restricted database RPCs for account context, deletion request/compensation, suspension, and restoration.
- Added and corrected pgTAP coverage for identity application operations.
- Regenerated committed database types and verified drift from a clean migrated database.
- Added environment, local GitHub provider, and authentication setup/security documentation.
- Repaired formatting, lint, TypeScript, internal import, migration, test-plan, and build defects exposed by CI.
- Opened draft PR #35 so the work is visible, reviewable, and continuously tested.

## Decisions made

- Ordinary GitHub login remains separate from the future GitHub App installation.
- Session-derived identity is revalidated server-side before trusted operations.
- Service-role access stays in server-only modules.
- Return destinations must be same-origin application paths.
- Profiles remain private by default until a user explicitly changes visibility.
- Destructive operations require recent verified authentication.
- This draft is not mergeable merely because infrastructure is green; the complete accessible user journey and negative tests remain required.

## Remaining work

1. Add the sign-in explanation and safe configuration-error pages.
2. Add the public contributor directory and public profile pages.
3. Add authenticated profile editing with field-level accessible errors and handle-conflict behavior.
4. Add account settings, sign-out, recent-authentication, deletion, suspended, and deletion-pending experiences.
5. Add identity navigation to the public shell.
6. Add unit and end-to-end tests for successful login, provider denial, invalid/expired/revoked sessions, suspension, cross-user access, and deletion.
7. Configure a non-production hosted Supabase project and GitHub OAuth App for manual end-to-end verification without committing credentials.
8. Perform the final accessibility, privacy, structured-log, screenshot, and acceptance-criteria audit.
9. Make PR #35 review-ready only when the exact final head passes every relevant gate.

## Next safe action

Implement the sign-in explanation and safe configuration-error pages, then add their unit/browser tests. Keep PR #35 as a draft while the user-facing profile and account-management flows remain incomplete.

## Known blockers

- No code blocker is currently known.
- Final hosted OAuth verification requires a non-production Supabase project and GitHub OAuth App configured outside the repository.

## Security-sensitive areas

- `apps/web/src/app/auth/`
- `apps/web/src/lib/auth/`
- `apps/web/src/lib/supabase/`
- `apps/web/src/proxy.ts`
- `supabase/migrations/20260827123000_add_identity_application_api.sql`
- account deletion, service-role operations, cookie mutation, redirect handling, recent authentication, and structured logs

## Verification at the last checkpoint

| Check | Result | Exact commit |
|---|---|---|
| Main refresh and conflict resolution | passed | `4117b98550fd7194f4980b135ac5919c9c37718b` |
| Dependency lockfile generation | passed | `e36d0cbe1fafd18b3c252cb8f84cbfece2d6d4b1` |
| Repository health | passed | `2467c163bca8eed622901a10aa8fa3cac44a8864` |
| Formatting and lint | passed | `2467c163bca8eed622901a10aa8fa3cac44a8864` |
| Strict type-check | passed | `2467c163bca8eed622901a10aa8fa3cac44a8864` |
| Unit tests | 15 passed | `2467c163bca8eed622901a10aa8fa3cac44a8864` |
| Production build | passed | `2467c163bca8eed622901a10aa8fa3cac44a8864` |
| Browser foundation smoke and screenshots | passed | `2467c163bca8eed622901a10aa8fa3cac44a8864` |
| Database reset, pgTAP/RLS, lint, and type drift | passed | `2467c163bca8eed622901a10aa8fa3cac44a8864` |
| Identity-specific browser journey | not yet implemented | `2467c163bca8eed622901a10aa8fa3cac44a8864` |

## Handoff notes

The earlier branch was four commits behind `main`. It was refreshed with a two-parent merge commit because rewriting the shared AI/human checkpoint would have invalidated recorded commit IDs. The overlapping web package retained React `19.2.8` and current GitHub Actions versions from `main`, plus the Supabase/workspace dependencies from issue #5. CI then exposed several mechanical defects; all structural gates now pass on `2467c163bca8eed622901a10aa8fa3cac44a8864`, but the visible identity product remains intentionally incomplete.
