/* global ClassChessRules, ClassChessMotion, ClassChessPieces, ChessCoachAI, ChessCoachPiece, BoardCoachUI */
(() => {
  "use strict";
  if(new URLSearchParams(location.search).get("game")!=="chess") return;
  const C=ClassChessRules, AI=ChessCoachAI, $=id=>document.getElementById(id);
  let state=C.createInitialState("standard"), human="w", level="beginner", started=false;
  let worker=null, token=0, timeout=null, nextTurn=null, busy=false, job="move";
  let selected=null, hint=null, pending=null, scene=null, feedback=null, history=[], claims=[];
  let claimState=null;
  let motion=null,moving=false;
  const escape=text=>String(text).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const endLabels={checkmate:"체크메이트",stalemate:"스테일메이트", "insufficient-material":"메이트할 기물 부족",threefold:"같은 판 3회",fivefold:"같은 판 5회","fifty-move":"50수 규칙","seventy-five-move":"75수 규칙",resign:"기권"};
  document.title="체스 · AI와 배우기"; $("title").textContent="체스"; $("backLink").href="../chess/chess";
  $("principle").textContent="중앙 칸을 차지하고, 나이트와 비숍을 꺼내며, 왕을 안전하게 지키세요.";
  document.querySelector(".color-options legend").textContent="내 말 색깔";
  document.querySelector(".color-options input[value='1'] + span strong").textContent="흰색";
  document.querySelector(".color-options input[value='2'] + span strong").textContent="검은색";
  $("rulesCopy").innerHTML='<p>흰색이 먼저 둡니다. 말을 선택한 다음 표시된 도착 칸을 누르세요. 내 왕(킹)이 공격받게 만드는 이동은 할 수 없습니다.</p><p>왕이 공격받는 상태를 ‘체크’라고 합니다. 왕을 옮기거나, 공격을 막거나, 공격하는 말을 잡아 왕을 지켜야 합니다. 어느 방법으로도 지킬 수 없으면 ‘체크메이트’로 패배합니다. 왕이 공격받지 않는데 둘 수 있는 수가 없으면 ‘스테일메이트’로 비깁니다.</p><p>킹과 룩이 움직이지 않았고 사이가 비어 있을 때 캐슬링할 수 있습니다. 킹의 시작·경유·도착 칸이 공격받으면 불가능합니다. 앙파상은 상대 폰의 두 칸 이동 직후 한 차례만 가능합니다. 폰은 마지막 줄에서 퀸·룩·비숍·나이트 중 하나로 승격합니다.</p><p>같은 판 3회 또는 잡기·폰 이동 없이 양쪽이 50수씩 두면 무승부를 선언할 수 있습니다. 다음 수로 조건을 채우는 선언도 가능합니다. 5회 반복과 75수 규칙은 자동 적용합니다. 킹만 남는 등 기본적인 메이트 불가능 기물도 자동 판정합니다.</p><p>힌트는 출발·도착 칸을 표시합니다. 내 수 물리기는 그 뒤의 AI 수까지 취소합니다. 시간 제한은 없습니다.</p><p>참고: <a href="https://rcc.fide.com/wp-content/uploads/2022/11/Laws_of_Chess-2023.pdf" target="_blank" rel="noopener">FIDE 체스 규칙</a> · <a href="https://www.chesskid.com/learn/terms/chess-opening" target="_blank" rel="noopener">초반 기본 원칙</a></p>';
  $("rulesCopy").firstElementChild.insertAdjacentHTML("afterend",'<ul class="piece-rules"><li><b>킹</b>: 어느 방향으로든 한 칸 갑니다. 상대가 공격하는 칸으로는 갈 수 없습니다.</li><li><b>퀸</b>: 가로·세로·대각선으로 원하는 만큼 갑니다.</li><li><b>룩</b>: 가로·세로로 원하는 만큼 갑니다.</li><li><b>비숍</b>: 대각선으로 원하는 만큼 갑니다.</li><li><b>나이트</b>: 한 방향으로 두 칸, 직각으로 한 칸 떨어진 자리로 갑니다. 다른 말을 뛰어넘을 수 있습니다.</li><li><b>폰</b>: 앞으로 한 칸 갑니다. 처음 자리에서는 앞이 비어 있으면 두 칸 갈 수 있습니다. 상대 말은 앞쪽 대각선 한 칸에서 잡습니다. 뒤로는 가지 못합니다.</li></ul><p>자기 말이 있는 칸에는 갈 수 없습니다. 나이트 외의 말은 다른 말을 뛰어넘지 못합니다. 상대 말이 있는 칸으로 이동하면 그 말을 잡습니다.</p>');
  document.querySelector(".controls").insertAdjacentHTML("beforeend",'<button id="claimDraw" type="button" class="quiet" disabled>무승부 선언</button><button id="resign" type="button" class="quiet" disabled>기권</button>');
  BoardCoachUI.useOriginalTheme("chess");
  BoardCoachUI.mountOpponent();
  document.querySelector('.controls').insertAdjacentHTML('afterend','<section class="panel capture-summary" aria-label="잡은 말"><p id="latestCapture" class="move-result" aria-live="polite"></p><div class="capture-trays"><div><h3>내가 잡은 말 <span id="myCaptureCount">0</span></h3><div id="myCaptures" class="capture-tokens"></div></div><div><h3>AI가 잡은 말 <span id="aiCaptureCount">0</span></h3><div id="aiCaptures" class="capture-tokens"></div></div></div></section>');
  document.querySelector(".sidebar").insertAdjacentHTML("beforeend",'<details class="panel chess-record"><summary>기보</summary><div id="chessMoves">아직 둔 수가 없습니다.</div></details>');
  document.body.insertAdjacentHTML("beforeend",'<dialog id="chessPromotion" aria-labelledby="promotionTitle"><h2 id="promotionTitle">승격할 말</h2><div id="chessPromotionChoices"></div><button id="cancelPromotion" class="quiet" type="button">취소</button></dialog><dialog id="chessDraw" aria-labelledby="drawTitle"><h2 id="drawTitle">무승부 선언</h2><p class="muted">표시된 조건으로 대국을 마칩니다.</p><div id="chessDrawChoices"></div><button id="cancelDraw" class="quiet" type="button">취소</button></dialog><dialog id="chessResign" aria-labelledby="resignTitle"><h2 id="resignTitle">이 대국을 기권할까요?</h2><div class="resign-choices"><button id="confirmResign" type="button">기권</button><button id="cancelResign" class="quiet" type="button">계속 두기</button></div></dialog>');
  function reason(label,title,text) { $("reasonLabel").textContent=label; $("moveLabel").textContent=title; $("reason").textContent=text; }
  function stop() { if(busy&&job==="hint")reason("힌트 계산 취소","계산을 멈췄어요","힌트를 누르면 다시 계산합니다.");token++; worker?.terminate(); worker=null; clearTimeout(timeout); clearTimeout(nextTurn); busy=false;moving=false;motion?.cancel();motion=null; }
  function renderCaptures(position) {
    for(const [side,id,count] of [[human,'myCaptures','myCaptureCount'],[human==='w'?'b':'w','aiCaptures','aiCaptureCount']]) {
      const pieces=position.captures.filter(p=>p[0]!==side),groups=new Map();
      pieces.forEach(p=>groups.set(p,(groups.get(p)||0)+1));
      $(count).textContent=pieces.length;
      $(id).innerHTML=groups.size?[...groups].map(([p,n])=>`<span class="capture-token" aria-label="${AI.NAMES[p[1]]} ${n}개">${ClassChessPieces.svg(p,'',true)}<span>${AI.NAMES[p[1]]}${n>1?' ×'+n:''}</span></span>`).join(''):'<span class="capture-empty">없음</span>';
    }
    const visible=history.slice(0,scene?history.indexOf(scene):moving?history.length-1:history.length),latest=visible.findLast(m=>m.move.capture);
    $('latestCapture').textContent=latest?`최근 잡기 · ${history.indexOf(latest)+1}수\n${latest.color===human?'내':'AI의'} ${AI.NAMES[latest.move.piece[1]]} → ${latest.color===human?'상대':'내'} ${AI.NAMES[latest.move.capture[1]]} 잡음`:'아직 잡힌 말이 없어요.';
  }
  function render() {
    const position=scene?.before||state, result=C.status(state), legal=C.allLegalMoves(position);
    renderCaptures(moving?history.at(-1).before:position);
    const opponent=started&&!scene&&!result.ended&&state.turn===human?history.at(-1)?.opponent:null;
    const active=started&&!busy&&!moving&&!scene&&!result.ended&&state.turn===human;
    const sources=new Set(legal.map(m=>m.from)), targets=new Set(legal.filter(m=>m.from===selected).map(m=>m.to));
    const mark=scene?scene.feedback?.alternative||scene.move:hint?.move;
    const last=position.lastMove, check=C.isInCheck(position)?position.board.indexOf(position.turn+"K"):-1;
    $("board").className="chess chessboard"; $("board").setAttribute("aria-label","체스판");
    $("board").innerHTML=Array.from({length:64},(_,view)=>{
      const row=Math.floor(view/8), col=view%8, rank=human==="w"?7-row:row, file=human==="w"?col:7-col, index=rank*8+file;
      const piece=position.board[index], target=targets.has(index), can=active&&(sources.has(index)||target);
      const classes=["square",(rank+file)%2?"light":"dark",index===selected?"selected":"",index===check?"checked check":"",last&&(index===last.from||index===last.to)?"recent last":"",mark&&(index===mark.from||index===mark.to)?"suggested":"",target?(piece?"target legal-capture":"target legal-empty"):""].filter(Boolean).join(" ");
      return `<button type="button" role="gridcell" data-square="${index}" class="${classes}" ${can?"":"disabled"} aria-pressed="${index===selected}" aria-label="${C.squareName(index)} · ${piece?(piece[0]==="w"?"백 ":"흑 ")+AI.NAMES[piece[1]]:"빈칸"}${target?" · 이동 가능":""}">${row===7?`<span class="coord file" aria-hidden="true">${C.FILES[file]}</span>`:""}${col===0?`<span class="coord rank" aria-hidden="true">${rank+1}</span>`:""}${ChessCoachPiece(piece)}</button>`;
    }).join("");
    BoardCoachUI.markMove($("board"),mark,8);
    BoardCoachUI.showOpponent(opponent,$('board'),8);
    $("levelLabel").textContent=`${AI.LEVELS[level].name} AI`;
    $("colorLabel").textContent=`내 말: ${human==="w"?"흰색":"검은색"}`;
    $("score").textContent=`${scene?history.indexOf(scene):state.san.length}수`;
    $("turn").textContent=scene?`${history.indexOf(scene)+1}수 두기 전 · 복기`:!started?"AI 수준을 골라 시작하세요.":result.ended?`${endLabels[result.reason]||"대국 종료"} · ${result.winner?(result.winner===human?"내가 이겼어요":"AI가 이겼어요"):"무승부"}`:busy&&job==="move"?"AI가 생각하고 있어요…":`${state.turn===human?"내 차례":"AI 차례"}${result.checked?" · 체크":""}`;
    $("undo").disabled=!history.some(m=>m.color===human)||!!scene;
    $("hint").disabled=!active; $("resign").disabled=!started||result.ended||!!scene;
    $('zoom').disabled=moving;
    if(claimState!==state) { claims=state.turn===human&&!result.ended?C.drawClaims(state):[]; claimState=state; }
    $("claimDraw").disabled=!active||!claims.length;
    $("feedbackPanel").classList.toggle("hidden",!feedback||!!scene); $("feedback").textContent=feedback?.text||"";
    $("reviewPanel").classList.toggle("hidden",!result.ended||moving); $("liveBoard").classList.toggle("hidden",!scene);
    if(result.ended) {
      let chosen=history.filter(m=>m.feedback).slice(-3);
      if(!chosen.length) chosen=history.filter(m=>m.color!==human).slice(-3);
      $("reviewList").innerHTML=chosen.length?chosen.map(m=>`<button type="button" data-review="${history.indexOf(m)}"><strong>${history.indexOf(m)+1}수 · ${escape(AI.label(m.move))}</strong>${escape(m.feedback?.text||m.reason)}</button>`).join(""):'<p>복기할 수가 없습니다.</p>';
    }
    $("chessMoves").textContent=state.san.length?state.san.map((san,i)=>`${i%2===0?`${Math.floor(i/2)+1}. `:""}${san}`).join(" "):"아직 둔 수가 없습니다.";
  }
  function commit(move,isHuman=false,opponent=null) {
    const outcome=C.applyMove(state,move.from,move.to,move.promotion);
    if(!outcome.ok) { reason("이동 확인","둘 수 없는 수",outcome.error); return; }
    const followed=isHuman&&hint?.move&&AI.same(move,hint.move);
    const before=state, explanation=followed?hint.reason:AI.explain(before,move);
    // The quick material heuristic must not contradict a deeper hint analysis.
    feedback=isHuman?(followed?null:AI.review(before,move)):feedback;
    history.push({before,move:outcome.move,color:before.turn,reason:explanation,feedback:isHuman?feedback:null,opponent:isHuman?null:opponent||AI.opponentView(before,outcome.move)});
    state=outcome.state; selected=null; hint=null; pending=null;
    $("retry").classList.add("hidden"); reason(isHuman?"내가 둔 수":"AI의 수",AI.label(outcome.move),isHuman&&feedback?feedback.text:explanation);
    moving=true;render();
    motion=ClassChessMotion.play($('board'),before.board,outcome.move,ClassChessPieces.svg);
    if(!motion){moving=false;render();resume();return;}
    const current=motion,id=token,position=state;
    current.finished.then(()=>{if(token!==id||state!==position||motion!==current)return;motion=null;moving=false;render();resume();});
  }
  function fail(message) { stop(); $("retry").classList.remove("hidden"); reason("계산을 마치지 못했어요","다시 계산할 수 있어요",message); render(); }
  function calculate(kind) {
    if(!started||moving||C.status(state).ended||$("setup").open||(kind==="hint")!==(state.turn===human)) return;
    stop(); job=kind; busy=true; selected=null; hint=null; $("retry").classList.add("hidden"); render();
    const id=token;
    if(kind==="hint") reason("힌트 계산 중","후보를 살펴보고 있어요","체크와 기물의 안전을 확인하고 있어요.");
    try {
      worker=new Worker("chess-worker.js?v=8");
      worker.onmessage=({data})=>{
        if(id!==token||data.token!==token)return;
        if(data.error||!data.result)return fail("다시 계산하기를 누르세요. 현재 판은 그대로 남아 있어요.");
        const answer=data.result;
        if(answer.claim&&kind==="hint") {
          if(!C.drawClaims(state).some(c=>!c.move))return fail("무승부 조건을 다시 확인해 주세요.");
          worker.terminate();worker=null;clearTimeout(timeout);busy=false;hint=answer;
          reason("힌트","무승부 선언",answer.reason);render();BoardCoachUI.revealExplanation();return;
        }
        if(answer.claim&&kind==="move") {
          const outcome=C.claimDraw(state); if(!outcome.ok)return fail(outcome.error);
          stop(); state=outcome.state; reason("AI의 선택","무승부 선언",answer.reason); render(); return;
        }
        const move=C.allLegalMoves(state).find(m=>AI.same(m,answer.move));
        if(!move)return fail("수 계산을 다시 시도해 주세요.");
        worker.terminate();worker=null;clearTimeout(timeout);busy=false;
        if(kind==="hint") { hint={...answer,move}; reason("힌트 · 한 가지 후보",AI.label(move),answer.reason);render();BoardCoachUI.revealExplanation(); }
        else commit(move,false,answer.opponent);
      };
      worker.onerror=()=>{if(id===token)fail("다시 계산하거나 수를 물려 보세요.");};
      timeout=setTimeout(()=>{if(id===token)fail("계산이 오래 걸리고 있어요. 다시 시도해 주세요.");},12000);
      worker.postMessage({token:id,state,level,kind,allowClaim:kind==="move"});
    } catch {fail("이 브라우저에서 계산을 시작하지 못했어요.");}
  }
  function resume() {
    if(started&&!moving&&!C.status(state).ended&&state.turn!==human&&!$("setup").open&&!$("chessResign").open) {
      const id=token;clearTimeout(nextTurn);nextTurn=setTimeout(()=>{if(id===token)calculate("move");},350);
    }
  }
  function chooseSquare(index) {
    if(!started||busy||moving||scene||C.status(state).ended||state.turn!==human)return;
    const legal=C.allLegalMoves(state), options=legal.filter(m=>m.from===selected&&m.to===index);
    if(options.length) {
      if(options.some(m=>m.promotion)) {
        pending=options;
        $("chessPromotionChoices").innerHTML=options.map(m=>`<button type="button" data-promote="${m.promotion}">${ChessCoachPiece(human+m.promotion)}<span>${AI.NAMES[m.promotion]}</span></button>`).join("");
        $("chessPromotion").showModal();
      } else commit(options[0],true);
      return;
    }
    selected=selected===index?null:legal.some(m=>m.from===index)?index:null; render();
  }
  function undo() {
    const at=history.findLastIndex(m=>m.color===human);if(at<0)return;
    stop();state=history[at].before;history=history.slice(0,at);selected=null;hint=null;scene=null;feedback=null;
    $("retry").classList.add("hidden");reason("다시 생각할 차례","내 수를 물렸어요","내 마지막 수를 두기 전으로 돌아왔어요.");render();
  }
  $("board").addEventListener("click",event=>{const b=event.target.closest("[data-square]");if(b)chooseSquare(Number(b.dataset.square));});
  $("hint").addEventListener("click",()=>calculate("hint")); $("undo").addEventListener("click",undo); $("rethink").addEventListener("click",undo);
  $("retry").addEventListener("click",()=>calculate(job));
  $("zoom").addEventListener("click",()=>{const on=$("boardViewport").classList.toggle("zoomed");$("zoom").setAttribute("aria-pressed",String(on));$("zoom").textContent=on?"전체 판 보기":"판 확대";});
  $("newGame").addEventListener("click",()=>{stop();reason("대국 설정","현재 판은 남아 있어요","설정을 닫으면 이어서 둘 수 있어요.");$("setup").showModal();render();});
  $("closeSetup").addEventListener("click",()=>$("setup").close()); $("setup").addEventListener("close",resume);
  $("setupForm").addEventListener("submit",event=>{
    event.preventDefault();stop();const data=new FormData(event.currentTarget);
    level=Object.hasOwn(AI.LEVELS,data.get("level"))?data.get("level"):"beginner";human=data.get("color")==="2"?"b":"w";
    state=C.createInitialState("standard");history=[];selected=null;hint=null;pending=null;scene=null;feedback=null;started=true;
    $("retry").classList.add("hidden");$("setup").close();reason("첫 차례",human==="w"?"내가 먼저 둡니다":"AI가 먼저 둡니다",$("principle").textContent);render();
  });
  $("chessPromotionChoices").addEventListener("click",event=>{const b=event.target.closest("[data-promote]");if(!b||!pending)return;const m=pending.find(m=>m.promotion===b.dataset.promote);$("chessPromotion").close();if(m)commit(m,true);});
  $("cancelPromotion").addEventListener("click",()=>{$("chessPromotion").close();pending=null;});
  $("chessPromotion").addEventListener("cancel",()=>{pending=null;});
  $("claimDraw").addEventListener("click",()=>{
    $("chessDrawChoices").innerHTML=claims.map((c,i)=>`<button type="button" data-claim="${i}">${c.move?escape(AI.label(c.move))+" 예정 · ":"현재 판 · "}${endLabels[c.reason]}</button>`).join("");$("chessDraw").showModal();
  });
  $("chessDrawChoices").addEventListener("click",event=>{const b=event.target.closest("[data-claim]");if(!b)return;const claim=claims[Number(b.dataset.claim)];const outcome=C.claimDraw(state,claim.move);if(!outcome.ok)return;stop();state=outcome.state;$("chessDraw").close();reason("무승부",endLabels[claim.reason],"무승부 선언으로 대국을 마쳤어요.");render();});
  $("cancelDraw").addEventListener("click",()=>$("chessDraw").close());
  $("resign").addEventListener("click",()=>{stop();$("chessResign").showModal();render();});
  $("cancelResign").addEventListener("click",()=>$("chessResign").close());$("chessResign").addEventListener("close",resume);
  $("confirmResign").addEventListener("click",()=>{stop();state={...state,result:{ended:true,reason:"resign",winner:human==="w"?"b":"w",checked:false}};$("chessResign").close();reason("대국 종료","기권했어요","중요한 장면을 돌아보거나 새 대국을 시작할 수 있어요.");render();});
  $("reviewList").addEventListener("click",event=>{const b=event.target.closest("[data-review]");if(!b)return;scene=history[Number(b.dataset.review)];reason("중요한 장면",AI.label(scene.move)+" 두기 전",scene.feedback?.text||scene.reason);render();BoardCoachUI.revealExplanation();});
  $("liveBoard").addEventListener("click",()=>{scene=null;reason("대국 복기","마지막 판","중요한 장면을 눌러 다시 살펴보세요.");render();});
  window.addEventListener("pagehide",stop);window.addEventListener("pageshow",event=>{if(event.persisted){render();resume();}});
  render();$("setup").showModal();
})();
