## 2026-05-16 - Improved PJP Dashboard Empty State
**Learning:** Replaced a simple text empty state with an engaging UI block including an icon and call-to-action button, successfully improving the visual guidance for first-time users without adding any new CSS classes.
**Action:** When adding empty states, always consider adding an actionable button and a visual icon using existing utilities to guide users.

## 2024-05-19 - Explicit ARIA Labels on Dynamically Injected Elements & Opaque Surface Backgrounds
**Learning:** When using variables like `--bg-card` for absolutely positioned elements like dropdowns, if it is undefined it falls back to transparent making the dropdown unreadable over other content. Also, elements created dynamically via JS `document.createElement` (like delete buttons) often lack necessary `aria-label`s, breaking accessibility for screen readers.
**Action:** Always ensure CSS variable fallbacks correctly map to `--surface` to prevent transparent overlays. For dynamically created interactive elements, explicitly use `.setAttribute('aria-label', '...')` and `.setAttribute('title', '...')` to maintain accessibility standards.
