// Sends the order to the CRM spreadsheet through the Google Apps Script web app in /crm/Code.gs.
// The URL is public by design (it ships in the browser bundle); VITE_ORDER_WEBHOOK_URL can override it.
const WEBHOOK_URL =
  import.meta.env.VITE_ORDER_WEBHOOK_URL ||
  "https://script.google.com/macros/s/AKfycbzOeaAX0HWsMI0JMJ5WsO-ZmGUmTlhuAQJZl7ItiLaCBmQjiYtA1DGtiZhOr4tbDzuf/exec";

export async function submitOrder(payload) {
  if (!WEBHOOK_URL) {
    if (import.meta.env.DEV) {
      console.info("Order submitted (no VITE_ORDER_WEBHOOK_URL set)", payload);
      return { ok: true };
    }
    throw new Error("Order webhook is not configured");
  }

  // text/plain keeps this a "simple" request, so the browser sends no CORS preflight (Apps Script can't answer one).
  const response = await fetch(WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload),
  });

  const result = await response.json().catch(() => null);
  if (!response.ok || !result?.ok) throw new Error(result?.error || "Order webhook failed");
  return { ok: true };
}
