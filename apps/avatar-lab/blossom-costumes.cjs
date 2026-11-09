"use strict";
module.exports=function blossoms(T,k,id,parts){
 if(!['theme-cherry-blossom','theme-rose','theme-sunflower'].includes(id))return false;
 const sculpt=require('./sculpt-kit.cjs'),head=parts.get('Head'),s=sculpt(T,k,head);s.parent.clear();s.parent.userData.directSurfaceArtwork=true;
 const cherry=id==='theme-cherry-blossom',rose=id==='theme-rose',face=cherry?[318,294,110,91]:rose?[320,288,110,91]:[319,299,105,88],ink=cherry?'#a63761':rose?'#821a20':'#89521e',bodyZ=cherry||rose?0:-.38;
 s.parent.userData.artworkOpaqueRegions=[{cx:face[0],cy:face[1],rx:face[2]+2,ry:face[3]+2}];
 const petals=[],petalEdges=new Map();
 function smoothNormals(g){const p=g.attributes.position,n=g.attributes.normal,m=new Map();for(let i=0;i<p.count;i++){const key=[p.getX(i),p.getY(i),p.getZ(i)].map(v=>Math.round(v*1e5)).join(',');if(!m.has(key))m.set(key,[]);m.get(key).push(i);}for(const a of m.values()){const v=new T.Vector3();for(const i of a)v.add(new T.Vector3().fromBufferAttribute(n,i));v.normalize();for(const i of a)n.setXYZ(i,v.x,v.y,v.z);}}
 function outline(o,tool=s,width=.014,color=ink){o.updateMatrix();const g=o.geometry.clone().applyMatrix4(o.matrix),p=g.attributes.position,box=new T.Box3().setFromBufferAttribute(p),c=box.getCenter(new T.Vector3()),d=box.getSize(new T.Vector3()),f=1+width/(Math.max(d.x,d.y,d.z)/2),ix=g.index.array;for(let i=0;i<p.count;i++)p.setXYZ(i,c.x+(p.getX(i)-c.x)*f,c.y+(p.getY(i)-c.y)*f,c.z+(p.getZ(i)-c.z)*f);for(let i=0;i<ix.length;i+=3)[ix[i+1],ix[i+2]]=[ix[i+2],ix[i+1]];g.computeVertexNormals();const shell=k.mesh(o.name+'InkShell',g,k.solid(o.name+'Ink',color),tool.parent);shell.userData.skipOriginalPaint=true;shell.material.userData.alreadyShaded=true;}
 function volume(name,ps,center,front,back,color,z=0,tool=s,samples=48){
  k.volume(name+'Half',ps,center,tool.pivot,front,back,tool.parent,k.solid(name+'Color',color),{art:false,z:z-tool.offset.z,samples});const P=[],I=[];for(const suffix of ['Surface','Back']){const o=tool.parent.getObjectByName(name+'Half'+suffix),off=P.length/3;P.push(...o.geometry.attributes.position.array);I.push(...Array.from(o.geometry.index.array,v=>v+off));tool.parent.remove(o);o.geometry.dispose();}const g=k.geometry(P,I);smoothNormals(g);const o=k.mesh(name,g,k.solid(name+'Color',color),tool.parent);o.userData.artworkFacingFade=[.18,.52];return o;
 }
 function curvedStrip(name,ps,front,back,color,z){
  // Triangulate the actual concave petal. A radial fan crosses the inner
  // curve of a rose petal and creates folded triangles through its paint.
  const edge=new T.CatmullRomCurve3(ps.map(([x,y])=>new T.Vector3(x,y,0)),true,'centripetal').getSpacedPoints(112).slice(0,112),points=edge.map(v=>new T.Vector2(v.x,v.y));
  let faces=T.ShapeUtils.triangulateShape(points,[]);const key=(a,b)=>a<b?a+','+b:b+','+a;
  for(let pass=0;pass<10;pass++){
   const uses=new Map();for(const f of faces)for(let j=0;j<3;j++){const e=key(f[j],f[(j+1)%3]);uses.set(e,(uses.get(e)||0)+1);}const rim=new Set();for(const[e,count]of uses)if(count===1)for(const v of e.split(','))rim.add(Number(v));
   // Every interior diagonal between rim vertices needs an interior vertex;
   // otherwise front and rear collapse together along that diagonal.
   const cuts=new Map();for(const f of faces)for(let j=0;j<3;j++){const a=f[j],b=f[(j+1)%3],e=key(a,b);if(!cuts.has(e)&&(points[a].distanceTo(points[b])>12||(uses.get(e)===2&&rim.has(a)&&rim.has(b)))){cuts.set(e,points.length);points.push(points[a].clone().add(points[b]).multiplyScalar(.5));}}
   if(!cuts.size)break;const next=[];
   for(const f of faces){let[a,b,c]=f,ab=cuts.get(key(a,b)),bc=cuts.get(key(b,c)),ca=cuts.get(key(c,a)),count=[ab,bc,ca].filter(v=>v!==undefined).length;
    if(!count){next.push(f);continue;}if(count===3){next.push([a,ab,ca],[ab,b,bc],[ca,bc,c],[ab,bc,ca]);continue;}
    if(count===1){if(bc!==undefined){[a,b,c]=[b,c,a];ab=bc;}else if(ca!==undefined){[a,b,c]=[c,a,b];ab=ca;}next.push([a,ab,c],[ab,b,c]);continue;}
    if(ab===undefined){[a,b,c]=[b,c,a];[ab,bc]=[bc,ca];}else if(bc===undefined){[a,b,c]=[c,a,b];[ab,bc]=[ca,ab];}next.push([b,bc,ab],[a,ab,c],[ab,bc,c]);
   }faces=next;
  }
  const P=[],I=[],n=points.length;
  for(const rear of [false,true])for(const v of points){let d=Infinity;for(let j=0;j<edge.length;j++){const a=edge[j],b=edge[(j+1)%edge.length],dx=b.x-a.x,dy=b.y-a.y,t=Math.max(0,Math.min(1,((v.x-a.x)*dx+(v.y-a.y)*dy)/(dx*dx+dy*dy)));d=Math.min(d,Math.hypot(v.x-a.x-t*dx,v.y-a.y-t*dy));}const f=Math.sqrt(1-Math.max(0,1-d/30)**2);P.push(...s.point([v.x,v.y,z+(rear?-back:front)*f]));}
  for(const rear of [false,true])for(let[a,b,c]of faces){const A=points[a],B=points[b],C=points[c];if((B.x-A.x)*(C.y-A.y)-(B.y-A.y)*(C.x-A.x)>0)[b,c]=[c,b];rear?I.push(a+n,c+n,b+n):I.push(a,b,c);}
  const g=k.geometry(P,I);smoothNormals(g);const o=k.mesh(name,g,k.solid(name+'Color',color),s.parent);o.userData.artworkFacingFade=[.18,.52];o.userData.artworkExcludedRegions=[{cx:face[0],cy:face[1],rx:face[2],ry:face[3]}];petals.push(o);petalEdges.set(o,ps);return o;
 }
 function petal(name,ps,center,front,back,color,z=0,samples=48){const o=volume(name,ps,center,front,back,color,z,s,samples);if(!id.endsWith('sunflower'))o.userData.artworkExcludedRegions=[{cx:face[0],cy:face[1],rx:face[2],ry:face[3]}];petals.push(o);petalEdges.set(o,ps);return o;}
 function part(name,pivot){let p=parts.get(name);if(!p){p={part:{pivot},group:k.group(name,pivot)};parts.set(name,p);}p.group.clear();p.part.pivot=pivot;p.group.position.set((pivot[0]-320)*.005,(580-pivot[1])*.005,bodyZ);p.group.userData.directSurfaceArtwork=true;return sculpt(T,k,p);}
 function suit(neck,color,arms=true){
  const t=part('Torso',[320,neck+26]),body=volume('BlossomShortTorsoSolid',[[270,neck],[320,neck],[370,neck],[382,476],[376,511],[359,534],[332,545],[303,545],[279,533],[262,507],[256,473]],[320,484],.27,.27,color,bodyZ,t,48);outline(body,t,.014,cherry?ink:'#365e2e');
  if(cherry)t.ellipsoid('BlossomHiddenJoinSolid',[320,415,-.035],[45,66,.21],color);
  t.paint();
  for(const side of [-1,1]){
   const mirror=ps=>ps.map(([x,y])=>[side<0?x:640-x,y]),name=side<0?'LeftArm':'RightArm';
   if(arms){const a=part(name,[320+side*67,neck+7]),arm=volume('BlossomSleeveSolid'+side,mirror([[250,neck],[269,neck+6],[257,461],[253,485],[247,501],[235,508],[225,504],[221,490],[224,469],[235,445]]),[320+side*78,470],.13,.13,color,0,a,40);outline(arm,a,.012,cherry?ink:'#365e2e');a.paint();}
   else {const p=parts.get(name);if(p){k.body.remove(p.group);parts.delete(name);}}
   const l=part(side<0?'LeftLeg':'RightLeg',[320+side*32,529]),foot=volume('BlossomFootSolid'+side,mirror([[271,519],[308,521],[308,543],[302,558],[306,571],[292,578],[272,578],[262,570],[266,556],[272,539]]),[320+side*35,552],.17,.17,color,bodyZ,l,40);outline(foot,l,.014,cherry?ink:'#365e2e');l.paint();
  }
 }
 if(cherry){
  const top=[[269,223],[248,193],[239,164],[240,132],[248,106],[266,79],[289,62],[318,83],[350,62],[372,82],[391,113],[399,143],[396,174],[384,202],[364,225],[320,248]];
  petal('BlossomPetal0Solid',top,[320,151],.18,.20,'#f18fad',-.01,64);
  const left=[[266,229],[229,189],[201,171],[170,158],[142,158],[113,175],[126,209],[96,232],[97,257],[112,279],[138,295],[167,307],[204,314],[242,302],[269,280]];
  petal('BlossomPetal1Solid',left,[174,239],.18,.20,'#ef8fae',-.01,64);petal('BlossomPetal2Solid',left.map(([x,y])=>[640-x,y]),[466,239],.18,.20,'#ef8fae',-.01,64);
  const lower=[[269,307],[226,315],[193,336],[165,363],[147,394],[143,429],[188,430],[198,466],[229,466],[260,454],[287,433],[306,410],[319,388],[310,352]];
  petal('BlossomPetal3Solid',lower,[235,391],.20,.22,'#ed8baa',-.01,64);petal('BlossomPetal4Solid',lower.map(([x,y])=>[640-x,y]),[405,391],.20,.22,'#ed8baa',-.01,64);
  const core=s.ellipsoid('BlossomCoreSolid',[318,294,0],[119,102,.24],'#ed8dac');core.userData.artworkExcludedRegions=[{cx:318,cy:294,rx:110,ry:91}];
  suit(443,'#ee93ae');
 }
 if(rose){
  const shapes=[
   [[[230,116],[200,121],[175,142],[159,175],[132,210],[124,241],[131,269],[152,291],[178,301],[196,285],[196,242],[211,193]],[178,212],.20,.22,-.12],
   [[[423,117],[458,130],[480,156],[510,180],[518,213],[516,252],[500,282],[478,305],[456,287],[439,254],[435,210]],[475,212],.23,.23,-.12],
   [[[172,278],[152,304],[153,348],[163,392],[196,400],[226,414],[258,427],[292,428],[319,413],[304,390],[268,367],[218,337],[201,302]],[220,365],.25,.24,-.08],
   [[[457,280],[491,300],[506,328],[509,354],[504,382],[480,391],[448,405],[421,420],[376,424],[345,413],[319,397],[345,372],[393,350],[430,319]],[420,356],.25,.24,-.08],
   [[[237,130],[289,145],[323,160],[302,189],[266,211],[234,244],[222,279],[230,321],[259,352],[293,365],[294,387],[256,383],[222,363],[203,332],[195,294],[196,255],[208,206],[220,164]],[235,259],.24,.20,.10],
   [[[321,165],[366,148],[420,132],[430,175],[449,210],[458,252],[455,288],[439,320],[410,350],[373,368],[341,369],[344,347],[378,330],[410,307],[426,275],[425,243],[405,211],[370,185]],[407,255],.24,.20,.10],
   [[[223,339],[267,349],[319,360],[370,353],[412,335],[419,366],[401,391],[374,404],[341,402],[319,394],[287,406],[255,397],[235,375]],[320,375],.20,.22,.12],
   [[[212,117],[215,93],[235,74],[262,64],[292,65],[319,73],[336,78],[365,70],[398,72],[422,89],[433,111],[427,136],[404,153],[370,165],[339,183],[319,199],[301,183],[274,165],[241,152],[220,137]],[321,124],.30,.26,.10]
  ];
  for(const [i,[ps,c,f,b,z]] of shapes.entries()){
   const name='RoseLayerPetal'+i+'Solid',color=i%2?'#df3034':'#cf242e';
   if(i>=4&&i<=6)curvedStrip(name,ps,f,b,color,z);else petal(name,ps,c,f,b,color,z,56);
  }
  const core=s.ellipsoid('RoseCoreSolid',[320,282,0],[126,123,.29],'#cc2730');core.userData.artworkExcludedRegions=[{cx:320,cy:288,rx:110,ry:91}];
  const calyx=s.ellipsoid('RoseRearCalyxSolid',[320,315,-.23],[89,113,.23],'#5c8b37');calyx.userData.skipOriginalPaint=true;
  for(const side of [-1,1]){const leaf=volume('RoseCollarLeafSolid'+side,[[320,416],[281,406],[227,399],[177,406],[149,432],[190,441],[240,444],[285,435]].map(([x,y])=>[320+side*(x-320),y]),[320+side*91,423],.10,.10,'#4f873b',-.08,s,48);outline(leaf,s,.012,'#2c6039');}
  suit(424,'#73a23d');
 }
 if(!cherry&&!rose){
  const template=[[-24,119],[-32,153],[-29,180],[-17,207],[0,225],[18,207],[29,180],[32,153],[24,119],[0,104]];
  for(let i=0;i<16;i++){const a=-Math.PI/2+i*Math.PI/8,ps=template.map(([w,r])=>[320+Math.cos(a)*r-Math.sin(a)*w,289+Math.sin(a)*r+Math.cos(a)*w]);petal('SunflowerPetal'+i+'Solid',ps,[320+Math.cos(a)*164,289+Math.sin(a)*164],.10,.10,'#ffd33e',-.07,32);}
  const disk=s.ellipsoid('SunflowerDiskSolid',[318,290,.025],[140,139,.34],'#a86625');disk.userData.artworkFacingFade=[.16,.48];outline(disk,s,.016);
  // The green rear calyx joins the seed disk and wearer. It does not float as
  // separate leaves behind the flower or mirror the human face onto the back.
  const calyx=s.ellipsoid('SunflowerCalyxSolid',[318,300,-.22],[103,116,.20],'#5d8b38');calyx.userData.skipOriginalPaint=true;
  for(let i=0;i<8;i++){const a=i*Math.PI/4,ps=[[-20,34],[-29,68],[-18,98],[0,122],[18,98],[29,68],[20,34],[0,23]].map(([w,r])=>[318+Math.cos(a)*r-Math.sin(a)*w,300+Math.sin(a)*r+Math.cos(a)*w]),o=volume('SunflowerRearSepal'+i+'Solid',ps,[318+Math.cos(a)*73,300+Math.sin(a)*73],.06,.065,'#4d8238',-.29,s,32);o.userData.skipOriginalPaint=true;outline(o,s,.007,'#3e6e32');}
  suit(431,'#78a33e',false);
 }
 if(cherry||rose){
  const z=cherry?.19:.25,depth=cherry?.09:.11;
  for(const o of petals){const p=o.geometry.attributes.position;for(let i=0;i<p.count;i++){const x=p.getX(i)/.005+s.pivot[0],y=s.pivot[1]-p.getY(i)/.005,q=((x-face[0])/(face[2]+3))**2+((y-face[1])/(face[3]+3))**2;if(q<1)p.setZ(i,Math.min(p.getZ(i),z+depth*Math.sqrt(1-q)-.015-s.offset.z));}o.geometry.computeVertexNormals();smoothNormals(o.geometry);}
  const mask=s.ellipsoid('FlowerFaceSupportSolid',[face[0],face[1],z],[face[2]+3,face[3]+3,depth],cherry?'#ef93af':'#d72b32');mask.userData.artworkFacingFade=[.10,.38];
 }
 for(const o of petals)outline(o,s,.016);
 s.paint();
 // Keep the illustration inside its matching petal. In particular, the green
 // suit at the bottom of the sunflower must not smear over the yellow edges.
 for(const[o,ps]of petalEdges){const paint=s.parent.getObjectByName(o.name+'OriginalPaint');if(!paint)continue;const p=paint.geometry.attributes.position,C=paint.geometry.attributes.color,edge=new T.CatmullRomCurve3(ps.map(([x,y])=>new T.Vector3(x,y,0)),true,'centripetal').getSpacedPoints(128);
  for(let i=0;i<p.count;i++){const x=p.getX(i)/.005+s.pivot[0],y=s.pivot[1]-p.getY(i)/.005;let d=Infinity;for(let j=0;j<edge.length-1;j++){const a=edge[j],b=edge[j+1],dx=b.x-a.x,dy=b.y-a.y,t=Math.max(0,Math.min(1,((x-a.x)*dx+(y-a.y)*dy)/(dx*dx+dy*dy)));d=Math.min(d,Math.hypot(x-a.x-t*dx,y-a.y-t*dy));}const t=Math.max(0,Math.min(1,(d-(cherry||rose?2:5))/(cherry||rose?7:13)));C.setW(i,C.getW(i)*t*t*(3-2*t));}
 }
 head.special=true;head.skipNeckJoin=true;head.authoredFamily='blossom';return true;
};
