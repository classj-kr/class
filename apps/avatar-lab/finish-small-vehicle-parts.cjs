"use strict";
// Preserve front uniform marks while keeping their ink off side-facing surfaces.
module.exports=function(T,k,tools){
 for(const s of tools){
  const g=s.parent;
  if(g.name==='Head')continue;
  for(const o of g.children)if(o.material?.userData.originalTexture){
   const n=o.geometry.attributes.normal,c=o.geometry.attributes.color;
   if(c)for(let i=0;i<c.count;i++)c.setW(i,c.getW(i)*Math.max(0,Math.min(1,(n.getZ(i)-.4)/.35)));
  }
  for(const o of [...g.children])if(o.name.endsWith('InkShell'))g.remove(o);
  for(const o of [...g.children])if(o.isMesh&&o.name.endsWith('Solid')&&!o.material?.userData.originalTexture)require('./solid-ink-shell.cjs')(T,k,o,g.name==='RocketExhaust'?'#d26613':'#67352e',.006);
 }
};
