"use strict";
module.exports=function softThemes(T,k,id,parts){
 if(!['theme-cloud','theme-clover','theme-rainbow'].includes(id))return false;
 const sculpt=require('./sculpt-kit.cjs'),head=parts.get('Head'),s=sculpt(T,k,head);
 s.parent.clear();s.parent.userData.directSurfaceArtwork=true;s.parent.userData.artworkOcclusion=true;
 s.parent.userData.artworkOpaqueRegions=[{cx:320,cy:id==='theme-clover'?301:290,rx:118,ry:105}];
 function volume(name,ps,center,front,back,color,z=0,tool=s){
  k.volume(name+'Half',ps,center,tool.pivot,front,back,tool.parent,k.solid(name+'Color',color),{art:false,samples:64,z:z-tool.offset.z});
  const P=[],I=[];for(const suffix of ['Surface','Back']){const o=tool.parent.getObjectByName(name+'Half'+suffix),offset=P.length/3;P.push(...o.geometry.attributes.position.array);I.push(...Array.from(o.geometry.index.array,v=>v+offset));tool.parent.remove(o);}
  const geometry=k.geometry(P,I),normal=geometry.attributes.normal,position=geometry.attributes.position,groups=new Map();
  for(let i=0;i<position.count;i++){const key=[position.getX(i),position.getY(i),position.getZ(i)].map(v=>Math.round(v*1e5)).join(',');if(!groups.has(key))groups.set(key,[]);groups.get(key).push(i);}
  for(const members of groups.values()){const n=new T.Vector3();for(const i of members)n.add(new T.Vector3().fromBufferAttribute(normal,i));n.normalize();for(const i of members)normal.setXYZ(i,n.x,n.y,n.z);}
  const o=k.mesh(name,geometry,k.solid(name+'Color',color),tool.parent);o.userData.artworkFacingFade=[.18,.50];
  if(name==='ContinuousCloud'){
   const curve=new T.CatmullRomCurve3(ps.map(([x,y])=>new T.Vector3(...tool.point([x,y,z]))),true,'centripetal');
   const rim=k.mesh('CloudContour',new T.TubeGeometry(curve,192,.009,6,true),k.solid('CloudContourInk','#879aaa'),tool.parent);rim.userData.skipOriginalPaint=true;return o;
  }
  const inkGeo=geometry.clone(),ip=inkGeo.attributes.position,ix=inkGeo.index.array;for(let i=0;i<ip.count;i++)ip.setXYZ(i,(center[0]-tool.pivot[0])*.005+(ip.getX(i)-(center[0]-tool.pivot[0])*.005)*1.012,(tool.pivot[1]-center[1])*.005+(ip.getY(i)-(tool.pivot[1]-center[1])*.005)*1.012,z-tool.offset.z+(ip.getZ(i)-z+tool.offset.z)*1.012);for(let i=0;i<ix.length;i+=3)[ix[i+1],ix[i+2]]=[ix[i+2],ix[i+1]];inkGeo.computeVertexNormals();
  const ink=k.mesh(name+'InkShell',inkGeo,k.solid(name+'Ink',id==='theme-cloud'?'#879aaa':id==='theme-clover'?'#326d3b':'#41466e'),tool.parent);ink.userData.skipOriginalPaint=true;
  return o;
 }
 function part(name,pivot){let p=parts.get(name);if(!p){p={part:{pivot},group:k.group(name,pivot)};parts.set(name,p);}p.group.clear();p.part.pivot=pivot;p.group.position.set((pivot[0]-320)*.005,(580-pivot[1])*.005,0);p.group.userData.directSurfaceArtwork=true;return sculpt(T,k,p);}
 function suit(color,top){
  const t=part('Torso',[320,top+28]);volume('SoftThemeTorso',[[270,top],[300,top],[340,top],[370,top],[386,471],[380,510],[359,530],[320,535],[283,530],[258,509],[252,473]],[320,477],.29,.29,color,0,t);t.paint();
  for(const side of [-1,1]){
   const mirror=ps=>ps.map(([x,y])=>[side<0?x:640-x,y]);
   const a=part(side<0?'LeftArm':'RightArm',[260,top+7].map((v,i)=>i?v:side<0?v:640-v));
   volume('SoftThemeSleeve'+side,mirror([[253,top],[271,top+6],[257,451],[248,478],[246,495],[236,504],[224,498],[218,489],[220,469],[235,433]]),[320+side*76,454],.13,.13,color,0,a);a.paint();
   const l=part(side<0?'LeftLeg':'RightLeg',[320+side*33,524]);volume('SoftThemeFoot'+side,mirror([[271,513],[309,519],[310,542],[303,558],[305,570],[296,579],[277,580],[262,573],[264,559],[272,544]]),[320+side*35,552],.17,.17,color,0,l);l.paint();
  }
 }
 if(id==='theme-cloud'){
  volume('ContinuousCloud',[[320,62],[361,72],[390,94],[407,118],[443,114],[477,130],[500,159],[511,188],[512,209],[547,232],[573,269],[585,304],[580,335],[560,359],[526,375],[494,376],[471,370],[438,392],[393,408],[348,415],[295,415],[243,407],[200,394],[168,373],[130,377],[95,369],[67,348],[54,318],[53,288],[65,254],[92,227],[125,210],[129,175],[146,143],[176,123],[203,118],[227,128],[244,102],[276,77]],[320,281],.58,.53,'#e6eef6');
  suit('#e4edf5',408);
 }
 if(id==='theme-clover'){
  const upper=[[320,193],[304,126],[280,85],[249,64],[219,64],[191,80],[175,107],[172,134],[142,137],[116,156],[105,183],[109,213],[127,239],[163,259],[208,273],[270,291]];
  const lower=[[316,347],[309,399],[293,442],[265,469],[238,478],[205,468],[181,449],[169,425],[144,423],[120,410],[106,384],[107,352],[121,321],[150,297],[198,279],[260,291]];
  for(const side of [-1,1])for(const [j,ps] of [upper,lower].entries())volume('CloverLobe'+side+'_'+j,ps.map(([x,y])=>[side<0?x:640-x,y]),[320+side*91,j?369:181],.29,.26,'#69a337',-.04);
  volume('CloverFaceSupport',k.ellipse(320,302,111,92,48),[320,302],.30,.25,'#438e3c',.02);
  volume('CloverCentralJoin',[[300,359],[340,359],[352,400],[351,443],[337,467],[320,474],[298,458],[285,428],[289,392]],[320,414],.22,.24,'#599d3c',-.06);
  s.parent.updateMatrixWorld(true);
  for(const side of [-1,1])for(const [j,end] of [[0,[320+side*120,153]],[1,[320+side*122,404]]]){
   const support=s.parent.getObjectByName('CloverLobe'+side+'_'+j),path=[];
   for(let i=0;i<=20;i++){const t=i/20,x=320+side*25+(end[0]-320-side*25)*t,y=(j?344:255)+(end[1]-(j?344:255))*t,local=new T.Vector3(...s.point([x,y,-5])),origin=s.parent.localToWorld(local),hit=new T.Raycaster(origin,new T.Vector3(0,0,1)).intersectObject(support)[0];if(hit){const v=s.parent.worldToLocal(hit.point.clone());path.push([v.x/.005+s.pivot[0],s.pivot[1]-v.y/.005,v.z-.006]);}}
   if(path.length>2){const line=s.tube('CloverRearVein'+side+'_'+j,path,.008,'#418337');line.userData.skipOriginalPaint=true;}
  }
  suit('#559b40',439);
 }
 if(id==='theme-rainbow'){
  const colors=['#e43a45','#ff922f','#ffe15a','#83ba51','#43adbd','#578bd0','#7a599d'];
  for(let b=0;b<7;b++){
   const ps=[];for(const edge of [b,b+1])for(let j=0;j<=80;j++){const t=edge===b?j/80:1-j/80,a=Math.PI+t*Math.PI,rx=275-edge*23,ry=320-edge*19.5;ps.push([320+Math.cos(a)*rx,383+Math.sin(a)*ry]);}
   s.outline('RainbowArchBand'+b,ps,.47,colors[b],0,.008);
  }
  volume('RainbowFaceHood',k.ellipse(320,294,119,107,64),[320,294],.065,.50,'#735c9b',.245);
  suit('#729c79',391);
  // Keep the rainbow costume gradient on the back as well as the illustration.
  const stops=[[390,'#657fc0'],[445,'#73b4b4'],[485,'#c6d96c'],[525,'#ffd361'],[580,'#f68c50']].map(([y,c])=>[y,new T.Color(c).convertSRGBToLinear()]);
  for(const [name,p] of parts){if(name==='Head')continue;p.group.traverse(o=>{if(!o.isMesh||o.material.userData.originalTexture)return;const v=o.geometry.attributes.position,C=[];for(let i=0;i<v.count;i++){const y=p.part.pivot[1]-v.getY(i)/.005;let j=0;while(j<stops.length-2&&y>stops[j+1][0])j++;const a=stops[j],b=stops[j+1],c=a[1].clone().lerp(b[1],Math.max(0,Math.min(1,(y-a[0])/(b[0]-a[0]))));C.push(c.r,c.g,c.b);}o.geometry.setAttribute('color',new T.Float32BufferAttribute(C,3));o.material.color.set(0xffffff);o.material.userData.preserveVertexColor=true;});}
 }
 s.paint();head.special=true;head.authoredFamily='soft-theme';return true;
};





