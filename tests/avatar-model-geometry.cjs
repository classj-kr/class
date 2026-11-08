"use strict";
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const THREE=require("../learning/arts/art-appreciation/museum/vendor/three.min.js");
const keys={cat:"animal-cat",ramen:"food-ramen",donut:"food-donut",banana:"fruit-banana",helicopter:"vehicle-helicopter",umbrella:"object-umbrella"};
for(const key of Object.keys(keys)){
  const {root,clips}=require(`../apps/avatar-lab/${key}-model.cjs`)(THREE);
  root.traverse(n=>{if(n.isMesh){assert.ok(n.material.isMeshBasicMaterial,"artwork and sides must share the same neutral painted rendering");assert.equal(n.material.toneMapped,false);if(!n.material.userData.originalTexture)assert.ok(n.geometry.attributes.color,"solid volume shading is baked into the export");}});
  for(const name of ["LeftArm","RightArm","LeftLeg","RightLeg"]){
    let count=0;root.traverse(n=>{if(n.name===name)count++;});assert.equal(count,1,name);
  }
  const surfaces=[];root.traverse(n=>{if(n.isMesh&&n.name.endsWith("Surface"))surfaces.push(n);});
  assert.ok(surfaces.length>=5,"opaque closed body parts");
  const closedParts=[];
  for(const surface of surfaces){
    assert.equal(surface.material.transparent,false);assert.equal(surface.material.alphaTest,0);
    if(surface.name==="TailSurface")continue;
    const back=root.getObjectByName(surface.name.replace(/Surface$/,"Back"));assert.ok(back);
    closedParts.push([surface,back]);
  }
  if(key==="ramen"){
    const bowl=root.getObjectByName("BowlShell");assert.ok(bowl);
    assert.equal(bowl.material.alphaTest,0);closedParts.push([bowl]);
    const size=new THREE.Box3().setFromObject(bowl).getSize(new THREE.Vector3());
    assert.ok(Math.abs(size.x-size.z)<.001,"bowl must have circular depth, not a flattened image volume");
    const broth=new THREE.Box3().setFromObject(root.getObjectByName("Broth")),nori=new THREE.Box3().setFromObject(root.getObjectByName("Nori"));
    assert.ok(nori.min.y<broth.max.y&&nori.max.y>broth.max.y,"nori must enter the broth instead of floating");
    for(const name of ["Egg0","Egg1","PorkSlice0","PorkSlice1","PorkSlice2","OriginalFace"])assert.ok(root.getObjectByName(name),name);
  }
  if(key==="donut"){
    closedParts.push([root.getObjectByName("DoughRing")]);
    assert.ok(root.getObjectByName("FaceOpeningBacking"),"face opening is filled, not an accidental hole");
  }
  if(key==="banana")for(const name of ["LeftPeelShell","RightPeelShell","RearLeftPeelShell","RearRightPeelShell"]){const part=root.getObjectByName(name);assert.ok(part);closedParts.push([part]);}
  if(key==="banana"){
    const flesh=root.getObjectByName("FruitCrownSurface").material.color.clone().convertLinearToSRGB(),inner=root.getObjectByName("LeftPeelInner").material.color.clone().convertLinearToSRGB();
    assert.ok(flesh.r>.98&&flesh.g>.90&&flesh.b>.65,"pale warm banana flesh, no grey/khaki cast");
    assert.ok(inner.b>flesh.b&&inner.g>flesh.g,"peel lining is a distinct lighter ivory");
  }
  if(key==="umbrella")for(let i=0;i<8;i++)closedParts.push([root.getObjectByName("CanopyPanel"+i)]);
  if(key==="helicopter"){
    const blade=root.getObjectByName("MainRotorBlade1");root.updateMatrixWorld(true);const size=new THREE.Box3().setFromObject(blade).getSize(new THREE.Vector3());
    assert.ok(size.x>size.y*10,"main rotor must lie horizontally");
    assert.equal(root.getObjectByName("TailBoom").parent,root.getObjectByName("Head"));
  }
  // Facial decals are supported by an opaque curved head, rather than a
  // separate flat disk. A ray back from each decal point must reach its hood.
  const carriers={banana:"FruitCrownSurface",helicopter:"HelmetHull",umbrella:"RainHood"};
  if(carriers[key]){
    const face=root.getObjectByName("OriginalFace"),carrier=root.getObjectByName(carriers[key]);root.updateMatrixWorld(true);
    const ray=new THREE.Raycaster(),p=face.geometry.attributes.position;
    for(let i=0;i<p.count;i+=17){const v=new THREE.Vector3().fromBufferAttribute(p,i);face.localToWorld(v);ray.set(v,new THREE.Vector3(0,0,-1));const hit=ray.intersectObject(carrier)[0];assert.ok(hit&&hit.distance<.015,"facial decal must follow the opaque hood");}
  }
  for(const parts of closedParts){
    const edges=new Map();
    for(const mesh of parts){
      const p=mesh.geometry.attributes.position,a=mesh.geometry.index;
      const coord=i=>[p.getX(i),p.getY(i),p.getZ(i)].map(v=>Math.round(v*1e5)).join(",");
      for(let i=0;i<a.count;i+=3){
        const v=[0,1,2].map(j=>coord(a.getX(i+j)));if(new Set(v).size!==3)continue;
        for(let j=0;j<3;j++){const edge=[v[j],v[(j+1)%3]].sort().join("|");edges.set(edge,(edges.get(edge)||0)+1);}
      }
    }
    assert.equal([...edges.values()].filter(n=>n!==2).length,0,parts[0].name+" must have a closed opaque surface");
  }
  const armOrigins=["LeftArm","RightArm"].map(name=>root.getObjectByName(name).position.clone());
  for(const clip of clips){
    const mixer=new THREE.AnimationMixer(root);mixer.clipAction(clip).play();
    for(let i=0;i<=48;i++){
      mixer.setTime(clip.duration*i/48);root.updateMatrixWorld(true);
      const bounds=new THREE.Box3().setFromObject(root);assert.ok([...bounds.min.toArray(),...bounds.max.toArray()].every(Number.isFinite));
      for(const [i,name] of ["LeftArm","RightArm"].entries())assert.ok(root.getObjectByName(name).position.distanceTo(armOrigins[i])<.15,"arm must stay attached to its shoulder in "+clip.name);
      const footFloor=Math.min(...["LeftLeg","RightLeg"].map(name=>new THREE.Box3().setFromObject(root.getObjectByName(name)).min.y));
      assert.ok(footFloor>-.004&&footFloor<.006,"at least one boot must remain on the floor in "+key+" "+clip.name+": "+footFloor);
      if(key==="cat"){
        const tail=root.getObjectByName("Tail"),torso=root.getObjectByName("Torso");
        assert.ok(new THREE.Box3().setFromObject(torso).containsPoint(tail.getWorldPosition(new THREE.Vector3())),"tail root must stay within torso bounds in "+clip.name);
      }
    }
    mixer.stopAllAction();
  }
  // A stance foot cancels forward travel over its planted half-cycle. This
  // catches the old running-in-place rotation with no corresponding stride.
  const walk=clips.find(c=>c.name==="Walk"),gait=new THREE.AnimationMixer(root);gait.clipAction(walk).play();
  assert.ok(root.userData.walkStride>0);
  for(const [name,start] of [["LeftLeg",0],["RightLeg",.5]]){
    const planted=[];for(let i=1;i<12;i++){const phase=start+i/24;gait.setTime(walk.duration*phase);root.updateMatrixWorld(true);planted.push(root.getObjectByName(name).getWorldPosition(new THREE.Vector3()).z+root.userData.walkStride*phase);}
    assert.ok(Math.max(...planted)-Math.min(...planted)<.00001,"stance foot must not skate forward in "+key);
  }
  gait.stopAllAction();
  const asset=keys[key];
  const glb=fs.readFileSync(path.join(__dirname,`../apps/avatar-lab/models/${asset}.glb`));
  assert.equal(glb.readUInt32LE(0),0x46546c67);assert.equal(glb.readUInt32LE(8),glb.length);
  const jsonLength=glb.readUInt32LE(12),gltf=JSON.parse(glb.subarray(20,20+jsonLength));
  assert.deepEqual(gltf.nodes[0].translation,root.position.toArray(),"export must include current floor alignment");
  assert.deepEqual(gltf.animations.map(a=>a.name),["Idle","Walk","Wave"]);
  for(const m of gltf.materials)assert.ok(m.extensions?.KHR_materials_unlit,"GLB must preserve painted colors outside the lab");
  for(const animation of gltf.animations)for(const channel of animation.channels)assert.ok(gltf.nodes[channel.target.node],"all animation targets resolve");
  for(const animation of gltf.animations){
    const clip=clips.find(c=>c.name===animation.name);
    for(const channel of animation.channels){const nodeName=gltf.nodes[channel.target.node].name,property=channel.target.path==="rotation"?"quaternion":"position",track=clip.tracks.find(t=>t.name===nodeName+"."+property),accessor=gltf.accessors[animation.samplers[channel.sampler].output],view=gltf.bufferViews[accessor.bufferView],offset=28+jsonLength+view.byteOffset+(accessor.byteOffset||0);assert.deepEqual(glb.subarray(offset,offset+track.values.byteLength),Buffer.from(track.values.buffer,track.values.byteOffset,track.values.byteLength),"GLB animation must match the current source");}
  }
  const imageView=gltf.bufferViews[gltf.images[0].bufferView],start=28+jsonLength+imageView.byteOffset;
  assert.deepEqual(glb.subarray(start,start+imageView.byteLength),fs.readFileSync(path.join(__dirname,`../apps/classtools/assets/avatars/${asset}.webp`)),"the embedded original artwork must remain unchanged");
  console.log(`PASS ${key}: closed opaque surfaces, one pair of limbs, finite animations, original artwork embedded in GLB${key==="cat"?", attached tail root":""}.`);
}
