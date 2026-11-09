"use strict";
module.exports=function(T,k,id,parts){
 if(!['animal-giraffe','animal-hedgehog'].includes(id))return;
 const head=parts.get('Head');
 if(id==='animal-giraffe'){
  const kit=require('./sculpt-kit.cjs')(T,k,head);
  for(const side of [-1,1]){for(const o of [...head.group.children])if(o.name==='Ossicone'+side||o.name.startsWith('Ossicone'+side+'Cap'))head.group.remove(o);kit.sweep('Ossicone'+side,[[320+side*37,126,0,8.6],[320+side*39,85,0,8.6]],'#bb844b');}
  for(const side of [-1,1]){
   const arm=parts.get(side<0?'LeftArm':'RightArm'),a=require('./sculpt-kit.cjs')(T,k,arm);
   a.ellipsoid('GiraffeHand'+side,[320+side*64,488,.08],[17,12,.10],'#83512d');
  }
  const torso=parts.get('Torso'),body=torso.group.getObjectByName('ShortGiraffeNeckAndBody');body.updateMatrix();
  const carrier=new T.Mesh(body.geometry.clone().applyMatrix4(body.matrix),new T.MeshBasicMaterial({side:T.DoubleSide}));carrier.updateMatrixWorld(true);
  let count=0;
  for(const [row,y]of [395,423,456,487].entries())for(const angle of [1.83+row%2*.12,2.47,3.16+row%2*.12,3.84,4.48-row%2*.12]){
   const P=[],I=[],radius=row<2?.24:.19,height=row<2?7:10,n=32,rings=5;
   for(let r=0;r<=rings;r++)for(let i=0;i<n;i++){
    const a=i/n*Math.PI*2,w=(1+.09*Math.cos(a*5+count))*r/rings,theta=angle+Math.cos(a)*radius*w,py=y+Math.sin(a)*height*w,dy=(torso.part.pivot[1]-py)*.005;
    const direction=new T.Vector3(Math.sin(theta),0,Math.cos(theta)),ray=new T.Raycaster(direction.clone().multiplyScalar(2).setY(dy),direction.clone().negate()),hit=ray.intersectObject(carrier)[0];
    if(!hit)throw new Error('giraffe body patch misses suit');P.push(...hit.point.addScaledVector(direction,.003).toArray());
   }
   for(let r=0;r<rings;r++)for(let i=0;i<n;i++){const a=r*n+i,b=r*n+(i+1)%n,c=a+n,d=b+n;if(r)I.push(a,b,d);I.push(a,d,c);}
   const g=k.geometry(P,I),patch=k.mesh('GiraffeBodyPatch'+count++,g,k.solid('GiraffeBodyPatchColor','#9b6b3c'),torso.group);patch.material.side=T.DoubleSide;patch.userData.skipOriginalPaint=true;
  }
  carrier.geometry.dispose();carrier.material.dispose();
 }
 if(id==='animal-hedgehog'){
  const hood=head.group.getObjectByName('MeasuredCostumeHoodSurface');
  const oldHood=new T.Mesh(hood.geometry.clone(),new T.MeshBasicMaterial({side:T.DoubleSide}));oldHood.updateMatrixWorld(true);
  for(const name of ['MeasuredCostumeHood','HedgehogQuillCoat']){
   const a=head.group.getObjectByName(name+'Surface'),b=head.group.getObjectByName(name+'Back');
   if(name==='HedgehogQuillCoat')for(const mesh of [a,b]){const p=mesh.geometry.attributes.position;for(let i=0;i<p.count;i++)p.setZ(i,(p.getZ(i)+.65)*.82-.30);}
   const base=(a.geometry.attributes.position.getZ(0)+b.geometry.attributes.position.getZ(0))/2;
   for(const mesh of [a,b]){
  const p=mesh.geometry.attributes.position,samples=p.count/13,edge=Array.from({length:samples},(_,i)=>new T.Vector3().fromBufferAttribute(p,12*samples+i)),center=new T.Vector3().fromBufferAttribute(p,0);center.z=0;
  let smooth=edge.map(v=>v.clone());for(let pass=0;pass<4;pass++)smooth=smooth.map((v,i)=>{const sum=v.clone().multiplyScalar(2);for(const d of [-3,-2,-1,1,2,3])sum.add(smooth[(i+d+samples)%samples]);return sum.multiplyScalar(1/8);});
  const P=[],I=[],rings=32,depth=p.getZ(0)-base;
  for(let ring=0;ring<=rings;ring++){const angle=ring/rings*Math.PI/2,r=Math.sin(angle),w=Math.max(0,(r-.94)/.06)**3;for(let i=0;i<samples;i++){const v=center.clone().lerp(smooth[i],r).addScaledVector(edge[i].clone().sub(smooth[i]),w);P.push(v.x,v.y,base+depth*Math.cos(angle));}}
  for(let ring=0;ring<rings;ring++)for(let i=0;i<samples;i++){const a=ring*samples+i,b=ring*samples+(i+1)%samples,c=a+samples,d=b+samples;if(depth<0){if(ring)I.push(a,d,b);I.push(a,c,d);}else{if(ring)I.push(a,b,d);I.push(a,d,c);}}
  const g=k.geometry(P,I);if((g.attributes.normal.getZ(samples*4)>0)!==(depth>0)){for(let i=0;i<I.length;i+=3)[I[i+1],I[i+2]]=[I[i+2],I[i+1]];g.setIndex(I);g.computeVertexNormals();}
  const N=g.attributes.normal;for(let pass=0;pass<3;pass++){const next=N.array.slice();for(let ring=0;ring<=rings;ring++)for(let i=0;i<samples;i++){const v=new T.Vector3();for(let d=-3;d<=3;d++)v.addScaledVector(new T.Vector3().fromBufferAttribute(N,ring*samples+(i+d+samples)%samples),4-Math.abs(d));next.set(v.normalize().toArray(),(ring*samples+i)*3);}N.array.set(next);}
  mesh.geometry.dispose();mesh.geometry=g;
    mesh.userData.paddedBoundary=edge;
   }
  }
  const newHood=new T.Mesh(hood.geometry,new T.MeshBasicMaterial({side:T.DoubleSide}));newHood.updateMatrixWorld(true);
  for(const mesh of head.group.children.filter(o=>o.name.startsWith('AnimalMuzzle')&&!o.material.userData.originalTexture)){
   const p=mesh.geometry.attributes.position;for(let i=0;i<p.count;i++){const ray=new T.Raycaster(new T.Vector3(p.getX(i),p.getY(i),3),new T.Vector3(0,0,-1)),old=ray.intersectObject(oldHood)[0],next=ray.intersectObject(newHood)[0];if(old&&next)p.setZ(i,p.getZ(i)+next.point.z-old.point.z);}mesh.geometry.computeVertexNormals();
  }
  oldHood.geometry.dispose();oldHood.material.dispose();newHood.material.dispose();
  const coat=new T.Mesh(head.group.getObjectByName('HedgehogQuillCoatBack').geometry,new T.MeshBasicMaterial({side:T.DoubleSide}));coat.updateMatrixWorld(true);
  for(const quill of head.group.children.filter(o=>o.name.startsWith('RearHedgehogQuill')&&!o.material.userData.originalTexture)){
   const ray=new T.Raycaster(new T.Vector3(quill.position.x,quill.position.y,-3),new T.Vector3(0,0,1)),hit=ray.intersectObject(coat)[0];
   if(!hit){head.group.remove(quill);continue;}
   const normal=hit.face.normal.clone();if(normal.z>0)normal.negate();const h=quill.geometry.parameters.height;
   quill.position.copy(hit.point).addScaledVector(normal,h/2-.025);quill.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),normal);quill.userData.skipOriginalPaint=true;
  }coat.material.dispose();
 }
};
