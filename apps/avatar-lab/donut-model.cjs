"use strict";
module.exports=function(THREE){
  const k=require("./model-kit.cjs")(THREE,"food-donut"),{solid,mesh,group,volume,ellipse,ellipsoid}=k;
  const dough=solid("BakedDough","#e4a653"),chocolate=solid("MilkChocolate","#905735"),skin=solid("FaceBase","#ffd7a0");
  const head=group("Head",[320,255]);
  ellipsoid("FaceOpeningBacking",[.55,.56,.32],solid("HairBacking","#835a43"),head,[0,-.015,-.045]);
  const doughGeometry=new THREE.TorusGeometry(.760,.245,28,96),dp=doughGeometry.attributes.position,du=doughGeometry.attributes.uv;
  for(let i=0;i<dp.count;i++){const a=du.getX(i)*Math.PI*2,b=du.getY(i)*Math.PI*2,w=(1-Math.cos(b))/2;dp.setY(i,dp.getY(i)-w*(.08+.045*Math.sin(a))/.96);}dp.needsUpdate=true;doughGeometry.computeVertexNormals();
  const ring=mesh("DoughRing",doughGeometry,dough,head);ring.scale.set(1,.96,1.55);
  // A continuous chocolate shell wraps the front and upper back of the dough.
  // Its edge follows a dripped contour, not a rectangular projected image.
  const p=[],ix=[],N=96,M=28;
  for(let j=0;j<=N;j++){
    const t=j/N*Math.PI*2,lower=-.30+.14*Math.cos(5*t)+.06*Math.sin(9*t);
    for(let i=0;i<=M;i++){
      const q=i/M,theta=lower+(Math.PI-2*lower)*q;
      const rr=.760+.251*Math.cos(t),zz=.251*Math.sin(t);
      p.push(Math.cos(theta)*rr,Math.sin(theta)*rr*.96-(1-Math.cos(t))*.5*(.08+.045*Math.sin(theta)),zz);
      if(j<N&&i<M){const a=j*(M+1)+i,b=a+M+1;ix.push(a,b,a+1,b,b+1,a+1);}
    }
  }
  for(let i=0;i<ix.length;i+=3)[ix[i+1],ix[i+2]]=[ix[i+2],ix[i+1]];
  const glaze=k.geometry(p,ix);glaze.scale(1,1,1.55);mesh("ChocolateGlaze",glaze,chocolate,head);
  const sprinkles=["#f3c5a1","#e5a2a7","#c0d5d4","#f4d4a5","#eac5b4"].map((c,i)=>solid("SprinkleColor"+i,c));
  for(let i=0;i<23;i++){
    const theta=.08+(i*.83%(Math.PI-.16)),cross=.40+(i*.71%2.25),r=.760+.260*Math.cos(cross);
    const v=new THREE.Vector3(Math.cos(theta)*Math.cos(cross),Math.sin(theta)*Math.cos(cross),Math.sin(cross)).normalize();
    const center=new THREE.Vector3(Math.cos(theta)*r,Math.sin(theta)*r*.96-(1-Math.cos(cross))*.5*(.08+.045*Math.sin(theta)),.260*1.55*Math.sin(cross));
    const tangent=new THREE.Vector3(-Math.sin(theta),Math.cos(theta),0).applyAxisAngle(v,(i%5)*.57).multiplyScalar(.031);
    k.tube("Sprinkle"+i,[center.clone().sub(tangent).toArray(),center.clone().add(tangent).toArray()],.012,sprinkles[i%5],head);
    for(const sign of [-1,1])mesh("SprinkleCap"+i+"_"+sign,new THREE.SphereGeometry(.012,8,6),sprinkles[i%5],head,center.clone().addScaledVector(tangent,sign).toArray());
  }
  volume("OriginalFace",[[216,264],[226,224],[253,198],[288,183],[325,182],[364,195],[398,220],[416,257],[419,293],[402,325],[369,348],[329,359],[284,353],[246,332],[222,301]],[319,271],[320,255],.215,.23,head,skin,{z:.10,samples:96});
  k.suit([
    ["Torso",[320,485],[[254,430],[286,440],[351,440],[381,430],[386,477],[378,514],[353,540],[282,539],[259,514]], [320,486],.24,-.035],
    ["LeftArm",[245,447],[[235,429],[256,437],[254,462],[247,485],[247,500],[239,508],[227,506],[218,496],[220,472]], [237,472],.10,-.02],
    ["RightArm",[393,447],[[382,437],[400,429],[410,457],[419,488],[416,501],[405,508],[396,501],[393,481]], [402,473],.10,-.02],
    ["LeftLeg",[284,526],[[263,515],[304,528],[304,548],[299,568],[283,578],[265,575],[258,563]], [280,550],.15,-.03],
    ["RightLeg",[351,526],[[330,529],[372,514],[374,544],[379,563],[369,576],[348,575],[333,565]], [353,549],.15,-.03]
  ],"#db9b50");
  require('./project-model-artwork.cjs')(THREE,k,head,[320,255]);
  return k.finish({authoring:"Solid toroidal dough, dripped chocolate shell and original painted front preserved over the actual geometry"});
};
