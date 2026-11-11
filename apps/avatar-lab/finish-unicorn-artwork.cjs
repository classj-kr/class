"use strict";
module.exports=function(T,k,id,parts){
 if(id!=='animal-unicorn')return;
 const head=parts.get('Head');
 for(const name of ['UnicornManeBlueSolid','UnicornManePinkSolid']){
  const solid=head.group.getObjectByName(name),art=head.group.getObjectByName(name+'OriginalPaint'),half=solid.geometry.attributes.position.count/2,ix=art.geometry.index,indices=[],c=art.geometry.attributes.color,n=art.geometry.attributes.normal;
  for(let i=0;i<ix.count;i+=3){const v=[ix.getX(i),ix.getX(i+1),ix.getX(i+2)];if(v.every(j=>j<half))indices.push(...v);}
  art.geometry.setIndex(indices);
  for(let i=0;i<half;i++)c.setW(i,Math.max(0,Math.min(1,(n.getZ(i)-.03)/.12)));
 }
};
