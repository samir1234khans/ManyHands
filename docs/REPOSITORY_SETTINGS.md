# Recommended GitHub Repository Settings

Some repository settings cannot be expressed as files. Apply this checklist to the official repository and revisit it when a second maintainer joins.

## About section

Recommended description:

> Problem-first community for building ambitious open-source software together. GitHub owns code; ManyHands owns coordination.

Recommended topics:

- `open-source`
- `collaboration`
- `community`
- `project-discovery`
- `github-app`
- `nextjs`
- `typescript`
- `postgresql`
- `supabase`
- `self-hosted`

Do not add a production website URL until a real public deployment exists.

## General settings

- Keep Issues enabled.
- Keep Projects available for maintainer planning, without making it the product model.
- Enable Discussions when there is enough community to moderate it.
- Enable private vulnerability reporting.
- Enable automatic deletion of head branches after merge.
- Prefer squash merging.
- Disable merge commits after confirming no active workflow depends on them.
- Consider disabling rebase merging to keep one predictable history style.
- Enable “Always suggest updating pull request branches.”

## `main` branch ruleset

Create a ruleset targeting `main`:

- require a pull request before merging;
- require the `Repository health / foundation` status check;
- require conversation resolution;
- block force pushes;
- block branch deletion;
- require linear history if squash-only merging is enabled;
- allow repository administrators to bypass only for documented emergencies.

While Samir is the only maintainer, requiring an approving review would prevent normal self-maintenance. Add one required approval as soon as another trusted maintainer can review independently. Do not create ceremonial self-approval.

## Suggested labels

GitHub’s default labels are enough to begin. Add this focused taxonomy as issues grow:

### Type

- `security`
- `research`
- `design`
- `infrastructure`

### Area

- `area: identity`
- `area: problems`
- `area: projects`
- `area: contributions`
- `area: roadmaps`
- `area: github`
- `area: discovery`
- `area: trust`
- `area: accessibility`

### State

- `needs decision`
- `needs design`
- `ready`
- `blocked`
- `needs reproduction`

Keep `good first issue` honest and `help wanted` actionable.

## Suggested milestones

- `v0.1 — Foundation`
- `v0.2 — Problems`
- `v0.3 — Projects`
- `v0.4 — GitHub Bridge`
- `v0.5 — ManyHands Builds ManyHands`
- `v1.0 — Stable Contributor Loop`

Milestones describe outcomes, not speculative dates.

## Security and Actions

- Use read-only workflow permissions by default.
- Grant write permissions to individual workflows only when required.
- Prevent untrusted pull-request workflows from receiving secrets.
- Pin high-risk third-party actions to reviewed commit SHAs; first-party actions may begin on stable major tags and should be watched by Dependabot.
- Require environment approval before a workflow can deploy production once deployment exists.

## Verification

After changing settings:

1. open a tiny pull request;
2. confirm the health check runs;
3. confirm direct pushes and force pushes behave as intended;
4. confirm a fork can open a pull request;
5. confirm security reporting instructions are visible;
6. update this document when the actual policy differs.
