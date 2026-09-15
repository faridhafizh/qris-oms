## 2026-05-16 - Improved PJP Dashboard Empty State
**Learning:** Replaced a simple text empty state with an engaging UI block including an icon and call-to-action button, successfully improving the visual guidance for first-time users without adding any new CSS classes.
**Action:** When adding empty states, always consider adding an actionable button and a visual icon using existing utilities to guide users.

## 2024-05-24 - Playwright Verification for Transient States
**Learning:** When using Playwright to visually and functionally verify transient UI states (such as a submit button disabling and changing text to "Memproses..."), the form submission often navigates away too quickly to capture the final disabled state.
**Action:** Before clicking the submit button in the Playwright script, inject JS to prevent default form submission using `await page.evaluate(() => { document.querySelector('form').addEventListener('submit', (e) => e.preventDefault()); });`. This freezes the transient UI state, allowing for reliable assertions and screenshots without risking navigation timeouts or race conditions.
