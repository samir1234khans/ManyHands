# Validating the problem-first coordination gap

**Research date:** 28 August 2026  
**Status:** Evidence brief for issue #21; findings are hypotheses to validate, not permission to silently rewrite the ManyHands product contract.

## Executive finding

The surrounding market is crowded around **repositories, labelled issues, contributor recommendations, community analytics, and funding**. It is much thinner around the complete sequence ManyHands proposes:

> unmet need → independently understandable Problem → one or more solution Projects → explicit stewardship → bounded contribution needs → GitHub handoff → evidence-backed progress → honest pause or handoff

The closest precedent found is the community-maintained **Open Source Ideas** repository, which accepts ideas as GitHub issues, lets people coordinate in comments, and records completed projects. That precedent is important: ManyHands cannot claim that nobody has attempted problem or idea discovery. Its opportunity, if validated, is to make the workflow structured, multi-project, non-code-inclusive, health-aware, and operable at larger scale—not merely to create a prettier idea board.

The strongest counterargument is also credible: GitHub Issues, Discussions, Projects, labels, README/CONTRIBUTING files, and a community chat may already be enough for motivated maintainers. A separate coordination product adds another place that can become stale, creates a cold-start problem on both the problem and contributor sides, and may increase rather than reduce maintainer work. ManyHands must prove that it shortens a real journey before building broad social or recommendation features.

## Research questions

1. How do people currently discover open-source work before or shortly after a repository exists?
2. Which products support repository discovery, issue matching, project formation, progress, health, funding, or stewardship?
3. Where does the current workflow break for users with a need, contributors, and maintainers?
4. Are non-code contribution paths represented?
5. Is “problem first” a distinct product boundary or only a different presentation of existing primitives?
6. Which narrow workflow should ManyHands validate first?

## Method

This brief used:

- current first-party product and documentation pages where available;
- current public product pages to distinguish reachable products from outdated marketing descriptions;
- peer-reviewed and preprint research on newcomer barriers and onboarding tools;
- Linux Foundation, CHAOSS, and maintainer-support material for sustainability and health context;
- a public GitHub repository as the primary precedent for idea-first coordination.

Claims about product status are dated to this research window. A reachable website is not treated as proof of an active community. Historical or marketing pages are labelled as such. Search-result volume, stars, and podcast opinions were not used as proof of demand.

## Adjacent landscape

| Category | Example | Starting object | Strong at | Missing relative to ManyHands | Status observed |
|---|---|---|---|---|---|
| Source host | [GitHub](https://docs.github.com/en/get-started/exploring-projects-on-github/contributing-to-open-source) | Repository or issue | Code hosting, issues, pull requests, review, labels, forks | A Problem independent of a chosen repository; multiple solution projects; cross-project health and stewardship | Active first-party platform |
| Curated first issues | [GitHub For Good First Issue](https://docs.github.com/en/nonprofit/contributing-to-open-source-for-good/adding-an-open-source-project) | Curated repository with labelled issues | Social-impact discovery and quality criteria | Project formation before a repository, general problem demand, stewardship transfer | Active first-party program/documentation |
| Issue delivery | [CodeTriage](https://www.codetriage.com/what) | Existing repository | Building a contribution habit by delivering issues and documentation work | Problem formation, competing solutions, roadmap evidence, project handoff | Active; public site reported roughly 100k developers and 10.5k repositories during research |
| Curated issue directory | [Up For Grabs](https://up-for-grabs.net/) | Existing repository with curated newcomer tasks | Browsing projects and labelled beginner work | Problem-first formation, team/steward model, evidence-backed progress | Active public directory |
| Skills/values matching and analytics | [Ovio](https://ovio.org/product) | Existing GitHub project or organization | Historical product description includes matching, contributor management, and metrics | Independent Problem, multiple solution Projects, stewardship transfer | Status uncertain: public project page was reachable but displayed “0 contributors” and an error loading projects during research |
| Idea registry | [Open Source Ideas](https://github.com/open-source-ideas/ideas) | Idea posted as a GitHub issue | Crowdsourced ideas, comments for cooperation, effort/difficulty labels, completed hall of fame | Structured problem quality, multiple formal Projects per Problem, explicit steward/health/evidence model | Repository remains public and unarchived; current community activity was not established by this brief |
| Community-health standards | [CHAOSS](https://www.chaoss.community/about-chaoss/) | Existing community/project data | Metrics and models for welcomingness, responsiveness, sustainability, funding, contributor breadth | Forming projects from unmet needs; converting health insight into a contributor handoff | Active Linux Foundation project |
| Project-health product | [LFX Insights](https://insights.linuxfoundation.org/) | Existing repository/project | Health, lifecycle, maintainer coverage, responsiveness, development and supply-chain signals | Pre-repository demand, contribution formation, multi-project Problem model | Active public analytics product |
| Transparent finance | [Open Collective](https://opencollective.com/fiscal-hosting) | Collective or project | Fiscal hosting, transparent income/expenses, fundraising, shared financial administration | Contribution matching, product roadmaps, GitHub progress and stewardship | Active; focused on finance and legal infrastructure |
| Grants/funding program | [Gitcoin Grants](https://gitcoin.co/blog/grants-stack-winds-down--heres-whats-changing-and-what-to-expect) | Funding application/project | Community funding and allocation experiments | General-purpose contribution coordination; code/non-code work handoff | Grants program continues, but Grants Stack was sunset in May 2025 and Allo entered maintenance mode |
| Maintainer-support business | [Tidelift](https://tidelift.com/open-source-maintainer-survey-2024) | Existing package/dependency | Paying maintainers and improving maintenance/security practices | User demand, new-project formation, volunteer contributor workflow | Active commercial support model |

## What existing systems already solve well

### 1. Finding labelled work inside existing repositories

GitHub explicitly recommends `help wanted` and `good first issue` labels, and its discovery surfaces use those labels to make approachable issues easier to find. GitHub also recognizes documentation, testing, design, feedback, and community support as valuable contribution forms. ManyHands should not reproduce a weaker issue browser; its handoff should lead to the authoritative GitHub issue and contribution process.

Sources:

- [Finding ways to contribute to open source on GitHub](https://docs.github.com/en/get-started/exploring-projects-on-github/finding-ways-to-contribute-to-open-source-on-github)
- [Encouraging helpful contributions with labels](https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions/encouraging-helpful-contributions-to-your-project-with-labels)
- [Contributing to open source](https://docs.github.com/en/get-started/exploring-projects-on-github/contributing-to-open-source)

### 2. Reducing the search burden for contributors

CodeTriage, Up For Grabs, For Good First Issue, Ovio, and similar directories reduce the effort of finding existing repositories or issues. CodeTriage’s distinctive value is repeated, small contact with repositories a contributor already cares about; its guidance explicitly argues that sustained involvement is better than random issue roulette.

Sources:

- [What is CodeTriage?](https://www.codetriage.com/what)
- [Picking the right repositories](https://www.codetriage.com/university/picking_a_repo)
- [Up For Grabs](https://up-for-grabs.net/)

### 3. Measuring existing community health

CHAOSS provides metrics and contextual metric models rather than treating one activity number as “health.” Its material covers community welcomingness, contributor breadth, responsiveness, sustainability, funding, and the limits of trace data. LFX Insights demonstrates how activity, responsiveness, maintainer coverage, lifecycle, and supply-chain signals can be presented for existing projects.

Sources:

- [About CHAOSS](https://www.chaoss.community/about-chaoss/)
- [Community Welcomingness metric model](https://www.chaoss.community/kb/metrics-model-community-welcomingness/)
- [Starter Project Health Metrics Model](https://www.chaoss.community/starter-project-health-metrics-model/)
- [Contributors metric](https://www.chaoss.community/kb/metric-contributors/)

### 4. Funding established work

Open Collective supplies financial and legal infrastructure for collectives, including fiscal hosting and transparent shared finances. Gitcoin demonstrates community allocation and public-goods funding, while its 2025 Grants Stack wind-down is a warning about the operating cost and sustainability of broad coordination infrastructure.

Sources:

- [Open Collective fiscal hosting](https://opencollective.com/fiscal-hosting)
- [Open Collective Explore](https://documentation.opencollective.com/getting-started/explore)
- [Gitcoin Grants Stack wind-down](https://gitcoin.co/blog/grants-stack-winds-down--heres-whats-changing-and-what-to-expect)
- [Allo Protocol maintenance status](https://gitcoin.co/apps/allo-protocol)

## The gap ManyHands may be able to serve

### Problem discovery before implementation lock-in

Most contribution tools begin with a repository, project, or issue. That assumes someone has already selected a solution, created governance, and performed enough decomposition to expose work. ManyHands begins one level earlier: a need should be understandable without code, and more than one Project may attempt to solve it.

Open Source Ideas proves that people can coordinate around ideas using GitHub issues. It also exposes the limitations of unstructured idea threads: progress and responsibility are comment-driven, one issue tends to become the coordination container, and there is no first-class distinction among demand, alternative projects, stewardship, contribution needs, evidence, health, and handoff.

### Turning interest into an accountable path

A need signal and a contribution offer are not the same as a vote, assignment, or commitment. ManyHands can add value if it consistently answers:

- Who is affected and what evidence supports the need?
- What solution projects already exist?
- Who is accountable for each project?
- What specific outcome needs help now?
- Who will review the work?
- Where does the contributor go next in GitHub?
- When was progress last verified?
- Is the project blocked, paused, completed, or seeking a steward?

The value is not the buttons “I need this” and “I can help.” The value is the state and accountability around them.

### Multiple projects without declaring a popularity winner

Idea boards and issue threads commonly collapse an idea and its first implementation into one object. ManyHands can preserve the Problem while allowing alternative Projects, comparison by scope and health, and independent stewardship. This matters for platform gaps such as a professional Linux creative tool, where different teams may pursue a native application, a compatibility layer, a focused subset, or a browser-based approach.

### Honest inactivity and stewardship transfer

Community-health products can identify risk, but contributor directories rarely make “needs a steward” an explicit product state with a transfer history. Research on contributor inactivity and maintainer burden supports treating breaks and continuity as normal operational realities rather than hidden failure.

Sources:

- [Will You Come Back to Contribute?](https://arxiv.org/abs/2103.04656)
- [Maintainer Perspectives on Open Source Software Security](https://www.linuxfoundation.org/research/maintainer-perspectives-on-security)

### Equal visibility for non-code work

GitHub’s guidance and CHAOSS definitions recognize non-code contributions, but issue directories often remain strongly code/issue-shaped. ManyHands can make research, design, documentation, testing, accessibility, translation, moderation, and stewardship first-class contribution needs—as long as credit and review are evidence-based and do not become a reputation leaderboard.

## Evidence that the underlying pain is real

Research consistently reports that newcomer onboarding is not one missing search box:

- A systematic review grouped newcomer barriers into social interaction, prior knowledge, finding a way to start, documentation, and technical hurdles; socialization was the most frequently evidenced category.
- A 2024/2025 systematic review of onboarding software found recommendation systems were the most common solution, while many barriers remained unaddressed and inclusion work focused largely on experience level.
- A 2024 empirical study described newcomer information as scattered across many sources and modelled a multi-step process before the first code contribution.
- Linux Foundation maintainer research calls for better automation, documentation, employer incentives, and defined practices that support rather than burden maintainers.

Sources:

- [A systematic literature review on barriers faced by newcomers](https://doi.org/10.1016/j.infsof.2014.11.001)
- [Software solutions for newcomers’ onboarding: systematic literature review](https://doi.org/10.1016/j.infsof.2024.107568)
- [Towards the First Code Contribution: Processes and Information Needs](https://arxiv.org/abs/2404.18677)
- [Linux Foundation maintainer perspectives](https://www.linuxfoundation.org/research/maintainer-perspectives-on-security)

This supports the problem, but it does **not** prove that a new standalone platform is the right intervention.

## Serious counterargument

ManyHands may be an unnecessary layer.

A capable maintainer can already combine:

- GitHub Discussions or Issues for proposals;
- Projects or issue hierarchies for planning;
- `good first issue` and `help wanted` for discovery;
- README and CONTRIBUTING documents for onboarding;
- Discord, Matrix, Slack, or forums for social coordination;
- CHAOSS/LFX tools for health;
- Open Collective or Gitcoin for funding;
- a public roadmap and release notes for evidence.

A new platform creates at least five risks:

1. **Cold start:** useful contributors will not come without useful projects, and useful projects may not list without contributors.
2. **Stale mirrors:** repository and product status can diverge, making the coordination layer less trustworthy than GitHub.
3. **Maintainer load:** every additional profile, contribution request, and health state may create another queue to manage.
4. **Low-intent demand:** “I need this” can become feature voting without domain evidence, maintenance commitment, or willingness to contribute.
5. **Idea abundance, execution scarcity:** Open Source Ideas already notes that time rather than ideas is often the limiting factor.

The burden of proof is therefore concrete: ManyHands must reduce time-to-relevant-work, increase acknowledged contribution starts, improve honest project status, or enable responsible handoff. “People liked the idea” and signup counts are insufficient.

## Product implications

### Copy

- GitHub’s direct handoff to authoritative issues and pull requests.
- CodeTriage’s emphasis on projects people genuinely use and sustained contribution habits.
- Up For Grabs and For Good First Issue’s curated, explicit newcomer readiness.
- CHAOSS’s contextual health models and warning against interpreting one activity metric in isolation.
- Open Collective’s transparent governance and financial records where funding is later introduced.
- Open Source Ideas’ low-friction way to surface ideas and invite cooperation.

### Avoid

- A generic social feed.
- Automatically importing every GitHub issue.
- A single popularity score for Problems, Projects, or people.
- Hand-entered progress percentages.
- “AI matched you” without explaining skills, scope, freshness, and reviewer capacity.
- Calling a project active because commits exist while contributor requests are ignored.
- Launching chat before the contributor handoff works.
- Funding features before moderation, governance, and conflict-of-interest rules exist.

### Validate before building broadly

- Whether people can write a useful Problem rather than a preferred implementation request.
- Whether maintainers will publish bounded contribution needs with an accountable reviewer.
- Whether contributors value problem/domain alignment over repository/language matching alone.
- Whether multiple solution Projects are useful or confusing at early scale.
- Which health and freshness signals change behavior rather than decorate a card.
- Whether non-code contributors can complete the same interest → acknowledgement → work → credit loop.

## Recommended first validation wedge

Test one constrained community where the unmet need is vivid and existing software gaps are discussable in public:

> Linux users and creative professionals trying to coordinate credible open-source alternatives or missing workflows, together with maintainers who need scoped help beyond code.

This is better than launching a universal “build anything” directory because:

- Problems are concrete and users can explain existing alternatives.
- Multiple solution approaches are plausible.
- Design, research, documentation, testing, packaging, accessibility, translation, and engineering all matter.
- It exercises the difference between a Problem and one chosen clone.
- It makes false progress and abandoned projects easy to detect.

Do not frame the wedge as “clone proprietary product X.” Frame it as an affected workflow, users, constraints, evidence, and current alternatives.

## Scrappy validation plan

### Experiment 1 — Problem quality concierge

Recruit 8–12 people who have publicly described a missing Linux/open-source workflow. Ask each to submit the need using the proposed Problem fields.

Measure:

- completion rate;
- time and questions needed to make the statement understandable;
- how often the first draft is merely a chosen implementation;
- whether existing alternatives are discovered;
- willingness to follow or provide evidence.

Success signal: at least half produce a statement another participant can understand and distinguish from a feature request without private rewriting by the maintainer.

### Experiment 2 — Project formation

Select two validated Problems. Invite domain users, designers, engineers, and maintainers to propose alternative Projects with scope, non-goals, steward, first milestone, and first contribution needs.

Measure:

- whether more than one credible approach appears;
- whether each project can name an accountable steward;
- time to first actionable need;
- number of needs with a named reviewer;
- confusion between Problem demand and Project endorsement.

### Experiment 3 — Contribution handoff

Manually match 10 participants to contribution needs based on declared skill and domain interest. Do not use recommendation AI.

Measure:

- interest → acknowledged;
- acknowledged → started;
- started → submitted artifact;
- maintainer response time;
- reasons for redirect, decline, withdrawal, or abandonment;
- code versus non-code completion.

The product hypothesis is strengthened only if ManyHands context reduces confusion compared with a direct issue link alone.

### Experiment 4 — Health comprehension

Show participants project cards with real evidence, blockers, last verified activity, and `needs_steward` states. Compare against commit-count or percentage-only cards.

Measure whether people can correctly answer:

- Is the project active or merely recently committed?
- What is blocked?
- What can I help with?
- Who will respond?
- How fresh is this information?
- Can responsibility be transferred?

### Experiment 5 — Maintainer load

Ask stewards to record minutes spent responding, redirecting, reviewing, and keeping status current.

Stop or simplify if the coordination layer adds more work than it removes. Maintainer burden is a primary failure condition, not an after-launch optimization.

## Discovery interview guide

Recruit a mix of:

1. a person with a recurring unmet software workflow but no repository;
2. a first-time open-source contributor;
3. an experienced contributor who struggles to choose projects;
4. a maintainer with many untriaged issues;
5. a maintainer who paused or archived a project;
6. a designer, researcher, writer, tester, accessibility specialist, or translator;
7. an open-source community manager or OSPO practitioner;
8. a project that has successfully transferred stewardship.

Questions:

- Tell me about the last time you thought “someone should build this.” What happened next?
- Where did you look for existing work, and what made you trust or distrust it?
- How did you decide which project or issue deserved your time?
- What information was missing before you could begin?
- What happened after you expressed interest?
- How do you tell whether a project is alive, blocked, or abandoned?
- What would make you volunteer for non-code work?
- What coordination work consumes maintainer time without improving the software?
- Have you tried to hand a project to someone else? What made it safe or unsafe?
- Which parts of this workflow must remain in GitHub?
- What would make a separate coordination site not worth using?

Avoid pitching ManyHands until the participant has described their current behavior and failure points.

## Decision gates

Proceed with the v0 direction if qualitative evidence repeatedly supports all of these:

- unmet needs are discoverable before repository formation;
- Problems can be written independently from one implementation;
- project stewards will publish bounded needs and respond;
- contributor context improves the GitHub handoff;
- non-code participation completes real outcomes;
- health/freshness information changes decisions;
- the workflow does not materially increase steward burden.

Narrow or stop if:

- users only want another issue directory;
- most Problems map cleanly to existing repositories and direct links work better;
- maintainers will not maintain the extra state;
- “I need this” produces low-intent voting rather than evidence;
- multiple Projects confuse participants without producing meaningful alternatives;
- the platform cannot remain accurate without copying GitHub data it does not own.

## Conclusion

There is evidence of a real coordination problem, but not evidence that a broad social platform is automatically the solution. ManyHands’ defensible direction is the **complete, evidence-backed contributor loop around a problem**, while deliberately delegating code and review to GitHub.

The immediate product task is not personalized matching, chat, funding, or a large public launch. It is to prove—through a small number of real Problems and Projects—that a stranger can understand the need, see honest project state, find one bounded contribution, enter GitHub, receive a response, and see the result reflected back without private handholding.
