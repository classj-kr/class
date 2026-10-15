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
  function render() {
    const s = scene(), mode = state.mode, info = C.MODES[mode], indexes = C.visible(mode, s.places);
    const focused = document.activeElement?.closest('#columns [data-action]');
    const focus = focused ? { index: focused.closest('[data-index]').dataset.index, action: focused.dataset.action } : null;
    document.querySelectorAll('[data-mode]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.mode === mode)));
    $('total').textContent = state.showTotal ? C.format(C.total(s.counts), mode) : '?';
    $('total').classList.toggle('hidden-total', !state.showTotal);
    $('expression').textContent = state.showTotal ? C.expression(s, mode) : '';
    $('unit-model').innerHTML = C.blockSVG(mode === 'whole' ? 3 : 0);
    $('unit-label').textContent = mode === 'whole' ? '작은 정육면체 1개 = 1' : '큰 정육면체 1개 = 1';
    $('number-input').value = C.format(C.total(s.counts), mode);
    $('number-form').hidden = !state.showTotal;
    $('number-input').inputMode = mode === 'whole' ? 'numeric' : 'decimal';
    $('number-help').textContent = mode === 'whole' ? '0부터 9999까지' : '0부터 9.999까지 · 소수 셋째 자리까지';
    $('places').innerHTML = [2, 3, 4].map(n => `<option value="${n}">${C.visible(mode, n).map(i => mode === 'whole' ? info.labels[i] : info.values[i]).join(' · ')}</option>`).join('');
    $('places').value = s.places; $('show-total').checked = state.showTotal;
    $('examples').innerHTML = Object.entries(C.EXAMPLES).filter(([, v]) => v.mode === mode).map(([key, v]) => `<button type="button" data-example="${key}" aria-pressed="${key === s.example}">${v.title}</button>`).join('');
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
    $('columns').style.setProperty('--places', indexes.length);
    $('columns').innerHTML = indexes.map(i => {
      const n = s.counts[i], bundle = allowed(() => C.exchange(s, i, 'bundle', mode)), split = allowed(() => C.exchange(s, i, 'split', mode));
      return `<article class="place-column" data-index="${i}" aria-label="${info.values[i]} 모형 ${n}개">
        <div class="place-heading" tabindex="-1"><div><h2>${info.values[i]}</h2><span class="place-name">${info.labels[i]}</span></div><span class="count"><b>${n}</b>개</span></div>
        <div class="block-cloud" data-shape="${i}" role="img" aria-label="${info.values[i]} 모형 ${n}개">${Array.from({ length: n }, () => `<span class="block" aria-hidden="true">${C.blockSVG(i)}</span>`).join('')}</div>
        <div class="place-controls"><div class="counter-buttons"><button type="button" data-action="remove" aria-label="${info.values[i]} 모형 1개 지우기" ${n ? '' : 'disabled'}>−</button><button type="button" data-action="add" aria-label="${info.values[i]} 모형 1개 놓기" ${allowed(() => C.add(s, i, 1, mode)) ? '' : 'disabled'}>＋</button></div>
        <div class="exchange-buttons"><button type="button" data-action="bundle" title="${indexes.includes(i-1) ? info.values[i-1] + ' 모형 1개로 묶기' : '가장 큰 자리'}" ${bundle ? '' : 'disabled'}>← 10개 묶기</button><button type="button" data-action="split" title="${indexes.includes(i+1) ? info.values[i+1] + ' 모형 10개로 풀기' : '가장 작은 자리'}" ${split ? '' : 'disabled'}>1개 풀기 →</button></div></div>
      </article>`;
    }).join('');
    $('clear').disabled = !C.total(s.counts);
    $('undo').disabled = !undo.length; $('redo').disabled = !redo.length;
    if (focus) {
      const target = document.querySelector(`[data-index="${focus.index}"] [data-action="${focus.action}"]`);
      if (target && !target.disabled) target.focus({ preventScroll: true });
      else target?.closest('.place-column').querySelector('.place-heading').focus({ preventScroll: true });
    }
  }
  function commit(next, text) {
    try {
      next = C.validate(next);
      if (JSON.stringify(next) === JSON.stringify(state)) { render(); return; }
      undo.push(copy(state)); if (undo.length > 60) undo.shift();
      redo = []; state = next; render(); persist();
      if (text) message(text);
    } catch (error) { render(); message(error.message, true); }
  }
  function update(transform, text) {
    if (busy) return;
    try { const next = copy(state); next.scenes[next.mode] = transform(next.scenes[next.mode]); commit(next, text); }
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
    const restoreFocus = document.activeElement?.closest(`[data-index="${index}"] [data-action="${direction}"]`);
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    busy = true; edited = true;
    const controls = [...document.querySelectorAll('button,input,select')].map(el => [el, el.disabled]);
    controls.forEach(([el]) => { el.disabled = true; });
    if (!reduced) {
      [...document.querySelectorAll(`[data-index="${index}"] .block`)].slice(-removed).forEach(el => el.classList.add('is-leaving'));
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    controls.forEach(([el, disabled]) => { el.disabled = disabled; });
    busy = false;
    previous.scenes[mode] = nextScene;
    const values = C.MODES[mode].values, total = C.format(C.total(nextScene.counts), mode);
    commit(previous, `${values[index]} 모형 ${removed}개 → ${values[target]} 모형 ${added}개. ${state.showTotal ? '전체 값은 ' + total + ' 그대로예요.' : '전체 값은 그대로예요.'}`);
    const column = document.querySelector(`[data-index="${target}"]`);
    column.classList.add('is-exchanged');
    [...column.querySelectorAll('.block')].slice(-added).forEach(el => el.classList.add('is-arriving'));
    const cloud = column.querySelector('.block-cloud'); cloud.scrollTop = cloud.scrollHeight;
    if (restoreFocus) {
      const button = document.querySelector(`[data-index="${index}"] [data-action="${direction}"]`);
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
  $('columns').addEventListener('click', event => {
    const button = event.target.closest('[data-action]');
    if (!button || button.disabled || busy) return;
    const index = Number(button.closest('[data-index]').dataset.index), action = button.dataset.action;
    if (action === 'bundle' || action === 'split') exchange(index, action);
    else update(s => C.add(s, index, action === 'add' ? 1 : -1, state.mode), `${C.MODES[state.mode].values[index]} 모형 1개를 ${action === 'add' ? '놓았어요.' : '지웠어요.'}`);
  });
  document.addEventListener('keydown', event => {
    if (!(event.ctrlKey || event.metaKey) || event.target.closest('input,select,textarea,[contenteditable=true]')) return;
    if (event.key.toLowerCase() === 'z') { event.preventDefault(); history(event.shiftKey ? 'redo' : 'undo'); }
    if (event.key.toLowerCase() === 'y') { event.preventDefault(); history('redo'); }
  });
  function showSettings(show) {
    $('settings').hidden = !show; document.querySelector('.workspace').classList.toggle('settings-hidden', !show);
    $('toggle-settings').setAttribute('aria-expanded', String(show)); $('toggle-settings').title = show ? '설정 접기' : '설정 펼치기';
  }
  $('toggle-settings').addEventListener('click', () => showSettings($('settings').hidden));
  showSettings(innerWidth > 800);
  document.addEventListener('DOMContentLoaded', () => {
    const back = document.querySelector('site-back-navigation');
    if (back) { $('back-slot').append(back); $('back-slot').hidden = false; }
  }, { once: true });
  render();
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
