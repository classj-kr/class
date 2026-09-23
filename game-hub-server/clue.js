"use strict";

const crypto = require("crypto");

const SUSPECTS = Object.freeze([
  { name: "백작부인", color: "#b03a6b" },
  { name: "집사장", color: "#2b2b2b" },
  { name: "정원사", color: "#2e7d46" },
  { name: "주치의", color: "#c17f18" },
  { name: "골동품상", color: "#1f4e8c" },
  { name: "무희", color: "#b8283a" }
]);
const WEAPONS = Object.freeze(["촛대", "밧줄", "렌치", "손전등", "만능열쇠", "유리칼"]);
const ROOMS = Object.freeze(["온실", "무도회장", "주방", "서재", "거실", "식당", "사무실", "현관", "당구실"]);
const CENTER_ROOM = 4;

// Four two-tile-wide corridor bands form the mansion's real # network.
// Coordinate-based ids merge each crossing into a connected 2x2 junction.
// The 8 outer endpoints are secret stairwells; every pair exits at the point
// rotated 180 degrees across the centre of the mansion.
const TRACK_POSITIONS = Object.freeze([20, 38.9, 57.8, 76.7, 95.6, 114.4, 133.3, 152.2, 171.1, 190, 208.9, 227.8, 246.7, 265.6, 284.4, 303.3, 322.2, 341.1, 360]);
const HORIZONTAL_BANDS = Object.freeze([
  Object.freeze({ rows: Object.freeze([5, 6]), portals: Object.freeze(["htL", "htR"]) }),
  Object.freeze({ rows: Object.freeze([12, 13]), portals: Object.freeze(["hbL", "hbR"]) })
]);
const VERTICAL_BANDS = Object.freeze([
  Object.freeze({ columns: Object.freeze([5, 6]), portals: Object.freeze(["vlT", "vlB"]) }),
  Object.freeze({ columns: Object.freeze([12, 13]), portals: Object.freeze(["vrT", "vrB"]) })
]);

function gridCellId(xIndex, yIndex) {
  return "g" + xIndex + "_" + yIndex;
}

function buildCorridorModel() {
  const coords = {};
  const neighborSets = {};
  const orientations = {};
  const addNode = (cellId, x, y, orientation) => {
    if (!coords[cellId]) coords[cellId] = [x, y];
    if (orientations[cellId] && orientations[cellId] !== orientation) orientations[cellId] = "x";
    else if (!orientations[cellId]) orientations[cellId] = orientation;
    if (!neighborSets[cellId]) neighborSets[cellId] = new Set();
  };
  const connect = (first, second) => {
    neighborSets[first].add(second);
    neighborSets[second].add(first);
  };
  HORIZONTAL_BANDS.forEach((band) => {
    band.rows.forEach((row) => {
      for (let column = 1; column <= 17; column += 1) {
        const cellId = gridCellId(column, row);
        addNode(cellId, TRACK_POSITIONS[column], TRACK_POSITIONS[row], "h");
        if (column > 1) connect(gridCellId(column - 1, row), cellId);
      }
    });
    for (let column = 1; column <= 17; column += 1) connect(gridCellId(column, band.rows[0]), gridCellId(column, band.rows[1]));
    const centreY = (TRACK_POSITIONS[band.rows[0]] + TRACK_POSITIONS[band.rows[1]]) / 2;
    addNode(band.portals[0], TRACK_POSITIONS[0], centreY, "h");
    addNode(band.portals[1], TRACK_POSITIONS[18], centreY, "h");
    band.rows.forEach((row) => {
      connect(band.portals[0], gridCellId(1, row));
      connect(band.portals[1], gridCellId(17, row));
    });
  });
  VERTICAL_BANDS.forEach((band) => {
    band.columns.forEach((column) => {
      for (let row = 1; row <= 17; row += 1) {
        const cellId = gridCellId(column, row);
        addNode(cellId, TRACK_POSITIONS[column], TRACK_POSITIONS[row], "v");
        if (row > 1) connect(gridCellId(column, row - 1), cellId);
      }
    });
    for (let row = 1; row <= 17; row += 1) connect(gridCellId(band.columns[0], row), gridCellId(band.columns[1], row));
    const centreX = (TRACK_POSITIONS[band.columns[0]] + TRACK_POSITIONS[band.columns[1]]) / 2;
    addNode(band.portals[0], centreX, TRACK_POSITIONS[0], "v");
    addNode(band.portals[1], centreX, TRACK_POSITIONS[18], "v");
    band.columns.forEach((column) => {
      connect(band.portals[0], gridCellId(column, 1));
      connect(band.portals[1], gridCellId(column, 17));
    });
  });
  const cells = Object.freeze(Object.keys(coords));
  const neighbors = Object.freeze(Object.fromEntries(cells.map((cellId) => [
    cellId,
    Object.freeze([...neighborSets[cellId]])
  ])));
  return Object.freeze({
    cells,
    coords: Object.freeze(coords),
    neighbors,
    orientations: Object.freeze(orientations)
  });
}

const CORRIDOR_MODEL = buildCorridorModel();
const CORRIDOR_CELLS = CORRIDOR_MODEL.cells;
const CELL_COORDS = CORRIDOR_MODEL.coords;
const CELL_NEIGHBORS = CORRIDOR_MODEL.neighbors;
const CELL_ROOMS = Object.freeze({
  g3_5: [0], g9_5: [1], g15_5: [2],
  g3_12: [3], g9_6: [4], g9_12: [4], g15_12: [5],
  g5_16: [6], g9_13: [7], g13_16: [8]
});
const ROOM_CELLS = Object.freeze({
  0: ["g3_5"], 1: ["g9_5"], 2: ["g15_5"],
  3: ["g3_12"], 4: ["g9_6", "g9_12"], 5: ["g15_12"],
  6: ["g5_16"], 7: ["g9_13"], 8: ["g13_16"]
});
const SECRET_PASSAGE_PAIRS = Object.freeze({
  htL: "hbR", hbR: "htL",
  htR: "hbL", hbL: "htR",
  vlT: "vrB", vrB: "vlT",
  vrT: "vlB", vlB: "vrT"
});
const START_ROOMS = Object.freeze([0, 2, 3, 5, 6, 8]);
const MIN_PLAYERS = 3;
const MAX_PLAYERS = 6;
const TURN_TIME_MS = 45000;
const REFUTE_TIME_MS = 15000;
const AVATAR_URL_PATTERN = /^\/assets\/avatars\/[A-Za-z0-9._%()-]+\.webp$/i;

function safeAvatarUrl(url) {
  return typeof url === "string" && AVATAR_URL_PATTERN.test(url) ? url : null;
}

function randomInt(maximum) {
  return crypto.randomInt(maximum);
}

function shuffle(values, pick = randomInt) {
  const result = [...values];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const other = pick(index + 1);
    [result[index], result[other]] = [result[other], result[index]];
  }
  return result;
}

function cardType(id) {
  if (id < 6) return "suspect";
  if (id < 12) return "weapon";
  return "room";
}

function cardName(id) {
  if (id < 6) return SUSPECTS[id].name;
  if (id < 12) return WEAPONS[id - 6];
  return ROOMS[id - 12];
}

function createPlayer(id, name, avatarUrl) {
  return {
    id: String(id),
    name: String(name || "플레이어").trim() || "플레이어",
    avatarUrl: safeAvatarUrl(avatarUrl),
    roomIndex: -1,
    cellId: null,
    active: true
  };
}

function createGame(hostId, hostName, hostAvatarUrl) {
  return {
    phase: "lobby",
    players: [createPlayer(hostId, hostName || "방장", hostAvatarUrl)],
    hands: {},
    solution: null,
    turnIndex: 0,
    turnPhase: "move",
    dice: null,
    diceValues: null,
    stepsRemaining: 0,
    movePath: [],
    moved: false,
    suggestionUsed: false,
    pendingSuggestion: null,
    winnerId: null,
    solutionRevealed: false,
    deadline: null,
    log: "플레이어를 기다리는 중입니다.",
    actionNumber: 0
  };
}

function addPlayer(game, id, name, avatarUrl) {
  const safeId = String(id);
  if (game.phase !== "lobby" || game.players.some(player => player.id === safeId) || game.players.length >= MAX_PLAYERS) return false;
  game.players.push(createPlayer(safeId, name, avatarUrl));
  game.log = `${String(name || "플레이어").trim() || "플레이어"}님이 입장했습니다.`;
  return true;
}

function removePlayer(game, id) {
  const safeId = String(id);
  const before = game.players.length;
  game.players = game.players.filter(player => player.id !== safeId);
  delete game.hands[safeId];
  return game.players.length !== before;
}

function resetToLobby(game, notice = "대기실로 돌아왔습니다.") {
  game.phase = "lobby";
  game.players.forEach(player => {
    player.roomIndex = -1;
    player.cellId = null;
    player.active = true;
  });
  game.hands = {};
  game.solution = null;
  game.turnIndex = 0;
  game.turnPhase = "move";
  game.dice = null;
  game.diceValues = null;
  game.stepsRemaining = 0;
  game.movePath = [];
  game.moved = false;
  game.suggestionUsed = false;
  game.pendingSuggestion = null;
  game.winnerId = null;
  game.solutionRevealed = false;
  game.deadline = null;
  game.log = notice;
  game.actionNumber += 1;
}

function playerById(game, id) {
  return game.players.find(player => player.id === String(id));
}

function activePlayer(game) {
  return game.players[game.turnIndex] || null;
}

function startMatch(game, pick = randomInt) {
  if (game.phase !== "lobby" || game.players.length < MIN_PLAYERS || game.players.length > MAX_PLAYERS) {
    return { ok: false, error: `${MIN_PLAYERS}~${MAX_PLAYERS}명이 모여야 시작할 수 있습니다.` };
  }
  game.players.forEach((player, index) => {
    player.roomIndex = START_ROOMS[index];
    player.cellId = null;
    player.active = true;
  });

  const suspectIds = shuffle([0, 1, 2, 3, 4, 5], pick);
  const weaponIds = shuffle([6, 7, 8, 9, 10, 11], pick);
  const roomIds = shuffle([12, 13, 14, 15, 16, 17, 18, 19, 20], pick);
  game.solution = { suspect: suspectIds[0], weapon: weaponIds[0], room: roomIds[0] };

  const remaining = shuffle([...suspectIds.slice(1), ...weaponIds.slice(1), ...roomIds.slice(1)], pick);
  game.hands = {};
  game.players.forEach(player => { game.hands[player.id] = []; });
  remaining.forEach((card, index) => {
    const player = game.players[index % game.players.length];
    game.hands[player.id].push(card);
  });

  game.turnIndex = 0;
  game.pendingSuggestion = null;
  game.winnerId = null;
  game.solutionRevealed = false;
  game.phase = "playing";
  resetTurnState(game);
  game.log = `${game.players[0].name}님부터 시작합니다.`;
  game.actionNumber += 1;
  return { ok: true, reveals: [] };
}

function resetTurnState(game) {
  game.turnPhase = "move";
  game.dice = null;
  game.diceValues = null;
  game.stepsRemaining = 0;
  game.movePath = [];
  game.moved = false;
  game.suggestionUsed = false;
  game.deadline = Date.now() + TURN_TIME_MS;
}

function advanceTurn(game) {
  const alive = game.players.filter(player => player.active);
  if (!alive.length) return;
  for (let offset = 1; offset <= game.players.length; offset += 1) {
    const nextIndex = (game.turnIndex + offset) % game.players.length;
    if (game.players[nextIndex].active) {
      game.turnIndex = nextIndex;
      resetTurnState(game);
      return;
    }
  }
}

function cellOccupant(game, cellId, excludePlayerId) {
  return game.players.find(player => player.cellId === cellId && player.id !== String(excludePlayerId));
}

// Step-by-step BFS over the corridor grid, up to `dice` tiles. Rooms are
// terminal (you can enter one but not walk back out the same turn) except
// the room the player starts the turn in. Occupied corridor tiles block
// passage, same as the real board; rooms never block.
function reachablePositions(game, player, dice) {
  const startInRoom = player.roomIndex >= 0;
  const startKey = startInRoom ? `r${player.roomIndex}` : player.cellId;
  const visited = new Set([startKey]);
  const rooms = new Set();
  const cells = new Set();
  let frontier = [{ room: startInRoom ? player.roomIndex : -1, cell: startInRoom ? null : player.cellId, steps: 0 }];
  while (frontier.length) {
    const next = [];
    for (const node of frontier) {
      if (node.steps >= dice) continue;
      if (node.room >= 0 && node.steps > 0) continue;
      const neighbors = [];
      if (node.cell) {
        for (const cellId of CELL_NEIGHBORS[node.cell]) neighbors.push({ type: "cell", value: cellId });
        for (const roomIdx of CELL_ROOMS[node.cell] || []) neighbors.push({ type: "room", value: roomIdx });
      } else if (node.room >= 0) {
        for (const cellId of ROOM_CELLS[node.room] || []) neighbors.push({ type: "cell", value: cellId });
      }
      for (const nb of neighbors) {
        const key = nb.type === "room" ? `r${nb.value}` : nb.value;
        if (visited.has(key)) continue;
        if (nb.type === "cell" && cellOccupant(game, nb.value, player.id)) continue;
        visited.add(key);
        if (nb.type === "room") rooms.add(nb.value);
        else cells.add(nb.value);
        next.push({ room: nb.type === "room" ? nb.value : -1, cell: nb.type === "cell" ? nb.value : null, steps: node.steps + 1 });
      }
    }
    frontier = next;
  }
  return { rooms: [...rooms], cells: [...cells] };
}

function movementPlans(game, player, dice) {
  const startKey = player.roomIndex >= 0 ? `r${player.roomIndex}` : player.cellId;
  if (!startKey) return new Map();
  const plans = new Map();
  const seen = new Set([startKey]);
  const queue = [{ key: startKey, room: player.roomIndex, cell: player.cellId, path: [startKey] }];
  while (queue.length) {
    const node = queue.shift();
    const steps = node.path.length - 1;
    if (steps >= dice) continue;
    if (node.room >= 0 && steps > 0) continue;
    const neighbors = [];
    if (node.cell) {
      for (const cellId of CELL_NEIGHBORS[node.cell]) neighbors.push({ type: "cell", value: cellId });
      for (const roomIdx of CELL_ROOMS[node.cell] || []) neighbors.push({ type: "room", value: roomIdx });
    } else if (node.room >= 0) {
      for (const cellId of ROOM_CELLS[node.room] || []) neighbors.push({ type: "cell", value: cellId });
    }
    for (const neighbor of neighbors) {
      const key = neighbor.type === "room" ? `r${neighbor.value}` : neighbor.value;
      if (seen.has(key)) continue;
      if (neighbor.type === "cell" && cellOccupant(game, neighbor.value, player.id)) continue;
      seen.add(key);
      const path = [...node.path, key];
      plans.set(key, path);
      queue.push({ key, room: neighbor.type === "room" ? neighbor.value : -1, cell: neighbor.type === "cell" ? neighbor.value : null, path });
    }
  }
  return plans;
}

function nextStepPositions(game, player) {
  const { rooms, cells } = reachablePositions(game, player, 1);
  const visited = new Set(game.movePath || []);
  return { rooms: rooms.filter(room => !visited.has(`r${room}`)), cells: cells.filter(cell => !visited.has(cell)) };
}

function roll(game, playerId, pick = randomInt) {
  if (game.phase !== "playing") return { ok: false, error: "진행 중인 게임이 없습니다." };
  if (game.pendingSuggestion) return { ok: false, error: "다른 플레이어의 반박을 기다리는 중입니다." };
  const actor = activePlayer(game);
  if (!actor || actor.id !== String(playerId)) return { ok: false, error: "현재 차례가 아닙니다." };
  if (game.turnPhase !== "move" || game.dice !== null || game.moved) return { ok: false, error: "지금은 주사위를 굴릴 수 없습니다." };
  const firstDie = 1 + pick(6);
  const secondDie = 1 + pick(6);
  game.diceValues = [firstDie, secondDie];
  game.dice = firstDie + secondDie;
  game.stepsRemaining = game.dice;
  const startKey = actor.roomIndex >= 0 ? `r${actor.roomIndex}` : actor.cellId;
  game.movePath = startKey ? [startKey] : [];
  game.lastMove = null;
  game.log = `${actor.name}님이 주사위 ${firstDie}와 ${secondDie}, 합계 ${game.dice}을(를) 굴렸습니다. 초록색 최종 목적지를 선택하세요.`;
  game.actionNumber += 1;
  return { ok: true, reveals: [] };
}

function move(game, playerId, target) {
  if (game.phase !== "playing") return { ok: false, error: "진행 중인 게임이 없습니다." };
  if (game.pendingSuggestion) return { ok: false, error: "다른 플레이어의 반박을 기다리는 중입니다." };
  const actor = activePlayer(game);
  if (!actor || actor.id !== String(playerId)) return { ok: false, error: "현재 차례가 아닙니다." };
  if (game.turnPhase !== "move" || game.dice === null || game.moved || game.stepsRemaining <= 0) return { ok: false, error: "지금은 이동할 수 없습니다." };
  if (typeof target !== "string" || !target) return { ok: false, error: "이동할 곳을 선택하세요." };
  const plan = movementPlans(game, actor, game.stepsRemaining).get(target);
  if (!plan) return { ok: false, error: "주사위 범위 안의 도착지를 선택하세요." };
  if (target.startsWith("r")) {
    actor.roomIndex = Number(target.slice(1));
    actor.cellId = null;
  } else {
    actor.roomIndex = -1;
    actor.cellId = target;
  }
  game.movePath = [...plan];
  game.stepsRemaining = 0;
  game.moved = true;
  game.turnPhase = "act";
  game.actionNumber += 1;
  game.lastMove = { playerId: actor.id, path: [...plan], seq: game.actionNumber };
  const destinationLabel = actor.roomIndex >= 0 ? ROOMS[actor.roomIndex] : "복도";
  game.log = `${actor.name}님이 ${destinationLabel}(으)로 이동을 마쳤습니다.`;
  return { ok: true, reveals: [] };

}

function stay(game, playerId) {
  if (game.phase !== "playing") return { ok: false, error: "진행 중인 게임이 없습니다." };
  if (game.pendingSuggestion) return { ok: false, error: "다른 플레이어의 반박을 기다리는 중입니다." };
  const actor = activePlayer(game);
  if (!actor || actor.id !== String(playerId)) return { ok: false, error: "현재 차례가 아닙니다." };
  if (game.turnPhase !== "move" || game.moved) return { ok: false, error: "지금은 사용할 수 없습니다." };
  game.stepsRemaining = 0;
  game.movePath = [];
  game.moved = true;
  game.turnPhase = "act";
  const label = actor.roomIndex >= 0 ? ROOMS[actor.roomIndex] : "복도";
  game.log = `${actor.name}님이 ${label}에 머물렀습니다.`;
  game.actionNumber += 1;
  return { ok: true, reveals: [] };
}

function secretPassage(game, playerId) {
  if (game.phase !== "playing") return { ok: false, error: "진행 중인 게임이 없습니다." };
  if (game.pendingSuggestion) return { ok: false, error: "다른 플레이어의 반박을 기다리는 중입니다." };
  const actor = activePlayer(game);
  if (!actor || actor.id !== String(playerId)) return { ok: false, error: "현재 차례가 아닙니다." };
  if (game.turnPhase !== "move" && game.turnPhase !== "act") return { ok: false, error: "지금은 비밀통로를 사용할 수 없습니다." };
  const target = actor.cellId && SECRET_PASSAGE_PAIRS[actor.cellId];
  if (cellOccupant(game, target, actor.id)) return { ok: false, error: "비밀통로 출구에 다른 플레이어가 있습니다." };
  if (!target) return { ok: false, error: "이 위치에는 비밀통로가 없습니다." };
  actor.cellId = target;
  actor.roomIndex = -1;
  game.stepsRemaining = 0;
  game.movePath = [];
  game.moved = true;
  game.turnPhase = "act";
  game.log = `${actor.name}님이 비밀통로로 이동했습니다.`;
  game.actionNumber += 1;
  return { ok: true, reveals: [] };
}

function checkNextRefuter(game) {
  const suggestion = game.pendingSuggestion;
  while (suggestion.checkPos < suggestion.checkOrder.length) {
    const candidateId = suggestion.checkOrder[suggestion.checkPos];
    const candidate = playerById(game, candidateId);
    const hand = game.hands[candidateId] || [];
    const matches = hand.filter(card => card === suggestion.suspect || card === suggestion.weapon || card === suggestion.room);
    if (matches.length > 0) {
      suggestion.refuterId = candidateId;
      suggestion.matchingCards = matches;
      suggestion.awaitingChoice = true;
      game.log = `${candidate.name}님이 반박할 카드를 고르는 중입니다.`;
      game.deadline = Date.now() + REFUTE_TIME_MS;
      return { reveals: [] };
    }
    suggestion.checkPos += 1;
  }
  game.log = "아무도 반박하지 못했습니다.";
  game.pendingSuggestion = null;
  game.deadline = Date.now() + TURN_TIME_MS;
  return { reveals: [] };
}

function suggest(game, playerId, suspect, weapon) {
  if (game.phase !== "playing") return { ok: false, error: "진행 중인 게임이 없습니다." };
  if (game.pendingSuggestion) return { ok: false, error: "다른 플레이어의 반박을 기다리는 중입니다." };
  const actor = activePlayer(game);
  if (!actor || actor.id !== String(playerId)) return { ok: false, error: "현재 차례가 아닙니다." };
  if (game.turnPhase !== "act" || game.suggestionUsed) return { ok: false, error: "지금은 추리를 발표할 수 없습니다." };
  if (actor.roomIndex < 0) return { ok: false, error: "방 안에서만 추리를 발표할 수 있습니다." };
  if (!Number.isInteger(suspect) || suspect < 0 || suspect > 5) return { ok: false, error: "용의자를 선택하세요." };
  if (!Number.isInteger(weapon) || weapon < 6 || weapon > 11) return { ok: false, error: "무기를 선택하세요." };

  const room = 12 + actor.roomIndex;

  const checkOrder = [];
  for (let offset = 1; offset < game.players.length; offset += 1) {
    const candidate = game.players[(game.turnIndex + offset) % game.players.length];
    if (candidate.id !== actor.id) checkOrder.push(candidate.id);
  }
  game.suggestionUsed = true;
  game.pendingSuggestion = {
    suggesterId: actor.id,
    suspect, weapon, room,
    checkOrder, checkPos: 0,
    refuterId: null, matchingCards: [], awaitingChoice: false
  };
  game.log = `${actor.name}님이 ${ROOMS[actor.roomIndex]}에서 ${SUSPECTS[suspect].name} · ${WEAPONS[weapon - 6]}을(를) 추리했습니다.`;
  game.actionNumber += 1;
  const result = checkNextRefuter(game);
  return { ok: true, reveals: result.reveals };
}

function chooseCard(game, playerId, card) {
  if (game.phase !== "playing" || !game.pendingSuggestion) return { ok: false, error: "지금은 카드를 고를 수 없습니다." };
  const suggestion = game.pendingSuggestion;
  if (!suggestion.awaitingChoice || suggestion.refuterId !== String(playerId)) return { ok: false, error: "지금은 카드를 고를 수 없습니다." };
  if (!suggestion.matchingCards.includes(card)) return { ok: false, error: "제시할 수 없는 카드입니다." };
  const refuter = playerById(game, playerId);
  const reveal = { playerId: suggestion.suggesterId, title: `${refuter.name}님의 반박`, message: `${refuter.name}님이 ${cardName(card)} 카드를 보여줍니다.`, card };
  game.log = `${refuter.name}님이 카드를 보여주며 반박했습니다.`;
  game.pendingSuggestion = null;
  game.deadline = Date.now() + TURN_TIME_MS;
  game.actionNumber += 1;
  return { ok: true, reveals: [reveal] };
}

function forceTimeout(game) {
  if (game.phase !== "playing" || !game.deadline || Date.now() < game.deadline) return { ok: false };
  if (game.pendingSuggestion && game.pendingSuggestion.awaitingChoice) {
    const suggestion = game.pendingSuggestion;
    const card = suggestion.matchingCards[0];
    const refuter = playerById(game, suggestion.refuterId);
    const reveal = { playerId: suggestion.suggesterId, title: `${refuter.name}님의 반박`, message: `${refuter.name}님이 ${cardName(card)} 카드를 보여줍니다.`, card };
    game.log = `시간 초과 · ${refuter.name}님이 자동으로 카드를 보여주며 반박했습니다.`;
    game.pendingSuggestion = null;
    game.deadline = Date.now() + TURN_TIME_MS;
    game.actionNumber += 1;
    return { ok: true, reveals: [reveal] };
  }
  const actor = activePlayer(game);
  if (actor) game.log = `${actor.name}님이 시간을 초과해 차례를 넘겼습니다.`;
  advanceTurn(game);
  game.actionNumber += 1;
  return { ok: true, reveals: [] };
}

function accuse(game, playerId, suspect, weapon, room) {
  if (game.phase !== "playing") return { ok: false, error: "진행 중인 게임이 없습니다." };
  if (game.pendingSuggestion) return { ok: false, error: "다른 플레이어의 반박을 기다리는 중입니다." };
  const actor = activePlayer(game);
  if (!actor || actor.id !== String(playerId)) return { ok: false, error: "현재 차례가 아닙니다." };
  if (game.turnPhase !== "act") return { ok: false, error: "지금은 고발할 수 없습니다." };
  if (actor.roomIndex !== CENTER_ROOM) return { ok: false, error: `최종 고발은 ${ROOMS[CENTER_ROOM]}에 있을 때만 할 수 있습니다.` };
  if (!Number.isInteger(suspect) || suspect < 0 || suspect > 5) return { ok: false, error: "용의자를 선택하세요." };
  if (!Number.isInteger(weapon) || weapon < 6 || weapon > 11) return { ok: false, error: "무기를 선택하세요." };
  if (!Number.isInteger(room) || room < 12 || room > 20) return { ok: false, error: "장소를 선택하세요." };

  const correct = suspect === game.solution.suspect && weapon === game.solution.weapon && room === game.solution.room;
  game.actionNumber += 1;
  if (correct) {
    game.phase = "gameEnd";
    game.winnerId = actor.id;
    game.solutionRevealed = true;
    game.log = `${actor.name}님이 도둑을 밝혀냈습니다! 범인은 ${SUSPECTS[game.solution.suspect].name} · ${WEAPONS[game.solution.weapon - 6]} · ${ROOMS[game.solution.room - 12]}였습니다.`;
    return { ok: true, reveals: [] };
  }
  actor.active = false;
  game.log = `${actor.name}님의 고발이 틀렸습니다. 더 이상 움직이거나 고발할 수 없지만 반박에는 계속 참여합니다.`;
  const stillActive = game.players.filter(player => player.active);
  if (!stillActive.length) {
    game.phase = "gameEnd";
    game.winnerId = null;
    game.solutionRevealed = true;
    game.log = `아무도 도둑을 밝히지 못해 미제 사건으로 남았습니다. 범인은 ${SUSPECTS[game.solution.suspect].name} · ${WEAPONS[game.solution.weapon - 6]} · ${ROOMS[game.solution.room - 12]}였습니다.`;
  } else {
    advanceTurn(game);
  }
  return { ok: true, reveals: [] };
}

function endTurn(game, playerId) {
  if (game.phase !== "playing") return { ok: false, error: "진행 중인 게임이 없습니다." };
  if (game.pendingSuggestion) return { ok: false, error: "다른 플레이어의 반박을 기다리는 중입니다." };
  const actor = activePlayer(game);
  if (!actor || actor.id !== String(playerId)) return { ok: false, error: "현재 차례가 아닙니다." };
  if (game.turnPhase !== "act") return { ok: false, error: "지금은 차례를 넘길 수 없습니다." };
  advanceTurn(game);
  game.log = `${actor.name}님이 차례를 마쳤습니다.`;
  game.actionNumber += 1;
  return { ok: true, reveals: [] };
}

function newGame(game) {
  if (game.phase !== "gameEnd") return { ok: false, error: "새 게임을 시작할 수 없습니다." };
  return startMatch(game);
}

function stateFor(game, viewerId) {
  const safeViewer = String(viewerId);
  const suggestion = game.pendingSuggestion;
  const turnPlayer = game.phase === "playing" ? activePlayer(game) : null;
  const canShowReachable = turnPlayer && turnPlayer.id === safeViewer && game.turnPhase === "move" && game.dice !== null && !game.moved && !suggestion;
  const reachable = canShowReachable ? reachablePositions(game, turnPlayer, game.stepsRemaining) : { rooms: [], cells: [] };
  return {
    phase: game.phase,
    hand: game.phase === "playing" || game.phase === "gameEnd" ? [...(game.hands[safeViewer] || [])] : [],
    players: game.players.map(player => ({
      id: player.id,
      name: player.name,
      avatarUrl: player.avatarUrl,
      roomIndex: player.roomIndex,
      cellId: player.cellId,
      active: player.active,
      handCount: (game.hands[player.id] || []).length
    })),
    turnPlayerId: turnPlayer?.id || null,
    turnPhase: game.turnPhase,
    dice: game.dice,
    diceValues: game.diceValues ? [...game.diceValues] : null,
    stepsRemaining: game.stepsRemaining,
    moved: game.moved,
    lastMove: game.lastMove ? { playerId: game.lastMove.playerId, path: [...game.lastMove.path], seq: game.lastMove.seq } : null,
    reachable,
    suggestionUsed: game.suggestionUsed,
    deadline: game.phase === "playing" ? game.deadline : null,
    now: Date.now(),
    pendingSuggestion: suggestion ? {
      suggesterId: suggestion.suggesterId,
      suspect: suggestion.suspect,
      weapon: suggestion.weapon,
      room: suggestion.room,
      refuterId: suggestion.refuterId,
      awaitingChoice: suggestion.awaitingChoice,
      myChoices: suggestion.awaitingChoice && suggestion.refuterId === safeViewer ? [...suggestion.matchingCards] : []
    } : null,
    solution: game.solutionRevealed ? game.solution : null,
    winnerId: game.winnerId,
    log: game.log,
    actionNumber: game.actionNumber
  };
}

module.exports = {
  SUSPECTS, WEAPONS, ROOMS, CENTER_ROOM,
  CORRIDOR_CELLS, CELL_COORDS, CELL_NEIGHBORS, CELL_ROOMS, ROOM_CELLS, SECRET_PASSAGE_PAIRS,
  START_ROOMS,
  MIN_PLAYERS, MAX_PLAYERS, TURN_TIME_MS, REFUTE_TIME_MS,
  createGame, addPlayer, removePlayer, resetToLobby,
  startMatch, roll, move, stay, secretPassage, suggest, chooseCard, accuse, endTurn, newGame,
  forceTimeout, reachablePositions, nextStepPositions,
  stateFor, shuffle, cardName, cardType
};
