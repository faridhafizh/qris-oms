## 2026-05-16 - Improved PJP Dashboard Empty State
**Learning:** Replaced a simple text empty state with an engaging UI block including an icon and call-to-action button, successfully improving the visual guidance for first-time users without adding any new CSS classes.
**Action:** When adding empty states, always consider adding an actionable button and a visual icon using existing utilities to guide users.
## 2024-09-26 - Interactive Notification Dropdown Accessibility & UI Variable Constraints
**Learning:** Found that custom interactive toggles (like the notification dropdown) lacked critical ARIA state management (`aria-expanded` and `aria-controls`), which is crucial for screen readers to understand the expanded/collapsed state. Additionally, the application does not have a comprehensive CSS variable set mapped (e.g. `--bg-card` or `--error` do not exist in `app.css`); components defaulting to them will fall back to transparent or broken styling.
**Action:** Always dynamically toggle `aria-expanded` in the event listeners of custom dropdowns. Always verify CSS variable definitions in `src/public/app.css` before using them, favoring `--surface` for card/dropdown backgrounds and `--danger` for alerts in this specific project.

## 2025-02-20 - Make Tables Responsive
**Learning:** In this application, standard HTML tables without an overflow wrapper break mobile responsiveness by causing the entire page body to scroll horizontally. The project already has a `.table-wrapper` class defined in `app.css` to handle this gracefully via `overflow-x: auto`.
**Action:** Always wrap `<table class="table">` elements within `<div class="table-wrapper">` in `.ejs` templates to ensure tables can scroll horizontally without breaking the overall page layout on small viewports.
