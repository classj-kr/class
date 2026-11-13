const test = require('node:test');
const assert = require('node:assert/strict');
const { createHarness } = require('./learning-boards-harness.cjs');
const { buildArtQuiz } = require('../game-hub-server/learning-board-art-quiz');

const PNG = Buffer.from('89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4890000000d49444154789c6360f8cfc0f01f0005000201a2b2b1c50000000049454e44ae426082', 'hex');

test('art quiz asks for typed names and offers distinct titles without showing the picture', () => {
  const works = ['가', '나', '다', '라', '마'].map((name, i) => ({ postId: 'p' + i, imageId: 'i' + i, title: `그림${i}`, decoys: [], author: `${i + 1}번 ${name}`, artistName: name, memberId: 'm' + i, number: i + 1 }));
  works[0].decoys = ['가짜1', '가짜2', '가짜3'];
  const qs = buildArtQuiz(works);
  assert.equal(qs.length, 11);
  for (const q of qs) {
    const w = works.find(x => x.postId === q.sourceId);
    if (q.kind === 'text') {
      assert.deepEqual(q.choices, []); assert.equal(q.answer, w.artistName); assert.equal(q.image, w.imageId);
      continue;
    }
    assert.equal(q.choices.length, 4); assert.equal(new Set(q.choices).size, 4);
    assert.equal(q.choices[q.answer], w.title);
    if (q.image) {
      assert.equal(q.content, '이 그림의 제목은?');
      assert.deepEqual([...q.choices].sort(), ['가짜1', '가짜2', '가짜3', '그림0']);
      assert.equal(q.image, w.imageId);
    } else assert.match(q.content, /학생이 올린 작품의 제목은/);
  }
  const few = works.slice(1, 3);
  assert.ok(buildArtQuiz(few).every(q => q.kind === 'text'));
  const [anonymous] = buildArtQuiz([{ ...few[0], numberOnly: true, artistName: '2번' }]);
  assert.equal(anonymous.content, '이 그림을 올린 학생의 번호는?');
  assert.equal(anonymous.answer, '2번');
});

test('teacher starts an art quiz race from a picture board', async () => {
  let time = Date.now();
  const h = await createHarness({ now: () => time }), teacher = 'test_teacher=1';
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
    await req(base + '/art-quiz', 'POST', {}, teacher, 409);
    const kids = [];
    for (const [n, name] of [[1, '가람'], [2, '나래'], [3, '다솜']]) kids.push((await req('/join', 'POST', { code: board.code, name, number: n }, '')).cookie);
    for (const [i, c] of kids.entries()) await share(board.id, c, `작품${i}`);
    await req(base + '/art-quiz', 'POST', {}, kids[0], 401);
    // Fake titles: only the artist (or teacher) writes them, and only the artist/teacher sees them.
    let posts = (await req(base, 'GET', undefined, kids[0])).posts;
    const mine = posts.find(p => p.mine), other = posts.find(p => !p.mine);
    assert.deepEqual(mine.decoys, []); assert.equal(other.decoys, undefined);
    await req(`${base}/posts/${other.id}/decoys`, 'PUT', { decoys: ['a', 'b', 'c'] }, kids[0], 403);
    await req(`${base}/posts/${mine.id}/decoys`, 'PUT', { decoys: ['a', 'b'] }, kids[0], 400);
    await req(`${base}/posts/${mine.id}/decoys`, 'PUT', { decoys: ['a', 'a', 'c'] }, kids[0], 400);
    await req(`${base}/posts/${mine.id}/decoys`, 'PUT', { decoys: [mine.content, 'b', 'c'] }, kids[0], 400);
    await req(`${base}/posts/${mine.id}/decoys`, 'PUT', { decoys: ['봄 소풍', '겨울 바다', '우리 집'] }, kids[0]);
    assert.deepEqual((await req(base, 'GET', undefined, kids[0])).posts.find(p => p.id === mine.id).decoys, ['봄 소풍', '겨울 바다', '우리 집']);
    assert.equal((await req(base, 'GET', undefined, kids[1])).posts.find(p => p.id === mine.id).decoys, undefined);
    const titleOnly = await req(base + '/art-quiz', 'POST', {}, teacher, 201);
    const s = (await h.pool.query('SELECT state FROM learning_board_races WHERE id=$1', [titleOnly.id])).rows[0].state;
    assert.equal(s.questions.length, 5); assert.ok(s.questions.some(q => q.content === '이 그림의 제목은?'));
    await req(`${base}/races/${titleOnly.id}/control`, 'POST', { action: 'finish', index: -1, phase: 'lobby' });
    const fourth = (await req('/join', 'POST', { code: board.code, name: '라온', number: 4 }, '')).cookie;
    await share(board.id, fourth, '작품3');
    const race = await req(base + '/art-quiz', 'POST', { seconds: 10 }, teacher, 201);
    assert.equal((await req(base + '/art-quiz', 'POST', {}, teacher, 201)).resumed, true);
    assert.equal((await req(base)).live.id, race.id, 'students are sent to the race');
    const r = `${base}/races/${race.id}`;
    await req(r + '/join', 'POST', {}, kids[1]);
    const started = await req(r + '/control', 'POST', { action: 'start', index: -1, phase: 'lobby' });
    assert.equal(started.total, 9);
    time += 3100;
    const view = await req(r, 'GET', undefined, kids[1]);
    assert.equal(view.phase, 'question');
    assert.match(view.question.image, /^[a-f\d-]{36}$/);
    assert.equal(view.question.kind, 'text');
    assert.equal(view.question.answer, undefined, 'answer stays secret while open');
    const img = await fetch(`${h.base}/api/boards/${board.id}/images/${view.question.image}`, { headers: { Cookie: kids[1] } });
    assert.equal(img.status, 200);
    const generated = (await h.pool.query('SELECT state FROM learning_board_races WHERE id=$1', [race.id])).rows[0].state.questions;
    const key = generated[0];
    await req(r + '/answer', 'POST', { questionId: view.question.id, text: key.authorNumber + '번 ' + key.answer }, kids[1]);
    const graded = await req(r, 'GET', undefined, kids[1]);
    assert.equal(graded.me.correct, true);
    time += 6001;
    await req(r, 'GET', undefined, kids[1]); // starts the next countdown
    time += 3001;
    const titleQuestion = (await req(r, 'GET', undefined, kids[1])).question;
    assert.equal(titleQuestion.image, undefined);
    assert.equal(titleQuestion.choices.length, 4);
    const quiz = (await req('/', 'POST', { title: '문제', layout: 'quiz' }, teacher, 201)).board;
    await req('/' + quiz.id + '/art-quiz', 'POST', {}, teacher, 400);
  } finally { await h.close(); }
});
