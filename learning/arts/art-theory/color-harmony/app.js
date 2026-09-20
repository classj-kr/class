(() => {
  'use strict';
  const M=window.ColorHarmony,P=window.ColorProperties,$=selector=>document.querySelector(selector);
  const clone=value=>JSON.parse(JSON.stringify(value));
  const initialContext=()=>({left:90,right:25,center:5,neutral:false});
  const state={study:'context',context:initialContext(),current:M.defaults(),reference:M.defaults(),records:[],nextId:1};
  function composition(target,recipe){
    const colors=M.palette(recipe),ratios=M.ratios(recipe);
    target.innerHTML=colors.map((color,index)=>`<i style="background:${color};width:${ratios[index]}%"></i>`).join('');
    target.setAttribute('aria-label',`${recipe.scheme==='near'?'이웃한 색':'마주 보는 색'} 배색. 첫째 색 ${ratios[0]}%, 둘째 색 ${ratios[1]}%, 셋째 색 ${ratios[2]}%.`);
  }
  function renderContext(){
    const c=state.context;
    $('#leftField').style.backgroundColor=M.gray(c.neutral?65:c.left);
    $('#rightField').style.backgroundColor=M.gray(c.neutral?65:c.right);
    const centerColor=P.css(P.base(c.center));
    for(const id of ['leftCenter','rightCenter']){
      $('#'+id).style.backgroundColor=centerColor;
      $('#'+id).setAttribute('aria-label',`${id==='leftCenter'?'왼쪽':'오른쪽'} 가운데: ${P.hues[c.center].name}`);
    }
    for(const side of ['left','right']){
      $('#'+side+'Lightness').value=c.neutral?65:c[side];$('#'+side+'Lightness').disabled=c.neutral;$('#'+side+'Output').textContent=c.neutral?65:c[side];
    }
    $('#neutralBackgrounds').setAttribute('aria-pressed',String(c.neutral));
    $('#neutralBackgrounds').textContent=c.neutral?'원래 배경으로':'같은 배경에서 확인';
    $('#swapBackgrounds').disabled=c.neutral;
    $('#contextFeedback').textContent=c.neutral?'가운데 두 색은 같은 색입니다. 원래 배경으로 돌아가 다시 비교해 보세요.':c.left===c.right?'지금은 배경의 밝기도 같습니다. 한쪽 배경만 바꿔 비교해 보세요.':'한쪽이 더 밝거나 선명하게 보이나요? 같은 배경으로 바꿔 확인해 보세요.';
    document.querySelectorAll('[data-center]').forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.center)===c.center)));
  }
  function renderArea(){
    composition($('#referenceComposition'),state.reference);composition($('#currentComposition'),state.current);
    const ratioText=recipe=>M.ratios(recipe).map((value,index)=>`<span>${['첫째','둘째','셋째'][index]} ${value}%</span>`).join('');
    $('#referenceRatio').innerHTML=ratioText(state.reference);$('#currentRatio').innerHTML=ratioText(state.current);
    $('#mainArea').value=state.current.main;$('#mainArea').max=95-state.current.accent;$('#mainOutput').textContent=state.current.main+'%';
    $('#accentArea').value=state.current.accent;$('#accentArea').max=95-state.current.main;$('#accentOutput').textContent=state.current.accent+'%';
    $('#secondaryOutput').textContent=M.ratios(state.current)[1]+'%';
    document.querySelectorAll('[data-scheme]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.scheme===state.current.scheme)));
    document.querySelectorAll('[data-palette]').forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.palette)===state.current.hue)));
    $('#schemeDescription').textContent=state.current.scheme==='near'?'색상환에서 이웃한 세 색을 사용합니다.':'셋째 색을 첫째 색의 반대편 색으로 바꿉니다.';
    const sameColors=M.samePalette(state.reference,state.current);
    const sameAreas=M.ratios(state.reference).every((value,index)=>value===M.ratios(state.current)[index]);
    $('#areaFeedback').textContent=sameColors?(sameAreas?'기준과 같은 배색입니다. 한 색의 면적부터 바꿔 보세요.':'색은 그대로이고 면적만 달라졌습니다. 어느 색이 먼저 눈에 들어오나요?'):(sameAreas?'면적은 그대로이고 색의 관계가 달라졌습니다. 두 배색을 비교해 보세요.':'색과 면적이 함께 달라졌습니다. 한 조건만 비교하려면 현재 배색을 기준으로 삼으세요.');
  }
  function render(){
    const isContext=state.study==='context';
    $('#contextStudy').hidden=!isContext;$('#areaStudy').hidden=isContext;
    document.querySelectorAll('[data-study]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.study===state.study)));
    $('#studyIntro').textContent=isContext?'가운데 두 색을 비교하세요. 배경을 바꾸면 어떻게 보이나요?':'같은 색도 사용하는 면적에 따라 화면이 달라집니다.';
    $('#observationTitle').textContent=isContext?'다르게 보이는 이유':'비율에 정답이 있을까요?';
    $('#observationPrompt').textContent=isContext?'같은 색도 주변 색에 따라 다르게 보일 수 있습니다. 같은 배경으로 바꿔 확인해 보세요.':'셋째 색의 면적을 작게, 크게 바꾸어 보세요. 눈에 띄게 만들고 싶은 색에 따라 비율을 정할 수 있습니다.';
    renderContext();renderArea();
  }
  $('#centerChoices').innerHTML=P.hues.map((hue,index)=>`<button type="button" data-center="${index}" aria-pressed="false"><i style="background:${P.css(P.base(index))}" aria-hidden="true"></i>${hue.name}</button>`).join('');
  $('#paletteChoices').innerHTML=P.hues.map(hue=>`<button type="button" data-palette="${hue.angle}" aria-pressed="false"><i style="background:oklch(65% 0.08 ${hue.angle})" aria-hidden="true"></i>${hue.name}</button>`).join('');
  document.querySelectorAll('[data-center]').forEach(button=>button.addEventListener('click',()=>{state.context.center=Number(button.dataset.center);renderContext();}));
  document.querySelectorAll('[data-palette]').forEach(button=>button.addEventListener('click',()=>{state.current.hue=Number(button.dataset.palette);renderArea();}));
  document.querySelectorAll('[data-study]').forEach(button=>button.addEventListener('click',()=>{state.study=button.dataset.study;render();}));
  document.querySelectorAll('[data-scheme]').forEach(button=>button.addEventListener('click',()=>{state.current.scheme=button.dataset.scheme;renderArea();}));
  for(const side of ['left','right'])$('#'+side+'Lightness').addEventListener('input',event=>{state.context[side]=Number(event.target.value);renderContext();});
  $('#neutralBackgrounds').addEventListener('click',()=>{state.context.neutral=!state.context.neutral;renderContext();});
  $('#swapBackgrounds').addEventListener('click',()=>{[state.context.left,state.context.right]=[state.context.right,state.context.left];renderContext();});
  $('#mainArea').addEventListener('input',event=>{state.current=M.adjust(state.current,'main',event.target.value);renderArea();});
  $('#accentArea').addEventListener('input',event=>{state.current=M.adjust(state.current,'accent',event.target.value);renderArea();});
  $('#setReference').addEventListener('click',()=>{state.reference=clone(state.current);renderArea();$('#areaFeedback').textContent='현재 배색을 기준으로 고정했습니다. 한 가지 조건을 바꿔 비교해 보세요.';});
  $('#restoreReference').addEventListener('click',()=>{state.current=clone(state.reference);renderArea();});
  $('#resetStudy').addEventListener('click',()=>{
    if(state.study==='context')state.context=initialContext();else{state.current=M.defaults();state.reference=M.defaults();}
    render();
  });
  function renderRecords(){
    const host=$('#records');host.innerHTML='';
    state.records.forEach(record=>{
      const article=document.createElement('article');article.className='comparison-record';
      article.innerHTML=`<div class="record-preview" aria-hidden="true"></div><div><h3>${record.study==='context'?'주변 색 비교':'관계와 면적 비교'}</h3><p></p></div><div class="record-controls"><button type="button" class="text-button" data-restore="${record.id}">다시 보기</button><button type="button" class="text-button" data-delete="${record.id}" aria-label="기록 ${record.id} 삭제">삭제</button></div>`;
      const preview=article.querySelector('.record-preview');
      if(record.study==='context'){
        const c=record.context;
        preview.innerHTML=['left','right'].map(side=>`<div class="mini-context" style="background:${M.gray(c.neutral?65:c[side])}"><i style="background:${P.css(P.base(c.center))}"></i></div>`).join('');
        article.querySelector('p').textContent=`${P.hues[c.center].name} · 배경 밝기 ${c.neutral?'65 / 65':`${c.left} / ${c.right}`}`;
      }else{
        for(const recipe of [record.reference,record.current]){const strip=document.createElement('div');strip.className='composition';composition(strip,recipe);preview.append(strip);}
        article.querySelector('p').textContent=`면적 ${M.ratios(record.reference).join(' : ')} → ${M.ratios(record.current).join(' : ')}`;
      }
      host.append(article);
    });
  }
  $('#saveRecord').addEventListener('click',()=>{
    const record=state.study==='context'?{id:state.nextId++,study:state.study,context:clone(state.context)}:{id:state.nextId++,study:state.study,current:clone(state.current),reference:clone(state.reference)};
    state.records.push(record);renderRecords();$('#recordStatus').textContent=`비교를 기록했습니다. 현재 ${state.records.length}개입니다.`;
  });
  $('#records').addEventListener('click',event=>{
    const restore=event.target.closest('[data-restore]'),remove=event.target.closest('[data-delete]');
    if(restore){
      const record=state.records.find(item=>item.id===Number(restore.dataset.restore));state.study=record.study;
      if(record.study==='context')state.context=clone(record.context);else{state.current=clone(record.current);state.reference=clone(record.reference);}
      render();const tab=$(`[data-study="${state.study}"]`);tab.focus({preventScroll:true});tab.scrollIntoView({block:'start'});
    }
    if(remove){
      state.records=state.records.filter(item=>item.id!==Number(remove.dataset.delete));renderRecords();$('#recordStatus').textContent=`기록을 삭제했습니다. 현재 ${state.records.length}개입니다.`;$('#saveRecord').focus({preventScroll:true});
    }
  });
  render();
})();
