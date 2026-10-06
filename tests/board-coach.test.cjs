"use strict";
const test = require("node:test"), assert = require("node:assert/strict");
const fs = require("node:fs"), path = require("node:path"), vm = require("node:vm");
const R = require("../learning/games/board-coach/rules.js");
const AI = require("../learning/games/board-coach/ai.js");
const levels = ["intermediate","advanced"];
function omok(black = [], white = [], color = 1) {
  const s = R.initial("omok");
  black.forEach(i => s.board[i] = 1); white.forEach(i => s.board[i] = 2);
  s.count = black.length + white.length; s.color = color; return s;
}
function select(s, level) { return AI.choose(s, level, { ms: 10000, nodes: 5000, random:()=>.25 }).index; }
function generator() { let seed = 42; return n => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed % n; }; }

test("legal moves and flips agree with the multiplayer Reversi engine through full games", () => {
  const html = fs.readFileSync(path.resolve(__dirname, "../learning/games/reversi/reversi.html"), "utf8");
  const inline = [...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)];
  const context = vm.createContext({ console, localStorage: { getItem: () => "" }, document: { getElementById: () => null }, window: { addEventListener() {} }, setTimeout, clearTimeout });
  vm.runInContext(inline[0][1], context);
  const random = generator(); let passSeen = false;
  for (let game = 0; game < 20; game++) {
    let s = R.initial("reversi");
    while (!s.ended) {
      context.boardForTest = s.board; context.colorForTest = s.color;
      const original = JSON.parse(JSON.stringify(vm.runInContext("legalMovesFor(boardForTest, colorForTest)", context)));
      assert.deepEqual(R.legal(s), original.map(m => m.row * 8 + m.col));
      for (const m of original) assert.deepEqual(R.flips(s.board, m.row * 8 + m.col, s.color).sort((a,b) => a-b), m.flips.map(([r,c]) => r*8+c).sort((a,b) => a-b));
      const legal = R.legal(s), before = s.board.slice();
      const next = R.play(s, legal[random(legal.length)]);
      assert.deepEqual(s.board, before); assert.equal(next.board.filter(Boolean).length, before.filter(Boolean).length + 1);
      if (next.passed) { passSeen = true; assert.equal(next.color, s.color); assert.equal(R.legal(next, next.passed).length, 0); }
      s = next;
    }
    assert.ok(!s.board.some((v,i) => !v && (R.flips(s.board,i,1).length || R.flips(s.board,i,2).length)));
    const black = s.board.filter(v => v===1).length, white = s.board.filter(v => v===2).length;
    assert.equal(s.winner, black === white ? 0 : black > white ? 1 : 2);
    assert.ok(s.count <= 60);
  }
  assert.ok(passSeen, "automatic pass was exercised");
});

test("Omok wins on all axes, accepts overlines, and never wraps across the edge", () => {
  for (const [dr,dc] of R.axes) {
    const stones = Array.from({length:6}, (_,n) => (4+dr*n)*15+8+dc*n);
    assert.equal(R.play(omok(stones.slice(0,3)), stones[3]).ended, false);
    assert.equal(R.play(omok(stones.slice(0,4)), stones[4]).winner, 1);
    assert.equal(R.play(omok([stones[0],...stones.slice(2)]), stones[1]).line.length, 6);
  }
  assert.equal(R.play(omok([12,13,14,15]),16).ended, false);
  const s = R.initial("reversi");
  for (const i of [-1,64,27,0,1.5]) assert.throws(() => R.play(s,i));
  const end = {...R.initial("omok"), ended:true}; assert.throws(() => R.play(end,112));
});

test("search opponents start centrally and follow the documented Reversi opening", () => {
  let opening = R.initial("reversi"); for (const i of [44,29,20]) opening = R.play(opening,i);
  for (const level of levels) {
    assert.equal(select(R.initial("omok"),level),112);
    assert.equal(select(opening,level),43);
  }
  assert.match(AI.explain(opening,43), /중앙/);
  assert.match(AI.explain(R.initial("omok"),0), /H8/);
});

test("search Omok opponents take wins, block straight and broken fours, and prevent open fours", () => {
  for (const level of levels) {
    // Own immediate win takes precedence over defending an opponent four.
    const win = omok([105,106,107,108],[120,121,122,123]);
    assert.equal(select(win,level),109);
    const block = omok([104,30,31],[105,106,107,108]);
    assert.equal(select(block,level),109);
    const broken = omok([104,30,31],[105,106,108,109]);
    assert.equal(select(broken,level),107);
    const three = omok([30,45],[110,111,112]);
    const move = select(three,level), next = R.play(three,move);
    assert.ok([109,113].includes(move), `${level} blocks open three, got ${move}`);
    assert.ok(!R.legal(next).some(i => AI.threats(next.board,i,2).fours>=2));
  }
});

test("search Reversi opponents take a corner and avoid handing one over when safe alternatives exist", () => {
  const random = generator(); let corner, safety;
  for (let n=0; n<20 && (!corner || !safety); n++) {
    let s = R.initial("reversi");
    while (!s.ended && s.count<46) {
      const legal = R.legal(s);
      if (!corner && legal.some(i => AI.corners.includes(i))) corner = s;
      const danger = i => R.legal(R.play(s,i),3-s.color).some(j => AI.corners.includes(j));
      if (!safety && !legal.some(i => AI.corners.includes(i)) && legal.some(danger) && legal.some(i => !danger(i))) safety = s;
      s=R.play(s,legal[random(legal.length)]);
    }
  }
  assert.ok(corner && safety);
  for (const level of levels) {
    assert.ok(AI.corners.includes(select(corner,level)));
    const move=select(safety,level);
    assert.ok(!R.legal(R.play(safety,move),3-safety.color).some(i => AI.corners.includes(i)));
  }
  const bad=R.legal(safety).find(i=>R.legal(R.play(safety,i),3-safety.color).some(j=>AI.corners.includes(j)));
  const note=AI.review(safety,bad);
  assert.ok(note && R.legal(safety).includes(note.alternative)); assert.match(note.text,/모서리/);
});

test("review detects missed wins and mandatory defence, without mutating positions", () => {
  const win=omok([105,106,107,108],[120,121,122]);
  assert.equal(AI.review(win,80).alternative,109);
  assert.equal(AI.review(win,109),null);
  const danger=omok([104,30,31],[105,106,107,108]);
  assert.equal(AI.review(danger,80).alternative,109);
  const serialized=JSON.stringify(danger);
  const first=select(danger,"beginner"), second=select(danger,"beginner");
  assert.equal(first,second); assert.equal(JSON.stringify(danger),serialized);
});

test("both AIs finish legal games under a small search budget", () => {
  for (const game of ["reversi","omok"]) {
    let s=R.initial(game);
    while(!s.ended) {
      const result=AI.choose(s,"beginner",{nodes:64,ms:30});
      assert.ok(R.legal(s).includes(result.index)); assert.ok(result.reason.length>10);
      s=R.play(s,result.index); assert.ok(s.count<=225);
    }
    assert.equal(AI.choose(s),null);
  }
});
