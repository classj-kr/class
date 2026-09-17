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
    if(!result)return showToast("둘 수 없는 자리예요. (착수금지 또는 패)");
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

// 규칙 그림: B/W 돌, o 활로 표시, x 둘 수 없는 자리, b/w 이번에 둘 자리, g 따낸 돌 자리
function ruleDiagram(rows,caption){
  const cell=30,w=rows[0].length*cell,h=rows.length*cell,parts=[];
  for(let i=0;i<rows.length;i+=1)parts.push(`<line x1="0" y1="${i*cell+15}" x2="${w}" y2="${i*cell+15}"/>`);
  for(let i=0;i<rows[0].length;i+=1)parts.push(`<line x1="${i*cell+15}" y1="0" x2="${i*cell+15}" y2="${h}"/>`);
  rows.forEach((line,r)=>[...line].forEach((ch,c)=>{
    const x=c*cell+15,y=r*cell+15;
    if(ch==="B"||ch==="W")parts.push(`<circle class="rd-${ch}" cx="${x}" cy="${y}" r="12"/>`);
    else if(ch==="b"||ch==="w")parts.push(`<circle class="rd-${ch.toUpperCase()} rd-next" cx="${x}" cy="${y}" r="12"/>`);
    else if(ch==="o")parts.push(`<circle class="rd-lib" cx="${x}" cy="${y}" r="5"/>`);
    else if(ch==="g")parts.push(`<circle class="rd-ghost" cx="${x}" cy="${y}" r="11"/>`);
    else if(ch==="t")parts.push(`<rect class="rd-B" x="${x-6}" y="${y-6}" width="12" height="12"/>`);
    else if(ch==="x")parts.push(`<path class="rd-x" d="M${x-7} ${y-7}L${x+7} ${y+7}M${x+7} ${y-7}L${x-7} ${y+7}"/>`);
  }));
  return`<figure class="rule-fig"><svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${caption}">${parts.join("")}</svg><figcaption>${caption}</figcaption></figure>`;
}

const RULE_GOALS=Object.freeze({
  capture:`상대 돌을 먼저 3개 따내면 이깁니다.`,
  territory:`40수를 다 두거나 판이 꽉 차면 점수를 셉니다. 점수는 내 돌 수 + 내 집 수이고, 많은 쪽이 이깁니다.`,
  standard:`두 사람이 연달아 패스하면 점수를 셉니다(계가). 점수는 내 돌 수 + 내 집 수이고, 백은 나중에 두는 대신 덤 7.5점을 더 받습니다. 많은 쪽이 이깁니다.`
});

function ruleCard(figs,name,text){return`<div class="rule-card"><div class="rule-figs">${figs}</div><p><b>${name}</b> ${text}</p></div>`}

function showRules(){
  const modeId=gameState?.mode||selectedMode,mode=MODES[modeId];
  const cards=[
    ruleCard(ruleDiagram([".....","..o..",".oBo.","..o..","....."],"활로 4개")+ruleDiagram([".....",".oo..","oBBo.",".oo..","....."],"두 돌의 활로 6개"),
      "활로","돌 바로 위·아래·왼쪽·오른쪽의 빈 교차점(초록 점)입니다. 대각선은 활로가 아닙니다. 붙어 있는 돌은 한 덩어리로 활로를 함께 씁니다."),
    ruleCard(ruleDiagram([".....","..W..",".WBw.","..W..","....."],"백이 마지막 활로에")+ruleDiagram([".....","..W..",".WgW.","..W..","....."],"흑 돌이 나감"),
      "따내기","상대 돌의 활로를 모두 막으면 그 돌을 판에서 들어냅니다."),
    ruleCard(ruleDiagram([".....","..W..",".WxW.","..W..","....."],"흑은 ✕에 못 둠"),
      "착수금지","두자마자 활로가 하나도 없는 자리에는 못 둡니다. 그 수로 상대 돌을 따낼 수 있으면 둘 수 있습니다(패 그림 ①)."),
    ruleCard(ruleDiagram([".....",".BW..","BWbW.",".BW..","....."],"① 흑이 백을 따냄")+ruleDiagram([".....",".BW..","BxBW.",".BW..","....."],"② 백은 ✕에 못 둠"),
      "패","한 번 나왔던 판 모양이 다시 나오는 수는 둘 수 없습니다. 그래서 방금 따내진 자리에서 곧바로 되따낼 수 없고, 다른 곳에 한 수 둔 뒤에는 됩니다.")
  ];
  if(modeId!=="capture")cards.push(ruleCard(ruleDiagram([".BB..","BttB.",".BB..",".....","....."],"흑 6 + 집 2 = 8점"),
    "집","내 돌로만 둘러싼 빈 교차점입니다. 그림의 네모 자리입니다."));
  $("rulesBody").innerHTML=`
<div class="rule-grid">${cards.join("")}</div>
<dl class="rule-list">
<dt>순서</dt><dd>흑이 먼저, 한 개씩 번갈아 선과 선이 만나는 교차점에 놓습니다.</dd>
<dt>${mode.name} (${mode.size}×${mode.size})</dt><dd>${RULE_GOALS[modeId]} 상대가 기권해도 이깁니다.</dd>
<dt>자충수</dt><dd>자기 돌의 활로를 스스로 막는 수입니다. 규칙 위반은 아닙니다.</dd>
<dt>초읽기</dt><dd>한 수에 30초입니다. 시간이 지나면 차례가 상대에게 넘어갑니다.</dd>
</dl>`;
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
