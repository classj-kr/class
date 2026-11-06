const test = require('node:test');
const assert = require('node:assert/strict');
const { createHarness } = require('./learning-boards-harness.cjs');
const { buildArtQuiz } = require('../game-hub-server/learning-board-art-quiz');

const PNG = Buffer.from('89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4890000000d49444154789c6360f8cfc0f01f0005000201a2b2b1c50000000049454e44ae426082', 'hex');

test('art quiz questions use classmates as distractors', () => {
  const works = ['가', '나', '다', '라', '마'].map((name, i) => ({ postId: 'p' + i, imageId: 'i' + i, title: `그림${i}`, author: `${i + 1}번 ${name}`, memberId: 'm' + i, number: i + 1 }));
  const qs = buildArtQuiz(works);
  assert.equal(qs.length, 5);
  for (const q of qs) {
    const w = works.find(x => x.postId === q.sourceId);
    assert.equal(q.choices.length, 4); assert.equal(new Set(q.choices).size, 4);
    assert.ok(['이 그림의 작가는?', '이 그림의 제목은?'].includes(q.content));
    assert.equal(q.choices[q.answer], q.content === '이 그림의 작가는?' ? w.author : w.title);
    assert.equal(q.image, w.imageId);
  }
  assert.ok(qs.some(q => q.content === '이 그림의 작가는?') && qs.some(q => q.content === '이 그림의 제목은?'));
  // One author with many pictures: only title questions are possible.
  const solo = works.map(w => ({ ...w, author: '1번 가' }));
  assert.ok(buildArtQuiz(solo).every(q => q.content === '이 그림의 제목은?'));
  assert.deepEqual(buildArtQuiz(works.slice(0, 3)), []);
});

test('teacher starts an art quiz race from a picture board', async () => {
  const h = await createHarness(), teacher = 'test_teacher=1';
  async function req(path, method = 'GET', body, cookie = teacher, status = 200) {
    const res = await fetch(h.base + '/api/boards' + path, { method,
      headers: { 'Content-Type': 'application/json', Cookie: cookie }, body: body === undefined ? undefined : JSON.stringify(body) });
    const value = await res.json(); assert.equal(res.status, status, JSON.stringify(value));
    return { ...value, cookie: res.headers.get('set-cookie')?.split(';')[0] };
  }
  async function share(boardId, cookie, title) {
    const res = await fetch(`${h.base}/api/boards/${boardId}/images`, { method: 'POST', headers: { 'Content-Type': 'image/png', Cookie: cookie }, body: PNG });
    const { id } = await res.json();
    return req(`/${boardId}/posts`, 'POST', { content: title, image: id }, cookie, 201);
  }
  try {
    const { board } = await req('/', 'POST', { title: '그림 전시', layout: 'wall' }, teacher, 201);
    const base = '/' + board.id;
    const kids = [];
    for (const [n, name] of [[1, '가람'], [2, '나래'], [3, '다솜']]) kids.push((await req('/join', 'POST', { code: board.code, name, number: n }, '')).cookie);
    for (const [i, c] of kids.entries()) await share(board.id, c, `작품${i}`);
    await req(base + '/art-quiz', 'POST', {}, kids[0], 401);
    await req(base + '/art-quiz', 'POST', {}, teacher, 409); // only 3 distinct authors/titles
    const fourth = (await req('/join', 'POST', { code: board.code, name: '라온', number: 4 }, '')).cookie;
    await share(board.id, fourth, '작품3');
    const race = await req(base + '/art-quiz', 'POST', { seconds: 10 }, teacher, 201);
    assert.equal((await req(base + '/art-quiz', 'POST', {}, teacher, 201)).resumed, true);
    assert.equal((await req(base)).live.id, race.id, 'students are sent to the race');
    const r = `${base}/races/${race.id}`;
    await req(r + '/join', 'POST', {}, kids[1]);
    const started = await req(r + '/control', 'POST', { action: 'start', index: -1, phase: 'lobby' });
    assert.equal(started.total, 4);
    await new Promise(resolve => setTimeout(resolve, 3100));
    const view = await req(r, 'GET', undefined, kids[1]);
    assert.equal(view.phase, 'question');
    assert.match(view.question.image, /^[a-f\d-]{36}$/);
    assert.equal(view.question.answer, undefined, 'answer stays secret while open');
    const img = await fetch(`${h.base}/api/boards/${board.id}/images/${view.question.image}`, { headers: { Cookie: kids[1] } });
    assert.equal(img.status, 200);
    const quiz = (await req('/', 'POST', { title: '문제', layout: 'quiz' }, teacher, 201)).board;
    await req('/' + quiz.id + '/art-quiz', 'POST', {}, teacher, 400);
  } finally { await h.close(); }
});
