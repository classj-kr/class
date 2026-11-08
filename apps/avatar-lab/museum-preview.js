"use strict";

// Opt-in review inside the real gallery. It never joins the presence service.
// Normal museum visits do not fetch or instantiate any prototype models.
window.createMuseumAvatarReview = function ({THREE,scene,renderer}) {
  const entries=[['animal-cat','고양이'],['food-ramen','라멘'],['food-donut','도넛'],['fruit-banana','바나나'],['vehicle-helicopter','헬리콥터'],['object-umbrella','우산']];
  const panel=document.createElement('section');panel.id='avatar-review';panel.setAttribute('aria-label','아바타 미술관 시험');
  panel.style.cssText='position:fixed;z-index:30;left:50%;bottom:22px;transform:translateX(-50%);width:min(590px,calc(100% - 32px));padding:14px 18px;border:1px solid #a59066;border-radius:14px;background:rgba(24,22,19,.96);color:#f3e8cf;font:12px/1.6 sans-serif;box-sizing:border-box';
  panel.innerHTML='<div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap"><strong>아바타 · 미술관 시험</strong><label>보기 <select id="avatar-review-choice" aria-label="미술관에서 볼 아바타"><option value="all">여섯 친구 함께</option></select></label><button id="avatar-review-toggle" type="button" aria-pressed="true">걷기 멈추기</button><a href="/apps/avatar-lab/collection.html" style="color:#dfc68b">원본과 비교</a></div><p id="avatar-review-status" role="status" style="margin:6px 0 0">모델을 불러오는 중…</p><small id="avatar-review-performance">전시실에서 움직임을 확인하는 시제품입니다.</small>';
  document.body.append(panel);
  const select=panel.querySelector('select'),toggle=panel.querySelector('button'),status=panel.querySelector('[role=status]'),stats=panel.querySelector('small');
  toggle.style.cssText='border:0;border-radius:6px;background:#d6bc7a;color:#241d12;padding:5px 9px;font:inherit;cursor:pointer';
  select.style.cssText='border:1px solid #8b7952;border-radius:5px;background:#fff8e7;color:#241d12;padding:4px;font:inherit';
  panel.addEventListener('keydown',event=>event.stopPropagation());
  for(const [key,name] of entries){const option=document.createElement('option');option.value=key;option.textContent=name;select.append(option);}
  const layer=new THREE.Group();layer.name='AvatarReview';scene.add(layer);
  const characters=[];let active=!matchMedia('(prefers-reduced-motion:reduce)').matches,elapsed=0,frames=0,lastSample=performance.now(),ready=false;
  function sync(){toggle.textContent=active?'걷기 멈추기':'걷기 시작';toggle.setAttribute('aria-pressed',String(active));panel.dataset.walking=String(active);}
  toggle.addEventListener('click',()=>{active=!active;sync();});sync();
  select.addEventListener('change',async()=>{elapsed=0;characters.forEach(c=>c.mixer.setTime(0));if(select.value!=='all'&&!characters.some(c=>c.key===select.value)){status.textContent='선택한 친구를 불러오는 중…';try{await loadCharacter(select.value,select.selectedOptions[0].textContent,0);status.textContent='이동과 방향 전환 준비됨';}catch(error){status.textContent='모델을 불러오지 못했습니다.';}}place();});
  const loader=new THREE.GLTFLoader();
  function loadCharacter(key,name,index){for(let i=characters.length-1;i>=0;i--){const c=characters[i];if(entries.some(e=>e[0]===c.key))continue;c.mixer.stopAllAction();c.mixer.uncacheRoot(c.character);layer.remove(c.character);c.character.traverse(o=>{if(o.isMesh){o.geometry.dispose();o.material.map?.dispose();o.material.dispose();}});characters.splice(i,1);}return new Promise((resolve,reject)=>{
    loader.load('/apps/avatar-lab/models/'+key+'.glb',gltf=>{
      const character=gltf.scene;character.scale.setScalar(.65);layer.add(character);
      character.traverse(o=>{if(o.isMesh){o.castShadow=false;o.receiveShadow=false;if(o.material.isMeshBasicMaterial)o.material.toneMapped=false;}});
      const mixer=new THREE.AnimationMixer(character),clip=gltf.animations.find(c=>c.name==='Walk');if(!clip){reject(new Error(name+' 걷기 없음'));return;}
      let stride=.36;character.traverse(o=>{if(o.userData.walkStride)stride=o.userData.walkStride;});
      mixer.clipAction(clip).play();mixer.update(0);characters.push({key,name,index,character,mixer,stride,duration:clip.duration});
      panel.dataset.loaded=String(characters.length);resolve();
    },undefined,reject);
  });}
  fetch('/apps/avatar-lab/collection-index.json').then(r=>r.json()).then(data=>{for(const item of data.avatars){if(!item.model||item.status!=='prototype'||entries.some(e=>e[0]===item.id))continue;const option=document.createElement('option');option.value=item.id;option.textContent=item.name;select.append(option);}panel.dataset.available=String(data.avatars.filter(a=>a.model&&a.status==='prototype').length);}).catch(()=>{});
  Promise.all(entries.map(([key,name],index)=>loadCharacter(key,name,index))).then(()=>{ready=true;panel.dataset.ready='true';status.textContent='기존 시제품 6종 · 전체 외형 검수는 완료 전입니다.';place();}).catch(()=>{panel.dataset.ready='error';status.textContent='일부 아바타를 불러오지 못했습니다. 새로고침해 주세요.';});
  function place(){
    for(const c of characters){
      const chosen=(select.value==='all'&&entries.some(e=>e[0]===c.key))||select.value===c.key;c.character.visible=chosen;
      const a=elapsed*.40+c.index*.20;
      const cx=select.value==='all'?(c.index-2.5)*1.35:0,cz=select.value==='all'?-.50-Math.abs(c.index-2.5)*.18:2.8;
      const rx=select.value==='all'?.12:.50,rz=select.value==='all'?.80:.65,scale=select.value==='all'?.55:.65;
      const vx=Math.cos(a)*rx*.40,vz=-Math.sin(a)*rz*.40;
      c.character.scale.setScalar(scale);
      c.character.position.set(cx+Math.sin(a)*rx,.002,cz+(Math.cos(a)-1)*rz);
      c.character.rotation.y=active?Math.atan2(vx,vz):0;
      c.mixer.timeScale=c.duration*Math.hypot(vx,vz)/(scale*c.stride);
    }
    panel.dataset.walkTime=elapsed.toFixed(3);panel.dataset.selection=select.value;
  }
  return{update(dt){
    if(ready&&active)elapsed+=dt;place();if(ready&&active)characters.forEach(c=>{if(c.character.visible)c.mixer.update(dt);});
    const now=performance.now();frames++;
    if(now-lastSample>=2000){const fps=Math.round(frames*1000/(now-lastSample));stats.textContent='이 화면 기준 '+fps+' FPS · '+renderer.info.render.triangles.toLocaleString()+'개 삼각형 · 학급 전체 접속 시험은 별도';panel.dataset.fps=String(fps);panel.dataset.triangles=String(renderer.info.render.triangles);frames=0;lastSample=now;}
  }};
};
