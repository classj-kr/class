(() => {
 const $=id=>document.getElementById(id),{cards,place,evaluate}=window.mendeleevModel,byId=Object.fromEntries(cards.map(c=>[c.id,c]));
 const mixed=['G','L','Br','Na','T','D','Rb','Si','J','Q','A','I','X','Cl','M','R','Z','K','E'];
 let slots=Array(21).fill(null),selected=null,viewed=null,ordered=false;
 // 카드 한 장: 왼쪽 위 원자량, 가운데 큰 기호, 아래 산화물·염화물·수소화물 화학식과 반응성
 const cardFace=c=>`<span class="mc-mass">${c.mass}</span><b class="mc-symbol">${c.id}</b><span class="cell-formulas">${c.compounds.map(f=>'<span>'+f+'</span>').join('')}</span>${c.reaction?`<span class="mc-react">${c.reaction}</span>`:''}`;
 const reduce=()=>window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
 // 카드를 놓으면 원래 자리에서 새 칸으로 미끄러져 간다(requestAnimationFrame).
 function fly(fromRect,id){
  const to=$('elementBoard').querySelector('[data-slot="'+slots.indexOf(id)+'"]');if(!fromRect||!to||reduce())return;
  const end=to.getBoundingClientRect(),ghost=document.createElement('div');ghost.className='mc-ghost';ghost.innerHTML=cardFace(byId[id]);
  Object.assign(ghost.style,{left:fromRect.left+'px',top:fromRect.top+'px',width:fromRect.width+'px',height:fromRect.height+'px'});
  document.body.append(ghost);to.style.visibility='hidden';
  const t0=performance.now(),dur=420;
  const step=now=>{const f=Math.min(1,(now-t0)/dur),e=1-Math.pow(1-f,3);
   ghost.style.left=(fromRect.left+(end.left-fromRect.left)*e)+'px';ghost.style.top=(fromRect.top+(end.top-fromRect.top)*e)+'px';
   ghost.style.width=(fromRect.width+(end.width-fromRect.width)*e)+'px';ghost.style.height=(fromRect.height+(end.height-fromRect.height)*e)+'px';
   if(f<1)requestAnimationFrame(step);else{ghost.remove();to.style.visibility='';}};
  requestAnimationFrame(step);
 }
 function render(){
  delete $('arrangementStatus').dataset.complete;
  $('elementBoard').innerHTML=slots.map((id,i)=>{const c=byId[id];return `<button type="button" data-slot="${i}" aria-label="${Math.floor(i/7)+1}번째 줄 ${i%7+1}번째 칸 ${c?c.id+' 원자량 '+c.mass+' '+c.compounds.join(', '):'빈칸'}" aria-pressed="${!!id&&id===selected}">${c?cardFace(c):''}</button>`;}).join('');
  const pool=(ordered?cards.map(c=>c.id):mixed).filter(id=>!slots.includes(id));
  $('elementPool').innerHTML=pool.map(id=>`<button type="button" class="mc-card" data-card="${id}" aria-pressed="${id===selected}">${cardFace(byId[id])}</button>`).join('');
  $('poolCount').textContent=pool.length?'남은 카드 '+pool.length+'개':'카드를 모두 배치했습니다. 빈칸 두 곳의 의미도 생각해 보세요.';
  const c=byId[selected||viewed];$('selectedElement').hidden=!c;$('selectedElement').innerHTML=c?`<div class="element-symbol"><b>${c.id}</b><span>원자량 ${c.mass}</span></div><div><b>만드는 물질</b><p>${c.compounds.join(' · ')}</p>${c.reaction?`<p>${c.reaction}</p>`:''}</div>`:'<p>아래에서 카드를 고르면 화학식과 반응성을 볼 수 있습니다. 배치한 카드도 눌러 비교할 수 있습니다.</p>';
  $('removeElement').disabled=!selected||!slots.includes(selected);
  $('sortCards').setAttribute('aria-pressed',String(ordered));
  $('sortCards').disabled=!pool.length;
  $('elementPool').querySelectorAll('button').forEach(b=>b.onclick=()=>{selected=viewed=b.dataset.card;render();$('arrangementStatus').textContent=selected+' 카드를 놓을 칸을 고르세요.';});
  $('elementBoard').querySelectorAll('button').forEach(b=>b.onclick=()=>{
   const i=+b.dataset.slot;
   if(!selected){if(slots[i]){selected=viewed=slots[i];render();$('arrangementStatus').textContent=selected+'의 정보를 비교하고, 옮길 칸을 고르세요.';}return;}
   const id=selected,src=document.querySelector('#elementPool [data-card="'+id+'"]')||document.querySelector('#elementBoard [data-slot="'+slots.indexOf(id)+'"]'),from=src?.getBoundingClientRect();slots=place(slots,selected,i);selected=null;render();fly(from,id);$('arrangementStatus').textContent=id+' 카드를 배치했습니다. 다른 카드를 고르거나 배열을 확인하세요.';
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
