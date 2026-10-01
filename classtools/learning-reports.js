(async function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const node = (tag, text, className) => { const el = document.createElement(tag); if (text != null) el.textContent = text; if (className) el.className = className; return el; };
  const request = LearningRecords.request;
  let catalog = [], data = { roster: [], sessions: [] }, mode = 'student', selected = null, generation = 0;
  const stamp = value => new Intl.DateTimeFormat('ko-KR', { timeZone: 'Asia/Seoul', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(value));
  $('fromDate').value = $('toDate').value = LearningRecords.today();
  function status(text, error = false) { $('status').textContent = text; $('status').classList.toggle('error', error); }
  function students() {
    const map = new Map();
    for (const row of data.roster) map.set(row.user_id || `${row.student_number}:${row.student_name}`, { id: row.user_id, name: row.student_name, number: row.student_number });
    for (const row of data.sessions) if (!map.has(row.userId)) map.set(row.userId, { id: row.userId, name: row.studentName, number: row.studentNumber });
    return [...map.values()].sort((a, b) => Number(a.number) - Number(b.number));
  }
  function render() {
    const all = data.sessions, filtered = mode === 'area' && $('activitySelect').value ? all.filter(s => s.activity === $('activitySelect').value) : all;
    const roster = students(), ids = new Set(filtered.map(s => s.userId));
    const first = filtered.reduce((sum, s) => sum + s.summary.firstScored, 0), right = filtered.reduce((sum, s) => sum + s.summary.firstCorrect, 0);
    const inRange = value => value && new Date(new Date(value).getTime() + 32400000).toISOString().slice(0, 10) >= data.range?.from && new Date(new Date(value).getTime() + 32400000).toISOString().slice(0, 10) <= data.range?.to;
    $('summary').replaceChildren(...[
      [`${ids.size} / ${roster.length}`, '활동한 학생', '선택한 기간의 기록'],
      [String(filtered.filter(s => s.status === 'completed' && inRange(s.completedAt)).length), '완료한 활동', '기간 내 완료 기준'],
      [`${right} / ${first}`, '처음 맞힌 문제', '첫 풀이의 정답 / 채점된 문제'],
      [String(filtered.reduce((sum, s) => sum + s.summary.retryCount, 0)), '다시 풀이', '같은 활동에서 다시 제출한 횟수']
    ].map(([value, title, note]) => { const card = node('article'); card.append(node('p', title), node('strong', value), node('small', note)); return card; }));
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
      heading(student ? `${student.number}번 ${student.name}` : '학생별 보고서', `${data.range?.from || ''} — ${data.range?.to || ''}`);
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
  function heading(title, subtitle) { $('reportHeading').replaceChildren(node('h2', title), node('p', subtitle)); }
  function renderRecords(rows, showName) {
    const target = $('records'); target.replaceChildren();
    if (!rows.length) { target.append(node('p', '선택한 기간에 저장된 학습 기록이 없어요.', 'empty')); return; }
    for (const row of rows) {
      const card = node('article', null, 'record-card'), top = node('div', null, 'record-top'), title = node('div');
      title.append(node('p', `${showName ? `${row.studentNumber}번 ${row.studentName} · ` : ''}${row.domain} · ${stamp(row.updatedAt)}`, 'meta'), node('h3', row.title));
      top.append(title, node('span', row.status === 'completed' ? '완료' : '진행 중', `badge ${row.status}`));
      const metrics = node('div', null, 'metrics'), s = row.summary;
      if (s.firstScored) metrics.append(node('span', `처음 맞힘 ${s.firstCorrect}/${s.firstScored}`));
      if (s.retryCount) metrics.append(node('span', `다시 풀이 ${s.retryCount}회`));
      if (s.readCount) metrics.append(node('span', `읽기 확인 ${s.readCount}개`));
      if (s.selfAssessments) metrics.append(node('span', `스스로 점검 ${s.selfAssessments}회`));
      if (s.hints) metrics.append(node('span', `도움말 ${s.hints}회`));
      if (!metrics.children.length) metrics.append(node('span', '아직 제출한 응답 없음'));
      const detail = node('button', '문항·응답 보기', 'detail-button'); detail.onclick = () => showDetail(row.id);
      card.append(top, metrics, detail); target.append(card);
    }
  }
  async function showDetail(id) {
    const body = $('detailBody'); body.replaceChildren(node('p', '응답을 불러오는 중…')); $('detailDialog').showModal();
    try {
      const { session } = await request(`/teacher/sessions/${id}`); body.replaceChildren(node('h3', session.title), node('p', '이 활동의 전체 응답 이력입니다.', 'footnote'));
      for (const e of session.events) {
        const block = node('article', null, 'answer');
        block.append(node('small', stamp(e.recordedAt)), node('p', e.snapshot.prompt || e.snapshot.title || e.questionKey), node('p', `응답: ${typeof e.response === 'string' ? e.response : JSON.stringify(e.response)}`));
        block.append(node('p', e.kind === 'answer' ? `${e.attemptNumber}번째 풀이 · ${e.correct === null ? '채점 없음' : e.correct ? '정답' : '오답'}` : ({ read: '읽기 확인', 'self-assessment': '스스로 점검', hint: '도움말 확인' }[e.kind]), 'outcome'));
        body.append(block);
      }
      if (!session.events.length) body.append(node('p', '아직 제출한 응답이 없어요.', 'empty'));
    } catch (error) { body.replaceChildren(node('p', error.message)); }
  }
  async function load() {
    const current = ++generation; $('load').disabled = true; status('학습 기록을 불러오는 중…');
    try {
      const result = await request(`/teacher/report?classId=${encodeURIComponent($('classSelect').value)}&from=${$('fromDate').value}&to=${$('toDate').value}`);
      if (current !== generation) return; data = result; render(); status(`${data.range.from} — ${data.range.to} · ${data.sessions.length}개 활동`);
    } catch (error) { if (current === generation) { data = { roster: [], sessions: [] }; render(); status(error.message, true); } }
    finally { if (current === generation) $('load').disabled = false; }
  }
  $('closeDetail').onclick = () => $('detailDialog').close();
  $('studentTab').onclick = () => { mode = 'student'; selected = null; render(); };
  $('areaTab').onclick = () => { mode = 'area'; selected = '전체'; render(); };
  $('activitySelect').onchange = render; $('load').onclick = load; $('classSelect').onchange = () => { selected = null; load(); };
  $('today').onclick = () => { $('fromDate').value = $('toDate').value = LearningRecords.today(); load(); };
  $('week').onclick = () => { $('toDate').value = LearningRecords.today(); $('fromDate').value = new Date(Date.parse($('toDate').value) - 6 * 86400000).toISOString().slice(0, 10); load(); };
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
