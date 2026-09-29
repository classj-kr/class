(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory(require("node:crypto").randomInt);
  else root.BeanTrading = factory(max => {
    const values = new Uint32Array(1);
    root.crypto.getRandomValues(values);
    return Math.floor(values[0] / 4294967296 * max);
  });
})(typeof globalThis !== "undefined" ? globalThis : this, function (randomInt) {
  "use strict";
  const BEANS = Object.freeze([
    { id: "kidney", name: "강낭콩", count: 22, prices: [3, 5, 7, 9], art: "bean-kidney-v3.png", color: "#bf5441" },
    { id: "soy", name: "대두", count: 20, prices: [3, 5, 6, 8], art: "bean-soy-v3.png", color: "#b38a39" },
    { id: "mung", name: "녹두", count: 18, prices: [3, 4, 6, 7], art: "bean-mung-v3.png", color: "#639059" },
    { id: "black", name: "검정콩", count: 16, prices: [2, 4, 5, 7], art: "bean-black-v3.png", color: "#5b6474" },
    { id: "white", name: "흰콩", count: 14, prices: [2, 3, 5, 6], art: "bean-white-v3.png", color: "#aa9579" },
    { id: "chickpea", name: "병아리콩", count: 12, prices: [2, 3, 4, 6], art: "bean-chickpea-v4.png", color: "#c08d24" },
    { id: "pinto", name: "얼룩콩", count: 10, prices: [2, 3, 4, 5], art: "bean-pinto-v5.png", color: "#987450" },
    { id: "fava", name: "잠두", count: 8, prices: [1, 2, 3, 4], art: "bean-fava-v3.png", color: "#477b68" }
  ]);
  const byKind = Object.fromEntries(BEANS.map(bean => [bean.id, bean]));
  const ROUND_LIMIT = 5;
  const DURATIONS = { plant: 10000, trade: 25000, settle: 10000 };
  const fail = error => ({ ok: false, error });
  const ok = () => ({ ok: true });
  function shuffle(cards, pick = randomInt) {
    for (let i = cards.length - 1; i > 0; i--) { const j = pick(i + 1); [cards[i], cards[j]] = [cards[j], cards[i]]; }
    return cards;
  }
  function makeDeck() { return BEANS.flatMap(b => Array.from({ length: b.count }, (_, n) => ({ id: `${b.id}-${n}`, kind: b.id }))); }
  function cleanName(name) { return String(name || "플레이어").trim().slice(0, 12); }
  function createGame(hostId, name) {
    return { hostId: String(hostId), players: [{ id: String(hostId), name: cleanName(name) }], phase: "lobby", revision: 0,
      hands: {}, fields: {}, pending: {}, coins: {}, deck: [], discard: [], market: [], offers: [], log: [],
      turnIndex: 0, turnNumber: 0, round: 0, stage: null, deadline: null, planted: 0, offerNumber: 0, winnerIds: [] };
  }
  function addPlayer(g, id, name) {
    if (g.phase !== "lobby") return fail("이미 시작한 게임입니다.");
    if (g.players.some(p => p.id === id)) return ok();
    if (g.players.length >= 5) return fail("최대 5명까지 참가할 수 있습니다.");
    g.players.push({ id: String(id), name: cleanName(name) }); g.revision++; return ok();
  }
  function removePlayer(g, id) { g.players = g.players.filter(p => p.id !== id); }
  function resetToLobby(g, message) {
    const { hostId, players, revision } = g;
    Object.assign(g, createGame(hostId, players[0]?.name), { players, revision: revision + 1 });
    if (message) g.log.push(message); return ok();
  }
  const activeId = g => g.players[g.turnIndex]?.id;
  const nameOf = (g, id) => g.players.find(p => p.id === id)?.name || "플레이어";
  function note(g, text) { g.log.unshift(text); g.log = g.log.slice(0, 12); }
  function payout(kind, count) { return byKind[kind]?.prices.filter(n => count >= n).length || 0; }
  function draw(g, count) {
    const cards = [];
    for (let i = 0; i < count; i++) {
      if (!g.deck.length && g.discard.length) g.deck = shuffle(g.discard.splice(0));
      if (!g.deck.length) break;
      cards.push(g.deck.pop());
    }
    return cards;
  }
  function startGame(g, now = Date.now(), pick = randomInt) {
    if (g.phase !== "lobby" && g.phase !== "ended") return fail("이미 게임 중입니다.");
    if (g.players.length < 4 || g.players.length > 5) return fail("4~5명이 모여야 시작할 수 있습니다.");
    resetToLobby(g);
    g.deck = shuffle(makeDeck(), pick); g.phase = "playing";
    for (const p of g.players) { g.hands[p.id] = draw(g, 5); g.fields[p.id] = [[], []]; g.pending[p.id] = []; g.coins[p.id] = 0; }
    beginTurn(g, now); g.revision++; return ok();
  }
  function beginTurn(g, now) {
    g.turnNumber++; g.round = Math.floor((g.turnNumber - 1) / g.players.length) + 1;
    g.planted = 0; g.offers = []; g.market = []; g.stage = "plant"; g.deadline = now + DURATIONS.plant;
    note(g, `${g.round}라운드 · ${nameOf(g, activeId(g))}님의 차례`);
    if (!g.hands[activeId(g)].length) openMarket(g, now);
  }
  function harvest(g, id, field) {
    const cards = g.fields[id][field];
    const earned = payout(cards[0]?.kind, cards.length);
    if (cards.length) note(g, `${nameOf(g, id)}: ${byKind[cards[0].kind].name} ${cards.length}장 수확 → ${earned}금화`);
    g.coins[id] += earned; g.discard.push(...cards.splice(0));
  }
  function place(g, id, field, card) { g.fields[id][field].push(card); }
  function autoPlant(g, id, card) {
    let field = g.fields[id].findIndex(f => f[0]?.kind === card.kind);
    if (field < 0) field = g.fields[id].findIndex(f => !f.length);
    if (field < 0) {
      // Keep the field closest to its next reward.
      const cost = f => {
        const bean = byKind[f[0].kind], value = payout(bean.id, f.length), next = bean.prices[value];
        return next ? f.length / next : 0;
      };
      field = cost(g.fields[id][0]) <= cost(g.fields[id][1]) ? 0 : 1;
      harvest(g, id, field);
    }
    place(g, id, field, card);
  }
  function openMarket(g, now) { g.stage = "trade"; g.market = draw(g, 2); g.deadline = now + DURATIONS.trade; }
  function finishTrade(g, now) {
    g.pending[activeId(g)].push(...g.market.splice(0)); g.offers = [];
    g.stage = "settle"; g.deadline = now + DURATIONS.settle;
    if (g.players.every(p => !g.pending[p.id].length)) finishTurn(g, now);
  }
  function finishTurn(g, now) {
    if (g.turnNumber >= g.players.length * ROUND_LIMIT) {
      for (const p of g.players) for (let f = 0; f < 2; f++) harvest(g, p.id, f);
      const best = Math.max(...Object.values(g.coins));
      g.winnerIds = g.players.filter(p => g.coins[p.id] === best).map(p => p.id);
      g.phase = "ended"; g.stage = null; g.deadline = null;
      note(g, "모든 밭을 수확했습니다. 손에 남은 카드는 점수에 포함하지 않습니다."); return;
    }
    g.hands[activeId(g)].push(...draw(g, 3));
    g.turnIndex = (g.turnIndex + 1) % g.players.length; beginTurn(g, now);
  }
  function available(g, id) { return [...(id === activeId(g) ? g.market : []), ...g.hands[id]]; }
  function take(g, id, cardId) {
    for (const pile of [g.hands[id], ...(id === activeId(g) ? [g.market] : [])]) {
      const i = pile.findIndex(c => c.id === cardId); if (i >= 0) return pile.splice(i, 1)[0];
    }
  }
  function wantedCards(g, id, kinds) {
    const pool = available(g, id).reverse(), selected = [];
    for (const kind of kinds) {
      const i = pool.findIndex(c => c.kind === kind); if (i < 0) return null;
      selected.push(pool.splice(i, 1)[0]);
    }
    return selected;
  }
  function pruneOffers(g) { g.offers = g.offers.filter(o => o.give.every(c => available(g, o.from).some(a => a.id === c.id))); }
  function autoPlay(g, now = Date.now()) {
    if (g.phase !== "playing") return fail("진행 중인 게임이 아닙니다.");
    if (g.stage === "plant") {
      const id = activeId(g);
      if (!g.planted && g.hands[id].length) autoPlant(g, id, g.hands[id].shift());
      openMarket(g, now);
    } else if (g.stage === "trade") finishTrade(g, now);
    else {
      for (const p of g.players) while (g.pending[p.id].length) autoPlant(g, p.id, g.pending[p.id].shift());
      finishTurn(g, now);
    }
    g.revision++; return ok();
  }
  function act(g, id, action, data = {}, now = Date.now()) {
    if (!g.players.some(p => p.id === id)) return fail("참가자가 아닙니다.");
    if (["START", "NEW_GAME", "RETURN_LOBBY"].includes(action)) {
      if (id !== g.hostId) return fail("방장만 할 수 있습니다.");
      if (action === "RETURN_LOBBY") return g.phase === "ended" ? resetToLobby(g) : fail("게임이 끝난 뒤 돌아갈 수 있습니다.");
      if (action === "NEW_GAME" && g.phase !== "ended") return fail("게임이 끝난 뒤 다시 시작할 수 있습니다.");
      return startGame(g, now);
    }
    if (g.phase !== "playing") return fail("진행 중인 게임이 아닙니다.");
    // Enforce deadlines even if a socket action arrives before the timeout callback.
    if (now >= g.deadline) { autoPlay(g, now); return fail("시간이 지나 다음 단계로 넘어갔습니다."); }
    if (action === "HARVEST") {
      if (![0, 1].includes(data.field) || !g.fields[id][data.field].length) return fail("수확할 밭을 선택하세요.");
      harvest(g, id, data.field);
    } else if (action === "PLANT") {
      if (![0, 1].includes(data.field)) return fail("밭을 선택하세요.");
      let pile;
      if (g.stage === "plant" && id === activeId(g) && g.planted < 2) pile = g.hands[id];
      else if (g.stage === "settle") pile = g.pending[id];
      else return fail("지금은 심을 수 없습니다.");
      const index = g.stage === "plant" ? 0 : pile.findIndex(c => c.id === data.cardId);
      const card = pile[index], field = g.fields[id][data.field];
      if (!card || (data.cardId && card.id !== data.cardId)) return fail("심을 카드를 선택하세요. 손패는 앞에서부터 심습니다.");
      if (field.length && field[0].kind !== card.kind) return fail("다른 콩을 심으려면 먼저 밭을 수확하세요.");
      place(g, id, data.field, pile.splice(index, 1)[0]);
      if (g.stage === "plant") { g.planted++; if (g.planted === 2 || !pile.length) openMarket(g, now); }
      else if (g.players.every(p => !g.pending[p.id].length)) finishTurn(g, now);
    } else if (action === "NEXT") {
      if (id !== activeId(g)) return fail("현재 차례인 사람만 진행할 수 있습니다.");
      if (g.stage === "plant" && g.planted) openMarket(g, now);
      else if (g.stage === "trade") finishTrade(g, now);
      else return fail("먼저 맨 앞 카드 1장을 심으세요.");
    } else if (action === "OFFER") {
      if (g.stage !== "trade") return fail("거래 시간이 아닙니다.");
      const to = data.to, giveIds = data.giveIds, want = data.want;
      if (to === id || !g.players.some(p => p.id === to) || (id !== activeId(g) && to !== activeId(g))) return fail("현재 차례인 사람과만 거래할 수 있습니다.");
      if (!Array.isArray(giveIds) || !Array.isArray(want) || giveIds.length > 3 || want.length > 3 || !giveIds.length && !want.length || new Set(giveIds).size !== giveIds.length || want.some(k => !Object.hasOwn(byKind, k))) return fail("주고받을 카드를 각각 3장 이하로 선택하세요.");
      const pool = available(g, id), give = giveIds.map(cid => pool.find(c => c.id === cid));
      if (give.some(c => !c)) return fail("내 카드 또는 내 차례의 공개 카드만 제안할 수 있습니다.");
      if (g.offers.filter(o => o.from === id).length >= 4) return fail("기존 제안을 취소한 뒤 새로 제안하세요.");
      g.offers.push({ id: `offer-${++g.offerNumber}`, from: id, to, give: give.map(c => ({ ...c })), want: [...want] });
    } else if (action === "ACCEPT") {
      if (g.stage !== "trade") return fail("거래 시간이 아닙니다.");
      const offer = g.offers.find(o => o.id === data.offerId && o.to === id);
      if (!offer) return fail("이미 끝났거나 나에게 온 제안이 아닙니다.");
      const payment = wantedCards(g, id, offer.want);
      if (!payment || !offer.give.every(c => available(g, offer.from).some(a => a.id === c.id))) return fail("카드가 부족하거나 이미 다른 거래에 쓰였습니다.");
      for (const card of offer.give) g.pending[id].push(take(g, offer.from, card.id));
      for (const card of payment) g.pending[offer.from].push(take(g, id, card.id));
      g.offers = g.offers.filter(o => o.id !== offer.id); pruneOffers(g);
      note(g, `${nameOf(g, offer.from)} ↔ ${nameOf(g, id)} 거래 성사 (${offer.give.length}장 : ${payment.length}장)`);
    } else if (action === "CANCEL") {
      const offer = g.offers.find(o => o.id === data.offerId && (o.from === id || o.to === id));
      if (!offer) return fail("취소할 제안이 없습니다.");
      g.offers = g.offers.filter(o => o.id !== offer.id);
    } else return fail("알 수 없는 행동입니다.");
    g.revision++; return ok();
  }
  function stateFor(g, id) {
    const state = { phase: g.phase, revision: g.revision, round: g.round, roundLimit: ROUND_LIMIT, turnNumber: g.turnNumber,
      turnPlayerId: activeId(g), stage: g.stage, deadline: g.deadline, planted: g.planted, serverNow: Date.now(),
      deckCount: g.deck.length, discardCount: g.discard.length, market: g.market, hand: g.hands[id] || [], pending: g.pending[id] || [],
      offers: g.offers.filter(o => o.from === id || o.to === id), log: g.log, winnerIds: g.winnerIds,
      players: g.players.map(p => ({ ...p, coins: g.coins[p.id] || 0, handCount: g.hands[p.id]?.length || 0,
        fields: (g.fields[p.id] || [[], []]).map(f => ({ kind: f[0]?.kind || null, count: f.length, value: payout(f[0]?.kind, f.length) })), pendingCount: g.pending[p.id]?.length || 0 })) };
    return JSON.parse(JSON.stringify(state));
  }
  return { BEANS, ROUND_LIMIT, DURATIONS, makeDeck, createGame, addPlayer, removePlayer, resetToLobby, startGame, act, autoPlay, stateFor, payout };
});
