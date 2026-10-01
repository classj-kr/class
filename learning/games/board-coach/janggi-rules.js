(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.JanggiCoachRules = factory();
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";
  const other = side => side === "c" ? "h" : "c";
  const inside = (x, y) => x >= 0 && x < 9 && y >= 0 && y < 10;
  const square = (x, y) => y * 9 + x;
  const coord = i => `${(Math.floor(i / 9) + 1) % 10}${i % 9 + 1}`;
  const FORMS = ["HEHE", "EHEH", "HEEH", "EHHE"];
  const PALACES = [[3, 4, 5, 12, 13, 14, 21, 22, 23], [66, 67, 68, 75, 76, 77, 84, 85, 86]];
  const DIAGONALS = [[3, 13, 23], [5, 13, 21], [66, 76, 86], [68, 76, 84]];
  const ORTH = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  const HORSE = [[0,-1,-1,-2],[0,-1,1,-2],[1,0,2,-1],[1,0,2,1],[0,1,1,2],[0,1,-1,2],[-1,0,-2,1],[-1,0,-2,-1]];
  const ELEPHANT = [[0,-1,-1,-2,-2,-3],[0,-1,1,-2,2,-3],[1,0,2,-1,3,-2],[1,0,2,1,3,2],[0,1,1,2,2,3],[0,1,-1,2,-2,3],[-1,0,-2,1,-3,2],[-1,0,-2,-1,-3,-2]];
  const rays = Array.from({length:90}, (_, from) => {
    const x=from%9, y=Math.floor(from/9), paths=[];
    for (const [dx,dy] of ORTH) {
      const path=[];
      for(let nx=x+dx,ny=y+dy;inside(nx,ny);nx+=dx,ny+=dy) path.push(square(nx,ny));
      if(path.length) paths.push(path);
    }
    for(const line of DIAGONALS) {
      const at=line.indexOf(from); if(at<0) continue;
      if(at>0) paths.push(line.slice(0,at).reverse());
      if(at<2) paths.push(line.slice(at+1));
    }
    return paths;
  });
  function key(state) { return state.board.map(p=>p||".").join("")+":"+state.turn; }
  function position(board, turn="c") {
    const s={board:board.slice(),turn,ply:0,quiet:0,passes:0,last:null,result:null,history:[]};
    s.history.push({key:key(s),mover:null,check:false}); return s;
  }
  // Form labels are read from each player's own left to right.
  function initial(cho="HEEH",han="HEEH") {
    const board=Array(90).fill(null);
    for(const side of ["c","h"]) {
      const form=FORMS.includes(side==="c"?cho:han)?(side==="c"?cho:han):"HEEH";
      const back=["R",form[0],form[1],"A",null,"A",form[2],form[3],"R"];
      const put=(x,y,t)=>{board[side==="c"?square(x,y):89-square(x,y)]=side+t;};
      back.forEach((t,x)=>{if(t)put(x,9,t);}); put(4,8,"K"); put(1,7,"C");put(7,7,"C");
      for(const x of [0,2,4,6,8])put(x,6,"P");
    }
    return position(board);
  }
  function targets(board, from) {
    const piece=board[from]; if(!piece)return [];
    const side=piece[0], type=piece[1], x=from%9,y=Math.floor(from/9),out=[];
    const add=(nx,ny)=>{if(inside(nx,ny)){const to=square(nx,ny);if(!board[to]||board[to][0]!==side)out.push(to);}};
    if(type==="R"||type==="C") {
      for(const path of rays[from]) {
        let screen=type==="R";
        for(const to of path) {
          const victim=board[to];
          if(!screen) {if(victim){if(victim[1]==="C")break;screen=true;}continue;}
          if(!victim)out.push(to);
          else {if(victim[0]!==side&&(type!=="C"||victim[1]!=="C"))out.push(to);break;}
        }
      }
    } else if(type==="H") {
      for(const [bx,by,dx,dy] of HORSE)if(inside(x+dx,y+dy)&&!board[square(x+bx,y+by)])add(x+dx,y+dy);
    } else if(type==="E") {
      for(const [bx,by,cx,cy,dx,dy] of ELEPHANT)if(inside(x+dx,y+dy)&&!board[square(x+bx,y+by)]&&!board[square(x+cx,y+cy)])add(x+dx,y+dy);
    } else if(type==="K"||type==="A") {
      const palace=PALACES[side==="h"?0:1];
      if(!palace.includes(from))return [];
      for(const [dx,dy] of ORTH)if(palace.includes(square(x+dx,y+dy)))add(x+dx,y+dy);
      for(const line of DIAGONALS) {
        const at=line.indexOf(from);if(at<0)continue;
        for(const step of [-1,1]){const to=line[at+step];if(to!==undefined)add(to%9,Math.floor(to/9));}
      }
    } else if(type==="P") {
      const f=side==="c"?-1:1;
      add(x,y+f);add(x-1,y);add(x+1,y);
      if(PALACES[side==="c"?0:1].includes(from))for(const line of DIAGONALS) {
        const at=line.indexOf(from);if(at<0)continue;
        for(const to of [line[at-1],line[at+1]])if(to!==undefined&&Math.floor(to/9)-y===f)add(to%9,Math.floor(to/9));
      }
    }
    return out;
  }
  function inCheck(state, side=state.turn) {
    const king=state.board.indexOf(side+"K"); if(king<0)return true;
    const board=state.board,enemy=other(side),x=king%9,y=Math.floor(king/9);
    // Trace attacks back from the king instead of generating every enemy move.
    // Chariots need a clear ray; cannons need exactly one non-cannon screen.
    for(const path of rays[king]){
      let screen=false;
      for(const from of path){
        const piece=board[from];if(!piece)continue;
        if(!screen){
          if(piece===enemy+"R")return true;
          if(piece[1]==="C")break;
          screen=true;
        }else{
          if(piece===enemy+"C")return true;
          break;
        }
      }
    }
    for(const [bx,by,dx,dy] of HORSE){
      const fx=x-dx,fy=y-dy;
      if(inside(fx,fy)&&board[square(fx,fy)]===enemy+"H"&&!board[square(fx+bx,fy+by)])return true;
    }
    for(const [bx,by,cx,cy,dx,dy] of ELEPHANT){
      const fx=x-dx,fy=y-dy;
      if(inside(fx,fy)&&board[square(fx,fy)]===enemy+"E"&&!board[square(fx+bx,fy+by)]&&!board[square(fx+cx,fy+cy)])return true;
    }
    // Soldiers, kings and guards can only attack an adjacent intersection.
    // Reuse their palace/direction rules for these few possible attackers.
    for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){
      if((!dx&&!dy)||!inside(x+dx,y+dy))continue;
      const from=square(x+dx,y+dy),piece=board[from];
      if(piece?.[0]===enemy&&["P","K","A"].includes(piece[1])&&targets(board,from).includes(king))return true;
    }
    return false;
  }
  function facing(state) {
    const a=state.board.indexOf("cK"),b=state.board.indexOf("hK");
    if(a<0||b<0||a%9!==b%9)return false;
    for(let i=Math.min(a,b)+9;i<Math.max(a,b);i+=9)if(state.board[i])return false;
    return true;
  }
  function movedBoard(state, move) {
    const board=state.board.slice();board[move.to]=board[move.from];board[move.from]=null;return board;
  }
  function boardMoves(state) {
    const out=[],breakFacing=facing(state);
    for(let from=0;from<90;from++) {
      const piece=state.board[from];if(piece?.[0]!==state.turn)continue;
      for(const to of targets(state.board,from)) {
        if(state.board[to]?.[1]==="K")continue;
        const move={from,to,piece,capture:state.board[to]}, next={...state,board:movedBoard(state,{from,to})};
        if(!inCheck(next,state.turn)&&(!breakFacing||!facing(next)))out.push(move);
      }
    }
    return out;
  }
  function actions(state) {
    if(state.result)return [];
    const moves=boardMoves(state);
    // Bikjang acceptance takes priority even when the offering move also checks.
    if(facing(state))moves.push({kind:"bikjang"});
    else if(!inCheck(state))moves.push({kind:"pass"});
    return moves;
  }
  function repetitionResult(state) {
    const current=key(state),matches=[];
    state.history.forEach((h,i)=>{if(h.key===current)matches.push(i);});
    if(matches.length<3)return null;
    const cycle=state.history.slice(matches.at(-3)+1);
    // Repeated checking is never a way for a losing side to force a draw.
    const checkers=["c","h"].filter(side=>{
      const own=cycle.filter(h=>h.mover===side);return own.length>0&&own.every(h=>h.check);
    });
    return checkers.length===1?{ended:true,winner:other(checkers[0]),reason:"perpetual-check"}:{ended:true,winner:null,reason:"repetition"};
  }
  function status(state) {
    if(state.result)return state.result;
    if(!facing(state)&&inCheck(state)&&!boardMoves(state).length)return {ended:true,winner:other(state.turn),reason:"mate"};
    if(state.passes>=2)return {ended:true,winner:null,reason:"passes"};
    const repeated=repetitionResult(state);if(repeated)return repeated;
    if(state.quiet>=100)return {ended:true,winner:null,reason:"quiet"};
    return {ended:false,winner:null,reason:null};
  }
  // Search entry point. The caller must supply an action returned by actions().
  function advance(state, move) {
    const turn=other(state.turn), special=!!move.kind;
    const next={...state,board:special?state.board.slice():movedBoard(state,move),turn,ply:state.ply+1,
      quiet:move.capture?0:state.quiet+1,passes:move.kind==="pass"?state.passes+1:0,last:{...move,side:state.turn},result:null};
    next.history=[...state.history,{key:key(next),mover:state.turn,check:inCheck(next)}];
    if(move.kind==="bikjang")next.result={ended:true,winner:null,reason:"bikjang"};
    return next;
  }
  const same=(a,b)=>!!a&&!!b&&(a.kind||b.kind?a.kind===b.kind:a.from===b.from&&a.to===b.to);
  function play(state, request) {
    if(status(state).ended)return {ok:false,error:"끝난 대국입니다."};
    const move=actions(state).find(m=>same(m,request));
    if(!move)return {ok:false,error:"그곳으로는 둘 수 없습니다."};
    const next=advance(state,move),result=status(next);if(result.ended)next.result=result;
    return {ok:true,state:next,move};
  }
  return {initial,position,targets,inCheck,facing,boardMoves,actions,advance,play,status,key,coord,same,other,FORMS};
});
