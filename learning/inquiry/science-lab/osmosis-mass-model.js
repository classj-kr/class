(function(root){'use strict';
 // Fixed comparison specimens from the reviewed 2022 teacher-text example
 // (80/80/80 g -> 80/78/72 g). These are endpoints, not a fitted kinetic law.
 const concentrations=[.5,1,2],initial=[80,80,80],final=[80,78,72],dish=12;
 const create=()=>({phase:'before',selected:null,tared:false,wet:[false,false,false],before:[null,null,null],after:[null,null,null]});
 function select(s,i){if(s.phase==='immersed'||!Number.isInteger(i)||i<0||i>2)return false;s.selected=i;return true;}
 function clear(s){s.selected=null;return true;}
 function tare(s){if(s.selected!==null)return false;s.tared=true;return true;}
 function reading(s){if(s.selected===null)return{value:s.tared?0:dish,reason:null};if(s.wet[s.selected])return{value:null,reason:'wet'};return{value:(s.phase==='after'?final:initial)[s.selected]+(s.tared?0:dish),reason:s.tared?null:'dish'};}
 function weigh(s){if(s.selected===null)return{ok:false,reason:'empty'};const r=reading(s);if(r.reason)return{ok:false,reason:r.reason};const rows=s.phase==='after'?s.after:s.before;rows[s.selected]=r.value;return{ok:true,value:r.value};}
 function immerse(s){if(s.phase!=='before'||s.before.some(x=>x===null))return false;s.selected=null;s.phase='immersed';return true;}
 function remove(s){if(s.phase!=='immersed')return false;s.phase='after';s.wet=[true,true,true];return true;}
 function blot(s){if(s.phase!=='after'||s.selected===null||!s.wet[s.selected])return false;s.wet[s.selected]=false;return true;}
 function comparison(s,i){if(s.before[i]===null||s.after[i]===null)return null;const delta=s.after[i]-s.before[i];return{delta,percent:100*delta/s.before[i]};}
 const api={concentrations,initial,final,dish,create,select,clear,tare,reading,weigh,immerse,remove,blot,comparison};if(typeof module!=='undefined')module.exports=api;else root.OsmosisMassModel=api;
})(typeof window==='undefined'?globalThis:window);
