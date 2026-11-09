"use strict";
// Explicit short sleeves and feet keep neighboring tail/prop pixels out of
// the limbs. Measurements remain in each character's original 640px space.
module.exports=function landLimbs(THREE,k,id,parts,profile){
 const species=id.replace('animal-','');
 if(require('./compact-animal-suits.cjs')(THREE,k,species,parts))return;
 if(species==='panda'){
  const torso=parts.get('Torso');torso.group.clear();const t=require('./sculpt-kit.cjs')(THREE,k,torso),color='#343633';
  k.volume('PandaSuit',[[273,386],[367,386],[383,410],[397,440],[401,480],[390,510],[395,536],[381,544],[341,544],[297,544],[258,544],[245,536],[250,510],[239,480],[243,440],[259,410]],[320,468],t.pivot,.30,.30,t.parent,k.solid('PandaSuitColor',color),{samples:80});
  const sleeve=[[250,391],[230,400],[210,429],[199,458],[193,481],[200,499],[215,506],[231,498],[239,472],[250,440],[262,407]],foot=[[250,518],[240,535],[247,550],[255,567],[266,576],[287,577],[303,571],[310,554],[309,532]];
  for(const side of [-1,1])for(const [partName,shape,center,pivot,depth] of [[side<0?'LeftArm':'RightArm',sleeve,[320+side*99,458],[320+side*66,401],.13],[side<0?'LeftLeg':'RightLeg',foot,[320+side*41,549],[320+side*36,525],.20]]){
   const part=parts.get(partName);part.group.clear();part.part.pivot=pivot;part.group.position.set((pivot[0]-320)*.005,(580-pivot[1])*.005,0);const s=require('./sculpt-kit.cjs')(THREE,k,part);
   const outline=partName==='RightLeg'?[[328,520],[397,520],[397,540],[388,560],[374,574],[351,578],[334,572],[324,556],[320,536]]:shape.map(([x,y])=>[320+side*(320-x),y]);
   k.volume('RoundedPanda'+partName,outline,center,s.pivot,depth,depth,s.parent,k.solid('Panda'+partName+'Color',color),{samples:80});
  }
  return;
 }
 if(species==='tiger'){
  const cx=311,color='#fba436',torso=parts.get('Torso');torso.group.clear();const t=require('./sculpt-kit.cjs')(THREE,k,torso);
  k.volume('TigerSuit',[[267,437],[355,437],[369,456],[374,484],[370,517],[357,535],[329,540],[294,540],[266,534],[249,517],[247,484],[255,456]],[311,485],t.pivot,.28,.28,t.parent,k.solid('TigerSuitColor',color),{samples:80});
  const sleeve=[[251,441],[236,446],[224,459],[215,477],[207,498],[208,512],[216,525],[232,529],[244,521],[248,502],[254,470]];
  const foot=[[260,525],[250,542],[237,550],[230,560],[231,571],[240,581],[264,585],[291,581],[303,570],[306,548],[302,529]];
  for(const side of [-1,1]){
   for(const [partName,shape,center,pivot,depth] of [[side<0?'LeftArm':'RightArm',sleeve,[cx+side*80,487],[cx+side*53,443],.13],[side<0?'LeftLeg':'RightLeg',foot,[cx+side*43,556],[cx+side*34,528],.20]]){
    const part=parts.get(partName);part.group.clear();part.part.pivot=pivot;part.group.position.set((pivot[0]-320)*.005,(580-pivot[1])*.005,0);const s=require('./sculpt-kit.cjs')(THREE,k,part);
    k.volume('RoundedTiger'+partName,shape.map(([x,y])=>[cx+side*(cx-x),y]),center,s.pivot,depth,depth,s.parent,k.solid('Tiger'+partName+'Color',color),{samples:80});
   }
  }
  return;
 }
 const settings={
  squirrel:[262,430,490,537,38,78,'#c08e59','#c08e59'],
  panda:[320,411,483,534,39,91,'#343633','#343633'],
  hedgehog:[320,456,502,548,33,73,'#e5bcae','#d8ad9e'],
  fox:[320,446,499,535,37,74,'#bf642e','#75462d'],
  wolf:[320,434,496,536,38,74,'#8f9294','#8f9294'],
  lion:[320,467,506,537,35,70,'#edbb52','#edbb52'],
  llama:[320,424,483,544,35,79,'#e9d9b9','#a68a6f']
 };
 const spec=settings[species];if(!spec)return;
 const [cx,shoulder,handY,legY,legX,handX,color,footColor]=spec;
 if(species==='fox'||species==='wolf'){
  const fur=species==='fox'?'#bc642b':'#909294',torso=parts.get('Torso');torso.group.clear();const t=require('./sculpt-kit.cjs')(THREE,k,torso);
  const body=[[281,434],[359,434],[375,455],[379,483],[371,512],[358,534],[337,545],[302,545],[280,535],[267,514],[261,484],[266,456]];
  k.volume('CanineSuit',body,[320,485],t.pivot,.27,.27,t.parent,k.solid('CanineSuitColor',fur),{samples:80});
  const armPoints=species==='fox'?[[278,439],[261,449],[251,472],[243,493],[242,508],[249,521],[260,523],[272,516],[274,494],[284,464]]:[[278,437],[261,449],[250,475],[242,498],[246,512],[258,519],[271,514],[274,491],[284,461]];
  const footPoints=[[280,527],[269,542],[259,558],[259,571],[271,579],[289,579],[304,571],[310,552],[309,532]];
  for(const side of [-1,1]){
   const arm=parts.get(side<0?'LeftArm':'RightArm'),pivot=[320+side*45,441];arm.group.clear();arm.part.pivot=pivot;arm.group.position.set((pivot[0]-320)*.005,(580-pivot[1])*.005,0);const a=require('./sculpt-kit.cjs')(THREE,k,arm);
   k.volume('CanineSleeve'+side,armPoints.map(([x,y])=>[320+side*(320-x),y]),[320+side*59,483],a.pivot,.12,.12,a.parent,k.solid('CanineSleeveColor'+side,fur),{samples:64});
   const leg=parts.get(side<0?'LeftLeg':'RightLeg');leg.group.clear();const l=require('./sculpt-kit.cjs')(THREE,k,leg);
   k.volume('CanineBoot'+side,footPoints.map(([x,y])=>[320+side*(320-x),y]),[320+side*33,552],l.pivot,.19,.20,l.parent,k.solid('CanineBootColor'+side,footColor),{samples:64});
  }
  return;
 }
 for(const side of [-1,1]){
  const name=side<0?'LeftArm':'RightArm',pivot=[cx+side*42,shoulder];let arm=parts.get(name);
  if(!arm){arm={part:{pivot},group:k.group(name,pivot)};parts.set(name,arm);}
  arm.group.clear();arm.part.pivot=pivot;arm.group.position.set((pivot[0]-320)*.005,(580-pivot[1])*.005,0);
  const a=require('./sculpt-kit.cjs')(THREE,k,arm);
  a.sweep('ConnectedSleeve'+side,[[cx+side*42,shoulder,0,16],[cx+side*(handX-10),(shoulder+handY)/2,.015,18],[cx+side*handX,handY,.035,15]],color);
  a.ellipsoid('RoundedHand'+side,[cx+side*handX,handY,.035],[16,17,.085],species==='wolf'?'#d7d7cf':species==='llama'?'#a68a6f':color);
  const leg=parts.get(side<0?'LeftLeg':'RightLeg');leg.group.clear();const l=require('./sculpt-kit.cjs')(THREE,k,leg);
  l.ellipsoid('ConnectedLeg'+side,[cx+side*legX,legY+7,0],[25,27,.20],color);
  l.ellipsoid('RoundedFoot'+side,[cx+side*(legX+5),Math.min(565,legY+28),.065],[30,species==='panda'?21:15,.24],footColor);
  if(species==='panda'||species==='lion'){a.paint();l.paint();}
 }
};
