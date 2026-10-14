(() => {
 const $=id=>document.getElementById(id),{cards,place,evaluate}=window.mendeleevModel,byId=Object.fromEntries(cards.map(c=>[c.id,c]));
 const mixed=['G','L','Br','Na','T','D','Rb','Si','J','Q','A','I','X','Cl','M','R','Z','K','E'];
 let slots=Array(21).fill(null),selected=null,viewed=null,ordered=false;
 function render(){
  delete $('arrangementStatus').dataset.complete;
  $('elementBoard').innerHTML=slots.map((id,i)=>{const c=byId[id];return `<button type="button" data-slot="${i}" aria-label="${Math.floor(i/7)+1}번째 줄 ${i%7+1}번째 칸 ${c?c.id+' 원자량 '+c.mass+' '+c.compounds.join(', '):'빈칸'}" aria-pressed="${!!id&&id===selected}">${c?`<b>${c.id}</b><small>${c.mass}</small><span class="cell-formulas">${c.compounds.map(f=>'<span>'+f+'</span>').join('')}</span>`:'<span>·</span>'}</button>`;}).join('');
  const pool=(ordered?cards.map(c=>c.id):mixed).filter(id=>!slots.includes(id));
  $('elementPool').innerHTML=pool.map(id=>`<button type="button" data-card="${id}" aria-pressed="${id===selected}"><b>${id}</b> <small>${byId[id].mass}</small></button>`).join('');
  $('poolCount').textContent=pool.length?'남은 카드 '+pool.length+'개':'카드를 모두 배치했습니다. 빈칸 두 곳의 의미도 생각해 보세요.';
  const c=byId[selected||viewed];$('selectedElement').innerHTML=c?`<div class="element-symbol"><b>${c.id}</b><span>원자량 ${c.mass}</span></div><div><b>만드는 물질</b><p>${c.compounds.join(' · ')}</p>${c.reaction?`<p>${c.reaction}</p>`:''}</div>`:'<p>아래에서 카드를 고르면 화학식과 반응성을 볼 수 있습니다. 배치한 카드도 눌러 비교할 수 있습니다.</p>';
  $('removeElement').disabled=!selected||!slots.includes(selected);
  $('sortCards').setAttribute('aria-pressed',String(ordered));
  $('sortCards').disabled=!pool.length;
  $('elementPool').querySelectorAll('button').forEach(b=>b.onclick=()=>{selected=viewed=b.dataset.card;render();$('arrangementStatus').textContent=selected+' 카드를 놓을 칸을 고르세요.';});
  $('elementBoard').querySelectorAll('button').forEach(b=>b.onclick=()=>{
   const i=+b.dataset.slot;
   if(!selected){if(slots[i]){selected=viewed=slots[i];render();$('arrangementStatus').textContent=selected+'의 정보를 비교하고, 옮길 칸을 고르세요.';}return;}
   const id=selected;slots=place(slots,selected,i);selected=null;render();$('arrangementStatus').textContent=id+' 카드를 배치했습니다. 다른 카드를 고르거나 배열을 확인하세요.';
  });
 }
 $('removeElement').onclick=()=>{slots=slots.map(id=>id===selected?null:id);render();$('arrangementStatus').textContent='선택한 카드를 다시 꺼냈습니다. 놓을 칸을 고르세요.';};
 $('sortCards').onclick=()=>{ordered=!ordered;render();};
 $('checkArrangement').onclick=()=>{
  const r=evaluate(slots),messages=[];
  if(r.remaining)messages.push('아직 배치하지 않은 카드가 '+r.remaining+'개입니다.');
  if(r.orderConflicts.length)messages.push('가로줄 또는 세로줄에서 원자량이 거꾸로 작아지는 곳을 다시 비교하세요.');
  if(r.familyConflicts.length)messages.push(r.familyConflicts.map(c=>c+1).join(', ')+'번째 세로줄에서 만드는 물질의 화학식과 반응성을 다시 비교하세요.');
  if(r.complete)messages.push('원자량 순서와 같은 세로줄의 성질이 맞습니다. 비어 있는 두 곳에는 어떤 성질의 원소가 올지, 아래 문제에서 예측해 보세요.');
  else if(!r.orderConflicts.length&&!r.familyConflicts.length)messages.push('지금 배치한 카드 사이에서는 두 기준이 맞습니다.');
  $('arrangementStatus').textContent=messages.join(' ');$('arrangementStatus').dataset.complete=String(r.complete);
 };
 $('resetExperiment').onclick=()=>{slots=Array(21).fill(null);selected=viewed=null;ordered=false;render();$('arrangementStatus').textContent='카드 19개를 다시 꺼냈습니다.';delete $('arrangementStatus').dataset.complete;};
 render();
})();
