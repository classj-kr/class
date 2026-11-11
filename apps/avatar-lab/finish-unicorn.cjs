"use strict";
module.exports=function(T,k,id,parts){
 if(id!=='animal-unicorn')return;
 const head=parts.get('Head'),smooth=require('./smooth-paired-volume.cjs');
 for(const name of ['MeasuredCostumeHood','UnicornEar-1','UnicornEar1'])smooth(T,k,head.group,name);
 const tail=parts.get('Tail');tail.group.clear();
 const tool=require('./sculpt-kit.cjs')(T,k,tail);
 const mesh=tool.sweep('FlowingUnicornTailSolid',[[365,490,-.08,12],[397,484,-.14,24],[416,516,-.15,22],[435,542,-.14,23],[460,544,-.13,13],[475,529,-.12,.8]],'#78c9da');
 const p=mesh.geometry.attributes.position,C=[],pink=new T.Color('#f092b2').convertSRGBToLinear(),blue=new T.Color('#78c9da').convertSRGBToLinear();
 for(let i=0;i<p.count;i++){const angle=(i%16)/16*Math.PI*2,t=Math.max(0,Math.min(1,(Math.cos(angle)-.05)/.40));C.push(...blue.clone().lerp(pink,t).toArray());}
 mesh.geometry.setAttribute('color',new T.Float32BufferAttribute(C,3));mesh.material.color.set(0xffffff);mesh.material.userData.preserveVertexColor=true;mesh.userData.skipOriginalPaint=true;
 for(const o of [...head.group.children])if(o.name.startsWith('UnicornHorn'))head.group.remove(o);
 const hs=require('./sculpt-kit.cjs')(T,k,head),horn=k.mesh('UnicornHornSolid',new T.LatheGeometry([[0,0],[.12,0],[.125,.035],[.118,.14],[.10,.26],[.077,.38],[.052,.48],[.033,.535],[0,.555]].map(([r,y])=>new T.Vector2(r,y)),48),k.solid('UnicornHornColor','#edbc50'),head.group,hs.point([315,171,.24]));horn.userData.skipOriginalPaint=true;
 const spiral=[];for(let i=0;i<=112;i++){const t=i/112,a=-Math.PI/2+t*Math.PI*6,h=t*.535,profile=[[.12,0],[.125,.035],[.118,.14],[.10,.26],[.077,.38],[.052,.48],[.033,.535]],j=Math.min(profile.length-2,profile.findIndex((v,j)=>j<profile.length-1&&h<=profile[j+1][1])),u=(h-profile[j][1])/(profile[j+1][1]-profile[j][1]),r=profile[j][0]*(1-u)+profile[j+1][0]*u+.003;spiral.push([315+Math.cos(a)*r/.005,171-t*107,.24+Math.sin(a)*r]);}
 hs.tube('UnicornHornSpiral',spiral,.007,'#c28b32').userData.skipOriginalPaint=true;
 for(const name of ['LeftArm','RightArm','LeftLeg','RightLeg'])for(const mesh of parts.get(name).group.children.filter(o=>o.isMesh&&!o.material.userData.originalTexture))mesh.userData.skipOriginalPaint=true;
 // Concave forelocks need constrained triangles: a radial fan crosses the
 // inward curl and folds over itself. Fit each watertight lock in layers.
 for(const o of [...head.group.children])if(o.name.startsWith('UnicornMane'))head.group.remove(o);
 const supports=[head.group.getObjectByName('MeasuredCostumeHoodSurface')];
 const locks=[['UnicornManeBlueSolid',[[302,156],[341,154],[370,163],[389,185],[396,207],[407,225],[419,230],[412,242],[393,248],[372,242],[351,228],[330,196]],'#77cbdc'],['UnicornManePinkSolid',[[302,156],[273,160],[251,175],[242,194],[244,212],[255,230],[278,243],[303,255],[315,266],[314,279],[332,270],[347,251],[355,230],[354,211],[345,188],[326,169]],'#f299b8']];
 for(const [name,shape,color]of locks){
  const lock=require('./rounded-contour-solid.cjs')(T,k,hs,name,shape,{front:.065,back:.035,color,rounding:15,samples:96}),p=lock.geometry.attributes.position;
  k.root.updateMatrixWorld(true);
  for(let i=0;i<p.count;i++){
   const origin=head.group.localToWorld(new T.Vector3(p.getX(i),p.getY(i),3)),hit=new T.Raycaster(origin,new T.Vector3(0,0,-1)).intersectObjects(supports)[0];
   const base=hit?head.group.worldToLocal(hit.point.clone()).z:0;p.setZ(i,p.getZ(i)+base-.006);
  }lock.geometry.computeVertexNormals();supports.push(lock);
 }
};
