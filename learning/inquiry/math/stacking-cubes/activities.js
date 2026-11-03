(function (root, factory) {
  const api = factory(typeof module === 'object' && module.exports ? require('./model.js') : root.StackingCubes);
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.StackingActivities = api;
})(typeof globalThis === 'object' ? globalThis : this, function (model) {
  'use strict';
  const { BASIC, WIDE, countCubes, validBoard, project } = model;
  function centered(rows) {
    const size = countCubes(rows.flat()) > BASIC.maxCubes ? WIDE.size : BASIC.size;
    const board = Array(size * size).fill(0);
    const left = Math.floor((size - rows[0].length) / 2), back = Math.floor((size - rows.length) / 2);
    rows.forEach((row, z) => row.forEach((height, x) => { board[(back + z) * size + left + x] = height; }));
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
    [[3, 1, 2], [1, 3, 1], [2, 1, 1]],
    [[4, 1, 3], [1, 4, 1], [3, 1, 1]]
  ].map(centered);
  const names = { free: '자유 쌓기', copy: '따라 쌓기', views: '그림 보고 쌓기', many: '여러 답 찾기' };
  const equal = (a, b) => a.length === b.length && a.every((n, i) => n === b[i]);
  function check(heights, target, mode) {
    if (!validBoard(heights) || !validBoard(target) || !['copy', 'views', 'many'].includes(mode)) return { correct: false, mismatches: [] };
    if (mode === 'copy') return { correct: equal(heights, target), mismatches: [] };
    const mismatches = ['top', 'front', 'right'].filter(view => !equal(project(heights, view), project(target, view)));
    return { correct: mismatches.length === 0, mismatches };
  }
  function decode(hash) {
    const match = /^#cubes1\/(free|copy|views)\/([0-6]{9}|[0-6]{16}|[0-6]{25})$/.exec(hash);
    if (!match) return null;
    const heights = [...match[2]].map(Number);
    if (!validBoard(heights) || (match[1] !== 'free' && !heights.some(Boolean))) return null;
    return { mode: match[1], heights };
  }
  return {
    names, check, decode,
    questions: mode => (mode === 'many' ? many : shapes).map(board => board.slice())
  };
});
