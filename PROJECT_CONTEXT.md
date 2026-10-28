## Direct Orders implementation candidate — 2026-10-28

Owner approved implementation. Local candidate in branch feat/direct-orders-sheet;
NOT deployed/activated. Independent website writes now have a direct Orders Apps
Script implementation, immutable-key matching, CRM-owned numbers, blank initial
sheet status and original snapshot retention. Schema033 stores accepted modern
website requests atomically; a signed bridge schedules event checks and Apps Script
provides durable short retries plus a15-minute fallback. Two-minute grace avoids
racing parallel requests. Existing manager fields/history remain untouched. Deleted,
unverified, conflicting or historical unlinked records are not blindly recovered.
Separate single-use Turnstile verification protects automatic Sheets-only recovery.

Main spreadsheet14h5grcwup_d5UNHABC8NiGCAL2wLMyZbeRXYdVpz3vo, Orders337346995.
Service-account Editor capabilities were verified earlier; published Apps Script
owner/editor access is still unavailable (no connected browser). Live deployment,
Google write smoke and trigger activation are pending. See docs/DIRECT-ORDERS-SYNC.md
in the CRM repository for configuration, coordinated cutover and rollback.

# D·Vision landing — current change context

## Website display groups (2026-10-23)

Owner approved immediate release of `group-catalog-by-display-type`. The CRM public
catalog supplies displayGroup MAIN/ADDITIONAL. Catalog renders MAIN first and
ADDITIONAL below the “Комплектуючі” heading (English: Accessories), preserving the
API order within each group. Empty sections are omitted. This is exclusively a
website presentation field, unrelated to CRM inventory components. Existing cards,
identities, prices, fresh cart checks and explicit price consent are retained.
Older API responses without the field fall back to MAIN for compatibility.
Released through PR44, Vercel91d66eb; live API and desktop/mobile grouping verified.
Quick navigation targets individual product cards, including spare parts inside
the new display groups.

## Checkout price-consent visibility fix (2026-10-23)

Bug fix follows the existing website-catalog price-consent requirement. Previously
the change notice appeared above cart totals, outside the viewport when the buyer
submitted the form, leaving only a disabled button visible. The notice now sits
next to checkout, receives focus/scroll when a price or availability change occurs,
and shows old/new unit prices with explicit consent. Confirmation refreshes prices
and displays the new total plus the next checkout action. Contact/comment state,
server validation and idempotent replay remain intact. No catalog/data migration.
Validated with all11 unit tests, content/build and strict OpenSpec checks.
`scripts/cart-price-consent.qa.mjs` reproduces the old hidden notice and verifies
visible consent on1440px/390px viewports, repeated price changes, failed checks,
retained fields, final409, successful checkout, add cancellation and unavailable
items using fully intercepted synthetic endpoints. Independent review passed.
The price/availability warning uses a yellow border, focus ring, tinted surface
and confirmation button (owner-requested follow-up); accepted-cart feedback stays
in the standard success accent. Release evidence is recorded in the associated PR.


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
