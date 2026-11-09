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
Object.assign(heads,{duck:[320,278,177,164,.70]});
module.exports=function animalCostume(THREE,k,id,parts){
 const species=id.replace('animal-',''),spec=heads[species];if(!spec)return false;
 const head=parts.get('Head'),s=require('./sculpt-kit.cjs')(THREE,k,head),p=profiles[id],color=p.headColor,cream='#f2d8ad',dark='#574032';s.parent.clear();
 const [cx,cy,rx,ry,depth]=spec;
 const hood=s.ellipsoid('CostumeHood', [cx,cy,0],[rx,ry,depth],color),hoodCarriers=[];
 const measuredHoods={
  mouse:[[320,113],[365,116],[409,132],[448,159],[476,196],[494,238],[503,280],[498,324],[480,366],[450,401],[412,426],[366,443],[320,447],[274,443],[228,426],[190,401],[160,366],[142,324],[137,280],[146,238],[164,196],[192,159],[231,132],[275,116]],
  sloth:[[320,62],[345,66],[361,78],[394,93],[428,119],[457,153],[478,195],[493,239],[495,278],[483,315],[459,347],[424,375],[382,391],[338,399],[296,399],[253,389],[213,370],[180,342],[155,308],[144,270],[145,229],[156,190],[178,152],[209,119],[246,93],[282,77],[291,65]],
  turtle:[[320,62],[367,69],[408,88],[445,118],[472,157],[489,200],[496,244],[491,285],[475,326],[449,359],[414,383],[371,398],[327,405],[283,401],[241,387],[204,365],[175,333],[155,295],[146,251],[150,207],[164,164],[187,125],[220,95],[266,73]],
  unicorn:[[320,173],[362,173],[399,188],[430,214],[452,249],[465,287],[470,327],[465,365],[448,397],[423,423],[387,441],[348,445],[309,445],[270,440],[233,425],[202,407],[180,378],[169,342],[165,306],[174,270],[191,234],[215,204],[248,184],[284,174]],
  dolphin:[[320,62],[370,69],[416,90],[454,122],[481,166],[498,216],[504,264],[499,310],[480,354],[450,393],[411,421],[365,440],[320,445],[275,440],[229,421],[190,393],[160,354],[141,310],[136,264],[142,216],[159,166],[186,122],[224,90],[270,69]],
  penguin:[[320,62],[366,67],[413,86],[450,114],[477,152],[495,197],[503,244],[500,290],[485,336],[460,374],[426,405],[383,428],[340,436],[300,436],[257,428],[214,405],[180,374],[155,336],[140,290],[137,244],[145,197],[163,152],[190,114],[227,86],[274,67]],
  seal:[[294,62],[340,66],[386,83],[422,112],[449,151],[465,195],[469,239],[459,282],[436,322],[404,355],[365,379],[321,392],[281,393],[238,381],[198,359],[163,328],[139,291],[124,249],[120,208],[129,166],[151,129],[180,98],[219,76],[259,64]],
  whale:[[320,142],[365,149],[408,170],[445,199],[472,236],[487,278],[489,319],[478,361],[456,398],[423,428],[380,448],[336,455],[301,455],[260,445],[222,424],[188,392],[164,353],[151,312],[150,271],[163,231],[187,196],[220,168],[267,149]],
  shark:[[320,110],[358,119],[395,142],[426,172],[451,209],[470,250],[480,295],[478,337],[463,379],[439,413],[407,438],[367,454],[320,460],[273,454],[233,438],[201,413],[177,379],[162,337],[160,295],[170,250],[189,209],[214,172],[245,142],[282,119]],
  eagle:[[320,61],[367,63],[411,78],[446,101],[465,134],[477,172],[484,215],[480,259],[465,304],[449,335],[453,359],[468,381],[444,378],[419,367],[418,403],[389,392],[370,382],[352,416],[332,404],[318,424],[300,402],[275,413],[262,383],[225,404],[224,368],[199,379],[176,386],[190,360],[192,337],[177,308],[163,270],[158,229],[161,185],[171,145],[187,110],[213,86],[259,66]],
  owl:[[320,61],[369,65],[414,80],[452,109],[479,149],[498,192],[508,239],[509,285],[498,329],[475,368],[439,400],[395,422],[350,432],[305,434],[260,427],[217,411],[181,384],[155,349],[138,308],[130,266],[134,222],[147,178],[169,138],[201,105],[241,80],[282,65]],
  elephant:[[320,78],[354,83],[391,101],[427,134],[456,174],[475,217],[483,260],[476,305],[452,339],[444,374],[425,399],[390,416],[350,428],[310,429],[270,420],[234,404],[208,378],[196,347],[174,324],[159,289],[155,253],[167,207],[192,160],[227,122],[270,94]],
  hippopotamus:[[320,70],[369,75],[417,91],[450,117],[469,154],[481,184],[499,218],[511,260],[511,301],[500,342],[476,381],[443,412],[400,434],[357,444],[320,448],[283,444],[240,434],[197,412],[164,381],[140,342],[129,301],[129,260],[141,218],[159,184],[171,154],[190,117],[223,91],[271,75]],
  kangaroo:[[296,144],[342,148],[381,168],[407,200],[429,241],[442,280],[442,315],[431,349],[407,377],[371,400],[334,411],[296,416],[258,411],[221,400],[185,377],[161,349],[150,315],[150,280],[163,241],[185,200],[211,168],[250,148]],
  monkey:[[320,60],[341,79],[381,98],[422,124],[458,157],[483,199],[498,241],[502,281],[494,324],[475,364],[444,392],[406,412],[361,424],[320,430],[279,424],[234,412],[196,392],[165,364],[146,324],[138,281],[142,241],[157,199],[182,157],[218,124],[259,98],[299,79]],
  rabbit:[[320,196],[358,198],[396,214],[426,244],[450,281],[466,322],[470,358],[458,394],[434,427],[399,453],[358,466],[320,470],[282,466],[241,453],[206,427],[182,394],[170,358],[174,322],[190,281],[214,244],[244,214],[282,198]],
  chick:[[320,117],[364,118],[399,129],[425,143],[426,151],[448,166],[458,181],[458,188],[479,209],[487,219],[481,230],[493,245],[497,256],[488,268],[499,281],[502,299],[497,308],[495,340],[491,363],[480,387],[463,410],[438,428],[412,440],[386,450],[354,455],[320,456],[286,455],[254,450],[228,440],[202,428],[177,410],[160,387],[149,363],[145,340],[143,308],[138,299],[141,281],[152,268],[143,256],[147,245],[159,230],[153,219],[161,209],[182,188],[182,181],[192,166],[214,151],[215,143],[241,129],[276,118]],
  hedgehog:[[320,178],[353,164],[385,159],[418,170],[450,197],[472,232],[487,271],[488,318],[473,368],[446,409],[407,437],[361,453],[320,458],[279,453],[233,437],[194,409],[167,368],[152,318],[153,271],[168,232],[190,197],[222,170],[255,159],[287,164]],
  meerkat:[[320,60],[365,67],[406,88],[438,117],[462,154],[480,195],[492,235],[487,280],[466,319],[435,350],[394,371],[355,382],[320,386],[285,382],[246,371],[205,350],[174,319],[153,280],[148,235],[160,195],[178,154],[202,117],[234,88],[275,67]],
  rhinoceros:[[319,104],[375,113],[420,140],[449,180],[468,229],[477,280],[470,330],[451,367],[416,397],[374,418],[319,425],[264,418],[222,397],[187,367],[168,330],[161,280],[170,229],[189,180],[218,140],[263,113]],
  bear:[[320,75],[383,86],[439,120],[482,172],[507,228],[514,286],[499,347],[467,390],[424,421],[373,441],[320,447],[267,441],[216,421],[173,390],[141,347],[126,286],[133,228],[158,172],[201,120],[257,86]],
  dog:[[320,61],[370,67],[414,83],[444,110],[465,151],[487,209],[505,270],[499,322],[473,369],[432,407],[382,434],[320,449],[258,434],[208,407],[167,369],[141,322],[135,270],[153,209],[175,151],[196,110],[226,83],[270,67]],
  koala:[[320,93],[373,103],[421,132],[460,180],[484,235],[495,284],[481,337],[451,376],[414,403],[370,418],[320,426],[270,418],[226,403],[189,376],[159,337],[145,284],[156,235],[180,180],[219,132],[267,103]]
 };
 if(measuredHoods[species]){
  s.parent.remove(hood);
  k.volume('MeasuredCostumeHood',measuredHoods[species],[({kangaroo:296,seal:294})[species]||320,({dog:265,meerkat:235,hedgehog:305,rabbit:333,chick:290,kangaroo:280,seal:230,whale:300,eagle:244,owl:249,mouse:280,sloth:234,turtle:234,unicorn:310})[species]||270],s.pivot,depth,depth,s.parent,k.solid('MeasuredHoodColor',species==='hedgehog'?'#e4bdaa':color),{art:false,samples:128});
  hoodCarriers.push(...s.parent.children);
 }
 if(species==='fox'||species==='wolf'){
  s.parent.remove(hood);
  const outline=species==='fox'?[[320,125],[375,132],[425,154],[459,187],[479,224],[491,257],[515,287],[529,300],[518,313],[529,328],[502,347],[477,371],[450,393],[410,418],[366,436],[320,445],[274,436],[230,418],[190,393],[163,371],[138,347],[111,328],[122,313],[111,300],[125,287],[149,257],[161,224],[181,187],[215,154],[265,132]]:[[320,115],[375,120],[425,151],[451,184],[475,220],[491,251],[519,271],[498,287],[519,304],[489,330],[466,368],[437,401],[398,423],[358,436],[320,442],[282,436],[242,423],[203,401],[174,368],[151,330],[121,304],[142,287],[121,271],[149,251],[165,220],[189,184],[215,151],[265,120]];
  k.volume('ShapedCanineHood',outline,[320,282],s.pivot,.70,.70,s.parent,k.solid('CanineHoodColor',color),{art:false,samples:128});
  hoodCarriers.push(...s.parent.children);
  const ear=species==='fox'?[[153,61],[178,66],[211,84],[244,116],[272,143],[256,175],[213,199],[166,218],[147,197],[143,160],[142,113],[146,77]]:[[174,61],[191,64],[219,87],[246,112],[266,139],[263,169],[239,196],[209,219],[177,229],[165,198],[164,159],[164,116],[167,80]];
  for(const side of [-1,1])k.volume('CanineEar'+side,ear.map(([x,y])=>[320+side*(320-x),y]),[320+side*121,139],s.pivot,.22,.22,s.parent,k.solid('CanineEarColor'+side,color),{art:false,z:-.08,samples:64});
 }
 const egg=(n,x,y,a,b,d,c=color,z=0,rot=0)=>s.ellipsoid(n,[x,y,z],[a,b,d],c,rot);
 const leaf=(n,base,tip,w,c=color,z=0)=>{
 const dx=tip[0]-base[0],dy=tip[1]-base[1],len=Math.hypot(dx,dy),ps=[];
 for(const side of [1,-1])for(let j=0;j<=12;j++){const t=side>0?j/12:1-j/12,a=Math.sin(t*Math.PI)*w;ps.push([base[0]+dx*t-dy/len*a*side,base[1]+dy*t+dx/len*a*side]);}
 k.volume(n,ps,[(base[0]+tip[0])/2,(base[1]+tip[1])/2],s.pivot,.10,.10,s.parent,k.solid(n+'Color',c),{art:false,z,samples:48});
 };
 const surfaceZ=(x,y)=>{if(hoodCarriers.length){const ray=new THREE.Raycaster(new THREE.Vector3((x-s.pivot[0])*.005,(s.pivot[1]-y)*.005,4),new THREE.Vector3(0,0,-1));const carriers=hoodCarriers.map(o=>{const m=new THREE.Mesh(o.geometry,new THREE.MeshBasicMaterial({side:THREE.DoubleSide}));m.updateMatrixWorld(true);return m;});const hit=ray.intersectObjects(carriers)[0];carriers.forEach(m=>m.material.dispose());if(hit)return hit.point.z;}return depth*Math.sqrt(Math.max(.02,1-((x-cx)/rx)**2-((y-cy)/ry)**2));};
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
 function fittedFeature(name,contour,center,front,c){
  const before=new Set(s.parent.children);
  k.volume(name,contour,center,s.pivot,front,.035,s.parent,k.solid(name+'Color',c),{art:false,samples:96});
  for(const mesh of s.parent.children.filter(o=>!before.has(o))){const p=mesh.geometry.attributes.position;for(let i=0;i<p.count;i++){const x=p.getX(i)/.005+s.pivot[0],y=s.pivot[1]-p.getY(i)/.005;p.setZ(i,p.getZ(i)+surfaceZ(x,y)-.008);}mesh.geometry.computeVertexNormals();}
 }
 if(['mouse','panda','lion'].includes(species)){
  const config={bear:[135,132,46,47],mouse:[135,151,92,92],koala:[174,188,76,78],panda:[139,118,47,47],tiger:[135,118,45,47],meerkat:[139,143,32,40],lion:[108,187,34,37]}[species];roundEars(...config,species==='mouse'?'#95c0c8':cream);
 }
 if(species==='bear'||species==='koala'){
  const ear=species==='bear'?[[133,97],[151,72],[178,60],[207,64],[230,80],[245,105],[236,137],[206,169],[178,186],[151,172],[133,145],[127,120]]:[[221,110],[207,94],[182,77],[155,67],[128,60],[108,66],[117,76],[95,86],[72,107],[57,131],[47,159],[49,186],[61,182],[59,211],[72,239],[96,260],[124,273],[155,281],[190,241],[215,195],[232,146]];
  for(const side of [-1,1])k.volume('OriginalShapeEar'+side,ear.map(([x,y])=>[320+side*(320-x),y]),[320+side*(species==='bear'?131:178),species==='bear'?122:170],s.pivot,.20,.20,s.parent,k.solid('OriginalShapeEarColor'+side,color),{art:false,z:-.07,samples:80});
 }
 if(species==='tiger'||species==='meerkat')for(const side of [-1,1]){
  const tiger=species==='tiger',x=(tiger?311:320)+side*(tiger?139:169),y=tiger?124:189;
  const outer=egg('Ear'+side,x,y,tiger?62:39,tiger?69:56,.24,tiger?'#9a5c2b':'#815234',-.04,side*.22);
  const inner=egg('InnerEar'+side,x,y+5,tiger?42:25,tiger?47:37,.035,tiger?'#ffe9b3':'#a46d40',.20,side*.22);
  // Keep the ear paint on the front and the dark costume lining on its sides.
  outer.userData.skipOriginalPaint=false;inner.userData.skipOriginalPaint=false;
 }
 if(species==='squirrel'){
  const ear=[[113,63],[131,64],[152,75],[175,91],[178,108],[150,140],[117,153],[108,132],[106,105],[108,78]];
  for(const side of [-1,1])k.volume('SquirrelEar'+side,ear.map(([x,y])=>[262+side*(262-x),y]),[262+side*122,105],s.pivot,.18,.18,s.parent,k.solid('SquirrelEarColor'+side,color),{art:false,z:-.06,samples:64});
 }
 if(species==='bear'){muzzle(320,201,61,38,'#c6925e',.65);muzzle(320,191,20,15,'#51301b',.67,.13,'BearNose');}
 if(species==='chick'){
  k.volume('ChickCrest',[[291,128],[269,108],[264,96],[271,88],[291,87],[289,77],[295,65],[307,61],[322,66],[336,78],[342,91],[355,90],[365,98],[365,112],[360,128]],[316,105],s.pivot,.12,.12,s.parent,k.solid('ChickCrestColor','#f3d17a'),{art:false,samples:80});
  muzzle(320,236,35,26,'#e8a83c',.61);
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
  const ear=[[109,147],[133,144],[162,147],[190,158],[212,181],[214,198],[202,220],[183,233],[159,230],[134,216],[116,195],[106,171]],antler=[[211,169],[194,145],[182,119],[179,91],[185,71],[196,61],[209,65],[218,81],[218,111],[238,90],[247,95],[253,109],[248,127],[244,148],[249,163],[230,177]];
  for(const side of [-1,1]){
   k.volume('DeerEar'+side,ear.map(([x,y])=>[320+side*(320-x),y]),[320+side*160,186],s.pivot,.18,.18,s.parent,k.solid('DeerEarColor'+side,color),{art:false,z:-.04,samples:80});
   k.volume('DeerAntler'+side,antler.map(([x,y])=>[320+side*(320-x),y]),[320+side*104,132],s.pivot,.14,.14,s.parent,k.solid('DeerAntlerColor'+side,'#715037'),{art:false,z:-.04,samples:96});
  }
  muzzle(320,256,43,28,'#eed3a0',.57);
 }
 if(species==='giraffe'){
  for(const side of [-1,1]){
   const ear=[[171,105],[178,100],[197,99],[221,104],[241,115],[254,134],[259,155],[245,170],[222,172],[199,162],[182,144],[171,123]];
   k.volume('GiraffeEar'+side,ear.map(([x,y])=>[320+side*(320-x),y]),[320+side*105,136],s.pivot,.16,.16,s.parent,k.solid('GiraffeEarColor'+side,color),{art:false,z:-.03,samples:64});
   s.tube('Ossicone'+side,[[320+side*37,126,0],[320+side*39,85,0]],.043,'#bb844b');
   egg('OssiconeTip'+side,320+side*39,80,18,18,.085,'#b77b48');
  }
  muzzle(320,212,48,33,'#edc88f');rearMarks('giraffe');
 }
 if(species==='dog'){
  const ear=[[216,99],[195,90],[177,95],[154,112],[132,136],[105,152],[86,170],[82,192],[90,232],[102,268],[114,293],[128,307],[146,303],[165,282],[178,248],[183,204],[190,162],[203,126]];
  for(const side of [-1,1])k.volume('DroopingEar'+side,ear.map(([x,y])=>[320+side*(320-x),y]),[320+side*173,196],s.pivot,.26,.26,s.parent,k.solid('DroopingEarColor'+side,'#d99f4d'),{art:false,z:-.03,samples:80});
  muzzle(320,218,63,37,'#f5dca1',.66);muzzle(320,198,22,15,dark,.66,.13,'DogNose');muzzle(328,244,14,21,'#dc8d86',.60,.10,'Tongue');
 }
 if(['duck','eagle','owl','penguin','peacock','ostrich'].includes(species)){
  const beaks={duck:[320,222,93,34],owl:[320,205,22,28],penguin:[320,198,41,24],peacock:[320,232,24,20],ostrich:[290,187,39,19]};
  if(species==='eagle')fittedFeature('WideEagleBeak',[[320,142],[345,149],[367,169],[396,189],[422,201],[435,213],[428,222],[402,226],[378,237],[353,259],[320,286],[287,255],[262,234],[232,224],[209,222],[203,215],[211,204],[239,190],[270,169],[295,149]],[320,208],.16,'#e6b04b');
  else muzzle(...beaks[species],'#e6b04b',depth*.83);
  if(species==='owl')for(const side of [-1,1]){
   egg('OwlEyeRim'+side,cx+side*72,181,79,70,.08,'#e2c895',.48);
   const brow=[[164,60],[183,72],[212,80],[243,92],[271,110],[296,136],[315,169],[320,180],[299,165],[274,146],[243,130],[211,121],[184,119],[172,103],[165,82]];
   fittedFeature('OwlBrow'+side,brow.map(([x,y])=>[320+side*(320-x),y]),[320+side*81,115],.075,'#6f5137');
  }
  if(species==='peacock')for(const side of [-1,0,1]){s.tube('CrownStem'+side,[[320,175,0],[320+side*32,124,0]],.022,'#397a87');egg('CrownFeather'+side,320+side*32,115,12,17,.06,'#6aa49e');}
 }
 if(['dolphin','shark','whale'].includes(species)){
  const fins={dolphin:[[153,241],[134,270],[117,303],[105,336],[104,357],[111,370],[124,373],[146,361],[168,344],[172,301]],shark:[[173,282],[151,310],[133,337],[123,358],[122,375],[144,376],[173,369],[190,357],[195,324]],whale:[[166,353],[158,378],[144,389],[128,399],[127,411],[142,426],[164,433],[186,431],[205,421],[207,405],[190,379]]};
  const center={dolphin:[141,310],shark:[160,337],whale:[169,405]}[species];
  for(const side of [-1,1])k.volume('HeadFlipper'+side,fins[species].map(([x,y])=>[320+side*(320-x),y]),[320+side*(320-center[0]),center[1]],s.pivot,.14,.14,s.parent,k.solid('HeadFlipperColor'+side,color),{art:false,z:-.07,samples:80});
  if(species==='dolphin')muzzle(320,226,96,24,'#87a6ba',.65);
  if(species==='shark')k.volume('DorsalFin',[[289,116],[298,91],[311,65],[321,60],[332,74],[344,100],[352,119]],[320,99],s.pivot,.14,.14,s.parent,k.solid('DorsalFinColor','#527a97'),{art:false,z:-.10,samples:64});
  if(species==='whale')k.volume('WaterSpout',[[307,164],[304,143],[297,125],[280,122],[264,129],[250,125],[242,113],[242,101],[252,91],[266,85],[286,86],[299,94],[295,78],[302,63],[315,63],[325,72],[329,83],[342,66],[355,61],[367,67],[366,81],[362,90],[377,86],[388,92],[390,105],[383,116],[366,121],[347,125],[336,140],[331,163]],[318,114],s.pivot,.10,.10,s.parent,k.solid('WaterSpoutColor','#74bddc'),{art:false,samples:128});
 }
 if(species==='elephant'){
  const ear=[[246,95],[221,77],[190,64],[157,60],[126,68],[97,84],[75,107],[57,134],[49,157],[54,173],[67,185],[70,208],[69,224],[82,242],[104,259],[123,278],[137,297],[148,302],[161,291],[180,258],[197,210],[221,164]];
  for(const side of [-1,1])k.volume('ElephantEar'+side,ear.map(([x,y])=>[320+side*(320-x),y]),[320+side*178,171],s.pivot,.21,.21,s.parent,k.solid('ElephantEarColor'+side,color),{art:false,z:-.07,samples:96});
  k.volume('ElephantTrunk',[[270,161],[255,187],[247,216],[248,248],[262,279],[285,309],[295,326],[297,337],[311,343],[330,343],[339,333],[346,307],[364,274],[381,237],[383,205],[373,176],[361,160]],[316,240],s.pivot,.16,.13,s.parent,k.solid('ElephantTrunkColor','#a9a294'),{art:false,z:.67,samples:96});
  k.volume('ElephantCrest',[[285,82],[283,67],[289,58],[299,61],[307,73],[316,59],[326,57],[334,62],[331,76],[350,66],[363,62],[370,67],[362,80],[347,88]],[322,77],s.pivot,.10,.10,s.parent,k.solid('ElephantCrestColor',color),{art:false,samples:64});
 }
 if(species==='fox'||species==='wolf'){
  muzzle(320,species==='wolf'?240:250,species==='wolf'?61:51,28,species==='wolf'?'#d2cebf':'#f0d3a7',.63);
 }
 if(species==='hedgehog'||species==='lion'){
  const c=species==='lion'?'#99612f':'#8d8079';
  if(species==='lion'){
   const contour=[[373,62],[359,63],[342,69],[321,84],[290,66],[256,64],[247,69],[248,78],[245,80],[201,86],[173,96],[158,111],[149,128],[125,155],[122,177],[106,202],[96,234],[96,243],[104,252],[96,296],[97,321],[119,362],[127,384],[138,400],[153,408],[176,435],[204,449],[231,468],[261,480],[291,487],[320,498],[349,487],[379,480],[409,468],[436,449],[459,435],[486,406],[495,403],[503,395],[521,358],[525,339],[536,332],[542,318],[542,227],[530,198],[513,174],[514,161],[511,154],[492,132],[472,116],[470,108],[455,95],[435,86],[395,76],[383,65]];
   k.volume('FullLionMane',contour,[320,278],s.pivot,.64,.85,s.parent,k.solid('LionManeColor','#a86c32'),{art:false,z:-.16,samples:128});
  }else{
   hood.material.color.set('#e4bdaa').convertSRGBToLinear();
   const half=[[320,61],[297,91],[277,68],[268,68],[253,92],[224,81],[214,88],[211,112],[181,110],[173,117],[176,139],[149,147],[145,158],[155,174],[124,190],[116,205],[140,214],[113,237],[101,253],[122,259],[105,287],[99,304],[120,310],[105,337],[103,354],[125,361],[112,387],[113,402],[139,405],[126,432],[128,445],[149,446],[148,475],[159,483],[171,478],[171,509],[187,518],[196,510],[201,534],[220,538],[233,532],[245,554],[260,550],[277,539],[292,545],[306,537],[320,544]],before=new Set(s.parent.children);
   k.volume('HedgehogQuillCoat',[...half,...half.slice(1,-1).reverse().map(([x,y])=>[640-x,y])],[320,307],s.pivot,.64,.55,s.parent,k.solid('HedgehogCoatColor','#92847c'),{art:false,z:-.65,samples:192});
   for(const mesh of s.parent.children.filter(o=>!before.has(o)))mesh.userData.artworkExcludedRegions=[{cx:320,cy:305,rx:162,ry:146},{cx:320,cy:510,rx:91,ry:94}];
   for(let i=0;i<230;i++){const y=1-2*(i+.5)/230,r=Math.sqrt(1-y*y),a=i*2.399963,q=new THREE.Vector3(Math.cos(a)*r,y,Math.sin(a)*r);if(q.z>-.40)continue;
    const normal=new THREE.Vector3(q.x/1.035,q.y/1.14,q.z/.81).normalize(),h=.11+(i%3)*.014,x=320+q.x*207+normal.x*(h/2-.018)/.005,py=307-q.y*228-normal.y*(h/2-.018)/.005,z=-.25+q.z*.81+normal.z*(h/2-.018);
    s.cone('RearHedgehogQuill'+i,[x,py,z],.055,h,i%4?'#92847c':'#867971',normal.toArray());
   }
  }
  muzzle(320,species==='lion'?230:250,species==='lion'?49:55,species==='lion'?28:33,species==='lion'?'#e9b64f':'#d1aa96',.62);
 }
 if(species==='hippopotamus'){roundEars(124,94,27,34);muzzle(320,208,146,65,'#a8a4b3',.61);}
 if(species==='kangaroo'){
  const ear=[[170,61],[192,69],[217,90],[235,117],[247,146],[251,174],[233,192],[208,186],[183,165],[166,138],[157,111],[156,84],[161,65]];
  for(const side of [-1,1])k.volume('KangarooEar'+side,ear.map(([x,y])=>[296+side*(296-x),y]),[296+side*94,127],s.pivot,.19,.19,s.parent,k.solid('KangarooEarColor'+side,color),{art:false,z:-.10,samples:80});
  muzzle(296,236,43,27,cream,.57);
 }
 if(species==='llama'){
  for(const side of [-1,1]){egg('SheepEar'+side,cx+side*120,110,26,55,.15,'#e3ccaa',-.02,side*.2);egg('SheepEarLining'+side,cx+side*120,110,13,33,.020,'#d8aa95',.11,side*.2);}
  for(let i=0;i<24;i++){const a=i/24*Math.PI*2;egg('FleeceCurl'+i,cx+Math.cos(a)*(rx-13),cy+Math.sin(a)*(ry-15),23,24,.16,'#ebdbbc',-.04);}
  for(let i=0;i<70;i++){const y=1-2*(i+.5)/70,r=Math.sqrt(1-y*y),a=i*2.399963,q=new THREE.Vector3(Math.cos(a)*r,y,Math.sin(a)*r);if(q.z>-.12)continue;egg('RearFleeceCurl'+i,cx+q.x*rx*.94,cy-q.y*ry*.94,25,27,.14,i%3?'#ebdbbc':'#f1e0bd',q.z*depth*.94);}
  for(let i=0;i<7;i++){const x=240+i*27,y=135-(i%2)*7;egg('ForeheadWool'+i,x,y,25,25,.14,'#f1e0bd',surfaceZ(x,y)-.06);}
  muzzle(320,223,40,26,'#e1c6a2',.55);
 }
 if(species==='monkey')roundEars(185,266,69,70,'#bb864b');
 if(species==='mouse')fittedFeature('MouseNose',[[300,180],[316,173],[331,175],[343,185],[331,201],[323,216],[314,210],[303,195]],[320,190],.06,'#b7d0d1');
 if(species==='koala')muzzle(320,191,29,44,'#454743',.64,.15,'KoalaNose');
 if(species==='ladybug'||species==='dragonfly'||species==='praying-mantis'){
  for(const side of [-1,1]){s.tube('InsectAntenna'+side,[[cx+side*60,cy-ry+20,.16],[cx+side*85,cy-ry-27,.06],[cx+side*111,cy-ry-56,0]],.025,species==='ladybug'?'#543c36':'#4d6f55');if(species==='ladybug')egg('AntennaTip'+side,cx+side*111,cy-ry-56,13,13,.063,'#543c36');}
  if(species==='praying-mantis')for(const side of [-1,1])egg('MantisEye'+side,cx+side*127,169,48,52,.23,'#a8b24d',.21);
 }
 if(species==='octopus'){
  for(let i=0;i<8;i++){const a=i/8*Math.PI*2,x=320+Math.cos(a)*125,z=Math.sin(a)*.50;s.sweep('OctopusArm'+i,[[320+Math.cos(a)*70,413,Math.sin(a)*.30,24],[x,488,z,22],[320+Math.cos(a)*192,520,z*.85,16],[320+Math.cos(a)*222,484,z*.75,3]],'#aa72ab');}
  s.torus('OctopusMouth',[320,203,.68],.11,.035,'#d39ac4');
 }
 if(species==='rabbit'){
  const ear=[[224,225],[209,199],[194,166],[181,132],[175,105],[178,82],[190,66],[206,61],[223,65],[242,82],[257,108],[267,138],[275,169],[280,203],[264,221],[241,229]];
  for(const side of [-1,1])k.volume('RabbitEar'+side,ear.map(([x,y])=>[320+side*(320-x),y]),[320+side*91,148],s.pivot,.18,.18,s.parent,k.solid('RabbitEarColor'+side,'#edb3c6'),{art:false,z:-.06,samples:96});
 }
 if(species==='duck')k.volume('DuckCrest',[[273,114],[271,101],[278,89],[294,89],[291,77],[298,65],[313,63],[331,70],[345,86],[353,108],[360,118]],[313,99],s.pivot,.12,.12,s.parent,k.solid('DuckCrestColor','#f4d35e'),{art:false,samples:80});
 if(species==='rhinoceros'){
  const ear=[[203,59],[183,66],[174,82],[171,103],[181,125],[198,141],[222,149],[241,131],[229,111],[221,85],[214,66]];
  for(const side of [-1,1]){
   k.volume('RhinoEar'+side,ear.map(([x,y])=>[319+side*(319-x),y]),[319+side*117,103],s.pivot,.20,.20,s.parent,k.solid('RhinoEarColor'+side,'#a09a99'),{art:false,z:-.04,samples:64});
  }
  muzzle(318,216,65,35,'#a29b9a');
  k.volume('MainRhinoHorn',[[319,80],[311,90],[301,117],[289,160],[283,185],[294,198],[317,204],[341,199],[351,188],[347,162],[337,118],[327,91]],[319,150],s.pivot,.18,.10,s.parent,k.solid('RhinoHornColor','#dedbd9'),{art:false,z:.63,samples:80});
 }
 if(species==='seal'){muzzle(290,176,61,34,'#e1dfe1',.71);muzzle(290,155,23,13,'#51434b',.71,.13,'SealNose');}
 if(species==='snail'){
  egg('SnailShell',427,353,163,185,.58,'#b88150',-.25);egg('SnailFoot',347,536,210,38,.29,'#e8c8a0',-.04);egg('SnailNeck',218,462,83,100,.43,'#e8c8a0',-.05);
  const ps=[];for(let i=0;i<=100;i++){const t=i/100,a=t*Math.PI*4.3,r=126*(1-t);const x=442+Math.cos(a)*r,y=377+Math.sin(a)*r,z=-.25+.58*Math.sqrt(Math.max(.02,1-((x-427)/163)**2-((y-353)/185)**2));ps.push([x,y,z+.012]);}s.tube('ShellSpiral',ps,.022,'#80512e');
  for(const side of [-1,1]){s.sweep('SnailEyeStalk'+side,[[192+side*57,208,0,13],[192+side*78,140,0,11],[192+side*99,91,0,18]],'#c79c70');egg('SnailEye'+side,192+side*99,91,9,11,.035,'#513a2a',.08);}
 }
 if(species==='unicorn'){
  const ear=[[208,106],[193,113],[185,134],[186,161],[194,185],[208,211],[229,211],[247,193],[255,170],[247,145],[230,119]];
  for(const side of [-1,1])k.volume('UnicornEar'+side,ear.map(([x,y])=>[320+side*(320-x),y]),[320+side*101,159],s.pivot,.17,.17,s.parent,k.solid('UnicornEarColor'+side,'#f2e9db'),{art:false,z:-.06,samples:80});
  k.volume('UnicornHorn',[[314,60],[306,66],[298,85],[296,104],[292,126],[289,151],[288,168],[312,173],[338,169],[337,145],[334,117],[331,91],[326,72],[321,62]],[315,129],s.pivot,.14,.14,s.parent,k.solid('UnicornHornColor','#edbc50'),{art:false,z:.18,samples:80});
  fittedFeature('UnicornManeBlue',[[321,154],[347,153],[371,163],[388,182],[395,207],[404,224],[418,230],[413,242],[395,250],[374,247],[356,234],[346,210],[330,187]],[366,202],.07,'#92c9d6');
  fittedFeature('UnicornManePink',[[283,158],[261,164],[246,184],[241,203],[250,228],[273,242],[299,252],[315,269],[320,282],[338,272],[355,251],[365,224],[363,198],[348,176],[328,161],[302,155]],[306,212],.10,'#e899b0');
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
