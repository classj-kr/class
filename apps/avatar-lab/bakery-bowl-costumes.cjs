"use strict";

module.exports=function bakeryBowl(T,k,id,parts){
 if(!['food-fish-pastry','food-toast','food-tteokbokki'].includes(id))return false;
 const head=parts.get('Head'),s=require('./sculpt-kit.cjs')(T,k,head);
 s.parent.clear();s.parent.userData.directSurfaceArtwork=true;
 s.parent.userData.artworkOpaqueRegions=[{cx:320,cy:id==='food-tteokbokki'?292:314,rx:120,ry:101}];
 const plain=o=>{o.userData.skipOriginalPaint=true;return o;};
 function volume(name,outline,center,depth,color){
  k.volume(name+'Half',outline,center,s.pivot,depth,depth,s.parent,k.solid(name+'Color',color),{art:false,samples:128});
  const P=[],I=[];for(const suffix of ['Surface','Back']){const o=s.parent.getObjectByName(name+'Half'+suffix),offset=P.length/3;P.push(...o.geometry.attributes.position.array);I.push(...Array.from(o.geometry.index.array,v=>v+offset));s.parent.remove(o);}
  return k.mesh(name,k.geometry(P,I),k.solid(name+'Color',color),s.parent);
 }
 function backLine(name,target,pixels,color,r=.008){
  target.updateWorldMatrix(true,false);const ray=new T.Raycaster(),ps=[];
  for(const [x,y] of pixels){ray.set(new T.Vector3((x-320)*.005,(580-y)*.005,-3),new T.Vector3(0,0,1));const hit=ray.intersectObject(target)[0];if(hit)ps.push([x,y,hit.point.z-.005]);}
  if(ps.length>1)plain(s.tube(name,ps,r,color));
 }
 if(id==='food-fish-pastry'){
  const body=volume('FishPastryBodySolid',[[285,114],[371,129],[438,166],[481,216],[498,263],[489,318],[462,365],[410,405],[352,433],[267,437],[186,414],[125,376],[84,335],[60,325],[57,311],[74,301],[61,291],[50,277],[50,265],[74,245],[100,202],[147,160],[204,129]],[277,278],.53,'#dfa45c');
  const tail=volume('PastryTailSolid',[[468,214],[514,177],[551,163],[577,171],[585,190],[577,228],[562,267],[564,300],[585,346],[588,367],[570,382],[537,382],[503,372],[466,348]],[530,273],.17,'#dfa45c');
  const fin=volume('PastryDorsalSolid',[[227,121],[253,88],[278,69],[302,63],[333,73],[379,101],[421,126],[437,146],[440,175],[397,153],[349,133],[290,118]],[329,119],.12,'#e5ad66');
  const lower=volume('PastryLowerFinSolid',[[369,395],[414,378],[459,358],[465,389],[445,420],[417,433],[378,440],[348,435]],[410,409],.12,'#d89a51');
  for(const o of [body,tail,fin,lower])o.userData.artworkExcludedRegions=[{cx:275,cy:414,rx:35,ry:42},{cx:357,cy:414,rx:35,ry:42}];
  for(let row=0;row<4;row++)for(let col=0;col<5;col++){
   const x=246+col*39,y=165+row*48,ps=[];for(let j=0;j<=14;j++){const a=-Math.PI/2+j/14*Math.PI;ps.push([x+Math.cos(a)*15,y+Math.sin(a)*23]);}
   backLine('RearPastryScale'+row+'_'+col,body,ps,'#ae7238');
  }
  backLine('RearFishGill',body,Array.from({length:25},(_,i)=>[205+22*Math.sin(i/24*Math.PI),159+i*8.7]),'#ae7238');
  for(let i=0;i<4;i++)backLine('TailRay'+i,tail,[[487,238+i*24],[526,211+i*42],[568,192+i*55]],'#b77a3d');
  for(let i=0;i<4;i++)backLine('DorsalRay'+i,fin,[[271+i*42,91+i*13],[253+i*48,124+i*8]],'#b77a3d');
  const torso=parts.get('Torso');torso.group.clear();torso.group.userData.directSurfaceArtwork=true;
  const t=require('./sculpt-kit.cjs')(T,k,torso);t.ellipsoid('PastryTorsoSolid',[320,485,0],[72,66,.27],'#dfa45c');t.paint();
  for(const side of [-1,1]){
   const name=side<0?'LeftArm':'RightArm',pivot=[320+side*53,433];let arm=parts.get(name);if(!arm){arm={part:{pivot},group:k.group(name,pivot)};parts.set(name,arm);}
   arm.group.clear();arm.part.pivot=pivot;arm.group.position.set((pivot[0]-320)*.005,(580-pivot[1])*.005,.36);arm.group.userData.directSurfaceArtwork=true;
   const a=require('./sculpt-kit.cjs')(T,k,arm),outline=[[282,374],[297,383],[303,398],[291,424],[277,445],[261,454],[245,447],[241,434],[252,415],[263,398],[268,381]].map(([x,y])=>[side<0?x:640-x,y]);
   const hand=a.smoothOutline('RaisedPastryHandSolid'+side,outline,.20,'#e8af68',.30,.024),hp=hand.geometry.attributes.position;
   for(let i=0;i<hp.count;i++){const y=580-hp.getY(i)/.005;hp.setZ(i,hp.getZ(i)+(430-y)*.004);}hand.geometry.computeVertexNormals();
   a.sweep('PastryShoulderJoin'+side,[[320+side*41,460,.10,15],[320+side*47,443,.16,16],[320+side*40,425,.30,16]],'#dfa45c');a.paint();
  }
 }
 if(id==='food-toast'){
  const outline=[[320,63],[387,68],[438,87],[474,113],[495,146],[501,176],[493,202],[477,220],[481,338],[477,386],[463,412],[439,427],[395,438],[244,440],[198,433],[172,419],[158,396],[154,361],[159,220],[143,203],[139,179],[148,146],[172,116],[211,89],[266,70]];
  s.smoothOutline('ToastBreadSolid',outline,.47,'#b9854b',0,.03);
  plain(s.smoothOutline('ToastRearCrumbSolid',outline.map(([x,y])=>[320+(x-320)*.88,253+(y-253)*.91]),.026,'#efcf98',-.24,.008));
 }
 if(id==='food-tteokbokki'){
  s.parent.userData.artworkOcclusion=true;
  const tilt=p=>{p.y-=.58*p.z*Math.min(1,Math.max(0,p.y/1.7));};
  function lathe(name,profile,color,density=5){
   const points=[];for(let i=0;i<profile.length-1;i++)for(let j=0;j<density;j++){const t=j/density;points.push(new T.Vector2(profile[i][0]*(1-t)+profile[i+1][0]*t,profile[i][1]*(1-t)+profile[i+1][1]*t));}points.push(new T.Vector2(...profile.at(-1)));
   const g=new T.LatheGeometry(points,96),p=g.attributes.position,colors=[];
   for(let i=0;i<p.count;i++){const v=new T.Vector3().fromBufferAttribute(p,i),c=new T.Color(name==='RiceCakeBowlSolid'&&v.y>1.35&&v.y<1.58?'#d14e35':color).convertSRGBToLinear();colors.push(c.r,c.g,c.b);tilt(v);p.setXYZ(i,v.x,v.y,v.z);}
   g.computeVertexNormals();g.setAttribute('color',new T.Float32BufferAttribute(colors,3));const o=s.mesh(name,g,'#ffffff');o.material.userData.preserveVertexColor=true;return o;
  }
  const bowl=lathe('RiceCakeBowlSolid',[[0,.15],[.42,.15],[.62,.20],[.72,.35],[.88,.50],[1.10,.80],[1.26,1.20],[1.36,1.62],[1.39,1.70],[1.34,1.74],[1.29,1.68],[1.24,1.40],[1.08,1],[.86,.70],[.62,.48],[0,.48],[0,.15]],'#f1d9bb');
  const sauce=lathe('RiceCakeSauceSolid',[[0,1.60],[1.29,1.60],[1.29,1.64],[0,1.64],[0,1.60]],'#c74b26',32);
  // The face is painted on the dense supported food surface, inside the rim.
  // No upright oval head floats above the bowl or protrudes through its wall.
  for(const [i,x,y,rx,ry,a] of [[0,185,211,63,23,-.2],[1,145,271,46,23,.4],[2,440,171,62,22,.55],[3,495,253,58,24,-1.05],[4,367,174,51,21,.15]]){
   const yy=(580-y)*.005,z=(1.64-yy)/(.58*1.64/1.7),rice=s.ellipsoid('RiceCakePiece'+i,[x,y-7,z],[rx,ry,.12],'#eca043',a);rice.rotation.y=.2*Math.sin(i);rice.userData.artworkFacingFade=[.10,.35];
  }
 }
 s.paint();head.authoredFamily='bakery-bowl';return true;
};
