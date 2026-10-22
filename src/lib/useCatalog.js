import {useEffect,useState} from 'react';
import {loadCatalog} from './liveCatalog.js';
export function useCatalog(){
 const [state,setState]=useState({data:null,error:false});
 const [revision,setRevision]=useState(0);
 useEffect(()=>{let active=true;loadCatalog().then(data=>active&&setState({data,error:false})).catch(()=>active&&setState(s=>({...s,error:true})));return()=>{active=false};},[revision]);
 return {...state,retry:()=>{setState(s=>({...s,error:false}));setRevision(x=>x+1);}};
}
