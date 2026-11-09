"use strict";
// Independently authored garden characters; dimensions use the 640px source.
module.exports=function gardenCostumes(THREE,k,id,parts){
 const species=id.replace('animal-','');if(!['bee','butterfly','praying-mantis','snail'].includes(species))return false;
 for(const p of parts.values())k.body.remove(p.group);parts.clear();
 const colors={bee:'#f2c746',butterfly:'#b67cb0','praying-mantis':'#94b94f',snail:'#e8b784'},base=colors[species];
 function part(name,pivot,color=base,z=0){const p={part:{pivot,color},group:k.group(name,pivot,z),solid:k.solid(name+'Base',color),special:true};p.group.userData.directSurfaceArtwork=true;p.group.userData.artworkOpaqueRegions=[];parts.set(name,p);return p;}
 function sculpt(p){return require('./sculpt-kit.cjs')(THREE,k,p);}
 function volume(p,name,outline,center,depth,color=base,z=0,backDepth=depth){const old=new Set(p.group.children);k.volume(name,outline,center,p.part.pivot,depth,backDepth,p.group,k.solid(name+'Color',color),{art:false,z,samples:128});return p.group.children.filter(m=>!old.has(m));}
 function paint(p){require('./project-model-artwork.cjs')(THREE,k,p.group,p.part.pivot);}
 function limb(name,outline,center,pivot,depth,color){const p=part(name,pivot,color);volume(p,name+'Form',outline,center,depth,color);paint(p);return p;}
 function rim(p,name,outline,color,r=.009,z=0){const ps=outline.map(([x,y])=>[x,y,z]);ps.push(ps[0]);const m=sculpt(p).tube(name,ps,r,color);m.userData.skipOriginalPaint=true;}
 function backPaint(p,surfaces,excluded=[]){for(const m of surfaces){if(!m.name.endsWith('Back'))continue;const g=m.geometry.clone(),pos=g.attributes.position,uv=[],alpha=[];
  for(let i=0;i<pos.count;i++){const x=pos.getX(i)/.005+p.part.pivot[0],y=p.part.pivot[1]-pos.getY(i)/.005;uv.push(x/640,y/640);const fade=Math.min(1,Math.max(0,(-g.attributes.normal.getZ(i)-.35)/.35));alpha.push(1,1,1,excluded.some(f=>((x-f[0])/f[2])**2+((y-f[1])/f[3])**2<1)?0:fade);pos.setZ(i,pos.getZ(i)-.004);}
  g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setAttribute('color',new THREE.Float32BufferAttribute(alpha,4));const mat=k.art.clone();mat.vertexColors=true;mat.transparent=true;mat.alphaTest=0;mat.depthWrite=false;k.mesh(m.name+'ReversePattern',g,mat,p.group);
 }}
 function bodyBands(p,bands){
  const surfaces=p.group.children.filter(m=>m.isMesh&&!m.material.userData.originalTexture),carriers=surfaces.map(m=>new THREE.Mesh(m.geometry,new THREE.MeshBasicMaterial({side:THREE.DoubleSide})));carriers.forEach(m=>m.updateMatrixWorld(true));
  const count=96,rows=8,ray=new THREE.Raycaster();
  for(const [j,[top,bottom,color]] of bands.entries()){
   const P=[],I=[];
   for(let row=0;row<=rows;row++)for(let i=0;i<count;i++){
    const a=(i+.5)/count*Math.PI*2,x=Math.cos(a),z=Math.sin(a),py=top+(bottom-top)*row/rows+3*z*z,y=(p.part.pivot[1]-py)*.005;
    ray.set(new THREE.Vector3(x*3,y,z*3),new THREE.Vector3(-x,0,-z));const hit=ray.intersectObjects(carriers)[0];if(!hit)throw new Error(id+' abdomen band misses surface at '+py);
    P.push(hit.point.x+x*.003,hit.point.y,hit.point.z+z*.003);
   }
   for(let row=0;row<rows;row++)for(let i=0;i<count;i++){const a=row*count+i,b=row*count+(i+1)%count,c=a+count,d=b+count;I.push(a,b,d,a,d,c);}
   const band=k.mesh('ContinuousBodyBand'+j,k.geometry(P,I),k.solid('BodyBandColor'+j,color),p.group);band.userData.skipOriginalPaint=true;
  }
  carriers.forEach(m=>m.material.dispose());
 }
 function fitted(p,surfaces,name,outline,center,depth,color){const meshes=volume(p,name,outline,center,depth,color),carriers=surfaces.map(m=>new THREE.Mesh(m.geometry,new THREE.MeshBasicMaterial({side:THREE.DoubleSide})));carriers.forEach(m=>m.updateMatrixWorld(true));const ray=new THREE.Raycaster();for(const m of meshes){const pos=m.geometry.attributes.position;for(let i=0;i<pos.count;i++){ray.set(new THREE.Vector3(pos.getX(i),pos.getY(i),4),new THREE.Vector3(0,0,-1));const hit=ray.intersectObjects(carriers)[0];pos.setZ(i,pos.getZ(i)+(hit?hit.point.z:.08)-.01);}m.geometry.computeVertexNormals();}carriers.forEach(m=>m.material.dispose());}
 if(species==='snail'){
  const head=part('Head',[195,311]);head.group.userData.artworkOpaqueRegions=[{cx:195,cy:345,rx:115,ry:93}];
  const shape=k.ellipse(195,310,154,143);volume(head,'SnailRoundHood',shape,[195,310],.57);rim(head,'SnailHoodPiping',shape,'#81502b');
  const s=sculpt(head);
  for(const [i,path] of [ [[127,207,.14,16],[118,163,.09,13],[103,126,.03,12],[89,94,0,17]], [[249,207,.14,16],[258,163,.09,13],[273,126,.03,12],[288,94,0,17]] ].entries()){
   s.sweep('ConnectedSnailEyeStalk'+i,path,'#e8b784');s.ellipsoid('RoundedSnailEyeTip'+i,[path.at(-1)[0],88,.015],[25,27,.13],'#e8b784');
  }
  paint(head);
  const foot=part('SnailFoot',[270,510],'#ecc496');
  volume(foot,'ContinuousSnailFoot',[[147,419],[216,410],[269,430],[300,481],[355,509],[425,526],[507,524],[548,539],[563,555],[551,570],[525,579],[485,576],[451,573],[415,581],[372,576],[336,575],[289,580],[245,576],[204,581],[169,574],[146,559],[134,537],[129,509],[133,473]],[270,527],.39,'#ecc496',0,.85);paint(foot);
  const shell=part('SpiralShell',[431,355],'#b77d4c',-.55);
  const shapeShell=[[290,209],[330,186],[373,171],[414,166],[459,172],[498,190],[533,216],[561,250],[580,290],[593,332],[596,372],[594,414],[583,451],[566,484],[543,509],[512,528],[474,539],[438,540],[398,532],[361,519],[329,499],[300,472],[278,441],[265,402],[258,361],[258,316],[263,274],[274,238]];
  const shellMeshes=volume(shell,'RoundedSpiralShell',shapeShell,[431,355],.72,'#b77d4c');
  const noFace=[[195,310,155,144]];for(const m of shellMeshes)m.userData.artworkExcludedRegions=noFace.map(([cx,cy,rx,ry])=>({cx,cy,rx,ry}));paint(shell);backPaint(shell,shellMeshes,noFace);
  return true;
 }
 const bee=species==='bee',butterfly=species==='butterfly',mantis=!bee&&!butterfly,cx=bee?292:320;
 const head=part('Head',[cx,bee?284:butterfly?303:296]);
 const hood=k.ellipse(cx,bee?284:butterfly?303:296,bee?162:butterfly?151:158,bee?149:butterfly?137:153);
 const surfaces=volume(head,'WholeGardenHood',hood,[cx,bee?284:butterfly?303:296],bee?.66:butterfly?.63:.68);
 head.group.userData.artworkOpaqueRegions=[{cx,cy:bee?321:butterfly?333:350,rx:bee?120:butterfly?116:112,ry:bee?94:butterfly?92:89}];
 rim(head,'GardenHoodPiping',hood,bee?'#82541b':butterfly?'#572546':'#4d6d28');
 const h=sculpt(head),mirror=(shape,side)=>shape.map(([x,y])=>[cx+side*(cx-x),y]);
 for(const side of [-1,1]){
  if(bee){h.sweep('BeeCurvedAntenna'+side,[[cx+side*55,174,.30,13],[cx+side*68,137,.21,14],[cx+side*97,108,.08,14],[cx+side*139,93,0,14]],'#513523');h.ellipsoid('BeeGoldenTip'+side,[cx+side*149,93,.015],[32,33,.16],'#f8d45b');}
  else if(butterfly){const path=[[276,196,.28,10],[267,151,.20,11],[250,112,.08,12],[225,87,0,12],[199,78,-.025,12],[179,89,-.025,12],[174,112,-.025,12],[188,128,-.025,12],[206,124,-.025,11],[208,113,-.025,10],[201,110,-.025,8]];h.sweep('CurledButterflyAntenna'+side,path.map(([x,y,z,r])=>[cx+side*(cx-x),y,z,r]),'#65454b');h.ellipsoid('ButterflyAntennaEnd'+side,[cx+side*119,110,-.025],[8,8,.04],'#65454b');}
  else{
   h.sweep('TaperedMantisAntenna'+side,[[cx+side*30,155,.25,8],[cx+side*39,123,.17,8],[cx+side*57,92,.08,7],[cx+side*80,69,.02,4],[cx+side*96,59,0,1]],'#769d3c');
   const eye=[[159,209],[169,184],[189,163],[214,152],[237,150],[256,161],[264,183],[263,207],[249,231],[228,249],[203,263],[180,265],[164,254],[157,234]];
   fitted(head,surfaces,'FittedMantisCompoundEye'+side,mirror(eye,side),[cx+side*110,205],.18,'#a9ac43');
  }
 }
 paint(head);
 const body=part('Torso',[cx,bee?485:butterfly?489:489],bee?'#472b17':butterfly?'#a678b4':'#9ebf55');
 volume(body,'CompactGardenAbdomen',k.ellipse(cx,bee?484:butterfly?488:488,bee?69:butterfly?55:51,bee?65:butterfly?65:64),[cx,bee?484:butterfly?488:488],.28,body.part.color);paint(body);
 if(bee)bodyBands(body,[[428,442,'#f6cd59'],[471,497,'#f6cd59'],[530,545,'#f6cd59']]);
 if(butterfly)bodyBands(body,[[435,454,'#d85a35'],[454,475,'#f69d2d'],[475,496,'#f8d54c'],[496,518,'#8dc858'],[518,547,'#399fc9']]);
 for(const side of [-1,1]){
  const leg=bee?[[249,533],[284,541],[280,556],[267,576],[253,583],[242,577],[238,566],[244,552]]:butterfly?[[276,539],[307,542],[309,560],[302,576],[285,583],[271,580],[264,572],[268,559],[276,552]]:[[283,533],[309,535],[311,554],[305,573],[290,579],[277,578],[271,571],[273,561],[284,552]];
  limb(side<0?'LeftLeg':'RightLeg',mirror(leg,side),[cx+side*(bee?34:butterfly?30:25),562],[cx+side*(bee?27:butterfly?24:23),540],.13,bee?'#704424':butterfly?'#ad73aa':'#94b94f');
 }
 if(mantis){
  for(const side of [-1,1]){
   const arm=part(side<0?'LeftArm':'RightArm',[cx+side*44,445]);const a=sculpt(arm);
   a.sweep('BentMantisForearm'+side,[[277,446,0,14],[259,474,.05,15],[246,492,.08,15],[231,476,.10,14],[213,444,.12,12]].map(([x,y,z,r])=>[cx+side*(cx-x),y,z,r]),base);
   volume(arm,'MantisGraspingBlade'+side,mirror([[212,433],[199,440],[187,456],[177,478],[172,501],[174,521],[181,536],[186,519],[190,506],[195,509],[198,497],[204,499],[207,484],[213,484],[215,465],[219,450]],side),[cx+side*124,476],.10,base,.11);paint(arm);
   const b=sculpt(body);b.sweep('BentMantisSideLeg'+side,[[274,505,-.08,9],[251,529,-.08,10],[219,512,-.08,10],[215,543,-.08,9],[215,563,-.08,9],[204,568,-.08,10]].map(([x,y,z,r])=>[cx+side*(cx-x),y,z,r]),base);b.ellipsoid('MantisSideFoot'+side,[cx+side*116,568,-.08],[12,7,.055],base);
  }
  paint(body);return true;
 }
 if(bee){
  limb('LeftArm',[[234,428],[223,443],[210,462],[199,482],[196,495],[202,504],[216,503],[228,488],[234,466],[245,434]],[219,467],[239,431],.13,'#704424');
  const arm=part('RightArm',[345,432],'#704424');const a=sculpt(arm);
  a.sweep('BeeHeldArm',[[345,432,0,15],[371,458,.06,16],[394,466,.12,15],[410,465,.16,15]],'#704424');
  a.tube('HoneyDipperHandle',[[372,514,.16],[419,455,.17],[473,388,.19]],.045,'#b58152');
  a.ellipsoid('HoneyDipperHead',[484,370,.20],[37,48,.20],'#eab34b',-.64);
  const axis=new THREE.Vector3(.597,.802,0),u=new THREE.Vector3(-.802,.597,0),v=new THREE.Vector3(0,0,1);
  for(let j=0;j<4;j++){
   const t=(j-1.5)*.085,rr=Math.sqrt(1-(t/.24)**2),ps=[];
   for(let n=0;n<=64;n++){const angle=n/64*Math.PI*2,offset=axis.clone().multiplyScalar(t).addScaledVector(u,Math.cos(angle)*(.185*rr+.002)).addScaledVector(v,Math.sin(angle)*(.20*rr+.002));ps.push([484+offset.x/.005,370-offset.y/.005,.20+offset.z]);}
   const band=a.tube('HoneyDipperGroove'+j,ps,.012,'#a76b21');band.userData.skipOriginalPaint=true;
  }
  a.sweep('ShortHoneyDrip',[[479,402,.22,9],[482,420,.23,8],[480,435,.24,7]],'#f3bd43');a.ellipsoid('ShortHoneyDrop',[480,435,.24],[7,8,.04],'#f3bd43');
  a.sweep('LongHoneyDrip',[[499,401,.22,9],[499,428,.24,8],[501,454,.25,9]],'#f3bd43');a.ellipsoid('LongHoneyDrop',[501,454,.25],[9,11,.05],'#f3bd43');
  a.ellipsoid('BeeHoldingHand',[410,465,.28],[17,19,.11],'#704424');paint(arm);
 }else{
  const arm=[[279,435],[264,445],[248,465],[232,486],[228,499],[235,507],[247,508],[260,497],[272,480],[282,459],[290,438]];
  for(const side of [-1,1])limb(side<0?'LeftArm':'RightArm',mirror(arm,side),[cx+side*61,476],[cx+side*38,439],.12,'#b67cb0');
 }
 for(const side of [-1,1]){
  const wing=part(side<0?'LeftWing':'RightWing',[cx,430],bee?'#c0dfef':'#9273ad',-.26),w=sculpt(wing);
  const upper=bee?[[184,343],[157,342],[129,350],[112,370],[108,391],[119,411],[144,431],[175,445],[216,452],[246,446],[260,415],[232,373]]:[[188,244],[161,224],[126,205],[92,196],[66,198],[49,210],[43,233],[49,264],[67,298],[80,328],[82,358],[90,390],[108,414],[134,430],[162,438],[193,438],[221,434],[304,455],[300,432],[261,391],[234,342],[216,289]];
  const lower=bee?[[219,445],[183,452],[162,468],[153,488],[161,507],[183,517],[209,514],[234,502],[252,480],[255,459]]:[[276,433],[245,431],[211,438],[181,450],[153,470],[130,493],[123,517],[129,540],[149,559],[175,569],[202,571],[226,565],[249,551],[267,530],[279,506],[285,476]];
  const meshes=[...volume(wing,'UpperGardenWing'+side,mirror(upper,side),[cx+side*(bee?108:177),bee?398:326],bee?.065:.085,wing.part.color),...volume(wing,'LowerGardenWing'+side,mirror(lower,side),[cx+side*(bee?85:116),bee?482:508],bee?.055:.080,wing.part.color)];
  // Curve the overlapping wing roots into the thorax. A flat wing behind
  // the body otherwise covers the abdomen with a blue/purple patch from back.
  for(const m of meshes){const p=m.geometry.attributes.position;for(let i=0;i<p.count;i++){const x=p.getX(i)/.005+wing.part.pivot[0],y=wing.part.pivot[1]-p.getY(i)/.005,r=Math.hypot((x-cx)/(bee?84:70),(y-(bee?485:489))/80);p.setZ(i,p.getZ(i)+.25*Math.max(0,Math.min(1,(1.2-r)/.45)));}m.geometry.computeVertexNormals();}
  const noBody=[[cx,bee?284:303,bee?169:158,bee?156:144],[cx,bee?485:489,bee?82:68,78]];
  noBody.push(...(bee?[[219,467,25,44],[377,457,38,23],[410,465,19,21],[430,443,20,45]]:[[247,476,24,39],[393,476,24,39]]));
  if(bee){
   // The bee wings are plain blue. Do not project the foreground hand,
   // honey handle or hood pixels onto their reverse faces.
   for(const [j,outline] of [upper,lower].entries()){
    const ps=mirror(outline,side).map(([x,y])=>{const r=Math.hypot((x-cx)/84,(y-485)/80),z=-.26+.25*Math.max(0,Math.min(1,(1.2-r)/.45));return[x,y,z];});ps.push(ps[0]);w.tube('BlueWingRim'+side+'_'+j,ps,.008,'#637f90');
   }
  }else{for(const m of meshes)m.userData.artworkExcludedRegions=noBody.map(([cx,cy,rx,ry])=>({cx,cy,rx,ry}));paint(wing);backPaint(wing,meshes,noBody);}
 }
 return true;
};
