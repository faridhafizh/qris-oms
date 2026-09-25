## 2026-05-16 - Improved PJP Dashboard Empty State
**Learning:** Replaced a simple text empty state with an engaging UI block including an icon and call-to-action button, successfully improving the visual guidance for first-time users without adding any new CSS classes.
**Action:** When adding empty states, always consider adding an actionable button and a visual icon using existing utilities to guide users.

## 2023-10-25 - Added ARIA attributes to Dropdown Toggles
**Learning:** For interactive UI toggles (like mobile menus and notification dropdowns) implemented inline or dynamically created via script, it's critical to add `aria-expanded="false"` and `aria-controls="target-id"` manually, and update the JavaScript toggling logic to reflect the state. Also, any close buttons dynamically injected via JS must explicitly be given an `aria-label` attribute (e.g. `setAttribute('aria-label', ...)`).
**Action:** When working on navigation bars or notification components with hidden menus, always check if screen reader states for 'expanded' are being tracked and updated, and ensure dynamically injected buttons have accessible names.
