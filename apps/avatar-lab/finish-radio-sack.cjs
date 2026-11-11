"use strict";
module.exports=function(T,k,id,parts){
 if(!['object-radio','object-sack'].includes(id))return;
 const radio=id==='object-radio',head=parts.get('Head'),ink=require('./solid-ink-shell.cjs');
 for(const part of parts.values()){
  const g=part.group;for(const o of [...g.children])if(o.material?.userData.originalTexture)g.remove(o);
  for(const o of g.children)if(o.isMesh){
   if(part===head){if(!o.userData.skipOriginalPaint)o.userData.artworkFacingFade=o.name==='SackGatheredTopSolid'?[.60,.85]:[.35,.70];}
   else if(/Torso/.test(o.name)){o.userData.artworkFacingFade=[.35,.70];o.userData.artworkMinY=radio?439:460;}
   else o.userData.skipOriginalPaint=true;
  }
  require('./project-model-artwork.cjs')(T,k,g,part.part.pivot);
  if(part!==head)for(const o of [...g.children])if(o.isMesh&&!o.material?.userData.originalTexture)ink(T,k,o,radio?'#ae741d':'#bd5d68',.007);
 }
 for(const n of radio?['RadioCaseSolid','RadioAntennaBaseSolid','RadioAntennaSolid']:['SackBodySolid','SackGatheredTopSolid'])ink(T,k,head.group.getObjectByName(n),radio?'#a56c25':'#a21629',.007);
};
