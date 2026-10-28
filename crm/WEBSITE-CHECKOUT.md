# CRM checkout on Vercel

Historical2026-10-21 rollout. Its bound Apps Script, old URL and activation/rollback
instructions are superseded by [standalone Orders](DIRECT-ORDERS.md), approved
2026-10-28. The independent CRM acknowledgement behavior described below remains.

Owner setup guide (Ukrainian): [CRM setup instructions](https://github.com/oleksiiasanov/crm_oberig/blob/feat/website-order-api/docs/OWNER-WEBSITE-SETUP.md).
Paired changes: [website #37](https://github.com/oleksiiasanov/oberig/pull/37),
[CRM #1](https://github.com/oleksiiasanov/crm_oberig/pull/1).

Approved2026-10-21. Replaces PR36; PR35 Pages move is cancelled. Keep Vercel static
hosting and the existing Apps Script endpoint. CRM counterpart is
`crm_oberig:feat/website-order-api`, documented in `docs/WEBSITE-INTAKE.md` there.

## Activation order

1. Review and merge/deploy source with `VITE_ORDER_API_URL` unset: this publishes
   `/catalog.json` and preserves existing Sheets checkout. No runtime private keys
   are stored in Vercel. Configure both public variables only after API readiness.
2. Paste reviewed `crm/Code.gs` into the bound Apps Script and publish a new version
   using the current /exec URL. It adds clientOrderId header when needed, deduplicates
   under script lock and targets surveys by clientOrderId plus phone. Existing order
   columns, notifications and tracking behavior remain.
3. Deploy/verify same-host CRM public API, real Turnstile widget and pinned production
   hostnames. Set `VITE_ORDER_API_URL=https://api.dvision.com.ua/order` and the public
   `VITE_TURNSTILE_SITEKEY` together, then rebuild/redeploy Vercel.
4. Verify one synthetic complete order and retries before accepting real orders.
   Manually compare clientOrderIds, exact lines and amounts in both systems.
5. Disable Sheets only after the owner accepts the comparison, in a separate change.

## Checkout behavior

With API configured, both destinations start independently. Only CRM acknowledgement
produces the normal thank-you message. A failed CRM request leaves the form intact
and shows generic retry copy. The same unresolved attempt persists in sessionStorage
until success or edited order content; a reload in the same tab reuses its ID. A fresh
Turnstile token is acquired for each attempt. No99-unit cap or silent clamp; large
whole quantities retain exact values within server numeric representation bounds.

Sheets response is handled independently: it must not delay or fail a confirmed CRM
order. Survey UI becomes available when the Sheets copy confirms its row. Requests
carry the same clientOrderId; duplicate submissions do not write a second row.
Sheets/network-client failures have fixed-code browser diagnostics; server-observed
failures are logged/alerted by intake. A browser request that never reaches the API
cannot itself produce a server log; uptime monitoring is a separate deployment check.

## Rollback / limitations

Clear both API URL and Turnstile sitekey and rebuild to restore Sheets-authoritative checkout temporarily; do
not erase CRM orders. The deploy-time empty-URL mode is deliberate staging/rollback,
not evidence that integration is active. If only one of URL/sitekey is set, the build
rejects the incomplete configuration. Turnstile/frontend behavior needs browser acceptance in the actual
production configuration. Local tests use synthetic data and do not submit live orders.

A closed tab ends sessionStorage persistence. No web client can guarantee delivery
of a request never received by the server. Already acknowledged CRM orders are
committed; concurrent or lost-response retries of an existing ID are idempotent.
