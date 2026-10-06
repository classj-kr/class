"use strict";

const GAME_ID = "kingdomtrails";
const SERVER_MESSAGE = Object.freeze({ STATE: "KINGDOMTRAILS_STATE", ERROR: "KINGDOMTRAILS_ERROR" });
const SIDES = ["north", "east", "south", "west"];
const DIRECTIONS = [{ x: 0, y: -1 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: -1, y: 0 }];
const OPPOSITE = [2, 3, 0, 1];
const STRATEGY_TIPS = [
  "큰 마을은 점수가 높지만 완성까지 오래 걸립니다. 탐험가 수를 남겨 두세요.",
  "상대가 시작한 길과 마을도 이어 줄 수 있습니다. 누구에게 점수가 갈지 먼저 살펴보세요.",
  "수도원은 주변 8칸이 채워져야 완성됩니다. 왕국 가운데에 놓을수록 유리합니다.",
  "타일을 회전할 때마다 놓을 수 있는 자리가 달라집니다. 네 방향을 모두 확인해 보세요."
];
const $ = id => document.getElementById(id);

let lobby = null;
let gameState = null;
let selectedRotation = 0;
let selectedClaim = "";
let actionPending = false;
let lastRevision = -1;
let toastTimer = null;
let resizeTimer = null;
const savedName = String((window.CLASS_PLAYER_NAME || "") || "").trim();

const MUSIC_TRACKS = Object.freeze([
  "/learning/games/kingdom-trails/assets/sound/kingdom-trails-table.m4a"
]);

function playSound(name) {
  const sounds = { rotate: "card", claim: "click", place: "stone", turn: "bell", score: "success", finish: "success" };
  window.ClassGameSfx?.play(sounds[name] || "click");
}

function initMusic() {
  const audio = $("bgm");
  let trackIndex = Math.floor(Math.random() * MUSIC_TRACKS.length);
  const loadTrack = () => {
    audio.src = MUSIC_TRACKS[trackIndex];
    audio.load();
  };
  loadTrack();
  audio.addEventListener("ended", () => {
    trackIndex = (trackIndex + 1) % MUSIC_TRACKS.length;
    loadTrack();
    audio.play().catch(() => {});
  });
  requestAnimationFrame(() => syncAudioControlDock(!$("gameScreen").classList.contains("hidden")));
}

function syncAudioControlDock(inGame) {
  const control = document.querySelector(".unified-music-control");
  if (!control) return;
  if (inGame) {
    if (control.parentElement !== $("topActions")) $("topActions").prepend(control);
  } else if (control.parentElement !== document.body) document.body.appendChild(control);
}

function html(value) {
  return String(value ?? "").replace(/[&<>"']/g, character => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[character]);
}

function showToast(message) {
  clearTimeout(toastTimer);
  $("toast").textContent = message;
  $("toast").classList.remove("hidden");
  toastTimer = setTimeout(() => $("toast").classList.add("hidden"), 2300);
}

function showRules() { $("rulesOverlay").classList.remove("hidden"); }
function hideRules() { $("rulesOverlay").classList.add("hidden"); }
function showLobby() {
  $("gameScreen").classList.add("hidden");
  $("lobbyScreen").classList.remove("hidden");
  syncAudioControlDock(false);
}
function showGame() {
  $("lobbyScreen").classList.add("hidden");
  $("gameScreen").classList.remove("hidden");
  syncAudioControlDock(true);
}

function myId() { return lobby?.snapshot()?.myId || gameState?.myId || ""; }
function myPlayer() { return gameState?.players?.find(player => player.id === myId()) || null; }
function activePlayer() { return gameState?.players?.find(player => player.id === gameState.activePlayerId) || null; }
function isMyTurn() { return gameState?.phase === "playing" && gameState.activePlayerId === myId(); }
function boardKey(x, y) { return `${x},${y}`; }
function rotateEdges(edges, rotation) {
  const turns = ((Number(rotation) || 0) % 4 + 4) % 4;
  return edges.map((_, index) => edges[(index - turns + 4) % 4]);
}

function tileHash(value) {
  let hash = 0;
  for (const character of String(value)) hash = ((hash << 5) - hash + character.charCodeAt(0)) | 0;
  return Math.abs(hash);
}

function makeTileFace(tile, { preview = false } = {}) {
  const face = document.createElement("div");
  face.className = "tile-face";
  const hashValue = tileHash(tile.id);
  face.style.backgroundPosition = `${18 + hashValue % 65}% ${16 + Math.floor(hashValue / 9) % 68}%`;
  face.setAttribute("aria-hidden", "true");

  const citySides = [];
  (tile.edges || []).forEach((feature, side) => {
    if (feature === "field") return;
    const edge = document.createElement("span");
    edge.className = `edge ${feature} ${SIDES[side]}`;
    face.appendChild(edge);
    if (feature === "city") citySides.push(side);
  });
  if (citySides.length > 1) {
    const core = document.createElement("span");
    core.className = "city-core";
    face.appendChild(core);
  }
  if (tile.center === "monastery") {
    const monastery = document.createElement("span");
    monastery.className = "monastery";
    monastery.textContent = "♜";
    face.appendChild(monastery);
  } else if (tile.kind === "meadow" || tile.kind === "start-village") {
    const detail = document.createElement("span");
    detail.className = "meadow-detail";
    detail.textContent = tile.kind === "start-village" ? "⌂" : "♣";
    face.appendChild(detail);
  }
  if (tile.worker) {
    const owner = gameState?.players?.find(player => player.id === tile.worker.playerId);
    const worker = document.createElement("span");
    worker.className = `worker ${tile.worker.feature}`;
    worker.style.setProperty("--worker-color", owner?.color || "#e04f3f");
    worker.title = `${owner?.name || "탐험가"} · ${tile.worker.feature}`;
    face.appendChild(worker);
  }
  if (preview) face.classList.add("preview-face");
  return face;
}

function boardMap() {
  return new Map((gameState?.board || []).map(tile => [boardKey(tile.x, tile.y), tile]));
}

function candidatePositions() {
  const board = boardMap();
  const candidates = new Map();
  for (const tile of gameState?.board || []) {
    DIRECTIONS.forEach(direction => {
      const x = tile.x + direction.x;
      const y = tile.y + direction.y;
      const key = boardKey(x, y);
      if (!board.has(key)) candidates.set(key, { x, y });
    });
  }
  return [...candidates.values()];
}

function validAt(position, rotation = selectedRotation) {
  if (!gameState?.currentTile) return false;
  const board = boardMap();
  const edges = rotateEdges(gameState.currentTile.edges, rotation);
  let neighbors = 0;
  for (let side = 0; side < 4; side += 1) {
    const direction = DIRECTIONS[side];
    const neighbor = board.get(boardKey(position.x + direction.x, position.y + direction.y));
    if (!neighbor) continue;
    neighbors += 1;
    if (edges[side] !== neighbor.edges[OPPOSITE[side]]) return false;
  }
  return neighbors > 0;
}

function legalPositions() {
  return isMyTurn() ? candidatePositions().filter(position => validAt(position)) : [];
}

function renderPlayers() {
  const fragment = document.createDocumentFragment();
  for (const player of gameState.players || []) {
    const card = document.createElement("article");
    const active = gameState.phase === "playing" && player.id === gameState.activePlayerId;
    card.className = `player-card${active ? " active" : ""}`;
    card.style.setProperty("--player", player.color);
    card.innerHTML = `<span class="player-token" aria-hidden="true">♟</span><div class="player-copy"><strong>${html(player.name)}${player.id === myId() ? " · 나" : ""}</strong><small>탐험가 ${player.workers}명</small></div><span class="player-score">${player.score}<small>점</small></span>`;
    fragment.appendChild(card);
  }
  $("playerStrip").replaceChildren(fragment);
}

function renderTurn() {
  const player = activePlayer();
  if (gameState.phase === "ended") {
    $("turnBadge").textContent = "완성";
    $("turnTitle").textContent = "왕국이 완성됐습니다";
    $("turnMessage").textContent = gameState.lastAction;
  } else if (isMyTurn()) {
    $("turnBadge").textContent = "내 차례";
    $("turnTitle").textContent = "타일을 돌려 빈칸에 놓으세요";
    $("turnMessage").textContent = gameState.lastAction;
  } else {
    $("turnBadge").textContent = "기다리는 중";
    $("turnTitle").textContent = `${player?.name || "플레이어"}님의 차례`;
    $("turnMessage").textContent = gameState.lastAction;
  }
  $("lastAction").textContent = gameState.lastAction;
  $("strategyTip").textContent = STRATEGY_TIPS[gameState.turnNumber % STRATEGY_TIPS.length];
}

function renderClock() {
  const clock = $("turnClock");
  if (gameState?.phase !== "playing" || !gameState.turnDeadline) {
    clock.classList.add("hidden");
    return;
  }
  clock.classList.remove("hidden");
  const total = (gameState.turnSeconds || 40) * 1000;
  const remaining = Math.max(0, gameState.turnDeadline - Date.now());
  const seconds = Math.ceil(remaining / 1000);
  $("turnSeconds").textContent = seconds;
  $("turnTimerBar").style.transform = `scaleX(${Math.max(0, Math.min(1, remaining / total))})`;
  clock.classList.toggle("urgent", seconds <= 8);
}

function renderCurrentTile() {
  const preview = $("currentTilePreview");
  preview.replaceChildren();
  const tile = gameState.currentTile;
  if (tile) preview.appendChild(makeTileFace({ ...tile, edges: rotateEdges(tile.edges, selectedRotation) }, { preview: true }));
  $("deckCount").textContent = `${gameState.deckCount + (tile ? 1 : 0)}장`;
  $("workerCount").textContent = `${myPlayer()?.workers || 0}명 남음`;
  $("rotateBtn").disabled = !isMyTurn() || actionPending || !tile;
  $("hintBtn").disabled = !isMyTurn() || actionPending || !tile;

  const available = new Set([""]);
  if (tile?.edges?.includes("road")) available.add("road");
  if (tile?.edges?.includes("city")) available.add("city");
  if (tile?.center === "monastery") available.add("monastery");
  if ((myPlayer()?.workers || 0) <= 0) {
    available.delete("road"); available.delete("city"); available.delete("monastery");
  }
  if (!available.has(selectedClaim)) selectedClaim = "";
  document.querySelectorAll(".claim-button").forEach(button => {
    const value = button.dataset.claim || "";
    button.disabled = !isMyTurn() || actionPending || !available.has(value);
    button.classList.toggle("selected", value === selectedClaim);
    button.setAttribute("aria-pressed", String(value === selectedClaim));
  });
  const count = legalPositions().length;
  $("placementGuide").textContent = !isMyTurn()
    ? `${activePlayer()?.name || "다른 플레이어"}님이 타일을 놓는 중입니다.`
    : count
      ? `현재 방향에서 놓을 수 있는 자리 ${count}곳이 빛납니다.`
      : "이 방향에는 자리가 없습니다. 타일을 회전해 보세요.";
}

function renderBoard() {
  const world = $("boardWorld");
  const board = gameState?.board || [];
  const legal = legalPositions();
  const cells = [...board, ...legal];
  if (!cells.length) return;
  const minimumX = Math.min(...cells.map(cell => cell.x));
  const maximumX = Math.max(...cells.map(cell => cell.x));
  const minimumY = Math.min(...cells.map(cell => cell.y));
  const maximumY = Math.max(...cells.map(cell => cell.y));
  const tileSize = Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--tile-size")) || 76;
  const viewport = $("boardViewport");
  const padding = tileSize * 1.35;
  const width = Math.max(viewport.clientWidth || 520, (maximumX - minimumX + 1) * tileSize + padding * 2);
  const height = Math.max(viewport.clientHeight || 520, (maximumY - minimumY + 1) * tileSize + padding * 2);
  world.style.width = `${width}px`;
  world.style.height = `${height}px`;

  const point = (x, y) => ({
    left: padding + (x - minimumX) * tileSize,
    top: padding + (y - minimumY) * tileSize
  });
  const fragment = document.createDocumentFragment();
  for (const tile of board) {
    const position = point(tile.x, tile.y);
    const holder = document.createElement("div");
    holder.className = `board-tile${tile.order === board.length - 1 ? " latest" : ""}`;
    holder.style.left = `${position.left}px`;
    holder.style.top = `${position.top}px`;
    holder.setAttribute("aria-label", `${tile.x}, ${tile.y} 위치의 ${tile.kind} 타일`);
    holder.appendChild(makeTileFace(tile));
    fragment.appendChild(holder);
  }
  const suggestion = gameState.suggestedPlacement;
  for (const cell of legal) {
    const position = point(cell.x, cell.y);
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.sfx = "none";
    button.className = "placement-cell";
    if (suggestion && cell.x === suggestion.x && cell.y === suggestion.y && selectedRotation === suggestion.rotation) button.classList.add("suggested");
    button.style.left = `${position.left}px`;
    button.style.top = `${position.top}px`;
    button.setAttribute("aria-label", `${cell.x}, ${cell.y} 위치에 타일 놓기`);
    button.disabled = actionPending;
    button.addEventListener("click", () => placeAt(cell.x, cell.y));
    fragment.appendChild(button);
  }
  world.replaceChildren(fragment);
  $("boardTileCount").textContent = board.length;
}

function renderResult() {
  const ended = gameState.phase === "ended";
  $("playArea").classList.toggle("hidden", ended);
  $("resultPanel").classList.toggle("hidden", !ended);
  if (!ended) return;
  const winners = gameState.players.filter(player => gameState.winnerIds.includes(player.id));
  $("resultTitle").textContent = winners.some(player => player.id === myId()) ? "나의 왕국이 빛났습니다!" : `${winners.map(player => player.name).join(", ")} 승리`;
  $("resultMessage").textContent = gameState.lastAction;
  const body = document.createDocumentFragment();
  [...gameState.players].sort((left, right) => right.score - left.score).forEach(player => {
    const row = document.createElement("tr");
    if (gameState.winnerIds.includes(player.id)) row.className = "winner";
    row.innerHTML = `<td>${html(player.name)}${player.id === myId() ? " · 나" : ""}</td><td>${player.score}점</td><td>${player.workers}명</td>`;
    body.appendChild(row);
  });
  $("scoreBody").replaceChildren(body);
  const actions = document.createDocumentFragment();
  if (lobby.snapshot().role === "host") {
    const again = document.createElement("button");
    again.type = "button"; again.className = "button primary"; again.textContent = "같은 멤버로 다시";
    again.addEventListener("click", () => sendHostAction("NEW_GAME"));
    const back = document.createElement("button");
    back.type = "button"; back.className = "button secondary"; back.textContent = "대기실로";
    back.addEventListener("click", () => sendHostAction("RETURN_LOBBY"));
    actions.append(again, back);
  } else {
    const wait = document.createElement("span"); wait.textContent = "방장이 다음 게임을 준비하고 있습니다."; actions.appendChild(wait);
  }
  $("resultActions").replaceChildren(actions);
}

function renderGame() {
  if (!gameState || gameState.phase === "lobby") return;
  showGame();
  renderPlayers();
  renderTurn();
  renderClock();
  renderCurrentTile();
  renderBoard();
  renderResult();
}

function rotateCurrentTile() {
  if (!isMyTurn() || actionPending) return;
  selectedRotation = (selectedRotation + 1) % 4;
  renderCurrentTile();
  renderBoard();
}

function chooseClaim(value) {
  if (!isMyTurn() || actionPending) return;
  selectedClaim = value;
  renderCurrentTile();
}

function showHint() {
  if (!isMyTurn() || actionPending || !gameState.suggestedPlacement) return;
  selectedRotation = gameState.suggestedPlacement.rotation;
  renderCurrentTile();
  renderBoard();
  const suggested = document.querySelector(".placement-cell.suggested");
  suggested?.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
  showToast("추천 자리를 밝혔습니다. 다른 자리도 선택할 수 있어요.");
}

function placeAt(x, y) {
  if (!isMyTurn() || actionPending || !validAt({ x, y })) return;
  actionPending = true;
  renderCurrentTile(); renderBoard();
  const sent = lobby.sendServer({
    type: "KINGDOMTRAILS_ACTION",
    action: "PLACE",
    x,
    y,
    rotation: selectedRotation,
    claim: selectedClaim || null
  });
  if (!sent) {
    actionPending = false;
    renderCurrentTile(); renderBoard();
    showToast("서버에 타일을 보내지 못했습니다.");
  }
}

function installState(state) {
  const previousState = gameState;
  const changed = state.revision !== lastRevision;
  gameState = state;
  actionPending = false;
  if (changed) {
    lastRevision = state.revision;
    selectedRotation = 0;
    selectedClaim = "";
  }
  if (state.phase === "lobby") {
    if (lobby.snapshot().started) lobby.returnToLobby();
    showLobby();
    if (state.lastAction) showToast(state.lastAction);
    return;
  }
  if (changed && previousState) {
    const placedTile = (state.board?.length || 0) > (previousState.board?.length || 0);
    const previousScore = (previousState.players || []).reduce((sum, player) => sum + player.score, 0);
    const currentScore = (state.players || []).reduce((sum, player) => sum + player.score, 0);
    if (previousState.phase !== "ended" && state.phase === "ended") playSound("finish");
    else if (placedTile) {
      playSound("place");
      if (currentScore > previousScore) setTimeout(() => playSound("score"), 160);
    } else if (previousState.activePlayerId !== state.activePlayerId && state.activePlayerId === myId()) playSound("turn");
  }
  renderGame();
}

function handleServerMessage(message) {
  if (message.type === SERVER_MESSAGE.STATE && message.state) {
    installState(message.state);
    return;
  }
  if (message.type === SERVER_MESSAGE.ERROR) {
    actionPending = false;
    renderCurrentTile(); renderBoard();
    showToast(message.message || "행동을 처리하지 못했습니다.");
  }
}

function sendHostAction(action) {
  if (lobby.snapshot().role === "host") lobby.sendServer({ type: "KINGDOMTRAILS_ACTION", action });
}

function syncLobby(snapshot) {
  $("gameRoomCode").textContent = snapshot.roomCode || "----";
}

function showAbort({ title, message }) {
  $("abortTitle").textContent = title;
  $("abortMessage").textContent = message;
  $("abortOverlay").classList.remove("hidden");
}

function init() {
  setInterval(renderClock, 250);
  initMusic();
  lobby = ClassroomMultiplayerLobby.create({
    gameId: GAME_ID,
    initialMode: "guest",
    getPlayerName: () => /^[가-힣]{2,6}$/.test(savedName) ? savedName : "",
    allowedPlayerCounts: [2, 3, 4],
    maxPlayers: 4,
    rulesButtonIds: ["rulesBtnLobby", "rulesBtnGame"],
    leaveButtonIds: ["leaveBtnLobby", "leaveBtnGame"],
    onRules: showRules,
    onLeave: () => location.href = "../../../index.html",
    onNotice: showToast,
    onInvalidStart: () => showToast("2~4명이 모이면 시작할 수 있습니다."),
    onStateChange: syncLobby,
    getLobbyPresentation: ({ count, role, canStart }) => ({
      canStart,
      startText: role === "host" && canStart ? `${count}명으로 왕국 만들기` : "플레이어를 기다리는 중",
      guideText: role === "host" ? `현재 ${count}명 · 2~4명에서 시작할 수 있어요.` : "방장이 게임을 시작할 때까지 기다려 주세요."
    }),
    createStartData: () => ({ serverAuthoritative: true }),
    onStarted: () => { showGame(); if (lobby.snapshot().role === "host") sendHostAction("START"); },
    onServerMessage: handleServerMessage,
    onPlayerLeftDuringGame: () => showToast("플레이어가 나가 대기실로 돌아갑니다."),
    onAbort: showAbort
  }).mount();

  $("rotateBtn").addEventListener("click", rotateCurrentTile);
  $("hintBtn").addEventListener("click", showHint);
  document.querySelectorAll(".claim-button").forEach(button => button.addEventListener("click", () => chooseClaim(button.dataset.claim || "")));
  $("closeRulesBtn").addEventListener("click", hideRules);
  $("closeRulesBottomBtn").addEventListener("click", hideRules);
  $("rulesOverlay").addEventListener("click", event => { if (event.target === $("rulesOverlay")) hideRules(); });
  $("reloadBtn").addEventListener("click", () => location.reload());
  window.addEventListener("keydown", event => {
    if (!$("rulesOverlay").classList.contains("hidden")) { if (event.key === "Escape") hideRules(); return; }
    if (event.key.toLowerCase() === "r") rotateCurrentTile();
  });
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { if (gameState?.phase === "playing") renderBoard(); }, 120);
  });
}

window.addEventListener("DOMContentLoaded", init);

