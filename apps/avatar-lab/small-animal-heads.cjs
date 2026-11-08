"use strict";

// Narrow appendages have their own cross-sections instead of sharing the
// inflation depth of the whole head silhouette.
module.exports=function smallAnimalHeads(THREE,k,id,head){
 if(!['animal-butterfly','animal-flamingo','animal-frog'].includes(id))return false;
 const g=head.group,offset=g.position.clone();g.clear();
 const local=p=>p.map((v,i)=>v-offset.getComponent(i));
 const pixel=([x,y,z=0])=>local([(x-320)*.005,(580-y)*.005,z]);
 function egg(name,size,color,p){return k.ellipsoid(name,size,k.solid(name+'Color',color),g,local(p));}
 function tube(name,path,r,color){return k.tube(name,path.map(pixel),r,k.solid(name+'Color',color),g);}
 let hood,face;
 if(id==='animal-butterfly'){
  hood=egg('ButterflyHood',[.75,.69,.57],'#b475b1',[0,1.385,0]);face=[320,334,114,96];
  const path=[[276,195,.36],[265,151,.22],[250,111,.07],[224,85,.03],[194,83,0],[181,107,0],[195,127,0],[213,120,0],[210,108,0],[198,107,0]];
  for(const side of [-1,1])tube('ButterflyAntenna'+side,path.map(([x,y,z])=>[320+side*(x-320),y,z]),.037,'#4c303a');
 }
 if(id==='animal-flamingo'){
  hood=egg('FlamingoHood',[.665,.575,.55],'#ee9caf',[0,1.365,0]);face=[320,337,108,79];
  tube('FlamingoNeck',[[309,254,.47],[299,221,.43],[309,182,.34],[322,143,.20],[315,114,.09],[293,107,.02]],.13,'#ec8fa4');
  egg('FlamingoBirdHead',[.275,.25,.21],'#ed9aac',[-.15,2.345,0]);
  tube('FlamingoBeakBase',[[269,127,.10],[247,137,.12],[234,152,.12]],.105,'#f0c0b4');
  tube('FlamingoBeakTip',[[234,152,.12],[225,169,.12],[226,181,.12]],.085,'#4f3735');
 }
 if(id==='animal-frog'){
  hood=egg('FrogHood',[.87,.77,.62],'#8fb84e',[0,1.465,0]);face=[323,307,122,100];
  for(const side of [-1,1]){
   egg('FrogEyeBulb'+side,[.31,.34,.34],'#8bb247',[side*.53,2.275,.10]);
   tube('FrogArm'+side,[[320+side*54,425,0],[320+side*100,417,.07],[320+side*154,385,.12]],.075,'#80a642');
   egg('FrogPalm'+side,[.13,.15,.075],'#97bc51',[side*.805,1.025,.13]);
   const fingers=[[[159,376],[140,359],[128,348]],[[161,371],[167,351],[169,336]],[[153,384],[135,395],[116,396]]];
   for(const [i,path] of fingers.entries()){
    const mirrored=path.map(([x,y])=>[320+side*(x-320),y,.14]);
    tube('FrogFinger'+side+'_'+i,mirrored,.038,'#95ba51');
    const [x,y,z]=mirrored[mirrored.length-1];egg('FrogFingerPad'+side+'_'+i,[.052,.048,.039],'#a1c45c',[(x-320)*.005,(580-y)*.005,z]);
   }
  }
 }
 k.projectArtwork('OriginalFace',k.ellipse(...face),face.slice(0,2),head.part.pivot,g,hood);
 require('./project-model-artwork.cjs')(THREE,k,g,head.part.pivot);
 head.special=true;return true;
};
