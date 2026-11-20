"use strict";

// 미술관 전시실 순위전 「작품 찾아 달리기」. 같은 학교에서 같은 전시실에 있는 사람끼리 겨룬다(학년·반은 따지지 않는다).
// 단서(그림에 보이는 것)가 나오면 전시실을 달려 그 작품 앞에서 누른다. 서버가 그 사람이 정말 그 그림 앞에 서 있는지 확인한다.
// 판이 끝나면 그 전시실에 시상대를 잠깐 세웠다가 치운다.
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const TEAMS = [
  ["빨강팀", "#ff808e"], ["파랑팀", "#79b8ff"], ["노랑팀", "#ffe281"], ["초록팀", "#81f1a2"],
  ["보라팀", "#c7a3ff"], ["주황팀", "#ffb179"], ["분홍팀", "#ff9dd6"], ["하늘팀", "#80eaf5"]
];
const MAX_PLAYERS = 40;
const ORDER_BONUS = [60, 40, 20];
// 다른 순위전과 같은 제한시간(초). 시간이 다 되거나 그 방 작품을 다 찾으면 끝난다.
const DURATIONS = [60, 90, 120, 180];
const DEFAULT_DURATION = 90;

// 작품 자리: museum.js addFramedWork 와 같은 규칙(짝수째 왼쪽 벽, 홀수째 오른쪽 벽, 5.15 간격).
function workSlot(room, workId) {
  const index = room.works.findIndex(w => w.id === workId);
  if (index < 0) return null;
  return { side: index % 2 === 0 ? -1 : 1, z: 1 - Math.floor(index / 2) * 5.15 };
}
// 그 그림이 걸린 쪽 벽 가까이, 그림 앞뒤 한 칸 안에 서 있어야 한다.
function standsAt(visitor, slot) {
  return Number.isFinite(visitor?.x) && Number.isFinite(visitor?.z) && visitor.x * slot.side > 1 && Math.abs(visitor.z - slot.z) < 2.8;
}
// 빨리 찾을수록, 먼저 찾을수록 점수가 크다.
function huntPoints(order, elapsed, duration) {
  return 100 + (ORDER_BONUS[order - 1] || 0) + Math.round(20 * Math.max(0, 1 - elapsed / duration));
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

// 그 방 작품을 모두 한 번씩 찾는다.
function buildRounds({ rooms, quiz }, roomId, random = Math.random) {
  const room = rooms.find(r => r.id === roomId);
  if (!room) return [];
  return shuffle(room.works.filter(w => quiz.HUNT_CLUES?.[w.id]), random)
    .map(w => ({ workId: w.id, clue: quiz.HUNT_CLUES[w.id], title: w.title, artist: w.artist }));
}

function createMuseumRace({ send, content = loadMuseumContent(), now = Date.now, random = Math.random,
  setTimer = (fn, ms) => { const t = setTimeout(fn, ms); t.unref?.(); return t; }, clearTimer = clearTimeout,
  huntMs = 35000, readyMs = 3000, revealMs = 4000, podiumMs = 40000, freezeMs = 2500 }) {
  const races = new Map();
  const roomById = new Map(content.rooms.map(r => [r.id, r]));
  const keyOf = (schoolKey, roomId) => `${schoolKey}|${roomId}`;
  let sockets = () => [];

  function standings(race) {
    return [...race.players.values()].sort((a, b) => b.score - a.score || a.joinedAt - b.joinedAt)
      .map(p => ({ userId: p.userId, name: p.name, avatarKey: p.avatarKey, score: p.score, team: p.team, correct: p.correctCount }));
  }
  // 팀 점수는 팀원 점수의 평균이라 인원이 한 명 차이 나도 공평하다.
  function teamStandings(race) {
    if (!race.teamCount) return null;
    const teams = new Map();
    for (const p of race.players.values()) {
      const team = teams.get(p.team) || { index: p.team, name: TEAMS[p.team][0], color: TEAMS[p.team][1], members: [], total: 0 };
      team.members.push(p.userId); team.total += p.score; teams.set(p.team, team);
    }
    return [...teams.values()].map(({ total, ...t }) => ({ ...t, score: Math.round(total / t.members.length) }))
      .sort((a, b) => b.score - a.score || a.index - b.index);
  }
  // 팀 인원은 정하지 않는다. 각자 고른 팀에 들어가고(1명 대 10명도 된다), 아직 안 고른 사람만 가장 적은 팀에 넣는다.
  function smallestTeam(race) {
    const sizes = Array.from({ length: race.teamCount }, (_, i) => [...race.players.values()].filter(p => p.team === i).length);
    return sizes.indexOf(Math.min(...sizes));
  }
  function placeUnteamed(race) {
    for (const p of race.players.values()) {
      if (!race.teamCount) p.team = null;
      else if (!Number.isInteger(p.team) || p.team >= race.teamCount) p.team = smallestTeam(race);
    }
  }

  function project(race, userId) {
    const time = now();
    const player = race.players.get(userId);
    const base = {
      mode: "hunt", roomId: race.roomId, phase: race.phase, hostId: race.hostId, teamCount: race.teamCount, duration: race.duration, durations: DURATIONS, joined: !!player,
      players: [...race.players.values()].map(p => ({ userId: p.userId, name: p.name, avatarKey: p.avatarKey, team: p.team })),
      teams: TEAMS.map(([name, color]) => ({ name, color }))
    };
    if (race.phase === "lobby") return base;
    if (race.phase === "podium") {
      return { ...base, remainingMs: Math.max(0, race.podiumUntil - time), standings: race.final.standings, teamStandings: race.final.teams,
        total: race.played || 0, ...(player ? { me: { score: player.score, correct: player.correctCount } } : {}) };
    }
    const round = race.rounds[race.index];
    const out = { ...base, index: race.index, total: race.rounds.length, clue: round.clue,
      remainingMs: Math.max(0, race.phaseEndsAt - time), phaseMs: race.phase === "ready" ? readyMs : race.phase === "hunt" ? race.huntWindow : revealMs,
      raceLeftMs: race.endsAt ? Math.max(0, race.endsAt - time) : race.duration * 1000,
      found: [...race.found].map(([id, f]) => ({ userId: id, order: f.order })),
      standings: standings(race), teamStandings: teamStandings(race) };
    if (race.phase === "reveal") out.answer = { workId: round.workId, title: round.title, artist: round.artist };
    if (player) {
      const claim = player.claim && time - player.claim.at < 4000 ? player.claim : null;
      out.me = { score: player.score, found: race.found.get(userId) || null, frozenMs: Math.max(0, player.frozenUntil - time),
        ...(claim ? { claim: { result: claim.result, seq: claim.seq, ...(claim.gain ? { gain: claim.gain, order: claim.order } : {}) } } : {}) };
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
  function sendOne(race, userId) {
    for (const { socket, visitor } of sockets(race.schoolKey)) {
      if (visitor.userId === userId) send(socket, { type: "MUSEUM_RACE", roomId: race.roomId, race: project(race, userId) });
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
  const timeLeft = race => race.endsAt ? race.endsAt - now() : Infinity;
  function startRound(race) {
    race.phase = "ready";
    race.found = new Map();
    for (const p of race.players.values()) { p.frozenUntil = 0; p.claim = null; }
    schedule(race, readyMs, () => {
      // 제한시간은 첫 단서를 찾기 시작할 때부터 잰다.
      if (!race.endsAt) race.endsAt = now() + race.duration * 1000;
      const span = Math.min(huntMs, timeLeft(race));
      if (span <= 0) { finish(race); return; }
      race.phase = "hunt";
      race.huntStartedAt = now();
      race.huntWindow = span;
      schedule(race, span, () => reveal(race));
      broadcast(race);
    });
    broadcast(race);
  }
  function reveal(race) {
    if (race.phase !== "hunt") return;
    race.phase = "reveal";
    race.played = race.index + 1;
    schedule(race, revealMs, () => {
      race.index++;
      // 남은 시간으로는 다음 단서를 찾을 틈이 없으면 여기서 끝낸다.
      if (race.index >= race.rounds.length || timeLeft(race) < readyMs + 3000) finish(race);
      else startRound(race);
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
    race.found?.delete(userId);
    if (race.phase === "hunt" && race.found.size >= race.players.size) { reveal(race); return; }
    broadcast(race);
  }
  function raceOf(visitor) {
    return visitor && races.get(keyOf(visitor.schoolKey, visitor.room));
  }
  function playerRace(visitor) {
    for (const race of races.values()) if (race.schoolKey === visitor.schoolKey && race.players.has(visitor.userId)) return race;
    return null;
  }

  function claim(race, visitor, message) {
    const p = race.players.get(visitor.userId);
    if (race.phase !== "hunt" || Number(message.index) !== race.index || race.found.has(p.userId)) return;
    const time = now();
    if (time < p.frozenUntil) { sendOne(race, p.userId); return; }
    const room = roomById.get(race.roomId), workId = String(message.workId || "");
    const slot = workSlot(room, workId);
    if (!slot) return;
    p.claimSeq = (p.claimSeq || 0) + 1;
    if (!standsAt(visitor, slot)) { p.claim = { result: "far", at: time, seq: p.claimSeq }; sendOne(race, p.userId); return; }
    if (workId !== race.rounds[race.index].workId) {
      p.frozenUntil = time + freezeMs;
      p.claim = { result: "wrong", at: time, seq: p.claimSeq };
      sendOne(race, p.userId);
      return;
    }
    const order = race.found.size + 1;
    const gain = huntPoints(order, time - race.huntStartedAt, huntMs);
    p.score += gain; p.correctCount++;
    race.found.set(p.userId, { order, gain });
    p.claim = { result: "right", at: time, seq: p.claimSeq, gain, order };
    if (race.found.size >= race.players.size) reveal(race);
    else broadcast(race);
  }

  function handle(socket, visitor, message) {
    const type = String(message.type || "");
    if (!type.startsWith("MUSEUM_RACE_")) return false;
    if (!visitor || !roomById.has(visitor.room)) return true;
    if (type === "MUSEUM_RACE_OPEN") {
      const other = playerRace(visitor);
      if (other && other.roomId !== visitor.room) removePlayer(other, visitor.userId);
      let race = raceOf(visitor);
      if (race && race.phase === "podium") { close(race); race = null; }
      if (!race) {
        race = { key: keyOf(visitor.schoolKey, visitor.room), schoolKey: visitor.schoolKey, roomId: visitor.room, phase: "lobby",
          hostId: visitor.userId, teamCount: 0, duration: DEFAULT_DURATION, players: new Map(), rounds: [], index: -1, found: new Map(), seq: 0 };
        races.set(race.key, race);
      }
      if (race.phase !== "lobby") { send(socket, { type: "MUSEUM_RACE", roomId: race.roomId, race: project(race, visitor.userId) }); return true; }
      if (!race.players.has(visitor.userId) && race.players.size < MAX_PLAYERS) {
        race.players.set(visitor.userId, { userId: visitor.userId, name: visitor.name, avatarKey: visitor.avatarKey, joinedAt: race.seq++,
          team: null, score: 0, correctCount: 0, frozenUntil: 0, claim: null });
        placeUnteamed(race);
      }
      broadcast(race);
      return true;
    }
    const race = playerRace(visitor);
    if (!race) return true;
    if (type === "MUSEUM_RACE_LEAVE") { removePlayer(race, visitor.userId); return true; }
    // 연 사람은 개인전(0)이나 팀 수(2~8)를 고르고, 누구나 자기 팀을 고른다.
    if (type === "MUSEUM_RACE_TEAMS" && race.phase === "lobby" && race.hostId === visitor.userId) {
      const count = Number(message.count);
      if (count === 0 || (Number.isInteger(count) && count >= 2 && count <= TEAMS.length)) { race.teamCount = count; placeUnteamed(race); broadcast(race); }
      return true;
    }
    if (type === "MUSEUM_RACE_TIME" && race.phase === "lobby" && race.hostId === visitor.userId) {
      const seconds = Number(message.seconds);
      if (DURATIONS.includes(seconds)) { race.duration = seconds; broadcast(race); }
      return true;
    }
    // 다른 순위전처럼 연 사람은 학생을 다른 팀으로 옮기거나 한꺼번에 섞을 수 있다.
    if (type === "MUSEUM_RACE_ASSIGN" && race.phase === "lobby" && race.teamCount && race.hostId === visitor.userId) {
      const target = race.players.get(String(message.userId || "")), team = Number(message.team);
      if (target && Number.isInteger(team) && team >= 0 && team < race.teamCount) { target.team = team; broadcast(race); }
      return true;
    }
    if (type === "MUSEUM_RACE_SHUFFLE" && race.phase === "lobby" && race.teamCount && race.hostId === visitor.userId) {
      shuffle([...race.players.values()], random).forEach((p, i) => { p.team = i % race.teamCount; });
      broadcast(race);
      return true;
    }
    if (type === "MUSEUM_RACE_PICK" && race.phase === "lobby" && race.teamCount) {
      const team = Number(message.team);
      if (Number.isInteger(team) && team >= 0 && team < race.teamCount) { race.players.get(visitor.userId).team = team; broadcast(race); }
      return true;
    }
    if (type === "MUSEUM_RACE_START" && race.phase === "lobby" && race.hostId === visitor.userId && race.players.size >= 2) {
      race.rounds = buildRounds(content, race.roomId, random);
      if (!race.rounds.length) return true;
      placeUnteamed(race);
      race.index = 0;
      startRound(race);
      return true;
    }
    if (type === "MUSEUM_RACE_CLAIM") { claim(race, visitor, message); return true; }
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

module.exports = { createMuseumRace, buildRounds, loadMuseumContent, workSlot, standsAt, huntPoints, TEAMS, DURATIONS };
