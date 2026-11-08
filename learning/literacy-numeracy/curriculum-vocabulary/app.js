(function () {
  'use strict';

  // 학기마다 낱말 파일과 도식 파일을 고를 때 불러온다(terms.js 목록). 낱말 파일은 이 객체에 학기를 더한다.
  const books = window.CurriculumWords = window.CurriculumWords || {};
  // ?preview=1 이면 만드는 중인 학기까지 보인다(만드는 사람이 확인할 때).
  const manifest = (new URLSearchParams(location.search).has('preview') ? window.CurriculumTermsPreview : window.CurriculumTerms) || {};
  const loading = {};
  const loadScript = (src) => new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.append(script);
  });
  function loadTerm(key) {
    if (!manifest[key]) return Promise.resolve();
    loading[key] = loading[key] || (async () => {
      await loadScript(manifest[key].words);
      for (const file of manifest[key].figures) await loadScript(file);
    })();
    return loading[key];
  }
  const termSelect = document.getElementById('term');
  const subjectList = document.getElementById('subjects');
  const unitList = document.getElementById('unit-list');
  const unitSelect = document.getElementById('unit-select');
  const lesson = document.getElementById('lesson');
  const query = new URLSearchParams(location.search);
  const terms = Array.from({ length: 12 }, (_, i) => `${Math.floor(i / 2) + 1}-${i % 2 + 1}`);
  const termName = (key) => `${key[0]}학년 ${key[2]}학기`;
  const subjectsFor = (key) => Number(key[0]) <= 2 ? ['국어', '수학'] : ['국어', '수학', '사회', '과학'];
  const ready = Object.keys(manifest);
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

  function sentenceWith(text, word, lead = '') {
    const p = element('p', '', 'word-use');
    const at = wordAt(text, word);
    if (at < 0) { p.textContent = lead + text; return p; }
    p.append(lead + text.slice(0, at), element('mark', word), text.slice(at + word.length));
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

  // 이 단원 뜻의 유의어·반의어·관련 단어(상위어·하위어). 같은 단원 낱말이면 눌러서 그 낱말로 간다.
  const REL = [
    ['syn', '유의어'],
    ['ant', '반의어'],
    ['related', '관련 단어']
  ];
  function relationsOf(unit, word, select) {
    if (!word.rel) return null;
    const box = element('div', '', 'relations');
    for (const [key, name] of REL) {
      // 상위어·하위어와 견주어 볼 낱말(see)은 '관련 단어' 한 줄로 묶어 보인다. 같은 낱말은 한 번만.
      const rows = key === 'related'
        ? [...(word.rel.see || []), ...(word.rel.up || []), ...(word.rel.down || [])].filter((row, i, all) => all.findIndex(other => other.w === row.w) === i)
        : word.rel[key];
      if (!rows || !rows.length) continue;
      const line = element('div', '', `rel rel-${key}`);
      const label = element('p', '', 'rel-kind');
      label.append(element('b', name));
      const chips = element('div', '', 'rel-words');
      for (const row of rows) {
        const at = unit.words.findIndex(item => item.w === row.w);
        chips.append(at >= 0 ? button(row.w + ' →', () => select(at), 'rel-word linked') : element('span', row.w, 'rel-word'));
      }
      line.append(label, chips);
      // 설명 글에 이미 그 낱말이 들어 있으면 앞에 이름을 다시 붙이지 않는다.
      for (const row of rows.filter(item => item.note)) line.append(element('p', row.note.includes(row.w) ? row.note : `${row.w}: ${row.note}`, 'rel-note'));
      box.append(line);
    }
    return box.childElementCount ? box : null;
  }

  // 설명 한 줄: '비교: …'처럼 이름표가 앞에 있으면 색 이름표로 떼어 보인다.
  const EXPLAIN_TAGS = { '쉬운 뜻': 'easy', '낱말 나누기': 'parts', '한자 뜻': 'hanja', '비교': 'compare', '생활 속 예': 'life', '꼭 알기': 'key' };
  function explainLine(text) {
    const line = element('p', '', 'ex');
    const m = text.match(/^(쉬운 뜻|낱말 나누기|한자 뜻|비교|생활 속 예|꼭 알기):\s*/);
    if (!m) { line.textContent = text; return line; }
    line.classList.add('tagged');
    line.append(element('b', m[1], `ex-tag ex-${EXPLAIN_TAGS[m[1]]}`), element('span', text.slice(m[0].length)));
    return line;
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
    const relations = relationsOf(unit, word, select);
    if (relations) side.append(relations);
    if (word.explain) {
      const more = element('div', '', 'explain');
      more.append(...word.explain.map(explainLine));
      side.append(more);
    }
    // 다른 뜻은 두 묶음으로 나눈다. 다의어(같은 낱말의 다른 뜻)를 먼저, 동형어(소리만 같은 다른 낱말)를 그 아래에.
    // 번호는 ①(이 단원 뜻)에 이어 ②, ③…으로 이어 센다.
    if (word.senses) {
      let number = 2;
      const groups = [
        ['다의어', 'polysemy'],
        ['동형어', 'homonym']
      ];
      for (const [kind, cls] of groups) {
        const rows = word.senses.filter(sense => (sense.kind || '다의어') === kind);
        if (!rows.length) continue;
        const group = element('section', '', `sense-group ${cls}`);
        const label = element('p', '', 'sense-kind');
        label.append(element('b', kind));
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
  const pick = (rows) => rows[Math.floor(Math.random() * rows.length)];

  // 다른 뜻이 있는 낱말은 '이 문장에서 이 낱말의 뜻은?'으로 묻는다. 다의어·동형어를 가려 보는 연습이다.
  function senseQuestion(word) {
    const all = [{ mean: word.mean, use: word.use, kind: '이 단원' }, ...word.senses];
    const target = pick(all);
    let others = shuffle(all.filter(row => row !== target)).slice(0, 3);
    // 뜻이 둘뿐이면 반은 찍어서 맞히므로, 헷갈리는 오답 낱말들의 뜻으로 보기를 넷까지 채운다.
    if (others.length < 3) {
      const subjectWords = books[term][subject].units.flatMap(row => row.words);
      const extra = shuffle((word.foils || []).map(name => subjectWords.find(row => row.w === name)).filter(Boolean))
        .slice(0, 3 - others.length).map(row => ({ mean: row.mean, other: row.w }));
      others = others.concat(extra);
    }
    return { kind: 'sense', word, target, choices: shuffle([target, ...others]) };
  }
  // 반의어·유의어가 있는 낱말은 '뜻이 반대인(비슷한) 낱말은?'으로 묻는다. 보기는 관계없는 같은 단원 낱말.
  function relQuestion(word, pool) {
    const keys = ['ant', 'syn'].filter(key => word.rel?.[key]?.length);
    if (!keys.length) return null;
    const key = pick(keys);
    const answer = pick(word.rel[key]).w;
    const related = new Set([word.w, ...['syn', 'ant', 'up', 'down', 'see'].flatMap(k => (word.rel[k] || []).map(row => row.w))]);
    const others = shuffle(pool.filter(row => !related.has(row.w))).slice(0, 3).map(row => row.w);
    if (others.length < 3) return null;
    return { kind: 'rel', key, word, answer, choices: shuffle([answer, ...others]) };
  }

  function questionsFor(unit, pool) {
    return shuffle(unit.words).map(word => {
      if (word.senses) return senseQuestion(word);
      const rel = Math.random() < 0.5 ? relQuestion(word, pool) : null;
      if (rel) return rel;
      return { word, ...pick(kindsOf(word)) };
    });
  }

  function practiceViewOf(unit) {
    const view = element('div', '', 'practice');
    const pool = poolFor(unit);
    let queue, total, done, missed, firstTry;

    function start() {
      queue = questionsFor(unit, pool);
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

    // 문제마다 보기(label), 정답 여부, 틀렸을 때 보여 줄 말을 만든다.
    function optionsOf(item) {
      const { word } = item;
      if (item.kind === 'sense') {
        return item.choices.map(row => ({
          label: row.mean, right: row === item.target,
          wrong: row.other ? element('p', `그것은 '${row.other}'의 뜻입니다.`, 'wrong-note') : row.use ? sentenceWith(row.use, word.w, '그 뜻으로는 이렇게 씁니다: ') : null
        }));
      }
      if (item.kind === 'rel') {
        return item.choices.map(name => {
          const other = pool.find(row => row.w === name);
          return { label: name, right: name === item.answer, wrong: other ? element('p', `${other.w}: ${other.mean}`, 'wrong-note') : null };
        });
      }
      // 오답은 이 낱말에 골라 둔 헷갈리는 후보(같은 과목 낱말)에서 먼저 뽑고, 모자라면 단원 낱말로 채운다.
      const subjectWords = books[term][subject].units.flatMap(row => row.words);
      // 아래 낱말(정사각형은 직사각형의 아래)과 유의어는 뜻에도 빈칸에도 맞아 두 번째 정답이 되므로 보기에서 뺀다.
      const banned = new Set((word.rel?.syn || []).map(row => row.w));
      const addDown = (row) => (row?.rel?.down || []).forEach(down => {
        if (banned.has(down.w)) return;
        banned.add(down.w);
        addDown(subjectWords.find(other => other.w === down.w));
      });
      addDown(word);
      // 같은 갈래 낱말이 목록에 없을 때는 목록 밖 낱말(야크, 낙타 …)도 오답으로 쓴다. 그때는 틀린 말 풀이가 없다.
      const picked = shuffle((word.foils || []).filter(name => name !== word.w && !banned.has(name)).map(name => subjectWords.find(row => row.w === name) || { w: name })).slice(0, 3);
      const rest = shuffle(pool.filter(row => row !== word && !picked.includes(row) && !banned.has(row.w))).slice(0, 3 - picked.length);
      return shuffle([word, ...picked, ...rest])
        .map(row => ({ label: row.w, right: row === word, wrong: row.mean ? element('p', `${row.w}: ${row.mean}`, 'wrong-note') : null }));
    }

    function next() {
      if (!queue.length) return finish();
      const item = queue.shift();
      const { word } = item;
      const card = element('section', '', 'question');
      const prompt = element('p', '', 'prompt');
      let blank = null, blankRest = null, heading;
      if (item.kind === 'blank') {
        const [before, after] = item.text.split('{}');
        blank = element('span', '', 'blank');
        blank.setAttribute('aria-label', '빈칸');
        blankRest = document.createTextNode(after);
        prompt.append(before, blank, blankRest);
        heading = '빈칸에 알맞은 낱말은?';
      } else if (item.kind === 'sense') {
        prompt.classList.add('sense');
        prompt.append(...sentenceWith(item.target.use, word.w).childNodes);
        heading = `이 문장에서 '${word.w}'의 뜻은?`;
      } else if (item.kind === 'rel') {
        prompt.classList.add('rel');
        prompt.append(element('span', word.w, 'rel-target'));
        const with_ = particleFor(word.w, '와/과');
        heading = item.key === 'ant' ? `'${word.w}'${with_} 뜻이 반대인 낱말은?` : `'${word.w}'${with_} 뜻이 비슷한 낱말은?`;
      } else {
        prompt.classList.add('meaning');
        prompt.append(element('span', '뜻', 'tag'), item.text);
        heading = '이 뜻을 가진 낱말은?';
      }
      const ask = element('h3', heading);
      const choices = element('div', '', item.kind === 'sense' ? 'choices long' : 'choices');
      const result = element('div', '', 'result');
      result.setAttribute('role', 'status');
      const options = optionsOf(item);
      const buttons = options.map(option => button(option.label, () => answer(option)));
      choices.append(...buttons);
      card.append(ask, prompt, choices, result);
      view.replaceChildren(progressOf(), card);
      buttons[0].focus({ preventScroll: true });

      let tried = false;
      function answer(option) {
        const chosen = buttons[options.indexOf(option)];
        if (!option.right) {
          chosen.classList.add('wrong');
          chosen.disabled = true;
          if (!tried) { missed.add(word); tried = true; }
          result.replaceChildren(...(option.wrong ? [option.wrong] : []));
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
          queue.push({ word, retry: true, ...pick(others) });
        }
        buttons.forEach(node => { node.disabled = true; });
        chosen.classList.add('right');
        if (blank) { blank.textContent = word.w; blank.classList.add('filled'); blankRest.textContent = particleFor(word.w, blankRest.textContent); }
        const note = element('div', '', 'right-note');
        if (tried) note.append(element('p', '이 낱말은 뒤에 다른 문제로 한 번 더 나옵니다.', 'verdict'));
        if (item.kind === 'blank') note.append(element('p', `${word.w}: ${word.mean}`));
        else if (item.kind === 'sense') note.append(senseNote(item.target));
        else if (item.kind === 'rel') {
          const row = word.rel[item.key].find(rel => rel.w === item.answer);
          note.append(element('p', `${word.w} ${item.key === 'ant' ? '↔' : '≈'} ${item.answer}${row?.note ? ` — ${row.note}` : ''}`));
        } else note.append(sentenceWith(word.use, word.w));
        const go = button(queue.length ? '다음' : '결과 보기', next, 'next');
        result.replaceChildren(note, go);
        view.querySelector('.progress').replaceWith(progressOf());
        go.focus({ preventScroll: true });
      }
    }

    // '어떤 뜻?' 문제를 맞힌 뒤: 이 단원 뜻인지, 다의어인지, 동형어인지 알려 준다.
    function senseNote(target) {
      const note = element('p', '', 'sense-answer');
      if (target.kind === '이 단원') { note.append(element('b', '이 단원 뜻', 'k-own'), ' 이 단원에서 배우는 뜻입니다.'); return note; }
      const homonym = target.kind === '동형어';
      note.append(element('b', homonym ? '동형어' : '다의어', homonym ? 'k-homonym' : 'k-polysemy'),
        homonym ? ' 소리만 같은 다른 낱말입니다.' : ' 같은 낱말이 다른 뜻으로 쓰였습니다.');
      if (target.hanja) note.append(' ', element('span', target.hanja, 'hanja-glyph small'));
      return note;
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
      lesson.replaceChildren(element('p', '이 학기의 교과서 단어는 준비 중입니다.', 'empty'));
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
    const option = element('option', termName(key) + (manifest[key] ? '' : ' · 준비 중'));
    option.value = key;
    termSelect.append(option);
  }
  termSelect.addEventListener('change', () => {
    term = termSelect.value;
    if (!subjectsFor(term).includes(subject)) subject = '국어';
    unitId = null;
    mode = 'words';
    lesson.replaceChildren(element('p', '불러오는 중입니다.', 'empty'));
    loadTerm(term).then(() => render(), () => render());
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
  loadTerm(term).then(() => render(), () => render());
})();
