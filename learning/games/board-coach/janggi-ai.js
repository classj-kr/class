(function(root,factory){
  if(typeof module==="object"&&module.exports)module.exports=factory(require("./janggi-rules.js"));
  else root.JanggiCoachAI=factory(root.JanggiCoachRules);
})(typeof globalThis!=="undefined"?globalThis:this,function(R){
  "use strict";
  const LEVELS=Object.freeze({
    beginner:{name:"초급",depth:2,nodes:9000,ms:500},
    intermediate:{name:"중급",depth:4,nodes:65000,ms:1200},
    advanced:{name:"상급",depth:6,nodes:200000,ms:2500}
  });
  const VALUES={R:1300,C:700,H:500,E:300,A:300,P:200,K:0};
  const NAMES={R:"차",C:"포",H:"마",E:"상",A:"사",P:"졸",K:"왕"};
  const name=piece=>piece?.[1]==="P"&&piece[0]==="h"?"병":NAMES[piece?.[1]];
  const object=word=>word+((word.charCodeAt(word.length-1)-0xac00)%28?"을":"를");
  const subject=word=>word+((word.charCodeAt(word.length-1)-0xac00)%28?"이":"가");
  const label=move=>move.kind==="pass"?"한 수 쉬기":move.kind==="bikjang"?"빅장 수락":`${name(move.piece)} ${R.coord(move.from)} → ${R.coord(move.to)}`;
  const MATE=100000;
  function evaluate(state){
    let score=0;
    for(let i=0;i<90;i++){
      const p=state.board[i];if(!p)continue;
      const side=p[0],t=p[1],x=i%9,y=Math.floor(i/9),home=side==="c"?9-y:y;
      const mobility=R.targets(state.board,i).length;
      let value=VALUES[t];
      if(t==="H")value+=mobility*8+(4-Math.abs(4-x))*8+(home>0?35:-25);
      if(t==="E")value+=mobility*7+(home>0?18:0);
      if(t==="R")value+=mobility*4+(home>0?24:0);
      if(t==="C")value+=mobility*5;
      if(t==="P"){
        value+=home>=6?(home-5)*18:0;
        for(const dx of [-1,1])if(x+dx>=0&&x+dx<9&&state.board[i+dx]===p)value+=18;
        if(state.ply<20&&home>3)value-=25;
      }
      if(t==="K"){
        value-=home===2?25:0;
        for(let a=0;a<90;a++)if(state.board[a]===side+"A"&&Math.abs(a%9-x)<=1&&Math.abs(Math.floor(a/9)-y)<=1)value+=16;
      }
      score+=side===state.turn?value:-value;
    }
    return score;
  }
  function order(moves){return moves.slice().sort((a,b)=>priority(b)-priority(a)||(a.from??99)-(b.from??99)||(a.to??99)-(b.to??99));}
  function priority(m){return m.kind?-10000:(m.capture?10*VALUES[m.capture[1]]-VALUES[m.piece[1]]:0);}
  function mateInOne(state){
    if(R.status(state).ended)return null;
    for(const move of order(R.boardMoves(state))){
      const next=R.advance(state,move);
      if(!R.facing(next)&&R.inCheck(next)&&!R.boardMoves(next).length)return move;
    }
    return null;
  }
  function roots(state){
    const all=order(R.actions(state)),safe=[];
    for(const move of all){
      const next=R.advance(state,move),end=R.status(next);
      if(end.winner===state.turn)return [move];
      if(end.ended){if(!end.winner)safe.push(move);continue;}
      if(!mateInOne(next))safe.push(move);
    }
    return safe.length?safe:all;
  }
  // Value of an immediate capture after allowing the cheapest legal recapture.
  function captureGain(state,move){
    if(!move.capture)return 0;
    const next=R.advance(state,move);
    const recaptured=R.boardMoves(next).some(m=>m.to===move.to&&m.capture);
    return VALUES[move.capture[1]]-(recaptured?VALUES[move.piece[1]]:0);
  }
  function fallbackScore(state,move){
    const next=R.advance(state,move),end=R.status(next);
    if(end.ended)return end.winner?(end.winner===state.turn?MATE:-MATE):0;
    let loss=0;
    for(const reply of R.boardMoves(next))if(reply.capture)loss=Math.max(loss,captureGain(next,reply));
    return -evaluate(next)-loss-(move.kind==="pass"?30:0);
  }
  function choose(state,level="beginner",options={}){
    if(R.status(state).ended)return null;
    const settings=LEVELS[level]||LEVELS.beginner,candidates=roots(state);
    if(!candidates.length)return null;
    const ranked=candidates.map(move=>({move,score:fallbackScore(state,move)})).sort((a,b)=>b.score-a.score);
    if(ranked[0].score>=MATE)return {move:ranked[0].move,reason:explain(state,ranked[0].move),depth:1,nodes:0};
    let best=ranked[0].move,nodes=0,completed=0;
    const stop={},deadline=Date.now()+(options.ms??settings.ms),budget=options.nodes??settings.nodes;
    // Reuse promising moves across iterative depths, not their scores: draw
    // results depend on repetition history as well as the board position.
    const preferred=new Map(),killers=[],history=new Map();
    const historyKey=m=>`${m.piece}:${m.to}`;
    function searchOrder(moves,key,ply){
      const previous=preferred.get(key),cutoffs=killers[ply]||[];
      const rank=m=>R.same(m,previous)?1e9:m.capture?1e6+priority(m):cutoffs.some(k=>R.same(k,m))?800000:m.kind?-10000:(history.get(historyKey(m))||0);
      return moves.map(move=>({move,score:rank(move)})).sort((a,b)=>b.score-a.score||(a.move.from??99)-(b.move.from??99)||(a.move.to??99)-(b.move.to??99)).map(a=>a.move);
    }
    function search(s,depth,alpha,beta,ply,qleft=3){
      if(++nodes>budget||(nodes%32===0&&Date.now()>deadline))throw stop;
      const end=R.status(s);
      if(end.ended)return end.winner?(end.winner===s.turn?MATE-ply:-MATE+ply):0;
      const checked=R.inCheck(s),moves=R.actions(s);
      let value=-Infinity;
      if(depth<=0){
        const stand=evaluate(s);
        if(!checked){value=stand;if(value>=beta)return value;alpha=Math.max(alpha,value);}
        if(qleft<=0)return checked?stand-100:value;
      }
      const key=R.key(s);let bestMove=null;
      for(const move of searchOrder(depth>0||checked?moves:moves.filter(m=>m.capture||m.kind==="bikjang"),key,ply)){
        const score=-search(R.advance(s,move),depth-1,-beta,-alpha,ply+1,depth<=0?qleft-1:qleft);
        if(score>value){value=score;bestMove=move;}
        alpha=Math.max(alpha,score);
        if(alpha>=beta){
          if(depth>0&&!move.capture&&!move.kind){
            killers[ply]=[move,...(killers[ply]||[]).filter(m=>!R.same(m,move))].slice(0,2);
            const hk=historyKey(move);history.set(hk,Math.min(100000,(history.get(hk)||0)+depth*depth));
          }
          break;
        }
      }
      if(bestMove&&(preferred.size<20000||preferred.has(key)))preferred.set(key,bestMove);
      return value;
    }
    // Keep the full one-ply capture safety evaluation as the fallback when a
    // device cannot finish depth two. Never replace it with a shallow partial scan.
    for(let depth=2;depth<=settings.depth;depth++){
      let top=-Infinity,candidate=best;
      try{
        for(const {move} of ranked.slice().sort((a,b)=>Number(R.same(b.move,best))-Number(R.same(a.move,best)))){
          const score=-search(R.advance(state,move),depth-1,-Infinity,-top,1);
          if(score>top){top=score;candidate=move;}
        }
        best=candidate;completed=depth;
      }catch(error){if(error!==stop)throw error;break;}
    }
    return {move:best,reason:explain(state,best),depth:completed,nodes};
  }
  function explain(state,move){
    const next=R.advance(state,move),end=R.status(next);
    if(move.kind==="bikjang")return "두 왕 사이가 비어 있어요. 빅장을 받아들이면 이 대국은 무승부로 끝나요.";
    if(move.kind==="pass")return end.ended?"양쪽이 연속으로 쉬어 무승부로 끝나요.":"말을 움직이지 않고 차례를 넘겨요. 장군을 받고 있을 때는 쉴 수 없어요.";
    const piece=name(move.piece),at=R.coord(move.to);
    if(end.reason==="mate")return `${object(piece)} ${at}에 두면 외통수예요. 상대 왕이 공격을 피할 방법이 없어요.`;
    if(R.inCheck(state))return `${object(piece)} ${at}로 옮기면 왕이 더는 공격받지 않아요.`;
    if(move.capture)return `${object(piece)} ${at}로 옮겨 상대 ${object(name(move.capture))} 잡아요.${R.boardMoves(next).some(m=>m.to===move.to&&m.capture)?" 상대가 이 말을 되잡을 수 있어요.":" 상대는 다음 수에 이 말을 바로 잡을 수 없어요."}`;
    if(R.inCheck(next))return `${object(piece)} ${at}로 옮기면 상대 왕이 공격받아요. 상대는 이 장군을 막아야 해요.`;
    if(R.facing(next))return "두 왕 사이의 길을 열어 빅장을 제안해요. 상대는 사이를 막거나 왕을 옮겨 계속 둘 수 있고, 받아들여 비길 수도 있어요.";
    if(move.piece[1]==="C")return `${object(piece)} ${at}로 옮겨요. 포는 포가 아닌 말 하나를 넘어야 움직일 수 있어요.`;
    const fromHome=state.turn==="c"?9-Math.floor(move.from/9):Math.floor(move.from/9);
    if(["H","E"].includes(move.piece[1])&&fromHome===0)return `${object(piece)} 첫 줄에서 꺼내요. ${at}에서 공격과 방어에 참여할 수 있어요.`;
    const before=R.boardMoves(state).filter(m=>m.from===move.from).length;
    const after=R.boardMoves({...next,turn:state.turn}).filter(m=>m.from===move.to).length;
    if(after>before)return `${object(piece)} ${at}로 옮기면 지금 배치에서 ${subject(piece)} 갈 수 있는 자리가 ${before}곳에서 ${after}곳으로 늘어요.`;
    return `${object(piece)} ${at}로 옮겨요.${R.boardMoves(next).some(m=>m.to===move.to&&m.capture)?" 상대가 이 말을 잡을 수 있으니 되잡을 수 있는지도 살펴보세요.":" 상대는 다음 수에 이 말을 바로 잡을 수 없어요."}`;
  }
  function loosePiece(state){
    return order(R.boardMoves(state)).find(m=>m.capture&&VALUES[m.capture[1]]>=300&&captureGain(state,m)>=300)||null;
  }
  function review(state,move){
    const next=R.advance(state,move),end=R.status(next);if(end.ended)return null;
    const win=mateInOne(state);
    if(win)return {alternative:win,text:`${label(win)}로 외통수를 만들 수 있었어요. 상대 왕을 공격할 자리도 찾아보세요.`};
    const danger=mateInOne(next);
    if(danger){
      const safe=roots(state).find(m=>!mateInOne(R.advance(state,m)));
      if(safe)return {alternative:safe,text:`상대가 ${label(danger)}로 외통수를 만들 수 있어요. ${label(safe)}도 살펴보세요.`};
    }
    const loose=loosePiece(next);
    if(loose&&(!move.capture||VALUES[move.capture[1]]<captureGain(next,loose))){
      const safe=order(R.actions(state)).find(m=>!loosePiece(R.advance(state,m))&&!mateInOne(R.advance(state,m)));
      if(safe)return {alternative:safe,text:`상대가 ${R.coord(loose.to)}의 ${object(name(loose.capture))} 잡으면 손해가 커요. ${label(safe)}도 살펴보세요.`};
    }
    return null;
  }
  return {LEVELS,VALUES,NAMES,name,label,evaluate,choose,explain,review,mateInOne,roots};
});
