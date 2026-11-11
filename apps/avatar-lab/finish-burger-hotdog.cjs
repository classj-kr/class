"use strict";
module.exports=function(T,k,id,parts){
 if(!['food-hamburger','food-hot-dog'].includes(id))return;
 const hot=id==='food-hot-dog',head=parts.get('Head'),g=head.group,s=require('./sculpt-kit.cjs')(T,k,head),ink=require('./solid-ink-shell.cjs'),colour=hot?'#dc5948':'#efae5e',stroke=hot?'#963d2c':'#8c5328';
 function volume(part,name,ps,center,depth){k.volume(name,ps,center,part.part.pivot,depth,depth,part.group,k.solid(name+'Color',colour),{art:false,samples:80});require('./smooth-paired-volume.cjs')(T,k,part.group,name,{rings:20});return ['Surface','Back'].map(x=>part.group.getObjectByName(name+x));}
 if(hot){
  head.lockToBody=true;const shell=g.getObjectByName('HotDogCostumeSolid'),p=shell.geometry.attributes.position,n=shell.geometry.attributes.normal,map=new Map();
  for(let i=0;i<p.count;i++){const key=[p.getX(i),p.getY(i),p.getZ(i)].map(v=>Math.round(v*1e6)).join(',');if(!map.has(key))map.set(key,[]);map.get(key).push(i);}for(const list of map.values()){const v=new T.Vector3();for(const i of list)v.add(new T.Vector3().fromBufferAttribute(n,i));v.normalize();for(const i of list)n.setXYZ(i,v.x,v.y,v.z);}
  shell.userData.artworkFacingFade=[.45,.8];shell.updateWorldMatrix(true,false);const ray=new T.Raycaster();
  const sausage=volume(head,'LowerSausage',[[260,399],[380,399],[389,439],[386,490],[372,521],[349,539],[320,545],[291,539],[270,522],[253,491],[250,439]],[320,470],.18);
  for(const mesh of sausage){mesh.geometry.translate(0,0,.35);mesh.userData.artworkFacingFade=[.25,.65];mesh.userData.artworkMinY=402;}
  g.userData.artworkOcclusion=true;
  for(const side of [-1,1]){const name=side<0?'LeftArm':'RightArm',pivot=[side<0?250:390,416];let part=parts.get(name);if(!part){part={part:{pivot},group:k.group(name,pivot)};parts.set(name,part);}part.part.pivot=pivot;part.group.position.set((pivot[0]-320)*.005,(580-pivot[1])*.005,0);part.group.clear();
   const ps=[[259,399],[264,420],[252,451],[248,478],[239,495],[227,493],[219,483],[220,464],[234,432],[248,409]].map(([x,y])=>[side<0?x:640-x,y]);const halves=volume(part,'HotDogHand'+side,ps,[side<0?242:398,448],.065);
   for(const mesh of halves){const q=mesh.geometry.attributes.position;for(let i=0;i<q.count;i++){const x=q.getX(i)/.005+pivot[0],y=pivot[1]-q.getY(i)/.005;ray.set(new T.Vector3((x-320)*.005,(580-y)*.005,3),new T.Vector3(0,0,-1));const hit=ray.intersectObject(shell)[0];if(!hit)throw Error('Hot dog hand has no costume support');q.setZ(i,q.getZ(i)+hit.point.z+.015);}mesh.geometry.computeVertexNormals();mesh.userData.artworkFacingFade=[.35,.70];}
   part.group.userData.directSurfaceArtwork=true;require('./sculpt-kit.cjs')(T,k,part).paint();for(const mesh of halves)ink(T,k,mesh,stroke,.007);
  }
 }else{
  const body=g.getObjectByName('ContinuousFoodBody'),p=body.geometry.attributes.position,C=[];
  for(let i=0;i<p.count;i++){
   const x=p.getX(i)+g.position.x,y=p.getY(i)+g.position.y,z=p.getZ(i)+g.position.z,py=580-y/.005,a=Math.atan2(z,x),r=Math.hypot(x,z);let rr=r,yy=y;
   if(py>224&&py<246)rr-=.025*Math.sin((py-224)/22*Math.PI);
   if(py>=246&&py<267){rr+=.012*Math.sin(a*9);yy+=.009*Math.sin(a*7);}
   if(py>=267&&py<285)rr*=.96+.04*Math.pow(Math.abs(Math.cos(a*2)),6);
   if(py>418)rr*=Math.sqrt(Math.max(0,(433-py)/15));
   let xx=r?x/r*rr:x,zz=r?z/r*rr:z;
   if(z>0){const d=Math.hypot((x/.005)/120,(py-302)/98),t=1-T.MathUtils.smoothstep(d,.94,1.25);zz=T.MathUtils.lerp(zz,.97-.12*(x/.65)**2,t);}
   p.setXYZ(i,xx-g.position.x,yy-g.position.y,zz-g.position.z);
   const c=new T.Color(py<225?'#efb263':py<245?'#ce4d2c':py<267?'#86a63e':py<285?'#f6ce4c':py<350?'#805036':'#eaaa5b').convertSRGBToLinear();C.push(c.r,c.g,c.b);
  }
  body.geometry.setAttribute('color',new T.Float32BufferAttribute(C,3));body.geometry.computeVertexNormals();body.geometry.computeBoundingBox();body.geometry.computeBoundingSphere();body.userData.artworkFacingFade=[.35,.70];
  // Rounded molded seams distinguish the rear food layers without changing the face.
  const ray=new T.Raycaster();body.updateWorldMatrix(true,false);
  for(const [j,py,c]of [[0,224,'#b76f31'],[1,246,'#64842f'],[2,283,'#cb9b2e'],[3,350,'#5f3c2a']]){const ps=[];for(let i=0;i<=64;i++){const a=Math.PI+i/64*Math.PI,x=Math.cos(a)*2,z=Math.sin(a)*2,origin=new T.Vector3(x,(580-py)*.005,z);ray.set(origin,new T.Vector3(-x,0,-z).normalize());const hit=ray.intersectObject(body)[0];if(hit){const v=hit.point;ps.push([v.x/.005+320,580-v.y/.005,v.z]);}}if(ps.length>1){const seam=s.tube('RearBurgerLayerSeam'+j,ps,.006,c);seam.userData.skipOriginalPaint=true;}}
 }
 for(const name of ['Torso','LeftArm','RightArm','LeftLeg','RightLeg']){
  if(hot&&name.endsWith('Arm'))continue;const part=parts.get(name),side=name.startsWith('Left')?-1:1,tool=require('./sculpt-kit.cjs')(T,k,part);part.group.clear();let ps,center,depth;
  if(name==='Torso'){ps=hot?[[285,529],[355,529],[360,541],[350,550],[290,550],[280,541]]:[[262,421],[378,421],[390,458],[387,497],[368,529],[320,542],[272,529],[253,497],[250,458]];center=[320,hot?538:482];depth=hot?.25:.26;}
  else if(name.endsWith('Arm')){ps=[[258,420],[272,433],[257,461],[249,489],[239,505],[225,505],[216,496],[216,478],[231,444]].map(([x,y])=>[side<0?x:640-x,y]);center=[side<0?243:397,461];depth=.11;}
  else{ps=(hot?[[276,532],[310,536],[308,558],[299,576],[277,579],[258,570],[261,555],[266,541]]:[[275,521],[309,526],[306,552],[300,572],[280,578],[259,571],[257,557],[265,539]]).map(([x,y])=>[side<0?x:640-x,y]);center=[side<0?283:357,552];depth=.14;}
  const halves=volume(part,'FinishedSnack'+name,ps,center,depth);for(const mesh of halves){mesh.userData.artworkFacingFade=[.35,.7];if(name!=='Torso'||hot)mesh.userData.skipOriginalPaint=true;}
  if(hot&&name==='Torso')part.group.position.z=-.10;
  part.group.userData.directSurfaceArtwork=true;part.group.userData.artworkOpaqueRegions=[];tool.paint();for(const mesh of halves)ink(T,k,mesh,stroke,.008);
 }
 g.userData.artworkOpaqueRegions=[hot?{cx:320,cy:308,rx:118,ry:99}:{cx:320,cy:300,rx:119,ry:97}];require('./project-model-artwork.cjs')(T,k,g,head.part.pivot);
 // Remove the source's exterior ink before it stretches across a turning rim.
 const boundary=[];for(let i=0;i<head.points.length;i+=4)if(head.points[i+3]<5)boundary.push([head.points[i],head.points[i+1]]);
 for(const art of g.children.filter(o=>o.isMesh&&o.material.userData.originalTexture)){const p=art.geometry.attributes.position,c=art.geometry.attributes.color;if(!c)continue;for(let i=0;i<p.count;i++){const x=p.getX(i)/.005+head.part.pivot[0],y=head.part.pivot[1]-p.getY(i)/.005;let d=Infinity;for(const [bx,by]of boundary)d=Math.min(d,Math.hypot(x-bx,y-by));c.setW(i,c.getW(i)*T.MathUtils.smoothstep(d,5,16));}}
 ink(T,k,g.getObjectByName(hot?'HotDogCostumeSolid':'ContinuousFoodBody'),stroke,.007);
};
