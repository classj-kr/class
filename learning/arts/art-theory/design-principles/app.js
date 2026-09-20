(()=>{
'use strict';
const M=DesignPrinciples,$=id=>document.getElementById(id);
let study='balance',records=[],nextId=1;
const studies=Object.fromEntries(Object.keys(M.specs).map(key=>[key,{reference:M.defaults(key),current:M.defaults(key)}]));
function draw(id,state){const el=$(id);el.innerHTML=M.objects(study,state).map(({x,y,r,fill})=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/>`).join('');el.setAttribute('aria-label',M.specs[study].title+' · '+M.describe(study,state));}
function render(){
 const {reference,current}=studies[study],spec=M.specs[study];
 document.querySelectorAll('[data-study]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.study===study)));
 for(const key of Object.keys(M.specs))$(key+'Controls').hidden=key!==study;
 $('controlTitle').textContent=spec.title;$('fixedNote').textContent=spec.note;$('observationPrompt').textContent=spec.prompt;
 draw('referenceScene',reference);draw('currentScene',current);
 for(const [id,state] of [['referenceValue',reference],['currentValue',current]]){$(id).replaceChildren(...M.describe(study,state).split(' · ').map(text=>{const span=document.createElement('span');span.textContent=text;return span;}));}
 $('comparisonStatus').textContent=M.equivalent(study,reference,current)?'두 모습이 같습니다. 오른쪽의 조절값을 바꿔 보세요.':'달라진 배치와 시선의 흐름을 비교해 보세요.';
 for(const [key,value] of Object.entries(current)){
  if(['layout','pattern'].includes(key)){document.querySelectorAll(`[data-${key}]`).forEach(button=>button.setAttribute('aria-pressed',String(button.dataset[key]===value)));continue;}
  $(key).value=value;
  const text=key==='shift'?(value===0?'처음 위치':value<0?'안쪽 '+Math.abs(value):'바깥쪽 '+value):key==='size'?value+'%':key==='target'?value+'번':String(value);
  $(key+'Output').value=text;$(key).setAttribute('aria-valuetext',text);
 }
 if(study==='rhythm'){$('amount').disabled=current.pattern==='even';if(current.pattern==='even'){$('amount').value=0;$('amountOutput').value='0';$('amount').setAttribute('aria-valuetext','0');}}
}
for(const button of document.querySelectorAll('[data-study]'))button.addEventListener('click',()=>{study=button.dataset.study;render()});
for(const key of ['layout','pattern'])for(const button of document.querySelectorAll(`[data-${key}]`))button.addEventListener('click',()=>{studies[study].current=M.change(studies[study].current,key,button.dataset[key]);render()});
for(const key of ['shift','amount','target','size','contrast'])$(key).addEventListener('input',event=>{studies[study].current=M.change(studies[study].current,key,event.target.value);render()});
$('setReference').addEventListener('click',()=>{studies[study].reference={...studies[study].current};render();$('comparisonStatus').textContent='현재 모습을 새 기준으로 정했습니다.'});
$('restoreReference').addEventListener('click',()=>{studies[study].current={...studies[study].reference};render()});
$('resetStudy').addEventListener('click',()=>{studies[study]={reference:M.defaults(study),current:M.defaults(study)};render();$('comparisonStatus').textContent='이 비교를 처음 모습으로 되돌렸습니다. 기록은 남아 있습니다.'});
function showRecords(){
 $('records').replaceChildren();
 for(const record of records){
  const row=document.createElement('article');row.className='comparison-record';const description=document.createElement('div');description.className='record-description';
  const title=document.createElement('h3');title.textContent=M.specs[record.study].title+' · '+M.describe(record.study,record.current);description.append(title);
  if(record.note){const note=document.createElement('p');note.textContent=record.note;description.append(note);}
  const actions=document.createElement('div');actions.className='record-actions';
  for(const [action,label] of [['restore','다시 보기'],['delete','삭제']]){
   const button=document.createElement('button');button.type='button';button.className='text-button';button.dataset[action]=record.id;button.textContent=label;button.setAttribute('aria-label',title.textContent+' '+label);
   button.addEventListener('click',()=>{
    if(action==='restore'){study=record.study;studies[study]={reference:{...record.reference},current:{...record.current}};render();$('comparisonStatus').textContent='기록한 비교를 불러왔습니다.';const active=document.querySelector(`[data-study="${study}"]`);active.focus();active.scrollIntoView({block:'nearest'});}
    else{records=records.filter(item=>item.id!==record.id);showRecords();$('recordStatus').textContent='기록을 삭제했습니다.';$('saveRecord').focus();}
   });actions.append(button);
  }
  row.append(description,actions);$('records').append(row);
 }
}
$('saveRecord').addEventListener('click',()=>{
 const {reference,current}=studies[study];
 if(M.equivalent(study,reference,current)){$('recordStatus').textContent='오른쪽 모습을 바꾼 뒤 차이를 기록해 보세요.';return;}
 records.push({id:nextId++,study,reference:{...reference},current:{...current},note:$('observationText').value.trim()});$('observationText').value='';showRecords();$('recordStatus').textContent=records.length+'개의 비교를 기록했습니다.';
});
render();
})();
