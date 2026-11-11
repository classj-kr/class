"use strict";

(() => {
  const stage = document.querySelector("#stage"), loading = document.querySelector("#loading");
  const viewer = document.querySelector(".viewer");
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let renderer, mixer, model, currentAction, frame, previous = performance.now();
  let paused = reducedMotion, autoRotate = false, motion = "Idle", dragging = false;
  const cameraState = { yaw: 0, pitch: 0, radius: 5.1 };
  const target = { yaw: 0, pitch: 0, radius: 5.1 };
  const actions = {}, clock = { elapsed: 0 };
  let currentAvatar = "cat", selection = 0, walkView = null;
  const avatarButtons = [...document.querySelectorAll("[data-avatar]")];
  const descriptions = {
    cat: { name: "장난꾸러기 고양이", number: "AVATAR 001", copy: "쫑긋한 귀, 동그란 볼.<br>씩 웃는 얼굴까지 그대로.", traits: ["회색 줄무늬", "말린 꼬리", "고양이 후드"], alt: "회색 고양이 옷을 입고 씩 웃는 기존 아바타" },
    ramen: { name: "따끈따끈 라멘", number: "AVATAR 002", copy: "커다란 라멘 그릇, 작은 발걸음.<br>원래의 웃는 얼굴을 담았어요.", traits: ["동그란 그릇", "따뜻한 색감", "작은 팔다리"], alt: "라멘 그릇 얼굴과 작은 팔다리가 있는 기존 아바타" },
    donut: {name:"초콜릿 도넛",number:"AVATAR 003",copy:"달콤한 초콜릿과 작은 스프링클.<br>도넛 속 익숙한 미소.",traits:["도넛 고리","초콜릿 코팅","알록달록 스프링클"],alt:"초콜릿 도넛 가운데 얼굴이 있는 원본 아바타"},
    banana: {name:"깜짝 바나나",number:"AVATAR 004",copy:"활짝 벌어진 껍질 사이로<br>동그랗게 놀란 얼굴.",traits:["노란 껍질","곡선으로 벌어진 잎","초록빛 눈"],alt:"껍질이 벌어진 바나나 옷을 입은 원본 아바타"},
    helicopter: {name:"빨간 헬리콥터",number:"AVATAR 005",copy:"머리 위로 돌아가는 날개.<br>작은 꼬리까지 함께 출발해요.",traits:["수평 회전날개","파란 조종석","꼬리 날개"],alt:"빨간 헬리콥터 옷을 입은 원본 아바타"},
    umbrella: {name:"무지개 우산",number:"AVATAR 006",copy:"알록달록 우산을 펼치고<br>손잡이를 꼭 잡은 작은 친구.",traits:["펼쳐진 우산","파란 우비","굽은 손잡이"],alt:"우산과 파란 우비를 입은 원본 아바타"}
  };
  const scene = new THREE.Scene(); scene.background = new THREE.Color("#e9ede3");
  const camera = new THREE.OrthographicCamera(-2, 2, 1.55, -1.55, .1, 50);
  let aspect = 1;
  function fail(message) {
    loading.hidden = false; loading.textContent = message;
    const retry = document.createElement("button"); retry.textContent = "다시 열기";
    retry.addEventListener("click", () => location.reload()); loading.append(retry);
    viewer.setAttribute("aria-busy", "false");
    document.querySelectorAll(".viewer button:not(#loading button)").forEach(b => { b.disabled = true; });
  }
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  } catch (error) {
    fail("이 브라우저에서 3D 화면을 열 수 없어요. 다른 브라우저에서 열어주세요."); return;
  }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.NoToneMapping;
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const canvas = renderer.domElement;
  canvas.tabIndex = 0; canvas.setAttribute("role", "img");
  canvas.setAttribute("aria-label", "고양이 3D 모델. 드래그 또는 방향키로 회전, 스크롤 또는 더하기와 빼기 키로 확대와 축소. 방향 버튼으로 앞, 옆, 뒤를 볼 수 있습니다.");
  stage.append(canvas);
  scene.add(new THREE.HemisphereLight(0xfffaf0, 0xa5b398, .65));
  const key = new THREE.DirectionalLight(0xfff6df, 1.3); key.position.set(-3, 6, 5); key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024); key.shadow.camera.left = -3; key.shadow.camera.right = 3;
  key.shadow.camera.top = 4; key.shadow.camera.bottom = -3; key.shadow.camera.near = .5; key.shadow.camera.far = 14;
  key.shadow.normalBias = .025; key.shadow.bias = -.0002; key.shadow.radius = 4; scene.add(key);
  const fill = new THREE.DirectionalLight(0xe4edff, .5); fill.position.set(4, 3, -2); scene.add(fill);
  const front = new THREE.DirectionalLight(0xfff6ef, .2); front.position.set(0, 1, 6); scene.add(front);
  function material(color, roughness = 1) {
    const m = new THREE.MeshStandardMaterial({ color, roughness }); m.color.convertSRGBToLinear(); return m;
  }
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.ShadowMaterial({ opacity: .08 }));
  floor.rotation.x = -Math.PI / 2; floor.position.y = -.15; floor.receiveShadow = true; scene.add(floor);
  const platform = new THREE.Mesh(new THREE.CylinderGeometry(1.30, 1.30, .12, 96), material("#c9d8bd"));
  platform.position.y = -.075; platform.receiveShadow = true; platform.castShadow = true; scene.add(platform);
  const top = new THREE.Mesh(new THREE.CylinderGeometry(1.27, 1.27, .012, 96), material("#d7e1ce"));
  top.position.y = -.009; top.receiveShadow = true; scene.add(top);
  // A soft contact shadow, generated as code rather than stored as a raster image.
  const contact = new THREE.Mesh(new THREE.PlaneGeometry(2, 1.5), new THREE.ShaderMaterial({
    transparent: true, depthWrite: false,
    vertexShader: "varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}",
    fragmentShader: "varying vec2 vUv; void main(){float r=length((vUv-.5)*2.0);gl_FragColor=vec4(.20,.27,.18,.18*exp(-5.0*r*r)*smoothstep(1.0,.55,r));}"
  }));
  contact.rotation.x = -Math.PI / 2; contact.position.set(0, .002, .06); scene.add(contact);
  function resize() {
    const { width, height } = stage.getBoundingClientRect();
    renderer.setSize(width, height, false); aspect = width / height;
    const fit = aspect < .9 ? .9 / aspect : 1;
    camera.top = 1.55 * fit; camera.bottom = -camera.top;
    camera.left = -camera.top * aspect; camera.right = -camera.left; camera.updateProjectionMatrix();
  }
  const observer = new ResizeObserver(resize); observer.observe(stage); resize();
  const pauseButton = document.querySelector("#pause");
  function updatePause() {
    pauseButton.setAttribute("aria-pressed", String(paused));
    pauseButton.setAttribute("aria-label", paused ? "동작 재생" : "동작 일시 정지");
    pauseButton.innerHTML = paused ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 10 7-10 7Z"/></svg>' : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5v14M15 5v14"/></svg>';
  }
  function setMotion(name) {
    if (!actions[name]) return;
    const next = actions[name];
    if (currentAction !== next) {
      next.reset().setEffectiveWeight(1).play(); if (currentAction) currentAction.crossFadeTo(next, .25, false); currentAction = next;
    }
    motion = name; viewer.dataset.currentMotion=name; paused = false; updatePause();
    document.querySelectorAll("[data-motion]").forEach(b => { const active = b.dataset.motion === name; b.classList.toggle("active", active); b.setAttribute("aria-pressed", String(active)); });
  }
  document.querySelectorAll("[data-motion]").forEach(b => b.addEventListener("click", () => setMotion(b.dataset.motion)));
  pauseButton.addEventListener("click", () => { paused = !paused; updatePause(); });
  function stopRotation() {
    autoRotate = false; document.querySelector("#rotate").setAttribute("aria-pressed", "false");
  }
  function clearAngle() { document.querySelectorAll("[data-view]").forEach(b => b.setAttribute("aria-pressed", "false")); }
  document.querySelectorAll("[data-view]").forEach(b => b.addEventListener("click", () => {
    stopRotation(); target.yaw = { front: 0, side: Math.PI / 2, left: -Math.PI/2, back: Math.PI, top: -.6 }[b.dataset.view]; target.pitch = b.dataset.view==="top"?.8:currentAvatar === "ramen" ? .26 : 0;
    cameraState.yaw = Math.atan2(Math.sin(cameraState.yaw), Math.cos(cameraState.yaw));
    while (target.yaw - cameraState.yaw > Math.PI) target.yaw -= Math.PI * 2;
    while (target.yaw - cameraState.yaw < -Math.PI) target.yaw += Math.PI * 2;
    cameraState.yaw=target.yaw;cameraState.pitch=target.pitch;
    clearAngle(); b.setAttribute("aria-pressed", "true");
  }));
  document.querySelector("#rotate").addEventListener("click", e => { autoRotate = !autoRotate; e.currentTarget.setAttribute("aria-pressed", String(autoRotate)); if (autoRotate) clearAngle(); });
  const pointers = new Map(); let pinch = 0;
  canvas.addEventListener("pointerdown", e => {
    canvas.setPointerCapture(e.pointerId); pointers.set(e.pointerId, { x: e.clientX, y: e.clientY }); dragging = true; stopRotation();
    if (pointers.size === 2) { const p = [...pointers.values()]; pinch = Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y); }
  });
  canvas.addEventListener("pointermove", e => {
    const last = pointers.get(e.pointerId); if (!last) return;
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.size === 1) { target.yaw -= (e.clientX - last.x) * .008; target.pitch = THREE.MathUtils.clamp(target.pitch + (e.clientY - last.y) * .006, -.12, .8); clearAngle(); }
    else {
      const p = [...pointers.values()], distance = Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y);
      if (pinch > 0 && distance > 0) target.radius = THREE.MathUtils.clamp(target.radius * pinch / distance, 3.7, 7.5);
      pinch = distance;
    }
  });
  function release(e) { pointers.delete(e.pointerId); dragging = pointers.size > 0; if (pointers.size < 2) pinch = 0; }
  canvas.addEventListener("pointerup", release); canvas.addEventListener("pointercancel", release); canvas.addEventListener("lostpointercapture", release);
  canvas.addEventListener("wheel", e => { e.preventDefault(); target.radius = THREE.MathUtils.clamp(target.radius + e.deltaY * .003, 3.7, 7.5); }, { passive: false });
  canvas.addEventListener("keydown", e => {
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "+", "=", "-"].includes(e.key)) return;
    e.preventDefault(); stopRotation(); clearAngle();
    if (e.key === "ArrowLeft") target.yaw -= .18;
    if (e.key === "ArrowRight") target.yaw += .18;
    if (e.key === "ArrowUp") target.pitch = Math.min(.8, target.pitch + .12);
    if (e.key === "ArrowDown") target.pitch = Math.max(-.12, target.pitch - .12);
    if (e.key === "+" || e.key === "=") target.radius = Math.max(3.7, target.radius - .3);
    if (e.key === "-") target.radius = Math.min(7.5, target.radius + .3);
  });
  canvas.addEventListener("webglcontextlost", e => { e.preventDefault(); cancelAnimationFrame(frame); fail("3D 화면이 잠시 멈췄어요. 다시 열어주세요."); });
  function render(now) {
    frame = requestAnimationFrame(render);
    const dt = Math.min((now - previous) / 1000, .5); previous = now;
    if (document.hidden) return;
    if (mixer && !paused) { mixer.update(dt); clock.elapsed += dt; }
    if (walkView) walkView.update(dt);
    if (autoRotate && !dragging) target.yaw += dt * .28;
    const lerp = reducedMotion ? 1 : 1 - Math.exp(-12 * dt);
    for (const key of ["yaw", "pitch", "radius"]) cameraState[key] += (target[key] - cameraState[key]) * lerp;
    const { yaw, pitch, radius } = cameraState;
    const distance = radius;
    camera.zoom = 5.1 / radius; camera.updateProjectionMatrix();
    camera.position.set(Math.sin(yaw) * Math.cos(pitch) * distance, 1.25 + Math.sin(pitch) * distance, Math.cos(yaw) * Math.cos(pitch) * distance);
    camera.lookAt(0, 1.25, 0);
    const stageBounds=stage.getBoundingClientRect();
    if(stageBounds.bottom>0 && stageBounds.top<innerHeight)renderer.render(scene, camera);
  }
  frame = requestAnimationFrame(render); updatePause();
  const models = new Map(avatarButtons.map(button => [button.dataset.avatar, new Promise((resolve,reject) => {
    window.createClassJAvatarLoader().load(button.dataset.model+'?v=20261112-draco', resolve, undefined, reject);
  })]));
  function prepareModel(object) {
    object.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = false; if (o.material.isMeshBasicMaterial) o.material.toneMapped = false; } });
  }
  async function selectAvatar(key) {
    const request = ++selection;
    loading.hidden=false; loading.textContent="아바타가 나오는 중이에요…"; viewer.setAttribute("aria-busy","true");
    try {
      const gltf=await models.get(key); if(request!==selection)return;
      if(model)scene.remove(model); if(mixer)mixer.stopAllAction();
      model=gltf.scene; prepareModel(model); scene.add(model); mixer=new THREE.AnimationMixer(model);
      for(const name of Object.keys(actions))delete actions[name];
      for(const clip of gltf.animations)actions[clip.name]=mixer.clipAction(clip);
      if(actions.CharacterEffects)actions.CharacterEffects.play();
      currentAction=null;currentAvatar=key;viewer.dataset.currentAvatar=key;setMotion("Idle");paused=reducedMotion;updatePause();mixer.update(0);
      const button=avatarButtons.find(b=>b.dataset.avatar===key), info=descriptions[key];
      avatarButtons.forEach(b=>b.setAttribute("aria-pressed",String(b===button)));
      const download=document.querySelector(".download"); download.href=button.dataset.model+'?v=20261112-draco';
      download.download="classj-"+button.dataset.asset+".glb";
      const image=document.querySelector(".reference-art img");image.src=button.dataset.image;image.alt=info.alt;
      document.querySelector(".character-number").textContent=info.number;
      document.querySelector(".character-info h2").textContent=info.name;
      document.querySelector(".character-info p").innerHTML=info.copy;
      document.querySelector(".traits").replaceChildren(...info.traits.map(text=>{const tag=document.createElement("span");tag.textContent=text;return tag;}));
      viewer.setAttribute("aria-label",info.name+" 3D 모델 미리보기");
      canvas.setAttribute("aria-label",info.name+" 3D 모델. 드래그 또는 방향키로 회전, 스크롤로 확대.");
      stopRotation();target.yaw=0;target.pitch=key==="ramen"?.26:0;target.radius=key==="helicopter"?5.65:5.1;cameraState.radius=target.radius;cameraState.yaw=0;cameraState.pitch=target.pitch;
      clearAngle();document.querySelector('[data-view="front"]').setAttribute("aria-pressed","true");
      loading.hidden=true;viewer.setAttribute("aria-busy","false");
      document.querySelectorAll(".viewer button").forEach(b=>{b.disabled=false;});
      window.avatarPreview={get state(){return{ready:true,avatar:currentAvatar,motion,paused,autoRotate,camera:{...cameraState},animationTime:mixer.time,clips:Object.keys(actions),bounds:new THREE.Box3().setFromObject(model).getSize(new THREE.Vector3()).toArray(),triangles:renderer.info.render.triangles};},model,mixer};
    }catch(error){if(request===selection)fail("아바타를 불러오지 못했어요. 연결을 확인하고 다시 열어주세요.");}
  }
  avatarButtons.forEach(button=>button.addEventListener("click",()=>selectAvatar(button.dataset.avatar)));
  selectAvatar("cat");
  Promise.all([...models.values()]).then(gltfs=>{walkView=createWalkScene(gltfs);}).catch(()=>{
    document.querySelector("#walk-loading").textContent="산책 모델을 불러오지 못했어요. 페이지를 다시 열어주세요.";
  });
  function createWalkScene(gltfs) {
    const host=document.querySelector("#walk-stage"),toggle=document.querySelector("#walk-toggle");
    const walkScene=new THREE.Scene();walkScene.background=new THREE.Color("#f5f5ed");
    const walkCamera=new THREE.PerspectiveCamera(32,1,.1,80);walkCamera.position.set(0,3.6,8.3);walkCamera.lookAt(0,1.1,0);
    const walkRenderer=new THREE.WebGLRenderer({antialias:true});walkRenderer.setPixelRatio(Math.min(devicePixelRatio,2));
    walkRenderer.outputEncoding=THREE.sRGBEncoding;walkRenderer.toneMapping=THREE.NoToneMapping;
    walkRenderer.shadowMap.enabled=true;walkRenderer.shadowMap.type=THREE.PCFSoftShadowMap;
    walkRenderer.domElement.setAttribute("role","img");walkRenderer.domElement.setAttribute("aria-label","여섯 아바타가 각각 둥근 길을 따라 걷는 3D 산책 공간");
    host.append(walkRenderer.domElement);
    walkScene.add(new THREE.HemisphereLight(0xfffaf0,0xa5b398,1.2));
    const sun=new THREE.DirectionalLight(0xfff8ef,1);sun.position.set(-3,7,5);sun.castShadow=true;
    sun.shadow.mapSize.set(1024,1024);sun.shadow.camera.left=-6;sun.shadow.camera.right=6;sun.shadow.camera.top=5;sun.shadow.camera.bottom=-5;sun.shadow.normalBias=.02;walkScene.add(sun);
    const groundMaterial=new THREE.MeshBasicMaterial({color:"#f5f5ed"});groundMaterial.color.convertSRGBToLinear();
    const ground=new THREE.Mesh(new THREE.PlaneGeometry(200,200),groundMaterial);ground.rotation.x=-Math.PI/2;ground.position.y=-.012;walkScene.add(ground);
    const walkShadow=new THREE.Mesh(new THREE.PlaneGeometry(30,30),new THREE.ShadowMaterial({opacity:.10}));walkShadow.rotation.x=-Math.PI/2;walkShadow.position.y=-.008;walkShadow.receiveShadow=true;walkScene.add(walkShadow);
    const centers=gltfs.map((_,i)=>({x:(i%3-1)*2.8,z:Math.floor(i/3)*3.0-1.5})), colors=["#cbd7c2","#ead3c3","#dfcbb0","#e9d794","#dbb8bf","#a9c9d9"];
    for(let lane=0;lane<gltfs.length;lane++){
      const points=[];for(let j=0;j<=128;j++){const a=j/128*Math.PI*2;points.push(new THREE.Vector3(centers[lane].x+Math.cos(a)*.55,.002,centers[lane].z+Math.sin(a)*.55));}
      const lineMaterial=new THREE.LineDashedMaterial({color:colors[lane],dashSize:.11,gapSize:.08});lineMaterial.color.convertSRGBToLinear();
      const line=new THREE.Line(new THREE.BufferGeometry().setFromPoints(points),lineMaterial);line.computeLineDistances();walkScene.add(line);
    }
    const walkers=gltfs.map((gltf,i)=>{
      const character=gltf.scene.clone(true);character.scale.setScalar(.65);prepareModel(character);walkScene.add(character);
      const animationMixer=new THREE.AnimationMixer(character),clip=gltf.animations.find(c=>c.name==="Walk"),walk=animationMixer.clipAction(clip);walk.play();
      let stride=.36;character.traverse(o=>{if(o.userData.walkStride)stride=o.userData.walkStride;});
      animationMixer.timeScale=clip.duration*(.55*.42)/(.65*stride);
      character.position.set(centers[i].x,0,centers[i].z+.55);animationMixer.update(0);
      return{character,mixer:animationMixer,index:i};
    });
    let active=!reducedMotion,elapsed=0;
    function sync(){toggle.textContent=active?"산책 멈추기":"산책 시작";toggle.setAttribute("aria-pressed",String(active));host.dataset.walking=String(active);}
    toggle.disabled=false;sync();document.querySelector("#walk-loading").hidden=true;
    toggle.addEventListener("click",()=>{active=!active;sync();});
    function place(){
      walkers.forEach(({character,index})=>{
        const a=elapsed*.42+index*.32;
        character.position.set(centers[index].x+Math.cos(a)*.55,0,centers[index].z+Math.sin(a)*.55);
        character.rotation.y=Math.atan2(-Math.sin(a),Math.cos(a));
      });
      host.dataset.walkTime=elapsed.toFixed(3);
    }
    document.querySelector("#walk-reset").addEventListener("click",()=>{elapsed=0;active=false;walkers.forEach(w=>w.mixer.setTime(0));place();sync();});
    const walkObserver=new ResizeObserver(()=>{
      const {width,height}=host.getBoundingClientRect();walkRenderer.setSize(width,height,false);walkCamera.aspect=width/height;
      const fit=Math.max(1,1.65/walkCamera.aspect);walkCamera.position.set(0,7.2*fit,12.8*fit);walkCamera.lookAt(0,.6,0);walkCamera.updateProjectionMatrix();
    });walkObserver.observe(host);
    place();
    return{update(dt){if(active){elapsed+=dt;walkers.forEach(w=>w.mixer.update(dt));place();}const bounds=host.getBoundingClientRect();if(bounds.bottom>0&&bounds.top<innerHeight)walkRenderer.render(walkScene,walkCamera);},dispose(){walkObserver.disconnect();walkRenderer.dispose();}};
  }
  window.addEventListener("pagehide", () => { cancelAnimationFrame(frame); observer.disconnect(); renderer.dispose();walkView?.dispose(); }, { once: true });
})();
