"use strict";
module.exports=function(T,k,id,parts){
 if(id!=='theme-tulip')return;
 for(const[name,part]of parts){
  const g=part.group;
  if(name==='Head'){
   for(const o of g.children)if(o.material?.userData.originalTexture){
    const p=o.geometry.attributes.position,n=o.geometry.attributes.normal,c=o.geometry.attributes.color;
    if(c)for(let i=0;i<c.count;i++){
     const x=p.getX(i)/.005+part.part.pivot[0],y=part.part.pivot[1]-p.getY(i)/.005;
     const facing=o.name.startsWith('SourceTulipPetal')?n.getZ(i)/Math.max(.001,Math.hypot(n.getX(i),n.getZ(i))):n.getZ(i);
     if(((x-320)/109)**2+((y-296)/91)**2>1)c.setW(i,c.getW(i)*Math.max(0,Math.min(1,(facing-.4)/.35)));
     // The geometric yellow rim owns the top edge. Source ink projected onto
     // mismatched rear tips made a ragged dark border around the open cup.
     if(o.name.startsWith('SourceTulipPetal')){const t=(Math.floor(i/37)%41)/40;c.setW(i,c.getW(i)*Math.max(0,Math.min(1,(1-t)/.05)));}
    }
   }
   continue;
  }
  for(const o of [...g.children])if(o.material?.userData.originalTexture||o.name.endsWith('InkShell'))g.remove(o);
  for(const o of g.children)if(o.isMesh&&!o.userData.skipOriginalPaint){
   if(name==='Torso'){o.userData.artworkFacingFade=[.4,.75];o.userData.artworkMinY=461;}
   else o.userData.skipOriginalPaint=true;
  }
  require('./project-model-artwork.cjs')(T,k,g,part.part.pivot);
  for(const o of [...g.children])if(o.isMesh&&!o.material?.userData.originalTexture)require('./solid-ink-shell.cjs')(T,k,o,'#9a3852',.006);
 }
};
