# Recommended GitHub Repository Settings

This document separates repository configuration into two groups:

1. **reviewable metadata managed from the repository**, such as labels and milestones; and
2. **administrator-only controls**, such as merge policy, branch rules, and private vulnerability reporting.

The committed configuration is the source of truth. Important repository behavior should not survive only as a maintainer’s memory or a screenshot.

## Automated repository taxonomy

The source of truth for custom labels, outcome milestones, and roadmap-issue assignments is [`.github/repository-taxonomy.json`](../.github/repository-taxonomy.json).

The [`Sync repository taxonomy`](../.github/workflows/sync-repository-taxonomy.yml) workflow runs after relevant changes reach `main` and can also be dispatched manually. It is intentionally limited to:

- `contents: read`;
- `issues: write`.

The workflow is idempotent. It:

- creates missing managed labels and updates their colors and descriptions;
- creates missing managed milestones and updates their descriptions;
- assigns each declared roadmap issue to its configured milestone;
- sets each declared roadmap issue’s labels to the reviewed taxonomy state;
- rejects assignments that reference an unknown label or milestone.

Because managed issue labels are declarative, an undocumented label change made directly in GitHub may be replaced by the next synchronization. Change the taxonomy through a pull request instead. Ordinary issue discussion, assignees, bodies, comments, and state are not managed by this workflow.

The workflow does **not** change repository ownership, permissions, merge policy, branch rules, secrets, security settings, or other administrator controls.

## About section

Use this description:

> Problem-first community for building ambitious open-source software together. GitHub owns code; ManyHands owns coordination.

Use these topics:

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

Leave the website field empty until a real public deployment exists. Do not publish a placeholder, localhost address, or temporary preview as the canonical product URL.

## General settings

- Keep Issues enabled.
- Keep Projects available for maintainer planning without treating GitHub Projects as the ManyHands product model.
- Keep Discussions disabled until there is enough community and moderation capacity to support it responsibly.
- Disable the Wiki while repository documentation is canonical; avoid creating a second, easily stale knowledge base.
- Enable private vulnerability reporting.
- Enable automatic deletion of head branches after merge.
- Enable “Always suggest updating pull request branches.”
- Prefer squash merging and use pull-request titles as understandable history.
- Disable merge commits after confirming no active workflow depends on them.
- Disable rebase merging once squash-only history is adopted, so contributors face one predictable merge model.
- Keep forking enabled.
- Keep the homepage field empty until the official deployment exists.

## `main` ruleset

Create a ruleset targeting `main` with these protections:

- require a pull request before merging;
- require the `Repository health / foundation` status check;
- require conversation resolution;
- block force pushes;
- block branch deletion;
- require linear history when squash-only merging is enabled;
- allow repository administrators to bypass only for documented emergencies.

While Samir is the only maintainer, requiring an approving review would prevent normal self-maintenance. Add one required independent approval as soon as another trusted maintainer can review responsibly. Do not create ceremonial self-approval.

A bypass should be rare, explained in the resulting pull request or incident record, and followed by restoration of normal protections.

## Managed labels

The taxonomy manifest maintains a deliberately small set in addition to useful GitHub defaults such as `bug`, `enhancement`, `documentation`, `help wanted`, and `good first issue`.

### Type

- `security`
- `research`
- `design`
- `infrastructure`
- `roadmap`

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

Keep `good first issue` limited to work that a newcomer can complete without hidden architecture knowledge or private handholding. Keep `help wanted` attached only to an actionable issue with an owner, context, and acceptance criteria.

A state label describes the issue’s present work state, not its importance or popularity. Update dependency-driven states in the taxonomy as prerequisites are completed.

## Managed milestones

The taxonomy manifest maintains these outcome-oriented milestones without speculative due dates:

- `v0.1 — Foundation`
- `v0.2 — Problems`
- `v0.3 — Projects`
- `v0.4 — GitHub Bridge`
- `v0.5 — ManyHands Builds ManyHands`
- `v1.0 — Stable Contributor Loop`

An issue belongs to the milestone that owns its primary outcome. Cross-cutting requirements remain linked through issue bodies and the public roadmap instead of being duplicated into several milestones.

## Security and Actions

- Use read-only Actions permissions by default.
- Grant write permissions only to the individual workflow that needs them.
- Ensure pull requests from forks never receive repository or environment secrets.
- Require approval before a first-time external contributor’s workflow is trusted where GitHub provides that control.
- Pin high-risk third-party actions to reviewed commit SHAs; first-party actions may begin on stable major tags and should be monitored by Dependabot.
- Require environment approval before a workflow can deploy production once deployment exists.
- Review workflows that mutate issues or repository metadata with the same care as application automation.
- Keep GitHub OAuth sign-in permissions separate from the future GitHub App installation permissions.

## Branch lifecycle

ManyHands uses short-lived issue branches and has no permanent `develop` branch.

After merged-branch deletion is enabled:

- remove obsolete setup branches after confirming their pull requests are merged;
- retain active issue branches only while work is genuinely in progress;
- never reuse a merged branch for unrelated work;
- recreate a branch from current `main` when reopening abandoned work rather than reviving stale history blindly.

## Verification

After changing metadata or administrator settings:

1. confirm the taxonomy workflow completed successfully;
2. verify labels, milestone descriptions, and issue assignments match the manifest;
3. open a tiny pull request from a short-lived branch;
4. confirm `Repository health / foundation` runs and is required;
5. confirm direct pushes, force pushes, and deletion of `main` are blocked as intended;
6. confirm a fork can open a pull request without receiving secrets;
7. confirm private vulnerability reporting is visible;
8. confirm merged head branches are deleted automatically;
9. confirm the repository About text and topics match this document;
10. update this document and issue #18 whenever the enforced configuration differs.
