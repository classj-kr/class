"use strict";
module.exports=function(T,k,id,parts){
 if(!['fruit-blueberry','fruit-cherry'].includes(id))return;
 const blue=id==='fruit-blueberry',head=parts.get('Head'),g=head.group,ink=require('./solid-ink-shell.cjs');
 for(const o of [...g.children])if(o.material?.userData.originalTexture)g.remove(o);
 const fruit=g.getObjectByName(blue?'BlueberryFruitSolid':'CherryFruitSolid');fruit.userData.artworkFacingFade=[.35,.70];
 fruit.material.color.set(blue?'#5878b6':'#df182e').convertSRGBToLinear();
 if(blue){
  for(const name of ['Torso','LeftArm','RightArm','LeftLeg','RightLeg']){const part=parts.get(name),left=name.startsWith('Left');part.group.clear();let ps,center,depth;
   if(name==='Torso'){ps=[[258,425],[382,425],[389,463],[382,502],[360,531],[320,540],[280,531],[258,502],[251,463]];center=[320,480];depth=.28;}
   else if(name.endsWith('Arm')){ps=[[251,425],[269,435],[254,468],[247,495],[233,506],[218,501],[215,485],[225,453],[240,432]].map(([x,y])=>[left?x:640-x,y]);center=[left?241:399,463];depth=.12;}
   else{ps=[[273,524],[308,531],[306,551],[300,571],[282,576],[260,571],[257,560],[266,540]].map(([x,y])=>[left?x:640-x,y]);center=[left?283:357,550];depth=.145;}
   const n='FinishedBlueberry'+name;k.volume(n,ps,center,part.part.pivot,depth,depth,part.group,k.solid(n+'Color','#5475b7'),{art:false,samples:96});require('./smooth-paired-volume.cjs')(T,k,part.group,n,{rings:24});
   for(const suffix of ['Surface','Back']){const o=part.group.getObjectByName(n+suffix);o.userData.artworkFacingFade=[.35,.70];if(name!=='Torso')o.userData.skipOriginalPaint=true;else o.userData.artworkMinY=445;}
   part.group.userData.directSurfaceArtwork=true;part.group.userData.artworkOpaqueRegions=[];require('./sculpt-kit.cjs')(T,k,part).paint();for(const suffix of ['Surface','Back'])ink(T,k,part.group.getObjectByName(n+suffix),'#273c70',.008);
  }
  const crown=g.getObjectByName('BlueberryCrownSolid');crown.geometry.computeBoundingBox();crown.geometry.computeBoundingSphere();
 }
 g.userData.artworkOcclusion=true;g.userData.artworkOpaqueRegions=[{cx:320,cy:blue?310:451,rx:blue?117:108,ry:blue?98:94}];require('./project-model-artwork.cjs')(T,k,g,head.part.pivot);
 ink(T,k,fruit,blue?'#273c70':'#9c1524',.007);
};
