'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const R=require('../learning/games/board-coach/baduk-rules.js'),AI=require('../learning/games/board-coach/baduk-ai.js');
const levels=Object.keys(AI.LEVELS);
function position(rows,color=1,mode='capture'){
  const board=rows.join('').split('').map(Number);
  return {...R.initial(mode),size:rows.length,board,color,history:[R.key(board)]};
}
function randomizer(seed){return ()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};}
test('learning placement and area score agree with the existing multiplayer rules in seeded games',()=>{
  const context=vm.createContext({window:{addEventListener(){}},document:{},module:{exports:{}},console});
  vm.runInContext(fs.readFileSync(path.join(__dirname,'../learning/games/baduk/baduk.js'),'utf8'),context);
  const online=context.module.exports,random=randomizer(531);
  for(const mode of Object.keys(R.MODES))for(let game=0;game<4;game++){
    let s=R.initial(mode);
    for(let ply=0;ply<120&&!s.ended&&!s.scoring;ply++){
      const legal=[];
      for(let i=0;i<s.board.length;i++){
        const a=R.placement(s,i),b=online.tryMove(s.board,s.size,Math.floor(i/s.size),i%s.size,s.color,s.history);
        assert.equal(Boolean(a),Boolean(b));
        if(a){assert.equal(a.board.join(),b.board.join());assert.equal(a.captured.length,b.captured);legal.push(i);}
      }
      const a=R.preview(s),b=online.areaScore(s.board,s.size,R.MODES[mode].komi||0);
      assert.equal(a.black,b.black);assert.equal(a.white,b.white);
      s=R.play(s,legal.length?legal[Math.floor(random()*legal.length)]:-1);
    }
  }
});
test('captures precede suicide; edges do not wrap; positional superko cannot be recaptured',()=>{
  const s=position(['01200','12020','01200','00000','00000']);
  const next=R.play(s,7);assert.ok(next);assert.equal(next.captured.length,1);assert.equal(R.play(next,6),null);
  const suicide=position(['020','202','020']);assert.equal(R.placement(suicide,4),null);
  assert.deepEqual(R.neighbors(2,3),[5,1]);
  for(const i of [-2,9,1.5,NaN])assert.equal(R.play(suicide,i),null);
  assert.equal(R.play({...suicide,ended:true},0),null);
});
test('all three goals, passes, neutral regions and manual scoring have distinct transitions',()=>{
  let s=position(['010','120','010']);s.captures=[2,0];
  const win=R.play(s,5);assert.equal(win.ended,true);assert.equal(win.winner,1);
  s=R.initial('territory');s.count=39;const end=R.play(s,24);assert.equal(end.ended,true);assert.ok(end.scores);
  assert.equal(R.play(R.initial('capture'),-1),null);assert.equal(R.play(R.initial('territory'),-1),null);
  s=position(['100','020','000'],1,'standard');s=R.play(R.play(s,-1),-1);
  assert.equal(s.scoring,true);assert.deepEqual(R.legal(s),[]);assert.equal(R.play(s,2),null);
  const before=JSON.stringify(s),marked=R.toggleDead(s,4);assert.deepEqual(marked.dead,[4]);assert.equal(JSON.stringify(s),before);
  assert.deepEqual(R.toggleDead(marked,4).dead,[]);
  const resumed=R.resume(marked);assert.equal(resumed.scoring,false);assert.deepEqual(resumed.dead,[]);assert.equal(resumed.passes,0);assert.deepEqual(resumed.history,s.history);
  const scored=R.confirmScore(marked);assert.equal(scored.ended,true);assert.equal(scored.scores.white,7.5);assert.equal(scored.scores.black,9);
  assert.deepEqual(R.areaScore([1,0,2,0,0,0,0,0,0],3),{black:1,white:1});
  assert.equal(R.canPass({...R.initial(),board:Array(49).fill(1)}),true);
});
test('all levels and the independent hint take an immediate capture win for either color',()=>{
  for(const color of [1,2]){
    let s=position(['0000000','0001000','0012000','0001000','0000000','0000000','0000000']);
    if(color===2)s={...s,board:s.board.map(v=>v?3-v:0),color:2};
    s.history=[R.key(s.board)];s.captures[color-1]=2;
    const before=JSON.stringify(s);
    for(const level of levels){const answer=AI.choose(s,level,{random:()=>.99});assert.equal(answer.index,18);assert.equal(R.play(s,answer.index).winner,color);}
    assert.equal(AI.chooseHint(s).index,18);assert.equal(JSON.stringify(s),before);
  }
});
test('every level saves a capturable stone when losing it would end the game',()=>{
  const s=position(['0000000','0002000','0021000','0002000','0000000','0000000','0000000']);s.captures=[0,2];
  for(const level of levels)for(const random of [()=>0,()=>.99]){
    const answer=AI.choose(s,level,{random,ms:30});assert.equal(answer.index,18);assert.equal(AI.capturable(R.play(s,answer.index),1).length,0);
  }
  assert.equal(AI.chooseHint(s,{ms:50}).index,18);
});
test('explanations and red targets describe real liberties and review offers a safer move',()=>{
  const before=position(['0000000','0002000','0021000','0000000','0000000','0000000','0000000'],2);
  const note=AI.opponentView(before,24);assert.deepEqual(note.targets,[17]);assert.match(note.danger,/E5/);
  const s=R.play(before,24),text=AI.explain(s,18);assert.match(text,/단수에 몰린 내 돌/);assert.match(text,/3곳/);
  const review=AI.review(s,0);assert.ok(review);assert.equal(review.alternative,18);assert.equal(AI.capturable(R.play(s,review.alternative),1).length,0);
  const connected=position(['0000000','0000000','0010100','0000000','0000000','0000000','0000000']);
  assert.match(AI.explain(connected,17),/2덩어리를 연결/);
  assert.equal(AI.opponentView({...s,captures:[2,0],color:1},18)?.targets.length||0,0);
});
test('AI passes instead of filling the two eyes of its own connected group',()=>{
  const s=position(['11111','10101','11111','11111','11111'],1,'standard');
  for(const level of levels){const answer=AI.choose(s,level,{ms:50});assert.equal(answer.index,-1);assert.match(answer.reason,/차례를 넘기는 후보/);}
  assert.equal(AI.chooseHint(s,{ms:50}).index,-1);
});
test('seeded practice games finish legally; stronger searches preserve history and respect bounded work',()=>{
  for(const mode of ['capture','territory','standard'])for(let seed=1;seed<=3;seed++){
    let s=R.initial(mode),random=randomizer(seed),n=0;
    while(!s.ended&&!s.scoring&&n++<220){const answer=AI.choose(s,'beginner',{random});const next=R.play(s,answer.index);assert.ok(next);s=next;}
    assert.equal(s.ended||s.scoring,true,`${mode}: ${n} plies`);
  }
  const s=R.initial('standard'),before=JSON.stringify(s),start=Date.now();
  const answer=AI.chooseHint(s,{ms:100,nodes:100});assert.ok(R.play(s,answer.index));assert.equal(JSON.stringify(s),before);
  assert.ok(Date.now()-start<2000,'a small budget must return promptly');assert.ok(answer.depth>=1);
});
test('settled groups with larger eyes pass and end after the other player passes, even when behind',()=>{
  for(const color of [1,2])for(const level of levels){
    const s=position(['1112222','1012022','1012222','1112222','1012022','1112222','1112222'],color,'standard');
    s.passes=1;
    const answer=AI.choose(s,level);assert.equal(answer.index,-1);assert.equal(R.play(s,answer.index).scoring,true);
    assert.equal(AI.chooseHint(s).index,-1);
  }
  const opening=R.play(R.initial('standard'),-1);assert.notEqual(AI.choose(opening).index,-1,'one early pass does not end an unfinished board');
  const capture=position(['0000000','0001000','0012000','0001000','0000000','0000000','0000000'],1,'standard');capture.passes=1;
  assert.equal(AI.choose(capture,'beginner',{slip:0}).index,18,'still capture a stone in atari');
});
test('manual scoring preserves the exact board and turn until confirmation or resume',()=>{
  const s=R.play(R.initial('standard'),40),before=JSON.stringify(s),pending=R.beginScoring(s);
  assert.equal(pending.scoring,true);assert.equal(pending.ended,false);assert.equal(pending.count,s.count);assert.equal(pending.color,s.color);
  assert.deepEqual(pending.board,s.board);assert.deepEqual(pending.history,s.history);assert.equal(JSON.stringify(s),before);
  const resumed=R.resume(R.toggleDead(pending,40));assert.deepEqual(resumed.board,s.board);assert.deepEqual(resumed.dead,[]);assert.equal(resumed.color,s.color);
  assert.equal(R.beginScoring(R.initial('capture')).scoring,false);
});
