"use strict";
module.exports=function bee(THREE){
 const k=require('./model-kit.cjs')(THREE,'animal-bee'),head=k.group('Head',[320,580]);
 const gold=k.solid('BeeGold','#f4c64f'),brown=k.solid('BeeBrown','#4e3424'),blue=k.solid('BeeWing','#bce3f2');
 function egg(n,s,m,p,parent=head){return k.ellipsoid(n,s,m,parent,p);}
 const hood=egg('BeeHood',[.79,.75,.70],gold,[-.14,1.48,0]);
 k.projectArtwork('OriginalFace',k.ellipse(293,315,118,99),[293,315],[320,580],head,hood);
 for(const side of [-1,1]){
  k.tube('Antenna'+side,[[.28*side-.14,2.02,.44],[.43*side-.14,2.36,.20],[.71*side-.14,2.46,.02]],.045,brown,head);
  egg('AntennaTip'+side,[.135,.14,.12],gold,[.73*side-.14,2.45,.02]);
 }
 k.suit([
  ['Torso',[293,485],[[243,429],[338,429],[354,474],[341,526],[315,547],[267,543],[231,514],[226,473]],[292,483],.24,0],
  ['LeftArm',[236,442],[[224,430],[241,441],[229,477],[218,505],[202,509],[195,496],[211,459]],[219,473],.09,0],
  ['RightArm',[350,438],[[344,428],[365,440],[383,443],[403,429],[414,442],[397,465],[369,476],[350,465]],[373,449],.10,0],
  ['LeftLeg',[271,540],[[253,533],[285,537],[282,558],[265,575],[249,575],[241,562]],[266,553],.13,0],
  ['RightLeg',[322,541],[[309,535],[334,535],[341,557],[348,565],[342,576],[324,574],[310,560]],[327,553],.13,0]
 ],'#4e3424');
 const torso=k.root.getObjectByName('Torso');
 const back=k.root.getObjectByName('TorsoSuitBack').geometry.clone(),uv=[];
 for(let i=0;i<back.attributes.position.count;i++){const p=back.attributes.position;uv.push((p.getX(i)/.005+293)/640,(485-p.getY(i)/.005)/640);p.setZ(i,p.getZ(i)-.003);}
 back.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));k.mesh('BeeBackStripes',back,k.art,torso);
 for(const side of [-1,1])for(let lower=0;lower<2;lower++){
  const wing=k.group((side<0?'Left':'Right')+'Wing'+lower,[293+side*53,445],-.18);
  const o=egg('WingLobe'+side+'_'+lower,lower?[.29,.15,.075]:[.41,.25,.09],blue,[side*(lower?.14:.26),lower?-.16:.25,-.01],wing);o.rotation.z=side*(lower?-.20:.28);
 }
 const hand=k.root.getObjectByName('RightArm'),prop=new THREE.Group();prop.name='HoneyDipper';prop.position.set(.82-hand.position.x,1.055-hand.position.y,.18);prop.rotation.z=-.60;hand.add(prop);
 egg('GripMitten',[.085,.09,.085],brown,[.54-hand.position.x,.65-hand.position.y,.13],hand);
 k.mesh('DipperHandle',new THREE.CylinderGeometry(.035,.035,.93,24),k.solid('Wood','#a87955'),prop,[0,-.54,0]);
 egg('DipperCore',[.19,.26,.18],k.solid('Honey','#e9b04c'),[0,0,0],prop);
 for(let i=0;i<5;i++){const y=(i-2)*.082,r=.19*Math.sqrt(1-(y/.29)**2);k.mesh('DipperGroove'+i,new THREE.CylinderGeometry(r+.004,r+.004,.023,32),k.solid('DipperWoodGroove','#9e6528'),prop,[0,y,0]);}
 egg('HoneyDrip',[.035,.15,.035],gold,[.10,-.33,.07],prop);
 require('./project-model-artwork.cjs')(THREE,k,head,[320,580]);
 const result=k.finish({holdLeft:true,authoring:'Separate bee hood, antennae, four attached wing lobes and a held honey dipper'});
 Object.assign(result.root.userData,{locomotion:'walk',canWave:false});return result;
};
