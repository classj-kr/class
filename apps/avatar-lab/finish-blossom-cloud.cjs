"use strict";
module.exports=function(T,k,id,parts){
 if(!['theme-cherry-blossom','theme-cloud'].includes(id))return;
 const cloud=id==='theme-cloud';
 for(const [name,part]of parts){
  if(name==='Head'&&!cloud)continue;
  const g=part.group;
  for(const o of [...g.children])if(o.material?.userData.originalTexture||o.name==='CloudContour')g.remove(o);
  for(const o of g.children)if(o.isMesh&&!o.userData.skipOriginalPaint){
   if(name==='Head')o.userData.artworkFacingFade=[.40,.75];
   else if(name==='Torso'){o.userData.artworkFacingFade=[.35,.70];o.userData.artworkMinY=cloud?425:450;}
   else o.userData.skipOriginalPaint=true;
  }
  require('./project-model-artwork.cjs')(T,k,g,part.part.pivot);
 }
 if(cloud){
  const h=parts.get('Head'),solid=h.group.getObjectByName('ContinuousCloud'),paint=h.group.getObjectByName('ContinuousCloudOriginalPaint');
  const edge=new T.CatmullRomCurve3(solid.userData.sourceContour.map(([x,y])=>new T.Vector3(x,y,0)),true,'centripetal').getSpacedPoints(256);
  const p=paint.geometry.attributes.position,c=paint.geometry.attributes.color;
  for(let i=0;i<p.count;i++){
   const x=p.getX(i)/.005+h.part.pivot[0],y=h.part.pivot[1]-p.getY(i)/.005;let d=Infinity;
   for(let j=0;j<edge.length-1;j++){const a=edge[j],b=edge[j+1],dx=b.x-a.x,dy=b.y-a.y,t=Math.max(0,Math.min(1,((x-a.x)*dx+(y-a.y)*dy)/(dx*dx+dy*dy)));d=Math.min(d,Math.hypot(x-a.x-t*dx,y-a.y-t*dy));}
   const t=Math.max(0,Math.min(1,(d-5)/14));c.setW(i,c.getW(i)*t*t*(3-2*t));
  }
  require('./solid-ink-shell.cjs')(T,k,solid,'#879aaa',.024);
 }
};
