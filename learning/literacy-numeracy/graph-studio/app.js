(() => {
  'use strict';
  const C = window.GraphCore, A = window.GraphAnalysis, $ = id => document.getElementById(id);
  const COLORS = ['#197c70', '#db7047', '#6875bb', '#b17f24', '#af5a83', '#477cac', '#8d6aa9', '#71833b'];
  const KEY = 'graph-board:current:v1', SCENES = 'graph-board:scenes:v1';
  const presets = [
    ['일차함수','기본','ax+b','linear'], ['이차함수','기본','a(x-h)^2+k','quadratic'], ['반비례','기본','a/x'],
    ['삼차함수','다항·유리·무리','a(x-h)^3+k'], ['사차함수','다항·유리·무리','a(x-h)^4+k'], ['절댓값','다항·유리·무리','a abs(x-h)+k'],
    ['유리함수','다항·유리·무리','a/(x-h)+k'], ['무리함수','다항·유리·무리','a sqrt(x-h)+k'],
    ['지수함수','지수·로그','a*2^(x-h)+k'], ['자연지수함수','지수·로그','a exp(x-h)+k'], ['상용로그','지수·로그','a log10(x-h)+k'], ['자연로그','지수·로그','a ln(x-h)+k'],
    ['사인함수','삼각함수','a sin(bx+h)+k'], ['코사인함수','삼각함수','a cos(bx+h)+k'], ['탄젠트함수','삼각함수','a tan(bx+h)+k'],
    ['역삼각함수','더 살펴보기','asin(x)'], ['합성함수','더 살펴보기','sin(x^2)'], ['정규분포','더 살펴보기','exp(-((x-h)^2)/(2*a^2))/(a*sqrt(2*pi))']
  ];
  let state = C.initialState(), storageAvailable = true, restoreWarning = '';
  try { const saved = localStorage.getItem(KEY); if (saved) state = C.validateState(JSON.parse(saved)); }
  catch { restoreWarning = '이전 수업을 불러오지 못했어요. 기본 그래프로 시작합니다.'; }
  let undo = [], redo = [], mode = 'pan', frame = 0, toastTimer, saveTimer, wheelTimer, dragging = null, pendingSave = false;
  const cache = new Map(), pointers = new Map(), canvas = $('graphCanvas'), ctx = canvas.getContext('2d');
  let vp, handles = [], analysisCacheKey = '', analysisCached;
  const color = fn => COLORS[(fn.id - 1) % COLORS.length];
  const active = () => state.functions.find(f => f.id === state.activeId) || state.functions[0];
  function element(tag, className, text) { const node = document.createElement(tag); if (className) node.className = className; if (text !== undefined) node.textContent = text; return node; }
  function button(text, label, action) { const node = element('button', '', text); node.type = 'button'; if (label) node.setAttribute('aria-label', label); node.onclick = action; return node; }
  function math(node, text) { try { window.katex.render(text, node, { throwOnError: false, strict: false, trust: false, output: 'htmlAndMathml' }); } catch { node.textContent = text; } }
  function compiled(fn) {
    if (!cache.has(fn.expression)) {
      if (cache.size > 200) cache.clear();
      try { cache.set(fn.expression, C.compile(fn.expression)); } catch (error) { cache.set(fn.expression, { error: error.message }); }
    }
    return cache.get(fn.expression);
  }
  function notify(message) { $('toast').textContent = message; $('toast').hidden = false; clearTimeout(toastTimer); toastTimer = setTimeout(() => $('toast').hidden = true, 4200); }
  function checkpoint() { const value = JSON.stringify(state); if (undo[undo.length - 1] !== value) undo.push(value); if (undo.length > 80) undo.shift(); redo = []; historyButtons(); }
  function historyButtons() { $('undoButton').disabled = !undo.length; $('redoButton').disabled = !redo.length; }
  function travel(back) {
    const from = back ? undo : redo, to = back ? redo : undo, current = JSON.stringify(state);
    while (from.length && from[from.length - 1] === current) from.pop();
    if (!from.length) { historyButtons(); return; }
    to.push(current); state = C.validateState(JSON.parse(from.pop())); renderAll(); changed();
  }
  function flushSave() {
    clearTimeout(saveTimer); if (!pendingSave) return; pendingSave = false;
    try { localStorage.setItem(KEY, JSON.stringify(state)); storageAvailable = true; $('saveStatus').textContent = '이 브라우저에 자동 저장됨'; }
    catch { storageAvailable = false; $('saveStatus').textContent = '자동 저장 불가 · 수업 파일을 내보내세요'; }
  }
  function changed() { pendingSave = true; clearTimeout(saveTimer); $('saveStatus').textContent = storageAvailable ? '저장 중…' : '자동 저장 불가 · 수업 파일을 내보내세요'; saveTimer = setTimeout(flushSave, 220); requestDraw(); historyButtons(); }
  function requestDraw() { if (!frame) frame = requestAnimationFrame(() => { frame = 0; draw(); }); }
  function choose(id) { state.activeId = id; renderSelection(); renderSliders(); renderFormula(); changed(); }
  function renderSelection() { document.querySelectorAll('.function-row').forEach(row => { const selected = Number(row.dataset.id) === state.activeId; row.classList.toggle('selected', selected); row.querySelector('.function-preview').setAttribute('aria-pressed', String(selected)); }); }
  function updateRow(fn) {
    const row = document.querySelector(`.function-row[data-id="${fn.id}"]`), data = compiled(fn); if (!row) return;
    if (data.error) row.querySelector('.function-preview').textContent = 'y = …'; else math(row.querySelector('.function-preview'), 'y=' + C.latex(data.ast));
    row.querySelector('.function-error').textContent = data.error || ''; row.querySelector('.function-input').setAttribute('aria-invalid', String(Boolean(data.error)));
  }
  function renderRows() {
    $('functionRows').replaceChildren();
    state.functions.forEach((fn, index) => {
      const row = element('article', 'function-row'); row.dataset.id = fn.id; row.style.setProperty('--curve', color(fn));
      const top = element('div', 'function-top'), visibility = element('label', 'visibility');
      const check = document.createElement('input'); check.type = 'checkbox'; check.checked = fn.visible; check.setAttribute('aria-label', `${index + 1}번 그래프 표시`);
      check.onchange = () => { checkpoint(); fn.visible = check.checked; renderFormula(); changed(); };
      visibility.append(check, element('span', 'function-name', `y${index + 1}`));
      const preview = button('', `${index + 1}번 함수 선택`, () => choose(fn.id)); preview.className = 'function-preview'; preview.title = '이 함수 선택';
      const remove = button('×', `${index + 1}번 함수 삭제`, () => { checkpoint(); state.functions = state.functions.filter(f => f.id !== fn.id); if (state.activeId === fn.id) state.activeId = state.functions[0].id; if (state.trace?.id === fn.id) state.trace = null; if (state.analysis.otherId === fn.id) state.analysis.otherId = null; renderAll(); changed(); });
      remove.className = 'remove-function'; remove.disabled = state.functions.length === 1; top.append(visibility, preview, remove);
      const label = element('label', 'function-source'); label.append(element('span', '', '입력식'));
      const input = document.createElement('input'); input.className = 'function-input'; input.value = fn.expression; input.maxLength = 500; input.spellcheck = false; input.autocomplete = 'off'; input.setAttribute('aria-label', `${index + 1}번 함수 수식`); input.setAttribute('aria-describedby', `error-${fn.id}`);
      input.onfocus = () => { checkpoint(); choose(fn.id); };
      input.oninput = () => { fn.expression = input.value; fn.kind = fn.expression === 'ax+b' ? 'linear' : fn.expression === 'a(x-h)^2+k' ? 'quadratic' : null; updateRow(fn); renderSliders(); renderFormula(); changed(); };
      label.append(input); const error = element('p', 'function-error'); error.id = `error-${fn.id}`; error.setAttribute('aria-live', 'polite'); row.append(top, label, error); $('functionRows').append(row); updateRow(fn);
    });
    $('addFunctionButton').disabled = state.functions.length >= 8; renderSelection();
  }
  function addFunction() {
    if (state.functions.length >= 8) return; checkpoint(); const id = Math.max(...state.functions.map(f => f.id), ...state.ghosts.map(f => f.id), 0) + 1;
    state.functions.push(C.newFunction('x', null, id)); state.activeId = id; renderAll(); changed();
    const input = document.querySelector(`.function-row[data-id="${id}"] .function-input`); input.focus(); input.select();
  }
  function renderLibrary() {
    const root = $('presetLibrary');
    [...new Set(presets.map(p => p[1]))].forEach(group => {
      const section = element('section', 'preset-group'); section.append(element('p', '', group)); const list = element('div');
      presets.filter(p => p[1] === group).forEach(preset => list.append(button(preset[0], '', () => { checkpoint(); const fn = active(); fn.expression = preset[2]; fn.kind = preset[3] || null; fn.params = { ...C.DEFAULT_PARAMS }; fn.visible = true; state.trace = null; renderAll(); $('presetDrawer').open = false; changed(); })));
      section.append(list); root.append(section);
    });
  }
  function renderSliders() {
    const fn = active(), data = compiled(fn), root = $('sliders'); root.replaceChildren(); const names = data.parameters || [];
    names.forEach(name => {
      const wrap = element('div', 'slider'), line = element('div', 'slider-line'), label = element('label', '', name);
      const number = document.createElement('input'); number.id = `param-${name}`; number.type = 'number'; number.step = 'any'; number.min = '-1000000'; number.max = '1000000'; number.value = fn.params[name]; number.setAttribute('aria-label', `${name} 값`); label.htmlFor = number.id;
      const range = document.createElement('input'); range.type = 'range'; range.step = '.1'; range.setAttribute('aria-label', `${name} 슬라이더`);
      const setRange = () => { const limit = Math.max(5, Math.ceil(Math.abs(fn.params[name]))); range.min = -limit; range.max = limit; range.value = fn.params[name]; }; setRange();
      const update = value => { fn.params[name] = value; renderFormula(); changed(); };
      number.onfocus = checkpoint;
      number.oninput = () => { if (number.value === '' || !Number.isFinite(number.valueAsNumber) || !number.checkValidity()) { number.setAttribute('aria-invalid', 'true'); return; } number.removeAttribute('aria-invalid'); update(number.valueAsNumber); setRange(); };
      number.onblur = () => { number.value = fn.params[name]; number.removeAttribute('aria-invalid'); };
      range.onpointerdown = checkpoint; range.onkeydown = event => { if (event.key.startsWith('Arrow') && !event.repeat) checkpoint(); }; range.oninput = () => { number.value = range.value; update(Number(range.value)); };
      line.append(label, number); wrap.append(line, range); root.append(wrap);
    });
    $('resetParams').disabled = !names.length;
    if (!names.length) root.append(element('p', 'help', data.error ? '수식을 확인하면 계수를 조절할 수 있어요.' : 'a, b, c, h, k를 수식에 넣으면 계수가 나타나요.'));
    $('handleHelp').textContent = fn.kind === 'quadratic' ? '큰 점은 꼭짓점, 작은 점은 폭과 방향을 바꿉니다.' : fn.kind === 'linear' ? '큰 점은 절편, 작은 점은 기울기를 바꿉니다.' : '직접 움직이려면 일차함수 또는 이차함수를 골라보세요.';
  }
  function displayLatex(fn, data) {
    const p = fn.params, suffix = value => value === 0 ? '' : (value < 0 ? '-' : '+') + C.numberLatex(Math.abs(value));
    if (fn.kind === 'linear' || fn.kind === 'quadratic') {
      const constant = fn.kind === 'linear' ? p.b : p.k;
      if (p.a === 0) return C.numberLatex(constant);
      const coefficient = p.a === 1 ? '' : p.a === -1 ? '-' : C.numberLatex(p.a);
      const variable = fn.kind === 'linear' ? 'x' : (p.h === 0 ? 'x' : '\\left(x' + suffix(-p.h) + '\\right)') + '^{2}';
      return coefficient + variable + suffix(constant);
    }
    return C.latex(data.ast, fn.params);
  }
  function renderFormula() {
    const fn = active(), data = compiled(fn), display = $('formulaDisplay'); display.replaceChildren(); display.style.color = color(fn);
    if (data.error) display.append(element('span', '', '수식을 확인해 주세요'));
    else { const main = element('div'); math(main, 'y=' + displayLatex(fn, data)); display.append(main); const info = data.parameters.map(n => `${n} = ${fn.params[n]}`).join('   ·   '); display.append(element('small', '', (fn.visible ? '' : '숨긴 그래프 · ') + (info || '선택한 함수'))); }
    $('snapshotButton').disabled = Boolean(data.error) || !fn.visible; $('clearGhosts').disabled = !state.ghosts.length; $('compareHelp').textContent = state.ghosts.length ? `${state.ghosts.length}개의 이전 모양을 점선으로 표시합니다.` : '선택한 그래프를 점선으로 남겨 비교해요.';
  }
  function renderAll() { $('lessonTitle').value = state.title; $('showCoordinates').checked = state.showCoordinates; $('showHandles').checked = state.showHandles; renderRows(); renderSliders(); renderFormula(); historyButtons(); requestDraw(); }
  function analysisPartner() {
    return state.functions.find(f => f.id === state.analysis.otherId && f.id !== state.activeId && f.visible) || state.functions.find(f => f.id !== state.activeId && f.visible);
  }
  function analysisResult(v) {
    const fn = active(), settings = state.analysis, partner = analysisPartner();
    const key = JSON.stringify([settings, fn, settings.mode === 'intersections' ? [partner, v.xMin, v.xMax] : null]);
    if (analysisCacheKey === key) return analysisCached;
    analysisCacheKey = key;
    const data = compiled(fn), evaluate = x => data.evaluate(x, fn.params);
    let result = { mode: settings.mode };
    if (settings.mode === 'none') return analysisCached = result;
    if (!fn.visible || data.error) result.error = '선택한 그래프의 표시와 수식을 확인해 주세요.';
    else if (settings.mode === 'intersections') {
      if (!partner) result.error = '그래프를 하나 더 추가하면 두 함수의 교점을 찾을 수 있어요.';
      else {
        const second = compiled(partner);
        if (second.error) result.error = '비교할 함수의 수식을 확인해 주세요.';
        else Object.assign(result, A.intersections(evaluate, x => second.evaluate(x, partner.params), v.xMin, v.xMax));
      }
    } else if (settings.mode === 'tangent') {
      Object.assign(result, A.tangent(evaluate, settings.tangentX));
      if (!result.ok) result.error = result.reason;
    } else {
      Object.assign(result, A.integrate(evaluate, settings.from, settings.to));
      if (!result.ok) result.error = result.reason;
    }
    return analysisCached = result;
  }
  function analysisSummary(result = analysisResult(vp)) {
    if (result.mode === 'none') return [];
    if (result.error) return ['분석: ' + result.error];
    if (result.mode === 'intersections') {
      if (result.overlap) return ['교점: 겹치는 구간이 있어 교점을 개별 표시하지 않습니다.'];
      return [result.points.length ? '근사 교점: ' + result.points.map(p => `(${C.format(p.x, 6)}, ${C.format(p.y, 6)})`).join(', ') : '현재 x 범위에서 찾은 교점이 없습니다.', ...(result.limited ? ['교점은 최대 64개까지 표시합니다.'] : [])];
    }
    if (result.mode === 'tangent') return [`접점 ≈ (${C.format(result.x, 6)}, ${C.format(result.y, 6)}) · 기울기 ≈ ${C.format(result.slope, 6)}`];
    return [`적분 구간: ${state.analysis.from} → ${state.analysis.to}`, `정적분 ≈ ${C.format(result.signed, 6)} · x축과의 넓이 ≈ ${C.format(result.area, 6)}`];
  }
  function renderAnalysis(v) {
    const settings = state.analysis, visible = settings.mode !== 'none';
    $('analysisPanel').hidden = !visible; $('analysisButton').classList.toggle('active', visible); $('analysisButton').setAttribute('aria-pressed', String(visible)); document.body.classList.toggle('analysis-open', visible);
    if (!visible) return;
    $('analysisTarget').textContent = `y${state.functions.indexOf(active()) + 1} · 선택한 함수`;
    document.querySelectorAll('[data-analysis]').forEach(node => node.setAttribute('aria-pressed', String(node.dataset.analysis === settings.mode)));
    $('intersectionControls').hidden = settings.mode !== 'intersections'; $('tangentControls').hidden = settings.mode !== 'tangent'; $('integralControls').hidden = settings.mode !== 'integral';
    for (const [id, key] of [['tangentX','tangentX'],['integralFrom','from'],['integralTo','to']]) if (document.activeElement !== $(id)) $(id).value = settings[key];
    const choices = state.functions.filter(f => f.id !== state.activeId && f.visible), partner = analysisPartner(), select = $('analysisOther'), signature = JSON.stringify(choices.map(f => [f.id, f.expression]));
    if (select.dataset.signature !== signature) {
      select.replaceChildren(); select.dataset.signature = signature;
      if (!choices.length) select.append(new Option('비교할 함수가 없습니다', ''));
      choices.forEach(f => select.append(new Option(`y${state.functions.indexOf(f) + 1} · ${f.expression.slice(0, 32)}`, f.id)));
    }
    select.disabled = !choices.length; select.value = partner ? String(partner.id) : '';
    const result = analysisResult(v), root = $('analysisResult'), signatureResult = JSON.stringify([result, settings.from, settings.to]);
    if (root.dataset.result === signatureResult) return;
    root.dataset.result = signatureResult; root.replaceChildren();
    if (result.error) { root.append(element('p', 'analysis-error', result.error)); return; }
    if (result.mode === 'intersections') {
      if (result.overlap) { root.append(element('p', '', '겹치는 구간이 있어 교점을 개별 표시하지 않아요.')); return; }
      root.append(element('p', '', result.points.length ? `찾은 교점 ${result.points.length}개 · 근삿값` : '이 범위에서 찾은 교점이 없어요. 범위를 바꾸어 살펴보세요.'));
      result.points.forEach(point => {
        const node = button(`(${C.format(point.x, 6)}, ${C.format(point.y, 6)})`, '', () => { checkpoint(); state.trace = { id: active().id, x: point.x }; state.showCoordinates = true; $('showCoordinates').checked = true; if (point.y < vp.yMin || point.y > vp.yMax) state.view.y = C.clamp(point.y, -1e7, 1e7); changed(); });
        node.className = 'intersection-point'; root.append(node);
      });
      if (result.limited) root.append(element('p', 'help', '최대 64개까지 표시해요. 확대해서 살펴보세요.'));
    } else if (result.mode === 'tangent') {
      root.append(element('p', '', `접점 ≈ (${C.format(result.x)}, ${C.format(result.y)})`), element('p', 'result-number', `기울기 ≈ ${C.format(result.slope, 6)}`));
      const formula = element('div'); math(formula, `y\\approx ${C.numberLatex(Number(result.slope.toPrecision(6)))}(x-(${C.numberLatex(result.x)}))+(${C.numberLatex(Number(result.y.toPrecision(6)))})`); root.append(formula);
    } else {
      root.append(element('p', '', `구간 ${settings.from} → ${settings.to}`), element('p', 'result-number', `정적분 ≈ ${C.format(result.signed, 6)}`), element('p', 'result-number', `넓이 ≈ ${C.format(result.area, 6)}`), element('p', 'help', '정적분은 x축 아래 부분을 빼고, 넓이는 모든 부분을 더한 값입니다.'));
    }
  }
  function analysisHandles(v) {
    const settings = state.analysis, result = analysisResult(v), axisY = C.clamp(v.py(0), 34, v.height - 65);
    let list = [];
    if (settings.mode === 'tangent' && result.ok) list = [{ name: 'tangentX', x: result.x, y: result.y, px: v.px(result.x), py: v.py(result.y) }];
    if (settings.mode === 'integral') list = [{ name: 'from', x: settings.from, px: v.px(settings.from), py: axisY }, { name: 'to', x: settings.to, px: v.px(settings.to), py: axisY }];
    return list.filter(p => p.px >= 12 && p.px <= v.width - 12 && p.py >= 12 && p.py <= v.height - 12).map(p => ({ ...p, radius: 8, analysis: true }));
  }
  function paintAnalysis(context, v, background) {
    const result = analysisResult(v), settings = state.analysis;
    if (result.mode === 'none') return;
    context.save(); context.beginPath(); context.rect(0, 0, v.width, v.height); context.clip();
    if (background && result.mode === 'integral' && result.ok) {
      const fn = active(), data = compiled(fn), min = Math.max(v.xMin, Math.min(settings.from, settings.to)), max = Math.min(v.xMax, Math.max(settings.from, settings.to));
      const fill = (x0, y0, x1, y1) => { context.fillStyle = (y0 + y1) / 2 >= 0 ? '#197c7029' : '#db70472f'; context.beginPath(); context.moveTo(v.px(x0), v.py(0)); context.lineTo(v.px(x0), v.py(y0)); context.lineTo(v.px(x1), v.py(y1)); context.lineTo(v.px(x1), v.py(0)); context.closePath(); context.fill(); };
      if (max > min) for (const [x0, y0, x1, y1] of C.sample(x => C.clamp(data.evaluate(x, fn.params), v.yMin - 1 / v.scale, v.yMax + 1 / v.scale), { ...v, yMin: -Infinity, yMax: Infinity, xMin: min, xMax: max, width: Math.max(4, (max - min) * v.scale) })) {
        if (y0 * y1 < 0) { const x = x0 - y0 * (x1 - x0) / (y1 - y0); fill(x0, y0, x, 0); fill(x, 0, x1, y1); } else fill(x0, y0, x1, y1);
      }
    }
    if (background) { context.restore(); return; }
    if (result.mode === 'tangent' && result.ok) {
      context.strokeStyle = '#bc782a'; context.lineWidth = 2; context.setLineDash([8, 5]); context.beginPath(); context.moveTo(v.px(v.xMin), v.py(result.y + result.slope * (v.xMin - result.x))); context.lineTo(v.px(v.xMax), v.py(result.y + result.slope * (v.xMax - result.x))); context.stroke(); context.setLineDash([]);
      context.fillStyle = '#bc782a'; context.beginPath(); context.arc(v.px(result.x), v.py(result.y), 5, 0, Math.PI * 2); context.fill();
    }
    if (result.mode === 'intersections' && result.points) for (const point of result.points) {
      if (point.y < v.yMin || point.y > v.yMax) continue;
      context.fillStyle = '#fff'; context.strokeStyle = '#a36528'; context.lineWidth = 2.5; context.beginPath(); context.arc(v.px(point.x), v.py(point.y), 6, 0, Math.PI * 2); context.fill(); context.stroke();
      context.fillStyle = '#81552f'; context.font = '12px "STIX Two Math", serif'; context.textAlign = point.x > state.view.x ? 'right' : 'left'; context.fillText(`≈ (${C.format(point.x)}, ${C.format(point.y)})`, v.px(point.x) + (point.x > state.view.x ? -10 : 10), C.clamp(v.py(point.y) - 12, 16, v.height - 10));
    }
    if (result.mode === 'integral') {
      for (const point of analysisHandles(v)) {
        context.strokeStyle = point.name === 'from' ? '#3975ce' : '#bc782a'; context.fillStyle = context.strokeStyle; context.lineWidth = 1.5; context.setLineDash([5, 5]); context.beginPath(); context.moveTo(point.px, 0); context.lineTo(point.px, v.height); context.stroke(); context.setLineDash([]); context.beginPath(); context.arc(point.px, point.py, 5, 0, Math.PI * 2); context.fill(); context.font = '12px "Malgun Gothic", sans-serif'; context.textAlign = point.name === 'from' ? 'right' : 'left'; context.fillText(point.name === 'from' ? '시작' : '끝', point.px + (point.name === 'from' ? -12 : 12), point.py - 13);
      }
    }
    context.restore();
  }
  function setAnalysis(next) { checkpoint(); state.analysis.mode = next; if (next !== 'none') setMode('pan'); changed(); }
  $('analysisButton').onclick = () => setAnalysis(state.analysis.mode === 'none' ? 'intersections' : 'none');
  $('closeAnalysis').onclick = () => setAnalysis('none');
  document.querySelectorAll('[data-analysis]').forEach(node => node.onclick = () => setAnalysis(node.dataset.analysis));
  $('analysisOther').onchange = event => { checkpoint(); state.analysis.otherId = Number(event.target.value); changed(); };
  for (const [id, key] of [['tangentX','tangentX'],['integralFrom','from'],['integralTo','to']]) {
    const input = $(id); input.onfocus = checkpoint;
    input.oninput = () => { if (input.value === '' || !Number.isFinite(input.valueAsNumber) || !input.checkValidity()) { input.setAttribute('aria-invalid', 'true'); return; } input.removeAttribute('aria-invalid'); state.analysis[key] = input.valueAsNumber; changed(); };
    input.onblur = () => { input.value = state.analysis[key]; input.removeAttribute('aria-invalid'); };
  }

  function ticks(v) { const raw = 75 / v.scale, power = 10 ** Math.floor(Math.log10(raw)), ratio = raw / power; return (ratio <= 1 ? 1 : ratio <= 2 ? 2 : ratio <= 5 ? 5 : 10) * power; }
  function paint(context, width, height, options = {}) {
    const v = C.viewport(width, height, state.view), tick = ticks(v);
    context.fillStyle = '#ffffff'; context.fillRect(0, 0, width, height);
    const axisX = C.clamp(v.px(0), 25, width - 20), axisY = C.clamp(v.py(0), 18, height - 28);
    function grid(step, major) {
      context.lineWidth = 1; context.strokeStyle = major ? '#e1e9e3' : '#f2f5f1'; context.beginPath();
      for (let i = Math.ceil(v.xMin / step); i <= Math.floor(v.xMax / step); i++) { const px = v.px(i * step); context.moveTo(px, 0); context.lineTo(px, height); }
      for (let i = Math.ceil(v.yMin / step); i <= Math.floor(v.yMax / step); i++) { const py = v.py(i * step); context.moveTo(0, py); context.lineTo(width, py); }
      context.stroke();
    }
    grid(tick / 5, false); grid(tick, true);
    context.strokeStyle = '#9aaea1'; context.lineWidth = 1.3; context.beginPath();
    if (v.xMin <= 0 && v.xMax >= 0) { context.moveTo(v.px(0), 0); context.lineTo(v.px(0), height); }
    if (v.yMin <= 0 && v.yMax >= 0) { context.moveTo(0, v.py(0)); context.lineTo(width, v.py(0)); }
    context.stroke(); context.fillStyle = '#6a7c70'; context.font = '12px "STIX Two Math", serif';
    for (let i = Math.ceil(v.xMin / tick); i <= Math.floor(v.xMax / tick); i++) { if (i === 0) continue; context.textAlign = 'center'; context.fillText(C.format(i * tick, 5), v.px(i * tick), axisY + 17); }
    for (let i = Math.ceil(v.yMin / tick); i <= Math.floor(v.yMax / tick); i++) { if (i === 0) continue; context.textAlign = 'right'; context.fillText(C.format(i * tick, 5), axisX - 8, v.py(i * tick) + 4); }
    context.textAlign = 'left'; if (v.xMin <= 0 && v.xMax >= 0 && v.yMin <= 0 && v.yMax >= 0) context.fillText('0', v.px(0) + 7, v.py(0) + 17);
    context.font = 'italic 15px "STIX Two Math", serif'; context.fillText('x', width - 18, axisY - 9); context.fillText('y', axisX + 9, 18);
    if (options.blank) return v;
    paintAnalysis(context, v, true);
    function curve(fn, ghost) {
      if (!fn.visible) return; const data = compiled(fn); if (data.error) return;
      context.save(); context.beginPath(); context.rect(0, 0, width, height); context.clip(); context.strokeStyle = color(fn); context.globalAlpha = ghost ? .4 : 1; context.lineWidth = ghost ? 2 : fn.id === state.activeId ? 3 : 2.2;
      context.setLineDash(ghost ? [7, 6] : []); context.lineCap = 'round'; context.beginPath();
      let lastX, lastY;
      for (const [x0, y0, x1, y1] of C.sample(x => data.evaluate(x, fn.params), v)) { if (lastX !== x0 || lastY !== y0) context.moveTo(v.px(x0), v.py(y0)); context.lineTo(v.px(x1), v.py(y1)); lastX = x1; lastY = y1; }
      context.stroke(); context.restore();
    }
    state.ghosts.forEach(fn => curve(fn, true)); state.functions.forEach(fn => curve(fn, false));
    const trace = state.showCoordinates && state.trace, fn = trace && state.functions.find(f => f.id === trace.id), data = fn && compiled(fn);
    if (fn?.visible && !data.error) {
      const y = data.evaluate(trace.x, fn.params), x = trace.x;
      if (Number.isFinite(y) && x >= v.xMin && x <= v.xMax && y >= v.yMin && y <= v.yMax) {
        context.save(); context.strokeStyle = color(fn); context.fillStyle = color(fn); context.globalAlpha = .6; context.setLineDash([4, 4]); context.beginPath(); context.moveTo(v.px(x), v.py(0)); context.lineTo(v.px(x), v.py(y)); context.lineTo(v.px(0), v.py(y)); context.stroke(); context.globalAlpha = 1; context.setLineDash([]); context.beginPath(); context.arc(v.px(x), v.py(y), 4.5, 0, 2 * Math.PI); context.fill();
        context.font = '14px "STIX Two Math", serif'; context.textAlign = x > state.view.x ? 'right' : 'left'; context.fillText(`(${C.format(x)}, ${C.format(y)})`, C.clamp(v.px(x) + (x > state.view.x ? -10 : 10), 20, width - 20), C.clamp(v.py(y) - 12, 20, height - 15)); context.restore();
      }
    }
    paintAnalysis(context, v, false);
    return v;
  }
  function currentHandles(v) {
    const fn = active(), p = fn.params; if (!state.showHandles || !fn.visible || compiled(fn).error || ['tangent', 'integral'].includes(state.analysis.mode)) return [];
    const distance = 80 / v.scale;
    const offset = fn.kind === 'linear' ? distance / Math.hypot(1, p.a) : Math.sqrt(2 * distance ** 2 / (1 + Math.sqrt(1 + 4 * p.a ** 2 * distance ** 2)));
    const points = fn.kind === 'quadratic' ? [['origin', p.h, p.k], ['shape', p.h + offset, p.a * offset ** 2 + p.k]] : fn.kind === 'linear' ? [['origin', 0, p.b], ['shape', offset, p.a * offset + p.b]] : [];
    return points.map(([name, x, y]) => ({ name, x, y, px: v.px(x), py: v.py(y), radius: name === 'origin' ? 9 : 7 })).filter(p => p.px >= 12 && p.px <= v.width - 12 && p.py >= 12 && p.py <= v.height - 12);
  }
  function draw() {
    const rect = canvas.getBoundingClientRect(); if (!rect.width || !rect.height) return; const ratio = Math.min(window.devicePixelRatio || 1, 3);
    if (canvas.width !== Math.round(rect.width * ratio) || canvas.height !== Math.round(rect.height * ratio)) { canvas.width = Math.round(rect.width * ratio); canvas.height = Math.round(rect.height * ratio); }
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0); vp = paint(ctx, rect.width, rect.height); handles = [...analysisHandles(vp), ...currentHandles(vp)];
    for (const point of handles) { ctx.beginPath(); ctx.arc(point.px, point.py, point.radius + 5, 0, Math.PI * 2); ctx.fillStyle = '#ffffffce'; ctx.fill(); ctx.beginPath(); ctx.arc(point.px, point.py, point.radius, 0, Math.PI * 2); ctx.fillStyle = point.name === 'origin' ? color(active()) : '#ffffff'; ctx.fill(); ctx.strokeStyle = point.analysis ? (point.name === 'from' ? '#3975ce' : '#bc782a') : color(active()); ctx.lineWidth = 2.5; ctx.stroke(); }
    renderAnalysis(vp);
    $('zoomLevel').textContent = `${Math.round(6 / state.view.range * 100)}%`; $('viewRange').textContent = `x ${C.format(vp.xMin, 1)} ~ ${C.format(vp.xMax, 1)}   ·   y ${C.format(vp.yMin, 1)} ~ ${C.format(vp.yMax, 1)}`;
    $('graphCount').textContent = `${state.functions.filter(f => f.visible && !compiled(f).error).length}개의 그래프${state.ghosts.length ? ` · 비교 ${state.ghosts.length}개` : ''}`;
    const traceFn = state.trace && state.functions.find(f => f.id === state.trace.id), traceData = traceFn && compiled(traceFn), showTrace = state.showCoordinates && traceFn?.visible && !traceData.error;
    $('traceReadout').hidden = !showTrace; if (showTrace) { const y = traceData.evaluate(state.trace.x, traceFn.params); $('traceReadout').textContent = `x = ${C.format(state.trace.x)}   y = ${C.format(y)}`; }
  }
  function localPoint(event) { const rect = canvas.getBoundingClientRect(); return { x: event.clientX - rect.left, y: event.clientY - rect.top }; }
  function traceAt(point) { if (!vp) return; state.trace = { id: active().id, x: vp.x(point.x) }; changed(); }
  function setMode(next) {
    mode = next; $('panButton').classList.toggle('active', mode === 'pan'); $('traceButton').classList.toggle('active', mode === 'trace'); $('panButton').setAttribute('aria-pressed', String(mode === 'pan')); $('traceButton').setAttribute('aria-pressed', String(mode === 'trace')); canvas.classList.toggle('exploring', mode === 'trace');
    $('gestureHint').textContent = mode === 'trace' ? '좌우로 움직여 선택한 곡선의 좌표를 확인하세요' : '빈 곳을 끌어 이동 · 조절점을 끌어 그래프 변경';
  }
  canvas.addEventListener('pointerdown', event => {
    if (event.button !== 0 || !vp) return; event.preventDefault(); canvas.focus({ preventScroll: true }); const point = localPoint(event); pointers.set(event.pointerId, point); canvas.setPointerCapture(event.pointerId);
    if (pointers.size === 2) { const [a, b] = [...pointers.values()]; dragging = { type: 'pinch', view: C.clone(state.view), distance: Math.hypot(a.x - b.x, a.y - b.y), center: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }, width: vp.width, height: vp.height }; return; }
    if (pointers.size > 2) return; checkpoint(); const handle = mode === 'pan' && handles.find(h => Math.hypot(h.px - point.x, h.py - point.y) <= h.radius + 14);
    dragging = { type: handle?.analysis ? 'analysis' : handle ? 'handle' : mode, handle: handle?.name, start: point, view: C.clone(state.view), viewport: vp, fn: C.clone(active()) }; if (mode === 'trace') traceAt(point); canvas.classList.add('dragging');
  });
  canvas.addEventListener('pointermove', event => {
    const point = localPoint(event); if (pointers.has(event.pointerId)) pointers.set(event.pointerId, point); if (!dragging) return;
    if (dragging.type === 'pinch' && pointers.size >= 2) {
      const [a, b] = [...pointers.values()], center = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }, distance = Math.max(10, Math.hypot(a.x - b.x, a.y - b.y));
      const d = dragging, next = C.zoomAt(d.view, d.width, d.height, d.center.x, d.center.y, Math.max(10, d.distance) / distance), v = C.viewport(d.width, d.height, next);
      next.x = C.clamp(next.x - (center.x - d.center.x) / v.scale, -1e7, 1e7); next.y = C.clamp(next.y + (center.y - d.center.y) / v.scale, -1e7, 1e7); state.view = next; changed();
    } else if (dragging.type === 'analysis') { state.analysis[dragging.handle] = C.clamp(Math.round(dragging.viewport.x(point.x) * 100) / 100, -1e6, 1e6); changed(); } else if (dragging.type === 'handle') { const fn = active(), v = dragging.viewport; fn.params = C.dragHandle(dragging.fn, dragging.handle, v.x(point.x), v.y(point.y)); renderSliders(); renderFormula(); changed(); }
    else if (dragging.type === 'pan') { state.view.x = C.clamp(dragging.view.x - (point.x - dragging.start.x) / dragging.viewport.scale, -1e7, 1e7); state.view.y = C.clamp(dragging.view.y + (point.y - dragging.start.y) / dragging.viewport.scale, -1e7, 1e7); changed(); }
    else if (dragging.type === 'trace') traceAt(point);
  });
  function endPointer(event) {
    if (!pointers.has(event.pointerId)) return; pointers.delete(event.pointerId);
    if (!pointers.size) { dragging = null; canvas.classList.remove('dragging'); flushSave(); }
    else if (dragging?.type === 'pinch' && pointers.size === 1) { const point = [...pointers.values()][0]; dragging = { type: 'pan', start: point, view: C.clone(state.view), viewport: C.viewport(vp.width, vp.height, state.view) }; }
  }
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(type => canvas.addEventListener(type, endPointer));
  function zoom(factor, point = { x: vp.width / 2, y: vp.height / 2 }) { state.view = C.zoomAt(state.view, vp.width, vp.height, point.x, point.y, factor); changed(); }
  canvas.addEventListener('wheel', event => { event.preventDefault(); if (!vp) return; if (!wheelTimer) checkpoint(); clearTimeout(wheelTimer); wheelTimer = setTimeout(() => wheelTimer = null, 250); zoom(Math.exp(C.clamp(event.deltaY, -200, 200) * .002), localPoint(event)); }, { passive: false });
  function home() { checkpoint(); state.view = { x: 0, y: 0, range: 6 }; changed(); }
  canvas.addEventListener('dblclick', home);
  canvas.addEventListener('keydown', event => {
    if (event.key === 'Home') { event.preventDefault(); home(); }
    else if (['+', '=', '-'].includes(event.key)) { event.preventDefault(); checkpoint(); zoom(event.key === '-' ? 1.25 : .8); }
    else if (event.key.startsWith('Arrow')) { event.preventDefault(); if (!event.repeat) checkpoint(); const step = 35 / vp.scale; state.view.x = C.clamp(state.view.x + (event.key === 'ArrowRight' ? step : event.key === 'ArrowLeft' ? -step : 0), -1e7, 1e7); state.view.y = C.clamp(state.view.y + (event.key === 'ArrowUp' ? step : event.key === 'ArrowDown' ? -step : 0), -1e7, 1e7); changed(); }
  });
  $('mathKeyboard').addEventListener('pointerdown', event => { if (event.target.closest('button')) event.preventDefault(); });
  $('mathKeyboard').addEventListener('click', event => {
    const key = event.target.closest('button'); if (!key) return;
    const input = document.querySelector(`.function-row[data-id="${state.activeId}"] .function-input`); if (!input) return;
    checkpoint(); const start = input.selectionStart ?? input.value.length, end = input.selectionEnd ?? start; let value = input.value, cursor = start;
    if (key.dataset.action === 'clear') { value = ''; cursor = 0; }
    else if (key.dataset.action === 'backspace') { const before = start === end ? Math.max(0, start - 1) : start; value = value.slice(0, before) + value.slice(end); cursor = before; }
    else { const before = key.dataset.wrap ? key.dataset.wrap + '(' : key.dataset.insert, after = key.dataset.wrap ? ')' : ''; value = value.slice(0, start) + before + value.slice(start, end) + after + value.slice(end); cursor = start + before.length + (end - start) + (end > start ? after.length : 0); }
    input.value = value.slice(0, 500); input.dispatchEvent(new Event('input')); input.focus(); input.setSelectionRange(cursor, cursor);
  });
  function setSidebar(show) { document.body.classList.toggle('sidebar-hidden', !show); $('sidebarButton').setAttribute('aria-expanded', String(show)); requestDraw(); }
  $('sidebarButton').onclick = () => setSidebar(document.body.classList.contains('sidebar-hidden'));
  $('teachingButton').onclick = () => { const enabled = document.body.classList.toggle('teaching'); $('teachingButton').setAttribute('aria-pressed', String(enabled)); $('teachingButton').textContent = enabled ? '수업 모드 끝내기' : '수업 모드'; requestDraw(); };
  $('addFunctionButton').onclick = addFunction;
  $('resetParams').onclick = () => { checkpoint(); active().params = { ...C.DEFAULT_PARAMS }; renderSliders(); renderFormula(); changed(); };
  $('snapshotButton').onclick = () => { if (state.ghosts.length >= 8) { notify('비교 모양은 8개까지 남길 수 있어요. 비교를 지운 뒤 다시 남겨주세요.'); return; } checkpoint(); state.ghosts.push(C.clone(active())); renderFormula(); changed(); notify('지금 모양을 점선으로 남겼어요. 그래프를 움직여 비교해 보세요.'); };
  $('clearGhosts').onclick = () => { checkpoint(); state.ghosts = []; renderFormula(); changed(); };
  ['showHandles', 'showCoordinates'].forEach(id => $(id).onchange = event => { checkpoint(); state[id] = event.target.checked; changed(); });
  $('panButton').onclick = () => setMode('pan'); $('traceButton').onclick = () => { if (!state.showCoordinates) { checkpoint(); state.showCoordinates = true; $('showCoordinates').checked = true; changed(); } setMode('trace'); };
  $('undoButton').onclick = () => travel(true); $('redoButton').onclick = () => travel(false); $('homeButton').onclick = home;
  document.querySelectorAll('[data-zoom]').forEach(node => node.onclick = () => { checkpoint(); zoom(node.dataset.zoom === 'in' ? .8 : 1.25); });
  $('lessonTitle').onfocus = checkpoint; $('lessonTitle').oninput = event => { state.title = event.target.value; changed(); };
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') { pointers.clear(); dragging = null; canvas.classList.remove('dragging'); if (document.body.classList.contains('teaching')) $('teachingButton').click(); }
    if (!(event.ctrlKey || event.metaKey) || ['INPUT', 'TEXTAREA'].includes(event.target.tagName) || document.querySelector('dialog[open]')) return;
    if (event.key.toLowerCase() === 'z') { event.preventDefault(); travel(!event.shiftKey); } else if (event.key.toLowerCase() === 'y') { event.preventDefault(); travel(false); }
  });
  document.querySelectorAll('[data-close]').forEach(node => node.onclick = () => node.closest('dialog').close());
  function readScenes() {
    const raw = localStorage.getItem(SCENES); if (!raw) return []; const items = JSON.parse(raw);
    if (!Array.isArray(items) || items.length > 40) throw Error('수업 보관함을 읽을 수 없어요.');
    return items.map(item => { if (typeof item.id !== 'string' || typeof item.savedAt !== 'string') throw Error('수업 보관함을 읽을 수 없어요.'); return { id: item.id, savedAt: item.savedAt, state: C.validateState(item.state) }; });
  }
  function renderScenes() {
    const list = $('sceneList'); list.replaceChildren(); let scenes;
    try { scenes = readScenes(); } catch { list.append(element('p', 'help', '수업 보관함을 읽을 수 없어요. 현재 수업은 파일로 내보낼 수 있습니다.')); return; }
    if (!scenes.length) list.append(element('p', 'empty-scenes', '첫 수업을 보관해 보세요. 준비한 장면을 그대로 다시 열 수 있어요.'));
    scenes.slice().reverse().forEach(scene => {
      const row = element('div', 'scene-card'), info = element('div'); info.append(element('strong', '', scene.state.title || '이름 없는 수업'), element('small', '', `${scene.state.functions.length}개 함수 · ${new Date(scene.savedAt).toLocaleString('ko-KR')}`));
      const open = button('열기', `${scene.state.title} 열기`, () => { checkpoint(); state = C.clone(scene.state); renderAll(); changed(); $('scenesDialog').close(); notify('수업을 열었어요. 실행 취소로 이전 장면에 돌아갈 수 있어요.'); });
      const remove = button('삭제', `${scene.state.title} 삭제`, () => { if (!window.confirm(`“${scene.state.title}”을 보관함에서 삭제할까요? 현재 칠판은 유지됩니다.`)) return; try { localStorage.setItem(SCENES, JSON.stringify(readScenes().filter(s => s.id !== scene.id))); renderScenes(); } catch { notify('삭제하지 못했어요. 브라우저 저장 공간을 확인하세요.'); } });
      row.append(info, open, remove); list.append(row);
    });
  }
  $('scenesButton').onclick = () => { $('sceneName').value = state.title; renderScenes(); $('scenesDialog').showModal(); };
  $('saveSceneForm').onsubmit = event => {
    event.preventDefault(); const title = $('sceneName').value.trim(); if (!title) { $('sceneName').focus(); return; }
    try { const scenes = readScenes(); if (scenes.length >= 40) { notify('40개까지 보관할 수 있어요. 이전 수업을 파일로 내보내고 정리해 주세요.'); return; }
      const copy = C.clone(state); copy.title = title; scenes.push({ id: window.crypto.randomUUID(), savedAt: new Date().toISOString(), state: copy }); localStorage.setItem(SCENES, JSON.stringify(scenes));
      checkpoint(); state.title = title; $('lessonTitle').value = title; changed(); renderScenes(); notify('수업을 보관했어요.');
    } catch { notify('보관하지 못했어요. 수업 파일 내보내기로 저장해 주세요.'); }
  };
  function filename() { return (state.title.trim() || '그래프 수업').replace(/[<>:"/\\|?*\u0000-\u001f]/g, '-').slice(0, 70); }
  function download(blob, name) { const url = URL.createObjectURL(blob), link = document.createElement('a'); link.href = url; link.download = name; link.click(); setTimeout(() => URL.revokeObjectURL(url), 5000); }
  $('jsonButton').onclick = () => download(new Blob([JSON.stringify({ app: 'class-graph-board', state }, null, 2)], { type: 'application/json' }), filename() + '.graph.json');
  $('importButton').onclick = () => $('importFile').click();
  $('importFile').onchange = async event => {
    const file = event.target.files[0]; event.target.value = ''; if (!file) return; if (file.size > 200000) { notify('수업 파일은 200KB 이하만 불러올 수 있어요.'); return; }
    try { const doc = JSON.parse(await file.text()); if (doc.app !== 'class-graph-board') throw Error(); const next = C.validateState(doc.state); checkpoint(); state = next; renderAll(); changed(); $('scenesDialog').close(); notify('수업 파일을 불러왔어요.'); }
    catch { notify('그래프 칠판에서 내보낸 올바른 수업 파일인지 확인해 주세요.'); }
  };
  $('exportButton').onclick = () => $('exportDialog').showModal();
  function exportCanvas(blank = false) {
    const out = document.createElement('canvas');
    // Same aspect ratio as the board, so exporting never changes the visible bounds.
    const scale = Math.min(2, 1800 / Math.max(vp.width, vp.height));
    out.width = Math.round(vp.width * scale); out.height = Math.round(vp.height * scale); const context = out.getContext('2d'); context.setTransform(scale, 0, 0, scale, 0, 0); paint(context, vp.width, vp.height, { blank }); return out;
  }
  function textLines(context, text, maxWidth) { const lines = []; let line = ''; for (const char of text) { if (context.measureText(line + char).width > maxWidth && line) { lines.push(line); line = char; } else line += char; } lines.push(line); return lines; }
  function exportDescriptions() {
    const visible = state.functions.filter(f => f.visible);
    return [...visible, ...state.ghosts].map((fn, index) => { const data = compiled(fn), ghost = index >= visible.length; return { fn, data, ghost, label: `${ghost ? '점선 비교 · ' : ''}y = ${fn.expression}`, parameters: (data.parameters || []).map(n => `${n} = ${fn.params[n]}`).join('   ·   ') }; });
  }
  $('pngButton').onclick = async () => {
    $('pngButton').disabled = true;
    try {
      await document.fonts.ready; const graph = exportCanvas(), out = document.createElement('canvas'); out.width = Math.max(800, graph.width + 80);
      let context = out.getContext('2d'); context.font = '18px "STIX Two Math", "Malgun Gothic", serif';
      const descriptions = exportDescriptions().map(d => ({ ...d, lines: textLines(context, d.label + (d.parameters ? '    [' + d.parameters + ']' : '') + (d.data.error ? ' · 수식 오류' : ''), out.width - 100) }));
      for (const note of analysisSummary()) descriptions.push({ fn: null, lines: textLines(context, note, out.width - 100) });
      const titleLines = textLines(context, state.title || '그래프 수업', (out.width - 80) * 18 / 25), top = 50 + titleLines.length * 30;
      out.height = graph.height + top + 45 + descriptions.reduce((sum, d) => sum + d.lines.length * 25 + 10, 0);
      context = out.getContext('2d'); context.fillStyle = '#fff'; context.fillRect(0, 0, out.width, out.height); context.fillStyle = '#1c3433'; context.font = 'bold 25px "Malgun Gothic", sans-serif';
      titleLines.forEach((line, i) => context.fillText(line, 40, 40 + i * 30)); context.drawImage(graph, (out.width - graph.width) / 2, top);
      let y = graph.height + top + 30; context.font = '18px "STIX Two Math", "Malgun Gothic", serif';
      for (const d of descriptions) { context.fillStyle = d.fn ? color(d.fn) : '#1c3433'; for (const line of d.lines) { context.fillText(line, 40, y); y += 25; } y += 10; }
      const blob = await new Promise(resolve => out.toBlob(resolve, 'image/png')); if (!blob) throw Error(); download(blob, filename() + '.png'); $('exportDialog').close();
    } catch { notify('이미지를 만들지 못했어요. 다시 시도해 주세요.'); } finally { $('pngButton').disabled = false; }
  };
  function preparePrint(blank = false) {
    const sheet = $('printSheet'); sheet.replaceChildren(element('h1', '', state.title || '그래프 수업'));
    sheet.append(element('p', blank ? 'print-name' : 'print-subtitle', blank ? '학년 _____  반 _____  이름 ____________________' : '그래프 칠판 · 점선은 변화 전 비교 그래프입니다.'));
    const image = document.createElement('img'); image.alt = blank ? '빈 좌표평면' : '수식과 좌표를 표시한 그래프'; image.src = exportCanvas(blank).toDataURL(); sheet.append(image);
    if (!blank) { const formulas = element('div', 'print-formulas');
      for (const d of exportDescriptions()) { const item = element('div'), formula = element('span'); item.style.color = color(d.fn); if (d.data.error) formula.textContent = d.label + ' · 수식 오류'; else math(formula, 'y=' + C.latex(d.data.ast)); item.append(formula, element('small', '', (d.ghost ? '점선 비교 · ' : '') + d.parameters)); formulas.append(item); } sheet.append(formulas);
      const notes = analysisSummary(); if (notes.length) { const section = element('div', 'print-analysis'); notes.forEach(note => section.append(element('p', '', note))); sheet.append(section); }
    }
  }
  async function print(blank) { await document.fonts.ready; preparePrint(blank); $('exportDialog').close(); await $('printSheet').querySelector('img').decode(); window.print(); }
  $('printButton').onclick = () => print(false).catch(() => notify('인쇄 자료를 만들지 못했어요.'));
  $('blankPrintButton').onclick = () => print(true).catch(() => notify('인쇄 자료를 만들지 못했어요.'));
  window.addEventListener('beforeprint', () => { if (!$('printSheet').children.length) preparePrint(false); });
  window.addEventListener('afterprint', () => $('printSheet').replaceChildren());
  window.addEventListener('pagehide', flushSave); document.addEventListener('visibilitychange', () => { if (document.hidden) flushSave(); });
  renderLibrary(); renderAll(); setSidebar(window.innerWidth > 760); new ResizeObserver(requestDraw).observe($('canvasWrap'));
  document.fonts.ready.then(requestDraw); if (restoreWarning) notify(restoreWarning);
})();
