"use strict";
module.exports=function(T,k,id,parts){
 if(!['object-newspaper','object-pencil'].includes(id))return;
 const paper=id==='object-newspaper',head=parts.get('Head'),ink=require('./solid-ink-shell.cjs');
 for(const part of parts.values()){
  const g=part.group;if(paper&&part!==head)for(const o of g.children)if(o.isMesh&&!o.material?.userData.originalTexture)o.geometry.translate(0,0,-.23);for(const o of [...g.children])if(o.material?.userData.originalTexture)g.remove(o);
  for(const o of g.children)if(o.isMesh){
   if(part===head){if(!o.userData.skipOriginalPaint&&!/Wood|Graphite/.test(o.name))o.userData.artworkFacingFade=[.35,.70];}
   else if(/Torso|Waist/.test(o.name)){o.userData.artworkFacingFade=[.35,.70];o.userData.artworkMinY=paper?449:548;}
   else o.userData.skipOriginalPaint=true;
  }
  require('./project-model-artwork.cjs')(T,k,g,part.part.pivot);
  if(part!==head)for(const o of [...g.children])if(o.isMesh&&!o.material?.userData.originalTexture)ink(T,k,o,paper?'#92838b':o.name.includes('Hand')?'#a86739':'#a9445d',.007);
 }
 if(paper)head.skipNeckJoin=true;
 if(paper)for(const n of ['NewspaperSheetSolid','NewspaperFoldSolid'])ink(T,k,head.group.getObjectByName(n),'#967d72',.007);
};
