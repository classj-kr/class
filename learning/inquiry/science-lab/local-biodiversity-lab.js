(()=>{
 'use strict';const M=window.LocalBiodiversityModel,A=window.LocalBiodiversityArt,$=id=>document.getElementById(id);if(!M||!$('bioArea'))return;
 let area='garden',period='morning',effort=12,selected=0,view='whole',growth='',leaf='',runs={};
 const key=()=>[area,period,effort].join(':'),current=()=>runs[key()]||(runs[key()]={records:{},area,period,effort}),specimen=()=>M.specimens(area)[selected];
 const labels={garden:'화단',lawn:'잔디밭'};
 function drawField(){const records=current().records;$('bioProgress').textContent=`${labels[area]} · ${period==='morning'?'오전 10시':'오후 2시'} · ${effort===12?'20':'10'}분 관찰 · ${Object.keys(records).length} / ${effort}곳 확인`;
  $('bioSpecimens').innerHTML=M.specimens(area).slice(0,effort).map(s=>`<button class="bio-specimen" data-bio-specimen="${s.index}" data-identified="${!!records[s.id]}" aria-pressed="${selected===s.index}" aria-label="표본 ${s.index+1}${records[s.id]?' · '+M.species[s.kind].name+' 확인':''}">${A.svg(s.kind)}<span>${String(s.index+1).padStart(2,'0')}${records[s.id]?' · 확인':''}</span></button>`).join('');
  for(const b of $('bioSpecimens').querySelectorAll('button'))b.onclick=()=>{selected=+b.dataset.bioSpecimen;view='whole';growth='';leaf='';$('bioGrowth').value='';$('bioLeaf').value='';$('bioFeedback').textContent='확대한 모습과 특징을 대조하세요.';drawField();drawDetail();drawCandidates();};
 }
 function drawDetail(){const s=specimen(),sp=M.species[s.kind];if(s.kind==='ginkgo'&&view==='flower')view='leaf';$('bioSpecimenTitle').textContent=`표본 ${String(selected+1).padStart(2,'0')}${current().records[s.id]?' · '+sp.name:''}`;$('bioDrawing').innerHTML=A.svg(s.kind,view);$('bioObservation').textContent=view==='leaf'?sp.leafNote:view==='flower'?sp.flowerNote:sp.growth==='woody'?'단단한 목질 줄기에서 가지와 잎이 뻗습니다. 잎의 모양과 잎맥을 확대해 보세요.':'줄기의 위치와 잎이 붙은 모습을 살펴보세요. 잎과 꽃차례를 확대할 수 있습니다.';
  for(const b of document.querySelectorAll('[data-bio-view]')){b.setAttribute('aria-pressed',String(b.dataset.bioView===view));b.disabled=s.kind==='ginkgo'&&b.dataset.bioView==='flower';}
 }
 function drawCandidates(){const ids=growth&&leaf?M.candidates(growth,leaf):[];$('bioCandidates').replaceChildren();if(!growth||!leaf)return;if(!ids.length){$('bioCandidates').textContent='이 다섯 표본 중에는 두 특징에 함께 맞는 식물이 없습니다.';return;}
  for(const id of ids){const b=document.createElement('button');b.textContent=M.species[id].name+'로 동정';b.onclick=()=>{const s=specimen();if(id!==s.kind){$('bioFeedback').textContent='선택한 특징이 표본과 맞는지 잎의 형태와 줄기를 다시 비교하세요.';return;}current().records[s.id]={id:s.id,kind:id};$('bioFeedback').textContent=M.species[id].name+' · '+M.species[id].feature;drawField();drawDetail();drawResults();};$('bioCandidates').append(b);}
 }
 function latest(a){const exact=runs[[a,period,effort].join(':')];if(exact&&Object.keys(exact.records).length)return exact;return Object.values(runs).filter(r=>r.area===a&&Object.keys(r.records).length).at(-1);}
 function drawResults(){const rows={};for(const a of ['garden','lawn']){const run=latest(a);rows[a]=run?{...run,...M.summary(run.records),complete:Object.keys(run.records).length===run.effort}:null;}
  $('bioResults').innerHTML=Object.entries(rows).map(([a,r])=>`<article><h4>${labels[a]}</h4>${r?`<strong>${r.richness}종</strong><p>확인한 표본 ${r.count}곳 / 관찰 범위 ${r.effort}곳</p><p>${r.period==='morning'?'오전 10시':'오후 2시'} · ${r.effort===12?'20':'10'}분</p><ul>${Object.entries(r.counts).map(([id,n])=>`<li>${M.species[id].name} ${n}곳</li>`).join('')}</ul>`:'<p>아직 확인한 표본이 없습니다.</p>'}</article>`).join('');$('bioCompare').textContent=M.compare(rows.garden,rows.lawn).reason;
 }
 function change(){area=$('bioArea').value;period=$('bioPeriod').value;effort=+$('bioEffort').value;selected=0;view='whole';growth='';leaf='';$('bioGrowth').value='';$('bioLeaf').value='';$('bioFeedback').textContent='확대한 모습과 특징을 대조하세요.';drawField();drawDetail();drawCandidates();drawResults();}
 for(const id of ['bioArea','bioPeriod','bioEffort'])$(id).onchange=change;
 for(const b of document.querySelectorAll('[data-bio-view]'))b.onclick=()=>{view=b.dataset.bioView;drawDetail();};
 $('bioGrowth').onchange=()=>{growth=$('bioGrowth').value;drawCandidates();};$('bioLeaf').onchange=()=>{leaf=$('bioLeaf').value;drawCandidates();};
 $('resetExperiment').onclick=()=>{runs={};$('bioArea').value='garden';$('bioPeriod').value='morning';$('bioEffort').value='12';change();};
 window.__localBiodiversity={getState:()=>({area,period,effort,selected,view,runs:structuredClone(runs)})};change();
})();
