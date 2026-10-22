# D·Vision landing — current change context

## Managed website catalog — implementation/release authorized (2026-10-22)

Owner approved central CRM-managed public product descriptions, parameters, models,
photos, prices, publishing, orderability and nullable unique display positions;
occupied positions move to the edited listing and clear the prior listing's position.
Website remains on Vercel. Eight public listings group ten sellable CRM variants.
Source captured from published bundle index-D4kHn_xV.js and public catalog, both
languages and all raster photos. Nine current finished products match; one is
missing, no extra finished products. Six internal components belong to detector
recipes and are preserved. Import updates current product names/SKUs/prices with
an optimistic catalog digest; historical product IDs/order/document snapshots stay.

CRM schema026 stores public listings/variant links and content-addressed raster
images, separate from private files. Authenticated product editor manages content;
public allowlisted gateway routes /catalog, /catalog/images/:hash, /cart/check
use the existing server-only intake token. No database/admin access in gateway.
Price and availability are checked fresh when adding and within the final CRM
transaction; successful replay precedes catalog validation. Browser retains shown
prices and unresolved request identity, prompts explicit confirmation of changed
prices/unavailable lines, preserves contacts, and never falls back to Sheets-only
success. Sheets remains the temporary independent copy. Money uses integer minor
units; no99-unit limit. Descriptions/images may be cached; checkout checks no-store.

OpenSpec manage-website-catalog records acceptance and release gates. Source/local
verification is not a production release; fill in actual release evidence after
backup/restore, schema/data reconciliation, gateway route and site deployment.


Owner-approved2026-10-21: static site remains on Vercel. Clean branch
`feat/crm-order-checkout` from remote main1d07156 replaces PR36, while PR35 Pages
move is cancelled. `add-order-relay` is the updated approved plan. Checkout success
will depend on CRM acknowledgement; the existing Apps Script write remains an
independent temporary copy. No business cap99; stable retry identity across reload.
CRM counterpart: `crm_oberig` branch `feat/website-order-api`.
Production activation follows API readiness and private Turnstile configuration.
No live release or verification is claimed by local source completion.
See `openspec/project.md` for existing product conventions.

Local content/build, checkout and Apps Script synthetic tests pass; strict OpenSpec8
passes. Browser discovery returned no connections. Real Turnstile, Vercel public env
and Apps Script deployment remain activation prerequisites. See crm/WEBSITE-CHECKOUT.md.
Clean PR #37 is paired with crm_oberig PR #1; hosted Vercel checks passed. Owner
will configure external services using the linked Ukrainian setup guide.
