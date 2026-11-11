"use strict";
module.exports=function(T,k,id,parts){
 if(!['animal-rhinoceros','animal-seal'].includes(id))return;
 const rhino=id==='animal-rhinoceros',head=parts.get('Head');
 for(const name of ['MeasuredCostumeHood',...(rhino?['RhinoEar-1','RhinoEar1','MainRhinoHorn']:[])]){
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
 if(!rhino){
  const tail=parts.get('Tail');
  for(const suffix of ['Surface','Back']){
   const mesh=tail.group.getObjectByName('FullMarineTail'+suffix),p=mesh.geometry.attributes.position;
   for(let i=0;i<p.count;i++){
    const x=p.getX(i)/.005+tail.part.pivot[0],weight=Math.max(0,Math.min(1,(410-x)/70));
    p.setXYZ(i,p.getX(i)-.10*weight,p.getY(i),p.getZ(i)+.17*weight);
   }
   mesh.geometry.computeVertexNormals();
  }
 }
 const colour=rhino?'#a09a99':'#9fa7b3';
 for(const [name,part]of parts)for(const mesh of part.group.children.filter(o=>o.isMesh&&!o.material.userData.originalTexture)){
  if(name!=='Head'||mesh.name.startsWith('MeasuredCostumeHood'))mesh.material.color.set(colour).convertSRGBToLinear();
  if(['LeftArm','RightArm','LeftLeg','RightLeg'].includes(name))mesh.userData.skipOriginalPaint=true;
 }
 if(rhino){
  k.root.updateMatrixWorld(true);
  for(const side of [-1,1])for(const isArm of [true,false]){
   const part=parts.get((side<0?'Left':'Right')+(isArm?'Arm':'Leg')),support=part.group.getObjectByName('Compact'+part.group.name+'Surface');
   const points=isArm?[[202,452],[215,460],[229,464]]:[[263,517],[282,519]];
   for(const [i,[x0,y]]of points.entries()){
    const x=side<0?x0:640-x0,origin=part.group.localToWorld(new T.Vector3((x-part.part.pivot[0])*.005,(part.part.pivot[1]-y)*.005,3));
    const hit=new T.Raycaster(origin,new T.Vector3(0,0,-1)).intersectObject(support)[0];
    if(!hit)throw new Error('Rhino claw missing paw support '+part.group.name+' '+i);
    const normal=hit.face.normal.clone().transformDirection(support.matrixWorld),center=part.group.worldToLocal(hit.point.clone().addScaledVector(normal,.002));
    const nail=k.mesh('RhinoClaw'+part.group.name+i,new T.SphereGeometry(1,16,12),k.solid('RhinoClawColor','#f4f0ee'),part.group,center.toArray());
    nail.scale.set(.030,.026,.012);nail.quaternion.setFromUnitVectors(new T.Vector3(0,0,1),normal);nail.userData.skipOriginalPaint=true;nail.userData.pawSupport=support.name;
   }
  }
 }
};
