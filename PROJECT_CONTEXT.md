## Direct Orders UTF-8 live fix — 2026-10-28

Owner approved executing under personal account; Editor grant verified. New script
installed44 columns and15-minute trigger. CRM capture and script enabled together
at2026-10-28T13:53:33.327Z. Website PR46 merged toee3c8e5512bf5503d78a689f2b08a5c79c016a21;
Vercel production passed and live bundle contains new endpoint, excludes old one.
Live synthetic smoke found Apps Script two-argument HMAC uses a different encoding
for Ukrainian text: pending ASCII probes passed, resolve returned401 invalid_signature.
Explicit Utilities.Charset.UTF_8 produced a different signature and live200/OMS-407.
Fix both signing/verification and transport charset; regression covers Ukrainian
names/emoji with Node UTF-8 verifier. Full npm run check passed22 tests/build.
Temporary diagnostic functions must be removed before publishing version2. Automatic
wake/retry verification, test cleanup, boundary OMS-406 review and old writer retirement
are still pending. Private fixture key is in paired CRM .secrets/orders-cutover.

## Direct Orders published; execution-account choice pending — 2026-10-28

The new standalone Apps Script is published and responds200 with
`{"ok":true,"version":"standalone-orders-v1","enabled":false}`:
https://script.google.com/macros/s/AKfycbxOFCD9lkO7HLDUzXK6AP_bFbnu7MZCsm0s93qrfbfPUcWaJ8ZruKI2Uombf9MkkZv7/exec
Project: https://script.google.com/home/projects/1VUgvbMbvS6LBLKmiv6cRbm7u75f2sOviLL7mBJ2hURTcY4foTVPEO3mr/edit
The user completed Google authorization. Code, manifest and private properties are
saved. DIRECT_ORDERS_ENABLED=false; ORDERS_CUTOVER_AT=2099-01-01T00:00:00.000Z.
Initial installation reached the signed bridge but failed at sheet.insertColumnsAfter
because executing account oleksii.asanov@gmail.com had only public Viewer access.
The user explicitly approved personal-account Editor access; granted and verified
via Drive permissions API (writer), without notification email. Service account
remains Editor. Orders still has38 columns and installation has not been retried.
The user asked whether the script can run as sheets-agent. Official Apps Script API
documentation says service accounts are unsupported; web apps execute as deploying
or accessing users. Explained this and asked whether to complete under personal
account, move to a working Google user, or replace Apps Script with a separate
Sheets API service. Do not enable personal-account production execution while that
new hosting preference is pending. Prior release authorization remains valid.

CRM PR17 is merged and DEPLOYED at8fde7e42eda81b0d0a29fe9b117ceba30b283b89,
image sha256:6ddb05e1f4f7967fe337c3d1bef0859f97a469a2f13536334987509481a13f55,
schema33. Exact-main CI40694917306 passed. Encrypted backup was restored; rehearsal
preserved all71 existing business-table digests and472 orders. App and intake
gateway use the new image; DB, tunnel, access-sync and archive worker preserved.
Signed bridge returned200; unsigned request401; app ready200. Delivery finalized,
unblocked and resumed. Capture is intentionally gated until2099, so no live
reconciliation capture is active. Private evidence: .secrets/orders-cutover/.

Website PR46 remains OPEN at7c951c2769094c1ae6654c63c59ad4270852ea2d; preview
passed. Production website still uses the old route. The new VITE_ORDER_WEBHOOK_URL
was briefly prepared in Vercel and then REMOVED while waiting for editor access,
to prevent an unrelated redeploy from routing to the disabled endpoint. Add it
again only for coordinated cutover. Existing API URL/sitekey remain unchanged.
Old bound script still has one syncContactedOrder on-edit trigger, owned by another
user; no15-minute trigger was visible in that project. Old endpoint/history remain.
Next: settle execution-account choice, rerun installDirectOrders, verify44 columns/trigger,
set matching real cutover timestamps and enable script, configure Vercel URL,
merge/deploy PR46, live smoke and boundary audit, then retire old writer/transfer.

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

Owner explicitly approved direct replacement on2026-10-28: “просто переводимо на нове”.
Use a NEW standalone Apps Script project and its NEW /exec URL. The current source
has no primary-sheet writer or fallback; disabled intake returns intake_disabled.
Code.gs, DirectOrders.gs and appsscript.json are the complete project. The website
requires VITE_ORDER_WEBHOOK_URL for CRM-enabled builds and rejects the retired URL.
The old primary spreadsheet remains history; retire its transfer trigger and public
deployment at cutover. There is no dual-writer transition.

Main spreadsheet14h5grcwup_d5UNHABC8NiGCAL2wLMyZbeRXYdVpz3vo, Orders337346995.
Service-account Editor capabilities were verified earlier; standalone Apps Script
creation/deployment access was unavailable earlier (restored; see current note above). Live deployment,
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
