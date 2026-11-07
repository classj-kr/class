'use strict';
const express = require('express');
const crypto = require('node:crypto');
const Core = require('../learning/literacy-numeracy/handwriting/core');
const CONTENT = '/learning/literacy-numeracy/handwriting';
const MAX_LETTERS = 24; // 속담 한 줄까지
const COUNTDOWN_MS = 3500; // 시작을 누르면 3·2·1 뒤에 함께 쓴다.
const WRITE_MS = 5 * 60 * 1000;
// 시간이 끝나는 순간 화면이 쓴 글씨를 자동으로 낸다. 그 제출이 닿을 만큼만 결과 공개를 늦춘다.
const GRACE_MS = 4000;
// Like rhythm rooms, these are live classroom sessions, not permanent student records.
// 교사가 연 방: 교사는 기본으로 함께 쓰고, "참여하지 않고 관전하기"를 고르면 지켜만 본다.
// 학생이 연 방: 방장도 함께 쓰고 시작·마치기를 맡는다(다른 순위전과 같다).
function createHandwriting({ platform, now = Date.now }) {
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
  const writers = (r) => r.players.filter((p) => p.plays);
  // 아바타는 사이트 아바타 그림 주소만 받는다(다른 주소는 버린다).
  const avatar = (value) => {
    const url = String(value || '');
    return /^\/assets\/avatars\/[A-Za-z0-9._%()-]+\.webp$/i.test(url) ? url : null;
  };
  function config(body) {
    const text = String(body?.text || '가나다').trim().replace(/\s+/g, ' ');
    if (text.length > 80 || Core.chars(text).length > MAX_LETTERS || !Core.supported(text))
      throw fail(400, `순위전은 한글 1~${MAX_LETTERS}글자로 열어 주세요. 숫자와 문장 부호는 빼 주세요.`);
    return { text, phase: body?.phase === 'solo' ? 'solo' : 'trace' };
  }
  function finish(r) {
    r.phase = 'results';
    writers(r).filter((p) => !p.result).forEach((p) => (p.status = '미제출'));
  }
  function expire(r) {
    if (r.phase === 'writing' && now() >= r.deadline + GRACE_MS) finish(r);
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
  function state(r, p) {
    expire(r);
    const participants = writers(r).map((x) => ({
      id: x.id,
      name: x.name,
      host: x.host,
      ready: x.host || x.ready,
      status: x.status,
      avatarUrl: x.avatarUrl || null,
      // 쓰는 동안에는 글자를 얼마나 채웠는지(글자 수)만 알린다. 획 좌표는 보내지 않는다.
      progress: r.phase === 'writing' ? x.progress || 0 : 0,
      done: Boolean(x.result),
      // Scores appear together after the round, avoiding copying during a live round.
      result: r.phase === 'results' ? x.result : null,
    }));
    // 순위: 글 점수(모양 × 획) 높은 순, 같으면 공동 순위. 제출하지 않은 사람은 순위 없이 아래에.
    participants.sort((a, b) => (b.result?.score ?? -1) - (a.result?.score ?? -1));
    participants.forEach((x, i) => {
      if (!x.result) return;
      const prev = participants[i - 1];
      x.rank = prev?.result && prev.result.score === x.result.score ? prev.rank : i + 1;
    });
    return {
      code: r.code,
      phase: r.phase,
      config: r.config,
      roundId: r.roundId,
      startsAt: r.startsAt || null,
      deadline: r.deadline || null,
      serverNow: now(),
      me: { id: p.id, host: p.host, plays: Boolean(p.plays), ready: p.host || p.ready, status: p.status, name: p.name, avatarUrl: p.avatarUrl || null },
      participants,
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
  router.get(
    '/session',
    wrap(async (req, res) => res.json({ isTeacher: await teacher(req) })),
  );
  router.post(
    '/rooms',
    wrap(async (req, res) => {
      prune();
      const settings = config(req.body);
      let player;
      if (await teacher(req)) {
        player = { id: crypto.randomUUID(), token: token(), host: true, plays: req.body?.spectate !== true, name: '선생님', avatarUrl: null, ready: true, status: '대기', result: null };
      } else {
        const name = String((await platform.displayNameFor(req))?.name || '').trim();
        if (!name || name.length > 40) throw fail(403, '메인 화면에서 이름을 확인하고 방을 열어 주세요.');
        // 학생은 방을 하나만 연다. 새로 열면 예전 방은 닫힌다.
        for (const [code, old] of rooms) if (old.players.some((x) => x.host && x.plays && x.name === name)) rooms.delete(code);
        player = { id: crypto.randomUUID(), token: token(), host: true, plays: true, name, avatarUrl: avatar(req.body?.avatarUrl), ready: true, status: '대기', result: null };
      }
      if (rooms.size >= 256) throw fail(503, '열린 방이 많아요. 잠시 후 다시 시도해 주세요.');
      const code = await platform.roomCodes.allocate('handwriting');
      const r = { code, config: settings, players: [player], phase: 'lobby', roundId: '', updated: now() };
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
      if (r.phase === 'writing') throw fail(409, '글씨 쓰기가 진행 중이에요. 이번 판이 끝나면 입장해 주세요.');
      if (r.players.length >= 61) throw fail(409, '방에 60명이 모두 들어왔어요.');
      const identity = await platform.displayNameFor(req);
      const name = String(identity?.name || '').trim();
      if (!name || name.length > 40) throw fail(403, '메인 화면에서 이름을 확인하고 입장해 주세요.');
      if (writers(r).some((p) => p.name === name))
        throw fail(409, '이미 같은 이름이 입장했어요. 원래 입장한 탭을 확인해 주세요.');
      const p = { id: crypto.randomUUID(), token: token(), name, avatarUrl: avatar(req.body?.avatarUrl), host: false, plays: true, ready: false, status: '대기', result: null };
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
    '/rooms/:code/ready',
    wrap(async (req, res) => {
      const { room: r, player: p } = member(req);
      if (p.host || r.phase === 'writing') throw fail(409, '지금은 준비를 바꿀 수 없어요.');
      p.ready = req.body?.ready === true;
      r.updated = now();
      res.json(state(r, p));
    }),
  );
  // 대기실·결과 화면에서 방장이 글과 쓰기 모드를 바꾸면 모두의 화면에 바로 보인다.
  // 교사는 여기서 '나도 쓰기 / 관전'을 바꾼다(방을 만들기 전에 고르는 설정 창은 두지 않는다).
  router.post(
    '/rooms/:code/settings',
    wrap(async (req, res) => {
      const { room: r, player: p } = await host(req);
      if (r.phase === 'writing') throw fail(409, '쓰는 동안에는 바꿀 수 없어요.');
      r.config = config({ ...r.config, ...req.body });
      if (typeof req.body?.spectate === 'boolean' && (await teacher(req))) {
        p.plays = !req.body.spectate;
        if (!p.plays) p.result = null;
      }
      r.updated = now();
      res.json(state(r, p));
    }),
  );
  router.post(
    '/rooms/:code/start',
    wrap(async (req, res) => {
      const { room: r, player: p } = await host(req);
      const others = writers(r).filter((x) => !x.host);
      if (r.phase === 'writing') throw fail(409, '이미 시작했어요.');
      if (!others.length) throw fail(409, '한 명 이상 들어오면 시작할 수 있어요.');
      if (others.some((x) => !x.ready)) throw fail(409, '모두 준비를 누르면 시작할 수 있어요.');
      r.config = config(req.body);
      r.roundId = crypto.randomUUID();
      r.phase = 'writing';
      r.startsAt = now() + COUNTDOWN_MS;
      r.deadline = r.startsAt + WRITE_MS;
      r.updated = now();
      writers(r).forEach((x) => {
        x.ready = x.host;
        x.result = null;
        x.progress = 0;
        x.status = '쓰는 중';
      });
      res.json(state(r, p));
    }),
  );
  // 쓰는 동안 화면이 채운 글자 수(획 수 비율, 0.1 단위)를 알린다. 순위와 점수에는 쓰지 않는다.
  router.post(
    '/rooms/:code/progress',
    wrap(async (req, res) => {
      const { room: r, player: p } = member(req);
      if (p.plays && r.phase === 'writing' && req.body?.roundId === r.roundId && !p.result) {
        const total = Core.chars(r.config.text).length,
          value = Number(req.body?.value);
        if (Number.isFinite(value)) p.progress = Math.round(Math.max(0, Math.min(total, value)) * 10) / 10;
        r.updated = now();
      }
      res.json(state(r, p));
    }),
  );
  router.post(
    '/rooms/:code/result',
    wrap(async (req, res) => {
      const { room: r, player: p } = member(req);
      if (!p.plays || req.body?.roundId !== r.roundId) throw fail(409, '현재 판의 제출이 아니에요.');
      if (p.result) return res.json(state(r, p));
      if (r.phase !== 'writing') throw fail(409, '이번 판이 끝났어요.');
      try {
        // 서버가 실제 획 좌표로 다시 채점한다(화면 점수는 받지 않는다).
        p.result = Core.judgeText(r.config.text, req.body?.cells);
      } catch (error) {
        throw fail(400, error.message);
      }
      p.status = '제출 완료';
      p.progress = Core.chars(r.config.text).length;
      r.updated = now();
      if (writers(r).every((x) => x.result)) r.phase = 'results';
      res.json(state(r, p));
    }),
  );
  router.post(
    '/rooms/:code/stop',
    wrap(async (req, res) => {
      const { room: r, player: p } = await host(req);
      if (r.phase !== 'writing') throw fail(409, '진행 중인 판이 없어요.');
      finish(r);
      r.updated = now();
      res.json(state(r, p));
    }),
  );
  router.post(
    '/rooms/:code/leave',
    wrap(async (req, res) => {
      const { room: r, player: p } = member(req);
      if (p.host) rooms.delete(r.code);
      else {
        r.players = r.players.filter((x) => x !== p);
        if (r.phase === 'writing' && writers(r).every((x) => x.result)) r.phase = 'results';
      }
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
module.exports = { createHandwriting };
