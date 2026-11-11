"use strict";
module.exports=function(T,k,id,parts){
 if(!['theme-rainbow','theme-rose'].includes(id))return;
 const rose=id==='theme-rose';
 for(const [name,part]of parts){
  if(name==='Head'){if(!rose)for(const o of [...part.group.children])if(o.material?.userData.originalTexture&&o.name.startsWith('RainbowArchBand'))part.group.remove(o);continue;}
  const g=part.group;
  for(const o of [...g.children])if(o.material?.userData.originalTexture||o.name.endsWith('InkShell'))g.remove(o);
  for(const o of g.children)if(o.isMesh&&!o.userData.skipOriginalPaint){
   if(name==='Torso'){o.userData.artworkFacingFade=[.4,.75];o.userData.artworkMinY=rose?445:417;}
   else o.userData.skipOriginalPaint=true;
  }
  require('./project-model-artwork.cjs')(T,k,g,part.part.pivot);
  for(const o of [...g.children])if(o.isMesh&&!o.material?.userData.originalTexture)require('./solid-ink-shell.cjs')(T,k,o,rose?'#365e2e':'#41466e',.006);
 }
};
