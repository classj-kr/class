"use strict";

const assert = require("node:assert/strict");
const path = require("node:path");
const Dobble = require(path.resolve(__dirname, "..", "game-hub-server", "dobble"));

// 유한 사영평면 구성: 카드 57장, 카드당 그림 8개, 임의의 두 카드는 정확히 그림 하나만 공유해야 한다.
const deck = Dobble.buildDeckIndices(7);
assert.equal(deck.length, Dobble.TOTAL_CARDS, "카드는 57장이어야 합니다.");
deck.forEach(card => assert.equal(card.length, Dobble.SYMBOLS_PER_CARD, "카드마다 그림이 8개여야 합니다."));

const allSymbols = new Set(deck.flat());
assert.equal(allSymbols.size, Dobble.TOTAL_CARDS, "그림 종류도 57가지여야 합니다.");

for (let i = 0; i < deck.length; i += 1) {
  for (let j = i + 1; j < deck.length; j += 1) {
    const shared = deck[i].filter(symbol => deck[j].includes(symbol));
    assert.equal(shared.length, 1, `카드 ${i}와 ${j}는 그림이 정확히 1개만 겹쳐야 합니다 (실제 ${shared.length}개).`);
  }
}

function gameWithTwoPlayers() {
  const game = Dobble.createGame("host", "방장");
  Dobble.addPlayer(game, "guest1", "하늘");
  return game;
}

// 시작하면 카드가 인원에게 고르게 나뉘고 중앙에 1장 남아야 한다.
const started = gameWithTwoPlayers();
const startResult = Dobble.startGame(started, () => 0);
assert.equal(startResult.ok, true);
assert.equal(started.phase, "playing");
const totalInHands = started.players.reduce((sum, p) => sum + p.stack.length, 0);
assert.equal(totalInHands + started.centerPile.length, Dobble.TOTAL_CARDS, "모든 카드가 플레이어 손패 + 중앙 카드에 있어야 합니다.");
assert.equal(started.centerPile.length, 1);

// 정답 그림을 맞히면 카드를 내고, 오답이면 거부된다.
const claimGame = gameWithTwoPlayers();
Dobble.startGame(claimGame, () => 0);
const player = claimGame.players[0];
const other = claimGame.players[1];
const centerCard = claimGame.centerPile[0];
const myCard = player.stack[0];
const realMatch = Dobble.sharedSymbol(myCard, centerCard);
assert.ok(realMatch, "손패 카드와 중앙 카드는 반드시 그림 하나가 겹쳐야 합니다.");

const wrongGuess = myCard.find(symbol => symbol !== realMatch) || "존재하지않는그림";
const badResult = Dobble.claim(claimGame, player.id, wrongGuess);
assert.equal(badResult.ok, false, "겹치지 않는 그림을 지목하면 거부되어야 합니다.");
assert.equal(badResult.wrongGuess, true, "오답에는 wrongGuess 플래그가 있어야 합니다.");
assert.equal(claimGame.centerPile.length, 1, "오답이면 중앙 카드가 바뀌지 않아야 합니다.");
assert.equal(Dobble.stateFor(claimGame, player.id).myLocked, true, "오답을 내면 이번 카드에서 잠겨야 합니다.");

// 오답을 낸 직후에는 같은 카드 조합에서 정답을 알아도 다시 찍을 수 없다.
const tooSoonResult = Dobble.claim(claimGame, player.id, realMatch);
assert.equal(tooSoonResult.ok, false, "오답을 낸 카드에서는 정답이라도 거부되어야 합니다.");
assert.equal(claimGame.centerPile.length, 1, "잠긴 상태의 시도는 카드에 영향을 주면 안 됩니다.");

// 다른 사람이 정답을 맞혀 카드가 바뀌면(actionNumber 증가) 잠금이 풀린다.
const otherCard = other.stack[0];
const otherMatch = Dobble.sharedSymbol(otherCard, centerCard);
const otherResult = Dobble.claim(claimGame, other.id, otherMatch);
assert.equal(otherResult.ok, true, "다른 사람의 정답 지목은 성공해야 합니다.");
assert.equal(Dobble.stateFor(claimGame, player.id).myLocked, false, "카드가 바뀌면 잠금이 풀려야 합니다.");

const beforeCount = player.stack.length;
const newCenter = claimGame.centerPile[claimGame.centerPile.length - 1];
const newMatch = Dobble.sharedSymbol(player.stack[0], newCenter);
const goodResult = Dobble.claim(claimGame, player.id, newMatch);
assert.equal(goodResult.ok, true, "잠금이 풀린 뒤에는 다시 시도할 수 있어야 합니다.");
assert.equal(player.stack.length, beforeCount - 1, "정답이면 손패가 한 장 줄어야 합니다.");
assert.equal(claimGame.lastMatch.symbol, newMatch, "lastMatch에 방금 맞힌 그림이 기록되어야 합니다.");

// 손패를 모두 낸 사람이 즉시 승리한다.
const winGame = gameWithTwoPlayers();
Dobble.startGame(winGame, () => 0);
const winner = winGame.players[0];
while (winner.stack.length > 0) {
  const center = winGame.centerPile[winGame.centerPile.length - 1];
  const match = Dobble.sharedSymbol(winner.stack[0], center);
  const result = Dobble.claim(winGame, winner.id, match);
  assert.equal(result.ok, true, "정답 지목은 항상 성공해야 합니다.");
}
assert.equal(winGame.phase, "gameEnd", "손패를 다 내면 게임이 끝나야 합니다.");
assert.equal(winGame.winner, winner.id, "손패를 먼저 다 낸 사람이 승리해야 합니다.");

// stateFor는 참가자에게 본인 카드/중앙 카드만 보여주고 다른 사람 손패는 숨긴다.
const view = Dobble.stateFor(started, started.players[0].id);
assert.ok(Array.isArray(view.myCard));
assert.ok(view.players.every(p => !("stack" in p)), "다른 참가자의 손패 원본이 노출되면 안 됩니다.");

// 대기실에서만 방장이 규칙을 바꿀 수 있고, 잘못된 값은 거부된다.
const modeGame = gameWithTwoPlayers();
assert.equal(Dobble.setMode(modeGame, "catalog").ok, true);
assert.equal(modeGame.mode, "catalog");
assert.equal(Dobble.setMode(modeGame, "not-a-mode").ok, false, "알 수 없는 규칙은 거부되어야 합니다.");
Dobble.startGame(modeGame, () => 0);
assert.equal(Dobble.setMode(modeGame, "tower").ok, false, "진행 중에는 규칙을 바꿀 수 없어야 합니다.");

// 카탈로그 규칙: 기준 카드는 모두에게 공개되고, 손패 개념이 없다.
const catalogGame = gameWithTwoPlayers();
Dobble.setMode(catalogGame, "catalog");
Dobble.startGame(catalogGame, () => 0);
assert.equal(catalogGame.drawPile.length, Dobble.TOTAL_CARDS - 1);
const catalogView = Dobble.stateFor(catalogGame, catalogGame.players[0].id);
assert.equal(catalogView.myCard, null, "카탈로그에는 개인 카드가 없어야 합니다.");
assert.ok(Array.isArray(catalogView.centerCard));
assert.ok(Array.isArray(catalogView.challengerCard));

// 오답은 거부되고, 정답을 맞히면 기준 카드를 가져가며 더미 맨 위가 새 기준 카드가 된다.
const catalogPlayer = catalogGame.players[0];
const catalogOther = catalogGame.players[1];
const centerBefore = catalogGame.centerCard;
const challengerBefore = catalogGame.drawPile[catalogGame.drawPile.length - 1];
const catalogMatch = Dobble.sharedSymbol(centerBefore, challengerBefore);
const catalogBad = Dobble.claim(catalogGame, catalogPlayer.id, centerBefore.find(s => s !== catalogMatch));
assert.equal(catalogBad.ok, false, "겹치지 않는 그림은 거부되어야 합니다.");
assert.equal(Dobble.stateFor(catalogGame, catalogPlayer.id).myLocked, true, "카탈로그도 오답을 내면 이번 카드에서 잠겨야 합니다.");

// 오답을 낸 사람은 같은 카드에서 정답을 다시 대도 거부된다.
assert.equal(Dobble.claim(catalogGame, catalogPlayer.id, catalogMatch).ok, false, "잠긴 사람은 정답이라도 거부되어야 합니다.");

// 다른 사람이 대신 맞히면 카드가 넘어가고, 그제서야 잠금이 풀린다.
const catalogGood = Dobble.claim(catalogGame, catalogOther.id, catalogMatch);
assert.equal(catalogGood.ok, true);
assert.deepEqual(catalogOther.collected[0], centerBefore, "맞히면 이전 기준 카드를 가져가야 합니다.");
assert.equal(Dobble.stateFor(catalogGame, catalogPlayer.id).myLocked, false, "카드가 넘어가면 잠금이 풀려야 합니다.");
assert.deepEqual(catalogGame.centerCard, challengerBefore, "방금 뒤집힌 카드가 새 기준 카드가 되어야 합니다.");

// 더미가 소진되면 가장 많이 모은 사람이 승리한다.
const catalogWinGame = gameWithTwoPlayers();
Dobble.setMode(catalogWinGame, "catalog");
Dobble.startGame(catalogWinGame, () => 0);
const catalogWinner = catalogWinGame.players[0];
while (catalogWinGame.drawPile.length > 0) {
  const challenger = catalogWinGame.drawPile[catalogWinGame.drawPile.length - 1];
  const match = Dobble.sharedSymbol(catalogWinGame.centerCard, challenger);
  const result = Dobble.claim(catalogWinGame, catalogWinner.id, match);
  assert.equal(result.ok, true, "정답 지목은 항상 성공해야 합니다.");
}
assert.equal(catalogWinGame.phase, "gameEnd", "더미가 소진되면 게임이 끝나야 합니다.");
assert.equal(catalogWinGame.winner, catalogWinner.id, "가장 많이 모은 사람이 승리해야 합니다.");
assert.equal(catalogWinner.collected.length, Dobble.TOTAL_CARDS - 1, "혼자 다 맞혔다면 기준 카드를 제외한 전부를 모아야 합니다.");

// 오답 페널티는 시간이 지나면 반드시 풀린다. 카드가 바뀔 때까지로만 묶어 두면, 남아 있는
// 사람이 모두 오답을 낸 순간 아무도 찍을 수 없어 게임이 그대로 멈춰 버린다(2명이면 둘 다 틀리는 즉시).
const stuckGame = gameWithTwoPlayers();
Dobble.startGame(stuckGame, () => 0);
const [first, second] = stuckGame.players;
const stuckCenter = stuckGame.centerPile[0];
const wrongOf = target => target.stack[0].find(symbol => symbol !== Dobble.sharedSymbol(target.stack[0], stuckCenter));
let clock = 10000;
const stuckNow = () => clock;

assert.equal(Dobble.claim(stuckGame, first.id, wrongOf(first), stuckNow).wrongGuess, true);
assert.equal(Dobble.claim(stuckGame, second.id, wrongOf(second), stuckNow).wrongGuess, true);
assert.equal(Dobble.stateFor(stuckGame, first.id, stuckNow).myLocked, true, "둘 다 오답을 내면 둘 다 잠겨야 합니다.");
assert.equal(Dobble.stateFor(stuckGame, second.id, stuckNow).myLocked, true, "둘 다 오답을 내면 둘 다 잠겨야 합니다.");
assert.equal(
  Dobble.stateFor(stuckGame, first.id, stuckNow).myLockedMs,
  Dobble.WRONG_GUESS_PENALTY_MS,
  "남은 페널티 시간이 상태에 실려야 클라이언트가 카운트다운을 보여줄 수 있습니다."
);

// 페널티가 끝나기 직전까지는 정답이라도 막힌다 — 마구 눌러보는 것을 막는 원래 목적은 그대로다.
clock += Dobble.WRONG_GUESS_PENALTY_MS - 1;
assert.equal(
  Dobble.claim(stuckGame, first.id, Dobble.sharedSymbol(first.stack[0], stuckCenter), stuckNow).ok,
  false,
  "페널티가 남아 있으면 정답이라도 거부되어야 합니다."
);

// 페널티가 끝나면 카드가 그대로여도 다시 찍을 수 있다. 여기서 풀리지 않으면 게임이 영영 멈춘다.
clock += 1;
assert.equal(Dobble.stateFor(stuckGame, first.id, stuckNow).myLocked, false, "페널티 시간이 지나면 잠금이 풀려야 합니다.");
assert.equal(Dobble.stateFor(stuckGame, first.id, stuckNow).myLockedMs, 0);
const stuckCardsBefore = first.stack.length;
const recovered = Dobble.claim(stuckGame, first.id, Dobble.sharedSymbol(first.stack[0], stuckCenter), stuckNow);
assert.equal(recovered.ok, true, "모두 오답을 낸 뒤에도 페널티가 끝나면 게임이 이어져야 합니다.");
assert.equal(first.stack.length, stuckCardsBefore - 1);
assert.equal(stuckGame.phase, "playing");

// 카탈로그 규칙에서도 마찬가지다.
const stuckCatalog = gameWithTwoPlayers();
Dobble.setMode(stuckCatalog, "catalog");
Dobble.startGame(stuckCatalog, () => 0);
let catalogClock = 500;
const catalogNow = () => catalogClock;
const stuckChallenger = stuckCatalog.drawPile[stuckCatalog.drawPile.length - 1];
const stuckCatalogMatch = Dobble.sharedSymbol(stuckCatalog.centerCard, stuckChallenger);
const stuckCatalogWrong = stuckCatalog.centerCard.find(symbol => symbol !== stuckCatalogMatch);
stuckCatalog.players.forEach(player => {
  assert.equal(Dobble.claim(stuckCatalog, player.id, stuckCatalogWrong, catalogNow).wrongGuess, true);
});
catalogClock += Dobble.WRONG_GUESS_PENALTY_MS;
assert.equal(
  Dobble.claim(stuckCatalog, stuckCatalog.players[0].id, stuckCatalogMatch, catalogNow).ok,
  true,
  "카탈로그에서도 모두 오답을 낸 뒤 페널티가 끝나면 게임이 이어져야 합니다."
);

// 서버가 페널티가 풀리는 순간에 맞춰 상태를 다시 방송할 수 있도록, 가장 이른 만료 시각을 알려준다.
const timerGame = gameWithTwoPlayers();
Dobble.startGame(timerGame, () => 0);
let timerClock = 1000;
const timerNow = () => timerClock;
assert.equal(Dobble.nextPenaltyEndsAt(timerGame, timerNow), 0, "페널티가 없으면 0이어야 합니다.");

const timerCenter = timerGame.centerPile[0];
const [early, late] = timerGame.players;
const timerWrongOf = target => target.stack[0].find(symbol => symbol !== Dobble.sharedSymbol(target.stack[0], timerCenter));
Dobble.claim(timerGame, early.id, timerWrongOf(early), timerNow);
timerClock += 500;
Dobble.claim(timerGame, late.id, timerWrongOf(late), timerNow);
assert.equal(
  Dobble.nextPenaltyEndsAt(timerGame, timerNow),
  1000 + Dobble.WRONG_GUESS_PENALTY_MS,
  "먼저 오답을 낸 사람의 페널티가 먼저 끝나야 합니다."
);
timerClock = 1000 + Dobble.WRONG_GUESS_PENALTY_MS;
assert.equal(
  Dobble.nextPenaltyEndsAt(timerGame, timerNow),
  1500 + Dobble.WRONG_GUESS_PENALTY_MS,
  "이미 끝난 페널티는 빼고 다음 만료 시각을 알려줘야 합니다."
);
timerClock = 1500 + Dobble.WRONG_GUESS_PENALTY_MS;
assert.equal(Dobble.nextPenaltyEndsAt(timerGame, timerNow), 0, "페널티가 모두 끝나면 다시 0이어야 합니다.");

console.log("dobble-unit.js: all assertions passed");
