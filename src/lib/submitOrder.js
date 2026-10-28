// Sends the independent backup directly to Orders through the standalone Apps Script.
// The deployment URL is explicit public configuration; there is no primary-sheet fallback.
const WEBHOOK_URL = import.meta.env.VITE_ORDER_WEBHOOK_URL || "";

// The number can be pending; surveys use immutable clientOrderId, never the visible number.
export async function submitOrder(payload) {
  return post(payload);
}

// Survey answer for an order that was just placed: { type: "survey", orderNumber, phone, source }.
export async function submitSurvey(payload) {
  return post({ type: "survey", ...payload });
}

async function post(payload) {
  if (!WEBHOOK_URL) {
    throw new Error("Order webhook is not configured");
  }

  // text/plain keeps this a "simple" request, so the browser sends no CORS preflight (Apps Script can't answer one).
  const response = await fetch(WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(15000),
  });

  const result = await response.json().catch(() => null);
  if (!response.ok || !result?.ok) throw new Error(result?.error || "Order webhook failed");
  return { ok: true, orderNumber: result.orderNumber ?? "" };
}
