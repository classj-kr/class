"use strict";
module.exports=function(T,k,id,parts){
 if(!['vegetable-potato','vegetable-pumpkin'].includes(id))return;
 const pumpkin=id==='vegetable-pumpkin';
 for(const[name,part]of parts){
  const g=part.group;
  if(name==='Head'){
   for(const o of g.children)if(o.material?.userData.originalTexture){
    const p=o.geometry.attributes.position,n=o.geometry.attributes.normal,c=o.geometry.attributes.color;
    if(c)for(let i=0;i<c.count;i++){
     const x=p.getX(i)/.005+part.part.pivot[0],y=part.part.pivot[1]-p.getY(i)/.005,f=pumpkin?[320,319,114,94]:[320,300,119,99];
     const facing=pumpkin?n.getZ(i)/Math.max(.00001,Math.hypot(n.getX(i),n.getZ(i))):n.getZ(i);
     if(((x-f[0])/f[2])**2+((y-f[1])/f[3])**2>1)c.setW(i,c.getW(i)*Math.max(0,Math.min(1,(facing-.40)/.35)));
    }
   }
   continue;
  }
  for(const o of [...g.children])if(o.material?.userData.originalTexture||o.name.endsWith('InkShell'))g.remove(o);
  for(const o of g.children)if(o.isMesh&&!o.userData.skipOriginalPaint){
   if(name==='Torso'){o.userData.artworkFacingFade=[.4,.75];o.userData.artworkMinY=453;}
   else o.userData.skipOriginalPaint=true;
  }
  require('./project-model-artwork.cjs')(T,k,g,part.part.pivot);
  for(const o of [...g.children])if(o.isMesh&&!o.material?.userData.originalTexture)require('./solid-ink-shell.cjs')(T,k,o,pumpkin?'#995019':'#79552d',.006);
 }
};
