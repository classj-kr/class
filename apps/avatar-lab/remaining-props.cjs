"use strict";
const ids=['award-trophy','food-candy','food-cookie','food-dumpling','food-fish-pastry','food-pizza','food-rice-ball','food-sandwich','food-toast','object-key','object-mitten','object-newspaper','object-sack'];
module.exports=function props(THREE,k,id,head,parts){
 if(!ids.includes(id))return false;const s=require('./sculpt-kit.cjs')(THREE,k,head);s.parent.clear();
 const cream='#f5e2b7',gold='#e4ab42',brown='#995b34';
 if(id==='award-trophy'){
  s.lathe('TrophyCup',[[414,0],[402,58],[359,107],[292,153],[205,172],[108,181],[87,181],[87,169],[112,169],[207,160],[288,141],[349,96],[388,47],[390,0],[414,0]],'#efb63a');
  s.box('TrophyBase',[320,501,0],[233,49,.70],'#8e572f',5);s.lathe('TrophyStem',[[480,0],[480,58],[465,39],[420,25],[407,33],[407,0]],gold);
  for(const side of [-1,1])s.tube('TrophyHandle'+side,[[320+side*167,128,0],[320+side*219,130,0],[320+side*246,180,0],[320+side*225,269,0],[320+side*139,338,0]],.063,'#e8ac32');
 }
 if(id==='food-candy'){
  const candy=s.ellipsoid('CandyBall',[320,270,0],[168,168,.72],'#e98293');const p=candy.geometry.attributes.position,colors=[];
  for(let i=0;i<p.count;i++){const a=Math.atan2(p.getX(i),p.getZ(i))+.8*p.getY(i),c=new THREE.Color(Math.floor((a+Math.PI)*3)%3===0?'#9bbecb':'#e8869c').convertSRGBToLinear();colors.push(c.r,c.g,c.b);}candy.geometry.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));candy.material.color.set(0xffffff);candy.material.userData.preserveVertexColor=true;
  for(const side of [-1,1])s.outline('CandyWrapper'+side,[[320+side*149,214],[320+side*227,157],[320+side*243,172],[320+side*226,247],[320+side*249,315],[320+side*230,344],[320+side*150,313]],.17,'#e89aa9',-.04,.04);
 }
 if(id==='food-cookie'){
  const ps=[];for(let i=0;i<64;i++){const a=i/64*Math.PI*2,r=174+5*Math.sin(a*11);ps.push([320+Math.cos(a)*r,268+Math.sin(a)*r]);}s.outline('BakedCookie',ps,.44,'#dca760',0,.09);
  const chips=[[-86,-88,14],[22,-119,19],[107,-55,15],[-126,-2,20],[40,18,16],[92,93,18],[-61,112,14],[-98,62,17],[2,85,11],[52,-52,14]];
  for(const [i,[dx,dy,r]] of chips.entries())s.ellipsoid('RearChocolateChip'+i,[320+dx,268+dy,-.255],[r,r*.80,.018],'#77472c',i*.4);
 }
 if(id==='food-dumpling'){
  s.lathe('DumplingBody',[[419,0],[409,96],[382,162],[341,195],[280,201],[227,192],[180,160],[143,110],[115,72],[105,44],[101,0]],'#f4e5c5');
  for(const side of [-1,0,1])s.sweep('PinchedDough'+side,[[320+side*45,137,0,33],[320+side*47,104,0,26],[320+side*48,side?83:74,0,13]],'#f4e5c5');
  for(let i=0;i<7;i++){const a=i/7*Math.PI*2;s.tube('DumplingPleat'+i,[[320+Math.sin(a)*15,114,Math.cos(a)*.075],[320+Math.sin(a)*57,166,Math.cos(a)*.285],[320+Math.sin(a)*89,198,Math.cos(a)*.445]],.010,'#cdb995');}
 }
 if(id==='food-fish-pastry'){
  s.ellipsoid('FishPastryBody',[284,280,0],[224,163,.44],'#dfa353');
  k.volume('FishTail',[[466,214],[537,169],[574,171],[584,195],[562,266],[571,324],[579,359],[557,379],[516,372],[472,339]],[528,275],s.pivot,.18,.18,s.parent,k.solid('FishTailColor','#d79548'),{art:false,samples:64});
  k.volume('FishDorsalFin',[[225,124],[268,78],[301,66],[331,76],[409,123],[443,164],[357,139]],[323,115],s.pivot,.15,.15,s.parent,k.solid('FishFinColor','#dca04e'),{art:false,samples:48});
  s.ellipsoid('FishMouth',[101,286,.02],[25,25,.16],'#ce8b41');
  for(let row=0;row<5;row++)for(let col=0;col<6;col++){
   const x=205+col*40+(row%2)*15,y=180+row*43,u=(x-284)/224,v=(y-280)/163;if(u*u+v*v>.72)continue;
   const ps=[];for(let j=0;j<=12;j++){const a=j/12*Math.PI,xx=x+Math.cos(a)*17,yy=y+Math.sin(a)*11,z=-.44*Math.sqrt(Math.max(.01,1-((xx-284)/224)**2-((yy-280)/163)**2))-.005;ps.push([xx,yy,z]);}s.tube('PastryScale'+row+'_'+col,ps,.008,'#b97b3e');
  }
  const torso=parts.get('Torso');torso.group.clear();const t=require('./sculpt-kit.cjs')(THREE,k,torso);
  t.ellipsoid('PastrySuit',[320,480,0],[70,64,.28],'#dfa353');t.paint();
  for(const side of [-1,1]){
   const name=side<0?'LeftArm':'RightArm',pivot=[320+side*49,440];let arm=parts.get(name);if(!arm){arm={part:{pivot},group:k.group(name,pivot)};parts.set(name,arm);}arm.group.clear();arm.part.pivot=pivot;arm.group.position.set((pivot[0]-320)*.005,(580-pivot[1])*.005,0);
   const a=require('./sculpt-kit.cjs')(THREE,k,arm);a.sweep('RaisedPastrySleeve'+side,[[320+side*49,440,.06,18],[320+side*60,417,.25,20],[320+side*42,393,.37,19]],'#e7ad60');
   const leg=parts.get(side<0?'LeftLeg':'RightLeg');leg.group.clear();const l=require('./sculpt-kit.cjs')(THREE,k,leg);
   l.ellipsoid('PastryLeg'+side,[320+side*36,543,0],[23,24,.18],'#dfa353');l.ellipsoid('PastryFoot'+side,[320+side*40,564,.04],[27,13,.21],'#dfa353');
  }
 }
 if(id==='food-pizza'){
  const ps=[[320,64],[412,77],[491,108],[533,136],[537,161],[496,244],[435,374],[373,498],[333,544],[311,543],[263,465],[205,339],[146,214],[102,168],[98,140],[126,116],[214,78]];
  s.smoothOutline('PizzaCrust',ps,.36,'#bb8243',-.02,.035);
  s.smoothOutline('PizzaCheese',[[320,132],[409,143],[520,182],[446,351],[385,467],[326,528],[316,530],[254,426],[193,288],[117,181],[204,146]],.035,'#efc66f',.18,.012);
  s.tube('RolledCrust',[[108,145,.14],[176,110,.14],[253,88,.14],[320,83,.14],[408,100,.14],[478,126,.14],[529,150,.14]],.078,'#d9a05a');
 }
 if(id==='food-rice-ball'){
  s.outline('RiceTriangle',[[320,84],[347,100],[397,177],[461,286],[482,381],[464,410],[320,428],[176,410],[158,381],[181,286],[246,177],[293,100]],.83,'#f5f2df',0,.16);
  for(const side of [-1,1])s.box('NoriPatch'+side,[320,382,side*.49],[146,85,.035],'#304231',9);
  for(let i=0;i<28;i++){const y=165+(i%6)*38,x=245+((i*47)%160);if(Math.abs(x-320)>(y-90)*.55)continue;s.ellipsoid('RearRiceGrain'+i,[x,y,-.48],[3,6,.009],'#e0ddc9',i*.7);}
 }
 const breadOutline=[[174,420],[155,392],[156,234],[140,203],[144,161],[165,121],[216,86],[277,67],[343,64],[412,83],[471,118],[495,159],[500,195],[483,220],[479,374],[454,411],[403,432],[231,432]];
 if(id==='food-toast'){
  s.smoothOutline('ToastCrust',breadOutline,.44,'#b87b42',0,.055);s.smoothOutline('ToastCrumb',breadOutline.map(([x,y])=>[320+(x-320)*.88,260+(y-260)*.91]),.025,'#f3d6a0',.253,.012);
  s.smoothOutline('BackToastCrumb',breadOutline.map(([x,y])=>[320+(x-320)*.88,260+(y-260)*.91]),.025,'#edcd94',-.253,.012);
 }
 if(id==='food-sandwich'){
  const ps=[[320,106],[409,119],[468,151],[489,194],[486,230],[469,263],[473,450],[469,498],[445,520],[389,528],[222,528],[169,517],[153,491],[151,269],[134,236],[126,201],[136,164],[172,135],[239,113]];
  s.smoothOutline('BackBread',ps.map(([x,y])=>[x+10,y-23]),.18,'#c79551',-.36,.045);
  s.smoothOutline('LettuceLayer',[[111,237],[131,194],[126,143],[169,100],[245,73],[290,75],[321,63],[364,83],[401,68],[458,85],[489,118],[505,181],[527,232],[510,288],[527,337],[509,381],[527,421],[512,475],[487,510],[461,520],[152,515],[122,482],[114,431],[133,378],[113,326],[131,291]],.29,'#849d43',-.11,.025);
  for(const [i,y] of [181,318,437].entries())s.ellipsoid('TomatoSlice'+i,[482,y,.07],[37,65,.10],'#c97445');
  s.smoothOutline('CheeseLayer',[[142,155],[227,99],[308,108],[401,68],[481,133],[489,455],[464,501],[151,493]],.05,'#e6bd64',.19,.014);
  s.smoothOutline('FrontBread',ps,.17,'#cc9c59',.30,.04);s.smoothOutline('BreadCrumb',ps.map(([x,y])=>[315+(x-315)*.89,320+(y-320)*.92]),.025,'#f1d4a2',.405,.012);
 }
 if(id==='object-key'){
  s.ellipsoid('KeyMedallion',[320,324,0],[137,127,.21],'#eac18b');s.box('KeyShaft',[320,488,0],[58,176,.33],'#dcb081',5);
  s.box('UpperKeyTooth',[365,474,0],[60,33,.31],'#dcb081',4);s.box('LowerKeyTooth',[365,536,0],[60,34,.31],'#dcb081',4);
  const shape=new THREE.Shape();shape.absellipse(0,0,.49,.38,0,Math.PI*2,false,0);
  const hole=new THREE.Path();hole.moveTo(0,.11);hole.bezierCurveTo(-.14,.27,-.36,.20,-.35,.025);hole.bezierCurveTo(-.34,-.16,-.12,-.17,0,-.08);hole.bezierCurveTo(.12,-.17,.34,-.16,.35,.025);hole.bezierCurveTo(.36,.20,.14,.27,0,.11);hole.closePath();shape.holes.push(hole);
  const geo=new THREE.ExtrudeGeometry(shape,{depth:.24,bevelEnabled:true,bevelThickness:.04,bevelSize:.025,bevelSegments:4,steps:1,curveSegments:36});geo.translate(0,0,-.12);s.mesh('KeyBow',geo,'#e8bd88',[320,149,0]);
 }
 if(id==='object-mitten'){
  k.volume('KnittedMitten',[[349,62],[415,76],[472,120],[500,184],[510,270],[507,364],[486,436],[472,460],[229,460],[214,416],[209,326],[201,230],[216,168],[249,112],[294,78]],[351,271],head.part.pivot,.47,.47,s.parent,k.solid('MittenRed','#ba3b3a'),{art:false,samples:96});
  s.sweep('MittenThumb',[[240,408,0,35],[199,366,.01,40],[162,316,.01,38],[155,276,0,30]],'#c44945');
  s.ellipsoid('ThumbTip',[155,276,0],[30,36,.15],'#c44945',-.55);
  s.ellipsoid('WhiteCuff',[350,478,0],[129,37,.48],'#f4e6e3');
  for(let i=0;i<8;i++)s.ellipsoid('CuffLoop'+i,[238+i*32,493,.01],[20,22,.45],'#f5e8e4');
  for(const y of [126,204]){const ps=[],r=Math.sqrt(1-((y-263)/202)**2);for(let i=0;i<=64;i++){const a=i/64*Math.PI*2;ps.push([353+Math.sin(a)*154*r,y,Math.cos(a)*.475*r]);}const band=s.tube('KnittedBand'+y,ps,.009,'#e3b4a0');band.userData.skipOriginalPaint=true;}
  for(const [name,x,y,rx,ry,c] of [['Torso',350,528,55,24,'#bd343b'],['LeftLeg',328,557,25,25,'#bd343b'],['RightLeg',380,557,25,25,'#bd343b']]){
   const part=parts.get(name);part.group.clear();const limb=require('./sculpt-kit.cjs')(THREE,k,part);limb.ellipsoid(name+'MittenSuit',[x,y,0],[rx,ry,.18],c);limb.paint();
  }
 }
 if(id==='object-newspaper'){
  s.box('FoldedNewspaper',[320,257,0],[361,356,.10],'#ece3dc',9);
  s.outline('FoldedCorner',[[427,81],[498,150],[431,150]],.035,'#d2c5bc',.07,.008);
  function ink(name,x,y,w,h,color,z=-.066){const o=s.mesh(name,new THREE.PlaneGeometry(w*.005,h*.005),color,[x,y,z]);o.rotation.y=Math.PI;o.userData.skipOriginalPaint=true;return o;}
  for(let column=0;column<3;column++)for(let line=0;line<18;line++)ink('RearPrint'+column+'_'+line,209+column*110,132+line*15,82-(line%4)*8,2,'#978d88');
  ink('RearPhoto',320,250,103,83,'#b0a5a0',-.069);
 }
 if(id==='object-sack'){
  s.lathe('SilkSack',[[437,0],[421,91],[385,149],[320,171],[253,153],[199,110],[174,67],[141,97],[105,112],[110,101],[142,88],[179,56],[185,0]],'#c43e39');
  s.tube('Drawstring',[[245,174,.08],[320,190,.33],[390,173,.08]],.029,'#daab53');
  for(const side of [-1,1])s.torus('SackBow'+side,[404+side*15,184,.09],.105,.020,'#d6a24b',[.8,1.5,1]);
  s.tube('SackTie',[[405,190,.10],[428,240,.13],[443,261,.12]],.022,'#d6a24b');
 }
 s.paint();head.authoredFamily='prop';return true;
};
module.exports.ids=ids;
