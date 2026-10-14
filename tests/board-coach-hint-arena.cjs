"use strict";
// Follow only the shipping hint, against the shipping advanced opponent.
// Unfinished matches remain unfinished; they are not counted as draws.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const R=require('../learning/games/board-coach/rules.js'),A=require('../learning/games/board-coach/ai.js');
const C=require('../learning/games/chess/chess-rules.js'),CA=require('../learning/games/board-coach/chess-ai.js');
const J=require('../learning/games/board-coach/janggi-rules.js'),JA=require('../learning/games/board-coach/janggi-ai.js');
const game=process.argv[2],limit=Number(process.argv[3]||160),resume=process.argv.includes('--resume');
assert.ok(['chess','janggi','omok','reversi'].includes(game));
const output=path.resolve(__dirname,'../outputs/qa/hint-audit');fs.mkdirSync(output,{recursive:true});
const initial=()=>game==='chess'?C.createInitialState('standard'):game==='janggi'?J.initial():R.initial(game);
const status=s=>game==='chess'?C.status(s):game==='janggi'?J.status(s):s;
const side=s=>s.turn??s.color;
const checked=s=>game==='chess'?C.isInCheck(s):game==='janggi'?J.inCheck(s):false;
const ai=game==='chess'?CA:game==='janggi'?JA:A;
const sides=process.argv.includes('--first')?[true]:process.argv.includes('--second')?[false]:[true,false];
for(const hintFirst of sides){
  const file=path.join(output,`${game}-hint-${hintFirst?'first':'second'}.json`);
  const previous=resume?JSON.parse(fs.readFileSync(file,'utf8')):null;
  if(previous){assert.deepEqual(previous.settings,ai.HINT);if(previous.result!=='unfinished')continue;}
  let state=previous?.final||initial();const hintSide=previous?.hintSide??(hintFirst?side(state):game==='chess'?'b':game==='janggi'?'h':2);
  const moves=previous?.moves||[],started=Date.now()-(previous?.elapsed||0);
  const save=()=>{const end=status(state);const report={game,hintSide,settings:ai.HINT,opponent:ai.LEVELS.advanced,elapsed:Date.now()-started,
    result:!end.ended?'unfinished':!end.winner?'draw':end.winner===hintSide?'hint':'opponent',reason:end.reason,moves,final:state};
    fs.writeFileSync(file,JSON.stringify(report,null,2));return report;};
  while(!status(state).ended&&moves.length<limit){
    const isHint=side(state)===hintSide,before=JSON.stringify(state),wasChecked=checked(state),start=Date.now();
    const answer=isHint?ai.chooseHint(state):ai.choose(state,'advanced');assert.ok(answer);assert.equal(JSON.stringify(state),before);
    let label;
    if(game==='chess'){
      const next=answer.claim?C.claimDraw(state):C.applyMove(state,answer.move.from,answer.move.to,answer.move.promotion);
      assert.ok(next.ok);state=next.state;label=answer.claim?'무승부 선언':CA.label(answer.move);
    }else if(game==='janggi'){
      const next=J.play(state,answer.move);assert.ok(next.ok);state=next.state;label=JA.label(answer.move);
    }else{assert.ok(R.legal(state).includes(answer.index));state=R.play(state,answer.index);label=R.coord(answer.index,state.size);}
    moves.push({isHint,label,move:answer.move,index:answer.index,checked:wasChecked,depth:answer.depth,nodes:answer.nodes,ms:Date.now()-start});
    if(moves.length%20===0){save();console.log(JSON.stringify({game,hintFirst,plies:moves.length,last:label,seconds:Math.round((Date.now()-started)/1000)}));}
  }
  const report=save();console.log(JSON.stringify({game,hintFirst,result:report.result,reason:report.reason,plies:moves.length,seconds:Math.round(report.elapsed/1000)}));
}
