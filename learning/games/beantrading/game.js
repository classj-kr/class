/* global BeanTrading, ClassroomMultiplayerLobby */
(() => {
  "use strict";
  const $ = id => document.getElementById(id);
  const B = BeanTrading;
  const beans = Object.fromEntries(B.BEANS.map(b => [b.id, b]));
  const art = file => `assets/images/${file}`;
  const escape = value => String(value).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  let lobby, state, selected = new Set(), want = [], actionPending = false, actionTimer, toastTimer;
  let practice = null, practiceStage = "", stageKey = "", clockOffset = 0, harvestField = 0;
  const botProposed = new Set();
  const savedName = String(localStorage.getItem("classPlayerName") || "").trim();
  const myId = () => practice ? "practice-me" : lobby?.snapshot().myId;
  const isHost = () => !!practice || lobby?.snapshot().role === "host";
  const me = () => state?.players.find(p => p.id === myId());
  const isTurn = () => state?.turnPlayerId === myId();
  const playerName = id => state?.players.find(p => p.id === id)?.name || "플레이어";
  const coin = n => `<img src="${art("coin-v1.png")}" alt="">${n}금화`;
  const kindsText = kinds => kinds.length ? kinds.map(k => beans[k].name).join(" · ") : "없음";
  function toast(text) {
    clearTimeout(toastTimer); $("toast").textContent = text; $("toast").classList.remove("hidden");
    toastTimer = setTimeout(() => $("toast").classList.add("hidden"), 3200);
  }
  function cardHtml(card, { selectable = false, first = false } = {}) {
    const bean = beans[card.kind];
    return `<button type="button" class="bean-card${selected.has(card.id) ? " selected" : ""}${first ? " first" : ""}" style="--bean-color:${bean.color}" data-card="${escape(card.id)}" ${selectable ? "" : "disabled"} aria-pressed="${selected.has(card.id)}" aria-label="${bean.name}${first ? ", 먼저 심을 카드" : ""}${selected.has(card.id) ? ", 선택됨" : ""}"><img src="${art(bean.art)}" alt="" draggable="false"><strong>${bean.name}</strong><span class="mini-prices">${bean.prices.map((n, i) => `<span>${n}장<b>${i + 1}금</b></span>`).join("")}</span></button>`;
  }
  function renderPlayers() {
    $("playerStrip").style.setProperty("--players", state.players.length);
    $("playerStrip").innerHTML = state.players.map(p => `<article class="player${p.id === state.turnPlayerId && state.phase === "playing" ? " active" : ""}"><div class="player-top"><strong>${escape(p.name)}${p.id === myId() ? " · 나" : ""}</strong><span class="coins">${coin(p.coins)}</span></div><div class="player-fields">${p.fields.map(f => `<div class="mini-field">${f.kind ? `<img src="${art(beans[f.kind].art)}" alt=""><span>${beans[f.kind].name} ${f.count}<small>수확 ${f.value}금화</small></span>` : "빈 밭"}</div>`).join("")}</div><div class="player-meta">손패 ${p.handCount}장${p.pendingCount ? ` · 심을 콩 ${p.pendingCount}장` : ""}</div></article>`).join("");
  }
  function plantingCard() {
    if (state.stage === "plant" && isTurn() && state.planted < 2) return state.hand[0];
    if (state.stage === "settle") return state.pending.find(c => selected.has(c.id)) || state.pending[0];
    return null;
  }
  function renderFields() {
    const card = plantingCard();
    $("myCoins").innerHTML = coin(me().coins);
    $("myFields").innerHTML = me().fields.map((f, index) => {
      const canPlant = !!card && (!f.kind || f.kind === card.kind);
      const bean = beans[f.kind], next = bean?.prices[f.value];
      return `<div class="field"><button class="field-plant" data-plant="${index}" ${canPlant ? "" : "disabled"} aria-label="${index + 1}번 밭${canPlant ? `에 ${beans[card.kind].name} 심기` : ""}">${bean ? `<img src="${art(bean.art)}" alt=""><strong>${bean.name} ${f.count}장</strong><small>${next ? `${next - f.count}장 더 모으면 ${f.value + 1}금화` : "최대 4금화"}</small>` : `<strong>빈 밭 ${index + 1}</strong><small>어떤 콩이든 OK</small>`}${canPlant ? `<span class="field-action">${beans[card.kind].name} 심기</span>` : ""}</button><button class="field-harvest" data-harvest="${index}" ${f.count ? "" : "disabled"}>${f.count ? `수확 · ${f.value}금화` : "수확할 콩 없음"}</button></div>`;
    }).join("");
  }
  function renderCards() {
    const trading = state.stage === "trade";
    $("handCount").textContent = `${state.hand.length}장`;
    $("handCards").innerHTML = state.hand.length ? state.hand.map((c, i) => cardHtml(c, { selectable: trading, first: i === 0 })).join("") : '<p class="empty-note">손패가 비었습니다. 차례를 마치면 3장을 받습니다.</p>';
    $("marketCards").innerHTML = state.market.length ? state.market.map(c => cardHtml(c, { selectable: trading && isTurn() })).join("") : `<p class="empty-note">${state.stage === "plant" ? "앞의 콩을 심으면 2장이 공개됩니다." : "공개 카드가 모두 이동했습니다."}</p>`;
    $("pendingCards").innerHTML = state.pending.length ? state.pending.map(c => cardHtml(c, { selectable: state.stage === "settle" })).join("") : '<p class="empty-note">아직 받은 콩이 없어요.</p>';
    $("deckLabel").textContent = `더미 ${state.deckCount}장 · 수확 ${state.discardCount}장`;
    $("marketHint").textContent = trading ? (isTurn() ? "공개 카드와 내 손패를 눌러 거래할 콩을 선택하세요." : `${playerName(state.turnPlayerId)}님과 거래하세요. 내 손패에서 줄 콩을 고를 수 있어요.`) : "남은 공개 카드는 현재 차례인 사람이 심습니다.";
  }
  function renderComposer() {
    const previousTarget = $("tradeTarget").value;
    const targets = state.players.filter(p => p.id !== myId() && (isTurn() || p.id === state.turnPlayerId));
    $("tradeTarget").innerHTML = targets.map(p => `<option value="${escape(p.id)}">${escape(p.name)}</option>`).join("");
    if (targets.some(p => p.id === previousTarget)) $("tradeTarget").value = previousTarget;
    const pool = [...state.hand, ...(isTurn() ? state.market : [])];
    $("giveLabel").textContent = kindsText(pool.filter(c => selected.has(c.id)).map(c => c.kind));
    $("wantChips").innerHTML = want.map((kind, i) => `<button data-remove-want="${i}" title="선택 취소">${beans[kind].name} ×</button>`).join("");
    $("offerBtn").disabled = state.stage !== "trade" || !selected.size && !want.length || actionPending;
    $("addWant").disabled = want.length >= 3;
    $("tradeComposer").classList.toggle("unavailable", state.stage !== "trade");
    $("tradeCount").textContent = state.stage === "trade" ? "서로 수락하면 성사" : "거래 시간에 열립니다";
  }
  function renderOffers() {
    $("offers").innerHTML = state.offers.length ? state.offers.slice().reverse().map(o => {
      const incoming = o.to === myId();
      return `<article class="offer"><div class="offer-title">${incoming ? `${escape(playerName(o.from))} → 나` : `나 → ${escape(playerName(o.to))}`}</div><p>${incoming ? "내가 받기" : "내가 주기"}: <b>${kindsText(o.give.map(c => c.kind))}</b><br>${incoming ? "내가 주기" : "내가 받기"}: <b>${kindsText(o.want)}</b></p><div class="row">${incoming ? `<button class="primary small" data-accept="${o.id}">이 조건으로 수락</button>` : '<span class="muted">응답 기다리는 중</span>'}<button class="ghost small" data-cancel="${o.id}">${incoming ? "거절" : "취소"}</button></div></article>`;
    }).join("") : `<p class="empty-note">${state.stage === "trade" ? "콩을 선택하고 첫 제안을 보내보세요." : "거래로 받은 콩은 ‘받은 콩’에 모입니다."}</p>`;
  }
  function renderTurn() {
    const stageNames = { plant: "01 · 심기", trade: "02 · 거래", settle: "03 · 받은 콩 심기" };
    $("stageLabel").textContent = stageNames[state.stage];
    $("turnTitle").textContent = state.stage === "settle" ? (state.pending.length ? "받은 콩을 내 밭에 심으세요" : "친구들이 콩을 심고 있어요") : `${isTurn() ? "내" : playerName(state.turnPlayerId) + "님의"} 차례${state.stage === "trade" ? " · 흥정 시작!" : ""}`;
    $("turnHint").textContent = state.stage === "plant" ? (isTurn() ? (state.planted ? "한 장 더 심거나 거래를 시작하세요." : "맨 앞 카드 1장을 심으세요. 자리가 없으면 먼저 밭을 수확하세요.") : "내 밭의 수확 시점을 생각해 보세요. 곧 거래가 열립니다.") : state.stage === "trade" ? "제안을 받고 수락해야 카드가 이동합니다. 기부도 수락이 필요해요." : "받은 콩을 고른 뒤 밭을 누르세요. 시간이 지나면 자동으로 심습니다.";
    const next = isTurn() && (state.stage === "trade" || state.stage === "plant" && state.planted > 0);
    $("nextBtn").classList.toggle("hidden", !next);
    $("nextBtn").textContent = state.stage === "trade" ? "거래 마감 → 심기" : "거래 시작 →";
    renderClock();
  }
  function renderClock() {
    if (!state?.deadline || state.phase !== "playing") return;
    const seconds = Math.max(0, Math.ceil((state.deadline - Date.now() - clockOffset) / 1000));
    $("seconds").textContent = seconds;
    $("seconds").parentElement.classList.toggle("urgent", seconds <= 5);
  }
  function renderResult() {
    const winners = state.players.filter(p => state.winnerIds.includes(p.id));
    $("resultTitle").textContent = `${winners.map(p => p.name).join(", ")} ${winners.length > 1 ? "공동 승리!" : "승리!"}`;
    const sorted = state.players.slice().sort((a, b) => b.coins - a.coins);
    $("rankings").innerHTML = sorted.map(p => `<div class="ranking${state.winnerIds.includes(p.id) ? " winner" : ""}"><span>${1 + sorted.filter(q => q.coins > p.coins).length}위 · ${escape(p.name)}</span><strong class="coins">${coin(p.coins)}</strong></div>`).join("");
    $("newGameBtn").classList.toggle("hidden", !isHost()); $("returnLobbyBtn").classList.toggle("hidden", !isHost());
  }
  function installState(nextState) {
    state = nextState; actionPending = false; clearTimeout(actionTimer);
    clockOffset = state.serverNow - Date.now();
    if (state.phase === "lobby") {
      $("gameScreen").classList.add("hidden"); $("welcome").classList.remove("hidden");
      if (lobby?.snapshot().started) lobby.returnToLobby();
      $("lobbyScreen").classList.remove("hidden"); return;
    }
    const key = `${state.turnNumber}:${state.stage}`;
    if (key !== stageKey) { selected.clear(); want = []; stageKey = key; $("harvestDialog").close(); }
    const pool = [...state.hand, ...state.market, ...state.pending];
    selected = new Set([...selected].filter(id => pool.some(c => c.id === id)));
    $("welcome").classList.add("hidden"); $("lobbyScreen").classList.add("hidden"); $("missingScreen").classList.add("hidden"); $("gameScreen").classList.remove("hidden");
    $("roundLabel").textContent = `${state.round} / ${state.roundLimit} 라운드`;
    $("roomLabel").textContent = practice ? "연습 · 컴퓨터 3명" : `방 ${lobby?.snapshot().roomCode || ""}`;
    $("playArea").classList.toggle("hidden", state.phase === "ended");
    $("resultPanel").classList.toggle("hidden", state.phase !== "ended");
    renderPlayers();
    if (state.phase === "ended") { renderResult(); return; }
    renderTurn(); renderCards(); renderFields(); renderComposer(); renderOffers();
    $("log").innerHTML = state.log.map(line => `<li>${escape(line)}</li>`).join("");
  }
  function send(action, data = {}) {
    if (actionPending) return;
    if (practice) {
      if (action === "RETURN_LOBBY") { location.reload(); return; }
      const result = B.act(practice, myId(), action, data);
      if (!result.ok) toast(result.error);
      installState(B.stateFor(practice, myId())); return;
    }
    actionPending = true;
    if (!lobby.sendServer({ type: "BEANTRADING_ACTION", action, ...data })) { actionPending = false; toast("연결을 확인한 뒤 다시 시도하세요."); return; }
    clearTimeout(actionTimer); actionTimer = setTimeout(() => { actionPending = false; toast("응답을 기다리는 중입니다. 연결 상태를 확인하세요."); }, 7000);
  }
  function selectCard(id) {
    if (state.stage === "settle") selected = new Set([id]);
    else if (selected.has(id)) selected.delete(id);
    else if (selected.size < 3) selected.add(id);
    else { toast("한 번에 최대 3장까지 제안할 수 있어요."); return; }
    renderCards(); renderFields(); renderComposer();
  }
  function openRules() { if (!$("rulesDialog").open) $("rulesDialog").showModal(); }
  function startPractice() {
    lobby?.destroy(); practice = B.createGame("practice-me", savedName || "나");
    ["흥정왕", "콩박사", "농부콩"].forEach((name, i) => B.addPlayer(practice, `bot-${i}`, name));
    B.startGame(practice); installState(B.stateFor(practice, "practice-me"));
    toast("연습 모드입니다. 컴퓨터 3명이 함께합니다.");
  }
  function botPlant(id, pile) {
    const card = pile[0]; if (!card) return;
    let f = practice.fields[id].findIndex(field => field[0]?.kind === card.kind);
    if (f < 0) f = practice.fields[id].findIndex(field => !field.length);
    if (f < 0) { f = practice.fields[id][0].length <= practice.fields[id][1].length ? 0 : 1; B.act(practice, id, "HARVEST", { field: f }); }
    B.act(practice, id, "PLANT", { field: f, cardId: card.id });
  }
  function tickPractice() {
    if (!practice || practice.phase !== "playing") return;
    if ($("rulesDialog").open) { practice.deadline += 1000; if (state) state.deadline = practice.deadline; return; }
    const revision = practice.revision;
    if (Date.now() >= practice.deadline) B.autoPlay(practice);
    else {
      const active = practice.players[practice.turnIndex].id, key = `${practice.turnNumber}:${practice.stage}`;
      if (key !== practiceStage) { practiceStage = key; botProposed.clear(); }
      if (practice.stage === "plant" && active !== "practice-me") B.autoPlay(practice);
      else if (practice.stage === "settle") {
        for (const p of practice.players.filter(p => p.id !== "practice-me")) {
          if (practice.stage !== "settle") break;
          botPlant(p.id, practice.pending[p.id]);
        }
      } else if (practice.stage === "trade") {
        for (const offer of practice.offers.slice()) {
          if (offer.to !== "practice-me" && offer.give.length >= offer.want.length) B.act(practice, offer.to, "ACCEPT", { offerId: offer.id });
        }
        for (const p of practice.players.filter(p => p.id !== "practice-me")) {
          if (botProposed.has(p.id)) continue;
          botProposed.add(p.id);
          const pool = p.id === active ? [...practice.market, ...practice.hands[p.id]] : practice.hands[p.id];
          const give = pool.find(c => !practice.fields[p.id].some(f => f[0]?.kind === c.kind)) || pool[0];
          const desired = practice.fields[p.id].find(f => f.length)?.[0]?.kind || practice.hands[p.id][0]?.kind;
          if (give && desired) B.act(practice, p.id, "OFFER", { to: p.id === active ? "practice-me" : active, giveIds: [give.id], want: [desired] });
        }
        if (active !== "practice-me" && practice.deadline - Date.now() < 13000) B.act(practice, active, "NEXT");
      }
    }
    if (practice.revision !== revision) installState(B.stateFor(practice, "practice-me"));
  }
  function init() {
    $("wantKind").innerHTML = B.BEANS.map(b => `<option value="${b.id}">${b.name}</option>`).join("");
    $("priceTable").innerHTML = B.BEANS.map(b => `<div class="price-bean"><img src="${art(b.art)}" alt=""><strong>${b.name} · 총 ${b.count}장</strong><p>${b.prices.map((n, i) => `${n}장 → ${i + 1}금화`).join("<br>")}</p></div>`).join("");
    lobby = ClassroomMultiplayerLobby.create({
      gameId: "beantrading", initialMode: "guest", getPlayerName: () => /^[가-힣]{2,6}$/.test(savedName) ? savedName : "",
      allowedPlayerCounts: [4, 5], minPlayers: 4, maxPlayers: 5,
      rulesButtonIds: ["rulesBtnLobby", "rulesBtnGame"], leaveButtonIds: ["leaveBtnLobby", "leaveBtnGame"],
      onRules: openRules, onLeave: () => { if (practice) location.reload(); else location.href = "../../../"; }, onNotice: toast,
      onInvalidStart: () => toast("4~5명이 모여야 시작할 수 있습니다."),
      getLobbyPresentation: ({ count, role, canStart }) => ({ canStart, guideText: role === "host" ? `현재 ${count}명 · 4~5명이 모이면 시작하세요.` : `현재 ${count}명 · 방장이 시작할 때까지 기다리세요.` }),
      createStartData: () => ({ serverAuthoritative: true }),
      onStarted: () => { if (!practice && isHost()) send("START"); },
      onServerMessage: message => {
        if (practice) return;
        if (message.type === "BEANTRADING_STATE") installState(message.state);
        if (message.type === "BEANTRADING_ERROR") { actionPending = false; clearTimeout(actionTimer); toast(message.message); if (state?.phase === "playing") renderComposer(); }
      },
      onPlayerLeftDuringGame: () => toast("플레이어가 나가 대기실로 돌아갑니다."),
      onAbort: ({ title, message }) => { if (practice) return; $("abortTitle").textContent = title; $("abortMessage").textContent = message; if (!$("abortDialog").open) $("abortDialog").showModal(); }
    }).mount();
    $("practiceBtn").addEventListener("click", startPractice);
    $("rulesBtnGame").addEventListener("click", () => { if (practice) openRules(); });
    $("leaveBtnGame").addEventListener("click", () => { if (practice) location.reload(); });
    $("closeRules").addEventListener("click", () => $("rulesDialog").close());
    $("reloadBtn").addEventListener("click", () => location.reload());
    $("nextBtn").addEventListener("click", () => send("NEXT"));
    $("newGameBtn").addEventListener("click", () => send("NEW_GAME"));
    $("returnLobbyBtn").addEventListener("click", () => send("RETURN_LOBBY"));
    $("clearSelection").addEventListener("click", () => { selected.clear(); renderCards(); renderComposer(); });
    $("addWant").addEventListener("click", () => { if (want.length < 3) want.push($("wantKind").value); renderComposer(); });
    $("offerBtn").addEventListener("click", () => {
      const data = { to: $("tradeTarget").value, giveIds: [...selected], want: [...want] };
      selected.clear(); want = []; send("OFFER", data);
    });
    document.addEventListener("click", event => {
      const button = event.target.closest("button"); if (!button || button.disabled || !state) return;
      if (button.dataset.card) selectCard(button.dataset.card);
      if (button.dataset.plant !== undefined) { const card = plantingCard(); if (card) send("PLANT", { field: Number(button.dataset.plant), cardId: card.id }); }
      if (button.dataset.harvest !== undefined) {
        harvestField = Number(button.dataset.harvest);
        if (me().fields[harvestField].value === 0) $("harvestDialog").showModal();
        else send("HARVEST", { field: harvestField });
      }
      if (button.dataset.removeWant !== undefined) { want.splice(Number(button.dataset.removeWant), 1); renderComposer(); }
      if (button.dataset.accept) send("ACCEPT", { offerId: button.dataset.accept });
      if (button.dataset.cancel) send("CANCEL", { offerId: button.dataset.cancel });
    });
    $("confirmHarvest").addEventListener("click", () => { $("harvestDialog").close(); send("HARVEST", { field: harvestField }); });
    $("cancelHarvest").addEventListener("click", () => $("harvestDialog").close());
    setInterval(renderClock, 250); setInterval(tickPractice, 1000);
  }
  init();
})();
