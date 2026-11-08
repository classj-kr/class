"use strict";
const paths={
 'crested-gecko':[[349,490,-.19,22],[421,516,-.22,27],[471,494,-.19,20],[507,444,-.13,3]],
 crocodile:[[347,490,-.18,28],[419,516,-.20,32],[486,516,-.13,25],[545,487,-.04,15],[566,454,0,3]],
 dog:[[352,490,-.20,17],[416,510,-.23,18],[450,485,-.18,16],[455,429,-.07,5]],
 dolphin:[[349,490,-.20,21],[424,495,-.30,24],[457,477,-.37,19]],
 dragon:[[350,494,-.21,25],[413,522,-.25,26],[454,515,-.15,16],[471,480,-.03,3]],
 fox:[[290,491,-.23,23],[220,514,-.27,32],[172,506,-.23,38],[150,461,-.13,28],[142,436,-.06,2]],
 giraffe:[[361,500,-.19,8],[396,505,-.18,7],[414,484,-.10,7],[420,468,-.03,5]],
 kangaroo:[[315,492,-.22,28],[398,522,-.26,30],[451,490,-.18,25],[477,427,-.08,12],[479,398,0,2]],
 'leopard-gecko':[[351,489,-.20,24],[420,519,-.23,36],[479,499,-.20,41],[515,450,-.09,36],[518,387,.02,18],[506,359,.08,3]],
 lion:[[352,507,-.18,10],[422,527,-.24,10],[460,507,-.18,11],[479,478,-.07,14]],
 meerkat:[[354,475,-.19,13],[408,486,-.22,16],[461,475,-.13,15],[491,452,-.02,2]],
 monkey:[[352,497,-.20,12],[417,524,-.26,13],[493,491,-.24,14],[526,413,-.16,14],[501,367,-.07,14],[459,376,-.05,13],[458,410,-.05,11],[486,417,-.05,8]],
 seal:[[350,501,-.19,24],[425,523,-.25,24],[464,516,-.29,23]],
 squirrel:[[318,487,-.24,22],[403,501,-.31,34],[478,463,-.28,54],[494,366,-.22,60],[470,307,-.12,53],[431,321,-.05,34],[451,362,-.01,18],[455,405,-.02,7]],
 tiger:[[366,524,-.18,20],[408,532,-.21,23],[439,497,-.18,25],[454,459,-.10,25],[487,451,-.02,23],[513,456,.02,3]],
 unicorn:[[350,498,-.20,18],[414,527,-.25,27],[454,532,-.12,25],[473,506,-.02,4]],
 viper:[[352,494,-.20,23],[421,517,-.22,28],[466,491,-.13,25],[486,446,-.05,14],[482,419,0,3]],
 wolf:[[350,490,-.22,22],[420,524,-.26,29],[468,491,-.19,35],[493,440,-.07,24],[485,400,0,2]]
};
module.exports=function appendages(THREE,k,id,parts){
 const species=id.replace('animal-',''),tail=parts.get('Tail'),path=paths[species];
 const profile=require('./collection-profiles.cjs')[id],torso=parts.get('Torso');
 if(species==='giraffe')for(const side of [-1,1]){
  const arm=parts.get(side<0?'LeftArm':'RightArm'),leg=parts.get(side<0?'LeftLeg':'RightLeg');
  const pivot=[320+side*35,442];arm.group.clear();arm.part.pivot=pivot;arm.group.position.set((pivot[0]-320)*.005,(580-pivot[1])*.005,0);
  const a=require('./sculpt-kit.cjs')(THREE,k,arm);a.sweep('GiraffeSleeve'+side,[[320+side*35,442,0,15],[320+side*59,463,.02,18],[320+side*67,477,.02,16]],'#e6b569');a.paint();
  leg.group.clear();const l=require('./sculpt-kit.cjs')(THREE,k,leg);
  l.ellipsoid('GiraffeLeg'+side,[320+side*24,516,0],[22,24,.16],'#e6b569');
  l.ellipsoid('GiraffeHoof'+side,[320+side*25,534,.025],[23,13,.18],'#83512d');l.paint();
 }
 if(species==='tiger')for(const side of [-1,1]){
  const arm=parts.get(side<0?'LeftArm':'RightArm'),leg=parts.get(side<0?'LeftLeg':'RightLeg');
  arm.group.clear();const a=require('./sculpt-kit.cjs')(THREE,k,arm);
  a.sweep('TigerSleeve'+side,[[320+side*57,448,0,18],[320+side*74,485,.02,20],[320+side*75,508,.04,17]],'#fba436');a.paint();
  leg.group.clear();const l=require('./sculpt-kit.cjs')(THREE,k,leg);
  l.ellipsoid('TigerLeg'+side,[320+side*43,542,0],[26,33,.19],'#fba436');
  l.ellipsoid('TigerPaw'+side,[320+side*51,562,.07],[36,23,.24],'#fba436');l.paint();
 }
 if(id.startsWith('animal-')&&torso&&!['crested-gecko','flamingo','frog','butterfly','dragonfly','peacock'].includes(species)){
  torso.group.clear();const s=require('./sculpt-kit.cjs')(THREE,k,torso),cx=profile.cx||320,cy=(profile.neck+profile.leg)/2+4;
  const slim=['kangaroo','giraffe'].includes(species),width=({rhinoceros:80,meerkat:73,panda:78,hedgehog:76,squirrel:67})[species]||(slim?52:61);
  if(species==='giraffe'){
   s.lathe('ShortGiraffeNeckAndBody',[[526,0],[519,43],[486,61],[459,66],[433,47],[415,32],[378,31],[368,0]],torso.part.color);
  }else s.ellipsoid('BodyCostume',[cx,cy,0],[width,(profile.leg-profile.neck)/2+12,.26],torso.part.color);
  s.paint();
 }
 require('./land-limbs.cjs')(THREE,k,id,parts,profile);
 if(['eagle','owl'].includes(species))for(const side of [-1,1]){
  const name=side<0?'LeftArm':'RightArm',cx=320+side*58,pivot=[cx,440];let part=parts.get(name);
  if(!part){part={group:k.group(name,pivot),part:{pivot,color:torso.part.color}};parts.set(name,part);}else{part.group.clear();part.part.pivot=pivot;part.group.position.set((cx-320)*.005,(580-440)*.005,0);}
  const s=require('./sculpt-kit.cjs')(THREE,k,part),owl=species==='owl';
  const ps=owl?[[56,440],[90,451],[131,446],[171,429],[161,465],[177,466],[154,491],[136,490],[123,509],[103,505],[79,510],[58,478]]:[[57,435],[92,424],[118,432],[135,474],[123,508],[105,529],[92,513],[79,520],[68,490]];
  s.smoothOutline('FeatheredArm'+side,ps.map(([x,y])=>[320+side*x,y]),.23,owl?'#96754e':'#78553c',0,.045);s.paint();
 }
 if(species==='sloth'){
  const part=parts.get('Torso'),s=require('./sculpt-kit.cjs')(THREE,k,part);s.tube('HeldBranch',[[139,527,.32],[250,486,.34],[367,435,.33],[437,410,.31]],.045,'#75583b');s.paint();
 }
 if(tail&&path){
  tail.group.clear();const s=require('./sculpt-kit.cjs')(THREE,k,tail),color=species==='giraffe'?'#e6b569':tail.part.color;
  const mesh=s.sweep('AttachedTail',path,color);tail.special=true;
  if(['fox','wolf','tiger','crested-gecko','leopard-gecko','unicorn'].includes(species)){
   const colors=[],p=mesh.geometry.attributes.position;
   for(let i=0;i<p.count;i++){const t=Math.min(1,Math.floor(i/16)/64);let c=color;
    if(species==='fox'&&t>.70)c='#f0d5ac';
    if(species==='wolf'&&t>.74)c='#ddd7cf';
    if(species==='tiger'&&Math.floor(t*8)%2===1)c='#5a4134';
    if(species==='crested-gecko'&&i%16<6)c='#cf863b';
    if(species==='leopard-gecko'&&((Math.floor(t*13)*7+Math.floor(i%16/2))%9<2))c='#7f542f';
    if(species==='unicorn')c=['#e9a4b8','#a4ccdf','#c7a6d3'][Math.floor(i%16/6)];
    const v=new THREE.Color(c).convertSRGBToLinear();colors.push(v.r,v.g,v.b);
   }
   mesh.geometry.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));mesh.material.color.set(0xffffff);mesh.material.userData.preserveVertexColor=true;
  }
  if(species==='lion')s.ellipsoid('TailTuft',[479,478,-.07],[17,26,.11],'#95602e',-.45);
  if(species==='giraffe')s.ellipsoid('TailTuft',[420,469,-.03],[12,20,.08],'#79502e',-.45);
  if(species==='dolphin'||species==='seal'){
   const [x,y,z]=path.at(-1);for(const side of [-1,1])s.sweep('TailFluke'+side,[[x,y,z,19],[x+side*38,y-19,z-.03,18],[x+side*53,y-40,z-.02,3]],color);
  }
  s.paint();
 }

 if(['dolphin','seal','shark','whale','penguin'].includes(species))for(const side of [-1,1]){
  const color=profile.bodyColor||profile.headColor,neck=profile.neck,cx=profile.cx||320;
  const name=side<0?'LeftArm':'RightArm',pivot=[cx+side*44,neck+20];let arm=parts.get(name);
  if(!arm){arm={part:{pivot},group:k.group(name,pivot)};parts.set(name,arm);}
  arm.group.clear();arm.part.pivot=pivot;arm.group.position.set((pivot[0]-320)*.005,(580-pivot[1])*.005,0);
  const a=require('./sculpt-kit.cjs')(THREE,k,arm);
  a.sweep('AttachedFlipper'+side,[[cx+side*44,neck+20,0,21],[cx+side*72,neck+50,.03,25],[cx+side*105,neck+67,.04,6]],color);
  const leg=parts.get(side<0?'LeftLeg':'RightLeg');leg.group.clear();const l=require('./sculpt-kit.cjs')(THREE,k,leg);
  l.ellipsoid('MarineLeg'+side,[cx+side*30,profile.leg+4,0],[24,25,.19],color);
  l.ellipsoid('MarineFoot'+side,[cx+side*40,profile.leg+27,.06],[32,14,.24],species==='penguin'?'#e5b04b':color);
 }
 if(species==='snail'&&parts.has('SpiralShell'))parts.get('SpiralShell').group.clear();
 if(species==='chick')for(const side of [-1,1]){
  const part=parts.get(side<0?'LeftArm':'RightArm');part.group.clear();const x=320+side*106;part.part.pivot=[x,420];part.group.position.set((x-320)*.005,(580-420)*.005,0);
  const s=require('./sculpt-kit.cjs')(THREE,k,part),ps=[[106,404],[149,412],[180,447],[192,484],[174,493],[169,518],[146,512],[128,532],[111,518],[90,519],[81,493],[87,450]].map(([dx,y])=>[320+side*dx,y]);
  s.smoothOutline('FeatheredWing'+side,ps,.25,'#f5d886',-.01,.065);s.paint();
 }
 if(species==='ladybug'){
  // Wing-tip pixels must never become wide extra feet. The red shells are
  // separate from the two dark feet and the segmented abdomen beneath them.
  for(const [name,x,y,rx,ry] of [['Torso',320,478,66,77],['LeftLeg',291,548,26,28],['RightLeg',349,548,26,28]]){const part=parts.get(name);if(!part)continue;part.group.clear();const s=require('./sculpt-kit.cjs')(THREE,k,part);s.ellipsoid(name+'Form',[x,y,0],[rx,ry,.19],name==='Torso'?'#796149':'#493b36');s.paint();}
 }
 if(species==='ostrich'){
  const part=parts.get('Torso');part.group.clear();const s=require('./sculpt-kit.cjs')(THREE,k,part);
  s.ellipsoid('OstrichFeatherBody',[309,420,-.02],[100,60,.33],'#444047');
  for(let i=0;i<7;i++){const a=-1.0+i*.23;s.ellipsoid('TailFeather'+i,[396+Math.cos(a)*38,393+Math.sin(a)*40,-.19],[23,53,.075],i%2?'#efebe5':'#4c464c',a+.7);}
  s.tube('OstrichNeck',[[290,328,0],[290,365,.02]],.079,'#e4a3a3');s.paint();
 }
};
