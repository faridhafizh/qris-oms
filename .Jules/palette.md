## 2026-05-16 - Improved PJP Dashboard Empty State
**Learning:** Replaced a simple text empty state with an engaging UI block including an icon and call-to-action button, successfully improving the visual guidance for first-time users without adding any new CSS classes.
**Action:** When adding empty states, always consider adding an actionable button and a visual icon using existing utilities to guide users.

## 2026-05-18 - Missing Dynamic ARIA Labels & Invalid Background CSS
**Learning:** Elements created dynamically via `document.createElement` (like the notification 'X' button in `header.ejs`) often lack crucial accessibility attributes (like `aria-label`). Also discovered that the CSS design tokens do not include `--bg-card`; using `--surface` instead fixes missing background colors on dropdowns.
**Action:** When inspecting interactive components, always check JavaScript injected DOM elements for missing ARIA labels and title attributes. When applying background colors to cards or modals, explicitly verify the existence of the CSS variable before using it (use `--surface` instead of `--bg-card`).
