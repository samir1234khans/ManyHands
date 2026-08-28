# Accessibility baseline

**Status:** Foundational engineering and design contract for every public and authenticated ManyHands journey.

**Target:** WCAG 2.2 Level AA, supplemented by project-specific interaction and constrained-device requirements.

ManyHands exists to widen participation. A workflow is not complete when it works only with a mouse, perfect vision, high bandwidth, a large display, fast hardware, or an unassisted reading experience.

Automated checks are useful evidence, not a compliance certificate. They must be combined with keyboard testing, assistive-technology review, zoom/reflow checks, forced-colors and reduced-motion checks, content review, and—when possible—inclusive testing with people who use these access methods in daily life.

## Scope

This baseline applies to:

- public browsing and discovery;
- authentication intent, provider handoff, callback, denial, and recovery;
- contributor-profile viewing and editing;
- Problem publishing and “I need this”;
- Project formation and stewardship;
- Contribution needs and “I can help”;
- Milestones, Evidence, blockers, freshness, and health;
- reports, moderation, suspension, and appeals;
- stewardship handoff;
- documentation, error, empty, loading, and degraded states.

A future feature may add stricter criteria. It may not silently weaken this baseline.

## Standards and references

- [WCAG 2.2](https://www.w3.org/TR/WCAG22/) is the conformance target.
- The [WAI WCAG 2.2 additions](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/) inform focus visibility, target size, consistent help, redundant entry, and accessible authentication.
- Playwright and `@axe-core/playwright` provide automated evidence for detectable failures.
- The constitutional promise in [`CONSTITUTION.md`](CONSTITUTION.md) remains the reason for the work; this file provides the testable practice.

## Interaction requirements

### Keyboard

- Every interactive element is reachable without a pointer.
- Focus order follows the visual and semantic reading order.
- A visible skip link reaches the main content.
- Focus is never trapped except inside a deliberate modal interaction with a documented escape route.
- Closing a transient surface returns focus to the control that opened it when that control still exists.
- No action requires hover, drag, or a precision gesture without an equivalent keyboard/simple-pointer method.
- Focus indicators remain visible and are not hidden behind sticky headers, dialogs, or scrolling containers.

### Pointer and touch

- Primary actions use a minimum target of 44 by 44 CSS pixels where layout permits.
- WCAG 2.2’s minimum target-size exceptions are not used as a reason to make routine controls difficult to activate.
- Adjacent targets have enough spacing to reduce accidental activation.
- Dragging, multi-pointer, and path-based gestures have a simple alternative.

### Focus styling

- `:focus-visible` is used so keyboard focus remains obvious without creating unnecessary pointer noise.
- Focus indicators have sufficient contrast against adjacent colors.
- Components must not remove the browser outline unless an equally visible replacement exists.
- Focus state is part of visual review in light, dark, and forced-colors modes.

## Semantic structure

- Every page has one descriptive `h1` and a logical heading hierarchy.
- Landmarks such as `header`, `nav`, `main`, `aside`, and `footer` describe the page rather than decorate it.
- Controls use native HTML elements whenever possible.
- Accessible names describe the action or destination; icons do not carry meaning alone.
- Lists, tables, definitions, statuses, and relationships use the corresponding semantic structures.
- ARIA supplements native semantics; it does not repair an avoidable non-semantic control.
- IDs, labels, descriptions, and error references remain unique and valid.

## Content and status

- Important meaning is never communicated only by color, shape, position, animation, hover, or sound.
- Status labels include text such as `blocked`, `paused`, `needs steward`, or `complete`.
- Dates and freshness include explicit text and do not rely on relative color intensity.
- Link text makes sense outside its surrounding paragraph when practical.
- Instructions use plain language and explain consequences before a person signs in or submits an action.
- Technical vocabulary links to [`GLOSSARY.md`](GLOSSARY.md) once that document is available on `main`.

## Forms and errors

- Every field has a persistent programmatic label.
- Required fields and constraints are described before submission when useful.
- Validation preserves valid user input.
- Errors are associated with their fields and summarized near the start of the form after submission.
- Focus moves to the error summary only when doing so helps the user recover; errors are also announced without excessive interruption.
- Error text states what happened and what the person can do next.
- Placeholder text is never the only label or instruction.
- Repeated information is not requested again in the same flow unless necessary for security or the person can confirm/edit it.

## Dynamic updates

- Use `aria-live="polite"` for non-urgent updates such as filter counts, saved status, claim acknowledgement, or background synchronization.
- Use assertive announcements only when immediate action is required.
- Loading states expose text, not animation alone.
- Busy regions use `aria-busy` when the current content would otherwise be misleading.
- Announcements are concise and do not repeat on every render.
- After route or major state changes, heading and focus behavior must make the new context clear.

## Motion and animation

- Essential information and actions never depend on motion.
- `prefers-reduced-motion: reduce` removes smooth scrolling and reduces transitions/animations to effectively immediate state changes.
- Automatically moving content is avoided. If introduced, it must be pausable and must not create vestibular risk.
- Loading indicators retain a readable status when animation is disabled.

## Zoom, reflow, and responsive layout

- Core pages support text zoom to 200% without loss of content or function.
- At an equivalent viewport width of 320 CSS pixels (the WCAG reflow target for content viewed at 400% from 1280 pixels), pages do not require horizontal page scrolling except for genuine two-dimensional data such as a wide comparison table.
- Long URLs, code, tags, translated strings, and user content wrap or scroll within a labelled local region rather than expanding the whole page.
- Fixed/sticky regions do not cover focused content.
- Orientation is not locked.

## Contrast, themes, and forced colors

- Text and meaningful graphics meet WCAG AA contrast requirements in light and dark themes.
- Focus, selected, error, success, blocked, and disabled states remain distinguishable without color alone.
- Components remain operable with `forced-colors: active`; system colors and visible borders are preferred over hidden controls.
- Background images and gradients are decorative and never required to read content.

## Authentication

WCAG 2.2 includes Accessible Authentication (Minimum). ManyHands must not require a cognitive-function test such as memorizing/transcribing a password, solving a puzzle without an alternative, or manually retyping a secret when a supported authentication method can avoid it.

GitHub OAuth is the initial identity method. The application must:

- explain why sign-in is needed before redirecting;
- preserve a safe return destination;
- provide provider-denied, expired, revoked, and configuration-error recovery;
- avoid silently requesting repository-installation permission during ordinary login;
- keep public browsing available without authentication.

## Performance and constrained devices

- Public content is server-rendered and meaningful without client JavaScript where the feature permits.
- Avoid blocking public reading on GitHub API calls, large animation libraries, or unnecessary client bundles.
- Images have dimensions and appropriate alternatives; decorative images use empty alternative text.
- Loading and degraded states remain useful on slow or intermittent connections.
- Test narrow viewports and CPU/network-constrained behavior for critical flows before release.

## Automated checks

Representative public routes run `@axe-core/playwright` with no disabled rules and fail when violations are found. Browser tests also cover:

- landmark and heading presence;
- skip-link visibility and destination;
- logical keyboard focus for primary controls;
- 320-pixel reflow and horizontal-overflow detection;
- reduced-motion behavior;
- forced-colors rendering smoke checks;
- minimum dimensions for primary action targets;
- readable public content when JavaScript is disabled.

Automation cannot reliably determine whether content is understandable, focus order is meaningful, announcements are useful, alternatives are equivalent, or a workflow is comfortable with a screen reader. Those remain manual responsibilities.

## Manual test protocol

For every release candidate affecting a core flow, record:

### Keyboard-only

1. Start from the address bar or a fresh page.
2. Reach the skip link and activate it.
3. Complete every action using `Tab`, `Shift+Tab`, `Enter`, `Space`, arrow keys where native, and `Escape` where applicable.
4. Verify focus is always visible, ordered, and not obscured.
5. Verify focus returns sensibly after transient UI closes.

### Screen reader

At minimum, test the primary browser/assistive-technology combination available to the reviewer and record it—for example NVDA with Firefox/Chrome on Windows or VoiceOver with Safari on macOS/iOS.

Verify:

- page title, landmarks, and headings;
- control names, roles, states, and descriptions;
- form labels, instructions, errors, and preserved input;
- route/state changes and live announcements;
- lists, status, progress Evidence, and relationships;
- no repeated or meaningless announcements.

A different major screen reader should be included before a public stable release.

### Zoom and reflow

- Test browser text/page zoom at 200%.
- Test 400% zoom from a 1280-pixel-wide viewport or the equivalent 320 CSS-pixel viewport.
- Verify no lost actions, clipped text, covered focus, or page-level two-dimensional scrolling.

### Reduced motion

Enable the operating system/browser reduced-motion setting. Verify smooth scroll and decorative movement stop and that every state remains understandable.

### Forced colors and high contrast

Use Windows High Contrast/forced-colors mode or browser emulation. Verify text, links, fields, focus, borders, and status remain visible and meaningful.

### Mobile and touch

Test a narrow phone viewport and real or emulated touch. Verify target spacing, keyboard appearance, zoom, orientation changes, sticky content, and error recovery.

### Low bandwidth

Use network throttling or an intermittent connection. Verify the page exposes loading/degraded text, does not lose submitted input without warning, and allows public reading whenever possible.

## Accessibility evidence in pull requests

A user-facing pull request should identify:

- routes and states tested;
- automated scan result on the exact commit;
- keyboard path tested;
- assistive technology/browser used, or why manual AT evidence remains pending;
- zoom/reflow, reduced-motion, forced-colors, and narrow-view results where relevant;
- known limitations and linked follow-up issues;
- screenshots or recordings that do not expose private user data.

Do not write “WCAG compliant” based only on axe or a single manual pass.

## Reporting a barrier

The public application links to the repository’s accessibility-barrier issue form. A report should include the route, intended task, observed barrier, impact, environment, and a privacy-safe reproduction when possible.

Do not place private identity data, tokens, security exploit details, or sensitive moderation information in a public report. Security-sensitive findings follow [`../SECURITY.md`](../SECURITY.md).

Maintainers should acknowledge accessibility barriers, reproduce them where possible, communicate current status, and prioritize blockers in core participation flows. Retaliation against a good-faith reporter is prohibited by the Code of Conduct.

## Known current limitations

ManyHands is pre-alpha. The public landing page and foundational states are testable now; authentication, profiles, Problems, Projects, contributions, moderation, and stewardship flows are still being implemented. Their issue acceptance criteria inherit this baseline and must add route/state-specific evidence before merge.
