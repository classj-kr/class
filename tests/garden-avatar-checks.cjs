"use strict";
module.exports=function(T,root,clips,check,id){
 const bee=id==='animal-bee';root.updateMatrixWorld(true);
 const pair=n=>['Surface','Back'].map(s=>root.getObjectByName(n+s));
 const hood=pair('WholeGardenHood'),body=pair('CompactGardenAbdomen');
 const inside=(mesh,supports)=>{
  const p=mesh.geometry.attributes.position,mats=new Map(supports.map(o=>[o.material,o.material.side]));for(const m of mats.keys())m.side=T.DoubleSide;
  let count=0;for(let j=0;j<160;j++){
   const v=mesh.localToWorld(new T.Vector3().fromBufferAttribute(p,Math.floor(j*p.count/160))),hits=new T.Raycaster(v,new T.Vector3(.023,.019,1).normalize()).intersectObjects(supports),ds=[];
   for(const h of hits)if(!ds.some(d=>Math.abs(d-h.distance)<1e-5))ds.push(h.distance);if(ds.length%2)count++;
  }
  for(const[m,side]of mats)m.side=side;return count;
 };
 const closed=meshes=>{const edges=new Map();for(const o of meshes){const p=o.geometry.attributes.position,ix=o.geometry.index,coord=i=>[p.getX(i),p.getY(i),p.getZ(i)].map(v=>Math.round(v*1e5)).join(',');for(let i=0;i<ix.count;i+=3){const vs=[0,1,2].map(j=>coord(ix.getX(i+j)));if(new Set(vs).size<3)continue;for(let j=0;j<3;j++){const key=[vs[j],vs[(j+1)%3]].sort().join('|');edges.set(key,(edges.get(key)||0)+1);}}}check([...edges.values()].every(n=>n===2),'garden open solid: '+meshes[0].name);};
 const pairs=[];root.traverse(o=>{if(o.name.endsWith('Surface')&&!o.material.userData.originalTexture)pairs.push(pair(o.name.replace(/Surface$/,'')));});for(const p of pairs)closed(p);
 const antenna=[-1,1].map(s=>root.getObjectByName((bee?'BeeCurvedAntenna':'CurledButterflyAntenna')+s));
 for(const o of antenna){closed([o]);check(inside(o,hood)>0,'garden antenna floats above hood: '+o.name);}
 check(!root.getObjectByName('GardenHoodPiping'),'hood must not draw a meridian in profile');
 const paint=root.getObjectByName('WholeGardenHoodSurfaceOriginalPaint'),p=paint.geometry.attributes.position,c=paint.geometry.attributes.color,n=paint.geometry.attributes.normal;
 for(let i=0;i<p.count;i++)if(Math.abs(n.getZ(i))<.1)check(c.getW(i)<.01,'garden source contour leaks onto flank');
 for(const name of ['Torso','LeftArm','RightArm','LeftLeg','RightLeg'])check(root.getObjectByName(name).children.every(o=>!o.isMesh||!o.material.userData.originalTexture),'foreground artwork leaks onto '+name);
 const limbs=['LeftArm','RightArm','LeftLeg','RightLeg'].map(name=>bee&&name==='RightArm'?[root.getObjectByName('BeeHeldArm')]:pair(name+'Form'));
 const wings=[-1,1].map(s=>[...pair('UpperGardenWing'+s),...pair('LowerGardenWing'+s)]);
 const saved=[];root.traverse(o=>saved.push([o,o.position.clone(),o.quaternion.clone(),o.scale.clone()]));
 for(const clip of clips){const mixer=new T.AnimationMixer(root);mixer.clipAction(clip).play();for(const phase of [0,.125,.25,.5,.75]){
  mixer.setTime(clip.duration*phase);root.updateMatrixWorld(true);
  check(inside(body[0],hood)>1,'garden torso detached: '+clip.name+' '+phase);
  for(const limb of limbs)check(limb.some(o=>inside(o,body)>1),'garden limb detached: '+limb[0].name+' '+clip.name+' '+phase);
  for(const wing of wings)for(const offset of [0,2])check(wing.slice(offset,offset+2).some(o=>inside(o,body)>0),'garden wing root detached: '+wing[offset].name+' '+clip.name+' '+phase);
  if(bee){const hand=root.getObjectByName('BeeHoldingHand'),handle=root.getObjectByName('HoneyDipperHandle'),tip=root.getObjectByName('HoneyDipperHead');check(inside(handle,[hand])>0,'bee grip detached');check(inside(handle,[tip])>0,'honey dipper handle detached');}
 }mixer.stopAllAction();}
 for(const[o,p,q,s]of saved){o.position.copy(p);o.quaternion.copy(q);o.scale.copy(s);}root.updateMatrixWorld(true);
};
