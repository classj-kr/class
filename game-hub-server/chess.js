"use strict";

const Rules = require("../learning/games/chess/chess-rules");

const TIME_CONTROLS = Object.freeze({
  bullet: Object.freeze({ key: "bullet", label: "빠르게 · 1+1", baseMs: 60000, incrementMs: 1000 }),
  quick: Object.freeze({ key: "quick", label: "기본 · 3+2", baseMs: 180000, incrementMs: 2000 }),
  relaxed: Object.freeze({ key: "relaxed", label: "여유롭게 · 5+3", baseMs: 300000, incrementMs: 3000 }),
  untimed: Object.freeze({ key: "untimed", label: "친선 · 시간제한 없음", baseMs: null, incrementMs: 0 })
});

function cleanName(value, fallback = "플레이어") {
  return String(value || "").trim().slice(0, 12) || fallback;
}

function normalizeTimeControl(value) {
  return TIME_CONTROLS[String(value || "")] || TIME_CONTROLS.quick;
}

function createGame(hostId, hostName) {
  return {
    phase: "lobby",
    players: [{ id: String(hostId), name: cleanName(hostName, "방장") }],
    colors: { w: null, b: null },
    position: null,
    timeControl: TIME_CONTROLS.quick.key,
    clocks: { w: TIME_CONTROLS.quick.baseMs, b: TIME_CONTROLS.quick.baseMs },
    turnStartedAt: null,
    result: null,
    drawOfferBy: null,
    rematchVotes: {},
    matchNumber: 0,
    lastAction: "상대방을 기다리는 중입니다.",
    revision: 0
  };
}

function addPlayer(game, playerId, playerName) {
  if (game.phase !== "lobby") return { ok: false, error: "이미 시작한 대국입니다." };
  const id = String(playerId);
  if (game.players.some(player => player.id === id)) return { ok: true };
  if (game.players.length >= 2) return { ok: false, error: "체스는 두 명만 참여할 수 있습니다." };
  game.players.push({ id, name: cleanName(playerName, "손님") });
  game.lastAction = "두 명이 모였습니다. 방장이 대국을 시작할 수 있습니다.";
  game.revision += 1;
  return { ok: true };
}

function removePlayer(game, playerId) {
  if (game.phase !== "lobby") return { ok: false, error: "진행 중인 대국에서는 참가자를 제거할 수 없습니다." };
  game.players = game.players.filter(player => player.id !== String(playerId));
  game.revision += 1;
  return { ok: true };
}

function playerById(game, playerId) {
  return game.players.find(player => player.id === String(playerId)) || null;
}

function colorForPlayer(game, playerId) {
  const id = String(playerId);
  return game.colors.w === id ? "w" : game.colors.b === id ? "b" : null;
}

function playerNameForColor(game, color) {
  return playerById(game, game.colors[color])?.name || (color === "w" ? "백" : "흑");
}

function beginMatch(game, timeControlKey, options = {}) {
  if (game.players.length !== 2) return { ok: false, error: "두 명이 모여야 시작할 수 있습니다." };
  const control = normalizeTimeControl(timeControlKey || game.timeControl);
  const ids = game.players.map(player => player.id);
  if (options.swapColors && game.colors.w && game.colors.b) {
    game.colors = { w: game.colors.b, b: game.colors.w };
  } else {
    const random = typeof options.random === "function" ? options.random : Math.random;
    const hostIsWhite = random() < 0.5;
    game.colors = hostIsWhite ? { w: ids[0], b: ids[1] } : { w: ids[1], b: ids[0] };
  }
  game.position = Rules.createInitialState();
  game.timeControl = control.key;
  game.clocks = { w: control.baseMs, b: control.baseMs };
  game.turnStartedAt = control.baseMs == null ? null : Date.now();
  game.phase = "playing";
  game.result = null;
  game.drawOfferBy = null;
  game.rematchVotes = {};
  game.matchNumber += 1;
  game.lastAction = `${playerNameForColor(game, "w")}님이 백으로 먼저 둡니다.`;
  game.revision += 1;
  return { ok: true };
}

function startGame(game, timeControlKey, options = {}) {
  if (game.phase !== "lobby") return { ok: false, error: "이미 시작한 대국입니다." };
  return beginMatch(game, timeControlKey, options);
}

function finish(game, reason, winner, message) {
  game.phase = "ended";
  game.turnStartedAt = null;
  game.result = { reason, winner: winner || null };
  game.drawOfferBy = null;
  game.lastAction = message;
}

function clockValues(game, now = Date.now()) {
  const values = { w: game.clocks.w, b: game.clocks.b };
  if (game.phase === "playing" && game.turnStartedAt && game.position && values[game.position.turn] != null) {
    values[game.position.turn] = Math.max(0, values[game.position.turn] - Math.max(0, now - game.turnStartedAt));
  }
  return values;
}

function timeout(game, now = Date.now()) {
  if (game.phase !== "playing" || !game.position || !game.turnStartedAt) return { ok: false, error: "진행 중인 시계가 없습니다." };
  const color = game.position.turn;
  const remaining = clockValues(game, now)[color];
  if (remaining == null || remaining > 0) return { ok: false, error: "아직 시간이 남아 있습니다." };
  game.clocks[color] = 0;
  const winner = color === "w" ? "b" : "w";
  finish(game, "timeout", winner, `${playerNameForColor(game, color)}님의 시간이 끝났습니다. ${playerNameForColor(game, winner)}님이 승리했습니다.`);
  game.revision += 1;
  return { ok: true };
}

function settleActiveClock(game, now) {
  const color = game.position.turn;
  const current = clockValues(game, now)[color];
  if (current == null) return { ok: true, color };
  game.clocks[color] = current;
  if (current <= 0) {
    timeout(game, now);
    return { ok: false, error: "시간이 끝났습니다." };
  }
  return { ok: true, color };
}

function reasonMessage(game, result) {
  if (result.reason === "king-captured") return `킹을 잡았습니다! ${playerNameForColor(game, result.winner)}님이 승리했습니다.`;
  if (result.reason === "no-legal-move") return "움직일 수 있는 말이 없어 무승부입니다.";
  if (result.reason === "threefold") return "같은 위치가 세 번 반복되어 무승부입니다.";
  if (result.reason === "fifty-move") return "50수 규칙에 따라 무승부입니다.";
  return "대국이 종료되었습니다.";
}

function move(game, playerId, from, to, promotion, now = Date.now()) {
  if (game.phase !== "playing" || !game.position) return { ok: false, error: "진행 중인 대국이 아닙니다." };
  const color = colorForPlayer(game, playerId);
  if (!color) return { ok: false, error: "이 대국의 참가자가 아닙니다." };
  if (game.position.turn !== color) return { ok: false, error: "지금은 내 차례가 아닙니다." };
  const clock = settleActiveClock(game, now);
  if (!clock.ok) return { ok: true, timedOut: true };
  const applied = Rules.applyMove(game.position, from, to, promotion);
  if (!applied.ok) {
    if (game.clocks[color] != null) game.turnStartedAt = now;
    return applied;
  }
  game.position = applied.state;
  const control = normalizeTimeControl(game.timeControl);
  if (game.clocks[color] != null) game.clocks[color] += control.incrementMs;
  game.drawOfferBy = null;
  game.lastAction = `${playerNameForColor(game, color)}님이 ${applied.move.san} 수를 두었습니다.`;
  if (applied.status.ended) finish(game, applied.status.reason, applied.status.winner, reasonMessage(game, applied.status));
  else game.turnStartedAt = control.baseMs == null ? null : now;
  game.revision += 1;
  return { ok: true };
}

function resign(game, playerId) {
  if (game.phase !== "playing") return { ok: false, error: "진행 중인 대국이 아닙니다." };
  const color = colorForPlayer(game, playerId);
  if (!color) return { ok: false, error: "이 대국의 참가자가 아닙니다." };
  const winner = color === "w" ? "b" : "w";
  finish(game, "resign", winner, `${playerNameForColor(game, color)}님이 기권했습니다. ${playerNameForColor(game, winner)}님이 승리했습니다.`);
  game.revision += 1;
  return { ok: true };
}

function offerDraw(game, playerId) {
  if (game.phase !== "playing") return { ok: false, error: "진행 중인 대국이 아닙니다." };
  const color = colorForPlayer(game, playerId);
  if (!color) return { ok: false, error: "이 대국의 참가자가 아닙니다." };
  if (game.drawOfferBy) return { ok: false, error: "이미 무승부 제안이 진행 중입니다." };
  game.drawOfferBy = String(playerId);
  game.lastAction = `${playerNameForColor(game, color)}님이 무승부를 제안했습니다.`;
  game.revision += 1;
  return { ok: true };
}

function answerDraw(game, playerId, accept) {
  if (game.phase !== "playing" || !game.drawOfferBy) return { ok: false, error: "받은 무승부 제안이 없습니다." };
  if (String(playerId) === game.drawOfferBy) return { ok: false, error: "상대방의 응답을 기다려 주세요." };
  const color = colorForPlayer(game, playerId);
  if (!color) return { ok: false, error: "이 대국의 참가자가 아닙니다." };
  if (accept) finish(game, "agreement", null, "두 사람이 합의하여 무승부입니다.");
  else {
    game.drawOfferBy = null;
    game.lastAction = `${playerNameForColor(game, color)}님이 무승부 제안을 거절했습니다.`;
  }
  game.revision += 1;
  return { ok: true };
}

function requestRematch(game, playerId) {
  if (game.phase !== "ended") return { ok: false, error: "대국이 끝난 뒤 재대국할 수 있습니다." };
  const id = String(playerId);
  if (!playerById(game, id)) return { ok: false, error: "이 대국의 참가자가 아닙니다." };
  game.rematchVotes[id] = true;
  if (game.players.every(player => game.rematchVotes[player.id])) return beginMatch(game, game.timeControl, { swapColors: true });
  game.lastAction = `${playerById(game, id).name}님이 재대국을 요청했습니다.`;
  game.revision += 1;
  return { ok: true };
}

function stateFor(game, playerId, now = Date.now()) {
  const control = normalizeTimeControl(game.timeControl);
  const clocks = clockValues(game, now);
  return {
    phase: game.phase,
    players: game.players.map(player => ({ ...player, color: colorForPlayer(game, player.id) })),
    myColor: colorForPlayer(game, playerId),
    colors: { ...game.colors },
    board: game.position ? [...game.position.board] : Array(64).fill(null),
    turn: game.position?.turn || "w",
    castling: game.position?.castling || "",
    epSquare: game.position?.epSquare ?? null,
    lastMove: game.position?.lastMove ? { ...game.position.lastMove } : null,
    moves: game.position?.san ? [...game.position.san] : [],
    captures: game.position?.captures ? [...game.position.captures] : [],
    checked: game.position && game.phase === "playing" ? Rules.isInCheck(game.position, game.position.turn) : false,
    timeControl: { ...control },
    clocks,
    serverNow: now,
    turnStartedAt: game.turnStartedAt,
    result: game.result ? { ...game.result } : null,
    drawOfferBy: game.drawOfferBy,
    rematchRequested: !!game.rematchVotes[String(playerId)],
    rematchCount: Object.keys(game.rematchVotes).length,
    matchNumber: game.matchNumber,
    lastAction: game.lastAction,
    revision: game.revision
  };
}

module.exports = {
  TIME_CONTROLS,
  Rules,
  normalizeTimeControl,
  createGame,
  addPlayer,
  removePlayer,
  colorForPlayer,
  startGame,
  timeout,
  move,
  resign,
  offerDraw,
  answerDraw,
  requestRematch,
  stateFor
};
