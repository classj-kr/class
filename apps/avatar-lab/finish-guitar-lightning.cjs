"use strict";
module.exports=function(T,k,id,parts){
 if(!['theme-guitar','theme-lightning'].includes(id))return;
 const guitar=id==='theme-guitar';
 for(const [name,part]of parts){
  const g=part.group;
  if(name==='Head'){
   if(guitar)for(const o of g.children)if(o.material?.userData.originalTexture){
    const p=o.geometry.attributes.position,n=o.geometry.attributes.normal,c=o.geometry.attributes.color;if(!c)continue;
    for(let i=0;i<p.count;i++){
     const x=p.getX(i)/.005+part.part.pivot[0],y=part.part.pivot[1]-p.getY(i)/.005;
     if(((x-284)/96)**2+((y-299)/81)**2<1)continue;
     const t=Math.max(0,Math.min(1,(n.getZ(i)-.4)/.35));c.setW(i,c.getW(i)*t);
    }
   }
   continue;
  }
  for(const o of [...g.children])if(o.material?.userData.originalTexture)g.remove(o);
  for(const o of [...g.children])if(o.isMesh&&!o.userData.skipOriginalPaint){
   o.userData.skipOriginalPaint=true;
   if(!guitar)require('./solid-ink-shell.cjs')(T,k,o,'#3e7180',.008);
  }
 }
};
