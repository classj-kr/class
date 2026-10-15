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

  // 수와 단위 기호 사이(7 cm, 30 %, x cm, 12π cm²)에서 줄이 갈리지 않게 그 빈칸을 줄 바꿈 없는 빈칸으로 바꾼다. 그림(svg) 안의 글은 그대로 둔다.
  const UNIT = '(?:cm|mm|km|m|kg|mg|g|mL|L|t|°C|%)(?![A-Za-z])';
  const GAP = new RegExp('([0-9π]) (?=' + UNIT + ')', 'g'), HEAD = new RegExp('^ (?=' + UNIT + ')');
  const POWER = /(cm|mm|km|m)([²³])/;
  const tie = (node) => {
    const walk = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
    for (let t = walk.nextNode(); t; t = walk.nextNode()) {
      if (t.parentElement.closest('svg')) continue;
      let text = t.data.replace(GAP, '$1\u00A0');
      const before = t.previousSibling;
      if (HEAD.test(text) && before && before.nodeType === 1 && /^(I|SUP)$/.test(before.tagName)) text = '\u00A0' + text.slice(1);
      if (text !== t.data) t.data = text;
      // 단위에 붙여 적은 ²·³ 글자(cm², cm³)는 위첨자 태그로 바꾼다. 읽기 글꼴의 ²·³ 글자는 작아서 잘 안 보인다.
      for (let part = t, m = POWER.exec(part.data); m; m = POWER.exec(part.data)) {
        const rest = part.splitText(m.index + m[1].length);
        rest.data = rest.data.slice(1);
        rest.parentNode.insertBefore(el('sup', null, m[2] === '²' ? '2' : '3'), rest);
        part = rest;
      }
    }
    // 선분·직선·반직선 기호는 위에 줄을 얹은 한 덩어리(inline-block)라, 기호와 바로 뒤의 토씨 사이에서 줄이 갈릴 수 있다(「EF」가 줄 끝에, 「의 길이는?」이 다음 줄 머리에 온다).
    // 기호(나 기호로 끝나는 묶음)와 바로 뒤의 한글을 줄이 갈리지 않는 한 덩어리로 묶는다. 근호(√3은)도 같다.
    const glue = (start) => {
      let unit = start;
      while (!unit.nextSibling && unit.parentElement !== node && unit.parentElement.tagName === 'SPAN') unit = unit.parentElement;
      const next = unit.nextSibling, tail = next && next.nodeType === 3 ? /^[가-힣]+/.exec(next.data) : null;
      if (!tail || unit.parentElement.dataset.glued) return;
      const wrap = document.createElement('span');
      wrap.style.whiteSpace = 'nowrap'; wrap.dataset.glued = '1';
      unit.parentNode.insertBefore(wrap, unit); wrap.appendChild(unit); wrap.appendChild(document.createTextNode(tail[0]));
      next.data = next.data.slice(tail[0].length);
    };
    node.querySelectorAll('svg.mb-inline[aria-hidden="true"]').forEach((mark) => {
      const unit = mark.parentElement;
      if (unit && unit.tagName === 'SPAN' && unit.style.display === 'inline-block' && unit.lastChild === mark) glue(unit);
    });
    node.querySelectorAll('span.mb-rad').forEach(glue);
    return node;
  };
  // 중학교 묶음 제목 속 수식의 문자(x, y, a, n …)는 문항 글처럼 수식 글꼴로 적는다. 사건 A·B 같은 대문자 이름은 문항 글처럼 세워 두고,
  // 초등 제목의 영문자는 단위(cm, kg, mL)라 그대로 둔다. 드롭다운의 단원 이름은 글꼴을 바꿀 수 없어 그대로다.
  const titleOf = (title) => (unit && unit.grade >= 7 ? String(title).replace(/[a-z]/g, (ch) => '<i class="mb-var">' + ch + '</i>') : title);
  const el = (tag, className, html) => { const node = document.createElement(tag); if (className) node.className = className; if (html != null) { node.innerHTML = html; tie(node); } return node; };
  // 기록에 남길 글: 그림은 그림 이름으로 바꾼다.
  // 위첨자(거듭제곱의 지수)는 글로 바꾸며 잃지 않게 표를 해 두었다가, 기록에는 (−2)^3 꼴로, 화면의 답 줄에는 위첨자로 되살린다.
  const SUP = /\uE000([^\uE001]*)\uE001/g;
  const rawText = (html) => { const box = document.createElement('div'); box.innerHTML = String(html || '').replace(/<svg[^>]*aria-label="([^"]*)"[\s\S]*?<\/svg>/g, ' [$1] ').replace(/<sup>([\s\S]*?)<\/sup>/g, '\uE000$1\uE001'); return box.textContent.replace(/\s+/g, ' ').trim(); };
  const plainText = (html) => rawText(html).replace(SUP, (all, e) => '^' + (/^[0-9A-Za-z]+$/.test(e) ? e : '(' + e + ')'));
  const shownText = (html) => rawText(html).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(SUP, '<sup>$1</sup>');
  const roundKey = (groupId, level, no) => unit.id + ':' + groupId + ':' + level + ':' + no;
  const versionOf = (u) => VERSION + '.' + (u.version || 1);
  const termOf = (u) => u.grade + '-' + u.semester;
  // 드롭다운의 항목 이름과 맨 밑의 기출 항목(terms.js). 기출 화면의 자리.
  const T = window.MathBankTerms, PAST_URL = '../csat-math/';

  // ── 단원 파일은 고른 학기의 것만 불러온다 ──────────────────────
  // 모든 학기를 한꺼번에 받으면 16 MB가 넘어 느린 망에서 첫 화면이 십몇 초 걸린다. index.html 의 단원 줄은 type="text/plain"이라
  // 브라우저가 받지 않고 목록 노릇만 한다. 학기를 고르면 그 학기의 파일을 index.html 차례대로 붙인다(async = false 라 차례대로 실행된다).
  const UNIT_FILES = [...document.querySelectorAll('script[data-unit]')].map((node) => {
    const src = node.getAttribute('src'), file = src.split('/').pop().split('?')[0].replace(/\.js$/, '');
    return { src, file, term: file.split('-').slice(0, 2).join('-') };
  });
  // 학기를 넘어 빌려 쓰는 도구: 6-1-6(각기둥과 각뿔)은 5-2-5a.js 의 직육면체 그림 도구(B.kit.box525)를 쓴다.
  const NEEDS = { '6-1': ['5-2-5a'] };
  const loading = new Map();
  const loadFile = (entry) => {
    if (!loading.has(entry.file)) loading.set(entry.file, new Promise((resolve, reject) => {
      const node = document.createElement('script');
      node.src = entry.src; node.async = false;
      node.onload = resolve; node.onerror = () => reject(new Error(entry.src + ' 을 불러오지 못했습니다'));
      document.body.append(node);
    }));
    return loading.get(entry.file);
  };
  const loadTerm = (term) => Promise.all(UNIT_FILES.filter((e) => (NEEDS[term] || []).includes(e.file)).concat(UNIT_FILES.filter((e) => e.term === term)).map(loadFile));
  const TERM_LIST = [...new Set(UNIT_FILES.map((e) => e.term))];
  // 화면 검사가 쓴다: 실린 단원 번호 전부(아직 안 불러온 학기 것까지)와 학기 불러오기.
  B.lazy = { ids: () => [...new Set(UNIT_FILES.map((e) => e.file.slice(0, -1)))], terms: () => TERM_LIST.slice(), loadTerm };
  const unitsOf = (term) => B.units().filter((u) => termOf(u) === term).sort((a, b) => a.no - b.no);

  // ── 단원 고르기 ──────────────────────────────────────────────
  async function fillSelects(preferred) {
    // preferred 는 단원 번호(3-1-2)이거나 학기(3-1)다. 학기이면 그 학기의 첫 단원을 연다. 없으면 맨 앞 학기.
    const want = String(preferred || '');
    const term = TERM_LIST.includes(want) ? want : TERM_LIST.find((t) => want.startsWith(t + '-')) || TERM_LIST[0];
    await loadTerm(term);
    const list = unitsOf(term);
    unit = list.find((u) => u.id === want) || list[0];
    // 학기들 아래 맨 밑에 「평가원·수능 기출」이 붙는다(terms.js).
    T.fill(termSelect, term, TERM_LIST);
    fillUnits();
  }
  function fillUnits() {
    const list = unitsOf(termSelect.value);
    unitSelect.replaceChildren(...list.map((u) => new Option(u.no + '. ' + u.title, u.id)));
    if (!list.includes(unit)) unit = list[0];
    unitSelect.value = unit.id;
  }
  termSelect.addEventListener('change', async () => {
    // 맨 밑의 「평가원·수능 기출」은 따로 있는 기출 화면으로 간다. 뒤로 돌아왔을 때 드롭다운이 기출에 머물러 있지 않게 먼저 되돌려 둔다.
    if (termSelect.value === T.PAST.value) { termSelect.value = termOf(unit); location.href = PAST_URL; return; }
    await loadTerm(termSelect.value); fillUnits(); await loadFinished(); showGroups();
  });
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
    const url = new URL(location.href); url.searchParams.delete('record'); url.searchParams.delete('term'); url.searchParams.set('unit', unit.id); history.replaceState(history.state, '', url);
    const list = el('ol', 'mb-groups');
    for (const group of unit.groups) {
      const row = el('li', 'mb-group');
      row.append(el('span', 'mb-group-title', titleOf(group.title)));
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
    const head = el('p', 'mb-round-title', titleOf(round.group.title) + '<span class="mb-chip' + (round.level === '실력' ? ' is-hard' : '') + '">' + round.level + (round.rounds > 1 ? ' ' + round.no + '회' : '') + '</span>');
    const list = el('ol', 'mb-items');
    // 여섯 자리를 넘는 답이 있는 회차는 칸을 모두 넓힌다(문항마다 넓히면 칸 너비가 답의 크기를 알려 준다).
    const roomy = round.items.some((item) => (item.inputs || []).some((input) => !input.decimal && input.answer > 99999));
    for (const item of round.items) list.append(itemCard(item, roomy));
    const finish = el('div', 'mb-finish'); finish.id = 'finish'; finish.hidden = true;
    main.replaceChildren(head, list, finish);
    updateFinish();
    const first = main.querySelector('.mb-item:not(.is-right):not(.is-wrong) input, .mb-item:not(.is-right):not(.is-wrong) .mb-choice');
    if (first) first.focus({ preventScroll: true });
  }

  function itemCard(item, roomy) {
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
      // 분수 답은 분자 칸과 분모 칸을 위아래로 놓는다. 대분수 답은 자연수 칸을 그 왼쪽에 둔다.
      const stack = item.fraction ? el('span', 'mb-fracfield') : null, slots = [];
      if (stack && !item.mixed) form.append(stack);
      item.inputs.forEach((input, at) => {
        // 칸 너비는 칸의 개수로만 정한다. 정답의 자릿수에 맞추면 칸 너비가 답의 크기를 알려 준다.
        const field = el('label', 'mb-field' + (item.template ? ' is-slot' : roomy && !item.fraction ? ' is-wide' : item.inputs.length > 1 ? ' is-short' : ''));
        if (input.label && !item.fraction) field.append(el('span', null, input.label));
        if (input.lead) field.append(el('span', null, input.lead));
        // 부호가 있는 답: 숫자 자판에는 −가 없으므로 칸 앞의 단추를 눌러 +와 −를 바꾼다. 분수는 맨 앞에 단추 하나만 둔다(값 전체의 부호).
        const signed = Boolean(input.signed || (item.signed && at === 0));
        if (signed) {
          const sign = el('button', 'mb-sign', '+'); sign.type = 'button'; sign.dataset.sign = '+'; sign.setAttribute('aria-label', '부호 바꾸기(지금 +)');
          sign.addEventListener('click', () => setSign(sign, sign.dataset.sign === '+' ? '−' : '+'));
          if (!item.fraction) field.append(sign); else if (stack.parentNode) stack.before(sign); else form.append(sign);
        }
        // 부등호 칸: 네 기호 가운데 하나를 고른다. 처음에는 아무것도 고르지 않은 채로 둔다.
        const box = input.rel ? el('select', 'mb-rel', '<option value="">□</option>' + RELS.map(([value, mark]) => '<option value="' + value + '">' + mark + '</option>').join('')) : document.createElement('input');
        if (input.rel) box.setAttribute('aria-label', '부등호 고르기');
        else {
          box.type = 'text'; box.inputMode = input.decimal ? 'decimal' : 'numeric'; box.autocomplete = 'off'; box.maxLength = roomy ? 22 : input.decimal ? 8 : 6;
          box.setAttribute('aria-label', (input.label ? plainText(input.label) : '답') + ' 적기');
        }
        box.dataset.at = at;
        if (signed) { box.dataset.signed = '1'; box._sign = field.querySelector('.mb-sign') || form.querySelector('.mb-sign'); }
        field.append(box);
        if (input.unit) field.append(el('span', null, input.unit));
        slots[at] = field;
        if (item.template) return;
        const whole = Boolean(stack) && item.mixed && at === 0;
        (stack && !whole ? stack : form).append(field);
        if (whole) form.append(stack);
      });
      // 식 속에 끼워 넣는 답 칸: template 의 {0}, {1}, … 자리에 그 번호의 칸을 넣는다.
      if (item.template) {
        const line = el('span', 'mb-tpl', item.template.replace(/\{(\d+)\}/g, '<span data-slot="$1"></span>'));
        // 지수 자리(<sup> 안)의 칸은 작게, 위로 올려 놓는다.
        line.querySelectorAll('[data-slot]').forEach((slot) => { if (slot.parentElement.tagName === 'SUP') slot.parentElement.classList.add('mb-tpl-up'); slot.replaceWith(slots[Number(slot.dataset.slot)]); });
        form.append(line);
      }
      if (item.fraction && item.unit) form.append(el('span', null, item.unit));
      const submit = el('button', 'mb-primary', '확인'); submit.type = 'submit';
      form.append(submit);
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        const boxes = [...form.querySelectorAll('input, select.mb-rel')].sort((a, b) => a.dataset.at - b.dataset.at);
        const empty = boxes.find((box) => box.value.trim() === '');
        if (empty) { empty.focus(); return; }
        // 부호 단추가 붙은 칸은 단추의 부호를 글 앞에 붙여 보낸다. 자판으로 -를 직접 적은 것도 받는다.
        answer(item, card, boxes.map((box) => {
          const text = box.value.trim();
          if (!box.dataset.signed) return text;
          const button = box._sign;
          const typed = /^[-−]/.test(text) ? '−' : /^\+/.test(text) ? '+' : null;
          if (typed) setSign(button, typed);
          return (button.dataset.sign === '−' ? '-' : '') + text.replace(/^[-−+]\s*/, '');
        }));
      });
      card.append(form);
    }
    card.append(result);
    const saved = round.answers[item.key];
    if (saved) paintAnswered(item, card, saved.r, saved.ok);
    return card;
  }

  // 부등호 칸의 보기: [채점에 쓰는 글, 화면에 보이는 기호]
  const RELS = [['&lt;', '&lt;'], ['&lt;=', '≤'], ['&gt;', '&gt;'], ['&gt;=', '≥']];   // innerHTML 로 넣으므로 꺾쇠는 문자 참조로 적는다(값은 <, <=, >, >= 가 된다)
  const setSign = (button, sign) => { button.dataset.sign = sign; button.textContent = sign; button.setAttribute('aria-label', '부호 바꾸기(지금 ' + sign + ')'); };
  // 음수는 빼기표(−)로 적는다.
  const signedText = (n) => (n < 0 ? '−' + Math.abs(n) : String(n));
  // 순환소수의 점은 글로 옮기면 사라지므로, 점이 든 보기는 화면의 답 줄에 그대로 보인다.
  const choiceShown = (html) => (/class="mb-(rdot|rad)"/.test(html) ? html : shownText(html));
  const answerText = (item, shown) => (item.shown ? (shown ? item.shown : plainText(item.shown)) : item.choice
    ? (shown ? choiceShown : plainText)(item.choice.options[item.choice.answer])
    : item.fraction ? (item.negative ? '−' : '') + (item.mixed ? item.inputs[0].answer + ' ' : '') + item.inputs.slice(-2).map((input) => input.answer).join('/') + (item.unit ? ' ' + item.unit : '')
    : item.inputs.map((input) => (input.label ? input.label + ' ' : '') + (input.lead ? input.lead + ' ' : '') + signedText(input.answer) + (input.unit ? (/^([A-Za-z%:]|°C)/.test(input.unit.trim()) ? ' ' : '') + input.unit.trim() : ''))
      // 비(□ : □)는 쉼표 없이 잇는다.
      .reduce((text, part, i) => text + (i ? (/:$/.test(text) ? ' ' : ', ') : '') + part, ''));

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
      card.querySelectorAll('.mb-field input, .mb-field select.mb-rel').forEach((box) => {
        const text = String(Array.isArray(response) ? response[Number(box.dataset.at)] ?? '' : response);
        if (box.dataset.signed) { const button = box._sign; setSign(button, /^[-−]/.test(text) ? '−' : '+'); button.disabled = true; box.value = text.replace(/^[-−+]/, ''); } else box.value = text;
        box.disabled = true;
      });
      card.querySelector('.mb-primary').disabled = true;
    }
    const result = card.querySelector('.mb-result');
    result.hidden = false;
    result.className = 'mb-result ' + (ok ? 'is-right' : 'is-wrong');
    result.innerHTML = ok ? '<strong>정답</strong>' : '<strong>답: ' + answerText(item, true) + '</strong>' + (item.explain ? '<br>' + item.explain : '');
    tie(result);
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
    await fillSelects(record.length >= 3 ? record[0] : params.get('unit') || params.get('term'));
    await loadFinished();
    if (record.length >= 3 && unit.id === record[0] && B.findGroup(unit, record[1]) && B.LEVELS.includes(record[2])) await openRound(record[1], record[2], Number(record[3]) || 1);
    else showGroups();
  }
  start().catch((error) => { main.replaceChildren(el('p', 'mb-empty', '문제를 불러오지 못했습니다. 새로 고침 해 주세요.')); console.error(error); });
})();
