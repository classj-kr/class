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
    nature: '나무바다하늘꽃구름',
    school: '학교친구연필책가방',
    sentence: '나는 나를 믿어요',
    custom: '',
  };
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
    redo = [];
  const canvas = $('writingCanvas'),
    ctx = canvas.getContext('2d'),
    modelCanvas = $('modelCanvas');
  function fresh(text, lesson = 'custom', phase = 'trace') {
    return {
      version: 5,
      text,
      lesson,
      phase,
      index: 0,
      guide: true,
      width: 1.5,
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
      raw.version !== 5 ||
      typeof raw.text !== 'string' ||
      raw.text.length > 160 ||
      C.chars(raw.text).length > 48 ||
      !C.supported(raw.text)
    )
      throw Error('저장된 연습을 읽지 못했어요.');
    const next = fresh(
      raw.text,
      presets[raw.lesson] !== undefined ? raw.lesson : 'custom',
      raw.phase === 'solo' ? 'solo' : 'trace',
    );
    next.cells.trace = C.validateCells(raw.text, raw.cells?.trace);
    next.cells.solo = C.validateCells(raw.text, raw.cells?.solo);
    next.index = Math.max(0, Math.min(next.cells.trace.length - 1, Number(raw.index) || 0));
    next.index = Math.floor(next.index);
    next.guide = raw.guide !== false;
    next.width = [1, 1.5, 2.2].includes(raw.width) ? raw.width : 1.5;
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
  function reference(context, char, color) {
    const layout = Reference.layout(char);
    if (!layout) return;
    context.save();
    context.font = `${layout[0]}px PracticeReference`;
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
    path(paint, points, '#000', 12);
    context.drawImage(layer, 0, 0, 100, 100);
  }
  function paper(context, char, strokes, { guide = true, trace = false, next = false } = {}) {
    context.save();
    context.setTransform(context.canvas.width / 100, 0, 0, context.canvas.height / 100, 0, 0);
    context.clearRect(0, 0, 100, 100);
    context.fillStyle = '#fffefa';
    context.fillRect(0, 0, 100, 100);
    if (guide) {
      context.setLineDash([1, 1.5]);
      path(
        context,
        [
          [50, 0],
          [50, 100],
        ],
        '#d8ded1',
        0.35,
      );
      path(
        context,
        [
          [0, 50],
          [100, 50],
        ],
        '#d8ded1',
        0.35,
      );
      context.setLineDash([]);
      context.strokeStyle = '#e3e7dd';
      context.lineWidth = 0.35;
      context.strokeRect(4, 4, 92, 92);
    }
    const paths = C.model(char) || [];
    if (trace && referenceReady) reference(context, char, '#cdd3c7');
    strokes.forEach((s) => path(context, s.points, '#233c34', s.width || doc.width));
    if (next && trace && strokes.length < paths.length) {
      const s = paths[strokes.length];
      context.fillStyle = '#cb763f';
      context.beginPath();
      context.arc(s[0][0], s[0][1], 1.1, 0, Math.PI * 2);
      context.fill();
    }
    context.restore();
  }
  function draw() {
    frame = 0;
    const strokes = [...current()];
    if (active && active.canvas === canvas) strokes.push(active.stroke);
    paper(ctx, letters()[doc.index], strokes, { guide: doc.guide, trace: doc.phase === 'trace', next: true });
  }
  function queueDraw() {
    if (!frame) frame = requestAnimationFrame(draw);
  }
  function drawModel(color = '#27362f') {
    const m = modelCanvas.getContext('2d');
    paper(m, letters()[doc.index], [], { guide: false });
    m.save();
    m.scale(modelCanvas.width / 100, modelCanvas.height / 100);
    if (referenceReady) reference(m, letters()[doc.index], color);
    m.restore();
  }
  function stopDemo() {
    cancelAnimationFrame(demoFrame);
    demoFrame = 0;
    $('demoButton').textContent = '획순';
    drawModel();
  }
  function render() {
    stopDemo();
    const chars = letters(),
      strokes = current(),
      model = C.model(chars[doc.index]);
    $('lessonSelect').value = doc.lesson;
    $('customText').value = doc.text;
    $('customForm').hidden = doc.lesson !== 'custom';
    $('strokeCount').textContent = `${model.length}획`;
    $('guideCheck').checked = doc.guide;
    $('penWidth').value = String(doc.width);
    document.querySelectorAll('[data-phase]').forEach((b) => {
      b.setAttribute('aria-pressed', String(b.dataset.phase === doc.phase));
      b.disabled = inRoom;
    });
    $('progressLabel').textContent = `${doc.index + 1} / ${chars.length}`;
    $('strokeStatus').textContent = strokes.length ? `${strokes.length} / ${model.length}획` : '';
    $('feedback').textContent = '';
    $('feedback').hidden = true;
    const cannotWrite = locked || !referenceReady;
    $('undoButton').disabled = !undo.length || cannotWrite;
    $('redoButton').disabled = !redo.length || cannotWrite;
    for (const id of ['clearButton', 'checkButton', 'demoButton']) $(id).disabled = cannotWrite;
    canvas.setAttribute('aria-disabled', String(cannotWrite));
    canvas.setAttribute('aria-label', `${chars[doc.index]} 글씨 쓰는 칸. ${model.length}획.`);
    $('previousLetter').disabled = doc.index === 0;
    $('nextLetter').disabled = doc.index === chars.length - 1;
    $('letterList').replaceChildren(
      ...chars.map((c, i) => {
        const b = document.createElement('button');
        b.textContent = c;
        b.setAttribute('aria-label', `${i + 1}번째 글자 ${c}`);
        b.setAttribute('aria-current', String(i === doc.index));
        b.classList.toggle('done', doc.cells[doc.phase][i].length > 0);
        b.onclick = () => select(i);
        return b;
      }),
    );
    draw();
    drawModel();
  }
  function select(i) {
    cancel();
    doc.index = i;
    undo = [];
    redo = [];
    render();
    save();
  }
  function cancel() {
    if (active) {
      const old = active.canvas;
      active = null;
      try {
        old.releasePointerCapture?.(old._pointer);
      } catch {}
      queueDraw();
    }
  }
  function record(before, after) {
    undo.push({ index: doc.index, phase: doc.phase, before, after });
    if (undo.length > 80) undo.shift();
    redo = [];
    render();
    save();
  }
  function position(e, target) {
    const r = target.getBoundingClientRect();
    return [
      Math.max(-30, Math.min(130, ((e.clientX - r.left) / r.width) * 100)),
      Math.max(-30, Math.min(130, ((e.clientY - r.top) / r.height) * 100)),
    ].map((v) => Math.round(v * 100) / 100);
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
  function bind(target, test = false) {
    target.addEventListener('pointerdown', (e) => {
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
      if (!test && current().length >= 64) {
        toast('획이 많아요. 이 칸을 지우고 다시 써 주세요.');
        return;
      }
      active = {
        id: e.pointerId,
        canvas: target,
        stroke: { points: [position(e, target)], width: doc.width },
        test,
      };
      target._pointer = e.pointerId;
      try {
        target.setPointerCapture(e.pointerId);
      } catch {}
      if (!test) queueDraw();
    });
    target.addEventListener('pointermove', (e) => {
      detect(e, test);
      if (!active || active.id !== e.pointerId || active.canvas !== target) return;
      e.preventDefault();
      const events = e.getCoalescedEvents?.() || [e];
      for (const p of events.length ? events : [e]) {
        const pos = position(p, target),
          pts = active.stroke.points,
          previous = pts[pts.length - 1];
        if (Math.hypot(pos[0] - previous[0], pos[1] - previous[1]) > 0.25) pts.push(pos);
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
    target.addEventListener('pointerup', (e) => {
      if (!active || active.id !== e.pointerId || active.canvas !== target) return;
      e.preventDefault();
      const a = active;
      const end = position(e, target),
        p = a.stroke.points;
      if (Math.hypot(end[0] - p[p.length - 1][0], end[1] - p[p.length - 1][1]) > 0.1) p.push(end);
      if (p.length > 64) a.stroke.points = C.sample(p, 64);
      active = null;
      try {
        target.releasePointerCapture(e.pointerId);
      } catch {}
      if (!test) {
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
        const result = C.judge(letters()[doc.index], after);
        if (after.length === result.expected)
          $('strokeStatus').textContent = result.order
            ? '획순과 방향을 잘 지켰어요.'
            : '획순 보기와 비교해 보세요.';
      }
    });
    for (const event of ['pointercancel', 'lostpointercapture'])
      target.addEventListener(event, (e) => {
        if (active?.id === e.pointerId && active.canvas === target) cancel();
      });
    target.addEventListener('contextmenu', (e) => e.preventDefault());
  }
  bind(canvas);
  bind($('testCanvas'), true);
  window.addEventListener('blur', cancel);
  window.addEventListener('resize', cancel);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancel();
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
      toast('한글 자모와 한글 낱말·문장을 넣어 주세요. 숫자와 문장 부호는 빼 주세요.');
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
    if (key !== 'custom' && !changeLesson(presets[key], key)) $('lessonSelect').value = doc.lesson;
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
        render();
        save();
      }),
  );
  $('previousLetter').onclick = () => {
    if (doc.index > 0) select(doc.index - 1);
  };
  $('nextLetter').onclick = () => {
    if (doc.index < letters().length - 1) select(doc.index + 1);
  };
  $('guideCheck').onchange = () => {
    doc.guide = $('guideCheck').checked;
    draw();
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
    to.push(a);
    render();
    save();
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
  $('checkButton').onclick = () => {
    cancel();
    $('feedback').hidden = false;
    const r = C.judge(letters()[doc.index], current());
    $('feedback').textContent = !r.actual
      ? '먼저 한 글자를 써 보세요.'
      : r.order
        ? `모양 일치도 ${r.shape}% · 획순과 방향을 지켰어요.`
        : `모양 일치도 ${r.shape}% · ${r.actual}/${r.expected}획. 획순과 방향을 다시 살펴보세요.`;
  };
  $('demoButton').onclick = () => {
    stopDemo();
    const paths = C.model(letters()[doc.index]),
      start = performance.now(),
      m = modelCanvas.getContext('2d');
    $('demoButton').textContent = '재생 중';
    function tick(now) {
      const at = (now - start) / 750,
        index = Math.floor(at);
      drawModel('#d4d9cd');
      m.save();
      m.scale(modelCanvas.width / 100, modelCanvas.height / 100);
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
    const loaded = document.fonts
      .load('100px PracticeReference', '가나다')
      .then((faces) => {
        referenceReady = faces.length > 0;
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
    store.onError(() => {
      saveFailed = true;
      $('saveStatus').textContent = '연결 문제로 저장하지 못했어요.';
      toast('연습을 저장하지 못했어요. 연결을 확인해 주세요.');
    });
    try {
      if (store.has('draft')) {
        const saved = store.get('draft');
        if ([1, 2, 3, 4].includes(saved?.version)) {
          store.set('legacy-draft-v' + saved.version, saved);
          doc = fresh(saved.text, saved.lesson, saved.phase);
        } else doc = normalize(saved);
      }
    } catch {
      toast('이전 연습을 읽지 못해 새 연습장을 열었어요.');
    }
    render();
    if (!referenceReady) toast('글꼴을 불러오지 못했어요. 화면을 다시 열어 주세요.');
    $('saveStatus').textContent = store.persistent
      ? '계정에 자동 저장'
      : '게스트 연습은 이 탭에서만 유지돼요.';
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
      saveKey = 'round-' + key;
      const saved = store.get(saveKey);
      try {
        doc =
          saved && saved.text === text && saved.phase === phase
            ? normalize(saved)
            : fresh(text, 'custom', phase);
      } catch {
        doc = fresh(text, 'custom', phase);
      }
      undo = [];
      redo = [];
      render();
    },
    exitRound() {
      inRoom = false;
      saveKey = 'draft';
      try {
        doc = store.has('draft') ? normalize(store.get('draft')) : fresh(presets.gana, 'gana');
      } catch {
        doc = fresh(presets.gana, 'gana');
      }
      locked = false;
      render();
    },
    cells() {
      cancel();
      return snapshot().cells[doc.phase];
    },
  };
})();
