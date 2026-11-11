"use strict";
module.exports=function symbols(T,k,id,parts){
 if(!['theme-crown','theme-lightning','theme-music-note'].includes(id))return false;
 const sculpt=require('./sculpt-kit.cjs'),head=parts.get('Head'),s=sculpt(T,k,head);
 s.parent.clear();s.parent.userData.directSurfaceArtwork=true;s.parent.userData.artworkOcclusion=true;
 const face=id==='theme-music-note'?[282,325,103,91]:id==='theme-lightning'?[318,288,104,88]:[320,329,104,92];s.parent.userData.artworkOpaqueRegions=[{cx:face[0],cy:face[1],rx:face[2],ry:face[3]}];
 function inkShell(mesh,center,factor,color){mesh.updateMatrix();const g=mesh.geometry.clone().applyMatrix4(mesh.matrix),p=g.attributes.position,c=new T.Vector3(...s.point(center));for(let i=0;i<p.count;i++)p.setXYZ(i,c.x+(p.getX(i)-c.x)*factor,c.y+(p.getY(i)-c.y)*factor,c.z+(p.getZ(i)-c.z)*factor);const ix=g.index.array;for(let i=0;i<ix.length;i+=3)[ix[i+1],ix[i+2]]=[ix[i+2],ix[i+1]];g.computeVertexNormals();const o=k.mesh(mesh.name+'InkShell',g,k.solid(mesh.name+'Ink',color),s.parent);o.userData.skipOriginalPaint=true;return o;}
 function volume(name,ps,center,front,back,color,z=0,tool=s){
  k.volume(name+'Half',ps,center,tool.pivot,front,back,tool.parent,k.solid(name+'Color',color),{art:false,samples:name.startsWith("CrownJewel")?32:id==='theme-crown'&&tool!==s?40:72,z:z-tool.offset.z});if(['theme-crown','theme-lightning','theme-music-note'].includes(id)&&tool!==s)require('./smooth-paired-volume.cjs')(T,k,tool.parent,name+'Half',{rings:16});const P=[],I=[];
  for(const suffix of ['Surface','Back']){const o=tool.parent.getObjectByName(name+'Half'+suffix),off=P.length/3;P.push(...o.geometry.attributes.position.array);I.push(...Array.from(o.geometry.index.array,v=>v+off));tool.parent.remove(o);}
  const g=k.geometry(P,I),p=g.attributes.position,n=g.attributes.normal,m=new Map();for(let i=0;i<p.count;i++){const key=[p.getX(i),p.getY(i),p.getZ(i)].map(v=>Math.round(v*1e5)).join(',');if(!m.has(key))m.set(key,[]);m.get(key).push(i);}for(const a of m.values()){const v=new T.Vector3();for(const i of a)v.add(new T.Vector3().fromBufferAttribute(n,i));v.normalize();for(const i of a)n.setXYZ(i,v.x,v.y,v.z);}
  const o=k.mesh(name,g,k.solid(name+'Color',color),tool.parent);o.userData.artworkFacingFade=[.17,.49];return o;
 }
 function part(name,pivot,z=0){let p=parts.get(name);if(!p){p={part:{pivot},group:k.group(name,pivot,z)};parts.set(name,p);}p.group.clear();p.part.pivot=pivot;p.group.position.set((pivot[0]-320)*.005,(580-pivot[1])*.005,z);p.group.userData.directSurfaceArtwork=true;return sculpt(T,k,p);}
 function suit(cx,neck,color,lightning=false){
  const shift=ps=>ps.map(([x,y])=>[x+cx-320,y]),z=lightning?-.08:.06,t=part('Torso',[cx,neck+30],z);
  volume('SymbolTorsoSolid',shift([[270,neck],[300,neck],[340,neck],[370,neck],[383,470],[380,508],[358,531],[320,538],[282,530],[259,507],[255,466]]),[cx,481],.27,.27,color,z,t);t.paint();
  for(const side of [-1,1]){
   const mirror=ps=>ps.map(([x,y])=>[cx+side*(320-x),y]);
   if(lightning&&side<0){const p=parts.get('LeftArm');if(p){k.body.remove(p.group);parts.delete('LeftArm');}}else{const a=part(side<0?'LeftArm':'RightArm',[cx+side*64,neck+8],z);volume('SymbolSleeveSolid'+side,mirror([[252,neck],[272,neck+9],[260,450],[253,477],[251,496],[242,507],[229,505],[221,495],[224,472],[237,439]]),[cx+side*76,464],.13,.13,color,z,a);a.paint();}
   const l=part(side<0?'LeftLeg':'RightLeg',[cx+side*32,526],z);volume('SymbolFootSolid'+side,mirror([[273,515],[310,517],[311,542],[304,557],[304,570],[291,579],[273,579],[261,571],[264,558],[271,541]]),[cx+side*35,552],.17,.17,color,z,l);l.paint();
  }
 }
 if(id==='theme-music-note'){
  const stem=s.smoothOutline('NoteStemFlagSolid',[[387,314],[386,97],[389,75],[398,63],[410,66],[420,82],[434,102],[460,117],[481,137],[492,163],[495,184],[488,211],[477,229],[477,205],[466,181],[449,167],[420,155],[420,316]],.31,'#454144',-.015,.025);stem.userData.artworkFacingFade=[.16,.46];
  volume('NoteRoundHoodSolid',[[285,164],[331,171],[373,194],[402,230],[419,272],[420,317],[405,359],[375,397],[331,420],[282,428],[235,419],[194,393],[165,358],[147,314],[145,270],[159,229],[186,198],[232,174]],[282,299],.38,.35,'#454144');
  suit(282,418,'#484447');
 }
 if(id==='theme-lightning'){
  const outline=[[267,64],[469,64],[397,191],[540,194],[205,576],[260,396],[100,396]];
  const border=s.outline('LightningBorderSolid',outline,.30,'#467ca9',0,.012);border.userData.artworkFacingFade=[.18,.48];
  const inner=[[276,85],[433,85],[363,212],[502,212],[240,522],[281,374],[130,374]],front=s.outline('LightningGoldSolid',inner,.045,'#ffe13a',.172,.008);front.userData.artworkFacingFade=[.18,.48];
  const rear=s.outline('LightningRearGoldSolid',inner,.025,'#ffdb36',-.163,.006);rear.userData.skipOriginalPaint=true;
  suit(320,396,'#75b5ae',true);
  const stops=[[396,'#5ca8c9'],[458,'#8dc9b6'],[510,'#e3dc83'],[580,'#ffbb63']].map(([y,c])=>[y,new T.Color(c).convertSRGBToLinear()]);
  for(const [name,p] of parts){if(name==='Head')continue;p.group.traverse(o=>{if(!o.isMesh||o.material.userData.originalTexture)return;const v=o.geometry.attributes.position,C=[];for(let i=0;i<v.count;i++){const y=p.part.pivot[1]-v.getY(i)/.005;let j=0;while(j<stops.length-2&&y>stops[j+1][0])j++;const a=stops[j],b=stops[j+1],c=a[1].clone().lerp(b[1],Math.max(0,Math.min(1,(y-a[0])/(b[0]-a[0]))));C.push(c.r,c.g,c.b);}o.geometry.setAttribute('color',new T.Float32BufferAttribute(C,3));o.material.color.set(0xffffff);o.material.userData.preserveVertexColor=true;});}
 }
 if(id==='theme-crown'){
  const hood=s.lathe('RoyalHoodSolid',[[436,0],[431,49],[415,88],[390,120],[350,137],[305,139],[272,134],[246,128],[234,120],[222,99],[214,50],[212,0]],'#ffd754',0,{levels:64,segments:48});hood.scale.z=.78;hood.userData.artworkFacingFade=[.17,.50];
  inkShell(hood,[320,325,0],1.018,'#9d6029');
  const peaks=[[161,148],[210,171],[230,118],[274,149],[319,93],[362,149],[409,118],[428,171],[477,148]];
  function top(a){const x=319+158*Math.sin(a);let i=0;while(i<peaks.length-2&&x>peaks[i+1][0])i++;const A=peaks[i],B=peaks[i+1];return A[1]+(B[1]-A[1])*(x-A[0])/(B[0]-A[0])+Math.max(0,-Math.cos(a))*55;}
  function wall(name,band=false){const P=[],I=[],n=192;for(let row=0;row<4;row++)for(let i=0;i<n;i++){const a=-Math.PI/2+i/n*Math.PI*2,upper=row===1||row===2,inside=row>=2,rx=(band?130:upper?158:128)-(inside?5:0),rz=(band?.51:upper?.60:.50)-(inside?.025:0),base=220+15*Math.sin(a)**2,y=band?base+(upper?-3:17):upper?top(a):base;P.push(...s.point([319+Math.sin(a)*rx,y,Math.cos(a)*rz]));}for(const [u,v] of [[0,1],[1,2],[2,3],[3,0]])for(let i=0;i<n;i++){const j=(i+1)%n,a=u*n+i,b=u*n+j,c=v*n+i,d=v*n+j;I.push(a,b,d,a,d,c);}const o=k.mesh(name,k.geometry(P,I),k.solid(name+'Gold',band?'#ffc43e':'#ffd542'),s.parent);o.userData.artworkFacingFade=[.16,.48];return o;}
  const crown=wall('RoyalCrownWallSolid'),band=wall('RoyalBandSolid',true);
  const pearlXs=[161,230,319,409,477];for(const back of [false,true])for(let i=0;i<5;i++){if(back&&(i===0||i===4))continue;let a=Math.asin((pearlXs[i]-319)/158);if(back)a=Math.PI-a;const radius=i===2?18:16,center=[pearlXs[i],top(a)-radius*.72,Math.cos(a)*.60];const o=s.ellipsoid('CrownPearl'+(back?'Back':'Front')+i,center,[radius,radius,radius*.005],'#ffe171');inkShell(o,center,1.07,'#9d6029');if(back)o.userData.skipOriginalPaint=true;}
  const proxy=new T.Mesh(crown.geometry,new T.MeshBasicMaterial({side:T.DoubleSide}));proxy.updateMatrixWorld(true);
  for(const back of [false,true])for(const [i,[x,y,rx,ry,color]] of [[319,174,19,27,'#e62454'],[249,184,12,18,'#399bbb'],[390,184,12,18,'#399bbb'],[185,202,11,17,'#df315e'],[454,202,11,17,'#df315e']].entries()){
   const direction=back?1:-1,origin=new T.Vector3(...s.point([x,y,back?-4:4])),hit=new T.Raycaster(origin,new T.Vector3(0,0,direction)).intersectObject(proxy)[0];if(!hit)continue;const z=hit.point.z+s.offset.z-direction*.015,ps=[[x,y-ry],[x+rx,y],[x,y+ry],[x-rx,y]],o=volume('CrownJewel'+(back?'Back':'Front')+i,ps,[x,y],back?.01:.045,back?.045:.01,color,z);if(back)o.userData.skipOriginalPaint=true;
  }
  proxy.material.dispose();suit(320,423,'#ffdc5a');
 }
 s.paint();head.special=true;head.skipNeckJoin=true;head.authoredFamily='symbol';return true;
};
