// 순위전 짝 찾기 방식: 개인전 판정·벌칙·끝낸 순서, 팀전 판 공유를 서버만으로 시험한다(가짜 로그인).
//   node tests/korean-race-match.test.cjs
'use strict';
const assert = require('node:assert/strict');
const express = require('../game-hub-server/node_modules/express');
const { createKoreanRace } = require('../game-hub-server/korean-race');

let clock = 1_000_000;
const now = () => clock;
let codeNo = 1000;
const platform = {
  configuration: () => ({ enabled: true }),
  isTeacherRequest: async () => false,
  displayNameFor: async (req) => ({ name: decodeURIComponent(req.get('x-name') || '') }),
  roomCodes: { allocate: async () => String(codeNo++) },
  canBypassGlobalContentLock: async () => true,
  isContentGloballyDisabled: async () => false,
};
const race = createKoreanRace({ platform, now });
const app = express();
app.use(express.json());
app.use('/api', race.router);
app.use((error, _req, res, _next) => res.status(error.status || 500).json({ error: error.message }));

(async () => {
  const server = app.listen(0);
  const base = `http://127.0.0.1:${server.address().port}/api`;
  const call = async (path, { name, token, body } = {}) => {
    const res = await fetch(base + path, {
      method: body ? 'POST' : 'GET',
      headers: { 'content-type': 'application/json', 'x-name': encodeURIComponent(name || ''), ...(token ? { authorization: 'Bearer ' + token } : {}) },
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await res.json();
    return { status: res.status, ...data };
  };
  // 서버만 아는 짝을 시험에서는 글로 되짚는다: 같은 판을 다시 만들 수 없으니 상태의 글과 은행 짝을 맞춘다.
  const bank = require('../game-hub-server/korean-race-bank');
  const Q = require('../learning/literacy-numeracy/korean-race/korean-race-questions');
  const pools = bank.load();
  // 비슷한 말은 엇갈려도 맞는 말이 되니 한 판에 함께 나오지 않는다.
  for (let i = 0; i < 300; i++) {
    const words = new Set(Q.makePairs(pools, { set: 'vocabulary', level: 'all', count: 30 }).map(([word]) => word));
    assert.equal(words.size, 30, '영어 30쌍');
    assert.ok(!(words.has('big') && words.has('large')), 'big·large 같은 판 금지');
    assert.ok(!(words.has('consist') && words.has('compose')), '구성되다·구성하다 같은 판 금지');
  }
  // 은행의 모든 짝(겹치는 앞 패 포함)을 두고, 판 위에서 짝이 되는 패를 찾는다(판은 앞·뒤 패가 겹치지 않게 뽑힌다).
  const known = new Set(pools.idioms.filter((e) => e.pair).map((e) => e.pair.join('|')));
  const partnerOf = (cells, i) => {
    const c = cells[i];
    return cells.findIndex((x, k) => k !== i && x && x.side !== c.side && known.has(c.side === 0 ? `${c.text}|${x.text}` : `${x.text}|${c.text}`));
  };
  // 개인전
  const host = await call('/rooms', { name: '방장', body: { set: 'idioms', mode: 'match', board: 'small' } });
  assert.equal(host.state.config.mode, 'match');
  const code = host.state.code;
  const kid = await call(`/rooms/${code}/join`, { name: '학생', body: {} });
  let s = await call(`/rooms/${code}/start`, { name: '방장', token: host.token, body: { set: 'idioms', mode: 'match', board: 'small' } });
  assert.equal(s.phase, 'running');
  assert.ok(s.me.match && s.me.match.cells.length === 24, '판 24칸');
  assert.equal(s.me.question, null);
  clock += 4000; // 출발 신호 뒤
  const cells = s.me.match.cells;
  const first = cells.findIndex((c) => c && c.side === 0);
  const right = partnerOf(cells, first);
  assert.ok(right >= 0, '짝을 찾음');
  const wrong = cells.findIndex((c, k) => c && c.side === 1 && k !== right);
  let r = await call(`/rooms/${code}/match`, { name: '방장', token: host.token, body: { roundId: s.roundId, a: first, b: wrong } });
  assert.equal(r.correct, false);
  assert.equal(r.penalty, 5);
  r = await call(`/rooms/${code}/match`, { name: '방장', token: host.token, body: { roundId: s.roundId, a: first, b: right } });
  assert.equal(r.correct, true);
  assert.deepEqual(r.state.me.match.cleared.sort(), [first, right].sort());
  // 학생 판은 따로다.
  const kidState = await call(`/rooms/${code}`, { name: '학생', token: kid.token });
  assert.equal(kidState.me.match.cleared.length, 0);
  // 방장이 판을 다 지운다.
  let mine = r.state.me.match;
  while (mine.cleared.length < mine.cells.filter(Boolean).length) {
    clock += 500;
    const i = mine.cells.findIndex((c, k) => c && c.side === 0 && !mine.cleared.includes(k));
    const j = partnerOf(mine.cells, i);
    r = await call(`/rooms/${code}/match`, { name: '방장', token: host.token, body: { roundId: s.roundId, a: i, b: j } });
    assert.equal(r.correct, true);
    mine = r.state.me.match;
  }
  assert.equal(mine.finished, true);
  assert.equal(r.state.participants[0].name, '방장', '먼저 다 지운 사람이 1등');
  // 학생도 다 지우면 바로 결과로.
  let km = kidState.me.match;
  while (km.cleared.length < km.cells.filter(Boolean).length) {
    clock += 300;
    const i = km.cells.findIndex((c, k) => c && c.side === 0 && !km.cleared.includes(k));
    r = await call(`/rooms/${code}/match`, { name: '학생', token: kid.token, body: { roundId: s.roundId, a: i, b: partnerOf(km.cells, i) } });
    km = r.state.me.match;
  }
  clock += 2000;
  s = await call(`/rooms/${code}`, { name: '방장', token: host.token });
  assert.equal(s.phase, 'results', '모두 다 지우면 결과');
  console.log('개인전: 판정·벌칙·순위·끝 OK');

  // 팀전: 같은 팀 두 사람이 판 하나를 함께 쓴다.
  const h2 = await call('/rooms', { name: '선생', body: { set: 'idioms', mode: 'match', board: 'small', teamMode: true, teamCount: 2, teamSize: 2 } });
  const c2 = h2.state.code;
  const a1 = await call(`/rooms/${c2}/join`, { name: '가람', body: {} });
  const a2 = await call(`/rooms/${c2}/join`, { name: '나래', body: {} });
  await call(`/rooms/${c2}/team`, { name: '선생', token: h2.token, body: { team: 1 } });
  await call(`/rooms/${c2}/team`, { name: '가람', token: a1.token, body: { team: 0 } });
  await call(`/rooms/${c2}/team`, { name: '나래', token: a2.token, body: { team: 0 } });
  s = await call(`/rooms/${c2}/start`, { name: '선생', token: h2.token, body: { set: 'idioms', mode: 'match', board: 'small', teamMode: true, teamCount: 2, teamSize: 2 } });
  assert.equal(s.phase, 'running', JSON.stringify(s.error));
  clock += 4000;
  const g = (await call(`/rooms/${c2}`, { name: '가람', token: a1.token })).me.match;
  const i = g.cells.findIndex((c) => c && c.side === 0);
  r = await call(`/rooms/${c2}/match`, { name: '가람', token: a1.token, body: { roundId: s.roundId, a: i, b: partnerOf(g.cells, i) } });
  assert.equal(r.correct, true);
  const n = (await call(`/rooms/${c2}`, { name: '나래', token: a2.token })).me.match;
  assert.deepEqual(n.cleared.sort(), [i, partnerOf(g.cells, i)].sort(), '팀원 화면에도 지워짐');
  const other = (await call(`/rooms/${c2}`, { name: '선생', token: h2.token })).me.match;
  assert.equal(other.cleared.length, 0, '다른 팀 판은 그대로');
  r = await call(`/rooms/${c2}/match`, { name: '나래', token: a2.token, body: { roundId: s.roundId, a: i, b: partnerOf(g.cells, i) } });
  assert.equal(r.gone, true, '이미 지운 패는 점수 없이 판만 맞춤');
  console.log('팀전: 판 공유 OK');

  // 짝이 없는 콘텐츠(맞춤법)는 늘 문제 풀이.
  const sp = await call('/rooms', { name: '맞춤', body: { set: 'spelling', mode: 'match' } });
  assert.equal(sp.state.config.mode, 'quiz');
  console.log('맞춤법은 문제 풀이로 남음 OK');
  server.close();
})().catch((error) => { console.error(error); process.exit(1); });
