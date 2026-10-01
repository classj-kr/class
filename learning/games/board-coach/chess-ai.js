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
  // Teaching advice is independent of the strength selected for the opponent.
  const HINT = Object.freeze({ depth:6, nodes:360000, ms:4800, kingTempo:24 });
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
    // Basic heavy-piece endings: help the winning king approach and drive the
    // defending king to an edge instead of repeating centralising checks.
    for(const side of ["w","b"]) {
      const enemy=side==="w"?"b":"w";
      const own=state.board.filter(p=>p?.[0]===side),opposing=state.board.filter(p=>p?.[0]===enemy);
      if(!own.some(p=>["R","Q"].includes(p[1]))||opposing.some(p=>!["K","P"].includes(p[1])))continue;
      const advantage=own.reduce((n,p)=>n+VALUES[p[1]],0)-opposing.reduce((n,p)=>n+VALUES[p[1]],0);
      if(advantage<400)continue;
      const king=state.board.indexOf(side+"K"),target=state.board.indexOf(enemy+"K");
      const dx=Math.abs(king%8-target%8),dy=Math.abs(Math.floor(king/8)-Math.floor(target/8));
      const edge=Math.max(Math.abs(target%8-3.5),Math.abs(Math.floor(target/8)-3.5));
      let finish=edge*40+(7-Math.max(dx,dy))*25+(14-dx-dy)*5;
      if(opposing.length===1) {
        finish-=C.legalMoves({...state,turn:enemy,result:null},target).length*12;
        if(own.length===2&&own.includes(side+"R")) {
          const rook=state.board.indexOf(side+"R"),rx=rook%8,ry=Math.floor(rook/8),tx=target%8,ty=Math.floor(target/8);
          // In K+R versus K the rook fences off a rectangle. Shrink that box
          // while the king approaches; repeated checks alone make no progress.
          if(rx!==tx&&ry!==ty)finish+=(49-(tx<rx?rx:7-rx)*(ty<ry?ry:7-ry))*5;
        }
      }
      white+=side==="w"?finish:-finish;
    }
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
    const settings={...(LEVELS[level]||LEVELS.beginner),...options};
    const roots=rootCandidates(state);
    const finish=C.advance(state,roots[0]);
    if(C.isInCheck(finish) && !C.allLegalMoves(finish).length) return { move:roots[0], reason:explain(state,roots[0]), depth:1, nodes:0 };
    const learned=book.get(C.positionKey(state));
    if(learned && roots.some(m=>same(m,learned))) return { move:roots.find(m=>same(m,learned)), reason:explain(state,learned), depth:0, nodes:0 };
    const currentClaim=C.drawClaims(state).find(c=>!c.move);
    if(options.allowClaim!==false && currentClaim && evaluate(state)<-150) return { claim:true, reason:"이 판은 무승부를 선언할 수 있어요. 기물이 불리한 상황에서 무승부로 마칩니다." };
    const middleGame=state.board.reduce((sum,p)=>sum+(p&&p[1]!=="P"?VALUES[p[1]]:0),0)>=2400;
    const checked=C.isInCheck(state);
    const costs=new Map(roots.map(move=>[move,middleGame&&!checked&&move.piece[1]==="K"&&!move.capture&&!move.castle?(settings.kingTempo||0):0]));
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
    // Inspect every threatened piece, including pieces that did not move.
    // Allow legal recaptures before treating a capture as a material loss.
    best=roots.map(move=>{
      const next=C.advance(state,move);
      let loss=0;
      for(const reply of C.allLegalMoves(next).filter(m=>m.capture)) {
        const after=C.advance(next,reply);
        const recaptured=C.allLegalMoves(after).some(m=>m.capture&&m.to===reply.to);
        const gain=VALUES[reply.capture[1]]+(reply.promotion?VALUES[reply.promotion]-VALUES.P:0);
        loss=Math.max(loss,gain-(recaptured?VALUES[reply.promotion||reply.piece[1]]:0));
      }
      return {move,score:-evaluate(next)-loss-costs.get(move)};
    }).sort((a,b)=>b.score-a.score)[0].move;
    for(let depth=2;depth<=settings.depth;depth++) {
      let candidate=best, top=-Infinity;
      try {
        const ordered=roots.slice().sort((a,b)=>Number(same(b,best))-Number(same(a,best)));
        for(const move of ordered) {
          const cost=costs.get(move);
          const score=-search(C.advance(state,move),depth-1,-Infinity,-(top+cost),1)-cost;
          if(score>top) { top=score; candidate=move; }
        }
        best=candidate; completed=depth;
      } catch(error) { if(error!==stop) throw error; break; }
    }
    return { move:best, reason:explain(state,best), depth:completed, nodes };
  }
  function chooseHint(state,options={}) {
    return choose(state,"advanced",{...HINT,...options});
  }
  function explain(state,move) {
    const next=C.advance(state,move), at=C.squareName(move.to), piece=NAMES[move.piece[1]];
    const object = word => word + ((word.charCodeAt(word.length-1)-0xAC00)%28 ? "을" : "를");
    if(C.isInCheck(next) && !C.allLegalMoves(next).length) return `${object(piece)} ${at}에 두면 체크메이트예요. 상대 킹이 체크를 피할 방법이 없어요.`;
    if(move.castle) return `캐슬링으로 킹을 ${at}로, 룩을 ${C.squareName(Math.floor(move.to/8)*8+(move.to%8===6?5:3))}로 옮겨요.`;
    if(move.promotion) return `폰이 마지막 줄에 도착해 ${NAMES[move.promotion]}${move.promotion==="N"?"로":"으로"} 승격해요.`;
    if(move.enPassant) return `${at}에서 앙파상으로 상대 폰을 잡아요. 상대 폰이 두 칸 움직인 바로 다음 차례에만 가능한 수예요.`;
    if(C.isInCheck(state)) return `${object(piece)} ${at}로 옮겨 체크를 막아요.`;
    if(move.capture) return `${object(piece)} ${at}로 옮겨 상대 ${object(NAMES[move.capture[1]])} 잡아요.${C.allLegalMoves(next).some(m=>m.to===move.to&&m.capture)?" 상대가 이 말을 되잡을 수 있어요.":" 상대는 다음 수에 이 말을 바로 잡을 수 없어요."}`;
    if(C.isInCheck(next)) return `${object(piece)} ${at}로 옮겨 상대 킹을 공격해요(체크).`;
    const home=state.turn==="w"?0:7;
    if(["N","B"].includes(move.piece[1]) && Math.floor(move.from/8)===home && Math.floor(move.to/8)!==home) return `${object(piece)} 첫 줄에서 ${at}로 꺼내 공격과 방어에 참여시켜요.`;
    if(move.piece[1]==="P" && [27,28,35,36].includes(move.to)) return `${at}에 폰을 두어 중앙을 차지해요.`;
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
  return { LEVELS, HINT, NAMES, VALUES, choose, chooseHint, explain, review, evaluate, same, label, mateInOne, book };
});
