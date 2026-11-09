"use strict";
module.exports=function(T,root,clips,check,id){
 const monkey=id==='animal-monkey',pair=n=>['Surface','Back'].map(s=>root.getObjectByName(n+s)),one=n=>[root.getObjectByName(n)];root.updateMatrixWorld(true);
 const hood=pair('MeasuredCostumeHood'),body=pair('CompactCostumeBody');
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


 for(const side of [-1,1]){const ear=one('Ear'+side);closed(ear);check(contact(ear,hood),'ear detached');check(contact(ear,one('InnerEar'+side)),'ear lining detached');}
 if(!monkey)check(contact(pair('MouseNose'),hood),'mouse nose detached');
 const art=root.getObjectByName('MeasuredCostumeHoodSurfaceOriginalPaint'),an=art.geometry.attributes.normal,ac=art.geometry.attributes.color;let flank=0;
 for(let i=0;i<ac.count;i++)if(Math.abs(an.getZ(i))<.1){flank++;check(ac.getW(i)<.01,'source outline leaks onto flank');}check(flank>20,'flank not checked');
 const saved=[];root.traverse(o=>saved.push([o,o.position.clone(),o.quaternion.clone(),o.scale.clone()]));
 for(const clip of clips){const mixer=new T.AnimationMixer(root);mixer.clipAction(clip).play();for(const phase of [0,.125,.25,.5,.75]){
  mixer.setTime(clip.duration*phase);root.updateMatrixWorld(true);check(contact(body,hood),'body detached: '+clip.name+' '+phase);
  for(const name of ['LeftArm','RightArm','LeftLeg','RightLeg'])check(contact(pair('Compact'+name),body),'limb detached: '+name+' '+clip.name+' '+phase);
  check(contact(monkey?one('AttachedTail'):pair('CostumeTail'),body),'tail detached: '+clip.name+' '+phase);
  const prop=pair(monkey?'HeldBananas':'HeldCheese');check(contact(prop,body),'prop/body disconnected');
  for(const hand of monkey?['RightArm']:['LeftArm','RightArm'])check(contact(pair('Compact'+hand),prop),'hand/prop disconnected: '+hand+' '+clip.name+' '+phase);
 }mixer.stopAllAction();}
 for(const[o,p,q,s]of saved){o.position.copy(p);o.quaternion.copy(q);o.scale.copy(s);}root.updateMatrixWorld(true);
};
