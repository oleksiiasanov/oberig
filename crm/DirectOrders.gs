/** Direct Orders intake. Deploy alongside Code.gs; activate only after the CRM bridge is ready. */
const DIRECT_HEADERS = ['№ замовлення','Дата заявки','ПІБ','Телефон','Кількість детекторів','Ціна детектора','Ціна кріплення на бронежилет','Додаткове обладнання','Статус','Сума замовлення','Коментар','Опитування'];
const DIRECT_TECH = ['clientOrderId','_crm_payload','_crm_received_at','_crm_sync','_crm_error','_crm_verified'];
const DIRECT_NAMES = {
  detector:'Детектор', 'car-antenna':'Виносна антена для авто, 2м',
  'car-antenna-amp:5':'Виносна антена для авто, 5м', 'car-antenna-amp:10':'Виносна антена для авто, 10м',
  'bunker-antenna:14':'Виносна антена для бліндажа, 14м', 'bunker-antenna:20':'Виносна антена для бліндажа, 20м',
  'car-holder':'Автомобільний тримач', 'molle-mount':'Кріплення на бронежилет',
  'antenna-high':'Антена 2.8 – 12 (більша)', 'antenna-low':'Антена 0.5 – 3 (менша)',
};
function directEnabled() {
  const p=PropertiesService.getScriptProperties(),after=p.getProperty('ORDERS_CUTOVER_AT');
  return p.getProperty('DIRECT_ORDERS_ENABLED')==='true' && (!after || Date.now()>=Date.parse(after));
}
function directBook() {
  const props=PropertiesService.getScriptProperties();
  const id=props.getProperty('ORDERS_SPREADSHEET_ID');
  const gid=Number(props.getProperty('ORDERS_SHEET_GID'));
  if (!id || !Number.isSafeInteger(gid)) throw new Error('sheet_configuration');
  const book=SpreadsheetApp.openById(id), sheet=book.getSheets().find(s=>s.getSheetId()===gid);
  if (!sheet) throw new Error('sheet_schema');
  return sheet;
}
function directLocked(fn) {
  const lock=LockService.getScriptLock();lock.waitLock(20000);
  try { return fn(); } finally { lock.releaseLock(); }
}
function directLayout(sheet, install) {
  let headers=sheet.getRange(1,1,1,sheet.getLastColumn()).getValues()[0].map(String);
  for (const h of DIRECT_HEADERS) if(headers.filter(x=>norm(x)===norm(h)).length!==1) throw new Error('sheet_schema');
  const absent=DIRECT_TECH.filter(h=>!headers.includes(h));
  if(absent.length) {
    if(!install || absent.length!==DIRECT_TECH.length) throw new Error('sheet_schema');
    // Append beyond the entire allocated grid: never overwrite right-hand statistics/formulas.
    const first=sheet.getMaxColumns()+1;
    sheet.insertColumnsAfter(first-1,absent.length);
    sheet.getRange(1,first,1,absent.length).setValues([absent]);
    sheet.hideColumns(first,absent.length);
    headers=sheet.getRange(1,1,1,sheet.getLastColumn()).getValues()[0].map(String);
  }
  for(const h of DIRECT_TECH) if(headers.filter(x=>x===h).length!==1) throw new Error('sheet_schema');
  return {headers, col:h=>headers.findIndex(x=>norm(x)===norm(h))+1};
}
function directFind(sheet, layout, key) {
  if(sheet.getLastRow()<2)return 0;
  const matches=sheet.getRange(2,layout.col('clientOrderId'),sheet.getLastRow()-1,1).getValues()
    .map((r,i)=>r[0]===key?i+2:0).filter(Boolean);
  if(matches.length>1)throw new Error('duplicate_key');
  return matches[0]||0;
}
function directCanonical(raw) {
  if(!raw || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(raw.clientOrderId||''))throw new Error('invalid_payload');
  const name=typeof raw.name==='string'?raw.name.trim():'',phone=typeof raw.phone==='string'?raw.phone.trim():'';
  const comment=raw.comment===undefined?'':typeof raw.comment==='string'?raw.comment.trim():null;
  if(!name||name.length>200||!/^\+[1-9]\d{7,14}$/.test(phone)||phone.startsWith('+380')&&phone.length!==13||comment===null||comment.length>1000)throw new Error('invalid_payload');
  if(!['uk','en'].includes(raw.language)||typeof raw.whatsappConsent!=='boolean'||typeof raw.submittedAt!=='string'||raw.submittedAt.length>40||!Number.isFinite(Date.parse(raw.submittedAt)))throw new Error('invalid_payload');
  if(!Array.isArray(raw.items)||!raw.items.length||raw.items.length>50)throw new Error('invalid_payload');
  const merged={};
  raw.items.forEach(i=>{
    if(!i||typeof i.id!=='string'||!/^[a-z0-9][a-z0-9-]{0,99}$/.test(i.id)||!Number.isInteger(i.quantity)||i.quantity<1||i.quantity>2147483647||!Number.isFinite(i.unitPrice)||i.unitPrice<=0||i.unitPrice>90000000000||Math.abs(i.unitPrice*100-Math.round(i.unitPrice*100))>0.001||i.cableLengthM!==undefined&&(!Number.isInteger(i.cableLengthM)||i.cableLengthM<1))throw new Error('invalid_payload');
    const k=JSON.stringify([i.id,i.cableLengthM||null]);
    if(merged[k]&&merged[k].unitPrice!==i.unitPrice)throw new Error('invalid_payload');
    if(!merged[k])merged[k]={id:i.id,...(i.cableLengthM===undefined?{}:{cableLengthM:i.cableLengthM}),quantity:0,unitPrice:i.unitPrice};
    merged[k].quantity+=i.quantity;
    if(merged[k].quantity>2147483647)throw new Error('invalid_payload');
  });
  const items=Object.values(merged).sort((a,b)=>a.id.localeCompare(b.id)||(a.cableLengthM||0)-(b.cableLengthM||0));
  const minor=items.reduce((sum,i)=>sum+i.quantity*Math.round(i.unitPrice*100),0);
  if(!Number.isSafeInteger(minor)||minor>9000000000000||raw.total!==minor/100)throw new Error('invalid_payload');
  return {clientOrderId:raw.clientOrderId,items,total:minor/100,name,phone,comment,whatsappConsent:raw.whatsappConsent,language:raw.language,submittedAt:raw.submittedAt};
}
function directBusiness(o) { return JSON.stringify({items:o.items,total:o.total,name:o.name,phone:o.phone,comment:o.comment}); }
function directText(value) { const s=String(value||''); return /^[=+\-@]/.test(s)?"'"+s:s; }
function directItemName(i) { return DIRECT_NAMES[i.id+(i.cableLengthM?':'+i.cableLengthM:'')]||DIRECT_NAMES[i.id]||i.id+(i.cableLengthM?', '+i.cableLengthM+'м':''); }
function directDate(iso) {
  const parts=Utilities.formatDate(new Date(iso),'Europe/Kyiv','yyyy-MM-dd').split('-').map(Number);
  return Date.UTC(parts[0],parts[1]-1,parts[2])/86400000+25569;
}
function directWrite(raw, verified) {
  const order=directCanonical(raw);
  return directLocked(()=>{
    const sheet=directBook(),layout=directLayout(sheet,false),found=directFind(sheet,layout,order.clientOrderId);
    if(found){
      const saved=directCanonical(JSON.parse(sheet.getRange(found,layout.col('_crm_payload')).getValue()));
      if(directBusiness(saved)!==directBusiness(order))throw new Error('payload_conflict');
      if(verified)sheet.getRange(found,layout.col('_crm_verified')).setValue('true');
      return {created:false,orderNumber:sheet.getRange(found,layout.col('№ замовлення')).getValue(),order};
    }
    const row=sheet.getLastRow()+1;
    if(row>sheet.getMaxRows())sheet.insertRowsAfter(sheet.getMaxRows(),1);
    const values=Array(layout.headers.length).fill('');
    const set=(h,v)=>{values[layout.col(h)-1]=v;};
    const detector=order.items.filter(i=>i.id==='detector');
    const mount=order.items.find(i=>i.id==='molle-mount');
    set('Дата заявки',directDate(order.submittedAt));set('ПІБ',directText(order.name));set('Телефон',directText(order.phone));
    set('Кількість детекторів',detector.reduce((s,i)=>s+i.quantity,0)||'');
    set('Ціна детектора',detector[0]?.unitPrice||'');set('Ціна кріплення на бронежилет',mount?.unitPrice||'');
    set('Додаткове обладнання',order.items.filter(i=>i.id!=='detector').map(i=>directItemName(i)+' x'+i.quantity).join('\n'));
    set('Сума замовлення',order.total);set('Коментар',directText(order.comment));
    set('clientOrderId',order.clientOrderId);set('_crm_payload',JSON.stringify(order));
    set('_crm_received_at',new Date().toISOString());set('_crm_sync','PENDING');set('_crm_verified',verified?'true':'false');
    for(const h of ['ПІБ','Телефон','Коментар','Додаткове обладнання',...DIRECT_TECH])sheet.getRange(row,layout.col(h)).setNumberFormat('@');
    // One values write includes the identity and original payload, so a lost response can be retried safely.
    sheet.getRange(row,1,1,values.length).setValues([values]);
    sheet.getRange(row,layout.col('Дата заявки')).setNumberFormat('dd/mm/yy');
    for(const h of ['Статус','Статус оплати','Передплата']) {
      if(layout.col(h)) {
        const rule=sheet.getRange(2,layout.col(h)).getDataValidation();
        if(rule)sheet.getRange(row,layout.col(h)).setDataValidation(rule);
      }
    }
    return {created:true,orderNumber:'',order};
  });
}
function directSnapshot(key) {
  return directLocked(()=>{
    const sheet=directBook(),l=directLayout(sheet,false),row=directFind(sheet,l,key);
    if(!row)return null;
    const v=sheet.getRange(row,1,1,l.headers.length).getValues()[0],get=h=>v[l.col(h)-1];
    return {key,payload:directCanonical(JSON.parse(get('_crm_payload'))),observedAt:String(get('_crm_received_at')),number:String(get('№ замовлення')),state:get('_crm_sync'),verified:String(get('_crm_verified'))==='true'};
  });
}
function directSign(direction,data) {
  const secret=PropertiesService.getScriptProperties().getProperty('ORDERS_SYNC_SECRET');
  if(!secret||secret.length<32)throw new Error('sync_configuration');
  const timestamp=String(Date.now()),body=JSON.stringify(data);
  const signature=Utilities.computeHmacSha256Signature('dvision-orders-sync-v1\n'+direction+'\n'+timestamp+'\n'+body,secret)
    .map(b=>('0'+((b+256)%256).toString(16)).slice(-2)).join('');
  return {type:'sheetSync',timestamp,body,signature};
}
function directVerify(envelope) {
  if(!envelope||envelope.type!=='sheetSync'||!/^\d{13}$/.test(envelope.timestamp||'')||Math.abs(Date.now()-Number(envelope.timestamp))>300000||typeof envelope.body!=='string'||envelope.body.length>1000||!/^[a-f0-9]{64}$/.test(envelope.signature||''))throw new Error('invalid_signature');
  const secret=PropertiesService.getScriptProperties().getProperty('ORDERS_SYNC_SECRET');
  if(!secret||secret.length<32)throw new Error('sync_configuration');
  const expected=Utilities.computeHmacSha256Signature('dvision-orders-sync-v1\ncrm-to-sheet\n'+envelope.timestamp+'\n'+envelope.body,secret).map(b=>('0'+((b+256)%256).toString(16)).slice(-2)).join('');
  let diff=0;for(let i=0;i<expected.length;i++)diff|=expected.charCodeAt(i)^envelope.signature.charCodeAt(i);
  if(diff)throw new Error('invalid_signature');
  const data=JSON.parse(envelope.body);
  if(data.op!=='wake'||!/^[-\w]{16,100}$/.test(data.key||''))throw new Error('invalid_signature');
  return data;
}
function directCrm(data) {
  const url=PropertiesService.getScriptProperties().getProperty('ORDERS_CRM_URL');
  if(!/^https:\/\/api\.dvision\.com\.ua\/order$/.test(url||''))throw new Error('sync_configuration');
  const response=UrlFetchApp.fetch(url,{method:'post',contentType:'text/plain',payload:JSON.stringify(directSign('sheet-to-crm',data)),muteHttpExceptions:true,followRedirects:false});
  if(response.getResponseCode()!==200)throw new Error('crm_unavailable');
  const result=JSON.parse(response.getContentText());
  if(typeof result.ok!=='boolean')throw new Error('crm_unavailable');
  return result;
}
function directMark(key,state,code) {
  directLocked(()=>{const s=directBook(),l=directLayout(s,false),r=directFind(s,l,key);if(!r)return;
    s.getRange(r,l.col('_crm_sync')).setValue(state);s.getRange(r,l.col('_crm_error')).setValue(code||'');});
}
function directNumber(key,number,expected) {
  if(!/^OMS-[1-9]\d*$/.test(number))throw new Error('number_collision');
  const visible=number.slice(4);
  if(!Number.isSafeInteger(Number(visible)))throw new Error('number_collision');
  directLocked(()=>{
    const s=directBook(),l=directLayout(s,false),r=directFind(s,l,key);
    if(!r)throw new Error('missing');
    const current=directCanonical(JSON.parse(s.getRange(r,l.col('_crm_payload')).getValue()));
    if(directBusiness(current)!==directBusiness(directCanonical(expected)))throw new Error('payload_conflict');
    const rows=s.getLastRow()>1?s.getRange(2,1,s.getLastRow()-1,l.headers.length).getValues():[];
    if(rows.some((v,i)=>i+2!==r&&String(v[l.col('№ замовлення')-1]).replace(/^OMS-0*/,'').replace(/^0+/,'')===visible))throw new Error('number_collision');
    s.getRange(r,l.col('№ замовлення')).setNumberFormat('0').setValue(Number(visible));
    s.getRange(r,l.col('_crm_sync')).setValue('SYNCED');s.getRange(r,l.col('_crm_error')).setValue('');
  });
}
function syncDirectOrder(key) {
  try {
    let snapshot=directSnapshot(key);
    const result=directCrm({op:'resolve',key,payload:snapshot?.payload||null,observedAt:snapshot?.observedAt,verified:snapshot?.verified===true});
    if(!result.ok){
      const pending=['pending','missing','catalog_unavailable'].includes(result.code);
      directMark(key,pending?'PENDING':'CONFLICT',result.code);
      if(pending)scheduleDirectRetry();else directCrm({op:'conflict',key,code:result.code});
      return result;
    }
    if(!snapshot){
      const restored=directWrite(result.payload,true);
      if(restored.created)directNotify(restored.order);
      snapshot=directSnapshot(key);
    }
    directNumber(key,result.number,snapshot.payload);
    directCrm({op:'ack',key,number:result.number});
    return {ok:true,orderNumber:result.number.slice(4)};
  }catch(error){
    const terminal=['duplicate_key','payload_conflict','number_collision','sheet_schema','invalid_payload'].includes(error.message);
    try{directMark(key,terminal?'CONFLICT':'PENDING',terminal?error.message:'crm_unavailable');}catch(_){}
    if(terminal){try{directCrm({op:'conflict',key,code:error.message});}catch(_){}console.error('ORDERS_SYNC_CONFLICT');}
    else scheduleDirectRetry();
    return {ok:false,error:terminal?error.message:'crm_unavailable'};
  }
}
function directNotify(order) {
  try { const s=directBook();notify({...order,items:order.items.map(i=>({...i,name:directItemName(i)}))},s.getParent().getUrl()+'#gid='+s.getSheetId(),''); }
  catch(_){console.error('ORDERS_NOTIFICATION_FAILED');}
}
function directSurvey(answer) {
  return directLocked(()=>{
    const s=directBook(),l=directLayout(s,false),r=directFind(s,l,String(answer.clientOrderId||''));
    if(!r)throw new Error('order_not_found');
    const original=JSON.parse(s.getRange(r,l.col('_crm_payload')).getValue());
    if(String(answer.phone||'').replace(/\D/g,'')!==original.phone.replace(/\D/g,''))throw new Error('invalid_survey');
    const source=String(answer.source||'').trim().slice(0,300);if(!source)throw new Error('invalid_survey');
    s.getRange(r,l.col('Опитування')).setNumberFormat('@').setValue(directText(source));
    return {ok:true};
  });
}
function directVerifyChallenge(token) {
  if(typeof token!=='string'||!token||token.length>2048)return false;
  const secret=PropertiesService.getScriptProperties().getProperty('ORDERS_TURNSTILE_SECRET');
  if(!secret)return false;
  try {
    const response=UrlFetchApp.fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify',{
      method:'post',contentType:'application/json',payload:JSON.stringify({secret,response:token}),muteHttpExceptions:true,followRedirects:false});
    if(response.getResponseCode()!==200)return false;
    const result=JSON.parse(response.getContentText());
    return result.success===true&&['dvision.com.ua','www.dvision.com.ua'].includes(result.hostname)&&result.action==='checkout';
  }catch(_){return false;}
}
function directPost(order) {
  try {
    if(order.type==='sheetSync'){const signed=directVerify(order);return json(syncDirectOrder(signed.key));}
    if(order.type==='survey')return json(directSurvey(order));
    const verified=directVerifyChallenge(order.challengeToken);
    // Old cached clients may still preserve a backup row, but unverified sheet-only rows cannot create CRM orders.
    const saved=directWrite(order,verified);
    // Persist retry before external calls; a CRM timeout cannot roll back independent sheet capture.
    scheduleDirectRetry();
    if(saved.created)directNotify(saved.order);
    const synced=syncDirectOrder(saved.order.clientOrderId);
    return json({ok:true,clientOrderId:saved.order.clientOrderId,orderNumber:synced.orderNumber||saved.orderNumber||''});
  }catch(error){
    const code=['invalid_payload','payload_conflict','duplicate_key','invalid_signature','order_not_found','invalid_survey'].includes(error.message)?error.message:'sheet_unavailable';
    return json({ok:false,error:code});
  }
}
function scheduleDirectRetry() {
  try {directLocked(()=>{
    if(!ScriptApp.getProjectTriggers().some(t=>t.getHandlerFunction()==='retryDirectOrders'))ScriptApp.newTrigger('retryDirectOrders').timeBased().after(120000).create();
  });}catch(_){console.error('ORDERS_RETRY_SCHEDULE_FAILED');}
}
function retryDirectOrders(event) {
  if(event?.triggerUid)ScriptApp.getProjectTriggers().filter(t=>t.getUniqueId()===event.triggerUid).forEach(t=>ScriptApp.deleteTrigger(t));
  reconcileDirectOrders(false);
}
function reconcileDirectOrders(full) {
  if(!directEnabled())return;
  const started=Date.now(),all=full!==false;
  const snapshots=directLocked(()=>{
    const s=directBook(),l=directLayout(s,false);
    return s.getLastRow()<2?[]:s.getRange(2,1,s.getLastRow()-1,l.headers.length).getValues().filter(r=>r[l.col('clientOrderId')-1]).map(r=>({key:r[l.col('clientOrderId')-1],state:r[l.col('_crm_sync')-1],number:String(r[l.col('№ замовлення')-1])}));
  });
  const queue=new Set(snapshots.filter(r=>r.state!=='SYNCED'&&r.state!=='CONFLICT').map(r=>r.key));
  try {
    if(all)for(let i=0;i<snapshots.length;i+=100){
      const batch=snapshots.slice(i,i+100),result=directCrm({op:'inspect',keys:batch.map(r=>r.key)});
      for(const row of result.rows||[])if(row.state!=='FOUND'||row.number!=='OMS-'+batch.find(b=>b.key===row.key).number)queue.add(row.key);
    }
    const pending=directCrm({op:'pending'});for(const key of pending.keys||[])queue.add(key);
    let failures=0;
    for(const key of queue){
      if(Date.now()-started>240000){scheduleDirectRetry();break;}
      const result=syncDirectOrder(key);
      if(!result.ok&&!['pending','missing'].includes(result.code))failures++;
    }
    if(failures)throw new Error('ORDERS_RECONCILIATION_NEEDS_ATTENTION');
    // More than one page of CRM-only rows is drained by short retries, not delayed another15 minutes.
    if((pending.keys||[]).length===20)scheduleDirectRetry();
    PropertiesService.getScriptProperties().setProperty('ORDERS_SYNC_LAST_OK',new Date().toISOString());
  }catch(_){console.error('ORDERS_RECONCILIATION_FAILED');scheduleDirectRetry();throw new Error('ORDERS_RECONCILIATION_FAILED');}
}
function installDirectOrders() {
  // Configure properties first; run manually once while DIRECT_ORDERS_ENABLED is still false.
  if(!PropertiesService.getScriptProperties().getProperty('ORDERS_TURNSTILE_SECRET'))throw new Error('sync_configuration');
  directSign('sheet-to-crm',{op:'pending'});
  const probe=directCrm({op:'pending'});if(!probe.ok)throw new Error('crm_unavailable');
  directLocked(()=>directLayout(directBook(),true));
  if(!ScriptApp.getProjectTriggers().some(t=>t.getHandlerFunction()==='reconcileDirectOrders'))ScriptApp.newTrigger('reconcileDirectOrders').timeBased().everyMinutes(15).create();
}
