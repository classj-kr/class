"use strict";

const PACKS = Object.freeze({
  general: Object.freeze({
    label: "생활·사물",
    words: Object.freeze([
      "우산", "자전거", "사과", "바나나", "고양이", "강아지", "토끼", "컵케이크",
      "안경", "책가방", "연필", "시계", "모자", "장화", "치약", "눈사람"
    ])
  }),
  history: Object.freeze({
    label: "옛날·전통",
    words: Object.freeze([
      "왕", "공주", "갓", "한복", "부채", "탈", "북", "연",
      "도자기", "기와집", "초가집", "금관", "태극기", "활", "방패", "무궁화"
    ])
  }),
  science: Object.freeze({
    label: "과학·자연",
    words: Object.freeze([
      "화산", "공룡", "번개", "무지개", "로켓", "자석", "달", "별",
      "태양", "나비", "북극곰", "눈송이", "꽃", "나무", "구름", "물고기"
    ])
  }),
  society: Object.freeze({
    label: "동네·교통",
    words: Object.freeze([
      "버스", "기차", "비행기", "배", "헬리콥터", "소방차", "경찰차", "우체통",
      "신호등", "횡단보도", "학교", "놀이터", "아파트", "다리", "등대", "병원"
    ])
  })
});

const DRAW_SECONDS = 60;
const GUESS_SECONDS = 30;
const MAX_PLAYERS = 8;
const MIN_PLAYERS = 4;
const CANVAS_WIDTH = 1000;
const CANVAS_HEIGHT = 700;
const MAX_STROKES = 240;
const MAX_POINTS = 12000;
const COLORS = new Set(["#172033", "#ef476f", "#ff9f1c", "#ffd166", "#2ec4b6", "#3a86ff", "#8338ec"]);

function cleanName(value, fallback = "플레이어") {
  return String(value || "").trim().slice(0, 12) || fallback;
}

function cleanPack(value) {
  const key = String(value || "general");
  return Object.prototype.hasOwnProperty.call(PACKS, key) ? key : "general";
}

function createGame(hostId, hostName) {
  return {
    phase: "lobby",
    players: [{ id: String(hostId), name: cleanName(hostName, "방장") }],
    packId: "general",
    step: 0,
    actionType: null,
    deadline: 0,
    chains: [],
    pending: {},
    lastAction: "4~8명이 모이면 그림 릴레이를 시작할 수 있습니다.",
    revision: 0
  };
}

function addPlayer(game, playerId, playerName) {
  if (game.phase !== "lobby") return { ok: false, error: "이미 시작한 게임입니다." };
  if (game.players.length >= MAX_PLAYERS) return { ok: false, error: "그림 릴레이는 최대 8명까지 참여할 수 있습니다." };
  const id = String(playerId);
  if (game.players.some(player => player.id === id)) return { ok: true };
  game.players.push({ id, name: cleanName(playerName, `플레이어 ${game.players.length + 1}`) });
  game.revision += 1;
  return { ok: true };
}

function removePlayer(game, playerId) {
  const id = String(playerId);
  game.players = game.players.filter(player => player.id !== id);
  delete game.pending[id];
  game.revision += 1;
}

function resetToLobby(game, message = "대기실로 돌아왔습니다.") {
  game.phase = "lobby";
  game.step = 0;
  game.actionType = null;
  game.deadline = 0;
  game.chains = [];
  game.pending = {};
  game.lastAction = message;
  game.revision += 1;
  return { ok: true };
}

function shuffledWords(packId, count, random = Math.random) {
  const words = [...PACKS[cleanPack(packId)].words];
  for (let index = words.length - 1; index > 0; index -= 1) {
    const pick = Math.max(0, Math.min(index, Math.floor(Number(random()) * (index + 1))));
    [words[index], words[pick]] = [words[pick], words[index]];
  }
  return words.slice(0, count);
}

function nextDeadline(actionType, now = Date.now()) {
  return Number(now) + (actionType === "draw" ? DRAW_SECONDS : GUESS_SECONDS) * 1000;
}

function startGame(game, packId = "general", random = Math.random, now = Date.now()) {
  if (game.phase !== "lobby") return { ok: false, error: "이미 시작한 게임입니다." };
  if (game.players.length < MIN_PLAYERS || game.players.length > MAX_PLAYERS) {
    return { ok: false, error: "그림 릴레이는 4명부터 8명까지 시작할 수 있습니다." };
  }
  game.packId = cleanPack(packId);
  const words = shuffledWords(game.packId, game.players.length, random);
  game.chains = game.players.map((player, index) => ({
    id: `chain-${index + 1}`,
    ownerId: player.id,
    entries: [{ type: "word", authorId: null, text: words[index] }]
  }));
  game.phase = "playing";
  game.step = 0;
  game.actionType = "draw";
  game.deadline = nextDeadline(game.actionType, now);
  game.pending = {};
  game.lastAction = `${PACKS[game.packId].label} 주제로 첫 그림을 그리고 있습니다.`;
  game.revision += 1;
  return { ok: true };
}

function playerIndex(game, playerId) {
  return game.players.findIndex(player => player.id === String(playerId));
}

function assignedChainIndex(game, playerId, step = game.step) {
  const index = playerIndex(game, playerId);
  if (index < 0 || game.players.length === 0) return -1;
  return (index - Number(step) + game.players.length) % game.players.length;
}

function sanitizePoint(point) {
  if (!Array.isArray(point) || point.length < 2) return null;
  const x = Number(point[0]);
  const y = Number(point[1]);
  if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
  return [
    Math.max(0, Math.min(CANVAS_WIDTH, Math.round(x))),
    Math.max(0, Math.min(CANVAS_HEIGHT, Math.round(y)))
  ];
}

function sanitizeDrawing(value) {
  if (!Array.isArray(value)) return { ok: false, error: "그림 데이터가 올바르지 않습니다." };
  const strokes = [];
  let pointCount = 0;
  for (const rawStroke of value.slice(0, MAX_STROKES)) {
    const rawPoints = Array.isArray(rawStroke?.points) ? rawStroke.points : [];
    const points = [];
    for (const rawPoint of rawPoints) {
      if (pointCount >= MAX_POINTS) break;
      const point = sanitizePoint(rawPoint);
      if (!point) continue;
      points.push(point);
      pointCount += 1;
    }
    if (!points.length) continue;
    const color = COLORS.has(String(rawStroke?.color)) ? String(rawStroke.color) : "#172033";
    const width = Math.max(2, Math.min(24, Math.round(Number(rawStroke?.width) || 6)));
    strokes.push({ color, width, points });
    if (pointCount >= MAX_POINTS) break;
  }
  return { ok: true, strokes };
}

function cleanGuess(value) {
  return String(value || "").replace(/\s+/g, " ").trim().slice(0, 40);
}

function submit(game, playerId, submission, now = Date.now()) {
  const id = String(playerId);
  if (game.phase !== "playing") return { ok: false, error: "진행 중인 릴레이가 아닙니다." };
  if (playerIndex(game, id) < 0) return { ok: false, error: "참가자가 아닙니다." };
  if (game.pending[id]) return { ok: false, error: "이미 이번 차례를 제출했습니다." };

  let entry;
  if (game.actionType === "draw") {
    const drawing = sanitizeDrawing(submission?.strokes);
    if (!drawing.ok) return drawing;
    entry = { type: "drawing", authorId: id, strokes: drawing.strokes };
  } else if (game.actionType === "guess") {
    const text = cleanGuess(submission?.text) || "시간 초과";
    entry = { type: "guess", authorId: id, text };
  } else {
    return { ok: false, error: "현재 제출 종류를 확인할 수 없습니다." };
  }

  game.pending[id] = entry;
  game.lastAction = `${Object.keys(game.pending).length}/${game.players.length}명 제출 완료`;
  game.revision += 1;

  if (Object.keys(game.pending).length === game.players.length) advanceStep(game, now);
  return { ok: true };
}

function advanceStep(game, now = Date.now()) {
  const completedStep = game.step;
  for (const player of game.players) {
    const chainIndex = assignedChainIndex(game, player.id, completedStep);
    const entry = game.pending[player.id];
    if (chainIndex >= 0 && entry) game.chains[chainIndex].entries.push(entry);
  }
  game.pending = {};
  game.step += 1;
  if (game.step >= game.players.length) {
    game.phase = "reveal";
    game.actionType = null;
    game.deadline = 0;
    game.lastAction = "모든 릴레이가 완성되었습니다. 처음부터 결과를 공개해 보세요!";
  } else {
    game.actionType = game.step % 2 === 0 ? "draw" : "guess";
    game.deadline = nextDeadline(game.actionType, now);
    game.lastAction = game.actionType === "draw" ? "앞사람의 추측을 그림으로 그리고 있습니다." : "앞사람의 그림을 추측하고 있습니다.";
  }
  game.revision += 1;
}

function cloneEntry(entry, playersById) {
  const base = {
    type: entry.type,
    authorId: entry.authorId,
    authorName: entry.authorId ? playersById.get(entry.authorId)?.name || "플레이어" : "제시어"
  };
  if (entry.type === "drawing") {
    return { ...base, strokes: entry.strokes.map(stroke => ({ ...stroke, points: stroke.points.map(point => [...point]) })) };
  }
  return { ...base, text: entry.text };
}

function stateFor(game, viewerId) {
  const id = String(viewerId);
  const playersById = new Map(game.players.map(player => [player.id, player]));
  const submittedIds = new Set(Object.keys(game.pending));
  const players = game.players.map(player => ({
    id: player.id,
    name: player.name,
    submitted: submittedIds.has(player.id)
  }));
  let prompt = null;
  if (game.phase === "playing") {
    const chainIndex = assignedChainIndex(game, id);
    const chain = game.chains[chainIndex];
    const lastEntry = chain?.entries.at(-1);
    if (lastEntry) {
      const cloned = cloneEntry(lastEntry, playersById);
      delete cloned.authorId;
      delete cloned.authorName;
      prompt = cloned;
    }
  }
  const revealChains = game.phase === "reveal"
    ? game.chains.map(chain => ({
        id: chain.id,
        ownerId: chain.ownerId,
        ownerName: playersById.get(chain.ownerId)?.name || "플레이어",
        entries: chain.entries.map(entry => cloneEntry(entry, playersById))
      }))
    : [];
  return {
    phase: game.phase,
    players,
    packId: game.packId,
    packLabel: PACKS[game.packId]?.label || PACKS.general.label,
    step: game.step,
    totalSteps: game.players.length,
    actionType: game.actionType,
    deadline: game.deadline,
    prompt,
    mySubmitted: submittedIds.has(id),
    submittedCount: submittedIds.size,
    chains: revealChains,
    lastAction: game.lastAction,
    revision: game.revision
  };
}

module.exports = {
  PACKS,
  DRAW_SECONDS,
  GUESS_SECONDS,
  MIN_PLAYERS,
  MAX_PLAYERS,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  createGame,
  addPlayer,
  removePlayer,
  resetToLobby,
  startGame,
  assignedChainIndex,
  sanitizeDrawing,
  cleanGuess,
  submit,
  stateFor
};
