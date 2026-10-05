"use strict";
const test=require('node:test'),assert=require('node:assert/strict');
const R=require('../learning/games/board-coach/janggi-rules.js');
const AI=require('../learning/games/board-coach/janggi-ai.js');
const sq=(x,y)=>y*9+x;
function position(pieces,turn='c'){
  const board=Array(90).fill(null);for(const[p,x,y]of pieces)board[sq(x,y)]=p;
  return R.position(board,turn);
}
// Screenshot at move 24, just before the AI moves its soldier from 46 to 47.
// Moving the soldier uncovers Horse 56-37 against the user's chariot.
function screenshot(){
  const s=position([
    ['hR',0,0],['hE',2,0],['hA',3,0],['hA',5,0],['hE',6,0],['hR',8,0],
    ['hC',0,1],['hK',4,1],['hC',4,2],['cR',6,2],
    ['hP',0,3],['hP',3,3],['hP',4,3],['hP',5,3],['hP',8,4],['hH',3,4],['hH',5,4],
    ['cP',1,6],['cP',2,6],['cP',4,6],['cP',6,6],['cP',7,6],
    ['cH',2,7],['cC',3,7],['cC',4,7],['cH',6,7],['cK',4,8],
    ['cR',1,9],['cE',2,9],['cA',3,9],['cA',5,9],['cE',6,9]
  ],'h');s.ply=23;return s;
}
test('opponent explanation finds the discovered horse attack in the screenshot, for either color',()=>{
  for(const flip of [false,true]){
    const original=screenshot(),s=flip?R.position(original.board.slice().reverse().map(p=>p?R.other(p[0])+p[1]:null),'c'):original;
    const at=i=>flip?89-i:i,move=R.actions(s).find(m=>m.from===at(32)&&m.to===at(33));
    const before=JSON.stringify(s),view=AI.opponentView(s,move);
    assert.ok(view.targets.includes(at(24)));
    assert.match(view.summary,/공격이 생겼어요/);assert.match(view.danger,/마.*차/);
    assert.ok(view.danger.includes(R.coord(at(41))+' → '+R.coord(at(24))));
    assert.match(view.response,/차를 피하거나 지키/);
    const current=R.play(s,move).state,escape=R.actions(current).find(m=>m.from===at(24)&&m.to===at(25));
    const reason=AI.explainHint(current,escape);
    assert.match(reason,/마.*차.*공격을 피해요/);assert.doesNotMatch(reason,/갈 수 있는 자리/);
    assert.equal(JSON.stringify(s),before,'commentary must not alter the position');
  }
});
test('pinned attackers do not produce a false chariot warning',()=>{
  const s=position([['hK',4,1],['hH',4,4],['hP',0,3],['cK',3,8],['cR',4,6],['cR',6,5]],'h');
  const move=R.actions(s).find(m=>m.from===27&&m.to===36),after=R.play(s,move).state;
  assert.ok(R.targets(after.board,sq(4,4)).includes(sq(6,5)));
  assert.ok(!R.boardMoves({...after,turn:'h'}).some(m=>m.to===sq(6,5)));
  assert.ok(!AI.opponentView(s,move).targets.includes(sq(6,5)));
});
test('check is explained before lower-priority material threats',()=>{
  const s=position([['cK',4,8],['cR',0,9],['hK',3,1],['hR',0,2]],'h');
  const m=R.actions(s).find(m=>m.from===18&&m.to===22),view=AI.opponentView(s,m);
  assert.match(view.summary,/장군/);assert.match(view.danger,/이번 수에 장군을 해소/);
  assert.ok(view.targets.includes(sq(4,8)));assert.match(view.response,/왕을 피하거나/);
});
test('completed search provides a legal, conditional continuation for the opponent panel',()=>{
  const s=screenshot(),before=JSON.stringify(s),answer=AI.choose(s,'advanced',{ms:10000});
  assert.ok(answer.line.length>=3);assert.ok(R.same(answer.line[0],answer.move));
  let current=s;for(const move of answer.line){const next=R.play(current,move);assert.ok(next.ok);current=next.state;}
  const view=AI.opponentView(s,answer.move,answer.line);
  assert.match(view.forecast,/내가 .*로 응수하면, 상대는/);assert.match(view.forecast,/내 수가 달라지면/);
  assert.equal(AI.opponentView(s,answer.move,[answer.move,{from:-1,to:500}]).forecast,'');
  assert.equal(JSON.stringify(s),before);
});
test('interrupted searches never attach a partial search line to their fallback',()=>{
  const s=screenshot(),answer=AI.choose(s,'advanced',{nodes:0,ms:0});
  assert.equal(answer.line.length,1);assert.ok(R.same(answer.line[0],answer.move));
  assert.equal(AI.opponentView(s,answer.move,answer.line).forecast,'');
});
test('ended games do not retain threat markers or a plan for a next turn',()=>{
  const s=position([['cK',4,8],['hK',3,1]],'h');s.passes=1;
  const view=AI.opponentView(s,{kind:'pass'});
  assert.match(view.summary,/무승부/);assert.deepEqual(view.targets,[]);assert.equal(view.forecast,'');
});
