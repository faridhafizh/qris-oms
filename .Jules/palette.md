## 2026-05-16 - Improved PJP Dashboard Empty State
**Learning:** Replaced a simple text empty state with an engaging UI block including an icon and call-to-action button, successfully improving the visual guidance for first-time users without adding any new CSS classes.
**Action:** When adding empty states, always consider adding an actionable button and a visual icon using existing utilities to guide users.

## 2026-05-17 - Graceful Empty States for Data Tables
**Learning:** Replaced empty, blank tables in Merchants and Campaigns views with an explicit, well-designed empty state using `colspan` and an illustrative SVG icon. This dramatically improves clarity when no data exists, preventing users from questioning if the app is broken or still loading.
**Action:** When designing data tables, always account for the empty state (`if data.length === 0`). Use a full-width `colspan` row with a friendly message and icon, ensuring a polished user experience even when data is absent.
