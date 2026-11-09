"use strict";
const ids=['theme-cactus','theme-cherry-blossom','theme-cloud','theme-clover','theme-crown','theme-guitar','theme-lightning','theme-maple-leaf','theme-moon','theme-music-note','theme-paper-airplane','theme-rainbow','theme-rose','theme-snowman','theme-star','theme-sun','theme-sunflower','theme-tulip'];
module.exports=function themes(THREE,k,id,parts){
 if(require('./source-tulip-costume.cjs')(THREE,k,id,parts))return true;
 if(require('./blossom-costumes.cjs')(THREE,k,id,parts))return true;
 if(require('./seasonal-costumes.cjs')(THREE,k,id,parts))return true;
 if(require('./symbol-costumes.cjs')(THREE,k,id,parts))return true;
 if(require('./celestial-costumes.cjs')(THREE,k,id,parts))return true;
 if(require('./soft-theme-costumes.cjs')(THREE,k,id,parts))return true;
 if(!ids.includes(id))return false;const head=parts.get('Head'),s=require('./sculpt-kit.cjs')(THREE,k,head);s.parent.clear();
 const gold='#f7c735',green='#639c39',white='#f1f4f3';
 function radialPetals(name,count,cx,cy,inner,outer,width,color,z=0,depth=.13,phase=0){
  for(let i=0;i<count;i++){const a=i/count*Math.PI*2+phase,ps=[];for(const side of [1,-1])for(let j=0;j<=12;j++){const t=side===1?j/12:1-j/12,r=inner+(outer-inner)*t,w=Math.sin(t*Math.PI)*width*side;ps.push([cx+Math.cos(a)*r-Math.sin(a)*w,cy+Math.sin(a)*r+Math.cos(a)*w]);}k.volume(name+i,ps,[cx+Math.cos(a)*(inner+outer)/2,cy+Math.sin(a)*(inner+outer)/2],s.pivot,depth,depth,s.parent,k.solid(name+i+'Color',color),{art:false,z,samples:48});}
 }
 function ringArc(name,r0,r1,start,end,cx,cy,color,depth=.22,z=0){const ps=[];for(let i=0;i<=64;i++){const a=start+(end-start)*i/64;ps.push([cx+Math.cos(a)*r1,cy+Math.sin(a)*r1]);}for(let i=64;i>=0;i--){const a=start+(end-start)*i/64;ps.push([cx+Math.cos(a)*r0,cy+Math.sin(a)*r0]);}return s.outline(name,ps,depth,color,z,.018);}
 if(id==='theme-cactus'){
  const trunk=s.ellipsoid('CactusTrunk',[320,305,0],[145,225,.59],green),p=trunk.geometry.attributes.position;
  for(let i=0;i<p.count;i++){const x=p.getX(i),z=p.getZ(i),a=Math.atan2(z,x),r=1+.037*Math.cos(a*10);p.setXYZ(i,x*r,p.getY(i),z*r);}trunk.geometry.computeVertexNormals();
  s.sweep('CactusLeftBranch',[[218,382,-.10,36],[146,380,-.10,35],[118,342,-.10,32],[118,295,-.10,24]],green);
  s.sweep('CactusRightBranch',[[424,333,-.10,35],[488,318,-.10,34],[520,277,-.10,31],[521,236,-.10,25]],green);
  s.ellipsoid('CactusLeftBranchTip',[118,295,-.10],[24,24,.12],green);s.ellipsoid('CactusRightBranchTip',[521,236,-.10],[25,25,.125],green);
  for(let row=0;row<6;row++)for(let col=0;col<8;col++){const a=col/8*Math.PI*2,y=132+row*58;if(Math.cos(a)>.5&&y>240&&y<415)continue;const ry=(y-305)/225,r=Math.sqrt(Math.max(0,1-ry*ry));s.cone('CactusSpine'+row+'_'+col,[320+Math.sin(a)*145*r,y,Math.cos(a)*.59*r],.011,.055,'#ead77a',[Math.sin(a),.35,Math.cos(a)]);}
  for(let i=0;i<6;i++){const a=i*Math.PI/3;s.ellipsoid('CactusFlower'+i,[227+Math.cos(a)*36,116+Math.sin(a)*36,.35],[22,31,.09],'#e76885',Math.PI/2-a);}s.ellipsoid('FlowerCenter',[227,116,.45],[19,15,.06],gold);
  for(const name of ['Torso','LeftArm','RightArm']){const part=parts.get(name);if(part){part.group.clear();parts.delete(name);}}
  for(const side of [-1,1]){const leg=parts.get(side<0?'LeftLeg':'RightLeg');leg.group.clear();const l=require('./sculpt-kit.cjs')(THREE,k,leg);l.ellipsoid('CactusLeg'+side,[320+side*35,537,0],[26,31,.22],green);l.ellipsoid('CactusFoot'+side,[320+side*40,564,.03],[29,13,.24],green);}
 }
 if(id==='theme-cherry-blossom'){
  for(let i=0;i<5;i++){const a=-Math.PI/2+i*Math.PI*2/5,cx=320+Math.cos(a)*112,cy=289+Math.sin(a)*112;
   const local=[[-59,46],[-81,2],[-78,-52],[-51,-101],[0,-81],[51,-101],[78,-52],[81,2],[59,46]];
   const ps=local.map(([x,y])=>[cx+x*Math.cos(a+Math.PI/2)-y*Math.sin(a+Math.PI/2),cy+x*Math.sin(a+Math.PI/2)+y*Math.cos(a+Math.PI/2)]);
   k.volume('CherryPetal'+i,ps,[cx,cy],s.pivot,.26,.26,s.parent,k.solid('CherryPetalColor'+i,'#ef98b2'),{art:false,z:-.04,samples:64});
  }s.ellipsoid('FlowerFaceSupport',[320,306,.12],[114,116,.30],'#ed91a9');
 }
 if(id==='theme-cloud'){
  s.ellipsoid('CloudFace',[320,299,0],[177,143,.63],white);
  for(const [i,[x,y,rx,ry]] of [[123,314,70,78],[182,214,75,75],[310,161,101,99],[421,205,81,81],[493,310,78,80]].entries())s.ellipsoid('CloudLobe'+i,[x,y,-.06],[rx,ry,.43],white);
 }
 if(id==='theme-clover'){
  s.ellipsoid('CloverHeart',[320,335,.02],[107,156,.30],green);
  for(let i=0;i<4;i++){const a=i*Math.PI/2+Math.PI/4,cx=320+Math.cos(a)*115,cy=290+Math.sin(a)*115;
   const ps=[[-17,86],[-66,43],[-91,-8],[-80,-65],[-39,-83],[0,-63],[39,-83],[80,-65],[91,-8],[66,43],[17,86]].map(([x,y])=>[cx+x*Math.cos(a+Math.PI/2)-y*Math.sin(a+Math.PI/2),cy+x*Math.sin(a+Math.PI/2)+y*Math.cos(a+Math.PI/2)]);
   s.smoothOutline('CloverLeaf'+i,ps,.26,'#68a63c',-.05,.065);
   s.tube('CloverBackVein'+i,[[320,295,-.205],[cx,cy,-.205],[320+Math.cos(a)*207,290+Math.sin(a)*207,-.16]],.009,'#3f7d35');
  }
 }
 if(id==='theme-crown'){
  s.ellipsoid('RoyalHood',[320,329,0],[143,130,.56],gold);
  const P=[],I=[],n=120;for(let row=0;row<4;row++)for(let i=0;i<n;i++){const a=i/n*Math.PI*2,peak=Math.max(0,1-Math.abs(((i/n*10)%1)*2-1)),r=row<2?.77:.72,y=row%2?143-77*peak:240;P.push(Math.sin(a)*r,(580-y)*.005,Math.cos(a)*r);}
  for(const [u,v] of [[0,1],[1,3],[3,2],[2,0]])for(let i=0;i<n;i++){const j=(i+1)%n,a=u*n+i,b=u*n+j,c=v*n+i,d=v*n+j;I.push(a,b,d,a,d,c);}s.mesh('CrownWall',k.geometry(P,I),gold);
  for(let i=0;i<10;i++){const a=(i+.5)/10*Math.PI*2;s.ellipsoid('CrownPearl'+i,[320+Math.sin(a)*154,66,Math.cos(a)*.77],[13,13,.065],gold);s.ellipsoid('RoyalJewel'+i,[320+Math.sin(a)*157,188,Math.cos(a)*.785],[11,19,.040],i%2?'#dd5671':'#4b8fac');}
 }
 if(id==='theme-guitar'){
  s.smoothOutline('GuitarCostume',[[283,165],[364,180],[414,232],[418,298],[393,361],[401,406],[405,455],[387,492],[342,527],[276,545],[210,526],[162,482],[166,429],[183,384],[153,322],[151,267],[179,210],[222,180]],.48,'#e9b274',-.03,.08);
  s.box('GuitarNeck',[282,158,-.01],[42,164,.20],'#b77b4e',4);s.box('GuitarHeadstock',[282,91,-.01],[71,66,.24],'#d7a067',7);
  for(let i=0;i<3;i++)for(const side of [-1,1])s.ellipsoid('TuningPeg'+side+'_'+i,[282+side*41,78+i*20,-.01],[7,6,.10],'#9d633f');
  const ps=[[208,402],[178,405],[147,434],[133,480],[151,527],[185,565],[225,571],[265,550],[291,510],[326,500],[343,468],[336,419],[308,389],[275,388],[245,408]];
  s.smoothOutline('HeldGuitarBody',ps.map(([x,y])=>[x,480+(y-480)*.92]),.28,'#d5a162',.33,.045);
  s.outline('HeldGuitarNeck',[[257,451],[448,356],[464,381],[271,477]],.16,'#b4824b',.39,.015);
  s.outline('HeldHeadstock',[[441,353],[482,335],[504,373],[461,395]],.18,'#d2a168',.40,.025);
  s.ellipsoid('SoundHole',[274,459,.49],[26,27,.008],'#704931');
  for(let i=0;i<4;i++)s.tube('GuitarString'+i,[[204,487+i*3,.503],[274,453+i*3,.503],[475,365+i*3,.50]],.002,'#e7d4a2');
  for(const [name,cx,cy,rx,ry] of [['Torso',291,518,51,32],['LeftLeg',265,548,22,27],['RightLeg',320,548,22,27]]){const part=parts.get(name);part.group.clear();part.part.pivot=[cx,cy-12];part.group.position.set((cx-320)*.005,(580-cy+12)*.005,0);const limb=require('./sculpt-kit.cjs')(THREE,k,part);limb.ellipsoid(name+'Body',[cx,cy,0],[rx,ry,.13],'#eab16b');limb.paint();}
 }
 if(id==='theme-lightning'){
  const ps=[[265,64],[494,64],[407,199],[557,199],[208,564],[261,394],[88,394]];
  s.outline('LightningBlueEdge',ps,.30,'#4a8db7',0,.035);
  s.outline('LightningGoldFace',ps.map(([x,y])=>[320+(x-320)*.91,302+(y-302)*.94]),.06,'#f8d345',.18,.02);
  s.outline('LightningGoldBack',ps.map(([x,y])=>[320+(x-320)*.91,302+(y-302)*.94]),.06,'#f4c83d',-.18,.02);
 }
 if(id==='theme-maple-leaf'){
  const ps=[[320,68],[363,135],[365,181],[407,148],[410,219],[453,207],[451,242],[543,218],[517,298],[477,321],[528,343],[459,383],[484,403],[410,421],[427,457],[347,448],[320,463],[291,448],[217,457],[231,421],[157,403],[183,383],[112,343],[163,321],[122,298],[97,218],[189,242],[187,207],[230,219],[233,148],[275,181],[277,135]];
  s.outline('MapleLeafBlade',ps,.23,'#d44f32',0,.055);s.ellipsoid('LeafFaceSupport',[320,302,.07],[108,108,.20],'#ee8431');
  for(const [i,[x,y]] of [[320,82],[157,238],[479,238],[201,397],[437,397]].entries())s.tube('MapleBackVein'+i,[[320,428,-.15],[320+(x-320)*.55,328+(y-328)*.55,-.16],[x,y,-.13]],.010,'#a9442b');
 }
 if(id==='theme-moon'){
  const ps=[[433,67],[390,99],[365,146],[366,196],[392,239],[414,270],[420,320],[397,367],[354,406],[302,426],[250,418],[210,393],[180,352],[164,299],[164,246],[180,192],[208,145],[249,107],[303,82],[362,68]];
  s.smoothOutline('CrescentMoon',ps,.52,'#f5c735',0,.13);
 }
 if(id==='theme-music-note'){
  s.ellipsoid('NoteHead',[294,298,0],[142,139,.32],'#424044');s.box('NoteStem',[429,181,-.02],[30,226,.27],'#454246',6);
  s.outline('NoteFlag',[[418,65],[440,85],[474,109],[484,143],[481,185],[463,174],[457,145],[433,137]],.26,'#4e494c',-.01,.045);
 }
 if(id==='theme-paper-airplane'){
  // Folded paper planes: distinct panels with a ridge and wing tips in depth.
  function panel(name,points){const P=points.flatMap(p=>[(p[0]-320)*.005,(580-p[1])*.005,p[2]]),n=points.length;for(const p of points)P.push((p[0]-320)*.005,(580-p[1])*.005,p[2]-.025);const I=[];for(let i=1;i<n-1;i++)I.push(0,i,i+1,n,n+i+1,n+i);for(let i=0;i<n;i++){const j=(i+1)%n;I.push(i,n+i,n+j,i,n+j,j);}return s.mesh(name,k.geometry(P,I),white);}
  panel('PaperLeftWing',[[48,236,-.18],[591,94,-.44],[217,325,-.22]]);panel('PaperRightWing',[[591,94,-.44],[338,447,.04],[217,325,-.22]]);panel('PaperFold',[[217,325,-.22],[196,430,-.38],[591,94,-.44]]);
  s.ellipsoid('PilotHood',[310,246,.12],[136,137,.43],white);
 }
 if(id==='theme-rainbow'){
  const colors=['#d84c51','#f18a3e','#f6d45b','#87ac57','#52a9b1','#587bb2','#8d6ca9'];
  colors.forEach((c,i)=>ringArc('RainbowBand'+i,260-(i+1)*24,260-i*24,Math.PI,Math.PI*2,320,336,c,.24,-.08));
  s.ellipsoid('RainbowHood',[320,303,.05],[116,116,.43],'#668ab9');
 }
 if(id==='theme-rose'){
  s.ellipsoid('RoseHeart',[320,290,0],[141,142,.53],'#c93b3c');
  for(let i=0;i<7;i++){const a=i/7*Math.PI*2,rx=320+Math.cos(a)*117,ry=265+Math.sin(a)*119;s.ellipsoid('RosePetal'+i,[rx,ry,-.09],[70,91,.34],i%2?'#d94a4a':'#c7383c',-a);}
  s.ellipsoid('RoseBud',[318,112,.04],[89,54,.24],'#c43a3c');
  for(const side of [-1,1])s.leaf('RoseSepal'+side,[320,421,-.24],[320+side*155,421,-.24],28,'#4a8438',.12);
  radialPetals('RoseBackSepal',5,320,289,40,136,27,'#5a873d',-.49,.075);
  for(const mesh of s.parent.children.filter(o=>o.name.startsWith('RoseBackSepal'))){const p=mesh.geometry.attributes.position;for(let j=0;j<p.count;j++){const x=p.getX(j)/.005+s.pivot[0],y=s.pivot[1]-p.getY(j)/.005;let back=-.53*Math.sqrt(Math.max(0,1-((x-320)/141)**2-((y-290)/142)**2));for(let i=0;i<7;i++){const a=i/7*Math.PI*2,dx=x-320-Math.cos(a)*117,dy=-(y-265-Math.sin(a)*119),u=(dx*Math.cos(a)-dy*Math.sin(a))/70,v=(dx*Math.sin(a)+dy*Math.cos(a))/91;if(u*u+v*v<1)back=Math.min(back,-.09-.34*Math.sqrt(1-u*u-v*v));}p.setZ(j,back-.025+(p.getZ(j)+.49)*.30);}mesh.geometry.computeVertexNormals();}
 }
 if(id==='theme-snowman'){
  // A snowman has two snowballs and no human arms, hands or legs.
  s.ellipsoid('SnowHead',[318,237,0],[181,179,.76],white);
  s.ellipsoid('SnowBody',[318,472,0],[113,86,.50],white);
  s.cone('SnowCarrot',[347,143,.59],.085,.40,'#ef8829',[1,-.10,.30]);
  for(const [i,x] of [273,366].entries())s.ellipsoid('CoalEye'+i,[x,115,.55],[12,12,.025],'#594239');
  for(let i=0;i<7;i++)s.ellipsoid('CoalSmile'+i,[277+i*16,162+Math.sin(i/6*Math.PI)*19,.69],[4,4,.015],'#594239');
  for(const [i,y] of [443,480].entries())s.ellipsoid('SnowButton'+i,[318,y,.50],[13,13,.025],'#594239');
 }
 if(id==='theme-star'){
  const ps=[];for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,r=i%2?127:242;ps.push([320+Math.cos(a)*r,305+Math.sin(a)*r]);}s.outline('FivePointStar',ps,.64,'#f8cf32',0,.19);
 }
 if(id==='theme-sun'){
  for(let i=0;i<14;i++){const a=i/14*Math.PI*2,ps=[[320+Math.cos(a-.17)*173,286+Math.sin(a-.17)*173],[320+Math.cos(a)*232,286+Math.sin(a)*232],[320+Math.cos(a+.17)*173,286+Math.sin(a+.17)*173]];s.outline('SunRay'+i,ps,.24,'#f59b24',-.03,.03);}
  s.ellipsoid('SunDisk',[320,286,0],[174,174,.46],'#f7b523');
 }
 if(id==='theme-sunflower'){
  radialPetals('SunflowerPetal',15,320,283,104,232,40,'#f6c731',-.07,.11,-Math.PI/2);
  s.ellipsoid('SunflowerDisk',[320,283,0],[138,139,.38],'#9e6a36');
  for(let i=0;i<24;i++){const a=i/24*Math.PI*2;s.ellipsoid('SunflowerSeed'+i,[320+Math.cos(a)*118,283+Math.sin(a)*118,.19],[6,8,.026],'#c79a48',-a);}
  radialPetals('SunflowerSepal',7,320,283,35,140,34,'#5f8a35',-.35,.075);
  // The calyx follows the back of the flower disk; a flat green layer floats
  // away from an ellipsoid when viewed from the side.
  for(const mesh of s.parent.children.filter(o=>o.name.startsWith('SunflowerSepal'))){const p=mesh.geometry.attributes.position;for(let i=0;i<p.count;i++){const x=p.getX(i)/.005+s.pivot[0],y=s.pivot[1]-p.getY(i)/.005,back=-.38*Math.sqrt(Math.max(0,1-((x-320)/138)**2-((y-283)/139)**2));p.setZ(i,back-.025+(p.getZ(i)+.35)*.30);}mesh.geometry.computeVertexNormals();}
 }
 if(id==='theme-tulip'){
  require('./tulip-costume.cjs')(THREE,k,s,parts);
 }
 s.paint();head.authoredFamily='theme';return true;
};
module.exports.ids=ids;
