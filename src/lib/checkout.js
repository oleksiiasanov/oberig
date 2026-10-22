// CRM acknowledgement determines checkout success. Sheets remains an independent copy.
export const ATTEMPT_KEY = "dvision-checkout-attempt";
export function readAttempt(storage, now = Date.now()) {
  try {
    const saved = JSON.parse(storage?.getItem(ATTEMPT_KEY) || "null");
    if (saved?.payload && saved?.fingerprint)
      return saved;
    storage?.removeItem(ATTEMPT_KEY);
  } catch { /* Storage is optional; the in-memory attempt still works. */ }
  return null;
}
export function saveAttempt(storage, attempt) {
  try { storage?.setItem(ATTEMPT_KEY, JSON.stringify(attempt)); } catch { /* optional persistence */ }
}
export function clearAttempt(storage) {
  try { storage?.removeItem(ATTEMPT_KEY); } catch { /* optional persistence */ }
}
export function orderAttempt(previous, data, now = Date.now()) {
  const normalized = { ...data, items: [...data.items].sort((a, b) => a.id.localeCompare(b.id) || (a.cableLengthM ?? 0) - (b.cableLengthM ?? 0)) };
  const business = value => JSON.stringify({items:value.items.map(({id,cableLengthM,quantity,unitPrice})=>({id,...(cableLengthM===undefined?{}:{cableLengthM}),quantity,unitPrice})).sort((a,b)=>a.id.localeCompare(b.id)||(a.cableLengthM??0)-(b.cableLengthM??0)),total:value.total,name:value.name,phone:value.phone,comment:value.comment,whatsappConsent:value.whatsappConsent});
  const fingerprint = business(normalized);
  if (previous?.payload && business(previous.payload) === fingerprint) return previous;
  return { fingerprint, savedAt: now, payload: { ...normalized, clientOrderId: crypto.randomUUID(), submittedAt: new Date(now).toISOString() } };
}
export async function sendCrmOrder(url, payload, challengeToken, fetchImpl = fetch) {
  const response = await fetchImpl(url, {
    method: "POST", credentials: "omit", redirect: "error",
    headers: { "Content-Type": "text/plain;charset=UTF-8" },
    body: JSON.stringify({ ...payload, challengeToken }),
    signal: AbortSignal.timeout(20000),
  });
  const result = await response.json().catch(() => null);
  if (!response.ok || result?.ok !== true || result.clientOrderId !== payload.clientOrderId)
    {const error=new Error("order_not_confirmed");if(result?.error==='cart_changed' && Array.isArray(result.changes)){error.code='cart_changed';error.changes=result.changes;}throw error;}
  return result;
}
export async function submitCheckout({ payload, submitCrm, submitSheets, onSheets = () => {}, report = () => {} }) {
  // Attach handlers immediately so either synchronous errors or rejection cannot
  // cancel the other destination. No customer values go into diagnostic codes.
  void Promise.resolve().then(() => submitSheets(payload)).then(onSheets).catch(() => report("sheet_copy_failed", payload.clientOrderId));
  try { return await submitCrm(payload); }
  catch (error) { report("order_not_confirmed", payload.clientOrderId); throw error; }
}
