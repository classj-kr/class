"use strict";
module.exports=function tulip(T,k,id,parts){
 if(id!=='theme-tulip')return false;
 const sculpt=require('./sculpt-kit.cjs'),head=parts.get('Head'),s=sculpt(T,k,head),shells=[],paintContours=[];
 s.parent.clear();s.parent.userData.directSurfaceArtwork=true;s.parent.userData.artworkOcclusion=true;s.parent.userData.artworkOpaqueRegions=[{cx:320,cy:296,rx:109,ry:91}];
 const pink=new T.Color('#ef6491').convertSRGBToLinear(),gold=new T.Color('#ffdf65').convertSRGBToLinear();
 const profile=[[410,.09],[404,.25],[390,.47],[370,.61],[340,.72],[300,.79],[260,.805],[220,.785],[180,.75],[140,.72],[100,.715],[60,.72]];
 function radius(y){for(let i=1;i<profile.length;i++){const[hi,a]=profile[i-1],[lo,b]=profile[i];if(y>=lo)return a+(b-a)*(hi-y)/(hi-lo);}return .72;}
 // Source-shaped rim: two tall lateral tips frame the low central opening.
 // The rear petal supplies the third, highest tip visible through that opening.
 function rim(a,front){if(front)return 83+94*Math.pow(1-Math.abs(Math.sin(a)),1.8);const x=143*Math.abs(Math.sin(a)),ps=[[0,64],[18,68],[45,84],[65,100],[76,86],[91,80],[108,84],[124,93],[143,83]];for(let i=1;i<ps.length;i++)if(x<=ps[i][0]){const t=(x-ps[i-1][0])/(ps[i][0]-ps[i-1][0]),u=t*t*(3-2*t);return ps[i-1][1]+(ps[i][1]-ps[i-1][1])*u;}return 83;}
 function sample(a,t,inner,front){const y=410+(rim(a,front)-410)*t,r=radius(y)-(inner?.035:0);return[320+Math.sin(a)*r/.005,y,Math.cos(a)*r*.78];}
 const petals=[];
 for(const[index,start,end]of [[0,-Math.PI/2,0],[1,0,Math.PI/2],[2,Math.PI/2,Math.PI],[3,Math.PI,Math.PI*1.5]]){
  const isFront=index<2,P=[],I=[],C=[],rows=40,cols=36,n=(rows+1)*(cols+1);
  for(const inner of [false,true])for(let j=0;j<=rows;j++)for(let i=0;i<=cols;i++){
   const a=start+(end-start)*i/cols,t=j/rows,q=sample(a,t,inner,isFront);P.push(...s.point(q));
   const warm=Math.max(0,Math.min(1,(q[1]-120)/275)),edge=Math.max(0,(t-.955)/.045),c=pink.clone().lerp(gold,Math.max(warm,edge*.9)).multiplyScalar(inner?.88:.98);C.push(c.r,c.g,c.b);
  }
  for(let j=0;j<rows;j++)for(let i=0;i<cols;i++){const a=j*(cols+1)+i,b=a+1,c=a+cols+1,d=c+1;I.push(a,b,d,a,d,c,a+n,d+n,b+n,a+n,c+n,d+n);}
  const boundary=[];for(let i=0;i<=cols;i++)boundary.push(i);for(let j=1;j<=rows;j++)boundary.push(j*(cols+1)+cols);for(let i=cols-1;i>=0;i--)boundary.push(rows*(cols+1)+i);for(let j=rows-1;j>0;j--)boundary.push(j*(cols+1));for(let i=0;i<boundary.length;i++){const a=boundary[i],b=boundary[(i+1)%boundary.length];I.push(a,a+n,b+n,a,b+n,b);}
  const g=k.geometry(P,I),normal=g.attributes.normal;
  // All four petals share the cup's analytic normals at their joins. End-cap
  // averages otherwise point forward at the side seam and smear front paint.
  for(let layer=0;layer<2;layer++)for(let j=0;j<=rows;j++)for(let i=0;i<=cols;i++){const a=start+(end-start)*i/cols,y=sample(a,j/rows,false,isFront)[1],slope=(radius(y+.1)-radius(y-.1))/.001,v=new T.Vector3(Math.sin(a),slope,Math.cos(a)/.78).normalize().multiplyScalar(layer?-1:1);normal.setXYZ(layer*n+j*(cols+1)+i,v.x,v.y,v.z);}
  g.setAttribute('color',new T.Float32BufferAttribute(C,3));const mat=k.solid('TulipPetalColor'+index,'#ffffff');mat.userData.preserveVertexColor=true;const o=k.mesh('SourceTulipPetal'+index+'Solid',g,mat,s.parent);o.userData.artworkFacingFade=[.16,.46];o.userData.artworkHorizontalNormal=true;if(!isFront)o.userData.artworkExcludedRegions=[{cx:320,cy:296,rx:112,ry:95}];petals.push(o);
 }
 function volume(tool,name,ps,center,front,back,color,z=0,samples=64){k.volume(name+'Half',ps,center,tool.pivot,front,back,tool.parent,k.solid(name+'Color',color),{art:false,z:z-tool.offset.z,samples});const P=[],I=[];for(const suffix of ['Surface','Back']){const o=tool.parent.getObjectByName(name+'Half'+suffix),off=P.length/3;P.push(...o.geometry.attributes.position.array);I.push(...Array.from(o.geometry.index.array,v=>v+off));tool.parent.remove(o);o.geometry.dispose();}const g=k.geometry(P,I),p=g.attributes.position,n=g.attributes.normal,m=new Map();for(let i=0;i<p.count;i++){const key=[p.getX(i),p.getY(i),p.getZ(i)].map(v=>Math.round(v*1e5)).join(',');if(!m.has(key))m.set(key,[]);m.get(key).push(i);}for(const a of m.values()){const v=new T.Vector3();for(const i of a)v.add(new T.Vector3().fromBufferAttribute(n,i));v.normalize();for(const i of a)n.setXYZ(i,v.x,v.y,v.z);}const o=k.mesh(name,g,k.solid(name+'Color',color),tool.parent);o.userData.artworkFacingFade=[.12,.45];paintContours.push([o,tool,ps]);shells.push([o,tool,color==='#78a942'?'#215a3d':'#9a3852']);return o;}
 function part(name,pivot){let p=parts.get(name);if(!p){p={part:{pivot},group:k.group(name,pivot)};parts.set(name,p);}p.group.clear();p.part.pivot=pivot;p.group.position.set((pivot[0]-320)*.005,(580-pivot[1])*.005,0);p.group.userData.directSurfaceArtwork=true;return sculpt(T,k,p);}
 const join=s.ellipsoid('TulipHiddenCalyxSolid',[320,430,-.04],[37,34,.15],'#639a3d');join.userData.skipOriginalPaint=true;
 const leaf=[[143,338],[141,364],[151,392],[171,416],[204,435],[246,446],[285,449],[320,449],[305,424],[275,404],[233,393],[194,378],[164,358]];
 for(const side of [-1,1])volume(s,'TulipCollarLeaf'+side+'Solid',leaf.map(([x,y])=>[320+side*(x-320),y]),[320+side*(233-320),417],.12,.12,'#78a942',.16);
 // Rear calyx is a curved leaf attached to the same neck, not a flat floating fin.
 const backLeaf=s.sweep('TulipRearCalyxSolid',[[320,435,-.05,22],[320,408,-.17,28],[320,377,-.30,21],[320,354,-.33,3]],'#5b8d3a');backLeaf.userData.skipOriginalPaint=true;
 const body=part('Torso',[320,476]);volume(body,'TulipShortSuitSolid',[[266,446],[374,446],[382,478],[374,514],[356,536],[333,543],[307,543],[281,535],[265,513],[256,478]],[320,490],.26,.26,'#ffd459');body.paint();
 for(const side of [-1,1]){
  const mirror=ps=>ps.map(([x,y])=>[side<0?x:640-x,y]),a=part(side<0?'LeftArm':'RightArm',[320+side*65,451]);volume(a,'TulipSleeve'+side+'Solid',mirror([[239,449],[260,449],[255,469],[252,487],[248,505],[237,509],[225,502],[220,489],[224,472]]),[320+side*79,478],.11,.11,'#ffd459');a.paint();
  const l=part(side<0?'LeftLeg':'RightLeg',[320+side*33,530]);volume(l,'TulipFoot'+side+'Solid',mirror([[276,521],[309,525],[310,547],[304,567],[295,577],[277,578],[265,573],[262,565],[272,550]]),[320+side*34,551],.16,.16,'#ffd459');l.paint();
 }
 s.paint();
 for(const[o,tool,ps]of paintContours){const art=tool.parent.getObjectByName(o.name+'OriginalPaint');if(!art)continue;const p=art.geometry.attributes.position,C=art.geometry.attributes.color,edge=new T.CatmullRomCurve3(ps.map(([x,y])=>new T.Vector3(x,y,0)),true,'centripetal').getSpacedPoints(128);for(let i=0;i<p.count;i++){const x=p.getX(i)/.005+tool.pivot[0],y=tool.pivot[1]-p.getY(i)/.005;let distance=Infinity;for(let j=0;j<edge.length-1;j++){const a=edge[j],b=edge[j+1],dx=b.x-a.x,dy=b.y-a.y,t=Math.max(0,Math.min(1,((x-a.x)*dx+(y-a.y)*dy)/(dx*dx+dy*dy)));distance=Math.min(distance,Math.hypot(x-a.x-t*dx,y-a.y-t*dy));}const t=Math.max(0,Math.min(1,(distance-2)/8));C.setW(i,C.getW(i)*t*t*(3-2*t));}}
 // Ink silhouettes follow the 3D surfaces; add them after the paint pass so
 // their reversed faces cannot occlude the source artwork.
 // A single silhouette shell avoids the straight ink seams produced by
 // independently expanding each quarter of the cup about its own center.
 {const P=[],I=[];for(const o of petals){const off=P.length/3;P.push(...o.geometry.attributes.position.array);const ix=o.geometry.index.array;for(let j=0;j<40*36*12;j+=12)for(let q=0;q<6;q++)I.push(ix[j+q]+off);}const outline=k.mesh('TulipCupOutlineSupport',k.geometry(P,I),k.solid('TulipOutlineInvisible','#ffffff'),s.parent);outline.visible=false;shells.push([outline,s,'#9a3852']);}
 for(const[o,tool,color]of shells){o.updateMatrix();const g=o.geometry.clone().applyMatrix4(o.matrix),p=g.attributes.position,box=new T.Box3().setFromBufferAttribute(p),c=box.getCenter(new T.Vector3()),d=box.getSize(new T.Vector3()),f=1+.013/(Math.max(d.x,d.y,d.z)/2),ix=g.index.array;for(let i=0;i<p.count;i++)p.setXYZ(i,c.x+(p.getX(i)-c.x)*f,c.y+(p.getY(i)-c.y)*f,c.z+(p.getZ(i)-c.z)*f);for(let i=0;i<ix.length;i+=3)[ix[i+1],ix[i+2]]=[ix[i+2],ix[i+1]];g.computeVertexNormals();g.deleteAttribute('color');const ink=k.mesh(o.name+'InkShell',g,k.solid(o.name+'Ink',color),tool.parent);ink.userData.skipOriginalPaint=true;ink.material.userData.alreadyShaded=true;}
 const temporary=s.parent.getObjectByName('TulipCupOutlineSupport');if(temporary){s.parent.remove(temporary);temporary.geometry.dispose();}head.special=true;head.skipNeckJoin=true;head.authoredFamily='tulip';return true;
};
