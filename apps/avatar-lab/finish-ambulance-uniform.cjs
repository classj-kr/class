"use strict";
// Keep the jacket's front insignia; avoid stretching its printed seams onto limbs.
module.exports=function(T,k,tools){
 for(const s of tools){
  const g=s.parent;
  if(!['Torso','LeftArm','RightArm','LeftLeg','RightLeg'].includes(g.name))continue;
  for(const o of [...g.children])if(o.material?.userData.originalTexture||o.name.endsWith('InkShell'))g.remove(o);
  for(const o of g.children)if(o.isMesh){
   if(g.name==='Torso'){o.userData.artworkFacingFade=[.4,.75];o.userData.artworkMinY=408;}
   else o.userData.skipOriginalPaint=true;
  }
  require('./project-model-artwork.cjs')(T,k,g,s.pivot);
  for(const o of [...g.children])if(o.isMesh&&!o.material?.userData.originalTexture)require('./solid-ink-shell.cjs')(T,k,o,'#5b343a',.006);
 }
};
