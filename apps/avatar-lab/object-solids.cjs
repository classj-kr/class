"use strict";
module.exports=function objects(THREE,k,id,head){
 const supported=['game-dice','object-boot','object-camera','object-eraser','food-hot-dog','object-gift','object-lock','object-pencil','object-radio','object-television','object-watch','food-popcorn','food-sushi','food-cheese','food-chocolate','fruit-grape','theme-balloons'];if(!supported.includes(id))return false;
 const parent=head.group;parent.clear();const pivot=head.part.pivot,offset=parent.position.clone();
 const local=p=>p.map((v,i)=>v-offset.getComponent(i));
 function mesh(n,g,c,p){return k.mesh(n,g,k.solid(n+'Color',c),parent,local(p));}
 function egg(n,size,c,p){const small=Math.max(...size)<.20;const m=mesh(n,new THREE.SphereGeometry(1,small?16:32,small?10:20),c,p);m.scale.set(...size);return m;}
 function roundedBox(n,w,h,d,r,c,p){
  const shape=new THREE.Shape();const x=-w/2+r,y=-h/2+r;shape.moveTo(x,-h/2);shape.lineTo(w/2-r,-h/2);shape.quadraticCurveTo(w/2,-h/2,w/2,y);shape.lineTo(w/2,h/2-r);shape.quadraticCurveTo(w/2,h/2,w/2-r,h/2);shape.lineTo(x,h/2);shape.quadraticCurveTo(-w/2,h/2,-w/2,h/2-r);shape.lineTo(-w/2,y);shape.quadraticCurveTo(-w/2,-h/2,x,-h/2);
  const geo=new THREE.ExtrudeGeometry(shape,{depth:d-2*r,bevelEnabled:true,bevelThickness:r,bevelSize:r*.35,bevelSegments:4,curveSegments:12,steps:1});geo.translate(0,0,-d/2+r);return mesh(n,geo,c,p);
 }
 function cylinder(n,r,h,c,p,axis='z'){const o=mesh(n,new THREE.CylinderGeometry(r,r,h,64),c,p);if(axis==='z')o.rotation.x=Math.PI/2;return o;}
 function ring(n,r,t,c,p){return mesh(n,new THREE.TorusGeometry(r,t,10,64),c,p);}
 function lathe(n,ps,c,p=[0,0,0]){return mesh(n,new THREE.LatheGeometry(ps.map(v=>new THREE.Vector2(...v)),64),c,p);}
 function tube(n,ps,r,c){return k.tube(n,ps.map(local),r,k.solid(n+'Color',c),parent);}
 if(id==='object-gift'){
  roundedBox('GiftBox',1.55,1.20,1.40,.055,'#efb947',[0,1.30,0]);roundedBox('GiftLid',1.68,.23,1.52,.045,'#f4c253',[0,1.96,0]);
  roundedBox('VerticalRibbon',.21,1.48,1.55,.015,'#bc3541',[0,1.40,0]);roundedBox('CrossRibbon',1.70,1.48,.21,.015,'#bc3541',[0,1.40,0]);
  for(const side of [-1,1]){const loop=ring('BowLoop'+side,.22,.065,'#c42d40',[side*.27,2.29,0]);loop.scale.set(1.16,.73,1);loop.rotation.z=side*.45;}egg('BowKnot',[.14,.12,.12],'#a52939',[0,2.23,.02]);
 }
 if(id==='object-lock'){
  roundedBox('LockBody',1.42,1.14,.76,.13,'#edb747',[0,1.27,0]);
  tube('MetalShackle',[[-.43,1.73,0],[-.43,2.24,0],[-.30,2.49,0],[0,2.57,0],[.30,2.49,0],[.43,2.24,0],[.43,1.73,0]],.095,'#b4ada5');
  cylinder('RearKeyHole',.08,.02,'#7a5d38',[0,1.26,-.40]);
 }
 if(id==='object-pencil'){
  const pencil=mesh('HexagonalPencil',new THREE.CylinderGeometry(.48,.48,1.64,6), '#e7ac43',[0,1.31,0]);pencil.rotation.y=Math.PI/6;
  mesh('WoodTip',new THREE.ConeGeometry(.48,.55,6),'#eac5a1',[0,2.405,0]);mesh('GraphiteTip',new THREE.ConeGeometry(.13,.17,6),'#49454e',[0,2.615,0]);
  cylinder('MetalFerrule',.48,.16,'#a6c7d5',[0,.47,0],'y');cylinder('PinkEraser',.47,.24,'#d68a98',[0,.27,0],'y');
 }
 if(id==='object-radio'||id==='object-television'){
  const tv=id==='object-television',w=tv?1.68:2.19,h=tv?1.35:1.06,cy=tv?1.45:1.32;
  roundedBox('ElectronicCase',w,h,.75,.13,tv?'#655169':'#dda14e',[0,cy,0]);roundedBox('RearCover',w-.20,h-.20,.025,.06,'#49414b',[0,cy,-.396]);
  for(let i=0;i<8;i++)roundedBox('RearVent'+i,.018,h*.38,.01,.004,'#25262c',[(i-3.5)*.065,cy,-.417]);
  if(tv){roundedBox('ScreenFrame',1.20,.95,.07,.13,'#353d4b',[-.12,cy,.40]);roundedBox('ScreenGlass',1.03,.79,.035,.12,'#85a6b0',[-.12,cy,.45]);for(const y of [1.65,1.31])cylinder('TVKnob'+y,.065,.07,'#a2979f',[.65,y,.44]);tube('AntennaLeft',[[0,2.12,0],[-.32,2.53,0]],.022,'#40353e');tube('AntennaRight',[[0,2.12,0],[.30,2.45,0]],.022,'#40353e');}
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
  egg('Rice',[.80,.63,.66],'#faf6e6',[0,1.32,0]);egg('SalmonFillet',[1.00,.34,.72],'#dc805b',[0,2.22,0]);
  for(let i=-3;i<=3;i++){const x=i*.22,ps=[];for(let j=0;j<=24;j++){const a=j/24*Math.PI*2;ps.push([x+.035*Math.sin(a*2),2.22+.343*Math.sqrt(1-x*x)*Math.cos(a),.725*Math.sqrt(1-x*x)*Math.sin(a)]);}tube('SalmonFat'+i,ps,.012,'#f1c5a4');}
 }
 if(id==='food-cheese'){
  const s=new THREE.Shape();s.moveTo(-.78,.78);s.lineTo(.78,.78);s.lineTo(.78,2.15);s.lineTo(.17,2.55);s.lineTo(-.78,2.18);s.closePath();const geo=new THREE.ExtrudeGeometry(s,{depth:1.10,bevelEnabled:true,bevelThickness:.065,bevelSize:.045,bevelSegments:3,steps:1});geo.translate(0,0,-.55);mesh('CheeseWedge',geo,'#edbc46',[0,0,0]);
  for(const [i,x,y,r] of [[0,-.45,1.96,.12],[1,.36,1.68,.09],[2,-.26,1.12,.08],[3,.42,2.12,.10]])egg('CheeseDimple'+i,[r,r*.8,.014],'#d49c34',[x,y,-.621]);
 }
 if(id==='food-chocolate'){
  roundedBox('ChocolateBar',1.39,1.85,.38,.07,'#8a5138',[0,1.66,0]);roundedBox('RedWrapper',1.43,1.21,.43,.045,'#b94438',[0,1.30,0]);
  for(let side of [-1,1])for(let col=0;col<3;col++)for(let row=0;row<2;row++)roundedBox('ChocolateTile'+side+'_'+row+'_'+col,.40,.29,.035,.026,'#92563a',[(col-1)*.44,2.12+row*.32,side*.213]);
 }
 if(id==='fruit-grape'||id==='theme-balloons'){
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
  roundedBox('WhiteEraser',.98,1.88,.53,.11,'#f3f3f0',[0,1.67,0]);roundedBox('BlueSleeve',1.05,1.10,.59,.07,'#3783be',[0,1.26,0]);
  roundedBox('SleeveBackLabel',.59,.24,.012,.025,'#e7eff3',[0,1.30,-.312]);
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
  const ps=[];for(let i=0;i<=60;i++){const y=.47+i/60*1.93;ps.push([Math.sin(i/60*Math.PI*7)*.10-offset.x,y-offset.y,.59]);}k.tube('Mustard',ps,.022,k.solid('MustardColor','#e9bb49'),parent);
 }
 if(id==='object-boot')for(const object of parent.children){if(!object.isMesh)continue;object.updateMatrix();object.geometry=object.geometry.clone().applyMatrix4(object.matrix);const p=object.geometry.attributes.position;for(let i=0;i<p.count;i++)p.setX(i,p.getX(i)*1.19+.21);object.geometry.computeVertexNormals();object.position.set(0,0,0);object.quaternion.identity();object.scale.set(1,1,1);}
 require('./project-model-artwork.cjs')(THREE,k,parent,pivot);head.special=true;return true;
};
