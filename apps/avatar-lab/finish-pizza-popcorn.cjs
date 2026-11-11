"use strict";
module.exports=function(T,k,id,parts){
 if(!['food-pizza','food-popcorn'].includes(id))return;
 const pizza=id==='food-pizza',head=parts.get('Head'),g=head.group,s=require('./sculpt-kit.cjs')(T,k,head),ink=require('./solid-ink-shell.cjs');
 function volume(part,name,ps,center,depth,color){k.volume(name,ps,center,part.part.pivot,depth,depth,part.group,k.solid(name+'Color',color),{art:false,samples:80});require('./smooth-paired-volume.cjs')(T,k,part.group,name,{rings:20});return ['Surface','Back'].map(x=>part.group.getObjectByName(name+x));}
 if(pizza){
  head.lockToBody=true;
  for(const o of [...g.children])if(o.material?.userData.originalTexture||o.name==='PizzaRolledCrustSolid')g.remove(o);
  const crust=[[98,136],[128,110],[210,78],[320,63],[414,75],[488,102],[538,131],[541,151],[530,176],[513,178],[474,160],[413,144],[362,136],[319,132],[270,139],[229,141],[192,153],[151,171],[119,181],[104,166]];
  const halves=volume(head,'RoundedPizzaCrust',crust,[320,108],.245,'#dda35e');
  for(const mesh of halves){mesh.userData.artworkFacingFade=[.4,.75];}
  for(const side of [-1,1]){const part=parts.get(side<0?'LeftArm':'RightArm');part.group.clear();const ps=[[241,435],[231,447],[222,467],[217,489],[220,502],[231,507],[243,501],[249,479],[252,451]].map(([x,y])=>[side<0?x:640-x,y]);const hands=volume(part,'PizzaHand'+side,ps,[side<0?236:404,473],.13,'#f3bf7b');for(const mesh of hands)mesh.userData.skipOriginalPaint=true;for(const mesh of hands)ink(T,k,mesh,'#9b6539',.008);}
 }else{
  const mound=g.getObjectByName('PopcornMoundSolid');
  // A dense rounded support receives local front kernel bulges; rear kernels
  // cover the rear support instead of sinking into a broad exposed dome.
  const old=mound.geometry;const replacement=s.lathe('PopcornMoundNew',[[190,0],[183,130],[164,162],[143,149],[122,128],[103,105],[84,75],[70,43],[64,0]],'#fff0c7',0,{levels:100,segments:96});mound.geometry=replacement.geometry;g.remove(replacement);old.dispose();
  const p=mound.geometry.attributes.position,centers=[[190,150,29,20],[228,126,28,22],[263,95,30,25],[305,80,30,24],[357,88,32,25],[408,113,27,25],[450,143,29,25],[253,149,29,27],[308,125,33,28],[358,139,30,25],[310,166,30,22],[393,165,33,23]];
  for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i),px=x/.005+320,py=580-y/.005;if(z>0){const r=Math.hypot(x,z);let bump=0;for(const[cx,cy,rx,ry]of centers)bump=Math.max(bump,.045*Math.exp(-2*(((px-cx)/rx)**2+((py-cy)/ry)**2)));p.setZ(i,r*Math.pow(z/Math.max(r,.001),.38)+bump);}}
  mound.geometry.computeVertexNormals();mound.geometry.computeBoundingBox();mound.geometry.computeBoundingSphere();mound.userData.artworkFacingFade=[.45,.78];
  for(const o of [...g.children])if(/^RearPopcorn/.test(o.name))g.remove(o);
  mound.updateWorldMatrix(true,false);const ray=new T.Raycaster(),kernelGeometry=new T.SphereGeometry(1,16,10);let count=0;
  for(const[y,n]of [[2.13,18],[2.24,16],[2.34,12],[2.46,8],[2.54,3]])for(let i=0;i<n;i++){
   const a=(i+.5)/n*Math.PI*2+y*4.7,dir=new T.Vector3(Math.cos(a),0,Math.sin(a)),yy=y+.018*Math.sin(i*3.1);ray.set(new T.Vector3(dir.x*3,yy,dir.z*3),dir.clone().negate());const hit=ray.intersectObject(mound)[0];if(!hit)continue;const tangent=new T.Vector3(-dir.z,0,dir.x);
   for(let j=0;j<3;j++){const q=hit.point.clone().addScaledVector(dir,.012).addScaledVector(tangent,Math.cos(j*2.1+a)*.044);q.y+=Math.sin(j*2.1+a)*.034;q.x*=.94;q.z*=.94;const corn=s.ellipsoid('RearPopcorn'+count+'_'+j,[q.x/.005+320,580-q.y/.005,q.z],[22,19,.108],j===1?'#fff6d5':'#f8e5b4',a+j*.65);corn.geometry.dispose();corn.geometry=kernelGeometry;corn.userData.skipOriginalPaint=q.z<0;corn.userData.artworkFacingFade=[.35,.70];
    corn.updateWorldMatrix(true,false);let down=0;for(let v=0;v<kernelGeometry.attributes.position.count;v++){const world=corn.localToWorld(new T.Vector3().fromBufferAttribute(kernelGeometry.attributes.position,v)),xx=Math.abs(world.x)/.005,limit=(580-(64+105*(xx/170)**1.8))*.005;down=Math.max(down,world.y-limit);}corn.position.y-=down;
   }count++;
  }
  for(let i=0;i<p.count;i++){p.setY(i,1.94+(p.getY(i)-1.94)*.75);p.setX(i,p.getX(i)*.97);p.setZ(i,p.getZ(i)*.97);}mound.geometry.computeVertexNormals();mound.geometry.computeBoundingBox();mound.geometry.computeBoundingSphere();
  const bucket=g.getObjectByName('PopcornBucketSolid');bucket.userData.artworkFacingFade=[.4,.75];ink(T,k,bucket,'#8a3030',.007);
 }
 for(const name of ['Torso','LeftArm','RightArm','LeftLeg','RightLeg']){
  if(pizza&&name.endsWith('Arm'))continue;const part=parts.get(name),left=name.startsWith('Left'),tool=require('./sculpt-kit.cjs')(T,k,part);part.group.clear();let ps,center,depth;
  if(name==='Torso'){ps=pizza?[[289,518],[351,518],[353,540],[340,552],[300,552],[287,540]]:[[260,436],[380,436],[388,465],[381,506],[361,533],[320,544],[278,533],[256,506],[251,464]];center=[320,pizza?531:485];depth=pizza?.18:.28;}
  else if(name.endsWith('Arm')){ps=[[257,435],[272,448],[255,478],[248,500],[235,510],[220,502],[217,489],[226,462],[241,441]].map(([x,y])=>[left?x:640-x,y]);center=[left?242:398,474];depth=.115;}
  else{ps=(pizza?[[267,520],[309,536],[308,555],[303,574],[280,578],[260,571],[264,555]]:[[272,525],[310,533],[307,553],[300,573],[280,578],[260,571],[257,558],[265,539]]).map(([x,y])=>[left?x:640-x,y]);center=[left?283:357,553];depth=.145;}
  const halves=volume(part,'FinishedMovie'+name,ps,center,depth,pizza?'#f3bf7b':'#f8d09a');for(const mesh of halves){mesh.userData.artworkFacingFade=[.35,.7];if(name!=='Torso'||pizza)mesh.userData.skipOriginalPaint=true;}
  part.group.userData.directSurfaceArtwork=true;part.group.userData.artworkOpaqueRegions=[];tool.paint();for(const mesh of halves)ink(T,k,mesh,'#a47346',.008);
 }
 g.userData.artworkOcclusion=true;require('./project-model-artwork.cjs')(T,k,g,head.part.pivot);
 if(pizza){const edge=g.getObjectByName('RoundedPizzaCrustSurface').geometry.attributes.position,boundary=[];for(let i=edge.count-80;i<edge.count;i++)boundary.push([edge.getX(i)/.005+head.part.pivot[0],head.part.pivot[1]-edge.getY(i)/.005]);for(const art of g.children.filter(o=>o.name.startsWith('RoundedPizzaCrust')&&o.material?.userData.originalTexture)){const p=art.geometry.attributes.position,c=art.geometry.attributes.color;for(let i=0;i<p.count;i++){const x=p.getX(i)/.005+head.part.pivot[0],y=head.part.pivot[1]-p.getY(i)/.005;let d=Infinity;for(const[bx,by]of boundary)d=Math.min(d,Math.hypot(x-bx,y-by));c.setW(i,c.getW(i)*T.MathUtils.smoothstep(d,5,14));}}}
 if(!pizza){const boundary=[];for(let i=0;i<head.points.length;i+=4)if(head.points[i+3]<5)boundary.push([head.points[i],head.points[i+1]]);for(const art of g.children.filter(o=>o.isMesh&&o.material.userData.originalTexture)){const p=art.geometry.attributes.position,c=art.geometry.attributes.color;if(!c)continue;for(let i=0;i<p.count;i++){const x=p.getX(i)/.005+head.part.pivot[0],y=head.part.pivot[1]-p.getY(i)/.005;let d=Infinity;for(const[bx,by]of boundary)d=Math.min(d,Math.hypot(x-bx,y-by));c.setW(i,c.getW(i)*T.MathUtils.smoothstep(d,4,12)*(art.name.startsWith('RearPopcorn')?1-T.MathUtils.smoothstep(y,154,166):1));}}}

};
