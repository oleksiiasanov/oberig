## Decisions
Apps Script remains the sole writer of website rows; all writers use the same ScriptLock and re-find rows by key after network calls. It stores the original canonical request in hidden columns after existing data, not in manager fields. CRM persists canonical accepted requests transactionally; no old records are backfilled.

A dedicated HMAC secret authenticates a narrow bridge through the existing public /order path. It cannot access administrative routes. Browser requests cannot supply authoritative numbers. Signed messages bind protocol, direction, timestamp and body. Retries are idempotent; no secrets in browser bundles or logs.

A completed sheet write checks CRM presence. CRM commit sends a best-effort signed wake-up; durable snapshots survive notification failure. A shared short-delay trigger retries incomplete matches after a two-minute grace period; a15-minute Apps Script trigger compares keyed rows and drains CRM snapshots. CRM recovery uses the normal validator and original key; price/catalog conflicts remain reviewable, never silently repriced. Apps Script independently verifies its own single-use Turnstile token; only verified sheet-only requests can create CRM orders. Old cached clients can still save unverified backups but need a CRM acknowledgement or reviewed recovery. Recovered orders are explicitly audited as sheet recovery.

Only number + technical sync metadata may change on existing rows. Phone/status/payment edits are never copied back. CRM-only recovery uses the original website snapshot, never manually created orders. Existing idempotency tombstones prevent deleted-order resurrection. Date is original submission calendar date in Europe/Kyiv, encoded as a Sheets date serial independent of workbook timezone.

## Rollout
Test with isolated DB and mocked Google services, then disposable sheet/project smoke. Deploy disabled CRM bridge/outbox first; configure shared secret privately, destination ID/gid, Apps Script version and triggers; enable coordinated cutover. Primary sheet is retained and its transfer trigger retired. Never replay unkeyed rows. Revert deployment/configuration without deleting durable snapshots or history.
