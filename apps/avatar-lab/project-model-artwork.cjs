"use strict";
// Preserve the painted front on authored solids. The WebP stays unchanged.
module.exports=function projectModelArtwork(THREE,k,parent,pivot){
 const old=[],surfaces=[];parent.traverse(o=>{if(!o.isMesh)return;if(o.material.userData.originalTexture)old.push(o);else surfaces.push(o);});old.filter(o=>!o.name.startsWith('OriginalFace')).forEach(o=>o.parent.remove(o));
 // Project only onto the visible front surface of the assembled costume.
 // Painting every overlapping piece duplicated eyes/noses on the sides.
 const resolution=320,depth=new Float32Array(resolution*resolution);depth.fill(-Infinity);
 const transformed=new Map();
 for(const surface of surfaces){
  surface.updateMatrix();const geometry=surface.geometry.clone().applyMatrix4(surface.matrix);transformed.set(surface,geometry);
  const p=geometry.attributes.position,ix=geometry.index;
  for(let i=0;i<(ix?ix.count:p.count);i+=3){
   const v=[0,1,2].map(j=>{const n=ix?ix.getX(i+j):i+j;return[(p.getX(n)/.005+pivot[0])/2,(pivot[1]-p.getY(n)/.005)/2,p.getZ(n)];});
   const [a,b,c]=v,den=(b[1]-c[1])*(a[0]-c[0])+(c[0]-b[0])*(a[1]-c[1]);if(Math.abs(den)<1e-8)continue;
   const x0=Math.max(0,Math.floor(Math.min(...v.map(q=>q[0])))),x1=Math.min(319,Math.ceil(Math.max(...v.map(q=>q[0])))),y0=Math.max(0,Math.floor(Math.min(...v.map(q=>q[1])))),y1=Math.min(319,Math.ceil(Math.max(...v.map(q=>q[1]))));
   for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){
    const u=((b[1]-c[1])*(x+.5-c[0])+(c[0]-b[0])*(y+.5-c[1]))/den,w=((c[1]-a[1])*(x+.5-c[0])+(a[0]-c[0])*(y+.5-c[1]))/den,t=1-u-w;
    if(u>=-.01&&w>=-.01&&t>=-.01){const z=u*a[2]+w*b[2]+t*c[2],j=y*resolution+x;if(z>depth[j])depth[j]=z;}
   }
  }
 }
 for(const surface of surfaces){
  if(surface.userData.skipOriginalPaint){transformed.get(surface).dispose();continue;}
  const source=transformed.get(surface),p=source.attributes.position,n=source.attributes.normal,ix=source.index,indices=[];
  for(let i=0;i<(ix?ix.count:p.count);i+=3){const a=ix?ix.getX(i):i,b=ix?ix.getX(i+1):i+1,c=ix?ix.getX(i+2):i+2;if((n.getZ(a)+n.getZ(b)+n.getZ(c))/3>.12)indices.push(a,b,c);}
  if(!indices.length){source.dispose();continue;}
  const uv=[],colors=[];for(let i=0;i<p.count;i++){
   const px=p.getX(i)/.005+pivot[0],py=pivot[1]-p.getY(i)/.005;uv.push(px/640,py/640);
   let alpha=Math.min(1,Math.max(0,(n.getZ(i)-.35)/.35));
   const dx=Math.max(0,Math.min(319,Math.floor(px/2))),dy=Math.max(0,Math.min(319,Math.floor(py/2))),front=depth[dy*resolution+dx];
   if(front-p.getZ(i)>.035)alpha=0;
   for(const f of parent.userData.originalFaceRegions||[])if(((px-f.cx)/f.rx)**2+((py-f.cy)/f.ry)**2<1.015)alpha=0;
   if(surface.userData.artworkMinY!==undefined)alpha*=Math.min(1,Math.max(0,(py-surface.userData.artworkMinY)/12));
   colors.push(1,1,1,alpha);p.setZ(i,p.getZ(i)+.006);
  }
  source.setIndex(indices);source.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));source.setAttribute('color',new THREE.Float32BufferAttribute(colors,4));
  const art=k.art.clone();art.vertexColors=true;art.transparent=true;art.alphaTest=0;art.depthWrite=false;k.mesh(surface.name+'OriginalPaint',source,art,parent);
 }
};
