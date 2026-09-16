## 2026-05-16 - Improved PJP Dashboard Empty State
**Learning:** Replaced a simple text empty state with an engaging UI block including an icon and call-to-action button, successfully improving the visual guidance for first-time users without adding any new CSS classes.
**Action:** When adding empty states, always consider adding an actionable button and a visual icon using existing utilities to guide users.

## 2024-05-18 - Accessibility for Dynamically Injected UI
**Learning:** In this application, interactive UI elements (like notification close buttons) are sometimes dynamically injected into the DOM via JavaScript. These elements often lack accessibility attributes by default.
**Action:** Always ensure that when manually constructing DOM elements via `document.createElement`, accessibility attributes like `aria-label` and usability attributes like `title` are explicitly set using `element.setAttribute()` or directly assigning to `element.title`.
