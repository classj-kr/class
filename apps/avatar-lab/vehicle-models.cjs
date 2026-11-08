"use strict";
// Individually built vehicle volumes. No image-alpha inflation is used here.
module.exports=function vehicle(THREE,id){
 const k=require('./model-kit.cjs')(THREE,id),head=k.group('Head',[320,580]),white='#f3ece2',red='#ca293c',gold='#efb448',dark='#4c4247';
 const material=(name,color)=>k.solid(name,color);
 function mesh(name,geo,color,pos,parent=head){return k.mesh(name,geo,material(name+'Color',color),parent,pos);}
 function egg(name,size,color,pos,parent=head){const small=Math.max(...size)<.20;const m=mesh(name,new THREE.SphereGeometry(1,small?16:40,small?10:24),color,pos,parent);m.scale.set(...size);return m;}
 function cylinder(name,top,bottom,h,color,pos,parent=head){return mesh(name,new THREE.CylinderGeometry(top,bottom,h,64),color,pos,parent);}
 function box(name,size,color,pos,parent=head){return mesh(name,new THREE.BoxGeometry(...size),color,pos,parent);}
 function lathe(name,profile,color,parent=head){return mesh(name,new THREE.LatheGeometry(profile.map(p=>new THREE.Vector2(...p)),96),color,[0,0,0],parent);}
 function ring(name,r,t,color,pos,axis='z',parent=head){const m=mesh(name,new THREE.TorusGeometry(r,t,10,64),color,pos,parent);if(axis==='y')m.rotation.x=Math.PI/2;if(axis==='x')m.rotation.y=Math.PI/2;return m;}
 function tube(name,points,r,color,parent=head){return k.tube(name,points,r,material(name+'Color',color),parent);}
 function face(cx,cy,rx,ry,target){return k.projectArtwork('OriginalFace',k.ellipse(cx,cy,rx,ry),[cx,cy],[320,580],head,target);}
 function feet(color,spacing=.19,hipY=.23){
  for(const [name,sign] of [['LeftLeg',-1],['RightLeg',1]]){const g=k.group(name,[320+sign*spacing/ .005,580-hipY/.005]);egg(name+'Boot',[.13,.145,.18],color,[0,-.09,.035],g);}
  for(const [name,sign] of [['LeftArm',-1],['RightArm',1]]){const g=k.group(name,[320+sign*.37/.005,490]);egg(name+'Mitten',[.105,.17,.12],color,[0,-.08,0],g);}
  const t=k.group('Torso',[320,490]);egg('TorsoSuit',[.25,.23,.22],color,[0,0,0],t);
 }
 let walk=false,rotors=[];
 if(id==='vehicle-hot-air-balloon'){
  const profile=[[0,.75],[.27,.75],[.39,.91],[.60,1.22],[.81,1.61],[.90,1.96],[.85,2.22],[.64,2.45],[.31,2.58],[0,2.61]];
  const curve=new THREE.CatmullRomCurve3(profile.map(([r,y])=>new THREE.Vector3(r,y,0))),smooth=curve.getPoints(72).map(p=>[Math.max(0,p.x),p.y]);
  const balloon=lathe('BalloonEnvelope',smooth,'#ffffff');balloon.geometry=balloon.geometry.toNonIndexed();const p=balloon.geometry.attributes.position,colors=[];
  for(let i=0;i<p.count;i+=3){const x=(p.getX(i)+p.getX(i+1)+p.getX(i+2))/3,z=(p.getZ(i)+p.getZ(i+1)+p.getZ(i+2))/3,a=Math.atan2(x,z),band=Math.floor((a+Math.PI/8)/(Math.PI/4)),c=new THREE.Color(band%2===0?'#d83040':'#fff0d9').convertSRGBToLinear();for(let j=0;j<3;j++)colors.push(c.r,c.g,c.b);}
  balloon.geometry.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));balloon.material.userData.preserveVertexColor=true;
  for(let i=0;i<8;i++){const a=(i+.5)*Math.PI/4;tube('BalloonGore'+i,smooth.slice(2,-2).map(([r,y])=>[Math.sin(a)*(r+.010),y,Math.cos(a)*(r+.010)]),.006,'#a64843');}
  face(320,300,102,79,balloon);
  const basket=lathe('Basket',[[0,.16],[.27,.16],[.36,.51],[.36,.56],[.31,.56],[.24,.21],[0,.21],[0,.16]],'#bc805b');ring('BasketRim',.345,.038,'#7a4b37',[0,.55,0],'y');
  cylinder('BasketNeck',.28,.31,.22,'#dba452',[0,.66,0]);
  for(let i=0;i<14;i++)for(const sign of [-1,1]){const ps=[];for(let n=0;n<=16;n++){const t=n/16,y=.19+t*.32,r=.28+.075*t,a=i/14*Math.PI*2+sign*t*.65;ps.push([Math.sin(a)*r,y,Math.cos(a)*r]);}tube('BasketWeave'+i+'_'+sign,ps,.006,'#946044');}
  for(let i=0;i<4;i++){const a=Math.PI/4+i*Math.PI/2;tube('SuspensionRope'+i,[[Math.sin(a)*.33,.53,Math.cos(a)*.33],[Math.sin(a)*.27,.81,Math.cos(a)*.27]],.017,'#704c3c');}
  feet('#b98065',.18,.19);walk=true;
 }
 if(id==='vehicle-rocket'){
  const hull=lathe('RocketHull',[[0,.35],[.35,.35],[.48,.48],[.59,.77],[.67,1.21],[.65,1.65],[.54,2.08],[0,2.08],[0,.35]],'#f0edf0');
  lathe('RocketNose',[[0,2.07],[.54,2.07],[.47,2.20],[.34,2.39],[.13,2.56],[0,2.61],[0,2.07]],red);
  ring('NoseSeam',.535,.017,'#913443',[0,2.075,0],'y');ring('LowerBlueBand',.49,.047,'#477293',[0,.51,0],'y');ring('UpperBlueBand',.56,.042,'#729ab5',[0,.68,0],'y');
  face(319,292,105,83,hull);
  for(let i=0;i<4;i++){
   const shape=new THREE.Shape();shape.moveTo(.47,.88);shape.bezierCurveTo(.69,1.19,.84,1.10,.91,.91);shape.bezierCurveTo(1.01,.65,.99,.33,.88,.30);shape.bezierCurveTo(.80,.49,.65,.60,.49,.56);shape.closePath();
   const geo=new THREE.ExtrudeGeometry(shape,{depth:.08,bevelEnabled:true,bevelThickness:.035,bevelSize:.035,bevelSegments:3,steps:1,curveSegments:16});geo.translate(0,0,-.04);
   const fin=mesh('RocketFin'+i,geo,red,[0,0,0]);fin.rotation.y=i*Math.PI/2;if(i%2){fin.scale.y=.78;fin.position.y=.07;}
  }
  cylinder('Nozzle',.29,.22,.20,dark,[0,.29,0]);
  lathe('OuterFlame',[[0,-.02],[.12,.08],[.24,.25],[.20,.34],[0,.34],[0,-.02]],'#ee8c37');lathe('InnerFlame',[[0,.0],[.07,.10],[.13,.25],[0,.27],[0,0]],'#ffe083');
 }
 if(id==='vehicle-submarine'){
  const hull=egg('SubmarineHull',[1.24,.77,.70],gold,[-.02,1.15,0]);
  const P=[],I=[],rim=[];for(let row=0;row<=12;row++)for(let i=0;i<64;i++){const t=row/12,a=i/64*Math.PI*2,y=.48*Math.cos(a)*t,z=.43*Math.sin(a)*t,x=-.02-1.24*Math.sqrt(Math.max(0,1-(y/.77)**2-(z/.70)**2))-.008;P.push(x,1.15+y,z);if(row===12)rim.push([x-.008,1.15+y,z]);}
  for(let row=0;row<12;row++)for(let i=0;i<64;i++){const a=row*64+i,b=row*64+(i+1)%64,c=a+64,d=b+64;if(row)I.push(a,d,b);I.push(a,c,d);}const glassGeo=k.geometry(P,I);if(glassGeo.attributes.normal.getX(192)>0){for(let i=0;i<I.length;i+=3)[I[i+1],I[i+2]]=[I[i+2],I[i+1]];glassGeo.setIndex(I);glassGeo.computeVertexNormals();}mesh('BlueBowWindow',glassGeo,'#9ec8d4',[0,0,0]);rim.push(rim[0]);tube('BowWindowRim',rim,.018,'#8d6040');
  // Side portholes have real depth and matching rims on the other side.
  const portX=-.33,portY=1.15;
  for(const sign of [-1,1]){
   const glass=egg(sign===1?'FaceWindow':'RearWindow',[.47,.49,.075],sign===1?'#e1b888':'#9ec8d4',[portX,portY,sign*.66]);ring('PortholeRim'+sign,.485,.044,'#a78e88',[portX,portY,sign*.70]);
   for(let i=0;i<10;i++){const a=i/10*Math.PI*2;egg('Rivet'+sign+'_'+i,[.018,.018,.016],dark,[portX+Math.cos(a)*.487,portY+Math.sin(a)*.487,sign*.747]);}
   ring('SmallWindowRim'+sign,.20,.028,'#785441',[.57,1.13,sign*.58]);egg('SmallWindow'+sign,[.18,.18,.055],'#9fcddc',[.57,1.13,sign*.59]);
   if(sign===1)face(254,345,86,82,glass);
  }
  cylinder('ConningTower',.29,.36,.23,gold,[-.14,1.94,0]);
  tube('Periscope',[[-.13,2.04,0],[-.13,2.37,0],[-.26,2.47,0],[-.39,2.47,0]],.075,'#e4aa46');const opening=cylinder('PeriscopeLens',.061,.061,.014,'#c4dfdc',[-.40,2.47,0]);opening.rotation.z=Math.PI/2;
  for(const y of [.74,1.60]){const fin=box('TailFin'+y,[.30,.37,.09],'#e4a13d',[1.05,y,0]);fin.rotation.z=y<1?-.25:.25;}
  const prop=new THREE.Group();prop.name='Propeller';prop.position.set(1.30,1.14,0);head.add(prop);const axle=cylinder('PropellerAxle',.055,.055,.24,'#855b44',[0,0,0],prop);axle.rotation.z=Math.PI/2;
  for(let i=0;i<3;i++){const a=i*Math.PI*2/3;const blade=egg('PropellerBlade'+i,[.035,.19,.065],'#8f6257',[0,Math.cos(a)*.17,Math.sin(a)*.17],prop);blade.rotation.x=a;}rotors.push(['Propeller','x']);
  feet('#dca143',.18,.28);walk=true;
 }
 if(id==='vehicle-train'){
  // The illustrated face is the front of a cylindrical boiler; its length is
  // visible from both sides, with a cab, roof and four actual wheels behind it.
  box('Chassis',[1.47,.25,1.74],dark,[0,.39,0]);
  const boiler=cylinder('Boiler',.61,.61,1.20,'#51494d',[0,1.28,.24]);boiler.rotation.x=Math.PI/2;
  const front=egg('BoilerDoor',[.59,.59,.10],'#62565e',[0,1.28,.88]);ring('BoilerDoorRim',.59,.036,'#282b2d',[0,1.28,.93]);
  face(319,304,105,85,front);
  box('Cab',[1.37,1.35,.69],'#efbc66',[0,1.32,-.54]);
  const roof=egg('CabRoof',[.88,.14,.57],red,[0,2.06,-.53]);
  for(const sign of [-1,1]){box('SideWindow'+sign,[.018,.43,.40],'#9ec6d7',[sign*.694,1.66,-.55]);box('SideWindowLowerFrame'+sign,[.035,.028,.43],'#795e4d',[sign*.702,1.43,-.55]);box('RearWindow'+sign,[.44,.40,.018],'#a8c9d5',[sign*.34,1.67,-.891]);}
  cylinder('Chimney',.18,.14,.46,'#494347',[0,1.98,.25]);cylinder('ChimneyLip',.22,.22,.09,'#625a61',[0,2.24,.25]);
  for(const sign of [-1,1]){egg('Headlamp'+sign,[.11,.11,.06],'#ffe09b',[sign*.57,.71,.93]);for(const z of [-.55,.48]){const wheel=new THREE.Group();wheel.name='Wheel'+(sign<0?'Left':'Right')+(z<0?'Rear':'Front');wheel.position.set(sign*.72,.27,z);k.body.add(wheel);const disk=cylinder(wheel.name+'Tire',.255,.255,.13,'#3f3b42',[0,0,0],wheel);disk.rotation.z=Math.PI/2;ring(wheel.name+'Rim',.19,.023,red,[sign*.075,0,0],'x',wheel);const hub=cylinder(wheel.name+'Hub',.055,.055,.15,'#b3a1a0',[0,0,0],wheel);hub.rotation.z=Math.PI/2;for(let j=0;j<6;j++){const a=j*Math.PI/3;const spoke=box(wheel.name+'Spoke'+j,[.025,.32,.025],red,[sign*.08,0,0],wheel);spoke.rotation.x=a;}rotors.push([wheel.name,'x']);}}
  for(let i=0;i<9;i++){const bar=box('CowcatcherBar'+i,[.055,.36,.065],red,[(i-4)*.13,.30,1.0+Math.abs(i-4)*-.02]);bar.rotation.x=-.45;bar.rotation.z=(i-4)*-.035;}
  box('CowcatcherLowerBar',[1.28,.08,.10],red,[0,.14,1.09]);
 }
 if(id==='vehicle-hot-air-balloon'||id==='vehicle-rocket')require('./visible-front-artwork.cjs')(THREE,k,head,[320,580]);
 let result;
 if(walk)result=k.finish({holdLeft:true,authoring:'Individually built volumetric vehicle with original face projected onto its real surface'});
 else{
  k.root.updateMatrixWorld(true);k.root.position.y-=new THREE.Box3().setFromObject(k.root).min.y;
  const times=Array.from({length:49},(_,i)=>i/48*2),clips=[];
  for(const name of ['Idle','Walk','Wave']){const values=[];for(let i=0;i<49;i++){const a=i/48*Math.PI*2;values.push(0,id==='vehicle-rocket'?.04+.025*(1-Math.cos(a)):0,0);}clips.push(new THREE.AnimationClip(name,2,[new THREE.VectorKeyframeTrack('Body.position',times,values)]));}
  require('./illustration-materials.cjs')(THREE,k.root);result={root:k.root,clips};k.root.userData={walkStride:.55,walkDuration:2};
 }
 for(const clip of result.clips)if(clip.name==='Walk')for(const [name,axis] of rotors){const times=Array.from({length:49},(_,i)=>i/48*clip.duration),values=[];for(let i=0;i<49;i++){const a=-i/48*Math.PI*2;values.push(...new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(axis==='x'?1:0,axis==='y'?1:0,axis==='z'?1:0),a).toArray());}clip.tracks.push(new THREE.QuaternionKeyframeTrack(name+'.quaternion',times,values));}
 Object.assign(result.root.userData,{avatarKey:id+'.webp',prototype:true,structure:'separate volumetric vehicle components',locomotion:walk?'walk':id==='vehicle-rocket'?'float':'roll',canWave:false});return result;
};
