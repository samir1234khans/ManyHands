# Accessibility baseline

**Status:** engineering and design baseline for the current ManyHands public experience and every future core flow.

ManyHands exists to widen participation in ambitious open-source work. A person must not be excluded because they use a keyboard, assistive technology, zoom, a narrow viewport, reduced motion, forced colors, a low-powered device, or a slow connection.

The project targets **WCAG 2.2 Level AA** for public and authenticated core journeys. This document is an implementation baseline, not a legal certification or a claim that automated tests prove complete conformance.

## Core journeys covered

The baseline applies to:

- public landing and discovery;
- GitHub sign-in intent and authentication errors;
- contributor profiles and profile editing;
- Problem publishing and “I need this”;
- Project formation and stewardship;
- Contribution Needs and “I can help”;
- Milestones, blockers, Evidence, and project Health;
- search and filtering;
- reporting and moderation;
- account settings, suspension, deletion, and stewardship handoff.

A feature is not complete when its visual happy path works but one of these participation modes cannot complete the same outcome.

## Keyboard and focus

- Every interactive control is reachable and operable without a pointer.
- Focus order follows reading and task order; CSS reordering must not create a different semantic order.
- A visible focus indicator has at least a clear 2 CSS-pixel-equivalent perimeter and sufficient contrast against adjacent colors.
- The first focusable element is a skip link that moves focus to the primary content.
- Dialogs, popovers, and menus manage focus deliberately and return it to the initiating control when closed.
- No custom keyboard shortcut overrides browser, operating-system, or assistive-technology conventions.
- A keyboard user can escape transient UI and is never trapped outside a true modal interaction.
- Hover-only information is also available on focus and through persistent text where it affects a decision.

## Structure and semantics

- Pages use one descriptive `h1` and a logical heading hierarchy.
- Landmarks (`header`, `nav`, `main`, `aside`, `footer`) identify meaningful regions without redundant noise.
- Native controls are preferred over simulated controls.
- Links navigate; buttons perform actions.
- Accessible names describe the outcome, not only the visual icon.
- Lists, tables, status groups, progress, errors, and relationships use appropriate semantic structures.
- Problem, Project, Contribution Need, Milestone, Evidence, and Health remain distinguishable in accessible names and surrounding context.
- Decorative graphics are hidden from assistive technology; informative graphics have equivalent text.

## Forms, validation, and errors

- Every field has a persistent programmatic label.
- Required state, format, examples, and constraints are explained before submission where practical.
- Validation does not erase entered data.
- Errors identify the field, explain the problem in plain language, and describe a correction.
- A submission error receives focus or an announced summary, while individual fields remain associated with their errors.
- Success, warning, blocked, and failure states never rely on color, icons, or animation alone.
- Destructive operations explain consequences and require deliberate confirmation without coercive wording.
- Authentication errors never reveal tokens, provider payloads, stack traces, private email, or configuration secrets.

## Dynamic updates and announcements

- Dynamic changes are announced only when they affect the current task.
- `aria-live` regions are brief, specific, and not used for continuously changing decorative information.
- Loading states expose meaningful text and do not replace a stable page structure unnecessarily.
- Filtering communicates result counts and active filters without stealing focus.
- Claim, follow, “I need this,” “I can help,” moderation, and handoff outcomes provide a programmatic status message.
- Background GitHub synchronization and stale-data warnings remain readable without interrupting unrelated work.

## Color, contrast, and forced colors

- Normal text meets at least 4.5:1 contrast; large text meets at least 3:1.
- Meaningful non-text boundaries, focus indicators, and control states meet at least 3:1 against adjacent colors.
- Status is always expressed in text, not only color.
- Links are distinguishable without relying solely on hue in dense text.
- The interface remains usable in Windows High Contrast / forced-colors modes.
- Custom backgrounds never hide browser-provided focus or form affordances.

## Motion and animation

- Essential information does not depend on animation.
- `prefers-reduced-motion: reduce` disables smooth scrolling and removes non-essential transitions, transforms, parallax, and looping effects.
- No content flashes at a rate or intensity that can trigger photosensitive reactions.
- Motion triggered by interaction is brief, predictable, and does not delay the action outcome.
- An animation can be paused or omitted when it lasts more than a short transition and is not essential.

## Reflow, zoom, and responsive behavior

- Core journeys reflow at 320 CSS pixels without lost content or two-dimensional page scrolling.
- At 400% zoom, content and controls remain available in a logical order.
- Genuine data surfaces may scroll in one constrained region with an accessible label and non-drag alternative.
- Text can resize without clipping, overlap, or inaccessible controls.
- Orientation is not locked unless a task genuinely requires it.
- Mobile layouts preserve purpose, current state, consequences, and primary actions rather than hiding them behind unexplained icons.

## Touch and pointer

- Primary targets are at least 24 by 24 CSS pixels, with larger targets preferred for frequent or destructive actions.
- Adjacent targets have enough spacing to avoid accidental activation.
- Dragging always has a single-pointer and keyboard alternative.
- Pointer cancellation prevents destructive action on the initial down event.
- Touch, mouse, pen, and keyboard users receive the same information and outcome.

## Content and cognitive accessibility

- Use plain, concrete language before specialist terms.
- Explain “Problem,” “Project,” “I need this,” “I can help,” “Steward,” and Evidence in context.
- Break long operations into understandable steps while preserving a summary of the whole task.
- Do not use urgency, streaks, popularity, or shame to manipulate participation.
- Time estimates are clearly estimates, not promises or performance judgments.
- Instructions remain visible while completing complex forms.
- Repeated navigation and control labels remain consistent.

## Performance and constrained devices

- Public content is server-rendered and remains understandable when JavaScript fails or is disabled.
- Core pages avoid unnecessary client bundles and third-party scripts.
- Loading placeholders do not cause large layout shifts.
- Images and media are optional to understanding unless equivalent content is provided.
- Network and GitHub API failures produce a stable degraded state rather than an empty page.

## Automated checks

Automation is used to catch regressions, not to declare accessibility complete.

Current pull-request checks should cover representative routes for:

- meaningful landmarks and headings;
- skip-link keyboard entry;
- visible focus;
- accessible names for primary actions;
- text status rather than color-only status;
- narrow-width horizontal overflow;
- JavaScript-disabled public content;
- reduced-motion CSS behavior;
- safe form and error semantics as those flows are implemented.

Future use of an accessibility rules engine must have zero ignored critical violations and a documented reason for every lower-severity exception.

## Manual verification matrix

Before a core journey is marked complete, record evidence for:

| Mode | Minimum manual check |
|---|---|
| Keyboard | Complete the journey using Tab, Shift+Tab, Enter, Space, arrows where native, and Escape where relevant |
| Screen reader | Test at least one desktop combination and verify names, roles, values, landmarks, errors, and dynamic status |
| Zoom/reflow | 200% and 400% zoom plus a 320 CSS-pixel viewport |
| Reduced motion | Confirm non-essential motion is removed and outcomes remain clear |
| Forced colors | Confirm text, controls, focus, links, and status remain visible |
| Touch | Verify target size, spacing, scrolling, and alternatives to hover/drag |
| JavaScript disabled | Confirm public purpose, navigation, source/license links, and useful fallback text |
| Slow/failing network | Confirm loading, retry, stale-data, and error states preserve context |

The pull request should name the browser, operating system, assistive technology, route, commit, and observed result. “Looks accessible” is not evidence.

## Reporting a barrier

Use the repository’s **Accessibility barrier** issue form for public reports that contain no private information or security details.

For a barrier involving private identity, account data, harassment, or a vulnerability, follow [`../SECURITY.md`](../SECURITY.md) or the private reporting path instead of publishing sensitive information.

A useful report includes:

- the page and task;
- expected and observed behavior;
- browser, operating system, device, and assistive technology;
- keyboard steps or other reproduction details;
- impact and available workaround;
- screenshots or recordings only when they contain no private information.

## Review responsibility

Every contributor owns accessibility in the code or content they change. Reviewers may block a pull request for a core accessibility regression even when unit tests and visual screenshots pass.

Accessibility debt must be filed with impact, owner, and next action. It must not be hidden behind “we will polish it later.”
