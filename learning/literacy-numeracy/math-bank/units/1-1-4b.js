// 1학년 1학기 4단원 비교하기 — 기본 문항(넓이·담을 수 있는 양·비교하는 말)과 실력 문항.
// 꼴 목록(기본꼴 56꼴, 심화꼴 47꼴)을 꼴마다 따져서 실었다. 싣는 기준과 뺀 것은 1-1-4a.js 머리에 적었다.
//
// 실력 문항의 잣대: 어려움은 보기가 아니라 그림과 상황의 장치에서 나온다. 이 단원에서 아이들이 흔히 잘못 아는 것을 먼저 적는다.
//   ① 끝이 더 나온 쪽이 더 길다(한쪽 끝을 맞추지 않았는데도 한쪽 끝만 본다).
//   ② 양 끝이 맞추어져 있으면 길이가 같다(구부러진 끈을 곧게 편 길이를 생각하지 않는다).
//   ③ 머리가 더 높이 있으면 키가 더 크다(선 곳의 높이가 다른데도 머리 끝만 본다).
//   ④ 큰 것, 수가 많은 것이 더 무겁다(저울이 기운 쪽을 보지 않는다).
//   ⑤ 물의 높이가 높으면 물이 더 많고, 높이가 같으면 양도 같다(그릇의 굵기를 보지 않는다).
//   ⑥ 칸 수가 많으면 더 넓다(칸의 크기가 다른데도 칸 수만 센다).
//   ⑦ 남은 양이 많으면 많이 마신 것이다, 물이 적게 담긴 그릇에 물을 가장 많이 더 부어야 한다(빈 곳을 보지 않는다).
//   ⑧ 이름이 큰 그릇이 더 많이 담는다(옮겨 부은 결과로 따지지 않는다).
// 그다음에 두 번 생각해야 하는 문제를 실었다(시소 두 번을 이어 가장 무거운 사람, 한 문장에 든 비교 둘에 맞는 가운데 크기의 물병).
// 조건을 두 번 넘게 잇는 추론, 크기가 다른 컵으로 잰 횟수(2학년), 한글로 쓰는 답은 싣지 않는다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, name, nick, NAMES, box, lines, N, C } = B.kit;
  const { STD, some, run, orderOptions, pairOptions, ROPES, TAGS, fx, INK, PALETTE, svg, seg, slab, word, widest, hbars, vbars, seesaw, told, chain } = B.kit.g114;
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: '수집본 심화 자료(' + ref + ')', make }, more || {});
  // 겪어 보아 아는 넓이·담을 수 있는 양: 뒤쪽 묶음의 것이 앞쪽 묶음의 것보다 훨씬 넓다(많이 담는다).
  const WIDE = [['우표', '동전'], ['색종이', '엽서'], ['수학책', '공책'], ['책상', '식탁'], ['칠판', '이불'], ['운동장', '수영장']];
  const HOLD = [['숟가락'], ['종이컵', '물컵'], ['주전자', '냄비'], ['양동이'], ['욕조']];

  // ── 그림 ────────────────────────────────────────────────────
  // 왼쪽 아래를 맞추어 겹쳐 놓은 종이. list: [{ name, w, h, color }](칸). 넓은 것부터 그려 좁은 것이 위에 놓인다.
  // 이름은 종이마다 오른쪽 위 구석에 적는다(더 좁은 종이에 가려지지 않는 자리다).
  function nest(list, label) {
    const u = 24, pad = 8, W = Math.max.apply(null, list.map((r) => r.w)), tall = Math.max.apply(null, list.map((r) => r.h)), ground = pad + tall * u;
    const sorted = list.slice().sort((a, b) => b.w * b.h - a.w * a.h);
    return svg(pad * 2 + W * u, pad * 2 + tall * u, label, sorted.map((r) => slab(pad, ground - r.h * u, r.w * u, r.h * u, r.color)).join('') + sorted.map((r) => word(pad + (r.w - 0.5) * u, ground - (r.h - 0.5) * u, r.name)).join(''));
  }
  // 이어 붙은 칸 n개로 된 모양(가로 w 칸, 세로 h 칸 안). 왼쪽 아래에 붙여 돌려준다.
  function blob(d, n, w, h) {
    const cells = d.until(() => {
      const list = [[d.int(0, w - 1), d.int(0, h - 1)]], has = new Set([list[0].join()]);
      for (let guard = 0; list.length < n && guard < 300; guard += 1) {
        const from = d.pick(list), step = d.pick([[1, 0], [-1, 0], [0, 1], [0, -1]]), next = [from[0] + step[0], from[1] + step[1]];
        if (next[0] < 0 || next[0] >= w || next[1] < 0 || next[1] >= h || has.has(next.join())) continue;
        list.push(next); has.add(next.join());
      }
      return list;
    }, (list) => list.length === n);
    const left = Math.min.apply(null, cells.map((c) => c[0])), low = Math.max.apply(null, cells.map((c) => c[1]));
    return cells.map((c) => [c[0] - left, c[1] + (h - 1 - low)]);
  }
  const block = (w, h, rows) => { const cells = []; for (let x = 0; x < w; x += 1) for (let y = rows - h; y < rows; y += 1) cells.push([x, y]); return cells; };
  // 같은 크기의 칸에 색칠한 모양들. shapes: [{ name, cells: [[x, y], …], color }] — 모양마다 가로 zone 칸, 세로 rows 칸의 자리를 차지한다(y 는 위에서 아래로).
  function plane(shapes, o) {
    const zone = o.zone, rows = o.rows, cols = shapes.length * zone + shapes.length - 1, u = Math.min(20, Math.floor(268 / cols)), pad = 6, bottom = pad + rows * u;
    let out = '';
    for (let c = 0; c <= cols; c += 1) out += seg(pad + c * u, pad, pad + c * u, bottom, 'stroke:#b6c4d4;stroke-width:0.8');
    for (let r = 0; r <= rows; r += 1) out += seg(pad, pad + r * u, pad + cols * u, pad + r * u, 'stroke:#b6c4d4;stroke-width:0.8');
    shapes.forEach((shape, i) => {
      for (const [x, y] of shape.cells) out += slab(pad + (i * (zone + 1) + x) * u, pad + y * u, u, u, shape.color || PALETTE[i % PALETTE.length]);
      out += word(pad + (i * (zone + 1) + zone / 2) * u, bottom + 12, shape.name);
    });
    return svg(pad * 2 + cols * u, bottom + 22, o.label, out);
  }
  // 칸의 크기가 다른 두 모눈. panels: [{ name, size(칸의 한 변이 작은 칸 몇 개인가: 1 또는 2), cells }] — 판 하나는 작은 칸으로 가로 4칸, 세로 4칸이다.
  function twoGrids(panels, label) {
    const s = 18, side = 4 * s, gap = 34, pad = 8;
    let out = '';
    panels.forEach((panel, i) => {
      const x0 = pad + i * (side + gap), step = panel.size * s;
      for (let k = 0; k <= 4 / panel.size; k += 1) out += seg(x0 + k * step, pad, x0 + k * step, pad + side, 'stroke:#b6c4d4;stroke-width:0.8') + seg(x0, pad + k * step, x0 + side, pad + k * step, 'stroke:#b6c4d4;stroke-width:0.8');
      for (const [x, y] of panel.cells) out += slab(x0 + x * step, pad + y * step, step, step, PALETTE[i]);
      out += word(x0 + side / 2, pad + side + 12, panel.name);
    });
    return svg(pad * 2 + side * 2 + gap, pad + side + 22, label, out);
  }
  // 그릇. list: [{ name, w(굵기, 칸), h(높이, 칸), level(물의 높이, 칸 — 없으면 빈 그릇) }]. 굵기 한 칸은 24px, 높이 한 칸은 14px(가로금).
  function cups(list, label) {
    const wu = 24, hu = 14, gap = 22, top = 10, rows = Math.max.apply(null, list.map((c) => c.h)) + 1, bottom = top + rows * hu, w = 28 + list.reduce((s, c) => s + c.w * wu, 0) + gap * (list.length - 1);
    let out = '', x = 14;
    for (let r = 0; r <= rows; r += 1) out += seg(6, top + r * hu, w - 6, top + r * hu);
    for (const c of list) {
      if (c.level) out += `<rect class="mb-water" x="${fx(x + 1)}" y="${fx(bottom - c.level * hu)}" width="${fx(c.w * wu - 2)}" height="${fx(c.level * hu)}"/>`;
      out += `<path class="mb-vessel" d="M${fx(x)} ${fx(bottom - c.h * hu)}V${fx(bottom)}H${fx(x + c.w * wu)}V${fx(bottom - c.h * hu)}"/>` + word(x + c.w * wu / 2, bottom + 13, c.name);
      x += c.w * wu + gap;
    }
    return svg(w, bottom + 24, label, out);
  }
  const cupsSaid = (list) => list.map((c) => `${c.name} 굵기 ${c.w}칸, 높이 ${c.h}칸${c.level ? `, 물 높이 ${c.level}칸` : ''}`).join(' / ');
  // 똑같은 컵에 옮겨 담은 물. rows: [{ name, n(컵의 수) }] — 컵을 다섯 개씩 끊어 한 줄로 그린다.
  function cupRows(rows, label) {
    const x0 = widest(rows) + 14, cw = 16, ch = 19, step = 21, tall = 29, top = 6;
    let out = '';
    rows.forEach((row, i) => {
      const y = top + i * tall;
      for (let k = 0; k < row.n; k += 1) { const x = x0 + k * step + (k >= 5 ? 9 : 0); out += `<path d="M${x} ${y}H${x + cw}L${x + cw - 3} ${y + ch}H${x + 3}Z" style="fill:#bfdcff;stroke:${INK};stroke-width:1.1;stroke-linejoin:round"/>`; }
      out += word(x0 - 8, y + ch / 2, row.name, 'end');
    });
    return svg(x0 + 9 * step + 9 + 8, top + rows.length * tall, label, out);
  }
  // 둘로 나누어 한쪽에 색칠한 모양. list: [{ name, cols, rows, at(위에서 몇 줄 아래를 가르는가), top(위쪽을 색칠했는가) }]
  function halves(list, label) {
    const u = 16, pitch = 72, top = 8, tall = Math.max.apply(null, list.map((t) => t.rows)), bottom = top + tall * u, w = 16 + list.length * pitch;
    let out = '';
    list.forEach((t, i) => {
      const x0 = 8 + i * pitch + (pitch - t.cols * u) / 2, y0 = bottom - t.rows * u;
      for (let r = 0; r < t.rows; r += 1) for (let c = 0; c < t.cols; c += 1) out += `<rect x="${fx(x0 + c * u)}" y="${fx(y0 + r * u)}" width="${u}" height="${u}" style="fill:${(r < t.at) === t.top ? '#93c5fd' : '#fff'};stroke:#94a3b8;stroke-width:0.8"/>`;
      out += `<rect x="${fx(x0)}" y="${fx(y0)}" width="${t.cols * u}" height="${t.rows * u}" style="fill:none;stroke:${INK};stroke-width:1.4"/>` + seg(x0 - 4, y0 + t.at * u, x0 + t.cols * u + 4, y0 + t.at * u, 'stroke:#1f2933;stroke-width:2.6') + word(x0 + t.cols * u / 2, bottom + 13, t.name);
    });
    return svg(w, bottom + 24, label, out);
  }
  // 모눈 위의 끈. list: [{ name, color, points: [[x, y], …] }] — 끈은 칸의 금을 따라 놓인다. D: 가로 칸 수. 양 끝(왼쪽 금과 오른쪽 금)에 점선을 긋는다.
  function strings(D, list, label) {
    const u = 22, x0 = widest(list) + 14, top = 10, rows = 4, w = x0 + D * u + 12, bottom = top + rows * u;
    let out = '';
    for (let c = 0; c <= D; c += 1) out += seg(x0 + c * u, top, x0 + c * u, bottom);
    for (let r = 0; r <= rows; r += 1) out += seg(x0, top + r * u, x0 + D * u, top + r * u);
    for (const x of [x0, x0 + D * u]) out += seg(x, top - 5, x, bottom + 5, 'stroke:#b42318;stroke-width:1.6;stroke-dasharray:4 3');
    for (const item of list) {
      out += `<polyline points="${item.points.map((p) => fx(x0 + p[0] * u) + ',' + fx(top + p[1] * u)).join(' ')}" style="fill:none;stroke:${item.color};stroke-width:6;stroke-linejoin:round;stroke-linecap:butt"/>`
        + `<polyline points="${item.points.map((p) => fx(x0 + p[0] * u) + ',' + fx(top + p[1] * u)).join(' ')}" style="fill:none;stroke:${INK};stroke-width:1;stroke-dasharray:1 5;stroke-linejoin:round"/>` + word(x0 - 8, top + item.points[0][1] * u, item.name, 'end');
    }
    return svg(w, bottom + 10, label, out);
  }

  B.addTypes('1-1-4', 'area', [
    T('area-overlap', '겹쳐 놓은 두 종이 중 더 좁은 것', '①29 심23', (d) => {
      const W = d.int(4, 6), tall = d.int(3, 4), cut = d.pick([[1, 0], [0, 1], [1, 1]]), sizes = d.shuffle([[W, tall], [W - cut[0], tall - cut[1]]]), names = ['가', '나'], small = sizes.findIndex(([w, h]) => w * h < W * tall);
      return C('두 종이를 겹쳐 놓았다. 더 좁은 종이는?', names.map((n) => n + ' 종이'), small, {
        figure: nest(sizes.map(([w, h], i) => ({ name: names[i], w, h, color: ['#fde68a', '#93c5fd'][i] })), `왼쪽 아래를 맞추어 겹쳐 놓은 종이: ${sizes.map(([w, h], i) => `${names[i]} 가로 ${w}칸 세로 ${h}칸`).join(', ')}`),
        explain: `겹쳤을 때 남는 쪽이 더 넓다. ${names[1 - small]} 종이가 남으므로 ${names[small]} 종이가 더 좁다.`, facts: { choose: { exprs: sizes.map(([w, h]) => `${w}*${h}`), rule: 'min' } }
      });
    }),
    T('area-three', '겹쳐 놓은 세 종이 중 가장 넓은 것', '①32 심24', (d) => {
      const W = d.int(5, 6), s1 = d.pick([[1, 0], [0, 1]]), s2 = d.pick([[1, 0], [0, 1], [1, 1]]), sizes = d.shuffle([[W, 4], [W - s1[0], 4 - s1[1]], [W - s1[0] - s2[0], 4 - s1[1] - s2[1]]]), names = TAGS.slice(0, 3), big = sizes.findIndex(([w, h]) => w === W && h === 4);
      return C('세 종이를 겹쳐 놓았다. 가장 넓은 종이는?', names.map((n) => n + ' 종이'), big, {
        figure: nest(sizes.map(([w, h], i) => ({ name: names[i], w, h, color: ['#fde68a', '#93c5fd', '#f9a8d4'][i] })), `왼쪽 아래를 맞추어 겹쳐 놓은 종이: ${sizes.map(([w, h], i) => `${names[i]} 가로 ${w}칸 세로 ${h}칸`).join(', ')}`),
        explain: `겹쳤을 때 남는 쪽이 더 넓다. ${names[big]} 종이는 다른 두 종이를 겹쳐도 남으므로 가장 넓다.`, facts: { choose: { exprs: sizes.map(([w, h]) => `${w}*${h}`), rule: 'max' } }
      });
    }),
    T('area-word', '넓이를 비교하는 말 고르기', '①30·31·40', (d) => {
      const s = d.int(5, 8), n = d.shuffle([s, s + 1]), wider = n[0] > n[1];
      return C(`${box()} 안에 알맞은 말은?`, ['넓다', '좁다'], wider ? 0 : 1, {
        figure: plane([{ name: '가', cells: blob(d, n[0], 4, 3) }, { name: '나', cells: blob(d, n[1], 4, 3) }], { zone: 4, rows: 3, label: `같은 크기의 칸에 색칠한 모양의 넓이: ${told(['가', '나'], n)}` }) + lines([`가는 나보다 더 ${box()}.`]),
        explain: `칸의 크기가 같으므로 칸 수를 센다. 가는 ${n[0]}칸, 나는 ${n[1]}칸이므로 가는 나보다 더 ${wider ? '넓다' : '좁다'}.`, facts: { choose: { exprs: n.map(String), rule: 'max' } }
      });
    }),
    T('area-grid', '칸 수로 넓은 것부터 차례로 쓰기', '①35 심25·32', (d) => {
      const n = run(d, 3, 5, 9), names = TAGS.slice(0, 3), right = [0, 1, 2].sort((p, q) => n[q] - n[p]), { list, answer } = orderOptions(d, right);
      return C('넓은 것부터 차례로 쓴 것은?', list.map((o) => chain(names, o)), answer, {
        figure: plane(names.map((t, i) => ({ name: t, cells: blob(d, n[i], 4, 3) })), { zone: 4, rows: 3, label: `같은 크기의 칸에 색칠한 모양의 넓이: ${told(names, n)}` }),
        explain: `칸의 크기가 같으므로 칸 수를 센다. 가 ${n[0]}칸, 나 ${n[1]}칸, 다 ${n[2]}칸이므로 넓은 것부터 쓰면 ${chain(names, right)}이다.`, facts: { choose: { exprs: n.map(String), rule: 'descending', orders: list } }
      });
    }),
    T('area-count', '기준보다 더 좁은 것의 수', '①34', (d) => {
      const ref = d.int(5, 6), k = d.int(1, 3), n = d.shuffle(some(d, [ref - 3, ref - 2, ref - 1], k).concat(some(d, [ref + 1, ref + 2, ref + 3], 4 - k))), names = TAGS.slice(1, 5);
      return N('가보다 더 좁은 것은 몇 개인가?', k, {
        unit: '개', figure: plane([{ name: '가', cells: blob(d, ref, 3, 3), color: '#cbd5e1' }].concat(names.map((t, i) => ({ name: t, cells: blob(d, n[i], 3, 3), color: PALETTE[i] }))), { zone: 3, rows: 3, label: `같은 크기의 칸에 색칠한 모양의 넓이: ${told(['가'].concat(names), [ref].concat(n))}` }),
        explain: `칸의 크기가 같으므로 칸 수를 센다. 가는 ${ref}칸이다. ${ref}칸보다 칸 수가 적은 것은 ${names.filter((_, i) => n[i] < ref).join(', ')}이므로 ${k}개이다.`, facts: { choose: { exprs: n.map(String), rule: 'countBelow', target: ref } }
      });
    }),
    T('area-than', '겪어 본 것으로 기준보다 더 넓은 것 모두 고르기', '①32·33 심28·33', (d) => {
      const base = d.pick(WIDE[2]), tiers = d.shuffle(some(d, [3, 4, 5], 2).concat([0, 1])), things = tiers.map((t) => d.pick(WIDE[t])), flags = tiers.map((t) => t > 2), made = pairOptions(d, things, flags);
      return C(`${base}보다 더 넓은 것을 모두 고른 것은?`, made.options, made.answer, {
        explain: `${josa(base, '을/를')} 올려놓았을 때 남는 것을 찾는다. ${things.filter((_, i) => flags[i]).join(', ')}이다.`, facts: { sets: { labels: things, flags, options: made.sets } }
      });
    }),
    T('area-cover', '색종이로 가릴 수 없는 것', '심27', (d) => {
      // 가릴 수 있는 것은 가로도 세로도 색종이를 넘지 않고, 가릴 수 없는 것은 색종이보다 더 넓으면서 한쪽이 넘친다.
      const fits = some(d, [[2, 2], [3, 2], [2, 3], [1, 3], [3, 1]], 2), over = d.pick([[4, 3], [3, 4], [4, 4]]), things = d.shuffle(fits.concat([over])), names = TAGS.slice(0, 3), hit = things.indexOf(over);
      return C('색종이로 덮어서 다 가릴 수 없는 것은?', names, hit, {
        figure: plane([{ name: '색종이', cells: block(3, 3, 4), color: '#fde68a' }].concat(things.map(([w, h], i) => ({ name: names[i], cells: block(w, h, 4), color: '#93c5fd' }))), { zone: 4, rows: 4, label: `같은 크기의 칸에 그린 모양: 색종이 가로 3칸 세로 3칸, ${things.map(([w, h], i) => `${names[i]} 가로 ${w}칸 세로 ${h}칸`).join(', ')}` }),
        explain: `색종이보다 더 넓은 것은 다 가릴 수 없다. 색종이는 가로 3칸, 세로 3칸이고 ${names[hit]}는 가로 ${over[0]}칸, 세로 ${over[1]}칸이라 색종이 밖으로 남는다.`, facts: { choose: { exprs: things.map(([w, h]) => `${w}*${h}`), rule: 'onlyAbove', target: 9 } }
      });
    }),
    T('area-half', '둘로 나눈 모양에서 더 넓은 쪽에 색칠한 것', '①36 심29', (d) => {
      const hit = d.int(0, 2), names = TAGS.slice(0, 3);
      const tiles = names.map((t, i) => { const cols = d.pick([1, 2]), rows = cols === 1 ? 7 : 5, few = cols === 1 ? 3 : 2, shaded = i === hit ? rows - few : few, top = d.bool(); return { name: t, cols, rows, top, at: top ? shaded : rows - shaded, on: shaded * cols, off: (rows - shaded) * cols }; });
      return C('둘로 나누어 한쪽에 색칠했다. 더 넓은 쪽에 색칠한 것은?', names, hit, {
        figure: halves(tiles, `둘로 나눈 모양: ${tiles.map((t) => `${t.name} 색칠한 쪽 ${t.on}칸, 색칠하지 않은 쪽 ${t.off}칸`).join(' / ')}`),
        explain: `칸 수를 세어 색칠한 쪽과 색칠하지 않은 쪽을 비교한다. ${names[hit]}는 색칠한 쪽이 ${tiles[hit].on}칸, 색칠하지 않은 쪽이 ${tiles[hit].off}칸이므로 더 넓은 쪽에 색칠했다.`,
        facts: { choose: { exprs: tiles.map((t) => `${t.on}/${t.off}`), rule: 'onlyAbove', target: 1 } }
      });
    })
  ]);

  B.addTypes('1-1-4', 'vol', [
    T('vol-two', '높이가 같은 두 그릇 중 더 적게 담는 것', '①41 심35·38', (d) => {
      const h = d.int(4, 6), w = d.shuffle([2, 3]), list = ['가', '나'].map((t, i) => ({ name: t, w: w[i], h })), small = w.indexOf(2);
      return C('담을 수 있는 양이 더 적은 그릇은?', ['가 그릇', '나 그릇'], small, {
        figure: cups(list, `빈 그릇: ${cupsSaid(list)}`),
        explain: `두 그릇은 높이가 같다. 옆으로 더 좁은 ${list[small].name} 그릇이 더 작으므로 담을 수 있는 양이 더 적다.`, facts: { choose: { exprs: list.map((c) => `${c.w}*${c.h}`), rule: 'min' } }
      });
    }),
    T('vol-drink', '가득 채워 마신 양', '①44·49', (d) => {
      const h = run(d, 3, 3, 7), who = some(d, NAMES, 3), list = who.map((t, i) => ({ name: t, w: 2, h: h[i] })), most = h.indexOf(Math.max(...h));
      return C('세 사람이 자기 컵에 물을 가득 담아 모두 마셨다. 가장 많이 마신 사람은?', who, most, {
        figure: cups(list, `빈 컵: ${cupsSaid(list)}`),
        explain: `컵이 클수록 가득 담은 물이 많다. 세 컵은 굵기가 같으므로 가장 높은 컵으로 마신 ${name(who[most], '이/가')} 가장 많이 마셨다.`, facts: { choose: { exprs: list.map((c) => `${c.w}*${c.h}`), rule: 'max' } }
      });
    }),
    T('vol-order', '많이 담을 수 있는 그릇부터 차례로 쓰기', '①45·46', (d) => {
      // 작은 그릇에서 큰 그릇으로 갈수록 굵기와 높이 가운데 하나 넘게 커지고 줄어드는 것은 없다(겹쳐 넣을 수 있는 크기).
      const sizes = d.until(() => { const a = [d.int(1, 2), d.int(3, 4)], s1 = d.pick([[1, 0], [0, 1], [0, 2], [1, 1]]), s2 = d.pick([[1, 0], [0, 1], [0, 2], [1, 1]]); return [a, [a[0] + s1[0], a[1] + s1[1]], [a[0] + s1[0] + s2[0], a[1] + s1[1] + s2[1]]]; }, (list) => list[2][0] <= 3 && list[2][1] <= 7);
      const shown = d.shuffle(sizes), names = TAGS.slice(0, 3), list = shown.map(([w, h], i) => ({ name: names[i], w, h })), right = [0, 1, 2].sort((p, q) => sizes.indexOf(shown[q]) - sizes.indexOf(shown[p])), made = orderOptions(d, right);
      return C('많이 담을 수 있는 그릇부터 차례로 쓴 것은?', made.list.map((o) => chain(names, o)), made.answer, {
        figure: cups(list, `빈 그릇: ${cupsSaid(list)}`),
        explain: `더 굵거나 더 높은 그릇이 더 많이 담는다. 큰 그릇부터 쓰면 ${chain(names, right)}이다.`, facts: { choose: { exprs: list.map((c) => `${c.w}*${c.h}`), rule: 'descending', orders: made.list } }
      });
    }),
    T('vol-word', '담긴 양을 비교하는 말 고르기', '①42·43', (d) => {
      const s = d.int(2, 5), lv = d.shuffle([s, s + 1]), list = ['가', '나'].map((t, i) => ({ name: t, w: 2, h: 7, level: lv[i] })), more = lv[0] > lv[1];
      return C(`${box()} 안에 알맞은 말은?`, ['많다', '적다'], more ? 0 : 1, {
        figure: cups(list, `모양과 크기가 같은 그릇: ${cupsSaid(list)}`) + lines([`가 그릇의 물은 나 그릇의 물보다 더 ${box()}.`]),
        explain: `모양과 크기가 같은 그릇이므로 물의 높이를 비교한다. 가 그릇의 물이 더 ${more ? '높으므로 더 많다' : '낮으므로 더 적다'}.`, facts: { choose: { exprs: lv.map(String), rule: 'max' } }
      });
    }),
    T('vol-level', '똑같은 컵에서 물이 가장 적게 담긴 것', '①47 심36', (d) => {
      const lv = run(d, 4, 2, 6), names = TAGS.slice(0, 4), list = names.map((t, i) => ({ name: t, w: 2, h: 7, level: lv[i] })), least = lv.indexOf(Math.min(...lv));
      return C('똑같은 컵에 물을 담았다. 물이 가장 적게 담긴 컵은?', names.map((t) => t + ' 컵'), least, {
        figure: cups(list, `모양과 크기가 같은 컵: ${cupsSaid(list)}`),
        explain: `똑같은 컵이므로 물의 높이가 낮을수록 물이 적다. 물의 높이가 가장 낮은 ${names[least]} 컵에 물이 가장 적게 담겼다.`, facts: { choose: { exprs: lv.map(String), rule: 'min' } }
      });
    }),
    T('vol-know', '겪어 본 것으로 가장 많이 담는 것 고르기', '①42·44 심35', (d) => {
      const tiers = some(d, [0, 1, 2, 3, 4], 4), things = tiers.map((t) => d.pick(HOLD[t])), most = tiers.indexOf(Math.max(...tiers)), by = [0, 1, 2, 3].sort((p, q) => tiers[q] - tiers[p]);
      return C('물을 가장 많이 담을 수 있는 것은?', things, most, {
        explain: `클수록 물을 많이 담을 수 있다. 많이 담을 수 있는 것부터 쓰면 ${chain(things, by)}이다.`, facts: { truth: tiers.map((t) => t === Math.max(...tiers)), want: true }
      });
    }),
    T('vol-fast', '먼저 가득 차는 통', '①51', (d) => {
      const s = d.int(3, 6), h = d.shuffle([s, s + 1]), list = ['가', '나'].map((t, i) => ({ name: t, w: 2, h: h[i] })), first = h.indexOf(s);
      return C('두 통에 물을 똑같이 틀어 놓았다. 먼저 가득 차는 통은?', ['가 통', '나 통'], first, {
        figure: cups(list, `빈 통: ${cupsSaid(list)}`),
        explain: `물이 똑같이 나오므로 담을 수 있는 양이 더 적은 통이 먼저 가득 찬다. 두 통은 굵기가 같으므로 더 낮은 ${list[first].name} 통이 먼저 찬다.`, facts: { choose: { exprs: list.map((c) => `${c.w}*${c.h}`), rule: 'min' } }
      });
    }),
    T('vol-pour', '옮겨 부은 결과로 비교하기', '①52', (d) => {
      const from = d.int(0, 1), names = ['가 컵', '나 컵'];
      return C(`${names[from]}에 가득 담은 물을 빈 ${names[1 - from]}에 모두 부었다. ${names[1 - from]}이 가득 차지 않았다. 더 많이 담을 수 있는 컵은?`, names, 1 - from, {
        explain: `${names[from]}의 물을 모두 붓고도 ${names[1 - from]}에 빈 곳이 남았다. ${names[1 - from]}이 더 많이 담을 수 있다.`, facts: { truth: names.map((_, i) => i !== from), want: true }
      });
    }),
    T('vol-cups', '똑같은 컵에 옮겨 담은 수로 비교하기', '심42', (d) => {
      const n = run(d, 3, 5, 9), names = TAGS.slice(0, 3).map((t) => t + ' 그릇'), most = n.indexOf(Math.max(...n));
      return C('그릇에 가득 담은 물을 똑같은 컵에 옮겨 담았다. 가장 많이 담을 수 있는 그릇은?', names, most, {
        figure: cupRows(names.map((t, i) => ({ name: t, n: n[i] })), `똑같은 컵에 옮겨 담은 물: ${names.map((t, i) => `${t} ${n[i]}컵`).join(', ')}`),
        explain: `똑같은 컵에 옮겨 담았으므로 컵의 수가 많을수록 많이 담는 그릇이다. 가 그릇 ${n[0]}컵, 나 그릇 ${n[1]}컵, 다 그릇 ${n[2]}컵이므로 ${names[most]}이 가장 많이 담는다.`, facts: { choose: { exprs: n.map(String), rule: 'max' } }
      });
    })
  ]);

  const KINDS = [['길이', '길다', '짧다'], ['무게', '무겁다', '가볍다'], ['넓이', '넓다', '좁다']];
  B.addTypes('1-1-4', 'word', [
    T('word-tall', '키를 비교하는 말', '①55 심45', (d) => {
      const who = some(d, NAMES, 2), big = d.bool(), options = d.shuffle(big ? ['크다', '길다', '무겁다', '넓다'] : ['작다', '짧다', '가볍다', '좁다']), right = big ? '크다' : '작다';
      return C(`키를 비교한 말이다. ${box()} 안에 알맞은 말은?`, options, options.indexOf(right), {
        figure: lines([`${name(who[0], '은/는')} ${nick(who[1])}보다 키가 더 ${box()}.`]),
        explain: '키를 비교할 때는 「더 크다」, 「더 작다」라고 한다. 「길다, 짧다」는 물건의 길이를 비교할 때 쓴다.', facts: { truth: options.map((o) => o === right), want: true }
      });
    }),
    T('word-kind', '같은 것을 비교하는 말끼리 묶기', '심46', (d) => {
      const [k, a, b] = d.shuffle(KINDS), options = d.shuffle([[k[1], k[2]], [k[1], a[2]], [b[1], k[2]], [a[1], a[2]]]);
      return C(`${josa(k[0], '을/를')} 비교할 때 쓰는 말끼리 묶은 것은?`, options.map((o) => o.join(', ')), options.findIndex((o) => o[0] === k[1] && o[1] === k[2]), {
        explain: `${josa(k[0], '을/를')} 비교할 때는 「${k[1]}」, 「${k[2]}」라고 한다.`, facts: { truth: options.map((o) => o[0] === k[1] && o[1] === k[2]), want: true }
      });
    }),
    T('word-wrong', '비교하는 말을 잘못 쓴 것 찾기', '①56', (d) => {
      // [말머리, 알맞은 말, 다른 것을 비교하는 말, 비교하는 것, 그것을 비교하는 두 말]
      const rows = some(d, [['기차의 길이는 버스보다 더', '길다', ['무겁다', '넓다'], '길이', '길다, 짧다'], ['수박의 무게는 귤보다 더', '무겁다', ['길다', '넓다'], '무게', '무겁다, 가볍다'],
        ['운동장의 넓이는 교실보다 더', '넓다', ['길다', '무겁다'], '넓이', '넓다, 좁다'], ['기린의 키는 토끼보다 더', '크다', ['무겁다', '넓다'], '키', '크다, 작다']], 3), bad = d.int(0, 2);
      const said = rows.map(([stem, right, wrong], i) => `${stem} ${i === bad ? d.pick(wrong) : right}.`);
      return C('비교하는 말을 잘못 쓴 것은?', said, bad, {
        explain: `${josa(rows[bad][3], '을/를')} 비교할 때는 「${rows[bad][4]}」라고 한다. 바르게 고치면 「${rows[bad][0]} ${rows[bad][1]}.」이다.`, facts: { truth: rows.map((_, i) => i !== bad), want: false }
      });
    }),
    T('word-pair', '두 문장에 알맞은 말의 짝', '심47', (d) => {
      const SAY = { 무게: [['자동차는 자전거보다 더', 0], ['깃털은 돌멩이보다 더', 1]], 길이: [['기차는 버스보다 더', 0], ['연필은 빗자루보다 더', 1]], 넓이: [['운동장은 교실보다 더', 0], ['우표는 공책보다 더', 1]] };
      const [k, other] = d.shuffle(KINDS), rows = d.shuffle(SAY[k[0]]), right = rows.map(([, at]) => k[1 + at]), options = d.shuffle([right, [right[1], right[0]], rows.map(([, at]) => other[1 + at]), [right[0], other[1 + rows[1][1]]]]);
      return C(`${josa(k[0], '을/를')} 비교했다. ㉠, ㉡에 알맞은 말을 차례로 쓴 것은?`, options.map((o) => o.join(', ')), options.findIndex((o) => o.join() === right.join()), {
        figure: lines([`${rows[0][0]} ${box('㉠')}.`, `${rows[1][0]} ${box('㉡')}.`]),
        explain: `${josa(k[0], '을/를')} 비교할 때는 「${k[1]}」, 「${k[2]}」라고 한다. ${rows[0][0]} ${right[0]}. ${rows[1][0]} ${right[1]}.`, facts: { truth: options.map((o) => o.join() === right.join()), want: true }
      });
    }),
    T('word-flip', '비교한 말을 바꾸어 말하기', '①2 심31', (d) => {
      const [a, b, big, small] = d.pick([['공책', '엽서', '넓다', '좁다'], ['기차', '버스', '길다', '짧다'], ['수박', '귤', '무겁다', '가볍다']]), up = d.bool();
      // 주어진 말과 뜻이 같은 말은 임자말과 비교하는 말을 함께 바꾼 것 하나뿐이다.
      const given = up ? [a, b, big] : [b, a, small], say = ([x, y, w]) => `${josa(x, '은/는')} ${y}보다 더 ${w}.`, flip = (w) => (w === big ? small : big);
      const IF = { 넓다: '넓으면', 좁다: '좁으면', 길다: '길면', 짧다: '짧으면', 무겁다: '무거우면', 가볍다: '가벼우면' };
      const rows = d.shuffle([[[given[1], given[0], flip(given[2])], true], [[given[1], given[0], given[2]], false], [[given[0], given[1], flip(given[2])], false]]);
      return C(`「${say(given)}」와 뜻이 같은 것은?`, rows.map(([row]) => say(row)), rows.findIndex(([, ok]) => ok), {
        explain: `${josa(given[0], '이/가')} ${given[1]}보다 더 ${IF[given[2]]} ${josa(given[1], '은/는')} ${given[0]}보다 더 ${flip(given[2])}.`, facts: { truth: rows.map(([, ok]) => ok), want: true }
      });
    })
  ]);

  B.addGroup('1-1-4', {
    id: 'hard', title: '단원 종합', standard: STD,
    types: [
      H('h-ends', '끝을 맞추지 않은 두 끈', '심2 ①1', (d) => {
        // 긴 끈은 왼쪽 끝이 더 왼쪽에 있고, 짧은 끈은 오른쪽 끝이 더 오른쪽에 있다: 오른쪽 끝만 보면 틀린다.
        const [L, a, k] = d.until(() => [d.int(5, 7), d.int(0, 1), d.int(2, 3)], ([len, from, gap]) => from + gap + len - 1 <= 9), spans = d.shuffle([[a, a + L], [a + k, a + k + L - 1]]), ropes = some(d, ROPES.slice(0, 3), 2);
        const lens = spans.map(([from, to]) => to - from), long = lens.indexOf(L);
        return C('더 긴 끈은?', ropes.map((r) => r[0]), long, {
          figure: hbars(spans.map(([from, to], i) => ({ name: ropes[i][0], from, to, color: ropes[i][1] })), { cols: 9, label: `끈의 양 끝이 놓인 금: ${spans.map(([from, to], i) => `${ropes[i][0]} ${from + 1}번 금에서 ${to + 1}번 금까지`).join(', ')}` }),
          explain: `두 끈은 어느 쪽 끝도 맞추어져 있지 않으므로 양 끝을 모두 본다. 칸을 세면 ${ropes[0][0]}은 ${lens[0]}칸, ${ropes[1][0]}은 ${lens[1]}칸이므로 ${ropes[long][0]}이 더 길다.`,
          facts: { choose: { exprs: spans.map(([from, to]) => `${to + 1}-${from + 1}`), rule: 'max' } }
        });
      }),
      H('h-bent', '양 끝을 맞춘 곧은 끈과 구부러진 끈', '심5 ①9', (d) => {
        const D = d.int(5, 6), x1 = d.int(1, D - 3), x2 = d.int(x1 + 1, D - 1), ropes = some(d, ROPES.slice(0, 3), 2), bentTop = d.bool();
        const path = (bent, base) => (bent ? [[0, base], [x1, base], [x1, base - 1], [x2, base - 1], [x2, base], [D, base]] : [[0, base], [D, base]]), lens = bentTop ? [D + 2, D] : [D, D + 2], long = lens.indexOf(D + 2);
        return C('양 끝을 맞춘 두 끈이다. 더 긴 끈은?', [ropes[0][0], ropes[1][0], '길이가 같다'], long, {
          figure: strings(D, ropes.map((r, i) => ({ name: r[0], color: r[1], points: path(i === long, i ? 3 : 1) })), `양 끝을 맞춘 두 끈: ${ropes.map((r, i) => `${r[0]}은 ${i === long ? '구부러져 있고' : '곧고'} 금을 따라 ${lens[i]}칸`).join(', ')}`),
          explain: `끈의 길이는 곧게 폈을 때의 길이이다. 양 끝이 맞추어져 있어도 구부러진 ${ropes[long][0]}을 곧게 펴면 ${ropes[1 - long][0]}보다 더 길다. 칸의 선을 따라 세면 ${lens[long]}칸과 ${lens[1 - long]}칸이다.`,
          facts: { choose: { exprs: lens.map(String), rule: 'max' } }
        });
      }),
      H('h-stand', '받침 위에 선 사람의 키', '심8', (d) => {
        // 키가 작을수록 높은 받침에 섰다: 머리가 가장 높이 있는 사람은 키가 가장 큰 사람이 아니다.
        const a = d.int(3, 4), who = some(d, NAMES, 3), rows = d.shuffle([{ h: a, base: 3 }, { h: a + 1, base: d.int(1, 2) }, { h: a + 2, base: 0 }]), tall = rows.findIndex((r) => r.h === a + 2);
        return C('키가 가장 큰 사람은?', who, tall, {
          figure: vbars(rows.map((r, i) => ({ name: who[i], len: r.h, base: r.base, kind: 'person' })), { rows: 8, pitch: 64, label: `받침 위에 선 사람: ${rows.map((r, i) => `${who[i]} 받침 ${r.base}칸, 머리 끝 ${r.h + r.base}칸`).join(' / ')}` }),
          explain: `선 곳의 높이가 다르므로 머리 끝만 보면 안 된다. 발끝에서 머리 끝까지 칸을 세면 ${rows.map((r, i) => `${who[i]} ${r.h}칸`).join(', ')}이므로 ${name(who[tall], '이/가')} 가장 크다.`,
          facts: { choose: { exprs: rows.map((r) => `${r.h + r.base}-${r.base}`), rule: 'max' } }
        });
      }),
      H('h-balloon', '크지만 가벼운 것이 놓인 시소', '심17', (d) => {
        const [big, small] = d.pick([['풍선', '구슬'], ['비치볼', '쇠구슬'], ['솜사탕', '돌멩이']]), bigLeft = d.bool(), light = { name: big, kind: 'ball', r: 21, color: '#f9a8d4' }, heavy = { name: small, kind: 'ball', r: 6, color: '#64748b' };
        return C('더 무거운 것은?', bigLeft ? [big, small] : [small, big], bigLeft ? 1 : 0, {
          figure: seesaw(bigLeft ? light : heavy, bigLeft ? heavy : light, bigLeft ? 'right' : 'left'),
          explain: `시소는 무거운 쪽이 내려간다. ${josa(big, '은/는')} 크지만 위로 올라갔고 ${josa(small, '은/는')} 작지만 아래로 내려갔으므로 ${josa(small, '이/가')} 더 무겁다.`,
          facts: { choose: { exprs: bigLeft ? ['3', '1'] : ['1', '3'], rule: 'min' } }
        });
      }),
      H('h-cells', '칸의 크기가 다른 두 모양의 넓이', '심32 ①35', (d) => {
        // 큰 칸 1칸은 작은 칸 4칸과 크기가 같다. 칸 수는 언제나 작은 칸 쪽이 많지만 넓이는 그렇지 않다.
        const n = d.pick([6, 7, 9]), bigFirst = d.bool(), flat = d.bool(), big = { size: 2, cells: flat ? [[0, 1], [1, 1]] : [[0, 0], [0, 1]] }, small = { size: 1, cells: blob(d, n, 4, 4) };
        const panels = (bigFirst ? [big, small] : [small, big]).map((p, i) => Object.assign({ name: TAGS[i] }, p)), exprs = bigFirst ? ['2*4', String(n)] : [String(n), '2*4'], wider = (8 > n) === bigFirst ? 0 : 1;
        return C('가와 나 중 더 넓은 것은?', ['가', '나'], wider, {
          figure: twoGrids(panels, `칸의 크기가 다른 두 모눈: ${bigFirst ? `가는 큰 칸 2칸, 나는 작은 칸 ${n}칸` : `가는 작은 칸 ${n}칸, 나는 큰 칸 2칸`}. 큰 칸 1칸은 작은 칸 4칸과 크기가 같다`),
          explain: `칸의 크기가 다르므로 칸 수만으로는 비교할 수 없다. 큰 칸 1칸에는 작은 칸 4칸이 들어가므로 큰 칸 2칸은 작은 칸 8칸과 넓이가 같다. 8칸과 ${n}칸을 비교하면 더 넓은 것은 ${TAGS[wider]}이다.`,
          facts: { choose: { exprs, rule: 'max' } }
        });
      }),
      H('h-wide', '물의 높이가 같고 굵기가 다른 두 그릇', '심37·38 ①48', (d) => {
        const lv = d.int(3, 5), w = d.shuffle([1, 2]), list = ['가', '나'].map((t, i) => ({ name: t, w: w[i], h: lv + 2, level: lv })), more = w.indexOf(2);
        return C('물의 높이가 같다. 물이 더 많이 담긴 그릇은?', ['가 그릇', '나 그릇', '양이 같다'], more, {
          figure: cups(list, `물이 담긴 그릇: ${cupsSaid(list)}`),
          explain: `물의 높이가 같아도 그릇의 굵기가 다르면 물의 양이 다르다. 옆으로 더 넓은 ${list[more].name} 그릇에 물이 더 많이 담겼다.`, facts: { choose: { exprs: list.map((c) => `${c.w}*${c.level}`), rule: 'max' } }
        });
      }),
      H('h-left', '남은 양으로 가장 많이 마신 사람 찾기', '심39 ①50', (d) => {
        const lv = run(d, 3, 1, 5), who = some(d, NAMES, 3), list = who.map((t, i) => ({ name: t, w: 2, h: 6, level: lv[i] })), most = lv.indexOf(Math.min(...lv));
        return C('똑같은 컵에 주스를 가득 담아 마시고 남은 것이다. 가장 많이 마신 사람은?', who, most, {
          figure: cups(list, `마시고 남은 주스: ${cupsSaid(list)}`),
          explain: `똑같은 컵에 가득 담았으므로 많이 마실수록 적게 남는다. 주스가 가장 적게 남은 ${name(who[most], '이/가')} 가장 많이 마셨다.`, facts: { choose: { exprs: lv.map(String), rule: 'min' } }
        });
      }),
      H('h-fill', '가득 채우려면 더 부어야 하는 물', '심40·41', (d) => {
        // 빈 곳이 가장 큰 그릇은 물이 가장 적게 담긴 그릇이 아니다(빈 곳을 세어야 한다). 빈 곳의 차이는 한 칸이다.
        const made = d.until(() => [0, 1, 2].map(() => { const h = d.int(4, 7); return { w: 2, h, level: d.int(1, h - 1) }; }), (cupsMade) => {
          const gaps = cupsMade.map((c) => c.h - c.level), levels = cupsMade.map((c) => c.level), sorted = gaps.slice().sort((x, y) => y - x);
          return new Set(gaps).size === 3 && new Set(levels).size === 3 && sorted[0] - sorted[1] === 1 && gaps.indexOf(sorted[0]) !== levels.indexOf(Math.min(...levels));
        });
        const list = made.map((c, i) => Object.assign({ name: TAGS[i] }, c)), gaps = list.map((c) => c.h - c.level), hit = gaps.indexOf(Math.max(...gaps));
        return C('가득 채우려면 물을 가장 많이 더 부어야 하는 그릇은?', list.map((c) => c.name + ' 그릇'), hit, {
          figure: cups(list, `물이 담긴 그릇: ${cupsSaid(list)}`),
          explain: `더 부어야 하는 물은 그릇의 빈 곳만큼이다. 굵기가 같으므로 물 위로 빈 칸을 세면 ${list.map((c, i) => `${c.name} ${gaps[i]}칸`).join(', ')}이다. 빈 곳이 가장 큰 ${list[hit].name} 그릇에 가장 많이 부어야 한다.`,
          facts: { choose: { exprs: list.map((c) => `${c.h}-${c.level}`), rule: 'max' } }
        });
      }),
      H('h-over', '부었더니 넘친 물', '심43', (d) => {
        const [a, b] = d.pick([['물병', '냄비'], ['주전자', '어항'], ['컵', '꽃병']]), options = d.shuffle([a, b]);
        return C(`${a}에 가득 담은 물을 빈 ${b}에 모두 부었다. 물이 넘쳤다. 더 많이 담을 수 있는 것은?`, options, options.indexOf(a), {
          explain: `${b}에 다 들어가지 못하고 넘쳤으므로 ${a}에 담겼던 물이 ${josa(b, '이/가')} 담을 수 있는 양보다 많다. ${josa(a, '이/가')} 더 많이 담을 수 있다.`, facts: { truth: options.map((o) => o === a), want: true }
        });
      }),
      H('h-chain', '시소 두 번으로 가장 무거운 사람 찾기', '심18 ①27, 글 조건 심11·19 ①13·37', (d) => {
        const [light, mid, heavy] = some(d, NAMES, 3), askHeavy = d.bool(), weight = (w) => [light, mid, heavy].indexOf(w) + 1;
        const ride = (x, y) => { const [left, right] = d.shuffle([x, y]); return seesaw({ name: left, kind: 'person', color: PALETTE[weight(left) - 1] }, { name: right, kind: 'person', color: PALETTE[weight(right) - 1] }, weight(left) > weight(right) ? 'left' : 'right', { width: 130 }); };
        const options = d.shuffle([light, mid, heavy]);
        return C(`시소를 두 번 탔다. 가장 ${askHeavy ? '무거운' : '가벼운'} 사람은?`, options, options.indexOf(askHeavy ? heavy : light), {
          figure: d.shuffle([ride(light, mid), ride(mid, heavy)]).join(''),
          explain: `시소는 무거운 쪽이 내려간다. ${name(heavy, '은/는')} ${nick(mid)}보다 무겁고 ${name(mid, '은/는')} ${nick(light)}보다 무겁다. 무거운 사람부터 쓰면 ${heavy}, ${mid}, ${light}이다.`,
          facts: { rank: { values: options.map(weight), nth: askHeavy ? 1 : 3 } }
        });
      }),
      H('h-mine', '말에 맞는 물병 찾기', '심44·10', (d) => {
        const h = run(d, 3, 4, 7), who = some(d, NAMES, 3), names = TAGS.slice(0, 3), list = names.map((t, i) => ({ name: t, w: 2, h: h[i] })), by = [0, 1, 2].sort((p, q) => h[q] - h[p]);
        return C(`세 사람의 물병이다. ${nick(who[0])}의 물병은 ${nick(who[1])}의 물병보다 많이 담고 ${nick(who[2])}의 물병보다 적게 담는다. ${nick(who[0])}의 물병은?`, names, by[1], {
          figure: cups(list, `세 사람의 빈 물병: ${cupsSaid(list)}`),
          explain: `한 물병보다는 많이 담고 다른 물병보다는 적게 담으므로 셋 중 가운데 크기이다. 굵기가 같으므로 높이가 가운데인 ${names[by[1]]}이다.`, facts: { rank: { values: h, nth: 2 } }
        });
      })
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
