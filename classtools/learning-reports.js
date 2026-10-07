(async function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const node = (tag, text, className) => { const el = document.createElement(tag); if (text != null) el.textContent = text; if (className) el.className = className; return el; };
  const request = LearningRecords.request;
  let catalog = [], data = { roster: [], sessions: [] }, mode = 'student', selected = null, generation = 0;
  let allPeriod = false;
  let detailGeneration = 0;
  const domainClass = domain => ({ 읽기: 'reading', 문법: 'grammar', 어휘: 'words', 수리: 'math', 자기점검: 'reflection' }[domain] || '');
  function formattedText(value, className) {
    const target = node('span', null, className), source = String(value ?? '');
    const formulas = /\$\$([\s\S]+?)\$\$|(?<!\\)\$([^$\n]+?)\$|\\\(([\s\S]+?)\\\)|\\\[([\s\S]+?)\\\]/g;
    let cursor = 0;
    for (const match of source.matchAll(formulas)) {
      target.append(document.createTextNode(source.slice(cursor, match.index)));
      const formula = node('span', match[0], 'formula');
      try {
        // Keep fraction digits as legible as the surrounding question text.
        const math = (match[1] ?? match[2] ?? match[3] ?? match[4])
          .replace(/(^|[^\w\\])(\d+)\/(\d+)(?!\w)/g, (_, prefix, numerator, denominator) => `${prefix}\\dfrac{${numerator}}{${denominator}}`)
          .replace(/\\frac(?![a-zA-Z])/g, '\\dfrac');
        window.katex?.render(math, formula, {
          displayMode: match[1] != null || match[4] != null, throwOnError: true,
          trust: false, strict: 'ignore', maxExpand: 200, maxSize: 10
        });
      } catch { formula.textContent = match[0]; }
      target.append(formula); cursor = match.index + match[0].length;
    }
    target.append(document.createTextNode(source.slice(cursor)));
    return target;
  }
  function outcome(event) {
    if (event.kind === 'answer') return event.correct === true ? ['correct', '✓ 정답'] : event.correct === false ? ['incorrect', '× 오답'] : ['unscored', '채점 없음'];
    return { read: ['reading', '읽기'], 'self-assessment': ['reflection', '자기점검'], hint: ['hint', '도움말'] }[event.kind] || ['unscored', '기록'];
  }
  function firstAttemptRate(correct, total) {
    const rate = node('span', null, `first-rate${total ? '' : ' no-attempts'}`);
    rate.setAttribute('role', 'img');
    if (!total) {
      rate.setAttribute('aria-label', '첫 풀이 정답률: 채점된 첫 풀이 없음');
      rate.title = '채점된 첫 풀이 없음';
      rate.append(node('span', '—', 'rate-value'));
      return rate;
    }
    const percent = Math.round(correct / total * 100);
    const description = `첫 풀이 정답률 ${percent}%, ${total}문제 중 ${correct}문제 정답`;
    rate.setAttribute('aria-label', description); rate.title = description;
    const track = node('span', null, 'rate-track'), fill = node('span', null, 'rate-fill');
    fill.style.width = `${correct / total * 100}%`; track.append(fill);
    rate.append(node('span', `${percent}%`, 'rate-value'), track, node('span', `${correct}/${total}`, 'rate-count'));
    return rate;
  }
  const stamp = value => new Intl.DateTimeFormat('ko-KR', { timeZone: 'Asia/Seoul', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(value));
  $('fromDate').value = $('toDate').value = LearningRecords.today();
  const daysBefore = (date, days) => new Date(Date.parse(date) - days * 86400000).toISOString().slice(0, 10);
  function updatePeriodButtons() {
    const today = LearningRecords.today();
    $('fromDate').disabled = $('toDate').disabled = allPeriod;
    $('today').setAttribute('aria-pressed', String(!allPeriod && $('fromDate').value === today && $('toDate').value === today));
    $('twoDays').setAttribute('aria-pressed', String(!allPeriod && $('fromDate').value === daysBefore(today, 1) && $('toDate').value === today));
    $('week').setAttribute('aria-pressed', String(!allPeriod && $('fromDate').value === daysBefore(today, 6) && $('toDate').value === today));
    $('allPeriod').setAttribute('aria-pressed', String(allPeriod));
  }
  updatePeriodButtons();
  function status(text, error = false) { $('status').textContent = text; $('status').hidden = !text; $('status').classList.toggle('error', error); }
  function students() {
    const map = new Map();
    for (const row of data.roster) map.set(row.user_id || `${row.student_number}:${row.student_name}`, { id: row.user_id, name: row.student_name, number: row.student_number });
    for (const row of data.sessions) if (!map.has(row.userId)) map.set(row.userId, { id: row.userId, name: row.studentName, number: row.studentNumber });
    return [...map.values()].sort((a, b) => Number(a.number) - Number(b.number));
  }
  function render() {
    const all = data.sessions, filtered = mode === 'area' ? all.filter(s =>
      (!$('activitySelect').value || s.activity === $('activitySelect').value) &&
      (!selected || selected === '전체' || s.domain === selected)) : all;
    const roster = students(), ids = new Set(filtered.map(s => s.userId));
    const first = filtered.reduce((sum, s) => sum + s.summary.firstScored, 0), right = filtered.reduce((sum, s) => sum + s.summary.firstCorrect, 0);
    const inRange = value => value && (data.range?.all || new Date(new Date(value).getTime() + 32400000).toISOString().slice(0, 10) >= data.range?.from && new Date(new Date(value).getTime() + 32400000).toISOString().slice(0, 10) <= data.range?.to);
    $('summary').replaceChildren(...[
      [`${ids.size} / ${roster.length}`, '활동 학생'],
      [String(filtered.filter(s => s.status === 'completed' && inRange(s.completedAt)).length), '완료 활동'],
      [firstAttemptRate(right, first), '첫 풀이 정답률'],
      [String(filtered.reduce((sum, s) => sum + s.summary.retryCount, 0)), '재풀이']
    ].map(([value, title]) => {
      const card = node('article', null, typeof value === 'string' ? '' : 'rate-summary');
      card.append(node('p', title), typeof value === 'string' ? node('strong', value) : value); return card;
    }));
    $('studentTab').setAttribute('aria-pressed', String(mode === 'student')); $('areaTab').setAttribute('aria-pressed', String(mode === 'area'));
    $('areaFilter').hidden = mode !== 'area'; $('listTitle').textContent = mode === 'student' ? '학생' : '영역'; $('listCount').textContent = mode === 'student' ? `${roster.length}명` : '';
    const list = $('studentList'); list.replaceChildren();
    if (mode === 'student') {
      if (!roster.some(s => (s.id || `${s.number}:${s.name}`) === selected)) selected = roster[0]?.id || (roster[0] ? `${roster[0].number}:${roster[0].name}` : null);
      for (const s of roster) {
        const key = s.id || `${s.number}:${s.name}`, button = node('button'), name = node('span');
        name.append(node('span', s.number, 'student-number'), document.createTextNode(s.name));
        button.append(name, node('small', ids.has(s.id) ? `${all.filter(x => x.userId === s.id).length}개 활동` : '기록 없음'));
        button.setAttribute('aria-pressed', String(selected === key)); button.onclick = () => { selected = key; render(); }; list.append(button);
      }
      const student = roster.find(s => (s.id || `${s.number}:${s.name}`) === selected);
      heading(student ? `${student.number}번 ${student.name}` : '');
      renderRecords(all.filter(s => s.userId === student?.id), false);
    } else {
      const domains = ['전체', ...new Set(catalog.map(s => s.domain))];
      if (!domains.includes(selected)) selected = '전체';
      for (const domain of domains) {
        const button = node('button', domain); button.setAttribute('aria-pressed', String(selected === domain)); button.onclick = () => { selected = domain; $('activitySelect').value = ''; render(); }; list.append(button);
      }
      const rows = filtered.filter(s => selected === '전체' || s.domain === selected);
      heading(`${selected} 학습 내역`, `${new Set(rows.map(s => s.userId)).size}명 · ${rows.length}개 활동`);
      renderRecords(rows, true);
    }
  }
  function heading(title, subtitle) { $('reportHeading').hidden = !title; $('reportHeading').replaceChildren(...(title ? [node('h2', title)] : [])); if (subtitle) $('reportHeading').append(node('p', subtitle)); }
  function renderRecords(rows, showName) {
    const target = $('records'); target.replaceChildren();
    if (!rows.length) { target.append(node('p', '기록 없음', 'empty')); return; }
    for (const row of rows) {
      const card = node('article', null, 'record-card'), title = node('div', null, 'record-title');
      const meta = node('p', null, 'meta');
      meta.append(node('span', row.domain, `domain-tag ${domainClass(row.domain)}`), node('span', `${showName ? `${row.studentNumber}번 ${row.studentName} · ` : ''}${stamp(row.updatedAt)}`));
      title.append(meta, node('h3', row.title));
      const badge = node('span', row.status === 'completed' ? '완료' : '진행 중', `badge ${row.status}`);
      const metrics = node('div', null, 'metrics'), s = row.summary;
      if (s.firstScored) {
        metrics.append(firstAttemptRate(s.firstCorrect, s.firstScored));
      } else if (!s.readCount && !s.selfAssessments) metrics.append(firstAttemptRate(0, 0));
      if (s.retryCount) metrics.append(node('span', `다시 풀이 ${s.retryCount}회`, 'metric-retry'));
      if (s.readCount) metrics.append(node('span', `열어 본 부분 ${s.readCount}개`));
      if (s.selfAssessments) metrics.append(node('span', `스스로 점검 ${s.selfAssessments}회`));
      if (s.hints) metrics.append(node('span', `도움말 ${s.hints}회`));
      if (!metrics.children.length) metrics.append(node('span', '응답 없음'));
      const detail = node('button', '문항·응답 보기', 'detail-button'); detail.onclick = () => showDetail(row.id);
      card.append(title, metrics, badge, detail); target.append(card);
    }
  }
  async function showDetail(id) {
    const current = ++detailGeneration, body = $('detailBody');
    $('detailTitle').textContent = '학습 응답'; body.replaceChildren(node('p', '응답을 불러오는 중…', 'empty')); $('detailDialog').showModal();
    try {
      const { session } = await request(`/teacher/sessions/${id}`);
      if (current !== detailGeneration) return;
      const record = data.sessions.find(row => row.id === id);
      $('detailTitle').textContent = `${record ? `${record.studentNumber}번 ${record.studentName} · ` : ''}${session.title}`;
      const toolbar = node('div', null, 'detail-toolbar'), filters = node('div', null, 'detail-filters');
      filters.setAttribute('role', 'group'); filters.setAttribute('aria-label', '응답 필터');
      toolbar.append(node('p', '전체 기간', 'detail-scope'), filters);
      const list = node('div', null, 'answer-list'); list.setAttribute('aria-live', 'polite');
      body.replaceChildren(toolbar, list); body.scrollTop = 0;
      const groups = [['all', '전체', () => true], ['correct', '정답', e => e.kind === 'answer' && e.correct === true], ['incorrect', '오답', e => e.kind === 'answer' && e.correct === false], ['retry', '재풀이', e => e.kind === 'answer' && e.attemptNumber > 1]];
      function renderAnswers(filter) {
        list.replaceChildren();
        for (const button of filters.children) button.setAttribute('aria-pressed', String(button.dataset.filter === filter));
        const predicate = groups.find(([key]) => key === filter)[2];
        session.events.forEach((e, index) => {
          if (!predicate(e)) return;
          const [style, label] = outcome(e), block = node('article', null, `answer ${style}`), meta = node('div', null, 'answer-meta');
          const info = node('div', null, 'answer-info');
          info.append(node('span', String(index + 1).padStart(2, '0'), 'answer-number'), node('span', label, `outcome ${style}`));
          if (e.kind === 'answer') info.append(node('span', `${e.attemptNumber}번째 풀이`, e.attemptNumber > 1 ? 'attempt retry' : 'attempt'));
          const time = node('time', stamp(e.recordedAt)); time.dateTime = e.recordedAt;
          meta.append(info, time);
          const prompt = node('p', null, 'answer-prompt'); prompt.append(formattedText(e.snapshot.prompt || e.snapshot.title || e.questionKey));
          const response = node('div', null, 'answer-response');
          response.append(node('span', e.kind === 'read' ? '열어 본 부분' : e.kind === 'hint' ? '도움말 확인' : '학생 응답:', 'response-label'), formattedText(LearningRecords.responseText(e.response), 'response-value'));
          block.append(meta, prompt, response); list.append(block);
        });
        if (!list.children.length) list.append(node('p', filter === 'all' ? '응답 없음' : '해당 응답 없음', 'empty'));
      }
      for (const [key, label, predicate] of groups) {
        const count = session.events.filter(predicate).length;
        if (key !== 'all' && !count) continue;
        const button = node('button', `${label} ${count}`, key); button.type = 'button'; button.dataset.filter = key;
        button.onclick = () => renderAnswers(key); filters.append(button);
      }
      renderAnswers('all');
    } catch (error) { if (current === detailGeneration) body.replaceChildren(node('p', error.message, 'empty')); }
  }
  async function load() {
    const current = ++generation; $('load').disabled = true; status('불러오는 중…');
    updatePeriodButtons();
    const query = new URLSearchParams({ classId: $('classSelect').value });
    if (allPeriod) query.set('period', 'all');
    else { query.set('from', $('fromDate').value); query.set('to', $('toDate').value); }
    try {
      const sessions = [];
      let result;
      do {
        result = await request(`/teacher/report?${query}`);
        if (current !== generation) return;
        sessions.push(...result.sessions);
        if (result.nextCursor) { query.set('cursor', result.nextCursor); status(`불러오는 중… ${sessions.length}개 활동`); }
      } while (result.nextCursor);
      sessions.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt) || a.id.localeCompare(b.id));
      data = { ...result, sessions }; render(); status('');
    } catch (error) { if (current === generation) { data = { roster: [], sessions: [] }; render(); status(error.message, true); } }
    finally { if (current === generation) $('load').disabled = false; }
  }
  $('closeDetail').onclick = () => $('detailDialog').close();
  $('detailDialog').addEventListener('close', () => { detailGeneration++; });
  $('studentTab').onclick = () => { mode = 'student'; selected = null; render(); };
  $('areaTab').onclick = () => { mode = 'area'; selected = '전체'; render(); };
  $('activitySelect').onchange = render; $('load').onclick = load; $('classSelect').onchange = () => { selected = null; load(); };
  $('today').onclick = () => { allPeriod = false; $('fromDate').value = $('toDate').value = LearningRecords.today(); load(); };
  $('twoDays').onclick = () => { allPeriod = false; $('toDate').value = LearningRecords.today(); $('fromDate').value = daysBefore($('toDate').value, 1); load(); };
  $('week').onclick = () => { allPeriod = false; $('toDate').value = LearningRecords.today(); $('fromDate').value = daysBefore($('toDate').value, 6); load(); };
  $('allPeriod').onclick = () => { allPeriod = true; load(); };
  $('fromDate').oninput = $('toDate').oninput = updatePeriodButtons;
  try {
    const context = await request('/teacher/classes'); catalog = context.catalog;
    $('classSelect').replaceChildren(...context.classes.map(c => { const o = node('option', c.label); o.value = c.id; return o; }));
    for (const domain of new Set(catalog.map(row => row.domain))) {
      const group = node('optgroup'); group.label = domain;
      for (const row of catalog.filter(row => row.domain === domain)) { const option = node('option', row.label); option.value = row.id; group.append(option); }
      $('activitySelect').append(group);
    }
    if (!context.classes.length) { status('등록된 담당 학급이 없어요. 학교의 교사 등록 정보를 확인해 주세요.'); $('load').disabled = true; render(); }
    else await load();
  } catch (error) { status(error.message, true); $('load').disabled = true; render(); }
})();
