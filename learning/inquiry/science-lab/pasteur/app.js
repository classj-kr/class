(() => {
 const $=id=>document.getElementById(id);let heated=false,neck='swan',stage=0;
 const title={swan:'백조목 유지',cut:'목 자르기',tilt:'기울여 목의 먼지와 접촉',sealed:'마개로 밀봉'};
 const reduce=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
 const HEAT_MS=2800,OBS_MS=2600;let anim=null,raf=0;
 const lerp=(a,b,t)=>a+(b-a)*t,clamp=t=>Math.max(0,Math.min(1,t));
 const mix=(c1,c2,t)=>'#'+[0,2,4].map(i=>Math.round(lerp(parseInt(c1.substr(i+1,2),16),parseInt(c2.substr(i+1,2),16),t)).toString(16).padStart(2,'0')).join('');
 const bez=(p0,p1,p2,p3,t)=>{const u=1-t;return [u*u*u*p0[0]+3*u*u*t*p1[0]+3*u*t*t*p2[0]+t*t*t*p3[0],u*u*u*p0[1]+3*u*u*t*p1[1]+3*u*t*t*p2[1]+t*t*t*p3[1]];};
 // 목 관의 중심선: 몸통에서 위로 곧게 → 위로 굽음 → 아래로 처짐 → 다시 위로 열린 끝
 const BEND='M157 150 L157 94 C157 50 194 40 214 68 C236 98 258 86 258 46';
 function neckPoint(u,cut){
  if(cut)return [157,lerp(150,96,clamp(u))];
  if(u<1/3)return [157,lerp(150,94,u*3)];
  if(u<2/3)return bez([157,94],[157,50],[194,40],[214,68],(u-1/3)*3);
  return bez([214,68],[236,98],[258,86],[258,46],Math.min(1,(u-2/3)*3));
 }
 function flask(r,id,f){
  const growthT=r.growth?f.obs:0;
  const fluid=mix('#f1c375','#b39b55',growthT);
  const body='M148 146 C139 166 102 175 103 219 C103 278 211 278 211 219 C212 175 174 166 166 146';
  const cut=r.neck==='cut';
  const nMicro=Math.round(20*growthT);
  const microbes=Array.from({length:nMicro},(_,i)=>{const x=122+(i*19%70),y=206+(i*17%44);return `<ellipse cx="${x}" cy="${y}" rx="3.2" ry="2" fill="#4e592b" transform="rotate(${i*23} ${x} ${y})"/>`;}).join('');
  const glass='#7fadb9',inner='#eef6f8';
  let neckSvg;
  if(cut)neckSvg=`<path d="M157 150 L157 102" stroke="${glass}" stroke-width="22" fill="none"/><path d="M157 152 L157 101" stroke="${inner}" stroke-width="13" fill="none"/><path d="M146 103 l4 -4 l4 3 l3 -4 l4 3 l3 -3 l4 4" stroke="${glass}" stroke-width="2.5" fill="none" stroke-linejoin="round"/>`;
  else neckSvg=`<path d="${BEND}" fill="none" stroke="${glass}" stroke-width="22" stroke-linecap="butt"/><path d="${BEND}" fill="none" stroke="${inner}" stroke-width="13"/>`;
  // 기울인 플라스크: 배양액이 굽은 곳까지 흘러 들어가 먼지에 닿은 자국
  const tiltBroth=r.neck==='tilt'?`<path d="M214 69 C220 77 228 83 240 85" stroke="${fluid}" stroke-width="9" stroke-linecap="round" fill="none"/>`:'';
  const sealed=r.neck==='sealed'?'<rect x="248" y="30" width="20" height="17" rx="3" fill="#826349"/><rect x="246" y="27" width="24" height="6" rx="2" fill="#6b4f39"/>':'';
  const airPath=cut?'M214 52 Q160 46 157 98':'M300 22 Q258 10 258 44';
  const air=r.neck==='sealed'?'':`<path d="${airPath}" stroke="#3688ad" stroke-width="3" fill="none" marker-end="url(#air-${id})" stroke-dasharray="6 4"/>`;
  // 먼지: 시간이 흐르는 동안 공기와 함께 들어와 굽은 곳(백조목) 또는 배양액(곧은 목)에 내려앉는다
  let dust='';
  const dustShown=r.stage>0&&r.air;
  if(dustShown||r.neck==='tilt'){
   const finals=cut?[[145,215],[167,223],[154,231]]:[[224,81],[231,84],[238,85]];
   dust=finals.map((p,i)=>{
    let q=p;
    if(dustShown&&f.obs<1){
     const t=clamp(f.obs*1.6-i*.18);
     if(cut){const start=[190-i*12,30];const mid=[157,98];q=t<.5?[lerp(start[0],mid[0],t*2),lerp(start[1],mid[1],t*2)]:[lerp(mid[0],p[0],(t-.5)*2),lerp(mid[1],p[1],(t-.5)*2)];}
     else{const start=[300-i*8,18+i*4],mouth=[258,46];q=t<.45?[lerp(start[0],mouth[0],t/.45),lerp(start[1],mouth[1],t/.45)]:(()=>{const s=neckPoint(1-(t-.45)/.55*.22,false);return [lerp(s[0],p[0],(t-.45)/.55),lerp(s[1],p[1],(t-.45)/.55)];})();}
    }
    return `<circle cx="${q[0].toFixed(1)}" cy="${q[1].toFixed(1)}" r="${i===2?2.4:3}" fill="#855a39"/>`;
   }).join('');
  }
  // 가열: 알코올램프 불꽃, 배양액 속 거품, 목을 타고 나가는 김
  const h=f.heat,heating=h>0&&h<1,lit=heating&&h<.72,tm=f.time;
  let flame='',bubbles='',steam='';
  if(lit){
   const fl=1+.08*Math.sin(tm/70)+.05*Math.sin(tm/37);
   flame=`<g transform="translate(157 300) scale(1 ${fl.toFixed(3)})"><path d="M0 -36 C9 -22 12 -10 0 0 C-12 -10 -9 -22 0 -36 Z" fill="#f6a43a"/><path d="M0 -24 C5 -15 6 -7 0 0 C-6 -7 -5 -15 0 -24 Z" fill="#fde39a"/><path d="M0 -10 C3 -6 3 -2 0 0 C-3 -2 -3 -6 0 -10 Z" fill="#7db6e8"/></g>`;
  }
  if(heating){
   const boil=clamp(h<.72?(h-.12)/.35:1-(h-.72)/.2);
   const n=Math.round(14*boil);
   for(let i=0;i<n;i++){const ph=((tm/900)+i*.137)%1;const x=120+(i*29%74)+Math.sin(tm/160+i)*2;const y=lerp(258,198,ph);bubbles+=`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(1.6+ph*2.2).toFixed(1)}" fill="none" stroke="#fff7e3" stroke-width="1.6" opacity="${(1-ph*.5).toFixed(2)}"/>`;}
   const st=clamp(h<.72?(h-.2)/.25:1-(h-.72)/.28);
   for(let i=0;i<7&&st>0;i++){const u=((tm/1400)+i/7)%1;const q=neckPoint(u,cut);const fade=u>.85?1-(u-.85)/.15:1;steam+=`<circle cx="${q[0].toFixed(1)}" cy="${q[1].toFixed(1)}" r="${(4+u*3).toFixed(1)}" fill="#ffffff" stroke="#a9c3cf" stroke-width="1.2" opacity="${(.9*st*fade).toFixed(2)}"/>`;}
   // 끝에서 나와 흩어지는 김
   if(!cut)for(let i=0;i<4&&st>0;i++){const u=((tm/1100)+i/4)%1;steam+=`<circle cx="${(258+u*14+Math.sin(tm/300+i)*3).toFixed(1)}" cy="${(44-u*30).toFixed(1)}" r="${(5+u*6).toFixed(1)}" fill="#e4edf1" stroke="#b9ced8" stroke-width="1" opacity="${(.8*st*(1-u)).toFixed(2)}"/>`;}
   else for(let i=0;i<4&&st>0;i++){const u=((tm/1100)+i/4)%1;steam+=`<circle cx="${(157+Math.sin(tm/300+i)*5).toFixed(1)}" cy="${(96-u*44).toFixed(1)}" r="${(5+u*6).toFixed(1)}" fill="#e4edf1" stroke="#b9ced8" stroke-width="1" opacity="${(.8*st*(1-u)).toFixed(2)}"/>`;}
  }
  const lamp=`<g><path d="M152 290 h10 v9 h-10z" fill="#9aa7ad"/><path d="M156 284 h2 v7 h-2z" fill="#5b4a3b"/><path d="M137 300 h40 c8 0 12 6 12 14 v20 c0 4 -3 6 -7 6 h-50 c-4 0 -7 -2 -7 -6 v-20 c0 -8 4 -14 12 -14z" fill="#e3eef2" stroke="${glass}" stroke-width="3"/><path d="M127 320 h60 v14 c0 4 -3 6 -7 6 h-46 c-4 0 -7 -2 -7 -6z" fill="#cfe3ec" opacity=".9"/></g>`;
  const tripod=`<g stroke="#6f7c83" stroke-width="5" stroke-linecap="round"><path d="M110 268 L96 340"/><path d="M204 268 L218 340"/></g><rect x="98" y="263" width="118" height="6" rx="2" fill="#8b979d"/><path d="M104 266 h106" stroke="#c4ccd0" stroke-width="2" stroke-dasharray="3 3"/>`;
  return `<svg viewBox="0 14 320 330" role="img" aria-label="${r.growth?'미생물이 증식한 배양액':'맑은 배양액'}, ${r.air?'공기 출입 가능':'입구 밀봉'}"><defs><marker id="air-${id}" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0 0L6 3L0 6" fill="none" stroke="#3688ad"/></marker><clipPath id="liquid-${id}"><path d="${body}Z"/></clipPath></defs>
<line x1="40" y1="341" x2="282" y2="341" stroke="#aec3cc" stroke-width="3"/>${tripod}${lamp}${flame}
<path d="${body}Z" fill="${inner}"/><rect x="90" y="194" width="140" height="80" fill="${fluid}" clip-path="url(#liquid-${id})"/><g clip-path="url(#liquid-${id})">${bubbles}${microbes}</g><path d="${body}" fill="none" stroke="${glass}" stroke-width="5"/>${neckSvg}${tiltBroth}${sealed}${steam}${dust}${air}</svg>`;
 }
 function frameState(now){
  if(!anim)return {heat:heated?1:0,obs:stage?1:0,time:now||0};
  const t=clamp((now-anim.start)/anim.dur);
  return anim.kind==='heat'?{heat:t,obs:0,time:now}:{heat:heated?1:0,obs:t,time:now};
 }
 function draw(now){
  const f=frameState(now);
  const a=window.pasteurModel.result({heated,neck:'swan',stage}),b=window.pasteurModel.result({heated,neck,stage});
  $('flaskA').innerHTML=flask(a,'a',f);$('flaskB').innerHTML=flask(b,'b',f);
 }
 function tick(now){
  draw(now);
  if(anim&&now-anim.start>=anim.dur){anim=null;raf=0;draw(now);return;}
  raf=requestAnimationFrame(tick);
 }
 function play(kind){
  cancelAnimationFrame(raf);raf=0;anim=null;
  if(reduce()){draw(performance.now());return;}
  anim={kind,start:performance.now(),dur:kind==='heat'?HEAT_MS:OBS_MS};raf=requestAnimationFrame(tick);
 }
 function stop(){cancelAnimationFrame(raf);raf=0;anim=null;}
 function render(){
  const b=window.pasteurModel.result({heated,neck,stage});
  $('labelB').textContent='B · '+title[neck];
  for(const [id,r] of [['observationA',window.pasteurModel.result({heated,neck:'swan',stage})],['observationB',b]])$(id).textContent=stage===0?'아직 시간을 보내지 않았습니다.':r.growth?'배양액이 탁해지고 미생물이 증식했습니다.':'배양액이 맑게 유지됩니다.';
  $('preparation').textContent=heated?'두 배양액을 끓이고 식혔습니다.':'끓이기 전 · 배양액에는 원래 미생물이 있을 수 있습니다.';
  $('timeLabel').textContent=stage?'충분한 시간이 지난 뒤':'관찰 전';$('observe').disabled=stage>0;
  $('heat').disabled=heated;$('status').textContent=stage?(heated&&neck==='swan'?'두 플라스크 모두 공기가 드나들지만 배양액은 맑게 유지됩니다.':heated?'두 플라스크의 공기 출입과 먼지가 배양액에 닿는 경로를 비교하세요.':'끓이지 않은 배양액에서는 목의 모양만으로 원래 있던 미생물을 없앨 수 없습니다.'):'A는 백조목을 유지합니다. B의 조건을 정한 뒤 같은 시간 동안 관찰하세요.';
  document.querySelectorAll('[data-neck]').forEach(x=>x.setAttribute('aria-pressed',String(x.dataset.neck===neck)));
  $('airA').textContent='공기 출입 가능';$('airB').textContent=b.air?'공기 출입 가능':'입구 밀봉';
  if(!anim)draw(performance.now());
 }
 document.querySelectorAll('[data-neck]').forEach(b=>b.onclick=()=>{neck=b.dataset.neck;stage=0;if(anim&&anim.kind==='obs')stop();render();});
 $('heat').onclick=()=>{heated=true;stage=0;render();play('heat');};
 $('observe').onclick=()=>{stage=1;stop();render();play('obs');};
 $('resetExperiment').onclick=()=>{stop();heated=false;neck='swan';stage=0;render();};render();
})();
