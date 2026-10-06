"use strict";
const test=require("node:test"), assert=require("node:assert/strict");
const C=require("../learning/games/chess/chess-rules.js"), AI=require("../learning/games/board-coach/chess-ai.js");
const fen=s=>C.boardFromFen(s,"standard"), sq=C.squareIndex;
function play(s,from,to,promotion) { const result=C.applyMove(s,from,to,promotion);assert.equal(result.ok,true,result.error);return result.state; }
function perft(s,n) { if(!n)return 1;return C.allLegalMoves(s).reduce((sum,m)=>sum+perft(C.advance(s,m),n-1),0); }
test("standard legal move generation matches reference perft totals",()=>{
  const s=C.createInitialState("standard");
  assert.equal(perft(s,1),20); assert.equal(perft(s,2),400); assert.equal(perft(s,3),8902);
  const kiwi=fen("r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1");
  assert.equal(perft(kiwi,1),48); assert.equal(perft(kiwi,2),2039);
});
test("pins, attacked king squares, adjacent kings, and en passant discovered checks are illegal",()=>{
  const pin=fen("4r1k1/8/8/8/8/8/4R3/4K3 w - - 0 1");
  assert.equal(C.applyMove(pin,"e2","d2").ok,false);
  assert.equal(C.applyMove(pin,"e1","e2").ok,false);
  const kings=fen("8/8/8/8/8/4k3/8/4K3 w - - 0 1");
  assert.ok(!C.legalMoves(kings,sq("e1")).some(m=>m.to===sq("e2")));
  const ep=fen("4k3/8/8/r4pPK/8/8/8/8 w - f6 0 1");
  assert.ok(!C.legalMoves(ep,sq("g5")).some(m=>m.enPassant));
  const captureKing=fen("4k3/8/8/8/8/8/4Q3/4K3 w - - 0 1");
  assert.ok(!C.allLegalMoves(captureKing).some(m=>m.capture==="bK"));
});
test("castling requires safe start, crossing, destination and intact rights",()=>{
  for(const position of ["4r1k1/8/8/8/8/8/8/4K2R w K - 0 1","4k3/8/8/8/2b5/8/8/4K2R w K - 0 1","4k1r1/8/8/8/8/8/8/4K2R w K - 0 1"]) {
    const s=fen(position);assert.ok(!C.legalMoves(s,sq("e1")).some(m=>m.castle));
  }
  let s=fen("r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1");
  s=play(s,"e1","g1");assert.equal(s.board[sq("f1")],"wR");assert.equal(s.san.at(-1),"O-O");
  assert.ok(!s.castling.includes("K")&&!s.castling.includes("Q"));
});
test("mate, stalemate, dead material and promotion are adjudicated",()=>{
  let s=C.createInitialState("standard");
  for(const [a,b] of [["f2","f3"],["e7","e5"],["g2","g4"],["d8","h4"]]) s=play(s,a,b);
  assert.equal(C.status(s).reason,"checkmate");assert.equal(s.san.at(-1),"Qh4#");assert.equal(C.applyMove(s,"a2","a3").ok,false);
  assert.equal(C.status(fen("7k/5Q2/6K1/8/8/8/8/8 b - - 0 1")).reason,"stalemate");
  assert.equal(C.status(fen("4k3/8/8/8/8/8/8/4K3 w - - 0 1")).reason,"insufficient-material");
  for(const type of ["Q","R","B","N"]) {
    const p=play(fen("4k3/P7/8/8/8/8/8/4K3 w - - 0 1"),"a7","a8",type);assert.equal(p.board[sq("a8")],"w"+type);
  }
  assert.equal(C.applyMove(fen("4k3/P7/8/8/8/8/8/4K3 w - - 0 1"),"a7","a8","K").ok,false);
});
test("repetition uses legal en passant rights and supports current/prospective claims",()=>{
  const a=fen("4k3/8/8/r4pPK/8/8/8/8 w - f6 0 1"), b=fen("4k3/8/8/r4pPK/8/8/8/8 w - - 0 1");
  assert.equal(C.positionKey(a),C.positionKey(b));
  let s=C.createInitialState("standard");
  const cycle=[["g1","f3"],["g8","f6"],["f3","g1"],["f6","g8"]];
  for(const [from,to] of [...cycle,...cycle.slice(0,3)])s=play(s,from,to);
  const before=JSON.stringify(s), option=C.drawClaims(s).find(o=>o.move?.to===sq("g8"));assert.ok(option);
  const claim=C.claimDraw(s,option.move);assert.equal(claim.status.reason,"threefold");assert.equal(JSON.stringify(s),before);assert.deepEqual(claim.state.board,s.board);
  s=play(s,"f6","g8");assert.equal(C.status(s).ended,false);assert.equal(C.claimDraw(s).ok,true);
  for(const [from,to] of [...cycle,...cycle])s=play(s,from,to);
  assert.equal(C.status(s).reason,"fivefold");
  const fifty=fen("4k3/8/8/8/8/8/8/R3K3 w - - 99 51");
  assert.ok(C.drawClaims(fifty).some(o=>o.move));
  assert.equal(C.status(fen("4k3/8/8/8/8/8/8/R3K3 w - - 150 80")).reason,"seventy-five-move");
});
test("search opponents develop from the same repertoire, find mate, and answer mate threats",()=>{
  const start=C.createInitialState("standard"), threat=fen("rnbqkbnr/pppp1ppp/8/4p3/6P1/5P2/PPPPP2P/RNBQKBNR b KQkq g3 0 2");
  const defensive=fen("r1bqk2r/pppp1ppp/2n2n2/2b1p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR b KQkq - 4 4");
  for(const level of ["level2","intermediate","level4","advanced"]) {
    let result=AI.choose(start,level);assert.equal(result.move.from,sq("e2"));assert.equal(result.move.to,sq("e4"));
    result=AI.choose(threat,level,{nodes:1500,ms:10000});assert.equal(C.status(C.advance(threat,result.move)).reason,"checkmate");
    result=AI.choose(defensive,level,{nodes:2500,ms:10000});assert.equal(AI.mateInOne(C.advance(defensive,result.move)),null);
  }
  assert.equal(C.status(start).ended,false);assert.equal(start.board[sq("e2")],"wP");
});
test("intermediate wins free material and review detects a missed mate",()=>{
  const s=fen("4k3/8/8/8/8/8/4q3/3RK3 w - - 0 1");
  const move=AI.choose(s,"intermediate",{ms:10000}).move;
  assert.equal(move.capture,"bQ");
  let mate=C.createInitialState("standard");for(const [a,b] of [["f2","f3"],["e7","e5"],["g2","g4"]])mate=play(mate,a,b);
  const miss=C.allLegalMoves(mate).find(m=>m.from===sq("a7")&&m.to===sq("a6"));
  assert.match(AI.review(mate,miss).text,/체크메이트/);
});
test("a forced win takes priority over a draw claim; hints still give a move",()=>{
  const winning=fen("7k/5Q2/6K1/8/8/8/r7/q7 w - - 100 51");
  for(const level of Object.keys(AI.LEVELS)) {
    const answer=AI.choose(winning,level);assert.ok(answer.move);
    assert.equal(C.status(C.advance(winning,answer.move)).reason,"checkmate");
  }
  const losing=fen("4k3/8/8/8/8/8/8/R3K3 b - - 100 51");
  assert.equal(AI.choose(losing).claim,true);
  assert.ok(AI.choose(losing,"beginner",{allowClaim:false}).move);
});
