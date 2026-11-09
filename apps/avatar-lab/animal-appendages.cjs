"use strict";
const paths={
 'crested-gecko':[[349,490,-.19,22],[421,516,-.22,27],[471,494,-.19,20],[507,444,-.13,3]],
 crocodile:[[347,490,-.18,28],[419,516,-.20,32],[486,516,-.13,25],[545,487,-.04,15],[566,454,0,3]],
 dog:[[352,490,-.20,17],[416,510,-.23,18],[450,485,-.18,16],[451,445,-.07,12]],
 dolphin:[[349,490,-.20,21],[424,495,-.30,24],[457,477,-.37,19]],
 dragon:[[350,494,-.21,25],[413,522,-.25,26],[454,515,-.15,16],[471,480,-.03,3]],
 fox:[[290,491,-.23,23],[236,519,-.27,35],[185,506,-.23,41],[146,465,-.13,33],[139,420,-.06,16],[143,398,0,1.5]],
 giraffe:[[350,500,-.12,10],[396,505,-.18,7],[414,484,-.10,7],[420,468,-.03,5]],
 kangaroo:[[315,492,-.22,28],[398,522,-.26,30],[451,490,-.18,25],[477,427,-.08,12],[479,398,0,2]],
 'leopard-gecko':[[351,489,-.20,24],[420,519,-.23,36],[479,499,-.20,41],[515,450,-.09,36],[518,387,.02,18],[506,359,.08,3]],
 lion:[[352,507,-.18,10],[422,527,-.24,10],[460,507,-.18,11],[479,478,-.07,14]],
 meerkat:[[354,475,-.19,13],[408,486,-.22,16],[461,475,-.13,15],[491,452,-.02,2]],
 monkey:[[365,508,-.12,16],[391,524,-.20,13],[445,532,-.23,14],[493,515,-.23,16],[526,480,-.20,17],[532,445,-.16,17],[518,418,-.10,17],[493,406,-.07,17],[469,411,-.05,17],[451,428,-.04,17],[449,451,-.03,17],[460,469,-.02,13],[474,476,-.02,8]],
 seal:[[350,501,-.19,24],[425,523,-.25,24],[464,516,-.29,23]],
 squirrel:[[318,487,-.24,22],[403,501,-.31,34],[478,463,-.28,54],[494,366,-.22,60],[470,307,-.12,53],[431,321,-.05,34],[451,362,-.01,18],[455,405,-.02,7]],
 tiger:[[366,524,-.18,20],[408,532,-.21,23],[439,497,-.18,25],[454,459,-.10,25],[487,451,-.02,23],[500,451,.02,20]],
 unicorn:[[350,498,-.20,18],[414,527,-.25,27],[454,532,-.12,25],[473,506,-.02,4]],
 viper:[[352,494,-.20,23],[421,517,-.22,28],[466,491,-.13,25],[486,446,-.05,14],[482,419,0,3]],
 wolf:[[350,490,-.22,22],[420,524,-.26,29],[468,491,-.19,35],[493,440,-.07,24],[485,400,0,2]]
};
module.exports=function appendages(THREE,k,id,parts){
 if(['animal-crab','animal-octopus','animal-ratsnake','animal-viper'].includes(id))return;
 if(['animal-flamingo','animal-ostrich','animal-peacock','animal-frog','animal-ladybug','animal-dragonfly'].includes(id))return;
 if(['animal-bee','animal-butterfly','animal-praying-mantis','animal-snail'].includes(id))return;
 const species=id.replace('animal-',''),tail=parts.get('Tail'),path=paths[species];
 const profile=require('./collection-profiles.cjs')[id],torso=parts.get('Torso');
 if(species==='giraffe')for(const side of [-1,1]){
  const arm=parts.get(side<0?'LeftArm':'RightArm'),leg=parts.get(side<0?'LeftLeg':'RightLeg');
  const pivot=[320+side*35,442];arm.group.clear();arm.part.pivot=pivot;arm.group.position.set((pivot[0]-320)*.005,(580-pivot[1])*.005,0);
  const a=require('./sculpt-kit.cjs')(THREE,k,arm);a.sweep('GiraffeSleeve'+side,[[320+side*35,442,0,15],[320+side*59,467,.02,18],[320+side*67,483,.02,16]],'#e6b569');a.paint();
  leg.group.clear();const l=require('./sculpt-kit.cjs')(THREE,k,leg);
  l.ellipsoid('GiraffeLeg'+side,[320+side*24,516,0],[22,24,.16],'#e6b569');
  l.ellipsoid('GiraffeHoof'+side,[320+side*25,534,.025],[23,13,.18],'#83512d');l.paint();
 }
 if(id.startsWith('animal-')&&torso&&!['crested-gecko','flamingo','frog','butterfly','dragonfly','peacock'].includes(species)){
  torso.group.clear();const s=require('./sculpt-kit.cjs')(THREE,k,torso),cx=profile.cx||320,cy=(profile.neck+profile.leg)/2+4;
  const slim=['kangaroo','giraffe'].includes(species),width=({rhinoceros:80,meerkat:73,panda:78,hedgehog:76,squirrel:67})[species]||(slim?52:61);
  if(species==='giraffe'){
   s.lathe('ShortGiraffeNeckAndBody',[[526,0],[519,43],[486,49],[459,50],[433,35],[415,30],[378,31],[368,0]],torso.part.color);
  }else s.ellipsoid('BodyCostume',[cx,cy,0],[width,(profile.leg-profile.neck)/2+12,.26],torso.part.color);
  s.paint();
 }
 require('./land-limbs.cjs')(THREE,k,id,parts,profile);
 if(tail&&path){
  tail.group.clear();const s=require('./sculpt-kit.cjs')(THREE,k,tail),color=species==='giraffe'?'#e6b569':tail.part.color;
  const reptile=require('./reptile-tails.cjs')(THREE,k,species,tail),canine=species==='fox'||species==='wolf',mesh=reptile||canine||['squirrel','kangaroo','dolphin','seal','unicorn'].includes(species)?null:s.sweep('AttachedTail',path,color);tail.special=true;
  if(species==='unicorn')k.volume('FlowingUnicornTail',[[374,474],[389,463],[409,460],[428,470],[439,490],[439,512],[449,524],[461,527],[475,516],[477,532],[468,549],[453,560],[431,568],[407,562],[391,546],[383,521]],[421,516],s.pivot,.23,.23,s.parent,k.solid('UnicornTailColor','#94c4d4'),{art:false,z:-.12,samples:128});
  if(species==='dolphin'||species==='seal'){
   const seal=species==='seal',outline=seal?[[353,473],[379,487],[407,491],[438,485],[444,467],[456,457],[466,457],[475,470],[480,493],[498,498],[515,509],[520,519],[509,530],[488,536],[461,533],[445,542],[415,552],[379,562],[344,559],[332,543]]:[[363,483],[388,482],[414,474],[434,468],[439,443],[448,428],[464,422],[478,429],[487,443],[490,466],[488,480],[506,493],[519,510],[522,522],[512,531],[493,531],[471,523],[451,516],[427,530],[402,538],[373,538],[350,524]];
   k.volume('FullMarineTail',outline,seal?[425,524]:[436,496],s.pivot,.22,.22,s.parent,k.solid('MarineTailColor',color),{art:false,z:-.14,samples:128});
   for(const mesh of s.parent.children)mesh.userData.artworkExcludedRegions=[seal?{cx:289,cy:465,rx:71,ry:76}:{cx:320,cy:487,rx:57,ry:71}];
  }
  if(species==='kangaroo')k.volume('BroadKangarooTail',[[350,475],[382,476],[410,465],[434,445],[451,416],[462,389],[473,379],[481,384],[485,400],[484,428],[476,463],[459,498],[432,522],[402,539],[363,550],[334,546],[328,521]],[412,489],s.pivot,.26,.26,s.parent,k.solid('KangarooTailColor',color),{art:false,z:-.16,samples:128});
  if(species==='squirrel'){
   k.volume('CurledSquirrelTail',[[450,228],[492,233],[535,254],[565,290],[575,327],[566,374],[544,403],[510,419],[479,417],[477,449],[460,487],[435,509],[401,527],[357,537],[316,532],[305,507],[310,463],[313,419],[339,377],[379,329],[410,274]],[437,385],s.pivot,.31,.31,s.parent,k.solid('SquirrelTailColor','#a86d38'),{art:false,z:-.15,samples:128});
   for(const mesh of s.parent.children)mesh.userData.artworkExcludedRegions=[{cx:262,cy:249,rx:191,ry:176},{cx:262,cy:475,rx:60,ry:92}];
  }
  if(canine){
   const fox=species==='fox',contour=fox?[[143,398],[131,418],[124,444],[127,474],[139,498],[159,519],[187,535],[223,546],[263,548],[301,539],[322,522],[325,490],[315,464],[290,446],[265,446],[239,451],[210,450],[183,440],[159,423]]:[[468,395],[484,404],[501,431],[511,465],[509,497],[495,524],[470,544],[442,554],[413,555],[386,546],[365,532],[358,507],[383,476],[415,458],[443,438],[459,416]];
   k.volume('AttachedCanineTail',contour,fox?[222,493]:[430,480],s.pivot,.28,.28,s.parent,k.solid('CanineTailColor',fox?'#b95f2d':'#909294'),{art:false,z:-.15,samples:128});
   for(const part of s.parent.children){const p=part.geometry.attributes.position,colors=[];for(let i=0;i<p.count;i++){const x=p.getX(i)/.005+s.pivot[0],y=s.pivot[1]-p.getY(i)/.005,c=new THREE.Color(fox?(x<210&&y<450+(x-140)*.15?'#f3d3a2':'#b95f2d'):(y<430?'#d0d0ca':y<470?'#6c6e70':'#909294')).convertSRGBToLinear();colors.push(c.r,c.g,c.b);}part.geometry.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));part.material.color.set(0xffffff);part.material.userData.preserveVertexColor=true;}
  }
  if(!reptile&&['tiger','crested-gecko','leopard-gecko'].includes(species)){
   const colors=[],p=mesh.geometry.attributes.position;
   for(let i=0;i<p.count;i++){const t=Math.min(1,Math.floor(i/16)/64);let c=color;
    if(species==='tiger'&&Math.floor(t*8)%2===1)c='#5a4134';
    if(species==='crested-gecko'&&i%16<6)c='#cf863b';
    if(species==='leopard-gecko'&&((Math.floor(t*13)*7+Math.floor(i%16/2))%9<2))c='#7f542f';
    if(species==='unicorn')c=['#e9a4b8','#a4ccdf','#c7a6d3'][Math.floor(i%16/6)];
    const v=new THREE.Color(c).convertSRGBToLinear();colors.push(v.r,v.g,v.b);
   }
   mesh.geometry.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));mesh.material.color.set(0xffffff);mesh.material.userData.preserveVertexColor=true;
  }
  if(species==='lion')s.ellipsoid('TailTuft',[479,478,-.07],[17,26,.11],'#95602e',-.45);
  if(species==='dog')s.ellipsoid('RoundedDogTailTip',[451,445,-.07],[12,17,.09],color);
  if(species==='tiger')s.ellipsoid('RoundedTigerTailTip',[500,451,.02],[23,20,.12],'#8b4b20');
  if(species==='giraffe')s.ellipsoid('TailTuft',[420,469,-.03],[12,20,.08],'#79502e',-.45);
  if(species==='fox'||species==='wolf'){s.parent.userData.directSurfaceArtwork=true;s.parent.userData.artworkOpaqueRegions=[{cx:320,cy:320,rx:420,ry:420}];}
  s.paint();
 }

 if(species==='snail'&&parts.has('SpiralShell'))parts.get('SpiralShell').group.clear();
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
