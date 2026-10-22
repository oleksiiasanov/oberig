# D·Vision landing — current change context

## Managed website catalog — production released (2026-10-22)

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

Released CRM PR12, source/contract `82dc66aeb79d89a383a33f0887eb1d1f5cd3ceef`,
image `sha256:5f4eb69662f4058591d4408be468487e50de4362ac241429814844f13338f8ee`,
schema26. Exact-main CI39813840135 passed both jobs. Gateway independently pins
this same reviewed image. DB and tunnel were not recreated; access-sync retained
its container/image. Delivery timer resumed, state unblocked. Landing PR39 released
`077892980613e0d3ecae0ba8895d0075b5f3e0bd` to Vercel production. PR40 followed with
`bf39cfc777600178b177aede32884301d20b47da`: totals use the current catalog language
while retaining accepted prices and pending retry payloads.

Online and frozen encrypted backups were restored in isolated tmpfs environments;
migration26 passed twice (second run no-op), and the source import rehearsed twice.
Production reconciled8 listings/10 variants:9 updates,1 new antenna,0 deletions.
All58 untouched business-table digests plus protected existing product/inventory
fields matched. Existing IDs, stock, recipes, orders and document snapshots retained.
Public route expansion preserved unrelated routes and Access configuration.

Public verification at16:36UTC matched all source prices/SKUs, bilingual names,
descriptions and all8 image hashes. Catalog/check no-store, changed-price/unavailable
responses, foreign-origin and public-admin negatives passed. Real production browser
loaded catalog/photos and checked a500-UAH MOLLE cart addition on desktop/mobile;
no production orders submitted. Full local129 unit+199 integration tests and11 landing
tests passed; synthetic browser also covered price consent, removal, fast quantities,
lost-ack replay without duplicates and admin position displacement. Independent code
and release-helper review passed. See the CRM repository docs/WEBSITE-CATALOG.md for operation and limits.
