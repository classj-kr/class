"use strict";
// Preserve the front silhouette while keeping tiny feather scallops local to
// the edge. A radial fan otherwise propagates every notch across the cranium.
module.exports=function finishSoftAnimal(T,k,id,parts){
 if(!['animal-bear','animal-chick'].includes(id))return;
 for(const [name,part]of parts){
  const group=part.group,solids=group.children.filter(o=>o.isMesh&&!o.material.userData.originalTexture);
  if(id==='animal-chick'&&name.endsWith('Leg'))for(const mesh of solids)mesh.material.color.set('#dda047').convertSRGBToLinear();
  group.userData.directSurfaceArtwork=true;group.userData.artworkOcclusion=true;
  group.userData.artworkOpaqueRegions=name==='Head'?[id==='animal-bear'?{cx:320,cy:329,rx:121,ry:105}:{cx:320,cy:352,rx:118,ry:92}]:[];
  for(const front of solids.filter(o=>o.name.endsWith('Surface'))){
   const back=group.getObjectByName(front.name.replace(/Surface$/,'Back'));if(!back)continue;
   if(id==='animal-chick'&&front.name==='MeasuredCostumeHoodSurface'){
    for(const mesh of [front,back]){
     const p=mesh.geometry.attributes.position,samples=p.count/13,edge=Array.from({length:samples},(_,i)=>new T.Vector3().fromBufferAttribute(p,12*samples+i)),center=new T.Vector3().fromBufferAttribute(p,0);center.z=0;
     let smooth=edge.map(v=>v.clone());
     for(let pass=0;pass<3;pass++)smooth=smooth.map((v,i)=>{const sum=v.clone().multiplyScalar(2);for(const d of [-3,-2,-1,1,2,3])sum.add(smooth[(i+d+samples)%samples]);return sum.multiplyScalar(1/8);});
     const P=[],I=[],rings=32,depth=p.getZ(0);
     for(let ring=0;ring<=rings;ring++){const a=ring/rings*Math.PI/2,r=Math.sin(a),edgeWeight=Math.max(0,(r-.94)/.06)**3;for(let i=0;i<samples;i++){const v=center.clone().lerp(smooth[i],r).addScaledVector(edge[i].clone().sub(smooth[i]),edgeWeight);P.push(v.x,v.y,depth*Math.cos(a));}}
     for(let ring=0;ring<rings;ring++)for(let i=0;i<samples;i++){const a=ring*samples+i,b=ring*samples+(i+1)%samples,c=a+samples,d=b+samples;if(depth<0){if(ring)I.push(a,d,b);I.push(a,c,d);}else{if(ring)I.push(a,b,d);I.push(a,d,c);}}
     const g=k.geometry(P,I);if((g.attributes.normal.getZ(samples*4)>0)!==(depth>0)){for(let i=0;i<I.length;i+=3)[I[i+1],I[i+2]]=[I[i+2],I[i+1]];g.setIndex(I);g.computeVertexNormals();}
     // Soft down has broad shading rather than a hard highlight on every
     // small scallop. Smooth along each latitude, keeping its vertical shape.
     const N=g.attributes.normal;for(let pass=0;pass<3;pass++){const smoothed=N.array.slice();for(let ring=0;ring<=rings;ring++)for(let i=0;i<samples;i++){const v=new T.Vector3();for(let d=-3;d<=3;d++)v.addScaledVector(new T.Vector3().fromBufferAttribute(N,ring*samples+(i+d+samples)%samples),4-Math.abs(d));smoothed.set(v.normalize().toArray(),(ring*samples+i)*3);}N.array.set(smoothed);}
     mesh.geometry.dispose();mesh.geometry=g;
    }
   }
   // Front and back must shade as one sewn, padded surface.
   const buckets=new Map();for(const mesh of [front,back]){const p=mesh.geometry.attributes.position,n=mesh.geometry.attributes.normal;for(let i=0;i<p.count;i++){const key=[p.getX(i),p.getY(i),p.getZ(i)].map(v=>Math.round(v*1e6)).join(',');if(!buckets.has(key))buckets.set(key,[]);buckets.get(key).push([n,i]);}}
   for(const list of buckets.values()){const sum=new T.Vector3();for(const[n,i]of list)sum.add(new T.Vector3().fromBufferAttribute(n,i));sum.normalize();for(const[n,i]of list)n.setXYZ(i,sum.x,sum.y,sum.z);}
  }
  for(const mesh of solids)mesh.userData.artworkFacingFade=[.18,.55];
  require('./project-model-artwork.cjs')(T,k,group,part.part.pivot);
  // Use an actual silhouette shell rather than stretching dark source pixels
  // across the side. It has no visible meridian or back-facing human face.
  for(const mesh of solids){
   const g=mesh.geometry.clone(),p=g.attributes.position,n=g.attributes.normal,ix=g.index?.array;if(!ix)continue;
   const width=name==='Head'?.012:.009;
   for(let i=0;i<p.count;i++)p.setXYZ(i,p.getX(i)+n.getX(i)*width,p.getY(i)+n.getY(i)*width,p.getZ(i)+n.getZ(i)*width);
   for(let i=0;i<ix.length;i+=3)[ix[i+1],ix[i+2]]=[ix[i+2],ix[i+1]];g.computeVertexNormals();
   const ink=k.mesh(mesh.name+'Silhouette',g,k.solid('SoftAnimalInk',id==='animal-bear'?'#694123':'#c2a452'),group);ink.position.copy(mesh.position);ink.quaternion.copy(mesh.quaternion);ink.scale.copy(mesh.scale);ink.userData.skipOriginalPaint=true;ink.material.userData.alreadyShaded=true;
  }
 }
};
