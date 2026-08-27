# Security Policy

## Supported versions

ManyHands is pre-release software. Until the first supported release, security fixes are applied to `main`; no older version is promised support.

## Report a vulnerability privately

Please **do not open a public issue** for a suspected vulnerability.

Preferred route:

1. Use GitHub’s private vulnerability reporting or a private security advisory for this repository when available.
2. Otherwise contact the lead maintainer privately using the contact information on `@samir1234khans`’s GitHub profile.

Include only what is necessary:

- affected component and version or commit;
- reproduction steps or a minimal proof of concept;
- expected and actual behavior;
- realistic impact;
- any suggested mitigation;
- whether the issue has been disclosed elsewhere.

Do not access data that is not yours, degrade service, persist access, or publish exploit details before a fix and coordinated disclosure.

## What happens next

The maintainers will validate the report, assess impact, prepare a fix, and coordinate disclosure. Exact timing depends on severity and complexity. Good-faith researchers will be credited unless they prefer anonymity.

## Security design requirements

Contributions must preserve these baseline controls:

- least-privilege GitHub OAuth and GitHub App permissions;
- server-side authorization for every protected action;
- signed and replay-safe webhook processing;
- encrypted secrets and no tokens in logs;
- strict validation and safe rendering of user Markdown;
- rate limits and abuse controls on public writes;
- auditable moderator and administrator actions;
- minimal collection of personal data;
- dependency review and reproducible migrations;
- explicit protection against cross-project privilege escalation.

The architecture document records the initial threat model and trust boundaries.
