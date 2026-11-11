"use strict";
module.exports=function(T,k,id,parts){
 if(!['fruit-peach','fruit-persimmon'].includes(id))return;
 const peach=id==='fruit-peach',head=parts.get('Head'),g=head.group,ink=require('./solid-ink-shell.cjs'),prefix=peach?'FinishedPeach':'FinishedPersimmon',color=peach?'#f4979b':'#ff8b1d';
 for(const o of [...g.children])if(o.material?.userData.originalTexture)g.remove(o);
 const fruit=g.getObjectByName(peach?'PeachFruitSolid':'PersimmonFruitSolid');fruit.userData.artworkFacingFade=[.35,.70];fruit.material.color.set(color).convertSRGBToLinear();
 if(peach)for(const o of g.children)if(/^PeachLeaf(Left|Right)Solid$/.test(o.name)||o.name.startsWith('PeachRearLeafVein')){o.geometry.translate(0,0,.26);o.geometry.computeBoundingBox();o.geometry.computeBoundingSphere();}
 for(const name of ['Torso','LeftArm','RightArm','LeftLeg','RightLeg']){
  const part=parts.get(name),left=name.startsWith('Left');part.group.clear();let ps,center,depth;
  if(name==='Torso'){ps=[[258,419],[382,419],[389,463],[382,502],[360,532],[320,542],[280,532],[258,502],[251,463]];center=[320,480];depth=.28;}
  else if(name.endsWith('Arm')){ps=[[251,421],[269,435],[254,468],[247,495],[233,507],[218,502],[215,485],[225,453],[240,430]].map(([x,y])=>[left?x:640-x,y]);center=[left?241:399,463];depth=.12;}
  else{ps=[[273,525],[308,533],[306,552],[300,573],[282,579],[260,573],[257,561],[266,541]].map(([x,y])=>[left?x:640-x,y]);center=[left?283:357,552];depth=.145;}
  const n=prefix+name;k.volume(n,ps,center,part.part.pivot,depth,depth,part.group,k.solid(n+'Color',color),{art:false,samples:96});require('./smooth-paired-volume.cjs')(T,k,part.group,n,{rings:24});
  for(const suffix of ['Surface','Back']){const o=part.group.getObjectByName(n+suffix);o.userData.artworkFacingFade=[.35,.70];if(name!=='Torso')o.userData.skipOriginalPaint=true;else o.userData.artworkMinY=peach?445:441;}
  part.group.userData.directSurfaceArtwork=true;part.group.userData.artworkOpaqueRegions=[];require('./sculpt-kit.cjs')(T,k,part).paint();for(const suffix of ['Surface','Back'])ink(T,k,part.group.getObjectByName(n+suffix),peach?'#ba6165':'#bd6315',.007);
 }
 g.userData.artworkOcclusion=true;g.userData.artworkOpaqueRegions=[{cx:320,cy:peach?307:298,rx:118,ry:99}];require('./project-model-artwork.cjs')(T,k,g,head.part.pivot);ink(T,k,fruit,peach?'#b76266':'#b95a13',.007);
};
