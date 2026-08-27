# ManyHands Governance

ManyHands begins with one lead maintainer, but it is designed to grow into shared stewardship without pretending that an early repository already has a mature democracy.

## Principles

- Authority follows demonstrated responsibility, not popularity.
- Product and architecture decisions are public and explainable.
- Reversible decisions should be lightweight; difficult-to-reverse decisions require wider review and an ADR.
- Community safety can override feature velocity.
- No sponsor, employer, customer, or donor purchases governance authority.
- Forks are legitimate. The official instance is distinguished by stewardship and trust, not by restricting the code.

## Roles

### Contributor

Any person who improves code, design, documentation, research, testing, translation, moderation, or community operations.

### Project steward

The accountable caretaker of a project listed on ManyHands. A steward keeps status honest, responds to contributors, protects scope, and initiates handoff when unable to continue.

### Maintainer

A contributor trusted to triage issues, review changes, merge pull requests, and protect repository quality. Maintainer access is granted after sustained, constructive work and can be narrowed by area.

### Moderator

A person trusted to enforce community rules, review reports, and take proportionate safety action. Moderation authority is independent from code skill.

### Lead maintainer

The initial lead maintainer is Samir Khan (`@samir1234khans`). The lead maintainer resolves deadlocks, manages releases and access, and is responsible for making succession possible.

## Decision process

1. **Routine and reversible:** handled in an issue or pull request by maintainers using lazy consensus.
2. **Product contract or architecture:** proposed publicly, discussed with affected contributors, and recorded as an ADR when accepted.
3. **Governance, licensing, privacy, or major safety policy:** requires an explicit proposal, a meaningful public review period, and a recorded decision.
4. **Urgent security or abuse response:** may be handled privately and immediately, followed by the maximum safe public explanation.

A decision should document the problem, options considered, trade-offs, decision owner, and conditions that would justify revisiting it.

## Becoming a maintainer

A current maintainer may nominate a contributor who has repeatedly shown:

- sound technical or community judgment;
- respectful, reliable collaboration;
- understanding of the constitution and product boundary;
- willingness to review and maintain other people’s work;
- responsible handling of access and private information.

The nomination and decision are recorded publicly unless doing so would expose sensitive safety information.

## Inactivity and succession

Maintainers may step back without stigma. Access should be removed when it is no longer needed.

If the lead maintainer is unavailable for an extended period, active maintainers may appoint an interim lead through a documented decision. If no maintainer remains, established contributors should coordinate a responsible fork and publish a clear continuity plan.

Projects listed on ManyHands must support a visible `needs_steward` state so abandoned work can invite handoff instead of implying activity.

## Conflicts of interest

A decision-maker must disclose a material financial, employment, family, or competitive interest and should recuse when that interest could reasonably distort the decision.

## Enforcement and removal

Maintainer or moderator access may be suspended for security risk, repeated neglect, undisclosed conflict, abuse of authority, or Code of Conduct violations. Action should be proportionate, documented to the extent safely possible, and appealable to an uninvolved maintainer when one exists.

## Amendments

Governance changes follow the major-policy process above. The repository history is the permanent record of every amendment.
