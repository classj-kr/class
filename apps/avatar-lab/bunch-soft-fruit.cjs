"use strict";

module.exports=function softFruit(T,k,id,parts){
 if(!['fruit-grape','fruit-mango','fruit-melon','fruit-peach'].includes(id))return false;
 const head=parts.get('Head'),s=require('./sculpt-kit.cjs')(T,k,head);s.parent.clear();s.parent.userData.directSurfaceArtwork=true;s.parent.userData.artworkOcclusion=true;
 s.parent.userData.artworkOpaqueRegions=[{cx:id==='fruit-mango'?310:320,cy:id==='fruit-mango'?310:320,rx:118,ry:102}];
 const plain=o=>{o.userData.skipOriginalPaint=true;return o;};
 function volume(name,outline,center,front,back,color,z=0,tool=s){
  k.volume(name+'Half',outline,center,tool.pivot,front,back,tool.parent,k.solid(name+'Color',color),{art:false,samples:96,z:z-tool.offset.z});
  if(['fruit-grape','fruit-mango','fruit-melon','fruit-peach'].includes(id))require('./smooth-paired-volume.cjs')(T,k,tool.parent,name+'Half',{rings:24});
  const P=[],I=[];for(const suffix of ['Surface','Back']){const o=tool.parent.getObjectByName(name+'Half'+suffix),offset=P.length/3;P.push(...o.geometry.attributes.position.array);I.push(...Array.from(o.geometry.index.array,v=>v+offset));tool.parent.remove(o);}
  return k.mesh(name,k.geometry(P,I),k.solid(name+'Color',color),tool.parent);
 }
 function backLine(name,target,pixels,color,r=.008){
  target.updateWorldMatrix(true,false);const ps=[],ray=new T.Raycaster();for(const [x,y] of pixels){ray.set(new T.Vector3((x-320)*.005,(580-y)*.005,-3),new T.Vector3(0,0,1));const hit=ray.intersectObject(target)[0];if(hit)ps.push([x,y,hit.point.z-.004]);}if(ps.length>1)plain(s.tube(name,ps,r,color));
 }
 function arm(name,pivot,z){let a=parts.get(name);if(!a){a={part:{pivot},group:k.group(name,pivot,z)};parts.set(name,a);}a.group.clear();a.part.pivot=pivot;a.group.position.set((pivot[0]-320)*.005,(580-pivot[1])*.005,z);a.group.userData.directSurfaceArtwork=true;return require('./sculpt-kit.cjs')(T,k,a);}
 if(id==='fruit-grape'){
  const berries=[[259,157,54,53,0],[378,155,55,53,0],[184,212,53,52,0],[451,209,53,54,0],[239,235,54,55,.12],[389,238,57,54,.12],[191,309,51,53,0],[453,298,48,49,0],[234,384,50,52,.04],[414,380,54,52,.04],[319,426,57,47,-.05],[318,192,54,55,.40]];
  for(const [i,[x,y,rx,ry,z]] of berries.entries()){const o=s.ellipsoid('GrapeBerrySolid'+i,[x,y,z],[rx,ry,.30],['#8e4c9f','#9957aa','#834392'][i%3]);o.userData.artworkExcludedRegions=[{cx:320,cy:327,rx:108,ry:87},{cx:276,cy:429,rx:35,ry:46},{cx:364,cy:429,rx:35,ry:46}];}
  for(const [i,[x,y]] of [[319,205],[266,283],[374,285],[320,361]].entries())plain(s.ellipsoid('RearGrapeSolid'+i,[x,y,-.30],[58,62,.35],['#8d4e9d','#9857aa'][i%2]));
  const face=s.ellipsoid('GrapeWearerSolid',[320,327,.13],[115,94,.36],'#8b4a9b');face.userData.artworkExcludedRegions=[{cx:276,cy:429,rx:35,ry:46},{cx:364,cy:429,rx:35,ry:46}];
  volume('GrapeStalkSolid',[[251,67],[273,72],[307,74],[338,71],[361,63],[368,67],[369,77],[361,87],[332,94],[331,136],[309,139],[305,94],[279,92],[257,85],[248,78]],[311,94],.07,.07,'#628b37');
  const torso=parts.get('Torso');torso.group.clear();torso.group.userData.directSurfaceArtwork=true;const t=require('./sculpt-kit.cjs')(T,k,torso),suit=t.ellipsoid('GrapeTorsoSolid',[320,486,0],[64,61,.28],'#9a58aa');suit.userData.artworkExcludedRegions=[{cx:276,cy:429,rx:35,ry:46},{cx:364,cy:429,rx:35,ry:46}];t.paint();
  for(const side of [-1,1]){
   const a=arm(side<0?'LeftArm':'RightArm',[320+side*48,447],.38),outline=[[283,393],[296,398],[301,412],[294,433],[280,453],[263,464],[248,461],[242,451],[247,435],[258,425],[269,401]].map(([x,y])=>[side<0?x:640-x,y]);
   volume('GrapeRaisedHandSolid'+side,outline,[320+side*47,429],.14,.14,'#9c5aaf',.20,a);
   a.sweep('GrapeShoulderJoin'+side,[[320+side*43,470,.10,17],[320+side*49,451,.17,18],[320+side*45,436,.20,16]],'#9453a6');a.paint();
  }
 }
 if(id==='fruit-mango'){
  const body=volume('MangoFruitSolid',[[344,109],[397,128],[441,166],[468,218],[482,278],[475,341],[454,392],[422,434],[393,477],[348,513],[294,536],[232,546],[182,539],[149,524],[136,503],[136,478],[149,437],[154,411],[151,361],[147,303],[154,247],[174,196],[207,156],[250,125],[297,110]],[309,324],.70,.70,'#f1b930');
  body.userData.artworkExcludedRegions=[{cx:426,cy:447,rx:28,ry:55}];
  volume('MangoStalkSolid',[[332,65],[348,62],[359,69],[358,119],[348,127],[332,122]],[346,94],.06,.06,'#677a31');
  volume('MangoLeafSolid',[[358,88],[386,81],[416,88],[447,108],[474,137],[493,171],[504,194],[482,198],[444,187],[411,169],[384,144],[368,119]],[425,140],.13,.13,'#548b37');
  const leaf=s.parent.getObjectByName('MangoLeafSolid'),lp=leaf.geometry.attributes.position;for(let i=0;i<lp.count;i++){const y=s.pivot[1]-lp.getY(i)/.005;lp.setZ(i,lp.getZ(i)+.5*Math.max(0,Math.min(1,(y-90)/60)));}leaf.geometry.computeVertexNormals();
  const old=parts.get('Torso');if(old){old.group.parent.remove(old.group);parts.delete('Torso');}
  const a=arm('RightArm',[418,420],.24);volume('MangoSleeveSolid',[[408,400],[421,405],[432,423],[439,449],[441,471],[436,486],[426,491],[417,486],[413,469],[414,444]],[425,448],.12,.12,'#edb631',.33,a);a.paint();
  for(const [name,outline] of [['LeftLeg',[[251,531],[296,529],[297,553],[289,568],[270,575],[250,572],[244,563],[250,550]]],['RightLeg',[[326,518],[369,504],[365,549],[373,563],[370,574],[348,577],[327,569],[321,554]]]]){
   const part=parts.get(name);part.group.clear();part.group.userData.directSurfaceArtwork=true;const l=require('./sculpt-kit.cjs')(T,k,part);volume('Mango'+name+'Solid',outline,[name==='LeftLeg'?273:346,548],.16,.16,'#eebd3b',0,l);l.paint();
  }
 }
 if(id==='fruit-melon'){
  const body=volume('MelonFruitSolid',[[320,112],[378,122],[431,151],[470,196],[492,247],[498,302],[484,355],[454,397],[408,430],[355,447],[300,450],[244,438],[196,407],[163,363],[144,313],[142,259],[160,208],[190,166],[234,134],[275,118]],[320,282],.82,.82,'#a8c653');
  volume('MelonStalkSolid',[[265,63],[295,65],[333,65],[371,61],[382,64],[378,74],[356,83],[334,84],[329,113],[306,114],[311,85],[283,82],[268,75]],[324,84],.06,.06,'#6f9838');
  // Shared irregular cell edges form a continuous rear rind network.
  // Every sampled point is projected onto the actual closed fruit surface.
  body.updateWorldMatrix(true,false);const center=new T.Vector3(0,(580-282)*.005,0),ray=new T.Raycaster();
  let n=0;for(const [a,b] of require('./melon-net-layout.json')){
   const points=[];for(let i=0;i<=8;i++){const t=i/8,bend=Math.sin(t*Math.PI)*.025*Math.sin(a[0]*17+a[1]*23),u=a[0]*(1-t)+b[0]*t+bend,v=a[1]*(1-t)+b[1]*t-bend*.6,dir=new T.Vector3(Math.sin(u)*Math.cos(v),Math.sin(v),-Math.cos(u)*Math.cos(v));ray.set(center.clone().addScaledVector(dir,3),dir.clone().negate());const hit=ray.intersectObject(body)[0];if(hit){const p=hit.point.clone().addScaledVector(dir,.004);points.push([p.x/.005+320,580-p.y/.005,p.z]);}}
   if(points.length>1){
    const curve=new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...s.point(p)))),tube=new T.TubeGeometry(curve,8,.012,6,false),P=Array.from(tube.attributes.position.array),I=Array.from(tube.index.array);
    for(const end of [0,8]){const c=P.length/3;P.push(...curve.getPoint(end/8).toArray());for(let i=0;i<6;i++)end?I.push(c,end*7+i,end*7+i+1):I.push(c,i+1,i);}
    plain(k.mesh('MelonRearNet'+n++,k.geometry(P,I),k.solid('MelonNetColor','#dcea9f'),s.parent));tube.dispose();
   }
  }
 }
 if(id==='fruit-peach'){
  const body=volume('PeachFruitSolid',[[320,63],[350,84],[400,117],[449,154],[485,197],[510,246],[520,292],[510,338],[487,375],[452,404],[408,422],[359,426],[321,417],[280,425],[229,424],[184,408],[146,376],[126,338],[118,294],[125,247],[146,202],[176,163],[223,126],[273,95]],[320,282],.79,.79,'#e99c91');
  const left=volume('PeachLeafLeftSolid',[[319,417],[277,410],[230,411],[184,417],[158,431],[146,444],[171,454],[214,463],[257,458],[291,442]],[233,436],.105,.105,'#6e9c3b');
  const right=volume('PeachLeafRightSolid',[[321,417],[363,412],[408,411],[452,419],[479,430],[494,445],[465,454],[424,463],[383,458],[350,441]],[408,437],.105,.105,'#77a33c');
  backLine('PeachRearCrease',body,Array.from({length:35},(_,i)=>[320+17*Math.sin(i/34*Math.PI),88+i/34*317]),'#d88a80',.009);
  for(const [i,target] of [left,right].entries())backLine('PeachRearLeafVein'+i,target,Array.from({length:16},(_,j)=>[320+(i?1:-1)*j*9,424+Math.sin(j/15*Math.PI)*13]),'#527f2c',.007);
  for(const side of [-1,1]){const a=arm(side<0?'LeftArm':'RightArm',[320+side*59,467],0),outline=[[222,457],[242,459],[249,477],[243,500],[231,507],[220,503],[214,491]].map(([x,y])=>[side<0?x:640-x,y]);volume('PeachSleeveSolid'+side,outline,[320+side*88,481],.125,.125,'#eaa39b',0,a);a.paint();}
 }
 s.paint();head.authoredFamily='bunch-soft-fruit';return true;
};
