"use strict";
// Closed sea-costume parts in original 640px coordinates.
module.exports=function coastal(THREE,k,id,parts){
 if(!['animal-crab','animal-octopus'].includes(id))return false;
 for(const p of parts.values())k.body.remove(p.group);parts.clear();
 const crab=id==='animal-crab',base=crab?'#ca392c':'#b575b3';
 function part(name,pivot,color=base,z=0){const p={part:{pivot,color},group:k.group(name,pivot,z),solid:k.solid(name+'Color',color),special:true};p.group.userData.directSurfaceArtwork=true;parts.set(name,p);return p;}
 function vol(p,name,outline,center,depth,color=base,z=0,backDepth=depth){
  const area=(Math.max(...outline.map(p=>p[0]))-Math.min(...outline.map(p=>p[0])))*(Math.max(...outline.map(p=>p[1]))-Math.min(...outline.map(p=>p[1])));
  k.volume(name,outline,center,p.part.pivot,depth,backDepth,p.group,k.solid(name+'Color',color),{art:false,z,samples:area>60000?112:area>20000?80:48});
  if(crab)return;
  if(name==='WholeCoastalHood')for(const suffix of ['Surface','Back']){
   // More radial rings keep the hood/mantle junction round at avatar scale.
   // Preserve the authored boundary and source registration exactly.
   const half=p.group.getObjectByName(name+suffix),old=half.geometry.attributes.position,samples=old.count/13;
   const edge=Array.from({length:samples},(_,i)=>new THREE.Vector3().fromBufferAttribute(old,12*samples+i)),center=new THREE.Vector3().fromBufferAttribute(old,0),base=edge[0].z,depth=center.z-base;
   const positions=[],indices=[],rings=32;
   for(let ring=0;ring<=rings;ring++){
    const angle=ring/rings*Math.PI/2,r=Math.sin(angle);
    for(const v of edge)positions.push(center.x+(v.x-center.x)*r,center.y+(v.y-center.y)*r,base+depth*Math.cos(angle));
   }
   for(let ring=0;ring<rings;ring++)for(let i=0;i<samples;i++){
    const a=ring*samples+i,b=ring*samples+(i+1)%samples,c=a+samples,d=b+samples;
    if(depth>0){if(ring)indices.push(a,b,d);indices.push(a,d,c);}
    else{if(ring)indices.push(a,d,b);indices.push(a,c,d);}
   }
   const g=k.geometry(positions,indices);
   if((g.attributes.normal.getZ(samples*4)>0)!==(depth>0)){for(let i=0;i<indices.length;i+=3)[indices[i+1],indices[i+2]]=[indices[i+2],indices[i+1]];g.setIndex(indices);g.computeVertexNormals();}
   half.geometry.dispose();half.geometry=g;
  }
  // Smooth the shared equator, including duplicate fan-center vertices. A
  // painted line at z=0 looked like a split down the side of the entire hood.
  const P=[],I=[];for(const suffix of ['Surface','Back']){const half=p.group.getObjectByName(name+suffix),offset=P.length/3;P.push(...half.geometry.attributes.position.array);I.push(...Array.from(half.geometry.index.array,i=>i+offset));p.group.remove(half);half.geometry.dispose();}
  const geometry=k.geometry(P,I),position=geometry.attributes.position,normal=geometry.attributes.normal,buckets=new Map();
  for(let i=0;i<position.count;i++){const key=[position.getX(i),position.getY(i),position.getZ(i)].map(v=>Math.round(v*1e5)).join(',');if(!buckets.has(key))buckets.set(key,[]);buckets.get(key).push(i);}
  for(const indices of buckets.values()){const n=new THREE.Vector3();for(const i of indices)n.add(new THREE.Vector3().fromBufferAttribute(normal,i));n.normalize();for(const i of indices)normal.setXYZ(i,n.x,n.y,n.z);}
  const surface=k.mesh(name+'Solid',geometry,k.solid(name+'Color',color),p.group);surface.userData.artworkFacingFade=[.18,.55];
  return surface;
 }
 function silhouette(p,surface,name,thickness){
  const g=surface.geometry.clone(),position=g.attributes.position,normal=g.attributes.normal,ix=g.index.array;
  for(let i=0;i<position.count;i++){const width=thickness*(surface.userData.outlineWeights?.[i]??1);position.setXYZ(i,position.getX(i)+normal.getX(i)*width,position.getY(i)+normal.getY(i)*width,position.getZ(i)+normal.getZ(i)*width);}
  for(let i=0;i<ix.length;i+=3)[ix[i+1],ix[i+2]]=[ix[i+2],ix[i+1]];g.computeVertexNormals();
  const ink=k.mesh(name,g,k.solid(name+'Ink','#784477'),p.group);ink.userData.skipOriginalPaint=true;ink.material.userData.alreadyShaded=true;
 }
 function fadeArtworkEdge(p,name,contour,start,end){
  const boundary=new THREE.CatmullRomCurve3(contour.map(([x,y])=>new THREE.Vector3(x,y,0)),true,'centripetal').getSpacedPoints(112);
  const artwork=p.group.getObjectByName(name+'OriginalPaint'),positions=artwork.geometry.attributes.position,colors=artwork.geometry.attributes.color;
  for(let i=0;i<positions.count;i++){
   const x=positions.getX(i)/.005+p.part.pivot[0],y=p.part.pivot[1]-positions.getY(i)/.005;let distance=Infinity;
   for(let j=0;j<boundary.length-1;j++){const a=boundary[j],b=boundary[j+1],dx=b.x-a.x,dy=b.y-a.y,t=Math.max(0,Math.min(1,((x-a.x)*dx+(y-a.y)*dy)/(dx*dx+dy*dy)));distance=Math.min(distance,Math.hypot(x-a.x-t*dx,y-a.y-t*dy));}
   const t=Math.max(0,Math.min(1,(distance-start)/(end-start)));colors.setW(i,colors.getW(i)*t*t*(3-2*t));
  }
 }
 function paint(p){require('./project-model-artwork.cjs')(THREE,k,p.group,p.part.pivot);}
 function sculpt(p){return require('./sculpt-kit.cjs')(THREE,k,p);}
 function rim(p,name,shape,color){const line=shape.map(([x,y])=>[x,y,0]);line.push(line[0]);sculpt(p).tube(name,line,.009,color).userData.skipOriginalPaint=true;}
 const head=part('Head',crab?[320,297]:[320,252]);
 const shape=crab?k.ellipse(320,296,169,150):[[320,64],[387,78],[443,110],[483,157],[505,211],[513,267],[507,322],[488,371],[454,407],[408,426],[353,435],[292,435],[233,421],[186,396],[152,358],[135,309],[128,255],[136,198],[160,147],[200,105],[256,75]];
 const hood=vol(head,'WholeCoastalHood',shape,crab?[320,296]:[320,249],crab?.68:.77);
 head.group.userData.artworkOpaqueRegions=[crab?{cx:320,cy:330,rx:125,ry:101}:{cx:320,cy:313,rx:137,ry:106}];
 if(crab)rim(head,'HoodEdge',shape,'#8b2b25');
 else{
  // An inverted shell outlines the actual silhouette from every direction,
  // instead of drawing a dark meridian through the left and right views.
  silhouette(head,hood,'OctopusHoodSilhouette',.026);
 }
 const s=sculpt(head);
 if(crab){
  for(const side of [-1,1]){
   const x=v=>320+side*(320-v),mirror=shape=>shape.map(([a,b])=>[x(a),b]);
   s.sweep('ConnectedClawArm'+side,[[x(200),223,-.06,25],[x(173),195,-.035,24],[x(153),166,0,24]],base);
   const claw=[[153,64],[167,64],[168,86],[172,108],[184,91],[189,84],[198,100],[207,125],[208,148],[199,169],[184,185],[162,191],[141,181],[122,161],[110,137],[111,113],[125,87]];
   vol(head,'FullCrabClaw'+side,mirror(claw),[x(158),137],.22);
   s.sweep('CrabEyeStalk'+side,[[x(261),165,0,15],[x(258),133,0,17],[x(256),119,0,18]],'#aa342c');
   s.ellipsoid('RoundedCrabEye'+side,[x(256),121,.015],[30,34,.17],'#ae3933');
   const leg=[[164,234],[137,231],[114,239],[99,254],[96,271],[115,268],[140,259],[159,261]];
   for(let j=0;j<3;j++){const shapeLeg=leg.map(([a,b])=>[x(a+j*9),b+j*49]);vol(head,'CrabSideLeg'+side+'_'+j,shapeLeg,[x(137+j*9),249+j*49],.10);}
  }
  paint(head);
  const shell=part('CrabCostumeBack',[320,481],'#6e833f',-.20);vol(shell,'GreenCostumeBack',[[214,410],[202,448],[207,487],[222,526],[246,548],[278,549],[319,542],[362,549],[395,542],[421,515],[435,477],[430,438],[419,413]],[320,477],.31,'#6e833f');
  for(const m of shell.group.children)m.userData.artworkExcludedRegions=[{cx:320,cy:490,rx:82,ry:87}];paint(shell);
  const belly=part('Torso',[320,485],'#9d7548');vol(belly,'ShortCrabBody',k.ellipse(320,479,66,64),[320,479],.27,'#9d7548');paint(belly);
  for(const side of [-1,1]){
   const mirror=shape=>shape.map(([x,y])=>[320+side*(x-320),y]);
   const arm=part(side<0?'RightArm':'LeftArm',[320-side*53,444],'#967144');
   vol(arm,'CrabSleeve'+side,mirror([[258,426],[281,438],[269,470],[259,499],[248,512],[235,508],[231,493],[240,461]]),[320-side*65,470],.14,'#967144');paint(arm);
   const foot=part(side<0?'RightLeg':'LeftLeg',[320-side*31,529],'#a17a4b');
   vol(foot,'CrabFoot'+side,mirror([[270,513],[296,515],[310,536],[303,561],[288,573],[264,575],[249,566],[251,554],[263,542]]),[320-side*40,548],.18,'#a17a4b');paint(foot);
  }
  return true;
 }
 // Six front arms preserve the original silhouette; two rear arms turn into depth.
 const core=part('OctopusMantle',[320,428]);
 // The source has a short shared skirt ending at the central cleft, not a
 // round collar sitting in front of six detached narrow legs.
 vol(core,'ContinuousMantle',[[207,406],[237,389],[279,384],[320,383],[361,384],[403,389],[433,406],[428,442],[400,456],[367,462],[339,464],[320,464],[301,464],[273,462],[240,456],[212,442]],[320,422],.13,base,0,.36);
 core.group.userData.artworkOpaqueRegions=[{cx:320,cy:438,rx:108,ry:32}];
 const paths=[
  [[227,410,0,29],[200,435,.02,29],[167,449,.03,25],[132,440,.03,21],[114,418,.02,17],[115,409,.02,11]],
  [[263,424,.03,29],[248,466,.05,30],[225,507,.07,26],[194,526,.09,21],[177,523,.09,14]],
  [[298,434,.09,28],[290,484,.12,26],[281,535,.16,24],[264,558,.18,18],[257,558,.18,12]],
  [[342,434,.09,28],[350,484,.12,26],[359,535,.16,24],[376,558,.18,18],[383,558,.18,12]],
  [[377,424,.03,29],[392,466,.05,30],[415,507,.07,26],[446,526,.09,21],[463,523,.09,14]],
  [[413,410,0,29],[440,435,.02,29],[473,449,.03,25],[508,440,.03,21],[526,418,.02,17],[525,409,.02,11]],
  [[273,426,-.23,27],[254,456,-.37,27],[230,487,-.52,23],[211,507,-.63,16],[205,504,-.68,9]],
  [[367,426,-.23,27],[386,456,-.37,27],[410,487,-.52,23],[429,507,-.63,16],[435,504,-.68,9]]
 ];
 const outlines=[
  [[226,402],[207,420],[192,432],[169,436],[145,430],[131,409],[123,398],[110,398],[102,410],[103,435],[115,455],[137,469],[163,478],[193,476],[220,467],[232,445]],
  [[269,427],[260,471],[250,501],[234,523],[210,538],[186,542],[166,535],[154,523],[159,515],[177,510],[198,497],[213,477],[224,451],[228,425]],
  [[310,427],[320,443],[321,467],[316,504],[307,536],[295,560],[278,575],[258,579],[239,570],[232,555],[244,537],[253,513],[259,484],[264,450],[279,427]]
 ];
 function roundedArm(arm,i,j){
  // Sweep between the two authored sides, rather than fanning all vertices
  // from one point inside a bent arm. The latter folded over itself at bends.
  const outline=outlines[j],tip=[7,7,9][j],mirror=([x,y])=>new THREE.Vector3(i<3?x:640-x,y,0),boundary=new THREE.CatmullRomCurve3(outline.map(mirror),true,'centripetal');
  // Both sides use the same closed contour tangent at the end, giving a
  // round fingertip instead of two independently tapered curves meeting sharp.
  const left=t=>boundary.getPoint(t*tip/outline.length),right=t=>boundary.getPoint((outline.length-1-(outline.length-1-tip)*t)/outline.length);
  const P=[],I=[],outlineWeights=[],rows=48,rootRows=8,segments=20,[rootZ,tipZ]=[[-.12,-.23],[.02,.12],[.10,.38]][j];
  // Bury the closed attachment cap inside the hood. Previously the cap was
  // exposed in profile as a circular plate, outlined like a separate shoulder.
  for(let r=-rootRows;r<=rows;r++){
   const t=Math.max(0,r/rows),a=left(t),b=right(t),u=Math.max(0,-r/rootRows),cx=(a.x+b.x)/2+(i<3?1:-1)*u*15,cy=(a.y+b.y)/2-u*40,dx=(a.x-b.x)/2,dy=(a.y-b.y)/2,depth=(j===2?.20:.18)*Math.min(1,Math.hypot(dx,dy)/16),z=rootZ*(1-u)+(tipZ-rootZ)*t*t*(3-2*t);
   for(let s=0;s<segments;s++){const angle=s/segments*Math.PI*2;P.push((cx+dx*Math.cos(angle)-arm.part.pivot[0])*.005,(arm.part.pivot[1]-cy-dy*Math.cos(angle))*.005,z+depth*Math.sin(angle));outlineWeights.push(Math.min(1,Math.max(0,t/.18)));}
  }
  for(let r=0;r<rows+rootRows;r++)for(let s=0;s<segments;s++){const a=r*segments+s,b=r*segments+(s+1)%segments,c=a+segments,d=b+segments;I.push(a,b,d,a,d,c);}
  const a=left(0),b=right(0),cap=P.length/3;P.push(((a.x+b.x)/2+(i<3?15:-15)-arm.part.pivot[0])*.005,(arm.part.pivot[1]-(a.y+b.y)/2+40)*.005,0);outlineWeights.push(0);
  for(let s=0;s<segments;s++)I.push(cap,(s+1)%segments,s);
  let volume=0;for(let j=0;j<I.length;j+=3){const a=new THREE.Vector3().fromArray(P,I[j]*3),b=new THREE.Vector3().fromArray(P,I[j+1]*3),c=new THREE.Vector3().fromArray(P,I[j+2]*3);volume+=a.dot(b.cross(c));}
  if(volume<0)for(let j=0;j<I.length;j+=3)[I[j+1],I[j+2]]=[I[j+2],I[j+1]];
  const o=k.mesh('RoundedOctopusArm'+i+'Solid',k.geometry(P,I),k.solid('RoundedOctopusArmColor',base),arm.group);o.userData.outlineWeights=outlineWeights;o.userData.artworkFacingFade=[.18,.55];return o;
 }
 // Follow the illustration's lower rim instead of drawing a necklace down
 // the middle of each tentacle. The ray-fit below keeps every raised cup on
 // the curved arm, including the outward-turning tips.
 const cupPaths=[[[110,415],[112,434],[125,453],[149,469],[177,472],[207,464],[220,454]],[[252,485],[240,510],[225,526],[204,535],[182,535],[168,527]],[[311,506],[304,535],[292,557],[278,570],[260,574],[247,569]]];
 function fitUnderHood(mesh){
  // Preserve the hood's original lower rim. Thick attachments must remain
  // behind its front surface, not emerge as scallops over the face opening.
  k.root.updateMatrixWorld(true);const p=mesh.geometry.attributes.position;
  for(let i=0;i<p.count;i++){
   const v=mesh.localToWorld(new THREE.Vector3().fromBufferAttribute(p,i)),front=new THREE.Raycaster(new THREE.Vector3(v.x,v.y,3),new THREE.Vector3(0,0,-1)).intersectObject(hood)[0],back=new THREE.Raycaster(new THREE.Vector3(v.x,v.y,-3),new THREE.Vector3(0,0,1)).intersectObject(hood)[0];
   if(front&&back){const inset=Math.min(.028,(front.point.z-back.point.z)*.25);v.z=Math.max(back.point.z+inset,Math.min(front.point.z-inset,v.z));mesh.worldToLocal(v);p.setXYZ(i,v.x,v.y,v.z);}
  }
  mesh.geometry.computeVertexNormals();
 }
 fitUnderHood(core.group.getObjectByName('ContinuousMantleSolid'));
 paths.forEach((path,i)=>{
  const arm=part('OctopusTentacle'+i,path[0].slice(0,2));
  if(i<6){
   const j=i<3?i:5-i;
   const surface=roundedArm(arm,i,j);
   fitUnderHood(surface);
   const curve=new THREE.CatmullRomCurve3(cupPaths[j].map(([x,y])=>new THREE.Vector3(i<3?x:640-x,y,0))),count=[15,12,11][j],cups=[];
   arm.group.updateMatrixWorld(true);
   for(let c=0;c<count;c++){
    const p=curve.getPointAt(c/(count-1)),origin=arm.group.localToWorld(new THREE.Vector3((p.x-arm.part.pivot[0])*.005,(arm.part.pivot[1]-p.y)*.005,3)),hit=new THREE.Raycaster(origin,new THREE.Vector3(0,0,-1)).intersectObject(surface)[0];
    if(!hit)throw new Error('Octopus sucker outside arm '+i+': '+c);
    const normal=hit.face.normal.clone().transformDirection(surface.matrixWorld),point=arm.group.worldToLocal(hit.point.clone().addScaledVector(normal,.002));
    cups.push({p,point,normal});
   }
   // The continuous lower-body color and relief replace painted dark clefts
   // that otherwise broke into spots across independently moving arm roots.
   silhouette(arm,surface,'OctopusArmSilhouette'+i,.019);
   delete surface.userData.outlineWeights;
   for(const [c,{point,normal}] of cups.entries()){
    const rim=k.mesh('OctopusSuckerRim'+i+'_'+c,new THREE.TorusGeometry(.020,.0075,6,12),k.solid('OctopusSuckerRimColor','#f8d8ee'),arm.group,point.toArray());
    rim.quaternion.setFromUnitVectors(new THREE.Vector3(0,0,1),normal);rim.userData.suckerSupport=surface.name;
    const bowl=k.mesh('OctopusSuckerBowl'+i+'_'+c,new THREE.SphereGeometry(1,12,6),k.solid('OctopusSuckerBowlColor','#d6a0cc'),arm.group,point.clone().addScaledVector(normal,-.002).toArray());bowl.scale.set(.019,.019,.0035);bowl.quaternion.copy(rim.quaternion);
   }
  }else{const surface=sculpt(arm).sweep('RoundedOctopusArm'+i,path,base);fitUnderHood(surface);surface.userData.skipOriginalPaint=true;}
 });
 for(const [name,p] of parts){
  if(name==='Head')continue;
  p.group.traverse(o=>{
   if(!o.isMesh||o.name.includes('Silhouette')||o.name.includes('Sucker'))return;
   const position=o.geometry.attributes.position,normal=o.geometry.attributes.normal,C=[];
   for(let i=0;i<position.count;i++){
    const x=position.getX(i)/.005+p.part.pivot[0],y=p.part.pivot[1]-position.getY(i)/.005,z=position.getZ(i);
    const shade=Math.max(.72,Math.min(1,.92-.08*(y-420)/160-.025*(x-320)/220+.07*normal.getY(i)+.045*normal.getZ(i)-.025*normal.getX(i)));C.push(shade,shade,shade);
   }
   o.geometry.setAttribute('color',new THREE.Float32BufferAttribute(C,3));o.material.userData.alreadyShaded=true;o.material.userData.preserveVertexColor=true;
  });
 }
 paint(head);
 // Keep the original face and hood details, but remove the illustration's
 // outer silhouette from the curved surface: the 3D shell supplies that line.
 fadeArtworkEdge(head,hood.name,shape,10,27);
 return true;
};
