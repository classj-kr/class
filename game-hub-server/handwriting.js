'use strict';
const express = require('express');
const crypto = require('node:crypto');
const Core = require('../learning/literacy-numeracy/handwriting/core');
const CONTENT = '/learning/literacy-numeracy/handwriting';
// Like rhythm rooms, these are live classroom sessions, not permanent student records.
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
  function config(body) {
    const text = String(body?.text || '가나다').trim();
    if (text.length > 60 || Core.chars(text).length > 12 || !Core.supported(text))
      throw fail(400, '순위전은 한글 1~12글자로 열어 주세요. 숫자와 문장 부호는 빼 주세요.');
    return { text, phase: body?.phase === 'solo' ? 'solo' : 'trace' };
  }
  function expire(r) {
    if (r.phase === 'writing' && now() >= r.deadline) {
      r.phase = 'results';
      r.players.filter((p) => !p.host && !p.result).forEach((p) => (p.status = '미제출'));
    }
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
    if (!v.player.host || !(await teacher(req))) throw fail(403, '방을 연 교사만 바꿀 수 있어요.');
    return v;
  }
  function state(r, p) {
    expire(r);
    const participants = r.players
      .filter((x) => !x.host)
      .map((x) => ({
        id: x.id,
        name: x.name,
        ready: x.ready,
        status: x.status,
        // Scores appear together after the round, avoiding copying during a live round.
        result: r.phase === 'results' ? x.result : null,
      }));
    participants.sort(
      (a, b) =>
        Number(b.result?.order || false) - Number(a.result?.order || false) ||
        (b.result?.shape ?? -1) - (a.result?.shape ?? -1),
    );
    let rank = 0;
    participants.forEach((x, i) => {
      if (x.result?.order) {
        if (
          i === 0 ||
          !participants[i - 1].result?.order ||
          participants[i - 1].result.shape !== x.result.shape
        )
          rank = i + 1;
        x.rank = rank;
      }
    });
    return {
      code: r.code,
      phase: r.phase,
      config: r.config,
      roundId: r.roundId,
      deadline: r.deadline || null,
      me: { id: p.id, host: p.host, ready: p.ready, status: p.status },
      participants,
    };
  }
  router.use(
    wrap(async (req, res, next) => {
      res.set('Cache-Control', 'no-store');
      if (
        (await platform.isContentGloballyDisabled(CONTENT)) &&
        !(await platform.canBypassGlobalContentLock(req))
      )
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
      if (!(await teacher(req))) throw fail(403, '교사 계정으로 로그인해 주세요.');
      prune();
      if (rooms.size >= 256) throw fail(503, '열린 방이 많아요. 잠시 후 다시 시도해 주세요.');
      const settings = config(req.body);
      const code = await platform.roomCodes.allocate('handwriting');
      const player = { id: crypto.randomUUID(), token: token(), host: true, name: '선생님' };
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
      if (r.phase === 'writing')
        throw fail(409, '글씨 쓰기가 진행 중이에요. 이번 판이 끝나면 입장해 주세요.');
      if (r.players.length >= 61) throw fail(409, '방에 60명이 모두 들어왔어요.');
      const identity = await platform.displayNameFor(req);
      const name = String(identity?.name || '').trim();
      if (!name || name.length > 40) throw fail(403, '메인 화면에서 이름을 확인하고 입장해 주세요.');
      if (r.players.some((p) => !p.host && p.name === name))
        throw fail(409, '이미 같은 이름이 입장했어요. 원래 입장한 탭을 확인해 주세요.');
      const p = {
        id: crypto.randomUUID(),
        token: token(),
        name,
        host: false,
        ready: false,
        status: '대기',
        result: null,
      };
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
  router.post(
    '/rooms/:code/start',
    wrap(async (req, res) => {
      const { room: r, player: p } = await host(req);
      const students = r.players.filter((p) => !p.host);
      if (r.phase === 'writing') throw fail(409, '이미 시작했어요.');
      if (!students.length || students.some((p) => !p.ready))
        throw fail(409, '학생들이 모두 준비를 누르면 시작할 수 있어요.');
      r.config = config(req.body);
      r.roundId = crypto.randomUUID();
      r.phase = 'writing';
      r.deadline = now() + 5 * 60 * 1000;
      r.updated = now();
      students.forEach((p) => {
        p.ready = false;
        p.result = null;
        p.status = '쓰는 중';
      });
      res.json(state(r, p));
    }),
  );
  router.post(
    '/rooms/:code/result',
    wrap(async (req, res) => {
      const { room: r, player: p } = member(req);
      if (p.host || req.body?.roundId !== r.roundId) throw fail(409, '현재 판의 제출이 아니에요.');
      if (p.result) return res.json(state(r, p));
      if (r.phase !== 'writing') throw fail(409, '이번 판이 끝났어요.');
      try {
        p.result = Core.judgeText(r.config.text, req.body?.cells);
      } catch (error) {
        throw fail(400, error.message);
      }
      p.status = '제출 완료';
      r.updated = now();
      if (r.players.filter((p) => !p.host).every((p) => p.result)) r.phase = 'results';
      res.json(state(r, p));
    }),
  );
  router.post(
    '/rooms/:code/stop',
    wrap(async (req, res) => {
      const { room: r, player: p } = await host(req);
      if (r.phase !== 'writing') throw fail(409, '진행 중인 판이 없어요.');
      r.phase = 'results';
      r.players.filter((p) => !p.host && !p.result).forEach((p) => (p.status = '미제출'));
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
        if (r.phase === 'writing' && r.players.filter((x) => !x.host).every((x) => x.result))
          r.phase = 'results';
      }
      res.json({ ok: true });
    }),
  );
  router.use((error, req, res, next) => {
    if (res.headersSent) return next(error);
    res
      .status(error.status || 500)
      .json({
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
