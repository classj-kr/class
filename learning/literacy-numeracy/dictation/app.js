// 국어책 받아쓰기 — 브라우저 목소리로 듣고 한 줄 원고지 띠에 손으로 쓴다.
// 줄이 바뀌지 않으므로 띄어쓰기는 언제나 빈칸 하나, 마침표·물음표는 글자 다음 칸이다.
// 글씨 점수는 글씨 쓰기 앱의 채점(HandwritingCore.judge)을 그대로 쓴다.
// 맞춤법: 띄어쓰기·마침표·글자 수는 칸으로 정확히 잰다. 글자는 획 단위로 답 글자와 「자모 하나만 다른 글자들」에 견주어,
// 다른 글자에 뚜렷이 더 가까우면 틀림으로 먼저 표시한다(점 구름 비교는 받침 하나 차이를 못 가린다). 아이가 눌러 고칠 수 있다.
(function () {
  'use strict';
  const TERMS = window.DICTATION_TERMS, SET_SIZE = 10, SLOTS = 80;
  const FIT = { s: 70 / 90.9, cx: 44.9, cy: 48.7 };
  const Core = window.HandwritingCore, Reference = window.HandwritingReference;
  const $ = (id) => document.getElementById(id);
  const canvas = $('pad'), ctx = canvas.getContext('2d');

  let term = TERMS[0], set = null, queue = [], at = 0, results = new Map();
  let cells = [], history = [], current = null, lastCell = -1, cellPx = 80;
  let check = null, penSeen = false;
  let stripCells = 13, visible = 10, first = 0, slideTimer = 0;

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
    // 「Microsoft Heami - Korean (Korean)」처럼 붙은 언어 이름은 떼고 보여 준다.
    const label = (v, i) => `목소리 ${i + 1}: ${v.name.replace(/\s*[-–]\s*Korean.*$/i, '').replace(/\s*\(Korean.*\)$/i, '').trim()}`;
    box.replaceChildren(...voices.map((v, i) => new Option(label(v, i), v.name, false, v === voice)));
    if (voice) $('notice').hidden = true;
  }
  function noVoice() {
    $('notice').textContent = '이 기기에는 한국어 목소리가 없습니다.';
    $('notice').hidden = false;
    $('play').disabled = true;
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
  const cellAt = (index) => ({ x: index * cellPx, y: 0 });
  const lengthOf = (text) => Array.from(text).length;
  const lastUsed = () => cells.reduce((n, s, i) => (s.length ? i : n), -1);
  // 쓸 때는 큰 칸을 띠로 밀고, 답을 볼 때는 문장 전체가 한눈에 들어오게 칸을 줄인다.
  function resize() {
    if (!set) return;
    const room = Math.min(window.innerWidth - 32, 960);
    if (check) {
      stripCells = Math.max(lengthOf(queue[at]), lastUsed() + 1);
      cellPx = Math.max(36, Math.min(88, Math.floor(room / stripCells)));
    } else {
      stripCells = Math.max(...set.items.map(lengthOf)) + 3;
      cellPx = Math.max(56, Math.min(88, Math.floor(room / 5)));
    }
    visible = Math.max(1, Math.floor(room / cellPx));
    const ratio = window.devicePixelRatio || 1;
    canvas.width = cellPx * stripCells * ratio; canvas.height = cellPx * ratio;
    canvas.style.width = cellPx * stripCells + 'px'; canvas.style.height = cellPx + 'px';
    $('strip').style.width = Math.min(visible, stripCells) * cellPx + 'px';
    $('strip').style.height = cellPx + 'px';
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    canvas.style.transition = 'none'; // 칸 크기가 바뀔 때는 미끄러지지 않게 한다.
    slideTo(first);
    draw();
    void canvas.offsetWidth;
    canvas.style.transition = '';
  }
  function slideTo(index) {
    const last = Math.max(0, stripCells - visible);
    first = Math.max(0, Math.min(last, index));
    canvas.style.transform = `translateX(${-first * cellPx}px)`;
    $('stripNav').hidden = !last;
    $('left').disabled = first === 0; $('right').disabled = first === last;
  }
  // 끝 칸 가까이 쓰고 펜을 잠시 멈추면 띠를 민다. 쓰는 도중에는 움직이지 않는다.
  function slideSoon() {
    clearTimeout(slideTimer);
    if (check || lastCell < first + visible - 2 || first + visible >= stripCells) return;
    slideTimer = setTimeout(() => { if (!current) slideTo(lastCell - 2); }, 800);
  }
  function line(points, color, width) {
    ctx.strokeStyle = color; ctx.lineWidth = width; ctx.lineCap = ctx.lineJoin = 'round';
    ctx.beginPath(); points.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
    if (points.length === 1) ctx.lineTo(points[0][0] + 0.1, points[0][1]);
    ctx.stroke();
  }
  function draw() {
    const w = cellPx * stripCells, h = cellPx;
    ctx.clearRect(0, 0, w, h);
    if (check) for (const i of check.wrong) { const c = cellAt(i); ctx.fillStyle = '#fde7e3'; ctx.fillRect(c.x, c.y, cellPx, cellPx); }
    for (let x = 0; x <= stripCells; x++) { const at = Math.max(0.5, Math.min(x * cellPx, w - 0.5)); line([[at, 0], [at, h]], '#c9d4de', 1); }
    for (const y of [0.5, h - 0.5]) line([[0, y], [w, y]], '#c9d4de', 1);
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
    let index = Math.max(0, Math.min(stripCells - 1, Math.floor(p.x / cellPx)));
    // 칸 경계를 살짝 넘겨 시작한 획은 방금 쓰던 글자의 획으로 본다.
    if (lastCell >= 0 && index !== lastCell && !cells[index].length) {
      const c = cellAt(lastCell), edge = cellPx * 0.06;
      if (p.x > c.x - edge && p.x < c.x + cellPx + edge) index = lastCell;
    }
    return index;
  }
  const local = (p, index) => { const c = cellAt(index); return [((p.x - c.x) / cellPx) * 100, ((p.y - c.y) / cellPx) * 100]; };

  canvas.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'pen') penSeen = true;
    if (e.pointerType === 'touch' && penSeen) return; // 펜을 쓰는 기기에서는 손바닥 닿음을 무시한다.
    e.preventDefault();
    const p = point(e);
    if (check) { toggle(p); return; }
    if (current) return;
    clearTimeout(slideTimer);
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
  const finish = (e) => { if (current && current.id === e.pointerId) { current = null; slideSoon(); } };
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
  function isQuestionMark(strokes, lastLetter) {
    if (strokes.length > 3 || !lastLetter) return false;
    const written = normalise(modelStrokes(strokes));
    return costOf(written, '?') < costOf(written, lastLetter);
  }
  function analyse(text) {
    const mark = /[.?]$/.test(text) ? text.slice(-1) : '';
    const body = text.replace(/[.?]$/, '');
    const letters = Array.from(body.replace(/\s/g, ''));
    const spaceAfter = new Set();
    Array.from(body).reduce((n, c) => { if (c === ' ') spaceAfter.add(n - 1); else n++; return n; }, 0);
    const strokes = cells.map((s) => s.map((p) => p));
    let used = strokes.flatMap((s, i) => (s.length ? [i] : []));
    let written = '';
    const tail = used[used.length - 1];
    if (tail !== undefined && used.length > 1 && isDot(strokes[tail])) { written = '.'; used = used.slice(0, -1); }
    else if (tail !== undefined && used.length > 1 && mark === '?' && isQuestionMark(strokes[tail], letters[letters.length - 1])) { written = '?'; used = used.slice(0, -1); }
    else if (tail !== undefined && strokes[tail].length > 1) {
      const last = strokes[tail][strokes[tail].length - 1], b = box([last]);
      if (b.w < 16 && b.h < 16 && b.cx > 66 && b.cy > 66) { written = '.'; strokes[tail] = strokes[tail].slice(0, -1); }
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
      if ((b - a > 1) !== spaceAfter.has(i)) { spaceErrors++; gaps.add(a); }
    });
    return { letters, pairs, used, wrong, missing, gaps, spaceErrors, mark, markOk: !mark || written === mark, spaces: spaceAfter.size, strokesOf };
  }
  function scores(c) {
    const items = c.letters.length + c.spaces + (c.mark ? 1 : 0);
    const lost = c.wrong.size + c.missing + c.spaceErrors + (c.markOk ? 0 : 1);
    const spell = Math.max(0, Math.round(100 * (1 - lost / items)));
    const judged = c.pairs.flatMap((cell, i) => (cell === null || c.wrong.has(cell) ? [] : [Core.judge(c.letters[i], c.strokesOf(cell)).score]));
    return { spell, hand: judged.length ? Math.round(judged.reduce((a, b) => a + b, 0) / judged.length) : 0 };
  }

  // ---- 글자 가려내기 ----
  // 획마다 경로를 견주고(순서·방향은 너그럽게, 이어 쓴 획도 받는다), 답 글자보다 자모 하나 다른 글자가 뚜렷이 가까우면 틀림이다.
  // 흔든 글씨 흉내로 잰 값(MARGIN 0.15): 바른 글씨는 맞는 글자 오판 1%·틀린 글자 놓침 5%쯤, 보통 글씨는 각각 12~15%쯤.
  // TOO_FAR 0.65: 보통 글씨의 맞는 글자는 99%가 이 안에 들고, 선 하나·획 절반·엉뚱한 글자는 대부분 밖이다.
  const MARGIN = 0.15, UNMATCHED = 0.7, TOO_FAR = 0.65;
  const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
  const pathLength = (p) => p.slice(1).reduce((n, q, i) => n + dist(p[i], q), 0);
  function normalise(strokes) {
    const points = strokes.flatMap((s) => Core.sample(s, 16));
    const x = points.reduce((n, p) => n + p[0], 0) / points.length, y = points.reduce((n, p) => n + p[1], 0) / points.length;
    const r = Math.max(0.5, Math.sqrt(points.reduce((n, p) => n + (p[0] - x) ** 2 + (p[1] - y) ** 2, 0) / points.length));
    return strokes.map((s) => {
      const q = s.map((p) => [((p[0] - x) * 30) / r, ((p[1] - y) * 30) / r]);
      return { points: Core.sample(q, 12), length: pathLength(q) };
    });
  }
  const shapes = new Map();
  // 이어 쓰기 쉬운 획(끝과 다음 시작이 붙은 획)은 붙인 꼴도 본보기로 둔다.
  function shapesOf(char) {
    if (shapes.has(char)) return shapes.get(char);
    const model = Core.model(char), joins = [];
    for (let i = 0; i < model.length - 1 && joins.length < 3; i++) {
      if (dist(model[i][model[i].length - 1], model[i + 1][0]) < 11) joins.push(i);
    }
    const out = [];
    for (let bits = 0; bits < 1 << joins.length; bits++) {
      const strokes = [];
      model.forEach((s, i) => {
        const at = joins.indexOf(i - 1);
        if (at >= 0 && (bits >> at) & 1) strokes[strokes.length - 1] = strokes[strokes.length - 1].concat(s);
        else strokes.push(s);
      });
      out.push(normalise(strokes));
    }
    shapes.set(char, out);
    return out;
  }
  function strokeCost(a, b) {
    let forward = 0, backward = 0;
    const n = a.points.length;
    for (let i = 0; i < n; i++) { forward += dist(a.points[i], b.points[i]); backward += dist(a.points[i], b.points[n - 1 - i]); }
    return Math.min(forward, backward + n) / n / 30 + (0.25 * Math.abs(a.length - b.length)) / Math.max(a.length, b.length, 1);
  }
  function shapeCost(written, model) {
    const pairs = [];
    written.forEach((w, i) => model.forEach((m, j) => pairs.push([strokeCost(w, m), i, j])));
    pairs.sort((a, b) => a[0] - b[0]);
    const usedW = new Set(), usedM = new Set();
    let total = 0;
    for (const [cost, i, j] of pairs) {
      if (usedW.has(i) || usedM.has(j)) continue;
      usedW.add(i); usedM.add(j); total += cost * (written[i].length + model[j].length);
    }
    written.forEach((s, i) => { if (!usedW.has(i)) total += UNMATCHED * s.length; });
    model.forEach((s, j) => { if (!usedM.has(j)) total += UNMATCHED * s.length; });
    return total / Math.max(1, written.reduce((n, s) => n + s.length, 0) + model.reduce((n, s) => n + s.length, 0));
  }
  const costOf = (written, char) => Math.min(...shapesOf(char).map((model) => shapeCost(written, model)));
  function neighbours(char) {
    const n = char.codePointAt(0) - 0xac00;
    if (n < 0 || n > 11171) return [];
    const a = Math.floor(n / 588), b = Math.floor((n % 588) / 28), d = n % 28, out = new Set();
    const make = (x, y, z) => String.fromCodePoint(0xac00 + x * 588 + y * 28 + z);
    for (let i = 0; i < 19; i++) out.add(make(i, b, d));
    for (let i = 0; i < 21; i++) out.add(make(a, i, d));
    for (let i = 0; i < 28; i++) out.add(make(a, b, i));
    out.delete(char);
    return [...out];
  }
  function looksWrong(char, strokes) {
    const others = neighbours(char);
    if (!others.length || !strokes.length) return false;
    // 획이 너무 적으면(선 하나만 그은 칸) 글자로 치지 않는다. 이어 쓴 획은 본보기의 붙인 꼴 수로 센다.
    if (strokes.length < Math.ceil(Math.min(...shapesOf(char).map((m) => m.length)) * 0.6)) return true;
    const written = normalise(strokes), own = costOf(written, char);
    if (own > TOO_FAR) return true;
    let best = Infinity;
    for (const other of others) best = Math.min(best, costOf(written, other));
    return (own - best) / Math.max(own, 0.02) > MARGIN;
  }
  function autoMark(c) {
    c.pairs.forEach((cell, i) => { if (cell !== null && looksWrong(c.letters[i], c.strokesOf(cell))) c.wrong.add(cell); });
  }

  // ---- 그림 ----
  const pictureUrl = (text) => { const file = window.DICTATION_PICS?.[text]; return file ? `pics/${file}` : ''; };
  function showPicture(text) {
    const url = pictureUrl(text), next = pictureUrl(queue[at + 1] || '');
    $('picture').hidden = !url;
    if (url) { const img = new Image(); img.alt = ''; img.src = url; $('picture').replaceChildren(img); } else $('picture').replaceChildren();
    if (next) new Image().src = next; // 다음 그림은 미리 받아 둔다.
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
    cells = Array.from({ length: SLOTS }, () => []); history = []; lastCell = -1; check = null; current = null;
    clearTimeout(slideTimer); first = 0;
    $('sheet').classList.remove('checking');
    $('answer').hidden = $('marks').hidden = true;
    $('writeTools').hidden = false; $('checkTools').hidden = true;
    renderDots(); showPicture(queue[at]); resize();
    if (auto) speak(0.85);
  }
  function renderMarks() {
    const s = scores(check), items = [[`맞춤법 ${s.spell}`, s.spell < 100], [`글씨 ${s.hand}`, false]];
    if (check.spaceErrors) items.push([`띄어쓰기 ${check.spaceErrors}곳`, true]);
    if (!check.markOk) items.push([check.mark === '?' ? '물음표' : '마침표', true]);
    if (check.missing) items.push([`빠진 글자 ${check.missing}`, true]);
    $('marks').replaceChildren(...items.map(([text, warn]) => {
      const tag = document.createElement('span');
      tag.className = warn ? 'mark warn' : 'mark'; tag.textContent = text;
      return tag;
    }));
    $('marks').hidden = false;
  }
  function toggle(p) {
    const index = Math.floor(p.x / cellPx);
    if (!cells[index]?.length || !check.pairs.includes(index)) return;
    if (check.wrong.has(index)) check.wrong.delete(index); else check.wrong.add(index);
    renderMarks(); draw();
  }
  function submit() {
    if (!cells.some((s) => s.length) || check) return;
    synth?.cancel();
    clearTimeout(slideTimer);
    check = analyse(queue[at]);
    autoMark(check);
    $('sheet').classList.add('checking');
    $('answer').textContent = queue[at]; $('answer').hidden = false;
    $('writeTools').hidden = true; $('checkTools').hidden = false;
    $('hint').textContent = '답과 견주어 보고, 표시가 다르면 글자를 눌러 고쳐요.';
    first = 0;
    renderMarks(); resize();
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
    $('nextSet').hidden = set.index + 1 >= setsOf(set.unit).length;
  }
  function start(list) {
    queue = list; at = 0;
    $('home').hidden = $('end').hidden = true; $('work').hidden = false;
    showSentence(true);
  }

  // ---- 단원 고르기 ----
  function setsOf(unit) {
    const out = [];
    for (let i = 0; i < unit.items.length; i += SET_SIZE) out.push(unit.items.slice(i, i + SET_SIZE));
    if (out.length > 1 && out[out.length - 1].length <= 3) { const tail = out.pop(); out[out.length - 1] = out[out.length - 1].concat(tail); }
    return out;
  }
  function openSet(unit, index) {
    const items = setsOf(unit)[index];
    set = { unit, index, items }; results = new Map();
    start(items.slice());
  }
  function button(text, className, onClick, label) {
    const b = document.createElement('button');
    b.type = 'button'; b.className = className; b.textContent = text; b.onclick = onClick;
    if (label) b.setAttribute('aria-label', label);
    return b;
  }
  function renderHome() {
    $('terms').replaceChildren(...TERMS.map((t) => {
      const b = button(t.label, t === term ? 'term on' : 'term', () => { term = t; renderHome(); });
      b.setAttribute('aria-pressed', String(t === term));
      return b;
    }));
    $('units').replaceChildren(...term.units.map((unit) => {
      const row = document.createElement('div'), name = document.createElement('span'), sets = document.createElement('span');
      const title = unit.no ? `${unit.no}. ${unit.title}` : unit.title;
      row.className = 'unit'; name.className = 'unit-name'; sets.className = 'sets';
      name.textContent = title;
      sets.replaceChildren(...setsOf(unit).map((_, i) => button(`${i + 1}회`, 'set', () => openSet(unit, i), `${title} ${i + 1}회`)));
      row.append(name, sets);
      return row;
    }));
  }
  function showHome() {
    synth?.cancel(); clearTimeout(slideTimer);
    set = null; check = null;
    $('sheet').classList.remove('checking', 'speaking');
    $('work').hidden = $('end').hidden = true; $('home').hidden = false;
    $('dots').replaceChildren(); $('count').textContent = '';
    renderHome();
  }
  const leave = (e) => { if (set) { e.preventDefault(); showHome(); } };
  window.addEventListener('sitebackrequest', leave);
  $('back').addEventListener('click', leave);

  $('play').onclick = () => speak(0.85);
  $('undo').onclick = () => {
    const index = history.pop();
    if (index === undefined) return;
    cells[index].pop(); lastCell = history.length ? history[history.length - 1] : -1;
    if (index < first || index >= first + visible) slideTo(index - 2);
    draw();
  };
  $('clear').onclick = () => { cells = cells.map(() => []); history = []; lastCell = -1; slideTo(0); draw(); };
  $('left').onclick = () => slideTo(first - Math.max(1, visible - 2));
  $('right').onclick = () => slideTo(first + Math.max(1, visible - 2));
  $('done').onclick = submit;
  $('next').onclick = () => {
    results.set(queue[at], scores(check));
    if (++at < queue.length) showSentence(true); else showEnd();
  };
  $('again').onclick = () => { results = new Map(); start(set.items.slice()); };
  $('nextSet').onclick = () => openSet(set.unit, set.index + 1);
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
  showHome();
})();
