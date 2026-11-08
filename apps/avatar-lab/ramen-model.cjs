"use strict";

// A real open bowl with volumetric toppings. Only the face and tiny suit use
// the original artwork. The complete bowl stays rigid during animation.
module.exports = function createRamen(THREE) {
  const root = new THREE.Group(); root.name = "FoodRamen";
  const body = new THREE.Group(); body.name = "Body"; root.add(body);
  const scale = .005;
  function solid(name, color) {
    const material = new THREE.MeshStandardMaterial({ color, roughness: 1 });
    material.color.convertSRGBToLinear(); material.name = name; return material;
  }
  const porcelain = solid("IvoryPorcelain", "#f0e3d5");
  const suit = solid("WarmNoodleSuit", "#d6a36f");
  const band = solid("BowlRedBand", "#ba5d43");
  const artwork = new THREE.MeshBasicMaterial({ color: 0xffffff, alphaTest: .4 });
  artwork.name = "OriginalArtwork"; artwork.userData.originalTexture = true; artwork.toneMapped = false;
  function group(name, pixel, z = 0) {
    const g = new THREE.Group(); g.name = name;
    g.position.set((pixel[0]-320)*scale,(580-pixel[1])*scale,z); body.add(g); return g;
  }
  function volume(name, contour, center, pivot, frontDepth, backDepth, parent, material, samples=64) {
    const curve = new THREE.CatmullRomCurve3(contour.map(([x,y])=>new THREE.Vector3(x,y,0)),true,"centripetal");
    const boundary=curve.getSpacedPoints(samples).slice(0,samples), rings=14;
    for(const back of [false,true]) {
      const positions=[],uvs=[],indices=[];
      for(let ring=0;ring<=rings;ring++) {
        const a=ring/rings*Math.PI/2,r=Math.sin(a),depth=Math.cos(a)*(back?-backDepth:frontDepth);
        for(const p of boundary) {
          const x=center[0]+(p.x-center[0])*r,y=center[1]+(p.y-center[1])*r;
          positions.push((x-pivot[0])*scale,(pivot[1]-y)*scale,depth);uvs.push(x/640,y/640);
        }
      }
      for(let ring=0;ring<rings;ring++) for(let i=0;i<samples;i++) {
        const a=ring*samples+i,b=ring*samples+(i+1)%samples,c=a+samples,d=b+samples;
        if(back){if(ring)indices.push(a,d,b);indices.push(a,c,d);}
        else{if(ring)indices.push(a,b,d);indices.push(a,d,c);}
      }
      const geometry=new THREE.BufferGeometry();geometry.setAttribute("position",new THREE.Float32BufferAttribute(positions,3));
      geometry.setIndex(indices);geometry.computeVertexNormals();
      if((!back&&geometry.attributes.normal.getZ(samples*3)<0)||(back&&geometry.attributes.normal.getZ(samples*3)>0)){
        const index=geometry.index.array;for(let i=0;i<index.length;i+=3)[index[i+1],index[i+2]]=[index[i+2],index[i+1]];
        geometry.computeVertexNormals();
      }
      const shell=new THREE.Mesh(geometry,material);shell.name=name+(back?"Back":"Surface");parent.add(shell);
      if(!back){
        const decal=geometry.clone();decal.setAttribute("uv",new THREE.Float32BufferAttribute(uvs,2));decal.translate(0,0,.0015);
        const colors=[];for(let i=0;i<decal.attributes.position.count;i++){const ring=Math.floor(i/samples);colors.push(1,1,1,ring===rings?0:ring===rings-1?.1:ring===rings-2?.65:1);}
        decal.setAttribute("color",new THREE.Float32BufferAttribute(colors,4));const painted=artwork.clone();painted.vertexColors=true;painted.transparent=true;painted.alphaTest=0;painted.depthWrite=false;
        const mesh=new THREE.Mesh(decal,painted);mesh.name=name+"Artwork";parent.add(mesh);
      }
    }
  }
  const head=group("Head",[320,464]);
  const soup=solid("AmberBroth","#b8793e"), noodle=solid("GoldenNoodle","#e6ba64");
  const eggWhite=solid("CreamEggWhite","#fff3d3"), yolk=solid("GoldenYolk","#e8b344");
  const porkEdge=solid("PorkBrownEdge","#9c5945"), pork=solid("PinkPork","#cf8f7b"), fat=solid("PorkFat","#edbc9e");
  const green=solid("FreshScallion","#709245"), noriMaterial=solid("DarkGreenNori","#35472d");
  const darkRim=solid("BowlOutline","#87543d");
  function mesh(name,geometry,material,position=[0,0,0],parent=head){
    const result=new THREE.Mesh(geometry,material);result.name=name;result.position.set(...position);parent.add(result);return result;
  }
  function tube(name,points,radius,material,parent=head){
    const curve=new THREE.CatmullRomCurve3(points,false,"centripetal");
    return mesh(name,new THREE.TubeGeometry(curve,Math.max(24,points.length*3),radius,8,false),material,[0,0,0],parent);
  }
  // Revolved around Y: the opening is horizontal and equally wide front/back.
  const outside=[[.34,0],[.43,.035],[.55,.10],[.70,.20],[.85,.33],[.98,.48],[1.10,.66],[1.20,.87],[1.27,1.10],[1.30,1.29],[1.31,1.42]];
  const profile=[[0,0],...outside,[1.30,1.45],[1.24,1.45],[1.23,1.30],[1.19,1.07],[1.10,.83],[.94,.57],[.70,.35],[.48,.22],[0,.22]];
  mesh("BowlShell",new THREE.LatheGeometry(profile.map(([r,y])=>new THREE.Vector2(r,y)),96),porcelain);
  function radiusAt(y){
    for(let i=1;i<outside.length;i++)if(y<=outside[i][1]){
      const a=outside[i-1],b=outside[i],t=(y-a[1])/(b[1]-a[1]);return a[0]+(b[0]-a[0])*t;
    }
    return outside[outside.length-1][0];
  }
  function bowlStripe(name,low,high,material){
    const points=Array.from({length:7},(_,i)=>{const y=low+(high-low)*i/6;return new THREE.Vector2(radiusAt(y)+.003,y);});
    return mesh(name,new THREE.LatheGeometry(points,96),material);
  }
  bowlStripe("UpperRedBowlStripe",1.24,1.34,band);
  bowlStripe("LowerRedBowlStripe",1.08,1.13,band);
  bowlStripe("StripeOutline",1.225,1.239,darkRim);
  const rim=mesh("RoundedBowlRim",new THREE.TorusGeometry(1.275,.035,10,96),porcelain,[0,1.445,0]);rim.rotation.x=Math.PI/2;
  const rimLine=mesh("RimOutline",new THREE.TorusGeometry(1.305,.009,6,96),darkRim,[0,1.44,0]);rimLine.rotation.x=Math.PI/2;
  mesh("BowlFoot",new THREE.CylinderGeometry(.36,.34,.07,48),porcelain,[0,.005,0]);
  mesh("Broth",new THREE.CylinderGeometry(1.205,1.205,.035,80),soup,[0,1.29,0]);
  // Preserve the face alone, conforming it to the front ceramic wall.
  const faceOutline=new THREE.CatmullRomCurve3([[319,300],[353,306],[384,324],[405,352],[413,382],[405,411],[383,433],[353,446],[320,451],[283,445],[253,429],[232,405],[224,379],[232,351],[253,327],[283,309]].map(([x,y])=>new THREE.Vector3(x,y,0)),true,"centripetal");
  const faceBoundary=faceOutline.getSpacedPoints(96).slice(0,96),facePositions=[],faceUV=[],faceIndices=[];
  for(let ring=0;ring<=12;ring++)for(const edge of faceBoundary){
    const px=319+(edge.x-319)*ring/12,py=380+(edge.y-380)*ring/12;
    const x=(px-319)*.0054,y=.55+(380-py)*.0065,r=radiusAt(y);
    facePositions.push(x,y,Math.sqrt(Math.max(0,r*r-x*x))+.006);faceUV.push(px/640,py/640);
  }
  for(let ring=0;ring<12;ring++)for(let i=0;i<96;i++){
    const a=ring*96+i,b=ring*96+(i+1)%96,c=a+96,d=b+96;
    if(ring)faceIndices.push(a,b,d);faceIndices.push(a,d,c);
  }
  const faceGeometry=new THREE.BufferGeometry();faceGeometry.setAttribute("position",new THREE.Float32BufferAttribute(facePositions,3));faceGeometry.setAttribute("uv",new THREE.Float32BufferAttribute(faceUV,2));faceGeometry.setIndex(faceIndices);faceGeometry.computeVertexNormals();
  if(faceGeometry.attributes.normal.getZ(288)<0){const a=faceGeometry.index.array;for(let i=0;i<a.length;i+=3)[a[i+1],a[i+2]]=[a[i+2],a[i+1]];faceGeometry.computeVertexNormals();}
  mesh("OriginalFace",faceGeometry,artwork);
  // Curled noodles sit on the broth, never projected over the bowl's sides.
  for(let j=0;j<8;j++){
    const points=[],radius=.22+j*.105;
    for(let i=0;i<=40;i++){const a=-.3+i/40*Math.PI*1.85;points.push(new THREE.Vector3(Math.cos(a)*radius,1.325+.008*Math.sin(a*3+j),Math.sin(a)*radius*.90+.10));}
    tube("Noodle"+j,points,.022,noodle);
  }
  for(const [i,x,z,angle] of [[0,-.63,-.28,-.45],[1,-.63,.39,.38]]){
    const egg=new THREE.Group();egg.name="Egg"+i;egg.position.set(x,1.46,z);egg.rotation.set(.30,angle,-.12);head.add(egg);
    // A boiled half egg has a flat cut face and a deep rounded underside.
    const profile=[new THREE.Vector2(0,-.19)];for(let j=1;j<=16;j++){const a=j/16*Math.PI/2;profile.push(new THREE.Vector2(.29*Math.sin(a),-.19*Math.cos(a)));}profile.push(new THREE.Vector2(0,0));
    const white=mesh("EggWhite"+i,new THREE.LatheGeometry(profile,40),eggWhite,[0,0,0],egg);white.scale.z=1.25;
    const yellow=mesh("Yolk"+i,new THREE.SphereGeometry(1,28,14),yolk,[0,.008,.018],egg);yellow.scale.set(.16,.014,.205);
    const rim=mesh("EggCutRim"+i,new THREE.TorusGeometry(.29,.008,6,40),solid("EggRim"+i,"#d7b375"),[0,.001,0],egg);rim.rotation.x=Math.PI/2;rim.scale.y=1.25;
  }
  for(let i=0;i<3;i++){
    const slice=new THREE.Group();slice.name="PorkSlice"+i;slice.position.set(.48+i*.055,1.355+i*.025,.38-i*.28);slice.rotation.set(.10,-.35,-.10);head.add(slice);
    const edge=mesh("PorkCrust"+i,new THREE.CylinderGeometry(1,1,.085,36),porkEdge,[0,0,0],slice);edge.scale.set(.43,1,.29);
    const cut=mesh("PorkCut"+i,new THREE.CylinderGeometry(1,1,.012,36),pork,[0,.048,0],slice);cut.scale.set(.385,1,.253);
    for(let j=0;j<2;j++){
      const points=[];for(let k=0;k<=28;k++){const a=.1+k/28*Math.PI*1.65;points.push(new THREE.Vector3(Math.cos(a)*(.28-j*.10),.059,Math.sin(a)*(.18-j*.055)));}
      tube("PorkMarbling"+i+"_"+j,points,.012,fat,slice);
    }
  }
  for(let i=0;i<5;i++){
    const a=i/5*Math.PI*2;const scallion=mesh("Scallion"+i,new THREE.TorusGeometry(.072,.025,8,14),green,[Math.cos(a)*.13,1.37+Math.sin(a)*.025,-.64+Math.sin(a)*.12]);scallion.rotation.set(Math.PI/2+.18*Math.sin(a),0,a);
  }
  const noriShape=new THREE.Shape();noriShape.moveTo(-.21,-.40);noriShape.lineTo(.21,-.40);noriShape.lineTo(.23,.34);noriShape.quadraticCurveTo(.22,.40,.17,.40);noriShape.lineTo(-.17,.40);noriShape.quadraticCurveTo(-.23,.38,-.22,.33);noriShape.closePath();
  const nori=mesh("Nori",new THREE.ExtrudeGeometry(noriShape,{depth:.025,bevelEnabled:true,bevelThickness:.005,bevelSize:.008,bevelSegments:1,steps:1}),noriMaterial,[.60,1.53,-.67]);nori.rotation.set(-.25,0,-.18);
  const torsoPivot=[320,505],torso=group("Torso",torsoPivot,-.06);
  volume("Suit",[[259,459],[287,468],[326,472],[367,462],[383,477],[382,505],[369,527],[348,541],[315,545],[285,539],[264,523],[255,498]],
    [319,502],torsoPivot,.235,.22,torso,suit);
  const leftPivot=[249,470],leftArm=group("LeftArm",leftPivot,-.01);
  volume("LeftSleeve",[[231,456],[245,456],[257,467],[254,486],[248,502],[239,509],[228,504],[223,491],[226,473]],
    [240,482],leftPivot,.105,.10,leftArm,suit,64);
  const rightPivot=[392,470],rightArm=group("RightArm",rightPivot,-.01);
  volume("RightSleeve",[[384,456],[400,456],[410,471],[414,489],[409,503],[400,510],[390,505],[385,489]],
    [399,482],rightPivot,.105,.10,rightArm,suit,64);
  const leftLegPivot=[285,531],leftLeg=group("LeftLeg",leftLegPivot,-.03);
  volume("LeftBoot",[[261,518],[281,524],[305,529],[307,549],[302,567],[291,577],[274,578],[261,571],[259,554]],
    [283,550],leftLegPivot,.14,.13,leftLeg,suit,64);
  const rightLegPivot=[350,531],rightLeg=group("RightLeg",rightLegPivot,-.03);
  volume("RightBoot",[[328,530],[351,524],[374,518],[379,542],[378,563],[369,575],[352,578],[337,571],[329,551]],
    [352,550],rightLegPivot,.14,.13,rightLeg,suit,64);
  const clips=[];
  function animation(name,duration,sample){
    const times=Array.from({length:49},(_,i)=>i/48*duration),tracks=[];
    for(const channel of ["Body","Head","LeftArm","RightArm","LeftLeg","RightLeg"]){
      const values=[];
      for(const t of times)values.push(...new THREE.Quaternion().setFromEuler(new THREE.Euler(...(sample(t/duration*Math.PI*2)[channel]||[0,0,0]))).toArray());
      tracks.push(new THREE.QuaternionKeyframeTrack(channel+".quaternion",times,values));
    }
    const positions=[];for(const t of times)positions.push(0,sample(t/duration*Math.PI*2).bounce||0,0);
    tracks.push(new THREE.VectorKeyframeTrack("Body.position",times,positions));
    clips.push(new THREE.AnimationClip(name,duration,tracks));
  }
  animation("Idle",3,a=>({bounce:(1-Math.cos(a))*.003}));
  animation("Walk",1.1,a=>({LeftLeg:[Math.sin(a)*.40,0,0],RightLeg:[-Math.sin(a)*.40,0,0],
    LeftArm:[-Math.sin(a)*.30,0,0],RightArm:[Math.sin(a)*.30,0,0],Body:[.012,0,Math.sin(a)*.014],
    Head:[-.012,0,-Math.sin(a)*.014],bounce:.016+(1-Math.cos(a*2))*.01}));
  animation("Wave",2,a=>({RightArm:[.05,0,1.9+Math.sin(a*2)*.2],Head:[0,0,.025],bounce:(1-Math.cos(a))*.003}));
  root.userData={avatarKey:"food-ramen.webp",prototype:true,revision:4,authoring:"Revolved open bowl, cut half eggs, layered pork, noodles and nori, original face decal, one pair of rigid animated limbs"};
  return require("./ground-avatar.cjs")(THREE,{root,clips});
};
