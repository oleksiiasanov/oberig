# Change: Idempotent cart orders with a best-effort copy to the CRM/OMS

## Why
A new CRM/OMS must receive the same orders as Google Sheets for a while so the two can be reconciled. Today a repeated click after an error also creates a duplicate row, because orders carry no idempotency key.

## What Changes
- The cart generates a `clientOrderId` (UUID v4) and `submittedAt` once per attempt, reuses them when the same order is resent after an error, and starts a new attempt when anything in the order changes or after success.
- Google Sheets (Apps Script web app) stays the primary path and alone decides what the visitor sees; the payload gains `clientOrderId`.
- After the spreadsheet answers `ok`, the browser posts a copy to `VITE_ORDER_MIRROR_URL` (the OMS order intake, `https://api.dvision.com.ua/order`): `text/plain` JSON, `keepalive`, 5 s timeout, errors ignored. Empty URL (default) sends nothing.
- `crm/Code.gs` writes `clientOrderId` into a column with that header and skips an order whose id is already there.
- CSP `connect-src` allows `https://api.dvision.com.ua`.
- The build emits `/catalog.json` (`{ version, currency, items: [{ id, cableLengthM?, price }] }`, 10 lines from the Ukrainian catalog, `Cache-Control: public, max-age=300`) so the intake checks prices against the live site; the cart computes prices with the same `src/lib/catalog.js`.

## Impact
- Affected specs: `order-relay` (new)
- Affected code: `src/lib/orderMirror.js`, `src/lib/submitOrder.js`, `src/components/CartPage.jsx`, `src/lib/catalog.js`, `vite.config.js`, `vercel.json`, `crm/Code.gs`, `crm/README.md`
- Manual steps: add the `clientOrderId` header to the CRM sheet and deploy a new Apps Script version; set `VITE_ORDER_MIRROR_URL` and rebuild once the intake is live.
- Counterpart: `crm_oberig` runs the public intake on its own VM; it validates the body, prices it from the catalog and writes it to the OMS (`external_id` = `clientOrderId`).
