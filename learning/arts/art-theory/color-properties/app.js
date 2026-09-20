(() => {
  'use strict';
  const M=window.ColorProperties;
  const $=selector=>document.querySelector(selector);
  const labels={h:'색상',l:'명도',c:'채도'};
  const descriptions={h:'명도와 채도를 유지하고 색의 종류만 바꿉니다.',l:'색상과 채도를 유지하고 밝고 어두운 정도만 바꿉니다.',c:'색상과 명도를 유지하고 선명한 정도만 바꿉니다.'};
  const state={base:M.base(5),changed:M.base(5),axis:'h',task:-1,matched:false,records:[]};
  let beforeTask=null;
  const isTask=()=>state.task>=0;
  function colorDescription(color){return `${M.hues[color.h].name}, 명도 실험값 ${color.l}, 채도 실험값 ${color.c}`;}
  function render(){
    const reference=isTask()?M.tasks[state.task].target:state.base;
    $('#referenceSwatch').style.backgroundColor=M.css(reference);
    $('#changedSwatch').style.backgroundColor=M.css(state.changed);
    $('#referenceSwatch').setAttribute('aria-label',isTask()?'맞출 색':`기준 색: ${colorDescription(reference)}`);
    $('#changedSwatch').setAttribute('aria-label',`바꾼 색: ${colorDescription(state.changed)}`);
    $('#referenceLabel').textContent=isTask()?'맞출 색':'기준 색';
    $('#comparisonReadout').hidden=isTask();
    $('#comparisonReadout').innerHTML=Object.entries(labels).map(([key,label])=>`<div><strong>${label}</strong><span>${reference[key]===state.changed[key]?'같음':'달라짐'}</span></div>`).join('');
    $('#comparisonDescription').textContent=isTask()?'같은 배경 위의 두 색을 비교하세요.':['h','l','c'].every(key=>reference[key]===state.changed[key])?'두 색이 같습니다.':`${labels[state.axis]}만 달라졌습니다. ${state.axis==='h'?`${M.hues[reference.h].name}에서 ${M.hues[state.changed.h].name}으로 바뀌었습니다.`:state.axis==='l'?(state.changed.l>reference.l?'기준 색보다 밝아졌습니다.':'기준 색보다 어두워졌습니다.'):(state.changed.c>reference.c?'기준 색보다 선명해졌습니다.':'기준 색보다 회색에 가까워졌습니다.')}`;
    document.querySelectorAll('[data-axis]').forEach(button=>{button.setAttribute('aria-pressed',String(button.dataset.axis===state.axis));button.disabled=state.matched;});
    $('#axisDescription').textContent=descriptions[state.axis];
    $('#propertyLabel').textContent={h:'색의 종류',l:'밝고 어두운 정도',c:'선명한 정도'}[state.axis];
    const bounds=M.bounds(state.axis,state.base);
    const input=$('#propertyControl');input.min=bounds.min;input.max=bounds.max;input.value=state.changed[state.axis];input.disabled=state.matched;
    input.setAttribute('aria-valuetext',state.axis==='h'?M.hues[state.changed.h].name:`${labels[state.axis]} 실험값 ${state.changed[state.axis]}`);
    $('#propertyOutput').textContent=state.axis==='h'?M.hues[state.changed.h].name:state.changed[state.axis];
    $('#scaleStart').textContent={h:'빨강',l:'어둡게',c:'회색에 가깝게'}[state.axis];
    $('#scaleEnd').textContent={h:'자주',l:'밝게',c:'선명하게'}[state.axis];
    const count=state.axis==='h'?M.hues.length:16;
    $('#propertyScale').innerHTML=Array.from({length:count},(_,index)=>{
      const value=bounds.min+(bounds.max-bounds.min)*index/(count-1);
      return `<i style="background:${M.css(M.change(state.base,state.axis,value))}"></i>`;
    }).join('');
    $('#baselineControls').hidden=isTask();
    document.querySelectorAll('[data-baseline]').forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.baseline)===state.base.h)));
    $('#resetProperty').disabled=state.matched;
  }
  $('#baselineColors').innerHTML=M.hues.map((hue,index)=>`<button type="button" data-baseline="${index}" aria-pressed="${index===5}"><i style="background:${M.css(M.base(index))}" aria-hidden="true"></i>${hue.name}</button>`).join('');
  document.querySelectorAll('[data-baseline]').forEach(button=>button.addEventListener('click',()=>{state.base=M.base(Number(button.dataset.baseline));state.changed={...state.base};render();}));
  document.querySelectorAll('[data-axis]').forEach(button=>button.addEventListener('click',()=>{state.axis=button.dataset.axis;state.changed={...state.base};if(isTask())$('#matchFeedback').textContent='';render();}));
  $('#propertyControl').addEventListener('input',event=>{state.changed=M.change(state.base,state.axis,event.target.value);if(isTask())$('#matchFeedback').textContent='';render();});
  $('#resetProperty').addEventListener('click',()=>{state.changed={...state.base};if(isTask())$('#matchFeedback').textContent='';render();});
  function loadTask(){
    state.base=M.base(5);state.changed={...state.base};state.axis='h';state.matched=false;
    $('#taskTitle').textContent=`색 맞추기 ${state.task+1} / ${M.tasks.length}`;
    $('#matchFeedback').textContent='';$('#nextMatch').hidden=true;$('#checkMatch').hidden=false;$('#hintButton').hidden=false;
    $('#nextMatch').textContent=state.task===M.tasks.length-1?'결과 보기':'다음 색 →';
    render();$('#taskTitle').focus({preventScroll:true});$('#matchTask').scrollIntoView({block:'start'});
  }
  function startTask(){
    beforeTask={base:{...state.base},changed:{...state.changed},axis:state.axis};
    state.task=0;state.records=[];$('#matchTask').hidden=false;$('#matchSummary').hidden=true;$('#startMatch').hidden=true;loadTask();
  }
  function leaveTask(){
    state.task=-1;state.matched=false;Object.assign(state,beforeTask);$('#matchTask').hidden=true;$('#startMatch').hidden=false;render();
  }
  $('#startMatch').addEventListener('click',startTask);$('#retryMatch').addEventListener('click',startTask);
  $('#exitMatch').addEventListener('click',()=>{leaveTask();$('#startMatch').focus();});
  $('#hintButton').addEventListener('click',()=>{$('#matchFeedback').textContent=M.tasks[state.task].hint;});
  $('#checkMatch').addEventListener('click',()=>{
    const task=M.tasks[state.task];
    if(!M.matches(state.changed,task.target)){$('#matchFeedback').textContent='아직 차이가 있습니다. 바꿀 속성과 조절 방향을 다시 살펴보세요.';return;}
    state.matched=true;state.records.push({axis:state.axis,color:{...state.changed}});
    $('#matchFeedback').textContent=`맞췄습니다. ${labels[state.axis]}를 바꾸어 두 색이 거의 같아졌습니다.`;
    $('#checkMatch').hidden=true;$('#hintButton').hidden=true;$('#nextMatch').hidden=false;render();$('#nextMatch').focus({preventScroll:true});
  });
  $('#nextMatch').addEventListener('click',()=>{
    if(!state.matched)return;
    if(state.task<M.tasks.length-1){state.task++;loadTask();return;}
    $('#matchRecords').innerHTML=state.records.map(record=>`<p class="match-record"><i style="background:${M.css(record.color)}" aria-hidden="true"></i><span><strong>${labels[record.axis]}</strong> · ${descriptions[record.axis]}</span></p>`).join('');
    leaveTask();$('#matchSummary').hidden=false;$('#summaryTitle').focus({preventScroll:true});$('#matchSummary').scrollIntoView({block:'start'});
  });
  window.addEventListener('sitebackrequest',event=>{if(!isTask())return;event.preventDefault();leaveTask();$('#startMatch').focus();});
  render();
})();
