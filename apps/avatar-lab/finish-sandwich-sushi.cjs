"use strict";
module.exports=function(T,k,id,parts){
 if(!['food-sandwich','food-sushi'].includes(id))return;
 const sandwich=id==='food-sandwich',head=parts.get('Head'),g=head.group,s=require('./sculpt-kit.cjs')(T,k,head),ink=require('./solid-ink-shell.cjs');
 for(const o of [...g.children])if(o.material?.userData.originalTexture)g.remove(o);
 function volume(part,name,ps,center,depth,color){k.volume(name,ps,center,part.part.pivot,depth,depth,part.group,k.solid(name+'Color',color),{art:false,samples:96});require('./smooth-paired-volume.cjs')(T,k,part.group,name,{rings:24});return ['Surface','Back'].map(x=>part.group.getObjectByName(name+x));}
 if(sandwich){
  head.lockToBody=true;
  for(const o of g.children){if(/^LettuceLayerSolid/.test(o.name)){const p=o.geometry.attributes.position;for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i);p.setZ(i,p.getZ(i)+.014*Math.sin(y*15+x*7));}o.geometry.computeVertexNormals();o.geometry.computeBoundingBox();o.geometry.computeBoundingSphere();}if(o.isMesh)o.userData.artworkFacingFade=[.40,.72];}
  const back=g.getObjectByName('SandwichRearCrumbSolid');back.updateWorldMatrix(true,false);const ray=new T.Raycaster();
  for(let i=0;i<19;i++){const rand=n=>{const v=Math.sin(n*127.1+311.7)*43758.5453;return v-Math.floor(v);},x=182+rand(i+1)*274,y=160+rand(i+41)*320;ray.set(new T.Vector3((x-320)*.005,(580-y)*.005,-3),new T.Vector3(0,0,1));const h=ray.intersectObject(back)[0];if(h){const pore=s.ellipsoid('RearBreadPore'+i,[x,y,h.point.z-.001],[3+i%3,4+i%4,.003],'#c7a06b',i*.6);pore.userData.skipOriginalPaint=true;}}
  g.userData.artworkOpaqueRegions=[{cx:320,cy:305,rx:119,ry:100}];
 }else{
  for(const o of [...g.children])if(/^RearSalmonFat/.test(o.name))g.remove(o);
  require('./smooth-paired-volume.cjs')(T,k,g,'SalmonFillet',{rings:24});
  const salmon=['Surface','Back'].map(x=>g.getObjectByName('SalmonFillet'+x));
  for(const o of salmon){o.userData.artworkFacingFade=[.35,.70];o.updateWorldMatrix(true,false);}
  const ray=new T.Raycaster();
  for(let line=0;line<6;line++){const ps=[];for(let j=0;j<=48;j++){const y=80+j*3.7,x=125+line*68+(y-145)*.30+7*Math.sin(j/48*Math.PI*2);ray.set(new T.Vector3((x-320)*.005,(580-y)*.005,-3),new T.Vector3(0,0,1));const h=ray.intersectObject(salmon[1])[0];if(h)ps.push([x,y,h.point.z-.002]);}if(ps.length>1){s.tube('RearSalmonFat'+line,ps,.023,'#ffc6a6');}}
  for(const o of g.children)if(/^RearSalmonFat/.test(o.name))o.userData.skipOriginalPaint=true;
  // Fill the upper rice underneath the fillet; it must meet the salmon curve.
  g.remove(g.getObjectByName('SushiRiceSolid'));const contour=[];for(let j=0;j<192;j++){const a=j/192*Math.PI*2,r=1+.017*Math.cos(a*22);contour.push([320+219*Math.cos(a)*r,309+119*Math.sin(a)*r]);}
  k.volume('FinishedSushiRice',contour,[320,309],head.part.pivot,.65,.65,g,k.solid('RiceColor','#faf6ed'),{art:false,samples:192});require('./smooth-paired-volume.cjs')(T,k,g,'FinishedSushiRice',{rings:28});const P=[],I=[];for(const name of ['Surface','Back']){const o=g.getObjectByName('FinishedSushiRice'+name),offset=P.length/3;P.push(...o.geometry.attributes.position.array);I.push(...Array.from(o.geometry.index.array,i=>i+offset));g.remove(o);}const rice=k.mesh('SushiRiceSolid',k.geometry(P,I),k.solid('FinishedRiceColor','#faf6ed'),g);rice.userData.artworkFacingFade=[.35,.70];rice.updateWorldMatrix(true,false);
  for(const o of g.children.filter(o=>/^RearSushiRiceGrain/.test(o.name))){const v=o.getWorldPosition(new T.Vector3());ray.set(new T.Vector3(v.x,v.y,-3),new T.Vector3(0,0,1));const h=ray.intersectObject(rice)[0];if(h)o.position.z=h.point.z-.009-g.position.z;}
  g.userData.artworkOpaqueRegions=[{cx:320,cy:305,rx:121,ry:98}];
 }
 for(const name of ['Torso','LeftArm','RightArm','LeftLeg','RightLeg']){
  const part=parts.get(name);if(!part)continue;part.group.clear();if(sandwich&&name.endsWith('Arm'))continue;
  const left=name.startsWith('Left');let ps,center,depth;
  if(sandwich&&name==='Torso'){ps=[[277,515],[363,515],[366,535],[354,552],[286,552],[274,535]];center=[320,531];depth=.24;}
  else if(name==='Torso'){ps=[[260,415],[380,415],[386,462],[379,503],[357,532],[320,540],[280,531],[258,503],[251,463]];center=[320,478];depth=.28;}
  else if(name.endsWith('Arm')){ps=[[252,418],[267,435],[252,466],[244,493],[231,505],[216,499],[215,483],[226,451],[240,430]].map(([x,y])=>[left?x:640-x,y]);center=[left?241:399,461];depth=.12;}
  else {ps=[[272,527],[308,531],[306,552],[300,573],[282,579],[260,574],[257,562],[266,544]].map(([x,y])=>[left?x:640-x,y]);center=[left?283:357,554];depth=.145;}
  const meshes=volume(part,'FinishedLunch'+name,ps,center,depth,sandwich?'#f4c494':'#f6f4ef');for(const o of meshes){o.userData.artworkFacingFade=[.35,.70];if(name!=='Torso')o.userData.skipOriginalPaint=true;}part.group.userData.directSurfaceArtwork=true;part.group.userData.artworkOpaqueRegions=[];require('./sculpt-kit.cjs')(T,k,part).paint();for(const o of meshes)ink(T,k,o,sandwich?'#a67852':'#a5a09a',.008);
 }
 g.userData.artworkOcclusion=true;require('./project-model-artwork.cjs')(T,k,g,head.part.pivot);
 if(!sandwich){ink(T,k,g.getObjectByName('SushiRiceSolid'),'#a59b91',.007);for(const suffix of ['Surface','Back'])ink(T,k,g.getObjectByName('SalmonFillet'+suffix),'#b05537',.005);}
};
