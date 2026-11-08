"use strict";
// Preserve the painted front on authored solids. The WebP stays unchanged.
module.exports=function projectModelArtwork(THREE,k,parent,pivot){
 const old=[],surfaces=[];parent.traverse(o=>{if(!o.isMesh)return;if(o.material.userData.originalTexture)old.push(o);else surfaces.push(o);});old.filter(o=>!o.name.startsWith('OriginalFace')).forEach(o=>o.parent.remove(o));
 for(const surface of surfaces){
  if(surface.userData.skipOriginalPaint)continue;
  surface.updateMatrix();const source=surface.geometry.clone().applyMatrix4(surface.matrix),p=source.attributes.position,n=source.attributes.normal,ix=source.index,indices=[];
  for(let i=0;i<(ix?ix.count:p.count);i+=3){const a=ix?ix.getX(i):i,b=ix?ix.getX(i+1):i+1,c=ix?ix.getX(i+2):i+2;if((n.getZ(a)+n.getZ(b)+n.getZ(c))/3>.12)indices.push(a,b,c);}
  if(!indices.length){source.dispose();continue;}
  const uv=[],colors=[];for(let i=0;i<p.count;i++){
   const px=p.getX(i)/.005+pivot[0],py=pivot[1]-p.getY(i)/.005;uv.push(px/640,py/640);
   let alpha=Math.min(1,Math.max(0,(n.getZ(i)-.35)/.35));
   for(const f of parent.userData.originalFaceRegions||[])if(((px-f.cx)/f.rx)**2+((py-f.cy)/f.ry)**2<1.015)alpha=0;
   if(surface.userData.artworkMinY!==undefined)alpha*=Math.min(1,Math.max(0,(py-surface.userData.artworkMinY)/12));
   colors.push(1,1,1,alpha);p.setZ(i,p.getZ(i)+.006);
  }
  source.setIndex(indices);source.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));source.setAttribute('color',new THREE.Float32BufferAttribute(colors,4));
  const art=k.art.clone();art.vertexColors=true;art.transparent=true;art.alphaTest=0;art.depthWrite=false;k.mesh(surface.name+'OriginalPaint',source,art,parent);
 }
};
