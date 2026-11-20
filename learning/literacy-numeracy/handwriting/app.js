(function () {
  'use strict';
  const C = window.HandwritingCore,
    Reference = window.HandwritingReference,
    $ = (id) => document.getElementById(id);
  const presets = {
    consonants: 'ㄱㄴㄷㄹㅁㅂㅅㅇㅈㅊㅋㅌㅍㅎ',
    vowels: 'ㅏㅑㅓㅕㅗㅛㅜㅠㅡㅣ',
    gana: '가나다라마바사아자차카타파하',
    double: '까따빠싸짜애얘에예와왜외워웨위의',
    nature: '나무 바다 하늘 꽃 구름',
    school: '학교 친구 연필 책 가방',
    upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lower: 'abcdefghijklmnopqrstuvwxyz',
    enAnimals: 'cat dog pig cow fox hen',
    enFood: 'apple egg milk juice',
    enSchool: 'book pen desk bag ruler',
    enColors: 'red blue pink green',
    custom: '',
  };
  // 알파벳 글씨체는 영어 연습 글만, 한글 글씨체는 한글 연습 글만 고를 수 있다. 연습장도 따로 저장한다.
  const ALPHABET_LESSONS = ['upper', 'lower', 'enAnimals', 'enFood', 'enSchool', 'enColors'];
  const alphabetStyle = () => Font.style() === 'alphabet';
  const firstLesson = () => (alphabetStyle() ? 'upper' : 'gana');
  const draftKey = () => (alphabetStyle() ? 'draft-alphabet' : 'draft');
  const lessonFits = (lesson) => lesson === 'custom' || ALPHABET_LESSONS.includes(lesson) === alphabetStyle();
  // 속담·한자성어·관용어: 학습 자료에서 뽑은 문구를 무작위로 하나씩 쓴다(writing-texts.js).
  const banks = window.HANDWRITING_TEXTS || {};
  const isBank = (lesson) => Array.isArray(banks[lesson]) && banks[lesson].length > 0;
  const knownLesson = (lesson) => presets[lesson] !== undefined || isBank(lesson);
  function pick(lesson, avoid = '') {
    const list = banks[lesson].filter(([text]) => text !== avoid);
    return (list.length ? list : banks[lesson])[Math.floor(Math.random() * (list.length || banks[lesson].length))][0];
  }
  const meaningOf = (lesson, text) => (isBank(lesson) ? (banks[lesson].find(([t]) => t === text) || [])[1] || '' : '');

  const Font = window.HandwritingFont;
  let doc = fresh('가나다라마바사아자차카타파하', 'gana'),
    store,
    saveTimer,
    toastTimer,
    saveFailed = false,
    referenceReady = false;
  let active = null,
    frame = 0,
    demoFrame = 0,
    lastPen = -Infinity,
    penSeen = false,
    inputMode = 'pen',
    locked = false,
    inRoom = false,
    saveKey = 'draft',
    undo = [],
    redo = [],
    builtFor = '',
    cells = [],
    marks = [];
  const CELL_PIXELS = 240;
  // 본보기와 획순·채점은 font-engine.js가 선택한 같은 글씨 모형을 쓴다.
  const STYLE_FONTS = { gyeongpil: 'PracticeReference', badasseugi: 'PracticeReferenceBadasseugi' },
    STYLE_WEIGHTS = { gyeongpil: 500, badasseugi: 400 },
    // 화면에 보이는 본보기 획 굵기(글꼴 획 굵기 × 글자 맞춤 비율)가 '보통'이다.
    STYLE_PEN = { gyeongpil: [1.9, 2.5, 3.3], badasseugi: [1.5, 2.1, 2.8], alphabet: [2.4, 3.3, 4.4] },
    STYLES = ['gyeongpil', 'badasseugi', 'alphabet'],
    OLD_PEN = [3.5, 5.5, 7.5],
    // 한글을 네모 칸(글자 70%)에 쓰던 때(2026-11-18까지)의 굵기 → 줄 공책 굵기
    CELL_PEN = { 2.9: 1.9, 3.9: 2.5, 5.2: 3.3, 2.4: 1.5, 3.3: 2.1, 4.4: 2.8, 3.5: 1.9, 5.5: 2.5, 7.5: 3.3 };
  let roomStyle = null;
  // 펜 굵기는 단계(가늘게·보통·굵게)를 지키고 값은 지금 글씨체에 맞춘다.
  function syncPen() {
    const list = STYLE_PEN[Font.style()] || STYLE_PEN.gyeongpil,
      level = [...Object.values(STYLE_PEN), OLD_PEN, [2.9, 3.9, 5.2]].map((l) => l.indexOf(doc.width)).find((i) => i >= 0);
    doc.width = list[level ?? 1];
    [...$('penWidth').options].forEach((o, i) => (o.value = String(list[i])));
  }
  function applyStyle(name) {
    Font.setStyle(STYLES.includes(name) ? name : 'gyeongpil');
    $('styleSelect').value = Font.style();
    syncLessons();
  }
  // 고를 수 있는 연습 글 목록을 글씨체에 맞춘다(iPad 사파리는 숨긴 option도 보여 주므로 아예 빼고 넣는다).
  const lessonParts = [...document.querySelectorAll('#lessonSelect > *')];
  function syncLessons() {
    const want = alphabetStyle() ? 'alphabet' : 'hangul';
    $('lessonSelect').replaceChildren(...lessonParts.filter((el) => (el.dataset.family || 'hangul') === want || el.value === 'custom'));
    $('customText').placeholder = alphabetStyle() ? '연습할 영어 낱말을 넣으세요' : '연습할 한글을 넣으세요';
    $('customText').previousElementSibling.textContent = alphabetStyle() ? '연습할 영어' : '연습할 한글';
  }
  function freshDefault() {
    return fresh(presets[firstLesson()], firstLesson());
  }
  // 저장된 연습장(글씨체 갈래마다 따로)을 불러온다. 없거나 못 읽으면 첫 연습 글로 연다.
  function loadDraft() {
    try {
      return store.has(draftKey()) ? normalize(store.get(draftKey())) : freshDefault();
    } catch {
      return freshDefault();
    }
  }
  // 한글은 국어 교과서 쓰기 쪽처럼 줄 공책에 쓴다: 줄 높이(100, 기기에서 15 mm) 안에 글자 높이가 45%쯤(약 7 mm)이고
  // 줄 한가운데 온다(교과서 사진을 재면 47%). 알파벳은 영어 공책 네 줄 칸에 칸의 70%로 쓴다.
  // 글꼴마다 글자의 평균 잉크 상자(모형 단위: 높이 h, 가운데 cx·cy)를 재 둔 값이다. 쓴 획은 채점 전에 본보기 좌표로 되돌린다.
  const STYLE_FIT = {
      gyeongpil: { h: 90.9, cx: 44.9, cy: 48.7 },
      badasseugi: { h: 85.8, cx: 42, cy: 50 },
      alphabet: { h: 70, cx: 50, cy: 50 }, // 알파벳 모형은 칸 좌표 그대로
    },
    GLYPH_HEIGHT = { gyeongpil: 45, badasseugi: 45, alphabet: 70 },
    CELL_GLYPH = 70, // 네모 칸 시절 한글 글자 높이(옛 연습장 획을 옮길 때와 결과 카드 확대에 쓴다)
    MARK_PEN = 3.6; // 문장 부호를 그리는 펜(화면 단위, 줄 공책 본보기 획 굵기쯤)
  const glyphHeight = () => GLYPH_HEIGHT[Font.style()] || 45;
  const lined = () => !alphabetStyle();
  const fit = () => {
    const f = STYLE_FIT[Font.style()] || STYLE_FIT.gyeongpil;
    return { s: glyphHeight() / f.h, cx: f.cx, cy: f.cy };
  };
  // 서버는 모형 좌표 -30~130만 받는다. 줄 공책에서는 줄 끝에 쓴 점이 그 밖으로 나갈 수 있어 가장자리로 붙인다.
  const unitClamp = (v) => Math.round(Math.max(-30, Math.min(130, v)) * 100) / 100;
  const toShown = ([x, y], f = fit()) => [(x - f.cx) * f.s + 50, (y - f.cy) * f.s + 50];
  const toModel = ([x, y], f = fit()) => [unitClamp((x - 50) / f.s + f.cx), unitClamp((y - 50) / f.s + f.cy)];
  const shownModel = (char) => (C.model(char) || []).map((path) => path.map((p) => toShown(p)));
  const modelStrokes = (strokes) => strokes.map((s) => ({ ...s, points: (s.points || s).map((p) => toModel(p)) }));
  // 브라우저는 화면의 실제 길이를 모른다. 학교에서 쓰는 아이패드·크롬북은 화면의 실제 픽셀 수로 패널을 알아보고,
  // 그 패널의 인치당 픽셀 수로 1cm가 CSS 몇 px인지 구한다. 모르는 기기는 그대로 둔다.
  // 크롬은 브라우저 확대(Ctrl +)를 devicePixelRatio에만 넣고 screen 크기는 그대로 둔다. 그래서 창 바깥 너비 ÷ 안 너비로
  // 확대 배율을 어림해(크롬 확대 단계 중 가장 가까운 것) 빼 본다. 줄 길이는 확대까지 든 배율로 계산하므로 확대해도 15 mm다.
  (function () {
    const ratio = window.devicePixelRatio || 1,
      seen = window.outerWidth && window.innerWidth ? window.outerWidth / window.innerWidth : 1,
      zoom = [0.25, 0.33, 0.5, 0.67, 0.75, 0.8, 0.9, 1, 1.1, 1.25, 1.5, 1.75, 2, 2.5, 3, 4, 5].reduce((a, b) => (Math.abs(b - seen) < Math.abs(a - seen) ? b : a));
    const panels = [
      [2160, 1620, 264],
      [2360, 1640, 264],
      [2388, 1668, 264],
      [2732, 2048, 264],
      [2266, 1488, 326],
      [1366, 768, 135],
    ];
    const match = (scale) => {
      const long = Math.max(screen.width, screen.height) * scale,
        short = Math.min(screen.width, screen.height) * scale;
      return panels.find(([w, h]) => Math.abs(long - w) <= 2 && Math.abs(short - h) <= 2);
    };
    const hit = match(ratio) || match(ratio / zoom);
    if (!hit) return;
    document.documentElement.style.setProperty('--px-per-cm', String(hit[2] / 2.54 / ratio));
    document.documentElement.dataset.physical = '1';
  })();
  // 지금 쓰는 칸(쓰기 캔버스·본보기 캔버스). 칸을 고르면 바뀐다.
  let canvas = null,
    modelCanvas = null;
  function fresh(text, lesson = 'custom', phase = 'trace') {
    return {
      version: 9,
      text,
      lesson,
      phase,
      index: 0,
      guide: true,
      width: 2.5,
      cells: { trace: C.chars(text).map(() => []), solo: C.chars(text).map(() => []) },
    };
  }
  function current() {
    return doc.cells[doc.phase][doc.index];
  }
  function letters() {
    return C.chars(doc.text);
  }
  function normalize(raw) {
    if (
      !raw ||
      (raw.version !== 8 && raw.version !== 9) ||
      typeof raw.text !== 'string' ||
      raw.lesson === 'sentence' ||
      raw.text === '나는 나를 믿어요' ||
      raw.text === '바른 글씨는 바른 마음' ||
      raw.text.length > 160 ||
      C.chars(raw.text).length > 48 ||
      !C.supported(raw.text)
    )
      throw Error('저장된 연습을 읽지 못했어요.');
    const next = fresh(raw.text, knownLesson(raw.lesson) && lessonFits(raw.lesson) ? raw.lesson : 'custom', raw.phase === 'solo' ? 'solo' : 'trace');
    next.cells.trace = C.validateCells(raw.text, raw.cells?.trace);
    next.cells.solo = C.validateCells(raw.text, raw.cells?.solo);
    if (raw.version === 8 && !/[A-Za-z]/.test(raw.text)) {
      // 8판은 한글을 네모 칸(글자 70%)에 썼다. 줄 공책 글자 크기(45%)로 줄이고 펜 굵기도 같은 단계로 옮긴다.
      const k = GLYPH_HEIGHT.gyeongpil / CELL_GLYPH,
        shrink = (v) => Math.round((50 + (v - 50) * k) * 100) / 100;
      for (const phase of ['trace', 'solo'])
        next.cells[phase] = next.cells[phase].map((strokes) =>
          strokes.map((s) => ({ points: s.points.map(([x, y]) => [shrink(x), shrink(y)]), width: CELL_PEN[s.width] || 2.5 })),
        );
      raw = { ...raw, width: CELL_PEN[raw.width] || 2.5 };
    }
    next.index = Math.max(0, Math.min(next.cells.trace.length - 1, Number(raw.index) || 0));
    next.index = Math.floor(next.index);
    next.guide = raw.guide !== false;
    next.width = C.penWidth(raw.width);
    return next;
  }
  function snapshot() {
    return JSON.parse(JSON.stringify(doc));
  }
  function toast(message) {
    $('toast').textContent = message;
    $('toast').hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => ($('toast').hidden = true), 4000);
  }
  function save() {
    if (!store) return;
    store.set(saveKey, snapshot());
    clearTimeout(saveTimer);
    if (!store.persistent) {
      $('saveStatus').textContent = '게스트 연습은 이 탭에서만 유지돼요.';
      return;
    }
    $('saveStatus').textContent = '계정에 저장 중…';
    saveFailed = false;
    saveTimer = setTimeout(async () => {
      await store.flush();
      if (!saveFailed) $('saveStatus').textContent = '계정에 자동 저장됨';
    }, 650);
  }
  function path(context, points, color, width) {
    if (!points.length) return;
    context.strokeStyle = color;
    context.fillStyle = color;
    context.lineWidth = width;
    context.lineJoin = 'round';
    context.lineCap = 'round';
    context.beginPath();
    context.moveTo(...points[0]);
    for (let i = 1; i < points.length; i++) context.lineTo(...points[i]);
    if (points.length === 1) {
      context.arc(points[0][0], points[0][1], width / 2, 0, Math.PI * 2);
      context.fill();
    } else context.stroke();
  }
  // 글자 하나의 좌표는 캔버스 높이에 맞춘 가운데 100×100이다. 줄 공책 캔버스는 높이의 두 배 너비라
  // 옆 글자 자리까지 그려도 획이 잘리지 않는다(캔버스끼리 겹치고 바탕은 투명하다).
  function unit(context) {
    const c = context.canvas,
      k = c.height / 100;
    context.setTransform(k, 0, 0, k, (c.width - c.height) / 2, 0);
  }
  function reference(context, char, color) {
    const layout = Reference.layout(char);
    if (!layout) return;
    if (alphabetStyle()) {
      // 알파벳은 글꼴 파일 없이 같은 중심선을 둥근 펜으로 그린다.
      shownModel(char).forEach((p) => path(context, p, color, Font.Alphabet.PEN));
      return;
    }
    if (Reference.mark(char)) {
      // 문장 부호도 글꼴 파일에 없으므로 중심선을 둥근 펜으로(본보기 글자 획 굵기쯤).
      shownModel(char).forEach((p) => path(context, p, color, MARK_PEN));
      return;
    }
    context.save();
    const f = fit();
    context.translate(50, 50);
    context.scale(f.s, f.s);
    context.translate(-f.cx, -f.cy);
    context.font = `${STYLE_WEIGHTS[Font.style()] || 500} ${layout[0]}px ${STYLE_FONTS[Font.style()] || STYLE_FONTS.gyeongpil}`;
    context.textAlign = 'left';
    context.textBaseline = 'alphabetic';
    context.fillStyle = color;
    context.fillText(char, layout[1], layout[2]);
    context.restore();
  }
  function ink(context, points, color) {
    if (points.length < 2) return;
    const layer = document.createElement('canvas');
    layer.width = layer.height = 400;
    const paint = layer.getContext('2d');
    paint.scale(4, 4);
    reference(paint, letters()[doc.index], color);
    paint.globalCompositeOperation = 'destination-in';
    path(paint, points, '#000', (12 * glyphHeight()) / CELL_GLYPH);
    context.drawImage(layer, 0, 0, 100, 100);
  }
  // 글자 하나: 쓰기와 본보기가 같은 크기를 쓴다. 줄 공책의 줄은 연습장 바탕(CSS)이 긋고 캔버스는 투명하다.
  function paper(context, char, strokes, { guide = true, trace = false, next = false, ink = '#233c34' } = {}) {
    context.save();
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    unit(context);
    if (!lined()) {
      context.fillStyle = '#fffefa';
      context.fillRect(0, 0, 100, 100);
    }
    if (guide && alphabetStyle()) {
      // 영어 공책 네 줄: 윗줄·아랫줄은 실선, 가운뎃줄은 점선, 바닥줄은 붉은 실선
      const [top, mid, base, bottom] = Font.Alphabet.LINES;
      path(context, [[0, top], [100, top]], '#c9d1c2', 0.6);
      path(context, [[0, bottom], [100, bottom]], '#c9d1c2', 0.6);
      path(context, [[0, base], [100, base]], '#e2aea4', 0.7);
      context.setLineDash([1.6, 2]);
      path(context, [[0, mid], [100, mid]], '#c9d1c2', 0.6);
      context.setLineDash([]);
    } else if (guide && !lined()) {
      context.setLineDash([1.6, 2]);
      path(context, [[50, 0], [50, 100]], '#d8ded1', 0.5);
      path(context, [[0, 50], [100, 50]], '#d8ded1', 0.5);
      context.setLineDash([]);
    }
    const paths = shownModel(char);
    if (trace && referenceReady) reference(context, char, '#cdd3c7');
    strokes.forEach((s) => path(context, s.points, ink, s.width || doc.width));
    if (next && trace && strokes.length < paths.length) {
      const s = paths[strokes.length];
      context.fillStyle = '#cb763f';
      context.beginPath();
      context.arc(s[0][0], s[0][1], 1.4, 0, Math.PI * 2);
      context.fill();
    }
    context.restore();
  }
  function draw(i = doc.index) {
    if (i === doc.index) frame = 0;
    const cell = cells[i];
    if (!cell) return;
    const strokes = [...doc.cells[doc.phase][i]];
    if (active && active.canvas === cell.write) strokes.push(active.stroke);
    const write = cell.write.getContext('2d');
    paper(write, letters()[i], strokes, {
      guide: doc.guide,
      trace: doc.phase === 'trace',
      next: i === doc.index,
    });
    // 확인한 글자는 쓴 글씨에 결과 색이 입혀진다(review.js).
    write.save();
    unit(write);
    review.tint(i, write, doc.cells[doc.phase][i]);
    write.restore();
  }
  const MODEL_INK = '#27362f',
    CURRENT_MODEL_INK = '#2563a8'; // 줄 공책에서 지금 쓰는 글자는 본보기 글자를 파랗게 해서 알린다
  function queueDraw() {
    if (!frame) frame = requestAnimationFrame(() => draw());
  }
  function drawModel(color, i = doc.index) {
    const cell = cells[i];
    if (!cell) return;
    color = color || (lined() && i === doc.index ? CURRENT_MODEL_INK : MODEL_INK);
    const m = cell.model.getContext('2d');
    paper(m, letters()[i], [], { guide: doc.guide });
    m.save();
    unit(m);
    if (referenceReady) reference(m, letters()[i], color);
    m.restore();
  }
  function stopDemo() {
    const wasPlaying = demoFrame;
    cancelAnimationFrame(demoFrame);
    demoFrame = 0;
    $('demoButton').textContent = '획순';
    if (wasPlaying) drawModel();
  }
  // 글자 하나의 자리: 위는 본보기, 아래는 쓰기. 줄 공책에서는 캔버스가 자리보다 넓다(옆 자리까지 그린다).
  function makePair(char, i) {
    const pair = document.createElement('div');
    pair.className = 'cell-pair' + (Reference.mark(char) ? ' mark' : '');   // 문장 부호는 좁은 자리
    pair.dataset.index = i;
    const [model, write] = ['model-cell', 'write-cell'].map((name) => {
      const c = document.createElement('canvas');
      c.className = name;
      c.width = CELL_PIXELS * (lined() ? 2 : 1);
      c.height = CELL_PIXELS;
      return c;
    });
    model.setAttribute('aria-hidden', 'true');
    pair.append(model, write);
    return { pair, model, write, char };
  }
  // 글 전체를 낱말 단위로 묶는다. 띄어쓰기는 낱말 사이 간격으로만 보인다.
  function wordsOf(text, each) {
    let index = 0;
    return text
      .trim()
      .split(/\s+/)
      .map((word) => {
        const group = document.createElement('div');
        group.className = 'word';
        for (const char of Array.from(word)) group.append(each(char, index++).pair);
        return group;
      });
  }
  function buildSheet() {
    const key = doc.text + '|' + doc.phase + '|' + (lined() ? 'line' : 'cell');
    if (builtFor === key && cells.length === letters().length) return;
    builtFor = key;
    cancel();
    const sheet = $('sheet');
    sheet.classList.toggle('lined', lined());
    cells = [];
    sheet.replaceChildren(
      ...wordsOf(doc.text, (char, i) => {
        const cell = makePair(char, i);
        cell.write.tabIndex = 0;
        cell.write.dataset.index = i;
        cell.write.addEventListener('focus', () => {
          if (i !== doc.index) select(i, { keepHistory: true });
        });
        cells.push(cell);
        return cell;
      }),
    );
    marks = [];
  }
  // 지금 칸 표시와 id(쓰기 칸 = writingCanvas, 본보기 = modelCanvas)를 옮긴다.
  function markActive() {
    cells.forEach((cell, i) => {
      const on = i === doc.index;
      cell.pair.classList.toggle('active', on);
      if (on) {
        cell.write.id = 'writingCanvas';
        cell.model.id = 'modelCanvas';
      } else {
        if (cell.write.id) cell.write.removeAttribute('id');
        if (cell.model.id) cell.model.removeAttribute('id');
      }
    });
    canvas = cells[doc.index]?.write || null;
    modelCanvas = cells[doc.index]?.model || null;
  }
  function render() {
    stopDemo();
    buildSheet();
    markActive();
    const chars = letters(),
      strokes = current(),
      model = C.model(chars[doc.index]);
    $('lessonSelect').value = doc.lesson;
    $('customText').value = doc.text;
    $('customForm').hidden = doc.lesson !== 'custom' || inRoom;
    const meaning = inRoom ? '' : meaningOf(doc.lesson, doc.text);
    $('textMeaning').hidden = !meaning;
    $('textMeaning').textContent = meaning;
    $('anotherText').hidden = inRoom || !isBank(doc.lesson);
    $('strokeCount').textContent = `‘${chars[doc.index]}’ ${model.length}획`;
    $('guideCheck').checked = doc.guide;
    // 줄 공책에는 보조선이 없다(교과서처럼). 알파벳 네 줄 칸에서만 고른다.
    $('guideCheck').parentElement.hidden = lined();
    syncPen();
    $('penWidth').value = String(doc.width);
    document.querySelectorAll('[data-phase]').forEach((b) => {
      b.setAttribute('aria-pressed', String(b.dataset.phase === doc.phase));
      b.disabled = inRoom;
    });
    const written = doc.cells[doc.phase].filter((c) => c.length).length;
    $('progressLabel').textContent = `${written} / ${chars.length}글자`;
    $('strokeStatus').textContent = strokes.length ? `${strokes.length} / ${model.length}획` : '';
    const cannotWrite = locked || !referenceReady;
    $('undoButton').disabled = !undo.length || cannotWrite;
    $('redoButton').disabled = !redo.length || cannotWrite;
    for (const id of ['clearButton', 'checkButton', 'demoButton']) $(id).disabled = cannotWrite;
    // 글자가 바뀌었으면 그 결과 색과 점수를 먼저 내린다.
    review.sync();
    cells.forEach((cell, i) => {
      cell.write.setAttribute('aria-disabled', String(cannotWrite));
      cell.write.setAttribute('aria-label', `${i + 1}번째 글자 ${cell.char} 쓰는 칸. ${C.model(cell.char).length}획.`);
      cell.pair.classList.toggle('done', doc.cells[doc.phase][i].length > 0);
      draw(i);
      drawModel(undefined, i);
    });
    if (!review.showing()) {
      $('feedback').textContent = '';
      $('feedback').hidden = true;
    }
  }
  function select(i, { keepHistory = false } = {}) {
    if (i < 0 || i >= letters().length) return;
    cancel();
    doc.index = i;
    if (!keepHistory) {
      undo = [];
      redo = [];
    }
    render();
    save();
  }
  function cancel() {
    if (active) {
      const { surface, id } = active;
      active = null;
      try {
        surface.releasePointerCapture?.(id);
      } catch {}
      queueDraw();
    }
  }
  // 순위전 화면(race.js)이 채운 글자 수를 알 수 있게 알린다.
  const changed = (detail = {}) => window.dispatchEvent(new CustomEvent('handwritingchange', { detail }));
  function record(before, after) {
    undo.push({ index: doc.index, phase: doc.phase, before, after });
    if (undo.length > 80) undo.shift();
    redo = [];
    marks[doc.index] = undefined;
    render();
    save();
    changed();
  }
  // 글자 좌표: 캔버스 높이에 맞춘 가운데 정사각형이 100×100이다(입력 확인 칸만 캔버스 전체).
  function position(e, target) {
    const r = target.getBoundingClientRect(),
      x = target.id === 'testCanvas' ? ((e.clientX - r.left) / r.width) * 100 : 50 + ((e.clientX - (r.left + r.width / 2)) / r.height) * 100;
    return [x, ((e.clientY - r.top) / r.height) * 100].map((v) => Math.round(Math.max(-30, Math.min(130, v)) * 100) / 100);
  }
  // 연습장을 누른 자리 → 글자. 같은 줄에서 가장 가까운 글자 자리를 고른다(낱말 사이 빈자리도 옆 글자로).
  // 본보기 줄을 누르면 그 글자를 고르고 획순을 바로 보여 준다. 줄 공책은 칸이 보이지 않으므로, 쓰던 글자의 획이 옆 글자 자리에서
  // 시작해도 그 글자에 붙인다(쓰던 글자가 덜 끝났고, 옆 글자는 아직 안 썼거나 이미 다 쓴 때).
  function route(e) {
    let best = null;
    cells.forEach((cell, index) => {
      const r = cell.pair.getBoundingClientRect();
      if (e.clientY < r.top || e.clientY > r.bottom) return;
      const d = Math.abs(e.clientX - (r.left + r.width / 2));
      if (!best || d < best.d) best = { d, index, cell, r };
    });
    if (!best) return null;
    const { index, cell, r } = best,
      onModel = e.clientY < r.top + r.height / 2;
    if (!lined() && best.d > r.width / 2) return null;
    if (onModel) return { index, canvas: cell.write, only: true };
    if (!lined()) return { index, canvas: cell.write };
    const i = doc.index,
      done = (n) => doc.cells[doc.phase][n].length,
      need = (n) => C.model(letters()[n]).length,
      sameRow = cells[i] && Math.abs(cells[i].pair.getBoundingClientRect().top - r.top) < 2;
    if (Math.abs(index - i) === 1 && sameRow && done(i) < need(i) && (done(i) > 0 || done(index) >= need(index)))
      return { index: i, canvas: cells[i].write };
    return { index, canvas: cell.write };
  }
  function detect(e, test = false) {
    if (e.pointerType === 'pen') {
      lastPen = performance.now();
      if (!penSeen) {
        penSeen = true;
        $('inputStatus').textContent = '펜 인식됨 · 손바닥 입력을 무시해요.';
      }
      if (inputMode !== 'pen') {
        inputMode = 'pen';
        $('inputMode').value = 'pen';
        $('touchNotice').hidden = true;
        cancel();
        toast('펜이 인식되어 펜 전용 모드로 바뀌었어요.');
      }
    } else if (test) {
      $('inputStatus').textContent =
        e.pointerType === 'touch' ? '터치 입력 확인됨 · 펜은 아직 확인되지 않았어요.' : '마우스 입력 확인됨';
    }
  }
  function allowed(e) {
    return (
      e.pointerType === 'pen' ||
      (e.pointerType === 'mouse' && e.button === 0) ||
      (e.pointerType === 'touch' &&
        inputMode === 'touch' &&
        performance.now() - lastPen > 900 &&
        e.width <= 38 &&
        e.height <= 38)
    );
  }
  // 글자를 고르려고 살짝 누른 것은 획이 아니다. 지금 차례가 점(i·j의 점, 문장 부호)일 때만 누른 자리를 획으로 받는다.
  const pathLength = (p) => p.slice(1).reduce((n, q, i) => n + Math.hypot(q[0] - p[i][0], q[1] - p[i][1]), 0);
  function strayTap(points) {
    if (pathLength(points) >= 3) return false;
    const char = letters()[doc.index],
      want = C.model(char)?.[current().length];
    return !want || !(Reference.mark(char) || pathLength(want) <= 5);
  }
  // 혼자 연습의 채점 장면(review.js). 순위전 방 안에서는 시작하지 않는다.
  const review = window.HandwritingReview.create({
    C,
    Reference,
    cell: (i) => cells[i],
    letters,
    redraw: (i) => draw(i),
    marks: () => marks,
    strokesAt: (i) => doc.cells[doc.phase][i],
    modelStrokes,
    shownModel,
    toShown: (p) => toShown(p),
    glyphHeight,
    reference,
    path,
    rewrite(i) {
      select(i, { keepHistory: true });
      $('clearButton').click();
    },
  });
  function bind(surface, test = false, resolve = () => ({ canvas: surface })) {
    surface.addEventListener('pointerdown', (e) => {
      detect(e, test);
      e.preventDefault();
      if (test) {
        $('testResult').textContent =
          e.pointerType === 'pen'
            ? '펜으로 인식됐어요. 손을 대고 펜 전용 모드로 쓸 수 있어요.'
            : e.pointerType === 'touch'
              ? '터치로 인식됐어요. 펜이라면 기기에서 손가락과 구분하지 못한 상태예요.'
              : '마우스로 인식됐어요. PC에서도 연습할 수 있어요.';
      }
      if (((locked || !referenceReady) && !test) || !allowed(e) || active) return;
      const hit = resolve(e);
      if (!hit) return;
      if (!test) review.interrupt();
      // 다른 글자를 누르면 그 글자가 지금 글자가 된다(되돌리기 기록은 글자마다 남아 있다).
      if (!test && hit.index !== doc.index) select(hit.index, { keepHistory: true });
      if (hit.only) {
        $('demoButton').click();
        return;
      }
      const target = hit.canvas;
      if (!test && current().length >= 64) {
        toast('획이 많아요. 이 칸을 지우고 다시 써 주세요.');
        return;
      }
      active = {
        id: e.pointerId,
        surface,
        canvas: target,
        stroke: { points: [position(e, target)], width: doc.width },
        test,
      };
      try {
        surface.setPointerCapture(e.pointerId);
      } catch {}
      if (!test) queueDraw();
    });
    surface.addEventListener('pointermove', (e) => {
      detect(e, test);
      if (!active || active.id !== e.pointerId || active.surface !== surface) return;
      e.preventDefault();
      const target = active.canvas;
      const events = e.getCoalescedEvents?.() || [e];
      for (const p of events.length ? events : [e]) {
        const pos = position(p, target),
          pts = active.stroke.points,
          previous = pts[pts.length - 1],
          step = Math.hypot(pos[0] - previous[0], pos[1] - previous[1]);
        if (step > 0.25) {
          pts.push(pos);
        }
        if (pts.length > 240) active.stroke.points = C.sample(pts, 120);
      }
      if (test) {
        const t = target.getContext('2d');
        t.save();
        t.scale(target.width / 100, target.height / 100);
        path(t, active.stroke.points, '#176b59', 1);
        t.restore();
      } else queueDraw();
    });
    surface.addEventListener('pointerup', (e) => {
      if (!active || active.id !== e.pointerId || active.surface !== surface) return;
      e.preventDefault();
      const a = active;
      const end = position(e, a.canvas),
        p = a.stroke.points;
      if (Math.hypot(end[0] - p[p.length - 1][0], end[1] - p[p.length - 1][1]) > 0.1) p.push(end);
      if (p.length > 64) a.stroke.points = C.sample(p, 64);
      active = null;
      try {
        surface.releasePointerCapture(e.pointerId);
      } catch {}
      if (!test) {
        if (strayTap(a.stroke.points)) {
          draw();
          // 다듬을 글자를 살짝 누르면 고칠 곳을 보여 준다.
          if (!inRoom) review.tapped(doc.index);
          return;
        }
        const total = doc.cells[doc.phase].flat().reduce((n, s) => n + s.points.length, 0);
        if (total + a.stroke.points.length > 24000) {
          draw();
          toast('획이 너무 많아요. 이 칸을 지우고 다시 써 주세요.');
          return;
        }
        const before = [...current()],
          after = [...before, a.stroke];
        doc.cells[doc.phase][doc.index] = after;
        record(before, after);
        const result = C.judge(letters()[doc.index], modelStrokes(after));
        if (after.length === result.expected) {
          changed({ complete: doc.index });
          if (!inRoom) review.letterDone(doc.index, result.order);
          $('strokeStatus').textContent = result.order ? '획순과 방향을 잘 지켰어요.' : '획순 보기와 비교해 보세요.';
          // 다 쓰면 다음 빈 칸으로 넘어간다.
          const nextEmpty = doc.cells[doc.phase].findIndex((c, i) => i > doc.index && !c.length);
          if (nextEmpty > 0) setTimeout(() => { if (!active) select(nextEmpty, { keepHistory: true }); }, 350);
        }
      }
    });
    for (const event of ['pointercancel', 'lostpointercapture'])
      surface.addEventListener(event, (e) => {
        if (active?.id === e.pointerId && active.surface === surface) cancel();
      });
    surface.addEventListener('contextmenu', (e) => e.preventDefault());
  }
  bind($('testCanvas'), true);
  bind($('sheet'), false, route);
  window.addEventListener('blur', cancel);
  window.addEventListener('resize', cancel);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancel();
  });
  // 방향키로 칸 옮기기
  $('sheet').addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); select(doc.index + 1, { keepHistory: true }); cells[doc.index]?.write.focus(); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); select(doc.index - 1, { keepHistory: true }); cells[doc.index]?.write.focus(); }
  });
  $('inputMode').onchange = () => {
    cancel();
    inputMode = $('inputMode').value;
    $('touchNotice').hidden = inputMode !== 'touch';
    $('inputStatus').textContent =
      inputMode === 'touch'
        ? '한 손가락·일반 터치펜으로 쓸 수 있어요.'
        : penSeen
          ? '펜 인식됨 · 손바닥 입력을 무시해요.'
          : '터치는 무시해요. 펜 또는 마우스로 써 보세요.';
  };
  $('testInput').onclick = () => {
    $('settingsMenu').open = false;
    $('testCanvas').getContext('2d').clearRect(0, 0, 600, 230);
    $('testResult').textContent = '아직 입력이 없어요. 실제 입력으로 확인합니다.';
    $('inputDialog').showModal();
  };
  $('closeInput').onclick = () => {
    cancel();
    $('inputDialog').close();
  };
  $('inputDialog').addEventListener('close', cancel);
  function changeLesson(text, lesson) {
    if (!C.supported(text)) {
      toast(alphabetStyle()
        ? '영어 알파벳(A~Z, a~z)으로 된 낱말을 넣어 주세요. 숫자와 문장 부호는 빼 주세요.'
        : '한글 자모와 한글 낱말·문장을 넣어 주세요. 문장 부호는 . , ? ! 만 쓸 수 있고 숫자는 빼 주세요.');
      return false;
    }
    if (Array.from(text.replace(/\s/g, '')).length > 48) {
      toast('한 번에 48글자까지 연습할 수 있어요.');
      return false;
    }
    if (
      Object.values(doc.cells).some((c) => c.some((s) => s.length)) &&
      !confirm('지금 쓴 글씨를 지우고 새 글자를 연습할까요?')
    )
      return false;
    cancel();
    doc = fresh(text, lesson, doc.phase);
    undo = [];
    redo = [];
    render();
    save();
    return true;
  }
  $('lessonSelect').onchange = () => {
    const key = $('lessonSelect').value;
    $('customForm').hidden = key !== 'custom';
    if (key === 'custom') return;
    const text = isBank(key) ? pick(key, doc.text) : presets[key];
    if (!changeLesson(text, key)) $('lessonSelect').value = doc.lesson;
  };
  $('anotherText').onclick = () => {
    if (isBank(doc.lesson)) changeLesson(pick(doc.lesson, doc.text), doc.lesson);
  };
  $('customForm').onsubmit = (e) => {
    e.preventDefault();
    changeLesson($('customText').value.trim(), 'custom');
  };
  document.querySelectorAll('[data-phase]').forEach(
    (b) =>
      (b.onclick = () => {
        if (inRoom) return;
        cancel();
        doc.phase = b.dataset.phase;
        undo = [];
        redo = [];
        marks = [];
        render();
        save();
      }),
  );
  $('guideCheck').onchange = () => {
    doc.guide = $('guideCheck').checked;
    render();
    save();
  };
  $('penWidth').onchange = () => {
    doc.width = Number($('penWidth').value);
    save();
  };
  function history(from, to, which) {
    cancel();
    const a = from.pop();
    if (!a) return;
    doc.cells[a.phase][a.index] = a[which];
    doc.index = a.index;
    marks[a.index] = undefined;
    to.push(a);
    render();
    save();
    changed();
  }
  $('undoButton').onclick = () => history(undo, redo, 'before');
  $('redoButton').onclick = () => history(redo, undo, 'after');
  $('clearButton').onclick = () => {
    if (!current().length) return;
    cancel();
    const before = [...current()];
    doc.cells[doc.phase][doc.index] = [];
    record(before, []);
  };
  // 확인: 쓴 글자를 모두 채점한다. 혼자 연습에서는 글씨에 색이 흐르고, 순위전 방에서는 점수만 글로 알린다.
  $('checkButton').onclick = () => {
    cancel();
    if (review.running()) {
      review.finish();
      return;
    }
    const results = letters().map((c, i) => (doc.cells[doc.phase][i].length ? C.judge(c, modelStrokes(doc.cells[doc.phase][i])) : null));
    const written = results.filter(Boolean);
    if (!written.length) {
      toast('먼저 글자를 써 보세요.');
      return;
    }
    // 점수: 순위전과 같은 계산(글자마다 모양 × 획순, 안 쓴 글자는 0점)
    const score = Math.round(results.reduce((s, r) => s + (r ? r.score : 0), 0) / results.length);
    if (inRoom) {
      const shape = Math.round(written.reduce((s, r) => s + r.shape, 0) / written.length);
      $('feedback').hidden = false;
      $('feedback').textContent = `점수 ${score}점 · ${written.length}/${letters().length}글자 · 평균 모양 일치도 ${shape}% · 획순 통과 ${written.filter((r) => r.order).length}글자`;
      return;
    }
    // 이미 확인한 글자는 그대로 두고, 새로 쓴 글자에만 색이 흐른다.
    const fresh = results.map((r, i) => Boolean(r && !marks[i]));
    marks = results.map((r) => (r ? 'checked' : undefined));
    render();
    review.start({ results, score, fresh });
  };
  $('demoButton').onclick = () => {
    stopDemo();
    const paths = shownModel(letters()[doc.index]),
      start = performance.now(),
      m = modelCanvas.getContext('2d');
    $('demoButton').textContent = '재생 중';
    function tick(now) {
      const at = (now - start) / 750,
        index = Math.floor(at);
      drawModel('#d4d9cd');
      m.save();
      unit(m);
      for (let i = 0; i < Math.min(index, paths.length); i++) ink(m, paths[i], '#32664f');
      if (index < paths.length) {
        const s = C.sample(paths[index], 70),
          n = Math.max(1, Math.floor((at - index) * 70));
        ink(m, s.slice(0, n), '#ad643a');
        m.fillStyle = '#cb763f';
        m.font = 'bold 9px sans-serif';
        m.fillText(String(index + 1), s[0][0] - 8, s[0][1] - 4);
      }
      m.restore();
      if (index < paths.length) demoFrame = requestAnimationFrame(tick);
      else {
        $('demoButton').textContent = '다시 보기';
        demoFrame = 0;
      }
    }
    demoFrame = requestAnimationFrame(tick);
  };
  function preparePrint() {
    const sheet = $('printSheet');
    sheet.replaceChildren();
    const h = document.createElement('h1');
    h.textContent = '바른 글씨 연습';
    const info = document.createElement('div');
    info.className = 'print-line';
    info.textContent = '이름: ____________________       날짜: ____________________';
    sheet.append(h, info);
    for (const phase of ['trace', 'solo']) {
      const title = document.createElement('h2');
      title.textContent = phase === 'trace' ? '01 본보기를 따라 써요' : '02 본보기를 보고 혼자 써요';
      if (lined()) {
        // 화면과 같은 줄 공책: 본보기 줄 아래에 따라 쓰는(흐린 글자) 줄이나 빈 줄. 종이에서는 줄 높이 15 mm.
        const lines = document.createElement('div');
        lines.className = 'sheet lined print-lines';
        lines.append(
          ...wordsOf(doc.text, (char) => {
            const cell = makePair(char, 0);
            const m = cell.model.getContext('2d');
            paper(m, char, [], {});
            m.save();
            unit(m);
            if (referenceReady) reference(m, char, '#27362f');
            m.restore();
            paper(cell.write.getContext('2d'), char, [], { trace: phase === 'trace' });
            return cell;
          }),
        );
        sheet.append(title, lines);
        continue;
      }
      const grid = document.createElement('div');
      grid.className = 'print-grid';
      letters().forEach((c, i) => {
        const wrap = document.createElement('div');
        wrap.className = 'print-cell';
        const label = document.createElement('span');
        label.textContent = `${i + 1}. ${c}`;
        const cell = document.createElement('canvas');
        cell.width = cell.height = 300;
        paper(cell.getContext('2d'), c, [], { guide: true, trace: phase === 'trace' });
        wrap.append(label, cell);
        grid.append(wrap);
      });
      sheet.append(title, grid);
    }
  }
  window.addEventListener('beforeprint', preparePrint);
  $('printButton').onclick = () => {
    preparePrint();
    window.print();
  };
  const ready = (async () => {
    const loaded = Promise.all(
      Object.entries(STYLE_FONTS).map(([name, family]) => document.fonts.load(`${STYLE_WEIGHTS[name]} 100px ${family}`, '가나다')),
    )
      .then((faces) => {
        referenceReady = faces.every((f) => f.length > 0);
      })
      .catch(() => {
        referenceReady = false;
      });
    [store] = await Promise.all([SiteStorage.open('handwriting'), loaded]);
    const cellSizes = ['auto', 'small', 'medium', 'large'];
    const savedCellSize = store.get('cell-size');
    const cellSize = cellSizes.includes(savedCellSize) ? savedCellSize : 'auto';
    document.documentElement.dataset.cellSize = $('cellSize').value = cellSize;
    $('cellSize').onchange = () => {
      cancel();
      const value = $('cellSize').value;
      document.documentElement.dataset.cellSize = value;
      store.set('cell-size', value);
    };
    applyStyle(store.get('font-style'));
    $('styleSelect').onchange = () => {
      cancel();
      const wasAlphabet = alphabetStyle();
      save();
      applyStyle($('styleSelect').value);
      store.set('font-style', Font.style());
      if (wasAlphabet !== alphabetStyle()) {
        // 한글 ↔ 알파벳: 그 갈래의 연습장을 따로 불러온다.
        saveKey = draftKey();
        doc = loadDraft();
        undo = [];
        redo = [];
        marks = [];
      }
      syncPen();
      save();
      render();
    };
    store.onError(() => {
      saveFailed = true;
      $('saveStatus').textContent = '연결 문제로 저장하지 못했어요.';
      toast('연습을 저장하지 못했어요. 연결을 확인해 주세요.');
    });
    try {
      saveKey = draftKey();
      if (alphabetStyle()) doc = loadDraft();
      else if (store.has('draft')) {
        const saved = store.get('draft');
        if ([1, 2, 3, 4, 5, 6, 7].includes(saved?.version)) {
          store.set('legacy-draft-v' + saved.version, saved);
          doc = fresh(saved.text, saved.lesson, saved.phase);
        } else doc = normalize(saved);
      }
    } catch {
      toast('이전 연습을 읽지 못해 새 연습장을 열었어요.');
    }
    render();
    if (!referenceReady) toast('글꼴을 불러오지 못했어요. 화면을 다시 열어 주세요.');
    $('saveStatus').textContent = store.persistent ? '계정에 자동 저장' : '게스트 연습은 이 탭에서만 유지돼요.';
  })();
  document.addEventListener('pointerdown', (event) => {
    if (!$('settingsMenu').contains(event.target)) $('settingsMenu').open = false;
  });
  window.HandwritingApp = {
    ready,
    snapshot,
    toast,
    get store() {
      return store;
    },
    lock(value) {
      cancel();
      locked = value;
      render();
    },
    useRound(text, phase, key) {
      cancel();
      inRoom = true;
      if (roomStyle === null) roomStyle = Font.style();
      applyStyle('gyeongpil');
      $('styleSelect').disabled = true;
      saveKey = 'round-' + key;
      const saved = store.get(saveKey);
      try {
        doc = saved && saved.text === text && saved.phase === phase ? normalize(saved) : fresh(text, 'custom', phase);
      } catch {
        doc = fresh(text, 'custom', phase);
      }
      undo = [];
      redo = [];
      marks = [];
      render();
    },
    exitRound() {
      inRoom = false;
      $('styleSelect').disabled = false;
      if (roomStyle !== null) applyStyle(roomStyle);
      roomStyle = null;
      saveKey = draftKey();
      doc = loadDraft();
      locked = false;
      marks = [];
      render();
    },
    cells() {
      cancel();
      return snapshot().cells[doc.phase].map(modelStrokes);
    },
    // 글자 높이가 네모 칸(70%)보다 작으면 결과 카드에서 그만큼 키워 그린다.
    inkZoom: () => CELL_GLYPH / glyphHeight(),
    // 화면 좌표의 본보기 획(시험·도구용)
    shownModel: (char) => shownModel(char),
    // 채운 정도: 글자마다 (쓴 획 수 ÷ 본보기 획 수, 1까지)를 더한 값. 순위전의 먹길 말이 이만큼 나아간다.
    progress() {
      const chars = letters();
      const filled = chars.reduce((sum, c, i) => sum + Math.min(1, doc.cells[doc.phase][i].length / Math.max(1, C.model(c).length)), 0);
      return { filled, total: chars.length, written: doc.cells[doc.phase].some((c) => c.length) };
    },
  };
})();
