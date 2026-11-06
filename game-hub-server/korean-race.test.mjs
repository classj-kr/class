import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url),
  express = require('express');
const { createKoreanRace } = require('./korean-race'),
  { createRoomCodes } = require('./room-codes'),
  { createRoomEntry } = require('./room-entry');
const Core = require('../learning/literacy-numeracy/korean-race/korean-race-core');
const Questions = require('../learning/literacy-numeracy/korean-race/korean-race-questions');
const bank = require('./korean-race-bank');

test('combo worth, accuracy, ranking and team ties follow the shared rules', () => {
  assert.deepEqual([1, 4, 5, 9, 10, 30].map(Core.points), [1, 1, 2, 2, 3, 3]);
  assert.equal(Core.accuracy(3, 1), 75);
  assert.equal(Core.accuracy(0, 0), 100);
  const ranked = Core.rank([
    { name: '나', score: 10, correct: 8, accuracy: 80, scoredAt: 5 },
    { name: '가', score: 10, correct: 9, accuracy: 90, scoredAt: 9 },
    { name: '다', score: 12, correct: 6, accuracy: 60, scoredAt: 9 },
  ]);
  assert.deepEqual(ranked.map((r) => r.name), ['다', '가', '나']);
  const teams = Core.teamBoard([{ team: 0, score: 5, correct: 4 }, { team: 1, score: 5, correct: 4 }, { team: 2, score: 1, correct: 1 }], 3);
  assert.deepEqual(teams.map((t) => t.rank), [1, 1, 3], 'equal score and correct count share a rank');
  assert.equal(Core.validLevel('idioms', '고급'), '고급');
  assert.equal(Core.validLevel('idioms', 'nope'), 'all');
  assert.equal(Core.validLevel('vocabulary', 'all'), 'elementary');
  assert.equal(Core.validLevel('spelling', '고급'), 'all');
});

test('every set builds questions from the real learning data', () => {
  const pools = bank.load();
  const expectMin = { spelling: 300, idioms: 100, proverbs: 100, expressions: 100, vocabulary: 2000 };
  for (const [set, min] of Object.entries(expectMin)) assert.ok(pools[set].length >= min, `${set}: ${pools[set].length}`);
  let seed = 7;
  const random = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  for (const set of Object.keys(Core.SETS)) {
    for (const [level] of Core.levelsOf(set) || [['all']]) {
      const items = Questions.makeRound(pools, { set, level, count: 200, mixedParts: Core.MIXED_PARTS, random });
      assert.ok(items.length >= 190, `${set}/${level}: ${items.length}`);
      for (const q of items) {
        const want = Core.SETS[q.set].choices;
        assert.equal(q.choices.length, want, `${q.key} has ${want} choices`);
        assert.equal(new Set(q.choices).size, q.choices.length, `${q.key} choices are distinct`);
        assert.ok(q.answer >= 0 && q.answer < q.choices.length, q.key);
        assert.ok(q.text && q.ask, q.key);
        if (set !== 'mixed') assert.equal(q.set, set);
        else assert.ok(Core.MIXED_PARTS.includes(q.set), 'mixed never includes English words');
      }
      for (let i = 1; i < items.length; i++) assert.notEqual(items[i].key, items[i - 1].key, 'no question twice in a row');
    }
  }
  assert.equal(Questions.shortMeaning({ meanings: ['(음식) 빵. (비유) 생계.'] }), '빵');
  assert.equal(Questions.shortMeaning({ meanings: ['덮다, 씌우다. / 덮어서 가리다'] }), '덮다, 씌우다');
});

test('the public question never carries the answer or explanation', () => {
  const pub = Questions.publicQuestion({ set: 'spelling', ask: 'a', text: 'b', choices: ['x', 'y'], answer: 1, explain: 'z', key: 'k', block: '가' }, 3, '맞춤법');
  assert.deepEqual(Object.keys(pub).sort(), ['ask', 'choices', 'label', 'no', 'set', 'text']);
});

// 정답 자리를 알 수 있도록 문항을 꾸며 넣는다: 보기 0번이 늘 정답이다.
function fakePools() {
  const entry = (set, i) => ({ key: `${set}:${i}`, level: 'all', make: () => ({ set, ask: '고르세요', text: `${set} ${i}`, choices: ['정답', '오답'], answer: 0, explain: '풀이', block: '가' }) });
  const many = (set) => Array.from({ length: 20 }, (_, i) => entry(set, i));
  return { spelling: many('spelling'), idioms: many('idioms'), proverbs: many('proverbs'), expressions: many('expressions'), vocabulary: [] };
}

async function serve(t, options = {}) {
  let clock = Date.now();
  const codes = createRoomCodes({ random: () => 4321, isActive: async (e) => activity.hasRoomCode(e.code) });
  const platform = {
    roomCodes: codes,
    isTeacherRequest: async (req) => req.get('x-role') === 'teacher',
    isContentGloballyDisabled: options.disabled || (async () => false),
    canBypassGlobalContentLock: async () => false,
    displayNameFor: async (req) => ({ name: decodeURIComponent(req.get('x-name') || '') }),
  };
  const activity = createKoreanRace({ platform, now: () => clock, pools: options.pools || fakePools }), app = express();
  app.use(express.json());
  app.use('/api/korean-race', activity.router);
  app.use('/api/room-entry', createRoomEntry({ roomCodes: codes, koreanExists: (code) => activity.hasRoomCode(code) }));
  const s = app.listen(0, '127.0.0.1');
  await new Promise((r) => s.once('listening', r));
  t.after(() => new Promise((r) => s.close(r)));
  const base = `http://127.0.0.1:${s.address().port}`;
  const req = async (path, body, token = '', role = '', name = '') => {
    const r = await fetch(base + '/api/korean-race' + path, { method: body === undefined ? 'GET' : 'POST', headers: { 'Content-Type': 'application/json', 'x-role': role, 'x-name': encodeURIComponent(name), Authorization: 'Bearer ' + token }, ...(body === undefined ? {} : { body: JSON.stringify(body) }) });
    return { status: r.status, data: await r.json() };
  };
  return { req, base, tick: (ms) => (clock += ms), now: () => clock };
}

test('a race: room entry, hidden answers, combo points, wrong reveal lock, stale and fast answers', async (t) => {
  const { req, base, tick } = await serve(t);
  const made = (await req('/rooms', { set: 'spelling', duration: 60, spectate: true }, '', 'teacher')).data;
  assert.equal(made.state.me.plays, false, 'a teacher can show only the board');
  const host = made.token, code = made.state.code, path = '/rooms/' + code;
  const entry = await (await fetch(`${base}/api/room-entry/resolve/${code}`)).json();
  assert.equal(entry.href, `/learning/literacy-numeracy/korean-race/?room=${code}`);
  const kid = (await req(path + '/join', { avatarUrl: '/assets/avatars/a.webp' }, '', '', '하늘')).data;
  assert.equal(kid.state.me.avatarUrl, '/assets/avatars/a.webp');
  assert.equal((await req(path + '/start', {}, kid.token, '', '하늘')).status, 403, 'only the host starts');
  const started = (await req(path + '/start', {}, host, 'teacher')).data;
  assert.equal(started.phase, 'running');
  assert.equal(started.me.question, null, 'the board-only teacher gets no question');
  assert.equal(started.participants.length, 1, 'the board-only teacher is not ranked');
  let me = (await req(path, undefined, kid.token)).data.me;
  assert.ok(me.question && !('answer' in me.question) && !('explain' in me.question), 'answers stay on the server');
  const roundId = started.roundId;
  assert.equal((await req(path + '/answer', { roundId, index: 0, choice: 0 }, kid.token)).status, 409, 'not before the countdown ends');
  tick(3600);
  let index = 0;
  const answer = (choice) => req(path + '/answer', { roundId, index, choice }, kid.token);
  const gains = [];
  for (let i = 0; i < 10; i++) {
    tick(400);
    const r = (await answer(0)).data;
    assert.equal(r.correct, true);
    gains.push(r.gained);
    index++;
  }
  assert.deepEqual(gains, [1, 1, 1, 1, 2, 2, 2, 2, 2, 3]);
  assert.equal((await req(path + '/answer', { roundId, index: index - 1, choice: 0 }, kid.token)).status, 409, 'the same question counts once');
  tick(100);
  assert.equal((await answer(0)).status, 429, 'too fast to read');
  tick(400);
  const wrong = (await answer(1)).data;
  assert.equal(wrong.correct, false);
  assert.equal(wrong.answer, 0);
  assert.equal(wrong.explain, '풀이');
  assert.equal(wrong.gained, -1);
  assert.equal(wrong.combo, 0);
  index++;
  tick(600);
  assert.equal((await answer(0)).status, 429, 'no answers while the explanation shows');
  tick(800);
  me = (await answer(0)).data.state.me;
  assert.equal(me.score, 17 - 1 + 1);
  assert.equal(me.correct, 11);
  assert.equal(me.wrong, 1);
  assert.equal(me.blocks.length, 11);
  tick(400);
  assert.equal((await req(path + '/answer', { roundId, index: me.index, choice: 9 }, kid.token)).status, 400);
  // 새로고침한 학생은 같은 이름으로 자리를 되찾는다.
  const again = (await req(path + '/join', {}, '', '', '하늘')).data;
  assert.equal(again.state.me.score, me.score);
  assert.equal((await req(path, undefined, kid.token)).status, 403, 'the old tab is signed out');
  tick(60 * 1000);
  const after = (await req(path, undefined, again.token)).data;
  assert.equal(after.phase, 'results');
  assert.equal(after.me.question, null);
  assert.equal((await req(path + '/lobby', {}, host, 'teacher')).data.participants[0].score, 0);
  assert.equal((await req(path + '/leave', {}, host)).status, 200);
  assert.equal((await req(path, undefined, again.token)).status, 404, 'closing the room ends it for everyone');
});

test('team race fills unassigned students at start and places late joiners', async (t) => {
  const { req, tick } = await serve(t);
  const made = (await req('/rooms', { set: 'mixed', teamMode: true, teamCount: 2 }, '', 'teacher')).data;
  const host = made.token, path = '/rooms/' + made.state.code;
  const kids = [];
  for (const name of ['가', '나', '다']) kids.push((await req(path + '/join', {}, '', '', name)).data);
  assert.equal((await req(path + '/team', { team: 0 }, kids[0].token)).status, 200);
  const started = (await req(path + '/start', {}, host, 'teacher')).data;
  assert.equal(started.phase, 'running');
  assert.ok(started.participants.every((p) => p.team !== null), 'nobody is left without a team');
  assert.ok(started.teams.filter((t) => t.size).length === 2);
  const late = (await req(path + '/join', {}, '', '', '라')).data;
  assert.notEqual(late.state.me.team, null);
  assert.ok(late.state.me.question, 'a late joiner starts from the first question');
  tick(3600 + 400);
  const r = (await req(path + '/answer', { roundId: started.roundId, index: 0, choice: 0 }, late.token)).data;
  assert.equal(r.correct, true);
  assert.equal(r.state.teams[late.state.me.team].value, 1);
});

test('a set whose learning page is globally closed cannot be raced', async (t) => {
  const { req } = await serve(t, { disabled: async (path) => path.endsWith('/spelling') });
  assert.equal((await req('/rooms', { set: 'spelling' }, '', 'teacher')).status, 403);
  const mixed = (await req('/rooms', { set: 'mixed' }, '', 'teacher')).data;
  const path = '/rooms/' + mixed.state.code;
  await req(path + '/join', {}, '', '', '가');
  const started = (await req(path + '/start', {}, mixed.token, 'teacher')).data;
  assert.equal(started.phase, 'running', 'mixed races the open parts only');
  assert.equal((await req(path + '/settings', { set: 'spelling' }, mixed.token, 'teacher')).status, 409);
});
