"use strict";
module.exports=function(T,root,clips,check,id){
 const crab=id==='animal-crab';root.updateMatrixWorld(true);
 const pair=n=>['Surface','Back'].map(s=>root.getObjectByName(n+s));
 const hood=pair(crab?'WholeCoastalHood':'ReptileCostumeHood'),body=pair(crab?'ShortCrabBody':'CompactCostumeBody');
 const inside=(mesh,supports)=>{
  const p=mesh.geometry.attributes.position,mats=new Map(supports.map(o=>[o.material,o.material.side]));for(const m of mats.keys())m.side=T.DoubleSide;
  let count=0;for(let j=0;j<160;j++){
   const v=mesh.localToWorld(new T.Vector3().fromBufferAttribute(p,Math.floor(j*p.count/160))),hits=new T.Raycaster(v,new T.Vector3(.023,.019,1).normalize()).intersectObjects(supports),ds=[];
   for(const h of hits)if(!ds.some(d=>Math.abs(d-h.distance)<1e-5))ds.push(h.distance);if(ds.length%2)count++;
  }
  for(const[m,side]of mats)m.side=side;return count;
 };
 const closed=meshes=>{const edges=new Map();for(const o of meshes){const p=o.geometry.attributes.position,ix=o.geometry.index,coord=i=>[p.getX(i),p.getY(i),p.getZ(i)].map(v=>Math.round(v*1e5)).join(',');for(let i=0;i<ix.count;i+=3){const vs=[0,1,2].map(j=>coord(ix.getX(i+j)));if(new Set(vs).size<3)continue;for(let j=0;j<3;j++){const key=[vs[j],vs[(j+1)%3]].sort().join('|');edges.set(key,(edges.get(key)||0)+1);}}}check([...edges.values()].every(n=>n===2),'garden open solid: '+meshes[0].name);};

 const pairs=[];root.traverse(o=>{if(o.isMesh&&o.name.endsWith('Surface')&&!o.material.userData.originalTexture)pairs.push(pair(o.name.replace(/Surface$/,'')));});for(const p of pairs)closed(p);
 const art=root.getObjectByName((crab?'WholeCoastalHood':'ReptileCostumeHood')+'SurfaceOriginalPaint'),an=art.geometry.attributes.normal,ac=art.geometry.attributes.color;
 for(let i=0;i<ac.count;i++)if(Math.abs(an.getZ(i))<.1)check(ac.getW(i)<.01,'coastal/reptile artwork stretched over side');
 if(!crab)for(const name of ['GeckoEyeRidge-1','GeckoEyeRidge1','GeckoSmileMuzzle'])check(inside(pair(name)[1],hood)>0,'gecko facial feature floats: '+name);
 if(crab){
  check(!root.getObjectByName('HoodEdge'),'crab hood meridian remains');
  for(const side of [-1,1]){
   const stalk=root.getObjectByName('CrabEyeStalk'+side),stem=root.getObjectByName('ConnectedClawArm'+side),eye=root.getObjectByName('RoundedCrabEye'+side);
   closed([stalk]);closed([stem]);check(inside(stalk,hood)>0&&inside(stalk,[eye])>0,'crab eye stalk disconnected');check(inside(stem,hood)>0&&inside(stem,pair('FullCrabClaw'+side))>0,'crab claw disconnected');
   for(let j=0;j<3;j++)check(pair('CrabSideLeg'+side+'_'+j).some(o=>inside(o,hood)>0),'crab side leg detached');
  }
 }
 const limbPairs=['LeftArm','RightArm','LeftLeg','RightLeg'].map((n,i)=>crab?pair((i<2?'CrabSleeve':'CrabFoot')+(i%2?-1:1)):pair('Compact'+n));
 const saved=[];root.traverse(o=>saved.push([o,o.position.clone(),o.quaternion.clone(),o.scale.clone()]));
 for(const clip of clips){const mixer=new T.AnimationMixer(root);mixer.clipAction(clip).play();for(const phase of [0,.125,.25,.5,.75]){
  mixer.setTime(clip.duration*phase);root.updateMatrixWorld(true);
  check(body.some(o=>inside(o,hood)>0),'coastal/reptile torso detached: '+clip.name+' '+phase);
  for(const limb of limbPairs)check(limb.some(o=>inside(o,body)>0),'coastal/reptile limb detached: '+limb[0].name+' '+clip.name+' '+phase);
  if(crab)check(pair('GreenCostumeBack').some(o=>inside(o,body)>0),'crab back costume detached');
  else check(pair('BroadReptileTail').some(o=>inside(o,body)>0),'gecko tail disconnected: '+clip.name+' '+phase);
  if(!crab&&clip.name==='Wave'){
   const arm=pair('CompactRightArm')[0],p=arm.geometry.attributes.position;let min=Infinity,max=-Infinity;for(let i=0;i<p.count;i++){min=Math.min(min,p.getY(i));max=Math.max(max,p.getY(i));}
   const point=new T.Vector3();let count=0;for(let i=0;i<p.count;i++)if(p.getY(i)<min+(max-min)*.2){point.add(new T.Vector3().fromBufferAttribute(p,i));count++;}arm.localToWorld(point.multiplyScalar(1/count));
   const sides=hood.map(o=>o.material.side);hood.forEach(o=>o.material.side=T.DoubleSide);const hits=new T.Raycaster(point,new T.Vector3(.023,.019,1).normalize()).intersectObjects(hood),ds=[];for(const h of hits)if(!ds.some(d=>Math.abs(d-h.distance)<1e-5))ds.push(h.distance);hood.forEach((o,i)=>o.material.side=sides[i]);check(ds.length%2===0,'gecko greeting hand hidden inside hood');
  }
 }mixer.stopAllAction();}
 for(const[o,p,q,s]of saved){o.position.copy(p);o.quaternion.copy(q);o.scale.copy(s);}root.updateMatrixWorld(true);
};
