"use strict";

const assert = require("node:assert/strict");
const Chess = require("../learning/games/chess/chess-rules");

function play(state, from, to, promotion) {
  const result = Chess.applyMove(state, from, to, promotion);
  assert.equal(result.ok, true, `${from}-${to}는 합법 수여야 합니다: ${result.error || ""}`);
  return result.state;
}

const initial = Chess.createInitialState();
assert.equal(initial.board.length, 64);
assert.equal(Chess.allLegalMoves(initial).length, 20, "초기 위치에는 합법 수가 20개여야 합니다.");
assert.equal(Chess.legalMoves(initial, Chess.squareIndex("e2")).length, 2, "초기 폰은 한 칸 또는 두 칸 전진할 수 있어야 합니다.");

let opening = initial;
opening = play(opening, "e2", "e4");
opening = play(opening, "e7", "e5");
opening = play(opening, "g1", "f3");
assert.deepEqual(opening.san, ["e4", "e5", "Nf3"]);

let castle = Chess.boardFromFen("r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1");
const kingMoves = Chess.legalMoves(castle, Chess.squareIndex("e1"));
assert.ok(kingMoves.some(move => move.to === Chess.squareIndex("g1") && move.castle === "K"), "킹사이드 캐슬링이 가능해야 합니다.");
assert.ok(kingMoves.some(move => move.to === Chess.squareIndex("c1") && move.castle === "Q"), "퀸사이드 캐슬링이 가능해야 합니다.");
castle = play(castle, "e1", "g1");
assert.equal(castle.board[Chess.squareIndex("g1")], "wK");
assert.equal(castle.board[Chess.squareIndex("f1")], "wR");
assert.equal(castle.castling.includes("K"), false);

const blockedCastle = Chess.boardFromFen("r3k2r/8/8/8/2b5/8/8/R3K2R w KQkq - 0 1");
assert.equal(
  Chess.legalMoves(blockedCastle, Chess.squareIndex("e1")).some(move => move.to === Chess.squareIndex("g1")),
  true,
  "학습 규칙에서는 공격받는 칸을 지나는 캐슬링도 허용합니다."
);

let enPassant = Chess.boardFromFen("4k3/8/8/3pP3/8/8/8/4K3 w - d6 0 2");
const epMove = Chess.legalMoves(enPassant, Chess.squareIndex("e5")).find(move => move.to === Chess.squareIndex("d6"));
assert.equal(epMove?.enPassant, true, "앙파상 수를 생성해야 합니다.");
enPassant = play(enPassant, "e5", "d6");
assert.equal(enPassant.board[Chess.squareIndex("d5")], null, "앙파상으로 잡힌 폰을 제거해야 합니다.");
assert.equal(enPassant.board[Chess.squareIndex("d6")], "wP");

let promotion = Chess.boardFromFen("4k3/P7/8/8/8/8/8/4K3 w - - 0 1");
promotion = play(promotion, "a7", "a8", "N");
assert.equal(promotion.board[Chess.squareIndex("a8")], "wN", "선택한 말로 승격해야 합니다.");
assert.match(promotion.san[0], /=N/);

let foolsMate = Chess.createInitialState();
foolsMate = play(foolsMate, "f2", "f3");
foolsMate = play(foolsMate, "e7", "e5");
foolsMate = play(foolsMate, "g2", "g4");
const mateResult = Chess.applyMove(foolsMate, "d8", "h4");
assert.equal(mateResult.ok, true);
assert.deepEqual(mateResult.status, { ended: false, reason: null, winner: null, checked: true });
assert.equal(mateResult.state.san.at(-1), "Qh4+");

const stalemate = Chess.boardFromFen("7k/5Q2/6K1/8/8/8/8/8 b - - 0 1");
assert.deepEqual(Chess.status(stalemate), { ended: false, reason: null, winner: null, checked: false });

const bareKings = Chess.boardFromFen("4k3/8/8/8/8/8/8/4K3 w - - 0 1");
assert.equal(Chess.insufficientMaterial(bareKings), true);
assert.equal(Chess.status(bareKings).ended, false, "왕끼리도 잡기를 계속할 수 있습니다.");

const pinned = Chess.boardFromFen("4r1k1/8/8/8/8/8/4R3/4K3 w - - 0 1");
assert.equal(
  Chess.legalMoves(pinned, Chess.squareIndex("e2")).some(move => Chess.squareName(move.to) === "d2"),
  true,
  "킹을 노출하는 말의 이동도 허용해야 합니다."
);

console.log("chess-rules-unit: moves, checks, castling, en passant, promotion and endings ok");
