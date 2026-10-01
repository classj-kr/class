"use strict";
// A paired, reproducible audit with the shipping time/node budgets. An unfinished
// game is reported separately and is never silently counted as a draw.
const fs=require("node:fs"),path=require("node:path"),crypto=require("node:crypto"),assert=require("node:assert/strict");
const B=require("../learning/games/board-coach/rules.js"),BA=require("../learning/games/board-coach/ai.js");
const C=require("../learning/games/chess/chess-rules.js"),CA=require("../learning/games/board-coach/chess-ai.js");
const J=require("../learning/games/board-coach/janggi-rules.js"),JA=require("../learning/games/board-coach/janggi-ai.js");
const selected=process.argv[2]||"all",games=selected==="all"?["reversi","omok","chess","janggi"]:[selected];
const extended=process.argv.includes("--extended"),resume=process.argv.includes("--resume"),pairOption=process.argv.find(arg=>arg.startsWith("--pair="));
const selectedPairs=pairOption?[Number(pairOption.slice(7))]:extended?[0,1]:[0,1,2];
assert.ok(games.every(game=>["reversi","omok","chess","janggi"].includes(game)),"unknown game");
assert.ok(selectedPairs.every(pair=>[0,1,2].includes(pair)),"unknown level pair");
const output=path.resolve(__dirname,"../tmp/board-coach-quality",extended?"extended":"");fs.mkdirSync(output,{recursive:true});
const pairs=[["beginner","intermediate"],["intermediate","advanced"],["beginner","advanced"]];
function starting(game,pair,variant=0){
  if(game==="chess"){
    const lines=[['d2d4','d7d5','c2c4','e7e6'],['e2e4','e7e5','g1f3','b8c6'],['e2e4','c7c5','g1f3','d7d6']];
    const extra=[['g1f3','d7d5','d2d4','g8f6'],['e2e4','c7c5','g1f3','d7d6']];
    let s=C.createInitialState("standard");for(const m of (extended?extra[variant]:lines[pair])){const next=C.applyMove(s,m.slice(0,2),m.slice(2,4));assert.ok(next.ok);s=next.state;}return s;
  }
  if(game==="janggi")return extended?J.initial(["HEHE","EHHE"][variant],["HEHE","EHHE"][variant]):J.initial(J.FORMS[pair],J.FORMS[3-pair]);
  let s=B.initial(game);
  if(game==="omok"){
    const lines=extended?[[112,113,97,127,96,128],[112,97,113,111,128,126]]:[[112,113,97,128],[112,97,113,96],[112,128,111,127]];
    for(const i of lines[extended?variant:pair])s=B.play(s,i);
  }
  else {
    let seed=extended?220+variant:120+pair;
    for(let n=0;n<8;n++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;const moves=B.legal(s);s=B.play(s,moves[seed%moves.length]);}
  }
  return s;
}
const status=(game,s)=>game==="chess"?C.status(s):game==="janggi"?J.status(s):{ended:s.ended,winner:s.winner||null,reason:s.ended?"board-end":null};
const first=(game,s)=>game==="chess"?s.turn==="w":game==="janggi"?s.turn==="c":s.color===1;
function run(game,pair,swap,variant,previous){
  const [low,high]=pairs[pair],sides=swap?[high,low]:[low,high];let state=previous?.final||starting(game,pair,variant);
  const initial=previous?.initial||JSON.parse(JSON.stringify(state)),moves=previous?previous.moves.slice():[],limit=game==="chess"?400:game==="janggi"?600:225;
  const started=Date.now();
  while(!status(game,state).ended&&moves.length<limit){
    const level=sides[first(game,state)?0:1],before=JSON.stringify(state),now=Date.now();
    const answer=game==="chess"?CA.choose(state,level):game==="janggi"?JA.choose(state,level):BA.choose(state,level);
    const ms=Date.now()-now;assert.ok(answer);assert.equal(JSON.stringify(state),before);
    let label;
    if(game==="chess"){
      if(answer.claim){const next=C.claimDraw(state);assert.ok(next.ok);state=next.state;label="draw claim";}
      else {const m=answer.move,next=C.applyMove(state,m.from,m.to,m.promotion);assert.ok(next.ok);state=next.state;label=CA.label(m);}
    }else if(game==="janggi"){const next=J.play(state,answer.move);assert.ok(next.ok);state=next.state;label=JA.label(answer.move);}
    else{assert.ok(B.legal(state).includes(answer.index));label=B.coord(answer.index,state.size);state=B.play(state,answer.index);}
    moves.push({level,label,depth:answer.depth,nodes:answer.nodes,ms});
  }
  const end=status(game,state),winnerFirst=end.winner&&(game==="chess"?end.winner==="w":game==="janggi"?end.winner==="c":end.winner===1);
  return {pair:[low,high],variant,sides,initial,final:state,moves,elapsed:(previous?.elapsed||0)+Date.now()-started,result:!end.ended?"unfinished":!end.winner?"draw":sides[winnerFirst?0:1],reason:end.reason};
}
// Capture hashes with the loaded modules so later file edits cannot relabel them.
const sourceHashes=Object.fromEntries(["ai.js","rules.js","chess-ai.js","../chess/chess-rules.js","janggi-ai.js","janggi-rules.js"].map(name=>[name,crypto.createHash("sha256").update(fs.readFileSync(path.resolve(__dirname,"../learning/games/board-coach",name))).digest("hex")]));
for(const game of games){
  const sources=game==="chess"?["chess-ai.js","../chess/chess-rules.js"]:game==="janggi"?["janggi-ai.js","janggi-rules.js"]:["ai.js","rules.js"];
  const filename=path.join(output,game+".json"),currentSources=Object.fromEntries(sources.map(name=>[name,sourceHashes[name]]));
  const report=resume?JSON.parse(fs.readFileSync(filename,"utf8")):{game,createdAt:new Date().toISOString(),suite:extended?"extended":"baseline",budgets:"shipping defaults",sources:currentSources,matches:[]};
  assert.deepEqual(report.sources,currentSources,"cannot resume with changed rules or AI");
  const save=match=>{
    report.updatedAt=new Date().toISOString();fs.writeFileSync(filename,JSON.stringify(report,null,2));
    console.log(JSON.stringify({game,pair:match.pair,variant:match.variant,sides:match.sides,result:match.result,reason:match.reason,plies:match.moves.length,seconds:Math.round(match.elapsed/1000)}));
  };
  if(resume){
    for(let i=0;i<report.matches.length;i++)if(report.matches[i].result==="unfinished"){
      const before=report.matches[i],pair=pairs.findIndex(p=>p.join()===before.pair.join());
      const match=run(game,pair,before.sides[0]===before.pair[1],before.variant||0,before);report.matches[i]=match;save(match);
    }
    continue;
  }
  for(const pair of selectedPairs)for(let variant=0;variant<(extended?2:1);variant++)for(const swap of [false,true]){
    const match=run(game,pair,swap,variant);report.matches.push(match);save(match);
  }
}
