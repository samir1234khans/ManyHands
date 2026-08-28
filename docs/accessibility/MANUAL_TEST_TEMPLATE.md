# Manual accessibility evidence template

Use this file as a copyable checklist for a release candidate or a pull request affecting a core ManyHands journey. Do not mark an item passed unless it was exercised on the exact commit named below.

## Checkpoint

- Issue or pull request:
- Exact commit:
- Date in UTC:
- Tester:
- Routes and states:
- Browser and version:
- Operating system and version:
- Device or viewport:

## Keyboard-only

- [ ] The skip link is the first useful focus stop and reaches `main`.
- [ ] Every interactive control is reachable and operable.
- [ ] Focus order follows the visual and semantic order.
- [ ] Focus is always visible and not covered by sticky content.
- [ ] Transient surfaces provide an escape route and restore focus sensibly.
- [ ] No action depends only on hover, drag, or a precision gesture.

Evidence and notes:

## Screen reader

- Assistive technology and version:
- Browser:

- [ ] Page title, landmarks, and headings communicate the route and hierarchy.
- [ ] Controls expose useful names, roles, states, and descriptions.
- [ ] Forms expose labels, constraints, errors, and preserved input.
- [ ] Dynamic updates are announced once and at the appropriate urgency.
- [ ] Lists, status, progress Evidence, and relationships are understandable.
- [ ] There are no repeated, empty, or misleading announcements.

Evidence and notes:

## Zoom and reflow

- [ ] Content remains usable at 200% zoom.
- [ ] The page reflows at the equivalent of 320 CSS pixels/400% zoom.
- [ ] No action or content is clipped, covered, or lost.
- [ ] Page-level horizontal scrolling occurs only for genuine two-dimensional data.

Evidence and notes:

## Reduced motion

- [ ] Smooth scrolling and decorative transitions stop or become effectively immediate.
- [ ] No essential information or action depends on animation.
- [ ] Loading and state changes remain understandable without motion.

Evidence and notes:

## Forced colors and contrast

- [ ] Text, links, fields, borders, focus, and status remain visible in forced-colors/high-contrast mode.
- [ ] State is not communicated by color alone.
- [ ] Light and dark theme contrast was reviewed for the affected states.

Evidence and notes:

## Mobile, touch, and constrained conditions

- [ ] Primary targets are comfortably activatable and sufficiently separated.
- [ ] The software keyboard does not hide the active field or action.
- [ ] Orientation changes do not lose content or state.
- [ ] Slow/intermittent network states explain what is happening and preserve input where appropriate.
- [ ] Public reading remains useful without client JavaScript when the feature permits it.

Evidence and notes:

## Findings

| Severity | Route/state | Barrier | Reproduction | Issue |
|---|---|---|---|---|
| — | — | — | — | — |

## Result

- [ ] Passed for the tested scope.
- [ ] Passed with non-blocking follow-up issues listed above.
- [ ] Blocked; the pull request or release must not proceed.

Known limitations and follow-up:
