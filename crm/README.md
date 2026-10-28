# Website orders → CRM and Orders

The approved2026-10-28 implementation keeps independent website writes to CRM and
a NEW standalone Apps Script writing directly to the main `Orders` tab. It removes
the intermediate spreadsheet and manual Contact transfer from new order intake.

Use [the standalone deployment guide](DIRECT-ORDERS.md). The complete script project
is `Code.gs` + `DirectOrders.gs` + `appsscript.json`. Configure the new public /exec
URL through `VITE_ORDER_WEBHOOK_URL`; it is not hardcoded in the website source.
The production cutover is still pending publication access.

CRM owns visible numbers. Both destinations share clientOrderId for deduplication,
surveys and automatic recovery. Initial sheet statuses are blank. Existing manager
fields are preserved, and original requests remain in hidden technical columns.
The old spreadsheet is retained as history after its endpoint/transfer is retired.

[The earlier checkout guide](WEBSITE-CHECKOUT.md) documents the original2026-10-21
rollout; its bound-script/old-URL activation instructions are superseded.
