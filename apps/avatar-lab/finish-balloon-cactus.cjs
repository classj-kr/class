"use strict";
module.exports=function(T,k,id,parts){
 if(!['theme-balloons','theme-cactus'].includes(id))return;
 for(const [name,part]of parts){
  if(name==='Head')continue;
  const g=part.group;
  for(const o of [...g.children])if(o.material?.userData.originalTexture)g.remove(o);
  for(const o of g.children)if(o.isMesh){
   if(name==='Torso'&&!o.name.endsWith('InkShell')){o.userData.artworkFacingFade=[.35,.70];o.userData.artworkMinY=450;}
   else o.userData.skipOriginalPaint=true;
  }
  require('./project-model-artwork.cjs')(T,k,g,part.part.pivot);
 }
};
