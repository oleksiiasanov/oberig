export const CATALOG_API = 'https://api.dvision.com.ua';
export async function loadCatalog(fetchImpl = fetch) {
  const response = await fetchImpl(`${CATALOG_API}/catalog`,{cache:'no-store',credentials:'omit',redirect:'error',signal:AbortSignal.timeout(12000)});
  if(!response.ok)throw new Error('catalog_unavailable');
  const data=await response.json();
  if(data.version!==2 || !Array.isArray(data.items))throw new Error('catalog_unavailable');
  return data;
}
export function catalogItems(data, language='uk') {
  const format = minor => `${(minor/100).toLocaleString(language==='uk'?'uk-UA':'en-US',{maximumFractionDigits:2})} ${language==='uk'?'грн':'UAH'}`;
  return (data?.items || []).map(item=>{
    const uk=item.content.uk,en=item.content.en;
    const content=language==='en' && en?.name ? {...uk,...en} : uk;
    const variants=item.variants;
    const variable=variants.some(v=>v.cableLengthM!==undefined);
    return {...content,id:item.id,displayGroup:item.displayGroup === 'ADDITIONAL' ? 'ADDITIONAL' : 'MAIN',available:item.available,variants,photo:item.imageId?`${CATALOG_API}/catalog/images/${item.imageId}`:null,
      ...(variable ? {cableLengths:variants.map(v=>v.cableLengthM),price:variants.map(v=>[`${v.cableLengthM} ${language==='uk'?'м':'m'}`,format(v.priceMinor)])} : {price:format(variants[0].priceMinor)})};
  });
}
export function itemPrice(item,length) {return (item.variants?.find(v=>v.cableLengthM===length)?.priceMinor ?? 0)/100;}
export async function checkCart(items,fetchImpl=fetch) {
  const response=await fetchImpl(`${CATALOG_API}/cart/check`,{method:'POST',cache:'no-store',credentials:'omit',redirect:'error',headers:{'Content-Type':'text/plain;charset=UTF-8'},body:JSON.stringify({items:items.map(({id,cableLengthM,unitPrice})=>({id,cableLengthM,unitPrice}))}),signal:AbortSignal.timeout(12000)});
  if(!response.ok)throw new Error('cart_unavailable');
  const result=await response.json();
  if(!Array.isArray(result.changes))throw new Error('cart_unavailable');
  return result.changes;
}

export function catalogGroups(items) {
  return { main: items.filter(item => item.displayGroup !== 'ADDITIONAL'), additional: items.filter(item => item.displayGroup === 'ADDITIONAL') };
}
