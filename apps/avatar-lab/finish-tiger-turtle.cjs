"use strict";
module.exports=function(T,k,id,parts){
 if(!['animal-tiger','animal-turtle'].includes(id))return;
 const tiger=id==='animal-tiger',head=parts.get('Head');
 if(tiger){head.group.remove(head.group.getObjectByName('CostumeHood'));k.volume('ShapedTigerHood',k.ellipse(311,260,198,185),[311,260],head.part.pivot,.77,.77,head.group,k.solid('TigerHoodColor','#f6a338'),{samples:128,art:false});}
 for(const name of [tiger?'ShapedTigerHood':'MeasuredCostumeHood']){
 const a=head.group.getObjectByName(name+'Surface'),b=head.group.getObjectByName(name+'Back');
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
 if(!tiger){
  const shell=k.root.getObjectByName('TurtleShell');shell.clear();shell.position.z=-.08;
  const shellPart={part:{pivot:[426,465],color:'#348a2f'},group:shell,special:true};parts.set('TurtleShell',shellPart);
  k.volume('DomedTurtleShell',k.ellipse(351,467,138,96),[351,467],shellPart.part.pivot,.26,.50,shell,k.solid('TurtleShellColor','#348a2f'),{art:false,samples:128});
  for(const mesh of shell.children)mesh.userData.artworkExcludedRegions=[{cx:318,cy:454,rx:103,ry:105},{cx:318,cy:234,rx:180,ry:172}];
 }
 if(tiger){
  const tail=parts.get('Tail'),mesh=tail.group.getObjectByName('AttachedTail'),p=mesh.geometry.attributes.position;
  for(let i=0;i<p.count;i++){const x=p.getX(i)/.005+tail.part.pivot[0],w=Math.max(0,Math.min(1,(420-x)/60));p.setXYZ(i,p.getX(i)-.06*w,p.getY(i),p.getZ(i)+.33*w);}mesh.geometry.computeVertexNormals();
  for(const side of ['Left','Right']){const arm=parts.get(side+'Arm');for(const suffix of ['Surface','Back']){const mesh=arm.group.getObjectByName('RoundedTiger'+side+'Arm'+suffix),p=mesh.geometry.attributes.position;for(let i=0;i<p.count;i++){const y=arm.part.pivot[1]-p.getY(i)/.005,w=Math.max(0,Math.min(1,(475-y)/40));p.setX(i,p.getX(i)+(side==='Left'?.08:-.08)*w);}mesh.geometry.computeVertexNormals();}}
 }else{
  const torso=parts.get('Torso');for(const suffix of ['Surface','Back']){const mesh=torso.group.getObjectByName('CostumeTail'+suffix),p=mesh.geometry.attributes.position;for(let i=0;i<p.count;i++){const x=p.getX(i)/.005+torso.part.pivot[0],w=Math.max(0,Math.min(1,(450-x)/65));p.setXYZ(i,p.getX(i)-.30*w,p.getY(i)+.05*w,p.getZ(i)+.16*w);}mesh.geometry.computeVertexNormals();}
 }
 const colour=tiger?'#f6a338':'#9ac52b';
 for(const [name,part]of parts)for(const mesh of part.group.children.filter(o=>o.isMesh&&!o.material.userData.originalTexture)){
  if(name==='Head'&&mesh.name.startsWith(tiger?'ShapedTigerHood':'MeasuredCostumeHood'))mesh.material.color.set(colour).convertSRGBToLinear();
  if(!tiger&&['LeftArm','RightArm','LeftLeg','RightLeg'].includes(name)){mesh.userData.skipOriginalPaint=true;mesh.material.color.set('#8cba2a').convertSRGBToLinear();}
 }
 k.root.updateMatrixWorld(true);
 if(tiger)for(const side of [-1,1]){
  const inner=head.group.getObjectByName('InnerEar'+side),outer=head.group.getObjectByName('Ear'+side);
  inner.updateMatrix();inner.geometry=inner.geometry.clone().applyMatrix4(inner.matrix);inner.position.set(0,0,0);inner.quaternion.identity();inner.scale.set(1,1,1);
  const p=inner.geometry.attributes.position;inner.geometry.computeBoundingBox();const box=inner.geometry.boundingBox,d=box.max.z-box.min.z;
  for(let i=0;i<p.count;i++){
   const t=(p.getZ(i)-box.min.z)/d,origin=head.group.localToWorld(new T.Vector3(p.getX(i),p.getY(i),3)),hit=new T.Raycaster(origin,new T.Vector3(0,0,-1)).intersectObject(outer)[0];
   if(!hit)throw new Error('Tiger inner ear misses support');p.setZ(i,head.group.worldToLocal(hit.point.clone()).z-.006+t*.018);
  }inner.geometry.computeVertexNormals();
 }
 else{
  const claws={LeftArm:[[218,479],[229,488]],RightArm:[[402,490],[414,490],[427,483]],LeftLeg:[[251,561],[265,564],[279,564]],RightLeg:[[348,564],[363,565],[377,562]]};
  for(const [name,points]of Object.entries(claws)){
   const part=parts.get(name),support=part.group.getObjectByName('Compact'+name+'Surface');
   for(const [i,[x,y]]of points.entries()){
    const origin=part.group.localToWorld(new T.Vector3((x-part.part.pivot[0])*.005,(part.part.pivot[1]-y)*.005,3)),hit=new T.Raycaster(origin,new T.Vector3(0,0,-1)).intersectObject(support)[0];
    if(!hit)throw new Error('Turtle claw misses paw '+name+' '+i);
    const normal=hit.face.normal.clone().transformDirection(support.matrixWorld),center=part.group.worldToLocal(hit.point.clone().addScaledVector(normal,.002));
    const nail=k.mesh('TurtleClaw'+name+i,new T.SphereGeometry(1,16,12),k.solid('TurtleClawColor','#fff0b1'),part.group,center.toArray());
    nail.scale.set(.033,.039,.014);nail.quaternion.setFromUnitVectors(new T.Vector3(0,0,1),normal);nail.userData.skipOriginalPaint=true;nail.userData.pawSupport=support.name;
   }
  }
 }
};
