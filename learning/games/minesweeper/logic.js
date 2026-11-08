// 지뢰찾기 판 만들기와 풀어 보기.
// 판은 첫 칸을 누른 뒤에 만든다. 첫 칸 둘레 3×3에는 지뢰를 두지 않고,
// 사람이 쓰는 추론(한 단서 보기, 두 단서 겹쳐 보기, 남은 지뢰 수 보기)만으로
// 끝까지 풀리는 판이 나올 때까지 다시 만든다. 그래서 찍어야 하는 순간이 없다.
(function (root) {
  'use strict';

  function neighbors(rows, cols, index) {
    const r = Math.floor(index / cols);
    const c = index % cols;
    const list = [];
    for (let dr = -1; dr <= 1; dr += 1) {
      for (let dc = -1; dc <= 1; dc += 1) {
        if (!dr && !dc) continue;
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) list.push(nr * cols + nc);
      }
    }
    return list;
  }

  function makeNeighborTable(rows, cols) {
    return Array.from({ length: rows * cols }, (_, i) => neighbors(rows, cols, i));
  }

  function countBoard(rows, cols, mines, table) {
    return mines.map((mine, i) => (mine ? -1 : table[i].reduce((sum, j) => sum + (mines[j] ? 1 : 0), 0)));
  }

  // 사람처럼 풀어 본다. 다 열리면 true.
  function solvable(rows, cols, mines, counts, table, start, totalMines) {
    const size = rows * cols;
    const state = new Int8Array(size); // 0 모름, 1 안전(열림), 2 지뢰
    let opened = 0;
    let flagged = 0;
    const safeTarget = size - totalMines;
    const queue = [];

    function open(i) {
      if (state[i]) return;
      if (mines[i]) throw new Error('solver opened a mine');
      state[i] = 1;
      opened += 1;
      if (counts[i] === 0) for (const j of table[i]) if (!state[j]) queue.push(j);
    }
    function flag(i) {
      if (state[i]) return;
      state[i] = 2;
      flagged += 1;
    }
    function drain() {
      while (queue.length) open(queue.pop());
    }

    open(start);
    drain();

    while (opened < safeTarget) {
      let progress = false;
      const constraints = [];
      for (let i = 0; i < size; i += 1) {
        if (state[i] !== 1 || counts[i] === 0) continue;
        const unknown = [];
        let known = 0;
        for (const j of table[i]) {
          if (state[j] === 0) unknown.push(j);
          else if (state[j] === 2) known += 1;
        }
        if (!unknown.length) continue;
        const need = counts[i] - known;
        if (need === 0) { unknown.forEach(j => queue.push(j)); progress = true; }
        else if (need === unknown.length) { unknown.forEach(flag); progress = true; }
        else constraints.push({ cells: unknown, set: new Set(unknown), need });
      }
      drain();
      if (progress) continue;

      // 두 단서를 겹쳐 본다(1-1, 1-2-1 같은 꼴).
      outer:
      for (let a = 0; a < constraints.length; a += 1) {
        const A = constraints[a];
        for (let b = 0; b < constraints.length; b += 1) {
          if (a === b) continue;
          const B = constraints[b];
          let shared = 0;
          for (const j of A.cells) if (B.set.has(j)) shared += 1;
          if (!shared) continue;
          const onlyA = A.cells.filter(j => !B.set.has(j));
          const onlyB = B.cells.filter(j => !A.set.has(j));
          // A에만 있는 칸이 A와 B의 차이를 다 떠맡으면: A쪽만 칸은 모두 지뢰, B쪽만 칸은 모두 안전.
          if (A.need - B.need === onlyA.length && onlyA.length + onlyB.length > 0) {
            onlyA.forEach(flag);
            onlyB.forEach(j => queue.push(j));
            progress = true;
            break outer;
          }
        }
      }
      drain();
      if (progress) continue;

      // 남은 지뢰 수를 본다.
      const left = totalMines - flagged;
      const unknownAll = [];
      for (let i = 0; i < size; i += 1) if (!state[i]) unknownAll.push(i);
      if (left === 0) { unknownAll.forEach(j => queue.push(j)); drain(); continue; }
      if (left === unknownAll.length) { unknownAll.forEach(flag); continue; }
      return false;
    }
    return true;
  }

  function shuffleInPlace(list, random) {
    for (let i = list.length - 1; i > 0; i -= 1) {
      const j = Math.floor(random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
    return list;
  }

  // 찍지 않고 풀리는 판을 만든다. 돌려주는 값: { mines, counts, tries }
  function generate(rows, cols, totalMines, start, options = {}) {
    const random = options.random || Math.random;
    const maxTries = options.maxTries || 20000;
    const table = makeNeighborTable(rows, cols);
    const size = rows * cols;
    const banned = new Set([start, ...table[start]]);
    const pool = [];
    for (let i = 0; i < size; i += 1) if (!banned.has(i)) pool.push(i);
    for (let tries = 1; tries <= maxTries; tries += 1) {
      shuffleInPlace(pool, random);
      const mines = new Array(size).fill(false);
      for (let k = 0; k < totalMines; k += 1) mines[pool[k]] = true;
      const counts = countBoard(rows, cols, mines, table);
      if (solvable(rows, cols, mines, counts, table, start, totalMines)) return { mines, counts, tries };
    }
    return null;
  }

  const api = { generate, solvable, makeNeighborTable, countBoard, neighbors };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.MineLogic = api;
})(typeof window !== 'undefined' ? window : globalThis);
