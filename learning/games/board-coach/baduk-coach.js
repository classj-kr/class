/* global BadukCoachRules, BadukCoachAI, BoardCoachUI */
(() => {
  'use strict';
  if(document.documentElement.dataset.coachGame!=='baduk')return;
  const R=BadukCoachRules,AI=BadukCoachAI,$=id=>document.getElementById(id);
  let state=R.initial(),level='beginner',human=1,started=false,busy=false,worker=null,token=0,timer=null,timeout=null;
  let hint=null,feedback=null,scene=null,history=[],job='move';
  const escape=text=>String(text).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const principle='활로 세기 → 단수에서 내 돌 지키기 → 돌 연결하기 → 집 지키기';
  document.title='바둑 · AI와 배우기';$('title').textContent='바둑';$('backLink').href='../baduk/baduk';
  BoardCoachUI.mountOpponent();
  // Keep the original game header and board. On small screens explanations go
  // below the match instead of taking height away from the board.
  const wide=matchMedia('(min-width:900px) and (orientation:landscape)');
  function positionNotes(){(wide.matches?$('badukHeader'):document.querySelector('.shell')).append($('badukNotes'));}
  positionNotes();wide.addEventListener('change',positionNotes);
  $('principle').textContent=principle;
  document.querySelector('.color-options').insertAdjacentHTML('beforebegin',`<fieldset id="badukModes"><legend>대국 방식</legend>${Object.entries(R.MODES).map(([id,m])=>`<label class="option secondary"><input type="radio" name="mode" value="${id}" ${id==='capture'?'checked':''}><span><strong>${m.size}×${m.size} · ${m.name}</strong><small>${m.description}</small></span></label>`).join('')}</fieldset>`);
  document.body.insertAdjacentHTML('beforeend','<dialog id="badukResignDialog" aria-labelledby="badukResignTitle"><h2 id="badukResignTitle">이번 대국을 기권할까요?</h2><p>기권하면 대국을 마치고 중요한 장면을 복기할 수 있어요.</p><div class="resign-choices"><button id="badukResignCancel" class="secondary" type="button">계속 두기</button><button id="badukResignConfirm" class="primary" type="button">기권하기</button></div></dialog>');
  $('rulesCopy').innerHTML='<p>흑부터 교차점에 하나씩 둡니다. 위·아래·왼쪽·오른쪽으로 이어진 돌은 활로(빈 이웃 자리)를 공유해요. 마지막 활로를 막으면 상대 돌을 잡아요. 상대 돌을 잡지 못하면서 내 활로가 없어지는 수와 이전 판을 되풀이하는 수는 둘 수 없어요.</p><p>돌 따먹기: 7×7에서 돌 3개를 먼저 잡으면 승리해요. 땅 따먹기: 7×7에서 40수 뒤 내 돌과 둘러싼 빈 땅을 합산해요. 두 모드는 사석을 따로 제거하지 않아요. 둘 곳이 없을 때만 패스하며, 둘 다 못 두면 잡은 돌 수(돌 따먹기) 또는 면적(땅 따먹기)으로 끝내요.</p><p>정식 바둑 연습: 9×9, 백 덤 7.5점, 연속 패스 후 사석 확인. 사석을 직접 표시한 뒤 남은 돌과 둘러싼 빈 땅을 합산해요. 흑돌과 백돌 양쪽에 닿은 빈 영역은 어느 쪽 점수에도 넣지 않아요. AI는 사활 전문가가 아니므로 불확실하면 대국을 계속하세요.</p><p>레벨 1~5는 이 연습 AI 안에서의 상대적 수준이에요. 힌트는 상대 레벨과 별도로 더 깊게 계산한 후보이며 최선 수나 정석을 보장하지 않아요. 시간 제한과 순위 기록은 없어요.</p>';
  function reason(label,title,text){$('reasonLabel').textContent=label;$('moveLabel').textContent=title;$('reason').textContent=text;}
  function stop(){
    if(busy&&job==='hint')reason('힌트 계산 취소','계산을 멈췄어요','힌트를 누르면 다시 계산해요.');
    token++;worker?.terminate();worker=null;clearTimeout(timer);clearTimeout(timeout);busy=false;
    window.ClassGameMotion?.cancel();
  }
  function render(){
    const position=scene?.before||state,mark=scene?scene.feedback?.alternative??scene.index:hint?.index;
    const legal=new Set(R.legal(position)),active=started&&!busy&&!state.ended&&!scene&&state.color===human&&!state.scoring;
    const board=$('board');board.className='board';board.style.gridTemplateColumns=`repeat(${position.size},1fr)`;
    board.setAttribute('aria-label',`${position.size}줄 바둑판`);
    board.innerHTML=position.board.map((v,i)=>{
      const row=Math.floor(i/position.size),col=i%position.size,dead=position.dead.includes(i),coordinate=R.coord(i,position.size);
      const enabled=!scene&&(state.scoring?!!v:active&&legal.has(i));
      return `<button type="button" role="gridcell" class="square point${col===0?' edge-left':''}${col===position.size-1?' edge-right':''}${row===0?' edge-top':''}${row===position.size-1?' edge-bottom':''}${mark===i?' suggested':''}${position.last===i?' last':''}${dead?' dead-stone':''}" data-index="${i}" ${enabled?'':'disabled'} title="${coordinate}" aria-label="${coordinate} · ${v===1?'흑돌':v===2?'백돌':legal.has(i)?'둘 수 있는 곳':'둘 수 없는 곳'}${dead?' · 사석 표시':''}${mark===i?' · 추천 자리':''}">${v?`<span class="stone ${v===1?'black':'white'}"></span>`:''}${mark===i?'<span class="hint-ring" aria-hidden="true"></span>':''}</button>`;
    }).join('');
    const opponent=started&&!scene&&!state.ended&&!state.scoring?history.at(-1)?.opponent:null;
    BoardCoachUI.showOpponent(opponent,board,position.size);
    $('turn').textContent=scene?`${history.indexOf(scene)+1}수 두기 전 · 복기`:!started?'레벨과 대국 방식을 골라 시작하세요.':state.ended?(state.winner===0?'무승부예요.':state.winner===human?'내가 이겼어요!':'AI가 이겼어요.'):state.scoring?'사석을 확인하세요':busy&&job==='move'?'AI가 생각하고 있어요…':state.color===human?'내 차례':'AI 차례';
    $('score').textContent=`${position.count}수`;
    $('title').textContent=R.MODES[position.mode].name;
    $('blackName').textContent=human===1?'나':'AI';$('whiteName').textContent=human===2?'나':'AI';
    $('blackCaptured').textContent=position.captures[0];$('whiteCaptured').textContent=position.captures[1];
    $('blackCard').classList.toggle('active',started&&!state.ended&&!state.scoring&&position.color===1);
    $('whiteCard').classList.toggle('active',started&&!state.ended&&!state.scoring&&position.color===2);
    $('badukStatus').textContent=position.scores?`최종 점수: 흑 ${position.scores.black} · 백 ${position.scores.white}`:position.mode==='territory'?`${position.count}/40수`:position.mode==='standard'?(position.passes===1?'한쪽 패스 · 이어서 패스하면 사석 확인':'마칠 때 ‘끝내고 계가’를 누르세요'):R.MODES[position.mode].description;
    $('badukFinish').classList.toggle('hidden',state.mode!=='standard');
    $('badukFinish').disabled=!started||state.ended||state.scoring||!!scene;
    $('levelLabel').textContent=AI.LEVELS[level].name;$('colorLabel').textContent=`내 돌: ${human===1?'검은색':'흰색'}`;
    $('hint').disabled=!active;$('undo').disabled=!history.some(m=>m.color===human)||!!scene;
    $('badukPass').disabled=!active||!R.canPass(state);$('badukPass').classList.toggle('suggested',mark===-1);
    $('badukPass').textContent=mark===-1?'패스 · 추천':'패스';
    $('badukResign').disabled=!started||state.ended||!!scene||state.scoring;
    $('feedbackPanel').classList.toggle('hidden',!feedback||!!scene||state.scoring);$('feedback').textContent=feedback?.text||'';
    $('badukScoring').classList.toggle('hidden',!state.scoring||!!scene);
    if(state.scoring){const score=R.preview(state);$('badukScorePreview').textContent=`표시한 사석 ${state.dead.length}개를 빼면 흑 ${score.black}점 · 백 ${score.white}점(덤 포함)`;}
    $('reviewPanel').classList.toggle('hidden',!state.ended);$('liveBoard').classList.toggle('hidden',!scene);
    if(state.ended){
      let chosen=history.filter(m=>m.feedback).slice(-3);if(!chosen.length)chosen=history.slice(-3);
      $('reviewList').innerHTML=chosen.map(m=>`<button type="button" class="secondary" data-review="${history.indexOf(m)}"><strong>${history.indexOf(m)+1}수 · ${R.coord(m.index,m.before.size)}</strong>${escape(m.feedback?.text||m.reason)}</button>`).join('')||'<p>아직 복기할 수가 없어요.</p>';
    }
  }
  function fail(text){stop();$('retry').classList.remove('hidden');reason('다시 시도할 수 있어요','계산을 마치지 못했어요',text);render();}
  function calculate(kind){
    if(!started||state.ended||state.scoring||scene||$('setup').open||$('badukResignDialog').open||(kind==='hint')!==(state.color===human))return;
    stop();hint=null;job=kind;busy=true;$('retry').classList.add('hidden');const id=token;
    if(kind==='hint')reason('힌트를 생각하고 있어요','잠깐만 기다려 주세요','활로와 연결, 상대가 잡을 수 있는 돌을 살펴보고 있어요.');render();
    try{
      worker=new Worker('baduk-worker.js?v=5');
      worker.onmessage=event=>{
        if(id!==token||event.data.token!==id)return;
        const {result,error}=event.data;
        if(error||!result||!R.play(state,result.index)){fail('다시 계산해 주세요. 현재 판은 그대로 남아 있어요.');return;}
        worker.terminate();worker=null;clearTimeout(timeout);busy=false;
        if(kind==='hint'){hint=result;reason('힌트 · 한 가지 후보',R.coord(result.index,state.size),result.reason);render();BoardCoachUI.revealExplanation();}
        else apply(result.index,false,result);
      };
      worker.onerror=()=>{if(id===token)fail('다시 계산하기를 누르거나 내 수를 물릴 수 있어요.');};
      timeout=setTimeout(()=>{if(id===token)fail('계산이 오래 걸리고 있어요. 다시 시도해 주세요.');},12000);
      worker.postMessage({token:id,state,level,kind});
    }catch{fail('계산을 시작하지 못했어요. 다시 계산하기를 누르세요.');}
  }
  function continueComputer(){
    clearTimeout(timer);
    if(started&&!busy&&!state.ended&&!state.scoring&&!scene&&state.color!==human&&!$('setup').open&&!$('badukResignDialog').open){
      const id=token;timer=setTimeout(()=>{if(id===token)calculate('move');},350);
    }
  }
  function apply(index,isHuman,answer){
    const before=state,next=R.play(before,index);if(!next)return;
    const followed=isHuman&&hint?.index===index,explanation=answer?.reason||(followed?hint.reason:AI.explain(before,index));
    if(isHuman)feedback=followed?null:AI.review(before,index);
    state=next;history.push({before,index,color:before.color,reason:explanation,feedback:isHuman?feedback:null,opponent:isHuman?null:answer?.opponent||AI.opponentView(before,index)});
    hint=null;$('retry').classList.add('hidden');reason(isHuman?'내가 둔 수':'AI의 수',R.coord(index,state.size),isHuman&&feedback?feedback.text:explanation);render();
    if(index>=0){window.ClassGameSfx?.play(state.captured.length?'capture':'stone');window.ClassGameMotion?.appear($('board').querySelector(`[data-index="${index}"] .stone`));}
    if(state.scoring){reason('연속 패스','사석을 확인할 차례예요','죽은 돌을 직접 표시하고 계가하세요. 살아 있는지 확실하지 않다면 대국을 계속하세요.');$('badukScoring').scrollIntoView({block:'nearest'});}
    continueComputer();
  }
  function humanMove(index){if(started&&!busy&&!state.ended&&!state.scoring&&!scene&&state.color===human)apply(index,true);}
  function undo(){
    const at=history.findLastIndex(m=>m.color===human);if(at<0||scene)return;
    stop();state=history[at].before;history=history.slice(0,at);feedback=null;hint=null;scene=null;$('retry').classList.add('hidden');
    reason('다시 생각할 차례','내 수를 물렸어요','내 마지막 수를 두기 전으로 돌아왔어요. 다른 수를 두거나 힌트를 살펴보세요.');render();
  }
  $('board').addEventListener('click',event=>{
    const button=event.target.closest('[data-index]');if(!button)return;const i=Number(button.dataset.index);
    if(state.scoring&&!scene){state=R.toggleDead(state,i);render();}else humanMove(i);
  });
  $('hint').addEventListener('click',()=>calculate('hint'));$('retry').addEventListener('click',()=>calculate(job));
  $('undo').addEventListener('click',undo);$('rethink').addEventListener('click',undo);$('badukPass').addEventListener('click',()=>humanMove(-1));
  $('rulesButton').addEventListener('click',()=>$('badukRules').showModal());
  $('closeRules').addEventListener('click',()=>$('badukRules').close());
  $('badukFinish').addEventListener('click',()=>{
    if(!started||scene||state.mode!=='standard'||state.ended||state.scoring)return;
    stop();hint=null;feedback=null;$('retry').classList.add('hidden');state=R.beginScoring(state);
    reason('계가 준비','사석을 확인하고 마무리하세요','죽은 돌을 표시한 뒤 계가하면 승패가 나와요. 더 둘 곳이 있으면 대국을 계속할 수 있어요.');
    render();$('badukScoring').scrollIntoView({block:'nearest'});
  });
  $('newGame').addEventListener('click',()=>{stop();hint=null;$('retry').classList.add('hidden');$('setup').showModal();render();});
  $('closeSetup').addEventListener('click',()=>$('setup').close());$('setup').addEventListener('close',continueComputer);
  $('setupForm').addEventListener('submit',event=>{
    event.preventDefault();stop();const form=new FormData(event.currentTarget);
    level=Object.hasOwn(AI.LEVELS,form.get('level'))?form.get('level'):'beginner';human=form.get('color')==='2'?2:1;
    state=R.initial(form.get('mode'));started=true;history=[];hint=null;feedback=null;scene=null;$('retry').classList.add('hidden');
    reason('첫 차례',R.MODES[state.mode].name,principle);$('setup').close();render();continueComputer();
  });
  $('badukAgree').addEventListener('click',()=>{if(!state.scoring)return;stop();state=R.confirmScore(state);feedback=null;render();reason('대국 종료','표시한 사석으로 계가했어요',`흑 ${state.scores.black}점 · 백 ${state.scores.white}점. 중요한 장면을 다시 살펴보세요.`);});
  $('badukResume').addEventListener('click',()=>{if(!state.scoring)return;stop();state=R.resume(state);reason('대국 계속하기','사석 표시를 지웠어요','확실하지 않은 돌은 실제로 잡을 수 있는지 확인하며 계속 두세요.');render();continueComputer();});
  $('badukResign').addEventListener('click',()=>{stop();hint=null;$('badukResignDialog').showModal();render();});
  $('badukResignCancel').addEventListener('click',()=>$('badukResignDialog').close());$('badukResignDialog').addEventListener('close',continueComputer);
  $('badukResignConfirm').addEventListener('click',()=>{stop();state={...state,ended:true,winner:3-human};feedback=null;$('badukResignDialog').close();reason('대국 종료','이번 대국을 기권했어요','중요한 장면을 복기하거나 새 대국을 시작해 보세요.');render();});
  $('reviewList').addEventListener('click',event=>{const button=event.target.closest('[data-review]');if(!button)return;scene=history[Number(button.dataset.review)];reason('중요한 장면',`${R.coord(scene.index,scene.before.size)} 두기 전`,scene.feedback?.text||scene.reason);render();BoardCoachUI.revealExplanation();});
  $('liveBoard').addEventListener('click',()=>{scene=null;reason('복기','마지막 판', '다른 장면을 보거나 새 대국에 도전해 보세요.');render();});
  window.addEventListener('pagehide',stop);window.addEventListener('pageshow',event=>{if(event.persisted){render();continueComputer();}});
  render();BoardCoachUI.ready(AI.LEVELS,'baduk');$('setup').showModal();
})();
