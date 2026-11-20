(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const NS = 'http://www.w3.org/2000/svg';
  const PIECES = window.PENTOMINO_PIECES, STAGES = window.PENTOMINO_STAGES;
  const COLORS = { F: '#e4796b', I: '#6aa9dc', L: '#f0b54d', N: '#8fc77a', P: '#b98ad8', T: '#ef8fb0', U: '#5fc4b8', V: '#d9c24a', W: '#8f9be0', X: '#e39a5a', Y: '#7fb6a0', Z: '#c9a27c' };

  // 점 찍힌 칸(무게중심에 가장 가까운 칸)을 원점으로: 돌리기·뒤집기는 이 칸을 중심으로 한다.
  const REL = {};
  for (const [l, cells] of Object.entries(PIECES)) {
    const cx = cells.reduce((t, c) => t + c[0], 0) / 5, cy = cells.reduce((t, c) => t + c[1], 0) / 5;
    const anchor = cells.reduce((best, c) => Math.hypot(c[0] - cx, c[1] - cy) < Math.hypot(best[0] - cx, best[1] - cy) - 1e-9 ? c : best);
    REL[l] = cells.map(([x, y]) => [x - anchor[0], y - anchor[1]]);
  }
  // 모양 = (뒤집었으면 좌우 바꾸고) 오른쪽으로 90°씩 rot번.
  function shape(l, o) {
    return REL[l].map(([x, y]) => {
      if (o.flip) x = -x;
      for (let i = 0; i < o.rot; i++) [x, y] = [-y, x];
      return [x, y];
    });
  }

  let puzzle = null, frame = new Set(), placed = {}, hand = null, orient = {};
  let seen = false, turns = 0, misses = 0, startedAt = 0, finishedAt = 0, paused = false, solved = false;
  let stageIndex = 0, practiceIndex = 0, raceMode = false, store = null, cleared = {};
  let lastHover = null, lastPlaced = null, handAnim = '';

  const el = (name, attrs = {}) => { const n = document.createElementNS(NS, name); for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v); return n; };
  const k = (x, y) => x + ',' + y;
  const sfx = name => window.ClassGameSfx?.play(name);
  function notice(text) { const n = $('notice'); n.textContent = text; n.hidden = false; clearTimeout(notice.t); notice.t = setTimeout(() => (n.hidden = true), 2600); }
  const fmt = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  const elapsed = () => (startedAt ? ((finishedAt || Date.now()) - startedAt) / 1000 : 0);

  function load(p) {
    puzzle = p;
    frame = new Set();
    const mask = p.mask || '1'.repeat(p.w * p.h);
    [...mask].forEach((m, i) => { if (m === '1') frame.add(k(i % p.w, Math.floor(i / p.w))); });
    placed = {}; hand = null; orient = {}; turns = 0; misses = 0; startedAt = 0; finishedAt = 0; solved = false; lastPlaced = null;
    $('done').hidden = true;
    render();
  }
  function occupied() {
    const map = new Map();
    for (const [l, p] of Object.entries(placed)) shape(l, p).forEach(([x, y]) => map.set(k(x + p.x, y + p.y), l));
    return map;
  }
  function start() { if (!startedAt) startedAt = Date.now(); }

  /* ---------- 그리기 ---------- */
  function outlinePath(cells) {
    const set = new Set(cells.map(([x, y]) => k(x, y)));
    let d = '';
    for (const [x, y] of cells) {
      if (!set.has(k(x, y - 1))) d += `M${x} ${y}h1`;
      if (!set.has(k(x, y + 1))) d += `M${x} ${y + 1}h1`;
      if (!set.has(k(x - 1, y))) d += `M${x} ${y}v1`;
      if (!set.has(k(x + 1, y))) d += `M${x + 1} ${y}v1`;
    }
    return d;
  }
  function pieceGroup(l, cells, cls = '') {
    const g = el('g', { class: cls });
    for (const [x, y] of cells) {
      g.append(el('rect', { class: 'tile', x, y, width: 1, height: 1, fill: COLORS[l] }));
      g.append(el('rect', { class: 'tile-light', x, y, width: 1, height: 1, fill: 'url(#pento-light)' }));
    }
    g.append(el('path', { class: 'piece-outline', d: outlinePath(cells) }));
    return g;
  }
  // 손·상자 그림: 원점(점 찍힌 칸)이 가운데 오도록 칸 중심을 -0.5 옮긴다.
  function drawShape(svg, l, cells, dot, anim) {
    svg.replaceChildren();
    const g = el('g', { class: anim || '' });
    g.append(pieceGroup(l, cells.map(([x, y]) => [x - .5, y - .5])));
    if (dot) g.append(el('circle', { class: 'anchor-dot', cx: 0, cy: 0, r: .16 }));
    svg.append(g);
  }

  function render() {
    renderBoard();
    renderHand();
    renderTray();
    renderLadder();
    $('turns').textContent = `돌리기·뒤집기 ${turns}번`;
    $('seen').setAttribute('aria-pressed', String(seen));
    $('seen').disabled = raceMode;
  }
  function renderBoard() {
    const svg = $('board'), pad = .3;
    svg.setAttribute('viewBox', `${-pad} ${-pad} ${puzzle.w + pad * 2} ${puzzle.h + pad * 2}`);
    svg.style.width = `min(100%, ${Math.round((puzzle.w + pad * 2) * 64)}px)`; // 한 칸 64px 안: 단계가 바뀌어도 조각 크기가 비슷하게
    svg.replaceChildren();
    const cells = [...frame].map(s => s.split(',').map(Number));
    for (const [x, y] of cells) svg.append(el('rect', { class: 'cell', x, y, width: 1, height: 1 }));
    svg.append(el('path', { class: 'frame-edge', d: outlinePath(cells) }));
    // 판 위 미리보기(마우스): 보기를 켰으면 놓일 모양, 아니면 점 찍힌 칸 자리만.
    if (hand && lastHover && !solved) {
      const [hx, hy] = lastHover;
      if (seen) {
        // 들어가는 자리면 초록 테, 안 되는 자리면 빨간 테.
        const occ = occupied(), cellsHere = shape(hand, orient[hand]).map(([x, y]) => [x + hx, y + hy]);
        const ok = cellsHere.every(([x, y]) => frame.has(k(x, y)) && !occ.has(k(x, y)));
        svg.append(pieceGroup(hand, cellsHere, 'ghost'));
        svg.append(el('path', { class: 'ghost-edge ' + (ok ? 'ok' : 'no'), d: outlinePath(cellsHere) }));
      }
      else svg.append(el('rect', { class: 'anchor-hint', x: hx + .12, y: hy + .12, width: .76, height: .76, rx: .2 }));
    }
    for (const [l, p] of Object.entries(placed)) {
      const g = pieceGroup(l, shape(l, p).map(([x, y]) => [x + p.x, y + p.y]), 'placed' + (l === lastPlaced ? ' drop' : ''));
      g.dataset.letter = l;
      svg.append(g);
    }
    lastPlaced = null;
    for (const [x, y] of cells) {
      const hit = el('rect', { class: 'hit', x, y, width: 1, height: 1, tabindex: 0, role: 'gridcell', 'aria-label': `${y + 1}째 줄 ${x + 1}째 칸` });
      hit.addEventListener('click', () => clickCell(x, y));
      hit.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); clickCell(x, y); } });
      hit.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') { lastHover = [x, y]; renderBoardSoon(); } });
      svg.append(hit);
    }
  }
  let boardFrame = 0;
  function renderBoardSoon() { cancelAnimationFrame(boardFrame); boardFrame = requestAnimationFrame(renderBoard); }

  // 누른 차례대로 적되, 이어서 누른 돌리기는 하나로 합치고 두 번 뒤집기는 지운다.
  function orientNote(o) {
    const steps = [];
    for (const op of o.ops || []) {
      const last = steps[steps.length - 1];
      if (op === 'flip') { if (last === 'flip') steps.pop(); else steps.push('flip'); continue; }
      const d = op === 'right' ? 1 : 3;
      if (typeof last === 'number') { const n = (last + d) % 4; if (n) steps[steps.length - 1] = n; else steps.pop(); }
      else steps.push(d);
    }
    if (!steps.length) return '그대로';
    return steps.map(t => (t === 'flip' ? '뒤집기' : ['', '오른쪽으로 90°', '180°', '왼쪽으로 90°'][t])).join(' → ');
  }
  function renderHand() {
    const svg = $('hand');
    const has = Boolean(hand);
    ['rot-left', 'rot-right', 'flip'].forEach(id => ($(id).disabled = !has || solved || paused));
    if (!has) {
      svg.replaceChildren(el('rect', { class: 'empty-hand', x: -1.5, y: -1.5, width: 3, height: 3, rx: .4 }));
      $('hand-note').textContent = solved ? '' : '상자에서 조각을 고르세요';
      return;
    }
    const o = orient[hand];
    if (seen) drawShape(svg, hand, shape(hand, o), true, handAnim);
    else drawShape(svg, hand, REL[hand], true, '');
    $('hand-note').textContent = seen ? '판으로 끌어다 놓아요' : orientNote(o);
    handAnim = '';
  }
  function renderTray() {
    const tray = $('tray');
    tray.replaceChildren();
    const left = [...puzzle.letters].filter(l => !placed[l]);
    for (const l of left) {
      const b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', `${l} 조각`);
      b.setAttribute('aria-pressed', String(hand === l));
      const svg = el('svg', { viewBox: '-3 -3 6 6' });
      drawShape(svg, l, REL[l], false);
      b.append(svg);
      b.disabled = solved || paused;
      b.addEventListener('click', () => { if (!dragJustEnded) pick(l); });
      b.addEventListener('pointerdown', e => beginDrag(e, l));
      tray.append(b);
    }
    if (!left.length) { const s = document.createElement('span'); s.className = 'tray-empty'; s.textContent = solved ? '' : '모든 조각을 놓았어요'; tray.append(s); }
  }
  function renderLadder() {
    const box = $('ladder');
    box.hidden = raceMode;
    if (raceMode) return;
    box.replaceChildren();
    STAGES[stageIndex].practice.forEach((_, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = String(i + 1);
      b.setAttribute('aria-label', `${i + 1}번 판`);
      if (cleared[`${stageIndex}:${i}`]) b.classList.add('cleared');
      if (i === practiceIndex) b.setAttribute('aria-current', 'true');
      b.addEventListener('click', () => openPractice(stageIndex, i));
      box.append(b);
    });
  }

  /* ---------- 끌어다 놓기: 손 상자나 남은 조각 상자에서 판으로. 손가락(마우스) 자리가 조각의 점 찍힌 칸 ---------- */
  let drag = null, floating = null, dragJustEnded = false;
  function beginDrag(e, letter) {
    if (solved || paused || !letter || (e.pointerType === 'mouse' && e.button !== 0)) return;
    drag = { id: e.pointerId, x0: e.clientX, y0: e.clientY, letter, moved: false };
  }
  function cellAt(e) {
    const svg = $('board'), m = svg.getScreenCTM();
    if (!m) return null;
    const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
    const x = Math.floor(p.x), y = Math.floor(p.y);
    return frame.has(k(x, y)) ? [x, y] : null;
  }
  function showFloating(e, overBoard) {
    if (!floating) {
      floating = el('svg', { class: 'floating', viewBox: '-3 -3 6 6', 'aria-hidden': 'true' });
      document.body.append(floating);
    }
    const cell = $('board').getBoundingClientRect().width / (puzzle.w + .6);
    floating.style.width = floating.style.height = `${cell * 6}px`;
    floating.style.left = `${e.clientX - cell * 3}px`;
    floating.style.top = `${e.clientY - cell * 3}px`;
    floating.style.visibility = overBoard ? 'hidden' : 'visible';
    // 감추기일 때는 돌린 모양을 들키지 않게 점 찍힌 칸 자리만 따라다닌다.
    if (seen) drawShape(floating, hand, shape(hand, orient[hand]), true);
    else floating.replaceChildren(el('circle', { class: 'anchor-dot', cx: 0, cy: 0, r: .3 }));
  }
  document.addEventListener('pointermove', e => {
    if (!drag || e.pointerId !== drag.id) return;
    if (!drag.moved) {
      if (Math.hypot(e.clientX - drag.x0, e.clientY - drag.y0) < 8) return;
      drag.moved = true;
      if (hand !== drag.letter) { hand = drag.letter; orient[hand] = { rot: 0, flip: false, ops: [] }; sfx('select'); render(); }
    }
    e.preventDefault();
    const c = cellAt(e);
    showFloating(e, Boolean(c));
    const before = lastHover ? lastHover.join() : '', after = c ? c.join() : '';
    if (before !== after) { lastHover = c; renderBoardSoon(); }
  });
  function endDrag(e, cancel) {
    if (!drag || e.pointerId !== drag.id) return;
    const d = drag;
    drag = null;
    floating?.remove(); floating = null;
    if (!d.moved) return;
    dragJustEnded = true; setTimeout(() => (dragJustEnded = false), 0);
    const c = cancel ? null : cellAt(e);
    lastHover = null;
    if (c) placeAt(c[0], c[1]); else renderBoard();
  }
  document.addEventListener('pointerup', e => endDrag(e, false));
  document.addEventListener('pointercancel', e => endDrag(e, true));

  /* ---------- 조작 ---------- */
  function pick(l) {
    if (solved || paused) return;
    hand = hand === l ? null : l;
    if (hand) orient[hand] = { rot: 0, flip: false, ops: [] };
    sfx('select');
    render();
  }
  function turn(kind) {
    if (!hand || solved || paused) return;
    start();
    const o = orient[hand];
    if (kind === 'right') { o.rot = (o.rot + 1) % 4; handAnim = 'spin-r'; }
    if (kind === 'left') { o.rot = (o.rot + 3) % 4; handAnim = 'spin-l'; }
    // 지금 모양을 좌우로 뒤집으면, 뒤집은 원래 모양을 반대로 돌린 것과 같다.
    if (kind === 'flip') { o.flip = !o.flip; o.rot = (4 - o.rot) % 4; handAnim = 'flip-in'; }
    o.ops.push(kind);
    turns++;
    sfx('tick');
    renderHand();
    if (seen) renderBoard();
    $('turns').textContent = `돌리기·뒤집기 ${turns}번`;
  }
  function clickCell(x, y) {
    if (solved || paused) return;
    const occ = occupied();
    const there = occ.get(k(x, y));
    if (there) { // 놓인 조각을 다시 손에
      const p = placed[there];
      delete placed[there];
      hand = there;
      orient[there] = { rot: p.rot, flip: p.flip, ops: [...(p.flip ? ['flip'] : []), ...Array(p.rot).fill('right')] };
      sfx('card');
      progress();
      render();
      return;
    }
    if (!hand) { notice('상자에서 조각을 먼저 고르세요'); return; }
    placeAt(x, y, occ);
  }
  function placeAt(x, y, occ = occupied()) {
    if (!hand || solved || paused) return;
    start();
    const o = orient[hand];
    const cells = shape(hand, o).map(([dx, dy]) => [x + dx, y + dy]);
    const fits = cells.every(([cx, cy]) => frame.has(k(cx, cy)) && !occ.has(k(cx, cy)));
    if (!fits) {
      misses++;
      sfx('error');
      const svg = $('board');
      cells.forEach(([cx, cy]) => svg.append(el('rect', { class: 'bad', x: cx + .05, y: cy + .05, width: .9, height: .9, rx: .12 })));
      $('hand-box').classList.remove('shake'); void $('hand-box').offsetWidth; $('hand-box').classList.add('shake');
      return;
    }
    placed[hand] = { rot: o.rot, flip: o.flip, x, y };
    lastPlaced = hand;
    hand = null;
    sfx('stone');
    progress();
    if (Object.keys(placed).length === puzzle.letters.length) return win();
    render();
  }
  function progress() { if (raceMode && race.active) race.progress(Object.keys(placed).length, puzzle.letters.length); }

  function win() {
    solved = true;
    finishedAt = Date.now();
    const sec = elapsed();
    render();
    document.querySelectorAll('#board .placed').forEach((g, i) => setTimeout(() => g.classList.add('cheer'), i * 70));
    sfx('success');
    if (raceMode) { if (race.active) race.finish(sec); return; }
    const id = `${stageIndex}:${practiceIndex}`, prev = cleared[id];
    if (!prev || sec < prev.sec) cleared[id] = { sec: Math.round(sec), turns, misses, seen };
    store?.set('cleared', cleared);
    $('done-text').textContent = `${fmt(sec)} · 돌리기·뒤집기 ${turns}번 · 잘못 놓기 ${misses}번`;
    setTimeout(() => { $('done').hidden = false; $('next').focus(); renderLadder(); }, 650);
  }

  function openPractice(s, i) {
    stageIndex = s; practiceIndex = i;
    $('stage').value = String(s);
    const st = STAGES[s];
    load(st.pool[st.practice[i]]);
    store?.set('last', { stage: s, index: i });
  }
  function nextPractice() {
    const st = STAGES[stageIndex];
    if (practiceIndex + 1 < st.practice.length) openPractice(stageIndex, practiceIndex + 1);
    else if (stageIndex + 1 < STAGES.length) openPractice(stageIndex + 1, 0);
    else openPractice(stageIndex, 0);
  }

  /* ---------- 순위전 ---------- */
  const race = window.ClassroomPuzzleRace.create({
    gameId: 'pentomino',
    title: 'PENTOMINO',
    settings: [
      { key: 'stage', label: '조각 수', options: STAGES.map((s, i) => ({ value: i, label: `조각 ${s.pieces}개` })) },
      { key: 'seen', label: '돌린 모양', options: [{ value: 0, label: '감추기' }, { value: 1, label: '보이기' }] },
    ],
    getSettings: () => ({ stage: stageIndex, seen: seen ? 1 : 0 }),
    createPuzzle: settings => { const pool = STAGES[Number(settings.stage)]?.pool || STAGES[0].pool; return pool[Math.floor(Math.random() * pool.length)]; },
    start: (data, settings) => {
      raceMode = true;
      seen = Number(settings.seen) === 1;
      load(data);
      paused = true;
      render();
      race.progress(0, puzzle.letters.length);
    },
    pause: on => { paused = on; if (!on && !startedAt) startedAt = Date.now(); render(); },
    stop: () => { solved = true; render(); },
    exit: () => { raceMode = false; paused = false; seen = Boolean(store?.get('seen')); openPractice(stageIndex, practiceIndex); },
    standingsHost: () => $('race-standings'),
    progressText: racer => `${racer.done}/${racer.total}조각`,
  });

  /* ---------- 시작 ---------- */
  STAGES.forEach((s, i) => { const o = document.createElement('option'); o.value = String(i); o.textContent = `조각 ${s.pieces}개`; $('stage').append(o); });
  $('stage').addEventListener('change', () => openPractice(Number($('stage').value), 0));
  $('seen').addEventListener('click', () => { seen = !seen; store?.set('seen', seen); render(); });
  $('restart').addEventListener('click', () => load(puzzle));
  $('next').addEventListener('click', nextPractice);
  $('rot-left').addEventListener('click', () => turn('left'));
  $('rot-right').addEventListener('click', () => turn('right'));
  $('flip').addEventListener('click', () => turn('flip'));
  $('race-open').addEventListener('click', () => race.open());
  $('hand').addEventListener('pointerdown', e => beginDrag(e, hand));
  $('board').addEventListener('pointerleave', () => { lastHover = null; renderBoardSoon(); });
  document.addEventListener('keydown', e => {
    if (e.target.closest('input,select,textarea')) return;
    const key = e.key.toLowerCase();
    if (key === 'r') turn('right');
    else if (key === 'e') turn('left');
    else if (key === 'f') turn('flip');
  });
  setInterval(() => { $('clock').textContent = fmt(elapsed()); }, 250);
  const name = String(window.CLASS_PLAYER_NAME || '').trim();
  $('race-open').hidden = !/^[가-힣]{2,6}$/.test(name.replace(/\s/g, ''));

  openPractice(0, 0);
  window.SiteStorage?.open('pentomino').then(opened => {
    store = opened;
    cleared = store.get('cleared') || {};
    seen = Boolean(store.get('seen'));
    const last = store.get('last');
    if (!raceMode && last && STAGES[last.stage]?.practice[last.index] != null && !Object.keys(placed).length) openPractice(last.stage, last.index);
    else render();
  }).catch(() => {});
})();
