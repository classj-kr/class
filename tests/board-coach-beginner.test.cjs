'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const R=require('../learning/games/board-coach/rules.js'),A=require('../learning/games/board-coach/ai.js');
const C=require('../learning/games/chess/chess-rules.js'),CA=require('../learning/games/board-coach/chess-ai.js');
const J=require('../learning/games/board-coach/janggi-rules.js'),JA=require('../learning/games/board-coach/janggi-ai.js');
const samples=Array.from({length:32},(_,i)=>(i+1)*9973);
function random(seed){return ()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};}
function omok(own,other,color=1){const s=R.initial('omok');s.color=color;for(const i of own)s.board[i]=color;for(const i of other)s.board[i]=3-color;s.count=own.length+other.length;return s;}
function janggi(pieces,turn='c'){const b=Array(90).fill(null);for(const[p,x,y]of pieces)b[y*9+x]=p;return J.position(b,turn);}

test('beginner openings vary legally instead of always playing the stronger opening book',()=>{
  for(const [rules,ai,state]of [[C,CA,C.createInitialState('standard')],[J,JA,J.initial()]]){
    const before=JSON.stringify(state),seen=new Set();
    for(const seed of samples){
      const answer=ai.choose(state,'beginner',{random:random(seed)});
      const next=rules===C?C.applyMove(state,answer.move.from,answer.move.to,answer.move.promotion):J.play(state,answer.move);
      assert.ok(next.ok);assert.equal(answer.practice,true);assert.equal(answer.nodes,0);assert.ok(answer.depth<=1);
      seen.add(`${answer.move.from}:${answer.move.to}`);assert.equal(JSON.stringify(state),before);
    }
    assert.ok(seen.size>=4,`${seen.size} opening choices`);
  }
});

test('beginner Omok sometimes sees a four, sometimes leaves a genuine winning opportunity',()=>{
  for(const color of [1,2]){
    const s=omok([104,30,31],[105,106,107,108],color),before=JSON.stringify(s);let defended=0,missed=0;
    for(const seed of samples){
      const answer=A.choose(s,'beginner',{random:random(seed)}),next=R.play(s,answer.index);
      assert.equal(answer.practice,true);assert.equal(JSON.stringify(s),before);
      if(answer.index===109)defended++;else {assert.equal(R.play(next,109).winner,3-color);missed++;}
    }
    assert.ok(defended>0&&missed>=8,`defended=${defended}, missed=${missed}`);
    for(const level of ['level2','intermediate','level4','advanced'])assert.equal(A.choose(s,level).index,109);
    assert.equal(A.chooseHint(s,{nodes:100,ms:10000}).index,109,'hints do not inherit opponent mistakes');
  }
});

test('beginner Omok still completes five on every axis and both colors',()=>{
  for(const color of [1,2])for(const[dr,dc]of R.axes){
    const line=Array.from({length:5},(_,n)=>(5+dr*n)*15+5+dc*n),s=omok(line.slice(0,4),[0,1],color);
    for(const seed of samples.slice(0,4))assert.equal(R.play(s,A.choose(s,'beginner',{random:random(seed)}).index).winner,color);
  }
});

test('beginner Reversi leaves corners available without changing legal flips or turns',()=>{
  let position;const rng=random(4427);
  for(let game=0;game<12&&!position;game++){
    let s=R.initial('reversi');
    while(!s.ended&&s.count<46){
      const legal=R.legal(s),danger=i=>R.legal(R.play(s,i),3-s.color).some(j=>A.corners.includes(j));
      if(!legal.some(i=>A.corners.includes(i))&&legal.some(danger)&&legal.some(i=>!danger(i))){position=s;break;}
      s=R.play(s,legal[Math.floor(rng()*legal.length)]);
    }
  }
  assert.ok(position);let exposed=0;
  for(const seed of samples){
    const answer=A.choose(position,'beginner',{random:random(seed)});
    assert.ok(R.legal(position).includes(answer.index));
    if(R.legal(R.play(position,answer.index),3-position.color).some(i=>A.corners.includes(i)))exposed++;
  }
  assert.ok(exposed>=4,`${exposed} corner opportunities`);
  const stronger=A.choose(position,'intermediate');
  assert.ok(!R.legal(R.play(position,stronger.index),3-position.color).some(i=>A.corners.includes(i)));
});

test('beginner chess and Janggi can miss a mate threat while the coach still finds the defense',()=>{
  const chess=C.boardFromFen('r1bqk2r/pppp1ppp/2n2n2/2b1p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR b KQkq - 4 4','standard');
  const j=janggi([['cK',4,8],['hK',4,0],['cR',3,2],['cR',5,3],['cP',4,4],['hR',0,2]],'h');
  for(const [rules,ai,state]of [[C,CA,chess],[J,JA,j]]){
    let opportunities=0;
    for(const seed of samples){
      const answer=ai.choose(state,'beginner',{random:random(seed)}),next=rules.advance(state,answer.move);
      assert.equal(rules===C?C.isInCheck(next,state.turn):J.inCheck(next,state.turn),false);
      if(ai.mateInOne(next))opportunities++;
    }
    assert.ok(opportunities>=4,`${opportunities} opportunities to finish a simple mating attack`);
    const hint=ai.chooseHint(state,{depth:1,nodes:0,ms:0});
    assert.notEqual(hint.practice,true);assert.equal(ai.mateInOne(rules.advance(state,hint.move)),null);
  }
});

test('beginner always obeys check, pins and draw rules, including a bare-king bikjang',()=>{
  const chess=C.boardFromFen('4r1k1/8/8/8/8/8/4R3/4K3 w - - 0 1','standard');
  const j=janggi([['cK',4,8],['hK',3,1],['hR',4,2],['cR',0,9]]);
  for(const seed of samples){
    const c=CA.choose(chess,'beginner',{random:random(seed)}),cg=C.applyMove(chess,c.move.from,c.move.to,c.move.promotion);
    const a=JA.choose(j,'beginner',{random:random(seed)}),jg=J.play(j,a.move);
    assert.ok(cg.ok&&jg.ok);assert.equal(C.isInCheck(cg.state,'w'),false);assert.equal(J.inCheck(jg.state,'c'),false);
  }
  const ending=janggi([['cK',4,7],['hK',4,0],['hC',6,8]],'h');
  assert.equal(JA.choose(ending,'beginner').move.kind,'bikjang');
});

test('beginner Reversi and Omok finish complete legal games for fixed random seeds',()=>{
  for(const game of ['reversi','omok'])for(const seed of [51,947,8919,4224]){
    let state=R.initial(game);const rng=random(seed);
    while(!state.ended){
      const answer=A.choose(state,'beginner',{random:rng});assert.ok(R.legal(state).includes(answer.index));
      state=R.play(state,answer.index);assert.ok(state.count<=225);
    }
    assert.equal(A.choose(state,'beginner'),null);
  }
});
