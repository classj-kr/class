"use strict";

const crypto = require("crypto");
const TURN_SECONDS = 25;
const ROUND_BREAK_SECONDS = 3;
const HAND_SIZE = 5;
const STARTING_FUSES = 3;
const LIMIT = 77;
const MIN_PLAYERS = 2;
const MAX_PLAYERS = 8;
const RULES_VERSION = 2;
const randomInt = max => crypto.randomInt(max);

function shuffle(items, pick = randomInt) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const chosen = pick(index + 1);
    [result[index], result[chosen]] = [result[chosen], result[index]];
  }
  return result;
}

// AMIGO rules v3.2: 55 cards. A 0 holds the total; it never resets it.
function buildDeck() {
  const deck = [];
  const numbers = [[0, 4], [-10, 4], [10, 8], ...Array.from({ length: 8 }, (_, i) => [i + 2, 3]),
    ...[11, 22, 33, 44, 55, 66, 76].map(value => [value, 1])];
  for (const [value, copies] of numbers) {
    for (let copy = 1; copy <= copies; copy++) deck.push({ id: `number-${value}-${copy}`, kind: "number", value });
  }
  for (const kind of ["reverse", "double"]) {
    for (let copy = 1; copy <= 4; copy++) deck.push({ id: `${kind}-${copy}`, kind, value: null });
  }
  return deck;
}

function cleanName(value, fallback) { return String(value || "").trim().slice(0, 12) || fallback; }
function createGame(hostId, hostName) {
  const game = { players: [{ id: String(hostId), name: cleanName(hostName, "방장") }], actionNumber: -1 };
  resetToLobby(game, "플레이어를 기다리고 있습니다.");
  return game;
}
function addPlayer(game, playerId, name) {
  const id = String(playerId);
  if (game.phase !== "lobby") return { ok: false, error: "이미 시작한 게임입니다." };
  if (game.players.some(player => player.id === id)) return { ok: true };
  if (game.players.length >= MAX_PLAYERS) return { ok: false, error: "방이 가득 찼습니다." };
  game.players.push({ id, name: cleanName(name, `플레이어 ${game.players.length + 1}`) });
  return { ok: true };
}
function removePlayer(game, playerId) {
  const id = String(playerId);
  game.players = game.players.filter(player => player.id !== id);
  delete game.hands[id];
  delete game.fuses[id];
}
function resetToLobby(game, message = "대기실로 돌아왔습니다.") {
  Object.assign(game, {
    rulesVersion: RULES_VERSION, phase: "lobby", hands: {}, fuses: {}, deck: [], discard: [], total: 0,
    direction: 1, turnIndex: 0, roundStarterIndex: 0, winnerId: null, round: 0, lastCard: null,
    lastEvent: null, lastAction: message, lastActionKind: "lobby", turnDeadline: null, roundDeadline: null,
    cardsRemaining: 1, cardsPlayed: 0, actionNumber: (game.actionNumber || 0) + 1
  });
  return { ok: true };
}
// Zero chips means swimming. Only the NEXT penalty eliminates a player (-1).
function isAlive(game, playerId) { return Number.isFinite(game.fuses[playerId]) && game.fuses[playerId] >= 0; }
function activePlayer(game) { return game.players[game.turnIndex] || null; }
function nextAliveIndex(game, fromIndex, direction = game.direction) {
  for (let step = 1; step <= game.players.length; step++) {
    const index = ((fromIndex + direction * step) % game.players.length + game.players.length) % game.players.length;
    if (isAlive(game, game.players[index].id)) return index;
  }
  return fromIndex;
}
function drawCard(game, playerId, pick) {
  if (!game.deck.length && game.discard.length > 1) {
    const top = game.discard.pop();
    game.deck = shuffle(game.discard, pick);
    game.discard = [top];
  }
  const card = game.deck.pop();
  if (card) game.hands[playerId].push(card);
}
function dealRound(game, pick) {
  game.phase = "playing";
  game.deck = shuffle(buildDeck(), pick);
  game.discard = [];
  game.hands = Object.fromEntries(game.players.map(player => [player.id, []]));
  game.total = 0;
  game.direction = 1;
  game.turnIndex = game.roundStarterIndex;
  game.cardsRemaining = 1;
  game.cardsPlayed = 0;
  game.lastCard = null;
  game.lastEvent = null;
  game.roundDeadline = null;
  for (let i = 0; i < HAND_SIZE; i++) {
    for (const player of game.players) if (isAlive(game, player.id)) drawCard(game, player.id, pick);
  }
  game.turnDeadline = Date.now() + TURN_SECONDS * 1000;
  game.lastAction = `${game.round}라운드 · 새 카드 5장! ${activePlayer(game).name}님부터 시작합니다.`;
  game.lastActionKind = "start";
}
function startMatch(game, pick = randomInt) {
  if (!["lobby", "finished"].includes(game.phase)) return { ok: false, error: "지금은 새 게임을 시작할 수 없습니다." };
  if (game.players.length < MIN_PLAYERS || game.players.length > MAX_PLAYERS) return { ok: false, error: "2명부터 8명까지 모여야 시작할 수 있습니다." };
  game.rulesVersion = RULES_VERSION;
  game.fuses = Object.fromEntries(game.players.map(player => [player.id, STARTING_FUSES]));
  game.winnerId = null;
  game.round = 1;
  game.roundStarterIndex = 0;
  dealRound(game, pick);
  game.actionNumber++;
  return { ok: true };
}
function nextRound(game, pick = randomInt) {
  if (game.phase !== "roundEnd") return { ok: false, error: "라운드가 끝나지 않았습니다." };
  // Round starters rotate clockwise regardless of the previous playing direction.
  game.roundStarterIndex = nextAliveIndex(game, game.roundStarterIndex, 1);
  game.round++;
  dealRound(game, pick);
  game.actionNumber++;
  return { ok: true };
}
function totalAfter(card, currentTotal) { return card.kind === "number" ? currentTotal + card.value : currentTotal; }
function isPenalty(total) { return total >= LIMIT || (total > 0 && total % 11 === 0); }
function cardLabel(card) {
  return card.kind === "number" ? `${card.value > 0 ? "+" : ""}${card.value}` : { reverse: "방향 전환", double: "×2" }[card.kind];
}
function canPlay(game, card) { return !(card.kind === "double" && game.cardsRemaining === 2 && game.cardsPlayed === 0); }
function playCard(game, playerId, message = {}, pick = randomInt) {
  if (game.phase !== "playing") return { ok: false, error: "지금은 카드를 낼 수 없습니다." };
  const actor = activePlayer(game);
  if (!actor || actor.id !== String(playerId)) return { ok: false, error: "현재 차례가 아닙니다." };
  if (!isAlive(game, actor.id)) return { ok: false, error: "이미 탈락했습니다." };
  const hand = game.hands[actor.id];
  const index = hand.findIndex(card => card.id === String(message.cardId || ""));
  if (index < 0) return { ok: false, error: "내 손에 없는 카드입니다." };
  if (!canPlay(game, hand[index])) return { ok: false, error: "×2를 받으면 첫 장에는 ×2를 낼 수 없습니다. 두 번째 장에는 낼 수 있어요." };

  const [card] = hand.splice(index, 1);
  game.discard.push(card);
  game.lastCard = card;
  const before = game.total;
  game.total = totalAfter(card, before);
  game.cardsRemaining--;
  game.cardsPlayed++;
  if (card.kind === "reverse") game.direction *= -1;
  const exploded = game.total >= LIMIT;
  const penalty = isPenalty(game.total);
  if (penalty) game.fuses[actor.id]--;
  const eliminated = !isAlive(game, actor.id);
  game.lastEvent = { actorId: actor.id, before, after: game.total, penalty, exploded, eliminated };
  const consequence = eliminated ? "탈락" : game.fuses[actor.id] === 0 ? "칩 −1 · 마지막 기회!" : "칩 −1";
  game.lastAction = `${actor.name} · ${cardLabel(card)} → ${game.total}${penalty ? ` · ${exploded ? "폭발" : "벌칙 합계"}! ${consequence}` : ""}`;
  if (card.kind === "reverse") game.lastAction += " · 방향 반대로!";
  game.lastActionKind = exploded ? "explosion" : penalty ? "penalty" : card.kind;
  game.actionNumber++;

  const survivors = game.players.filter(player => isAlive(game, player.id));
  if (survivors.length <= 1) {
    game.phase = "finished";
    game.winnerId = survivors[0]?.id || null;
    game.turnDeadline = null;
    game.roundDeadline = null;
    game.lastAction += ` · ${survivors[0]?.name || "생존자"} 승리!`;
  } else if (exploded) {
    // Keep the final sum visible before replacing every hand and restarting at zero.
    game.phase = "roundEnd";
    game.turnDeadline = null;
    game.roundDeadline = Date.now() + ROUND_BREAK_SECONDS * 1000;
  } else if (game.cardsRemaining > 0 && !eliminated) {
    game.lastAction += " · 한 장 더 낸 뒤 2장을 보충합니다.";
    game.turnDeadline = Date.now() + TURN_SECONDS * 1000;
  } else {
    if (!eliminated) for (let i = 0; i < game.cardsPlayed; i++) drawCard(game, actor.id, pick);
    game.turnIndex = nextAliveIndex(game, game.turnIndex);
    game.cardsRemaining = card.kind === "double" ? 2 : 1;
    game.cardsPlayed = 0;
    game.turnDeadline = Date.now() + TURN_SECONDS * 1000;
    if (card.kind === "double") game.lastAction += ` · ${activePlayer(game).name}님은 두 장!`;
  }
  return { ok: true, exploded, penalty, eliminated };
}
function autoPlay(game, pick = randomInt) {
  if (game.phase !== "playing") return { ok: false, error: "진행 중인 게임이 없습니다." };
  const actor = activePlayer(game);
  const hand = (game.hands[actor?.id] || []).filter(card => canPlay(game, card));
  if (!hand.length) return { ok: false, error: "자동으로 낼 카드가 없습니다." };
  const risk = card => {
    const total = totalAfter(card, game.total);
    return (total >= LIMIT ? 2000 : isPenalty(total) ? 1000 : 0) + total;
  };
  hand.sort((a, b) => risk(a) - risk(b));
  const result = playCard(game, actor.id, { cardId: hand[0].id }, pick);
  if (result.ok) game.lastAction += " · 시간 초과 자동 선택";
  return result;
}
function stateFor(game, viewerId) {
  const viewer = String(viewerId);
  const ownHand = game.phase !== "lobby" && isAlive(game, viewer) ? game.hands[viewer] || [] : [];
  return {
    phase: game.phase, round: game.round, limit: LIMIT, total: game.total, direction: game.direction,
    turnPlayerId: game.phase === "playing" ? activePlayer(game)?.id || null : null,
    turnCardsRemaining: game.cardsRemaining, turnCardsPlayed: game.cardsPlayed,
    nextPlayerId: game.phase === "playing" ? game.players[nextAliveIndex(game, game.turnIndex)]?.id || null : null,
    players: game.players.map(player => ({
      id: player.id, name: player.name, fuses: Math.max(0, game.fuses[player.id] || 0),
      swimming: game.phase !== "lobby" && game.fuses[player.id] === 0,
      eliminated: game.phase !== "lobby" && !isAlive(game, player.id),
      handCount: isAlive(game, player.id) ? (game.hands[player.id] || []).length : 0
    })),
    hand: [...ownHand],
    legalCardIds: game.phase === "playing" && activePlayer(game)?.id === viewer ? ownHand.filter(card => canPlay(game, card)).map(card => card.id) : [],
    deckCount: game.deck.length, lastCard: game.lastCard, lastEvent: game.lastEvent, winnerId: game.winnerId,
    lastAction: game.lastAction, lastActionKind: game.lastActionKind,
    turnDeadline: game.turnDeadline || null, roundDeadline: game.roundDeadline || null,
    turnSeconds: TURN_SECONDS, actionNumber: game.actionNumber
  };
}
module.exports = {
  HAND_SIZE, LIMIT, MAX_PLAYERS, MIN_PLAYERS, STARTING_FUSES, TURN_SECONDS, ROUND_BREAK_SECONDS, RULES_VERSION,
  activePlayer, addPlayer, autoPlay, buildDeck, createGame, playCard, removePlayer, resetToLobby,
  shuffle, startMatch, nextRound, stateFor, totalAfter
};
