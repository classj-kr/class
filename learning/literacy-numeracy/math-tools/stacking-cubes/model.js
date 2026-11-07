(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.StackingCubes = api;
})(typeof globalThis === 'object' ? globalThis : this, function () {
  'use strict';
  const SIZE = 5;
  const MAX_HEIGHT = 6;
  const STANDARD = Object.freeze({ size: SIZE, maxHeight: MAX_HEIGHT, maxCubes: SIZE * SIZE * MAX_HEIGHT });
  const BASIC = Object.freeze({ size: 3, maxHeight: 4, maxCubes: 16 });
  const WIDE = Object.freeze({ size: 4, maxHeight: 4, maxCubes: 20 });
  const rulesForBoard = heights => heights?.length === 9 ? BASIC : heights?.length === 16 ? WIDE : STANDARD;
  const countCubes = heights => heights.reduce((sum, height) => sum + height, 0);

  function validBoard(heights, rules = rulesForBoard(heights)) {
    return Array.isArray(heights) && heights.length === rules.size ** 2
      && Array.from(heights).every(height => Number.isInteger(height) && height >= 0 && height <= rules.maxHeight)
      && countCubes(heights) <= rules.maxCubes;
  }

  function project(heights, view, rules = rulesForBoard(heights)) {
    if (!validBoard(heights, rules)) throw new Error('Invalid board');
    const size = rules.size;
    if (view === 'top') return heights.map(height => height > 0 ? 1 : 0);
    if (view === 'front') return Array.from({ length: size }, (_, x) => Math.max(...Array.from({ length: size }, (_, z) => heights[z * size + x])));
    // 오른쪽에서 보면 앞쪽(z가 큰 쪽)이 그림의 왼쪽에 온다.
    if (view === 'right') return Array.from({ length: size }, (_, column) => Math.max(...heights.slice((size - 1 - column) * size, (size - column) * size)));
    throw new Error('Unknown view');
  }

  function resizeBoard(heights, rules) {
    const oldSize = rulesForBoard(heights).size;
    const next = Array(rules.size ** 2).fill(0);
    for (let i = 0; i < heights.length; i++) {
      if (!heights[i]) continue;
      const x = i % oldSize, z = Math.floor(i / oldSize);
      if (x >= rules.size || z >= rules.size) return null;
      next[z * rules.size + x] = heights[i];
    }
    return validBoard(next, rules) ? next : null;
  }

  function createModel(initial = STANDARD) {
    let heights = Array(initial.size ** 2).fill(0);
    const history = [];
    const remember = () => {
      history.push(heights.slice());
      if (history.length > 100) history.shift();
    };
    return {
      snapshot: () => heights.slice(),
      get rules() { return rulesForBoard(heights); },
      height(x, z) { return heights[z * this.rules.size + x] || 0; },
      count: () => countCubes(heights),
      canUndo: () => history.length > 0,
      replace(next) {
        if (!validBoard(next)) return false;
        if (next.length === heights.length && next.every((height, index) => height === heights[index])) return true;
        remember();
        heights = next.slice();
        return true;
      },
      edit(x, z, change) {
        const rules = this.rules, size = rules.size;
        if (!Number.isInteger(x) || !Number.isInteger(z) || x < 0 || z < 0 || x >= size || z >= size || ![-1, 1].includes(change)) return false;
        const index = z * size + x;
        const height = heights[index] + change;
        if (height < 0 || height > rules.maxHeight || (change > 0 && countCubes(heights) >= rules.maxCubes)) return false;
        remember();
        heights[index] = height;
        return true;
      },
      clear() {
        if (!heights.some(Boolean)) return false;
        remember();
        heights = heights.map(() => 0);
        return true;
      },
      undo() {
        if (!history.length) return false;
        heights = history.pop();
        return true;
      },
      projection(view) {
        return project(heights, view);
      }
    };
  }
  return { SIZE, MAX_HEIGHT, STANDARD, BASIC, WIDE, rulesForBoard, countCubes, resizeBoard, createModel, validBoard, project };
});
