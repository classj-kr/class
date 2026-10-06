/* global BoardCoachRules, BoardCoachAI, BoardCoachUI, ClassGameMotion */
(() => {
  "use strict";
  if (["chess", "janggi"].includes(new URLSearchParams(location.search).get("game"))) return;
  const R = BoardCoachRules, AI = BoardCoachAI, $ = id => document.getElementById(id);
  const game = new URLSearchParams(location.search).get("game") === "omok" ? "omok" : "reversi";
  const name = game === "omok" ? "오목" : "리버시";
  let state = R.initial(game), level = "beginner", human = 1, started = false, busy = false;
  let worker = null, timeout = null, nextTurnTimer = null, token = 0, hint = null, reviewPosition = null, retryKind = "move";
  let moves = [], feedback = null;
  let moving=false;
  const escape = text => String(text).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const coordinate = i => R.coord(i, state.size);
  const variant = game === "omok" ? "검은 돌부터 빈자리에 하나씩 번갈아 둡니다. 가로·세로·대각선으로 내 돌을 5개 이상 이으면 이깁니다. 이 사이트에서는 렌주의 금수·개국 규칙을 적용하지 않습니다." : "검은 돌부터 둡니다. 새로 놓을 돌과 내 돌 사이에 상대 돌이 가로·세로·대각선으로 이어진 곳에 놓아, 사이의 상대 돌을 모두 뒤집습니다. 둘 곳이 없으면 자동으로 차례를 넘깁니다. 양쪽 모두 둘 곳이 없을 때 돌이 더 많은 쪽이 이깁니다.";
  const principle = game === "omok" ? "중앙에서 연결하기 → 바로 이길 곳 찾기 → 상대의 세 돌·네 돌 막기" : "모서리 지키기 → 상대가 둘 곳 줄이기 → 마지막 돌 수 계산하기";
  document.title = `${name} · AI와 배우기`;
  $("title").textContent = name;
  $("backLink").href = `../${game}/${game}`;
  BoardCoachUI.useOriginalTheme(game);
  BoardCoachUI.mountOpponent();
  if(game==='reversi')document.querySelector('.controls').insertAdjacentHTML('afterend','<section class="panel" aria-label="최근 뒤집기"><p id="lastFlip" class="move-result" aria-live="polite">돌을 놓으면 뒤집힌 개수와 위치를 알려드려요.</p></section>');
  $("principle").textContent = principle;
  $("rulesCopy").innerHTML = `<p>${escape(variant)}</p><p>레벨 1은 처음 배우는 연습 상대입니다. 레벨이 올라갈수록 이어지는 수를 더 깊게 살펴봅니다. 학습 대국은 시간 제한과 순위 기록이 없습니다.</p><p>놓고 싶은 칸을 누르세요. 칸이 작으면 ‘판 확대’를 이용하세요. 금색 점선은 힌트, 돌의 빨간 테두리는 마지막 수입니다.</p><p>기본 원칙 참고: <a href="${game === "omok" ? "https://gomoku.renju.net/rules/" : "https://www.worldothello.org/download_file/view/58058c57-3cc5-409e-8cac-8d1cdb18360b/590"}" target="_blank" rel="noopener">${game === "omok" ? "Renju International Federation의 위협 설명" : "World Othello Federation의 입문 자료"}</a></p>`;
  function stopWork() {
    if (busy && retryKind === "hint") setReason("힌트 계산 취소", "계산을 멈췄어요", "힌트를 누르면 다시 계산합니다.");
    token++; worker?.terminate(); worker = null; clearTimeout(timeout); clearTimeout(nextTurnTimer); busy = false;
    moving=false;ClassGameMotion.cancel();
  }
  function drawBoard(position, mark = null) {
    const board = $("board"); board.className = `${game} board`; board.style.setProperty("--size", position.size);
    board.setAttribute("aria-label", `${position.size}줄 ${name}판`);
    const legal = new Set(R.legal(position)), canPlay = started && !busy && !moving && !state.ended && state.color === human && !reviewPosition;
    const line = new Set(position.line);
    board.innerHTML = position.board.map((v, index) => {
      const row = Math.floor(index / position.size), col = index % position.size;
      const star = game === "omok" && [48, 56, 112, 168, 176].includes(index);
      return `<button type="button" role="gridcell" class="square ${game === "omok" ? "point" : "cell"}${legal.has(index) ? " legal" : ""}${position.last === index ? " last" : ""}${mark === index ? " suggested" : ""}${line.has(index) ? " winning" : ""}" data-index="${index}" data-row="${row}" data-col="${col}" ${canPlay && legal.has(index) ? "" : "disabled"} title="${R.coord(index, position.size)}" aria-label="${R.coord(index, position.size)} · ${v ? (v === 1 ? "흑돌" : "백돌") : legal.has(index) ? "둘 수 있는 곳" : "둘 수 없는 곳"}">${v ? `<span class="stone ${game === "reversi" ? "disc " : ""}${v === 1 ? "black" : "white"}"></span>` : star ? '<span class="starDot"></span>' : game === "reversi" && legal.has(index) ? '<span class="hint"></span>' : ""}${mark === index && game === "omok" ? '<span class="hint-ring" aria-hidden="true"></span>' : ""}</button>`;
    }).join("");
    if(game==='reversi')for(const i of position.flipped||[]) {
      const cell=board.querySelector(`[data-index="${i}"]`);cell.classList.add('flipped');
      cell.setAttribute('aria-label',cell.getAttribute('aria-label')+' · 방금 뒤집힌 돌');
    }
  }
  function setReason(label, title, text) { $("reasonLabel").textContent = label; $("moveLabel").textContent = title; $("reason").textContent = text; }
  function render() {
    const current = reviewPosition?.before || state;
    drawBoard(current, reviewPosition ? reviewPosition.feedback?.alternative ?? reviewPosition.index : hint?.index);
    const opponent=started&&!reviewPosition&&!state.ended?moves.at(-1)?.opponent:null;
    BoardCoachUI.showOpponent(opponent,$('board'),state.size);
    if(game==='reversi')$('lastFlip').textContent=current.flipped?.length?`${current.board[current.last]===human?'내가':'AI가'} ${R.coord(current.last,8)}에 두어 ${current.flipped.length}개를 뒤집었어요.\n금색 테두리: 방금 뒤집힌 돌`:'돌을 놓으면 뒤집힌 개수와 위치를 알려드려요.';
    $("levelLabel").textContent = AI.LEVELS[level].name;
    $("colorLabel").textContent = `내 돌: ${human === 1 ? "검은색" : "흰색"}`;
    const passed = state.passed ? `${state.passed === human ? "내가" : "AI가"} 둘 곳이 없어 차례를 넘겼어요. ` : "";
    $("turn").textContent = reviewPosition ? `${moves.indexOf(reviewPosition) + 1}수 두기 전 · 복기` : !started ? "AI 레벨을 골라 시작하세요." : state.ended ? (state.winner ? state.winner === human ? "내가 이겼어요!" : "AI가 이겼어요." : "무승부예요.") : busy && retryKind === "move" ? "AI가 생각하고 있어요…" : passed + (state.color === human ? "내 차례" : "AI 차례");
    $("score").textContent = game === "reversi" ? `흑 ${current.board.filter(v => v === 1).length} : 백 ${current.board.filter(v => v === 2).length}` : `${reviewPosition ? moves.indexOf(reviewPosition) : state.count}수`;
    $("undo").disabled = !moves.some(m => m.color === human) || !!reviewPosition;
    $("hint").disabled = !started || busy || moving || state.ended || state.color !== human || !!reviewPosition;
    $('zoom').disabled=moving;
    $("feedbackPanel").classList.toggle("hidden", !feedback || !!reviewPosition);
    $("feedback").textContent = feedback?.text || "";
    $("reviewPanel").classList.toggle("hidden", !state.ended || moving);
    $("liveBoard").classList.toggle("hidden", !reviewPosition);
    if (state.ended) {
      const important = moves.filter(m => m.feedback).slice(-3);
      const chosen = important.length ? important : moves.filter(m => m.color !== human).slice(-3);
      $("reviewList").innerHTML = chosen.map(m => `<button type="button" data-review="${moves.indexOf(m)}"><strong>${moves.indexOf(m) + 1}수 · ${coordinate(m.index)}</strong>${escape(m.feedback?.text || m.reason)}</button>`).join("");
    }
  }
  function failJob(message) {
    stopWork(); $("retry").classList.remove("hidden"); render();
    setReason("다시 시도할 수 있어요", "계산을 마치지 못했어요", message);
  }
  function startJob(kind) {
    if (!started || moving || state.ended || $("setup").open) return;
    if ((kind === "hint") !== (state.color === human)) return;
    stopWork(); hint = null; retryKind = kind; busy = true; $("retry").classList.add("hidden");
    const id = token;
    render();
    if (kind === "hint") setReason("힌트를 생각하고 있어요", "잠깐만 기다려 주세요", "공격할 곳과 상대의 위협을 함께 살펴보고 있어요.");
    try {
      worker = new Worker("ai-worker.js?v=7");
      worker.onmessage = event => {
        if (event.data.token !== token || id !== token) return;
        const { result, error } = event.data;
        if (error || !result || !R.legal(state).includes(result.index)) { failJob("다시 계산하기를 누르세요. 현재 판은 그대로 남아 있어요."); return; }
        worker?.terminate(); worker = null; clearTimeout(timeout); busy = false;
        if (kind === "hint") { hint = result; setReason("힌트 · 한 가지 후보", coordinate(result.index), result.reason); render(); BoardCoachUI.revealExplanation(); }
        else {
          const before = state;
          state = R.play(state, result.index);
          moves.push({ before, color: before.color, index: result.index, reason: result.reason,opponent:result.opponent||AI.opponentView(before,result.index) });
          setReason("AI의 수", `${coordinate(result.index)}에 두었어요`, result.reason);
          animateMove(before,result.index);
        }
      };
      worker.onerror = () => { if (id === token) failJob("계산을 다시 시도해 주세요. 수 물리기와 새 대국도 사용할 수 있어요."); };
      timeout = setTimeout(() => { if (id === token) failJob("계산이 오래 걸리고 있어요. 다시 시도하거나 다른 레벨을 골라보세요."); }, 10000);
      worker.postMessage({ token: id, state, level, kind });
    } catch { failJob("이 브라우저에서 계산을 시작하지 못했어요. 페이지를 다시 열어 주세요."); }
  }
  function continueComputer() {
    if (started && !moving && !state.ended && state.color !== human && !$("setup").open) {
      const id = token;
      clearTimeout(nextTurnTimer);
      nextTurnTimer = setTimeout(() => { if (id === token) startJob("move"); }, 350);
    }
  }
  function place(index) {
    if (!started || busy || moving || state.ended || state.color !== human || reviewPosition || !R.legal(state).includes(index)) return;
    $("retry").classList.add("hidden");
    const followed=hint?.index===index;
    const before = state, reason = followed?hint.reason:AI.explain(state, index);
    hint = null; feedback = followed?null:AI.review(state, index);
    state = R.play(state, index);
    moves.push({ before, index, color: human, feedback, reason });
    setReason("내가 둔 수", `${coordinate(index)}에 두었어요`, feedback?.text || reason);
    animateMove(before,index);
  }
  function animateMove(before,index) {
    moving=true;render();
    const animations=[ClassGameMotion.appear($('board').querySelector(`[data-index="${index}"] .stone`))];
    for(const i of state.flipped||[])animations.push(ClassGameMotion.flip($('board').querySelector(`[data-index="${i}"] .stone`),'stone disc '+(before.board[i]===1?'black':'white')));
    const id=token,position=state;
    Promise.all(animations.filter(Boolean).map(a=>a.finished.catch(()=>{}))).then(()=>{
      if(id!==token||position!==state)return;
      moving=false;render();continueComputer();
    });
  }
  function undo() {
    const last = moves.findLastIndex(m => m.color === human);
    if (last < 0) return;
    stopWork(); state = moves[last].before; moves = moves.slice(0, last); feedback = null; hint = null; reviewPosition = null;
    $("retry").classList.add("hidden");
    setReason("다시 생각할 차례", "내 수를 물렸어요", "내 마지막 수를 두기 전으로 돌아왔어요. 힌트를 보거나 다른 수를 생각해 보세요."); render();
  }
  $("board").addEventListener("click", event => { const button = event.target.closest("[data-index]"); if (button) place(Number(button.dataset.index)); });
  $("hint").addEventListener("click", () => startJob("hint"));
  $("undo").addEventListener("click", undo); $("rethink").addEventListener("click", undo);
  $("retry").addEventListener("click", () => startJob(retryKind));
  $("zoom").addEventListener("click", () => { const on = $("boardViewport").classList.toggle("zoomed"); $("zoom").setAttribute("aria-pressed", String(on)); $("zoom").textContent = on ? "전체 판 보기" : "판 확대"; });
  $("newGame").addEventListener("click", () => {
    stopWork(); $("setup").showModal(); render();
  });
  $("closeSetup").addEventListener("click", () => $("setup").close());
  $("setup").addEventListener("close", continueComputer);
  $("setupForm").addEventListener("submit", event => {
    event.preventDefault(); stopWork();
    const form = new FormData(event.currentTarget);
    level = Object.hasOwn(AI.LEVELS, form.get("level")) ? form.get("level") : "beginner";
    human = form.get("color") === "2" ? 2 : 1;
    state = R.initial(game); moves = []; feedback = null; hint = null; reviewPosition = null; started = true;
    $("retry").classList.add("hidden"); $("setup").close();
    setReason("첫 차례", human === 1 ? "내가 먼저 둡니다" : "AI가 먼저 둡니다", principle);
    render();
  });
  $("reviewList").addEventListener("click", event => {
    const button = event.target.closest("[data-review]"); if (!button) return;
    reviewPosition = moves[Number(button.dataset.review)]; hint = null;
    setReason("중요한 장면", `${coordinate(reviewPosition.index)}에 두기 전`, reviewPosition.feedback?.text || reviewPosition.reason); render(); BoardCoachUI.revealExplanation();
  });
  $("liveBoard").addEventListener("click", () => { reviewPosition = null; setReason("대국을 돌아보세요", "마지막 판", "중요한 장면을 다시 보거나 새 대국에 도전해 보세요."); render(); });
  window.addEventListener("pagehide", stopWork);
  window.addEventListener("pageshow", event => { if (event.persisted) { render(); continueComputer(); } });
  render(); BoardCoachUI.ready(AI.LEVELS, game); $("setup").showModal();
})();
