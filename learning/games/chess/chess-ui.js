"use strict";

const GAME_ID = "chess";
const NAME_KEY = "classPlayerName";
const SERVER_MESSAGE = Object.freeze({ STATE: "CHESS_STATE", ERROR: "CHESS_ERROR" });
const TIME_LABELS = Object.freeze({
  bullet: "빠르게 · 1+1",
  quick: "기본 · 3+2",
  relaxed: "여유롭게 · 5+3",
  untimed: "친선 · 시간제한 없음"
});
const PIECE_NAMES = Object.freeze({ K: "킹", Q: "퀸", R: "룩", B: "비숍", N: "나이트", P: "폰" });
const $ = id => document.getElementById(id);
const savedName = String(localStorage.getItem(NAME_KEY) || "").trim();

let lobby = null;
let gameState = null;
let selected = null;
let legalTargets = [];
let pendingPromotion = null;
let actionPending = false;
let receivedAt = performance.now();
let lobbyTimeControl = "quick";
let toastTimer = null;
let unreadChat = 0;
const chatMessages = [];
const seenChatIds = new Set();

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character]));
}

function showToast(message) {
  clearTimeout(toastTimer);
  $("toast").textContent = message;
  $("toast").classList.remove("hidden");
  toastTimer = setTimeout(() => $("toast").classList.add("hidden"), 2400);
}

function pieceSvg(piece, extraClass = "") {
  if (!piece) return "";
  const color = piece[0] === "w" ? "white" : "black";
  const type = piece[1];
  const label = `${piece[0] === "w" ? "백" : "흑"} ${PIECE_NAMES[type]}`;
  const shapes = {
    P: '<circle class="piece-body" cx="32" cy="17" r="9"/><path class="piece-body" d="M22 31q10-8 20 0l3 13H19zM15 48h34l4 8H11z"/><path class="piece-detail" d="M20 44h24M15 52h34"/>',
    R: '<path class="piece-body" d="M14 9h9v8h7V9h8v8h7V9h7v18l-7 6 4 16H15l4-16-7-6V9z"/><path class="piece-detail" d="M18 27h28M19 34h26M15 49h34M11 56h42"/><path class="piece-body" d="M11 49h42v7H11z"/>',
    N: '<path class="piece-body" d="M15 54h38l-4-9H25c2-9 8-12 15-17l-4-7 10 3 2-11C35 8 20 16 18 31l6 7-8 8z"/><circle cx="34" cy="18" r="2.2" fill="var(--piece-edge)"/><path class="piece-detail" d="M21 31l9 1M18 46h31M14 54h39"/>',
    B: '<path class="piece-body" d="M32 7c8 7 12 13 5 21 7 5 9 12 7 18H20c-2-6 0-13 7-18-7-8-3-14 5-21zM15 47h34l4 9H11z"/><path class="piece-detail" d="M37 14L27 29M21 45h22M15 52h34"/>',
    Q: '<path class="piece-body" d="M13 18l9 9 10-15 10 15 9-9-5 28H18zM14 47h36l4 9H10z"/><circle class="piece-body" cx="12" cy="15" r="4"/><circle class="piece-body" cx="32" cy="9" r="4"/><circle class="piece-body" cx="52" cy="15" r="4"/><path class="piece-detail" d="M18 39h28M15 51h34"/>',
    K: '<path class="piece-detail" d="M32 4v15M25 11h14"/><path class="piece-body" d="M24 19h16l5 10-6 8 6 10H19l6-10-6-8zM14 47h36l4 9H10z"/><path class="piece-detail" d="M21 28h22M20 45h24M15 52h34"/>'
  };
  return `<svg class="piece-svg ${color} ${extraClass}" viewBox="0 0 64 64" role="img" aria-label="${label}">${shapes[type]}</svg>`;
}

function showRules() { $("rulesModal").classList.remove("hidden"); }
function hideRules() { $("rulesModal").classList.add("hidden"); }
function showGame() { $("lobbyScreen").classList.add("hidden"); $("gameScreen").classList.remove("hidden"); }

function buildPieceGuide() {
  const descriptions = { K: "공격을 피해야 해요", Q: "모든 방향으로 이동", R: "가로·세로 이동", B: "대각선 이동", N: "ㄴ자 모양 이동", P: "앞으로 이동" };
  $("pieceGuide").innerHTML = ["K", "Q", "R", "B", "N", "P"].map(type => `<div class="guide-piece">${pieceSvg(`w${type}`)}<span><strong>${PIECE_NAMES[type]}</strong><small>${descriptions[type]}</small></span></div>`).join("");
}

function rulesState() {
  if (!gameState) return ClassChessRules.createInitialState();
  return {
    board: [...gameState.board],
    turn: gameState.turn,
    castling: gameState.castling || "",
    epSquare: Number.isInteger(gameState.epSquare) ? gameState.epSquare : null,
    halfmove: 0,
    fullmove: 1,
    lastMove: gameState.lastMove,
    history: [],
    san: [...(gameState.moves || [])],
    captures: [...(gameState.captures || [])]
  };
}

function myColor() { return gameState?.myColor || "w"; }
function isMyPiece(piece) { return piece && piece[0] === gameState?.myColor; }

function selectSquare(square) {
  if (!gameState || gameState.phase !== "playing" || actionPending || gameState.turn !== gameState.myColor) return;
  const piece = gameState.board[square];
  if (selected != null) {
    const candidates = legalTargets.filter(move => move.to === square);
    if (candidates.length) {
      if (candidates.some(move => move.promotion)) return openPromotion(selected, square);
      return submitMove(selected, square, "");
    }
  }
  if (isMyPiece(piece)) {
    selected = selected === square ? null : square;
    legalTargets = selected == null ? [] : ClassChessRules.legalMoves(rulesState(), selected);
  } else {
    selected = null;
    legalTargets = [];
  }
  renderBoard();
}

function openPromotion(from, to) {
  pendingPromotion = { from, to };
  $("promotionChoices").innerHTML = ["Q", "R", "B", "N"].map(type => `<button class="promotion-choice" type="button" data-promotion="${type}" aria-label="${PIECE_NAMES[type]}으로 승격">${pieceSvg(`${gameState.myColor}${type}`)}</button>`).join("");
  $("promotionModal").classList.remove("hidden");
}

function closePromotion() { pendingPromotion = null; $("promotionModal").classList.add("hidden"); }

function submitMove(from, to, promotion) {
  if (actionPending) return;
  actionPending = true;
  selected = null;
  legalTargets = [];
  renderBoard();
  const sent = lobby.sendServer({
    type: "CHESS_ACTION",
    action: "MOVE",
    from: ClassChessRules.squareName(from),
    to: ClassChessRules.squareName(to),
    promotion: promotion || ""
  });
  if (!sent) {
    actionPending = false;
    showToast("착수를 서버에 보내지 못했습니다.");
  }
}

function renderBoard() {
  if (!gameState) return;
  const board = $("board");
  const fragment = document.createDocumentFragment();
  const reverse = myColor() === "b";
  const checkedKing = gameState.checked ? gameState.board.indexOf(`${gameState.turn}K`) : -1;
  const legalByTarget = new Map(legalTargets.map(move => [move.to, move]));
  for (let viewRank = 0; viewRank < 8; viewRank += 1) {
    for (let viewFile = 0; viewFile < 8; viewFile += 1) {
      const file = reverse ? 7 - viewFile : viewFile;
      const rank = reverse ? viewRank : 7 - viewRank;
      const square = rank * 8 + file;
      const piece = gameState.board[square];
      const button = document.createElement("button");
      button.type = "button";
      button.className = `square ${(file + rank) % 2 === 0 ? "dark" : "light"}`;
      button.dataset.square = String(square);
      button.setAttribute("role", "gridcell");
      button.setAttribute("aria-label", `${ClassChessRules.squareName(square)}${piece ? ` ${piece[0] === "w" ? "백" : "흑"} ${PIECE_NAMES[piece[1]]}` : " 빈 칸"}`);
      if (selected === square) button.classList.add("selected");
      if (gameState.lastMove && [gameState.lastMove.from, gameState.lastMove.to].includes(square)) button.classList.add("last");
      if (square === checkedKing) button.classList.add("check");
      const target = legalByTarget.get(square);
      if (target) button.classList.add(target.capture ? "legal-capture" : "legal-empty");
      if (viewRank === 7) button.insertAdjacentHTML("beforeend", `<span class="coord file">${ClassChessRules.FILES[file]}</span>`);
      if (viewFile === 0) button.insertAdjacentHTML("beforeend", `<span class="coord rank">${rank + 1}</span>`);
      if (piece) button.insertAdjacentHTML("beforeend", pieceSvg(piece));
      button.addEventListener("click", () => selectSquare(square));
      fragment.appendChild(button);
    }
  }
  board.replaceChildren(fragment);
}

function playerFor(color) { return gameState?.players?.find(player => player.color === color) || { name: color === "w" ? "백" : "흑", color }; }

function playerBarHtml(color, mine) {
  const player = playerFor(color);
  return `<div class="player-info"><span class="color-dot ${color}"></span><span><strong>${escapeHtml(player.name)}</strong><span class="side-label"> · ${color === "w" ? "백" : "흑"}${mine ? " · 나" : ""}</span></span></div><div class="player-clock" data-clock-color="${color}">--:--</div>`;
}

function renderPlayerBars() {
  const mine = myColor();
  const other = mine === "w" ? "b" : "w";
  $("topPlayer").innerHTML = playerBarHtml(other, false);
  $("bottomPlayer").innerHTML = playerBarHtml(mine, true);
  updateClocks();
}

function formatClock(milliseconds) {
  if (milliseconds == null) return "∞";
  const seconds = Math.max(0, Math.ceil(milliseconds / 1000));
  return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}

function currentClock(color) {
  let value = gameState?.clocks?.[color];
  if (value == null) return null;
  if (gameState.phase === "playing" && gameState.turn === color) value -= performance.now() - receivedAt;
  return Math.max(0, value);
}

function updateClocks() {
  if (!gameState) return;
  document.querySelectorAll("[data-clock-color]").forEach(element => {
    const color = element.dataset.clockColor;
    const value = currentClock(color);
    element.textContent = formatClock(value);
    element.classList.toggle("active", gameState.phase === "playing" && gameState.turn === color);
    element.classList.toggle("urgent", value != null && value > 0 && value <= 10000 && gameState.turn === color);
  });
}

function renderMoves() {
  const moves = gameState.moves || [];
  if (!moves.length) {
    $("moveList").innerHTML = '<div class="move-empty">아직 둔 수가 없습니다.</div>';
    return;
  }
  const rows = [];
  for (let index = 0; index < moves.length; index += 2) rows.push(`<div class="move-row"><span class="move-no">${index / 2 + 1}.</span><span>${escapeHtml(moves[index])}</span><span>${escapeHtml(moves[index + 1] || "")}</span></div>`);
  $("moveList").innerHTML = rows.join("");
  $("moveList").scrollTop = $("moveList").scrollHeight;
}

function renderCaptures() {
  const captures = gameState.captures || [];
  const mine = myColor();
  const mineCaptured = captures.filter(piece => piece[0] !== mine);
  const otherCaptured = captures.filter(piece => piece[0] === mine);
  const fill = (element, pieces) => {
    element.innerHTML = pieces.length ? pieces.map(piece => pieceSvg(piece, "capture-piece")).join("") : '<span class="capture-empty">아직 없음</span>';
  };
  fill($("myCaptures"), mineCaptured);
  fill($("opponentCaptures"), otherCaptured);
}

function resultText() {
  if (!gameState?.result) return gameState?.lastAction || "대국을 준비하고 있습니다.";
  const labels = { checkmate: "체크메이트", timeout: "시간패", resign: "기권", stalemate: "스테일메이트", threefold: "3회 동형 반복", "fifty-move": "50수 규칙", insufficient: "기물 부족", agreement: "합의 무승부" };
  const result = gameState.result;
  if (!result.winner) return `${labels[result.reason] || "무승부"} · 무승부`;
  return `${labels[result.reason] || "대국 종료"} · ${result.winner === "w" ? "백" : "흑"} 승리`;
}

function renderStatus() {
  const playing = gameState.phase === "playing";
  $("turnText").textContent = gameState.phase === "ended" ? resultText() : gameState.turn === gameState.myColor ? "내 차례" : `${gameState.turn === "w" ? "백" : "흑"} 차례`;
  $("timeModeText").textContent = gameState.timeControl?.label || TIME_LABELS[gameState.timeControl?.key] || "";
  $("notice").textContent = gameState.lastAction || (playing ? "움직일 말을 선택하세요." : "대국을 준비하고 있습니다.");
  const incomingDraw = playing && gameState.drawOfferBy && gameState.drawOfferBy !== lobby.snapshot().myId;
  $("drawResponse").classList.toggle("hidden", !incomingDraw);
  $("drawBtn").disabled = !playing || !!gameState.drawOfferBy;
  $("resignBtn").disabled = !playing;
  $("rematchBtn").classList.toggle("hidden", gameState.phase !== "ended");
  $("rematchBtn").disabled = !!gameState.rematchRequested;
  $("rematchBtn").textContent = gameState.rematchRequested ? `상대방을 기다리는 중 · ${gameState.rematchCount}/2` : "재대국";
}

function renderGame() {
  if (!gameState) return;
  renderBoard();
  renderPlayerBars();
  renderMoves();
  renderCaptures();
  renderStatus();
}

function applyServerMessage(message) {
  if (message.type === SERVER_MESSAGE.STATE) {
    const previousRevision = gameState?.revision;
    gameState = message.state;
    receivedAt = performance.now();
    actionPending = false;
    if (previousRevision !== gameState.revision) { selected = null; legalTargets = []; }
    if (gameState.phase === "playing" || gameState.phase === "ended") showGame();
    renderGame();
    return;
  }
  if (message.type === SERVER_MESSAGE.ERROR) {
    actionPending = false;
    showToast(message.message || "행동을 처리하지 못했습니다.");
    renderGame();
  }
}

function addChatMessage(message, mineOverride = null) {
  if (!message?.id || seenChatIds.has(message.id)) return;
  seenChatIds.add(message.id);
  const mine = mineOverride == null ? String(message.senderId) === String(lobby.snapshot().myId) : mineOverride;
  chatMessages.push({ ...message, mine });
  if (chatMessages.length > 50) chatMessages.shift();
  if (!mine && !$("gameScreen").classList.contains("hidden") && !$("gameChatLog").closest("details").open) unreadChat += 1;
  renderChat();
}

function renderChat() {
  const html = chatMessages.length ? chatMessages.map(message => `<div class="chat-message ${message.mine ? "mine" : "other"}"><b>${escapeHtml(message.name)}:</b> ${escapeHtml(message.text)}</div>`).join("") : '<div class="chat-empty">아직 메시지가 없습니다.</div>';
  [$("lobbyChatLog"), $("gameChatLog")].forEach(element => { element.innerHTML = html; element.scrollTop = element.scrollHeight; });
  $("chatBadge").textContent = String(unreadChat);
  $("chatBadge").classList.toggle("hidden", unreadChat === 0);
}

function sendChat(sourceId) {
  const input = $(sourceId);
  const text = String(input.value || "").trim().replace(/\s+/g, " ").slice(0, 100);
  if (!text || !lobby.snapshot().connected) return;
  const message = { type: "CHESS_CHAT", id: crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`, senderId: lobby.snapshot().myId, name: savedName, text };
  addChatMessage(message, true);
  input.value = "";
  if (lobby.snapshot().role === "host") lobby.broadcast(message);
  else lobby.send(message);
}

function handleGameMessage(senderId, payload) {
  if (payload?.type !== "CHESS_CHAT") return;
  const message = { ...payload, senderId: payload.senderId || senderId, name: String(payload.name || "플레이어").slice(0, 12), text: String(payload.text || "").slice(0, 100) };
  addChatMessage(message);
  if (lobby.snapshot().role === "host" && String(senderId) !== String(lobby.snapshot().myId)) lobby.broadcast(message);
}

function syncLobby(snapshot) {
  const connected = snapshot.connected;
  [$("lobbyChatInput"), $("gameChatInput")].forEach(input => { input.disabled = !connected; });
}

function showAbort({ title, message }) {
  $("abortTitle").textContent = title;
  $("abortMessage").textContent = message;
  $("abortModal").classList.remove("hidden");
}

function sendAction(action) {
  if (!lobby.sendServer({ type: "CHESS_ACTION", action })) showToast("서버에 요청을 보내지 못했습니다.");
}

function init() {
  buildPieceGuide();
  lobby = ClassroomMultiplayerLobby.create({
    gameId: GAME_ID,
    initialMode: "host",
    getPlayerName: () => /^[가-힣]{2,6}$/.test(savedName) ? savedName : "",
    allowedPlayerCounts: [2],
    maxPlayers: 2,
    rulesButtonIds: ["rulesBtnLobby", "rulesBtnGame"],
    leaveButtonIds: ["leaveBtn"],
    onRules: showRules,
    onLeave: () => { location.href = "../../../"; },
    onNotice: showToast,
    onInvalidStart: () => showToast("두 명이 모여야 시작할 수 있습니다."),
    onStateChange: syncLobby,
    getLobbyData: () => ({ timeControl: $("timeControl").value }),
    onLobbyData: data => {
      lobbyTimeControl = TIME_LABELS[data?.timeControl] ? data.timeControl : "quick";
      $("guestTimeLabel").textContent = `대국 시간 · ${TIME_LABELS[lobbyTimeControl]}`;
    },
    getLobbyPresentation: ({ count, role, canStart }) => ({
      canStart,
      startText: role === "host" && canStart ? "START CHESS" : role === "host" ? "WAITING FOR PLAYER · 1/2" : "WAITING FOR HOST",
      guideText: role === "host" ? (count === 2 ? "두 명이 준비되었습니다. 색상은 무작위로 정해집니다." : "상대방이 방 번호로 들어오기를 기다리고 있습니다.") : `방장이 대국을 시작합니다 · ${TIME_LABELS[lobbyTimeControl]}`
    }),
    createStartData: () => ({ serverAuthoritative: true, timeControl: $("timeControl").value }),
    onStarted: ({ data }) => {
      showGame();
      if (lobby.snapshot().role === "host") lobby.sendServer({ type: "CHESS_ACTION", action: "START", timeControl: data?.timeControl || $("timeControl").value });
    },
    onServerMessage: applyServerMessage,
    onGameMessage: handleGameMessage,
    onPlayerLeftDuringGame: () => showToast("상대방의 재접속을 기다리고 있습니다."),
    onAbort: showAbort
  }).mount();

  $("timeControl").addEventListener("change", () => { lobbyTimeControl = $("timeControl").value; lobby.publishLobbyState(); });
  $("closeRulesBtn").addEventListener("click", hideRules);
  $("rulesModal").addEventListener("click", event => { if (event.target === $("rulesModal")) hideRules(); });
  $("cancelPromotionBtn").addEventListener("click", closePromotion);
  $("promotionChoices").addEventListener("click", event => {
    const button = event.target.closest("[data-promotion]");
    if (!button || !pendingPromotion) return;
    const { from, to } = pendingPromotion;
    const promotion = button.dataset.promotion;
    closePromotion();
    submitMove(from, to, promotion);
  });
  document.querySelectorAll("[data-chat-source]").forEach(button => button.addEventListener("click", () => sendChat(button.dataset.chatSource)));
  [$("lobbyChatInput"), $("gameChatInput")].forEach(input => input.addEventListener("keydown", event => { if (event.key === "Enter") { event.preventDefault(); sendChat(input.id); } }));
  $("gameChatLog").closest("details").addEventListener("toggle", event => { if (event.target.open) { unreadChat = 0; renderChat(); } });
  $("resignBtn").addEventListener("click", () => { if (confirm("정말 기권하시겠습니까?")) sendAction("RESIGN"); });
  $("drawBtn").addEventListener("click", () => sendAction("OFFER_DRAW"));
  $("acceptDrawBtn").addEventListener("click", () => sendAction("ACCEPT_DRAW"));
  $("declineDrawBtn").addEventListener("click", () => sendAction("DECLINE_DRAW"));
  $("rematchBtn").addEventListener("click", () => sendAction("REMATCH"));
  window.setInterval(updateClocks, 100);
}

window.addEventListener("DOMContentLoaded", init);
