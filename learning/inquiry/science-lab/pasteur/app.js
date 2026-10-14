(() => {
 const $=id=>document.getElementById(id);let heated=false,neck='swan',stage=0;
 const title={swan:'백조목 유지',cut:'목 자르기',tilt:'기울여 목의 먼지와 접촉',sealed:'마개로 밀봉'};
 function flask(r,id){
  const fluid=r.growth?'#b39b55':'#f1c375';
  const bend='M 148 146 L 148 92 C 148 55 181 42 204 66 C 231 95 249 83 249 47';
  const body='M 148 146 C 139 166 102 175 103 219 C 103 278 211 278 211 219 C 212 175 174 166 166 146';
  const microbes=Array.from({length:20},(_,i)=>{const x=123+(i*19%68),y=204+(i*17%45);return `<ellipse cx="${x}" cy="${y}" rx="3" ry="2" fill="#4e592b" transform="rotate(${i*23} ${x} ${y})"/>`;}).join('');
  return `<svg viewBox="0 0 320 290" role="img" aria-label="${r.growth?'미생물이 증식한 배양액':'맑은 배양액'}, ${r.air?'공기 출입 가능':'입구 밀봉'}"><defs><clipPath id="liquid-${id}"><path d="${body}Z"/></clipPath><marker id="air-${id}" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0 0L6 3L0 6" fill="none" stroke="#3688ad"/></marker></defs><rect x="90" y="194" width="140" height="76" fill="${fluid}" clip-path="url(#liquid-${id})"/><path d="${body}" fill="none" stroke="#7fadb9" stroke-width="5"/>${r.neck==='cut'?'<path d="M148 146V104 M166 146V104" fill="none" stroke="#7fadb9" stroke-width="5"/>':`<path d="${bend}" fill="none" stroke="#7fadb9" stroke-width="20"/><path d="${bend}" fill="none" stroke="#f8fbfc" stroke-width="12"/>`}<path d="M166 146V102" stroke="#7fadb9" stroke-width="4" fill="none"/>${r.neck==='sealed'?'<rect x="237" y="33" width="24" height="15" rx="3" fill="#826349"/>':`<path d="${r.neck==='cut'?'M 212 70 Q157 60 157 125':'M 289 27 Q249 15 249 64'}" stroke="#3688ad" stroke-width="3" fill="none" marker-end="url(#air-${id})" stroke-dasharray="6 4"/>`}${r.dustInBend||r.neck==='tilt'?'<g fill="#855a39"><circle cx="208" cy="77" r="3"/><circle cx="215" cy="79" r="3"/><circle cx="221" cy="81" r="2"/></g>':''}${r.dustInBroth?'<g fill="#855a39"><circle cx="145" cy="215" r="3"/><circle cx="167" cy="223" r="3"/><circle cx="154" cy="231" r="2"/></g>':''}${r.growth?microbes:''}${r.neck==='tilt'?'<path d="M157 205 Q185 145 215 82" fill="none" stroke="#c27630" stroke-width="3" stroke-dasharray="5 4"/>':''}<line x1="55" y1="272" x2="277" y2="272" stroke="#aec3cc" stroke-width="3"/></svg>`;
 }
 function render(){
  const a=window.pasteurModel.result({heated,neck:'swan',stage}),b=window.pasteurModel.result({heated,neck,stage});
  $('flaskA').innerHTML=flask(a,'a');$('flaskB').innerHTML=flask(b,'b');
  $('labelB').textContent='B · '+title[neck];
  for(const [id,r] of [['observationA',a],['observationB',b]])$(id).textContent=stage===0?'아직 시간을 보내지 않았습니다.':r.growth?'배양액이 탁해지고 미생물이 증식했습니다.':'배양액이 맑게 유지됩니다.';
  $('preparation').textContent=heated?'두 배양액을 끓이고 식혔습니다.':'끓이기 전 · 배양액에는 원래 미생물이 있을 수 있습니다.';
  $('timeLabel').textContent=stage?'충분한 시간이 지난 뒤':'관찰 전';$('observe').disabled=stage>0;
  $('heat').disabled=heated;$('status').textContent=stage?(heated&&neck==='swan'?'두 플라스크 모두 공기가 드나들지만 배양액은 맑게 유지됩니다.':heated?'두 플라스크의 공기 출입과 먼지가 배양액에 닿는 경로를 비교하세요.':'끓이지 않은 배양액에서는 목의 모양만으로 원래 있던 미생물을 없앨 수 없습니다.'):'A는 백조목을 유지합니다. B의 조건을 정한 뒤 같은 시간 동안 관찰하세요.';
  document.querySelectorAll('[data-neck]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.neck===neck)));
  $('airA').textContent='공기 출입 가능';$('airB').textContent=b.air?'공기 출입 가능':'입구 밀봉';
 }
 document.querySelectorAll('[data-neck]').forEach(b=>b.onclick=()=>{neck=b.dataset.neck;stage=0;render();});
 $('heat').onclick=()=>{heated=true;stage=0;render();};$('observe').onclick=()=>{stage=1;render();};
 $('resetExperiment').onclick=()=>{heated=false;neck='swan';stage=0;render();};render();
})();
