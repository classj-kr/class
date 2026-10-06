(function(root,factory){
  if(typeof module==="object"&&module.exports)module.exports=factory(require("./janggi-rules.js"));
  else root.JanggiCoachAI=factory(root.JanggiCoachRules);
})(typeof globalThis!=="undefined"?globalThis:this,function(R){
  "use strict";
  const LEVELS=Object.freeze({
    // Beginners get a fallible practice opponent; stronger opponents and
    // teaching hints retain tactical safety and their own search budgets.
    beginner:{name:"레벨 1",depth:1,nodes:0,ms:0,practice:true},
    level2:{name:"레벨 2",depth:1,nodes:3500,ms:250},
    intermediate:{name:"레벨 3",depth:2,nodes:9000,ms:500},
    level4:{name:"레벨 4",depth:3,nodes:16000,ms:700},
    advanced:{name:"레벨 5",depth:3,nodes:25000,ms:900}
  });
  const HINT=Object.freeze({depth:8,nodes:600000,ms:5000,kingTempo:28,coaching:true});
  const VALUES={R:1300,C:700,H:500,E:300,A:300,P:200,K:0};
  const NAMES={R:"차",C:"포",H:"마",E:"상",A:"사",P:"졸",K:"왕"};
  const name=piece=>piece?.[1]==="P"&&piece[0]==="h"?"병":NAMES[piece?.[1]];
  const object=word=>word+((word.charCodeAt(word.length-1)-0xac00)%28?"을":"를");
  const subject=word=>word+((word.charCodeAt(word.length-1)-0xac00)%28?"이":"가");
  const label=move=>move.kind==="pass"?"한 수 쉬기":move.kind==="bikjang"?"빅장 수락":`${name(move.piece)} ${R.coord(move.from)} → ${R.coord(move.to)}`;
  const MATE=100000;
  function cannotForceMate(state){
    const pieces={c:[],h:[]};for(const p of state.board)if(p)pieces[p[0]].push(p[1]);
    // With only a bare king to attack, one mobile attacker cannot cover every
    // palace escape. Home-palace guards cannot join that attack. Keep this
    // conservative: an enemy guard or other piece can change the geometry.
    return ['c','h'].some(side=>pieces[side].length===1&&pieces[side][0]==='K'&&
      pieces[R.other(side)].filter(p=>!['K','A'].includes(p)).length<=1);
  }
  function evaluate(state,coaching=false){
    if(cannotForceMate(state))return 0;
    const kings=coaching?{c:state.board.indexOf('cK'),h:state.board.indexOf('hK')}:null;
    const pressure=coaching?{c:new Uint8Array(90),h:new Uint8Array(90)}:null;
    const attackers={c:0,h:0},late=coaching&&state.board.filter(Boolean).length<=14;
    let score=0;
    for(let i=0;i<90;i++){
      const p=state.board[i];if(!p)continue;
      const side=p[0],t=p[1],x=i%9,y=Math.floor(i/9),home=side==="c"?9-y:y;
      const reach=R.targets(state.board,i),mobility=reach.length;
      let value=VALUES[t];
      if(late&&t==='A')value=160;
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
      if(coaching&&!['K','A'].includes(t)){
        const king=kings[R.other(side)],ky=Math.floor(king/9),kx=king%9;
        let nearPalace=false;
        for(const to of reach)if(to%9>=3&&to%9<=5&&(side==='c'?to<27:to>=63)){
          pressure[side][to]++;nearPalace=true;
        }
        if(nearPalace)attackers[side]++;
        if(late){
          // Bring the mobile pieces together around the enemy palace. Empty
          // squares far from that palace must not outweigh a mating attack.
          const distance=Math.abs(x-kx)+Math.abs(y-ky);
          value+=(13-distance)*({R:4,C:5,H:9,E:7,P:8}[t]||0);
        }
      }
      score+=side===state.turn?value:-value;
    }
    if(coaching)for(const side of ['c','h']){
      const enemy=R.other(side),king=kings[enemy];
      const exits=R.targets(state.board,king),covered=exits.filter(i=>pressure[side][i]).length;
      const attacked=pressure[side][king]>0;
      const coordination=Math.min(3,attackers[side]);
      const value=pressure[side].filter(Boolean).length*6+covered*18+
        (attacked?24:0)+coordination*coordination*14;
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
  function fallbackScore(state,move,coaching=false,drawScore=0){
    const next=R.advance(state,move),end=R.status(next);
    if(end.ended)return end.winner?(end.winner===state.turn?MATE:-MATE):drawScore;
    if(cannotForceMate(next))return drawScore;
    let loss=0;
    for(const reply of R.boardMoves(next))if(reply.capture)loss=Math.max(loss,captureGain(next,reply));
    return -evaluate(next,coaching)-loss-(move.kind==="pass"?30:0);
  }
  function repetitionCost(state,move){
    const next=R.advance(state,move);
    // A legitimate draw may be the only way to save the game. Terminal results
    // retain their full value, and every legal defense remains available.
    if(R.status(next).ended)return 0;
    const repeated=R.repetitionCount(next)>1;
    const previous=state.history.findLast(h=>h.mover===state.turn)?.move;
    const reversed=!move.kind&&!move.capture&&previous&&!previous.kind&&
      previous.from===move.to&&previous.to===move.from&&previous.piece===move.piece;
    // Less than a third of a soldier's value: prefer a fresh, comparable plan,
    // but keep a necessary retreat over losing material or allowing mate.
    return repeated?48:reversed?18:0;
  }
  function choose(state,level="beginner",options={}){
    if(R.status(state).ended)return null;
    const settings={...(LEVELS[level]||LEVELS.beginner),...options};
    const practice=settings.practice&&!settings.coaching,candidates=practice?order(R.actions(state)):roots(state);
    const drawScore=settings.coaching?-120:0;
    if(!candidates.length)return null;
    if(practice){
      const win=candidates.find(move=>R.status(R.advance(state,move)).winner===state.turn);
      if(win)return {move:win,line:[win],reason:explain(state,win),depth:1,nodes:0,practice:true};
    }
    if(cannotForceMate(state)){
      // Material alone must not make the opponent reject a settled ending.
      // Keep the actual game rules: accept a legal draw, otherwise offer a pass.
      // roots() still gives an immediate win priority over any draw policy.
      const draw=candidates.find(m=>m.kind==='bikjang')||candidates.find(m=>{
        const end=R.status(R.advance(state,m));return end.ended&&!end.winner;
      })||candidates.find(m=>m.kind==='pass');
      if(draw)return {move:draw,line:[draw],reason:explain(state,draw),depth:0,nodes:0};
    }
    if(practice){
      // Accept an offered bikjang, and preserve a saving repetition draw.
      const draw=candidates.find(m=>m.kind==='bikjang')||(evaluate(state)<-100&&candidates.find(m=>{
        const end=R.status(R.advance(state,m));return end.ended&&!end.winner;
      }));
      const random=options.random||Math.random,board=candidates.filter(m=>!m.kind);
      const developing=board.filter(m=>!['K','A'].includes(m.piece[1])||m.capture);
      const choices=random()<.65?(developing.length?developing:board):board.map(move=>({move,
        score:-evaluate(R.advance(state,move))-repetitionCost(state,move)
      })).sort((a,b)=>b.score-a.score).slice(0,3).map(m=>m.move);
      const move=draw||choices[Math.min(choices.length-1,Math.floor(random()*choices.length))]||candidates[0];
      return {move,line:[move],reason:explain(state,move),depth:1,nodes:0,practice:true};
    }
    const ranked=candidates.map(move=>{
      // An unforced king shuffle should not win a near tie over developing or
      // defending with another piece. Captures and every check escape keep
      // their value; this is far smaller than even one soldier.
      const idleKing=move.piece?.[1]==="K"&&!move.capture&&!R.inCheck(state);
      const cost=repetitionCost(state,move)+(idleKing?(settings.kingTempo||0):0);
      return {move,cost,score:fallbackScore(state,move,settings.coaching,drawScore)-cost};
    }).sort((a,b)=>b.score-a.score);
    if(ranked[0].score>=MATE)return {move:ranked[0].move,line:[ranked[0].move],reason:explain(state,ranked[0].move),depth:1,nodes:0};
    let best=ranked[0].move,bestLine=[best],nodes=0,completed=0;
    const stop={},deadline=Date.now()+(options.ms??settings.ms),budget=options.nodes??settings.nodes;
    // Reuse promising moves across iterative depths, not their scores: draw
    // results depend on repetition history as well as the board position.
    const preferred=new Map(),killers=[],history=new Map(),lines=[];
    const historyKey=m=>`${m.piece}:${m.to}`;
    function searchOrder(moves,key,ply){
      const previous=preferred.get(key),cutoffs=killers[ply]||[];
      const rank=m=>R.same(m,previous)?1e9:m.capture?1e6+priority(m):cutoffs.some(k=>R.same(k,m))?800000:m.kind?-10000:(history.get(historyKey(m))||0);
      return moves.map(move=>({move,score:rank(move)})).sort((a,b)=>b.score-a.score||(a.move.from??99)-(b.move.from??99)||(a.move.to??99)-(b.move.to??99)).map(a=>a.move);
    }
    function search(s,depth,alpha,beta,ply,qleft=3){
      lines[ply]=[];
      if(++nodes>budget||(nodes%32===0&&Date.now()>deadline))throw stop;
      const end=R.status(s);
      if(end.ended)return end.winner?(end.winner===s.turn?MATE-ply:-MATE+ply):(s.turn===state.turn?drawScore:-drawScore);
      if(cannotForceMate(s))return s.turn===state.turn?drawScore:-drawScore;
      const checked=R.inCheck(s),moves=settings.coaching?null:R.actions(s);
      let value=-Infinity;
      if(depth<=0){
        const stand=evaluate(s,settings.coaching);
        if(!checked){value=stand;if(value>=beta)return value;alpha=Math.max(alpha,value);}
        if(qleft<=0)return checked?stand-100:value;
      }
      const key=R.key(s),legal=moves||R.actions(s);let bestMove=null;
      const forcing=move=>{
        if(move.capture||move.kind==='bikjang')return true;
        // Finish short forcing checks at the horizon at every search level.
        // Lowering strategic depth must not teach ignoring an immediate mate.
        if(qleft<2||move.kind)return false;
        const board=s.board.slice();board[move.to]=board[move.from];board[move.from]=null;
        return R.inCheck({board,turn:R.other(s.turn)});
      };
      for(const move of searchOrder(depth>0||checked?legal:legal.filter(forcing),key,ply)){
        const score=-search(R.advance(s,move),depth-1,-beta,-alpha,ply+1,depth<=0?qleft-1:qleft);
        if(score>value){value=score;bestMove=move;lines[ply]=[move,...(lines[ply+1]||[])].slice(0,4);}
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
      let top=-Infinity,candidate=best,candidateLine=bestLine;
      try{
        for(const {move,cost} of ranked.slice().sort((a,b)=>Number(R.same(b.move,best))-Number(R.same(a.move,best)))){
          // Shift the search window as well as the result by the root cost.
          const score=-search(R.advance(state,move),depth-1,-Infinity,-(top+cost),1)-cost;
          if(score>top){top=score;candidate=move;candidateLine=[move,...(lines[1]||[])].slice(0,5);}
        }
        best=candidate;bestLine=candidateLine;completed=depth;
      }catch(error){if(error!==stop)throw error;break;}
    }
    return {move:best,line:bestLine,reason:explain(state,best),depth:completed,nodes};
  }
  function chooseHint(state,options={}){
    const answer=choose(state,"advanced",{...HINT,...options});
    if(answer)answer.reason=explainHint(state,answer.move,answer.line);
    return answer;
  }
  // Inspect attacks in the current layout without pretending the defender has
  // actually passed. Only legal captures count; pinned attackers cannot threaten.
  function captureThreats(state,side){
    const view={...state,turn:side,result:null};
    return R.boardMoves(view).filter(m=>m.capture).map(move=>({move,gain:captureGain(view,move)}))
      .sort((a,b)=>b.gain-a.gain||VALUES[b.move.capture[1]]-VALUES[a.move.capture[1]]);
  }
  function usefulThreats(state,side){
    const seen=new Set();
    return captureThreats(state,side).filter(t=>t.gain>0&&!seen.has(t.move.to)&&seen.add(t.move.to));
  }
  function threatText(threat){
    const m=threat.move;
    return `상대 ${subject(name(m.piece))} ${R.coord(m.from)} → ${R.coord(m.to)}로 내 ${object(name(m.capture))} 잡을 수 있어요.`;
  }
  // Keep only a legal continuation of the completed search. A line is an
  // example dependent on our reply, never a promise of the opponent's next move.
  function legalLine(state,line){
    const out=[];let current=state;
    for(const request of (line||[]).slice(0,3)){
      const played=R.play(current,request);if(!played.ok)break;
      out.push({before:current,move:played.move,after:played.state});current=played.state;
    }
    return out;
  }
  function nextPurpose(step,owner){
    const m=step.move,end=R.status(step.after);
    if(end.ended)return end.winner===owner?"외통수로 끝내는 전개예요.":end.winner?"대국이 끝나는 전개예요.":"무승부로 끝나는 전개예요.";
    if(m.capture)return `내 ${object(name(m.capture))} 잡는 전개예요.`;
    if(R.inCheck(step.after))return "내 왕에게 장군을 부르는 전개예요.";
    const danger=usefulThreats(step.after,owner)[0];
    if(danger)return `${R.coord(danger.move.to)}의 내 ${object(name(danger.move.capture))} 노리는 전개예요.`;
    return "자리를 잡는 전개를 예상했어요.";
  }
  function opponentView(before,move,line=[]){
    const played=R.play(before,move);if(!played.ok)return null;
    const after=played.state,side=before.turn,end=R.status(after),piece=name(move.piece);
    if(end.ended)return {title:label(move),summary:explain(before,move),danger:"",response:"",forecast:"",targets:[]};
    if(cannotForceMate(after)&&!R.inCheck(after))return {
      title:label(move),summary:explain(before,move),danger:'남은 말로는 외통수를 강제하기 어려운 종반이에요.',
      response:after.passes===1?'지금 ‘한 수 쉬기’를 누르면 양쪽이 연속으로 쉬어 무승부로 끝나요.':R.facing(after)?'‘빅장 수락’을 누르면 무승부로 마칠 수 있어요.':'빅장이나 양쪽의 연속 ‘한 수 쉬기’로 무승부를 마칠 수 있어요.',
      forecast:'',targets:[]
    };
    const threats=usefulThreats(after,side),old=usefulThreats(before,side);
    const fresh=threats.find(t=>!old.some(o=>o.move.to===t.move.to&&o.move.from===t.move.from));
    let summary;
    if(R.inCheck(after))summary="상대가 장군을 불러 내 왕의 대응을 강제하고 있어요.";
    else if(move.capture)summary=`상대가 내 ${object(name(move.capture))} 잡았어요. 이어지는 공격도 확인하세요.`;
    else if(fresh){
      const discovered=!move.kind&&fresh.move.from!==move.to&&!captureThreats(before,side).some(t=>R.same(t.move,fresh.move));
      summary=discovered?`상대가 ${object(piece)} 옮겨 ${name(fresh.move.piece)}의 공격길을 열었어요. ${R.coord(fresh.move.to)}의 내 ${object(name(fresh.move.capture))} 노리는 공격이 생겼어요.`:
        `이번 수로 ${R.coord(fresh.move.to)}의 내 ${object(name(fresh.move.capture))} 노리는 공격이 생겼어요.`;
    }
    else if(R.inCheck(before))summary="상대가 내 장군을 피했어요. 공격을 이어갈 수 있는지 살펴보세요.";
    else if(move.kind)summary=explain(before,move);
    else {
      const prior=usefulThreats(before,R.other(side)).find(t=>t.move.to===move.from);
      const home=side==='c'?9-Math.floor(move.from/9):Math.floor(move.from/9);
      const palace=board=>R.targets(board,board.indexOf(side+'K'));
      if(prior&&!captureThreats(after,R.other(side)).some(t=>t.move.to===move.to))summary=`상대가 공격받던 ${object(piece)} 피했어요. 잡으려던 목표가 옮겨졌어요.`;
      else if(['H','E'].includes(move.piece[1])&&home===0)summary=`상대가 ${object(piece)} 첫 줄에서 꺼내 중앙 싸움에 참여할 준비를 해요.`;
      else if(threats.length)summary=`상대는 ${R.coord(threats[0].move.to)}의 내 ${object(name(threats[0].move.capture))} 계속 노리고 있어요.`;
      else if(move.piece[1]==='K'&&palace(after.board).length>palace(before.board).length)summary="상대가 왕의 피할 자리를 늘렸어요.";
      else if(Math.abs(move.to%9-4)<Math.abs(move.from%9-4))summary=`상대가 ${object(piece)} 중앙 쪽으로 모았어요. 중앙 길과 궁성으로 이어지는 공격을 살펴보세요.`;
      else summary=`상대가 ${object(piece)} ${R.coord(move.to)}에 배치했어요. 아래 예상 전개에서 이어지는 수를 살펴보세요.`;
    }
    const checked=R.inCheck(after),targets=threats.slice(0,2).map(t=>t.move.to);
    if(checked)targets.unshift(after.board.indexOf(after.turn+'K'));
    const king=after.board.indexOf(after.turn+'K');
    const checker=checked?after.board.findIndex((p,i)=>p?.[0]===side&&R.targets(after.board,i).includes(king)):-1;
    const danger=checked?`${checker>=0?R.coord(checker)+'의 상대 '+subject(name(after.board[checker])):'상대가'} 내 왕에게 장군을 부르고 있어요. 이번 수에 장군을 해소해야 해요.`:threats.slice(0,2).map(threatText).join(' ');
    const response=checked?"왕을 피하거나, 공격을 막거나, 공격하는 말을 잡는 수를 먼저 확인하세요.":threats.length?
      `우선 ${R.coord(threats[0].move.to)}의 ${object(name(threats[0].move.capture))} 피하거나 지키는 수를 살펴보세요. 공격하는 말을 잡거나 길목을 막는 방법도 있어요.`:
      after.ply<20?"내 마와 상도 꺼내고, 차가 나갈 길을 확보하세요.":"상대의 다음 전개에 맞춰 내 말을 지키면서 공격할 자리를 찾으세요.";
    const steps=legalLine(before,line),forecast=steps.length>=3&&R.same(steps[0].move,move)?
      `내가 ${label(steps[1].move)}로 응수하면, 상대는 ${label(steps[2].move)}로 ${nextPurpose(steps[2],side)} 내 수가 달라지면 상대의 응수도 달라질 수 있어요.`:"";
    if(!forecast&&summary.includes('아래 예상 전개'))summary=`상대가 ${object(piece)} ${R.coord(move.to)}에 배치했어요. 이 말이 내 진영으로 들어오는 길을 살펴보세요.`;
    return {title:label(move),summary,danger,response,forecast,targets:[...new Set(targets)]};
  }
  function explainHint(state,move,line=[]){
    const next=R.advance(state,move),end=R.status(next);
    if(end.ended||move.kind||R.inCheck(state))return explain(state,move);
    const threats=usefulThreats(state,R.other(state.turn)),remaining=captureThreats(next,next.turn);
    const saved=threats.find(t=>!remaining.some(r=>r.move.to===(t.move.to===move.from?move.to:t.move.to)));
    let reason=explain(state,move);
    if(saved){
      const m=saved.move;
      const defense=m.to===move.from?`${object(name(move.piece))} ${R.coord(move.to)}로 옮겨 그 공격을 피해요.`:
        `${label(move)}로 ${R.coord(m.to)}의 ${object(name(m.capture))} 바로 잡히지 않게 지켜요.`;
      reason=`${threatText(saved)} ${defense}${move.capture?` 동시에 상대 ${object(name(move.capture))} 잡아요.`:R.inCheck(next)?" 동시에 장군을 불러요.":""}`;
    }else if(threats.length){
      const still=usefulThreats(next,next.turn)[0];
      if(still)reason+=` 다만 이 수 뒤에도 ${threatText(still)} 이어지는 공격도 살펴보세요.`;
    }
    const steps=legalLine(state,line);
    if(steps.length>=2&&R.same(steps[0].move,move))reason+=`\n예상 응수: 상대 ${label(steps[1].move)}. ${nextPurpose(steps[1],next.turn)}`;
    return reason;
  }
  function explain(state,move){
    const next=R.advance(state,move),end=R.status(next);
    if(end.reason==="repetition")return "같은 말 배치에서 같은 편이 둘 차례가 세 번 나와 무승부로 끝났어요.";
    if(end.reason==="perpetual-check")return "같은 판을 반복하는 동안 한쪽이 계속 장군을 불렀어요. 이 대국의 반복 장군 규칙에 따라 장군을 반복한 쪽이 졌어요.";
    if(end.reason==="quiet")return "말을 잡지 않고 100수가 이어져 이 대국은 무승부로 끝났어요.";
    if(move.kind==="bikjang")return cannotForceMate(state)?"남은 말로는 외통수를 강제하기 어려워 빅장을 받아들여요. 이 대국은 무승부로 끝나요.":"두 왕 사이가 비어 있어요. 빅장을 받아들이면 이 대국은 무승부로 끝나요.";
    if(move.kind==="pass")return end.ended?"양쪽이 연속으로 쉬어 무승부로 끝나요.":cannotForceMate(state)?"남은 말로는 외통수를 강제하기 어려워 한 수 쉬어요. 상대도 이어서 쉬면 무승부로 끝나요.":"말을 움직이지 않고 차례를 넘겨요. 장군을 받고 있을 때는 쉴 수 없어요.";
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
    if(cannotForceMate(state)&&move.kind)return null;
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
  return {LEVELS,HINT,VALUES,NAMES,name,label,evaluate,cannotForceMate,choose,chooseHint,explain,explainHint,opponentView,review,mateInOne,roots};
});
