"use strict";
module.exports=function(T,k,id,parts){
 if(!['food-ice-cream','food-macaron'].includes(id))return;
 const ice=id==='food-ice-cream',head=parts.get('Head'),g=head.group,s=require('./sculpt-kit.cjs')(T,k,head),ink=require('./solid-ink-shell.cjs');g.clear();
 delete g.userData.originalFaceRegions;const solids=[];
 if(ice){
  const cone=s.lathe('WaffleCone',[[577,0],[571,13],[549,29],[510,50],[470,72],[441,88],[431,94],[429,0]],'#efb76a',0,{levels:96});solids.push(cone);

  const cream=s.lathe('SoftServe',[[441,0],[439,67],[435,88],[427,102],[415,109],[390,117],[365,123],[362,124,319],[348,139,319],[327,153,319],[303,160,319],[280,159,320],[260,151,321],[240,138,322],[225,128,315],[218,127,314],[201,125,316],[181,116,317],[165,101,318],[157,91,320],[145,80,316],[130,74,313],[116,58,309],[105,42,307],[94,27,313],[82,19,313],[72,15,306],[65,8,301],[62,0,301]],'#fff1dc',0,{levels:160,segments:96});solids.push(cream);
  const p=cream.geometry.attributes.position,C=[];
  for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i),a=Math.atan2(z,x),py=580-y/.005,r=Math.hypot(x,z),back=1-T.MathUtils.smoothstep(Math.sin(a),-.15,.65),upper=T.MathUtils.smoothstep(y,1.18,1.48)*(1-T.MathUtils.smoothstep(y,2.35,2.55));const ridge=.033*Math.cos((y-1.30)/.36*Math.PI*2+a)*back*upper;if(r){p.setX(i,x*(1+ridge/r));p.setZ(i,z*(1+ridge/r));}const col=new T.Color(py>361?'#f4c178':'#fff1dc').convertSRGBToLinear();C.push(col.r,col.g,col.b);if(z>0){const d=Math.hypot((x/.005)/111,(py-326)/90),f=1-T.MathUtils.smoothstep(d,.97,1.30);p.setZ(i,T.MathUtils.lerp(p.getZ(i),.73-.08*(x/.6)**2,f));}
}
  cream.geometry.setAttribute('color',new T.Float32BufferAttribute(C,3));cream.material.color.set(0xffffff);cream.material.userData.preserveVertexColor=true;cream.geometry.computeVertexNormals();cream.geometry.computeBoundingBox();cream.geometry.computeBoundingSphere();

  // Rear grooves follow the actual rounded solids, including the cone collar.
  for(const o of solids)o.updateWorldMatrix(true,false);const ray=new T.Raycaster();
  function rearLine(name,points,width,color,support){const ps=[];for(const [a,y]of points){const origin=new T.Vector3(Math.cos(a)*3,y,Math.sin(a)*3);ray.set(origin,new T.Vector3(-origin.x,0,-origin.z).normalize());const h=ray.intersectObject(support)[0];if(h)ps.push([h.point.x/.005+320,580-h.point.y/.005,h.point.z]);}if(ps.length>1){const line=s.tube(name,ps,width,color);line.userData.skipOriginalPaint=true;}}
  for(let j=0;j<3;j++)rearLine('CreamSpiralGroove'+j,Array.from({length:65},(_,i)=>[Math.PI+i/64*Math.PI,1.42+j*.35+i/64*.18]),.008,'#cbb496',cream);
  for(const side of [-1,1])for(let j=0;j<8;j++){let ps=[],seg=0;const flush=()=>{if(ps.length>1)rearLine('WaffleRidge'+side+'_'+j+'_'+seg++,ps,.007,'#af793e',cone);ps=[];};for(let i=0;i<=80;i++){const t=i/80,a=j/8*Math.PI*2+side*t*2.5,y=.035+t*.68;if(Math.sin(a)<-.03)ps.push([a,y]);else flush();}flush();}
  rearLine('ConeCollarHem',Array.from({length:65},(_,i)=>[Math.PI+i/64*Math.PI,.74]),.008,'#b38249',cream);
  g.userData.artworkOpaqueRegions=[{cx:320,cy:326,rx:110,ry:90}];
 }else{
  const body=s.lathe('ContinuousFoodBody',[[429,0],[427,48],[420,87],[406,114],[389,148],[368,174],[345,191],[326,198],[316,199],[307,201],[293,208],[283,208],[272,203],[257,200],[242,199],[231,200],[217,206],[202,203],[184,198],[159,195],[132,179],[108,154],[90,124],[80,100],[72,74],[68,55],[64,24],[63,0]],'#ef9dbc',0,{levels:192,segments:96});solids.push(body);
  const p=body.geometry.attributes.position,C=[];
  for(let i=0;i<p.count;i++){let x=p.getX(i),y=p.getY(i),z=p.getZ(i);const py=580-y/.005,a=Math.atan2(z,x),r=Math.hypot(x,z),ruffle=Math.exp(-(((py-237)/13)**2))+Math.exp(-(((py-309)/13)**2)),facing=Math.max(0,Math.sin(a));y+=.012*Math.sin(a*13)*ruffle*(1-.7*facing);if(r){const f=1+.006*Math.sin(a*13)*ruffle;x*=f;z*=f;}
   if(z>0){const d=Math.hypot((x/.005)/117,(py-290)/96),f=1-T.MathUtils.smoothstep(d,.96,1.22);z=T.MathUtils.lerp(z,.98-.10*(x/.65)**2,f);}p.setXYZ(i,x,y,z);
   const c=new T.Color(py<229?'#ee9bb7':py<248?'#df83a6':py<290?'#fff1ed':py<320?'#e794b1':'#ed9bb8').convertSRGBToLinear();C.push(c.r,c.g,c.b);
  }body.geometry.setAttribute('color',new T.Float32BufferAttribute(C,3));body.material.color.set(0xffffff);body.material.userData.preserveVertexColor=true;body.geometry.computeVertexNormals();body.geometry.computeBoundingBox();body.geometry.computeBoundingSphere();
  for(const name of ['Torso','LeftArm','RightArm','LeftLeg','RightLeg']){const part=parts.get(name),left=name.startsWith('Left'),tool=require('./sculpt-kit.cjs')(T,k,part);part.group.clear();let ps,center,depth;
   if(name==='Torso'){ps=[[250,418],[390,418],[395,458],[390,497],[371,532],[320,543],[269,532],[250,495],[245,458]];center=[320,479];depth=.28;}
   else if(name.endsWith('Arm')){ps=[[250,414],[265,426],[252,453],[245,485],[236,502],[220,501],[210,491],[211,471],[224,439]].map(([x,y])=>[left?x:640-x,y]);center=[left?236:404,459];depth=.115;}
   else{ps=[[271,522],[309,529],[306,553],[299,573],[280,577],[257,570],[255,558],[264,540]].map(([x,y])=>[left?x:640-x,y]);center=[left?283:357,552];depth=.14;}
   k.volume('FinishedCream'+name,ps,center,part.part.pivot,depth,depth,part.group,k.solid(name+'Pink','#f1a4bf'),{art:false,samples:80});require('./smooth-paired-volume.cjs')(T,k,part.group,'FinishedCream'+name,{rings:20});const meshes=['Surface','Back'].map(x=>part.group.getObjectByName('FinishedCream'+name+x));for(const mesh of meshes){mesh.userData.artworkFacingFade=[.35,.7];if(name!=='Torso')mesh.userData.skipOriginalPaint=true;}
   part.group.userData.directSurfaceArtwork=true;part.group.userData.artworkOpaqueRegions=[];tool.paint();for(const mesh of meshes)ink(T,k,mesh,'#9c4869',.008);
  }
  g.userData.artworkOpaqueRegions=[{cx:318,cy:290,rx:117,ry:96}];
 }
 for(const mesh of solids)mesh.userData.artworkFacingFade=[.35,.7];g.userData.directSurfaceArtwork=true;g.userData.artworkOcclusion=true;require('./project-model-artwork.cjs')(T,k,g,head.part.pivot);
 const boundary=[];for(let i=0;i<head.points.length;i+=4)if(head.points[i+3]<5)boundary.push([head.points[i],head.points[i+1]]);
 for(const art of g.children.filter(o=>o.isMesh&&o.material.userData.originalTexture)){const p=art.geometry.attributes.position,c=art.geometry.attributes.color;if(!c)continue;for(let i=0;i<p.count;i++){const x=p.getX(i)/.005+head.part.pivot[0],y=head.part.pivot[1]-p.getY(i)/.005;let d=Infinity;for(const [bx,by]of boundary)d=Math.min(d,Math.hypot(x-bx,y-by));c.setW(i,c.getW(i)*T.MathUtils.smoothstep(d,4,13));}}
 for(const mesh of solids)ink(T,k,mesh,ice?'#9f744c':'#a24b70',.007);
};
