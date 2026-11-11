"use strict";
module.exports=function(T,k,id,parts){
 if(!['theme-snowman','theme-star'].includes(id))return;
 const snow=id==='theme-snowman';
 for(const [name,part]of parts){
  const g=part.group;
  if(name==='Head'){
   // Retain the face and the existing cutout masks; fade only the oblique
   // projection that otherwise stretches the source silhouette into a seam.
   for(const o of g.children)if(o.material?.userData.originalTexture){
    const p=o.geometry.attributes.position,n=o.geometry.attributes.normal,c=o.geometry.attributes.color;
    if(c)for(let i=0;i<c.count;i++){
     const x=p.getX(i)/.005+part.part.pivot[0],y=part.part.pivot[1]-p.getY(i)/.005,f=snow?[318,293,118,96]:[320,318,106,92];
     if(!snow&&y>408&&x>242&&x<399)c.setW(i,c.getW(i)*Math.max(0,Math.min(1,(418-y)/10)));
     if(((x-f[0])/f[2])**2+((y-f[1])/f[3])**2>1)c.setW(i,c.getW(i)*Math.max(0,Math.min(1,(n.getZ(i)-.40)/.35)));
    }
   }
   // The rounded concave star keeps its actual silhouette. A normal-offset
   // outline can invert the narrow triangles at an inward notch.
   continue;
  }
  for(const o of [...g.children])if(o.material?.userData.originalTexture||o.name.endsWith('InkShell'))g.remove(o);
  for(const o of g.children)if(o.isMesh&&!o.userData.skipOriginalPaint){
   if(name==='Torso'){o.userData.artworkFacingFade=[.4,.75];o.userData.artworkMinY=428;}
   else o.userData.skipOriginalPaint=true;
  }
  require('./project-model-artwork.cjs')(T,k,g,part.part.pivot);
  for(const o of [...g.children])if(o.isMesh&&!o.material?.userData.originalTexture)require('./solid-ink-shell.cjs')(T,k,o,'#bd852b',.006);
 }
};
