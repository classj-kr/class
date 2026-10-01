"use strict";
const test=require("node:test"),assert=require("node:assert/strict");
const R=require("../learning/games/board-coach/rules.js"),AI=require("../learning/games/board-coach/ai.js");
const C=require("../learning/games/chess/chess-rules.js"),CA=require("../learning/games/board-coach/chess-ai.js");
const J=require("../learning/games/board-coach/janggi-rules.js"),JA=require("../learning/games/board-coach/janggi-ai.js");
const levels=["beginner","intermediate","advanced"];
function randomizer(start){let seed=start;return n=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed%n;};}
function omok(own,other,color=1){const s=R.initial("omok");for(const i of own)s.board[i]=color;for(const i of other)s.board[i]=3-color;s.count=own.length+other.length;s.color=color;return s;}
function exactReversi(state,color,memo=new Map()){
  if(state.ended)return state.board.reduce((n,p)=>n+(p===color?1:p===3-color?-1:0),0);
  const k=state.board.join("")+state.color;if(memo.has(k))return memo.get(k);
  const answers=R.legal(state).map(i=>exactReversi(R.play(state,i),color,memo));
  const score=(state.color===color?Math.max:Math.min)(...answers);memo.set(k,score);return score;
}
const endgame=()=>({...R.initial("reversi"),color:2,count:53,board:[1,0,1,1,1,1,1,1,0,1,0,1,2,1,1,1,2,2,2,2,1,2,2,2,2,2,2,2,1,1,2,2,2,1,2,2,2,2,2,2,2,2,1,1,2,1,2,1,2,2,2,1,1,1,0,0,2,2,2,1,1,1,0,0]});

test("Reversi review preserves a winning corner sacrifice and corrects the losing alternative",()=>{
  const s=endgame();assert.equal(exactReversi(R.play(s,54),s.color),12);assert.equal(exactReversi(R.play(s,1),s.color),-6);
  assert.equal(AI.review(s,54),null,"do not replace a forced win with the old corner heuristic");
  const note=AI.review(s,1);assert.ok(note);assert.equal(exactReversi(R.play(s,note.alternative),s.color),12);assert.match(note.text,/12개 차/);
});

test("Reversi advanced and endgame reviews agree with an independent exact solver",()=>{
  const random=randomizer(77);let checked=0;
  for(let game=0;game<16;game++){
    let s=R.initial("reversi");while(!s.ended&&s.count<54){const legal=R.legal(s);s=R.play(s,legal[random(legal.length)]);}if(s.ended)continue;
    const memo=new Map(),scores=R.legal(s).map(index=>({index,score:exactReversi(R.play(s,index),s.color,memo)}));
    const top=Math.max(...scores.map(m=>m.score)),answer=AI.choose(s,"advanced");
    assert.equal(scores.find(m=>m.index===answer.index).score,top);
    for(const m of scores){const note=AI.review(s,m.index);if(m.score===top)assert.equal(note,null);if(note)assert.equal(scores.find(a=>a.index===note.alternative).score,top);}
    checked++;
  }
  assert.equal(checked,16);
});

test("every Omok level wins and blocks on every axis, both colors, including split fours",()=>{
  let checked=0;
  for(const color of [1,2])for(const[dr,dc]of R.axes)for(const gap of [0,1,2,3,4]){
    const line=Array.from({length:5},(_,n)=>(5+dr*n)*15+5+dc*n),four=line.filter((_,i)=>i!==gap);
    const win=omok(four,[2,17,32],color);
    for(const level of levels){const before=JSON.stringify(win),answer=AI.choose(win,level);assert.equal(R.play(win,answer.index).winner,color);assert.equal(JSON.stringify(win),before);checked++;}
    const blockedEnds=[(5-dr)*15+5-dc,(5+dr*5)*15+5+dc*5];
    const defend=omok(blockedEnds,four,color);
    for(const level of levels){const answer=AI.choose(defend,level),next=R.play(defend,answer.index);assert.equal(answer.index,line[gap]);assert.ok(!R.legal(next).some(i=>R.play(next,i).winner===3-color));checked++;}
  }
  assert.equal(checked,240);
});

test("Omok explanations acknowledge an opponent win before praising a forcing attack",()=>{
  const s=omok([110,111,112],[140,141,142,143]);
  const text=AI.explain(s,113);assert.match(text,/상대가 .*다섯 돌을 완성/);assert.doesNotMatch(text,/상대는.*막아야|두 곳 이상 생겨/);
  const both=omok([110,111,112,113],[140,141,142,143]);assert.match(AI.explain(both,114),/승리/);
});

test("every chess level protects an attacked unmoved queen even with no search budget",()=>{
  for(const level of levels)for(const fen of ['6k1/8/1p6/2p5/3Q4/8/8/1N4K1 w - - 0 1','1n4k1/8/8/3q4/2P5/1P6/8/6K1 b - - 0 1']){
    const s=C.boardFromFen(fen,"standard"),before=JSON.stringify(s),answer=CA.choose(s,level,{nodes:0,ms:0});
    const next=C.advance(s,answer.move);assert.equal(answer.move.piece[1],"Q");
    assert.ok(!C.allLegalMoves(next).some(m=>m.capture?.[1]==="Q"));assert.equal(JSON.stringify(s),before);
  }
});

test("all chess levels convert basic queen and rook endings without repetition or stalemate",()=>{
  const endings=[['7k/8/8/8/3Q4/8/8/K7 w - - 0 1','w'],['7k/8/8/8/3R4/8/8/K7 w - - 0 1','w'],['7k/8/8/4q3/8/8/8/K7 b - - 0 1','b'],['7k/8/8/4r3/8/8/8/K7 b - - 0 1','b']];
  for(const level of levels)for(const[fen,winner]of endings){
    let state=C.boardFromFen(fen,"standard"),plies=0;
    while(!C.status(state).ended&&plies<100){
      const answer=CA.choose(state,state.turn===winner?level:"beginner");
      if(answer.claim){state=C.claimDraw(state).state;break;}
      const next=C.applyMove(state,answer.move.from,answer.move.to,answer.move.promotion);assert.ok(next.ok);state=next.state;plies++;
    }
    assert.equal(C.status(state).reason,"checkmate",`${level}: ${fen}, ${plies} plies`);
    assert.equal(C.status(state).winner,winner);
  }
});

test("chess and janggi hints remain legal and their defensive explanations are true",()=>{
  const cs=C.boardFromFen('4r1k1/8/8/8/8/8/4R3/4K3 w - - 0 1',"standard");
  const board=Array(90).fill(null);for(const[p,x,y]of [["cK",4,8],["hK",3,1],["hR",4,2],["cR",0,9]])board[y*9+x]=p;
  const js=J.position(board);
  for(const level of levels){
    const c=CA.choose(cs,level),j=JA.choose(js,level),ct=C.applyMove(cs,c.move.from,c.move.to),jt=J.play(js,j.move);
    assert.ok(ct.ok&&jt.ok);assert.equal(C.isInCheck(ct.state,"w"),false);assert.equal(J.inCheck(jt.state,"c"),false);
    assert.match(j.reason,/더는 공격받지/);
  }
});

test("Reversi mobility and pass explanations match the resulting legal moves",()=>{
  const random=randomizer(271);let mobility=0,passes=0;
  for(let game=0;game<6;game++){
    let s=R.initial("reversi");
    while(!s.ended){
      const legal=R.legal(s);
      for(const index of legal){
        const text=AI.explain(s,index),next=R.play(s,index),match=text.match(/상대가 둘 곳은 (\d+)곳/);
        if(match){assert.equal(Number(match[1]),R.legal(next,3-s.color).length);mobility++;}
        if(text.includes("한 번 더 둘")){assert.equal(next.color,s.color);assert.equal(R.legal(next,3-s.color).length,0);passes++;}
      }
      s=R.play(s,legal[random(legal.length)]);
    }
  }
  assert.ok(mobility>0&&passes>0);
});
