## 2026-05-16 - Improved PJP Dashboard Empty State
**Learning:** Replaced a simple text empty state with an engaging UI block including an icon and call-to-action button, successfully improving the visual guidance for first-time users without adding any new CSS classes.
**Action:** When adding empty states, always consider adding an actionable button and a visual icon using existing utilities to guide users.
## 2023-10-27 - EJS Layout Consistency with Footers
**Learning:** Found an EJS view (`src/views/merchants.ejs`) that was manually closing the HTML document (`</body></html>`) instead of using the standard layout partial (`<%- include('partials/footer') %>`).
**Action:** When updating any EJS views, check the bottom of the file for hardcoded closing tags and replace them with the footer partial to ensure global UI elements (like sticky footers or globally injected scripts) are consistently applied across all pages.
