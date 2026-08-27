# 0003 — Separate authentication identity, stable attribution, and public read models

- Status: accepted
- Date: 2026-08-27
- Deciders: founding maintainer with repository review and automated security tests

## Context

ManyHands needs an identity foundation before GitHub sign-in and contributor profiles can ship. Several requirements pull in different directions:

- Supabase Auth should own provider identity and sessions.
- Public browsing must remain account-free.
- Private email, OAuth records, tokens, reports, and moderator notes must never leak into public product queries.
- Suspension must prevent protected writes without erasing prior attribution.
- Account deletion must remove optional personal data without corrupting project and contribution history.
- Row Level Security should strengthen server-side authorization rather than becoming the only policy implementation.
- Future self-hosters need a portable PostgreSQL model rather than application behavior tied to one hosted dashboard configuration.

Using `auth.users.id` directly as the permanent foreign key for every future domain record would make provider deletion and historical attribution difficult to reconcile. Putting every field in one public table would make accidental Data API exposure more likely. Scattering ownership and role checks through routes and UI components would make policy drift inevitable.

## Decision

### Stable internal account

ManyHands creates `private.accounts` with a stable internal UUID and a detachable reference to `auth.users`.

Supabase Auth establishes the current authentication identity. The internal account establishes ManyHands attribution and lifecycle state.

Deleting the authentication identity clears that link and anonymizes optional profile data while retaining the stable account identifier when justified historical records still reference it.

### Explicit schema boundary

Internal identity and lifecycle data live in a non-exposed `private` schema.

User-chosen contributor-profile data lives in `public.contributor_profiles`, but every client operation requires both an explicit grant and an RLS policy.

Signed-out discovery uses an explicit `public.profile_directory` view with `security_invoker = true`; it does not expose the private account table or silently inherit future columns.

### Defense in depth

Application capability decisions live in `packages/domain`, are independently unit-tested, and are enforced again at server boundaries.

PostgreSQL grants and RLS provide a second boundary close to the data. The interface may hide unavailable actions for clarity but never becomes the authorization boundary.

### Lifecycle behavior

Global account status is separate from project roles:

- active accounts may be considered for protected actions;
- suspended and deletion-requested accounts cannot perform protected writes;
- anonymized accounts have no authentication identity;
- project membership or GitHub permissions cannot override global status.

Account deletion preserves a neutral `Former contributor` attribution while clearing provider linkage, biography, avatar, skills, interests, languages, availability, timezone, and public links.

### Reproducible verification

The pinned Supabase CLI generates project configuration, migration identity, and TypeScript schema types.

CI reconstructs an isolated PostgreSQL database from immutable migrations, runs pgTAP allowed and denied cases, lints database code, checks generated-type drift, uploads evidence, and deletes the local stack.

## Consequences

### Positive

- Authentication providers can change without rewriting every domain foreign key.
- Account deletion can remove optional personal data without breaking historical references.
- Public queries have a deliberately small, reviewable field surface.
- Client roles cannot query private account data directly.
- Suspended-user behavior is consistent in application policy and RLS.
- Project-scoped roles cannot accidentally become global moderation.
- Migrations, grants, policies, and types are testable from a fresh checkout.
- Self-hosters receive the same reviewed database contract as the official instance.

### Costs

- Identity joins use an internal account mapping rather than only `auth.uid()`.
- Lifecycle triggers and privileged helpers require careful review.
- Every new exposed table needs grants, RLS policies, and negative tests.
- Public read models must be updated deliberately when fields change.
- Historical retention must be justified per future domain relation; the stable account is not permission to retain all personal data indefinitely.

### Risks and mitigations

- **Risk:** a `SECURITY DEFINER` helper bypasses RLS too broadly.  
  **Mitigation:** helpers live in `private`, accept no caller-selected identity, use an empty `search_path`, return only the current internal account ID, have explicit execute grants, and are covered by tests and database linting.

- **Risk:** a new public column becomes visible unexpectedly.  
  **Mitigation:** public reads use explicit views and generated types; the secure default revokes implicit grants; review checks schema drift.

- **Risk:** deletion removes project history.  
  **Mitigation:** domain relations will reference stable account IDs and present neutral attribution after anonymization.

- **Risk:** neutral attribution is used to retain optional personal data.  
  **Mitigation:** `DATA_LIFECYCLE.md` requires every future field and table to define collection, visibility, retention, export, suspension, and deletion behavior before implementation.

## Alternatives considered

### Use `auth.users.id` as every domain foreign key

Rejected because provider identity deletion would either cascade historical records, block deletion, or force ad hoc nullability and attribution behavior throughout the product.

### Copy provider profile and email into one public user table

Rejected because provider data is not automatically public, email must remain private by default, and future schema additions would expand the accidental-exposure surface.

### Keep all identity data in `public` and rely only on RLS

Rejected because private schema separation reduces the exposed object surface and makes the read boundary easier to audit. RLS remains required on exposed data but is not the only protection.

### Use only application authorization

Rejected because one missed server-path check could expose data. RLS and explicit grants provide defense in depth.

### Use only RLS authorization

Rejected because product capabilities cross resources and external systems, need explainable typed decisions, and must be tested independently of PostgreSQL. Server authorization remains mandatory.

### Hard-delete every account-related row

Rejected because contribution, evidence, stewardship, and moderation history may require neutral attribution and auditability. Optional personal data is scrubbed instead.

### Introduce an ORM immediately

Deferred. Direct generated PostgreSQL types and small repository boundaries are sufficient for the initial slice. An ORM must demonstrate a concrete benefit without obscuring RLS, migrations, or SQL behavior.

## Revisit when

Revisit this decision if:

- a second authentication provider exposes a flaw in the mapping;
- legal or safety requirements prohibit retaining a neutral attribution key for a class of records;
- project history can be preserved safely without a stable account relation;
- performance evidence shows the identity mapping is a material bottleneck;
- Supabase or PostgreSQL changes the exposed-schema or RLS model;
- the first production deletion/restore exercise reveals an unhandled lifecycle state;
- a proposed ORM or data-access layer can improve safety without hiding authorization behavior.
