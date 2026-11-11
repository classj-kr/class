"use strict";
module.exports=function(T,k,id,parts){
 if(!['object-television','object-watch'].includes(id))return;
 const tv=id==='object-television',head=parts.get('Head'),ink=require('./solid-ink-shell.cjs');
 for(const part of parts.values()){
  const g=part.group;for(const o of [...g.children])if(o.material?.userData.originalTexture)g.remove(o);
  for(const o of g.children)if(o.isMesh){
   if(part===head){if(!o.userData.skipOriginalPaint)o.userData.artworkFacingFade=[.35,.70];}
   else if(/Torso/.test(o.name)){o.userData.artworkFacingFade=[.35,.70];o.userData.artworkMinY=440;}
   else o.userData.skipOriginalPaint=true;
  }
  require('./project-model-artwork.cjs')(T,k,g,part.part.pivot);
  if(part!==head)for(const o of [...g.children])if(o.isMesh&&!o.material?.userData.originalTexture)ink(T,k,o,'#655368',.007);
 }
 for(const n of tv?['TVCaseSolid','TVAntennaBaseSolid','TVAntennaSolid-1','TVAntennaSolid1']:['WatchUpperStrapSolid','WatchLowerStrapSolid','WatchCrownSolid'])ink(T,k,head.group.getObjectByName(n),tv?'#443449':'#955c36',.007);
};
