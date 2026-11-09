"use strict";
module.exports=function flightCostumes(T,id){
 const k=require('./model-kit.cjs')(T,id),head=k.group('Head',[320,580]),sculpt=require('./sculpt-kit.cjs'),s=sculpt(T,k,{group:head,part:{pivot:[320,580]}}),shells=[];
 head.userData.directSurfaceArtwork=true;head.userData.artworkOcclusion=true;
 function volume(tool,name,ps,c,depth,color,z=0){k.volume(name+'Half',ps,c,tool.pivot,depth,depth,tool.parent,k.solid(name+'Color',color),{art:false,samples:88,z:z-tool.offset.z});const P=[],I=[];for(const suffix of ['Surface','Back']){const o=tool.parent.getObjectByName(name+'Half'+suffix),n=P.length/3;P.push(...o.geometry.attributes.position.array);I.push(...Array.from(o.geometry.index.array,j=>j+n));tool.parent.remove(o);}const o=k.mesh(name,k.geometry(P,I),k.solid(name+'Color',color),tool.parent);o.userData.artworkFacingFade=[.15,.48];return o;}
 if(id==='vehicle-rocket'){
  head.userData.artworkOpaqueRegions=[{cx:319,cy:291,rx:108,ry:85}];
  const hull=s.lathe('RocketContinuousHullSolid',[[505,0],[505,65],[499,83],[484,96],[452,110],[437,115],[383,132],[320,144],[267,141],[214,127],[166,103],[149,93],[116,68],[85,37],[65,9],[63,0]],'#ffffff',0,{levels:144,segments:80});
  // The cap and blue belts are colors on one closed body, so there cannot be
  // a gap between a separate nose, hull or bottom band during export.
  const hp=hull.geometry.attributes.position,colors=[];
  for(let i=0;i<hp.count;i++){const y=580-hp.getY(i)/.005,c=new T.Color(y<155?'#e92e32':y>478?'#2d65ad':y>445?'#62baf0':'#f1eaf1').convertSRGBToLinear();colors.push(c.r,c.g,c.b);}
  hull.geometry.setAttribute('color',new T.Float32BufferAttribute(colors,3));hull.material.userData.preserveVertexColor=true;hull.userData.artworkFacingFade=[.18,.52];hull.userData.artworkHorizontalNormal=true;shells.push([hull,s,'#793a30',.011]);
  for(const side of [-1,1]){
   const ps=[[436,356],[460,378],[480,410],[491,444],[491,471],[482,495],[474,507],[464,497],[453,478],[438,461],[423,452]].map(([x,y])=>[320+side*(x-320),y]);
   const fin=require('./rounded-contour-solid.cjs')(T,k,s,'RocketSideFin'+side+'Solid',ps,{front:.10,back:.10,color:'#e92f32',rounding:16});fin.userData.artworkFacingFade=[.15,.50];shells.push([fin,s,'#8e2926',.012]);
  }
  const finOutline=[[320,395],[333,408],[344,441],[346,474],[339,504],[329,526],[320,537],[310,524],[299,500],[292,471],[293,441],[303,410]];
  for(const side of [-1,1]){const fin=volume(s,'RocketAxialFin'+side+'Solid',finOutline,[320,465],.16,'#e82b30',side*.48);const p=fin.geometry.attributes.position;for(let i=0;i<p.count;i++){const y=580-p.getY(i)/.005,t=Math.max(0,Math.min(1,(y-395)/142));p.setZ(i,p.getZ(i)+side*.26*Math.sin(t*Math.PI));}fin.geometry.computeVertexNormals();if(side<0)fin.userData.skipOriginalPaint=true;shells.push([fin,s,'#8e2926',.012]);}
  s.paint();
  const exhaust=k.group('RocketExhaust',[320,500]),f=sculpt(T,k,{group:exhaust,part:{pivot:[320,500]}});exhaust.userData.directSurfaceArtwork=true;
  const flame=volume(f,'RocketFlameSolid',[[272,494],[367,494],[375,519],[371,544],[358,564],[342,571],[320,588],[300,577],[286,567],[272,552],[264,529]],[320,535],.23,'#ff9c20');flame.userData.artworkFacingFade=[.15,.48];f.paint();shells.push([flame,f,'#d26613',.010]);
  // Warm yellow core continues on the back of the actual flame volume.
  flame.updateWorldMatrix(true,false);const ps=[[320,511],[345,526],[339,548],[320,574],[303,551],[296,529]],curve=new T.CatmullRomCurve3(ps.map(([x,y])=>new T.Vector3(x,y,0)),true,'centripetal'),edge=curve.getSpacedPoints(48).slice(0,48),P=[],I=[];
  for(let r=0;r<=8;r++)for(const e of edge){const x=320+(e.x-320)*r/8,y=537+(e.y-537)*r/8,hit=new T.Raycaster(new T.Vector3((x-320)*.005,(580-y)*.005,-3),new T.Vector3(0,0,1)).intersectObject(flame)[0];if(!hit)throw new Error('Rocket flame core outside support');const v=exhaust.worldToLocal(hit.point.clone());P.push(v.x,v.y,v.z-.004);}
  for(let r=0;r<8;r++)for(let i=0;i<48;i++){const a=r*48+i,b=r*48+(i+1)%48,c=a+48,d=b+48;if(r)I.push(a,b,d);I.push(a,d,c);}const g=k.geometry(P,I);if(g.attributes.normal.getZ(100)>0){for(let i=0;i<I.length;i+=3)[I[i+1],I[i+2]]=[I[i+2],I[i+1]];g.setIndex(I);g.computeVertexNormals();}k.mesh('RocketRearFlameCore',g,k.solid('RocketCoreYellow','#ffcf36'),exhaust);
 }

 if(id==='vehicle-hot-air-balloon'){
  head.userData.artworkOpaqueRegions=[{cx:319,cy:300,rx:105,ry:82}];
  const profile=[[440,0],[440,65],[430,72],[410,85],[380,112],[340,145],[290,175],[245,188],[210,185],[165,169],[126,141],[95,103],[72,63],[59,12],[58,0]],curve=new T.CatmullRomCurve3(profile.map(([y,r])=>new T.Vector3(r*.005,(580-y)*.005,0))),levels=curve.getPoints(128),P=[],I=[],C=[];
  // Duplicate only panel seams: each colored gore has a clean boundary, while
  // neighboring gores have identical positions and form one welded closed hull.
  for(let panel=0;panel<8;panel++){const c=new T.Color(panel%2?'#fff0d8':'#df263e').convertSRGBToLinear(),start=P.length/3;
   for(const v of levels)for(let j=0;j<=12;j++){const a=(panel-.5+j/12)*Math.PI/4,r=Math.max(0,v.x);P.push(Math.sin(a)*r,v.y,Math.cos(a)*r);C.push(c.r,c.g,c.b);}
   for(let row=0;row<128;row++)for(let j=0;j<12;j++){const a=start+row*13+j,b=a+1,c=a+13,d=c+1;I.push(a,b,d,a,d,c);}
  }
  const envelope=k.mesh('BalloonEnvelopeSolid',k.geometry(P,I),k.solid('BalloonPanels','#ffffff'),head);envelope.geometry.setAttribute('color',new T.Float32BufferAttribute(C,3));envelope.material.userData.preserveVertexColor=true;envelope.userData.artworkFacingFade=[.15,.50];envelope.userData.artworkHorizontalNormal=true;shells.push([envelope,s,'#6c2d28',.017]);
  const neck=s.lathe('BalloonShortNeckSolid',[[482,0],[482,60],[473,63],[449,68],[430,74],[426,68],[426,0]],'#e9a641',0,{levels:40,segments:64});shells.push([neck,s,'#71331c',.014]);
  const basket=s.lathe('BalloonBasketSolid',[[551,0],[550,35],[546,51],[532,60],[510,68],[488,73],[476,73],[473,65],[473,0]],'#c5813a',0,{levels:56,segments:64});shells.push([basket,s,'#71331c',.016]);
  const rim=s.torus('BalloonBasketRim',[320,479,0],.355,.042,'#e6a34e');rim.rotation.x=Math.PI/2;shells.push([rim,s,'#71331c',.014]);
  s.paint();
  // Continue the panel seams and basket weave over the unseen surfaces.
  for(let j=0;j<8;j++){const a=(j+.5)*Math.PI/4,ps=levels.slice(3,-3).map(v=>[320+Math.sin(a)*Math.max(0,v.x)/.005,580-v.y/.005,Math.cos(a)*(Math.max(0,v.x)+.003)]);if(Math.cos(a)<.45)s.tube('BalloonPanelSeam'+j,ps,.005,'#8c3d36');}
  basket.updateWorldMatrix(true,false);
  for(let band=0;band<12;band++)for(const direction of [-1,1]){const ps=[];for(let j=0;j<=24;j++){const t=j/24,y=494+t*48,a=band/12*Math.PI*2+direction*t*.48;
    // Ray fit the woven lines onto the actual tapered basket wall.
    if(Math.cos(a)>.38)continue;const origin=new T.Vector3(Math.sin(a)*2,(580-y)*.005,Math.cos(a)*2),ray=new T.Raycaster(origin,new T.Vector3(-Math.sin(a),0,-Math.cos(a))),hit=ray.intersectObject(basket)[0];if(hit)ps.push([320+hit.point.x/.005,580-hit.point.y/.005,hit.point.z+Math.cos(a)*.003]);
   }if(ps.length>2)s.tube('BalloonBasketWeave'+band+'_'+direction,ps,.004,'#976033');}
  for(const side of [-1,1]){
   const arm=k.group(side<0?'LeftArm':'RightArm',[320+side*79,461]),a=sculpt(T,k,{group:arm,part:{pivot:[320+side*79,461]}});arm.userData.directSurfaceArtwork=true;
   const mitten=volume(a,'BalloonMitten'+side+'Solid',[[242,452],[253,460],[257,476],[253,496],[240,506],[226,502],[219,489],[221,474],[230,458]].map(([x,y])=>[320+(-side)*(x-320),y]),[320+side*81,479],.12,'#a85b36');a.paint();shells.push([mitten,a,'#71331c',.014]);
   const leg=k.group(side<0?'LeftLeg':'RightLeg',[320+side*28,543]),f=sculpt(T,k,{group:leg,part:{pivot:[320+side*28,543]}});leg.userData.directSurfaceArtwork=true;
   const boot=volume(f,'BalloonBoot'+side+'Solid',[[276,537],[313,539],[312,558],[307,573],[294,579],[273,577],[264,571],[266,561],[274,554]].map(([x,y])=>[320+(-side)*(x-320),y]),[320+side*29,560],.16,'#bd763c');f.paint();shells.push([boot,f,'#71331c',.014]);
  }
 }
 for(const[o,tool,color,width]of shells){o.updateMatrix();const g=o.geometry.clone().applyMatrix4(o.matrix),p=g.attributes.position,b=new T.Box3().setFromBufferAttribute(p),c=b.getCenter(new T.Vector3()),f=1+width/(b.getSize(new T.Vector3()).length()/2),ix=g.index?Array.from(g.index.array):Array.from({length:p.count},(_,i)=>i);for(let i=0;i<p.count;i++)p.setXYZ(i,c.x+(p.getX(i)-c.x)*f,c.y+(p.getY(i)-c.y)*f,c.z+(p.getZ(i)-c.z)*f);for(let i=0;i<ix.length;i+=3)[ix[i+1],ix[i+2]]=[ix[i+2],ix[i+1]];g.setIndex(ix);g.computeVertexNormals();const ink=k.mesh(o.name+'InkShell',g,k.solid(o.name+'Ink',color),tool.parent);ink.material.userData.alreadyShaded=true;}

 if(id==='vehicle-hot-air-balloon'){
  const result=k.finish({holdLeft:true,holdRight:true,authoring:'Source-shaped striped balloon, connected short collar, rounded basket, small mittens and grounded boots'});
  // The envelope, collar and basket are a connected costume, so no separate
  // neck counter-rotation or waving mitten may open a gap during locomotion.
  for(const clip of result.clips)for(const track of clip.tracks)if(['Head.quaternion','LeftArm.quaternion','RightArm.quaternion'].includes(track.name))for(let i=0;i<track.values.length;i+=4)track.values.set([0,0,0,1],i);
  Object.assign(result.root.userData,{locomotion:'walk',canWave:false});return result;
 }
 const clips=[],times=Array.from({length:49},(_,i)=>i/48*2);
 for(const name of ['Idle','Walk','Wave']){const pos=[],scale=[];for(let i=0;i<49;i++){const a=i/48*Math.PI*2;pos.push(0,.04+.025*(1-Math.cos(a)),0);scale.push(1+.025*Math.sin(a*4),1+.07*Math.sin(a*4),1+.025*Math.sin(a*4));}clips.push(new T.AnimationClip(name,2,[new T.VectorKeyframeTrack('Body.position',times,pos),new T.VectorKeyframeTrack('RocketExhaust.scale',times,scale)]));}
 k.root.updateMatrixWorld(true);k.root.position.y-=new T.Box3().setFromObject(k.root).min.y;require('./illustration-materials.cjs')(T,k.root);Object.assign(k.root.userData,{avatarKey:id+'.webp',prototype:true,locomotion:'float',canWave:false,walkStride:.55,walkDuration:2,authoring:'Continuous source-shaped rocket hull, connected radial fins and pulsing three-dimensional exhaust'});return{root:k.root,clips};
};
