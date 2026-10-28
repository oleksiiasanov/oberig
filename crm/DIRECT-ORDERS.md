# Standalone Orders deployment

Create a NEW standalone Apps Script project using `Code.gs`, `DirectOrders.gs` and
`appsscript.json` together. This project has no bound/active spreadsheet dependency.
The previous primary-sheet writer and Contact-transfer helpers are removed.

The paired CRM branch `feat/direct-orders-sheet` contains the authoritative
`docs/DIRECT-ORDERS-SYNC.md` guide: schema033, signed bridge, private properties,
Google trigger setup, direct cutover and rollback. Deploy as the owner with public
web-app access. Set the NEW /exec URL in both `VITE_ORDER_WEBHOOK_URL` (website) and
`OMS_SHEET_SYNC_SCRIPT_URL` (CRM). CRM-enabled builds reject a missing URL or the
retired primary deployment. No secrets belong in browser variables or source.

Preserve the previous NOTIFY_EMAILS setting in the new project's private properties.
Retire the old endpoint and Contact trigger at cutover; retain old rows as history.
Disabled standalone intake rejects requests and never resumes primary-sheet writes.

Retries run after approximately two minutes; the full comparison runs every15
minutes. CRM owns order numbers. Surveys and retries use immutable clientOrderId.
Existing rows are updated only in the number and technical metadata columns.

Validation: `npm run check` passes22 tests plus content/build checks. The standalone Google project is live at version3, with explicit UTF-8 signatures.
Website routing and CRM capture are enabled; the old endpoint is archived. Live
integration checks verified one row/order, matching CRM number, automatic wake,
timed retry and preservation of manager edits. No test notifications were sent;
full browser/Turnstile checkout was not part of this controlled smoke.
See PROJECT_CONTEXT.md for exact deployment evidence and the historical boundary.

## Retail state mirror candidate (2026-10-28)

The owner approved replacing number-only behavior for linked rows with CRM authority over five columns: Статус, Статус оплати, Передплата, Отримано, Проблемні. This supersedes the earlier preservation rule only for these columns. Payment labels remain separate from posted money; no amount or payment date is inferred. NEW remains blank; AWAITING_PAYMENT maps to the existing Статус option «Оплата», UNPAID to «Очікується оплата», PARTIAL to «Часткова оплата». Prepayment is applicable to at least two detectors. Actual customer delivery, not dispatch, sets received detector quantity. A manual problem flag maps to «Так»/blank independently of cancellation.

Schema034 queues captured keys transactionally. The existing HTTP action sends a best-effort wake only after commit. The full15-minute check repairs the five owned fields, including manual sheet overrides. The bridge includes order version and validates that same version when acknowledging under the domain write lock. The script rejects older versions before any write and saves _crm_state_revision in a new hidden column appended after the current grid. Formulas in owned destinations become conflicts rather than being destroyed. Install the script metadata upgrade before the CRM release. No historical mass backfill, extra credentials or browser checkout changes are included.
