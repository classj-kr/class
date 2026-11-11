"use strict";
module.exports=function(T,k,id,parts){
 if(!['fruit-pineapple','fruit-strawberry'].includes(id))return;
 const pineapple=id==='fruit-pineapple',head=parts.get('Head'),g=head.group,ink=require('./solid-ink-shell.cjs'),prefix=pineapple?'FinishedPineapple':'FinishedStrawberry',color=pineapple?'#ffce29':'#f46772';
 if(!pineapple)head.skipNeckJoin=true;
 for(const o of [...g.children])if(o.material?.userData.originalTexture)g.remove(o);
 const fruit=g.getObjectByName(pineapple?'PineappleFruitSolid':'StrawberryFruitSolid');fruit.userData.artworkFacingFade=[.35,.70];fruit.material.color.set(pineapple?'#ffce29':'#f32735').convertSRGBToLinear();
 if(pineapple){const leaf=g.getObjectByName('PineappleLeafSolid5');leaf.geometry.translate(0,0,-.08);leaf.geometry.computeBoundingBox();leaf.geometry.computeBoundingSphere();}
 if(pineapple)require('./pineapple-wrap-pattern.cjs')(T,k,head,fruit);
 else{
  const s=require('./sculpt-kit.cjs')(T,k,head);fruit.updateWorldMatrix(true,false);for(const o of g.children)if(o.name.startsWith('StrawberryRearSeed'))o.material.color.set('#ffe1a0').convertSRGBToLinear();let count=0;
  for(const side of [-1,1])for(let row=0;row<6;row++)for(const base of [1.35,1.65]){const u=side*(base+(row%2)*.08),y=205+row*43,dir=new T.Vector3(Math.sin(u),0,Math.cos(u)),center=new T.Vector3(0,(580-y)*.005,0),h=new T.Raycaster(center.clone().addScaledVector(dir,3),dir.clone().negate()).intersectObject(fruit)[0];if(!h)continue;const x=h.point.x/.005+320;if(((x-320)/120)**2+((y-321)/104)**2<1.14)continue;const normal=h.face.normal.clone().transformDirection(fruit.matrixWorld),p=h.point.clone().addScaledVector(normal,.003),o=s.ellipsoid('StrawberryFlankSeed'+count++,[p.x/.005+320,580-p.y/.005,p.z],[4.7,7.4,.012],'#ffe1a0');o.quaternion.setFromUnitVectors(new T.Vector3(0,0,1),normal);o.userData.skipOriginalPaint=true;}
 }
 for(const name of ['Torso','LeftArm','RightArm','LeftLeg','RightLeg']){
  const left=name.startsWith('Left');let part=parts.get(name);if(!part){const pivot=name==='Torso'?[320,492]:name.endsWith('Arm')?[left?258:382,449]:[left?284:356,536];part={part:{pivot},group:k.group(name,pivot)};parts.set(name,part);}part.group.clear();let ps,center,depth;
  if(name==='Torso'){ps=[[268,442],[372,442],[384,474],[380,510],[360,533],[320,544],[280,533],[260,510],[256,474]];center=[320,492];depth=.28;}
  else if(name.endsWith('Arm')){ps=[[251,438],[267,449],[255,477],[247,506],[235,515],[220,508],[216,494],[227,467],[240,445]].map(([x,y])=>[left?x:640-x,y]);center=[left?242:398,478];depth=.12;}
  else{ps=[[273,527],[308,535],[306,552],[300,573],[282,579],[260,573],[257,561],[266,543]].map(([x,y])=>[left?x:640-x,y]);center=[left?283:357,553];depth=.145;}
  if(!pineapple&&name.endsWith('Arm'))for(const i of [0,1,2])ps[i][0]+=(left?1:-1)*12;
  const n=prefix+name;k.volume(n,ps,center,part.part.pivot,depth,depth,part.group,k.solid(n+'Color',color),{art:false,samples:96});require('./smooth-paired-volume.cjs')(T,k,part.group,n,{rings:24});
  if(!pineapple)for(const suffix of ['Surface','Back']){const geo=part.group.getObjectByName(n+suffix).geometry;geo.translate(0,0,-.23);geo.computeBoundingBox();geo.computeBoundingSphere();}
  for(const suffix of ['Surface','Back']){const o=part.group.getObjectByName(n+suffix);o.userData.artworkFacingFade=[.35,.70];if(name!=='Torso')o.userData.skipOriginalPaint=true;else o.userData.artworkMinY=pineapple?455:466;}
  part.group.userData.directSurfaceArtwork=true;part.group.userData.artworkOpaqueRegions=[];const s=require('./sculpt-kit.cjs')(T,k,part);s.paint();
  if(!pineapple&&name==='Torso')for(const o of part.group.children)if(o.material?.userData.originalTexture){const p=o.geometry.attributes.position,c=o.geometry.attributes.color;for(let i=0;i<p.count;i++){const y=part.part.pivot[1]-p.getY(i)/.005;c.setW(i,c.getW(i)*T.MathUtils.smoothstep(y,478,490));}}
  if(pineapple&&name==='Torso'){
   const targets=['Surface','Back'].map(suffix=>part.group.getObjectByName(n+suffix));part.group.updateWorldMatrix(true,true);let count=0;
   for(const direction of [-1,1])for(let row=-3;row<=5;row++){let points=[];
    const flush=()=>{if(points.length>2){const curve=new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...s.point(p)))),steps=12,sides=6,tube=new T.TubeGeometry(curve,steps,.009,sides,false),P=Array.from(tube.attributes.position.array),I=Array.from(tube.index.array);for(const end of [0,steps]){const c=P.length/3;P.push(...curve.getPoint(end/steps).toArray());for(let j=0;j<sides;j++)end?I.push(c,end*7+j,end*7+j+1):I.push(c,j+1,j);}const o=k.mesh('PineappleSuitRearDiamond'+count++,k.geometry(P,I),k.solid('PineappleSuitNetColor','#dfa322'),part.group);o.userData.skipOriginalPaint=true;tube.dispose();}points=[];};
    for(let j=0;j<=48;j++){const x=254+j*132/48,y=442+row*43+direction*(x-320)*.85,hit=new T.Raycaster(new T.Vector3((x-320)*.005,(580-y)*.005,-3),new T.Vector3(0,0,1)).intersectObjects(targets)[0];if(hit)points.push([x,y,hit.point.z-.004]);else flush();}flush();
   }
  }
  for(const suffix of ['Surface','Back'])ink(T,k,part.group.getObjectByName(n+suffix),pineapple?'#c59719':'#b63a46',.007);
 }
 g.userData.artworkOcclusion=true;g.userData.artworkOpaqueRegions=[{cx:320,cy:pineapple?340:321,rx:pineapple?106:113,ry:pineapple?88:96}];require('./project-model-artwork.cjs')(T,k,g,head.part.pivot);ink(T,k,fruit,pineapple?'#bf9017':'#b31b29',.007);
};
