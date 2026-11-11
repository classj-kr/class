"use strict";
module.exports=function seasonal(T,k,id,parts){
 if(!['theme-cactus','theme-maple-leaf','theme-snowman'].includes(id))return false;
 const sculpt=require('./sculpt-kit.cjs'),head=parts.get('Head'),s=sculpt(T,k,head);s.parent.clear();
 // Inverted silhouette shells must not count as front paint occluders.
 // The opaque solids still perform normal depth testing at render time.
 s.parent.userData.directSurfaceArtwork=true;s.parent.userData.artworkOcclusion=false;
 const face=id==='theme-cactus'?[320,299,110,85]:id==='theme-maple-leaf'?[320,319,110,94]:[318,293,118,96];
 s.parent.userData.artworkOpaqueRegions=[{cx:face[0],cy:face[1],rx:face[2],ry:face[3]}];
 const ink=id==='theme-cactus'?'#285f3b':id==='theme-maple-leaf'?'#8a281f':'#492919';
 function remove(name){const p=parts.get(name);if(p){k.body.remove(p.group);parts.delete(name);}}
 function part(name,pivot,z=0){let p=parts.get(name);if(!p){p={part:{pivot},group:k.group(name,pivot,z)};parts.set(name,p);}p.group.clear();p.part.pivot=pivot;p.group.position.set((pivot[0]-320)*.005,(580-pivot[1])*.005,z);p.group.userData.directSurfaceArtwork=true;return sculpt(T,k,p);}
 function outline(o,tool=s,width=.013,color=ink){
  o.updateMatrix();const g=o.geometry.clone().applyMatrix4(o.matrix),p=g.attributes.position,ix=g.index.array,box=new T.Box3().setFromBufferAttribute(p),center=box.getCenter(new T.Vector3()),size=box.getSize(new T.Vector3()),factor=1+width/(Math.max(size.x,size.y,size.z)/2);
  // Uniform expansion preserves triangle orientation at thin leaf notches;
  // a per-normal offset could turn skinny triangles outward as dark cracks.
  for(let i=0;i<p.count;i++)p.setXYZ(i,center.x+(p.getX(i)-center.x)*factor,center.y+(p.getY(i)-center.y)*factor,center.z+(p.getZ(i)-center.z)*factor);
  for(let i=0;i<ix.length;i+=3)[ix[i+1],ix[i+2]]=[ix[i+2],ix[i+1]];g.computeVertexNormals();
  const shell=k.mesh(o.name+'InkShell',g,k.solid(o.name+'Ink',color),tool.parent);shell.userData.skipOriginalPaint=true;shell.material.userData.alreadyShaded=true;
 }
 function volume(name,ps,center,front,back,color,z=0,tool=s,samples=96){
  k.volume(name+'Half',ps,center,tool.pivot,front,back,tool.parent,k.solid(name+'Color',color),{art:false,samples,z:z-tool.offset.z});if(['theme-cactus','theme-maple-leaf'].includes(id))require('./smooth-paired-volume.cjs')(T,k,tool.parent,name+'Half',{rings:24});const P=[],I=[];
  for(const suffix of ['Surface','Back']){const o=tool.parent.getObjectByName(name+'Half'+suffix),off=P.length/3;P.push(...o.geometry.attributes.position.array);I.push(...Array.from(o.geometry.index.array,v=>v+off));tool.parent.remove(o);o.geometry.dispose();}
  const g=k.geometry(P,I),p=g.attributes.position,n=g.attributes.normal,groups=new Map();for(let i=0;i<p.count;i++){const key=[p.getX(i),p.getY(i),p.getZ(i)].map(v=>Math.round(v*1e5)).join(',');if(!groups.has(key))groups.set(key,[]);groups.get(key).push(i);}for(const indices of groups.values()){const normal=new T.Vector3();for(const i of indices)normal.add(new T.Vector3().fromBufferAttribute(n,i));normal.normalize();for(const i of indices)n.setXYZ(i,normal.x,normal.y,normal.z);}
  const o=k.mesh(name,g,k.solid(name+'Color',color),tool.parent);o.userData.artworkFacingFade=[.16,.50];return o;
 }
 function frontHit(o,x,y,back=false){s.parent.updateMatrixWorld(true);const origin=s.parent.localToWorld(new T.Vector3(...s.point([x,y,back?-4:4]))),hit=new T.Raycaster(origin,new T.Vector3(0,0,back?1:-1)).intersectObject(o)[0];if(!hit)throw new Error(id+' attachment misses '+o.name+' at '+x+','+y);return hit;}
 function leafVolume(ps){
  // Constrained polygon triangles preserve concave notches without a radial
  // fan folding back across the face. Shared edge splits keep the shell closed.
  const edge=new T.CatmullRomCurve3(ps.map(([x,y])=>new T.Vector3(x,y,0)),true,'centripetal').getSpacedPoints(192).slice(0,192),points=edge.map(v=>new T.Vector2(v.x,v.y));
  let faces=T.ShapeUtils.triangulateShape(points,[]);
  const key=(a,b)=>a<b?a+','+b:b+','+a;
  for(let pass=0;pass<10;pass++){
   const cuts=new Map();for(const f of faces)for(let j=0;j<3;j++){const a=f[j],b=f[(j+1)%3],e=key(a,b);if(!cuts.has(e)&&points[a].distanceTo(points[b])>14){cuts.set(e,points.length);points.push(points[a].clone().add(points[b]).multiplyScalar(.5));}}
   if(!cuts.size)break;
   const next=[];for(const f of faces){let [a,b,c]=f;let ab=cuts.get(key(a,b)),bc=cuts.get(key(b,c)),ca=cuts.get(key(c,a)),count=[ab,bc,ca].filter(v=>v!==undefined).length;
    if(!count){next.push(f);continue;}if(count===3){next.push([a,ab,ca],[ab,b,bc],[ca,bc,c],[ab,bc,ca]);continue;}
    if(count===1){if(bc!==undefined){[a,b,c]=[b,c,a];ab=bc;}else if(ca!==undefined){[a,b,c]=[c,a,b];ab=ca;}next.push([a,ab,c],[ab,b,c]);continue;}
    if(ab===undefined){[a,b,c]=[b,c,a];[ab,bc]=[bc,ca];}else if(bc===undefined){[a,b,c]=[c,a,b];[ab,bc]=[ca,ab];}next.push([b,bc,ab],[a,ab,c],[ab,bc,c]);
   }faces=next;
  }
  const P=[],I=[],n=points.length;
  for(const back of [false,true])for(const v of points){let d=Infinity;for(let j=0;j<edge.length;j++){const a=edge[j],b=edge[(j+1)%edge.length],dx=b.x-a.x,dy=b.y-a.y,t=Math.max(0,Math.min(1,((v.x-a.x)*dx+(v.y-a.y)*dy)/(dx*dx+dy*dy)));d=Math.min(d,Math.hypot(v.x-a.x-t*dx,v.y-a.y-t*dy));}const f=Math.sqrt(1-Math.max(0,1-d/8)**2),dome=Math.exp(-1.5*(((v.x-320)/155)**2+((v.y-315)/150)**2));P.push(...s.point([v.x,v.y,(back?-.075-.05*dome:.07+.15*dome)*f]));}
  for(let [a,b,c] of faces){const A=points[a],B=points[b],C=points[c];if((B.x-A.x)*(C.y-A.y)-(B.y-A.y)*(C.x-A.x)>0)[b,c]=[c,b];I.push(a,b,c,a+n,c+n,b+n);}
  const g=k.geometry(P,I),normal=g.attributes.normal,groups=new Map();for(let i=0;i<P.length/3;i++){const q=P.slice(i*3,i*3+3).map(v=>Math.round(v*1e5)).join(',');if(!groups.has(q))groups.set(q,[]);groups.get(q).push(i);}for(const a of groups.values()){const v=new T.Vector3();for(const i of a)v.add(new T.Vector3().fromBufferAttribute(normal,i));v.normalize();for(const i of a)normal.setXYZ(i,v.x,v.y,v.z);}
  const o=k.mesh('MapleLeafSolid',g,k.solid('MapleLeafColor','#f47732'),s.parent);o.userData.artworkFacingFade=[.16,.50];return o;
 }
 function fittedDot(name,support,x,y,rx,ry,depth,color){const hit=frontHit(support,x,y),normal=hit.face.normal.clone().transformDirection(support.matrixWorld),p=s.parent.worldToLocal(hit.point.clone().addScaledVector(normal,depth*.5)),o=s.ellipsoid(name,[p.x/.005+s.pivot[0],s.pivot[1]-p.y/.005,p.z+s.offset.z],[rx,ry,depth],color);o.quaternion.setFromUnitVectors(new T.Vector3(0,0,1),normal);o.userData.skipOriginalPaint=true;o.userData.surfaceSupport=support.name;outline(o,s,.006);return o;}
 function fadeEllipse(o,cx,cy,rx,ry){const art=s.parent.getObjectByName(o.name+'OriginalPaint');if(!art)return;const p=art.geometry.attributes.position,C=art.geometry.attributes.color;for(let i=0;i<p.count;i++){const x=p.getX(i)/.005+s.pivot[0],y=s.pivot[1]-p.getY(i)/.005,r=Math.hypot((x-cx)/rx,(y-cy)/ry),a=Math.max(0,Math.min(1,(.98-r)/.09));C.setW(i,C.getW(i)*a*a*(3-2*a));}}
 function fadeContour(o,ps){const art=s.parent.getObjectByName(o.name+'OriginalPaint'),p=art.geometry.attributes.position,C=art.geometry.attributes.color,edge=new T.CatmullRomCurve3(ps.map(([x,y])=>new T.Vector3(x,y,0)),true,'centripetal').getSpacedPoints(192);for(let i=0;i<p.count;i++){const x=p.getX(i)/.005+s.pivot[0],y=s.pivot[1]-p.getY(i)/.005;let d=Infinity;for(let j=0;j<edge.length-1;j++){const a=edge[j],b=edge[j+1],dx=b.x-a.x,dy=b.y-a.y,t=Math.max(0,Math.min(1,((x-a.x)*dx+(y-a.y)*dy)/(dx*dx+dy*dy)));d=Math.min(d,Math.hypot(x-a.x-t*dx,y-a.y-t*dy));}const t=Math.max(0,Math.min(1,(d-3)/11));C.setW(i,C.getW(i)*t*t*(3-2*t));}}
 if(id==='theme-snowman'){
  for(const name of [...parts.keys()])if(name!=='Head')remove(name);
  const snow=s.ellipsoid('SnowHeadSolid',[318,237,0],[181,179,.76],'#f1f4fc'),body=s.ellipsoid('SnowBodySolid',[318,472,-.25],[113,86,.50],'#eaf0fb');
  snow.userData.artworkFacingFade=[.16,.50];body.userData.artworkFacingFade=[.16,.50];body.userData.artworkMinY=422;
  snow.userData.artworkExcludedRegions=[{cx:350,cy:142,rx:54,ry:24},...[273,366].map(x=>({cx:x,cy:115,rx:17,ry:17})),{cx:320,cy:174,rx:53,ry:19}];
  body.userData.artworkExcludedRegions=[443,480].map(y=>({cx:318,cy:y,rx:19,ry:19}));
  outline(snow,s,.029);outline(body,s,.026);
  for(const [i,x] of [273,366].entries())fittedDot('SnowCoalEye'+i,snow,x,115,12,12,.026,'#69422e');
  for(const [i,[x,y]] of [[276,162],[287,172],[302,179],[319,182],[335,180],[352,172],[364,162]].entries())fittedDot('SnowCoalSmile'+i,snow,x,y,4,4,.016,'#4c2c1a');
  for(const [i,y] of [443,480].entries())fittedDot('SnowButton'+i,body,318,y,13,13,.03,'#67432e');
  const hit=frontHit(snow,318,142),base=s.parent.worldToLocal(hit.point.clone()).add(new T.Vector3(0,0,.008)),tip=base.clone().add(new T.Vector3(.385,-.025,.07)),axis=tip.clone().sub(base),center=base.clone().add(tip).multiplyScalar(.5),carrot=k.mesh('SnowCarrotSolid',new T.ConeGeometry(.09,axis.length(),32),k.solid('SnowCarrotOrange','#ff921e'),s.parent,center.toArray());
  carrot.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),axis.clone().normalize());carrot.userData.artworkFacingFade=[.12,.40];outline(carrot,s,.006,'#9b3e11');
  const carrotRoot=fittedDot('SnowCarrotRoot',snow,320,142,18,18,.075,'#ff9b22');carrotRoot.userData.skipOriginalPaint=false;carrotRoot.userData.artworkFacingFade=[.12,.40];
  for(let i=1;i<=4;i++){const t=i/5,ring=k.mesh('CarrotGroove'+i,new T.TorusGeometry(.09*(1-t),.003,6,24),k.solid('CarrotGrooveInk','#da6a16'),s.parent,base.clone().lerp(tip,t).toArray());ring.quaternion.setFromUnitVectors(new T.Vector3(0,0,1),axis.clone().normalize());ring.userData.skipOriginalPaint=true;}
  const join=[];for(let i=0;i<96;i++){
   const angle=i/96*Math.PI*2,point=y=>{const r=Math.sqrt(Math.max(0,1-((y-237)/179)**2));return[318+181*r*Math.sin(angle),y,.76*r*Math.cos(angle)];};let lo=386,hi=416;
   for(let step=0;step<32;step++){const y=(lo+hi)/2,[x,,z]=point(y),inside=((x-318)/113)**2+((y-472)/86)**2+((z+.25)/.5)**2<1;if(inside)hi=y;else lo=y;}join.push(new T.Vector3(...s.point(point((lo+hi)/2))));
  }
  const seam=k.mesh('SnowballJoinContour',new T.TubeGeometry(new T.CatmullRomCurve3(join,true,'centripetal'),192,.009,8,true),k.solid('SnowballJoinInk',ink),s.parent);seam.userData.skipOriginalPaint=true;
  s.paint();fadeEllipse(snow,318,237,181,179);fadeEllipse(body,318,472,113,86);
 }
 if(id==='theme-maple-leaf'){
  const ps=[[320,61],[342,86],[364,123],[376,146],[421,130],[421,177],[414,219],[405,242],[467,200],[476,230],[551,219],[533,270],[521,309],[552,326],[522,357],[475,390],[492,437],[425,440],[426,463],[373,451],[320,429],[265,451],[218,465],[214,440],[147,438],[168,401],[117,368],[87,326],[114,308],[88,219],[164,230],[169,200],[234,241],[226,199],[221,168],[222,132],[263,147],[290,99]];
  const leaf=leafVolume(ps);outline(leaf,s,.026);
  const P=leaf.geometry.attributes.position,C=[],yellow=new T.Color('#ffb638').convertSRGBToLinear(),red=new T.Color('#e54c2b').convertSRGBToLinear();for(let i=0;i<P.count;i++){const x=P.getX(i)/.005+s.pivot[0],y=s.pivot[1]-P.getY(i)/.005,t=Math.max(0,Math.min(1,(x-220)/210+(y-220)/700)),c=yellow.clone().lerp(red,t);C.push(c.r,c.g,c.b);}leaf.geometry.setAttribute('color',new T.Float32BufferAttribute(C,3));leaf.material.color.set(0xffffff);leaf.material.userData.preserveVertexColor=true;
  for(const [i,[x,y]] of [[320,81],[137,252],[500,252],[192,420],[453,420]].entries()){
   const path=[];for(let j=0;j<=24;j++){const t=j/24,px=320+(x-320)*t,py=423+(y-423)*t,hit=frontHit(leaf,px,py,true),p=s.parent.worldToLocal(hit.point.clone());path.push([px,py,p.z+s.offset.z-.004]);}
   const vein=s.tube('MapleRearVein'+i,path,.009,'#a23321');vein.userData.skipOriginalPaint=true;for(const o of s.parent.children)if(o.name.startsWith('MapleRearVein'))o.userData.skipOriginalPaint=true;
  }
  const t=part('Torso',[320,464]);const torso=volume('MapleShortTorsoSolid',[[269,426],[320,422],[371,426],[382,471],[378,505],[363,531],[338,546],[305,547],[278,534],[262,506],[255,470]],[320,483],.27,.26,'#ee682b',.03,t,64);outline(torso,t,.014);t.paint();
  for(const side of [-1,1]){
   const mirror=ps=>ps.map(([x,y])=>[side<0?x:640-x,y]),arm=part(side<0?'LeftArm':'RightArm',[320+side*78,444]);const a=volume('MapleSleeveSolid'+side,mirror([[228,438],[272,432],[282,449],[251,468],[250,488],[245,504],[234,512],[222,507],[218,492],[220,466]]),[320+side*84,475],.13,.13,'#ffa833',0,arm,48);outline(a,arm,.012);arm.paint();
   const leg=part(side<0?'LeftLeg':'RightLeg',[320+side*33,529]),f=volume('MapleFootSolid'+side,mirror([[269,518],[307,520],[309,543],[302,559],[304,571],[291,579],[271,578],[260,569],[264,554],[270,537]]),[320+side*35,550],.17,.17,'#ed6529',.03,leg,48);outline(f,leg,.014);leg.paint();
  }
  s.paint();fadeContour(leaf,ps);
 }
 if(id==='theme-cactus'){
  for(const name of ['Torso','LeftArm','RightArm'])remove(name);
  const ps=[[320,82],[365,89],[412,112],[444,151],[462,198],[470,255],[463,313],[445,369],[429,426],[407,476],[383,512],[367,531],[342,538],[320,539],[294,539],[270,533],[248,506],[224,479],[206,432],[191,383],[179,333],[169,278],[170,224],[185,167],[214,121],[264,89]];
  const trunk=volume('CactusTaperedTrunkSolid',ps,[320,283],.55,.53,'#77a93b',0,s,128);outline(trunk,s,.017);
  for(const side of [-1,1]){const fin=volume('CactusLowerRibSolid'+side,[[389,425],[429,426],[416,476],[414,505],[402,515],[386,512],[378,492]].map(([x,y])=>[320+side*(x-320),y]),[320+side*82,470],.11,.11,'#6b9d3b',-.07,s,48);outline(fin,s,.012);}
  const branches=[[[208,388,-.04,27],[164,387,-.04,28],[128,362,-.04,28],[114,329,-.04,27],[120,294,-.04,24]],[[445,338,-.04,28],[491,322,-.04,29],[519,285,-.04,28],[522,231,-.04,29]]];
  for(const [i,path] of branches.entries()){const branch=s.sweep('CactusBranchSolid'+i,path,'#74a53b');branch.userData.artworkFacingFade=[.16,.50];outline(branch,s,.015);const tip=path.at(-1),cap=s.ellipsoid('CactusBranchTip'+i,tip.slice(0,3),[tip[3],tip[3],tip[3]*.005],'#74a53b');cap.userData.artworkFacingFade=[.16,.50];outline(cap,s,.015);}
  // Back ribs and thorns follow the actual tapered plant surface.
  s.parent.updateMatrixWorld(true);
  for(let col=0;col<5;col++){
   const a=Math.PI*.58+col*Math.PI*.21,dir=new T.Vector3(Math.sin(a),0,Math.cos(a)),path=[];
   for(let row=0;row<=32;row++){const y=105+row*12,origin=s.parent.localToWorld(new T.Vector3(...s.point([320,y,0]))).addScaledVector(dir,3),hit=new T.Raycaster(origin,dir.clone().negate()).intersectObject(trunk)[0];if(!hit)continue;const p=s.parent.worldToLocal(hit.point.clone().addScaledVector(dir,.004));path.push([p.x/.005+s.pivot[0],s.pivot[1]-p.y/.005,p.z+s.offset.z]);
    if(row%5===2){const spine=s.cone('CactusRearSpine'+col+'_'+row,path.at(-1),.013,.055,'#f4e58b',[dir.x,.3,dir.z]);spine.userData.skipOriginalPaint=true;}
   }
   if(path.length>2){s.tube('CactusRearRib'+col,path,.012,'#38783e');for(const o of s.parent.children)if(o.name.startsWith('CactusRearRib'))o.userData.skipOriginalPaint=true;}
  }
  const fh=frontHit(trunk,228,122),flowerZ=s.parent.worldToLocal(fh.point.clone()).z+s.offset.z+.025;
  for(const [i,[x,y,rx,ry,angle]] of [[199,94,19,28,.75],[237,84,19,25,-.30],[267,100,19,26,-.85],[257,136,20,28,1.2],[216,149,19,28,-.45],[190,131,19,26,1.35]].entries()){
   const petal=s.ellipsoid('CactusFlowerPetal'+i,[x,y,flowerZ],[rx,ry,.07],'#ef567c',angle);petal.userData.artworkFacingFade=[.16,.50];outline(petal,s,.011,'#a52e55');
  }
  const center=s.ellipsoid('CactusFlowerCenter',[229,116,flowerZ+.045],[23,18,.095],'#ffe85a',.45);center.userData.artworkFacingFade=[.16,.50];outline(center,s,.008,'#98532b');
  for(const side of [-1,1]){
   const leg=part(side<0?'LeftLeg':'RightLeg',[320+side*31,526]),mirror=ps=>ps.map(([x,y])=>[side<0?x:640-x,y]);
   const foot=volume('CactusFootSolid'+side,mirror([[265,513],[303,515],[308,539],[301,554],[302,568],[290,577],[271,578],[261,570],[266,553],[265,536]]),[320+side*35,548],.18,.18,'#6fa23e',0,leg,48);outline(foot,leg,.014);leg.paint();
  }
  s.paint();fadeContour(trunk,ps);
 }
 head.special=true;head.skipNeckJoin=true;head.authoredFamily='seasonal';return true;
};
