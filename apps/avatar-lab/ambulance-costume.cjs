"use strict";
module.exports=function ambulanceCostume(T){
 const k=require('./model-kit.cjs')(T,'vehicle-ambulance'),sculpt=require('./sculpt-kit.cjs'),shells=[],tools=[];
 function part(name,pivot){const group=k.group(name,pivot),s=sculpt(T,k,{group,part:{pivot}});group.userData.directSurfaceArtwork=true;group.userData.artworkOcclusion=true;tools.push(s);return s;}
 function volume(s,name,ps,c,depth,color,z=0){k.volume(name+'Half',ps,c,s.pivot,depth,depth,s.parent,k.solid(name+'Color',color),{art:false,z,samples:64});require('./smooth-paired-volume.cjs')(T,k,s.parent,name+'Half',{rings:24});const P=[],I=[];for(const suffix of ['Surface','Back']){const o=s.parent.getObjectByName(name+'Half'+suffix),n=P.length/3;P.push(...o.geometry.attributes.position.array);I.push(...Array.from(o.geometry.index.array,j=>j+n));s.parent.remove(o);}const o=k.mesh(name,k.geometry(P,I),k.solid(name+'Color',color),s.parent);o.userData.artworkFacingFade=[.18,.55];o.userData.sourceContour=ps;shells.push([o,s]);return o;}
 const head=part('Head',[320,580]),white='#f7f4f7',red='#f02c36',dark='#49434b';head.parent.userData.artworkOpaqueRegions=[{cx:332,cy:294,rx:115,ry:87}];
 const outline=[[173,233],[173,175],[180,151],[194,134],[215,128],[250,128],[300,128],[350,128],[400,128],[450,128],[500,128],[552,128],[574,135],[592,153],[598,175],[598,449],[594,470],[580,478],[540,478],[480,478],[420,478],[360,478],[300,478],[240,478],[180,478],[120,478],[60,478],[44,469],[41,451],[43,395],[49,373],[74,347],[92,302],[116,260],[138,238]];
 const hull=head.outline('AmbulanceVehicleBodySolid',new T.CatmullRomCurve3(outline.map(([x,y])=>new T.Vector3(x,y,0)),true,'centripetal').getSpacedPoints(128).slice(0,128).map(p=>[p.x,p.y]),1.12,white,0,.025);hull.userData.artworkExcludedRegions=[{cx:333,cy:456,rx:108,ry:67}];hull.userData.artworkFacingFade=[.18,.5];hull.userData.sourceContour=outline;shells.push([hull,head]);
 function refineSurface(o){const src=o.geometry,p=src.attributes.position,ix=src.index,points=[],map=new Map(),faces=[];
  const get=i=>{const q=new T.Vector3().fromBufferAttribute(p,i),key=q.toArray().map(v=>Math.round(v*1e6)).join(',');if(!map.has(key)){map.set(key,points.length);points.push(q);}return map.get(key);};
  for(let i=0;i<(ix?ix.count:p.count);i+=3){const f=[0,1,2].map(j=>get(ix?ix.getX(i+j):i+j));if(new Set(f).size===3)faces.push(f);}
  const frontZ=Math.max(...points.map(v=>v.z)),edge=(a,b)=>a<b?a+','+b:b+','+a;
  for(let pass=0;pass<8;pass++){const cuts=new Map();for(const f of faces)for(let j=0;j<3;j++){const a=f[j],b=f[(j+1)%3],key=edge(a,b);if(!cuts.has(key)&&Math.abs(points[a].z-frontZ)<1e-5&&Math.abs(points[b].z-frontZ)<1e-5&&points[a].distanceTo(points[b])>.09){cuts.set(key,points.length);points.push(points[a].clone().add(points[b]).multiplyScalar(.5));}}if(!cuts.size)break;const next=[];
   for(const f of faces){let[a,b,c]=f,ab=cuts.get(edge(a,b)),bc=cuts.get(edge(b,c)),ca=cuts.get(edge(c,a)),count=[ab,bc,ca].filter(v=>v!==undefined).length;if(!count){next.push(f);continue;}if(count===3){next.push([a,ab,ca],[ab,b,bc],[ca,bc,c],[ab,bc,ca]);continue;}if(count===1){if(bc!==undefined){[a,b,c]=[b,c,a];ab=bc;}else if(ca!==undefined){[a,b,c]=[c,a,b];ab=ca;}next.push([a,ab,c],[ab,b,c]);continue;}if(ab===undefined){[a,b,c]=[b,c,a];[ab,bc]=[bc,ca];}else if(bc===undefined){[a,b,c]=[c,a,b];[ab,bc]=[ca,ab];}next.push([b,bc,ab],[a,ab,c],[ab,bc,c]);}faces.splice(0,faces.length,...next);
  }o.geometry=k.geometry(points.flatMap(v=>v.toArray()),faces.flat());src.dispose();
 }
 refineSurface(hull);
 const window=head.box('AmbulanceFaceWindowSolid',[332,296,.573],[268,208,.075],'#80c9ed',26);shells.push([window,head]);
 const beacon=head.lathe('AmbulanceBeaconSolid',[[132,0,336],[132,28,336],[123,28,336],[103,23,336],[89,14,336],[84,0,336]],red,0,{levels:40,segments:48});shells.push([beacon,head]);
 const base=head.box('AmbulanceBeaconBaseSolid',[336,126,0],[63,12,.34],'#b92734',5);shells.push([base,head]);
 // Four real tires, including the hidden side, are part of the costume.
 // The short human feet below them provide this avatar's walking motion.
 for(const side of [-1,1])for(const x of [150,505]){
  const points=[[0,-.11],[.23,-.11],[.265,-.08],[.27,0],[.265,.08],[.23,.11],[0,.11]].map(([r,z])=>new T.Vector2(r,z)),g=new T.LatheGeometry(points,48);g.rotateX(Math.PI/2);
  const tire=k.mesh('AmbulanceWheel'+x+'_'+side+'Solid',g,k.solid('AmbulanceTire',dark),head.parent,[(x-320)*.005,(580-470)*.005,side*.56]);shells.push([tire,head]);
  if(side<0){tire.userData.skipOriginalPaint=true;const hub=head.ellipsoid('AmbulanceRearHub'+x,[x,470,-.68],[25,25,.025],'#c1c0c9');hub.userData.skipOriginalPaint=true;}
 }
 for(const x of [150,505]){const g=new T.CylinderGeometry(.035,.035,1.18,24);g.rotateX(Math.PI/2);const axle=k.mesh('AmbulanceAxle'+x+'Solid',g,k.solid('AmbulanceAxle',dark),head.parent,[(x-320)*.005,(580-470)*.005,0]);axle.userData.skipOriginalPaint=true;}
 volume(head,'AmbulanceCabRoofLampSolid',[[133,241],[143,220],[153,203],[162,198],[173,202],[176,215],[176,242]],[158,224],.14,red);head.paint();hull.updateWorldMatrix(true,false);
 // Fit front windshield and rear doors to the vehicle's real X-facing walls.
 function endPanel(name,side,y0,y1,z0,z1,color,offset=.009){const P=[],I=[],U=18,V=12;for(let row=0;row<=V;row++)for(let col=0;col<=U;col++){const y=y0+(y1-y0)*row/V,z=z0+(z1-z0)*col/U,hit=new T.Raycaster(new T.Vector3(side*5,(580-y)*.005,Math.abs(z)<1e-8?1e-6:z),new T.Vector3(-side,0,0)).intersectObject(hull)[0];if(!hit)throw new Error(name+' lies outside vehicle '+y+','+z);P.push(hit.point.x+side*offset,hit.point.y,hit.point.z);}for(let row=0;row<V;row++)for(let col=0;col<U;col++){const a=row*(U+1)+col,b=a+1,c=a+U+1,d=c+1;side>0?I.push(a,b,d,a,d,c):I.push(a,d,b,a,c,d);}const o=k.mesh(name,k.geometry(P,I),k.solid(name+'Color',color),head.parent);o.userData.skipOriginalPaint=true;return o;}
 endPanel('AmbulanceFrontWindshieldFrame',-1,248,346,-.34,.34,'#4d4148');endPanel('AmbulanceFrontWindshield',-1,255,337,-.30,.30,'#8fcbe8',.012);
 endPanel('AmbulanceFrontRedStripe',-1,378,401,-.43,.43,red);
 endPanel('AmbulanceFrontGrille',-1,422,440,-.24,.24,'#8c8794');
 for(const side of [-1,1]){endPanel('AmbulanceRearDoor'+side,1,177,445,side<0?-.43:.015,side<0?-.015:.43,'#d7d4dc');endPanel('AmbulanceRearDoorInner'+side,1,181,440,side<0?-.415:.025,side<0?-.025:.415,white,.012);endPanel('AmbulanceRearDoorWindow'+side,1,196,291,side<0?-.37:.06,side<0?-.06:.37,'#95c9e1',.015);}
 endPanel('AmbulanceRearRedStripe',1,379,403,-.43,.43,red,.018);
 // The opposite side has a patient window and medical cross, not a second face.
 const rearWindow=head.box('AmbulanceOppositeWindowSolid',[332,280,-.573],[268,175,.075],'#8fcbe8',23);rearWindow.userData.skipOriginalPaint=true;
 for(const[name,p,size]of [['Vertical',[525,282,-.579],[28,82,.045]],['Horizontal',[525,282,-.579],[81,28,.045]]]){const cross=head.box('AmbulanceRearCross'+name+'Solid',p,size,red,2);cross.userData.skipOriginalPaint=true;}
 const stripe=head.box('AmbulanceOppositeStripeSolid',[324,391,-.565],[534,27,.045],red,2);stripe.userData.skipOriginalPaint=true;
 const torso=part('Torso',[332,450]);volume(torso,'AmbulanceShortJacketSolid',[[275,408],[298,405],[332,409],[368,405],[389,413],[397,444],[397,475],[375,487],[292,487],[269,477],[264,449]],[332,450],.26,white,.67);volume(torso,'AmbulanceShortHipsSolid',k.ellipse(332,491,57,20),[332,491],.19,white,.67);torso.paint();
 for(const side of [-1,1]){
  const x=v=>side<0?v:665-v,arm=part(side<0?'LeftArm':'RightArm',[x(271),427]);
  volume(arm,'AmbulanceSleeve'+side+'Solid',[[263,412],[283,411],[282,434],[270,454],[262,471],[238,465],[238,454],[249,431]].map(([a,b])=>[x(a),b]),[x(260),442],.13,white,.66);
  volume(arm,'AmbulanceHand'+side+'Solid',[[238,464],[260,469],[263,482],[257,495],[245,500],[234,494],[229,482]].map(([a,b])=>[x(a),b]),[x(246),483],.12,'#ffc18d',.68);arm.paint();
  const leg=part(side<0?'LeftLeg':'RightLeg',[x(300),491]);
  volume(leg,'AmbulanceTrouser'+side+'Solid',[[272,478],[318,481],[330,493],[325,514],[315,538],[310,551],[288,555],[277,550],[281,532],[274,508]].map(([a,b])=>[x(a),b]),[x(298),516],.18,white,.67);leg.paint();
 }
 // The uniform is in front of the vehicle and remains attached during gait.
 for(const[o,s]of shells){
  const art=s.parent.getObjectByName(o.name+'OriginalPaint'),contour=o.userData.sourceContour;
  if(art&&contour){const boundary=new T.CatmullRomCurve3(contour.map(([x,y])=>new T.Vector3(x,y,0)),true,'centripetal').getSpacedPoints(160),p=art.geometry.attributes.position,c=art.geometry.attributes.color;for(let i=0;i<p.count;i++){const x=p.getX(i)/.005+s.pivot[0],y=s.pivot[1]-p.getY(i)/.005;let d=Infinity;for(let j=0;j<boundary.length-1;j++){const a=boundary[j],b=boundary[j+1],dx=b.x-a.x,dy=b.y-a.y,t=Math.max(0,Math.min(1,((x-a.x)*dx+(y-a.y)*dy)/(dx*dx+dy*dy)));d=Math.min(d,Math.hypot(x-a.x-t*dx,y-a.y-t*dy));}const t=Math.max(0,Math.min(1,(d-4)/10));c.setW(i,c.getW(i)*t*t*(3-2*t));}}
  o.updateMatrix();const g=o.geometry.clone().applyMatrix4(o.matrix),p=g.attributes.position,b=new T.Box3().setFromBufferAttribute(p),c=b.getCenter(new T.Vector3()),f=1+.016/(b.getSize(new T.Vector3()).length()/2),ix=g.index?Array.from(g.index.array):Array.from({length:p.count},(_,i)=>i);for(let i=0;i<p.count;i++)p.setXYZ(i,c.x+(p.getX(i)-c.x)*f,c.y+(p.getY(i)-c.y)*f,c.z+(p.getZ(i)-c.z)*f);for(let i=0;i<ix.length;i+=3)[ix[i+1],ix[i+2]]=[ix[i+2],ix[i+1]];g.setIndex(ix);g.computeVertexNormals();const ink=k.mesh(o.name+'InkShell',g,k.solid(o.name+'Ink','#5b343a'),s.parent);ink.material.userData.alreadyShaded=true;}
 require('./finish-ambulance-uniform.cjs')(T,k,tools);
 const result=k.finish({holdLeft:true,holdRight:true,authoring:'Source-shaped ambulance body and face window, fitted end windows and doors, four real tires and short uniformed wearer'});
 for(const clip of result.clips)for(const track of clip.tracks)if(['Head.quaternion','LeftArm.quaternion','RightArm.quaternion'].includes(track.name))for(let i=0;i<track.values.length;i+=4)track.values.set([0,0,0,1],i);
 Object.assign(result.root.userData,{locomotion:'walk',canWave:false});return result;
};
