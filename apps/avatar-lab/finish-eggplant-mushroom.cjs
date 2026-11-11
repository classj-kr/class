"use strict";
module.exports=function(T,k,id,parts){
 if(!['vegetable-eggplant','vegetable-mushroom'].includes(id))return;
 const mushroom=id==='vegetable-mushroom';
 for(const[name,part]of parts){
  const g=part.group;
  if(name==='Head'){
   for(const o of g.children)if(o.material?.userData.originalTexture){
    const p=o.geometry.attributes.position,n=o.geometry.attributes.normal,c=o.geometry.attributes.color;
    if(c)for(let i=0;i<c.count;i++){
     const x=p.getX(i)/.005+part.part.pivot[0],y=part.part.pivot[1]-p.getY(i)/.005,f=mushroom?[320,338,115,86]:[320,332,105,84];
     const facing=o.name==='MushroomDomeSolidOriginalPaint'?n.getZ(i)/Math.max(.00001,Math.hypot(n.getX(i),n.getZ(i))):n.getZ(i);
     const rimSpot=o.name==='MushroomDomeSolidOriginalPaint'&&((x-512)/23)**2+((y-214)/34)**2<1;
     if(!rimSpot&&((x-f[0])/f[2])**2+((y-f[1])/f[3])**2>1)c.setW(i,c.getW(i)*Math.max(0,Math.min(1,(facing-.40)/.35)));
    }
   }
   continue;
  }
  for(const o of [...g.children])if(o.material?.userData.originalTexture||o.name.endsWith('InkShell'))g.remove(o);
  for(const o of g.children)if(o.isMesh&&!o.userData.skipOriginalPaint){
   if(name==='Torso'){o.userData.artworkFacingFade=[.4,.75];o.userData.artworkMinY=438;}
   else o.userData.skipOriginalPaint=true;
  }
  require('./project-model-artwork.cjs')(T,k,g,part.part.pivot);
  for(const o of [...g.children])if(o.isMesh&&!o.material?.userData.originalTexture)require('./solid-ink-shell.cjs')(T,k,o,mushroom?'#8b6243':'#482450',.006);
 }
};
