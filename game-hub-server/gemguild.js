"use strict";

const crypto = require("crypto");

const TURN_SECONDS = 45;
const TARGET_SCORE = 15;
const MAX_TOKENS = 10;
const GEMS = Object.freeze(["ruby", "sapphire", "emerald", "amethyst", "amber"]);
const GEM_LABELS = Object.freeze({
  ruby: "루비",
  sapphire: "사파이어",
  emerald: "에메랄드",
  amethyst: "자수정",
  amber: "호박",
  gold: "황금"
});

function freezeCard(card) {
  return Object.freeze({ ...card, cost: Object.freeze({ ...card.cost }) });
}

const CARDS = Object.freeze([
  freezeCard({ id: "1-ruby-1", tier: 1, name: "불씨 광맥", bonus: "ruby", points: 0, art: "ruby-mine", cost: { sapphire: 1, emerald: 1, amethyst: 1 } }),
  freezeCard({ id: "1-ruby-2", tier: 1, name: "진홍 세공대", bonus: "ruby", points: 1, art: "ruby-workshop", cost: { sapphire: 2, amber: 2 } }),
  freezeCard({ id: "1-sapphire-1", tier: 1, name: "푸른 동굴", bonus: "sapphire", points: 0, art: "sapphire-mine", cost: { ruby: 1, emerald: 1, amber: 1 } }),
  freezeCard({ id: "1-sapphire-2", tier: 1, name: "파도 세공대", bonus: "sapphire", points: 1, art: "sapphire-workshop", cost: { ruby: 2, amethyst: 2 } }),
  freezeCard({ id: "1-emerald-1", tier: 1, name: "이끼 광맥", bonus: "emerald", points: 0, art: "emerald-mine", cost: { ruby: 1, sapphire: 1, amethyst: 1 } }),
  freezeCard({ id: "1-emerald-2", tier: 1, name: "숲빛 세공대", bonus: "emerald", points: 1, art: "emerald-workshop", cost: { sapphire: 2, amber: 2 } }),
  freezeCard({ id: "1-amethyst-1", tier: 1, name: "별밤 광맥", bonus: "amethyst", points: 0, art: "amethyst-mine", cost: { ruby: 1, emerald: 1, amber: 1 } }),
  freezeCard({ id: "1-amethyst-2", tier: 1, name: "보랏빛 세공대", bonus: "amethyst", points: 1, art: "amethyst-workshop", cost: { ruby: 2, emerald: 2 } }),
  freezeCard({ id: "1-amber-1", tier: 1, name: "태양 광맥", bonus: "amber", points: 0, art: "amber-mine", cost: { sapphire: 1, emerald: 1, amethyst: 1 } }),
  freezeCard({ id: "1-amber-2", tier: 1, name: "금빛 세공대", bonus: "amber", points: 1, art: "amber-workshop", cost: { ruby: 2, sapphire: 2 } }),

  freezeCard({ id: "2-ruby-1", tier: 2, name: "용의 루비", bonus: "ruby", points: 2, art: "ruby-vault", cost: { sapphire: 2, emerald: 3, amethyst: 2 } }),
  freezeCard({ id: "2-ruby-2", tier: 2, name: "진홍 왕관", bonus: "ruby", points: 3, art: "ruby-crown", cost: { ruby: 2, sapphire: 4, amber: 2 } }),
  freezeCard({ id: "2-sapphire-1", tier: 2, name: "심해의 사파이어", bonus: "sapphire", points: 2, art: "sapphire-vault", cost: { ruby: 2, emerald: 2, amber: 3 } }),
  freezeCard({ id: "2-sapphire-2", tier: 2, name: "푸른 별 왕관", bonus: "sapphire", points: 3, art: "sapphire-crown", cost: { sapphire: 2, amethyst: 4, emerald: 2 } }),
  freezeCard({ id: "2-emerald-1", tier: 2, name: "고대의 에메랄드", bonus: "emerald", points: 2, art: "emerald-vault", cost: { ruby: 3, sapphire: 2, amethyst: 2 } }),
  freezeCard({ id: "2-emerald-2", tier: 2, name: "숲의 왕관", bonus: "emerald", points: 3, art: "emerald-crown", cost: { emerald: 2, amber: 4, ruby: 2 } }),
  freezeCard({ id: "2-amethyst-1", tier: 2, name: "예언의 자수정", bonus: "amethyst", points: 2, art: "amethyst-vault", cost: { sapphire: 3, emerald: 2, amber: 2 } }),
  freezeCard({ id: "2-amethyst-2", tier: 2, name: "황혼의 왕관", bonus: "amethyst", points: 3, art: "amethyst-crown", cost: { amethyst: 2, ruby: 4, sapphire: 2 } }),
  freezeCard({ id: "2-amber-1", tier: 2, name: "태양의 호박", bonus: "amber", points: 2, art: "amber-vault", cost: { ruby: 2, emerald: 3, amethyst: 2 } }),
  freezeCard({ id: "2-amber-2", tier: 2, name: "여명의 왕관", bonus: "amber", points: 3, art: "amber-crown", cost: { amber: 2, emerald: 4, amethyst: 2 } }),

  freezeCard({ id: "3-ruby-1", tier: 3, name: "불사조의 심장", bonus: "ruby", points: 4, art: "ruby-relic", cost: { sapphire: 3, emerald: 3, amethyst: 5, amber: 3 } }),
  freezeCard({ id: "3-ruby-2", tier: 3, name: "홍염의 홀", bonus: "ruby", points: 5, art: "ruby-scepter", cost: { ruby: 3, sapphire: 6, amber: 3 } }),
  freezeCard({ id: "3-sapphire-1", tier: 3, name: "바다왕의 눈", bonus: "sapphire", points: 4, art: "sapphire-relic", cost: { ruby: 3, emerald: 5, amethyst: 3, amber: 3 } }),
  freezeCard({ id: "3-sapphire-2", tier: 3, name: "빙하의 홀", bonus: "sapphire", points: 5, art: "sapphire-scepter", cost: { sapphire: 3, amethyst: 6, emerald: 3 } }),
  freezeCard({ id: "3-emerald-1", tier: 3, name: "세계수의 눈물", bonus: "emerald", points: 4, art: "emerald-relic", cost: { ruby: 5, sapphire: 3, amethyst: 3, amber: 3 } }),
  freezeCard({ id: "3-emerald-2", tier: 3, name: "대지의 홀", bonus: "emerald", points: 5, art: "emerald-scepter", cost: { emerald: 3, amber: 6, ruby: 3 } }),
  freezeCard({ id: "3-amethyst-1", tier: 3, name: "밤하늘의 파편", bonus: "amethyst", points: 4, art: "amethyst-relic", cost: { ruby: 3, sapphire: 5, emerald: 3, amber: 3 } }),
  freezeCard({ id: "3-amethyst-2", tier: 3, name: "별읽기의 홀", bonus: "amethyst", points: 5, art: "amethyst-scepter", cost: { amethyst: 3, ruby: 6, sapphire: 3 } }),
  freezeCard({ id: "3-amber-1", tier: 3, name: "영원의 태양", bonus: "amber", points: 4, art: "amber-relic", cost: { ruby: 3, sapphire: 3, emerald: 5, amethyst: 3 } }),
  freezeCard({ id: "3-amber-2", tier: 3, name: "새벽빛의 홀", bonus: "amber", points: 5, art: "amber-scepter", cost: { amber: 3, emerald: 6, amethyst: 3 } })
]);

const PATRONS = Object.freeze([
  Object.freeze({ id: "patron-ember", name: "불꽃 수집가", points: 3, requirement: Object.freeze({ ruby: 3, sapphire: 3, emerald: 3 }) }),
  Object.freeze({ id: "patron-tide", name: "바다의 기록관", points: 3, requirement: Object.freeze({ sapphire: 3, emerald: 3, amethyst: 3 }) }),
  Object.freeze({ id: "patron-grove", name: "고목의 수호자", points: 3, requirement: Object.freeze({ emerald: 3, amethyst: 3, amber: 3 }) }),
  Object.freeze({ id: "patron-dawn", name: "새벽의 대공", points: 3, requirement: Object.freeze({ ruby: 3, amethyst: 3, amber: 3 }) }),
  Object.freeze({ id: "patron-crown", name: "황금 왕관의 주인", points: 3, requirement: Object.freeze({ ruby: 3, sapphire: 3, amber: 3 }) })
]);

function emptyGems(includeGold = false) {
  const values = Object.fromEntries(GEMS.map(gem => [gem, 0]));
  if (includeGold) values.gold = 0;
  return values;
}

function cleanName(value, fallback = "플레이어") {
  return String(value || "").trim().slice(0, 12) || fallback;
}

function shuffle(values, randomIndex = maximum => crypto.randomInt(maximum)) {
  const result = [...values];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const other = randomIndex(index + 1);
    [result[index], result[other]] = [result[other], result[index]];
  }
  return result;
}

function createPlayer(id, name) {
  return {
    id: String(id),
    name: cleanName(name),
    tokens: emptyGems(true),
    bonuses: emptyGems(false),
    cards: [],
    reserved: [],
    patrons: [],
    score: 0
  };
}

function createGame(hostId, hostName) {
  return {
    phase: "lobby",
    players: [createPlayer(hostId, hostName || "방장")],
    bank: { ...emptyGems(true), gold: 5 },
    decks: { 1: [], 2: [], 3: [] },
    market: { 1: [], 2: [], 3: [] },
    patrons: [],
    turnIndex: 0,
    winnerId: null,
    winnerIds: [],
    finalRound: false,
    pending: null,
    turnDeadline: null,
    lastAction: "2~4명이 모이면 시작할 수 있습니다.",
    revision: 0
  };
}

function addPlayer(game, id, name) {
  if (game.phase !== "lobby") return { ok: false, error: "이미 시작한 게임입니다." };
  const safeId = String(id);
  if (game.players.some(player => player.id === safeId)) return { ok: true };
  if (game.players.length >= 4) return { ok: false, error: "보석 상단은 최대 4명까지 참여할 수 있습니다." };
  game.players.push(createPlayer(safeId, name || `플레이어 ${game.players.length + 1}`));
  game.revision += 1;
  return { ok: true };
}

function removePlayer(game, id) {
  const safeId = String(id);
  game.players = game.players.filter(player => player.id !== safeId);
  if (game.turnIndex >= game.players.length) game.turnIndex = 0;
  game.revision += 1;
}

function resetPlayer(player) {
  player.tokens = emptyGems(true);
  player.bonuses = emptyGems(false);
  player.cards = [];
  player.reserved = [];
  player.patrons = [];
  player.score = 0;
}

function resetToLobby(game, message = "대기실로 돌아왔습니다.") {
  game.phase = "lobby";
  game.players.forEach(resetPlayer);
  game.bank = { ...emptyGems(true), gold: 5 };
  game.decks = { 1: [], 2: [], 3: [] };
  game.market = { 1: [], 2: [], 3: [] };
  game.patrons = [];
  game.turnIndex = 0;
  game.winnerId = null;
  game.winnerIds = [];
  game.finalRound = false;
  game.pending = null;
  game.turnDeadline = null;
  game.lastAction = message;
  game.revision += 1;
  return { ok: true };
}

function refillMarket(game, tier) {
  while (game.market[tier].length < 4 && game.decks[tier].length) {
    game.market[tier].push(game.decks[tier].pop());
  }
}

function startGame(game, randomIndex) {
  if (game.phase !== "lobby") return { ok: false, error: "이미 시작한 게임입니다." };
  if (game.players.length < 2 || game.players.length > 4) return { ok: false, error: "게임 시작에는 2~4명이 필요합니다." };
  const coloredCount = game.players.length === 2 ? 4 : game.players.length === 3 ? 5 : 7;
  game.bank = { ...Object.fromEntries(GEMS.map(gem => [gem, coloredCount])), gold: 5 };
  game.players.forEach(resetPlayer);
  for (const tier of [1, 2, 3]) {
    game.decks[tier] = shuffle(CARDS.filter(card => card.tier === tier), randomIndex);
    game.market[tier] = [];
    refillMarket(game, tier);
  }
  game.patrons = shuffle(PATRONS, randomIndex).slice(0, game.players.length + 1);
  game.turnIndex = 0;
  game.winnerId = null;
  game.winnerIds = [];
  game.finalRound = false;
  game.pending = null;
  game.phase = "playing";
  game.turnDeadline = Date.now() + TURN_SECONDS * 1000;
  game.lastAction = `${game.players[0].name}님부터 시작합니다.`;
  game.revision += 1;
  return { ok: true };
}

function currentPlayer(game) {
  return game.players[game.turnIndex] || null;
}

function playerById(game, id) {
  return game.players.find(player => player.id === String(id)) || null;
}

function tokenTotal(player) {
  return [...GEMS, "gold"].reduce((sum, gem) => sum + (player.tokens[gem] || 0), 0);
}

function validateTurn(game, playerId, allowPending = false) {
  if (game.phase !== "playing") return { error: "진행 중인 게임이 아닙니다." };
  const player = playerById(game, playerId);
  if (!player || currentPlayer(game)?.id !== player.id) return { error: "지금은 내 차례가 아닙니다." };
  if (game.pending && !allowPending) return { error: "보석 반납 또는 후원자 선택을 먼저 마치세요." };
  return { player };
}

function eligiblePatrons(game, player) {
  return game.patrons.filter(candidate => GEMS.every(gem => (player.bonuses[gem] || 0) >= (candidate.requirement[gem] || 0)));
}
function pendingChoice(game, type, message) {
  game.pending = { type, message };
  game.lastAction = message + (type === 'return' ? ' 초과한 보석을 골라 반납하세요.' : '방문할 후원자 한 명을 선택하세요.');
  game.turnDeadline = Date.now() + TURN_SECONDS * 1000;
  game.revision += 1;
}
function completeTurn(game, message, patron = null) {
  const player = currentPlayer(game);
  if (patron) {
    player.patrons.push(patron.id); player.score += patron.points;
    game.patrons = game.patrons.filter(candidate => candidate.id !== patron.id);
    message += ' ' + patron.name + '의 후원을 받아 ' + patron.points + '점을 얻었습니다.';
  }
  game.pending = null;
  if (player.score >= TARGET_SCORE) game.finalRound = true;
  if (game.finalRound && game.turnIndex === game.players.length - 1) {
    const score = Math.max(...game.players.map(p => p.score));
    const candidates = game.players.filter(p => p.score === score);
    const fewest = Math.min(...candidates.map(p => p.cards.length));
    const winners = candidates.filter(p => p.cards.length === fewest);
    game.winnerIds = winners.map(p => p.id); game.winnerId = game.winnerIds[0];
    game.phase = 'ended'; game.turnDeadline = null;
    game.lastAction = message + ' 마지막 라운드 종료 · ' + winners.map(p => p.name).join(', ') + '님 승리 (' + score + '점)!';
  } else {
    game.turnIndex = (game.turnIndex + 1) % game.players.length;
    game.turnDeadline = Date.now() + TURN_SECONDS * 1000;
    game.lastAction = message + (game.finalRound ? ' 마지막 라운드입니다. 남은 플레이어도 한 차례씩 진행합니다.' : '');
  }
  game.revision += 1;
}
function finishTurn(game, message) {
  const player = currentPlayer(game);
  if (tokenTotal(player) > MAX_TOKENS) { pendingChoice(game, 'return', message); return; }
  const patrons = eligiblePatrons(game, player);
  if (patrons.length > 1) { pendingChoice(game, 'patron', message); return; }
  completeTurn(game, message, patrons[0]);
}
function returnGems(game, playerId, requested) {
  const { player, error } = validateTurn(game, playerId, true);
  if (error) return { ok: false, error };
  if (game.pending?.type !== 'return') return { ok: false, error: '지금은 반납할 차례가 아닙니다.' };
  const gems = Array.isArray(requested) ? requested : [];
  const excess = tokenTotal(player) - MAX_TOKENS;
  if (gems.length !== excess || gems.some(g => ![...GEMS, 'gold'].includes(g))) return { ok: false, error: excess + '개를 골라 반납하세요.' };
  const counts = Object.fromEntries([...GEMS, 'gold'].map(g => [g, gems.filter(v => v === g).length]));
  if (Object.keys(counts).some(g => counts[g] > player.tokens[g])) return { ok: false, error: '가진 보석보다 많이 반납할 수 없습니다.' };
  for (const gem of gems) { player.tokens[gem] -= 1; game.bank[gem] += 1; }
  const message = game.pending.message + ' 보석 ' + excess + '개를 반납했습니다.';
  game.pending = null; finishTurn(game, message); return { ok: true };
}
function choosePatron(game, playerId, patronId) {
  const { player, error } = validateTurn(game, playerId, true);
  if (error) return { ok: false, error };
  if (game.pending?.type !== 'patron') return { ok: false, error: '지금은 후원자를 선택할 차례가 아닙니다.' };
  const patron = eligiblePatrons(game, player).find(p => p.id === patronId);
  if (!patron) return { ok: false, error: '조건을 충족한 후원자를 선택하세요.' };
  completeTurn(game, game.pending.message, patron); return { ok: true };
}

function takeGems(game, playerId, requested) {
  const { player, error } = validateTurn(game, playerId);
  if (error) return { ok: false, error };
  const gems = Array.isArray(requested) ? requested.map(String) : [];
  if (!gems.length || gems.length > 3 || gems.some(gem => !GEMS.includes(gem))) return { ok: false, error: "보석을 1~3개 선택하세요." };
  const counts = Object.fromEntries(GEMS.map(gem => [gem, gems.filter(value => value === gem).length]));
  const used = GEMS.filter(gem => counts[gem]);
  const double = gems.length === 2 && used.length === 1;
  if (!double && used.length !== gems.length) return { ok: false, error: "같은 보석은 정확히 2개를 가져갈 때만 선택할 수 있습니다." };
  if (double && game.bank[used[0]] < 4) return { ok: false, error: "같은 보석 2개는 보관소에 4개 이상 남아 있을 때만 가져갈 수 있습니다." };
  if (gems.some(gem => game.bank[gem] < counts[gem])) return { ok: false, error: "보관소에 부족한 보석이 포함되어 있습니다." };
  for (const gem of gems) {
    game.bank[gem] -= 1;
    player.tokens[gem] += 1;
  }
  const summary = used.map(gem => `${GEM_LABELS[gem]} ${counts[gem]}개`).join(", ");
  finishTurn(game, `${player.name}님이 ${summary}를 가져갔습니다.`);
  return { ok: true };
}

function findMarketCard(game, cardId) {
  for (const tier of [1, 2, 3]) {
    const index = game.market[tier].findIndex(card => card.id === String(cardId));
    if (index >= 0) return { card: game.market[tier][index], tier, index };
  }
  return null;
}

function reserveCard(game, playerId, cardId, tierValue) {
  const { player, error } = validateTurn(game, playerId);
  if (error) return { ok: false, error };
  if (player.reserved.length >= 3) return { ok: false, error: "예약 카드는 최대 3장까지 보관할 수 있습니다." };
  let card;
  let sourceTier;
  const marketSource = cardId ? findMarketCard(game, cardId) : null;
  if (marketSource) {
    ({ card, tier: sourceTier } = marketSource);
    game.market[sourceTier].splice(marketSource.index, 1);
    refillMarket(game, sourceTier);
  } else {
    sourceTier = Number(tierValue);
    if (![1, 2, 3].includes(sourceTier) || !game.decks[sourceTier].length) return { ok: false, error: "예약할 카드를 찾을 수 없습니다." };
    card = game.decks[sourceTier].pop();
  }
  player.reserved.push(card);
  let goldMessage = "";
  if (game.bank.gold > 0) {
    game.bank.gold -= 1;
    player.tokens.gold += 1;
    goldMessage = " 황금 토큰 1개도 받았습니다.";
  }
  finishTurn(game, `${player.name}님이 ${sourceTier}단계 카드를 예약했습니다.${goldMessage}`);
  return { ok: true };
}

function paymentFor(player, card) {
  const colored = emptyGems(false);
  let gold = 0;
  for (const gem of GEMS) {
    const required = Math.max(0, (card.cost[gem] || 0) - (player.bonuses[gem] || 0));
    colored[gem] = Math.min(required, player.tokens[gem] || 0);
    gold += required - colored[gem];
  }
  return { colored, gold, affordable: gold <= (player.tokens.gold || 0) };
}

function buyCard(game, playerId, cardId) {
  const { player, error } = validateTurn(game, playerId);
  if (error) return { ok: false, error };
  let card = null;
  let marketSource = findMarketCard(game, cardId);
  let reservedIndex = -1;
  if (marketSource) card = marketSource.card;
  else {
    reservedIndex = player.reserved.findIndex(candidate => candidate.id === String(cardId));
    if (reservedIndex >= 0) card = player.reserved[reservedIndex];
  }
  if (!card) return { ok: false, error: "구매할 카드를 찾을 수 없습니다." };
  const payment = paymentFor(player, card);
  if (!payment.affordable) return { ok: false, error: "카드를 구매할 보석이 부족합니다." };
  for (const gem of GEMS) {
    player.tokens[gem] -= payment.colored[gem];
    game.bank[gem] += payment.colored[gem];
  }
  player.tokens.gold -= payment.gold;
  game.bank.gold += payment.gold;
  if (marketSource) {
    game.market[marketSource.tier].splice(marketSource.index, 1);
    refillMarket(game, marketSource.tier);
  } else {
    player.reserved.splice(reservedIndex, 1);
  }
  player.cards.push(card.id);
  player.bonuses[card.bonus] += 1;
  player.score += card.points;
  finishTurn(game, `${player.name}님이 ${card.name} 카드를 구매해 ${card.points}점을 얻었습니다.`);
  return { ok: true };
}

function passTurn(game, playerId) {
  const { player, error } = validateTurn(game, playerId);
  if (error) return { ok: false, error };
  finishTurn(game, `${player.name}님이 차례를 넘겼습니다.`);
  return { ok: true };
}

function autoPlay(game) {
  const player = currentPlayer(game);
  if (!player || game.phase !== "playing") return { ok: false, error: "자동 진행할 차례가 없습니다." };
  if (game.pending?.type === 'return') {
    const gems = [...GEMS, 'gold'].flatMap(gem => Array(player.tokens[gem]).fill(gem));
    return returnGems(game, player.id, gems.slice(0, tokenTotal(player) - MAX_TOKENS));
  }
  if (game.pending?.type === 'patron') return choosePatron(game, player.id, eligiblePatrons(game, player)[0].id);
  const allowance = MAX_TOKENS - tokenTotal(player);
  const available = GEMS.filter(gem => game.bank[gem] > 0);
  if (allowance >= 1 && available.length) return takeGems(game, player.id, available.slice(0, Math.min(3, allowance)));
  return passTurn(game, player.id);
}

function publicCard(card) {
  return card ? { id: card.id, tier: card.tier, name: card.name, bonus: card.bonus, points: card.points, art: card.art, cost: { ...card.cost } } : null;
}

function stateFor(game, playerId) {
  const id = String(playerId);
  const me = playerById(game, id);
  return {
    phase: game.phase,
    targetScore: TARGET_SCORE,
    maxTokens: MAX_TOKENS,
    turnSeconds: TURN_SECONDS,
    players: game.players.map(player => ({
      id: player.id,
      name: player.name,
      score: player.score,
      tokens: { ...player.tokens },
      bonuses: { ...player.bonuses },
      cardCount: player.cards.length,
      reserveCount: player.reserved.length,
      patrons: [...player.patrons]
    })),
    bank: { ...game.bank },
    decks: Object.fromEntries([1, 2, 3].map(tier => [tier, game.decks[tier].length])),
    market: Object.fromEntries([1, 2, 3].map(tier => [tier, game.market[tier].map(publicCard)])),
    patrons: game.patrons.map(patron => ({ id: patron.id, name: patron.name, points: patron.points, requirement: { ...patron.requirement } })),
    reserved: (me?.reserved || []).map(publicCard),
    turnPlayerId: currentPlayer(game)?.id || null,
    winnerId: game.winnerId,
    winnerIds: [...(game.winnerIds || [])],
    finalRound: !!game.finalRound,
    pending: game.pending ? { type: game.pending.type, excess: Math.max(0, tokenTotal(currentPlayer(game)) - MAX_TOKENS), patronIds: eligiblePatrons(game, currentPlayer(game)).map(p => p.id) } : null,
    turnDeadline: game.turnDeadline,
    lastAction: game.lastAction,
    revision: game.revision
  };
}

module.exports = {
  CARDS,
  GEMS,
  GEM_LABELS,
  MAX_TOKENS,
  PATRONS,
  TARGET_SCORE,
  TURN_SECONDS,
  addPlayer,
  autoPlay,
  buyCard,
  returnGems,
  choosePatron,
  createGame,
  paymentFor,
  passTurn,
  removePlayer,
  reserveCard,
  resetToLobby,
  startGame,
  stateFor,
  takeGems,
  tokenTotal
};
