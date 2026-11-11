"use strict";
module.exports=function(T,k,id,parts){
 if(!['theme-maple-leaf','theme-moon'].includes(id))return;
 const moon=id==='theme-moon';
 for(const [name,part]of parts){
  const g=part.group;
  if(name==='Head'&&!moon){
   const shell=g.getObjectByName('MapleLeafSolidInkShell');if(shell)g.remove(shell);
   const solid=g.getObjectByName('MapleLeafSolid'),p=solid.geometry.attributes.position,edge=[];
   for(let i=0;i<192;i++)edge.push(new T.Vector3().fromBufferAttribute(p,i));
   const rim=k.mesh('MapleLeafRim',new T.TubeGeometry(new T.CatmullRomCurve3(edge,true,'centripetal'),384,.012,8,true),k.solid('MapleRimInk','#8a281f'),g);rim.userData.skipOriginalPaint=true;
   for(const o of g.children)if(o.material?.userData.originalTexture){
    const n=o.geometry.attributes.normal,c=o.geometry.attributes.color;
    if(c)for(let i=0;i<c.count;i++)c.setW(i,c.getW(i)*Math.max(0,Math.min(1,(n.getZ(i)-.4)/.35)));
   }
   continue;
  }
  for(const o of [...g.children])if(o.material?.userData.originalTexture||o.name==='CrescentContour')g.remove(o);
  for(const o of g.children)if(o.isMesh&&!o.userData.skipOriginalPaint){
   if(name==='Head')o.userData.artworkFacingFade=[.40,.75];
   else if(name==='Torso'){o.userData.artworkFacingFade=[.35,.70];o.userData.artworkMinY=moon?442:450;}
   else o.userData.skipOriginalPaint=true;
  }
  require('./project-model-artwork.cjs')(T,k,g,part.part.pivot);
  if(moon)for(const o of [...g.children])if(o.isMesh&&!o.material?.userData.originalTexture&&!o.userData.skipOriginalPaint)require('./solid-ink-shell.cjs')(T,k,o,'#b87e2c',name==='Head'?.012:.007);
 }
};
