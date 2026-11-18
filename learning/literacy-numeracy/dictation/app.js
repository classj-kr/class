// 국어책 받아쓰기(시험판) — 브라우저 목소리로 듣고 칸에 손으로 쓴다.
// 글씨 점수는 글씨 쓰기 앱의 채점(HandwritingCore.judge)을 그대로 쓴다.
// 맞춤법: 띄어쓰기·마침표·글자 수는 칸으로 정확히 잰다. 글자가 맞는지는 모양 비교로 가려지지 않아서(받침 하나 차이를
// 흔들린 글씨와 구분 못 함) 아이가 답과 견주어 고르고, 기기에 글자 알아보기 기능이 있으면 먼저 골라 준다.
(function () {
  'use strict';
  const UNIT = {
    id: '1-1-6',
    sentences: [
      '새가 날아갑니다.', '물이 시원합니다.', '개미가 기어갑니다.', '아기가 웃습니다.',
      '하늘이 파랗습니다.', '강아지가 뛰어갑니다.', '얼음이 물이 되었습니다.', '동생이 국수를 먹습니다.',
      '친구들이 줄넘기를 합니다.', '누나가 수영을 합니다.', '원숭이가 자리에 앉습니다.', '하마가 그네를 탑니다.',
    ],
  };
  const COLS = 10, ROWS = 2, CELLS = COLS * ROWS;
  const FIT = { s: 70 / 90.9, cx: 44.9, cy: 48.7 };
  const Core = window.HandwritingCore, Reference = window.HandwritingReference;
  const $ = (id) => document.getElementById(id);
  const canvas = $('pad'), ctx = canvas.getContext('2d');

  let queue = [], at = 0, results = new Map();
  let cells = [], history = [], current = null, lastCell = -1, cellPx = 80;
  let check = null, penSeen = false, inputType = 'touch';

  // ---- 소리 ----
  const synth = window.speechSynthesis;
  let voices = [], voice = null;
  const RANK = /google|natural|online|neural|sunhi|injoon|yuna|sora/i;
  const stored = () => { try { return localStorage.getItem('dictation-voice') || ''; } catch { return ''; } };
  function loadVoices() {
    if (!synth) return;
    voices = synth.getVoices().filter((v) => /^ko([-_]|$)/i.test(v.lang))
      .sort((a, b) => Number(RANK.test(b.name)) - Number(RANK.test(a.name)));
    voice = voices.find((v) => v.name === stored()) || voices[0] || null;
    const box = $('voice');
    box.hidden = voices.length < 2;
    box.replaceChildren(...voices.map((v) => new Option(v.name, v.name, false, v === voice)));
    if (voice) $('notice').hidden = true;
  }
  function noVoice() {
    $('notice').textContent = '이 기기에는 한국어 목소리가 없습니다.';
    $('notice').hidden = false;
    $('play').disabled = $('slow').disabled = true;
  }
  function speak(rate) {
    if (!synth || !voice) return;
    synth.cancel();
    const say = new SpeechSynthesisUtterance(queue[at].replace(/\.$/, ''));
    say.lang = voice.lang; say.voice = voice; say.rate = rate;
    say.onstart = () => $('sheet').classList.add('speaking');
    say.onend = say.onerror = () => $('sheet').classList.remove('speaking');
    setTimeout(() => synth.speak(say), 60);
  }

  // ---- 칸 ----
  const toModel = ([x, y]) => [(x - 50) / FIT.s + FIT.cx, (y - 50) / FIT.s + FIT.cy].map((v) => Math.max(-30, Math.min(130, v)));
  const modelStrokes = (strokes) => strokes.map((s) => s.map(toModel));
  const cellAt = (index) => ({ x: (index % COLS) * cellPx, y: Math.floor(index / COLS) * cellPx });
  function resize() {
    const room = Math.min(window.innerWidth - 32, 960);
    cellPx = Math.max(30, Math.min(92, Math.floor(room / COLS), Math.floor((window.innerHeight - 300) / ROWS)));
    const ratio = window.devicePixelRatio || 1;
    canvas.width = cellPx * COLS * ratio; canvas.height = cellPx * ROWS * ratio;
    canvas.style.width = cellPx * COLS + 'px'; canvas.style.height = cellPx * ROWS + 'px';
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    draw();
  }
  function line(points, color, width) {
    ctx.strokeStyle = color; ctx.lineWidth = width; ctx.lineCap = ctx.lineJoin = 'round';
    ctx.beginPath(); points.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
    if (points.length === 1) ctx.lineTo(points[0][0] + 0.1, points[0][1]);
    ctx.stroke();
  }
  function draw() {
    const w = cellPx * COLS, h = cellPx * ROWS;
    ctx.clearRect(0, 0, w, h);
    if (check) for (const i of check.wrong) { const c = cellAt(i); ctx.fillStyle = '#fde7e3'; ctx.fillRect(c.x, c.y, cellPx, cellPx); }
    for (let x = 0; x <= COLS; x++) line([[Math.min(x * cellPx, w - 0.5) + 0.5 * !x, 0], [Math.min(x * cellPx, w - 0.5) + 0.5 * !x, h]], '#c9d4de', 1);
    for (let y = 0; y <= ROWS; y++) line([[0, Math.min(y * cellPx, h - 0.5) + 0.5 * !y], [w, Math.min(y * cellPx, h - 0.5) + 0.5 * !y]], '#c9d4de', 1);
    const pen = Math.max(2.2, cellPx * 0.042);
    cells.forEach((strokes, i) => {
      const c = cellAt(i), bad = check && check.wrong.has(i);
      for (const s of strokes) line(s.map(([x, y]) => [c.x + (x / 100) * cellPx, c.y + (y / 100) * cellPx]), bad ? '#c93d30' : '#24324a', pen);
    });
    if (check) for (const i of check.gaps) {
      const c = cellAt(i), x = c.x + cellPx, y = c.y + cellPx - 3, r = cellPx * 0.12;
      line([[x - r, y], [x, y - r * 1.3], [x + r, y]], '#c26a0a', 3);
    }
  }
  function point(e) {
    const box = canvas.getBoundingClientRect();
    return { x: e.clientX - box.left, y: e.clientY - box.top };
  }
  function pickCell(p) {
    const col = Math.max(0, Math.min(COLS - 1, Math.floor(p.x / cellPx)));
    const row = Math.max(0, Math.min(ROWS - 1, Math.floor(p.y / cellPx)));
    let index = row * COLS + col;
    // 칸 경계를 살짝 넘겨 시작한 획은 방금 쓰던 글자의 획으로 본다.
    if (lastCell >= 0 && index !== lastCell && !cells[index].length) {
      const c = cellAt(lastCell), edge = cellPx * 0.06;
      if (p.x > c.x - edge && p.x < c.x + cellPx + edge && p.y > c.y - edge && p.y < c.y + cellPx + edge) index = lastCell;
    }
    return index;
  }
  const local = (p, index) => { const c = cellAt(index); return [((p.x - c.x) / cellPx) * 100, ((p.y - c.y) / cellPx) * 100, Date.now()]; };

  canvas.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'pen') penSeen = true;
    if (e.pointerType === 'touch' && penSeen) return; // 펜을 쓰는 기기에서는 손바닥 닿음을 무시한다.
    e.preventDefault();
    const p = point(e);
    if (check) { toggle(p); return; }
    if (current) return;
    inputType = e.pointerType === 'pen' ? 'stylus' : e.pointerType === 'mouse' ? 'mouse' : 'touch';
    const index = pickCell(p);
    const stroke = [local(p, index)];
    cells[index].push(stroke); history.push(index); lastCell = index;
    current = { id: e.pointerId, index, stroke };
    canvas.setPointerCapture(e.pointerId);
    draw();
  });
  canvas.addEventListener('pointermove', (e) => {
    if (!current || current.id !== e.pointerId) return;
    for (const ev of e.getCoalescedEvents?.() || [e]) current.stroke.push(local(point(ev), current.index));
    draw();
  });
  const finish = (e) => { if (current && current.id === e.pointerId) current = null; };
  canvas.addEventListener('pointerup', finish);
  canvas.addEventListener('pointercancel', finish);

  // ---- 채점 ----
  const box = (strokes) => {
    const pts = strokes.flat(), xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
    const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
    return { w: x1 - x0, h: y1 - y0, cx: (x0 + x1) / 2, cy: (y0 + y1) / 2 };
  };
  const isDot = (strokes) => { const b = box(strokes); return strokes.length <= 2 && b.w < 24 && b.h < 24 && b.cy > 45; };
  // 칸에 쓴 글자와 답 글자를 잇는다. 수가 같으면 차례대로, 다르면 모양이 가까운 쪽으로 맞춘다.
  function align(letters, used, strokesOf) {
    if (letters.length === used.length) return letters.map((_, i) => used[i]);
    const n = letters.length, m = used.length, GAP = 0.7;
    const cost = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
    const from = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
    for (let i = 1; i <= n; i++) { cost[i][0] = i * GAP; from[i][0] = 1; }
    for (let j = 1; j <= m; j++) { cost[0][j] = j * GAP; from[0][j] = 2; }
    for (let i = 1; i <= n; i++) for (let j = 1; j <= m; j++) {
      const hit = cost[i - 1][j - 1] + 1 - Reference.measure(letters[i - 1], strokesOf(used[j - 1])).form / 100;
      const skipA = cost[i - 1][j] + GAP, skipB = cost[i][j - 1] + GAP, best = Math.min(hit, skipA, skipB);
      cost[i][j] = best; from[i][j] = best === hit ? 0 : best === skipA ? 1 : 2;
    }
    const out = new Array(n).fill(null);
    for (let i = n, j = m; i > 0 || j > 0;) {
      const step = from[i][j];
      if (step === 0) { out[--i] = used[--j]; } else if (step === 1) i--; else j--;
    }
    return out;
  }
  function analyse(text) {
    const letters = Array.from(text.replace(/[\s.]/g, ''));
    const spaceAfter = new Set();
    Array.from(text.replace(/\./g, '')).reduce((n, c) => { if (c === ' ') spaceAfter.add(n - 1); else n++; return n; }, 0);
    const strokes = cells.map((s) => s.map((p) => p));
    let used = strokes.flatMap((s, i) => (s.length ? [i] : []));
    let period = false;
    const tail = used[used.length - 1];
    if (tail !== undefined && used.length > 1 && isDot(strokes[tail])) { period = true; used = used.slice(0, -1); }
    else if (tail !== undefined && strokes[tail].length > 1) {
      const last = strokes[tail][strokes[tail].length - 1], b = box([last]);
      if (b.w < 16 && b.h < 16 && b.cx > 66 && b.cy > 66) { period = true; strokes[tail] = strokes[tail].slice(0, -1); }
    }
    const strokesOf = (i) => modelStrokes(strokes[i].map((s) => s.map((p) => [p[0], p[1]])));
    const pairs = align(letters, used, strokesOf);
    const linked = new Set(pairs.filter((v) => v !== null));
    const wrong = new Set(used.filter((i) => !linked.has(i))); // 답에 없는 군글자
    const missing = pairs.filter((v) => v === null).length;
    const gaps = new Set(); let spaceErrors = 0;
    pairs.forEach((a, i) => {
      const b = pairs[i + 1];
      if (a === null || b === null || b === undefined) return;
      const wrapped = a % COLS === COLS - 1 && b === a + 1;
      if (wrapped) return; // 줄 끝에서는 띄어 쓴 칸이 없어도 된다.
      if ((b - a > 1) !== spaceAfter.has(i)) { spaceErrors++; gaps.add(a); }
    });
    return { letters, pairs, used, wrong, missing, gaps, spaceErrors, period, spaces: spaceAfter.size, strokesOf };
  }
  function scores(c) {
    const items = c.letters.length + c.spaces + 1;
    const lost = c.wrong.size + c.missing + c.spaceErrors + (c.period ? 0 : 1);
    const spell = Math.max(0, Math.round(100 * (1 - lost / items)));
    const judged = c.pairs.flatMap((cell, i) => (cell === null || c.wrong.has(cell) ? [] : [Core.judge(c.letters[i], c.strokesOf(cell)).score]));
    return { spell, hand: judged.length ? Math.round(judged.reduce((a, b) => a + b, 0) / judged.length) : 0 };
  }

  // 기기에 글자 알아보기 기능이 있으면(크롬북 등) 답과 다른 글자를 먼저 골라 준다. 없으면 아이가 고른다.
  let recognizer = null;
  async function prepareRecognizer() {
    try {
      if (!navigator.createHandwritingRecognizer) return;
      recognizer = await navigator.createHandwritingRecognizer({ languages: ['ko'] });
    } catch { recognizer = null; }
  }
  async function autoMark(c) {
    if (!recognizer || !window.HandwritingStroke) return false;
    try {
      await Promise.race([Promise.all(c.pairs.map(async (cell, i) => {
        if (cell === null) return;
        const drawing = recognizer.startDrawing({ recognitionType: 'text', inputType, alternatives: 3 });
        for (const s of cells[cell]) {
          const stroke = new window.HandwritingStroke(), t0 = s[0][2];
          for (const [x, y, t] of s) stroke.addPoint({ x, y, t: t - t0 });
          drawing.addStroke(stroke);
        }
        const found = await drawing.getPrediction();
        drawing.clear?.();
        if (found.length && !found.some((f) => f.text.trim() === c.letters[i])) c.wrong.add(cell);
      })), new Promise((_, no) => setTimeout(() => no(new Error('timeout')), 3000))]);
      return true;
    } catch { return false; }
  }

  // ---- 진행 ----
  function renderDots() {
    $('dots').replaceChildren(...queue.map((text, i) => {
      const dot = document.createElement('i'), r = results.get(text);
      if (i === at) dot.className = 'now'; else if (r) dot.className = r.spell === 100 ? 'ok' : 'miss';
      return dot;
    }));
    $('count').textContent = `${at + 1}/${queue.length}`;
  }
  function showSentence(auto) {
    cells = Array.from({ length: CELLS }, () => []); history = []; lastCell = -1; check = null; current = null;
    $('sheet').classList.remove('checking');
    $('answer').hidden = $('marks').hidden = true;
    $('writeTools').hidden = false; $('checkTools').hidden = true;
    renderDots(); draw();
    if (auto) speak(0.85);
  }
  function renderMarks() {
    const s = scores(check), items = [[`맞춤법 ${s.spell}`, s.spell < 100], [`글씨 ${s.hand}`, false]];
    if (check.spaceErrors) items.push([`띄어쓰기 ${check.spaceErrors}곳`, true]);
    if (!check.period) items.push(['마침표', true]);
    if (check.missing) items.push([`빠진 글자 ${check.missing}`, true]);
    $('marks').replaceChildren(...items.map(([text, warn]) => {
      const tag = document.createElement('span');
      tag.className = warn ? 'mark warn' : 'mark'; tag.textContent = text;
      return tag;
    }));
    $('marks').hidden = false;
  }
  function toggle(p) {
    const index = Math.floor(p.y / cellPx) * COLS + Math.floor(p.x / cellPx);
    if (!cells[index]?.length || !check.pairs.includes(index)) return;
    if (check.wrong.has(index)) check.wrong.delete(index); else check.wrong.add(index);
    renderMarks(); draw();
  }
  async function submit() {
    if (!cells.some((s) => s.length) || check) return;
    synth?.cancel();
    check = analyse(queue[at]);
    const auto = await autoMark(check);
    $('sheet').classList.add('checking');
    $('answer').textContent = queue[at]; $('answer').hidden = false;
    $('writeTools').hidden = true; $('checkTools').hidden = false;
    $('hint').textContent = auto ? '기기가 고른 글자입니다. 다르면 눌러서 고쳐요.' : '답과 다른 글자를 눌러요.';
    renderMarks(); draw();
  }
  function count(el, value) {
    const start = performance.now();
    (function tick(now) {
      const t = Math.min(1, (now - start) / 700);
      el.textContent = Math.round(value * t);
      if (t < 1) requestAnimationFrame(tick);
    })(start);
  }
  function showEnd() {
    const all = [...results.values()];
    const mean = (k) => Math.round(all.reduce((n, r) => n + r[k], 0) / Math.max(1, all.length));
    $('work').hidden = true; $('end').hidden = false;
    $('dots').replaceChildren(); $('count').textContent = '';
    count($('spellTotal'), mean('spell')); count($('handTotal'), mean('hand'));
    $('retry').hidden = !all.some((r) => r.spell < 100);
  }
  function start(list) {
    queue = list; at = 0;
    $('end').hidden = true; $('work').hidden = false;
    showSentence(false); resize();
  }

  $('play').onclick = () => speak(0.85);
  $('slow').onclick = () => speak(0.55);
  $('undo').onclick = () => {
    const index = history.pop();
    if (index === undefined) return;
    cells[index].pop(); lastCell = history.length ? history[history.length - 1] : -1; draw();
  };
  $('clear').onclick = () => { cells = cells.map(() => []); history = []; lastCell = -1; draw(); };
  $('done').onclick = submit;
  $('next').onclick = () => {
    results.set(queue[at], scores(check));
    if (++at < queue.length) showSentence(true); else showEnd();
  };
  $('again').onclick = () => { results = new Map(); start(UNIT.sentences.slice()); };
  $('retry').onclick = () => {
    start([...results].filter(([, r]) => r.spell < 100).map(([text]) => text));
  };
  $('voice').onchange = (e) => {
    voice = voices.find((v) => v.name === e.target.value) || voice;
    try { localStorage.setItem('dictation-voice', voice.name); } catch { /* 기기 취향이라 못 남겨도 된다 */ }
    speak(0.85);
  };
  window.addEventListener('resize', resize);

  if (synth) {
    loadVoices();
    synth.addEventListener?.('voiceschanged', loadVoices);
    setTimeout(() => { if (!voices.length) noVoice(); }, 2000);
  } else noVoice();
  prepareRecognizer();
  start(UNIT.sentences.slice());
})();
