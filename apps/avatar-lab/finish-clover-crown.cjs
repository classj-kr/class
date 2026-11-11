"use strict";
module.exports=function(T,k,id,parts){
 if(!['theme-clover','theme-crown'].includes(id))return;
 for(const [name,part]of parts){
  const g=part.group;
  for(const o of [...g.children])if(o.material?.userData.originalTexture)g.remove(o);
  for(const o of g.children)if(o.isMesh&&!o.userData.skipOriginalPaint){
   if(name==='Head')o.userData.artworkFacingFade=[.45,.80];
   else if(name==='Torso'){o.userData.artworkFacingFade=[.35,.70];o.userData.artworkMinY=445;}
   else o.userData.skipOriginalPaint=true;
  }
  require('./project-model-artwork.cjs')(T,k,g,part.part.pivot);
  if(name!=='Head'&&id==='theme-crown')for(const o of [...g.children])if(o.isMesh&&!o.material?.userData.originalTexture)require('./solid-ink-shell.cjs')(T,k,o,'#a67534',.007);
 }
};
