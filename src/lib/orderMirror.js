// Order idempotency and the best-effort copy to the CRM/OMS order intake. No import.meta.env here, so the
// helpers can be tested in plain Node; the intake URL is passed in by submitOrder.js.

const MIRROR_TIMEOUT_MS = 5000;

// One clientOrderId and submittedAt per order attempt: resending the same order after an error reuses them, so
// the spreadsheet and the OMS see it once; any change to the order starts a new attempt.
export function orderAttempt(previous, order) {
  const fingerprint = JSON.stringify(order);
  if (previous?.fingerprint === fingerprint) return previous;
  return { fingerprint, clientOrderId: crypto.randomUUID(), submittedAt: new Date().toISOString() };
}

// Lines with the same product and cable length are merged and sorted, so the intake gets a stable body.
export function normalizeItems(items) {
  const lines = new Map();
  for (const { id, cableLengthM, quantity, unitPrice } of items) {
    const key = cableLengthM ? `${id}:${cableLengthM}` : id;
    const line = lines.get(key) || { id, ...(cableLengthM ? { cableLengthM } : {}), quantity: 0, unitPrice };
    line.quantity += quantity;
    lines.set(key, line);
  }
  return [...lines.values()].sort((a, b) => a.id.localeCompare(b.id) || (a.cableLengthM ?? 0) - (b.cableLengthM ?? 0));
}

// Fire-and-forget: the order is already in the spreadsheet, a missed copy is found by reconciliation.
// text/plain keeps it a simple request (no CORS preflight); keepalive lets it finish if the visitor leaves.
export function mirrorOrder(url, order) {
  if (!url) return;
  try {
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=UTF-8" },
      body: JSON.stringify({ ...order, items: normalizeItems(order.items) }),
      keepalive: true,
      credentials: "omit",
      signal: AbortSignal.timeout(MIRROR_TIMEOUT_MS),
    }).catch(() => {});
  } catch {
    // never let the copy affect the order
  }
}
