document.addEventListener('DOMContentLoaded',()=>{
 'use strict';
 const M=window.TuningForkModel,$=id=>document.getElementById(id),lab=$('tfLab');if(!lab)return;
 let state=M.initial(),mode='fork',audioEnabled=false,ctx=null,tone=null,frameId=null,lastTime=null;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)'),labels={paper:'종이',water:'물 표면',hand:'손'};
 const text={paper:['종이가 가만히 있습니다.','종이가 떨립니다.'],water:['물 표면에 변화가 없습니다.','물방울이 튀고 잔물결이 생깁니다.'],hand:['갈래에서 떨림이 느껴지지 않습니다.','떨리던 갈래를 잡으면 떨림과 소리가 멈춥니다.']};
 function stopTone(){if(tone){try{tone.osc.stop();tone.osc.disconnect();tone.gain.disconnect();}catch(_){}tone=null;}}
 async function readyAudio(){if(!audioEnabled)return;try{ctx??=new(window.AudioContext||window.webkitAudioContext)();if(ctx.state==='suspended')await Promise.race([ctx.resume(),new Promise((_,reject)=>setTimeout(()=>reject(Error('audio unavailable')),2000))]);if(ctx.state!=='running')throw Error('audio unavailable');}catch(_){audioEnabled=false;$('tfAudio').textContent='소리 듣기 꺼짐';$('tfAudio').setAttribute('aria-pressed','false');$('tfStatus').textContent='이 기기에서 소리가 재생되지 않습니다. 종이와 물의 움직임을 비교하세요.';stopTone();}}
 function syncAudio(){if(!audioEnabled||mode!=='fork'||document.hidden||!state.amplitude||!ctx||ctx.state!=='running'){stopTone();return;}if(!tone){const osc=ctx.createOscillator(),gain=ctx.createGain();osc.frequency.value=M.toneHz;osc.type='sine';gain.gain.value=0;osc.connect(gain);gain.connect(ctx.destination);osc.start();tone={osc,gain};}tone.gain.gain.setTargetAtTime(state.amplitude*.12,ctx.currentTime,.015);}
 function scene(){
  const a=state.amplitude,d=reduced.matches?0:M.displacement(state)*8,moving=a>0,contact=state.contact,water=contact==='water',paper=contact==='paper',hand=contact==='hand';
  const wave=reduced.matches?0:Math.sin(state.elapsed*16)*a;
  let svg=`<defs><linearGradient id="tfMetal"><stop stop-color="#435e6b"/><stop offset=".28" stop-color="#d8e3e9"/><stop offset=".48" stop-color="#f5fafc"/><stop offset=".7" stop-color="#8babbc"/><stop offset="1" stop-color="#455e6d"/></linearGradient><linearGradient id="tfHandle"><stop stop-color="#946339"/><stop offset=".4" stop-color="#ddb080"/><stop offset="1" stop-color="#986139"/></linearGradient><linearGradient id="tfGlass" x2="0" y2="1"><stop stop-color="#dceef5" stop-opacity=".15"/><stop offset="1" stop-color="#94c7d9" stop-opacity=".45"/></linearGradient></defs>
  <ellipse cx="295" cy="334" rx="180" ry="14" fill="#d3e1e8" opacity=".65"/>
  <path d="M80 326H510" stroke="#b4cbd7" stroke-width="2"/>
  <g opacity="${state.held?1:.65}"><rect x="278" y="54" width="34" height="94" rx="14" fill="url(#tfHandle)" stroke="#805936"/><path d="M295 144V162" stroke="url(#tfMetal)" stroke-width="15"/>
  <path d="M${245-d} 245 Q245 232 245 209 V185 Q245 158 295 158 Q345 158 345 185 V209 Q345 232 ${345+d} 245" fill="none" stroke="url(#tfMetal)" stroke-width="17" stroke-linecap="round"/>
  <path d="M${243-d} 244Q243 229 243 209V185Q243 157 292 156" fill="none" stroke="#f3f9fb" stroke-width="3" stroke-linecap="round" opacity=".85"/></g>`;
  if(state.held)svg+=`<path d="M373 56C341 56 344 71 314 76L284 75Q272 76 274 85L307 90Q273 87 271 97Q271 105 306 106Q274 105 276 116Q278 125 309 122L335 115Q352 94 381 99Z" fill="#f0c6a5" stroke="#bd8b6b" stroke-width="2"/>`;
  if(paper)svg+=`<g transform="translate(${wave*4} 0)"><path d="M347 174L422 164L444 273L367 282Z" fill="#fff" stroke="#8da5b3" stroke-width="2"/><path d="M369 192L405 187M373 207L410 202M377 222L415 217M381 237L420 232" stroke="#c7d9e1" stroke-width="2"/></g>`;
  if(water){svg+=`<path d="M164 219L180 313Q183 324 196 324H400Q414 324 416 310L430 219Z" fill="url(#tfGlass)" stroke="#8caeba" stroke-width="2"/><path d="M170 246L183 312Q184 319 197 319H398Q407 319 409 311L424 246Z" fill="#82c3db" opacity=".68"/><ellipse cx="297" cy="246" rx="127" ry="12" fill="#b6e3f1" stroke="#68acc5" stroke-width="1.5"/>`;
   if(moving){for(const [x,i]of [[245,0],[345,1]]){svg+=`<ellipse cx="${x}" cy="246" rx="${14+Math.abs(wave)*14}" ry="${3+Math.abs(wave)*3}" fill="none" stroke="#2583a7" opacity=".8"/>`;for(let j=0;j<6;j++){const p=reduced.matches?.4:((state.elapsed*1.8+j/6+i*.17)%1),dx=(j%2?-1:1)*(12+j*4)*p,dy=65*a*4*p*(1-p);svg+=`<ellipse cx="${x+dx}" cy="${242-dy}" rx="2.4" ry="3.5" fill="#277c9d" opacity="${1-p}"/>`;}}}}
  if(hand)svg+=`<path d="M410 190Q381 192 362 220L342 213Q333 211 329 220L346 232Q322 224 320 235Q321 245 345 245L367 251Q385 225 421 228Z" fill="#f0c6a5" stroke="#bd8b6b" stroke-width="2"/>`;
  if(!state.held)svg+=`<path d="M456 139L386 206" stroke="#b38554" stroke-width="12" stroke-linecap="round"/><rect x="360" y="194" width="65" height="28" rx="10" transform="rotate(-42 391 208)" fill="#465562" stroke="#2c3d48" stroke-width="2"/>`;
  if(moving&&reduced.matches)svg+=`<path d="M228 212V242M362 212V242" stroke="#3a809a" stroke-width="2" stroke-dasharray="3 4"/>`;
  window.scienceScene.render($('tfScene'),svg);
 }
 function render(){
  for(const b of lab.querySelectorAll('[data-tf-strike]'))b.disabled=!state.held||state.contact!=='none';
  for(const b of lab.querySelectorAll('[data-tf-contact]')){b.disabled=!state.held;b.setAttribute('aria-pressed',String(b.dataset.tfContact===state.contact));}
  $('tfHold').disabled=state.held;$('tfHold').textContent=state.held?'손잡이를 잡았습니다':'손잡이 잡기';
  $('tfStageTitle').textContent=state.amplitude?'떨리는 소리굽쇠':state.strikes?'떨림이 멈춘 소리굽쇠':'치기 전';
  $('tfComparisons').innerHTML=M.comparisons(state).map(r=>`<article><h3>${labels[r.kind]}로 확인</h3><p data-seen="${r.still}">${r.still?'✓':'○'} 떨림 없음: ${r.still?text[r.kind][0]:'아직 비교하지 않았습니다.'}</p><p data-seen="${r.moving}">${r.moving?'✓':'○'} 떨림 있음: ${r.moving?text[r.kind][1]:'아직 비교하지 않았습니다.'}</p></article>`).join('');
  scene();
 }
 function loop(time){const dt=lastTime===null?0:Math.min((time-lastTime)/1000,.1);lastTime=time;state=M.step(state,'tick',dt);scene();syncAudio();if(state.amplitude&&mode==='fork'&&!document.hidden)frameId=requestAnimationFrame(loop);else{frameId=null;lastTime=null;if(state.contact!=='hand')$('tfStatus').textContent='떨림이 잦아들어 멈췄습니다. 닿은 물체를 떼고 다시 쳐 보세요.';render();}}
 function start(){if(frameId===null&&state.amplitude&&mode==='fork'&&!document.hidden)frameId=requestAnimationFrame(loop);}
 function halt(){if(frameId!==null)cancelAnimationFrame(frameId);frameId=null;lastTime=null;stopTone();}
 function act(action,value){state=M.step(state,action,value);if(action==='hold')$('tfStatus').textContent='아직 치지 않았습니다. 종이·물·손으로 먼저 확인한 뒤 고무망치로 쳐 보세요.';
  if(action==='strike')$('tfStatus').textContent=(value==='strong'?'더 크게 떨립니다.':'작게 떨립니다.')+' 종이나 물 표면에 대어 떨림을 확인하세요.';
  if(action==='contact')$('tfStatus').textContent=value==='none'?'닿은 물체를 떼었습니다. 고무망치로 다시 칠 수 있습니다.':text[value][state.last?.moving?1:0];
  if(action==='reset'){$('tfStatus').textContent='손잡이를 잡은 뒤, 치기 전의 소리굽쇠에 종이나 물을 대어 보세요.';halt();}
  render();syncAudio();start();
 }
 $('tfHold').onclick=()=>act('hold');$('tfReset').onclick=()=>act('reset');
 for(const b of lab.querySelectorAll('[data-tf-strike]'))b.onclick=()=>{act('strike',b.dataset.tfStrike);readyAudio().then(syncAudio);};
 for(const b of lab.querySelectorAll('[data-tf-contact]'))b.onclick=()=>act('contact',b.dataset.tfContact);
 $('tfAudio').onclick=()=>{audioEnabled=!audioEnabled;$('tfAudio').setAttribute('aria-pressed',String(audioEnabled));$('tfAudio').textContent='소리 듣기 '+(audioEnabled?'켜짐':'꺼짐');readyAudio().then(syncAudio);if(!audioEnabled)stopTone();};
 for(const b of document.querySelectorAll('[data-tf-mode]'))b.onclick=()=>{mode=b.dataset.tfMode;for(const other of document.querySelectorAll('[data-tf-mode]'))other.setAttribute('aria-pressed',String(other===b));lab.hidden=mode!=='fork';$('tfBarsPanel').hidden=mode!=='bars';window.__soundModel?.silence?.();halt();state={...state,amplitude:0,contact:'none'};render();window.dispatchEvent(new Event('resize'));};
 document.addEventListener('visibilitychange',()=>{if(document.hidden){halt();state={...state,amplitude:0};render();}});window.addEventListener('pagehide',halt);reduced.addEventListener('change',()=>scene());
 window.__tuningFork={getState:()=>JSON.parse(JSON.stringify(state)),getAudio:()=>({enabled:audioEnabled,active:!!tone,frequency:tone?.osc.frequency.value||null}),advance:seconds=>{state=M.step(state,'tick',seconds);render();syncAudio();}};render();
});
