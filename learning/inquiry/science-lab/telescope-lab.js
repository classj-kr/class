/* One instrument shared by the middle-school and elective-course routes. */
(() => {
 'use strict';
 const api=window.scienceTelescope,$=id=>document.getElementById(id),school=window.scienceAppContext?.school||'middle';
 if(!$('scopeScene'))return;
 let state=api.initial(school);
 const t=(x,y,value,size=15,color='#dce7f2')=>`<text x="${x}" y="${y}" fill="${color}" text-anchor="middle" font-size="${size}">${value}</text>`;
 const line=(d,color,width=2,extra='')=>`<path d="${d}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" ${extra}/>`;
 function object(target,r,detail=false,prefix='field'){
  if(target==='moon')return `<circle r="${r}" fill="#182632"/><path d="M0 ${-r}A${r} ${r} 0 0 1 0 ${r}Z" fill="#dbded6"/>`+(detail?[[.26,-.54,.12],[.63,-.26,.16],[.2,.34,.16],[.65,.39,.08],[.1,-.15,.05]].map(([x,y,k])=>`<circle cx="${x*r}" cy="${y*r}" r="${r*k}" fill="#9da5a4" stroke="#f5f1de" stroke-width="${r*.015}"/>`).join(''):'');
  if(target==='venus')return `<circle r="${r}" fill="#ebdfba"/><circle cx="${r*.57}" cy="${-r*.1}" r="${r*.97}" fill="#0a1726"/>`;
  if(target==='jupiter'){
   let v=`<defs><clipPath id="jupiter-${prefix}"><circle r="${r}"/></clipPath></defs><circle r="${r}" fill="#c7bbaa"/>`;
   if(detail)v+=`<g clip-path="url(#jupiter-${prefix})">`+[-.55,-.2,.23,.55].map((n,i)=>`<path d="M${-r} ${r*n}Q0 ${r*(n+.2)} ${r} ${r*n}" fill="none" stroke="${i%2?'#8e6d5e':'#e2d4ba'}" stroke-width="${r*.2}"/>`).join('')+`<ellipse cx="${r*.43}" cy="${r*.29}" rx="${r*.24}" ry="${r*.1}" fill="#ac765a"/></g>`;
   if(detail)for(const [dx,dy]of [[-1.8,.1],[-1.4,.05],[1.4,-.06],[1.8,-.1]])v+=`<circle cx="${r*dx}" cy="${r*dy}" r="${r*.07}" fill="#d8dee4"/>`;
   return v;
  }
  return `<ellipse rx="${r*1.9}" ry="${r*.58}" transform="rotate(-22)" fill="none" stroke="#bcb29a" stroke-width="${r*.25}"/><circle r="${r}" fill="#d5c5a4"/><path d="M${-r*.8} ${r*.25}Q0 ${r*.5} ${r*.8} ${r*.25}" fill="none" stroke="#b6a180" stroke-width="${r*.2}"/><path d="M${-r*1.83} ${r*.38}Q0 ${r*1.1} ${r*1.83} ${-r*.87}" fill="none" stroke="#d5c8a9" stroke-width="${r*.23}"/>`;
 }
 function apparatus(m){
  const parts=state.parts,has=p=>parts.includes(p);let s=`<svg viewBox="0 0 360 370" role="img" aria-label="삼각대, 가대, 균형추, 경통, 파인더를 조립하는 모습"><defs><linearGradient id="scope-metal"><stop stop-color="#a1b3c1"/><stop offset=".4" stop-color="#f5f9fb"/><stop offset="1" stop-color="#889dab"/></linearGradient><linearGradient id="scope-tube"><stop stop-color="#f7f6ef"/><stop offset=".55" stop-color="#e1e8e9"/><stop offset="1" stop-color="#bac9cd"/></linearGradient><radialGradient id="scope-lens"><stop stop-color="#61909b"/><stop offset=".75" stop-color="#2b4e62"/><stop offset="1" stop-color="#152e43"/></radialGradient></defs><ellipse cx="180" cy="343" rx="137" ry="15" fill="#b9cbd6" opacity=".3"/>`;
  if(has('tripod'))s+=line('M180 211L78 337 M180 211L278 337 M180 211V338','#8197a7',11)+line('M180 215L82 330 M180 215L274 330 M180 215V330','#c4d3dc',5)+line('M129 281H226','#94a9b8',4)+`<ellipse cx="180" cy="217" rx="26" ry="8" fill="#567080"/>`;
  if(has('mount')){
   const weight=state.balance*9;
   s+=line('M183 213L203 170L165 136','#7e95a6',16)+`<circle cx="199" cy="174" r="19" fill="url(#scope-metal)" stroke="#526d82" stroke-width="3"/><circle cx="199" cy="174" r="7" fill="#3f5669"/>`+line('M170 139L115 234','#7e95a6',7)+`<g transform="translate(${125-weight*.5} ${211+weight*.85}) rotate(30)"><rect x="-28" y="-8" width="56" height="18" rx="4" fill="url(#scope-metal)" stroke="#587184"/><rect x="-4" y="-12" width="8" height="6" fill="#334d62"/></g>`;
  }
  if(has('tube')){
   s+=`<g transform="translate(168 132) rotate(30)"><rect x="-85" y="-29" width="192" height="58" rx="12" fill="url(#scope-tube)" stroke="#78909a" stroke-width="2"/><rect x="-26" y="-31" width="11" height="62" rx="3" fill="#6c8f8e"/><rect x="57" y="-31" width="11" height="62" rx="3" fill="#6c8f8e"/><ellipse cx="-84" cy="0" rx="10" ry="29" fill="#2c4859"/><ellipse cx="-85" cy="0" rx="6" ry="24" fill="url(#scope-lens)"/><rect x="107" y="-15" width="26" height="30" rx="4" fill="#344e64"/>`;
   if(has('optics'))s+=`<path d="M126 0h17v-17" stroke="#344e64" stroke-width="10" fill="none"/><rect x="134" y="-30" width="18" height="20" rx="3" fill="#193449"/><path d="M36 -29v-17M76 -29v-17" stroke="#344e64" stroke-width="5"/><rect x="22" y="-63" width="70" height="19" rx="5" fill="url(#scope-tube)" stroke="#78909a"/><ellipse cx="22" cy="-53.5" rx="4" ry="9" fill="#355c72"/>`;
   s+='</g>';
  }
  s+=t(180,363,has('optics')?(m.balanced?'균형이 맞은 장치':'균형추 위치를 조절하세요'):api.labels[api.order[parts.length]]||'',14,'#26485d');
  if(!has('tripod'))s+=t(180,180,'부품을 골라 설치하세요',17,'#4d6a80');
  return s+'</svg>';
 }
 function scene(m){
  const eye=state.view==='eye',finder=state.view==='finder',radius=eye?6:finder?3:m.fov/2,px=280+m.dx/radius*138,py=169-m.dy/radius*138;
  let s=`<svg viewBox="0 0 560 356" role="img" aria-label="${eye?'맨눈':finder?'파인더':'접안렌즈'}에서 본 ${m.target.name}" data-visible="${m.visible}" data-detail="${m.details}"><defs><radialGradient id="night-field"><stop stop-color="#142b42"/><stop offset="1" stop-color="#08131f"/></radialGradient><clipPath id="scope-field"><circle cx="280" cy="169" r="138"/></clipPath><filter id="scope-defocus"><feGaussianBlur stdDeviation="${Math.abs(state.focus)*1.15}"/></filter></defs><circle cx="280" cy="169" r="147" fill="#314355"/><circle cx="280" cy="169" r="143" fill="#0e1c2b" stroke="#638091"/><circle cx="280" cy="169" r="138" fill="url(#night-field)"/>`;
  s+=`<g clip-path="url(#scope-field)"><g class="${!m.balanced&&!eye&&m.assembled?'scope-shake':''}">`;
  if(m.available&&(eye||m.assembled)){
   s+=`<g class="scope-sky" ${!eye&&!finder?'filter="url(#scope-defocus)"':''}>`;
   for(let i=0;i<32;i++){const sx=((i*137)%580)/100-2.9,sy=((i*191)%580)/100-2.9,x=280+(sx-state.x-(finder?state.finderOffset:0))/radius*138,y=169-(sy-state.y)/radius*138;s+=`<circle cx="${x}" cy="${y}" r="${.5+i%3*.3}" fill="#dae5ed" opacity="${.25+i%4*.13}"/>`;}
   if(m.visible){const r=Math.max(eye||finder?1.5:1.1,m.target.diameter/2/radius*138);s+=`<g class="scope-object" transform="translate(${px} ${py})">`+object(state.target,r,!eye&&!finder)+'</g>';}
   s+='</g>';
  }
  if(state.sky==='cloud')s+='<path d="M90 185Q170 15 280 110Q390 30 460 185V310H90Z" fill="#556578" opacity=".75"/>';
  if(state.sky==='roof')s+='<path d="M90 310V175H176V130H269V200H339V148H470V310Z" fill="#1e3140"/>';
  s+='</g>';
  if(finder&&m.assembled)s+=line('M142 169H260 M300 169H418 M280 31V149 M280 189V307','#93bbb7',1.2)+`<circle cx="280" cy="169" r="9" fill="none" stroke="#93bbb7"/>`;
  if(!eye&&!m.assembled)s+=t(280,169,'장치를 먼저 설치하세요',17);
  if(m.assembled&&!m.visible&&m.available&&!eye)s+=t(280,218,'대상이 시야 밖에 있습니다',15);
  s+='</g>'+t(280,337,eye?'맨눈 · 대표 모습':finder?'파인더 · 넓은 시야 6°':`접안렌즈 · ${m.mag}배 · 시야 약 ${m.fov.toFixed(2)}°`,16);
  return s+'</svg>';
 }
 function render(message){
  const m=api.observe(state);$('scopeApparatus').innerHTML=apparatus(m);$('scopeScene').innerHTML=scene(m);
  for(const b of document.querySelectorAll('[data-part]'))b.disabled=state.parts.includes(b.dataset.part);
  for(const b of document.querySelectorAll('[data-view]'))b.setAttribute('aria-pressed',String(b.dataset.view===state.view));
  $('scopeBalanceValue').textContent=state.balance===0?'가운데':state.balance<0?'안쪽으로':'바깥쪽으로';
  $('scopeXValue').textContent=Number(state.x).toFixed(1)+'°';$('scopeYValue').textContent=Number(state.y).toFixed(1)+'°';$('scopeFocusValue').textContent=Number(state.focus).toFixed(1);
  $('scopeFinderValue').textContent=Number(state.finderOffset).toFixed(1)+'°';
  $('scopeFocus').disabled=state.view!=='eyepiece';$('scopeX').disabled=$('scopeY').disabled=state.view==='eye';
  $('scopeReadings').innerHTML=[['대상 고도',m.altitude+'°'],['앞쪽 장애물',m.obstruction+'°'],['접안렌즈 배율',m.mag+'배']].map(([a,b])=>`<div><dt>${a}</dt><dd>${b}</dd></div>`).join('');
  $('scopeSceneNote').textContent=state.view==='eye'?'먼저 하늘에서 대상이 보이는지 확인하세요.':state.view==='finder'?'대상을 십자 중심으로 옮기세요. 접안렌즈는 이보다 좁은 범위를 보여 줍니다.':'방향을 유지하고 초점을 맞추세요. 높은 배율에서는 같은 방향 오차도 시야에서 크게 보입니다.';
  $('scopeDetail').hidden=!m.details;$('scopeDetail').innerHTML=m.details?`<svg viewBox="0 0 140 140" role="img" aria-label="${m.target.name}의 대표 특징 확대"><rect width="140" height="140" rx="14" fill="#0a1726"/><g transform="translate(70 70)">${object(state.target,state.target==='moon'||state.target==='venus'?44:29,true,'detail')}</g></svg><div><strong>특징 확대 · ${m.target.name}</strong><p>${m.target.feature}</p></div>`:'';
  $('scopeStatus').textContent=message||m.message;
 }
 function reset(){state=api.initial(school);for(const [id,key]of [['scopeTarget','target'],['scopeSky','sky'],['scopeEyepiece','eyepiece'],['scopeBalance','balance'],['scopeX','x'],['scopeY','y'],['scopeFocus','focus'],['scopeFinder','finderOffset']])$(id).value=state[key];render();}
 for(const b of document.querySelectorAll('[data-part]'))b.onclick=()=>{const r=api.install(state,b.dataset.part);state=r.state;render(r.message);};
 for(const b of document.querySelectorAll('[data-view]'))b.onclick=()=>{state.view=b.dataset.view;render();};
 for(const [id,key]of [['scopeTarget','target'],['scopeSky','sky'],['scopeEyepiece','eyepiece']])$(id).onchange=e=>{state[key]=key==='eyepiece'?Number(e.target.value):e.target.value;if(key==='target'){state.x=state.y=0;$('scopeX').value=$('scopeY').value=0;}render();};
 for(const [id,key]of [['scopeBalance','balance'],['scopeX','x'],['scopeY','y'],['scopeFocus','focus'],['scopeFinder','finderOffset']])$(id).oninput=e=>{state[key]=Number(e.target.value);render();};
 if(school==='high-elective')$('scopeTarget').querySelector('[value="moon"]').remove();
 $('resetExperiment').onclick=reset;reset();window.__telescope={getState:()=>JSON.parse(JSON.stringify(state)),getResult:()=>api.observe(state)};
})();
