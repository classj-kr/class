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
  const expectMin = { spelling: 300, idioms: 100, proverbs: 100, expressions: 100, vocabulary: 2000, hanja: 900, sentences: 72, textbook: 5000 };
  for (const [set, min] of Object.entries(expectMin)) assert.ok(pools[set].length >= min, `${set}: ${pools[set].length}`);
  let seed = 7;
  const random = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  for (const set of Object.keys(Core.SETS)) {
    for (const [level] of Core.levelsOf(set) || [['all']]) {
      const items = Questions.makeRound(pools, { set, level, count: 200, random });
      assert.ok(items.length >= 190, `${set}/${level}: ${items.length}`);
      for (const q of items) {
        const want = Core.SETS[q.set].choices;
        // 문장 고르기의 ①~⑤ 문장 번호 고르기는 보기가 다섯이다.
        const numbered = q.set === 'sentences' && q.choices.every((c) => /^[①-⑤]$/.test(c));
        assert.equal(q.choices.length, numbered ? 5 : want, `${q.key} has ${want} choices`);
        assert.equal(new Set(q.choices).size, q.choices.length, `${q.key} choices are distinct`);
        assert.ok(q.answer >= 0 && q.answer < q.choices.length, q.key);
        // 상황 글이 없는 문장 고르기 문제는 지시문을 글자리에 크게 두고 작은 지시 줄은 비운다.
        assert.ok(q.text && (q.ask || q.set === 'sentences'), q.key);
        assert.equal(q.set, set);
      }
      for (let i = 1; i < items.length; i++) assert.notEqual(items[i].key, items[i - 1].key, 'no question twice in a row');
    }
  }
  assert.equal(Questions.shortMeaning({ meanings: ['(음식) 빵. (비유) 생계.'] }), '빵');
  assert.equal(Questions.shortMeaning({ meanings: ['덮다, 씌우다. / 덮어서 가리다'] }), '덮다, 씌우다');
});

test('the public question never carries the answer or explanation', () => {
  const pub = Questions.publicQuestion({ set: 'spelling', ask: 'a', text: 'b', choices: ['x', 'y'], answer: 1, explain: 'z', key: 'k', block: '가', collect: 'y' }, 3, '맞춤법');
  // tried: 이 문제에서 이미 골라 틀린 보기(줄 그은 보기). 정답이 아니라 화면에 남길 오답 자리다.
  assert.deepEqual(Object.keys(pub).sort(), ['ask', 'choices', 'label', 'no', 'set', 'text', 'tried']);
  assert.deepEqual(pub.tried, []);
});

test('hanja questions come from the 25 stage quizzes, mark the asked word and never show the answer hanja', () => {
  const pools = bank.load();
  const han = /\p{Script=Han}/u;
  const stages = new Set(pools.hanja.map((e) => e.lesson));
  assert.deepEqual([...stages].sort((a, b) => a - b), Array.from({ length: 25 }, (_, i) => i + 1), 'every stage has questions');
  let seed = 11;
  const random = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  let huneum = 0, whole = 0;
  for (const entry of pools.hanja) {
    const q = entry.make(random);
    assert.equal(q.choices.length, 4, entry.key);
    assert.equal(new Set(q.choices).size, 4, entry.key);
    assert.ok(han.test(q.text) && q.collect && q.block, entry.key);
    if (q.ask.includes('훈과 음')) {
      huneum++;
      assert.ok(q.choices.every((c) => !han.test(c) && !c.includes('{{')), entry.key);
      continue;
    }
    for (const choice of q.choices) {
      assert.equal((choice.match(/\{\{/g) || []).length, 1, `${entry.key}: one underlined word in ${choice}`);
      assert.ok(!han.test(choice), `${entry.key}: no hanja in the choices`);
    }
    if (q.choices.every((c) => !c.includes('…'))) whole++;
  }
  assert.ok(huneum >= 10, `훈음 문항 ${huneum}`);
  assert.ok(whole >= 100, `예문을 다 보여 주는 문항 ${whole}`);
  // 낱말만으로 뜻이 갈리는 문항은 예문을 다 보여 준다(부자: 富者/父子).
  const rich = pools.hanja.find((e) => e.key === 'hanja:父|부자').make(random);
  assert.ok(rich.choices.every((c) => !c.includes('…')));
  assert.equal(Questions.hanjaClip('지역별 {{인구}} 변화는 주택과 교통, 학교, 의료 시설의 수요를 예측합니다.', '인구'), '지역별 {{인구}} 변화는 주택과…');
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
    tick(900);
    const r = (await answer(0)).data;
    assert.equal(r.correct, true);
    gains.push(r.gained);
    index++;
  }
  assert.deepEqual(gains, [1, 1, 1, 1, 2, 2, 2, 2, 2, 3]);
  assert.equal((await req(path + '/answer', { roundId, index: index - 1, choice: 0 }, kid.token)).status, 409, 'the same question counts once');
  tick(100);
  assert.equal((await answer(0)).status, 429, 'too fast to read');
  tick(900);
  const wrong = (await answer(1)).data;
  assert.equal(wrong.correct, false);
  assert.equal(wrong.answer, undefined, 'a wrong pick does not reveal the answer');
  assert.equal(wrong.explain, undefined);
  assert.equal(wrong.gained, -1);
  assert.equal(wrong.combo, 0);
  assert.deepEqual(wrong.tried, [1]);
  assert.equal(wrong.state.me.index, index, 'a wrong pick stays on the same question');
  assert.deepEqual(wrong.state.me.question.tried, [1], 'the crossed-out choice survives a reload');
  tick(900);
  assert.equal((await answer(0)).status, 429, 'a pause before trying again');
  tick(600);
  assert.equal((await answer(1)).status, 409, 'the same wrong choice is not charged twice');
  const retry = (await answer(0)).data;
  assert.equal(retry.correct, true);
  assert.equal(retry.retried, true);
  assert.equal(retry.explain, '풀이', 'the explanation comes after solving it');
  assert.equal(retry.gained, 1, 'the combo starts over after a mistake');
  index++;
  tick(900);
  me = (await answer(0)).data.state.me;
  assert.equal(me.score, 17 - 1 + 1 + 1);
  assert.equal(me.correct, 12);
  assert.equal(me.wrong, 1);
  assert.equal(me.blocks.length, 12);
  assert.deepEqual(me.question.tried, [], 'a new question starts clean');
  // 틀릴 때마다 깎이므로 0점 아래로도 내려간다.
  const fresh = (await req(path + '/join', {}, '', '', '바다')).data;
  tick(900);
  const below = (await req(path + '/answer', { roundId, index: 0, choice: 1 }, fresh.token)).data;
  assert.equal(below.state.me.score, -1);
  tick(900);
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
  const made = (await req('/rooms', { set: 'proverbs', teamMode: true, teamCount: 2 }, '', 'teacher')).data;
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
  tick(3600 + 900);
  const r = (await req(path + '/answer', { roundId: started.roundId, index: 0, choice: 0 }, late.token)).data;
  assert.equal(r.correct, true);
  assert.equal(r.state.teams[late.state.me.team].value, 1);
});

test('sentence choice races use only the choice tasks and show what the app shows', () => {
  const course = (() => {
    const vm = require('node:vm'), fs = require('node:fs');
    const context = vm.createContext({ window: {} });
    vm.runInContext(fs.readFileSync(require.resolve('../learning/literacy-numeracy/sentence-building/curriculum.js'), 'utf8'), context);
    return context.window.SENTENCE_COURSE;
  })();
  const tasks = course.lessons.flatMap((lesson, i) => lesson.tasks.filter((task) => task.type === 'choice').map((task) => ({ task, lesson: i + 1 })));
  const pools = bank.load();
  assert.equal(pools.sentences.length, tasks.length, 'every choice task, and nothing else');
  assert.ok(pools.sentences.every((e) => e.lesson >= 1 && e.lesson <= 24));
  pools.sentences.forEach((entry, i) => {
    const { task } = tasks[i];
    const q = entry.make(Math.random);
    assert.equal(q.choices[q.answer], task.options[task.answer], `${entry.key}: the right option is the app's answer`);
    assert.deepEqual([...q.choices].sort(), [...task.options].sort());
    if (task.scene) {
      assert.equal(q.ask, task.prompt);
      assert.equal(q.text.replace(/\n/g, ' '), task.scene.replace(/\s*([②-⑳])/g, ' $1'), `${entry.key}: the passage is all there`);
    } else assert.equal(q.text, task.prompt);
    if (task.shuffleOptions === false) assert.deepEqual(q.choices, [...task.options], `${entry.key}: numbered options keep their order`);
  });
  // 한 차시에 고르기 문제가 셋뿐이라 "처음부터 거기까지"만 있다. 1차시까지면 전체.
  assert.equal(Core.validRange('sentences', '5'), '~5');
  assert.equal(Core.validRange('sentences', '~5'), '~5');
  assert.equal(Core.validRange('sentences', '1'), null);
  assert.equal(Core.validRange('sentences', '25'), null);
  assert.equal(Core.rangeLabel('sentences', '~5'), '처음~5차시');
  assert.equal(Questions.poolFor(pools, 'sentences', 'all', '~2').length, 6);
  const round = Questions.makeRound(pools, { set: 'sentences', range: '~2', count: 110, random: Math.random });
  assert.equal(round.length, 110);
  for (let i = 1; i < round.length; i++) assert.notEqual(round[i].key, round[i - 1].key);
});

test('a class can race in up to eight teams', async (t) => {
  const { req } = await serve(t);
  assert.deepEqual(Core.TEAMS.map((x) => x.name), ['빨강', '파랑', '노랑', '초록', '보라', '주황', '분홍', '하늘']);
  assert.equal(new Set(Core.TEAMS.map((x) => x.hue)).size, 8, 'every team has its own colour');
  const made = (await req('/rooms', { set: 'spelling', teamMode: true, teamCount: 8 }, '', 'teacher')).data;
  assert.equal(made.state.config.teamCount, 8);
  const host = made.token, path = '/rooms/' + made.state.code;
  assert.equal((await req(path + '/settings', { teamCount: 9 }, host, 'teacher')).data.config.teamCount, 8, 'nine teams is not a choice');
  const kids = [];
  for (let i = 0; i < 17; i++) kids.push((await req(path + '/join', {}, '', '', '학생' + i)).data);
  assert.equal((await req(path + '/team', { team: 7 }, kids[0].token)).status, 200, 'the eighth team can be picked');
  assert.equal((await req(path + '/team', { team: 8 }, kids[1].token)).status, 400);
  const started = (await req(path + '/start', {}, host, 'teacher')).data;
  assert.equal(started.teams.length, 8);
  assert.ok(started.teams.every((team) => team.size >= 2), 'students spread over all eight teams');
  assert.equal(started.teams[7].name, '하늘');
});

test('a set whose learning page is globally closed cannot be raced', async (t) => {
  const { req } = await serve(t, { disabled: async (path) => path.endsWith('/spelling') });
  assert.equal((await req('/rooms', { set: 'spelling' }, '', 'teacher')).status, 403);
  const open = (await req('/rooms', { set: 'proverbs' }, '', 'teacher')).data;
  const path = '/rooms/' + open.state.code;
  await req(path + '/join', {}, '', '', '가');
  const started = (await req(path + '/start', {}, open.token, 'teacher')).data;
  assert.equal(started.phase, 'running', 'an open set still races');
});

test('a race opened from a lesson asks only that lesson, or everything up to it', () => {
  assert.equal(Core.validRange('vocabulary', '1-4'), '1-4');
  assert.equal(Core.validRange('vocabulary', '~2'), '~2');
  assert.equal(Core.validRange('spelling', '3'), '3');
  assert.equal(Core.validRange('spelling', '1-2'), null);
  assert.equal(Core.validRange('mixed', '1'), null);
  assert.equal(Core.SETS.mixed, undefined, 'no race mixes several apps');
  assert.equal(Core.rangeLabel('vocabulary', '~1-4'), '처음~Level 1 · 4차시');
  assert.equal(Core.rangeLabel('proverbs', '~1'), '1차시');
  assert.equal(Core.validRange('hanja', '25'), '25');
  assert.equal(Core.validRange('hanja', '~7'), '~7');
  assert.equal(Core.validRange('hanja', '26'), null);
  assert.equal(Core.rangeLabel('hanja', '7'), '7단계');
  assert.equal(Core.rangeLabel('hanja', '~7'), '1~7단계');
  assert.equal(Core.rangeLabel('hanja', '~1'), '1단계');
  const pools = bank.load();
  const lessonOne = Questions.poolFor(pools, 'vocabulary', 'elementary', '1-1').map((e) => e.key);
  assert.ok(lessonOne.length >= 18 && lessonOne.length <= 20, 'Level 1 · 1차시 keeps nearly all of its 20 words');
  assert.ok(lessonOne.includes('vocabulary:he') && lessonOne.includes('vocabulary:in'));
  assert.equal(Questions.poolFor(pools, 'vocabulary', 'elementary', '~1-2').length,
    lessonOne.length + Questions.poolFor(pools, 'vocabulary', 'elementary', '1-2').length);
  for (const set of ['spelling', 'idioms', 'proverbs', 'expressions']) {
    assert.ok(pools[set].every((e) => e.lesson >= 1), `${set}: every question belongs to a lesson`);
    const one = Questions.poolFor(pools, set, 'all', '1'), two = Questions.poolFor(pools, set, 'all', '2');
    assert.ok(one.length >= 4 && one.every((e) => e.lesson === 1));
    assert.equal(Questions.poolFor(pools, set, 'all', '~2').length, one.length + two.length);
  }
  // 한자 25단계: 단계마다 순위전 한 판을 꾸릴 만큼 문항이 있고, "~N"은 1단계부터 N단계까지다.
  let upto = 0;
  for (let stage = 1; stage <= 25; stage++) {
    const only = Questions.poolFor(pools, 'hanja', 'all', String(stage));
    assert.ok(only.length >= 20 && only.every((e) => e.lesson === stage), `${stage}단계: ${only.length}`);
    upto += only.length;
    assert.equal(Questions.poolFor(pools, 'hanja', 'all', '~' + stage).length, upto);
    const round = Questions.makeRound(pools, { set: 'hanja', range: String(stage), count: 110, random: Math.random });
    assert.equal(round.length, 110, `${stage}단계 한 판`);
    for (let i = 1; i < round.length; i++) assert.notEqual(round[i].key, round[i - 1].key);
  }
  // 한자성어 2차시는 네 개뿐이라 보기를 전체에서 고른다(늘 같은 네 개가 되지 않게).
  const round = Questions.makeRound(pools, { set: 'idioms', range: '2', count: 40, random: Math.random });
  assert.ok(new Set(round.map((q) => q.text)).size <= 4);
  assert.ok(new Set(round.flatMap((q) => q.choices)).size > 4);
});

test('the textbook race asks only the checked units', async (t) => {
  assert.equal(Core.validRange('textbook', '6-2.sci.1,6-2.kor.3'), '6-2.sci.1,6-2.kor.3');
  assert.equal(Core.validRange('textbook', '6-2.sci.1,nope'), null);
  assert.equal(Core.rangeLabel('textbook', '6-2.sci.1,6-2.sci.2,6-2.kor.3'), '6학년 2학기 과학 1·2단원, 국어 3단원');
  const pools = bank.load();
  const round = Questions.makeRound(pools, { set: 'textbook', range: '6-2.sci.1,6-2.kor.3', count: 120, random: Math.random });
  assert.equal(round.length, 120);
  for (const q of round) {
    assert.ok(/^textbook:6-2:(sci:1|kor:3):/.test(q.key), q.key);
    assert.equal(q.choices.length, 4);
    assert.equal(new Set(q.choices).size, 4, q.key);
  }
  const catalog = bank.textbookCatalog();
  assert.ok(catalog.some((term) => term.term === '6-2' && term.subjects.some((s) => s.code === 'sci' && s.units.length)));
  const { req } = await serve(t, { pools: bank.load });
  const made = (await req('/rooms', { set: 'textbook' }, '', 'teacher')).data;
  const path = '/rooms/' + made.state.code;
  await req(path + '/join', {}, '', '', '가');
  assert.equal((await req(path + '/start', {}, made.token, 'teacher')).status, 409, 'a textbook race needs an exam range');
  const started = (await req(path + '/start', { range: '6-2.sci.1' }, made.token, 'teacher')).data;
  assert.equal(started.phase, 'running');
});
