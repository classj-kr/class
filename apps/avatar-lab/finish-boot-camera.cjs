"use strict";
module.exports=function(T,k,id,parts){
 if(!['object-boot','object-camera'].includes(id))return;
 const boot=id==='object-boot',head=parts.get('Head'),g=head.group,ink=require('./solid-ink-shell.cjs');
 for(const part of parts.values()){
  const group=part.group;for(const o of [...group.children])if(o.material?.userData.originalTexture)group.remove(o);
  for(const o of group.children)if(o.isMesh){
   if(part===head){if(!o.userData.skipOriginalPaint)o.userData.artworkFacingFade=[.35,.70];}
   else if(o.name.includes('Torso')){o.userData.artworkFacingFade=[.35,.70];o.userData.artworkMinY=boot?477:456;}
   else o.userData.skipOriginalPaint=true;
  }
  if(!boot&&part===head)group.userData.artworkOpaqueRegions.push({cx:320,cy:142,rx:48,ry:15});
  require('./project-model-artwork.cjs')(T,k,group,part.part.pivot);
  if(part!==head)for(const o of [...group.children])if(o.isMesh&&!o.material?.userData.originalTexture)ink(T,k,o,boot?'#8e1026':'#4c4045',.007);
 }
 for(const name of boot?['SneakerUpperSolid','SneakerSoleSolid']:['CameraCaseSolid','CameraFlashSolid','CameraShutterSolid','CameraPrismSolid'])ink(T,k,g.getObjectByName(name),boot?'#7f2630':'#494047',.007);
};
