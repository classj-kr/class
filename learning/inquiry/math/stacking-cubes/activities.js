(function (root, factory) {
  const api = factory(typeof module === 'object' && module.exports ? require('./model.js') : root.StackingCubes);
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.StackingActivities = api;
})(typeof globalThis === 'object' ? globalThis : this, function ({ SIZE, validBoard, project }) {
  'use strict';
  const MODES = ['free', 'copy', 'views', 'many'];
  function centered(rows) {
    const board = Array(SIZE * SIZE).fill(0);
    const left = Math.floor((SIZE - rows[0].length) / 2), back = Math.floor((SIZE - rows.length) / 2);
    rows.forEach((row, z) => row.forEach((height, x) => { board[(back + z) * SIZE + left + x] = height; }));
    return board;
  }
  const shapes = [
    [[1, 2], [1, 0]],
    [[1, 2], [2, 1]],
    [[1, 2, 3], [1, 0, 1]],
    [[2, 1, 0], [1, 3, 1], [0, 1, 2]],
    [[1, 2, 1], [2, 3, 2], [1, 2, 1]],
    [[3, 1, 2], [1, 4, 1], [2, 1, 3]]
  ].map(centered);
  const many = [
    [[2, 2], [2, 1]],
    [[3, 3], [3, 1]],
    [[2, 1, 2], [2, 2, 1]],
    [[2, 3], [3, 3], [2, 1]],
    [[3, 2, 3], [2, 3, 2], [3, 2, 1]],
    [[4, 2, 4], [2, 4, 2], [4, 2, 1]]
  ].map(centered);
  const names = { free: '자유 쌓기', copy: '따라 쌓기', views: '그림 보고 쌓기', many: '여러 답 찾기' };
  const equal = (a, b) => a.length === b.length && a.every((n, i) => n === b[i]);
  function check(heights, target, mode) {
    if (!validBoard(heights) || !validBoard(target)) return { correct: false, mismatches: [] };
    if (mode === 'copy') return { correct: equal(heights, target), mismatches: [] };
    const mismatches = ['top', 'front', 'right'].filter(view => !equal(project(heights, view), project(target, view)));
    return { correct: mismatches.length === 0, mismatches };
  }
  function encode(heights, mode = 'free') {
    if (!validBoard(heights) || !MODES.includes(mode)) throw new Error('Invalid shape');
    return `#cubes1/${mode}/${heights.join('')}`;
  }
  function decode(hash) {
    const match = /^#cubes1\/(free|copy|views)\/([0-6]{25})$/.exec(hash);
    if (!match) return null;
    const heights = [...match[2]].map(Number);
    if (match[1] !== 'free' && !heights.some(Boolean)) return null;
    return { mode: match[1], heights };
  }
  function parseFile(text) {
    if (typeof text !== 'string' || text.length > 16384) return null;
    try {
      const data = JSON.parse(text);
      if (data?.type !== 'classj-stacking-cubes' || data.version !== 1 || !validBoard(data.heights)) return null;
      return data.heights.slice();
    } catch (_) { return null; }
  }
  return {
    names, check, encode, decode, parseFile,
    questions: mode => (mode === 'many' ? many : shapes).map(board => board.slice()),
    file: heights => {
      if (!validBoard(heights)) throw new Error('Invalid shape');
      return JSON.stringify({ type: 'classj-stacking-cubes', version: 1, heights }, null, 2);
    }
  };
});
