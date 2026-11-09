"use strict";
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const THREE=require('../learning/arts/art-appreciation/museum/vendor/three.min.js');
const profiles=require('../apps/avatar-lab/collection-profiles.cjs'),make=require('../apps/avatar-lab/avatar-factory.cjs').create;
const results=[];
function minimumSurfaceY(object){let min=Infinity;object.updateMatrixWorld(true);object.traverse(mesh=>{if(!mesh.isMesh)return;const p=mesh.geometry.attributes.position,m=mesh.matrixWorld.elements;for(let i=0;i<p.count;i++)min=Math.min(min,m[1]*p.getX(i)+m[5]*p.getY(i)+m[9]*p.getZ(i)+m[13]);});return min;}
for(const profile of Object.values(profiles)){
 if(profile.shape==='custom')continue;
 if(process.argv.length>2&&!process.argv.slice(2).includes(profile.id))continue;
 const {root,clips}=make(THREE,profile.id),errors=[];let triangles=0;
 const motion=root.userData.locomotion||profile.motion;
 function check(ok,message){if(!ok)errors.push(message);}
 root.traverse(o=>{if(!o.isMesh)return;const p=o.geometry.attributes.position,index=o.geometry.index;triangles+=(index?index.count:p.count)/3;check(o.material.isMeshBasicMaterial,o.name+' lit material');check(Array.from(p.array).every(Number.isFinite),o.name+' invalid vertex');
  if(o.name.endsWith('Solid')||['NoriRoll','RiceTop','WaffleCone','SoftServe','ContinuousFoodBody'].includes(o.name)){const edges=new Map(),coord=i=>[p.getX(i),p.getY(i),p.getZ(i)].map(v=>Math.round(v*1e5)).join(',');for(let i=0;i<(index?index.count:p.count);i+=3){const v=[0,1,2].map(j=>coord(index?index.getX(i+j):i+j));if(new Set(v).size<3)continue;for(let j=0;j<3;j++){const edge=[v[j],v[(j+1)%3]].sort().join('|');edges.set(edge,(edges.get(edge)||0)+1);}}check([...edges.values()].every(n=>n===2),o.name+' non-manifold edge');}
 });
 const legNames=['LeftLeg','RightLeg'];for(const n of legNames){let count=0;root.traverse(o=>{if(o.name===n)count++;});check(count===(motion==='walk'?1:0),n+' anatomy');}
 if(['animal-bee','animal-butterfly'].includes(profile.id))require('./garden-avatar-checks.cjs')(THREE,root,clips,check,profile.id);
 if(['animal-crab','animal-crested-gecko'].includes(profile.id))require('./coastal-reptile-checks.cjs')(THREE,root,clips,check,profile.id);
 if(['animal-crocodile','animal-deer'].includes(profile.id))require('./deer-crocodile-checks.cjs')(THREE,root,clips,check,profile.id);
 if(['animal-dog','animal-dolphin','animal-dragon','animal-dragonfly','animal-duck','animal-eagle'].includes(profile.id))require('./padded-suit-checks.cjs')(THREE,root,clips,check,profile.id);
 if(['animal-ostrich','animal-owl'].includes(profile.id))require('./ostrich-owl-checks.cjs')(THREE,root,clips,check,profile.id);
 if(['animal-monkey','animal-mouse'].includes(profile.id))require('./monkey-mouse-checks.cjs')(THREE,root,clips,check,profile.id);
 if(['animal-llama','animal-meerkat'].includes(profile.id))require('./sheep-meerkat-checks.cjs')(THREE,root,clips,check,profile.id);
 if(['animal-leopard-gecko','animal-lion'].includes(profile.id))require('./gecko-lion-checks.cjs')(THREE,root,clips,check,profile.id);
 if(['animal-koala','animal-ladybug'].includes(profile.id))require('./koala-ladybug-checks.cjs')(THREE,root,clips,check,profile.id);
 if(['animal-hippopotamus','animal-kangaroo'].includes(profile.id))require('./hippo-kangaroo-checks.cjs')(THREE,root,clips,check,profile.id);
 if(['animal-giraffe','animal-hedgehog'].includes(profile.id))require('./giraffe-hedgehog-checks.cjs')(THREE,root,clips,check,profile.id);
 if(['animal-fox','animal-frog'].includes(profile.id))require('./fox-frog-checks.cjs')(THREE,root,clips,check,profile.id);
 if(['animal-elephant','animal-flamingo'].includes(profile.id))require('./elephant-flamingo-checks.cjs')(THREE,root,clips,check,profile.id);
 if(['animal-bear','animal-chick'].includes(profile.id)){
  root.updateMatrixWorld(true);
  const pair=n=>['Surface','Back'].map(s=>root.getObjectByName(n+s)),hood=pair('MeasuredCostumeHood'),torso=pair('CompactCostumeBody');
  const overlap=(o,supports)=>{let count=0;const p=o.geometry.attributes.position,materials=new Map(supports.map(o=>[o.material,o.material.side]));for(const m of materials.keys())m.side=THREE.DoubleSide;for(let i=0;i<p.count;i+=7){const v=o.localToWorld(new THREE.Vector3().fromBufferAttribute(p,i)),hits=new THREE.Raycaster(v,new THREE.Vector3(.023,.019,1).normalize()).intersectObjects(supports),ds=[];for(const h of hits)if(!ds.some(d=>Math.abs(d-h.distance)<1e-5))ds.push(h.distance);if(ds.length%2)count++;}for(const[m,side]of materials)m.side=side;return count;};
  const features=root.getObjectByName('Head').children.filter(o=>o.isMesh&&o.name.endsWith('Surface')&&o!==hood[0]).map(o=>pair(o.name.replace(/Surface$/,'')));
  for(const group of [hood,torso,...features,...['LeftArm','RightArm','LeftLeg','RightLeg'].map(n=>pair('Compact'+n))]){
   const edges=new Map(),normals=new Map();for(const o of group){const p=o.geometry.attributes.position,n=o.geometry.attributes.normal,ix=o.geometry.index,coord=i=>[p.getX(i),p.getY(i),p.getZ(i)].map(v=>Math.round(v*1e5)).join(',');for(let i=0;i<p.count;i++){const key=coord(i),v=new THREE.Vector3().fromBufferAttribute(n,i);if(normals.has(key))check(v.dot(normals.get(key))>.995,'soft costume rim has split shading: '+o.name);else normals.set(key,v);}for(let i=0;i<ix.count;i+=3){const v=[0,1,2].map(j=>coord(ix.getX(i+j)));if(new Set(v).size<3)continue;for(let j=0;j<3;j++){const key=[v[j],v[(j+1)%3]].sort().join('|');edges.set(key,(edges.get(key)||0)+1);}}}
   check([...edges.values()].every(n=>n===2),'soft costume must remain closed: '+group[0].name);
  }
  for(const feature of features)check(overlap(feature[1],hood)>0,'soft costume feature floats above hood: '+feature[0].name);
  const paint=root.getObjectByName('MeasuredCostumeHoodSurfaceOriginalPaint'),p=paint.geometry.attributes.position,n=paint.geometry.attributes.normal,c=paint.geometry.attributes.color;let flank=0;for(let i=0;i<p.count;i++)if(Math.abs(n.getZ(i))<.1){flank++;check(c.getW(i)<.01,'source outline leaks onto soft hood flank');}check(flank>20,'soft hood flank must be explicitly checked');
  const saved=[];root.traverse(o=>saved.push([o,o.position.clone(),o.quaternion.clone(),o.scale.clone()]));
  for(const clip of clips){const mixer=new THREE.AnimationMixer(root);mixer.clipAction(clip).play();for(const phase of [0,.125,.25,.5,.75]){mixer.setTime(clip.duration*phase);root.updateMatrixWorld(true);check(overlap(torso[0],hood)>2,'soft costume torso detached: '+clip.name+' '+phase);for(const name of ['LeftArm','RightArm','LeftLeg','RightLeg'])check(overlap(pair('Compact'+name)[0],torso)>2,'soft costume limb detached: '+name+' '+clip.name+' '+phase);}mixer.stopAllAction();}
  for(const[o,p,q,s]of saved){o.position.copy(p);o.quaternion.copy(q);o.scale.copy(s);}root.updateMatrixWorld(true);
 }


 if(profile.id==='vehicle-fire-truck'){
  root.updateMatrixWorld(true);const cab=root.getObjectByName('FireTruckCabSolid'),torso=root.getObjectByName('FireTruckJacketSolid'),hips=root.getObjectByName('FireTruckHipsSolid'),bridge=root.getObjectByName('FireTruckNeckBridgeSolid');
  const inside=(o,support)=>{let count=0;const p=o.geometry.attributes.position;for(let j=0,n=Math.min(256,p.count);j<n;j++){const v=o.localToWorld(new THREE.Vector3().fromBufferAttribute(p,Math.floor(j*p.count/n))),side=support.material.side;support.material.side=THREE.DoubleSide;const hits=new THREE.Raycaster(v,new THREE.Vector3(.031,.017,1).normalize()).intersectObject(support);support.material.side=side;const ds=[];for(const h of hits)if(!ds.some(d=>Math.abs(d-h.distance)<1e-5))ds.push(h.distance);if(ds.length%2)count++;}return count;};
  const contact=(a,b)=>inside(a,b)>2||inside(b,a)>2;
  check(cab&&torso&&bridge&&!root.getObjectByName('OriginalFace'),'fire truck needs a real source-face cab and connected short wearer');
  if(cab&&torso&&bridge){
   check(new THREE.Box3().setFromObject(cab).getSize(new THREE.Vector3()).z>1.1,'fire truck cab is flat');check(new THREE.Box3().setFromObject(torso).getSize(new THREE.Vector3()).y<.43,'firefighter torso is vertically too long');
   const hit=(o,x,y)=>new THREE.Raycaster(root.localToWorld(new THREE.Vector3((x-320)*.005,(580-y)*.005,5)),new THREE.Vector3(0,0,-1)).intersectObject(o)[0],art=root.getObjectByName('FireTruckCabSolidOriginalPaint');for(const[x,y]of [[272,325],[365,325],[319,366],[319,394]])check(art&&hit(art,x,y),'firefighter source face landmark missing');
   const foot=root.getObjectByName('FireTruckLadderFootSolid');check(contact(foot,cab),'fire truck ladder base detached');for(const side of [-1,1]){const rail=root.getObjectByName('FireTruckLadderRail'+side+'Solid'),support=root.getObjectByName('FireTruckLadderSupport'+side+'Solid'),stay=root.getObjectByName('FireTruckMirrorStay'+side+'Solid'),mirror=root.getObjectByName('FireTruckMirror'+side+'Solid');check(contact(rail,foot)&&contact(support,foot),'fire truck ladder rail detached');check(contact(stay,cab)&&contact(stay,mirror),'fire truck mirror detached');for(const y of [92,119,146,174,188])check(contact(root.getObjectByName('FireTruckLadderRung'+y+'Solid'),rail),'fire truck ladder rung detached');}
   for(const side of [-1,1]){const frame=root.getObjectByName('FireTruckSideWindowFrame'+side),glass=root.getObjectByName('FireTruckSideWindow'+side),stripe=root.getObjectByName('FireTruckSideReflector'+side);check(contact(frame,cab)&&contact(glass,frame)&&contact(stripe,cab),'fire truck side window/reflector detached');const origin=root.localToWorld(new THREE.Vector3(side*3,(580-359)*.005,0)),hits=new THREE.Raycaster(origin,new THREE.Vector3(-side,0,0)).intersectObjects([cab,stripe]);check(hits[0]?.object===stripe,'fire truck side reflector hidden inside cab');}
   const beacon=root.getObjectByName('FireTruckBeaconSolid'),base=root.getObjectByName('FireTruckBeaconBaseSolid');check(contact(base,cab)&&contact(beacon,base),'fire truck beacon detached');
   for(const y of [446,474]){const stripe=root.getObjectByName('FireTruckJacketRearStripe'+y),p=stripe.geometry.attributes.position,ix=stripe.geometry.index;let area=0;for(let i=0;i<ix.count;i+=3){const a=new THREE.Vector3().fromBufferAttribute(p,ix.getX(i)),b=new THREE.Vector3().fromBufferAttribute(p,ix.getX(i+1)),c=new THREE.Vector3().fromBufferAttribute(p,ix.getX(i+2));area+=b.sub(a).cross(c.sub(a)).z;}check(area<0,'firefighter rear reflector faces inward');}
   const saved=[];root.traverse(o=>saved.push([o,o.position.clone(),o.quaternion.clone(),o.scale.clone()]));for(const clip of clips){const mixer=new THREE.AnimationMixer(root);mixer.clipAction(clip).play();for(const phase of [0,.125,.25,.5,.75]){mixer.setTime(clip.duration*phase);root.updateMatrixWorld(true);check(contact(bridge,cab)&&contact(bridge,torso),'firefighter neck separated');for(const side of [-1,1]){const sleeve=root.getObjectByName('FireTruckSleeve'+side+'Solid'),glove=root.getObjectByName('FireTruckGlove'+side+'Solid'),leg=root.getObjectByName('FireTruckTrouser'+side+'Solid'),boot=root.getObjectByName('FireTruckBoot'+side+'Solid');check(contact(sleeve,torso)&&contact(glove,sleeve),'firefighter arm separated in '+clip.name);check(contact(leg,hips)&&contact(boot,leg),'firefighter leg/boot separated in '+clip.name);}}mixer.stopAllAction();}for(const[o,p,q,s]of saved){o.position.copy(p);o.quaternion.copy(q);o.scale.copy(s);}root.updateMatrixWorld(true);
  }
 }
 if(profile.id==='vehicle-boat'){
  root.updateMatrixWorld(true);const hull=root.getObjectByName('BoatHollowHullSolid'),cabin=root.getObjectByName('BoatFaceCabinSolid'),wake=root.getObjectByName('BoatFrontWaveSolid'),roof=root.getObjectByName('BoatWoodRoofSolid'),funnel=root.getObjectByName('BoatFunnelSolid'),cap=root.getObjectByName('BoatFunnelCapSolid');
  const hit=(o,x,y)=>new THREE.Raycaster(root.localToWorld(new THREE.Vector3((x-320)*.005,(580-y)*.005,5)),new THREE.Vector3(0,0,-1)).intersectObject(o)[0];
  // Count sampled vertices inside the supporting closed volume. De-duplicate
  // coincident triangle hits so cap diagonals do not flip the parity.
  const inside=(o,support)=>{let count=0;const p=o.geometry.attributes.position;for(let j=0,n=Math.min(256,p.count);j<n;j++){const v=o.localToWorld(new THREE.Vector3().fromBufferAttribute(p,Math.floor(j*p.count/n))),ray=new THREE.Raycaster(v,new THREE.Vector3(.031,.017,1).normalize()),material=support.material,side=material.side;material.side=THREE.DoubleSide;const hits=ray.intersectObject(support);material.side=side;const distances=[];for(const h of hits)if(!distances.some(d=>Math.abs(d-h.distance)<1e-5))distances.push(h.distance);if(distances.length%2)count++;}return count;};
  check(hull&&cabin&&wake&&roof&&funnel&&cap&&!root.getObjectByName('BoatWaterBaseSolid'),'boat needs one volumetric wake without a duplicate disk');
  if(hull&&cabin&&wake&&roof&&funnel&&cap){
   const bounds=new THREE.Box3().setFromObject(hull),size=bounds.getSize(new THREE.Vector3());check(size.x>2.65&&size.z>1.40,'boat hull lacks its broad curved volume');
   for(const[x,y]of [[90,375],[145,450],[320,480],[500,410]])check(hit(hull,x,y),'boat source hull landmark missing');for(const[x,y]of [[235,280],[370,280],[318,330]])check(hit(root.getObjectByName('BoatFaceCabinSolidOriginalPaint'),x,y),'boat original expression missing');
   check(inside(cabin,roof)>2,'boat roof detached');check(inside(funnel,roof)>2||inside(roof,funnel)>2,'boat chimney detached');check(inside(cap,funnel)>2||inside(funnel,cap)>2,'boat chimney cap detached');
   const rail=root.getObjectByName('BoatContinuousWoodRim');check(rail&&inside(rail,hull)>4,'boat wooden rim floats above hull');
   for(const side of [-1,1])for(const x of [468,527]){const glass=root.getObjectByName('BoatPortholeGlass'+x+'_'+side),p=glass.geometry.attributes.position;for(let i=0;i<p.count;i+=41){const v=glass.localToWorld(new THREE.Vector3().fromBufferAttribute(p,i)),h=new THREE.Raycaster(v.clone().add(new THREE.Vector3(0,0,side)),new THREE.Vector3(0,0,-side)).intersectObject(hull)[0];check(h&&Math.abs(v.z-h.point.z-side*.014)<.003,'boat porthole floats off hull');}}
   const saved=[];root.traverse(o=>saved.push([o,o.position.clone(),o.quaternion.clone(),o.scale.clone()]));for(const clip of clips){const mixer=new THREE.AnimationMixer(root);mixer.clipAction(clip).play();for(const phase of [0,.125,.25,.5,.75]){mixer.setTime(clip.duration*phase);root.updateMatrixWorld(true);check(inside(hull,wake)>2,'boat keel separates from water during '+clip.name+' '+phase);const base=root.getObjectByName('BoatCabinBaseSolid');check(base&&inside(base,hull)>2&&(inside(base,cabin)>2||inside(cabin,base)>2),'boat cabin support separates from hull during '+clip.name+' '+phase);}mixer.stopAllAction();}for(const[o,p,q,s]of saved){o.position.copy(p);o.quaternion.copy(q);o.scale.copy(s);}root.updateMatrixWorld(true);
  }
 }
 if(profile.id==='vehicle-ambulance'){
  root.updateMatrixWorld(true);const hull=root.getObjectByName('AmbulanceVehicleBodySolid'),window=root.getObjectByName('AmbulanceFaceWindowSolid'),torso=root.getObjectByName('AmbulanceShortJacketSolid'),hips=root.getObjectByName('AmbulanceShortHipsSolid');
  const hit=(o,x,y,rear=false)=>new THREE.Raycaster(root.localToWorld(new THREE.Vector3((x-320)*.005,(580-y)*.005,rear?-5:5)),new THREE.Vector3(0,0,rear?1:-1)).intersectObject(o)[0];
  const inside=(o,supports)=>{const p=o.geometry.attributes.position;let count=0;for(let sample=0,countSamples=Math.min(256,p.count);sample<countSamples;sample++){const i=Math.floor(sample*p.count/countSamples),v=o.localToWorld(new THREE.Vector3().fromBufferAttribute(p,i));for(const support of supports){const a=new THREE.Raycaster(v.clone().add(new THREE.Vector3(0,0,4)),new THREE.Vector3(0,0,-1)).intersectObject(support)[0],b=new THREE.Raycaster(v.clone().add(new THREE.Vector3(0,0,-4)),new THREE.Vector3(0,0,1)).intersectObject(support)[0];if(a&&b&&v.z<a.point.z&&v.z>b.point.z){count++;break;}}}return count;};
  check(hull&&window&&torso&&hips&&!root.getObjectByName('OriginalFace'),'ambulance needs a real vehicle body and attached face window/short wearer');
  if(hull&&window&&torso&&hips){
   const size=new THREE.Box3().setFromObject(hull).getSize(new THREE.Vector3());check(size.x>2.7&&size.z>1.08,'ambulance vehicle body lacks source width/depth');for(const[x,y]of [[220,135],[585,175],[48,413],[590,446]])check(hit(hull,x,y),'ambulance vehicle silhouette missing');
   const art=root.getObjectByName('AmbulanceFaceWindowSolidOriginalPaint');for(const[x,y]of [[280,294],[384,294],[332,344]])check(art&&hit(art,x,y),'ambulance source face missing from window');check(inside(window,[hull])>3,'ambulance face window detached');check(inside(torso,[hull])>3&&inside(hips,[torso])>3,'ambulance uniform disconnected');check(new THREE.Box3().setFromObject(torso).getSize(new THREE.Vector3()).y<.44,'ambulance jacket too tall');
   for(const name of ['AmbulanceBeaconSolid','AmbulanceBeaconBaseSolid','AmbulanceCabRoofLampSolid'])check(inside(root.getObjectByName(name),[hull,root.getObjectByName('AmbulanceBeaconBaseSolid')])>3,'ambulance roof lamp/base detached');
   const tires=[];root.traverse(o=>{if(/^AmbulanceWheel\d+_-?1Solid$/.test(o.name))tires.push(o);});check(tires.length===4,'ambulance requires four actual wheels');
   for(const x of [150,505]){const axle=root.getObjectByName('AmbulanceAxle'+x+'Solid');const af=hit(hull,x,470),ab=hit(hull,x,470,true),bounds=axle&&new THREE.Box3().setFromObject(axle);check(bounds&&af&&ab&&bounds.min.z<af.point.z&&bounds.max.z>ab.point.z,'ambulance axle does not pass through vehicle body');for(const side of [-1,1]){const tire=root.getObjectByName('AmbulanceWheel'+x+'_'+side+'Solid');check(inside(tire,[hull])>3,'ambulance tire detached');check(new THREE.Box3().setFromObject(tire).min.y>.10,'ambulance costume wheels should remain above the human feet');}}
   for(const name of ['AmbulanceFrontWindshield','AmbulanceRearDoorWindow-1','AmbulanceRearDoorWindow1']){const panel=root.getObjectByName(name),side=name.includes('Front')?-1:1,p=panel.geometry.attributes.position;for(let i=0;i<p.count;i+=23){const v=panel.localToWorld(new THREE.Vector3().fromBufferAttribute(p,i)),h=new THREE.Raycaster(v.clone().add(new THREE.Vector3(side,0,0)),new THREE.Vector3(-side,0,0)).intersectObject(hull)[0];check(h&&Math.abs(v.x-h.point.x)<.021,'ambulance end window detached');}}
   const saved=[];root.traverse(o=>saved.push([o,o.position.clone(),o.quaternion.clone(),o.scale.clone()]));for(const clip of clips){const mixer=new THREE.AnimationMixer(root);mixer.clipAction(clip).play();for(const phase of [0,.125,.25,.5,.75]){mixer.setTime(clip.duration*phase);root.updateMatrixWorld(true);for(const side of [-1,1]){const sleeve=root.getObjectByName('AmbulanceSleeve'+side+'Solid'),hand=root.getObjectByName('AmbulanceHand'+side+'Solid'),leg=root.getObjectByName('AmbulanceTrouser'+side+'Solid');check(inside(sleeve,[torso,hull])>3,'ambulance sleeve detached in '+clip.name);check(inside(hand,[sleeve])>3,'ambulance hand detached in '+clip.name);check(inside(leg,[hips,torso])>3,'ambulance leg detached in '+clip.name);}}mixer.stopAllAction();}for(const[o,p,q,s]of saved){o.position.copy(p);o.quaternion.copy(q);o.scale.copy(s);}root.updateMatrixWorld(true);
  }
 }
 if(profile.id==='vehicle-airship'){
  root.updateMatrixWorld(true);const hull=root.getObjectByName('AirshipEnvelopeSolid'),cabin=root.getObjectByName('AirshipGondolaSolid'),hips=root.getObjectByName('AirshipShortHipsSolid');
  const hit=(o,x,y,rear=false)=>new THREE.Raycaster(root.localToWorld(new THREE.Vector3((x-320)*.005,(580-y)*.005,rear?-5:5)),new THREE.Vector3(0,0,rear?1:-1)).intersectObject(o)[0];
  const inside=(o,supports)=>{const p=o.geometry.attributes.position;let count=0;for(let i=0;i<p.count;i+=7){const v=o.localToWorld(new THREE.Vector3().fromBufferAttribute(p,i));for(const support of supports){const a=new THREE.Raycaster(v.clone().add(new THREE.Vector3(0,0,4)),new THREE.Vector3(0,0,-1)).intersectObject(support)[0],b=new THREE.Raycaster(v.clone().add(new THREE.Vector3(0,0,-4)),new THREE.Vector3(0,0,1)).intersectObject(support)[0];if(a&&b&&v.z<a.point.z&&v.z>b.point.z){count++;break;}}}return count;};
  check(hull&&cabin&&hips&&!root.getObjectByName('Torso')&&!root.getObjectByName('OriginalFace'),'airship requires horizontal envelope and short attached gondola without extra torso');
  if(hull&&cabin&&hips){
   const size=new THREE.Box3().setFromObject(hull).getSize(new THREE.Vector3());check(size.x>2.6&&size.z>1.3,'airship needs horizontal rounded volume');
   for(const[x,y]of [[45,280],[270,125],[410,140],[470,170],[320,405],[540,275]])check(hit(hull,x,y),'airship source silhouette landmark missing');const art=root.getObjectByName('AirshipEnvelopeSolidOriginalPaint');for(const[x,y]of [[216,279],[298,279],[260,321]])check(art&&hit(art,x,y),'airship original expression missing');
   check(inside(cabin,[hull])>3&&inside(hips,[cabin])>3,'airship gondola/short hips detached');check(new THREE.Box3().setFromObject(cabin).getSize(new THREE.Vector3()).y<.45,'airship gondola too tall');
   const engine=root.getObjectByName('AirshipGondolaEngineSolid');check(engine&&inside(engine,[cabin])>3,'airship needs a connected volumetric gondola engine');if(engine)for(const x of [402,419])check(inside(root.getObjectByName('AirshipEngineRing'+x),[engine])>3,'airship engine ring detached');
   for(const kind of ['Upper','Lower'])check(inside(root.getObjectByName('AirshipTail'+kind+'Solid'),[hull])>4,'airship tail detached');check(inside(root.getObjectByName('AirshipHorizontalTailSolid'),[hull])>4,'airship horizontal tail detached');
   for(const side of [-1,1]){const frame=root.getObjectByName('AirshipWindowFrame'+side+'Solid'),p=frame.geometry.attributes.position;for(let i=0;i<p.count;i+=37){const v=frame.localToWorld(new THREE.Vector3().fromBufferAttribute(p,i)),h=new THREE.Raycaster(v.clone().add(new THREE.Vector3(0,0,side)),new THREE.Vector3(0,0,-side)).intersectObject(hull)[0];check(h&&Math.abs(v.z-h.point.z)<.035,'airship window frame floats away');}}
   for(const[name,support]of [['AirshipRearGlass',hull],['AirshipCabinRearWindow',cabin]]){const glass=root.getObjectByName(name),p=glass.geometry.attributes.position;for(let i=0;i<p.count;i+=37){const v=glass.localToWorld(new THREE.Vector3().fromBufferAttribute(p,i)),h=new THREE.Raycaster(v.clone().add(new THREE.Vector3(0,0,-1)),new THREE.Vector3(0,0,1)).intersectObject(support)[0];check(h&&Math.abs(v.z-h.point.z+(name==='AirshipCabinRearWindow'?.016:.01))<.003,'airship rear window detached');}}
   const saved=[];root.traverse(o=>saved.push([o,o.position.clone(),o.quaternion.clone(),o.scale.clone()]));for(const clip of clips){const mixer=new THREE.AnimationMixer(root);mixer.clipAction(clip).play();for(const phase of [0,.125,.25,.5,.75]){mixer.setTime(clip.duration*phase);root.updateMatrixWorld(true);for(const side of [-1,1])for(const kind of ['Sleeve','Boot']){const limb=root.getObjectByName('Airship'+kind+side+'Solid');check(limb&&inside(limb,[cabin,hips,hull])>3,'airship '+kind+' detached during '+clip.name+' '+phase);}}mixer.stopAllAction();}for(const[o,p,q,s]of saved){o.position.copy(p);o.quaternion.copy(q);o.scale.copy(s);}root.updateMatrixWorld(true);
  }
 }
 if(profile.id==='vehicle-airplane'){
  root.updateMatrixWorld(true);const hull=root.getObjectByName('AirplaneRoundedFuselageSolid'),tail=root.getObjectByName('AirplaneTailFinSolid'),torso=root.getObjectByName('AirplaneShortSuitSolid');
  const hit=(o,x,y,rear=false)=>new THREE.Raycaster(root.localToWorld(new THREE.Vector3((x-320)*.005,(580-y)*.005,rear?-5:5)),new THREE.Vector3(0,0,rear?1:-1)).intersectObject(o)[0];
  const inside=(o,supports)=>{const p=o.geometry.attributes.position;let count=0;for(let i=0;i<p.count;i+=7){const v=o.localToWorld(new THREE.Vector3().fromBufferAttribute(p,i));for(const support of supports){const a=new THREE.Raycaster(v.clone().add(new THREE.Vector3(0,0,4)),new THREE.Vector3(0,0,-1)).intersectObject(support)[0],b=new THREE.Raycaster(v.clone().add(new THREE.Vector3(0,0,-4)),new THREE.Vector3(0,0,1)).intersectObject(support)[0];if(a&&b&&v.z<a.point.z&&v.z>b.point.z){count++;break;}}}return count;};
  check(hull&&tail&&torso&&!root.getObjectByName('OriginalFace'),'airplane requires a real rounded fuselage and source face on its surface');
  if(hull&&tail&&torso){
   check(new THREE.Box3().setFromObject(hull).getSize(new THREE.Vector3()).z>1.75,'airplane fuselage lacks real depth');
   for(const[x,y]of [[318,125],[180,272],[455,272],[318,405]])check(hit(hull,x,y),'airplane source hull silhouette missing');
   const art=root.getObjectByName('AirplaneRoundedFuselageSolidOriginalPaint');for(const[x,y]of [[264,296],[372,296],[318,344],[278,173],[357,173]])check(art&&hit(art,x,y),'airplane original expression/cockpit missing');
   check(inside(tail,[hull])>4,'airplane tail is floating above the fuselage');check(inside(torso,[hull])>3,'airplane short body detached from head');
   check(new THREE.Box3().setFromObject(torso).getSize(new THREE.Vector3()).y<.52,'airplane wearer torso too tall');
   for(const side of [-1,1]){const wing=root.getObjectByName('AirplaneWing'+side+'Solid'),engine=root.getObjectByName('AirplaneEngine'+side+'Solid'),stabilizer=root.getObjectByName('AirplaneRearStabilizer'+side+'Solid');check(wing&&inside(wing,[hull])>4,'airplane main wing detached');check(engine&&inside(engine,[wing])>3,'airplane engine detached from wing');check(stabilizer&&inside(stabilizer,[hull])>3,'airplane rear stabilizer detached');check(!hit(engine,320+side*186,343),'airplane intake must be an actual open annulus');check(hit(root.getObjectByName('AirplaneIntakeRecess'+side),320+side*186,343),'airplane recessed intake missing');}
   const saved=[];root.traverse(o=>saved.push([o,o.position.clone(),o.quaternion.clone(),o.scale.clone()]));for(const clip of clips){const mixer=new THREE.AnimationMixer(root);mixer.clipAction(clip).play();for(const phase of [0,.125,.25,.5,.75]){mixer.setTime(clip.duration*phase);root.updateMatrixWorld(true);for(const side of [-1,1])for(const kind of ['Sleeve','Boot']){const limb=root.getObjectByName('Airplane'+kind+side+'Solid');check(limb&&inside(limb,[torso,hull])>3,'airplane '+kind+' detached during '+clip.name+' '+phase);}}mixer.stopAllAction();}for(const[o,p,q,s]of saved){o.position.copy(p);o.quaternion.copy(q);o.scale.copy(s);}root.updateMatrixWorld(true);
  }
 }
 if(profile.id==='vehicle-submarine'){
  root.updateMatrixWorld(true);const hull=root.getObjectByName('SubmarineHullSolid'),tower=root.getObjectByName('SubmarineTowerSolid'),scope=root.getObjectByName('SubmarinePeriscopeSolid'),shaft=root.getObjectByName('SubmarinePropellerShaftSolid');
  const hit=(o,x,y,rear=false)=>new THREE.Raycaster(root.localToWorld(new THREE.Vector3((x-320)*.005,(580-y)*.005,rear?-4:4)),new THREE.Vector3(0,0,rear?1:-1)).intersectObject(o)[0],overlap=(a,b,x,y)=>{const af=hit(a,x,y),ar=hit(a,x,y,true),bf=hit(b,x,y),br=hit(b,x,y,true);return af&&ar&&bf&&br&&Math.max(ar.point.z,br.point.z)<Math.min(af.point.z,bf.point.z);};
  check(hull&&tower&&scope&&shaft&&!root.getObjectByName('Torso')&&!root.getObjectByName('OriginalFace'),'submarine needs a shaped hull and fitted original face without extra torso or flat face disk');
  if(hull&&tower&&scope&&shaft){
   check(new THREE.Box3().setFromObject(hull).getSize(new THREE.Vector3()).z>1.45,'submarine needs rounded hull depth');for(const[x,y]of [[55,365],[275,211],[531,365],[283,520]])check(hit(hull,x,y),'submarine source silhouette landmark missing');
   const art=root.getObjectByName('SubmarineHullSolidOriginalPaint');for(const[x,y]of [[211,347],[295,347],[255,384]])check(art&&hit(art,x,y),'submarine source expression missing');
   check(overlap(hull,tower,300,216)&&overlap(tower,scope,295,152),'submarine tower/periscope disconnected');check(overlap(hull,shaft,535,360),'submarine propeller shaft disconnected from hull');
   for(const side of [-1,1])for(const kind of ['Main','Small']){const rim=root.getObjectByName('Submarine'+kind+'WindowFrame'+side+'Solid');check(rim,'submarine window frame missing');if(rim){const p=rim.geometry.attributes.position;for(let i=0;i<p.count;i+=47){const v=rim.localToWorld(new THREE.Vector3().fromBufferAttribute(p,i)),h=new THREE.Raycaster(v.clone().add(new THREE.Vector3(0,0,side)),new THREE.Vector3(0,0,-side)).intersectObject(hull)[0];check(h&&Math.abs(v.z-h.point.z)<.045,'submarine window frame floats away or sinks too deeply');}}}
   const inside=(o,supports)=>{const p=o.geometry.attributes.position;let n=0;for(let i=0;i<p.count;i+=9){const v=o.localToWorld(new THREE.Vector3().fromBufferAttribute(p,i));for(const support of supports){const a=new THREE.Raycaster(v.clone().add(new THREE.Vector3(0,0,4)),new THREE.Vector3(0,0,-1)).intersectObject(support)[0],b=new THREE.Raycaster(v.clone().add(new THREE.Vector3(0,0,-4)),new THREE.Vector3(0,0,1)).intersectObject(support)[0];if(a&&b&&v.z<a.point.z&&v.z>b.point.z){n++;break;}}}return n;};
   for(const kind of ['Upper','Lower']){const fin=root.getObjectByName('SubmarineTail'+kind+'Solid');check(fin&&inside(fin,[hull])>3,'submarine tail fin detached');}
   const saved=[];root.traverse(o=>saved.push([o,o.position.clone(),o.quaternion.clone(),o.scale.clone()]));for(const clip of clips){if(clip.name==='Walk')check(clip.tracks.some(t=>t.name==='SubmarinePropeller.quaternion'&&Math.max(...t.values)-Math.min(...t.values)>1.9),'submarine propeller must rotate during travel');const mixer=new THREE.AnimationMixer(root);mixer.clipAction(clip).play();for(const phase of [0,.125,.25,.5,.75]){mixer.setTime(clip.duration*phase);root.updateMatrixWorld(true);for(const side of [-1,1])for(const kind of ['SideFlipper','Boot','PropellerBlade']){const o=root.getObjectByName('Submarine'+kind+side+'Solid');check(o&&inside(o,kind==='PropellerBlade'?[shaft]:[hull])>3,'submarine '+kind+' detached in '+clip.name+' '+phase);}}mixer.stopAllAction();}for(const[o,p,q,s]of saved){o.position.copy(p);o.quaternion.copy(q);o.scale.copy(s);}root.updateMatrixWorld(true);
  }
 }
 if(profile.id==='vehicle-hot-air-balloon'){
  root.updateMatrixWorld(true);const envelope=root.getObjectByName('BalloonEnvelopeSolid'),neck=root.getObjectByName('BalloonShortNeckSolid'),basket=root.getObjectByName('BalloonBasketSolid'),rim=root.getObjectByName('BalloonBasketRim');
  const hit=(o,x,y,rear=false)=>new THREE.Raycaster(root.localToWorld(new THREE.Vector3((x-320)*.005,(580-y)*.005,rear?-4:4)),new THREE.Vector3(0,0,rear?1:-1)).intersectObject(o)[0],overlap=(a,b,x,y)=>{const af=hit(a,x,y),ar=hit(a,x,y,true),bf=hit(b,x,y),br=hit(b,x,y,true);return af&&ar&&bf&&br&&Math.max(ar.point.z,br.point.z)<Math.min(af.point.z,bf.point.z);};
  check(envelope&&neck&&basket&&rim&&!root.getObjectByName('OriginalFace')&&!root.getObjectByName('Torso'),'balloon needs one painted envelope and a short connected basket without duplicated face or torso');
  if(envelope&&neck&&basket&&rim){
   check(new THREE.Box3().setFromObject(envelope).getSize(new THREE.Vector3()).z>1.8,'balloon envelope must have round depth');check(new THREE.Box3().setFromObject(basket).getSize(new THREE.Vector3()).y<.45,'balloon basket too tall');
   for(const[x,y]of [[320,63],[150,231],[490,245],[270,427]])check(hit(envelope,x,y),'balloon original envelope landmark missing');
   const art=root.getObjectByName('BalloonEnvelopeSolidOriginalPaint');for(const[x,y]of [[271,302],[368,302],[319,345]])check(art&&hit(art,x,y),'balloon original expression missing');
   check(overlap(envelope,neck,320,433)&&overlap(neck,basket,320,478),'balloon collar must enter envelope and basket');check(overlap(basket,rim,388,480),'balloon rolled rim detached');
   const colors=envelope.geometry.attributes.color;check(new Set(Array.from({length:colors.count},(_,i)=>[colors.getY(i)/colors.getX(i),colors.getZ(i)/colors.getX(i)].map(v=>v.toFixed(3)).join(','))).size===2,'balloon gores need exactly the red and ivory base colors');
   const inside=(o,supports)=>{const p=o.geometry.attributes.position;let n=0;for(let i=0;i<p.count;i+=9){const v=o.localToWorld(new THREE.Vector3().fromBufferAttribute(p,i));for(const support of supports){const a=new THREE.Raycaster(v.clone().add(new THREE.Vector3(0,0,4)),new THREE.Vector3(0,0,-1)).intersectObject(support)[0],b=new THREE.Raycaster(v.clone().add(new THREE.Vector3(0,0,-4)),new THREE.Vector3(0,0,1)).intersectObject(support)[0];if(a&&b&&v.z<a.point.z&&v.z>b.point.z){n++;break;}}}return n;};
   const saved=[];root.traverse(o=>saved.push([o,o.position.clone(),o.quaternion.clone(),o.scale.clone()]));for(const clip of clips){const mixer=new THREE.AnimationMixer(root);mixer.clipAction(clip).play();for(const phase of [0,.125,.25,.5,.75]){mixer.setTime(clip.duration*phase);root.updateMatrixWorld(true);for(const side of [-1,1])for(const kind of ['Mitten','Boot']){const o=root.getObjectByName('Balloon'+kind+side+'Solid');check(o&&inside(o,[neck,basket])>3,'balloon '+kind+' detached during '+clip.name+' '+phase);}}mixer.stopAllAction();}for(const[o,p,q,s]of saved){o.position.copy(p);o.quaternion.copy(q);o.scale.copy(s);}root.updateMatrixWorld(true);
  }
 }
 if(profile.id==='vehicle-rocket'){
  root.updateMatrixWorld(true);const hull=root.getObjectByName('RocketContinuousHullSolid'),flame=root.getObjectByName('RocketFlameSolid'),head=root.getObjectByName('Head'),hit=(o,x,y)=>new THREE.Raycaster(root.localToWorld(new THREE.Vector3((x-320)*.005,(580-y)*.005,4)),new THREE.Vector3(0,0,-1)).intersectObject(o)[0];
  check(hull&&flame&&!root.getObjectByName('RocketNose')&&!root.getObjectByName('Torso'),'rocket needs one continuous nose/hull/band body without a wearer');
  if(hull&&flame){
   check(new THREE.Box3().setFromObject(hull).getSize(new THREE.Vector3()).z>1.3,'rocket body needs round depth');for(const[x,y]of [[320,70],[410,151],[184,290],[449,300],[320,499]])check(hit(hull,x,y),'rocket original silhouette landmark missing');
   const art=root.getObjectByName('RocketContinuousHullSolidOriginalPaint');for(const[x,y]of [[271,298],[366,298],[319,342]])check(art&&hit(art,x,y),'rocket original facial features missing');
   const inside=(o,support)=>{const p=o.geometry.attributes.position;let n=0;for(let i=0;i<p.count;i+=9){const v=o.localToWorld(new THREE.Vector3().fromBufferAttribute(p,i)),a=new THREE.Raycaster(v.clone().add(new THREE.Vector3(0,0,4)),new THREE.Vector3(0,0,-1)).intersectObject(support)[0],b=new THREE.Raycaster(v.clone().add(new THREE.Vector3(0,0,-4)),new THREE.Vector3(0,0,1)).intersectObject(support)[0];if(a&&b&&v.z<a.point.z&&v.z>b.point.z)n++;}return n;};
   for(const side of [-1,1])for(const kind of ['Side','Axial']){const fin=root.getObjectByName('Rocket'+kind+'Fin'+side+'Solid');check(fin&&inside(fin,hull)>3,'rocket fin detached: '+kind+side);if(fin&&kind==='Axial')check(new THREE.Box3().setFromObject(fin).getSize(new THREE.Vector3()).z>.45,'rocket axial fin must curve outward, not form a flat bar');}
   const core=root.getObjectByName('RocketRearFlameCore');check(core,'rocket flame needs a visible rear core');if(core){const p=core.geometry.attributes.position;for(let i=0;i<p.count;i+=19){const v=core.localToWorld(new THREE.Vector3().fromBufferAttribute(p,i)),h=new THREE.Raycaster(v.clone().add(new THREE.Vector3(0,0,-1)),new THREE.Vector3(0,0,1)).intersectObject(flame)[0];check(h&&Math.abs(h.distance-1.004)<.008,'rocket rear flame core detached');}}
   const saved=[];root.traverse(o=>saved.push([o,o.position.clone(),o.quaternion.clone(),o.scale.clone()]));for(const clip of clips){const track=clip.tracks.find(t=>t.name==='RocketExhaust.scale');check(track&&Math.max(...track.values)-Math.min(...track.values)>.1,'rocket exhaust pulse missing');const mixer=new THREE.AnimationMixer(root);mixer.clipAction(clip).play();for(const phase of [0,.0625,.125,.25,.5,.75]){mixer.setTime(clip.duration*phase);root.updateMatrixWorld(true);check(inside(flame,hull)>3,'rocket flame root detaches during '+clip.name+' '+phase);}mixer.stopAllAction();}for(const[o,p,q,s]of saved){o.position.copy(p);o.quaternion.copy(q);o.scale.copy(s);}root.updateMatrixWorld(true);
  }
 }
 if(profile.id==='award-trophy'){
  root.updateMatrixWorld(true);const cup=root.getObjectByName('TrophyRoundedCupSolid'),rim=root.getObjectByName('TrophyRolledRimSolid'),stem=root.getObjectByName('TrophyShortStemSolid'),base=root.getObjectByName('TrophyWoodBaseSolid'),hit=(o,x,y,rear=false)=>new THREE.Raycaster(root.localToWorld(new THREE.Vector3((x-320)*.005,(580-y)*.005,rear?-4:4)),new THREE.Vector3(0,0,rear?1:-1)).intersectObject(o)[0],overlap=(a,b,x,y)=>{const af=hit(a,x,y),ar=hit(a,x,y,true),bf=hit(b,x,y),br=hit(b,x,y,true);return af&&ar&&bf&&br&&Math.max(ar.point.z,br.point.z)<Math.min(af.point.z,bf.point.z);};
  check(cup&&rim&&stem&&base&&!root.getObjectByName('NeckJoin'),'trophy requires authored cup, rolled rim and short pedestal');
  if(cup&&rim&&stem&&base){
   check(new THREE.Box3().setFromObject(cup).getSize(new THREE.Vector3()).z>1.5,'trophy cup needs actual round depth');check(new THREE.Box3().setFromObject(stem).getSize(new THREE.Vector3()).y<.50,'trophy pedestal too long');check(overlap(cup,stem,320,390)&&overlap(stem,base,320,475),'trophy cup/stem/base detached');check(overlap(cup,rim,480,99),'trophy rolled rim detached');
   for(const[x,y]of [[165,120],[474,122],[320,388]])check(hit(cup,x,y),'trophy original cup silhouette missing');
   const art=root.getObjectByName('TrophyRoundedCupSolidOriginalPaint');for(const[x,y]of [[263,250],[375,250],[320,300]])check(art&&hit(art,x,y),'trophy original facial features missing');
   const inside=(o,supports)=>{let n=0;const p=o.geometry.attributes.position;for(let i=0;i<p.count;i+=9){const v=o.localToWorld(new THREE.Vector3().fromBufferAttribute(p,i));for(const support of supports){const a=new THREE.Raycaster(v.clone().add(new THREE.Vector3(0,0,4)),new THREE.Vector3(0,0,-1)).intersectObject(support)[0],b=new THREE.Raycaster(v.clone().add(new THREE.Vector3(0,0,-4)),new THREE.Vector3(0,0,1)).intersectObject(support)[0];if(a&&b&&v.z<a.point.z&&v.z>b.point.z){n++;break;}}}return n;};
   for(const side of [-1,1]){const handle=root.getObjectByName('TrophyHandle'+side+'Solid');check(handle&&inside(handle,[cup])>3,'trophy handle detached');for(const j of [0,1])check(root.getObjectByName('TrophyHandleTip'+side+'_'+j),'trophy handle end needs rounded finish');}
   const saved=[];root.traverse(o=>saved.push([o,o.position.clone(),o.quaternion.clone(),o.scale.clone()]));for(const clip of clips){const mixer=new THREE.AnimationMixer(root);mixer.clipAction(clip).play();for(const phase of [0,.25,.5,.75]){mixer.setTime(clip.duration*phase);root.updateMatrixWorld(true);for(const side of [-1,1])for(const type of ['Sleeve','Foot']){const limb=root.getObjectByName('Trophy'+type+side+'Solid');check(limb&&inside(limb,[stem,base])>3,'trophy limb detached in '+clip.name+' '+phase+': '+type+side);}}mixer.stopAllAction();}for(const[o,p,q,s]of saved){o.position.copy(p);o.quaternion.copy(q);o.scale.copy(s);}root.updateMatrixWorld(true);
  }
 }
 if(profile.id==='game-dice'){
  root.updateMatrixWorld(true);const cube=root.getObjectByName('DiceRoundedCubeSolid'),body=root.getObjectByName('DiceShortSuitSolid'),hit=(o,x,y,rear=false)=>new THREE.Raycaster(root.localToWorld(new THREE.Vector3((x-320)*.005,(580-y)*.005,rear?-4:4)),new THREE.Vector3(0,0,rear?1:-1)).intersectObject(o)[0];
  check(cube&&body&&!root.getObjectByName('NeckJoin'),'dice requires an authored rounded cube and short connected wearer');
  if(cube&&body){
   const size=new THREE.Box3().setFromObject(cube).getSize(new THREE.Vector3());check(size.z>1.8&&size.x>1.8,'dice must have genuine tilted three-dimensional faces');check(new THREE.Box3().setFromObject(body).getSize(new THREE.Vector3()).y<.65,'dice torso too long');
   for(const[x,y]of [[145,210],[385,420],[490,120],[275,82]])check(hit(cube,x,y),'dice original silhouette landmark missing');
   const paint=root.getObjectByName('DiceRoundedCubeSolidOriginalPaint');for(const[x,y]of [[210,310],[310,310],[259,358],[274,92],[485,175]])check(paint&&hit(paint,x,y),'dice source face/pip artwork missing');
   const a=hit(cube,300,423),b=hit(cube,300,423,true),c=hit(body,300,423),d=hit(body,300,423,true);check(a&&b&&c&&d&&Math.max(b.point.z,d.point.z)<Math.min(a.point.z,c.point.z),'dice head and short suit do not physically overlap');
   for(const[side,count]of [['rear',6],['left',3],['bottom',2]]){const dots=[];root.traverse(o=>{if(new RegExp('^DicePip'+side+'[0-9]+$').test(o.name))dots.push(o);});check(dots.length===count,'dice hidden face pip count wrong: '+side);for(const dot of dots){const p=dot.geometry.attributes.position,n=dot.geometry.attributes.normal,v=dot.localToWorld(new THREE.Vector3().fromBufferAttribute(p,p.count-1)),normal=new THREE.Vector3().fromBufferAttribute(n,p.count-1).transformDirection(dot.matrixWorld),ray=new THREE.Raycaster(v.clone().addScaledVector(normal,.10),normal.clone().negate()),h=ray.intersectObject(cube)[0];check(h&&Math.abs(h.distance-.102)<.007,'dice pip faces inward or floats away: '+dot.name);}}
   const saved=[];root.traverse(o=>saved.push([o,o.position.clone(),o.quaternion.clone(),o.scale.clone()]));for(const clip of clips){const mixer=new THREE.AnimationMixer(root);mixer.clipAction(clip).play();for(const phase of [0,.25,.5,.75]){mixer.setTime(clip.duration*phase);root.updateMatrixWorld(true);for(const side of [-1,1])for(const type of ['Sleeve','Foot']){const o=root.getObjectByName('Dice'+type+side+'Solid'),p=o.geometry.attributes.position;let inside=0;for(let i=0;i<p.count;i+=11){const v=o.localToWorld(new THREE.Vector3().fromBufferAttribute(p,i)),a=new THREE.Raycaster(v.clone().add(new THREE.Vector3(0,0,4)),new THREE.Vector3(0,0,-1)).intersectObject(body)[0],b=new THREE.Raycaster(v.clone().add(new THREE.Vector3(0,0,-4)),new THREE.Vector3(0,0,1)).intersectObject(body)[0];if(a&&b&&v.z<a.point.z&&v.z>b.point.z)inside++;}check(inside>3,'dice limb detached in '+clip.name+' '+phase+': '+type+side);}}mixer.stopAllAction();}for(const[o,p,q,s]of saved){o.position.copy(p);o.quaternion.copy(q);o.scale.copy(s);}root.updateMatrixWorld(true);
  }
 }
 if(['vegetable-broccoli','vegetable-corn'].includes(profile.id)){
  root.updateMatrixWorld(true);const broccoli=profile.id.endsWith('broccoli'),body=root.getObjectByName(broccoli?'BroccoliShortSuitSolid':'CornHuskCupSolid'),head=root.getObjectByName(broccoli?'BroccoliBranchHoodSolid':'CornCobSolid'),box=o=>new THREE.Box3().setFromObject(o),hit=(o,x,y,rear=false)=>new THREE.Raycaster(root.localToWorld(new THREE.Vector3((x-320)*.005,(580-y)*.005,rear?-4:4)),new THREE.Vector3(0,0,rear?1:-1)).intersectObject(o)[0],overlap=(a,b,x,y)=>{const af=hit(a,x,y),ar=hit(a,x,y,true),bf=hit(b,x,y),br=hit(b,x,y,true);return af&&ar&&bf&&br&&Math.max(ar.point.z,br.point.z)<Math.min(af.point.z,bf.point.z);};
  check(head&&body&&!root.getObjectByName('NeckJoin'),'canopy vegetable requires a connected authored head/body');
  if(head&&body){check(overlap(head,body,320,broccoli?442:473),'canopy vegetable head/body detached');
   if(broccoli){const bridge=root.getObjectByName('BroccoliCrownBridgeSolid');check(bridge&&hit(bridge,239,260)&&hit(bridge,401,260),'broccoli must fill the source stem between its crowns');check(box(body).getSize(new THREE.Vector3()).y<.60,'broccoli torso too long');for(const[j,x,y]of [[0,125,260],[1,519,247],[2,320,75]]){const crown=root.getObjectByName('BroccoliCrown'+j+'Solid');check(crown&&hit(crown,x,y),'broccoli original crown silhouette missing');if(crown)check(box(crown).getSize(new THREE.Vector3()).z>.8,'broccoli crown must have rounded depth');}for(const side of [-1,1]){const branch=root.getObjectByName('BroccoliSupportingBranch'+side+'Solid'),crown=root.getObjectByName('BroccoliCrown'+(side<0?0:1)+'Solid');check(branch&&crown&&box(branch).intersectsBox(box(crown))&&box(branch).intersectsBox(box(head)),'broccoli supporting branch detached');}}
   else{
    check(!root.getObjectByName('Torso'),'corn must be its own husk-covered costume');check(box(head).getSize(new THREE.Vector3()).z>1,'corn requires a real rounded cob');for(const[x,y]of [[320,72],[259,170],[381,176],[320,311]])check(hit(head,x,y),'corn original top/face landmark missing');
    let loose=0;root.traverse(o=>{if(/^CornKernel/.test(o.name))loose++;});check(loose===0,'corn kernel relief must share one continuous cob surface');
    for(const name of ['CornFrontHusk0Solid','CornFrontHusk1Solid','CornUprightLeaf-1Solid','CornUprightLeaf1Solid']){const leaf=root.getObjectByName(name);check(leaf,'corn leaf missing');if(!leaf)continue;const p=leaf.geometry.attributes.position,ix=leaf.geometry.index.array;let folded=0,inside=0;for(let i=0;i<ix.length/2;i+=3){const a=ix[i],b=ix[i+1],c=ix[i+2];if((p.getX(b)-p.getX(a))*(p.getY(c)-p.getY(a))-(p.getY(b)-p.getY(a))*(p.getX(c)-p.getX(a))<-.0000001)folded++;}check(!folded,'corn leaf folds over original artwork');for(let i=0;i<p.count;i+=9){const v=leaf.localToWorld(new THREE.Vector3().fromBufferAttribute(p,i));for(const support of [head,body]){const a=new THREE.Raycaster(new THREE.Vector3(v.x,v.y,v.z+4),new THREE.Vector3(0,0,-1)).intersectObject(support)[0],b=new THREE.Raycaster(new THREE.Vector3(v.x,v.y,v.z-4),new THREE.Vector3(0,0,1)).intersectObject(support)[0];if(a&&b&&v.z<a.point.z&&v.z>b.point.z){inside++;break;}}}check(inside>6,'corn leaf floats away from its actual support: '+name);}
    const paint=root.getObjectByName('CornCobSolidOriginalPaint');check(paint&&hit(paint,270,305)&&hit(paint,370,305)&&hit(paint,320,354),'corn original facial features must remain on the cob');
    const p=head.geometry.attributes.position;let back=0;for(let i=0;i<p.count;i++){const v=new THREE.Vector3().fromBufferAttribute(p,i);head.localToWorld(v);root.worldToLocal(v);if(v.z<-.4)back++;}check(back>100,'corn rear kernel surface missing');
   }
   const saved=[];root.traverse(o=>saved.push([o,o.position.clone(),o.quaternion.clone(),o.scale.clone()]));for(const clip of clips){const mixer=new THREE.AnimationMixer(root);mixer.clipAction(clip).play();for(const phase of [0,.25,.5,.75]){mixer.setTime(clip.duration*phase);root.updateMatrixWorld(true);for(const side of [-1,1])for(const name of ['CanopyFoot'+side+'Solid',...(broccoli?['BroccoliSleeve'+side+'Solid']:[])]){const o=root.getObjectByName(name);if(!o){check(false,'canopy vegetable limb missing');continue;}const p=o.geometry.attributes.position;let inside=0;for(let i=0;i<p.count;i+=11){const v=o.localToWorld(new THREE.Vector3().fromBufferAttribute(p,i)),a=new THREE.Raycaster(new THREE.Vector3(v.x,v.y,v.z+4),new THREE.Vector3(0,0,-1)).intersectObject(body)[0],b=new THREE.Raycaster(new THREE.Vector3(v.x,v.y,v.z-4),new THREE.Vector3(0,0,1)).intersectObject(body)[0];if(a&&b&&v.z<a.point.z&&v.z>b.point.z)inside++;}check(inside>3,'canopy vegetable limb detached in '+clip.name+' '+phase+': '+name);}}mixer.stopAllAction();}for(const[o,p,q,s]of saved){o.position.copy(p);o.quaternion.copy(q);o.scale.copy(s);}root.updateMatrixWorld(true);
  }
 }
 if(['vegetable-potato','vegetable-sweet-potato','vegetable-mushroom'].includes(profile.id)){
  root.updateMatrixWorld(true);const mushroom=profile.id.endsWith('mushroom'),sweet=profile.id.endsWith('sweet-potato'),body=root.getObjectByName(mushroom?'MushroomShortSuitSolid':'RootCostumeSolid'),head=root.getObjectByName('MushroomFaceHoodSolid'),cap=root.getObjectByName('MushroomDomeSolid'),box=o=>new THREE.Box3().setFromObject(o),hit=(o,x,y,rear=false)=>new THREE.Raycaster(root.localToWorld(new THREE.Vector3((x-320)*.005,(580-y)*.005,rear?-4:4)),new THREE.Vector3(0,0,rear?1:-1)).intersectObject(o)[0],overlap=(a,b,x,y)=>{const af=hit(a,x,y),ar=hit(a,x,y,true),bf=hit(b,x,y),br=hit(b,x,y,true);return af&&ar&&bf&&br&&Math.max(ar.point.z,br.point.z)<Math.min(af.point.z,bf.point.z);};
  check(body&&!root.getObjectByName('NeckJoin'),'tuber/mushroom body missing or generic neck added');
  if(mushroom){check(head&&cap&&root.getObjectByName('MushroomCreamUnderside'),'mushroom needs rounded cap, face hood and separate cream underside');if(head&&cap&&body){check(box(cap).getSize(new THREE.Vector3()).z>1.8,'mushroom cap needs a real dome');check(overlap(head,cap,320,249),'mushroom head and cap detached');check(overlap(head,body,320,420),'mushroom chin must enter the short body');check(box(body).getSize(new THREE.Vector3()).y<.70,'mushroom body too tall');for(const[x,y]of [[320,260],[275,284],[365,287]]){const a=hit(head,x,y),b=hit(cap,x,y);check(a&&(!b||a.distance<b.distance),'mushroom cap obscures original forehead');}}}
  else{check(!root.getObjectByName('Torso'),'tubers must not add a separate torso');for(const[x,y]of sweet?[[309,73],[222,228],[445,318],[326,530]]:[[320,75],[197,180],[156,375],[480,400],[320,535]])check(body&&hit(body,x,y),'tuber source silhouette missing');}
  const marks=[];root.traverse(o=>{if(new RegExp(mushroom?'^MushroomRearSpot[0-9]+$':'^RootRearSkinMark[0-9]+$').test(o.name))marks.push(o);});check(marks.length===(mushroom?6:sweet?7:8),'rear marks missing');
  for(const o of marks){const p=o.geometry.attributes.position,n=o.geometry.attributes.normal;check(n.getZ(p.count-1)<0,'rear mark faces inward');for(let i=0;i<p.count;i+=17){const v=o.localToWorld(new THREE.Vector3().fromBufferAttribute(p,i)),h=new THREE.Raycaster(v.clone().add(new THREE.Vector3(0,0,-1)),new THREE.Vector3(0,0,1)).intersectObject(mushroom?cap:body)[0];check(h&&Math.abs(v.z-h.point.z)<.012,'rear mark floats from its surface');}}
  if(body){const saved=[];root.traverse(o=>saved.push([o,o.position.clone(),o.quaternion.clone(),o.scale.clone()]));for(const clip of clips){const mixer=new THREE.AnimationMixer(root);mixer.clipAction(clip).play();for(const phase of [0,.25,.5,.75]){mixer.setTime(clip.duration*phase);root.updateMatrixWorld(true);for(const side of [-1,1])for(const name of [(mushroom?'MushroomFoot':'RootFoot')+side+'Solid',...((mushroom||sweet)?[(mushroom?'MushroomSleeve':'RootSleeve')+side+'Solid']:[])]){const o=root.getObjectByName(name);if(!o){check(false,'tuber/mushroom limb missing');continue;}const p=o.geometry.attributes.position;let inside=0;for(let i=0;i<p.count;i+=11){const v=o.localToWorld(new THREE.Vector3().fromBufferAttribute(p,i)),a=new THREE.Raycaster(new THREE.Vector3(v.x,v.y,v.z+4),new THREE.Vector3(0,0,-1)).intersectObject(body)[0],b=new THREE.Raycaster(new THREE.Vector3(v.x,v.y,v.z-4),new THREE.Vector3(0,0,1)).intersectObject(body)[0];if(a&&b&&v.z<a.point.z&&v.z>b.point.z)inside++;}check(inside>3,'tuber/mushroom limb detached in '+clip.name+' '+phase+': '+name);}}mixer.stopAllAction();}for(const[o,p,q,s]of saved){o.position.copy(p);o.quaternion.copy(q);o.scale.copy(s);}root.updateMatrixWorld(true);}
 }
 if(['vegetable-carrot','vegetable-radish','vegetable-eggplant'].includes(profile.id)){
  root.updateMatrixWorld(true);const carrot=profile.id.endsWith('carrot'),radish=profile.id.endsWith('radish'),egg=!carrot&&!radish,body=root.getObjectByName('RootCostumeSolid'),box=o=>new THREE.Box3().setFromObject(o),hit=(o,x,y,rear=false)=>new THREE.Raycaster(root.localToWorld(new THREE.Vector3((x-320)*.005,(580-y)*.005,rear?-4:4)),new THREE.Vector3(0,0,rear?1:-1)).intersectObject(o)[0];
  check(body&&!root.getObjectByName('Torso')&&!root.getObjectByName('NeckJoin'),'root vegetable must be the whole costume, without an extra torso');
  if(body){
   check(box(body).getSize(new THREE.Vector3()).z>1,'root vegetable needs rounded depth');
   for(const[x,y]of egg?[[320,140],[240,270],[400,480],[320,532]]:radish?[[320,215],[205,320],[435,345],[320,525]]:[[320,219],[211,290],[430,315],[320,540]])check(hit(body,x,y),'root vegetable source contour missing at '+x+','+y);
   const tops=egg?[root.getObjectByName('EggplantCalyxSolid')]:[0,1,2].map(j=>root.getObjectByName('RootLeaf'+j+'Solid'));
   check(tops.every(Boolean),'root vegetable crown missing');
   for(const o of tops.filter(Boolean)){check(box(o).intersectsBox(box(body)),'root vegetable crown detached');check(box(o).getSize(new THREE.Vector3()).z>.15,'root vegetable crown needs curved depth, not a flat plate');const p=o.geometry.attributes.position,ix=o.geometry.index.array;let folded=0;for(let i=0;i<ix.length/2;i+=3){const a=ix[i],b=ix[i+1],c=ix[i+2];if((p.getX(b)-p.getX(a))*(p.getY(c)-p.getY(a))-(p.getY(b)-p.getY(a))*(p.getX(c)-p.getX(a))<-.0000001)folded++;}check(!folded,'root vegetable crown front must not fold');}
   for(const[x,y,j]of egg?[[313,75,0],[313,194,0],[245,170,0]]:[[320,carrot?111:78,1],[245,145,0],[395,145,2]])check(tops[j]&&hit(tops[j],x,y),'root vegetable original leaf/calyx landmark missing');
   const saved=[];root.traverse(o=>saved.push([o,o.position.clone(),o.quaternion.clone(),o.scale.clone()]));
   for(const clip of clips){const mixer=new THREE.AnimationMixer(root);mixer.clipAction(clip).play();for(const phase of [0,.25,.5,.75]){mixer.setTime(clip.duration*phase);root.updateMatrixWorld(true);for(const side of [-1,1])for(const name of ['RootFoot'+side+'Solid',...(!egg?['RootSleeve'+side+'Solid']:[])]){const o=root.getObjectByName(name);if(!o){check(false,'root vegetable limb missing');continue;}const p=o.geometry.attributes.position;let inside=0;for(let i=0;i<p.count;i+=11){const v=o.localToWorld(new THREE.Vector3().fromBufferAttribute(p,i)),a=new THREE.Raycaster(new THREE.Vector3(v.x,v.y,v.z+4),new THREE.Vector3(0,0,-1)).intersectObject(body)[0],b=new THREE.Raycaster(new THREE.Vector3(v.x,v.y,v.z-4),new THREE.Vector3(0,0,1)).intersectObject(body)[0];if(a&&b&&v.z<a.point.z&&v.z>b.point.z)inside++;}check(inside>3,'root vegetable limb loses physical contact in '+clip.name+' phase '+phase+': '+name);}}mixer.stopAllAction();}
   for(const[o,p,q,s]of saved){o.position.copy(p);o.quaternion.copy(q);o.scale.copy(s);}root.updateMatrixWorld(true);
  }
 }
 if(['vegetable-bell-pepper','vegetable-pumpkin','vegetable-tomato'].includes(profile.id)){
  root.updateMatrixWorld(true);const pepper=profile.id.endsWith('bell-pepper'),pumpkin=profile.id.endsWith('pumpkin'),head=root.getObjectByName('VegetableHeadSolid'),torso=root.getObjectByName('VegetableShortSuitSolid'),stem=root.getObjectByName(pepper||pumpkin?'VegetableStemSolid':'TomatoCalyxSolid'),box=o=>new THREE.Box3().setFromObject(o);
  const hit=(o,x,y,rear=false)=>new THREE.Raycaster(root.localToWorld(new THREE.Vector3((x-320)*.005,(580-y)*.005,rear?-4:4)),new THREE.Vector3(0,0,rear?1:-1)).intersectObject(o)[0],overlap=(a,b,x,y)=>{const af=hit(a,x,y),ar=hit(a,x,y,true),bf=hit(b,x,y),br=hit(b,x,y,true);return af&&ar&&bf&&br&&Math.max(ar.point.z,br.point.z)<Math.min(af.point.z,bf.point.z);};
  check(head&&torso&&stem&&!root.getObjectByName('NeckJoin'),'round vegetable needs a source-shaped head, attached top and short suit');
  if(head&&torso&&stem){check(box(torso).getSize(new THREE.Vector3()).y<.65,'round vegetable torso too long');check(overlap(head,torso,320,pepper||pumpkin?445:430),'round vegetable head/torso detached');check(overlap(head,stem,320,pepper?151:pumpkin?149:141),'round vegetable stem or calyx detached');
   for(const[x,y]of pepper?[[290,74],[320,107]]:pumpkin?[[341,73],[322,113]]:[[328,75],[270,158],[369,155]])check(hit(stem,x,y),'round vegetable source stem/calyx landmark missing');
   for(const side of [-1,1]){const arm=root.getObjectByName('VegetableSleeve'+side+'Solid'),foot=root.getObjectByName('VegetableFoot'+side+'Solid');check(arm&&foot&&overlap(arm,torso,320+side*49,pepper||pumpkin?449:440)&&box(torso).intersectsBox(box(foot)),'round vegetable arm or foot detached');}
  }
  const grooves=[];root.traverse(o=>{if(/^VegetableRearGroove\d+$/.test(o.name))grooves.push(o);});check(grooves.length===(pumpkin?5:pepper?3:0),'round vegetable rear groove count');
  for(const groove of grooves){const p=groove.geometry.attributes.position;for(let j=0;j<p.count;j+=9*8){const v=new THREE.Vector3();for(let q=0;q<8;q++)v.add(new THREE.Vector3().fromBufferAttribute(p,j+q));v.multiplyScalar(1/8);groove.localToWorld(v);const support=new THREE.Raycaster(v.clone().add(new THREE.Vector3(0,0,-1)),new THREE.Vector3(0,0,1)).intersectObject(head)[0];check(support&&Math.abs(support.point.z-v.z)<.025,'round vegetable groove must touch its rear surface');}}
  if(stem){const p=stem.geometry.attributes.position,ix=stem.geometry.index.array;let folded=0;for(let j=0;j<ix.length/2;j+=3){const a=ix[j],b=ix[j+1],c=ix[j+2],area=(p.getX(b)-p.getX(a))*(p.getY(c)-p.getY(a))-(p.getY(b)-p.getY(a))*(p.getX(c)-p.getX(a));if(area<-.0000001)folded++;}check(!folded,'round vegetable top surface folds across its source paint');}
 }
 if(profile.id==='theme-tulip'){
  root.updateMatrixWorld(true);const petals=[0,1,2,3].map(i=>root.getObjectByName('SourceTulipPetal'+i+'Solid')),join=root.getObjectByName('TulipHiddenCalyxSolid'),torso=root.getObjectByName('TulipShortSuitSolid'),box=o=>new THREE.Box3().setFromObject(o);
  const hit=(o,x,y,rear=false)=>new THREE.Raycaster(root.localToWorld(new THREE.Vector3((x-320)*.005,(580-y)*.005,rear?-4:4)),new THREE.Vector3(0,0,rear?1:-1)).intersectObject(o)[0];
  check(petals.every(Boolean)&&join&&torso&&!root.getObjectByName('NeckJoin'),'tulip requires a closed petal cup and an attached short wearer');
  if(petals.every(Boolean)){
   for(const[x,y]of [[320,68],[180,100],[460,100],[164,260],[476,260],[320,397],[267,295],[373,295]])check(petals.some(o=>hit(o,x,y)),'tulip source tip, face or rounded contour missing at '+x+','+y);
   for(const o of petals){const p=o.geometry.attributes.position,n=o.geometry.attributes.normal;for(let i=0;i<p.count;i++){const v=new THREE.Vector3().fromBufferAttribute(p,i);o.localToWorld(v);root.worldToLocal(v);if(Math.abs(v.z)<.000001)check(Math.abs(n.getZ(i))<.00001,'tulip side seam normals must not point into the source face paint');}}
   check(box(petals[0]).getSize(new THREE.Vector3()).z>.5,'tulip must wrap around a real cup, not an extruded flat front');
   const ink=root.getObjectByName('TulipCupOutlineSupportInkShell'),paint=root.getObjectByName('SourceTulipPetal0SolidOriginalPaint');for(const y of [397,400,403,406]){const art=paint&&hit(paint,319,y),edge=ink&&hit(ink,319,y);check(art&&(!edge||art.distance<edge.distance),'tulip outline must not make dark wedges over the lower front artwork');}
   const a=hit(petals[0],319,409.8,true),b=hit(join,319,409.8);check(a&&b&&b.point.z>a.point.z,'tulip calyx must enter the bottom of its petal cup');for(const y of [390,397,403]){const face=hit(petals[0],319,y),calyx=hit(join,319,y);check(face&&(!calyx||face.distance<calyx.distance),'tulip calyx must not protrude through the lower front petal');}
  }
  if(join&&torso){check(box(torso).getSize(new THREE.Vector3()).y<.55&&box(join).intersectsBox(box(torso)),'tulip short wearer detached or too long');for(const side of [-1,1]){const leaf=root.getObjectByName('TulipCollarLeaf'+side+'Solid'),foot=root.getObjectByName('TulipFoot'+side+'Solid');check(leaf&&foot&&box(leaf).intersectsBox(box(join))&&box(torso).intersectsBox(box(foot)),'tulip collar leaf or foot detached');}}
 }
 if(['theme-balloons','theme-guitar'].includes(profile.id)){
  root.updateMatrixWorld(true);check(!root.getObjectByName('NeckJoin'),'held theme must not add a generic neck bead');
  const box=o=>new THREE.Box3().setFromObject(o),hit=(o,x,y,rear=false)=>new THREE.Raycaster(root.localToWorld(new THREE.Vector3((x-320)*.005,(580-y)*.005,rear?-4:4)),new THREE.Vector3(0,0,rear?1:-1)).intersectObject(o)[0],overlap=(a,b,x,y)=>{const af=hit(a,x,y),ar=hit(a,x,y,true),bf=hit(b,x,y),br=hit(b,x,y,true);return af&&ar&&bf&&br&&Math.max(ar.point.z,br.point.z)<Math.min(af.point.z,bf.point.z);};
  if(profile.id==='theme-balloons'){
   const balloons=[],cords=[];root.traverse(o=>{if(/^HeldBalloon\d+Solid$/.test(o.name))balloons.push(o);if(/^HeldBalloonCord\d+$/.test(o.name))cords.push(o);});check(balloons.length===8&&cords.length===8,'all eight source balloons need connected cords');
   for(let i=0;i<8;i++){const balloon=root.getObjectByName('HeldBalloon'+i+'Solid'),knot=root.getObjectByName('HeldBalloonKnot'+i+'Solid');check(balloon&&knot&&box(balloon).intersectsBox(box(knot)),'balloon knot detached');}
   const hood=root.getObjectByName('BalloonPilotHoodSolid'),top=root.getObjectByName('BalloonUpperHoodSolid');check(hood&&top&&hit(top,345,275)&&overlap(hood,top,318,315),'balloon hood must fill the upper source gap and connect to the face hood');
   const saved=[];root.traverse(o=>saved.push([o,o.position.clone(),o.quaternion.clone(),o.scale.clone()]));
   for(const clip of clips){const mixer=new THREE.AnimationMixer(root);mixer.clipAction(clip).play();for(const phase of [0,.25,.5,.75]){mixer.setTime(clip.duration*phase);root.updateMatrixWorld(true);for(const cord of cords){const hand=root.getObjectByName(cord.userData.hand),center=hand.getWorldPosition(new THREE.Vector3()),p=cord.geometry.attributes.position;let nearest=Infinity;for(let j=0;j<p.count;j+=9){const v=new THREE.Vector3();for(let a=0;a<8;a++)v.add(new THREE.Vector3().fromBufferAttribute(p,j+a));v.multiplyScalar(1/8);cord.localToWorld(v);nearest=Math.min(nearest,v.distanceTo(center));}check(nearest<.065,'balloon cord must remain inside its holding palm throughout '+clip.name);}}mixer.stopAllAction();}
   for(const[o,p,q,s]of saved){o.position.copy(p);o.quaternion.copy(q);o.scale.copy(s);}root.updateMatrixWorld(true);
   const suit=root.getObjectByName('BalloonShortSuitSolid');check(suit&&box(suit).getSize(new THREE.Vector3()).y<.65,'balloon wearer torso too long');for(const side of [-1,1]){const leg=root.getObjectByName('BalloonBlueLegSolid'+side),boot=root.getObjectByName('BalloonRedBootSolid'+side);check(suit&&leg&&boot&&box(suit).intersectsBox(box(leg))&&box(leg).intersectsBox(box(boot)),'balloon short legs and red boots must connect');}
  }else{
   const body=root.getObjectByName('GuitarCostumeSolid'),held=root.getObjectByName('HeldGuitarBodySolid'),neck=root.getObjectByName('HeldGuitarNeckSolid'),strum=root.getObjectByName('GuitarStrummingArmSolid'),fret=root.getObjectByName('GuitarFrettingArmSolid');
   check(body&&held&&neck&&strum&&fret,'guitar needs its costume, held instrument and two supporting arms');
   if(body&&held&&neck&&strum&&fret){check(overlap(body,strum,207,399)&&overlap(body,fret,358,434),'guitar arms must start inside their costume, not float in front');check(overlap(strum,held,235,459)&&overlap(fret,neck,391,416),'guitar hands must touch the instrument they hold');check(overlap(held,neck,305,430),'held guitar neck detached from body');check(!hit(held,270,459)&&!hit(held,270,459,true),'held guitar sound hole must be a real opening');}
   const strings=[];root.traverse(o=>{if(/^HeldGuitarString\d+$/.test(o.name))strings.push(o);});check(strings.length===6&&root.getObjectByName('HeldGuitarNutSolid'),'held guitar needs six strings and an attached nut');
   for(const string of strings){const p=string.geometry.attributes.position;for(const[start,target]of [[0,'HeldGuitarBridgeSolid'],[p.count-9,'HeldGuitarNutSolid']]){const v=new THREE.Vector3();for(let j=0;j<8;j++)v.add(new THREE.Vector3().fromBufferAttribute(p,start+j));v.multiplyScalar(1/8);string.localToWorld(v);const support=root.getObjectByName(target),h=support&&new THREE.Raycaster(v.clone().add(new THREE.Vector3(0,0,.1)),new THREE.Vector3(0,0,-1)).intersectObject(support)[0];check(h&&Math.abs(h.distance-.1)<.003,'guitar string endpoint must touch '+target);}}
   const paint=root.getObjectByName('GuitarCostumeSolidOriginalPaint');check(paint,'guitar original human face missing');if(paint)for(const[x,y]of [[237,299],[331,299],[284,345],[284,268]]){const h=hit(paint,x,y);if(!h){check(false,'guitar face paint has a hole');continue;}const pos=paint.geometry.attributes.position,c=paint.geometry.attributes.color,local=paint.worldToLocal(h.point.clone()),a=new THREE.Vector3().fromBufferAttribute(pos,h.face.a),b=new THREE.Vector3().fromBufferAttribute(pos,h.face.b),d=new THREE.Vector3().fromBufferAttribute(pos,h.face.c),w=new THREE.Vector3();THREE.Triangle.getBarycoord(local,a,b,d,w);check(w.x*c.getW(h.face.a)+w.y*c.getW(h.face.b)+w.z*c.getW(h.face.c)>.99,'guitar eyes/mouth must not fade due to distant prop masks');}
  }
 }
 if(profile.id==='theme-paper-airplane'){
  root.updateMatrixWorld(true);const panels=['PaperLeftWingSolid','PaperLeftFoldSolid','PaperLowerFoldSolid','PaperRightWingSolid'].map(n=>root.getObjectByName(n)),hood=root.getObjectByName('PaperPilotHoodSolid'),torso=root.getObjectByName('PaperPilotTorsoSolid'),join=root.getObjectByName('PaperPilotHiddenJoinSolid');
  check(panels.every(Boolean)&&hood&&torso&&join&&!root.getObjectByName('NeckJoin'),'paper plane needs folded panels and a supported pilot without a generic neck bead');
  const hit=(o,x,y,rear=false)=>new THREE.Raycaster(root.localToWorld(new THREE.Vector3((x-320)*.005,(580-y)*.005,rear?-4:4)),new THREE.Vector3(0,0,rear?1:-1)).intersectObject(o)[0];
  const overlap=(a,b,x,y)=>{const af=hit(a,x,y),ar=hit(a,x,y,true),bf=hit(b,x,y),br=hit(b,x,y,true);return af&&ar&&bf&&br&&Math.max(ar.point.z,br.point.z)<Math.min(af.point.z,bf.point.z);};
  if(hood&&torso&&join)check(overlap(hood,join,316,330)&&overlap(join,torso,316,380),'paper pilot hidden support must enter both hood and wearer in actual depth');
  for(const o of panels.filter(Boolean)){const p=o.geometry.attributes.position,n=p.count/2;for(let i=0;i<n;i++)check(Math.abs(p.getZ(i)-p.getZ(i+n)-.036)<.000001,'paper panel must retain its thin closed thickness');const z=Array.from({length:n},(_,i)=>p.getZ(i));check(Math.max(...z)-Math.min(...z)>.045,'paper fold must have depth, not a flat image slab');}
  if(panels.every(Boolean)&&torso){for(const[x,y]of [[320,420],[330,440]]){const wing=hit(panels[3],x,y),body=hit(torso,x,y);check(wing&&body&&wing.distance<body.distance,'paper wearer must not protrude through the front wing');}for(const[x,y]of [[55,236],[579,107],[326,433],[164,426]])check(panels.some(o=>hit(o,x,y)),'source paper wing or folded tail missing');}
  if(hood){for(const[x,y]of [[315,105],[200,210],[420,210],[315,327]])check(hit(hood,x,y),'paper hood source contour missing');}
 }
 if(['theme-cherry-blossom','theme-rose','theme-sunflower'].includes(profile.id)){
  root.updateMatrixWorld(true);check(!root.getObjectByName('NeckJoin'),'flower costume must not expose a generic neck bead');
  const hit=(o,x,y,rear=false)=>new THREE.Raycaster(root.localToWorld(new THREE.Vector3((x-320)*.005,(580-y)*.005,rear?-4:4)),new THREE.Vector3(0,0,rear?1:-1)).intersectObject(o)[0],box=o=>new THREE.Box3().setFromObject(o);
  const overlap=(a,b,x,y)=>{const af=hit(a,x,y),ar=hit(a,x,y,true),bf=hit(b,x,y),br=hit(b,x,y,true);return af&&ar&&bf&&br&&Math.max(ar.point.z,br.point.z)<Math.min(af.point.z,bf.point.z);};
  const torso=root.getObjectByName('BlossomShortTorsoSolid');check(torso&&box(torso).getSize(new THREE.Vector3()).y<.66,'flower wearer must retain its short torso');
  for(const side of [-1,1]){const foot=root.getObjectByName('BlossomFootSolid'+side);check(torso&&foot&&box(torso).intersectsBox(box(foot)),'flower foot detached');}
  root.traverse(o=>{if(!o.isMesh||!/(?:BlossomPetal|RoseLayerPetal|SunflowerPetal)\d+Solid$/.test(o.name))return;
   const p=o.geometry.attributes.position,ix=o.geometry.index.array;let folded=0;
   for(let j=0;j<ix.length/2;j+=3){const a=ix[j],b=ix[j+1],c=ix[j+2],area=(p.getX(b)-p.getX(a))*(p.getY(c)-p.getY(a))-(p.getY(b)-p.getY(a))*(p.getX(c)-p.getX(a));if(area<-.0000001)folded++;}
   check(!folded,o.name+' folds across its source illustration');
  });
  if(profile.id==='theme-cherry-blossom'){
   const join=root.getObjectByName('BlossomHiddenJoinSolid'),core=root.getObjectByName('BlossomCoreSolid');
   check(join&&core&&overlap(join,core,320,380)&&overlap(join,torso,320,460),'cherry blossom requires a real head-to-body join through its lower petal gap');
   for(const y of [392,410,430])check(join&&hit(join,320,y),'cherry blossom must not leave a triangular hole below its face');
  }
  if(profile.id==='theme-rose'){
   const core=root.getObjectByName('RoseCoreSolid'),calyx=root.getObjectByName('RoseRearCalyxSolid');check(core&&calyx&&overlap(core,calyx,320,320),'rose calyx detached');
   for(const side of [-1,1]){const leaf=root.getObjectByName('RoseCollarLeafSolid'+side);check(leaf&&box(leaf).intersectsBox(box(torso)),'rose collar leaf detached from wearer');}
  }
  if(profile.id==='theme-sunflower'){
   const disk=root.getObjectByName('SunflowerDiskSolid'),calyx=root.getObjectByName('SunflowerCalyxSolid');check(disk&&calyx&&overlap(disk,calyx,318,300),'sunflower calyx detached');
   for(let i=0;i<16;i++){const petal=root.getObjectByName('SunflowerPetal'+i+'Solid'),a=-Math.PI/2+i*Math.PI/8;check(petal&&overlap(petal,disk,320+Math.cos(a)*127,289+Math.sin(a)*127),'sunflower source petal detached from disk');}
   for(let i=0;i<8;i++){const sepal=root.getObjectByName('SunflowerRearSepal'+i+'Solid'),a=i*Math.PI/4;check(sepal&&overlap(sepal,calyx,318+Math.cos(a)*70,300+Math.sin(a)*70),'sunflower rear sepal root detached');}
   for(const[x,y]of [[320,480],[270,455],[370,455]]){const a=hit(torso,x,y),petals=Array.from({length:16},(_,i)=>root.getObjectByName('SunflowerPetal'+i+'Solid')),b=new THREE.Raycaster(root.localToWorld(new THREE.Vector3((x-320)*.005,(580-y)*.005,4)),new THREE.Vector3(0,0,-1)).intersectObjects(petals)[0];check(a&&b&&b.distance<a.distance,'sunflower lower petals must cover its green wearer');}
   for(const name of ['LeftArm','RightArm'])check(!root.getObjectByName(name)?.children.length,'sunflower original has no visible human sleeves');
  }
 }
 if(['theme-cactus','theme-maple-leaf','theme-snowman'].includes(profile.id)){
  root.updateMatrixWorld(true);check(!root.getObjectByName('NeckJoin'),'seasonal costume must not add a generic neck bead');
  const box=o=>new THREE.Box3().setFromObject(o),hit=(o,x,y,back=false)=>new THREE.Raycaster(root.localToWorld(new THREE.Vector3((x-320)*.005,(580-y)*.005,back?-4:4)),new THREE.Vector3(0,0,back?1:-1)).intersectObject(o)[0];
  if(profile.id!=='theme-snowman'){
   const surface=root.getObjectByName(profile.id==='theme-cactus'?'CactusTaperedTrunkSolid':'MapleLeafSolid');check(surface,'seasonal authored surface missing');
   if(surface){const p=surface.geometry.attributes.position,ix=surface.geometry.index.array;for(let j=0;j<ix.length;j+=3){const a=ix[j],b=ix[j+1],c=ix[j+2];if(p.getZ(a)+p.getZ(b)+p.getZ(c)<=.00001)continue;const area=(p.getX(b)-p.getX(a))*(p.getY(c)-p.getY(a))-(p.getY(b)-p.getY(a))*(p.getX(c)-p.getX(a));check(area>=-.0000001,'seasonal front surface folds back across its illustration');}}
  }
  if(profile.id==='theme-cactus'){
   const trunk=root.getObjectByName('CactusTaperedTrunkSolid');check(trunk&&!root.getObjectByName('Torso'),'cactus must retain its tapered plant body without a human torso');
   for(const name of ['LeftArm','RightArm'])check(!root.getObjectByName(name)?.children.length,'cactus branches must not gain human sleeves');
   if(trunk){for(const [i,[x,y]] of [[207,388],[448,336]].entries()){const branch=root.getObjectByName('CactusBranchSolid'+i),a=hit(trunk,x,y),b=branch&&hit(branch,x,y),ar=hit(trunk,x,y,true),br=branch&&hit(branch,x,y,true);check(a&&b&&ar&&br&&Math.max(ar.point.z,br.point.z)<Math.min(a.point.z,b.point.z),'cactus branch must enter trunk in actual depth at its source attachment');}for(const side of [-1,1])check(box(trunk).intersectsBox(box(root.getObjectByName('CactusFootSolid'+side))),'cactus foot detached');}
   const center=root.getObjectByName('CactusFlowerCenter');for(let i=0;i<6;i++)check(center&&box(center).intersectsBox(box(root.getObjectByName('CactusFlowerPetal'+i))),'cactus flower petal detached from its center');
  }
  if(profile.id==='theme-maple-leaf'){
   const leaf=root.getObjectByName('MapleLeafSolid'),torso=root.getObjectByName('MapleShortTorsoSolid');check(leaf&&torso&&!root.getObjectByName('LeafFaceSupport'),'maple face must sit on the leaf rather than a separate projecting disk');
   if(leaf&&torso){for(const [x,y] of [[320,80],[239,157],[410,153],[112,236],[531,239],[170,427],[470,426]])check(hit(leaf,x,y),'source maple lobe missing at '+x+','+y);check(box(torso).getSize(new THREE.Vector3()).y<.65,'maple wearer torso too long');check(box(leaf).intersectsBox(box(torso)),'maple wearer detached');for(const side of [-1,1])check(box(torso).intersectsBox(box(root.getObjectByName('MapleFootSolid'+side))),'maple foot detached');}
   for(let i=0;i<5;i++){const vein=root.getObjectByName('MapleRearVein'+i);check(vein,'rear maple vein missing');if(vein&&leaf){const p=vein.geometry.attributes.position;for(let j=0;j<p.count;j+=9*8){const v=new THREE.Vector3();for(let q=0;q<8;q++)v.add(new THREE.Vector3().fromBufferAttribute(p,j+q));v.multiplyScalar(1/8);vein.localToWorld(v);const support=new THREE.Raycaster(v.clone().add(new THREE.Vector3(0,0,-1)),new THREE.Vector3(0,0,1)).intersectObject(leaf)[0];check(support&&Math.abs(support.point.z-v.z)<.02,'maple rear vein floats off leaf');}}}
  }
  if(profile.id==='theme-snowman'){
   check(motion==='hop'&&!root.getObjectByName('Torso')&&!root.getObjectByName('LeftArm')&&!root.getObjectByName('RightArm'),'snowman must hop without a human torso or arms');
   const snow=root.getObjectByName('SnowHeadSolid'),body=root.getObjectByName('SnowBodySolid');check(snow&&body&&box(snow).intersectsBox(box(body)),'snowballs must connect');
   if(snow&&body){const a=hit(snow,318,405),b=hit(body,318,405);check(a&&b&&a.distance<b.distance,'snowman body must not hide the lower head or human face');}
   root.traverse(o=>{if(!o.userData.surfaceSupport)return;const target=root.getObjectByName(o.userData.surfaceSupport),normal=new THREE.Vector3(0,0,1).applyQuaternion(o.getWorldQuaternion(new THREE.Quaternion())),p=o.getWorldPosition(new THREE.Vector3()),h=new THREE.Raycaster(p.clone().addScaledVector(normal,.2),normal.clone().negate()).intersectObject(target)[0];check(h&&Math.abs(h.distance-(.2+o.scale.z*.5))<.005,'snowman coal or carrot root detached from its snowball');});
   const paint=root.getObjectByName('SnowHeadSolidOriginalPaint');check(paint,'snowman original face missing');if(paint){const p=paint.geometry.attributes.position,c=paint.geometry.attributes.color;for(let i=0;i<p.count;i++){const v=new THREE.Vector3().fromBufferAttribute(p,i);paint.localToWorld(v);root.worldToLocal(v);const x=v.x/.005+320,y=580-v.y/.005;if(x>245&&x<391&&y>270&&y<355)check(c.getW(i)>.99,'snowman original human face must not be clipped by silhouette-shell occlusion');}}
  }
 }
 if(['theme-crown','theme-lightning','theme-music-note'].includes(profile.id)){
  root.updateMatrixWorld(true);const box=o=>new THREE.Box3().setFromObject(o),torso=root.getObjectByName('SymbolTorsoSolid'),hit=(x,y,o)=>new THREE.Raycaster(root.localToWorld(new THREE.Vector3((x-320)*.005,(580-y)*.005,4)),new THREE.Vector3(0,0,-1)).intersectObject(o)[0];
  check(torso&&!root.getObjectByName('NeckJoin'),'symbol costume requires its directly connected short wearer');if(torso){check(box(torso).getSize(new THREE.Vector3()).y<.76,'symbol torso too long');for(const side of [-1,1]){const foot=root.getObjectByName('SymbolFootSolid'+side);check(foot&&box(torso).intersectsBox(box(foot)),'symbol foot detached');}}
  if(profile.id==='theme-crown'){const wall=root.getObjectByName('RoyalCrownWallSolid'),band=root.getObjectByName('RoyalBandSolid'),hood=root.getObjectByName('RoyalHoodSolid');check(wall&&band&&hood,'crown requires open wall, band and supported hood');if(wall&&band&&hood){check(box(wall).intersectsBox(box(band))&&box(band).intersectsBox(box(hood)),'crown band or hood detached');for(let i=0;i<5;i++){const pearl=root.getObjectByName('CrownPearlFront'+i);check(pearl&&box(pearl).intersectsBox(box(wall)),'front crown pearl detached');}check(root.getObjectByName('CrownPearlFront2').getWorldPosition(new THREE.Vector3()).y>root.getObjectByName('CrownPearlFront1').getWorldPosition(new THREE.Vector3()).y,'source crown center pearl must be highest');check(triangles<80000,'small crown decorations must not dominate geometry cost');}}
  if(profile.id==='theme-lightning'){const bolt=root.getObjectByName('LightningBorderSolid'),gold=root.getObjectByName('LightningGoldSolid'),arm=root.getObjectByName('SymbolSleeveSolid1');check(bolt&&gold&&arm,'lightning needs border, gold inset and visible right sleeve');check(!root.getObjectByName('SymbolSleeveSolid-1'),'do not invent a second visible lightning arm');if(bolt&&gold&&torso){check(box(bolt).intersectsBox(box(torso)),'lightning wearer disconnected');check(hit(340,480,torso),'lightning must retain the visible body behind its lower diagonal');check(hit(318,288,gold),'lightning face must be supported by the solid gold panel');}}
  if(profile.id==='theme-music-note'){const stem=root.getObjectByName('NoteStemFlagSolid'),hood=root.getObjectByName('NoteRoundHoodSolid');check(stem&&hood,'music note needs a connected stem, curled flag and round hood');if(stem&&hood){check(box(stem).intersectsBox(box(hood))&&box(hood).intersectsBox(box(torso)),'music note flag, head or wearer detached');check(hit(401,82,stem)&&hit(480,170,stem),'music-note stem or curved flag tip lost');check(!hit(445,200,stem),'music note flag opening must stay clear');}}
 }
 if(['theme-moon','theme-star','theme-sun'].includes(profile.id)){
  check(!root.getObjectByName('NeckJoin'),'directly connected celestial costume must not expose an extra rear neck bump');
  root.updateMatrixWorld(true);const box=o=>new THREE.Box3().setFromObject(o),torso=root.getObjectByName('CelestialTorsoSolid');check(torso,'celestial costume requires a short connected wearer');
  if(torso){check(box(torso).getSize(new THREE.Vector3()).y<.67,'celestial wearer torso too long');for(const side of [-1,1])for(const name of ['CelestialSleeveSolid','CelestialFootSolid']){const limb=root.getObjectByName(name+side);check(limb&&box(torso).intersectsBox(box(limb)),'celestial wearer limb detached');}}
  const hit=(x,y,o)=>new THREE.Raycaster(root.localToWorld(new THREE.Vector3((x-320)*.005,(580-y)*.005,4)),new THREE.Vector3(0,0,-1)).intersectObject(o)[0];
  const headSolid=root.getObjectByName(profile.id==='theme-moon'?'CrescentShellSolid':profile.id==='theme-star'?'RoundedStarSolid':'SunDiskSolid'),joinY=profile.id==='theme-moon'?431:425;
  if(headSolid&&torso){const interval=o=>{const front=hit(320,joinY,o),back=new THREE.Raycaster(root.localToWorld(new THREE.Vector3(0,(580-joinY)*.005,-4)),new THREE.Vector3(0,0,1)).intersectObject(o)[0];return front&&back?[back.point.z,front.point.z]:null;},a=interval(headSolid),b=interval(torso);check(a&&b&&Math.max(a[0],b[0])<Math.min(a[1],b[1]),'celestial head and torso must overlap in actual depth without a generic neck bead');}
  if(profile.id==='theme-moon'){const moon=root.getObjectByName('CrescentShellSolid');check(moon,'moon requires a closed rounded crescent');if(moon){check(hit(464,365,moon),'moon lower horn missing');check(!hit(401,145,moon),'crescent cutout must remain open');check(hit(320,310,moon),'moon face lacks opaque support');}}
  if(profile.id==='theme-star'){const star=root.getObjectByName('RoundedStarSolid');check(star,'star requires rounded source-shaped tips');if(star)for(const [x,y] of [[320,80],[102,242],[538,242],[178,486],[460,486]])check(hit(x,y,star),'source star tip missing');}
  if(profile.id==='theme-sun'){const rays=root.getObjectByName('SourceSunRaysSolid'),disk=root.getObjectByName('SunDiskSolid');check(rays&&disk,'sun requires connected source rays and disk');if(rays&&disk){check(box(rays).intersectsBox(box(disk)),'solar rays detached');for(const [x,y] of [[320,85],[171,140],[474,140],[529,288],[112,288]])check(hit(x,y,rays),'source solar ray missing');}}
 }
 if(['theme-cloud','theme-clover','theme-rainbow'].includes(profile.id)){
  root.updateMatrixWorld(true);const solids=[];root.traverse(o=>{if(o.isMesh&&!o.material.userData.originalTexture&&!o.name.includes('InkShell'))solids.push(o);});
  const frontHit=(x,y,objects=solids)=>new THREE.Raycaster(root.localToWorld(new THREE.Vector3((x-320)*.005,(580-y)*.005,4)),new THREE.Vector3(0,0,-1)).intersectObjects(objects)[0];
  const torso=root.getObjectByName('SoftThemeTorso'),box=o=>new THREE.Box3().setFromObject(o);check(torso,'soft theme requires a connected short wearer');
  if(torso){for(const side of [-1,1]){const foot=root.getObjectByName('SoftThemeFoot'+side),arm=root.getObjectByName('SoftThemeSleeve'+side);check(foot&&arm&&box(torso).intersectsBox(box(foot))&&box(torso).intersectsBox(box(arm)),'soft theme wearer limb detached');}check(box(torso).getSize(new THREE.Vector3()).y<.75,'soft theme torso must stay short');}
  const closedNames=profile.id==='theme-cloud'?['ContinuousCloud']:profile.id==='theme-clover'?['CloverCentralJoin','CloverFaceSupport']:['RainbowFaceHood'];
  for(const name of closedNames){const o=root.getObjectByName(name);check(o,'missing closed theme volume '+name);if(!o)continue;const p=o.geometry.attributes.position,ix=o.geometry.index.array,edges=new Map(),coord=i=>[p.getX(i),p.getY(i),p.getZ(i)].map(v=>Math.round(v*1e5)).join(',');for(let i=0;i<ix.length;i+=3){const v=[coord(ix[i]),coord(ix[i+1]),coord(ix[i+2])];if(new Set(v).size<3)continue;for(let j=0;j<3;j++){const e=[v[j],v[(j+1)%3]].sort().join('|');edges.set(e,(edges.get(e)||0)+1);}}check([...edges.values()].every(n=>n===2),name+' must have a closed surface');}
  if(profile.id==='theme-cloud'){const cloud=root.getObjectByName('ContinuousCloud');check(cloud&&frontHit(320,100,[cloud])&&frontHit(90,300,[cloud])&&frontHit(550,300,[cloud]),'cloud must preserve connected top and lateral lobes');check(!root.getObjectByName('CloudLobe0'),'cloud must not revert to separate attached bubbles');}
  if(profile.id==='theme-clover'){check(frontHit(320,410)?.object.name==='CloverCentralJoin','clover must not leave an open gap under the face');for(const side of [-1,1])for(const j of [0,1])check(root.getObjectByName('CloverLobe'+side+'_'+j),'clover requires four volumetric leaves');}
  if(profile.id==='theme-rainbow'){const hood=root.getObjectByName('RainbowFaceHood');for(const [x,y] of [[320,215],[230,280],[410,280],[320,360]])check(frontHit(x,y)?.object===hood,'rainbow arch must not cut into or duplicate the human face');for(let i=0;i<7;i++)check(root.getObjectByName('RainbowArchBand'+i),'rainbow requires seven connected color bands');check(box(hood).max.z-box(root.getObjectByName('RainbowArchBand6')).max.z<.09,'rainbow face must not hang far ahead of arch');}
 }
 if(profile.id==='object-mitten'){
  root.updateMatrixWorld(true);const glove=root.getObjectByName('MittenShellSolid'),cuff=root.getObjectByName('MittenCuffSolid'),waist=root.getObjectByName('MittenHiddenWaistSolid');check(glove&&cuff&&waist,'mitten needs connected glove, cuff and tiny wearer');
  if(glove&&cuff&&waist){const box=o=>new THREE.Box3().setFromObject(o);check(box(glove).intersectsBox(box(cuff))&&box(cuff).intersectsBox(box(waist)),'mitten cuff or waist detached');for(const side of [-1,1])check(box(waist).intersectsBox(box(root.getObjectByName('MittenFootSolid'+side))),'mitten foot detached');check(triangles<65000,'small knitted stitches must not dominate geometry cost');const p=root.localToWorld(new THREE.Vector3((151-320)*.005,(580-280)*.005,3));check(new THREE.Raycaster(p,new THREE.Vector3(0,0,-1)).intersectObject(glove).length>0,'mitten thumb silhouette missing');}
 }
 if(profile.id==='object-sack'){
  root.updateMatrixWorld(true);const bag=root.getObjectByName('SackBodySolid'),top=root.getObjectByName('SackGatheredTopSolid'),knot=root.getObjectByName('SackKnotSolid'),cord=root.getObjectByName('SackNeckCord');check(bag&&top&&knot&&cord,'sack needs gathered cloth, body, knot and attached drawstring');
  if(bag&&top&&knot&&cord){const box=o=>new THREE.Box3().setFromObject(o);check(box(bag).intersectsBox(box(top)),'gathered sack top detached');check(box(knot).intersectsBox(box(top))||box(knot).intersectsBox(box(bag)),'sack knot detached');for(const [x,y] of [[208,107],[320,75],[432,108]]){const p=root.localToWorld(new THREE.Vector3((x-320)*.005,(580-y)*.005,3));check(new THREE.Raycaster(p,new THREE.Vector3(0,0,-1)).intersectObject(top).length>0,'source sack scalloped top missing');}const cp=cord.geometry.attributes.position;for(let i=0;i<cp.count;i+=9*8){const v=new THREE.Vector3();for(let j=0;j<8;j++)v.add(new THREE.Vector3().fromBufferAttribute(cp,i+j));v.multiplyScalar(1/8);cord.localToWorld(v);const origin=root.localToWorld(new THREE.Vector3(0,0,0));origin.y=v.y;const dir=v.clone().sub(origin).setY(0).normalize(),ray=new THREE.Raycaster(origin.clone().addScaledVector(dir,4),dir.clone().negate()),hit=ray.intersectObjects([bag,top])[0];check(hit&&hit.point.distanceTo(v)<.045,'sack drawstring must touch gathered cloth rather than float around neck');}}
 }
 if(profile.id==='object-pencil'){
  root.updateMatrixWorld(true);const names=['PencilGraphiteSolid','PencilWoodSolid','PencilBarrelSolid','PencilFerruleSolid','PencilEraserSolid'],pieces=names.map(n=>root.getObjectByName(n));check(pieces.every(Boolean),'pencil requires graphite, wood, barrel, ferrule and rounded eraser');
  if(pieces.every(Boolean)){const bounds=o=>new THREE.Box3().setFromObject(o);for(let i=1;i<pieces.length;i++)check(bounds(pieces[i-1]).expandByScalar(.002).intersectsBox(bounds(pieces[i])),'pencil axial pieces disconnected: '+names[i]);for(const side of [-1,1])check(bounds(pieces[2]).intersectsBox(bounds(root.getObjectByName('PencilHandSolid'+side))),'pencil hand detached from barrel');const eraser=bounds(pieces[4]);for(const side of [-1,1])check(eraser.intersectsBox(bounds(root.getObjectByName('PencilFootSolid'+side))),'pencil foot detached from eraser');}
 }
 if(profile.id==='object-radio'){
  root.updateMatrixWorld(true);const body=root.getObjectByName('RadioCaseSolid'),base=root.getObjectByName('RadioAntennaBaseSolid'),rod=root.getObjectByName('RadioAntennaSolid'),knob=root.getObjectByName('RadioSideKnobSolid');check(body&&base&&rod&&knob,'radio requires original antenna support and side knob');
  if(body&&base&&rod&&knob){const box=o=>new THREE.Box3().setFromObject(o);check(box(body).intersectsBox(box(base))&&box(base).intersectsBox(box(rod)),'radio antenna detached');check(box(body).intersectsBox(box(knob)),'radio side knob detached');for(const x of [157,465])check(box(body).intersectsBox(box(root.getObjectByName('RadioSpeakerSolid'+x))),'radio speaker detached');}
 }
 if(profile.id==='object-television'){
  root.updateMatrixWorld(true);const body=root.getObjectByName('TVCaseSolid'),screen=root.getObjectByName('TVScreenSolid'),base=root.getObjectByName('TVAntennaBaseSolid');check(body&&screen&&base,'television needs source-sized screen and antenna base');
  if(body&&screen&&base){const box=o=>new THREE.Box3().setFromObject(o);check(box(body).intersectsBox(box(screen)),'television screen detached from case');check(box(body).intersectsBox(box(base)),'television antenna base detached');for(const side of [-1,1])check(box(base).intersectsBox(box(root.getObjectByName('TVAntennaSolid'+side))),'television antenna detached');}
 }
 if(profile.id==='object-watch'){
  root.updateMatrixWorld(true);check(motion==='hop'&&!root.getObjectByName('Torso'),'watch must keep its legless source anatomy');const body=root.getObjectByName('WatchCaseSolid'),straps=['WatchUpperStrapSolid','WatchLowerStrapSolid'].map(n=>root.getObjectByName(n)),crown=root.getObjectByName('WatchCrownSolid');check(body&&straps.every(Boolean)&&crown,'watch requires two attached straps and side crown');
  if(body&&straps.every(Boolean)&&crown){const box=o=>new THREE.Box3().setFromObject(o);for(const strap of straps)check(box(body).intersectsBox(box(strap)),'watch strap detached');check(box(body).intersectsBox(box(crown)),'watch crown detached');check(box(body).intersectsBox(box(root.getObjectByName('WatchGlassSolid'))),'watch dial detached');const opaque=[];root.traverse(o=>{if(o.isMesh&&!o.material.userData.originalTexture)opaque.push(o);});for(const x of [220,306,392]){const p=root.localToWorld(new THREE.Vector3((x-320)*.005,(580-325)*.005,-3)),hit=new THREE.Raycaster(p,new THREE.Vector3(0,0,1)).intersectObjects(opaque,false)[0];check(hit&&hit.object.name==='WatchRearCoverSolid','rear watch cover must remain exposed, without a strap or extended lug covering it');}}
 }
 if(profile.id==='object-lamp'){
  root.updateMatrixWorld(true);const face=root.getObjectByName('LampFaceSolid'),shade=root.getObjectByName('LampShadeSolid'),collar=root.getObjectByName('LampCollarSolid'),body=root.getObjectByName('LampTorsoSolid');
  check(face&&shade&&collar&&body,'lamp needs a supported head, collar and hollow shade');
  if(face&&shade&&collar&&body){
   const box=o=>new THREE.Box3().setFromObject(o),localFace=box(face);check(localFace.max.z<.70,'lamp face must not project forward like a detached turret');check(box(collar).intersectsBox(box(face))&&box(collar).intersectsBox(box(body)),'lamp head/collar/body connection missing');
   for(const [x,y] of [[277,333],[363,333],[320,270]]){const p=root.localToWorld(new THREE.Vector3((x-320)*.005,(580-y)*.005,3)),hits=new THREE.Raycaster(p,new THREE.Vector3(0,0,-1)).intersectObjects([face,shade]);check(hits.length&&hits[0].object===face,'lamp shade must not hide original eyes or forehead');}
  }
 }
 if(profile.id==='object-gift'){
  root.updateMatrixWorld(true);const box=root.getObjectByName('GiftCaseSolid'),lid=root.getObjectByName('GiftLidSolid'),knot=root.getObjectByName('GiftKnotSolid');check(box&&lid&&knot,'gift requires source-shaped box, lid and supported bow');
  if(box&&lid&&knot){const bounds=o=>new THREE.Box3().setFromObject(o);check(bounds(box).intersectsBox(bounds(lid))&&bounds(lid).intersectsBox(bounds(knot)),'gift case/lid/knot must connect');for(const side of [-1,1]){const bow=root.getObjectByName('GiftBowLoopSolid'+side);check(bow&&bounds(bow).intersectsBox(bounds(knot)),'gift ribbon loop detached from knot');}
   const opaque=[];root.traverse(o=>{if(o.isMesh&&!o.material.userData.originalTexture)opaque.push(o);});for(const x of [280,319,360]){const p=root.localToWorld(new THREE.Vector3((x-320)*.005,(580-325)*.005,3)),hit=new THREE.Raycaster(p,new THREE.Vector3(0,0,-1)).intersectObjects(opaque,false)[0];check(hit&&hit.object===box,'gift face must remain on one continuous surface, without a raised ribbon splitting it');}
  }
 }
 if(profile.id==='object-newspaper'){
  root.updateMatrixWorld(true);const paper=root.getObjectByName('NewspaperSheetSolid'),fold=root.getObjectByName('NewspaperFoldSolid');check(paper&&fold,'newspaper needs a shaped paper sheet and folded corner');
  if(paper&&fold){check(new THREE.Box3().setFromObject(paper).expandByScalar(.025).intersectsBox(new THREE.Box3().setFromObject(fold)),'fold detached from newspaper');for(const [x,y,inside] of [[486,87,false],[400,90,true],[485,175,true]]){const p=root.localToWorld(new THREE.Vector3((x-320)*.005,(580-y)*.005,3)),hits=new THREE.Raycaster(p,new THREE.Vector3(0,0,-1)).intersectObject(paper);check(Boolean(hits.length)===inside,'newspaper folded corner silhouette wrong at '+x+','+y);}}
 }
 if(profile.id==='object-camera'){
  root.updateMatrixWorld(true);const body=root.getObjectByName('CameraCaseSolid'),barrel=root.getObjectByName('CameraLensBarrelSolid'),glass=root.getObjectByName('CameraFaceGlassSolid'),stem=root.getObjectByName('CameraFlashStemSolid'),flash=root.getObjectByName('CameraFlashSolid');
  const box=o=>new THREE.Box3().setFromObject(o);
  check(body&&barrel&&glass&&stem&&flash,'camera needs attached lens and supported flash');
  if(body&&barrel&&glass&&stem&&flash){check(box(body).intersectsBox(box(barrel)),'camera lens detached from case');check(box(barrel).expandByScalar(.02).intersectsBox(box(glass)),'camera face glass detached from barrel');check(box(body).intersectsBox(box(stem))&&box(stem).intersectsBox(box(flash)),'camera flash must have a continuous support');}
 }
 if(profile.id==='object-eraser'){
  root.updateMatrixWorld(true);const white=root.getObjectByName('EraserWhiteSolid'),sleeve=root.getObjectByName('EraserSleeveSolid'),torso=root.getObjectByName('EraserTorsoSolid');
  check(white&&sleeve&&torso,'eraser requires source-proportioned body and short suit');
  if(white&&sleeve&&torso){const w=new THREE.Box3().setFromObject(white),b=new THREE.Box3().setFromObject(sleeve),t=new THREE.Box3().setFromObject(torso);check(w.min.x>=b.min.x&&w.max.x<=b.max.x&&w.min.z>b.min.z&&w.max.z<b.max.z,'white eraser must fit inside blue sleeve');check(b.min.y-t.min.y<.33,'eraser visible torso must stay short vertically');check(t.intersectsBox(b),'eraser suit detached from sleeve');}
 }
 if(['object-key','object-lock'].includes(profile.id)){
  root.updateMatrixWorld(true);const key=profile.id==='object-key',bow=root.getObjectByName(key?'KeyBowSolid':'LockShackleSolid');check(bow,'key or lock loop missing');
  if(bow)for(const x of key?[285,319,355]:[280,320,360]){const p=root.localToWorld(new THREE.Vector3((x-320)*.005,(580-(key?137:152))*.005,3)),ray=new THREE.Raycaster(p,new THREE.Vector3(0,0,-1));check(ray.intersectObject(bow).length===0,'key or lock loop must be a real open hole');}
 }
 if(profile.id==='object-boot'){
  root.updateMatrixWorld(true);const upper=root.getObjectByName('SneakerUpperSolid'),sole=root.getObjectByName('SneakerSoleSolid');check(upper&&sole,'shoe requires continuous upper and rounded sole');
  const opaque=[];root.traverse(o=>{if(o.isMesh&&!o.material.userData.originalTexture)opaque.push(o);});for(const [x,y] of [[294,480],[414,452]]){const p=root.localToWorld(new THREE.Vector3((x-320)*.005,(580-y)*.005,3)),ray=new THREE.Raycaster(p,new THREE.Vector3(0,0,-1));check(ray.intersectObjects(opaque,false).length>0,'shoe suit needs connected shoulders, not floating hands');}
  if(upper&&sole){check(new THREE.Box3().setFromObject(upper).intersectsBox(new THREE.Box3().setFromObject(sole)),'shoe upper detached from sole');for(let n=0;n<3;n++){const lace=root.getObjectByName('SneakerLaceSolid'+n);check(lace,'shoe lace missing');if(!lace)continue;const p=lace.geometry.attributes.position;for(let i=0;i<p.count;i+=73){const v=new THREE.Vector3().fromBufferAttribute(p,i);lace.localToWorld(v);const ray=new THREE.Raycaster(v.clone().add(new THREE.Vector3(0,0,1)),new THREE.Vector3(0,0,-1)),hit=ray.intersectObject(upper)[0];check(hit&&Math.abs(hit.point.z-v.z)<.045,'shoe lace must follow its supporting upper surface');}}}
 }
 if(profile.id==='fruit-cherry'){
  root.updateMatrixWorld(true);const fruit=root.getObjectByName('CherryFruitSolid'),stem=root.getObjectByName('CherryStemSolid'),leaf=root.getObjectByName('CherryLeafSolid');
  check(motion==='hop'&&!root.getObjectByName('Torso'),'cherry must hop without an invented torso');
  if(fruit&&stem&&leaf){const stemBox=new THREE.Box3().setFromObject(stem);check(stemBox.intersectsBox(new THREE.Box3().setFromObject(fruit)),'cherry stem must enter fruit');check(stemBox.intersectsBox(new THREE.Box3().setFromObject(leaf)),'cherry leaf must meet stem');}
  else check(false,'source-shaped cherry fruit and connected sprig missing');
 }
 if(['fruit-persimmon','fruit-strawberry'].includes(profile.id)){
  root.updateMatrixWorld(true);const prefix=profile.id==='fruit-persimmon'?'Persimmon':'Strawberry',fruit=root.getObjectByName(prefix+'FruitSolid'),front=root.getObjectByName(prefix+'CalyxSolid'),back=root.getObjectByName(prefix+'RearCalyxSolid');
  check(fruit&&front&&back,'fruit calyx must cover both front and rear');
  if(fruit&&front&&back)for(const leaf of [front,back])check(new THREE.Box3().setFromObject(leaf).intersectsBox(new THREE.Box3().setFromObject(fruit)),'calyx must attach to the fruit surface');
 }
 if(profile.id==='fruit-strawberry'){
  root.updateMatrixWorld(true);const head=root.getObjectByName('StrawberryFruitSolid'),body=root.getObjectByName('StrawberrySuitSolid');
  if(head&&body){const bb=new THREE.Box3().setFromObject(body);check(bb.intersectsBox(new THREE.Box3().setFromObject(head)),'strawberry torso must enter hood instead of leaving a visible neck gap');for(const side of [-1,1]){check(bb.intersectsBox(new THREE.Box3().setFromObject(root.getObjectByName('StrawberrySleeveSolid'+side))),'strawberry sleeve detached');check(bb.intersectsBox(new THREE.Box3().setFromObject(root.getObjectByName('StrawberryFootSolid'+side))),'strawberry foot detached');}}
  else check(false,'strawberry requires rebuilt connected short suit');
 }
 if(profile.id==='fruit-watermelon'){
  root.updateMatrixWorld(true);const fruit=root.getObjectByName('WatermelonSliceSolid'),rind=root.getObjectByName('WatermelonRindSolid');
  check(fruit&&rind,'watermelon requires cut slice and curved rind');
  if(fruit&&rind){const bb=new THREE.Box3().setFromObject(fruit);check(bb.max.z-bb.min.z<.60,'watermelon cut slice must not inflate into a balloon');check(bb.intersectsBox(new THREE.Box3().setFromObject(rind)),'watermelon rind detached');
   for(const y of [395,410,425,440])for(const z of [-.20,0,.20])for(const side of [-1,1]){const origin=root.localToWorld(new THREE.Vector3(side*3,(580-y)*.005,z)),ray=new THREE.Raycaster(origin,new THREE.Vector3(-side,0,0)),skin=ray.intersectObject(rind)[0],flesh=ray.intersectObject(fruit)[0];if(flesh)check(skin&&skin.distance<flesh.distance-.005,'watermelon flesh must stay inside rind, avoiding red side stripes');}
  }
 }
 if(profile.id==='animal-crab')for(const name of ['LeftArm','RightArm']){
  const arm=root.getObjectByName(name);root.updateMatrixWorld(true);
  check(arm&&new THREE.Box3().setFromObject(arm).expandByScalar(.005).containsPoint(arm.getWorldPosition(new THREE.Vector3())),name+' rotation pivot must lie inside its own sleeve');
 }
 if(profile.id==='animal-octopus'){
  const arms=[];root.traverse(o=>{if(/^OctopusTentacle\d+$/.test(o.name))arms.push(o);});
  check(arms.length===8,'octopus requires eight connected arm groups');
  const moving=clips.find(c=>c.name==='Walk');
  check(arms.every(arm=>moving.tracks.some(t=>t.name===arm.name+'.quaternion')),'every octopus arm participates in locomotion');
  const hood=root.getObjectByName('WholeCoastalHoodSolid');
  check(hood&&!root.getObjectByName('HoodEdge'),'octopus hood must have a continuous side without a flat meridian outline');
  if(hood){
   const p=hood.geometry.attributes.position,n=hood.geometry.attributes.normal,normals=new Map();
   for(let i=0;i<p.count;i++){const key=[p.getX(i),p.getY(i),p.getZ(i)].map(v=>Math.round(v*1e5)).join(','),normal=new THREE.Vector3().fromBufferAttribute(n,i);if(normals.has(key))check(normal.dot(normals.get(key))>.999,'octopus hood normals must agree across the joined surface');else normals.set(key,normal);}
  }
  const suckers=[];root.traverse(o=>{if(o.userData.suckerSupport)suckers.push(o);});
  check(suckers.length===76,'six visible octopus arms require their source-positioned relief suckers');
  // Check the actual supporting arm after animation, not just a static bound
  // or a child name. Cups must rotate with the same arm and touch its surface.
  const saved=[];root.traverse(o=>saved.push([o,o.position.clone(),o.quaternion.clone(),o.scale.clone()]));
  const mantle=root.getObjectByName('ContinuousMantleSolid');
  const insideSupport=v=>[hood,mantle].some(support=>{const side=support.material.side;support.material.side=THREE.DoubleSide;const hits=new THREE.Raycaster(v,new THREE.Vector3(.031,.019,1).normalize()).intersectObject(support);support.material.side=side;const ds=[];for(const h of hits)if(!ds.some(d=>Math.abs(d-h.distance)<1e-5))ds.push(h.distance);return ds.length%2===1;});
  const cupMixer=new THREE.AnimationMixer(root);cupMixer.clipAction(moving).play();
  for(const phase of [0,.25,.5,.75]){
   cupMixer.setTime(moving.duration*phase);root.updateMatrixWorld(true);
   for(let i=0;i<8;i++){
    const arm=root.getObjectByName('RoundedOctopusArm'+i+(i<6?'Solid':'')),p=arm.geometry.attributes.position;
    let attached=0;for(let v=0;v<Math.floor(p.count/6);v+=3)if(insideSupport(arm.localToWorld(new THREE.Vector3().fromBufferAttribute(p,v))))attached++;
    check(attached>12,'octopus arm root is not embedded in mantle/hood at phase '+phase+': '+i);
    if(i<6)check(insideSupport(arm.localToWorld(new THREE.Vector3().fromBufferAttribute(p,p.count-1))),'octopus attachment cap is exposed at phase '+phase+': '+i);
   }
   for(const cup of suckers){const support=cup.parent.getObjectByName(cup.userData.suckerSupport),normal=new THREE.Vector3(0,0,1).applyQuaternion(cup.getWorldQuaternion(new THREE.Quaternion())),center=cup.getWorldPosition(new THREE.Vector3()),hit=support&&new THREE.Raycaster(center.clone().addScaledVector(normal,.08),normal.clone().negate()).intersectObject(support)[0];check(hit&&Math.abs(hit.distance-.082)<.004,'octopus sucker detached from moving arm: '+cup.name);}
  }
  cupMixer.stopAllAction();for(const [o,p,q,s] of saved){o.position.copy(p);o.quaternion.copy(q);o.scale.copy(s);}root.updateMatrixWorld(true);
  // Ignore the new buried attachment sleeves: only exposed lower-arm depth
  // matters for the readable three-dimensional fan of tentacles.
  const armDepth=i=>{const o=root.getObjectByName('RoundedOctopusArm'+i+'Solid'),p=o.geometry.attributes.position,b=new THREE.Box3();for(let v=0;v<p.count;v++){const point=o.localToWorld(new THREE.Vector3().fromBufferAttribute(p,v)),local=root.worldToLocal(point.clone());if(local.y<(580-465)*.005)b.expandByPoint(point);}return b;};
  check(armDepth(2).max.z-armDepth(0).max.z>.35&&armDepth(1).max.z>armDepth(0).max.z+.15,'octopus front arms must curl into distinct depth layers rather than stack on a flat plane');
  // In the original, the two central arms are broad at this height. Merely
  // counting eight groups missed a large rectangular gap between thin legs.
  root.updateMatrixWorld(true);const opaque=[];root.traverse(o=>{if(o.isMesh&&!o.material.userData.originalTexture)opaque.push(o);});
  const ray=new THREE.Raycaster();
  for(const [px,py] of [[300,480],[340,480],[304,520],[336,520],[276,551],[364,551]]){
   const p=new THREE.Vector3((px-320)*.005,(580-py)*.005,5);root.localToWorld(p);ray.set(p,new THREE.Vector3(0,0,-1));
   check(ray.intersectObjects(opaque,false).length>0,'source-shaped octopus lower body missing at '+px+','+py);
  }
 }
 if(profile.id==='drink-bubble-tea'){
  root.updateMatrixWorld(true);const cup=root.getObjectByName('CupSolid'),pearls=[];
  root.traverse(o=>{if(/^RearPearl\d+_\d+$/.test(o.name))pearls.push(o);});
  const positions=pearls.map(o=>o.getWorldPosition(new THREE.Vector3()));
  check(positions.length===14&&positions.every(p=>p.z<0),'rear tea pearls must stay on the rear half');
  check(Math.max(...positions.map(p=>p.x))-Math.min(...positions.map(p=>p.x))>.9,'rear pearls must cover both sides, not collapse onto one diagonal');
  for(const p of positions){const ray=new THREE.Raycaster(p,new THREE.Vector3(-p.x,0,-p.z).normalize()),hit=ray.intersectObject(cup)[0];check(hit&&hit.distance<.035,'tea pearl is unsupported by cup');}
 }
 if(profile.id==='food-bingsu'){
  root.updateMatrixWorld(true);const ice=root.getObjectByName('ShavedIceSolid'),bowl=root.getObjectByName('BingsuBowlSolid');
  for(let i=0;i<16;i++)for(const y of [.4,.6,.8,1]){
   const a=i/16*Math.PI*2,ray=new THREE.Raycaster(new THREE.Vector3(Math.sin(a)*3,y+root.position.y,Math.cos(a)*3),new THREE.Vector3(-Math.sin(a),0,-Math.cos(a)));
   const ih=ray.intersectObject(ice)[0];if(!ih)continue;
   const rim=.91-.18*ih.point.z+root.position.y;
   if(ih.point.y<rim-.03){const bh=ray.intersectObject(bowl)[0];check(bh&&bh.distance<=ih.distance+.005,'shaved ice must not pierce the outside of the bowl below its rim');}
  }
 }
 if(profile.id==='food-birthday-cake'){
  root.updateMatrixWorld(true);
  for(let i=0;i<3;i++){
   const candle=root.getObjectByName('Candle'+i),flame=root.getObjectByName('CandleFlame'+i),base=flame.getWorldPosition(new THREE.Vector3()),bounds=new THREE.Box3().setFromObject(candle);
   check(base.y-bounds.max.y>=-.003&&base.y-bounds.max.y<.02,'flame must meet the candle wick');
   for(const back of [false,true]){
    const core=root.getObjectByName((back?'FlameCoreBack':'FlameCore')+i),outer=root.getObjectByName('OuterFlame'+i),p=core.geometry.attributes.position;
    for(let j=0;j<p.count;j+=17){const v=new THREE.Vector3().fromBufferAttribute(p,j);core.localToWorld(v);const ray=new THREE.Raycaster(v,new THREE.Vector3(0,0,back?1:-1)),hit=ray.intersectObject(outer)[0];check(hit&&hit.distance<.006,'flame highlight must remain attached to flame surface');}
   }
  }
 }
 if(profile.id==='food-cheese'){
  root.updateMatrixWorld(true);const wedge=root.getObjectByName('CheeseWedgeSolid'),p=wedge.geometry.attributes.position,near=[],far=[];
  for(let i=0;i<p.count;i++){if(p.getZ(i)>.47)near.push(p.getX(i));if(p.getZ(i)<-.47)far.push(p.getX(i));}
  check(Math.max(...far)-Math.min(...far)<(Math.max(...near)-Math.min(...near))*.03,'cheese must taper to a narrow rear edge, not an extruded picture');
  const neck=root.getObjectByName('NeckJoin'),center=neck.getWorldPosition(new THREE.Vector3()),neckBounds=new THREE.Box3().setFromObject(neck),underside=new THREE.Raycaster(center,new THREE.Vector3(0,1,0)).intersectObject(wedge)[0];check(underside&&neckBounds.containsPoint(underside.point),'cheese neck must overlap the sloping underside');
  for(const [px,py,expected] of [[145,270,false],[492,270,false],[205,400,false],[190,270,true],[320,145,true]]){const origin=new THREE.Vector3((px-320)*.005,(580-py)*.005,4);root.localToWorld(origin);const hits=new THREE.Raycaster(origin,new THREE.Vector3(0,0,-1)).intersectObject(wedge);check(Boolean(hits.length)===expected,'cheese silhouette mismatch at '+px+','+py);}
 }
 if(profile.id==='food-chocolate'){
  root.updateMatrixWorld(true);const bar=new THREE.Box3().setFromObject(root.getObjectByName('ChocolateBarSolid')),tiles=[];root.traverse(o=>{if(/^RearChocolateTile/.test(o.name))tiles.push(o);});check(tiles.length===6,'six rear chocolate squares required');for(const tile of tiles)check(bar.intersectsBox(new THREE.Box3().setFromObject(tile)),'chocolate square detached from bar');
 }
 if(profile.id==='food-popcorn'){
  root.updateMatrixWorld(true);const mound=root.getObjectByName('PopcornMoundSolid'),limit=new THREE.Box3().setFromObject(mound).max.y+.04,kernels=[];root.traverse(o=>{if(/^RearPopcorn\d+_\d+$/.test(o.name))kernels.push(o);});check(kernels.length>=90,'popcorn side/rear clusters missing');
  check(kernels.every(o=>o.geometry.index.count/3<=300),'small popcorn lobes are unnecessarily dense');
  for(const kernel of kernels){const vertices=kernel.geometry.attributes.position;let top=-Infinity;for(let i=0;i<vertices.count;i++)top=Math.max(top,kernel.localToWorld(new THREE.Vector3().fromBufferAttribute(vertices,i)).y);check(top<=limit,'rear popcorn must not protrude far above original crown');const p=kernel.getWorldPosition(new THREE.Vector3()),hit=new THREE.Raycaster(new THREE.Vector3(p.x,4,p.z),new THREE.Vector3(0,-1,0)).intersectObject(mound)[0];check(hit&&Math.abs(hit.point.y-p.y)<.18,'popcorn kernel detached from mound');}
 }
 if(profile.id==='food-sushi'){
  root.updateMatrixWorld(true);const rice=root.getObjectByName('SushiRiceSolid'),grains=[];root.traverse(o=>{if(/^RearSushiRiceGrain/.test(o.name))grains.push(o);});
  check(grains.length>=25,'rear sushi rice grains missing');for(const grain of grains){const p=grain.getWorldPosition(new THREE.Vector3()),hit=new THREE.Raycaster(p,new THREE.Vector3(0,0,1)).intersectObject(rice)[0];check(hit&&hit.distance<.025,'sushi grain detached from rice volume');}
 }
 if(profile.id==='food-hot-dog'){
  root.updateMatrixWorld(true);const body=root.getObjectByName('HotDogCostumeSolid'),patch=root.getObjectByName('RearSausageSurface'),p=patch.geometry.attributes.position;
  for(let i=0;i<p.count;i+=19){const v=patch.localToWorld(new THREE.Vector3().fromBufferAttribute(p,i)),hit=new THREE.Raycaster(v,new THREE.Vector3(0,0,1)).intersectObject(body)[0];check(hit&&hit.distance<.012,'rear sausage paint detached from rounded bun');}
  check(root.userData.canWave===false,'hot dog must not advertise a wave with no independent arm');
 }
 if(profile.id==='food-pizza'){
  root.updateMatrixWorld(true);const slice=new THREE.Box3().setFromObject(root.getObjectByName('PizzaBaseSolid'));
  for(const side of [-1,1]){const hand=root.getObjectByName('PizzaHandSolid'+side);check(hand&&slice.intersectsBox(new THREE.Box3().setFromObject(hand)),'pizza source hand missing or detached');}
 }
 if(profile.id==='food-rice-ball'){
  root.updateMatrixWorld(true);const bottom=new THREE.Box3().setFromObject(root.getObjectByName('NoriBottomSolid'));
  for(const side of [-1,1])check(bottom.intersectsBox(new THREE.Box3().setFromObject(root.getObjectByName('NoriWrapSolid'+side))),'nori wrap must continue across the underside');
  for(const [x,y] of [[280,350],[320,345],[360,350]]){const origin=new THREE.Vector3((x-320)*.005,(580-y)*.005,3);root.localToWorld(origin);check(new THREE.Raycaster(origin,new THREE.Vector3(0,0,-1)).intersectObject(root.getObjectByName('NoriWrapSolid1')).length===0,'nori upper edge must not cut across the human face');}
 }
 if(profile.id==='food-sandwich'){
  root.updateMatrixWorld(true);
  for(const i of [0,1]){const leaf=root.getObjectByName('LettuceLayerSolid'+i),size=new THREE.Box3().setFromObject(leaf).getSize(new THREE.Vector3());check(size.z<.12,'lettuce must be a thin leaf, not the entire filling block');}
  const backBread=new THREE.Box3().setFromObject(root.getObjectByName('SandwichBackBreadSolid'));
  check(backBread.intersectsBox(new THREE.Box3().setFromObject(root.getObjectByName('SandwichTomatoFilling0'))),'rear sandwich bread must contact its filling');
  root.traverse(o=>{if(!/^(LettuceLayerSolid|SandwichTomatoFilling).*OriginalPaint$/.test(o.name))return;const p=o.geometry.attributes.position,c=o.geometry.attributes.color;for(let i=0;i<p.count;i++){const v=o.localToWorld(new THREE.Vector3().fromBufferAttribute(p,i));root.worldToLocal(v);const x=v.x/.005+320,y=580-v.y/.005;if(x>280&&x<360&&y>270&&y<340)check(c.getW(i)===0,'hidden sandwich filling must not carry a duplicate human face');}});
  check(root.userData.canWave===false,'sandwich must not advertise a wave with no visible arms');
 }
 if(profile.id==='food-fish-pastry'){
  root.updateMatrixWorld(true);const torso=new THREE.Box3().setFromObject(root.getObjectByName('PastryTorsoSolid'));
  for(const side of [-1,1]){const shoulder=new THREE.Box3().setFromObject(root.getObjectByName('PastryShoulderJoin'+side)),hand=new THREE.Box3().setFromObject(root.getObjectByName('RaisedPastryHandSolid'+side));check(torso.intersectsBox(shoulder)&&shoulder.intersectsBox(hand),'raised pastry hand must connect to torso through its shoulder');}
 }
 if(profile.id==='food-toast'){
  root.updateMatrixWorld(true);check(new THREE.Box3().setFromObject(root.getObjectByName('ToastBreadSolid')).intersectsBox(new THREE.Box3().setFromObject(root.getObjectByName('ToastRearCrumbSolid'))),'rear toast crumb must meet the bread');
 }
 if(profile.id==='food-tteokbokki'){
  root.updateMatrixWorld(true);const sauce=root.getObjectByName('RiceCakeSauceSolid'),bowl=root.getObjectByName('RiceCakeBowlSolid');
  for(const [x,y] of [[280,292],[320,292],[360,292],[320,345]]){
   const origin=new THREE.Vector3((x-320)*.005,(580-y)*.005,3);root.localToWorld(origin);const ray=new THREE.Raycaster(origin,new THREE.Vector3(0,0,-1)),hit=ray.intersectObject(sauce)[0],rim=ray.intersectObject(bowl)[0];
   check(hit&&(!rim||hit.distance<rim.distance),'outward food surface must expose the face in front of the rim at '+x+','+y);
  }
 }
 if(['fruit-apple','fruit-orange'].includes(profile.id)){
  root.updateMatrixWorld(true);const prefix=profile.id==='fruit-apple'?'Apple':'Orange',fruit=new THREE.Box3().setFromObject(root.getObjectByName(prefix+'FruitSolid')),stalk=new THREE.Box3().setFromObject(root.getObjectByName(prefix+'StalkSolid')),leaf=new THREE.Box3().setFromObject(root.getObjectByName(prefix+'LeafSolid'));
  check(fruit.intersectsBox(stalk)&&stalk.intersectsBox(leaf),'fruit stalk and leaf must remain connected');check(leaf.max.x-leaf.min.x>.38,'source leaf must not shrink to a tiny accessory');
 }
 if(profile.id==='fruit-blueberry'){
  root.updateMatrixWorld(true);const fruit=new THREE.Box3().setFromObject(root.getObjectByName('BlueberryFruitSolid')),crown=new THREE.Box3().setFromObject(root.getObjectByName('BlueberryCrownSolid'));
  check(fruit.intersectsBox(crown),'blueberry crown must contact its fruit');check((crown.max.x-crown.min.x)/(fruit.max.x-fruit.min.x)>.33,'source blueberry crown must retain its broad scalloped silhouette');
 }
 if(profile.id==='fruit-avocado'){
  root.updateMatrixWorld(true);const half=root.getObjectByName('AvocadoHalfSolid'),size=new THREE.Box3().setFromObject(half).getSize(new THREE.Vector3());
  check(motion==='hop'&&!root.getObjectByName('Torso'),'bodyless avocado must hop without an invented torso');check(size.x>1.8&&size.z/size.x<.6,'avocado must retain broad cut face and half-fruit depth');
 }
 if(profile.id==='fruit-grape'){
  root.updateMatrixWorld(true);const face=new THREE.Box3().setFromObject(root.getObjectByName('GrapeWearerSolid')),torso=new THREE.Box3().setFromObject(root.getObjectByName('GrapeTorsoSolid'));
  check(face.max.z<.55,'grape face must stay inside the cluster rather than projecting far forward');
  for(const side of [-1,1]){const hand=new THREE.Box3().setFromObject(root.getObjectByName('GrapeRaisedHandSolid'+side)),join=new THREE.Box3().setFromObject(root.getObjectByName('GrapeShoulderJoin'+side));check(hand.max.z<.45&&hand.intersectsBox(join)&&join.intersectsBox(torso),'grape hand must remain close to its cheek and connected to torso');}
  root.traverse(o=>{if(!/^GrapeBerrySolid\d+OriginalPaint$/.test(o.name))return;const p=o.geometry.attributes.position,c=o.geometry.attributes.color;for(let i=0;i<p.count;i++){const v=o.localToWorld(new THREE.Vector3().fromBufferAttribute(p,i));root.worldToLocal(v);const x=v.x/.005+320,y=580-v.y/.005;if(((x-320)/100)**2+((y-327)/80)**2<1)check(c.getW(i)===0,'grape berries must not carry duplicate human facial features');}});
 }
 if(profile.id==='fruit-mango'){
  root.updateMatrixWorld(true);const body=new THREE.Box3().setFromObject(root.getObjectByName('MangoFruitSolid')),leaf=new THREE.Box3().setFromObject(root.getObjectByName('MangoLeafSolid')),sleeve=new THREE.Box3().setFromObject(root.getObjectByName('MangoSleeveSolid'));
  check(body.intersectsBox(leaf)&&body.intersectsBox(sleeve),'mango leaf and sleeve must contact the fruit');check(!root.getObjectByName('Torso'),'mango must not contain a separate oversized torso');
 }
 if(profile.id==='fruit-melon'){
  root.updateMatrixWorld(true);const fruit=root.getObjectByName('MelonFruitSolid'),center=root.localToWorld(new THREE.Vector3(0,(580-282)*.005,0)),net=[];root.traverse(o=>{if(/^MelonRearNet\d+$/.test(o.name))net.push(o);});check(net.length>100,'melon rear net missing');
  for(const o of net){check(o.geometry.index.count/3<=120,'melon net segment is unnecessarily dense');const p=o.geometry.attributes.position;for(const ring of [0,4,8]){const v=new THREE.Vector3();for(let i=0;i<6;i++)v.add(new THREE.Vector3().fromBufferAttribute(p,ring*7+i));v.multiplyScalar(1/6);o.localToWorld(v);const dir=v.clone().sub(center).normalize(),hit=new THREE.Raycaster(v.clone().addScaledVector(dir,.03),dir.clone().negate()).intersectObject(fruit)[0];check(hit&&hit.distance>.025&&hit.distance<.045,'melon net must follow the actual rind surface');}}
 }
 if(profile.id==='fruit-peach'){
  root.updateMatrixWorld(true);const body=new THREE.Box3().setFromObject(root.getObjectByName('PeachFruitSolid'));
  for(const side of ['Left','Right']){check(body.intersectsBox(new THREE.Box3().setFromObject(root.getObjectByName('PeachLeaf'+side+'Solid'))),'peach leaf must contact fruit');const arm=new THREE.Box3().setFromObject(root.getObjectByName(side+'Arm'));check(arm.max.x-arm.min.x<.3,'peach arm must not include a duplicated large leaf');}
 }
 if(profile.id==='food-candy'){
  for(const name of ['LeftWrapper','RightWrapper'])check(root.getObjectByName(name).children.length===0,'legacy candy wrapper must not overlap the authored wrapper');
  root.updateMatrixWorld(true);const headBounds=new THREE.Box3().setFromObject(root.getObjectByName('CandyShellSolid')),torsoBounds=new THREE.Box3().setFromObject(root.getObjectByName('CandyTorsoSolid'));check(headBounds.intersectsBox(torsoBounds),'candy head and torso must overlap');
 }
 if(profile.id==='food-cookie'){
  root.updateMatrixWorld(true);const cookie=root.getObjectByName('CookieShellSolid'),chips=[];root.traverse(o=>{if(/^RearCookieChip\d+$/.test(o.name))chips.push(o);});
  check(chips.length===9,'cookie rear chocolate chips missing');
  for(const chip of chips){const p=chip.getWorldPosition(new THREE.Vector3()),ray=new THREE.Raycaster(p,new THREE.Vector3(0,0,1)),hit=ray.intersectObject(cookie)[0];check(hit&&hit.distance<.018,'cookie chocolate chip must touch the biscuit');}
 }
 if(profile.id==='food-pudding'){
  root.updateMatrixWorld(true);const coating=root.getObjectByName('RearCaramelCoatingSolid'),body=root.getObjectByName('PuddingShellSolid'),cap=root.getObjectByName('CaramelCapSolid'),p=coating.geometry.attributes.position,n=coating.geometry.attributes.normal;
  let outward=0,samples=0;for(let i=98;i<1160;i+=83){const q=new THREE.Vector3().fromBufferAttribute(p,i),dir=new THREE.Vector3(q.x,0,q.z).normalize();outward+=dir.dot(new THREE.Vector3().fromBufferAttribute(n,i));samples++;coating.localToWorld(q);const ray=new THREE.Raycaster(q,dir.negate()),hit=ray.intersectObjects([body,cap])[0];check(hit&&hit.distance<.018,'caramel coating must remain attached to pudding');}
  check(outward/samples>.5,'caramel outside faces must face outwards');
 }
 if(profile.id==='food-macaron'){
  root.updateMatrixWorld(true);const join=root.getObjectByName('NeckJoin'),center=join.getWorldPosition(new THREE.Vector3()),joinBounds=new THREE.Box3().setFromObject(join);
  const body=root.getObjectByName('ContinuousFoodBody'),torso=root.getObjectByName('TorsoSolid');
  for(const [target,direction] of [[body,1],[torso,-1]]){
   const ray=new THREE.Raycaster(center,new THREE.Vector3(0,direction,0));
   // Read the underside as well as the outside without changing the model.
   const proxy=new THREE.Mesh(target.geometry,new THREE.MeshBasicMaterial({side:THREE.DoubleSide}));proxy.matrixAutoUpdate=false;proxy.matrixWorld.copy(target.matrixWorld);
   const hit=ray.intersectObject(proxy)[0];check(hit&&hit.point.y>=joinBounds.min.y&&hit.point.y<=joinBounds.max.y,'macaron neck must overlap both head and torso');proxy.material.dispose();
  }
 }
 if(profile.id==='food-gimbap'){
  root.updateMatrixWorld(true);const roll=root.getObjectByName('NoriRoll'),rice=root.getObjectByName('RiceTop'),size=new THREE.Box3().setFromObject(roll).getSize(new THREE.Vector3());
  check(Math.abs(size.x-size.z)<.005,'gimbap must retain a round full-depth roll');
  for(let i=0;i<3;i++){const center=new THREE.Box3().setFromObject(root.getObjectByName('Filling'+i)).getCenter(new THREE.Vector3()),ray=new THREE.Raycaster(center,new THREE.Vector3(0,-1,0)),hit=ray.intersectObject(rice)[0];check(hit&&hit.distance<.045,'gimbap filling must meet rice surface');}
 }
 if(profile.id==='food-hamburger'){
  root.updateMatrixWorld(true);const bun=root.getObjectByName('ContinuousFoodBody');
  for(let i=0;i<16;i++){const seed=root.getObjectByName('Sesame'+i),center=seed.getWorldPosition(new THREE.Vector3()),normal=new THREE.Vector3(0,1,0).applyQuaternion(seed.getWorldQuaternion(new THREE.Quaternion())),ray=new THREE.Raycaster(center.clone().addScaledVector(normal,.03),normal.clone().negate()),hit=ray.intersectObject(bun)[0];check(hit&&hit.distance>.025&&hit.distance<.05,'sesame must sit on bun surface, not remain buried');}
 }
 if(profile.id==='food-ice-cream'){
  root.updateMatrixWorld(true);const cone=root.getObjectByName('WaffleCone');
  root.traverse(o=>{if(!o.isMesh||!o.name.startsWith('WaffleRidge'))return;const p=o.geometry.attributes.position,rings=p.count/9;
   for(const ring of [0,Math.floor(rings/2),rings-1]){const center=new THREE.Vector3();for(let i=0;i<8;i++)center.add(new THREE.Vector3().fromBufferAttribute(p,ring*9+i));center.multiplyScalar(1/8);o.localToWorld(center);const direction=new THREE.Vector3(center.x,0,center.z).normalize(),ray=new THREE.Raycaster(center.clone().addScaledVector(direction,.05),direction.clone().negate()),hit=ray.intersectObject(cone)[0];check(hit&&hit.distance>.045&&hit.distance<.065,'waffle ridge must follow the cone exterior');}
  });
 }
 for(const clip of clips){const mixer=new THREE.AnimationMixer(root);mixer.clipAction(clip).play();for(let i=0;i<24;i++){mixer.setTime(clip.duration*i/24);root.updateMatrixWorld(true);check(minimumSurfaceY(root)>-.006,'below floor '+clip.name);if(motion==='walk'){const foot=Math.min(...legNames.map(n=>new THREE.Box3().setFromObject(root.getObjectByName(n)).min.y));check(foot<.008&&foot>-.006,'unplanted '+clip.name);}}mixer.stopAllAction();}
 if(profile.id.startsWith('sport-')&&profile.id!=='sport-bowling'){
  root.updateMatrixWorld(true);const ball=root.getObjectByName('Ball'),face=root.getObjectByName('OriginalFace');check(ball&&Math.abs(ball.scale.x-ball.scale.z)<1e-6&&Math.abs(ball.scale.x-ball.scale.y)<1e-6,'sports ball must be spherical');
  check(face&&root.getObjectByName('BallInkShell'),'sports ball needs supported original face and continuous 3D outline');
  if(ball&&face){const bounds=new THREE.Box3().setFromObject(face),p=face.geometry.attributes.position;check(bounds.max.x-bounds.min.x<1.15,'only the face may use the source projection; whole-sphere silhouette projection creates side zipper artifacts');for(let i=0;i<p.count;i+=43){const v=new THREE.Vector3().fromBufferAttribute(p,i);face.localToWorld(v);const support=[ball];if(profile.id==='sport-soccer')root.traverse(o=>{if(/^FootballPanel\d+$/.test(o.name))support.push(o);});const hit=new THREE.Raycaster(v,new THREE.Vector3(0,0,-1)).intersectObjects(support)[0];check(hit&&hit.distance<.015,'sports face must remain on the actual ball');}}
  if(profile.id==='sport-soccer'){let panels=0,edges=0;root.traverse(o=>{if(/^FootballPanel\d+$/.test(o.name))panels++;if(/^FootballEdge\d+$/.test(o.name))edges++;});check(panels===32,'classic soccer pattern requires 12 pentagons and 20 hexagons');check(edges===90&&triangles<60000,'soccer panel borders must be shared once, not duplicated around every panel');}
  if(profile.id==='sport-baseball'){let stitches=0;root.traverse(o=>{if(/^BaseballStitch\d+$/.test(o.name))stitches++;});check(stitches===64&&root.getObjectByName('BaseballContinuousSeam'),'stylized source baseball needs one continuous seam with evenly distributed visible stitches');}
  if(profile.id==='sport-basketball'){
   const seam=root.getObjectByName('BasketballContinuousSeam');check(seam&&root.getObjectByName('BasketballGreatCircle0')&&root.getObjectByName('BasketballGreatCircle1'),'basketball needs two great circles and one closed curved seam');
   if(seam){const p=seam.geometry.attributes.position,centers=[];for(let i=0;i<p.count-9;i+=9){const c=new THREE.Vector3();for(let j=0;j<8;j++)c.add(new THREE.Vector3().fromBufferAttribute(p,i+j));centers.push(c.multiplyScalar(1/8).sub(new THREE.Vector3(0,1.64,0)));}for(const value of [v=>v.x,v=>Math.cos(.45)*v.y-Math.sin(.45)*v.z]){const signs=centers.map(value).filter(v=>Math.abs(v)>1e-5).map(Math.sign);let crossings=0;for(let i=0;i<signs.length;i++)if(signs[i]!==signs[(i+1)%signs.length])crossings++;check(crossings===2,'basketball curved seam must cross each great circle twice to preserve eight panels');}}
  }
 }
 if(profile.id==='sport-bowling'){
  root.updateMatrixWorld(true);const pin=root.getObjectByName('BowlingPin'),hood=root.getObjectByName('BowlingHood'),body=root.getObjectByName('BowlingSuitSurface'),ball=root.getObjectByName('BowlingBall');check(pin&&hood&&body&&ball,'bowling requires pin, hood, connected wearer and ball');
  if(pin&&hood&&body&&ball){const box=o=>new THREE.Box3().setFromObject(o);check(box(body).intersectsBox(box(hood))&&box(body).intersectsBox(box(pin))&&box(body).intersectsBox(box(ball)),'bowling costume parts detached');for(let n=0;n<2;n++){const band=root.getObjectByName('PinRedBand'+n);check(band,'bowling pin neck band missing');if(band){const p=band.geometry.attributes.position;for(let i=0;i<p.count;i+=97){const v=new THREE.Vector3().fromBufferAttribute(p,i);band.localToWorld(v);const origin=pin.getWorldPosition(new THREE.Vector3());origin.y=v.y;const dir=v.clone().sub(origin).normalize(),hit=new THREE.Raycaster(origin.clone().addScaledVector(dir,2),dir.clone().negate()).intersectObject(pin)[0];check(hit&&hit.point.distanceTo(v)<.008,'bowling red band must follow pin curvature instead of a floating cylinder');}}}}
 }

 if(profile.id==='vehicle-train'){
  root.updateMatrixWorld(true);const cab=root.getObjectByName('TrainCabSolid'),roof=root.getObjectByName('TrainCurvedRoofSolid'),barrel=root.getObjectByName('TrainBoilerBarrelSolid'),door=root.getObjectByName('TrainBoilerDoorSolid'),chassis=root.getObjectByName('TrainConnectedChassisSolid'),base=root.getObjectByName('TrainUnderframeSolid'),grille=root.getObjectByName('TrainSlottedGrilleSolid'),backing=root.getObjectByName('TrainGrilleRecessBackingSolid'),stem=root.getObjectByName('TrainChimneyStemSolid'),lip=root.getObjectByName('TrainChimneyLipSolid');
  const hit=(o,x,y,rear=false)=>new THREE.Raycaster(root.localToWorld(new THREE.Vector3((x-320)*.005,(580-y)*.005,rear?-4:4)),new THREE.Vector3(0,0,rear?1:-1)).intersectObject(o)[0],overlap=(a,b,x,y)=>{const af=hit(a,x,y),ar=hit(a,x,y,true),bf=hit(b,x,y),br=hit(b,x,y,true);return af&&ar&&bf&&br&&Math.max(ar.point.z,br.point.z)<Math.min(af.point.z,bf.point.z);};
  check(cab&&roof&&barrel&&door&&chassis&&base&&grille&&backing&&stem&&lip,'train needs individually authored connected engine components');
  if(cab&&roof&&barrel&&door&&chassis&&base&&grille&&backing&&stem&&lip){
   check(overlap(cab,roof,318,105)&&overlap(cab,base,318,414),'train roof/cab/base disconnected');check(overlap(cab,barrel,318,275)&&overlap(barrel,door,318,301),'train boiler disconnected');check(overlap(barrel,stem,314,185)&&overlap(stem,lip,314,125),'train chimney disconnected');
   const art=root.getObjectByName('TrainBoilerDoorSolidOriginalPaint');for(const[x,y]of [[263,300],[367,300],[318,351]])check(art&&hit(art,x,y),'train original expression missing');for(const[x,y]of [[318,355],[318,382],[260,350],[375,350]]){const a=hit(door,x,y),b=hit(chassis,x,y);check(a&&(!b||a.distance<b.distance),'train chassis hides the face');}
   const windows=root.getObjectByName('TrainCabSolidOriginalPaint');for(const[x,y]of [[220,177],[411,177]]){const h=windows&&hit(windows,x,y);check(h,'train source front window missing');if(h){const color=windows.geometry.attributes.color;check([h.face.a,h.face.b,h.face.c].every(i=>color.getW(i)>.9),'train source window faded by coarse mask');}}

   for(const side of [-1,1]){const frame=root.getObjectByName('TrainSideWindowFrame'+side),glass=root.getObjectByName('TrainSideWindowGlass'+side);check(frame&&glass,'train side window missing');if(frame&&glass){const origin=root.localToWorld(new THREE.Vector3(side*5,(580-204)*.005,-.50)),direction=new THREE.Vector3(-side,0,0),ray=new THREE.Raycaster(origin,direction),a=ray.intersectObject(cab)[0],b=ray.intersectObject(frame)[0],c=ray.intersectObject(glass)[0];check(a&&b&&c&&c.distance<b.distance&&b.distance<a.distance,'train side glass or frame buried inside cab');const p=glass.geometry.attributes.position;for(let i=0;i<p.count;i+=17){const v=glass.localToWorld(new THREE.Vector3().fromBufferAttribute(p,i)),h=new THREE.Raycaster(v.clone().add(new THREE.Vector3(side,0,0)),direction).intersectObject(cab)[0];check(h&&Math.abs(v.x-h.point.x)<.060,'train side glass exceeds its fitted frame thickness');}}}
   for(const[x,y]of [[221,497],[258,498],[290,500],[419,497],[382,498],[350,500]])check(!hit(grille,x,y)&&hit(backing,x,y),'train grille slot must be a real backed recess');
   const inside=(o,supports)=>{const p=o.geometry.attributes.position;let n=0;for(let i=0;i<p.count;i+=9){const v=o.localToWorld(new THREE.Vector3().fromBufferAttribute(p,i));for(const support of supports){const a=new THREE.Raycaster(v.clone().add(new THREE.Vector3(0,0,4)),new THREE.Vector3(0,0,-1)).intersectObject(support)[0],b=new THREE.Raycaster(v.clone().add(new THREE.Vector3(0,0,-4)),new THREE.Vector3(0,0,1)).intersectObject(support)[0];if(a&&b&&v.z<a.point.z&&v.z>b.point.z){n++;break;}}}return n;};
   for(const side of [-1,1]){const guard=root.getObjectByName('TrainFrontGuard'+side+'Solid'),lamp=root.getObjectByName('TrainHeadlamp'+side+'Solid');check(guard&&inside(guard,[grille,backing])>3,'train front guard floats away from grille');check(lamp&&inside(lamp,[chassis])>3,'train headlamp floats from its panel');}
   for(const label of ['Rear','Front']){const mount=root.getObjectByName('Train'+label+'AxleMountSolid'),axle=root.getObjectByName('Train'+label+'AxleSolid');check(mount&&axle&&inside(mount,[base])>3&&overlap(axle,mount,320,538),'train axle mount disconnected');}
   const wheels=[];root.traverse(o=>{if(/^Wheel(Left|Right)(Front|Rear)$/.test(o.name))wheels.push(o);});check(wheels.length===4,'train requires four wheels');const walk=clips.find(c=>c.name==='Walk');check(Math.abs(root.userData.walkStride-2*Math.PI*.21)<.0001,'train travel stride must match wheel circumference');
   for(const wheel of wheels){check(walk.tracks.some(t=>t.name===wheel.name+'.quaternion'&&Math.max(...t.values)-Math.min(...t.values)>1.9),'train wheel rotation missing');const tire=wheel.getObjectByName(wheel.name+'TireSolid'),axle=root.getObjectByName('Train'+(wheel.name.endsWith('Rear')?'Rear':'Front')+'AxleSolid');check(tire&&new THREE.Box3().setFromObject(tire).intersectsBox(new THREE.Box3().setFromObject(axle)),'train wheel detached from axle');check(Math.abs(minimumSurfaceY(tire))<.012,'train wheel not grounded');}
  }
 }

 for(const clip of clips)for(const track of clip.tracks){const node=track.name.slice(0,track.name.lastIndexOf('.'));check(!!root.getObjectByName(node),'missing animated node '+node);check(Array.from(track.values).every(Number.isFinite),'non-finite animation '+track.name);}
 const data=fs.readFileSync(path.resolve(__dirname,'../apps/avatar-lab/models',profile.id+'.glb'));const len=data.readUInt32LE(12),gltf=JSON.parse(data.subarray(20,20+len));
 const expectedClips=['Idle','Walk','Wave',...(root.userData.effectClip?[root.userData.effectClip]:[])];
 check(JSON.stringify(gltf.animations.map(c=>c.name).sort())===JSON.stringify(expectedClips.sort()),'export clips');
 check(gltf.materials.every(m=>m.extensions?.KHR_materials_unlit),'export lighting');
 if(profile.id==='theme-snowman')for(const n of ['LeftArm','RightArm','LeftLeg','RightLeg'])check(!root.getObjectByName(n),'snowman must be limbless: '+n);
 const exportedTriangles=gltf.meshes.reduce((s,m)=>s+m.primitives.reduce((t,p)=>t+(p.indices===undefined?gltf.accessors[p.attributes.POSITION].count:gltf.accessors[p.indices].count)/3,0),0);check(exportedTriangles===triangles,'exported geometry is stale');
 for(const node of gltf.nodes){if(node.mesh===undefined)continue;const object=root.getObjectByName(node.name);check(!!object?.isMesh,'missing source mesh '+node.name);if(!object?.isMesh)continue;for(const primitive of gltf.meshes[node.mesh].primitives)for(const [semantic,name] of [['POSITION','position'],['NORMAL','normal'],['TEXCOORD_0','uv'],['COLOR_0','color']]){const accessorIndex=primitive.attributes[semantic];if(accessorIndex===undefined)continue;const attribute=object.geometry.attributes[name],accessor=gltf.accessors[accessorIndex],view=gltf.bufferViews[accessor.bufferView],start=28+len+(view.byteOffset||0)+(accessor.byteOffset||0),expected=Buffer.from(attribute.array.buffer,attribute.array.byteOffset,attribute.array.byteLength);check(data.subarray(start,start+expected.length).equals(expected),'stale exported '+semantic+' '+node.name);}}
 if(root.userData.sourceChecksum)check(gltf.nodes[0].extras.sourceChecksum===root.userData.sourceChecksum,'stale source profile checksum');
 const image=gltf.bufferViews[gltf.images[0].bufferView];check(data.subarray(28+len+image.byteOffset,28+len+image.byteOffset+image.byteLength).equals(fs.readFileSync(path.resolve(__dirname,'../apps/classtools/assets/avatars',profile.id+'.webp'))),'original artwork bytes');
 results.push({id:profile.id,modelSha256:crypto.createHash('sha256').update(data).digest('hex'),triangles,bytes:data.length,errors:[...new Set(errors)]});if(errors.length)console.log(profile.id+': '+[...new Set(errors)].join(', '));
 root.traverse(o=>{if(o.isMesh){o.geometry.dispose();o.material.dispose();}});
}
fs.writeFileSync(path.resolve(__dirname,'../outputs/qa/avatar-lab/all-152/'+(process.argv.length>2?'geometry-targeted.json':'geometry.json')),JSON.stringify({count:results.length,passed:results.filter(r=>!r.errors.length).length,results},null,2));
assert.equal(results.filter(r=>r.errors.length).length,0,'collection geometry failures');console.log('PASS '+results.length+' collection avatars: closed silhouette solids, finite animation, correct leg count, floor contact, original artwork and exported clips.');
