"use strict";
module.exports=function finishDragon(T,k,id,parts){
 if(id!=='animal-dragon')return;
 const head=parts.get('Head'),tail=parts.get('Tail'),front=head.group.getObjectByName('ReptileCostumeHoodSurface');
 const oldHood=new T.Mesh(front.geometry.clone(),new T.MeshBasicMaterial({side:T.DoubleSide}));oldHood.updateMatrixWorld(true);
 for(const [part,name]of [[head,'ReptileCostumeHood'],[tail,'BroadReptileTail']]){
  const a=part.group.getObjectByName(name+'Surface'),b=part.group.getObjectByName(name+'Back'),base=(a.geometry.attributes.position.getZ(0)+b.geometry.attributes.position.getZ(0))/2;
  for(const mesh of [a,b]){
   const p=mesh.geometry.attributes.position,samples=p.count/13,edge=Array.from({length:samples},(_,i)=>new T.Vector3().fromBufferAttribute(p,12*samples+i)),center=new T.Vector3().fromBufferAttribute(p,0);center.z=0;
   let smooth=edge.map(v=>v.clone());for(let pass=0;pass<3;pass++)smooth=smooth.map((v,i)=>{const sum=v.clone().multiplyScalar(2);for(const d of [-3,-2,-1,1,2,3])sum.add(smooth[(i+d+samples)%samples]);return sum.multiplyScalar(1/8);});
   const P=[],I=[],rings=32,depth=p.getZ(0)-base;
   for(let ring=0;ring<=rings;ring++){const angle=ring/rings*Math.PI/2,r=Math.sin(angle),w=Math.max(0,(r-.94)/.06)**3;for(let i=0;i<samples;i++){const v=center.clone().lerp(smooth[i],r).addScaledVector(edge[i].clone().sub(smooth[i]),w);P.push(v.x,v.y,base+depth*Math.cos(angle));}}
   for(let ring=0;ring<rings;ring++)for(let i=0;i<samples;i++){const a=ring*samples+i,b=ring*samples+(i+1)%samples,c=a+samples,d=b+samples;if(depth<0){if(ring)I.push(a,d,b);I.push(a,c,d);}else{if(ring)I.push(a,b,d);I.push(a,d,c);}}
   const g=k.geometry(P,I);if((g.attributes.normal.getZ(samples*4)>0)!==(depth>0)){for(let i=0;i<I.length;i+=3)[I[i+1],I[i+2]]=[I[i+2],I[i+1]];g.setIndex(I);g.computeVertexNormals();}
   mesh.geometry.dispose();mesh.geometry=g;
   // Painted silhouette pixels are replaced by the actual 3D silhouette ink.
   mesh.userData.dragonArtworkBoundary=edge;
  }
 }
 const newHood=new T.Mesh(front.geometry,new T.MeshBasicMaterial({side:T.DoubleSide}));newHood.updateMatrixWorld(true);
 for(const mesh of head.group.children.filter(o=>o.isMesh&&/^Dragon(BroadMuzzle|EyeRidge)/.test(o.name)&&!o.material.userData.originalTexture)){
  const p=mesh.geometry.attributes.position;
  for(let i=0;i<p.count;i++){
   const ray=new T.Raycaster(new T.Vector3(p.getX(i),p.getY(i),3),new T.Vector3(0,0,-1)),old=ray.intersectObject(oldHood)[0],next=ray.intersectObject(newHood)[0];
   if(old&&next)p.setZ(i,p.getZ(i)+next.point.z-old.point.z);
  }mesh.geometry.computeVertexNormals();
 }
 oldHood.geometry.dispose();oldHood.material.dispose();newHood.material.dispose();
 front.userData.artworkMinY=137;
 for(const o of head.group.children)if(o.name.startsWith('DragonEyeRidge')&&!o.material.userData.originalTexture)o.userData.artworkMinY=137;
 // The tail crests need their own cream-coloured volume. Projecting their
 // pixels over the inflated green tail made comb-like stripes in profile.
 for(const o of tail.group.children)if(o.isMesh)o.userData.skipOriginalPaint=true;
 const crests=[[404,501],[434,510],[458,517]].map(([x,y])=>[[x-11,y+7],[x-6,y-5],[x,y-9],[x+6,y-5],[x+11,y+7]]);
 crests.forEach((outline,i)=>{
  const center=outline.reduce((a,p)=>[a[0]+p[0]/outline.length,a[1]+p[1]/outline.length],[0,0]);
  k.volume('DragonTailCrest'+i,outline,center,tail.part.pivot,.16,.15,tail.group,k.solid('DragonTailCrestColor','#f7e5af'),{art:false,z:-.06,samples:64});
 });
 for(const o of tail.group.children)if(o.isMesh)o.userData.skipOriginalPaint=true;
};
