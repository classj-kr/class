// 1학년 1학기 4단원 비교하기 — 단원 틀, 그림 도구, 기본 문항(길이·무게).
// 수집해 둔 교과서 평가 자료(미래엔·아이스크림미디어·천재)에서 뽑은 꼴 목록(기본꼴 56꼴, 심화꼴 47꼴)을 처음부터 끝까지 대조하여 실었다.
// 영역은 「도형과 측정」 가운데 측정, 성취기준은 [2수03-06] 구체물의 길이, 들이, 무게, 넓이를 비교하여
// 각각 '길다, 짧다', '많다, 적다', '무겁다, 가볍다', '넓다, 좁다' 등을 구별하여 말할 수 있다.
//
// 싣는 기준
//  - 유형은 견주는 양(길이·무게·넓이·담을 수 있는 양), 견주는 방법(끝 맞추기·겹치기·저울·칸 수·물 높이·옮겨 담기),
//    묻는 것(더 ~한 것, 가장 ~한 것, 차례, 알맞은 말)이 다를 때만 나눈다. 물건만 바꾼 같은 문제는 한 번만 싣는다.
//  - 교육과정: 「양을 비교할 때 '짧다', '많다', '넓다' 등과 같이 한글로 쓰게 하는 것은 지양한다」 → 비교하는 말은 고르기로만 묻고, 답 칸에는 숫자만 받는다.
//  - 단위(cm·kg·L)와 잰 값은 쓰지 않는다. 그림의 길이·높이는 칸으로 정하고 차이는 한두 칸으로 둔다(눈대중이 아니라 맞춘 끝과 칸으로 가린다).
//    수는 9까지만 쓴다(「50까지의 수」는 다음 단원이다).
//  - 비교하는 말은 수능 문체에 맞추어 「더 길다」「더 짧다」 꼴로 적는다.
//
// 뺀 것과 까닭(꼴 번호: ①n = 기본꼴_1의 n번, 심n = 심화꼴의 n번)
//  - 긋기·그리기·색칠하기: ①14(기준보다 길게 선 긋기), ①38(조건에 맞는 넓이로 그리기), ①39(점을 이어 그리기), 심22(알맞은 물건 그리기), 심24의 색칠 변형
//  - 답이 열려 있는 서술형: ①28(교실에서 찾아 쓰기), ①40(문장 만들기), 심34(실생활에서 찾아 문장 완성)
//  - 2학년 1학기 「여러 가지 단위로 재기」의 생각: ①54(크기가 다른 컵으로 부은 횟수가 적을수록 컵이 크다)
//  - 조건을 두 번 넘게 이어야 하는 추론: ①53(옮겨 부은 결과 둘로 세 컵의 차례), 심26(둘씩 견준 그림 둘로 셋의 차례)는
//    한 번 잇는 추론(시소 두 번, 실력 h-chain) 하나로 갈음한다. 글 조건 둘을 잇는 ①13·①37·심11·심19도 같은 추론이라 따로 싣지 않는다.
//  - 같은 문제: 선 잇기(①3·19·31·43, 심4·15)와 말로 비교하기(①15, 심12)는 알맞은 말 고르기와 같다. ①20(빈칸 둘에 이름, 무게)은 ①4와,
//    ①46(기준 물병보다 많은 것·적은 것)은 차례 쓰기와, 심21(받침대가 무너지지 않을 물건)·심33(교실보다 넓은 곳)은 겪어 본 것으로 고르기와 같다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, name, nick, NAMES, box, lines, N, C } = B.kit;
  const STD = '2수03-06';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});

  // ── 수 고르기 ────────────────────────────────────────────────
  const some = (d, list, n) => d.shuffle(list).slice(0, n);
  // 이어진 수 n개를 섞는다(차이가 한 칸씩이라 눈대중으로는 가릴 수 없다).
  const run = (d, n, lo, hi) => { const a = d.int(lo, hi - n + 1); return d.shuffle(Array.from({ length: n }, (_, i) => a + i)); };
  const ORDERS = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];
  // 차례 고르기의 보기: 맞는 차례 하나와 틀린 차례 셋
  const orderOptions = (d, right) => { const list = d.shuffle(d.shuffle(ORDERS.filter((o) => o.join() !== right.join())).slice(0, 3).concat([right])); return { list, answer: list.findIndex((o) => o.join() === right.join()) }; };
  // 「모두 고른 것」의 보기: 넷 가운데 둘씩 묶은 것 넷(맞는 묶음은 하나)
  function pairOptions(d, labels, flags) {
    const all = []; for (let i = 0; i < labels.length; i += 1) for (let j = i + 1; j < labels.length; j += 1) all.push([i, j]);
    const right = labels.map((_, i) => i).filter((i) => flags[i]);
    const sets = d.shuffle(d.shuffle(all.filter((p) => p.join() !== right.join())).slice(0, 3).concat([right])).map((p) => p.map((i) => labels[i]));
    return { sets, options: sets.map((s) => s.join(', ')), answer: sets.findIndex((s) => s.join() === right.map((i) => labels[i]).join()) };
  }
  // 길이가 비슷한 물건(어느 것이 더 길어도 이상하지 않다)
  const PENS = ['연필', '색연필', '볼펜', '사인펜', '붓', '빨대', '숟가락', '포크', '칫솔'];
  const ROPES = [['빨간 끈', '#f87171'], ['파란 끈', '#60a5fa'], ['노란 끈', '#facc15'], ['초록색 끈', '#4ade80']];
  const TAGS = ['가', '나', '다', '라', '마'];
  // 겪어 보아 아는 무게: 뒤쪽 묶음의 것이 앞쪽 묶음의 것보다 훨씬 무겁다(같은 묶음끼리는 견주지 않는다).
  const HEAVY = [['깃털', '색종이'], ['연필', '지우개'], ['필통', '수학책'], ['책가방', '수박'], ['자전거', '책상'], ['냉장고', '세탁기'], ['자동차', '버스']];
  const ANIMALS = [['개미'], ['병아리', '참새'], ['고양이', '토끼'], ['돼지', '사자'], ['코끼리']];

  // ── 그림 ────────────────────────────────────────────────────
  // 길이·높이는 모두 칸으로 정해 그리고, 그림 설명(aria-label)에 칸 수를 적는다(검사가 그 글로 다시 견준다).
  const fx = (n) => Math.round(n * 100) / 100;
  const INK = '#1f2933', GRID = 'stroke:#c9d6e4;stroke-width:0.8', THICK = 'stroke:#1f2933;stroke-width:1.8;stroke-linecap:round';
  const PALETTE = ['#93c5fd', '#fdba74', '#86efac', '#f9a8d4', '#fde68a', '#c4b5fd'];
  const svg = (w, h, label, body) => `<svg class="mb-geo" viewBox="0 0 ${fx(w)} ${fx(h)}" width="${Math.round(w)}" role="img" aria-label="${label}">${body}</svg>`;
  const seg = (x1, y1, x2, y2, style) => `<line x1="${fx(x1)}" y1="${fx(y1)}" x2="${fx(x2)}" y2="${fx(y2)}" style="${style || GRID}"/>`;
  const slab = (x, y, w, h, fill, rx) => `<rect x="${fx(x)}" y="${fx(y)}" width="${fx(w)}" height="${fx(h)}"${rx ? ` rx="${rx}"` : ''} style="fill:${fill};stroke:${INK};stroke-width:1.2"/>`;
  const disc = (cx, cy, r, fill) => `<circle cx="${fx(cx)}" cy="${fx(cy)}" r="${fx(r)}" style="fill:${fill};stroke:${INK};stroke-width:1.2"/>`;
  const word = (x, y, text, anchor) => `<text class="mb-label" x="${fx(x)}" y="${fx(y)}" text-anchor="${anchor || 'middle'}" dominant-baseline="central">${text}</text>`;
  // 글의 너비(13px 글씨)
  const wide = (text) => Array.from(String(text)).reduce((s, ch) => s + (ch === ' ' ? 4 : /[0-9A-Za-z]/.test(ch) ? 7.5 : 13), 0);
  const widest = (list) => Math.max.apply(null, list.map((it) => wide(it.name)));

  // 가로로 놓은 물건. rows: [{ name, from, to, color }] — from·to 는 왼쪽에서 센 금(0부터). o: cols(가로 칸 수), mark('left' | 'right': 맞춘 끝에 점선), label
  function hbars(rows, o) {
    const u = o.u || (o.cols > 8 ? 20 : 22), x0 = widest(rows) + 14, top = 8, bottom = top + rows.length * u, w = x0 + o.cols * u + 10;
    let out = '';
    for (let c = 0; c <= o.cols; c += 1) out += seg(x0 + c * u, top, x0 + c * u, bottom);
    for (let r = 0; r <= rows.length; r += 1) out += seg(x0, top + r * u, x0 + o.cols * u, top + r * u);
    if (o.mark) { const x = x0 + (o.mark === 'left' ? 0 : o.cols) * u; out += seg(x, top - 5, x, bottom + 5, 'stroke:#b42318;stroke-width:1.6;stroke-dasharray:4 3'); }
    rows.forEach((row, i) => {
      const y = top + i * u + u / 2;
      out += slab(x0 + row.from * u, y - 5.5, (row.to - row.from) * u, 11, row.color || PALETTE[i % PALETTE.length], 3) + word(x0 - 8, y, row.name, 'end');
    });
    return svg(w, bottom + 8, o.label, out);
  }

  // 세워 놓은 것. items: [{ name, len, base(받침의 높이), kind: 'bar' | 'person' | 'blocks' | 'house', color }]
  // o: rows(가로금의 수), hang(위쪽 끝을 맞추어 매단다), label. 높이 한 칸은 18px.
  function vbars(items, o) {
    const u = o.u || 18, pitch = o.pitch || Math.max(50, widest(items) + 14), top = o.hang ? 12 : 8, ground = top + o.rows * u, w = 16 + items.length * pitch;
    let out = '';
    for (let r = 0; r <= o.rows; r += 1) out += seg(8, top + r * u, w - 8, top + r * u);
    out += o.hang ? seg(8, top, w - 8, top, 'stroke:#a86a00;stroke-width:4;stroke-linecap:round') : seg(8, ground, w - 8, ground, THICK);
    items.forEach((it, i) => {
      const cx = 8 + i * pitch + pitch / 2, color = it.color || PALETTE[i % PALETTE.length], foot = ground - (it.base || 0) * u;
      if (o.hang) out += slab(cx - 5, top, 10, it.len * u, color, 3);
      else if (it.kind === 'person') {
        if (it.base) out += slab(cx - 17, foot, 34, it.base * u, '#e2e8f0') + seg(cx - 17, foot, cx + 17, ground, 'stroke:#94a3b8;stroke-width:1') + seg(cx + 17, foot, cx - 17, ground, 'stroke:#94a3b8;stroke-width:1');
        out += slab(cx - 8.5, foot - (it.len - 1) * u, 17, (it.len - 1) * u, color, 7) + disc(cx, foot - (it.len - 0.5) * u, u / 2, color);
      } else if (it.kind === 'blocks') { for (let k = 0; k < it.len; k += 1) out += slab(cx - 15, ground - (k + 1) * u, 30, u, color); }
      else if (it.kind === 'house') {
        out += slab(cx - 17, ground - it.len * u, 34, it.len * u, color);
        for (let k = 0; k < it.len; k += 1) out += slab(cx - 11, ground - (k + 1) * u + 5, 8, u - 10, '#fff') + slab(cx + 3, ground - (k + 1) * u + 5, 8, u - 10, '#fff') + (k ? seg(cx - 17, ground - k * u, cx + 17, ground - k * u, 'stroke:#1f2933;stroke-width:0.8') : '');
      } else out += slab(cx - 5.5, ground - it.len * u, 11, it.len * u, color, 3);
      out += word(cx, ground + 13, it.name);
    });
    return svg(w, ground + 24, o.label, out);
  }

  // 터널과 트럭. open: 터널 구멍의 높이(칸), trucks: [{ name, len }]
  function tunnel(open, trucks, label) {
    const u = 18, rows = Math.max(open + 1, Math.max.apply(null, trucks.map((t) => t.len))) + 1, top = 8, ground = top + rows * u, pitch = 58, w = 102 + trucks.length * pitch + 8;
    let out = '';
    for (let r = 0; r <= rows; r += 1) out += seg(8, top + r * u, w - 8, top + r * u);
    out += slab(12, ground - (open + 1) * u, 84, (open + 1) * u, '#cbd5e1') + slab(30, ground - open * u, 48, open * u, '#fff') + word(54, ground - (open + 0.5) * u, '터널');
    trucks.forEach((t, i) => {
      const cx = 102 + i * pitch + pitch / 2;
      out += slab(cx - 20, ground - t.len * u, 40, t.len * u - 6, PALETTE[i]) + disc(cx - 11, ground - 5.5, 5.5, '#475569') + disc(cx + 11, ground - 5.5, 5.5, '#475569') + word(cx, ground + 13, t.name);
    });
    out += seg(8, ground, w - 8, ground, THICK);
    return svg(w, ground + 24, label, out);
  }

  // 시소. left·right: { name, kind: 'ball' | 'person', r(공의 반지름), n(개수), color }, down: 내려간 쪽('left' | 'right')
  // 내려간 끝은 바닥에서 1칸, 올라간 끝은 3칸이다.
  function seesaw(left, right, down, o) {
    const W = (o && o.width) || 230, u = 18, G = 126, cx = W / 2, apex = G - 2 * u, half = W / 2 - 24;
    const yl = apex + (down === 'left' ? u : -u), yr = apex + (down === 'left' ? -u : u), len = Math.hypot(2 * half, yr - yl), ux = 2 * half / len, uy = (yr - yl) / len;
    // 널빤지 가운데에서 s 만큼 간 곳에서 널빤지 위로 lift 만큼 뜬 자리
    const on = (s, lift) => [cx + s * ux + uy * lift, apex + s * uy - ux * lift];
    const put = (thing, side) => {
      const n = thing.n || 1, r = thing.r || 9; let out = '', topY = G, sumX = 0;
      for (let k = 0; k < n; k += 1) {
        if (thing.kind === 'person') {
          const [bx, by] = on(side * (len / 2 - 10), 2.5);
          out += slab(bx - 6.5, by - 17, 13, 17, thing.color, 4) + disc(bx, by - 23.5, 6.5, thing.color); topY = Math.min(topY, by - 30); sumX += bx;
        } else { const [x, y] = on(side * (len / 2 - r - 2 - k * (2 * r + 2)), 2.5 + r); out += disc(x, y, r, thing.color); topY = Math.min(topY, y - r); sumX += x; }
      }
      return out + word(Math.min(Math.max(sumX / n, wide(thing.name) / 2 + 2), W - wide(thing.name) / 2 - 2), topY - 9, thing.name);
    };
    const hl = down === 'left' ? 1 : 3, hr = down === 'left' ? 3 : 1;
    return svg(W, G + 6, `시소: 왼쪽 ${left.name} 바닥에서 ${hl}칸, 오른쪽 ${right.name} 바닥에서 ${hr}칸`,
      seg(8, G, W - 8, G, THICK) + `<polygon points="${fx(cx)},${fx(apex + 2)} ${fx(cx - 14)},${G} ${fx(cx + 14)},${G}" style="fill:#cbd5e1;stroke:${INK};stroke-width:1.2"/>`
      + seg(cx - half, yl, cx + half, yr, 'stroke:#a86a00;stroke-width:5;stroke-linecap:round') + put(left, -1) + put(right, 1));
  }

  // 양팔저울. left·right: { name, r, n, color }, down: 내려간 쪽. 내려간 접시는 바닥에서 2칸, 올라간 접시는 4칸이다.
  function balance(left, right, down) {
    const W = 224, u = 18, G = 150, cx = W / 2, top = G - 6 * u, half = 64, pan = 30;
    const end = (side) => [cx + side * half, top + ((down === 'left') === (side < 0) ? u : -u)];
    const put = (thing, side) => {
      const [ex, ey] = end(side), py = ey + 2 * u, n = thing.n || 1, r = thing.r || 8; let out = '';
      out += seg(ex, ey, ex - pan, py, 'stroke:#475569;stroke-width:1') + seg(ex, ey, ex + pan, py, 'stroke:#475569;stroke-width:1');
      for (let k = 0; k < n; k += 1) out += disc(ex + (k - (n - 1) / 2) * (2 * r + 2), py - r - 1, r, thing.color);
      out += `<path d="M${fx(ex - pan)} ${fx(py)}H${fx(ex + pan)}A${pan} ${u} 0 0 1 ${fx(ex - pan)} ${fx(py)}Z" style="fill:#e2e8f0;stroke:${INK};stroke-width:1.2"/>`;
      return out + word(ex, py + u + 10, thing.name);
    };
    const [lx, ly] = end(-1), [rx, ry] = end(1), hl = down === 'left' ? 2 : 4, hr = down === 'left' ? 4 : 2;
    return svg(W, G + 6, `양팔저울: 왼쪽 접시 ${left.name} 바닥에서 ${hl}칸, 오른쪽 접시 ${right.name} 바닥에서 ${hr}칸`,
      seg(8, G, W - 8, G, THICK) + slab(cx - 22, G - 7, 44, 7, '#cbd5e1') + seg(cx, G - 7, cx, top - 5, 'stroke:#475569;stroke-width:4;stroke-linecap:round')
      + seg(lx, ly, rx, ry, 'stroke:#a86a00;stroke-width:4;stroke-linecap:round') + disc(cx, top, 3.5, '#fff') + put(left, -1) + put(right, 1));
  }

  // 똑같은 용수철에 매단 상자. items: [{ name, len(늘어난 길이, 칸) }]
  function springs(items, label) {
    const u = 16, pitch = 64, top = 12, rows = Math.max.apply(null, items.map((it) => it.len)) + 2, w = 16 + items.length * pitch;
    let out = '';
    for (let r = 0; r <= rows; r += 1) out += seg(8, top + r * u, w - 8, top + r * u);
    items.forEach((it, i) => {
      const cx = 8 + i * pitch + pitch / 2, end = top + it.len * u, turns = 10; let path = `M${fx(cx)} ${top}`;
      for (let k = 1; k < turns; k += 1) path += `L${fx(cx + (k % 2 ? 7 : -7))} ${fx(top + (end - top) * k / turns)}`;
      out += `<path d="${path}L${fx(cx)} ${fx(end)}" style="fill:none;stroke:#475569;stroke-width:1.6;stroke-linejoin:round"/>` + slab(cx - 17, end, 34, 22, PALETTE[i], 3) + word(cx, end + 11, it.name);
    });
    return svg(w, top + rows * u + 8, label, out + seg(8, top, w - 8, top, 'stroke:#a86a00;stroke-width:4;stroke-linecap:round'));
  }

  // 똑같은 스펀지 위에 올린 상자. items: [{ name, sink(스펀지가 눌린 깊이, 칸) }] — 깊이 한 칸은 6px이고 스펀지의 두께는 5칸이다.
  function sponges(items, label) {
    const u = 6, pitch = 112, top = 8, tall = 34, soft = top + tall + 6, w = 16 + items.length * pitch;
    let out = '';
    items.forEach((it, i) => {
      const cx = 8 + i * pitch + pitch / 2, dent = soft + it.sink * u;
      out += `<path d="M${cx - 46} ${soft}H${cx - 25}V${dent}H${cx + 25}V${soft}H${cx + 46}V${soft + 5 * u}H${cx - 46}Z" style="fill:#fde68a;stroke:${INK};stroke-width:1.2;stroke-linejoin:round"/>`;
      for (let k = 1; k < 5; k += 1) out += seg(cx - 46, soft + k * u, cx + 46, soft + k * u, 'stroke:#d6a700;stroke-width:0.6;stroke-dasharray:2 2');
      out += slab(cx - 24, dent - tall, 48, tall, PALETTE[i], 3) + word(cx, dent - tall / 2, it.name);
    });
    return svg(w, soft + 5 * u + 8, label, out + seg(8, soft + 5 * u, w - 8, soft + 5 * u, THICK));
  }

  // 모눈 위의 두 길. points: 모눈 점의 차례 [[x, y], …](가로 x, 세로 y — 집과 학교는 y = 0, 위쪽 길은 음수), D: 집에서 학교까지의 가로 칸 수
  function roads(D, paths, label) {
    const u = 22, x0 = 34, up = 2, down = 2, top = 20, y0 = top + up * u, w = x0 + D * u + 50, at = (p) => [x0 + p[0] * u, y0 + p[1] * u];
    let out = '';
    for (let c = 0; c <= D; c += 1) out += seg(x0 + c * u, top, x0 + c * u, top + (up + down) * u);
    for (let r = 0; r <= up + down; r += 1) out += seg(x0, top + r * u, x0 + D * u, top + r * u);
    paths.forEach((path, i) => {
      const ys = path.points.map((p) => p[1]), edge = path.points[1][1] < 0 ? Math.min.apply(null, ys) : Math.max.apply(null, ys), flat = path.points.findIndex((p, k) => k && p[1] === edge && path.points[k - 1][1] === edge);
      const mid = (path.points[flat][0] + path.points[flat - 1][0]) / 2;
      out += `<polyline points="${path.points.map((p) => at(p).map(fx).join(',')).join(' ')}" style="fill:none;stroke:${i ? '#ea580c' : '#2563eb'};stroke-width:4;stroke-linejoin:round;stroke-linecap:round"/>`
        + word(x0 + mid * u, y0 + edge * u + (edge < 0 ? -11 : 11), path.name);
    });
    return svg(w, top + (up + down) * u + 20, label, out + disc(x0, y0, 4.5, INK) + disc(x0 + D * u, y0, 4.5, INK) + word(x0 - 9, y0, '집', 'end') + word(x0 + D * u + 9, y0, '학교', 'start'));
  }

  // 다른 파일(1-1-4b.js)에서도 쓴다.
  B.kit.g114 = { STD, some, run, ORDERS, orderOptions, pairOptions, PENS, ROPES, TAGS, fx, INK, GRID, THICK, PALETTE, svg, seg, slab, disc, word, wide, widest, hbars, vbars, seesaw, balance };

  const told = (things, lens) => things.map((t, i) => `${t} ${lens[i]}칸`).join(', ');
  const chain = (things, by) => by.map((i) => things[i]).join(', ');

  B.addUnit({
    id: '1-1-4', grade: 1, semester: 1, no: 4, title: '비교하기', version: 1,
    groups: [
      {
        id: 'len', title: '길이 비교하기', standard: STD,
        types: [
          T('len-two', '위쪽 끝을 맞춘 두 끈', '①1 심1', (d) => {
            const s = d.int(4, 7), lens = d.shuffle([s, s + 1]), ropes = some(d, ROPES, 2), long = lens.indexOf(s + 1);
            return C('위쪽 끝을 맞추어 매달았다. 더 긴 끈은?', ropes.map((r) => r[0]), long, {
              figure: vbars(ropes.map((r, i) => ({ name: r[0], len: lens[i], color: r[1] })), { rows: 9, hang: true, pitch: 84, label: `위쪽 끝을 맞추어 매단 끈의 길이: ${told(ropes.map((r) => r[0]), lens)}` }),
              explain: `위쪽 끝을 맞추었으므로 아래쪽 끝을 비교한다. 아래로 더 내려온 ${ropes[long][0]}이 더 길다.`, facts: { choose: { exprs: lens.map(String), rule: 'max' } }
            });
          }),
          T('len-word', '길이를 비교하는 말 고르기', '①2·3·15 심4·12', (d) => {
            const s = d.int(5, 8), lens = d.shuffle([s, s + 1]), [a, b] = some(d, PENS, 2), longer = lens[0] > lens[1];
            return C(`${box()} 안에 알맞은 말은?`, ['길다', '짧다'], longer ? 0 : 1, {
              figure: hbars([{ name: a, from: 0, to: lens[0] }, { name: b, from: 0, to: lens[1] }], { cols: 9, mark: 'left', label: `왼쪽 끝을 맞춘 물건의 길이: ${told([a, b], lens)}` }) + lines([`${josa(a, '은/는')} ${b}보다 더 ${box()}.`]),
              explain: `왼쪽 끝을 맞추었으므로 오른쪽 끝을 비교한다. ${josa(a, '은/는')} ${b}보다 오른쪽으로 ${longer ? '더 나왔으므로 더 길다' : '덜 나왔으므로 더 짧다'}.`, facts: { choose: { exprs: lens.map(String), rule: 'max' } }
            });
          }),
          T('len-fill', '길이를 비교한 말에 이름 넣기', '①4·20', (d) => {
            const s = d.int(5, 8), lens = d.shuffle([s, s + 1]), who = some(d, NAMES, 2), short = lens.indexOf(s);
            return C('㉠, ㉡에 알맞은 이름을 차례로 쓴 것은?', [`${who[0]}, ${who[1]}`, `${who[1]}, ${who[0]}`], short, {
              figure: hbars(who.map((w, i) => ({ name: w, from: 9 - lens[i], to: 9, color: PALETTE[i + 2] })), { cols: 9, mark: 'right', label: `오른쪽 끝을 맞춘 끈의 길이: ${told(who, lens)}` }) + lines([`${box('㉠')}의 끈은 ${box('㉡')}의 끈보다 더 짧다.`]),
              explain: `오른쪽 끝을 맞추었으므로 왼쪽 끝을 비교한다. 왼쪽으로 덜 나온 ${nick(who[short])}의 끈이 ${nick(who[1 - short])}의 끈보다 더 짧다.`, facts: { choose: { exprs: lens.map(String), rule: 'min' } }
            });
          }),
          T('len-three', '셋 중 가장 짧은 것', '①5 심2', (d) => {
            const lens = run(d, 3, 5, 9), things = some(d, PENS, 3), short = lens.indexOf(Math.min(...lens));
            return C('가장 짧은 것은?', things, short, {
              figure: hbars(things.map((t, i) => ({ name: t, from: 0, to: lens[i] })), { cols: 9, mark: 'left', label: `왼쪽 끝을 맞춘 물건의 길이: ${told(things, lens)}` }),
              explain: `왼쪽 끝을 맞추었으므로 오른쪽 끝을 비교한다. 오른쪽으로 가장 덜 나온 ${josa(things[short], '이/가')} 가장 짧다.`, facts: { choose: { exprs: lens.map(String), rule: 'min' } }
            });
          }),
          T('len-order', '긴 것부터 차례로 쓰기', '①6', (d) => {
            const lens = run(d, 3, 4, 8), things = some(d, PENS, 3), right = [0, 1, 2].sort((p, q) => lens[q] - lens[p]), { list, answer } = orderOptions(d, right);
            return C('긴 것부터 차례로 쓴 것은?', list.map((o) => chain(things, o)), answer, {
              figure: vbars(things.map((t, i) => ({ name: t, len: lens[i] })), { rows: 8, label: `아래쪽 끝을 맞추어 세운 물건의 길이: ${told(things, lens)}` }),
              explain: `아래쪽 끝을 맞추었으므로 위쪽 끝을 비교한다. 위로 많이 올라간 것부터 쓰면 ${chain(things, right)}이다.`, facts: { choose: { exprs: lens.map(String), rule: 'descending', orders: list } }
            });
          }),
          T('len-than', '기준보다 더 긴 것 모두 고르기', '①7 심3', (d) => {
            const ref = d.int(5, 6), lens = d.shuffle([ref - 2, ref - 1, ref + 1, ref + 2]), [base, ...things] = some(d, PENS, 5), flags = lens.map((v) => v > ref), made = pairOptions(d, things, flags);
            return C(`${base}보다 더 긴 것을 모두 고른 것은?`, made.options, made.answer, {
              figure: hbars([{ name: base, from: 0, to: ref, color: '#cbd5e1' }].concat(things.map((t, i) => ({ name: t, from: 0, to: lens[i], color: PALETTE[i] }))), { cols: 8, mark: 'left', label: `왼쪽 끝을 맞춘 물건의 길이: ${told([base].concat(things), [ref].concat(lens))}` }),
              explain: `왼쪽 끝을 맞추었으므로 오른쪽 끝이 ${base}보다 더 나온 것을 찾는다. ${things.filter((_, i) => flags[i]).join(', ')}이다.`, facts: { sets: { labels: things, flags, options: made.sets } }
            });
          }),
          T('len-count', '기준보다 더 짧은 것의 수', '①8', (d) => {
            const ref = d.int(5, 6), k = d.int(1, 3), lens = d.shuffle(some(d, [ref - 3, ref - 2, ref - 1], k).concat(some(d, [ref + 1, ref + 2, ref + 3], 4 - k))), [base, ...things] = some(d, PENS, 5);
            return N(`${base}보다 더 짧은 것은 몇 개인가?`, k, {
              unit: '개', figure: vbars([{ name: base, len: ref, color: '#cbd5e1' }].concat(things.map((t, i) => ({ name: t, len: lens[i], color: PALETTE[i] }))), { rows: 9, label: `아래쪽 끝을 맞추어 세운 물건의 길이: ${told([base].concat(things), [ref].concat(lens))}` }),
              explain: `아래쪽 끝을 맞추었으므로 위쪽 끝이 ${base}보다 낮은 것을 센다. ${things.filter((_, i) => lens[i] < ref).join(', ')}이므로 ${k}개이다.`, facts: { choose: { exprs: lens.map(String), rule: 'countBelow', target: ref } }
            });
          }),
          T('len-true', '길이를 바르게 비교한 말 찾기', '①12', (d) => {
            const lens = run(d, 4, 4, 8), things = some(d, PENS, 4), by = [0, 1, 2, 3].sort((p, q) => lens[p] - lens[q]);
            const more = (i, j) => ({ text: `${josa(things[i], '은/는')} ${things[j]}보다 더 길다.`, ok: lens[i] > lens[j] }), less = (i, j) => ({ text: `${josa(things[i], '은/는')} ${things[j]}보다 더 짧다.`, ok: lens[i] < lens[j] });
            const most = (i, big) => ({ text: `${josa(things[i], '이/가')} 가장 ${big ? '길다' : '짧다'}.`, ok: lens[i] === (big ? Math.max(...lens) : Math.min(...lens)) });
            // 옳은 말 하나(이웃한 두 물건), 틀린 말 둘(둘째로 긴 것을 가장 길다고 한 말, 이웃한 두 물건을 거꾸로 비교한 말)
            const k = d.int(0, 2), j = d.until(() => d.int(0, 2), (v) => v !== k);
            const rows = d.shuffle([d.bool() ? more(by[k + 1], by[k]) : less(by[k], by[k + 1]), d.bool() ? most(by[2], true) : most(by[1], false), d.bool() ? more(by[j], by[j + 1]) : less(by[j + 1], by[j])]);
            return C('길이를 바르게 비교한 것은?', rows.map((row) => row.text), rows.findIndex((row) => row.ok), {
              figure: hbars(things.map((t, i) => ({ name: t, from: 0, to: lens[i] })), { cols: 8, mark: 'left', label: `왼쪽 끝을 맞춘 물건의 길이: ${told(things, lens)}` }),
              explain: `왼쪽 끝을 맞추었으므로 오른쪽 끝을 비교한다. 짧은 것부터 쓰면 ${chain(things, by)}이다.`, facts: { truth: rows.map((row) => row.ok), want: true }
            });
          }),
          T('len-road', '칸 수로 더 가까운 길 찾기', '심6', (d) => {
            // 위쪽 길과 아래쪽 길 가운데 하나는 한 번, 다른 하나는 두 번 꺾어 돌아간다(D + 2칸과 D + 4칸).
            const D = d.int(4, 5), flip = d.bool(), x1 = d.int(1, D - 2), x2 = d.int(x1 + 1, D - 1), names = ['가 길', '나 길'];
            const plain = (s) => [[0, 0], [0, s], [D, s], [D, 0]], bumpy = (s) => [[0, 0], [0, s], [x1, s], [x1, 2 * s], [x2, 2 * s], [x2, s], [D, s], [D, 0]];
            const lens = flip ? [D + 4, D + 2] : [D + 2, D + 4], points = flip ? [bumpy(-1), plain(1)] : [plain(-1), bumpy(1)], near = lens.indexOf(D + 2);
            return C('집에서 학교까지 가는 더 가까운 길은?', names, near, {
              figure: roads(D, names.map((n, i) => ({ name: n, points: points[i] })), `칸의 금을 따라 그린 길의 길이: ${told(names, lens)}`),
              explain: `길을 따라 칸을 세면 가 길은 ${lens[0]}칸, 나 길은 ${lens[1]}칸이다. 칸 수가 더 적은 ${names[near]}이 더 가깝다.`, facts: { choose: { exprs: lens.map(String), rule: 'min' } }
            });
          }),
          T('high-order', '쌓은 높이를 낮은 것부터 차례로 쓰기', '심7', (d) => {
            const n = run(d, 3, 3, 7), names = TAGS.slice(0, 3), right = [0, 1, 2].sort((p, q) => n[p] - n[q]), { list, answer } = orderOptions(d, right);
            return C('똑같은 블록을 쌓았다. 낮은 것부터 차례로 쓴 것은?', list.map((o) => chain(names, o)), answer, {
              figure: vbars(names.map((t, i) => ({ name: t, len: n[i], kind: 'blocks' })), { rows: 8, label: `똑같은 블록을 쌓은 높이: ${told(names, n)}` }),
              explain: `똑같은 블록이므로 적게 쌓을수록 낮다. 블록은 가 ${n[0]}개, 나 ${n[1]}개, 다 ${n[2]}개이므로 낮은 것부터 쓰면 ${chain(names, right)}이다.`, facts: { choose: { exprs: n.map(String), rule: 'ascending', orders: list } }
            });
          }),
          T('high-word', '높이를 비교하는 말 고르기', '①10', (d) => {
            const s = d.int(4, 7), lens = d.shuffle([s, s + 1]), names = ['가 건물', '나 건물'], higher = lens[0] > lens[1];
            return C(`${box()} 안에 알맞은 말은?`, ['높다', '낮다'], higher ? 0 : 1, {
              figure: vbars(names.map((t, i) => ({ name: t, len: lens[i], kind: 'house', color: ['#fde68a', '#c4b5fd'][i] })), { rows: 9, pitch: 84, label: `땅 위에 선 건물의 높이: ${told(names, lens)}` }) + lines([`가 건물은 나 건물보다 더 ${box()}.`]),
              explain: `아래쪽이 맞추어져 있으므로 위쪽 끝을 비교한다. 가 건물은 ${lens[0]}층, 나 건물은 ${lens[1]}층이므로 가 건물이 더 ${higher ? '높다' : '낮다'}.`, facts: { choose: { exprs: lens.map(String), rule: 'max' } }
            });
          }),
          T('high-tunnel', '터널을 지나갈 수 있는 트럭', '심9', (d) => {
            const open = d.int(4, 6), lens = d.shuffle([open - 1, open + 1, open + 2]), names = ['가 트럭', '나 트럭', '다 트럭'], pass = lens.indexOf(open - 1);
            return C('터널을 지나갈 수 있는 트럭은?', names, pass, {
              figure: tunnel(open, names.map((t, i) => ({ name: t, len: lens[i] })), `터널 구멍의 높이 ${open}칸, 트럭의 높이: ${told(names, lens)}`),
              explain: `터널 구멍보다 낮은 트럭만 지나갈 수 있다. 터널 구멍은 ${open}칸이고 ${names[pass]}만 ${open - 1}칸으로 더 낮다.`, facts: { choose: { exprs: lens.map(String), rule: 'onlyBelow', target: open } }
            });
          }),
          T('tall-nth', '키가 몇째로 큰 사람 찾기', '①11', (d) => {
            const h = run(d, 4, 4, 8), who = some(d, NAMES, 4), nth = d.pick([2, 3]), by = [0, 1, 2, 3].sort((p, q) => h[q] - h[p]);
            return C(`키가 ${nth === 2 ? '둘째' : '셋째'}로 큰 사람은?`, who, by[nth - 1], {
              figure: vbars(who.map((w, i) => ({ name: w, len: h[i], kind: 'person' })), { rows: 9, label: `나란히 선 사람의 키: ${told(who, h)}` }),
              explain: `발끝이 맞추어져 있으므로 머리 끝을 비교한다. 키가 큰 사람부터 쓰면 ${chain(who, by)}이다.`, facts: { rank: { values: h, nth } }
            });
          })
        ]
      },
      {
        id: 'wt', title: '무게 비교하기', standard: STD,
        types: [
          T('wt-seesaw', '시소에서 더 가벼운 사람', '①17 심14', (d) => {
            const who = some(d, NAMES, 2), down = d.pick(['left', 'right']), up = down === 'left' ? 1 : 0;
            return C('더 가벼운 사람은?', who, up, {
              figure: seesaw({ name: who[0], kind: 'person', color: PALETTE[0] }, { name: who[1], kind: 'person', color: PALETTE[1] }, down),
              explain: `시소는 무거운 쪽이 내려가고 가벼운 쪽이 올라간다. 위로 올라간 ${name(who[up], '이/가')} 더 가볍다.`, facts: { choose: { exprs: down === 'left' ? ['1', '3'] : ['3', '1'], rule: 'max' } }
            });
          }),
          T('wt-many', '수가 다른 두 묶음의 무게를 비교하는 말', '①18 심17', (d) => {
            // 수가 많은 쪽이 올라가 있다: 수가 아니라 저울이 기운 쪽을 본다.
            const [small, big, c1, c2] = d.pick([['귤', '멜론', '#fdba74', '#bef264'], ['딸기', '사과', '#fca5a5', '#f87171'], ['자두', '배', '#c4b5fd', '#fde68a']]), smallLeft = d.bool(), ask = d.bool();
            const many = { name: `${small} 3개`, n: 3, r: 6, color: c1 }, one = { name: `${big} 1개`, n: 1, r: 12, color: c2 };
            return C(`${box()} 안에 알맞은 말은?`, ['무겁다', '가볍다'], ask ? 1 : 0, {
              figure: balance(smallLeft ? many : one, smallLeft ? one : many, smallLeft ? 'right' : 'left') + lines([ask ? `${small} 3개는 ${big} 1개보다 더 ${box()}.` : `${big} 1개는 ${small} 3개보다 더 ${box()}.`]),
              explain: `저울은 무거운 쪽이 내려간다. ${big} 1개 쪽이 내려갔으므로 ${big} 1개가 ${small} 3개보다 더 무겁다. 수가 많다고 더 무거운 것은 아니다.`, facts: { choose: { exprs: ask ? ['4', '2'] : ['2', '4'], rule: 'min' } }
            });
          }),
          T('wt-spring', '용수철이 늘어난 길이로 가장 무거운 것 찾기', '①26', (d) => {
            const lens = run(d, 3, 2, 6), names = TAGS.slice(0, 3), heavy = lens.indexOf(Math.max(...lens));
            return C('똑같은 용수철에 상자를 매달았다. 가장 무거운 상자는?', names.map((t) => t + ' 상자'), heavy, {
              figure: springs(names.map((t, i) => ({ name: t, len: lens[i] })), `똑같은 용수철이 늘어난 길이: ${told(names, lens)}`),
              explain: `무거운 것을 매달수록 용수철이 더 많이 늘어난다. 용수철이 가장 많이 늘어난 ${names[heavy]} 상자가 가장 무겁다.`, facts: { choose: { exprs: lens.map(String), rule: 'max' } }
            });
          }),
          T('wt-bags', '같은 수를 담은 두 상자', '①25', (d) => {
            const n = d.int(2, 5), [light, heavy] = d.pick([['귤', '수박'], ['탁구공', '볼링공'], ['깃털', '돌멩이']]), put = d.shuffle([light, heavy]), names = ['가 상자', '나 상자'];
            return C(`가 상자에 ${put[0]} ${n}개, 나 상자에 ${put[1]} ${n}개를 담았다. 더 가벼운 상자는?`, names, put.indexOf(light), {
              explain: `담은 수가 같으므로 하나의 무게를 비교한다. ${josa(light, '은/는')} ${heavy}보다 가벼우므로 ${josa(light, '을/를')} 담은 상자가 더 가볍다.`, facts: { truth: put.map((t) => t === light), want: true }
            });
          }),
          T('wt-most', '겪어 본 것으로 가장 가벼운 것 고르기', '①16·21 심13·16·21', (d) => {
            const tiers = some(d, [0, 1, 2, 3, 4, 5, 6], 4), things = tiers.map((t) => d.pick(HEAVY[t])), light = tiers.indexOf(Math.min(...tiers)), by = [0, 1, 2, 3].sort((p, q) => tiers[p] - tiers[q]);
            return C('가장 가벼운 것은?', things, light, {
              explain: `들어 보았을 때 힘이 가장 적게 드는 것을 찾는다. 가벼운 것부터 쓰면 ${chain(things, by)}이다.`, facts: { truth: tiers.map((t) => t === Math.min(...tiers)), want: true }
            });
          }),
          T('wt-order', '가벼운 것부터 차례로 쓰기', '①22 심16', (d) => {
            const tiers = some(d, [0, 1, 2, 3, 4], 3), animals = tiers.map((t) => d.pick(ANIMALS[t])), right = [0, 1, 2].sort((p, q) => tiers[p] - tiers[q]), { list, answer } = orderOptions(d, right);
            return C('가벼운 동물부터 차례로 쓴 것은?', list.map((o) => chain(animals, o)), answer, {
              explain: `몸집이 작을수록 가벼운 동물들이다. 가벼운 동물부터 쓰면 ${chain(animals, right)}이다.`, facts: { truth: list.map((o) => o.join() === right.join()), want: true }
            });
          }),
          T('wt-between', '가운데 것을 양쪽과 비교한 말', '①23 심30', (d) => {
            const tiers = some(d, [0, 1, 2, 3, 4, 5, 6], 3).sort((p, q) => p - q), [light, mid, heavy] = tiers.map((t) => d.pick(HEAVY[t])), options = d.shuffle([[heavy, light], [light, heavy]]);
            return C('㉠, ㉡에 알맞은 것을 차례로 쓴 것은?', options.map((o) => o.join(', ')), options.findIndex((o) => o[0] === heavy), {
              figure: lines([`${josa(mid, '은/는')} ${box('㉠')}보다 더 가볍고 ${box('㉡')}보다 더 무겁다.`]),
              explain: `${josa(mid, '은/는')} ${heavy}보다 더 가볍고 ${light}보다 더 무겁다.`, facts: { truth: options.map((o) => o[0] === heavy), want: true }
            });
          }),
          T('wt-than', '기준보다 더 무거운 것 모두 고르기', '①24·28', (d) => {
            const b = d.int(2, 4), base = d.pick(HEAVY[b]), up = some(d, [b + 1, b + 2, b + 3].filter((t) => t <= 6), 2), low = some(d, [b - 1, b - 2, b - 3].filter((t) => t >= 0), 2);
            const tiers = d.shuffle(up.concat(low)), things = tiers.map((t) => d.pick(HEAVY[t])), flags = tiers.map((t) => t > b), made = pairOptions(d, things, flags);
            return C(`${base}보다 더 무거운 것을 모두 고른 것은?`, made.options, made.answer, {
              explain: `${base}보다 들기 힘든 것을 찾는다. ${things.filter((_, i) => flags[i]).join(', ')}이다.`, facts: { sets: { labels: things, flags, options: made.sets } }
            });
          }),
          T('wt-press', '스펀지가 눌린 깊이로 더 가벼운 상자 찾기', '심20', (d) => {
            const s = d.int(1, 3), sink = d.shuffle([s, s + 1]), names = ['가 상자', '나 상자'], light = sink.indexOf(s);
            return C('똑같은 스펀지 위에 상자를 올렸다. 더 가벼운 상자는?', names, light, {
              figure: sponges(names.map((t, i) => ({ name: t, sink: sink[i] })), `똑같은 스펀지가 눌린 깊이: ${told(names, sink)}`),
              explain: `무거운 것을 올릴수록 스펀지가 더 많이 눌린다. 스펀지가 덜 눌린 ${names[light]}가 더 가볍다.`, facts: { choose: { exprs: sink.map(String), rule: 'min' } }
            });
          }),
          T('wt-hand', '들어 본 느낌으로 더 무거운 것 찾기', '①16·19', (d) => {
            const easy = d.int(0, 1), names = ['가 가방', '나 가방'], felt = (i) => (i === easy ? '한 손으로 쉽게 들었다' : '두 손으로도 들기 힘들었다');
            return C(`가 가방은 ${felt(0)}. 나 가방은 ${felt(1)}. 더 무거운 가방은?`, names, 1 - easy, {
              explain: `들기 힘들수록 무거운 것이다. 두 손으로도 들기 힘든 ${names[1 - easy]}이 더 무겁다.`, facts: { truth: names.map((_, i) => i !== easy), want: true }
            });
          })
        ]
      },
      { id: 'area', title: '넓이 비교하기', standard: STD, types: [] },
      { id: 'vol', title: '담을 수 있는 양 비교하기', standard: STD, types: [] },
      { id: 'word', title: '비교하는 말', standard: STD, types: [] }
    ]
  });

  // 뒤쪽 묶음(1-1-4b.js)에서 쓰는 그림 도구를 마저 내보낸다.
  Object.assign(B.kit.g114, { told, chain });
})(typeof window !== 'undefined' ? window : globalThis);
