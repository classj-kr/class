"use strict";
// Explicit short sleeves and feet keep neighboring tail/prop pixels out of
// the limbs. Measurements remain in each character's original 640px space.
module.exports=function landLimbs(THREE,k,id,parts,profile){
 const species=id.replace('animal-','');
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
 }
};
