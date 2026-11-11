"use strict";
module.exports=function(T,k,id,parts){
 if(!['object-key','object-lamp'].includes(id))return;
 const key=id==='object-key',head=parts.get('Head'),ink=require('./solid-ink-shell.cjs');
 if(!key)require('./lamp-shade-shell.cjs')(T,k,head);
 for(const part of parts.values()){
  const g=part.group;for(const o of [...g.children])if(o.material?.userData.originalTexture)g.remove(o);
  if(!key)g.userData.artworkOpaqueRegions=[];
  for(const o of g.children)if(o.isMesh){
   if(part===head){if(!o.userData.skipOriginalPaint)o.userData.artworkFacingFade=o.name==='LampFaceSolid'?[.10,.32]:o.name==='LampTopCapSolid'?[0,.12]:[.35,.70];}
   else if(o.name.includes('Torso')){o.userData.artworkFacingFade=[.35,.70];o.userData.artworkMinY=453;}
   else o.userData.skipOriginalPaint=true;
  }
  require('./project-model-artwork.cjs')(T,k,g,part.part.pivot);
  if(part!==head)for(const o of [...g.children])if(o.isMesh&&!o.material?.userData.originalTexture)ink(T,k,o,'#71482f',.007);
 }
 for(const name of key?['KeyMedallionSolid','KeyBowSolid','KeyShaftSolid','KeyToothUpperSolid','KeyToothLowerSolid']:['LampShadeSolid','LampFaceSolid','LampCollarSolid'])ink(T,k,head.group.getObjectByName(name),key?'#bd8b35':'#91602e',.007);
};
