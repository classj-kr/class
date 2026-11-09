"use strict";
module.exports=function handheld(T,k,id,parts){
 if(!['theme-balloons','theme-guitar'].includes(id))return false;
 const sculpt=require('./sculpt-kit.cjs'),head=parts.get('Head'),s=sculpt(T,k,head),balloons=id==='theme-balloons',ink=balloons?'#733c2b':'#874823',outlines=[];
 s.parent.clear();s.parent.userData.directSurfaceArtwork=true;s.parent.userData.artworkOcclusion=true;
 s.parent.userData.artworkOpaqueRegions=[balloons?{cx:318,cy:363,rx:102,ry:85}:{cx:284,cy:299,rx:96,ry:81}];
 function outline(o,tool=s,width=.014,color=ink){outlines.push([o,tool,width,color]);return o;}
 function finishOutlines(){for(const[o,tool,width,color]of outlines){o.updateMatrix();const g=o.geometry.clone().applyMatrix4(o.matrix),p=g.attributes.position,box=new T.Box3().setFromBufferAttribute(p),c=box.getCenter(new T.Vector3()),d=box.getSize(new T.Vector3()),f=1+width/(Math.max(d.x,d.y,d.z)/2);if(!g.index)g.setIndex(Array.from({length:p.count},(_,i)=>i));const ix=g.index.array;for(let i=0;i<p.count;i++)p.setXYZ(i,c.x+(p.getX(i)-c.x)*f,c.y+(p.getY(i)-c.y)*f,c.z+(p.getZ(i)-c.z)*f);for(let i=0;i<ix.length;i+=3)[ix[i+1],ix[i+2]]=[ix[i+2],ix[i+1]];g.computeVertexNormals();const shell=k.mesh(o.name+'InkShell',g,k.solid(o.name+'Ink',color),tool.parent);shell.userData.skipOriginalPaint=true;shell.material.userData.alreadyShaded=true;}}
 function volume(tool,name,ps,center,front,back,color,z=0,samples=48){k.volume(name+'Half',ps,center,tool.pivot,front,back,tool.parent,k.solid(name+'Color',color),{art:false,z:z-tool.offset.z,samples});const P=[],I=[];for(const suffix of ['Surface','Back']){const o=tool.parent.getObjectByName(name+'Half'+suffix),off=P.length/3;P.push(...o.geometry.attributes.position.array);I.push(...Array.from(o.geometry.index.array,v=>v+off));tool.parent.remove(o);o.geometry.dispose();}const g=k.geometry(P,I),p=g.attributes.position,n=g.attributes.normal,m=new Map();for(let i=0;i<p.count;i++){const key=[p.getX(i),p.getY(i),p.getZ(i)].map(v=>Math.round(v*1e5)).join(',');if(!m.has(key))m.set(key,[]);m.get(key).push(i);}for(const a of m.values()){const v=new T.Vector3();for(const i of a)v.add(new T.Vector3().fromBufferAttribute(n,i));v.normalize();for(const i of a)n.setXYZ(i,v.x,v.y,v.z);}const o=k.mesh(name,g,k.solid(name+'Color',color),tool.parent);o.userData.artworkFacingFade=[.16,.50];return o;}
 function part(name,pivot,z=0){let p=parts.get(name);if(!p){p={part:{pivot},group:k.group(name,pivot,z)};parts.set(name,p);}p.group.clear();p.part.pivot=pivot;p.group.position.set((pivot[0]-320)*.005,(580-pivot[1])*.005,z);p.group.userData.directSurfaceArtwork=true;return sculpt(T,k,p);}
 function plainTube(tool,name,ps,r,color){const o=tool.tube(name,ps,r,color);for(const q of tool.parent.children.filter(q=>q.name===name||q.name.startsWith(name+'Cap')))q.userData.skipOriginalPaint=true;return o;}
 function fadeOuter(tool,o,cx,cy,rx,ry){const art=tool.parent.getObjectByName(o.name+'OriginalPaint');if(!art)return;const p=art.geometry.attributes.position,C=art.geometry.attributes.color;for(let i=0;i<p.count;i++){const x=p.getX(i)/.005+tool.pivot[0],y=tool.pivot[1]-p.getY(i)/.005,t=Math.max(0,Math.min(1,(.98-Math.hypot((x-cx)/rx,(y-cy)/ry))/.07));C.setW(i,C.getW(i)*t*t*(3-2*t));}}
 function refineSurface(o,max=.075){
  // Cap triangles from ExtrudeGeometry can span the entire face. Local paint
  // masks need shared interior vertices so a masked guitar/hand corner cannot
  // interpolate transparency across the unrelated human eyes and mouth.
  const p=o.geometry.attributes.position,ix=o.geometry.index,points=[],map=new Map(),remap=[];
  for(let i=0;i<p.count;i++){const v=new T.Vector3().fromBufferAttribute(p,i),key=v.toArray().map(q=>Math.round(q*1e6)).join(',');if(!map.has(key)){map.set(key,points.length);points.push(v);}remap.push(map.get(key));}
  let faces=[];for(let j=0;j<(ix?ix.count:p.count);j+=3){const f=[0,1,2].map(d=>remap[ix?ix.getX(j+d):j+d]);if(new Set(f).size===3)faces.push(f);}const key=(a,b)=>a<b?a+','+b:b+','+a;
  for(let pass=0;pass<10;pass++){const cuts=new Map();for(const f of faces)for(let j=0;j<3;j++){const a=f[j],b=f[(j+1)%3],e=key(a,b);if(!cuts.has(e)&&points[a].distanceTo(points[b])>max){cuts.set(e,points.length);points.push(points[a].clone().add(points[b]).multiplyScalar(.5));}}if(!cuts.size)break;const next=[];
   for(const f of faces){let[a,b,c]=f,ab=cuts.get(key(a,b)),bc=cuts.get(key(b,c)),ca=cuts.get(key(c,a)),count=[ab,bc,ca].filter(v=>v!==undefined).length;if(!count){next.push(f);continue;}if(count===3){next.push([a,ab,ca],[ab,b,bc],[ca,bc,c],[ab,bc,ca]);continue;}if(count===1){if(bc!==undefined){[a,b,c]=[b,c,a];ab=bc;}else if(ca!==undefined){[a,b,c]=[c,a,b];ab=ca;}next.push([a,ab,c],[ab,b,c]);continue;}if(ab===undefined){[a,b,c]=[b,c,a];[ab,bc]=[bc,ca];}else if(bc===undefined){[a,b,c]=[c,a,b];[ab,bc]=[ca,ab];}next.push([b,bc,ab],[a,ab,c],[ab,bc,c]);}faces=next;
  }
  o.geometry.dispose();o.geometry=k.geometry(points.flatMap(v=>v.toArray()),faces.flat());
 }
 if(balloons){
  const hood=outline(s.ellipsoid('BalloonPilotHoodSolid',[318,365,.02],[112,94,.43],'#44b5de'),s,.018);hood.userData.artworkFacingFade=[.10,.40];
  const hoodTop=s.ellipsoid('BalloonUpperHoodSolid',[318,297,0],[69,59,.12],'#44b5de');hoodTop.userData.skipOriginalPaint=true;
  const cluster=[[325,130,66,70,'#55c8e4',-.27],[217,173,66,78,'#ab61bf',-.23],[423,179,69,76,'#ffd238',-.23],[165,291,61,73,'#ffd633',-.11],[475,289,61,76,'#de62ac',-.13],[205,242,68,79,'#83c833',.055],[305,197,68,78,'#f63840',.10],[423,241,67,78,'#32abe4',.065]];
  for(const[i,[x,y,rx,ry,color,z]]of cluster.entries()){
   const o=outline(s.ellipsoid('HeldBalloon'+i+'Solid',[x,y,z],[rx,ry,.32],color),s,.018);o.userData.artworkFacingFade=[.52,.80];o.userData.artworkExcludedRegions=[{cx:318,cy:363,rx:113,ry:96}];
   // Keep the source illustration on the frontal surface; the individual
   // balloon color continues around the side without neighboring paint bleed.
   const v=o.geometry.attributes.position,C=[];for(let j=0;j<v.count;j++){const shade=Math.max(.63,Math.min(1.12,.89+.17*v.getY(j)-.11*v.getX(j)));C.push(shade,shade,shade);}o.geometry.setAttribute('color',new T.Float32BufferAttribute(C,3));o.material.userData.preserveVertexColor=true;o.material.userData.alreadyShaded=true;
   const knot=outline(s.ellipsoid('HeldBalloonKnot'+i+'Solid',[x,y+ry+3,z],[10,7,.055],color),s,.009);knot.userData.skipOriginalPaint=true;
   const side=x<320?-1:1,hand=[side<0?213:425,418,.16],mid=[320+side*101,Math.max(y+ry+15,350),-.16];
   const cord=plainTube(s,'HeldBalloonCord'+i,[[x,y+ry+5,z],mid,hand,[320+side*73,507,-.04]],.007,'#874726');cord.userData.balloon=i;cord.userData.hand=side<0?'BalloonPalmSolid-1':'BalloonPalmSolid1';
  }
  const t=part('Torso',[320,473]);outline(volume(t,'BalloonShortSuitSolid',[[273,437],[318,433],[366,438],[381,473],[377,512],[359,543],[335,553],[305,553],[281,542],[264,513],[257,477]],[320,494],.28,.28,'#38b5e6'),t,.013);t.paint();
  for(const side of [-1,1]){
   const a=part(side<0?'LeftArm':'RightArm',[320+side*50,457]);
   outline(a.sweep('BalloonSleeveSolid'+side,[[320+side*50,457,0,20],[320+side*77,446,.025,21],[320+side*94,433,.07,18]],'#38b5e6'),a,.012);
   outline(a.ellipsoid('BalloonCuffSolid'+side,[320+side*94,433,.09],[20,16,.14],'#fa6153',side*-.60),a,.011);
   outline(a.ellipsoid('BalloonPalmSolid'+side,[side<0?213:425,418,.16],[14,19,.105],'#ffd1a0',side*-.2),a,.010);a.paint();
   const l=part(side<0?'LeftLeg':'RightLeg',[320+side*29,540]),mirror=ps=>ps.map(([x,y])=>[side<0?x:640-x,y]);
   outline(volume(l,'BalloonBlueLegSolid'+side,mirror([[270,526],[308,531],[310,550],[305,568],[279,567],[270,553]]),[320+side*29,548],.16,.16,'#38b5e6'),l,.011);
   outline(volume(l,'BalloonRedBootSolid'+side,mirror([[280,556],[307,557],[315,566],[313,575],[299,581],[279,580],[267,574],[267,565]]),[320+side*29,569],.18,.18,'#fa6153',.035,32),l,.012);l.paint();
  }
  s.paint();fadeOuter(s,hood,318,365,112,94);
  for(const[i,[x,y,rx,ry]]of cluster.entries())fadeOuter(s,s.parent.getObjectByName('HeldBalloon'+i+'Solid'),x,y,rx*.95,ry*.95);
 }else{
  const ps=[[282,164],[341,175],[389,204],[413,246],[420,289],[411,328],[397,361],[400,397],[407,436],[402,477],[381,505],[344,524],[298,532],[254,533],[210,516],[170,486],[158,446],[174,395],[174,365],[158,330],[147,291],[149,254],[165,218],[190,193],[227,176]];
  const costume=outline(s.smoothOutline('GuitarCostumeSolid',ps,.38,'#efb777',0,.035),s,.014);costume.userData.artworkFacingFade=[.16,.47];
  const neck=outline(s.box('GuitarUpperNeckSolid',[282,170,.10],[43,112,.20],'#bb783d',3),s,.009);
  const stock=outline(s.smoothOutline('GuitarUpperHeadstockSolid',[[248,65],[278,61],[313,66],[309,104],[300,132],[264,132],[254,106]],.23,'#f5c58d',.10,.015),s,.012);
  for(const side of [-1,1])for(let j=0;j<3;j++)outline(s.ellipsoid('UpperTuningPeg'+side+'_'+j,[282+side*38,80+j*19,.12],[8,7,.10],'#b5723b'),s,.008);
  // The held instrument has a real sound-hole cavity, rather than a black
  // circle suspended in front of a featureless solid slab.
  const held=[[208,402],[178,405],[147,434],[131,476],[137,518],[158,550],[188,571],[222,573],[255,554],[280,527],[293,509],[327,499],[345,477],[345,444],[338,419],[312,393],[281,388],[251,405],[230,418]],curve=new T.CatmullRomCurve3(held.map(([x,y])=>new T.Vector3(x,y,0)),true,'centripetal'),shape=new T.Shape();
  curve.getSpacedPoints(96).slice(0,96).forEach((p,i)=>i?shape.lineTo((p.x-320)*.005,(580-p.y)*.005):shape.moveTo((p.x-320)*.005,(580-p.y)*.005));shape.closePath();
  const hole=new T.Path();hole.absellipse((270-320)*.005,(580-459)*.005,31*.005,29*.005,0,Math.PI*2,true,0);shape.holes.push(hole);
  const g=new T.ExtrudeGeometry(shape,{depth:.23,bevelEnabled:true,bevelThickness:.012,bevelSize:.008,bevelSegments:3,curveSegments:32,steps:1});g.translate(0,0,.30);
  const heldBody=outline(s.mesh('HeldGuitarBodySolid',g,'#efb673'),s,.012);heldBody.userData.artworkFacingFade=[.16,.46];
  const cavity=s.ellipsoid('HeldSoundHoleCavity',[270,459,.305],[31,29,.018],'#482619');cavity.userData.skipOriginalPaint=true;
  const fret=outline(s.outline('HeldGuitarNeckSolid',[[257,451],[446,354],[463,382],[274,478]],.15,'#b8783f',.45,.010),s,.008);fret.userData.skipOriginalPaint=true;
  const heldStock=outline(s.outline('HeldGuitarHeadstockSolid',[[440,352],[481,336],[489,340],[507,375],[504,383],[463,399],[456,393]],.17,'#f4ca91',.45,.012),s,.009);heldStock.userData.skipOriginalPaint=true;
  const bridge=outline(s.outline('HeldGuitarBridgeSolid',[[189,466],[202,460],[226,510],[212,517]],.055,'#935127',.565,.006),s,.007);bridge.userData.skipOriginalPaint=true;
  const nut=s.box('HeldGuitarNutSolid',[472,364,.542],[4,22,.020],'#fbe7ba',.5);nut.userData.skipOriginalPaint=true;
  for(let i=0;i<6;i++)plainTube(s,'HeldGuitarString'+i,[[204,487+(i-2.5)*3,.594],[270,455+(i-2.5)*3,.60],[472,364+(i-2.5)*3,.554]],.0023,'#fff2ca');
  for(const side of [-1,1])for(let j=0;j<3;j++){
   const u=(j-1)*14,x=475+.894*u+side*.447*9,y=368-.447*u+side*.894*9,o=s.ellipsoid('HeldHeadstockPeg'+side+'_'+j,[x,y,.55],[4.5,4.5,.012],'#96522e');o.userData.skipOriginalPaint=true;
   const peg=outline(s.ellipsoid('HeldOuterTuningPeg'+side+'_'+j,[475+.894*u+side*.447*24,368-.447*u+side*.894*24,.45],[5.5,5.5,.07],'#a56c3c'),s,.006);peg.userData.skipOriginalPaint=true;
  }
  for(const name of ['Torso','LeftArm','RightArm']){const p=parts.get(name);if(p){k.body.remove(p.group);parts.delete(name);}}
  outline(volume(s,'GuitarStrummingArmSolid',[[206,390],[195,414],[195,439],[207,459],[225,471],[240,470],[246,461],[237,449],[226,439],[226,418],[230,399]],[217,435],.09,.09,'#f4be7f',.57,48),s,.012);
  outline(volume(s,'GuitarFrettingArmSolid',[[356,427],[369,420],[378,409],[390,405],[402,412],[402,428],[393,443],[377,451],[361,447],[350,438]],[378,429],.09,.09,'#f4be7f',.57,40),s,.012);
  for(const name of ['GuitarStrummingArmSolid','GuitarFrettingArmSolid']){const o=s.parent.getObjectByName(name),p=o.geometry.attributes.position;for(let i=0;i<p.count;i++){const x=p.getX(i)/.005+s.pivot[0],y=s.pivot[1]-p.getY(i)/.005,t=Math.max(0,Math.min(1,name==='GuitarStrummingArmSolid'?(y-390)/64:(x-350)/44));p.setZ(i,p.getZ(i)-.57+.16+.41*t);}o.geometry.computeVertexNormals();}
  for(const[side,pivot,points,center]of [[-1,[260,532],[[243,523],[274,526],[278,549],[272,570],[260,579],[243,577],[236,570],[242,552]],[258,553]],[1,[319,523],[[302,512],[339,515],[334,541],[334,554],[343,568],[337,578],[322,578],[305,570],[298,552]],[320,549]]]){
   const l=part(side<0?'LeftLeg':'RightLeg',pivot);outline(volume(l,'GuitarWearerFootSolid'+side,points,center,.17,.17,'#eeb576'),l,.014);l.paint();
  }
  refineSurface(costume);refineSurface(heldBody);
  const cp=costume.geometry.attributes.position,colors=[],front=new T.Color('#efb777').convertSRGBToLinear(),edgeColor=new T.Color('#b77a42').convertSRGBToLinear(),rear=new T.Color('#d99c5c').convertSRGBToLinear();for(let i=0;i<cp.count;i++){const z=cp.getZ(i)+s.offset.z,c=z>.15?front:z<-.15?rear:edgeColor;colors.push(c.r,c.g,c.b);}costume.geometry.setAttribute('color',new T.Float32BufferAttribute(colors,3));costume.material.color.set(0xffffff);costume.material.userData.preserveVertexColor=true;
  for(const side of [-1,1])plainTube(s,'GuitarBodyBinding'+side,[...ps,ps[0]].map(([x,y])=>[x,y,side*.181]),.011,'#f9d6a0');
  s.paint();
  const art=s.parent.getObjectByName('GuitarCostumeSolidOriginalPaint');if(art){const p=art.geometry.attributes.position,C=art.geometry.attributes.color;for(let i=0;i<p.count;i++){const y=s.pivot[1]-p.getY(i)/.005;C.setW(i,C.getW(i)*Math.max(0,Math.min(1,(410-y)/22)));}}
 }
 finishOutlines();head.special=true;head.skipNeckJoin=true;head.lockToBody=true;head.authoredFamily='held-theme';return true;
};
