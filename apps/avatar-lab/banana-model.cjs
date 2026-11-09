"use strict";
module.exports=function(THREE){
  const k=require("./model-kit.cjs")(THREE,"fruit-banana"),{solid,mesh,group,volume}=k;
  const yellow=solid("BananaSkin","#ffd044"),cream=solid("BananaFlesh","#ffecb1"),inner=solid("PeelInnerIvory","#fff1cb"),edge=solid("PeelEdge","#b88a35");
  const head=group("Head",[319,303]);
  volume("FruitCrown",[[214,338],[215,278],[219,213],[225,155],[239,106],[259,76],[285,64],[311,69],[343,86],[374,111],[400,144],[420,184],[432,224],[440,280],[439,342],[405,366],[361,382],[320,395],[277,373],[242,352]], [320,243],[319,303],.47,.47,head,cream,{art:false,samples:112});
  for(const name of ["FruitCrownSurface","FruitCrownBack"]){const o=head.getObjectByName(name),g=o.geometry,p=g.attributes.position;for(let i=0;i<p.count;i++){const y=303-p.getY(i)/.005,t=Math.max(0,(185-y)/121);p.setZ(i,p.getZ(i)-.18*t*t);}g.computeVertexNormals();o.userData.artworkFacingFade=[.18,.50];o.userData.artworkHorizontalNormal=true;}
  k.ellipsoid("FruitNeck",[.18,.16,.21],cream,head,[0,-.48,0]);
  // Source-shaped folded leaves have real thickness and distinct inner/outer
  // surfaces. A constrained contour prevents the inward fold from crossing.
  const tool=require('./sculpt-kit.cjs')(THREE,k,{group:head,part:{pivot:[319,303]}}),shells=[];
  head.userData.directSurfaceArtwork=true;head.userData.artworkOcclusion=true;head.userData.artworkOpaqueRegions=[{cx:319,cy:285,rx:105,ry:88}];
  function peel(name,ps,front){
    const shell=require('./rounded-contour-solid.cjs')(THREE,k,tool,name+'Shell',ps,{front:.055,back:.055,color:'#ffd044',rounding:15}),g=shell.geometry,p=g.attributes.position;
    for(let i=0;i<p.count;i++){const x=319+p.getX(i)/.005,y=303-p.getY(i)/.005,d=Math.min(1,Math.abs(x-309)/200),z=front?.10+.26*Math.sin(d*Math.PI)-.12*d: -.03-.12*Math.min(1,Math.abs(x-320)/190);p.setZ(i,p.getZ(i)+z);}
    g.computeVertexNormals();shell.userData.skipOriginalPaint=true;
    const inside=g.clone();inside.setIndex(Array.from(g.index.array).slice(0,g.index.count/2));inside.translate(0,0,.003);
    const lining=mesh(name+'Inner',inside,inner,head);lining.userData.artworkFacingFade=[.15,.48];
    shells.push(shell);return shell;
  }
  peel('LeftPeel',[[309,405],[290,378],[262,359],[226,345],[191,346],[160,357],[136,377],[120,411],[115,442],[121,457],[136,461],[153,449],[177,424],[200,401],[225,389],[253,390],[279,400]],true);
  peel('RightPeel',[[309,405],[335,379],[374,353],[411,343],[445,347],[477,363],[501,388],[511,421],[509,461],[497,488],[481,498],[465,488],[455,467],[443,439],[428,417],[407,401],[382,391],[352,393],[329,400]],true);
  peel('RearLeftPeel',[[220,276],[199,281],[174,294],[153,311],[145,326],[149,333],[163,328],[184,322],[200,326],[217,337],[225,322]],false);
  peel('RearRightPeel',[[436,276],[463,283],[492,296],[514,316],[522,336],[516,344],[501,337],[483,326],[465,328],[440,343],[432,323]],false);
  require('./project-model-artwork.cjs')(THREE,k,head,[319,303]);
  head.getObjectByName('FruitCrownSurfaceOriginalPaint').name='OriginalFace';
  // Rounded outer silhouettes, with the source's warm brown edge weight.
  for(const o of [...shells,head.getObjectByName('FruitCrownSurface'),head.getObjectByName('FruitCrownBack')]){
    const g=o.geometry.clone(),p=g.attributes.position,b=new THREE.Box3().setFromBufferAttribute(p),c=b.getCenter(new THREE.Vector3()),f=1+.010/(b.getSize(new THREE.Vector3()).length()/2),ix=g.index.array;
    for(let i=0;i<p.count;i++)p.setXYZ(i,c.x+(p.getX(i)-c.x)*f,c.y+(p.getY(i)-c.y)*f,c.z+(p.getZ(i)-c.z)*f);
    for(let i=0;i<ix.length;i+=3)[ix[i+1],ix[i+2]]=[ix[i+2],ix[i+1]];g.computeVertexNormals();const line=mesh(o.name+'InkShell',g,solid(o.name+'Ink','#a8843e'),head);line.material.userData.alreadyShaded=true;
  }
  // One deep, curved lower body, joined to the fruit rather than an apron.
  const lower=group("Torso",[319,303]);lower.userData.part="BananaLowerPeel";
  volume("CurvedLowerPeel",[[235,374],[281,380],[311,393],[344,380],[382,384],[393,431],[383,470],[348,511],[301,543],[245,563],[199,565],[178,550],[191,518],[219,466]],[286,467],[319,303],.37,.36,lower,yellow,{art:true,samples:88});
  volume("BananaTip",[[178,533],[194,535],[211,546],[220,562],[197,567],[178,559],[171,550]],[194,551],[319,303],.16,.16,lower,solid("BananaTipBrown","#78542e"),{art:false,samples:32});
  k.tube("RearPeelSeam",[[.13,-.66,-.30],[.02,-.83,-.36],[-.16,-1.03,-.29],[-.43,-1.23,-.11]],.009,edge,lower);
  k.suit([
    ["LeftArm",[223,425],[[217,409],[235,414],[237,438],[224,459],[207,474],[188,472],[178,460],[186,446]],[212,442],.10,-.02],
    ["RightArm",[396,423],[[383,407],[401,412],[414,440],[424,477],[419,489],[402,489],[392,480],[390,453]],[402,450],.11,-.02],
    ["LeftLeg",[289,536],[[271,516],[307,529],[310,554],[305,573],[286,580],[267,573],[263,559]],[286,553],.13,-.10],
    ["RightLeg",[350,533],[[323,498],[355,500],[369,548],[378,563],[374,575],[354,579],[333,571]],[351,549],.13,-.10]
  ],"#e6c57e");
  const result=k.finish({authoring:"Curved peeled fruit with thin tapered peel ribbons, deep connected yellow lower body and wrapped brown tip; original face follows the fruit surface"});
  for(const clip of result.clips){const track=clip.tracks.find(t=>t.name==='Head.quaternion');if(track)for(let i=0;i<track.values.length;i+=4)track.values.set([0,0,0,1],i);}
  // Keep the small hand below the curled peel instead of raising it inside
  // the costume, where the whole gesture disappears from view.
  const wave=result.clips.find(c=>c.name==='Wave'),arm=wave.tracks.find(t=>t.name==='RightArm.quaternion');
  for(let i=0;i<arm.times.length;i++){const a=arm.times[i]/wave.duration*Math.PI*2;arm.values.set(new THREE.Quaternion().setFromEuler(new THREE.Euler(.02,0,-.15+Math.sin(a*2)*.18)).toArray(),i*4);}
  result.root.userData.revision=4;return result;
};
