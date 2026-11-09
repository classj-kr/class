(function(){
 'use strict';const lab=document.querySelector('.acoustic-lab');if(!lab)return;const M=window.ScienceAcoustic,$=id=>document.getElementById(id);let s=M.create(),last=0,raf=0;
 const text=(x,y,t,anchor='start',cls='')=>`<text x="${x}" y="${y}" text-anchor="${anchor}"${cls?` class="${cls}"`:''}>${t}</text>`;
 const line=(x,y,x2,y2,color='#94afba',width=1,extra='')=>`<line x1="${x}" y1="${y}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${width}"${extra}/>`;
 const reduce=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
 function fit(){if(window.scienceNormalizeFigure)return;for(const svg of lab.querySelectorAll('svg')){const scale=svg.getBoundingClientRect().width/680;if(scale)for(const t of svg.querySelectorAll('text'))t.style.fontSize=15/scale+'px';}}
 // 스피커(버저): 상자 안의 원뿔 진동판이 오른쪽(관 입구)을 향한다. 진동판만 따로 움직인다.
 function speaker(x,y){return `<g><rect x="${x}" y="${y-56}" width="44" height="112" rx="7" fill="#5c6f7b" stroke="#3a4a54" stroke-width="2"/><rect x="${x+6}" y="${y+56}" width="32" height="10" rx="2" fill="#7b8b94"/>`+
  `<g class="ac-cone"><path d="M${x+40} ${y-46}L${x+58} ${y-34}V${y+34}L${x+40} ${y+46}Z" fill="#cfd8dc" stroke="#55656f" stroke-width="2" stroke-linejoin="round"/><ellipse cx="${x+60}" cy="${y}" rx="5" ry="15" fill="#8b9aa3" stroke="#55656f" stroke-width="1.5"/></g></g>`;}
 // 진동수 측정기: 화면에 파형, 잰 뒤에는 진동수 숫자
 function meter(x,y){const w=176,h=64;let wave='';for(let i=0;i<=120;i++){const xx=i*2.4,yy=Math.sin(i/120*Math.PI*2*6)*13;wave+=(i?'L':'M')+xx.toFixed(1)+' '+yy.toFixed(1);}
  return `<g><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="#e9eef1" stroke="#7d909a" stroke-width="2"/><rect x="${x+8}" y="${y+8}" width="${w-60}" height="${h-16}" rx="4" fill="#1f3a44"/>`+
  `<clipPath id="acScope"><rect x="${x+8}" y="${y+8}" width="${w-60}" height="${h-16}"/></clipPath><g clip-path="url(#acScope)"><g class="ac-wave" data-x="${x+8}" data-y="${y+h/2}" transform="translate(${x+8} ${y+h/2})"><path d="${wave}" fill="none" stroke="${s.powered?'#7ee0b4':'#3f6170'}" stroke-width="2"/></g></g>`+
  `<circle cx="${x+w-26}" cy="${y+22}" r="9" fill="${s.powered?'#e2683c':'#b9c4ca'}" stroke="#6b7c85"/>`+text(x+w+14,y+h/2+6,s.measured?s.frequency+' Hz':'진동수 측정기','start',s.measured?'ac-freq':'')+`</g>`;}
 function scene(){const tube=s.mode==='tube',max=tube?.65:.3,x=v=>90+v/max*500,end=tube?x(s.position):590,k=2*Math.PI/M.wavelength(s),a=M.amplitude(s),TY=168;
  let body=`<defs><linearGradient id="acGlass" x2="0" y2="1"><stop stop-color="#dcedf3"/><stop offset=".3" stop-color="#f7fbfc"/><stop offset=".75" stop-color="#e6f1f5"/><stop offset="1" stop-color="#c6dce4"/></linearGradient></defs>`;
  // 측정기와 스피커를 잇는 줄
  body+=meter(20,14)+`<path d="M60 92 V104 H42 V112" fill="none" stroke="#56656e" stroke-width="2.5"/>`;
  body+=speaker(20,TY);
  const limit=tube?s.position:.3;
  if(tube){
   // 한 겹 유리관(왼쪽 입구가 0 cm), 마개와 손잡이 막대
   body+=`<rect x="90" y="${TY-50}" width="520" height="100" fill="url(#acGlass)"/>`+line(90,TY-50,610,TY-50,'#7fa3b2',3)+line(90,TY+50,610,TY+50,'#7fa3b2',3)+`<rect x="606" y="${TY-56}" width="8" height="112" rx="3" fill="#9fb6c0" stroke="#7fa3b2"/>`;
   body+=`<rect x="${end+10}" y="${TY-5}" width="${662-end-10}" height="10" rx="3" fill="#a6b2b9" stroke="#76858d"/><rect x="652" y="${TY-18}" width="18" height="36" rx="5" fill="#6d7c85"/>`;
   body+=`<rect x="${end-2}" y="${TY-48}" width="14" height="96" rx="4" fill="#4b5563" stroke="#2f3740" stroke-width="1.5"/><rect x="${end+1}" y="${TY-44}" width="3" height="88" rx="1.5" fill="#7a8592"/>`;
   body+=line(end+5,TY-58,end+5,TY-51,'#4b5563',1.5)+text(end+5,TY-64,'마개','middle');
  }else{
   body+=`<rect x="590" y="${TY-70}" width="14" height="150" rx="3" fill="#b4c2c8" stroke="#677e89" stroke-width="1.5"/><path d="M572 ${TY+80}H622V${TY+88}H572Z" fill="#718995"/>`+text(597,TY-78,'반사판','middle');
  }
  // 공기 입자: 9 px 간격의 점, 앞뒤(좌우)로만 흔들린다
  const span=Math.max(0,(tube?end-3:586)-92),cols=Math.max(2,Math.floor(span/9)),ref=Math.floor(cols/2);
  for(let j=0;j<5;j++)for(let i=0;i<cols;i++){const pos=(i+.5)/cols*limit,base=x(pos),amp=s.powered?Math.sin(k*(limit-pos))*8*(tube?a:1):0;body+=`<circle class="ac-particle${i===ref&&j===2?' ac-reference':''}" cx="${base.toFixed(1)}" cy="${TY-36+j*18}" r="${i===ref&&j===2?3.6:2.4}" data-motion="${amp.toFixed(3)}"/>`;}
  // 정상파의 변위 마디·배: 소리가 충분히 클 때만 보인다
  // 마이크 방식에서는 마디·배 표시가 곧 찾을 답이므로 그리지 않는다.
  const show=s.powered&&tube&&a>.5;
  if(show){const lam=M.wavelength(s),op=tube?Math.min(1,(a-.5)*2).toFixed(2):'1';let env='',env2='';for(let i=0;i<=60;i++){const pos=i/60*limit,xx=x(pos),d=Math.abs(Math.sin(k*(limit-pos)))*40;env+=(i?'L':'M')+xx.toFixed(1)+' '+(TY-d).toFixed(1);env2+=(i?'L':'M')+xx.toFixed(1)+' '+(TY+d).toFixed(1);}
   body+=`<g opacity="${op}"><path d="${env}" fill="none" stroke="#c27a2c" stroke-width="1.6" stroke-dasharray="5 4"/><path d="${env2}" fill="none" stroke="#c27a2c" stroke-width="1.6" stroke-dasharray="5 4"/>`;
   for(let n=0;n<12;n++){const node=limit-n*lam/2;if(node<0)break;const xx=x(node);if(n>0||!tube)body+=text(xx,TY+72,'마디','middle','ac-tag');const anti=limit-(2*n+1)*lam/4;if(anti>=0&&x(anti)>104)body+=text(x(anti),TY+72,'배','middle','ac-tag');}
   body+=`</g>`;}
  if(!tube){const mic=x(s.position);body+=`<path d="M${mic} ${TY+58}V${TY+108}H${mic-30}" fill="none" stroke="#394f60" stroke-width="3"/><rect x="${mic-7}" y="${TY+34}" width="14" height="26" rx="6" fill="#d29d57" stroke="#876133"/>`+text(mic>480?mic-18:mic+18,TY+100,'마이크',mic>480?'end':'start');}
  body+=text(48,TY+90,'버저','middle');
  const ry=314;body+=line(90,ry,590,ry,'#678896',2);
  const step=tube?.1:.05;for(let n=0;n<=max+.0001;n+=step){const xx=x(n);body+=line(xx,ry,xx,ry+9)+text(xx,ry+33,Math.round(n*100),'middle');}body+=text(340,415,tube?'위치 (cm) · 왼쪽 입구가 0':'위치 (cm) · 스피커가 0','middle');
  const pointer=x(s.position);body+=line(pointer,ry-26,pointer,ry+12,'#c7853d',2)+`<path d="M${pointer-5} ${ry-22}L${pointer} ${ry-31}L${pointer+5} ${ry-22}Z" fill="#c7853d"/>`;
  for(const [i,r]of s.records.entries()){const xx=x(r.position);body+=line(xx,ry+49,xx,ry-5,'#286e79',2)+text(xx,ry+64,String(i+1),'middle');}
  $('acScene').innerHTML=`<svg viewBox="0 0 680 446" role="img" aria-label="${tube?'길이를 조절하는 한쪽 막힌 관':'반사판 앞에서 이동하는 마이크'}">${body}</svg>`;fit();animateParticles();
 }
 function animateParticles(){const w=Math.sin(s.phase);for(const p of lab.querySelectorAll('[data-motion]'))p.setAttribute('transform',`translate(${Number(p.dataset.motion)*w},0)`);
  const cone=lab.querySelector('.ac-cone');if(cone)cone.setAttribute('transform',`translate(${s.powered?(1.6*w).toFixed(2):0},0)`);
  const wave=lab.querySelector('.ac-wave');if(wave){const x0=Number(wave.dataset.x),shift=s.powered?-((s.phase*7)%48):0;wave.setAttribute('transform',`translate(${(x0+shift).toFixed(2)} ${wave.dataset.y})`);}}
 function status(t){$('acStatus').textContent=t;}
 function render(){const tube=s.mode==='tube';$('acMode').value=s.mode;$('acFrequency').value=s.frequency;$('acFrequencyLabel').hidden=!tube;$('acPower').textContent=s.powered?'소리 멈추기':'소리 발생시키기';$('acPower').setAttribute('aria-pressed',String(s.powered));$('acPosition').min=tube?15:0;$('acPosition').max=tube?650:300;$('acPosition').value=Math.round(s.position*1000);$('acPositionLabel').textContent=tube?'버저에서 마개까지':'스피커에서 마이크까지';$('acPositionValue').textContent=(s.position*100).toFixed(1)+' cm';$('acFrequencyRead').textContent=s.measured?s.frequency+' Hz':'—';const a=Math.round(M.amplitude(s)*100);$('acAmplitude').textContent=s.powered?String(a):'—';$('acMeter').value=a;$('acMeasure').disabled=!s.powered;$('acRecord').disabled=!s.powered||!s.measured||s.records.length>=3;
 $('acMethodNote').textContent=tube?'마개를 천천히 빼내며 소리가 가장 큰 세 위치를 찾으세요.':'반사판 쪽에서 스피커 쪽으로 마이크를 옮기며 소리가 가장 작은 세 위치를 찾으세요.';
 $('acCalculationHint').textContent=tube?'짧은 관에서의 끝 보정을 줄이려면, 두 번째와 세 번째 위치의 차를 사용하세요.':'이웃한 작은 소리 지점의 간격 두 개를 비교하고 평균을 사용하세요.';
 $('acSteps').innerHTML=[['소리 발생',s.powered],['진동수 측정',s.measured],['위치 '+s.records.length+'개',s.records.length===3]].map(([t,yes])=>`<span class="${yes?'done':''}">${yes?'✓ ':''}${t}</span>`).join('');
 $('acRecords').innerHTML=s.records.length?`<table><caption>측정한 위치</caption><thead><tr><th>차례</th><th>위치 (cm)</th><th>소리 크기</th><th>수정</th></tr></thead><tbody>${s.records.map((r,i)=>`<tr><td>${i+1}</td><td>${(r.position*100).toFixed(1)}</td><td>${Math.round(r.amplitude*100)}</td><td><button data-remove="${i}" aria-label="${i+1}번 측정값 삭제">삭제</button></td></tr>`).join('')}</tbody></table>`:'<p>현재 위치를 넣으면 눈금과 소리 크기를 비교할 수 있습니다.</p>';scene();loop();
 }
 function invalidate(){ $('acResult').textContent='진동수와 길이를 측정한 뒤 파장과 음속을 구하세요.';}
 function reset(mode=s.mode){s=M.create(mode);$('acWave').value=0;$('acSpeed').value=0;invalidate();render();status('소리를 발생시키고 진동수를 측정하세요.');}
 $('acMode').onchange=()=>reset($('acMode').value);$('acFrequency').onchange=()=>{s=M.create();s.frequency=Number($('acFrequency').value);invalidate();render();status('진동수가 바뀌었습니다. 다시 측정해 비교하세요.');};
 $('acPower').onclick=()=>{s.powered=!s.powered;render();status(s.powered?'위치를 조금씩 바꾸며 계기의 소리 크기를 비교하세요.':'소리를 멈췄습니다. 측정값은 남아 있습니다.');};
 $('acMeasure').onclick=()=>{if(!s.powered)return;s.measured=true;render();status('진동수를 측정했습니다. 위치를 바꾸어 세 지점을 찾으세요.');};
 function position(value){s.position=Math.min(s.mode==='tube'?.65:.3,Math.max(s.mode==='tube'?.015:0,value));render();}
 $('acPosition').oninput=()=>position(Number($('acPosition').value)/1000);$('acBack').onclick=()=>position(s.position-.001);$('acForward').onclick=()=>position(s.position+.001);
 $('acRecord').onclick=()=>{const message=M.record(s);invalidate();render();status(message||'현재 눈금과 소리 크기를 표에 넣었습니다. 이웃한 지점을 찾아 비교하세요.');};
 $('acRecords').onclick=e=>{const button=e.target.closest('[data-remove]');if(button){s.records.splice(Number(button.dataset.remove),1);invalidate();render();status('선택한 값을 지웠습니다. 위치를 다시 측정하세요.');}};
 $('acCalculate').onclick=()=>{const r=M.result(s);if(r.error){$('acResult').textContent=r.error;return;}const wavelength=Number($('acWave').value),speed=Number($('acSpeed').value);if(Math.abs(wavelength-r.wavelength)>.0011){$('acResult').textContent='이웃한 같은 종류의 지점 사이 간격은 반 파장입니다. cm를 m로 바꾸고 파장을 다시 구하세요.';return;}if(Math.abs(speed-r.speed)>1.1){$('acResult').textContent='측정한 진동수에 파장(m)을 곱해 m/s로 계산하세요.';return;}$('acResult').textContent=`파장 ${r.wavelength.toFixed(3)} m, 음속 ${r.speed.toFixed(1)} m/s입니다. 다른 진동수나 측정 방법에서도 비교해 보세요.`;};
 $('acReset').onclick=()=>reset();new ResizeObserver(fit).observe($('acScene'));window.__acousticResonance={getState:()=>structuredClone(s)};
 // 소리가 날 때만 움직인다. 멈추면 그림도 멈춘다.
 function loop(){if(s.powered&&!raf&&!reduce()){last=0;raf=requestAnimationFrame(frame);}}
 function frame(t){raf=0;if(!s.powered)return;const dt=last?Math.min((t-last)/1000,.08):0;last=t;if(!document.hidden){s.phase+=dt*6;animateParticles();}raf=requestAnimationFrame(frame);}
 reset();
})();
