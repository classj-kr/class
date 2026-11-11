"use strict";
module.exports=function(T,k,id,parts){
 if(!['vegetable-carrot','vegetable-corn'].includes(id))return;
 const corn=id==='vegetable-corn';
 for(const[name,part]of parts){
  const g=part.group;
  if(name==='Head'){
   for(const o of g.children)if(o.material?.userData.originalTexture){
    const p=o.geometry.attributes.position,n=o.geometry.attributes.normal,c=o.geometry.attributes.color;
    if(c)for(let i=0;i<c.count;i++){
     const x=p.getX(i)/.005+part.part.pivot[0],y=part.part.pivot[1]-p.getY(i)/.005,f=corn?[320,311,108,87]:[320,347,105,84];
     if(((x-f[0])/f[2])**2+((y-f[1])/f[3])**2>1)c.setW(i,c.getW(i)*Math.max(0,Math.min(1,(n.getZ(i)-.40)/.35)));
    }
   }
   continue;
  }
  for(const o of [...g.children])if(o.material?.userData.originalTexture||o.name.endsWith('InkShell'))g.remove(o);
  for(const o of [...g.children])if(o.isMesh){o.userData.skipOriginalPaint=true;require('./solid-ink-shell.cjs')(T,k,o,corn?'#627b27':'#9b4d1f',.006);}
 }
};
