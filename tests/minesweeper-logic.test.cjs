'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const MineLogic = require('../learning/games/minesweeper/logic.js');

// Independent geometry/counts: the audit must not inherit a production neighbor bug.
function around(rows, cols, index) {
  return Array.from({ length: rows * cols }, (_, i) => i).filter(i =>
    i !== index && Math.abs(Math.floor(i / cols) - Math.floor(index / cols)) <= 1 &&
    Math.abs(i % cols - index % cols) <= 1);
}

function model(rows, cols, mines) {
  const adjacent = mines.map((_, i) => around(rows, cols, i));
  const clues = mines.map((mine, i) => mine ? -1 : adjacent[i].filter(j => mines[j]).length);
  return { rows, cols, mines, adjacent, clues };
}

function seeded(seed) {
  return () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 0x100000000;
  };
}

// Only revealed clues and the total enter deduction. Hidden answers are used
// afterwards to check a move and reveal a newly proven safe cell.
function deductions(adjacent, visible, marked, total) {
  const unknown = visible.map((v, i) => v === null && !marked.has(i) ? i : -1).filter(i => i >= 0);
  const clauses = [{ cells: new Set(unknown), need: total - marked.size }];
  visible.forEach((clue, i) => {
    if (clue === null) return;
    const cells = adjacent[i].filter(j => visible[j] === null && !marked.has(j));
    if (cells.length) clauses.push({ cells: new Set(cells), need: clue - adjacent[i].filter(j => marked.has(j)).length });
  });
  const safe = new Set(), mines = new Set();
  function bound(cells, lower, upper) {
    assert.ok(lower >= 0 && upper <= cells.size && lower <= upper, 'consistent visible constraints');
    if (upper === 0) cells.forEach(i => safe.add(i));
    if (lower === cells.size) cells.forEach(i => mines.add(i));
  }
  clauses.forEach(c => bound(c.cells, c.need, c.need));
  if (safe.size || mines.size) return { safe, mines };
  // Bound the shared part of two clues, then their disjoint parts. This is
  // separate code from the production solver's directional subtraction rule.
  for (let a = 0; a < clauses.length; a++) {
    for (let b = a + 1; b < clauses.length; b++) {
      const A = clauses[a], B = clauses[b];
      const both = new Set([...A.cells].filter(i => B.cells.has(i)));
      if (!both.size) continue;
      const onlyA = new Set([...A.cells].filter(i => !B.cells.has(i)));
      const onlyB = new Set([...B.cells].filter(i => !A.cells.has(i)));
      const lower = Math.max(0, A.need - onlyA.size, B.need - onlyB.size);
      const upper = Math.min(both.size, A.need, B.need);
      bound(both, lower, upper);
      bound(onlyA, A.need - upper, Math.min(onlyA.size, A.need - lower));
      bound(onlyB, B.need - upper, Math.min(onlyB.size, B.need - lower));
    }
  }
  return { safe, mines };
}

function independentSolve(board, start, initialVisible) {
  const total = board.mines.filter(Boolean).length;
  const visible = initialVisible ? initialVisible.slice() : board.mines.map(() => null);
  const marked = new Set();
  const steps = [];
  if (!initialVisible) visible[start] = board.clues[start];
  for (let step = 0; step < board.mines.length * 2; step++) {
    if (visible.filter(v => v !== null).length === board.mines.length - total) return { solved: true, steps };
    const next = deductions(board.adjacent, visible, marked, total);
    if (!next.safe.size && !next.mines.size) return { solved: false, steps };
    next.mines.forEach(i => { assert.equal(board.mines[i], true, `proved mine ${i}`); marked.add(i); });
    next.safe.forEach(i => { assert.equal(board.mines[i], false, `proved safe ${i}`); visible[i] = board.clues[i]; });
    steps.push({ safe: [...next.safe], mines: [...next.mines] });
  }
  throw new Error('independent solver did not terminate');
}

function combinations(size, count) {
  const all = [];
  function visit(next, selected) {
    if (selected.length === count) {
      all.push(Array.from({ length: size }, (_, i) => selected.includes(i)));
      return;
    }
    for (let i = next; i <= size - count + selected.length; i++) visit(i + 1, [...selected, i]);
  }
  visit(0, []);
  return all;
}

// Exhaustive possible-world oracle, with no production deduction rules.
function exactSolve(board, start, worlds) {
  const visible = new Map([[start, board.clues[start]]]);
  let possible = worlds;
  const target = board.mines.filter(m => !m).length;
  while (visible.size < target) {
    possible = possible.filter(candidate => [...visible].every(([i, clue]) => candidate.clues[i] === clue));
    assert.ok(possible.length > 0);
    const safe = board.mines.map((_, i) => i).filter(i => !visible.has(i) && possible.every(candidate => !candidate.mines[i]));
    if (!safe.length) return false;
    safe.forEach(i => visible.set(i, board.clues[i]));
  }
  return true;
}

test('all accepted 4×4 / 3-mine boards are solvable in an exhaustive possible-world oracle', () => {
  const worlds = combinations(16, 3).map(mines => model(4, 4, mines));
  const table = MineLogic.makeNeighborTable(4, 4);
  let accepted = 0, ambiguous = 0;
  for (const board of worlds) {
    assert.deepEqual(MineLogic.countBoard(4, 4, board.mines, table), board.clues);
    for (let start = 0; start < 16; start++) {
      if (board.mines[start]) continue;
      if (MineLogic.solvable(4, 4, board.mines, board.clues, table, start, 3)) {
        accepted++;
        assert.equal(exactSolve(board, start, worlds), true, `accepted board ${board.mines} from ${start}`);
      } else ambiguous++;
    }
  }
  console.log(`Exact audit: ${worlds.length} layouts, ${accepted} accepted starts, ${ambiguous} rejected starts`);
});

test('a real 50/50 position is rejected and exhausting generation returns no board', () => {
  const board = model(2, 2, [false, true, false, false]);
  assert.equal(MineLogic.solvable(2, 2, board.mines, board.clues, board.adjacent, 0, 1), false);
  const random = seeded(17);
  let rejected = false;
  for (let start = 0; start < 256; start++) {
    if (MineLogic.generate(16, 16, 50, start, { random, maxTries: 1 }) === null) { rejected = true; break; }
  }
  assert.equal(rejected, true, 'generation must not return an unchecked fallback');
});

test('all difficulties and all first-click cells pass independent clue-only play, 20 seeds each', () => {
  const stats = [];
  for (const [size, total] of [[8, 10], [12, 24], [16, 50]]) {
    let boards = 0, maxTries = 0;
    const adjacent = Array.from({ length: size * size }, (_, i) => around(size, size, i));
    assert.deepEqual(MineLogic.makeNeighborTable(size, size), adjacent);
    for (let seed = 1; seed <= 20; seed++) {
      const random = seeded(seed * 1009 + size);
      for (let start = 0; start < size * size; start++) {
        const generated = MineLogic.generate(size, size, total, start, { random });
        assert.ok(generated, `${size}, seed ${seed}, first ${start}`);
        assert.equal(generated.mines.length, size * size);
        assert.equal(generated.mines.filter(Boolean).length, total);
        [start, ...adjacent[start]].forEach(i => assert.equal(generated.mines[i], false));
        const clues = generated.mines.map((mine, i) => mine ? -1 : adjacent[i].filter(j => generated.mines[j]).length);
        assert.deepEqual(generated.counts, clues);
        assert.equal(independentSolve({ mines: generated.mines, clues, adjacent }, start).solved, true,
          `${size}, seed ${seed}, first ${start}: no safe logical continuation`);
        boards++;
        maxTries = Math.max(maxTries, generated.tries);
      }
    }
    stats.push({ size, boards, maxTries });
  }
  console.log('Generated-board audit:', JSON.stringify(stats));
});

test('attached board is solvable from its visible pre-loss clues without trusting player flags', () => {
  // Rows/columns are counted from the top left. Reconstructed from the supplied image.
  const mineCells = [5, 8, 9, 12, 16, 21, 25, 34, 54, 58];
  const board = model(8, 8, Array.from({ length: 64 }, (_, i) => mineCells.includes(i)));
  const rows = [
    [null, null, 1, 1, 2, null, 1, 0],
    [null, null, null, 1, null, 3, 2, 0],
    [null, null, null, 1, 2, null, 1, 0],
    [null, null, null, 1, 1, 1, 1, 0],
    [null, null, null, 1, 0, 0, 0, 0],
    [null, null, null, 1, 0, 1, 1, 1],
    [null, null, null, 1, 0, 1, null, 1],
    [null, null, null, 1, 0, 1, 1, 1]
  ];
  const visible = rows.flat();
  visible.forEach((clue, i) => { if (clue !== null) assert.equal(board.clues[i], clue, `image clue ${i}`); });
  const result = independentSolve(board, null, visible);
  assert.equal(result.solved, true);
  assert.ok(result.steps.some(step => step.safe.includes(10)), 'row 2 col 3 is provably safe');
  assert.ok(result.steps.some(step => step.safe.includes(50)), 'row 7 col 3 is provably safe');
  assert.ok(result.steps.some(step => step.mines.includes(58)), 'row 8 col 3 is a provable mine');
  console.log('Screenshot deductions:', JSON.stringify(result.steps));
});
