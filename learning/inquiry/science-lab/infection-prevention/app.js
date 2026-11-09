(() => {
 const $=id=>document.getElementById(id),api=window.infectionModel;let distance=50,sprayed=false,round=0,marked=[0],pairs=[],chosen=null,applied=false,washed=false,uv=false;
 // Side view: 1 m = 115 px, floor at y=296, nozzle tip at (170,164) = 1.15 m high (model.js).
 const NX=170,NY=164,FLOOR=296,PX_M=115,FRONT_CX=618,PUFF_GAP=550;
 const paperX=()=>NX+distance/100*PX_M,hY=h=>FLOOR-h*PX_M;
 let flying=false,raf=0,trigger=0,SLOW=2.2;
 const reduced=()=>!!(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches);
 function bottle(pull){
  return `<g data-scene-key="bottle"><rect x="66" y="288" width="92" height="8" rx="2" fill="#b98c5c" stroke="#8a6338" stroke-width="2"/>
  <path d="M103 200H121V208Q141 214 143 232V280Q143 288 135 288H89Q81 288 81 280V232Q83 214 103 208Z" fill="#d6edf5" stroke="#4f8ea6" stroke-width="2.5"/>
  <path d="M84 240Q112 236 140 240V280Q140 285 134 285H90Q84 285 84 280Z" fill="#8cc6dd"/>
  <path d="M84 240Q112 236 140 240" fill="none" stroke="#5aa3c2" stroke-width="2"/>
  <line x1="112" y1="202" x2="112" y2="282" stroke="#9fb7c1" stroke-width="2.5"/>
  <path d="M88 226Q90 216 100 213" fill="none" stroke="#f4fbfd" stroke-width="3" stroke-linecap="round"/>
  <rect x="97" y="186" width="30" height="16" rx="2" fill="#2d7f8f" stroke="#1d5866" stroke-width="2"/>
  <path d="M103 188V200M109 188V200M115 188V200M121 188V200" stroke="#1d5866" stroke-width="1.5"/>
  <path d="M94 186V160Q94 147 107 147H148Q157 147 158 156V171H148Q144 182 132 186Z" fill="#34a0ae" stroke="#1d5866" stroke-width="2.5"/>
  <path d="M100 156Q102 151 110 151H140" fill="none" stroke="#7fd0d9" stroke-width="2.5" stroke-linecap="round"/>
  <rect x="157" y="157" width="9" height="13" rx="1.5" fill="#1d5866"/><rect x="165" y="160" width="5" height="8" rx="1" fill="#e6a23c" stroke="#9b6418" stroke-width="1"/>
  <g id="sprayTrigger" transform="rotate(${(pull*13).toFixed(1)} 145 170)"><path d="M141 170Q152 174 153 190Q152 207 143 216Q137 218 137 211Q144 200 143 188Q141 179 136 174Z" fill="#2d7f8f" stroke="#1d5866" stroke-width="2"/></g></g>`;
 }
 function sprayScene(){
  const drops=api.droplets(distance),hit=drops.filter(p=>p.hit),px=paperX(),top=hY(1.65),bot=hY(.18);
  const done=sprayed&&!flying,state=!sprayed?'ready':flying?'flying':'done';
  const marks=done?drops.map((p,i)=>p.hit?`<ellipse cx="${(FRONT_CX+p.lateral*56).toFixed(1)}" cy="${hY(p.height).toFixed(1)}" rx="${3+i%3}" ry="${3.6+i%3}" fill="#c9783e" opacity=".75"/>`:'').join(''):'';
  const sideMarks=done?hit.map(p=>`<ellipse cx="${(px-1).toFixed(1)}" cy="${hY(p.height).toFixed(1)}" rx="1.6" ry="3" fill="#c9783e"/>`).join(''):'';
  window.scienceScene.render($('sprayScene'),`<svg viewBox="0 0 720 350" data-state="${state}" role="img" aria-label="분무기 노즐에서 ${distance} cm 떨어진 새 색 도화지">
  <rect x="0" y="${FLOOR}" width="720" height="54" fill="#e2ebef"/><line x1="0" y1="${FLOOR}" x2="720" y2="${FLOOR}" stroke="#9fb3bc" stroke-width="2"/>
  ${bottle(trigger)}
  <g data-scene-key="paper"><text x="${px+4}" y="${top-14}" font-size="17" text-anchor="middle" fill="#214757">도화지</text>
  <rect x="${px+6}" y="${top-6}" width="6" height="${FLOOR-top+6}" fill="#a77a4c"/><path d="M${px-14} ${FLOOR}H${px+32}" stroke="#86603a" stroke-width="7" stroke-linecap="round"/>
  <rect x="${px-2}" y="${top}" width="5" height="${bot-top}" fill="#f2b97c" stroke="#c88a4f" stroke-width="1"/>
  <rect x="${px-4}" y="${top+8}" width="16" height="9" rx="2" fill="#5d6f78"/><rect x="${px-4}" y="${bot-17}" width="16" height="9" rx="2" fill="#5d6f78"/>${sideMarks}</g>
  <g id="sprayFlight"></g>
  <g data-scene-key="ruler"><path d="M${NX} ${NY+8}V318M${px} ${bot+4}V318" stroke="#7d97a3" stroke-width="1.5" stroke-dasharray="4 4"/>
  <path d="M${NX+2} 312H${px-2}" stroke="#2d5566" stroke-width="2"/><path d="M${NX+2} 312l9 -5v10zM${px-2} 312l-9 -5v10z" fill="#2d5566"/>
  <text x="${(NX+px)/2}" y="339" font-size="18" font-weight="700" text-anchor="middle" fill="#214757">${distance} cm</text></g>
  <g data-scene-key="front"><rect x="540" y="62" width="160" height="${FLOOR-62+18}" rx="10" fill="#f7fafb" stroke="#c4d5dc"/><text x="${FRONT_CX}" y="88" font-size="17" text-anchor="middle" fill="#214757">도화지 앞모습</text>
  <rect x="556" y="${top}" width="124" height="${bot-top}" fill="#f2b97c" stroke="#c88a4f" stroke-width="2"/>
  <g id="sprayMarks">${marks}</g></g></svg>`);
  $('sprayObservation').textContent=!sprayed?'새 색 도화지입니다. 같은 세기로 두 번 분무하세요.':flying?'분무기에서 나온 물방울이 퍼지면서 날아가고 있어요.':(hit.length?'도화지에 물방울 자국이 생겼습니다. 거리를 바꾸어 새 도화지와 비교하세요.':'이 분무기 모형에서는 도화지에 물방울이 닿지 않았습니다. 실제 도달 거리는 분무기와 주변 조건에 따라 달라집니다.');
  $('distanceValue').textContent=distance+' cm';$('spray').disabled=sprayed;
 }
 function stopSpray(){cancelAnimationFrame(raf);raf=0;flying=false;trigger=0;}
 function animateSpray(){
  const drops=api.droplets(distance),px=paperX(),pxM=distance/100;
  SLOW=2.2+(300-distance)/250*1.8; // short throws are shown in slower motion so the flight stays visible
  // Each model droplet flies with x = speed·t and height = 1.15 + vy·t − 4.9t², the same numbers model.js uses.
  const paths=drops.map((p,i)=>{const speed=2.8+(i*17%29)/10,vy=.22-(i*13%20)/50,tPaper=pxM/speed,tFloor=(vy+Math.sqrt(vy*vy+4*4.9*1.15))/(2*4.9);
   const over=!p.hit&&p.height>1.65&&tPaper<tFloor;
   return {i,p,speed,vy,puff:i%2,delay:(i*7%12)*14+(i*5%3)*9,r:1.8+(i*11%5)*.3,tEnd:p.hit?tPaper:over?tPaper+.12:Math.min(tPaper,tFloor),floor:!p.hit&&tFloor<=tPaper};});
  const mist=Array.from({length:80},(_,k)=>({puff:k%2,ang:((k*37%41)-20)/20*.27,v:1.2+(k*29%23)/12,life:.2+(k*11%9)/36,r:1+(k%3)*.5}));
  const start=performance.now(),lastEnd=Math.max(...paths.map(d=>d.tEnd*SLOW*1000+d.delay))+PUFF_GAP+400;
  flying=true;trigger=0;sprayScene();
  const step=now=>{const ms=now-start;let out='',marks='';
   trigger=Math.max(...[0,1].map(k=>{const u=(ms-k*PUFF_GAP)/280;return u<0||u>1?0:Math.sin(Math.PI*u);}));
   $('sprayTrigger')?.setAttribute('transform',`rotate(${(trigger*13).toFixed(1)} 145 170)`);
   for(const k of [0,1]){const u=(ms-k*PUFF_GAP-40)/460;if(u>0&&u<1){const len=Math.min(40+u*130,px-NX-6),w=10+u*34;out+=`<path d="M${NX} ${NY}L${NX+len} ${NY-w}Q${NX+len+14} ${NY} ${NX+len} ${NY+w}Z" fill="#8fcbe2" opacity="${(.36*(1-u)).toFixed(2)}"/>`;}}
   for(const m of mist){const t=(ms-m.puff*PUFF_GAP)/1000/SLOW;if(t<0||t>m.life)continue;const s=m.v*(t-t*t/(2*m.life)),x=NX+s*Math.cos(m.ang)*PX_M,y=NY-s*Math.sin(m.ang)*PX_M+60*t*t;
    if(x>px-3)continue;out+=`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${m.r}" fill="#5aa7c9" opacity="${(.8*(1-t/m.life)).toFixed(2)}"/>`;}
   for(const d of paths){const t=(ms-d.puff*PUFF_GAP-d.delay)/1000/SLOW;if(t<0)continue;
    const fy=hY(d.p.height),fx=FRONT_CX+d.p.lateral*56;
    if(t>=d.tEnd){if(d.p.hit){const g=Math.min(1,(t-d.tEnd)*SLOW*1000/180);marks+=`<ellipse cx="${fx.toFixed(1)}" cy="${fy.toFixed(1)}" rx="${((3+d.i%3)*g).toFixed(2)}" ry="${((3.6+d.i%3)*g).toFixed(2)}" fill="#c9783e" opacity=".75"/>`;out+=`<ellipse cx="${(px-1).toFixed(1)}" cy="${fy.toFixed(1)}" rx="1.6" ry="3" fill="#c9783e"/>`;}
     else if(d.floor){const g=(t-d.tEnd)*SLOW;if(g<.4){const x2=NX+d.speed*d.tEnd*PX_M;out+=`<ellipse cx="${x2.toFixed(1)}" cy="${FLOOR-1}" rx="${(2+g*8).toFixed(1)}" ry="1.5" fill="#5aa7c9" opacity="${(.7*(1-g/.4)).toFixed(2)}"/>`;}}
     continue;}
    const x=NX+d.speed*t*PX_M,y=hY(1.15+d.vy*t-4.9*t*t),fade=x>px?Math.max(0,1-(x-px)/30):1;
    out+=`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${d.r.toFixed(1)}" fill="#2f86b3" opacity="${(.85*fade).toFixed(2)}"/>`;}
   const f=$('sprayFlight');if(f)f.innerHTML=out;const mg=$('sprayMarks');if(mg)mg.innerHTML=marks;
   if(ms<lastEnd)raf=requestAnimationFrame(step);else{stopSpray();sprayScene();}};
  raf=requestAnimationFrame(step);
 }
 function people(){
  $('people').replaceChildren();for(let i=0;i<8;i++){const b=document.createElement('button');b.type='button';b.className='person'+(marked.includes(i)?' marked':'')+(chosen===i?' selected':'');b.setAttribute('aria-pressed',String(chosen===i));b.setAttribute('aria-label',String.fromCharCode(65+i)+(marked.includes(i)?' · 붙임딱지 있음':''));b.innerHTML='<span class="head" aria-hidden="true"></span><span class="body" aria-hidden="true"></span><strong>'+String.fromCharCode(65+i)+'</strong><em>'+(marked.includes(i)?'붙임딱지':'표시 없음')+'</em>';b.disabled=round>=4||pairs.some(p=>p.includes(i));b.onclick=()=>{if(chosen===null)chosen=i;else if(chosen===i)chosen=null;else{pairs.push([chosen,i]);chosen=null;}people();};$('people').append(b);}
  $('pairs').textContent=pairs.length?'이번 차례의 접촉: '+pairs.map(p=>p.map(i=>String.fromCharCode(65+i)).join(' ↔ ')).join(' / '):'접촉할 두 사람을 차례로 고르세요. 접촉 없이 다음 차례로 갈 수도 있습니다.';
  $('roundValue').textContent=round+' / 4차례';$('nextRound').disabled=round>=4;$('clearPairs').disabled=!pairs.length&&chosen===null;
  $('contactObservation').textContent=round>=4?'네 차례가 끝났습니다. 붙임딱지가 옮겨 간 접촉 경로를 확인하세요.':round?'붙임딱지가 있는 사람과 접촉한 사람에게 표시가 옮겨 갑니다. 다음 접촉을 골라 보세요.':'A에게만 붙임딱지가 있습니다. 다른 사람과 접촉하면 어떻게 달라질까요?';
 }
 function hand(soap,id){const n=api.lotion({applied,washed,soap,uv});const shape='M83 259L79 197Q44 168 44 151Q49 137 59 147L85 168L77 91Q77 79 88 79Q98 79 100 95L111 148L108 55Q110 42 119 45Q129 48 129 60L133 143L142 43Q147 31 156 38Q164 42 160 56L154 147L175 63Q180 50 190 57Q197 60 193 73L178 165L199 105Q205 94 214 102Q221 109 215 121L197 184Q194 226 181 259Z';
  return `<svg viewBox="0 0 260 290" role="img" aria-label="${!applied?'로션을 묻히기 전':!uv?'손전등을 켜기 전':washed?(soap?'비누로 씻은 뒤 적게 남은 형광 로션':'물로 씻은 뒤 남아 있는 형광 로션'):'악수로 옮겨 온 형광 로션'}"><defs><clipPath id="hand-${id}"><path d="${shape}"/></clipPath></defs><rect width="260" height="290" fill="${uv?'#172942':'#f4f9fb'}"/><path d="${shape}" fill="${uv?'#8b8198':'#e7baa0'}" stroke="${uv?'#bdb0cf':'#bd8c70'}" stroke-width="2"/><path d="M105 206Q140 175 178 194M102 178Q130 164 155 175" fill="none" stroke="#b58271" stroke-width="2"/>${Array.from({length:n},(_,i)=>`<circle cx="${83+i*37%104}" cy="${70+i*29%167}" r="${5+i%4}" fill="#b6f678" opacity=".87" clip-path="url(#hand-${id})"/>`).join('')}</svg>`;
 }
 function hands(){ $('waterHand').innerHTML=hand(false,'water');$('soapHand').innerHTML=hand(true,'soap');$('wash').disabled=!applied||washed;$('applyLotion').disabled=applied;$('uv').setAttribute('aria-pressed',String(uv));$('uv').textContent=uv?'확인용 손전등 끄기':'확인용 손전등 켜기';$('washObservation').textContent=!applied?'같은 양의 형광 로션을 두 손 모형에 묻힙니다.':!washed?'악수로 옮겨 온 로션을 손전등으로 확인한 뒤 두 방법으로 씻어 보세요.':!uv?'두 손을 각각 30초 동안 씻었습니다. 손전등을 켜서 남은 로션을 비교하세요.':'같은 시간 동안 씻었을 때 어느 손에 형광 로션이 더 적게 남았는지 비교하세요.';}
 document.querySelectorAll('[data-activity]').forEach(b=>b.onclick=()=>{document.querySelectorAll('[data-activity]').forEach(n=>n.setAttribute('aria-pressed',String(n===b)));document.querySelectorAll('[data-panel]').forEach(p=>p.hidden=p.dataset.panel!==b.dataset.activity);});
 $('distance').oninput=e=>{stopSpray();distance=+e.target.value;sprayed=false;sprayScene();};
 $('spray').onclick=()=>{stopSpray();sprayed=true;if(reduced())sprayScene();else animateSpray();};
 $('newPaper').onclick=()=>{stopSpray();sprayed=false;sprayScene();};
 $('nextRound').onclick=()=>{if(round>=4)return;marked=api.contact(marked,pairs);round++;pairs=[];chosen=null;people();};$('clearPairs').onclick=()=>{pairs=[];chosen=null;people();};$('resetContact').onclick=()=>{round=0;marked=[0];pairs=[];chosen=null;people();};
 $('applyLotion').onclick=()=>{applied=true;hands();};$('uv').onclick=()=>{uv=!uv;hands();};$('wash').onclick=()=>{washed=true;hands();};$('resetHands').onclick=()=>{applied=false;washed=false;uv=false;hands();};sprayScene();people();hands();
})();
