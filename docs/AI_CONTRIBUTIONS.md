# AI-Assisted Contribution Policy

ManyHands welcomes responsible use of ChatGPT, Claude, coding agents, design tools, and other AI systems. The project will use them too. Assistance does not transfer accountability away from the human contributor.

## Required human ownership

The person submitting a contribution must:

- understand the proposed behavior and important implementation choices;
- verify that the change solves the linked issue;
- run relevant checks and inspect their results;
- review the complete diff, including generated files;
- verify that code, text, images, data, and dependencies can legally be contributed;
- check security, privacy, accessibility, and failure behavior;
- respond to review questions without treating model output as authority.

“I asked an AI and it said this is correct” is not verification.

## Disclosure

Disclose material AI assistance in the pull request when it generated or substantially transformed code, tests, design, research, or documentation. A useful disclosure names the tool, the parts assisted, and the human verification performed.

Example:

```text
AI assistance: Claude helped draft the initial webhook parser and ChatGPT
suggested negative test cases. I rewrote the authorization boundary, verified
payload handling against fixtures, and ran the full test suite locally.
```

Routine autocomplete does not need a diary.

## Prohibited practices

- submitting a large generated change that the author has not reviewed;
- pasting secrets, private reports, personal data, customer data, or proprietary code into an AI service;
- inventing tests, benchmarks, citations, screenshots, user research, or GitHub evidence;
- mass-opening generated issues or pull requests;
- using AI to impersonate contributors or evade the Code of Conduct;
- copying output with incompatible or unknown licensing;
- weakening tests merely to make generated code pass.

## Maintainer review

Maintainers review AI-assisted work by the same quality bar as any other contribution and may ask for a smaller diff, clearer rationale, additional tests, provenance, or a human-written explanation.

AI can help build ManyHands. It cannot become an unaccountable maintainer.
