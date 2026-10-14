// 2학년 1학기 2단원 여러 가지 도형 — 쌓기나무 그림 도구, 기본 문항(쌓기나무로 똑같이 쌓기, 쌓은 모양을 위치와 방향으로 말하기), 실력 문항.
// 단원 틀과 싣는 기준, 뺀 것과 까닭은 2-1-2a.js 머리에 있다. ref: ①n = 기본꼴_1의 n번, 심n = 심화꼴의 n번.
//
// 쌓기나무 그림
//  - 앞에서 조금 오른쪽 위로 비껴 내려다본 모습으로 그린다. 왼쪽·오른쪽은 그림에서도 왼쪽·오른쪽이고, 뒤에 있는 것은 오른쪽 위로 조금 물러나 보인다.
//    그림마다 「앞」을 화살표와 함께 적는다(앞에서 본 사람이 서 있는 쪽).
//  - 쌓기나무 3~6개의 간단한 모양만 쓴다: 옆으로 나란히 놓은 2~4개와, 그 가운데 어느 것의 위·앞·뒤에 더 놓은 것.
//  - 가려져 보이지 않는 쌓기나무를 따지는 것은 6학년이다. 쌓기나무마다 앞면이 반 넘게 보이거나 윗면이 거의 다 보이는 모양만 쓰고(면마다 보이는 정도를 점을 찍어 셈한다),
//    수를 세는 문항에는 「보이지 않는 쌓기나무는 없다」고 적는다.
//  - 「왼쪽에 있는 쌓기나무」처럼 한쪽을 묻는 기본 문항은 그쪽에 쌓기나무가 하나뿐인 모양만 쓴다(왼쪽 위에 있는 것도 왼쪽이냐는 물음이 생기지 않게).
//
// 이 단원에서 아이들이 흔히 잘못 아는 것(실력 문항의 감)
//  - 반듯하게 놓인 것만 삼각형·사각형이라고 여긴다 → 길쭉하거나 뒤집히거나 비스듬한 것을 섞고, 한 변이 굽은 것·끊어진 것·변이 4개인 뾰족한 것을 함께 놓아 뜻을 대어 세게 한다.
//    풀이에는 「곧은 선 3개로 둘러싸여 있는지만 본다」처럼 뜻의 조건만 적는다.
//  - 동그스름하면 원이라고 여긴다 → 한쪽으로 길쭉한 것, 한쪽이 좁은 것, 곧은 선이 낀 것을 크기가 다른 원과 섞는다.
//  - 「모양이 모두 같다」는 원에만 맞는 말인데 삼각형·사각형에도 맞다고 여긴다. 굽은 선도 변으로 센다.
//  - 「~의 오른쪽에 있는 쌓기나무의 위」처럼 기준이 바뀌는 말에서 처음 기준에 머문다. 왼쪽·오른쪽과 앞·뒤를 섞는다.
//  - 칠교 조각으로 만든 모양에서 작은 조각 여럿이 이룬 큰 도형을 조각 하나로 센다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, box, N, M, C } = B.kit;
  const G = B.kit.geo;
  const { TAGS, MARKS, conditions, ones, listed, setOptions, mix, tally, reasons, gallery, saying, FACT, formOf, formUnit, tanArt, tanCounts } = B.kit.g212;
  const BLOCK = '2수03-02', FIND = '2수03-03', KNOW = '2수03-04', COMMON = '2수03-05';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: '수집본 심화 자료(' + ref + ')', make }, more || {});
  const NOTE = '(보이지 않는 쌓기나무는 없다.)';

  // ── 쌓기나무의 자리 ──────────────────────────────────────────
  // [x, y, z]: x 는 왼쪽 → 오른쪽, y 는 앞 → 뒤, z 는 아래 → 위.
  const DIR = { 왼쪽: [-1, 0, 0], 오른쪽: [1, 0, 0], 위: [0, 0, 1], 앞: [0, -1, 0], 뒤: [0, 1, 0] };
  const keyOf = (c) => c.join(',');
  const add = (c, v) => [c[0] + v[0], c[1] + v[1], c[2] + v[2]];
  const has = (cubes, c) => cubes.some((b) => b[0] === c[0] && b[1] === c[1] && b[2] === c[2]);
  // 놓인 자리가 달라도 같은 모양은 같게 적는다(맨 왼쪽·맨 앞·바닥을 0으로).
  const norm = (cubes) => { const m = [0, 1, 2].map((i) => Math.min(...cubes.map((c) => c[i]))); return cubes.map((c) => [c[0] - m[0], c[1] - m[1], c[2] - m[2]]).sort((a, b) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2]); };
  const shapeKey = (cubes) => norm(cubes).map(keyOf).join(' ');
  const layersOf = (cubes) => { const out = []; cubes.forEach((c) => { out[c[2]] = (out[c[2]] || 0) + 1; }); return out; };
  const layerSaid = (cubes) => layersOf(cubes).map((v, i) => `${i + 1}층에 ${v}개`).join(', ');
  const layerExpr = (cubes) => layersOf(cubes).join('+');
  // 그림 설명에 적는 글: 뒷줄부터 줄마다 왼쪽부터 쌓은 수
  function heights(cubes) {
    const xs = cubes.map((c) => c[0]), ys = cubes.map((c) => c[1]), rows = [];
    for (let y = Math.max(...ys); y >= Math.min(...ys); y -= 1) { const row = []; for (let x = Math.min(...xs); x <= Math.max(...xs); x += 1) row.push(cubes.filter((c) => c[0] === x && c[1] === y).length); rows.push(row.join(' ')); }
    return rows.join(' / ');
  }

  // ── 쌓기나무 그림 ────────────────────────────────────────────
  // 오른쪽으로 한 칸 가면 화면에서 (AX, AY), 뒤로 한 칸 가면 (BX, −BY), 위로 한 칸 가면 (0, −1)만큼 움직인다(한 칸이 u px).
  const AX = 1, AY = 0.1, BX = 0.46, BY = 0.5;
  const pr = (x, y, z, u) => [(x * AX + y * BX) * u, (x * AY - y * BY - z) * u];
  // 쌓기나무 하나의 세 면: 윗면, 앞면, 오른쪽 옆면. NEXT: 그 면에 붙어 면을 덮는 이웃
  const facesOf = (c, u) => { const [x, y, z] = c, p = (a, b, k) => pr(a, b, k, u); return [[p(x, y, z + 1), p(x + 1, y, z + 1), p(x + 1, y + 1, z + 1), p(x, y + 1, z + 1)], [p(x, y, z), p(x + 1, y, z), p(x + 1, y, z + 1), p(x, y, z + 1)], [p(x + 1, y, z), p(x + 1, y + 1, z), p(x + 1, y + 1, z + 1), p(x + 1, y, z + 1)]]; };
  const NEXT = [DIR.위, DIR.앞, DIR.오른쪽];
  const inside = (pt, quad) => { let sign = 0; for (let i = 0; i < 4; i += 1) { const a = quad[i], b = quad[(i + 1) % 4], cr = (b[0] - a[0]) * (pt[1] - a[1]) - (b[1] - a[1]) * (pt[0] - a[0]); if (Math.abs(cr) < 1e-9) continue; if (sign && Math.sign(cr) !== sign) return false; sign = Math.sign(cr); } return true; };
  // 쌓기나무마다 세 면이 보이는 정도(0~1)와 보이는 부분의 한가운데. 면 위에 점을 고르게 찍어, 더 가까운 쌓기나무(오른쪽·앞·위로 치우친 것)에 덮이지 않은 점을 센다.
  function sightOf(cubes) {
    const out = new Map();
    cubes.forEach((c) => {
      const near = cubes.filter((b) => b !== c && b[0] >= c[0] && b[1] <= c[1] && b[2] >= c[2]).map((b) => facesOf(b, 1));
      out.set(keyOf(c), facesOf(c, 1).map((quad, f) => {
        if (has(cubes, add(c, NEXT[f]))) return { part: 0, at: null };
        let seen = 0, sx = 0, sy = 0;
        for (let i = 0; i < 6; i += 1) for (let j = 0; j < 6; j += 1) {
          const s = (i + 0.5) / 6, t = (j + 0.5) / 6, pt = [quad[0][0] + (quad[1][0] - quad[0][0]) * s + (quad[3][0] - quad[0][0]) * t, quad[0][1] + (quad[1][1] - quad[0][1]) * s + (quad[3][1] - quad[0][1]) * t];
          if (!near.some((faces) => faces.some((q) => inside(pt, q)))) { seen += 1; sx += pt[0]; sy += pt[1]; }
        }
        return { part: seen / 36, at: seen ? [sx / seen, sy / seen] : null };
      }));
    });
    return out;
  }
  // 모든 쌓기나무가 뚜렷이 보이는가: 앞면이 반 넘게 보이거나 윗면이 거의 다 보인다.
  const clear = (cubes) => { const sight = sightOf(cubes); return cubes.every((c) => { const s = sight.get(keyOf(c)); return s[1].part >= 0.5 || s[0].part >= 0.6; }); };
  const WOOD = ['#fff7dc', '#f6d27e', '#e0aa4c'], RED = ['#f9aaa2', '#ef7166', '#c9483e'], BLUE = ['#a8c7fa', '#6ea0ee', '#3f74cf'], INK = '#243042', PEN = '#1d4ed8';
  const f1 = (n) => Math.round(n * 10) / 10;
  // o: { u, tint: { 자리: 빛깔(RED, BLUE) }, marks: { 자리: 기호 } }
  function blockArt(cubes, o) {
    const opt = o || {}, u = opt.u || 27, parts = [], AREA = [AX * BY + AY * BX, 1, BX];
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    const see = (p, m) => { x0 = Math.min(x0, p[0] - (m || 0)); y0 = Math.min(y0, p[1] - (m || 0)); x1 = Math.max(x1, p[0] + (m || 0)); y1 = Math.max(y1, p[1] + (m || 0)); };
    cubes.slice().sort((a, b) => (a[0] - a[1] + a[2]) - (b[0] - b[1] + b[2])).forEach((c) => {
      const tone = (opt.tint && opt.tint[keyOf(c)]) || WOOD;
      facesOf(c, u).forEach((quad, f) => {
        if (has(cubes, add(c, NEXT[f]))) return;
        quad.forEach((p) => see(p));
        parts.push('<polygon points="' + quad.map((p) => f1(p[0]) + ',' + f1(p[1])).join(' ') + '" style="fill:' + tone[f] + ';stroke:' + INK + ';stroke-width:1.2;stroke-linejoin:round"/>');
      });
    });
    if (opt.marks) {
      // 기호는 가장 넓게 보이는 면의 보이는 부분 한가운데에 적는다.
      const sight = sightOf(cubes);
      Object.keys(opt.marks).forEach((key) => {
        const s = sight.get(key), f = s[1].part >= 0.7 ? 1 : [0, 1, 2].sort((a, b) => s[b].part * AREA[b] - s[a].part * AREA[a])[0];
        parts.push('<text class="mb-label" style="font-size:15px" x="' + f1(s[f].at[0] * u) + '" y="' + f1(s[f].at[1] * u) + '" text-anchor="middle" dominant-baseline="central">' + opt.marks[key] + '</text>');
      });
    }
    // 「앞」: 맨 앞줄보다 앞에서 뒤쪽을 가리키는 화살표
    const xs = cubes.map((c) => c[0]), front = Math.min(...cubes.map((c) => c[1])), cx = (Math.min(...xs) + Math.max(...xs) + 1) / 2;
    const from = pr(cx, front - 1.25, 0, u), to = pr(cx, front - 0.4, 0, u), len = Math.hypot(to[0] - from[0], to[1] - from[1]), ux = (to[0] - from[0]) / len, uy = (to[1] - from[1]) / len, base = [to[0] - ux * 6.5, to[1] - uy * 6.5], word = [from[0] - ux * 9, from[1] - uy * 9];
    parts.push('<line x1="' + f1(from[0]) + '" y1="' + f1(from[1]) + '" x2="' + f1(base[0]) + '" y2="' + f1(base[1]) + '" style="stroke:' + PEN + ';stroke-width:1.8;stroke-linecap:round"/>'
      + '<polygon points="' + [to, [base[0] - uy * 3.4, base[1] + ux * 3.4], [base[0] + uy * 3.4, base[1] - ux * 3.4]].map((p) => f1(p[0]) + ',' + f1(p[1])).join(' ') + '" style="fill:' + PEN + '"/>'
      + '<text class="mb-label" style="font-size:12.5px;font-weight:700;fill:' + PEN + '" x="' + f1(word[0]) + '" y="' + f1(word[1]) + '" text-anchor="middle" dominant-baseline="central">앞</text>');
    see(word, 8); see(to);
    const side = Math.max(4, (66 - (x1 - x0)) / 2), w = x1 - x0 + side * 2, h = y1 - y0 + 8;
    // 그림 설명: 줄마다 쌓은 수와 층마다의 수, 색칠한 쌓기나무와 기호가 놓인 자리
    const spot = (key) => { const c = key.split(',').map(Number); return `앞에서 ${c[1] - front + 1}번째 줄, 왼쪽에서 ${c[0] - Math.min(...xs) + 1}번째, ${c[2] + 1}층`; };
    const noted = Object.keys(opt.tint || {}).map((key) => `${opt.tint[key] === RED ? '빨간색' : '파란색'} 쌓기나무: ${spot(key)}`).concat(Object.keys(opt.marks || {}).map((key) => `${opt.marks[key]}: ${spot(key)}`));
    const said = '쌓기나무를 쌓은 모양. 뒷줄부터 줄마다 왼쪽부터 쌓은 수: ' + heights(cubes) + '. ' + layerSaid(cubes) + (noted.length ? '. ' + noted.join(' / ') : '');
    return '<svg class="mb-geo" viewBox="' + f1(x0 - side) + ' ' + f1(y0 - 4) + ' ' + f1(w) + ' ' + f1(h) + '" width="' + Math.ceil(w) + '" role="img" aria-label="' + said + '">' + parts.join('') + '</svg>';
  }
  const tiles = (list) => G.tiles(list).replace('class="mb-tiles"', 'class="mb-tiles" style="flex:1 1 100%"');

  // ── 쌓은 모양의 틀 ───────────────────────────────────────────
  // 옆으로 나란히 놓은 n개(바닥 줄)와, 그 가운데 어느 것의 위·앞·뒤에 더 놓은 것들 adds: [[자리, 쪽, 개수] …].
  // 4개를 나란히 놓은 모양은 맨 왼쪽과 맨 오른쪽에만 더 놓는다(가운데 둘은 부를 이름이 마땅치 않다).
  const POS = { 2: ['왼쪽', '오른쪽'], 3: ['왼쪽', '가운데', '오른쪽'], 4: ['맨 왼쪽', null, null, '맨 오른쪽'] };
  function rawOf(n, adds) {
    const out = [];
    for (let i = 0; i < n; i += 1) out.push([i, 0, 0]);
    adds.forEach(([i, dir, k]) => { for (let j = 1; j <= k; j += 1) out.push(dir === '위' ? [i, 0, j] : dir === '앞' ? [i, -1, 0] : [i, 1, 0]); });
    return out;
  }
  // 바닥 줄이 가장 긴 줄이어야 「n개가 옆으로 나란히」가 한 가지로 읽힌다.
  const rowOk = (n, adds) => ['앞', '뒤'].every((dir) => adds.filter((a) => a[1] === dir).length < n);
  const told = (n, adds) => `쌓기나무 ${n}개가 옆으로 나란히 있` + (adds.length ? '고, ' + adds.map(([i, dir, k]) => `${POS[n][i]} 쌓기나무 ${dir}에 ${k}개`).join(', ') + '가 있다.' : '다.');
  // 쌓기나무 3~6개로 된, 모든 쌓기나무가 뚜렷이 보이는 모양 모두(처음 쓸 때 한 번 만든다)
  let POOL = null;
  function pool() {
    if (POOL) return POOL;
    const out = [], seen = new Set();
    for (const n of [2, 3, 4]) {
      const options = [];
      POS[n].forEach((name, i) => { if (name) options.push([i, '위', 1], [i, '위', 2], [i, '앞', 1], [i, '뒤', 1]); });
      const walk = (from, adds) => {
        const raw = rawOf(n, adds);
        if (raw.length > 6) return;
        if (raw.length >= 3 && rowOk(n, adds) && clear(raw)) { const key = shapeKey(raw); if (!seen.has(key)) { seen.add(key); out.push({ n, adds, raw, cubes: norm(raw), key, count: raw.length, floors: layersOf(raw).length }); } }
        if (adds.length === 2) return;                 // 더 놓는 것은 두 군데까지만(간단한 모양)
        for (let j = from; j < options.length; j += 1) if (!adds.some((a) => a[0] === options[j][0] && a[1] === options[j][1])) walk(j + 1, adds.concat([options[j]]));
      };
      walk(0, []);
    }
    POOL = out;
    return out;
  }
  const sized = (lo, hi) => pool().filter((s) => s.count >= lo && s.count <= (hi || lo));
  // 바닥 줄을 맞추어 놓았을 때 서로 다른 쌓기나무의 수(수가 같은 두 모양에서 1이면 쌓기나무 하나만 다른 자리에 있다)
  const apart = (a, b) => a.raw.filter((c) => !has(b.raw, c)).length;
  // 쌓기나무의 수와 바닥 줄은 같고 한 개만 다른 자리에 놓인 모양들
  const nearOf = (s) => pool().filter((x) => x.n === s.n && x.count === s.count && apart(x, s) === 1);
  const sameWays = (a, b) => a.adds.map((x) => x[1] + x[2]).sort().join() === b.adds.map((x) => x[1] + x[2]).sort().join();
  // 기호를 붙일 차례: 왼쪽부터, 앞에서부터, 아래에서부터
  const ordered = (cubes) => cubes.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2]);
  const marksOf = (cubes, skip) => { const out = {}; ordered(cubes).filter((c) => !(skip || []).some((s) => keyOf(s) === keyOf(c))).forEach((c, i) => { out[keyOf(c)] = MARKS[i]; }); return out; };
  // 그 쪽으로 곧게 나아간 줄 위에 있는 쌓기나무들(가까운 것부터)
  const along = (cubes, c, dir) => { const v = DIR[dir], out = []; for (let k = 1; k <= 4; k += 1) { const p = [c[0] + v[0] * k, c[1] + v[1] * k, c[2] + v[2] * k]; if (has(cubes, p)) out.push(p); } return out; };
  // 그 쪽에 있는 쌓기나무 모두(위·아래나 앞·뒤로 어긋난 것까지)
  const toward = (cubes, c, dir) => { const v = DIR[dir]; return cubes.filter((b) => (b[0] - c[0]) * v[0] + (b[1] - c[1]) * v[1] + (b[2] - c[2]) * v[2] > 0); };

  // 처음 모양 A 에서 쌓기나무 1개를 옮기는 방법 모두: 위에 다른 것이 없는 쌓기나무를 빼서, 바닥이나 다른 쌓기나무 위·옆의 빈 자리에 놓는다.
  function movesOf(A) {
    const out = [];
    A.forEach((c, i) => {
      if (has(A, add(c, DIR.위))) return;
      const rest = A.filter((_, j) => j !== i), spots = new Map();
      rest.forEach((b) => Object.keys(DIR).forEach((dir) => { const p = add(b, DIR[dir]); if (!has(rest, p) && keyOf(p) !== keyOf(c) && (p[2] === 0 || has(rest, add(p, [0, 0, -1]))) && !spots.has(keyOf(p))) spots.set(keyOf(p), { to: p, by: b, dir }); }));
      // 놓을 자리를 부르는 말은 「~의 위」를 먼저 쓴다.
      spots.forEach((spot) => { const under = add(spot.to, [0, 0, -1]); out.push({ from: c, to: spot.to, by: has(rest, under) ? under : spot.by, dir: has(rest, under) ? '위' : spot.dir, made: rest.concat([spot.to]) }); });
    });
    return out;
  }
  const connected = (cubes) => { const seen = new Set([keyOf(cubes[0])]), queue = [cubes[0]]; while (queue.length) { const c = queue.pop(); [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]].forEach((v) => { const p = add(c, v); if (has(cubes, p) && !seen.has(keyOf(p))) { seen.add(keyOf(p)); queue.push(p); } }); } return seen.size === cubes.length; };
  // 처음 모양과 옮기는 방법 하나: 만든 모양이 처음 모양과 다르고, 모든 쌓기나무가 보이고, 그렇게 만들 수 있는 쌓기나무가 하나뿐이다.
  // alone: 옮길 쌓기나무가 바닥에 혼자 놓인 것(위아래에 다른 쌓기나무가 없다). 여러 층으로 쌓인 줄에서 빼면 「아래 것을 빼도 같은 모양」이라는 말이 나오므로, 옮길 쌓기나무만 고르는 문항은 이것만 쓴다.
  function movePuzzle(d, lo, hi, alone) {
    return d.until(() => { const s = d.pick(sized(lo, hi)), all = movesOf(s.cubes), move = d.pick(all); return { s, all, move }; }, ({ s, all, move }) => {
      const key = shapeKey(move.made);
      return key !== s.key && (!alone || move.from[2] === 0) && connected(move.made) && clear(norm(move.made)) && new Set(all.filter((m) => shapeKey(m.made) === key).map((m) => keyOf(m.from))).size === 1;
    });
  }

  B.addTypes('2-1-2', 'blocks', [
    T('blk-need', '똑같이 쌓는 데 필요한 쌓기나무의 수', '①37 심21', (d) => {
      const s = d.pick(sized(4, 6).filter((x) => x.floors >= 2));
      return N('똑같은 모양으로 쌓으려면 쌓기나무가 몇 개 필요한가? ' + NOTE, s.count, { unit: '개', figure: blockArt(s.cubes), explain: `${layerSaid(s.cubes)}이므로 모두 ${s.count}개이다.`, facts: { calc: [[layerExpr(s.cubes), 0]] } });
    }),
    T('blk-same', '똑같이 쌓은 모양 찾기', '①38', (d) => {
      // 쌓기나무의 수는 모두 같다. 한 개만 다른 자리에 놓은 모양과 섞는다.
      const { s, others } = d.until(() => { const s0 = d.pick(sized(4, 5).filter((x) => x.adds.length >= 1)); return { s: s0, others: d.shuffle(nearOf(s0)).slice(0, 2) }; }, (v) => v.others.length === 2);
      const list = d.shuffle([s].concat(others));
      return C('보기와 똑같은 모양으로 쌓은 것은?', TAGS.slice(0, 3), list.indexOf(s), {
        figure: tiles([['보기', blockArt(s.cubes)]].concat(list.map((x, i) => [TAGS[i], blockArt(x.cubes)]))), explain: `보기는 ${told(s.n, s.adds).replace(/다\.$/, '는 모양이다.')} 쌓기나무가 놓인 자리가 모두 같은 것은 ${TAGS[list.indexOf(s)]}이다.`,
        facts: { truth: list.map((x) => shapeKey(x.raw) === s.key), want: true }
      });
    }),
    T('blk-pick-n', '쌓기나무 몇 개로 쌓은 모양 고르기', '①39 심22', (d) => {
      const n = d.pick([4, 5]), hit = d.int(1, 2), list = d.shuffle(d.shuffle(sized(n)).slice(0, hit).concat(d.shuffle(sized(n - 1).concat(sized(n + 1))).slice(0, 4 - hit)));
      const flags = list.map((s) => s.cubes.length === n), made = setOptions(d, TAGS.slice(0, 4), flags);
      return C(`쌓기나무 ${n}개로 쌓은 모양을 모두 고른 것은? ${NOTE}`, made.options, made.answer, {
        figure: tiles(list.map((s, i) => [TAGS[i], blockArt(s.cubes)])), explain: list.map((s, i) => `${TAGS[i]} ${s.count}개`).join(', ') + '이다.', facts: { sets: { labels: TAGS.slice(0, 4), flags, options: made.sets } }
      });
    }),
    T('blk-odd', '쌓기나무의 수가 다른 하나', '①40 심23', (d) => {
      const n = d.pick([4, 5]), list = d.shuffle(d.shuffle(sized(n)).slice(0, 3).concat([d.pick(sized(n - 1).concat(sized(n + 1)))])), at = list.findIndex((s) => s.count !== n);
      return C(`쌓기나무의 수가 나머지와 다른 하나는? ${NOTE}`, TAGS.slice(0, 4), at, {
        figure: tiles(list.map((s, i) => [TAGS[i], blockArt(s.cubes)])), explain: list.map((s, i) => `${TAGS[i]} ${s.count}개`).join(', ') + '이다.', facts: { choose: { exprs: list.map((s) => layerExpr(s.cubes)), rule: 'odd' } }
      });
    }),
    T('blk-left', '쌓고 남은 쌓기나무의 수', '①41', (d) => {
      const s = d.pick(sized(4, 6)), total = s.count + d.int(2, Math.min(4, 9 - s.count));
      return N(`쌓기나무 ${total}개 가운데 몇 개로 그림과 같은 모양을 쌓았다. 남은 쌓기나무는 몇 개인가? ${NOTE}`, total - s.count, {
        unit: '개', figure: blockArt(s.cubes), explain: `쌓은 모양의 쌓기나무는 ${s.count}개이다. ${total} − ${s.count} = ${total - s.count}이므로 ${total - s.count}개가 남는다.`, facts: { calc: [[`${total}-(${layerExpr(s.cubes)})`, 0]] }
      });
    }),
    T('blk-more', '더 필요한 쌓기나무의 수', '①42', (d) => {
      // 가 모양은 나 모양에서 몇 개를 덜어 낸 것이다(바닥 줄은 같다).
      const { a, b } = d.until(() => { const b0 = d.pick(sized(5, 6)); return { b: b0, a: d.pick(pool().filter((x) => x.n === b0.n && x.count < b0.count && x.raw.every((c) => has(b0.raw, c))).concat([null])) }; }, (v) => v.a && v.b.count - v.a.count <= 3);
      return N(`가 모양에 쌓기나무를 더 놓아 나 모양과 똑같이 쌓으려고 한다. 쌓기나무는 몇 개 더 필요한가? ${NOTE}`, b.count - a.count, {
        unit: '개', figure: tiles([['가', blockArt(a.cubes)], ['나', blockArt(b.cubes)]]), explain: `가는 ${a.count}개, 나는 ${b.count}개이다. ${b.count} − ${a.count} = ${b.count - a.count}이므로 ${b.count - a.count}개가 더 필요하다.`,
        facts: { calc: [[`(${layerExpr(b.cubes)})-(${layerExpr(a.cubes)})`, 0]] }
      });
    }),
    T('blk-move', '쌓기나무 1개를 옮겨 똑같이 만들기', '①43 심24', (d) => {
      const { s, move } = movePuzzle(d, 4, 5, true), list = ordered(s.cubes), marks = marksOf(s.cubes), at = list.findIndex((c) => keyOf(c) === keyOf(move.from));
      return C('처음 모양에서 쌓기나무 1개를 옮겨 만들 모양과 똑같이 쌓으려고 한다. 옮겨야 할 쌓기나무는?', MARKS.slice(0, list.length), at, {
        figure: tiles([['처음 모양', blockArt(s.cubes, { marks })], ['만들 모양', blockArt(norm(move.made))]]),
        explain: `${MARKS[at]}을 ${marks[keyOf(move.by)]}의 ${josa(move.dir, '으로/로')} 옮기면 만들 모양과 똑같아진다.`,
        facts: { truth: list.map((c) => movesOf(s.cubes).some((m) => keyOf(m.from) === keyOf(c) && shapeKey(m.made) === shapeKey(move.made))), want: true }
      });
    }),
    T('blk-compare', '두 모양의 쌓기나무의 수와 층', '①45', (d) => {
      // 쌓기나무의 수는 같고 층수는 다른 두 모양
      const [a, b] = d.until(() => d.shuffle(sized(4, 5)).slice(0, 2), ([x, y]) => x.count === y.count && x.floors !== y.floors);
      const rows = [['가와 나는 쌓기나무의 수가 같다.', a.count === b.count], [`가는 ${a.floors}층, 나는 ${b.floors}층으로 쌓았다.`, true], ['가와 나는 쌓기나무의 수가 다르다.', a.count !== b.count], ['가는 나보다 쌓기나무가 1개 더 많다.', a.count === b.count + 1],
        [`가와 나는 모두 ${a.floors}층으로 쌓았다.`, a.floors === b.floors], [`가는 ${b.floors}층, 나는 ${a.floors}층으로 쌓았다.`, a.floors === b.floors]];
      const made = saying(d, rows, 1, 3);
      return C(`쌓기나무로 쌓은 모양 가와 나에 대한 설명으로 옳은 것은? ${NOTE}`, made.options, made.truth.indexOf(true), {
        figure: tiles([['가', blockArt(a.cubes)], ['나', blockArt(b.cubes)]]), explain: `가는 ${a.count}개를 ${a.floors}층으로, 나는 ${b.count}개를 ${b.floors}층으로 쌓았다.`, facts: { truth: made.truth, want: true }
      });
    })
  ]);

  B.addTypes('2-1-2', 'place', [
    T('pos-find', '빨간색 쌓기나무의 왼쪽·오른쪽·위·앞·뒤에 있는 쌓기나무', '①46 심26', (d, n) => {
      // 그쪽에 있는 쌓기나무가 바로 옆의 하나뿐인 모양만 쓴다.
      const { s, red, dir } = d.until(() => { const s0 = d.pick(sized(5)); return { s: s0, red: d.pick(s0.cubes), dir: d.pick(n === 0 ? ['왼쪽', '오른쪽'] : ['위', '앞', '뒤']) }; },
        (v) => { const side = toward(v.s.cubes, v.red, v.dir); return side.length === 1 && keyOf(side[0]) === keyOf(add(v.red, DIR[v.dir])); });
      const rest = ordered(s.cubes).filter((c) => keyOf(c) !== keyOf(red)), marks = marksOf(s.cubes, [red]), at = rest.findIndex((c) => keyOf(c) === keyOf(add(red, DIR[dir])));
      return C(`빨간색 쌓기나무의 ${dir}에 있는 쌓기나무는?`, MARKS.slice(0, rest.length), at, {
        figure: blockArt(s.cubes, { u: 34, marks, tint: { [keyOf(red)]: RED } }), explain: `「앞」이라고 쓴 쪽에서 볼 때 빨간색 쌓기나무의 ${dir}에 있는 쌓기나무는 ${MARKS[at]}이다.`,
        facts: { truth: rest.map((c) => along(s.cubes, red, dir).some((p) => keyOf(p) === keyOf(c))), want: true }
      });
    }, { count: 2 }),
    T('pos-both', '두 조건에 모두 맞는 쌓기나무', '①47', (d) => {
      // 옆에 빨간색, 위에 파란색 쌓기나무가 있는 것. 한 조건에만 맞는 쌓기나무도 섞여 있다.
      const side = d.pick(['왼쪽', '오른쪽']), fits = (cubes, c, red, blue) => [along(cubes, c, side).some((p) => keyOf(p) === keyOf(red)), along(cubes, c, '위').some((p) => keyOf(p) === keyOf(blue))];
      const { s, x, red, blue } = d.until(() => { const s0 = d.pick(sized(5, 6)), x0 = d.pick(s0.cubes); return { s: s0, x: x0, red: add(x0, DIR[side]), blue: add(x0, DIR.위) }; }, (v) => {
        if (!has(v.s.cubes, v.red) || !has(v.s.cubes, v.blue)) return false;
        const rest = v.s.cubes.filter((c) => keyOf(c) !== keyOf(v.red) && keyOf(c) !== keyOf(v.blue)), got = rest.map((c) => fits(v.s.cubes, c, v.red, v.blue));
        return rest.length >= 3 && got.filter((g) => g[0] && g[1]).length === 1 && got.some((g) => g[0] !== g[1]);
      });
      const rest = ordered(s.cubes).filter((c) => keyOf(c) !== keyOf(red) && keyOf(c) !== keyOf(blue)), marks = marksOf(s.cubes, [red, blue]), at = rest.findIndex((c) => keyOf(c) === keyOf(x));
      return C(`${side}에 빨간색 쌓기나무가 있고, 위에 파란색 쌓기나무가 있는 쌓기나무는?`, MARKS.slice(0, rest.length), at, {
        figure: blockArt(s.cubes, { u: 34, marks, tint: { [keyOf(red)]: RED, [keyOf(blue)]: BLUE } }),
        explain: `${MARKS[at]}의 ${side}에 빨간색 쌓기나무가, 위에 파란색 쌓기나무가 있다.`,
        facts: { truth: rest.map((c) => fits(s.cubes, c, red, blue).every(Boolean)), want: true }
      });
    }),
    T('pos-read', '설명을 읽고 쌓은 모양 고르기', '①48·49 심28', (d, n) => {
      // n = 0: 위에 놓은 것 하나, 1: 앞이나 뒤에 놓은 것 하나, 2: 위와 앞(뒤)에 하나씩. 틀린 모양은 쌓기나무 하나만 다른 자리에 있다.
      const want = (s) => { const dirs = s.adds.map((a) => a[1]).sort().join(); return s.n >= 3 && s.adds.every((a) => a[2] === 1) && (n === 0 ? dirs === '위' : n === 1 ? dirs === '앞' || dirs === '뒤' : dirs === '앞,위' || dirs === '뒤,위'); };
      const { s, others } = d.until(() => { const s0 = d.pick(pool().filter(want)), near = d.shuffle(nearOf(s0)), same = near.filter((x) => sameWays(x, s0)), other = near.filter((x) => !sameWays(x, s0)); return { s: s0, others: same.slice(0, 2).concat(other.slice(0, 3 - Math.min(2, same.length))) }; },
        (v) => v.others.length === 3 && v.others.some((x) => sameWays(x, v.s)) && v.others.some((x) => !sameWays(x, v.s)));
      const list = d.shuffle([s].concat(others));
      return C('설명대로 쌓은 모양은?', TAGS.slice(0, 4), list.indexOf(s), {
        figure: conditions([told(s.n, s.adds)]) + tiles(list.map((x, i) => [TAGS[i], blockArt(x.cubes)])), explain: `「앞」이라고 쓴 쪽에서 볼 때의 왼쪽, 오른쪽, 앞, 뒤로 읽는다. 설명대로 쌓은 모양은 ${TAGS[list.indexOf(s)]}이다.`,
        facts: { truth: list.map((x) => shapeKey(rawOf(s.n, s.adds)) === x.key), want: true }
      });
    }, { count: 3 }),
    T('pos-fill', '쌓은 모양을 설명하는 말의 빈칸에 수 넣기', '①50 심29', (d, n) => {
      if (n === 0) {
        const s = d.pick(pool().filter((x) => x.adds.length === 1 && x.adds[0][1] === '위')), [i, , k] = s.adds[0], lay = layersOf(s.cubes);
        return M(`㉠, ㉡에 알맞은 수는? ${NOTE}`, [{ label: '㉠', answer: s.n }, { label: '㉡', answer: k }], {
          figure: blockArt(s.cubes, { u: 32 }) + conditions([`쌓기나무 ${box('㉠')}개가 옆으로 나란히 있고, ${POS[s.n][i]} 쌓기나무 위에 ${box('㉡')}개가 있다.`]),
          explain: `1층에 ${s.n}개가 옆으로 나란히 있다. ${POS[s.n][i]} 쌓기나무 위에 ${k}개가 있다.`, facts: { calc: [[String(lay[0]), 0], [lay.slice(1).join('+'), 1]] }
        });
      }
      if (n === 1) {
        const s = d.pick(sized(4, 6).filter((x) => x.floors === 2)), lay = layersOf(s.cubes);
        return M(`㉠, ㉡에 알맞은 수는? ${NOTE}`, [{ label: '㉠', answer: lay[0] }, { label: '㉡', answer: lay[1] }], {
          figure: blockArt(s.cubes, { u: 32 }) + conditions([`1층에 ${box('㉠')}개, 2층에 ${box('㉡')}개가 있다.`]), explain: `바닥에 놓인 쌓기나무가 1층이고, 그 위에 놓인 쌓기나무가 2층이다. ${layerSaid(s.cubes)}가 있다.`,
          facts: { calc: [[String(lay[0]), 0], [String(lay[1]), 1]], parts: [0, 1].map((z) => [ones(s.cubes.filter((c) => c[2] === z).length), z]) }
        });
      }
      // 빨간색 쌓기나무의 옆으로 a개, 위로 b개. 그쪽에 있는 쌓기나무는 모두 한 줄로 놓여 있다.
      const side = d.pick(['왼쪽', '오른쪽']);
      const { s, red } = d.until(() => { const s0 = d.pick(sized(4, 6)); return { s: s0, red: d.pick(s0.cubes) }; }, (v) => {
        const a = along(v.s.cubes, v.red, side), b = along(v.s.cubes, v.red, '위');
        return a.length >= 1 && b.length >= 1 && a.length !== b.length && toward(v.s.cubes, v.red, side).length === a.length && toward(v.s.cubes, v.red, '위').length === b.length;
      });
      const a = along(s.cubes, red, side).length, b = along(s.cubes, red, '위').length;
      return M(`㉠, ㉡에 알맞은 수는? ${NOTE}`, [{ label: '㉠', answer: a }, { label: '㉡', answer: b }], {
        figure: blockArt(s.cubes, { u: 32, tint: { [keyOf(red)]: RED } }) + conditions([`빨간색 쌓기나무의 ${side}에 ${box('㉠')}개, 위에 ${box('㉡')}개가 있다.`]),
        explain: `「앞」이라고 쓴 쪽에서 볼 때 빨간색 쌓기나무의 ${side}에 ${a}개, 위에 ${b}개가 있다.`, facts: { parts: [[ones(toward(s.cubes, red, side).length), 0], [ones(toward(s.cubes, red, '위').length), 1]] }
      });
    }, { count: 3 }),
    T('pos-word', '빨간색 쌓기나무의 어느 쪽에 있는지 말하기', '①51', (d) => {
      const { s, red, dir } = d.until(() => { const s0 = d.pick(sized(5)); return { s: s0, red: d.pick(s0.cubes), dir: d.pick(Object.keys(DIR)) }; }, (v) => has(v.s.cubes, add(v.red, DIR[v.dir])));
      const it = add(red, DIR[dir]), words = d.shuffle([dir].concat(d.shuffle(Object.keys(DIR).filter((w) => w !== dir)).slice(0, 3)));
      return C('㉠ 쌓기나무는 빨간색 쌓기나무의 어느 쪽에 있는가?', words, words.indexOf(dir), {
        figure: blockArt(s.cubes, { u: 34, marks: { [keyOf(it)]: '㉠' }, tint: { [keyOf(red)]: RED } }), explain: `「앞」이라고 쓴 쪽에서 볼 때 ㉠은 빨간색 쌓기나무의 ${dir}에 있다.`,
        facts: { truth: words.map((w) => keyOf(add(red, DIR[w])) === keyOf(it)), want: true }
      });
    }),
    T('pos-words', '쌓은 모양을 설명하는 말의 빈칸에 자리와 쪽 넣기', '심30', (d) => {
      const s = d.pick(pool().filter((x) => x.n === 3 && x.adds.length === 1 && x.adds[0][2] === 1)), [i, dir] = s.adds[0];
      const j = d.pick([0, 1, 2].filter((v) => v !== i)), way = d.pick(['위', '앞', '뒤'].filter((w) => w !== dir)), rows = d.shuffle([[i, dir], [j, dir], [i, way], [j, way]]);
      return C('쌓은 모양을 설명한 것이다. ㉠, ㉡에 알맞은 말을 바르게 짝 지은 것은?', rows.map(([p, w]) => `㉠ ${POS[3][p]}, ㉡ ${w}`), rows.findIndex(([p, w]) => p === i && w === dir), {
        figure: blockArt(s.cubes, { u: 32 }) + conditions([`쌓기나무 3개가 옆으로 나란히 있고, ${box('㉠')} 쌓기나무 ${box('㉡')}에 1개가 있다.`]), explain: told(3, s.adds),
        facts: { truth: rows.map(([p, w]) => shapeKey(rawOf(3, [[p, w, 1]])) === s.key), want: true }
      });
    }),
    T('pos-wrong', '쌓은 모양을 설명하는 말에서 틀린 부분', '①52', (d) => {
      // 나란히 놓은 수, 자리, 위에 놓은 수 가운데 하나만 그림과 다르게 적는다.
      const s = d.pick(pool().filter((x) => x.n === 3 && x.adds.length === 1 && x.adds[0][1] === '위')), [i, , k] = s.adds[0], at = d.int(0, 2), said = [3, i, k];
      said[at] = at === 0 ? d.pick(i === 1 ? [4] : [2, 4]) : at === 1 ? d.pick([0, 1, 2].filter((v) => v !== i)) : 3 - k;
      const mark = (tag, word) => `<span style="text-decoration:underline;text-underline-offset:3px">${tag} ${word}</span>`;
      // 그 부분만 고치면 그림과 같아지는가(다른 값으로 바꾸어 본다)
      const fixes = (j) => [[2, 3, 4], [0, 1, 2], [1, 2]][j].some((v) => { const t = said.slice(); t[j] = v; return v !== said[j] && t[1] < t[0] && shapeKey(rawOf(t[0], [[t[1], '위', t[2]]])) === s.key; });
      return C('쌓은 모양을 설명한 것이다. ㉠~㉢ 중 틀린 부분은?', MARKS.slice(0, 3), at, {
        figure: blockArt(s.cubes, { u: 32 }) + conditions([`쌓기나무 ${mark('㉠', said[0] + '개')}가 옆으로 나란히 있고, ${mark('㉡', POS[3][said[1]])} 쌓기나무 위에 ${mark('㉢', said[2] + '개')}가 있다.`]),
        explain: `바르게 설명하면 「${told(3, s.adds)}」이다.`, facts: { truth: [0, 1, 2].map(fixes), want: true }
      });
    })
  ]);

  // ── 실력 ─────────────────────────────────────────────────────
  // 삼각형·사각형·원을 뜻을 대어 세는 문항의 그림: 맞는 것(길쭉하거나 비스듬한 것을 두 개 넘게), 아슬아슬하게 다른 것, 뚜렷이 다른 것
  function trapSet(d, kind, traps, fillers) {
    return d.until(() => {
      const hit = d.int(2, 4), near = d.int(3, 4), odd = Math.min(hit, kind === 'circle' ? hit : d.int(2, 3));
      const recipe = (kind === 'circle' ? [['circle', hit]] : [[kind, odd, 'odd'], [kind, hit - odd, 'plain']]).concat(tally(d.shuffle(traps).slice(0, near)), tally(d.shuffle(fillers).slice(0, Math.max(0, 8 - hit - near))));
      return mix(d, recipe.filter((row) => row[1] > 0));
    }, (list) => list.length >= 7 && list.length <= 9);
  }
  B.addGroup('2-1-2', {
    id: 'hard', title: '실력 문제', standard: KNOW,
    types: [
      H('hard-tri', '뜻을 대어 삼각형 세기', '심1·5, 기본 ①2·22', (d) => {
        // 함정: 길쭉하거나 납작하거나 뒤집힌 삼각형을 빼는 아이, 한 변이 굽은 것·꼭대기가 둥근 것·끊어진 것·변이 4개인 뾰족한 것을 세는 아이
        const list = trapSet(d, 'tri', ['curvy3', 'curvy3', 'open3', 'open3', 'dart', 'cut3', 'round3'], ['quad', 'circle']), flags = list.map((s) => s.kind === 'tri');
        return N('삼각형은 모두 몇 개인가?', flags.filter(Boolean).length, {
          unit: '개', figure: gallery(list), explain: `도형마다 곧은 선 3개로 둘러싸여 있는지만 본다. 삼각형은 ${listed(TAGS, flags)}이다. ` + reasons(list, TAGS, (s) => s.kind === 'tri'), facts: { count: flags }
        });
      }),
      H('hard-quad', '뜻을 대어 사각형 세기', '심1, 기본 ①2·3·21·22', (d) => {
        // 함정: 비스듬히 놓이거나 길쭉한 사각형을 빼는 아이, 한 변이 굽은 것·끊어진 것·귀퉁이가 잘려 변이 5개인 것을 세는 아이
        const list = trapSet(d, 'quad', ['curvy4', 'curvy4', 'open4', 'open4', 'five', 'five'], ['tri', 'circle']), flags = list.map((s) => s.kind === 'quad');
        return N('사각형은 모두 몇 개인가?', flags.filter(Boolean).length, {
          unit: '개', figure: gallery(list), explain: `도형마다 곧은 선 4개로 둘러싸여 있는지만 본다. 사각형은 ${listed(TAGS, flags)}이다. ` + reasons(list, TAGS, (s) => s.kind === 'quad'), facts: { count: flags }
        });
      }),
      H('hard-circle', '뜻을 대어 원 세기', '심1, 기본 ①17·22', (d) => {
        // 함정: 작은 원을 빼는 아이, 조금 길쭉하게 둥근 것·한쪽이 좁은 것·곧은 선이 낀 것을 세는 아이
        const list = trapSet(d, 'circle', ['squash', 'squash', 'egg', 'dee', 'half'], ['tri', 'quad', 'five']), flags = list.map((s) => s.kind === 'circle');
        const say = (s) => (s.look === 'squash' ? '한쪽으로 길쭉하다' : s.look === 'egg' ? '한쪽이 더 좁다' : s.curved ? '곧은 선이 있다' : '곧은 선으로 둘러싸여 있다');
        return N('원은 모두 몇 개인가?', flags.filter(Boolean).length, {
          unit: '개', figure: gallery(list), explain: `도형마다 어느 쪽에서 보아도 똑같이 동그란 모양인지만 본다. 원은 ${listed(TAGS, flags)}이다. ` + reasons(list, TAGS, (s) => s.kind === 'circle', say), facts: { count: flags }
        });
      }),
      H('hard-say-mixed', '삼각형, 사각형, 원을 섞은 설명', '심11', (d) => {
        // 보기마다 걸리는 아이: 「모양이 같다」를 삼각형·사각형에도 맞다고 여긴다, 변과 꼭짓점의 수를 다르게 안다, 두 도형의 수를 거꾸로 견준다
        const more = (a, b, what, key) => [`${a}은 ${b}보다 ${what}이 1개 더 많다.`, FACT[a][key] === FACT[b][key] + 1];
        const rows = [['원은 크기가 달라도 모양이 모두 같다.', FACT.원.same], ['삼각형은 크기가 달라도 모양이 모두 같다.', FACT.삼각형.same], ['사각형은 크기가 달라도 모양이 모두 같다.', FACT.사각형.same],
          more('사각형', '삼각형', '변', 'sides'), more('삼각형', '사각형', '변', 'sides'), more('사각형', '삼각형', '꼭짓점', 'corners'), more('삼각형', '사각형', '꼭짓점', 'corners'),
          ['사각형은 변이 꼭짓점보다 많다.', FACT.사각형.sides > FACT.사각형.corners], ['삼각형은 변의 수와 꼭짓점의 수가 같다.', FACT.삼각형.sides === FACT.삼각형.corners], ['원에는 꼭짓점이 1개 있다.', FACT.원.corners === 1], ['원에는 변이 1개 있다.', FACT.원.sides === 1]];
        const made = saying(d, rows, 1, 3);
        return C('삼각형, 사각형, 원에 대한 설명으로 옳은 것은?', made.options, made.truth.indexOf(true), {
          explain: '삼각형은 변과 꼭짓점이 3개씩, 사각형은 4개씩이고, 원에는 변과 꼭짓점이 없다. 크기가 달라도 모양이 모두 같은 도형은 원뿐이다.', facts: { truth: made.truth, want: true }
        });
      }, { standard: COMMON }),
      H('hard-sides', '변의 수가 조건에 맞는 도형 세기', '심2', (d) => {
        // 「3개보다 많고 5개보다 적은」 수를 먼저 정하고, 굽은 선을 변으로 세지 않아야 한다. 굽은 선까지 세면 조건에 맞아 보이는 도형을 섞는다.
        const k = d.pick([3, 4]), kind = k === 3 ? 'tri' : 'quad', other = k === 3 ? 'quad' : 'tri', hit = d.int(2, 3);
        const list = mix(d, [[kind, hit]].concat(tally([k === 3 ? 'curvy3' : 'curvy4', other, 'five', 'circle'].concat(d.shuffle([other, 'five', k === 3 ? 'curvy3' : 'curvy4']).slice(0, 4 - hit)))));
        const flags = list.map((s) => !s.curved && s.sides > k - 1 && s.sides < k + 1);
        return N(`변이 ${k - 1}개보다 많고 ${k + 1}개보다 적은 도형은 모두 몇 개인가?`, flags.filter(Boolean).length, {
          unit: '개', figure: gallery(list), explain: `${k - 1}개보다 많고 ${k + 1}개보다 적으면 ${k}개이다. 변은 곧은 선이므로 굽은 선은 세지 않는다. 변이 ${k}개인 도형은 ${listed(TAGS, flags)}이다.`, facts: { count: list.map((s) => s.kind === kind) }
        });
      }, { standard: COMMON }),
      H('hard-tan', '크기가 다른 삼각형 조각까지 세기', '심16, 기본 ①32', (d) => {
        // 함정: 작은 삼각형 둘과 중간 삼각형이 이룬 네모난 부분을 사각형 조각 하나로 세는 아이, 큰 삼각형만 세는 아이
        const form = formOf(d, d.pick(['house', 'bigHouse'])), [t] = tanCounts(form.pieces), sizes = ['L', 'M', 'S'].map((k) => form.pieces.filter((p) => p.kind === k).length);
        return N(`칠교 조각으로 ${form.name} 모양을 만들었다. 삼각형 조각은 모두 몇 개인가?`, t, {
          unit: '개', figure: tanArt(form.pieces, { u: formUnit(form.pieces) }), explain: `선으로 나뉜 조각을 하나씩 본다. 변이 3개인 조각은 큰 것 ${sizes[0]}개, 중간 것 ${sizes[1]}개, 작은 것 ${sizes[2]}개로 모두 ${t}개이다.`,
          facts: { tallyOf: { list: form.pieces.map((p) => ('LMS'.includes(p.kind) ? '삼각형' : '사각형')), target: '삼각형' } }
        });
      }, { standard: FIND }),
      H('hard-chain', '기준을 옮겨 가며 쌓기나무 찾기', '심27', (d) => {
        // 함정: 처음 기준(빨간색)에 머물러 둘째 쪽만 읽는 아이, 첫째 쪽만 읽는 아이. 그래서 빨간색 쌓기나무에서 둘째 쪽으로 간 자리에도 쌓기나무가 있다.
        const { s, red, d1, d2 } = d.until(() => { const s0 = d.pick(sized(5, 6)), side = d.pick(['왼쪽', '오른쪽']), [a, b] = d.pick([[side, '위'], ['위', side], [side, '앞'], [side, '뒤']]); return { s: s0, red: d.pick(s0.cubes), d1: a, d2: b }; }, (v) => {
          const first = along(v.s.cubes, v.red, v.d1), mid = add(v.red, DIR[v.d1]);
          return first.length === 1 && has(v.s.cubes, mid) && along(v.s.cubes, mid, v.d2).length === 1 && has(v.s.cubes, add(mid, DIR[v.d2])) && has(v.s.cubes, add(v.red, DIR[v.d2]));
        });
        const mid = along(s.cubes, red, d1)[0], goal = along(s.cubes, mid, d2)[0], rest = ordered(s.cubes).filter((c) => keyOf(c) !== keyOf(red)), marks = marksOf(s.cubes, [red]), at = rest.findIndex((c) => keyOf(c) === keyOf(goal));
        return C(`빨간색 쌓기나무의 ${d1}에 있는 쌓기나무의 ${d2}에 있는 쌓기나무는?`, MARKS.slice(0, rest.length), at, {
          figure: blockArt(s.cubes, { u: 34, marks, tint: { [keyOf(red)]: RED } }),
          explain: `빨간색 쌓기나무의 ${d1}에 있는 쌓기나무는 ${marks[keyOf(mid)]}이다. ${marks[keyOf(mid)]}의 ${d2}에 있는 쌓기나무는 ${MARKS[at]}이다.`,
          facts: { truth: rest.map((c) => keyOf(c) === keyOf(add(add(red, DIR[d1]), DIR[d2]))), want: true }
        });
      }, { standard: BLOCK }),
      H('hard-wrong', '왼쪽·오른쪽·앞·뒤를 가려 틀린 부분 찾기', '심31, 기본 ①52', (d) => {
        // 더 놓은 것이 둘이고 그 가운데 하나는 앞이나 뒤에 있다. 자리(왼쪽·가운데·오른쪽)나 쪽(위·앞·뒤) 하나만 그림과 다르게 적는다.
        const ways = ['위', '앞', '뒤'];
        const made = d.until(() => {
          const s = d.pick(pool().filter((x) => x.n === 3 && x.adds.length === 2 && x.adds.every((a) => a[2] === 1) && x.adds[0][0] !== x.adds[1][0] && x.adds.some((a) => a[1] !== '위')));
          const order = d.shuffle(s.adds), said = [order[0][0], order[0][1], order[1][0], order[1][1]], at = d.int(0, 3);
          said[at] = at % 2 === 0 ? d.pick([0, 1, 2].filter((v) => v !== said[at])) : d.pick(said[at] === '위' ? ['앞', '뒤'] : [said[at] === '앞' ? '뒤' : '앞']);
          return { s, said, at };
        }, ({ s, said }) => {
          const fixes = [0, 1, 2, 3].filter((j) => (j % 2 === 0 ? [0, 1, 2] : ways).some((v) => { const t = said.slice(); t[j] = v; return v !== said[j] && !(t[0] === t[2] && t[1] === t[3]) && shapeKey(rawOf(3, [[t[0], t[1], 1], [t[2], t[3], 1]])) === s.key; }));
          return fixes.length === 1 && !(said[0] === said[2] && said[1] === said[3]);
        });
        const { s, said, at } = made, mark = (tag, word) => `<span style="text-decoration:underline;text-underline-offset:3px">${tag} ${word}</span>`;
        const fixes = (j) => (j % 2 === 0 ? [0, 1, 2] : ways).some((v) => { const t = said.slice(); t[j] = v; return v !== said[j] && !(t[0] === t[2] && t[1] === t[3]) && shapeKey(rawOf(3, [[t[0], t[1], 1], [t[2], t[3], 1]])) === s.key; });
        return C('쌓은 모양을 설명한 것이다. ㉠~㉣ 중 틀린 부분은?', MARKS.slice(0, 4), at, {
          figure: blockArt(s.cubes, { u: 34 }) + conditions([`쌓기나무 3개가 옆으로 나란히 있고, ${mark('㉠', POS[3][said[0]])} 쌓기나무 ${mark('㉡', said[1])}에 1개, ${mark('㉢', POS[3][said[2]])} 쌓기나무 ${mark('㉣', said[3])}에 1개가 있다.`]),
          explain: `「앞」이라고 쓴 쪽에서 볼 때의 왼쪽, 오른쪽, 앞, 뒤로 말한다. 바르게 설명하면 「${told(3, s.adds)}」이다.`, facts: { truth: [0, 1, 2, 3].map(fixes), want: true }
        });
      }, { standard: BLOCK }),
      H('hard-move', '옮길 쌓기나무와 놓을 자리', '심24, 기본 ①43', (d) => {
        // 옮길 쌓기나무와 놓을 자리를 함께 정해야 한다. 틀린 보기: 옮길 것은 맞고 자리가 다른 것, 자리는 맞고 옮길 것이 다른 것, 둘 다 다른 것
        const { s, all, move, picks } = d.until(() => {
          const v = movePuzzle(d, 5, 5), key = shapeKey(v.move.made), wrong = d.shuffle(v.all.filter((m) => shapeKey(m.made) !== key && connected(m.made)));
          const sameFrom = wrong.filter((m) => keyOf(m.from) === keyOf(v.move.from)), others = wrong.filter((m) => keyOf(m.from) !== keyOf(v.move.from));
          return Object.assign(v, { picks: sameFrom.slice(0, 1).concat(others.slice(0, 3 - Math.min(1, sameFrom.length))) });
        }, (v) => v.picks.length === 3 && v.picks.some((m) => keyOf(m.from) === keyOf(v.move.from)) && keyOf(v.move.by) !== keyOf(v.move.from));
        const marks = marksOf(s.cubes), say = (m) => `${marks[keyOf(m.from)]}을 ${marks[keyOf(m.by)]}의 ${josa(m.dir, '으로/로')} 옮긴다.`, rows = d.shuffle([move].concat(picks)), key = shapeKey(move.made);
        return C('처음 모양에서 쌓기나무 1개를 옮겨 만들 모양과 똑같이 쌓으려고 한다. 바르게 옮긴 것은?', rows.map(say), rows.indexOf(move), {
          figure: tiles([['처음 모양', blockArt(s.cubes, { marks })], ['만들 모양', blockArt(norm(move.made))]]),
          explain: `두 모양에서 쌓기나무가 놓인 자리를 하나씩 비교한다. ${say(move).replace('옮긴다.', '옮기면 만들 모양과 똑같아진다.')}`,
          facts: { truth: rows.map((m) => shapeKey(s.cubes.filter((c) => keyOf(c) !== keyOf(m.from)).concat([add(m.by, DIR[m.dir])])) === key), want: true, moves: all.length }
        });
      }, { standard: BLOCK })
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
