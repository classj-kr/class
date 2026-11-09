"use strict";
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const crypto=require('node:crypto'),results=[];
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
    if(surface.name==="TailSurface"){closedParts.push([surface]);continue;}
    const back=root.getObjectByName(surface.name.replace(/Surface$/,"Back"));assert.ok(back);
    closedParts.push([surface,back]);
  }
  if(key==="cat"){
    const hood=['HoodSurface','HoodBack'].map(n=>root.getObjectByName(n)),suit=['SuitSurface','SuitBack'].map(n=>root.getObjectByName(n));
    assert.ok(!root.getObjectByName('LeftEarSurface')&&!root.getObjectByName('RightEarSurface'),'ears must share the continuous closed hood');
    root.updateMatrixWorld(true);
    for(const[x,y]of [[147,86],[487,86],[283,337],[355,337],[320,381]]){
      const v=root.localToWorld(new THREE.Vector3((x-320)*.005,(580-y)*.005,3)),hit=new THREE.Raycaster(v,new THREE.Vector3(0,0,-1)).intersectObject(root.getObjectByName('HoodArtwork'))[0];assert.ok(hit,'cat source ear/expression landmark missing');
    }
    const inside=(v,supports)=>{const a=new THREE.Raycaster(v.clone().add(new THREE.Vector3(0,0,3)),new THREE.Vector3(0,0,-1)).intersectObjects(supports)[0],b=new THREE.Raycaster(v.clone().add(new THREE.Vector3(0,0,-3)),new THREE.Vector3(0,0,1)).intersectObjects(supports)[0];return a&&b&&v.z<a.point.z&&v.z>b.point.z;};
    const overlap=(o,supports)=>{const p=o.geometry.attributes.position;let n=0;for(let i=0;i<p.count;i+=7)if(inside(o.localToWorld(new THREE.Vector3().fromBufferAttribute(p,i)),supports))n++;return n;};
    const saved=[];root.traverse(o=>saved.push([o,o.position.clone(),o.quaternion.clone(),o.scale.clone()]));
    for(const clip of clips){const mixer=new THREE.AnimationMixer(root);mixer.clipAction(clip).play();for(const phase of [0,.125,.25,.5,.75]){
      mixer.setTime(clip.duration*phase);root.updateMatrixWorld(true);
      assert.ok(overlap(suit[0],hood)>2,'cat suit separates from hood in '+clip.name+' '+phase);
      for(const name of ['LeftSleeveSurface','RightSleeveSurface','LeftBootSurface','RightBootSurface'])assert.ok(overlap(root.getObjectByName(name),suit)>2,'cat limb separates: '+name+' '+clip.name+' '+phase);
      assert.ok(inside(root.getObjectByName('Tail').getWorldPosition(new THREE.Vector3()),suit),'cat tail root not inside actual suit in '+clip.name+' '+phase);
    }mixer.stopAllAction();}
    for(const[o,p,q,s]of saved){o.position.copy(p);o.quaternion.copy(q);o.scale.copy(s);}root.updateMatrixWorld(true);
  }
  if(key==="ramen"){
    const bowl=root.getObjectByName("BowlShell");assert.ok(bowl);
    assert.equal(bowl.material.alphaTest,0);closedParts.push([bowl]);
    const size=new THREE.Box3().setFromObject(bowl).getSize(new THREE.Vector3());
    assert.ok(Math.abs(size.x-size.z)<.001,"bowl must have circular depth, not a flattened image volume");
    const broth=new THREE.Box3().setFromObject(root.getObjectByName("Broth")),nori=new THREE.Box3().setFromObject(root.getObjectByName("Nori"));
    assert.ok(nori.min.y<broth.max.y&&nori.max.y>broth.max.y,"nori must enter the broth instead of floating");
    for(const name of ["Egg0","Egg1","PorkSlice0","PorkSlice1","PorkSlice2","OriginalFace"])assert.ok(root.getObjectByName(name),name);
    root.traverse(o=>{if(o.isMesh&&(/^(BackNoodle|NoodleCluster|PorkMarbling|EggWhite|Yolk|PorkCrust|PorkCut)/.test(o.name)||['Broth','Nori','ScallionCore'].includes(o.name)||o.name.endsWith('Shoulder')))closedParts.push([o]);});
  }
  if(['donut','ramen'].includes(key)){
    const suit=(key==='donut'?['TorsoSuitSurface','TorsoSuitBack']:['SuitSurface','SuitBack']).map(n=>root.getObjectByName(n));
    const inside=(v,supports)=>{const mats=new Map(supports.map(o=>[o.material,o.material.side]));for(const m of mats.keys())m.side=THREE.DoubleSide;const hits=new THREE.Raycaster(v,new THREE.Vector3(.027,.019,1).normalize()).intersectObjects(supports);for(const[m,side]of mats)m.side=side;const ds=[];for(const h of hits)if(!ds.some(d=>Math.abs(d-h.distance)<1e-5))ds.push(h.distance);return ds.length%2===1;};
    const overlap=(o,supports)=>{const p=o.geometry.attributes.position;let n=0;for(let i=0;i<p.count;i+=7)if(inside(o.localToWorld(new THREE.Vector3().fromBufferAttribute(p,i)),supports))n++;return n;};
    const saved=[];root.traverse(o=>saved.push([o,o.position.clone(),o.quaternion.clone(),o.scale.clone()]));
    const headSupports=(key==='donut'?['DoughRing','FaceOpeningBacking']:['BowlShell','BowlFoot']).map(n=>root.getObjectByName(n));
    for(const clip of clips){const mixer=new THREE.AnimationMixer(root);mixer.clipAction(clip).play();for(const phase of [0,.125,.25,.5,.75]){
      mixer.setTime(clip.duration*phase);root.updateMatrixWorld(true);
      assert.ok(overlap(suit[0],headSupports)>2,key+' body detached from head in '+clip.name+' '+phase);
      for(const pair of [['LeftArm','LeftSleeve'],['RightArm','RightSleeve'],['LeftLeg','LeftBoot'],['RightLeg','RightBoot']]){
        const name=(key==='donut'?pair[0]+'Suit':pair[1])+'Surface',part=root.getObjectByName(name),bridge=root.getObjectByName(pair[0]+'Shoulder');
        if(bridge){assert.ok(overlap(bridge,suit)>2&&overlap(bridge,[part,root.getObjectByName(name.replace(/Surface$/,'Back'))])>2,key+' shoulder bridge detached: '+name+' '+clip.name+' '+phase);}else assert.ok(overlap(part,suit)>2,key+' limb detached: '+name+' '+clip.name+' '+phase);
      }
    }mixer.stopAllAction();}
    for(const[o,p,q,s]of saved){o.position.copy(p);o.quaternion.copy(q);o.scale.copy(s);}root.updateMatrixWorld(true);
    if(key==='ramen'){
      const broth=root.getObjectByName('Broth'),noodles=[];root.traverse(o=>{if(o.isMesh&&/^(BackNoodle|NoodleCluster)/.test(o.name))noodles.push(o);});
      assert.ok(overlap(broth,[root.getObjectByName('BowlShell')])>2,'ramen broth must reach the inner ceramic wall');
      for(const o of noodles)assert.ok(overlap(o,[broth])>0,'ramen noodle floats above broth: '+o.name);
      for(let i=0;i<2;i++){const white=root.getObjectByName('EggWhite'+i);assert.ok(overlap(white,[broth])>0,'ramen egg floats above broth');assert.ok(overlap(root.getObjectByName('Yolk'+i),[white])>0,'ramen yolk detaches from cut egg');}
      for(let i=0;i<3;i++){const edge=root.getObjectByName('PorkCrust'+i),cut=root.getObjectByName('PorkCut'+i),supports=[broth,...Array.from({length:i},(_,j)=>root.getObjectByName('PorkCrust'+j))];assert.ok(supports.some(s=>overlap(edge,[s])>0),'ramen pork slice floats: '+i);assert.ok(overlap(cut,[edge])>0,'ramen pork cut floats');for(let j=0;j<2;j++)assert.ok(overlap(root.getObjectByName('PorkMarbling'+i+'_'+j),[cut])>0,'ramen marbling floats');}
      const core=root.getObjectByName('ScallionCore');assert.ok(overlap(core,[broth])>0,'ramen garnish base floats above broth');
      for(let i=0;i<5;i++)assert.ok([core,broth,...noodles].some(s=>overlap(root.getObjectByName('Scallion'+i),[s])>0),'ramen scallion floats: '+i);
    }
  }
  if(key==="donut"){
    closedParts.push([root.getObjectByName("DoughRing")]);
    assert.ok(root.getObjectByName("FaceOpeningBacking"),"face opening is filled, not an accidental hole");
    closedParts.push([root.getObjectByName('FaceOpeningBacking')]);
    root.updateMatrixWorld(true);const coat=root.getObjectByName('ChocolateGlaze'),caps=[];root.traverse(o=>{if(o.userData.coatingNormal)caps.push(o);});assert.equal(caps.length,46,'all rear sprinkles need supported rounded ends');
    for(const cap of caps){const n=new THREE.Vector3(...cap.userData.coatingNormal).transformDirection(cap.parent.matrixWorld),v=cap.getWorldPosition(new THREE.Vector3()),hit=new THREE.Raycaster(v.clone().addScaledVector(n,.08),n.clone().negate()).intersectObject(coat)[0];assert.ok(hit&&hit.distance>.08&&hit.distance<.091,'donut sprinkle floats or sinks through coating: '+cap.name);}
    const opaque=['DoughRing','FaceOpeningBacking','OriginalFaceSurface','OriginalFaceBack'].map(n=>root.getObjectByName(n)),head=root.getObjectByName('Head');
    for(const r of [0,.2,.4,.55,.7])for(let i=0;i<24;i++){const a=i/24*Math.PI*2,v=head.localToWorld(new THREE.Vector3(r*Math.cos(a),r*Math.sin(a)-.04,3));assert.ok(new THREE.Raycaster(v,new THREE.Vector3(0,0,-1)).intersectObjects(opaque).length,'uncovered gap between donut face and dough');}
  }
  if(key==="banana")for(const name of ["LeftPeelShell","RightPeelShell","RearLeftPeelShell","RearRightPeelShell"]){const part=root.getObjectByName(name);assert.ok(part);closedParts.push([part]);}
  if(key==="banana"){
    const flesh=root.getObjectByName("FruitCrownSurface").material.color.clone().convertLinearToSRGB(),inner=root.getObjectByName("LeftPeelInner").material.color.clone().convertLinearToSRGB();
    assert.ok(flesh.r>.98&&flesh.g>.90&&flesh.b>.65,"pale warm banana flesh, no grey/khaki cast");
    assert.ok(inner.b>flesh.b&&inner.g>flesh.g,"peel lining is a distinct lighter ivory");
    root.updateMatrixWorld(true);
    const crown=['FruitCrownSurface','FruitCrownBack'].map(n=>root.getObjectByName(n)),body=['CurvedLowerPeelSurface','CurvedLowerPeelBack'].map(n=>root.getObjectByName(n));
    const inside=(o,supports)=>{let count=0;const p=o.geometry.attributes.position;for(let i=0;i<p.count;i+=9){const v=o.localToWorld(new THREE.Vector3().fromBufferAttribute(p,i)),a=new THREE.Raycaster(v.clone().add(new THREE.Vector3(0,0,4)),new THREE.Vector3(0,0,-1)).intersectObjects(supports)[0],b=new THREE.Raycaster(v.clone().add(new THREE.Vector3(0,0,-4)),new THREE.Vector3(0,0,1)).intersectObjects(supports)[0];if(a&&b&&v.z<a.point.z&&v.z>b.point.z)count++;}return count;};
    const neck=root.getObjectByName('FruitNeck');assert.ok(neck&&inside(neck,crown)>3&&inside(neck,body)>3,'banana fruit neck must join the crown to the lower peel body');
    for(const name of ['LeftPeelShell','RightPeelShell','RearLeftPeelShell','RearRightPeelShell']){const peel=root.getObjectByName(name);assert.ok(inside(peel,[...crown,...body])>3,'banana peel root floats: '+name);const p=peel.geometry.attributes.position,ix=peel.geometry.index.array;for(let i=0;i<ix.length/2;i+=3){const a=ix[i],b=ix[i+1],c=ix[i+2];assert.ok((p.getX(b)-p.getX(a))*(p.getY(c)-p.getY(a))-(p.getY(b)-p.getY(a))*(p.getX(c)-p.getX(a))>-.0000001,'banana peel front folds across source artwork');}}
    const saved=[];root.traverse(o=>saved.push([o,o.position.clone(),o.quaternion.clone(),o.scale.clone()]));
    for(const clip of clips){const mixer=new THREE.AnimationMixer(root);mixer.clipAction(clip).play();for(const phase of [0,.25,.5,.75]){mixer.setTime(clip.duration*phase);root.updateMatrixWorld(true);for(const name of ['LeftArm','RightArm','LeftLeg','RightLeg'])assert.ok(inside(root.getObjectByName(name+'SuitSurface'),body)>3,'banana limb detached in '+clip.name+' '+phase+': '+name);}mixer.stopAllAction();}
    for(const[o,p,q,s]of saved){o.position.copy(p);o.quaternion.copy(q);o.scale.copy(s);}root.updateMatrixWorld(true);
  }
  if(key==="umbrella"){
    for(let i=0;i<8;i++)closedParts.push([root.getObjectByName("CanopyPanel"+i)]);
    root.traverse(o=>{if(o.isMesh&&(/^(CanopyRib|CanopyHem)/.test(o.name)||['UmbrellaPole','HookHandle','HoodRearSeam','CanopyTip','RainHood','LeftArmShoulder','RightArmShoulder'].includes(o.name)))closedParts.push([o]);});
    root.updateMatrixWorld(true);const head=root.getObjectByName('Head'),tip=root.getObjectByName('CanopyTip'),canopy=root.getObjectByName('CanopyPanel0');
    assert.ok(new THREE.Box3().setFromObject(tip).intersectsBox(new THREE.Box3().setFromObject(canopy)),'umbrella tip must meet canopy');
    const sleeve=root.getObjectByName('LeftArm'),handle=root.getObjectByName('HeldHandle');assert.ok(new THREE.Box3().setFromObject(sleeve).intersectsBox(new THREE.Box3().setFromObject(handle)),'held sleeve must contact handle');
    const p=new THREE.Vector3((312-319)*.005,(327-462)*.005,3);head.localToWorld(p);const hit=new THREE.Raycaster(p,new THREE.Vector3(0,0,-1)).intersectObjects([sleeve,handle],true)[0];assert.ok(hit&&hit.object.parent===sleeve,'hand must cover handle at the original grip');
    const inside=(v,supports)=>{const materials=new Map(supports.map(o=>[o.material,o.material.side]));for(const m of materials.keys())m.side=THREE.DoubleSide;const hits=new THREE.Raycaster(v,new THREE.Vector3(.027,.019,1).normalize()).intersectObjects(supports);for(const[m,side]of materials)m.side=side;const ds=[];for(const h of hits)if(!ds.some(d=>Math.abs(d-h.distance)<1e-5))ds.push(h.distance);return ds.length%2===1;};
    const overlap=(o,supports)=>{const p=o.geometry.attributes.position;let n=0;for(let i=0;i<p.count;i+=5)if(inside(o.localToWorld(new THREE.Vector3().fromBufferAttribute(p,i)),supports))n++;return n;};
    const pair=name=>['Surface','Back'].map(s=>root.getObjectByName(name+'Suit'+s)),torso=pair('Torso'),hood=root.getObjectByName('RainHood'),pole=root.getObjectByName('UmbrellaPole'),hook=root.getObjectByName('HookHandle');
    const saved=[];root.traverse(o=>saved.push([o,o.position.clone(),o.quaternion.clone(),o.scale.clone()]));
    for(const clip of clips){const mixer=new THREE.AnimationMixer(root);mixer.clipAction(clip).play();for(const phase of [0,.125,.25,.5,.75]){
      mixer.setTime(clip.duration*phase);root.updateMatrixWorld(true);
      assert.ok(overlap(torso[0],[hood])>2,'umbrella suit separates from hood: '+clip.name+' '+phase);
      for(const name of ['LeftArm','RightArm','LeftLeg','RightLeg']){const bridge=root.getObjectByName(name+'Shoulder');assert.ok(bridge?overlap(bridge,torso)>2&&overlap(bridge,pair(name))>2:overlap(pair(name)[0],torso)>2,'umbrella limb separates: '+name+' '+clip.name+' '+phase);}
      assert.ok(overlap(pole,[hook])>0||overlap(hook,[pole])>0,'umbrella pole separates from hook: '+clip.name+' '+phase);
      assert.ok(overlap(hook,pair('LeftArm'))>0,'umbrella held handle separates from grip: '+clip.name+' '+phase);
    }mixer.stopAllAction();}
    for(const[o,p,q,s]of saved){o.position.copy(p);o.quaternion.copy(q);o.scale.copy(s);}root.updateMatrixWorld(true);
  }
  if(key==="helicopter"){
    root.updateMatrixWorld(true);const blade=root.getObjectByName('MainRotorBlade1'),hull=root.getObjectByName('HelmetHull'),boom=root.getObjectByName('TailBoom'),fin=root.getObjectByName('HelicopterTailFinSolid'),mast=root.getObjectByName('HelicopterRotorMastSolid'),rotor=root.getObjectByName('Rotor'),hub=root.getObjectByName('RotorHub'),tailHub=root.getObjectByName('TailRotorHub'),axle=root.getObjectByName('HelicopterTailAxleSolid');
    const size=new THREE.Box3().setFromObject(blade).getSize(new THREE.Vector3());assert.ok(size.x>1.2&&size.z>.32&&size.y<.18,'main rotor needs broad horizontal blades with only a small aerodynamic pitch');assert.equal(boom.parent,root.getObjectByName('Head'));
    const inside=(o,targets)=>{targets=Array.isArray(targets)?targets:[targets];let count=0;const p=o.geometry.attributes.position;for(let j=0,n=Math.min(256,p.count);j<n;j++){const v=o.localToWorld(new THREE.Vector3().fromBufferAttribute(p,Math.floor(j*p.count/n))),sides=targets.map(t=>t.material.side);targets.forEach(t=>t.material.side=THREE.DoubleSide);const hits=new THREE.Raycaster(v,new THREE.Vector3(.023,.019,1).normalize()).intersectObjects(targets);targets.forEach((t,i)=>t.material.side=sides[i]);const ds=[];for(const h of hits)if(!ds.some(d=>Math.abs(d-h.distance)<1e-5))ds.push(h.distance);if(ds.length%2)count++;}return count;};
    const contact=(a,b)=>inside(a,b)>2||inside(b,a)>2,limb=n=>[root.getObjectByName(n+'SuitSurface'),root.getObjectByName(n+'SuitBack')];
    for(const n of ['HelmetHull','TailBoom','HelicopterTailFinSolid','HelicopterRotorMastSolid','HelicopterTailAxleSolid','RotorHub','TailRotorHub','MainRotorBlade1','MainRotorBlade-1','TailRotorBlade0','TailRotorBlade1','TailRotorBlade2'])closedParts.push([root.getObjectByName(n)]);
    assert.ok(new THREE.Box3().setFromObject(hull).getSize(new THREE.Vector3()).z>1.3,'helicopter hull must have rounded depth');assert.ok(new THREE.Box3().setFromObject(root.getObjectByName('Torso')).getSize(new THREE.Vector3()).y<.62,'helicopter torso must stay vertically short');
    assert.ok(contact(boom,hull)&&contact(fin,boom)&&contact(axle,fin)&&contact(tailHub,axle),'helicopter tail/fin/rotor axle detached');assert.ok(contact(mast,hull)&&contact(hub,mast),'helicopter main rotor mast detached');
    const face=root.getObjectByName('OriginalFace'),fp=face.geometry.attributes.position,fi=face.geometry.index;for(let i=0;i<fi.count;i+=57){const v=new THREE.Vector3();for(let j=0;j<3;j++)v.add(new THREE.Vector3().fromBufferAttribute(fp,fi.getX(i+j)));v.multiplyScalar(1/3);face.localToWorld(v);const hit=new THREE.Raycaster(v,new THREE.Vector3(0,0,-1)).intersectObject(hull)[0];assert.ok(hit&&hit.distance<.015,'helicopter face triangle sinks into hood');}
    const saved=[];root.traverse(o=>saved.push([o,o.position.clone(),o.quaternion.clone(),o.scale.clone()]));
    for(const clip of clips){assert.ok(clip.tracks.find(t=>t.name==='Rotor.quaternion')&&clip.tracks.find(t=>t.name==='TailRotor.quaternion'),'both helicopter rotors must animate in '+clip.name);const mixer=new THREE.AnimationMixer(root);mixer.clipAction(clip).play();for(const phase of [0,.0625,.125,.25,.5,.75]){mixer.setTime(clip.duration*phase);root.updateMatrixWorld(true);const neck=root.getObjectByName('HelicopterNeckBridge');assert.ok(inside(neck,[hull])>2&&inside(neck,limb('Torso'))>2,'helicopter neck bridge separates in '+clip.name);for(const n of ['LeftArm','RightArm','LeftLeg','RightLeg'])assert.ok(inside(root.getObjectByName(n+'SuitSurface'),limb('Torso'))>2,'helicopter limb separates: '+n+' '+clip.name);for(const sign of [-1,1]){const o=root.getObjectByName('MainRotorBlade'+sign);assert.ok(contact(o,hub),'main rotor blade root detached');assert.ok(new THREE.Box3().setFromObject(o).min.y>new THREE.Box3().setFromObject(hull).max.y+.035,'main rotor strikes helmet');}for(let j=0;j<3;j++){const o=root.getObjectByName('TailRotorBlade'+j);assert.ok(contact(o,tailHub)&&contact(root.getObjectByName('TailRotorBladeInlay'+j),o),'tail rotor blade or inlay detached');assert.equal(inside(o,[hull]),0,'tail rotor strikes helmet');}}mixer.stopAllAction();}
    for(const[o,p,q,s]of saved){o.position.copy(p);o.quaternion.copy(q);o.scale.copy(s);}root.updateMatrixWorld(true);
  }
  // Facial decals are supported by an opaque curved head, rather than a
  // separate flat disk. A ray back from each decal point must reach its hood.
  const carriers={banana:"FruitCrownSurface",helicopter:"HelmetHull",umbrella:"RainHood",ramen:'BowlShell'};
  if(carriers[key]){
    const face=root.getObjectByName("OriginalFace"),carrier=root.getObjectByName(carriers[key]);root.updateMatrixWorld(true);
    const ray=new THREE.Raycaster(),p=face.geometry.attributes.position;
    for(let i=0;i<p.count;i+=17){const v=new THREE.Vector3().fromBufferAttribute(p,i);if(key==="banana"&&(((319+v.x/.005-319)/100)**2+((303-v.y/.005-285)/84)**2>1))continue;face.localToWorld(v);ray.set(v,new THREE.Vector3(0,0,-1));const hit=ray.intersectObject(carrier)[0];assert.ok(hit&&hit.distance<.015,"facial decal must follow the opaque hood");}
    if(key==='ramen')for(let i=0;i<face.geometry.index.count;i+=51){
      const v=new THREE.Vector3();for(let j=0;j<3;j++)v.add(new THREE.Vector3().fromBufferAttribute(p,face.geometry.index.getX(i+j)));v.multiplyScalar(1/3);face.localToWorld(v);
      ray.set(v,new THREE.Vector3(0,0,-1));const hit=ray.intersectObject(carrier)[0];assert.ok(hit&&hit.distance<.015,'ramen face triangle interior must stay in front of ceramic');
    }
    if(key==='ramen')for(const name of ['CeramicGlint0','CeramicGlint1']){const glint=root.getObjectByName(name),p=glint.geometry.attributes.position,ix=glint.geometry.index;for(let i=0;i<ix.count;i+=27){const v=new THREE.Vector3();for(let j=0;j<3;j++)v.add(new THREE.Vector3().fromBufferAttribute(p,ix.getX(i+j)));glint.localToWorld(v.multiplyScalar(1/3));ray.set(v,new THREE.Vector3(0,0,-1));const hit=ray.intersectObject(carrier)[0];assert.ok(hit&&hit.distance<.012,'porcelain reflection must conform to bowl');}}
  }
  for(const parts of closedParts){
    const edges=new Map();
    for(const mesh of parts){
      const p=mesh.geometry.attributes.position,a=mesh.geometry.index||{count:p.count,getX:i=>i};
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
  let triangles=0;
  root.traverse(o=>{if(!o.isMesh)return;triangles+=(o.geometry.index?o.geometry.index.count:o.geometry.attributes.position.count)/3;assert.ok(Array.from(o.geometry.attributes.position.array).every(Number.isFinite),'finite authored vertices');});
  for(const node of gltf.nodes){if(node.mesh===undefined)continue;const object=root.getObjectByName(node.name);assert.ok(object?.isMesh,'exported mesh must resolve: '+node.name);
    for(const primitive of gltf.meshes[node.mesh].primitives)for(const [semantic,name] of [['POSITION','position'],['NORMAL','normal'],['TEXCOORD_0','uv'],['COLOR_0','color']]){
      const accessorIndex=primitive.attributes[semantic];if(accessorIndex===undefined)continue;const attr=object.geometry.attributes[name],accessor=gltf.accessors[accessorIndex],view=gltf.bufferViews[accessor.bufferView],offset=28+jsonLength+(view.byteOffset||0)+(accessor.byteOffset||0),expected=Buffer.from(attr.array.buffer,attr.array.byteOffset,attr.array.byteLength);
      assert.ok(glb.subarray(offset,offset+expected.length).equals(expected),'current exported '+semantic+' '+node.name);
    }
  }
  results.push({id:asset,modelSha256:crypto.createHash('sha256').update(glb).digest('hex'),triangles,bytes:glb.length,errors:[]});
  console.log(`PASS ${key}: closed opaque surfaces, one pair of limbs, finite animations, original artwork embedded in GLB${key==="cat"?", attached tail root":""}.`);
}
fs.writeFileSync(path.join(__dirname,'../outputs/qa/avatar-lab/all-152/geometry-custom.json'),JSON.stringify({count:results.length,passed:results.length,results},null,2)+'\n');
