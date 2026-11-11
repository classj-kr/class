"use strict";
module.exports=function(T,k,id,parts){
 if(!['animal-ratsnake','animal-viper'].includes(id))return;
 const trunk=parts.get('SnakeTrunk');
 for(const art of trunk.group.children.filter(o=>o.isMesh&&o.material.userData.originalTexture)){
  const p=art.geometry.attributes.position,c=art.geometry.attributes.color;if(!c)continue;
  for(let i=0;i<p.count;i++){const y=trunk.part.pivot[1]-p.getY(i)/.005;c.setW(i,c.getW(i)*Math.max(0,Math.min(1,((id==='animal-viper'?485:510)-y)/12)));}
 }
};
