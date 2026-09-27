// Rule reference and edition notes are documented in README.md.
// PROVISIONAL: duplicate-value counts in raids 2 and 4 need an unobstructed physical-component check.
export const ROUND_NAMES = ['드로잉', '조각', '골동품', '회화'];
export const CARD_NAMES = { dog: '경비견', thief: '도둑', boss: '보스' };
export const TILE_LAYOUTS = [
  [[0,2],[1,0],[2,0],[3,0],[3,0],[3,0],[4,0],[5,0],['boss',0]],
  [[0,2],[1,1],[2,0],[3,0],[3,0],[3,0],[4,0],[5,0],['boss',0]],
  [[0,2],[1,1],[2,1],[3,0],[3,0],[4,0],[4,0],['boss',0],['boss',0]],
  [[0,2],[1,1],[2,1],[3,0],[3,0],[3,0],[4,1],[5,1],['boss',0]],
];
export const cardLabel = card => card.type === 'number' ? `${card.value} 카드` : `${CARD_NAMES[card.type]} 카드`;
export const tileLabel = tile => tile.kind === 'boss' ? '보스' : `${tile.value}점 전리품`;
export const points = tiles => tiles.reduce((sum, tile) => sum + tile.value, 0);
export const alibis = tiles => tiles.reduce((sum, tile) => sum + tile.alibi, 0);
export function makeTiles(round) {
  return TILE_LAYOUTS[round - 1].map(([value, alibi], i) => ({ id: `r${round}-${i}`, round, kind: value === 'boss' ? 'boss' : 'number', value: value === 'boss' ? 5 : value, alibi }));
}
export function makeDeck() {
  const cards = [];
  for (let value = 0; value < 6; value++) for (let i = 0; i < 6; i++) cards.push({ id: `n${value}-${i}`, type: 'number', value });
  for (const [type, count] of [['boss',6],['dog',6],['thief',7]]) for (let i = 0; i < count; i++) cards.push({ id: `${type}-${i}`, type });
  return cards;
}
function random(state) {
  state.seed = (Math.imul(1664525, state.seed) + 1013904223) >>> 0;
  return state.seed / 4294967296;
}
function shuffle(cards, state) {
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(random(state) * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return cards;
}
function log(state, message) {
  state.log.push(message);
  state.log = state.log.slice(-30);
}
export function newGame({ names, mode = 'bots', starter = 0, seed = Date.now() >>> 0 }) {
  if (!Array.isArray(names) || names.length < 2 || names.length > 5) throw Error('2~5명이 필요해요.');
  if (!['bots', 'local'].includes(mode)) throw Error('플레이 방식을 선택해 주세요.');
  if (!Number.isInteger(starter) || starter < 0 || starter >= names.length) throw Error('첫 차례를 선택해 주세요.');
  const state = {
    version: 1, seed, mode, firstStarter: starter, round: 1, phase: 'turn', current: starter, dogOwner: null,
    deck: [], discard: [], center: makeTiles(1), removed: [], pending: null,
    turn: 0, roundTurns: 0, roundSummary: [], result: null, log: [],
    players: names.map((name, i) => ({ name: String(name).trim().slice(0,12) || `플레이어 ${i + 1}`, bot: mode === 'bots' && i !== 0, hand: [], loot: [], bank: [] })),
  };
  state.deck = shuffle(makeDeck(), state);
  for (let i = 0; i < 5; i++) for (const player of state.players) player.hand.push(state.deck.pop());
  log(state, `1라운드 시작 · ${state.players[starter].name} 차례예요.`);
  return state;
}
export function legalTargets(state, cardId) {
  if (state.phase !== 'turn') return [];
  const card = state.players[state.current].hand.find(c => c.id === cardId);
  if (!card || card.type === 'dog') return [];
  const matches = tile => card.type === 'thief' || (card.type === 'boss' ? tile.kind === 'boss' : tile.kind === 'number' && tile.value === card.value);
  const middle = state.center.filter(matches).map(tile => ({ tileId: tile.id, owner: null }));
  if (card.type === 'thief' || (card.type === 'number' && middle.length)) return middle;
  const other = state.players.flatMap((player, i) => i === state.current ? [] : player.loot.filter(matches).map(tile => ({ tileId: tile.id, owner: i })));
  return [...middle, ...other];
}
function draw(state, player) {
  if (!state.deck.length) {
    state.deck = shuffle(state.discard.splice(0), state);
    log(state, '버린 카드를 섞어 새 카드 더미를 만들었어요.');
  }
  if (state.deck.length) player.hand.push(state.deck.pop());
}
function takeTile(state, owner, tileId) {
  const source = owner === null ? state.center : state.players[owner].loot;
  const index = source.findIndex(tile => tile.id === tileId);
  if (index < 0) throw Error('이미 이동한 전리품이에요.');
  const [tile] = source.splice(index, 1);
  state.players[state.current].loot.push(tile);
  const from = owner === null ? '가운데에서' : `${state.players[owner].name}에게서`;
  log(state, `${state.players[state.current].name} · ${from} ${tileLabel(tile)}${tile.alibi ? ` (알리바이 ${tile.alibi})` : ''} 획득!`);
}
export function scoreGame(state) {
  const totals = state.players.map((player, index) => ({ index, name: player.name, gross: points(player.bank), alibi: alibis(player.bank) }));
  const min = Math.min(...totals.map(row => row.alibi));
  const two = totals.length === 2;
  const equal = totals.every(row => row.alibi === min);
  const result = totals.map(row => {
    const penalty = two && !equal && row.alibi === min ? 10 : 0;
    return { ...row, eliminated: !two && row.alibi === min, penalty, score: row.gross - penalty, winner: false };
  });
  const eligible = result.filter(row => !row.eliminated).sort((a,b) => b.score-a.score || b.alibi-a.alibi);
  for (const row of eligible) row.winner = row.score === eligible[0].score && row.alibi === eligible[0].alibi;
  return result;
}
function finishRound(state) {
  state.roundSummary = state.players.map(player => {
    const canKeepBoss = player.loot.some(tile => tile.kind === 'number' && (tile.value === 4 || tile.value === 5));
    const lost = canKeepBoss ? [] : player.loot.filter(tile => tile.kind === 'boss');
    const kept = player.loot.filter(tile => !lost.includes(tile));
    state.removed.push(...lost);
    player.bank.push(...kept);
    player.loot = [];
    return { name: player.name, points: points(kept), alibi: alibis(kept), lostBosses: lost.length, tiles: kept };
  });
  log(state, `${state.round}라운드 종료 · 전리품을 안전하게 보관했어요.`);
  state.nextStarter = state.dogOwner ?? (state.current + 1) % state.players.length;
  state.phase = state.round === 4 ? 'gameover' : 'round';
  if (state.phase === 'gameover') state.result = scoreGame(state);
}
function finishTurn(state) {
  draw(state, state.players[state.current]);
  state.turn++;
  state.roundTurns++;
  state.pending = null;
  if (!state.center.length) finishRound(state);
  else {
    state.current = (state.current + 1) % state.players.length;
    state.phase = 'turn';
  }
}
// Every action is validated against the current state before changing anything.
export function playCard(original, cardId, targetId = null) {
  if (original.phase !== 'turn') throw Error('지금은 카드를 낼 수 없어요.');
  const oldPlayer = original.players[original.current];
  const cardIndex = oldPlayer.hand.findIndex(card => card.id === cardId);
  if (cardIndex < 0) throw Error('손에 없는 카드예요.');
  const targets = legalTargets(original, cardId);
  const target = targets.find(option => option.tileId === targetId);
  if ((targets.length && !target) || (!targets.length && targetId !== null)) throw Error('가져올 수 있는 전리품을 선택해 주세요.');
  const state = structuredClone(original);
  const player = state.players[state.current];
  const [card] = player.hand.splice(cardIndex, 1);
  state.discard.push(card);
  if (card.type === 'dog') {
    state.dogOwner = state.current;
    log(state, `${player.name} · 경비견을 데려왔어요.`);
  } else if (target) {
    if (target.owner !== null && state.dogOwner === target.owner) {
      state.phase = 'defense';
      state.pending = { attacker: state.current, defender: target.owner, tileId: target.tileId };
      log(state, `${player.name} · ${state.players[target.owner].name}의 전리품을 노려요. 경비견으로 막을까요?`);
      return state;
    }
    takeTile(state, target.owner, target.tileId);
  } else log(state, `${player.name} · ${cardLabel(card)}를 내고 새 카드를 뽑았어요.`);
  finishTurn(state);
  return state;
}
export function resolveDefense(original, block) {
  if (original.phase !== 'defense' || !original.pending) throw Error('지금은 방어할 차례가 아니에요.');
  const state = structuredClone(original);
  const { defender, attacker, tileId } = state.pending;
  if (block) {
    state.dogOwner = attacker;
    log(state, `${state.players[defender].name} · 전리품을 지키고 ${state.players[attacker].name}에게 경비견을 넘겼어요.`);
  } else takeTile(state, defender, tileId);
  finishTurn(state);
  return state;
}
export function nextRound(original) {
  if (original.phase !== 'round' || original.round >= 4) throw Error('다음 라운드를 시작할 수 없어요.');
  const state = structuredClone(original);
  state.round++;
  state.roundTurns = 0;
  state.center = makeTiles(state.round);
  state.current = state.nextStarter;
  state.phase = 'turn';
  log(state, `${state.round}라운드 시작 · ${state.players[state.current].name} 차례예요.`);
  return state;
}
export function chooseBotAction(state) {
  const player = state.players[state.current];
  const ownAlibis = alibis([...player.bank, ...player.loot]);
  const options = [];
  for (const card of player.hand) {
    const targets = legalTargets(state, card.id);
    if (!targets.length) options.push({ cardId: card.id, tileId: null, weight: card.type === 'dog' && state.dogOwner !== state.current ? 2 + points(player.loot) * .15 : -2 });
    for (const target of targets) {
      const tile = (target.owner === null ? state.center : state.players[target.owner].loot).find(t => t.id === target.tileId);
      const hasHigh = player.loot.some(t => t.kind === 'number' && t.value >= 4);
      let weight = tile.kind === 'boss' && !hasHigh ? 1.5 : tile.value;
      weight += tile.alibi * (ownAlibis < state.round + 1 ? 3.5 : 1.3);
      if (tile.kind === 'number' && tile.value >= 4 && player.loot.some(t => t.kind === 'boss') && !hasHigh) weight += 5;
      if (target.owner !== null && state.dogOwner === target.owner) weight *= .35;
      if (target.owner === null) weight += 1 + Math.min(10, state.roundTurns * .22);
      if (card.type === 'thief') weight -= .7;
      options.push({ cardId: card.id, tileId: target.tileId, weight });
    }
  }
  options.sort((a,b) => b.weight-a.weight);
  return options[0];
}
export function botShouldBlock(state) {
  const player = state.players[state.pending.defender];
  const tile = player.loot.find(t => t.id === state.pending.tileId);
  return tile.alibi > 0 || tile.value >= 3 || player.loot.length === 1;
}
export function validSave(state) {
  try {
    if (state?.version !== 1 || !['bots','local'].includes(state.mode) || !['turn','defense','round','gameover'].includes(state.phase)) return false;
    if (!Number.isInteger(state.round) || state.round < 1 || state.round > 4 || state.players.length < 2 || state.players.length > 5) return false;
    if (!Number.isInteger(state.current) || !state.players[state.current]) return false;
    const canonical = new Map(makeDeck().map(card => [card.id, JSON.stringify(card)]));
    const cards = [...state.deck, ...state.discard, ...state.players.flatMap(p => p.hand)];
    if (cards.length !== 55 || new Set(cards.map(c => c.id)).size !== 55 || cards.some(c => canonical.get(c.id) !== JSON.stringify(c))) return false;
    const tileMap = new Map(Array.from({ length: state.round }, (_,i) => makeTiles(i+1)).flat().map(t => [t.id, JSON.stringify(t)]));
    const tiles = [...state.center, ...state.removed, ...state.players.flatMap(p => [...p.bank, ...p.loot])];
    if (tiles.length !== state.round*9 || new Set(tiles.map(t => t.id)).size !== tiles.length || tiles.some(t => tileMap.get(t.id) !== JSON.stringify(t))) return false;
    if (state.dogOwner !== null && !state.players[state.dogOwner]) return false;
    if (state.phase === 'defense' && (!state.pending || state.current !== state.pending.attacker || state.dogOwner !== state.pending.defender || !state.players[state.pending.defender].loot.some(t => t.id === state.pending.tileId))) return false;
    if (state.players.some((p,i) => typeof p.name !== 'string' || p.name.length > 12 || p.bot !== (state.mode === 'bots' && i !== 0) || p.hand.length !== (state.phase === 'defense' && i === state.current ? 4 : 5))) return false;
    if (!Array.isArray(state.log) || state.log.some(v => typeof v !== 'string')) return false;
    if (['round','gameover'].includes(state.phase) && (state.center.length || !Array.isArray(state.roundSummary) || state.roundSummary.length !== state.players.length)) return false;
    if (state.phase === 'gameover') state.result = scoreGame(state);
    return true;
  } catch { return false; }
}
