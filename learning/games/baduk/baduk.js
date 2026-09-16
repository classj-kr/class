"use strict";

const $=id=>document.getElementById(id);
const GAME_ID="baduk";
const TURN_TIME_MS=30000;
const MODES=Object.freeze({
  capture:{name:"돌 따먹기",size:7,description:"상대 돌 3개를 먼저 잡으면 승리"},
  territory:{name:"땅 따먹기",size:7,maxMoves:40,description:"40수 뒤 돌과 둘러싼 땅을 합산"},
  standard:{name:"정식 바둑",size:9,komi:7.5,description:"연속 패스 뒤 백 7.5집을 더해 자동 계가"}
});
const MESSAGE=Object.freeze({ACTION:"BADUK_ACTION",STATE:"BADUK_STATE",RETURN_LOBBY:"BADUK_RETURN_LOBBY"});
const savedName=String(localStorage.getItem("classPlayerName")||"").trim();
let lobby=null;
let gameState=null;
let selectedMode="capture";
let hostTimer=null;
let localDeadline=0;
let toastTimer=null;

function boardIndex(row,col,size){return row*size+col}
function boardKey(board){return board.join("")}
function inside(row,col,size){return row>=0&&col>=0&&row<size&&col<size}
function neighbors(row,col,size){return [[row-1,col],[row+1,col],[row,col-1],[row,col+1]].filter(([r,c])=>inside(r,c,size))}

function collectGroup(board,size,row,col){
  const color=board[boardIndex(row,col,size)];
  const seen=new Set();
  const liberties=new Set();
  const stones=[];
  const stack=[[row,col]];
  while(stack.length){
    const [r,c]=stack.pop();
    const key=r+","+c;
    if(seen.has(key))continue;
    seen.add(key);stones.push([r,c]);
    neighbors(r,c,size).forEach(([nr,nc])=>{
      const value=board[boardIndex(nr,nc,size)];
      if(value===0)liberties.add(nr+","+nc);
      else if(value===color&&!seen.has(nr+","+nc))stack.push([nr,nc]);
    });
  }
  return{stones,liberties:liberties.size};
}

function tryMove(board,size,row,col,color,history=[]){
  if(!inside(row,col,size)||board[boardIndex(row,col,size)]!==0)return null;
  const next=board.slice();
  next[boardIndex(row,col,size)]=color;
  let captured=0;
  neighbors(row,col,size).forEach(([nr,nc])=>{
    if(next[boardIndex(nr,nc,size)]!==3-color)return;
    const group=collectGroup(next,size,nr,nc);
    if(group.liberties)return;
    group.stones.forEach(([r,c])=>{next[boardIndex(r,c,size)]=0});
    captured+=group.stones.length;
  });
  if(collectGroup(next,size,row,col).liberties===0)return null;
  if(history.includes(boardKey(next)))return null;
  return{board:next,captured};
}

function areaScore(board,size,komi=0){
  let black=board.filter(value=>value===1).length;
  let white=board.filter(value=>value===2).length;
  const seen=new Set();
  for(let row=0;row<size;row+=1)for(let col=0;col<size;col+=1){
    const start=row+","+col;
    if(board[boardIndex(row,col,size)]||seen.has(start))continue;
    const stack=[[row,col]],region=[],borders=new Set();
    while(stack.length){
      const [r,c]=stack.pop(),key=r+","+c;
      if(seen.has(key))continue;
      seen.add(key);region.push(key);
      neighbors(r,c,size).forEach(([nr,nc])=>{
        const value=board[boardIndex(nr,nc,size)];
        if(value===0&&!seen.has(nr+","+nc))stack.push([nr,nc]);
        else if(value)borders.add(value);
      });
    }
    if(borders.size===1){if(borders.has(1))black+=region.length;else white+=region.length}
  }
  return{black,white:white+komi};
}

function playerName(id){return lobby.snapshot().players[id]?.name||"참가자"}
function currentMode(){return MODES[gameState?.mode||selectedMode]}

function createInitialState(snapshot,previous=null){
  const ids=Object.keys(snapshot.players);
  let playerOrder=ids;
  if(previous?.playerOrder?.length===2&&previous.playerOrder.every(id=>ids.includes(id))){
    playerOrder=previous.winner
      ?[previous.playerOrder[previous.winner===1?1:0],previous.playerOrder[previous.winner===1?0:1]]
      :[previous.playerOrder[1],previous.playerOrder[0]];
  }
  const mode=MODES[selectedMode];
  const board=Array(mode.size*mode.size).fill(0);
  const now=Date.now();
  return{mode:selectedMode,size:mode.size,board,history:[boardKey(board)],playerOrder,turn:0,captures:[0,0],moveCount:0,passCount:0,winner:0,draw:false,lastMove:null,scores:null,hostNow:now,turnDeadline:now+TURN_TIME_MS,turnToken:Number(previous?.turnToken||0)+1};
}

function finishByScore(state){
  const scores=areaScore(state.board,state.size,MODES[state.mode].komi||0);
  return{...state,scores,winner:scores.black===scores.white?0:scores.black>scores.white?1:2,draw:scores.black===scores.white};
}

function resetTurnClock(state){const now=Date.now();state.hostNow=now;state.turnDeadline=now+TURN_TIME_MS;state.turnToken+=1}

function applyAction(action){
  if(!gameState||gameState.winner||gameState.draw)return;
  if(action.playerId!==gameState.playerOrder[gameState.turn])return;
  if(action.kind==="move"){
    const result=tryMove(gameState.board,gameState.size,action.row,action.col,gameState.turn+1,gameState.history);
    if(!result)return showToast("둘 수 없는 자리입니다.");
    const mover=gameState.turn;
    let next={...gameState,board:result.board,history:[...gameState.history,boardKey(result.board)],captures:gameState.captures.map((value,index)=>index===mover?value+result.captured:value),moveCount:gameState.moveCount+1,passCount:0,lastMove:{row:action.row,col:action.col},turn:1-mover};
    if(next.mode==="capture"&&next.captures[mover]>=3)next.winner=mover+1;
    if(next.mode==="territory"&&(next.moveCount>=MODES.territory.maxMoves||!next.board.includes(0)))next=finishByScore(next);
    resetTurnClock(next);installState(next,true);
  }else if(action.kind==="pass"&&gameState.mode==="standard"){
    let next={...gameState,turn:1-gameState.turn,passCount:gameState.passCount+1,lastMove:null};
    if(next.passCount>=2)next=finishByScore(next);
    resetTurnClock(next);installState(next,true);
  }else if(action.kind==="resign")installState({...gameState,winner:gameState.turn===0?2:1},true);
}

function requestAction(kind,row=null,col=null){
  const action={kind,row,col,playerId:lobby.snapshot().myId};
  if(lobby.snapshot().role==="host")applyAction(action);else lobby.send({type:MESSAGE.ACTION,action});
}

function installState(next,broadcast){
  gameState=next;
  localDeadline=Date.now()+Math.max(0,next.turnDeadline-next.hostNow);
  scheduleHostTimeout();
  if(broadcast)lobby.broadcast({type:MESSAGE.STATE,state:gameState});
  showGame();renderGame();
}

function scheduleHostTimeout(){
  clearTimeout(hostTimer);
  if(!gameState||gameState.winner||gameState.draw||lobby.snapshot().role!=="host")return;
  const token=gameState.turnToken;
  hostTimer=setTimeout(()=>{
    if(!gameState||gameState.turnToken!==token||gameState.winner||gameState.draw)return;
    const next={...gameState,turn:1-gameState.turn,passCount:0,lastMove:null};
    resetTurnClock(next);installState(next,true);
  },Math.max(0,gameState.turnDeadline-Date.now())+20);
}

function buildBoard(){
  const board=$("board");
  board.style.gridTemplateColumns=`repeat(${gameState.size},1fr)`;
  const fragment=document.createDocumentFragment();
  for(let row=0;row<gameState.size;row+=1)for(let col=0;col<gameState.size;col+=1){
    const point=document.createElement("button");
    point.type="button";point.dataset.row=row;point.dataset.col=col;
    point.className="point"+(col===0?" edge-left":"")+(col===gameState.size-1?" edge-right":"")+(row===0?" edge-top":"")+(row===gameState.size-1?" edge-bottom":"");
    point.addEventListener("click",()=>requestAction("move",row,col));
    fragment.appendChild(point);
  }
  board.replaceChildren(fragment);
}

function renderGame(){
  if(!gameState)return;
  const snapshot=lobby.snapshot(),ended=Boolean(gameState.winner||gameState.draw),activeId=gameState.playerOrder[gameState.turn];
  if($("board").children.length!==gameState.size*gameState.size)buildBoard();
  $("modeName").textContent=currentMode().name;
  $("blackName").textContent=playerName(gameState.playerOrder[0])+(snapshot.myId===gameState.playerOrder[0]?" · 나":"");
  $("whiteName").textContent=playerName(gameState.playerOrder[1])+(snapshot.myId===gameState.playerOrder[1]?" · 나":"");
  $("blackCaptured").textContent=gameState.captures[0];$("whiteCaptured").textContent=gameState.captures[1];
  $("blackCard").classList.toggle("active",!ended&&gameState.turn===0);$("whiteCard").classList.toggle("active",!ended&&gameState.turn===1);
  document.querySelectorAll(".point").forEach(point=>{
    const row=Number(point.dataset.row),col=Number(point.dataset.col),value=gameState.board[boardIndex(row,col,gameState.size)];
    point.disabled=ended||activeId!==snapshot.myId||Boolean(value);
    point.classList.toggle("last",Boolean(gameState.lastMove&&gameState.lastMove.row===row&&gameState.lastMove.col===col));
    point.innerHTML=value?`<span class="stone ${value===1?"black":"white"}"></span>`:"";
  });
  $("turnBanner").textContent=gameState.draw?"무승부":gameState.winner?`${playerName(gameState.playerOrder[gameState.winner-1])} 승리`:activeId===snapshot.myId?"내 차례":"상대 차례";
  $("gameStatus").textContent=gameState.scores?`흑 ${gameState.scores.black} · 백 ${gameState.scores.white}`:gameState.mode==="territory"?`${gameState.moveCount}/40수`:gameState.mode==="capture"?"돌 3개를 먼저 잡으면 승리":"두 사람이 연속으로 패스하면 자동 계가";
  $("passBtn").classList.toggle("hidden",gameState.mode!=="standard"||ended);$("resignBtn").classList.toggle("hidden",ended);$("resultActions").classList.toggle("hidden",!ended||snapshot.role!=="host");
}

function updateClock(){
  const clock=$("turnClock");
  if(!gameState||gameState.winner||gameState.draw){clock.classList.add("hidden");return}
  const seconds=Math.max(0,Math.ceil((localDeadline-Date.now())/1000));
  clock.classList.remove("hidden");clock.textContent=seconds;clock.classList.toggle("warning",seconds<=10&&seconds>5);clock.classList.toggle("danger",seconds<=5);
}

function setMode(modeId){
  if(!MODES[modeId]||lobby?.snapshot().started)return;
  selectedMode=modeId;
  document.querySelectorAll(".mode-button").forEach(button=>button.classList.toggle("active",button.dataset.mode===modeId));
  $("modeSummary").textContent=`${MODES[modeId].name} · ${MODES[modeId].size}×${MODES[modeId].size}`;
  if(lobby?.snapshot().role==="host")lobby.updateLocalPlayer({badukMode:modeId});
}

function showRules(){
  const modeId=gameState?.mode||selectedMode,mode=MODES[modeId];
  $("rulesBody").innerHTML=`<p><b>${mode.name}</b> · ${mode.description}</p><ol><li>흑과 백이 번갈아 교차점에 돌을 놓습니다.</li><li>활로가 모두 막힌 돌은 잡힙니다.</li><li>자충수와 같은 판을 반복하는 수는 둘 수 없습니다.</li><li>한 수는 30초입니다. 10초부터 노란 경고, 5초부터 빨간 경고가 표시됩니다.</li><li>시간이 끝나면 상대에게 차례가 넘어갑니다.</li></ol>`;
  $("rulesOverlay").classList.remove("hidden");
}
function showToast(message){clearTimeout(toastTimer);$("toast").textContent=message;$("toast").classList.remove("hidden");toastTimer=setTimeout(()=>$("toast").classList.add("hidden"),1800)}
function showGame(){$("lobbyScreen").classList.add("hidden");$("gameScreen").classList.remove("hidden");$("gameRoomCode").textContent=lobby.snapshot().roomCode||"----"}
function showLobby(){clearTimeout(hostTimer);gameState=null;$("gameScreen").classList.add("hidden");$("lobbyScreen").classList.remove("hidden")}

function handleGameMessage(_sender,payload){
  if(payload?.type===MESSAGE.ACTION&&lobby.snapshot().role==="host")applyAction(payload.action);
  else if(payload?.type===MESSAGE.STATE)installState(payload.state,false);
  else if(payload?.type===MESSAGE.RETURN_LOBBY){showLobby();lobby.returnToLobby()}
}

function init(){
  lobby=ClassroomMultiplayerLobby.create({
    gameId:GAME_ID,initialMode:"guest",getPlayerName:()=>/^[가-힣]{2,6}$/.test(savedName)?savedName:"",allowedPlayerCounts:[2],maxPlayers:2,
    rulesButtonIds:["rulesBtnLobby","rulesBtnGame"],leaveButtonIds:["leaveBtnLobby","leaveBtnGame"],onRules:showRules,onLeave:()=>location.href="../../../",
    onStateChange:snapshot=>{
      $("gameRoomCode").textContent=snapshot.roomCode||"----";
      if(snapshot.role!=="host"){
        const host=Object.values(snapshot.players).find(player=>player.badukMode);
        if(host?.badukMode)setMode(host.badukMode);
      }
      document.querySelectorAll(".mode-button").forEach(button=>button.disabled=snapshot.role!=="host");
    },
    getLobbyPresentation:({count,role,canStart})=>({canStart:role==="host"&&canStart,startText:role==="host"&&canStart?"START GAME":"WAITING FOR OPPONENT",guideText:count===2?`${MODES[selectedMode].name} · 방장이 시작합니다.`:"상대방을 기다리는 중입니다."}),
    createStartData:snapshot=>({state:createInitialState(snapshot)}),onStarted:({data})=>installState(data.state,false),onGameMessage:handleGameMessage,
    onAbort:({title,message})=>{$("abortTitle").textContent=title;$("abortMessage").textContent=message;$("abortOverlay").classList.remove("hidden")}
  }).mount();
  $("savedName").textContent=savedName;
  document.querySelectorAll(".mode-button").forEach(button=>button.addEventListener("click",()=>setMode(button.dataset.mode)));
  $("passBtn").addEventListener("click",()=>requestAction("pass"));
  $("resignBtn").addEventListener("click",()=>{if(confirm("정말 기권하시겠습니까?"))requestAction("resign")});
  $("rematchBtn").addEventListener("click",()=>installState(createInitialState(lobby.snapshot(),gameState),true));
  $("returnLobbyBtn").addEventListener("click",()=>{lobby.broadcast({type:MESSAGE.RETURN_LOBBY});showLobby();lobby.returnToLobby()});
  $("closeRulesBtn").addEventListener("click",()=>$("rulesOverlay").classList.add("hidden"));
  setInterval(updateClock,150);setMode("capture");
}

window.addEventListener("DOMContentLoaded",init);

if(typeof module!=="undefined")module.exports={tryMove,areaScore,collectGroup,MODES,TURN_TIME_MS};
