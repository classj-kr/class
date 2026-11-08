"use strict";

// This opt-in local review uses the real museum renderer without joining a class.
window.createMuseumAvatarReview = function ({THREE,scene,renderer}) {
  const samples=['animal-cat','food-ramen','food-donut','fruit-banana','vehicle-helicopter','object-umbrella'];
  const panel=document.createElement('section');panel.id='avatar-review';panel.setAttribute('aria-label','아바타 미술관 시험');
  panel.style.cssText='position:fixed;z-index:30;left:50%;top:76px;transform:translateX(-50%);width:min(780px,calc(100% - 32px));padding:12px 16px;border:1px solid #a59066;border-radius:14px;background:rgba(24,22,19,.96);color:#f3e8cf;font:12px/1.6 sans-serif;box-sizing:border-box';
  panel.innerHTML=`<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap"><strong>아바타 · 미술관 시험</strong>
    <label>보기 <select id="avatar-review-choice" aria-label="미술관에서 볼 아바타"><option value="all">대표 6종 함께</option><option value="batch">전체 152종 · 4종씩 검수</option></select></label>
    <button id="avatar-review-previous" type="button">이전</button><span id="avatar-review-page"></span><button id="avatar-review-next" type="button">다음</button>
    <button id="avatar-review-toggle" type="button">이동 멈추기</button>
    <label>방향 <select id="avatar-review-view"><option value="motion">이동 방향</option><option value="0">앞</option><option value="-1.5707963267948966">왼쪽</option><option value="1.5707963267948966">오른쪽</option><option value="3.141592653589793">뒤</option></select></label>
    <label>동작 <select id="avatar-review-phase"><option value="live">재생</option><option value="0">0%</option><option value="0.25">25%</option><option value="0.5">50%</option><option value="0.75">75%</option></select></label>
    <a href="/apps/avatar-lab/collection-review.html" style="color:#dfc68b">원본과 비교</a></div>
    <p id="avatar-review-status" role="status" style="margin:6px 0 0">모델을 불러오는 중…</p><small id="avatar-review-performance">전시실에서 움직임을 확인하는 검수 화면입니다.</small>`;
  document.body.append(panel);
  const select=panel.querySelector('#avatar-review-choice'),toggle=panel.querySelector('#avatar-review-toggle'),status=panel.querySelector('[role=status]'),stats=panel.querySelector('small'),view=panel.querySelector('#avatar-review-view'),phase=panel.querySelector('#avatar-review-phase'),prev=panel.querySelector('#avatar-review-previous'),next=panel.querySelector('#avatar-review-next'),pageLabel=panel.querySelector('#avatar-review-page');
  panel.querySelectorAll('button,select').forEach(el=>el.style.cssText='border:1px solid #8b7952;border-radius:5px;background:#fff8e7;color:#241d12;padding:4px 6px;font:inherit');
  panel.addEventListener('keydown',event=>event.stopPropagation());
  const layer=new THREE.Group();layer.name='AvatarReview';scene.add(layer);
  const loader=new THREE.GLTFLoader();let entries=[],characters=[],page=0,request=0,ready=false,elapsed=0,frames=0,lastSample=performance.now(),active=!matchMedia('(prefers-reduced-motion:reduce)').matches;
  function dispose(character){
    const geometries=new Set(),materials=new Set(),textures=new Set();
    character.traverse(o=>{if(!o.isMesh)return;geometries.add(o.geometry);for(const m of Array.isArray(o.material)?o.material:[o.material]){materials.add(m);for(const value of Object.values(m))if(value?.isTexture)textures.add(value);}});
    geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());
  }
  function sync(){
    toggle.textContent=active?'이동 멈추기':'이동 시작';toggle.setAttribute('aria-pressed',String(active));panel.dataset.walking=String(active);
    const batch=select.value==='batch',pages=Math.ceil(entries.length/4);prev.hidden=next.hidden=pageLabel.hidden=!batch;prev.disabled=page===0;next.disabled=page>=pages-1;pageLabel.textContent=(page+1)+' / '+pages;
  }
  function setPhase(){
    if(phase.value==='live')return;
    for(const c of characters){c.mixer.timeScale=1;c.mixer.setTime(c.duration*Number(phase.value));}
  }
  async function show(){
    const token=++request;ready=false;panel.dataset.ready='false';elapsed=0;sync();status.textContent='모델을 불러오는 중…';
    const batch=select.value==='all'?entries.filter(e=>samples.includes(e.id)):select.value==='batch'?entries.slice(page*4,page*4+4):entries.filter(e=>e.id===select.value);
    const results=await Promise.allSettled(batch.map(item=>new Promise((resolve,reject)=>loader.load('/apps/avatar-lab/'+item.model+'?v='+item.revision,gltf=>resolve({item,gltf}),undefined,reject))));
    if(token!==request){for(const r of results)if(r.status==='fulfilled')dispose(r.value.gltf.scene);return;}
    if(!batch.length||results.some(r=>r.status==='rejected'||!r.value.gltf.animations.some(c=>c.name==='Walk'))){
      for(const r of results)if(r.status==='fulfilled')dispose(r.value.gltf.scene);
      panel.dataset.ready='error';status.textContent='모델 또는 이동 동작을 불러오지 못했습니다.';return;
    }
    for(const c of characters){c.mixer.stopAllAction();c.mixer.uncacheRoot(c.character);layer.remove(c.character);dispose(c.character);}
    characters=results.map((result,index)=>{
      const {item,gltf}=result.value,character=gltf.scene,mixer=new THREE.AnimationMixer(character),clip=gltf.animations.find(c=>c.name==='Walk');let stride=.36;
      character.traverse(o=>{if(o.userData.walkStride)stride=o.userData.walkStride;if(o.isMesh){o.castShadow=false;o.receiveShadow=false;for(const m of Array.isArray(o.material)?o.material:[o.material])if(m.isMeshBasicMaterial)m.toneMapped=false;}});
      mixer.clipAction(clip).play();const effects=gltf.animations.find(c=>c.name==='CharacterEffects');if(effects)mixer.clipAction(effects).play();mixer.update(0);layer.add(character);
      return {item,index,character,mixer,stride,duration:clip.duration};
    });
    ready=true;setPhase();place();panel.dataset.ready='true';panel.dataset.loaded=String(characters.length);panel.dataset.models=batch.map(e=>e.id).join(',');panel.dataset.revisions=batch.map(e=>e.revision).join(',');
    status.textContent=batch.map(e=>e.name).join(' · ')+' — 이동·방향 검수 중, 완료 판정 전';
  }
  function place(){
    for(const c of characters){
      const multiple=characters.length>1,a=elapsed*.40+c.index*.20,cx=multiple?(c.index-(characters.length-1)/2)*1.45:0,cz=multiple?-.20:2.8,rx=multiple?.12:.50,rz=multiple?.55:.65,scale=multiple?.55:.65;
      const vx=Math.cos(a)*rx*.40,vz=-Math.sin(a)*rz*.40;c.character.scale.setScalar(scale);
      c.character.position.set(cx+Math.sin(a)*rx,.002,cz+(Math.cos(a)-1)*rz);
      c.character.rotation.y=view.value==='motion'?(active?Math.atan2(vx,vz):0):Number(view.value);
      c.mixer.timeScale=c.duration*Math.hypot(vx,vz)/(scale*c.stride);
    }
    panel.dataset.walkTime=elapsed.toFixed(3);panel.dataset.selection=select.value;panel.dataset.view=view.value;panel.dataset.phase=phase.value;
  }
  select.addEventListener('change',()=>{page=0;show();});prev.addEventListener('click',()=>{page--;show();});next.addEventListener('click',()=>{page++;show();});
  toggle.addEventListener('click',()=>{active=!active;phase.value='live';sync();place();});
  phase.addEventListener('change',()=>{active=phase.value==='live';setPhase();sync();place();});view.addEventListener('change',place);sync();
  fetch('/apps/avatar-lab/collection-index.json').then(r=>{if(!r.ok)throw new Error('index');return r.json();}).then(data=>{
    entries=data.avatars.filter(e=>e.model);for(const item of entries){const option=document.createElement('option');option.value=item.id;option.textContent=item.name;select.append(option);}panel.dataset.available=String(entries.length);
    const params=new URLSearchParams(location.search),key=params.get('avatar');if(entries.some(e=>e.id===key))select.value=key;
    if(params.has('avatarBatch')){select.value='batch';page=Math.max(0,Math.min(Math.ceil(entries.length/4)-1,(Number(params.get('avatarBatch'))||1)-1));}show();
  }).catch(()=>{panel.dataset.ready='error';status.textContent='아바타 목록을 불러오지 못했습니다.';});
  return {update(dt){
    if(ready&&active){elapsed+=dt;for(const c of characters)c.mixer.update(dt);}place();
    const now=performance.now();frames++;if(now-lastSample>=2000){const fps=Math.round(frames*1000/(now-lastSample));stats.textContent='이 화면 기준 '+fps+' FPS · '+renderer.info.render.triangles.toLocaleString()+'개 삼각형 · 학급 전체 접속 시험은 별도';panel.dataset.fps=String(fps);panel.dataset.triangles=String(renderer.info.render.triangles);frames=0;lastSample=now;}
  }};
};
