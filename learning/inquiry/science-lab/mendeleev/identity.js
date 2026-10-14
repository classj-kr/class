(() => {
 'use strict';
 const $=id=>document.getElementById(id),model=window.mendeleevIdentity,byId=Object.fromEntries(model.cards.map(c=>[c.id,c]));
 const mixed=['c13','c3','c9','c6','c17','c1','c11','c15','c5','c10','c7','c16','c4','c12','c2','c14','c8'];
 let slots=Array(28).fill(null),selected=null,viewed=null,known=new Set(),ordered=false;
 function cardContent(c){return `<b>${known.has(c.id)?c.symbol:'?'}</b><small>${c.massLabel}</small>`;}
 function render(){
  $('identityBoard').innerHTML=slots.map((id,i)=>{
   if(!model.active.includes(i))return '<span class="board-gap" aria-hidden="true"></span>';
   const c=byId[id];return `<button type="button" data-identity-slot="${i}" aria-label="${Math.floor(i/7)+1}번째 줄 ${i%7+1}번째 칸 ${c?c.symbol+' 원자량 '+c.massLabel:'빈칸'}" aria-pressed="${!!id&&id===selected}">${c?cardContent(c):'<span>·</span>'}</button>`;
  }).join('');
  const remaining=(ordered?model.cards.map(c=>c.id):mixed).filter(id=>!slots.includes(id));
  $('identityPool').innerHTML=remaining.map(id=>`<button type="button" data-identity-card="${id}" aria-label="원자량 ${byId[id].massLabel} 카드${known.has(id)?' '+byId[id].symbol:''}" aria-pressed="${id===selected}">${cardContent(byId[id])}</button>`).join('');
  $('identityCount').textContent=`원소 확인 ${known.size}/17 · 남은 카드 ${remaining.length}개`;
  $('identitySort').setAttribute('aria-pressed',String(ordered));$('identitySort').disabled=!remaining.length;
  const c=byId[selected||viewed];
  $('identityDetail').innerHTML=c?`<div class="element-symbol">${cardContent(c)}<span>원자량</span></div><dl><div><dt>주요 화합물</dt><dd>${c.compounds.join(' · ')}</dd></div><div><dt>실온 · 1기압</dt><dd>${c.state} · ${c.kind}</dd></div><div><dt>카드의 반응성</dt><dd>${c.reactivity}</dd></div></dl>`:'<p>카드를 눌러 원자량과 물질의 성질을 확인하세요.</p>';
  $('identityForm').hidden=!selected||known.has(selected);$('identityRemove').disabled=!selected||!slots.includes(selected);
  $('identityBoard').querySelectorAll('button').forEach(button=>button.onclick=()=>{
   const i=Number(button.dataset.identitySlot);
   if(selected){
    if(!known.has(selected)){$('identityStatus').textContent='카드의 성질로 원소 기호를 먼저 확인하세요.';return;}
    const name=byId[selected].symbol;slots=model.place(slots,selected,i);selected=null;render();$('identityStatus').textContent=name+' 카드를 놓았습니다. 같은 세로줄의 성질과 원자량 순서를 비교하세요.';
   }else if(slots[i]){selected=viewed=slots[i];render();$('identityStatus').textContent='다른 칸을 누르면 옮기거나 서로 자리를 바꿉니다.';}
   delete $('identityStatus').dataset.complete;
  });
  $('identityPool').querySelectorAll('button').forEach(button=>button.onclick=()=>{selected=viewed=button.dataset.identityCard;render();$('identitySymbol').value='';$('identityStatus').textContent=known.has(selected)?'놓을 칸을 고르세요.':'화합물과 원자량을 함께 보고 원소 기호를 고르세요.';});
 }
 $('identityForm').onsubmit=event=>{
  event.preventDefault();if(!selected)return;
  if(!model.identify(selected,$('identitySymbol').value)){$('identityStatus').textContent='아직 맞지 않습니다. 화합물에 포함된 원소와 원자량을 함께 비교해 보세요.';return;}
  known.add(selected);render();$('identityStatus').textContent=byId[selected].symbol+'입니다. 이제 배열판에서 놓을 칸을 고르세요.';
 };
 $('identityCheck').onclick=()=>{
  const r=model.evaluate(slots),messages=[];
  if(r.remaining)messages.push('남은 카드 '+r.remaining+'개를 확인해 배치하세요.');
  if(r.hydrogenConflict)messages.push('맨 위 한 칸의 원소는 가장 가벼운 기체입니다.');
  if(r.familyConflicts.length)messages.push(r.familyConflicts.map(c=>c+1).join(', ')+'번째 세로줄의 화합물과 성질을 다시 비교하세요.');
  if(r.orderConflicts.length)messages.push('가로줄 또는 세로줄에서 원자량이 작아지는 곳이 있습니다.');
  if(r.complete)messages.push('17개 카드의 원자량 순서와 성질의 배열이 맞습니다. 수소는 같은 세로줄의 알칼리 금속과 달리 비금속입니다. 현대 주기율표와도 비교해 보세요.');
  else if(!r.hydrogenConflict&&!r.familyConflicts.length&&!r.orderConflicts.length)messages.push('현재 배치한 카드 사이에서는 배열 기준이 맞습니다.');
  $('identityStatus').textContent=messages.join(' ');$('identityStatus').dataset.complete=String(r.complete);
 };
 $('identityRemove').onclick=()=>{slots=slots.map(id=>id===selected?null:id);render();delete $('identityStatus').dataset.complete;$('identityStatus').textContent='선택한 카드를 꺼냈습니다.';};
 $('identitySort').onclick=()=>{ordered=!ordered;render();};
 $('identityReset').onclick=()=>{slots=Array(28).fill(null);selected=viewed=null;known=new Set();ordered=false;render();$('modernComparison').hidden=true;$('compareModern').setAttribute('aria-expanded','false');delete $('identityStatus').dataset.complete;$('identityStatus').textContent='17개 카드의 기호 찾기부터 다시 시작합니다.';};
 document.querySelectorAll('[data-deck]').forEach(button=>button.onclick=()=>{
  const identity=button.dataset.deck==='identity';$('identityExperiment').hidden=!identity;$('classicExperiment').hidden=identity;
  document.querySelectorAll('[data-deck]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
 });
 $('identitySymbol').innerHTML='<option value="">기호 선택</option>'+model.cards.map(c=>c.symbol).sort().map(symbol=>`<option>${symbol}</option>`).join('');
 $('modernElements').innerHTML=[1,2,13,14,15,16,17,18].map(group=>`<span class="modern-group">${group}족</span>`).join('')+Array.from({length:32},(_,i)=>{
  const row=Math.floor(i/8),col=i%8,c=model.modern.find(c=>c.family===col&&((c.number<=2?0:c.number<=10?1:c.number<=18?2:3)===row));
  return c?`<div class="modern-element${c.noble?' noble':''}"><small>${c.number}</small><b>${c.symbol}</b></div>`:'<span class="board-gap" aria-hidden="true"></span>';
 }).join('');
 $('compareModern').onclick=()=>{const show=$('modernComparison').hidden;$('modernComparison').hidden=!show;$('compareModern').setAttribute('aria-expanded',String(show));};
 render();
})();
