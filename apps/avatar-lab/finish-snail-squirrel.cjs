"use strict";
module.exports=function(T,k,id,parts){
 if(!['animal-snail','animal-squirrel'].includes(id))return;
 const snail=id==='animal-snail',head=parts.get('Head');
 if(!snail){head.group.remove(head.group.getObjectByName('CostumeHood'));k.volume('ShapedSquirrelHood',k.ellipse(262,249,196,181),[262,249],head.part.pivot,.72,.72,head.group,k.solid('SquirrelHoodColor','#c08e59'),{samples:128,art:false});}
 for(const [group,name]of (snail?[[head.group,'SnailRoundHood'],[parts.get('SnailFoot').group,'ContinuousSnailFoot'],[parts.get('SpiralShell').group,'RoundedSpiralShell']]:[[head.group,'ShapedSquirrelHood'],[head.group,'SquirrelEar-1'],[head.group,'SquirrelEar1'],[parts.get('Tail').group,'CurledSquirrelTail']])){
 const a=group.getObjectByName(name+'Surface'),b=group.getObjectByName(name+'Back');
 const base=(a.geometry.attributes.position.getZ(0)+b.geometry.attributes.position.getZ(0))/2;
 for(const mesh of [a,b]){
  const p=mesh.geometry.attributes.position,samples=p.count/13,edge=Array.from({length:samples},(_,i)=>new T.Vector3().fromBufferAttribute(p,12*samples+i)),center=new T.Vector3().fromBufferAttribute(p,0);center.z=0;
  let smooth=edge.map(v=>v.clone());for(let pass=0;pass<4;pass++)smooth=smooth.map((v,i)=>{const sum=v.clone().multiplyScalar(2);for(const d of [-3,-2,-1,1,2,3])sum.add(smooth[(i+d+samples)%samples]);return sum.multiplyScalar(1/8);});
  const P=[],I=[],rings=32,depth=p.getZ(0)-base;
  for(let ring=0;ring<=rings;ring++){const angle=ring/rings*Math.PI/2,r=Math.sin(angle),w=Math.max(0,(r-.94)/.06)**3;for(let i=0;i<samples;i++){const v=center.clone().lerp(smooth[i],r).addScaledVector(edge[i].clone().sub(smooth[i]),w);P.push(v.x,v.y,base+depth*Math.cos(angle));}}
  for(let ring=0;ring<rings;ring++)for(let i=0;i<samples;i++){const a=ring*samples+i,b=ring*samples+(i+1)%samples,c=a+samples,d=b+samples;if(depth<0){if(ring)I.push(a,d,b);I.push(a,c,d);}else{if(ring)I.push(a,b,d);I.push(a,d,c);}}
  const g=k.geometry(P,I);if((g.attributes.normal.getZ(samples*4)>0)!==(depth>0)){for(let i=0;i<I.length;i+=3)[I[i+1],I[i+2]]=[I[i+2],I[i+1]];g.setIndex(I);g.computeVertexNormals();}
  const N=g.attributes.normal;for(let pass=0;pass<3;pass++){const next=N.array.slice();for(let ring=0;ring<=rings;ring++)for(let i=0;i<samples;i++){const v=new T.Vector3();for(let d=-3;d<=3;d++)v.addScaledVector(new T.Vector3().fromBufferAttribute(N,ring*samples+(i+d+samples)%samples),4-Math.abs(d));next.set(v.normalize().toArray(),(ring*samples+i)*3);}N.array.set(next);}
  mesh.geometry.dispose();mesh.geometry=g;mesh.userData.paddedBoundary=edge;
 }

 }
 if(!snail){
  const tail=parts.get('Tail');
  for(const suffix of ['Surface','Back']){
   const mesh=tail.group.getObjectByName('CurledSquirrelTail'+suffix),p=mesh.geometry.attributes.position;
   for(let i=0;i<p.count;i++){const x=p.getX(i)/.005+tail.part.pivot[0],w=Math.max(0,Math.min(1,(375-x)/70));p.setXYZ(i,p.getX(i)-.22*w,p.getY(i),p.getZ(i)+.23*w);}
   mesh.geometry.computeVertexNormals();mesh.userData.artworkExcludedRegions=[...(mesh.userData.artworkExcludedRegions||[]),{cx:340,cy:487,rx:31,ry:47}];
  }
 }
 const colour=snail?'#e8b784':'#c08e59';
 for(const [name,part]of parts){
  for(const o of [...part.group.children])if(o.name.startsWith('SnailHoodPiping'))part.group.remove(o);
  for(const mesh of part.group.children.filter(o=>o.isMesh&&!o.material.userData.originalTexture)){
   if(name==='Head')mesh.material.color.set(colour).convertSRGBToLinear();
   if(!snail&&['LeftArm','RightArm','LeftLeg','RightLeg'].includes(name))mesh.userData.skipOriginalPaint=true;
  }
 }
 if(!snail){
  k.root.updateMatrixWorld(true);
  for(const side of ['Left','Right']){
   const part=parts.get(side+'Arm'),support=part.group.getObjectByName('Compact'+side+'ArmSurface'),x=side==='Left'?184:340,y=498;
   const origin=part.group.localToWorld(new T.Vector3((x-part.part.pivot[0])*.005,(part.part.pivot[1]-y)*.005,3)),hit=new T.Raycaster(origin,new T.Vector3(0,0,-1)).intersectObject(support)[0];
   if(!hit)throw new Error('Squirrel palm missing support '+side);
   const normal=hit.face.normal.clone().transformDirection(support.matrixWorld),center=part.group.worldToLocal(hit.point.clone().addScaledVector(normal,.002));
   const palm=k.mesh('SquirrelPalm'+side,new T.SphereGeometry(1,20,14),k.solid('SquirrelPalmColor','#efc68e'),part.group,center.toArray());
   palm.scale.set(.044,.047,.012);palm.quaternion.setFromUnitVectors(new T.Vector3(0,0,1),normal);palm.userData.skipOriginalPaint=true;palm.userData.pawSupport=support.name;
  }
 }
};
