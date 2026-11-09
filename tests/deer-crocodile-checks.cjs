"use strict";
module.exports=function(T,root,clips,check,id){
 const croc=id==='animal-crocodile';root.updateMatrixWorld(true);
 const pair=n=>['Surface','Back'].map(s=>root.getObjectByName(n+s));
 const hood=croc?pair('ReptileCostumeHood'):[root.getObjectByName('CostumeHood')],mainBody=pair('CompactCostumeBody'),body=croc?[...mainBody,...pair('CrocodileBackSupport')]:mainBody;
 const inside=(mesh,supports)=>{
  const p=mesh.geometry.attributes.position,mats=new Map(supports.map(o=>[o.material,o.material.side]));for(const m of mats.keys())m.side=T.DoubleSide;
  let count=0;for(let j=0;j<160;j++){
   const v=mesh.localToWorld(new T.Vector3().fromBufferAttribute(p,Math.floor(j*p.count/160))),hits=new T.Raycaster(v,new T.Vector3(.023,.019,1).normalize()).intersectObjects(supports),ds=[];
   for(const h of hits)if(!ds.some(d=>Math.abs(d-h.distance)<1e-5))ds.push(h.distance);if(ds.length%2)count++;
  }
  for(const[m,side]of mats)m.side=side;return count;
 };
 const closed=meshes=>{const edges=new Map();for(const o of meshes){const p=o.geometry.attributes.position,ix=o.geometry.index,coord=i=>[p.getX(i),p.getY(i),p.getZ(i)].map(v=>Math.round(v*1e5)).join(',');for(let i=0;i<ix.count;i+=3){const vs=[0,1,2].map(j=>coord(ix.getX(i+j)));if(new Set(vs).size<3)continue;for(let j=0;j<3;j++){const key=[vs[j],vs[(j+1)%3]].sort().join('|');edges.set(key,(edges.get(key)||0)+1);}}}check([...edges.values()].every(n=>n===2),'garden open solid: '+meshes[0].name);};

 const pairs=[];root.traverse(o=>{if(o.isMesh&&o.name.endsWith('Surface')&&!o.material.userData.originalTexture)pairs.push(pair(o.name.replace(/Surface$/,'')));});for(const p of pairs)closed(p);if(!croc)closed(hood);
 const contact=(a,b)=>a.some(o=>inside(o,b)>0)||b.some(o=>inside(o,a)>0);
 if(croc){
  check(contact(pair('CrocodileBackSupport'),mainBody),'crocodile back support detached from torso');
  const snout=pair('LongCrocodileSnout');check(contact(snout,hood),'crocodile snout detached');
  for(let i=0;i<6;i++)check(contact(pair('RoundedCrocodileTooth'+i),snout),'crocodile tooth detached: '+i);
  for(let i=0;i<3;i++)check(contact(pair('CrocodileBackCrest'+i),body),'crocodile dorsal crest detached: '+i);
 }else for(const name of ['DeerEar-1','DeerEar1','DeerAntler-1','DeerAntler1','AnimalMuzzle'])check(contact(pair(name),hood),'deer feature detached: '+name);
 const art=root.getObjectByName((croc?'ReptileCostumeHoodSurface':'CostumeHood')+'OriginalPaint'),an=art.geometry.attributes.normal,ac=art.geometry.attributes.color;
 for(let i=0;i<ac.count;i++)if(Math.abs(an.getZ(i))<.1)check(ac.getW(i)<.01,'deer/crocodile source outline leaks onto flank');
 const limbPairs=['LeftArm','RightArm','LeftLeg','RightLeg'].map(n=>pair('Compact'+n));
 const saved=[];root.traverse(o=>saved.push([o,o.position.clone(),o.quaternion.clone(),o.scale.clone()]));
 for(const clip of clips){const mixer=new T.AnimationMixer(root);mixer.clipAction(clip).play();for(const phase of [0,.125,.25,.5,.75]){
  mixer.setTime(clip.duration*phase);root.updateMatrixWorld(true);
  check(contact(body,hood),'deer/crocodile torso detached: '+clip.name+' '+phase);
  for(const limb of limbPairs)check(contact(limb,body),'deer/crocodile limb detached: '+limb[0].name+' '+clip.name+' '+phase);
  if(croc)check(contact(pair('BroadReptileTail'),body),'crocodile tail detached: '+clip.name+' '+phase);
  if(clip.name==='Wave'){
   const arm=pair('CompactRightArm')[0],p=arm.geometry.attributes.position;let min=Infinity,max=-Infinity;for(let i=0;i<p.count;i++){min=Math.min(min,p.getY(i));max=Math.max(max,p.getY(i));}
   const point=new T.Vector3();let count=0;for(let i=0;i<p.count;i++)if(p.getY(i)<min+(max-min)*.2){point.add(new T.Vector3().fromBufferAttribute(p,i));count++;}arm.localToWorld(point.multiplyScalar(1/count));
   const sides=hood.map(o=>o.material.side);hood.forEach(o=>o.material.side=T.DoubleSide);const hits=new T.Raycaster(point,new T.Vector3(.023,.019,1).normalize()).intersectObjects(hood),ds=[];for(const h of hits)if(!ds.some(d=>Math.abs(d-h.distance)<1e-5))ds.push(h.distance);hood.forEach((o,i)=>o.material.side=sides[i]);check(ds.length%2===0,'deer/crocodile greeting hand hidden inside hood');
  }
 }mixer.stopAllAction();}
 for(const[o,p,q,s]of saved){o.position.copy(p);o.quaternion.copy(q);o.scale.copy(s);}root.updateMatrixWorld(true);
};
