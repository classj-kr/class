"use strict";
module.exports=function(T,k,id,parts){
 if(!['theme-music-note','theme-paper-airplane'].includes(id))return;
 const paper=id==='theme-paper-airplane';
 for(const [name,part]of parts){
  const g=part.group;
  if(name==='Head'){
   for(const o of g.children)if(o.material?.userData.originalTexture){
    const n=o.geometry.attributes.normal,p=o.geometry.attributes.position,c=o.geometry.attributes.color;
    if(c)for(let i=0;i<c.count;i++){
     const x=p.getX(i)/.005+part.part.pivot[0],y=part.part.pivot[1]-p.getY(i)/.005;
     const f=paper?[315,234,112,91]:[282,325,103,91];
     if(((x-f[0])/f[2])**2+((y-f[1])/f[3])**2>1)c.setW(i,c.getW(i)*Math.max(0,Math.min(1,(n.getZ(i)-.4)/.35)));
    }
   }
   if(paper){const shell=g.getObjectByName('PaperPilotHoodSolidInkShell');if(shell)g.remove(shell);require('./solid-ink-shell.cjs')(T,k,g.getObjectByName('PaperPilotHoodSolid'),'#626a78',.015);}
   continue;
  }
  for(const o of [...g.children])if(o.material?.userData.originalTexture||o.name.endsWith('InkShell'))g.remove(o);
  for(const o of g.children)if(o.isMesh&&!o.userData.skipOriginalPaint){
   if(name==='Torso'){o.userData.artworkFacingFade=[.4,.75];o.userData.artworkMinY=paper?451:434;}
   else o.userData.skipOriginalPaint=true;
  }
  require('./project-model-artwork.cjs')(T,k,g,part.part.pivot);
  for(const o of [...g.children])if(o.isMesh&&!o.material?.userData.originalTexture&&!o.name.includes('HiddenJoin'))require('./solid-ink-shell.cjs')(T,k,o,paper?'#626a78':'#29272c',.006);
 }
};
