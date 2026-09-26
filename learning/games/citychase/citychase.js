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
    const effect = actionEffect(nextState.lastAction, previousState, nextState);
    if (effect) window.requestAnimationFrame(() => showBoardEffect(effect));
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

  function showRules() { $("rulesOverlay").classList.remove("hidden"); }
  function hideRules() { $("rulesOverlay").classList.add("hidden"); }

  function drawArrow(ctx, from, to, color) {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const length = Math.hypot(dx, dy) || 1;
    const ux = dx / length;
    const uy = dy / length;
    const cx = from.x + dx * .58;
    const cy = from.y + dy * .58;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(cx + ux * 9, cy + uy * 9);
    ctx.lineTo(cx - ux * 8 - uy * 7, cy - uy * 8 + ux * 7);
    ctx.lineTo(cx - ux * 8 + uy * 7, cy - uy * 8 - ux * 7);
    ctx.closePath();
    ctx.fill();
  }

  function drawBoard() {
    const canvas = $("boardCanvas");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, Board.WIDTH, Board.HEIGHT);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    for (const edge of Board.EDGES) {
      const a = nodeMeta(edge.a);
      const b = nodeMeta(edge.b);
      if (!a || !b) continue;
      const isRail = edge.kind === "rail";
      const isRound = edge.kind === "round-zone";
      const isBuildingLane = edge.kind === "building-lane";
      const isThief = edge.kind === "thief-lane" || isBuildingLane;
      const isPolice = edge.kind === "police-lane";
      const accent = isRail ? "#6f451e" : isRound ? "#9b6528" : isThief ? "#c92f4f" : isPolice ? "#2362b7" : "#233d31";
      const inner = isRail ? "#d99c45" : isRound ? "#ffe0a0" : isThief ? "#ee5e78" : isPolice ? "#5d9fe5" : "#fff8df";
      ctx.globalAlpha = isRail || isThief || isPolice ? .96 : .86;
      ctx.strokeStyle = accent;
      ctx.lineWidth = isRail ? 18 : isRound ? 38 : isBuildingLane ? 34 : isThief || isPolice ? 30 : 32;
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      ctx.strokeStyle = inner;
      ctx.lineWidth = isRail ? 9 : isRound ? 28 : isBuildingLane ? 24 : isThief || isPolice ? 20 : 22;
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      ctx.globalAlpha = 1;
      if (edge.oneWay || edge.displayArrow) drawArrow(ctx, a, b, accent);
    }
  }

  function positionStyle(x, y) {
    return `left:${(x / Board.WIDTH) * 100}%;top:${(y / Board.HEIGHT) * 100}%`;
  }

  function contentLabel(content) {
    return content === "gem" ? "보석" : content === "undercover" ? "경보 장치" : content === "empty" ? "비어 있음" : "확인 전";
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

  function pawnClusterOffset(node, index, count) {
    if (count <= 1) return { x: 0, y: 0 };
    const row = Math.floor(index / 3);
    const rows = Math.ceil(count / 3);
    const rowStart = row * 3;
    const rowCount = Math.min(3, count - rowStart);
    const column = index - rowStart;
    const halfSpan = ((rowCount - 1) / 2) * 72;
    let x = (column - (rowCount - 1) / 2) * 72;
    let y = (row - (rows - 1) / 2) * 82;

    // 가장자리에서는 첫 말을 원래 칸에 두고 나머지 말과 이름표를 보드 안쪽으로 펼칩니다.
    if (node.x < 130) x += halfSpan;
    else if (node.x > 870) x -= halfSpan;
    if (node.y < 120 && rows > 1) y += ((rows - 1) / 2) * 82;
    else if (node.y > 880 && rows > 1) y -= ((rows - 1) / 2) * 82;
    return { x, y };
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

  const SCENERY = Object.freeze([
    { src: "assets/city-kid-dog.svg", x: 205, y: 475, width: 58 },
    { src: "assets/city-girl-kite.svg", x: 805, y: 470, width: 54 },
    { src: "assets/city-animal-friends.svg", x: 285, y: 595, width: 52 },
    { src: "assets/city-bike-kid.svg", x: 720, y: 600, width: 56 }
  ]);

  function renderScenery() {
    const layer = $("sceneryLayer");
    const fragment = document.createDocumentFragment();
    for (const item of SCENERY) {
      const image = document.createElement("img");
      image.src = item.src;
      image.alt = "";
      image.style.cssText = `${positionStyle(item.x, item.y)};width:${(item.width / Board.WIDTH) * 100}%`;
      fragment.appendChild(image);
    }
    layer.replaceChildren(fragment);
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
      const occupied = !!entrance && !!state?.pawns.some(pawn => pawn.position === entrance.id);
      const knowledge = state?.buildings.find(item => item.id === building.id) || { content: "hidden" };
      const button = document.createElement("button");
      button.type = "button";
      button.className = "building";
      button.style.cssText = `${positionStyle(building.x, building.y)};--building:${building.color}`;
      button.disabled = !captainSetup;
      button.setAttribute("aria-label", `${building.name}${knowledge.content === "hidden" ? "" : `, ${contentLabel(knowledge.content)}`}`);
      const selectedKey = Object.entries(setupSelection).find(([, value]) => value === building.id)?.[0];
      if (captainSetup) button.classList.add("setupTarget");
      if (selectedKey?.startsWith("gem")) button.classList.add("selectedGem");
      if (selectedKey === "undercover") button.classList.add("selectedUndercover");
      if (searchable) button.classList.add("searchable");
      if (occupied) button.classList.add("occupied");
      if (captainSetup) button.dataset.sfx = "stone";
      button.innerHTML = `<img class="buildingPiece" src="${ASSET.shop}" alt=""><span class="buildingIcon">${building.icon}</span><span class="buildingName">${escapeHtml(building.name)}</span><span class="buildingStatus">${searchable ? "수색 가능" : occupied ? "수색 중" : ""}</span><span class="buildingKnowledge">${selectedKey ? contentBadge(selectedKey === "undercover" ? "undercover" : "gem") : contentBadge(knowledge.content)}</span>`;
      button.addEventListener("click", () => selectSetupBuilding(building.id));
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
      button.disabled = !targetClass || actionPending || movementAnimating;
      const targetLabel = targetClass === "valid" ? `${node.label} · 최종 목적지` : node.label;
      button.title = targetLabel;
      button.setAttribute("aria-label", targetLabel);
      button.textContent = node.start === "thief"
        ? "도둑팀 비밀기지"
        : node.start === "police"
          ? "경찰팀 구금 구역"
          : node.station ? String(node.station) : node.kind === "building" ? "수색" : node.effect ? "!" : "";
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
      if (!groups.has(pawn.position)) groups.set(pawn.position, []);
      groups.get(pawn.position).push(pawn);
    }
    for (const [position, pawns] of groups) {
      const node = nodeMeta(position);
      if (!node) continue;
      pawns.forEach((pawn, index) => {
        const button = document.createElement("button");
        button.type = "button";
        const choice = state.pending && ["transfer", "rescue"].includes(state.pending.type) && state.pending.options.includes(pawn.id);
        const offset = pawnClusterOffset(node, index, pawns.length);
        button.className = `pawn ${pawn.team}${pawn.carryingGem ? " carrying" : ""}${pawn.status === "jailed" ? " jailed" : ""}${pawn.id === state.turnPawnId ? " current" : ""}${choice ? " choice" : ""}`;
        button.dataset.pawnId = pawn.id;
        button.style.cssText = positionStyle(node.x + offset.x, node.y + offset.y);
        const controllers = pawnControllers(pawn.id);
        const names = controllers.map(player => player.name).join("·") || `${teamName(pawn.team)}팀`;
        button.innerHTML = `<span class="pawnName">${escapeHtml(names)}</span>${pawnFaceMarkup(controllers)}<span class="pawnNumber">${pawn.number}</span>`;
        button.setAttribute("aria-label", `${names}, ${pawn.team === "police" ? "경찰" : "도둑"} ${pawn.number}번${pawn.carryingGem ? ", 보석 소지" : ""}`);
        button.disabled = !choice || actionPending || movementAnimating;
        if (choice) button.addEventListener("click", () => sendAction("CHOOSE", { choiceId: pawn.id }));
        fragment.appendChild(button);
      });
    }
    layer.replaceChildren(fragment);
  }

  function handleNodeClick(nodeId) {
    if (actionPending || !state) return;
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

  function renderHeader() {
    const pawn = currentPawn();
    $("gameRoomCode").textContent = lobby.snapshot().roomCode || "----";
    if (state.phase === "setup") {
      $("turnHeadline").textContent = "경찰팀 비밀 배치";
      $("turnSubline").textContent = state.lastAction;
      return;
    }
    if (state.phase === "ended") {
      $("turnHeadline").textContent = `${teamName(state.winnerTeam)} 승리`;
      $("turnSubline").textContent = state.lastAction;
      return;
    }
    const controllers = state.turnControllers.map(id => playerById(id)?.name).filter(Boolean).join(" · ");
    $("turnHeadline").textContent = state.canAct ? `내 차례 · ${teamName(pawn.team)} ${pawn.number}번` : `${controllers || "플레이어"} 차례 · ${teamName(pawn.team)} ${pawn.number}번`;
    $("turnSubline").textContent = state.lastAction;
  }

  function renderIdentity() {
    const team = state.myTeam;
    const crest = $("teamCrest");
    crest.className = `teamCrest ${team || ""}`;
    crest.textContent = team === "police" ? "♜" : team === "thief" ? "♟" : "?";
    $("teamTitle").textContent = teamName(team);
    $("teamMission").textContent = team === "police" ? "도둑말 3개를 모두 구금하세요." : team === "thief" ? "보석 2개를 비밀기지로 운반하세요." : "게임이 시작되면 역할이 정해집니다.";
  }

  function renderProgress() {
    $("gemProgress").textContent = `${state.resources.thief.securedGems} / 2`;
    const arrested = state.pawns.filter(pawn => pawn.team === "thief" && pawn.status === "jailed").length;
    $("arrestProgress").textContent = `${arrested} / 3`;
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
    $("pawnTitle").textContent = `${teamName(pawn.team)} ${pawn.number}번 차례${state.canAct ? " · 나" : ""}`;
    $("turnMessage").textContent = state.lastAction;
    $("dieFace").textContent = state.die || "·";
    $("remainingText").textContent = movementAnimating
      ? "이동 중"
      : state.turnMode === "moving" ? `${state.remaining}칸 남음`
      : state.turnMode === "pending" ? "선택 대기"
        : pawn.status === "jailed" ? (state.canAct ? "탈출 주사위" : `${actorLabel} 탈출 차례`)
          : state.canAct ? "내 행동 선택" : `${actorLabel} 행동 중`;
    $("movementHint").textContent = movementAnimating
      ? "말이 목적지까지 이동하는 중입니다."
      : state.turnMode === "moving" ? "빛나는 최종 목적지를 한 번 누르세요."
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
    let hint = "현재 플레이어의 행동을 기다리는 중입니다.";
    if (state.canAct) {
      if (placementMode) {
        const text = placementMode === "trick-node" ? "가짜 단서 카드를 놓을 분홍 칸을 선택하세요." : placementMode === "trick-direction" ? "경찰을 유도할 다음 칸을 선택하세요." : "차단 표지를 놓을 파란 칸을 선택하세요.";
        fragment.appendChild(makeAction("카드 배치 취소", "", cancelPlacement));
        hint = text;
      } else if (state.actions.roll) {
        const pawn = currentPawn();
        fragment.appendChild(makeAction(pawn.status === "jailed" ? "🎲 탈출 주사위" : "🎲 주사위 던지기", "roll", () => sendAction("ROLL")));
        if (state.actions.hide) fragment.appendChild(makeAction(`안전지대에서 숨기 (${pawn.hidingTurns}/3)`, "thief", () => sendAction("HIDE")));
        if (state.actions.trick) fragment.appendChild(makeAction(`가짜 단서 카드 · ${state.resources.thief.trickCards}장`, "thief", () => { placementMode = "trick-node"; renderActions(); renderBoardState(); }));
        if (state.actions.check) fragment.appendChild(makeAction(`차단 표지 · ${state.resources.police.checkCards}개`, "police", () => { placementMode = "check"; renderActions(); renderBoardState(); }));
        hint = pawn.status === "jailed" ? "1이 나오면 즉시 탈출해 다시 이동합니다." : "주사위를 쓰는 대신 카드나 숨기를 선택할 수 있습니다.";
      } else if (state.turnMode === "moving") {
        hint = `주사위 ${state.die}칸 뒤의 노란빛 최종 목적지를 선택하세요.`;
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
    $("cardCount").textContent = team === "thief" ? `가짜 단서 카드 ${state.resources.thief.trickCards}장` : `차단 표지 ${state.resources.police.checkCards}개`;
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
      const label = contentLabel(knowledge.content);
      item.innerHTML = `<span>${building.icon} ${escapeHtml(building.name)}</span><strong class="intelSecret">${contentBadge(knowledge.content)}${label}</strong>`;
      fragment.appendChild(item);
    }
    list.replaceChildren(fragment);
  }

  function renderPlayers() {
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
    renderHeader();
    renderIdentity();
    renderProgress();
    renderSetup();
    renderTurnCard();
    renderActions();
    renderIntel();
    renderPlayers();
    renderBoardState();
    renderResult();
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
      renderActions();
      renderBoardState();
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
        renderActions();
        renderBoardState();
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
    renderGame();
    scheduleStateEffect(previousState, state);
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
    $("gameRoomCode").textContent = snapshot.roomCode || "----";
    if (state?.phase === "lobby") renderTeamSeats();
  }

  function showAbort({ title, message }) {
    $("abortTitle").textContent = title;
    $("abortMessage").textContent = message;
    $("abortOverlay").classList.remove("hidden");
  }

  function init() {
    $("bgm").addEventListener("ended", advanceGameMusic);
    renderScenery();
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
