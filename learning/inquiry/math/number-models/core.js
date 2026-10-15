(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.NumberModels = api;
})(typeof globalThis === 'object' ? globalThis : this, function () {
  'use strict';
  // Every quantity is an integer number of the smallest cubes, including decimals.
  const WEIGHTS = [1000, 100, 10, 1], MAX_COUNT = 30;
  const MODES = {
    whole: { title: '자연수', labels: ['천', '백', '십', '일'], values: ['1000', '100', '10', '1'], scale: 1 },
    decimal: { title: '소수', labels: ['일', '소수 첫째 자리', '소수 둘째 자리', '소수 셋째 자리'], values: ['1', '0.1', '0.01', '0.001'], scale: 1000 }
  };
  const EXAMPLES = {
    'whole-add': { mode: 'whole', title: '28 + 7', counts: [0, 0, 2, 15], hint: '28에 7을 더해 놓았어요. 일 모형 10개를 십 모형 1개로 묶어 보세요.' },
    'whole-subtract': { mode: 'whole', title: '42 − 17', counts: [0, 0, 4, 2], subtract: [0, 0, 1, 7], hint: '일 모형이 부족해요. 십 모형 1개를 풀고 17을 빼 보세요.' },
    'decimal-add': { mode: 'decimal', title: '0.8 + 0.5', counts: [0, 13, 0, 0], hint: '0.8에 0.5를 더해 놓았어요. 0.1 모형 10개를 1 모형 1개로 묶어 보세요.' },
    'decimal-subtract': { mode: 'decimal', title: '1.2 − 0.5', counts: [1, 2, 0, 0], subtract: [0, 5, 0, 0], hint: '0.1 모형이 부족해요. 1 모형 1개를 풀고 0.5를 빼 보세요.' }
  };
  const copy = value => JSON.parse(JSON.stringify(value));
  const modeInfo = mode => {
    if (!Object.hasOwn(MODES, mode)) throw Error('자연수 또는 소수 모드를 선택해 주세요.');
    return MODES[mode];
  };
  const total = counts => counts.reduce((sum, n, i) => sum + n * WEIGHTS[i], 0);
  function format(units, mode) {
    modeInfo(mode);
    if (mode === 'whole') return String(units);
    return `${Math.floor(units / 1000)}.${String(units % 1000).padStart(3, '0')}`.replace(/\.?0+$/, '');
  }
  function visible(mode, places) {
    modeInfo(mode);
    return Array.from({ length: places }, (_, i) => mode === 'whole' ? 4 - places + i : i);
  }
  function validateScene(scene, mode) {
    modeInfo(mode);
    if (!scene || !Number.isInteger(scene.places) || scene.places < 2 || scene.places > 4 || !Array.isArray(scene.counts) || scene.counts.length !== 4 || scene.counts.some(n => !Number.isInteger(n) || n < 0 || n > MAX_COUNT)) throw Error('모형 개수와 표시할 자리를 확인해 주세요. 한 자리에는 30개까지 놓을 수 있어요.');
    const indexes = visible(mode, scene.places), max = WEIGHTS[indexes[0]] * 10 - 1;
    if (total(scene.counts) > max) throw Error('표시한 가장 큰 자리의 범위를 넘었어요. 자리를 늘리거나 모형을 줄여 주세요.');
    if (scene.counts.some((n, i) => n && !indexes.includes(i))) throw Error('숨기려는 자리에 모형이 있어요. 먼저 모형을 옮기거나 지워 주세요.');
    if (scene.example !== null && (!Object.hasOwn(EXAMPLES, scene.example) || EXAMPLES[scene.example].mode !== mode)) throw Error('수업 예시를 읽을 수 없어요.');
    if (typeof scene.done !== 'boolean') throw Error('수업 예시를 읽을 수 없어요.');
    return { counts: [...scene.counts], places: scene.places, example: scene.example, done: scene.done };
  }
  function initial() {
    return { version: 1, mode: 'whole', showTotal: true, scenes: {
      whole: { counts: [0, 1, 2, 3], places: 4, example: null, done: false },
      decimal: { counts: [1, 2, 3, 0], places: 4, example: null, done: false }
    } };
  }
  function validate(state) {
    if (!state || state.version !== 1 || !state.scenes || typeof state.showTotal !== 'boolean') throw Error('저장한 모형을 읽을 수 없어요.');
    modeInfo(state.mode);
    return { version: 1, mode: state.mode, showTotal: state.showTotal, scenes: { whole: validateScene(state.scenes.whole, 'whole'), decimal: validateScene(state.scenes.decimal, 'decimal') } };
  }
  function parse(value, mode) {
    modeInfo(mode);
    const text = String(value).trim();
    if (!(mode === 'whole' ? /^\d{1,4}$/ : /^\d{1,2}(?:\.\d{1,3})?$/).test(text)) throw Error(mode === 'whole' ? '0부터 9999까지의 자연수 또는 0을 입력해 주세요.' : '0부터 9.999까지, 소수 셋째 자리까지 입력해 주세요.');
    const [whole, decimal = ''] = text.split('.');
    const units = mode === 'whole' ? Number(whole) : Number(whole) * 1000 + Number(decimal.padEnd(3, '0'));
    if (units > 9999) throw Error('현재 모드의 수 범위를 넘었어요.');
    return units;
  }
  function fromNumber(scene, value, mode) {
    let remaining = parse(value, mode);
    const counts = WEIGHTS.map(weight => { const n = Math.floor(remaining / weight); remaining %= weight; return n; });
    return validateScene({ ...scene, counts, example: null, done: false }, mode);
  }
  function add(scene, index, amount, mode) {
    if (!visible(mode, scene.places).includes(index) || ![-1, 1].includes(amount)) throw Error('모형을 놓을 자리를 확인해 주세요.');
    const next = copy(scene); next.counts[index] += amount; next.example = null; next.done = false;
    return validateScene(next, mode);
  }
  function exchange(scene, index, direction, mode) {
    const indexes = visible(mode, scene.places);
    if (!indexes.includes(index) || !['bundle', 'split'].includes(direction)) throw Error('교환할 자리를 확인해 주세요.');
    const target = direction === 'bundle' ? index - 1 : index + 1;
    if (!indexes.includes(target)) throw Error('교환할 옆 자리를 먼저 표시해 주세요.');
    const removed = direction === 'bundle' ? 10 : 1, added = direction === 'bundle' ? 1 : 10;
    if (scene.counts[index] < removed) throw Error(direction === 'bundle' ? '같은 모형이 10개 모이면 묶을 수 있어요.' : '풀 모형이 없어요.');
    const next = copy(scene); next.counts[index] -= removed; next.counts[target] += added;
    return validateScene(next, mode);
  }
  function exampleScene(key) {
    if (!Object.hasOwn(EXAMPLES, key)) throw Error('예시를 확인해 주세요.');
    return { counts: [...EXAMPLES[key].counts], places: 4, example: key, done: false };
  }
  function subtract(scene, mode) {
    const example = EXAMPLES[scene.example];
    if (!example?.subtract || example.mode !== mode || scene.done) throw Error('뺄셈 예시를 먼저 골라 주세요.');
    if (scene.counts.some((n, i) => n < example.subtract[i])) throw Error('빼려는 자리의 모형이 부족해요. 큰 모형을 먼저 풀어 주세요.');
    return validateScene({ ...scene, counts: scene.counts.map((n, i) => n - example.subtract[i]), done: true }, mode);
  }
  function expression(scene, mode) {
    return scene.counts.map((n, i) => n ? `${MODES[mode].values[i]} × ${n}` : '').filter(Boolean).join(' + ') || '0';
  }
  // The small cubes have the same edge length in all four shapes.
  function blockSVG(index) {
    const [nx, ny, nz] = [[10, 10, 10], [10, 10, 1], [10, 1, 1], [1, 1, 1]][index];
    const front = ['#b7cde9', '#a8dccb', '#ffda99', '#f0b4a7'][index];
    const side = ['#82a8d1', '#70b9a0', '#dfb767', '#da8d7e'][index];
    const top = ['#d8e5f4', '#d2eee3', '#ffe9bc', '#f8d6cd'][index];
    const w = nx * 8, h = ny * 8, dx = nz * 2.8, dy = nz * 2, x = 1, y = 1 + dy;
    let body = `<path fill="${top}" d="M${x} ${y}l${dx} ${-dy}h${w}l${-dx} ${dy}Z"/><path fill="${side}" d="M${x+w} ${y}l${dx} ${-dy}v${h}l${-dx} ${dy}Z"/><path fill="${front}" d="M${x} ${y}h${w}v${h}h${-w}Z"/>`;
    for (let i = 1; i < nx; i++) body += `<path d="M${x+i*8} ${y+h}V${y}l${dx} ${-dy}"/>`;
    for (let i = 1; i < ny; i++) body += `<path d="M${x} ${y+i*8}h${w}l${dx} ${-dy}"/>`;
    for (let i = 1; i < nz; i++) body += `<path d="M${x+i*2.8} ${y-i*2}h${w}v${h}"/>`;
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${w+dx+2}" height="${h+dy+2}" style="--block-width:${w+dx+2}px;--block-height:${h+dy+2}px" viewBox="0 0 ${w+dx+2} ${h+dy+2}" aria-hidden="true" focusable="false"><g stroke="#36544d" stroke-width=".65" stroke-linejoin="round" fill="none">${body}</g></svg>`;
  }
  return { WEIGHTS, MAX_COUNT, MODES, EXAMPLES, total, format, visible, initial, validate, validateScene, parse, fromNumber, add, exchange, exampleScene, subtract, expression, blockSVG };
});
