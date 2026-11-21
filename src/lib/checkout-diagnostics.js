const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const EVENTS = new Set(['checkout_started','crm_verification','crm_request','crm_result','sheet_verification','sheet_result','checkout_retry','order_not_confirmed','sheet_copy_failed']);
const CODES = new Set(['started','ok','unknown','verification_unavailable','verification_failed','verification_expired','verification_timeout',
  'verification_cancelled','verification_restarted','network_error','request_timeout','http_error','invalid_acknowledgement','cart_changed',
  'rate_limited','busy','order_conflict','order_unavailable','catalog_unavailable','sheet_unavailable']);
export function checkoutFailure(error) {
  const value = error?.code || error?.message;
  const code = CODES.has(value) ? value : ['AbortError','TimeoutError'].includes(error?.name) ? 'request_timeout' : 'unknown';
  const result = {code};
  if (Number.isInteger(error?.httpStatus)) result.httpStatus = error.httpStatus;
  if (typeof error?.requestId === 'string' && UUID.test(error.requestId)) result.requestId=error.requestId;
  if (typeof error?.widgetError === 'string' && /^\d{6}$/.test(error.widgetError)) result.widgetError=error.widgetError;
  return result;
}
export function emitCheckout(report, event, key, details) {
  try { report(event,key,details); } catch { /* Diagnostics cannot change the checkout result. */ }
}
// Reports contain no body, cart, URL, customer fields, token or arbitrary error text.
// Best effort: a blocked network or closed tab can also prevent diagnostic delivery.
export function createCheckoutReporter(orderUrl, fetchImpl = fetch) {
  const counts=new Map();
  return (event,clientOrderId,details={}) => {
    if (!orderUrl || !EVENTS.has(event) || typeof clientOrderId!=='string' || !UUID.test(clientOrderId)) return;
    const count=counts.get(clientOrderId)||0;if(count>=32)return;
    if(counts.size>=64&&!counts.has(clientOrderId))counts.delete(counts.keys().next().value);
    counts.set(clientOrderId,count+1);
    const body={event,clientOrderId,code:CODES.has(details.code)?details.code:'unknown'};
    for(const field of ['httpStatus','durationMs','attempt']){
      const max=field==='httpStatus'?599:field==='attempt'?2:300000;
      if(Number.isInteger(details[field])&&details[field]>=0&&details[field]<=max)body[field]=details[field];
    }
    if(typeof details.requestId==='string'&&UUID.test(details.requestId))body.requestId=details.requestId;
    if(typeof details.widgetError==='string'&&/^\d{6}$/.test(details.widgetError))body.widgetError=details.widgetError;
    try {
      const url=new URL(orderUrl);url.searchParams.set('diagnostic','1');
      void Promise.resolve(fetchImpl(url.href,{method:'POST',credentials:'omit',redirect:'error',keepalive:true,
        headers:{'Content-Type':'text/plain;charset=UTF-8'},body:JSON.stringify(body),signal:AbortSignal.timeout(5000)})).catch(()=>{});
    } catch { /* Optional delivery only; never retry telemetry recursively. */ }
  };
}
