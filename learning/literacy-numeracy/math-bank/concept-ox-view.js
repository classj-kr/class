// OX는 기존 math-ox 기록을 그대로 사용한다. 일반 문제 기록과 문항 ID는 섞지 않는다.
(function () {
  'use strict';
  const C = window.MathConceptOX;
  let assets;
  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script'); script.src = src;
      script.onload = resolve; script.onerror = () => { script.remove(); reject(new Error(src)); };
      document.head.append(script);
    });
  }
  function loadAssets() {
    if (!assets) assets = (async () => {
      const css = document.createElement('link'); css.rel = 'stylesheet'; css.href = '../math-ox/vendor/katex.min.css';
      const styled = new Promise((resolve, reject) => { css.onload = resolve; css.onerror = reject; });
      document.head.append(css);
      await Promise.all([styled, window.MATH_OX_DATA ? Promise.resolve() : loadScript('../math-ox/data.js?v=20261001-units'),
        (async () => { if (!window.katex) await loadScript('../math-ox/vendor/katex.min.js'); if (!window.renderMathInElement) await loadScript('../math-ox/vendor/auto-render.min.js'); })()]);
    })().catch(error => { assets = null; throw error; });
    return assets;
  }
  const el = (tag, cls, html) => { const node = document.createElement(tag); if (cls) node.className = cls; if (html != null) node.innerHTML = html; return node; };
  const closed = state => Boolean(state && (state.isCorrect || state.revealed));
  const firstRight = state => Boolean(state?.firstOk && !state.hinted);
  C.createView = function ({ main, bankRecords, setBusy, showGroups }) {
    let records, active = false, unit, items = [], answered = {}, checkpoint = {};
    const snapshot = q => ({ prompt: q.prompt, subject: q.subject, unit: q.unit });
    const math = node => window.renderMathInElement(node, {
      delimiters: [{ left: '$$', right: '$$', display: true }, { left: '$', right: '$', display: false }], throwOnError: false,
      preProcess: input => {
        let text = input.replace(/(^|[^\w\\])(\d+)\/(\d+)(?!\w)/g, (_, prefix, a, b) => `${prefix}\\dfrac{${a}}{${b}}`);
        if (items[0].subject.startsWith('초')) text = text.replace(/\\frac(?![a-zA-Z])/g, '\\dfrac');
        if (/\\(int|iint|iiint|oint|sum|prod|lim|bigcap|bigcup)(?![a-zA-Z])/.test(text) && !/\\(display|text)style/.test(text)) text = '\\displaystyle ' + text;
        return text;
      }
    });
    function toolbar() {
      records.title.textContent = records.title.title = unit.title + ' · 기초 개념 OX';
      records.progress.textContent = items.filter(q => closed(answered[q.id])).length + ' / ' + items.length;
    }
    async function save(events = []) {
      const subjectItems = window.MATH_OX_DATA.filter(q => q.subject === items[0].subject);
      await records.save({ checkpoint: { ...checkpoint, answered, unit: items[0].unit, bankUnitId: unit.id },
        progress: { current: subjectItems.filter(q => closed(answered[q.id])).length, total: subjectItems.length }, events });
      toolbar();
    }
    function paint(card, q) {
      const state = answered[q.id];
      card.classList.toggle('is-right', Boolean(state?.isCorrect));
      card.classList.toggle('is-wrong', Boolean(state && !state.isCorrect));
      card.querySelectorAll('.mb-ox-answer').forEach(button => {
        button.disabled = closed(state);
        button.classList.toggle('is-selected', button.dataset.choice === state?.selectedChoice);
        button.setAttribute('aria-pressed', String(button.dataset.choice === state?.selectedChoice));
      });
      const result = card.querySelector('.mb-result'); result.replaceChildren(); result.hidden = !state;
      if (!state) return;
      result.append(el('strong', null, state.isCorrect ? '정답입니다.' : state.revealed ? '정답: ' + q.answer : '다시 생각해 보세요.'));
      const explanation = state.isCorrect || state.revealed;
      if (!explanation) result.append(el('p', 'mb-hint', q.pitfall));
      if (state.revealed) result.append(el('div', 'mb-ox-reason', q.reason));
      else {
        const reveal = el('button', 'mb-plain mb-ox-reveal', explanation ? '풀이 보기' : '정답·풀이 보기'); reveal.type = 'button';
        reveal.addEventListener('click', () => change(async () => {
          // 정답 뒤에 풀이를 열어 보는 것은 최초 정답을 바꾸지 않는다.
          answered[q.id] = { ...state, revealed: true, ...(state.isCorrect ? {} : { hinted: true, firstOk: false }) };
          paint(card, q); await save(state.isCorrect ? [] : [{ kind: 'hint', questionKey: String(q.id), response: '정답·풀이 보기', snapshot: snapshot(q) }]); finish();
        }));
        result.append(reveal);
      }
      math(result);
    }
    // 재진입과 저장 중에는 단원 선택까지 잠가 다른 기록에 응답이 섞이지 않게 한다.
    async function change(operation) {
      if (main.inert) return;
      setBusy(true);
      try { await operation(); }
      finally { setBusy(false); }
    }
    async function answer(q, card, choice) {
      if (closed(answered[q.id])) return;
      await change(async () => {
        const previous = answered[q.id], correct = choice === q.answer;
        answered[q.id] = { selectedChoice: choice, isCorrect: correct, firstOk: previous ? previous.firstOk : correct,
          hinted: Boolean(previous?.hinted || !correct), attempts: (previous?.attempts || 0) + 1 };
        paint(card, q);
        const events = [{ kind: 'answer', questionKey: String(q.id), response: choice, correct, snapshot: snapshot(q) }];
        if (!correct && !previous?.hinted) events.push({ kind: 'hint', questionKey: String(q.id), response: q.pitfall, snapshot: snapshot(q) });
        await save(events); finish();
        window.ClassGameSfx?.play(correct ? 'success' : 'error');
      });
    }
    function finish() {
      const panel = main.querySelector('.mb-ox-finish');
      panel.hidden = !items.every(q => closed(answered[q.id]));
      if (panel.hidden) return;
      panel.replaceChildren(el('p', null, items.length + '문항 중 ' + items.filter(q => firstRight(answered[q.id])).length + '문항 정답'));
      const back = el('button', 'mb-plain', '단원 차시 보기'); back.type = 'button'; back.addEventListener('click', showGroups); panel.append(back);
    }
    function render() {
      const header = el('div', 'mb-round-head');
      const title = el('h1', 'mb-round-title'); title.textContent = unit.title + ' · 기초 개념 OX';
      const back = el('button', 'mb-plain', '단원 차시 보기'); back.type = 'button'; back.addEventListener('click', showGroups); header.append(back);
      const list = el('ol', 'mb-items mb-ox-items'); list.dataset.sfxFeedback = 'none';
      for (const q of items) {
        const card = el('li', 'mb-item mb-ox-item'); card.dataset.questionId = q.id;
        card.append(el('div', 'mb-text mb-ox-prompt', q.prompt));
        const controls = el('div', 'mb-answer mb-ox-answers');
        for (const choice of ['O', 'X']) {
          const button = el('button', 'mb-ox-answer', choice); button.type = 'button'; button.dataset.choice = choice; button.dataset.sfx = 'none';
          button.setAttribute('aria-label', choice === 'O' ? '맞다 O' : '아니다 X'); button.addEventListener('click', () => answer(q, card, choice)); controls.append(button);
        }
        card.append(controls, el('div', 'mb-result')); paint(card, q); list.append(card);
      }
      main.replaceChildren(title, header, list, el('section', 'mb-finish mb-ox-finish')); math(list); finish(); toolbar();
    }
    return {
      get active() { return active; },
      close() { active = false; if (records) records.host.hidden = true; bankRecords.host.hidden = false; },
      async open(nextUnit) {
        if (!C.idsFor(nextUnit.id).length) return;
        setBusy(true);
        try {
          await loadAssets();
          if (!records) { records = window.LearningRecords.create('math-ox', { label: '기초 개념 OX', mount: main }); records.host.hidden = true; }
          await records.ready;
          unit = nextUnit;
          const ids = new Set(C.idsFor(unit.id)); items = window.MATH_OX_DATA.filter(q => ids.has(q.id));
          const subject = items[0].subject;
          const session = records.session?.contentKey === subject ? records.session : await records.start({ contentKey: subject, title: '수학 기초 OX · ' + subject, version: '20261001', href: '/learning/literacy-numeracy/math-ox/', checkpoint: { answered: {}, unit: '단원 전체' } });
          checkpoint = session.checkpoint || {}; answered = { ...checkpoint.answered };
          for (const [id, state] of Object.entries(answered)) {
            const first = session.events?.find(event => event.kind === 'answer' && event.questionKey === String(id));
            answered[id] = { ...state, firstOk: state.firstOk ?? first?.correct ?? state.isCorrect, hinted: state.hinted ?? !(first?.correct ?? state.isCorrect), attempts: state.attempts || 1 };
          }
          active = true; bankRecords.host.hidden = true; records.host.hidden = false;
          const url = new URL(location.href); url.searchParams.delete('term'); url.searchParams.set('unit', unit.id); url.searchParams.set('concept', '1'); url.searchParams.set('record', subject); history.replaceState(history.state, '', url);
          render();
          await save();
        } finally { setBusy(false); }
      }
    };
  };
})();
