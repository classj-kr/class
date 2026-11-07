(() => {
  'use strict';
  const C = window.Geoboard, $ = id => document.getElementById(id), board = $('board');
  const NS = 'http://www.w3.org/2000/svg';
  let state = C.initial(), selected = null, draft = [], drag = null, cursor = null, hover = null;
  let store, edited = false, saveErrors = 0, saving = false, saveQueued = false, noticeTimer;
  const undo = [], redo = [];
  const bands = () => state.scenes[state.size];
  const current = () => bands().find(b => b.id === selected);
  const step = () => 480 / (state.size - 1);
  const pixel = p => ({ x: 60 + p.x * step(), y: 60 + p.y * step() });
  const bounded = p => ({ x: Math.max(0, Math.min(state.size - 1, p.x)), y: Math.max(0, Math.min(state.size - 1, p.y)) });
  const snapped = p => bounded({ x: Math.round(p.x), y: Math.round(p.y) });
  const id = () => `b-${crypto.randomUUID()}`;
  function element(name, attrs = {}, parent) {
    const node = document.createElementNS(NS, name);
    for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, String(value));
    if (parent) parent.append(node);
    return node;
  }
  function update(node, attrs) {
    for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, String(value));
    return node;
  }
  function part(parent, key, name, attrs) {
    const node = [...parent.children].find(n => n.dataset.part === key) || element(name, { 'data-part': key }, parent);
    return update(node, attrs);
  }
  const path = (points, close = points.length > 2) => points.map((p, i) => { const v = pixel(p); return `${i ? 'L' : 'M'}${v.x} ${v.y}`; }).join(' ') + (close ? ' Z' : '');
  const edges = points => points.length === 2 ? 1 : points.length;
  function sound() { window.ClassGameSfx?.play('tick'); }
  function notice(text) {
    $('message').textContent = text; $('message').hidden = false;
    clearTimeout(noticeTimer); noticeTimer = setTimeout(() => { $('message').hidden = true; }, 3200);
  }
  function rememberFocus() {
    const node = document.activeElement;
    if (!board.contains(node) || node === board) return null;
    return { kind: node.dataset.kind, id: node.dataset.id, index: node.dataset.index };
  }
  function restoreFocus(focus) {
    if (!focus) return;
    const node = [...board.querySelectorAll('[tabindex]')].find(n => n.dataset.kind === focus.kind && n.dataset.id === focus.id && n.dataset.index === focus.index);
    (node || board).focus({ preventScroll: true });
  }
  async function persist() {
    edited = true;
    if (!store) return;
    if (!store.persistent) { $('save-status').textContent = '이 탭에서 사용 중'; return; }
    saveQueued = true;
    if (saving) return;
    saving = true;
    try {
      // Serialize writes so a slow older request cannot overwrite later edits.
      while (saveQueued) {
        saveQueued = false;
        const errorsBefore = saveErrors;
        $('save-status').textContent = '저장 중';
        store.set('board', C.copy(state));
        await store.flush();
        if (!saveQueued && errorsBefore === saveErrors) $('save-status').textContent = '계정에 자동 저장됨';
      }
    } finally { saving = false; }
  }
  function commit(change, play = true) {
    const before = C.copy(state), next = C.copy(state);
    change(next);
    if (JSON.stringify(before) === JSON.stringify(next)) { render(); return false; }
    state = C.validate(next);
    undo.push(before); if (undo.length > 60) undo.shift(); redo.length = 0;
    if (!current()) selected = null;
    persist(); render(); if (play) sound(); return true;
  }
  function updatePoints(points) {
    if (!C.validPoints(points, state.size)) { notice('고무줄이 교차하거나 겹치지 않게 놓아 주세요.'); render(); return false; }
    return commit(next => { next.scenes[next.size].find(b => b.id === selected).points = points; });
  }
  function addBand(points) {
    if (bands().length >= C.MAX_BANDS) { notice('고무줄은 한 판에 24개까지 놓을 수 있어요.'); return false; }
    if (!C.validPoints(points, state.size)) { notice('고무줄이 교차하거나 겹치지 않게 놓아 주세요.'); return false; }
    selected = id();
    commit(next => next.scenes[next.size].push({ id: selected, points, color: state.color, fill: state.fill }));
    return true;
  }
  function history(direction) {
    cancelGesture(); draft = [];
    const from = direction === 'undo' ? undo : redo, to = direction === 'undo' ? redo : undo;
    if (!from.length) { render(); return; }
    to.push(C.copy(state)); state = from.pop();
    selected = bands().at(-1)?.id || null;
    persist(); render(); sound();
  }
  function remove() { if (current()) commit(next => { next.scenes[next.size] = next.scenes[next.size].filter(b => b.id !== selected); }); }
  function finish() {
    if (draft.length < 2) return;
    if (addBand(C.copy(draft))) { draft = []; hover = null; render(); }
  }
  function pinClick(point) {
    edited = true;
    if (draft.length && C.same(draft[0], point)) { if (draft.length >= 2) finish(); else { draft = []; render(); } return; }
    if (draft.length && C.same(draft.at(-1), point)) { finish(); return; }
    if (draft.some(p => C.same(p, point))) return;
    if (!draft.length) selected = null;
    draft.push(point); hover = null; render(); sound();
  }
  function measurements() {
    const band = current();
    $('measurement').hidden = !band || (!state.area && !state.length);
    const values = [];
    if (band) {
      const m = C.metrics(band.points);
      if (state.area && m.closed) values.push(`넓이 ${m.area}`);
      if (state.length) values.push(`${m.closed ? '둘레' : '길이'} ${m.exact ? '' : '≈ '}${m.exact ? m.length : Number(m.length.toFixed(2))}`);
    }
    $('values').replaceChildren(...values.map(text => { const span = document.createElement('span'); span.textContent = text; return span; }));
    if (!values.length) $('measurement').hidden = true;
  }
  let lastGrid = '';
  function renderBoard() {
    const key = `${state.size}-${state.grid}`;
    if (lastGrid !== key) {
      lastGrid = key; $('grid').replaceChildren(); $('pins').replaceChildren();
      for (let i = 0; i < state.size; i++) {
        const pos = 60 + i * step();
        if (state.grid) element('path', { d: `M60 ${pos}H540 M${pos} 60V540`, class: 'grid-line' }, $('grid'));
        for (let j = 0; j < state.size; j++) {
          const p = pixel({ x: j, y: i }), g = element('g', {}, $('pins'));
          element('circle', { cx: p.x + 1, cy: p.y + 3, r: 7, class: 'pin-shadow' }, g);
          element('circle', { cx: p.x, cy: p.y, r: 5.5, class: 'pin-head' }, g);
          element('circle', { cx: p.x, cy: p.y, r: Math.min(25, step() * .42), class: 'pin-hit', 'data-x': j, 'data-y': i }, g);
        }
      }
    }
    const focus = rememberFocus();
    // Keep pointer targets connected through touchstart/touchend. Replacing SVG
    // nodes during a captured touch can suppress subsequent native button clicks.
    const groups = new Map([...$('bands').children].map(n => [n.dataset.id, n]));
    const handles = new Set();
    // Selected rubber bands sit above other bands, including their touch targets.
    const ordered = [...bands().filter(b => b.id !== selected), ...bands().filter(b => b.id === selected)];
    for (const band of ordered) {
      const points = drag?.moved && drag.id === band.id ? drag.preview : band.points;
      const active = band.id === selected;
      const group = groups.get(band.id) || element('g', {}, $('bands'));
      groups.delete(band.id);
      update(group, { class: 'band', 'data-kind': 'band', 'data-id': band.id, tabindex: 0, role: 'button', 'aria-pressed': active, 'aria-label': `고무줄 ${bands().indexOf(band) + 1} 선택` });
      // Reordering is only necessary when a different band is selected.
      if (active && group !== $('bands').lastElementChild) $('bands').append(group);
      part(group, 'fill', 'path', { class: 'band-fill', d: path(points), fill: band.color, 'fill-opacity': band.fill && points.length > 2 ? .16 : 0, 'pointer-events': points.length > 2 ? 'all' : 'none' });
      part(group, 'outline', 'path', { class: 'band-edge', d: path(points), stroke: band.color, 'stroke-width': active ? 6 : 4.5 });
      part(group, 'shine', 'path', { class: 'band-edge', d: path(points), stroke: '#ffffff', 'stroke-opacity': .3, 'stroke-width': 1.5, transform: 'translate(-.5,-.7)' });
      for (let i = 0; i < edges(points); i++) {
        part(group, `edge-${i}`, 'path', { class: 'band-hit', d: path([points[i], points[(i + 1) % points.length]], false), 'data-edge': i });
      }
      group.querySelectorAll('[data-edge]').forEach(node => { if (Number(node.dataset.edge) >= edges(points)) node.remove(); });
      if (active && !draft.length) {
        for (let i = 0; i < edges(points); i++) {
          const a = points[i], b = points[(i + 1) % points.length];
          handles.add(handle({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }, band, i, 'edge'));
        }
        points.forEach((point, i) => handles.add(handle(point, band, i, 'vertex')));
      }
    }
    groups.forEach(node => node.remove());
    [...$('handles').children].forEach(node => { if (!handles.has(node)) node.remove(); });
    renderPreview();
    if (focus && !board.contains(document.activeElement)) restoreFocus(focus);
  }
  function handle(point, band, index, kind) {
    const p = pixel(point), isVertex = kind === 'vertex';
    const g = [...$('handles').children].find(n => n.dataset.id === band.id && n.dataset.kind === kind && n.dataset.index === String(index)) || element('g', {}, $('handles'));
    update(g, { class: `handle ${kind}`, 'data-kind': kind, 'data-id': band.id, 'data-index': index, tabindex: 0, role: 'button', 'aria-label': `${isVertex ? '꼭짓점' : '변 가운데'} ${index + 1}` });
    part(g, 'target', 'circle', { cx: p.x, cy: p.y, r: isVertex ? 21 : 16, class: 'target' });
    part(g, 'dot', 'circle', { cx: p.x, cy: p.y, r: isVertex ? 8.5 : 5, class: 'dot', stroke: band.color });
    return g;
  }
  function renderPreview() {
    $('preview').replaceChildren();
    if (draft.length) {
      const points = hover ? [...draft, hover] : draft;
      element('path', { d: path(points, false), class: 'preview-path', fill: 'none', stroke: state.color }, $('preview'));
      draft.forEach((point, i) => { const p = pixel(point); element('circle', { cx: p.x, cy: p.y, r: i === 0 ? 10 : 7, class: 'preview-pin', stroke: state.color }, $('preview')); });
    }
    if (drag?.kind === 'new' && drag.moved) element('path', { d: path([drag.startPin, drag.point], false), class: 'preview-path', fill: 'none', stroke: state.color }, $('preview'));
    if (cursor && document.activeElement === board) { const p = pixel(cursor); element('circle', { cx: p.x, cy: p.y, r: 16, class: 'cursor' }, $('preview')); }
  }
  function render() {
    if (!current()) selected = null;
    $('size').value = String(state.size);
    $('undo').disabled = !undo.length; $('redo').disabled = !redo.length;
    $('clear').disabled = !bands().length; $('remove').disabled = !current();
    $('fill').setAttribute('aria-pressed', current()?.fill ?? state.fill);
    const color = current()?.color ?? state.color;
    document.querySelectorAll('.swatch').forEach(b => b.setAttribute('aria-pressed', b.dataset.color === color));
    for (const key of ['grid', 'area', 'length']) $(`show-${key}`).setAttribute('aria-pressed', state[key]);
    $('drawing-tools').hidden = !draft.length;
    $('finish').disabled = draft.length < 2;
    renderBoard(); measurements();
  }
  function eventPoint(event) {
    const p = new DOMPoint(event.clientX, event.clientY).matrixTransform(board.getScreenCTM().inverse());
    return { x: (p.x - 60) / step(), y: (p.y - 60) / step() };
  }
  function cancelGesture() {
    if (drag && board.hasPointerCapture(drag.pointer)) board.releasePointerCapture(drag.pointer);
    drag = null; board.classList.remove('dragging');
  }
  // The board handles touch with pointer events; do not also start a browser
  // scroll/compatibility mouse gesture on the SVG drawing surface.
  for (const type of ['touchstart', 'touchmove']) board.addEventListener(type, event => event.preventDefault(), { passive: false });
  board.addEventListener('pointerdown', event => {
    if (drag || !event.isPrimary || event.button !== 0) return;
    edited = true; cursor = null;
    const p = eventPoint(event), point = snapped(p);
    if (draft.length) {
      drag = { kind: 'draft', start: p, pointer: event.pointerId, startPin: point, moved: false };
    } else {
      const handle = event.target.closest('.handle'), band = event.target.closest('.band'), pin = event.target.closest('.pin-hit');
      if (handle || band) {
        selected = (handle || band).dataset.id;
        const original = C.copy(current().points);
        const edge = event.target.closest('[data-edge]');
        drag = { kind: handle?.dataset.kind || (edge ? 'edge' : 'move'), id: selected, index: Number(handle?.dataset.index ?? edge?.dataset.edge ?? 0), original, preview: original, start: p, point: p, pointer: event.pointerId, moved: false };
      } else if (pin) {
        selected = null;
        drag = { kind: 'new', start: p, point, startPin: { x: Number(pin.dataset.x), y: Number(pin.dataset.y) }, pointer: event.pointerId, moved: false };
      } else { selected = null; render(); board.focus({ preventScroll: true }); return; }
    }
    board.focus({ preventScroll: true });
    if (event.pointerType === 'mouse') board.setPointerCapture(event.pointerId);
    render();
  });
  board.addEventListener('pointermove', event => {
    const p = eventPoint(event);
    if (!drag) { if (draft.length) { hover = bounded(p); renderPreview(); } return; }
    if (drag.pointer !== event.pointerId) return;
    const scale = board.getBoundingClientRect().width / 600;
    if (Math.hypot(p.x - drag.start.x, p.y - drag.start.y) * step() * scale > 6) drag.moved = true;
    if (!drag.moved) return;
    drag.point = bounded(p); board.classList.add('dragging');
    if (drag.kind === 'draft') { hover = drag.point; renderPreview(); return; }
    if (drag.kind === 'new') { renderPreview(); return; }
    if (drag.kind === 'move') drag.preview = C.move(drag.original, p.x - drag.start.x, p.y - drag.start.y, state.size);
    if (drag.kind === 'vertex') { drag.preview = C.copy(drag.original); drag.preview[drag.index] = drag.point; }
    if (drag.kind === 'edge') { drag.preview = C.copy(drag.original); drag.preview.splice(drag.index + 1, 0, drag.point); }
    renderBoard();
  });
  board.addEventListener('pointerup', event => {
    if (!drag || drag.pointer !== event.pointerId) return;
    const end = drag, point = snapped(eventPoint(event));
    drag = null; board.classList.remove('dragging');
    if (end.kind === 'draft') { pinClick(point); return; }
    if (end.kind === 'new') {
      if (end.moved && !C.same(end.startPin, point)) addBand([end.startPin, point]);
      else pinClick(end.startPin);
      render(); return;
    }
    if (!end.moved) { render(); return; }
    let points;
    if (end.kind === 'move') {
      const p = eventPoint(event);
      points = C.move(end.original, Math.round(p.x - end.start.x), Math.round(p.y - end.start.y), state.size);
    } else if (end.kind === 'vertex') points = C.moveVertex(end.original, end.index, point);
    else { points = C.copy(end.original); points.splice(end.index + 1, 0, point); }
    updatePoints(points);
  });
  for (const name of ['pointercancel', 'lostpointercapture']) board.addEventListener(name, event => {
    if (drag?.pointer === event.pointerId) { drag = null; board.classList.remove('dragging'); render(); }
  });
  board.addEventListener('pointerleave', () => { if (!drag) { hover = null; renderPreview(); } });
  board.addEventListener('focus', renderPreview);
  board.addEventListener('blur', renderPreview);
  board.addEventListener('keydown', event => {
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    const directions = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
    const direction = directions[event.key], node = event.target.closest('[data-kind]');
    if (event.key === 'Escape') { event.preventDefault(); cancelGesture(); draft = []; selected = null; render(); board.focus(); return; }
    if (node) {
      selected = node.dataset.id; const band = current();
      if (!band) return;
      const index = Number(node.dataset.index), kind = node.dataset.kind;
      if (direction) {
        event.preventDefault(); const [dx, dy] = direction; let points;
        if (kind === 'band') points = C.move(band.points, dx, dy, state.size);
        else if (kind === 'vertex') points = C.moveVertex(band.points, index, bounded({ x: band.points[index].x + dx, y: band.points[index].y + dy }));
        else {
          const a = band.points[index], b = band.points[(index + 1) % band.points.length];
          points = C.copy(band.points);
          points.splice(index + 1, 0, snapped({ x: (a.x + b.x) / 2 + dx, y: (a.y + b.y) / 2 + dy }));
        }
        if (updatePoints(points) && kind === 'edge') restoreFocus({ kind: 'vertex', id: selected, index: String(index + 1) });
      } else if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); render(); }
      else if (event.key === 'Delete' || event.key === 'Backspace') {
        event.preventDefault();
        if (kind === 'vertex' && band.points.length > 2) updatePoints(band.points.filter((_, i) => i !== index));
        else remove();
      }
      return;
    }
    if (direction) { event.preventDefault(); cursor = bounded({ x: (cursor?.x ?? 0) + direction[0], y: (cursor?.y ?? 0) + direction[1] }); renderPreview(); }
    else if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); cursor ||= { x: 0, y: 0 }; pinClick({ ...cursor }); }
    else if (event.key === 'Delete' || event.key === 'Backspace') { event.preventDefault(); if (draft.length) { draft.pop(); render(); } else remove(); }
  });
  document.addEventListener('keydown', event => {
    if (event.target.closest('input,select,textarea,[contenteditable]')) return;
    if ((event.ctrlKey || event.metaKey) && ['z', 'y'].includes(event.key.toLowerCase())) { event.preventDefault(); history(event.key.toLowerCase() === 'y' || event.shiftKey ? 'redo' : 'undo'); }
  });
  C.COLORS.forEach((color, i) => {
    const button = document.createElement('button'); button.type = 'button'; button.className = 'swatch'; button.dataset.color = color; button.style.setProperty('--color', color);
    button.setAttribute('aria-label', ['초록', '주황', '파랑', '보라', '노랑'][i]);
    button.addEventListener('click', () => commit(next => { next.color = color; const band = next.scenes[next.size].find(b => b.id === selected); if (band) band.color = color; }, false));
    document.querySelector('.palette').append(button);
  });
  $('add').addEventListener('click', () => {
    cancelGesture(); draft = []; hover = null;
    const start = (bands().length + 1) % (state.size - 2);
    addBand([{ x: start, y: start }, { x: start + 2, y: start }, { x: start + 2, y: start + 2 }, { x: start, y: start + 2 }]);
  });
  $('size').addEventListener('change', () => {
    cancelGesture(); draft = []; selected = null; cursor = null;
    commit(next => { next.size = Number($('size').value); });
  });
  $('undo').addEventListener('click', () => history('undo'));
  $('redo').addEventListener('click', () => history('redo'));
  $('remove').addEventListener('click', remove);
  $('clear').addEventListener('click', () => { cancelGesture(); draft = []; commit(next => { next.scenes[next.size] = []; }); });
  $('fill').addEventListener('click', () => commit(next => {
    const value = !(current()?.fill ?? state.fill); next.fill = value;
    const band = next.scenes[next.size].find(b => b.id === selected); if (band) band.fill = value;
  }, false));
  for (const key of ['grid', 'area', 'length']) $(`show-${key}`).addEventListener('click', () => commit(next => { next[key] = !next[key]; }, false));
  $('finish').addEventListener('click', finish);
  $('cancel').addEventListener('click', () => { draft = []; hover = null; render(); board.focus(); });
  render();
  window.SiteStorage.open('geoboard').then(opened => {
    store = opened;
    store.onError(() => { ++saveErrors; $('save-status').textContent = '저장 실패'; notice('저장하지 못했어요. 연결을 확인한 뒤 다시 조작해 주세요.'); });
    if (!edited && store.has('board')) {
      try { state = C.validate(store.get('board')); selected = bands().at(-1)?.id || null; render(); }
      catch (_) { notice('저장한 판을 읽지 못했어요. 새 판을 열었어요.'); }
    }
    if (edited) persist();
    else $('save-status').textContent = store.persistent ? '계정에 자동 저장' : '이 탭에서 사용 중';
  }).catch(() => { $('save-status').textContent = '이 탭에서 사용 중'; });
})();
