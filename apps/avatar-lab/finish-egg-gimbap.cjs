"use strict";
module.exports=function(T,k,id,parts){
 if(!['food-fried-egg','food-gimbap'].includes(id))return;
 const egg=id==='food-fried-egg',head=parts.get('Head'),g=head.group,s=require('./sculpt-kit.cjs')(T,k,head),ink=require('./solid-ink-shell.cjs'),colour=egg?'#fffdf8':'#354b35',stroke=egg?'#847568':'#202d22';
 if(egg){
  for(const o of [...g.children])if(o.name==='EggWhite'||o.name.startsWith('OriginalFace')||o.material?.userData.originalTexture)g.remove(o);
  const P=[],I=[],N=128,R=32,hem=[[-1,224],[-.8,249],[-.5,241],[-.2,227],[.1,244],[.4,269],[.7,254],[1,226]];
  for(const lower of [false,true])for(let row=0;row<=R;row++)for(let i=0;i<N;i++){
   const t=row/R,a=i/N*Math.PI*2,x=Math.cos(a),z=Math.sin(a),r=1+.018*Math.sin(a*5),edgeX=x*1.12;
   let py=224;for(let j=1;j<hem.length;j++)if(x<=hem[j][0]){const u=(x-hem[j-1][0])/(hem[j][0]-hem[j-1][0]);py=T.MathUtils.lerp(hem[j-1][1],hem[j][1],.5-.5*Math.cos(Math.PI*u));break;}
   const frontEdge=(580-py)*.005,rearEdge=1.77+.025*Math.cos(a*3),blend=T.MathUtils.smoothstep(z,-.25,.25),edgeY=T.MathUtils.lerp(rearEdge,frontEdge,blend),h=2.30+(edgeY-2.30)*Math.pow(t,1.75+1.25*x*x);
   const wx=edgeX*r*t,wz=z*r*.76*t,d=Math.hypot(wx,wz-.16)/.50,plane=2.16-.22*(wz-.16),seat=1-T.MathUtils.smoothstep(d,.98,1.20),seated=T.MathUtils.lerp(h,Math.min(h,plane),seat);
   P.push(wx,seated-(lower?.065:0),wz);
  }
  const side=(R+1)*N;for(let row=0;row<R;row++)for(let i=0;i<N;i++){const a=row*N+i,b=row*N+(i+1)%N,c=a+N,d=b+N;if(row)I.push(a,b,d,a+side,d+side,b+side);I.push(a,d,c,a+side,c+side,d+side);}
  for(let i=0;i<N;i++){const a=R*N+i,b=R*N+(i+1)%N;I.push(a,b,a+side,b,b+side,a+side);}
  const white=s.mesh('EggWhite',k.geometry(P,I),'#ffffff');white.userData.skipOriginalPaint=true;
  const C=[];for(let i=0;i<P.length/3;i++){const c=new T.Color(i<side?'#fffdfa':'#e1d8cd').convertSRGBToLinear();C.push(c.r,c.g,c.b);}white.geometry.setAttribute('color',new T.Float32BufferAttribute(C,3));white.material.userData.preserveVertexColor=true;
  const rim=[];for(let i=0;i<=N;i++){const j=(R*N+i%N)*3;rim.push([P[j]/.005+320,580-P[j+1]/.005,P[j+2]]);}const edge=s.tube('EggWhiteHem',rim,.008,'#a28f80');edge.userData.skipOriginalPaint=true;
  const hood=g.getObjectByName('EggHood');hood.userData.artworkFacingFade=[.35,.75];hood.userData.artworkMinY=235;
  g.userData.originalFaceRegions=[];g.userData.artworkOpaqueRegions=[{cx:320,cy:309,rx:113,ry:97}];
  const yolk=g.getObjectByName('EggYolk'),yp=yolk.geometry.attributes.position;for(let i=0;i<yp.count;i++)yp.setY(i,2.145+(yp.getY(i)+.22*yp.getZ(i)-2.06)*(.445/.53)-.22*yp.getZ(i));yolk.geometry.computeVertexNormals();yolk.position.z+=.16;yolk.userData.artworkFacingFade=[.25,.6];
 }else{
  for(const o of [...g.children]){if(/^TopRiceGrain/.test(o.name)){o.userData.skipOriginalPaint=true;o.material.color.set('#f4f1e7').convertSRGBToLinear();}if(/^Filling/.test(o.name))g.remove(o);}
  g.getObjectByName('RiceTop').userData.skipOriginalPaint=false;
  const fills=[[[234,108],[244,94],[273,84],[286,87],[297,107],[268,119],[245,125]],[[288,83],[321,81],[357,89],[337,111],[309,110]],[[247,131],[273,121],[303,116],[331,124],[349,148],[319,155],[279,147]],[[353,96],[376,91],[403,105],[407,119],[385,137],[355,143],[337,124]]];
  fills.forEach((ps,i)=>{const curve=new T.CatmullRomCurve3(ps.map(([x,y])=>new T.Vector3((x-320)*.005,-(y-120)/70,0)),true,'centripetal'),shape=new T.Shape();curve.getSpacedPoints(64).slice(0,64).forEach((p,j)=>j?shape.lineTo(p.x,p.y):shape.moveTo(p.x,p.y));shape.closePath();const geo=new T.ExtrudeGeometry(shape,{depth:.024,bevelEnabled:true,bevelThickness:.008,bevelSize:.008,bevelSegments:3,steps:1}),p=geo.attributes.position;
   for(let j=0;j<p.count;j++){const z=-p.getY(j),h=p.getZ(j);p.setXYZ(j,p.getX(j),2.335+h-.35*z,z);}geo.computeVertexNormals();const filling=s.mesh('Filling'+i,geo,i===3?'#a9c850':'#ef954f');filling.userData.artworkFacingFade=[.05,.30];
  });
  for(let i=0;i<28;i++){const a=i/28*Math.PI*2,r=.69,x=Math.cos(a)*r,z=Math.sin(a)*r;const grain=s.ellipsoid('PuffedRiceGrain'+i,[320+x/.005,580-(2.34-.35*z)/.005,z],[11,7,.075],'#fffdf6');grain.rotation.x=Math.atan(.35);grain.rotation.y=a;grain.userData.skipOriginalPaint=true;const n=grain.geometry.attributes.normal,C=[];for(let j=0;j<n.count;j++){const shade=.78+.22*Math.max(0,n.getY(j));C.push(shade,shade,shade);}grain.geometry.setAttribute('color',new T.Float32BufferAttribute(C,3));grain.material.userData.preserveVertexColor=true;}
  g.getObjectByName('NoriRoll').userData.artworkFacingFade=[.45,.8];
  // A complete soft lip follows the same cut plane as the rice surface.
  const lip=s.torus('NoriCutRim',[320,116,0],.843,.015,'#263827');lip.rotation.x=Math.PI/2;
  lip.updateMatrix();const geo=lip.geometry.clone().applyMatrix4(lip.matrix);lip.geometry=geo;lip.position.set(0,0,0);lip.rotation.set(0,0,0);const p=geo.attributes.position;
  for(let i=0;i<p.count;i++)p.setY(i,p.getY(i)-.35*(p.getZ(i)+g.position.z));geo.computeVertexNormals();lip.userData.skipOriginalPaint=true;
  // Restrained rear seaweed highlights; no mirrored human face.
  const roll=g.getObjectByName('NoriRoll');roll.updateWorldMatrix(true,false);const ray=new T.Raycaster();
  for(const [j,x,y,h,w]of [[0,187,268,116,7],[1,452,237,72,4]]){const ps=[];for(let i=0;i<=32;i++){const yy=y-h/2+h*i/32;ray.set(new T.Vector3((x-320)*.005,(580-yy)*.005,-3),new T.Vector3(0,0,1));const hit=ray.intersectObject(roll)[0];if(hit)ps.push([x,yy,hit.point.z-.003]);}if(ps.length>1){const stripe=s.tube('RearNoriGlint'+j,ps,w*.005,'#52664a');stripe.userData.skipOriginalPaint=true;}}
 }
 for(const name of ['Torso','LeftArm','RightArm','LeftLeg','RightLeg']){
  const part=parts.get(name),tool=require('./sculpt-kit.cjs')(T,k,part),side=name.startsWith('Left')?-1:1;part.group.clear();let ps,center,depth;
  if(name==='Torso'){ps=egg?[[259,409],[380,409],[395,447],[395,490],[377,522],[349,539],[290,539],[263,523],[245,492],[247,447]]:[[263,438],[377,438],[389,471],[385,506],[366,537],[320,545],[276,537],[255,506],[251,471]];center=[320,egg?478:490];depth=.27;}
  else if(name.endsWith('Arm')){ps=(egg?[[259,412],[272,426],[254,456],[245,484],[238,501],[220,505],[210,492],[212,473],[233,437]]:[[261,439],[274,451],[258,480],[248,500],[236,510],[218,505],[213,492],[219,472],[239,442]]).map(([x,y])=>[side<0?x:640-x,y]);center=[side<0?242:398,egg?460:473];depth=.11;}
  else{ps=(egg?[[275,519],[310,527],[307,550],[298,571],[276,577],[254,569],[253,556],[266,535]]:[[278,525],[311,531],[307,555],[299,574],[276,579],[258,571],[258,557],[269,538]]).map(([x,y])=>[side<0?x:640-x,y]);center=[side<0?282:358,552];depth=.14;}
  const prefix='FinishedMeal'+name;k.volume(prefix,ps,center,part.part.pivot,depth,depth,part.group,k.solid(prefix+'Color',colour),{art:false,samples:80});require('./smooth-paired-volume.cjs')(T,k,part.group,prefix,{rings:20});
  for(const o of part.group.children){o.userData.artworkFacingFade=[.35,.7];if(name!=='Torso')o.userData.skipOriginalPaint=true;}
  part.group.userData.directSurfaceArtwork=true;part.group.userData.artworkOpaqueRegions=[];tool.paint();
  for(const suffix of ['Surface','Back']){const mesh=part.group.getObjectByName(prefix+suffix);ink(T,k,mesh,stroke,.008);}
 }
 require('./project-model-artwork.cjs')(T,k,g,head.part.pivot);
 if(egg)ink(T,k,g.getObjectByName('EggHood'),stroke,.008);
};
