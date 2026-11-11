"use strict";
module.exports=function roundVegetables(T,k,id,parts){
 if(!['vegetable-bell-pepper','vegetable-pumpkin','vegetable-tomato'].includes(id))return false;
 const sculpt=require('./sculpt-kit.cjs'),head=parts.get('Head'),s=sculpt(T,k,head),pepper=id.endsWith('bell-pepper'),pumpkin=id.endsWith('pumpkin'),color=pepper?'#e33f2d':pumpkin?'#f6a029':'#e94334',ink=pumpkin?'#995019':'#8a281f',contours=[],shells=[];
 s.parent.clear();s.parent.userData.directSurfaceArtwork=true;s.parent.userData.artworkOcclusion=true;
 s.parent.userData.artworkOpaqueRegions=[{cx:320,cy:pepper?316:pumpkin?319:305,rx:114,ry:94}];
 function smooth(g){const p=g.attributes.position,n=g.attributes.normal,m=new Map();for(let i=0;i<p.count;i++){const key=[p.getX(i),p.getY(i),p.getZ(i)].map(v=>Math.round(v*1e5)).join(',');if(!m.has(key))m.set(key,[]);m.get(key).push(i);}for(const indices of m.values()){const v=new T.Vector3();for(const i of indices)v.add(new T.Vector3().fromBufferAttribute(n,i));v.normalize();for(const i of indices)n.setXYZ(i,v.x,v.y,v.z);}}
 function volume(tool,name,ps,center,front,back,c,z=0,samples=64){if(['VegetableStemSolid','TomatoCalyxSolid'].includes(name)){const o=require('./rounded-contour-solid.cjs')(T,k,tool,name,ps,{front,back,color:c,z});o.userData.artworkFacingFade=[.15,.50];contours.push([o,tool,ps]);shells.push([o,tool,'#365c2b',.012]);return o;}k.volume(name+'Half',ps,center,tool.pivot,front,back,tool.parent,k.solid(name+'Color',c),{art:false,z:z-tool.offset.z,samples});require('./smooth-paired-volume.cjs')(T,k,tool.parent,name+'Half',{rings:24});const P=[],I=[];for(const suffix of ['Surface','Back']){const o=tool.parent.getObjectByName(name+'Half'+suffix),offset=P.length/3;P.push(...o.geometry.attributes.position.array);I.push(...Array.from(o.geometry.index.array,v=>v+offset));tool.parent.remove(o);o.geometry.dispose();}const g=k.geometry(P,I);smooth(g);const o=k.mesh(name,g,k.solid(name+'Color',c),tool.parent);o.userData.artworkFacingFade=[.15,.50];contours.push([o,tool,ps]);shells.push([o,tool,c==='#71953b'?'#365c2b':ink,name==='VegetableHeadSolid'?.019:.012]);return o;}
 function part(name,pivot){let p=parts.get(name);if(!p){p={part:{pivot},group:k.group(name,pivot)};parts.set(name,p);}p.group.clear();p.part.pivot=pivot;p.group.position.set((pivot[0]-320)*.005,(580-pivot[1])*.005,0);p.group.userData.directSurfaceArtwork=true;return sculpt(T,k,p);}
 const outline=pepper?[[320,140],[353,130],[381,134],[409,151],[444,169],[470,203],[481,242],[475,287],[462,338],[450,382],[430,418],[406,441],[373,443],[349,452],[320,457],[288,452],[269,442],[238,444],[210,425],[192,394],[180,351],[166,300],[156,251],[158,213],[174,181],[199,164],[226,151],[253,136],[283,130]]:pumpkin?[[320,144],[367,149],[412,155],[450,173],[481,205],[504,249],[516,288],[511,334],[490,374],[455,407],[408,428],[365,442],[320,453],[273,444],[227,432],[183,410],[149,380],[129,340],[121,296],[128,250],[149,208],[183,178],[225,158],[274,150]]:[[318,119],[374,122],[424,147],[465,185],[492,231],[502,281],[492,332],[465,371],[425,403],[373,424],[316,434],[260,426],[207,405],[167,371],[143,325],[137,276],[149,227],[175,183],[217,149],[266,128]];
 const center=pepper?[320,291]:pumpkin?[320,299]:[320,279],depth=pepper?.69:pumpkin?.88:.82;
 const body=volume(s,'VegetableHeadSolid',outline,center,depth,depth,color,0,112);body.userData.artworkFacingFade=[.15,.50];body.userData.artworkHorizontalNormal=true;
 if(pepper||pumpkin){
  // Keep the front silhouette, while sculpting longitudinal recesses into
  // the side and rear surface instead of painting detached stripes in space.
  const p=body.geometry.attributes.position,count=p.count/2,ribs=pumpkin?8:4;
  for(let i=0;i<p.count;i++){const x=p.getX(i)+s.offset.x,z=p.getZ(i)+s.offset.z,a=Math.atan2(x,z),strength=.12*(1-Math.cos(a*ribs))*.5; p.setX(i,x*(1-strength*Math.sqrt(Math.min(1,Math.abs(z)/depth)))-s.offset.x);p.setZ(i,(z*(1-strength))-s.offset.z);}
  body.geometry.computeVertexNormals();smooth(body.geometry);
  const stem=pepper?[[290,63],[307,71],[323,91],[333,115],[338,137],[350,152],[374,163],[337,164],[317,159],[288,169],[295,146],[300,124],[296,109],[284,101],[271,94],[269,82],[274,70]]:[[319,157],[287,151],[300,128],[306,102],[317,77],[337,64],[352,66],[361,78],[355,91],[343,98],[339,118],[344,136],[366,153],[343,162]];
  volume(s,'VegetableStemSolid',stem,pepper?[311,122]:[327,111],.10,.10,'#71953b',0,64);
 }else{
  const cap=volume(s,'TomatoCalyxSolid',[[320,115],[314,91],[326,64],[336,64],[332,91],[330,112],[357,99],[379,97],[365,115],[408,121],[408,127],[366,140],[375,171],[351,158],[320,143],[289,160],[262,176],[265,154],[278,138],[233,130],[228,124],[272,115],[251,101],[254,96],[286,103]],[320,128],.075,.075,'#71953b',0,104);
  s.parent.updateMatrixWorld(true);const p=cap.geometry.attributes.position;
  for(let i=0;i<p.count;i++){const x=p.getX(i)/.005+s.pivot[0],y=s.pivot[1]-p.getY(i)/.005,origin=s.parent.localToWorld(new T.Vector3(...s.point([x,y,4]))),hit=new T.Raycaster(origin,new T.Vector3(0,0,-1)).intersectObject(body)[0];if(hit)p.setZ(i,p.getZ(i)+s.parent.worldToLocal(hit.point.clone()).z+s.offset.z-.025);}
  cap.geometry.computeVertexNormals();smooth(cap.geometry);cap.userData.artworkFacingFade=[.08,.30];cap.userData.artworkHorizontalNormal=true;
 }
 const neck=pepper||pumpkin?438:422,t=part('Torso',[320,neck+35]);
 volume(t,'VegetableShortSuitSolid',[[270,neck],[370,neck],[379,477],[374,509],[358,531],[337,540],[303,540],[280,531],[265,509],[258,477]],[320,490],.27,.27,color);t.paint();
 for(const side of [-1,1]){
  const mirror=ps=>ps.map(([x,y])=>[side<0?x:640-x,y]),a=part(side<0?'LeftArm':'RightArm',[320+side*65,neck+8]);
  volume(a,'VegetableSleeve'+side+'Solid',mirror([[244,neck],[281,neck+3],[267,465],[252,485],[247,505],[235,508],[222,502],[217,489],[223,470]]),[320+side*80,477],.12,.12,color);a.paint();
  const l=part(side<0?'LeftLeg':'RightLeg',[320+side*32,527]);volume(l,'VegetableFoot'+side+'Solid',mirror([[276,520],[308,523],[309,545],[305,564],[295,576],[277,577],[264,573],[261,565],[270,550]]),[320+side*34,552],.17,.17,color);l.paint();
 }
 // The stem is embedded in the top. Rear grooves are fitted to the actual
 // closed solid, with no mirrored facial artwork on the back.
 if(pepper||pumpkin){s.parent.updateMatrixWorld(true);const count=pumpkin?5:3;
  for(let j=0;j<count;j++){const u=(j-(count-1)/2)/(pumpkin?3:2),ps=[];for(let i=0;i<=32;i++){const t=i/32,y=(pepper?150:165)+(pepper?284:266)*t,x=320+u*(pumpkin?170:125)*Math.sin(Math.PI*(.07+.86*t)),origin=s.parent.localToWorld(new T.Vector3(...s.point([x,y,-4]))),h=new T.Raycaster(origin,new T.Vector3(0,0,1)).intersectObject(body)[0];if(h){const q=s.parent.worldToLocal(h.point.clone());ps.push([x,y,q.z+s.offset.z-.003]);}}
   if(ps.length>2){const o=s.tube('VegetableRearGroove'+j,ps,pumpkin?.006:.007,pumpkin?'#c77720':'#b83225');for(const q of s.parent.children.filter(q=>q.name===o.name||q.name.startsWith(o.name+'Cap')))q.userData.skipOriginalPaint=true;o.userData.surfaceSupport=body.name;}
  }
 }
 s.paint();
 for(const[o,tool,ps]of contours){const art=tool.parent.getObjectByName(o.name+'OriginalPaint');if(!art)continue;const p=art.geometry.attributes.position,C=art.geometry.attributes.color,edge=new T.CatmullRomCurve3(ps.map(([x,y])=>new T.Vector3(x,y,0)),true,'centripetal').getSpacedPoints(128);for(let i=0;i<p.count;i++){const x=p.getX(i)/.005+tool.pivot[0],y=tool.pivot[1]-p.getY(i)/.005;let d=Infinity;for(let j=0;j<edge.length-1;j++){const a=edge[j],b=edge[j+1],dx=b.x-a.x,dy=b.y-a.y,t=Math.max(0,Math.min(1,((x-a.x)*dx+(y-a.y)*dy)/(dx*dx+dy*dy)));d=Math.min(d,Math.hypot(x-a.x-t*dx,y-a.y-t*dy));}const t=Math.max(0,Math.min(1,(d-(o.name==='TomatoCalyxSolid'?0:2))/(o.name==='TomatoCalyxSolid'?3:9)));C.setW(i,C.getW(i)*t*t*(3-2*t));}}
 for(const[o,tool,c,width]of shells){o.updateMatrix();const g=o.geometry.clone().applyMatrix4(o.matrix),p=g.attributes.position,box=new T.Box3().setFromBufferAttribute(p),center=box.getCenter(new T.Vector3()),size=box.getSize(new T.Vector3()),f=1+width/(Math.max(size.x,size.y,size.z)/2),ix=g.index.array;for(let i=0;i<p.count;i++)p.setXYZ(i,center.x+(p.getX(i)-center.x)*f,center.y+(p.getY(i)-center.y)*f,center.z+(p.getZ(i)-center.z)*f);for(let i=0;i<ix.length;i+=3)[ix[i+1],ix[i+2]]=[ix[i+2],ix[i+1]];g.computeVertexNormals();const shell=k.mesh(o.name+'InkShell',g,k.solid(o.name+'Ink',c),tool.parent);shell.userData.skipOriginalPaint=true;shell.material.userData.alreadyShaded=true;}
 head.special=true;head.skipNeckJoin=true;head.authoredFamily='round-vegetable';return true;
};
