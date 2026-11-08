"use strict";
// A single sampled front surface avoids projecting the same painted eye onto
// several overlapping costume parts. Opaque authored solids remain underneath.
module.exports=function visibleFrontArtwork(THREE,k,parent,pivot){
 const surfaces=[],old=[];parent.traverse(o=>{if(!o.isMesh)return;if(o.material.userData.originalTexture)old.push(o);else surfaces.push(o);});
 old.filter(o=>!o.name.startsWith('OriginalFace')).forEach(o=>o.parent.remove(o));
 const size=320,depth=new Float32Array(size*size),opacity=new Float32Array(size*size);depth.fill(-Infinity);
 for(const surface of surfaces){
  surface.updateMatrix();const g=surface.geometry.clone().applyMatrix4(surface.matrix),p=g.attributes.position,n=g.attributes.normal,ix=g.index;
  for(let i=0;i<(ix?ix.count:p.count);i+=3){
   const v=[0,1,2].map(j=>{const q=ix?ix.getX(i+j):i+j;return[(p.getX(q)/.005+pivot[0])/2,(pivot[1]-p.getY(q)/.005)/2,p.getZ(q),n.getZ(q)];}),[a,b,c]=v;
   const den=(b[1]-c[1])*(a[0]-c[0])+(c[0]-b[0])*(a[1]-c[1]);if(Math.abs(den)<1e-8)continue;
   const x0=Math.max(0,Math.floor(Math.min(a[0],b[0],c[0]))),x1=Math.min(size-1,Math.ceil(Math.max(a[0],b[0],c[0]))),y0=Math.max(0,Math.floor(Math.min(a[1],b[1],c[1]))),y1=Math.min(size-1,Math.ceil(Math.max(a[1],b[1],c[1])));
   for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){
    const u=((b[1]-c[1])*(x+.5-c[0])+(c[0]-b[0])*(y+.5-c[1]))/den,w=((c[1]-a[1])*(x+.5-c[0])+(a[0]-c[0])*(y+.5-c[1]))/den,t=1-u-w;if(u<0||w<0||t<0)continue;
    const z=u*a[2]+w*b[2]+t*c[2],j=y*size+x;if(z<=depth[j])continue;depth[j]=z;
    const nz=u*a[3]+w*b[3]+t*c[3],f=Math.max(0,Math.min(1,(nz-.24)/.40));opacity[j]=surface.userData.skipOriginalPaint?0:f*f*(3-2*f);
    if(surface.userData.artworkMinY!==undefined)opacity[j]*=Math.max(0,Math.min(1,(y*2+1-surface.userData.artworkMinY)/12));
   }
  }g.dispose();
 }
 const P=[],UV=[],colors=[],I=[],grid=new Int32Array(160*160);grid.fill(-1);
 for(let y=0;y<160;y++)for(let x=0;x<160;x++){
  const j=y*2*size+x*2,z=depth[j],px=x*4+1,py=y*4+1;if(!Number.isFinite(z)||opacity[j]<.01)continue;
  let mask=false;for(const f of parent.userData.originalFaceRegions||[])if(((px-f.cx)/f.rx)**2+((py-f.cy)/f.ry)**2<1.015)mask=true;if(mask)continue;
  grid[y*160+x]=P.length/3;P.push((px-pivot[0])*.005,(pivot[1]-py)*.005,z+.008);UV.push(px/640,py/640);colors.push(1,1,1,opacity[j]);
 }
 function tri(a,b,c){if(a<0||b<0||c<0)return;const za=P[a*3+2],zb=P[b*3+2],zc=P[c*3+2];if(Math.max(za,zb,zc)-Math.min(za,zb,zc)>.12)return;I.push(a,c,b);}
 for(let y=0;y<159;y++)for(let x=0;x<159;x++){const a=grid[y*160+x],b=grid[y*160+x+1],c=grid[(y+1)*160+x],d=grid[(y+1)*160+x+1];tri(a,b,d);tri(a,d,c);}
 if(!I.length)return;const g=k.geometry(P,I,UV);g.setAttribute('color',new THREE.Float32BufferAttribute(colors,4));const art=k.art.clone();art.vertexColors=true;art.transparent=true;art.alphaTest=0;art.depthWrite=false;k.mesh(parent.name+'VisibleArtwork',g,art,parent);
};
