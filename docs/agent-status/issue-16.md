---
schema_version: "1"
issue: "16"
title: "Deployment, observability, backup, export, and self-hosting"
branch: "feat/16-operations-foundation"
work_state: "claimed"
contributors: "@samir1234khans"
base_commit: "fac47e1a3b7e376be9d73122e478ff9b0675e3c4"
last_verified_commit: "fac47e1a3b7e376be9d73122e478ff9b0675e3c4"
updated_at_utc: "2026-08-28T04:24:00Z"
pull_request: "0"
verification_state: "branch_claimed_not_yet_verified"
---

# Issue #16 agent handoff

## Outcome

Make the official deployment and a competent self-hosted deployment reproducible from source, migrations, and documented configuration names, with privacy-safe health signals, structured observability, backup/restore guidance, versioned public export, release/incident procedures, and an explicit recovery path.

## First operations checkpoint

1. Add public liveness and dependency-aware readiness endpoints without exposing secrets or private data.
2. Add correlation IDs and structured request/application event helpers with strict redaction rules.
3. Add a versioned public export contract and a deterministic export route for public project data as the product model grows.
4. Document environment ownership, deployment topology, preview isolation, migration sequencing, backup/restore drill, recovery objectives, incident response, release verification, rollback/forward-fix, source/AGPL obligations, and vendor substitutions.
5. Add unit/browser checks for health/export shape, redaction, degraded dependency behavior, and public source/licensing visibility.

## Guardrails

- Preview environments never receive production secrets or production user data.
- Health endpoints never disclose credentials, database URLs, stack traces, or private records.
- Logs exclude tokens, private email, reports, moderation evidence, and raw provider/webhook payloads.
- A backup is not considered useful until a restore procedure and evidence format exist.
- Managed services may be the official default but cannot become undocumented product logic.
- This checkpoint does not claim a completed production restore drill or live deployment without external evidence.

## Next safe action

Define the observability and health contract in code and tests, then write the operational runbooks against the exact application/database boundaries already on `main`.
