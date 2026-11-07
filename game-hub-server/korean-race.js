'use strict';
const express = require('express');
const crypto = require('node:crypto');
const Core = require('../learning/literacy-numeracy/korean-race/korean-race-core');
const Questions = require('../learning/literacy-numeracy/korean-race/korean-race-questions');
const bank = require('./korean-race-bank');
const COUNTDOWN_MS = 3500;
const GRACE_MS = 1500;
// 화면과 같은 기다림을 서버도 지킨다(네트워크 지연만큼은 봐준다).
const MIN_ANSWER_MS = Core.MIN_ANSWER_MS - 150;
const RETRY_LOCK_MS = Core.RETRY_LOCK_MS - 150;

// 타자 순위전처럼 한 수업 동안만 쓰는 방이라 서버 메모리에 둔다.
// 정답은 서버만 안다. 화면은 지금 풀 문제(보기)만 받는다.
function createKoreanRace({ platform, now = Date.now, random = Math.random, pools = bank.load }) {
  const router = express.Router(),
    rooms = new Map(),
    TTL = 2 * 60 * 60 * 1000;
  const fail = (status, message) => Object.assign(Error(message), { status });
  const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
  const prune = () => {
    for (const [code, r] of rooms) if (now() - r.updated > TTL) rooms.delete(code);
  };
  const teacher = async (req) =>
    platform.configuration && !platform.configuration().enabled ? false : platform.isTeacherRequest(req);
  const token = () => crypto.randomBytes(24).toString('hex');
  const students = (r) => r.players.filter((p) => p.plays);
  const avatar = (value) => {
    const url = String(value || '');
    return /^\/assets\/avatars\/[A-Za-z0-9._%()-]+\.webp$/i.test(url) ? url : null;
  };
  function config(body, previous = {}) {
    const set = Core.SETS[body?.set] ? body.set : previous.set || 'spelling';
    const level = Core.validLevel(set, body?.level ?? (set === previous.set ? previous.level : undefined));
    const duration = Core.DURATIONS.includes(Number(body?.duration)) ? Number(body.duration) : previous.duration || 90;
    const teamMode = typeof body?.teamMode === 'boolean' ? body.teamMode : Boolean(previous.teamMode);
    const teamCount = Core.TEAM_COUNTS.includes(Number(body?.teamCount)) ? Number(body.teamCount) : previous.teamCount || 2;
    // 범위(예: 영단어 Level 1 · 4차시)는 들어온 학습 화면이 정한다. 보내지 않으면 앞의 범위를 이어 쓴다.
    const range = Core.validRange(set, body && 'range' in body ? body.range : set === previous.set ? previous.range : null);
    return { set, level, range, duration, teamMode, teamCount };
  }
  function applyConfig(r, body) {
    r.config = config(body, r.config);
    students(r).forEach((p) => { if (p.team !== null && p.team >= r.config.teamCount) p.team = null; });
  }
  // 학습 화면을 전체 잠금한 콘텐츠는 순위전에서도 고를 수 없다.
  async function openParts(req, set) {
    const parts = set === 'mixed' ? Core.MIXED_PARTS : [set];
    if (await platform.canBypassGlobalContentLock(req)) return parts;
    const open = [];
    for (const part of parts) if (!(await platform.isContentGloballyDisabled(Core.SETS[part].app))) open.push(part);
    return open;
  }
  async function assertOpen(req, set) {
    const parts = await openParts(req, set);
    if (!parts.length) throw fail(403, `${Core.SETS[set].label}은(는) 지금 사용할 수 없어요.`);
    return parts;
  }
  const teamSize = (r, team) => students(r).filter((p) => p.team === team).length;
  function validTeam(r, value) {
    const team = Number(value);
    if (!Number.isInteger(team) || team < 0 || team >= r.config.teamCount) throw fail(400, '팀을 다시 골라 주세요.');
    return team;
  }
  function openTeam(r) {
    const sizes = Core.TEAMS.slice(0, r.config.teamCount).map((_, i) => [i, teamSize(r, i)]).filter(([, n]) => n < Core.TEAM_MAX);
    sizes.sort((a, b) => a[1] - b[1] || a[0] - b[0]);
    return sizes.length ? sizes[0][0] : null;
  }
  function expire(r) {
    if (r.phase === 'running' && now() > r.deadline + GRACE_MS) r.phase = 'results';
  }
  function member(req) {
    prune();
    const room = rooms.get(req.params.code);
    if (!room) throw fail(404, '방이 종료되었거나 방번호가 맞지 않아요.');
    expire(room);
    const key = String(req.get('authorization') || '').replace(/^Bearer /, '');
    const player = room.players.find((p) => p.token === key);
    if (!player) throw fail(403, '이 기기에서 방에 다시 입장해 주세요.');
    return { room, player };
  }
  async function host(req) {
    const v = member(req);
    if (!v.player.host || !(v.player.plays || (await teacher(req)))) throw fail(403, '방을 연 사람만 바꿀 수 있어요.');
    return v;
  }
  const resetScore = (p) => Object.assign(p, { score: 0, index: 0, correct: 0, wrong: 0, combo: 0, bestCombo: 0, blocks: [], tried: [], scoredAt: null, lastAt: 0, lastWrong: false });
  function board(r) {
    const rows = students(r).map((x) => ({
      id: x.id,
      name: x.name,
      racer: x.racer,
      avatarUrl: x.avatarUrl || null,
      team: r.config.teamMode ? x.team : null,
      score: x.score,
      count: x.index,
      correct: x.correct,
      wrong: x.wrong,
      accuracy: Core.accuracy(x.correct, x.wrong),
      combo: x.combo,
      bestCombo: x.bestCombo,
      scoredAt: x.scoredAt,
    }));
    return Core.rank(rows).map((row, i) => ({ ...row, rank: i + 1 }));
  }
  function question(r, p) {
    if (r.phase !== 'running' || !p.plays) return null;
    const q = r.items[p.index];
    return q ? Questions.publicQuestion(q, p.index, Core.SETS[q.set].label, p.tried) : null;
  }
  function state(r, p) {
    expire(r);
    const participants = board(r);
    const mine = participants.find((x) => x.id === p.id);
    return {
      code: r.code,
      phase: r.phase,
      config: r.config,
      roundId: r.roundId,
      startsAt: r.startsAt || null,
      deadline: r.deadline || null,
      serverNow: now(),
      total: r.items.length,
      me: {
        id: p.id, host: p.host, plays: Boolean(p.plays), name: p.name, racer: p.racer || '', avatarUrl: p.avatarUrl || null,
        team: r.config.teamMode ? p.team ?? null : null, index: p.index || 0, score: p.score || 0, combo: p.combo || 0,
        correct: p.correct || 0, wrong: p.wrong || 0, blocks: p.blocks || [], rank: mine?.rank || null,
        question: question(r, p),
      },
      participants,
      teams: r.config.teamMode ? Core.teamBoard(participants, r.config.teamCount) : null,
    };
  }
  router.use((req, res, next) => { res.set('Cache-Control', 'no-store'); next(); });
  router.get('/session', wrap(async (req, res) => res.json({ isTeacher: await teacher(req) })));
  router.post(
    '/rooms',
    wrap(async (req, res) => {
      prune();
      const isTeacher = await teacher(req);
      const cfg = config(req.body);
      await assertOpen(req, cfg.set);
      let player;
      // 교사는 함께 풀거나, 문제를 풀지 않고 큰 화면에 현황판만 띄울 수 있다.
      if (isTeacher) player = resetScore({ id: crypto.randomUUID(), token: token(), host: true, plays: req.body?.spectate !== true, name: '선생님', team: null, avatarUrl: null, racer: Core.RACERS[0] });
      else {
        const name = String((await platform.displayNameFor(req))?.name || '').trim();
        if (!name || name.length > 40) throw fail(403, '메인 화면에서 이름을 확인하고 방을 열어 주세요.');
        // 학생은 방을 하나만 연다. 새로 열면 예전 방은 닫힌다.
        for (const [code, old] of rooms) if (old.players.some((p) => p.host && p.plays && p.name === name)) rooms.delete(code);
        player = resetScore({ id: crypto.randomUUID(), token: token(), host: true, plays: true, name, team: null, avatarUrl: avatar(req.body?.avatarUrl), racer: Core.RACERS[0] });
      }
      if (rooms.size >= 256) throw fail(503, '열린 방이 많아요. 잠시 후 다시 시도해 주세요.');
      const code = await platform.roomCodes.allocate('korean');
      const r = { code, config: cfg, players: [player], phase: 'lobby', roundId: '', items: [], joined: player.plays ? 1 : 0, updated: now() };
      rooms.set(code, r);
      res.json({ token: player.token, state: state(r, player) });
    }),
  );
  router.post(
    '/rooms/:code/join',
    wrap(async (req, res) => {
      prune();
      const r = rooms.get(req.params.code);
      if (!r) throw fail(404, '방번호를 다시 확인해 주세요.');
      expire(r);
      const identity = await platform.displayNameFor(req);
      const name = String(identity?.name || '').trim();
      if (!name || name.length > 40) throw fail(403, '메인 화면에서 이름을 확인하고 입장해 주세요.');
      // 이름은 로그인에서 오므로, 새로고침하거나 기기를 바꾼 학생은 점수를 그대로 둔 채 자리를 되찾는다.
      const seat = students(r).find((p) => p.name === name);
      if (seat) {
        seat.token = token();
        seat.avatarUrl = avatar(req.body?.avatarUrl) || seat.avatarUrl;
        r.updated = now();
        return res.json({ token: seat.token, state: state(r, seat) });
      }
      if (r.players.length >= 61) throw fail(409, '방에 60명이 모두 들어왔어요.');
      const p = resetScore({ id: crypto.randomUUID(), token: token(), name, host: false, plays: true, team: null, avatarUrl: avatar(req.body?.avatarUrl), racer: Core.RACERS[r.joined++ % Core.RACERS.length] });
      // 푸는 중에 들어오면 자리가 남은 가장 작은 팀에 넣는다.
      if (r.config.teamMode && r.phase === 'running') p.team = openTeam(r);
      r.players.push(p);
      r.updated = now();
      res.json({ token: p.token, state: state(r, p) });
    }),
  );
  router.get(
    '/rooms/:code',
    wrap(async (req, res) => {
      const { room: r, player: p } = member(req);
      res.json(state(r, p));
    }),
  );
  router.post(
    '/rooms/:code/start',
    wrap(async (req, res) => {
      const { room: r, player: p } = await host(req);
      if (r.phase === 'running') throw fail(409, '이미 푸는 중이에요.');
      if (!students(r).length) throw fail(409, '학생이 한 명 이상 들어오면 출발할 수 있어요.');
      applyConfig(r, req.body);
      const parts = await assertOpen(req, r.config.set);
      if (r.config.teamMode) {
        // 연산 순위전처럼 팀을 고르지 않은 사람은 가장 작은 팀에 넣고 출발한다.
        for (const s of students(r).filter((x) => x.team === null)) {
          const team = openTeam(r);
          if (team === null) throw fail(409, `${r.config.teamCount}팀에는 ${r.config.teamCount * Core.TEAM_MAX}명까지 들어가요. 팀 수를 늘려 주세요.`);
          s.team = team;
        }
        if (students(r).length > 1 && Core.teamBoard(board(r), r.config.teamCount).filter((t) => t.size).length < 2)
          throw fail(409, '두 팀 이상에 학생이 있어야 출발할 수 있어요.');
      }
      // 빠른 학생도 끝까지 새 문제를 받을 만큼 넉넉히 뽑는다.
      r.items = Questions.makeRound(pools(), { set: r.config.set, level: r.config.level, range: r.config.range, count: r.config.duration + 20, mixedParts: parts, random });
      if (r.items.length < 10) throw fail(503, '문항 자료를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.');
      r.roundId = crypto.randomUUID();
      r.phase = 'running';
      r.startsAt = now() + COUNTDOWN_MS;
      r.deadline = r.startsAt + r.config.duration * 1000;
      r.updated = now();
      students(r).forEach(resetScore);
      res.json(state(r, p));
    }),
  );
  router.post(
    '/rooms/:code/answer',
    wrap(async (req, res) => {
      const { room: r, player: p } = member(req);
      const t = now();
      if (!p.plays || req.body?.roundId !== r.roundId) throw fail(409, '지금 판의 기록이 아니에요.');
      if (r.phase !== 'running' || t > r.deadline + GRACE_MS) throw fail(409, '이번 판이 끝났어요.');
      if (t < r.startsAt) throw fail(409, '출발 신호 뒤에 골라 주세요.');
      // 다른 문제의 답(두 번 누름·다른 탭)은 받지 않는다.
      if (Number(req.body?.index) !== p.index) throw fail(409, '다른 문제의 답이에요. 다시 맞춰 볼게요.');
      const q = r.items[p.index];
      if (!q) throw fail(409, '준비한 문제를 모두 풀었어요!');
      const since = t - Math.max(p.lastAt, r.startsAt);
      if (since < MIN_ANSWER_MS || (p.lastWrong && since < RETRY_LOCK_MS)) throw fail(429, '너무 빨라요. 문제를 읽고 골라 주세요.');
      const choice = Number(req.body?.choice);
      if (!Number.isInteger(choice) || choice < 0 || choice >= q.choices.length) throw fail(400, '보기를 다시 골라 주세요.');
      // 이미 틀린 보기를 또 보내면(두 번 누름) 점수를 두 번 깎지 않는다.
      if (p.tried.includes(choice)) throw fail(409, '이미 고른 보기예요. 다른 보기를 골라 주세요.');
      const correct = choice === q.answer;
      let gained;
      if (correct) {
        // 한 번에 맞히면 콤보가 이어지고, 틀린 뒤 맞히면 콤보는 처음부터다(연산 순위전처럼).
        p.combo += 1;
        gained = Core.points(p.combo);
        p.correct += 1;
        p.blocks = [...p.blocks, q.block].slice(-60);
      } else {
        // 틀릴 때마다 1점씩 깎고 같은 문제를 다시 고른다. 점수는 0 아래로도 내려간다.
        p.combo = 0;
        gained = -Core.WRONG_PENALTY;
        p.wrong += 1;
        p.tried = [...p.tried, choice];
      }
      const retried = correct && p.tried.length > 0;
      p.bestCombo = Math.max(p.bestCombo, p.combo);
      p.score += gained;
      if (correct) {
        p.index += 1;
        p.tried = [];
      }
      p.lastAt = t;
      p.lastWrong = !correct;
      p.scoredAt = t;
      r.updated = t;
      // 정답과 풀이는 맞힌 뒤에만 보낸다.
      res.json({ correct, gained, combo: p.combo, ...(correct ? { answer: q.answer, explain: q.explain, retried } : { tried: p.tried }), state: state(r, p) });
    }),
  );
  // 대기실에서 바꾼 설정은 바로 학생 화면에도 보인다.
  router.post(
    '/rooms/:code/settings',
    wrap(async (req, res) => {
      const { room: r, player: p } = await host(req);
      if (r.phase === 'running') throw fail(409, '푸는 중에는 바꿀 수 없어요.');
      await assertOpen(req, config(req.body, r.config).set);
      applyConfig(r, req.body);
      r.updated = now();
      res.json(state(r, p));
    }),
  );
  router.post(
    '/rooms/:code/team',
    wrap(async (req, res) => {
      const { room: r, player: p } = member(req);
      if (!p.plays || r.phase === 'running' || !r.config.teamMode) throw fail(409, '지금은 팀을 고를 수 없어요.');
      const team = validTeam(r, req.body?.team);
      if (p.team !== team && teamSize(r, team) >= Core.TEAM_MAX) throw fail(409, `한 팀은 ${Core.TEAM_MAX}명까지예요.`);
      p.team = team;
      r.updated = now();
      res.json(state(r, p));
    }),
  );
  router.post(
    '/rooms/:code/assign',
    wrap(async (req, res) => {
      const { room: r, player: p } = await host(req);
      if (r.phase === 'running' || !r.config.teamMode) throw fail(409, '지금은 팀을 바꿀 수 없어요.');
      const target = students(r).find((s) => s.id === req.body?.playerId);
      if (!target) throw fail(404, '학생을 찾지 못했어요.');
      const team = req.body?.team === null ? null : validTeam(r, req.body?.team);
      if (team !== null && target.team !== team && teamSize(r, team) >= Core.TEAM_MAX) throw fail(409, `한 팀은 ${Core.TEAM_MAX}명까지예요.`);
      target.team = team;
      r.updated = now();
      res.json(state(r, p));
    }),
  );
  router.post(
    '/rooms/:code/shuffle',
    wrap(async (req, res) => {
      const { room: r, player: p } = await host(req);
      if (r.phase === 'running' || !r.config.teamMode) throw fail(409, '지금은 팀을 바꿀 수 없어요.');
      const list = students(r);
      if (list.length > r.config.teamCount * Core.TEAM_MAX)
        throw fail(409, `${r.config.teamCount}팀에는 ${r.config.teamCount * Core.TEAM_MAX}명까지 들어가요. 팀 수를 늘려 주세요.`);
      const order = list.map((s) => [random(), s]).sort((a, b) => a[0] - b[0]).map(([, s]) => s);
      order.forEach((s, i) => (s.team = i % r.config.teamCount));
      r.updated = now();
      res.json(state(r, p));
    }),
  );
  router.post(
    '/rooms/:code/stop',
    wrap(async (req, res) => {
      const { room: r, player: p } = await host(req);
      if (r.phase !== 'running') throw fail(409, '푸는 중인 판이 없어요.');
      r.phase = 'results';
      r.deadline = Math.min(r.deadline, now());
      r.updated = now();
      res.json(state(r, p));
    }),
  );
  router.post(
    '/rooms/:code/lobby',
    wrap(async (req, res) => {
      const { room: r, player: p } = await host(req);
      if (r.phase === 'running') throw fail(409, '푸는 중에는 돌아갈 수 없어요.');
      r.phase = 'lobby';
      r.roundId = '';
      r.items = [];
      students(r).forEach(resetScore);
      r.updated = now();
      res.json(state(r, p));
    }),
  );
  router.post(
    '/rooms/:code/leave',
    wrap(async (req, res) => {
      const { room: r, player: p } = member(req);
      if (p.host) rooms.delete(r.code);
      else r.players = r.players.filter((x) => x !== p);
      res.json({ ok: true });
    }),
  );
  router.use((error, req, res, next) => {
    if (res.headersSent) return next(error);
    res.status(error.status || 500).json({
      message: error.status ? error.message : '방 연결에 문제가 생겼어요. 잠시 후 다시 시도해 주세요.',
    });
  });
  return {
    router,
    hasRoomCode(code) {
      prune();
      return rooms.has(code);
    },
  };
}
module.exports = { createKoreanRace };
