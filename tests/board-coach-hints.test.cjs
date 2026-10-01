"use strict";
const test=require('node:test'),assert=require('node:assert/strict');
const R=require('../learning/games/board-coach/rules.js'),A=require('../learning/games/board-coach/ai.js');
const C=require('../learning/games/chess/chess-rules.js'),CA=require('../learning/games/board-coach/chess-ai.js');
const J=require('../learning/games/board-coach/janggi-rules.js'),JA=require('../learning/games/board-coach/janggi-ai.js');
function janggi(pieces,turn='c'){const board=Array(90).fill(null);for(const[p,x,y]of pieces)board[y*9+x]=p;return J.position(board,turn);}

test('chess hint finds mate and offers a saving draw rather than endlessly fleeing',()=>{
  const winning=C.boardFromFen('7k/5Q2/6K1/8/8/8/r7/q7 w - - 100 51','standard');
  const answer=CA.chooseHint(winning);assert.ok(answer.move);
  assert.equal(C.status(C.advance(winning,answer.move)).reason,'checkmate');
  const losing=C.boardFromFen('4k3/8/8/8/8/8/8/R3K3 b - - 100 51','standard');
  const before=JSON.stringify(losing),hint=CA.chooseHint(losing);
  assert.equal(hint.claim,true);assert.ok(C.claimDraw(losing).ok);assert.equal(JSON.stringify(losing),before);
});

test('hint fallback protects an attacked queen even when analysis has no time',()=>{
  for(const fen of ['6k1/8/1p6/2p5/3Q4/8/8/1N4K1 w - - 0 1','1n4k1/8/8/3q4/2P5/1P6/8/6K1 b - - 0 1']){
    const s=C.boardFromFen(fen,'standard'),answer=CA.chooseHint(s,{nodes:0,ms:0});
    assert.equal(answer.move.piece[1],'Q');
    assert.ok(!C.allLegalMoves(C.advance(s,answer.move)).some(m=>m.capture?.[1]==='Q'));
  }
});

test('Janggi hint breaks a repeated position but still permits necessary king escapes',()=>{
  let s=J.initial();for(const[from,to]of [[82,65],[1,20],[65,82],[20,1]])s=J.play(s,{from,to}).state;
  const answer=JA.chooseHint(s,{ms:30000,nodes:120000});
  assert.equal(J.repetitionCount(J.advance(s,answer.move)),1);assert.equal(answer.move.piece[1],'H');
  const check=janggi([['cK',4,8],['hK',3,1],['hR',4,2],['cR',0,9]]);
  assert.ok(J.inCheck(check));
  const escape=JA.chooseHint(check,{ms:30000,nodes:40000}),next=J.play(check,escape.move);
  assert.ok(next.ok);assert.equal(J.inCheck(next.state,'c'),false);
});

test('Janggi hint uses an active defense in a position where the old hint shuffled its king',()=>{
  const s=janggi([['hR',0,0],['hA',3,0],['hC',4,0],['cC',1,1],['hK',3,1],['hA',4,1],
    ['hC',2,2],['hH',3,2],['hP',0,3],['cR',3,3],['hP',6,3],['hP',7,3],['hR',2,4],
    ['cP',0,6],['cP',1,6],['hP',4,6],['cP',8,6],['cR',0,8],['cK',4,8],['cA',3,9],['cA',5,9]]);
  s.ply=50;
  assert.equal(J.inCheck(s),false);
  const hint=JA.chooseHint(s,{nodes:120000,ms:30000});
  assert.notEqual(hint.move.piece?.[1],'K');assert.ok(!hint.move.kind);
  const next=J.play(s,hint.move);assert.ok(next.ok);assert.equal(JA.mateInOne(next.state),null);
});

test('Janggi hint defends a forcing attack instead of spending the move on material',()=>{
  let s=janggi([['hA',4,0],['hC',1,1],['hA',4,1],['hK',5,1],['cR',6,2],['cC',7,2],
    ['hR',1,3],['hP',5,3],['hP',6,3],['cR',8,3],['cH',0,6],['cP',1,6],['cP',2,6],
    ['cP',3,6],['cE',5,6],['cP',6,6],['hR',0,8],['cA',4,8],['cK',3,9],['cC',4,9],['cA',5,9],['hC',8,9]],'h');
  s.ply=75;for(const[from,to]of [[72,81],[84,75],[81,72],[75,84],[72,81],[84,75]])s=J.play(s,{from,to}).state;
  const forced=position=>J.boardMoves(position).some(attack=>{
    const next=J.advance(position,attack);if(!J.inCheck(next)||J.facing(next))return false;
    const replies=J.actions(next);return replies.length&&replies.every(reply=>{const response=J.advance(next,reply);return !J.status(response).ended&&JA.mateInOne(response);});
  });
  const greedy=J.actions(s).find(m=>m.from===10&&m.to===55);
  assert.ok(forced(J.advance(s,greedy)));
  const before=JSON.stringify(s),hint=JA.chooseHint(s,{ms:30000});
  assert.equal(forced(J.advance(s,hint.move)),false);assert.equal(JSON.stringify(s),before);
});

test('Janggi hint continues an equal opening but keeps a saving bikjang when losing material',()=>{
  let equal=J.initial();
  for(const[from,to]of [[82,65],[1,20],[88,69],[7,24],[54,55],[35,34],[58,57],[31,30]])equal=J.play(equal,{from,to}).state;
  assert.ok(J.facing(equal));
  const hint=JA.chooseHint(equal,{nodes:120000,ms:30000});
  assert.notEqual(hint.move.kind,'bikjang');assert.equal(J.status(J.play(equal,hint.move).state).ended,false);
  let losing=J.initial('HEEH','EHEH');
  for(const[from,to]of [[58,57],[6,23],[87,58],[31,30],[58,29]])losing=J.play(losing,{from,to}).state;
  const save=JA.chooseHint(losing,{nodes:120000,ms:30000});
  assert.equal(save.move.kind,'bikjang');assert.equal(J.play(losing,save.move).state.result.winner,null);
});

test('Janggi hint keeps mating material instead of exchanging its last chariot into a dead ending',()=>{
  // Actual old hint game, before move 172: R x R+, K x R left only a horse
  // and a home-palace guard against a bare king, then 100 aimless plies.
  const s=janggi([['hK',5,0],['hA',4,1],['hH',4,2],['hR',5,9],['cR',3,7],['cK',3,8]],'h');
  s.ply=171;
  const exchange=J.actions(s).find(m=>m.from===86&&m.to===66);assert.ok(exchange);
  const taken=J.play(s,exchange).state,dead=J.play(taken,{from:75,to:66}).state;
  assert.ok(JA.cannotForceMate(dead));assert.equal(JA.evaluate(dead,true),0);
  assert.ok(!JA.cannotForceMate(s));
  // A second mobile attacker, or enemy pieces blocking its king's exits,
  // requires real search and must not be declared a dead ending by material.
  const second=J.position(dead.board,'h');second.board[45]='hR';
  assert.equal(JA.cannotForceMate(second),false);
  const blocked=J.position(dead.board,'h');blocked.board[85]='cA';
  assert.equal(JA.cannotForceMate(blocked),false);
  const hint=JA.chooseHint(s,{nodes:400000,ms:30000});
  assert.equal(J.same(hint.move,exchange),false);assert.ok(J.play(s,hint.move).ok);
});

test('Janggi hint finishes a won palace attack instead of shuffling its king, on either side',()=>{
  // The final attack from an actual complete hint-versus-advanced game.
  // The chariot and horse seal the exits; the elephant must join the attack.
  const start=janggi([['hK',4,0],['cR',3,2],['cH',4,3],['cP',4,6],['cP',5,6],
    ['cA',3,8],['cE',2,9],['cA',3,9],['cK',5,9]]);
  for(const flip of [false,true]){
    let s=flip?J.position(start.board.slice().reverse().map(p=>p?J.other(p[0])+p[1]:null),'h'):start;
    const winner=s.turn;
    for(let ply=0;ply<5&&!J.status(s).ended;ply++){
      const hint=s.turn===winner?JA.chooseHint(s,{nodes:40000,ms:30000}):JA.choose(s,'advanced');
      const next=J.play(s,hint.move);assert.ok(next.ok);s=next.state;
    }
    assert.equal(J.status(s).reason,'mate');assert.equal(J.status(s).winner,winner);
  }
});

test('Reversi hints preserve a proven win all the way to the last move',()=>{
  let s={...R.initial('reversi'),color:2,count:53,board:[1,0,1,1,1,1,1,1,0,1,0,1,2,1,1,1,2,2,2,2,1,2,2,2,2,2,2,2,1,1,2,2,2,1,2,2,2,2,2,2,2,2,1,1,2,1,2,1,2,2,2,1,1,1,0,0,2,2,2,1,1,1,0,0]};
  const color=s.color,first=A.chooseHint(s);assert.equal(first.exact,true);assert.equal(first.score,12);
  while(!s.ended){const before=JSON.stringify(s),hint=A.chooseHint(s);assert.equal(hint.exact,true);assert.ok(R.legal(s).includes(hint.index));assert.equal(JSON.stringify(s),before);s=R.play(s,hint.index);}
  assert.equal(s.winner,color);assert.equal(s.board.filter(p=>p===color).length-s.board.filter(p=>p===3-color).length,12);
});

test('Reversi deeper hint search agrees with a separate exact solver before the eight-square cutoff',()=>{
  let seed=991,s=R.initial('reversi');
  while(!s.ended&&s.board.filter(v=>!v).length>9){seed=(Math.imul(seed,1664525)+1013904223)>>>0;const legal=R.legal(s);s=R.play(s,legal[seed%legal.length]);}
  assert.equal(s.board.filter(v=>!v).length,9);
  const color=s.color,memo=new Map();
  function solve(p){
    if(p.ended)return p.board.reduce((score,c)=>score+(c===color?1:c===3-color?-1:0),0);
    const key=p.board.join('')+p.color;if(memo.has(key))return memo.get(key);
    const scores=R.legal(p).map(i=>solve(R.play(p,i))),score=(p.color===color?Math.max:Math.min)(...scores);memo.set(key,score);return score;
  }
  const scores=R.legal(s).map(index=>({index,score:solve(R.play(s,index))}));
  const hint=A.chooseHint(s,{ms:30000});
  assert.ok(hint.depth>=9,'the fixture must actually search to the end');
  assert.equal(scores.find(m=>m.index===hint.index).score,Math.max(...scores.map(m=>m.score)));
});

test('Omok hints win immediately or block the opponents only winning square',()=>{
  for(const color of [1,2]){
    let s=R.initial('omok');s.color=color;for(const i of [110,111,112,113])s.board[i]=color;s.count=4;
    assert.equal(R.play(s,A.chooseHint(s,{ms:30000,nodes:2000}).index).winner,color);
    s=R.initial('omok');s.color=color;for(const i of [110,111,112,113])s.board[i]=3-color;s.board[109]=color;s.count=5;
    assert.equal(A.chooseHint(s,{ms:30000,nodes:2000}).index,114);
  }
});
