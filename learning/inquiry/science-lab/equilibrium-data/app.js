document.addEventListener('DOMContentLoaded',()=>{
 'use strict';const M=window.EquilibriumData,$=id=>document.getElementById(id),key='science-equilibrium-data-first-v1';
 const state={set:'a',basis:'eq',formula:'simple',computed:false},first={};try{const v=JSON.parse(localStorage.getItem(key)||'{}');for(const k of ['a','b'])if(typeof v[k]==='boolean')first[k]=v[k];}catch{}
 const save=()=>{try{localStorage.setItem(key,JSON.stringify(first));}catch{}};
 const fmt=n=>n>=100?n.toFixed(1):n.toFixed(3);
 const text=(x,y,s,anchor='middle')=>`<text x="${x}" y="${y}" text-anchor="${anchor}">${s}</text>`;
 function plot(){if(!state.computed)return;const r=M.calculate(state.set,state.basis,state.formula),svg=$('edPlot'),w=Math.max(250,svg.getBoundingClientRect().width),h=240,L=60,R=14,T=25,B=38,pw=w-L-R,ph=h-T-B,max=Math.max(r.max||0,1)*1.18;
  svg.setAttribute('viewBox',`0 0 ${w} ${h}`);let s='';for(let i=0;i<=4;i++){const v=max*i/4,y=h-B-ph*i/4;s+=`<line x1="${L}" y1="${y}" x2="${w-R}" y2="${y}" stroke="#d8e5ec"/>`+text(L-9,y+5,v>=10?v.toFixed(0):v.toFixed(1),'end');}
  r.values.forEach((v,i)=>{const x=L+pw*(i+.5)/3,bw=Math.min(68,pw/5),bh=v===null?0:ph*v/max;s+=v===null?text(x,T+ph*.5,'미정의'):`<rect x="${x-bw/2}" y="${h-B-bh}" width="${bw}" height="${Math.max(bh,v===0?1:0)}" rx="3" fill="${['#22677c','#4e678f','#806194'][i]}"/>`;s+=text(x,h-12,'실험 '+M.sets[state.set].rows[i].id);});svg.innerHTML=s;
 }
 function render(){const set=M.sets[state.set];$('edTemperature').textContent=set.temperature;for(const k of ['set','basis','formula'])document.querySelectorAll('[data-ed-'+k+']').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset['ed'+k[0].toUpperCase()+k.slice(1)]===state[k])));
  $('edSamples').innerHTML=set.rows.map(r=>`<article class="ed-sample"><h3>실험 ${r.id}</h3><table><caption>농도 (M)</caption><thead><tr><th scope="col">상태</th><th scope="col">NO₂</th><th scope="col">N₂O₄</th></tr></thead><tbody>${[['initial','초기'],['eq','평형']].map(([k,label])=>`<tr class="${state.basis===k?'ed-active':''}"><th scope="row">${label}</th><td>${r[k][0].toFixed(4)}</td><td>${r[k][1].toFixed(4)}</td></tr>`).join('')}</tbody></table></article>`).join('');
  $('edComputed').hidden=!state.computed;$('edEmpty').hidden=state.computed;$('edPlotTitle').textContent=state.computed?M.formulas[state.formula].label+' 비교':'계산값 비교';
  if(state.computed){const r=M.calculate(state.set,state.basis,state.formula),f=M.formulas[state.formula];$('edValues').innerHTML=r.values.map((v,i)=>`<div class="${v===null?'ed-undefined':''}"><span>실험 ${set.rows[i].id}</span><strong>${v===null?'정의되지 않음':fmt(v)}</strong><small>${v===null?'분모가 0':f.unit||'단위 없음'}</small></div>`).join('');$('edRange').textContent=r.spread===null?'분모가 0인 식은 계산값을 0으로 둘 수 없습니다.':`최댓값과 최솟값의 차이는 평균의 ${(r.spread*100).toFixed(2)}%입니다.`;plot();}
 }
 function changed(){state.computed=false;$('edStatus').textContent='';delete $('edStatus').dataset.state;render();}
 for(const k of ['set','basis','formula'])document.querySelectorAll('[data-ed-'+k+']').forEach(b=>b.addEventListener('click',()=>{state[k]=b.dataset['ed'+k[0].toUpperCase()+k.slice(1)];changed();}));
 $('edCalculate').addEventListener('click',()=>{state.computed=true;$('edStatus').textContent='';delete $('edStatus').dataset.state;render();});
 $('edConclude').addEventListener('click',()=>{if(!state.computed)return;const r=M.calculate(state.set,state.basis,state.formula),correct=state.basis==='eq'&&r.consistent;if(first[state.set]===undefined){first[state.set]=correct;save();}const status=$('edStatus');status.dataset.state=correct?'correct':'incorrect';status.textContent=correct?`세 평형의 값이 약 ${r.mean.toFixed(0)} M⁻¹로 거의 같습니다. 반응식의 NO₂ 계수 2는 농도의 지수입니다. 같은 온도에서는 초기 농도가 달라도 이 비가 거의 일정합니다.${first[state.set]===false?' 첫 선택은 오답으로 남습니다.':''}`:state.basis==='initial'?'평형 상수는 평형에 도달한 뒤의 농도로 비교합니다. 초기 농도를 넣었는지 확인하세요.':'세 실험의 계산값이 서로 다릅니다. 분모의 계수와 지수가 어떻게 다른지 비교하세요.';});
 $('edReset').addEventListener('click',()=>{Object.assign(state,{set:'a',basis:'eq',formula:'simple',computed:false});changed();});new ResizeObserver(plot).observe($('edPlot'));window.__equilibriumData={snapshot:()=>({...state,first:{...first}})};render();
});
