(async function () {
  'use strict';
  if (!window.THREE || !window.MUSEUM_ROOMS) {
    document.body.innerHTML = '<p style="padding:30px;color:white">미술관 파일을 불러오지 못했습니다.</p>';
    return;
  }
  // 큐레이터 도장은 계정별 서버 저장 공간에 둔다. 브라우저에는 남기지 않는다(로그인이 없으면 이 탭 안에서만 기억).
  const finaleStore = await SiteStorage.open('museum');

  const canvas = document.getElementById('museum-canvas');
  const roomTabs = document.getElementById('room-tabs');
  const loading = document.getElementById('loading');
  const loadingBar = document.getElementById('loading-bar');
  const loadingText = document.getElementById('loading-text');
  const prompt = document.getElementById('art-prompt');
  const promptTitle = document.getElementById('prompt-title');
  const promptKicker = document.getElementById('prompt-kicker');
  const promptAction = document.getElementById('prompt-action');
  const progressEl = document.getElementById('room-progress');
  const modal = document.getElementById('art-modal');
  const finaleModal = document.getElementById('finale-modal');
  const finaleQuestionWrap = document.getElementById('finale-question-wrap');
  const finaleComplete = document.getElementById('finale-complete');
  const finaleOptions = document.getElementById('finale-options');
  const finaleFeedback = document.getElementById('finale-feedback');
  const finaleNext = document.getElementById('finale-next');
  const finaleArtwork = document.getElementById('finale-artwork');
  const finaleArtworkImage = document.getElementById('finale-artwork-image');
  const rooms = window.MUSEUM_ROOMS;
  const presenceEl = document.getElementById('class-presence');
  const bgm = document.getElementById('bgm');
  const ROOM_MUSIC = [
    '../assets/sound/museum/gallery-01-portrait.ogg',
    '../assets/sound/museum/gallery-02-nature.ogg',
    '../assets/sound/museum/gallery-03-story.ogg',
    '../assets/sound/museum/gallery-04-line-color-imagination.ogg',
    '../assets/sound/museum/gallery-05-form-space.ogg'
  ];

  function setRoomMusic(index) {
    if (!bgm || !ROOM_MUSIC[index]) return;
    const nextSrc = new URL(ROOM_MUSIC[index], document.baseURI).href;
    if (bgm.src === nextSrc) return;
    const wasPlaying = !bgm.paused;
    bgm.src = ROOM_MUSIC[index];
    bgm.load();
    if (wasPlaying) bgm.play().catch(() => {});
  }

  const {ROOM_QUIZZES,OBSERVATION_WORK_IDS}=window.MUSEUM_QUIZ;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x191613);
  scene.fog = new THREE.FogExp2(0x211d19, 0.014);

  const camera = new THREE.PerspectiveCamera(62, innerWidth / innerHeight, 0.08, 130);
  camera.rotation.order = 'YXZ';
  camera.position.set(0, 1.68, 6.5);

  // 크롬북(내장 GPU)이 주 대상이라 픽셀 배율을 낮추고 그림자 계산은 끈다.
  const MAX_PIXEL_RATIO = 1.25;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias:true, powerPreference:'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, MAX_PIXEL_RATIO));
  renderer.setSize(innerWidth, innerHeight, false);
  renderer.shadowMap.enabled = false;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.physicallyCorrectLights = true;

  const textureLoader = new THREE.TextureLoader();
  const textureCache = new Map();
  const framePolicy=MuseumPerformance.createFramePolicy(),resolutionBudget=MuseumPerformance.createResolutionBudget();
  let resolutionScale=1,lastLoopTime=performance.now(),lastPresence=null;
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const centerPointer = new THREE.Vector2(0,0);
  const clock = new THREE.Clock();
  const keys = Object.create(null);
  const clickable = [];
  const sculptureObstacles = [];
  const remotePeople = new Map();
  const assignedAvatars = window.createMuseumAssignedAvatars({THREE,scene,canvas});
  const selfActor = assignedAvatars.create({self:true});
  const selfAvatar = selfActor.group;
  const playerPosition = new THREE.Vector3(0, .002, 3.75);
  let spawnX = 0;
  let actualSpeed = 0, avatarHeading = Math.PI, reconnectTimer = 0, closing = false;
  const avatarReview = new URLSearchParams(location.search).get('avatars') === 'preview'
    ? window.createMuseumAvatarReview?.({THREE,scene,renderer}) : null;
  let presenceSocket = null, presenceTimer = 0, localPresenceId = null, presenceScope = 'class';
  const tmpDirection = new THREE.Vector3();
  const tmpRight = new THREE.Vector3();
  const wish = new THREE.Vector3();
  const velocity = new THREE.Vector3();
  let gallery = null;
  let activeRoom = 0;
  let yaw = 0;
  let pitch = -0.15;
  let dragging = false;
  let pointerDown = null;
  let nearest = null;
  let finaleSurface = null;
  let finaleQuizRoom = null;
  let finaleQuizIndex = 0;
  let finaleQuizCorrect = 0;
  let finaleQuizQuestions = [];
  const finaleLastQuestionSet = {};
  let loadTotal = 12;
  let loadDone = 0;
  let roomLoadVersion = 0;

  const clamp = (n,min,max) => Math.max(min,Math.min(max,n));
  const GALLERY_START = 8;
  const GALLERY_END = -30;
  const race = window.createMuseumRaceClient({ THREE, scene, rooms, galleryEnd: GALLERY_END,
    send: message => { if (presenceSocket?.readyState === WebSocket.OPEN) presenceSocket.send(JSON.stringify(message)); },
    roomId: () => rooms[activeRoom].id, selfId: () => localPresenceId, teleport: teleportPlayer,
    sfx: name => window.ClassGameSfx?.play(name) });
  let raceActive = false;
  // 순위전 시상식 자리로 옮겨 선다(서버에는 평소처럼 위치를 보낸다).
  function teleportPlayer({ x, z, yaw: nextYaw, heading }) {
    keysClear();
    playerPosition.set(x, .002, z); yaw = nextYaw; pitch = -.12; avatarHeading = heading;
    camera.rotation.set(pitch, yaw, 0); updateSelfAvatar();
    lastPresence = null; presenceTimer = 0; sendPresence(); framePolicy.invalidate();
  }
  function updatePeople(visitors) {
    const visible = visitors.filter(v => v.userId !== localPresenceId);
    const ids = new Set(visible.map(v => v.userId));
    for (const [id, entry] of remotePeople) if (!ids.has(id)) { entry.actor.dispose(); remotePeople.delete(id); }
    for (const v of visible) {
      let entry = remotePeople.get(v.userId);
      if (!entry) {
        const actor = assignedAvatars.create({name:v.name});
        entry = {actor, group:actor.group}; remotePeople.set(v.userId, entry);
      }
      const teleported = entry.room !== v.room;
      const distance = Math.hypot(v.x - (entry.x ?? v.x), v.z - (entry.z ?? v.z));
      const now = performance.now(), elapsed = Math.max(.05, (now - (entry.received || now - 100)) / 1000);
      const motionChanged = distance > .001 || teleported || entry.moving !== (v.moving === true);
      Object.assign(entry, {room:v.room, x:v.x, z:v.z, yaw:v.yaw, avatarKey:v.avatarKey || '', moving:v.moving === true,
        speed: motionChanged ? Math.min(7.5, distance / elapsed) : entry.speed || 0,
        received: motionChanged ? now : entry.received || now});
      if (teleported) { entry.group.position.set(v.x, .002, v.z); entry.group.rotation.y=v.yaw; }
    }
  }
  function updateRemoteAvatars(dt) {
    for (const entry of remotePeople.values()) {
      const visible = entry.room === rooms[activeRoom].id;
      entry.group.visible = visible && !modal.open && !finaleModal.open && !race.modal.open;
      const key = visible ? entry.avatarKey : '';
      if (entry.actor.key !== key) void entry.actor.assign(key);
      const gap = Math.hypot(entry.x-entry.group.position.x,entry.z-entry.group.position.z);
      if (gap > 4) entry.group.position.set(entry.x,.002,entry.z);
      else { const blend=1-Math.exp(-dt*14); entry.group.position.x+=(entry.x-entry.group.position.x)*blend;entry.group.position.z+=(entry.z-entry.group.position.z)*blend; }
      entry.group.position.y=.002+race.floorAt(entry.group.position.x,entry.group.position.z);
      const angle=Math.atan2(Math.sin(entry.yaw-entry.group.rotation.y),Math.cos(entry.yaw-entry.group.rotation.y));
      entry.group.rotation.y+=angle*(1-Math.exp(-dt*14));
      entry.actor.moving = visible && entry.moving && performance.now()-entry.received < 700;
      entry.actor.speed = entry.speed;
    }
  }
  async function connectClassPresence() {
    try {
      const name=String(window.CLASS_PLAYER_NAME || '').trim();
      let clientId=sessionStorage.getItem('museumPresenceClientId');
      if(!clientId){clientId=crypto.randomUUID?crypto.randomUUID():`${Date.now()}-${Math.random().toString(36).slice(2)}`;sessionStorage.setItem('museumPresenceClientId',clientId);}
      const response=await fetch(`/api/museum/presence-ticket?${new URLSearchParams({name,clientId})}`,{cache:'no-store'});
      if(!response.ok) { presenceEl.textContent='함께 관람 연결을 확인해 주세요.';presenceEl.hidden=false;return; }
      const payload=await response.json();presenceScope=payload.scope||'class';
      const proto=location.protocol==='https:'?'wss':'ws';
      const socket = new WebSocket(`${proto}://${location.host}`);presenceSocket=socket;
      socket.addEventListener('open',()=>socket.send(JSON.stringify({type:'MUSEUM_JOIN',ticket:payload.ticket})));
      socket.addEventListener('message',event=>{
        let msg;try{msg=JSON.parse(event.data);}catch{return;}
        if(msg.type==='MUSEUM_JOINED'){
          if(!localPresenceId&&Number.isFinite(msg.position?.x)&&Number.isFinite(msg.position?.z)) {
            spawnX=msg.position.x;playerPosition.set(spawnX,.002,msg.position.z);updateSelfAvatar();
          }
          localPresenceId=msg.userId;void selfActor.assign(msg.avatarKey);presenceTimer=0;lastPresence=null;sendPresence();race.setConnected(true);
        }
        if(msg.type==='MUSEUM_RACE'){race.handle(msg);framePolicy.invalidate();}
        if(msg.type==='MUSEUM_STATE'){
          presenceScope=msg.scope||presenceScope;updatePeople(msg.visitors);
          const here=msg.visitors.filter(v=>v.room===rooms[activeRoom].id).length;
          presenceEl.textContent=presenceScope==='class'?`우리 반 함께 관람 중 ${here}명 · 학교 접속 30명 초과`:presenceScope==='school'?`우리 학교 함께 관람 중 ${here}명`:`함께 관람 중 ${here}명`;presenceEl.hidden=false;
        }
      });
      socket.addEventListener('close',event=>{
        if (presenceSocket !== socket) return;
        presenceSocket=null;updatePeople([]);race.setConnected(false);presenceEl.textContent='함께 관람 연결이 끊겼어요.';presenceEl.hidden=false;
        if(!closing && event.code!==4003) reconnectTimer=setTimeout(connectClassPresence,2000);
      });
    } catch(error) { if(!closing) reconnectTimer=setTimeout(connectClassPresence,3000); }
  }
  function sendPresence(){
    if(!presenceSocket||presenceSocket.readyState!==WebSocket.OPEN||!localPresenceId)return;
    const now=performance.now(),state={room:rooms[activeRoom].id,x:selfAvatar.position.x,z:selfAvatar.position.z,yaw:avatarHeading,moving:actualSpeed>.03};
    if(now-presenceTimer<100||(!MuseumPerformance.presenceChanged(lastPresence,state)&&now-presenceTimer<3000))return;
    presenceTimer=now;lastPresence=state;presenceSocket.send(JSON.stringify({type:'MUSEUM_MOVE',...state}));
  }
  addEventListener('pagehide',()=>{closing=true;clearTimeout(reconnectTimer);presenceSocket?.close();});
  addEventListener('pageshow',event=>{if(event.persisted&&!avatarReview){closing=false;connectClassPresence();}});

  function surfaceTexture(path,repeatX,repeatY,color=true) {
    const texture=textureLoader.load(path);
    texture.wrapS=texture.wrapT=THREE.RepeatWrapping;
    texture.repeat.set(repeatX,repeatY);
    texture.anisotropy=Math.min(12,renderer.capabilities.getMaxAnisotropy());
    if(color)texture.encoding=THREE.sRGBEncoding;
    return texture;
  }

  const floorAlbedo=surfaceTexture('assets/textures/walnut-floor-albedo.webp?v=2',4,12.5);
  const floorBump=surfaceTexture('assets/textures/walnut-floor-bump.webp?v=2',4,12.5,false);
  const wallAlbedo=surfaceTexture('assets/textures/charcoal-fabric-albedo.webp?v=2',12,6);
  const wallBump=surfaceTexture('assets/textures/charcoal-fabric-bump.webp?v=2',12,6,false);
  const plasterAlbedo=surfaceTexture('assets/textures/warm-plaster-albedo.webp?v=2',2.4,7.2);
  const plasterBump=surfaceTexture('assets/textures/warm-plaster-bump.webp?v=2',2.4,7.2,false);
  const materials = {
    wall:new THREE.MeshStandardMaterial({map:wallAlbedo,bumpMap:wallBump,bumpScale:.004,color:0xf0ece8,roughness:.94,metalness:0}),
    wallInset:new THREE.MeshStandardMaterial({map:wallAlbedo,bumpMap:wallBump,bumpScale:.003,color:0xa19b95,roughness:.96,metalness:0}),
    walnut:new THREE.MeshStandardMaterial({map:floorAlbedo,bumpMap:floorBump,bumpScale:.022,color:0xf0e5d8,roughness:.59,metalness:.01,emissive:0x100a06,emissiveIntensity:.1}),
    ceiling:new THREE.MeshStandardMaterial({map:plasterAlbedo,bumpMap:plasterBump,bumpScale:.0025,color:0xa99b8c,roughness:.94,metalness:0,emissive:0x6f5d4a,emissiveMap:plasterAlbedo,emissiveIntensity:.48}),
    brass:new THREE.MeshStandardMaterial({color:0xa77b3e,roughness:.34,metalness:.68}),
    darkBrass:new THREE.MeshStandardMaterial({color:0x4b3928,roughness:.52,metalness:.42}),
    black:new THREE.MeshStandardMaterial({color:0x181512,roughness:.76}),
    stone:new THREE.MeshStandardMaterial({color:0x8a8176,roughness:.72,metalness:.025})
  };

  // 실제 조명은 픽셀마다 모든 광원을 계산해 무겁다. 실제 스포트라이트는 관람자 가까운
  // 작품 몇 곳에만 옮겨 달고, 나머지 빛 번짐은 가산 합성 텍스처로 흉내 낸다.
  function glowTexture(draw) {
    const c=document.createElement('canvas');c.width=c.height=256;draw(c.getContext('2d'));
    const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;return t;
  }
  const radialGlow=glowTexture(g=>{
    const grad=g.createRadialGradient(128,128,0,128,128,128);
    grad.addColorStop(0,'rgba(255,255,255,1)');grad.addColorStop(.4,'rgba(255,255,255,.5)');grad.addColorStop(1,'rgba(255,255,255,0)');
    g.fillStyle=grad;g.fillRect(0,0,256,256);
  });
  const coveGlow=glowTexture(g=>{
    const band=g.createLinearGradient(0,0,0,256);band.addColorStop(0,'rgba(255,255,255,.55)');band.addColorStop(1,'rgba(255,255,255,0)');
    g.fillStyle=band;g.fillRect(0,0,256,256);
    g.save();g.translate(128,0);g.scale(1,2);
    const scallop=g.createRadialGradient(0,0,0,0,0,128);scallop.addColorStop(0,'rgba(255,255,255,.45)');scallop.addColorStop(1,'rgba(255,255,255,0)');
    g.fillStyle=scallop;g.fillRect(-128,0,256,128);g.restore();
  });
  coveGlow.wrapS=THREE.RepeatWrapping;
  const glowMaterialOptions={transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,toneMapped:false,fog:false,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2};
  function glowMaterial(map,color,opacity){return new THREE.MeshBasicMaterial({...glowMaterialOptions,map,color,opacity});}
  const glowMaterials = {
    floor:glowMaterial(radialGlow,0xffcf96,.16),
    cove:glowMaterial(coveGlow,0xffd4a0,.42),
    lamp:glowMaterial(radialGlow,0xffc56f,.3)
  };
  const ART_GLOW_OPACITY=.34;
  const sharedMaterials=new Set([...Object.values(materials),...Object.values(glowMaterials)]);

  const ART_LIGHT_POOL_SIZE=4;
  const artLightAnchors=[];
  const artLightPool=Array.from({length:ART_LIGHT_POOL_SIZE},()=>{
    const light=new THREE.SpotLight(0xffd29a,0,8,Math.PI*.18,.48,1.8);scene.add(light,light.target);
    return {light,anchor:null,level:0};
  });
  const artLightFocus=new THREE.Vector3();
  let lightSelectionAt=-Infinity,wantedArtLights=[];

  function resetArtLights() {
    artLightAnchors.length=0;lightSelectionAt=-Infinity;wantedArtLights=[];
    for(const slot of artLightPool){slot.anchor=null;slot.level=0;slot.light.intensity=0;}
  }

  function assignArtLight(slot,anchor) {
    const light=slot.light;
    slot.anchor=anchor;slot.level=0;
    light.color.setHex(anchor.color);light.distance=anchor.distance;light.angle=anchor.angle;light.penumbra=anchor.penumbra;light.decay=anchor.decay;
    light.position.copy(anchor.position);light.target.position.copy(anchor.target);
  }

  function updateArtLights(dt) {
    // 시선 앞쪽 지점에서 가까운 작품에 조명을 몰아주고, 교체는 서서히 페이드한다.
    const now=performance.now();
    if(now-lightSelectionAt>=150){lightSelectionAt=now;artLightFocus.set(camera.position.x-Math.sin(yaw)*2.5,0,camera.position.z-Math.cos(yaw)*2.5);
    wantedArtLights=artLightAnchors
      .map(anchor=>({anchor,dist:Math.hypot(anchor.target.x-artLightFocus.x,anchor.target.z-artLightFocus.z)}))
      .sort((a,b)=>a.dist-b.dist).slice(0,ART_LIGHT_POOL_SIZE).map(item=>item.anchor);}
    const wanted=wantedArtLights;
    const step=Math.min(1,dt*3);
    for(const slot of artLightPool){
      if(!slot.anchor)continue;
      slot.level=wanted.includes(slot.anchor)?Math.min(1,slot.level+step):Math.max(0,slot.level-step);
    }
    for(const anchor of wanted){
      if(artLightPool.some(slot=>slot.anchor===anchor))continue;
      const free=artLightPool.find(slot=>!slot.anchor||slot.level===0&&!wanted.includes(slot.anchor));
      if(!free)break;
      if(free.anchor?.glow)free.anchor.glow.opacity=free.anchor.glowOpacity;
      assignArtLight(free,anchor);
    }
    for(const slot of artLightPool){
      const anchor=slot.anchor;
      slot.light.intensity=anchor?anchor.intensity*slot.level:0;
      if(anchor?.glow)anchor.glow.opacity=anchor.glowOpacity*(1-.7*slot.level);
    }
  }

  function mesh(box, mat, position, parent=gallery) {
    const m=new THREE.Mesh(new THREE.BoxGeometry(...box),mat);m.position.set(...position);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;
  }

  function makeLabel(title, artist, width=2.4) {
    const c=document.createElement('canvas');c.width=768;c.height=168;const g=c.getContext('2d');
    g.fillStyle='#12100e';g.fillRect(0,0,c.width,c.height);g.strokeStyle='#9f7c3d';g.lineWidth=3;g.strokeRect(4,4,c.width-8,c.height-8);
    g.fillStyle='#f2e5c9';g.font='700 35px sans-serif';g.fillText(title.length>18?title.slice(0,17)+'…':title,34,65);
    g.fillStyle='#ad9871';g.font='24px sans-serif';g.fillText(artist,34,112);g.fillStyle='#c9a65a';g.fillRect(34,135,76,3);
    const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;t.anisotropy=8;
    const m=new THREE.Mesh(new THREE.PlaneGeometry(width,width*168/768),new THREE.MeshBasicMaterial({map:t,toneMapped:false}));
    return m;
  }

  const FINALE_PROGRESS_KEY = 'museumFinaleRoomsV2';
  finaleStore.adopt([{localKey:FINALE_PROGRESS_KEY,item:'finaleRooms'}]);
  const museumCompletionState = new Map();

  function readFinaleProgress() {
    const progress=finaleStore.get('finaleRooms');return progress&&typeof progress==='object'?{...progress}:{};
  }

  function writeFinaleProgress(progress) {
    finaleStore.set('finaleRooms',progress);
  }

  function setMuseumCompletionState(room,state) {
    museumCompletionState.set(room.id,state);
    if(finaleSurface?.userData?.finaleRoom?.id===room.id)refreshFinaleWall();
  }

  async function loadMuseumCompletions(room) {
    if(!museumCompletionState.has(room.id))setMuseumCompletionState(room,{status:'loading',records:[]});
    try{
      const response=await fetch(`/api/museum/completions?roomId=${encodeURIComponent(room.id)}`,{cache:'no-store',credentials:'same-origin'});
      if(response.status===401||response.status===403){setMuseumCompletionState(room,{status:'unavailable',records:[]});return;}
      if(!response.ok)throw new Error(`Museum completions ${response.status}`);
      const data=await response.json();
      const records=Array.isArray(data.records)?data.records.map(item=>({name:String(item.name||'').trim(),time:String(item.time||'').trim()})).filter(item=>item.name):[];
      setMuseumCompletionState(room,{status:'ready',records});
    }catch(error){
      console.warn('Museum completion list unavailable:',error);
      setMuseumCompletionState(room,{status:'error',records:[]});
    }
  }

  async function registerMuseumCompletion(room) {
    try{
      const response=await fetch('/api/museum/completions',{
        method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify({roomId:room.id})
      });
      if(response.status===401||response.status===403){setMuseumCompletionState(room,{status:'unavailable',records:[]});return;}
      if(!response.ok)throw new Error(`Museum completion ${response.status}`);
      const data=await response.json();
      const records=Array.isArray(data.records)?data.records.map(item=>({name:String(item.name||'').trim(),time:String(item.time||'').trim()})).filter(item=>item.name):[];
      setMuseumCompletionState(room,{status:'ready',records});
    }catch(error){
      console.warn('Museum completion could not be recorded:',error);
      setMuseumCompletionState(room,{status:'error',records:[]});
    }
  }

  function finaleTexture(room) {
    const c=document.createElement('canvas');c.width=1400;c.height=860;const g=c.getContext('2d');
    const complete=Boolean(readFinaleProgress()[room.id]);
    const completion=museumCompletionState.get(room.id)||{status:'loading',records:[]};
    const grad=g.createRadialGradient(700,300,20,700,390,760);grad.addColorStop(0,complete?'#382b17':'#282017');grad.addColorStop(1,'#0c0b09');
    g.fillStyle=grad;g.fillRect(0,0,c.width,c.height);
    g.strokeStyle=complete?'#d5b565':'#806735';g.lineWidth=3;g.strokeRect(28,28,c.width-56,c.height-56);
    g.strokeStyle='rgba(211,177,101,.23)';g.lineWidth=1;g.strokeRect(48,48,c.width-96,c.height-96);
    g.textAlign='center';g.fillStyle='#b89954';g.font='700 19px Georgia';g.letterSpacing='7px';g.fillText('GALLERY CHECK',700,105);
    g.fillStyle='#eadcbf';g.font='700 64px serif';g.fillText(`${room.number}. ${room.title}`,700,192);
    g.fillStyle='#9f917e';g.font='27px sans-serif';g.fillText(room.subtitle,700,238);
    g.strokeStyle='rgba(211,177,101,.32)';g.lineWidth=1;g.beginPath();g.moveTo(120,278);g.lineTo(1280,278);g.stroke();
    g.fillStyle='#d0b577';g.font='700 28px sans-serif';g.fillText('오늘의 우리 반 완료',700,328);
    if(completion.status==='ready'){
      g.fillStyle='#8d806d';g.font='20px sans-serif';g.fillText(`${completion.records.length}명`,700,360);
      if(completion.records.length===0){
        g.fillStyle='#9f917e';g.font='25px sans-serif';g.fillText('아직 오늘 완료한 친구가 없습니다.',700,514);
      }else{
        const visible=completion.records.slice(0,30),columns=6,cardW=190,cardH=48,gapX=14,gapY=10;
        const totalW=columns*cardW+(columns-1)*gapX,startX=(c.width-totalW)/2;
        visible.forEach((record,index)=>{
          const col=index%columns,row=Math.floor(index/columns),x=startX+col*(cardW+gapX),y=392+row*(cardH+gapY);
          g.fillStyle='rgba(213,181,101,.075)';g.fillRect(x,y,cardW,cardH);
          g.strokeStyle='rgba(213,181,101,.22)';g.strokeRect(x+.5,y+.5,cardW-1,cardH-1);
          g.textAlign='left';g.fillStyle='#e8dbc0';g.font='700 22px sans-serif';g.fillText(record.name.slice(0,8),x+14,y+31);
          g.textAlign='right';g.fillStyle='#907f64';g.font='17px sans-serif';g.fillText(record.time.slice(0,5),x+cardW-12,y+30);
        });
        g.textAlign='center';
        if(completion.records.length>visible.length){g.fillStyle='#9f917e';g.font='18px sans-serif';g.fillText(`외 ${completion.records.length-visible.length}명`,700,704);}
      }
    }else{
      g.fillStyle='#9f917e';g.font='25px sans-serif';
      const message=completion.status==='unavailable'?'우리 반 로그인 후 명단이 표시됩니다.':completion.status==='error'?'명단을 잠시 불러올 수 없습니다.':'우리 반 명단을 불러오는 중…';
      g.fillText(message,700,514);
    }
    g.textAlign='center';g.fillStyle=complete?'#dbc27c':'#c6a55c';g.font='700 23px sans-serif';
    g.fillText(complete?'✓ 확인 문제 완료 · 클릭하면 다시 풀 수 있어요':'확인 문제 풀기 · 벽을 클릭하세요',700,784);
    const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;t.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());t.userData={finaleTexture:true};return t;
  }

  function addFinaleWall(room,shell) {
    // Match the other galleries' substantial final-board proportions, scaled
    // up to fill the spatial gallery's larger end wall. Venus may overlap it.
    const panelW=5.8,panelH=3.65,panelY=3.25,z=GALLERY_END+.38;
    const group=new THREE.Group();gallery.add(group);
    mesh([panelW+.62,panelH+.62,.18],materials.black,[0,panelY,z-.08],group);
    mesh([panelW+.76,.11,.24],materials.brass,[0,panelY+(panelH+.7)/2,z],group);
    mesh([panelW+.76,.11,.24],materials.brass,[0,panelY-(panelH+.7)/2,z],group);
    mesh([.11,panelH+.58,.24],materials.brass,[-(panelW+.64)/2,panelY,z],group);
    mesh([.11,panelH+.58,.24],materials.brass,[(panelW+.64)/2,panelY,z],group);
    const mat=new THREE.MeshBasicMaterial({map:finaleTexture(room),toneMapped:false});
    const panel=new THREE.Mesh(new THREE.PlaneGeometry(panelW,panelH),mat);panel.position.set(0,panelY,z+.13);panel.userData.finaleRoom=room;group.add(panel);clickable.push(panel);finaleSurface=panel;
    for(const side of [-1,1]){
      const lamp=mesh([.18,.28,.18],materials.darkBrass,[side*(panelW/2+.72),panelY+.45,z+.2],group);
      lamp.rotation.z=side*.12;
      const glow=new THREE.Mesh(new THREE.PlaneGeometry(1.7,2.3),glowMaterials.lamp);glow.position.set(side*(panelW/2+.72),panelY+.1,GALLERY_END+.17);group.add(glow);
    }
    artLightAnchors.push({position:new THREE.Vector3(0,Math.min(shell.height-.35,panelY+2.1),z+2.5),target:new THREE.Vector3(0,panelY,z),color:0xffce84,intensity:42,distance:8,angle:Math.PI*.25,penumbra:.75,decay:1.5});
  }

  function refreshFinaleWall() {
    if(!finaleSurface)return;
    const old=finaleSurface.material.map;
    finaleSurface.material.map=finaleTexture(finaleSurface.userData.finaleRoom);
    finaleSurface.material.needsUpdate=true;
    if(old?.userData?.finaleTexture)old.dispose();
  }

  function completedFinaleCount() {
    const progress=readFinaleProgress();return rooms.filter(room=>progress[room.id]).length;
  }

  function showFinaleCompletion(room,newlyCompleted=false) {
    const progress=readFinaleProgress();progress[room.id]=true;writeFinaleProgress(progress);refreshFinaleWall();
    if(newlyCompleted)void registerMuseumCompletion(room);
    finaleQuestionWrap.hidden=true;finaleComplete.hidden=false;
    document.querySelector('.curator-stamp').hidden=false;
    document.getElementById('finale-step').textContent='GALLERY COMPLETE';
    document.getElementById('finale-progress').style.width='100%';
    document.getElementById('finale-total').textContent=`${completedFinaleCount()} / ${rooms.length} ROOMS`;
    document.getElementById('finale-stamp-number').textContent=room.number;
    document.getElementById('finale-complete-title').textContent=newlyCompleted?'관찰의 눈을 얻었어요':'이미 획득한 큐레이터 도장이에요';
    document.getElementById('finale-complete-copy').textContent=completedFinaleCount()===rooms.length?'다섯 전시실의 관찰을 모두 마쳤어요. 이제 이 미술관의 어린이 큐레이터입니다.':`${room.title} 전시실의 작품을 세심하게 관찰했다는 표시예요.`;
  }

  function showFinaleRetry(room) {
    const total=finaleQuizQuestions.length;
    finaleQuestionWrap.hidden=true;finaleComplete.hidden=false;
    document.querySelector('.curator-stamp').hidden=true;
    document.getElementById('finale-step').textContent='TRY AGAIN';
    document.getElementById('finale-progress').style.width='100%';
    document.getElementById('finale-total').textContent=`${completedFinaleCount()} / ${rooms.length} ROOMS`;
    document.getElementById('finale-complete-title').textContent=`${finaleQuizCorrect} / ${total}개를 맞혔어요`;
    document.getElementById('finale-complete-copy').textContent='큐레이터 도장은 다섯 문제를 모두 맞혀야 받을 수 있어요. 작품을 다시 살펴보고 재도전해 보세요.';
  }

  function renderFinaleQuestion() {
    let missedThisQuestion=false;
    const item=finaleQuizQuestions[finaleQuizIndex];
    finaleQuestionWrap.hidden=false;finaleComplete.hidden=true;finaleNext.hidden=true;
    finaleArtwork.hidden=!item.image;
    if(item.image){finaleArtworkImage.src=item.image;}else{finaleArtworkImage.removeAttribute('src');}
    finaleNext.textContent=finaleQuizIndex===finaleQuizQuestions.length-1?'결과 보기':'다음 관찰로';
    finaleFeedback.textContent='';finaleFeedback.className='finale-feedback';
    document.getElementById('finale-step').textContent=`QUESTION ${String(finaleQuizIndex+1).padStart(2,'0')} / ${String(finaleQuizQuestions.length).padStart(2,'0')}`;
    document.getElementById('finale-progress').style.width=`${finaleQuizIndex/finaleQuizQuestions.length*100}%`;
    document.getElementById('finale-total').textContent=`${completedFinaleCount()} / ${rooms.length} ROOMS`;
    document.getElementById('finale-question').textContent=item.q;
    finaleOptions.replaceChildren(...item.options.map((label,index)=>{
      const button=document.createElement('button');button.type='button';button.className='finale-option';button.dataset.letter=String.fromCharCode(65+index);button.textContent=label;
      button.addEventListener('click',()=>{
        if(index!==item.answer){missedThisQuestion=true;button.classList.add('wrong');button.disabled=true;finaleFeedback.textContent='다시 생각하고 다른 답을 골라보세요.';return;}
        [...finaleOptions.children].forEach(option=>option.disabled=true);
        button.classList.add('correct');if(!missedThisQuestion){finaleQuizCorrect++;}finaleFeedback.textContent=item.explain;finaleFeedback.classList.add('correct');window.ClassGameSfx?.play('card');
        finaleNext.hidden=false;
      });return button;
    }));
  }

  function shuffledCopy(items) {
    const result=[...items];
    for(let i=result.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[result[i],result[j]]=[result[j],result[i]];}
    return result;
  }

  const buildImageQuestion=(room,mode,target)=>window.MUSEUM_QUIZ.imageQuestion(mode,target,shuffledCopy);

  function startFinaleQuiz(room) {
    finaleQuizRoom=room;finaleQuizIndex=0;finaleQuizCorrect=0;
    const works=shuffledCopy(room.works);
    const imageWorks=works.slice(0,2);
    if(imageWorks[1].artist==='작자 미상')imageWorks.reverse();
    const imageWorkIds=new Set(imageWorks.map(work=>work.id));
    const observations=shuffledCopy(ROOM_QUIZZES[room.id].questions.map((question,index)=>({
      ...question,workId:OBSERVATION_WORK_IDS[room.id][index]
    })).filter(question=>!imageWorkIds.has(question.workId)));
    const imageModes=['title','artist'];
    const selected=[
      buildImageQuestion(room,imageModes[0],imageWorks[0]),
      buildImageQuestion(room,imageModes[1],imageWorks[1]),
      observations[0],
      observations[1],
      observations[2]
    ];
    let signature=selected.map(item=>`${item.kind||'observation'}:${item.image||''}:${item.q}`).sort().join('|');
    if(signature===finaleLastQuestionSet[room.id]&&observations[2]){selected[4]=observations[2];signature=selected.map(item=>`${item.kind||'observation'}:${item.image||''}:${item.q}`).sort().join('|');}
    finaleLastQuestionSet[room.id]=signature;
    finaleQuizQuestions=shuffledCopy(selected.map(item=>{
      const choices=item.options.map((label,index)=>({label,correct:index===item.answer}));
      const randomizedChoices=shuffledCopy(choices);
      return {...item,options:randomizedChoices.map(choice=>choice.label),answer:randomizedChoices.findIndex(choice=>choice.correct)};
    }));
    document.getElementById('finale-kicker').textContent=`GALLERY ${room.number} · GALLERY CHECK`;
    document.getElementById('finale-title').textContent=`${room.title} · 확인 문제`;
    renderFinaleQuestion();
  }

  function showFinale(room) {
    window.ClassGameSfx?.play('card');keysClear();
    document.getElementById('finale-kicker').textContent=`GALLERY ${room.number} · GALLERY CHECK`;
    document.getElementById('finale-title').textContent=`${room.title} · 확인 문제`;
    finaleQuizRoom=room;
    if(readFinaleProgress()[room.id])showFinaleCompletion(room);
    else startFinaleQuiz(room);
    finaleModal.showModal();
  }

  function getDisplaySize(work) {
    const w=work.size.w||60,h=work.size.h||90,aspect=w/h;
    // 원작 비율과 작품 간 크기 차이는 유지하되, 높은 전시 벽에서 너무 작아 보이지 않도록
    // 관람용 축척과 최소 전시 크기를 적용한다.
    let dw=w*.0215, dh=h*.0215;
    const minLong=1.35;
    if(Math.max(dw,dh)<minLong){const grow=minLong/Math.max(dw,dh);dw*=grow;dh*=grow;}
    const maxW=work.type==='mural'?4.7:4.35, maxH=3.65;
    const shrink=Math.min(1,maxW/dw,maxH/dh);dw*=shrink;dh*=shrink;
    return {w:Math.max(.32,dw),h:Math.max(.32,dh),aspect};
  }

  function placeholderTexture(title) {
    const c=document.createElement('canvas');c.width=512;c.height=640;const g=c.getContext('2d');
    const grad=g.createLinearGradient(0,0,512,640);grad.addColorStop(0,'#3b3023');grad.addColorStop(1,'#17130f');g.fillStyle=grad;g.fillRect(0,0,512,640);
    g.strokeStyle='#a58140';g.lineWidth=3;g.strokeRect(28,28,456,584);g.fillStyle='#d4bc83';g.textAlign='center';g.font='700 28px serif';
    const words=title.split(' ');words.forEach((x,i)=>g.fillText(x,256,286+i*40));g.font='18px sans-serif';g.fillStyle='#8c795a';g.fillText('이미지를 준비하고 있어요',256,520);
    const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;t.userData={...t.userData,museumPlaceholder:true};return t;
  }

  function fitArtworkPlane(texture,plane,targetAspect) {
    const img=texture.image;if(!img)return;const imageAspect=img.width/img.height;
    texture.wrapS=texture.wrapT=THREE.ClampToEdgeWrapping;texture.repeat.set(1,1);texture.offset.set(0,0);
    plane.scale.set(1,1,1);
    if(imageAspect>targetAspect)plane.scale.y=targetAspect/imageAspect;
    else plane.scale.x=imageAspect/targetAspect;
    texture.encoding=THREE.sRGBEncoding;texture.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());texture.needsUpdate=true;
  }

  function isCurrentRoomLoad(version,roomGallery) {
    return version===roomLoadVersion&&gallery===roomGallery;
  }

  function loadArtTexture(work,material,plane,aspect,version,roomGallery,transparent=false) {
    const cached=textureCache.get(work.image);
    if(cached){if(isCurrentRoomLoad(version,roomGallery)){fitArtworkPlane(cached,plane,aspect);MuseumPerformance.replaceArtwork(material,cached);markLoaded(version,roomGallery);}return;}
    textureLoader.load(work.image,(t)=>{
      if(!isCurrentRoomLoad(version,roomGallery)){t.dispose();return;}
      textureCache.set(work.image,t);
      fitArtworkPlane(t,plane,aspect);MuseumPerformance.replaceArtwork(material,t);markLoaded(version,roomGallery);
    },undefined,()=>{
      if(!isCurrentRoomLoad(version,roomGallery))return;
      MuseumPerformance.replaceArtwork(material,placeholderTexture(work.title));markLoaded(version,roomGallery);
    });
    material.transparent=transparent;
  }

  function markLoaded(version,roomGallery){
    if(!isCurrentRoomLoad(version,roomGallery))return;
    loadDone++;const pct=Math.round(loadDone/loadTotal*100);loadingBar.style.width=pct+'%';loadingText.textContent=pct+'%';
    if(loadDone>=loadTotal)setTimeout(()=>{if(isCurrentRoomLoad(version,roomGallery))loading.classList.add('done');},420);
  }

  function buildShell(room) {
    const width=11.6,length=GALLERY_START-GALLERY_END,height=6.4,centerZ=(GALLERY_START+GALLERY_END)/2;
    const wallCenterY=height/2-.1,wallSurfaceY=height/2+.05;
    mesh([width,.18,length],materials.walnut,[0,-.09,centerZ]);
    mesh([width,.18,length],materials.ceiling,[0,height+.1,centerZ]);
    mesh([.28,height,length],materials.wallInset,[-width/2,wallCenterY,centerZ]);
    mesh([.28,height,length],materials.wallInset,[width/2,wallCenterY,centerZ]);
    mesh([width,height,.3],materials.wallInset,[0,wallCenterY,GALLERY_END]);
    mesh([width,height,.22],materials.wallInset,[0,wallCenterY,7]);

    const leftFabric=new THREE.Mesh(new THREE.PlaneGeometry(length,height-1.05),materials.wall);
    leftFabric.position.set(-width/2+.145,wallSurfaceY,centerZ);leftFabric.rotation.y=Math.PI/2;leftFabric.receiveShadow=true;gallery.add(leftFabric);
    const rightFabric=leftFabric.clone();rightFabric.position.x=width/2-.145;rightFabric.rotation.y=-Math.PI/2;gallery.add(rightFabric);
    const endFabric=new THREE.Mesh(new THREE.PlaneGeometry(width-.55,height-1.05),materials.wall);
    endFabric.position.set(0,wallSurfaceY,GALLERY_END+.16);endFabric.receiveShadow=true;gallery.add(endFabric);

    for(const side of [-1,1]){
      const x=side*(width/2-.13);
      mesh([.1,.2,length],materials.darkBrass,[x,.34,centerZ]);
      mesh([.08,.08,length],materials.brass,[x-side*.025,.47,centerZ]);
      for(let z=4.9;z>GALLERY_END;z-=3.35){
        mesh([.035,height-.95,.055],materials.black,[x-side*.17,wallSurfaceY,z]);
      }
    }

    const coveDepth=1.15;
    const centerCeiling=mesh([width-coveDepth*2,.18,length],materials.ceiling,[0,height-.17,centerZ]);centerCeiling.castShadow=false;
    for(const side of [-1,1]){
      const soffitX=side*(width/2-.52);
      const soffit=mesh([1.04,.34,length],materials.ceiling,[soffitX,height-.49,centerZ]);soffit.castShadow=false;
      const bevelWidth=.82;
      const bevel=mesh([bevelWidth,.16,length],materials.ceiling,[side*(width/2-1.27),height-.32,centerZ]);bevel.rotation.z=side*.38;bevel.castShadow=false;
      const coveX=side*(width/2-1.48);
      const coveY=height-.46;
      const cove=mesh([.075,.055,length],new THREE.MeshBasicMaterial({color:0xffd49b,toneMapped:false}),[coveX,coveY,centerZ]);cove.castShadow=false;
      const washH=2.3,wash=new THREE.Mesh(new THREE.PlaneGeometry(length,washH),glowMaterials.cove);
      wash.position.set(side*(width/2-.15),wallSurfaceY+(height-1.05)/2-washH/2,centerZ);wash.rotation.y=-side*Math.PI/2;gallery.add(wash);
    }
    coveGlow.repeat.set(length/4.8,1);

    const downlightMat=new THREE.MeshStandardMaterial({color:0x24211e,roughness:.62,metalness:.3});
    const lampMat=new THREE.MeshBasicMaterial({color:0xfff1d7,toneMapped:false});
    for(let z=3.8;z>GALLERY_END;z-=4.5){
      for(const x of [-1.45,1.45]){
        const ring=new THREE.Mesh(new THREE.CylinderGeometry(.115,.115,.035,24),downlightMat);ring.position.set(x,height-.295,z);gallery.add(ring);
        const lens=new THREE.Mesh(new THREE.CircleGeometry(.072,20),lampMat);lens.position.set(x,height-.316,z);lens.rotation.x=Math.PI/2;gallery.add(lens);
        const pool=new THREE.Mesh(new THREE.PlaneGeometry(4.4,4.4),glowMaterials.floor);pool.rotation.x=-Math.PI/2;pool.position.set(x,.006,z);gallery.add(pool);
      }
    }
    const ambient=new THREE.HemisphereLight(0xe9dece,0x3a2a20,1.1);gallery.add(ambient);
    const fill=new THREE.DirectionalLight(0xffe2bd,.65);fill.position.set(0,height,centerZ+6);fill.target.position.set(0,0,centerZ);gallery.add(fill,fill.target);
    const entrance=new THREE.Group();gallery.add(entrance);
    const entryHeight=5;
    mesh([2.2,entryHeight,.5],materials.wallInset,[-(width/2-1.1),entryHeight/2,5.7],entrance);mesh([2.2,entryHeight,.5],materials.wallInset,[(width/2-1.1),entryHeight/2,5.7],entrance);mesh([width-4.4,1.15,.5],materials.wallInset,[0,entryHeight+.42,5.7],entrance);
    const sign=makeLabel(room.subtitle,`${room.works.length}점의 작품 · 원작 비율 전시`,4.2);sign.position.set(0,4.55,5.4);gallery.add(sign);
    return {width,length,height};
  }

  const frameMaterialPool=new Map();
  function frameMaterials(index,type) {
    const key=type==='mural'?'mural':index%4;
    if(!frameMaterialPool.has(key)){
      const palettes=[0x6b421f,0x8a5b28,0x3b2718,0x75502d];
      const material=new THREE.MeshStandardMaterial(type==='mural'?{color:0x4d4032,roughness:.75,metalness:.08}:{color:palettes[index%4],roughness:.32,metalness:.28});
      frameMaterialPool.set(key,material);sharedMaterials.add(material);
    }
    return frameMaterialPool.get(key);
  }
  const innerFrameMaterial=new THREE.MeshStandardMaterial({color:0xc3a875,roughness:.35,metalness:.35});sharedMaterials.add(innerFrameMaterial);

  function addSpotlight(x,y,z,side,glow) {
    artLightAnchors.push({position:new THREE.Vector3(x-side*.85,Math.min(5.7,y+1.7),z+.05),target:new THREE.Vector3(x,3.05,z),color:0xffd29a,intensity:62,distance:8.2,angle:Math.PI*.18,penumbra:.48,decay:1.8,glow,glowOpacity:ART_GLOW_OPACITY});
    const stem=mesh([.08,.08,.8],materials.brass,[x-side*.42,Math.min(5.78,y+1.82),z]);stem.rotation.z=side*Math.PI/2;
    const head=mesh([.24,.18,.34],materials.darkBrass,[x-side*.82,Math.min(5.68,y+1.75),z]);head.rotation.z=side*Math.PI/2;
  }

  function addFramedWork(work,index,side,z,width,version,roomGallery) {
    const display=getDisplaySize(work), group=new THREE.Group();
    const x=side*(width/2-.31);group.position.set(x,3.12,z);group.rotation.y=side<0?Math.PI/2:-Math.PI/2;gallery.add(group);
    const border=work.type==='mural'?.11:clamp(Math.min(display.w,display.h)*.09,.1,.2),depth=work.type==='mural'?.08:.2,mat=frameMaterials(index,work.type);
    const back=mesh([display.w+border*2,display.h+border*2,.09],materials.black,[0,0,-.04],group);back.castShadow=true;
    mesh([display.w+border*2,border,depth],mat,[0,(display.h+border)/2,.08],group);mesh([display.w+border*2,border,depth],mat,[0,-(display.h+border)/2,.08],group);
    mesh([border,display.h,depth],mat,[-(display.w+border)/2,0,.08],group);mesh([border,display.h,depth],mat,[(display.w+border)/2,0,.08],group);
    if(work.type!=='mural'){
      const inner=innerFrameMaterial;
      const b=border*.23;mesh([display.w+b*2,b,.08],inner,[0,(display.h+b)/2,.2],group);mesh([display.w+b*2,b,.08],inner,[0,-(display.h+b)/2,.2],group);mesh([b,display.h,.08],inner,[-(display.w+b)/2,0,.2],group);mesh([b,display.h,.08],inner,[(display.w+b)/2,0,.2],group);
    }
    // 작품 이미지는 조명의 입사각 때문에 어두워지지 않도록 자체 색으로 표시한다.
    // 액자와 벽, 바닥에는 기존 스포트라이트가 그대로 반응한다.
    const artMat=new THREE.MeshBasicMaterial({color:0xffffff,map:placeholderTexture(work.title),side:THREE.DoubleSide,toneMapped:false});
    const plane=new THREE.Mesh(new THREE.PlaneGeometry(display.w,display.h),artMat);plane.position.z=.255;plane.userData.work=work;plane.userData.room=rooms[activeRoom];plane.castShadow=true;group.add(plane);clickable.push(plane);loadArtTexture(work,artMat,plane,display.w/display.h,version,roomGallery);
    const label=makeLabel(work.title,work.artist,Math.min(2.3,display.w+border*2));label.position.set(0,-display.h/2-.42,.24);group.add(label);
    const glowMat=glowMaterial(radialGlow,0xffd29a,ART_GLOW_OPACITY);
    const glow=new THREE.Mesh(new THREE.PlaneGeometry(display.w+1.6,display.h+2),glowMat);glow.position.set(0,.3,-.16);group.add(glow);
    addSpotlight(x,3.12+display.h/2,z,side,glowMat);
  }

  function setRoom(index,instant=false) {
    const version=++roomLoadVersion;
    setRoomMusic(index);
    activeRoom=index;clickable.length=0;sculptureObstacles.length=0;nearest=null;prompt.hidden=true;loadDone=0;loadTotal=rooms[index].works.length;
    loading.classList.remove('done');loadingBar.style.width='0';loadingText.textContent='0%';
    finaleSurface=null;resetArtLights();race.roomChanged();
    if(gallery){scene.remove(gallery);MuseumPerformance.disposeRoom(gallery,sharedMaterials,new Set(textureCache.values()));}
    MuseumPerformance.retainRoomTextures(textureCache,rooms[index].works.map(w=>w.image));
    gallery=new THREE.Group();scene.add(gallery);const roomGallery=gallery,shell=buildShell(rooms[index]);
    addFinaleWall(rooms[index],shell);
    void loadMuseumCompletions(rooms[index]);
    rooms[index].works.forEach((w,i)=>addFramedWork(w,i,i%2===0?-1:1,1-Math.floor(i/2)*5.15,shell.width,version,roomGallery));
    MuseumPerformance.batchStaticMeshes(THREE,gallery,clickable);
    playerPosition.set(spawnX,.002,3.75);camera.position.set(spawnX,1.68,6.35);yaw=0;pitch=-.15;avatarHeading=Math.PI;actualSpeed=0;velocity.set(0,0,0);camera.rotation.set(pitch,yaw,0);
    document.getElementById('room-kicker').textContent='GALLERY '+rooms[index].number;
    document.getElementById('room-title').textContent=rooms[index].title;
    document.getElementById('room-count').textContent=rooms[index].works.length+' WORKS';
    for(const entry of remotePeople.values())entry.group.visible=entry.room===rooms[index].id;
    [...roomTabs.children].forEach((b,i)=>{b.classList.toggle('active',i===index);b.setAttribute('aria-current',i===index?'page':'false');});
    if(instant)loading.classList.add('done');
  }

  function buildTabs(){rooms.forEach((room,i)=>{const b=document.createElement('button');b.type='button';b.className='room-tab';b.dataset.sfx='click';b.innerHTML=`<b>${room.number}. ${room.title}</b>`;b.addEventListener('click',()=>{if(i!==activeRoom){race.leave();setRoom(i);}});roomTabs.appendChild(b);});
    const parkTab=document.createElement('button');parkTab.type='button';parkTab.className='room-tab room-tab-park';parkTab.dataset.sfx='click';parkTab.innerHTML='<b>06. 입체·공간</b>';parkTab.addEventListener('click',()=>{location.href='../park/';});roomTabs.appendChild(parkTab);}

  function formatSize(work){if(work.size.label)return work.size.label;const parts=[];if(work.size.h)parts.push(`높이 ${work.size.h}cm`);if(work.size.w)parts.push(`너비 ${work.size.w}cm`);if(work.size.d)parts.push(`깊이 ${work.size.d}cm`);return parts.join(' × ');}
  const movementGuide={
    '르네상스':{title:'르네상스',description:'사람과 자연을 자세히 관찰하고, 원근법과 균형 잡힌 구도로 현실 같은 공간을 만들려 한 미술이에요.'},
    '초기 르네상스':{title:'초기 르네상스',description:'고대 그리스·로마 문화에 다시 관심을 두며, 자연스러운 인물과 이야기 장면을 새롭게 그리기 시작한 시기예요.'},
    '성기 르네상스':{title:'성기 르네상스',description:'이상적인 인체, 안정된 구도, 정확한 원근법을 조화롭게 발전시킨 르네상스의 전성기예요.'},
    '바로크':{title:'바로크',description:'강한 빛과 어둠, 깊은 공간, 극적인 순간을 사용해 그림이 눈앞에서 벌어지는 듯 보이게 한 미술이에요.'},
    '로코코':{title:'로코코',description:'밝은 색과 우아한 곡선, 놀이와 사랑 같은 사적인 장면으로 가볍고 경쾌한 분위기를 만든 18세기 미술이에요.'},
    '사실주의':{title:'사실주의',description:'영웅이나 신화보다 당대 사람들이 일하고 살아가는 현실을 진지하게 바라본 19세기 미술이에요.'},
    '인상주의':{title:'인상주의',description:'사물의 정확한 윤곽보다 빛·날씨·색이 만들어 내는 순간의 첫인상을 빠른 붓질로 포착한 미술이에요.'},
    '후기 인상주의':{title:'후기 인상주의',description:'인상주의 이후, 화가가 본 빛의 순간을 넘어 자신의 감정·색·붓질·화면 구조를 더 강하게 드러낸 여러 흐름을 말해요.'},
    '신인상주의':{title:'신인상주의',description:'색채 이론을 바탕으로 작은 순수 색점을 나란히 놓아, 멀리서 볼 때 눈에서 색이 섞여 보이도록 한 미술이에요.'},
    '상징주의':{title:'상징주의',description:'눈앞의 현실을 그대로 설명하기보다, 꿈·불안·소망처럼 보이지 않는 생각과 감정을 상징으로 나타낸 미술이에요.'},
    '입체주의':{title:'입체주의',description:'하나의 대상을 여러 방향에서 본 모습으로 나누고 다시 조합해, 한 화면에 시간과 시점을 함께 담으려 한 미술이에요.'},
    '원시 입체주의':{title:'원시 입체주의',description:'입체주의가 막 시작되던 시기로, 인물과 공간을 날카로운 면으로 단순화하며 기존 원근법을 흔들기 시작했어요.'},
    '야수파':{title:'야수파',description:'자연의 실제 색보다 강렬하고 단순한 색면, 대담한 윤곽선으로 감정과 에너지를 표현한 미술이에요.'},
    '초현실주의':{title:'초현실주의',description:'꿈과 무의식에서 떠오르는 낯선 장면을 사실적으로 그려, 우리가 익숙하다고 믿는 현실을 새롭게 보게 한 미술이에요.'},
    '신조형주의':{title:'신조형주의',description:'수직·수평선과 기본색처럼 아주 제한된 요소로, 누구에게나 통하는 균형과 질서를 찾으려 한 추상 미술이에요.'},
    '절대주의':{title:'절대주의',description:'현실의 사물을 재현하지 않고 단순한 도형과 색만으로 순수한 느낌을 표현하려 한 추상 미술이에요.'},
    '빈 분리파':{title:'빈 분리파',description:'19세기 말 빈에서 기존 미술 제도에서 벗어나, 회화·장식·디자인의 경계를 넘는 새 아름다움을 찾은 예술가 모임이에요.'},
    '매너리즘':{title:'매너리즘',description:'르네상스의 안정된 비례에서 벗어나 길어진 인체, 복잡한 구성, 낯선 아름다움으로 긴장감을 만든 16세기 미술이에요.'},
    '헬레니즘':{title:'헬레니즘',description:'고대 그리스 문화가 넓게 퍼진 시대의 미술로, 인체의 움직임·감정·공간감을 더 생생하게 표현했어요.'},
    '조선 후기':{title:'조선 후기 미술',description:'사람들의 일상, 실제 우리 산천, 생활 속 바람을 가까이 관찰하며 다양한 그림으로 펼쳐 낸 시기예요.'},
    '조선 민화':{title:'조선 민화',description:'생활 가까이에서 그려진 그림으로, 복·장수·좋은 소식 같은 바람을 친근한 상징에 담았어요.'},
    '한국 근대미술':{title:'한국 근대미술',description:'전통과 새로운 시대의 표현을 함께 고민하며, 개인의 감정과 삶을 자신만의 선·색·형태로 드러낸 미술이에요.'},
    '근대 회화':{title:'근대 회화',description:'19세기 후반 화가들이 전통적인 역사화와 사실 묘사에서 벗어나, 지금 살아가는 사람과 새로운 화면 방식을 탐색하며 연 미술이에요.'},
    '조선 시대':{title:'조선 시대 회화',description:'먹과 채색, 세밀한 관찰을 바탕으로 자연·사람·생활의 의미를 담아낸 우리 옛 그림의 흐름이에요.'},
    '소박파':{title:'소박파',description:'전문 미술 교육의 규칙보다 자신만의 선명한 형태와 풍부한 상상력을 따라 독특한 세계를 만든 미술이에요.'},
    '조선 전기':{title:'조선 전기 산수화',description:'산과 물을 따라 시선이 이동하도록 화면을 펼쳐, 현실의 경치와 이상적인 세계를 함께 보여 준 그림이에요.'},
    '기하학적 추상':{title:'기하학적 추상',description:'사물을 그대로 그리지 않고 원·선·삼각형 같은 도형과 색의 관계로 화면의 리듬과 균형을 만든 추상 미술이에요.'},
    '근대 조각':{title:'근대 조각',description:'고전 조각의 매끈한 이상미에서 벗어나, 거친 표면과 긴장된 몸을 통해 인물의 에너지와 내면을 드러낸 조각이에요.'},
    '근대 미술':{title:'근대 미술',description:'19세기 말부터 화가들이 현실을 그대로 재현하는 방식에서 벗어나, 개인의 시선과 새로운 형태를 실험한 미술이에요.'}
  };
  function getMovement(work){return (work.tags||[]).map(tag=>[tag,movementGuide[tag]]).find(([,guide])=>guide);}
  function getExtendedGuide(work){
    if(work.id==='p09')return{
      background:'밀레가 이 그림을 그린 19세기 프랑스에는 농사를 지어 살아가는 사람이 아주 많았어요. 당시 미술에서는 왕이나 영웅을 크게 그리는 일이 흔했지만, 밀레는 평범한 농민의 고된 노동도 중요한 이야기라고 생각했어요. 이런 태도를 사실주의라고 해요.'
    };
    return{
      background:work.styleNote||`${work.year} 무렵, ${work.artist}는 자신만의 눈으로 사람과 세상을 관찰해 이 작품을 만들었어요. 작품이 만들어진 시대와 화가의 생각을 함께 떠올리며 감상해 보세요.`
    };
  }
  function showWork(work,room){
    window.ClassGameSfx?.play('card');
    document.getElementById('modal-image').src=work.image;document.getElementById('modal-image').alt=work.title;
    document.getElementById('modal-room').textContent=`GALLERY ${room.number} · ${room.title}`;document.getElementById('modal-title').textContent=work.title;
    const englishTitle=document.getElementById('modal-title-en');englishTitle.textContent=work.englishTitle||'';englishTitle.hidden=!work.englishTitle;
    const tags=document.getElementById('modal-tags');tags.replaceChildren(...(work.tags||[]).map(label=>{const tag=document.createElement('span');tag.textContent=label;return tag;}));tags.hidden=!work.tags?.length;
    document.getElementById('modal-artist').textContent=work.artist;document.getElementById('modal-year').textContent=work.year;document.getElementById('modal-medium').textContent=work.medium;
    const extendedGuide=getExtendedGuide(work);
    document.getElementById('modal-size').textContent=formatSize(work);document.getElementById('modal-docent').textContent=work.docent;document.getElementById('modal-background').textContent=extendedGuide.background;document.getElementById('modal-point').textContent=work.point;
    const movement=getMovement(work),movementCard=document.getElementById('movement-card');
    movementCard.hidden=!movement;
    if(movement){const [tag,guide]=movement;document.getElementById('movement-title').textContent=guide.title;document.getElementById('movement-description').textContent=guide.description;document.getElementById('movement-connection').textContent=`이 작품에서는 ${tag}의 특징을 찾아볼 수 있어요.`;}
    modal.showModal();keysClear();
  }

  function keysClear(){Object.keys(keys).forEach(k=>keys[k]=false);velocity.set(0,0,0);actualSpeed=0;}

  function updateMovement(dt){
    actualSpeed=0;
    if(modal.open||finaleModal.open||race.blocksMovement()){camera.position.y=1.68+race.floorAt(playerPosition.x,playerPosition.z);return;}
    let f=(keys.KeyW||keys.ArrowUp?1:0)-(keys.KeyS||keys.ArrowDown?1:0),s=(keys.KeyD||keys.ArrowRight?1:0)-(keys.KeyA||keys.ArrowLeft?1:0);
    tmpDirection.set(-Math.sin(yaw),0,-Math.cos(yaw));tmpRight.set(Math.cos(yaw),0,-Math.sin(yaw));
    wish.set(0,0,0).addScaledVector(tmpDirection,f).addScaledVector(tmpRight,s);if(wish.lengthSq()>0)wish.normalize();
    const accel=28,maxSpeed=(keys.ShiftLeft||keys.ShiftRight)?7.5:4.8;velocity.addScaledVector(wish,accel*dt);velocity.multiplyScalar(Math.pow(.03,dt));if(velocity.length()>maxSpeed)velocity.setLength(maxSpeed);
    const oldX=playerPosition.x,oldZ=playerPosition.z;playerPosition.addScaledVector(velocity,dt);const half=4.85;
    playerPosition.x=clamp(playerPosition.x,-half,half);playerPosition.z=clamp(playerPosition.z,GALLERY_END+1.4,6.5);
    MuseumFollowCamera.constrainPlayer(playerPosition);
    for(const o of sculptureObstacles){const dx=playerPosition.x-o.x,dz=playerPosition.z-o.z,dist=Math.hypot(dx,dz);if(dist<o.r){if(dist<.001){playerPosition.x=oldX;playerPosition.z=oldZ;}else{playerPosition.x=o.x+dx/dist*o.r;playerPosition.z=o.z+dz/dist*o.r;}}}
    const movedX=playerPosition.x-oldX,movedZ=playerPosition.z-oldZ;
    actualSpeed=Math.hypot(movedX,movedZ)/Math.max(dt,.001);
    if(actualSpeed>.03)avatarHeading=Math.atan2(movedX,movedZ);
    camera.position.y=1.68+race.floorAt(playerPosition.x,playerPosition.z)+Math.sin(performance.now()*.009)*Math.min(velocity.length()*.012,.025);camera.rotation.set(pitch,yaw,0);
    progressEl.style.width=clamp((6.5-playerPosition.z)/(6.5-(GALLERY_END+1.4))*100,0,100)+'%';
  }

  function updateFocus(){
    if(race.hidesFocus()){nearest=null;prompt.hidden=true;return;}
    raycaster.setFromCamera(centerPointer,camera);const hits=raycaster.intersectObjects(clickable,false);const hit=hits.find(h=>h.distance<8.5);
    nearest=hit?hit.object:null;prompt.hidden=!nearest;
    if(nearest){
      const finaleRoom=nearest.userData.finaleRoom;
      promptKicker.textContent=finaleRoom?'전시실 확인':'작품 가까이';
      promptTitle.textContent=finaleRoom?`${finaleRoom.title} · 확인 문제`:nearest.userData.work.title;
      promptAction.textContent=finaleRoom?'클릭해서 확인 문제 풀기':'클릭해서 감상하기';
    }

  }

  function updateSelfAvatar(){
    const follow=MuseumFollowCamera.position(playerPosition,yaw,GALLERY_END);
    camera.position.x=follow.x;
    camera.position.z=follow.z;
    selfAvatar.position.copy(playerPosition);
    selfAvatar.position.y+=race.floorAt(playerPosition.x,playerPosition.z);
    selfAvatar.rotation.y=avatarHeading;
    selfActor.moving=actualSpeed>.03;selfActor.speed=actualSpeed;
    selfAvatar.visible=follow.distance>.85&&!avatarReview&&!nearest&&!modal.open&&!finaleModal.open&&!race.modal.open;
  }

  function animate(){
    requestAnimationFrame(animate);
    const now=performance.now(),gap=now-lastLoopTime;lastLoopTime=now;
    const modalOpen=modal.open||finaleModal.open||race.modal.open,hidden=document.hidden;
    const active=raceActive||dragging||velocity.lengthSq()>.0009||Object.values(keys).some(Boolean)||[...remotePeople.values()].some(p=>p.room===rooms[activeRoom].id&&p.moving&&now-p.received<700);
    const loadingRoom=!loading.classList.contains('done');
    const scale=resolutionBudget.sample(gap,!hidden&&!modalOpen&&active&&!loadingRoom);
    if(scale!==resolutionScale){resolutionScale=scale;renderer.setPixelRatio(Math.min(devicePixelRatio,MAX_PIXEL_RATIO)*scale);}
    sendPresence();
    if(!framePolicy.draw(now,{hidden,modal:modalOpen,active,avatars:selfActor.state==='ready'||[...remotePeople.values()].some(p=>p.group.visible)||!!avatarReview,loading:loadingRoom}))return;
    const frameStart=avatarReview?performance.now():0,dt=Math.min(clock.getDelta(),.05);
    updateMovement(dt);updateSelfAvatar();updateArtLights(dt);updateFocus();raceActive=race.update(dt);updateRemoteAvatars(dt);assignedAvatars.update(dt);avatarReview?.update(dt);sendPresence();
    const ceremonyShot=race.ceremonyCamera(camera.aspect);if(ceremonyShot){camera.position.set(ceremonyShot.x,ceremonyShot.y,ceremonyShot.z);camera.lookAt(ceremonyShot.tx,ceremonyShot.ty,ceremonyShot.tz);}
    renderer.render(scene,camera);avatarReview?.sampleFrame(frameStart);
  }

  addEventListener('keydown',e=>{if(['ArrowUp','ArrowDown','ArrowRight','ArrowLeft','Space'].includes(e.code))e.preventDefault();keys[e.code]=true;if(e.code==='Escape'){if(finaleModal.open){window.ClassGameSfx?.play('click');finaleModal.close();}else if(modal.open){window.ClassGameSfx?.play('click');modal.close();}}if(e.code==='Enter'&&nearest&&!modal.open&&!finaleModal.open&&!race.modal.open){if(nearest.userData.finaleRoom)showFinale(nearest.userData.finaleRoom);else showWork(nearest.userData.work,nearest.userData.room);}});
  addEventListener('keyup',e=>{keys[e.code]=false;});
  addEventListener('blur',keysClear);
  document.addEventListener('visibilitychange',()=>{if(document.hidden){keysClear();sendPresence();}});
  canvas.addEventListener('pointerdown',e=>{dragging=true;pointerDown={x:e.clientX,y:e.clientY,lastX:e.clientX,lastY:e.clientY,time:performance.now()};canvas.classList.add('dragging');canvas.setPointerCapture(e.pointerId);});
  canvas.addEventListener('pointermove',e=>{if(!dragging||!pointerDown)return;const dx=e.clientX-pointerDown.lastX,dy=e.clientY-pointerDown.lastY;pointerDown.lastX=e.clientX;pointerDown.lastY=e.clientY;yaw-=dx*.0032;pitch=clamp(pitch-dy*.0025,-1.15,1.15);});
  canvas.addEventListener('pointerup',e=>{dragging=false;canvas.classList.remove('dragging');if(!pointerDown)return;const moved=Math.hypot(e.clientX-pointerDown.x,e.clientY-pointerDown.y);if(moved<8&&performance.now()-pointerDown.time<550){pointer.x=e.clientX/innerWidth*2-1;pointer.y=-(e.clientY/innerHeight)*2+1;raycaster.setFromCamera(pointer,camera);const hit=raycaster.intersectObjects(clickable,false).find(x=>x.distance<10);if(hit){if(hit.object.userData.finaleRoom)showFinale(hit.object.userData.finaleRoom);else showWork(hit.object.userData.work,hit.object.userData.room);}}pointerDown=null;});
  canvas.addEventListener('pointercancel',()=>{dragging=false;pointerDown=null;canvas.classList.remove('dragging');});
  addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight,false);renderer.setPixelRatio(Math.min(devicePixelRatio,MAX_PIXEL_RATIO)*resolutionScale);framePolicy.invalidate();});
  document.getElementById('modal-close').addEventListener('click',()=>modal.close());document.getElementById('finale-close').addEventListener('click',()=>finaleModal.close());
  finaleNext.addEventListener('click',()=>{finaleQuizIndex++;const total=finaleQuizQuestions.length;if(finaleQuizIndex>=total){if(finaleQuizCorrect===total)showFinaleCompletion(finaleQuizRoom,true);else showFinaleRetry(finaleQuizRoom);}else renderFinaleQuestion();});
  document.getElementById('finale-again').addEventListener('click',()=>startFinaleQuiz(finaleQuizRoom));
  for(const d of [modal,finaleModal])d.addEventListener('click',e=>{if(e.target===d){window.ClassGameSfx?.play('click');d.close();}});
  document.querySelectorAll('.touch-controls button').forEach(b=>{const k=b.dataset.key;b.addEventListener('pointerdown',e=>{e.preventDefault();keys[k]=true;});b.addEventListener('pointerup',()=>keys[k]=false);b.addEventListener('pointercancel',()=>keys[k]=false);});

  buildTabs();setRoom(0);if(!avatarReview)connectClassPresence();animate();
  setInterval(()=>{if(document.hidden)sendPresence();},3000);
  setInterval(()=>{if(document.visibilityState==='visible')void loadMuseumCompletions(rooms[activeRoom]);},30000);
})();
