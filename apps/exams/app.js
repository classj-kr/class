(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const params = new URLSearchParams(location.search);
  let examId = params.get('id');
  let state = null;
  let draft = [];
  let questionIndex = 0;
  let serverOffset = 0;
  let timer;
  let waitingPoll;
  let deadlineReloaded = false;
  const show = id => ['joinView','teacherHome','teacherExam','studentExam'].forEach(name => { $(name).hidden = name !== id; });
  const notice = text => { $('notice').textContent = text || ''; };
  const node = (tag, text, cls) => { const e = document.createElement(tag); if (text !== undefined) e.textContent = text; if (cls) e.className = cls; return e; };
  async function api(path, method = 'GET', body) {
    const response = await fetch('/api/exams' + path, { method, cache: 'no-store', credentials: 'same-origin',
      headers: body === undefined ? {} : { 'Content-Type': 'application/json' }, body: body === undefined ? undefined : JSON.stringify(body) });
    const serverDate = Date.parse(response.headers.get('Date') || '');
    if (Number.isFinite(serverDate)) serverOffset = serverDate - Date.now();
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || '요청을 처리하지 못했습니다.');
    return data;
  }
  async function run(fn) { try { notice(''); await fn(); } catch (error) { notice(error.message); } }
  function setUrl(id, teacher = false) { history.replaceState(null, '', '?id=' + encodeURIComponent(id) + (teacher ? '&mode=teacher' : '')); examId = id; }
  function createInput(value, max, onChange) {
    const input = node('input'); input.value = value ?? ''; if (max) input.maxLength = max;
    input.addEventListener('input', () => onChange(input.value)); return input;
  }
  function field(label, control) { const wrap = node('label', label); wrap.append(control); return wrap; }
  function editQuestions() {
    const host = $('editor'); host.replaceChildren();
    draft.forEach((q, i) => {
      const box = node('div', undefined, 'question-editor');
      const head = node('div', undefined, 'topline'); head.append(node('h3', `${i + 1}번 · ${q.kind === 'short' ? '단답형' : q.kind === 'ox' ? 'OX' : '객관식'}`));
      const remove = node('button', '삭제', 'danger'); remove.type = 'button'; remove.onclick = () => { draft.splice(i, 1); editQuestions(); }; head.append(remove); box.append(head);
      const content = node('textarea'); content.maxLength = 2000; content.value = q.content || ''; content.oninput = () => { q.content = content.value; }; box.append(field('문제', content));
      if (q.kind === 'choice') {
        const choices = node('div', undefined, 'choices');
        q.choices.forEach((v, ci) => choices.append(field(`${ci + 1}번 보기`, createInput(v, 300, value => { q.choices[ci] = value; }))));
        box.append(choices);
        const add = node('button', '보기 추가', 'secondary'); add.type = 'button'; add.disabled = q.choices.length >= 5;
        add.onclick = () => { q.choices.push(''); editQuestions(); };
        const removeChoice = node('button', '마지막 보기 삭제', 'secondary'); removeChoice.type = 'button'; removeChoice.disabled = q.choices.length <= 2;
        removeChoice.onclick = () => { q.choices.pop(); if (q.answer >= q.choices.length) q.answer = null; editQuestions(); };
        box.append(add, removeChoice);
      }
      if (q.kind === 'short') {
        box.append(field('정답', createInput(q.answer || '', 200, v => { q.answer = v; })));
        box.append(field('허용할 다른 정답 (쉼표로 구분)', createInput((q.aliases || []).join(', '), 1000, v => { q.aliases = v.split(',').map(s => s.trim()).filter(Boolean); })));
      } else {
        const select = node('select'); const empty = node('option', '정답 선택'); empty.value = ''; select.append(empty);
        q.choices.forEach((_, ci) => { const option = node('option', q.kind === 'ox' ? ['O','X'][ci] : `${ci + 1}번`); option.value = ci; select.append(option); });
        select.value = q.answer ?? ''; select.onchange = () => { q.answer = select.value === '' ? null : Number(select.value); }; box.append(field('정답', select));
      }
      box.append(field('해설 (선택)', createInput(q.explanation || '', 1000, v => { q.explanation = v; })));
      host.append(box);
    });
  }
  function newQuestion(kind) { draft.push({ kind, content: '', choices: kind === 'choice' ? ['','','',''] : kind === 'ox' ? ['O','X'] : [], answer: kind === 'short' ? '' : null, aliases: [], explanation: '' }); editQuestions(); }
  const statusLabel = status => status === 'draft' ? '준비 중' : status === 'open' ? '진행 중' : '종료';
  async function teacherHome() {
    show('teacherHome'); const data = await api('/mine'); const list = $('examList'); list.replaceChildren();
    if (!data.exams.length) list.append(node('p', '아직 만든 시험이 없습니다.'));
    data.exams.forEach(e => {
      const row = node('div', undefined, 'exam-row'); const a = node('a', e.title); a.href = '?id=' + encodeURIComponent(e.id) + '&mode=teacher';
      row.append(a, node('span', `방번호 ${e.code} · ${e.questionCount}문항 · ${statusLabel(e.status)}${e.mine ? ' · 내 시험' : e.ownerName ? ` · ${e.ownerName}` : ''}`, 'muted')); list.append(row);
    });
  }
  // 파일 하나 = 시험 하나. 시험을 만들고 AI 추출 결과를 바로 문항으로 저장한다.
  async function createFromPdf(file, duration, status) {
    const title = file.name.replace(/\.pdf$/i, '').trim().slice(0, 80) || '시험';
    if (!/\.pdf$/i.test(file.name) && file.type !== 'application/pdf') throw new Error('PDF 파일이 아닙니다.');
    if (file.size > 20 * 1024 * 1024) throw new Error('20MB 이하만 올릴 수 있습니다.');
    status('시험 만드는 중…');
    const created = await api('/', 'POST', { title, durationMinutes: duration });
    status('AI로 문항 추출 중…');
    const response = await fetch('/api/teacher-ai/extract-exam', { method: 'POST', headers: { 'Content-Type': 'application/pdf' }, body: file });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(`시험은 만들었지만 문항 추출 실패: ${data.message || '다시 시도해 주세요.'}`);
    await api('/' + encodeURIComponent(created.id), 'PUT', { title, durationMinutes: duration, questions: data.questions });
    return `방번호 ${created.code} · ${data.questions.length}문항 추출 · 정답 확인 필요`;
  }
  async function uploadPdfs(files) {
    const duration = Number($('newDuration').value);
    if (!Number.isInteger(duration) || duration < 1 || duration > 180) { notice('제한시간은 1~180분으로 정해 주세요.'); return; }
    const pdfs = [...files]; if (!pdfs.length) return;
    notice(''); const host = $('uploadList');
    const rows = pdfs.map(file => { const li = node('li'); const state = node('span', '대기 중', 'muted'); li.append(node('span', file.name), state); host.append(li); return state; });
    // AI 호출이 몰리지 않도록 두 개씩 처리한다.
    let next = 0;
    const worker = async () => {
      while (next < pdfs.length) {
        const index = next++; const label = rows[index];
        const status = text => { label.textContent = text; label.className = 'muted'; };
        try { label.textContent = await createFromPdf(pdfs[index], duration, status); label.className = 'ok'; }
        catch (error) { label.textContent = error.message; label.className = 'error'; }
      }
    };
    await Promise.all([worker(), worker()]);
    await teacherHome();
  }
  async function teacherExam() {
    state = await api('/' + encodeURIComponent(examId) + '?mode=teacher'); show('teacherExam'); const e = state.exam;
    $('examHeading').textContent = e.title; $('examMeta').textContent = `방번호 ${e.code} · ${e.durationMinutes}분 · ${e.status === 'draft' ? '준비 중' : e.status === 'open' ? '진행 중' : '종료'}`;
    $('editTitle').value = e.title; $('editDuration').value = e.durationMinutes; draft = structuredClone(state.questions); editQuestions();
    $('draftTools').hidden = e.status !== 'draft'; $('startButton').hidden = e.status !== 'draft'; $('closeButton').hidden = e.status !== 'open'; $('deleteButton').hidden = !e.mine;
    const host = $('resultsTable'); host.replaceChildren();
    if (!state.members.length) host.append(node('p', '아직 입장한 학생이 없습니다.'));
    else {
      const table = node('table'); const head = node('tr'); ['학년','반','번호','이름','답한 문항','점수','상태'].forEach(t => head.append(node('th', t))); table.append(head);
      state.members.forEach(m => { const row = node('tr'); [m.grade ?? '-',m.classNumber ?? '-',m.number,m.name,`${m.answered}/${state.questions.length}`,`${m.score}/${state.questions.length}`,m.submittedAt ? '제출' : deadlinePassed() ? '시간 종료' : '응시 중'].forEach(t => row.append(node('td', String(t)))); table.append(row); }); host.append(table);
    }
  }
  function deadlinePassed() { const deadline = Date.parse(state.exam.deadline || ''); return state.exam.status !== 'open' || !Number.isFinite(deadline) || Date.now() + serverOffset >= deadline; }
  function tick() {
    if (!state?.exam?.deadline) return;
    const remaining = Math.max(0, Math.ceil((Date.parse(state.exam.deadline) - Date.now() - serverOffset) / 1000));
    $('remaining').textContent = `${Math.floor(remaining / 60)}:${String(remaining % 60).padStart(2,'0')}`;
    if (!remaining) {
      $('answerArea').querySelectorAll('input,button').forEach(el => { el.disabled = true; }); $('submitButton').disabled = true;
      $('studentMeta').textContent = state.score === null
        ? '제한시간이 끝났습니다. 저장된 답안으로 채점됩니다.'
        : `${state.member.number}번 ${state.member.name} · 자동채점 ${state.score}/${state.questions.length}점`;
      if (!deadlineReloaded) { deadlineReloaded = true; setTimeout(() => run(studentExam), 0); }
    }
  }
  function scheduleWaitingPoll() {
    clearTimeout(waitingPoll);
    waitingPoll = setTimeout(() => studentExam().catch(error => { notice(error.message); scheduleWaitingPoll(); }), 2000);
  }
  async function studentExam() {
    state = await api('/' + encodeURIComponent(examId));
    if (!state.member) { await teacherExam(); return; }
    show('studentExam');
    const e = state.exam; $('studentTitle').textContent = e.title;
    $('studentMeta').textContent = e.status === 'draft' ? `${state.member.number}번 ${state.member.name} · 시험 시작 대기 중`
      : `${state.member.number}번 ${state.member.name} · ${state.questions.length}문항${state.score === null ? '' : ` · 자동채점 ${state.score}점`}`;
    $('waitingPanel').hidden = e.status !== 'draft'; $('questionPanel').hidden = e.status === 'draft';
    clearInterval(timer); timer = setInterval(tick, 1000); tick(); renderQuestion();
    if (e.status === 'draft') scheduleWaitingPoll(); else clearTimeout(waitingPoll);
  }
  function renderQuestion() {
    const questions = state.questions; if (!questions.length) return;
    const q = questions[questionIndex]; const saved = state.answers.find(a => a.question_id === q.id);
    const nav = node('div', undefined, 'question-nav'); questions.forEach((item, i) => { const b = node('button', String(i + 1), state.answers.some(a => a.question_id === item.id) ? 'answered' : 'secondary'); b.type = 'button'; b.onclick = () => run(async () => { await saveCurrentShort(); questionIndex = i; renderQuestion(); }); nav.append(b); });
    $('progress').replaceChildren(nav, node('p', `${questionIndex + 1} / ${questions.length}`)); $('questionText').textContent = q.content;
    const area = $('answerArea'); area.replaceChildren(); const locked = deadlinePassed() || Boolean(state.member.submittedAt);
    if (q.kind === 'short') {
      const input = node('input'); input.id = 'shortAnswer'; input.maxLength = 200; input.placeholder = '답을 입력하세요'; input.value = saved?.response || ''; input.disabled = locked;
      const save = node('button', '답 저장'); save.type = 'button'; save.disabled = locked;
      save.onclick = () => run(async () => { await saveAnswer(q.id, { response: input.value }); notice('답을 저장했습니다.'); });
      area.append(input, save);
    } else q.choices.forEach((choice, ci) => {
      const label = node('label', undefined, 'choice'); const input = node('input'); input.type = 'radio'; input.name = 'answer'; input.checked = saved?.choice === ci; input.disabled = locked;
      input.onchange = () => run(async () => { await saveAnswer(q.id, { choice: ci }); renderQuestion(); }); label.append(input, node('span', choice)); area.append(label);
    });
    $('previousButton').disabled = questionIndex === 0; $('nextButton').disabled = questionIndex === questions.length - 1;
    $('submitButton').disabled = locked;
  }
  async function saveAnswer(id, body) {
    await api(`/${encodeURIComponent(examId)}/answers/${encodeURIComponent(id)}`, 'PUT', body);
    const index = state.answers.findIndex(a => a.question_id === id); const value = { question_id: id, ...body };
    if (body.response !== undefined && !body.response.trim()) { if (index >= 0) state.answers.splice(index, 1); }
    else if (index < 0) state.answers.push(value); else state.answers[index] = value;
  }
  async function saveCurrentShort() {
    const q = state?.questions?.[questionIndex]; const input = $('shortAnswer');
    if (q?.kind !== 'short' || !input || deadlinePassed() || state.member.submittedAt) return;
    const value = input.value.trim();
    if (value !== (state.answers.find(a => a.question_id === q.id)?.response || '')) await saveAnswer(q.id, { response: value });
  }
  $('joinCode').value = (params.get('code') || '').replace(/\D/g,'').slice(0,4);
  async function join(code) { const result = await api('/join', 'POST', { code, grade: $('joinGrade').value, classNumber: $('joinClass').value, number: Number($('joinNumber').value), name: $('joinName').value }); setUrl(result.exam.id); await studentExam(); }
  $('joinForm').onsubmit = event => { event.preventDefault(); run(() => join($('joinCode').value)); };
  $('newPdfs').onchange = () => { const files = $('newPdfs').files; run(() => uploadPdfs(files)).finally(() => { $('newPdfs').value = ''; }); };
  const zone = $('dropZone');
  ['dragenter','dragover'].forEach(type => zone.addEventListener(type, event => { event.preventDefault(); zone.classList.add('dragging'); }));
  ['dragleave','drop'].forEach(type => zone.addEventListener(type, () => zone.classList.remove('dragging')));
  zone.addEventListener('drop', event => { event.preventDefault(); run(() => uploadPdfs(event.dataTransfer.files)); });
  $('extractButton').onclick = () => run(async () => {
    const file = $('pdfFile').files[0]; if (!file) throw new Error('PDF 시험지를 선택해 주세요.'); if (file.size > 20 * 1024 * 1024) throw new Error('PDF는 20MB 이하로 올려 주세요.');
    $('extractButton').disabled = true; notice('PDF에서 문항을 추출하고 있습니다…');
    try { const response = await fetch('/api/teacher-ai/extract-exam', { method: 'POST', headers: { 'Content-Type': 'application/pdf' }, body: file }); const data = await response.json().catch(() => ({})); if (!response.ok) throw new Error(data.message || '문항 추출에 실패했습니다.'); draft = data.questions; $('extractNote').textContent = data.note || `${draft.length}문항을 추출했습니다. 정답을 확인해 주세요.`; editQuestions(); notice(''); }
    finally { $('extractButton').disabled = false; }
  });
  $('addChoiceButton').onclick = () => newQuestion('choice'); $('addOxButton').onclick = () => newQuestion('ox'); $('addShortButton').onclick = () => newQuestion('short');
  $('saveButton').onclick = () => run(async () => { await api('/' + encodeURIComponent(examId), 'PUT', { title: $('editTitle').value, durationMinutes: Number($('editDuration').value), questions: draft }); await teacherExam(); notice('저장했습니다.'); });
  $('startButton').onclick = () => run(async () => { if (!confirm('시험을 시작하면 문항과 제한시간을 수정할 수 없습니다. 시작할까요?')) return; await api('/' + encodeURIComponent(examId), 'PUT', { title: $('editTitle').value, durationMinutes: Number($('editDuration').value), questions: draft }); await api('/' + encodeURIComponent(examId) + '/start', 'POST'); await teacherExam(); });
  $('closeButton').onclick = () => run(async () => { if (!confirm('지금 시험을 종료할까요?')) return; await api('/' + encodeURIComponent(examId) + '/close', 'POST'); await teacherExam(); });
  $('deleteButton').onclick = () => run(async () => { if (!confirm('시험과 모든 학생 답안을 삭제할까요?')) return; await api('/' + encodeURIComponent(examId), 'DELETE'); location.href = '?mode=teacher'; });
  $('refreshButton').onclick = () => run(teacherExam);
  $('previousButton').onclick = () => run(async () => { await saveCurrentShort(); questionIndex--; renderQuestion(); });
  $('nextButton').onclick = () => run(async () => { await saveCurrentShort(); questionIndex++; renderQuestion(); });
  $('submitButton').onclick = () => run(async () => { if (!confirm('답안을 제출할까요? 제출 후에는 수정할 수 없습니다.')) return; await saveCurrentShort(); await api('/' + encodeURIComponent(examId) + '/submit', 'POST'); await studentExam(); notice('제출했습니다.'); });
  if (examId) run(async () => { if (params.get('mode') === 'teacher') await teacherExam(); else await studentExam(); });
  else if (params.get('mode') === 'teacher') run(teacherHome);
  else show('joinView');
})();
