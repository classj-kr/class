"use strict";
const specs={
 'fruit-apple':{color:'#d94e3c',profile:[[442,0],[442,85],[408,147],[340,177],[260,184],[188,161],[146,111],[142,60],[162,0]],stem:[[320,159],[307,117],[287,93]],leaves:[[[318,145],[389,87],24]]},
 'fruit-avocado':{color:'#78963d',profile:[[545,0],[531,81],[497,128],[444,149],[365,136],[283,107],[203,75],[130,44],[98,0]]},
 'fruit-blueberry':{color:'#58749e',profile:[[432,0],[414,83],[367,144],[292,170],[218,151],[164,98],[139,47],[151,0]]},
 'fruit-cherry':{color:'#c94246',profile:[[578,0],[556,93],[509,148],[443,162],[384,146],[340,87],[346,0]],stem:[[320,351],[334,269],[350,195],[354,137]],leaves:[[[354,161],[241,145],34]]},
 'fruit-mango':{color:'#edba42',profile:[[540,0,267],[529,76,269],[492,121,288],[424,139,305],[320,158,317],[234,153,318],[161,116,320],[113,57,320],[111,0,320]],stem:[[344,125],[344,74]],leaves:[[[354,93],[498,189],39]]},
 'fruit-melon':{color:'#a7bf71',profile:[[426,0],[407,90],[361,148],[283,162],[207,142],[157,86],[141,0]],stem:[[320,149],[320,102],[286,96],[353,94]]},
 'fruit-orange':{color:'#e9a03e',profile:[[433,0],[414,95],[368,159],[292,177],[219,150],[171,98],[159,0]],stem:[[320,166],[314,124]],leaves:[[[324,143],[405,103],23]]},
 'fruit-peach':{color:'#eaa09b',profile:[[422,0],[415,99],[386,159],[330,194],[264,198],[200,172],[148,125],[105,64],[63,0]],leaves:[[[300,424],[180,437],25],[[337,423],[461,432],25]]},
 'fruit-persimmon':{color:'#e69138',profile:[[433,0],[423,108],[385,178],[319,208],[245,209],[175,179],[119,122],[89,56],[102,0]]},
 'fruit-pineapple':{color:'#e2b344',profile:[[453,0],[441,77],[405,119],[345,134],[280,126],[226,99],[190,61],[175,0]]},
 'fruit-strawberry':{color:'#d54b47',profile:[[478,0],[460,55],[411,108],[348,150],[274,170],[204,163],[152,123],[125,61],[145,0]]},
 'vegetable-bell-pepper':{color:'#c94635',profile:[[437,0],[416,90],[363,124],[283,147],[209,158],[165,121],[161,0]],stem:[[320,169],[334,130],[326,105],[305,94]]},
 'vegetable-carrot':{color:'#e89743',profile:[[536,0],[495,43],[430,80],[351,107],[282,118],[236,82],[223,0]]},
 'vegetable-eggplant':{color:'#80518e',profile:[[535,0],[521,75],[479,124],[416,135],[339,116],[262,91],[188,75],[151,48],[140,0]],stem:[[320,169],[326,124],[306,100]]},
 'vegetable-potato':{color:'#c5a270',profile:[[544,0,318],[532,88,318],[491,138,321],[415,158,326],[327,149,324],[236,136,316],[160,93,310],[123,0,312]]},
 'vegetable-pumpkin':{color:'#df9a42',profile:[[432,0],[416,111],[375,173],[304,187],[229,168],[185,110],[192,0]],stem:[[320,192],[313,151],[327,126],[312,114]]},
 'vegetable-sweet-potato':{color:'#b56977',profile:[[537,0,315],[510,58,307],[448,107,306],[360,128,312],[275,111,323],[198,71,327],[133,30,313],[103,0,303]]},
 'vegetable-tomato':{color:'#d54e3c',profile:[[432,0],[420,104],[380,162],[315,183],[245,179],[182,144],[133,85],[119,0]]}
};
module.exports=function produce(THREE,k,id,head,parts){
 if(!specs[id]&&!['fruit-watermelon','vegetable-corn','vegetable-broccoli'].includes(id))return false;
 if(id==='fruit-cherry'){require('./cherry-form.cjs')(THREE,k,head);return true;}
 const s=require('./sculpt-kit.cjs')(THREE,k,head);s.parent.clear();let body;
 const green='#658e3d',vein='#426a31';
 function foliage(name,base,tip,width,color,depth=.07){
  const dx=tip[0]-base[0],dy=tip[1]-base[1],length=Math.hypot(dx,dy),nx=-dy/length,ny=dx/length,ps=[];
  for(const side of [1,-1])for(let j=0;j<=12;j++){const t=side===1?j/12:1-j/12,w=Math.sin(Math.PI*t)*width;ps.push([base[0]+dx*t+nx*w*side,base[1]+dy*t+ny*w*side]);}
  k.volume(name,ps,[(base[0]+tip[0])/2,(base[1]+tip[1])/2],s.pivot,depth,depth,s.parent,k.solid(name+'Color',color),{art:false,z:base[2]||0,samples:48});
 }

 if(specs[id]){
  const spec=specs[id];
  if(id==='fruit-mango'){
   k.volume('MangoFruit',[[148,477],[159,416],[153,326],[158,241],[188,173],[245,124],[320,109],[401,137],[456,200],[479,283],[471,361],[443,423],[414,478],[344,519],[260,542],[188,536],[145,512]],[310,322],s.pivot,.72,.72,s.parent,k.solid('MangoGold',spec.color),{art:false,samples:96});
  }else body=s.lathe('ProduceBody',spec.profile,spec.color);
  if(spec.stem)s.tube('Stem',spec.stem.map(([x,y])=>[x,y,0]),.035,green);
  for(const [i,[base,tip,w]] of (spec.leaves||[]).entries()){foliage('Leaf'+i,[...base,.04],tip,w,green,.07);s.tube('LeafVein'+i,[[...base,.09],[...tip,.09]],.008,vein);}
  if(id==='vegetable-pumpkin'||id==='vegetable-bell-pepper'){
   const p=body.geometry.attributes.position;for(let i=0;i<p.count;i++){const x=p.getX(i),z=p.getZ(i),a=Math.atan2(z,x),f=1+(id==='vegetable-pumpkin'?.055:.045)*Math.cos(a*(id==='vegetable-pumpkin'?8:4));p.setXYZ(i,x*f,p.getY(i),z*f);}body.geometry.computeVertexNormals();
  }
  if(['fruit-persimmon','fruit-strawberry','vegetable-tomato','vegetable-eggplant'].includes(id)){
   const caps={
    'fruit-persimmon':[[320,72],[352,88],[400,82],[446,102],[410,127],[368,128],[350,158],[319,181],[287,158],[274,128],[230,130],[192,101],[246,83],[288,89]],
    'fruit-strawberry':[[319,115],[366,107],[425,131],[386,151],[371,180],[332,167],[306,180],[278,160],[241,169],[250,143],[216,130],[271,111]],
    'vegetable-tomato':[[320,112],[378,96],[365,116],[412,123],[367,137],[372,174],[322,146],[264,177],[274,142],[224,124],[280,115],[253,97]],
    'vegetable-eggplant':[[317,116],[359,127],[393,157],[407,176],[365,169],[346,152],[342,184],[320,205],[298,187],[291,151],[271,170],[228,178],[251,146],[283,125]]
   };
   const cy={'fruit-persimmon':119,'fruit-strawberry':141,'vegetable-tomato':130,'vegetable-eggplant':151}[id];
   k.volume('AttachedCalyx',caps[id],[320,cy],s.pivot,.38,.38,s.parent,k.solid('CalyxGreen',green),{art:false,samples:96});
   if(id==='fruit-strawberry'||id==='vegetable-tomato')s.sweep('CalyxStalk',[[320,cy,0,12],[320,94,0,11],[328,69,.02,8]],green);

  }
  if(id==='fruit-pineapple'){
   // Leaf roots enter the top of the fruit; staggered depth makes a real crown.
   for(const [i,[x,y,tx,ty,z,w]] of [[290,185,242,100,-.08,23],[315,183,320,68,-.10,25],[343,185,390,101,-.08,23],[282,192,235,149,.08,19],[350,192,405,148,.08,19],[316,187,319,125,.22,24]].entries())foliage('PineappleCrown'+i,[x,y,z],[tx,ty],w,green,.085);
  }
  if(id==='vegetable-carrot')for(let i=0;i<5;i++)s.leaf('CarrotLeaf'+i,[320+(i-2)*12,235,0],[320+(i-2)*31,119+Math.abs(i-2)*13],19,green,.07);
  if(id==='fruit-blueberry'){
   const loop=[];for(let i=0;i<=64;i++){const a=i/64*Math.PI*2,r=32+7*Math.cos(a*5);loop.push([320+Math.cos(a)*r,141+Math.sin(a)*r*.35,.05]);}s.tube('BerryCrown',loop,.023,'#384f79');
  }
  if(['fruit-melon','fruit-pineapple','fruit-strawberry','vegetable-potato','vegetable-sweet-potato'].includes(id)){
   const profile=spec.profile;
   function radius(y){for(let i=0;i<profile.length-1;i++)if(y<=profile[i][0]&&y>=profile[i+1][0]){const t=(profile[i][0]-y)/(profile[i][0]-profile[i+1][0]);return (profile[i][1]*(1-t)+profile[i+1][1]*t)*.005;}return 0;}
   if(id==='fruit-melon'||id==='fruit-pineapple')for(const direction of [-1,1])for(let line=0;line<12;line++){
    const ps=[],top=id==='fruit-melon'?159:190,bottom=id==='fruit-melon'?406:433;
    for(let j=0;j<=60;j++){const t=j/60,y=top+(bottom-top)*t,r=radius(y)+.006,a=line/12*Math.PI*2+direction*t*2.8;const x=320+Math.sin(a)*r/.005,z=Math.cos(a)*r;
     // Leave the original face unobstructed; the net continues around the rear.
     if(z>0&&((x-320)/126)**2+((y-330)/99)**2<1.12){if(ps.length>1)s.tube('Net'+direction+'_'+line+'_'+j,ps,.006,id==='fruit-melon'?'#dce5a7':'#b88735');ps.length=0;}else ps.push([x,y,z]);
    }if(ps.length>1)s.tube('Net'+direction+'_'+line,ps,.006,id==='fruit-melon'?'#dce5a7':'#b88735');
   }
   else for(let i=0;i<30;i++){
    const y=id==='fruit-strawberry'?208+(i%6)*39:id==='vegetable-potato'?190+(i%6)*52:180+(i%6)*56,a=(i*2.399)% (Math.PI*2),r=radius(y),x=320+Math.sin(a)*(r+.01)/.005,z=Math.cos(a)*(r+.01);
    if(z>0)continue;const o=s.ellipsoid('SkinMark'+i,[x,y,z],id==='fruit-strawberry'?[3,5,.009]:[4,2,.009],id==='fruit-strawberry'?'#f7d99a':id==='vegetable-potato'?'#a18357':'#95505f');o.rotation.y=a;
   }
  }
 }
 if(id==='fruit-watermelon'){
  const ps=[[320,66],[518,381]];for(let i=0;i<=32;i++){const a=i/32*Math.PI;ps.push([320+Math.cos(a)*198,381+Math.sin(a)*67]);}body=s.outline('MelonWedge',ps,.52,'#d85f5c',0,.035);
  const rind=[];for(let i=0;i<=48;i++){const a=i/48*Math.PI;rind.push([320+Math.cos(a)*198,381+Math.sin(a)*67,.02]);}s.tube('GreenRind',rind,.065,'#6e9945');
  for(let i=0;i<10;i++){const y=190+(i%4)*45,x=320+((i*71)%180)-90;s.ellipsoid('RearMelonSeed'+i,[x,y,-.29],[5,8,.009],'#49362b');}
 }
 if(id==='vegetable-broccoli'){
  body=s.ellipsoid('BroccoliHood',[320,335,0],[122,105,.54],'#8aa34c');
  for(const [i,[x,y,rx,ry]] of [[206,210,83,86],[307,166,91,94],[418,209,79,86],[155,253,57,64],[473,249,49,61]].entries()){
   s.ellipsoid('BroccoliFloret'+i,[x,y,-.08],[rx,ry,.40],i%2?'#4d8335':'#5b903b');
   for(let j=0;j<7;j++){const a=j/7*Math.PI*2;s.ellipsoid('FloretBump'+i+'_'+j,[x+Math.cos(a)*rx*.75,y+Math.sin(a)*ry*.75,-.14],[21,22,.13],'#588d37');}
  }
 }
 if(id==='vegetable-corn'){
  body=s.lathe('CornCob',[[532,0],[500,62],[432,102],[337,112],[247,95],[167,60],[112,0]],'#ecc84d');
  for(let row=0;row<13;row++)for(let col=0;col<14;col++){
   const y=147+row*26,r=(y<250?57+(y-147)*.39:y>380?107-(y-380)*.3:107)*.005,a=col/14*Math.PI*2,x=320+Math.sin(a)*r/.005,z=Math.cos(a)*r;
   if(z>0&&((x-320)/108)**2+((y-347)/89)**2<1.15)continue;
   const kernel=s.ellipsoid('CornKernel'+row+'_'+col,[x,y,z],[13,12,.04],(row+col)%3?'#f1cc54':'#f7d66d');kernel.rotation.y=a;
  }
  for(const side of [-1,1]){
   const ps=[[320,534],[320+side*70,502],[320+side*115,442],[320+side*164,396],[320+side*143,359],[320+side*96,404],[320+side*39,468]];
   s.outline('CornHusk'+side,ps,.15,'#85a43e',.47,.03);
   s.tube('HuskVein'+side,[[320,530,.57],[320+side*60,472,.57],[320+side*124,399,.57]],.009,'#5f842f');
  }
 }
 s.paint();
 if(id==='fruit-mango'&&parts){
  const torso=parts.get('Torso');if(torso){torso.group.clear();parts.delete('Torso');}
  for(const side of [-1,1]){
   const name=side<0?'LeftArm':'RightArm',pivot=[side<0?183:431,402];let arm=parts.get(name);
   if(!arm){arm={part:{pivot},group:k.group(name,pivot)};parts.set(name,arm);}
   arm.group.clear();arm.part.pivot=pivot;arm.group.position.set((pivot[0]-320)*.005,(580-pivot[1])*.005,side<0?-.3:0);
   const a=require('./sculpt-kit.cjs')(THREE,k,arm);
   a.sweep('MangoSleeve'+side,[[pivot[0],402,side<0?-.3:.12,15],[pivot[0]+side*12,440,side<0?-.3:.18,16],[pivot[0]+side*7,471,side<0?-.3:.18,14]],'#edba42');
   const leg=parts.get(side<0?'LeftLeg':'RightLeg');leg.group.clear();const l=require('./sculpt-kit.cjs')(THREE,k,leg);
   l.ellipsoid('MangoLeg'+side,[320+side*35,543,0],[20,27,.16],'#edba42');l.ellipsoid('MangoFoot'+side,[320+side*39,564,.05],[25,12,.18],'#edba42');
  }
 }
 const suits={
  'fruit-apple':[438,489,67,58,'#d94e3c'],
  'fruit-peach':[424,489,69,58,'#efada6'],
  'fruit-persimmon':[428,487,65,59,'#e69138'],
  'fruit-pineapple':[447,497,63,52,'#e2b344'],
  'fruit-strawberry':[470,516,53,36,'#e78a91'],
  'vegetable-tomato':[427,488,66,59,'#d54e3c']
 };
 if(parts&&suits[id]){
  const [shoulder,cy,rx,ry,color]=suits[id],torso=parts.get('Torso');
  torso.group.clear();const t=require('./sculpt-kit.cjs')(THREE,k,torso);
  t.ellipsoid('CompactFruitSuit',[320,cy,0],[rx,ry,.28],color);t.paint();
  for(const side of [-1,1]){
   const name=side<0?'LeftArm':'RightArm',leg=parts.get(side<0?'LeftLeg':'RightLeg'),pivot=[320+side*rx*.55,shoulder+24];
   let arm=parts.get(name);if(!arm){arm={part:{pivot},group:k.group(name,pivot)};parts.set(name,arm);}
   arm.group.clear();arm.part.pivot=pivot;arm.group.position.set((pivot[0]-320)*.005,(580-pivot[1])*.005,0);
   const a=require('./sculpt-kit.cjs')(THREE,k,arm);
   a.sweep('FruitSleeve'+side,[[pivot[0],pivot[1],0,14],[320+side*(rx+13),cy,.01,15],[320+side*(rx+19),cy+15,.025,13]],color);
   leg.group.clear();const l=require('./sculpt-kit.cjs')(THREE,k,leg);
   l.ellipsoid('FruitLeg'+side,[320+side*38,547,0],[22,25,.18],color);
   l.ellipsoid('FruitFoot'+side,[320+side*43,564,.035],[25,13,.20],color);
  }
 }
 head.authoredFamily='produce';return true;
};
module.exports.ids=[...Object.keys(specs),'fruit-watermelon','vegetable-corn','vegetable-broccoli'];
