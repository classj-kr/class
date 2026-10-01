"use strict";
const test=require("node:test"),assert=require("node:assert/strict");
const R=require("../learning/games/board-coach/janggi-rules.js"),AI=require("../learning/games/board-coach/janggi-ai.js");
const sq=(x,y)=>y*9+x;
function fixture(pieces,turn="c") {const board=Array(90).fill(null);for(const [p,x,y]of pieces)board[sq(x,y)]=p;return R.position(board,turn);}
function raw(pieces,x,y) {const s=fixture(pieces);return R.targets(s.board,sq(x,y)).sort((a,b)=>a-b);}
function move(s,fx,fy,tx,ty) {const a=R.play(s,{from:sq(fx,fy),to:sq(tx,ty)});assert.equal(a.ok,true,a.error);return a.state;}
const matePieces=[["cK",4,8],["hK",4,0],["cR",3,2],["cR",5,3],["cP",4,4]];

test("all sixteen formations have 32 pieces and each side's own orientation",()=>{
  for(const cho of R.FORMS)for(const han of R.FORMS){
    const s=R.initial(cho,han);assert.equal(s.board.filter(Boolean).length,32);
    for(const side of ["c","h"]) {
      const expected={K:1,A:2,R:2,C:2,H:2,E:2,P:5};
      for(const[t,n]of Object.entries(expected))assert.equal(s.board.filter(p=>p===side+t).length,n);
    }
    assert.equal([1,2,6,7].map(x=>s.board[sq(x,9)][1]).join(""),cho);
    assert.equal([7,6,2,1].map(x=>s.board[sq(x,0)][1]).join(""),han);
    assert.equal(R.inCheck(s),false);assert.equal(R.facing(s),false);
    assert.ok(R.actions(s).some(m=>m.kind==="pass"));
  }
  assert.equal(R.actions(R.initial()).length,32);
  assert.deepEqual(R.initial("bad","bad").board,R.initial().board);
});

test("horse and elephant cannot jump their blocking points",()=>{
  assert.equal(raw([["cH",4,4]],4,4).length,8);
  const horse=raw([["cH",4,4],["hP",4,3]],4,4);
  assert.equal(horse.length,6);assert.ok(!horse.includes(sq(3,2))&&!horse.includes(sq(5,2)));
  assert.equal(raw([["cE",4,4]],4,4).length,8);
  for(const blocker of [[4,3],[3,2]])assert.ok(!raw([["cE",4,4],["hP",...blocker]],4,4).includes(sq(2,1)));
  assert.ok(raw([["cE",0,0]],0,0).every(i=>i>=0&&i<90));
});

test("cannons require one non-cannon screen and cannot capture cannons",()=>{
  assert.deepEqual(raw([["cC",4,4]],4,4),[]);
  const p=[["cC",4,4],["cP",4,3],["hH",4,1]];
  assert.deepEqual(raw(p,4,4),[sq(4,1),sq(4,2)]);
  assert.deepEqual(raw([["cC",4,4],["hC",4,3]],4,4),[]);
  assert.deepEqual(raw([["cC",4,4],["hP",4,3],["hC",4,1]],4,4),[sq(4,2)]);
  assert.ok(raw([["cC",3,0],["hP",4,1],["hR",5,2]],3,0).includes(sq(5,2)));
  assert.ok(!raw([["cC",3,0],["hC",4,1],["hR",5,2]],3,0).includes(sq(5,2)));
  assert.ok(!raw([["cC",4,1],["hP",5,2]],4,1).includes(sq(5,2)));
});

test("palace lines constrain kings, guards, chariots and soldiers",()=>{
  assert.equal(raw([["cK",4,8]],4,8).length,8);
  assert.equal(raw([["cA",3,7]],3,7).length,3);
  assert.ok(!raw([["cA",4,7]],4,7).includes(sq(3,8)));
  assert.ok(raw([["cR",3,0]],3,0).includes(sq(5,2)));
  assert.ok(!raw([["cR",3,0],["hH",4,1]],3,0).includes(sq(5,2)));
  assert.ok(raw([["cP",3,2]],3,2).includes(sq(4,1)));
  assert.ok(!raw([["cP",3,7]],3,7).includes(sq(4,8)));
  assert.ok(raw([["hP",5,7]],5,7).includes(sq(4,8)));
  assert.ok(!raw([["cP",4,4]],4,4).includes(sq(4,5)));
});

test("king safety forbids pinned moves, ignoring check, and king capture",()=>{
  const pin=fixture([["cK",4,8],["hK",3,1],["hR",4,2],["cR",4,6]]);
  assert.equal(R.play(pin,{from:sq(4,6),to:sq(5,6)}).ok,false);
  assert.equal(R.play(pin,{from:sq(4,6),to:sq(4,2)}).ok,true);
  const check=fixture([["cK",4,8],["hK",3,1],["hR",4,2],["cR",0,9]]);
  assert.equal(R.inCheck(check),true);assert.ok(!R.actions(check).some(m=>m.kind==="pass"));
  assert.equal(R.play(check,{from:sq(0,9),to:sq(0,2)}).ok,false);
  for(const m of R.actions(check))assert.equal(R.inCheck(R.advance(check,m),"c"),false);
  const capture=fixture([["cK",4,8],["hK",3,1],["cR",3,4]]);
  assert.ok(!R.actions(capture).some(m=>m.capture==="hK"));
});

test("king attack scan agrees with full enemy move generation on blocked boards",()=>{
  let seed=93012;const random=n=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed%n;};
  const pieces=["R","C","H","E","P","A"];
  for(let n=0;n<2000;n++){
    const board=Array(90).fill(null);
    board[sq(3+random(3),7+random(3))]="cK";
    board[sq(3+random(3),random(3))]="hK";
    for(let p=0;p<20;p++){const at=random(90);if(!board[at])board[at]=(random(2)?"c":"h")+pieces[random(pieces.length)];}
    const s=R.position(board);
    for(const side of ["c","h"]){
      const king=board.indexOf(side+"K");
      const expected=board.some((piece,from)=>piece?.[0]===R.other(side)&&R.targets(board,from).includes(king));
      assert.equal(R.inCheck(s,side),expected,`board ${n}, ${side}`);
    }
  }
});

test("bikjang can be broken or accepted; it is not a flying king attack",()=>{
  const s=fixture([["cK",4,8],["hK",4,1],["cR",0,9]]);
  assert.equal(R.facing(s),true);assert.equal(R.inCheck(s),false);
  assert.ok(!R.actions(s).some(m=>m.from===sq(0,9)&&m.to===sq(0,8)));
  const continued=move(s,4,8,3,8);assert.equal(R.facing(continued),false);
  assert.equal(R.play(s,{kind:"bikjang"}).state.result.reason,"bikjang");
  const both=fixture([["cK",4,8],["hK",4,1],["hR",0,8]]);
  assert.equal(R.inCheck(both),true);assert.equal(R.play(both,{kind:"bikjang"}).ok,true);
});

test("mate, passes, repetition and repeated checking end with correct results",()=>{
  const s=fixture(matePieces),win=AI.mateInOne(s);assert.ok(win);
  const end=R.play(s,win).state;assert.equal(end.result.reason,"mate");assert.equal(end.result.winner,"c");
  assert.equal(R.play(end,{kind:"pass"}).ok,false);
  let passed=R.play(R.initial(),{kind:"pass"}).state;
  passed=R.play(passed,{kind:"pass"}).state;assert.equal(passed.result.reason,"passes");
  let repeated=fixture([["cK",4,8],["hK",3,1],["cR",0,5],["hR",8,4]]);
  for(let n=0;n<2;n++)for(const args of [[0,5,0,4],[8,4,8,3],[0,4,0,5],[8,3,8,4]])repeated=move(repeated,...args);
  assert.equal(repeated.result.reason,"repetition");assert.equal(repeated.result.winner,null);
  let perpetual=fixture([["cK",4,8],["hK",3,1],["cR",3,3],["cP",4,6]],"h");
  for(let n=0;n<2;n++)for(const args of [[3,1,4,1],[3,3,4,3],[4,1,3,1],[4,3,3,3]])perpetual=move(perpetual,...args);
  assert.equal(perpetual.result.reason,"perpetual-check");assert.equal(perpetual.result.winner,"h");
  const quiet={...R.initial(),quiet:99};assert.equal(R.play(quiet,{kind:"pass"}).state.result.reason,"quiet");
});

test("every level develops, wins immediately, blocks mate and avoids poisoned material",()=>{
  const free=fixture([["cK",4,8],["hK",4,1],["cR",0,5],["hR",0,2],["cP",4,6]]);
  const poison=fixture([["cK",4,8],["hK",3,1],["cR",0,5],["hP",0,3],["hR",0,0],["cP",4,6]]);
  for(const level of Object.keys(AI.LEVELS)){
    const opening=AI.choose(R.initial(),level);assert.equal(opening.move.piece,"cH");assert.ok(!opening.move.kind);
    const winner=AI.choose(fixture(matePieces),level);assert.equal(R.status(R.advance(fixture(matePieces),winner.move)).reason,"mate");
    const defense=fixture([...matePieces,["hR",0,2]],"h"),answer=AI.choose(defense,level);assert.equal(AI.mateInOne(R.advance(defense,answer.move)),null);
    assert.equal(AI.choose(free,level).move.capture,"hR");
    assert.notEqual(AI.choose(poison,level).move.capture,"hP");
    const fallback=AI.choose(poison,level,{nodes:0,ms:0});assert.notEqual(fallback.move.capture,"hP");
  }
});

test("all levels break an equal opening loop instead of repeating it, even without search time",()=>{
  for(const side of ["c","h"]){
    let s=R.position(R.initial().board,side);
    const cycle=side==="c"?[[82,65],[1,20],[65,82],[20,1]]:[[1,20],[82,65],[20,1],[65,82]];
    for(const[from,to]of cycle){const n=R.play(s,{from,to});assert.ok(n.ok);s=n.state;}
    assert.equal(R.repetitionCount(s),2);assert.equal(R.status(s).ended,false);
    const unchanged=JSON.stringify(s);
    for(const level of Object.keys(AI.LEVELS))for(const options of [{nodes:0,ms:0},{ms:10000}]){
      const answer=AI.choose(s,level,options),next=R.play(s,answer.move);
      assert.ok(next.ok);assert.equal(R.repetitionCount(next.state),1,`${side} ${level}: avoid replaying the same position`);
      assert.equal(answer.move.piece[1],"H","develop the other horse, not a random waiting move");
      assert.equal(AI.mateInOne(next.state),null);assert.equal(JSON.stringify(s),unchanged);
    }
  }
});

test("a quiet reversal is avoided even when the opponent has changed the full position",()=>{
  let s=R.initial();
  for(const[from,to]of [[82,65],[1,20],[65,82]])s=R.play(s,{from,to}).state;
  s=R.play(s,{from:27,to:36}).state;
  const reverse={from:82,to:65};
  assert.equal(R.repetitionCount(R.advance(s,reverse)),1,"this is not yet an exact repeated board");
  for(const level of Object.keys(AI.LEVELS))for(const options of [{nodes:0,ms:0},{ms:10000}]){
    const answer=AI.choose(s,level,options);
    assert.equal(R.same(answer.move,reverse),false,`${level} should prefer comparable new development`);
    assert.ok(!answer.move.kind);
  }
});

test("a losing side keeps the saving repetition draw and explains why the game ends",()=>{
  let s=fixture([["cK",4,8],["hK",3,1],["hR",8,4]],"h");
  const cycle=[[3,1,3,0],[4,8,5,8],[3,0,3,1],[5,8,4,8]];
  for(const args of [...cycle,...cycle.slice(0,3)])s=move(s,...args);
  assert.equal(s.turn,"c");assert.equal(R.repetitionCount(s),2);
  for(const level of Object.keys(AI.LEVELS))for(const options of [{nodes:0,ms:0},{ms:10000}]){
    const answer=AI.choose(s,level,options),next=R.play(s,answer.move);
    assert.ok(next.ok);assert.equal(next.state.result?.reason,"repetition",`${level}: do not lose to avoid a legitimate draw`);
    assert.equal(next.state.result.winner,null);assert.match(answer.reason,/세 번.*무승부/);
  }
});

test("every level accepts a saving bikjang instead of losing an undefended chariot",()=>{
  let s=R.initial("HEEH","EHEH");
  for(const [from,to] of [[58,57],[6,23],[87,58],[31,30],[58,29]]){
    const next=R.play(s,{from,to});assert.ok(next.ok);s=next.state;
  }
  assert.equal(R.facing(s),true);
  for(const move of R.boardMoves(s)){
    const next=R.advance(s,move);
    assert.ok(R.boardMoves(next).some(reply=>reply.capture==="hR"&&
      !R.boardMoves(R.advance(next,reply)).some(recapture=>recapture.to===reply.to&&recapture.capture)));
  }
  for(const level of Object.keys(AI.LEVELS)){
    const answer=AI.choose(s,level);assert.equal(answer.move.kind,"bikjang");
    assert.equal(R.play(s,answer.move).state.result.winner,null);
  }
});

test("intermediate and advanced defend a two-move mate instead of grabbing a soldier",()=>{
  // From a real loss: after repeated checks, the cannon's tempting capture
  // permits Chariot 49-29+, followed by Chariot 37-17 mate after every reply.
  let s=fixture([["hA",4,0],["hC",1,1],["hA",4,1],["hK",5,1],
    ["cR",6,2],["cC",7,2],["hR",1,3],["hP",5,3],["hP",6,3],["cR",8,3],
    ["cH",0,6],["cP",1,6],["cP",2,6],["cP",3,6],["cE",5,6],["cP",6,6],
    ["hR",0,8],["cA",4,8],["cK",3,9],["cC",4,9],["cA",5,9],["hC",8,9]],"h");
  s.ply=75;
  for(const args of [[0,8,0,9],[3,9,3,8],[0,9,0,8],[3,8,3,9],[0,8,0,9],[3,9,3,8]])s=move(s,...args);
  function checkingMateInTwo(state){
    for(const attack of R.boardMoves(state)){
      const next=R.advance(state,attack);if(!R.inCheck(next)||R.facing(next))continue;
      const replies=R.actions(next);
      if(replies.length&&replies.every(reply=>{
        const response=R.advance(next,reply);
        return !R.status(response).ended&&AI.mateInOne(response);
      }))return attack;
    }
    return null;
  }
  const greedy=R.actions(s).find(m=>m.from===sq(1,1)&&m.to===sq(1,6));assert.ok(greedy);
  assert.ok(checkingMateInTwo(R.advance(s,greedy)),"old capture loses by force");
  for(const level of ["intermediate","advanced"]){
    const answer=AI.choose(s,level,{ms:10000});
    const next=R.advance(s,answer.move);
    assert.equal(AI.mateInOne(next),null);
    assert.equal(checkingMateInTwo(next),null,`${level} must defend the king`);
  }
});

test("hints and reviews are legal and input state remains unchanged",()=>{
  const s=fixture(matePieces),before=JSON.stringify(s),quiet=R.actions(s).find(m=>m.kind==="pass");
  const feedback=AI.review(s,quiet);assert.ok(feedback);assert.match(feedback.text,/외통수/);
  assert.equal(R.play(s,feedback.alternative).state.result.reason,"mate");
  AI.choose(s);assert.equal(JSON.stringify(s),before);
  assert.equal(R.play(s,{from:-1,to:90}).ok,false);
});

test("deterministic legal play preserves both kings and pieces across all formations",()=>{
  let seed=2317;const random=n=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed%n;};
  for(const form of R.FORMS){
    let s=R.initial(form,"EHEH");
    for(let n=0;n<160&&!R.status(s).ended;n++){
      const options=R.actions(s),m=options[random(options.length)],before=JSON.stringify(s),next=R.play(s,m);assert.ok(next.ok);
      assert.equal(JSON.stringify(s),before);assert.equal(next.state.board.filter(p=>p?.[1]==="K").length,2);
      assert.equal(next.state.board.filter(Boolean).length,s.board.filter(Boolean).length-(m.capture?1:0));
      if(!m.kind)assert.equal(R.inCheck(next.state,s.turn),false);s=next.state;
    }
  }
});
