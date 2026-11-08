"use strict";
module.exports=function(THREE){
  const k=require("./model-kit.cjs")(THREE,"fruit-banana"),{solid,mesh,group,volume}=k;
  const yellow=solid("BananaSkin","#ffd044"),cream=solid("BananaFlesh","#ffecb1"),inner=solid("PeelInnerIvory","#fff1cb"),edge=solid("PeelEdge","#b88a35");
  const head=group("Head",[319,303]);
  volume("FruitCrown",[[214,303],[219,224],[229,143],[252,89],[286,65],[320,66],[360,92],[399,144],[425,210],[440,284],[434,351],[395,381],[322,402],[253,372]], [321,231],[319,303],.43,.43,head,cream,{art:false,samples:96});
  for(const name of ["FruitCrownSurface","FruitCrownBack"]){const g=head.getObjectByName(name).geometry,p=g.attributes.position;for(let i=0;i<p.count;i++){const t=Math.max(0,(p.getY(i)-.30)/.89);p.setX(i,p.getX(i)-.08*t*t);p.setZ(i,p.getZ(i)-.24*t*t);}p.needsUpdate=true;g.computeVertexNormals();}
  k.projectArtwork("OriginalFace",[[223,275],[240,239],[269,216],[302,204],[337,207],[374,223],[400,251],[413,285],[408,318],[389,343],[351,361],[308,365],[267,353],[238,331],[224,304]], [319,286],[319,303],head,head.getObjectByName("FruitCrownSurface"));
  k.ellipsoid("FruitNeck",[.18,.16,.21],cream,head,[0,-.48,0]);
  // Four closed, curved peel leaves. Outer yellow and inner pale surfaces
  // share their edge; width tapers to a rounded tip, with actual side depth.
  function peel(name,points,widths){
    const curve=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p))),P=[],I=[],U=28,V=20;
    for(let u=0;u<=U;u++){
      const t=u/U,c=curve.getPoint(t),tan=curve.getTangent(t),w=widths[0]*(1-t)+widths[1]*Math.sin(t*Math.PI)+widths[2]*t;
      const side=new THREE.Vector3(-tan.y,tan.x,0).normalize();
      for(let v=0;v<=V;v++){const a=v/V*Math.PI*2;P.push(c.x+side.x*Math.cos(a)*w,c.y+side.y*Math.cos(a)*w,c.z+Math.sin(a)*(.010+.006*Math.sin(t*Math.PI)));if(u<U&&v<V){const n=u*(V+1)+v;I.push(n,n+1,n+V+1,n+1,n+V+2,n+V+1);}}
    }
    // End disks close the cross-sections.
    for(const u of [0,U]){const c=curve.getPoint(u/U),ci=P.length/3;P.push(...c.toArray());for(let v=0;v<V;v++){const a=u*(V+1)+v;if(u===0)I.push(ci,a+1,a);else I.push(ci,a,a+1);}}
    const outer=mesh(name+"Shell",k.geometry(P,I),yellow,head);
    // Pale face on the inner side uses the same curved cross-section, with
    // opaque yellow shell underneath so alpha can never open a hole.
    const fp=[],fi=[];for(let u=0;u<=U;u++){const t=u/U,c=curve.getPoint(t),tan=curve.getTangent(t),w=(widths[0]*(1-t)+widths[1]*Math.sin(t*Math.PI)+widths[2]*t),side=new THREE.Vector3(-tan.y,tan.x,0).normalize();for(let v=0;v<=12;v++){const a=.09+(Math.PI-.18)*v/12;fp.push(c.x+side.x*Math.cos(a)*w,c.y+side.y*Math.cos(a)*w,c.z+Math.sin(a)*(.010+.006*Math.sin(t*Math.PI))+.002);if(u<U&&v<12){const n=u*13+v;fi.push(n,n+1,n+13,n+1,n+14,n+13);}}}
    mesh(name+"Inner",k.geometry(fp,fi),inner,head);
    return outer;
  }
  peel("LeftPeel",[[-.04,-.42,.12],[-.43,-.36,.28],[-.75,-.51,.44],[-.91,-.85,.28]],[.08,.16,.003]);
  peel("RightPeel",[[.03,-.42,.08],[.47,-.35,.18],[.77,-.55,.30],[.85,-.94,.05]],[.08,.19,.003]);
  peel("RearLeftPeel",[[-.40,.02,.02],[-.64,-.02,-.08],[-.80,-.14,-.12],[-.90,-.17,-.05]],[.06,.085,.003]);
  peel("RearRightPeel",[[.40,.02,.01],[.64,-.03,-.09],[.82,-.15,-.12],[.92,-.17,-.05]],[.06,.085,.003]);
  // One deep, curved lower body, joined to the fruit rather than an apron.
  const lower=group("Torso",[319,303]);lower.userData.part="BananaLowerPeel";
  volume("CurvedLowerPeel",[[239,384],[281,393],[311,411],[344,393],[382,396],[393,431],[383,470],[348,511],[301,543],[245,563],[199,565],[178,550],[191,518],[219,466]],[286,467],[319,303],.37,.36,lower,yellow,{art:true,samples:88});
  volume("BananaTip",[[178,533],[194,535],[211,546],[220,562],[197,567],[178,559],[171,550]],[194,551],[319,303],.16,.16,lower,solid("BananaTipBrown","#78542e"),{art:false,samples:32});
  k.tube("RearPeelSeam",[[.13,-.66,-.30],[.02,-.83,-.36],[-.16,-1.03,-.29],[-.43,-1.23,-.11]],.009,edge,lower);
  k.suit([
    ["LeftArm",[223,425],[[217,409],[235,414],[237,438],[224,459],[207,474],[188,472],[178,460],[186,446]],[212,442],.10,-.02],
    ["RightArm",[396,423],[[383,407],[401,412],[414,440],[424,477],[419,489],[402,489],[392,480],[390,453]],[402,450],.11,-.02],
    ["LeftLeg",[289,536],[[271,516],[307,529],[310,554],[305,573],[286,580],[267,573],[263,559]],[286,553],.13,-.10],
    ["RightLeg",[350,533],[[330,513],[364,518],[369,548],[378,563],[374,575],[354,579],[333,571]],[351,549],.13,-.10]
  ],"#e6c57e");
  const result=k.finish({authoring:"Curved peeled fruit with thin tapered peel ribbons, deep connected yellow lower body and wrapped brown tip; original face follows the fruit surface"});
  result.root.userData.revision=3;return result;
};
