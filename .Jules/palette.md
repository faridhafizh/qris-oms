## 2026-05-16 - Improved PJP Dashboard Empty State
**Learning:** Replaced a simple text empty state with an engaging UI block including an icon and call-to-action button, successfully improving the visual guidance for first-time users without adding any new CSS classes.
**Action:** When adding empty states, always consider adding an actionable button and a visual icon using existing utilities to guide users.

## 2026-09-10 - Dynamic DOM Element Accessibility
**Learning:** Dynamically injected DOM elements (like notification dismiss buttons created via JS) often lack accessibility attributes by default.
**Action:** Always ensure JS-created interactive elements include aria-labels (e.g., btn.setAttribute('aria-label', '...')) and use semantic icons instead of text-based "X" characters.
