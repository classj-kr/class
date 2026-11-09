"use strict";
module.exports=function trainCostume(T){
 const k=require('./model-kit.cjs')(T,'vehicle-train'),head=k.group('Head',[320,580]),s=require('./sculpt-kit.cjs')(T,k,{group:head,part:{pivot:[320,580]}}),shells=[];
 head.userData.directSurfaceArtwork=true;head.userData.artworkOcclusion=false;head.userData.artworkOpaqueRegions=[{cx:318,cy:302,rx:100,ry:84}];
 function volume(name,ps,c,depth,color,z=0){k.volume(name+'Half',ps,c,[320,580],depth,depth,head,k.solid(name+'Color',color),{art:false,samples:96,z});const P=[],I=[];for(const suffix of ['Surface','Back']){const o=head.getObjectByName(name+'Half'+suffix),n=P.length/3;P.push(...o.geometry.attributes.position.array);I.push(...Array.from(o.geometry.index.array,j=>j+n));head.remove(o);}const o=k.mesh(name,k.geometry(P,I),k.solid(name+'Color',color),head);o.userData.artworkFacingFade=[.15,.48];return o;}
 const cab=s.smoothOutline('TrainCabSolid',[[166,151],[213,122],[264,103],[318,96],[371,104],[424,123],[469,147],[470,402],[462,418],[176,418],[166,404]],1.04,'#efb85c',-.48,.022);cab.userData.artworkExcludedRegions=[{cx:318,cy:301,rx:145,ry:133}];shells.push([cab,'#653c34',.014]);
 const roof=s.smoothOutline('TrainCurvedRoofSolid',[[147,118],[196,93],[257,70],[312,61],[372,68],[429,87],[485,114],[493,129],[491,148],[477,154],[421,132],[367,116],[314,109],[258,121],[201,141],[162,157],[147,147]],1.18,'#d92a3c',-.42,.025);shells.push([roof,'#702431',.018]);
 const chassis=s.smoothOutline('TrainConnectedChassisSolid',[[181,328],[213,343],[423,342],[451,329],[470,349],[478,384],[476,490],[460,500],[174,500],[155,489],[154,378],[165,345]],.22,'#55454d',.67,.026);chassis.userData.artworkExcludedRegions=[{cx:318,cy:301,rx:145,ry:133},{cx:203,cy:419,rx:23,ry:23},{cx:430,cy:419,rx:23,ry:23}];shells.push([chassis,'#3c2e36',.016]);
 const base=s.box('TrainUnderframeSolid',[318,455,-.03],[304,90,1.60],'#493d45',10);base.userData.skipOriginalPaint=true;shells.push([base,'#342b31',.012]);
 const barrelGeometry=new T.CylinderGeometry(.685,.685,1.02,72,1,false);barrelGeometry.rotateX(Math.PI/2);barrelGeometry.scale(1,.91,1);
 const barrel=k.mesh('TrainBoilerBarrelSolid',barrelGeometry,k.solid('TrainBoilerCharcoal','#4d4449'),head,[(318-320)*.005,(580-301)*.005,.30]);barrel.userData.skipOriginalPaint=true;
 const door=volume('TrainBoilerDoorSolid',[[318,176],[365,183],[407,207],[437,243],[453,287],[450,335],[428,378],[393,408],[348,425],[300,428],[254,415],[214,389],[189,349],[178,302],[185,255],[209,215],[250,186]],[318,301],.12,'#53494d',.82);shells.push([door,'#30252c',.015]);
 const stem=s.lathe('TrainChimneyStemSolid',[[188,0,314],[188,32,314],[175,33,314],[133,39,314],[122,42,314],[120,0,314]],'#454248',.36,{levels:32,segments:64});
 const lip=s.lathe('TrainChimneyLipSolid',[[131,0,314],[131,43,314],[125,49,314],[90,49,314],[84,43,314],[84,0,314]],'#5c545a',.36,{levels:32,segments:64});shells.push([stem,'#322b2e',.012],[lip,'#322b2e',.015]);
 // The front grille has actual recessed slots, with a separate dark backing.
 const apronOutline=[[209,449],[416,449],[431,476],[448,511],[447,526],[389,544],[350,552],[318,558],[278,550],[231,540],[186,528],[183,513],[194,481]];
 function pathFrom(ps){const curve=new T.CatmullRomCurve3(ps.map(([x,y])=>new T.Vector3((x-320)*.005,(580-y)*.005,0)),true,'centripetal'),path=new T.Shape();curve.getSpacedPoints(64).slice(0,64).forEach((p,j)=>j?path.lineTo(p.x,p.y):path.moveTo(p.x,p.y));path.closePath();return path;}
 const shape=pathFrom(apronOutline);
 const leftSlots=[[[224,469],[236,470],[236,480],[223,514],[213,517],[208,511],[218,480]],[[255,470],[268,471],[268,484],[259,523],[247,524],[244,518],[250,482]],[[288,469],[300,471],[301,485],[296,529],[283,530],[279,524],[283,481]]];
 for(const side of [-1,1])for(const ps of leftSlots)shape.holes.push(pathFrom(ps.map(([x,y])=>[320+side*(320-x),y])));
 function apron(name,shape,depth,color,z){const g=new T.ExtrudeGeometry(shape,{depth,bevelEnabled:true,bevelThickness:.010,bevelSize:.007,bevelSegments:2,steps:1,curveSegments:8}),p=g.attributes.position;for(let i=0;i<p.count;i++){const y=580-p.getY(i)/.005;p.setZ(i,p.getZ(i)+z+(y-449)/109*.22);}g.computeVertexNormals();return k.mesh(name,g,k.solid(name+'Color',color),head);}
 const backing=apron('TrainGrilleRecessBackingSolid',pathFrom(apronOutline),.025,'#512731',.77),grille=apron('TrainSlottedGrilleSolid',shape,.075,'#d72c40',.805);backing.userData.skipOriginalPaint=true;shells.push([grille,'#69232f',.012]);
 for(const side of [-1,1]){
  const lamp=volume('TrainHeadlamp'+side+'Solid',k.ellipse(side<0?203:430,419,23,23),[side<0?203:430,419],.055,'#ffd277',.795);shells.push([lamp,'#582e2d',.010]);
  const guard=s.smoothOutline('TrainFrontGuard'+side+'Solid',[[204,512],[239,526],[174,575],[146,576]].map(([x,y])=>[320+side*(320-x),y]),.16,'#bb919f',.92,.009);shells.push([guard,'#4d2f38',.010]);
 }

 // The cab/chassis cap triangles must sample the window and occlusion regions;
 // an unsplit polygon only has boundary vertices and loses interior artwork.
 function refineSurface(o){const src=o.geometry,p=src.attributes.position,ix=src.index,points=[],map=new Map(),faces=[];
  const get=i=>{const q=new T.Vector3().fromBufferAttribute(p,i),key=q.toArray().map(v=>Math.round(v*1e6)).join(',');if(!map.has(key)){map.set(key,points.length);points.push(q);}return map.get(key);};
  for(let i=0;i<(ix?ix.count:p.count);i+=3){const f=[0,1,2].map(j=>get(ix?ix.getX(i+j):i+j));if(new Set(f).size===3)faces.push(f);}
  const frontZ=Math.max(...points.map(v=>v.z)),edge=(a,b)=>a<b?a+','+b:b+','+a;
  for(let pass=0;pass<8;pass++){const cuts=new Map();for(const f of faces)for(let j=0;j<3;j++){const a=f[j],b=f[(j+1)%3],key=edge(a,b);if(!cuts.has(key)&&Math.abs(points[a].z-frontZ)<1e-5&&Math.abs(points[b].z-frontZ)<1e-5&&points[a].distanceTo(points[b])>.09){cuts.set(key,points.length);points.push(points[a].clone().add(points[b]).multiplyScalar(.5));}}if(!cuts.size)break;const next=[];
   for(const f of faces){let[a,b,c]=f,ab=cuts.get(edge(a,b)),bc=cuts.get(edge(b,c)),ca=cuts.get(edge(c,a)),count=[ab,bc,ca].filter(v=>v!==undefined).length;if(!count){next.push(f);continue;}if(count===3){next.push([a,ab,ca],[ab,b,bc],[ca,bc,c],[ab,bc,ca]);continue;}if(count===1){if(bc!==undefined){[a,b,c]=[b,c,a];ab=bc;}else if(ca!==undefined){[a,b,c]=[c,a,b];ab=ca;}next.push([a,ab,c],[ab,b,c]);continue;}if(ab===undefined){[a,b,c]=[b,c,a];[ab,bc]=[bc,ca];}else if(bc===undefined){[a,b,c]=[c,a,b];[ab,bc]=[ca,ab];}next.push([b,bc,ab],[a,ab,c],[ab,bc,c]);}faces.splice(0,faces.length,...next);
  }o.geometry=k.geometry(points.flatMap(v=>v.toArray()),faces.flat());src.dispose();
 }
 refineSurface(cab);refineSurface(chassis);
 s.paint();

 function fitSideWindow(o,side,offset){o.updateMatrix();cab.updateWorldMatrix(true,false);const center=o.position.x,g=o.geometry.clone().applyMatrix4(o.matrix),p=g.attributes.position;for(let i=0;i<p.count;i++){const h=new T.Raycaster(new T.Vector3(side*5,p.getY(i),p.getZ(i)),new T.Vector3(-side,0,0)).intersectObject(cab)[0];if(!h)throw new Error('Train side window outside cab');const thickness=(p.getX(i)-center)*side;p.setX(i,h.point.x+side*(offset+thickness));}g.computeVertexNormals();o.geometry=g;o.position.set(0,0,0);}
 // Complete the cab with actual side/rear window frames and glass panes.
 for(const side of [-1,1]){
  const frame=s.box('TrainSideWindowFrame'+side,[318+side*150,204,-.50],[8,100,.70],'#6c4b3e',2);frame.userData.skipOriginalPaint=true;
  const glass=s.box('TrainSideWindowGlass'+side,[318+side*154,204,-.50],[4,83,.57],'#9bc5d8',1);glass.userData.skipOriginalPaint=true;fitSideWindow(frame,side,.008);fitSideWindow(glass,side,.028);
  const rearFrame=s.box('TrainRearWindowFrame'+side,[318+side*72,211,-.995],[110,109,.04],'#79503d',9),rearGlass=s.box('TrainRearWindowGlass'+side,[318+side*72,211,-1.021],[93,91,.016],'#9bc5d8',8);rearFrame.userData.skipOriginalPaint=rearGlass.userData.skipOriginalPaint=true;
 }
 const wheels=[],radius=.21;
 for(const side of [-1,1])for(const [label,z]of [['Rear',-.59],['Front',.46]]){
  const g=new T.Group();g.name='Wheel'+(side<0?'Left':'Right')+label;g.position.set(side*.70,(580-538)*.005,z);k.body.add(g);wheels.push(g);
  const tireGeometry=new T.CylinderGeometry(radius,radius,.14,48);tireGeometry.rotateZ(Math.PI/2);k.mesh(g.name+'TireSolid',tireGeometry,k.solid('TrainTire','#352e34'),g);
  const diskGeometry=new T.CylinderGeometry(.145,.145,.015,48);diskGeometry.rotateZ(Math.PI/2);k.mesh(g.name+'RedDiskSolid',diskGeometry,k.solid('TrainWheelRed','#c33948'),g,[side*.078,0,0]);
  const hubGeometry=new T.CylinderGeometry(.035,.035,.035,24);hubGeometry.rotateZ(Math.PI/2);k.mesh(g.name+'HubSolid',hubGeometry,k.solid('TrainHub','#aa818d'),g,[side*.088,0,0]);
  for(let j=0;j<8;j++){const a=j/8*Math.PI*2;k.tube(g.name+'Spoke'+j,[[side*.088,Math.cos(a)*.045,Math.sin(a)*.045],[side*.088,Math.cos(a)*.128,Math.sin(a)*.128]],.008,k.solid('TrainSpoke','#e28b91'),g);}
 }
 // Axles physically join the wheels to the chassis.
 for(const [label,z]of [['Rear',-.59],['Front',.46]]){const g=new T.CylinderGeometry(.045,.045,1.40,24);g.rotateZ(Math.PI/2);k.mesh('Train'+label+'AxleSolid',g,k.solid('TrainAxle','#3b3038'),head,[0,(580-538)*.005,z]);const bracket=s.box('Train'+label+'AxleMountSolid',[320,513,z],[84,60,.18],'#493940',5);bracket.userData.skipOriginalPaint=true;}
 for(const[o,color,width]of shells){o.updateMatrix();const g=o.geometry.clone().applyMatrix4(o.matrix),p=g.attributes.position,b=new T.Box3().setFromBufferAttribute(p),c=b.getCenter(new T.Vector3()),f=1+width/(b.getSize(new T.Vector3()).length()/2),ix=g.index?Array.from(g.index.array):Array.from({length:p.count},(_,i)=>i);for(let i=0;i<p.count;i++)p.setXYZ(i,c.x+(p.getX(i)-c.x)*f,c.y+(p.getY(i)-c.y)*f,c.z+(p.getZ(i)-c.z)*f);for(let i=0;i<ix.length;i+=3)[ix[i+1],ix[i+2]]=[ix[i+2],ix[i+1]];g.setIndex(ix);g.computeVertexNormals();const ink=k.mesh(o.name+'InkShell',g,k.solid(o.name+'Ink',color),head);ink.material.userData.alreadyShaded=true;}
 k.root.updateMatrixWorld(true);k.root.position.y-=new T.Box3().setFromObject(k.root).min.y;require('./illustration-materials.cjs')(T,k.root);
 const clips=[],times=Array.from({length:49},(_,i)=>i/48*2);for(const name of ['Idle','Walk','Wave']){const tracks=[new T.VectorKeyframeTrack('Body.position',times,Array(times.length*3).fill(0))];if(name==='Walk')for(const wheel of wheels){const values=[];for(let i=0;i<49;i++)values.push(...new T.Quaternion().setFromAxisAngle(new T.Vector3(1,0,0),i/48*Math.PI*2).toArray());tracks.push(new T.QuaternionKeyframeTrack(wheel.name+'.quaternion',times,values));}clips.push(new T.AnimationClip(name,2,tracks));}
 Object.assign(k.root.userData,{avatarKey:'vehicle-train.webp',prototype:true,locomotion:'roll',canWave:false,walkStride:Math.PI*2*radius,walkDuration:2,authoring:'Source-shaped arched roof, fitted boiler face, connected cab and chassis, recessed grille and rolling wheels'});return{root:k.root,clips};
};
