"use strict";
module.exports=function(T,root,clips,check,id){
 const fox=id==='animal-fox',pair=n=>['Surface','Back'].map(s=>root.getObjectByName(n+s));root.updateMatrixWorld(true);
 const hood=pair(fox?'ShapedCanineHood':'FullFeatureHood'),body=pair(fox?'CanineSuit':'CrouchedFrogBody');
 const inside=(mesh,supports)=>{
  const p=mesh.geometry.attributes.position,mats=new Map(supports.map(o=>[o.material,o.material.side]));for(const m of mats.keys())m.side=T.DoubleSide;
  let count=0;for(let j=0;j<192;j++){
   const v=mesh.localToWorld(new T.Vector3().fromBufferAttribute(p,Math.floor(j*p.count/192))),hits=new T.Raycaster(v,new T.Vector3(.023,.019,1).normalize()).intersectObjects(supports),ds=[];
   for(const h of hits)if(!ds.some(d=>Math.abs(d-h.distance)<1e-5))ds.push(h.distance);if(ds.length%2)count++;
  }for(const[m,side]of mats)m.side=side;return count;
 };
 const contact=(a,b)=>a.some(o=>inside(o,b)>0)||b.some(o=>inside(o,a)>0);
 const closed=meshes=>{const edges=new Map(),normals=new Map();for(const o of meshes){
  const p=o.geometry.attributes.position,n=o.geometry.attributes.normal,ix=o.geometry.index,coord=i=>[p.getX(i),p.getY(i),p.getZ(i)].map(v=>Math.round(v*1e5)).join(',');
  for(let i=0;i<ix.count;i+=3){const vs=[0,1,2].map(j=>coord(ix.getX(i+j)));if(new Set(vs).size<3)continue;for(let j=0;j<3;j++){const key=[vs[j],vs[(j+1)%3]].sort().join('|');edges.set(key,(edges.get(key)||0)+1);}}
  if(meshes.length>1)for(let i=0;i<p.count;i++){const key=coord(i),v=new T.Vector3().fromBufferAttribute(n,i);if(normals.has(key))check(v.dot(normals.get(key))>.995,'costume split rim shading: '+o.name);else normals.set(key,v);}
 }check([...edges.values()].every(n=>n===2),'costume open solid: '+meshes[0].name);};
 root.traverse(o=>{if(o.isMesh&&o.name.endsWith('Surface')&&!o.material.userData.originalTexture)closed(pair(o.name.replace(/Surface$/,'')));});

 for(const n of fox?['CanineEar-1','CanineEar1','AnimalMuzzle']:[])check(contact(pair(n),hood),'detached hood feature: '+n);
 if(!fox)for(const side of [-1,1]){
  const palm=[root.getObjectByName('FrogPalm'+side)],forearm=[root.getObjectByName('ConnectedFrogForearm'+side)],arm=pair('RaisedFrogArm'+side);
  closed(forearm);check(contact(arm,forearm)&&contact(forearm,palm),'frog detached wrist: '+side);
  for(let i=0;i<3;i++){const finger=[root.getObjectByName('RoundedFrogFinger'+side+'_'+i)],pad=[root.getObjectByName('FrogFingerPad'+side+'_'+i)];closed(finger);check(contact(finger,palm)&&contact(finger,pad),'frog detached finger/pad: '+side+' '+i);}
 }
 const art=root.getObjectByName((fox?'ShapedCanineHood':'FullFeatureHood')+'SurfaceOriginalPaint'),an=art.geometry.attributes.normal,ac=art.geometry.attributes.color;let flank=0;
 for(let i=0;i<ac.count;i++)if(Math.abs(an.getZ(i))<.1){flank++;check(ac.getW(i)<.01,'source outline leaks onto flank');}check(flank>20,'flank not checked');
 const saved=[];root.traverse(o=>saved.push([o,o.position.clone(),o.quaternion.clone(),o.scale.clone()]));
 for(const clip of clips){const mixer=new T.AnimationMixer(root);mixer.clipAction(clip).play();for(const phase of [0,.125,.25,.5,.75]){
  mixer.setTime(clip.duration*phase);root.updateMatrixWorld(true);check(contact(body,hood),'body detached: '+clip.name+' '+phase);
  if(fox){
   for(const side of [-1,1])for(const n of ['CanineSleeve','CanineBoot'])check(contact(pair(n+side),body),'fox limb detached: '+n+side+' '+clip.name+' '+phase);
   check(contact(pair('AttachedCanineTail'),body),'fox tail detached: '+clip.name+' '+phase);
   if(clip.name==='Wave'){
    const arm=pair('CanineSleeve1')[0],p=arm.geometry.attributes.position;let min=Infinity,max=-Infinity;for(let i=0;i<p.count;i++){min=Math.min(min,p.getY(i));max=Math.max(max,p.getY(i));}
    const point=new T.Vector3();let count=0;for(let i=0;i<p.count;i++)if(p.getY(i)<min+(max-min)*.2){point.add(new T.Vector3().fromBufferAttribute(p,i));count++;}arm.localToWorld(point.multiplyScalar(1/count));
    const sides=hood.map(o=>o.material.side);hood.forEach(o=>o.material.side=T.DoubleSide);const hits=new T.Raycaster(point,new T.Vector3(.023,.019,1).normalize()).intersectObjects(hood),ds=[];for(const h of hits)if(!ds.some(d=>Math.abs(d-h.distance)<1e-5))ds.push(h.distance);hood.forEach((o,i)=>o.material.side=sides[i]);check(ds.length%2===0,'fox greeting hand hidden inside hood');
   }
  }else for(const side of [-1,1])for(const n of ['RaisedFrogArm','FoldedFrogLeg'])check(contact(pair(n+side),body),'frog limb detached: '+n+side+' '+clip.name+' '+phase);
 }mixer.stopAllAction();}
 for(const[o,p,q,s]of saved){o.position.copy(p);o.quaternion.copy(q);o.scale.copy(s);}root.updateMatrixWorld(true);
};
