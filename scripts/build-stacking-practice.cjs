// 쌓기나무 혼자 하기 문제 늘리기: 바닥 칸 수(3~9칸, 넓은 판은 그 이상)와 가장 높은 층(2~4층)을 한 단계씩 올리며
// 단계마다 한 모양을 만들고, 원래 있던 모양과 함께 쌓기나무 개수 차례로 늘어놓아 activities.js 의 목록을 바꾼다.
// 「여러 답 찾기」 모양은 세 방향 그림이 같은 다른 모양이 실제로 있는지(한 칸만 바꿔 찾아) 확인한 것만 싣는다.
// 실행: node scripts/build-stacking-practice.cjs
'use strict';
const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '../learning/literacy-numeracy/math-tools/stacking-cubes/activities.js');
const { BASIC, WIDE, MAX_HEIGHT, project, countCubes, validBoard } = require('../learning/literacy-numeracy/math-tools/stacking-cubes/model.js');

let seed = 20261121;
const rand = n => { seed = (seed * 1103515245 + 12345) % 2147483648; return Math.floor(seed / 2147483648 * n); };
const views = ['top', 'front', 'right'];
const key = b => views.map(v => project(b, v).join('')).join('/');

// 이어진 바닥(변끼리 붙은 칸) n칸을 size×size 안에 키운다.
function footprint(size, n) {
  const cells = new Set([rand(size * size)]);
  while (cells.size < n) {
    const list = [...cells], c = list[rand(list.length)], x = c % size, z = Math.floor(c / size);
    const [dx, dz] = [[1, 0], [-1, 0], [0, 1], [0, -1]][rand(4)];
    const nx = x + dx, nz = z + dz;
    if (nx >= 0 && nz >= 0 && nx < size && nz < size) cells.add(nz * size + nx);
  }
  return [...cells];
}
function shape(rules, n, ceiling, total) {
  for (let tries = 0; tries < 5000; tries++) {
    const cells = footprint(rules.size, n), b = Array(rules.size ** 2).fill(0);
    cells.forEach(c => (b[c] = 1 + rand(ceiling)));
    b[cells[rand(cells.length)]] = ceiling;
    const sum = countCubes(b);
    if (sum > rules.maxCubes || (total && (sum < total[0] || sum > total[1]))) continue;
    // 바닥이 판 크기를 꽉 쓰는지(3×3 판에 2줄짜리면 바깥 칸이 비어 가운데로 옮겨진다): 행·열 모두 써야 판 크기가 맞다.
    const xs = new Set(cells.map(c => c % rules.size)), zs = new Set(cells.map(c => Math.floor(c / rules.size)));
    if (rules === WIDE && (xs.size < 4 || zs.size < 4)) continue;
    return b;
  }
  throw new Error(`못 만듦 ${n} ${ceiling}`);
}
function hasAlternative(target) {
  for (let i = 0; i < target.length; i++) for (let h = 1; h <= MAX_HEIGHT; h++) {
    if (!target[i] || h === target[i]) continue;
    const next = target.slice(); next[i] = h;
    if (validBoard(next) && key(next) === key(target)) return true;
  }
  return false;
}
// 판 → 바닥을 감싸는 최소 직사각형의 줄 목록(activities.js 의 centered 가 다시 가운데에 놓는다).
function rows(b) {
  const size = Math.sqrt(b.length), used = b.map((h, i) => [h, i % size, Math.floor(i / size)]).filter(c => c[0]);
  const x0 = Math.min(...used.map(c => c[1])), x1 = Math.max(...used.map(c => c[1])), z0 = Math.min(...used.map(c => c[2])), z1 = Math.max(...used.map(c => c[2]));
  const out = [];
  for (let z = z0; z <= z1; z++) { const r = []; for (let x = x0; x <= x1; x++) r.push(b[z * size + x]); out.push(r); }
  return out;
}

const src = fs.readFileSync(file, 'utf8');
const grab = name => {
  const m = new RegExp(`const ${name} = \\[\\n([\\s\\S]*?)\\n  \\]\\.map\\(centered\\);`).exec(src);
  return JSON.parse('[' + m[1].replace(/\s+/g, '') + ']');
};
const oldShapes = grab('shapes'), oldMany = grab('many');

function ladder(many) {
  const seen = new Set(), out = [];
  const add = b => { const k = key(b) + '|' + b.join(''); if (seen.has(k)) return false; seen.add(k); out.push(b); return true; };
  for (let n = many ? 4 : 3; n <= 9; n++) for (let c = 2; c <= 4; c++) {
    for (let t = 0; t < 400; t++) {
      const b = shape(BASIC, n, c);
      if (many && !hasAlternative(b)) continue;
      if (add(b)) break;
    }
  }
  // 넓은 판(4×4, 17~20개): 높이 3층·4층 하나씩, 바닥 10칸 안팎.
  for (const [n, c] of [[9, 3], [11, 3], [10, 4]]) for (let t = 0; t < 400; t++) {
    const b = shape(WIDE, n, c, [17, 20]);
    if (many && !hasAlternative(b)) continue;
    if (add(b)) break;
  }
  return out;
}
const centered = r => { // activities.js 와 같은 규칙으로 판을 만들어 겹침 검사
  const sum = r.flat().reduce((t, h) => t + h, 0), size = sum > BASIC.maxCubes ? WIDE.size : BASIC.size;
  const b = Array(size * size).fill(0), left = Math.floor((size - r[0].length) / 2), back = Math.floor((size - r.length) / 2);
  r.forEach((row, z) => row.forEach((h, x) => (b[(back + z) * size + left + x] = h)));
  return b;
};
function merge(old, fresh) {
  const keyOf = r => JSON.stringify(r);
  const first = old[0]; // 첫 문제는 그대로 맨 앞(검사 도구가 첫 문제를 쓴다)
  const list = [...old.slice(1), ...fresh.map(rows)].filter((r, i, a) => a.findIndex(q => keyOf(q) === keyOf(r)) === i && keyOf(r) !== keyOf(first));
  list.sort((a, b) => a.flat().reduce((t, h) => t + h, 0) - b.flat().reduce((t, h) => t + h, 0) || a.flat().filter(Boolean).length - b.flat().filter(Boolean).length);
  return [first, ...list];
}
const shapes = merge(oldShapes, ladder(false));
const many = merge(oldMany, ladder(true));
for (const r of many) if (!hasAlternative(centered(r))) throw new Error('답이 하나뿐 ' + JSON.stringify(r));
const fmt = list => list.map(r => '    ' + JSON.stringify(r).replace(/,/g, ', ')).join(',\n');
let next = src.replace(/const shapes = \[\n[\s\S]*?\n  \]\.map\(centered\);/, `const shapes = [\n${fmt(shapes)}\n  ].map(centered);`)
  .replace(/const many = \[\n[\s\S]*?\n  \]\.map\(centered\);/, `const many = [\n${fmt(many)}\n  ].map(centered);`);
fs.writeFileSync(file, next);
console.log(`따라 쌓기·그림 보고 쌓기 ${oldShapes.length} → ${shapes.length}, 여러 답 찾기 ${oldMany.length} → ${many.length}`);
