"use strict";
module.exports=function(T,k,id,parts){
 if(!['fruit-apple','fruit-avocado'].includes(id))return;
 const apple=id==='fruit-apple',head=parts.get('Head'),g=head.group,ink=require('./solid-ink-shell.cjs');for(const o of [...g.children])if(o.material?.userData.originalTexture)g.remove(o);
 const fruit=g.getObjectByName(apple?'AppleFruitSolid':'AvocadoHalfSolid');fruit.userData.artworkFacingFade=[.35,.70];
 if(apple){
  for(const name of ['Torso','LeftArm','RightArm','LeftLeg','RightLeg']){const part=parts.get(name),left=name.startsWith('Left');part.group.clear();let ps,center,depth;
   if(name==='Torso'){ps=[[258,419],[382,419],[389,463],[382,502],[360,532],[320,542],[280,532],[258,502],[251,463]];center=[320,480];depth=.28;}
   else if(name.endsWith('Arm')){ps=[[251,419],[269,435],[254,468],[247,495],[233,507],[218,502],[215,485],[225,453],[240,430]].map(([x,y])=>[left?x:640-x,y]);center=[left?241:399,463];depth=.12;}
   else{ps=[[273,525],[308,533],[306,552],[300,573],[282,579],[260,573],[257,561],[266,541]].map(([x,y])=>[left?x:640-x,y]);center=[left?283:357,552];depth=.145;}
   const name2='FinishedApple'+name;k.volume(name2,ps,center,part.part.pivot,depth,depth,part.group,k.solid(name2+'Color','#e3352b'),{art:false,samples:96});require('./smooth-paired-volume.cjs')(T,k,part.group,name2,{rings:24});for(const suffix of ['Surface','Back']){const o=part.group.getObjectByName(name2+suffix);o.userData.artworkFacingFade=[.35,.70];if(name!=='Torso')o.userData.skipOriginalPaint=true;else o.userData.artworkMinY=442;}
   part.group.userData.directSurfaceArtwork=true;part.group.userData.artworkOpaqueRegions=[];require('./sculpt-kit.cjs')(T,k,part).paint();for(const suffix of ['Surface','Back'])ink(T,k,part.group.getObjectByName(name2+suffix),'#9d2520',.008);
  }
 }else{
  const tip=g.getObjectByName('AvocadoBottomTipSolid');tip.geometry.translate(.145,.035,-.30);tip.geometry.computeBoundingBox();tip.geometry.computeBoundingSphere();
  const p=fruit.geometry.attributes.position;for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i);if(z<-.08){const ripple=.004*Math.sin(x*39+y*17)*Math.sin(y*43-z*21);p.setZ(i,z+ripple);}}fruit.geometry.computeVertexNormals();fruit.geometry.computeBoundingBox();fruit.geometry.computeBoundingSphere();
 }
 g.userData.artworkOcclusion=true;g.userData.artworkOpaqueRegions=[{cx:320,cy:apple?320:331,rx:119,ry:100}];require('./project-model-artwork.cjs')(T,k,g,head.part.pivot);
 if(!apple){const p=fruit.geometry.attributes.position,boundary=[];for(let i=p.count/2-96;i<p.count/2;i++)boundary.push([p.getX(i)/.005+head.part.pivot[0],head.part.pivot[1]-p.getY(i)/.005]);const art=g.getObjectByName('AvocadoHalfSolidOriginalPaint'),ap=art.geometry.attributes.position,c=art.geometry.attributes.color;for(let i=0;i<ap.count;i++){const x=ap.getX(i)/.005+head.part.pivot[0],y=head.part.pivot[1]-ap.getY(i)/.005;let d=Infinity;for(const[bx,by]of boundary)d=Math.min(d,Math.hypot(x-bx,y-by));c.setW(i,c.getW(i)*T.MathUtils.smoothstep(d,3,11));}}
 ink(T,k,fruit,apple?'#9f2622':'#38571d',.007);
};
