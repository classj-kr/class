'use strict';
const express = require('express');
const crypto = require('node:crypto');
const Activities = require('../learning/literacy-numeracy/math-tools/stacking-cubes/activities');
const { DEFAULT_ROUND, MAX_ROUND, generateRound, drawFromBank } = require('./stacking-race-questions');
const CONTENT = '/learning/literacy-numeracy/math-tools/stacking-cubes';
const MODES = ['views', 'copy'];
// Live classroom races like handwriting rooms: kept in memory, never stored as student records.
function createStackingCubes({ platform, now = Date.now }) {
  const router = express.Router(),
    rooms = new Map(),
    TTL = 2 * 60 * 60 * 1000,
    ROUND_MS = 10 * 60 * 1000;
  const fail = (status, message) => Object.assign(Error(message), { status });
  const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
  const prune = () => {
    for (const [code, r] of rooms) if (now() - r.updated > TTL) rooms.delete(code);
  };
  const teacher = async (req) =>
    platform.configuration && !platform.configuration().enabled ? false : platform.isTeacherRequest(req);
  const token = () => crypto.randomBytes(24).toString('hex');
  const students = (r) => r.players.filter((p) => !p.host);
  const mode = (body) => (MODES.includes(body?.mode) ? body.mode : 'views');
  function roundSize(value, maximum) {
    if (!Number.isInteger(value) || value < 1 || value > maximum) throw fail(400, `문제 수는 1~${maximum}개로 정해 주세요.`);
    return value;
  }
  function finish(r) {
    r.phase = 'results';
    r.updated = now();
  }
  function expire(r) {
    if (r.phase === 'racing' && now() >= r.deadline) finish(r);
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
    const total = r.count;
    // More solved first, then whoever reached that count sooner.
    const participants = students(r)
      .map((x) => ({ id: x.id, name: x.name, solved: x.solved, time: x.solved ? x.time : null }))
      .sort((a, b) => b.solved - a.solved || (a.time ?? Infinity) - (b.time ?? Infinity) || a.name.localeCompare(b.name, 'ko'));
    participants.forEach((x, i) => {
      const prev = participants[i - 1];
      x.rank = x.solved === 0 ? null : prev && prev.solved === x.solved && prev.time === x.time ? prev.rank : i + 1;
    });
    return {
      code: r.code,
      phase: r.phase,
      mode: r.mode,
      roundId: r.roundId,
      deadline: r.phase === 'racing' ? r.deadline : null,
      total,
      sourceTitle: r.bank?.title || null,
      maxQuestions: r.bank?.questions.length || MAX_ROUND,
      questions: r.phase === 'lobby' ? [] : r.questions,
      me: { id: p.id, host: p.host, solved: p.solved || 0 },
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
      const body = req.body || {};
      let bank = null;
      if (body.bankId !== undefined) {
        if (typeof body.bankId !== 'string' || !body.bankId || body.bankId.length > 80) throw fail(400, '문제은행을 선택해 주세요.');
        bank = await platform.readStackingRaceBank(req, body.bankId, body.questionIds);
      } else if (body.questionIds !== undefined) throw fail(400, '문제은행을 선택해 주세요.');
      const maximum = bank?.questions.length || MAX_ROUND;
      const count = roundSize(body.questionCount ?? Math.min(DEFAULT_ROUND, maximum), maximum);
      const code = await platform.roomCodes.allocate('stacking');
      const player = { id: crypto.randomUUID(), token: token(), host: true, name: '선생님' };
      const m = mode(req.body);
      const r = { code, mode: m, bank, count, questions: [], players: [player], phase: 'lobby', roundId: '', updated: now() };
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
      if (r.phase === 'racing') throw fail(409, '순위전이 진행 중이에요. 이번 판이 끝나면 입장해 주세요.');
      if (r.players.length >= 61) throw fail(409, '방에 60명이 모두 들어왔어요.');
      const identity = await platform.displayNameFor(req);
      const name = String(identity?.name || '').trim();
      if (!name || name.length > 40) throw fail(403, '메인 화면에서 이름을 확인하고 입장해 주세요.');
      if (students(r).some((p) => p.name === name))
        throw fail(409, '이미 같은 이름이 입장했어요. 원래 입장한 탭을 확인해 주세요.');
      const p = { id: crypto.randomUUID(), token: token(), name, host: false, solved: 0, time: null };
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
      if (r.phase === 'racing') throw fail(409, '이미 시작했어요.');
      if (!students(r).length) throw fail(409, '학생이 입장하면 시작할 수 있어요.');
      const count = roundSize(req.body?.questionCount ?? r.count, r.bank?.questions.length || MAX_ROUND);
      r.questions = r.bank ? drawFromBank(r.bank, count, r.questions) : generateRound(count, r.questions);
      r.count = count;
      r.mode = mode(req.body);
      r.roundId = crypto.randomUUID();
      r.phase = 'racing';
      r.startedAt = now();
      r.deadline = r.startedAt + ROUND_MS;
      r.updated = now();
      students(r).forEach((x) => {
        x.solved = 0;
        x.time = null;
      });
      res.json(state(r, p));
    }),
  );
  router.post(
    '/rooms/:code/answer',
    wrap(async (req, res) => {
      const { room: r, player: p } = member(req);
      if (p.host || req.body?.roundId !== r.roundId) throw fail(409, '현재 판의 답이 아니에요.');
      const index = req.body?.index;
      // A retried request for an already solved question must not count twice.
      if (Number.isInteger(index) && index < p.solved) return res.json({ correct: true, mismatches: [], state: state(r, p) });
      if (r.phase !== 'racing') throw fail(409, '이번 판이 끝났어요.');
      if (index !== p.solved) throw fail(409, '지금 풀고 있는 문제가 아니에요.');
      const answer = Activities.check(req.body?.heights, r.questions[index], r.mode);
      if (answer.correct) {
        p.solved++;
        p.time = now() - r.startedAt;
        r.updated = now();
        if (students(r).every((x) => x.solved >= r.questions.length)) finish(r);
      }
      res.json({ correct: answer.correct, mismatches: answer.mismatches, state: state(r, p) });
    }),
  );
  router.post(
    '/rooms/:code/stop',
    wrap(async (req, res) => {
      const { room: r, player: p } = await host(req);
      if (r.phase !== 'racing') throw fail(409, '진행 중인 판이 없어요.');
      finish(r);
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
        if (r.phase === 'racing' && students(r).every((x) => x.solved >= r.questions.length)) finish(r);
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
module.exports = { createStackingCubes };
