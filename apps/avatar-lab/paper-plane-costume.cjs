"use strict";
module.exports=function paperPlane(T,k,id,parts){
 if(id!=='theme-paper-airplane')return false;
 const sculpt=require('./sculpt-kit.cjs'),head=parts.get('Head'),s=sculpt(T,k,head);s.parent.clear();s.parent.userData.directSurfaceArtwork=true;s.parent.userData.artworkOpaqueRegions=[{cx:315,cy:234,rx:112,ry:91}];
 const white='#f3f5f9',ink='#626a78';
 function outline(o,tool=s,width=.014){o.updateMatrix();const g=o.geometry.clone().applyMatrix4(o.matrix),p=g.attributes.position,box=new T.Box3().setFromBufferAttribute(p),c=box.getCenter(new T.Vector3()),d=box.getSize(new T.Vector3()),f=1+width/(Math.max(d.x,d.y,d.z)/2),ix=g.index.array;for(let i=0;i<p.count;i++)p.setXYZ(i,c.x+(p.getX(i)-c.x)*f,c.y+(p.getY(i)-c.y)*f,c.z+(p.getZ(i)-c.z)*f);for(let i=0;i<ix.length;i+=3)[ix[i+1],ix[i+2]]=[ix[i+2],ix[i+1]];g.computeVertexNormals();const shell=k.mesh(o.name+'InkShell',g,k.solid(o.name+'Ink',ink),tool.parent);shell.userData.skipOriginalPaint=true;shell.material.userData.alreadyShaded=true;}
 function volume(tool,name,ps,center,depth,z=0,color=white){k.volume(name+'Half',ps,center,tool.pivot,depth,depth,tool.parent,k.solid(name+'Color',color),{art:false,z:z-tool.offset.z,samples:48});require('./smooth-paired-volume.cjs')(T,k,tool.parent,name+'Half',{rings:24});const P=[],I=[];for(const suffix of ['Surface','Back']){const o=tool.parent.getObjectByName(name+'Half'+suffix),off=P.length/3;P.push(...o.geometry.attributes.position.array);I.push(...Array.from(o.geometry.index.array,v=>v+off));tool.parent.remove(o);o.geometry.dispose();}const g=k.geometry(P,I),p=g.attributes.position,n=g.attributes.normal,m=new Map();for(let i=0;i<p.count;i++){const key=[p.getX(i),p.getY(i),p.getZ(i)].map(v=>Math.round(v*1e5)).join(',');if(!m.has(key))m.set(key,[]);m.get(key).push(i);}for(const a of m.values()){const v=new T.Vector3();for(const i of a)v.add(new T.Vector3().fromBufferAttribute(n,i));v.normalize();for(const i of a)n.setXYZ(i,v.x,v.y,v.z);}const o=k.mesh(name,g,k.solid(name+'Color',color),tool.parent);o.userData.artworkFacingFade=[.18,.52];outline(o,tool);return o;}
 function part(name,pivot,z=0){let p=parts.get(name);if(!p){p={part:{pivot},group:k.group(name,pivot,z)};parts.set(name,p);}p.group.clear();p.part.pivot=pivot;p.group.position.set((pivot[0]-320)*.005,(580-pivot[1])*.005,z);p.group.userData.directSurfaceArtwork=true;return sculpt(T,k,p);}
 function panel(name,points,color){
  // Thin closed paper panels share their fold vertices in 3D. Their edges
  // are real narrow rounded strips, visible from the front and the rear.
  const P=[],I=[],n=points.length;for(const rear of [false,true])for(const[x,y,z]of points)P.push(...s.point([x,y,z+(rear?-.018:.018)]));
  const contour=points.map(([x,y])=>new T.Vector2(x,-y));for(let[a,b,c]of T.ShapeUtils.triangulateShape(contour,[])){const A=contour[a],B=contour[b],C=contour[c];if((B.x-A.x)*(C.y-A.y)-(B.y-A.y)*(C.x-A.x)<0)[b,c]=[c,b];I.push(a,b,c,a+n,c+n,b+n);}
  let area=0;for(let i=0;i<n;i++){const j=(i+1)%n;area+=contour[i].x*contour[j].y-contour[j].x*contour[i].y;}
  for(let i=0;i<n;i++){const j=(i+1)%n;area>0?I.push(i,n+i,n+j,i,n+j,j):I.push(i,n+j,n+i,i,j,n+j);}
  const o=k.mesh(name,k.geometry(P,I),k.solid(name+'Color',color),s.parent);o.userData.skipOriginalPaint=true;o.material.userData.alreadyShaded=true;
  for(let i=0;i<n;i++)for(const side of [-1,1]){const j=(i+1)%n,key=name+'Edge'+i+'_'+side;s.tube(key,[points[i],points[j]].map(([x,y,z])=>[x,y,z+side*.018]),.011,ink);for(const q of s.parent.children.filter(q=>q.name.startsWith(key)))q.userData.skipOriginalPaint=true;}
  return o;
 }
 const nose=[594,96,-.30],left=[43,233,-.25],root=[136,305,-.08],fold=[191,349,.015],tail=[163,444,-.30],right=[331,450,.03];
 panel('PaperLeftWingSolid',[left,nose,root],white);
 panel('PaperLeftFoldSolid',[root,nose,fold,tail],'#cfd5df');
 panel('PaperLowerFoldSolid',[tail,fold,[243,391,-.15]],'#aeb8c7');
 panel('PaperRightWingSolid',[fold,nose,right],white);
 const hood=s.ellipsoid('PaperPilotHoodSolid',[313,217,.08],[143,128,.43],white);hood.userData.artworkFacingFade=[.12,.42];outline(hood,s,.020);
 const t=part('Torso',[320,418],-.34);volume(t,'PaperPilotTorsoSolid',[[270,362],[320,346],[366,366],[378,408],[383,448],[372,482],[352,503],[317,511],[285,503],[263,481],[252,445],[257,401]],[318,444],.26,-.34);
 const join=t.sweep('PaperPilotHiddenJoinSolid',[[316,320,-.11,28],[316,345,-.20,29],[316,370,-.29,31],[316,400,-.34,35]],white);join.userData.skipOriginalPaint=true;t.paint();
 for(const side of [-1,1]){
  const mirror=ps=>ps.map(([x,y])=>[side<0?x:640-x,y]),a=part(side<0?'LeftArm':'RightArm',[320+side*57,397],-.32);
  volume(a,'PaperPilotSleeveSolid'+side,mirror([[251,382],[268,394],[263,416],[254,441],[244,463],[234,474],[219,473],[211,463],[214,438],[224,412],[237,390]]),[320+side*79,434],.13,-.32);a.paint();
  const l=part(side<0?'LeftLeg':'RightLeg',[320+side*31,493],-.34);
  volume(l,'PaperPilotFootSolid'+side,mirror([[274,481],[305,489],[303,517],[298,535],[279,546],[263,546],[257,538],[266,522],[270,501]]),[320+side*36,522],.18,-.34);l.paint();
 }
 s.paint();
 const paint=s.parent.getObjectByName('PaperPilotHoodSolidOriginalPaint'),p=paint.geometry.attributes.position,C=paint.geometry.attributes.color;
 for(let i=0;i<p.count;i++){const x=p.getX(i)/.005+s.pivot[0],y=s.pivot[1]-p.getY(i)/.005,r=Math.hypot((x-313)/143,(y-217)/128),t=Math.max(0,Math.min(1,(.985-r)/.065));C.setW(i,C.getW(i)*t*t*(3-2*t));}
 head.special=true;head.skipNeckJoin=true;head.authoredFamily='folded-paper';return true;
};
