(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.StackingCubes = api;
})(typeof globalThis === 'object' ? globalThis : this, function () {
  'use strict';
  const SIZE = 5;
  const MAX_HEIGHT = 6;

  function validBoard(heights) {
    return Array.isArray(heights) && heights.length === SIZE * SIZE
      && Array.from(heights).every(height => Number.isInteger(height) && height >= 0 && height <= MAX_HEIGHT);
  }

  function project(heights, view) {
    if (!validBoard(heights)) throw new Error('Invalid board');
    if (view === 'top') return heights.map(height => height > 0 ? 1 : 0);
    if (view === 'front') return Array.from({ length: SIZE }, (_, x) => Math.max(...Array.from({ length: SIZE }, (_, z) => heights[z * SIZE + x])));
    // 오른쪽에서 보면 앞쪽(z가 큰 쪽)이 그림의 왼쪽에 온다.
    if (view === 'right') return Array.from({ length: SIZE }, (_, column) => Math.max(...heights.slice((SIZE - 1 - column) * SIZE, (SIZE - column) * SIZE)));
    throw new Error('Unknown view');
  }

  function createModel() {
    let heights = Array(SIZE * SIZE).fill(0);
    const history = [];
    const remember = () => {
      history.push(heights.slice());
      if (history.length > 100) history.shift();
    };
    return {
      snapshot: () => heights.slice(),
      height: (x, z) => heights[z * SIZE + x] || 0,
      count: () => heights.reduce((sum, height) => sum + height, 0),
      canUndo: () => history.length > 0,
      replace(next) {
        if (!validBoard(next)) return false;
        if (next.every((height, index) => height === heights[index])) return true;
        remember();
        heights = next.slice();
        return true;
      },
      edit(x, z, change) {
        if (!Number.isInteger(x) || !Number.isInteger(z) || x < 0 || z < 0 || x >= SIZE || z >= SIZE || ![-1, 1].includes(change)) return false;
        const index = z * SIZE + x;
        const height = heights[index] + change;
        if (height < 0 || height > MAX_HEIGHT) return false;
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
  return { SIZE, MAX_HEIGHT, createModel, validBoard, project };
});
