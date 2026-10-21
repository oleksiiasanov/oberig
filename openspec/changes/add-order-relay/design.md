## Context
The existing CRM host runs app, PostgreSQL and cloudflared. Static Vite site is on Vercel. Existing legacy intake requires a configured active integration manager; preserve this schema23 contract until the separate manager-removal release.

## Decisions
- One bounded public intake container on the current host, its own edge/internal networks, no published host ports, no database network or Docker socket. CRM private listener binds its intake-network container IP; existing Access verification remains on the administrative listener. A dedicated token authorizes only intake creation.
- Browser calls both destinations independently. CRM commit determines success; Sheets errors do not mask CRM success. Same attempt ID on retry and reload, fresh Turnstile token per submission, changed commercial/contact payload starts a new attempt. Store the in-progress form only in sessionStorage and clear on success.
- Public API validates site catalog prices and quantities before forwarding; internal intake validates schema/totals again. Positive integer quantities have no arbitrary business cap; representation and money-overflow checks are explicit, not silent clamps.
- Turnstile mandatory in production, server-side hostname/action validation; no client CRM secrets. Limits bound traffic/JSON/concurrency, not purchased quantity. Logs and alerts contain fixed error codes and validated UUIDs only.
- Success JSON exposes only acknowledgement/clientOrderId, no CRM customer data. 409 conflicts are explicit. Failed/ambiguous delivery is retried with the same ID; no success is shown before persisted CRM acknowledgement.
- Server startup failure closes every listener and exits; orderly shutdown drains intake before closing DB pool.

## Migration Plan
1. Keep archived branches and close superseded PRs. Work from current remote main.
2. Validate source locally and in CI; deploy API behind disabled flag, configure private secrets, tunnel exact-host routing and catalog/SKU mapping.
3. Run isolated and then approved live synthetic checks; enable site CRM URL and public Turnstile sitekey in Vercel after API readiness. Do not merge an enabled frontend ahead of ready backend.
4. Compare independent records by clientOrderId, lines and total; disable Sheets via a separate explicit change after acceptance.

## Risks / Trade-offs
Shared host is not VM isolation; resource/network limits reduce impact. Client cannot deliver a request after its execution is terminated; the guarantee is that acknowledged orders are committed. Sheets remains best-effort for comparison. No claim of live acceptance without real environment checks.
