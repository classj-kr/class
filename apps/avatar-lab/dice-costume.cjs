"use strict";
module.exports=function diceCostume(T,k,id,parts){
 if(id!=='game-dice')return false;
 const head=parts.get('Head'),sculpt=require('./sculpt-kit.cjs'),s=sculpt(T,k,head),ink='#494b58';
 for(const[name,p]of parts)if(name!=='Head'){k.body.remove(p.group);parts.delete(name);}
 s.parent.clear();s.parent.userData.directSurfaceArtwork=true;s.parent.userData.artworkOcclusion=false;
 s.parent.userData.artworkOpaqueRegions=[{cx:260,cy:307,rx:108,ry:89}];
 // Three real, rounded faces follow the illustration's slightly stylized
 // perspective. The artwork is on these surfaces, not on a square billboard.
 const A=new T.Vector3(1.39,-.10,.50),B=new T.Vector3(0,1.27,.46),C=new T.Vector3(-.54,-.50,1.40),center=new T.Vector3(0,1.62,0);
 const map=v=>center.clone().addScaledVector(A,v.x).addScaledVector(B,v.y).addScaledVector(C,v.z);
 const geometry=new T.BoxGeometry(1,1,1,48,48,48),p=geometry.attributes.position,round=.085;
 for(let i=0;i<p.count;i++){const v=new T.Vector3().fromBufferAttribute(p,i),q=v.clone().clampScalar(-.5+round,.5-round),n=v.clone().sub(q).normalize();v.copy(q).addScaledVector(n,round);p.setXYZ(i,...map(v).sub(s.offset).toArray());}
 geometry.computeVertexNormals();
 // Shared edge shading is averaged after the affine transform.
 const buckets=new Map(),norm=geometry.attributes.normal;
 for(let i=0;i<p.count;i++){const key=[p.getX(i),p.getY(i),p.getZ(i)].map(v=>Math.round(v*1e5)).join(',');if(!buckets.has(key))buckets.set(key,[]);buckets.get(key).push(i);}
 for(const indices of buckets.values()){const n=new T.Vector3();for(const i of indices)n.add(new T.Vector3().fromBufferAttribute(norm,i));n.normalize();for(const i of indices)norm.setXYZ(i,n.x,n.y,n.z);}
 const cube=k.mesh('DiceRoundedCubeSolid',geometry,k.solid('DiceIvory','#f1f2f4'),s.parent);cube.userData.artworkFacingFade=[.10,.26];
 // Hidden faces complete opposite sums of seven: front is the face/one,
 // rear six, right four/left three, top five/bottom two.
 const patterns={2:[[-.22,-.22],[.22,.22]],3:[[-.23,-.23],[0,0],[.23,.23]],6:[[-.23,-.25],[-.23,0],[-.23,.25],[.23,-.25],[.23,0],[.23,.25]]};
 for(const [side,n]of [['rear',6],['left',3],['bottom',2]])for(const [j,[a,b]]of patterns[n].entries()){
  const uv=side==='rear'?new T.Vector3(-a,b,-.5):side==='left'?new T.Vector3(-.5,b,a):new T.Vector3(a,-.5,b),du=side==='rear'?A.clone().negate():side==='left'?C:A,dv=side==='bottom'?C:B,normal=new T.Vector3().crossVectors(du,dv).normalize(),P=[],I=[],r=.061;
  for(let ring=0;ring<=4;ring++)for(let i=0;i<32;i++){const t=i/32*Math.PI*2,q=map(uv).addScaledVector(du,Math.cos(t)*r*ring/4).addScaledVector(dv,Math.sin(t)*r*ring/4).addScaledVector(normal,.002).sub(s.offset);P.push(...q.toArray());}
  for(let ring=0;ring<4;ring++)for(let i=0;i<32;i++){const a=ring*32+i,b=ring*32+(i+1)%32,c=a+32,d=b+32;if(ring)I.push(a,d,b);I.push(a,c,d);}
  const o=k.mesh('DicePip'+side+j,k.geometry(P,I),k.solid('DicePipInk','#39383f'),s.parent);o.userData.skipOriginalPaint=true;
 }
 // The inverted outline shares the rounded cube's actual silhouette.
 const outline=k.mesh('DiceCubeOutline',geometry.clone(),k.solid('DiceOutlineInk',ink),s.parent);outline.userData.skipOriginalPaint=true;outline.material.userData.alreadyShaded=true;
 const op=outline.geometry.attributes.position;for(let i=0;i<op.count;i++)op.setXYZ(i,op.getX(i)+norm.getX(i)*.012,op.getY(i)+norm.getY(i)*.012,op.getZ(i)+norm.getZ(i)*.012);
 const oi=outline.geometry.index.array;for(let i=0;i<oi.length;i+=3)[oi[i+1],oi[i+2]]=[oi[i+2],oi[i+1]];outline.geometry.computeVertexNormals();
 s.paint();
 function part(name,pivot){const v={part:{pivot},group:k.group(name,pivot,.50),special:true};parts.set(name,v);v.group.userData.directSurfaceArtwork=true;return sculpt(T,k,v);}
 function volume(tool,name,ps,c,depth){k.volume(name+'Half',ps,c,tool.pivot,depth,depth,tool.parent,k.solid(name+'Color','#e4e8ef'),{art:false,samples:96});require("./smooth-paired-volume.cjs")(T,k,tool.parent,name+"Half",{rings:24});const P=[],I=[];for(const suffix of ['Surface','Back']){const o=tool.parent.getObjectByName(name+'Half'+suffix),n=P.length/3;P.push(...o.geometry.attributes.position.array);I.push(...Array.from(o.geometry.index.array,i=>i+n));tool.parent.remove(o);}const mesh=k.mesh(name,k.geometry(P,I),k.solid(name+'Color','#e4e8ef'),tool.parent);mesh.userData.artworkFacingFade=[.35,.70];if(name==='DiceShortSuitSolid')mesh.userData.artworkMinY=452;else mesh.userData.skipOriginalPaint=true;return mesh;}
 const torso=part('Torso',[304,480]);volume(torso,'DiceShortSuitSolid',[[246,414],[354,419],[374,451],[373,492],[358,524],[337,534],[302,535],[271,531],[248,517],[237,483],[237,450]],[306,480],.31);torso.paint();
 for(const side of [-1,1]){
  const left=side<0,arm=part(left?'LeftArm':'RightArm',[left?245:366,439]);volume(arm,'DiceSleeve'+side+'Solid',left?[[239,429],[253,434],[242,458],[233,483],[232,499],[222,506],[209,501],[204,489],[207,465],[220,439]]:[[356,435],[372,437],[385,460],[397,485],[400,498],[390,508],[377,507],[369,495],[368,476],[360,454]],[left?227:379,472],.13);arm.paint();
  const foot=part(left?'LeftLeg':'RightLeg',[left?270:337,527]);volume(foot,'DiceFoot'+side+'Solid',left?[[248,519],[286,522],[290,540],[283,559],[280,570],[267,579],[251,577],[245,567],[252,554],[247,539]]:[[320,525],[356,521],[359,539],[354,552],[364,563],[366,570],[352,578],[338,578],[325,570],[320,552]],[left?265:342,550],.17);foot.paint();
 }
 head.special=true;head.skipNeckJoin=true;head.lockToBody=true;return true;
};
