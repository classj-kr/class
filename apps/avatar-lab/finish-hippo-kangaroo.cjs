"use strict";
module.exports=function(T,k,id,parts){
 if(!['animal-hippopotamus','animal-kangaroo'].includes(id))return;
 const head=parts.get('Head'),name='MeasuredCostumeHood',a=head.group.getObjectByName(name+'Surface'),b=head.group.getObjectByName(name+'Back');
 const oldHood=new T.Mesh(a.geometry.clone(),new T.MeshBasicMaterial({side:T.DoubleSide}));oldHood.updateMatrixWorld(true);
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
 const newHood=new T.Mesh(a.geometry,new T.MeshBasicMaterial({side:T.DoubleSide}));newHood.updateMatrixWorld(true);
 for(const mesh of head.group.children.filter(o=>o.isMesh&&o.name.startsWith('AnimalMuzzle')&&!o.material.userData.originalTexture)){
  const p=mesh.geometry.attributes.position;for(let i=0;i<p.count;i++){
   const ray=new T.Raycaster(new T.Vector3(p.getX(i),p.getY(i),3),new T.Vector3(0,0,-1)),old=ray.intersectObject(oldHood)[0],next=ray.intersectObject(newHood)[0];
   if(old&&next)p.setZ(i,p.getZ(i)+next.point.z-old.point.z);
  }mesh.geometry.computeVertexNormals();
 }
 oldHood.geometry.dispose();oldHood.material.dispose();newHood.material.dispose();
 if(id!=='animal-kangaroo')return;
 const body=parts.get('Torso'),carrier=new T.Mesh(body.group.getObjectByName('CompactCostumeBodySurface').geometry,new T.MeshBasicMaterial({side:T.DoubleSide}));carrier.updateMatrixWorld(true);
 function relief(name,outline,center,depth,color){
  const before=new Set(body.group.children);k.volume(name,outline,center,body.part.pivot,depth,.035,body.group,k.solid(name+'Color',color),{art:false,samples:64});
  for(const mesh of body.group.children.filter(o=>!before.has(o))){const p=mesh.geometry.attributes.position;for(let i=0;i<p.count;i++){const ray=new T.Raycaster(new T.Vector3(p.getX(i),p.getY(i),3),new T.Vector3(0,0,-1)),hit=ray.intersectObject(carrier)[0];p.setZ(i,p.getZ(i)+(hit?hit.point.z:.30)-.012);}mesh.geometry.computeVertexNormals();}
 }
 relief('KangarooPouch',[[254,476],[274,480],[296,481],[318,480],[338,476],[335,507],[320,523],[296,530],[272,522],[257,508]],[296,501],.065,'#ddb07b');
 relief('JoeyHead',k.ellipse(296,453,29,30),[296,453],.10,'#c9945b');
 for(const side of [-1,1])relief('JoeyEar'+side,[[255,393],[265,394],[277,405],[284,425],[279,437],[269,434],[260,417]].map(([x,y])=>[296+side*(296-x),y]),[296+side*24,417],.075,'#d7a069');
 carrier.material.dispose();
};
