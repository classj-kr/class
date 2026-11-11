"use strict";
module.exports=function(T,k,id,parts){
 if(!['animal-shark','animal-sloth'].includes(id))return;
 const shark=id==='animal-shark',head=parts.get('Head');
 for(const name of ['MeasuredCostumeHood',...(shark?['HeadFlipper-1','HeadFlipper1','DorsalFin']:['CompactCostumeBody'])]){
 const group=name==='CompactCostumeBody'?parts.get('Torso').group:head.group;
 const a=group.getObjectByName(name+'Surface'),b=group.getObjectByName(name+'Back');
 const base=(a.geometry.attributes.position.getZ(0)+b.geometry.attributes.position.getZ(0))/2;
 for(const mesh of [a,b]){
  const p=mesh.geometry.attributes.position,samples=p.count/13,edge=Array.from({length:samples},(_,i)=>new T.Vector3().fromBufferAttribute(p,12*samples+i)),center=new T.Vector3().fromBufferAttribute(p,0);center.z=0;
  let smooth=edge.map(v=>v.clone());for(let pass=0;pass<4;pass++)smooth=smooth.map((v,i)=>{const sum=v.clone().multiplyScalar(2);for(const d of [-3,-2,-1,1,2,3])sum.add(smooth[(i+d+samples)%samples]);return sum.multiplyScalar(1/8);});
  const P=[],I=[],rings=name==='CompactCostumeBody'?64:32,depth=p.getZ(0)-base;
  for(let ring=0;ring<=rings;ring++){const angle=ring/rings*Math.PI/2,r=Math.sin(angle),w=Math.max(0,(r-.94)/.06)**3;for(let i=0;i<samples;i++){const v=center.clone().lerp(smooth[i],r).addScaledVector(edge[i].clone().sub(smooth[i]),w);P.push(v.x,v.y,base+depth*Math.cos(angle));}}
  for(let ring=0;ring<rings;ring++)for(let i=0;i<samples;i++){const a=ring*samples+i,b=ring*samples+(i+1)%samples,c=a+samples,d=b+samples;if(depth<0){if(ring)I.push(a,d,b);I.push(a,c,d);}else{if(ring)I.push(a,b,d);I.push(a,d,c);}}
  const g=k.geometry(P,I);if((g.attributes.normal.getZ(samples*4)>0)!==(depth>0)){for(let i=0;i<I.length;i+=3)[I[i+1],I[i+2]]=[I[i+2],I[i+1]];g.setIndex(I);g.computeVertexNormals();}
  const N=g.attributes.normal;for(let pass=0;pass<3;pass++){const next=N.array.slice();for(let ring=0;ring<=rings;ring++)for(let i=0;i<samples;i++){const v=new T.Vector3();for(let d=-3;d<=3;d++)v.addScaledVector(new T.Vector3().fromBufferAttribute(N,ring*samples+(i+d+samples)%samples),4-Math.abs(d));next.set(v.normalize().toArray(),(ring*samples+i)*3);}N.array.set(next);}
  mesh.geometry.dispose();mesh.geometry=g;mesh.userData.paddedBoundary=edge;
 }

 }
 if(!shark)for(const side of ['Left','Right']){
  const part=parts.get(side+'Arm'),cx=side==='Left'?257:393,cy=414;
  const outline=Array.from({length:32},(_,i)=>{const a=i/32*Math.PI*2;return [cx+25*Math.cos(a),cy+28*Math.sin(a)]});
  k.volume('Sloth'+side+'Shoulder',outline,[cx,cy],part.part.pivot,.20,.20,part.group,k.solid('SlothShoulderColor','#b48c69'),{z:.12,samples:64});
 }
 const colour=shark?'#5189b0':'#b48c69';
 for(const [name,part]of parts)for(const mesh of part.group.children.filter(o=>o.isMesh&&!o.material.userData.originalTexture)){
  if(!mesh.name.startsWith('HeldBranch'))mesh.material.color.set(colour).convertSRGBToLinear();
  if(['LeftArm','RightArm','LeftLeg','RightLeg'].includes(name))mesh.userData.skipOriginalPaint=true;
 }
 if(!shark){
  const torso=parts.get('Torso'),body=torso.group.getObjectByName('CompactCostumeBodySurface'),p=body.geometry.attributes.position,C=[],brown=new T.Color('#b48c69').convertSRGBToLinear(),cream=new T.Color('#ecd0ad').convertSRGBToLinear();
  for(let i=0;i<p.count;i++){const x=p.getX(i)/.005+torso.part.pivot[0],y=torso.part.pivot[1]-p.getY(i)/.005,r=Math.hypot((x-315)/55,(y-451)/57);C.push(...brown.clone().lerp(cream,Math.max(0,Math.min(1,(1-r)/.05))).toArray());}
  body.geometry.setAttribute('color',new T.Float32BufferAttribute(C,3));body.material=body.material.clone();body.material.color.set(0xffffff);body.material.userData.preserveVertexColor=true;body.userData.skipOriginalPaint=true;
  k.root.updateMatrixWorld(true);
  const claws={LeftArm:[[221,493],[231,494],[241,489]],RightArm:[[415,390],[425,387],[435,390]],LeftLeg:[[249,566],[258,567],[268,566]],RightLeg:[[364,566],[374,567],[383,566]]};
  for(const [name,points]of Object.entries(claws)){
   const part=parts.get(name),support=part.group.getObjectByName('Compact'+name+'Surface');
   for(const [i,[x,y]]of points.entries()){
    const origin=part.group.localToWorld(new T.Vector3((x-part.part.pivot[0])*.005,(part.part.pivot[1]-y)*.005,3));
    const hit=new T.Raycaster(origin,new T.Vector3(0,0,-1)).intersectObject(support)[0];
    if(!hit)throw new Error('Sloth claw missing paw support '+name+' '+i);
    const normal=hit.face.normal.clone().transformDirection(support.matrixWorld),center=part.group.worldToLocal(hit.point.clone().addScaledVector(normal,.002));
    const nail=k.mesh('SlothClaw'+name+i,new T.SphereGeometry(1,16,12),k.solid('SlothClawColor','#fff0d6'),part.group,center.toArray());
    nail.scale.set(.023,name.includes('Arm')?.065:.060,.015);nail.quaternion.setFromUnitVectors(new T.Vector3(0,0,1),normal);nail.userData.skipOriginalPaint=true;nail.userData.pawSupport=support.name;
   }
  }
 }
};
