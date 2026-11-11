"use strict";
module.exports=function(T,k,id,parts){
 if(!['animal-whale','animal-wolf'].includes(id))return;
 const whale=id==='animal-whale',head=parts.get('Head'),hoodName=whale?'MeasuredCostumeHood':'ShapedCanineHood',smooth=require('./smooth-paired-volume.cjs');
 const old=new T.Mesh(head.group.getObjectByName(hoodName+'Surface').geometry.clone(),new T.MeshBasicMaterial({side:T.DoubleSide}));old.updateMatrixWorld(true);
 for(const name of [hoodName,...(whale?['HeadFlipper-1','HeadFlipper1','WaterSpout']:['CanineEar-1','CanineEar1'])])smooth(T,k,head.group,name);
 if(!whale){
  const current=new T.Mesh(head.group.getObjectByName(hoodName+'Surface').geometry,new T.MeshBasicMaterial({side:T.DoubleSide}));current.updateMatrixWorld(true);
  for(const mesh of head.group.children.filter(o=>o.isMesh&&o.name.startsWith('AnimalMuzzle')&&!o.material.userData.originalTexture)){
   const p=mesh.geometry.attributes.position;for(let i=0;i<p.count;i++){const ray=new T.Raycaster(new T.Vector3(p.getX(i),p.getY(i),3),new T.Vector3(0,0,-1)),a=ray.intersectObject(old)[0],b=ray.intersectObject(current)[0];if(a&&b)p.setZ(i,p.getZ(i)+b.point.z-a.point.z);}mesh.geometry.computeVertexNormals();
  }current.material.dispose();
  const tail=parts.get('Tail');smooth(T,k,tail.group,'AttachedCanineTail');
  for(const suffix of ['Surface','Back']){
   const mesh=tail.group.getObjectByName('AttachedCanineTail'+suffix),p=mesh.geometry.attributes.position;mesh.material.color.set('#979ba4').convertSRGBToLinear();delete mesh.material.userData.preserveVertexColor;
   for(let i=0;i<p.count;i++){const x=p.getX(i)/.005+tail.part.pivot[0],w=Math.max(0,Math.min(1,(420-x)/70));p.setXYZ(i,p.getX(i)-.15*w,p.getY(i),p.getZ(i)+.23*w);}mesh.geometry.computeVertexNormals();
   mesh.userData.artworkExcludedRegions=[{cx:320,cy:490,rx:76,ry:80},{cx:392,cy:495,rx:24,ry:32}];
  }
 }
 old.geometry.dispose();old.material.dispose();
 const colour=whale?'#4f9ed1':'#999ca4';
 for(const [name,part]of parts)for(const mesh of part.group.children.filter(o=>o.isMesh&&!o.material.userData.originalTexture)){
  if(!/^(WaterSpout|AnimalMuzzle|AttachedCanineTail)/.test(mesh.name))mesh.material.color.set(colour).convertSRGBToLinear();
  if(['LeftArm','RightArm','LeftLeg','RightLeg'].includes(name)){
   mesh.userData.skipOriginalPaint=true;
   if(!whale&&name.endsWith('Arm')){const p=mesh.geometry.attributes.position,C=[],gray=new T.Color(colour).convertSRGBToLinear(),cream=new T.Color('#ece8e3').convertSRGBToLinear();for(let i=0;i<p.count;i++){const y=part.part.pivot[1]-p.getY(i)/.005;C.push(...gray.clone().lerp(cream,Math.max(0,Math.min(1,(y-493)/5))).toArray());}mesh.geometry.setAttribute('color',new T.Float32BufferAttribute(C,3));mesh.material.color.set(0xffffff);mesh.material.userData.preserveVertexColor=true;}
  }
 }
};
