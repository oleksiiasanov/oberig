# Orders → Google Sheet (CRM)

1. Make a copy of the CRM spreadsheet (File → Make a copy). Row 1 must contain the column headers listed in `Code.gs`.
2. In the copy: Extensions → Apps Script → replace the code with `crm/Code.gs` → Save.
3. Deploy → New deployment → type **Web app** → Execute as **Me**, Who has access **Anyone** → Deploy → authorize → copy the `/exec` URL.
4. Put that URL into `WEBHOOK_URL` in `src/lib/submitOrder.js` (or set `VITE_ORDER_WEBHOOK_URL` to override it), then deploy.

After changing `Code.gs`, use Deploy → Manage deployments → Edit → New version (the URL stays the same).
