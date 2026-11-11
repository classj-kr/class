"use strict";
module.exports=function(T,k,id,parts){
 if(!['animal-rabbit','animal-ratsnake','animal-viper'].includes(id))return;
 const viper=id==='animal-viper',rabbit=id==='animal-rabbit',head=parts.get('Head'),name=rabbit?'MeasuredCostumeHood':'SmoothSnakeHood';
 if(viper){
  for(const o of [...head.group.children])if(o.name.startsWith('SmoothSnakeHood'))head.group.remove(o);
  const outline=[[305,90],[339,94],[365,105],[381,97],[399,94],[417,101],[433,116],[441,137],[442,159],[438,180],[451,212],[465,248],[473,282],[468,317],[454,350],[431,378],[398,399],[359,412],[317,417],[275,413],[234,402],[198,382],[170,357],[150,326],[139,292],[137,259],[145,226],[158,196],[170,174],[172,151],[173,133],[182,111],[198,98],[214,95],[232,100],[247,110],[275,96]];
  k.volume('SmoothSnakeHood',outline,[306,259],head.part.pivot,.68,.68,head.group,k.solid('ViperHoodColor','#91ac49'),{art:false,samples:128});
 }
 for(const [group,partName] of [[head.group,name],...(rabbit?[-1,1].map(side=>[head.group,'RabbitEar'+side]):[])]){
 const a=group.getObjectByName(partName+'Surface'),b=group.getObjectByName(partName+'Back'),feather=partName.startsWith('RabbitEar');
 const base=(a.geometry.attributes.position.getZ(0)+b.geometry.attributes.position.getZ(0))/2;
 for(const mesh of [a,b]){
  const p=mesh.geometry.attributes.position,oldSamples=p.count/13,samples=feather?64:oldSamples,edge=Array.from({length:samples},(_,i)=>new T.Vector3().fromBufferAttribute(p,12*oldSamples+Math.floor(i*oldSamples/samples))),center=new T.Vector3().fromBufferAttribute(p,0);center.z=0;
  let smooth=edge.map(v=>v.clone());for(let pass=0;pass<4;pass++)smooth=smooth.map((v,i)=>{const sum=v.clone().multiplyScalar(2);for(const d of [-3,-2,-1,1,2,3])sum.add(smooth[(i+d+samples)%samples]);return sum.multiplyScalar(1/8);});
  const P=[],I=[],rings=feather?16:32,depth=p.getZ(0)-base;
  for(let ring=0;ring<=rings;ring++){const angle=ring/rings*Math.PI/2,r=Math.sin(angle),w=Math.max(0,(r-.94)/.06)**3;for(let i=0;i<samples;i++){const v=center.clone().lerp(smooth[i],r).addScaledVector(edge[i].clone().sub(smooth[i]),w);P.push(v.x,v.y,base+depth*Math.cos(angle));}}
  for(let ring=0;ring<rings;ring++)for(let i=0;i<samples;i++){const a=ring*samples+i,b=ring*samples+(i+1)%samples,c=a+samples,d=b+samples;if(depth<0){if(ring)I.push(a,d,b);I.push(a,c,d);}else{if(ring)I.push(a,b,d);I.push(a,d,c);}}
  const g=k.geometry(P,I);if((g.attributes.normal.getZ(samples*4)>0)!==(depth>0)){for(let i=0;i<I.length;i+=3)[I[i+1],I[i+2]]=[I[i+2],I[i+1]];g.setIndex(I);g.computeVertexNormals();}
  const N=g.attributes.normal;for(let pass=0;pass<3;pass++){const next=N.array.slice();for(let ring=0;ring<=rings;ring++)for(let i=0;i<samples;i++){const v=new T.Vector3();for(let d=-3;d<=3;d++)v.addScaledVector(new T.Vector3().fromBufferAttribute(N,ring*samples+(i+d+samples)%samples),4-Math.abs(d));next.set(v.normalize().toArray(),(ring*samples+i)*3);}N.array.set(next);}
  mesh.geometry.dispose();mesh.geometry=g;if(!feather)mesh.userData.paddedBoundary=edge;
 }
 }

 if(viper)require('./smooth-paired-volume.cjs')(T,k,parts.get('SnakeTrunk').group,'ShortContinuousSnakeTrunk');
 if(rabbit){
  for(const name of ['LeftArm','RightArm','LeftLeg','RightLeg'])for(const mesh of parts.get(name).group.children.filter(o=>o.isMesh&&!o.material.userData.originalTexture))mesh.userData.skipOriginalPaint=true;
 }else{
  for(const o of [...head.group.children])if(o.name.startsWith('SnakeHoodPiping'))head.group.remove(o);
  const coil=parts.get('SnakeCoil');coil.group.clear();
  const radius=viper?.49:.62,verticalRadius=viper?.085:.12,depthRadius=viper?.32:.37,thickness=viper?.13:.16,cy=viper?504:523;
  const P=[],I=[],C=[],around=128,cross=24,green=new T.Color(viper?'#91ac49':'#7da74c').convertSRGBToLinear(),belly=new T.Color(viper?'#d4d47e':'#d1d984').convertSRGBToLinear();
  for(let j=0;j<around;j++){
   const a=j/around*Math.PI*2,center=new T.Vector3(radius*Math.cos(a),(coil.part.pivot[1]-cy)*.005-verticalRadius*Math.sin(a),depthRadius*Math.sin(a)),tangent=new T.Vector3(-radius*Math.sin(a),-verticalRadius*Math.cos(a),depthRadius*Math.cos(a)).normalize(),out=new T.Vector3(Math.cos(a),0,Math.sin(a)).normalize(),vertical=new T.Vector3().crossVectors(tangent,out).normalize();
   for(let i=0;i<cross;i++){
    const b=i/cross*Math.PI*2,n=out.clone().multiplyScalar(Math.cos(b)).addScaledVector(vertical,Math.sin(b)),v=center.clone().addScaledVector(n,thickness);P.push(...v.toArray());
    // The original shows the pale belly around the outward face of the
    // resting coil, not only on its hidden underside. Keep a green crown
    // and carry the belly colour over the outward equator.
    const blend=Math.max(0,Math.min(1,(.34-n.y)/.28));C.push(...green.clone().lerp(belly,blend).toArray());
   }
  }
  for(let j=0;j<around;j++)for(let i=0;i<cross;i++){const a=j*cross+i,b=j*cross+(i+1)%cross,c=((j+1)%around)*cross+i,d=((j+1)%around)*cross+(i+1)%cross;I.push(a,b,d,a,d,c);}
  let volume=0;for(let i=0;i<I.length;i+=3)volume+=new T.Vector3().fromArray(P,I[i]*3).dot(new T.Vector3().fromArray(P,I[i+1]*3).cross(new T.Vector3().fromArray(P,I[i+2]*3)));if(volume<0)for(let i=0;i<I.length;i+=3)[I[i+1],I[i+2]]=[I[i+2],I[i+1]];
  const g=k.geometry(P,I);g.setAttribute('color',new T.Float32BufferAttribute(C,3));const m=k.solid('SnakeCoilColor','#ffffff');m.userData.preserveVertexColor=true;const mesh=k.mesh('RestingSnakeCoilSolid',g,m,coil.group);mesh.userData.skipOriginalPaint=!viper;if(viper)mesh.userData.artworkExcludedRegions=[{cx:306,cy:439,rx:56,ry:42}];
  for(let j=0;j<16;j++){const a=j/16*Math.PI*2,center=new T.Vector3(radius*Math.cos(a),(coil.part.pivot[1]-cy)*.005-verticalRadius*Math.sin(a),depthRadius*Math.sin(a)),tangent=new T.Vector3(-radius*Math.sin(a),-verticalRadius*Math.cos(a),depthRadius*Math.cos(a)).normalize(),out=new T.Vector3(Math.cos(a),0,Math.sin(a)),vertical=new T.Vector3().crossVectors(tangent,out).normalize(),line=[];for(let i=0;i<=24;i++){const b=Math.PI+.16+i/24*(Math.PI-.32),n=out.clone().multiplyScalar(Math.cos(b)).addScaledVector(vertical,Math.sin(b));line.push(center.clone().addScaledVector(n,thickness+.002).toArray());}const seam=k.tube('SnakeBellySeam'+j,line,.004,k.solid('SnakeBellySeamColor','#a9b369'),coil.group);seam.userData.skipOriginalPaint=true;}
  parts.get('SnakeTail').group.position.z=viper?.22:.26;
  const tail=parts.get('SnakeTail'),solid=tail.group.getObjectByName('ConnectedSnakeTail');
  if(viper){const p=solid.geometry.attributes.position;for(let i=0;i<p.count;i++){const x=p.getX(i)/.005+tail.part.pivot[0],w=Math.max(0,Math.min(1,(445-x)/48));p.setX(i,p.getX(i)-.10*w);}solid.geometry.computeVertexNormals();}
  const inkGeometry=solid.geometry.clone(),ip=inkGeometry.attributes.position,normal=inkGeometry.attributes.normal,ix=inkGeometry.index.array;for(let i=0;i<ip.count;i++){const width=.010*Math.min(1,Math.max(.2,(64-Math.floor(i/16))/8));ip.setXYZ(i,ip.getX(i)+normal.getX(i)*width,ip.getY(i)+normal.getY(i)*width,ip.getZ(i)+normal.getZ(i)*width);}for(let i=0;i<ix.length;i+=3)[ix[i+1],ix[i+2]]=[ix[i+2],ix[i+1]];inkGeometry.computeVertexNormals();const ink=k.mesh('ConnectedSnakeTailSilhouette',inkGeometry,k.solid('SnakeTailInk','#456b35'),tail.group);ink.userData.skipOriginalPaint=true;ink.material.userData.alreadyShaded=true;

  for(const o of parts.get('SnakeTail').group.children.filter(o=>o.isMesh&&!o.material.userData.originalTexture))o.userData.skipOriginalPaint=!(viper&&o.name==='ConnectedSnakeTail');
 }
};
