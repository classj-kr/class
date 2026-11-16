(function(){'use strict';const M=window.OsmosisMassModel,$=id=>document.getElementById(id);if(!$('omBalance'))return;let s=M.create(),notice='';
 // Visual-only animation (the model state changes at once): pieces drop into the solutions and soak as a time-lapse,
 // or are lifted out dripping. Size change is drawn 2.5 times larger than the real mass change so it can be seen.
 let anim=null,animId=0;const ease=t=>t<=0?0:t>=1?1:t*t*(3-2*t),seg=(k,a,b)=>ease((k-a)/(b-a)),lerp=(a,b,t)=>a+(b-a)*t;
 const reduce=()=>!!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
 function play(kind,dur){cancelAnimationFrame(animId);animId=0;anim=null;if(reduce()){render();return;}const t0=performance.now();anim={kind,k:0};const f=now=>{anim.k=Math.min(1,(now-t0)/dur);render();if(anim.k>=1){anim=null;animId=0;render();}else animId=requestAnimationFrame(f);};animId=requestAnimationFrame(f);}
 const visual=i=>1+(M.final[i]/M.initial[i]-1)*2.5;
 const soak=()=>s.phase==='before'?0:anim?.kind==='immerse'?seg(anim.k,.3,1):1;
 const pieceScale=i=>lerp(1,visual(i),soak());
 const limpOf=sc=>(1-sc)/(1-visual(2));
 const radish=(x,y,id,{wet=false,scale=1}={})=>{const limp=limpOf(scale);return `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) translate(0 26) scale(${scale.toFixed(3)}) translate(0 -26)"><defs><linearGradient id="omRadish${id}" x2="0" y2="1"><stop stop-color="#fffffa"/><stop offset=".55" stop-color="${limp>.4?'#efebcb':'#f3f1d9'}"/><stop offset="1" stop-color="${limp>.4?'#cfcf9c':'#d7d9ae'}"/></linearGradient></defs><path d="M-28 -12L4 -21L31 -10L-2 0Z" fill="${limp>.4?'#f7f4dc':'#fffef2'}" stroke="#adb58d"/><path d="M-28 -12L-2 0V26L-28 12Z" fill="#e3e4c3" stroke="#adb58d"/><path d="M-2 0L31 -10V15L-2 26Z" fill="url(#omRadish${id})" stroke="#adb58d"/><path d="M4 4V18M13 1V14M23 -3V10" stroke="#c3c8a8" opacity=".6"/>${limp>.4?'<path d="M2 9q5 2 9 -1t9 0M-24 -4q6 4 12 3" fill="none" stroke="#b6b88c" stroke-width="1.2"/>':''}${wet?'<path class="om-droplet" d="M18 22q-9 12 0 13q9 -1 0 -13" fill="#80bccd" opacity=".8"/><path d="M-20 10q-3 5 0 6q3 -1 0 -6" fill="#9ccbd8" opacity=".9"/>':''}</g>`;};
 function sample(i){
  const dipped=s.phase==='immersed',selected=s.selected===i,BX=120,BY=97,PX=40,PY=107,k=anim?.k??1;
  let piece='',drops='';
  if(!selected){
   let x=dipped?BX:PX,y=dipped?BY:PY,wet=!dipped&&s.wet[i];
   if(anim?.kind==='immerse'){const q=seg(k,0,.3);x=lerp(PX,BX,q);y=q<1?lerp(PY,BY,q)-Math.sin(q*Math.PI)*62:BY;}
   if(anim?.kind==='remove'){const q=seg(k,0,.55);x=lerp(BX,PX,q);y=lerp(BY,PY,q)-Math.sin(q*Math.PI)*62;wet=true;if(q<1)for(let d=0;d<3;d++){const p=(k*3+d*.33)%1;drops+=`<circle cx="${(x+8+d*5).toFixed(1)}" cy="${(y+28+p*24).toFixed(1)}" r="2" fill="#80bccd" opacity="${(1-p).toFixed(2)}"/>`;}}
   piece=radish(x,y,'cup'+i,{wet,scale:pieceScale(i)});
   // net water flow out of the piece while it soaks (none where the solution matches the tissue)
   if(anim?.kind==='immerse'&&k>.3&&k<.98){const n=Math.round((1-visual(i))*20);for(let d=0;d<n;d++){const p=((k-.3)*2.2+d/n)%1,a=d*2.4;drops+=`<circle cx="${(BX+Math.cos(a)*(18+p*24)).toFixed(1)}" cy="${(BY+8+Math.sin(a)*(10+p*12)).toFixed(1)}" r="2.2" fill="#3f93ad" opacity="${(.8*(1-p)).toFixed(2)}"/>`;}}
  }
  const inside=dipped&&!(anim?.kind==='immerse'&&k<.3);
  const cup=`<ellipse cx="122" cy="136" rx="61" ry="6" fill="#a1b9ac" opacity=".16"/><path d="M77 33L83 125q37 10 76 0l6 -92" fill="url(#omGlass${i})" stroke="#7ca5aa" stroke-width="2"/><path d="M81 78L84 124q37 8 74 0l4 -46" fill="#c0e0de" opacity=".75"/><ellipse cx="121" cy="78" rx="40" ry="6" fill="#d7ebdf" stroke="#a6c8c2"/><ellipse cx="121" cy="33" rx="44" ry="6" fill="none" stroke="#7ca5aa" stroke-width="2"/>`;
  const glassFront=`<path d="M81 78L84 124q37 8 74 0l4 -46" fill="#c0e0de" opacity=".3"/><path d="M91 46L95 68M94 86L96 114" stroke="#fff" stroke-width="3" opacity=".8"/>`;
  return `<svg viewBox="0 0 180 150" role="img" aria-label="${['A','B','C'][i]} 시료와 포도당 수용액"><defs><linearGradient id="omGlass${i}" x2="1" y2=".5"><stop stop-color="#c7e2e5" stop-opacity=".5"/><stop offset=".5" stop-color="#fff" stop-opacity=".8"/><stop offset="1" stop-color="#a6cbd0" stop-opacity=".6"/></linearGradient></defs><ellipse cx="41" cy="136" rx="35" ry="7" fill="#fdfefa" stroke="#a4b8a7"/>${cup}${inside?piece+drops+glassFront:glassFront+piece+drops}</svg>`;
 }
 function balance(r){const sel=s.selected,show=r.value===null?'- - - -':r.value.toFixed(2);
  return `<svg viewBox="0 0 330 245" role="img" aria-label="전자저울 위의 칭량 접시${sel===null?'':'와 무 조각'}, 표시창 ${show} g"><defs><linearGradient id="omSteel" x2="0" y2="1"><stop stop-color="#edf3f0"/><stop offset=".5" stop-color="#b8cac2"/><stop offset="1" stop-color="#e8edea"/></linearGradient><linearGradient id="omBase" x2="0" y2="1"><stop stop-color="#fff"/><stop offset="1" stop-color="#cbdcd5"/></linearGradient><linearGradient id="omDish" x2="0" y2="1"><stop stop-color="#f4fafb" stop-opacity=".9"/><stop offset="1" stop-color="#c9dfe4" stop-opacity=".9"/></linearGradient></defs><ellipse cx="161" cy="222" rx="122" ry="11" fill="#8ea99c" opacity=".16"/><path d="M68 129H264L280 193Q282 214 264 214H61Q45 214 46 195Z" fill="url(#omBase)" stroke="#83a092" stroke-width="2"/><path d="M142 104H187V130H142Z" fill="#a6bbb1"/><ellipse cx="165" cy="100" rx="88" ry="17" fill="url(#omSteel)" stroke="#7d988c" stroke-width="2"/><path d="M79 97q86 33 172 0" fill="none" stroke="#fafcf9" stroke-width="4"/>`+
   // weighing dish resting on the pan (its 12 g is what the tare removes)
   `<path d="M110 92V84H220V92Q220 101 165 101Q110 101 110 92Z" fill="url(#omDish)" stroke="#7fa3ad" stroke-width="1.5"/><ellipse cx="165" cy="84" rx="55" ry="8" fill="#eef7f9" stroke="#7fa3ad" stroke-width="1.5"/>`+
   (sel===null?'':radish(163,62,'scale',{wet:s.wet[sel],scale:s.phase==='after'?visual(sel):1}))+
   `<path d="M110 84Q165 96 220 84" fill="none" stroke="#7fa3ad" stroke-width="1.2" opacity=".7"/><rect x="97" y="150" width="122" height="42" rx="5" fill="#2b5142"/><rect x="103" y="156" width="110" height="30" rx="2" fill="#c7dfcf"/><text x="190" y="179" text-anchor="end" class="om-lcd">${show}</text><text x="196" y="179" class="om-unit">g</text><circle cx="248" cy="166" r="8" fill="#719983" stroke="#476b59"/><path d="M58 216v6M265 216v6" stroke="#506e60" stroke-width="7" stroke-linecap="round"/></svg>`;}
 function steps(){const list=[['빈 접시 영점',s.tared],['처음 질량 3개',s.before.every(x=>x!==null)],['세 시료 담그기',s.phase!=='before'],['함께 꺼내기',s.phase==='after'],['물기 닦고 나중 질량 3개',s.after.every(x=>x!==null)]],now=list.findIndex(([,d])=>!d);
  return list.map(([t,d],i)=>`<li class="${d?'done':i===now?'now':''}"${i===now?' aria-current="step"':''}><b>${d?'✓':i+1}</b>${t}</li>`).join('');}
 function render(){const r=M.reading(s);for(let i=0;i<3;i++){window.scienceScene.render($('omScene'+i),sample(i));$('omState'+i).textContent=s.selected===i?'접시 위':s.phase==='immersed'?'용액에 담긴 상태':s.wet[i]?'표면 물기 있음':s.phase==='after'?'물기 제거 완료':'담그기 전';const b=document.querySelector(`[data-om-sample="${i}"]`);b.disabled=s.phase==='immersed';b.setAttribute('aria-pressed',String(s.selected===i));b.closest('.om-sample').classList.toggle('selected',s.selected===i);}
 if($('omSteps'))$('omSteps').innerHTML=steps();
 $('omBalance').innerHTML=balance(r);$('omReading').textContent=r.value===null?'—':r.value.toFixed(2)+' g';$('omReadNote').textContent=r.reason==='wet'?'표면에 남은 용액을 닦은 뒤 측정하세요.':r.reason==='dish'?'시료와 접시를 합한 질량입니다.':s.selected===null?s.tared?'빈 접시로 영점을 맞췄습니다.':'빈 접시의 질량이 포함돼 있습니다.':`시료 ${['A','B','C'][s.selected]}의 ${s.phase==='after'?'나중':'처음'} 질량입니다.`;
 $('omClear').disabled=s.selected===null;$('omTare').disabled=s.selected!==null||s.tared;$('omBlot').disabled=s.selected===null||!s.wet[s.selected];$('omWeigh').disabled=s.selected===null;$('omImmerse').disabled=s.phase!=='before'||s.before.some(x=>x===null);$('omRemove').disabled=s.phase!=='immersed';
 $('omStatus').textContent=notice||(s.phase==='before'?'빈 접시로 영점을 맞춘 뒤 시료를 하나씩 올려 처음 질량을 측정하세요.':s.phase==='immersed'?'세 시료를 동시에 담갔습니다. 같은 시간 동안 둔 뒤 함께 꺼내세요.':'표면에 묻은 용액을 닦고 나중 질량을 재세요. 닦아 낸 표면 용액을 시료의 물 이동량에 포함하지 않습니다.');
 $('omRows').innerHTML=M.concentrations.map((c,i)=>{const d=M.comparison(s,i);return `<tr><th scope="row">${c.toFixed(1)} M</th><td>${s.before[i]===null?'—':s.before[i].toFixed(2)}</td><td>${s.after[i]===null?'—':s.after[i].toFixed(2)}</td><td>${d?(d.percent>0?'+':'')+d.percent.toFixed(1)+'%':'—'}</td></tr>`;}).join('');
 $('omConclusion').textContent=s.after.every(x=>x!==null)?'이 비교에서는 0.5 M에서 질량 변화가 없고, 1.0 M에서 2.5%, 2.0 M에서 10.0% 감소했습니다. 질량 감소는 무에서 용액으로 물이 순이동한 결과로 해석합니다.':'각 시료의 처음 질량과 나중 질량을 모두 측정해 비교하세요.';
 }
 for(const b of document.querySelectorAll('[data-om-sample]'))b.addEventListener('click',()=>{M.select(s,+b.dataset.omSample);notice='';render();});
 for(const[id,fn]of [['omClear',()=>M.clear(s)],['omTare',()=>M.tare(s)],['omBlot',()=>M.blot(s)]])$(id).addEventListener('click',()=>{fn();notice='';render();});
 $('omImmerse').addEventListener('click',()=>{if(M.immerse(s)){notice='';play('immerse',3200);}else render();});
 $('omRemove').addEventListener('click',()=>{if(M.remove(s)){notice='';play('remove',1500);}else render();});
 $('omWeigh').addEventListener('click',()=>{const r=M.weigh(s);notice=r.ok?`시료 ${['A','B','C'][s.selected]}의 질량 ${r.value.toFixed(2)} g을 측정했습니다.`:r.reason==='wet'?'표면 물기를 닦지 않으면 붙어 있는 용액의 질량까지 포함됩니다. 먼저 표면 물기를 제거하세요.':'빈 접시로 영점을 맞춰야 무 조각의 질량만 비교할 수 있습니다. 시료를 내려놓고 영점을 맞추세요.';render();});
 $('omReset').addEventListener('click',()=>{cancelAnimationFrame(animId);animId=0;anim=null;s=M.create();notice='';render();});window.__osmosisMass={getState:()=>JSON.parse(JSON.stringify(s))};render();
})();
