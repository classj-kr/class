"use strict";
module.exports=function(T,root,clips,check,id){
 root.updateMatrixWorld(true);
 const dog=id==='animal-dog',dragon=id==='animal-dragon',insect=id==='animal-dragonfly',duck=id==='animal-duck',eagle=id==='animal-eagle',pair=n=>['Surface','Back'].map(s=>root.getObjectByName(n+s));
 const hoodName=dragon?'ReptileCostumeHood':insect?'RoundedInsectHood':'MeasuredCostumeHood';
 const hood=duck?[root.getObjectByName('CostumeHood')]:pair(hoodName),body=pair(insect?'ShortSegmentedAbdomen':'CompactCostumeBody'),tail=insect||duck?null:dog?[root.getObjectByName('AttachedTail')]:pair(dragon?'BroadReptileTail':eagle?'CostumeTail':'FullMarineTail');
 const inside=(mesh,supports)=>{
  const p=mesh.geometry.attributes.position,mats=new Map(supports.map(o=>[o.material,o.material.side]));for(const m of mats.keys())m.side=T.DoubleSide;
  let count=0;for(let j=0;j<160;j++){
   const v=mesh.localToWorld(new T.Vector3().fromBufferAttribute(p,Math.floor(j*p.count/160))),hits=new T.Raycaster(v,new T.Vector3(.023,.019,1).normalize()).intersectObjects(supports),ds=[];
   for(const h of hits)if(!ds.some(d=>Math.abs(d-h.distance)<1e-5))ds.push(h.distance);if(ds.length%2)count++;
  }
  for(const[m,side]of mats)m.side=side;return count;
 };
 const contact=(a,b)=>a.some(o=>inside(o,b)>0)||b.some(o=>inside(o,a)>0);
 const closed=meshes=>{
  const edges=new Map(),normals=new Map();
  for(const o of meshes){
   const p=o.geometry.attributes.position,n=o.geometry.attributes.normal,ix=o.geometry.index,coord=i=>[p.getX(i),p.getY(i),p.getZ(i)].map(v=>Math.round(v*1e5)).join(',');
   for(let i=0;i<ix.count;i+=3){const vs=[0,1,2].map(j=>coord(ix.getX(i+j)));if(new Set(vs).size<3)continue;for(let j=0;j<3;j++){const key=[vs[j],vs[(j+1)%3]].sort().join('|');edges.set(key,(edges.get(key)||0)+1);}}
   if(meshes.length>1)for(let i=0;i<p.count;i++){const key=coord(i),v=new T.Vector3().fromBufferAttribute(n,i);if(normals.has(key))check(v.dot(normals.get(key))>.995,'padded suit split rim shading: '+o.name);else normals.set(key,v);}
  }
  check([...edges.values()].every(n=>n===2),'padded suit open solid: '+meshes[0].name);
 };
 root.traverse(o=>{if(o.isMesh&&o.name.endsWith('Surface')&&!o.material.userData.originalTexture)closed(pair(o.name.replace(/Surface$/,'')));});if(dog)closed(tail);
 if(duck){closed(hood);closed([root.getObjectByName('AnimalMuzzle')]);check(contact([root.getObjectByName('AnimalMuzzle')],hood),'duck bill detached');}
 for(const name of dog?['DroopingEar-1','DroopingEar1','AnimalMuzzle']:dragon?['DragonForeheadCrest','DragonBroadMuzzle','DragonEyeRidge-1','DragonEyeRidge1']:insect?[]:duck?['DuckCrest']:eagle?['WideEagleBeak']:['HeadFlipper-1','HeadFlipper1','AnimalMuzzle'])check(contact(pair(name),hood),'padded suit detached feature: '+name);
 if(dog){for(const name of ['DogNose','Tongue'])check(contact(pair(name),pair('AnimalMuzzle')),'dog muzzle feature detached: '+name);check(contact([root.getObjectByName('RoundedDogTailTip')],tail),'dog tail tip detached');}
 if(dragon)for(let i=0;i<3;i++)check(contact(pair('DragonTailCrest'+i),tail),'dragon tail crest detached: '+i);
 if(insect)for(const side of [-1,1]){const antenna=[root.getObjectByName('CurvedInsectAntenna'+side)],tip=[root.getObjectByName('RoundedAntennaTip'+side)];closed(antenna);check(contact(antenna,hood)&&contact(tip,antenna),'dragonfly antenna detached');}
 const art=root.getObjectByName(duck?'CostumeHoodOriginalPaint':hoodName+'SurfaceOriginalPaint'),an=art.geometry.attributes.normal,ac=art.geometry.attributes.color;let flank=0;
 for(let i=0;i<ac.count;i++)if(Math.abs(an.getZ(i))<.1){flank++;check(ac.getW(i)<.01,'padded suit source outline leaks onto flank');}check(flank>20,'padded suit flank not checked');
 const saved=[];root.traverse(o=>saved.push([o,o.position.clone(),o.quaternion.clone(),o.scale.clone()]));
 for(const clip of clips){const mixer=new T.AnimationMixer(root);mixer.clipAction(clip).play();for(const phase of [0,.125,.25,.5,.75]){
  mixer.setTime(clip.duration*phase);root.updateMatrixWorld(true);
  check(contact(body,hood),'padded suit torso detached: '+clip.name+' '+phase);
  for(const name of ['LeftArm','RightArm','LeftLeg','RightLeg'])check(contact(pair(insect?name+'Form':'Compact'+name),body),'padded suit limb detached: '+name+' '+clip.name+' '+phase);
  if(tail)check(contact(tail,body),'padded suit tail detached: '+clip.name+' '+phase);
  if(insect)for(const side of [-1,1]){const hinge=[root.getObjectByName('AttachedWingHinge'+side)];check(contact(hinge,body),'dragonfly wing hinge detached: '+side+' '+clip.name+' '+phase);for(const level of ['Upper','Lower'])check(contact(pair(level+'DragonflyWing'+side),hinge),'dragonfly wing detached from hinge: '+level+side+' '+clip.name+' '+phase);}
  if(clip.name==='Wave'){
   const arm=pair(insect?'RightArmForm':'CompactRightArm')[0],p=arm.geometry.attributes.position;let min=Infinity,max=-Infinity;for(let i=0;i<p.count;i++){min=Math.min(min,p.getY(i));max=Math.max(max,p.getY(i));}
   const point=new T.Vector3();let count=0;for(let i=0;i<p.count;i++)if(p.getY(i)<min+(max-min)*.2){point.add(new T.Vector3().fromBufferAttribute(p,i));count++;}arm.localToWorld(point.multiplyScalar(1/count));
   const sides=hood.map(o=>o.material.side);hood.forEach(o=>o.material.side=T.DoubleSide);const hits=new T.Raycaster(point,new T.Vector3(.023,.019,1).normalize()).intersectObjects(hood),ds=[];for(const h of hits)if(!ds.some(d=>Math.abs(d-h.distance)<1e-5))ds.push(h.distance);hood.forEach((o,i)=>o.material.side=sides[i]);check(ds.length%2===0,'padded suit greeting hand hidden inside hood');
  }
 }mixer.stopAllAction();}
 for(const[o,p,q,s]of saved){o.position.copy(p);o.quaternion.copy(q);o.scale.copy(s);}root.updateMatrixWorld(true);
};
