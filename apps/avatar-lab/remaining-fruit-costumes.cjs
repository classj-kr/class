"use strict";

// Original-sized silhouettes, closed depth and surface-attached rear details.
module.exports=function remainingFruit(T,k,id,parts){
 if(!['fruit-cherry','fruit-persimmon','fruit-pineapple','fruit-strawberry','fruit-watermelon'].includes(id))return false;
 const head=parts.get('Head'),sculpt=require('./sculpt-kit.cjs'),s=sculpt(T,k,head);
 s.parent.clear();s.parent.userData.directSurfaceArtwork=true;s.parent.userData.artworkOcclusion=true;
 const face=id==='fruit-cherry'?[320,453,112,94]:id==='fruit-persimmon'?[320,298,122,99]:[320,328,116,100];
 s.parent.userData.artworkOpaqueRegions=[{cx:face[0],cy:face[1],rx:face[2],ry:face[3]}];
 const plain=o=>{o.userData.skipOriginalPaint=true;return o;};
 function volume(name,outline,center,front,back,color,z=0,tool=s){
  k.volume(name+'Half',outline,center,tool.pivot,front,back,tool.parent,k.solid(name+'Color',color),{art:false,samples:96,z:z-tool.offset.z});
  if(['fruit-cherry','fruit-persimmon','fruit-pineapple','fruit-strawberry'].includes(id))require('./smooth-paired-volume.cjs')(T,k,tool.parent,name+'Half',{rings:24});
  const P=[],I=[];for(const suffix of ['Surface','Back']){const o=tool.parent.getObjectByName(name+'Half'+suffix),offset=P.length/3;P.push(...o.geometry.attributes.position.array);I.push(...Array.from(o.geometry.index.array,v=>v+offset));tool.parent.remove(o);}
  const mesh=k.mesh(name,k.geometry(P,I),k.solid(name+'Color',color),tool.parent);mesh.userData.artworkFacingFade=[.16,.48];return mesh;
 }
 function rayAt(target,x,y,front=false){target.updateWorldMatrix(true,false);const ray=new T.Raycaster(new T.Vector3((x-320)*.005,(580-y)*.005,front?3:-3),new T.Vector3(0,0,front?-1:1));return ray.intersectObject(target)[0];}
 function rearLine(name,target,ps,color,r=.009){const points=[];for(const [x,y] of ps){const hit=rayAt(target,x,y);if(hit)points.push([x,y,hit.point.z-.005]);}if(points.length>1)plain(s.tube(name,points,r,color));}
 function drape(leaf,target){const p=leaf.geometry.attributes.position;for(let i=0;i<p.count;i++){const x=s.pivot[0]+p.getX(i)/.005,y=s.pivot[1]-p.getY(i)/.005,hit=rayAt(target,x,y,true);if(hit)p.setZ(i,p.getZ(i)+hit.point.z-s.offset.z+.008);}leaf.geometry.computeVertexNormals();}
 function rearCalyx(front,name,color){const geo=front.geometry.clone();geo.scale(1,1,-1);const ix=geo.index.array;for(let i=0;i<ix.length;i+=3)[ix[i+1],ix[i+2]]=[ix[i+2],ix[i+1]];geo.computeVertexNormals();const o=plain(k.mesh(name,geo,k.solid(name+'Color',color),s.parent));return o;}
 function backSeed(name,target,x,y,rx,ry,color){const hit=rayAt(target,x,y);if(!hit)return;const o=plain(s.ellipsoid(name,[x,y,hit.point.z-.004],[rx,ry,.012],color)),normal=hit.face.normal.clone().transformDirection(target.matrixWorld);o.quaternion.setFromUnitVectors(new T.Vector3(0,0,1),normal);}
 if(id==='fruit-cherry'){
  for(const name of ['Torso','LeftArm','RightArm','LeftLeg','RightLeg']){const p=parts.get(name);if(p){p.group.parent.remove(p.group);parts.delete(name);}}
  volume('CherryFruitSolid',[[320,308],[350,300],[391,302],[428,322],[459,356],[477,397],[483,443],[472,489],[448,528],[411,556],[366,574],[320,580],[269,575],[223,557],[187,526],[165,486],[157,442],[162,397],[181,356],[213,324],[251,303],[289,298]],[320,443],.70,.70,'#cc3943');
  s.paint();
  const group=k.group('CherrySprig',head.part.pivot,head.group.position.z),t=sculpt(T,k,{group,part:{pivot:head.part.pivot}});group.userData.directSurfaceArtwork=true;
  t.sweep('CherryStemSolid',[[320,329,0,11],[325,270,0,12],[342,203,0,11],[371,135,0,10],[408,82,0,8],[429,64,0,5]],'#517d30');
  volume('CherryLeafSolid',[[399,88],[367,75],[334,67],[302,73],[270,92],[243,118],[224,153],[235,165],[269,175],[302,174],[337,162],[366,140],[390,112]],[307,125],.10,.08,'#729d3b',.035,t);
  t.paint();
  // Rear vein lies on the leaf, not on a flat plane behind it.
  const leaf=group.getObjectByName('CherryLeafSolid');for(const [n,ps] of [[0,[[234,153],[268,126],[306,108],[349,99],[391,98]]],[1,[[306,108],[307,141],[287,162]]],[2,[[349,99],[342,125],[325,147]]]]){
   const points=[];for(const [x,y] of ps){const h=rayAt(leaf,x,y);if(h)points.push([x,y,h.point.z-.005]);}if(points.length>1)plain(t.tube('CherryRearVein'+n,points,.009,'#527c2d'));
  }
  const anchor=new T.Vector3(...t.point([320,329,0]));for(const child of group.children)child.position.sub(anchor);group.position.add(anchor);
  return true;
 }
 if(id==='fruit-persimmon'){
  const body=volume('PersimmonFruitSolid',[[320,89],[385,91],[441,111],[487,151],[517,200],[530,250],[529,296],[511,343],[479,383],[431,412],[378,428],[320,433],[258,428],[202,411],[158,383],[127,344],[109,297],[108,249],[121,201],[152,155],[197,117],[253,95]],[320,267],.88,.88,'#ed8a20');
  const calyx=volume('PersimmonCalyxSolid',[[319,62],[343,74],[355,78],[394,80],[425,88],[450,101],[433,118],[407,131],[376,131],[370,151],[350,169],[319,182],[289,171],[268,152],[259,131],[226,133],[203,122],[184,101],[209,89],[243,81],[277,80],[296,69]],[320,113],.065,.055,'#80933b');drape(calyx,body);
  const rear=rearCalyx(calyx,'PersimmonRearCalyxSolid','#80933b');for(const [n,ps] of [[[320,111],[320,132],[320,168]],[[320,111],[277,106],[211,102]],[[320,111],[362,106],[429,102]]].entries())rearLine('PersimmonRearLeafVein'+n,rear,ps,'#63752d',.008);
  for(const side of [-1,1])rearLine('PersimmonRearLobe'+side,body,Array.from({length:24},(_,i)=>[320+side*(37+34*Math.sin(i/23*Math.PI)),115+i*12.4]),'#dd7e1f',.006);
 }
 if(id==='fruit-pineapple'){
  const body=volume('PineappleFruitSolid',[[320,174],[368,188],[406,219],[435,263],[451,313],[456,363],[445,400],[421,429],[381,449],[337,457],[293,454],[248,442],[216,418],[194,386],[185,343],[189,297],[206,250],[235,211],[276,185]],[320,325],.61,.61,'#f3c93a');
  const shapes=[[[292,170],[294,124],[302,86],[320,62],[335,83],[345,120],[346,169]],[[291,174],[262,143],[245,114],[239,95],[256,92],[283,106],[307,133],[315,175]],[[327,176],[345,135],[373,107],[395,96],[398,105],[385,135],[363,164],[346,180]],[[280,180],[250,165],[232,151],[232,142],[249,137],[276,142],[306,163],[315,181]],[[327,180],[356,152],[381,141],[405,142],[407,152],[387,166],[362,180]],[[294,180],[296,155],[305,133],[320,123],[334,136],[343,158],[346,180]]];
  shapes.forEach((outline,i)=>volume('PineappleLeafSolid'+i,outline,i===0?[320,122]:i===1?[278,136]:i===2?[363,138]:i===3?[273,158]:i===4?[368,160]:[320,157],.085,.085,'#6b9635',i<3?-.04:i<5?.07:.19));
  for(const direction of [-1,1])for(let n=-5;n<=5;n++){
   const ps=[];for(let i=0;i<=55;i++){const y=186+i*4.8,x=320+n*69+direction*(y-310)*1.12;if(rayAt(body,x,y))ps.push([x,y]);else if(ps.length>1)break;}rearLine('PineappleRearDiamond'+direction+'_'+n,body,ps,'#d7a52a',.012);
  }
 }
 if(id==='fruit-strawberry'){
  const body=volume('StrawberryFruitSolid',[[320,128],[377,130],[430,151],[468,188],[489,232],[495,279],[484,326],[462,368],[433,408],[397,442],[357,468],[320,477],[283,467],[243,441],[209,405],[179,363],[156,317],[145,269],[151,224],[174,184],[211,152],[261,131]],[320,281],.73,.73,'#df4249');
  const calyx=volume('StrawberryCalyxSolid',[[309,116],[304,94],[311,68],[318,62],[331,66],[332,82],[329,114],[360,108],[392,114],[419,129],[434,140],[409,148],[377,149],[391,167],[397,187],[375,190],[347,178],[320,156],[299,177],[274,189],[247,187],[255,163],[267,146],[237,151],[207,139],[222,124],[252,113],[282,111]],[320,139],.06,.045,'#719f38');drape(calyx,body);
  const rear=rearCalyx(calyx,'StrawberryRearCalyxSolid','#719f38');for(const [n,ps] of [[[320,130],[280,130],[226,138]],[[320,130],[363,130],[414,139]],[[320,137],[292,159],[262,178]],[[320,137],[351,159],[381,178]]].entries())rearLine('StrawberryRearLeafVein'+n,rear,ps,'#5a852d',.007);
  for(let row=0;row<6;row++)for(let col=0;col<7;col++){const x=183+col*44+(row%2)*21,y=195+row*45;if(((x-320)/145)**2+((y-280)/180)**2<.80)backSeed('StrawberryRearSeed'+row+'_'+col,body,x,y,4.7,7.4,'#ffc5a3');}
  const torso=parts.get('Torso');torso.group.clear();torso.group.userData.directSurfaceArtwork=true;const t=sculpt(T,k,torso);
  volume('StrawberrySuitSolid',[[271,445],[369,445],[383,480],[380,512],[365,535],[340,547],[300,547],[277,533],[260,509],[258,480]],[320,491],.28,.28,'#dd787b',0,t);t.paint();
  for(const side of [-1,1]){const arm=parts.get(side<0?'LeftArm':'RightArm');arm.group.clear();arm.part.pivot=[320+side*66,453];arm.group.position.set(side*.33,(580-453)*.005,0);arm.group.userData.directSurfaceArtwork=true;const a=sculpt(T,k,arm),outline=[[249,438],[264,449],[258,470],[250,494],[246,507],[235,510],[222,504],[221,492],[228,469],[239,447]].map(([x,y])=>[side<0?x:640-x,y]);volume('StrawberrySleeveSolid'+side,outline,[320+side*79,476],.125,.125,'#e28385',0,a);a.paint();}
  for(const side of [-1,1]){const leg=parts.get(side<0?'LeftLeg':'RightLeg');leg.group.clear();leg.group.userData.directSurfaceArtwork=true;const l=sculpt(T,k,leg),outline=[[272,521],[307,525],[313,541],[306,562],[291,574],[274,577],[263,570],[262,559],[270,545]].map(([x,y])=>[side<0?x:640-x,y]);volume('StrawberryFootSolid'+side,outline,[320+side*31,548],.17,.17,'#d97578',0,l);l.paint();}
 }
 if(id==='fruit-watermelon'){
  // A slice has two flat cut faces and a curved rind, not a rounded balloon.
  const outline=[[320,62],[332,70],[514,348],[483,380],[439,403],[391,420],[343,432],[296,431],[248,420],[201,401],[157,377],[126,351],[304,76]];
  const fruit=s.smoothOutline('WatermelonSliceSolid',outline,.52,'#ef5756',0,.028);fruit.userData.artworkFacingFade=[.12,.40];
  const rind=[[123,344],[153,367],[196,391],[244,410],[294,422],[342,424],[390,413],[437,398],[478,378],[513,345],[524,361],[515,380],[480,403],[438,424],[390,440],[343,451],[296,451],[246,442],[201,428],[159,406],[128,384],[117,365]];
  plain(s.smoothOutline('WatermelonRindSolid',rind,.532,'#568b38',0,.018));
  // Pale pith traces the top of the rind on the rear cut surface.
  rearLine('WatermelonRearPith',fruit,[[128,348],[162,374],[205,397],[249,413],[296,425],[341,427],[389,416],[434,401],[477,380],[513,350]],'#ebdf86',.027);
  for(const [i,[x,y]] of [[320,121],[289,160],[352,158],[260,203],[322,199],[384,200],[225,262],[285,263],[352,262],[418,265],[181,331],[252,341],[320,343],[388,340],[464,332]].entries())backSeed('WatermelonRearSeed'+i,fruit,x,y,7,11,'#7d3026');
  // Rind owns the same source front so its green and pale bands remain intact.
  s.parent.getObjectByName('WatermelonRindSolid').userData.skipOriginalPaint=false;
 }
 s.paint();head.authoredFamily='source-shaped-fruit';return true;
};
