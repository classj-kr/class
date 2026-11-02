(() => {
  'use strict';
  if (!/\/coop\/?$/.test(location.pathname)) return;
  document.body.classList.add('coop-page');
  const $ = id => document.getElementById(id), App = window.StackingApp;
  const params = new URLSearchParams(location.search);
  let boardId = params.get('id'), state, stream, connected = false, refreshing = false, again = false;
  let queue = Promise.resolve(), pending = 0, localDrawing = null, panelOpen = true;
  let questionTitle = '', titleWork = '';
  const selected = new Set(), roleNames = { build: '출제자', front: '앞', right: '오른쪽 옆', top: '위' };
  const ui = document.createElement('div');
  ui.innerHTML = `<div class="coop-toolbar"><strong id="coop-label">문제은행·팀전</strong><button id="coop-bank-button" type="button">게시판</button></div>
    <p id="coop-status" class="coop-status" role="status"></p>
    <aside id="coop-dock" class="coop-dock" hidden></aside>
    <section id="coop-panel" class="coop-panel" aria-label="쌓기나무 문제은행"><div class="coop-card">
      <header><h2 id="coop-title">쌓기나무 문제은행</h2><a href="/room/">방번호 입력</a><button id="coop-close" aria-label="게시판 닫기" hidden>×</button></header>
      <div id="coop-entry" hidden><form id="coop-create"><label for="coop-bank-title">게시판 이름</label><div class="coop-row"><input id="coop-bank-title" maxlength="80" value="쌓기나무 문제은행" required><button class="primary-button">만들기</button></div></form><div id="coop-banks" class="coop-banks"></div></div>
      <div id="coop-board" hidden><div id="coop-teacher-controls" class="coop-row"></div><div id="coop-teams" class="coop-teams"></div><div class="coop-bank-heading"><h3>등록된 문제</h3><div id="coop-race-controls"></div></div><div id="coop-questions" class="coop-questions"></div></div>
    </div></section>`;
  document.body.append(ui);
  function element(tag, text, cls) { const n = document.createElement(tag); if (text !== undefined) n.textContent = text; if (cls) n.className = cls; return n; }
  function button(text, fn, cls = '') { const b = element('button', text, cls); b.type = 'button'; b.onclick = fn; return b; }
  function status(message = '') { $('coop-status').textContent = message; }
  async function api(path, body) {
    const response = await fetch('/api/boards' + path, { method: body === undefined ? 'GET' : 'POST', credentials: 'same-origin', cache: 'no-store', headers: { 'Content-Type': 'application/json' }, ...(body === undefined ? {} : { body: JSON.stringify(body) }) });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw Object.assign(Error(data.message || '연결을 확인해 주세요.'), { status: response.status });
    return data;
  }
  function panel(open) {
    panelOpen = open; $('coop-panel').hidden = !open;
    document.querySelector('.workspace').inert = open;
    $('coop-close').hidden = !state?.work || state.me.teacher || !!state.race && (state.race.phase !== 'playing' || state.race.finished);
  }
  function diagram(cells, view) {
    const wrap = element('div', undefined, 'coop-diagram');
    wrap.append(element('strong', roleNames[view]));
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const rows = view === 'top' ? 5 : 6;
    svg.setAttribute('viewBox', `-1 -1 102 ${rows * 20 + 2}`);
    svg.setAttribute('role', 'img'); svg.setAttribute('aria-label', `${roleNames[view]}에서 본 그림`);
    svg.innerHTML = cells.map((n, i) => `<rect x="${i % 5 * 20}" y="${Math.floor(i / 5) * 20}" width="20" height="20" fill="${n ? '#dcb77c' : '#faf9f4'}" stroke="#b8bbaf" stroke-width="1"/>`).join('');
    wrap.append(svg, element('small', view === 'top' ? '아래쪽이 앞' : view === 'right' ? '왼쪽이 앞' : '앞에서'));
    return wrap;
  }
  function figures(pictures) {
    const row = element('div', undefined, 'coop-figures');
    for (const view of ['front', 'right', 'top']) row.append(diagram(pictures[view], view));
    return row;
  }
  function apply(next) {
    if (state && next.revision < state.revision) return;
    next = { ...next, questions: next.questions || state?.questions || [] };
    if (state && JSON.stringify({ ...state, revision: 0 }) === JSON.stringify({ ...next, revision: 0 })) { state = next; return; }
    const previousWork = state?.work?.id, previousRace = state?.race?.id, hadTeam = state?.me.teamId;
    state = next;
    if (!state.work || localDrawing?.id !== state.work.id || localDrawing?.version !== state.work.version) localDrawing = null;
    if (!state.me.teacher && state.work && ((!hadTeam && state.me.teamId) || previousWork !== state.work.id || previousRace !== state.race?.id)) panelOpen = false;
    if (state.me.teacher || !state.work || state.race && (state.race.phase !== 'playing' || state.race.finished)) panelOpen = true;
    render();
  }
  async function refresh() {
    if (refreshing) { again = true; return; }
    if (!boardId) return;
    refreshing = true;
    try { apply(await api(`/${boardId}/stacking${state ? '?bankRevision=' + state.bankRevision : ''}`)); }
    catch (error) { status(error.message); if ([401, 403, 404].includes(error.status)) { connected = false; stream?.close(); panel(true); } }
    finally { refreshing = false; if (again) { again = false; void refresh(); } }
  }
  function send(action, extra = {}) {
    if (!connected) { status('연결을 확인하는 중이에요.'); return Promise.resolve(); }
    const body = { action, workId: state?.work?.id, version: state?.work?.version, bankRevision: state?.bankRevision, ...extra, opId: crypto.randomUUID() };
    pending++;
    const task = queue.then(async () => {
      try {
        let result;
        try { result = await api(`/${boardId}/stacking/actions`, body); }
        catch (error) { if (error.status) throw error; result = await api(`/${boardId}/stacking/actions`, body); }
        status(''); apply(result.state);
        if (action === 'edit') window.StackingSounds.play(body.delta > 0 ? 'add' : 'erase', result.state.work?.heights[body.cell], body.cell % 5);
        else if (action === 'undo' || action === 'clear') window.StackingSounds.play(action);
        if (result.correct === false) status(action === 'check-drawing' ? '그림을 다시 살펴봐요.' : '세 방향의 모습을 다시 살펴봐요.');
        if (result.correct === true || action === 'publish') window.StackingSounds.play('success');
      } catch (error) { status(error.message); await refresh(); }
      finally { pending--; if (!pending) { localDrawing = null; if (state) renderDock(); } }
    });
    queue = task.catch(() => {}); return task;
  }
  async function openBoard(id) {
    stream?.close(); connected = false; state = null; boardId = id;
    history.replaceState(null, '', '?id=' + encodeURIComponent(id));
    $('coop-entry').hidden = true; $('coop-board').hidden = false;
    await refresh();
    connectStream();
  }
  function connectStream() {
    stream?.close();
    if (!boardId) return;
    stream = new EventSource(`/api/boards/${boardId}/stacking/events`);
    stream.onopen = () => { connected = true; status(''); if (state) renderDock(); void refresh(); };
    stream.addEventListener('change', event => {
      const { teamId } = JSON.parse(event.data);
      if (!teamId || !state || state.me.teacher || state.me.teamId === teamId || panelOpen) void refresh();
    });
    stream.onerror = () => { connected = false; status('다시 연결하는 중…'); if (state) renderDock(); };
  }
  function render() {
    $('coop-title').textContent = `${state.board.title} · 방 ${state.board.code}`;
    const myTeam = state.teams.find(t => t.id === state.me.teamId);
    $('coop-label').textContent = state.me.teacher ? `방 ${state.board.code}` : `${myTeam?.name || '모둠 선택'}${myTeam ? ' · ' + (state.race ? '함께 쌓기' : roleNames[state.me.role]) : ''}`;
    if (!panelOpen && !state.me.teacher) { renderDock(); panel(false); return; }
    const controls = $('coop-teacher-controls'); controls.replaceChildren();
    if (state.me.teacher) {
      if (state.teams.every(t => !t.members.length)) {
        const label = element('label', '모둠 수 '), count = element('input'); count.type = 'number'; count.min = 1; count.max = 15; count.value = state.teams.length; count.setAttribute('aria-label', '모둠 수');
        label.append(count); controls.append(label, button('적용', () => send('team-count', { count: Number(count.value) })));
      }
      controls.append(button('내 문제은행', () => { location.href = location.pathname; }));
    }
    const teams = $('coop-teams'); teams.replaceChildren();
    const ranked = [...state.teams].sort((a, b) => (b.score || 0) - (a.score || 0) || (a.solvedAt || Infinity) - (b.solvedAt || Infinity));
    for (const t of ranked) {
      const card = element('div', undefined, 'coop-team'); card.classList.toggle('is-mine', t.id === state.me.teamId);
      const rank = t.score ? 1 + ranked.filter(other => (other.score || 0) > t.score || other.score === t.score && other.solvedAt < t.solvedAt).length : null;
      card.append(element('strong', `${rank ? rank + '위 · ' : ''}${t.name} · ${t.members.length}/4${t.score !== undefined ? ` · ${t.score}/${state.race.total}문제${t.finishedAt ? ' 완료' : ''}` : ''}`));
      for (const m of t.members) card.append(element('span', `${m.name}${!state.race ? ' · ' + roleNames[m.role] : ''}`));
      if (!state.me.teacher && !state.race && t.id !== state.me.teamId) { const join = button('이 모둠 참여', () => send('join-team', { teamId: t.id })); join.disabled = t.members.length >= 4; card.append(join); }
      if (state.me.teacher && !state.race && t.members.length) card.append(button('모둠 초기화', () => { if (confirm(`${t.name}의 배정과 작성 중인 문제를 초기화할까요? 등록된 문제는 보관됩니다.`)) send('reset-team', { teamId: t.id }); }, 'coop-small'));
      teams.append(card);
    }
    const questions = $('coop-questions'); questions.replaceChildren();
    for (const q of state.questions) {
      const card = element('article', undefined, 'coop-question');
      if (state.me.teacher) {
        const label = element('label'), check = element('input'); check.type = 'checkbox'; check.checked = selected.has(q.id); check.disabled = state.race?.phase === 'playing'; check.onchange = () => { check.checked ? selected.add(q.id) : selected.delete(q.id); renderRaceControls(); };
        label.append(check, element('strong', q.title)); card.append(label);
      } else card.append(element('strong', q.title));
      card.append(element('small', q.author), figures(q.pictures));
      if (state.me.teacher && state.race?.phase !== 'playing') card.append(button('삭제', () => { if (confirm('등록된 이 문제를 삭제할까요?')) send('delete-question', { questionId: q.id }); }, 'coop-small'));
      questions.append(card);
    }
    if (!state.questions.length) questions.append(element('p', '등록된 문제 없음', 'coop-empty'));
    renderRaceControls(); renderDock(); panel(panelOpen);
  }
  function renderRaceControls() {
    const root = $('coop-race-controls'); root.replaceChildren();
    if (!state.me.teacher) return;
    if (state.race?.phase === 'playing') root.append(button('팀전 마치기', () => send('stop-race')));
    else {
      const start = button(`선택한 ${state.questions.filter(q => selected.has(q.id)).length}문제로 팀전 시작`, () => send('start-race', { questionIds: state.questions.filter(q => selected.has(q.id)).map(q => q.id) }), 'primary-button');
      start.disabled = !state.questions.some(q => selected.has(q.id)); root.append(start);
      if (state.race) root.append(button('출제로 돌아가기', () => send('return-authoring')));
    }
  }
  function renderDock() {
    const root = $('coop-dock'), w = state.work;
    const focusedCell = root.contains(document.activeElement) ? document.activeElement.dataset.cell : undefined;
    const focusedTitle = document.activeElement?.id === 'coop-question-title';
    const caret = focusedTitle ? document.activeElement.selectionStart : null;
    root.replaceChildren(); root.hidden = !w || state.me.teacher;
    document.body.classList.toggle('coop-working', !!w && !state.me.teacher);
    document.body.classList.toggle('coop-readonly', !w?.canBuild);
    if (!w || state.me.teacher) return;
    App.shared({ ...w, canBuild: connected && w.canBuild, action: send });
    if (state.race) {
      if (state.race.question) {
        root.append(element('h3', `${state.race.index + 1}/${state.race.total} · ${state.race.question.title}`), figures(state.race.question.pictures));
        const check = button('확인하기', () => send('check-answer'), 'primary-button'); check.disabled = !connected; root.append(check);
      }
      return;
    }
    const role = state.me.role;
    root.append(element('h3', role === 'build' ? '입체 만들기' : `${roleNames[role]}에서 본 모습`));
    const count = state.teams.find(t => t.id === state.me.teamId).members.length;
    if (count < 4) { root.append(element('p', `모둠원 ${count}/4`)); return; }
    if (role !== 'build') {
      const cells = localDrawing?.cells || w.drawings[role], grid = element('div', undefined, 'coop-draw-grid'); grid.setAttribute('role', 'group'); grid.setAttribute('aria-label', `${roleNames[role]} 그림 그리기`);
      cells.forEach((n, i) => {
        const cell = button('', () => {
          const next = (localDrawing?.cells || state.work.drawings[role]).slice(); next[i] = next[i] ? 0 : 1;
          localDrawing = { id: w.id, version: w.version, cells: next }; renderDock(); send('draw', { cells: next });
        });
        cell.dataset.cell = i; cell.setAttribute('aria-label', `${Math.floor(i / 5) + 1}행 ${i % 5 + 1}열`); cell.setAttribute('aria-pressed', String(!!n)); cell.disabled = !connected || w.phase !== 'drawing'; grid.append(cell);
      });
      root.append(grid, element('small', role === 'top' ? '아래쪽이 앞' : role === 'right' ? '왼쪽이 앞' : '앞에서'));
      const check = button(w.checked[role] ? '확인 완료' : '그림 확인', () => send('check-drawing'), 'primary-button'); check.disabled = !connected || w.phase !== 'drawing'; root.append(check);
    } else if (w.phase === 'building') {
      const freeze = button('입체 완성', () => send('freeze'), 'primary-button'); freeze.disabled = !connected || !w.heights.some(Boolean); root.append(freeze);
    } else if (w.phase === 'drawing') {
      if (titleWork !== w.id) { questionTitle = ''; titleWork = w.id; }
      const title = element('input'); title.id = 'coop-question-title'; title.placeholder = '문제 이름'; title.maxLength = 60; title.setAttribute('aria-label', '문제 이름'); title.value = questionTitle; title.oninput = () => { questionTitle = title.value; };
      const publish = button('문제 등록', () => send('publish', { title: title.value }), 'primary-button'); publish.disabled = !connected || !w.canPublish;
      root.append(title, publish, button('입체 수정', () => send('revise')));
    } else root.append(button('다음 문제 · 역할 교대', () => send('new-draft'), 'primary-button'));
    const checks = element('div', undefined, 'coop-checks');
    for (const view of ['front', 'right', 'top']) checks.append(element('span', `${roleNames[view]} ${w.checked[view] ? '✓' : '○'}`));
    root.append(checks);
    if (w.phase === 'published') root.append(element('p', '등록 완료'));
    if (focusedCell !== undefined) root.querySelector(`[data-cell="${focusedCell}"]`)?.focus({ preventScroll: true });
    if (focusedTitle && $('coop-question-title')) { $('coop-question-title').focus({ preventScroll: true }); $('coop-question-title').setSelectionRange(caret, caret); }
  }
  $('coop-bank-button').onclick = () => { panelOpen = true; if (state) render(); else panel(true); };
  $('coop-close').onclick = () => panel(false);
  $('coop-create').onsubmit = async event => {
    event.preventDefault(); const button = event.currentTarget.querySelector('button'); button.disabled = true;
    try { const data = await api('/', { title: $('coop-bank-title').value.trim(), layout: 'stacking', slots: 60 }); await openBoard(data.board.id); }
    catch (error) { status(error.message); } finally { button.disabled = false; }
  };
  document.addEventListener('visibilitychange', () => { if (!document.hidden) void refresh(); });
  window.addEventListener('offline', () => { connected = false; stream?.close(); status('다시 연결하는 중…'); if (state) renderDock(); });
  window.addEventListener('online', () => { connectStream(); void refresh(); });
  window.addEventListener('pageshow', event => { if (event.persisted) { connectStream(); void refresh(); } });
  window.addEventListener('pagehide', () => stream?.close());
  setInterval(() => { if (!document.hidden) void refresh(); }, 5000);
  panel(true);
  (async () => {
    try {
      const code = params.get('code');
      if (code) { const data = await api('/join', { code }); if (data.board.layout !== 'stacking') { location.replace('/boards/?id=' + encodeURIComponent(data.board.id)); return; } boardId = data.board.id; }
      if (boardId) { await openBoard(boardId); return; }
      const { boards } = await api('/mine'); $('coop-entry').hidden = false;
      for (const b of boards.filter(b => b.layout === 'stacking')) $('coop-banks').append(button(`${b.title} · ${b.code}`, () => openBoard(b.id)));
    } catch (error) { if ([401, 403].includes(error.status) && !boardId) location.replace('/room/'); else status(error.message); }
  })();
})();
