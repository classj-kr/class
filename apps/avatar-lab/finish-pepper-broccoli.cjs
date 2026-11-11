"use strict";
module.exports=function(T,k,id,parts){
 if(!['vegetable-bell-pepper','vegetable-broccoli'].includes(id))return;
 const broccoli=id==='vegetable-broccoli',ink=broccoli?'#476e2c':'#8a281f';
 for(const[name,part]of parts){
  const g=part.group;
  if(name==='Head'){
   if(broccoli)for(const o of [...g.children])if(o.material?.userData.originalTexture&&/BroccoliSupportingBranch|BroccoliCrownBridge/.test(o.name))g.remove(o);
   for(const o of g.children)if(o.material?.userData.originalTexture){
    const p=o.geometry.attributes.position,n=o.geometry.attributes.normal,c=o.geometry.attributes.color;
    if(c)for(let i=0;i<c.count;i++){
     const x=p.getX(i)/.005+part.part.pivot[0],y=part.part.pivot[1]-p.getY(i)/.005,f=broccoli?[320,330,108,87]:[320,316,114,94];
     if(((x-f[0])/f[2])**2+((y-f[1])/f[3])**2>1)c.setW(i,c.getW(i)*Math.max(0,Math.min(1,(n.getZ(i)-.40)/.35)));
    }
   }
   continue;
  }
  for(const o of [...g.children])if(o.material?.userData.originalTexture||o.name.endsWith('InkShell'))g.remove(o);
  for(const o of g.children)if(o.isMesh&&!o.userData.skipOriginalPaint){
   if(name==='Torso'){o.userData.artworkFacingFade=[.4,.75];o.userData.artworkMinY=broccoli?448:453;}
   else o.userData.skipOriginalPaint=true;
  }
  require('./project-model-artwork.cjs')(T,k,g,part.part.pivot);
  for(const o of [...g.children])if(o.isMesh&&!o.material?.userData.originalTexture)require('./solid-ink-shell.cjs')(T,k,o,ink,.006);
 }
};
