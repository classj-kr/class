(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const canvas = $('board'), ctx = canvas.getContext('2d');
  // Committed ink is cached. Only the current stroke is rebuilt while writing.
  const ink = document.createElement('canvas'), inkCtx = ink.getContext('2d');
  const groupId = new URLSearchParams(location.search).get('groupId');
  const group = groupId && /^\d+$/.test(groupId) ? groupId : '';
  const storageKey = 'classj-blackboard-v1' + (group ? '-group-' + group : '');
  if (group) $('backLink').search = '?groupId=' + group;
  let strokes = [], undo = [], redo = [], current = null, activePointer = null;
  let tool = 'pen', color = '#f4f5e9', frame = 0, toastTimer;
  const toolSettingsKey = 'classj-blackboard-tools-v1';
  const sizes = { pen: 8, eraser: 64 };
  let correction = true;
  const sizeRanges = { pen: { min: 2, max: 40, step: 1, label: '펜 굵기' }, eraser: { min: 16, max: 160, step: 4, label: '지우개 크기' } };
  let cursorPoint = null;
  try {
    const savedSizes = JSON.parse(localStorage.getItem(toolSettingsKey) || '{}');
    if (typeof savedSizes?.correction === 'boolean') correction = savedSizes.correction;
    for (const name of ['pen', 'eraser']) {
      const value = savedSizes?.[name], range = sizeRanges[name];
      if (Number.isFinite(value) && value >= range.min && value <= range.max && (value - range.min) % range.step === 0) sizes[name] = value;
    }
  } catch (_) { /* Keep usable defaults if preferences are unavailable. */ }
  let view = { width: 1, height: 1, dpr: 1 };
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
    if (Array.isArray(saved)) strokes = saved.filter(s => s && ['pen','eraser'].includes(s.tool) &&
      Number.isFinite(s.width) && s.width > 0 && /^#[0-9a-f]{6}$/i.test(s.color) &&
      Array.isArray(s.points) && s.points.every(p => Number.isFinite(p.x) && Number.isFinite(p.y)));
  } catch (_) { notice('저장된 칠판을 읽지 못했습니다. 새 칠판을 엽니다.'); }
  function notice(message) {
    $('toast').textContent = message;
    $('toast').classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => $('toast').classList.remove('show'), 2600);
  }
  function persist() {
    try { localStorage.setItem(storageKey, JSON.stringify(strokes)); }
    catch (_) { notice('자동 저장하지 못했습니다. PNG로 저장해 주세요.'); }
    $('undoBtn').disabled = !undo.length && !strokes.length;
    $('redoBtn').disabled = !redo.length;
  }
  function render() {
    ctx.clearRect(0, 0, view.width, view.height);
    ctx.drawImage(ink, 0, 0, view.width, view.height);
    if (current) ClassJBrush.draw(ctx, current, view.width, view.height, false);
  }
  function schedule() {
    if (!frame) frame = requestAnimationFrame(() => { frame = 0; render(); });
  }
  function rebuild() {
    inkCtx.clearRect(0, 0, view.width, view.height);
    for (const stroke of strokes) ClassJBrush.draw(inkCtx, stroke, view.width, view.height);
    render();
  }
  function resize() {
    const r = canvas.getBoundingClientRect();
    const dpr = Math.min(devicePixelRatio || 1, 2);
    if (r.width <= 0 || r.height <= 0) return;
    view = { width: r.width, height: r.height, dpr };
    for (const surface of [canvas, ink]) {
      surface.width = Math.round(r.width * dpr);
      surface.height = Math.round(r.height * dpr);
      surface.getContext('2d').setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    rebuild();
    updateEraserCursor();
  }
  function point(e) {
    const r = canvas.getBoundingClientRect();
    return {
      x: Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)),
      y: Math.max(0, Math.min(1, (e.clientY - r.top) / r.height)),
      time: e.timeStamp
    };
  }
  const contacts = new Map();
  let gesture = null;
  function remember(e) {
    const contact = { id: e.pointerId, type: e.pointerType, point: point(e), width: e.width || 1, height: e.height || 1 };
    contacts.set(e.pointerId, contact);
    return contact;
  }
  function touches() { return [...contacts.values()].filter(c => c.type === 'touch'); }
  function isPalm(contact) {
    const major = Math.max(contact.width, contact.height), minor = Math.min(contact.width, contact.height);
    // CSS contact geometry, not pressure. Missing geometry (1 x 1) cannot identify a palm.
    return contact.type === 'touch' && ((major >= 44 && minor >= 18) || (major >= 34 && major * minor >= 1400));
  }
  function appendPoint(next, split = false) {
    const last = current.points[current.points.length - 1];
    if (split || Math.hypot((next.x - last.x) * view.width, (next.y - last.y) * view.height) > 0.15) {
      current.points.push(split ? { ...next, break: true } : next);
    }
  }
  function append(e) { appendPoint(point(e)); }
  function startSingle(contact) {
    activePointer = contact.id;
    current = { tool, color, width: sizes[tool], correction, brushVersion: 3, points: [contact.point] };
    if (tool === 'eraser') current.eraserDiameter = sizes.eraser;
    cursorPoint = contact.point;
    updateEraserCursor();
  }
  function commitCurrent() {
    if (!current) return;
    const stroke = current;
    strokes.push(stroke);
    undo.push({ type: 'stroke', stroke });
    if (undo.length > 100) undo.shift();
    redo = [];
    current = null;
    activePointer = null;
    ClassJBrush.draw(inkCtx, stroke, view.width, view.height);
    persist();
    render();
  }
  function gesturePoint() {
    const live = touches();
    const leader = live.find(c => c.id === gesture.leadId);
    if (leader) return leader.point;
    return {
      x: live.reduce((sum, c) => sum + c.point.x, 0) / live.length,
      y: live.reduce((sum, c) => sum + c.point.y, 0) / live.length,
      time: Math.max(...live.map(c => c.point.time))
    };
  }
  function maybeStartGesture() {
    if (gesture) return false;
    const live = touches(), palm = live.find(isPalm);
    if (!palm && live.length < 2) return false;
    // Reclassifying a finger contact must remove its tentative dot, not save accidental ink.
    if (current?.tool === 'pen' && contacts.get(activePointer)?.type === 'touch') {
      current = null;
      activePointer = null;
    } else commitCurrent();
    gesture = { leadId: palm?.id, kind: palm ? 'palm' : 'multi' };
    const center = gesturePoint();
    let diameter = palm ? Math.max(palm.width, palm.height) * 1.15 : 64;
    if (!palm) {
      for (const c of live) diameter = Math.max(diameter, Math.hypot((c.point.x - center.x) * view.width, (c.point.y - center.y) * view.height) * 2 + 24);
    }
    diameter = Math.max(56, Math.min(200, diameter)) * 600 / Math.min(view.width, view.height);
    current = { tool: 'eraser', color, width: diameter, eraserDiameter: diameter, gesture: gesture.kind, points: [center] };
    cursorPoint = center;
    $('gestureStatus').hidden = false;
    $('gestureStatus').textContent = palm ? '손바닥으로 지우는 중' : '두 손가락으로 지우는 중';
    updateEraserCursor();
    schedule();
    return true;
  }
  function moveGesture(split = false) {
    if (!touches().length) return;
    cursorPoint = gesturePoint();
    appendPoint(cursorPoint, split);
    updateEraserCursor();
    schedule();
  }
  function endGesture() {
    commitCurrent();
    gesture = null;
    cursorPoint = null;
    $('gestureStatus').hidden = true;
    updateEraserCursor();
  }
  canvas.addEventListener('pointerdown', e => {
    if (e.button !== 0) return;
    e.preventDefault();
    const contact = remember(e);
    canvas.setPointerCapture(e.pointerId);
    // Secondary touch contacts are needed for palms and the two-finger fallback.
    if (gesture) {
      if (contact.type === 'touch') moveGesture(true);
      return;
    }
    if (maybeStartGesture()) return;
    if (!current) startSingle(contact);
    schedule();
  });
  canvas.addEventListener('pointermove', e => {
    if (!contacts.has(e.pointerId)) {
      if (!current) { cursorPoint = point(e); updateEraserCursor(); }
      return;
    }
    const contact = remember(e);
    e.preventDefault();
    if (gesture) {
      if (contact.type === 'touch') moveGesture();
      return;
    }
    if (maybeStartGesture()) return;
    // A pen held down during palm erasing resumes at its current position, without a joining line.
    if (!current) startSingle(contact);
    if (e.pointerId !== activePointer) return;
    cursorPoint = contact.point;
    const batch = e.getCoalescedEvents ? e.getCoalescedEvents() : [];
    for (const event of (batch.length ? batch : [e])) append(event);
    updateEraserCursor();
    schedule();
  });
  function endPointer(e) {
    const contact = contacts.get(e.pointerId);
    if (!contact) return;
    if (e.type === 'pointerup') remember(e);
    if (gesture) {
      if (contact.type === 'touch' && e.type === 'pointerup') moveGesture();
      contacts.delete(e.pointerId);
      if (!touches().length) endGesture();
      else if (contact.type === 'touch') moveGesture(true);
    } else {
      if (current && e.pointerId === activePointer) {
        if (e.type === 'pointerup') append(e);
        commitCurrent();
      }
      contacts.delete(e.pointerId);
      if (contact.type === 'touch' || e.type !== 'pointerup') cursorPoint = null;
      updateEraserCursor();
    }
  }
  function finish() {
    // Toolbar actions, blur and visibility changes end the whole interaction.
    const ids = [...contacts.keys()];
    contacts.clear();
    if (gesture) endGesture();
    else commitCurrent();
    cursorPoint = null;
    updateEraserCursor();
    for (const id of ids) if (canvas.hasPointerCapture(id)) canvas.releasePointerCapture(id);
  }
  canvas.addEventListener('pointerup', endPointer);
  canvas.addEventListener('pointercancel', endPointer);
  canvas.addEventListener('lostpointercapture', endPointer);
  window.addEventListener('blur', finish);
  document.addEventListener('visibilitychange', () => { if (document.hidden) finish(); });
  function updateEraserCursor() {
    const cursor = $('eraserCursor');
    const erasing = current ? current.tool === 'eraser' : tool === 'eraser';
    $('boardShell').classList.toggle('erasing', erasing);
    cursor.hidden = !erasing || !cursorPoint;
    if (cursor.hidden) return;
    const diameter = (current?.eraserDiameter || sizes.eraser) * Math.min(view.width, view.height) / 600;
    cursor.style.width = cursor.style.height = diameter + 'px';
    cursor.style.left = cursorPoint.x * view.width + 'px';
    cursor.style.top = cursorPoint.y * view.height + 'px';
  }
  canvas.addEventListener('pointerleave', () => { cursorPoint = null; updateEraserCursor(); });
  function updateSizeControl() {
    const range = sizeRanges[tool], input = $('sizeRange');
    input.min = range.min;
    input.max = range.max;
    input.step = range.step;
    input.value = sizes[tool];
    $('sizeLabel').textContent = range.label;
    $('sizeValue').textContent = sizes[tool];
    input.setAttribute('aria-valuetext', range.label + ' ' + sizes[tool]);
    updateEraserCursor();
  }
  function setTool(next) {
    tool = next;
    $('penBtn').setAttribute('aria-pressed', tool === 'pen');
    $('eraserBtn').setAttribute('aria-pressed', tool === 'eraser');
    $('boardShell').classList.toggle('erasing', tool === 'eraser');
    updateSizeControl();
  }
  function saveToolSettings() {
    try { localStorage.setItem(toolSettingsKey, JSON.stringify({ ...sizes, correction })); }
    catch (_) { notice('도구 설정은 현재 화면에서만 유지됩니다.'); }
  }
  function updateCorrectionControl() {
    $('correctionBtn').setAttribute('aria-pressed', correction);
    $('correctionBtn').textContent = '글씨 보정 ' + (correction ? '켜짐' : '꺼짐');
  }
  $('correctionBtn').onclick = () => {
    correction = !correction;
    updateCorrectionControl();
    setTool('pen');
    saveToolSettings();
  };
  $('penBtn').onclick = () => setTool('pen');
  $('eraserBtn').onclick = () => setTool('eraser');
  document.querySelectorAll('.swatch').forEach(swatch => {
    swatch.onclick = () => {
      color = swatch.dataset.color;
      document.querySelectorAll('.swatch').forEach(item => item.setAttribute('aria-pressed', item === swatch));
      setTool('pen');
    };
  });
  $('sizeRange').oninput = e => {
    sizes[tool] = Number(e.target.value);
    updateSizeControl();
    saveToolSettings();
  };
  $('undoBtn').onclick = () => {
    finish();
    const action = undo.pop() || (strokes.length ? { type: 'stroke', stroke: strokes[strokes.length - 1] } : null);
    if (!action) return;
    if (action.type === 'clear') strokes = action.strokes;
    else strokes.pop();
    redo.push(action);
    persist();
    rebuild();
  };
  $('redoBtn').onclick = () => {
    finish();
    const action = redo.pop();
    if (!action) return;
    if (action.type === 'clear') strokes = [];
    else strokes.push(action.stroke);
    undo.push(action);
    persist();
    rebuild();
  };
  $('clearBtn').onclick = () => {
    finish();
    if (!strokes.length || !confirm('칠판 내용을 모두 지울까요? 되돌리기로 복원할 수 있습니다.')) return;
    undo.push({ type: 'clear', strokes: strokes.slice() });
    strokes = [];
    redo = [];
    persist();
    rebuild();
  };
  $('saveBtn').onclick = () => {
    finish();
    const output = document.createElement('canvas');
    output.width = canvas.width;
    output.height = canvas.height;
    const out = output.getContext('2d');
    const gradient = out.createRadialGradient(output.width * .35, output.height * .15, 0, output.width * .35, output.height * .15, output.width);
    gradient.addColorStop(0, '#24483a');
    gradient.addColorStop(.5, '#17382e');
    gradient.addColorStop(1, '#112a23');
    out.fillStyle = gradient;
    out.fillRect(0, 0, output.width, output.height);
    out.drawImage(canvas, 0, 0);
    output.toBlob(blob => {
      if (!blob) return notice('이미지를 만들지 못했습니다. 다시 시도해 주세요.');
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.download = '칠판-' + new Date().toISOString().slice(0, 10) + '.png';
      link.href = url;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 10000);
      notice('PNG 파일을 만들었습니다.');
    }, 'image/png');
  };
  window.addEventListener('keydown', e => {
    if (!(e.ctrlKey || e.metaKey) || /^(INPUT|TEXTAREA)$/.test(e.target.tagName)) return;
    const key = e.key.toLowerCase();
    if (key === 'z' || key === 'y') {
      e.preventDefault();
      $(key === 'y' || e.shiftKey ? 'redoBtn' : 'undoBtn').click();
    }
  });
  updateSizeControl();
  updateCorrectionControl();
  new ResizeObserver(resize).observe($('boardShell'));
  $('undoBtn').disabled = !strokes.length;
  $('redoBtn').disabled = true;
})();
