"use strict";
module.exports=function(T,k,id,parts){
 if(id!=='fruit-watermelon')return;
 const head=parts.get('Head'),g=head.group,ink=require('./solid-ink-shell.cjs');head.skipNeckJoin=true;
 for(const o of [...g.children])if(o.material?.userData.originalTexture)g.remove(o);
 const flesh=g.getObjectByName('WatermelonSliceSolid'),rind=g.getObjectByName('WatermelonRindSolid');
 flesh.material.color.set('#ff373a').convertSRGBToLinear();flesh.userData.artworkFacingFade=[.35,.70];
 rind.material.color.set('#32712c').convertSRGBToLinear();rind.userData.artworkFacingFade=[.35,.70];
 for(const o of g.children)if(o.name.startsWith('WatermelonRearSeed'))o.material.color.set('#542014').convertSRGBToLinear();
 g.userData.artworkOpaqueRegions=[{cx:320,cy:316,rx:116,ry:99}];require('./project-model-artwork.cjs')(T,k,g,head.part.pivot);
 ink(T,k,flesh,'#96342a',.007);ink(T,k,rind,'#234f22',.007);
 for(const name of ['Torso','LeftArm','RightArm','LeftLeg','RightLeg']){
  const part=parts.get(name),left=name.startsWith('Left');part.group.clear();let ps,center,depth;
  if(name==='Torso'){ps=[[262,437],[378,437],[386,472],[380,510],[360,539],[321,545],[281,539],[261,513],[254,481]];center=[320,489];depth=.29;}
  else if(name.endsWith('Arm')){ps=[[252,438],[268,447],[261,475],[250,500],[243,513],[228,512],[218,503],[218,488],[228,461],[240,442]].map(([x,y])=>[left?x:640-x,y]);center=[left?242:398,478];depth=.13;}
  else{ps=[[272,525],[309,530],[311,550],[306,569],[293,578],[273,578],[261,571],[261,561],[268,548]].map(([x,y])=>[left?x:640-x,y]);center=[left?284:356,553];depth=.16;}
  const n='FinishedWatermelon'+name;k.volume(n,ps,center,part.part.pivot,depth,depth,part.group,k.solid(n+'Color','#438a32'),{art:false,samples:96});require('./smooth-paired-volume.cjs')(T,k,part.group,n,{rings:24});
  for(const suffix of ['Surface','Back']){const o=part.group.getObjectByName(n+suffix);o.userData.artworkFacingFade=[.35,.70];if(name!=='Torso')o.userData.skipOriginalPaint=true;else o.userData.artworkMinY=458;}
  part.group.userData.directSurfaceArtwork=true;require('./sculpt-kit.cjs')(T,k,part).paint();
  for(const suffix of ['Surface','Back'])ink(T,k,part.group.getObjectByName(n+suffix),'#2b5929',.007);
 }
};
