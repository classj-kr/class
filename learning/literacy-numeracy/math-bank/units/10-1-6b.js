// 고등학교 1학년 1학기 6단원 여러 가지 부등식 — 뒤쪽 묶음(이차부등식과 이차함수, 이차부등식의 해와 계수, 연립이차부등식, 이차부등식의 활용).
// 싣는 기준과 뺀 것은 10-1-6a.js 머리에 모아 적었다. 도구는 10-1-6a.js 가 B.kit.m1016 으로 내보낸 것을 쓴다.
// 그림: 포물선과 직선은 이 파일의 fig(9-1-6a.js 의 그림 함수를 이 단원에 옮겨 온 것 — 축 위의 수와 점의 이름을 선·점과 떨어진 자리에 적는다),
// 길을 낸 땅은 pathFig 로 그린다. 그림 설명에는 그림에서 읽을 것(볼록한 쪽, x축과 만나는 점의 x좌표, 땅의 가로·세로)만 적는다.
// ref: ①n = 기본꼴_1의 n번.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, lines, N, M, C, inline } = B.kit;
  const { LAB, MINUS, GT, LT, GE, LE, Q, qadd, qsub, qmul, qdiv, qneg, qabs, qcmp, isInt, fl, mag, tx, nb, tail, lastOf, js, V, sup, f1, nz, pm, asQ, sys, claimQ, plain } = B.kit.mid;
  const K = B.kit.m1016;
  const { UNIT, STD11, X, X2, VA, VK, iq, HAN, stripH, T, numsOf, RH, FLIP, cmpOk, closedR, upR, relOf, tm, tg, tq, ta, ts, lx, qx, sideH, ineqH, chainH, evS, envAt, holds, gl, gq,
    pc, ALL, norm, inter, uni, has, eqSet, flipC, comp, hull, isAll, setH, linSet, solveLin, quadSet, solveQ, verify, flagsIn, intsOf, windowOf, exq, sysF, keep, endJ, ej, lastJ, nj,
    SOLVE, SOLVE2, solE, betweenAns, rayAns, orAns, setPick, valsQ, rayH, linFor, allHold, solveSys, told } = K;
  const FX = `${V('f')}(${X})`, GX = `${V('g')}(${X})`;
  const num = (v) => (typeof v === 'number' ? v : fl(v));

  // ── 그림: 눈금 없는 좌표평면의 포물선과 직선(9-1-6a.js 의 그림 함수를 옮김) ──
  const HALO = 'paint-order:stroke;stroke:#fff;stroke-width:3px;stroke-linejoin:round';
  const ITALIC = "font-style:italic;font-family:'MB Math','Times New Roman',serif";
  const COLORS = ['#1d4ed8', '#b42318', '#15803d'];
  const bare = (t) => String(t).replace(/<[^>]+>/g, '');
  const wide = (t, size) => { let w = 0; for (const ch of bare(t)) w += /[A-Z]/.test(ch) ? 0.72 : /[가-힣]/.test(ch) ? 1 : ch === '/' ? 0.36 : 0.58; return w * (size || 12); };
  const toSeg = (x, y, [x1, y1, x2, y2]) => { const dx = x2 - x1, dy = y2 - y1, t = Math.max(0, Math.min(1, ((x - x1) * dx + (y - y1) * dy) / (dx * dx + dy * dy || 1))); return Math.hypot(x - x1 - t * dx, y - y1 - t * dy); };
  function build(o) {
    const small = Boolean(o.small), [xlo, xhi] = o.x, [ylo, yhi] = o.y;
    const ux = small ? 104 / (xhi - xlo) : Math.min(24, 242 / (xhi - xlo)), uy = small ? Math.min(ux, 92 / (yhi - ylo)) : Math.min(ux, 230 / (yhi - ylo));
    const padL = small ? 8 : 16, padR = small ? 18 : 26, padT = small ? 22 : 30, padB = small ? 12 : 18, FS = 12;
    const W = padL + padR + (xhi - xlo) * ux, H = padT + padB + (yhi - ylo) * uy;
    const PX = (v) => padL + (num(v) - xlo) * ux, PY = (v) => padT + (yhi - num(v)) * uy, ox = PX(0), oy = PY(0);
    const segs = [], dots = [], boxes = [], why = [];
    let under = '', out = '', texts = '';
    const line = (x1, y1, x2, y2, style) => { segs.push([x1, y1, x2, y2]); return `<line x1="${f1(x1)}" y1="${f1(y1)}" x2="${f1(x2)}" y2="${f1(y2)}" style="${style}"/>`; };
    const DASH = 'stroke:#5b6770;stroke-width:0.9;stroke-dasharray:3 2';
    for (const sh of o.shade ? [o.shade] : []) under += `<path d="M${sh.map(([x, y]) => f1(PX(x)) + ' ' + f1(PY(y))).join('L')}Z" style="fill:rgba(251,191,36,0.42);stroke:none"/>`;
    // 축
    const ax0 = PX(xlo) - (small ? 3 : 8), ax1 = PX(xhi) + (small ? 5 : 9), ay0 = PY(ylo) + (small ? 3 : 8), ay1 = PY(yhi) - (small ? 5 : 9);
    out += line(ax0, oy, ax1, oy, 'stroke:#1f2933;stroke-width:1') + `<path d="M${f1(ax1 + 6)} ${f1(oy)}l-7 -3.4v6.8z" style="fill:#1f2933"/>`;
    out += line(ox, ay0, ox, ay1, 'stroke:#1f2933;stroke-width:1') + `<path d="M${f1(ox)} ${f1(ay1 - 6)}l-3.4 7h6.8z" style="fill:#1f2933"/>`;
    // 포물선
    const ends = [];
    (o.parabolas || []).forEach((c, k) => {
      const a = num(c.a), p = num(c.p || 0), q = num(c.q || 0), f = (x) => a * (x - p) * (x - p) + q, color = COLORS[k % COLORS.length];
      const cuts = [xlo, xhi];
      for (const v of [ylo, yhi]) { const r = (v - q) / a; if (r >= 0) cuts.push(p - Math.sqrt(r), p + Math.sqrt(r)); }
      const xs = cuts.filter((x) => x >= xlo && x <= xhi).sort((s, t) => s - t);
      for (let i = 0; i + 1 < xs.length; i += 1) {
        const s = xs[i], t = xs[i + 1], mid = f((s + t) / 2);
        if (t - s < 1e-9 || mid < ylo || mid > yhi) continue;
        const pts = [];
        for (let j = 0; j <= 48; j += 1) { const x = s + (t - s) * j / 48; pts.push([PX(x), PY(Math.min(yhi, Math.max(ylo, f(x))))]); }
        for (let j = 0; j + 1 < pts.length; j += 1) segs.push([pts[j][0], pts[j][1], pts[j + 1][0], pts[j + 1][1]]);
        out += `<path d="M${pts.map(([x, y]) => f1(x) + ' ' + f1(y)).join('L')}" style="fill:none;stroke:${color};stroke-width:1.8${c.dash ? ';stroke-dasharray:5 3' : ''}"/>`;
        ends.push({ k, at: pts[0], other: pts[pts.length - 1], left: true }, { k, at: pts[pts.length - 1], other: pts[0], left: false });
      }
    });
    // 직선
    (o.lines || []).forEach((l) => {
      const style = l.dash ? DASH : 'stroke:#15803d;stroke-width:1.6';
      if (l.x != null) { out += line(PX(l.x), PY(ylo), PX(l.x), PY(yhi), style); return; }
      const a = num(l.a), b = num(l.b || 0); let lo = xlo, hi = xhi;
      if (a !== 0) { const s = (ylo - b) / a, t = (yhi - b) / a; lo = Math.max(lo, Math.min(s, t)); hi = Math.min(hi, Math.max(s, t)); }
      out += line(PX(lo), PY(a * lo + b), PX(hi), PY(a * hi + b), style);
    });
    for (const [x1, y1, x2, y2] of o.segs || []) out += line(PX(x1), PY(y1), PX(x2), PY(y2), 'stroke:#1f2933;stroke-width:1.5');
    for (const [x1, y1, x2, y2] of o.dashes || []) out += line(PX(x1), PY(y1), PX(x2), PY(y2), DASH);
    for (const p of o.points || []) {
      if (p.guide === true || p.guide === 'x') if (num(p.y) !== 0) out += line(PX(p.x), PY(p.y), PX(p.x), oy, DASH);
      if (p.guide === true || p.guide === 'y') if (num(p.x) !== 0) out += line(PX(p.x), PY(p.y), ox, PY(p.y), DASH);
    }
    for (const p of o.points || []) { dots.push([PX(p.x), PY(p.y)]); out += `<circle class="mb-dot" cx="${f1(PX(p.x))}" cy="${f1(PY(p.y))}" r="${small ? 2.6 : 3}"/>`; }
    // 글 놓기: 글 상자(가운데 cx, cy, 반 너비 w, 반 높이 h)의 둘레 여덟 곳과 가운데에서 선·점까지의 틈, 다른 글과의 틈
    // 선분마다 둘러싼 네모를 먼저 재어, 글 상자와의 거리가 이미 찾은 틈보다 먼 선분은 건너뛴다.
    const room = (cx0, cy, w, h) => {
      let m = 99;
      for (const sg of segs) {
        const dx = Math.max(Math.min(sg[0], sg[2]) - (cx0 + w), (cx0 - w) - Math.max(sg[0], sg[2]), 0), dy = Math.max(Math.min(sg[1], sg[3]) - (cy + h), (cy - h) - Math.max(sg[1], sg[3]), 0);
        if (dx >= m || dy >= m) continue;
        for (const sx of [-1, 0, 1]) for (const sy of [-1, 0, 1]) m = Math.min(m, toSeg(cx0 + sx * w, cy + sy * h, sg));
      }
      for (const [px, py] of dots) for (const sx of [-1, 0, 1]) for (const sy of [-1, 0, 1]) m = Math.min(m, Math.hypot(cx0 + sx * w - px, cy + sy * h - py) - 3);
      return m;
    };
    // 다른 글과의 틈. 같은 줄에 나란한 글은 4px 더 띄운다(「−1 O」가 「−10」처럼 읽히지 않게).
    const apart = (cx0, cy, w, h) => boxes.reduce((m, [bx, by, bw, bh]) => Math.min(m, Math.max(Math.abs(bx - cx0) - bw - w - 4, Math.abs(by - cy) - bh - h)), 99);
    const inside = (cx0, cy, w, h) => cx0 - w >= 1 && cx0 + w <= W - 1 && cy - h >= 1 && cy + h <= H - 1;
    // cands: [x, y(글자 밑선), anchor]. 앞의 것일수록 좋은 자리. 틈이 3px 넘는 첫 자리, 없으면 가장 넓은 자리.
    function place(cands, t, size, style) {
      const fs = size || FS, w = wide(t, fs) / 2, h = fs * 0.42; let best = null;
      for (const [x, y, anchor] of cands) {
        const cx0 = anchor === 'middle' ? x : anchor === 'end' ? x - w : x + w, cy = y - fs * 0.34;
        const s = inside(cx0, cy, w, h) ? Math.min(room(cx0, cy, w, h), apart(cx0, cy, w, h) + 1.5) : -9;
        if (!best || s > best.s + 0.01) best = { s, x, y, anchor, cx0, cy };
        if (s >= 3) break;
      }
      if (best.s < 2.5) why.push(bare(t) + ' 틈 ' + best.s.toFixed(1));
      boxes.push([best.cx0, best.cy, w, h]);
      texts += `<text x="${f1(best.x)}" y="${f1(best.y)}" text-anchor="${best.anchor}" style="font-size:${fs}px;font-weight:600;fill:#1f2933;${HALO}${style ? ';' + style : ''}">${t}</text>`;
    }
    // 축의 이름 x, y
    // 축의 이름: x 는 화살표 끝 아래, y 는 화살표 끝 오른쪽
    boxes.push([ax1 + (small ? 5 : 10), oy + 9, 4, 5], [ox + 10, ay1 - 6, 4, 5]);
    texts += `<text x="${f1(ax1 + (small ? 5 : 10))}" y="${f1(oy + 14)}" text-anchor="middle" style="font-size:${small ? 12 : 13.5}px;fill:#1f2933;${ITALIC};${HALO}">x</text>`
      + `<text x="${f1(ox + 10)}" y="${f1(ay1 - 2)}" text-anchor="middle" style="font-size:${small ? 12 : 13.5}px;fill:#1f2933;${ITALIC};${HALO}">y</text>`;
    // 원점의 이름 O
    place([[ox - 8, oy + 14, 'middle'], [ox + 8, oy + 14, 'middle'], [ox - 8, oy - 4, 'middle'], [ox + 8, oy - 4, 'middle'], [ox - 11, oy + 15, 'middle'], [ox + 11, oy + 15, 'middle']], 'O', 12);
    // 점의 이름
    for (const p of o.points || []) if (p.name) {
      const x = PX(p.x), y = PY(p.y), first = p.side ? [{ ur: [7, -5, 'start'], ul: [-7, -5, 'end'], dr: [7, 14, 'start'], dl: [-7, 14, 'end'], u: [0, -7, 'middle'], d: [0, 16, 'middle'] }[p.side]] : [];
      place(first.concat([[7, -5, 'start'], [-7, -5, 'end'], [7, 14, 'start'], [-7, 14, 'end'], [0, -8, 'middle'], [0, 17, 'middle'], [10, 5, 'start'], [-10, 5, 'end']]).map(([dx, dy, an]) => [x + dx, y + dy, an]), p.name, 13);
    }
    // 축 위의 수
    for (const m of o.xnums || []) {
      const t = m.text == null ? plain(asQ(m.v)) : m.text, x = PX(m.v), w = wide(t, FS) / 2;
      place([[x, oy + 13, 'middle'], [x, oy - 5, 'middle'], [x + w + 3, oy + 13, 'middle'], [x - w - 3, oy + 13, 'middle'], [x + w + 3, oy - 5, 'middle'], [x - w - 3, oy - 5, 'middle'], [x, oy + 18, 'middle'], [x, oy - 10, 'middle'], [x + w + 5, oy + 18, 'middle'], [x - w - 5, oy + 18, 'middle'], [x + w + 5, oy - 10, 'middle'], [x - w - 5, oy - 10, 'middle']], t);
    }
    for (const m of o.ynums || []) {
      const t = m.text == null ? plain(asQ(m.v)) : m.text, y = PY(m.v) + 4;
      place([[ox - 5, y, 'end'], [ox + 5, y, 'start'], [ox - 5, y - 6, 'end'], [ox - 5, y + 6, 'end'], [ox + 5, y - 6, 'start'], [ox + 5, y + 6, 'start'], [ox - 5, y - 11, 'end'], [ox - 5, y + 11, 'end'], [ox + 5, y - 11, 'start'], [ox + 5, y + 11, 'start'], [ox - 9, y, 'end'], [ox + 9, y, 'start']], t);
    }
    // 포물선의 이름: 곡선의 끝 가까이
    (o.parabolas || []).forEach((c, k) => {
      if (!c.name) return;
      const cands = [];
      for (const e of ends.filter((v) => v.k === k)) { const [x, y] = e.at, top = y < (e.other[1] + y) / 2 || y < padT + 4; cands.push([x + (e.left ? 7 : -7), y + (top ? 11 : -4), e.left ? 'start' : 'end'], [x + (e.left ? -6 : 6), y + (top ? 11 : -4), e.left ? 'end' : 'start'], [x + (e.left ? 8 : -8), y + (top ? 24 : -16), e.left ? 'start' : 'end']); }
      place(cands, c.name, 12, `fill:${COLORS[k % COLORS.length]}`);
    });
    // 따로 적는 글 o.labels [{ x, y, t }](그 자리 둘레에 적는다)
    for (const l of o.labels || []) { const x = PX(l.x), y = PY(l.y); place([[x, y + 4, 'middle'], [x + 8, y + 4, 'start'], [x - 8, y + 4, 'end'], [x, y - 6, 'middle'], [x, y + 15, 'middle']], l.t, 12); }
    const said = [`좌표평면${o.name ? ' ' + o.name : ''}: ${o.say || ''}`.trim()];
    if ((o.xnums || []).length) said.push(`x축에 적힌 수: ${o.xnums.map((m) => bare(m.text == null ? plain(asQ(m.v)) : m.text)).join(', ')}.`);
    if ((o.ynums || []).length) said.push(`y축에 적힌 수: ${o.ynums.map((m) => bare(m.text == null ? plain(asQ(m.v)) : m.text)).join(', ')}.`);
    const svg = `<svg class="mb-geo" viewBox="0 0 ${f1(W)} ${f1(H)}" width="${Math.round(W)}" role="img" aria-label="${said.join(' ')}">${under}${out}${texts}</svg>`;
    return { svg, ok: why.length === 0, why };
  }
  const fig = (o) => build(o).svg, figOk = (o) => build(o).ok, figWhy = (o) => build(o).why;

  // ── 길을 낸 직사각형 땅 ──
  // 가로 W, 세로 H 인 땅에 폭이 x 로 같은 세로 길과 가로 길이 열십자로 지난다. 수는 그림 설명에도 적는다(검사가 읽는다).
  function pathFig(W, H, unit) {
    const k = Math.min(196 / W, 150 / H), w = W * k, h = H * k, s = Math.max(14, Math.min(w, h) * 0.13), L0 = 42, T0 = 30;
    const vx = L0 + w * 0.58, hy = T0 + h * 0.36, R = 'stroke:#1f2933;stroke-width:1.4';
    const txt = (x, y, t, anchor) => `<text x="${f1(x)}" y="${f1(y)}" text-anchor="${anchor || 'middle'}" style="font-size:13px;font-weight:600;fill:#1f2933">${t}</text>`;
    const ital = (t) => t.replace(/x/g, `<tspan style="font-style:italic;font-family:'MB Math','Times New Roman',serif">x</tspan>`);
    let out = `<rect x="${L0}" y="${T0}" width="${f1(w)}" height="${f1(h)}" style="fill:#dcfce7;${R}"/>`;
    out += `<rect x="${f1(vx)}" y="${T0}" width="${f1(s)}" height="${f1(h)}" style="fill:#e7d9bf;stroke:none"/><rect x="${L0}" y="${f1(hy)}" width="${f1(w)}" height="${f1(s)}" style="fill:#e7d9bf;stroke:none"/>`;
    out += `<rect x="${L0}" y="${T0}" width="${f1(w)}" height="${f1(h)}" style="fill:none;${R}"/>`;
    // 치수
    out += `<line x1="${f1(vx)}" y1="${T0 - 6}" x2="${f1(vx + s)}" y2="${T0 - 6}" style="stroke:#5b6770;stroke-width:1"/>` + txt(vx + s / 2, T0 - 10, ital(`x ${unit}`));
    out += `<line x1="${L0 - 6}" y1="${f1(hy)}" x2="${L0 - 6}" y2="${f1(hy + s)}" style="stroke:#5b6770;stroke-width:1"/>` + txt(L0 - 9, hy + s / 2 + 4, ital(`x ${unit}`), 'end');
    out += txt(L0 + w / 2, T0 + h + 17, `${W} ${unit}`) + txt(L0 + w + 6, T0 + h / 2 + 4, `${H} ${unit}`, 'start');
    const width = L0 + w + 48, height = T0 + h + 26;
    return `<svg class="mb-geo" viewBox="0 0 ${f1(width)} ${f1(height)}" width="${Math.round(width)}" role="img" aria-label="직사각형 모양의 땅: 가로 ${W} ${unit}, 세로 ${H} ${unit}. 폭이 x ${unit}로 같은 세로 길과 가로 길이 땅을 가로질러 열십자로 지난다.">${out}</svg>`;
  }

  // ── 이차부등식 짓기 ──
  // 정리하면 (좌변 − 우변) = A x² + B x + C 가 되는 여러 꼴의 부등식 { L, R }. kind: 'plain' 우변 0 / 'move' 항을 우변으로 / 'both' 양변에 x² / 'prod' x(px + q) 꼴
  function dressQ(d, A, Bc, Cc, kinds) {
    for (let i = 0; i < 300; i += 1) {
      const kind = d.pick(kinds || ['plain', 'move', 'both', 'prod']);
      if (kind === 'plain') return { L: qx(A, Bc, Cc), R: ts([0, '']), kind };
      if (kind === 'move') {
        const which = d.int(0, 2), mvB = which !== 1 && Bc !== 0, mvC = which !== 0 && Cc !== 0;
        if (!mvB && !mvC) continue;
        return { L: qx(A, mvB ? 0 : Bc, mvC ? 0 : Cc), R: ts([mvB ? -Bc : 0, 'x'], [mvC ? -Cc : 0, '']), kind };
      }
      if (kind === 'both') {
        const u = nz(d, -3, 3), v = d.int(-5, 5), w = d.int(-6, 6);
        if (A + u === 0 || Math.abs(A + u) > 6) continue;
        return { L: qx(A + u, Bc + v, Cc + w), R: qx(u, v, w), kind };
      }
      if (Bc === 0) continue;
      return { L: [tg(1, lx(A, Bc), 'x')], R: ts([-Cc, '']), kind };
    }
    throw new Error('이차부등식을 짓지 못했다');
  }
  // 이차부등식 L rel R 을 풀고 맞춰 본다.
  function qSolve(L, rel, R) {
    const out = solveQ(L, rel, R);
    if (!out) return null;
    verify(out.S, (x) => holds(L, rel, R, x), [out.r1, out.r2].filter(Boolean));
    return out;
  }
  const ineqF = (L, r, R) => exq(ineqH(L, r, R));
  // 「해는 …이다」(해가 없으면 「해는 없다」)
  const solSay = (S) => (S.length ? `해는 ${setH(S)}이다` : '해는 없다');
  // 이항할 것이 있는가에 따른 풀이의 첫마디
  const leadOf = (R) => (R.length === 1 && R[0].k === 'm' && R[0].c.p === 0 ? '' : '우변을 이항하여 정리하면 ');
  // 인수의 곱의 글: x 는 그대로, 나머지는 괄호에 넣는다
  const facH = (list) => list.map((f) => (f.length === 1 && f[0].vs === 'x' && f[0].c.p === 1 ? X : '(' + sideH(f) + ')')).join('');
  // 해의 집합을 끝의 꼴만 바꾼 것들(틀린 보기의 재료): 등호 바꿈, 여집합, 사이와 두 쪽 바꿈
  const shapeWrongs = (S) => [flipC(S), comp(S), flipC(comp(S))];

  // ════════════════ 이차부등식과 이차함수 ════════════════
  const bowl = (a) => (a > 0 ? '아래로 볼록한' : '위로 볼록한');
  B.addTypes(UNIT, 'quad', [
    T('quad-graph', '그래프를 보고 이차부등식의 해 구하기', '①24', (d, n) => {
      const a = d.pick([1, -1, 2, -2]), r1 = d.int(-4, 2), r2 = d.int(r1 + 2, Math.min(r1 + 5, 5)), p = (r1 + r2) / 2, q = -a * ((r2 - r1) / 2) ** 2;
      if (r1 === 0 || r2 === 0) return null;
      const yi = a * r1 * r2, ys = [0, q, yi], o = { x: [Math.min(r1, 0) - 1, Math.max(r2, 0) + 1], y: [Math.floor(Math.min(...ys)) - 1, Math.ceil(Math.max(...ys)) + 1], parabolas: [{ a, p, q }], points: [{ x: r1, y: 0 }, { x: r2, y: 0 }], xnums: [{ v: r1 }, { v: r2 }], say: `${bowl(a)} 포물선 y = f(x). x축과 만나는 두 점에 점을 찍었다.` };
      if (o.y[1] - o.y[0] > 12 || !figOk(o)) return null;
      const S0 = quadSet(Q(a), Q(-a * (r1 + r2)), Q(a * r1 * r2), '>').S;   // f(x) > 0 의 해
      if (n === 0) {
        const rel = d.pick(['<', '<=', '>', '>=']), S = quadSet(Q(a), Q(-a * (r1 + r2)), Q(a * r1 * r2), rel).S;
        const wrongs = [pc(r1, false, r2, false), pc(r1, true, r2, true)].map((p) => [p]).concat([[pc(null, false, r1, false), pc(r2, false, null)], [pc(null, false, r1, true), pc(r2, true, null)], [pc(r2, false, null)], [pc(null, false, r1, true)]]);
        return setPick(d, `이차함수 ${nb(`${V('y')} = ${FX}`)}의 그래프가 그림과 같을 때, 부등식 ${nb(`${FX} ${RH[rel]} 0`)}의 해는?`, norm(S), wrongs.map(norm), {
          figure: fig(o),
          explain: `${FX} ${upR(rel) ? '&gt;' : '&lt;'} 0인 ${X}의 값의 범위는 그래프가 ${X}축보다 ${upR(rel) ? '위쪽' : '아래쪽'}에 있는 범위이다. ${closedR(rel) ? `등호가 있으므로 ${X}축과 만나는 ${iq(r1)}, ${iq(r2)}도 해에 든다. ` : ''}따라서 해는 ${setH(S)}이다.`,
          facts: { rule: 'quad-graph-solve' }
        });
      }
      // 그래프에 대한 문장: 범위에서의 부호와 부등식의 해. 참·거짓은 f(x) > 0, f(x) < 0 의 해의 집합으로 셈한다.
      const fA = Q(a), fB = Q(-a * (r1 + r2)), fC = Q(a * r1 * r2), Sp = norm(quadSet(fA, fB, fC, '>').S), Sn = norm(quadSet(fA, fB, fC, '<').S);
      const inside = (I, Sx) => eqSet(inter(I, Sx), norm(I));
      const doms = [[[pc(null, false, r1, false)], nb(`${X} &lt; ${iq(r1)}`)], [[pc(r1, false, r2, false)], nb(`${iq(r1)} &lt; ${X} &lt; ${iq(r2)}`)], [[pc(r2, false, null)], nb(`${X} &gt; ${iq(r2)}`)]];
      const cand = [];
      doms.forEach(([I, h], i) => { for (const up of [true, false]) cand.push({ key: 'd' + i, text: `${h}일 때 ${nb(`${FX} ${up ? '&gt;' : '&lt;'} 0`)}이다.`, truth: inside(I, up ? Sp : Sn) }); });
      const sols = [[[pc(r1, true, r2, true)], nb(`${iq(r1)} ≤ ${X} ≤ ${iq(r2)}`)], [[pc(null, false, r1, false), pc(r2, false, null)], `${nb(`${X} &lt; ${iq(r1)}`)} 또는 ${nb(`${X} &gt; ${iq(r2)}`)}`]];
      for (const rel of ['<=', '>=', '<', '>']) for (const [Sx, h] of sols) cand.push({ key: 's' + rel, text: `부등식 ${nb(`${FX} ${RH[rel]} 0`)}의 해는 ${h}이다.`, truth: eqSet(norm(quadSet(fA, fB, fC, rel).S), norm(Sx)) });
      const wantTrue = d.bool(), one = d.pick(cand.filter((c) => c.truth === wantTrue)), rest = d.shuffle(cand.filter((c) => c.truth !== wantTrue && c.key !== one.key));
      const pick = [one];
      for (const c of rest) if (pick.length < 4 && !pick.some((x) => x.key === c.key)) pick.push(c);
      if (pick.length < 4) return null;
      const rows = d.shuffle(pick);
      return C(`이차함수 ${nb(`${V('y')} = ${FX}`)}의 그래프가 그림과 같을 때, 다음 중 ${wantTrue ? '옳은' : '옳지 않은'} 것은?`, rows.map((r) => r.text), rows.findIndex((r) => r.truth === wantTrue), {
        figure: fig(o),
        explain: `그래프는 ${X}축과 ${X} = ${iq(r1)}, ${X} = ${iq(r2)}에서 만나고 ${bowl(a)}. 두 점 사이에서는 ${X}축보다 ${a > 0 ? '아래' : '위'}쪽, 바깥에서는 ${a > 0 ? '위' : '아래'}쪽에 있으므로 ${setH(Sp)}일 때 ${nb(`${FX} &gt; 0`)}이다.`.replace('볼록한.', '볼록하다.'),
        facts: { truth: rows.map((r) => r.truth === wantTrue), want: true, rule: 'quad-graph-claim' }
      });
    }, { count: 2 }),
    T('quad-two-graph', '두 그래프의 위아래로 부등식의 해 구하기', '①25', (d) => {
      const a = d.pick([1, -1]), r1 = d.int(-3, 1), r2 = d.int(r1 + 2, Math.min(r1 + 5, 5)), m = d.pick([-2, -1, 1, 2]), k = d.int(-2, 3);
      if (r1 === 0 || r2 === 0) return null;
      // f(x) = a(x − r1)(x − r2) + mx + k, g(x) = mx + k
      const A = a, Bc = -a * (r1 + r2) + m, Cc = a * r1 * r2 + k, p = -Bc / (2 * A), q = Cc - Bc * Bc / (4 * A);
      const y1 = m * r1 + k, y2 = m * r2 + k, ys = [0, q, y1, y2, k], o = { x: [Math.min(r1, 0) - 1, Math.max(r2, 0) + 1], y: [Math.floor(Math.min(...ys)) - 1, Math.ceil(Math.max(...ys)) + 1], parabolas: [{ a: A, p, q }], lines: [{ a: m, b: k }], points: [{ x: r1, y: y1, guide: 'x' }, { x: r2, y: y2, guide: 'x' }], xnums: [{ v: r1 }, { v: r2 }], say: `${bowl(a)} 포물선 y = f(x)와 직선 y = g(x)가 두 점에서 만나고, 두 교점에서 x축으로 점선을 그었다.` };
      if (o.y[1] - o.y[0] > 13 || !figOk(o)) return null;
      const rel = d.pick(['<', '<=', '>', '>=']), S = norm(quadSet(Q(a), Q(-a * (r1 + r2)), Q(a * r1 * r2), rel).S);
      const wrongs = [[pc(r1, false, r2, false)], [pc(r1, true, r2, true)], [pc(null, false, r1, false), pc(r2, false, null)], [pc(null, false, r1, true), pc(r2, true, null)], [pc(r2, false, null)], [pc(null, false, r1, false)]].map(norm);
      return setPick(d, `그림과 같이 이차함수 ${nb(`${V('y')} = ${FX}`)}의 그래프와 직선 ${nb(`${V('y')} = ${GX}`)}가 ${X}좌표가 ${iq(r1)}, ${iq(r2)}인 두 점에서 만날 때, 부등식 ${nb(`${FX} ${RH[rel]} ${GX}`)}의 해는?`, S, wrongs, {
        figure: fig(o),
        explain: `${nb(`${FX} ${upR(rel) ? '&gt;' : '&lt;'} ${GX}`)}인 범위는 포물선이 직선보다 ${upR(rel) ? '위쪽' : '아래쪽'}에 있는 ${X}의 값의 범위이다. ${closedR(rel) ? `등호가 있으므로 두 교점의 ${X}좌표도 해에 든다. ` : ''}따라서 해는 ${setH(S)}이다.`,
        facts: { rule: 'quad-two-graph' }
      });
    }),
    T('quad-fac-in', '인수분해되는 이차부등식 — 해가 두 수 사이', '①26', (d) => {
      const a = d.pick([1, 1, 2, 3]), r1 = d.int(-7, 4), r2 = d.int(r1 + 1, Math.min(r1 + 8, 8)), rel = d.pick(['<', '<=']);
      const [A, Bc, Cc] = [a, -a * (r1 + r2), a * r1 * r2], { L, R } = dressQ(d, A, Bc, Cc), out = qSolve(L, rel, R);
      return betweenAns(SOLVE, out.S, {
        figure: ineqF(L, rel, R),
        explain: `${leadOf(R) ? leadOf(R) + nb(`${sideH(qx(A, Bc, Cc))} ${RH[rel]} 0`) + ', 곧 ' : '좌변을 인수분해하면 '}${nb(`${a === 1 ? '' : a}${facH([lx(1, -r1), lx(1, -r2)])} ${RH[rel]} 0`)}이다. 이차함수의 그래프가 ${X}축보다 아래쪽에 있는 범위이므로 해는 ${setH(out.S)}이다.`,
        facts: { rule: 'quad-fac-in', derived: out.nums.concat(numsOf([out.a, out.b, out.c])) }
      });
    }),
    T('quad-fac-out', '인수분해되는 이차부등식 — 해가 두 쪽', '①26', (d) => {
      const a = d.pick([1, 1, 2, 3]), r1 = d.int(-7, 4), r2 = d.int(r1 + 1, Math.min(r1 + 8, 8)), rel = d.pick(['>', '>=']);
      const [A, Bc, Cc] = [a, -a * (r1 + r2), a * r1 * r2], { L, R } = dressQ(d, A, Bc, Cc), out = qSolve(L, rel, R);
      return orAns(SOLVE, out.S, {
        figure: ineqF(L, rel, R),
        explain: `${leadOf(R) ? leadOf(R) + nb(`${sideH(qx(A, Bc, Cc))} ${RH[rel]} 0`) + ', 곧 ' : '좌변을 인수분해하면 '}${nb(`${a === 1 ? '' : a}${facH([lx(1, -r1), lx(1, -r2)])} ${RH[rel]} 0`)}이다. 이차함수의 그래프가 ${X}축보다 위쪽에 있는 범위이므로 해는 ${setH(out.S)}이다.`,
        facts: { rule: 'quad-fac-out', derived: out.nums.concat(numsOf([out.a, out.b, out.c])) }
      });
    }),
    T('quad-fac-frac', '근이 분수인 이차부등식', '①26', (d) => {
      const p = d.pick([2, 3, 4]), u = d.until(() => nz(d, -7, 7), (v) => v % p !== 0), v = d.int(-5, 5), rel = d.pick(['<', '<=', '>', '>=']);
      const r1 = Q(u, p), r2 = Q(v);
      if (qcmp(r1, r2) === 0) return null;
      // (px − u)(x − v)
      const A = p, Bc = -(p * v + u), Cc = u * v, { L, R } = dressQ(d, A, Bc, Cc), out = qSolve(L, rel, R), S = out.S;
      const neg = quadSet(Q(A), Q(-Bc), Q(Cc), rel).S;
      return setPick(d, '다음 이차부등식의 해는?', S, shapeWrongs(S).concat([neg, flipC(neg)]), {
        figure: ineqF(L, rel, R),
        explain: `정리하면 ${nb(`${sideH(qx(A, Bc, Cc))} ${RH[rel]} 0`)}이고, 좌변을 인수분해하면 ${nb(`${facH([lx(p, -u), lx(1, -v)])} ${RH[rel]} 0`)}이다. 따라서 해는 ${setH(S)}이다.`,
        facts: { rule: 'quad-fac-frac' }
      });
    }),
    T('quad-fac-count', '이차부등식을 만족시키는 정수의 개수', '①26', (d) => {
      const p = d.pick([1, 2, 2, 3]), u = nz(d, -12, 12), v = d.int(-6, 6), rel = d.pick(['<', '<=']);
      const r1 = Q(u, p), r2 = Q(v);
      if (qcmp(r1, r2) === 0) return null;
      const A = p, Bc = -(p * v + u), Cc = u * v, { L, R } = dressQ(d, A, Bc, Cc), out = qSolve(L, rel, R), S = out.S;
      const [w0, w1] = windowOf(S), list = intsOf(w0, w1, (x) => holds(L, rel, R, x));
      if (list.length < 3 || list.length > 12) return null;
      return N(`다음 이차부등식을 만족시키는 정수 ${X}의 개수는?`, list.length, {
        unit: '개', figure: ineqF(L, rel, R),
        explain: `정리하여 풀면 해는 ${setH(S)}이다. 이를 만족시키는 정수는 ${list.map(iq).join(', ')}의 ${list.length}개이다.`,
        facts: { count: flagsIn(w0, w1, (x) => holds(L, rel, R, x)), rule: 'quad-count' }
      });
    }),
    T('quad-neg', '이차항의 계수가 음수인 이차부등식', '①27', (d) => {
      const a = d.pick([-1, -1, -2, -3]), r1 = d.int(-6, 3), r2 = d.int(r1 + 1, Math.min(r1 + 7, 7)), rel = d.pick(['<', '<=', '>', '>=']);
      const A = a, Bc = -a * (r1 + r2), Cc = a * r1 * r2, { L, R, kind } = dressQ(d, A, Bc, Cc, ['plain', 'move', 'prod']);
      if (kind === 'prod' && d.bool()) return null;
      const out = qSolve(L, rel, R), S = out.S;
      // 부등호의 방향을 바꾸지 않은 잘못: −1을 곱하고 부등호를 그대로 둔 해
      const keepDir = quadSet(Q(-A), Q(-Bc), Q(-Cc), rel).S;
      return setPick(d, '다음 이차부등식의 해는?', S, [keepDir, flipC(S), flipC(keepDir), comp(S)], {
        figure: ineqF(L, rel, R),
        explain: `우변을 이항하고 양변에 −1을 곱하면 부등호의 방향이 바뀌어 ${nb(`${sideH(qx(-A, -Bc, -Cc))} ${RH[FLIP[rel]]} 0`)}이다. 좌변을 인수분해하면 ${nb(`${-a === 1 ? '' : -a}${facH([lx(1, -r1), lx(1, -r2)])} ${RH[FLIP[rel]]} 0`)}이므로 해는 ${setH(S)}이다.`,
        facts: { rule: 'quad-neg' }
      });
    }),
    T('quad-sq', '판별식이 0인 이차부등식(완전제곱식)', '①28', (d) => {
      const p = d.pick([1, 1, 2, 3, 4, 5]), u = d.until(() => nz(d, -6, 6), (v) => p === 1 || Math.abs(v) % p !== 0), k = d.pick([1, 1, 2, -1]), rel = d.pick(['<', '<=', '>', '>=']);
      // k(px − u)²
      const A = k * p * p, Bc = -2 * k * p * u, Cc = k * u * u, r = Q(u, p), { L, R } = dressQ(d, A, Bc, Cc, ['plain', 'move', 'both']), out = qSolve(L, rel, R), S = out.S;
      const near = [ALL(), [], [pc(null, false, r, false), pc(r, false, null)], [pc(r, true, r, true)], [pc(r, false, null)], [pc(null, false, r, false)]].map(norm);
      return setPick(d, '다음 이차부등식의 해는?', S, near, {
        figure: ineqF(L, rel, R),
        explain: `정리하면 ${nb(`${sideH(qx(A, Bc, Cc))} ${RH[rel]} 0`)}, 곧 ${nb(`${k === 1 ? '' : k === -1 ? MINUS : k}(${sideH(lx(p, -u))})${sup(2)} ${RH[rel]} 0`)}이다. 완전제곱식은 ${X} = ${tx(r)}에서만 0이고 나머지에서는 ${k > 0 ? '양수' : '음수'}이므로 ${solSay(S)}.`,
        facts: { rule: 'quad-sq' }
      });
    }),
    T('quad-neg-d', '판별식이 음수인 이차부등식', '①29', (d) => {
      const a = d.pick([1, 2, 3, -1, -2]), b = d.int(-6, 6), c = d.int(-9, 12), rel = d.pick(['<', '<=', '>', '>=']);
      if (b * b - 4 * a * c >= 0) return null;
      const { L, R } = dressQ(d, a, b, c), out = qSolve(L, rel, R), S = out.S, h = Q(-b, 2 * a);
      const near = [ALL(), [], [pc(null, false, h, false), pc(h, false, null)], [pc(h, true, h, true)]].map(norm);
      return setPick(d, '다음 이차부등식의 해는?', S, near, {
        figure: ineqF(L, rel, R),
        explain: `정리하면 ${nb(`${sideH(qx(a, b, c))} ${RH[rel]} 0`)}이다. 이차방정식 ${nb(`${sideH(qx(a, b, c))} = 0`)}의 판별식이 ${nb(`${V('D')} = ${iq(b * b - 4 * a * c)} &lt; 0`)}이므로 이차함수의 그래프는 ${X}축과 만나지 않고 ${a > 0 ? '늘 ' + X + '축보다 위쪽' : '늘 ' + X + '축보다 아래쪽'}에 있다. 따라서 ${solSay(S)}.`,
        facts: { rule: 'quad-neg-d' }
      });
    }),
    T('quad-table', '판별식의 부호와 이차부등식의 해', '①30', (d) => {
      // 문장 [D 의 부호, 부등호, 해의 꼴]의 참·거짓은 본보기 이차식으로 셈하여 정한다(D > 0: (x − 1)(x − 3), D = 0: (x − 2)², D < 0: x² + 1).
      const al = 'α', be = 'β', kinds = { pos: [1, -4, 3], zero: [1, -4, 4], neg: [1, 0, 1] }, look = { pos: [1, 3], zero: [2, 2] };
      const SH = {
        between: (k) => `${nb(`${al} &lt; ${X} &lt; ${be}`)}`, betweenC: () => nb(`${al} ≤ ${X} ≤ ${be}`), out: () => `${nb(`${X} &lt; ${al}`)} 또는 ${nb(`${X} &gt; ${be}`)}`, outC: () => `${nb(`${X} ≤ ${al}`)} 또는 ${nb(`${X} ≥ ${be}`)}`,
        neq: () => `${nb(`${X} ≠ ${al}`)}인 모든 실수`, point: () => nb(`${X} = ${al}`), all: () => '모든 실수', none: () => '없다'
      };
      const SET = {
        between: ([u, v]) => [pc(u, false, v, false)], betweenC: ([u, v]) => [pc(u, true, v, true)], out: ([u, v]) => [pc(null, false, u, false), pc(v, false, null)], outC: ([u, v]) => [pc(null, false, u, true), pc(v, true, null)],
        neq: ([u]) => [pc(null, false, u, false), pc(u, false, null)], point: ([u]) => [pc(u, true, u, true)], all: () => ALL(), none: () => []
      };
      const DT = { pos: `${V('D')} &gt; 0`, zero: `${V('D')} = 0`, neg: `${V('D')} &lt; 0` };
      const cand = [];
      for (const dk of ['pos', 'zero', 'neg']) for (const rel of ['<', '<=', '>', '>=']) for (const sh of Object.keys(SH)) {
        if (dk === 'neg' && !['all', 'none'].includes(sh)) continue;
        if (dk === 'zero' && ['between', 'betweenC', 'out', 'outC'].includes(sh)) continue;
        if (dk === 'pos' && ['neq', 'point'].includes(sh)) continue;
        const [A, Bc, Cc] = kinds[dk], truth = eqSet(norm(quadSet(Q(A), Q(Bc), Q(Cc), rel).S), norm(SET[sh](look[dk] || [])));
        cand.push({ text: `${DT[dk]}이면 ${nb(`${V('a')}${X2} + ${V('b')}${X} + ${V('c')} ${RH[rel]} 0`)}의 해는 ${SH[sh]()}${sh === 'none' ? '' : '이다'}.`.replace('없다이다', '없다'), truth, dk, rel });
      }
      const yesAll = cand.filter((c) => c.truth), noAll = cand.filter((c) => !c.truth);
      const wantTrue = d.bool();
      const pick = wantTrue ? [d.pick(yesAll)].concat(d.shuffle(noAll).slice(0, 3)) : [d.pick(noAll)].concat(d.shuffle(yesAll).slice(0, 3));
      // 같은 D·부등호에 대한 두 문장은 한 문항에 함께 싣지 않는다(뜻이 맞서는 두 문장이면 답이 드러난다).
      if (new Set(pick.map((c) => c.dk + c.rel)).size !== pick.length) return null;
      const rows = d.shuffle(pick);
      return C(`이차방정식 ${nb(`${V('a')}${X2} + ${V('b')}${X} + ${V('c')} = 0`)} (${nb(`${V('a')} &gt; 0`)})의 판별식을 ${V('D')}라 하고, 실근이 있을 때 두 근을 ${al}, ${be} (${nb(`${al} ≤ ${be}`)})라 하자. 다음 중 ${wantTrue ? '옳은' : '옳지 않은'} 것은?`, rows.map((r) => r.text), rows.findIndex((r) => r.truth === wantTrue), {
        explain: `이차함수 ${nb(`${V('y')} = ${V('a')}${X2} + ${V('b')}${X} + ${V('c')}`)}의 그래프는 아래로 볼록하고, ${V('D')} &gt; 0이면 ${X}축과 두 점, ${V('D')} = 0이면 한 점에서 만나며 ${V('D')} &lt; 0이면 만나지 않는다. ${X}축보다 위쪽(아래쪽)에 있는 범위가 &gt; 0(&lt; 0)의 해이다.`,
        facts: { truth: rows.map((r) => r.truth === wantTrue), want: true, rule: 'quad-table' }
      });
    }),
    T('quad-vieta', '해의 경계를 근과 계수의 관계로', '①31', (d) => {
      const a = d.pick([1, 2, 3]), b = nz(d, -8, 8), c = d.until(() => nz(d, -9, -1), (v) => true), kind = d.int(0, 2), rel = d.pick(['<', '<=']);
      const D = b * b - 4 * a * c;
      if (D <= 0 || Number.isInteger(Math.sqrt(D))) return null;
      const al = 'α', be = 'β';
      let ask, val, e;
      if (kind === 0) { if (b % c !== 0) return null; ask = nb(`${frac(1, al)} + ${frac(1, be)}`); val = -b / c; e = `(0-(${js(Q(b))}))/(${js(Q(c))})+0`; }
      else if (kind === 1) { if (b % a !== 0 || (2 * c) % a !== 0) return null; ask = nb(`${al}${sup(2)} + ${be}${sup(2)}`); val = (b / a) ** 2 - 2 * c / a; e = `(${js(Q(b))})*(${js(Q(b))})/((${a})*(${a}))-2*(${js(Q(c))})/(${a})+0`; }
      else { if ((c - b) % a !== 0) return null; ask = nb(`(${al} + 1)(${be} + 1)`); val = (c - b) / a + 1; e = `((${js(Q(c))})-(${js(Q(b))}))/(${a})+1+0`; }
      const L = qx(a, b, c);
      return N(`이차부등식 ${nb(`${sideH(L)} ${RH[rel]} 0`)}의 해가 ${nb(`${al} ${RH[rel]} ${X} ${RH[rel]} ${be}`)}일 때, ${ask}의 값은?`, val, {
        signed: true,
        explain: `해의 양 끝 ${al}, ${be}는 이차방정식 ${nb(`${sideH(L)} = 0`)}의 두 근이다. 근과 계수의 관계에서 ${nb(`${al} + ${be} = ${tx(Q(-b, a))}`)}, ${nb(`${al}${be} = ${tx(Q(c, a))}`)}이므로 구하는 값은 ${iq(val)}이다.`,
        facts: { value: e, rule: 'quad-vieta' }
      });
    })
  ]);

  // ════════════════ 이차부등식의 해와 계수 ════════════════
  // 이차 이하의 식 a x² + b x + c 가 모든 실수에서 rel 0 인가(근이 무리수여도 판별식으로 따진다)
  function alwaysQ(a, b, c, rel) {
    if (a.p === 0) return b.p === 0 && cmpOk(c.p, rel);
    const D = qsub(qmul(b, b), qmul(Q(4), qmul(a, c)));
    if (!cmpOk(a.p, rel === '<=' ? '<' : rel === '>=' ? '>' : rel)) return false;
    return closedR(rel) ? D.p <= 0 : D.p < 0;
  }
  // a x² + b x + c rel 0 의 해가 꼭 한 점인가
  const onePoint = (a, b, c, rel) => a.p !== 0 && qsub(qmul(b, b), qmul(Q(4), qmul(a, c))).p === 0 && ((a.p > 0 && rel === '<=') || (a.p < 0 && rel === '>='));
  const sumE = (list) => list.map((v) => `(${js(Q(v))})`).join('+') + '+0';
  // 문자 a 에 대한 이차식 αa² + βa + γ 의 부호 조건(해가 집합, 경계를 다시 셈하는 식이 붙는다)
  const inA = (al, be, ga, rel) => quadSet(Q(al), Q(be), Q(ga), rel);
  B.addTypes(UNIT, 'quadk', [
    T('quadk-coef1', '이차부등식의 해가 주어질 때 계수 — 이차항의 계수 1', '①32', (d, n) => {
      if (n === 0) {
        const p = d.int(-7, 5), q = d.int(p + 1, Math.min(p + 8, 9)), rel = d.pick(['<', '<=', '>', '>=']);
        const S = norm(quadSet(Q(1), Q(-(p + q)), Q(p * q), rel).S);
        return valsQ(`이차부등식 ${nb(`${X2} + ${VA}${X} + ${V('b')} ${RH[rel]} 0`)}의 해가 ${setH(S)}일 때, 상수 ${VA}, ${V('b')}의 값은?`, [['a', -(p + q)], ['b', p * q]], {
          explain: `해가 ${setH(S)}이고 ${X2}의 계수가 1인 이차부등식은 ${nb(`(${sideH(lx(1, -p))})(${sideH(lx(1, -q))}) ${RH[rel]} 0`)}, 곧 ${nb(`${sideH(qx(1, -(p + q), p * q))} ${RH[rel]} 0`)}이다. 따라서 ${nb(`${VA} = ${iq(-(p + q))}`)}, ${nb(`${V('b')} = ${iq(p * q)}`)}이다.`,
          facts: { calc: [[`0-(${js(Q(p))})-(${js(Q(q))})+0`, 0], [`(${js(Q(p))})*(${js(Q(q))})+0`, 1]], rule: 'quadk-coef1-0' }
        });
      }
      // x² + ax + k ≤ 0 의 해의 한 끝과 상수항을 알 때
      const m = nz(d, -6, 6), b = d.until(() => nz(d, -8, 8), (v) => v !== m), k = b * m, rel = d.pick(['<', '<=']);
      const show = b < m ? nb(`${V('b')} ${RH[rel]} ${X} ${RH[rel]} ${iq(m)}`) : nb(`${iq(m)} ${RH[rel]} ${X} ${RH[rel]} ${V('b')}`);
      return valsQ(`이차부등식 ${nb(`${X2} + ${VA}${X} ${k < 0 ? MINUS : '+'} ${Math.abs(k)} ${RH[rel]} 0`)}의 해가 ${show}일 때, 상수 ${VA}, ${V('b')}의 값은?`, [['a', -(b + m)], ['b', b]], {
        explain: `${nb(`${X} = ${iq(m)}`)}, ${nb(`${X} = ${V('b')}`)}는 이차방정식 ${nb(`${X2} + ${VA}${X} ${k < 0 ? MINUS : '+'} ${Math.abs(k)} = 0`)}의 두 근이다. ${X}에 ${iq(m)}${lastJ(m, '을/를')} 넣으면 ${VA}를 구할 수 있고, 두 근의 곱이 ${iq(k)}이므로 ${nb(`${V('b')} = ${iq(b)}`)}, ${nb(`${VA} = ${iq(-(b + m))}`)}이다.`,
        facts: { calc: [[`0-(${js(Q(k))})/(${js(Q(m))})-(${js(Q(m))})+0`, 0], [`(${js(Q(k))})/(${js(Q(m))})+0`, 1]], rule: 'quadk-coef1-1' }
      });
    }, { count: 2 }),
    T('quadk-coef2', '이차부등식의 해가 주어질 때 계수 — 이차항의 계수도 모름', '①33', (d, n) => {
      if (n === 0) {
        const p = nz(d, -6, 5), q = d.until(() => nz(d, p + 1, Math.min(p + 7, 8)), (v) => v !== p), a = -d.int(1, 3), c = a * p * q, bb = -a * (p + q), inner2 = d.bool(), rel = inner2 ? d.pick(['>', '>=']) : d.pick(['<', '<=']);
        const S = norm(quadSet(Q(a), Q(bb), Q(c), rel).S);
        return valsQ(`이차부등식 ${nb(`${VA}${X2} + ${V('b')}${X} ${c < 0 ? MINUS : '+'} ${Math.abs(c)} ${RH[rel]} 0`)}의 해가 ${setH(S)}일 때, 상수 ${VA}, ${V('b')}의 값은?`, [['a', a], ['b', bb]], {
          explain: `해가 ${setH(S)}이므로 ${VA} &lt; 0이고, 주어진 부등식은 ${nb(`${VA}(${sideH(lx(1, -p))})(${sideH(lx(1, -q))}) ${RH[rel]} 0`)}, 곧 ${nb(`${VA}${X2} ${MINUS} ${iq(p + q)}${VA}${X} + ${iq(p * q)}${VA} ${RH[rel]} 0`)}과 같다. 상수항에서 ${nb(`${iq(p * q)}${VA} = ${iq(c)}`)}이므로 ${nb(`${VA} = ${iq(a)}`)}이고, ${nb(`${V('b')} = ${iq(bb)}`)}이다.`.replace(/− −/g, '+ ').replace(/\+ −/g, MINUS + ' '),
          facts: { calc: [[`(${js(Q(c))})/((${js(Q(p))})*(${js(Q(q))}))+0`, 0], [`0-(${js(Q(c))})/((${js(Q(p))})*(${js(Q(q))}))*((${js(Q(p))})+(${js(Q(q))}))+0`, 1]], rule: 'quadk-coef2-0' }
        });
      }
      // kx² + ax + b (≤ 또는 ≥) 0 의 해가 x = r 하나
      const k = d.pick([1, 2, 3, -1, -2]), r = nz(d, -6, 6), rel = k > 0 ? '<=' : '>=';
      return valsQ(`이차부등식 ${nb(`${k === 1 ? '' : k === -1 ? MINUS : k}${X2} + ${VA}${X} + ${V('b')} ${RH[rel]} 0`)}의 해가 ${nb(`${X} = ${iq(r)}`)}뿐일 때, 상수 ${VA}, ${V('b')}의 값은?`, [['a', -2 * k * r], ['b', k * r * r]], {
        explain: `해가 하나뿐이면 좌변은 ${nb(`${k === 1 ? '' : k === -1 ? MINUS : k}(${sideH(lx(1, -r))})${sup(2)}`)}과 같다. 펼치면 ${nb(sideH(qx(k, -2 * k * r, k * r * r)))}이므로 ${nb(`${VA} = ${iq(-2 * k * r)}`)}, ${nb(`${V('b')} = ${iq(k * r * r)}`)}이다.`,
        facts: { calc: [[`0-2*(${js(Q(k))})*(${js(Q(r))})+0`, 0], [`(${js(Q(k))})*(${js(Q(r))})*(${js(Q(r))})+0`, 1]], rule: 'quadk-coef2-1' }
      });
    }, { count: 2 }),
    T('quadk-other', '이차부등식의 해로 계수를 구해 다른 부등식 풀기', '①34', (d, n) => {
      if (n === 0) {
        // ax² + bx + C < 0 의 해가 x < p 또는 x > q 일 때 ax² − bx + C > 0 의 해
        const p = nz(d, -6, 5), q = d.until(() => nz(d, p + 1, Math.min(p + 7, 8)), () => true), a = -d.int(1, 3), C0 = a * p * q, b = -a * (p + q), rel1 = d.pick(['<', '<=']), rel2 = d.pick(['>', '>=']);
        const S1 = norm(quadSet(Q(a), Q(b), Q(C0), rel1).S), S = norm(quadSet(Q(a), Q(-b), Q(C0), rel2).S);
        verify(S, (x) => cmpOk(qcmp(qadd(qadd(qmul(Q(a), qmul(x, x)), qmul(Q(-b), x)), Q(C0)), Q(0)), rel2));
        return betweenAns(`${X}에 대한 이차부등식 ${nb(`${VA}${X2} + ${V('b')}${X} ${C0 < 0 ? MINUS : '+'} ${Math.abs(C0)} ${RH[rel1]} 0`)}의 해가 ${setH(S1)}일 때, 이차부등식 ${nb(`${VA}${X2} ${MINUS} ${V('b')}${X} ${C0 < 0 ? MINUS : '+'} ${Math.abs(C0)} ${RH[rel2]} 0`)}의 해를 구하시오. (단, ${VA}, ${V('b')}는 상수)`, S, {
          explain: `해가 ${setH(S1)}이므로 ${VA} &lt; 0이고 좌변은 ${nb(`${VA}(${sideH(lx(1, -p))})(${sideH(lx(1, -q))})`)}이다. 상수항을 견주어 ${nb(`${VA} = ${iq(a)}`)}, ${nb(`${V('b')} = ${iq(b)}`)}이다. 따라서 ${nb(`${sideH(qx(a, -b, C0))} ${RH[rel2]} 0`)}을 풀면 해는 ${setH(S)}이다.`,
          facts: { calc: [[`0-(${js(Q(q))})+0`, 0], [`0-(${js(Q(p))})+0`, 3]], rule: 'quadk-other-0' }
        });
      }
      // ax² + 2bx + C > 0 의 해가 p < x < q 일 때 x² + m·ax + b < 0 의 해
      const p = d.int(-7, 4), q = d.int(p + 1, Math.min(p + 6, 7)), a = -d.int(1, 3);
      if (p === 0 || q === 0 || p + q === 0 || (a * (p + q)) % 2) return null;
      const b = -a * (p + q) / 2, C0 = a * p * q, m = d.pick([-3, -2, -1, 1, 2, 3]), rel = d.pick(['<', '<=']);
      const out = quadSet(Q(1), Q(m * a), Q(b), rel);
      if (!out || !out.S.length || out.S[0].lo === null || !isInt(out.S[0].lo) || !isInt(out.S[0].hi) || qcmp(out.S[0].lo, out.S[0].hi) === 0) return null;
      const S = norm(out.S), mt = `${m < 0 ? MINUS : '+'} ${Math.abs(m) === 1 ? '' : Math.abs(m)}${VA}${X}`;
      return betweenAns(`${X}에 대한 이차부등식 ${nb(`${VA}${X2} + 2${V('b')}${X} ${C0 < 0 ? MINUS : '+'} ${Math.abs(C0)} &gt; 0`)}의 해가 ${nb(`${iq(p)} &lt; ${X} &lt; ${iq(q)}`)}일 때, 이차부등식 ${nb(`${X2} ${mt} + ${V('b')} ${RH[rel]} 0`)}의 해를 구하시오. (단, ${VA}, ${V('b')}는 상수)`, S, {
        explain: `해가 ${nb(`${iq(p)} &lt; ${X} &lt; ${iq(q)}`)}이므로 ${VA} &lt; 0이고 좌변은 ${nb(`${VA}(${sideH(lx(1, -p))})(${sideH(lx(1, -q))})`)}이다. 상수항을 견주면 ${nb(`${VA} = ${iq(a)}`)}, ${X}의 계수를 견주면 ${nb(`${V('b')} = ${iq(b)}`)}이다. 따라서 ${nb(`${sideH(qx(1, m * a, b))} ${RH[rel]} 0`)}을 풀면 해는 ${setH(S)}이다.`,
        facts: { rule: 'quadk-other-1', derived: out.nums.concat([a, b, m * a]) }
      });
    }, { count: 2 }),
    T('quadk-other-sum', 'x ≠ r 인 모든 실수에서 성립하는 부등식으로 계수 구하기', '①34', (d) => {
      const r = d.int(1, 4), k = d.int(-12, 30), a = -2 * r, b = r * r;
      // ax² − bx + k > 0
      const out = quadSet(Q(a), Q(-b), Q(k), '>');
      if (!out || !out.S.length) return null;
      const S = norm(out.S), [w0, w1] = windowOf(S), list = intsOf(w0, w1, (x) => has(S, x));
      if (list.length < 2 || list.length > 8) return null;
      const sum = list.reduce((s, v) => s + v, 0);
      return N(`${nb(`${X} ≠ ${r}`)}인 모든 실수 ${X}에 대하여 이차부등식 ${nb(`${X2} + ${VA}${X} + ${V('b')} &gt; 0`)}이 성립할 때, 이차부등식 ${nb(`${VA}${X2} ${MINUS} ${V('b')}${X} ${k < 0 ? MINUS : '+'} ${Math.abs(k)} &gt; 0`)}을 만족시키는 모든 정수 ${X}의 값의 합은? (단, ${VA}, ${V('b')}는 상수)`, sum, {
        signed: true,
        explain: `${nb(`${X} ≠ ${r}`)}인 모든 실수에서 성립하므로 좌변은 ${nb(`(${sideH(lx(1, -r))})${sup(2)}`)}이고 ${nb(`${VA} = ${iq(a)}`)}, ${nb(`${V('b')} = ${b}`)}이다. ${nb(`${sideH(qx(a, -b, k))} &gt; 0`)}의 해는 ${setH(S)}이므로 정수 ${X}는 ${list.map(iq).join(', ')}이고 그 합은 ${iq(sum)}이다.`,
        facts: { calc: [[sumE(list), 0]], derived: list, rule: 'quadk-other-sum' }
      });
    }),
    T('quadk-all-ray', '모든 실수에서 성립할 조건 — 상수항에만 문자', '①36', (d) => {
      const p = nz(d, -4, 4), k = d.pick([1, 2]), c = d.int(-9, 9), strict = d.bool();
      if ((p * p - c) % k) return null;
      const m = (p * p - c) / k, rel = strict ? '>' : '>=';
      const L = [tm(1, 'X'), tm(2 * p, 'x'), tm(k, 'a')].concat(c ? [tm(c, '')] : []);
      for (const av of [m - 1, m, m + 1]) {
        const g = gq(L, { a: Q(av) });
        if (alwaysQ(g.a, g.b, g.c, strict ? '>' : '>=') !== cmpOk(av - m, strict ? '>' : '>=')) throw new Error('모든 실수 조건이 어긋났다');
      }
      return rayAns(`모든 실수 ${X}에 대하여 이차부등식 ${nb(`${sideH(L)} ${RH[rel]} 0`)}이 성립하도록 하는 실수 ${VA}의 값의 범위를 구하시오.`, [pc(m, !strict, null, false, `((${Math.abs(2 * p)})*(${Math.abs(2 * p)})/4-(${js(Q(c))}))/(${k})`)], {
        name: VA,
        explain: `이차항의 계수가 양수이므로 판별식 ${V('D')}가 ${strict ? nb(`${V('D')} &lt; 0`) : nb(`${V('D')} ≤ 0`)}이면 된다(${strict ? `&gt; 0이므로 그래프가 ${X}축과 만나면 안 된다` : `≥ 0이므로 ${X}축에 닿는 것은 된다`}). ${nb(`${frac(V('D'), 4)} = ${iq(p * p)} ${MINUS} (${sideH(ts([k, 'a'], [c, '']))}) ${strict ? '&lt;' : '≤'} 0`)}에서 ${rayH(rel, m, VA)}이다.`,
        facts: { rule: 'quadk-all-ray', derived: [4] }
      });
    }),
    T('quadk-all-int', '모든 실수에서 성립할 조건 — x의 계수와 상수항에 문자', '①36', (d, n) => {
      if (n === 0) {
        const k = d.int(2, 9), s = d.pick([1, -1]), rel = '>';
        const L = [tm(1, 'X'), tm(2 * s, 'ax'), tm(k, 'a')], out = inA(1, -k, 0, '<');
        return betweenAns(`모든 실수 ${X}에 대하여 이차부등식 ${nb(`${sideH(L)} ${RH[rel]} 0`)}이 성립하도록 하는 실수 ${VA}의 값의 범위를 구하시오.`, norm(out.S), {
          name: VA,
          explain: `이차항의 계수가 양수이므로 판별식이 음수이면 된다. ${nb(`${frac(V('D'), 4)} = ${VA}${sup(2)} ${MINUS} ${k}${VA} &lt; 0`)}, 곧 ${nb(`${VA}(${VA} ${MINUS} ${k}) &lt; 0`)}이므로 ${nb(`0 &lt; ${VA} &lt; ${k}`)}이다.`,
          facts: { rule: 'quadk-all-int-0', derived: out.nums }
        });
      }
      const u = d.int(-5, 2), v = d.int(Math.max(u + 1, 1 - u), u + 7), kk = u + v, c = -u * v, s = d.pick([1, -1]);
      if (kk === 0 || c === 0) return null;
      const L = [tm(1, 'X'), tm(2 * s, 'ax'), tm(kk, 'a'), tm(c, '')], out = inA(1, -kk, -c, '<=');
      return betweenAns(`모든 실수 ${X}에 대하여 이차부등식 ${nb(`${sideH(L)} ≥ 0`)}이 성립하도록 하는 실수 ${VA}의 값의 범위를 구하시오.`, norm(out.S), {
        name: VA,
        explain: `이차항의 계수가 양수이므로 판별식 ${V('D')}가 ${nb(`${V('D')} ≤ 0`)}이면 된다(등호가 있어 그래프가 ${X}축에 닿아도 된다). ${nb(`${frac(V('D'), 4)} = ${sideH(qx(1, -kk, -c)).replace(/x/g, 'a')} ≤ 0`)}에서 ${setH(norm(out.S), VA)}이다.`,
        facts: { rule: 'quadk-all-int-1', derived: out.nums }
      });
    }, { count: 2 }),
    T('quadk-none', '이차부등식의 해가 없을 조건', '①37', (d) => {
      const u = d.int(-5, 2), v = d.int(Math.max(u + 1, 1 - u), u + 7), kk = u + v, c = -u * v, rel = d.pick(['<=', '<']);
      if (kk === 0 || c === 0) return null;
      // x² − 2ax + kk·a + c rel 0 의 해가 없다 ⟺ 반대 부등식이 늘 성립
      const L = [tm(1, 'X'), tm(-2, 'ax'), tm(kk, 'a'), tm(c, '')], out = inA(1, -kk, -c, rel === '<=' ? '<' : '<=');
      return betweenAns(`이차부등식 ${nb(`${sideH(L)} ${RH[rel]} 0`)}의 해가 존재하지 않도록 하는 실수 ${VA}의 값의 범위를 구하시오.`, norm(out.S), {
        name: VA,
        explain: `해가 없다는 것은 모든 실수 ${X}에 대하여 ${nb(`${sideH(L)} ${RH[rel === '<=' ? '>' : '>=']} 0`)}이라는 뜻이다. 판별식이 ${rel === '<=' ? '음수' : '0 이하'}이어야 하므로 ${nb(`${frac(V('D'), 4)} = ${VA}${sup(2)} ${MINUS} (${sideH(ts([kk, 'a'], [c, '']))}) ${rel === '<=' ? '&lt;' : '≤'} 0`)}에서 ${setH(norm(out.S), VA)}이다.`,
        facts: { rule: 'quadk-none', derived: out.nums }
      });
    }),
    T('quadk-lead-all', '이차항의 계수에 문자가 있을 때 늘 성립할 조건', '①38', (d) => {
      const p = nz(d, -3, 4), q = nz(d, -5, 5), m = Math.abs(q) - p;
      const L = [tg(1, ts([1, 'k'], [p, '']), 'X', true), tm(2 * q, 'x'), tm(1, 'k'), tm(p, '')];
      for (const kv of [m - 2, m - 1, m, m + 1, -Math.abs(q) - p - 1]) {
        const g = gq(L, { k: Q(kv) }), ok = g.a.p !== 0 && alwaysQ(g.a, g.b, g.c, '>');
        if (ok !== kv > m) throw new Error('늘 성립할 조건이 어긋났다');
      }
      return rayAns(`모든 실수 ${X}에 대하여 이차부등식 ${nb(`${sideH(L)} &gt; 0`)}이 성립하도록 하는 실수 ${VK}의 값의 범위를 구하시오.`, [pc(m, false, null, false, `(${Math.abs(2 * q)})/2-(${js(Q(p))})`)], {
        name: VK,
        explain: `늘 성립하려면 ① 이차항의 계수 ${nb(`${sideH(ts([1, 'k'], [p, '']))} &gt; 0`)} ② ${nb(`${frac(V('D'), 4)} = ${q * q} ${MINUS} (${sideH(ts([1, 'k'], [p, '']))})${sup(2)} &lt; 0`)}이어야 한다. ②에서 ${nb(`${VK} &lt; ${iq(-Math.abs(q) - p)}`)} 또는 ${nb(`${VK} &gt; ${iq(m)}`)}이고, ①과 함께 따지면 ${rayH('>', m, VK)}이다.`,
        facts: { rule: 'quadk-lead-all' }
      });
    }),
    T('quadk-lead-none', '이차항의 계수에 문자가 있을 때 해가 없을 조건', '①38', (d) => {
      const p = d.int(1, 3), mm = d.int(2, 4), c = d.int(1, 4), al = mm * mm - 4 * c;
      if (al === 0) return null;
      const K1 = ts([1, 'k'], [p, '']), L = [tg(1, K1, 'X', true), tg(-mm, K1, 'x', true), tm(c, 'k')];
      // 해가 없다 ⟺ k + p < 0 이고 D = (k + p)((m² − 4c)k + m²p) < 0
      const Dq = inA(al, p * (mm * mm + al), mm * mm * p * p, '<'), S1 = linSet(Q(1), Q(p), '<', `0-(${p})`), S = norm(inter(Dq.S, S1));
      if (S.length !== 1 || S[0].lo === null || S[0].hi === null || !isInt(S[0].lo) || !isInt(S[0].hi) || qcmp(S[0].lo, S[0].hi) >= 0 || fl(S[0].hi) - fl(S[0].lo) > 14) return null;
      for (let kv = fl(S[0].lo) - 3; kv <= fl(S[0].hi) + 3; kv += 1) {
        const g = gq(L, { k: Q(kv) }), none = g.a.p !== 0 && alwaysQ(g.a, g.b, g.c, '<');
        if (none !== has(S, Q(kv))) throw new Error('해가 없을 조건이 어긋났다');
      }
      return betweenAns(`${X}에 대한 이차부등식 ${nb(`${sideH(L)} ≥ 0`)}의 해가 존재하지 않도록 하는 실수 ${VK}의 값의 범위를 구하시오.`, S, {
        name: VK,
        explain: `해가 없으려면 그래프가 늘 ${X}축보다 아래쪽에 있어야 하므로 ① ${nb(`${sideH(K1)} &lt; 0`)} ② 판별식 ${nb(`${V('D')} &lt; 0`)}이어야 한다. ${nb(`${V('D')} = (${sideH(K1)})(${sideH(ts([al, 'k'], [mm * mm * p, '']))})`)}이므로 ②의 해는 ${setH(norm(Dq.S), VK)}이고, ①과의 공통부분은 ${setH(S, VK)}이다.`,
        facts: { rule: 'quadk-lead-none', derived: Dq.nums }
      });
    }),
    T('quadk-one', '이차부등식의 해가 오직 하나일 조건', '①39', (d, n) => {
      if (n === 0) {
        const k0 = nz(d, -6, 6), e = 2 * k0, c = k0 * k0;
        const L = [tm(1, 'X'), tm(-2, 'kx')], R = ts([c, ''], [-e, 'k']);
        for (const kv of [k0 - 1, k0, k0 + 1]) { const g = gq(L, { k: Q(kv) }), r = gq(R, { k: Q(kv) }); if (onePoint(qsub(g.a, r.a), qsub(g.b, r.b), qsub(g.c, r.c), '<=') !== (kv === k0)) throw new Error('해가 하나일 조건이 어긋났다'); }
        return N(`이차부등식 ${nb(`${sideH(L)} ≤ ${sideH(R)}`)}의 해가 오직 한 개일 때, 실수 ${VK}의 값은?`, k0, {
          signed: true,
          explain: `우변을 이항하면 ${nb(`${X2} ${MINUS} 2${VK}${X} ${e < 0 ? MINUS : '+'} ${Math.abs(e)}${VK} ${c < 0 ? MINUS : '+'} ${MINUS}${c} ≤ 0`)}이다. 이차항의 계수가 양수이므로 해가 하나이려면 그래프가 ${X}축에 접해야 하고, ${nb(`${frac(V('D'), 4)} = ${VK}${sup(2)} ${e < 0 ? '+' : MINUS} ${Math.abs(e)}${VK} + ${c} = (${sideH(ts([1, 'k'], [-k0, '']))})${sup(2)} = 0`)}에서 ${nb(`${VK} = ${iq(k0)}`)}이다.`.replace(`+ ${MINUS}${c}`, `${MINUS} ${c}`),
          facts: { value: `(${js(Q(e))})/2+0`, rule: 'quadk-one-0' }
        });
      }
      // (a − p)x² + (a + q)x + (s·a + t) ≥ 0 의 해가 오직 하나. 판별식은 a 에 대하여 위로 볼록하고 a = p 에서 양수이므로 두 근이 p 의 양쪽에 있다.
      const p = d.int(1, 4), q = nz(d, -5, 5), sc = d.int(1, 2), t = d.int(-6, 6);
      if (q === -p) return null;
      const Dq = inA(1 - 4 * sc, 2 * q - 4 * t + 4 * p * sc, q * q + 4 * p * t, '>=');
      if (!Dq || Dq.S.length !== 1 || Dq.S[0].lo === null || Dq.S[0].hi === null || qcmp(Dq.S[0].lo, Dq.S[0].hi) === 0) return null;
      const lowR = Dq.S[0].lo, other = Dq.S[0].hi;
      if (!isInt(lowR) || qcmp(lowR, Q(p)) >= 0 || qcmp(other, Q(p)) <= 0 || Math.abs(lowR.p) > 12) return null;
      const ans = lowR.p, L = [tg(1, ts([1, 'a'], [-p, '']), 'X', true), tg(1, ts([1, 'a'], [q, '']), 'x', true)].concat(ts([sc, 'a'], [t, '']).filter((tt) => tt.c.p !== 0));
      for (const av of [Q(ans), other, Q(ans - 1), Q(p + 3)]) { const g = gq(L, { a: av }); if (onePoint(g.a, g.b, g.c, '>=') !== (qcmp(av, Q(ans)) === 0)) throw new Error('해가 하나일 조건이 어긋났다'); }
      return N(`${X}에 대한 이차부등식 ${nb(`${sideH(L)} ≥ 0`)}의 해가 오직 한 개일 때, 실수 ${VA}의 값은?`, ans, {
        signed: true,
        explain: `해가 하나이려면 그래프가 위로 볼록하고(${nb(`${VA} ${MINUS} ${p} &lt; 0`)}) ${X}축에 접해야(${nb(`${V('D')} = 0`)}) 한다. ${nb(`${V('D')} = ${sideH(qx(1 - 4 * sc, 2 * q - 4 * t + 4 * p * sc, q * q + 4 * p * t)).replace(/x/g, 'a')} = 0`)}에서 ${nb(`${VA} = ${iq(ans)}`)} 또는 ${nb(`${VA} = ${tx(other)}`)}이고, ${nb(`${VA} &lt; ${p}`)}이어야 하므로 ${nb(`${VA} = ${iq(ans)}`)}이다(${nb(`${VA} = ${tx(other)}`)}이면 아래로 볼록하여 해가 모든 실수이다).`,
        facts: { value: solE(Dq.S[0].le), rule: 'quadk-one-1', derived: Dq.nums }
      });
    }, { count: 2 })
  ]);

  // ════════════════ 연립이차부등식 ════════════════
  // 연립부등식의 줄 { L, rel, R, S, h, nums }
  function qRow(d, a, r1, r2, rel, kinds) {
    const A = a, Bc = -a * (r1 + r2), Cc = a * r1 * r2, { L, R } = dressQ(d, A, Bc, Cc, kinds), out = qSolve(L, rel, R);
    return out && { L, R, rel, S: out.S, h: ineqH(L, rel, R), nums: out.nums.concat(numsOf([out.a, out.b, out.c])) };
  }
  const lRow = (d, rel, t) => linFor(d, rel, t, d.pick(['c', 'b']));
  const solve2 = (rows) => { let S = ALL(); for (const r of rows) S = inter(S, r.S); return verify(S, (x) => allHold(rows, x)); };
  const oneInt = (S) => S.length === 1 && S[0].lo !== null && S[0].hi !== null && isInt(S[0].lo) && isInt(S[0].hi) && qcmp(S[0].lo, S[0].hi) < 0;
  const twoPieces = (S) => S.length === 2 && !S.some((p) => p.lo !== null && p.hi !== null && qcmp(p.lo, p.hi) === 0);
  const matters = (S, rows) => rows.every((r) => !eqSet(S, norm(r.S)));
  const sysText = (rows) => sysF(rows.map((r) => r.h));
  const sysTold = (rows) => rows.map((r, i) => `${['첫째', '둘째'][i]} 부등식의 해는 ${setH(r.S)}`).join(', ');
  B.addTypes(UNIT, 'sys2', [
    T('sys2-lin-in', '일차부등식과 이차부등식의 연립 — 해가 두 수 사이', '①41', (d) => {
      // 이차부등식의 해(두 수 사이)를 일차부등식이 한쪽에서 자른다.
      const r1 = d.int(-6, 3), r2 = d.int(r1 + 2, Math.min(r1 + 8, 8)), t = d.int(r1 + 1, r2 - 1), up = d.bool();
      const q = qRow(d, d.pick([1, 1, 2]), r1, r2, d.pick(['<', '<='])), l = lRow(d, relOf(up, d.bool()), t);
      if (!q) return null;
      const rows = d.shuffle([l, q]), S = solve2(rows);
      if (!oneInt(S) || !matters(S, rows)) return null;
      return betweenAns(SOLVE2, S, { figure: sysText(rows), explain: `${sysTold(rows)}이므로 공통부분은 ${setH(S)}이다.`, facts: { rule: 'sys2-lin-in', derived: l.nums.concat(q.nums) } });
    }),
    T('sys2-lin-two', '일차부등식과 이차부등식의 연립 — 해가 두 조각', '①41', (d) => {
      // 이차부등식의 해(두 쪽)를 일차부등식이 바깥쪽에서 자른다.
      const r1 = d.int(-6, 3), r2 = d.int(r1 + 1, Math.min(r1 + 7, 7)), up = d.bool(), t = up ? d.int(r1 - 6, r1 - 1) : d.int(r2 + 1, r2 + 6);
      const q = qRow(d, d.pick([1, 1, 2]), r1, r2, d.pick(['>', '>='])), l = lRow(d, relOf(up, d.bool()), t);
      if (!q) return null;
      const rows = d.shuffle([l, q]), S = solve2(rows);
      if (!twoPieces(S) || !matters(S, rows)) return null;
      return setPick(d, '다음 연립부등식의 해는?', S, [norm(l.S), norm(q.S), flipC(S), hull(S), [S[0]], [S[1]]], { figure: sysText(rows), explain: `${sysTold(rows)}이므로 공통부분은 ${setH(S)}이다.`, facts: { rule: 'sys2-lin-two' } });
    }),
    T('sys2-quad-in', '이차부등식 둘의 연립 — 해가 두 수 사이', '①42', (d) => {
      // 두 사이가 엇갈려 겹치거나(r1 < s1 < r2 < s2), 바깥 해가 사이 해의 한쪽을 자른다(s1 < r1 < s2 < r2).
      const r1 = d.int(-7, 2), r2 = d.int(r1 + 2, r1 + 7), overlap = d.bool(), s1 = overlap ? d.int(r1 + 1, r2 - 1) : d.int(r1 - 5, r1 - 1), s2 = overlap ? d.int(r2 + 1, r2 + 5) : d.int(r1 + 1, r2 - 1);
      const a = qRow(d, d.pick([1, 1, 2]), r1, r2, d.pick(['<', '<='])), b = qRow(d, d.pick([1, 1, 2]), s1, s2, overlap ? d.pick(['<', '<=']) : d.pick(['>', '>=']));
      if (!a || !b) return null;
      const rows = d.shuffle([a, b]), S = solve2(rows);
      if (!oneInt(S) || !matters(S, rows)) return null;
      return betweenAns(SOLVE2, S, { figure: sysText(rows), explain: `${sysTold(rows)}이므로 공통부분은 ${setH(S)}이다.`, facts: { rule: 'sys2-quad-in', derived: a.nums.concat(b.nums) } });
    }),
    T('sys2-quad-two', '이차부등식 둘의 연립 — 해가 두 조각', '①42', (d) => {
      // 바깥 해의 두 근이 사이 해 안에 있다(r1 < s1 < s2 < r2).
      const r1 = d.int(-7, 1), r2 = d.int(r1 + 3, r1 + 8), s1 = d.int(r1 + 1, r2 - 2), s2 = d.int(s1 + 1, r2 - 1);
      const a = qRow(d, d.pick([1, 1, 2]), r1, r2, d.pick(['<', '<='])), b = qRow(d, d.pick([1, 1, 2]), s1, s2, d.pick(['>', '>=']));
      if (!a || !b) return null;
      const rows = d.shuffle([a, b]), S = solve2(rows);
      if (!twoPieces(S)) return null;
      return setPick(d, '다음 연립부등식의 해는?', S, [norm(a.S), norm(b.S), flipC(S), hull(S), [S[0]], [S[1]]], { figure: sysText(rows), explain: `${sysTold(rows)}이므로 공통부분은 ${setH(S)}이다.`, facts: { rule: 'sys2-quad-two' } });
    }),
    T('sys2-quad-special', '완전제곱식이 낀 연립이차부등식·해가 없는 연립이차부등식', '①42', (d, n) => {
      if (n === 0) {
        const r = d.int(-5, 5), r1 = d.int(r - 4, r), r2 = d.int(Math.max(r, r1 + 1), r + 4), rel = d.pick(['<', '<=']);
        if (r1 === r2) return null;
        const sq = { L: qx(1, -2 * r, r * r), R: ts([0, '']), rel: '>' }, sqOut = qSolve(sq.L, '>', sq.R);
        Object.assign(sq, { S: sqOut.S, h: ineqH(sq.L, '>', sq.R), nums: sqOut.nums });
        const q = qRow(d, 1, r1, r2, rel, ['plain', 'move']);
        if (!q) return null;
        const rows = d.shuffle([sq, q]), S = solve2(rows);
        if (eqSet(S, norm(q.S))) return null;
        return setPick(d, '다음 연립부등식의 해는?', S, [norm(q.S), flipC(S), hull(S), S.length > 1 ? [S[0]] : null, S.length > 1 ? [S[1]] : null, norm(inter(q.S, [pc(r, true, r, true)]))], {
          figure: sysText(rows),
          explain: `${nb(`${sideH(sq.L)} &gt; 0`)}은 ${nb(`(${sideH(lx(1, -r))})${sup(2)} &gt; 0`)}이므로 해는 ${nb(`${X} ≠ ${iq(r)}`)}인 모든 실수이다. 다른 부등식의 해 ${setH(q.S)}에서 ${nb(`${X} = ${iq(r)}`)}만 빼면 ${setH(S)}이다.`,
          facts: { rule: 'sys2-quad-special-0' }
        });
      }
      const r1 = d.int(-6, 1), r2 = d.int(r1 + 1, r1 + 4), s1 = d.int(-8, r1 - 1), s2 = d.int(r2 + 1, r2 + 5);
      const a = qRow(d, 1, r1, r2, d.pick(['<', '<=']), ['plain', 'move']), bb = qRow(d, 1, s1, s2, d.pick(['>', '>=']), ['plain', 'move', 'both']);
      if (!a || !bb) return null;
      const rows = d.shuffle([a, bb]), S = solve2(rows);
      if (S.length) return null;
      return setPick(d, '다음 연립부등식의 해는?', S, [norm(a.S), norm(bb.S), uni(a.S, bb.S), [pc(r1, true, r2, true)], [pc(s1, true, s2, true)]], {
        figure: sysText(rows),
        explain: `${sysTold(rows)}이다. 두 해를 수직선 위에 나타내면 겹치는 부분이 없으므로 해는 없다.`,
        facts: { rule: 'sys2-quad-special-1' }
      });
    }, { count: 2 }),
    T('sys2-chain', '이차식이 낀 A < B < C 꼴의 부등식', '①43', (d) => {
      const beta = d.int(-5, 5), gamma = d.int(-8, 8), q1 = d.int(-5, 3), q2 = d.int(q1 + 1, q1 + 6), r1 = d.pick(['<', '<=']), r2 = d.pick(['<', '<=']), lin = d.bool();
      const Bm = gamma === 0 && beta !== 0 && d.bool() ? [tg(1, lx(1, beta), 'x')] : qx(1, beta, gamma);
      let A;
      if (lin) { const p1 = d.int(-6, 4), p2 = d.int(p1, p1 + 6); A = lx(beta + p1 + p2, gamma - p1 * p2); }
      else { const u = nz(d, -4, 4), w = d.int(-6, 6); A = qx(1, beta - u, gamma - w); }
      const Cm = lx(beta + q1 + q2, gamma - q1 * q2);
      const o1 = solveQ(A, r1, Bm), o2 = solveQ(Bm, r2, Cm);
      if (!o1 || !o2) return null;
      const S = verify(inter(o1.S, o2.S), (x) => holds(A, r1, Bm, x) && holds(Bm, r2, Cm, x));
      if (!oneInt(S) || eqSet(S, norm(o2.S)) || eqSet(S, norm(o1.S))) return null;
      return betweenAns(SOLVE, S, {
        figure: exq(chainH(A, r1, Bm, r2, Cm)),
        explain: `주어진 부등식은 연립부등식 ${sys([ineqH(A, r1, Bm), ineqH(Bm, r2, Cm)])}과 같다. 각각 풀면 ${setH(o1.S)}, ${setH(o2.S)}이므로 공통부분은 ${setH(S)}이다.`,
        facts: { rule: 'sys2-chain', derived: o1.nums.concat(o2.nums, numsOf([o1.a, o1.b, o1.c, o2.a, o2.b, o2.c])) }
      });
    }),
    T('sys2-int-count', '연립이차부등식을 만족시키는 정수의 개수', '①44', (d) => {
      const mk = (rels, a) => { const p = d.pick([1, 2]), u = nz(d, -12, 12), v = d.int(-6, 6); if (p * v === u) return null; const [A, Bc, Cc] = [p, -(p * v + u), u * v], { L, R } = dressQ(d, A * a, Bc * a, Cc * a, ['plain', 'move']), rel = d.pick(rels), out = qSolve(L, rel, R); return out && { L, R, rel, S: out.S, h: ineqH(L, rel, R) }; };
      const a = mk(['<', '<='], 1), b = mk(['>', '>='], 1);
      if (!a || !b) return null;
      const rows = d.shuffle([a, b]), S = solve2(rows);
      if (!S.length || S.some((p) => p.lo === null || p.hi === null)) return null;
      const [w0, w1] = windowOf(S), list = intsOf(w0, w1, (x) => allHold(rows, x));
      if (list.length < 2 || list.length > 9 || !matters(S, rows)) return null;
      return N(`다음 연립부등식을 만족시키는 정수 ${X}의 개수는?`, list.length, {
        unit: '개', figure: sysText(rows),
        explain: `${sysTold(rows)}이므로 공통부분은 ${setH(S)}이다. 이를 만족시키는 정수는 ${list.map(iq).join(', ')}의 ${list.length}개이다.`,
        facts: { count: flagsIn(w0, w1, (x) => allHold(rows, x)), rule: 'sys2-int-count' }
      });
    }),
    T('sys2-int-sum', '연립이차부등식을 만족시키는 정수의 합', '①44', (d) => {
      const r1 = d.int(-7, 2), r2 = d.int(r1 + 2, r1 + 8), s1 = d.int(r1 - 2, r2), s2 = d.int(s1 + 1, s1 + 5);
      const a = qRow(d, 1, r1, r2, d.pick(['<', '<=']), ['plain', 'move']), b = d.bool() ? qRow(d, 1, s1, s2, d.pick(['>', '>=']), ['plain', 'move']) : lRow(d, d.pick(['>', '>=']), s1);
      if (!a || !b) return null;
      const rows = d.shuffle([a, b]), S = solve2(rows);
      if (!S.length || S.some((p) => p.lo === null || p.hi === null)) return null;
      const [w0, w1] = windowOf(S), list = intsOf(w0, w1, (x) => allHold(rows, x)), sum = list.reduce((s, v) => s + v, 0);
      if (list.length < 2 || list.length > 9 || !matters(S, rows)) return null;
      return N(`다음 연립부등식을 만족시키는 모든 정수 ${X}의 값의 합은?`, sum, {
        signed: true, figure: sysText(rows),
        explain: `${sysTold(rows)}이므로 공통부분은 ${setH(S)}이다. 이를 만족시키는 정수는 ${list.map(iq).join(', ')}이고 그 합은 ${iq(sum)}이다.`,
        facts: { calc: [[sumE(list), 0]], derived: list, rule: 'sys2-int-sum' }
      });
    }),
    T('sys2-coef4', '연립이차부등식의 해로 네 계수 구하기', '①45', (d) => {
      const p = d.int(-7, 0), m = d.int(p + 1, p + 4), n = d.int(m + 1, m + 3), q = d.int(n + 1, n + 4), r1 = d.pick(['<']), r2 = d.pick(['>=']);
      const S = norm([pc(p, false, m, true), pc(n, true, q, false)]);
      const rows = [{ L: qx(1, -(p + q), p * q), rel: '<', R: ts([0, '']) }, { L: qx(1, -(m + n), m * n), rel: '>=', R: ts([0, '']) }];
      verify(S, (x) => allHold(rows, x));
      const vv = [['a', -(p + q)], ['b', p * q], ['c', -(m + n)], ['d', m * n]];
      return valsQ(`연립부등식 ${sys([`${X2} + ${VA}${X} + ${V('b')} ${LT} 0`, `${X2} + ${V('c')}${X} + ${V('d')} ${GE} 0`])}의 해가 ${setH(S)}일 때, 상수 ${VA}, ${V('b')}, ${V('c')}, ${V('d')}의 값은?`, vv, {
        explain: `열린 끝 ${iq(p)}, ${nj(q, '은/는')} ${nb(`${X2} + ${VA}${X} + ${V('b')} &lt; 0`)}의 해 ${nb(`${iq(p)} &lt; ${X} &lt; ${iq(q)}`)}에서, 닫힌 끝 ${iq(m)}, ${nj(n, '은/는')} ${nb(`${X2} + ${V('c')}${X} + ${V('d')} ≥ 0`)}의 해 ${nb(`${X} ≤ ${iq(m)}`)} 또는 ${nb(`${X} ≥ ${iq(n)}`)}에서 온다. 따라서 두 식은 ${nb(`(${sideH(lx(1, -p))})(${sideH(lx(1, -q))})`)}, ${nb(`(${sideH(lx(1, -m))})(${sideH(lx(1, -n))})`)}이다.`,
        facts: { calc: [[`0-(${js(Q(p))})-(${js(Q(q))})+0`, 0], [`(${js(Q(p))})*(${js(Q(q))})+0`, 1], [`0-(${js(Q(m))})-(${js(Q(n))})+0`, 2], [`(${js(Q(m))})*(${js(Q(n))})+0`, 3]], rule: 'sys2-coef4' }
      });
    }),
    T('sys2-coef', '연립부등식의 해로 계수 구하기', '①45', (d, n) => {
      if (n === 0) {
        // {x² − (u + v)x + uv ≤ 0, x² + (w − a)x − wa < 0} 의 해가 b ≤ x < c
        const w = d.int(1, 3), u = d.int(-w + 1, 4), v = d.int(u + 2, u + 7), c = d.int(u + 1, v);
        const first = { L: qx(1, -(u + v), u * v), rel: '<=', R: ts([0, '']) }, fo = qSolve(first.L, '<=', first.R);
        const second = [tm(1, 'X'), tg(1, ts([w, ''], [-1, 'a']), 'x', true), tm(-w, 'a')];
        const S = norm(inter(fo.S, quadSet(Q(1), Q(w - c), Q(-w * c), '<').S));
        verify(S, (x) => holds(first.L, '<=', first.R, x) && holds(second, '<', ts([0, '']), x, { a: Q(c) }));
        if (S.length !== 1 || qcmp(S[0].lo, Q(u)) !== 0 || qcmp(S[0].hi, Q(c)) !== 0) return null;
        return valsQ(`연립부등식 ${sys([ineqH(first.L, '<=', first.R), ineqH(second, '<', ts([0, '']))])}의 해가 ${nb(`${V('b')} ≤ ${X} &lt; ${iq(c)}`)}일 때, 상수 ${VA}, ${V('b')}의 값은? (단, ${nb(`${VA} &gt; ${iq(-w)}`)})`, [['a', c], ['b', u]], {
          explain: `첫째 부등식의 해는 ${setH(fo.S)}이다. 둘째 부등식은 ${nb(`(${sideH(lx(1, w))})(${X} ${MINUS} ${VA}) &lt; 0`)}이고 ${nb(`${VA} &gt; ${iq(-w)}`)}이므로 해는 ${nb(`${iq(-w)} &lt; ${X} &lt; ${VA}`)}이다. 공통부분이 ${nb(`${V('b')} ≤ ${X} &lt; ${iq(c)}`)}이려면 닫힌 끝은 첫째 부등식에서, 열린 끝은 둘째 부등식에서 와야 하므로 ${nb(`${V('b')} = ${iq(u)}`)}, ${nb(`${VA} = ${iq(c)}`)}이다.`,
          facts: { calc: [[`${c}+0`, 0], [solE(fo.S[0].le), 1]], derived: fo.nums.concat(numsOf([u + v, u * v])), rule: 'sys2-coef-0' }
        });
      }
      // {일차, 이차} 의 해가 x² + ax + b ≤ 0 의 해와 같다
      const lo = d.int(-6, 3), hi = d.int(lo + 1, lo + 6), extra = d.int(1, 4), cutLow = d.bool();
      // 이차부등식의 해 [lo − extra, hi] 또는 [lo, hi + extra] 를 일차부등식이 한쪽에서 자른다
      const qa = cutLow ? lo - extra : lo, qb = cutLow ? hi : hi + extra, q = qRow(d, 1, qa, qb, '<=', ['plain', 'move']), l = lRow(d, cutLow ? '>=' : '<=', cutLow ? lo : hi);
      if (!q) return null;
      const rows = d.shuffle([l, q]), S = solve2(rows);
      if (!oneInt(S) || !S[0].lc || !S[0].hc) return null;
      return valsQ(`연립부등식 ${sys(rows.map((r) => r.h))}의 해가 이차부등식 ${nb(`${X2} + ${VA}${X} + ${V('b')} ≤ 0`)}의 해와 같을 때, 상수 ${VA}, ${V('b')}의 값은?`, [['a', -(lo + hi)], ['b', lo * hi]], {
        explain: `${sysTold(rows)}이므로 연립부등식의 해는 ${setH(S)}이다. 해가 ${setH(S)}이고 ${X2}의 계수가 1인 이차부등식은 ${nb(`(${sideH(lx(1, -lo))})(${sideH(lx(1, -hi))}) ≤ 0`)}이므로 ${nb(`${VA} = ${iq(-(lo + hi))}`)}, ${nb(`${V('b')} = ${iq(lo * hi)}`)}이다.`,
        facts: { calc: [[`0-((${S[0].le})+(${S[0].he}))+0`, 0], [`(${S[0].le})*(${S[0].he})+0`, 1]], derived: l.nums.concat(q.nums), rule: 'sys2-coef-1' }
      });
    }, { count: 2 }),
    T('sys2-absx', 'x²과 |x|가 함께 있는 부등식', '①49', (d) => {
      const p = d.int(1, 4), r = d.int(p + 1, p + 5), q = r * (r - p), rel = d.pick(['<', '<=']);
      const L = [tm(1, 'X'), ta(-p, lx(1, 0)), tm(-q, '')], R = ts([0, '']);
      const pos = inter(quadSet(Q(1), Q(-p), Q(-q), rel).S, [pc(0, true, null, false)]), neg = inter(quadSet(Q(1), Q(p), Q(-q), rel).S, [pc(null, false, 0, false)]);
      const S = verify(uni(pos, neg), (x) => holds(L, rel, R, x), [0]);
      return betweenAns(SOLVE, S, {
        figure: exq(ineqH(L, rel, R)),
        explain: `${nb(`${X} ≥ 0`)}일 때 ${nb(`${sideH(qx(1, -p, -q))} ${RH[rel]} 0`)}에서 ${setH(pos)}, ${nb(`${X} &lt; 0`)}일 때 ${nb(`${sideH(qx(1, p, -q))} ${RH[rel]} 0`)}에서 ${setH(neg)}이다. 두 경우를 합하면 ${setH(S)}이다.`,
        facts: { rule: 'sys2-absx', derived: numsOf([p, q, Math.sqrt(p * p + 4 * q)]) }
      });
    }),
    T('sys2-absq', '절댓값 안이 이차식인 부등식', '①50', (d) => {
      // |x² − sx + P1 + k| ≤ k : 이차식 − k = (x − u)(x − s + u), 이차식 + k = (x − v)(x − s + v)
      const s = d.int(-5, 5), u = d.int(-6, 6), v = d.int(-6, 6), P1 = u * (s - u), P2 = v * (s - v);
      if (P2 <= P1 || (P2 - P1) % 2) return null;
      const k = (P2 - P1) / 2, c = P1 + k, L = [ta(1, qx(1, -s, c))], rel = d.pick(['<', '<=']);
      if (c === 0 && s === 0) return null;
      const S1 = quadSet(Q(1), Q(-s), Q(c - k), rel).S, S2 = quadSet(Q(1), Q(-s), Q(c + k), FLIP[rel]).S, S = verify(inter(S1, S2), (x) => holds(L, rel, ts([k, '']), x));
      const [w0, w1] = windowOf(S), list = intsOf(w0, w1, (x) => holds(L, rel, ts([k, '']), x));
      if (list.length < 2 || list.length > 10) return null;
      return N(`다음 부등식을 만족시키는 정수 ${X}의 개수는?`, list.length, {
        unit: '개', figure: exq(ineqH(L, rel, ts([k, '']))),
        explain: `주어진 부등식은 ${nb(`${MINUS}${k} ${RH[rel]} ${sideH(qx(1, -s, c))} ${RH[rel]} ${k}`)}이다. ${nb(`${sideH(qx(1, -s, c - k))} ${RH[rel]} 0`)}의 해 ${ej(setH(S1), '과/와')} ${nb(`${sideH(qx(1, -s, c + k))} ${RH[FLIP[rel]]} 0`)}의 해 ${setH(S2)}의 공통부분은 ${setH(S)}이고, 정수는 ${list.map(iq).join(', ')}의 ${list.length}개이다.`,
        facts: { count: flagsIn(w0, w1, (x) => holds(L, rel, ts([k, '']), x)), rule: 'sys2-absq' }
      });
    })
  ]);

  // ════════════════ 이차부등식의 활용 ════════════════
  B.addTypes(UNIT, 'use2', [
    T('use2-rect', '둘레가 정해진 직사각형의 넓이 조건', '①51', (d, n) => {
      if (n === 0) {
        const half = 2 * d.int(6, 30), r2 = d.int(half / 2 + 1, half - 2), r1 = half - r2, S0 = r1 * r2, L0 = 2 * half;
        const out = quadSet(Q(1), Q(-half), Q(S0), '<=');
        const S = norm(inter(out.S, [pc(half / 2, false, null, false, `(${L0})/4`)]));
        verify(S, (x) => qcmp(x, Q(half / 2)) > 0 && qcmp(x, Q(half)) < 0 && qcmp(qmul(x, qsub(Q(half), x)), Q(S0)) >= 0);
        return betweenAns(`둘레의 길이가 ${L0} m이고 넓이가 ${S0} m² 이상인 직사각형 모양의 꽃밭을 만들려고 한다. 가로의 길이를 ${X} m라 할 때, ${X}의 값의 범위를 구하시오. (단, 가로의 길이가 세로의 길이보다 길다.)`, S, {
          signed: false,
          explain: `세로의 길이는 ${nb(`(${half} ${MINUS} ${X})`)} m이다. 가로가 세로보다 길므로 ${nb(`${X} &gt; ${half} ${MINUS} ${X}`)}, 곧 ${nb(`${X} &gt; ${half / 2}`)}이다. 넓이에서 ${nb(`${X}(${half} ${MINUS} ${X}) ≥ ${S0}`)}, 곧 ${nb(`(${X} ${MINUS} ${r1})(${X} ${MINUS} ${r2}) ≤ 0`)}이므로 ${nb(`${r1} ≤ ${X} ≤ ${r2}`)}이다. 따라서 ${setH(S)}이다.`,
          facts: { rule: 'use2-rect-0', derived: out.nums.concat([4]) }
        });
      }
      // 창 A(가로 x, 세로 2x)와 창 B(세로 x, 가로 x + m): 둘레의 합 ≤ P, 넓이의 합 ≥ Sa
      const m = d.int(1, 4), r = d.int(1, 4), u = d.int(r + 1, r + 4), Sa = 3 * r * r + m * r, P = 10 * u + 2 * m;
      const out = quadSet(Q(3), Q(m), Q(-Sa), '>='), up = linSet(Q(10), Q(2 * m - P), '<=', `((${P})-2*(${m}))/10`);
      const S = norm(inter(inter(out.S, up), [pc(0, false, null, false)]));
      if (!oneInt(S)) return null;
      return betweenAns(`직사각형 모양의 창 A, B를 만들려고 한다. A의 가로의 길이와 B의 세로의 길이는 ${X} m로 같고, A의 세로의 길이는 가로의 길이의 2배, B의 가로의 길이는 세로의 길이보다 ${m} m 더 길다. 두 창의 둘레의 길이의 합이 ${P} m 이하이고 넓이의 합이 ${Sa} m² 이상일 때, ${X}의 값의 범위를 구하시오.`, S, {
        signed: false,
        explain: `둘레의 합은 ${nb(`6${X} + (4${X} + ${2 * m}) = 10${X} + ${2 * m} ≤ ${P}`)}에서 ${nb(`${X} ≤ ${u}`)}이다. 넓이의 합은 ${nb(`2${X}${sup(2)} + ${X}(${X} + ${m}) = 3${X}${sup(2)} + ${m}${X} ≥ ${Sa}`)}에서 ${X} &gt; 0이므로 ${nb(`${X} ≥ ${r}`)}이다. 따라서 ${setH(S)}이다.`,
        facts: { rule: 'use2-rect-1', derived: out.nums.concat([10, 6]) }
      });
    }, { count: 2 }),
    T('use2-path', '길을 낸 땅의 넓이 조건', '①52', (d, n) => {
      const W = 5 * d.int(4, 9), H = 5 * d.int(3, W / 5 - 1), mn = Math.min(W, H);
      if (n === 0) {
        // 길의 넓이 Wx + Hx − x² 가 S1 이상 S2 이하
        const a1 = d.int(2, Math.floor(mn / 2) - 2), b1 = d.int(a1 + 1, Math.floor(mn / 2)), S1 = a1 * (W + H - a1), S2 = b1 * (W + H - b1);
        const o1 = quadSet(Q(1), Q(-(W + H)), Q(S1), '<='), o2 = quadSet(Q(1), Q(-(W + H)), Q(S2), '>='), S = norm(inter(inter(o1.S, o2.S), [pc(0, false, mn, false)]));
        verify(S, (x) => { const area = qsub(qmul(Q(W + H), x), qmul(x, x)); return qcmp(x, Q(0)) > 0 && qcmp(x, Q(mn)) < 0 && qcmp(area, Q(S1)) >= 0 && qcmp(area, Q(S2)) <= 0; });
        if (!oneInt(S)) return null;
        return betweenAns(`그림과 같이 가로, 세로의 길이가 각각 ${W} m, ${H} m인 직사각형 모양의 땅에 폭이 ${X} m로 일정한 길을 만들려고 한다. 길의 넓이가 ${S1} m² 이상 ${S2} m² 이하가 되도록 하는 ${X}의 값의 범위를 구하시오.`, S, {
          signed: false, figure: pathFig(W, H, 'm'),
          explain: `길의 넓이는 ${nb(`(${W}${X} + ${H}${X} ${MINUS} ${X}${sup(2)}) m²`)}이다(겹치는 정사각형 하나를 뺀다). ${ej(nb(`${S1} ≤ ${W + H}${X} ${MINUS} ${X}${sup(2)} ≤ ${S2}`), '을/를')} 풀면 ${nb(`${a1} ≤ ${X} ≤ ${b1}`)} 또는 ${nb(`${W + H - b1} ≤ ${X} ≤ ${W + H - a1}`)}이고, ${nb(`0 &lt; ${X} &lt; ${mn}`)}이므로 ${setH(S)}이다.`,
          facts: { rule: 'use2-path-0', derived: o1.nums.concat(o2.nums) }
        });
      }
      // 길을 뺀 나머지 넓이 (W − x)(H − x) 가 Sr 이상
      const c1 = d.int(2, Math.floor(mn / 2)), Sr = (W - c1) * (H - c1), out = quadSet(Q(1), Q(-(W + H)), Q(W * H - Sr), '>=');
      const S = norm(inter(out.S, [pc(0, false, mn, false, '0')]));
      verify(S, (x) => qcmp(x, Q(0)) > 0 && qcmp(x, Q(mn)) < 0 && qcmp(qmul(qsub(Q(W), x), qsub(Q(H), x)), Q(Sr)) >= 0);
      if (!oneInt(S)) return null;
      return betweenAns(`그림과 같이 가로, 세로의 길이가 각각 ${W} m, ${H} m인 직사각형 모양의 꽃밭에 폭이 ${X} m로 일정한 길을 만들려고 한다. 길을 뺀 꽃밭의 넓이가 ${Sr} m² 이상이 되도록 하는 ${X}의 값의 범위를 구하시오.`, S, {
        signed: false, figure: pathFig(W, H, 'm'),
        explain: `길을 뺀 꽃밭은 길을 한쪽으로 모으면 가로 ${nb(`(${W} ${MINUS} ${X})`)} m, 세로 ${nb(`(${H} ${MINUS} ${X})`)} m인 직사각형과 넓이가 같다. ${nb(`(${W} ${MINUS} ${X})(${H} ${MINUS} ${X}) ≥ ${Sr}`)}에서 ${nb(`${X} ≤ ${c1}`)} 또는 ${nb(`${X} ≥ ${W + H - c1}`)}이고, ${nb(`0 &lt; ${X} &lt; ${mn}`)}이므로 ${setH(S)}이다.`,
        facts: { rule: 'use2-path-1', derived: out.nums.concat(numsOf([W * H - Sr, W + H])) }
      });
    }, { count: 2 }),
    T('use2-price', '값을 내리면 판매량이 느는 문제', '①53', (d) => {
      const P = 100 * d.int(2, 9), k = d.int(1, 5), x1 = 10 * d.int(1, 4), x2 = x1 + 10 * d.int(1, 5);
      if (x2 >= P / 2) return null;
      const Nn = k * (P - x1 - x2), R0 = P * Nn + k * x1 * x2;
      if (Nn <= 0) return null;
      const out = quadSet(Q(-k), Q(P * k - Nn), Q(P * Nn - R0), '>='), S = norm(inter(out.S, [pc(0, true, P, false)]));
      verify(S, (x) => qcmp(x, Q(0)) >= 0 && qcmp(x, Q(P)) < 0 && qcmp(qmul(qsub(Q(P), x), qadd(Q(Nn), qmul(Q(k), x))), Q(R0)) >= 0);
      if (!oneInt(S)) return null;
      return betweenAns(`어느 가게에서 빵 한 개를 ${P}원에 팔면 하루에 ${Nn}개가 팔린다. 빵 한 개의 값을 ${X}원 내리면 하루 판매량이 ${k === 1 ? '' : k}${X}개 늘어난다고 할 때, 하루 판매액이 ${R0}원 이상이 되게 하는 ${X}의 값의 범위를 구하시오.`, S, {
        signed: false,
        explain: `값을 ${X}원 내리면 하루 판매액은 ${nb(`(${P} ${MINUS} ${X})(${Nn} + ${k === 1 ? '' : k}${X})`)}원이다. ${nb(`(${P} ${MINUS} ${X})(${Nn} + ${k === 1 ? '' : k}${X}) ≥ ${R0}`)}을 정리하면 ${nb(`${X}${sup(2)} ${MINUS} ${x1 + x2}${X} + ${x1 * x2} ≤ 0`)}, 곧 ${nb(`(${X} ${MINUS} ${x1})(${X} ${MINUS} ${x2}) ≤ 0`)}이므로 ${setH(S)}이다.`,
        facts: { rule: 'use2-price', derived: out.nums }
      });
    }),
    T('use2-obtuse', '둔각삼각형이 될 조건', '①54', (d, n) => {
      if (n === 0) {
        // 세 변 x, x + d1, x + d2 (d1 < d2)
        const [d1, d2] = d.until(() => { const u = d.int(1, 9), w = d.int(u + 1, u + 6); return [u, w]; }, ([u, w]) => Number.isInteger(Math.sqrt((w - u) ** 2 + w * w - u * u)));
        const sq = Math.sqrt((d2 - d1) ** 2 + d2 * d2 - d1 * d1), hi = d2 - d1 + sq, lo = d2 - d1;
        const tri = linSet(Q(1), Q(d1 - d2), '>', `(${d2})-(${d1})`), obt = quadSet(Q(1), Q(-2 * (d2 - d1)), Q(d1 * d1 - d2 * d2), '<'), S = norm(inter(tri, obt.S));
        verify(S, (x) => { if (qcmp(x, Q(0)) <= 0) return false; const a = x, b = qadd(x, Q(d1)), c = qadd(x, Q(d2)); return qcmp(qadd(a, b), c) > 0 && qcmp(qmul(c, c), qadd(qmul(a, a), qmul(b, b))) > 0; });
        if (!oneInt(S) || qcmp(S[0].lo, Q(lo)) !== 0 || qcmp(S[0].hi, Q(hi)) !== 0) return null;
        return betweenAns(`세 변의 길이가 각각 ${X}, ${nb(`${X} + ${d1}`)}, ${nb(`${X} + ${d2}`)}인 삼각형이 둔각삼각형이 되도록 하는 ${X}의 값의 범위를 구하시오.`, S, {
          signed: false,
          explain: `가장 긴 변은 ${nb(`${X} + ${d2}`)}이다. 삼각형이 되려면 ${nb(`${X} + (${X} + ${d1}) &gt; ${X} + ${d2}`)}, 곧 ${nb(`${X} &gt; ${lo}`)}이고, 둔각삼각형이려면 가장 긴 변의 제곱이 나머지 두 변의 제곱의 합보다 커야 하므로 ${nb(`(${X} + ${d2})${sup(2)} &gt; ${X}${sup(2)} + (${X} + ${d1})${sup(2)}`)}, 곧 ${nb(`${X}${sup(2)} ${MINUS} ${2 * (d2 - d1)}${X} ${MINUS} ${d2 * d2 - d1 * d1} &lt; 0`)}에서 ${nb(`${iq(lo - sq)} &lt; ${X} &lt; ${hi}`)}이다. 따라서 ${setH(S)}이다.`,
          facts: { rule: 'use2-obtuse-0', derived: obt.nums }
        });
      }
      // 세 변 kx − m, x, kx + m (x > m/k)
      const k = d.int(2, 3), m = d.int(1, 4), S = norm([pc(2 * m, false, 4 * k * m, false, `2*(${m})`, `4*(${k})*(${m})`)]);
      verify(S, (x) => { if (qcmp(x, Q(m, k)) <= 0) return false; const a = qsub(qmul(Q(k), x), Q(m)), b = x, c = qadd(qmul(Q(k), x), Q(m)); return qcmp(qadd(a, b), c) > 0 && qcmp(qmul(c, c), qadd(qmul(a, a), qmul(b, b))) > 0; });
      return betweenAns(`${nb(`${X} &gt; ${tx(Q(m, k))}`)}인 실수 ${X}에 대하여 세 수 ${nb(`${k}${X} ${MINUS} ${m}`)}, ${X}, ${ej(nb(`${k}${X} + ${m}`), '이/가')} 둔각삼각형의 세 변의 길이가 되도록 하는 ${X}의 값의 범위를 구하시오.`, S, {
        signed: false,
        explain: `가장 긴 변은 ${nb(`${k}${X} + ${m}`)}이다. 삼각형이 되려면 ${nb(`(${k}${X} ${MINUS} ${m}) + ${X} &gt; ${k}${X} + ${m}`)}, 곧 ${nb(`${X} &gt; ${2 * m}`)}이다. 둔각삼각형이려면 ${nb(`(${k}${X} + ${m})${sup(2)} &gt; (${k}${X} ${MINUS} ${m})${sup(2)} + ${X}${sup(2)}`)}, 곧 ${nb(`${X}${sup(2)} &lt; ${4 * k * m}${X}`)}이므로 ${nb(`0 &lt; ${X} &lt; ${4 * k * m}`)}이다. 따라서 ${setH(S)}이다.`,
        facts: { rule: 'use2-obtuse-1', derived: [4] }
      });
    }, { count: 2 }),
    T('use2-two-d', '두 이차방정식이 모두 실근(허근)을 가질 조건', '①55', (d, n) => {
      // 이차방정식 x² + (b1·a + b0)x + (c2·a² + c1·a + c0) = 0 두 개. 판별식은 a 에 대한 이차식이다.
      const mk = (wantReal) => {
        const c2 = wantReal ? 1 : d.pick([0, 0, 1]), b1 = wantReal ? d.pick([-1, 0, 1]) : (c2 ? d.pick([-2, 2]) : d.pick([-2, -1, 1, 2])), b0 = d.int(-4, 4), c1 = d.int(-4, 4), c0 = d.int(-6, 6);
        const al = b1 * b1 - 4 * c2, be = 2 * b1 * b0 - 4 * c1, ga = b0 * b0 - 4 * c0;
        if (al === 0 || (wantReal ? al > 0 : al < 0)) return null;
        const out = inA(al, be, ga, wantReal ? '>' : '<');
        if (!out || !out.S.length || isAll(out.S)) return null;
        const coefB = b1 === 0 ? [tm(b0, 'x')] : b0 === 0 ? [tm(b1, 'ax')] : b1 < 0 ? [tg(-1, ts([-b1, 'a'], [-b0, '']), 'x', true)] : [tg(1, ts([b1, 'a'], [b0, '']), 'x', true)];
        const E = [tm(1, 'X')].concat(coefB.filter((t) => !(t.k === 'm' && t.c.p === 0)), ts([c2, 'A'], [c1, 'a'], [c0, '']).filter((t) => t.c.p !== 0));
        return { E, out, al, be, ga };
      };
      const real = n === 0, e1 = mk(real), e2 = mk(real);
      if (!e1 || !e2) return null;
      const S = norm(inter(e1.out.S, e2.out.S));
      if (!oneInt(S) || eqSet(S, norm(e1.out.S)) || eqSet(S, norm(e2.out.S))) return null;
      for (let av = fl(S[0].lo) - 2; av <= fl(S[0].hi) + 2; av += 1) {
        const ok = [e1, e2].every((e) => { const g = gq(e.E, { a: Q(av) }), Dv = qsub(qmul(g.b, g.b), qmul(Q(4), qmul(g.a, g.c))); return real ? Dv.p > 0 : Dv.p < 0; });
        if (ok !== has(S, Q(av))) throw new Error('판별식 조건이 어긋났다');
      }
      const eq = (e) => nb(`${sideH(e.E)} = 0`), Dh = (e) => sideH(qx(e.al, e.be, e.ga)).replace(/<sup>2<\/sup>/, '<sup>2</sup>').replace(/x/g, 'a');
      return betweenAns(`${X}에 대한 두 이차방정식 ${eq(e1)}, ${eq(e2)}${tail(0, '이/가')} 모두 ${real ? '서로 다른 두 실근' : '허근'}을 갖도록 하는 실수 ${VA}의 값의 범위를 구하시오.`, S, {
        name: VA,
        explain: `두 판별식이 모두 ${real ? '양수' : '음수'}이어야 한다. 첫째 판별식은 ${nb(`${Dh(e1)} ${real ? '&gt;' : '&lt;'} 0`)}에서 ${setH(norm(e1.out.S), VA)}, 둘째 판별식은 ${nb(`${Dh(e2)} ${real ? '&gt;' : '&lt;'} 0`)}에서 ${setH(norm(e2.out.S), VA)}이므로 공통부분은 ${setH(S, VA)}이다.`,
        facts: { rule: 'use2-two-d-' + n, derived: e1.out.nums.concat(e2.out.nums) }
      });
    }, { count: 2 })
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
