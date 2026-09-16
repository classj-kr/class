"use strict";

const assert = require("node:assert/strict");
const Chess = require("../game-hub-server/chess");

const game = Chess.createGame("host", "가람");
assert.equal(Chess.addPlayer(game, "guest", "나래").ok, true);
assert.equal(Chess.startGame(game, "quick", { random: () => 0 }).ok, true);
assert.deepEqual(game.colors, { w: "host", b: "guest" });
assert.equal(game.clocks.w, 180000);
assert.equal(game.clocks.b, 180000);

const startedAt = game.turnStartedAt;
assert.equal(Chess.move(game, "guest", "e7", "e5", null, startedAt + 1000).ok, false, "차례가 아닌 사람은 둘 수 없습니다.");
assert.equal(Chess.move(game, "host", "e2", "e4", null, startedAt + 1000).ok, true);
assert.equal(game.clocks.w, 181000, "1초 사용 뒤 2초가 추가되어야 합니다.");
assert.equal(game.position.turn, "b");

const blackStartedAt = game.turnStartedAt;
assert.equal(Chess.move(game, "guest", "e7", "e5", null, blackStartedAt + 2500).ok, true);
assert.equal(game.clocks.b, 179500);

const timeoutGame = Chess.createGame("host", "가람");
Chess.addPlayer(timeoutGame, "guest", "나래");
Chess.startGame(timeoutGame, "bullet", { random: () => 0 });
const timeoutAt = timeoutGame.turnStartedAt + 60001;
assert.equal(Chess.timeout(timeoutGame, timeoutAt).ok, true);
assert.equal(timeoutGame.phase, "ended");
assert.deepEqual(timeoutGame.result, { reason: "timeout", winner: "b" });

const drawGame = Chess.createGame("host", "가람");
Chess.addPlayer(drawGame, "guest", "나래");
Chess.startGame(drawGame, "untimed", { random: () => 0 });
assert.equal(Chess.offerDraw(drawGame, "host").ok, true);
assert.equal(Chess.answerDraw(drawGame, "guest", true).ok, true);
assert.deepEqual(drawGame.result, { reason: "agreement", winner: null });
assert.equal(Chess.requestRematch(drawGame, "host").ok, true);
assert.equal(drawGame.phase, "ended");
assert.equal(Chess.requestRematch(drawGame, "guest").ok, true);
assert.equal(drawGame.phase, "playing");
assert.deepEqual(drawGame.colors, { w: "guest", b: "host" }, "재대국에서는 백과 흑을 교대해야 합니다.");

const resignation = Chess.createGame("host", "가람");
Chess.addPlayer(resignation, "guest", "나래");
Chess.startGame(resignation, "quick", { random: () => 0.9 });
assert.deepEqual(resignation.colors, { w: "guest", b: "host" });
assert.equal(Chess.resign(resignation, "guest").ok, true);
assert.deepEqual(resignation.result, { reason: "resign", winner: "b" });

const publicState = Chess.stateFor(game, "host", game.turnStartedAt);
assert.equal(publicState.myColor, "w");
assert.equal(publicState.board.length, 64);
assert.equal(publicState.timeControl.key, "quick");
assert.equal(publicState.moves.length, 2);

console.log("chess-server-unit: colors, clocks, timeout, draw, resignation and rematch ok");
