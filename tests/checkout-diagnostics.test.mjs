import test from 'node:test';import assert from 'node:assert/strict';
import {createCheckoutReporter,checkoutFailure} from '../src/lib/checkout-diagnostics.js';
import {submitVerifiedCrm,submitCheckout} from '../src/lib/checkout.js';
const key='11111111-1111-4111-8111-111111111111';const payload={clientOrderId:key,name:'PRIVATE-NAME',phone:'+380501234567',items:[{id:'antenna-high',quantity:1,unitPrice:200}],total:200};
const url='https://api.dvision.com.ua/order';
test('lost CRM response retries once with the same payload and a fresh token; committed order remains unique',async()=>{
 const bodies=[],tokens=[],events=[],created=new Set();let calls=0;
 const result=await submitVerifiedCrm({url,payload,challenge:async()=>{const token='token-'+tokens.length;tokens.push(token);return token;},wait:async()=>{},report:(...e)=>events.push(e),fetchImpl:async(_url,init)=>{
  const body=JSON.parse(init.body);bodies.push(body);created.add(body.clientOrderId);
  if(++calls===1)throw new DOMException('PRIVATE-NETWORK-ERROR','TimeoutError');return Response.json({ok:true,clientOrderId:key});
 }});
 assert.equal(result.ok,true);assert.equal(created.size,1);assert.equal(tokens.length,2);assert.notEqual(tokens[0],tokens[1]);
 for(const body of bodies){const {challengeToken,...business}=body;assert.deepEqual(business,payload);}
 assert.equal(events.filter(e=>e[0]==='checkout_retry').length,1);
 assert.ok(!JSON.stringify(events).includes('PRIVATE-'));
});
test('retry stays bounded and never retries verification, rate limits or price conflicts',async()=>{
 for(const status of [403,409,429,503]){
  let calls=0,proofs=0;const events=[];
  await assert.rejects(submitVerifiedCrm({url,payload,challenge:async()=>{proofs++;return 'token';},wait:async()=>{},report:(...e)=>events.push(e),fetchImpl:async()=>{calls++;return Response.json(status===409?{error:'cart_changed',changes:[{id:'antenna-high',type:'price'}]}:{error:status===403?'verification_failed':status===429?'rate_limited':'busy'},{status});}}),e=>status!==409||e.code==='cart_changed'&&e.changes.length===1);
  assert.equal(calls,status===503?2:1);assert.equal(proofs,calls);
 }
 let requests=0;await assert.rejects(submitVerifiedCrm({url,payload,challenge:async()=>{throw Error('verification_failed');},fetchImpl:async()=>{requests++;}}));assert.equal(requests,0);
});
test('reporter sends only bounded allowlisted metadata, swallows failures and limits noise',async()=>{
 const sent=[];const report=createCheckoutReporter(url,async(url,init)=>{sent.push({url,init,body:JSON.parse(init.body)});throw Error('offline');});
 for(let i=0;i<35;i++)report('crm_result',key,{code:'network_error',name:payload.name,phone:payload.phone,challengeToken:'PRIVATE-TOKEN',httpStatus:502,widgetError:'110200'});
 await new Promise(r=>setImmediate(r));assert.equal(sent.length,32);assert.match(sent[0].url,/diagnostic=1/);assert.equal(sent[0].init.credentials,'omit');
 for(const value of [payload.name,payload.phone,'PRIVATE-TOKEN'])assert.ok(!JSON.stringify(sent).includes(value));
 report('crm_result',payload.phone,{});assert.equal(sent.length,32);
 const malicious=checkoutFailure({message:payload.phone,widgetError:payload.name,requestId:payload.phone});assert.deepEqual(malicious,{code:'unknown'});
 assert.doesNotThrow(()=>createCheckoutReporter(url,()=>{throw Error('offline');})('crm_result',key,{code:'ok'}));
});
test('diagnostic outages do not hide CRM success or stop independent Sheets write',async()=>{
 let copied=false;const result=await submitCheckout({payload,report(){throw Error('logger failed');},submitSheets:async()=>{copied=true;},submitCrm:async()=>({ok:true})});
 assert.equal(result.ok,true);await new Promise(r=>setImmediate(r));assert.equal(copied,true);
});
