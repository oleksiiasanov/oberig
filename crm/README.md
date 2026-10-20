# Orders → Google Sheet (CRM)

1. Make a copy of the CRM spreadsheet (File → Make a copy). Row 1 must contain the column headers listed in `Code.gs`.
2. In the copy: Extensions → Apps Script → replace the code with `crm/Code.gs` → Save.
3. Deploy → New deployment → type **Web app** → Execute as **Me**, Who has access **Anyone** → Deploy → authorize → copy the `/exec` URL.
4. Put that URL into `WEBHOOK_URL` in `src/lib/submitOrder.js` (or set `VITE_ORDER_WEBHOOK_URL` to override it), then deploy.
5. Add a `clientOrderId` header to row 1. The cart sends one id per order attempt; an order whose id is already in that column is answered `ok` without a new row or email, so a retry after a timeout is not saved twice.

After changing `Code.gs`, use Deploy → Manage deployments → Edit → New version (the URL stays the same).

## Copy of each order to the OMS

After the spreadsheet answers `ok`, the cart also posts the order (same `clientOrderId`) to `VITE_ORDER_MIRROR_URL`, the CRM/OMS order intake. It is set at build time and is not a secret; empty means no copy is sent. The copy never affects what the visitor sees: a missed one is found by reconciling the sheet's `clientOrderId` column with the OMS.

## "Where did you hear about us" survey

After the thank-you message the customer can answer where they heard about D·Vision SDR. The answer is written into that order's row in the "Опитування" column (matched by order number and phone). If the column does not exist yet, the first answer adds it as the last column.

The answer is also copied to the tracking spreadsheet, into its "Опитування" column: with the order when "Контакт" is ticked, or into the order's existing tracking row when the customer answers after the tick.

## Copying contacted orders to the tracking spreadsheet

Ticking "Контакт" on an order adds it as a new row to the tracking spreadsheet (only the columns listed in `TRACKING_COLUMNS`; an order number that is already there is skipped).

1. Apps Script → Project Settings → Script properties → add `TRACKING_SHEET_URL` with the full URL of the tracking tab (including `#gid=…`).
2. In the editor, select `installTrackingTrigger` → Run → authorize.
3. `previewTrackingRow` logs what would be written for the newest order without writing anything.

## Order statuses in the tracking spreadsheet

`setupTrackingStatuses` adds the dropdown columns "Статус", "Статус оплати" and "Передплата" right after "Додаткове обладнання" and fills them for existing orders: orange rows get "Скасовано", rows with a number in "Відправлено" get "Відправлено", rows with a number in "Сума передплати" (the amount column, formerly "Передплата") get "Передплата зроблена". Running it again does not add the columns twice or change values that are already filled in.

1. In the editor, select `previewTrackingStatuses` → Run: it writes nothing and logs how many rows will get each status and which rows need a manual look.
2. Select `setupTrackingStatuses` → Run.

## Order dates in the tracking spreadsheet

"Дата заявки" is the order date. `fillOrderDates` fills its empty cells from "Стара дата заявки" (text like "14,06,2026" or "14.06.2026"), shown as dd/mm/yy. Cells that already have a date are not changed. `previewOrderDates` logs what would be filled without writing.
