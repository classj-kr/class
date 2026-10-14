// Local-only preview: isolated in-memory DB, synthetic students, no production data.
const { createHarness } = require('../tests/learning-boards-harness.cjs');

(async () => {
  const h = await createHarness();
  const teacher = 'test_teacher=1';
  async function api(route, method = 'GET', body, cookie = teacher) {
    const res = await fetch(h.base + '/api/boards' + route, { method,
      headers: { 'Content-Type': 'application/json', Cookie: cookie }, body: body === undefined ? undefined : JSON.stringify(body) });
    const data = await res.json(); if (!res.ok) throw new Error(data.message);
    return { ...data, cookie: res.headers.get('set-cookie')?.split(';')[0] };
  }
  const { board } = await api('/', 'POST', { title: '경주 체험 · 가상 학생', layout: 'quiz', slots: 30 });
  const base = '/' + board.id;
  const items = [
    { kind: 'choice', content: '태양계에서 가장 큰 행성은?', choices: ['지구', '목성', '화성', '금성'], answer: 1, explanation: '목성은 태양계에서 가장 큰 행성입니다.' },
    { kind: 'ox', content: '물은 얼음이 되면 부피가 커진다.', answer: 0 },
    { kind: 'choice', content: '삼각형의 세 내각의 합은?', choices: ['90°', '180°', '270°', '360°'], answer: 1 },
    { kind: 'choice', content: '식물이 광합성에 사용하는 기체는?', choices: ['산소', '이산화 탄소', '수소', '헬륨'], answer: 1 },
    { kind: 'ox', content: '달은 스스로 빛을 낸다.', answer: 1, explanation: '달은 태양빛을 반사합니다.' }
  ];
  const posts = [];
  for (const item of items) {
    const { id } = await api(base + '/posts', 'POST', item);
    await api(base + '/posts/' + id + '/review', 'POST', { revision: 1, status: 'approved' });
    posts.push({ id, revision: 2 });
  }
  const set = await api(base + '/sets', 'POST', { title: '체험 5문제', posts });
  const names = ['김민준', '서하윤', '이도윤', '박서연', '정지호', '최지우', '한예준', '윤서아', '김수빈', '이하준', '박도현', '정예린', '오유찬', '강채원', '송지안', '조우진', '권시우', '임다은', '장하린', '신건우', '문서준', '백예은', '유태윤', '홍수아'];
  const bots = [];
  for (const [i, name] of names.entries()) bots.push((await api('/join', 'POST', { code: board.code, number: i + 1, name }, '')).cookie);
  let raceId = (await api(base + '/races', 'POST', { setId: set.id, seconds: 20 })).id;
  for (const cookie of bots) await api(base + '/races/' + raceId + '/join', 'POST', {}, cookie);
  const liveUrl = () => `/boards/live.html?id=${board.id}&game=${raceId}`;
  h.app.get('/demo/teacher', (_req, res) => { res.cookie('test_teacher', '1', { sameSite: 'lax' }); res.redirect(liveUrl()); });
  h.app.get('/demo/student', async (_req, res, next) => {
    try { await api('/join', 'POST', { code: board.code }, 'test_student=3'); res.cookie('test_student', '3', { sameSite: 'lax' }); res.redirect(liveUrl()); }
    catch (error) { next(error); }
  });
  let running = false;
  const submitted = new Set();
  const timer = setInterval(async () => {
    if (running) return; running = true;
    try {
      const { live } = await api(base);
      if (live && live.id !== raceId) {
        raceId = live.id; submitted.clear();
        for (const cookie of bots) await api(base + '/races/' + raceId + '/join', 'POST', {}, cookie);
      }
      const route = base + '/races/' + raceId, state = await api(route);
      if (state.phase === 'question') for (const [i, cookie] of bots.entries()) {
        const key = state.index + ':' + i;
        if (submitted.has(key) || Date.now() < state.startsAt + 1500 + (i % 6) * 600) continue;
        const correct = (i + state.index) % 5 !== 0;
        const choice = correct ? items[state.index % items.length].answer : 1 - items[state.index % items.length].answer;
        await api(route + '/answer', 'POST', { questionId: state.question.id, choice }, cookie); submitted.add(key);
      }
    } catch (e) { console.error('Preview:', e.message); }
    finally { running = false; }
  }, 1000);
  process.on('SIGINT', async () => { clearInterval(timer); await h.close(); process.exit(0); });
  console.log(JSON.stringify({ teacher: h.base + '/demo/teacher', student: h.base + '/demo/student', roomCode: board.code, participants: '24 simulated students' }));
})().catch(e => { console.error(e); process.exitCode = 1; });
