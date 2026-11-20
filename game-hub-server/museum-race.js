"use strict";

// 미술관 전시실 순위전. 같은 학교에서 같은 전시실에 있는 사람끼리 겨룬다(학년·반은 따지지 않는다).
// 문제와 정답은 서버만 안다. 판이 끝나면 그 전시실에 시상대를 잠깐 세웠다가 치운다.
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const TEAMS = [
  ["빨강팀", "#ff808e"], ["파랑팀", "#79b8ff"], ["노랑팀", "#ffe281"], ["초록팀", "#81f1a2"],
  ["보라팀", "#c7a3ff"], ["주황팀", "#ffb179"], ["분홍팀", "#ff9dd6"], ["하늘팀", "#80eaf5"]
];
const TEAM_SIZES = [1, 2, 3, 4];
const MAX_PLAYERS = 40;

// 게시판 순위전과 같은 셈법: 맞히면 100점, 빨리 맞힐수록 최대 20점, 세 번 연달아 맞힐 때마다 60점.
function scoreAnswer(correct, streak, elapsed, duration) {
  if (!correct) return { points: 0, streak: 0, boost: false };
  const next = streak + 1;
  const boost = next % 3 === 0;
  return { points: 100 + Math.round(20 * Math.max(0, 1 - elapsed / duration)) + (boost ? 60 : 0), streak: next, boost };
}

function loadMuseumContent(dir = path.join(__dirname, "..", "learning", "arts", "art-appreciation", "museum")) {
  const context = { window: {} };
  context.globalThis = context.window;
  vm.runInNewContext(fs.readFileSync(path.join(dir, "art-data.js"), "utf8"), context);
  vm.runInNewContext(fs.readFileSync(path.join(dir, "quiz-data.js"), "utf8"), context);
  return { rooms: context.window.MUSEUM_ROOMS, quiz: context.window.MUSEUM_QUIZ };
}

function shuffle(items, random = Math.random) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// 그 방의 관찰 문제를 모두 내고, 그림이 나오는 제목·작가 문제는 맨 뒤에 둔다.
// 그림을 먼저 보여 주면 같은 그림을 묻는 관찰 문제의 답이 드러나기 때문이다.
function buildRaceQuestions({ rooms, quiz }, roomId, random = Math.random) {
  const room = rooms.find(r => r.id === roomId);
  const bank = quiz.ROOM_QUIZZES[roomId];
  if (!room || !bank) return [];
  const mix = items => shuffle(items, random);
  const observations = mix(bank.questions).map(q => ({ kind: "observation", q: q.q, options: q.options, answer: q.answer, explain: q.explain }));
  const titleWork = mix(room.works.filter(w => quiz.TITLE_DECOYS[w.id]?.length >= 3))[0];
  const artistWork = mix(room.works.filter(w => w !== titleWork && quiz.ARTIST_GROUPS.some(g => g.includes(w.artist))))[0];
  const images = [];
  if (titleWork) images.push(quiz.imageQuestion("title", titleWork, mix));
  if (artistWork) images.push(quiz.imageQuestion("artist", artistWork, mix));
  return [...observations, ...images].map(item => {
    const choices = mix(item.options.map((label, index) => ({ label, correct: index === item.answer })));
    return { kind: item.kind, q: item.q, options: choices.map(c => c.label), answer: choices.findIndex(c => c.correct),
      explain: item.explain, ...(item.image ? { image: item.image } : {}) };
  });
}

function createMuseumRace({ send, content = loadMuseumContent(), now = Date.now, random = Math.random,
  setTimer = (fn, ms) => { const t = setTimeout(fn, ms); t.unref?.(); return t; }, clearTimer = clearTimeout,
  questionMs = 20000, readyMs = 2500, revealMs = 4500, podiumMs = 40000 }) {
  const races = new Map();
  const roomIds = new Set(content.rooms.map(r => r.id));
  const keyOf = (schoolKey, roomId) => `${schoolKey}|${roomId}`;
  let sockets = () => [];

  function standings(race) {
    return [...race.players.values()].sort((a, b) => b.score - a.score || a.joinedAt - b.joinedAt)
      .map(p => ({ userId: p.userId, name: p.name, avatarKey: p.avatarKey, score: p.score, team: p.team, correct: p.correctCount }));
  }
  // 팀 점수는 팀원 점수의 평균이라 인원이 한 명 차이 나도 공평하다.
  function teamStandings(race) {
    if (race.teamSize <= 1) return null;
    const teams = new Map();
    for (const p of race.players.values()) {
      const team = teams.get(p.team) || { index: p.team, name: TEAMS[p.team][0], color: TEAMS[p.team][1], members: [], total: 0 };
      team.members.push(p.userId); team.total += p.score; teams.set(p.team, team);
    }
    return [...teams.values()].map(({ total, ...t }) => ({ ...t, score: Math.round(total / t.members.length) }))
      .sort((a, b) => b.score - a.score || a.index - b.index);
  }
  function assignTeams(race) {
    const players = shuffle([...race.players.values()], random);
    if (race.teamSize <= 1) { players.forEach(p => { p.team = null; }); return; }
    const count = Math.min(TEAMS.length, Math.max(2, Math.ceil(players.length / race.teamSize)));
    players.forEach((p, i) => { p.team = i % count; });
  }

  function project(race, userId) {
    const time = now();
    const player = race.players.get(userId);
    const base = {
      roomId: race.roomId, phase: race.phase, hostId: race.hostId, teamSize: race.teamSize, joined: !!player,
      players: [...race.players.values()].map(p => ({ userId: p.userId, name: p.name, avatarKey: p.avatarKey, team: p.team })),
      teams: TEAMS.map(([name, color]) => ({ name, color }))
    };
    if (race.phase === "lobby") return base;
    if (race.phase === "podium") {
      return { ...base, remainingMs: Math.max(0, race.podiumUntil - time), standings: race.final.standings, teamStandings: race.final.teams,
        ...(player ? { me: { score: player.score, correct: player.correctCount } } : {}), total: race.questions.length };
    }
    const q = race.questions[race.index];
    const out = { ...base, index: race.index, total: race.questions.length, remainingMs: Math.max(0, race.phaseEndsAt - time),
      questionMs, answered: race.answers.size, playerCount: race.players.size };
    if (!player) return out;
    const answer = race.answers.get(userId);
    out.me = { score: player.score, streak: player.streak, choice: answer ? answer.choice : null };
    if (race.phase === "question" || race.phase === "reveal") out.question = { kind: q.kind, q: q.q, options: q.options, ...(q.image ? { image: q.image } : {}) };
    if (race.phase === "reveal") {
      Object.assign(out.question, { answer: q.answer, explain: q.explain });
      Object.assign(out.me, { correct: player.lastCorrect, gain: player.lastGain, boost: player.lastBoost });
      out.standings = standings(race);
      out.teamStandings = teamStandings(race);
    }
    return out;
  }

  // 그 전시실에 있는 사람과 참가자 모두에게 각자 볼 것만 보낸다.
  function broadcast(race) {
    for (const { socket, visitor } of sockets(race.schoolKey)) {
      if (visitor.room === race.roomId || race.players.has(visitor.userId)) {
        send(socket, { type: "MUSEUM_RACE", roomId: race.roomId, race: race.closed ? null : project(race, visitor.userId) });
      }
    }
  }
  function close(race) {
    clearTimer(race.timer);
    race.closed = true;
    races.delete(race.key);
    broadcast(race);
  }
  function schedule(race, ms, fn) {
    clearTimer(race.timer);
    race.phaseEndsAt = now() + ms;
    race.timer = setTimer(fn, ms);
  }
  function startQuestion(race) {
    race.phase = "ready";
    race.answers = new Map();
    schedule(race, readyMs, () => {
      race.phase = "question";
      race.questionStartedAt = now();
      schedule(race, questionMs, () => reveal(race));
      broadcast(race);
    });
    broadcast(race);
  }
  function reveal(race) {
    if (race.phase !== "question") return;
    const q = race.questions[race.index];
    for (const p of race.players.values()) {
      const answer = race.answers.get(p.userId);
      const correct = !!answer && answer.choice === q.answer;
      const scored = scoreAnswer(correct, p.streak, answer ? answer.at - race.questionStartedAt : questionMs, questionMs);
      p.score += scored.points; p.streak = scored.streak; p.correctCount += correct ? 1 : 0;
      p.lastCorrect = correct; p.lastGain = scored.points; p.lastBoost = scored.boost;
    }
    race.phase = "reveal";
    schedule(race, revealMs, () => {
      race.index++;
      if (race.index >= race.questions.length) finish(race);
      else startQuestion(race);
    });
    broadcast(race);
  }
  function finish(race) {
    race.phase = "podium";
    race.final = { standings: standings(race), teams: teamStandings(race) };
    race.podiumUntil = now() + podiumMs;
    schedule(race, podiumMs, () => close(race));
    broadcast(race);
  }

  function removePlayer(race, userId) {
    if (!race.players.delete(userId)) return;
    if (race.phase === "podium") return;
    if (!race.players.size) { close(race); return; }
    if (race.hostId === userId) race.hostId = [...race.players.values()].sort((a, b) => a.joinedAt - b.joinedAt)[0].userId;
    race.answers?.delete(userId);
    if (race.phase === "question" && race.answers.size >= race.players.size) { reveal(race); return; }
    broadcast(race);
  }
  function raceOf(visitor) {
    return visitor && races.get(keyOf(visitor.schoolKey, visitor.room));
  }
  function playerRace(visitor) {
    for (const race of races.values()) if (race.schoolKey === visitor.schoolKey && race.players.has(visitor.userId)) return race;
    return null;
  }

  function handle(socket, visitor, message) {
    const type = String(message.type || "");
    if (!type.startsWith("MUSEUM_RACE_")) return false;
    if (!visitor || !roomIds.has(visitor.room)) return true;
    if (type === "MUSEUM_RACE_OPEN") {
      const other = playerRace(visitor);
      if (other && other.roomId !== visitor.room) removePlayer(other, visitor.userId);
      let race = raceOf(visitor);
      if (race && race.phase === "podium") { close(race); race = null; }
      if (!race) {
        race = { key: keyOf(visitor.schoolKey, visitor.room), schoolKey: visitor.schoolKey, roomId: visitor.room, phase: "lobby",
          hostId: visitor.userId, teamSize: 1, players: new Map(), questions: [], index: -1, answers: new Map(), seq: 0 };
        races.set(race.key, race);
      }
      if (race.phase !== "lobby") { send(socket, { type: "MUSEUM_RACE", roomId: race.roomId, race: project(race, visitor.userId) }); return true; }
      if (!race.players.has(visitor.userId) && race.players.size < MAX_PLAYERS) {
        race.players.set(visitor.userId, { userId: visitor.userId, name: visitor.name, avatarKey: visitor.avatarKey, joinedAt: race.seq++,
          team: null, score: 0, streak: 0, correctCount: 0 });
      }
      broadcast(race);
      return true;
    }
    const race = playerRace(visitor);
    if (!race) return true;
    if (type === "MUSEUM_RACE_LEAVE") { removePlayer(race, visitor.userId); return true; }
    if (type === "MUSEUM_RACE_TEAM" && race.phase === "lobby" && race.hostId === visitor.userId) {
      const size = Number(message.size);
      if (TEAM_SIZES.includes(size)) { race.teamSize = size; broadcast(race); }
      return true;
    }
    if (type === "MUSEUM_RACE_START" && race.phase === "lobby" && race.hostId === visitor.userId && race.players.size >= 2) {
      race.questions = buildRaceQuestions(content, race.roomId, random);
      if (!race.questions.length) return true;
      assignTeams(race);
      race.index = 0;
      startQuestion(race);
      return true;
    }
    if (type === "MUSEUM_RACE_ANSWER" && race.phase === "question" && Number(message.index) === race.index && !race.answers.has(visitor.userId)) {
      const choice = Number(message.choice);
      if (!Number.isInteger(choice) || choice < 0 || choice >= race.questions[race.index].options.length) return true;
      race.answers.set(visitor.userId, { choice, at: now() });
      if (race.answers.size >= race.players.size) reveal(race);
      else broadcast(race);
      return true;
    }
    return true;
  }

  // 방을 옮기면 그 방 판은 그만두고, 새 방의 판(대기실이나 시상대)을 보여 준다.
  function moved(socket, visitor, previousRoom) {
    const mine = playerRace(visitor);
    if (mine && mine.roomId !== visitor.room) removePlayer(mine, visitor.userId);
    const old = races.get(keyOf(visitor.schoolKey, previousRoom));
    if (old && !old.players.has(visitor.userId)) send(socket, { type: "MUSEUM_RACE", roomId: previousRoom, race: null });
    const here = raceOf(visitor);
    send(socket, { type: "MUSEUM_RACE", roomId: visitor.room, race: here ? project(here, visitor.userId) : null });
  }
  function left(visitor) {
    const race = visitor && playerRace(visitor);
    if (race) removePlayer(race, visitor.userId);
  }
  return { handle, moved, left, joined: moved, attach(fn) { sockets = fn; }, races };
}

module.exports = { createMuseumRace, buildRaceQuestions, loadMuseumContent, scoreAnswer, TEAMS };
