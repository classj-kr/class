(function(){
 'use strict';const lab=document.querySelector('.acoustic-lab');if(!lab)return;const M=window.ScienceAcoustic,$=id=>document.getElementById(id);let s=M.create(),last=0;
 const text=(x,y,t,anchor='start')=>`<text x="${x}" y="${y}" text-anchor="${anchor}">${t}</text>`;
 const line=(x,y,x2,y2,color='#94afba',width=1)=>`<line x1="${x}" y1="${y}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${width}"/>`;
 function fit(){for(const svg of lab.querySelectorAll('svg')){const scale=svg.getBoundingClientRect().width/680;if(scale)for(const t of svg.querySelectorAll('text'))t.style.fontSize=15/scale+'px';}}
 function scene(){const tube=s.mode==='tube',max=tube?.65:.3,x=v=>90+v/max*500,end=tube?x(s.position):590,k=2*Math.PI/M.wavelength(s),a=M.amplitude(s);let body=`<defs><linearGradient id="acGlass" x2="0" y2="1"><stop stop-color="#e4f3f8" stop-opacity=".8"/><stop offset=".45" stop-color="white" stop-opacity=".25"/><stop offset="1" stop-color="#b9d7e0" stop-opacity=".65"/></linearGradient></defs>`;
 // Only the apparatus position is drawn to scale; the housing and supports are schematic.
 body+=text(35,35,tube?'버저 → 마개 사이의 공기':'스피커와 반사판 사이 · 30 cm');
 if(tube){body+=`<rect x="80" y="110" width="530" height="118" rx="15" fill="url(#acGlass)" stroke="#8db1bf" stroke-width="3"/><rect x="${end}" y="124" width="${640-end}" height="90" rx="5" fill="url(#acGlass)" stroke="#a2bdc7" stroke-width="2"/><rect x="${end-4}" y="115" width="9" height="108" rx="3" fill="#637883"/>`;
 body+=text(590,82,'마개 이동', 'end')+line(520,92,end,114,'#6f8995');
 }else{body+=`<rect x="588" y="86" width="15" height="164" rx="3" fill="#a9b9c0" stroke="#677e89"/><path d="M570 250H625V258H570Z" fill="#718995"/>`+text(595,70,'반사판','middle');}
 body+=`<rect x="46" y="121" width="31" height="97" rx="7" fill="#274953"/><ellipse cx="78" cy="169" rx="11" ry="45" fill="#4c798b"/><ellipse cx="80" cy="169" rx="6" ry="28" fill="#223f4b"/>`;
 const limit=tube?s.position:.3;
 for(let j=0;j<5;j++)for(let i=0;i<65;i++){const pos=(i+.5)/65*limit,base=x(pos),amp=s.powered?Math.sin(k*(limit-pos))*7*(tube?a:1):0;body+=`<circle class="ac-particle${i===32&&j===2?' ac-reference':''}" cx="${base}" cy="${137+j*16}" r="2.2" data-motion="${amp}"/>`;}
 if(!tube){const mic=x(s.position);body+=`<path d="M${mic} 227V276H${mic-30}" fill="none" stroke="#394f60" stroke-width="3"/><rect x="${mic-6}" y="204" width="12" height="24" rx="5" fill="#d29d57" stroke="#876133"/>`+text(mic>480?mic-18:mic+18,247,'마이크',mic>480?'end':'start');}
 const ry=310;body+=line(90,ry,590,ry,'#678896',2);
 const step=tube?.1:.05;for(let n=0;n<=max+.0001;n+=step){const xx=x(n);body+=line(xx,ry,xx,ry+9)+text(xx,ry+33,Math.round(n*100),'middle');}body+=text(340,411,'위치 (cm) · 왼쪽 입구가 0','middle');
 const pointer=x(s.position);body+=line(pointer,280,pointer,322,'#c7853d',2)+`<path d="M${pointer-5} 284L${pointer} 275L${pointer+5} 284Z" fill="#c7853d"/>`;
 for(const [i,r]of s.records.entries()){const xx=x(r.position);body+=line(xx,ry+49,xx,ry-5,'#286e79',2)+text(xx,ry+62,String(i+1),'middle');}
 $('acScene').innerHTML=`<svg viewBox="0 0 680 446" role="img" aria-label="${tube?'길이를 조절하는 한쪽 막힌 관':'반사판 앞에서 이동하는 마이크'}">${body}</svg>`;fit();animateParticles();
 }
 function animateParticles(){for(const p of lab.querySelectorAll('[data-motion]'))p.setAttribute('transform',`translate(${Number(p.dataset.motion)*Math.sin(s.phase)},0)`);}
 function status(t){$('acStatus').textContent=t;}
 function render(){const tube=s.mode==='tube';$('acMode').value=s.mode;$('acFrequency').value=s.frequency;$('acFrequencyLabel').hidden=!tube;$('acPower').textContent=s.powered?'소리 멈추기':'소리 발생시키기';$('acPower').setAttribute('aria-pressed',String(s.powered));$('acPosition').min=tube?15:0;$('acPosition').max=tube?650:300;$('acPosition').value=Math.round(s.position*1000);$('acPositionLabel').textContent=tube?'버저에서 마개까지':'스피커에서 마이크까지';$('acPositionValue').textContent=(s.position*100).toFixed(1)+' cm';$('acFrequencyRead').textContent=s.measured?s.frequency+' Hz':'—';const a=Math.round(M.amplitude(s)*100);$('acAmplitude').textContent=s.powered?String(a):'—';$('acMeter').value=a;$('acMeasure').disabled=!s.powered;$('acRecord').disabled=!s.powered||!s.measured||s.records.length>=3;
 $('acMethodNote').textContent=tube?'마개를 천천히 빼내며 소리가 가장 큰 세 위치를 찾으세요.':'반사판 쪽에서 스피커 쪽으로 마이크를 옮기며 소리가 가장 작은 세 위치를 찾으세요.';
 $('acCalculationHint').textContent=tube?'짧은 관에서의 끝 보정을 줄이려면, 두 번째와 세 번째 위치의 차를 사용하세요.':'이웃한 작은 소리 지점의 간격 두 개를 비교하고 평균을 사용하세요.';
 $('acSteps').innerHTML=[['소리 발생',s.powered],['진동수 측정',s.measured],['위치 '+s.records.length+'개',s.records.length===3]].map(([t,yes])=>`<span class="${yes?'done':''}">${yes?'✓ ':''}${t}</span>`).join('');
 $('acRecords').innerHTML=s.records.length?`<table><caption>측정한 위치</caption><thead><tr><th>차례</th><th>위치 (cm)</th><th>소리 크기</th><th>수정</th></tr></thead><tbody>${s.records.map((r,i)=>`<tr><td>${i+1}</td><td>${(r.position*100).toFixed(1)}</td><td>${Math.round(r.amplitude*100)}</td><td><button data-remove="${i}" aria-label="${i+1}번 측정값 삭제">삭제</button></td></tr>`).join('')}</tbody></table>`:'<p>현재 위치를 넣으면 눈금과 소리 크기를 비교할 수 있습니다.</p>';scene();
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
 function frame(t){if(t-last>45){if(s.powered&&!document.hidden&&!matchMedia('(prefers-reduced-motion: reduce)').matches){s.phase+=Math.min((t-last)/1000,.08)*3;animateParticles();}last=t;}requestAnimationFrame(frame);}reset();requestAnimationFrame(frame);
})();
