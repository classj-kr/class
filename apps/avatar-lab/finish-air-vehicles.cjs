"use strict";
// Keep source identity on the hood; remove printed limb edges from side views.
module.exports=function(T,k,tools,kind){
 for(const s of tools){
  const g=s.parent,name=g.name;
  if(name==='Head'){
   for(const o of g.children)if(o.material?.userData.originalTexture){
    const p=o.geometry.attributes.position,n=o.geometry.attributes.normal,c=o.geometry.attributes.color;
    if(!c)continue;
    for(let i=0;i<c.count;i++){
     const x=p.getX(i)/.005+s.pivot[0],y=s.pivot[1]-p.getY(i)/.005;
     const f=kind==='airplane'?[318,297,112,88]:[260,280,88,79];
     const face=((x-f[0])/f[2])**2+((y-f[1])/f[3])**2<1;
     const cockpit=kind==='airplane'&&x>235&&x<402&&y>145&&y<205;
     if(!face&&!cockpit)c.setW(i,c.getW(i)*Math.max(0,Math.min(1,(n.getZ(i)-.25)/.35)));
    }
   }
   continue;
  }
  if(!['Torso','LeftArm','RightArm','LeftLeg','RightLeg'].includes(name))continue;
  for(const o of [...g.children])if(o.material?.userData.originalTexture||o.name.endsWith('InkShell'))g.remove(o);
  for(const o of g.children)if(o.isMesh&&!o.userData.skipOriginalPaint){
   if(name==='Torso'){o.userData.artworkFacingFade=[.4,.75];o.userData.artworkMinY=412;}
   else o.userData.skipOriginalPaint=true;
  }
  require('./project-model-artwork.cjs')(T,k,g,s.pivot);
  for(const o of [...g.children])if(o.isMesh&&!o.material?.userData.originalTexture)require('./solid-ink-shell.cjs')(T,k,o,kind==='airplane'?'#67484b':'#67313d',.006);
 }
};
