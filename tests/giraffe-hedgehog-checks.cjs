"use strict";
module.exports=function(T,root,clips,check,id){
 const giraffe=id==='animal-giraffe',pair=n=>['Surface','Back'].map(s=>root.getObjectByName(n+s)),one=n=>[root.getObjectByName(n)];root.updateMatrixWorld(true);
 const hood=giraffe?one('CostumeHood'):pair('MeasuredCostumeHood'),body=giraffe?one('ShortGiraffeNeckAndBody'):pair('CompactCostumeBody');
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

 check(contact(pair('AnimalMuzzle'),hood),'muzzle detached');
 if(giraffe){
  closed(hood);closed(body);closed(one('AttachedTail'));
  for(const side of [-1,1]){closed(one('Ossicone'+side));closed(one('GiraffeSleeve'+side));check(contact(pair('GiraffeEar'+side),hood),'giraffe ear detached');check(contact(one('Ossicone'+side),hood)&&contact(one('Ossicone'+side),one('OssiconeTip'+side)),'giraffe horn detached');check(contact(one('GiraffeHand'+side),one('GiraffeSleeve'+side)),'giraffe hand detached');check(contact(one('GiraffeLeg'+side),one('GiraffeHoof'+side)),'giraffe hoof detached');}
  check(contact(one('AttachedTail'),one('TailTuft')),'giraffe tail tuft detached');
 }else{
  const coat=pair('HedgehogQuillCoat');check(contact(coat,hood),'hedgehog coat/hood detached');
  const quills=[];root.traverse(o=>{if(o.isMesh&&/^RearHedgehogQuill\d+$/.test(o.name))quills.push(o);});check(quills.length>50,'hedgehog missing rear quills');
  for(const quill of quills){closed([quill]);check(contact([quill],coat),'hedgehog quill detached: '+quill.name);}
 }
 const art=root.getObjectByName((giraffe?'CostumeHood':'MeasuredCostumeHoodSurface')+'OriginalPaint'),an=art.geometry.attributes.normal,ac=art.geometry.attributes.color;let flank=0;
 for(let i=0;i<ac.count;i++)if(Math.abs(an.getZ(i))<.1){flank++;check(ac.getW(i)<.01,'source outline leaks onto flank');}check(flank>20,'flank not checked');
 const saved=[];root.traverse(o=>saved.push([o,o.position.clone(),o.quaternion.clone(),o.scale.clone()]));
 for(const clip of clips){const mixer=new T.AnimationMixer(root);mixer.clipAction(clip).play();for(const phase of [0,.125,.25,.5,.75]){
  mixer.setTime(clip.duration*phase);root.updateMatrixWorld(true);check(contact(body,hood),'body detached: '+clip.name+' '+phase);
  for(const side of [-1,1])for(const leg of [false,true]){const limb=giraffe?one((leg?'GiraffeLeg':'GiraffeSleeve')+side):pair('Compact'+(side<0?'Left':'Right')+(leg?'Leg':'Arm'));check(contact(limb,body),'limb detached: '+side+' '+leg+' '+clip.name+' '+phase);}
  if(giraffe)check(contact(one('AttachedTail'),body),'giraffe tail detached: '+clip.name+' '+phase);
  else check(contact(pair('HedgehogQuillCoat'),body),'hedgehog coat/body detached: '+clip.name+' '+phase);
 }mixer.stopAllAction();}
 for(const[o,p,q,s]of saved){o.position.copy(p);o.quaternion.copy(q);o.scale.copy(s);}root.updateMatrixWorld(true);
};
