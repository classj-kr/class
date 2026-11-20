(() => {
  'use strict';
  const C = window.NumberModels, $ = id => document.getElementById(id);
  const copy = value => JSON.parse(JSON.stringify(value));
  let state = C.initial(), undo = [], redo = [], busy = false;
  let store, edited = false, generation = 0, failed = false, saveQueue = Promise.resolve();
  const scene = () => state.scenes[state.mode];
  const allowed = action => { try { action(); return true; } catch (_) { return false; } };
  const message = (text, error = false) => { $('message').textContent = text; $('message').dataset.error = String(error); $('message').hidden = !error; };
  const saveStatus = (text, error = false) => { $('save-status').textContent = text; $('save-status').dataset.error = String(error); $('save-status').hidden = !error; };
  let fitFrame;
  function fitModelsNow(animate = false) {
    const columns = $('columns');
    if (!columns) return;
    if (C.rows(state).length > 1 || innerWidth <= 900) {
      // 줄이 여럿이면 모든 줄이 같은 배율(CSS 값)을 쓴다: 한 줄일 때 붙여 둔 배율이 처음 줄에 남지 않게 전부 뗀다.
      document.querySelectorAll('.columns').forEach(c => c.style.removeProperty('--model-zoom'));
      return;
    }
    const clouds = [...columns.querySelectorAll('.block-cloud')];
    if (!clouds.some(c => c.clientHeight > 0)) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const doAnimate = animate && !reduced;
    let prevScale = null;
    const firstRects = new Map();
    if (doAnimate) {
      const sample = columns.querySelector('.block:not(.is-leaving) svg');
      if (sample) prevScale = sample.getBoundingClientRect().width / Number(sample.getAttribute('width'));
      columns.querySelectorAll('.place-column').forEach(col => {
        const colIdx = col.dataset.index;
        [...col.querySelectorAll('.block:not(.is-leaving) svg')].forEach((svg, k) => {
          firstRects.set(`${colIdx}:${k}`, svg.getBoundingClientRect());
        });
      });
      columns.getAnimations({ subtree: true }).forEach(a => {
        if (a.effect?.target?.tagName?.toLowerCase() === 'svg') a.cancel();
      });
    }
    const boxes = clouds.flatMap(cloud => {
      const block = cloud.querySelector('.block'), svg = block?.querySelector('svg');
      if (!svg) return [];
      const style = getComputedStyle(cloud), blockStyle = getComputedStyle(block);
      return [{
        count: cloud.children.length,
        width: cloud.getBoundingClientRect().width - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight),
        height: cloud.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom),
        blockWidth: Number(svg.getAttribute('width')), blockHeight: Number(svg.getAttribute('height')),
        insetX: parseFloat(blockStyle.paddingLeft) + parseFloat(blockStyle.paddingRight),
        insetY: parseFloat(blockStyle.paddingTop) + parseFloat(blockStyle.paddingBottom),
        gapX: parseFloat(style.columnGap), gapY: parseFloat(style.rowGap)
      }];
    });
    // Keep the same unit length in every place; never shrink one shape independently.
    const fits = scale => boxes.every(box => {
      const width = box.blockWidth * scale + box.insetX;
      const perRow = Math.max(1, Math.floor((box.width + box.gapX) / (width + box.gapX)));
      const rows = Math.ceil(box.count / perRow);
      return width <= box.width && rows * (box.blockHeight * scale + box.insetY) + (rows - 1) * box.gapY <= box.height - 1;
    });
    let scale = 150;
    while (scale > 80 && !fits(scale / 100)) scale--;
    const nextZoom = scale / 100;
    const prevZoom = parseFloat(columns.style.getPropertyValue('--model-zoom'));
    columns.style.setProperty('--model-zoom', nextZoom);
    if (doAnimate && prevScale && Math.abs(prevZoom - nextZoom) > 0.004) {
      const sample = columns.querySelector('.block:not(.is-leaving) svg');
      const newScale = sample ? sample.getBoundingClientRect().width / Number(sample.getAttribute('width')) : nextZoom;
      const s = newScale ? prevScale / newScale : 1;
      const scaleChanged = Math.abs(s - 1) > 0.004;
      const fromScale = scaleChanged ? s.toFixed(5) : '1';
      columns.querySelectorAll('.place-column').forEach(col => {
        const colIdx = col.dataset.index;
        [...col.querySelectorAll('.block:not(.is-leaving) svg')].forEach((svg, k) => {
          const first = firstRects.get(`${colIdx}:${k}`);
          const last = svg.getBoundingClientRect();
          const dx = first ? first.left - last.left : 0;
          const dy = first ? first.top - last.top : 0;
          if (scaleChanged || Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
            svg.style.transformOrigin = '0 0';
            svg.animate(
              [
                { transform: `translate(${dx.toFixed(2)}px, ${dy.toFixed(2)}px) scale(${fromScale})` },
                { transform: 'translate(0px, 0px) scale(1)' }
              ],
              { duration: 220, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' }
            );
          }
        });
      });
    }
  }
  function fitModels() {
    cancelAnimationFrame(fitFrame);
    fitModelsNow(false);
    fitFrame = requestAnimationFrame(() => fitModelsNow(false));
  }
  function spawnGhost(block) {
    if (!block || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const svg = block.querySelector('svg');
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const ghost = svg.cloneNode(true);
    ghost.classList.add('block-ghost');
    ghost.style.left = `${rect.left}px`;
    ghost.style.top = `${rect.top}px`;
    ghost.style.width = `${rect.width}px`;
    ghost.style.height = `${rect.height}px`;
    ghost.style.transformOrigin = 'center center';
    document.body.append(ghost);
    setTimeout(() => ghost.remove(), 240);
  }
  function syncModelRows(list, mode, info, indexes, motion) {
    const container = $('model-rows');
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const firstRects = new Map(), prevScales = new Map(), oldCounts = new Map();
    if (!reduced && container.children.length) {
      [...container.querySelectorAll('.model-row')].forEach(sec => {
        const rIdx = Number(sec.dataset.row);
        const sample = sec.querySelector('.block:not(.is-leaving) svg');
        if (sample) {
          const w = Number(sample.getAttribute('width'));
          if (w) prevScales.set(rIdx, sample.getBoundingClientRect().width / w);
        } else {
          const cols = sec.querySelector('.columns');
          const z = cols ? parseFloat(getComputedStyle(cols).getPropertyValue('--model-zoom')) : 0;
          if (z) prevScales.set(rIdx, z);
        }
        sec.querySelectorAll('.place-column').forEach(col => {
          const cIdx = Number(col.dataset.index);
          const blocks = [...col.querySelector('.block-cloud').children];
          oldCounts.set(`${rIdx}:${cIdx}`, blocks.length);
          blocks.forEach((b, k) => {
            if (b.classList.contains('is-leaving')) return;
            const svg = b.querySelector('svg');
            if (svg) firstRects.set(`${rIdx}:${cIdx}:${k}`, svg.getBoundingClientRect());
          });
        });
      });
      if (motion?.type === 'remove') {
        const targetCloud = container.querySelector(`.model-row[data-row="${motion.row}"] .place-column[data-index="${motion.index}"] .block-cloud`);
        spawnGhost(targetCloud?.lastElementChild);
      }
      container.getAnimations({ subtree: true }).forEach(a => {
        if (a.effect?.target?.tagName?.toLowerCase() === 'svg') a.cancel();
      });
    }
    while (container.children.length > list.length) container.lastElementChild.remove();
    list.forEach((row, rowIndex) => {
      const active = rowIndex === state.selected[mode], label = `수 ${String.fromCharCode(65 + rowIndex)}`;
      let sec = container.children[rowIndex];
      if (!sec) {
        sec = document.createElement('section');
        sec.innerHTML = `<div class="row-heading"><button type="button" data-select-row=""><span class="row-label"></span><span class="row-total"></span></button><button type="button" data-remove-row="">삭제</button></div><div class="columns"></div>`;
        container.append(sec);
      }
      sec.className = 'model-row' + (active ? ' selected' : '');
      sec.dataset.row = String(rowIndex);
      sec.setAttribute('aria-label', label);
      const heading = sec.querySelector('.row-heading');
      heading.hidden = list.length === 1;
      const selectBtn = heading.querySelector('[data-select-row]');
      selectBtn.dataset.selectRow = String(rowIndex);
      selectBtn.setAttribute('aria-pressed', String(active));
      selectBtn.querySelector('.row-label').textContent = label;
      selectBtn.querySelector('.row-total').textContent = state.showTotal ? C.format(C.total(row.counts), mode) : '?';
      const removeBtn = heading.querySelector('[data-remove-row]');
      removeBtn.dataset.removeRow = String(rowIndex);
      removeBtn.setAttribute('aria-label', `${label} 삭제`);
      const columns = sec.querySelector('.columns');
      if (!active && columns.id === 'columns') columns.removeAttribute('id');
    });
    list.forEach((row, rowIndex) => {
      const active = rowIndex === state.selected[mode];
      const sec = container.children[rowIndex];
      const columns = sec.querySelector('.columns');
      if (active) columns.id = 'columns';
      columns.style.setProperty('--places', String(indexes.length));
      [...columns.querySelectorAll('.place-column')].forEach(col => {
        if (!indexes.includes(Number(col.dataset.index))) col.remove();
      });
      indexes.forEach((i, pos) => {
        const n = row.counts[i], bundle = allowed(() => C.exchange(row, i, 'bundle', mode)), split = allowed(() => C.exchange(row, i, 'split', mode));
        let col = columns.querySelector(`.place-column[data-index="${i}"]`);
        if (!col) {
          col = document.createElement('article');
          col.className = 'place-column';
          col.dataset.index = String(i);
          col.innerHTML = `<div class="place-heading" tabindex="-1"><div class="place-value"><h2></h2><span class="place-name"></span></div><div class="counter-buttons"><button type="button" data-action="remove">−</button><span class="count"><b></b>개</span><button type="button" data-action="add">＋</button></div></div><div class="block-cloud" data-shape="${i}" role="img"></div><div class="exchange-buttons"><button type="button" data-action="bundle">← 10개 묶기</button><button type="button" data-action="split">1개 풀기 →</button></div>`;
        }
        if (columns.children[pos] !== col) columns.insertBefore(col, columns.children[pos] || null);
        col.classList.remove('is-exchanged');
        col.setAttribute('aria-label', `${info.values[i]} 모형 ${n}개`);
        col.querySelector('.place-value h2').textContent = info.values[i];
        col.querySelector('.place-name').textContent = info.labels[i];
        const remBtn = col.querySelector('[data-action="remove"]');
        remBtn.setAttribute('aria-label', `${info.values[i]} 모형 1개 지우기`);
        remBtn.disabled = !n;
        col.querySelector('.count b').textContent = String(n);
        const addBtn = col.querySelector('[data-action="add"]');
        addBtn.setAttribute('aria-label', `${info.values[i]} 모형 1개 놓기`);
        addBtn.disabled = !allowed(() => C.add(row, i, 1, mode));
        const cloud = col.querySelector('.block-cloud');
        cloud.setAttribute('aria-label', `${info.values[i]} 모형 ${n}개`);
        [...cloud.children].forEach(b => b.classList.remove('is-leaving', 'is-arriving'));
        while (cloud.children.length > n) cloud.lastElementChild.remove();
        while (cloud.children.length < n) {
          const span = document.createElement('span');
          span.className = 'block';
          span.setAttribute('aria-hidden', 'true');
          span.innerHTML = C.blockSVG(i);
          cloud.append(span);
        }
        const bundleBtn = col.querySelector('[data-action="bundle"]');
        bundleBtn.title = indexes.includes(i - 1) ? info.values[i - 1] + ' 모형 1개로 묶기' : '가장 큰 자리';
        bundleBtn.disabled = !bundle;
        const splitBtn = col.querySelector('[data-action="split"]');
        splitBtn.title = indexes.includes(i + 1) ? info.values[i + 1] + ' 모형 10개로 풀기' : '가장 작은 자리';
        splitBtn.disabled = !split;
      });
    });
    fitModelsNow(false);
    if (!reduced && prevScales.size > 0) {
      [...container.querySelectorAll('.model-row')].forEach(sec => {
        const rIdx = Number(sec.dataset.row);
        const prevScale = prevScales.get(rIdx);
        const sample = sec.querySelector('.block svg');
        if (!sample || !prevScale) return;
        const w = Number(sample.getAttribute('width'));
        const newScale = w ? sample.getBoundingClientRect().width / w : 0;
        if (!newScale) return;
        const s = prevScale / newScale;
        const scaleChanged = Math.abs(s - 1) > 0.004;
        const fromScale = scaleChanged ? s.toFixed(5) : '1';
        sec.querySelectorAll('.place-column').forEach(col => {
          const cIdx = Number(col.dataset.index);
          const oldCount = oldCounts.get(`${rIdx}:${cIdx}`) ?? 0;
          [...col.querySelector('.block-cloud').children].forEach((block, k) => {
            const svg = block.querySelector('svg');
            if (!svg) return;
            const first = firstRects.get(`${rIdx}:${cIdx}:${k}`);
            let dx = 0, dy = 0;
            if (first) {
              const last = svg.getBoundingClientRect();
              dx = first.left - last.left;
              dy = first.top - last.top;
            } else if (k >= oldCount && motion && (motion.type === 'add' || motion.type === 'exchange')) {
              dy = -10;
              if (motion.type === 'add') block.classList.add('is-arriving');
            }
            if (scaleChanged || Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
              svg.style.transformOrigin = '0 0';
              svg.animate(
                [
                  { transform: `translate(${dx.toFixed(2)}px, ${dy.toFixed(2)}px) scale(${fromScale})` },
                  { transform: 'translate(0px, 0px) scale(1)' }
                ],
                { duration: 240, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' }
              );
            }
          });
        });
      });
    }
  }
  function persist() {
    edited = true;
    if (!store) return;
    if (!store.persistent) { saveStatus('이 탭에서 사용 중'); return; }
    const snapshot = copy(state), revision = ++generation;
    saveStatus('저장 중…');
    saveQueue = saveQueue.then(async () => {
      if (revision !== generation) return;
      failed = false; store.set('board', snapshot); await store.flush();
      if (revision === generation && !failed) saveStatus('계정에 자동 저장됨');
    }).catch(() => saveStatus('저장하지 못했어요. 잠시 후 다시 조작하면 재시도해요.', true));
  }
  function render(motion = null) {
    const s = scene(), mode = state.mode, info = C.MODES[mode], indexes = C.visible(mode, s.places);
    const focused = document.activeElement?.closest('#columns [data-action]');
    const focus = focused ? { index: focused.closest('[data-index]').dataset.index, action: focused.dataset.action } : null;
    document.querySelectorAll('[data-mode]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.mode === mode)));
    $('total').textContent = state.showTotal ? C.format(C.total(s.counts), mode) : '?';
    $('total').classList.toggle('hidden-total', !state.showTotal);
    $('expression').textContent = state.showTotal ? C.expression(s, mode) : '';
    if ($('unit-model').dataset.mode !== mode) {
      $('unit-model').innerHTML = C.blockSVG(mode === 'whole' ? 3 : 0);
      $('unit-model').dataset.mode = mode;
    }
    $('unit-label').textContent = mode === 'whole' ? '작은 정육면체 1개 = 1' : '큰 정육면체 1개 = 1';
    $('number-input').value = C.format(C.total(s.counts), mode);
    $('number-form').hidden = !state.showTotal;
    $('number-input').inputMode = mode === 'whole' ? 'numeric' : 'decimal';
    $('number-help').textContent = mode === 'whole' ? '0부터 9999까지' : '0부터 9.999까지 · 소수 셋째 자리까지';
    if ($('places').dataset.mode !== mode) {
      $('places').innerHTML = [2, 3, 4].map(n => `<option value="${n}">${C.visible(mode, n).map(i => mode === 'whole' ? info.labels[i] : info.values[i]).join(' · ')}</option>`).join('');
      $('places').dataset.mode = mode;
    }
    $('places').value = s.places; $('show-total').checked = state.showTotal;
    if ($('examples').dataset.mode !== mode) {
      $('examples').innerHTML = Object.entries(C.EXAMPLES).filter(([, v]) => v.mode === mode).map(([key, v]) => `<button type="button" data-example="${key}" aria-pressed="${key === s.example}">${v.title}</button>`).join('');
      $('examples').dataset.mode = mode;
    } else {
      $('examples').querySelectorAll('[data-example]').forEach(btn => btn.setAttribute('aria-pressed', String(btn.dataset.example === s.example)));
    }
    const example = C.EXAMPLES[s.example];
    $('lesson').hidden = !example;
    $('subtract').hidden = !example?.subtract || s.done;
    if (example) {
      $('lesson-title').textContent = example.title + (s.done && state.showTotal ? ' = ' + C.format(C.total(s.counts), mode) : '');
      const ready = example.subtract && allowed(() => C.subtract(s, mode));
      $('lesson-hint').textContent = s.done ? '모형을 빼고 남은 수를 확인해 보세요.' : ready ? '각 자리의 모형이 준비됐어요. 이제 빼 보세요.' : example.hint;
      $('subtract').title = $('lesson-hint').textContent;
      $('subtract').disabled = !ready;
      if (example.subtract) $('subtract').textContent = C.format(C.total(example.subtract), mode) + ' 빼기';
    }
    const list = C.rows(state);
    document.body.classList.toggle('comparing', list.length > 1);
    $('add-number').disabled = list.length >= C.MAX_ROWS;
    syncModelRows(list, mode, info, indexes, motion);
    $('clear').disabled = !C.total(s.counts);
    $('undo').disabled = !undo.length; $('redo').disabled = !redo.length;
    if (focus) {
      const target = document.querySelector(`#columns [data-index="${focus.index}"] [data-action="${focus.action}"]`);
      if (target && !target.disabled) target.focus({ preventScroll: true });
      else target?.closest('.place-column')?.querySelector('.place-heading')?.focus({ preventScroll: true });
    }
  }
  function commit(next, text, motion = null) {
    try {
      next = C.validate(next);
      if (JSON.stringify(next) === JSON.stringify(state)) { render(); return; }
      undo.push(copy(state)); if (undo.length > 60) undo.shift();
      redo = []; state = next; render(motion); persist();
      message(text || '');
    } catch (error) { render(); message(error.message, true); }
  }
  function update(transform, text, motion = null) {
    if (busy) return;
    try {
      let next = copy(state); next.scenes[next.mode] = transform(next.scenes[next.mode]);
      next = C.changePlaces(next, next.scenes[next.mode].places);
      commit(next, text, motion);
    }
    catch (error) { render(); message(error.message, true); }
  }
  function history(direction) {
    if (busy) return;
    const source = direction === 'undo' ? undo : redo, dest = direction === 'undo' ? redo : undo;
    if (!source.length) return;
    dest.push(copy(state)); state = source.pop(); render(); persist(); message(direction === 'undo' ? '이전 모형으로 되돌렸어요.' : '모형을 다시 바꿨어요.');
  }
  async function exchange(index, direction) {
    if (busy) return;
    const previous = copy(state), s = scene(), mode = state.mode;
    let nextScene;
    try { nextScene = C.exchange(s, index, direction, mode); }
    catch (error) { message(error.message, true); return; }
    const removed = direction === 'bundle' ? 10 : 1, added = direction === 'bundle' ? 1 : 10, target = direction === 'bundle' ? index-1 : index+1;
    const restoreFocus = document.activeElement?.closest(`#columns [data-index="${index}"] [data-action="${direction}"]`);
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    busy = true; edited = true;
    const controls = [...document.querySelectorAll('button,input,select')].map(el => [el, el.disabled]);
    controls.forEach(([el]) => { el.disabled = true; });
    if (!reduced) {
      [...document.querySelectorAll(`#columns [data-index="${index}"] .block`)].slice(-removed).forEach(el => el.classList.add('is-leaving'));
      await new Promise(resolve => setTimeout(resolve, 260));
    }
    controls.forEach(([el, disabled]) => { el.disabled = disabled; });
    busy = false;
    previous.scenes[mode] = nextScene;
    const values = C.MODES[mode].values, total = C.format(C.total(nextScene.counts), mode);
    commit(previous, `${values[index]} 모형 ${removed}개 → ${values[target]} 모형 ${added}개. ${state.showTotal ? '전체 값은 ' + total + ' 그대로예요.' : '전체 값은 그대로예요.'}`, { type: 'exchange', row: state.selected[mode], index, target });
    const column = document.querySelector(`#columns [data-index="${target}"]`);
    column.classList.add('is-exchanged');
    [...column.querySelectorAll('.block')].slice(-added).forEach(el => el.classList.add('is-arriving'));
    const cloud = column.querySelector('.block-cloud'); cloud.scrollTop = cloud.scrollHeight;
    if (restoreFocus) {
      const button = document.querySelector(`#columns [data-index="${index}"] [data-action="${direction}"]`);
      (button.disabled ? button.closest('.place-column').querySelector('.place-heading') : button).focus({ preventScroll: true });
    }
  }
  document.querySelectorAll('[data-mode]').forEach(button => button.addEventListener('click', () => {
    if (busy || state.mode === button.dataset.mode) return;
    const next = copy(state); next.mode = button.dataset.mode;
    commit(next, next.mode === 'decimal' ? '소수 모드예요. 큰 정육면체 1개를 1로 보아요.' : '자연수 모드예요. 작은 정육면체 1개를 1로 보아요.');
  }));
  $('number-form').addEventListener('submit', event => { event.preventDefault(); const value = $('number-input').value; update(s => C.fromNumber(s, value, state.mode), '입력한 수만큼 모형을 놓았어요.'); });
  $('places').addEventListener('change', () => { const places = Number($('places').value); update(s => ({ ...s, places }), '표시할 자리를 바꿨어요.'); });
  $('show-total').addEventListener('change', () => {
    if (busy) return;
    const next = copy(state); next.showTotal = $('show-total').checked;
    commit(next, next.showTotal ? '모형이 나타내는 수를 확인해 보세요.' : '모형을 세어 수를 말해 보세요.');
  });
  $('clear').addEventListener('click', () => update(s => ({ ...s, counts: [0, 0, 0, 0], example: null, done: false }), '모형을 모두 지웠어요. 되돌리기로 복원할 수 있어요.'));
  $('undo').addEventListener('click', () => history('undo'));
  $('redo').addEventListener('click', () => history('redo'));
  $('examples').addEventListener('click', event => {
    const key = event.target.closest('[data-example]')?.dataset.example;
    if (key) update(() => C.exampleScene(key), '예시의 모형을 놓았어요. 묶기나 풀기를 해 보세요.');
  });
  $('subtract').addEventListener('click', () => update(s => C.subtract(s, state.mode), '빼려는 모형을 지웠어요. 남은 수를 확인해 보세요.'));
  function selectRow(index) {
    if (index === state.selected[state.mode]) return;
    state = C.selectRow(state, index); render(); persist();
  }
  $('add-number').addEventListener('click', () => {
    if (busy) return;
    commit(C.addRow(state));
    showSettings(true); $('number-input').focus(); $('number-input').select();
  });
  $('model-rows').addEventListener('click', event => {
    if (busy) return;
    const select = event.target.closest('[data-select-row]');
    if (select) {
      const index = Number(select.dataset.selectRow);
      selectRow(index);
      document.querySelector(`[data-select-row="${index}"]`).focus({ preventScroll: true });
      return;
    }
    const remove = event.target.closest('[data-remove-row]');
    if (remove) { commit(C.removeRow(state, Number(remove.dataset.removeRow))); return; }
    const button = event.target.closest('[data-action]');
    if (!button || button.disabled || busy) return;
    const index = Number(button.closest('[data-index]').dataset.index), action = button.dataset.action, row = Number(button.closest('[data-row]').dataset.row);
    selectRow(row);
    if (action === 'bundle' || action === 'split') exchange(index, action);
    else update(s => C.add(s, index, action === 'add' ? 1 : -1, state.mode), `${C.MODES[state.mode].values[index]} 모형 1개를 ${action === 'add' ? '놓았어요.' : '지웠어요.'}`, { type: action, row, index });
  });
  document.addEventListener('keydown', event => {
    if (!(event.ctrlKey || event.metaKey) || event.target.closest('input,select,textarea,[contenteditable=true]')) return;
    if (event.key.toLowerCase() === 'z') { event.preventDefault(); history(event.shiftKey ? 'redo' : 'undo'); }
    if (event.key.toLowerCase() === 'y') { event.preventDefault(); history('redo'); }
  });
  function showSettings(show) {
    $('settings').hidden = !show;
    $('toggle-settings').setAttribute('aria-expanded', String(show)); $('toggle-settings').title = show ? '설정 접기' : '설정 펼치기';
  }
  $('toggle-settings').addEventListener('click', () => showSettings($('settings').hidden));
  showSettings(innerWidth > 800);
  document.addEventListener('DOMContentLoaded', () => {
    const back = document.querySelector('site-back-navigation');
    if (back) { $('back-slot').append(back); $('back-slot').hidden = false; }
  }, { once: true });
  render();
  new ResizeObserver(fitModels).observe($('model-rows'));
  window.addEventListener('resize', fitModels);
  window.SiteStorage.open('number-models').then(opened => {
    store = opened;
    store.onError(() => { failed = true; saveStatus('저장하지 못했어요. 잠시 후 다시 조작하면 재시도해요.', true); });
    if (!edited && store.get('board')) {
      try { state = C.validate(store.get('board')); render(); }
      catch (_) { message('이전 모형을 읽지 못해서 새 모형으로 열었어요.', true); }
    }
    if (edited) persist();
    else saveStatus(store.persistent ? '계정에 자동 저장' : '이 탭에서 사용 중');
  }).catch(() => saveStatus('이 탭에서 사용 중'));
})();
