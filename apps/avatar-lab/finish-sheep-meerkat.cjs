"use strict";
module.exports=function(T,k,id,parts){
 if(!['animal-llama','animal-meerkat'].includes(id))return;
 if(id==='animal-meerkat'){
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

 oldHood.geometry.dispose();oldHood.material.dispose();
 const tail=parts.get('Tail').group.getObjectByName('AttachedTail'),p=tail.geometry.attributes.position,C=[];
 for(let i=0;i<p.count;i++){
  const start=Math.min(64,Math.floor(i/16))*16;let y=0;for(let j=0;j<16;j++)y+=p.getY(start+j)/16;
  const t=Math.max(0,Math.min(1,(p.getY(i)-y+.015)/.035)),c=new T.Color('#d9b681').convertSRGBToLinear().lerp(new T.Color('#795030').convertSRGBToLinear(),t);C.push(...c.toArray());
 }
 tail.geometry.setAttribute('color',new T.Float32BufferAttribute(C,3));tail.material.color.set(0xffffff);tail.material.userData.preserveVertexColor=true;
 for(const name of ['LeftLeg','RightLeg'])for(const mesh of parts.get(name).group.children.filter(o=>o.isMesh&&!o.material.userData.originalTexture)){
  const p=mesh.geometry.attributes.position,C=[];for(let i=0;i<p.count;i++){const y=parts.get(name).part.pivot[1]-p.getY(i)/.005,t=Math.max(0,Math.min(1,(y-509)/5)),c=new T.Color('#c6a473').convertSRGBToLinear().lerp(new T.Color('#795030').convertSRGBToLinear(),t);C.push(...c.toArray());}mesh.geometry.setAttribute('color',new T.Float32BufferAttribute(C,3));mesh.material.color.set(0xffffff);mesh.material.userData.preserveVertexColor=true;
 }
 return;
 }
 const head=parts.get('Head'),hood=head.group.getObjectByName('CostumeHood');
 for(const o of [...head.group.children])if(/^(RearFleeceCurl|FleeceCurl)/.test(o.name))head.group.remove(o);
 // Blend shallow wool lobes into a single closed surface. Separate rear
 // spheres looked like beads glued to the hood and projected source streaks.
 const g=new T.SphereGeometry(1,128,96),p=g.attributes.position,seeds=[];
 for(let i=0;i<44;i++){const y=1-2*(i+.5)/44,r=Math.sqrt(1-y*y),a=i*2.399963,q=new T.Vector3(Math.cos(a)*r,y,Math.sin(a)*r);if(q.z<-.08)seeds.push(q);}
 const rimSeeds=Array.from({length:24},(_,i)=>new T.Vector3(Math.cos(i/24*Math.PI*2),Math.sin(i/24*Math.PI*2),0));
 for(let i=0;i<p.count;i++){
  const q=new T.Vector3().fromBufferAttribute(p,i),fade=Math.max(0,Math.min(1,(-q.z-.02)/.35));let lift=0;
  for(const seed of seeds)lift+=.055*Math.exp(-q.distanceToSquared(seed)/.035);
  let rim=0;for(const seed of rimSeeds)rim+=.055*Math.exp(-q.distanceToSquared(seed)/.009);
  q.multiplyScalar(1+lift*fade+rim);p.setXYZ(i,q.x,q.y,q.z);
 }
 g.computeVertexNormals();hood.geometry.dispose();hood.geometry=g;
 for(const name of ['LeftArm','RightArm','LeftLeg','RightLeg'])for(const mesh of parts.get(name).group.children.filter(o=>o.isMesh&&!o.material.userData.originalTexture)){
  const p=mesh.geometry.attributes.position,C=[],pivot=parts.get(name).part.pivot;
  for(let i=0;i<p.count;i++){
   const y=pivot[1]-p.getY(i)/.005,cut=name.endsWith('Leg')?552:488,t=Math.max(0,Math.min(1,(y-cut)/7)),c=new T.Color('#e9d9b9').convertSRGBToLinear().lerp(new T.Color('#997557').convertSRGBToLinear(),t);C.push(...c.toArray());
  }mesh.geometry.setAttribute('color',new T.Float32BufferAttribute(C,3));mesh.material.color.set(0xffffff);mesh.material.userData.preserveVertexColor=true;
 }
};
