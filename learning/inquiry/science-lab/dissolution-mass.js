(function(){'use strict';const lab=document.querySelector('.dissolution-lab');if(!lab)return;const $=id=>document.getElementById(id);
 function start(){const M=window.ScienceDissolutionMass;if(!M){$('dmStatus').textContent='실험 그림을 불러오지 못했습니다. 페이지를 새로 고쳐 주세요.';return;}
 let s=M.create(),last=0,phase=0,raf=0,pourStart=-1;const disp={beaker:0,paper:0,rod:0},keys=['beaker','paper','rod'];
 const reduce=()=>!!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,ease=t=>t<.5?2*t*t:1-(-2*t+2)**2/2,cl=(v,a=0,b=1)=>Math.max(a,Math.min(b,v)),seg=(f,a,b)=>cl((f-a)/(b-a));
 const t=(x,y,text,anchor='middle',cls='')=>`<text x="${x}" y="${y}" style="font-size:15px" text-anchor="${anchor}" class="${cls}">${text}</text>`;
 function fit(){if(window.scienceNormalizeFigure||document.readyState!=='complete')return;const svg=$('dmScene').querySelector('svg');if(svg){const r=svg.getBoundingClientRect().width/680;if(r)for(const e of svg.querySelectorAll('text'))e.style.fontSize=15/r+'px';}}
 // Bench and balance share one tabletop; each item has a place on the bench and on the balance pan.
 const BENCH=372,PAN=300,place={beaker:[[96,BENCH],[420,PAN]],paper:[[194,BENCH],[530,PAN]],rod:[[304,BENCH],[600,PAN]]};
 function at(key){const k=ease(disp[key]),[[x0,y0],[x1,y1]]=place[key];return {x:x0+(x1-x0)*k,y:y0+(y1-y0)*k-Math.sin(Math.PI*k)*60};}
 function shownReading(){const m=M.masses(s);let total=0;for(const k of keys)if(disp[k]>=1&&s.on[k])total+=m[k];return Math.round((total+.8-s.tare)*10)/10;}
 function grains(x,y,n,w=56){let g='';for(let i=0;i<n;i++)g+=`<circle cx="${(x-w/2+(i*17)%w).toFixed(1)}" cy="${(y-(i%3)*3-Math.floor(i/9)*3).toFixed(1)}" r="2.6" fill="#f7f4ea" stroke="#c4c0ae" stroke-width=".8"/>`;return g;}
 function cube(x,y,size=22){return `<path d="M${x-size/2} ${y}v${-size}h${size}v${size}Z" fill="#efebdc" stroke="#c7c6bc"/><path d="M${x-size/2} ${y-size}l6 -5h${size}l-6 5M${x+size/2} ${y}l6 -5v${-size}l-6 5" fill="#f8f6ee" stroke="#c7c6bc"/>`;}
 function scene(now=performance.now()){
  const pf=pourStart>=0?cl((now-pourStart)/2200):1,pouring=pourStart>=0&&pf<1;
  let body=`<defs><linearGradient id="dmGlass"><stop stop-color="#b2cfdb" stop-opacity=".6"/><stop offset=".45" stop-color="#fff" stop-opacity=".15"/><stop offset="1" stop-color="#c4e0e6" stop-opacity=".5"/></linearGradient><linearGradient id="dmMetal"><stop stop-color="#9bafb7"/><stop offset=".4" stop-color="#e1eaed"/><stop offset="1" stop-color="#8199a3"/></linearGradient></defs>`;
  body+=`<rect x="0" y="${BENCH}" width="680" height="62" fill="#e9dcc5"/><path d="M0 ${BENCH}H680" stroke="#c4ad88" stroke-width="2.5"/><rect x="0" y="${BENCH+2}" width="680" height="10" fill="#dccaa9" opacity=".6"/>`;
  // electronic balance standing on the bench
  body+=`<rect x="350" y="312" width="310" height="${BENCH-312}" rx="12" fill="#e4edf0" stroke="#91a9b4" stroke-width="2"/><rect x="362" y="${PAN}" width="286" height="12" rx="4" fill="url(#dmMetal)" stroke="#a4b5bd"/><rect x="432" y="322" width="150" height="40" rx="6" fill="#d2eadf" stroke="#94b7aa"/>${t(507,349,shownReading().toFixed(1)+' g','middle','dm-digit')}`;
  // beaker with water
  const B=at('beaker'),bx=B.x,by=B.y;body+=`<path d="M${bx-48} ${by-124}V${by-9}Q${bx-48} ${by} ${bx-38} ${by}H${bx+38}Q${bx+48} ${by} ${bx+48} ${by-9}V${by-124}" fill="url(#dmGlass)" stroke="#85a9b8" stroke-width="2.5"/><path d="M${bx-45} ${by-83}H${bx+45}V${by-10}Q${bx+45} ${by-3} ${bx+35} ${by-3}H${bx-35}Q${bx-45} ${by-3} ${bx-45} ${by-10}Z" fill="#a5cfe0" opacity=".6"/><path d="M${bx+54} ${by-125}Q${bx+50} ${by-130} ${bx+46} ${by-125}" fill="none" stroke="#85a9b8" stroke-width="2"/>`;
  // solute in the beaker (falls in while pouring, shrinks while stirring)
  const inBeaker=s.poured?(pouring?seg(pf,.35,.62):1)*(1-s.progress):0;
  if(inBeaker>0){if(s.material==='sugar'){const n=22*Math.max(.15,inBeaker);body+=cube(bx-4,by-6,n);}else body+=grains(bx,by-7,Math.round(18*inBeaker),62);}
  if(s.running||s.progress>0&&s.progress<1)for(let k=0;k<3;k++)body+=`<path d="M${bx-30+k*26} ${by-14}q8 -${10+k*4} 0 -${24+k*5}" fill="none" stroke="#efe9d2" stroke-width="2.2" opacity="${(1-s.progress)*.9}"/>`;
  // paper with solute
  const P=pouring?(()=>{const go=ease(seg(pf,0,.25))*(1-ease(seg(pf,.72,1))),a=at('paper');return {x:a.x+(bx+22-a.x)*go,y:a.y+(by-150-a.y)*go,tilt:-58*ease(seg(pf,.25,.38))*(1-seg(pf,.62,.72))};})():{...at('paper'),tilt:0};
  const px=P.x,py=P.y,full=!s.poured||pouring&&pf<.36;
  body+=`<g transform="rotate(${P.tilt.toFixed(1)} ${px-40} ${py-10})"><path d="M${px-44} ${py-12}L${px-30} ${py-30}L${px+46} ${py-22}L${px+38} ${py}L${px-34} ${py+2}Z" fill="#fff" stroke="#aebbc3" stroke-width="2"/>${full?(s.material==='sugar'?cube(px+2,py-8):grains(px+2,py-9,24,40)):''}</g>`;
  if(pouring&&pf>.3&&pf<.6){for(let i=0;i<(s.material==='sugar'?1:12);i++){const q=cl((pf-.3-i*.012)/.18);if(q>0&&q<1){const yy=py-14+q*q*(by-14-(py-14));body+=s.material==='sugar'?cube(bx-6,yy,20):`<circle cx="${(bx-10+(i*7)%22).toFixed(1)}" cy="${yy.toFixed(1)}" r="2.6" fill="#f7f4ea" stroke="#c4c0ae" stroke-width=".8"/>`;}}}
  // glass rod: lying down, standing in the beaker, or stirring
  const rodInBeaker=s.poured&&s.on.rod&&s.on.beaker&&disp.rod>=1&&disp.beaker>=1;
  if(s.running)body+=`<path d="M${(bx+Math.sin(phase)*18).toFixed(1)} ${by-12}L${(bx+28+Math.sin(phase)*8).toFixed(1)} ${by-158}" fill="none" stroke="#7aa1b5" stroke-width="6" stroke-linecap="round" opacity=".75"/>`;
  else if(rodInBeaker)body+=`<path d="M${bx+20} ${by-10}L${bx+38} ${by-160}" fill="none" stroke="#7aa1b5" stroke-width="6" stroke-linecap="round" opacity=".75"/>`;
  else{const R=at('rod');body+=`<path d="M${R.x-40} ${R.y-5}L${R.x+40} ${R.y-14}" fill="none" stroke="#8faeba" stroke-width="7" stroke-linecap="round"/><path d="M${R.x-40} ${R.y-7}L${R.x+40} ${R.y-16}" fill="none" stroke="#dcebf0" stroke-width="2"/>`;}
  // short names beside each item, kept clear of the rod
  body+=t(bx-50,by-136,s.poured?'비커':'물이 든 비커','start');
  if(!pouring)body+=t(px,py-44,s.poured?'빈 시약포지':s.material==='salt'?'소금':'각설탕');
  if(!s.running&&!rodInBeaker){const R=at('rod');body+=t(R.x,R.y-30,'유리 막대');}
  body+=t(170,BENCH+38,'실험대')+t(505,BENCH+38,'전자저울');
  window.scienceScene.render($('dmScene'),`<svg viewBox="0 110 680 330" role="img" aria-label="실험대 위의 비커·시약포지·유리 막대와 전자저울, 저울에 올려놓은 기구의 무게">${body}</svg>`);fit();
 }
 function busy(){return s.running||pourStart>=0||keys.some(k=>disp[k]!==(s.on[k]?1:0));}
 function frame(now){raf=0;const dt=last?Math.min((now-last)/1000,.08):0;last=now;
  if(s.running&&!document.hidden){phase+=dt*5;M.step(s,dt/6);if(!s.running)render();}
  for(const k of keys){const goal=s.on[k]?1:0;if(disp[k]!==goal)disp[k]=goal>disp[k]?Math.min(goal,disp[k]+dt/.7):Math.max(goal,disp[k]-dt/.7);}
  if(pourStart>=0&&now-pourStart>=2200){pourStart=-1;render();return;}
  scene(now);if(busy())raf=requestAnimationFrame(frame);else last=0;}
 function kick(){if(reduce()){for(const k of keys)disp[k]=s.on[k]?1:0;pourStart=-1;}if(!raf&&busy()){last=0;raf=requestAnimationFrame(frame);}}
 function render(message){for(const [key,id]of [['beaker','dmBeaker'],['paper','dmPaper'],['rod','dmRod']]){$(id).setAttribute('aria-pressed',String(s.on[key]));$(id).disabled=s.running;}const loaded=Object.values(s.on).some(Boolean);$('dmMaterial').value=s.material;$('dmMaterial').disabled=!!s.before;$('dmPaper').textContent=s.poured?'빈 시약포지':'용질을 담은 시약포지';$('dmBeaker').textContent=s.poured?'용액이 든 비커':'물이 든 비커';$('dmPour').disabled=s.poured||!s.before;$('dmStir').disabled=!s.poured||s.progress>=1||loaded;$('dmStir').textContent=s.running?'젓기 잠시 멈추기':'유리 막대로 천천히 젓기';$('dmStep').disabled=!s.poured||s.progress>=1||loaded;$('dmRead').disabled=s.running;$('dmZero').disabled=s.running;$('dmClear').disabled=s.running;
  $('dmSteps').innerHTML=[['영점',s.zeroed],['용해 전 측정',!!s.before],['완전히 용해',s.progress===1],['용해 후 측정',!!s.after]].map(([t,yes])=>`<span class="${yes?'done':''}">${yes?'✓ ':''}${t}</span>`).join('');$('dmStatus').textContent=message||(s.after?M.compare(s):s.running?'유리 막대로 천천히 젓고 있습니다.':s.progress===1?'용질이 보이지 않습니다. 빈 시약포지·유리 막대를 빼놓지 않고 다시 올려 무게를 읽으세요.':s.poured?'용질을 모두 넣었습니다. 천천히 저어 용해하세요.':s.before?'처음 무게를 읽었습니다. 모두 내려놓은 뒤 용질을 넣으세요.':'평평한 곳에 놓인 빈 저울의 영점을 맞추고 세 기구를 올려놓으세요.');
  const names={beaker:'비커',paper:'시약포지',rod:'유리 막대'};$('dmReadings').innerHTML=s.before||s.after?`<table><caption>용해 전후 무게 비교</caption><thead><tr><th>시점</th><th>저울 위의 기구</th><th>무게</th></tr></thead><tbody>${['before','after'].filter(k=>s[k]).map(k=>`<tr><td>${k==='before'?'용해 전':'용해 후'}</td><td>${Object.keys(s[k].on).filter(a=>s[k].on[a]).map(a=>names[a]).join(' · ')||'없음'}</td><td>${s[k].mass.toFixed(1)} g</td></tr>`).join('')}</tbody></table>`:'';kick();scene();}
 $('dmMaterial').onchange=()=>{s=M.create($('dmMaterial').value);pourStart=-1;for(const k of keys)disp[k]=0;render();};$('dmZero').onclick=()=>{M.zero(s);render(Object.values(s.on).some(Boolean)?'올려놓은 기구까지 영점에 포함되었습니다. 전체 무게를 읽으려면 빈 저울에서 영점을 다시 맞추세요.':'빈 저울의 영점을 맞췄습니다.');};for(const [key,id]of [['beaker','dmBeaker'],['paper','dmPaper'],['rod','dmRod']])$(id).onclick=()=>{s.on[key]=!s.on[key];render();};$('dmClear').onclick=()=>{for(const k in s.on)s.on[k]=false;render();};$('dmRead').onclick=()=>render(M.record(s));$('dmPour').onclick=()=>{const msg=M.pour(s);if(s.poured&&!msg)pourStart=performance.now();render(msg);};$('dmStir').onclick=()=>{s.running=!s.running;render();};$('dmStep').onclick=()=>{M.step(s);render();};$('dmReset').onclick=()=>{s=M.create(s.material);pourStart=-1;for(const k of keys)disp[k]=0;render();};new ResizeObserver(fit).observe($('dmScene'));window.__dissolutionMass={getState:()=>structuredClone(s)};
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)kick();});window.addEventListener('load',fit,{once:true});render();}
 if(window.ScienceDissolutionMass)start();else window.addEventListener('load',start,{once:true});
})();
