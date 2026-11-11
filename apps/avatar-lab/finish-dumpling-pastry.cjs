"use strict";
module.exports=function(T,k,id,parts){
 if(!['food-dumpling','food-fish-pastry'].includes(id))return;
 const dumpling=id==='food-dumpling',head=parts.get('Head'),s=require('./sculpt-kit.cjs')(T,k,head),smooth=require('./smooth-paired-volume.cjs'),ink=require('./solid-ink-shell.cjs'),colour=dumpling?'#f9e5c7':'#f3b45f',stroke=dumpling?'#a18460':'#a46a30';
 function weld(mesh){const p=mesh.geometry.attributes.position,n=mesh.geometry.attributes.normal,map=new Map();for(let i=0;i<p.count;i++){const key=[p.getX(i),p.getY(i),p.getZ(i)].map(v=>Math.round(v*1e6)).join(',');if(!map.has(key))map.set(key,[]);map.get(key).push(i);}for(const list of map.values()){const v=new T.Vector3();for(const i of list)v.add(new T.Vector3().fromBufferAttribute(n,i));v.normalize();for(const i of list)n.setXYZ(i,v.x,v.y,v.z);}}
 function volume(part,name,ps,center,depth){
  k.volume(name+'Half',ps,center,part.part.pivot,depth,depth,part.group,k.solid(name+'Color',colour),{art:false,samples:part===head?128:80});smooth(T,k,part.group,name+'Half',{rings:part===head?28:20});const P=[],I=[];
  let edge;for(const side of ['Surface','Back']){const o=part.group.getObjectByName(name+'Half'+side),n=P.length/3;P.push(...o.geometry.attributes.position.array);I.push(...Array.from(o.geometry.index.array,i=>i+n));edge=o.userData.paddedBoundary;part.group.remove(o);}
  const mesh=k.mesh(name,k.geometry(P,I),k.solid(name+'Color',colour),part.group);mesh.userData.paddedBoundary=edge;weld(mesh);return mesh;
 }
 if(dumpling){
  head.group.clear();
  const shell=volume(head,'DumplingShellSolid',[[320,62],[338,71],[347,87],[365,75],[380,82],[393,108],[424,135],[467,170],[500,213],[519,262],[514,306],[493,343],[458,373],[410,398],[352,415],[285,418],[223,407],[174,384],[143,353],[125,316],[120,272],[131,225],[154,188],[191,153],[232,125],[254,102],[270,75],[283,78],[296,90],[307,69]],[320,273],.77);
  shell.userData.artworkFacingFade=[.45,.85];shell.updateWorldMatrix(true,false);const ray=new T.Raycaster();
  for(const side of [-1,0,1]){const ps=[];for(let i=0;i<=30;i++){const t=i/30,x=320+side*(33+24*t),y=113+52*t;ray.set(new T.Vector3((x-320)*.005,(580-y)*.005,-3),new T.Vector3(0,0,1));const hit=ray.intersectObject(shell)[0];if(hit)ps.push([x,y,hit.point.z-.005]);}if(ps.length>1){const crease=s.tube('RearDoughCrease'+side,ps,.009,'#b59368');crease.userData.skipOriginalPaint=true;}}
  head.group.userData.artworkOpaqueRegions=[{cx:320,cy:302,rx:117,ry:95}];
 }else{
  for(const name of ['FishPastryBodySolid','PastryTailSolid','PastryDorsalSolid','PastryLowerFinSolid']){const o=head.group.getObjectByName(name);weld(o);o.userData.artworkFacingFade=[.25,.65];o.userData.artworkExcludedRegions=[];o.material.color.set(colour).convertSRGBToLinear();}
  const face=head.group.getObjectByName('FishPastryBodySolid');face.updateWorldMatrix(true,false);const ray=new T.Raycaster();
  const P=[],I=[],C=[],N=64,R=16;
  for(let r=0;r<=R;r++)for(let i=0;i<N;i++){const a=i/N*Math.PI*2,x=161+Math.cos(a)*35*r/R,y=230+Math.sin(a)*35*r/R;ray.set(new T.Vector3((x-320)*.005,(580-y)*.005,-3),new T.Vector3(0,0,1));const h=ray.intersectObject(face)[0];if(!h)throw Error('Pastry eye support missing');const q=head.group.worldToLocal(h.point.clone());P.push(q.x,q.y,q.z-.006);const t=r/R,c=new T.Color(t>.85?'#a36525':t>.58?'#ffd080':t>.48?'#b57c35':'#995719').convertSRGBToLinear();C.push(c.r,c.g,c.b);}
  for(let r=0;r<R;r++)for(let i=0;i<N;i++){const a=r*N+i,b=r*N+(i+1)%N,c=a+N,d=b+N;if(r)I.push(a,d,b);I.push(a,c,d);}const eyeGeo=k.geometry(P,I);eyeGeo.setAttribute('color',new T.Float32BufferAttribute(C,3));const eye=k.mesh('RearPastryFishEye',eyeGeo,k.solid('RearPastryFishEyeColor','#ffffff'),head.group);eye.material.userData.preserveVertexColor=true;eye.userData.skipOriginalPaint=true;
  ray.set(new T.Vector3((156-320)*.005,(580-218)*.005,-3),new T.Vector3(0,0,1));const eyeHit=ray.intersectObject(face)[0];const glint=s.ellipsoid('RearPastryEyeGlint',[156,218,eyeHit.point.z-.011],[8,6,.004],'#ffd584');glint.userData.skipOriginalPaint=true;
  for(const side of [-1,1]){
   const part=parts.get(side<0?'LeftArm':'RightArm'),tool=require('./sculpt-kit.cjs')(T,k,part);for(const o of [...part.group.children])if(/^RaisedPastryHand/.test(o.name)||o.material?.userData.originalTexture)part.group.remove(o);
   const outline=[[282,374],[297,383],[303,398],[291,424],[277,445],[261,454],[245,447],[241,434],[252,415],[263,398],[268,381]].map(([x,y])=>[side<0?x:640-x,y]);
   const hand=volume(part,'RaisedPastryHandSolid'+side,outline,[side<0?274:366,414],.095),p=hand.geometry.attributes.position;
   for(let i=0;i<p.count;i++){const x=p.getX(i)/.005+part.part.pivot[0],y=part.part.pivot[1]-p.getY(i)/.005;ray.set(new T.Vector3((x-320)*.005,(580-Math.min(y,422))*.005,3),new T.Vector3(0,0,-1));const h=ray.intersectObject(face)[0];p.setZ(i,p.getZ(i)+(h?h.point.z:.25)+.045-part.group.position.z);}hand.geometry.computeVertexNormals();
   weld(hand);for(const o of part.group.children)if(o.isMesh)o.userData.skipOriginalPaint=true;hand.userData.skipOriginalPaint=false;hand.userData.artworkFacingFade=[.25,.65];tool.paint();
   const art=part.group.getObjectByName(hand.name+'OriginalPaint'),ap=art.geometry.attributes.position,ac=art.geometry.attributes.color;for(let i=0;i<ap.count;i++){let d=Infinity;for(const v of hand.userData.paddedBoundary)d=Math.min(d,Math.hypot(ap.getX(i)-v.x,ap.getY(i)-v.y));ac.setW(i,ac.getW(i)*T.MathUtils.smoothstep(d,.025,.065));}ink(T,k,hand,stroke,.009);
  }
 }
 for(const name of ['Torso','LeftArm','RightArm','LeftLeg','RightLeg']){
  if(!dumpling&&name.endsWith('Arm'))continue;const part=parts.get(name),tool=require('./sculpt-kit.cjs')(T,k,part),side=name.startsWith('Left')?-1:1;part.group.clear();let ps,center,depth;
  if(name==='Torso'){ps=dumpling?[[259,411],[381,411],[391,453],[390,492],[372,521],[347,536],[292,536],[267,522],[249,493],[249,451]]:[[253,429],[387,429],[391,462],[386,499],[368,528],[320,540],[276,529],[254,499],[249,462]];center=[320,477];depth=.26;}
  else if(name.endsWith('Arm')){ps=[[257,413],[272,428],[253,462],[241,491],[227,501],[215,495],[210,482],[215,460],[235,429]].map(([x,y])=>[side<0?x:640-x,y]);center=[side<0?242:398,457];depth=.11;}
  else{ps=(dumpling?[[276,518],[312,523],[307,550],[299,571],[280,578],[260,572],[256,559],[265,536]]:[[276,519],[309,524],[305,552],[298,571],[278,578],[261,573],[256,560],[266,539]]).map(([x,y])=>[side<0?x:640-x,y]);center=[side<0?283:357,551];depth=.14;}
  const mesh=volume(part,name==='Torso'&&!dumpling?'PastryTorsoSolid':'CompactSnack'+name+'Solid',ps,center,depth);mesh.userData.artworkFacingFade=[.25,.65];if(name!=='Torso')mesh.userData.skipOriginalPaint=true;
  part.group.userData.directSurfaceArtwork=true;part.group.userData.artworkOpaqueRegions=[];tool.paint();ink(T,k,mesh,stroke,.009);
 }
 require('./project-model-artwork.cjs')(T,k,head.group,head.part.pivot);
 if(dumpling){const mesh=head.group.getObjectByName('DumplingShellSolid'),art=head.group.getObjectByName('DumplingShellSolidOriginalPaint'),p=art.geometry.attributes.position,c=art.geometry.attributes.color;for(let i=0;i<p.count;i++){let d=Infinity;for(const v of mesh.userData.paddedBoundary)d=Math.min(d,Math.hypot(p.getX(i)-v.x,p.getY(i)-v.y));c.setW(i,c.getW(i)*T.MathUtils.smoothstep(d,.03,.08));}}
 for(const mesh of head.group.children.filter(o=>o.isMesh&&!o.material.userData.originalTexture&&o.name.endsWith('Solid')))ink(T,k,mesh,stroke,.010);
};
