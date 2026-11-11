"use strict";
// Only individually reviewed costumes use this finish. Keep the original face
// opaque, while letting source outlines disappear as the volume turns away.
module.exports=function finishPaddedSuits(T,k,id,parts){
 if(!['animal-dog','animal-dolphin','animal-dragon','animal-dragonfly','animal-duck','animal-eagle','animal-elephant','animal-flamingo','animal-fox','animal-frog','animal-giraffe','animal-hedgehog','animal-hippopotamus','animal-kangaroo','animal-koala','animal-ladybug','animal-leopard-gecko','animal-lion','animal-llama','animal-meerkat','animal-monkey','animal-mouse','animal-ostrich','animal-owl','animal-panda','animal-peacock','animal-penguin','animal-praying-mantis','animal-rabbit','animal-ratsnake','animal-rhinoceros','animal-seal','animal-shark','animal-sloth','animal-snail','animal-squirrel','animal-tiger','animal-turtle','animal-unicorn','animal-viper','animal-whale','animal-wolf'].includes(id))return;
 const insect=['animal-dragonfly','animal-ladybug'].includes(id);
 const faces={'animal-dog':[320,332,124,94],'animal-dolphin':[320,338,124,94],'animal-dragon':[320,347,125,93],'animal-dragonfly':[320,299,90,76],'animal-duck':[320,340,124,90],'animal-eagle':[320,327,115,90],'animal-elephant':[320,352,112,87],'animal-flamingo':[320,333,103,84],'animal-fox':[320,343,124,98],'animal-frog':[320,323,126,103],'animal-giraffe':[320,296,110,78],'animal-hedgehog':[320,370,124,90],'animal-hippopotamus':[320,354,125,92],'animal-kangaroo':[296,333,118,88],'animal-koala':[320,340,123,88],'animal-ladybug':[318,318,120,94],'animal-leopard-gecko':[303,331,123,94],'animal-lion':[320,358,99,85],'animal-llama':[320,330,113,83],'animal-meerkat':[320,305,127,89],'animal-monkey':[320,330,123,95],'animal-mouse':[320,336,140,105],'animal-ostrich':[289,281,101,79],'animal-owl':[320,335,123,92],'animal-panda':[320,306,126,88],'animal-peacock':[320,337,118,91],'animal-penguin':[320,331,121,97],'animal-praying-mantis':[320,350,112,89],'animal-rabbit':[320,377,111,83],'animal-ratsnake':[317,313,140,109],'animal-rhinoceros':[318,320,121,91],'animal-seal':[289,286,127,99],'animal-shark':[320,344,116,100],'animal-sloth':[314,294,125,90],'animal-snail':[195,345,115,93],'animal-squirrel':[262,330,135,96],'animal-tiger':[311,337,133,102],'animal-turtle':[317,294,125,98],'animal-unicorn':[318,344,117,92],'animal-viper':[305,315,115,88],'animal-whale':[320,350,120,93],'animal-wolf':[320,340,127,99]};
 const [cx,cy,rx,ry]=faces[id];
 const inks={'animal-dog':'#79502a','animal-dolphin':'#4e6678','animal-dragon':'#2b4e25','animal-dragonfly':'#275b5c','animal-duck':'#ab701f','animal-eagle':'#66533f','animal-elephant':'#6c5a4c','animal-flamingo':'#874958','animal-fox':'#70351f','animal-frog':'#335920','animal-giraffe':'#785032','animal-hedgehog':'#6c5952','animal-hippopotamus':'#655f70','animal-kangaroo':'#75482c','animal-koala':'#555761','animal-ladybug':'#59251f','animal-leopard-gecko':'#7b4d26','animal-lion':'#80502a','animal-llama':'#a48762','animal-meerkat':'#775030','animal-monkey':'#654024','animal-mouse':'#416976','animal-ostrich':'#4b3c40','animal-owl':'#664730','animal-panda':'#444641','animal-peacock':'#185a71','animal-penguin':'#28282e','animal-praying-mantis':'#4d6d28','animal-rabbit':'#9b687d','animal-ratsnake':'#456b35','animal-rhinoceros':'#655b58','animal-seal':'#535d6a','animal-shark':'#194465','animal-sloth':'#65452f','animal-snail':'#81502b','animal-squirrel':'#80512e','animal-tiger':'#764416','animal-turtle':'#476b17','animal-unicorn':'#998c7b','animal-viper':'#52672e','animal-whale':'#225778','animal-wolf':'#55565b'};
 for(const [name,part]of parts){
  const group=part.group;
  if(insect)for(const o of [...group.children])if(o.name.startsWith('HoodEdgePiping'))group.remove(o);
  const solids=group.children.filter(o=>o.isMesh&&!o.material.userData.originalTexture);
  if(id==='animal-fox')for(const mesh of solids.filter(o=>o.name.startsWith('AnimalMuzzle')))mesh.material.color.set('#d47839').convertSRGBToLinear();
  if(id==='animal-flamingo')for(const mesh of solids.filter(o=>/^FlamingoHookedBeak/.test(o.name))){
   const p=mesh.geometry.attributes.position,C=[],pale=new T.Color('#e7b9b0').convertSRGBToLinear(),tip=new T.Color('#443437').convertSRGBToLinear();
   for(let i=0;i<p.count;i++){const y=part.part.pivot[1]-p.getY(i)/.005,t=Math.max(0,Math.min(1,(y-174)/12));C.push(...pale.clone().lerp(tip,t).toArray());}
   mesh.geometry.setAttribute('color',new T.Float32BufferAttribute(C,3));mesh.material.color.set(0xffffff);mesh.material.userData.preserveVertexColor=true;
  }
  group.userData.directSurfaceArtwork=true;group.userData.artworkOcclusion=true;
  group.userData.artworkOpaqueRegions=name==='Head'?[{cx,cy,rx,ry}]:[];
  for(const front of solids.filter(o=>o.name.endsWith('Surface'))){
   const back=group.getObjectByName(front.name.replace(/Surface$/,'Back'));if(!back)continue;
   const buckets=new Map();
   for(const mesh of [front,back]){
    const p=mesh.geometry.attributes.position,n=mesh.geometry.attributes.normal;
    for(let i=0;i<p.count;i++){
     const key=[p.getX(i),p.getY(i),p.getZ(i)].map(v=>Math.round(v*1e6)).join(',');
     if(!buckets.has(key))buckets.set(key,[]);buckets.get(key).push([n,i]);
    }
   }
   for(const list of buckets.values()){
    const sum=new T.Vector3();for(const[n,i]of list)sum.add(new T.Vector3().fromBufferAttribute(n,i));sum.normalize();
    for(const[n,i]of list)n.setXYZ(i,sum.x,sum.y,sum.z);
   }
  }
  for(const mesh of solids)mesh.userData.artworkFacingFade=[.18,.55];
  if(id==='animal-ostrich')for(const mesh of solids)if(/^(WhiteFeatherRuff|OstrichTailFeather|RoundedOstrichFan)/.test(mesh.name))mesh.userData.artworkFacingFade=[.55,.85];
  if(id==='animal-frog')for(const mesh of solids){
   if(/^(ConnectedFrogForearm|RaisedFrogArm)/.test(mesh.name))mesh.userData.skipOriginalPaint=true;
   if(/^(FrogPalm|RoundedFrogFinger|FrogFingerPad)/.test(mesh.name))mesh.userData.artworkExcludedRegions=[{cx:320,cy:287,rx:180,ry:144}];
   if(mesh.name.startsWith('FullFeatureHood'))mesh.userData.artworkExcludedRegions=[{cx:153,cy:380,rx:38,ry:48},{cx:487,cy:380,rx:38,ry:48}];
  }
  if(insect&&['LeftArm','RightArm','LeftLeg','RightLeg'].includes(name)){
   for(const o of [...group.children])if(o.isMesh&&o.material.userData.originalTexture)group.remove(o);
   for(const o of solids)o.userData.skipOriginalPaint=true;
  }else if(id==='animal-ladybug'&&name.includes('Wing')){const patterns=group.children.filter(o=>o.name.endsWith('WingPattern'));require('./project-model-artwork.cjs')(T,k,group,part.part.pivot);for(const p of patterns)group.add(p);}
  else if(!insect||!name.includes('Wing'))require('./project-model-artwork.cjs')(T,k,group,part.part.pivot);
  if(id==='animal-panda'&&name==='Head'){const art=group.getObjectByName('CostumeHoodOriginalPaint'),p=art.geometry.attributes.position,c=art.geometry.attributes.color;for(let i=0;i<p.count;i++){const x=p.getX(i)/.005+part.part.pivot[0],y=part.part.pivot[1]-p.getY(i)/.005,r=Math.hypot((x-320)/181,(y-237)/160);c.setW(i,c.getW(i)*Math.max(0,Math.min(1,(.985-r)/.075)));}}
  if(id==='animal-llama'&&name==='Head'){const art=group.getObjectByName('CostumeHoodOriginalPaint'),p=art.geometry.attributes.position,c=art.geometry.attributes.color;for(let i=0;i<p.count;i++){const x=p.getX(i)/.005+part.part.pivot[0],y=part.part.pivot[1]-p.getY(i)/.005,r=Math.hypot((x-320)/145,(y-250)/170);c.setW(i,c.getW(i)*Math.max(0,Math.min(1,(.975-r)/.10)));}}
  if(id==='animal-giraffe'&&name==='Head')for(const art of group.children.filter(o=>o.name==='CostumeHoodOriginalPaint')){const n=art.geometry.attributes.normal,c=art.geometry.attributes.color;for(let i=0;i<c.count;i++)c.setW(i,c.getW(i)*Math.max(0,Math.min(1,(n.getZ(i)-.15)/.25)));}
  if(['animal-eagle','animal-elephant'].includes(id)&&name==='Head')for(const art of group.children.filter(o=>o.name.startsWith('MeasuredCostumeHood')&&o.material.userData.originalTexture)){
   const n=art.geometry.attributes.normal,c=art.geometry.attributes.color;
   for(let i=0;i<c.count;i++)c.setW(i,c.getW(i)*Math.max(0,Math.min(1,(n.getZ(i)-.15)/.25)));
  }
  if(id==='animal-dragon')for(const mesh of solids){
   const boundary=mesh.userData.dragonArtworkBoundary,art=group.getObjectByName(mesh.name+'OriginalPaint');delete mesh.userData.dragonArtworkBoundary;if(!boundary||!art)continue;
   const p=art.geometry.attributes.position,c=art.geometry.attributes.color;
   for(let i=0;i<p.count;i++){
    let distance=Infinity;
    for(let j=0;j<boundary.length;j++){const a=boundary[j],b=boundary[(j+1)%boundary.length],dx=b.x-a.x,dy=b.y-a.y,t=Math.max(0,Math.min(1,((p.getX(i)-a.x)*dx+(p.getY(i)-a.y)*dy)/(dx*dx+dy*dy)));distance=Math.min(distance,Math.hypot(p.getX(i)-a.x-t*dx,p.getY(i)-a.y-t*dy));}
    c.setW(i,c.getW(i)*Math.max(0,Math.min(1,(distance-.04)/.06)));
   }
   delete mesh.userData.dragonArtworkBoundary;
  }
  if(['animal-fox','animal-frog'].includes(id))for(const mesh of solids){
   const boundary=mesh.userData.foxFrogArtworkBoundary,art=group.getObjectByName(mesh.name+'OriginalPaint');delete mesh.userData.foxFrogArtworkBoundary;if(!boundary||!art)continue;
   const p=art.geometry.attributes.position,c=art.geometry.attributes.color;
   for(let i=0;i<p.count;i++){
    let distance=Infinity;
    for(let j=0;j<boundary.length;j++){const a=boundary[j],b=boundary[(j+1)%boundary.length],dx=b.x-a.x,dy=b.y-a.y,t=Math.max(0,Math.min(1,((p.getX(i)-a.x)*dx+(p.getY(i)-a.y)*dy)/(dx*dx+dy*dy)));distance=Math.min(distance,Math.hypot(p.getX(i)-a.x-t*dx,p.getY(i)-a.y-t*dy));}
    c.setW(i,c.getW(i)*Math.max(0,Math.min(1,(distance-.025)/.045)));
   }
   delete mesh.userData.foxFrogArtworkBoundary;
  }
  if(['animal-hedgehog','animal-hippopotamus','animal-kangaroo','animal-koala','animal-leopard-gecko','animal-lion','animal-meerkat','animal-monkey','animal-mouse','animal-ostrich','animal-owl','animal-peacock','animal-penguin','animal-praying-mantis','animal-rabbit','animal-ratsnake','animal-rhinoceros','animal-seal','animal-shark','animal-sloth','animal-snail','animal-squirrel','animal-tiger','animal-turtle','animal-unicorn','animal-viper','animal-whale','animal-wolf'].includes(id))for(const mesh of solids){
   const boundary=mesh.userData.paddedBoundary,art=group.getObjectByName(mesh.name+'OriginalPaint');delete mesh.userData.paddedBoundary;if(!boundary||!art)continue;
   const p=art.geometry.attributes.position,c=art.geometry.attributes.color;
   for(let i=0;i<p.count;i++){
    let distance=Infinity;
    for(let j=0;j<boundary.length;j++){const a=boundary[j],b=boundary[(j+1)%boundary.length],dx=b.x-a.x,dy=b.y-a.y,t=Math.max(0,Math.min(1,((p.getX(i)-a.x)*dx+(p.getY(i)-a.y)*dy)/(dx*dx+dy*dy)));distance=Math.min(distance,Math.hypot(p.getX(i)-a.x-t*dx,p.getY(i)-a.y-t*dy));}
    c.setW(i,c.getW(i)*Math.max(0,Math.min(1,(distance-.025)/.045)));
   }
   delete mesh.userData.paddedBoundary;
  }
  for(const mesh of solids){
   if(id==='animal-rhinoceros'&&mesh.name.startsWith('RhinoClaw'))continue;
   if(id==='animal-sloth'&&mesh.name.startsWith('SlothClaw'))continue;
   if(id==='animal-snail'&&!/Surface$|Back$/.test(mesh.name))continue;
   if(id==='animal-squirrel'&&mesh.name.startsWith('SquirrelPalm'))continue;
   if(id==='animal-tiger'&&!/Surface$|Back$/.test(mesh.name))continue;
   if(id==='animal-turtle'&&mesh.name.startsWith('TurtleClaw'))continue;
   if(id==='animal-unicorn'&&!/Surface$|Back$/.test(mesh.name))continue;
   if(id==='animal-wolf'&&mesh.name.startsWith('AnimalMuzzle'))continue;
   if(['animal-ratsnake','animal-viper'].includes(id)&&/^(ConnectedSnakeTail|SnakeBellySeam)/.test(mesh.name))continue;
   if(id==='animal-penguin'&&mesh.name.startsWith('AnimalMuzzle'))continue;
   if(id==='animal-praying-mantis'&&!/Surface$|Back$/.test(mesh.name))continue;
   if(insect&&!/Surface$|Back$/.test(mesh.name))continue;
   if(['animal-monkey','animal-mouse'].includes(id)&&/^(InnerEar|MouseNose|AttachedTail)/.test(mesh.name))continue;
   if(id==='animal-ostrich'&&/^(OstrichRoundedBeak|OstrichTailFeather)/.test(mesh.name))continue;
   if(id==='animal-owl'&&/^(OwlEyeDisk|OwlBeak|OwlBrow)/.test(mesh.name))continue;
   if(id==='animal-panda'&&/^(Ear|InnerEar)/.test(mesh.name))continue;
   if(id==='animal-peacock'&&/^(PeacockBeak|Crown|PeacockFanRootSupport)/.test(mesh.name))continue;
   if(id==='animal-koala'&&mesh.name.startsWith('KoalaNose'))continue;
   if(id==='animal-llama'&&/^(AnimalMuzzle|SheepEarLining|FleeceCurl|ForeheadWool)/.test(mesh.name))continue;
   if(id==='animal-meerkat'&&/^(InnerEar|AttachedTail)/.test(mesh.name))continue;
   if(id==='animal-leopard-gecko'&&/^(GeckoEyeRidge|GeckoSmileMuzzle|GeckoRearSpot)/.test(mesh.name))continue;
   if(id==='animal-lion'&&(/^(AnimalMuzzle|InnerEar|AttachedTail|TailTuft)/.test(mesh.name)||['Torso','LeftArm','RightArm'].includes(name)))continue;
   if(id==='animal-hippopotamus'&&/^(InnerEar|AnimalMuzzle)/.test(mesh.name))continue;
   if(id==='animal-kangaroo'&&/^(AnimalMuzzle|Joey|KangarooPouch|BroadKangarooTail)/.test(mesh.name))continue;
   if(['animal-giraffe','animal-hedgehog'].includes(id)&&(/^(GiraffeRearPatch|GiraffeBodyPatch|RearHedgehogQuill|AnimalMuzzle)/.test(mesh.name)))continue;
   if(id==='animal-dragon'&&/^(DragonForeheadCrest|BroadReptileTail|DragonTailCrest)/.test(mesh.name))continue;
   if(id==='animal-dragon'&&name==='Head'&&!mesh.name.startsWith('ReptileCostumeHood'))continue;
   if(id==='animal-elephant'&&/^(ElephantTrunk|ElephantCrest|SeatedElephantCostumeHem)/.test(mesh.name))continue;
   if(id==='animal-fox'&&/^(AnimalMuzzle|AttachedCanineTail)/.test(mesh.name))continue;
   if(id==='animal-frog'&&name==='Head'&&!mesh.name.startsWith('FullFeatureHood'))continue;
   if(id==='animal-flamingo'&&name==='Head'&&!mesh.name.startsWith('FullFeatureHood'))continue;
   const g=mesh.geometry.clone();if(['animal-frog','animal-giraffe','animal-hippopotamus','animal-lion','animal-llama','animal-panda'].includes(id)){mesh.updateMatrix();g.applyMatrix4(mesh.matrix);}
   const p=g.attributes.position,n=g.attributes.normal,ix=g.index?.array;if(!ix)continue;
   const width=id==='animal-frog'?(name==='Head'?.04:.022):(name==='Head'?.012:.009);
   for(let i=0;i<p.count;i++)p.setXYZ(i,p.getX(i)+n.getX(i)*width,p.getY(i)+n.getY(i)*width,p.getZ(i)+n.getZ(i)*width);
   for(let i=0;i<ix.length;i+=3)[ix[i+1],ix[i+2]]=[ix[i+2],ix[i+1]];g.computeVertexNormals();
   const ink=k.mesh(mesh.name+'Silhouette',g,k.solid('PaddedSuitInk',inks[id]),group);
   if(!['animal-frog','animal-giraffe','animal-hippopotamus','animal-lion','animal-llama','animal-panda'].includes(id)){ink.position.copy(mesh.position);ink.quaternion.copy(mesh.quaternion);ink.scale.copy(mesh.scale);}
   ink.userData.skipOriginalPaint=true;ink.material.userData.alreadyShaded=true;
  }
 }
};
