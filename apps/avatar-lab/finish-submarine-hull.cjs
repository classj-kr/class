"use strict";
// Keep front illustration detail from stretching around the rounded bow.
module.exports=function(T,k,head){
 for(const o of head.children){
  if(!o.material?.userData.originalTexture)continue;
  const p=o.geometry.attributes.position,n=o.geometry.attributes.normal,c=o.geometry.attributes.color;
  if(!c)continue;
  for(let i=0;i<c.count;i++){
   const x=320+p.getX(i)/.005,y=580-p.getY(i)/.005;
   if(((x-256)/83)**2+((y-348)/82)**2<1)continue;
   c.setW(i,c.getW(i)*Math.max(0,Math.min(1,(n.getZ(i)-.45)/.30)));
  }
 }
};
