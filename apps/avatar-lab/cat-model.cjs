"use strict";

// Original unmodified artwork is projected onto rounded closed volumes.
// Facial lines stay in the texture; hood, ears and limbs are closed volumes.
module.exports = function createCat(THREE) {
  const root = new THREE.Group(); root.name = "AnimalCat";
  const scale = .005;
  const artwork = new THREE.MeshBasicMaterial({ color: 0xffffff, alphaTest: .4 });
  artwork.name = "OriginalArtwork"; artwork.userData.originalTexture = true; artwork.toneMapped = false;
  function solid(name, color) {
    const m = new THREE.MeshStandardMaterial({ color, roughness: 1, metalness: 0 });
    m.color.convertSRGBToLinear(); m.name = name; return m;
  }
  const fur = solid("WarmGraySuit", "#aaa5a3"), stripe = solid("SoftCharcoalStripe", "#77736e");
  // Keep the opaque surface beneath the artwork: the source image's alpha
  // only cuts out the decal, never the character's actual outer surface.
  function artworkSurface(name, geometry, parent) {
    const surface = new THREE.Mesh(geometry, fur); surface.name = name + "Surface"; parent.add(surface);
    const decalGeometry = geometry.clone(); decalGeometry.translate(0, 0, .0015);
    let decalMaterial=artwork;
    if(!name.endsWith("Ear")){
      const colors=[],samples=decalGeometry.attributes.position.count/15;
      for(let i=0;i<decalGeometry.attributes.position.count;i++){const ring=Math.floor(i/samples);colors.push(1,1,1,ring===14?0:ring===13?.10:ring===12?.65:1);}
      decalGeometry.setAttribute("color",new THREE.Float32BufferAttribute(colors,4));
      decalMaterial=artwork.clone();decalMaterial.name="OriginalHoodSoftEdge";decalMaterial.vertexColors=true;decalMaterial.transparent=true;decalMaterial.alphaTest=0;decalMaterial.depthWrite=false;
    }
    const decal = new THREE.Mesh(decalGeometry, decalMaterial); decal.name = name + "Artwork"; parent.add(decal);
  }
  function world([x, y], z = 0) { return new THREE.Vector3((x - 320) * scale, (580 - y) * scale, z); }
  function group(name, pixel, z = 0, parent = root) {
    const g = new THREE.Group(); g.name = name; g.position.copy(world(pixel, z)); parent.add(g); return g;
  }
  const body = new THREE.Group(); body.name = "Body"; root.add(body);
  // Both halves share a traced silhouette and meet at the outer ring.
  function volume(name, contour, center, pivot, frontDepth, backDepth, z, parent, samples = 96) {
    const outline = new THREE.CatmullRomCurve3(contour.map(([x,y]) => new THREE.Vector3(x,y,0)), true, "centripetal");
    const boundary = outline.getSpacedPoints(samples).slice(0, samples), rings = 14;
    for (const back of [false, true]) {
      const positions = [], uvs = [], indices = [];
      for (let ring=0; ring<=rings; ring++) {
        const angle=ring/rings*Math.PI/2, r=Math.sin(angle), depth=Math.cos(angle)*(back?-backDepth:frontDepth);
        for (let i=0;i<samples;i++) {
          const p=boundary[i], x=center[0]+(p.x-center[0])*r, y=center[1]+(p.y-center[1])*r;
          positions.push((x-pivot[0])*scale,(pivot[1]-y)*scale,z+depth); uvs.push(x/640,y/640);
        }
      }
      for(let ring=0;ring<rings;ring++) for(let i=0;i<samples;i++) {
        const a=ring*samples+i,b=ring*samples+(i+1)%samples,c=a+samples,d=b+samples;
        if(back){if(ring)indices.push(a,d,b);indices.push(a,c,d);}
        else{if(ring)indices.push(a,b,d);indices.push(a,d,c);}
      }
      const geometry=new THREE.BufferGeometry();
      geometry.setAttribute("position",new THREE.Float32BufferAttribute(positions,3));
      if(!back)geometry.setAttribute("uv",new THREE.Float32BufferAttribute(uvs,2));
      geometry.setIndex(indices);geometry.computeVertexNormals();
      const normal=geometry.attributes.normal;
      if((!back&&normal.getZ(samples*3)<0)||(back&&normal.getZ(samples*3)>0)){
        const index=geometry.index.array;
        for(let i=0;i<index.length;i+=3)[index[i+1],index[i+2]]=[index[i+2],index[i+1]];
        geometry.computeVertexNormals();
      }
      if (back) {
        const mesh=new THREE.Mesh(geometry,fur);mesh.name=name+"Back";parent.add(mesh);
      } else artworkSurface(name, geometry, parent);
    }
  }
  const headPivot=[320,255],head=group("Head",headPivot,0,body);
  volume("Hood",[
    [173,150],[210,119],[248,102],[270,95],[302,92],[335,91],[364,94],[390,101],
    [430,119],[469,155],[488,185],[492,204],[498,231],
    [500,270],[498,308],[488,341],[470,369],[444,393],[412,414],[374,430],[335,437],[299,437],
    [264,429],[231,416],[200,396],[174,370],[153,340],[139,305],[134,269],[134,235],[140,202],
    [145,181]
  ],headPivot,headPivot,.72,.70,0,head,128);
  // Ears have their own padded, tapered depth; they no longer inherit the
  // entire head's inflation and read as the corners of a thick flat mask.
  volume("LeftEar",[[130,70],[145,63],[178,68],[214,83],[248,106],[216,142],[170,206],[143,213],[132,170],[127,104]],[173,127],headPivot,.24,.20,.09,head,64);
  volume("RightEar",[[390,106],[425,81],[466,66],[493,64],[503,77],[507,111],[504,153],[498,181],[485,211],[466,198],[427,143]],[460,127],headPivot,.24,.20,.09,head,64);
  // Expand the hidden ear bases into the hood. Keeping every ear section at
  // the same shallow depth left a visible trench beside the deeper forehead.
  const hoodCarriers=['HoodSurface','HoodBack'].map(name=>{const m=new THREE.Mesh(head.getObjectByName(name).geometry,new THREE.MeshBasicMaterial({side:THREE.DoubleSide}));m.updateMatrixWorld(true);return m;});
  const earRay=new THREE.Raycaster();
  for(const ear of ['LeftEar','RightEar'])for(const back of [false,true]){
    const object=head.getObjectByName(ear+(back?'Back':'Surface')),p=object.geometry.attributes.position;
    for(let i=0;i<14*64;i++){const x=p.getX(i),y=p.getY(i);earRay.set(new THREE.Vector3(x,y,back?-3:3),new THREE.Vector3(0,0,back?1:-1));const hit=earRay.intersectObjects(hoodCarriers,false)[0];if(hit)p.setZ(i,back?Math.min(p.getZ(i),hit.point.z-.004):Math.max(p.getZ(i),hit.point.z+.004));}
    object.geometry.computeVertexNormals();
    if(!back){const decal=head.getObjectByName(ear+'Artwork').geometry;decal.setAttribute('position',p.clone());decal.translate(0,0,.0015);decal.computeVertexNormals();}
  }
  hoodCarriers.forEach(m=>m.material.dispose());
  const torsoPivot=[320,480],torso=group("Torso",torsoPivot,-.06,body);
  volume("Suit",[[264,427],[295,433],[338,433],[365,427],[375,452],[379,479],[373,503],[359,522],[335,533],[294,534],[271,524],[259,505],[254,477],[256,451]],[317,480],torsoPivot,.31,.30,0,torso);
  const leftPivot=[258,449],leftArm=group("LeftArm",leftPivot,-.045,body);
  volume("LeftSleeve",[[251,434],[262,438],[269,449],[265,471],[260,493],[262,504],[255,512],[245,514],[236,508],[234,498],[238,478],[243,456]],[251,475],leftPivot,.12,.105,0,leftArm,48);
  const rightPivot=[376,449],rightArm=group("RightArm",rightPivot,-.04,body);
  volume("RightSleeve",[[366,435],[379,438],[386,453],[393,478],[402,497],[401,507],[391,513],[381,508],[375,491],[371,470]],[384,476],rightPivot,.12,.105,0,rightArm,48);
  const leftLegPivot=[282,531],leftLeg=group("LeftLeg",leftLegPivot,-.045,body);
  volume("LeftBoot",[[267,522],[282,525],[299,528],[305,542],[301,555],[290,569],[276,577],[262,577],[251,570],[248,557],[254,545],[263,537]],[278,551],leftLegPivot,.145,.13,0,leftLeg,56);
  const rightLegPivot=[344,531],rightLeg=group("RightLeg",rightLegPivot,-.045,body);
  volume("RightBoot",[[329,528],[348,525],[361,521],[367,533],[376,542],[386,552],[391,562],[384,572],[373,577],[359,577],[347,570],[336,560],[329,546]],[359,551],rightLegPivot,.145,.13,0,rightLeg,56);
  // A true curved tail with front projection, rather than a flat cutout.
  // Root the tail inside the torso so rotation keeps it attached at the hip.
  const tailPivot=[345,508],tail=group("Tail",tailPivot,-.14,body);
  const tailPixels=[[345,508],[378,521],[401,526],[424,514],[442,493],[450,464],[457,439],[475,422],[493,420]];
  const tailCurve=new THREE.CatmullRomCurve3(tailPixels.map(([x,y])=>new THREE.Vector3((x-tailPivot[0])*scale,(tailPivot[1]-y)*scale,0)),false,"centripetal");
  const tubeGeometry=new THREE.TubeGeometry(tailCurve,80,.073,16,false);
  const pos=tubeGeometry.attributes.position,tex=[],materialGroups=[[],[]];
  for(let i=0;i<pos.count;i++)tex.push((pos.getX(i)/scale+tailPivot[0])/640,(tailPivot[1]-pos.getY(i)/scale)/640);
  tubeGeometry.setAttribute("uv",new THREE.Float32BufferAttribute(tex,2));
  for(let i=0;i<tubeGeometry.index.count;i+=3){
    const vertices=[tubeGeometry.index.getX(i),tubeGeometry.index.getX(i+1),tubeGeometry.index.getX(i+2)];
    materialGroups[vertices.reduce((sum,j)=>sum+pos.getZ(j),0)>=0?0:1].push(...vertices);
  }
  const tailSurface=new THREE.Mesh(tubeGeometry,fur);tailSurface.name="TailSurface";tail.add(tailSurface);
  const tailDecalGeometry=tubeGeometry.clone();tailDecalGeometry.setIndex(materialGroups[0]);tailDecalGeometry.translate(0,0,.0015);
  const tailDecal=new THREE.Mesh(tailDecalGeometry,artwork);tailDecal.name="TailArtwork";tail.add(tailDecal);
  const tip=new THREE.Mesh(new THREE.SphereGeometry(.073,20,12),fur);tip.position.copy(tailCurve.getPoint(1));tip.name="TailTip";tail.add(tip);
  // Cheek stripes continue around the actual closed side surface.
  const carriers=["HoodSurface","HoodBack"].map(name=>{const m=new THREE.Mesh(head.getObjectByName(name).geometry,new THREE.MeshBasicMaterial({side:THREE.DoubleSide}));m.updateMatrixWorld(true);return m;});
  const ray=new THREE.Raycaster();
  for(const side of [-1,1])for(let j=0;j<3;j++){
    const vertices=[],indices=[];
    for(let i=0;i<=24;i++)for(const sign of [-1,1]){
      const t=i/24,a=-.20+t*1.34,direction=new THREE.Vector3(side*Math.cos(a),0,-Math.sin(a)),y=-.095-j*.19+sign*(.065*(1-t)+.001);
      ray.set(direction.clone().multiplyScalar(3).setY(y),direction.clone().negate());
      const hit=ray.intersectObjects(carriers,false)[0];if(!hit)throw new Error("Cat stripe left the hood");vertices.push(...hit.point.addScaledVector(direction,.014).toArray());
      if(sign===1&&i<24){const n=i*2;indices.push(n,n+1,n+3,n,n+3,n+2);}
    }
    const g=new THREE.BufferGeometry();g.setAttribute("position",new THREE.Float32BufferAttribute(vertices,3));g.setIndex(indices);g.computeVertexNormals();
    if(g.attributes.normal.getX(2)*side<0){for(let i=0;i<indices.length;i+=3)[indices[i+1],indices[i+2]]=[indices[i+2],indices[i+1]];g.setIndex(indices);g.computeVertexNormals();}
    const m=new THREE.Mesh(g,stripe);m.name="SideStripe"+side+"_"+j;head.add(m);
  }
  for(let j=0;j<3;j++){
    const y=.43-j*.21,width=.26-j*.025,vertices=[],indices=[];
    for(let i=0;i<=24;i++){
      const t=i/24,x=(t-.5)*width*2,thickness=.022*Math.sin(Math.PI*t);
      for(const d of [-1,1]){ray.set(new THREE.Vector3(x,y+d*thickness,-3),new THREE.Vector3(0,0,1));const hit=ray.intersectObjects(carriers,false)[0];vertices.push(x,y+d*thickness,hit.point.z-.005);}
      if(i<24){const n=i*2;indices.push(n,n+1,n+3,n,n+3,n+2);}
    }
    const g=new THREE.BufferGeometry();g.setAttribute("position",new THREE.Float32BufferAttribute(vertices,3));g.setIndex(indices);g.computeVertexNormals();
    const mesh=new THREE.Mesh(g,stripe);mesh.name="BackStripe"+j;head.add(mesh);
  }
  carriers.forEach(c=>c.material.dispose());
  for(const [i,t] of [.22,.43,.64,.83].entries()){
    const points=Array.from({length:7},(_,j)=>tailCurve.getPoint(t-.028+j/6*.056));
    const band=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),12,.074,16,false),stripe);band.name="TailStripe"+i;tail.add(band);
  }
  const clips=[],rightOrigin=rightArm.position.toArray();
  function animation(name,duration,sample){
    const times=Array.from({length:49},(_,i)=>i/48*duration),tracks=[];
    for(const channel of ["Body","Head","LeftArm","RightArm","LeftLeg","RightLeg","Tail"]){
      const values=[];
      for(const t of times){const e=sample(t/duration*Math.PI*2)[channel]||[0,0,0];values.push(...new THREE.Quaternion().setFromEuler(new THREE.Euler(...e)).toArray());}
      tracks.push(new THREE.QuaternionKeyframeTrack(channel+".quaternion",times,values));
    }
    const positions=[],armPositions=[];
    for(const t of times){const pose=sample(t/duration*Math.PI*2);positions.push(0,pose.bounce||0,0);armPositions.push(...(pose.rightArmPosition||rightOrigin));}
    tracks.push(new THREE.VectorKeyframeTrack("Body.position",times,positions));tracks.push(new THREE.VectorKeyframeTrack("RightArm.position",times,armPositions));
    clips.push(new THREE.AnimationClip(name,duration,tracks));
  }
  animation("Idle",3,a=>({Tail:[0,Math.sin(a)*.03,0],bounce:(1-Math.cos(a))*.003}));
  animation("Walk",1.1,a=>({LeftLeg:[Math.sin(a)*.42,0,0],RightLeg:[-Math.sin(a)*.42,0,0],LeftArm:[-Math.sin(a)*.30,0,0],RightArm:[Math.sin(a)*.30,0,0],Body:[.015,Math.sin(a)*.02,Math.sin(a)*.018],Head:[-.015,0,-Math.sin(a)*.012],Tail:[0,Math.sin(a+.5)*.09,0],bounce:.02+(1-Math.cos(a*2))*.012}));
  animation("Wave",2,a=>({RightArm:[.1,.1,1.30+Math.sin(a*2)*.15],rightArmPosition:[rightOrigin[0]+.01,rightOrigin[1]-.025,.08],Head:[0,0,.025],Tail:[0,Math.sin(a)*.06,0],bounce:(1-Math.cos(a))*.005}));
  root.userData={avatarKey:"animal-cat.webp",prototype:true,revision:5,authoring:"Original face artwork, rounded closed hood with separate padded ears, connected striped tail and rigid animated limbs"};
  return require("./ground-avatar.cjs")(THREE,{root,clips});
};
