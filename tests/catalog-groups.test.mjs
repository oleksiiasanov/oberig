import test from 'node:test';
import assert from 'node:assert/strict';
import {catalogItems,catalogGroups} from '../src/lib/liveCatalog.js';
test('website groups preserve API ordering and product identity independently of CRM inventory kind',()=>{
 const rows=[['accessory','ADDITIONAL'],['main-b','MAIN'],['main-a','MAIN'],['spare','ADDITIONAL']].map(([id,displayGroup])=>({id,displayGroup,available:true,content:{uk:{name:id},en:{}},variants:[{productId:id,priceMinor:1999}]}));
 const items=catalogItems({items:rows}),groups=catalogGroups(items);
 assert.deepEqual(groups.main.map(x=>x.id),['main-b','main-a']);
 assert.deepEqual(groups.additional.map(x=>x.id),['accessory','spare']);
 assert.equal(groups.additional[0].variants[0].priceMinor,1999);
 assert.deepEqual(catalogGroups([]),{main:[],additional:[]});
 assert.equal(catalogItems({items:[{...rows[0],displayGroup:undefined}]})[0].displayGroup,'MAIN');
});
