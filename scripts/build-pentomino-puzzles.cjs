// 펜토미노 문제판 만들기: 단계마다 직사각형 틀과, 그 틀을 빈틈없이 채울 수 있는 조각 묶음을 모은다.
// 묶음마다 실제로 채워지는지 되짚어 풀어 보고, 풀이 하나를 함께 적는다(검사용).
// 실행: node scripts/build-pentomino-puzzles.cjs  → learning/literacy-numeracy/math-tools/pentomino/puzzles.js
'use strict';
const fs = require('fs');
const path = require('path');

const PIECES = {
  F: [[1, 0], [2, 0], [0, 1], [1, 1], [1, 2]],
  I: [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]],
  L: [[0, 0], [0, 1], [0, 2], [0, 3], [1, 3]],
  N: [[1, 0], [1, 1], [0, 2], [1, 2], [0, 3]],
  P: [[0, 0], [1, 0], [0, 1], [1, 1], [0, 2]],
  T: [[0, 0], [1, 0], [2, 0], [1, 1], [1, 2]],
  U: [[0, 0], [2, 0], [0, 1], [1, 1], [2, 1]],
  V: [[0, 0], [0, 1], [0, 2], [1, 2], [2, 2]],
  W: [[0, 0], [0, 1], [1, 1], [1, 2], [2, 2]],
  X: [[1, 0], [0, 1], [1, 1], [2, 1], [1, 2]],
  Y: [[1, 0], [0, 1], [1, 1], [1, 2], [1, 3]],
  Z: [[0, 0], [1, 0], [1, 1], [1, 2], [2, 2]],
};
const LETTERS = Object.keys(PIECES);

function normalize(cells) {
  const mx = Math.min(...cells.map(c => c[0])), my = Math.min(...cells.map(c => c[1]));
  return cells.map(([x, y]) => [x - mx, y - my]).sort((a, b) => a[1] - b[1] || a[0] - b[0]);
}
function orientations(cells) {
  const seen = new Map();
  let cur = cells;
  for (let f = 0; f < 2; f++) {
    for (let r = 0; r < 4; r++) {
      const n = normalize(cur);
      seen.set(JSON.stringify(n), n);
      cur = cur.map(([x, y]) => [-y, x]);
    }
    cur = cells.map(([x, y]) => [-x, y]);
  }
  return [...seen.values()];
}
const ORIENT = Object.fromEntries(LETTERS.map(l => [l, orientations(PIECES[l])]));

// 틀(w×h, 빠진 칸 holes)을 letters 조각으로 채우는 풀이 하나를 찾는다. 없으면 null.
function solve(w, h, letters, holes = [], mask = null) {
  const grid = Array(w * h).fill(null);
  for (const [x, y] of holes) grid[y * w + x] = '#';
  if (mask) [...mask].forEach((m, i) => { if (m === '0') grid[i] = '#'; });
  const used = new Set();
  const placed = [];
  function rec() {
    const at = grid.indexOf(null);
    if (at < 0) return true;
    const ax = at % w, ay = Math.floor(at / w);
    for (const l of letters) {
      if (used.has(l)) continue;
      for (const o of ORIENT[l]) {
        const [fx, fy] = o[0];
        const cells = o.map(([x, y]) => [x - fx + ax, y - fy + ay]);
        if (!cells.every(([x, y]) => x >= 0 && x < w && y >= 0 && y < h && grid[y * w + x] === null)) continue;
        cells.forEach(([x, y]) => (grid[y * w + x] = l));
        used.add(l);
        placed.push(l);
        if (rec()) return true;
        placed.pop();
        used.delete(l);
        cells.forEach(([x, y]) => (grid[y * w + x] = null));
      }
    }
    return false;
  }
  return rec() ? grid.map(v => (v === '#' ? '.' : v)).join('') : null;
}

function combos(list, k, start = 0, acc = [], out = []) {
  if (acc.length === k) { out.push(acc.slice()); return out; }
  for (let i = start; i <= list.length - (k - acc.length); i++) { acc.push(list[i]); combos(list, k, i + 1, acc, out); acc.pop(); }
  return out;
}

// 결정된 무작위(판이 빌드마다 바뀌지 않게).
let seed = 20261121;
const rand = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);
const pick = list => list[Math.floor(rand() * list.length)];

function maskOf(cells) {
  const n = normalize(cells), w = Math.max(...n.map(c => c[0])) + 1, h = Math.max(...n.map(c => c[1])) + 1;
  const m = Array(w * h).fill('0');
  n.forEach(([x, y]) => (m[y * w + x] = '1'));
  return { w, h, mask: m.join('') };
}
// 첫 단계: 조각 하나를, 놓인 모양과 다르게 돌리거나 뒤집은 틀에 넣는다(X는 돌려도 같아 뺀다).
function singleStage() {
  const pool = [];
  for (const l of LETTERS) {
    const base = JSON.stringify(normalize(PIECES[l]));
    const others = ORIENT[l].filter(o => JSON.stringify(o) !== base);
    for (const o of others) {
      const f = maskOf(o);
      pool.push({ ...f, letters: l, solution: f.mask.replace(/1/g, l).replace(/0/g, '.') });
    }
  }
  return pool;
}
// 둘째 단계: 두 조각을 맞붙인 모양 틀. 짝마다 3×4~4×4 안에 드는 붙임 하나.
function pairStage() {
  const pool = [];
  for (const [a, b] of combos(LETTERS, 2)) {
    const options = [];
    for (const oa of ORIENT[a]) for (const ob of ORIENT[b]) for (let dx = -4; dx <= 4; dx++) for (let dy = -4; dy <= 4; dy++) {
      const sa = new Set(oa.map(c => c.join())), cb = ob.map(([x, y]) => [x + dx, y + dy]);
      if (cb.some(c => sa.has(c.join()))) continue;
      if (!cb.some(([x, y]) => sa.has([x + 1, y].join()) || sa.has([x - 1, y].join()) || sa.has([x, y + 1].join()) || sa.has([x, y - 1].join()))) continue;
      const f = maskOf([...oa, ...cb]);
      if (f.w * f.h > 16 || Math.max(f.w, f.h) > 5) continue;
      options.push(f);
    }
    if (!options.length) continue;
    options.sort((p, q) => p.w * p.h - q.w * q.h);
    const tight = options.filter(o => o.w * o.h <= options[0].w * options[0].h + 2);
    const f = pick(tight), w = Math.max(f.w, f.h) === f.h ? f.h : f.w;
    const g = f.h > f.w ? transpose(f) : f;
    const solution = solve(g.w, g.h, [a, b], [], g.mask);
    if (solution) pool.push({ ...g, letters: a + b, solution });
  }
  return pool;
}
function transpose(f) {
  const m = Array(f.w * f.h);
  for (let y = 0; y < f.h; y++) for (let x = 0; x < f.w; x++) m[x * f.h + y] = f.mask[y * f.w + x];
  return { w: f.h, h: f.w, mask: m.join('') };
}

// 단계: 조각 수와 틀. 셋째 단계부터 가로로 긴 직사각형(마지막 단계만 가운데가 빈 8×8도 함께).
const STAGES = [
  { pieces: 1, build: singleStage },
  { pieces: 2, build: pairStage },
  { pieces: 3, frames: [[5, 3]] },
  { pieces: 4, frames: [[5, 4]] },
  { pieces: 5, frames: [[5, 5]] },
  { pieces: 6, frames: [[6, 5], [10, 3]] },
  { pieces: 8, frames: [[8, 5], [10, 4]] },
  { pieces: 10, frames: [[10, 5]] },
  { pieces: 12, frames: [[10, 6], [12, 5], [8, 8, [[3, 3], [4, 3], [3, 4], [4, 4]]]] },
];

// 같은 단계 안 연습판 고르기: 덜 쓴 조각이 많이 든 묶음부터 골라, 열두 조각이 모두 두 번씩 나올 때까지(풀리는 묶음이 적으면 전부).
function pickPractice(pool, times = 2) {
  const count = Object.fromEntries(LETTERS.map(l => [l, 0]));
  const chosen = [];
  const left = pool.slice();
  const need = l => count[l] < times && left.some(p => p.letters.includes(l));
  while (left.length && LETTERS.some(need)) {
    left.sort((a, b) => score(b) - score(a));
    const best = left.shift();
    chosen.push(best);
    [...best.letters].forEach(l => count[l]++);
  }
  return chosen;
  function score(p) { return [...p.letters].reduce((t, l) => t + (count[l] < times ? 10 - count[l] * 4 : -count[l]), 0) + (p.w !== chosen.at(-1)?.w ? 1 : 0); }
}

const out = [];
for (const stage of STAGES) {
  let pool = [];
  if (stage.build) pool = stage.build();
  else for (const [w, h, holes = []] of stage.frames) {
    const subsets = stage.pieces === 12 ? [LETTERS] : combos(LETTERS, stage.pieces);
    for (const s of subsets) {
      const solution = solve(w, h, s, holes);
      if (!solution) continue;
      const mask = holes.length ? solution.replace(/[A-Z]/g, '1').replace(/\./g, '0') : undefined;
      pool.push({ w, h, ...(mask ? { mask } : {}), letters: s.join(''), solution });
    }
  }
  // 첫 단계는 조각마다 한 판씩(돌리기·뒤집기를 골고루), 그 뒤는 고르기.
  const practice = stage.pieces === 1
    ? LETTERS.map(l => pool.filter(p => p.letters === l)).filter(list => list.length).map(list => pick(list))
    : pool.length <= 8 ? pool.slice() : pickPractice(pool);
  out.push({ pieces: stage.pieces, pool, practice: practice.map(p => pool.indexOf(p)) });
  console.log(`조각 ${stage.pieces}개: 풀리는 묶음 ${pool.length}, 연습판 ${practice.length}`);
}
const file = path.join(__dirname, '../learning/literacy-numeracy/math-tools/pentomino/puzzles.js');
fs.mkdirSync(path.dirname(file), { recursive: true });
fs.writeFileSync(file,
  '// scripts/build-pentomino-puzzles.cjs 가 만든 파일. 손으로 고치지 말 것.\n' +
  '// 단계마다 pool: 풀리는 틀·조각 묶음 전부(순위전은 여기서 무작위로), practice: 혼자 연습 차례(pool 번호).\n' +
  `window.PENTOMINO_PIECES=${JSON.stringify(PIECES)};\n` +
  `window.PENTOMINO_STAGES=${JSON.stringify(out)};\n`);
console.log('→', path.relative(process.cwd(), file), fs.statSync(file).size, 'bytes');
