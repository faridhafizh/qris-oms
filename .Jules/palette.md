## 2026-05-16 - Improved PJP Dashboard Empty State
**Learning:** Replaced a simple text empty state with an engaging UI block including an icon and call-to-action button, successfully improving the visual guidance for first-time users without adding any new CSS classes.
**Action:** When adding empty states, always consider adding an actionable button and a visual icon using existing utilities to guide users.

## 2024-05-23 - Dynamic ARIA Attributes on UI Toggles
**Learning:** Found that static dropdown toggles (mobile menu and notifications) lacked screen reader support for dynamic state tracking. By binding dynamic `aria-expanded` attributes directly to their corresponding click handlers, the elements now accurately announce their opened/closed state to screen readers.
**Action:** Always verify that interactive components which toggle visibility dynamically map their state to the `aria-expanded` attribute. Ensure the element is also tied to its target via `aria-controls`.
