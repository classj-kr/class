document.addEventListener('DOMContentLoaded',()=>{'use strict';
 const M=window.MoleWeighingModel,$=id=>document.getElementById(id),host=$('mwLab');if(!host)return;let s=M.create(),timer;
 const format=x=>x.toFixed(2).replace('-','−'),message=t=>$('mwStatus').textContent=t;
 $('mwSamples').innerHTML=M.specimens.map(r=>`<button data-mw-sample="${r.id}" aria-pressed="false">${r.name}<small>${r.formula}</small></button>`).join('');
 $('mwGoals').innerHTML=M.goals.map(n=>`<button data-mw-goal="${n}" aria-pressed="false">${n} mol</button>`).join('');
 $('mwSteps').innerHTML=M.steps.map(n=>`<button data-mw-step="${n}" aria-pressed="false">${n} g</button>`).join('');
 const reasons={'container':'시료를 담을 빈 용기를 먼저 올리세요.','power':'저울 전원을 켜세요.','level':'수평계의 기포가 가운데에 오도록 수평을 맞추세요.','settle':'저울의 표시가 안정될 때까지 기다리세요.','empty':'현재 용기에 담긴 양보다 많이 덜어낼 수 없습니다.','capacity':'저울은 용기를 포함해 500 g까지 잴 수 있습니다.','container-mass':'표시에 용기의 질량이 포함되어 있습니다. 시료를 비운 뒤 빈 용기를 올리고 영점을 맞추세요.','loaded-tare':'시료가 있는 채 영점을 맞추면 그 뒤에 더 넣은 양만 표시됩니다. 시료를 비우고 빈 용기의 영점을 다시 맞추세요.'};
 function stable(){clearTimeout(timer);render();timer=setTimeout(()=>{M.settle(s);render();},400);}
 function render(){
  const r=M.specimen(s),liquid=r.phase==='liquid',value=M.reading(s);host.dataset.sample=s.sample;host.dataset.power=String(s.power);host.dataset.level=String(s.level);
  for(const b of host.querySelectorAll('[data-mw-sample]'))b.setAttribute('aria-pressed',String(b.dataset.mwSample===s.sample));for(const b of host.querySelectorAll('[data-mw-goal]'))b.setAttribute('aria-pressed',String(+b.dataset.mwGoal===s.goal));for(const b of host.querySelectorAll('[data-mw-step]'))b.setAttribute('aria-pressed',String(+b.dataset.mwStep===s.step));
  $('mwTarget').textContent=`${r.name} ${s.goal} mol`; $('mwFormula').textContent=`${r.formula} · 원자량 ${r.atoms}`;$('mwShowCalculation').setAttribute('aria-expanded',String(s.calculation));$('mwCalculation').hidden=!s.calculation;$('mwCalculation').textContent=`몰질량 ${r.M.toFixed(1)} g/mol × ${s.goal} mol = ${format(M.target(s))} g`;
  $('mwDisplay').textContent=!s.power?'꺼짐':!s.level?'수평 조절':!s.settled?'···':format(value);$('mwUnit').hidden=!s.power||!s.level||!s.settled;
  $('mwPower').textContent=s.power?'전원 끄기':'전원 켜기';$('mwPower').setAttribute('aria-pressed',String(s.power));$('mwLevel').disabled=s.level;$('mwLevel').textContent=s.level?'수평 맞춤':'수평 맞추기';$('mwPlace').disabled=s.pan;$('mwPlace').textContent=liquid?'빈 비커 올리기':'빈 질량 접시 올리기';$('mwEmpty').disabled=!s.pan||!s.mass;
  $('mwContainer').textContent=liquid?'비커 · 42.00 g':'질량 접시 · 8.00 g';$('mwReadState').textContent=!s.power?'전원을 켜고 수평을 맞추세요.':!s.level?'수평계의 기포를 확인하세요.':!s.settled?'측정 중':'안정 · 최소 표시 0.01 g';
  $('mwBubble').setAttribute('cx',s.level?'84':'102');$('mwVessel').style.opacity=s.pan?'1':'0';$('mwBeaker').style.display=liquid?'':'none';$('mwDish').style.display=liquid?'none':'';
  const amount=Math.min(1,s.mass/(liquid?65:190)),height=liquid?Math.max(2,amount*112):Math.max(2,Math.sqrt(amount)*68);
  $('mwLiquid').setAttribute('d',`M166 ${215-height}H294V220Q294 227 286 227H174Q166 227 166 220Z`);$('mwLiquid').style.opacity=s.mass&&liquid?'.65':'0';
  $('mwSolid').setAttribute('d',`M151 225Q168 ${223-height*.7} 184 ${223-height*.72}Q220 ${218-height} 238 ${222-height*.6}Q259 ${215-height*.7} 281 225Z`);$('mwSolid').setAttribute('fill',r.color||'#eef5f8');$('mwSolid').style.opacity=s.mass&&!liquid&&r.phase!=='metal'?'1':'0';
  $('mwMetal').style.opacity=s.mass&&r.phase==='metal'?'1':'0';$('mwMetal').setAttribute('fill',r.color||'#a5b8c5');$('mwMetal').setAttribute('transform',`translate(0 ${-Math.min(12,s.mass/5)})`);
  $('mwResults').hidden=!M.specimens.some(r=>s.results[r.id+'@'+s.goal]);
  $('mwRows').innerHTML=M.specimens.filter(r=>s.results[r.id+'@'+s.goal]).map(r=>{const a=s.results[r.id+'@'+s.goal];return`<tr><th scope="row">${r.name}<small>${r.formula}</small></th><td>${a?format(a.mass)+' g':'—'}</td><td>${a?s.goal+' mol':'—'}</td></tr>`;}).join('');$('mwTableCaption').textContent=`${s.goal} mol씩 덜어 잰 결과`;
 }
 host.addEventListener('click',e=>{const sample=e.target.closest('[data-mw-sample]'),goal=e.target.closest('[data-mw-goal]'),step=e.target.closest('[data-mw-step]');if(sample){clearTimeout(timer);M.select(s,sample.dataset.mwSample);message('새 시료의 빈 용기를 올리고 영점을 맞추세요.');render();}if(goal){M.goal(s,+goal.dataset.mwGoal);message('목표 몰수가 바뀌었습니다. 같은 용기에서 시료의 양을 조절할 수 있습니다.');render();}if(step){s.step=+step.dataset.mwStep;render();}});
 $('mwPower').onclick=()=>{s.power=!s.power;render();};$('mwLevel').onclick=()=>{s.level=true;message('기포가 가운데에 왔습니다.');render();};$('mwPlace').onclick=()=>{if(M.place(s)){message('빈 용기를 올렸습니다. 표시가 안정되면 영점을 맞추세요.');stable();}};
 $('mwTare').onclick=()=>{const r=M.zero(s);message(r.ok?(s.mass?'현재 용기와 시료를 합한 질량을 0으로 맞췄습니다.':'현재 올려 둔 질량을 0으로 맞췄습니다.'):reasons[r.reason]);render();};
 for(const[id,sign]of [['mwAdd',1],['mwRemove',-1]])$(id).onclick=()=>{const r=M.change(s,sign*s.step);if(r.ok){message('저울 표시를 보고 목표 양에 맞게 조절하세요.');stable();}else message(reasons[r.reason]);};
 $('mwEmpty').onclick=()=>{s.mass=0;s.settled=false;message('용기만 남았습니다. 영점을 다시 맞출 수 있습니다.');stable();};$('mwShowCalculation').onclick=()=>{s.calculation=!s.calculation;render();};
 $('mwCheck').onclick=()=>{const r=M.check(s);message(r.ok?`${M.specimen(s).name} ${format(r.mass)} g은 ${s.goal} mol입니다. 다른 물질과 질량을 비교하세요.`:reasons[r.reason]||`${format(r.mass)} g ÷ ${M.specimen(s).M} g/mol = ${r.moles.toFixed(3)} mol입니다. 목표보다 ${r.reason==='too-little'?'적으므로 더 넣으세요.':'많으므로 덜어내세요.'}`);render();};
 function reset(){clearTimeout(timer);s=M.create();message('흑연 0.5 mol의 질량을 구하고, 저울로 그 양을 맞춰 보세요.');render();}$('mwReset').onclick=reset;
 window.__moleWeighing={getState:()=>JSON.parse(JSON.stringify(s)),model:M,render};reset();
});
