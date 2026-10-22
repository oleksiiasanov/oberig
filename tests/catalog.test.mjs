import test from 'node:test';
import assert from 'node:assert/strict';
import { catalogItems,itemPrice,checkCart,loadCatalog } from '../src/lib/liveCatalog.js';
import {landingContent} from '../src/data/content.js';
const data={version:2,currency:'UAH',items:[{id:'example',available:true,imageId:'a'.repeat(64),content:{uk:{name:'Приклад',description:[]},en:{name:'Example',description:[]}},variants:[{sku:'SYNTHETIC',priceMinor:12345,available:true}]}]};
test('catalog has no hardcoded products; API money is exact in both languages',()=>{
 assert.deepEqual(landingContent.uk.order.items,[]);assert.deepEqual(landingContent.en.order.items,[]);
 for(const lang of ['uk','en']){const item=catalogItems(data,lang)[0];assert.equal(itemPrice(item),123.45);assert.ok(item.photo.endsWith('/'+'a'.repeat(64)));}
});
test('fresh checks send only public line inputs and surface availability/price changes',async()=>{
 const changes=[{id:'example',type:'price_changed',priceMinor:15000}];
 assert.deepEqual(await checkCart([{id:'example',unitPrice:123.45,name:'not forwarded',secret:'never'}],async(url,options)=>{
  assert.equal(options.cache,'no-store');assert.equal(options.credentials,'omit');assert.deepEqual(JSON.parse(options.body),{items:[{id:'example',unitPrice:123.45}]});return {ok:true,json:async()=>({changes})};
 }),changes);
 await assert.rejects(loadCatalog(async()=>({ok:false})),/catalog_unavailable/);
});
