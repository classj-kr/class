"use strict";
module.exports=function(T,k,id,parts){
 if(!['animal-ostrich','animal-owl'].includes(id))return;
 const ostrich=id==='animal-ostrich';
 const head=parts.get('Head'),name=ostrich?'FullFeatureHood':'MeasuredCostumeHood',a=head.group.getObjectByName(name+'Surface'),b=head.group.getObjectByName(name+'Back');
 const oldHood=new T.Mesh(a.geometry.clone(),new T.MeshBasicMaterial({side:T.DoubleSide}));oldHood.updateMatrixWorld(true);
 for(const [group,partName] of [[head.group,name],...(ostrich?[[parts.get('Torso').group,'WhiteFeatherRuff'],...[0,1,2,3,4].map(i=>[parts.get('OstrichTail').group,'OstrichTailFeather'+i]),[parts.get('OstrichTail').group,'RoundedOstrichFan']]:[])]){
 const a=group.getObjectByName(partName+'Surface'),b=group.getObjectByName(partName+'Back');
 const base=(a.geometry.attributes.position.getZ(0)+b.geometry.attributes.position.getZ(0))/2;
 for(const mesh of [a,b]){
  const p=mesh.geometry.attributes.position,oldSamples=p.count/13,samples=partName===name?oldSamples:64,edge=Array.from({length:samples},(_,i)=>new T.Vector3().fromBufferAttribute(p,12*oldSamples+Math.floor(i*oldSamples/samples))),center=new T.Vector3().fromBufferAttribute(p,0);center.z=0;
  let smooth=edge.map(v=>v.clone());for(let pass=0;pass<4;pass++)smooth=smooth.map((v,i)=>{const sum=v.clone().multiplyScalar(2);for(const d of [-3,-2,-1,1,2,3])sum.add(smooth[(i+d+samples)%samples]);return sum.multiplyScalar(1/8);});
  const P=[],I=[],rings=partName===name?32:16,depth=p.getZ(0)-base;
  for(let ring=0;ring<=rings;ring++){const angle=ring/rings*Math.PI/2,r=Math.sin(angle),w=Math.max(0,(r-.94)/.06)**3;for(let i=0;i<samples;i++){const v=center.clone().lerp(smooth[i],r).addScaledVector(edge[i].clone().sub(smooth[i]),w);P.push(v.x,v.y,base+depth*Math.cos(angle));}}
  for(let ring=0;ring<rings;ring++)for(let i=0;i<samples;i++){const a=ring*samples+i,b=ring*samples+(i+1)%samples,c=a+samples,d=b+samples;if(depth<0){if(ring)I.push(a,d,b);I.push(a,c,d);}else{if(ring)I.push(a,b,d);I.push(a,d,c);}}
  const g=k.geometry(P,I);if((g.attributes.normal.getZ(samples*4)>0)!==(depth>0)){for(let i=0;i<I.length;i+=3)[I[i+1],I[i+2]]=[I[i+2],I[i+1]];g.setIndex(I);g.computeVertexNormals();}
  const N=g.attributes.normal;for(let pass=0;pass<3;pass++){const next=N.array.slice();for(let ring=0;ring<=rings;ring++)for(let i=0;i<samples;i++){const v=new T.Vector3();for(let d=-3;d<=3;d++)v.addScaledVector(new T.Vector3().fromBufferAttribute(N,ring*samples+(i+d+samples)%samples),4-Math.abs(d));next.set(v.normalize().toArray(),(ring*samples+i)*3);}N.array.set(next);}
  mesh.geometry.dispose();mesh.geometry=g;mesh.userData.paddedBoundary=edge;
 }
 }
 const newHood=new T.Mesh(a.geometry,new T.MeshBasicMaterial({side:T.DoubleSide}));newHood.updateMatrixWorld(true);
 for(const mesh of head.group.children.filter(o=>o.isMesh&&(ostrich?o.name.startsWith('OstrichRoundedBeak'):o.name.startsWith('OwlBrow'))&&!o.material.userData.originalTexture)){
  const p=mesh.geometry.attributes.position;for(let i=0;i<p.count;i++){
   const ray=new T.Raycaster(new T.Vector3(p.getX(i),p.getY(i),3),new T.Vector3(0,0,-1)),old=ray.intersectObject(oldHood)[0],next=ray.intersectObject(newHood)[0];
   if(!ostrich){const samples=p.count/13,ring=Math.floor(i/samples),depth=mesh.name.endsWith('Surface')?.075:-.035;p.setZ(i,(next?.point.z||0)+depth*Math.cos(ring/12*Math.PI/2)-.008);}
   else if(old&&next)p.setZ(i,p.getZ(i)+next.point.z-old.point.z);
  }mesh.geometry.computeVertexNormals();
 }

 if(!ostrich){
  for(const mesh of [a,b])mesh.userData.artworkExcludedRegions=[{cx:220,cy:106,rx:74,ry:52},{cx:420,cy:106,rx:74,ry:52},{cx:320,cy:149,rx:28,ry:28}];
  for(const name of ['LeftLeg','RightLeg'])for(const mesh of parts.get(name).group.children.filter(o=>o.isMesh&&!o.material.userData.originalTexture))mesh.material.color.set('#d9a144').convertSRGBToLinear();
  for(const o of head.group.children)if(o.isMesh&&o.name.startsWith('OwlBrow')&&!o.material.userData.originalTexture)o.userData.skipOriginalPaint=true;
  for(const o of [...head.group.children])if(/^(OwlEyeRim|AnimalMuzzle)/.test(o.name))head.group.remove(o);
  const surface=(x,y)=>new T.Raycaster(new T.Vector3(x,y,3),new T.Vector3(0,0,-1)).intersectObject(newHood)[0]?.point.z;
  for(const [label,x,y,rx,ry,depth,color] of [['OwlBeak',320,205,22,28,.12,'#e6b04b'],['OwlEyeDisk-1',248,181,79,70,.025,'#e2c895'],['OwlEyeDisk1',392,181,79,70,.025,'#e2c895']]){
   const before=new Set(head.group.children);
   k.volume(label,k.ellipse(x,y,rx,ry),[x,y],head.part.pivot,depth,.014,head.group,k.solid(label+'Color',color),{samples:96});
   for(const mesh of head.group.children.filter(o=>!before.has(o))){const p=mesh.geometry.attributes.position;for(let i=0;i<p.count;i++){const z=surface(p.getX(i),p.getY(i));if(z!==undefined)p.setZ(i,p.getZ(i)+z-.006);}mesh.geometry.computeVertexNormals();}
  }
  // Bring the concealed inner wing roots into the short torso. Outer feather
  // tips keep their measured silhouette and do not drift with this correction.
  for(const side of [-1,1]){const part=parts.get(side<0?'LeftArm':'RightArm');for(const mesh of part.group.children.filter(o=>o.isMesh&&!o.material.userData.originalTexture)){const p=mesh.geometry.attributes.position;for(let i=0;i<p.count;i++){const x=p.getX(i)/.005+part.part.pivot[0],inner=320-Math.abs(x-320),t=Math.max(0,Math.min(1,(inner-222)/37));p.setX(i,p.getX(i)-side*.14*t);}mesh.geometry.computeVertexNormals();}}
 }else{
  // Costume feather colours continue around the volume, rather than being
  // front-only white patches stretched onto the sides of black wings.
  for(const name of ['LeftArm','RightArm','OstrichTail']){const part=parts.get(name);for(const mesh of part.group.children.filter(o=>o.isMesh&&!o.material.userData.originalTexture)){
   if(name==='OstrichTail')delete mesh.userData.artworkExcludedRegions;
   const p=mesh.geometry.attributes.position,C=[];
   for(let i=0;i<p.count;i++){const x=p.getX(i)/.005+part.part.pivot[0],y=part.part.pivot[1]-p.getY(i)/.005;
    const t=name==='OstrichTail'?Math.max(0,Math.min(1,(Math.hypot(x-317,y-452)-116)/12)):Math.max(0,Math.min(1,(y-448)/12));
    C.push(...new T.Color('#454247').convertSRGBToLinear().lerp(new T.Color('#eee9e7').convertSRGBToLinear(),t).toArray());
   }mesh.geometry.setAttribute('color',new T.Float32BufferAttribute(C,3));mesh.material.color.set(0xffffff);mesh.material.userData.preserveVertexColor=true;
  }}
 }
 oldHood.geometry.dispose();oldHood.material.dispose();newHood.material.dispose();
};
