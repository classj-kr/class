"use strict";
const profiles=require('./collection-profiles.cjs');
const heads={
 bear:[320,275,184,166,.72],chick:[320,297,186,160,.65],crab:[320,310,177,139,.65],crocodile:[320,282,166,139,.68],deer:[320,282,166,147,.65],dog:[320,279,171,153,.70],dolphin:[320,277,157,155,.67],dragon:[320,281,170,149,.70],dragonfly:[320,282,118,103,.48],duck:[320,275,177,160,.70],eagle:[320,266,163,157,.65],elephant:[310,274,144,155,.68],fox:[320,282,170,150,.70],giraffe:[320,262,140,142,.62],hedgehog:[320,306,147,155,.65],hippopotamus:[320,279,168,157,.73],kangaroo:[287,276,130,131,.61],koala:[320,279,162,151,.69],ladybug:[320,271,158,139,.63],'leopard-gecko':[320,277,169,145,.68],lion:[320,302,152,158,.68],llama:[320,280,128,130,.58],meerkat:[320,228,155,154,.66],monkey:[320,266,168,162,.68],mouse:[320,301,164,154,.65],octopus:[320,258,168,174,.72],ostrich:[290,244,116,104,.51],owl:[320,266,164,159,.69],panda:[320,279,181,155,.73],peacock:[320,301,120,129,.56],penguin:[320,279,172,155,.70],'praying-mantis':[320,274,145,143,.62],rabbit:[320,323,145,133,.62],ratsnake:[320,280,172,177,.72],rhinoceros:[320,280,155,158,.70],seal:[320,264,191,163,.76],shark:[320,293,146,155,.69],sloth:[320,271,161,162,.70],snail:[244,335,128,128,.58],squirrel:[287,274,151,140,.65],tiger:[320,280,169,157,.71],turtle:[320,275,184,159,.74],unicorn:[320,287,151,151,.68],viper:[320,278,154,158,.69],whale:[320,278,187,156,.76],wolf:[320,281,167,143,.69]
};
Object.assign(heads,{deer:[320,294,169,158,.65],hedgehog:[320,303,181,224,.65],snail:[195,311,154,143,.56]});
// Landmarks of the cleaned, compact source illustrations.
Object.assign(heads,{rhinoceros:[319,265,155,156,.70],giraffe:[320,244,134,131,.62],meerkat:[320,221,169,161,.66],tiger:[311,260,198,185,.77]});
Object.assign(heads,{llama:[320,250,145,170,.64]});
Object.assign(heads,{panda:[320,237,181,160,.73],squirrel:[262,249,196,181,.72],hedgehog:[320,302,167,150,.70]});
module.exports=function animalCostume(THREE,k,id,parts){
 const species=id.replace('animal-',''),spec=heads[species];if(!spec)return false;
 const head=parts.get('Head'),s=require('./sculpt-kit.cjs')(THREE,k,head),p=profiles[id],color=p.headColor,cream='#f2d8ad',dark='#574032';s.parent.clear();
 const [cx,cy,rx,ry,depth]=spec;
 const hood=s.ellipsoid('CostumeHood', [cx,cy,0],[rx,ry,depth],color);
 const egg=(n,x,y,a,b,d,c=color,z=0,rot=0)=>s.ellipsoid(n,[x,y,z],[a,b,d],c,rot);
 const leaf=(n,base,tip,w,c=color,z=0)=>{
 const dx=tip[0]-base[0],dy=tip[1]-base[1],len=Math.hypot(dx,dy),ps=[];
 for(const side of [1,-1])for(let j=0;j<=12;j++){const t=side>0?j/12:1-j/12,a=Math.sin(t*Math.PI)*w;ps.push([base[0]+dx*t-dy/len*a*side,base[1]+dy*t+dx/len*a*side]);}
 k.volume(n,ps,[(base[0]+tip[0])/2,(base[1]+tip[1])/2],s.pivot,.10,.10,s.parent,k.solid(n+'Color',c),{art:false,z,samples:48});
 };
 const surfaceZ=(x,y)=>depth*Math.sqrt(Math.max(.02,1-((x-cx)/rx)**2-((y-cy)/ry)**2));
 function conformPatch(patch,carriers){
  patch.updateMatrix();patch.geometry=patch.geometry.clone().applyMatrix4(patch.matrix);patch.position.set(0,0,0);patch.rotation.set(0,0,0);patch.scale.set(1,1,1);s.parent.updateWorldMatrix(true,true);
  const p=patch.geometry.attributes.position,ray=new THREE.Raycaster(),world=new THREE.Vector3();patch.geometry.computeBoundingBox();const box=patch.geometry.boundingBox,dz=Math.max(.0001,box.max.z-box.min.z);
  for(let i=0;i<p.count;i++){const t=(p.getZ(i)-box.min.z)/dz;world.set(p.getX(i),p.getY(i),0).applyMatrix4(s.parent.matrixWorld);world.z=4;ray.set(world,new THREE.Vector3(0,0,-1));const hit=ray.intersectObjects(carriers)[0];if(hit)p.setZ(i,s.parent.worldToLocal(hit.point.clone()).z-.004+t*.016);}
  patch.geometry.computeVertexNormals();return patch;
 }
 function roundEars(x,y,a,b,inner=cream){for(const side of [-1,1]){const c=species==='panda'?'#343533':color,outer=egg('Ear'+side,cx+side*x,y,a,b,.20,c,-.07,side*.15),lining=egg('InnerEar'+side,cx+side*x,y+2,a*.63,b*.68,.025,species==='panda'?c:inner,.13,side*.15);conformPatch(lining,[outer]);const joinY=cy-ry*Math.sqrt(Math.max(0,1-(x/rx)**2));if(y+b<joinY+8)egg('EarRoot'+side,cx+side*x,(y+b+joinY)/2,a*.50,(joinY-y-b)/2+13,.15,c,-.065);}}
 function pointedEars(x,y,w,h,inner='#e6b8ac'){for(const side of [-1,1]){
  const ex=cx+side*x,outline=[[ex-side*w,y+h],[ex+side*w*.15,y-h*1.20],[ex+side*w,y+h*.7]];
  const before=new Set(s.parent.children);
  k.volume('PointedEar'+side,outline,[ex,y+h*.35],s.pivot,.22,.22,s.parent,k.solid('EarColor'+side,color),{art:false,z:-.08,samples:48});
  const carriers=s.parent.children.filter(o=>!before.has(o)),lining=s.outline('EarLining'+side,[[ex-side*w*.55,y+h*.5],[ex+side*w*.12,y-h*.68],[ex+side*w*.6,y+h*.42]],.025,inner,.13,.008);conformPatch(lining,carriers);
 }}
 function muzzle(x,y,a,b,c=cream,z=.60,front=.075,name='AnimalMuzzle'){const solidBeak=['duck','eagle','penguin','peacock','ostrich','owl','crocodile'].includes(species);if(solidBeak)return egg(name,x,y,a,b,.15,c,z);
  // A shallow muzzle is part of the hood surface, not a flat oval suspended
  // at the depth of its center. Conform its full rim to the underlying hood.
  const names=new Set(s.parent.children);k.volume(name,k.ellipse(x,y,a,b),[x,y],s.pivot,front,.035,s.parent,k.solid(name+'Color',c),{art:false,samples:48});
  for(const mesh of s.parent.children.filter(o=>!names.has(o))){const p=mesh.geometry.attributes.position;for(let i=0;i<p.count;i++){const px=p.getX(i)/.005+s.pivot[0],py=s.pivot[1]-p.getY(i)/.005;p.setZ(i,p.getZ(i)+surfaceZ(px,py)-.008);}mesh.geometry.computeVertexNormals();}
 }
 function rearMarks(kind){
  const locations=[[-.47,-.43],[-.03,-.59],[.45,-.42],[-.66,-.02],[.28,-.11],[-.29,.27],[.58,.27],[.02,.57]];
  if(kind==='giraffe'){
   const centers=locations.map(([u,v])=>new THREE.Vector3(u,-v,-Math.sqrt(1-u*u-v*v)));
   for(const [j,center] of centers.entries()){
    const u=new THREE.Vector3().crossVectors(new THREE.Vector3(0,1,0),center).normalize(),v=new THREE.Vector3().crossVectors(center,u).normalize(),P=[],I=[],n=42,rings=8;
    for(let row=0;row<=rings;row++)for(let i=0;i<n;i++){
     const a=i/n*Math.PI*2,r=(.135+j%3*.025)*(1+.12*Math.sin(a*5+j))*row/rings;
     const q=center.clone().addScaledVector(u,Math.cos(a)*r).addScaledVector(v,Math.sin(a)*r).normalize();P.push(...s.point([cx+q.x*rx*1.005,cy-q.y*ry*1.005,q.z*depth*1.005]));
    }
    for(let row=0;row<rings;row++)for(let i=0;i<n;i++){const a=row*n+i,b=row*n+(i+1)%n,c=a+n,d=b+n;I.push(a,d,b,a,c,d);}
    const material=k.solid('GiraffePatchColor'+j,'#9b6b3c');
    const patch=k.mesh('GiraffeRearPatch'+j,k.geometry(P,I),material,head.group);patch.userData.skipOriginalPaint=true;
   }
   return;
  }
  for(const [i,[u,v]] of locations.entries()){
   const x=cx+u*rx,y=cy+v*ry,z=-depth*Math.sqrt(1-u*u-v*v)-.012;
   const patch=egg('RearMark'+i,x,y,kind==='spots'?14:23,kind==='spots'?11:27,.015,kind==='spots'?'#86552f':'#9b6b3c',z,i*.7);patch.rotation.y=-u*.6;patch.rotation.x=v*.6;
  }
 }
 if(['bear','mouse','koala','panda','lion'].includes(species)){
  const config={bear:[135,132,46,47],mouse:[160,171,72,70],koala:[174,188,76,78],panda:[139,118,47,47],tiger:[135,118,45,47],meerkat:[139,143,32,40],lion:[108,187,34,37]}[species];roundEars(...config,species==='koala'?'#d59ea5':cream);
 }
 if(species==='tiger'||species==='meerkat')for(const side of [-1,1]){
  const tiger=species==='tiger',x=(tiger?311:320)+side*(tiger?139:169),y=tiger?124:189;
  const outer=egg('Ear'+side,x,y,tiger?62:39,tiger?69:56,.24,tiger?'#9a5c2b':'#815234',-.04,side*.22);
  const inner=egg('InnerEar'+side,x,y+5,tiger?42:25,tiger?47:37,.035,tiger?'#ffe9b3':'#a46d40',.20,side*.22);
  // Keep the ear paint on the front and the dark costume lining on its sides.
  outer.userData.skipOriginalPaint=false;inner.userData.skipOriginalPaint=false;
 }
 if(['fox','wolf','squirrel'].includes(species))pointedEars(species==='squirrel'?130:116,species==='squirrel'?117:139,species==='squirrel'?35:44,species==='squirrel'?45:68);
 if(species==='bear'){muzzle(320,201,61,38,'#c6925e',.65);muzzle(320,191,20,15,'#51301b',.67,.13,'BearNose');}
 if(species==='chick'){
  for(let i=0;i<22;i++){const a=i/22*Math.PI*2;egg('DownFeather'+i,cx+Math.cos(a)*(rx-6),cy+Math.sin(a)*(ry-4),14,15,.09,'#ffe49a',0);}
  for(let i=0;i<3;i++)egg('CrestTuft'+i,307+i*15,112-i%2*14,12,25,.11,'#f3d17a',0,(i-1)*.4);
  muzzle(320,215,35,22,'#e8a83c',.61);
 }
 if(species==='crab'){
  for(const side of [-1,1]){
   s.tube('CrabEyeStalk'+side,[[cx+side*48,185,0],[cx+side*51,139,.10]],.065,'#b83c32');egg('CrabEye'+side,cx+side*51,137,18,25,.13,'#d25740',.10);
   s.sweep('CrabClawArm'+side,[[cx+side*126,247,-.1,15],[cx+side*177,200,-.05,17],[cx+side*190,157,0,24]],color);
   for(const sign of [-1,1])s.sweep('CrabPincer'+side+'_'+sign,[[cx+side*190,157,0,28],[cx+side*190+sign*22,132,.02,20],[cx+side*190+sign*23,98,0,4]],color);
   for(let i=0;i<3;i++)s.sweep('CrabLegDecoration'+side+'_'+i,[[cx+side*155,240+i*38,-.1,12],[cx+side*205,230+i*38,-.1,10],[cx+side*223,251+i*38,-.1,3]],color);
  }
 }
 if(['crocodile','dragon','viper','leopard-gecko'].includes(species)){
  const long=species==='crocodile';muzzle(long?258:320,long?202:188,long?120:123,long?44:40,color,.62);
  for(const side of [-1,1])egg('ReptileEyeBrow'+side,320+side*(long?60:115),long?155:147,31,36,.18,color,.48);
  if(species==='crocodile'||species==='dragon')for(let i=0;i<7;i++)s.cone('CostumeTooth'+i,[218+i*33,238,.75],.033,.09,'#fff1cf',[0,-1,0]);
  if(species==='dragon'){s.cone('ForeheadCrest',[320,127,0],.12,.30,'#d1c15b');for(let i=0;i<4;i++){const y=175+i*57,v=(y-cy)/ry,z=-depth*Math.sqrt(Math.max(.02,1-v*v));s.cone('BackCrest'+i,[320,y,z-.02],.075,.17,'#d1c15b',[0,.3,-1]);}}
  if(species==='leopard-gecko')rearMarks('spots');
  if(species==='viper')for(let row=0;row<4;row++)for(let col=0;col<3;col++){const u=(col-1)*.32,v=(row-1.5)*.22;egg('Scale'+row+'_'+col,cx+u*rx,cy+v*ry,23,19,.018,'#709449',-depth*Math.sqrt(1-u*u-v*v)-.008);}
 }
 if(species==='deer'){
  for(const side of [-1,1]){leaf('SideEar'+side,[cx+side*111,225],[cx+side*203,153],36,color,-.04);leaf('InnerSideEar'+side,[cx+side*128,214],[cx+side*183,167],21,cream,.04);
   if(species==='deer'){s.tube('AntlerStem'+side,[[cx+side*84,164,-.03],[cx+side*104,132,-.04],[cx+side*120,105,-.04],[cx+side*120,79,0]],.075,'#715037');s.tube('AntlerFork'+side,[[cx+side*105,132,-.04],[cx+side*83,114,-.04],[cx+side*80,99,-.04]],.065,'#715037');}
   else{s.tube('Ossicone'+side,[[cx+side*56,143,0],[cx+side*63,97,0]],.055,'#b57949');egg('OssiconeTip'+side,cx+side*63,91,15,16,.074,'#8e5d36');}
  }
  muzzle(320,species==='deer'?256:222,species==='deer'?43:61,28,'#eed3a0',.57);if(species==='giraffe')rearMarks('giraffe');
 }
 if(species==='giraffe'){
  for(const side of [-1,1]){
   const ex=320+side*113;
   egg('GiraffeEar'+side,ex,134,43,25,.16,color,-.03,side*-.47);
   egg('GiraffeEarLining'+side,ex,134,29,14,.022,'#efd3a7',.14,side*-.47);
   s.tube('Ossicone'+side,[[320+side*37,126,0],[320+side*39,85,0]],.043,'#bb844b');
   egg('OssiconeTip'+side,320+side*39,80,18,18,.085,'#b77b48');
  }
  muzzle(320,212,48,33,'#edc88f');rearMarks('giraffe');
 }
 if(species==='dog'){
  for(const side of [-1,1])egg('DroopingEar'+side,cx+side*163,231,42,101,.26,'#d99f4d',-.03,side*.27);
  muzzle(320,218,63,37,'#f5dca1',.66);muzzle(320,198,22,15,dark,.66,.13,'DogNose');muzzle(328,244,14,21,'#dc8d86',.60,.10,'Tongue');
 }
 if(['duck','eagle','owl','penguin','peacock','ostrich'].includes(species)){
  const beaks={duck:[320,222,93,34],eagle:[320,230,67,49],owl:[320,225,22,24],penguin:[320,229,37,19],peacock:[320,232,24,20],ostrich:[290,187,39,19]};const q=beaks[species];muzzle(...q,'#e6b04b',depth*.83);
  if(species==='eagle')s.cone('EagleHook',[320,261,.69],.13,.22,'#db9e35',[0,-1,.3]);
  if(species==='owl')for(const side of [-1,1]){egg('OwlEyeRim'+side,cx+side*80,179,67,67,.08,'#e2c895',.48);leaf('OwlBrow'+side,[cx+side*15,159],[cx+side*168,110],18,'#6f5137',.43);}
  if(species==='peacock')for(const side of [-1,0,1]){s.tube('CrownStem'+side,[[320,175,0],[320+side*32,124,0]],.022,'#397a87');egg('CrownFeather'+side,320+side*32,115,12,17,.06,'#6aa49e');}
 }
 if(['dolphin','shark','whale'].includes(species)){
  for(const side of [-1,1])leaf('HeadFlipper'+side,[cx+side*(rx-20),325],[cx+side*(rx+35),367],18,color,-.07);
  if(species==='dolphin')muzzle(320,221,62,28,'#87a6ba',.65);
  if(species==='shark'){s.outline('DorsalFin',[[284,161],[316,75],[335,86],[352,163]],.19,'#527a97',-.15,.035);for(let i=0;i<8;i++)s.cone('SharkTooth'+i,[220+i*28,251,.59],.034,.10,'#fff1d9',[0,-1,0]);}
  if(species==='whale')for(const side of [-1,0,1]){const water=s.sweep('WaterSpout'+side,[[320,162,0,10],[320,128,0,13],[320+side*30,94,0,19],[320+side*57,105,0,7]],'#74bddc');water.userData.skipOriginalPaint=true;}
 }
 if(species==='elephant'){
  for(const side of [-1,1]){egg('ElephantEar'+side,cx+side*161,191,90,97,.19,color,-.07,side*.25);egg('ElephantInnerEar'+side,cx+side*161,193,64,70,.028,'#8c8274',.13,side*.25);}
  s.sweep('ElephantTrunk',[[310,192,.62,30],[314,234,.72,29],[314,270,.76,23],[304,306,.76,12]],'#a9a294');
 }
 if(species==='fox'||species==='wolf'){
  for(const side of [-1,1])k.volume('CheekTuft'+side,[[cx+side*110,214],[cx+side*192,277],[cx+side*166,299],[cx+side*191,318],[cx+side*117,370]],[cx+side*139,292],s.pivot,.39,.39,s.parent,k.solid('CheekColor'+side,color),{art:false,z:-.05,samples:64});
  muzzle(320,211,51,28,species==='wolf'?'#d2cebf':'#f0d3a7',.63);
 }
 if(species==='hedgehog'||species==='lion'){
  const c=species==='lion'?'#99612f':'#8d8079';
  if(species==='lion'){
   const contour=[];for(let i=0;i<96;i++){const a=i/96*Math.PI*2,r=1+.035*Math.sin(a*14)+.015*Math.sin(a*23);contour.push([320+Math.cos(a)*219*r,278+Math.sin(a)*211*r]);}
   k.volume('FullLionMane',contour,[320,278],s.pivot,.64,.85,s.parent,k.solid('LionManeColor','#a86c32'),{art:false,z:-.16,samples:128});
  }else{
   hood.material.color.set('#e4bdaa').convertSRGBToLinear();
   egg('HedgehogQuillCoat',320,307,207,228,.81,'#92847c',-.25);
   for(let i=0;i<230;i++){const y=1-2*(i+.5)/230,r=Math.sqrt(1-y*y),a=i*2.399963,q=new THREE.Vector3(Math.cos(a)*r,y,Math.sin(a)*r);if(q.z>.17)continue;
    const normal=new THREE.Vector3(q.x/1.035,q.y/1.14,q.z/.81).normalize(),h=.11+(i%3)*.014,x=320+q.x*207+normal.x*(h/2-.018)/.005,py=307-q.y*228-normal.y*(h/2-.018)/.005,z=-.25+q.z*.81+normal.z*(h/2-.018);
    s.cone('RearHedgehogQuill'+i,[x,py,z],.055,h,i%4?'#92847c':'#867971',normal.toArray());
   }
  }
  muzzle(320,species==='lion'?230:220,49,28,species==='lion'?'#e9b64f':'#d1aa96',.62);
 }
 if(species==='hippopotamus'){roundEars(119,121,24,27);muzzle(320,211,132,52,'#a8a4b3',.61);}
 if(species==='kangaroo'){for(const side of [-1,1]){egg('KangarooEar'+side,cx+side*92,139,32,92,.18,color,-.10,side*-.25);egg('KangarooEarInside'+side,cx+side*92,139,17,67,.022,'#d69c7f',.08,side*-.25);}muzzle(cx,219,46,25,cream,.57);}
 if(species==='llama'){
  for(const side of [-1,1]){egg('SheepEar'+side,cx+side*120,110,26,55,.15,'#e3ccaa',-.02,side*.2);egg('SheepEarLining'+side,cx+side*120,110,13,33,.020,'#d8aa95',.11,side*.2);}
  for(let i=0;i<24;i++){const a=i/24*Math.PI*2;egg('FleeceCurl'+i,cx+Math.cos(a)*(rx-13),cy+Math.sin(a)*(ry-15),23,24,.16,'#ebdbbc',-.04);}
  for(let i=0;i<70;i++){const y=1-2*(i+.5)/70,r=Math.sqrt(1-y*y),a=i*2.399963,q=new THREE.Vector3(Math.cos(a)*r,y,Math.sin(a)*r);if(q.z>-.12)continue;egg('RearFleeceCurl'+i,cx+q.x*rx*.94,cy-q.y*ry*.94,25,27,.14,i%3?'#ebdbbc':'#f1e0bd',q.z*depth*.94);}
  for(let i=0;i<7;i++){const x=240+i*27,y=135-(i%2)*7;egg('ForeheadWool'+i,x,y,25,25,.14,'#f1e0bd',surfaceZ(x,y)-.06);}
  muzzle(320,223,40,26,'#e1c6a2',.55);
 }
 if(species==='monkey')roundEars(179,261,54,61,'#bb864b');
 if(species==='mouse')muzzle(320,240,24,29,'#a65438',.65);
 if(species==='koala')muzzle(320,191,29,44,'#454743',.64,.15,'KoalaNose');
 if(species==='ladybug'||species==='dragonfly'||species==='praying-mantis'){
  for(const side of [-1,1]){s.tube('InsectAntenna'+side,[[cx+side*60,cy-ry+20,.16],[cx+side*85,cy-ry-27,.06],[cx+side*111,cy-ry-56,0]],.025,species==='ladybug'?'#543c36':'#4d6f55');if(species==='ladybug')egg('AntennaTip'+side,cx+side*111,cy-ry-56,13,13,.063,'#543c36');}
  if(species==='praying-mantis')for(const side of [-1,1])egg('MantisEye'+side,cx+side*127,169,48,52,.23,'#a8b24d',.21);
 }
 if(species==='octopus'){
  for(let i=0;i<8;i++){const a=i/8*Math.PI*2,x=320+Math.cos(a)*125,z=Math.sin(a)*.50;s.sweep('OctopusArm'+i,[[320+Math.cos(a)*70,413,Math.sin(a)*.30,24],[x,488,z,22],[320+Math.cos(a)*192,520,z*.85,16],[320+Math.cos(a)*222,484,z*.75,3]],'#aa72ab');}
  s.torus('OctopusMouth',[320,203,.68],.11,.035,'#d39ac4');
 }
 if(species==='rabbit')for(const side of [-1,1]){egg('RabbitEar'+side,320+side*76,172,34,106,.18,'#edb3c6',-.06,side*-.19);egg('RabbitInnerEar'+side,320+side*76,171,18,79,.021,'#d981a3',.13,side*-.19);}
 if(species==='rhinoceros'){
  for(const side of [-1,1]){
   egg('RhinoEar'+side,319+side*117,103,27,47,.20,'#a09a99',-.04,side*-.35);
   egg('RhinoEarLining'+side,319+side*117,100,18,34,.023,'#e6b0ae',.16,side*-.35);
  }
  muzzle(318,216,65,35,'#a29b9a');
  s.cone('MainRhinoHorn',[319,144,.63],.17,.64,'#dedbd9',[0,.97,.24]);
 }
 if(species==='seal'){muzzle(320,213,67,29,'#e1dfe1',.71);muzzle(320,201,22,13,'#51434b',.71,.13,'SealNose');}
 if(species==='sloth')roundEars(122,174,27,32,'#b59a7b');
 if(species==='snail'){
  egg('SnailShell',427,353,163,185,.58,'#b88150',-.25);egg('SnailFoot',347,536,210,38,.29,'#e8c8a0',-.04);egg('SnailNeck',218,462,83,100,.43,'#e8c8a0',-.05);
  const ps=[];for(let i=0;i<=100;i++){const t=i/100,a=t*Math.PI*4.3,r=126*(1-t);const x=442+Math.cos(a)*r,y=377+Math.sin(a)*r,z=-.25+.58*Math.sqrt(Math.max(.02,1-((x-427)/163)**2-((y-353)/185)**2));ps.push([x,y,z+.012]);}s.tube('ShellSpiral',ps,.022,'#80512e');
  for(const side of [-1,1]){s.sweep('SnailEyeStalk'+side,[[192+side*57,208,0,13],[192+side*78,140,0,11],[192+side*99,91,0,18]],'#c79c70');egg('SnailEye'+side,192+side*99,91,9,11,.035,'#513a2a',.08);}
 }
 if(species==='unicorn'){
  for(const side of [-1,1]){egg('UnicornEar'+side,320+side*97,144,26,58,.16,'#f2e9db',-.06,side*-.20);egg('UnicornEarInside'+side,320+side*97,144,13,38,.025,'#e1a7b0',.10,side*-.20);}
  s.cone('UnicornHorn',[320,121,.20],.13,.58,'#edbc50',[0,1,0]);
  for(const [i,c] of ['#e899b0','#92c9d6','#c59dc7'].entries())s.sweep('UnicornMane'+i,[[294+i*16,160,.53,21],[327+i*16,193,.58,18],[315+i*18,227,.58,9]],c);
 }
 if(species==='tiger'){
  muzzle(320,208,66,30,'#f2db9c',.64);
  // Stripes are part of the curved hood surface, never floating flat decals.
  hood.material.color.set('#f6a338').convertSRGBToLinear();
  for(let row=0;row<4;row++)for(const side of [-1,1]){
   const P=[],I=[],steps=48,lanes=6;
   for(let j=0;j<=steps;j++){
    const u=j/steps,longitude=side*(.34+u*1.40),center=.57-row*.38+.10*Math.sin(u*Math.PI+row*.6),width=.065*Math.pow(Math.sin(u*Math.PI),.75);
    for(let lane=0;lane<=lanes;lane++){
     const latitude=center+(lane/lanes*2-1)*width,q=new THREE.Vector3(Math.sin(longitude)*Math.cos(latitude),Math.sin(latitude),-Math.cos(longitude)*Math.cos(latitude));
     P.push(...s.point([cx+q.x*rx*1.005,cy-q.y*ry*1.005,q.z*depth*1.005]));
    }
   }
   for(let j=0;j<steps;j++)for(let lane=0;lane<lanes;lane++){const a=j*(lanes+1)+lane,b=a+1,c=a+lanes+1,d=c+1;side>0?I.push(a,b,d,a,d,c):I.push(a,d,b,a,c,d);}
   const material=k.solid('TigerStripeColor','#694024');
   const stripe=k.mesh('TigerStripe'+side+'_'+row,k.geometry(P,I),material,head.group);stripe.userData.skipOriginalPaint=true;
  }
 }
 s.paint();head.special=true;head.authoredFamily='animal-costume';
 return true;
};
module.exports.ids=Object.keys(heads).map(s=>'animal-'+s);
