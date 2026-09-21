"use strict";

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const MIN_PLAYERS = 2;
const MAX_PLAYERS = 8;
const DECK_ORDER = 7; // 소수 n → 카드 n^2+n+1장, 카드당 그림 n+1개
const SYMBOLS_PER_CARD = DECK_ORDER + 1; // 8
const TOTAL_CARDS = DECK_ORDER * DECK_ORDER + DECK_ORDER + 1; // 57
const AVATAR_DIRECTORY = path.join(__dirname, "..", "classtools", "assets", "avatars");

// 유한 사영평면(order가 소수인 경우) 구성으로 도블 덱을 만든다: 카드 수 = 기호 수 = n^2+n+1,
// 카드당 기호 n+1개, 임의의 두 카드는 정확히 기호 하나만 공유한다. 공개된 수학 구성이라
// 저작권 대상이 아니며, 실제로 쓰이는 그림(symbolKeys)은 이 프로젝트 소유 아바타 이미지다.
function buildDeckIndices(n = DECK_ORDER) {
  const cards = [];
  cards.push(Array.from({ length: n + 1 }, (_, i) => i));
  for (let i = 0; i < n; i += 1) {
    const card = [0];
    for (let j = 0; j < n; j += 1) card.push(n + 1 + n * i + j);
    cards.push(card);
  }
  for (let i = 0; i < n; i += 1) {
    for (let j = 0; j < n; j += 1) {
      const card = [i + 1];
      for (let k = 0; k < n; k += 1) card.push(n + 1 + n * k + ((i * k + j) % n));
      cards.push(card);
    }
  }
  return cards;
}

const DECK_INDICES = Object.freeze(buildDeckIndices(DECK_ORDER).map(card => Object.freeze(card)));

function loadSymbolKeys() {
  const files = fs.readdirSync(AVATAR_DIRECTORY)
    .filter(name => name.toLowerCase().endsWith(".webp"))
    .sort((left, right) => left.localeCompare(right, "en"));
  if (files.length < TOTAL_CARDS) {
    throw new Error(`도블 카드에 필요한 그림(${TOTAL_CARDS}개)보다 아바타 그림이 적습니다.`);
  }
  return files;
}

const ALL_SYMBOL_KEYS = Object.freeze(loadSymbolKeys());

function randomInt(maximum) {
  return crypto.randomInt(maximum);
}

function shuffle(values, pick = randomInt) {
  const result = [...values];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const other = pick(index + 1);
    [result[index], result[other]] = [result[other], result[index]];
  }
  return result;
}

// 그림 57개를 매 판 무작위로 골라 도블 특유의 "겹치는 그림 정확히 1개" 구조를 카드에 입힌다.
function buildDeck(pick) {
  const symbolKeys = shuffle(ALL_SYMBOL_KEYS, pick).slice(0, TOTAL_CARDS);
  const cards = shuffle(DECK_INDICES, pick).map(indices => shuffle(indices.map(index => symbolKeys[index]), pick));
  return cards;
}

function sharedSymbol(cardA, cardB) {
  const setB = new Set(cardB);
  return cardA.find(symbol => setB.has(symbol)) || null;
}

// 오답 페널티 길이. 그림 8개를 순서대로 눌러보는 것을 막을 만큼은 길고, 수업 흐름을
// 끊지 않을 만큼은 짧게 잡았다.
const WRONG_GUESS_PENALTY_MS = 3000;

const MODES = Object.freeze(["tower", "catalog"]);
const MODE_LABELS = Object.freeze({ tower: "타워", catalog: "카탈로그" });
const DEFAULT_MODE = "tower";

function createPlayer(id, name) {
  return {
    id: String(id),
    name: String(name || "플레이어").trim() || "플레이어",
    stack: [], // (타워) 앞으로 뒤집을 카드들, [0]이 다음 카드
    finishedAt: null, // (타워) 자기 카드를 다 없앤 순서 (1등, 2등, ...)
    collected: [], // (카탈로그) 맞혀서 모은 카드들
    lockedRound: -1, // 오답을 낸 시점의 actionNumber. 그 카드 조합에서만 페널티가 유효하다.
    lockedUntil: 0 // 그 오답 페널티가 풀리는 시각(ms).
  };
}

function createGame(hostId, hostName) {
  return {
    phase: "lobby",
    mode: DEFAULT_MODE,
    players: [createPlayer(hostId, hostName || "방장")],
    centerPile: [], // (타워) 맨 끝이 현재 중앙 카드
    drawPile: [], // (카탈로그) 아직 안 뒤집은 카드 더미
    centerCard: null, // (카탈로그) 현재 기준 카드
    lastMatch: null, // 방금 맞힌 그림 { symbol, by, at } — 클라이언트가 정답 연출을 넣을 때 씀
    winner: null,
    log: "플레이어를 기다리는 중입니다.",
    actionNumber: 0
  };
}

// 대기실에서만 방장이 규칙을 바꿀 수 있다.
function setMode(game, mode) {
  if (game.phase !== "lobby") return { ok: false, error: "대기실에서만 규칙을 바꿀 수 있습니다." };
  if (!MODES.includes(mode)) return { ok: false, error: "알 수 없는 규칙입니다." };
  game.mode = mode;
  game.log = `규칙이 "${MODE_LABELS[mode]}"(으)로 설정되었습니다.`;
  return { ok: true };
}

function addPlayer(game, id, name) {
  const safeId = String(id);
  if (game.phase !== "lobby" || game.players.some(player => player.id === safeId) || game.players.length >= MAX_PLAYERS) return false;
  game.players.push(createPlayer(safeId, name));
  game.log = `${String(name || "플레이어").trim() || "플레이어"}님이 입장했습니다.`;
  return true;
}

function removePlayer(game, id) {
  const safeId = String(id);
  const before = game.players.length;
  game.players = game.players.filter(player => player.id !== safeId);
  return game.players.length !== before;
}

function playerById(game, id) {
  return game.players.find(player => player.id === String(id));
}

function canStart(game) {
  return game.players.length >= MIN_PLAYERS && game.players.length <= MAX_PLAYERS;
}

// 타워: 카드 57장 중 1장을 중앙에 놓고, 나머지를 인원수만큼 최대한 고르게 나눈다.
function startTower(game, deck, players) {
  const centerCard = deck.pop();
  players.forEach(player => { player.stack = []; player.finishedAt = null; player.lockedRound = -1; player.lockedUntil = 0; });
  deck.forEach((card, index) => players[index % players.length].stack.push(card));
  game.centerPile = [centerCard];
  game.drawPile = [];
  game.centerCard = null;
  game.log = "시작! 자기 카드와 중앙 카드에서 겹치는 그림을 먼저 찾으세요.";
}

// 카탈로그: 카드 1장을 기준 카드로 놓고, 나머지는 모두가 함께 보는 더미로 쌓는다.
function startCatalog(game, deck, players) {
  players.forEach(player => { player.collected = []; player.lockedRound = -1; player.lockedUntil = 0; });
  game.centerCard = deck.pop();
  game.drawPile = deck;
  game.centerPile = [];
  game.log = "시작! 기준 카드와 새로 뒤집힌 카드에서 겹치는 그림을 먼저 찾으세요.";
}

function startGame(game, pick = randomInt) {
  if (game.phase === "playing") return { ok: false, error: "이미 시작한 게임입니다." };
  if (!canStart(game)) return { ok: false, error: `${MIN_PLAYERS}~${MAX_PLAYERS}명이 필요합니다.` };

  const deck = buildDeck(pick);
  const players = shuffle(game.players, pick);
  if (game.mode === "catalog") startCatalog(game, deck, players);
  else startTower(game, deck, players);

  game.winner = null;
  game.phase = "playing";
  game.actionNumber += 1;
  return { ok: true };
}

function checkTowerFinish(game, player) {
  if (player.stack.length > 0 || player.finishedAt !== null) return;
  const finishedCount = game.players.filter(p => p.finishedAt !== null).length;
  player.finishedAt = finishedCount + 1;
  if (player.finishedAt === 1) {
    game.winner = player.id;
    game.phase = "gameEnd";
    game.log = `${player.name}님이 카드를 가장 먼저 다 내고 승리했습니다!`;
  }
}

// 타워 규칙: 내 카드와 중앙 카드에 공통으로 있는 그림을 지목한다.
function claimTower(game, player, safeSymbol) {
  if (player.finishedAt !== null) return { ok: false, error: "이미 카드를 다 냈습니다." };
  if (player.stack.length === 0) return { ok: false, error: "낼 카드가 없습니다." };

  const myCard = player.stack[0];
  const centerCard = game.centerPile[game.centerPile.length - 1];
  const actualMatch = sharedSymbol(myCard, centerCard);
  if (!actualMatch || safeSymbol !== actualMatch) {
    return { ok: false, wrongGuess: true, error: "그림이 서로 겹치지 않습니다." };
  }

  player.stack.shift();
  game.centerPile.push(myCard);
  game.actionNumber += 1;
  game.lastMatch = { symbol: actualMatch, by: player.id, at: game.actionNumber };
  checkTowerFinish(game, player);
  if (game.phase !== "gameEnd") {
    game.log = `${player.name}님이 그림을 맞혀 카드를 냈습니다. (남은 카드 ${player.stack.length}장)`;
  }
  return { ok: true };
}

// 카탈로그 규칙: 기준 카드와 더미 맨 위 카드에 공통으로 있는 그림을 지목한다.
// 맞히면 기준 카드를 가져가고, 방금 뒤집힌 카드가 새 기준 카드가 된다.
function claimCatalog(game, player, safeSymbol) {
  if (game.drawPile.length === 0) return { ok: false, error: "더 이상 뒤집을 카드가 없습니다." };

  const challenger = game.drawPile[game.drawPile.length - 1];
  const actualMatch = sharedSymbol(game.centerCard, challenger);
  if (!actualMatch || safeSymbol !== actualMatch) {
    return { ok: false, wrongGuess: true, error: "그림이 서로 겹치지 않습니다." };
  }

  player.collected.push(game.centerCard);
  game.centerCard = challenger;
  game.drawPile.pop();
  game.actionNumber += 1;
  game.lastMatch = { symbol: actualMatch, by: player.id, at: game.actionNumber };

  if (game.drawPile.length === 0) {
    const best = game.players.reduce((top, p) => (!top || p.collected.length > top.collected.length ? p : top), null);
    game.winner = best.id;
    game.phase = "gameEnd";
    game.log = `카드가 모두 소진되었습니다. ${best.name}님이 ${best.collected.length}장으로 승리했습니다!`;
  } else {
    game.log = `${player.name}님이 카드를 획득했습니다. (누적 ${player.collected.length}장)`;
  }
  return { ok: true };
}

// 남은 오답 페널티(ms). 카드 조합이 그대로이고(= actionNumber가 그대로) 페널티 시간도
// 아직 안 지났을 때만 0보다 크다.
function penaltyLeft(game, player, at) {
  if (!player || player.lockedRound !== game.actionNumber) return 0;
  return Math.max(0, player.lockedUntil - at);
}

// 아직 살아 있는 페널티 중 가장 먼저 끝나는 시각. 하나도 없으면 0. 서버가 그 순간에
// 맞춰 상태를 다시 방송하는 데 쓴다.
function nextPenaltyEndsAt(game, now = Date.now) {
  const at = now();
  let soonest = 0;
  for (const player of game.players) {
    if (penaltyLeft(game, player, at) <= 0) continue;
    if (soonest === 0 || player.lockedUntil < soonest) soonest = player.lockedUntil;
  }
  return soonest;
}

// 플레이어가 "겹치는 그림"을 지목한다. 서버가 실제로 두 카드에 그 그림이 모두
// 있는지 검증하므로 클라이언트를 신뢰하지 않는다. 오답을 내면 같은 카드 조합에서
// 잠깐 못 찍는다 — 그림 8개를 순서대로 마구 눌러보는 것을 막는 페널티다.
// 페널티는 다음 정답이 나와 카드가 바뀌면 곧바로 풀리고, 카드가 그대로여도
// WRONG_GUESS_PENALTY_MS가 지나면 풀린다. 시간 제한 없이 "다음 정답이 나올 때까지"로만
// 걸면 남아 있는 사람이 모두 오답을 낸 순간 아무도 찍을 수 없어 게임이 그대로 멈춘다
// (2명이면 둘 다 틀리는 즉시).
function claim(game, playerId, symbolKey, now = Date.now) {
  if (game.phase !== "playing") return { ok: false, error: "진행 중인 게임이 없습니다." };
  const player = playerById(game, playerId);
  if (!player) return { ok: false, error: "참가자를 찾을 수 없습니다." };
  const at = now();
  const waiting = penaltyLeft(game, player, at);
  if (waiting > 0) {
    return { ok: false, error: `오답 페널티 중입니다. ${Math.ceil(waiting / 1000)}초 뒤에 다시 찍을 수 있습니다.` };
  }
  const safeSymbol = String(symbolKey || "");
  const result = game.mode === "catalog" ? claimCatalog(game, player, safeSymbol) : claimTower(game, player, safeSymbol);
  if (result.wrongGuess) {
    player.lockedRound = game.actionNumber;
    player.lockedUntil = at + WRONG_GUESS_PENALTY_MS;
  }
  return result;
}

function newGame(game, pick = randomInt) {
  if (game.phase !== "gameEnd") return { ok: false, error: "게임이 끝난 뒤에만 다시 시작할 수 있습니다." };
  return startGame(game, pick);
}

function resetToLobby(game, notice = "대기실로 돌아왔습니다.") {
  game.phase = "lobby";
  game.centerPile = [];
  game.drawPile = [];
  game.centerCard = null;
  game.lastMatch = null;
  game.winner = null;
  game.players.forEach(player => { player.stack = []; player.finishedAt = null; player.collected = []; player.lockedRound = -1; player.lockedUntil = 0; });
  game.log = notice;
  game.actionNumber += 1;
}

function stateFor(game, viewerId, now = Date.now) {
  const viewer = playerById(game, String(viewerId));
  const isCatalog = game.mode === "catalog";
  const penaltyMs = penaltyLeft(game, viewer, now());
  return {
    phase: game.phase,
    mode: game.mode,
    players: game.players.map(player => ({
      id: player.id,
      name: player.name,
      cardsLeft: player.stack.length,
      finishedAt: player.finishedAt,
      collectedCount: player.collected.length
    })),
    myCard: !isCatalog && viewer && viewer.stack.length > 0 ? viewer.stack[0] : null,
    myCardsLeft: viewer ? viewer.stack.length : 0,
    myFinishedAt: viewer ? viewer.finishedAt : null,
    myLocked: penaltyMs > 0,
    myLockedMs: penaltyMs,
    centerCard: isCatalog ? game.centerCard : (game.centerPile.length > 0 ? game.centerPile[game.centerPile.length - 1] : null),
    challengerCard: isCatalog && game.drawPile.length > 0 ? game.drawPile[game.drawPile.length - 1] : null,
    drawPileCount: game.drawPile.length,
    lastMatch: game.lastMatch,
    winner: game.winner,
    log: game.log,
    actionNumber: game.actionNumber
  };
}

module.exports = {
  MIN_PLAYERS,
  MAX_PLAYERS,
  WRONG_GUESS_PENALTY_MS,
  SYMBOLS_PER_CARD,
  TOTAL_CARDS,
  MODES,
  MODE_LABELS,
  DEFAULT_MODE,
  createGame,
  addPlayer,
  removePlayer,
  canStart,
  setMode,
  startGame,
  claim,
  nextPenaltyEndsAt,
  newGame,
  resetToLobby,
  stateFor,
  shuffle,
  buildDeckIndices,
  sharedSymbol
};
