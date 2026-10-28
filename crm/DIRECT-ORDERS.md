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

Validation: `npm run check` passes21 tests plus content/build checks. Actual Google
publication, trigger execution and live checkout verification remain pending;
no new project/deployment URL has been created yet.
