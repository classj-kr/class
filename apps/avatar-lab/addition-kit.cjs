"use strict";
module.exports=function(T,id){
 const k=require('./model-kit.cjs')(T,id),parts=[],inks=[];
 function part(name,pivot=[320,580],z=0){
  const group=k.group(name,pivot,z),entry={group,part:{pivot}};
  group.userData.artworkOcclusion=true;
  const s=require('./sculpt-kit.cjs')(T,k,entry);
  function volume(name,ps,center,depth,color,back=depth,z=0){
   const span=Math.max(...ps.map(p=>Math.hypot(p[0]-center[0],p[1]-center[1]))),small=span<60;
   k.volume(name,ps,center,pivot,depth,back,group,k.solid(name+'Color',color),{art:false,samples:small?48:96,z});
   require('./smooth-paired-volume.cjs')(T,k,group,name,{rings:small?12:24,contourPasses:name==='Heart'?0:4});
   const P=[],I=[],N=[];
   for(const end of ['Surface','Back']){const o=group.getObjectByName(name+end),n=P.length/3;P.push(...o.geometry.attributes.position.array);N.push(...o.geometry.attributes.normal.array);I.push(...Array.from(o.geometry.index.array,i=>i+n));group.remove(o);}
   const g=k.geometry(P,I),joined=new Map(),keys=[];
   for(let i=0;i<P.length;i+=3){const key=P.slice(i,i+3).map(v=>Math.round(v*1e5)).join(',');keys.push(key);if(!joined.has(key))joined.set(key,new T.Vector3());joined.get(key).add(new T.Vector3(N[i],N[i+1],N[i+2]));}
   for(const v of joined.values())v.normalize();for(let i=0;i<keys.length;i++)joined.get(keys[i]).toArray(N,i*3);g.setAttribute('normal',new T.Float32BufferAttribute(N,3));
   const o=k.mesh(name+'Solid',g,k.solid(name+'Color',color),group);o.userData.artworkFacingFade=[.25,.60];return o;
  }
  const ellipse=(name,c,r,depth,color,z=0)=>volume(name,k.ellipse(...c,...r,40),c,depth,color,depth,z);
  const ink=(o,color='#634739',width=.009)=>{inks.push([o,color,width]);return o;};
  const face=(cx,cy,rx,ry)=>{group.userData.artworkOpaqueRegions=[{cx,cy,rx,ry}];};
  const skip=o=>{o.userData.skipOriginalPaint=true;return o;};
  const tool={...s,group,pivot,volume,ellipse,ink,face,skip};parts.push(tool);return tool;
 }
 function suit({cx=320,top=447,hip=533,bottom=575,width=94,color='#eeeeee',armColor=color,footColor=color,depth=.26}){
  const centerY=(top+hip)/2;
  const b=part('Torso',[cx,top],-.08);b.ellipse('Torso',[cx,centerY],[width/2,(hip-top)/2+12],depth,color);
  for(const [label,sign]of [['Left',-1],['Right',1]]){
   const x=cx+sign*(width/2-5),a=part(label+'Arm',[x,top+12],0);
   a.volume(label+'Sleeve',[[x-sign*10,top+4],[x+sign*12,top+10],[x+sign*27,hip-20],[x+sign*22,hip-6],[x+sign*5,hip-8],[x-sign*5,top+32]],[x+sign*7,(top+hip)/2],.12,armColor);
   const fx=cx+sign*width*.24,l=part(label+'Leg',[fx,hip-8],0);
   l.volume(label+'Boot',[[fx-19,hip-18],[fx+19,hip-18],[fx+21,bottom-12],[fx+14,bottom],[fx-14,bottom],[fx-22,bottom-10]],[fx,(hip+bottom)/2-6],.17,footColor);
  }
  return b;
 }
 function colorize(mesh,fn){const p=mesh.geometry.attributes.position,C=[];for(let i=0;i<p.count;i++){const c=new T.Color(fn(p.getX(i),p.getY(i),p.getZ(i))).convertSRGBToLinear();C.push(c.r,c.g,c.b);}mesh.geometry.setAttribute('color',new T.Float32BufferAttribute(C,3));mesh.material.color.set(0xffffff);mesh.material.userData.preserveVertexColor=true;}
 function finish(profile,effects=[]){
  for(const p of parts)require('./project-model-artwork.cjs')(T,k,p.group,p.pivot);
  for(const [o,c,w]of inks)require('./solid-ink-shell.cjs')(T,k,o,c,w);
  let result;
  if(profile.motion==='walk')result=k.finish({waveAngle:.18,waveAmplitude:.06,holdLeft:true,holdRight:true});
  else{
   const clips=[];for(const name of ['Idle','Walk','Wave']){const times=[],P=[],Q=[];for(let i=0;i<=48;i++){const t=i/48,a=t*Math.PI*2;times.push(t*1.8);const lift=profile.motion==='float'?.08+.035*Math.sin(a):profile.motion==='hop'&&name!=='Idle'?.09*Math.sin(a/2)**2:.008*(1-Math.cos(a));P.push(0,lift,0);Q.push(...new T.Quaternion().setFromEuler(new T.Euler(0,0,Math.sin(a)*.012)).toArray());}clips.push(new T.AnimationClip(name,1.8,[new T.VectorKeyframeTrack('Body.position',times,P),new T.QuaternionKeyframeTrack('Body.quaternion',times,Q)]));}
   k.root.updateMatrixWorld(true);k.root.position.y-=new T.Box3().setFromObject(k.root).min.y;
   require('./illustration-materials.cjs')(T,k.root);result={root:k.root,clips};
  }
  if(effects.length){result.clips.push(new T.AnimationClip('CharacterEffects',3,effects));result.root.userData.effectClip='CharacterEffects';}
  Object.assign(result.root.userData,{avatarKey:id+'.webp',collection:true,locomotion:profile.motion,canWave:false,walkStride:profile.motion==='walk'?.36:.4,authoring:'Individually measured solids and original artwork; no alpha inflation'});
  return result;
 }
 return {k,part,suit,colorize,finish};
};
