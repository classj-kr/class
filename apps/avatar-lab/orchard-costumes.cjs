"use strict";

module.exports=function orchard(T,k,id,parts){
 if(!['fruit-apple','fruit-avocado','fruit-blueberry','fruit-orange'].includes(id))return false;
 const head=parts.get('Head'),s=require('./sculpt-kit.cjs')(T,k,head);s.parent.clear();
 s.parent.userData.directSurfaceArtwork=true;
 s.parent.userData.artworkOpaqueRegions=[{cx:320,cy:320,rx:118,ry:101}];
 function volume(name,outline,center,front,back,color,z=0){
  k.volume(name+'Half',outline,center,s.pivot,front,back,s.parent,k.solid(name+'Color',color),{art:false,samples:96,z});
  const P=[],I=[];for(const suffix of ['Surface','Back']){const o=s.parent.getObjectByName(name+'Half'+suffix),offset=P.length/3;P.push(...o.geometry.attributes.position.array);I.push(...Array.from(o.geometry.index.array,v=>v+offset));s.parent.remove(o);}
  return k.mesh(name,k.geometry(P,I),k.solid(name+'Color',color),s.parent);
 }
 const plain=o=>{o.userData.skipOriginalPaint=true;return o;};
 function rearMark(name,target,x,y,rx,ry,color){
  target.updateWorldMatrix(true,false);const ray=new T.Raycaster(new T.Vector3((x-320)*.005,(580-y)*.005,-3),new T.Vector3(0,0,1)),hit=ray.intersectObject(target)[0];if(!hit)return;
  const o=plain(s.ellipsoid(name,[x,y,hit.point.z-.003],[rx,ry,.006],color));
  const normal=hit.face.normal.clone().transformDirection(target.matrixWorld);o.quaternion.setFromUnitVectors(new T.Vector3(0,0,1),normal);
 }
 let body;
 if(id==='fruit-apple'){
  body=volume('AppleFruitSolid',[[320,148],[372,132],[428,144],[472,183],[500,238],[506,294],[492,354],[459,398],[411,431],[363,442],[321,432],[278,444],[232,433],[188,401],[155,357],[137,302],[134,245],[151,193],[188,153],[236,133],[282,136]],[320,288],.78,.78,'#d94538');
  volume('AppleStalkSolid',[[310,163],[304,131],[292,106],[278,87],[279,77],[291,68],[305,75],[317,91],[325,114],[334,158]],[309,115],.055,.055,'#79452a');
  volume('AppleLeafSolid',[[328,143],[329,119],[343,91],[371,71],[411,63],[410,87],[400,113],[372,134]],[367,105],.075,.075,'#5e8b31');
 }
 if(id==='fruit-blueberry'){
  body=volume('BlueberryFruitSolid',[[320,96],[378,104],[428,133],[472,179],[500,229],[509,282],[496,338],[466,381],[420,414],[371,434],[320,441],[263,432],[215,410],[175,376],[146,329],[131,278],[137,226],[163,178],[206,139],[260,109]],[320,276],.81,.81,'#536da5');
  volume('BlueberryCrownSolid',[[320,62],[338,72],[368,73],[385,88],[377,107],[384,123],[369,138],[347,138],[329,155],[310,155],[292,141],[266,141],[247,128],[253,110],[245,91],[260,77],[291,75]],[316,108],.16,.16,'#3b528c');
  const crown=s.parent.getObjectByName('BlueberryCrownSolid'),p=crown.geometry.attributes.position;
  for(let i=0;i<p.count;i++){const y=s.pivot[1]-p.getY(i)/.005;p.setZ(i,p.getZ(i)+Math.max(0,y-62)*.006);}crown.geometry.computeVertexNormals();
  s.parent.userData.artworkOcclusion=true;
  rearMark('BlueberryRearCrownCenter',s.parent.getObjectByName('BlueberryCrownSolid'),316,109,33,14,'#293e73');
 }
 if(id==='fruit-orange'){
  body=volume('OrangeFruitSolid',[[320,126],[386,136],[445,169],[483,216],[502,270],[500,326],[475,374],[430,414],[377,439],[320,447],[260,440],[209,418],[169,382],[143,334],[135,282],[147,227],[179,182],[221,150],[269,132]],[320,286],.82,.82,'#ed9c32');
  volume('OrangeStalkSolid',[[307,146],[304,124],[298,101],[300,82],[313,73],[321,86],[327,115],[333,137],[355,148],[333,151],[321,163],[307,153],[285,153]],[320,124],.07,.07,'#5a832f');
  const stalk=s.parent.getObjectByName('OrangeStalkSolid'),p=stalk.geometry.attributes.position;
  for(let i=0;i<p.count;i++){const y=s.pivot[1]-p.getY(i)/.005;p.setZ(i,p.getZ(i)+Math.max(0,y-110)*.009);}stalk.geometry.computeVertexNormals();
  s.parent.userData.artworkOcclusion=true;
  volume('OrangeLeafSolid',[[326,123],[335,95],[362,75],[396,65],[432,69],[442,76],[425,96],[397,117],[363,128]],[382,98],.08,.08,'#618b34');
  for(let i=0;i<30;i++){const a=i*2.399,r=Math.sqrt((i+.5)/30);rearMark('OrangeRearPore'+i,body,320+Math.cos(a)*155*r,285+Math.sin(a)*138*r,2.2+(i%3)*.5,2.8,'#d98a2b');}
 }
 if(id==='fruit-avocado'){
  body=volume('AvocadoHalfSolid',[[320,63],[354,66],[382,88],[405,124],[428,177],[456,244],[483,310],[502,371],[503,426],[482,474],[447,513],[394,541],[339,555],[285,552],[228,534],[181,503],[149,460],[134,412],[135,364],[150,310],[174,249],[200,187],[224,132],[247,94],[279,71]],[320,354],.17,.83,'#52732e');
  // The cut half is broad and shallow on the face, with a rounded skin behind.
  // There is no separate humanoid torso or pair of invented legs.
  for(const name of ['Torso','LeftLeg','RightLeg']){const old=parts.get(name);if(old){old.group.parent.remove(old.group);parts.delete(name);}}
  volume('AvocadoBottomTipSolid',[[273,548],[306,550],[304,569],[294,579],[282,574]],[291,561],.08,.08,'#52732e');
 }
 s.paint();head.authoredFamily='orchard';return true;
};
