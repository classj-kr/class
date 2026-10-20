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
  const show = id => ['teacherHome','teacherExam','studentExam'].forEach(name => { $(name).hidden = name !== id; });
  const notice = text => { $('notice').textContent = text || ''; };
  const node = (tag, text, cls) => { const e = document.createElement(tag); if (text !== undefined) e.textContent = text; if (cls) e.className = cls; return e; };
  async function api(path, method = 'GET', body) {
    const response = await fetch('/api/exams' + path, { method, cache: 'no-store', credentials: 'same-origin',
      headers: body === undefined ? {} : { 'Content-Type': 'application/json' }, body: body === undefined ? undefined : JSON.stringify(body) });
    const serverDate = Date.parse(response.headers.get('Date') || '');
    if (Number.isFinite(serverDate)) serverOffset = serverDate - Date.now();
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw Object.assign(new Error(data.message || '요청을 처리하지 못했습니다.'), { code: data.code || data.error });
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
      const figure = node('div', undefined, 'figure-edit');
      if (q.image) {
        const img = node('img'); img.src = imageUrl(q.image); img.alt = `${i + 1}번 그림`; img.className = 'question-image';
        const drop = node('button', '그림 빼기', 'secondary'); drop.type = 'button'; drop.onclick = () => { q.image = null; editQuestions(); };
        figure.append(img, drop);
      }
      const pick = node('label', q.image ? '그림 바꾸기' : '그림 넣기', 'file-button'); const input = node('input'); input.type = 'file'; input.accept = 'image/*';
      input.onchange = () => run(async () => { const file = input.files[0]; if (!file) return; notice('그림을 올리고 있습니다…'); q.image = await uploadImage(examId, await imageFileToBlob(file)); editQuestions(); notice('그림을 넣었습니다. 문항 저장을 눌러 주세요.'); });
      pick.append(input); figure.append(pick); box.append(figure);
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
  const imageUrl = imageId => `/api/exams/${encodeURIComponent(examId)}/images/${encodeURIComponent(imageId)}`;
  function newQuestion(kind) { draft.push({ kind, content: '', choices: kind === 'choice' ? ['','','',''] : kind === 'ox' ? ['O','X'] : [], answer: kind === 'short' ? '' : null, aliases: [], explanation: '' }); editQuestions(); }
  const statusLabel = e => e.status === 'closed' ? '마감' : e.status === 'open' ? '응시 중' : e.ready ? '응시 가능' : '준비 중(정답 확인 필요)';
  let homeExams = [];
  const MAX_AUDIO = 40 * 1024 * 1024;
  const baseName = file => file.name.replace(/\.(pdf|mp3|xlsx|xls|csv)$/i, '').trim();
  const isMp3File = file => /\.mp3$/i.test(file.name) || file.type === 'audio/mpeg';
  async function uploadAudio(id, file) {
    if (file.size > MAX_AUDIO) throw new Error('MP3는 40MB 이하로 올려 주세요.');
    const response = await fetch('/api/exams/' + encodeURIComponent(id) + '/audio', { method: 'PUT', credentials: 'same-origin',
      headers: { 'Content-Type': 'audio/mpeg', 'X-File-Name': encodeURIComponent(file.name) }, body: file });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || '음원을 올리지 못했습니다.');
  }
  // 그림: 사이트의 PDF 도구와 같은 pdf.js로 쪽을 그려 AI가 알려 준 영역을 잘라 낸다.
  const PDFJS_URL = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.min.mjs';
  const PDFJS_WORKER_URL = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.worker.min.mjs';
  let pdfjsPromise;
  function loadPdfjs() {
    pdfjsPromise ||= import(PDFJS_URL).then(pdfjs => { pdfjs.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_URL; return pdfjs; }).catch(error => { pdfjsPromise = null; throw error; });
    return pdfjsPromise;
  }
  // 글자·도표가 있는 그림이라 무손실 WebP로 저장한다(품질 1이면 무손실). WebP를 못 만드는 브라우저는 PNG.
  const canvasBlob = canvas => new Promise(resolve => canvas.toBlob(blob => blob?.type === 'image/webp' ? resolve(blob) : canvas.toBlob(resolve, 'image/png'), 'image/webp', 1));
  async function uploadImage(id, blob) {
    const response = await fetch('/api/exams/' + encodeURIComponent(id) + '/images', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': blob.type || 'application/octet-stream' }, body: blob });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || '그림을 올리지 못했습니다.');
    return data.id;
  }
  async function imageFileToBlob(file) {
    const bitmap = await createImageBitmap(file); const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement('canvas'); canvas.width = Math.round(bitmap.width * scale); canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height); bitmap.close?.(); return canvasBlob(canvas);
  }
  // 문항마다 figure({page, box})가 있으면 잘라 올리고 image id로 바꾼다. 실패한 문항 번호를 돌려준다.
  async function attachFigures(id, file, questions) {
    const targets = questions.map((q, i) => [q, i]).filter(([q]) => q.figure); if (!targets.length) return [];
    const failed = []; let doc;
    try { const pdfjs = await loadPdfjs(); doc = await pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise; }
    catch (_) { targets.forEach(([q, i]) => { delete q.figure; failed.push(i + 1); }); return failed; }
    const pages = new Map();
    try {
      for (const [q, i] of targets) {
        const { page, box } = q.figure; delete q.figure;
        try {
          if (!pages.has(page)) {
            const p = await doc.getPage(page); const viewport = p.getViewport({ scale: 2.5 });
            const canvas = document.createElement('canvas'); canvas.width = Math.ceil(viewport.width); canvas.height = Math.ceil(viewport.height);
            const context = canvas.getContext('2d'); context.fillStyle = '#fff'; context.fillRect(0, 0, canvas.width, canvas.height);
            await p.render({ canvasContext: context, viewport }).promise; pages.set(page, canvas);
          }
          const source = pages.get(page); const [y0, x0, y1, x1] = box;
          const sx = Math.floor(x0 / 1000 * source.width), sy = Math.floor(y0 / 1000 * source.height);
          const sw = Math.ceil((x1 - x0) / 1000 * source.width), sh = Math.ceil((y1 - y0) / 1000 * source.height);
          const crop = document.createElement('canvas'); crop.width = sw; crop.height = sh;
          crop.getContext('2d').drawImage(source, sx, sy, sw, sh, 0, 0, sw, sh);
          q.image = await uploadImage(id, await canvasBlob(crop));
        } catch (_) { failed.push(i + 1); }
      }
    } finally { doc.destroy(); }
    return failed;
  }
  // 정답지: 엑셀은 브라우저에서 읽고, 표 모양을 모르겠거나 PDF면 AI에게 읽힌다.
  const SHEETJS_URL = 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js';
  let sheetjsPromise;
  function loadSheetjs() {
    sheetjsPromise ||= new Promise((resolve, reject) => {
      if (window.XLSX) return resolve(window.XLSX);
      const script = document.createElement('script'); script.src = SHEETJS_URL;
      script.onload = () => resolve(window.XLSX); script.onerror = () => { sheetjsPromise = null; reject(new Error('엑셀 도구를 불러오지 못했습니다.')); };
      document.head.append(script);
    });
    return sheetjsPromise;
  }
  const isSheetFile = file => /\.(xlsx|xls|csv)$/i.test(file.name);
  const isKeyFile = file => isSheetFile(file) || /정답|답안|답지/.test(file.name.normalize('NFC'));
  const cellText = value => String(value ?? '').normalize('NFKC').trim();
  const questionNumber = value => { const m = /^(\d{1,3})(?:\s*번)?\.?$/.exec(cellText(value)); return m ? Number(m[1]) : null; };
  // 표에서 번호→정답을 찾는다. 세로표(번호 열·정답 열), 가로표(번호 행·정답 행), 번호·정답이 번갈아 나오는 표를 읽는다.
  // 한 표에 여러 시험이 섞여 있으면(학년·교과·검사형 열) 시험 이름의 학년·과목·코드와 맞는 줄만 쓴다.
  function answersFromRows(rows, title = '') {
    const found = new Map();
    const isNumberHead = v => /^(문항\s*)?(번호|문항|no\.?)$/i.test(cellText(v));
    const isAnswerHead = v => /^(정\s*답|답|답안)$/.test(cellText(v));
    const [grade, subject, code] = (examKey(title) || '||').split('|');
    for (let r = 0; r < rows.length; r++) {
      const row = rows[r] || []; const nc = row.findIndex(isNumberHead); const ac = row.findIndex(isAnswerHead);
      if (nc >= 0 && ac >= 0) {
        const filters = [[/^학년$/, grade, v => String(v).replace(/학년$/, '')], [/^(교과|과목)$/, subject, v => v], [/^(검사형|유형|코드|형)$/, code, v => v.toUpperCase().replace(/형$/, '')]]
          .map(([head, want, norm]) => [row.findIndex(v => head.test(cellText(v))), want, norm]).filter(([col, want]) => col >= 0 && want);
        const matches = data => filters.every(([col, want, norm]) => !cellText(data?.[col]) || norm(cellText(data[col])) === want);
        for (let k = r + 1; k < rows.length; k++) { if (!matches(rows[k])) continue; const n = questionNumber(rows[k]?.[nc]); const a = cellText(rows[k]?.[ac]); if (n && a && !found.has(n)) found.set(n, a); }
      } else if (nc >= 0) {
        const answerRow = rows.slice(r + 1, r + 3).find(next => (next || []).some(isAnswerHead)) || rows[r + 1] || [];
        row.forEach((v, c) => { const n = questionNumber(v); const a = cellText(answerRow[c]); if (n && a && !isAnswerHead(a) && !found.has(n)) found.set(n, a); });
      }
    }
    if (found.size >= 2) return found;
    // 머리글 없이 "1 | ③ | 2 | ① …"처럼 번호와 정답이 번갈아 나오는 표. 정답이 숫자면 번호와 헷갈리므로 이 방식으로는 읽지 않는다.
    rows.forEach(row => { for (let c = 0; c + 1 < (row || []).length; c++) { const n = questionNumber(row[c]); const a = cellText(row[c + 1]); if (n && a && questionNumber(a) === null) { if (!found.has(n)) found.set(n, a); c++; } } });
    return found.size >= 2 ? found : new Map();
  }
  async function readAnswerKey(file, title) {
    let text = null;
    if (isSheetFile(file)) {
      const XLSX = await loadSheetjs();
      const book = XLSX.read(await file.arrayBuffer(), { type: 'array' });
      const code = (/[A-Za-z]\d{1,3}/.exec(title) || [''])[0].toUpperCase();
      const names = [...book.SheetNames].sort((a, b) => Number(Boolean(code) && b.toUpperCase().includes(code)) - Number(Boolean(code) && a.toUpperCase().includes(code)));
      for (const name of names) {
        const answers = answersFromRows(XLSX.utils.sheet_to_json(book.Sheets[name], { header: 1, raw: false, defval: '' }), title);
        if (answers.size) return { answers, via: '엑셀' };
      }
      text = book.SheetNames.map(name => `# ${name}\n` + XLSX.utils.sheet_to_csv(book.Sheets[name])).join('\n');
    }
    const response = await fetch('/api/teacher-ai/read-answer-key', { method: 'POST', credentials: 'same-origin',
      headers: { 'Content-Type': text === null ? 'application/pdf' : 'text/plain; charset=utf-8', 'X-Exam-Title': encodeURIComponent(title) }, body: text === null ? file : text });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || '정답지를 읽지 못했습니다.');
    return { answers: new Map(data.answers.map(a => [a.number, a.answer])), via: 'AI' };
  }
  const CIRCLED = '①②③④⑤⑥⑦⑧⑨⑩';
  // 정답 글자를 문항 형식에 맞게 바꾼다. 못 바꾸면 false.
  function setAnswer(q, raw) {
    const text = cellText(raw).replace(/번$/, '');
    if (q.kind === 'short') {
      const parts = text.split(/\s*(?:,|\/|또는)\s*/).filter(Boolean); if (!parts.length) return false;
      q.answer = parts[0]; q.aliases = parts.slice(1); return true;
    }
    if (q.kind === 'ox') {
      if (/^(o|○|◯|맞음|맞다|참|t|true)$/i.test(text)) { q.answer = 0; return true; }
      if (/^(x|×|✕|✗|틀림|틀리다|거짓|f|false)$/i.test(text)) { q.answer = 1; return true; }
      return false;
    }
    const circled = CIRCLED.indexOf(text); const digit = /^\d{1,2}$/.test(text) ? Number(text) : 0;
    let index = circled >= 0 ? circled : digit ? digit - 1 : q.choices.findIndex(choice => cellText(choice) === text);
    // 보기를 ①②로 옮긴 그림 보기는 글자 비교로 맞춘다.
    if (index < 0 && circled < 0) index = q.choices.findIndex(choice => cellText(choice).replace(/^[①-⑩]\s*/, '') === text);
    if (index < 0 || index >= q.choices.length) return false;
    q.answer = index; return true;
  }
  // 문항 번호(없으면 순서)로 정답을 넣는다. 정답을 못 넣은 문항 번호를 돌려준다.
  function applyAnswers(questions, answers) {
    const missing = [];
    questions.forEach((q, i) => { const n = q.number || i + 1; if (!answers.has(n) || !setAnswer(q, answers.get(n))) missing.push(n); });
    return missing;
  }
  async function teacherHome() {
    show('teacherHome'); const data = await api('/mine'); homeExams = data.exams; const list = $('examList'); list.replaceChildren();
    if (!data.exams.length) list.append(node('p', '아직 만든 시험이 없습니다.'));
    [...data.exams].sort((a, b) => a.title.localeCompare(b.title, 'ko', { numeric: true })).forEach(e => {
      const row = node('div', undefined, 'exam-row'); const a = node('a', e.title); a.href = '?id=' + encodeURIComponent(e.id) + '&mode=teacher';
      row.append(a, node('span', `방번호 ${e.code} · ${e.questionCount}문항${e.hasAudio ? ' · 듣기' : ''} · ${statusLabel(e)}${e.mine ? ' · 내 시험' : e.ownerName ? ` · ${e.ownerName}` : ''}`, 'muted')); list.append(row);
    });
  }
  // 파일 이름에서 학년·과목·코드를 뽑아 같은 시험의 파일끼리 묶는다.
  // 예: "초4영어(A01)검사지.pdf", "4A01 영어(정답).xlsx", "초4영어(A01)듣기 음원.mp3" → 모두 4|영어|A01
  const SUBJECTS = ['국어', '수학', '영어', '사회', '과학', '도덕', '음악', '미술', '체육', '실과', '한국사', '역사'];
  function examKey(name) {
    let text = String(name).normalize('NFKC').replace(/\.[a-z0-9]{2,4}$/i, '');
    const code = (/[A-Za-z]\d{1,3}/.exec(text) || [''])[0].toUpperCase(); if (code) text = text.replace(/[A-Za-z]\d{1,3}/, ' ');
    const grade = (/(?<!\d)[1-6](?!\d)/.exec(text) || [''])[0]; const subject = SUBJECTS.find(s => text.includes(s)) || '';
    return [grade, subject, code].filter(Boolean).length >= 2 ? `${grade}|${subject}|${code}` : '';
  }
  // 시험 하나 = PDF 하나(+ 정답지 · 듣기 음원). 시험을 만들고 AI 추출 결과에 정답을 넣어 바로 저장한다.
  async function createFromPdf(group, duration, status) {
    const file = group.pdf;
    const title = baseName(file).slice(0, 80) || '시험';
    if (file.size > 20 * 1024 * 1024) throw new Error('20MB 이하만 올릴 수 있습니다.');
    status('시험 만드는 중…');
    const created = await api('/', 'POST', { title, durationMinutes: duration });
    let audioNote = '';
    if (group.audio) {
      status('듣기 음원 올리는 중…');
      try { await uploadAudio(created.id, group.audio); audioNote = ' · 듣기 음원 연결'; } catch (error) { audioNote = ` · 음원 실패: ${error.message}`; }
    }
    status('AI로 문항 추출 중…');
    const response = await fetch('/api/teacher-ai/extract-exam', { method: 'POST', headers: { 'Content-Type': 'application/pdf' }, body: file });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(`시험은 만들었지만 문항 추출 실패: ${data.message || '다시 시도해 주세요.'}${audioNote}`);
    const figures = data.questions.filter(q => q.figure).length;
    if (figures) status(`그림 ${figures}개 잘라 내는 중…`);
    const failed = await attachFigures(created.id, file, data.questions);
    let keyNote = ' · 정답 확인 필요';
    if (group.key) {
      status('정답지 읽는 중…');
      try {
        const key = await readAnswerKey(group.key, title); const missing = applyAnswers(data.questions, key.answers);
        keyNote = missing.length ? ` · 정답 ${data.questions.length - missing.length}개 입력(${key.via}), ${missing.join(', ')}번 정답 확인 필요` : ` · 정답 모두 입력(${key.via})`;
      } catch (error) { keyNote = ` · 정답지 실패: ${error.message}`; }
    }
    await api('/' + encodeURIComponent(created.id), 'PUT', { title, durationMinutes: duration, questions: data.questions });
    const figureNote = figures ? ` · 그림 ${figures - failed.length}개${failed.length ? `(${failed.join(', ')}번 그림 실패)` : ''}` : '';
    return `방번호 ${created.code} · ${data.questions.length}문항 추출${figureNote}${audioNote}${keyNote}${data.note ? ` · AI 메모: ${data.note}` : ''}`;
  }
  // 짝이 없는 음원·정답지는 이름이 맞는 준비 중인 기존 시험에 붙인다.
  async function attachToExisting(file, label) {
    const key = examKey(file.name);
    const target = homeExams.find(e => e.status === 'draft' && (e.title.toLowerCase() === baseName(file).toLowerCase() || (key && examKey(e.title) === key)));
    if (!target) throw new Error('어느 시험의 파일인지 찾지 못했습니다. 시험지 PDF와 함께 넣어 주세요.');
    if (isMp3File(file)) { label.textContent = '듣기 음원 올리는 중…'; await uploadAudio(target.id, file); return `기존 시험 "${target.title}"에 음원을 연결했습니다.`; }
    label.textContent = '정답지 읽는 중…';
    const detail = await api('/' + encodeURIComponent(target.id) + '?mode=teacher');
    const answers = await readAnswerKey(file, target.title); const missing = applyAnswers(detail.questions, answers.answers);
    await api('/' + encodeURIComponent(target.id), 'PUT', { title: detail.exam.title, durationMinutes: detail.exam.durationMinutes, questions: detail.questions });
    return `기존 시험 "${target.title}"에 정답 입력${missing.length ? ` · ${missing.join(', ')}번 확인 필요` : ''}`;
  }
  async function uploadPdfs(files) {
    const duration = Number($('newDuration').value);
    if (!Number.isInteger(duration) || duration < 1 || duration > 180) { notice('제한시간은 1~180분으로 정해 주세요.'); return; }
    const all = [...files]; if (!all.length) return;
    notice(''); const host = $('uploadList');
    const addRow = name => { const li = node('li'); const state = node('span', '대기 중', 'muted'); li.append(node('span', name), state); host.append(li); return state; };
    const isPdf = file => /\.pdf$/i.test(file.name) || file.type === 'application/pdf';
    const groups = all.filter(file => isPdf(file) && !isKeyFile(file)).map(pdf => ({ pdf, key: null, audio: null }));
    const extras = [];
    for (const file of all) {
      if (groups.some(g => g.pdf === file)) continue;
      const slot = isMp3File(file) ? 'audio' : isKeyFile(file) ? 'key' : null;
      if (!slot) { const label = addRow(file.name); label.textContent = 'PDF·MP3·엑셀 파일만 올릴 수 있습니다.'; label.className = 'error'; continue; }
      // 이름이 같거나 학년·과목·코드가 같은 시험지를 찾는다. 시험지가 하나뿐이면 그 시험지에 붙인다.
      const key = examKey(file.name);
      const matches = groups.filter(g => !g[slot] && (baseName(g.pdf).toLowerCase() === baseName(file).toLowerCase() || (key && examKey(g.pdf.name) === key)));
      const target = matches.length === 1 ? matches[0] : groups.length === 1 && !groups[0][slot] ? groups[0] : null;
      if (target) target[slot] = file; else extras.push(file);
    }
    const rows = groups.map(g => addRow([g.pdf, g.key, g.audio].filter(Boolean).map(f => f.name).join(' + ')));
    for (const file of extras) {
      const label = addRow(file.name);
      try { label.textContent = await attachToExisting(file, label); label.className = 'ok'; }
      catch (error) { label.textContent = error.message; label.className = 'error'; }
    }
    // AI 호출이 몰리지 않도록 두 개씩 처리한다.
    let next = 0;
    const worker = async () => {
      while (next < groups.length) {
        const index = next++; const label = rows[index];
        const status = text => { label.textContent = text; label.className = 'muted'; };
        try { label.textContent = await createFromPdf(groups[index], duration, status); label.className = 'ok'; }
        catch (error) { label.textContent = error.message; label.className = 'error'; }
      }
    };
    await Promise.all([worker(), worker()]);
    await teacherHome();
  }
  async function teacherExam() {
    state = await api('/' + encodeURIComponent(examId) + '?mode=teacher'); show('teacherExam'); const e = state.exam;
    $('examHeading').textContent = e.title; $('examMeta').textContent = `방번호 ${e.code} · ${e.durationMinutes}분 · ${statusLabel(e)}`;
    $('readyNote').textContent = e.status === 'draft' && !e.ready ? '정답을 채워야 학생이 시작할 수 있습니다.' : '';
    $('editTitle').value = e.title; $('editDuration').value = e.durationMinutes; draft = structuredClone(state.questions); editQuestions();
    $('draftTools').hidden = e.status !== 'draft'; $('closeButton').hidden = e.status === 'closed' || (e.status === 'draft' && !e.ready); $('deleteButton').hidden = !e.mine;
    const audioUrl = '/api/exams/' + encodeURIComponent(e.id) + '/audio';
    $('teacherAudio').hidden = !e.hasAudio; if (!e.hasAudio) $('teacherAudio').removeAttribute('src'); else if (!$('teacherAudio').src.endsWith(audioUrl + '?v=' + e.audioVersion)) $('teacherAudio').src = audioUrl + '?v=' + e.audioVersion;
    $('audioNote').textContent = e.hasAudio ? '' : '없음';
    $('audioEdit').hidden = e.status !== 'draft'; $('audioDelete').hidden = !e.hasAudio;
    const host = $('resultsTable'); host.replaceChildren();
    if (!state.members.length) host.append(node('p', '아직 입장한 학생이 없습니다.'));
    else {
      const table = node('table'); const head = node('tr'); ['학년','반','번호','이름','답한 문항','점수','상태'].forEach(t => head.append(node('th', t))); table.append(head);
      state.members.forEach(m => { const row = node('tr'); [m.grade ?? '-',m.classNumber ?? '-',m.number,m.name,`${m.answered}/${state.questions.length}`,`${m.score}/${state.questions.length}`,memberStatus(m)].forEach(t => row.append(node('td', String(t)))); table.append(row); }); host.append(table);
    }
  }
  const timeOver = m => state.exam.status === 'closed' || (Boolean(m.deadline) && Date.now() + serverOffset >= Date.parse(m.deadline));
  function memberStatus(m) {
    if (m.submittedAt) return '제출';
    if (!m.startedAt) return state.exam.status === 'closed' ? '미응시' : '시작 전';
    if (timeOver(m)) return '시간 종료';
    return `응시 중 (${Math.max(1, Math.ceil((Date.parse(m.deadline) - Date.now() - serverOffset) / 60000))}분 남음)`;
  }
  // 학생 자신의 제한시간이 끝났는지. 시험이 마감되어도 끝난 것으로 본다.
  function deadlinePassed() { return timeOver(state.member); }
  function tick() {
    if (!state?.member?.deadline) return;
    const remaining = Math.max(0, Math.ceil((Date.parse(state.member.deadline) - Date.now() - serverOffset) / 1000));
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
    waitingPoll = setTimeout(() => studentExam().catch(error => { notice(error.message); scheduleWaitingPoll(); }), 5000);
  }
  async function studentExam() {
    state = await api('/' + encodeURIComponent(examId));
    if (!state.member) { await teacherExam(); return; }
    show('studentExam');
    const e = state.exam; const m = state.member; $('studentTitle').textContent = e.title;
    const started = Boolean(m.startedAt) && state.questions.length > 0;
    // 시작한 뒤에 음원을 붙인다. 이미 붙어 있으면 다시 넣지 않아야 듣던 위치가 유지된다.
    const player = $('studentAudio'); const showAudio = e.hasAudio && started;
    player.hidden = !showAudio;
    if (showAudio && !player.getAttribute('src')) player.src = '/api/exams/' + encodeURIComponent(e.id) + '/audio?v=' + e.audioVersion;
    const who = `${m.number}번 ${m.name}`;
    const phase = started ? 'questions' : e.status === 'closed' ? 'closed' : e.ready || e.status === 'open' ? 'begin' : 'waiting';
    $('studentMeta').textContent = phase === 'questions' ? `${who} · ${state.questions.length}문항${state.score === null ? '' : ` · 자동채점 ${state.score}점`}`
      : phase === 'begin' ? `${who} · 시작 전` : phase === 'waiting' ? `${who} · 준비 중` : who;
    $('beginInfo').textContent = `${state.questionCount}문항 · 제한시간 ${e.durationMinutes}분${e.hasAudio ? ' · 이어폰 준비' : ''}`;
    ['waiting', 'begin', 'closed', 'questions'].forEach(name => { $(name === 'questions' ? 'questionPanel' : name + 'Panel').hidden = phase !== name; });
    $('remaining').hidden = phase !== 'questions';
    clearInterval(timer); if (phase === 'questions') { timer = setInterval(tick, 1000); tick(); renderQuestion(); }
    // 준비가 끝나면 시작 버튼이 나오도록 기다리는 동안만 다시 확인한다.
    if (phase === 'waiting') scheduleWaitingPoll(); else clearTimeout(waitingPoll);
  }
  function renderQuestion() {
    const questions = state.questions; if (!questions.length) return;
    const q = questions[questionIndex]; const saved = state.answers.find(a => a.question_id === q.id);
    const nav = node('div', undefined, 'question-nav'); questions.forEach((item, i) => { const b = node('button', String(i + 1), state.answers.some(a => a.question_id === item.id) ? 'answered' : 'secondary'); b.type = 'button'; b.onclick = () => run(async () => { await saveCurrentShort(); questionIndex = i; renderQuestion(); }); nav.append(b); });
    $('progress').replaceChildren(nav, node('p', `${questionIndex + 1} / ${questions.length}`)); $('questionText').textContent = q.content;
    const picture = $('questionImage'); picture.hidden = !q.image;
    if (q.image) { picture.src = imageUrl(q.image); picture.alt = `${questionIndex + 1}번 문항 그림`; } else picture.removeAttribute('src');
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
  const roomCode = (params.get('code') || '').replace(/\D/g,'').slice(0,4);
  async function join(code) {
    const result = await api('/join', 'POST', { code });
    if (result.teacher) { setUrl(result.exam.id, true); await teacherExam(); return; }
    setUrl(result.exam.id); await studentExam();
  }
  $('newPdfs').onchange = () => { const files = $('newPdfs').files; run(() => uploadPdfs(files)).finally(() => { $('newPdfs').value = ''; }); };
  const zone = $('dropZone');
  ['dragenter','dragover'].forEach(type => zone.addEventListener(type, event => { event.preventDefault(); zone.classList.add('dragging'); }));
  ['dragleave','drop'].forEach(type => zone.addEventListener(type, () => zone.classList.remove('dragging')));
  zone.addEventListener('drop', event => { event.preventDefault(); run(() => uploadPdfs(event.dataTransfer.files)); });
  $('extractButton').onclick = () => run(async () => {
    const file = $('pdfFile').files[0]; if (!file) throw new Error('PDF 시험지를 선택해 주세요.'); if (file.size > 20 * 1024 * 1024) throw new Error('PDF는 20MB 이하로 올려 주세요.');
    $('extractButton').disabled = true; notice('PDF에서 문항을 추출하고 있습니다…');
    try { const response = await fetch('/api/teacher-ai/extract-exam', { method: 'POST', headers: { 'Content-Type': 'application/pdf' }, body: file }); const data = await response.json().catch(() => ({})); if (!response.ok) throw new Error(data.message || '문항 추출에 실패했습니다.');
      if (data.questions.some(q => q.figure)) notice('그림을 잘라 내고 있습니다…');
      const failed = await attachFigures(examId, file, data.questions);
      draft = data.questions; $('extractNote').textContent = [data.note || `${draft.length}문항을 추출했습니다. 정답을 확인한 뒤 문항 저장을 눌러 주세요.`, failed.length ? `${failed.join(', ')}번 그림은 잘라 내지 못했습니다. 직접 넣어 주세요.` : ''].filter(Boolean).join(' '); editQuestions(); notice(''); }
    finally { $('extractButton').disabled = false; }
  });
  $('keyFile').onchange = () => run(async () => {
    const file = $('keyFile').files[0]; $('keyFile').value = ''; if (!file) return;
    if (!draft.length) throw new Error('먼저 문항을 추출하거나 추가해 주세요.');
    notice('정답지를 읽고 있습니다…');
    const key = await readAnswerKey(file, $('editTitle').value); const missing = applyAnswers(draft, key.answers);
    editQuestions(); notice('');
    $('extractNote').textContent = `정답지(${key.via})에서 ${draft.length - missing.length}문항 정답을 넣었습니다.${missing.length ? ` ${missing.join(', ')}번은 직접 확인해 주세요.` : ''} 확인 후 문항 저장을 눌러 주세요.`;
  });
  $('addChoiceButton').onclick = () => newQuestion('choice'); $('addOxButton').onclick = () => newQuestion('ox'); $('addShortButton').onclick = () => newQuestion('short');
  $('saveButton').onclick = () => run(async () => { await api('/' + encodeURIComponent(examId), 'PUT', { title: $('editTitle').value, durationMinutes: Number($('editDuration').value), questions: draft }); await teacherExam(); notice('저장했습니다.'); });
  $('beginButton').onclick = () => run(async () => { $('beginButton').disabled = true; try { await api('/' + encodeURIComponent(examId) + '/begin', 'POST'); questionIndex = 0; deadlineReloaded = false; await studentExam(); } finally { $('beginButton').disabled = false; } });
  $('closeButton').onclick = () => run(async () => { if (!confirm('응시를 마감할까요? 아직 시작하지 않은 학생은 더 이상 응시할 수 없고, 응시 중인 학생도 바로 끝납니다.')) return; await api('/' + encodeURIComponent(examId) + '/close', 'POST'); await teacherExam(); });
  $('deleteButton').onclick = () => run(async () => { if (!confirm('시험과 모든 학생 답안을 삭제할까요?')) return; await api('/' + encodeURIComponent(examId), 'DELETE'); location.href = '?mode=teacher'; });
  $('refreshButton').onclick = () => run(teacherExam);
  $('audioFile').onchange = () => run(async () => {
    const file = $('audioFile').files[0]; $('audioFile').value = ''; if (!file) return;
    if (!isMp3File(file)) throw new Error('MP3 파일만 올릴 수 있습니다.');
    notice('듣기 음원을 올리고 있습니다…'); await uploadAudio(examId, file); await teacherExam(); notice('듣기 음원을 올렸습니다.');
  });
  $('audioDelete').onclick = () => run(async () => { if (!confirm('듣기 음원을 삭제할까요?')) return; await api('/' + encodeURIComponent(examId) + '/audio', 'DELETE'); await teacherExam(); });
  $('previousButton').onclick = () => run(async () => { await saveCurrentShort(); questionIndex--; renderQuestion(); });
  $('nextButton').onclick = () => run(async () => { await saveCurrentShort(); questionIndex++; renderQuestion(); });
  $('submitButton').onclick = () => run(async () => { if (!confirm('답안을 제출할까요? 제출 후에는 수정할 수 없습니다.')) return; await saveCurrentShort(); await api('/' + encodeURIComponent(examId) + '/submit', 'POST'); await studentExam(); notice('제출했습니다.'); });
  if (examId) run(async () => { if (params.get('mode') === 'teacher') await teacherExam(); else await studentExam(); });
  else if (params.get('mode') === 'teacher') run(teacherHome);
  // 메인 페이지에서 방번호만 넣고 오면 로그인한 학생은 등록된 학년·반·번호로 바로 입장한다.
  // 메인 화면의 방번호 입력으로만 들어온다. 등록된 학생 정보로 바로 입장한다.
  else if (roomCode.length === 4) join(roomCode).catch(error => notice(error.message));
  else location.replace('/');
})();
