(() => {
  'use strict';
  const { SIZE, MAX_HEIGHT, createModel } = window.StackingCubes;
  const freeModel = createModel();
  let model = freeModel;
  let challenge = null;
  const activities = window.StackingActivities;
  const sound = (kind, height, column) => window.StackingSounds.play(kind, height, column);
  const $ = id => document.getElementById(id);
  const scene = $('scene');
  const viewButton = $('view-button');
  const panel = $('view-panel');
  const dialog = $('activity-dialog');
  const DEFAULT_YAW = Math.PI / 5;
  const DEFAULT_PITCH = Math.PI / 6;
  let yaw = DEFAULT_YAW;
  let pitch = DEFAULT_PITCH;
  let zoom = 1;
  let view = 'solid';
  let tool = 'add';
  let hovered = null;
  let keyboardCell = null;
  let frame = 0;
  let announcementTimer;
  let feedbackTimer;
  const pointers = new Map();
  let gesture = null;
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const sameCell = (a, b) => a === b || Boolean(a && b && a.x === b.x && a.z === b.z);
  const pointText = points => points.map(point => `${point[0].toFixed(2)},${point[1].toFixed(2)}`).join(' ');
  const polygon = (points, attrs) => `<polygon points="${pointText(points)}" ${attrs}/>`;

  function announce(message) {
    clearTimeout(announcementTimer);
    $('announcement').textContent = '';
    announcementTimer = setTimeout(() => { $('announcement').textContent = message; }, 20);
  }

  function hint() {
    if (view !== 'solid') return '같은 모양을 다른 방향에서 살펴봐요';
    if (tool === 'erase') return '블록을 누르면 맨 위부터 지워요';
    return model.count() ? '칸이나 블록을 눌러 쌓아요 · 드래그해서 돌려요' : '빈칸을 눌러 쌓아요 · 드래그해서 돌려요';
  }

  function feedback(message) {
    clearTimeout(feedbackTimer);
    $('hint').textContent = message;
    announce(message);
    feedbackTimer = setTimeout(() => { $('hint').textContent = hint(); }, 2400);
  }

  function update() {
    $('total').textContent = `전체 ${model.count()}개`;
    $('undo').disabled = !model.canUndo();
    $('clear-board').disabled = model.count() === 0;
    $('hint').textContent = hint();
    updatePractice();
    schedule();
  }

  function edit(cell, change = tool === 'add' ? 1 : -1) {
    if (!cell || view !== 'solid') return;
    if (model.edit(cell.x, cell.z, change)) {
      resetAnswer();
      update();
      sound(change > 0 ? 'add' : 'erase', model.height(cell.x, cell.z), cell.x);
      announce(change > 0 ? '한 층 쌓았습니다.' : '맨 위 블록을 지웠습니다.');
    } else if (change > 0) feedback(`${MAX_HEIGHT}층까지 쌓을 수 있어요`);
    else feedback('이 칸에는 지울 블록이 없어요');
  }

  function undo() {
    if (!model.undo()) return;
    hovered = null;
    resetAnswer();
    update();
    sound('undo');
    announce('되돌렸습니다.');
  }

  function schedule() {
    if (!frame) frame = requestAnimationFrame(() => { frame = 0; render(); });
  }

  function render() {
    const width = scene.clientWidth;
    const height = scene.clientHeight;
    if (!width || !height) return;
    scene.setAttribute('viewBox', `0 0 ${width} ${height}`);
    scene.innerHTML = view === 'solid' ? renderSolid(width, height) : renderProjection(width, height);
    if (challenge) {
      const target = $('target-scene');
      const w = target.clientWidth, h = target.clientHeight;
      target.setAttribute('viewBox', `0 0 ${w} ${h}`);
      target.innerHTML = challenge.mode === 'copy'
        ? renderSolid(w, h, challenge.target, true)
        : renderProjection(w, h, challenge.view, challenge.target, false);
    }
  }

  function renderSolid(width, height, board = model, isTarget = false) {
    const sinY = Math.sin(yaw), cosY = Math.cos(yaw);
    const sinP = Math.sin(pitch), cosP = Math.cos(pitch);
    const rawProject = ([x, y, z]) => [cosY * x - sinY * z, sinP * (sinY * x + cosY * z) - cosP * y];
    const depth = ([x, y, z]) => cosP * (sinY * x + cosY * z) + sinP * y;
    const tallest = Math.max(2, ...board.snapshot());
    const reference = [-2.8, 2.8].flatMap(x => [-.2, tallest].flatMap(y => [-2.8, 2.8].map(z => rawProject([x, y, z]))));
    const minX = Math.min(...reference.map(p => p[0])), maxX = Math.max(...reference.map(p => p[0]));
    const minY = Math.min(...reference.map(p => p[1])), maxY = Math.max(...reference.map(p => p[1]));
    const scale = Math.max(1, Math.min((width - (isTarget ? 30 : 48)) / (maxX - minX), (height - (isTarget ? 35 : 50)) / (maxY - minY), 124)) * (isTarget ? 1 : zoom);
    const cx = width / 2 - (minX + maxX) * scale / 2;
    const cy = height / 2 - (minY + maxY) * scale / 2;
    const project = point => { const p = rawProject(point); return [cx + p[0] * scale, cy + p[1] * scale]; };
    const face = (points, attributes) => polygon(points.map(project), attributes);
    const pieces = [];
    const edge = SIZE / 2 + .08;
    const base = [[-edge, 0, -edge], [edge, 0, -edge], [edge, 0, edge], [-edge, 0, edge]];
    pieces.push('<g aria-hidden="true">');
    pieces.push(polygon(base.map(point => { const p = project(point); return [p[0], p[1] + 13]; }), 'fill="#4a4a3820" stroke="#4a4a3809" stroke-width="10" stroke-linejoin="round"'));
    for (let i = 0; i < 4; i++) {
      const a = base[i], b = base[(i + 1) % 4];
      pieces.push(face([a, b, [b[0], -.19, b[2]], [a[0], -.19, a[2]]], 'fill="#c9c3b0" stroke="#b9b3a1" stroke-width="1"'));
    }
    pieces.push(face(base, 'fill="#ece8db" stroke="#beb9a6" stroke-width="1.3"'));
    for (let z = 0; z < SIZE; z++) for (let x = 0; x < SIZE; x++) {
      const a = x - SIZE / 2, b = z - SIZE / 2;
      pieces.push(face([[a, 0, b], [a + 1, 0, b], [a + 1, 0, b + 1], [a, 0, b + 1]], `class="floor-cell" data-cell="${x},${z}" data-surface="floor"`));
    }
    const frontLine = [[-.4, .005, edge], [.4, .005, edge]].map(project);
    pieces.push(`<polyline points="${pointText(frontLine)}" fill="none" stroke="#477968" stroke-width="4" stroke-linecap="round"/>`);

    const faces = [];
    function addFace(points, color, x, z, surface) {
      const middle = points.reduce((out, point) => out.map((n, i) => n + point[i] / 4), [0, 0, 0]);
      faces.push({ depth: depth(middle), html: face(points, `class="block-face" fill="${color}" data-cell="${x},${z}" data-surface="${surface}"`) });
    }
    for (let z = 0; z < SIZE; z++) for (let x = 0; x < SIZE; x++) {
      const h = board.height(x, z);
      if (!h) continue;
      const a = x - SIZE / 2, b = z - SIZE / 2;
      addFace([[a, h, b], [a + 1, h, b], [a + 1, h, b + 1], [a, h, b + 1]], '#f0cd8b', x, z, 'top');
      for (let y = 0; y < h; y++) {
        if (sinY > .001 && (x === SIZE - 1 || board.height(x + 1, z) <= y)) addFace([[a + 1, y, b], [a + 1, y + 1, b], [a + 1, y + 1, b + 1], [a + 1, y, b + 1]], '#d2a366', x, z, 'side');
        if (sinY < -.001 && (x === 0 || board.height(x - 1, z) <= y)) addFace([[a, y, b], [a, y, b + 1], [a, y + 1, b + 1], [a, y + 1, b]], '#d9ae72', x, z, 'side');
        if (cosY > .001 && (z === SIZE - 1 || board.height(x, z + 1) <= y)) addFace([[a, y, b + 1], [a + 1, y, b + 1], [a + 1, y + 1, b + 1], [a, y + 1, b + 1]], '#e3b97a', x, z, 'side');
        if (cosY < -.001 && (z === 0 || board.height(x, z - 1) <= y)) addFace([[a, y, b], [a, y + 1, b], [a + 1, y + 1, b], [a + 1, y, b]], '#cfa164', x, z, 'side');
      }
    }
    faces.sort((a, b) => a.depth - b.depth);
    pieces.push(...faces.map(item => item.html));
    const selection = !isTarget && (hovered || keyboardCell);
    if (selection && !gesture?.moved) {
      const { x, z } = selection;
      const h = board.height(x, z), a = x - SIZE / 2, b = z - SIZE / 2;
      const color = tool === 'erase' ? '#b56c54' : '#3c7b66';
      pieces.push(face([[a + .04, h + .015, b + .04], [a + .96, h + .015, b + .04], [a + .96, h + .015, b + .96], [a + .04, h + .015, b + .96]], `fill="${color}" fill-opacity=".13" stroke="${color}" stroke-width="2.3" stroke-linejoin="round" pointer-events="none"`));
    }
    const front = project([0, -.08, edge + .44]);
    const right = project([edge + .48, -.08, 0]);
    pieces.push(`<text x="${front[0]}" y="${front[1] + 7}" class="direction-label"${isTarget ? ' style="font-size:11px"' : ''}>앞</text>`);
    if (!isTarget) pieces.push(`<text x="${right[0]}" y="${right[1] + 7}" class="direction-label secondary">오른쪽</text>`);
    pieces.push('</g>');
    return pieces.join('');
  }

  function renderProjection(width, height, direction = view, board = model, showNumbers = $('show-heights').checked) {
    const pieces = ['<g aria-hidden="true">'];
    const top = direction === 'top';
    const projection = board.projection(direction);
    const rows = top ? SIZE : Math.max(3, ...projection);
    const cell = Math.max(1, Math.min((width - (board === model ? 70 : 52)) / SIZE, (height - (board === model ? 70 : 50)) / rows, 91));
    const left = (width - SIZE * cell) / 2, upper = (height - rows * cell) / 2 - 5;
    const boardBottom = upper + rows * cell;
    for (let row = 0; row < rows; row++) for (let col = 0; col < SIZE; col++) {
      const filled = top ? projection[row * SIZE + col] > 0 : projection[col] >= rows - row;
      pieces.push(`<rect x="${left + col * cell}" y="${upper + row * cell}" width="${cell}" height="${cell}" fill="${filled ? '#edc583' : '#eeece3'}" stroke="${filled ? '#a4814d' : '#d5d3c6'}" stroke-width="1.3" data-projection-cell="${col},${row}" data-filled="${filled}"/>`);
      if (top && filled && showNumbers) {
        pieces.push(`<text x="${left + (col + .5) * cell}" y="${upper + (row + .5) * cell}" class="cell-number" font-size="${Math.min(28, cell * .4)}">${board.height(col, row)}</text>`);
      }
    }
    if (top) {
      pieces.push(`<path d="M${width / 2 - 16} ${boardBottom + 1}h32" stroke="#477968" stroke-width="4" stroke-linecap="round"/>`);
      pieces.push(`<text x="${width / 2}" y="${boardBottom + 28}" class="direction-label">앞</text>`);
      pieces.push(`<text x="${left + SIZE * cell + (board === model ? 23 : 18)}" y="${height / 2}" class="direction-label secondary" style="writing-mode:vertical-rl${board === model ? '' : ';font-size:11px'}">오른쪽</text>`);
    } else if (direction === 'right') {
      pieces.push(`<text x="${left + cell / 2}" y="${boardBottom + 28}" class="direction-label">앞쪽</text>`);
    }
    pieces.push('</g>');
    return pieces.join('');
  }

  function resetAnswer() {
    if (!challenge) return;
    challenge.state = 'ready';
    $('challenge-result').textContent = '';
    $('challenge-result').classList.remove('is-success');
  }

  function updatePractice() {
    if (!challenge) return;
    const { mode, index, questions, state, found } = challenge;
    $('challenge-title').textContent = `${activities.names[mode]} · ${index + 1}/${questions.length}`;
    $('challenge-prompt').textContent = mode === 'copy' ? '앞 방향과 칸 위치를 맞춰 쌓아요. 쌓기판을 돌리면 목표도 함께 돌아요.'
      : mode === 'views' ? '위·앞·옆 그림을 모두 살펴보고 쌓아요.' : `세 그림에 맞는 서로 다른 두 모양을 찾아요. (${Math.min(2, found.size)}/2)`;
    $('target-views').hidden = mode === 'copy';
    $('check-shape').textContent = state === 'found' ? '다른 모양 만들기'
      : state === 'solved' ? (index + 1 < questions.length ? '다음 모양' : '활동 선택') : '확인하기';
    const names = { top: '위에서', front: '앞에서', right: '오른쪽에서' };
    $('target-scene').setAttribute('aria-label', mode === 'copy' ? '따라 쌓을 목표 모양' : `목표를 ${names[challenge.view]} 본 그림`);
    document.querySelectorAll('[data-target-view]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.targetView === challenge.view)));
  }

  function startActivity(mode, questions = activities.questions(mode), index = 0, keepHash = false) {
    dialog.close();
    closePanel();
    if (!keepHash && location.hash) history.replaceState(null, '', location.pathname + location.search);
    if (mode === 'free') { model = freeModel; challenge = null; }
    else {
      model = createModel();
      const target = createModel();
      target.replace(questions[index]);
      challenge = { mode, questions, index, target, view: 'top', found: new Set(), state: 'ready' };
      resetAnswer();
    }
    document.querySelector('.workspace').classList.toggle('is-practice', Boolean(challenge));
    $('target-panel').hidden = !challenge;
    $('activity-button').textContent = activities.names[mode];
    tool = 'add';
    document.querySelectorAll('[data-tool]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.tool === tool)));
    yaw = DEFAULT_YAW; pitch = DEFAULT_PITCH; zoom = 1;
    setView('solid');
    scene.focus({ preventScroll: true });
  }

  function openActivities() {
    closePanel();
    library.refresh();
    document.querySelectorAll('[data-mode]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.mode === (challenge?.mode || 'free'))));
    dialog.showModal();
  }

  $('activity-button').addEventListener('click', () => { openActivities(); sound('view'); });
  $('close-activities').addEventListener('click', () => dialog.close());
  document.querySelectorAll('[data-mode]').forEach(button => button.addEventListener('click', () => { startActivity(button.dataset.mode); sound('view'); }));
  document.querySelectorAll('[data-target-view]').forEach(button => button.addEventListener('click', () => {
    if (!challenge) return;
    challenge.view = button.dataset.targetView;
    updatePractice(); schedule(); sound('view');
  }));
  $('check-shape').addEventListener('click', () => {
    if (!challenge) return;
    if (challenge.state === 'solved') {
      if (challenge.index + 1 < challenge.questions.length) startActivity(challenge.mode, challenge.questions, challenge.index + 1);
      else openActivities();
      sound('view'); return;
    }
    if (challenge.state === 'found') {
      // Keep the first answer available to undo while looking for another one.
      model.clear(); resetAnswer(); setView('solid'); sound('clear'); scene.focus(); return;
    }
    const heights = model.snapshot();
    const answer = activities.check(heights, challenge.target.snapshot(), challenge.mode);
    const result = $('challenge-result');
    result.classList.toggle('is-success', answer.correct);
    if (!answer.correct) {
      const names = { top: '위', front: '앞', right: '오른쪽 옆' };
      result.textContent = challenge.mode === 'copy' ? '칸 위치와 각 칸의 높이를 다시 살펴봐요.'
        : `${answer.mismatches.map(name => names[name]).join('·')}에서 본 모습이 달라요. 그 방향을 살펴봐요.`;
      sound('retry');
    } else if (challenge.mode === 'many') {
      const key = heights.join('');
      if (challenge.found.has(key) && challenge.found.size < 2) {
        result.textContent = '이미 찾은 모양이에요. 높이를 바꿔 다른 답을 찾아봐요.';
        result.classList.remove('is-success'); sound('retry');
      } else {
        challenge.found.add(key);
        challenge.state = challenge.found.size >= 2 ? 'solved' : 'found';
        result.textContent = challenge.state === 'solved' ? '성공! 서로 다른 두 모양이 같은 그림에 맞아요.' : '첫 번째 답을 찾았어요! 다른 모양도 만들어 볼까요?';
        sound(challenge.state === 'solved' ? 'success' : 'found');
      }
    } else {
      challenge.state = 'solved';
      result.textContent = challenge.mode === 'copy' ? '성공! 목표와 똑같이 쌓았어요.' : '성공! 세 방향의 모습이 모두 맞아요.';
      sound('success');
    }
    updatePractice();
  });

  function closePanel(returnFocus = false) {
    panel.hidden = true;
    viewButton.setAttribute('aria-expanded', 'false');
    if (returnFocus) viewButton.focus();
  }

  function setView(next) {
    view = next;
    hovered = null;
    keyboardCell = null;
    pointers.clear();
    gesture = null;
    scene.classList.remove('is-dragging');
    scene.classList.toggle('is-observing', view !== 'solid');
    const names = { solid: '입체', top: '위에서 본 모습', front: '앞에서 본 모습', right: '오른쪽에서 본 모습' };
    $('view-label').textContent = names[view];
    $('view-label').hidden = view === 'solid';
    scene.setAttribute('aria-label', view === 'solid' ? '쌓기판' : names[view]);
    scene.setAttribute('aria-describedby', view === 'solid' ? 'hint keyboard-help' : 'hint');
    $('tools').hidden = view !== 'solid';
    $('return-solid').hidden = view === 'solid';
    document.querySelectorAll('[data-view]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.view === view)));
    update();
  }

  viewButton.addEventListener('click', () => {
    panel.hidden = !panel.hidden;
    viewButton.setAttribute('aria-expanded', String(!panel.hidden));
    sound('view');
    hovered = null;
    schedule();
  });
  document.addEventListener('pointerdown', event => {
    if (!panel.hidden && !panel.contains(event.target) && !viewButton.contains(event.target)) closePanel();
  });
  document.querySelectorAll('[data-view]').forEach(button => button.addEventListener('click', () => {
    setView(button.dataset.view);
    closePanel(true);
    sound('view');
  }));
  document.querySelectorAll('[data-tool]').forEach(button => button.addEventListener('click', () => {
    tool = button.dataset.tool;
    document.querySelectorAll('[data-tool]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    update();
    sound('tap');
  }));
  $('return-solid').addEventListener('click', () => { setView('solid'); scene.focus(); sound('view'); });
  $('show-total').addEventListener('change', event => { $('total').hidden = !event.target.checked; });
  $('show-heights').addEventListener('change', event => {
    if (event.target.checked) setView('top');
    schedule();
  });
  $('reset-camera').addEventListener('click', () => {
    yaw = DEFAULT_YAW; pitch = DEFAULT_PITCH; zoom = 1;
    setView('solid'); closePanel(true);
    sound('view');
  });
  $('clear-board').addEventListener('click', () => {
    model.clear(); hovered = null; keyboardCell = null;
    resetAnswer();
    setView('solid'); closePanel(true);
    sound('clear');
    feedback('쌓기판을 비웠어요 · 되돌리기로 복원할 수 있어요');
  });
  $('undo').addEventListener('click', undo);
  $('sound-enabled').checked = !window.StackingSounds.muted();
  $('sound-volume').value = Math.round(window.StackingSounds.volume() * 100);
  $('sound-volume').disabled = !$('sound-enabled').checked;
  $('sound-enabled').addEventListener('change', event => {
    window.StackingSounds.setMuted(!event.target.checked);
    $('sound-volume').disabled = !event.target.checked;
    if (event.target.checked) sound('add', 2);
  });
  $('sound-volume').addEventListener('input', event => window.StackingSounds.setVolume(Number(event.target.value) / 100));
  $('sound-volume').addEventListener('change', () => sound('add', 2));

  function cellFromTarget(target) {
    const element = target.closest?.('[data-cell]');
    if (!element) return null;
    const [x, z] = element.dataset.cell.split(',').map(Number);
    return { x, z };
  }
  function distance() {
    const points = [...pointers.values()];
    return points.length >= 2 ? Math.hypot(points[1].x - points[0].x, points[1].y - points[0].y) : 0;
  }

  scene.addEventListener('pointerdown', event => {
    if (view !== 'solid' || event.button !== 0) return;
    event.preventDefault();
    scene.focus({ preventScroll: true });
    keyboardCell = null;
    const point = { x: event.clientX, y: event.clientY };
    pointers.set(event.pointerId, point);
    scene.setPointerCapture(event.pointerId);
    if (pointers.size === 1) gesture = { start: point, yaw, pitch, moved: false, multiple: false, cell: cellFromTarget(event.target) };
    else {
      gesture.multiple = true;
      gesture.moved = true;
      gesture.distance = distance();
      gesture.zoom = zoom;
    }
  });
  scene.addEventListener('pointermove', event => {
    if (view !== 'solid') return;
    if (!pointers.has(event.pointerId)) {
      if (event.pointerType !== 'mouse') return;
      const cell = cellFromTarget(event.target);
      if (!sameCell(hovered, cell)) { hovered = cell; schedule(); }
      return;
    }
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pointers.size >= 2) {
      if (gesture.distance > 0) zoom = clamp(gesture.zoom * distance() / gesture.distance, .65, 1.65);
    } else if (!gesture.multiple) {
      const dx = event.clientX - gesture.start.x, dy = event.clientY - gesture.start.y;
      if (Math.hypot(dx, dy) > 7) gesture.moved = true;
      if (gesture.moved) {
        yaw = gesture.yaw + dx * .008;
        pitch = clamp(gesture.pitch + dy * .006, .22, 1.22);
        scene.classList.add('is-dragging');
      }
    }
    hovered = null;
    schedule();
  });
  function endPointer(event, cancelled) {
    if (!pointers.has(event.pointerId)) return;
    const tap = !cancelled && pointers.size === 1 && gesture && !gesture.moved && !gesture.multiple;
    const cell = gesture?.cell;
    pointers.delete(event.pointerId);
    if (scene.hasPointerCapture(event.pointerId)) scene.releasePointerCapture(event.pointerId);
    if (!pointers.size) { gesture = null; scene.classList.remove('is-dragging'); }
    if (tap) edit(cell);
    hovered = null;
    schedule();
  }
  scene.addEventListener('pointerup', event => endPointer(event, false));
  scene.addEventListener('pointercancel', event => endPointer(event, true));
  scene.addEventListener('lostpointercapture', event => endPointer(event, true));
  scene.addEventListener('pointerleave', () => { if (!pointers.size) { hovered = null; schedule(); } });
  scene.addEventListener('wheel', event => {
    if (view !== 'solid' || event.ctrlKey || event.metaKey) return;
    event.preventDefault();
    zoom = clamp(zoom * Math.exp(-event.deltaY * .001), .65, 1.65);
    hovered = null; schedule();
  }, { passive: false });

  scene.addEventListener('keydown', event => {
    if (view !== 'solid' || event.ctrlKey || event.metaKey || event.altKey) return;
    const deltas = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
    if (deltas[event.key]) {
      event.preventDefault();
      const current = keyboardCell || { x: 2, z: 2 };
      const [dx, dz] = deltas[event.key];
      keyboardCell = { x: clamp(current.x + dx, 0, SIZE - 1), z: clamp(current.z + dz, 0, SIZE - 1) };
      hovered = null; schedule();
      announce(`왼쪽에서 ${keyboardCell.x + 1}번째, 뒤에서 ${keyboardCell.z + 1}번째 칸, ${model.height(keyboardCell.x, keyboardCell.z)}층.`);
    } else if (['Enter', ' ', 'Delete', 'Backspace'].includes(event.key)) {
      event.preventDefault();
      keyboardCell ||= { x: 2, z: 2 };
      edit(keyboardCell, ['Delete', 'Backspace'].includes(event.key) ? -1 : (tool === 'erase' ? -1 : 1));
    }
  });
  scene.addEventListener('blur', () => { keyboardCell = null; schedule(); });
  document.addEventListener('keydown', event => {
    if (dialog.open) return;
    if (event.key === 'Escape' && !panel.hidden) { closePanel(true); event.preventDefault(); }
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'z' && !event.shiftKey) {
      if (event.target.matches('input:not([type="checkbox"]), textarea, [contenteditable="true"]')) return;
      event.preventDefault(); undo();
    }
  });
  window.addEventListener('sitebackrequest', event => {
    if (dialog.open) { event.preventDefault(); dialog.close(); }
    else if (!panel.hidden) { event.preventDefault(); closePanel(true); }
    else if (challenge) { event.preventDefault(); startActivity('free'); }
  });
  const library = window.StackingLibrary({
    snapshot: () => model.snapshot(), sound,
    load: heights => { freeModel.replace(heights); startActivity('free'); sound('save'); }
  });
  function openShared() {
    if (!location.hash) return;
    const shared = activities.decode(location.hash);
    if (!shared) { feedback('모양 링크가 올바르지 않아요. 링크 전체를 다시 확인해 주세요.'); return; }
    if (shared.mode === 'free') { freeModel.replace(shared.heights); startActivity('free', [], 0, true); }
    else startActivity(shared.mode, [shared.heights], 0, true);
  }
  window.addEventListener('hashchange', openShared);
  new ResizeObserver(schedule).observe(scene.parentElement);
  update();
  openShared();
})();
