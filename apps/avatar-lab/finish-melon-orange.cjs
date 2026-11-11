"use strict";
module.exports=function(T,k,id,parts){
 if(!['fruit-melon','fruit-orange'].includes(id))return;
 const melon=id==='fruit-melon',head=parts.get('Head'),g=head.group,ink=require('./solid-ink-shell.cjs'),prefix=melon?'FinishedMelon':'FinishedOrange';
 for(const o of [...g.children])if(o.material?.userData.originalTexture)g.remove(o);
 const fruit=g.getObjectByName(melon?'MelonFruitSolid':'OrangeFruitSolid');fruit.userData.artworkFacingFade=[.35,.70];
 fruit.material.color.set(melon?'#a5c44b':'#ff9d17').convertSRGBToLinear();
 if(!melon){const leaf=g.getObjectByName('OrangeLeafSolid');leaf.geometry.translate(-.025,0,.08);leaf.geometry.computeBoundingBox();leaf.geometry.computeBoundingSphere();}
 for(const name of ['Torso','LeftArm','RightArm','LeftLeg','RightLeg']){const part=parts.get(name),left=name.startsWith('Left');part.group.clear();let ps,center,depth;
  if(name==='Torso'){ps=[[258,435],[382,435],[389,473],[382,511],[360,535],[320,544],[280,535],[258,511],[251,473]];center=[320,489];depth=.28;}
  else if(name.endsWith('Arm')){ps=[[251,435],[269,445],[254,478],[247,505],[233,516],[218,511],[215,495],[225,463],[240,442]].map(([x,y])=>[left?x:640-x,y]);center=[left?241:399,473];depth=.12;}
  else{ps=[[273,529],[308,536],[306,553],[300,574],[282,580],[260,574],[257,563],[266,545]].map(([x,y])=>[left?x:640-x,y]);center=[left?283:357,553];depth=.145;}
  const n=prefix+name;k.volume(n,ps,center,part.part.pivot,depth,depth,part.group,k.solid(n+'Color',melon?'#a5c44b':'#ff9d17'),{art:false,samples:96});require('./smooth-paired-volume.cjs')(T,k,part.group,n,{rings:24});
  for(const suffix of ['Surface','Back']){const o=part.group.getObjectByName(n+suffix);o.userData.artworkFacingFade=[.35,.70];if(!melon&&name!=='Torso')o.userData.skipOriginalPaint=true;else if(name==='Torso')o.userData.artworkMinY=451;}
  part.group.userData.directSurfaceArtwork=true;part.group.userData.artworkOpaqueRegions=[];const s=require('./sculpt-kit.cjs')(T,k,part);s.paint();
  if(melon){
   const targets=['Surface','Back'].map(suffix=>part.group.getObjectByName(n+suffix));part.group.updateWorldMatrix(true,true);
   const xs=ps.map(p=>p[0]),ys=ps.map(p=>p[1]),xmin=Math.min(...xs),xmax=Math.max(...xs),ymin=Math.min(...ys),ymax=Math.max(...ys);let count=0;
   for(const direction of [-1,1])for(let row=-2;row<6;row++){let points=[];
    const flush=()=>{if(points.length>2){const curve=new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...s.point(p)))),steps=16,sides=6,tube=new T.TubeGeometry(curve,steps,.009,sides,false),P=Array.from(tube.attributes.position.array),I=Array.from(tube.index.array);for(const end of [0,steps]){const c=P.length/3;P.push(...curve.getPoint(end/steps).toArray());for(let j=0;j<sides;j++)end?I.push(c,end*(sides+1)+j,end*(sides+1)+j+1):I.push(c,j+1,j);}const o=k.mesh('MelonSuitRearNet'+name+count++,k.geometry(P,I),k.solid('MelonSuitNetColor','#eaf3ba'),part.group);o.userData.skipOriginalPaint=true;tube.dispose();}points=[];};
    for(let j=0;j<=48;j++){const x=xmin+(xmax-xmin)*j/48,y=ymin+row*40+direction*(x-center[0])*.62+5*Math.sin(j/48*Math.PI+row*.7);const hit=new T.Raycaster(new T.Vector3((x-320)*.005,(580-y)*.005,-3),new T.Vector3(0,0,1)).intersectObjects(targets)[0];if(hit)points.push([x,y,hit.point.z-.004]);else flush();}flush();
   }
  }
  for(const suffix of ['Surface','Back'])ink(T,k,part.group.getObjectByName(n+suffix),melon?'#637f27':'#b86f12',.007);
 }
 g.userData.artworkOcclusion=true;g.userData.artworkOpaqueRegions=[{cx:320,cy:melon?319:320,rx:116,ry:99}];require('./project-model-artwork.cjs')(T,k,g,head.part.pivot);ink(T,k,fruit,melon?'#637f27':'#b86f12',.007);
};
