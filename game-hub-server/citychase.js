"use strict";

const crypto = require("crypto");
const Board = require("../learning/games/citychase/citychase-data");

const PAWN_ORDER = Object.freeze(["thief-1", "thief-2", "thief-3", "police-1", "police-2", "police-3"]);
const MAX_PLAYERS = 6;
const MIN_PLAYERS = 2;
const TRICK_CARD_COUNT = 9;
const CHECK_CARD_COUNT = 6;

function cleanName(value, fallback = "플레이어") {
  return String(value || "").trim().slice(0, 12) || fallback;
}

function createPlayer(id, name) {
  return { id: String(id), name: cleanName(name), team: null, seat: null, pawnIds: [] };
}

function initialBuildings() {
  return Board.BUILDINGS.map(building => ({ id: building.id, content: null, searched: false }));
}

function createGame(hostId, hostName) {
  return {
    phase: "lobby",
    players: [createPlayer(hostId, hostName || "방장")],
    pawns: [],
    buildings: initialBuildings(),
    tricks: [],
    checks: [],
    resources: {
      thief: { trickCards: TRICK_CARD_COUNT, securedGems: 0, knownBuildings: [] },
      police: { checkCards: CHECK_CARD_COUNT }
    },
    policeCaptainId: null,
    turnIndex: 0,
    turnNumber: 0,
    turnMode: "idle",
    die: null,
    remaining: 0,
    path: [],
    lastMove: null,
    moveSequence: 0,
    pending: null,
    winnerTeam: null,
    lastAction: "2~6명이 모이면 시작할 수 있습니다.",
    revision: 0
  };
}

function addPlayer(game, id, name) {
  if (game.phase !== "lobby") return { ok: false, error: "이미 시작한 게임입니다." };
  const safeId = String(id);
  if (game.players.some(player => player.id === safeId)) return { ok: true };
  if (game.players.length >= MAX_PLAYERS) return { ok: false, error: "경찰과 도둑은 최대 6명까지 참여할 수 있습니다." };
  game.players.push(createPlayer(safeId, name || `플레이어 ${game.players.length + 1}`));
  game.revision += 1;
  return { ok: true };
}

function removePlayer(game, id) {
  const safeId = String(id);
  game.players = game.players.filter(player => player.id !== safeId);
  normalizeLobbySeats(game);
  game.revision += 1;
}

function requiredTeamCounts(playerCount) {
  const count = Number(playerCount) || 0;
  const police = ({ 2: 1, 3: 1, 4: 2, 5: 2, 6: 3 })[count] || 0;
  return { police, thief: count ? count - police : 0 };
}

function normalizeLobbySeats(game) {
  const limits = requiredTeamCounts(game.players.length);
  for (const team of ["police", "thief"]) {
    const used = new Set();
    game.players.filter(player => player.team === team).forEach(player => {
      const valid = Number.isInteger(player.seat) && player.seat >= 1 && player.seat <= limits[team] && !used.has(player.seat);
      if (valid) used.add(player.seat);
      else {
        player.team = null;
        player.seat = null;
        player.pawnIds = [];
      }
    });
  }
  game.players.filter(player => !["police", "thief"].includes(player.team)).forEach(player => {
    player.team = null;
    player.seat = null;
    player.pawnIds = [];
  });
}

function lobbyReady(game) {
  if (game.players.length < MIN_PLAYERS || game.players.length > MAX_PLAYERS) return false;
  const limits = requiredTeamCounts(game.players.length);
  for (const team of ["police", "thief"]) {
    const players = game.players.filter(player => player.team === team);
    if (players.length !== limits[team]) return false;
    const seats = players.map(player => player.seat);
    if (seats.some(seat => !Number.isInteger(seat) || seat < 1 || seat > limits[team])) return false;
    if (new Set(seats).size !== seats.length) return false;
  }
  return game.players.every(player => player.team === "police" || player.team === "thief");
}

function chooseSeat(game, playerId, team, slot) {
  if (game.phase !== "lobby") return { ok: false, error: "대기실에서만 팀 자리를 고를 수 있습니다." };
  const player = playerById(game, playerId);
  if (!player) return { ok: false, error: "참가자를 찾을 수 없습니다." };
  const safeTeam = String(team || "");
  const safeSlot = Number(slot);
  if (!['police', 'thief'].includes(safeTeam)) {
    player.team = null;
    player.seat = null;
    player.pawnIds = [];
    game.lastAction = `${player.name}님이 팀 자리에서 나왔습니다.`;
    game.revision += 1;
    return { ok: true };
  }
  const limits = requiredTeamCounts(game.players.length);
  if (!Number.isInteger(safeSlot) || safeSlot < 1 || safeSlot > limits[safeTeam]) return { ok: false, error: "현재 인원에서 사용할 수 없는 팀 자리입니다." };
  const occupied = game.players.find(candidate => candidate.id !== player.id && candidate.team === safeTeam && candidate.seat === safeSlot);
  if (occupied) return { ok: false, error: `${occupied.name}님이 사용 중인 자리입니다.` };
  if (player.team === safeTeam && player.seat === safeSlot) {
    player.team = null;
    player.seat = null;
    game.lastAction = `${player.name}님이 팀 자리에서 나왔습니다.`;
  } else {
    player.team = safeTeam;
    player.seat = safeSlot;
    game.lastAction = `${player.name}님이 ${safeTeam === "police" ? "경찰팀" : "도둑팀"} ${safeSlot}번 자리를 선택했습니다.`;
  }
  player.pawnIds = [];
  game.revision += 1;
  return { ok: true };
}

function recommendSeats(game, suppliedRandom) {
  if (game.phase !== "lobby") return { ok: false, error: "대기실에서만 추천 배치를 사용할 수 있습니다." };
  const shuffled = [...game.players];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const target = randomIndex(index + 1, suppliedRandom);
    [shuffled[index], shuffled[target]] = [shuffled[target], shuffled[index]];
  }
  const limits = requiredTeamCounts(shuffled.length);
  shuffled.forEach((player, index) => {
    player.team = index < limits.police ? "police" : "thief";
    player.seat = index < limits.police ? index + 1 : index - limits.police + 1;
    player.pawnIds = [];
  });
  game.lastAction = "팀 자리를 무작위로 추천 배치했습니다. 각자 빈 자리를 눌러 바꿀 수 있습니다.";
  game.revision += 1;
  return { ok: true };
}

function controllersFor(teamPlayers, pawnIndex) {
  if (teamPlayers.length === 1) return [teamPlayers[0].id];
  if (teamPlayers.length === 2) return pawnIndex < 2 ? [teamPlayers[pawnIndex].id] : teamPlayers.map(player => player.id);
  return [teamPlayers[pawnIndex].id];
}

function assignTeamsAndPawns(game) {
  const policePlayers = game.players.filter(player => player.team === "police").sort((a, b) => a.seat - b.seat);
  const thiefPlayers = game.players.filter(player => player.team === "thief").sort((a, b) => a.seat - b.seat);
  game.players.forEach(player => { player.pawnIds = []; });
  game.pawns = [];
  for (const team of ["thief", "police"]) {
    const teamPlayers = team === "thief" ? thiefPlayers : policePlayers;
    for (let index = 0; index < 3; index += 1) {
      const pawn = {
        id: `${team}-${index + 1}`,
        team,
        number: index + 1,
        position: team === "thief" ? "hideout" : "jail",
        status: "active",
        carryingGem: false,
        hidingTurns: 0,
        forcedNext: null,
        controllerIds: controllersFor(teamPlayers, index)
      };
      game.pawns.push(pawn);
      for (const playerId of pawn.controllerIds) {
        const player = game.players.find(candidate => candidate.id === playerId);
        if (player && !player.pawnIds.includes(pawn.id)) player.pawnIds.push(pawn.id);
      }
    }
  }
  game.pawns.sort((a, b) => PAWN_ORDER.indexOf(a.id) - PAWN_ORDER.indexOf(b.id));
  game.policeCaptainId = policePlayers[0]?.id || null;
}

function resetRound(game) {
  game.buildings = initialBuildings();
  game.tricks = [];
  game.checks = [];
  game.resources = {
    thief: { trickCards: TRICK_CARD_COUNT, securedGems: 0, knownBuildings: [] },
    police: { checkCards: CHECK_CARD_COUNT }
  };
  game.turnIndex = 0;
  game.turnNumber = 1;
  game.turnMode = "idle";
  game.die = null;
  game.remaining = 0;
  game.path = [];
  game.lastMove = null;
  game.moveSequence = 0;
  game.pending = null;
  game.winnerTeam = null;
}

function startGame(game) {
  if (game.phase !== "lobby") return { ok: false, error: "이미 시작한 게임입니다." };
  if (!lobbyReady(game)) return { ok: false, error: "모든 참가자가 인원수에 맞는 경찰팀·도둑팀 슬롯을 선택해야 합니다." };
  if (game.players.length < MIN_PLAYERS || game.players.length > MAX_PLAYERS) return { ok: false, error: "게임 시작에는 2~6명이 필요합니다." };
  assignTeamsAndPawns(game);
  resetRound(game);
  game.phase = "setup";
  game.lastAction = "경찰팀이 보석 2개와 경보 장치를 배치하는 중입니다.";
  game.revision += 1;
  return { ok: true };
}

function currentPawn(game) {
  return game.pawns[game.turnIndex] || null;
}

function playerById(game, id) {
  return game.players.find(player => player.id === String(id)) || null;
}

function pawnById(game, id) {
  return game.pawns.find(pawn => pawn.id === String(id)) || null;
}

function canControl(pawn, playerId) {
  return !!pawn && pawn.controllerIds.includes(String(playerId));
}

function randomIndex(maximum, supplied) {
  if (typeof supplied === "function") return Math.max(0, Math.min(maximum - 1, Number(supplied(maximum)) || 0));
  return crypto.randomInt(maximum);
}

function placeSecrets(game, playerId, placements) {
  if (game.phase !== "setup") return { ok: false, error: "지금은 비밀 배치 단계가 아닙니다." };
  if (String(playerId) !== game.policeCaptainId) return { ok: false, error: "경찰팀 대표만 비밀 물건을 배치할 수 있습니다." };
  const gemBuildings = Array.isArray(placements?.gems) ? placements.gems.map(String) : [];
  const undercover = String(placements?.undercover || "");
  const selected = [...gemBuildings, undercover];
  const validIds = new Set(Board.BUILDINGS.map(building => building.id));
  if (gemBuildings.length !== 2 || !undercover || selected.some(id => !validIds.has(id)) || new Set(selected).size !== 3) {
    return { ok: false, error: "서로 다른 장소 3곳에 보석 2개와 경보 장치를 배치하세요." };
  }
  for (const building of game.buildings) {
    building.content = gemBuildings.includes(building.id) ? "gem" : building.id === undercover ? "undercover" : null;
    building.searched = false;
  }
  game.phase = "playing";
  game.turnMode = "awaiting_roll";
  game.lastAction = "비밀 배치가 끝났습니다. 도둑 1번부터 움직입니다.";
  game.revision += 1;
  return { ok: true };
}

function autoPlaceSecrets(game, suppliedRandom) {
  if (game.phase !== "setup") return { ok: false, error: "자동 배치를 할 수 없습니다." };
  const available = Board.BUILDINGS.map(building => building.id);
  const chosen = [];
  while (chosen.length < 3) {
    const index = randomIndex(available.length, suppliedRandom);
    chosen.push(available.splice(index, 1)[0]);
  }
  return placeSecrets(game, game.policeCaptainId, { gems: chosen.slice(0, 2), undercover: chosen[2] });
}

function beginTurn(game) {
  game.turnMode = "awaiting_roll";
  game.die = null;
  game.remaining = 0;
  game.path = [];
  game.pending = null;
}

function advanceTurn(game, message) {
  if (game.phase !== "playing") return;
  const previous = game.turnIndex;
  game.turnIndex = (game.turnIndex + 1) % game.pawns.length;
  if (game.turnIndex <= previous) game.turnNumber += 1;
  beginTurn(game);
  if (message) game.lastAction = message;
}

function validateActor(game, playerId, expectedModes = []) {
  if (game.phase !== "playing") return { error: "진행 중인 게임이 아닙니다." };
  const pawn = currentPawn(game);
  if (!canControl(pawn, playerId)) return { error: "지금은 내가 맡은 말의 차례가 아닙니다." };
  if (expectedModes.length && !expectedModes.includes(game.turnMode)) return { error: "지금 선택할 수 없는 행동입니다." };
  return { pawn };
}

function policeAtJail(game) {
  return game.pawns.some(pawn => pawn.team === "police" && pawn.position === "jail");
}

function availableNeighbors(game, pawn) {
  if (!pawn || game.turnMode !== "moving") return [];
  let options = Board.neighbors(pawn.position, pawn.team).map(item => item.id);
  if (pawn.forcedNext) options = options.filter(id => id === pawn.forcedNext);
  options = options.filter(id => {
    const node = Board.NODES[id];
    if (!node) return false;
    if (pawn.team === "police" && node.kind === "building") return false;
    if (pawn.team === "thief" && id === "jail" && policeAtJail(game)) return false;
    return !game.path.includes(id);
  });
  return [...new Set(options)];
}

function movementPlans(game, pawn) {
  const plans = new Map();
  if (!pawn || game.turnMode !== "moving" || game.remaining <= 0) return plans;
  const startingPath = [...game.path];
  const activeThieves = new Set(game.pawns
    .filter(candidate => candidate.team === "thief" && candidate.status === "active")
    .map(candidate => candidate.position));
  const checkNodes = new Set(game.checks.map(check => check.nodeId));
  const tricks = new Map(game.tricks.map(trick => [trick.nodeId, trick.nextNodeId]));

  function optionsFrom(position, visited, forcedNext) {
    let options = Board.neighbors(position, pawn.team).map(item => item.id);
    if (forcedNext) options = options.filter(id => id === forcedNext);
    return [...new Set(options)].filter(id => {
      const node = Board.NODES[id];
      if (!node || visited.includes(id)) return false;
      if (pawn.team === "police" && node.kind === "building") return false;
      if (pawn.team === "thief" && id === "jail" && policeAtJail(game)) return false;
      return true;
    });
  }

  function walk(position, stepsLeft, visited, route, forcedNext) {
    const options = optionsFrom(position, visited, forcedNext);
    if (!options.length) {
      const existing = plans.get(position);
      if (route.length && (!existing || route.length > existing.length)) plans.set(position, [...route]);
      return;
    }
    for (const next of options) {
      const nextRoute = [...route, next];
      const nextVisited = [...visited, next];
      const caughtThief = pawn.team === "police" && activeThieves.has(next) && !Board.NODES[next]?.safe;
      const stoppedByCheck = pawn.team === "thief" && pawn.carryingGem && checkNodes.has(next);
      if (stepsLeft === 1 || caughtThief || stoppedByCheck) {
        const existing = plans.get(next);
        if (!existing || nextRoute.length > existing.length) plans.set(next, nextRoute);
        continue;
      }
      const nextForced = pawn.team === "police" ? tricks.get(next) || null : null;
      walk(next, stepsLeft - 1, nextVisited, nextRoute, nextForced);
    }
  }

  walk(pawn.position, game.remaining, startingPath, [], pawn.forcedNext || null);
  return plans;
}

function reachableDestinations(game, pawn) {
  return [...movementPlans(game, pawn).keys()];
}

function finishWinner(game, team, message) {
  game.phase = "ended";
  game.winnerTeam = team;
  game.turnMode = "ended";
  game.pending = null;
  game.remaining = 0;
  game.lastAction = message;
}

function checkPoliceVictory(game) {
  if (game.pawns.filter(pawn => pawn.team === "thief" && pawn.status === "jailed").length === 3) {
    finishWinner(game, "police", "도둑 3명이 모두 체포되었습니다. 경찰팀 승리!");
    return true;
  }
  return false;
}

function buildingByNode(game, node) {
  return node?.building ? game.buildings.find(building => building.id === node.building) : null;
}

function rehideGem(game, suppliedRandom) {
  let options = game.buildings.filter(building => building.content === null);
  if (!options.length) options = [...game.buildings];
  const building = options[randomIndex(options.length, suppliedRandom)];
  building.content = "gem";
  building.searched = false;
  game.resources.thief.knownBuildings = game.resources.thief.knownBuildings.filter(id => id !== building.id);
  return building;
}

function captureThief(game, thief, message) {
  thief.status = "jailed";
  thief.position = "jail";
  thief.hidingTurns = 0;
  if (thief.carryingGem) {
    thief.carryingGem = false;
    rehideGem(game);
    message += " 가지고 있던 보석은 경찰팀이 다시 배치했습니다.";
  }
  game.lastAction = message;
  return checkPoliceVictory(game);
}

function revealGemBuilding(game) {
  const options = game.buildings.filter(building => building.content === "gem" && !game.resources.thief.knownBuildings.includes(building.id));
  if (!options.length) return null;
  const selected = options[0];
  game.resources.thief.knownBuildings.push(selected.id);
  return selected.id;
}

function resolveLanding(game, pawn, options = {}) {
  if (game.phase !== "playing") return;
  const node = Board.NODES[pawn.position];
  if (!node) {
    advanceTurn(game, `${pawn.team === "thief" ? "도둑" : "경찰"} ${pawn.number}번의 이동이 끝났습니다.`);
    return;
  }

  if (pawn.team === "thief" && pawn.position === "hideout") {
    if (pawn.carryingGem) {
      pawn.carryingGem = false;
      game.resources.thief.securedGems += 1;
      if (game.resources.thief.securedGems >= 2) {
        finishWinner(game, "thief", "보석 2개를 모두 비밀기지로 옮겼습니다. 도둑팀 승리!");
        return;
      }
      advanceTurn(game, `도둑 ${pawn.number}번이 보석을 비밀기지에 보관했습니다.`);
      return;
    }
  }

  if (pawn.team === "thief" && pawn.position === "jail" && pawn.status === "active") {
    const jailed = game.pawns.filter(candidate => candidate.team === "thief" && candidate.status === "jailed");
    if (!policeAtJail(game) && jailed.length) {
      game.turnMode = "pending";
      game.pending = { type: "rescue", pawnId: pawn.id, options: jailed.map(candidate => candidate.id) };
      game.lastAction = "구출할 동료를 선택하세요.";
      return;
    }
  }

  const building = buildingByNode(game, node);
  if (building && pawn.team === "thief") {
    if (pawn.carryingGem) {
      advanceTurn(game, `도둑 ${pawn.number}번은 보석을 가지고 있어 건물을 더 수색하지 않았습니다.`);
      return;
    }
    const content = building.content;
    building.content = null;
    building.searched = true;
    game.resources.thief.knownBuildings = [...new Set([...game.resources.thief.knownBuildings, building.id])];
    const name = Board.BUILDINGS.find(item => item.id === building.id)?.name || "건물";
    if (content === "gem") {
      pawn.carryingGem = true;
      advanceTurn(game, `${pawn.number}번 도둑이 ${name}에서 보석을 찾았습니다!`);
      return;
    }
    if (content === "undercover") {
      if (!captureThief(game, pawn, `${name}에서 경보 장치가 작동했습니다. 도둑 ${pawn.number}번이 체포되었습니다.`)) advanceTurn(game);
      return;
    }
    advanceTurn(game, `${name}은 비어 있었습니다.`);
    return;
  }

  if (!node.effect || options.skipEffect === node.effect) {
    advanceTurn(game, `${pawn.team === "thief" ? "도둑" : "경찰"} ${pawn.number}번의 이동이 끝났습니다.`);
    return;
  }

  if (node.effect === "train") {
    pawn.position = node.effectTarget;
    advanceTurn(game, `${node.station}번 역에서 ${Board.NODES[node.effectTarget].station}번 역으로 이동했습니다.`);
    return;
  }
  if (node.effect === "jump") {
    pawn.position = node.effectTarget;
    game.lastAction = `${node.label} 효과로 이동했습니다.`;
    resolveLanding(game, pawn, { chainDepth: (options.chainDepth || 0) + 1 });
    return;
  }
  if (node.effect === "reset") {
    pawn.position = pawn.team === "thief" ? "hideout" : "jail";
    advanceTurn(game, `${node.label}. ${pawn.team === "thief" ? "비밀기지" : "경찰 본부"}로 돌아갑니다.`);
    return;
  }
  if (node.effect === "reveal") {
    const buildingId = revealGemBuilding(game);
    const name = Board.BUILDINGS.find(item => item.id === buildingId)?.name;
    advanceTurn(game, name ? `정보 누설! 도둑팀은 ${name}에 보석이 있다는 것을 알아냈습니다.` : "정보를 얻었지만 새로 확인할 보석은 없었습니다.");
    return;
  }
  if (node.effect === "thiefTeleport" || node.effect === "policeTeleport") {
    const requiredTeam = node.effect === "thiefTeleport" ? "thief" : "police";
    if (pawn.team !== requiredTeam) {
      advanceTurn(game, `${pawn.team === "thief" ? "도둑" : "경찰"}에게는 작동하지 않는 이동 칸입니다.`);
      return;
    }
    const choices = Object.values(Board.NODES).filter(candidate => candidate.effect === node.effect && candidate.id !== node.id).map(candidate => candidate.id);
    game.turnMode = "pending";
    game.pending = { type: "teleport", pawnId: pawn.id, options: choices };
    game.lastAction = "이동할 같은 색 위치 이동 칸을 선택하세요.";
    return;
  }
  if (node.effect === "transfer" && pawn.team === "thief" && pawn.carryingGem) {
    const choices = game.pawns.filter(candidate => candidate.team === "thief" && candidate.id !== pawn.id && candidate.status === "active" && !candidate.carryingGem).map(candidate => candidate.id);
    if (choices.length) {
      game.turnMode = "pending";
      game.pending = { type: "transfer", pawnId: pawn.id, options: choices };
      game.lastAction = "보석을 넘겨줄 도둑말을 선택하세요.";
      return;
    }
  }
  if (node.effect === "dropGem" && pawn.team === "thief" && pawn.carryingGem) {
    pawn.carryingGem = false;
    rehideGem(game);
    advanceTurn(game, "보석을 떨어뜨렸습니다. 경찰팀이 보석을 다시 배치했습니다.");
    return;
  }
  advanceTurn(game, `${node.label} 칸의 처리가 끝났습니다.`);
}

function roll(game, playerId, suppliedRoll) {
  const { pawn, error } = validateActor(game, playerId, ["awaiting_roll"]);
  if (error) return { ok: false, error };
  const die = typeof suppliedRoll === "number" ? Math.max(1, Math.min(6, Math.floor(suppliedRoll))) : randomIndex(6) + 1;
  if (pawn.status === "jailed") {
    if (die !== 1) {
      advanceTurn(game, `도둑 ${pawn.number}번이 ${die}을 굴려 탈출에 실패했습니다. 구금 구역에 남습니다.`);
      game.revision += 1;
      return { ok: true, die };
    }
    pawn.status = "active";
    pawn.position = "jail";
    const moveDie = typeof suppliedRoll === "number" ? 1 : randomIndex(6) + 1;
    game.die = moveDie;
    game.remaining = moveDie;
    game.path = [pawn.position];
    game.turnMode = "moving";
    game.lastAction = `도둑 ${pawn.number}번이 탈출했습니다. 이어서 ${moveDie}칸 이동하세요.`;
    game.revision += 1;
    return { ok: true, die, escapeMove: moveDie };
  }
  pawn.hidingTurns = 0;
  game.die = die;
  game.remaining = die;
  game.path = [pawn.position];
  game.turnMode = "moving";
  game.lastAction = `${pawn.team === "thief" ? "도둑" : "경찰"} ${pawn.number}번이 ${die}을 굴렸습니다.`;
  if (!reachableDestinations(game, pawn).length) advanceTurn(game, "갈 수 있는 길이 없어 차례를 넘겼습니다.");
  game.revision += 1;
  return { ok: true, die };
}

function moveToDestination(game, playerId, targetNodeId) {
  const { pawn, error } = validateActor(game, playerId, ["moving"]);
  if (error) return { ok: false, error };
  const target = String(targetNodeId || "");
  const route = movementPlans(game, pawn).get(target);
  if (!route) return { ok: false, error: "선택한 칸을 최종 목적지로 이동할 수 없습니다." };

  const movingPawnId = pawn.id;
  const trace = [pawn.position];
  for (const nodeId of route) {
    const result = moveStep(game, playerId, nodeId);
    if (!result.ok) return result;
    trace.push(nodeId);
    if (pawn.position !== nodeId) trace.push(pawn.position);
    if (game.phase !== "playing" || game.turnMode !== "moving" || currentPawn(game)?.id !== movingPawnId) break;
  }
  game.moveSequence = (game.moveSequence || 0) + 1;
  game.lastMove = { id: game.moveSequence, pawnId: movingPawnId, path: trace.filter((nodeId, index) => nodeId && nodeId !== trace[index - 1]) };
  return { ok: true, path: [...game.lastMove.path] };
}

function moveStep(game, playerId, targetNodeId) {
  const { pawn, error } = validateActor(game, playerId, ["moving"]);
  if (error) return { ok: false, error };
  const target = String(targetNodeId || "");
  if (!availableNeighbors(game, pawn).includes(target)) return { ok: false, error: "선택한 칸으로 이동할 수 없습니다." };
  const usedForced = !!pawn.forcedNext;
  pawn.position = target;
  pawn.hidingTurns = 0;
  game.path.push(target);
  game.remaining = Math.max(0, game.remaining - 1);
  if (usedForced) pawn.forcedNext = null;

  if (pawn.team === "thief" && pawn.carryingGem) {
    const checkIndex = game.checks.findIndex(check => check.nodeId === target);
    if (checkIndex >= 0) {
      game.checks.splice(checkIndex, 1);
      game.remaining = 0;
      game.lastAction = `차단 표지에 걸려 도둑 ${pawn.number}번이 멈췄습니다.`;
    }
  }

  if (pawn.team === "police") {
    const trickIndex = game.tricks.findIndex(trick => trick.nodeId === target);
    if (trickIndex >= 0) {
      const [trick] = game.tricks.splice(trickIndex, 1);
      pawn.forcedNext = trick.nextNodeId;
      game.lastAction = "가짜 단서에 속았습니다. 카드의 화살표 방향으로만 이동합니다.";
    }
    const caught = game.pawns.find(candidate => candidate.team === "thief" && candidate.status === "active" && candidate.position === target && !Board.NODES[target]?.safe);
    if (caught) {
      pawn.position = "jail";
      game.remaining = 0;
      if (!captureThief(game, caught, `경찰 ${pawn.number}번이 도둑 ${caught.number}번을 체포했습니다.`)) advanceTurn(game);
      game.revision += 1;
      return { ok: true };
    }
  }

  // A dead end is a final destination even when the die has steps left.
  // Resolve its search/deposit effect before advancing to the next pawn.
  if (game.remaining === 0 || !availableNeighbors(game, pawn).length) resolveLanding(game, pawn);
  game.revision += 1;
  return { ok: true };
}

function hide(game, playerId) {
  const { pawn, error } = validateActor(game, playerId, ["awaiting_roll"]);
  if (error) return { ok: false, error };
  const node = Board.NODES[pawn.position];
  if (pawn.team !== "thief" || pawn.status !== "active" || !node?.safe) return { ok: false, error: "도둑말이 비밀기지나 수색 장소 안에 있을 때만 숨을 수 있습니다." };
  if (pawn.hidingTurns >= 3) return { ok: false, error: "같은 안전지대에서는 최대 3차례까지만 숨을 수 있습니다." };
  pawn.hidingTurns += 1;
  advanceTurn(game, `도둑 ${pawn.number}번이 안전지대에서 숨었습니다. (${pawn.hidingTurns}/3)`);
  game.revision += 1;
  return { ok: true };
}

function occupied(game, nodeId) {
  return game.pawns.some(pawn => pawn.position === nodeId);
}

function placeTrick(game, playerId, nodeId, nextNodeId) {
  const { pawn, error } = validateActor(game, playerId, ["awaiting_roll"]);
  if (error) return { ok: false, error };
  if (pawn.team !== "thief") return { ok: false, error: "가짜 단서 카드는 도둑팀만 사용할 수 있습니다." };
  if (game.resources.thief.trickCards <= 0) return { ok: false, error: "남은 가짜 단서 카드가 없습니다." };
  const node = Board.NODES[String(nodeId)];
  if (!node?.trickSlot || occupied(game, node.id) || game.tricks.some(card => card.nodeId === node.id) || game.checks.some(card => card.nodeId === node.id)) return { ok: false, error: "분홍 방향 표시가 있고 비어 있는 칸을 선택하세요." };
  const next = String(nextNodeId || "");
  if (!Board.neighbors(node.id, "police").some(item => item.id === next)) return { ok: false, error: "경찰이 실제로 갈 수 있는 화살표 방향을 선택하세요." };
  game.tricks.push({ nodeId: node.id, nextNodeId: next });
  game.resources.thief.trickCards -= 1;
  advanceTurn(game, `도둑팀이 가짜 단서 카드를 놓았습니다. 남은 카드 ${game.resources.thief.trickCards}장.`);
  game.revision += 1;
  return { ok: true };
}

function placeCheck(game, playerId, nodeId) {
  const { pawn, error } = validateActor(game, playerId, ["awaiting_roll"]);
  if (error) return { ok: false, error };
  if (pawn.team !== "police") return { ok: false, error: "차단 표지는 경찰팀만 사용할 수 있습니다." };
  if (game.resources.police.checkCards <= 0) return { ok: false, error: "남은 차단 표지가 없습니다." };
  const node = Board.NODES[String(nodeId)];
  if (!node?.inspectionSlot || occupied(game, node.id) || game.tricks.some(card => card.nodeId === node.id) || game.checks.some(card => card.nodeId === node.id)) return { ok: false, error: "파란 차단 표시가 있고 비어 있는 칸을 선택하세요." };
  game.checks.push({ nodeId: node.id });
  game.resources.police.checkCards -= 1;
  advanceTurn(game, `경찰팀이 차단 표지를 설치했습니다. 남은 표지 ${game.resources.police.checkCards}개.`);
  game.revision += 1;
  return { ok: true };
}

function choosePending(game, playerId, choiceId) {
  const { pawn, error } = validateActor(game, playerId, ["pending"]);
  if (error) return { ok: false, error };
  const pending = game.pending;
  const choice = String(choiceId || "");
  if (!pending || pending.pawnId !== pawn.id || !pending.options.includes(choice)) return { ok: false, error: "선택할 수 없는 대상입니다." };
  if (pending.type === "teleport") {
    pawn.position = choice;
    advanceTurn(game, `${pawn.team === "thief" ? "도둑" : "경찰"} ${pawn.number}번이 위치 이동을 했습니다.`);
  } else if (pending.type === "transfer") {
    const target = pawnById(game, choice);
    pawn.carryingGem = false;
    target.carryingGem = true;
    advanceTurn(game, `도둑 ${pawn.number}번이 도둑 ${target.number}번에게 보석을 넘겼습니다.`);
  } else if (pending.type === "rescue") {
    const target = pawnById(game, choice);
    target.status = "active";
    target.position = "hideout";
    pawn.position = "hideout";
    pawn.hidingTurns = 0;
    advanceTurn(game, `도둑 ${pawn.number}번이 도둑 ${target.number}번을 구출해 함께 비밀기지로 돌아왔습니다.`);
  } else return { ok: false, error: "처리할 수 없는 선택입니다." };
  game.revision += 1;
  return { ok: true };
}

function resetToLobby(game, message = "대기실로 돌아왔습니다.") {
  game.phase = "lobby";
  game.players.forEach(player => { player.pawnIds = []; });
  normalizeLobbySeats(game);
  game.pawns = [];
  game.buildings = initialBuildings();
  game.tricks = [];
  game.checks = [];
  game.resources = {
    thief: { trickCards: TRICK_CARD_COUNT, securedGems: 0, knownBuildings: [] },
    police: { checkCards: CHECK_CARD_COUNT }
  };
  game.policeCaptainId = null;
  game.turnIndex = 0;
  game.turnNumber = 0;
  game.turnMode = "idle";
  game.die = null;
  game.remaining = 0;
  game.path = [];
  game.pending = null;
  game.winnerTeam = null;
  game.lastAction = message;
  game.revision += 1;
  return { ok: true };
}

function publicPawn(pawn) {
  return {
    id: pawn.id,
    team: pawn.team,
    number: pawn.number,
    position: pawn.position,
    status: pawn.status,
    carryingGem: pawn.carryingGem,
    hidingTurns: pawn.hidingTurns,
    controllerIds: [...pawn.controllerIds]
  };
}

function stateFor(game, playerId) {
  const id = String(playerId);
  const me = playerById(game, id);
  const pawn = currentPawn(game);
  const canAct = game.phase === "playing" && canControl(pawn, id);
  const movePlans = canAct ? movementPlans(game, pawn) : new Map();
  const known = new Set(game.resources.thief.knownBuildings);
  const buildingState = game.buildings.map(building => {
    let content = "hidden";
    if (me?.team === "police") content = building.content || "empty";
    else if (building.searched || known.has(building.id)) content = building.content || "empty";
    return { id: building.id, content, searched: building.searched, known: content !== "hidden" };
  });
  const safeNode = pawn ? Board.NODES[pawn.position] : null;
  const canHide = canAct && game.turnMode === "awaiting_roll" && pawn.team === "thief" && pawn.status === "active" && !!safeNode?.safe && pawn.hidingTurns < 3;
  return {
    phase: game.phase,
    players: game.players.map(player => ({ id: player.id, name: player.name, team: player.team, seat: player.seat, pawnIds: [...player.pawnIds] })),
    teamLimits: requiredTeamCounts(game.players.length),
    lobbyReady: lobbyReady(game),
    myTeam: me?.team || null,
    policeCaptainId: game.policeCaptainId,
    pawns: game.pawns.map(publicPawn),
    buildings: buildingState,
    tricks: game.tricks.map(card => ({ ...card })),
    checks: game.checks.map(card => ({ ...card })),
    resources: {
      thief: { trickCards: game.resources.thief.trickCards, securedGems: game.resources.thief.securedGems, knownBuildings: me?.team === "thief" ? [...game.resources.thief.knownBuildings] : [] },
      police: { checkCards: game.resources.police.checkCards }
    },
    turnPawnId: pawn?.id || null,
    turnControllers: pawn ? [...pawn.controllerIds] : [],
    turnIndex: game.turnIndex,
    turnNumber: game.turnNumber,
    turnMode: game.turnMode,
    die: game.die,
    remaining: game.remaining,
    path: [...game.path],
    lastMove: game.lastMove ? { id: game.lastMove.id, pawnId: game.lastMove.pawnId, path: [...game.lastMove.path] } : null,
    pending: game.pending ? { type: game.pending.type, pawnId: game.pending.pawnId, options: canAct ? [...game.pending.options] : [] } : null,
    winnerTeam: game.winnerTeam,
    lastAction: game.lastAction,
    revision: game.revision,
    canAct,
    canSetup: game.phase === "setup" && id === game.policeCaptainId,
    validMoves: [...movePlans.keys()],
    moveRoutes: Object.fromEntries([...movePlans].map(([target, route]) => [target, [pawn.position, ...route]])),
    actions: {
      roll: canAct && game.turnMode === "awaiting_roll",
      hide: canHide,
      trick: canAct && game.turnMode === "awaiting_roll" && pawn?.team === "thief" && game.resources.thief.trickCards > 0,
      check: canAct && game.turnMode === "awaiting_roll" && pawn?.team === "police" && game.resources.police.checkCards > 0,
      choose: canAct && game.turnMode === "pending"
    }
  };
}

module.exports = {
  BOARD: Board,
  CHECK_CARD_COUNT,
  recommendSeats,
  requiredTeamCounts,
  MAX_PLAYERS,
  MIN_PLAYERS,
  PAWN_ORDER,
  TRICK_CARD_COUNT,
  addPlayer,
  autoPlaceSecrets,
  chooseSeat,
  lobbyReady,
  availableNeighbors,
  choosePending,
  createGame,
  currentPawn,
  hide,
  moveToDestination,
  moveStep,
  placeCheck,
  placeSecrets,
  placeTrick,
  removePlayer,
  resetToLobby,
  roll,
  reachableDestinations,
  startGame,
  stateFor
};
