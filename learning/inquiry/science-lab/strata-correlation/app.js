(()=>{'use strict';
 const model=window.scienceStrataCorrelation,$=id=>document.getElementById(id);
 let mode='key',selected=null,links=[],attempts=[],revealed=false;
 const selectionId=(r,i)=>r+':'+i;
 const focusLayer=(r,i)=>document.querySelector('[data-sc-layer="'+selectionId(r,i)+'"]')?.focus({preventScroll:true});
 const boundaryGraphic=gap=>'<svg viewBox="0 0 100 12" aria-hidden="true"><path d="'+(gap?'M0 6 Q5 0 10 6 T30 6 T50 6 T70 6 T90 6 T110 6':'M0 6 H100')+'" fill="none" stroke="currentColor" stroke-width="1.5" vector-effect="non-scaling-stroke"/></svg>';
 function render(){
  const c=model.cases[mode];
  document.querySelectorAll('[data-sc-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.scMode===mode)));
  $('scInstruction').textContent=mode==='key'?'응회암층을 기준으로 위아래 암석의 순서를 살펴보세요. 같은 시기로 대비할 두 지층을 서로 다른 지역에서 하나씩 고르세요.':'화석이 있는 석회암층을 기준으로 위아래의 순서를 비교하세요. 같은 암석이라도 서로 다른 시기에 쌓였을 수 있습니다.';
  $('scColumns').innerHTML=c.regions.map((r,region)=>'<section class="sc-column"><h3>지역 '+r.name+'</h3><div class="sc-stack">'+r.units.map((_,index)=>model.layer(mode,region,index)).reverse().map(l=>'<button type="button" class="sc-layer sc-'+l.rock+'" data-sc-layer="'+selectionId(region,l.index)+'" aria-pressed="'+String(selected?.region===region&&selected?.index===l.index)+'"><span class="sc-code">'+l.label+'</span><strong>'+l.name+'</strong>'+(l.fossil?'<span class="sc-fossil">'+l.fossil+'</span>':'')+'</button>'+(l.index>0?'<button type="button" class="sc-boundary '+(r.gaps.includes(r.units[l.index-1])?'sc-unconformity':'')+'" data-sc-boundary="'+region+':'+(l.index-1)+'" aria-label="지역 '+r.name+' '+l.label+' 바로 아래 경계 살펴보기"><span aria-hidden="true">'+boundaryGraphic(r.gaps.includes(r.units[l.index-1]))+'</span></button>':'')).join('')+'</div></section>').join('');
  $('scLinks').innerHTML=links.length?links.map(link=>'<li>'+link.left.label+' ↔ '+link.right.label+' · '+link.left.name+(link.left.fossil?' · '+link.left.fossil:'')+'</li>').join(''):'<li>연결한 지층이 여기에 표시됩니다.</li>';
  $('scClear').disabled=!links.length&&!attempts.length&&!selected;
  $('scSummary').hidden=!revealed;
  $('scFossilNote').hidden=mode!=='fossil';
  $('scReveal').textContent=revealed?'정리 접기':'대비 정리 보기';
  if(revealed){$('scSequence').innerHTML=c.units.map((rock,i)=>'<li><strong>'+model.rocks[rock]+'</strong>'+(c.fossils[i]?' · '+c.fossils[i]:'')+'<span>'+c.regions.flatMap((r,region)=>r.units.includes(i)?[model.layer(mode,region,r.units.indexOf(i)).label]:[]).join(' · ')+'</span></li>').join('');$('scConclusion').textContent='대비한 지층은 '+c.units.length+'개입니다. 가장 오래된 층은 지역 '+c.oldest+', 가장 젊은 층은 지역 '+c.youngest+'에 있습니다.';}
 }
 $('scColumns').addEventListener('click',e=>{
  const b=e.target.closest('[data-sc-layer]'),boundary=e.target.closest('[data-sc-boundary]');
  if(boundary){const[r,i]=boundary.dataset.scBoundary.split(':').map(Number),l=model.layer(mode,r,i);$('scStatus').textContent=l.gapAbove?l.label+' 바로 위는 부정합면입니다. 퇴적이 중단되거나 침식된 뒤 그 위에 새 지층이 쌓였습니다.':l.label+' 바로 위에는 부정합이 표시되어 있지 않습니다. 평행한 경계만으로 시간 간격의 길이를 정할 수는 없습니다.';$('scStatus').scrollIntoView({block:'nearest'});return;}
  if(!b)return;const[region,index]=b.dataset.scLayer.split(':').map(Number),next={region,index};
  if(!selected||selected.region===region){selected=selected?.index===index&&selected.region===region?null:next;render();focusLayer(region,index);$('scStatus').textContent=selected?model.layer(mode,region,index).label+' 선택. 다른 지역에서 대비할 지층을 고르세요.':'지층 선택을 해제했습니다.';return;}
  const result=model.compare(mode,selected,next),key=[selectionId(selected.region,selected.index),selectionId(region,index)].sort().join('|');
  attempts.push({key,correct:result.correct});
  if(result.correct){if(!links.some(x=>x.key===key))links.push({...result,key});$('scStatus').textContent=result.left.label+'와 '+result.right.label+'를 연결했습니다. '+(result.left.fossil?'화석과 위아래 지층의 순서를 함께 확인하세요.':result.left.rock==='tuff'?'넓게 쌓인 응회암층이 대비의 기준입니다.':'기준 층에서의 위치와 암석 순서가 맞습니다.');}
  else $('scStatus').textContent=result.sameRock?'암석 이름은 같지만 기준 층에서의 위치와 쌓인 순서가 다릅니다. 건층이나 화석층 위아래를 다시 비교하세요.':'이 자료에서 두 지층은 서로 다른 시기의 층입니다. 기준이 되는 층과 그 위아래의 순서를 먼저 비교하세요.';
  selected=null;render();focusLayer(region,index);$('scStatus').scrollIntoView({block:'nearest'});
 });
 document.querySelectorAll('[data-sc-mode]').forEach(b=>b.addEventListener('click',()=>{mode=b.dataset.scMode;selected=null;links=[];attempts=[];revealed=false;render();$('scStatus').textContent='기준이 될 지층을 찾아 서로 연결해 보세요.';}));
 $('scClear').addEventListener('click',()=>{selected=null;links=[];attempts=[];revealed=false;render();$('scStatus').textContent='연결을 지웠습니다. 지층을 다시 대비해 보세요.';});
 $('scReveal').addEventListener('click',()=>{revealed=!revealed;render();$('scReveal').textContent=revealed?'정리 접기':'대비 정리 보기';});
 window.__strataCorrelation={getState:()=>({mode,selected,links:links.map(x=>({key:x.key,unit:x.left.unit})),attempts:[...attempts],revealed})};render();
})();
