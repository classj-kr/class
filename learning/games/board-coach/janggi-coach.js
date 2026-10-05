/* global JanggiCoachRules, JanggiCoachAI, JanggiMotion, BoardCoachUI */
(() => {
  "use strict";
  if(new URLSearchParams(location.search).get("game")!=="janggi")return;
  const R=JanggiCoachRules,AI=JanggiCoachAI,$=id=>document.getElementById(id);
  let state=R.initial(),human="c",level="beginner",started=false,selected=null,hint=null,scene=null,feedback=null,history=[];
  let worker=null,token=0,timeout=null,nextTurn=null,busy=false,job="move";
  let motion=null,moving=false;
  const pieceTypes={R:'rook',C:'cannon',H:'horse',E:'elephant',A:'guard',P:'soldier',K:'king'};
  const pieceInfo=p=>({side:p[0]==='c'?'cho':'han',type:pieceTypes[p[1]]});
  const subject=word=>word+((word.charCodeAt(word.length-1)-0xac00)%28?'이':'가');
  const object=word=>word+((word.charCodeAt(word.length-1)-0xac00)%28?'을':'를');
  const escape=text=>String(text).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const endLabels={mate:"외통수",bikjang:"빅장",passes:"양쪽 한 수 쉬기",repetition:"같은 판 반복","perpetual-check":"반복 장군",quiet:"잡기 없이 100수",resign:"기권"};
  document.title="장기 · AI와 배우기";document.body.classList.add("janggi-coach");
  $("title").textContent="장기";$("backLink").href="../janggi/janggi";
  $("principle").textContent="마와 상을 꺼내고, 차가 나갈 길을 열며, 서로 말을 지키세요.";
  document.querySelector(".color-options legend").textContent="내 편";
  document.querySelector(".color-options input[value='1'] + span strong").textContent="초 · 파란색";
  document.querySelector(".color-options input[value='2'] + span strong").textContent="한 · 빨간색";
  const formations=R.FORMS.map(form=>`<option value="${form}" ${form==="HEEH"?"selected":""}>${[...form].map(p=>p==="H"?"마":"상").join(" · ")}</option>`).join("");
  document.querySelector(".color-options").insertAdjacentHTML("afterend",`<fieldset class="formation-options"><legend>마·상 배치</legend><label>내 차림<select id="humanFormation" name="formation">${formations}</select></label><label>AI 차림<select id="aiFormation" name="aiFormation">${formations}</select></label></fieldset>`);
  $("rulesCopy").innerHTML='<p>초(파란색)가 먼저 둡니다. 말을 누른 뒤 표시된 자리로 옮기세요. 숫자 두 자리는 세로 위치·가로 위치입니다. 초의 맨 아래 줄은 0으로 표시합니다.</p><ul><li><b>차</b>: 가로·세로로 막히지 않는 만큼 갑니다. 궁성에서는 대각선도 갑니다.</li><li><b>포</b>: 포가 아닌 말 하나를 반드시 넘어갑니다. 포는 넘지도 잡지도 못합니다. 궁성 대각선에서는 가운데 말을 넘어갑니다.</li><li><b>마</b>: 곧게 한 칸, 대각선으로 한 칸 갑니다. 첫 길목이 막히면 못 갑니다.</li><li><b>상</b>: 곧게 한 칸, 대각선으로 두 칸 갑니다. 두 길목 중 하나라도 막히면 못 갑니다.</li><li><b>졸·병</b>: 앞으로 또는 옆으로 한 칸 갑니다. 상대 궁성에서는 앞쪽 대각선도 갑니다.</li><li><b>왕·사</b>: 자기 궁성 안의 선을 따라 한 칸 갑니다.</li></ul><p>왕이 공격받으면 장군입니다. 왕을 옮기거나, 공격을 막거나, 공격하는 말을 잡아야 합니다. 어느 방법으로도 피할 수 없으면 외통수로 집니다.</p><p>두 왕이 같은 세로줄에서 마주 보면 빅장입니다. 다음 사람은 사이를 막거나 왕을 옮겨 계속 두거나, ‘빅장 수락’으로 비길 수 있습니다. 빅장과 장군이 동시에 생겨도 빅장을 받아들일 수 있습니다.</p><p>장군이 아닐 때 ‘한 수 쉬기’로 차례를 넘길 수 있습니다. 양쪽이 연속으로 쉬면 무승부입니다.</p><p>학습 대국에서는 같은 판과 차례가 세 번 반복되면 무승부로 끝냅니다. 단, 한쪽이 계속 장군을 부르며 반복했다면 그쪽이 집니다. 잡기 없이 100수(양쪽 50수씩)가 지나도 무승부입니다. 대회의 점수제와 한의 1.5점 덤은 적용하지 않습니다.</p><p>‘내 수 물리기’는 내 마지막 수와 그 뒤의 AI 수를 함께 취소합니다. 시간 제한은 없습니다.</p><p>참고: <a href="https://www.pychess.org/variants/janggi" target="_blank" rel="noopener">장기 행마·빅장 설명</a> · <a href="https://www.kojf.net/theme/sample30/html/content03.php" target="_blank" rel="noopener">대한장기연맹 대회 규정</a></p>';
  document.querySelector(".controls").insertAdjacentHTML("beforeend",'<button id="janggiPass" type="button" class="quiet" disabled>한 수 쉬기</button><button id="janggiResign" type="button" class="quiet" disabled>기권</button>');
  // Keep the existing Janggi board dominant and group learning controls beside it.
  $("backLink").textContent="메인 화면으로";
  document.querySelector(".controls").append($("backLink"));
  document.querySelector(".sidebar").prepend(document.querySelector(".topbar"),document.querySelector(".matchbar"),document.querySelector(".lesson"),document.querySelector(".controls"));
  document.querySelector('.controls').insertAdjacentHTML('afterend','<section id="janggiCaptures" class="panel capture-summary" aria-label="잡은 말"><p id="latestCapture" class="latest-capture" aria-live="polite">아직 잡힌 말이 없어요.</p><div class="capture-trays"><div><h3>내가 잡은 말 <span id="myCaptureCount">0</span></h3><div id="myCaptures" class="capture-tokens"></div></div><div><h3>AI가 잡은 말 <span id="aiCaptureCount">0</span></h3><div id="aiCaptures" class="capture-tokens"></div></div></div></section>');
  document.querySelector(".explanation").insertAdjacentHTML("beforebegin",'<section id="opponentPanel" class="panel opponent-plan hidden" aria-live="polite" aria-labelledby="opponentTitle"><span class="eyebrow">상대가 노리는 것</span><h2 id="opponentTitle"></h2><p id="opponentIntent"></p><p id="opponentDanger" class="opponent-danger"></p><h3>내 대응 방향</h3><p id="opponentResponse"></p><details id="opponentForecast" open><summary>예상되는 다음 수</summary><p id="opponentLine"></p></details></section>');
  document.querySelector(".sidebar").insertAdjacentHTML("beforeend",'<details class="panel janggi-record"><summary>대국 기록</summary><div id="janggiMoves">아직 둔 수가 없습니다.</div></details>');
  document.body.insertAdjacentHTML("beforeend",'<dialog id="janggiConfirm" aria-labelledby="janggiConfirmTitle"><h2 id="janggiConfirmTitle"></h2><p id="janggiConfirmText"></p><div class="resign-choices"><button id="janggiConfirmYes" type="button"></button><button id="janggiConfirmCancel" class="quiet" type="button">취소</button></div></dialog>');
  let confirmKind=null;
  function reason(label,title,text){$("reasonLabel").textContent=label;$("moveLabel").textContent=title;$("reason").textContent=text;}
  function stop(){if(busy&&job==="hint")reason("힌트 계산 취소","계산을 멈췄어요","힌트를 누르면 다시 계산합니다.");token++;worker?.terminate();worker=null;clearTimeout(timeout);clearTimeout(nextTurn);busy=false;moving=false;motion?.cancel();motion=null;}
  function renderCaptures(position){
    const captures=position.history.filter(entry=>entry.move?.capture),latest=captures.at(-1);
    for(const [side,id,countId]of [[human,'myCaptures','myCaptureCount'],[R.other(human),'aiCaptures','aiCaptureCount']]){
      const taken=captures.filter(entry=>entry.mover===side),groups=new Map();
      taken.forEach(entry=>groups.set(entry.move.capture,(groups.get(entry.move.capture)||0)+1));
      $(countId).textContent=taken.length;
      $(id).innerHTML=groups.size?[...groups].map(([p,count])=>`<span class="capture-token" aria-label="${AI.name(p)} ${count}개"><b class="${p[0]==='c'?'cho':'han'}" aria-hidden="true">${JanggiMotion.face(pieceInfo(p))}</b><span>${AI.name(p)}${count>1?' ×'+count:''}</span></span>`).join(''):'<span class="capture-empty">없음</span>';
    }
    if(latest){
      const m=latest.move,ply=position.ply-position.history.length+1+position.history.indexOf(latest);
      $('latestCapture').textContent=`최근 잡기 · ${ply}수\n${latest.mover===human?'내':'AI의'} ${subject(AI.name(m.piece))} ${latest.mover===human?'상대':'내'} ${object(AI.name(m.capture))} 잡았어요.`;
    }else $('latestCapture').textContent='아직 잡힌 말이 없어요.';
  }
  function render(){
    const position=scene?.before||state,end=R.status(state),moves=R.actions(position);
    renderCaptures(moving?history.at(-1).before:position);
    const opponent=started&&!scene&&!end.ended&&state.turn===human?history.at(-1)?.opponent:null;
    const threatened=new Set(opponent?.targets||[]);
    $("opponentPanel").classList.toggle("hidden",!opponent);
    if(opponent){
      $("opponentTitle").textContent=opponent.title;$("opponentIntent").textContent=opponent.summary;
      $("opponentDanger").textContent=opponent.danger;$("opponentDanger").classList.toggle("hidden",!opponent.danger);
      $("opponentResponse").textContent=opponent.response;
      // Once a hint is chosen, its deeper continuation is shown with the hint.
      // Keep the threats visible without displaying two competing forecasts.
      $("opponentForecast").classList.toggle("hidden",!!hint||!opponent.forecast);$("opponentLine").textContent=opponent.forecast;
    }
    const active=started&&!busy&&!moving&&!scene&&!end.ended&&state.turn===human;
    const sources=new Set(moves.filter(m=>!m.kind).map(m=>m.from));
    const targets=new Set(moves.filter(m=>!m.kind&&m.from===selected).map(m=>m.to));
    const mark=scene?scene.feedback?.alternative||scene.move:hint?.move,last=position.last;
    const king=R.inCheck(position)?position.board.indexOf(position.turn+"K"):-1;
    $("board").className="janggi janggi-board";$("board").setAttribute("aria-label","장기판");
    const lines=Array.from({length:9},(_,x)=>`<div class="gridline vline" style="left:${5.55+x*11.11}%" aria-hidden="true"></div>`).join("")+
      Array.from({length:10},(_,y)=>`<div class="gridline hline" style="top:${5+y*10}%" aria-hidden="true"></div>`).join("");
    const palace='<svg class="palace-svg" viewBox="0 0 8 9" preserveAspectRatio="none" aria-hidden="true"><line x1="3" y1="0" x2="5" y2="2"/><line x1="5" y1="0" x2="3" y2="2"/><line x1="3" y1="7" x2="5" y2="9"/><line x1="5" y1="7" x2="3" y2="9"/></svg>';
    $("board").innerHTML=lines+palace+Array.from({length:90},(_,view)=>{
      const index=human==="c"?view:89-view,p=position.board[index];
      const target=targets.has(index),can=active&&(sources.has(index)||target);
      const classes=["square",target?"target":"",selected===index?"selected":"",king===index?"checked":"",threatened.has(index)?"threatened":"",last&&!last.kind&&(last.from===index||last.to===index)?"recent":"",mark&&!mark.kind&&(mark.from===index||mark.to===index)?"suggested":""].filter(Boolean).join(" ");
      const face=p?(p[1]==="K"?(p[0]==="c"?"楚":"漢"):p[1]==="P"?(p[0]==="c"?"卒":"兵"):{A:"士",R:"車",C:"包",H:"馬",E:"象"}[p[1]]):"";
      const type=p?{K:"king",A:"guard",R:"rook",C:"cannon",H:"horse",E:"elephant",P:"soldier"}[p[1]]:"";
      const pieceClasses=["piece","janggi-piece",p?.[0]==="c"?"cho":"han",type,selected===index?"selected":"",king===index?"check":"",last&&!last.kind&&last.to===index?"last-moved":""].filter(Boolean).join(" ");
      return `<button type="button" role="gridcell" class="${classes}" data-square="${index}" ${can?"":"disabled"} aria-pressed="${selected===index}" aria-label="${R.coord(index)} · ${p?(p[0]==="c"?"초 ":"한 ")+AI.name(p):"빈자리"}${target?" · 이동 가능":""}${threatened.has(index)?" · 상대가 노리는 말":""}" title="${p?(p[0]==="c"?"초 ":"한 ")+AI.name(p)+" · ":""}${R.coord(index)}${threatened.has(index)?" · 상대가 노리는 말":""}">${p?`<span class="${pieceClasses}" aria-hidden="true">${face}</span>`:target?'<span class="legal-dot"></span>':""}</button>`;
    }).join("");
    BoardCoachUI.markMove($("board"),mark,9);
    $("levelLabel").textContent=AI.LEVELS[level].name+" AI";$("colorLabel").textContent=human==="c"?"나는 초":"나는 한";
    $("score").textContent=`${scene?history.indexOf(scene):state.ply}수`;
    $("turn").textContent=scene?`${history.indexOf(scene)+1}수 두기 전`:!started?"AI 수준을 골라 시작하세요.":end.ended?`${endLabels[end.reason]} · ${end.winner?(end.winner===human?"내가 이겼어요":"AI가 이겼어요"):"무승부"}`:moving?"말이 움직이고 있어요…":busy&&job==="move"?"AI가 생각하고 있어요…":`${state.turn===human?"내 차례":"AI 차례"}${R.facing(state)?" · 빅장":R.inCheck(state)?" · 장군":""}${R.repetitionCount(state)===2?" · 같은 판 2회":""}`;
    $("undo").disabled=!history.some(m=>m.side===human)||!!scene;
    $("hint").disabled=!active;$("janggiResign").disabled=!started||end.ended||!!scene;
    $("zoom").disabled=moving;
    const special=moves.find(m=>m.kind);$("janggiPass").disabled=!active||!special;
    $("janggiPass").textContent=special?.kind==="bikjang"?"빅장 수락":"한 수 쉬기";
    $("feedbackPanel").classList.toggle("hidden",!feedback||!!scene);$("feedback").textContent=feedback?.text||"";
    $("reviewPanel").classList.toggle("hidden",!end.ended);$("liveBoard").classList.toggle("hidden",!scene);
    if(end.ended){
      let chosen=history.filter(m=>m.feedback).slice(-3);if(!chosen.length)chosen=history.filter(m=>m.side!==human).slice(-3);
      $("reviewList").innerHTML=chosen.length?chosen.map(m=>`<button type="button" data-review="${history.indexOf(m)}"><strong>${history.indexOf(m)+1}수 · ${escape(AI.label(m.move))}</strong>${escape(m.feedback?.text||m.reason)}</button>`).join(""):'<p>다시 볼 수가 없습니다.</p>';
    }
    $("janggiMoves").textContent=history.length?history.map((m,i)=>`${i+1}. ${m.side==="c"?"초":"한"} ${AI.label(m.move)}${m.move.capture?' · '+AI.name(m.move.capture)+' 잡음':''}`).join("\n"):"아직 둔 수가 없습니다.";
  }
  function commit(move,isHuman=false,opponent=null){
    const result=R.play(state,move);if(!result.ok){reason("이동 확인","둘 수 없는 수",result.error);return;}
    const followed=isHuman&&hint?.move&&R.same(result.move,hint.move);
    const before=state,explanation=followed?hint.reason:AI.explain(before,result.move);
    feedback=isHuman?(followed?null:AI.review(before,result.move)):feedback;
    history.push({before,move:result.move,side:before.turn,reason:explanation,feedback:isHuman?feedback:null,opponent:isHuman?null:opponent||AI.opponentView(before,result.move)});
    state=result.state;selected=null;hint=null;$("retry").classList.add("hidden");
    reason(isHuman?"내가 둔 수":"AI의 수",AI.label(result.move),isHuman&&feedback?feedback.text:explanation);
    moving=!result.move.kind;render();
    if(!moving){resume();return;}
    const m=result.move,position=state,id=token;
    const type=pieceTypes[m.piece[1]];
    const display=(x,y)=>human==='h'?{x:8-x,y:9-y}:{x,y};
    const piece=$("board").querySelector(`[data-square="${m.to}"] .piece`);
    motion=JanggiMotion.play(piece,$("board"),{fromX:m.from%9,fromY:Math.floor(m.from/9),toX:m.to%9,toY:Math.floor(m.to/9),type,captured:m.capture?pieceInfo(m.capture):null},display);
    if(!motion){moving=false;render();resume();return;}
    const current=motion;
    current.finished.then(()=>{if(token!==id||state!==position||motion!==current)return;motion=null;moving=false;render();resume();});
  }
  function fail(text){stop();$("retry").classList.remove("hidden");reason("계산을 마치지 못했어요","다시 계산할 수 있어요",text);render();}
  function calculate(kind){
    if(!started||moving||R.status(state).ended||$("setup").open||$("janggiConfirm").open||(kind==="hint")!==(state.turn===human))return;
    stop();job=kind;busy=true;selected=null;hint=null;$("retry").classList.add("hidden");render();const id=token;
    if(kind==="hint")reason("힌트 계산 중","둘 곳을 살펴보고 있어요","왕과 다른 말이 공격받는지 확인하고 있어요.");
    try{
      worker=new Worker("janggi-worker.js?v=11");
      worker.onmessage=({data})=>{
        if(id!==token||data.token!==id)return;
        if(data.error||!data.result)return fail("다시 계산하기를 누르세요. 현재 판은 그대로 남아 있어요.");
        const answer=data.result,move=R.actions(state).find(m=>R.same(m,answer.move));
        if(!move)return fail("수 계산을 다시 시도해 주세요.");
        worker.terminate();worker=null;clearTimeout(timeout);busy=false;
        if(kind==="hint"){hint={...answer,move};reason("힌트",AI.label(move),answer.reason);render();BoardCoachUI.revealExplanation();}else commit(move,false,answer.opponent);
      };
      worker.onerror=()=>{if(id===token)fail("다시 계산하거나 수를 물려 보세요.");};
      timeout=setTimeout(()=>{if(id===token)fail("계산이 오래 걸리고 있어요. 다시 시도해 주세요.");},20000);
      worker.postMessage({token:id,state,level,kind});
    }catch{fail("이 브라우저에서 계산을 시작하지 못했어요.");}
  }
  function resume(){
    if(started&&!moving&&!R.status(state).ended&&state.turn!==human&&!$("setup").open&&!$("janggiConfirm").open){
      const id=token;clearTimeout(nextTurn);nextTurn=setTimeout(()=>{if(id===token)calculate("move");},350);
    }
  }
  function undo(){
    const at=history.findLastIndex(m=>m.side===human);if(at<0)return;
    stop();state=history[at].before;history=history.slice(0,at);selected=null;hint=null;scene=null;feedback=null;
    $("retry").classList.add("hidden");reason("다시 생각할 차례","내 수를 물렸어요","내 마지막 수를 두기 전으로 돌아왔어요.");render();
  }
  $("board").addEventListener("click",event=>{
    const button=event.target.closest("[data-square]");if(!button||busy||moving||scene||!started||state.turn!==human||R.status(state).ended)return;
    const index=Number(button.dataset.square),moves=R.actions(state),move=moves.find(m=>!m.kind&&m.from===selected&&m.to===index);
    if(move)commit(move,true);else{selected=selected===index?null:moves.some(m=>m.from===index)?index:null;render();}
  });
  $("hint").addEventListener("click",()=>calculate("hint"));$("undo").addEventListener("click",undo);$("rethink").addEventListener("click",undo);
  $("retry").addEventListener("click",()=>calculate(job));
  $("zoom").addEventListener("click",()=>{const on=$("boardViewport").classList.toggle("zoomed");$("zoom").setAttribute("aria-pressed",String(on));$("zoom").textContent=on?"전체 판 보기":"판 확대";});
  $("newGame").addEventListener("click",()=>{stop();$("setup").showModal();render();});
  $("closeSetup").addEventListener("click",()=>$("setup").close());$("setup").addEventListener("close",resume);
  $("setupForm").addEventListener("submit",event=>{
    event.preventDefault();stop();const data=new FormData(event.currentTarget);
    level=Object.hasOwn(AI.LEVELS,data.get("level"))?data.get("level"):"beginner";human=data.get("color")==="2"?"h":"c";
    state=R.initial(data.get(human==="c"?"formation":"aiFormation"),data.get(human==="h"?"formation":"aiFormation"));
    history=[];selected=null;hint=null;scene=null;feedback=null;started=true;
    $("retry").classList.add("hidden");$("setup").close();reason("첫 차례",human==="c"?"내가 먼저 둡니다":"AI가 먼저 둡니다",$("principle").textContent);render();
  });
  function confirm(kind){
    stop();confirmKind=kind;$("janggiConfirmTitle").textContent=kind==="resign"?"기권할까요?":"빅장을 받아들일까요?";
    $("janggiConfirmText").textContent=kind==="resign"?"이 대국은 AI의 승리로 끝납니다.":"이 대국은 무승부로 끝납니다.";
    $("janggiConfirmYes").textContent=kind==="resign"?"기권":"빅장 수락";$("janggiConfirm").showModal();render();
  }
  $("janggiPass").addEventListener("click",()=>{const move=R.actions(state).find(m=>m.kind);if(move?.kind==="bikjang")confirm("bikjang");else if(move)commit(move,true);});
  $("janggiResign").addEventListener("click",()=>confirm("resign"));
  $("janggiConfirmYes").addEventListener("click",()=>{
    if(confirmKind==="resign"){stop();state={...state,result:{ended:true,winner:R.other(human),reason:"resign"}};reason("대국 종료","기권했어요","중요한 장면을 다시 살펴볼 수 있어요.");render();}
    else commit({kind:"bikjang"},true);
    $("janggiConfirm").close();
  });
  $("janggiConfirmCancel").addEventListener("click",()=>$("janggiConfirm").close());$("janggiConfirm").addEventListener("close",resume);
  $("reviewList").addEventListener("click",event=>{const button=event.target.closest("[data-review]");if(button){stop();scene=history[Number(button.dataset.review)];reason("중요한 장면",AI.label(scene.move)+" 두기 전",scene.feedback?.text||scene.reason);render();BoardCoachUI.revealExplanation();}});
  $("liveBoard").addEventListener("click",()=>{scene=null;reason("대국 돌아보기","마지막 판","중요한 장면을 눌러 다시 살펴보세요.");render();});
  window.addEventListener("pagehide",stop);window.addEventListener("pageshow",event=>{if(event.persisted){render();resume();}});
  render();$("setup").showModal();
})();
