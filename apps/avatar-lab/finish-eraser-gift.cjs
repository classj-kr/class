"use strict";
module.exports=function(T,k,id,parts){
 if(!['object-eraser','object-gift'].includes(id))return;
 const eraser=id==='object-eraser',head=parts.get('Head'),ink=require('./solid-ink-shell.cjs');
 for(const part of parts.values()){
  const g=part.group;for(const o of [...g.children])if(o.material?.userData.originalTexture)g.remove(o);
  for(const o of g.children)if(o.isMesh){
   if(part===head){if(!o.userData.skipOriginalPaint)o.userData.artworkFacingFade=[.35,.70];}
   else if(o.name.includes('Torso')){o.userData.artworkFacingFade=[.35,.70];o.userData.artworkMinY=eraser?450:460;}
   else o.userData.skipOriginalPaint=true;
  }
  require('./project-model-artwork.cjs')(T,k,g,part.part.pivot);
  if(part!==head)for(const o of [...g.children])if(o.isMesh&&!o.material?.userData.originalTexture)ink(T,k,o,eraser?'#9b909d':'#3e721d',.007);
 }
 for(const name of eraser?['EraserWhiteSolid','EraserSleeveSolid']:['GiftCaseSolid','GiftLidSolid','GiftBowLoopSolid-1','GiftBowLoopSolid1'])ink(T,k,head.group.getObjectByName(name),eraser?(name==='EraserWhiteSolid'?'#afa5ac':'#1d648b'):(name.startsWith('GiftBow')?'#ac182a':'#b78212'),.006);
};
