"use strict";
module.exports=function(T,k,id,parts){
 if(!['fruit-grape','fruit-mango'].includes(id))return;
 const grape=id==='fruit-grape',head=parts.get('Head'),g=head.group,ink=require('./solid-ink-shell.cjs');head.lockToBody=true;
 for(const o of [...g.children])if(o.material?.userData.originalTexture)g.remove(o);
 if(grape){
  const face=g.getObjectByName('GrapeWearerSolid');face.position.z+=.17;face.scale.z=.24;face.userData.artworkExcludedRegions=[{cx:276,cy:431,rx:27,ry:34},{cx:364,cy:431,rx:27,ry:34}];
  for(let i=0;i<12;i++){const berry=g.getObjectByName('GrapeBerrySolid'+i);berry.userData.artworkExcludedRegions[0]={cx:320,cy:327,rx:113,ry:93};}
  for(const side of [-1,1]){const a=parts.get(side<0?'LeftArm':'RightArm');for(const o of [...a.group.children])if(o.material?.userData.originalTexture)a.group.remove(o);const hand=a.group.getObjectByName('GrapeRaisedHandSolid'+side);hand.geometry.translate(0,0,.09);hand.geometry.computeBoundingBox();hand.geometry.computeBoundingSphere();require('./sculpt-kit.cjs')(T,k,a).paint();}
  const torso=g.parent.getObjectByName('GrapeTorsoSolid');torso.userData.artworkFacingFade=[.35,.70];
  for(const name of ['LeftLeg','RightLeg']){const part=parts.get(name),left=name==='LeftLeg';part.group.clear();const n='FinishedGrape'+name,ps=[[273,515],[308,523],[306,543],[300,558],[282,565],[266,559],[262,548],[269,530]].map(([x,y])=>[left?x:640-x,y]);k.volume(n,ps,[left?284:356,543],part.part.pivot,.15,.15,part.group,k.solid(n+'Color','#9c5aaf'),{art:false,samples:96});require('./smooth-paired-volume.cjs')(T,k,part.group,n,{rings:24});for(const suffix of ['Surface','Back']){const o=part.group.getObjectByName(n+suffix);o.userData.skipOriginalPaint=true;ink(T,k,o,'#69357a',.007);}}
  g.getObjectByName('GrapeWearerSolid').userData.artworkFacingFade=[.35,.70];
 }else{
  const arm=parts.get('LeftArm');if(arm){arm.group.parent.remove(arm.group);parts.delete('LeftArm');}
  const fruit=g.getObjectByName('MangoFruitSolid');fruit.userData.artworkFacingFade=[.35,.70];fruit.material.color.set('#f5bc19').convertSRGBToLinear();
  const leaf=g.getObjectByName('MangoLeafSolid'),lp=leaf.geometry.attributes.position;for(let i=0;i<lp.count;i++){const y=head.part.pivot[1]-lp.getY(i)/.005;lp.setZ(i,lp.getZ(i)-.25*Math.max(0,Math.min(1,(y-90)/60)));}leaf.geometry.computeVertexNormals();leaf.geometry.computeBoundingBox();leaf.geometry.computeBoundingSphere();
  for(const name of ['RightArm','LeftLeg','RightLeg']){const part=parts.get(name);for(const o of [...part.group.children])if(o.material?.userData.originalTexture)part.group.remove(o);part.group.traverse(o=>{if(o.isMesh){o.userData.skipOriginalPaint=true;o.material.color.set('#f5bc19').convertSRGBToLinear();}});}
  ink(T,k,fruit,'#b67e17',.007);
 }
 g.userData.artworkOcclusion=true;g.userData.artworkOpaqueRegions=[{cx:grape?320:310,cy:grape?327:312,rx:grape?112:115,ry:grape?91:97}];require('./project-model-artwork.cjs')(T,k,g,head.part.pivot);
};
