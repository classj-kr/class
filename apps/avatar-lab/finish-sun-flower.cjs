"use strict";
module.exports=function(T,k,id,parts){
 if(!['theme-sun','theme-sunflower'].includes(id))return;
 const flower=id==='theme-sunflower';
 for(const[name,part]of parts){
  const g=part.group;
  if(name==='Head'){
   for(const o of g.children)if(o.material?.userData.originalTexture){
    const p=o.geometry.attributes.position,n=o.geometry.attributes.normal,c=o.geometry.attributes.color;
    if(c)for(let i=0;i<c.count;i++){
     const x=p.getX(i)/.005+part.part.pivot[0],y=part.part.pivot[1]-p.getY(i)/.005,f=flower?[319,299,107,90]:[320,318,106,92];
     if(((x-f[0])/f[2])**2+((y-f[1])/f[3])**2>1)c.setW(i,c.getW(i)*Math.max(0,Math.min(1,(n.getZ(i)-.40)/.35)));
    }
   }
   if(!flower){const ring=g.getObjectByName('SunDiskContour');if(ring)g.remove(ring);require('./solid-ink-shell.cjs')(T,k,g.getObjectByName('SunDiskSolid'),'#b45619',.008);}
   continue;
  }
  for(const o of [...g.children])if(o.material?.userData.originalTexture||o.name.endsWith('InkShell'))g.remove(o);
  for(const o of g.children)if(o.isMesh&&!o.userData.skipOriginalPaint){
   if(name==='Torso'){o.userData.artworkFacingFade=[.4,.75];o.userData.artworkMinY=flower?453:435;}
   else o.userData.skipOriginalPaint=true;
  }
  require('./project-model-artwork.cjs')(T,k,g,part.part.pivot);
  for(const o of [...g.children])if(o.isMesh&&!o.material?.userData.originalTexture&&!o.name.includes('HiddenJoin'))require('./solid-ink-shell.cjs')(T,k,o,flower?'#365e2e':'#b45619',.006);
 }
};
