"use strict";
module.exports=function fireTruckCostume(T){
 const k=require('./model-kit.cjs')(T,'vehicle-fire-truck'),sculpt=require('./sculpt-kit.cjs'),shells=[],tools=[];
 function part(name,pivot){const group=k.group(name,pivot),s=sculpt(T,k,{group,part:{pivot}});group.userData.directSurfaceArtwork=true;group.userData.artworkOcclusion=true;tools.push(s);return s;}
 function volume(s,name,ps,c,depth,color,z=0){k.volume(name+'Half',ps,c,s.pivot,depth,depth,s.parent,k.solid(name+'Color',color),{art:false,z,samples:64});require('./smooth-paired-volume.cjs')(T,k,s.parent,name+'Half',{rings:24});const P=[],I=[];for(const suffix of ['Surface','Back']){const o=s.parent.getObjectByName(name+'Half'+suffix),n=P.length/3;P.push(...o.geometry.attributes.position.array);I.push(...Array.from(o.geometry.index.array,j=>j+n));s.parent.remove(o);}const o=k.mesh(name,k.geometry(P,I),k.solid(name+'Color',color),s.parent);o.userData.artworkFacingFade=[.18,.55];o.userData.sourceContour=ps;shells.push([o,s]);return o;}
 function refineSurface(o){const src=o.geometry,p=src.attributes.position,ix=src.index,points=[],map=new Map(),faces=[];
  const get=i=>{const q=new T.Vector3().fromBufferAttribute(p,i),key=q.toArray().map(v=>Math.round(v*1e6)).join(',');if(!map.has(key)){map.set(key,points.length);points.push(q);}return map.get(key);};
  for(let i=0;i<(ix?ix.count:p.count);i+=3){const f=[0,1,2].map(j=>get(ix?ix.getX(i+j):i+j));if(new Set(f).size===3)faces.push(f);}
  const frontZ=Math.max(...points.map(v=>v.z)),edge=(a,b)=>a<b?a+','+b:b+','+a;
  for(let pass=0;pass<8;pass++){const cuts=new Map();for(const f of faces)for(let j=0;j<3;j++){const a=f[j],b=f[(j+1)%3],key=edge(a,b);if(!cuts.has(key)&&Math.abs(points[a].z-frontZ)<1e-5&&Math.abs(points[b].z-frontZ)<1e-5&&points[a].distanceTo(points[b])>.09){cuts.set(key,points.length);points.push(points[a].clone().add(points[b]).multiplyScalar(.5));}}if(!cuts.size)break;const next=[];
   for(const f of faces){let[a,b,c]=f,ab=cuts.get(edge(a,b)),bc=cuts.get(edge(b,c)),ca=cuts.get(edge(c,a)),count=[ab,bc,ca].filter(v=>v!==undefined).length;if(!count){next.push(f);continue;}if(count===3){next.push([a,ab,ca],[ab,b,bc],[ca,bc,c],[ab,bc,ca]);continue;}if(count===1){if(bc!==undefined){[a,b,c]=[b,c,a];ab=bc;}else if(ca!==undefined){[a,b,c]=[c,a,b];ab=ca;}next.push([a,ab,c],[ab,b,c]);continue;}if(ab===undefined){[a,b,c]=[b,c,a];[ab,bc]=[bc,ca];}else if(bc===undefined){[a,b,c]=[c,a,b];[ab,bc]=[ca,ab];}next.push([b,bc,ab],[a,ab,c],[ab,bc,c]);}faces.splice(0,faces.length,...next);
  }o.geometry=k.geometry(points.flatMap(v=>v.toArray()),faces.flat());src.dispose();
 }

 const head=part('Head',[320,580]),red='#f22125',dark='#53373d',metal='#c2b8bd';head.parent.userData.artworkOcclusion=false;head.parent.userData.artworkOpaqueRegions=[{cx:318,cy:327,rx:95,ry:75}];
 const cab=head.box('FireTruckCabSolid',[320,306,0],[286,220,1.15],red,34);refineSurface(cab);cab.userData.artworkFacingFade=[.10,.45];shells.push([cab,head]);
 const bumper=head.box('FireTruckBumperSolid',[320,414,.60],[291,25,.25],metal,11);shells.push([bumper,head]);
 function rod(name,a,b,r,color){const A=new T.Vector3(...head.point(a)),B=new T.Vector3(...head.point(b)),d=B.clone().sub(A),g=new T.CylinderGeometry(r,r,d.length(),20),o=k.mesh(name,g,k.solid(name+'Color',color),head.parent,A.clone().add(B).multiplyScalar(.5).toArray());o.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),d.normalize());return o;}
 for(const side of [-1,1]){
  const x=v=>side<0?v:640-v;
  const stay=rod('FireTruckMirrorStay'+side+'Solid',[x(180),251,0],[x(151),288,.02],.045,dark);shells.push([stay,head]);
  const mirror=head.box('FireTruckMirror'+side+'Solid',[x(151),300,.04],[34,63,.28],dark,14);shells.push([mirror,head]);
  const rail=rod('FireTruckLadderRail'+side+'Solid',[x(248),199,-.04],[x(273),81,-.62],.044,metal);shells.push([rail,head]);
  const frontRail=rod('FireTruckLadderSupport'+side+'Solid',[x(249),202,.10],[x(249),131,.10],.046,metal);shells.push([frontRail,head]);
  head.ellipsoid('FireTruckLadderRailCap'+side,[x(273),81,-.62],[9,9,.044],metal);
  head.ellipsoid('FireTruckLadderSupportCap'+side,[x(249),131,.10],[9,9,.046],metal);
 }
 for(const y of [92,119,146,174,188]){const t=(199-y)/118,x=248+25*t,z=-.04-.58*t,bar=rod('FireTruckLadderRung'+y+'Solid',[x,y,z],[640-x,y,z],.033,metal);shells.push([bar,head]);}
 const ladderFoot=head.box('FireTruckLadderFootSolid',[320,199,-.05],[158,22,.28],dark,7);shells.push([ladderFoot,head]);
 const beacon=head.lathe('FireTruckBeaconSolid',[[196,0,320],[194,30,320],[180,28,320],[164,22,320],[156,9,320],[155,0,320]],red,.35,{levels:28,segments:40});shells.push([beacon,head]);
 const beaconBase=head.box('FireTruckBeaconBaseSolid',[320,194,.35],[73,13,.35],'#bd1523',5);shells.push([beaconBase,head]);head.paint();
 // The rear is a vehicle equipment door; no second human face is painted.
 const backDoor=head.box('FireTruckRearDoorSolid',[320,310,-.585],[230,152,.05],'#8f8189',12);backDoor.userData.skipOriginalPaint=true;
 const inner=head.box('FireTruckRearDoorInset',[320,310,-.616],[213,136,.02],'#c0b6ba',8);inner.userData.skipOriginalPaint=true;
 for(let y=257;y<=369;y+=14){const line=head.box('FireTruckRearDoorSlat'+y,[320,y,-.629],[207,2,.01],'#91858f',.5);line.userData.skipOriginalPaint=true;}
 const rearBumper=head.box('FireTruckRearBumperSolid',[320,414,-.61],[291,25,.22],metal,11);rearBumper.userData.skipOriginalPaint=true;shells.push([rearBumper,head]);
 for(const x of [196,444]){const lamp=head.box('FireTruckRearLamp'+x+'Solid',[x,372,-.59],[21,31,.055],'#ffe58b',5);lamp.userData.skipOriginalPaint=true;}
 // Actual windows and reflector strips on the two side walls.
 for(const side of [-1,1]){function panel(name,y,z,h,d,color,offset){const geo=new T.BoxGeometry(.018,h*.005,d),o=k.mesh(name,geo,k.solid(name+'Color',color),head.parent,[side*(.73125+offset),(580-y)*.005,z]);o.userData.skipOriginalPaint=true;return o;}
  panel('FireTruckSideWindowFrame'+side,278,0,78,.78,dark,0);panel('FireTruckSideWindow'+side,278,0,65,.67,'#85cee9',.012);panel('FireTruckSideReflector'+side,359,0,13,.89,'#fff0ac',.006);
 }
 const torso=part('Torso',[320,457]);const neck=torso.ellipsoid('FireTruckNeckBridgeSolid',[320,421,0],[40,18,.22],'#f14727');neck.userData.skipOriginalPaint=true;volume(torso,'FireTruckJacketSolid',[[270,418],[297,417],[320,421],[343,417],[370,418],[381,479],[375,490],[350,495],[290,495],[263,489],[259,478]],[320,456],.25,'#f14727',.12);volume(torso,'FireTruckHipsSolid',k.ellipse(320,494,53,17),[320,494],.18,'#eb3c25',.12);torso.paint();
 const torsoSolid=torso.parent.getObjectByName('FireTruckJacketSolid');torsoSolid.updateWorldMatrix(true,false);
 function jacketStripe(y0,y1){const P=[],I=[],U=32,V=4;for(let j=0;j<=V;j++)for(let i=0;i<=U;i++){const x=270+100*i/U,y=y0+(y1-y0)*j/V,o=torso.parent.localToWorld(new T.Vector3((x-320)*.005,(457-y)*.005,-3)),hit=new T.Raycaster(o,new T.Vector3(0,0,1)).intersectObject(torsoSolid)[0];if(!hit)throw new Error('Jacket stripe unsupported');const v=torso.parent.worldToLocal(hit.point.clone());P.push(v.x,v.y,v.z-.008);}for(let j=0;j<V;j++)for(let i=0;i<U;i++){const a=j*(U+1)+i,b=a+1,c=a+U+1,d=c+1;I.push(a,b,d,a,d,c);}const stripe=k.mesh('FireTruckJacketRearStripe'+y0,k.geometry(P,I),k.solid('FireTruckReflector','#fff0ac'),torso.parent);}
 jacketStripe(446,455);jacketStripe(474,483);
 for(const side of [-1,1]){const x=v=>side<0?v:640-v,mirror=ps=>ps.map(([a,b])=>[x(a),b]),arm=part(side<0?'LeftArm':'RightArm',[x(265),435]);
  volume(arm,'FireTruckSleeve'+side+'Solid',mirror([[260,425],[278,431],[271,449],[260,470],[237,462],[239,451],[248,435]]),[x(256),448],.14,'#f14727',.12);
  volume(arm,'FireTruckGlove'+side+'Solid',mirror([[237,460],[261,468],[262,482],[254,495],[241,496],[230,487],[229,474]]),[x(246),478],.12,dark,.14);arm.paint();
  const leg=part(side<0?'LeftLeg':'RightLeg',[x(292),493]);volume(leg,'FireTruckTrouser'+side+'Solid',mirror([[266,483],[309,486],[316,502],[310,527],[278,529],[269,519]]),[x(292),506],.18,'#f14427',.12);
  volume(leg,'FireTruckBoot'+side+'Solid',mirror([[277,518],[310,520],[312,534],[307,544],[292,548],[276,544],[270,536]]),[x(292),534],.20,dark,.16);leg.paint();
 }
 for(const[o,s]of shells){
  const art=s.parent.getObjectByName(o.name+'OriginalPaint'),contour=o.userData.sourceContour;
  if(art&&contour){const boundary=new T.CatmullRomCurve3(contour.map(([x,y])=>new T.Vector3(x,y,0)),true,'centripetal').getSpacedPoints(160),p=art.geometry.attributes.position,c=art.geometry.attributes.color;for(let i=0;i<p.count;i++){const x=p.getX(i)/.005+s.pivot[0],y=s.pivot[1]-p.getY(i)/.005;let d=Infinity;for(let j=0;j<boundary.length-1;j++){const a=boundary[j],b=boundary[j+1],dx=b.x-a.x,dy=b.y-a.y,t=Math.max(0,Math.min(1,((x-a.x)*dx+(y-a.y)*dy)/(dx*dx+dy*dy)));d=Math.min(d,Math.hypot(x-a.x-t*dx,y-a.y-t*dy));}const narrow=/Sleeve|Boot/.test(o.name),t=Math.max(0,Math.min(1,(d-(narrow?0:4))/(narrow?4:10)));c.setW(i,c.getW(i)*t*t*(3-2*t));}}
  o.updateMatrix();const g=o.geometry.clone().applyMatrix4(o.matrix),p=g.attributes.position,b=new T.Box3().setFromBufferAttribute(p),c=b.getCenter(new T.Vector3()),f=1+.016/(b.getSize(new T.Vector3()).length()/2),ix=g.index?Array.from(g.index.array):Array.from({length:p.count},(_,i)=>i);for(let i=0;i<p.count;i++)p.setXYZ(i,c.x+(p.getX(i)-c.x)*f,c.y+(p.getY(i)-c.y)*f,c.z+(p.getZ(i)-c.z)*f);for(let i=0;i<ix.length;i+=3)[ix[i+1],ix[i+2]]=[ix[i+2],ix[i+1]];g.setIndex(ix);g.computeVertexNormals();const ink=k.mesh(o.name+'InkShell',g,k.solid(o.name+'Ink','#5b343a'),s.parent);ink.material.userData.alreadyShaded=true;}

 require('./finish-small-vehicle-parts.cjs')(T,k,tools);
 const result=k.finish({holdLeft:true,holdRight:true,authoring:'Fire-engine cab with source face, connected depth ladder, mirrors, beacon, equipment door and short firefighter uniform'});
 for(const clip of result.clips)for(const track of clip.tracks)if(['Head.quaternion','LeftArm.quaternion','RightArm.quaternion'].includes(track.name))for(let i=0;i<track.values.length;i+=4)track.values.set([0,0,0,1],i);
 Object.assign(result.root.userData,{locomotion:'walk',canWave:false});return result;
};
