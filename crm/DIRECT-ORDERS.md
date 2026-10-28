# Direct Orders deployment

Implementation source: `Code.gs` plus `DirectOrders.gs`, both in the same existing
Apps Script project. They are a paired deployment, not alternative scripts.
The current primary path remains the default until explicitly activated.

The paired CRM branch `feat/direct-orders-sheet` contains the authoritative
`docs/DIRECT-ORDERS-SYNC.md` guide: schema033, signed bridge, secrets, future UTC
cutover, Google trigger setup, boundary audit and rollback. Keep NOTIFY_EMAILS and
existing webhook URL. Do not paste secrets into source or browser variables.

Installable retries run after approximately two minutes; the full comparison runs
once every15 minutes. There is no independent order counter in direct mode. Surveys
use clientOrderId even while the visible number is blank. Existing rows are matched
only by that key and only number/technical fields are updated.

Tests: `npm run check` exercises original mode and direct mode. Actual Google API,
Apps Script deployment/triggers and browser checkout verification are still pending.
