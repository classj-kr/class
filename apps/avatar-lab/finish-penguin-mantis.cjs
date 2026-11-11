"use strict";
module.exports=function(T,k,id,parts){
 if(!['animal-penguin','animal-praying-mantis'].includes(id))return;
 const penguin=id==='animal-penguin',head=parts.get('Head'),hoodName=penguin?'MeasuredCostumeHood':'WholeGardenHood';
 const a=head.group.getObjectByName(hoodName+'Surface'),b=head.group.getObjectByName(hoodName+'Back');
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

 if(penguin){
  for(const mesh of [a,b])mesh.material.color.set('#37383d').convertSRGBToLinear();
  for(const [name,part]of parts)if(name!=='Head')for(const mesh of part.group.children.filter(o=>o.isMesh&&!o.material.userData.originalTexture)){
   mesh.material.color.set(name.includes('Leg')?'#e9a82f':'#37383d').convertSRGBToLinear();
   if(name!=='Torso')mesh.userData.skipOriginalPaint=true;
  }
 }else{
  for(const o of [...head.group.children])if(o.name.startsWith('GardenHoodPiping'))head.group.remove(o);
  for(const mesh of [...head.group.children])if(mesh.name.startsWith('FittedMantisCompoundEye'))head.group.remove(mesh);
  const sculpt=require('./sculpt-kit.cjs')(T,k,head);
  for(const side of [-1,1])sculpt.ellipsoid('RoundedMantisCompoundEye'+side,[320+side*110,205,.25],[44,65,.30],'#a9ac43',side*.60);
  for(const [name,part]of parts)for(const mesh of part.group.children.filter(o=>o.isMesh&&!o.material.userData.originalTexture))if(['LeftArm','RightArm','LeftLeg','RightLeg'].includes(name)||/^(TaperedMantisAntenna|BentMantisSideLeg|MantisSideFoot)/.test(mesh.name))mesh.userData.skipOriginalPaint=true;
 }
};
