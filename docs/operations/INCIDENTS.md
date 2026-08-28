# Incident response runbook

## Severity guide

- **SEV-1:** confirmed data disclosure, destructive security compromise, or broad production unavailability with no safe workaround.
- **SEV-2:** serious degradation of a core flow, delayed GitHub synchronization that can mislead users, or security exposure with limited scope.
- **SEV-3:** localized failure with a safe workaround and no known confidentiality or integrity impact.

Severity may increase as evidence changes.

## First response

1. Assign one incident coordinator.
2. Record an incident start time and a private working timeline.
3. Stop unsafe deployments or writes when continued operation could worsen integrity or disclosure.
4. Preserve relevant logs without copying tokens, private reports, emails, or provider payloads into public channels.
5. Rotate or revoke credentials when compromise is plausible.
6. Establish whether the database, application, authentication provider, GitHub integration, or deployment layer is the affected boundary.
7. Prefer truthful degraded states over stale “healthy” output.

## Communication

Public updates describe user impact, affected capabilities, mitigations, and the next update time. They do not expose attack details that would increase risk, reporter identity, private data, or unverified blame.

## Recovery

- Verify `/api/health/live` separately from `/api/health/ready` so process availability is not confused with dependency health.
- Verify migrations and data integrity before restoring normal writes.
- Verify authorization and RLS after any identity or database incident.
- Confirm background/webhook queues when those systems are introduced.
- Record the exact recovery commit and configuration change.

## After the incident

Write a blameless record of timeline, impact, contributing conditions, detection, response, recovery, and corrective actions. Convert corrective actions into owned issues with acceptance criteria. Update runbooks when the response relied on undocumented knowledge.

Security vulnerabilities continue to follow `SECURITY.md`; operational incident handling does not replace coordinated vulnerability disclosure.
