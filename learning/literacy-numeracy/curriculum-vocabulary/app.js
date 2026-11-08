(function () {
  'use strict';

  const books = window.CurriculumWords || {};
  const termSelect = document.getElementById('term');
  const subjectList = document.getElementById('subjects');
  const unitList = document.getElementById('unit-list');
  const unitSelect = document.getElementById('unit-select');
  const lesson = document.getElementById('lesson');
  const query = new URLSearchParams(location.search);
  const terms = Array.from({ length: 12 }, (_, i) => `${Math.floor(i / 2) + 1}-${i % 2 + 1}`);
  const termName = (key) => `${key[0]}학년 ${key[2]}학기`;
  const subjectsFor = (key) => Number(key[0]) <= 2 ? ['국어', '수학'] : ['국어', '수학', '사회', '과학'];
  const ready = Object.keys(books);
  const currentTerm = window.LearningDefaults?.mathTerm(window.CLASS_SCHOOL_LEVEL, window.CLASS_SCHOOL_GRADE, ready);
  let term = terms.includes(query.get('term')) ? query.get('term') : (ready.includes(currentTerm) ? currentTerm : ready[0] || '1-1');
  let subject = subjectsFor(term).includes(query.get('subject')) ? query.get('subject') : '국어';
  let unitId = query.get('unit');
  let mode = query.get('mode') === 'practice' ? 'practice' : 'words';
  let leavePractice = null;

  function element(tag, text, className) {
    const node = document.createElement(tag);
    if (text) node.textContent = text;
    if (className) node.className = className;
    return node;
  }

  function button(text, action, className) {
    const node = element('button', text, className);
    node.type = 'button';
    node.addEventListener('click', action);
    return node;
  }

  function shuffle(list) {
    const copy = list.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  const hasHan = (text) => /\p{Script=Han}/u.test(text);

  function hanjaOf(word) {
    if (!word.hanja) return null;
    const row = element('p', '', 'hanja');
    for (const [glyph, reading] of word.hanja) {
      const piece = element('span', '', 'hanja-piece');
      piece.append(element('span', glyph, hasHan(glyph) ? 'hanja-glyph' : 'plain-glyph'), element('span', reading, 'hanja-reading'));
      row.append(piece);
    }
    return row;
  }

  // 예문 속 낱말에만 표시를 붙인다.
  // 예문에서 낱말 자리를 찾는다. '복사기로 … 복사하셨다'처럼 더 긴 낱말 속에 든 자리는 건너뛰고,
  // 뒤에 조사·끝말이 붙거나 글자가 끝나는 자리를 고른다. 그런 자리가 없으면 처음 자리.
  const after = /^(?:[^가-힣]|[이가을를은는의에도만와과로으라랑하되됐했한할해였처보까부께서며고면게지인일]|$)/;
  function wordAt(text, word) {
    let first = -1;
    for (let at = text.indexOf(word); at >= 0; at = text.indexOf(word, at + 1)) {
      if (first < 0) first = at;
      if (after.test(text.slice(at + word.length))) return at;
    }
    return first;
  }
  // 빈칸 뒤 '(이)라고', '을/를' 같은 조사를 채운 낱말의 받침에 맞춘다.
  function particleFor(word, rest) {
    const last = word.charCodeAt(word.length - 1) - 0xac00;
    const coda = last >= 0 && last < 11172 ? last % 28 : 0;
    const pairs = { '이/가': ['이', '가'], '을/를': ['을', '를'], '은/는': ['은', '는'], '와/과': ['과', '와'] };
    return rest.replace(/^\(이\)/, coda ? '이' : '').replace(/^\(으\)/, coda && coda !== 8 ? '으' : '')
      .replace(/^(이\/가|을\/를|은\/는|와\/과)/, (m) => pairs[m][coda ? 0 : 1]);
  }

  function sentenceWith(text, word) {
    const p = element('p', '', 'word-use');
    const at = wordAt(text, word);
    if (at < 0) { p.textContent = text; return p; }
    p.append(text.slice(0, at), element('mark', word), text.slice(at + word.length));
    return p;
  }

  function wordCardOf(word) {
    const card = element('article', '', 'word-card');
    const head = element('div', '', 'word-head');
    head.append(element('h3', word.w));
    const hanja = hanjaOf(word);
    if (hanja) head.append(hanja);
    card.append(head, element('p', word.mean, 'word-mean'), sentenceWith(word.use, word.w));
    return card;
  }

  // 장면은 칸마다 한 줄씩 열린다. 처음에는 저절로 넘어가고, 아이가 칸을 누르면 멈춘다.
  let sceneTimer = null;
  const stopScene = () => { clearTimeout(sceneTimer); sceneTimer = null; };

  // 그림 한 장 위에 칸 글이 차례로 뜬다. 그림은 칸마다 천천히 다가간다.
  function sceneOf(scene) {
    const box = element('figure', '', 'scene');
    const stage = element('div', '', 'stage');
    if (scene.pic) {
      const picture = element('img');
      picture.src = `images/${term}/${scene.pic}`;
      picture.alt = '';
      picture.decoding = 'async';
      stage.append(picture);
    } else {
      stage.classList.add('figure');
      stage.innerHTML = scene.figure;
    }
    const caption = element('figcaption', '', 'caption');
    caption.setAttribute('aria-live', 'polite');
    const controls = element('div', '', 'beats');
    const dots = scene.beats.map((_, i) => button(String(i + 1), () => { stopScene(); show(i + 1); }, 'dot'));
    dots.forEach((dot, i) => dot.setAttribute('aria-label', `${i + 1}번째 장면`));
    const replay = button('↻ 다시 보기', () => play(), 'replay');
    controls.append(...dots, replay);
    box.append(stage, caption, controls);
    let beat = 0;
    function show(n) {
      beat = n;
      for (let i = 1; i <= 6; i++) stage.classList.toggle('on' + i, i <= n);
      caption.replaceChildren(element('span', String(n), 'beat-no'), scene.beats[n - 1]);
      dots.forEach((dot, i) => dot.setAttribute('aria-pressed', String(i === n - 1)));
    }
    function play() {
      stopScene();
      for (let i = 1; i <= 6; i++) stage.classList.remove('on' + i);
      void stage.offsetWidth;
      const step = () => {
        show(beat + 1);
        if (beat < scene.beats.length) sceneTimer = setTimeout(step, 3200);
      };
      beat = 0;
      sceneTimer = setTimeout(step, 250);
    }
    play();
    return box;
  }

  // 영어 낱말을 누르면 브라우저 음성으로 읽어 준다(영어 단어·동화책 앱과 같은 방식: 미국 영어 목소리, 0.85배).
  // 목소리 목록은 늦게 들어오는 브라우저가 있어 바뀔 때마다 다시 고른다. 음성 기능이 없으면 글자만 보인다.
  const speech = 'speechSynthesis' in window && typeof SpeechSynthesisUtterance === 'function' ? window.speechSynthesis : null;
  let englishVoice = null;
  function pickVoice() {
    const voices = speech.getVoices().filter(voice => /^en[-_]/i.test(voice.lang));
    englishVoice = voices.find(voice => /^en[-_]US/i.test(voice.lang)) || voices[0] || null;
  }
  if (speech) { pickVoice(); speech.addEventListener?.('voiceschanged', pickVoice); }
  // 괄호와 가운뎃점은 쉼으로 읽힌다: "average (mean)" → "average, mean"
  const spoken = (en) => en.replace(/\s*\(\s*/g, ', ').replace(/\s*\)\s*/g, ' ').replace(/\s*·\s*/g, ', ').trim();
  function englishOf(en) {
    const label = element('span', en, 'word-en');
    if (!speech) return label;
    const say = element('button', '', 'say');
    say.type = 'button';
    say.setAttribute('aria-label', en + ' 소리 듣기');
    say.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor"/><path class="wave" d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
    say.prepend(label);
    say.addEventListener('click', () => {
      speech.cancel();
      const talk = new SpeechSynthesisUtterance(spoken(en));
      talk.lang = 'en-US';
      talk.rate = 0.85;
      if (!englishVoice) pickVoice();
      if (englishVoice) talk.voice = englishVoice;
      talk.onstart = () => say.classList.add('talking');
      talk.onend = talk.onerror = () => say.classList.remove('talking');
      speech.speak(talk);
    });
    return say;
  }

  function wordPageOf(unit, index, select) {
    const word = unit.words[index];
    const page = element('article', '', 'word-page');
    const head = element('header', '', 'word-title');
    head.append(element('h3', word.w));
    if (word.en) head.append(englishOf(word.en));
    const hanja = hanjaOf(word);
    if (hanja) head.append(hanja);
    page.append(head);
    const figure = (window.CurriculumFigures || {})[`${term}/${subject}/${unit.id}/${word.w}`];
    // 코드로 그린 도식이 있으면 그림보다 도식을 쓴다(글자 낱말은 그림으로 보여 줄 수 없다).
    // 크롬북·아이패드 가로 화면에서는 장면을 왼쪽, 뜻과 설명을 오른쪽에 나란히 둔다(styles.css .word-body).
    const body = element('div', '', 'word-body');
    const side = element('div', '', 'word-text');
    if (word.beats && (word.pic || figure)) { body.classList.add('has-scene'); body.append(sceneOf({ ...word, pic: figure ? null : word.pic, figure })); }
    body.append(side);
    page.append(body);
    // 이 단원에서 쓰는 뜻 → 설명 → 생활에서 마주치는 다른 뜻(②부터) 차례로 보인다.
    const meanings = element('ol', '', 'meanings');
    if (word.senses) meanings.classList.add('has-others');
    const own = element('li', '', 'meaning own');
    own.append(element('p', word.mean, 'word-mean'), sentenceWith(word.use, word.w));
    meanings.append(own);
    side.append(meanings);
    if (word.explain) {
      const more = element('div', '', 'explain');
      more.append(...word.explain.map(text => element('p', text)));
      side.append(more);
    }
    // 다른 뜻은 두 묶음으로 나눈다. 다의어(같은 낱말의 다른 뜻)를 먼저, 동형어(소리만 같은 다른 낱말)를 그 아래에.
    // 번호는 ①(이 단원 뜻)에 이어 ②, ③…으로 이어 센다.
    if (word.senses) {
      let number = 2;
      const groups = [
        ['다의어', '같은 낱말의 다른 뜻', 'polysemy'],
        ['동형어', '소리만 같은 다른 낱말', 'homonym']
      ];
      for (const [kind, gloss, cls] of groups) {
        const rows = word.senses.filter(sense => (sense.kind || '다의어') === kind);
        if (!rows.length) continue;
        const group = element('section', '', `sense-group ${cls}`);
        const label = element('p', '', 'sense-kind');
        label.append(element('b', kind), element('span', gloss));
        const list = element('ol', '', 'meanings others');
        list.start = number;
        list.style.counterReset = `sense ${number - 1}`;
        for (const sense of rows) {
          const item = element('li', '', 'meaning');
          const text = element('p', '', 'word-mean');
          if (sense.hanja) text.append(element('span', sense.hanja, 'hanja-glyph small'), ' ');
          text.append(sense.mean);
          item.append(text, sentenceWith(sense.use, word.w));
          list.append(item);
          number++;
        }
        group.append(label, list);
        side.append(group);
      }
    }
    const paging = element('nav', '', 'paging');
    paging.setAttribute('aria-label', '다른 낱말');
    if (index > 0) paging.append(button('← ' + unit.words[index - 1].w, () => select(index - 1)));
    paging.append(index < unit.words.length - 1
      ? button(unit.words[index + 1].w + ' →', () => select(index + 1), 'next-word')
      : button('연습하기', () => { mode = 'practice'; showLesson(unit, true); }, 'start'));
    page.append(paging);
    return page;
  }

  // 낱말 단추 줄 하나만 둔다. 맨 끝 단추가 연습이다. 연습 중에 낱말을 누르면 그 낱말로 돌아간다.
  function chipsOf(unit, current, onWord) {
    const chips = element('nav', '', 'chips');
    chips.setAttribute('aria-label', '낱말과 연습');
    const controls = unit.words.map((word, i) => button(word.w, () => onWord(i)));
    const practice = button('연습', () => { mode = 'practice'; showLesson(unit, true); }, 'practice-chip');
    controls.forEach((control, i) => control.setAttribute('aria-pressed', String(i === current)));
    practice.setAttribute('aria-pressed', String(mode === 'practice'));
    chips.append(...controls, practice);
    return { chips, controls, practice };
  }

  function wordsViewOf(unit, start = 0) {
    const view = element('div', '', 'words-view');
    const holder = element('div');
    const { chips, controls } = chipsOf(unit, start, (i) => select(i, true));
    function select(i, focus) {
      stopScene();
      controls.forEach((control, j) => control.setAttribute('aria-pressed', String(i === j)));
      holder.replaceChildren(wordPageOf(unit, i, (n) => { select(n); chips.scrollIntoView({ block: 'nearest' }); controls[n].focus({ preventScroll: true }); }));
      if (focus) controls[i].focus({ preventScroll: true });
    }
    view.append(chips, holder);
    select(start);
    return view;
  }

  // 단원 낱말이 넷보다 적으면 같은 과목의 다른 단원 낱말로 보기를 채운다.
  function poolFor(unit) {
    const own = unit.words;
    if (own.length >= 4) return own;
    const others = books[term][subject].units.flatMap(row => row === unit ? [] : row.words);
    return own.concat(shuffle(others).slice(0, 4 - own.length));
  }

  const kindsOf = (word) => word.blanks.map(text => ({ kind: 'blank', text })).concat({ kind: 'mean', text: word.mean });

  function questionsFor(unit) {
    return shuffle(unit.words).map(word => {
      const kinds = kindsOf(word);
      return { word, ...kinds[Math.floor(Math.random() * kinds.length)] };
    });
  }

  function practiceViewOf(unit) {
    const view = element('div', '', 'practice');
    const pool = poolFor(unit);
    let queue, total, done, missed, firstTry;

    function start() {
      queue = questionsFor(unit);
      total = queue.length;
      done = 0;
      missed = new Set();
      firstTry = 0;
      next();
    }

    function progressOf() {
      const bar = element('div', '', 'progress');
      bar.setAttribute('role', 'progressbar');
      bar.setAttribute('aria-valuemin', '0');
      bar.setAttribute('aria-valuemax', String(total));
      bar.setAttribute('aria-valuenow', String(done));
      bar.setAttribute('aria-label', `${total}문제 가운데 ${done}문제 맞힘`);
      const fill = element('span');
      fill.style.width = `${done / total * 100}%`;
      bar.append(fill);
      return bar;
    }

    function next() {
      if (!queue.length) return finish();
      const item = queue.shift();
      const { word } = item;
      const card = element('section', '', 'question');
      const prompt = element('p', '', 'prompt');
      let blank = null, blankRest = null;
      if (item.kind === 'blank') {
        const [before, after] = item.text.split('{}');
        blank = element('span', '', 'blank');
        blank.setAttribute('aria-label', '빈칸');
        blankRest = document.createTextNode(after);
        prompt.append(before, blank, blankRest);
      } else {
        prompt.classList.add('meaning');
        prompt.append(element('span', '뜻', 'tag'), item.text);
      }
      const ask = element('h3', item.kind === 'blank' ? '빈칸에 알맞은 낱말은?' : '이 뜻을 가진 낱말은?');
      const choices = element('div', '', 'choices');
      const result = element('div', '', 'result');
      result.setAttribute('role', 'status');
      const options = shuffle([word, ...shuffle(pool.filter(row => row !== word)).slice(0, 3)]);
      const buttons = options.map(option => button(option.w, () => answer(option)));
      choices.append(...buttons);
      card.append(ask, prompt, choices, result);
      view.replaceChildren(progressOf(), card);
      buttons[0].focus({ preventScroll: true });

      let tried = false;
      function answer(option) {
        const right = option === word;
        const chosen = buttons[options.indexOf(option)];
        if (!right) {
          chosen.classList.add('wrong');
          chosen.disabled = true;
          if (!tried) { missed.add(word); tried = true; }
          result.replaceChildren(element('p', `${option.w}: ${option.mean}`, 'wrong-note'));
          card.classList.remove('shake');
          void card.offsetWidth;
          card.classList.add('shake');
          return;
        }
        if (!tried) {
          done++;
          if (!item.retry) firstTry++;
        } else {
          // 틀린 낱말은 다른 문장으로 뒤에 한 번 더 묻는다.
          const others = kindsOf(word).filter(row => row.text !== item.text);
          queue.push({ word, retry: true, ...others[Math.floor(Math.random() * others.length)] });
        }
        buttons.forEach(node => { node.disabled = true; });
        chosen.classList.add('right');
        if (blank) { blank.textContent = word.w; blank.classList.add('filled'); blankRest.textContent = particleFor(word.w, blankRest.textContent); }
        const note = element('div', '', 'right-note');
        if (tried) note.append(element('p', '이 낱말은 뒤에 다른 문제로 한 번 더 나옵니다.', 'verdict'));
        if (item.kind === 'blank') note.append(element('p', `${word.w}: ${word.mean}`));
        else note.append(sentenceWith(word.use, word.w));
        const go = button(queue.length ? '다음' : '결과 보기', next, 'next');
        result.replaceChildren(note, go);
        view.querySelector('.progress').replaceWith(progressOf());
        go.focus({ preventScroll: true });
      }
    }

    function finish() {
      const end = element('section', '', 'finish');
      end.append(element('p', `처음에 맞힌 문제 ${firstTry} / ${total}`, 'score'));
      if (missed.size) {
        end.append(element('h3', '다시 볼 낱말'));
        const list = element('div', '', 'word-list compact');
        list.append(...unit.words.filter(word => missed.has(word)).map(wordCardOf));
        end.append(list);
      }
      const actions = element('div', '', 'finish-actions');
      actions.append(button('한 번 더', start, 'start'), button('낱말 보기', () => { mode = 'words'; showLesson(unit, true); }));
      end.append(actions);
      view.replaceChildren(end);
      actions.firstChild.focus({ preventScroll: true });
    }

    start();
    return view;
  }

  function showLesson(unit, focus, start = 0) {
    stopScene();
    leavePractice = null;
    lesson.setAttribute('aria-label', unit?.title || '학습 내용');
    if (!unit) {
      lesson.replaceChildren(element('p', '이 학기의 교과 단어는 준비 중입니다.', 'empty'));
      return;
    }
    if (mode === 'practice') {
      const { chips } = chipsOf(unit, -1, (i) => { mode = 'words'; showLesson(unit, true, i); });
      lesson.replaceChildren(chips, practiceViewOf(unit));
      leavePractice = () => { mode = 'words'; showLesson(unit, true); };
    } else {
      lesson.replaceChildren(wordsViewOf(unit, start));
    }
    syncUrl();
    if (focus) {
      (mode === 'practice' ? lesson.querySelector('.choices button') : lesson.querySelector('.chips [aria-pressed="true"]'))?.focus({ preventScroll: true });
      lesson.scrollIntoView({ block: 'nearest' });
    }
  }

  function syncUrl() {
    if (location.protocol === 'file:') return;
    const url = new URL(location.href);
    url.searchParams.set('term', term);
    url.searchParams.set('subject', subject);
    if (unitId) url.searchParams.set('unit', unitId);
    else url.searchParams.delete('unit');
    if (mode === 'practice') url.searchParams.set('mode', 'practice');
    else url.searchParams.delete('mode');
    history.replaceState(null, '', url);
  }

  function render(focusGroup) {
    const units = books[term]?.[subject]?.units || [];
    const unit = units.find((row) => row.id === unitId) || units[0];
    unitId = unit?.id;
    termSelect.value = term;
    let focusTarget;
    subjectList.replaceChildren(...subjectsFor(term).map((name) => {
      const control = button(name, () => { subject = name; unitId = null; mode = 'words'; render('subject'); });
      control.setAttribute('aria-pressed', String(name === subject));
      if (focusGroup === 'subject' && name === subject) focusTarget = control;
      return control;
    }));
    unitList.replaceChildren(...units.map((row) => {
      const control = button(row.title, () => { unitId = row.id; mode = 'words'; render('unit'); });
      if (row === unit) {
        control.setAttribute('aria-current', 'true');
        if (focusGroup === 'unit') focusTarget = control;
      }
      return control;
    }));
    unitSelect.replaceChildren(...units.map((row) => {
      const option = element('option', row.title);
      option.value = row.id;
      option.selected = row === unit;
      return option;
    }));
    unitSelect.hidden = !units.length;
    if (!units.length) unitList.append(element('p', '준비 중'));
    showLesson(unit);
    syncUrl();
    focusTarget?.focus();
  }

  for (const key of terms) {
    const option = element('option', termName(key) + (books[key] ? '' : ' · 준비 중'));
    option.value = key;
    termSelect.append(option);
  }
  termSelect.addEventListener('change', () => {
    term = termSelect.value;
    if (!subjectsFor(term).includes(subject)) subject = '국어';
    unitId = null;
    mode = 'words';
    render();
  });
  unitSelect.addEventListener('change', () => {
    unitId = unitSelect.value;
    mode = 'words';
    render();
  });
  // 연습 중 뒤로가기는 낱말 목록으로 한 칸만 돌아간다.
  window.addEventListener('sitebackrequest', (event) => {
    if (!leavePractice) return;
    event.preventDefault();
    leavePractice();
  });
  render();
})();
