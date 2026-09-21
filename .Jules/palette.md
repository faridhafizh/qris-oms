## 2026-05-16 - Improved PJP Dashboard Empty State
**Learning:** Replaced a simple text empty state with an engaging UI block including an icon and call-to-action button, successfully improving the visual guidance for first-time users without adding any new CSS classes.
**Action:** When adding empty states, always consider adding an actionable button and a visual icon using existing utilities to guide users.
## 2026-09-21 - Empty State Design Pattern consistency
**Learning:** Adding empty states to management tables greatly improves UX compared to a blank table. Applying a consistent structural pattern (`colspan` full-width `<td>`, generic `text-muted` SVG, centered helpful text) using existing utilities maintains the design system without custom CSS.
**Action:** When working on data tables in EJS, always check if empty states are handled. If not, wrap the loop in an `if/else` block and apply the standard empty state UI block.
