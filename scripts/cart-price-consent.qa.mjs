// Isolated browser regression: every API/Sheets/Turnstile request is synthetic.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import {createServer} from 'vite';
import react from '@vitejs/plugin-react';
const {chromium}=await import(process.env.OMS_BROWSER_MODULE || 'playwright');
const root=fileURLToPath(new URL('../',import.meta.url));
const catalog={version:2,currency:'UAH',items:Array.from({length:8},(_,i)=>({id:i===0?'molle-mount':`product-${i}`,available:true,content:{uk:{name:i===0?'Кріплення на бронежилет (MOLLE)':`Тестовий товар ${i}`,short:'Опис товару для перевірки оформлення замовлення.',category:'accessory'},en:{name:`Test product ${i}`,category:'accessory'}},variants:[{sku:`QA-${i}`,priceMinor:i===0?50000:10000,available:true}]}))};
const output=root+'artifacts/cart-price-consent';fs.mkdirSync(output,{recursive:true});
const server=await createServer({root,configFile:false,plugins:[react()],define:{'import.meta.env.VITE_TURNSTILE_SITEKEY':JSON.stringify('synthetic-public-key')},server:{host:'127.0.0.1',port:5317,strictPort:true}});await server.listen();
const browser=await chromium.launch({headless:true});
try{
 for(const width of [1440,390]){
  const context=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'}),page=await context.newPage();
  let price=500,failCheck=false,race=false,unavailable=false;const submitted=[],pageErrors=[];page.on('pageerror',e=>pageErrors.push(e.message));
  await page.addInitScript(({items})=>{localStorage.setItem('dvision-language','uk');if(!sessionStorage.getItem('qa-initialized')){sessionStorage.setItem('qa-initialized','1');sessionStorage.setItem('dvision-cart',JSON.stringify(Object.fromEntries(items.map(i=>[i.id,1]))));sessionStorage.setItem('dvision-cart-prices',JSON.stringify(Object.fromEntries(items.map(i=>[i.id,{id:i.id,name:i.content.uk.name,unitPrice:i.id==='molle-mount'?300:100}]))));}},catalog);
  await page.route('https://ipapi.co/**',r=>r.fulfill({json:{country_code:'UA'}}));
  await page.route('https://script.google.com/**',r=>r.fulfill({json:{ok:true,orderNumber:'SYNTHETIC'}}));
  await page.route('https://challenges.cloudflare.com/**',r=>r.fulfill({contentType:'application/javascript',body:'window.turnstile={render(el,o){this.o=o;return 1},reset(){},remove(){},execute(){this.o.callback("synthetic-token")}}'}));
  await page.route('https://api.dvision.com.ua/**',async r=>{
   const path=new URL(r.request().url()).pathname;if(path==='/catalog')return r.fulfill({json:catalog});
   const body=r.request().postDataJSON();
   if(path==='/cart/check'){
    if(failCheck)return r.fulfill({status:503,json:{error:'busy'}});
    const changes=body.items.filter(i=>i.id==='molle-mount'&&(unavailable||i.unitPrice!==price)).map(i=>({id:i.id,type:unavailable?'unavailable':'price_changed',...(unavailable?{}:{priceMinor:price*100})}));return r.fulfill({json:{ok:!changes.length,changes}});
   }
   if(path==='/order'){
    if(race){race=false;price=700;return r.fulfill({status:409,json:{error:'cart_changed',changes:[{id:'molle-mount',type:'price_changed',priceMinor:70000}]}});}
    submitted.push(body);return r.fulfill({json:{ok:true,clientOrderId:body.clientOrderId}});
   }
   throw new Error(`Unexpected API path ${path}`);
  });
  await page.goto('http://127.0.0.1:5317/cart');await page.locator('input[name="name"]').fill('Synthetic buyer');await page.locator('input[type="tel"]').fill('+380000000093');await page.locator('textarea[name="comment"]').fill('Synthetic comment');
  const submit=page.locator('.cart-submit-btn');await submit.click();const confirm=page.getByRole('button',{name:'Підтвердити нову ціну',exact:true});await confirm.waitFor();
  const inView=()=>confirm.evaluate(e=>{const r=e.getBoundingClientRect();return r.top>=0&&r.bottom<=innerHeight;});
  if(process.env.QA_EXPECT_HIDDEN==='true'){assert.equal(await inView(),false);assert.equal(await submit.isDisabled(),true);console.log(`REPRODUCED ${width}: price consent above viewport while submit is disabled`);await context.close();continue;}
  await page.waitForFunction(()=>document.activeElement?.classList.contains('cart-change-notice'));
  assert.equal(await inView(),true,'price confirmation must be visible after checkout');
  assert.match(await page.locator('.cart-change-notice').innerText(),/300 грн.*500 грн/s);assert.equal(submitted.length,0);
  await page.screenshot({path:`${output}/changed-${width}.png`});
  // Rechecking can find another change or fail: keep visible consent and input values.
  price=650;await confirm.click();await page.getByText(/650 грн/).first().waitFor();assert.equal(submitted.length,0);
  failCheck=true;await confirm.click();await page.getByText('Не вдалося перевірити кошик. Спробуйте ще раз.',{exact:true}).waitFor();assert.equal(await inView(),true);failCheck=false;
  await confirm.click();await page.getByText(/Ціни оновлено/).waitFor();assert.equal(await submit.isEnabled(),true);
  assert.equal(await page.locator('input[name="name"]').inputValue(),'Synthetic buyer');assert.equal(await page.locator('textarea[name="comment"]').inputValue(),'Synthetic comment');
  assert.match(await page.locator('.cart-total-sum').innerText(),/1\s350/);assert.equal(submitted.length,0,'confirmation does not silently place an order');
  await page.screenshot({path:`${output}/confirmed-${width}.png`});
  // A final atomic checkout conflict must reveal the same visible flow.
  race=true;await submit.click();await confirm.waitFor();assert.equal(await inView(),true);assert.match(await page.locator('.cart-change-notice').innerText(),/650 грн.*700 грн/s);
  await confirm.click();await page.getByText(/Ціни оновлено/).waitFor();await submit.click();await page.locator('.cart-success').waitFor();assert.equal(submitted.length,1);assert.equal(submitted[0].items.find(i=>i.id==='molle-mount').unitPrice,700);assert.equal(submitted[0].total,1400);
  // Adding a product also reveals consent; cancellation and unavailable-only updates remain clear.
  await page.goto('http://127.0.0.1:5317/cart?item=molle-mount');await confirm.waitFor();assert.equal(await inView(),true);
  await page.getByRole('button',{name:'Скасувати',exact:true}).click();assert.equal(await page.locator('#cart-qty-molle-mount').inputValue(),'0');
  unavailable=true;await page.locator('#cart-qty-molle-mount').fill('1');const remove=page.getByRole('button',{name:'Прибрати недоступне та підтвердити зміни',exact:true});await remove.waitFor();
  assert.equal(await remove.evaluate(e=>{const r=e.getBoundingClientRect();return r.top>=0&&r.bottom<=innerHeight;}),true);
  await remove.click();await page.getByText(/Кошик оновлено/).waitFor();await page.getByText('Кошик порожній. Оберіть інший товар у каталозі.',{exact:true}).waitFor();assert.equal(await submit.isDisabled(),true);assert.equal(submitted.length,1);
  assert.deepEqual(pageErrors,[]);await context.close();console.log(`PASS ${width}: visible consent, repeat price change, retry, preserved input, updated total, final conflict and successful checkout`);
 }
}finally{await browser.close();await server.close();}
