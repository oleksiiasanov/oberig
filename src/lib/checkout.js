import { checkoutFailure, emitCheckout } from './checkout-diagnostics.js';
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
  let response;
  try {
    response = await fetchImpl(url, {
      method: "POST", credentials: "omit", redirect: "error",
      headers: { "Content-Type": "text/plain;charset=UTF-8" },
      body: JSON.stringify({ ...payload, challengeToken }),
      signal: AbortSignal.timeout(20000),
    });
  } catch (cause) {
    const error=new Error(['AbortError','TimeoutError'].includes(cause?.name)?'request_timeout':'network_error');
    error.code=error.message;error.retryable=true;throw error;
  }
  let result;
  try { result=await response.json(); } catch { result=null; }
  if (!response.ok || result?.ok !== true || result.clientOrderId !== payload.clientOrderId) {
    const error=new Error('order_not_confirmed');
    error.code=response.ok?'invalid_acknowledgement':'http_error';error.httpStatus=response.status;
    error.requestId=response.headers.get('x-request-id');
    if(['verification_failed','rate_limited','busy','order_conflict','order_unavailable','catalog_unavailable'].includes(result?.error))error.code=result.error;
    error.retryable=[502,503,504].includes(response.status);
    if(result?.error==='cart_changed' && Array.isArray(result.changes)){error.code='cart_changed';error.changes=result.changes;error.retryable=false;}
    throw error;
  }
  return result;
}
export async function submitVerifiedCrm({url,payload,challenge,report=()=>{},fetchImpl=fetch,wait=ms=>new Promise(r=>setTimeout(r,ms)),now=Date.now}) {
  for(let attempt=1;attempt<=2;attempt++) {
    let token;const start=now();
    emitCheckout(report,'crm_verification',payload.clientOrderId,{code:'started',attempt});
    try { token=await challenge();if(!token)throw new Error('verification_unavailable'); }
    catch(error){emitCheckout(report,'crm_verification',payload.clientOrderId,{...checkoutFailure(error),attempt,durationMs:now()-start});throw error;}
    emitCheckout(report,'crm_verification',payload.clientOrderId,{code:'ok',attempt,durationMs:now()-start});
    const sent=now();emitCheckout(report,'crm_request',payload.clientOrderId,{code:'started',attempt});
    try {
      const result=await sendCrmOrder(url,payload,token,fetchImpl);
      emitCheckout(report,'crm_result',payload.clientOrderId,{code:'ok',attempt,durationMs:now()-sent});return result;
    } catch(error) {
      emitCheckout(report,'crm_result',payload.clientOrderId,{...checkoutFailure(error),attempt,durationMs:now()-sent});
      if(attempt===2||!error.retryable)throw error;
      emitCheckout(report,'checkout_retry',payload.clientOrderId,{...checkoutFailure(error),attempt:2});
      await wait(1000);
    }
  }
}
export async function submitCheckout({ payload, submitCrm, submitSheets, onSheets = () => {}, report = () => {} }) {
  emitCheckout(report,'checkout_started',payload.clientOrderId,{code:'started'});
  // Both destinations start independently. Reporting failures cannot cancel either.
  void Promise.resolve().then(() => submitSheets(payload)).then(result=>{
    emitCheckout(report,'sheet_result',payload.clientOrderId,{code:'ok'});onSheets(result);
  }).catch(error=>emitCheckout(report,'sheet_copy_failed',payload.clientOrderId,checkoutFailure(error)));
  try { return await submitCrm(payload); }
  catch (error) { emitCheckout(report,'order_not_confirmed',payload.clientOrderId,checkoutFailure(error)); throw error; }
}
