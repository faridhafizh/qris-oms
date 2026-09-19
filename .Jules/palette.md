## 2026-05-16 - Improved PJP Dashboard Empty State
**Learning:** Replaced a simple text empty state with an engaging UI block including an icon and call-to-action button, successfully improving the visual guidance for first-time users without adding any new CSS classes.
**Action:** When adding empty states, always consider adding an actionable button and a visual icon using existing utilities to guide users.

## 2026-09-18 - Accessibility on dynamically created elements
**Learning:** Dynamically injected DOM elements (via JS `document.createElement`) don't automatically get the accessibility enhancements made in other static components. Icon-only buttons created this way are often skipped by screen readers.
**Action:** When writing UX enhancements involving dynamically injected DOM elements, explicitly set accessibility attributes like `aria-label` using `setAttribute()`.
