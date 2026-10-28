import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import {createHmac,randomUUID} from 'node:crypto';
const code=readFileSync(new URL('../crm/Code.gs',import.meta.url),'utf8')+'\n'+readFileSync(new URL('../crm/DirectOrders.gs',import.meta.url),'utf8');
const headers=['№ замовлення','Дата заявки','ПІБ','Телефон','Кількість детекторів','Ціна детектора','Ціна кріплення на бронежилет','Додаткове обладнання','Статус','Статус оплати','Передплата','Сума замовлення','Сума передплати','Отримано','Проблемні','Коментар','Стара дата заявки','передача','Всього замовлень','aggregate','Дата оплати','Адреса відправки','Номер ен','Опитування'];
const secret='synthetic-script-secret-never-production';
function sandbox() {
  const rows=[headers.slice(),['402',46000,'Historical','','','','','','Підтверджено','Оплачено','','24000']],formats=new Map();
  let columns=38,locked=false,lostWrite=false;const triggers=[],mail=[],requests=[];
  const props=new Map(Object.entries({DIRECT_ORDERS_ENABLED:'true',ORDERS_SPREADSHEET_ID:'synthetic',ORDERS_SHEET_GID:'337346995',ORDERS_SYNC_SECRET:secret,ORDERS_CRM_URL:'https://api.dvision.com.ua/order',ORDERS_TURNSTILE_SECRET:'synthetic-turnstile'}));
  const get=(r,c)=>rows[r-1]?.[c-1]??'';
  const range=(r,c,h=1,w=1)=>({
    getValues:()=>Array.from({length:h},(_,i)=>Array.from({length:w},(_,j)=>get(r+i,c+j))),
    getValue:()=>get(r,c),getDataValidation:()=>null,setDataValidation(){return this;},
    setValues(values){assert.equal(values.length,h);for(let i=0;i<h;i++){assert.equal(values[i].length,w);rows[r+i-1]??=[];for(let j=0;j<w;j++)rows[r+i-1][c+j-1]=values[i][j];}if(lostWrite){lostWrite=false;throw new Error('lost_response');}return this;},
    setValue(v){return this.setValues([[v]]);},setNumberFormat(v){formats.set(`${r}:${c}`,v);return this;},
  });
  const sheet={getLastColumn:()=>Math.max(...rows.map(r=>r.length)),getLastRow:()=>rows.length,getMaxColumns:()=>columns,getMaxRows:()=>1000,
    getRange:range,insertColumnsAfter(n,count){assert.equal(n,columns);columns+=count;},hideColumns(first,count){assert.equal(first,39);assert.equal(count,6);},
    getSheetId:()=>337346995,getParent:()=>book};
  const book={getSheets:()=>[sheet],getUrl:()=> 'https://sheets.test/synthetic'};
  const fakeCrm={resolve:()=>({ok:false,code:'pending'}),pending:()=>({ok:true,keys:[]}),inspect:q=>({ok:true,rows:q.keys.map(key=>({key,state:'MISSING'}))}),ack:()=>({ok:true}),conflict:()=>({ok:true})};
  const context=vm.createContext({console:{error(){}},Date,Math,JSON,Object,Array,Set,Number,String,Error,
    PropertiesService:{getScriptProperties:()=>({getProperty:k=>props.get(k),setProperty:(k,v)=>props.set(k,v)})},
    LockService:{getScriptLock:()=>({waitLock(){assert.equal(locked,false);locked=true;},releaseLock(){locked=false;}})},
    SpreadsheetApp:{openById:()=>book},
    ScriptApp:{getProjectTriggers:()=>triggers.slice(),deleteTrigger:t=>triggers.splice(triggers.indexOf(t),1),newTrigger(name){return {timeBased(){return this;},after(){return this;},everyMinutes(n){assert.equal(n,15);return this;},create(){const t={getHandlerFunction:()=>name,getUniqueId:()=>String(triggers.length)};triggers.push(t);return t;}};}},
    Utilities:{formatDate(d,tz){const p=new Intl.DateTimeFormat('en-CA',{timeZone:tz,year:'numeric',month:'2-digit',day:'2-digit'}).format(d);return p;},computeHmacSha256Signature:(message,key)=>[...createHmac('sha256',key).update(message).digest()]},
    ContentService:{MimeType:{JSON:'json'},createTextOutput:text=>({text,setMimeType(){return this;}})},
    UrlFetchApp:{fetch(url,opts){assert.equal(locked,false,'never hold a sheet lock over remote calls');
      if(url.includes('siteverify'))return {getResponseCode:()=>200,getContentText:()=>JSON.stringify({success:true,hostname:'dvision.com.ua',action:'checkout'})};
      const envelope=JSON.parse(opts.payload),q=JSON.parse(envelope.body);requests.push(q);
      assert.equal(envelope.signature,createHmac('sha256',secret).update(`dvision-orders-sync-v1\nsheet-to-crm\n${envelope.timestamp}\n${envelope.body}`).digest('hex'));
      const result=fakeCrm[q.op](q);return {getResponseCode:()=>200,getContentText:()=>JSON.stringify(result)};
    }},MailApp:{sendEmail:x=>mail.push(x)}});
  vm.runInContext(code,context);
  context.installDirectOrders();
  const col=h=>rows[0].indexOf(h),value=(key,h)=>rows.find(r=>r[col('clientOrderId')]===key)?.[col(h)];
  return {context,rows,col,value,props,formats,requests,triggers,fakeCrm,mail,loseNextWrite:()=>{lostWrite=true;}};
}
const order=(extra={})=>({clientOrderId:randomUUID(),name:'Synthetic',phone:'+380501234567',comment:'Original comment',language:'uk',whatsappConsent:true,submittedAt:'2026-10-27T23:30:00Z',
  items:[{id:'detector',quantity:2,unitPrice:24000},{id:'car-antenna',quantity:1,unitPrice:7000},{id:'bunker-antenna',cableLengthM:14,quantity:1,unitPrice:15000},{id:'molle-mount',quantity:2,unitPrice:500}],total:71000,...extra});

test('direct mapping preserves all historical cells, appends hidden metadata and leaves business status blank',()=>{
  const s=sandbox(),o=order(),before=JSON.stringify(s.rows[1]);
  const result=s.context.directWrite(o,true);
  assert.equal(result.created,true);assert.equal(JSON.stringify(s.rows[1]),before);
  assert.equal(s.col('clientOrderId'),38);
  assert.equal(s.value(o.clientOrderId,'№ замовлення'),'');assert.equal(s.value(o.clientOrderId,'Статус'),'');
  assert.equal(s.value(o.clientOrderId,'Статус оплати'),'');assert.equal(s.value(o.clientOrderId,'Кількість детекторів'),2);
  assert.equal(s.value(o.clientOrderId,'Ціна детектора'),24000);assert.equal(s.value(o.clientOrderId,'Сума замовлення'),71000);
  assert.equal(s.value(o.clientOrderId,'Додаткове обладнання'),'Виносна антена для бліндажа, 14м x1\nВиносна антена для авто, 2м x1\nКріплення на бронежилет x2');
  assert.equal(s.value(o.clientOrderId,'Дата заявки'),Date.UTC(2026,9,28)/86400000+25569);
});
test('lost write response, repeated requests and recovery-before-original produce one row; changed payload conflicts',()=>{
  const s=sandbox(),o=order();s.loseNextWrite();
  assert.throws(()=>s.context.directWrite(o,true),/lost_response/);
  assert.equal(s.context.directWrite(o,true).created,false);assert.equal(s.rows.length,3);
  assert.throws(()=>s.context.directWrite({...o,comment:'Other order'},true),/payload_conflict/);
  assert.equal(s.context.directWrite({...o,language:'en'},true).created,false);
  const other=order();s.fakeCrm.resolve=()=>({ok:true,number:'OMS-404',payload:other});
  assert.equal(s.context.syncDirectOrder(other.clientOrderId).ok,true);
  assert.equal(s.context.directWrite(other,true).created,false);assert.equal(s.rows.length,4);
});
test('number reconciliation re-finds moved rows by key and preserves manager-edited fields; survey ignores changing number',()=>{
  const s=sandbox(),o=order();s.context.directWrite(o,true);
  const row=s.rows[2];row[s.col('Статус')]='Підтверджено';row[s.col('Статус оплати')]='Оплачено';row[s.col('Коментар')]='Manager note';row[s.col('Телефон')]='+380509999999';
  const before=row.slice();
  s.fakeCrm.resolve=q=>{s.rows.splice(2,0,['unrelated','','Other customer']);return {ok:true,number:'OMS-403',payload:o};};
  assert.equal(s.context.syncDirectOrder(o.clientOrderId).ok,true);
  for(let i=1;i<38;i++)assert.equal(row[i],before[i]);assert.equal(row[0],403);
  assert.equal(s.context.directSurvey({clientOrderId:o.clientOrderId,phone:o.phone,orderNumber:'wrong',source:'YouTube'}).ok,true);
  assert.equal(s.value(o.clientOrderId,'Опитування'),'YouTube');
});
test('duplicate keys and occupied visible numbers cannot silently merge orders',()=>{
  const s=sandbox(),o=order();s.context.directWrite(o,true);
  assert.throws(()=>s.context.directNumber(o.clientOrderId,'OMS-402',o),/number_collision/);
  s.rows.push(s.rows[2].slice());assert.throws(()=>s.context.directSnapshot(o.clientOrderId),/duplicate_key/);
});
test('browser cannot assign a CRM number and strings cannot become formulas',()=>{
  const s=sandbox(),o=order({orderNumber:'999999',name:'=IMPORTXML("bad")',comment:'=1+1'});
  const result=JSON.parse(s.context.directPost(o).text);
  assert.equal(result.ok,true);assert.equal(result.orderNumber,'');
  assert.equal(s.value(o.clientOrderId,'ПІБ'),"'=IMPORTXML(\"bad\")");assert.equal(s.value(o.clientOrderId,'Коментар'),"'=1+1");
  assert.equal(s.value(o.clientOrderId,'_crm_verified'),'false');
  const q=s.requests.find(q=>q.op==='resolve');assert.equal(q.verified,false);
});
test('signed wake-up is scoped and expires; independent sheet success survives CRM outage with durable retry',()=>{
  const s=sandbox(),o=order();s.fakeCrm.resolve=()=>{throw new Error('offline');};
  const result=JSON.parse(s.context.directPost({...o,challengeToken:'synthetic-token'}).text);
  assert.equal(result.ok,true);assert.equal(s.value(o.clientOrderId,'_crm_verified'),'true');
  assert.equal(s.triggers.filter(t=>t.getHandlerFunction()==='retryDirectOrders').length,1);
  assert.equal(s.triggers.filter(t=>t.getHandlerFunction()==='reconcileDirectOrders').length,1);
  const envelope=s.context.directSign('crm-to-sheet',{op:'wake',key:o.clientOrderId});
  assert.equal(s.context.directVerify(envelope).key,o.clientOrderId);
  assert.throws(()=>s.context.directVerify({...envelope,body:'{}'}),/invalid_signature/);
  assert.throws(()=>s.context.directVerify({...envelope,timestamp:'1700000000000'}),/invalid_signature/);
  assert.throws(()=>s.context.directVerify(s.context.directSign('sheet-to-crm',{op:'wake',key:o.clientOrderId})),/invalid_signature/);
});
test('fallback checks keyed rows only and drains CRM-only snapshots',()=>{
  const s=sandbox(),o=order();s.context.directWrite(o,true);
  const crmOnly=order();s.fakeCrm.pending=()=>({ok:true,keys:[crmOnly.clientOrderId]});
  s.fakeCrm.resolve=q=>({ok:true,number:q.key===o.clientOrderId?'OMS-403':'OMS-404',payload:q.key===o.clientOrderId?o:crmOnly});
  s.context.reconcileDirectOrders();
  assert.equal(s.value(o.clientOrderId,'№ замовлення'),403);assert.equal(s.value(crmOnly.clientOrderId,'№ замовлення'),404);
  assert.deepEqual(s.requests.find(q=>q.op==='inspect').keys,[o.clientOrderId]);
  assert.equal(s.rows[1][0],'402');assert.ok(s.props.get('ORDERS_SYNC_LAST_OK'));
});

test('timer failures do not claim a healthy last reconciliation',()=>{
  const s=sandbox(),o=order();s.context.directWrite(o,true);
  s.fakeCrm.resolve=()=>({ok:false,code:'payload_conflict'});
  assert.throws(()=>s.context.reconcileDirectOrders(),/ORDERS_RECONCILIATION_FAILED/);
  assert.equal(s.value(o.clientOrderId,'_crm_sync'),'CONFLICT');
  assert.equal(s.props.has('ORDERS_SYNC_LAST_OK'),false);
});

test('standalone entrypoint has no primary-sheet fallback, including when disabled',()=>{
  const s=sandbox(),o=order();
  assert.equal(JSON.parse(s.context.doGet().text).version,'standalone-orders-v1');
  s.props.set('DIRECT_ORDERS_ENABLED','false');
  assert.equal(JSON.parse(s.context.doPost({postData:{contents:JSON.stringify(o)}}).text).error,'intake_disabled');
  assert.equal(s.rows.length,2);
  s.props.set('DIRECT_ORDERS_ENABLED','true');
  assert.equal(JSON.parse(s.context.doPost({postData:{contents:'null'}}).text).error,'invalid_payload');
  assert.equal(JSON.parse(s.context.doPost({postData:{contents:JSON.stringify(o)}}).text).ok,true);
  assert.equal(s.rows.length,3);
  assert.equal(typeof s.context.syncContactedOrder,'undefined');
  assert.equal(typeof s.context.nextOrderNumber,'undefined');
});
