"use strict";

// Measured source-space contours; all shells remain genuine closed volumes.
module.exports=function snacks(THREE,k,id,parts){
 if(!['food-candy','food-cookie','food-dumpling','food-pudding'].includes(id))return false;
 const head=parts.get('Head'),s=require('./sculpt-kit.cjs')(THREE,k,head);
 s.parent.clear();s.parent.userData.directSurfaceArtwork=true;
 s.parent.userData.artworkOpaqueRegions=[{cx:320,cy:300,rx:125,ry:103}];
 if(id==='food-candy'){
  for(const name of ['LeftWrapper','RightWrapper'])parts.get(name)?.group.clear();
  const shell=s.ellipsoid('CandyShellSolid',[320,234,0],[168,166,.76],'#ed8198');
  shell.geometry.dispose();shell.geometry=new THREE.SphereGeometry(1,160,96);
  shell.userData.artworkCylindrical=true;
  // Keep the tied neck attached to the ball and flare the wrapper outside it.
  for(const side of [-1,1]){
   const ps=[[158,183],[99,141],[61,132],[47,149],[60,188],[54,218],[42,254],[55,289],[56,332],[75,342],[116,321],[161,283]].map(([x,y])=>[side<0?x:640-x,y]);
   k.volume('CandyWrapperSolid'+side,ps,[side<0?105:535,237],s.pivot,.13,.13,s.parent,k.solid('WrapperPink','#ec8c9f'),{art:false,samples:80});
  }
  // Broad blue helical bands over the back of the candy, in the source palette.
  const g=shell.geometry,p=g.attributes.position,colors=[];
  for(let i=0;i<p.count;i++){
   const y=p.getY(i),a=Math.atan2(p.getX(i),p.getZ(i)),stripe=Math.sin(a*3-y*2.5);
   const pink=new THREE.Color('#ed8198').convertSRGBToLinear(),blue=new THREE.Color('#9ac9d5').convertSRGBToLinear(),t=THREE.MathUtils.smoothstep(stripe,.22,.48);pink.lerp(blue,t);colors.push(pink.r,pink.g,pink.b);
  }
  g.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));shell.material.color.set(0xffffff);shell.material.userData.preserveVertexColor=true;
  const torso=parts.get('Torso'),t=require('./sculpt-kit.cjs')(THREE,k,torso);torso.group.clear();
  t.ellipsoid('CandyTorsoSolid',[320,457,0],[77,80,.30],'#ed8198');torso.group.userData.directSurfaceArtwork=true;t.paint();
  for(const side of [-1,1]){const arm=parts.get(side<0?'LeftArm':'RightArm'),pivot=[320+side*60,417];arm.group.clear();arm.part.pivot=pivot;arm.group.position.set((pivot[0]-320)*.005,(580-pivot[1])*.005,0);const a=require('./sculpt-kit.cjs')(THREE,k,arm);a.sweep('CandySleeveSolid'+side,[[320+side*60,417,0,17],[320+side*82,452,0,18],[320+side*88,482,.015,15]],'#ed8198');arm.group.userData.directSurfaceArtwork=true;a.paint();}
 }
 if(id==='food-cookie'){
  const outline=[[319,65],[382,65],[439,94],[483,145],[501,205],[505,271],[500,329],[471,377],[427,408],[362,429],[300,429],[239,414],[184,384],[150,345],[133,297],[130,244],[139,192],[160,151],[199,109],[252,76]];
  const cookie=s.smoothOutline('CookieShellSolid',outline.map(([x,y])=>[320+(x-320)*.98,247+(y-247)*.98]),.44,'#dfa55f',0,.035);
  cookie.updateWorldMatrix(true,false);const ray=new THREE.Raycaster();
  for(const [i,x,y,rx,ry] of [[0,248,128,22,17],[1,377,112,17,13],[2,440,193,18,23],[3,190,207,19,24],[4,327,177,20,16],[5,464,297,17,13],[6,186,320,15,21],[7,411,385,15,11],[8,344,405,13,10]]){
   const origin=new THREE.Vector3((x-320)*.005,(580-y)*.005,-3);ray.set(origin,new THREE.Vector3(0,0,1));const hit=ray.intersectObject(cookie)[0];if(!hit)continue;
   const chip=s.ellipsoid('RearCookieChip'+i,[x,y,hit.point.z-.007],[rx,ry,.018],'#86512f',i*.29);chip.userData.skipOriginalPaint=true;
  }
 }
 if(id==='food-dumpling'){
  const body=s.lathe('DumplingShellSolid',[[421,0],[417,85],[402,139],[373,177],[333,195],[284,201],[237,189],[196,162],[164,127],[140,92],[120,70],[98,55],[77,32],[67,0]],'#f3e3bf');
  // The knotted crown is part of the shell, not three disconnected spikes.
  const p=body.geometry.attributes.position;
  for(let i=0;i<p.count;i++){const py=580-p.getY(i)/.005;if(py<141){const t=Math.max(0,1-(py-67)/74),x=p.getX(i),z=p.getZ(i),a=Math.atan2(z,x);p.setY(i,p.getY(i)-.057*t*(.5+.5*Math.cos(a*6))*Math.min(1,Math.hypot(x,z)/.08));}}
  body.geometry.computeVertexNormals();body.userData.artworkCylindrical=true;
  // Supported, shallow crease strokes on the back.
  body.updateWorldMatrix(true,false);const ray=new THREE.Raycaster();
  for(const side of [-1,0,1]){
   const ps=[];for(let i=0;i<=22;i++){const t=i/22,x=320+side*(34+45*t),y=110+69*t;ray.set(new THREE.Vector3((x-320)*.005,(580-y)*.005,-3),new THREE.Vector3(0,0,1));const hit=ray.intersectObject(body)[0];if(hit)ps.push([x,y,hit.point.z-.004]);}
   if(ps.length>1){const crease=s.tube('RearDoughCrease'+side,ps,.009,'#c5b190');crease.userData.skipOriginalPaint=true;}
  }
 }
 if(id==='food-pudding'){
  const body=s.lathe('PuddingShellSolid',[[424,0],[422,65],[415,124],[400,164],[378,185],[362,185],[291,171],[211,157],[144,144],[108,132],[91,116],[82,77],[80,0]],'#fbd16f');
  body.userData.artworkCylindrical=true;
  // Tilt the top ellipse into view; follow the same transform on the topping.
  const caramel=s.lathe('CaramelCapSolid',[[139,0],[139,141],[122,143],[99,139],[80,120],[65,72],[63,0]],'#93502c');
  for(const o of [body,caramel]){const p=o.geometry.attributes.position;for(let i=0;i<p.count;i++){const y=p.getY(i),weight=THREE.MathUtils.clamp((y-1.55)/.90,0,1);p.setY(i,y-.20*p.getZ(i)*weight);}o.geometry.computeVertexNormals();}
  // One closed coating from the cap down into each drip. Separate oval
  // decorations left visible gaps between the topping and the droplets.
  body.updateWorldMatrix(true,false);caramel.updateWorldMatrix(true,false);const ray=new THREE.Raycaster(),P=[],I=[],U=96,V=12;
  for(const layer of [0,1])for(let v=0;v<=V;v++)for(let u=0;u<=U;u++){
   const a=Math.PI+u/U*Math.PI+.00001,drips=[[3.42,30],[4.15,53],[5.12,32],[5.93,47]],end=138+drips.reduce((n,[center,length])=>n+length*Math.exp(-(((a-center)/.14)**2)),0),py=90+(end-90)*v/V,dir=new THREE.Vector3(Math.cos(a),0,Math.sin(a));
   ray.set(new THREE.Vector3(dir.x*3,(580-py)*.005,dir.z*3),dir.clone().negate());const hit=ray.intersectObjects([body,caramel])[0];if(!hit)throw new Error('Missing caramel support '+py+' '+a);
   const q=hit.point.clone().addScaledVector(dir,layer?-.004:.009);P.push(...q.toArray());
  }
  const size=(U+1)*(V+1);
  for(let v=0;v<V;v++)for(let u=0;u<U;u++){const a=v*(U+1)+u,b=a+1,c=a+U+1,d=c+1;I.push(a,c,d,a,d,b,a+size,d+size,c+size,a+size,b+size,d+size);}
  const border=[];for(let u=0;u<=U;u++)border.push(u);for(let v=1;v<=V;v++)border.push(v*(U+1)+U);for(let u=U-1;u>=0;u--)border.push(V*(U+1)+u);for(let v=V-1;v>0;v--)border.push(v*(U+1));
  for(let j=0;j<border.length;j++){const a=border[j],b=border[(j+1)%border.length];I.push(a,b,b+size,a,b+size,a+size);}
  for(let i=0;i<I.length;i+=3)[I[i+1],I[i+2]]=[I[i+2],I[i+1]];
  const coating=s.mesh('RearCaramelCoatingSolid',k.geometry(P,I),'#93502c');coating.userData.skipOriginalPaint=true;
 }
 if(['food-dumpling','food-pudding'].includes(id)){
  const torso=parts.get('Torso'),t=require('./sculpt-kit.cjs')(THREE,k,torso);
  t.ellipsoid('SnackShoulderJoin',[320,433,0],[62,29,.24],id==='food-dumpling'?'#f3e3bf':'#fbd16f');torso.group.userData.directSurfaceArtwork=true;t.paint();
 }
 s.paint();
 if(id==='food-candy')for(const side of [-1,1]){
  const back=s.parent.getObjectByName('CandyWrapperSolid'+side+'Back'),geo=back.geometry.clone(),p=geo.attributes.position,uv=[];
  for(let i=0;i<p.count;i++)uv.push((p.getX(i)/.005+s.pivot[0])/640,(s.pivot[1]-p.getY(i)/.005)/640);
  geo.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));geo.translate(0,0,-.003);k.mesh('WrapperRearFinish'+side,geo,k.art.clone(),s.parent);
 }
 head.authoredFamily='snack';return true;
};
