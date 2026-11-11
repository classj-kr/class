"use strict";
module.exports=function(T,k,id,parts){
 if(!['object-lock','object-mitten'].includes(id))return;
 const lock=id==='object-lock',head=parts.get('Head'),ink=require('./solid-ink-shell.cjs');
 for(const part of parts.values()){
  const g=part.group;for(const o of [...g.children])if(o.material?.userData.originalTexture)g.remove(o);
  if(!lock)g.userData.artworkOpaqueRegions=[];
  for(const o of g.children)if(o.isMesh){
   if(part===head){if(!o.userData.skipOriginalPaint)o.userData.artworkFacingFade=[.35,.70];}
   else if(/Torso|Waist/.test(o.name)){o.userData.artworkFacingFade=[.35,.70];o.userData.artworkMinY=lock?450:516;}
   else o.userData.skipOriginalPaint=true;
  }
  require('./project-model-artwork.cjs')(T,k,g,part.part.pivot);
  if(part!==head)for(const o of [...g.children])if(o.isMesh&&!o.material?.userData.originalTexture)ink(T,k,o,lock?'#b77517':'#841c27',.007);
 }
 for(const n of lock?['LockCaseSolid','LockShackleSolid']:[])ink(T,k,head.group.getObjectByName(n),n.includes('Cuff')?'#bda3a6':lock?'#986022':'#871d25',.007);
};
