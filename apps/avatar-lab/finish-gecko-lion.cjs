"use strict";
module.exports=function(T,k,id,parts){
 if(!['animal-leopard-gecko','animal-lion'].includes(id))return;
 const gecko=id==='animal-leopard-gecko';
 const head=parts.get('Head'),name=gecko?'ReptileCostumeHood':'FullLionMane',a=head.group.getObjectByName(name+'Surface'),b=head.group.getObjectByName(name+'Back');
 const oldHood=new T.Mesh(a.geometry.clone(),new T.MeshBasicMaterial({side:T.DoubleSide}));oldHood.updateMatrixWorld(true);
 for(const [part,partName] of [[head,name],...(gecko?[[parts.get('Tail'),'BroadReptileTail']]:[])]){
 const a=part.group.getObjectByName(partName+'Surface'),b=part.group.getObjectByName(partName+'Back');
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
 const newHood=new T.Mesh(a.geometry,new T.MeshBasicMaterial({side:T.DoubleSide}));newHood.updateMatrixWorld(true);
 for(const mesh of head.group.children.filter(o=>o.isMesh&&gecko&&/^(GeckoEyeRidge|GeckoSmileMuzzle)/.test(o.name)&&!o.material.userData.originalTexture)){
  const p=mesh.geometry.attributes.position;for(let i=0;i<p.count;i++){
   const ray=new T.Raycaster(new T.Vector3(p.getX(i),p.getY(i),3),new T.Vector3(0,0,-1)),old=ray.intersectObject(oldHood)[0],next=ray.intersectObject(newHood)[0];
   if(old&&next)p.setZ(i,p.getZ(i)+next.point.z-old.point.z);
  }mesh.geometry.computeVertexNormals();
 }
 oldHood.geometry.dispose();oldHood.material.dispose();newHood.material.dispose();
 if(!gecko){
  head.skipNeckJoin=true;
  // The upper body sits behind the lower mane rim. Its rounded belly used
  // to break through the tapered mane and print yellow loops over the hair.
  const mane=head.group.getObjectByName('FullLionManeSurface');k.root.updateMatrixWorld(true);
  for(const partName of ['Torso','LeftArm','RightArm'])for(const mesh of parts.get(partName).group.children.filter(o=>o.isMesh&&!o.material.userData.originalTexture)){
   mesh.updateMatrix();mesh.geometry=mesh.geometry.clone().applyMatrix4(mesh.matrix);mesh.position.set(0,0,0);mesh.rotation.set(0,0,0);mesh.scale.set(1,1,1);k.root.updateMatrixWorld(true);
   const p=mesh.geometry.attributes.position;
   for(let i=0;i<p.count;i++){
    const v=mesh.localToWorld(new T.Vector3().fromBufferAttribute(p,i)),hit=new T.Raycaster(new T.Vector3(v.x,v.y,3),new T.Vector3(0,0,-1)).intersectObject(mane)[0];
    if(hit&&v.z>hit.point.z-.025){v.z=hit.point.z-.025;mesh.worldToLocal(v);p.setXYZ(i,v.x,v.y,v.z);}
   }mesh.geometry.computeVertexNormals();
  }
  return;
 }
 head.acceptPattern=false;
 // Spots follow the actual curved rear, including the broad tail, rather
 // than projecting floating planar polygons or mirroring the human face.
 function spots(part,surfaceName,locations){
  const carrier=new T.Mesh(part.group.getObjectByName(surfaceName+'Back').geometry,new T.MeshBasicMaterial({side:T.DoubleSide}));carrier.updateMatrixWorld(true);
  for(const [j,[cx,cy,rx,ry]] of locations.entries()){
   const P=[],I=[],n=32,rings=6;let valid=true;
   for(let row=0;row<=rings;row++)for(let i=0;i<n;i++){
    const a=i/n*Math.PI*2,f=1+.12*Math.sin(a*3+j)+.07*Math.cos(a*5-j),x=(cx+Math.cos(a)*rx*f*row/rings-part.part.pivot[0])*.005,y=(part.part.pivot[1]-cy-Math.sin(a)*ry*f*row/rings)*.005;
    const hit=new T.Raycaster(new T.Vector3(x,y,-3),new T.Vector3(0,0,1)).intersectObject(carrier)[0];
    if(!hit){valid=false;break;}P.push(x,y,hit.point.z-.004);
   }
   if(!valid)continue;
   for(let row=0;row<rings;row++)for(let i=0;i<n;i++){const a=row*n+i,b=row*n+(i+1)%n,c=a+n,d=b+n;if(row)I.push(a,d,b);I.push(a,c,d);}
   const mat=k.solid('GeckoSpotColor','#805124');mat.side=T.DoubleSide;
   const patch=k.mesh('GeckoRearSpot'+surfaceName+j,k.geometry(P,I),mat,part.group);patch.userData.skipOriginalPaint=true;patch.userData.spotSupport=surfaceName+'Back';
  }carrier.material.dispose();
 }
 spots(head,name,[[245,143,15,12],[300,119,19,13],[354,128,16,11],[403,155,17,13],[201,211,15,13],[255,201,11,9],[323,179,19,13],[376,218,16,12],[441,239,13,16],[211,283,15,14],[278,261,16,12],[338,269,10,10],[393,285,17,12],[232,346,14,12],[300,329,20,14],[367,348,16,12],[302,388,12,9]]);
 spots(parts.get('Tail'),'BroadReptileTail',[[380,457,12,11],[420,441,16,12],[463,433,13,16],[503,402,9,13],[503,462,13,14],[463,483,17,14],[410,489,11,12],[382,525,13,10],[443,534,14,10],[492,514,13,11]]);
 spots(parts.get('Torso'),'CompactCostumeBody',[[283,452,8,9],[326,447,9,8],[351,477,8,10],[285,498,8,10],[323,486,9,9],[326,521,8,8]]);
};
