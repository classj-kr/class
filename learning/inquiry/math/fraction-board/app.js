(() => {
  'use strict';
  const C = window.FractionBoard, $ = id => document.getElementById(id);
  const copy = value => JSON.parse(JSON.stringify(value));
  let state = { version: 1, cards: [C.makeCard('first')], selectedId: 'first' };
  let undo = [], redo = [], store, edited = false, generation = 0, saveQueue = Promise.resolve(), saveFailed = false;
  const current = () => state.cards.find(c => c.id === state.selectedId);
  const maxUnits = () => Math.max(...state.cards.map(c => c.units));
  const message = value => { $('edit-message').textContent = value; };
  const saveStatus = (value, error = false) => { $('save-status').textContent = value; $('save-status').dataset.error = String(error); };
  function persist() {
    edited = true;
    if (!store) return;
    if (!store.persistent) { saveStatus('이 탭에서 사용 중'); return; }
    const snapshot = copy(state), revision = ++generation;
    saveStatus('저장 중…');
    saveQueue = saveQueue.then(async () => {
      if (revision !== generation) return;
      saveFailed = false;
      store.set('board', snapshot);
      await store.flush();
      if (revision === generation && !saveFailed) saveStatus('계정에 자동 저장됨');
    }).catch(() => saveStatus('저장하지 못했어요. 그림 저장을 이용해 주세요.', true));
  }
  function render() {
    const c = current(), active = document.activeElement?.closest('[data-cell]');
    const focus = active ? { card: active.closest('[data-card]').dataset.card, cell: active.dataset.cell } : null;
    $('cards').dataset.count = state.cards.length;
    $('cards').innerHTML = state.cards.map((card, i) => {
      const letter = String.fromCharCode(65 + i), n = C.count(card), mixed = C.mixed(card);
      return `<article class="fraction-card${card.id === state.selectedId ? ' selected' : ''}" data-card="${card.id}" aria-label="그림 ${letter}, ${C.SHAPES[card.shape]}">
        <div class="card-heading"><button type="button" class="card-title" data-action="select" aria-label="그림 ${letter} 설정" aria-pressed="${card.id === state.selectedId}"><span class="card-letter">${letter}</span><span class="card-name">${C.SHAPES[card.shape]}</span></button>
        <div class="card-value">${card.labels ? `<span class="fraction-number" aria-label="${card.denominator}분의 ${n}"><span>${n}</span><span>${card.denominator}</span></span>${mixed ? `<span class="mixed-number">= ${mixed}</span>` : ''}` : '<span class="hidden-value">분수 숨김</span>'}</div>
        <div class="card-actions"><button type="button" data-action="duplicate" aria-label="그림 ${letter} 복제" ${state.cards.length >= C.MAX_CARDS ? 'disabled' : ''}>복제</button><button type="button" class="remove" data-action="remove" aria-label="그림 ${letter} 삭제" ${state.cards.length === 1 ? 'disabled' : ''}>×</button></div></div>
        ${C.drawing(card, maxUnits())}<p class="card-caption">${card.shape === 'line' ? '눈금을 눌러 위치를 표시해요' : card.shading ? '한 번 누르면 색칠 · 다시 누르면 지우기' : '색칠을 숨겨 두었어요'}</p></article>`;
    }).join('');
    $('editing-label').textContent = '그림 ' + String.fromCharCode(65 + state.cards.indexOf(c));
    document.querySelectorAll('[data-shape]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.shape === c.shape)));
    $('numerator').value = C.count(c); $('numerator').max = c.denominator * C.MAX_UNITS;
    $('denominator').value = c.denominator; $('units').value = c.units;
    $('grid-label').hidden = $('grid-rows').hidden = c.shape !== 'grid';
    $('grid-rows').innerHTML = Array.from({ length: c.denominator }, (_, i) => i + 1).filter(rows => c.denominator % rows === 0).map(rows => `<option value="${rows}">${rows}행 × ${c.denominator / rows}열</option>`).join('');
    $('grid-rows').value = c.rows;
    ['lines', 'shading', 'labels'].forEach(key => { $('show-' + key).checked = c[key]; });
    document.querySelectorAll('[data-color]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.color === c.color)));
    $('clear-shading').disabled = C.count(c) === 0;
    $('add-card').disabled = state.cards.length >= C.MAX_CARDS;
    $('undo').disabled = !undo.length; $('redo').disabled = !redo.length;
    if (focus) {
      const target = document.querySelector(`[data-card="${focus.card}"] [data-cell="${focus.cell}"]`);
      if (target) { setRoving(target); target.focus({ preventScroll: true }); }
    }
  }
  function commit(transform) {
    try {
      const next = C.validate(transform(copy(state)));
      message('');
      if (JSON.stringify(next) === JSON.stringify(state)) { render(); return; }
      undo.push(copy(state)); if (undo.length > 60) undo.shift();
      redo = []; state = next; render(); persist();
    } catch (error) { render(); message(error.message); }
  }
  function update(transform) { commit(next => { next.cards = next.cards.map(c => c.id === next.selectedId ? transform(c) : c); return next; }); }
  function select(id) { if (state.selectedId === id) return; state.selectedId = id; message(''); render(); }
  function history(direction) {
    const source = direction === 'undo' ? undo : redo, dest = direction === 'undo' ? redo : undo;
    if (!source.length) return;
    dest.push(copy(state)); state = source.pop(); message(''); render(); persist();
  }
  function add(blank, sourceId = state.selectedId) {
    if (state.cards.length >= C.MAX_CARDS) return;
    commit(next => {
      const card = copy(next.cards.find(c => c.id === sourceId));
      card.id = crypto.randomUUID();
      if (blank) { card.cells = []; card.units = 1; }
      next.cards.push(card); next.selectedId = card.id;
      return next;
    });
    document.querySelector(`[data-card="${state.selectedId}"]`).scrollIntoView({ block: 'nearest' });
  }
  function setRoving(target) {
    const svg = target.closest('svg');
    svg.querySelectorAll('[data-cell]').forEach(piece => piece.setAttribute('tabindex', piece === target ? '0' : '-1'));
  }
  $('colors').innerHTML = C.COLORS.map((color, i) => `<button type="button" class="color-button" data-color="${color}" style="--swatch:${color}" aria-label="${['초록', '주황', '파랑', '분홍', '보라'][i]}" aria-pressed="${i === 0}"></button>`).join('');
  document.querySelectorAll('[data-shape]').forEach(button => button.addEventListener('click', () => update(c => C.changeShape(c, button.dataset.shape))));
  document.querySelectorAll('[data-color]').forEach(button => button.addEventListener('click', () => update(c => ({ ...c, color: button.dataset.color }))));
  $('numerator').addEventListener('change', () => { const n = $('numerator').valueAsNumber; update(c => C.setFraction(c, n, c.denominator)); });
  $('denominator').addEventListener('change', () => { const d = $('denominator').valueAsNumber; update(c => C.setDenominator(c, d, $('keep-amount').checked)); });
  $('units').addEventListener('change', () => { const units = Number($('units').value); update(c => C.setUnits(c, units)); });
  $('grid-rows').addEventListener('change', () => { const rows = Number($('grid-rows').value); update(c => ({ ...c, rows })); });
  ['lines', 'shading', 'labels'].forEach(key => $('show-' + key).addEventListener('change', () => { const value = $('show-' + key).checked; update(c => ({ ...c, [key]: value })); }));
  $('clear-shading').addEventListener('click', () => update(c => ({ ...c, cells: [] })));
  $('add-card').addEventListener('click', () => add(true));
  $('undo').addEventListener('click', () => history('undo'));
  $('redo').addEventListener('click', () => history('redo'));
  function showSettings(show) {
    $('inspector').hidden = !show;
    document.querySelector('.workspace').classList.toggle('settings-hidden', !show);
    $('toggle-settings').setAttribute('aria-expanded', String(show));
    $('toggle-settings').textContent = show ? '설정 접기' : '그림 설정';
  }
  $('toggle-settings').addEventListener('click', () => {
    showSettings($('inspector').hidden);
    if ($('inspector').hidden) $('toggle-settings').scrollIntoView({ block: 'nearest' });
    else if (innerWidth <= 600) $('inspector').scrollIntoView({ block: 'start' });
  });
  $('cards').addEventListener('click', event => {
    const article = event.target.closest('[data-card]');
    if (!article) return;
    const id = article.dataset.card, button = event.target.closest('[data-action]'), piece = event.target.closest('[data-cell]');
    if (button?.disabled) return;
    if (button?.dataset.action === 'duplicate') { add(false, id); return; }
    if (button?.dataset.action === 'remove') {
      if (state.cards.length === 1) return;
      commit(next => { const index = next.cards.findIndex(c => c.id === id); next.cards.splice(index, 1); if (next.selectedId === id) next.selectedId = next.cards[Math.min(index, next.cards.length - 1)].id; return next; });
      return;
    }
    if (piece) {
      const index = Number(piece.dataset.cell);
      commit(next => { next.selectedId = id; next.cards = next.cards.map(c => c.id === id ? C.paint(c, index) : c); return next; });
    } else select(id);
  });
  $('cards').addEventListener('keydown', event => {
    const piece = event.target.closest('[data-cell]');
    if (!piece) return;
    if (['Enter', ' '].includes(event.key)) { event.preventDefault(); piece.dispatchEvent(new MouseEvent('click', { bubbles: true })); return; }
    const card = state.cards.find(c => c.id === piece.closest('[data-card]').dataset.card);
    const list = [...piece.closest('svg').querySelectorAll('[data-cell]')], index = list.indexOf(piece), row = card.shape === 'grid' ? card.denominator / card.rows : 1;
    const delta = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: row, ArrowUp: -row }[event.key];
    if (delta === undefined && !['Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const target = list[event.key === 'Home' ? 0 : event.key === 'End' ? list.length - 1 : Math.max(0, Math.min(list.length - 1, index + delta))];
    setRoving(target); target.focus({ preventScroll: true });
  });
  document.addEventListener('keydown', event => {
    if (!(event.ctrlKey || event.metaKey) || event.target.closest('input,select,textarea,[contenteditable=true]')) return;
    if (event.key.toLowerCase() === 'z') { event.preventDefault(); history(event.shiftKey ? 'redo' : 'undo'); }
    if (event.key.toLowerCase() === 'y') { event.preventDefault(); history('redo'); }
  });
  $('fullscreen').hidden = !document.fullscreenEnabled;
  $('fullscreen').addEventListener('click', async () => {
    try { if (document.fullscreenElement) await document.exitFullscreen(); else await document.documentElement.requestFullscreen(); }
    catch (_) { message('이 브라우저에서 전체 화면을 열지 못했어요.'); }
  });
  let settingsBeforeFullscreen = true;
  document.addEventListener('fullscreenchange', () => {
    const full = !!document.fullscreenElement;
    $('fullscreen').setAttribute('aria-pressed', String(full)); $('fullscreen').textContent = full ? '전체 화면 닫기' : '전체 화면';
    if (full) { settingsBeforeFullscreen = !$('inspector').hidden; showSettings(false); }
    else showSettings(settingsBeforeFullscreen);
  });
  $('export-open').addEventListener('click', () => { $('export-status').textContent = ''; $('export-dialog').showModal(); });
  function encodeWebP(image) {
    return new Promise((resolve, reject) => {
      const worker = new Worker('export-worker.js?v=20261015-1', { type: 'module' });
      const done = (error, buffer) => { clearTimeout(timer); worker.terminate(); error ? reject(error) : resolve(buffer); };
      const timer = setTimeout(() => done(Error('그림 저장 시간이 초과되었어요. 그림을 나누어 저장해 주세요.')), 60000);
      worker.onmessage = event => done(event.data.error ? Error(event.data.error) : null, event.data.buffer);
      worker.onerror = () => done(Error('그림 저장 도구를 불러오지 못했어요. 새로고침한 뒤 다시 시도해 주세요.'));
      worker.postMessage({ width: image.width, height: image.height, data: image.data.buffer }, [image.data.buffer]);
    });
  }
  $('export-webp').addEventListener('click', async () => {
    const button = $('export-webp'); button.disabled = true; $('export-status').textContent = '그림을 저장하고 있어요…';
    let sourceUrl, downloadUrl;
    try {
      const selectedOnly = document.querySelector('input[name=export-scope]:checked').value === 'selected';
      const cards = copy(selectedOnly ? [current()] : state.cards);
      sourceUrl = URL.createObjectURL(new Blob([C.exportSVG(cards, $('transparent').checked, maxUnits())], { type: 'image/svg+xml' }));
      const image = new Image(); image.src = sourceUrl; await image.decode();
      const canvas = document.createElement('canvas'); canvas.width = image.naturalWidth; canvas.height = image.naturalHeight;
      const ctx = canvas.getContext('2d'); ctx.drawImage(image, 0, 0);
      const buffer = await encodeWebP(ctx.getImageData(0, 0, canvas.width, canvas.height));
      downloadUrl = URL.createObjectURL(new Blob([buffer], { type: 'image/webp' }));
      const link = document.createElement('a'); link.href = downloadUrl; link.download = '분수-그림판.webp'; document.body.append(link); link.click(); link.remove();
      $('export-status').textContent = '저장했어요. 다운로드한 그림을 학습지에 넣어 보세요.';
    } catch (error) { $('export-status').textContent = error.message || '그림을 저장하지 못했어요. 다시 시도해 주세요.'; }
    finally { if (sourceUrl) URL.revokeObjectURL(sourceUrl); if (downloadUrl) { const url = downloadUrl; setTimeout(() => URL.revokeObjectURL(url), 30000); } button.disabled = false; }
  });
  render();
  window.SiteStorage.open('fraction-board').then(opened => {
    store = opened;
    store.onError(() => { saveFailed = true; saveStatus('저장하지 못했어요. 그림 저장을 이용해 주세요.', true); });
    if (!edited && store.get('board')) {
      try { state = C.validate(store.get('board')); render(); }
      catch (_) { message('이전 그림을 읽지 못해서 새 그림으로 열었어요.'); }
    }
    if (edited) persist();
    else saveStatus(store.persistent ? '계정에 자동 저장' : '이 탭에서 사용 중');
  }).catch(() => saveStatus('이 탭에서 사용 중'));
})();
