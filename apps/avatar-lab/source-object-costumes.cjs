"use strict";

module.exports=function sourceObjects(T,k,id,parts){
 if(!['object-camera','object-eraser','object-key','object-lock','object-boot','object-gift','object-lamp','object-newspaper','object-pencil','object-radio','object-television','object-watch','object-mitten','object-sack'].includes(id))return false;
 const head=parts.get('Head'),sculpt=require('./sculpt-kit.cjs'),s=sculpt(T,k,head);
 s.parent.clear();s.parent.userData.directSurfaceArtwork=true;s.parent.userData.artworkOcclusion=true;
 const faces={'object-camera':[320,315,91,86],'object-eraser':[320,321,111,96],'object-key':[320,318,110,97],'object-lock':[320,326,111,91],'object-boot':[397,309,101,87],'object-gift':[319,325,108,92],'object-lamp':[320,334,105,84],'object-newspaper':[320,287,114,94],'object-pencil':[319,332,102,84],'object-radio':[312,328,86,74],'object-television':[314,306,109,88],'object-watch':[306,324,88,76]};
 faces['object-mitten']=[350,306,100,83];faces['object-sack']=[320,314,107,89];
 const [cx,cy,rx,ry]=faces[id];s.parent.userData.artworkOpaqueRegions=[{cx,cy,rx,ry}];
 const plain=o=>{o.userData.skipOriginalPaint=true;return o;};
 function volume(name,outline,center,front,back,color,z=0,tool=s){
  k.volume(name+'Half',outline,center,tool.pivot,front,back,tool.parent,k.solid(name+'Color',color),{art:false,samples:80,z:z-tool.offset.z});
  const P=[],I=[];for(const suffix of ['Surface','Back']){const o=tool.parent.getObjectByName(name+'Half'+suffix),offset=P.length/3;P.push(...o.geometry.attributes.position.array);I.push(...Array.from(o.geometry.index.array,v=>v+offset));tool.parent.remove(o);}
  const o=k.mesh(name,k.geometry(P,I),k.solid(name+'Color',color),tool.parent);o.userData.artworkFacingFade=[.16,.48];return o;
 }
 function rect(name,x,y,w,h,depth,color,z=0,r=[18,18,18,18],tool=s){
  const ps=[];for(const [i,[a,b,start]] of [[x-w/2+r[0],y-h/2+r[0],Math.PI],[x+w/2-r[1],y-h/2+r[1],-Math.PI/2],[x+w/2-r[2],y+h/2-r[2],0],[x-w/2+r[3],y+h/2-r[3],Math.PI/2]].entries())for(let j=0;j<=8;j++){const t=start+j/8*Math.PI/2;ps.push([a+Math.cos(t)*r[i],b+Math.sin(t)*r[i]]);}
  return tool.outline(name,ps,depth,color,z,.009);
 }
 function part(name,pivot){let p=parts.get(name);if(!p){p={part:{pivot},group:k.group(name,pivot)};parts.set(name,p);}p.group.clear();p.part.pivot=pivot;p.group.position.set((pivot[0]-320)*.005,(580-pivot[1])*.005,0);p.group.userData.directSurfaceArtwork=true;return sculpt(T,k,p);}
 function cylinder(name,x,y,z,r,depth,color){const o=s.mesh(name,new T.CylinderGeometry(r*.005,r*.005,depth,80),color,[x,y,z]);o.rotation.x=Math.PI/2;return o;}
 function fineThread(name,ps,r,color){
  const curve=new T.CatmullRomCurve3(ps.map(p=>new T.Vector3(...s.point(p)))),geo=new T.TubeGeometry(curve,Math.max(6,ps.length),r,6,false);plain(k.mesh(name,geo,k.solid(name+'Color',color),s.parent));
  for(const [i,p] of [ps[0],ps.at(-1)].entries())plain(s.mesh(name+'End'+i,new T.SphereGeometry(r,8,6),color,p));
 }
 function shoeLoft(name,sections,color){
  const upperCurve=new T.CatmullRomCurve3(sections.map(([x,top,bottom,width])=>new T.Vector3(x,top,bottom))),widthCurve=new T.CatmullRomCurve3(sections.map(([x,top,bottom,width])=>new T.Vector3(x,width,0))),P=[],I=[],nx=112,nr=48;
  for(let j=0;j<=nx;j++){const p=upperCurve.getPoint(j/nx),w=Math.max(0,widthCurve.getPoint(j/nx).y),cy=(p.y+p.z)/2,hy=Math.max(0,(p.z-p.y)/2);for(let i=0;i<nr;i++){const a=i/nr*Math.PI*2,c=Math.cos(a),v=Math.sin(a);P.push(...s.point([p.x,cy+hy*Math.sign(c)*Math.abs(c)**.60,w*Math.sign(v)*Math.abs(v)**.60]));}}
  for(let j=0;j<nx;j++)for(let i=0;i<nr;i++){const a=j*nr+i,b=a+nr,c=(j+1)*nr+(i+1)%nr,d=j*nr+(i+1)%nr;I.push(a,b,c,a,c,d);}
  return k.mesh(name,k.geometry(P,I),k.solid(name+'Color',color),s.parent);
 }
 function suit(prefix,color,torsoOutline,torsoCenter,armOutline,armPivot,feet,centerX=320){
  const t=part('Torso',torsoCenter);volume(prefix+'TorsoSolid',torsoOutline,torsoCenter,.28,.28,color,0,t);t.paint();
  for(const side of [-1,1]){
   const mirror=ps=>ps.map(([x,y])=>[side<0?x:2*centerX-x,y]);
   const a=part(side<0?'LeftArm':'RightArm',[centerX+side*(centerX-armPivot[0]),armPivot[1]]);
   volume(prefix+'SleeveSolid'+side,mirror(armOutline),[centerX+side*(centerX-armPivot[0]-5),armPivot[1]+27],.135,.135,color,0,a);a.paint();
   const l=part(side<0?'LeftLeg':'RightLeg',[centerX+side*34,feet.pivotY]);volume(prefix+'FootSolid'+side,mirror(feet.outline),[centerX+side*35,feet.cy],.17,.17,color,0,l);l.paint();
  }
 }
 if(id==='object-camera'){
  const body=rect('CameraCaseSolid',319,307,416,275,.70,'#474448',0,[39,39,37,37]);body.userData.artworkExcludedRegions=[{cx:320,cy:314,rx:125,ry:125}];
  s.outline('CameraTopBandSolid',[[150,168],[489,168],[513,180],[528,207],[528,239],[110,239],[110,210],[120,184]],.724,'#c8c0c2',0,.012);
  s.outline('CameraBottomBandSolid',[[110,396],[528,396],[528,413],[519,432],[497,445],[144,445],[122,434],[111,414]],.724,'#b6adb2',0,.012);
  const barrel=cylinder('CameraLensBarrelSolid',320,314,.43,121,.21,'#5d5155');barrel.userData.artworkExcludedRegions=[{cx:320,cy:314,rx:92,ry:92}];
  const ring=s.torus('CameraLensRim',[320,314,.54],.553,.04,'#b5a7a9');ring.userData.artworkExcludedRegions=[{cx:320,cy:314,rx:92,ry:92}];
  cylinder('CameraFaceGlassSolid',320,314,.56,92,.035,'#efd0ac');
  rect('CameraShutterSolid',178,155,68,30,.26,'#5a565c',-.05,[17,17,5,5]);
  s.outline('CameraPrismSolid',[[230,169],[251,128],[269,110],[369,110],[384,119],[407,169]],.34,'#52494d',-.02,.015);
  rect('CameraFlashStemSolid',458,154,55,30,.18,'#716369',-.04,[3,3,3,3]);
  rect('CameraFlashSolid',457,105,108,83,.27,'#65595d',-.02,[14,14,14,14]);
  plain(rect('CameraRearDisplaySolid',295,308,225,141,.035,'#282a30',-.373,[12,12,12,12]));
  plain(rect('CameraRearDisplayGlassSolid',295,308,199,115,.013,'#526875',-.398,[7,7,7,7]));
  for(let i=0;i<3;i++)plain(cylinder('CameraRearButton'+i,459,270+i*37,-.371,9,.035,'#a99da2'));
  suit('Camera','#756a6c',[[268,438],[372,438],[386,478],[381,516],[361,545],[325,553],[286,544],[258,518],[251,483]],[320,491],[[235,439],[257,446],[247,468],[243,497],[246,510],[238,519],[225,514],[215,499],[218,470]],[243,451],{pivotY:536,cy:554,outline:[[270,523],[307,526],[315,544],[306,565],[307,573],[293,581],[276,578],[264,566],[269,549]]});
 }
 if(id==='object-eraser'){
  rect('EraserWhiteSolid',318,252,275,382,.65,'#f4f3f7',0,[70,70,48,48]);
  rect('EraserSleeveSolid',318,321,282,252,.71,'#258fd0',0,[5,5,47,47]);
  plain(rect('EraserRearLabelSolid',318,307,165,58,.012,'#e7eff4',-.367,[7,7,7,7]));
  for(let i=0;i<3;i++)plain(rect('EraserRearLabelLine'+i,318,297+i*10,112-i*18,2,.004,'#99b6c7',-.376,[.5,.5,.5,.5]));
  // Preserve the deliberately tiny suit without the old traced side ripples.
  suit('Eraser','#f1eff3',[[272,441],[366,441],[370,466],[364,487],[346,500],[319,506],[290,498],[274,485],[264,464]],[320,470],[[255,447],[270,449],[269,462],[263,474],[258,486],[249,487],[242,481],[243,464]],[260,450],{pivotY:497,cy:509,outline:[[279,493],[310,494],[311,505],[307,517],[290,524],[276,520],[270,512],[275,504]]});
 }
 if(id==='object-lock'){
  rect('LockCaseSolid',318,323,296,246,.76,'#f7b529',0,[47,47,42,42]);
  s.sweep('LockShackleSolid',[[240,214,0,18],[240,161,0,18],[251,120,0,18],[276,93,0,18],[317,81,0,18],[356,92,0,18],[382,118,0,18],[397,160,0,18],[397,214,0,18]],'#b7b6b7');
  plain(cylinder('LockRearKeyholeRound',318,312,-.391,15,.016,'#76511f'));
  plain(s.outline('LockRearKeyholeStemSolid',[[312,316],[324,316],[331,343],[305,343]],.016,'#76511f',-.391,.002));
  suit('Lock','#edab27',[[269,435],[371,435],[382,473],[379,509],[359,535],[320,547],[282,535],[258,508],[256,475]],[320,488],[[245,438],[267,447],[256,465],[251,486],[251,503],[240,513],[229,510],[222,501],[226,480],[236,453]],[248,449],{pivotY:534,cy:553,outline:[[271,521],[309,523],[314,543],[306,558],[307,569],[295,578],[273,577],[261,569],[262,559],[271,545]]});
 }
 if(id==='object-key'){
  volume('KeyMedallionSolid',[[320,197],[370,206],[410,234],[439,276],[452,319],[446,363],[423,399],[385,423],[346,434],[296,434],[253,421],[214,394],[187,353],[179,309],[189,264],[215,227],[265,203]],[320,317],.22,.20,'#eeb755');
  rect('KeyShaftSolid',319,494,63,176,.31,'#e8ad47',0,[8,8,27,27]);
  rect('KeyToothUpperSolid',365,524,51,33,.29,'#e8ad47',0,[9,11,10,8]);
  rect('KeyToothLowerSolid',363,556,46,27,.29,'#e8ad47',0,[6,8,9,5]);
  const shape=new T.Shape(),bowCurve=new T.CatmullRomCurve3([[320,70],[286,63],[255,69],[230,85],[215,109],[210,137],[218,168],[237,190],[265,204],[320,211],[375,204],[403,188],[420,164],[427,136],[420,108],[405,85],[381,69],[349,63]].map(([x,y])=>new T.Vector3((x-319)*.005,(137-y)*.005,0)),true,'centripetal');bowCurve.getSpacedPoints(96).forEach((p,i)=>i?shape.lineTo(p.x,p.y):shape.moveTo(p.x,p.y));shape.closePath();
  const hole=new T.Path();hole.moveTo(0,.06);hole.bezierCurveTo(-.13,.20,-.30,.18,-.30,-.02);hole.bezierCurveTo(-.30,-.22,-.13,-.20,0,-.10);hole.bezierCurveTo(.13,-.20,.30,-.22,.30,-.02);hole.bezierCurveTo(.30,.18,.13,.20,0,.06);hole.closePath();shape.holes.push(hole);
  const geo=new T.ExtrudeGeometry(shape,{depth:.24,bevelEnabled:true,bevelThickness:.035,bevelSize:.018,bevelSegments:4,curveSegments:32,steps:1});geo.translate(0,0,-.12);s.mesh('KeyBowSolid',geo,'#eab252',[319,137,0]);
  for(const side of [-1,1])volume('KeyHandSolid'+side,[[274,428],[289,435],[283,459],[280,481],[268,493],[255,493],[247,482],[252,463],[264,439]].map(([x,y])=>[side<0?x:640-x,y]),[320+side*49,464],.11,.11,'#f4c298');
  const shaft=s.parent.getObjectByName('KeyShaftSolid');plain(s.tube('KeyRearGroove',[[319,435,-.163],[319,476,-.163],[319,523,-.163],[319,565,-.163]],.008,'#bd852f'));
 }
 if(id==='object-boot'){
  const upper=shoeLoft('SneakerUpperSolid',[[78,395,395,0],[82,365,404,.10],[100,315,418,.30],[150,277,435,.42],[200,250,442,.46],[250,192,439,.45],[280,137,435,.43],[300,85,430,.41],[320,64,423,.41],[350,66,416,.42],[380,81,407,.43],[405,108,402,.43],[450,104,390,.42],[490,107,383,.40],[520,115,378,.34],[545,139,372,.25],[558,175,370,.16],[562,250,368,.08],[564,360,360,0]],'#df1731');
  shoeLoft('SneakerSoleSolid',[[75,411,411,0],[80,399,429,.10],[100,412,451,.29],[140,430,468,.43],[180,439,475,.48],[220,441,476,.49],[260,440,473,.50],[300,431,467,.50],[340,426,458,.48],[380,414,443,.46],[400,408,435,.45],[420,403,433,.44],[440,400,439,.44],[480,389,436,.42],[520,379,428,.36],[550,373,413,.25],[564,382,403,.09],[567,393,393,0]],'#efdcde');
  // Rubber toe and red upper share one watertight surface. Two intersecting
  // domes produced torn-looking triangles where their front depths crossed.
  const up=upper.geometry.attributes.position,un=upper.geometry.attributes.normal,ui=upper.geometry.index.array,P=[],N=[],C=[];
  const boundary=p=>{const x=s.pivot[0]+p[0]/.005,y=s.pivot[1]-p[1]/.005;return y<270?1:x-(178+90*Math.sin(Math.max(0,Math.min(1,(y-270)/166))*Math.PI/2));};
  for(let i=0;i<ui.length;i+=3){const original=[0,1,2].map(j=>({p:[up.getX(ui[i+j]),up.getY(ui[i+j]),up.getZ(ui[i+j])],n:[un.getX(ui[i+j]),un.getY(ui[i+j]),un.getZ(ui[i+j])]}));for(const side of [-1,1]){const poly=[];for(let j=0;j<3;j++){const a=original[j],b=original[(j+1)%3],fa=boundary(a.p)*side,fb=boundary(b.p)*side;if(fa>=0)poly.push(a);if((fa>=0)!==(fb>=0)){const t=fa/(fa-fb);poly.push({p:a.p.map((v,n)=>v+(b.p[n]-v)*t),n:a.n.map((v,n)=>v+(b.n[n]-v)*t)});}}const c=new T.Color(side<0?'#f0e4e4':'#df1731').convertSRGBToLinear();for(let j=1;j+1<poly.length;j++)for(const v of [poly[0],poly[j],poly[j+1]]){P.push(...v.p);N.push(...new T.Vector3(...v.n).normalize().toArray());C.push(c.r,c.g,c.b);}}}
  const welded=new Map(),wp=[],wn=[],wc=[],wi=[];for(let i=0;i<P.length;i+=3){const key=[...P.slice(i,i+3),...C.slice(i,i+3)].map(v=>Math.round(v*1e7)).join(',');let j=welded.get(key);if(j===undefined){j=wp.length/3;welded.set(key,j);wp.push(...P.slice(i,i+3));wn.push(...N.slice(i,i+3));wc.push(...C.slice(i,i+3));}wi.push(j);}
  const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(wp,3));geo.setAttribute('normal',new T.Float32BufferAttribute(wn,3));geo.setAttribute('color',new T.Float32BufferAttribute(wc,3));geo.setIndex(wi);upper.geometry=geo;upper.material.color.set(0xffffff);upper.material.userData.preserveVertexColor=true;
  const opening=plain(s.ellipsoid('SneakerCollarCavitySolid',[464,132,0],[73,25,.31],'#801323'));opening.rotation.x=.40;
  const collar=s.torus('SneakerCollarRim',[464,129,0],.32,.032,'#ed2941',[1.18,1,.80]);collar.rotation.x=Math.PI/2-.39;
  const laceShapes=[[[288,134],[310,138],[339,148],[367,161],[378,174],[375,185],[363,189],[343,179],[316,168],[290,161],[279,153],[281,141]],[[257,188],[281,193],[306,203],[333,218],[345,231],[341,242],[330,247],[310,234],[284,222],[261,216],[248,208],[249,198]],[[226,236],[246,241],[263,247],[289,264],[300,279],[295,290],[281,293],[261,277],[237,263],[216,255],[218,250],[219,242]]];
  upper.updateWorldMatrix(true,false);const ray=new T.Raycaster();
  laceShapes.forEach((outline,i)=>{const center=[outline.reduce((a,p)=>a+p[0],0)/outline.length,outline.reduce((a,p)=>a+p[1],0)/outline.length],lace=volume('SneakerLaceSolid'+i,outline,center,.028,.022,'#f3e6e8'),p=lace.geometry.attributes.position;
   for(let j=0;j<p.count;j++){const x=s.pivot[0]+p.getX(j)/.005,y=s.pivot[1]-p.getY(j)/.005;ray.set(new T.Vector3((x-320)*.005,(580-y)*.005,3),new T.Vector3(0,0,-1));const hit=ray.intersectObject(upper)[0];if(hit)p.setZ(j,p.getZ(j)+hit.point.z-s.offset.z+.008);}lace.geometry.computeVertexNormals();
  });
  // The side facing away has seams and laces but no duplicate human face.
  for(const [i,ps] of [[[122,403],[181,420],[246,425],[322,415],[404,395],[493,375]],[[282,178],[314,185],[350,199]]].entries()){
   const curve=new T.CatmullRomCurve3(ps.map(([x,y])=>new T.Vector3(x,y,0))),points=[];for(const p of curve.getPoints(40)){ray.set(new T.Vector3((p.x-320)*.005,(580-p.y)*.005,-3),new T.Vector3(0,0,1));const hit=ray.intersectObject(upper)[0];if(hit)points.push([p.x,p.y,hit.point.z-.005]);}if(points.length>1)plain(s.tube('SneakerRearSeam'+i,points,.009,'#ad2032'));
  }
  suit('Sneaker','#e31a35',[[303,462],[336,451],[374,439],[401,432],[416,474],[420,508],[407,533],[382,548],[346,549],[319,537],[300,515],[291,490]],[359,491],[[265,477],[286,474],[291,488],[284,503],[273,509],[263,503],[259,493]],[278,480],{pivotY:536,cy:555,outline:[[314,521],[350,524],[354,546],[345,562],[347,573],[335,580],[312,578],[298,571],[299,560],[310,544]]},359);
  const right=part('RightArm',[428,452]);volume('SneakerSleeveSolid1',[[418,438],[435,445],[446,467],[455,488],[454,502],[442,510],[430,503],[426,484],[419,462]],[437,478],.135,.135,'#e31a35',0,right);right.paint();
  for(const [name,ps] of [['LeftArm',[[305,473,-.05,12],[295,477,-.05,12],[284,482,-.05,12]]],['RightArm',[[400,448,-.05,14],[414,451,-.05,14],[428,456,-.05,14]]]]){const a=sculpt(T,k,parts.get(name));a.sweep('SneakerShoulderJoin'+name,ps,'#d91b32');a.paint();}
 }
 if(id==='object-gift'){
  rect('GiftCaseSolid',319,347,322,214,1.16,'#f6bd20',0,[8,8,29,29]);
  rect('GiftLidSolid',319,205,343,85,1.22,'#fbc529',0,[23,23,14,14]);
  // The ribbon is inset into the wrapping, not a red box crossing both sides.
  plain(rect('GiftRibbonBandSolid',319,350,82,202,.018,'#e61c36',-.590,[2,2,2,2]));
  for(const z of [-.621,.621]){const o=rect('GiftLidRibbonSolid'+z,319,205,84,81,.018,'#e61c36',z,[5,5,2,2]);if(z<0)plain(o);}
  plain(s.box('GiftRibbonTopSolid',[319,163,0],[83,5,1.24],'#e61c36',1));
  for(const side of [-1,1]){
   const mirror=ps=>ps.map(([x,y])=>[side<0?x:640-x,y]);
   volume('GiftBowLoopSolid'+side,mirror([[303,153],[283,117],[258,83],[237,68],[217,69],[198,84],[186,108],[183,129],[193,147],[216,159],[256,162]]),[320+side*77,120],.24,.22,'#df1731',-.03);
   // A rear folded cavity carries the loop shape through the reverse view.
   plain(volume('GiftBowRearFoldSolid'+side,mirror([[298,153],[275,136],[250,116],[223,107],[204,111],[198,124],[211,142],[241,154],[274,157]]),[320+side*72,135],.02,.02,'#9f0e22',-.225));
  }
  volume('GiftKnotSolid',[[299,138],[319,134],[337,139],[344,163],[294,163]],[320,150],.19,.19,'#f39a13',.01);
  suit('Gift','#69a72b',[[268,445],[370,445],[383,475],[382,507],[358,535],[321,542],[284,534],[257,510],[254,480]],[320,491],[[245,452],[263,457],[252,482],[246,503],[236,513],[223,508],[218,497],[222,480],[235,460]],[247,458],{pivotY:527,cy:546,outline:[[273,520],[308,522],[312,539],[303,549],[304,556],[289,563],[274,560],[265,552],[269,537]]});
 }
 if(id==='object-newspaper'){
  const paper=[[165,64],[432,64],[448,90],[473,115],[500,133],[507,147],[507,410],[499,429],[481,440],[159,441],[142,431],[132,413],[132,94],[142,75]];
  s.smoothOutline('NewspaperSheetSolid',paper,.16,'#eee4de',0,.012);
  s.smoothOutline('NewspaperFoldSolid',[[433,73],[443,94],[464,115],[499,137],[461,142],[443,138],[433,128],[431,111]],.026,'#d8c3b6',.099,.005);
  for(let col=0;col<3;col++)for(let line=0;line<18;line++){const o=plain(s.mesh('NewspaperRearLine'+col+'_'+line,new T.PlaneGeometry((82-(line%4)*7)*.005,.01),'#9a8a82',[195+col*119,129+line*16,-.092]));o.rotation.y=Math.PI;}
  plain(rect('NewspaperRearPhotoSolid',319,263,100,90,.009,'#b8aaa3',-.097,[6,6,6,6]));
  plain(rect('NewspaperRearHeadlineSolid',295,93,255,12,.005,'#765c56',-.092,[1,1,1,1]));
  suit('Newspaper','#c9c3c7',[[260,436],[380,436],[392,472],[390,510],[365,543],[321,551],[279,540],[250,512],[246,476]],[320,494],[[232,441],[258,447],[245,473],[241,491],[232,505],[220,508],[209,497],[211,480],[223,453]],[241,447],{pivotY:537,cy:558,outline:[[274,527],[312,531],[312,550],[304,562],[304,573],[286,579],[269,575],[262,563],[270,544]]});
 }
 if(id==='object-lamp'){
  // Tilted circular rings preserve the source elliptical hem and top opening.
  const P=[],I=[],n=96,rings=[[78,103,.49,16],[326,195,.89,30],[326,188,.855,29],[78,97,.46,15]];
  function shadePoint(ring,a){let [y,r,d,tilt]=ring;const bottom=y>200,inner=r===188;if(bottom&&Math.cos(a)>0){for(let j=0;j<12;j++){const x=Math.sin(a)*r,u=x/110;if(Math.abs(u)<1){y=Math.min(326,333-88*Math.sqrt(1-u*u)-Math.cos(a)*tilt);const t=(y-78)/248;r=103+92*t-(inner?7:0);d=.49+.40*t-(inner?.035:0);}else break;}}return[320+Math.sin(a)*r,y+Math.cos(a)*tilt,Math.cos(a)*d];}
  for(const ring of rings)for(let i=0;i<n;i++){P.push(...s.point(shadePoint(ring,i/n*Math.PI*2)));}
  for(let j=0;j<4;j++)for(let i=0;i<n;i++){const a=j*n+i,b=j*n+(i+1)%n,c=((j+1)%4)*n+i,d=((j+1)%4)*n+(i+1)%n;I.push(a,d,b,a,c,d);}
  const shade=k.mesh('LampShadeSolid',k.geometry(P,I),k.solid('LampShadeColor','#ffd16b'),s.parent);shade.userData.artworkExcludedRegions=[{cx:320,cy:334,rx:108,ry:90}];
  for(const [name,ring] of [['LampTopRim',rings[0]],['LampBottomRim',rings[1]]]){const ps=[];for(let i=0;i<=96;i++)ps.push(shadePoint(ring,i/96*Math.PI*2));plain(s.tube(name,ps,.012,'#9e602b'));}
  for(const a of [-2.65,2.65]){const ps=[];for(let j=0;j<=24;j++){const t=j/24,r=103+92*t,d=.49+.40*t,y=78+248*t,tilt=16+14*t;ps.push([320+Math.sin(a)*r,y+Math.cos(a)*tilt,Math.cos(a)*(d+.004)]);}plain(s.tube('LampPanelSeam'+a,ps,.008,'#ba7a36'));}
  volume('LampFaceSolid',k.ellipse(320,333,106,86),[320,333],.55,.45,'#69432d',.08);
  volume('LampCollarSolid',[[269,409],[370,409],[386,437],[361,448],[317,451],[277,447],[253,437]],[320,432],.32,.30,'#927055',0);
  plain(s.sweep('LampInternalSupportSolid',[[320,267,0,8],[320,170,0,7],[320,78,0,7]],'#9e602b'));
  plain(s.sweep('LampInternalCrossbarSolid',[[220,78,0,5],[320,78,0,5],[420,78,0,5]],'#9e602b'));
  plain(s.sweep('LampPullCordSolid',[[438,344,.35,3],[438,371,.35,3],[438,391,.35,3]],'#85502e'));plain(s.ellipsoid('LampPullTip',[438,394,.35],[7,12,.04],'#a4693d'));
  suit('Lamp','#a96c4c',[[269,440],[373,440],[386,478],[383,518],[360,545],[320,550],[282,543],[253,519],[248,479]],[320,493],[[251,446],[268,453],[253,476],[248,499],[240,511],[228,506],[224,494],[229,473],[240,455]],[252,451],{pivotY:537,cy:560,outline:[[273,527],[311,529],[315,547],[307,561],[308,574],[292,581],[275,578],[263,569],[266,554]]});
  for(const side of [-1,1]){const a=sculpt(T,k,parts.get(side<0?'LeftArm':'RightArm'));a.sweep('LampShoulderJoin'+side,[[320+side*53,453,0,14],[320+side*62,459,0,14],[320+side*70,470,0,13]],'#a96c4c');a.paint();}
 }
 if(id==='object-radio'||id==='object-television'){
  const tv=id==='object-television',prefix=tv?'TV':'Radio',x=tv?320:312,y=tv?290:297,w=tv?384:456,h=tv?287:266,depth=tv?.96:.84;
  const body=rect(prefix+'CaseSolid',x,y,w,h,depth,tv?'#65556f':'#f1a526',0,tv?[48,44,33,34]:[45,45,38,38]);
  plain(rect(prefix+'RearCoverSolid',x,y,w-48,h-45,tv?.28:.035,tv?'#514456':'#be751e',tv?-.52:-.438,[30,30,25,25]));
  const rearZ=tv?-.667:-.463;
  for(let i=0;i<10;i++){const o=plain(s.mesh(prefix+'RearVent'+i,new T.PlaneGeometry(.014,.36),'#322b2c',[x+(i-4.5)*12,y-9,rearZ]));o.rotation.y=Math.PI;}
  for(const dx of [-1,1])for(const dy of [-1,1])plain(cylinder(prefix+'RearScrew'+dx+dy,x+dx*(w/2-41),y+dy*(h/2-40),rearZ,3,.008,'#71615b'));
  if(tv){
   rect('TVScreenSolid',298,291,286,225,.035,'#80bdad',.492,[45,44,28,28]);
   for(const py of [225,289])cylinder('TVKnobSolid'+py,474,py,.50,18,.055,'#bbaeb6');
   volume('TVAntennaBaseSolid',[[273,146],[279,133],[294,125],[316,122],[339,128],[354,141],[355,151]],[316,140],.18,.18,'#6b586e',-.01);
   for(const side of [-1,1])volume('TVAntennaSolid'+side,[[276,143],[258,119],[237,86],[232,72],[235,64],[242,63],[255,72],[278,101],[299,127]].map(([px,py])=>[side<0?px:630-px,py]),[315+side*49,104],.07,.07,'#514252',-.02);
   suit('TV','#8f8493',[[269,427],[371,427],[386,456],[388,486],[371,514],[345,524],[297,524],[271,512],[254,487],[254,456]],[320,477],[[246,435],[268,440],[256,464],[251,487],[242,499],[230,496],[221,485],[224,465],[237,444]],[250,441],{pivotY:514,cy:530,outline:[[274,506],[310,509],[312,524],[306,534],[303,542],[286,545],[269,540],[262,532],[268,521]]});
  }else{
   for(const sx of [157,465]){const speaker=cylinder('RadioSpeakerSolid'+sx,sx,338,.426,58,.028,'#3b3b3c');speaker.scale.z=1.025;}
   rect('RadioTunerSolid',310,222,389,48,.025,'#57565b',.429,[15,15,15,15]);
   rect('RadioTopButtonSolid',458,159,54,20,.28,'#dc5a16',-.03,[10,10,2,2]);
   rect('RadioSideKnobSolid',548,247,20,75,.38,'#6e6566',0,[9,9,9,9]);
   volume('RadioAntennaBaseSolid',[[154,166],[166,154],[188,145],[199,144],[209,151],[214,165]],[188,158],.14,.14,'#a7682a',-.02);
   s.sweep('RadioAntennaSolid',[[202,148,-.02,9],[279,117,-.02,8],[350,89,-.02,7],[422,63,-.02,6]],'#b5b4bb');
   suit('Radio','#eda025',[[259,425],[365,425],[382,452],[381,484],[360,513],[331,522],[292,519],[267,505],[247,483],[246,454]],[312,475],[[233,432],[254,437],[241,461],[236,483],[228,498],[214,497],[204,487],[206,469],[220,442]],[239,438],{pivotY:513,cy:533,outline:[[266,505],[303,509],[306,525],[297,536],[297,546],[282,552],[262,550],[250,542],[252,531],[263,519]]},312);
  }
 }
 if(id==='object-watch'){
  s.smoothOutline('WatchUpperStrapSolid',[[306,63],[345,64],[365,72],[376,99],[384,148],[386,200],[380,213],[235,213],[228,196],[232,143],[240,100],[252,75],[270,66]],.24,'#8d4936',-.14,.015);
  s.smoothOutline('WatchLowerStrapSolid',[[237,440],[373,440],[383,450],[381,508],[373,551],[362,573],[340,581],[277,581],[253,573],[239,552],[232,511],[228,461]],.24,'#8d4936',-.14,.015);
  for(const side of [-1,1])for(const end of [-1,1])volume('WatchLugSolid'+side+'_'+end,[[230,136],[215,139],[202,151],[193,174],[188,210],[191,221],[230,221]].map(([x,y])=>[side<0?x:612-x,end<0?y:650-y]),[306+side*96,end<0?181:469],.15,.15,'#e6a351',-.035);
  cylinder('WatchCaseSolid',306,325,.12,164,.31,'#e7a354').scale.z=.98;
  cylinder('WatchGlassSolid',306,325,.285,137,.028,'#f5f1f1').scale.z=.985;
  const bezel=s.torus('WatchBezel',[306,325,.279],.816,.017,'#b7733e',[1,.98,1]);
  plain(cylinder('WatchRearCoverSolid',306,325,-.048,139,.035,'#b99b82'));
  for(let i=0;i<4;i++){const a=(i+.5)/4*Math.PI*2;plain(cylinder('WatchRearScrew'+i,306+Math.cos(a)*117,325+Math.sin(a)*117,-.071,4,.01,'#72655a'));}
  volume('WatchCrownSolid',[[465,296],[481,294],[491,300],[498,312],[499,334],[492,346],[478,351],[464,347]],[481,323],.16,.16,'#e5a14d',.06);
  for(const side of [-1,1]){const o=plain(s.mesh('WatchStrapStitch'+side,new T.PlaneGeometry(.008,.38),'#b5775a',[306+side*55,119,-.268]));o.rotation.y=Math.PI;}
 }
 if(id==='object-pencil'){
  // These solids meet at shared rings. A coarse depth raster at those rings
  // falsely rejected front artwork and left mottled eraser/graphite patches.
  s.parent.userData.artworkOcclusion=false;
  const cross=[[-116,0],[-50,.40],[50,.40],[116,0],[50,-.40],[-50,-.40]],section=[];
  for(let j=0;j<6;j++)for(let i=0;i<12;i++){const f=i/12,a=cross[j],b=cross[(j+1)%6];section.push([a[0]*(1-f)+b[0]*f,a[1]*(1-f)+b[1]*f,f]);}
  function pencilLoft(name,rings,color){const P=[],I=[],n=section.length;for(const fn of rings)for(const q of section)P.push(...s.point(fn(q)));for(let j=0;j<rings.length-1;j++)for(let i=0;i<n;i++){const a=j*n+i,b=j*n+(i+1)%n,c=a+n,d=b+n;I.push(a,d,b,a,c,d);}for(const end of [0,rings.length-1]){const pts=section.map(rings[end]),center=pts.reduce((a,b)=>a.map((x,i)=>x+b[i]/pts.length),[0,0,0]),c=P.length/3;P.push(...s.point(center));for(let i=0;i<n;i++)end?I.push(c,end*n+i,end*n+(i+1)%n):I.push(c,(i+1)%n,i);}return k.mesh(name,k.geometry(P,I),k.solid(name+'Color',color),s.parent);}
  const scallop=([x,z,f])=>[320+x,190+22*Math.sin(f*Math.PI),z],woodTop=([x,z])=>[320+x*.36,112+8*z/.40,z*.36];
  pencilLoft('PencilBarrelSolid',[scallop,([x,z])=>[320+x,448+18*z/.40,z]],'#f3c216');
  pencilLoft('PencilWoodSolid',[woodTop,scallop],'#f1c39b').userData.artworkFacingFade=[0,.10];
  pencilLoft('PencilGraphiteSolid',[()=>[320,61,0],([x,z])=>[320+x*.045,65,z*.045],woodTop],'#403c3d').userData.artworkFacingFade=[0,.10];
  const eraserRing=(y,r,tilt)=>([x,z])=>{const a=Math.atan2(x/116,z/.40);return[320+Math.sin(a)*116*r,y+Math.cos(a)*tilt,Math.cos(a)*.40*r];};
  pencilLoft('PencilFerruleSolid',[eraserRing(448,1.015,18),eraserRing(477,1.015,18)],'#b5b5bf').userData.artworkHorizontalNormal=true;
  pencilLoft('PencilEraserSolid',[eraserRing(477,1,18),eraserRing(507,.99,13),eraserRing(525,.91,9),eraserRing(537,.73,5),eraserRing(543,.40,1),()=>[320,545,0]],'#ee7b94').userData.artworkHorizontalNormal=true;
  for(const side of [-1,1]){plain(s.tube('PencilTipInk'+side,[[320,62,0],[320+side*12,73,0],[320+side*42,112,0],[320+side*116,190,0]],.010,'#6d391e'));plain(s.tube('PencilOuterInk'+side,[[320+side*116,190,0],[320+side*116,448,0]],.010,'#6d391e'));}
  const torso=part('Torso',[320,536]);volume('PencilHiddenWaistSolid',k.ellipse(320,538,52,12),[320,538],.18,.18,'#e7768f',0,torso);torso.paint();
  for(const side of [-1,1]){
   const mirror=ps=>ps.map(([x,y])=>[side<0?x:640-x,y]);
   const arm=part(side<0?'LeftArm':'RightArm',[201+ (side>0?238:0),430]);volume('PencilHandSolid'+side,mirror([[205,415],[213,438],[212,466],[193,482],[181,485],[171,480],[167,467],[171,451],[183,432]]),[320+side*132,456],.11,.11,'#f5c49a',0,arm);arm.paint();
   const foot=part(side<0?'LeftLeg':'RightLeg',[320+side*31,542]);volume('PencilFootSolid'+side,mirror([[272,540],[309,542],[308,560],[301,575],[283,579],[267,574],[263,564],[267,550]]),[320+side*34,559],.16,.16,'#ed7a92',0,foot);foot.paint();
  }
 }
 if(id==='object-mitten'){
  const glove=volume('MittenShellSolid',[[231,445],[213,397],[182,367],[157,337],[136,300],[132,269],[141,248],[160,239],[182,246],[203,263],[211,200],[230,145],[262,106],[305,77],[350,66],[393,73],[435,96],[467,134],[489,182],[502,240],[502,294],[494,350],[480,406],[464,447]],[350,275],.43,.43,'#ba2931');
  const cuff=volume('MittenCuffSolid',[[231,443],[246,440],[258,447],[273,438],[290,446],[305,440],[322,450],[339,442],[355,450],[371,443],[389,448],[406,440],[423,444],[437,439],[456,447],[467,443],[476,458],[473,469],[482,481],[477,496],[466,502],[461,512],[443,515],[430,510],[413,519],[397,514],[379,519],[363,513],[347,518],[331,511],[314,517],[298,510],[280,513],[267,505],[250,507],[240,498],[229,493],[223,481],[227,467],[230,454]],[350,477],.43,.43,'#efe6e7');
  const torso=part('Torso',[350,528]);volume('MittenHiddenWaistSolid',[[292,506],[414,506],[411,535],[388,550],[316,550],[296,536]],[350,528],.23,.23,'#b92330',0,torso);torso.paint();
  for(const side of [-1,1]){const foot=part(side<0?'LeftLeg':'RightLeg',[350+side*30,541]);volume('MittenFootSolid'+side,[[298,528],[337,530],[341,546],[331,566],[320,575],[304,575],[296,566],[300,550]].map(([x,y])=>[side<0?x:700-x,y]),[350+side*31,553],.18,.18,'#bd2531',0,foot);foot.paint();}
  // Knit stitches follow the actual reverse surface, not a flat back decal.
  glove.updateWorldMatrix(true,false);const ray=new T.Raycaster();
  function rearLine(name,ps,r,color){const sampled=[];for(const [x,y] of ps){ray.set(new T.Vector3((x-320)*.005,(580-y)*.005,-3),new T.Vector3(0,0,1));const hit=ray.intersectObject(glove)[0];if(hit)sampled.push([x,y,hit.point.z-.006]);}if(sampled.length>1)fineThread(name,sampled,r,color);}
  for(let row=0;row<8;row++)for(let col=0;col<9;col++){const x=230+col*27,y=225+row*26;rearLine('MittenRearKnit'+row+'_'+col,[[x-7,y-9],[x,y+7],[x+7,y-9]],.007,'#d34443');}
  for(const y of [122,204]){const ps=[];for(let x=205;x<=502;x+=4)ps.push([x,y]);rearLine('MittenRearBand'+y,ps,.022,'#f0b4a6');}
  for(const x of [246,352,457])for(let j=0;j<4;j++){const a=j*Math.PI/4;rearLine('MittenRearStar'+x+'_'+j,[[x-Math.cos(a)*16,166-Math.sin(a)*16],[x+Math.cos(a)*16,166+Math.sin(a)*16]],.015,'#edc2ab');}
 }
 if(id==='object-sack'){
  const bag=volume('SackBodySolid',[[219,169],[254,178],[320,184],[385,180],[424,171],[459,204],[487,252],[502,302],[500,348],[479,389],[443,421],[393,442],[335,452],[278,450],[222,436],[178,412],[148,379],[133,341],[131,303],[141,263],[162,222],[191,190]],[320,313],.64,.64,'#e82137');
  const gathered=volume('SackGatheredTopSolid',[[219,164],[203,138],[192,116],[193,98],[207,84],[226,82],[246,89],[265,94],[285,78],[305,65],[325,62],[344,68],[363,83],[380,94],[402,90],[425,83],[445,90],[452,107],[446,127],[429,152],[418,168],[384,178],[320,181],[257,176]],[320,126],.34,.34,'#ef2c40');
  // A closed cord ring wraps around the gathered neck; its front line sags.
  bag.updateWorldMatrix(true,false);gathered.updateWorldMatrix(true,false);const supportRay=new T.Raycaster(),cloth=[bag,gathered];
  const cord=[];for(let j=0;j<=96;j++){const a=j/96*Math.PI*2,y=164+Math.cos(a)*14,dir=new T.Vector3(Math.sin(a),0,Math.cos(a));supportRay.set(new T.Vector3(dir.x*4,(580-y)*.005,dir.z*4),dir.clone().negate());const hit=supportRay.intersectObjects(cloth)[0];if(hit){const p=hit.point.clone().addScaledVector(dir,.01);cord.push([320+p.x/.005,y,p.z]);}}
  plain(s.tube('SackNeckCord',cord,.041,'#f8aa31'));
  function overCloth(p){const [x,y,z,r]=p;supportRay.set(new T.Vector3((x-320)*.005,(580-y)*.005,3),new T.Vector3(0,0,-1));const hit=supportRay.intersectObjects(cloth)[0];return[x,y,hit?hit.point.z+.02:z,r];}
  s.ellipsoid('SackKnotSolid',overCloth([410,163,.20]).slice(0,3),[16,16,.09],'#f7a52b');
  s.sweep('SackBowRightSolid',[[420,170,.20,9],[451,178,.22,9],[476,194,.24,9],[487,211,.26,9],[481,221,.28,9],[465,222,.32,9],[445,207,.34,9],[425,181,.25,9]].map(overCloth),'#f8ac34');
  s.sweep('SackBowLeftSolid',[[409,177,.25,8],[399,197,.40,8],[399,219,.41,8],[410,230,.42,8],[422,228,.43,8],[423,210,.43,8],[416,183,.29,8]].map(overCloth),'#f8ac34');
  const end=volume('SackRibbonEndSolid',[[426,204],[438,221],[451,245],[452,259],[445,267],[434,265],[427,257],[423,236]],[436,239],.04,.04,'#f8a43c'),ep=end.geometry.attributes.position;
  for(let i=0;i<ep.count;i++){const x=s.pivot[0]+ep.getX(i)/.005,y=s.pivot[1]-ep.getY(i)/.005,z=overCloth([x,y,.46])[2];ep.setZ(i,ep.getZ(i)+z-s.offset.z);}end.geometry.computeVertexNormals();
  suit('Sack','#f39696',[[267,443],[371,443],[383,477],[379,513],[359,533],[320,541],[282,531],[257,511],[254,480]],[320,490],[[245,448],[264,452],[253,476],[250,497],[240,510],[228,508],[219,498],[221,480],[233,457]],[250,454],{pivotY:531,cy:547,outline:[[271,519],[309,522],[310,540],[302,550],[305,556],[293,562],[276,561],[263,554],[264,543],[270,534]]});
  // Gathered cloth creases stay on the back of the actual bag volume.
  bag.updateWorldMatrix(true,false);const ray=new T.Raycaster();
  for(const side of [-1,1])for(let n=0;n<2;n++){const ps=[];for(let j=0;j<=24;j++){const t=j/24,x=320+side*(65+n*24+40*Math.sin(t*Math.PI/2)),y=185+145*t;ray.set(new T.Vector3((x-320)*.005,(580-y)*.005,-3),new T.Vector3(0,0,1));const hit=ray.intersectObject(bag)[0];if(hit)ps.push([x,y,hit.point.z-.006]);}if(ps.length>1)plain(s.tube('SackRearFold'+side+'_'+n,ps,.009,'#ce2034'));}
 }
 s.paint();head.authoredFamily='source-shaped-object';return true;
};
