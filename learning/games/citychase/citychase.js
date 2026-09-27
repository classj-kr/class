(function () {
  "use strict";

  const GAME_ID = "citychase";
  const NAME_KEY = "classPlayerName";
  const MESSAGE = Object.freeze({ ACTION: "CITYCHASE_ACTION", STATE: "CITYCHASE_STATE", ERROR: "CITYCHASE_ERROR" });
  const Board = window.CityChaseData;
  const ASSET = Object.freeze({
    gem: "assets/secret-gem.png",
    alarm: "assets/secret-alarm.png",
    shop: "assets/shop-building.png"
  });
  const MUSIC = Object.freeze({
    lobby: "assets/music/citychase-lobby.ogg",
    game: ["assets/music/citychase-game-1.ogg", "assets/music/citychase-game-2.ogg"]
  });
  const $ = id => document.getElementById(id);
  const savedName = String(localStorage.getItem(NAME_KEY) || "").trim();

  let lobby = null;
  let state = null;
  let actionPending = false;
  let toastTimer = null;
  let placementMode = null;
  let trickNode = null;
  let activeSecret = "gem1";
  let setupSelection = { gem1: null, gem2: null, undercover: null };
  let movementAnimating = false;
  let movementAnimationToken = 0;
  let gameMusicTrack = 0;
  let inspectedNode = null;
  let inspectorReturnFocus = null;
  let boardZoom = 1;
  let boardWidth = 0;
  let boardHeight = 0;
  let boardDrawFrame = 0;
  let suppressBoardClickUntil = 0;
  let rulesReturnFocus = null;
  const noticeQueue = [];

  function myId() { return lobby?.snapshot().myId || ""; }
  function me() { return state?.players.find(player => player.id === myId()) || null; }
  function currentPawn() { return state?.pawns.find(pawn => pawn.id === state.turnPawnId) || null; }
  function pawnById(id) { return state?.pawns.find(pawn => pawn.id === id) || null; }
  function playerById(id) { return state?.players.find(player => player.id === id) || null; }
  function buildingMeta(id) { return Board.BUILDINGS.find(building => building.id === id) || null; }
  function avatarOf(playerId) {
    const key = lobby?.snapshot().players?.[playerId]?.avatarKey;
    return key ? window.ClassroomMultiplayerLobby.avatarUrl(key) : "";
  }

  function pawnControllers(pawnId) {
    return state.players.filter(player => player.pawnIds.includes(pawnId));
  }

  function firstLetter(name) {
    return Array.from(String(name || "?").trim())[0] || "?";
  }
  function nodeMeta(id) { return Board.NODES[id] || null; }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
  }

  function showToast(message) {
    clearTimeout(toastTimer);
    $("toast").textContent = message;
    $("toast").classList.remove("hidden");
    toastTimer = setTimeout(() => $("toast").classList.add("hidden"), 2600);
  }

  function playSfx(name) {
    window.ClassGameSfx?.play(name);
  }

  function syncMusic(phase) {
    const audio = $("bgm");
    if (!audio) return;
    const isLobby = phase === "lobby";
    const track = isLobby ? MUSIC.lobby : MUSIC.game[gameMusicTrack];
    if (audio.dataset.track === track) return;

    audio.dataset.track = track;
    audio.loop = isLobby;
    audio.src = track;
    audio.load();
    audio.play().catch(() => {});
  }

  function advanceGameMusic() {
    if (!state || state.phase === "lobby") return;
    gameMusicTrack = (gameMusicTrack + 1) % MUSIC.game.length;
    syncMusic(state.phase);
  }

  function actionEffect(action, previousState, nextState) {
    if (!action || action === previousState?.lastAction) return null;
    if (nextState.phase === "ended") {
      return { type: nextState.winnerTeam === "thief" ? "gem" : "alarm", sound: "success", label: "게임 승리!" };
    }
    if (/경보 장치|체포|구금/.test(action)) return { type: "alarm", sound: "error", label: "경보 작동!" };
    if (/보석/.test(action)) return { type: "gem", sound: "success", label: /찾았습니다/.test(action) ? "보석 발견!" : "보석 이동!" };
    if (/가짜 단서|차단 표지/.test(action)) return { type: "card", sound: "card", label: /가짜 단서/.test(action) ? "가짜 단서!" : "길목 차단!" };
    if (/굴렸습니다|탈출 성공/.test(action)) return { type: "dice", sound: "stone", label: "주사위 결과" };
    return null;
  }

  function showBoardEffect(effect) {
    const layer = $("boardEffects");
    if (!layer || !effect) return;
    const image = effect.type === "gem" ? ASSET.gem : effect.type === "alarm" ? ASSET.alarm : "";
    const symbol = effect.type === "card" ? "➜" : effect.type === "dice" ? "⚄" : "";
    layer.className = `boardEffects showing ${effect.type}`;
    layer.innerHTML = `<div class="effectBurst"><span class="effectRing"></span>${image ? `<img src="${image}" alt="">` : `<span class="effectSymbol">${symbol}</span>`}<strong>${escapeHtml(effect.label)}</strong>${Array.from({ length: 8 }, (_, index) => `<i style="--i:${index}"></i>`).join("")}</div>`;
    playSfx(effect.sound);
    window.clearTimeout(showBoardEffect.timer);
    showBoardEffect.timer = window.setTimeout(() => {
      layer.className = "boardEffects";
      layer.replaceChildren();
    }, 1450);
  }

  function scheduleStateEffect(previousState, nextState) {
    if (!previousState) return;
    const notice = criticalNotice(nextState.lastAction);
    if (previousState.phase === "playing" && nextState.phase === "playing" && notice
      && nextState.lastAction !== previousState.lastAction) {
      noticeQueue.push({ ...notice, message: nextState.lastAction });
      showNextNotice();
      return;
    }
    const effect = actionEffect(nextState.lastAction, previousState, nextState);
    if (effect) window.requestAnimationFrame(() => showBoardEffect(effect));
  }

  function criticalNotice(message) {
    if (/경보 장치.*작동/.test(message)) return { title: "경보! 체포되었습니다", tone: "alarm", sound: "error" };
    if (/체포되었습니다|체포했습니다/.test(message)) return { title: "도둑이 체포되었습니다", tone: "alarm", sound: "error" };
    if (/보석을 찾았습니다/.test(message)) return { title: "보석 획득!", tone: "gem", sound: "success", detail: "찾은 도둑이 보석을 운반합니다. 비밀기지에 도착해야 확보한 보석으로 계산됩니다." };
    if (/비어 있었습니다/.test(message)) return { title: "수색 완료 · 보석 없음", tone: "empty", sound: "stone" };
    if (/건물을 더 수색하지 않았습니다/.test(message)) return { title: "이미 보석을 운반 중입니다", tone: "empty", sound: "stone", detail: "말 하나는 보석을 한 개만 운반할 수 있습니다. 비밀기지에 먼저 가져가세요." };
    if (/보석을 비밀기지에 보관/.test(message)) return { title: "보석을 확보했습니다!", tone: "gem", sound: "success" };
    if (/보석을 떨어뜨렸습니다/.test(message)) return { title: "보석을 떨어뜨렸습니다", tone: "alarm", sound: "error" };
    if (/정보 누설!/.test(message)) return { title: "보석 위치를 알아냈습니다", tone: "gem", sound: "success", detail: "위치만 확인한 상태입니다. 해당 건물의 수색 칸에 들어가야 이 보석을 얻을 수 있습니다." };
    if (/탈출에 실패/.test(message)) return { title: "이번에는 탈출하지 못했습니다", tone: "alarm", sound: "error" };
    if (/탈출했습니다/.test(message)) return { title: "탈출에 성공했습니다!", tone: "gem", sound: "success" };
    if (/구출해/.test(message)) return { title: "동료를 구출했습니다!", tone: "gem", sound: "success" };
    if (/보석을 넘겼습니다/.test(message)) return { title: "보석을 전달했습니다", tone: "gem", sound: "success" };
    return null;
  }

  function showNextNotice() {
    const dialog = $("eventDialog");
    if (state?.phase !== "playing" || movementAnimating || dialog.open || !noticeQueue.length) return;
    const notice = noticeQueue.shift();
    dialog.dataset.tone = notice.tone;
    $("eventTitle").textContent = notice.title;
    $("eventMessage").textContent = notice.message;
    $("eventDetail").textContent = notice.detail || "";
    $("eventDetail").hidden = !notice.detail;
    dialog.showModal();
    playSfx(notice.sound);
  }
  function sendAction(action, data = {}) {
    if (actionPending || movementAnimating) return false;
    actionPending = true;
    const sent = lobby.sendServer({ type: MESSAGE.ACTION, action, ...data });
    if (!sent) {
      actionPending = false;
      showToast("서버에 행동을 보내지 못했습니다.");
      return false;
    }
    return true;
  }

  function showRules() {
    rulesReturnFocus = document.activeElement;
    $("rulesOverlay").classList.remove("hidden");
    $("closeRulesBtn").focus({ preventScroll: true });
  }
  function hideRules() {
    $("rulesOverlay").classList.add("hidden");
    if (rulesReturnFocus?.isConnected) rulesReturnFocus.focus({ preventScroll: true });
  }

  function drawArrow(ctx, from, to, color, scale) {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const length = Math.hypot(dx, dy) || 1;
    const ux = dx / length;
    const uy = dy / length;
    const cx = from.x + dx * .58;
    const cy = from.y + dy * .58;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(cx + ux * 9 * scale, cy + uy * 9 * scale);
    ctx.lineTo(cx - ux * 8 * scale - uy * 7 * scale, cy - uy * 8 * scale + ux * 7 * scale);
    ctx.lineTo(cx - ux * 8 * scale + uy * 7 * scale, cy - uy * 8 * scale - ux * 7 * scale);
    ctx.closePath();
    ctx.fill();
  }

  function drawBoard() {
    const canvas = $("boardCanvas");
    const width = $("boardStage").clientWidth;
    const height = $("boardStage").clientHeight;
    if (!width || !height) return;
    const density = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * density);
    canvas.height = Math.round(height * density);
    const ctx = canvas.getContext("2d");
    ctx.setTransform(density, 0, 0, density, 0, 0);
    ctx.clearRect(0, 0, width, height);
    const scale = Math.min(width / Board.WIDTH, height / Board.HEIGHT);
    const project = node => ({ x: node.x / Board.WIDTH * width, y: node.y / Board.HEIGHT * height });
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    for (const edge of Board.EDGES) {
      if (!nodeMeta(edge.a) || !nodeMeta(edge.b)) continue;
      const a = project(nodeMeta(edge.a));
      const b = project(nodeMeta(edge.b));
      const isRail = edge.kind === "rail";
      const isRound = edge.kind === "round-zone";
      const isBuildingLane = edge.kind === "building-lane";
      const isThief = edge.kind === "thief-lane" || isBuildingLane;
      const isPolice = edge.kind === "police-lane";
      const accent = isRail ? "#6f451e" : isRound ? "#9b6528" : isThief ? "#c92f4f" : isPolice ? "#2362b7" : "#233d31";
      const inner = isRail ? "#d99c45" : isRound ? "#ffe0a0" : isThief ? "#ee5e78" : isPolice ? "#5d9fe5" : "#fff8df";
      ctx.globalAlpha = isRail || isThief || isPolice ? .96 : .86;
      ctx.strokeStyle = accent;
      ctx.lineWidth = (isRail ? 18 : isRound ? 38 : isBuildingLane ? 34 : isThief || isPolice ? 30 : 32) * scale;
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      ctx.strokeStyle = inner;
      ctx.lineWidth = (isRail ? 9 : isRound ? 28 : isBuildingLane ? 24 : isThief || isPolice ? 20 : 22) * scale;
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      ctx.globalAlpha = 1;
      if (edge.oneWay || edge.displayArrow) drawArrow(ctx, a, b, accent, scale);
    }
  }

  function positionStyle(x, y) {
    return `left:${(x / Board.WIDTH) * 100}%;top:${(y / Board.HEIGHT) * 100}%`;
  }

  function searchLabel(knowledge) {
    if (knowledge.searched) return "수색 완료";
    return knowledge.content === "gem" ? "보석 있음"
      : knowledge.content === "undercover" ? "경보 있음"
      : knowledge.content === "empty" ? "빈 건물" : "미수색";
  }

  function contentBadge(content) {
    if (content === "gem") {
      return `<img class="secretIcon gemIcon" src="${ASSET.gem}" alt="">`;
    }
    if (content === "undercover") {
      return `<img class="secretIcon undercoverIcon" src="${ASSET.alarm}" alt="">`;
    }
    if (content === "empty") {
      return `<svg class="secretIcon emptyIcon" viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="13"/><path d="m9 16 5 5 9-11"/></svg>`;
    }
    return `<span class="secretUnknown" aria-hidden="true">?</span>`;
  }

  function pawnFaceMarkup(controllers) {
    const faces = controllers.slice(0, 2).map(player => {
      const url = avatarOf(player.id);
      return url
        ? `<img class="pawnAvatar" src="${escapeHtml(url)}" alt="">`
        : `<span class="pawnInitial">${escapeHtml(firstLetter(player.name))}</span>`;
    }).join("");
    return `<span class="pawnFaces${controllers.length > 1 ? " shared" : ""}">${faces || '<span class="pawnInitial">?</span>'}</span>`;
  }


  function seatDuty(slot, teamSize) {
    if (teamSize === 1) return "말 1·2·3 담당";
    if (teamSize === 2) return slot === 1 ? "말 1 + 말 3 공동" : "말 2 + 말 3 공동";
    return `말 ${slot} 담당`;
  }

  function seatAvatarMarkup(player) {
    const url = avatarOf(player.id);
    return url
      ? `<img class="teamSeatAvatar" src="${escapeHtml(url)}" alt="">`
      : `<span class="teamSeatInitial">${escapeHtml(firstLetter(player.name))}</span>`;
  }

  function chooseLobbySeat(team, slot, isMine) {
    sendAction("CHOOSE_SEAT", isMine ? { team: "", slot: 0 } : { team, slot });
  }

  function renderSeatColumn(team, slotsId, countId) {
    const limit = Number(state?.teamLimits?.[team]) || 0;
    const members = state.players.filter(player => player.team === team);
    $(countId).textContent = `${members.length} / ${limit}`;
    const fragment = document.createDocumentFragment();
    for (let slot = 1; slot <= 3; slot += 1) {
      const occupant = members.find(player => player.seat === slot);
      const active = slot <= limit;
      const isMine = occupant?.id === myId();
      const button = document.createElement("button");
      button.type = "button";
      button.className = `teamSeat ${team}${active ? "" : " locked"}${occupant ? " occupied" : " empty"}${isMine ? " mine" : ""}`;
      button.disabled = !active || (!!occupant && !isMine) || actionPending;
      if (!active) {
        button.innerHTML = '<span class="teamSeatEmpty">현재 인원에서는 쉬는 슬롯</span>';
        button.setAttribute("aria-label", `${team === "police" ? "경찰" : "도둑"}팀 ${slot}번 비활성 슬롯`);
      } else if (occupant) {
        button.innerHTML = `${seatAvatarMarkup(occupant)}<span class="teamSeatName">${escapeHtml(occupant.name)}${isMine ? " · 나" : ""}</span><span class="teamSeatDuty">${escapeHtml(seatDuty(slot, limit))}</span>`;
        button.setAttribute("aria-label", `${occupant.name}, ${team === "police" ? "경찰" : "도둑"}팀 ${slot}번${isMine ? ", 다시 누르면 자리에서 나가기" : ""}`);
      } else {
        button.innerHTML = `<span class="teamSeatEmpty">${slot}번 · 빈 자리<br><small>${escapeHtml(seatDuty(slot, limit))}</small></span>`;
        button.setAttribute("aria-label", `${team === "police" ? "경찰" : "도둑"}팀 ${slot}번 빈 자리 선택`);
      }
      if (active && (!occupant || isMine)) button.addEventListener("click", () => chooseLobbySeat(team, slot, isMine));
      fragment.appendChild(button);
    }
    $(slotsId).replaceChildren(fragment);
  }

  function renderTeamSeats() {
    if (!state || state.phase !== "lobby") return;
    $("teamSeatPanel").classList.remove("hidden");
    renderSeatColumn("police", "policeSeatSlots", "policeSeatCount");
    renderSeatColumn("thief", "thiefSeatSlots", "thiefSeatCount");
    const snapshot = lobby.snapshot();
    const role = snapshot.role;
    const unseated = state.players.filter(player => !player.team || !player.seat).length;
    $("recommendSeatsBtn").hidden = role !== "host";
    $("recommendSeatsBtn").disabled = actionPending || state.players.length < 2;
    $("teamSeatGuide").classList.toggle("ready", !!state.lobbyReady);
    $("teamSeatGuide").textContent = state.lobbyReady
      ? "팀 배치 완료! 방장이 게임을 시작할 수 있습니다."
      : state.players.length < 2
        ? "2명 이상 모이면 경찰팀·도둑팀 슬롯이 열립니다."
        : `${unseated}명이 아직 팀 자리를 고르지 않았습니다.`;
    const canStart = role === "host" && !!state.lobbyReady;
    $("startBtn").disabled = !canStart;
    $("startBtn").textContent = "Start";
  }


  function renderLots() {
    const layer = $("lotsLayer");
    const fragment = document.createDocumentFragment();
    for (const building of Board.BUILDINGS) {
      const lot = building.lot || { width: 130, height: 120, style: "stone" };
      const element = document.createElement("div");
      element.className = `buildingLot ${lot.style}`;
      element.style.cssText = `${positionStyle(building.x, building.y)};width:${(lot.width / Board.WIDTH) * 100}%;height:${(lot.height / Board.HEIGHT) * 100}%`;
      element.innerHTML = '<span></span>';
      fragment.appendChild(element);
    }
    layer.replaceChildren(fragment);
  }

  function renderBuildings() {
    const layer = $("buildingsLayer");
    const fragment = document.createDocumentFragment();
    const captainSetup = !!state?.canSetup;
    for (const building of Board.BUILDINGS) {
      const entrance = Object.values(Board.NODES).find(node => node.building === building.id);
      const searchable = !!entrance && (state?.validMoves || []).includes(entrance.id);
      const knowledge = state?.buildings.find(item => item.id === building.id) || { content: "hidden" };
      const button = document.createElement("button");
      button.type = "button";
      button.className = "building";
      button.style.cssText = `${positionStyle(building.x, building.y)};--building:${building.color}`;
      button.disabled = movementAnimating;
      button.dataset.buildingId = building.id;
      button.dataset.searchState = knowledge.searched ? "searched" : knowledge.content;
      button.setAttribute("aria-label", `${building.name}, ${searchLabel(knowledge)}${searchable ? ", 이동 가능" : ""}`);
      const selectedKey = Object.entries(setupSelection).find(([, value]) => value === building.id)?.[0];
      if (captainSetup) button.classList.add("setupTarget");
      if (selectedKey?.startsWith("gem")) button.classList.add("selectedGem");
      if (selectedKey === "undercover") button.classList.add("selectedUndercover");
      if (searchable) button.classList.add("searchable");
      if (state?.phase === "playing" || state?.phase === "ended") button.classList.add("showSearchState");
      if (captainSetup) button.dataset.sfx = "stone";
      button.innerHTML = `<img class="buildingPiece" src="${ASSET.shop}" alt=""><span class="buildingIcon">${building.icon}</span><span class="buildingName">${escapeHtml(building.name)}</span><span class="buildingStatus">${searchLabel(knowledge)}</span><span class="buildingKnowledge">${selectedKey ? contentBadge(selectedKey === "undercover" ? "undercover" : "gem") : contentBadge(knowledge.content)}</span>`;
      button.addEventListener("click", () => captainSetup ? selectSetupBuilding(building.id) : inspectNode(entrance.id));
      fragment.appendChild(button);
    }
    layer.replaceChildren(fragment);
  }

  function emptyNodeForCard(id) {
    return !state.pawns.some(pawn => pawn.position === id) && !state.tricks.some(card => card.nodeId === id) && !state.checks.some(card => card.nodeId === id);
  }

  function trickDirections() {
    if (!trickNode) return [];
    return Board.neighbors(trickNode, "police").map(item => item.id);
  }

  function nodeTargetClass(id) {
    if (!state) return "";
    if (state.turnMode === "moving" && state.validMoves.includes(id)) return "valid";
    if (state.pending?.type === "teleport" && state.pending.options.includes(id)) return "pendingTarget";
    if (placementMode === "trick-node" && nodeMeta(id)?.trickSlot && emptyNodeForCard(id)) return "cardTarget";
    if (placementMode === "trick-direction" && trickDirections().includes(id)) return "cardTarget cardDirection";
    if (placementMode === "check" && nodeMeta(id)?.inspectionSlot && emptyNodeForCard(id)) return "cardTarget";
    return "";
  }

  function renderNodes() {
    const layer = $("nodesLayer");
    const fragment = document.createDocumentFragment();
    for (const node of Object.values(Board.NODES)) {
      const button = document.createElement("button");
      button.type = "button";
      const targetClass = nodeTargetClass(node.id);
      button.className = `node ${targetClass}`.trim();
      button.style.cssText = positionStyle(node.x, node.y);
      button.dataset.tone = node.tone || "";
      button.dataset.kind = node.kind || "road";
      if (node.dense) button.dataset.dense = "true";
      if (node.start) button.dataset.start = node.start;
      if (node.station) button.dataset.station = String(node.station);
      button.disabled = (!targetClass && !node.effect && !node.start && node.kind !== "building") || actionPending || movementAnimating;
      button.dataset.nodeId = node.id;
      button.classList.toggle("special", !!node.effect);
      const targetLabel = targetClass === "valid" ? `${node.label} · 최종 목적지` : node.label;
      button.title = targetLabel;
      button.setAttribute("aria-label", targetLabel);
      button.innerHTML = nodeSymbol(node);
      button.addEventListener("click", () => handleNodeClick(node.id));
      fragment.appendChild(button);
    }
    layer.replaceChildren(fragment);
  }

  function renderCards() {
    const layer = $("cardsLayer");
    const fragment = document.createDocumentFragment();
    for (const card of state.tricks) {
      const node = nodeMeta(card.nodeId);
      const marker = document.createElement("div");
      marker.className = "boardCard trick";
      marker.style.cssText = positionStyle(node.x, node.y);
      marker.textContent = "➜";
      marker.title = `가짜 단서 카드 · ${nodeMeta(card.nextNodeId)?.label || "화살표"} 방향`;
      fragment.appendChild(marker);
    }
    for (const card of state.checks) {
      const node = nodeMeta(card.nodeId);
      const marker = document.createElement("div");
      marker.className = "boardCard check";
      marker.style.cssText = positionStyle(node.x, node.y);
      marker.textContent = "차";
      marker.title = "차단 표지";
      fragment.appendChild(marker);
    }
    layer.replaceChildren(fragment);
  }

  function renderPawns() {
    const layer = $("piecesLayer");
    const fragment = document.createDocumentFragment();
    const groups = new Map();
    for (const pawn of state.pawns) {
      // A travelling pawn stays separate until it reaches an occupied square.
      const key = movementAnimating && pawn.id === state.lastMove?.pawnId ? "moving:" + pawn.id : pawn.position;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(pawn);
    }
    for (const pawns of groups.values()) {
      const position = pawns[0].position;
      const node = nodeMeta(position);
      if (!node) continue;
      const pawn = pawns.find(item => movementAnimating && item.id === state.lastMove?.pawnId)
        || pawns.find(item => item.id === state.turnPawnId) || pawns[0];
      const button = document.createElement("button");
      const mixed = new Set(pawns.map(item => item.team)).size > 1;
      const carriers = pawns.filter(item => item.carryingGem);
      const choice = state.canAct && state.pending
        && ["transfer", "rescue"].includes(state.pending.type)
        && pawns.some(item => state.pending.options.includes(item.id));
      button.type = "button";
      button.className = "pawn " + pawn.team
        + (mixed ? " mixed" : "")
        + (carriers.length ? " carrying" : "")
        + (pawns.every(item => item.status === "jailed") ? " jailed" : "")
        + (pawns.some(item => item.id === state.turnPawnId) ? " current" : "")
        + (choice ? " choice" : "");
      button.dataset.pawnId = pawn.id;
      button.dataset.nodeId = position;
      button.style.cssText = positionStyle(node.x, node.y);
      button.innerHTML = pawnFaceMarkup(pawnControllers(pawn.id))
        + '<span class="pawnNumber">' + pawn.number + '</span>'
        + (pawns.length > 1 ? '<span class="pawnGroupCount">' + pawns.length + '말</span>' : "")
        + (carriers.length ? '<span class="pawnGem"><img src="' + ASSET.gem + '" alt="">'
          + carriers.map(item => item.number + "번").join("·") + ' 소지</span>' : "");
      const label = pawns.map(item => pawnControllers(item.id).map(player => player.name).join("·")
        + " " + teamName(item.team) + " " + item.number + "번"
        + (item.carryingGem ? " 보석 소지" : "")
        + (item.status === "jailed" ? " 구금 중" : "")).join(", ");
      button.setAttribute("aria-label", label + " · 눌러서 자세히 보기");
      button.disabled = movementAnimating;
      button.addEventListener("click", () => inspectNode(position));
      fragment.appendChild(button);
    }
    layer.replaceChildren(fragment);
  }

  function nodeSymbol(node) {
    if (node.station) return '<span class="stationNumber">' + node.station + '</span><small>↔' + nodeMeta(node.effectTarget).station + '</small>';
    if (node.start) return node.start === "thief" ? "⌂" : "▦";
    if (node.kind === "building") return "수색";
    const symbols = { thiefTeleport: "↔", policeTeleport: "↔", stop: "■", reset: "↩",
      reveal: "◉", transfer: "💎⇄", dropGem: "💎↓" };
    if (node.effect === "jump") {
      const steps = node.label.match(/(\d+)칸/);
      return steps ? (node.label.includes("뒤로") ? "−" : "+") + steps[1] : "⇥";
    }
    return symbols[node.effect] || "";
  }

  function inspectNode(nodeId) {
    if (movementAnimating || !nodeMeta(nodeId)) return;
    inspectorReturnFocus = document.activeElement;
    inspectedNode = nodeId;
    renderInspector();
    $("closeBoardInspector").focus({ preventScroll: true });
  }

  function closeInspector() {
    inspectedNode = null;
    $("boardInspector").classList.add("hidden");
    if (inspectorReturnFocus?.isConnected) inspectorReturnFocus.focus({ preventScroll: true });
  }

  function renderInspector() {
    const node = nodeMeta(inspectedNode);
    $("boardInspector").classList.toggle("hidden", !node || !state);
    if (!node || !state) return;
    $("boardInspectorTitle").textContent = node.label;
    const descriptions = {
      thiefTeleport: "도둑이 도착하면 다른 도둑 이동 칸으로 옮길 수 있습니다.",
      policeTeleport: "경찰이 도착하면 다른 경찰 이동 칸으로 옮길 수 있습니다.",
      stop: "도착하면 남은 이동을 멈춥니다.",
      reset: "도착하면 자기 팀의 시작 구역으로 돌아갑니다.",
      reveal: "도착하면 도둑팀이 보석이 숨겨진 건물 한 곳을 알아냅니다.",
      transfer: "도둑이 가진 보석을 동료에게 전달할 수 있습니다.",
      dropGem: "도둑이 가진 보석을 잃게 됩니다."
    };
    let description = descriptions[node.effect] || (node.kind === "building"
      ? "도둑이 들어가 숨겨진 물건을 수색하는 장소입니다."
      : node.start === "thief" ? "찾은 보석을 이곳으로 가져오면 확보됩니다."
      : node.start === "police" ? "붙잡힌 도둑이 머무는 구금 구역입니다."
      : node.zone === "circle" ? "화살표 방향으로만 이동하는 구역입니다." : "길을 따라 이동하는 칸입니다.");
    if (node.effect === "train") description = node.station + "번 역에 도착하면 " + nodeMeta(node.effectTarget).station + "번 역으로 이동합니다.";
    if (node.effect === "jump") description = "도착하면 " + nodeMeta(node.effectTarget).label + " 칸으로 이동합니다.";
    if (node.kind === "building") {
      const knowledge = state.buildings.find(item => item.id === node.building) || { content: "hidden" };
      description = knowledge.searched ? "수색 완료. 현재 이 건물에는 보석이 없습니다."
        : knowledge.content === "gem" ? "보석이 남아 있습니다. 수색 칸에 도착하면 보석을 가져옵니다."
        : knowledge.content === "undercover" ? "경보 장치가 남아 있습니다. 수색한 도둑은 체포됩니다."
        : knowledge.content === "empty" ? "비어 있는 건물입니다. 수색해도 보석을 얻을 수 없습니다."
        : "아직 수색하지 않았습니다. 수색 칸에 도착하면 숨겨진 물건을 확인합니다.";
      if (state.canAct && currentPawn()?.carryingGem) description += " 현재 말은 보석을 운반 중이므로 추가 수색할 수 없습니다.";
    }
    $("boardInspectorText").textContent = description;
    const pawns = $("boardInspectorPawns");
    pawns.replaceChildren();
    for (const pawn of state.pawns.filter(item => item.position === inspectedNode)) {
      const controllers = pawnControllers(pawn.id);
      const names = controllers.map(player => player.name).join("·");
      const selectable = state.canAct && state.pending && ["transfer", "rescue"].includes(state.pending.type)
        && state.pending.options.includes(pawn.id);
      const row = document.createElement(selectable ? "button" : "div");
      row.className = "inspectorPawn " + pawn.team;
      if (selectable) {
        row.type = "button";
        row.disabled = actionPending;
        row.addEventListener("click", () => { sendAction("CHOOSE", { choiceId: pawn.id }); closeInspector(); });
      }
      row.innerHTML = pawnFaceMarkup(controllers) + '<span><strong>' + escapeHtml(names)
        + '</strong><small>' + teamName(pawn.team) + " " + pawn.number + "번"
        + (pawn.carryingGem ? " · 💎 보석 소지" : "")
        + (pawn.status === "jailed" ? " · 구금 중" : "")
        + '</small></span>' + (selectable ? '<b>선택</b>' : "");
      pawns.appendChild(row);
    }
    const actions = $("boardInspectorActions");
    actions.replaceChildren();
    if (state.canAct && (state.validMoves.includes(inspectedNode) || state.pending?.type === "teleport"
      && state.pending.options.includes(inspectedNode))) {
      const target = inspectedNode;
      const canSearch = node.kind === "building" && currentPawn()?.team === "thief" && !currentPawn().carryingGem;
      actions.appendChild(makeAction(canSearch ? "들어가서 수색" : "여기로 이동", "roll", () => {
        commitNodeAction(target);
        closeInspector();
      }));
    }
  }

  function handleNodeClick(nodeId) {
    if (placementMode) return commitNodeAction(nodeId);
    inspectNode(nodeId);
  }

  function commitNodeAction(nodeId) {
    if (actionPending || movementAnimating || !state) return;
    if (state.turnMode === "moving" && state.validMoves.includes(nodeId)) {
      sendAction("MOVE", { nodeId });
      return;
    }
    if (state.pending?.type === "teleport" && state.pending.options.includes(nodeId)) {
      sendAction("CHOOSE", { choiceId: nodeId });
      return;
    }
    if (placementMode === "trick-node" && nodeMeta(nodeId)?.trickSlot && emptyNodeForCard(nodeId)) {
      trickNode = nodeId;
      placementMode = "trick-direction";
      showToast("경찰을 보낼 화살표 방향을 선택하세요.");
      renderBoardState();
      return;
    }
    if (placementMode === "trick-direction" && trickDirections().includes(nodeId)) {
      sendAction("PLACE_TRICK", { nodeId: trickNode, nextNodeId: nodeId });
      placementMode = null;
      trickNode = null;
      return;
    }
    if (placementMode === "check" && nodeMeta(nodeId)?.inspectionSlot && emptyNodeForCard(nodeId)) {
      sendAction("PLACE_CHECK", { nodeId });
      placementMode = null;
    }
  }

  function renderBoardState() {
    if (!state || state.phase === "lobby") return;
    renderBuildings();
    renderNodes();
    renderCards();
    renderPawns();
    renderInspector();
  }

  function selectedName(key) {
    return buildingMeta(setupSelection[key])?.name || "선택 안 됨";
  }

  function selectSetupBuilding(buildingId) {
    if (!state?.canSetup) return;
    for (const key of Object.keys(setupSelection)) {
      if (key !== activeSecret && setupSelection[key] === buildingId) setupSelection[key] = null;
    }
    setupSelection[activeSecret] = buildingId;
    activeSecret = activeSecret === "gem1" ? "gem2" : activeSecret === "gem2" ? "undercover" : "undercover";
    renderSetup();
    renderBuildings();
  }

  function renderSetup() {
    const setup = state?.phase === "setup";
    $("setupCard").classList.toggle("hidden", !setup);
    if (!setup) return;
    const canSetup = state.canSetup;
    $("secretTabs").classList.toggle("hidden", !canSetup);
    $("confirmSetupBtn").classList.toggle("hidden", !canSetup);
    $("setupTitle").textContent = canSetup ? "비밀 물건 배치" : state.myTeam === "police" ? "경찰팀 대표가 배치 중" : "경찰팀이 비밀 배치 중";
    $("setupGuide").textContent = canSetup
      ? "서로 다른 장소에 보석 2개와 경보 장치를 배치하세요. 장소를 누르면 선택한 물건이 놓입니다."
      : state.myTeam === "police" ? "팀 대표의 선택이 끝나면 함께 위치를 확인할 수 있습니다." : "보석과 경보 장치의 위치는 도둑팀에게 보이지 않습니다.";
    document.querySelectorAll(".secretTab").forEach(button => button.classList.toggle("active", button.dataset.secret === activeSecret));
    $("setupSummary").innerHTML = canSetup
      ? `<span>${contentBadge("gem")} 보석 1 · ${escapeHtml(selectedName("gem1"))}</span><span>${contentBadge("gem")} 보석 2 · ${escapeHtml(selectedName("gem2"))}</span><span>${contentBadge("undercover")} 경보 장치 · ${escapeHtml(selectedName("undercover"))}</span>`
      : "<span>비밀 배치가 끝날 때까지 잠시 기다려 주세요.</span>";
    const values = Object.values(setupSelection);
    $("confirmSetupBtn").disabled = !canSetup || values.some(value => !value) || new Set(values).size !== 3 || actionPending;
  }

  function teamName(team) { return team === "police" ? "경찰팀" : team === "thief" ? "도둑팀" : "팀 배정 전"; }


  function renderIdentity() {
    $("teamTitle").textContent = state.myTeam ? "내 팀 · " + teamName(state.myTeam).replace("팀", "") : "관전";
    $("teamTitle").className = "teamTag " + (state.myTeam || "");
  }

  function renderProgress() {
    $("gemProgress").textContent = `${state.resources.thief.securedGems} / 2`;
    const arrested = state.pawns.filter(pawn => pawn.team === "thief" && pawn.status === "jailed").length;
    $("arrestProgress").textContent = `${arrested} / 3`;
    const carriers = state.pawns.filter(pawn => pawn.team === "thief" && pawn.carryingGem);
    $("carriedGemCount").textContent = carriers.length + "개";
    $("gemCarriers").replaceChildren(...carriers.map(pawn => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "gemCarrier";
      button.textContent = "💎 도둑 " + pawn.number + "번 · " + pawnControllers(pawn.id).map(player => player.name).join("·");
      button.setAttribute("aria-label", button.textContent + " · 보석 운반 중, 눌러서 말 확인");
      button.addEventListener("click", () => inspectNode(pawn.position));
      return button;
    }));
    $("gemCarriers").hidden = !carriers.length;
    $("compactProgress").textContent = "💎 운반 " + carriers.length + " · 확보 " + state.resources.thief.securedGems + "/2";
    $("roundText").textContent = `${state.turnNumber || 1}라운드`;
  }

  function renderTurnCard() {
    const show = state.phase === "playing";
    $("turnCard").classList.toggle("hidden", !show);
    $("actionCard").classList.toggle("hidden", !show);
    if (!show) return;
    const pawn = currentPawn();
    const controllerNames = state.turnControllers.map(id => playerById(id)?.name).filter(Boolean).join(" · ");
    const actorLabel = controllerNames || teamName(pawn.team);
    $("pawnTitle").textContent = teamName(pawn.team).replace("팀", "") + " " + pawn.number + "번 · " + (state.canAct ? "내 차례" : actorLabel);
    $("turnMessage").textContent = state.lastAction;
    $("turnMessage").classList.toggle("hidden", !!criticalNotice(state.lastAction));
    $("dieFace").textContent = state.die || "·";
    $("dieFace").parentElement.classList.toggle("hidden", !state.die && !movementAnimating && state.turnMode !== "pending" && pawn.status !== "jailed");
    $("remainingText").textContent = movementAnimating
      ? "이동 중"
      : state.turnMode === "moving" ? `${state.remaining}칸 남음`
      : state.turnMode === "pending" ? "선택 대기"
        : pawn.status === "jailed" ? (state.canAct ? "탈출 주사위" : `${actorLabel} 탈출 차례`)
          : state.canAct ? "행동 선택" : "상대 차례";
    $("movementHint").textContent = movementAnimating
      ? "말이 목적지까지 이동하는 중입니다."
      : state.turnMode === "moving" ? "목적지를 선택하고 이동하세요."
      : state.canAct ? "아래에서 행동을 선택하세요." : `${actorLabel}님의 행동을 기다립니다.`;
  }

  function makeAction(label, className, handler, disabled = false) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `teamAction ${className}`;
    button.textContent = label;
    button.disabled = disabled || actionPending || movementAnimating;
    button.addEventListener("click", handler);
    return button;
  }

  function cancelPlacement() {
    placementMode = null;
    trickNode = null;
    renderActions();
    renderBoardState();
  }

  function renderActions() {
    if (state.phase !== "playing") return;
    const stack = $("actionStack");
    const fragment = document.createDocumentFragment();
    let hint = movementAnimating ? "말이 이동하고 있습니다." : "";
    if (state.canAct) {
      if (placementMode) {
        const text = placementMode === "trick-node" ? "가짜 단서 카드를 놓을 분홍 칸을 선택하세요." : placementMode === "trick-direction" ? "경찰을 유도할 다음 칸을 선택하세요." : "차단 표지를 놓을 파란 칸을 선택하세요.";
        fragment.appendChild(makeAction("카드 배치 취소", "", cancelPlacement));
        hint = text;
      } else if (state.actions.roll) {
        const pawn = currentPawn();
        fragment.appendChild(makeAction(pawn.status === "jailed" ? "🎲 탈출 주사위" : "🎲 주사위", "roll", () => sendAction("ROLL")));
        if (state.actions.hide) fragment.appendChild(makeAction(`숨기 (${pawn.hidingTurns}/3)`, "thief", () => sendAction("HIDE")));
        if (state.actions.trick) fragment.appendChild(makeAction(`가짜 단서 ${state.resources.thief.trickCards}장`, "thief", () => { placementMode = "trick-node"; renderActions(); renderBoardState(); }));
        if (state.actions.check) fragment.appendChild(makeAction(`차단 표지 ${state.resources.police.checkCards}개`, "police", () => { placementMode = "check"; renderActions(); renderBoardState(); }));
        hint = movementAnimating ? "말이 이동하고 있습니다." : pawn.status === "jailed" ? "1이 나오면 탈출합니다." : "";
      } else if (state.turnMode === "moving") {
        hint = "노란 목적지를 눌러 이동을 확인하세요.";
      } else if (state.turnMode === "pending") {
        hint = state.pending?.type === "teleport" ? "초록빛 위치 이동 칸을 선택하세요." : "말판에서 빛나는 도둑말을 선택하세요.";
      }
    }
    if (!fragment.childNodes.length) {
      const wait = document.createElement("div");
      wait.className = "actionHint";
      wait.textContent = state.canAct ? "말판에서 다음 선택을 하세요." : "다른 플레이어가 진행 중입니다.";
      fragment.appendChild(wait);
    }
    stack.replaceChildren(fragment);
    $("actionHint").textContent = hint;
  }

  function renderIntel() {
    const team = state.myTeam;
    $("intelCard").classList.toggle("hidden", !team || state.phase === "lobby");
    if (!team) return;
    const list = $("intelList");
    const fragment = document.createDocumentFragment();
    const knownBuildings = state.buildings.filter(building => building.known);
    if (!knownBuildings.length) {
      const empty = document.createElement("div");
      empty.className = "intelItem";
      empty.textContent = team === "thief" ? "아직 확인한 건물이 없습니다." : "비밀 배치를 기다리는 중입니다.";
      fragment.appendChild(empty);
    }
    for (const knowledge of knownBuildings) {
      const building = buildingMeta(knowledge.id);
      const item = document.createElement("div");
      item.className = "intelItem";
      const label = searchLabel(knowledge);
      item.innerHTML = `<span>${building.icon} ${escapeHtml(building.name)}</span><strong class="intelSecret">${contentBadge(knowledge.content)}${label}</strong>`;
      fragment.appendChild(item);
    }
    list.replaceChildren(fragment);
  }

  function renderPlayers() {
    $("playerCount").textContent = state.players.length + "명";
    const list = $("playerList");
    const fragment = document.createDocumentFragment();
    for (const player of state.players) {
      const chip = document.createElement("div");
      chip.className = `playerChip${state.turnControllers.includes(player.id) && state.phase === "playing" ? " active" : ""}`;
      const pawnLabels = player.pawnIds.map(id => pawnById(id)?.number).filter(Boolean).join("·") || "-";
      chip.innerHTML = `<span class="playerDot ${player.team || ""}"></span><span>${escapeHtml(player.name)}${player.id === myId() ? " · 나" : ""}</span><em>${teamName(player.team)} · 말 ${pawnLabels}</em>`;
      fragment.appendChild(chip);
    }
    list.replaceChildren(fragment);
  }

  function renderResult() {
    const ended = state.phase === "ended";
    $("resultOverlay").classList.toggle("hidden", !ended);
    if (!ended) return;
    const won = state.myTeam === state.winnerTeam;
    $("resultIcon").textContent = state.winnerTeam === "police" ? "🚓" : "💎";
    $("resultTitle").textContent = won ? "우리 팀이 승리했습니다!" : `${teamName(state.winnerTeam)} 승리`;
    $("resultMessage").textContent = state.lastAction;
    const actions = $("resultActions");
    const fragment = document.createDocumentFragment();
    if (lobby.snapshot().role === "host") {
      fragment.appendChild(makeAction("같은 방에서 다시 하기", "roll", () => sendAction("NEW_GAME")));
      fragment.appendChild(makeAction("대기실로", "", () => sendAction("RETURN_LOBBY")));
    } else {
      const text = document.createElement("span");
      text.textContent = "방장이 다음 진행을 선택하는 중입니다.";
      fragment.appendChild(text);
    }
    actions.replaceChildren(fragment);
  }

  function renderGame() {
    if (!state || state.phase === "lobby") return;
    $("lobbyScreen").classList.add("hidden");
    $("gameScreen").classList.remove("hidden");
    renderIdentity();
    renderProgress();
    renderSetup();
    renderTurnCard();
    renderActions();
    renderIntel();
    renderPlayers();
    renderBoardState();
    renderResult();
    requestAnimationFrame(resizeBoard);
  }

  function shouldAnimateMove(previousState, nextState) {
    const move = nextState?.lastMove;
    return !!move && move.id !== previousState?.lastMove?.id && Array.isArray(move.path) && move.path.length > 1;
  }

  function animateMovement(move) {
    const token = ++movementAnimationToken;
    const pawn = document.querySelector(`.pawn[data-pawn-id="${CSS.escape(move.pawnId)}"]`);
    const route = move.path.map(nodeMeta).filter(Boolean);
    if (!pawn || route.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      movementAnimating = false;
      renderTurnCard();
      renderActions();
      renderBoardState();
      showNextNotice();
      return;
    }

    const placeAt = node => {
      pawn.style.left = `${(node.x / Board.WIDTH) * 100}%`;
      pawn.style.top = `${(node.y / Board.HEIGHT) * 100}%`;
    };
    pawn.classList.add("moving");
    pawn.style.transition = "none";
    placeAt(route[0]);
    void pawn.offsetWidth;
    pawn.style.removeProperty("transition");

    let index = 1;
    const advance = () => {
      if (token !== movementAnimationToken) return;
      placeAt(route[index]);
      index += 1;
      if (index < route.length) {
        window.setTimeout(advance, 300);
        return;
      }
      window.setTimeout(() => {
        if (token !== movementAnimationToken) return;
        movementAnimating = false;
        renderTurnCard();
        renderActions();
        renderBoardState();
        showNextNotice();
      }, 300);
    };
    window.requestAnimationFrame(advance);
  }

  function installState(nextState) {
    const previousState = state;
    const previousPhase = previousState?.phase;
    const animateMove = shouldAnimateMove(previousState, nextState);
    movementAnimationToken += 1;
    movementAnimating = animateMove;
    state = nextState;
    if (state.phase !== "playing") {
      noticeQueue.length = 0;
      if ($("eventDialog").open) $("eventDialog").close();
    }
    actionPending = false;
    placementMode = null;
    trickNode = null;
    if (state.phase === "lobby") {
      gameMusicTrack = 0;
      syncMusic(state.phase);
      movementAnimating = false;
      if (lobby.snapshot().started) {
        $("gameScreen").classList.add("hidden");
        $("lobbyScreen").classList.remove("hidden");
        lobby.returnToLobby();
      }
      renderTeamSeats();
      return;
    }
    syncMusic(state.phase);
    if (previousPhase !== "setup" && state.phase === "setup") {
      setupSelection = { gem1: null, gem2: null, undercover: null };
      activeSecret = "gem1";
    }
    closeInspector();
    renderGame();
    scheduleStateEffect(previousState, state);
    showNextNotice();
    if (animateMove) window.requestAnimationFrame(() => animateMovement(state.lastMove));
  }

  function handleServerMessage(message) {
    if (message.type === MESSAGE.STATE && message.state) {
      installState(message.state);
      return;
    }
    if (message.type === MESSAGE.ERROR) {
      actionPending = false;
      showToast(message.message || "행동을 처리하지 못했습니다.");
      if (state?.phase === "lobby") renderTeamSeats();
      else if (state) renderGame();
    }
  }

  function syncLobby(snapshot) {
    if (state?.phase === "lobby") renderTeamSeats();
  }

  function showAbort({ title, message }) {
    noticeQueue.length = 0;
    if ($("eventDialog").open) $("eventDialog").close();
    $("abortTitle").textContent = title;
    $("abortMessage").textContent = message;
    $("abortOverlay").classList.remove("hidden");
  }

  function resizeBoard() {
    const viewport = $("boardViewport");
    if (!viewport.clientWidth || !viewport.clientHeight) return;
    boardWidth = viewport.clientWidth;
    boardHeight = viewport.clientHeight;
    const width = Math.round(boardWidth * boardZoom);
    const height = Math.round(boardHeight * boardZoom);
    const stage = $("boardStage");
    const changed = stage.style.width !== width + "px" || stage.style.height !== height + "px";
    stage.style.width = width + "px";
    stage.style.height = height + "px";
    stage.style.setProperty("--board-unit", Math.min(width, height) / 100 + "px");
    viewport.classList.toggle("zoomed", boardZoom > 1);
    $("boardZoomOut").disabled = boardZoom <= 1;
    $("boardZoomIn").disabled = boardZoom >= 2.5;
    $("boardZoomReset").textContent = boardZoom === 1 ? "전체" : Math.round(boardZoom * 100) + "%";
    if (changed && !boardDrawFrame) {
      boardDrawFrame = requestAnimationFrame(() => {
        boardDrawFrame = 0;
        drawBoard();
      });
    }
  }

  function setBoardZoom(zoom) {
    const viewport = $("boardViewport");
    if (!boardWidth || !boardHeight) return;
    const focal = boardZoom === 1 ? nodeMeta(currentPawn()?.position) : null;
    const x = focal ? focal.x / Board.WIDTH : (viewport.scrollLeft + boardWidth / 2) / (boardWidth * boardZoom);
    const y = focal ? focal.y / Board.HEIGHT : (viewport.scrollTop + boardHeight / 2) / (boardHeight * boardZoom);
    boardZoom = Math.max(1, Math.min(2.5, zoom));
    resizeBoard();
    viewport.scrollTo({ left: x * boardWidth * boardZoom - boardWidth / 2,
      top: y * boardHeight * boardZoom - boardHeight / 2 });
  }

  function initBoardGestures() {
    const viewport = $("boardViewport");
    const pointers = new Map();
    let gesture = null;
    let dragged = false;
    const begin = () => {
      const points = [...pointers.values()];
      if (!points.length) { gesture = null; return; }
      const bounds = viewport.getBoundingClientRect();
      const x = points.reduce((sum, point) => sum + point.x, 0) / points.length - bounds.left;
      const y = points.reduce((sum, point) => sum + point.y, 0) / points.length - bounds.top;
      gesture = { x, y, left: viewport.scrollLeft, top: viewport.scrollTop, zoom: boardZoom,
        distance: points.length > 1 ? Math.hypot(points[1].x - points[0].x, points[1].y - points[0].y) : 0,
        anchorX: (viewport.scrollLeft + x) / (boardWidth * boardZoom),
        anchorY: (viewport.scrollTop + y) / (boardHeight * boardZoom) };
    };
    viewport.addEventListener("pointerdown", event => {
      if (event.button !== 0 || pointers.size >= 2) return;
      if (!pointers.size) dragged = false;
      pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      begin();
    });
    viewport.addEventListener("pointermove", event => {
      if (!pointers.has(event.pointerId) || !gesture) return;
      pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      const points = [...pointers.values()];
      const bounds = viewport.getBoundingClientRect();
      const x = points.reduce((sum, point) => sum + point.x, 0) / points.length - bounds.left;
      const y = points.reduce((sum, point) => sum + point.y, 0) / points.length - bounds.top;
      if (points.length > 1) {
        dragged = true;
        const distance = Math.hypot(points[1].x - points[0].x, points[1].y - points[0].y);
        boardZoom = Math.max(1, Math.min(2.5, gesture.zoom * distance / Math.max(gesture.distance, 1)));
        resizeBoard();
        viewport.scrollLeft = gesture.anchorX * boardWidth * boardZoom - x;
        viewport.scrollTop = gesture.anchorY * boardHeight * boardZoom - y;
      } else if (dragged || Math.hypot(x - gesture.x, y - gesture.y) > 6) {
        dragged = true;
        viewport.scrollLeft = gesture.left - (x - gesture.x);
        viewport.scrollTop = gesture.top - (y - gesture.y);
      }
      if (dragged) {
        viewport.classList.add("dragging");
        viewport.setPointerCapture(event.pointerId);
      }
    });
    const finish = event => {
      if (!pointers.has(event.pointerId)) return;
      if (dragged) suppressBoardClickUntil = performance.now() + 350;
      pointers.delete(event.pointerId);
      if (viewport.hasPointerCapture(event.pointerId)) viewport.releasePointerCapture(event.pointerId);
      if (!pointers.size) viewport.classList.remove("dragging");
      begin();
    };
    window.addEventListener("pointerup", finish);
    window.addEventListener("pointercancel", finish);
    viewport.addEventListener("lostpointercapture", event => {
      // Taking capture from a child button must not end the board gesture.
      if (event.target === viewport) finish(event);
    });
    viewport.addEventListener("click", event => {
      if (performance.now() < suppressBoardClickUntil) {
        event.preventDefault();
        event.stopPropagation();
      }
    }, true);
  }

  function init() {
    $("actionDock").append($("setupCard"), $("turnCard"), $("actionCard"));
    const compact = matchMedia("(orientation: portrait)");
    const syncInfo = () => { $("gameInfoDetails").open = !compact.matches; };
    syncInfo();
    compact.addEventListener("change", syncInfo);
    new ResizeObserver(resizeBoard).observe($("boardViewport"));
    initBoardGestures();
    $("boardZoomIn").addEventListener("click", () => setBoardZoom(boardZoom + .5));
    $("boardZoomOut").addEventListener("click", () => setBoardZoom(boardZoom - .5));
    $("boardZoomReset").addEventListener("click", () => setBoardZoom(1));
    $("closeBoardInspector").addEventListener("click", closeInspector);
    document.addEventListener("keydown", event => {
      if (event.key !== "Escape") return;
      if ($("eventDialog").open) return;
      if (!$("rulesOverlay").classList.contains("hidden")) hideRules();
      else closeInspector();
    });
    $("bgm").addEventListener("ended", advanceGameMusic);
    $("eventDialog").addEventListener("close", showNextNotice);
    renderLots();
    drawBoard();
    lobby = window.ClassroomMultiplayerLobby.create({
      gameId: GAME_ID,
      initialMode: "guest",
      getPlayerName: () => /^[가-힣]{2,6}$/.test(savedName) ? savedName : "",
      allowedPlayerCounts: [2, 3, 4, 5, 6],
      maxPlayers: 6,
      canStart: () => !!state?.lobbyReady,
      rulesButtonIds: ["rulesBtnLobby", "rulesBtnGame"],
      preserveRulesUi: true,
      leaveButtonIds: ["leaveBtnLobby", "leaveBtnGame"],
      onRules: showRules,
      onLeave: () => location.href = "../../../",
      onNotice: showToast,
      onInvalidStart: () => showToast("모든 참가자가 경찰팀·도둑팀 슬롯을 먼저 선택해야 합니다."),
      onStateChange: syncLobby,
      getLobbyPresentation: ({ count, role, canStart }) => ({
        canStart: canStart && !!state?.lobbyReady,
        startText: role === "host" && canStart && state?.lobbyReady ? `게임 시작 · ${count}명` : "팀 자리를 선택하세요",
        guideText: role === "host" ? `현재 ${count}명 · 모두 팀 슬롯을 선택하면 시작 가능` : "빈 경찰팀·도둑팀 슬롯을 눌러 자리를 선택하세요."
      }),
      createStartData: () => ({ serverAuthoritative: true }),
      onStarted: () => {
        if (lobby.snapshot().role === "host") sendAction("START");
      },
      onServerMessage: handleServerMessage,
      onPlayerLeftDuringGame: () => showToast("플레이어가 나가 대기실로 돌아갑니다."),
      onAbort: showAbort
    }).mount();

    $("recommendSeatsBtn").addEventListener("click", () => sendAction("RECOMMEND_SEATS"));
    document.querySelectorAll(".secretTab").forEach(button => button.addEventListener("click", () => {
      activeSecret = button.dataset.secret;
      renderSetup();
    }));
    $("confirmSetupBtn").addEventListener("click", () => sendAction("PLACE_SECRETS", {
      gems: [setupSelection.gem1, setupSelection.gem2],
      undercover: setupSelection.undercover
    }));
    $("closeRulesBtn").addEventListener("click", hideRules);
    $("closeRulesBottomBtn").addEventListener("click", hideRules);
    $("rulesOverlay").addEventListener("click", event => { if (event.target === $("rulesOverlay")) hideRules(); });
    $("reloadBtn").addEventListener("click", () => location.reload());
  }

  window.addEventListener("DOMContentLoaded", init);
})();
