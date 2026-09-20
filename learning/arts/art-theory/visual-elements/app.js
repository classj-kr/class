(()=>{
'use strict';
const M=VisualElements,$=id=>document.getElementById(id);
let axis='angle',reference=M.defaults(),current=M.defaults(),records=[],nextId=1;
function draw(id,state){const el=$(id);el.innerHTML=M.scene(state,axis,id);el.setAttribute('aria-label',M.axes[axis].title+' '+M.valueText(state,axis));}
function render(){
 const spec=M.axes[axis];
 document.querySelectorAll('[data-axis]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.axis===axis)));
 $('controlTitle').textContent=spec.title;$('fixedNote').textContent=spec.note;$('observationPrompt').textContent=spec.prompt;
 draw('referenceScene',reference);draw('currentScene',current);
 $('referenceValue').textContent=M.valueText(reference,axis);$('currentValue').textContent=M.valueText(current,axis);
 $('comparisonStatus').textContent=current[axis]===reference[axis]?'두 모습이 같습니다. 오른쪽 모습을 바꿔 보세요.':spec.title+'만 다릅니다. 두 모습을 비교해 보세요.';
 $('rangeControl').hidden=!!spec.choices;$('choiceControl').hidden=!spec.choices;
 if(spec.choices){
  if($('choiceControl').dataset.axis!==axis){
   $('choiceControl').replaceChildren();$('choiceControl').dataset.axis=axis;
   for(const [value,label] of spec.choices){const button=document.createElement('button');button.type='button';button.dataset.value=value;button.textContent=label;button.addEventListener('click',()=>{current=M.change(reference,axis,value);render()});$('choiceControl').append(button);}
  }
  $('choiceControl').setAttribute('aria-label',spec.title+' 선택');
  $('choiceControl').querySelectorAll('button').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.value===current[axis])));
 }else{
  const range=$('elementRange');range.min=spec.min;range.max=spec.max;range.value=current[axis];range.setAttribute('aria-valuetext',M.valueText(current,axis));
  $('rangeLabel').textContent=spec.label;$('rangeOutput').value=M.valueText(current,axis);$('rangeMin').textContent=spec.ends[0];$('rangeMax').textContent=spec.ends[1];
 }
}
function chooseAxis(next){axis=next;current={...reference};render();}
document.querySelectorAll('[data-axis]').forEach(button=>button.addEventListener('click',()=>{if(axis!==button.dataset.axis)chooseAxis(button.dataset.axis)}));
$('elementRange').addEventListener('input',event=>{current=M.change(reference,axis,event.target.value);render()});
$('setReference').addEventListener('click',()=>{reference={...current};render();$('comparisonStatus').textContent='현재 모습을 새 기준으로 정했습니다.'});
$('restoreReference').addEventListener('click',()=>{current={...reference};render()});
$('resetStudy').addEventListener('click',()=>{reference=M.defaults();current=M.defaults();render();$('comparisonStatus').textContent='모든 요소를 처음 모습으로 되돌렸습니다. 비교 기록은 남아 있습니다.'});
function showRecords(){
 $('records').replaceChildren();
 for(const record of records){
  const row=document.createElement('article');row.className='comparison-record';
  const description=document.createElement('div');description.className='record-description';
  const title=document.createElement('h3');title.textContent=M.axes[record.axis].title+' · '+M.valueText(record.reference,record.axis)+' → '+M.valueText(record.current,record.axis);description.append(title);
  if(record.note){const note=document.createElement('p');note.textContent=record.note;description.append(note);}
  const actions=document.createElement('div');actions.className='record-actions';
  for(const [action,label] of [['restore','다시 보기'],['delete','삭제']]){
   const button=document.createElement('button');button.type='button';button.className='text-button';button.dataset[action]=record.id;button.textContent=label;button.setAttribute('aria-label',title.textContent+' '+label);
   button.addEventListener('click',()=>{
    if(action==='restore'){axis=record.axis;reference={...record.reference};current={...record.current};render();$('comparisonStatus').textContent='기록한 비교를 불러왔습니다.';const active=document.querySelector(`[data-axis="${axis}"]`);active.focus();active.scrollIntoView({block:'nearest'});}
    else{records=records.filter(item=>item.id!==record.id);showRecords();$('recordStatus').textContent='기록을 삭제했습니다.';$('saveRecord').focus();}
   });actions.append(button);
  }
  row.append(description,actions);$('records').append(row);
 }
}
$('saveRecord').addEventListener('click',()=>{
 if(reference[axis]===current[axis]){$('recordStatus').textContent='오른쪽 모습을 바꾼 뒤 차이를 기록해 보세요.';return;}
 records.push({id:nextId++,axis,reference:{...reference},current:{...current},note:$('observationText').value.trim()});
 $('observationText').value='';showRecords();$('recordStatus').textContent=records.length+'개의 비교를 기록했습니다.';
});
render();
})();
