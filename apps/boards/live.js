(() => {
  'use strict';
  const $ = id => document.getElementById(id), params = new URLSearchParams(location.search);
  const boardId = params.get('id'), gameId = params.get('game');
  const base = `/api/boards/${encodeURIComponent(boardId)}/races/${encodeURIComponent(gameId)}`;
  let state = null, busy = false, fetching = false, signature = '', offset = 0, lastContact = 0, scene = null, timer;
  let launchUntil = 0, cueKey = '', nextQuestionTimer, renderedQuestionId;
  $('backLink').href = boardId ? `/boards/?id=${encodeURIComponent(boardId)}` : '/boards/';
  function node(tag, text, className) { const n = document.createElement(tag); if (text !== undefined) n.textContent = text; if (className) n.className = className; return n; }
  // 서버가 확인해 보낸 아바타 주소만 쓴다(그림만, 흰 바탕 없이).
  const avatarSrc = url => typeof url === 'string' && /^\/assets\/avatars\/[A-Za-z0-9._%()-]+\.webp$/i.test(url) ? url : '';
  function avatar(url, className) { const src = avatarSrc(url); if (!src) return null; const img = node('img', undefined, className); img.alt = ''; img.decoding = 'async'; img.src = src; return img; }
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
  function formatDuration(seconds) {
    const minutes = Math.floor(seconds / 60), rest = seconds % 60;
    return [minutes && minutes + '분', (rest || !minutes) && rest + '초'].filter(Boolean).join(' ');
  }
  const hasAnswer = s => s.me.choice !== undefined || s.me.text !== undefined;
  const answerLabel = q => q.kind === 'text' ? q.answer : q.choices[q.answer];
  function racersInOrder(s) {
    const racers = s.teams ? s.teams.filter(team => team.size) : s.racers;
    return [...racers].sort((a, b) => b.score - a.score || (a.number ?? a.index) - (b.number ?? b.index));
  }
  function racerName(racer, racers) {
    return racers.some(other => other !== racer && other.name === racer.name) ? `${racer.name} ${racer.number}번` : racer.name;
  }
  function renderRaceCue() {
    let kind = '', label = '', value = '';
    if (state.phase === 'countdown' && remaining()) {
      kind = 'countdown'; label = state.duration ? '곧 출발' : `${state.index + 1}번 문제`; value = String(remaining());
    } else if (['question', 'running'].includes(state.phase) && !state.question?.image && performance.now() < launchUntil) {
      kind = 'launch'; value = '출발!';
    } else if (state.phase === 'finished') {
      const racers = racersInOrder(state);
      const leaders = racers[0]?.score > 0 ? racers.filter(racer => racer.score === racers[0].score) : [];
      kind = 'finish';
      label = leaders.length ? (leaders.length > 1 ? '공동 1위' : '최종 1위') : '';
      value = leaders.length ? leaders.slice(0, 3).map(racer => racerName(racer, racers)).join(' · ') : '순위전 종료';
      if (leaders.length > 3) value += ` 외 ${leaders.length - 3}명`;
    }
    const key = [kind, label, value].join('|');
    if (cueKey === key) return;
    cueKey = key;
    const cue = $('raceCue');
    cue.hidden = !kind;
    cue.dataset.kind = kind;
    $('raceCueLabel').textContent = label;
    $('raceCueLabel').hidden = !label;
    $('raceCueValue').replaceWith(Object.assign(node('strong', value), { id: 'raceCueValue' }));
  }
  function clock() {
    const timed = ['countdown', 'question', 'running'].includes(state?.phase);
    $('clock').textContent = timed ? (state.duration && state.phase === 'question' ? '문제 ' : '') + formatDuration(remaining()) : '';
    const showRaceTime = state?.duration && !state.me.teacher && ['question', 'reveal', 'running'].includes(state.phase);
    $('raceClock').textContent = showRaceTime ? '경기 ' + formatDuration(Math.max(0, Math.ceil((state.raceEndsAt - Date.now() - offset) / 1000))) : '';
    if (state?.phase === 'countdown') $('studentStatus').textContent = remaining() ? remaining() + '초 뒤 시작' : '문제 불러오는 중';
    if (state?.me.teacher) renderRaceCue();
    if (state?.me.teacher && state.phase === 'reveal') {
      const seconds = Math.max(0, Math.ceil((state.nextAt - Date.now() - offset) / 1000));
      $('phaseLabel').textContent = state.autoAdvance ? `순위 발표 · ${seconds}초 뒤 ${state.index + 1 === state.total ? '최종 결과' : '다음 문제'}` : '순위 발표 · 자동 진행 꺼짐';
    }
    if (state && Date.now() - lastContact > 4000) $('connection').textContent = '연결 확인 중…';
    if (state?.phase === 'question' && (remaining() === 0 || Date.now() - lastContact > 4000)) {
      document.querySelectorAll('#choices button, #textAnswerForm button').forEach(b => { b.disabled = true; });
    }
  }
  // 작품 퀴즈 questions carry a board picture id.
  function showArt(img, q) {
    const src = q?.image ? `/api/boards/${encodeURIComponent(boardId)}/images/${encodeURIComponent(q.image)}` : '';
    if (src && img.getAttribute('src') !== src) img.src = src;
    img.hidden = !src;
    return !!src;
  }
  function renderStudent() {
    const s = state, q = s.question, revealed = ['reveal', 'finished'].includes(s.phase);
    $('studentName').textContent = s.me.name;
    const mine = avatarSrc(s.me.avatar);
    if (mine && $('studentAvatar').getAttribute('src') !== mine) $('studentAvatar').src = mine;
    $('studentAvatar').hidden = !mine;
    const team = s.teams?.[s.me.team];
    $('studentScore').textContent = !s.me.joined ? '' : team
      ? `${team.name}${team.rank ? ` ${team.rank}위` : ''} · ${team.score}m · 나 ${s.me.score}m`
      : `${s.me.rank}위 · ${s.me.score}m`;
    const pickTeam = !!s.teams && s.me.joined && s.phase === 'lobby';
    $('teamPicker').hidden = !pickTeam;
    if (pickTeam) {
      const focusedTeam = document.activeElement?.dataset.team;
      $('teamButtons').replaceChildren(...s.teams.map(t => {
        const selected = t.index === s.me.team;
        const button = node('button', `${t.name} ${t.size}/${s.teamLimit}명`);
        button.type = 'button';
        button.dataset.team = t.index;
        button.style.setProperty('--team-color', t.color);
        button.setAttribute('aria-pressed', String(selected));
        button.disabled = busy || (!selected && t.size >= s.teamLimit);
        button.addEventListener('click', () => void chooseTeam(t.index));
        return button;
      }));
      if (focusedTeam !== undefined) $('teamButtons').querySelector(`[data-team="${focusedTeam}"]`)?.focus({ preventScroll: true });
    }
    $('studentStatus').textContent = !s.me.joined ? '이미 시작한 순위전이에요. 다음 순위전에서 참여해 주세요.' :
      s.phase === 'lobby' ? '입장 완료 · 선생님이 시작하면 문제가 나와요.' : s.phase === 'finished' ? `순위전 종료 · ${team?.rank || s.me.rank}위 · ${s.me.attempts}문제 중 ${s.me.correctCount}개 정답` :
        s.phase === 'reveal' ? (s.duration ? '곧 다음 문제' : '전자칠판을 보세요') :
          hasAnswer(s) ? '제출 완료' : q?.kind === 'text' ? '답을 직접 입력하세요' : '답을 선택하세요';
    $('question').textContent = q?.content || '';
    showArt($('studentArt'), q);
    const canAnswer = s.phase === 'question' && s.me.joined && !hasAnswer(s) && !busy && remaining() > 0;
    const textForm = $('textAnswerForm'), textInput = $('textAnswer');
    const textQuestion = q?.kind === 'text' && s.me.joined;
    const focusText = textQuestion && document.activeElement === textInput;
    if (renderedQuestionId !== q?.id) {
      textInput.value = '';
      renderedQuestionId = q?.id;
    }
    textForm.hidden = !textQuestion;
    textInput.readOnly = !canAnswer;
    textForm.querySelector('button').disabled = !canAnswer;
    if (canAnswer && focusText) textInput.focus({ preventScroll: true });
    $('choices').replaceChildren();
    q?.choices.forEach((choice, i) => {
      const b = node('button'); b.type = 'button'; b.append(node('b', i + 1), node('span', choice));
      b.disabled = !canAnswer;
      b.classList.toggle('selected', s.me.choice === i); b.setAttribute('aria-pressed', String(s.me.choice === i));
      b.classList.toggle('correct', revealed && q.answer === i);
      b.classList.toggle('incorrect', revealed && s.me.choice === i && q.answer !== i);
      b.addEventListener('click', () => void answer(q.id, { choice: i })); $('choices').append(b);
    });
    $('feedback').textContent = !revealed || !q || !s.me.joined ? '' :
      s.me.delta > 0 ? `정답 · +${s.me.delta}m` : `${hasAnswer(s) ? '' : '미응답 · '}정답: ${answerLabel(q)}`;
    $('feedback').classList.toggle('earned', s.phase === 'reveal' && s.me.delta > 0);
    $('explanation').textContent = revealed ? q?.explanation || '' : '';
  }
  function renderTeacher() {
    const s = state;
    if (!scene) scene = window.createRaceScene($('raceCanvas'));
    const racers = racersInOrder(s);
    scene.update(s.teams ? {
      ...s, trackScale: Math.max(1, ...s.teams.map(team => team.size)),
      racers: racers.map(team => ({
        ...team, id: 'team-' + team.index, correct: team.delta > 0, team: true,
      })),
    } : s);
    $('participation').textContent = s.phase === 'lobby' ? `입장 ${s.participantCount}명` : s.duration ? `참여 ${s.eligible}명 · 풀이 ${s.answered}회` : `답변 ${s.answered} / ${s.eligible}명`;
    $('phaseLabel').textContent = ({ lobby: '입장 대기', countdown: '시작 준비', running: '경기 진행 중', question: '문제 풀이 중', reveal: '순위 발표', finished: '순위전 종료' })[s.phase];
    $('advance').textContent = ({ lobby: '순위전 시작', countdown: '시작 준비', question: '답안 마감 · 순위 발표', reveal: s.index + 1 === s.total ? '최종 결과' : '다음 문제', finished: '게시판으로' })[s.phase];
    $('advance').disabled = busy || s.phase === 'countdown' || (s.phase === 'lobby' && s.participantCount < (s.teams ? 2 : 1));
    $('advance').hidden = (s.duration || s.autoAdvance) && !['lobby', 'finished'].includes(s.phase);
    $('automatic').hidden = s.phase === 'finished' || !!s.duration; $('automatic').disabled = busy;
    $('automatic').textContent = s.autoAdvance ? '자동 진행 켜짐' : '자동 진행 꺼짐';
    $('automatic').setAttribute('aria-pressed', String(s.autoAdvance));
    $('finish').hidden = s.phase === 'finished'; $('finish').disabled = busy;
    const showRosters = !!s.teams && (s.phase === 'lobby' || s.phase === 'finished');
    const ranked = showRosters ? (s.phase === 'lobby' ? s.teams : racers) : racers.slice(0, 3);
    $('ranking').replaceChildren(...ranked.map(p => {
      const card = node('div', undefined, s.teams ? 'rank-card team-rank-card' : 'rank-card');
      const rank = s.phase === 'lobby' && s.teams ? '●' : 1 + racers.filter(r => r.score > p.score).length;
      if (s.teams) card.style.setProperty('--team-color', p.color);
      card.append(...[node('b', rank), avatar(p.avatar, 'rank-avatar'), node('strong', racerName(p, s.teams || s.racers)),
        node('span', s.phase === 'lobby' && s.teams ? `${p.size}명` : p.score + 'm')].filter(Boolean));
      if (showRosters) {
        const members = s.racers.filter(racer => racer.team === p.index).map(racer => racerName(racer, s.racers));
        if (members.length) card.append(node('small', members.join(' · '), 'team-members'));
      }
      return card;
    }));
    const question = s.phase === 'question' ? s.question : null;
    const picture = showArt($('teacherArtImage'), question);
    $('teacherArt').hidden = !question;
    $('teacherArtCaption').textContent = question?.content || '';
    $('teacherArtChoices').hidden = !question || picture;
    $('teacherArtChoices').replaceChildren(...(question && !picture ? question.choices.map(choice => node('li', choice)) : []));
    $('teacherQuestion').hidden = !s.question || s.phase === 'question';
    $('teacherQuestionContent').replaceChildren();
    if (s.question) {
      const list = node('ol'); s.question.choices.forEach(c => list.append(node('li', c)));
      $('teacherQuestionContent').append(node('p', s.question.content), list);
      if (s.question.answer !== undefined) $('teacherQuestionContent').append(node('p', `정답: ${answerLabel(s.question)}\n${s.question.explanation}`));
    }
  }
  function apply(next, force = false) {
    if (state && next.serverTime < state.serverTime) return;
    if (state?.phase === 'countdown' && ['question', 'running'].includes(next.phase) && state.index === next.index) {
      launchUntil = performance.now() + 900;
    }
    state = next; $('loading').hidden = true;
    $('teacher').hidden = !state.me.teacher; $('student').hidden = state.me.teacher;
    document.body.classList.toggle('student-view', !state.me.teacher);
    $('roomCode').textContent = state.code;
    // 순위전 공용 음악: 대기·결과는 한 곡 반복, 문제·경주 중엔 무작위. 전자칠판(교사)에서만 기본 재생.
    window.RaceMusic?.set(['lobby', 'finished'].includes(state.phase) ? 'lobby' : 'race', { host: state.me.teacher });
    $('roundLabel').textContent = state.phase === 'lobby'
      ? `${state.mode === 'team' ? '팀전 · ' : '개인전 · '}${state.duration ? formatDuration(state.duration) + ' · ' : ''}${state.total}문제 · 문제당 ${state.seconds}초`
      : state.duration
        ? (state.me.teacher || !state.me.joined ? (state.teams ? '팀전' : '개인전') : state.phase === 'finished' ? `풀이 ${state.me.attempts}회` : `${state.index + 1}번째 문제`)
        : `${state.index + 1} / ${state.total} 문제`;
    const nextSignature = JSON.stringify({ ...next, serverTime: 0 });
    if (force || signature !== nextSignature) { signature = nextSignature; if (state.me.teacher) renderTeacher(); else renderStudent(); }
    clearTimeout(nextQuestionTimer);
    if (state.duration && state.phase === 'reveal') {
      nextQuestionTimer = setTimeout(() => void refresh(), Math.max(40, state.nextAt - Date.now() - offset + 30));
    }
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
  async function answer(questionId, response) {
    if (busy || state?.phase !== 'question' || hasAnswer(state) || remaining() === 0 || Date.now() - lastContact > 4000) return;
    busy = true;
    $('textAnswer').readOnly = true;
    document.querySelectorAll('#choices button, #textAnswerForm button').forEach(b => { b.disabled = true; });
    try {
      const accepted = await api('/answer', { questionId, ...response });
      if (state?.question?.id === questionId) Object.assign(state.me, accepted);
      error('');
    }
    catch (e) { error(e.message); }
    finally { busy = false; renderStudent(); await refresh(true); }
  }
  async function chooseTeam(team) {
    if (busy || state.phase !== 'lobby' || state.me.team === team) return;
    busy = true; renderStudent();
    try { apply(await api('/team', { team }), true); error(''); }
    catch (e) { error(e.message); }
    finally { busy = false; renderStudent(); await refresh(); }
  }
  async function control(action, extra = {}) {
    if (!state || busy) return;
    busy = true; renderTeacher();
    try { apply(await api('/control', { ...extra, action, index: state.index, phase: state.phase === 'countdown' ? (state.duration ? 'running' : 'question') : state.phase }), true); error(''); }
    catch (e) { error(e.message); }
    finally { busy = false; renderTeacher(); await refresh(); }
  }
  $('advance').addEventListener('click', () => {
    if (state?.phase === 'finished') { location.href = $('backLink').href; return; }
    const action = { lobby: 'start', question: 'reveal', reveal: 'next' }[state?.phase];
    if (action) void control(action);
  });
  $('finish').addEventListener('click', () => { if (confirm('순위전을 종료하고 현재 결과를 저장할까요?')) void control('finish'); });
  $('automatic').addEventListener('click', () => void control('automatic', { enabled: !state?.autoAdvance }));
  $('textAnswerForm').addEventListener('submit', event => {
    event.preventDefault();
    const text = $('textAnswer').value.trim();
    if (text && state?.question?.kind === 'text') void answer(state.question.id, { text });
  });
  $('fullscreen').addEventListener('click', async () => { try { if (document.fullscreenElement) await document.exitFullscreen(); else await $('liveApp').requestFullscreen(); } catch (_) { error('브라우저 전체 화면(F11)을 사용할 수 있어요.'); } });
  document.addEventListener('visibilitychange', () => { if (!document.hidden) void refresh(true); });
  setInterval(clock, 200);
  async function init() {
    if (!boardId || !gameId) { $('loading').hidden = true; error('게시판의 문제 세트에서 순위전을 시작해 주세요.'); return; }
    try { apply(await api('/join', {})); }
    catch (e) { if (e.status === 409) await refresh(true); else { error(e.message); $('loading').hidden = true; } }
    timer = setInterval(() => void refresh(), 1000);
  }
  void init();
})();
