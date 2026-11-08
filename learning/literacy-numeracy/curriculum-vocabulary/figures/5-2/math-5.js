// 수학 5-2 5단원 직육면체: 낱말 도식
// 상자는 사선 투영으로 그린다. 앞면 ABCD(직사각형)를 (dx, -dy)만큼 밀어 뒷면 EFGH.
// 보이는 모서리 9개는 실선, 가려진 꼭짓점 H에서 만나는 모서리 3개(DH, HG, HE)는 점선.
(function (root) {
  'use strict';
  const { C, svg, text, arrow, put } = root.FigureKit;
  const r1 = (n) => Math.round(n * 10) / 10;
  const P = (p) => `${r1(p[0])} ${r1(p[1])}`;
  const poly = (pts, a = '') => `<polygon points="${pts.map(P).join(' ')}" ${a}/>`;
  const seg = (p, q, a = '') => `<path d="M${P(p)} L${P(q)}" ${a}/>`;
  const mid = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
  const cen = (pts) => [pts.reduce((s, p) => s + p[0], 0) / pts.length, pts.reduce((s, p) => s + p[1], 0) / pts.length];
  const px = (n) => `${r1(n)}px`;
  const SOLID = `stroke="${C.ink}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"`;
  const DASH = `stroke="${C.ink}" stroke-width="2.5" stroke-dasharray="8 7" fill="none"`;
  const HALO = `.halo{stroke:${C.paper};stroke-width:6px;stroke-linejoin:round;paint-order:stroke}`;

  function cub(x, y, w, h, dx, dy) {
    const A = [x, y], B = [x + w, y], Cc = [x + w, y + h], D = [x, y + h];
    const o = (p) => [p[0] + dx, p[1] - dy];
    const E = o(A), F = o(B), G = o(Cc), H = o(D);
    return {
      A, B, C: Cc, D, E, F, G, H,
      face: { front: [A, B, Cc, D], top: [A, B, F, E], right: [B, Cc, G, F], back: [E, F, G, H], bottom: [D, Cc, G, H], left: [A, D, H, E] },
      seen: { AB: [A, B], BC: [B, Cc], CD: [Cc, D], DA: [D, A], AE: [A, E], BF: [B, F], CG: [Cc, G], EF: [E, F], FG: [F, G] },
      hid: { DH: [D, H], HG: [H, G], HE: [H, E] }
    };
  }
  const sketch = (b) => Object.values(b.seen).map(([p, q]) => seg(p, q, SOLID)).join('')
    + Object.values(b.hid).map(([p, q]) => seg(p, q, DASH)).join('');
  const HIDDEN = { back: 1, bottom: 1, left: 1 };
  const ORDER = ['front', 'top', 'right', 'back', 'bottom', 'left'];
  const PAIR = { front: [C.sky, C.blue], back: [C.sky, C.blue], top: [C.mint, C.green], bottom: [C.mint, C.green], right: [C.peach, C.orange], left: [C.peach, C.orange] };

  // 직육면체: 겨냥도 → 면이 하나씩 빛나며 직사각형으로 떨어져 나옴 → 다시 상자로
  {
    const b = cub(56, 150, 160, 96, 70, 46);
    const depth = 120; // 비스듬히 줄여 그린 세로의 실제 길이
    const dims = { front: [160, 96], back: [160, 96], top: [160, depth], bottom: [160, depth], right: [depth, 96], left: [depth, 96] };
    const colX = { front: 380, back: 380, top: 480, bottom: 480, right: 570, left: 570 };
    const rowY = { front: 150, top: 150, right: 150, back: 240, bottom: 240, left: 240 };
    let faces = '', rects = '', solid = '';
    ORDER.forEach((f, i) => {
      const [fill, stroke] = PAIR[f];
      faces += poly(b.face[f], `class="fa${HIDDEN[f] ? '' : ' vis'}" fill="${stroke}" style="--d:${(i * 0.28).toFixed(2)}s"`);
      if (!HIDDEN[f]) solid += poly(b.face[f], `class="fs" fill="${fill}"`);
      const [w, h] = dims[f].map((n) => n / 2);
      const cx = colX[f], cy = rowY[f], fc = cen(b.face[f]);
      rects += `<g class="fly" style="--dx:${px(fc[0] - cx)};--dy:${px(fc[1] - cy)};--d:${(i * 0.28).toFixed(2)}s;--d2:${(i * 0.06).toFixed(2)}s">`
        + `<rect x="${cx - w / 2}" y="${cy - h / 2}" width="${w}" height="${h}" fill="${fill}" stroke="${stroke}" stroke-width="3"/></g>`;
    });
    put('5-2/수학/5/직육면체', svg('m5-cuboid', solid + faces + sketch(b) + rects, `
      .sc-m5-cuboid .fa{fill-opacity:0}
      .on2 .sc-m5-cuboid .fa{animation:m5c-flash .55s ease var(--d) both}
      @keyframes m5c-flash{0%{fill-opacity:0}35%{fill-opacity:.55}100%{fill-opacity:0}}
      .sc-m5-cuboid .fly{opacity:0;transform-box:fill-box;transform-origin:center;transform:translate(var(--dx),var(--dy)) scale(.5)}
      .on2 .sc-m5-cuboid .fly{opacity:1;transform:none;transition:transform .5s ease calc(var(--d) + .2s),opacity .3s ease calc(var(--d) + .2s)}
      .on3 .sc-m5-cuboid .fly{opacity:0;transform:translate(var(--dx),var(--dy)) scale(.5);transition:transform .8s ease-in var(--d2),opacity .35s ease calc(var(--d2) + .5s)}
      .sc-m5-cuboid .fs{opacity:0}
      .on3 .sc-m5-cuboid .fs{opacity:1;transition:opacity .5s ease .9s}
    `));
  }

  // 면: 앞면 하나 → 위·오른쪽·뒤·아래·왼쪽이 차례로 칠해지며 옆 칸에 1~6 → 6
  {
    const b = cub(64, 150, 210, 120, 84, 56);
    const depth = 144;
    const k = 0.35;
    const dims = { front: [210, 120], back: [210, 120], top: [210, depth], bottom: [210, depth], right: [depth, 120], left: [depth, 120] };
    const colX = { front: 423, back: 423, top: 510, bottom: 510, right: 586, left: 586 };
    const rowY = { front: 150, top: 150, right: 150, back: 232, bottom: 232, left: 232 };
    let faces = '', chips = '';
    ORDER.forEach((f, i) => {
      const d = i === 0 ? 0 : (i - 1) * 0.35;
      const cls = i === 0 ? 'one' : 'more';
      faces += poly(b.face[f], `class="fa ${cls}${HIDDEN[f] ? ' hid' : ''}" fill="${C.orange}" style="--d:${d.toFixed(2)}s"`);
      const [w, h] = dims[f].map((n) => n * k);
      const cx = colX[f], cy = rowY[f];
      chips += `<g class="chip ${cls}" style="--d:${d.toFixed(2)}s;--gx:${px(500 - cx)};--gy:${px(196 - cy)}">`
        + `<rect x="${r1(cx - w / 2)}" y="${r1(cy - h / 2)}" width="${r1(w)}" height="${r1(h)}" rx="3" fill="${HIDDEN[f] ? C.paper : C.peach}" stroke="${C.orange}" stroke-width="3"${HIDDEN[f] ? ' stroke-dasharray="7 5"' : ''}/>`
        + text(cx, cy + 7, i + 1, { size: 20 }) + '</g>';
    });
    put('5-2/수학/5/면', svg('m5-face', faces + sketch(b) + chips + `<g class="b3">${text(500, 222, 6, { size: 76, color: C.orange })}</g>`, `
      .sc-m5-face .fa{fill-opacity:0}
      .on1 .sc-m5-face .fa.one{fill-opacity:.4;transition:fill-opacity .5s ease .2s}
      .on2 .sc-m5-face .fa.more{animation:m5f-glow .6s ease var(--d) both}
      .on2 .sc-m5-face .fa.hid{animation-name:m5f-glow-hid}
      @keyframes m5f-glow{0%{fill-opacity:0}40%{fill-opacity:.8}100%{fill-opacity:.4}}
      @keyframes m5f-glow-hid{0%{fill-opacity:0}40%{fill-opacity:.7}100%{fill-opacity:.12}}
      .sc-m5-face .chip{opacity:0;transform:translateY(-14px)}
      .on1 .sc-m5-face .chip.one{opacity:1;transform:none;transition:opacity .4s ease .4s,transform .4s ease .4s}
      .on2 .sc-m5-face .chip.more{opacity:1;transform:none;transition:opacity .35s ease var(--d),transform .35s ease var(--d)}
      .on3 .sc-m5-face .chip.one,.on3 .sc-m5-face .chip.more{opacity:0;transform:translate(var(--gx),var(--gy)) scale(.3);transform-box:fill-box;transform-origin:center;transition:transform .6s ease-in,opacity .4s ease .25s}
      
    `));
  }

  // 모서리: 앞면·윗면이 만나는 선분 → 12개에 번호 → 가로·세로·높이 4개씩
  {
    const b = cub(84, 140, 240, 140, 96, 64);
    const list = [
      ['AB', 'w', [262, 160]], ['BC', 'h', [342, 178]], ['CD', 'w', [204, 307]], ['DA', 'h', [64, 216]],
      ['AE', 'd', [116, 101]], ['BF', 'd', [388, 124]], ['CG', 'd', [390, 266]], ['DH', 'd', [146, 264]],
      ['EF', 'w', [300, 63]], ['FG', 'h', [440, 152]], ['HG', 'w', [252, 238]], ['HE', 'h', [199, 186]]
    ];
    const all = { ...b.seen, ...b.hid };
    let lines = '', nums = '';
    list.forEach(([name, g, at], i) => {
      const [p, q] = all[name];
      const hidden = !!b.hid[name];
      const d = (0.15 * i).toFixed(2);
      lines += hidden
        ? `<g class="gw" style="--d:${d}s;transform-origin:${px(p[0])} ${px(p[1])}">${seg(p, q, `class="e g-${g}" stroke-width="5" stroke-dasharray="8 7" fill="none"`)}</g>`
        : seg(p, q, `class="e dr g-${g}" pathLength="1" stroke-width="6" stroke-linecap="butt" fill="none" style="--d:${d}s"`);
      nums += `<g class="num" style="--d:${d}s">${text(at[0], at[1] + 7, i + 1, { size: 18, cls: 'halo' })}</g>`;
    });
    const leg = (y, color, label) => `<path d="M468 ${y} H508" stroke="${color}" stroke-width="6" stroke-linecap="round"/>` + text(520, y + 7, label, { size: 20, anchor: 'start', color });
    const body = `<g class="h2">${poly(b.face.front, `fill="${C.sky}"`)}${poly(b.face.top, `fill="${C.mint}"`)}</g>`
      + sketch(b)
      + `<g class="h3">${seg(b.A, b.B, `stroke="${C.orange}" stroke-width="7" stroke-linecap="round"`)}</g>`
      + `<g class="b2">${lines}</g><g class="b2 h3">${nums}</g>`
      + `<g class="b3">${leg(170, C.blue, '가로 4')}${leg(210, C.purple, '세로 4')}${leg(250, C.orange, '높이 4')}</g>`;
    put('5-2/수학/5/모서리', svg('m5-edge', body, `
      ${'.sc-m5-edge ' + HALO}
      .sc-m5-edge .e{stroke:${C.orange}}
      .sc-m5-edge .dr{stroke-dasharray:1 1;stroke-dashoffset:1}
      .on2 .sc-m5-edge .dr{stroke-dashoffset:0;transition:stroke-dashoffset .3s linear var(--d)}
      .sc-m5-edge .gw{transform:scale(0)}
      .on2 .sc-m5-edge .gw{transform:none;transition:transform .3s linear var(--d)}
      .sc-m5-edge .num{opacity:0}
      .on2 .sc-m5-edge .num{opacity:1;transition:opacity .25s ease calc(var(--d) + .15s)}
      .on3 .sc-m5-edge .g-w{stroke:${C.blue};transition:stroke .4s ease .2s}
      .on3 .sc-m5-edge .g-d{stroke:${C.purple};transition:stroke .4s ease .8s}
      .on3 .sc-m5-edge .g-h{stroke:${C.orange}}
    `));
  }

  // 꼭짓점: 모서리 셋이 만나는 점 → 위 4개, 아래 4개(가려진 H는 속 빈 점) → 8
  {
    const b = cub(80, 150, 230, 130, 92, 62);
    const pts = [['A', b.A], ['B', b.B], ['F', b.F], ['E', b.E], ['D', b.D], ['C', b.C], ['G', b.G], ['H', b.H]];
    const dots = pts.map(([n, p], i) => `<g class="pop" style="--d:${(0.22 * i + 0.1).toFixed(2)}s"><circle class="pulse" cx="${p[0]}" cy="${p[1]}" r="9" fill="${n === 'H' ? C.paper : C.orange}" stroke="${C.orange}" stroke-width="3.5"/></g>`).join('');
    const body = sketch(b)
      + `<g class="b1 h2">${seg(b.A, b.B, `stroke="${C.orange}" stroke-width="7" stroke-linecap="round"`)}${seg(b.B, b.C, `stroke="${C.orange}" stroke-width="7" stroke-linecap="round"`)}${seg(b.B, b.F, `stroke="${C.orange}" stroke-width="7" stroke-linecap="round"`)}`
      + `<circle cx="${b.B[0]}" cy="${b.B[1]}" r="12" fill="${C.orange}"/></g>`
      + `<g class="b2">${dots}</g>`
      + `<g class="b3">${text(516, 240, 8, { size: 80, color: C.orange })}</g>`;
    put('5-2/수학/5/꼭짓점', svg('m5-vertex', body, `
      .sc-m5-vertex .pop{transform-box:fill-box;transform-origin:center;transform:scale(0)}
      .on2 .sc-m5-vertex .pop{transform:none;transition:transform .3s cubic-bezier(.3,1.6,.6,1) var(--d)}
      .sc-m5-vertex .pulse{transform-box:fill-box;transform-origin:center}
      .on3 .sc-m5-vertex .pulse{animation:m5v-pulse 1.2s ease-in-out infinite}
      @keyframes m5v-pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.35)}}
    `));
  }

  // 정육면체: 직육면체와 나란히, 모서리 12개에 같은 길이 표시 → 같은 정사각형 6개 → 다시 정육면체
  {
    const a = cub(68, 102, 150, 84, 42, 28); // 직육면체: 가로 150, 높이 84, 세로 100(반으로 줄여 50)
    const q = cub(390, 76, 110, 110, 46, 31); // 정육면체: 모서리 110(세로는 반으로 줄여 55)
    const all = { ...q.seen, ...q.hid };
    let ticks = '';
    Object.entries(all).forEach(([name, [p, r]], i) => {
      const m = mid(p, r), len = Math.hypot(r[0] - p[0], r[1] - p[1]);
      const nx = -(r[1] - p[1]) / len * 8, ny = (r[0] - p[0]) / len * 8;
      ticks += `<g class="tk" style="--d:${(0.12 * i + 0.3).toFixed(2)}s">${seg([m[0] - nx, m[1] - ny], [m[0] + nx, m[1] + ny], `stroke="${C.orange}" stroke-width="3.5" stroke-linecap="round"${q.hid[name] ? ' opacity=".6"' : ''}`)}</g>`;
    });
    const s = 0.45;
    const adims = { front: [150, 84], back: [150, 84], top: [150, 100], bottom: [150, 100], right: [100, 84], left: [100, 84] };
    const aCol = { front: 96, back: 96, top: 176, bottom: 176, right: 246, left: 246 };
    const qCol = { front: 406, back: 406, top: 468, bottom: 468, right: 530, left: 530 };
    const rowY = { front: 240, top: 240, right: 240, back: 300, bottom: 300, left: 300 };
    let aRects = '', qRects = '', qFaces = '';
    ORDER.forEach((f, i) => {
      const d = (0.25 * i).toFixed(2);
      const [w, h] = adims[f].map((n) => n * s);
      const [fill, stroke] = PAIR[f];
      const ac = cen(a.face[f]);
      aRects += `<g class="fly" style="--dx:${px(ac[0] - aCol[f])};--dy:${px(ac[1] - rowY[f])};--d:${d}s"><rect x="${r1(aCol[f] - w / 2)}" y="${r1(rowY[f] - h / 2)}" width="${r1(w)}" height="${r1(h)}" fill="${fill}" stroke="${stroke}" stroke-width="3"/></g>`;
      const qc = cen(q.face[f]), sq = 110 * s;
      qRects += `<g class="fly qf" style="--dx:${px(qc[0] - qCol[f])};--dy:${px(qc[1] - rowY[f])};--d:${d}s;--d2:${(0.06 * i).toFixed(2)}s"><rect x="${r1(qCol[f] - sq / 2)}" y="${r1(rowY[f] - sq / 2)}" width="${r1(sq)}" height="${r1(sq)}" fill="${C.mint}" stroke="${C.green}" stroke-width="3"/></g>`;
      if (!HIDDEN[f]) qFaces += poly(q.face[f], `class="qa" fill="${C.mint}"`);
    });
    const body = qFaces + sketch(a) + sketch(q) + `<g class="b1">${ticks}</g>` + aRects + qRects;
    put('5-2/수학/5/정육면체', svg('m5-cube', body, `
      .sc-m5-cube .tk{opacity:0}
      .on1 .sc-m5-cube .tk{opacity:1;transition:opacity .2s ease var(--d)}
      .sc-m5-cube .fly{opacity:0;transform-box:fill-box;transform-origin:center;transform:translate(var(--dx),var(--dy)) scale(.5)}
      .on2 .sc-m5-cube .fly{opacity:1;transform:none;transition:transform .5s ease var(--d),opacity .3s ease var(--d)}
      .on3 .sc-m5-cube .fly.qf{opacity:0;transform:translate(var(--dx),var(--dy)) scale(.5);transition:transform .8s ease-in var(--d2),opacity .35s ease calc(var(--d2) + .5s)}
      .sc-m5-cube .qa{opacity:0}
      .on3 .sc-m5-cube .qa{opacity:1;transition:opacity .5s ease .9s}
    `));
  }

  // 겨냥도: 보이는 모서리 9개를 실선으로 → 가려진 3개를 점선으로, 만나는 점 표시 → 실선 9, 점선 3
  {
    const b = cub(96, 136, 240, 140, 100, 66);
    const seen = Object.values(b.seen).map(([p, q], i) => seg(p, q, `class="dr" pathLength="1" stroke="${C.ink}" stroke-width="3.5" fill="none" style="--d:${(0.18 * i + 0.1).toFixed(2)}s"`)).join('');
    const hid = Object.values(b.hid).map(([p, q], i) => {
      const [s, e] = p === b.H ? [p, q] : [q, p];
      return `<g class="gw" style="--d:${(0.4 * i + 0.1).toFixed(2)}s">${seg(s, e, `stroke="${C.ink}" stroke-width="3" stroke-dasharray="9 7" fill="none"`)}</g>`;
    }).join('');
    const ghost = [b.face.front, b.face.top, b.face.right].map((f) => poly(f, `fill="${C.sky}" fill-opacity=".45"`)).join('');
    const body = ghost + `<g class="b1">${seen}</g><g class="b2">${hid}</g>`
      + `<g class="b2"><circle class="mk" cx="${b.H[0]}" cy="${b.H[1]}" r="10" fill="none" stroke="${C.orange}" stroke-width="3.5"/></g>`
      + `<g class="b3"><path d="M474 160 H514" ${SOLID} stroke-width="3.5"/>${text(526, 167, '실선 9', { size: 22, anchor: 'start' })}`
      + `<path d="M474 216 H514" stroke="${C.ink}" stroke-width="3" stroke-dasharray="9 7"/>${text(526, 223, '점선 3', { size: 22, anchor: 'start' })}</g>`;
    put('5-2/수학/5/겨냥도', svg('m5-sketch', body, `
      .sc-m5-sketch .dr{stroke-dasharray:1 1;stroke-dashoffset:1}
      .on1 .sc-m5-sketch .dr{stroke-dashoffset:0;transition:stroke-dashoffset .25s linear var(--d)}
      .sc-m5-sketch .gw{transform-origin:${px(b.H[0])} ${px(b.H[1])};transform:scale(0)}
      .on2 .sc-m5-sketch .gw{transform:none;transition:transform .4s ease-out var(--d)}
      .sc-m5-sketch .mk{opacity:0;transform-box:fill-box;transform-origin:center}
      .on2 .sc-m5-sketch .mk{opacity:1;transition:opacity .3s ease 1.4s;animation:m5s-ring 1.2s ease-in-out 1.4s infinite}
      @keyframes m5s-ring{0%,100%{transform:scale(1)}50%{transform:scale(1.3)}}
    `));
  }

  // 밑면: 윗면과 아랫면 → 끝없이 넓혀도 간격이 같은 두 판 → 앞뒤, 양옆 면도 평행한 쌍
  {
    const b = cub(200, 160, 170, 100, 70, 46);
    const ext = (f, L) => [[f[0][0] - L, f[0][1]], [f[1][0] + L, f[1][1]], [f[2][0] + L, f[2][1]], [f[3][0] - L, f[3][1]]];
    const topPlane = ext(b.face.top, 150), botPlane = ext([b.D, b.C, b.G, b.H], 150);
    const gap = (x) => arrow(x, 210, x, 164, C.orange, '', 3) + arrow(x, 210, x, 256, C.orange, '', 3);
    const mini = (x, y, pair) => {
      const m = cub(x, y, 90, 54, 38, 25);
      const stroke = PAIR[pair[0]][1];
      return pair.map((f) => poly(m.face[f], `fill="${stroke}" fill-opacity=".45"`)).join('') + sketch(m);
    };
    const box = poly(b.face.top, `fill="${C.green}" fill-opacity=".3"`) + poly(b.face.bottom, `fill="${C.green}" fill-opacity=".3"`) + sketch(b);
    const body = `<g class="b2 h3"><g class="pl">${poly(topPlane, `fill="${C.mint}" fill-opacity=".85" stroke="${C.green}" stroke-width="2"`)}${poly(botPlane, `fill="${C.mint}" fill-opacity=".85" stroke="${C.green}" stroke-width="2"`)}</g></g>`
      + `<g class="mv">${box}</g>`
      + `<g class="b2 h3"><g class="gp">${gap(84)}${gap(556)}</g></g>`
      + `<g class="m1">${mini(460, 96, ['front', 'back'])}</g><g class="m2">${mini(460, 236, ['left', 'right'])}</g>`;
    put('5-2/수학/5/밑면', svg('m5-base', body, `
      .sc-m5-base .pl{transform-origin:320px 187px;transform:scaleX(.45)}
      .on2 .sc-m5-base .pl{transform:none;transition:transform 1s ease-out .2s}
      .sc-m5-base .gp{opacity:0}
      .on2 .sc-m5-base .gp{opacity:1;transition:opacity .4s ease 1.2s}
      .on3 .sc-m5-base .mv{transform:translateX(-120px);transition:transform .7s ease}
      .sc-m5-base .m1,.sc-m5-base .m2{opacity:0;transform:translateX(-40px)}
      .on3 .sc-m5-base .m1{opacity:1;transform:none;transition:opacity .4s ease .7s,transform .5s ease .7s}
      .on3 .sc-m5-base .m2{opacity:1;transform:none;transition:opacity .4s ease 1.4s,transform .5s ease 1.4s}
    `));
  }

  // 옆면: 두 밑면 → 둘레 네 면과 직각 표시 → 옆면 4개가 한 줄 띠로 풀렸다가 다시 감김
  {
    const b = cub(208, 82, 160, 96, 64, 42); // 세로 실제 106(줄여 76)
    const u = Math.hypot(64, 42), m = 20, vx = 64 / u * m, vy = -42 / u * m;
    const mark = (P0, bx, by, dashed) => `<path d="M${r1(P0[0])} ${r1(P0[1] + m)} L${r1(P0[0] + bx)} ${r1(P0[1] + m + by)} L${r1(P0[0] + bx)} ${r1(P0[1] + by)}" stroke="${C.red}" stroke-width="3" fill="none"${dashed ? ' stroke-dasharray="5 4"' : ''}/>`;
    const marks = {
      front: mark(mid(b.A, b.B), vx, vy, false),
      right: mark(mid(b.B, b.F), -m, 0, false),
      back: mark(mid(b.E, b.F), -vx, -vy, true),
      left: mark(mid(b.A, b.E), m, 0, true)
    };
    const lat = ['front', 'right', 'back', 'left'];
    const face = (f) => poly(b.face[f], `class="la${HIDDEN[f] ? ' hid' : ''}" fill="${C.orange}" style="--d:${(0.4 * lat.indexOf(f)).toFixed(1)}s"`);
    const mk = lat.map((f, i) => `<g class="mk" style="--d:${(0.4 * i + 0.2).toFixed(1)}s">${marks[f]}</g>`).join('');
    const widths = [160, 106, 160, 106];
    let x0 = 54, strip = '';
    widths.forEach((w) => {
      strip += `<g class="sp" style="--fx:${px(208 - x0)};--sx:${px(54 - x0)}"><rect x="${x0}" y="228" width="${w}" height="96" fill="${C.peach}" stroke="${C.orange}" stroke-width="3"/></g>`;
      x0 += w;
    });
    const body = poly(b.face.bottom, `fill="${C.mint}"`) + face('back') + face('left') + face('front') + face('right')
      + poly(b.face.top, `fill="${C.mint}"`) + sketch(b) + `<g class="b2">${mk}</g>` + `<g class="b3">${strip}</g>`;
    put('5-2/수학/5/옆면', svg('m5-lateral', body, `
      .sc-m5-lateral .la{fill-opacity:0}
      .on2 .sc-m5-lateral .la{fill-opacity:.4;transition:fill-opacity .35s ease var(--d)}
      .on2 .sc-m5-lateral .la.hid{fill-opacity:.2}
      .sc-m5-lateral .mk{opacity:0}
      .on2 .sc-m5-lateral .mk{opacity:1;transition:opacity .3s ease var(--d)}
      .sc-m5-lateral .sp{opacity:0}
      .on3 .sc-m5-lateral .sp{animation:m5l-roll 5.5s ease-in-out infinite}
      @keyframes m5l-roll{0%{opacity:0;transform:translate(var(--fx),-146px)}14%{opacity:1;transform:translate(var(--sx),0)}32%,62%{opacity:1;transform:none}74%{opacity:1;transform:translate(var(--sx),0)}88%,100%{opacity:0;transform:translate(var(--fx),-146px)}}
    `));
  }

  // 전개도: 자를 모서리 7개를 따라 가위 → 경첩처럼 펼쳐진 십자 모양 → 잘린 곳 실선, 접는 곳 점선, 마주 보는 면 3쌍
  {
    const b = cub(186, 153, 200, 100, 68, 46);
    const route = [b.D, b.A, b.E, b.F, b.B, b.C];
    const lens = route.slice(1).map((p, i) => Math.hypot(p[0] - route[i][0], p[1] - route[i][1]));
    const total = lens.reduce((s, n) => s + n, 0);
    let acc = 0, keys = `0%{transform:translate(${px(route[0][0])},${px(route[0][1])});opacity:1}`;
    lens.forEach((n, i) => { acc += n; keys += `${r1(acc / total * 100)}%{transform:translate(${px(route[i + 1][0])},${px(route[i + 1][1])});opacity:1}`; });
    const cut = `<path class="dr cut" pathLength="1" d="M${route.map(P).join(' L')}" stroke="${C.red}" stroke-width="5" stroke-linejoin="round" fill="none"/>`
      + seg(b.F, b.G, `class="dr cut2" pathLength="1" stroke="${C.red}" stroke-width="5" fill="none"`)
      + `<g class="gw">${seg(b.E, b.H, `stroke="${C.red}" stroke-width="4" stroke-dasharray="9 7" fill="none"`)}</g>`;
    const scis = `<g class="scis"><circle cx="-11" cy="-6" r="5" fill="${C.paper}" stroke="${C.ink}" stroke-width="3"/><circle cx="-11" cy="6" r="5" fill="${C.paper}" stroke="${C.ink}" stroke-width="3"/><path d="M-6 -4 L15 5 M-6 4 L15 -5" stroke="${C.ink}" stroke-width="3" stroke-linecap="round"/></g>`;
    // 펼친 모양(위에서 본 모습): 가로 112, 높이 56, 세로 84
    const R = {
      bottom: [264, 96, 112, 84], back: [264, 40, 112, 56], front: [264, 180, 112, 56], top: [264, 236, 112, 84],
      left: [208, 96, 56, 84], right: [376, 96, 56, 84]
    };
    const hinge = { bottom: '320px 138px', back: '320px 96px', front: '320px 180px', left: '264px 138px', right: '376px 138px', top: '320px 236px' };
    const net = ['bottom', 'back', 'front', 'left', 'right', 'top'].map((f) => {
      const [x, y, w, h] = R[f];
      return `<g class="hg hg-${f}" style="transform-origin:${hinge[f]}"><rect class="pc pc-${f}" x="${x}" y="${y}" width="${w}" height="${h}" fill="${C.paper}" stroke="${C.ink}" stroke-width="2.5"/></g>`;
    }).join('');
    const outline = `<path d="M264 40 H376 V96 H432 V180 H376 V320 H264 V180 H208 V96 H264 Z" stroke="${C.ink}" stroke-width="3.5" stroke-linejoin="round" fill="none"/>`;
    const folds = [[264, 96, 376, 96], [264, 180, 376, 180], [264, 96, 264, 180], [376, 96, 376, 180], [264, 236, 376, 236]]
      .map(([x1, y1, x2, y2]) => `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="${C.ink}" stroke-width="3" stroke-dasharray="8 6"/>`).join('');
    const body = `<g class="h2">${sketch(b)}<g class="b1">${cut}${scis}</g></g>`
      + `<g class="b2">${net}</g><g class="b3">${outline}${folds}</g>`;
    put('5-2/수학/5/전개도', svg('m5-net', body, `
      .sc-m5-net .dr{stroke-dasharray:1 1;stroke-dashoffset:1}
      .on1 .sc-m5-net .cut{stroke-dashoffset:0;transition:stroke-dashoffset 1.4s linear .2s}
      .on1 .sc-m5-net .cut2{stroke-dashoffset:0;transition:stroke-dashoffset .25s linear 1.6s}
      .sc-m5-net .gw{transform-origin:${px(b.E[0])} ${px(b.E[1])};transform:scaleY(0)}
      .on1 .sc-m5-net .gw{transform:none;transition:transform .25s linear 1.6s}
      .sc-m5-net .scis{opacity:0}
      .on1 .sc-m5-net .scis{animation:m5n-cut 1.4s linear .2s both,m5n-out .3s ease 1.65s forwards}
      @keyframes m5n-cut{${keys}}
      @keyframes m5n-out{from{opacity:1}to{opacity:0}}
      .sc-m5-net .hg-back,.sc-m5-net .hg-front,.sc-m5-net .hg-top{transform:scaleY(0)}
      .sc-m5-net .hg-left,.sc-m5-net .hg-right{transform:scaleX(0)}
      .sc-m5-net .hg-bottom{opacity:0}
      .on2 .sc-m5-net .hg{transform:none;opacity:1;transition:transform .6s ease-out .35s,opacity .3s ease .1s}
      .on2 .sc-m5-net .hg-top{transition:transform .6s ease-out 1s}
      .on3 .sc-m5-net .pc{stroke-opacity:0;transition:fill .5s ease,stroke-opacity .4s ease}
      .on3 .sc-m5-net .pc-top,.on3 .sc-m5-net .pc-bottom{fill:${C.mint}}
      .on3 .sc-m5-net .pc-front,.on3 .sc-m5-net .pc-back{fill:${C.sky}}
      .on3 .sc-m5-net .pc-left,.on3 .sc-m5-net .pc-right{fill:${C.peach}}
    `));
  }
})(typeof window !== 'undefined' ? window : globalThis);
