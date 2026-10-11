// 「수학 문제」 화면(문제은행). 단원 → 묶음(배우는 차례) → 기본·실력(문제가 많으면 회차)을 고르면 엔진이 그 회차의 문항을 내준다.
// 회차의 문제는 정해져 있다. 풀이 기록은 사이트 공용 학습 기록(LearningRecords)에 남기고,
// 풀다가 나갔다 와도 답한 데까지 이어진다.
(function () {
  'use strict';
  const B = window.MathBank;
  const VERSION = '2';
  const main = document.getElementById('main');
  const termSelect = document.getElementById('termSelect');
  const unitSelect = document.getElementById('unitSelect');
  const backLink = document.querySelector('.mb-back');

  let records = null;
  let unit = null;
  let round = null;     // { group, level, no, items, answers }
  let finished = {};    // 회차 열쇠 -> { right, total } (가장 최근에 끝낸 결과)
  let busy = false;

  const el = (tag, className, html) => { const node = document.createElement(tag); if (className) node.className = className; if (html != null) node.innerHTML = html; return node; };
  // 기록에 남길 글: 그림은 그림 이름으로 바꾼다.
  const plainText = (html) => { const box = document.createElement('div'); box.innerHTML = String(html || '').replace(/<svg[^>]*aria-label="([^"]*)"[\s\S]*?<\/svg>/g, ' [$1] '); return box.textContent.replace(/\s+/g, ' ').trim(); };
  const roundKey = (groupId, level, no) => unit.id + ':' + groupId + ':' + level + ':' + no;
  const versionOf = (u) => VERSION + '.' + (u.version || 1);
  const termOf = (u) => u.grade + '-' + u.semester;

  // ── 단원 고르기 ──────────────────────────────────────────────
  function fillSelects(preferred) {
    const units = B.units();
    const terms = [...new Set(units.map(termOf))];
    termSelect.replaceChildren(...terms.map((term) => { const [g, s] = term.split('-'); return new Option(g + '학년 ' + s + '학기', term); }));
    unit = units.find((u) => u.id === preferred) || units[0];
    termSelect.value = termOf(unit);
    fillUnits();
  }
  function fillUnits() {
    const list = B.units().filter((u) => termOf(u) === termSelect.value);
    unitSelect.replaceChildren(...list.map((u) => new Option(u.no + '. ' + u.title, u.id)));
    if (!list.includes(unit)) unit = list[0];
    unitSelect.value = unit.id;
  }
  termSelect.addEventListener('change', async () => { fillUnits(); await loadFinished(); showGroups(); });
  unitSelect.addEventListener('change', async () => { unit = B.findUnit(unitSelect.value); await loadFinished(); showGroups(); });

  // 끝낸 회차의 결과(학생으로 로그인했을 때만 서버에 있다)
  async function loadFinished() {
    finished = {};
    try {
      let query = '';
      for (let page = 0; page < 6; page += 1) {
        const data = await records.history(query);
        for (const session of data.sessions || []) {
          if (session.status !== 'completed' || !String(session.contentKey).startsWith(unit.id + ':')) continue;
          if (!finished[session.contentKey]) finished[session.contentKey] = { right: session.summary?.firstCorrect ?? 0, total: session.summary?.firstScored ?? 0 };
        }
        if (data.nextOffset == null) break;
        query = '&offset=' + data.nextOffset;
      }
    } catch (_) { finished = {}; }
  }

  // ── 묶음 목록 ────────────────────────────────────────────────
  function showGroups() {
    round = null;
    const url = new URL(location.href); url.searchParams.delete('record'); url.searchParams.set('unit', unit.id); history.replaceState(history.state, '', url);
    const list = el('ol', 'mb-groups');
    for (const group of unit.groups) {
      const row = el('li', 'mb-group');
      row.append(el('span', 'mb-group-title', group.title));
      const levels = el('div', 'mb-levels');
      for (const level of B.LEVELS) {
        const rounds = B.roundCount(unit, group.id, level);
        for (let no = 1; no <= rounds; no += 1) {
          const done = finished[roundKey(group.id, level, no)];
          const label = level + (rounds > 1 ? ' ' + no : '');
          const button = el('button', 'mb-level' + (level === '실력' ? ' is-hard' : '') + (done ? ' is-done' : ''), label + (done ? '<small>' + done.right + ' / ' + done.total + '</small>' : ''));
          button.type = 'button';
          button.setAttribute('aria-label', group.title + ' ' + level + (rounds > 1 ? ' ' + no + '회' : '') + (done ? ', 지난번 ' + done.total + '문항 중 ' + done.right + '문항 정답' : ''));
          button.addEventListener('click', () => openRound(group.id, level, no));
          levels.append(button);
        }
      }
      row.append(levels);
      list.append(row);
    }
    main.replaceChildren(list);
  }

  // ── 한 회차 열기 ─────────────────────────────────────────────
  async function openRound(groupId, level, no) {
    if (busy) return;
    const group = B.findGroup(unit, groupId);
    const items = group ? B.makeRound(unit, groupId, level, no) : [];
    if (items.length === 0) { showGroups(); return; }
    busy = true; main.inert = true;
    try {
      const rounds = B.roundCount(unit, groupId, level);
      const session = await records.start({ contentKey: roundKey(groupId, level, no), title: unit.title + ' · ' + group.title + ' (' + level + (rounds > 1 ? ' ' + no + '회' : '') + ')', version: versionOf(unit), checkpoint: { answers: {} } });
      const saved = (session.checkpoint && session.checkpoint.answers) || {};
      round = { group, level, no, rounds, items, answers: {} };
      for (const item of items) if (saved[item.key]) round.answers[item.key] = saved[item.key];
      showRound();
    } finally { busy = false; main.inert = false; }
  }

  function showRound() {
    const head = el('p', 'mb-round-title', round.group.title + '<span class="mb-chip' + (round.level === '실력' ? ' is-hard' : '') + '">' + round.level + (round.rounds > 1 ? ' ' + round.no + '회' : '') + '</span>');
    const list = el('ol', 'mb-items');
    for (const item of round.items) list.append(itemCard(item));
    const finish = el('div', 'mb-finish'); finish.id = 'finish'; finish.hidden = true;
    main.replaceChildren(head, list, finish);
    updateFinish();
    const first = main.querySelector('.mb-item:not(.is-right):not(.is-wrong) input, .mb-item:not(.is-right):not(.is-wrong) .mb-choice');
    if (first) first.focus({ preventScroll: true });
  }

  function itemCard(item) {
    const card = el('li', 'mb-item'); card.dataset.key = item.key;
    card.append(el('p', 'mb-text', item.text));
    if (item.figure) card.append(el('div', 'mb-figure', item.figure));
    const result = el('p', 'mb-result'); result.hidden = true;

    if (item.choice) {
      const choices = el('div', 'mb-choices' + (item.choice.options.some((label) => plainText(label).length > 12) ? ' is-long' : ''));
      item.choice.options.forEach((label, i) => {
        const button = el('button', 'mb-choice', label); button.type = 'button';
        button.addEventListener('click', () => answer(item, card, i));
        choices.append(button);
      });
      card.append(choices);
    } else {
      const form = el('form', 'mb-answer'); form.noValidate = true;
      // 분수 답은 분자 칸과 분모 칸을 위아래로 놓는다.
      const stack = item.fraction ? el('span', 'mb-fracfield') : null;
      if (stack) form.append(stack);
      item.inputs.forEach((input) => {
        // 칸 너비는 칸의 개수로만 정한다. 정답의 자릿수에 맞추면 칸 너비가 답의 크기를 알려 준다.
        const field = el('label', 'mb-field' + (item.inputs.length > 1 ? ' is-short' : ''));
        if (input.label && !item.fraction) field.append(el('span', null, input.label));
        if (input.lead) field.append(el('span', null, input.lead));
        const box = document.createElement('input');
        box.type = 'text'; box.inputMode = input.decimal ? 'decimal' : 'numeric'; box.autocomplete = 'off'; box.maxLength = 6;
        box.setAttribute('aria-label', (input.label || '답') + ' 적기');
        field.append(box);
        if (input.unit) field.append(el('span', null, input.unit));
        (stack || form).append(field);
      });
      const submit = el('button', 'mb-primary', '확인'); submit.type = 'submit';
      form.append(submit);
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        const boxes = [...form.querySelectorAll('input')];
        const empty = boxes.find((box) => box.value.trim() === '');
        if (empty) { empty.focus(); return; }
        answer(item, card, boxes.map((box) => box.value.trim()));
      });
      card.append(form);
    }
    card.append(result);
    const saved = round.answers[item.key];
    if (saved) paintAnswered(item, card, saved.r, saved.ok);
    return card;
  }

  const answerText = (item) => (item.choice
    ? plainText(item.choice.options[item.choice.answer])
    : item.fraction ? item.inputs[0].answer + '/' + item.inputs[1].answer
    : item.inputs.map((input) => (input.label ? input.label + ' ' : '') + (input.lead ? input.lead + ' ' : '') + input.answer + (input.unit ? (/^[A-Za-z]/.test(input.unit) ? ' ' : '') + input.unit : '')).join(', '));

  // 답한 문항을 그린다(방금 답했을 때와 이어 풀기로 되살릴 때 함께 쓴다).
  function paintAnswered(item, card, response, ok) {
    card.classList.add(ok ? 'is-right' : 'is-wrong');
    if (item.choice) {
      card.querySelectorAll('.mb-choice').forEach((button, i) => {
        button.disabled = true;
        if (i === item.choice.answer) button.classList.add('is-answer');
        else if (i === Number(response)) button.classList.add('is-picked');
      });
    } else {
      card.querySelectorAll('.mb-field input').forEach((box, i) => { box.value = Array.isArray(response) ? response[i] ?? '' : response; box.disabled = true; });
      card.querySelector('.mb-primary').disabled = true;
    }
    const result = card.querySelector('.mb-result');
    result.hidden = false;
    result.className = 'mb-result ' + (ok ? 'is-right' : 'is-wrong');
    result.innerHTML = ok ? '<strong>정답</strong>' : '<strong>답: ' + answerText(item) + '</strong>' + (item.explain ? '<br>' + item.explain : '');
  }

  async function answer(item, card, response) {
    if (busy || round.answers[item.key]) return;
    busy = true; main.inert = true;
    try {
      const ok = B.isCorrect(item, response);
      round.answers[item.key] = { r: response, ok };
      paintAnswered(item, card, response, ok);
      const answered = Object.keys(round.answers).length, total = round.items.length;
      const complete = answered === total;
      await records.save({
        checkpoint: { answers: round.answers },
        progress: { current: answered, total },
        events: [{ kind: 'answer', questionKey: item.key, response: Array.isArray(response) ? response.join(', ') : plainText(item.choice.options[response]), correct: ok,
          snapshot: { prompt: plainText(item.text) + (item.figure ? ' ' + plainText(item.figure) : ''), answer: answerText(item), type: item.typeTitle, level: item.level, standard: item.standard } }],
        complete
      });
      if (complete) finished[roundKey(round.group.id, round.level, round.no)] = { right: Object.values(round.answers).filter((a) => a.ok).length, total };
      updateFinish();
    } finally {
      busy = false; main.inert = false;
      const next = main.querySelector('.mb-item:not(.is-right):not(.is-wrong) input, .mb-item:not(.is-right):not(.is-wrong) .mb-choice');
      if (next) next.focus({ preventScroll: false });
    }
  }

  function updateFinish() {
    const finish = document.getElementById('finish');
    if (!finish || !round) return;
    const total = round.items.length, answered = Object.keys(round.answers).length;
    if (answered < total) { finish.hidden = true; return; }
    const right = Object.values(round.answers).filter((a) => a.ok).length;
    const { group, level, no, rounds } = round;
    const button = (className, label, go) => { const node = el('button', className, label); node.type = 'button'; node.addEventListener('click', go); return node; };
    finish.replaceChildren(el('p', null, total + '문항 중 ' + right + '문항 정답'));
    if (no < rounds) finish.append(button('mb-primary', '다음 회차', () => openRound(group.id, level, no + 1)));
    else if (level === '기본' && B.roundCount(unit, group.id, '실력')) finish.append(button('mb-primary', '실력 문제 풀기', () => openRound(group.id, '실력', 1)));
    finish.append(button('mb-plain', '다시 풀기', () => openRound(group.id, level, no)), button('mb-plain', '다른 묶음 고르기', showGroups));
    finish.hidden = false;
    finish.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // ── 뒤로가기: 푸는 중이면 묶음 목록으로 한 칸만 ─────────────────
  function stepBack(event) {
    if (!round) return;
    event.preventDefault();
    showGroups();
  }
  window.addEventListener('sitebackrequest', stepBack);
  backLink.addEventListener('click', stepBack);

  async function start() {
    records = window.LearningRecords.create('math-bank', { label: '수학 문제', mount: main });
    await records.ready;
    const params = new URLSearchParams(location.search);
    const record = (params.get('record') || '').split(':');   // 풀던 회차: 단원:묶음:수준:회차
    fillSelects(record.length >= 3 ? record[0] : params.get('unit'));
    await loadFinished();
    if (record.length >= 3 && unit.id === record[0] && B.findGroup(unit, record[1]) && B.LEVELS.includes(record[2])) await openRound(record[1], record[2], Number(record[3]) || 1);
    else showGroups();
  }
  start().catch((error) => { main.replaceChildren(el('p', 'mb-empty', '문제를 불러오지 못했습니다. 새로 고침 해 주세요.')); console.error(error); });
})();
