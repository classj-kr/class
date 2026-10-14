(() => {
  'use strict';
  const $ = id => document.getElementById(id), params = new URLSearchParams(location.search);
  const boardId = params.get('id'), gameId = params.get('game');
  const base = `/api/boards/${encodeURIComponent(boardId)}/races/${encodeURIComponent(gameId)}`;
  let state = null, busy = false, fetching = false, signature = '', offset = 0, lastContact = 0, scene = null, timer;
  $('backLink').href = boardId ? `/boards/?id=${encodeURIComponent(boardId)}` : '/boards/';
  function node(tag, text, className) { const n = document.createElement(tag); if (text !== undefined) n.textContent = text; if (className) n.className = className; return n; }
  function error(message) { $('error').hidden = !message; $('error').textContent = message; }
  async function api(suffix = '', body) {
    const start = Date.now();
    const res = await fetch(base + suffix, { method: body === undefined ? 'GET' : 'POST', credentials: 'same-origin', cache: 'no-store',
      headers: { 'Content-Type': 'application/json' }, body: body === undefined ? undefined : JSON.stringify(body), signal: AbortSignal.timeout(10000) });
    const value = await res.json().catch(() => ({}));
    if (!res.ok) { const e = new Error(value.message || '서버에 연결할 수 없어요.'); e.status = res.status; throw e; }
    if (value.serverTime) offset = value.serverTime - (start + Date.now()) / 2;
    lastContact = Date.now(); $('connection').textContent = '';
    return value;
  }
  function remaining() { return state ? Math.max(0, Math.ceil(((state.phase === 'countdown' ? state.startsAt : state.endsAt) - Date.now() - offset) / 1000)) : 0; }
  function clock() {
    const timed = ['countdown', 'question'].includes(state?.phase);
    $('clock').textContent = timed ? remaining() + '초' : '';
    if (state?.phase === 'countdown') $('studentStatus').textContent = remaining() ? remaining() + '초 뒤 시작' : '문제 불러오는 중';
    if (state && Date.now() - lastContact > 4000) $('connection').textContent = '연결 확인 중…';
    if (state?.phase === 'question' && (remaining() === 0 || Date.now() - lastContact > 4000)) $('choices').querySelectorAll('button').forEach(b => { b.disabled = true; });
  }
  function renderStudent() {
    const s = state, q = s.question, revealed = ['reveal', 'finished'].includes(s.phase);
    $('studentName').textContent = s.me.name;
    $('studentScore').textContent = s.me.joined ? `${s.me.rank}위 · ${s.me.score}m` : '';
    $('studentStatus').textContent = !s.me.joined ? '이미 시작한 경주예요. 다음 경주에서 참여해 주세요.' :
      s.phase === 'lobby' ? '입장 완료 · 선생님이 시작하면 문제가 나와요.' : s.phase === 'finished' ? `경주 종료 · ${s.me.rank}위` :
        s.phase === 'reveal' ? '전자칠판을 보세요' : s.me.choice !== undefined ? '제출 완료 · 전자칠판을 보세요' : '답을 선택하세요';
    $('question').textContent = q?.content || '';
    $('choices').replaceChildren();
    q?.choices.forEach((choice, i) => {
      const b = node('button'); b.type = 'button'; b.append(node('b', i + 1), node('span', choice));
      b.disabled = s.phase !== 'question' || s.me.choice !== undefined || !s.me.joined || busy || remaining() === 0;
      b.classList.toggle('selected', s.me.choice === i); b.setAttribute('aria-pressed', String(s.me.choice === i));
      b.classList.toggle('correct', revealed && q.answer === i);
      b.classList.toggle('incorrect', revealed && s.me.choice === i && q.answer !== i);
      b.addEventListener('click', () => void answer(q.id, i)); $('choices').append(b);
    });
    $('feedback').textContent = !revealed || !q || !s.me.joined ? '' :
      s.me.choice === q.answer ? `정답 · +${s.me.delta}m` : s.me.choice === undefined ? '미응답' : `정답: ${q.choices[q.answer]}`;
    $('explanation').textContent = revealed ? q?.explanation || '' : '';
  }
  function renderTeacher() {
    const s = state;
    if (!scene) scene = window.createRaceScene($('raceCanvas'));
    scene.update(s);
    $('participation').textContent = s.phase === 'lobby' ? `입장 ${s.participantCount}명` : `답변 ${s.answered} / ${s.eligible}명`;
    $('phaseLabel').textContent = ({ lobby: '입장 대기', countdown: '시작 준비', question: '문제 풀이 중', reveal: '경주', finished: '경주 종료' })[s.phase];
    $('advance').textContent = ({ lobby: '경주 시작', countdown: '시작 준비', question: '답안 마감 · 경주', reveal: s.index + 1 === s.total ? '최종 결과' : '다음 문제', finished: '게시판으로' })[s.phase];
    $('advance').disabled = busy || s.phase === 'countdown' || (s.phase === 'lobby' && s.participantCount === 0);
    $('finish').hidden = s.phase === 'finished'; $('finish').disabled = busy;
    const sorted = [...s.racers].sort((a, b) => b.score - a.score || a.number - b.number);
    $('ranking').replaceChildren(...sorted.slice(0, 3).map(p => {
      const card = node('div', undefined, 'rank-card');
      const name = sorted.some(other => other.id !== p.id && other.name === p.name) ? `${p.name} ${p.number}번` : p.name;
      card.append(node('b', 1 + sorted.filter(r => r.score > p.score).length), node('strong', name), node('span', p.score + 'm')); return card;
    }));
    $('teacherQuestion').hidden = !s.question;
    $('teacherQuestionContent').replaceChildren();
    if (s.question) {
      const list = node('ol'); s.question.choices.forEach(c => list.append(node('li', c)));
      $('teacherQuestionContent').append(node('p', s.question.content), list);
      if (s.question.answer !== undefined) $('teacherQuestionContent').append(node('p', `정답: ${s.question.choices[s.question.answer]}\n${s.question.explanation}`));
    }
  }
  function apply(next, force = false) {
    if (state && next.serverTime < state.serverTime) return;
    state = next; $('loading').hidden = true;
    $('teacher').hidden = !state.me.teacher; $('student').hidden = state.me.teacher;
    document.body.classList.toggle('student-view', !state.me.teacher);
    $('roomCode').textContent = state.code;
    $('roundLabel').textContent = `${Math.max(0, state.index + 1)} / ${state.total} 문제`;
    const nextSignature = JSON.stringify({ ...next, serverTime: 0 });
    if (force || signature !== nextSignature) { signature = nextSignature; if (state.me.teacher) renderTeacher(); else renderStudent(); }
    clock();
  }
  async function refresh(force = false) {
    if (fetching || busy || document.hidden) return;
    fetching = true;
    const recovering = Date.now() - lastContact > 4000;
    try { apply(await api(), force || recovering); error(''); }
    catch (e) {
      $('connection').textContent = '연결 끊김 · 다시 연결 중';
      if ([401, 403, 404].includes(e.status)) { clearInterval(timer); error(e.message + ' 위의 게시판으로 돌아가 다시 입장해 주세요.'); }
      else if (!state) error(e.message);
    } finally { fetching = false; }
  }
  async function answer(questionId, choice) {
    if (busy || state?.phase !== 'question' || remaining() === 0 || Date.now() - lastContact > 4000) return;
    busy = true; $('choices').querySelectorAll('button').forEach(b => { b.disabled = true; });
    try { const accepted = await api('/answer', { questionId, choice }); state.me.choice = accepted.choice; error(''); }
    catch (e) { error(e.message); }
    finally { busy = false; renderStudent(); await refresh(true); }
  }
  async function control(action) {
    if (!state || busy) return;
    busy = true; renderTeacher();
    try { apply(await api('/control', { action, index: state.index, phase: state.phase === 'countdown' ? 'question' : state.phase }), true); error(''); }
    catch (e) { error(e.message); }
    finally { busy = false; renderTeacher(); await refresh(); }
  }
  $('advance').addEventListener('click', () => {
    if (state?.phase === 'finished') { location.href = $('backLink').href; return; }
    const action = { lobby: 'start', question: 'reveal', reveal: 'next' }[state?.phase];
    if (action) void control(action);
  });
  $('finish').addEventListener('click', () => { if (confirm('경주를 종료하고 현재 결과를 저장할까요?')) void control('finish'); });
  $('fullscreen').addEventListener('click', async () => { try { if (document.fullscreenElement) await document.exitFullscreen(); else await $('liveApp').requestFullscreen(); } catch (_) { error('브라우저 전체 화면(F11)을 사용할 수 있어요.'); } });
  document.addEventListener('visibilitychange', () => { if (!document.hidden) void refresh(true); });
  setInterval(clock, 200);
  async function init() {
    if (!boardId || !gameId) { $('loading').hidden = true; error('게시판의 문제 세트에서 경주를 시작해 주세요.'); return; }
    try { apply(await api('/join', {})); }
    catch (e) { if (e.status === 409) await refresh(true); else { error(e.message); $('loading').hidden = true; } }
    timer = setInterval(() => void refresh(), 1000);
  }
  void init();
})();
