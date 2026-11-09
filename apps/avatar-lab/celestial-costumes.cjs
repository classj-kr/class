"use strict";
module.exports=function celestial(T,k,id,parts){
 if(!['theme-moon','theme-star','theme-sun'].includes(id))return false;
 const sculpt=require('./sculpt-kit.cjs'),head=parts.get('Head'),s=sculpt(T,k,head);
 s.parent.clear();s.parent.userData.directSurfaceArtwork=true;s.parent.userData.artworkOcclusion=true;
 s.parent.userData.artworkOpaqueRegions=[{cx:320,cy:318,rx:106,ry:92}];
 function smoothNormals(g){const p=g.attributes.position,n=g.attributes.normal,m=new Map();for(let i=0;i<p.count;i++){const key=[p.getX(i),p.getY(i),p.getZ(i)].map(v=>Math.round(v*1e5)).join(',');if(!m.has(key))m.set(key,[]);m.get(key).push(i);}for(const a of m.values()){const v=new T.Vector3();for(const i of a)v.add(new T.Vector3().fromBufferAttribute(n,i));v.normalize();for(const i of a)n.setXYZ(i,v.x,v.y,v.z);}return g;}
 function volume(name,ps,center,front,back,color,z=0,tool=s){
  k.volume(name+'Half',ps,center,tool.pivot,front,back,tool.parent,k.solid(name+'Color',color),{art:false,samples:72,z:z-tool.offset.z});const P=[],I=[];
  for(const suffix of ['Surface','Back']){const o=tool.parent.getObjectByName(name+'Half'+suffix),off=P.length/3;P.push(...o.geometry.attributes.position.array);I.push(...Array.from(o.geometry.index.array,v=>v+off));tool.parent.remove(o);}
  const o=k.mesh(name,smoothNormals(k.geometry(P,I)),k.solid(name+'Color',color),tool.parent);o.userData.artworkFacingFade=[.16,.48];return o;
 }
 function contour(name,ps,color,z=0,tool=s){const curve=new T.CatmullRomCurve3(ps.map(([x,y])=>new T.Vector3(...tool.point([x,y,z]))),true,'centripetal'),o=k.mesh(name,new T.TubeGeometry(curve,192,.010,6,true),k.solid(name+'Ink',color),tool.parent);o.userData.skipOriginalPaint=true;return o;}
 function part(name,pivot){let p=parts.get(name);if(!p){p={part:{pivot},group:k.group(name,pivot)};parts.set(name,p);}p.group.clear();p.part.pivot=pivot;p.group.position.set((pivot[0]-320)*.005,(580-pivot[1])*.005,.10);p.group.userData.directSurfaceArtwork=true;return sculpt(T,k,p);}
 function suit(color,neck,wide=false){
  const t=part('Torso',[320,neck+30]);volume('CelestialTorsoSolid',[[269,neck],[300,neck],[340,neck],[372,neck],[384,468],[385,507],[366,531],[321,537],[280,530],[260,506],[259,465]],[321,481],.27,.27,color,.10,t);t.paint();
  for(const side of [-1,1]){const mirror=ps=>ps.map(([x,y])=>[side<0?x:640-x,y]);
   const a=part(side<0?'LeftArm':'RightArm',[320+side*65,neck+8]),ps=wide?[[247,417],[273,427],[259,453],[248,480],[241,500],[228,509],[213,504],[206,493],[209,469],[224,441]]:[[253,neck],[273,neck+9],[259,450],[254,478],[250,500],[240,508],[229,502],[226,486],[231,462],[242,437]];
   volume('CelestialSleeveSolid'+side,mirror(ps),[320+side*(wide?82:70),463],.13,.13,color,.12,a);a.paint();
   const l=part(side<0?'LeftLeg':'RightLeg',[320+side*33,525]);volume('CelestialFootSolid'+side,mirror([[274,514],[311,517],[310,544],[304,560],[305,570],[291,580],[275,578],[262,571],[266,557],[273,541]]),[320+side*35,553],.17,.17,color,.10,l);l.paint();
  }
 }
 if(id==='theme-moon'){
  const outer=[[419,67],[379,63],[333,67],[286,84],[243,110],[208,147],[181,193],[165,237],[160,278],[170,321],[189,359],[219,390],[259,417],[307,434],[356,437],[402,425],[442,401],[466,376],[479,352]],inner=[[419,67],[393,88],[373,113],[361,144],[358,174],[371,200],[395,219],[421,241],[439,269],[448,299],[444,330],[435,358],[458,359],[479,352]];
  const a=new T.CatmullRomCurve3(outer.map(([x,y])=>new T.Vector3(x,y,0))),b=new T.CatmullRomCurve3(inner.map(([x,y])=>new T.Vector3(x,y,0))),P=[],I=[],rows=112,cols=24,half=(rows+1)*(cols+1);
  for(const back of [false,true])for(let r=0;r<=rows;r++){const u=r/rows,aa=a.getPoint(u),bb=b.getPoint(u),width=aa.distanceTo(bb)*.005,depth=Math.min(.48,width*.42);for(let c=0;c<=cols;c++){const t=c/cols,v=aa.clone().lerp(bb,t),z=Math.sin(Math.PI*t)*depth*(back?-1:1);P.push(...s.point([v.x,v.y,z]));}}
  for(const back of [false,true])for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){const o=back?half:0,a=o+r*(cols+1)+c,b=a+cols+1;back?I.push(a,b,a+1,a+1,b,b+1):I.push(a,a+1,b,a+1,b+1,b);}
  const g=k.geometry(P,I);let area=0;for(let i=0;i<half;i++)area+=g.attributes.normal.getZ(i);if(area<0){for(let i=0;i<I.length;i+=3)[I[i+1],I[i+2]]=[I[i+2],I[i+1]];g.setIndex(I);g.computeVertexNormals();}
  const moon=k.mesh('CrescentShellSolid',smoothNormals(g),k.solid('MoonGold','#ffd83f'),s.parent);moon.userData.artworkFacingFade=[.15,.48];
  contour('CrescentContour',[...outer,...inner.slice(1,-1).reverse()],'#b87e2c');suit('#ffd84c',425,true);
 }
 if(id==='theme-star'){
  const ps=[[320,63],[340,77],[362,112],[397,173],[412,187],[469,198],[533,212],[553,225],[559,241],[554,259],[529,289],[480,339],[469,357],[470,393],[480,467],[477,490],[465,505],[447,507],[412,495],[365,470],[320,446],[277,471],[228,496],[194,507],[173,507],[157,494],[153,477],[158,433],[167,375],[168,355],[156,335],[112,288],[86,257],[79,241],[83,224],[99,213],[147,201],[212,189],[231,182],[246,161],[280,104],[302,73]];
  volume('RoundedStarSolid',ps,[320,289],.39,.35,'#ffda48');contour('StarContour',ps,'#bd852b');suit('#ffdc51',415);
 }
 if(id==='theme-sun'){
  const ps=[[320,61],[368,129],[398,106],[404,146],[489,117],[473,200],[508,205],[488,240],[552,287],[492,332],[505,361],[478,364],[495,431],[428,417],[422,447],[382,419],[321,450],[262,418],[220,446],[214,417],[148,430],[165,363],[140,359],[153,332],[88,288],[155,239],[133,207],[171,201],[156,118],[233,139],[244,104],[275,130]];
  const outline=new T.CatmullRomCurve3(ps.map(([x,y])=>new T.Vector3(x,y,0)),true,'centripetal').getSpacedPoints(256).slice(0,256).map(p=>[p.x,p.y]);
  const rays=s.outline('SourceSunRaysSolid',outline,.22,'#ff9b25',-.10,.012);rays.userData.artworkExcludedRegions=[{cx:320,cy:285,rx:161,ry:151}];rays.userData.artworkFacingFade=[.16,.48];
  const disk=s.ellipsoid('SunDiskSolid',[320,285,.04],[156,146,.40],'#ffbd26');disk.userData.artworkFacingFade=[.16,.48];
  contour('SunDiskContour',k.ellipse(320,285,156,146,96),'#b45619',.04);
  suit('#ffa929',419);
 }
 s.paint();
 if(id==='theme-sun'){
  const paint=s.parent.getObjectByName('SunDiskSolidOriginalPaint'),p=paint.geometry.attributes.position,c=paint.geometry.attributes.color;
  for(let i=0;i<p.count;i++){const x=s.pivot[0]+p.getX(i)/.005,y=s.pivot[1]-p.getY(i)/.005,r=Math.hypot((x-320)/156,(y-285)/146);c.setW(i,c.getW(i)*Math.max(0,Math.min(1,(.97-r)/.045)));}
 }
 // The separate short wearer owns its source paint below the collar. Do not
 // put duplicated hands or a torso on the lower star points or solar rays.
 if(id!=='theme-moon')s.parent.traverse(o=>{if(!o.isMesh||!o.material.userData.originalTexture)return;const p=o.geometry.attributes.position,c=o.geometry.attributes.color;if(!c)return;for(let i=0;i<p.count;i++){const x=s.pivot[0]+p.getX(i)/.005,y=s.pivot[1]-p.getY(i)/.005;if(y>418&&x>242&&x<399)c.setW(i,0);}});
 head.special=true;head.skipNeckJoin=true;head.authoredFamily='celestial';return true;
};
