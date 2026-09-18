"use strict";

const crypto = require("crypto");

// 공용 학급 순위전(quizrace). 교사가 보낸 문제 묶음으로 학생들이 각자 풀되,
// 채점은 서버가 한다. 답이 들어올 때마다 교사 화면(경기장)이 학생 아바타를 움직인다.
// 개인전과 모둠전(팀전)을 지원하고, 끝나면 반 전체가 많이 틀린 문제를 모아 준다.

const MAX_QUESTIONS = 60;
const TEAM_PALETTE = [
  { name: "빨강", color: "#e0523f" },
  { name: "파랑", color: "#2f7fd1" },
  { name: "초록", color: "#2f9e5b" },
  { name: "노랑", color: "#e3b021" },
  { name: "보라", color: "#8a5bd6" },
  { name: "주황", color: "#ee8a2f" },
  { name: "하늘", color: "#37b0d8" },
  { name: "분홍", color: "#e0679a" },
  { name: "연두", color: "#8cbf3f" },
  { name: "갈색", color: "#9a6a44" },
  { name: "남색", color: "#3b4fa8" },
  { name: "청록", color: "#1f9c95" },
  { name: "자주", color: "#a8407a" },
  { name: "회색", color: "#7d8691" },
  { name: "살구", color: "#e8a07a" }
];

function clean(value, maxLength = 40) {
  return String(value ?? "").trim().slice(0, maxLength);
}

function shuffle(items) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const other = Math.floor(Math.random() * (index + 1));
    [result[index], result[other]] = [result[other], result[index]];
  }
  return result;
}

function createGame() {
  return {
    phase: "lobby",
    sessionId: "",
    appId: "",
    appTitle: "",
    rangeTitle: "",
    mode: "solo",
    teamSize: 4,
    questions: [],
    startedAt: 0,
    endedAt: 0,
    players: [],
    teams: [],
    progress: {},
    results: {},
    eventSeq: 0
  };
}


// 서버를 다시 켜면 방 상태를 저장본(room-snapshots)에서 되살린다. 예전 모양으로 저장된 방도 돌아가게 빈 칸을 채운다.
function ensureShape(game) {
  const base = createGame();
  for (const key of Object.keys(base)) if (game[key] === undefined || game[key] === null) game[key] = base[key];
  game.players.forEach(player => { if (player.avatarKey === undefined) player.avatarKey = ""; if (player.left === undefined) player.left = false; });
  return game;
}

function cleanQuestion(raw) {
  if (!raw || typeof raw !== "object") return null;
  const id = clean(raw.id, 80);
  if (!/^[a-z0-9_:-]+$/i.test(id)) return null;
  const choices = Array.isArray(raw.choices)
    ? [...new Set(raw.choices.map(choice => clean(choice, 120)).filter(Boolean))]
    : [];
  const answer = clean(raw.answer, 120);
  if (choices.length < 2 || choices.length > 4 || !choices.includes(answer)) return null;
  const sentence = clean(raw.sentence, 400);
  if (!sentence) return null;
  return {
    id,
    category: clean(raw.category, 40),
    prompt: clean(raw.prompt, 120),
    sentence,
    choices,
    answer,
    explanation: clean(raw.explanation, 800)
  };
}

// 학생에게는 정답·해설을 빼고 보낸다. 맞히면 그때 서버가 알려 준다.
function publicQuestions(game) {
  return game.questions.map(question => ({
    id: question.id,
    category: question.category,
    prompt: question.prompt,
    sentence: question.sentence,
    choices: question.choices
  }));
}

function emptyProgress() {
  return { index: 0, score: 0, streak: 0, bestStreak: 0, wrongOnCurrent: false, firstChoices: {}, lastResult: "", lastSeq: 0 };
}

// ── 모둠 ─────────────────────────────────────────────
function teamCountFor(playerCount, teamSize) {
  return Math.max(2, Math.ceil(playerCount / Math.max(2, teamSize)));
}

function buildTeams(game) {
  const members = shuffle(game.players.filter(player => !player.left).map(player => player.id));
  const count = Math.min(TEAM_PALETTE.length, teamCountFor(members.length, game.teamSize));
  const teams = Array.from({ length: count }, (_, index) => ({
    id: `team-${index + 1}`,
    name: `${TEAM_PALETTE[index].name} 모둠`,
    color: TEAM_PALETTE[index].color,
    memberIds: []
  }));
  members.forEach((id, index) => teams[index % count].memberIds.push(id));
  game.teams = teams;
}

function teamOf(game, playerId) {
  return game.teams.find(team => team.memberIds.includes(playerId)) || null;
}

function addToSmallestTeam(game, playerId) {
  if (game.mode !== "team") return;
  if (!game.teams.length) { buildTeams(game); return; }
  if (teamOf(game, playerId)) return;
  const needed = teamCountFor(game.players.length, game.teamSize);
  if (game.teams.length < needed && game.teams.length < TEAM_PALETTE.length) {
    const index = game.teams.length;
    game.teams.push({ id: `team-${index + 1}`, name: `${TEAM_PALETTE[index].name} 모둠`, color: TEAM_PALETTE[index].color, memberIds: [playerId] });
    return;
  }
  const smallest = [...game.teams].sort((a, b) => a.memberIds.length - b.memberIds.length)[0];
  smallest.memberIds.push(playerId);
}

function removeFromTeams(game, playerId) {
  game.teams.forEach(team => { team.memberIds = team.memberIds.filter(id => id !== playerId); });
  game.teams = game.teams.filter(team => team.memberIds.length > 0);
}

// ── 참가·이탈 ────────────────────────────────────────
function addPlayer(game, playerId, name) {
  ensureShape(game);
  if (game.phase === "lobby") {
    game.players.push({ id: playerId, name, avatarKey: "", left: false });
    addToSmallestTeam(game, playerId);
    return { ok: true };
  }
  // 크롬북이 끊겼다가 같은 이름으로 다시 들어오면 하던 자리를 이어 준다. 끝난 뒤라면 결과를 다시 보여 준다.
  const previous = game.players.find(player => player.left && player.name === name);
  if (previous) {
    const oldId = previous.id;
    previous.id = playerId;
    previous.left = false;
    if (game.progress[oldId]) { game.progress[playerId] = game.progress[oldId]; delete game.progress[oldId]; }
    if (game.results[oldId]) { game.results[playerId] = game.results[oldId]; delete game.results[oldId]; }
    game.teams.forEach(team => { team.memberIds = team.memberIds.map(id => (id === oldId ? playerId : id)); });
    return { ok: true, resumed: true };
  }
  return { ok: false, error: "이미 시작한 학급 순위전입니다." };
}

function removePlayer(game, playerId) {
  ensureShape(game);
  if (game.phase === "lobby") {
    game.players = game.players.filter(player => player.id !== playerId);
    removeFromTeams(game, playerId);
    return;
  }
  const player = game.players.find(entry => entry.id === playerId);
  if (!player) return;
  // 나간 학생 때문에 경기가 저절로 끝나지는 않는다. 새로고침 한 번에 반 전체 경기가 끝나 버리면 안 된다.
  // 다시 들어오면 이어 풀고, 끝내 돌아오지 않으면 교사가 '경기 끝내기'를 누른다.
  player.left = true;
}

function activePlayers(game) {
  return game.players.filter(player => !player.left);
}

function maybeEnd(game) {
  if (game.phase !== "running") return;
  const active = activePlayers(game);
  if (active.length > 0 && active.every(player => game.results[player.id])) endRace(game);
}

function endRace(game) {
  game.phase = "ended";
  game.endedAt = Date.now();
}

// ── 순위 ─────────────────────────────────────────────
function elapsedFor(game, playerId) {
  if (game.results[playerId]) return game.results[playerId].elapsedMs;
  const end = game.endedAt || Date.now();
  return Math.max(0, end - game.startedAt);
}

function playerRankings(game) {
  const pool = game.phase === "ended"
    ? game.players
    : game.players.filter(player => game.results[player.id]);
  return pool
    .map(player => ({
      id: player.id,
      name: player.name,
      avatarKey: player.avatarKey,
      teamId: teamOf(game, player.id)?.id || "",
      score: game.progress[player.id]?.score || 0,
      finished: Boolean(game.results[player.id]),
      elapsedMs: elapsedFor(game, player.id)
    }))
    .sort((a, b) => b.score - a.score || Number(b.finished) - Number(a.finished) || a.elapsedMs - b.elapsedMs || a.name.localeCompare(b.name, "ko"))
    .map((entry, index) => ({ ...entry, rank: index + 1 }));
}

// 모둠 점수는 모둠원 정답 수의 평균이다. 인원이 다른 모둠끼리도 공정하게 견준다.
function teamSummaries(game) {
  return game.teams.map(team => {
    const members = team.memberIds.map(id => game.players.find(player => player.id === id)).filter(Boolean);
    const scores = members.map(player => game.progress[player.id]?.score || 0);
    const average = members.length ? scores.reduce((sum, value) => sum + value, 0) / members.length : 0;
    const finished = members.length > 0 && members.every(player => game.results[player.id] || player.left);
    const elapsed = members.length ? Math.max(...members.map(player => elapsedFor(game, player.id))) : 0;
    return {
      id: team.id,
      name: team.name,
      color: team.color,
      memberIds: team.memberIds,
      // 3.25와 3.33이 똑같이 3.3으로 보이면 순위가 억울해 보인다. 소수 둘째 자리까지 보여 준다.
      score: Math.round(average * 100) / 100,
      exact: average,
      finished,
      elapsedMs: elapsed
    };
  });
}

function teamRankings(game) {
  if (game.mode !== "team") return [];
  const summaries = teamSummaries(game);
  const pool = game.phase === "ended" ? summaries : summaries.filter(team => team.finished);
  return pool
    .sort((a, b) => b.exact - a.exact || a.elapsedMs - b.elapsedMs)
    .map(({ exact, ...team }, index) => ({ ...team, rank: index + 1 }));
}

// 반 전체가 가장 많이 틀린 문제: 첫 선택을 기준으로 보기마다 몇 명이 골랐는지 센다.
function mostMissed(game, limit = 3) {
  const rows = game.questions.map((question, index) => {
    const counts = Object.fromEntries(question.choices.map(choice => [choice, 0]));
    let answered = 0;
    for (const progress of Object.values(game.progress)) {
      const first = progress.firstChoices[index];
      if (first === undefined) continue;
      answered += 1;
      if (first in counts) counts[first] += 1;
    }
    const correct = counts[question.answer] || 0;
    return {
      index,
      prompt: question.prompt,
      sentence: question.sentence,
      choices: question.choices,
      answer: question.answer,
      explanation: question.explanation,
      counts,
      answered,
      missRate: answered ? 1 - correct / answered : 0
    };
  });
  return rows
    .filter(row => row.answered > 0 && row.missRate > 0)
    .sort((a, b) => b.missRate - a.missRate || b.answered - a.answered)
    .slice(0, limit);
}

// 한 학생의 오답노트: 처음 고른 답이 틀린 문제. 정답은 이미 맞혀서 본 문제만 싣는다(끝난 뒤엔 풀던 문제도).
function reviewFor(game, playerId) {
  const progress = game.progress[playerId];
  if (!progress) return [];
  const limit = game.phase === "ended" ? progress.index + 1 : progress.index;
  const rows = [];
  game.questions.forEach((question, index) => {
    const first = progress.firstChoices[index];
    if (index >= limit || first === undefined || first === question.answer) return;
    rows.push({ index, prompt: question.prompt, sentence: question.sentence, chosen: first, answer: question.answer, explanation: question.explanation });
  });
  return rows;
}

function reviewPayload(game, playerId) {
  ensureShape(game);
  return { type: "QUIZRACE_REVIEW", sessionId: game.sessionId, review: reviewFor(game, playerId) };
}

function publicState(game) {
  ensureShape(game);
  const summaries = teamSummaries(game).map(({ exact, ...team }) => team);
  return {
    phase: game.phase,
    sessionId: game.sessionId,
    appId: game.appId,
    appTitle: game.appTitle,
    rangeTitle: game.rangeTitle,
    mode: game.mode,
    teamSize: game.teamSize,
    questionCount: game.questions.length,
    startedAt: game.startedAt,
    endedAt: game.endedAt,
    serverNow: Date.now(),
    participants: game.players.map(player => {
      const progress = game.progress[player.id] || emptyProgress();
      return {
        id: player.id,
        name: player.name,
        avatarKey: player.avatarKey,
        teamId: teamOf(game, player.id)?.id || "",
        score: progress.score,
        answered: progress.index,
        streak: progress.streak,
        lastResult: progress.lastResult,
        lastSeq: progress.lastSeq,
        left: Boolean(player.left),
        status: game.results[player.id] ? "finished" : game.phase === "lobby" ? "waiting" : "playing",
        elapsedMs: game.results[player.id]?.elapsedMs ?? null
      };
    }),
    teams: summaries,
    rankings: playerRankings(game),
    teamRankings: teamRankings(game),
    missed: game.phase === "ended" ? mostMissed(game) : []
  };
}

// ── 요청 처리 ────────────────────────────────────────
// 돌려주는 값: { error } 또는 { broadcast, throttle, reply, sendQuestions }. throttle 은 답이 몰릴 때 알림을 묶어도 된다는 뜻.
function handleAction(game, { playerId, isHost, message, avatarExists }) {
  ensureShape(game);
  const action = clean(message.action, 30);
  const isPlayer = game.players.some(player => player.id === playerId && !player.left);

  if (action === "AVATAR") {
    const key = clean(message.avatarKey, 80);
    const player = game.players.find(entry => entry.id === playerId);
    if (!player || !/^[a-z0-9-]+\.webp$/i.test(key) || !avatarExists(key)) return {};
    if (player.avatarKey === key) return {};
    player.avatarKey = key;
    return { broadcast: true };
  }

  if (action === "MODE") {
    if (!isHost) return { error: "교사 화면에서만 경기 방식을 바꿀 수 있습니다." };
    if (game.phase !== "lobby") return { error: "경기 중에는 방식을 바꿀 수 없습니다." };
    game.mode = message.mode === "team" ? "team" : "solo";
    const size = Number(message.teamSize);
    game.teamSize = Number.isInteger(size) && size >= 2 && size <= 6 ? size : 4;
    if (game.mode === "team") buildTeams(game);
    else game.teams = [];
    return { broadcast: true };
  }

  if (action === "SHUFFLE_TEAMS") {
    if (!isHost) return { error: "교사 화면에서만 모둠을 섞을 수 있습니다." };
    if (game.phase !== "lobby" || game.mode !== "team") return { error: "모둠전 대기실에서만 모둠을 섞을 수 있습니다." };
    buildTeams(game);
    return { broadcast: true };
  }

  if (action === "START") {
    if (!isHost) return { error: "교사 화면에서만 순위전을 시작할 수 있습니다." };
    if (game.phase !== "lobby") return { error: "이미 순위전이 진행 중입니다." };
    if (game.players.length < 1) return { error: "학생이 한 명 이상 참가해야 합니다." };
    const rawQuestions = Array.isArray(message.questions) ? message.questions.slice(0, MAX_QUESTIONS) : [];
    const questions = [];
    const seenIds = new Set();
    for (const raw of rawQuestions) {
      const question = cleanQuestion(raw);
      if (!question || seenIds.has(question.id)) continue;
      seenIds.add(question.id);
      questions.push(question);
    }
    if (questions.length < 1 || questions.length !== rawQuestions.length) return { error: "문제 묶음이 올바르지 않습니다." };
    if (game.mode === "team" && game.players.length < 2) return { error: "모둠전은 학생이 두 명 이상 있어야 합니다." };
    game.phase = "running";
    game.sessionId = crypto.randomUUID();
    game.appId = clean(message.appId, 40);
    game.appTitle = clean(message.appTitle, 40);
    game.rangeTitle = clean(message.rangeTitle, 60);
    game.questions = questions;
    game.startedAt = Date.now();
    game.endedAt = 0;
    game.results = {};
    game.progress = Object.fromEntries(game.players.map(player => [player.id, emptyProgress()]));
    if (game.mode === "team") {
      // 대기실에서 모둠이 정해지지 않은 학생이 있으면 가장 작은 모둠에 넣는다.
      game.players.forEach(player => addToSmallestTeam(game, player.id));
    }
    return { broadcast: true, sendQuestions: true };
  }

  if (action === "ANSWER") {
    if (game.phase !== "running") return { error: "현재 진행 중인 순위전이 없습니다." };
    if (clean(message.sessionId, 80) !== game.sessionId) return { error: "현재 순위전의 답이 아닙니다." };
    if (!isPlayer) return { error: "참가 학생만 답할 수 있습니다." };
    const progress = game.progress[playerId] || (game.progress[playerId] = emptyProgress());
    const index = Number(message.index);
    if (index !== progress.index) return { reply: { type: "QUIZRACE_ANSWER", index, stale: true, currentIndex: progress.index } };
    const question = game.questions[index];
    if (!question) return { error: "이미 모든 문제를 풀었습니다." };
    const choice = clean(message.choice, 120);
    if (!question.choices.includes(choice)) return { error: "보기에 없는 답입니다." };
    if (progress.firstChoices[index] === undefined) progress.firstChoices[index] = choice;
    game.eventSeq += 1;
    progress.lastSeq = game.eventSeq;

    if (choice !== question.answer) {
      progress.wrongOnCurrent = true;
      progress.streak = 0;
      progress.lastResult = "wrong";
      return { broadcast: true, throttle: true, reply: { type: "QUIZRACE_ANSWER", index, correct: false } };
    }

    const firstTry = !progress.wrongOnCurrent;
    if (firstTry) {
      progress.score += 1;
      progress.streak += 1;
      progress.bestStreak = Math.max(progress.bestStreak, progress.streak);
    }
    progress.lastResult = firstTry ? "correct" : "late";
    progress.wrongOnCurrent = false;
    progress.index += 1;
    if (progress.index >= game.questions.length && !game.results[playerId]) {
      game.results[playerId] = { score: progress.score, elapsedMs: Math.max(0, Date.now() - game.startedAt) };
      maybeEnd(game);
    }
    return {
      broadcast: true,
      throttle: true,
      reply: {
        type: "QUIZRACE_ANSWER",
        index,
        correct: true,
        firstTry,
        answer: question.answer,
        explanation: question.explanation,
        score: progress.score,
        streak: progress.streak,
        finished: progress.index >= game.questions.length,
        ...(progress.index >= game.questions.length ? { review: reviewFor(game, playerId) } : {})
      }
    };
  }

  if (action === "END") {
    if (!isHost) return { error: "교사 화면에서만 경기를 끝낼 수 있습니다." };
    if (game.phase !== "running") return { error: "진행 중인 경기가 없습니다." };
    endRace(game);
    return { broadcast: true, sendReviews: true };
  }

  if (action === "RESET") {
    if (!isHost) return { error: "교사 화면에서만 새 순위전을 준비할 수 있습니다." };
    game.phase = "lobby";
    game.sessionId = "";
    game.appId = "";
    game.appTitle = "";
    game.rangeTitle = "";
    game.questions = [];
    game.startedAt = 0;
    game.endedAt = 0;
    game.results = {};
    game.progress = {};
    game.players = game.players.filter(player => !player.left);
    if (game.mode === "team") {
      game.teams.forEach(team => { team.memberIds = team.memberIds.filter(id => game.players.some(player => player.id === id)); });
      game.teams = game.teams.filter(team => team.memberIds.length > 0);
      game.players.forEach(player => addToSmallestTeam(game, player.id));
    }
    return { broadcast: true };
  }

  return { error: "알 수 없는 학급 순위전 요청입니다." };
}

// 다시 들어온 학생에게 보낼 문제와 이어 풀 자리
function questionsPayload(game, playerId) {
  ensureShape(game);
  const progress = game.progress[playerId] || emptyProgress();
  return {
    type: "QUIZRACE_QUESTIONS",
    sessionId: game.sessionId,
    questions: publicQuestions(game),
    resumeIndex: progress.index,
    score: progress.score,
    review: reviewFor(game, playerId)
  };
}

module.exports = {
  MAX_QUESTIONS,
  createGame,
  addPlayer,
  removePlayer,
  handleAction,
  publicState,
  questionsPayload,
  reviewPayload
};
