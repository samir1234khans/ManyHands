# GitHub authentication

**Status:** issue #5 implementation guide. The identity pull request remains draft until the complete user journey and negative tests pass.

ManyHands uses Supabase Auth with GitHub as its first login provider. Ordinary login establishes a person’s identity; it does **not** install the future ManyHands GitHub App, request repository access, or grant project authority.

## Trust boundaries

- GitHub proves the external identity through Supabase Auth.
- `auth.users` stores the external authentication identity.
- `private.accounts` stores the stable ManyHands identity and lifecycle state.
- `public.contributor_profiles` stores only user-chosen profile information.
- Repository installation is a separate future GitHub App flow.
- Server-side capability checks remain mandatory even when database RLS also denies unsafe access.

Never expose private GitHub email, OAuth tokens, refresh tokens, service-role credentials, moderator notes, or security telemetry through a public profile or client log.

## Local prerequisites

- Node.js and pnpm versions from the repository root
- Docker Desktop or Docker Engine
- A GitHub OAuth App for local testing

Create the OAuth App with:

- **Homepage URL:** `http://127.0.0.1:3000`
- **Authorization callback URL:** `http://127.0.0.1:54321/auth/v1/callback`

The callback above belongs to local Supabase Auth. The application’s own PKCE completion route is `/auth/callback`; Supabase redirects there after the provider exchange.

## Configure secrets locally

Copy the repository example without committing the resulting file:

```bash
cp .env.example .env
```

Set at least:

```text
SITE_URL=http://127.0.0.1:3000
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<local publishable/anon key>
SUPABASE_SERVICE_ROLE_KEY=<local service-role key>
GITHUB_CLIENT_ID=<GitHub OAuth App client ID>
GITHUB_SECRET=<GitHub OAuth App client secret>
```

`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` is intentionally browser-visible and remains constrained by explicit grants and RLS. `SUPABASE_SECRET_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, and `GITHUB_SECRET` are server-only values and must never be prefixed with `NEXT_PUBLIC_`.

For hosted Supabase, prefer the hosted secret key supported by the project instead of distributing a long-lived service-role JWT. Local development may use the CLI-provided service-role value.

## Enable the local GitHub provider

Copy the section from `supabase/config.github.example.toml` into `supabase/config.toml`:

```toml
[auth.external.github]
enabled = true
client_id = "env(GITHUB_CLIENT_ID)"
secret = "env(GITHUB_SECRET)"
redirect_uri = ""
```

The Supabase CLI reads `env(...)` values from the repository-root `.env` file. Do not paste a real secret directly into `config.toml`.

Start and rebuild the local stack:

```bash
pnpm db:start
pnpm db:reset
pnpm dev
```

Open `http://127.0.0.1:3000` and use the application sign-in route once its UI is complete.

## Redirect safety

- Production must set an exact `SITE_URL`; OAuth redirects must not be derived from an untrusted `Host` header.
- Return paths are application-relative paths only.
- Absolute URLs, protocol-relative URLs, credential-bearing URLs, and cross-origin destinations are rejected.
- A missing or invalid return path falls back to a safe application destination.
- Provider denial and invalid, reused, or expired callback codes must produce useful errors without revealing tokens or stack traces.

## Session handling

The Next.js proxy refreshes Supabase cookies and verifies fresh token claims before server-rendered identity state is trusted. Server Components may read sessions, but cookie mutation belongs in Route Handlers, Server Actions, or the proxy boundary.

Destructive operations such as account deletion require a recent verified authentication event. A valid old session alone is not sufficient.

## Account lifecycle

- `active`: normal protected actions may proceed after server-side authorization.
- `suspended`: attribution remains, but protected writes are denied.
- `deletion_requested`: writes are locked while the server completes Auth deletion.
- `anonymized`: external identity and optional personal profile fields are removed while neutral historical attribution remains.

If Auth deletion fails after the account is write-locked, the server-only compensation operation restores the active state instead of leaving the user permanently stranded.

## Production configuration checklist

Before enabling GitHub login publicly:

- [ ] Create a dedicated production GitHub OAuth App.
- [ ] Set the exact production homepage and Supabase callback URLs.
- [ ] Configure GitHub as a provider in the hosted Supabase project.
- [ ] Set `SITE_URL` to the canonical HTTPS application origin.
- [ ] Set the hosted Supabase URL and publishable key.
- [ ] Store server credentials only in the deployment platform’s protected secret store.
- [ ] Confirm preview deployments cannot access production credentials or user data.
- [ ] Verify allowed redirect URLs in Supabase contain only expected application origins.
- [ ] Exercise sign-in, denial, callback replay, expired/revoked session, suspension, sign-out, and deletion paths.
- [ ] Inspect logs to ensure no token, email, provider payload, or private profile field is emitted.
- [ ] Capture keyboard, screen-reader, narrow-viewport, and reduced-motion evidence for the complete flow.

## Verification expectations

Identity work is not review-ready until the exact pull-request head passes:

```bash
pnpm agent:check
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm db:start
pnpm db:reset
pnpm db:test
pnpm db:lint
pnpm test:e2e
pnpm db:stop
```

The hosted OAuth flow also needs a manual test using a non-production test account. Never place captured OAuth responses, cookies, or token-bearing URLs in screenshots or pull-request comments.
