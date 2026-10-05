'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const C=require('../learning/games/chess/chess-rules.js'),CA=require('../learning/games/board-coach/chess-ai.js');
const R=require('../learning/games/board-coach/rules.js'),AI=require('../learning/games/board-coach/ai.js');
function chess(fen,from,to){const before=C.boardFromFen(fen,'standard'),out=C.applyMove(before,from,to);assert.ok(out.ok,out.error);return {before,out,note:CA.opponentView(before,out.move)};}
function omok(stones,color=2){const s=R.initial('omok');for(const [side,indices]of stones)for(const i of indices)s.board[i]=side;s.color=color;s.count=s.board.filter(Boolean).length;return s;}
test('chess identifies an opened bishop attack and does not mutate the position',()=>{
  const {before,note}=chess('6k1/1b6/2p5/8/4R3/8/8/6K1 b - - 0 1','c6','c5');
  assert.deepEqual(note.targets,[C.squareIndex('e4')]);assert.match(note.summary,/비숍.*공격길/);assert.match(note.danger,/b7 → e4.*룩/);assert.match(note.response,/e4/);
  assert.equal(before.board[C.squareIndex('c6')],'bP');
});
test('chess does not warn about a pinned rook taking a queen',()=>{
  const {note}=chess('4k3/Q3r2p/8/8/8/8/8/4R1K1 b - - 0 1','h7','h6');
  assert.ok(!note.targets.includes(C.squareIndex('a7')));assert.doesNotMatch(note.danger,/퀸/);
});
test('chess supports either player color and prioritizes check',()=>{
  const white=chess('6k1/8/8/4r3/8/2P5/1B6/6K1 w - - 0 1','c3','c4');
  assert.deepEqual(white.note.targets,[C.squareIndex('e5')]);
  const check=chess('6k1/8/8/8/8/8/r7/4K3 b - - 0 1','a2','e2');
  assert.deepEqual(check.note.targets,[C.squareIndex('e1')]);assert.match(check.note.response,/체크|킹/);
});
test('finished chess games do not invent a next opponent plan',()=>{
  const {note,out}=chess('6k1/5ppp/8/8/8/8/5PPP/4R1K1 w - - 0 1','e1','e8');
  assert.equal(out.status.reason,'checkmate');assert.equal(note,null);
});
test('chess hints explain defense against a real hanging-piece threat',()=>{
  const {out}=chess('6k1/1b6/2p5/8/4R3/8/8/6K1 b - - 0 1','c6','c5');
  const hint=CA.chooseHint(out.state,{depth:2,nodes:20000,ms:1500});
  assert.match(hint.reason,/위협|체크/);assert.ok(C.allLegalMoves(out.state).some(m=>CA.same(m,hint.move)));
});
test('omok shows the immediate completion square and the four-stone line',()=>{
  const before=omok([[1,[108]],[2,[109,110,111]]]);const note=AI.opponentView(before,112);
  assert.deepEqual(note.targets,[113]);assert.deepEqual(note.lines,[[109,110,111,112,113]]);assert.match(note.response,/I8.*막/);
  assert.equal(before.board[112],0);
});
test('omok reports two winning points without promising one block can save it',()=>{
  const note=AI.opponentView(omok([[2,[110,111,112]]]),113);
  assert.deepEqual(note.targets,[109,114]);assert.match(note.response,/한 곳만.*모두 막을 수 없/);
});
test('omok prioritizes the human immediate win over blocking',()=>{
  const note=AI.opponentView(omok([[1,[30,31,32,33,108]],[2,[109,110,111]]]),112);
  assert.match(note.response,/E3.*먼저 이길/);
});
test('omok separates attack-building candidates from an immediate five',()=>{
  const s=omok([[2,[111,112]]]),note=AI.opponentView(s,113),after=R.play(s,113);
  assert.equal(AI.winningMoves(after,2).length,0);assert.ok(note.targets.length);assert.match(note.targetLabel,/다음 공격 후보/);assert.deepEqual(note.lines,[]);
  const end=AI.opponentView(omok([[2,[110,111,112,113]]]),114);assert.equal(end,null);
});
test('reversi reports actual flip and mobility counts from either side',()=>{
  const s=R.initial('reversi'),note=AI.opponentView(s,19);assert.match(note.summary,/1개.*4곳에서 3곳/);
  const next=R.play(s,19),white=AI.opponentView(next,18);assert.match(white.summary,/1개/);assert.ok(white.response.length);
});
test('reversi recognizes a captured corner and hides ended positions',()=>{
  const s=R.initial('reversi');s.board[1]=2;s.board[2]=1;
  assert.match(AI.opponentView(s,0).summary,/A1 모서리.*다시 뒤집을 수 없/);
  const end={...s,board:Array(64).fill(1)};end.board[0]=0;end.board[1]=2;
  assert.equal(AI.opponentView(end,0),null);
});
