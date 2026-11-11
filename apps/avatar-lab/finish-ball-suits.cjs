"use strict";
module.exports=function(T,k,id){
 if(!['sport-baseball','sport-basketball','sport-soccer'].includes(id))return;
 const ink=require('./solid-ink-shell.cjs');
 for(const name of ['Torso','LeftArm','RightArm','LeftLeg','RightLeg']){
  const g=k.root.getObjectByName(name),prefix=name+'Suit';
  for(const o of [...g.children])if(o.material?.userData.originalTexture)g.remove(o);
  require('./smooth-paired-volume.cjs')(T,k,g,prefix,{rings:id==='sport-soccer'?11:24});
  const P=[],I=[];let material;
  for(const suffix of ['Surface','Back']){const o=g.getObjectByName(prefix+suffix),offset=P.length/3;P.push(...o.geometry.attributes.position.array);I.push(...Array.from(o.geometry.index.array,v=>v+offset));material=o.material;g.remove(o);}
  const o=k.mesh(prefix+'Solid',k.geometry(P,I),material,g);
  o.userData.artworkFacingFade=[.35,.70];o.userData.artworkMinY=445;
  if(name!=='Torso')o.userData.skipOriginalPaint=true;
  g.userData.directSurfaceArtwork=true;
  require('./project-model-artwork.cjs')(T,k,g,[320+g.position.x/.005,580-g.position.y/.005]);
  ink(T,k,o,id==='sport-basketball'?'#9c4c20':'#85828d',.007);
 }
};
