"use strict";
// Complete the two padded insect suits without projecting foreground objects
// onto their flanks or drawing a permanent outline along the hood meridian.
module.exports=function finishGarden(T,k,id,parts){
 if(!['animal-bee','animal-butterfly'].includes(id))return;
 const bee=id==='animal-bee';
 for(const [name,part]of parts){
  const group=part.group;
  for(const o of [...group.children])if(o.name.startsWith('GardenHoodPiping'))group.remove(o);
  const solids=group.children.filter(o=>o.isMesh&&!o.material.userData.originalTexture);
  for(const front of solids.filter(o=>o.name.endsWith('Surface'))){
   const back=group.getObjectByName(front.name.replace(/Surface$/,'Back'));if(!back)continue;
   const buckets=new Map();for(const mesh of [front,back]){const p=mesh.geometry.attributes.position,n=mesh.geometry.attributes.normal;for(let i=0;i<p.count;i++){const key=[p.getX(i),p.getY(i),p.getZ(i)].map(v=>Math.round(v*1e6)).join(',');if(!buckets.has(key))buckets.set(key,[]);buckets.get(key).push([n,i]);}}
   for(const list of buckets.values()){const n=new T.Vector3();for(const[a,i]of list)n.add(new T.Vector3().fromBufferAttribute(a,i));n.normalize();for(const[a,i]of list)a.setXYZ(i,n.x,n.y,n.z);}
  }
  // Sleeves, boots and the banded abdomen have their own solid colours.
  // The source wing behind a narrow sleeve must not be painted onto its sides.
  if(['Torso','LeftArm','RightArm','LeftLeg','RightLeg'].includes(name)){
   for(const o of [...group.children])if(o.isMesh&&o.material.userData.originalTexture)group.remove(o);
   for(const o of solids)o.userData.skipOriginalPaint=true;
  }else if(name==='Head'){
   group.userData.artworkOcclusion=true;
   for(const o of solids)o.userData.artworkFacingFade=[.18,.55];
   require('./project-model-artwork.cjs')(T,k,group,part.part.pivot);
   const face=group.userData.artworkOpaqueRegions[0];
   for(const art of group.children.filter(o=>o.isMesh&&o.material.userData.originalTexture&&o.name.startsWith('WholeGardenHood'))){
    const p=art.geometry.attributes.position,c=art.geometry.attributes.color;if(!c)continue;
    for(let i=0;i<p.count;i++){
     const x=p.getX(i)/.005+part.part.pivot[0],y=part.part.pivot[1]-p.getY(i)/.005,r=Math.hypot((x-face.cx)/face.rx,(y-face.cy)/face.ry);
     c.setW(i,c.getW(i)*Math.max(0,Math.min(1,(1.35-r)/.10)));
    }
   }
  }
  for(const mesh of solids){
   if(!/Surface$|Back$/.test(mesh.name))continue;
   const g=mesh.geometry.clone(),p=g.attributes.position,n=g.attributes.normal,ix=g.index.array;
   const width=name==='Head'?.014:name.includes('Wing')?.009:.01;
   for(let i=0;i<p.count;i++)p.setXYZ(i,p.getX(i)+n.getX(i)*width,p.getY(i)+n.getY(i)*width,p.getZ(i)+n.getZ(i)*width);
   for(let i=0;i<ix.length;i+=3)[ix[i+1],ix[i+2]]=[ix[i+2],ix[i+1]];g.computeVertexNormals();
   const ink=k.mesh(mesh.name+'Silhouette',g,k.solid('GardenSilhouette',name.includes('Wing')&&bee?'#637f90':bee?'#704424':'#69415f'),group);
   ink.position.copy(mesh.position);ink.quaternion.copy(mesh.quaternion);ink.scale.copy(mesh.scale);ink.userData.skipOriginalPaint=true;ink.material.userData.alreadyShaded=true;
  }
 }
};
