(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory(require("../chess/chess-rules.js"));
  else root.ChessCoachAI = factory(root.ClassChessRules);
})(typeof globalThis !== "undefined" ? globalThis : this, function (C) {
  "use strict";
  const LEVELS = Object.freeze({
    beginner: { name: "초급", depth: 2, nodes: 9000, ms: 450 },
    intermediate: { name: "중급", depth: 3, nodes: 35000, ms: 1100 },
    advanced: { name: "상급", depth: 4, nodes: 120000, ms: 2400 }
  });
  const VALUES = { P:100, N:320, B:330, R:500, Q:900, K:0 };
  const NAMES = { P:"폰", N:"나이트", B:"비숍", R:"룩", Q:"퀸", K:"킹" };
  const MATE = 100000, book = new Map();
  const same = (a,b) => a && b && a.from === b.from && a.to === b.to && (a.promotion || null) === (b.promotion || null);
  const label = m => `${C.squareName(m.from)} → ${C.squareName(m.to)}${m.promotion ? ` · ${NAMES[m.promotion]} 승격` : ""}`;
  // A small introductory repertoire; unfamiliar positions always use search.
  const lines = [
    "e2e4 e7e5 g1f3 b8c6 f1c4 f8c5 e1g1 g8f6 d2d3 d7d6 b1c3 e8g8",
    "e2e4 e7e5 g1f3 b8c6 f1b5 a7a6 b5a4 g8f6 e1g1 f8e7",
    "d2d4 d7d5 c2c4 e7e6 b1c3 g8f6 c1g5 f8e7 e2e3 e8g8",
    "e2e4 c7c5 g1f3 d7d6 d2d4 c5d4 f3d4 g8f6 b1c3",
    "e2e4 e7e6 d2d4 d7d5 b1c3 g8f6 c1g5",
    "g1f3 d7d5 d2d4 g8f6 c2c4 e7e6"
  ];
  for (const line of lines) {
    let state = C.createInitialState("standard");
    for (const uci of line.split(" ")) {
      const result = C.applyMove(state, uci.slice(0,2), uci.slice(2,4));
      if (!result.ok) throw new Error(`Invalid introductory move: ${uci}`);
      if (!book.has(C.positionKey(state))) book.set(C.positionKey(state), result.move);
      state = result.state;
    }
  }
  function evaluate(state) {
    let white = 0;
    const material = state.board.reduce((sum,p) => sum + (p && p[1] !== "P" ? VALUES[p[1]] : 0),0);
    const endgame = material < 2400;
    state.board.forEach((p,i) => {
      if (!p) return;
      const file=i%8, rank=Math.floor(i/8), forward=p[0]==="w"?rank:7-rank;
      const center=7-Math.abs(file-3.5)-Math.abs(rank-3.5);
      let value=VALUES[p[1]];
      if(p[1]==="P") value += forward * (endgame?12:5) + (file>=2 && file<=5? center*6:0);
      if(p[1]==="N") value += center*12 - (forward===0?25:0);
      if(p[1]==="B") value += center*6 - (forward===0?25:0);
      if(p[1]==="R") value += forward===6?25:0;
      if(p[1]==="Q") value += center*2 - (!endgame && state.fullmove<8 && forward>1?25:0);
      if(p[1]==="K") {
        value += endgame ? center*10 : -forward*14 - center*5;
        if(!endgame && forward===0 && [2,6].includes(file)) {
          value+=65;
          for(const df of [-1,0,1]) {
            const shield=i+(p[0]==="w"?8:-8)+df;
            if(file+df>=0 && file+df<8 && state.board[shield]===`${p[0]}P`) value+=12;
          }
        }
      }
      white += p[0]==="w"?value:-value;
    });
    return state.turn==="w"?white:-white;
  }
  const order = moves => moves.slice().sort((a,b) => priority(b)-priority(a) || a.from-b.from || a.to-b.to);
  function priority(m) { return (m.capture?10*VALUES[m.capture[1]]-VALUES[m.piece[1]]:0)+(m.promotion?VALUES[m.promotion]:0)+(m.castle?60:0); }
  function mateInOne(state) {
    for(const m of order(C.allLegalMoves(state))) {
      const next=C.advance(state,m);
      if(C.isInCheck(next) && !C.allLegalMoves(next).length) return m;
    }
    return null;
  }
  function rootCandidates(state) {
    const moves=order(C.allLegalMoves(state)), safe=[], wins=[];
    for(const move of moves) {
      const next=C.advance(state,move);
      if(C.isInCheck(next) && !C.allLegalMoves(next).length) wins.push(move);
      else if(!mateInOne(next)) safe.push(move);
    }
    return wins.length?wins:safe.length?safe:moves;
  }
  function choose(state, level="beginner", options={}) {
    if(C.status(state).ended) return null;
    const settings=LEVELS[level]||LEVELS.beginner;
    const roots=rootCandidates(state);
    const learned=book.get(C.positionKey(state));
    if(learned && roots.some(m=>same(m,learned))) return { move:roots.find(m=>same(m,learned)), reason:explain(state,learned), depth:0, nodes:0 };
    const currentClaim=C.drawClaims(state).find(c=>!c.move);
    if(options.allowClaim!==false && currentClaim && evaluate(state)<-150) return { claim:true, reason:"이 판은 무승부를 선언할 수 있어요. 기물이 불리한 상황에서 무승부로 마칩니다." };
    let nodes=0, best=roots[0], completed=0;
    const stop={}, deadline=Date.now()+(options.ms??settings.ms), maxNodes=options.nodes??settings.nodes;
    function tick() { if(++nodes>maxNodes || (nodes%32===0 && Date.now()>deadline)) throw stop; }
    function search(s,depth,alpha,beta,ply,qleft=5) {
      tick();
      const moves=C.allLegalMoves(s), check=C.isInCheck(s);
      if(!moves.length) return check?-MATE+ply:0;
      if(C.insufficientMaterial(s) || s.halfmove>=150 || C.repetitionCount(s)>=5) return 0;
      // A player can always claim an available draw, but may play for a win.
      const claim=s.halfmove>=100 || C.repetitionCount(s)>=3;
      let value=claim?0:-Infinity;
      if(depth<=0) {
        const stand=evaluate(s);
        if(!check) {
          value=Math.max(value,stand);
          if(value>=beta) return value;
          alpha=Math.max(alpha,value);
        }
        if(qleft<=0) return check?stand-40:Math.max(value,stand);
      }
      if(value>=beta) return value;
      alpha=Math.max(alpha,value);
      const candidates=depth>0||check?moves:moves.filter(m=>m.capture||m.promotion);
      for(const move of order(candidates)) {
        const score=-search(C.advance(s,move),depth-1,-beta,-alpha,ply+1,depth<=0?qleft-1:qleft);
        value=Math.max(value,score); alpha=Math.max(alpha,score);
        if(alpha>=beta) break;
      }
      return value;
    }
    // Deterministic fallback evaluates every candidate's immediate material loss.
    best=roots.map(move=>{
      const next=C.advance(state,move);
      const reply=C.allLegalMoves(next).filter(m=>m.capture && m.to===move.to).sort((a,b)=>VALUES[a.piece[1]]-VALUES[b.piece[1]])[0];
      const placedValue=VALUES[move.promotion || move.piece[1]], gained=move.capture?VALUES[move.capture[1]]:0;
      return {move,score:-evaluate(next)-(reply?Math.max(0,placedValue-gained):0)};
    }).sort((a,b)=>b.score-a.score)[0].move;
    for(let depth=1;depth<=settings.depth;depth++) {
      let candidate=best, top=-Infinity;
      try {
        const ordered=roots.slice().sort((a,b)=>Number(same(b,best))-Number(same(a,best)));
        for(const move of ordered) {
          const score=-search(C.advance(state,move),depth-1,-Infinity,-top,1);
          if(score>top) { top=score; candidate=move; }
        }
        best=candidate; completed=depth;
      } catch(error) { if(error!==stop) throw error; break; }
    }
    return { move:best, reason:explain(state,best), depth:completed, nodes };
  }
  function explain(state,move) {
    const next=C.advance(state,move), at=C.squareName(move.to), piece=NAMES[move.piece[1]];
    const object = word => word + ((word.charCodeAt(word.length-1)-0xAC00)%28 ? "을" : "를");
    if(C.isInCheck(next) && !C.allLegalMoves(next).length) return `${object(piece)} ${at}에 두면 체크메이트예요. 상대 킹이 체크를 피할 방법이 없어요.`;
    if(move.castle) return "캐슬링으로 킹을 옆으로 옮기고 룩을 중앙 쪽으로 연결해요. 킹이 지나가는 칸과 도착할 칸 모두 안전해야 해요.";
    if(move.promotion) return `폰이 마지막 줄에 도착해 ${NAMES[move.promotion]}으로 승격해요. 퀸·룩·비숍·나이트 중에서 고를 수 있어요.`;
    if(move.enPassant) return `${at}에서 앙파상으로 상대 폰을 잡아요. 상대 폰이 두 칸 움직인 바로 다음 차례에만 가능한 수예요.`;
    if(C.isInCheck(state)) return `${object(piece)} ${at}에 두어 체크를 해소해요. 킹이 공격받으면 먼저 그 위험을 없애야 해요.`;
    if(move.capture) return `${object(piece)} ${at}에 두어 상대 ${object(NAMES[move.capture[1]])} 잡아요. 상대가 다시 잡을 수 있는지도 함께 살펴보세요.`;
    if(C.isInCheck(next)) return `${at}의 ${piece} 수로 체크를 걸어요. 상대는 킹을 옮기거나 공격을 막거나 공격하는 말을 잡아야 해요.`;
    const home=state.turn==="w"?0:7;
    if(["N","B"].includes(move.piece[1]) && Math.floor(move.from/8)===home && Math.floor(move.to/8)!==home) return `${object(piece)} ${at}로 전개해요. 처음 줄에 있는 말을 꺼내 공격과 방어에 참여시켜요.`;
    if(move.piece[1]==="P" && [27,28,35,36].includes(move.to)) return `${at}에 폰을 두어 중앙 공간을 차지해요. 다른 말을 꺼낼 길과 상대의 중앙 진출도 살펴보세요.`;
    return `${object(piece)} ${at}로 옮겨요. 다음에 이 말이 갈 수 있는 칸과 상대의 공격을 함께 확인하세요.`;
  }
  function loosePiece(state) {
    for(const move of order(C.allLegalMoves(state)).filter(m=>m.capture && VALUES[m.capture[1]]>=300)) {
      const next=C.advance(state,move);
      if(!C.allLegalMoves(next).some(m=>m.capture && m.to===move.to)) return move;
    }
    return null;
  }
  function review(state,move) {
    const next=C.advance(state,move);
    if(C.isInCheck(next) && !C.allLegalMoves(next).length) return null;
    const win=mateInOne(state);
    if(win) return { alternative:win, text:`${label(win)}로 체크메이트할 수 있었어요. 킹에 대한 공격부터 확인해 보세요.` };
    const danger=mateInOne(next);
    if(danger) {
      const safe=rootCandidates(state).find(m=>!mateInOne(C.advance(state,m)));
      if(safe) return { alternative:safe, text:`상대가 ${label(danger)}로 체크메이트할 수 있어요. ${label(safe)}은 그 위협을 막는 후보예요.` };
    }
    const loose=loosePiece(next);
    if(loose && (!move.capture || VALUES[move.capture[1]]<VALUES[loose.capture[1]])) {
      const safe=rootCandidates(state).find(m=>!loosePiece(C.advance(state,m)));
      if(safe) return { alternative:safe, text:`상대가 ${C.squareName(loose.to)}의 ${NAMES[loose.capture[1]]}을 잡으면 바로 되잡기 어려워요. ${label(safe)}도 살펴보세요.` };
    }
    return null;
  }
  return { LEVELS, NAMES, VALUES, choose, explain, review, evaluate, same, label, mateInOne, book };
});
