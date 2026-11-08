"use strict";
module.exports=function(THREE){
  const k=require("./model-kit.cjs")(THREE,"vehicle-helicopter"),{solid,mesh,group,ellipsoid,volume,tube}=k;
  const red=solid("HelicopterRed","#cf2635",.65),darkRed=solid("DarkRedTrim","#761f2d"),blue=solid("CockpitBlue","#8ab1cb",.22),metal=solid("RotorSilver","#b6acba",.6),dark=solid("RotorEdge","#584151"),skin=solid("FaceBase","#ffd2b2");
  const head=group("Head",[290,275]);
  ellipsoid("HelmetHull",[.84,.74,.66],red,head);
  const p=[],ix=[],U=32,V=24;
  for(let u=0;u<=U;u++)for(let v=0;v<=V;v++){
    const theta=-1.58+u/U*1.40,t=Math.max(0,Math.min(1,(theta+1.30)/.80)),low=-.30+.80*t*t*(3-2*t),lat=low+v/V*(1.47-low);
    p.push(.842*Math.sin(theta)*Math.cos(lat),.742*Math.sin(lat),.662*Math.cos(theta)*Math.cos(lat));
    if(u<U&&v<V){const a=u*(V+1)+v;ix.push(a,a+V+1,a+1,a+1,a+V+1,a+V+2);}
  }
  mesh("BlueCockpitPanel",k.geometry(p,ix),blue,head);
  const seam=[];for(let i=0;i<=24;i++){const lat=.50+i/24*.97;seam.push([.85*Math.sin(-.18)*Math.cos(lat),.75*Math.sin(lat),.67*Math.cos(-.18)*Math.cos(lat)]);}tube("CockpitSeam",seam,.014,darkRed,head);
  k.projectArtwork("OriginalFace",[[184,287],[194,253],[220,226],[255,212],[290,210],[328,216],[363,234],[390,263],[401,299],[392,332],[366,359],[332,378],[289,383],[246,374],[209,355],[187,327]],[292,299],[290,275],head,head.getObjectByName("HelmetHull"));
  k.projectArtwork("OriginalCockpit",[[258,139],[269,147],[270,184],[259,206],[222,221],[194,245],[181,274],[178,316],[152,335],[139,315],[130,281],[139,242],[158,203],[185,172],[221,149]],[196,232],[290,275],head,[head.getObjectByName("HelmetHull"),head.getObjectByName("BlueCockpitPanel")]);
  // Rear fuselage: a tapered boom with a fin and a separate tail rotor.
  const a=new THREE.Vector3(.47,.06,-.36),b=new THREE.Vector3(.98,.30,-1.02),delta=b.clone().sub(a);
  const boom=mesh("TailBoom",new THREE.CylinderGeometry(.105,.24,delta.length()+.14,24),red,head,a.clone().add(b).multiplyScalar(.5).toArray());boom.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),delta.normalize());
  const finShape=new THREE.Shape();finShape.moveTo(-.12,-.13);finShape.lineTo(.16,-.08);finShape.lineTo(.20,.43);finShape.quadraticCurveTo(.15,.52,.07,.43);finShape.lineTo(-.13,.12);finShape.closePath();
  const fin=mesh("TailFin",new THREE.ExtrudeGeometry(finShape,{depth:.08,bevelEnabled:true,bevelSize:.025,bevelThickness:.025,bevelSegments:3,steps:1}),darkRed,head,[.96,.29,-1.02]);fin.rotation.y=.55;
  const tailRotor=new THREE.Group();tailRotor.name="TailRotor";tailRotor.position.set(1.02,.35,-.86);tailRotor.rotation.y=.55;head.add(tailRotor);
  ellipsoid("TailRotorHub",[.08,.08,.075],dark,tailRotor);
  for(let i=0;i<3;i++){const blade=ellipsoid("TailRotorBlade"+i,[.065,.20,.025],metal,tailRotor,[Math.sin(i/3*Math.PI*2)*.15,Math.cos(i/3*Math.PI*2)*.15,0]);blade.rotation.z=-i/3*Math.PI*2;}
  mesh("RotorMast",new THREE.CylinderGeometry(.065,.11,.25,20),darkRed,head,[0,.78,0]);
  const rotor=new THREE.Group();rotor.name="Rotor";rotor.position.set(0,.92,0);head.add(rotor);
  ellipsoid("RotorHub",[.11,.075,.11],dark,rotor);
  // Blades lie in the horizontal XZ plane, with real thickness and rounded tips.
  for(const sign of [-1,1]){
    const shape=new THREE.Shape();shape.moveTo(.04,-.045);shape.lineTo(.97,-.105);shape.quadraticCurveTo(1.20,-.10,1.23,-.02);shape.quadraticCurveTo(1.17,.10,.98,.10);shape.lineTo(.04,.045);shape.closePath();
    const blade=mesh("MainRotorBlade"+sign,new THREE.ExtrudeGeometry(shape,{depth:.025,bevelEnabled:true,bevelSize:.012,bevelThickness:.01,bevelSegments:2,steps:1}),metal,rotor);blade.rotation.x=-Math.PI/2;blade.rotation.z=sign===1?0:Math.PI;
  }
  k.suit([
    ["Torso",[293,469],[[230,412],[268,421],[316,422],[353,411],[365,448],[362,485],[345,516],[313,531],[270,526],[239,506]], [294,468],.24,-.035],
    ["LeftArm",[216,427],[[204,412],[225,416],[229,442],[220,472],[210,490],[198,494],[189,484],[193,458]], [211,452],.115,-.02],
    ["RightArm",[369,428],[[356,413],[377,414],[388,437],[401,472],[398,487],[383,496],[372,485],[368,461]], [380,452],.115,-.02],
    ["LeftLeg",[259,520],[[235,500],[278,518],[278,542],[269,563],[249,569],[236,563]], [258,541],.15,-.035],
    ["RightLeg",[327,521],[[307,518],[348,500],[348,540],[354,558],[343,567],[322,564],[311,548]], [329,540],.15,-.035]
  ],"#c62b3a");
  return k.finish({rotor:true,authoring:"Rounded helicopter helmet, inset original face, wrapped blue cockpit, attached rear boom/fin/tail rotor, horizontal main rotor"});
};
