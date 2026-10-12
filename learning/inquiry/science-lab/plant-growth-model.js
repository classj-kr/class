/* Qualitative seedling observations. Geometry is illustrative, not measured height. */
(function(root){
 'use strict';
 const create=()=>({objective:'water',water:false,light:true,initial:'same',day:0});
 function configure(s,key,value){
  if(key==='objective'&&['water','light'].includes(value)){s.objective=value;s.water=value==='light';s.light=value==='water';}
  else if(['water','light'].includes(key)&&typeof value==='boolean')s[key]=value;
  else if(key==='initial'&&['same','larger'].includes(value))s.initial=value;
  else return false;
  s.day=0;return true;
 }
 function observe(s,day){if(!Number.isFinite(day))return false;s.day=Math.max(0,Math.min(7,Math.round(day)));return true;}
 function design(s){
  const changed=['water','light'].filter(key=>!s[key]);if(s.initial!=='same')changed.push('initial');
  return{changed,valid:changed.length===1&&changed[0]===s.objective,reason:changed.length===0?'same':changed.length>1?'multiple':changed[0]!==s.objective?'other':'valid'};
 }
 function specimen(s,which){
  const reference=which==='A',water=reference||s.water,light=reference||s.light,initial=reference||s.initial==='same'?1:1.35,t=s.day/7;
  // Both pots begin with already-grown, green seedlings and moist soil.
  const wilt=water?0:Math.max(0,(t-.25)/.75),pale=light?0:t;
  return{water,light,initial,day:s.day,wilt,pale,elongation:initial+(water?(light?.3:.45):.04)*t,
   appearance:s.day===0?'seedling':!water?'wilting':!light?'pale':'healthy'};
 }
 const api={create,configure,observe,design,specimen};if(typeof module!=='undefined')module.exports=api;else root.sciencePlantGrowth=api;
})(typeof window==='undefined'?globalThis:window);
