"use strict";
module.exports=function objects(THREE,k,id,head,parts){
 const supported=['game-dice','object-boot','object-camera','object-eraser','food-hot-dog','object-gift','object-lock','object-pencil','object-radio','object-television','object-watch','food-popcorn','food-sushi','food-cheese','food-chocolate','fruit-grape','theme-balloons'];if(!supported.includes(id))return false;
 const parent=head.group;parent.clear();const pivot=head.part.pivot,offset=parent.position.clone();
 const local=p=>p.map((v,i)=>v-offset.getComponent(i));
 function mesh(n,g,c,p){return k.mesh(n,g,k.solid(n+'Color',c),parent,local(p));}
 function egg(n,size,c,p){const small=Math.max(...size)<.20;const m=mesh(n,new THREE.SphereGeometry(1,small?16:32,small?10:20),c,p);m.scale.set(...size);return m;}
 function roundedBox(n,w,h,d,r,c,p){
  const shape=new THREE.Shape();const x=-w/2+r,y=-h/2+r;shape.moveTo(x,-h/2);shape.lineTo(w/2-r,-h/2);shape.quadraticCurveTo(w/2,-h/2,w/2,y);shape.lineTo(w/2,h/2-r);shape.quadraticCurveTo(w/2,h/2,w/2-r,h/2);shape.lineTo(x,h/2);shape.quadraticCurveTo(-w/2,h/2,-w/2,h/2-r);shape.lineTo(-w/2,y);shape.quadraticCurveTo(-w/2,-h/2,x,-h/2);
  const edge=Math.min(r,d*.45);
  const geo=new THREE.ExtrudeGeometry(shape,{depth:d-2*edge,bevelEnabled:true,bevelThickness:edge,bevelSize:Math.min(r*.35,edge*.75),bevelSegments:4,curveSegments:12,steps:1});geo.translate(0,0,-d/2+edge);return mesh(n,geo,c,p);
 }
 function cylinder(n,r,h,c,p,axis='z'){const o=mesh(n,new THREE.CylinderGeometry(r,r,h,64),c,p);if(axis==='z')o.rotation.x=Math.PI/2;return o;}
 function ring(n,r,t,c,p){return mesh(n,new THREE.TorusGeometry(r,t,10,64),c,p);}
 function lathe(n,ps,c,p=[0,0,0]){return mesh(n,new THREE.LatheGeometry(ps.map(v=>new THREE.Vector2(...v)),64),c,p);}
 function tube(n,ps,r,c){return k.tube(n,ps.map(local),r,k.solid(n+'Color',c),parent);}
 if(id==='object-gift'){
  roundedBox('GiftBox',1.61,1.03,1.56,.055,'#efb947',[0,1.17,0]);roundedBox('GiftLid',1.74,.42,1.56,.045,'#f4c253',[0,1.89,0]);
  roundedBox('VerticalRibbon',.40,1.46,1.55,.015,'#bc3541',[0,1.38,0]);roundedBox('CrossRibbon',1.78,1.46,.21,.015,'#bc3541',[0,1.38,0]);
  roundedBox('RearRibbon',.40,1.46,.025,.008,'#bc3541',[0,1.38,-.79]);
  for(const side of [-1,1]){
   const ps=[[317,159],[267,84],[236,65],[211,73],[187,108],[195,140],[247,159]].map(([x,y])=>[320+side*(x-320),y]);
   k.volume('FabricBow'+side,ps,[320+side*(247-320),122],pivot,.16,.14,parent,k.solid('FabricBowRed'+side,'#c42d40'),{art:false,samples:48});
  }
  egg('BowKnot',[.14,.12,.14],'#dc7130',[0,2.15,.02]);
 }
 if(id==='object-lock'){
  roundedBox('LockBody',1.42,1.14,.76,.13,'#edb747',[0,1.27,0]);
  tube('MetalShackle',[[-.43,1.73,0],[-.43,2.24,0],[-.30,2.49,0],[0,2.57,0],[.30,2.49,0],[.43,2.24,0],[.43,1.73,0]],.095,'#b4ada5');
  cylinder('RearKeyHole',.08,.02,'#7a5d38',[0,1.26,-.40]);
 }
 if(id==='object-pencil'){
  const cross=[[-.51,.38],[.51,.38],[.61,0],[.51,-.38],[-.51,-.38],[-.61,0]],P=[],I=[];
  for(const y of [.49,2.13])for(const [x,z] of cross)P.push(x,y,z);
  for(let i=0;i<6;i++){const j=(i+1)%6;I.push(i,j,j+6,i,j+6,i+6);}
  for(let i=1;i<5;i++){I.push(0,i+1,i);I.push(6,6+i,7+i);}
  const pencil=mesh('HexagonalPencil',k.geometry(P,I),'#e7ac43',[0,0,0]);
  const T=[...cross.flatMap(([x,z])=>[x,2.13,z]),0,2.54,0],J=[];
  for(let i=0;i<6;i++)J.push(i,(i+1)%6,6);
  mesh('WoodTip',k.geometry(T,J),'#eac5a1',[0,0,0]);mesh('GraphiteTip',new THREE.ConeGeometry(.15,.22,6),'#49454e',[0,2.61,0]);
  cylinder('MetalFerrule',.57,.16,'#a6c7d5',[0,.47,0],'y');cylinder('PinkEraser',.56,.24,'#d68a98',[0,.27,0],'y');
 }
 if(id==='object-radio'||id==='object-television'){
  const tv=id==='object-television',w=tv?1.90:2.19,h=tv?1.425:1.06,cy=tv?1.445:1.32;
  roundedBox('ElectronicCase',w,h,.75,.13,tv?'#655169':'#dda14e',[0,cy,0]);roundedBox('RearCover',w-.20,h-.20,.025,.06,'#49414b',[0,cy,-.396]);
  for(let i=0;i<8;i++)roundedBox('RearVent'+i,.018,h*.38,.01,.004,'#25262c',[(i-3.5)*.065,cy,-.417]);
  if(tv){
   roundedBox('ScreenFrame',1.46,1.15,.045,.13,'#35313b',[-.11,cy,.398]);roundedBox('ScreenGlass',1.40,1.09,.025,.12,'#85a6b0',[-.11,cy,.432]);
   for(const y of [1.775,1.445])cylinder('TVKnob'+y,.09,.055,'#b5a8b3',[.775,y,.421]);
   for(let i=0;i<4;i++)roundedBox('TVSpeakerVent'+i,.18,.018,.012,.006,'#343039',[.775,1.19-i*.065,.404]);
   const a=require('./sculpt-kit.cjs')(THREE,k,head);
   a.ellipsoid('AntennaBase',[318,145,-.02],[42,24,.12],'#625467');
   for(const side of [-1,1])a.sweep('TVAntenna'+side,[[320+side*35,142,0,9],[320+side*60,101,-.02,13],[320+side*78,68,-.03,4]],'#40353e');
  }
  else{for(const sign of [-1,1]){cylinder('Speaker'+sign,.27,.02,'#333238',[sign*.71,cy,.40]);for(let i=-3;i<=3;i++)tube('SpeakerSlot'+sign+'_'+i,[[sign*.71-.20,cy+i*.05,.416],[sign*.71+.20,cy+i*.05,.416]],.006,'#766e67');}roundedBox('RadioDial',1.18,.12,.03,.02,'#a7b8b0',[-.12,cy+.36,.405]);tube('RadioAntenna',[[.14,cy+h/2,0],[.87,2.50,0]],.023,'#5a4d4c');}
 }
 if(id==='object-watch'){
  roundedBox('LeatherStrap',.56,2.47,.16,.055,'#8b5942',[0,1.30,0]);cylinder('WatchCase',.69,.24,'#bd9573',[0,1.30,.10]);ring('Bezel',.65,.035,'#a78f88',[0,1.30,.245]);cylinder('ClockFace',.60,.018,'#f3eeeb',[0,1.30,.244]);cylinder('WatchBack',.60,.016,'#a59d92',[0,1.30,-.029]);
  for(let i=0;i<4;i++)egg('StrapHole'+i,[.025,.025,.005],'#4e342b',[0,.13+i*.12,.086]);
 }
 if(id==='food-popcorn'){
  const bucket=mesh('PopcornBucket',new THREE.CylinderGeometry(.72,.53,1.20,64,12),'#ffffff',[0,1.34,0]),p=bucket.geometry.attributes.position,colors=[];
  for(let i=0;i<p.count;i++){const a=Math.atan2(p.getX(i),p.getZ(i)),c=new THREE.Color(Math.floor((a+Math.PI/12)/(Math.PI/6))%2?'#fff0d9':'#bf3544').convertSRGBToLinear();colors.push(c.r,c.g,c.b);}bucket.geometry.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));bucket.material.userData.preserveVertexColor=true;
  const rim=ring('BucketRim',.72,.025,'#ead9b7',[0,1.95,0]);rim.rotation.x=Math.PI/2;
  for(let i=0;i<24;i++){const a=i*2.4,r=.12+.50*(i%6)/5,y=2.02+.28*(1-r/.65);const center=[Math.cos(a)*r,y,Math.sin(a)*r];for(let j=0;j<3;j++)egg('Popcorn'+i+'_'+j,[.095,.10,.09],j===1?'#f5df9c':'#fff0bd',[center[0]+Math.cos(j*2.1)*.055,center[1]+(j===1?.045:0),center[2]+Math.sin(j*2.1)*.055]);}
 }
 if(id==='food-sushi'){
  const s=require('./sculpt-kit.cjs')(THREE,k,head);
  s.ellipsoid('Rice',[320,309,0],[219,119,.65],'#faf6e6');
  const contour=[[80,203],[145,124],[237,78],[320,63],[408,83],[482,136],[540,197],[557,237],[529,255],[452,240],[385,214],[320,202],[245,218],[160,248],[106,259],[79,239]];
  k.volume('SalmonFillet',contour,[320,153],pivot,.64,.64,parent,k.solid('SalmonColor','#dc805b'),{art:false,samples:96});
  for(let i=0;i<24;i++){const a=i/24*Math.PI*2,x=320+Math.cos(a)*204,y=310+Math.sin(a)*108;
   const grain=s.ellipsoid('RiceGrain'+i,[x,y,-.02],[17,13,.16],'#faf6e6',a);grain.userData.skipOriginalPaint=false;
  }
  for(let line=0;line<6;line++){
   const x=160+line*62,ps=[];for(let j=0;j<=24;j++){const y=118+j*3.8,u=(x-320)/245,v=(y-156)/105,z=-.64*Math.sqrt(Math.max(.02,1-u*u-v*v));ps.push([x+(y-160)*.25,y,z-.012]);}
   s.tube('SalmonRearFat'+line,ps,.012,'#f4bea0');
  }

 }
 if(id==='food-cheese'){
  const s=new THREE.Shape();s.moveTo(-.78,.78);s.lineTo(.78,.78);s.lineTo(.78,2.15);s.lineTo(.17,2.55);s.lineTo(-.78,2.18);s.closePath();const geo=new THREE.ExtrudeGeometry(s,{depth:1.10,bevelEnabled:true,bevelThickness:.065,bevelSize:.045,bevelSegments:3,steps:1});geo.translate(0,0,-.55);mesh('CheeseWedge',geo,'#edbc46',[0,0,0]);
  for(const [i,x,y,r] of [[0,-.45,1.96,.12],[1,.36,1.68,.09],[2,-.26,1.12,.08],[3,.42,2.12,.10]])egg('CheeseDimple'+i,[r,r*.8,.014],'#d49c34',[x,y,-.621]);
 }
 if(id==='food-chocolate'){
  roundedBox('ChocolateBar',1.39,1.85,.38,.07,'#8a5138',[0,1.66,0]);roundedBox('RedWrapper',1.43,1.21,.43,.045,'#b94438',[0,1.30,0]);
  for(let side of [-1,1])for(let col=0;col<3;col++)for(let row=0;row<2;row++)roundedBox('ChocolateTile'+side+'_'+row+'_'+col,.40,.29,.035,.026,'#92563a',[(col-1)*.44,2.12+row*.32,side*.213]);
 }
 if(id==='theme-balloons'){
  const pix=(x,y,z=0)=>[(x-320)*.005,(580-y)*.005,z];
  egg('BalloonCostumeHood',[.56,.53,.48],'#56b7dc',pix(320,365));
  const cluster=[[325,126,61,67,'#69c9e4',-.18],[217,169,66,76,'#a760b9',-.12],[427,175,62,73,'#efc335',-.13],[156,292,56,74,'#f2c535',-.05],[473,294,62,77,'#ce6eae',-.06],[208,247,67,79,'#8dc942',.06],[307,199,65,77,'#ed3945',.11],[422,246,65,77,'#309ed3',.07]];
  for(const [i,[x,y,rx,ry,c,z]] of cluster.entries()){
   egg('Balloon'+i,[rx*.005,ry*.005,.27],c,pix(x,y,z));
   const knot=mesh('BalloonKnot'+i,new THREE.ConeGeometry(.035,.06,12),c,pix(x,y+ry+4,z));knot.rotation.z=Math.PI;
   if(i===3||i===4||i===5||i===7){const side=x<320?-1:1;const string=tube('BalloonString'+i,[pix(x,y+ry+6,z),pix(320+side*89,423,.10),pix(320+side*66,509,.03)],.007,'#78503c');string.userData.skipOriginalPaint=true;}
  }
  const torso=parts.get('Torso');torso.group.clear();const suit=require('./sculpt-kit.cjs')(THREE,k,torso);
  suit.ellipsoid('BalloonSuitBody',[320,498,0],[61,54,.27],'#49b3df');suit.paint();
  for(const side of [-1,1]){
   const name=side<0?'LeftArm':'RightArm',pivot=[320+side*49,463],group=parts.get(name)?.group||k.group(name,pivot);
   group.clear();group.position.set((pivot[0]-320)*.005,(580-pivot[1])*.005,0);
   const part={group,part:{pivot,color:'#49b3df'}};parts.set(name,part);const a=require('./sculpt-kit.cjs')(THREE,k,part);
   a.sweep('BalloonSleeve'+side,[[320+side*49,463,0,19],[320+side*80,447,.03,21],[320+side*96,432,.06,20]],'#49b3df');
   a.ellipsoid('BalloonCuff'+side,[320+side*96,432,.06],[20,16,.14],'#ec7862',side*-.60);
   a.ellipsoid('BalloonHand'+side,[320+side*108,418,.09],[14,19,.10],'#ffd1a1',side*-.2);a.paint();
  }
 }
 if(id==='fruit-grape'){
  const grape=id==='fruit-grape',colors=grape?['#8a56a0','#9d64ae','#794591']:['#d34748','#e7b943','#62a6bd','#7fae4e','#ad66a1'];egg('CostumeHood',[.64,.66,.58],grape?'#85529b':'#6d9d58',[0,1.34,0]);
  for(let i=0;i<(grape?13:8);i++){const a=i/(grape?13:8)*Math.PI*2,r=grape?.59:.70;const x=Math.sin(a)*r,y=1.78+Math.cos(a)*(grape?.52:.61),z=-.09+((i%3)-1)*.13;egg('Cluster'+i,grape?[.27,.28,.26]:[.31,.38,.29],colors[i%colors.length],[x,y,z]);}
  if(grape)tube('GrapeStem',[[0,2.34,0],[0,2.55,0],[.23,2.58,0]],.035,'#687541');
 }
 if(id==='game-dice'){
  const cube=roundedBox('DiceBody',1.58,1.58,1.58,.12,'#f4f4f4',[0,1.64,0]);
  const patterns={2:[[-.22,-.22],[.22,.22]],3:[[-.24,-.24],[0,0],[.24,.24]],4:[[-.25,-.25],[-.25,.25],[.25,-.25],[.25,.25]],5:[[-.25,-.25],[-.25,.25],[.25,-.25],[.25,.25],[0,0]],6:[[-.25,-.28],[-.25,0],[-.25,.28],[.25,-.28],[.25,0],[.25,.28]]};
  for(const [side,n] of [['rear',6],['left',4],['right',3],['top',5],['bottom',2]])for(const [i,[a,b]] of patterns[n].entries()){
   const pos=side==='rear'?[a,1.64+b,-.796]:side==='left'?[-.841,1.64+a,b]:side==='right'?[.841,1.64+a,b]:[a,side==='top'?2.481:.799,b];const dot=egg('DicePip'+side+i,[.062,.062,.012],'#35353b',pos);if(side==='left'||side==='right')dot.rotation.y=Math.PI/2;if(side==='top'||side==='bottom')dot.rotation.x=Math.PI/2;
  }
 }
 if(id==='object-eraser'){
  roundedBox('WhiteEraser',1.34,1.91,.65,.11,'#f3f3f0',[-.01,1.64,0]);roundedBox('BlueSleeve',1.40,1.235,.71,.07,'#3783be',[-.01,1.30,0]);
  roundedBox('SleeveBackLabel',.78,.24,.012,.025,'#e7eff3',[-.01,1.30,-.371]);
 }
 if(id==='object-camera'){
  roundedBox('CameraBody',1.96,1.24,.75,.12,'#454348',[0,1.36,0]);roundedBox('TopMetalBand',1.98,.19,.77,.055,'#bab5ae',[0,1.88,0]);roundedBox('LowerMetalBand',1.98,.13,.77,.045,'#a5a1a1',[0,.81,0]);
  cylinder('CameraLensBarrel',.51,.32,'#38343a',[0,1.35,.46]);ring('LensOuterRing',.51,.029,'#aaa2a1',[0,1.35,.63]);cylinder('FaceLens',.445,.03,'#77717a',[0,1.35,.63]);
  roundedBox('Viewfinder',.35,.20,.20,.04,'#2e2e33',[-.53,2.08,0]);roundedBox('FlashHousing',.36,.32,.22,.04,'#605b5e',[.64,2.16,0]);roundedBox('FlashGlass',.26,.21,.016,.02,'#eee0b3',[.64,2.16,.124]);
  roundedBox('RearScreen',1.15,.70,.035,.05,'#242a30',[-.19,1.38,-.40]);roundedBox('RearScreenGlass',.98,.54,.02,.04,'#536b76',[-.19,1.38,-.425]);for(let i=0;i<3;i++)egg('RearButton'+i,[.046,.046,.025],'#a69a96',[.64,1.18+i*.20,-.41]);
 }
 if(id==='object-boot'){
  const s=new THREE.Shape();s.moveTo(-1.0,.74);s.bezierCurveTo(-1.15,.84,-1.15,1.13,-.92,1.31);s.bezierCurveTo(-.56,1.53,-.23,1.56,-.14,1.91);s.lineTo(.08,2.43);s.quadraticCurveTo(.16,2.53,.37,2.38);s.lineTo(.75,2.34);s.lineTo(.78,.83);s.quadraticCurveTo(.1,.56,-1,.74);
  const geo=new THREE.ExtrudeGeometry(s,{depth:.64,bevelEnabled:true,bevelThickness:.09,bevelSize:.07,bevelSegments:5,curveSegments:20,steps:1});geo.translate(0,0,-.32);mesh('SneakerUpper',geo,'#bd2636',[0,0,0]);
  roundedBox('WhiteSole',1.96,.18,.88,.08,'#f1e4d7',[-.15,.73,0]);
  const toe=new THREE.Shape();toe.moveTo(-1.04,.83);toe.quadraticCurveTo(-1.14,1.05,-.99,1.25);toe.quadraticCurveTo(-.76,1.48,-.47,1.32);toe.quadraticCurveTo(-.40,1.07,-.43,.85);toe.closePath();
  const rubber=new THREE.ExtrudeGeometry(toe,{depth:.80,bevelEnabled:true,bevelThickness:.04,bevelSize:.025,bevelSegments:3,curveSegments:16,steps:1});rubber.translate(0,0,-.40);mesh('WhiteToeCap',rubber,'#f4e8db',[0,0,0]);
  const opening=egg('ShoeOpening',[.30,.025,.25],'#592632',[.43,2.38,0]);
  for(let i=0;i<4;i++){const y=1.60+i*.17,x=-.26+i*.095;const lace=k.tube('Shoelace'+i,[[x-.18-offset.x,y-offset.y,.43],[x-offset.x,y+.045-offset.y,.48],[x+.18-offset.x,y-offset.y,.43]],.024,k.solid('LaceColor','#eee1d2'),parent);}
 }
 if(id==='food-hot-dog'){
  egg('LeftBun',[.43,1.15,.47],'#e8b260',[-.33,1.40,0]);egg('RightBun',[.43,1.15,.47],'#e8b260',[.33,1.40,0]);egg('Sausage',[.30,1.22,.34],'#bc4a3a',[0,1.40,.24]);
  egg('FaceHood',[.48,.43,.21],'#e9b468',[0,1.43,.39]);
  // The condiments stop at the face opening and follow the sausage surface.
  for(const [name,lo,hi,color] of [['Mustard',.43,.96,'#efc34e'],['Ketchup',1.91,2.40,'#a62d25']]){
   const ps=[];for(let i=0;i<=32;i++){const t=i/32,y=lo+t*(hi-lo),x=Math.sin(t*Math.PI*3)*.10,z=.24+.34*Math.sqrt(Math.max(0,1-(x/.30)**2-((y-1.40)/1.22)**2))+.012;ps.push([x-offset.x,y-offset.y,z-offset.z]);}
   k.tube(name,ps,.022,k.solid(name+'Color',color),parent);
  }
 }
 if(id==='object-boot')for(const object of parent.children){if(!object.isMesh)continue;object.updateMatrix();object.geometry=object.geometry.clone().applyMatrix4(object.matrix);const p=object.geometry.attributes.position;for(let i=0;i<p.count;i++)p.setX(i,p.getX(i)*1.19+.21);object.geometry.computeVertexNormals();object.position.set(0,0,0);object.quaternion.identity();object.scale.set(1,1,1);}
 require('./visible-front-artwork.cjs')(THREE,k,parent,pivot);head.special=true;return true;
};
