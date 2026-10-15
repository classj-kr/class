/* Synchronized, discrete observations. No synthetic interpolation between dates. */
(()=>{'use strict';const M=window.WeatherAnalysisModel,$=s=>document.querySelector(s),root=$('#waLab');let state={caseId:'autumn',index:0,kind:'chart',zoom:1,compare:false,explain:false,running:false},timer=null,token=0;
 function stop(){clearTimeout(timer);timer=null;state.running=false;$('#waPlay').textContent='순서대로 보기';}
 async function setImage(el,s){el.style.width=(s.baseWidth*state.zoom)+'px';el.alt=s.title+' '+s.time+' '+M.kinds[s.kind];el.dataset.case=s.caseId;el.dataset.index=s.index;el.dataset.kind=s.kind;if(!el.getAttribute('src')?.endsWith(s.file))el.src=s.file;try{await el.decode();}catch{if(!el.complete||!el.naturalWidth)throw Error('기상 자료를 불러오지 못했습니다.');}}
 async function render(resetScroll=false){const seq=++token,s=M.snapshot(state.caseId,state.index,state.kind),first=M.snapshot(state.caseId,0,state.kind);root.dataset.ready='false';
  for(const e of root.querySelectorAll('[data-wa-case]'))e.setAttribute('aria-pressed',String(e.dataset.waCase===state.caseId));
  for(const e of root.querySelectorAll('[data-wa-kind]'))e.setAttribute('aria-pressed',String(e.dataset.waKind===state.kind));
  if($('#waTimes').dataset.case!==state.caseId){$('#waTimes').innerHTML=M.cases[state.caseId].times.map((t,i)=>'<button data-wa-time="'+i+'">'+t+'</button>').join('');$('#waTimes').dataset.case=state.caseId;}
  for(const e of root.querySelectorAll('[data-wa-time]'))e.setAttribute('aria-pressed',String(+e.dataset.waTime===state.index));
  $('#waPrev').disabled=state.index===0;$('#waNext').disabled=state.index===2;$('#waPlay').textContent=state.running?'일시 정지':'순서대로 보기';
  $('#waZoom').value=state.zoom;$('#waCompare').setAttribute('aria-pressed',String(state.compare));$('#waExplain').setAttribute('aria-pressed',String(state.explain));$('#waReferenceCard').hidden=!state.compare;$('#waViews').classList.toggle('wa-comparing',state.compare);
  $('#waCurrentTitle').textContent=s.time+' · '+M.kinds[s.kind];$('#waReferenceTitle').textContent=first.time+' · 처음 관측';
  $('#waGuide').textContent=state.kind==='chart'?'고·저: 고기압·저기압 / 숫자: 기압(hPa) / 파란 삼각형: 한랭 전선 / 빨간 반원: 온난 전선':state.kind==='satellite'?'밝게 보일수록 대체로 구름 꼭대기의 온도가 낮습니다. 밝은 구름의 분포와 강수 구역을 따로 비교하세요.':'색이 나타난 강수 구역의 위치와 이동을 보세요. 회색 영역은 관측 범위 밖이며, 비가 오지 않는 곳이라는 뜻이 아닙니다.';
  $('#waInterpretation').hidden=!state.explain;$('#waInterpretation').textContent=s.observation;$('#waStatus').textContent=s.title+' · '+s.time+' · 세 자료의 시각이 같습니다.';
  try{await Promise.all([setImage($('#waCurrent'),s),setImage($('#waReference'),first)]);if(seq===token){root.dataset.ready='true';if(resetScroll)for(const el of root.querySelectorAll('.wa-viewport')){el.scrollTop=0;el.scrollLeft=0;}}}catch(e){if(seq===token){root.dataset.ready='error';$('#waStatus').textContent=e.message;stop();}}
 }
 function update(next){stop();state={...state,...next};if(!M.cases[state.caseId])state.caseId='autumn';if(!M.kinds[state.kind])state.kind='chart';state.index=M.snapshot(state.caseId,state.index,state.kind).index;state.zoom=[1,1.5,2].includes(+state.zoom)?+state.zoom:1;return render(true);}
 async function play(){if(state.running){stop();return;}if(state.index===2)state.index=0;state.running=true;await render(true);const tick=async()=>{if(!state.running)return;if(state.index>=2){stop();return;}state.index++;await render(true);if(state.running)timer=setTimeout(tick,1800);};if(state.running)timer=setTimeout(tick,1800);}
 root.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.waCase)update({caseId:b.dataset.waCase,index:0});else if(b.dataset.waKind)update({kind:b.dataset.waKind});else if(b.dataset.waTime!==undefined)update({index:+b.dataset.waTime});});
 $('#waPrev').onclick=()=>update({index:state.index-1});$('#waNext').onclick=()=>update({index:state.index+1});$('#waPlay').onclick=play;$('#waReset').onclick=()=>update({caseId:'autumn',index:0,kind:'chart',zoom:1,compare:false,explain:false});$('#waZoom').onchange=e=>update({zoom:+e.target.value});$('#waCompare').onclick=()=>update({compare:!state.compare});$('#waExplain').onclick=()=>update({explain:!state.explain});document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
 window.__weatherAnalysis={state:()=>({...state}),set:update,play,stop};render();
})();
