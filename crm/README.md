# Orders → Google Sheet (CRM)

1. Make a copy of the CRM spreadsheet (File → Make a copy). Row 1 must contain the column headers listed in `Code.gs`.
2. In the copy: Extensions → Apps Script → replace the code with `crm/Code.gs` → Save.
3. Deploy → New deployment → type **Web app** → Execute as **Me**, Who has access **Anyone** → Deploy → authorize → copy the `/exec` URL.
4. Put that URL into `WEBHOOK_URL` in `src/lib/submitOrder.js` (or set `VITE_ORDER_WEBHOOK_URL` to override it), then deploy.

After changing `Code.gs`, use Deploy → Manage deployments → Edit → New version (the URL stays the same).

## Copying contacted orders to the tracking spreadsheet

Ticking "Контакт" on an order adds it as a new row to the tracking spreadsheet (only the columns listed in `TRACKING_COLUMNS`; an order number that is already there is skipped).

1. Apps Script → Project Settings → Script properties → add `TRACKING_SHEET_URL` with the full URL of the tracking tab (including `#gid=…`).
2. In the editor, select `installTrackingTrigger` → Run → authorize.
3. `previewTrackingRow` logs what would be written for the newest order without writing anything.

## Order statuses in the tracking spreadsheet

`setupTrackingStatuses` adds the dropdown columns "Статус", "Статус оплати" and "Передплата" right after "Додаткове обладнання" and fills them for existing orders: orange rows get "Скасовано", rows with a number in "Відправлено" get "Відправлено", rows with a number in "Сума передплати" (the amount column, formerly "Передплата") get "Передплата зроблена". Running it again does not add the columns twice or change values that are already filled in.

1. In the editor, select `previewTrackingStatuses` → Run: it writes nothing and logs how many rows will get each status and which rows need a manual look.
2. Select `setupTrackingStatuses` → Run.
