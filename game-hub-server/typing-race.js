'use strict';
const express = require('express');
const crypto = require('node:crypto');
const Core = require('../learning/inquiry/information-computing/typing/race/race-core');
const { roundItems } = require('./typing-race-words');
const CONTENT = '/learning/inquiry/information-computing/typing';
const COUNTDOWN_MS = 3500;
const GRACE_MS = 1500;
// 1초에 50타(3000타/분)보다 빠른 제출은 사람이 친 것으로 보지 않는다.
const MIN_MS_PER_STROKE = 20;

// 손글씨 순위전처럼 한 수업 동안만 쓰는 방이라 서버 메모리에 둔다.
function createTypingRace({ platform, now = Date.now, random = Math.random }) {
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
  // 방장은 교사든 학생이든 함께 달린다(연산 순위전처럼).
  const students = (r) => r.players.filter((p) => p.plays);
  // 학생 프로필 아바타. 사이트의 아바타 그림 주소만 받는다.
  const avatar = (value) => {
    const url = String(value || '');
    return /^\/assets\/avatars\/[A-Za-z0-9._%()-]+\.webp$/i.test(url) ? url : null;
  };
  function config(body, previous = {}) {
    const mode = Core.MODES[body?.mode] ? body.mode : previous.mode || 'ko-words';
    const duration = Core.DURATIONS.includes(Number(body?.duration)) ? Number(body.duration) : previous.duration || 90;
    const teamMode = typeof body?.teamMode === 'boolean' ? body.teamMode : Boolean(previous.teamMode);
    const teamCount = Core.TEAM_COUNTS.includes(Number(body?.teamCount)) ? Number(body.teamCount) : previous.teamCount || 2;
    // 오래 열린 화면이 평균 설정을 보내도 팀원 모두의 점수를 합산한다.
    const teamScore = 'sum';
    return { mode, duration, teamMode, teamCount, teamScore };
  }
  function applyConfig(r, body) {
    r.config = config(body, r.config);
    // 줄어든 팀에 있던 학생은 다시 고르게 한다.
    students(r).forEach((p) => { if (p.team !== null && p.team >= r.config.teamCount) p.team = null; });
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
  const resetScore = (p) => Object.assign(p, { score: 0, index: 0, good: 0, mistakes: 0, combo: 0, bestCombo: 0, scoredAt: null });
  function board(r) {
    const rows = students(r).map((x) => ({
      id: x.id,
      name: x.name,
      racer: x.racer,
      avatarUrl: x.avatarUrl || null,
      team: r.config.teamMode ? x.team : null,
      score: x.score,
      count: x.index,
      strokes: x.good,
      accuracy: Core.accuracy(x.good, x.mistakes),
      combo: x.combo,
      bestCombo: x.bestCombo,
      scoredAt: x.scoredAt,
    }));
    return Core.rank(rows).map((row, i) => ({ ...row, rank: i + 1 }));
  }
  function state(r, p, withItems = false) {
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
      items: withItems && r.roundId ? r.items : undefined,
      me: { id: p.id, host: p.host, plays: Boolean(p.plays), name: p.name, racer: p.racer || '', avatarUrl: p.avatarUrl || null, team: r.config.teamMode ? p.team ?? null : null, index: p.index || 0, score: p.score || 0, combo: p.combo || 0, rank: mine?.rank || null },
      participants,
      teams: r.config.teamMode ? Core.teamBoard(participants, r.config.teamCount) : null,
    };
  }
  router.use(
    wrap(async (req, res, next) => {
      res.set('Cache-Control', 'no-store');
      if ((await platform.isContentGloballyDisabled(CONTENT)) && !(await platform.canBypassGlobalContentLock(req)))
        throw fail(403, '현재 사용할 수 없는 활동이에요.');
      next();
    }),
  );
  router.get('/session', wrap(async (req, res) => res.json({ isTeacher: await teacher(req) })));
  router.post(
    '/rooms',
    wrap(async (req, res) => {
      prune();
      const isTeacher = await teacher(req);
      let player;
      // 교사는 "참여하지 않고 관전하기"를 고르면 큰 화면 현황판만 본다.
      if (isTeacher) player = resetScore({ id: crypto.randomUUID(), token: token(), host: true, plays: req.body?.spectate !== true, name: '선생님', team: null, avatarUrl: null, racer: Core.RACERS[0] });
      else {
        const name = String((await platform.displayNameFor(req))?.name || '').trim();
        if (!name || name.length > 40) throw fail(403, '메인 화면에서 이름을 확인하고 방을 열어 주세요.');
        // 학생은 방을 하나만 연다. 새로 열면 예전 방은 닫힌다.
        for (const [code, old] of rooms) if (old.players.some((p) => p.host && p.plays && p.name === name)) rooms.delete(code);
        player = resetScore({ id: crypto.randomUUID(), token: token(), host: true, plays: true, name, team: null, avatarUrl: avatar(req.body?.avatarUrl), racer: Core.RACERS[0] });
      }
      if (rooms.size >= 256) throw fail(503, '열린 방이 많아요. 잠시 후 다시 시도해 주세요.');
      const code = await platform.roomCodes.allocate('typing');
      const r = { code, config: config(req.body), players: [player], phase: 'lobby', roundId: '', items: [], joined: player.plays ? 1 : 0, updated: now() };
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
      // 이름은 로그인에서 오므로, 새로고침한 학생은 점수를 그대로 둔 채 자리를 되찾는다.
      const seat = students(r).find((p) => p.name === name);
      if (seat) {
        seat.token = token();
        seat.avatarUrl = avatar(req.body?.avatarUrl) || seat.avatarUrl;
        r.updated = now();
        return res.json({ token: seat.token, state: state(r, seat, true) });
      }
      if (r.players.length >= 61) throw fail(409, '방에 60명이 모두 들어왔어요.');
      const p = resetScore({ id: crypto.randomUUID(), token: token(), name, host: false, plays: true, team: null, avatarUrl: avatar(req.body?.avatarUrl), racer: Core.RACERS[r.joined++ % Core.RACERS.length] });
      // 달리는 중에 들어오면 자리가 남은 가장 작은 팀에 넣는다.
      if (r.config.teamMode && r.phase === 'running') p.team = openTeam(r);
      r.players.push(p);
      r.updated = now();
      res.json({ token: p.token, state: state(r, p, true) });
    }),
  );
  router.get(
    '/rooms/:code',
    wrap(async (req, res) => {
      const { room: r, player: p } = member(req);
      res.json(state(r, p, req.query.items === '1'));
    }),
  );
  router.post(
    '/rooms/:code/start',
    wrap(async (req, res) => {
      const { room: r, player: p } = await host(req);
      if (r.phase === 'running') throw fail(409, '이미 달리는 중이에요.');
      if (!students(r).length) throw fail(409, '학생이 한 명 이상 들어오면 출발할 수 있어요.');
      applyConfig(r, req.body);
      if (r.config.teamMode) {
        const waiting = students(r).filter((s) => s.team === null).length;
        if (waiting) throw fail(409, `아직 팀이 없는 사람이 ${waiting}명 있어요.`);
        if (Core.teamBoard(board(r), r.config.teamCount).filter((t) => t.size).length < 2)
          throw fail(409, '두 팀 이상에 학생이 있어야 출발할 수 있어요.');
      }
      const perSecond = Core.MODES[r.config.mode].sentence ? 0.5 : 1.6;
      r.items = roundItems(r.config.mode, Math.ceil(r.config.duration * perSecond) + 20, random);
      r.roundId = crypto.randomUUID();
      r.phase = 'running';
      r.startsAt = now() + COUNTDOWN_MS;
      r.deadline = r.startsAt + r.config.duration * 1000;
      r.updated = now();
      students(r).forEach(resetScore);
      res.json(state(r, p, true));
    }),
  );
  router.post(
    '/rooms/:code/type',
    wrap(async (req, res) => {
      const { room: r, player: p } = member(req);
      const t = now();
      if (!p.plays || req.body?.roundId !== r.roundId) throw fail(409, '지금 판의 기록이 아니에요.');
      if (r.phase !== 'running' || t > r.deadline + GRACE_MS) throw fail(409, '이번 판이 끝났어요.');
      if (t < r.startsAt) throw fail(409, '출발 신호 뒤에 입력해 주세요.');
      const index = Number(req.body?.index);
      const text = String(req.body?.text ?? '');
      if (index !== p.index || text !== r.items[index]) throw fail(409, '입력이 맞지 않아요. 다시 맞춰 볼게요.');
      const strokes = Core.strokes(text);
      // 네트워크가 밀려 두 낱말이 붙어 와도 되도록, 출발부터 센 평균 속도로만 막는다.
      if ((p.good + strokes) * MIN_MS_PER_STROKE > t - r.startsAt) throw fail(429, '너무 빨라요. 직접 입력해 주세요.');
      const mistakes = Math.min(50, Math.max(0, Math.floor(Number(req.body?.mistakes) || 0)));
      p.combo = mistakes ? 0 : p.combo + 1;
      p.bestCombo = Math.max(p.bestCombo, p.combo);
      const gained = Core.itemScore(text, p.combo);
      p.score += gained;
      p.good += strokes;
      p.mistakes += mistakes;
      p.index += 1;
      p.scoredAt = t;
      r.updated = t;
      res.json({ gained, combo: p.combo, state: state(r, p) });
    }),
  );
  // 대기실에서 바꾼 설정은 바로 학생 화면에도 보인다.
  router.post(
    '/rooms/:code/settings',
    wrap(async (req, res) => {
      const { room: r, player: p } = await host(req);
      if (r.phase === 'running') throw fail(409, '달리는 중에는 바꿀 수 없어요.');
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
      if (r.phase !== 'running') throw fail(409, '달리는 중인 판이 없어요.');
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
      if (r.phase === 'running') throw fail(409, '달리는 중에는 돌아갈 수 없어요.');
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
module.exports = { createTypingRace };
