# Adjacent platforms and the problem-first collaboration gap

- **Research date:** 2026-08-28
- **Issue:** #21
- **Decision informed:** what ManyHands must validate, copy, avoid, and deliberately not build before expanding beyond the committed v0 contributor loop
- **Method:** desk research using current official product pages, official documentation, and official/open-source repositories; no private-community scraping and no claim that desk research replaces interviews

## Executive findings

ManyHands does **not** enter an empty market. Mature products already solve important pieces of open-source collaboration:

- GitHub and GitLab organize work after a repository or project exists.
- GitHub Discussions, community chat, and forums support conversation.
- Up For Grabs, CodeTriage, Good First Issue, and similar directories help people find labeled repository tasks.
- LFX Mentorship, Google Summer of Code, and structured programs provide time-bounded mentorship and selection.
- Open Collective, Gitcoin, Polar, Algora, and related products support funding, bounties, rewards, or fiscal operations.
- CHAOSS and repository analytics help interpret project activity and community health.

The strongest remaining hypothesis is narrower than “open source needs collaboration.” It is:

> People who share an unmet need lack a durable, problem-first place to discover one another, compare multiple open-source solution attempts, see truthful project health and evidence, and enter a specific contribution path without the platform becoming a code host, generic feed, or paid gig marketplace.

Desk research supports that this combination is unusual. It does **not** yet prove that users will adopt a new platform, maintainers will keep status current, or that problem-first discovery is more valuable than improving existing GitHub-native onboarding.

The most important product risk is not a missing competitor. It is **cold-start and stewardship cost**: a directory becomes useful only when problems are well framed, projects remain honest, contribution needs are actionable, and maintainers respond. ManyHands must validate that it can improve one complete contributor journey before expanding its directory.

## Method and limitations

The comparison reviewed official pages and repositories for products spanning:

1. code hosting and repository work management;
2. community discussion;
3. issue and project discovery;
4. mentorship and structured onboarding;
5. funding and bounties;
6. health and analytics;
7. historical contribution-discovery efforts.

Sources were checked on 2026-08-28. A reachable official page does not prove healthy adoption, financial stability, active moderation, or user satisfaction. Feature descriptions are product claims unless independently validated. The research did not access private analytics, private communities, customer lists, or unpublished roadmaps.

## Comparison dimensions

The matrix uses these questions:

- **Starting object:** repository, issue, person, organization, funded task, or unmet problem?
- **Pre-repository formation:** can people gather before code exists?
- **Multiple solutions:** can several projects openly address the same problem?
- **Actionable onboarding:** does a person receive a bounded next step and responsible reviewer?
- **Non-code participation:** are design, research, writing, testing, translation, moderation, and stewardship first-class?
- **Progress evidence:** is progress linked to verifiable artifacts rather than self-reported activity?
- **Health and handoff:** can inactive work become visibly paused or request a steward?
- **Code boundary:** does the product complement or replace source hosting?
- **Economic model:** community infrastructure, subscription, funding, bounty, or program administration?

## Landscape matrix

| Product / category | Starting object | Strongest capability | Formation before repository | Multiple solutions under one problem | Non-code contribution | Evidence / health | Relationship to ManyHands |
|---|---|---|---:|---:|---:|---|---|
| [GitHub Issues](https://github.com/features/issues) and [Projects](https://github.com/features/issues) | Repository / issue | Authoritative work tracking close to code | Limited | Not modeled as a first-class problem relationship | Possible but repository conventions decide visibility | Strong code evidence; project health and stewardship remain maintainer-defined | Core integration and source of code truth, not a product to replace |
| [GitHub Discussions](https://github.com/features/discussions) | Repository / organization | Structured community conversation, Q&A, announcements | Sometimes, once a repository/community space exists | Possible through conversation, not a durable problem-to-project model | Yes, depending on community practice | Conversation history rather than derived progress | Complement; ManyHands should link rather than recreate broad discussion |
| [GitLab Issues, epics, and planning](https://about.gitlab.com/solutions/agile-delivery/) | GitLab project / group | Integrated planning and delivery lifecycle | Limited to an established project/group | Possible through organizational structure, not problem-first public discovery | Supported but delivery objects remain project-centered | Strong delivery evidence | Future forge adapter candidate; not day-one scope |
| [Up For Grabs](https://up-for-grabs.net/) | Repository / labeled task | Curated list of projects with beginner-suitable issues | No | No | Mostly whatever the linked repository exposes | Freshness depends on project feeds and labels | Clear precedent for task discovery; ManyHands must add context and health, not copy a label directory |
| [CodeTriage](https://www.codetriage.com/) | Repository | Regular issue exposure that helps people build contribution habits | No | No | Primarily issue-based; non-code depends on repository issues | Repository issue activity | Useful activation mechanic; email cadence is later evidence, not v0 necessity |
| [Good First Issue](https://goodfirstissue.dev/) | Labeled GitHub issue | Fast discovery of beginner-labeled work | No | No | Mostly code-oriented repository labels | Current issue data, limited project context | Demonstrates demand for low-friction entry; also shows the limits of labels without onboarding quality |
| [First Contributions](https://github.com/firstcontributions/first-contributions) | Training repository | Teaches the pull-request workflow in a safe practice environment | No | No | Focuses on the Git contribution mechanic | Training completion rather than project progress | Complement for Git literacy; ManyHands should not become a Git tutorial platform |
| [Ovio](https://www.ovio.org/) | Open-source project / organization / opportunity | Project and opportunity discovery with contributor-oriented presentation | Limited | Not the central public model | Stronger than issue-only directories; skills and opportunities are emphasized | Project-maintained opportunity data | One of the closest adjacent discovery products; differentiation must be tested, not asserted |
| [LFX Mentorship](https://lfx.linuxfoundation.org/tools/mentorship/) | Program / project / mentorship opportunity | Structured mentorship, applications, timelines, and program administration | Projects usually pre-exist | No | Can include varied technical/community roles depending on program | Program milestones and mentor oversight | Strong proof that guided onboarding matters; too cohort-based and administratively heavy for the everyday ManyHands loop |
| [Google Summer of Code](https://summerofcode.withgoogle.com/) | Mentoring organization / project idea | Funded, time-bounded contributor onboarding | Projects and organizations pre-exist | No | Mostly development, with organization-specific variation | Formal proposals, mentors, and program timeline | Validates mentorship and scoped ideas; not continuous open participation |
| [Open Collective](https://opencollective.com/) | Collective / fiscal entity | Transparent budgets, fiscal hosting, expenses, and contributions | Can support early groups financially | Multiple collectives can exist, but not modeled under one unmet problem | Yes, financial and operational contributors are visible | Financial transparency rather than product progress | Complement for future funding; ManyHands should link, not build accounting |
| [Gitcoin Grants](https://www.gitcoin.co/grants) | Public-good project / grant round | Funding discovery, community allocation, and rounds | Can fund early work | Multiple projects compete or coexist within rounds | Yes, but participation centers on funding/community | Funding evidence, not contribution workflow | Later integration possibility; governance/manipulation risks reinforce keeping money out of v0 |
| [Polar](https://polar.sh/) | Repository / issue / software business | Funding, subscriptions, benefits, and issue-based rewards around software | Usually repository/product exists | No problem-level comparison | Mostly work attached to repository/business outcomes | Payment/reward evidence | Adjacent economic layer; ManyHands should avoid turning “I can help” into a bid queue |
| [Algora](https://algora.io/) | GitHub issue / bounty | GitHub-native bounties and contributor reward flow | No | No | Usually implementation-oriented | Pull request and reward outcome | Demonstrates value and risks of exact task handoff; paid incentives are explicit non-goal for v0 |
| [CHAOSS](https://chaoss.community/) | Community / repository data | Open metrics and guidance for community health | No | No | Includes community and diversity perspectives beyond commits | Strong measurement vocabulary; interpretation still contextual | Valuable source for health design; ManyHands must avoid collapsing health into one score |
| [OpenSSF Scorecard](https://securityscorecards.dev/) | Repository | Automated security practice signals | No | No | Security-focused | Verifiable repository checks | Potential future Evidence input; not general project health |
| [Zulip](https://zulip.com/), Discord, Matrix, and forums | Conversation / community | Real-time or threaded communication | Yes, informally | Yes, informally | Broad participation | Weak structured progress and handoff | Complements; ManyHands should not become chat in v0 |

## Detailed observations

### 1. Code hosts are excellent after a project exists

GitHub and GitLab provide authoritative repositories, issues, pull requests, releases, permissions, and planning tools. Their fundamental navigation starts from a repository, organization, or project. A person can create a discussion or issue describing an unmet need, but the platform does not require the need to remain independent from one implementation.

This supports the ManyHands boundary rather than a replacement strategy:

- GitHub remains authoritative for code and review.
- ManyHands may explain why a repository exists, which problem it addresses, how it compares with other attempts, and where a contributor can enter.
- Duplicating issues, pull requests, or commit browsing would compete with a mature system and create synchronization failure.

### 2. Issue directories reduce search cost but not onboarding ambiguity

Up For Grabs, CodeTriage, Good First Issue, and curated repositories prove that people seek help finding a first task. Their common unit is a repository issue selected through a label or maintainer opt-in.

That model has clear strengths:

- low integration cost;
- immediate handoff to the source repository;
- no need to recreate code-host workflows;
- a bounded object that can be completed.

Its limitations are directly relevant:

- “good first issue” quality varies dramatically;
- issue labels do not explain project responsiveness, health, scope, or contributor expectations;
- non-code roles are often invisible unless maintainers create matching issues;
- an issue directory begins after someone has already formed a project;
- an apparently open task may be stale, duplicated, unavailable, or missing a reviewer.

ManyHands should copy the **exact handoff** and avoid copying the assumption that a label is sufficient onboarding.

### 3. Structured mentorship works, but it is expensive

LFX Mentorship and Google Summer of Code demonstrate that contributors are more likely to make meaningful progress when they receive:

- scoped work;
- an accountable mentor;
- explicit application/onboarding information;
- a timeline and outcome;
- regular response and review.

Those programs also reveal the operational cost: selection, mentor capacity, scheduling, administration, and limited cohorts. ManyHands cannot promise program-level mentorship for every open need.

The product implication is to expose the minimum responsible version of those conditions:

- one bounded outcome;
- one named reviewer or owner;
- prerequisites and acceptance criteria;
- acknowledgement and next action;
- honest response and inactivity state.

### 4. Funding products solve a different coordination problem

Open Collective, Gitcoin, Polar, and Algora can make money, sponsorship, bounties, and fiscal operations legible. They do not make funding inherently safe or convert a poorly framed problem into a healthy project.

Adding money early would introduce:

- fraud and identity risk;
- tax, payment, sanctions, and dispute obligations;
- incentive distortion toward easily priced code tasks;
- pressure to rank people and projects by financial activity;
- conflicts between maintainers, sponsors, users, and contributors.

ManyHands should preserve integration points and public Evidence links but keep payments, bounties, escrow, and employment matching outside v0.

### 5. Health metrics are useful only when explainable

CHAOSS provides a broad vocabulary for community activity, responsiveness, risk, diversity, and sustainability. OpenSSF Scorecard demonstrates how verifiable automated checks can communicate a narrow dimension clearly.

The lesson is not to invent one “project score.” Different projects have different cadences and outputs. Research, design, documentation, and seasonal projects can be healthy without frequent commits.

ManyHands health should explain signals such as:

- last verified milestone or release movement;
- open contribution needs with responsive owners;
- known blockers and next action;
- GitHub synchronization freshness;
- steward update freshness;
- explicit pause or stewardship request.

It should never become a contributor-worth score or a universal productivity ranking.

### 6. Conversation products are complements, not the missing model

Discord, Zulip, Matrix, forums, mailing lists, and GitHub Discussions can host pre-repository conversation and community formation. They are flexible enough to discuss almost anything, which is both their strength and limitation.

Important decisions, current project state, contribution opportunities, and stewardship can become buried in channels or threads. ManyHands should link to the community’s chosen communication space while keeping the structured public state in the product.

## Historical caution: discovery platforms can become stale

Open-source discovery products face a recurring maintenance problem: repository metadata, project descriptions, beginner tasks, contact people, and activity signals decay unless owners update them or integrations detect staleness.

Historical projects such as [OpenHatch](https://github.com/openhatch/oh-mainline) are useful cautionary references. OpenHatch invested in contributor education and project discovery, but its archived code and historical materials show that a broad onboarding platform is itself a substantial community product to maintain.

The safe conclusion is not that a specific historical product “failed” for one reason. It is that ManyHands must design for:

- explicit freshness;
- graceful pause/archive states;
- stewardship handoff;
- import/sync failure visibility;
- small initial scope;
- exportability and a responsible fork path.

## Strongest evidence for the ManyHands hypothesis

1. **Contributor discovery is repeatedly rebuilt.** Several active products and community lists help people find repositories or first issues, indicating persistent search and onboarding friction.
2. **Structured guidance improves contribution.** Mentorship programs invest heavily in scope, owners, expectations, and review, suggesting that raw issue exposure is insufficient.
3. **Code-host primitives do not preserve the problem independently.** Issues and discussions can contain problem statements, but public navigation and project identity remain repository-centered.
4. **Health and continuity require more than commits.** CHAOSS and community-health practices treat responsiveness, governance, risk, and sustainability as distinct concerns.
5. **Non-code work needs deliberate visibility.** Code-host contribution graphs and issue labels tend to privilege code unless maintainers create and recognize other work explicitly.
6. **Multiple solutions are normal in open source.** Forks and competing implementations exist, but no reviewed product in this set centers a neutral unmet problem with several projects and comparable health/evidence.

## Strongest evidence against or weakening the hypothesis

1. **Existing tools may be sufficient when used well.** A disciplined maintainer can combine GitHub Discussions, Projects, issue templates, labels, README onboarding, community chat, and a funding platform without introducing another account or directory.
2. **Maintainer response capacity is the bottleneck.** A better directory cannot make an unresponsive project review contributions. ManyHands may expose the problem more clearly without solving it.
3. **Problem framing can be subjective and political.** People may disagree about whether two needs are duplicates, whether one project truly addresses a problem, or which evidence is credible.
4. **Cold start is severe.** Contributors will not visit an empty problem directory; maintainers will not maintain another profile without contributors; users will not signal demand unless projects react.
5. **Status maintenance can become unpaid administration.** Milestones, health, contribution needs, and handoffs are valuable only if kept current or derived safely.
6. **Cross-project ranking invites manipulation.** Demand signals and discovery can become popularity contests, marketing channels, or brigading targets.
7. **A platform may fragment community attention.** Asking people to check ManyHands in addition to GitHub and their community channel can increase coordination cost.

## Differentiation that appears credible enough to test

ManyHands should test this combined proposition rather than broad “open-source social network” positioning:

1. Start from a **Problem** understandable without code.
2. Allow **multiple Projects** to address it without declaring a popularity winner.
3. Require each active Project to show a **Steward**, scope, non-goals, Health, and freshness.
4. Publish **Contribution Needs** with a bounded outcome, owner/reviewer, acceptance criteria, and exact GitHub handoff.
5. Derive progress from **Milestones and Evidence**, not a manually entered percentage.
6. Make pause, archive, and `needs_steward` honest and recoverable.
7. Give design, research, documentation, testing, accessibility, translation, moderation, and operations the same structural legitimacy as code.
8. Keep GitHub authoritative for code.

## Differentiation traps to avoid

- “GitHub plus Reddit” as a feature checklist rather than a specific workflow.
- A generic feed optimized for reactions or time spent.
- AI-generated project ideas without real affected users or stewards.
- A directory that imports thousands of repositories before health and onboarding quality work.
- Reputation scores based on commits, followers, or need-signal counts.
- Promising automatic contributor matching before enough high-quality supply and demand data exists.
- Building chat, source hosting, task management, payments, or native mobile apps before the self-hosting acceptance test.
- Calling every signup a founding contributor.

## What ManyHands should copy

### From issue directories

- one-click handoff to the authoritative issue;
- clear skill/experience cues;
- low-friction public browsing;
- simple project opt-in.

### From mentorship programs

- named human responsibility;
- explicit prerequisites and outcomes;
- acknowledgement and review expectations;
- respectful decline/redirect behavior.

### From code hosts

- links to immutable evidence;
- transparent history;
- familiar issue/PR/release concepts;
- least-privilege integrations.

### From health and security tooling

- explainable dimensions;
- source and observation time;
- narrow claims rather than one universal score;
- degraded/stale states when data cannot be verified.

### From funding platforms

- transparent external links and evidence;
- clear separation of project identity from financial activity;
- explicit governance and conflicts when funding is considered later.

## What ManyHands should deliberately not build in v0

- repository hosting;
- pull-request review;
- generic chat or direct messaging;
- paid bounties, escrow, or job matching;
- opaque recommendation models;
- contributor reputation scoring;
- private enterprise workspaces;
- automatic project generation;
- support for every forge;
- arbitrary progress percentages.

## Narrow validation target

The first validation should use **Build ManyHands** rather than importing unrelated projects.

### Target participants

- 4–6 maintainers who have struggled to scope or review newcomer work;
- 4–6 contributors who attempted a first contribution in the last year, including people whose attempt stalled;
- 3–4 non-code contributors in design, documentation, research, testing, accessibility, translation, or community operations;
- 3–4 people who experience a software gap but cannot build the full solution alone;
- 2–3 project stewards who have paused, archived, or handed off an open-source project.

### Prototype journey

1. Participant reads one problem statement.
2. Participant compares two plausible project approaches.
3. Participant explains project Health and Evidence in their own words.
4. Participant selects a Contribution Need matching their skill.
5. Participant predicts what will happen after “I can help.”
6. Participant enters the exact GitHub handoff.
7. Maintainer receives and responds through the ordinary repository flow.
8. Merged or declined work is reflected back honestly.

### Falsifiable signals

The hypothesis weakens if:

- participants prefer a well-structured GitHub README/Project and see no value in the extra layer;
- maintainers will not maintain or approve derived status;
- contributors still need private explanation after reading the need;
- people cannot distinguish Problem from Project;
- multiple-solution presentation creates confusion without improving choice;
- non-code contributors cannot find meaningful work;
- the additional account/transition causes more abandonment than it prevents.

## Discovery interview guide

### For maintainers

1. Tell me about the last outside contributor who expressed interest but did not submit useful work.
2. Where did they first encounter the project?
3. What context did you have to explain privately?
4. How do you decide whether an issue is safe for a newcomer?
5. How often do open contribution issues become stale?
6. What happens when you cannot respond for several weeks?
7. Have you ever tried to hand off a project? What information or access was missing?
8. Which non-code work is important but structurally invisible?
9. Would you maintain a separate project page? What would need to be derived automatically?
10. What would make you refuse a ManyHands integration?

### For contributors

1. How did you choose the last open-source project you tried to help?
2. What made you trust that the project was active and welcoming?
3. Which information was missing before you started?
4. Did “good first issue” accurately describe the task?
5. Where did you get stuck between interest and a submitted contribution?
6. How long were you willing to wait for acknowledgement or review?
7. Would project health or response-time information change your choice?
8. How would you want to be redirected if the task was unsuitable?
9. What contribution skills do you have that issue directories rarely expose?
10. Would an extra coordination account be worth it? Under what condition?

### For people with an unmet need

1. How do you currently search for an existing open-source solution?
2. How would you explain the need without naming your preferred implementation?
3. What evidence would show that other people share it?
4. Would several competing projects be useful or overwhelming?
5. What can you contribute if you cannot write the software?
6. What would make a project’s progress trustworthy?
7. What would you expect after selecting “I need this”?

## Recommended next experiments

### Experiment 1: GitHub-only control

Create an excellent GitHub-native onboarding experience for one ManyHands issue: README context, issue template, owner, acceptance criteria, and response expectation. Measure contributor comprehension and activation.

### Experiment 2: Static ManyHands project page

Present the same work through a static Problem → Project → Need → Evidence page. Do not require signup. Compare whether participants understand purpose, health, alternatives, and next action faster than the GitHub-only control.

### Experiment 3: “I can help” expectation test

Prototype the pre-submit explanation, onboarding questions, maintainer acknowledgement, redirect, and decline states. Test whether the flow creates clarity or merely adds a form before GitHub.

### Experiment 4: Stale project scenario

Show active, blocked, paused, and `needs_steward` projects. Test whether participants understand the difference and whether maintainers can maintain the state with acceptable effort.

### Experiment 5: Non-code doorway

Publish one design, one documentation, one accessibility, one research, and one engineering need with equivalent structure. Measure whether participants perceive them as equally legitimate.

## Product implications

1. Keep public browsing server-rendered and account-optional.
2. Make the GitHub handoff exact and early.
3. Require a responsible reviewer/owner for an open Contribution Need.
4. Show freshness and degraded sync explicitly.
5. Avoid a global feed until search and direct discovery work.
6. Treat multiple projects as alternatives, not ranked contestants.
7. Make Health explainable and cadence-sensitive.
8. Design stewardship handoff before the directory contains many projects.
9. Validate one complete external contribution before importing at scale.
10. Measure response and completion, not signup or reaction volume.

## Decision recommendation

Continue the committed v0 direction, but position the next validation around **one complete, observable contributor loop** rather than the ambition to host every large open-source idea.

No normative product-contract change is recommended from desk research alone. The next decision should be made after the GitHub-only control and static ManyHands page are tested with maintainers, contributors, non-code collaborators, and people who experience an unmet need.

## Primary-source index

- GitHub Issues / Projects: <https://github.com/features/issues>
- GitHub Discussions: <https://github.com/features/discussions>
- GitLab agile delivery: <https://about.gitlab.com/solutions/agile-delivery/>
- Up For Grabs: <https://up-for-grabs.net/>
- CodeTriage: <https://www.codetriage.com/>
- Good First Issue: <https://goodfirstissue.dev/>
- First Contributions: <https://github.com/firstcontributions/first-contributions>
- Ovio: <https://www.ovio.org/>
- LFX Mentorship: <https://lfx.linuxfoundation.org/tools/mentorship/>
- Google Summer of Code: <https://summerofcode.withgoogle.com/>
- Open Collective: <https://opencollective.com/>
- Gitcoin Grants: <https://www.gitcoin.co/grants>
- Polar: <https://polar.sh/>
- Algora: <https://algora.io/>
- CHAOSS: <https://chaoss.community/>
- OpenSSF Scorecard: <https://securityscorecards.dev/>
- Zulip: <https://zulip.com/>
- OpenHatch historical repository: <https://github.com/openhatch/oh-mainline>
