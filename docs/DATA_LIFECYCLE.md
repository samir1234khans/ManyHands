# Data Lifecycle, Retention, and Account Deletion

This document defines the initial ManyHands data-lifecycle contract before optional contributor-profile data expands. It is an engineering and product policy, not legal advice. Deployment operators remain responsible for the laws and contractual duties that apply to their instance.

The central rule is simple:

> Collect less, separate it clearly, publish only by explicit choice, and preserve project history without preserving unnecessary personal data.

## Scope

Issue #4 introduces only the minimum durable identity and profile foundation required by the next authentication slice:

- an external authentication identity managed by Supabase Auth;
- a stable internal account identifier;
- global account lifecycle state;
- an optional contributor profile with explicit visibility;
- timestamps required to explain lifecycle transitions.

It does not introduce problem submissions, project memberships, contribution interests, private reports, GitHub installation data, webhooks, notifications, analytics identifiers, or uploaded files. Each of those areas must extend this document before collecting data.

## Data principles

### Purpose limitation

A field must support a documented product outcome, safety requirement, or operational obligation. “Might be useful later” is not a valid reason to collect it.

### Public by choice, not inference

ManyHands never assumes that an authentication provider email, display name, avatar, organization, location, or username should be public.

Public profile data is written to a dedicated profile model and controlled by explicit visibility. Provider data is not silently copied into public fields.

### Authentication is not authorization

The authentication record establishes who controls a session. The stable internal account and centralized capability policy establish what actions may be considered.

Provider metadata, user-editable JWT metadata, repository permissions, and UI state do not grant ManyHands capabilities.

### Attribution without unnecessary identity

A merged contribution, evidence record, moderation history, or project decision may need durable attribution after account deletion. The attribution key therefore points to a stable internal account rather than permanently requiring a live OAuth identity.

After deletion, public attribution becomes neutral and optional personal profile data is removed.

### Suspension is not deletion

Suspension prevents protected writes but does not erase past contributions, evidence, or accountability. A suspended user may retain permitted reads and attribution unless a separate moderation or privacy rule requires otherwise.

### No secrets in product tables

OAuth tokens, refresh tokens, GitHub App installation tokens, provider secrets, service-role keys, webhook secrets, signing keys, and session material are not profile or domain data. They belong only in approved secret stores or provider-managed systems.

## Data classification

### Public

Data intentionally visible to signed-out visitors, for example an explicitly public contributor profile or a neutral former-contributor attribution label.

Public data must still be bounded, validated, and removable when it is optional personal data.

### Member-visible

Data visible to authenticated members but not signed-out visitors. The initial profile model supports this visibility, although future product design may narrow which authenticated users qualify.

Member-visible does not mean unrestricted internal use.

### Private account data

Internal account identity and lifecycle data needed for security and attribution:

- stable internal account ID;
- detachable `auth.users` ID;
- account status;
- lifecycle timestamps;
- bounded suspension reason.

Client roles cannot query this table directly.

### Sensitive operational data

Future reports, moderator notes, security telemetry, abuse signals, IP-derived controls, OAuth records, and access tokens require separate schemas, stricter access, explicit retention, and audit logging. They must never be projected into public profile or discovery models.

## Current data inventory

### Supabase Auth

Supabase Auth may hold provider identity, email, sessions, and provider metadata required for authentication. ManyHands application queries do not treat those fields as public profile data.

The authentication provider and session configuration are implemented in issue #5. This document requires that ordinary sign-in request only identity scopes and never repository-installation permissions.

### `private.accounts`

| Field | Purpose | Public? | Deletion behavior |
| --- | --- | --- | --- |
| `id` | Stable internal attribution key | No | Preserved when historical attribution is required |
| `auth_user_id` | Link to current Supabase Auth identity | No | Cleared during anonymization |
| `status` | Global account lifecycle state | No | Changed to `anonymized` |
| `suspension_reason` | Bounded operational reason | No | Cleared during anonymization |
| lifecycle timestamps | Explain creation, update, suspension, deletion request, and anonymization | No | Retained according to operational policy |

### `public.contributor_profiles`

| Category | Examples | Default | Deletion behavior |
| --- | --- | --- | --- |
| Public identity chosen by user | handle, display name, avatar | Private | Replaced or removed |
| Contribution context | biography, skills, non-code roles, interests | Empty/private | Removed |
| Communication context | languages, timezone | Empty/private | Removed |
| Availability | unavailable, limited, open | Unavailable/private | Reset to unavailable |
| Public links | portfolio or project links | Empty/private | Removed |
| Visibility | private, members, public | Private | Neutral attribution becomes public only when needed for history |

Email is not a profile field.

## Account lifecycle

### Account creation

When Supabase Auth creates a user, the database trigger creates:

1. one stable internal account in `private.accounts`;
2. one private-by-default contributor profile;
3. a generated non-provider handle suitable only as an initial placeholder;
4. no public email, biography, skills, links, or availability claim.

The application in issue #5 must ask the user to choose profile information rather than assuming provider metadata is acceptable.

### Active

An active account may perform protected actions only when the central application policy and the database policy both allow them.

Being active does not grant a project role or moderation role.

### Suspended

Suspension changes the global account status and records a timestamp. During suspension:

- protected writes are denied by the application policy;
- profile updates are denied by RLS;
- prior attribution remains;
- permitted public or member reads may remain;
- project roles do not override the suspension;
- global moderation capability is also disabled.

A future moderation implementation must define who can suspend an account, how reasons are recorded, how appeals work, and how actions are audited.

### Deletion requested

The `deletion_requested` state is reserved for a workflow that needs time to export data, revoke sessions, unlink integrations, process safety holds, or remove optional records before deleting the authentication identity.

Issue #5 must not present deletion as complete until the workflow has actually reached anonymization or a clearly explained exception state.

### Anonymized

When the authentication identity is deleted, the database lifecycle trigger:

- locks the matching internal account row;
- clears the `auth_user_id` link;
- changes the status to `anonymized`;
- records `anonymized_at`;
- clears the suspension reason;
- replaces the handle with a neutral non-provider value;
- changes display name to `Former contributor`;
- clears biography, avatar, skills, roles-as-profile-metadata, interests, languages, timezone, and public links;
- resets availability to `unavailable`;
- preserves the stable internal account/profile key for future attribution links.

An anonymized account cannot sign in because it has no authentication identity.

## Why the neutral profile remains

Deleting a user must not corrupt project history or let a former steward silently erase other contributors’ understanding of what happened.

Future entities may reference the stable account for:

- authored problem revisions;
- project stewardship history;
- accepted contribution interests;
- milestone evidence;
- moderation decisions;
- GitHub projections and merged contributions;
- governance votes or recorded decisions where retention is justified.

The public presentation should show only a neutral attribution label after anonymization. It must not expose the former provider identity or optional profile fields.

This is not permission to retain every future field. Each new relation must document whether it is deleted, anonymized, aggregated, or retained and why.

## Retention matrix

The following is the initial engineering policy. Operators may need shorter or longer periods for a documented legal, safety, or contractual reason.

| Data | Normal account | After deletion/anonymization | Review trigger |
| --- | --- | --- | --- |
| Supabase Auth identity and sessions | While account exists | Delete/revoke through provider workflow | Authentication changes |
| Stable internal account ID | While account exists | Retain while referenced by justified history | First historical domain relation |
| Optional profile fields | Until user edits or deletes | Remove during anonymization | Any new profile field |
| Neutral attribution label | While referenced | Retain while referenced | Public attribution redesign |
| Suspension reason | While operationally required | Clear during anonymization unless a safety hold is separately modeled | Moderation implementation |
| Lifecycle timestamps | While operationally required | Retain with internal account | Compliance/operations review |
| Local test fixtures | Transaction duration | Rolled back | Test framework change |
| CI database artifacts | 14 days | Automatically expires | Workflow policy change |

Reports, moderator notes, security telemetry, raw GitHub webhook payloads, notifications, and analytics do not yet have approved retention periods and must not be collected under this foundation.

## Export

Before collecting substantial optional profile or project data, ManyHands must provide a structured account export design.

The export should eventually include data the user supplied or controls, such as:

- current profile and visibility;
- authored problem and project records;
- contribution interests and accepted work;
- follows and demand signals;
- account lifecycle state and user-visible moderation outcomes;
- linked public evidence and repositories.

The export must exclude:

- other users’ private data;
- private moderator notes or abuse signals that cannot safely be disclosed;
- tokens, provider secrets, password hashes, session material, or signing keys;
- internal security telemetry that would enable abuse;
- raw third-party data beyond what the user is entitled to receive.

Issue #16 owns the reproducible export and backup implementation. Issue #5 must document the account-facing deletion path even before the full export product exists.

## Session and integration revocation

Deleting a database row alone is not sufficient lifecycle handling.

The issue #5 workflow must:

1. require a recent authenticated session for destructive account actions;
2. revoke or sign out active sessions before deleting the authentication identity where supported;
3. prevent new protected writes as soon as deletion is requested;
4. unlink personal OAuth identity without treating project GitHub App installations as the same permission surface;
5. record a safe lifecycle outcome without logging tokens or private profile values;
6. verify that a stale or revoked session cannot restore protected access.

Repository installation revocation belongs to the GitHub bridge and project stewardship rules, not ordinary user sign-out.

## Data API boundary

A schema or table is not public merely because Supabase can expose it.

ManyHands requires:

- exposed schemas listed deliberately in configuration;
- explicit grants to `anon` and `authenticated`;
- RLS on every exposed table;
- `security_invoker` for public views;
- public read models that select only approved fields;
- negative tests for private, member, owner, moderator, suspended, and anonymous cases;
- no browser access to service-role credentials.

A future field added to a table does not automatically belong in every view, API response, log, or export.

## Logging and observability

Structured logs may record:

- a generated request or correlation ID;
- a stable internal account ID when operationally necessary;
- lifecycle event type;
- authorization capability and denial category;
- success/failure and safe error code;
- timestamps and service version.

Logs must not record:

- OAuth access or refresh tokens;
- JWTs or cookies;
- service-role or secret keys;
- private email;
- biography, links, accessibility needs, or other optional profile text;
- moderator notes, report bodies, or raw abuse evidence;
- complete authentication provider payloads.

A denial log should say that `profile.update` was denied for `account_inactive`, not dump the profile or session.

## Backups and restores

The local foundation is disposable and rebuilt from migrations. Hosted backup, restore, point-in-time recovery, retention, encryption, and restore drills remain issue #16.

Before production launch, the operator must prove that:

- a backup can be restored into an isolated environment;
- migrations apply consistently after restore;
- private schemas remain private;
- RLS and grants remain intact;
- anonymized users do not regain provider identity;
- expired backup copies follow the approved retention policy.

## Adding a new field or table

Every proposal must answer:

1. What user or safety outcome requires this data?
2. Is it public, member-visible, private, or sensitive operational data?
3. Who may create, read, update, and delete it?
4. What is the default visibility?
5. What happens on suspension?
6. What happens on account deletion?
7. How long is it retained and why?
8. Is it included in account export?
9. Could it reveal another person’s private data?
10. Which positive and negative tests prove the policy?
11. Does it enter logs, search, analytics, notifications, backups, or third-party systems?
12. Can the product work with less precise or less permanent data?

A migration that adds optional personal data without these answers is incomplete.

## Testing requirements

Lifecycle tests must be destructive and isolated. They should create synthetic users inside a transaction, exercise the actual trigger/policy path, assert the resulting public and private state, and roll back.

At minimum, future lifecycle changes need cases for:

- anonymous visitor;
- active owner;
- different authenticated user;
- suspended owner;
- project-scoped role;
- global moderator where relevant;
- deletion requested;
- completed anonymization;
- stale or revoked session at the application layer;
- retry/idempotency if background processing is introduced.

## Failure handling

If anonymization partially fails, the system must fail closed:

- keep protected writes disabled;
- avoid presenting deletion as complete;
- do not restore optional data from provider metadata automatically;
- record a safe operational error with correlation ID;
- provide an administrator recovery path that is auditable;
- rerun idempotent cleanup rather than manually editing production rows without a record.

The initial database trigger is transactional: either the authentication delete and profile anonymization complete together, or the delete fails.

## Review cadence

Revisit this document when:

- issue #5 implements authentication and profile UI;
- the first Problem or Project table is proposed;
- GitHub App installation or webhook data is stored;
- reports or moderation notes are introduced;
- notifications or analytics are introduced;
- uploads or user-generated files are introduced;
- production backup/export work begins;
- a law, platform change, or incident changes the risk model;
- an operator cannot explain where a user’s data goes after deletion.
