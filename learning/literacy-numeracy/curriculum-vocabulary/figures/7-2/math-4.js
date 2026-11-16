// 수학 7-2(중학교 1학년 2학기) 4단원 입체도형: 낱말 도식
// 다면체는 꼭짓점 [x, y, z](y 위, z 보는 쪽)를 조금 돌리고 내려다본 평행 투영으로 그린다(보이지 않는 모서리는 점선).
// 원기둥·원뿔·구는 세로 축과 납작한 타원(세로 반지름 = 반지름 × 0.3)으로 그린다. 뒤쪽 반 타원은 점선.
// 회전체의 한 바퀴는 평면도형을 축에서 가로로 줄였다 뒤집는 transform 으로, 자르기는 평면을 옮기고 위 조각을 들어 올려 보인다.
(function (root) {
  'use strict';
  const { C, svg, text, put } = root.FigureKit;
  const f = (n) => +(+n).toFixed(1);
  const P = (p) => `${f(p[0])} ${f(p[1])}`;
  const D = Math.PI / 180;
  // 화면 위 각: 오른쪽이 0°, 시계 반대 방향으로 커진다.
  const pol = (O, r, a) => [O[0] + r * Math.cos(a * D), O[1] - r * Math.sin(a * D)];
  const add = (a, b) => [a[0] + b[0], a[1] + b[1]];
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1]];
  const mul = (a, k) => [a[0] * k, a[1] * k];
  const unit = (a) => { const l = Math.hypot(a[0], a[1]); return [a[0] / l, a[1] / l]; };
  const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const st = (d = 0, more = '') => (d || more ? `style="${d ? `animation-delay:${d}s;transition-delay:${d}s;` : ''}${more}"` : '');
  const g = (cls, inner, d = 0, more = '') => `<g class="${cls}" ${st(d, more)}>${inner}</g>`;

  // sN 나타나기, pN 튀어나오기, dN 선 그리기(.draw), rN 퍼지는 고리, kN 깜빡이며 남기, gN 두 번 반짝, xN 흐려지기
  const motion = (id) => {
    let css = `
    .sc-${id} :is(.s1,.s2,.s3,.s4,.s5,.p1,.p2,.p3,.p4,.p5,.k1,.k2,.k3,.k4,.k5) { opacity: 0; }
    .sc-${id} :is(.p1,.p2,.p3,.p4,.p5,.ring) { transform-box: fill-box; transform-origin: center; }
    .sc-${id} .draw { stroke-dasharray: 1 1; stroke-dashoffset: 1; transition: stroke-dashoffset .7s ease-in-out; }
    .sc-${id} .ring { opacity: 0; }
    @keyframes ${id}-fin { from { opacity: 0; } to { opacity: 1; } }
    @keyframes ${id}-pop { 0% { opacity: 0; transform: scale(0); } 70% { opacity: 1; transform: scale(1.2); } 100% { opacity: 1; transform: scale(1); } }
    @keyframes ${id}-ring { 0% { opacity: .9; transform: scale(1); } 100% { opacity: 0; transform: scale(2.3); } }
    @keyframes ${id}-blink { 0% { opacity: 0; } 20% { opacity: 1; } 40% { opacity: .15; } 60% { opacity: 1; } 80% { opacity: .15; } 100% { opacity: 1; } }
    @keyframes ${id}-glow { 0%, 100% { opacity: 1; } 25%, 75% { opacity: .2; } }`;
    for (let n = 1; n <= 5; n++) css += `
    .on${n} .sc-${id} .s${n} { animation: ${id}-fin .45s ease-out both; }
    .on${n} .sc-${id} .p${n} { animation: ${id}-pop .5s ease-out both; }
    .on${n} .sc-${id} .d${n} { stroke-dashoffset: 0; }
    .on${n} .sc-${id} .r${n} { animation: ${id}-ring 1.1s ease-out 2 both; }
    .on${n} .sc-${id} .k${n} { animation: ${id}-blink 1.6s ease-in-out both; }
    .on${n} .sc-${id} .g${n} { animation: ${id}-glow 1.2s ease-in-out 2; }
    .on${n} .sc-${id} .x${n} { opacity: .22; transition: opacity .6s ease; }`;
    return css;
  };

  const line = (p, q, { c = C.ink, w = 4, cls = '', d = 0, dash = '' } = {}) => {
    const draw = /(^|\s)d\d(\s|$)/.test(cls);
    return `<path class="${draw ? 'draw ' : ''}${cls}" ${draw ? 'pathLength="1"' : ''} ${st(d)} d="M${P(p)} L${P(q)}" stroke="${c}" stroke-width="${w}" stroke-linecap="round" fill="none"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`;
  };
  const pathD = (dd, { c = C.ink, w = 4, cls = '', d = 0, fill = 'none' } = {}) => {
    const draw = /(^|\s)d\d(\s|$)/.test(cls);
    return `<path class="${draw ? 'draw ' : ''}${cls}" ${draw ? 'pathLength="1"' : ''} ${st(d)} d="${dd}" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" fill="${fill}"/>`;
  };
  const dot = (p, { r = 7, c = C.ink, cls = '', d = 0 } = {}) => `<circle class="${cls}" ${st(d)} cx="${f(p[0])}" cy="${f(p[1])}" r="${r}" fill="${c}" stroke="white" stroke-width="2"/>`;
  const lab = (x, y, s, { c = C.ink, size = 22, anchor = 'middle', w = 700 } = {}) => text(f(x), f(y), s, { size, color: c, anchor, weight: w });
  const ring = (p, r, c, cls, d = 0) => `<circle class="ring ${cls}" ${st(d)} cx="${f(p[0])}" cy="${f(p[1])}" r="${r}" fill="none" stroke="${c}" stroke-width="4"/>`;
  const poly = (pts, attr) => `<polygon points="${pts.map(P).join(' ')}" ${attr}/>`;
  // 부채꼴(각 표시): O 에서 a1° 부터 a2° 까지 시계 반대 방향
  const sector = (O, r, a1, a2, fill, extra = '') => `<path ${extra} d="M${P(O)} L${P(pol(O, r, a1))} A${r} ${r} 0 ${a2 - a1 > 180 ? 1 : 0} 0 ${P(pol(O, r, a2))} Z" fill="${fill}" stroke="${C.ink}" stroke-width="1.5" stroke-linejoin="round"/>`;
  const rmark = (O, a, b, { s = 18, c = C.red } = {}) => {
    const u = mul(unit(sub(a, O)), s), v = mul(unit(sub(b, O)), s);
    return `<path d="M${P(add(O, u))} L${P(add(add(O, u), v))} L${P(add(O, v))}" stroke="${c}" stroke-width="3" fill="none"/>`;
  };
  const tick = (p, q, { n = 1, c = C.green, len = 11 } = {}) => {
    const m = mid(p, q), u = unit(sub(q, p)), v = [-u[1], u[0]];
    let s = '';
    for (let i = 0; i < n; i++) { const o = add(m, mul(u, (i - (n - 1) / 2) * (len > 8 ? 8 : 6))); s += line(add(o, mul(v, -len)), add(o, mul(v, len)), { c, w: 3 }); }
    return s;
  };
  const chev = (x, y, c = C.ink) => `<path d="M${x - 7} ${y - 8} L${x + 4} ${y} L${x - 7} ${y + 8}" stroke="${c}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`;
  const KEY = '7-2/수학/4/';
  const tint = (s, c, op) => s.replace(`fill="${c}"`, `fill="${c}" fill-opacity="${op}"`);

  // ── 입체 계산: 꼭짓점 [x, y, z](y 위, z 보는 쪽)를 yaw 만큼 돌리고 pitch 만큼 내려다본다 ──
  const sub3 = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const cross3 = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const dot3 = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const avg = (pts) => pts[0].map((_, k) => pts.reduce((s, p) => s + p[k], 0) / pts.length);
  const cam = (cx, cy, { s = 1, yaw = -30, pitch = 22 } = {}) => ({ cx, cy, s, cw: Math.cos(yaw * D), sw: Math.sin(yaw * D), cp: Math.cos(pitch * D), sp: Math.sin(pitch * D) });
  const xf = (c, p) => { const x1 = p[0] * c.cw + p[2] * c.sw, z1 = -p[0] * c.sw + p[2] * c.cw; return [x1, p[1] * c.cp - z1 * c.sp, p[1] * c.sp + z1 * c.cp]; };
  const at = (c, p) => { const q = xf(c, p); return [c.cx + q[0] * c.s, c.cy - q[1] * c.s]; };
  function proj(sol, c) {
    const Q = sol.V.map((p) => xf(c, p)), Pt = sol.V.map((p) => at(c, p)), cen = avg(Q);
    const vis = sol.F.map((face) => {
      let n = cross3(sub3(Q[face[1]], Q[face[0]]), sub3(Q[face[2]], Q[face[0]]));
      if (dot3(n, sub3(avg(face.map((i) => Q[i])), cen)) < 0) n = n.map((v) => -v);
      return n[2] > 1e-6;
    });
    const map = new Map();
    sol.F.forEach((face, fi) => face.forEach((a, k) => {
      const b = face[(k + 1) % face.length], key = a < b ? `${a}-${b}` : `${b}-${a}`;
      if (!map.has(key)) map.set(key, { a, b, faces: [] });
      map.get(key).faces.push(fi);
    }));
    const edges = [...map.values()].map((e) => ({ ...e, hidden: e.faces.every((fi) => !vis[fi]) }));
    const depth = sol.F.map((face) => avg(face.map((i) => Q[i]))[2]);
    return { Q, P: Pt, vis, edges, depth };
  }
  const INK = `stroke="${C.ink}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"`;
  const DASH = `stroke="${C.ink}" stroke-width="2.2" stroke-dasharray="7 6" fill="none"`;
  const seg = (p, q, attr) => `<path d="M${P(p)} L${P(q)}" ${attr}/>`;
  // 겨냥도: 면(먼 것부터) → 점선 모서리 → 실선 모서리
  function solid(sol, c, { face = (fi, v) => (v ? `fill="white" fill-opacity=".7"` : ''), edge = (e) => (e.hidden ? DASH : INK), wrap = (fi, x) => x } = {}) {
    const pr = proj(sol, c);
    const order = sol.F.map((_, i) => i).sort((a, b) => pr.depth[a] - pr.depth[b]);
    let s = '';
    for (const fi of order) { const a = face(fi, pr.vis[fi], pr); if (a) s += wrap(fi, poly(sol.F[fi].map((i) => pr.P[i]), a), pr); }
    for (const e of pr.edges.filter((e) => e.hidden)) { const a = edge(e, pr); if (a) s += seg(pr.P[e.a], pr.P[e.b], a); }
    for (const e of pr.edges.filter((e) => !e.hidden)) { const a = edge(e, pr); if (a) s += seg(pr.P[e.a], pr.P[e.b], a); }
    return s;
  }
  function prism(base, H) {
    const n = base.length;
    const V = base.map(([x, z]) => [x, 0, z]).concat(base.map(([x, z]) => [x, H, z]));
    const F = [base.map((_, i) => i), base.map((_, i) => n + i)];
    for (let i = 0; i < n; i++) F.push([i, (i + 1) % n, n + (i + 1) % n, n + i]);
    return { V, F };
  }
  function pyramid(base, H, y0 = 0) {
    const n = base.length;
    const V = base.map(([x, z]) => [x, y0, z]).concat([[0, H, 0]]);
    const F = [base.map((_, i) => i)];
    for (let i = 0; i < n; i++) F.push([i, (i + 1) % n, n]);
    return { V, F };
  }
  function frustum(base, H, k) {
    const n = base.length;
    const V = base.map(([x, z]) => [x, 0, z]).concat(base.map(([x, z]) => [x * k, H, z * k]));
    const F = [base.map((_, i) => i), base.map((_, i) => n + i)];
    for (let i = 0; i < n; i++) F.push([i, (i + 1) % n, n + (i + 1) % n, n + i]);
    return { V, F };
  }
  const square = (h) => [[-h, h], [h, h], [h, -h], [-h, -h]];
  // ── 굽은 입체: 세로 축 X, 가로 원은 납작한 타원(ry = r × KF) ──
  const KF = .3;
  const ellFront = (X, Y, r, ry) => `M${f(X - r)} ${f(Y)} A${f(r)} ${f(ry)} 0 0 0 ${f(X + r)} ${f(Y)}`;
  const ellBack = (X, Y, r, ry) => `M${f(X - r)} ${f(Y)} A${f(r)} ${f(ry)} 0 0 1 ${f(X + r)} ${f(Y)}`;
  const ell = (X, Y, r, ry, attr) => `<ellipse cx="${f(X)}" cy="${f(Y)}" rx="${f(r)}" ry="${f(ry)}" ${attr}/>`;
  const sw = (c = C.ink, w = 3) => `stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"`;
  const pth = (d, attr) => `<path d="${d}" ${attr}/>`;
  const cylinder = (X, Yt, Yb, r, { side = C.sky, top = C.mint, op = .8, c = C.ink } = {}) => {
    const ry = r * KF;
    return pth(`M${f(X - r)} ${Yt} L${f(X - r)} ${Yb} A${f(r)} ${f(ry)} 0 0 0 ${f(X + r)} ${Yb} L${f(X + r)} ${Yt} A${f(r)} ${f(ry)} 0 0 1 ${f(X - r)} ${Yt} Z`, `fill="${side}" fill-opacity="${op}"`)
      + pth(ellBack(X, Yb, r, ry), `${sw(c, 2.2)} stroke-dasharray="7 6" fill="none"`) + pth(ellFront(X, Yb, r, ry), `${sw(c)} fill="none"`)
      + seg([X - r, Yt], [X - r, Yb], sw(c)) + seg([X + r, Yt], [X + r, Yb], sw(c))
      + ell(X, Yt, r, ry, `fill="${top}" ${sw(c)}`);
  };
  const cone = (X, Ya, Yb, r, { side = C.peach, op = .8, c = C.ink } = {}) => {
    const ry = r * KF;
    return pth(`M${X} ${Ya} L${f(X - r)} ${Yb} A${f(r)} ${f(ry)} 0 0 0 ${f(X + r)} ${Yb} Z`, `fill="${side}" fill-opacity="${op}"`)
      + pth(ellBack(X, Yb, r, ry), `${sw(c, 2.2)} stroke-dasharray="7 6" fill="none"`) + pth(ellFront(X, Yb, r, ry), `${sw(c)} fill="none"`)
      + seg([X, Ya], [X - r, Yb], sw(c)) + seg([X, Ya], [X + r, Yb], sw(c));
  };
  const frust = (X, Yt, rt, Yb, rb, { side = C.peach, top = C.mint, op = .8, c = C.ink } = {}) => {
    const yt = rt * KF, yb = rb * KF;
    return pth(`M${f(X - rt)} ${Yt} L${f(X - rb)} ${Yb} A${f(rb)} ${f(yb)} 0 0 0 ${f(X + rb)} ${Yb} L${f(X + rt)} ${Yt} A${f(rt)} ${f(yt)} 0 0 1 ${f(X - rt)} ${Yt} Z`, `fill="${side}" fill-opacity="${op}"`)
      + pth(ellBack(X, Yb, rb, yb), `${sw(c, 2.2)} stroke-dasharray="7 6" fill="none"`) + pth(ellFront(X, Yb, rb, yb), `${sw(c)} fill="none"`)
      + seg([X - rt, Yt], [X - rb, Yb], sw(c)) + seg([X + rt, Yt], [X + rb, Yb], sw(c))
      + ell(X, Yt, rt, yt, `fill="${top}" ${sw(c)}`);
  };
  const sphere = (X, Y, r, { fill = C.lilac, op = .8, c = C.ink } = {}) => {
    const ry = r * KF;
    return `<circle cx="${X}" cy="${Y}" r="${r}" fill="${fill}" fill-opacity="${op}" ${sw(c)}/>`
      + pth(ellBack(X, Y, r, ry), `${sw(c, 2)} stroke-dasharray="7 6" fill="none"`) + pth(ellFront(X, Y, r, ry), `${sw(c, 2.5)} fill="none"`);
  };
  // 축 X 를 중심으로 평면도형이 한 바퀴 도는 움직임(가로로 줄었다 뒤집혔다 돌아옴)
  const spinCss = (id, n, cls, X, Y, wait = .2, times = 2) => `
      .sc-${id} .${cls} { transform-box: view-box; transform-origin: ${X}px ${Y}px; }
      .on${n} .sc-${id} .${cls} { animation: ${id}-spin .9s linear ${wait}s ${times}; }`;
  const spinKf = (id) => `@keyframes ${id}-spin { 0% { transform: scaleX(1); } 25% { transform: scaleX(0); } 50% { transform: scaleX(-1); } 75% { transform: scaleX(0); } 100% { transform: scaleX(1); } }`;

  // 다면체: 정육면체·삼각기둥·사각뿔 → 면을 하나씩 칠해 세면 6개, 5개, 5개 → 다각형인 면으로만 둘러싸인 다면체
  {
    const id = 't72-m4-damyeon';
    const TRI = [[-60, 40], [60, 40], [0, -62]];
    const items = [
      { c: cam(110, 238), sol: prism(square(52), 104), n: 6, name: '육면체' },
      { c: cam(320, 238), sol: prism(TRI, 104), n: 5, name: '오면체' },
      { c: cam(530, 238), sol: pyramid(square(58), 130), n: 5, name: '오면체' }
    ];
    const fills = [C.peach, C.sky, C.mint, C.lilac, C.yellow, C.peach];
    let body = '';
    items.forEach((it, j) => {
      body += g('s1', solid(it.sol, it.c, { face: (fi, v) => (v ? `fill="white"` : '') }), .2 + j * .3);
      const pr = proj(it.sol, it.c);
      const vis = it.sol.F.map((_, fi) => fi).filter((fi) => pr.vis[fi]).sort((a, b) => pr.depth[a] - pr.depth[b]);
      body += vis.map((fi, k) => g('s2', poly(it.sol.F[fi].map((i) => pr.P[i]), `fill="${fills[(fi + j) % 6]}" fill-opacity=".9" ${INK.replace('fill="none"', '')}`), .2 + j * .6 + k * .15)).join('');
      body += g('b3', g('g3', vis.map((fi) => poly(it.sol.F[fi].map((i) => pr.P[i]), `fill="${C.orange}" fill-opacity=".25" ${INK.replace('fill="none"', '')}`)).join(''), .1));
      body += g('s2', lab(it.c.cx, 300, `면 ${it.n}개`, { size: 22 }), .5 + j * .6) + g('s2', lab(it.c.cx, 332, it.name, { c: C.green, size: 22 }), .7 + j * .6);
    });
    body += g('p3', lab(320, 52, '다면체', { c: C.orange, size: 32 }), .5);
    put(KEY + '다면체', svg(id, body, motion(id)));
  }

  // 각뿔대: 사각뿔 → 밑면에 평행한 평면이 내려와 자름 → 위의 작은 각뿔을 들어내면 남은 아랫부분이 사각뿔대
  {
    const id = 't72-m4-gakppuldae';
    const c = cam(250, 300), H = 210, h = 105, B = square(92);
    const full = pyramid(B, H), low = frustum(B, h, .5), top = pyramid(B.map(([x, z]) => [x * .5, z * .5]), H, h);
    const plane = square(165).map(([x, z]) => at(c, [x, h, z]));
    const lift = 70;
    const tp = proj(top, c);
    const cut = tp.edges.filter((e) => e.faces.includes(0)).map((e) => seg(tp.P[e.a], tp.P[e.b], e.faces.every((fi) => !tp.vis[fi]) ? `stroke="${C.red}" stroke-width="3" stroke-dasharray="7 6" fill="none"` : `stroke="${C.red}" stroke-width="5" stroke-linecap="round" fill="none"`)).join('');
    const body = g('h3', g('s1', solid(full, c, { face: (fi, v) => (v ? `fill="${fi ? C.peach : C.mint}" fill-opacity=".8"` : '') }), .2))
      + g('h3', `<g class="pl">${poly(plane, `fill="${C.sky}" fill-opacity=".55" stroke="${C.blue}" stroke-width="3" stroke-linejoin="round"`)}</g>`)
      + g('h3', g('s2', cut, 1.4))
      + g('b3', solid(low, c, { face: (fi, v) => (v ? `fill="${fi < 2 ? C.mint : C.peach}" fill-opacity=".9"` : '') }))
      + g('b3', g('s3', solid(low, c, { face: (fi, v) => (v && fi === 1 ? `fill="${C.green}" fill-opacity=".35"` : '') }), .9))
      + `<g class="up">${g('b3', solid(top, c, { face: (fi, v) => (v ? `fill="white" fill-opacity=".8"` : '') }))}</g>`
      + g('b3', g('s3', lab(318, 84, '사각뿔', { c: C.muted, size: 22, anchor: 'start' }), 1.2))
      + g('p3', lab(500, 210, '사각뿔대', { c: C.green, size: 30 }), 1.3);
    put(KEY + '각뿔대', svg(id, body, motion(id) + `
      .sc-${id} .pl { opacity: 0; transform: translateY(-140px); }
      .on2 .sc-${id} .pl { opacity: 1; transform: none; transition: opacity .3s ease .2s, transform 1.2s ease-in-out .2s; }
      .sc-${id} .up { transition: transform 1s ease-in-out .3s; }
      .on3 .sc-${id} .up { transform: translateY(-${lift}px); }`));
  }

  // 정다면체: 다섯 가지 → 면은 모두 합동인 정다각형 → 꼭짓점마다 모인 면의 개수가 같음
  {
    const id = 't72-m4-jeongdamyeon';
    const phi = (1 + Math.sqrt(5)) / 2;
    const scaleTo = (V, R) => { const m = Math.max(...V.map((p) => Math.hypot(...p))); return V.map((p) => p.map((v) => v * R / m)); };
    const tetV = [[0, 1, 0]].concat([90, 210, 330].map((a) => [Math.sqrt(8) / 3 * Math.cos(a * D), -1 / 3, Math.sqrt(8) / 3 * Math.sin(a * D)]));
    const tet = { V: tetV, F: [[0, 1, 2], [0, 1, 3], [0, 2, 3], [1, 2, 3]] };
    const cubV = [[-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1], [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]];
    const cub = { V: cubV, F: [[0, 1, 2, 3], [4, 5, 6, 7], [0, 1, 5, 4], [1, 2, 6, 5], [2, 3, 7, 6], [3, 0, 4, 7]] };
    const octV = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]];
    const octF = []; for (const a of [0, 1]) for (const b of [2, 3]) for (const cc of [4, 5]) octF.push([a, b, cc]);
    const oct = { V: octV, F: octF };
    const icoV = [];
    for (const s1 of [-1, 1]) for (const s2 of [-1, 1]) { icoV.push([0, s1, s2 * phi]); icoV.push([s1, s2 * phi, 0]); icoV.push([s2 * phi, 0, s1]); }
    const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
    const icoF = [];
    for (let i = 0; i < 12; i++) for (let j = i + 1; j < 12; j++) for (let k = j + 1; k < 12; k++)
      if ([dist(icoV[i], icoV[j]), dist(icoV[j], icoV[k]), dist(icoV[i], icoV[k])].every((d) => Math.abs(d - 2) < 1e-6)) icoF.push([i, j, k]);
    const ico = { V: icoV, F: icoF };
    // 정십이면체: 정이십면체 면의 가운데 점이 꼭짓점, 정이십면체 꼭짓점 하나를 둘러싼 다섯 면이 오각형 하나
    const dodV = icoF.map((fc) => avg(fc.map((i) => icoV[i])));
    const dodF = icoV.map((v, vi) => {
      const around = icoF.map((fc, fi) => (fc.includes(vi) ? fi : -1)).filter((fi) => fi >= 0);
      const n = v.map((x) => x / Math.hypot(...v)), ref = sub3(dodV[around[0]], v), e1 = ref.map((x) => x / Math.hypot(...ref)), e2 = cross3(n, e1);
      return around.sort((a, b) => { const pa = sub3(dodV[a], v), pb = sub3(dodV[b], v); return Math.atan2(dot3(pa, e2), dot3(pa, e1)) - Math.atan2(dot3(pb, e2), dot3(pb, e1)); });
    });
    const dod = { V: dodV, F: dodF };
    const list = [
      { sol: tet, name: '정사면체', face: '정삼각형', R: 58, yaw: 20, pitch: 16 },
      { sol: cub, name: '정육면체', face: '정사각형', R: 58, yaw: -30, pitch: 22 },
      { sol: oct, name: '정팔면체', face: '정삼각형', R: 60, yaw: -22, pitch: 16 },
      { sol: dod, name: '정십이면체', face: '정오각형', R: 58, yaw: -18, pitch: 20 },
      { sol: ico, name: '정이십면체', face: '정삼각형', R: 58, yaw: -18, pitch: 20 }
    ];
    const xs = [66, 192, 320, 448, 574];
    let body = '';
    list.forEach((it, j) => {
      const sol = { V: scaleTo(it.sol.V, it.R), F: it.sol.F };
      const c = cam(xs[j], 156, { yaw: it.yaw, pitch: it.pitch });
      const pr = proj(sol, c);
      const visF = sol.F.map((_, fi) => fi).filter((fi) => pr.vis[fi]);
      const front = visF.reduce((a, b) => (pr.depth[a] > pr.depth[b] ? a : b));
      // 가장 앞 꼭짓점과 그 둘레 면
      const vi = sol.V.map((_, i) => i).reduce((a, b) => (pr.Q[a][2] > pr.Q[b][2] ? a : b));
      const ring = sol.F.map((fc, fi) => (fc.includes(vi) ? fi : -1)).filter((fi) => fi >= 0);
      const facePoly = (fi, attr) => poly(sol.F[fi].map((i) => pr.P[i]), attr);
      body += g('p1', visF.map((fi) => facePoly(fi, `fill="${C.sky}" fill-opacity="${.45 + .4 * Math.max(0, pr.depth[fi]) / it.R}" stroke="${C.ink}" stroke-width="2.5" stroke-linejoin="round"`)).join(''), .1 + j * .3);
      body += g('s1', lab(xs[j], 262, it.name, { size: 19 }), .3 + j * .3);
      body += g('b2', g('k2', facePoly(front, `fill="${C.orange}" fill-opacity=".75" stroke="${C.ink}" stroke-width="2.5" stroke-linejoin="round"`), .1 + j * .2));
      body += g('b2', g('s2', lab(xs[j], 292, it.face, { c: C.orange, size: 18 }), .3 + j * .2));
      body += g('b3', g('s3', ring.map((fi) => facePoly(fi, `fill="${C.red}" fill-opacity=".45" stroke="${C.ink}" stroke-width="2.5" stroke-linejoin="round"`)).join(''), .1 + j * .2));
      body += g('b3', g('p3', dot(pr.P[vi], { r: 6, c: C.red }), .3 + j * .2));
      body += g('b3', g('s3', lab(xs[j], 322, `면 ${ring.length}개`, { c: C.red, size: 18 }), .4 + j * .2));
    });
    body += g('p3', lab(320, 52, '정다면체 5가지', { c: C.green, size: 28 }), 1.4);
    put(KEY + '정다면체', svg(id, body, motion(id)));
  }

  // 회전체: 직각삼각형·직사각형·반원과 세로 축 → 축을 중심으로 한 바퀴 돌림 → 원뿔·원기둥·구, 모두 회전체
  {
    const id = 't72-m4-hoejeonche';
    const X = [110, 320, 530];
    const axis = (x) => seg([x, 64], [x, 312], `stroke="${C.red}" stroke-width="3" stroke-dasharray="9 7" fill="none"`);
    const shapes = [
      poly([[X[0], 100], [X[0], 280], [X[0] + 85, 280]], `fill="${C.peach}" stroke="${C.orange}" stroke-width="3.5" stroke-linejoin="round"`),
      `<rect x="${X[1]}" y="110" width="70" height="170" fill="${C.sky}" stroke="${C.blue}" stroke-width="3.5"/>`,
      pth(`M${X[2]} 102 A88 88 0 0 1 ${X[2]} 278 Z`, `fill="${C.lilac}" stroke="${C.purple}" stroke-width="3.5" stroke-linejoin="round"`)
    ];
    const solids = [cone(X[0], 100, 280, 85, { op: .45 }), cylinder(X[1], 110, 280, 70, { op: .45, top: C.sky }), sphere(X[2], 190, 88, { op: .4 })];
    const names = ['원뿔', '원기둥', '구'];
    let body = '';
    X.forEach((x, j) => {
      body += g('b2', g('s2', solids[j], 1.8)) + g('s1', axis(x), .2);
      body += `<g class="sp${j}">${g('s1', shapes[j], .5 + j * .2)}</g>`;
      body += g('p3', lab(x, 340, names[j], { c: C.green, size: 24 }), .3 + j * .2);
    });
    body += g('p3', lab(320, 44, '회전체', { c: C.green, size: 30 }), 1);
    put(KEY + '회전체', svg(id, body, motion(id) + spinKf(id) + X.map((x, j) => spinCss(id, 2, `sp${j}`, x, 190)).join('') + `
      .on3 .sc-${id} [class^="sp"] { opacity: .55; transition: opacity .5s ease; }`));
  }

  // 회전축: 직각삼각형 → 세로 변을 따라 직선을 그음(회전축) → 그 직선을 축으로 한 바퀴 돌리면 원뿔
  {
    const id = 't72-m4-hoejeonchuk';
    const X = 250, Ya = 84, Yb = 290, r = 112;
    const body = `<g class="sp">${g('s1', poly([[X, Ya], [X, Yb], [X + r, Yb]], `fill="${C.peach}" stroke="${C.orange}" stroke-width="4" stroke-linejoin="round"`), .2)}</g>`
      + g('b3', g('s3', cone(X, Ya, Yb, r, { op: .4 }), 1.9))
      + pathD(`M${X} 36 L${X} 336`, { c: C.red, w: 4, cls: 'd2', d: .2 })
      + g('p2', lab(X + 18, 40, '회전축', { c: C.red, size: 24, anchor: 'start' }), 1)
      + g('b3', g('s3', pth(`M${X - 46} 60 A46 13 0 0 0 ${X + 46} 60`, `${sw(C.orange, 4)} fill="none"`) + `<path d="M${X + 34} 52 L${X + 48} 60 L${X + 34} 70" ${sw(C.orange, 4)} fill="none"/>`, .2))
      + g('p3', lab(480, 210, '원뿔', { c: C.green, size: 30 }), 2);
    put(KEY + '회전축', svg(id, body, motion(id) + spinKf(id) + spinCss(id, 3, 'sp', X, 190, .3)));
  }

  // 원뿔대: 원뿔 → 밑면에 평행한 평면이 내려와 자름 → 위의 작은 원뿔을 들어내면 남은 아랫부분이 원뿔대
  {
    const id = 't72-m4-wonppuldae';
    const X = 250, Ya = 70, Yb = 300, r = 124, Ym = 185, rm = 62, lift = 44;
    const plane = [[X - 210, Ym + 34], [X + 150, Ym + 34], [X + 210, Ym - 34], [X - 150, Ym - 34]];
    const body = g('h3', g('s1', cone(X, Ya, Yb, r), .2))
      + g('h3', `<g class="pl">${poly(plane, `fill="${C.sky}" fill-opacity=".55" stroke="${C.blue}" stroke-width="3" stroke-linejoin="round"`)}</g>`)
      + g('h3', g('s2', pth(ellBack(X, Ym, rm, rm * KF), `stroke="${C.red}" stroke-width="3" stroke-dasharray="7 6" fill="none"`) + pth(ellFront(X, Ym, rm, rm * KF), `stroke="${C.red}" stroke-width="5" fill="none"`), 1.4))
      + g('b3', frust(X, Ym, rm, Yb, r))
      + g('b3', g('s3', ell(X, Ym, rm, rm * KF, `fill="${C.green}" fill-opacity=".35" stroke="${C.green}" stroke-width="4"`), .9))
      + `<g class="up">${g('b3', cone(X, Ya, Ym, rm, { side: 'white' }))}</g>`
      + g('b3', g('s3', lab(X + 56, 92, '원뿔', { c: C.muted, size: 22, anchor: 'start' }), 1.2))
      + g('p3', lab(500, 250, '원뿔대', { c: C.green, size: 30 }), 1.3);
    put(KEY + '원뿔대', svg(id, body, motion(id) + `
      .sc-${id} .pl { opacity: 0; transform: translateY(-150px); }
      .on2 .sc-${id} .pl { opacity: 1; transform: none; transition: opacity .3s ease .2s, transform 1.2s ease-in-out .2s; }
      .sc-${id} .up { transition: transform 1s ease-in-out .3s; }
      .on3 .sc-${id} .up { transform: translateY(-${lift}px); }`));
  }

  // 단면: 원기둥 → 가로로 자르면 자른 면이 원 → 축을 지나게 세로로 자르면 직사각형
  {
    const id = 't72-m4-danmyeon';
    const X = 200, Yt = 80, Yb = 290, r = 96, Ym = 185;
    const body = cylinder(X, Yt, Yb, r, { op: .55 })
      + g('h3', line([X - r - 30, Ym], [X + r + 30, Ym], { c: C.red, w: 4, cls: 'd2', d: .1 }))
      + g('b2', g('h3', g('cx', ell(X, Ym, r, r * KF, `fill="${C.orange}" fill-opacity=".8" stroke="${C.orange}" stroke-width="3"`)), 0))
      + g('b2', g('s2', `<circle cx="470" cy="118" r="50" fill="${C.orange}" fill-opacity=".8" stroke="${C.orange}" stroke-width="3"/>` + lab(548, 126, '원', { c: C.orange, size: 26, anchor: 'start' }), 1.6))
      + line([X, Yt - 36], [X, Yb + 16], { c: C.red, w: 4, cls: 'd3', d: .1 })
      + g('b3', g('cy', `<rect x="${X - r}" y="${Yt}" width="${2 * r}" height="${Yb - Yt}" fill="${C.blue}" fill-opacity=".5" stroke="${C.blue}" stroke-width="3"/>`))
      + g('b3', g('s3', `<rect x="430" y="210" width="80" height="88" fill="${C.blue}" fill-opacity=".5" stroke="${C.blue}" stroke-width="3"/>` + lab(524, 262, '직사각형', { c: C.blue, size: 24, anchor: 'start' }), 1.6))
      + g('b2', g('p2', lab(X, 352, '단면', { c: C.green, size: 24 }), 1.4));
    put(KEY + '단면', svg(id, body, motion(id) + `
      .sc-${id} .cx { transform-box: fill-box; transform-origin: center; transform: scaleX(0); }
      .on2 .sc-${id} .cx { transform: none; transition: transform .8s ease-out .9s; }
      .sc-${id} .cy { transform-box: fill-box; transform-origin: center; transform: scaleY(0); }
      .on3 .sc-${id} .cy { transform: none; transition: transform .8s ease-out .9s; }`));
  }

  // 직육면체(가로 4 cm, 세로 3 cm, 높이 5 cm)와 그 전개도: 1 cm = 22
  const U = 22, PW = 4 * U, PD = 3 * U, PH = 5 * U;
  const box = prism([[-PW / 2, PD / 2], [PW / 2, PD / 2], [PW / 2, -PD / 2], [-PW / 2, -PD / 2]], PH);
  // 옆면 차례: 앞(가로 4), 오른쪽(3), 뒤(4), 왼쪽(3) — box.F 의 2·3·4·5 번
  const SIDE = [C.peach, C.sky, C.peach, C.sky];
  const X0 = 250, Y0 = 130, widths = [4, 3, 4, 3];
  const netSides = (attr = (k) => `fill="${SIDE[k]}" fill-opacity="${k < 2 ? .9 : .5}"`) => {
    let x = X0;
    return widths.map((w, k) => { const s = `<rect x="${x}" y="${Y0}" width="${w * U}" height="${PH}" ${attr(k)} stroke="${C.ink}" stroke-width="3"/>`; x += w * U; return { s, x0: x - w * U, w }; });
  };
  const netBase = (y, attr) => `<rect x="${X0}" y="${y}" width="${PW}" height="${PD}" ${attr} stroke="${C.ink}" stroke-width="3"/>`;
  const bc = cam(120, 262);

  // 밑넓이: 직육면체의 밑면 → 펼친 전개도에서 밑면 두 개 → 밑면 한 개는 4 × 3 = 12 칸, 밑넓이 12 cm²
  {
    const id = 't72-m4-mitneolbi';
    const sides = netSides((k) => `fill="white"`);
    let grid = '';
    for (let i = 1; i < 4; i++) grid += seg([X0 + i * U, Y0 + PH], [X0 + i * U, Y0 + PH + PD], `stroke="${C.green}" stroke-width="1.5" fill="none"`);
    for (let j = 1; j < 3; j++) grid += seg([X0, Y0 + PH + j * U], [X0 + PW, Y0 + PH + j * U], `stroke="${C.green}" stroke-width="1.5" fill="none"`);
    const body = g('s1', solid(box, bc, { face: (fi, v) => (fi < 2 ? `fill="${C.green}" fill-opacity="${fi === 0 ? .5 : .25}"` : v ? `fill="white" fill-opacity=".45"` : '') }), .2)
      + g('b1', g('k1', solid(box, bc, { face: (fi) => (fi === 0 ? `fill="${C.green}" fill-opacity=".55"` : ''), edge: () => '' }), .8))
      + g('s1', lab(120, 318, '밑면', { c: C.green, size: 22 }), 1)
      + sides.map((p, k) => g('s2', p.s, .2 + k * .2)).join('')
      + g('s2', netBase(Y0 - PD, `fill="${C.green}" fill-opacity=".25"`), 1.1) + g('s2', netBase(Y0 + PH, `fill="${C.green}" fill-opacity=".55"`), 1.3)
      + g('b3', g('s3', grid, .2))
      + g('b3', g('g3', netBase(Y0 + PH, `fill="${C.green}" fill-opacity=".55"`), .4))
      + g('s3', lab(X0 + PW / 2, Y0 + PH + PD + 26, '4 cm', { size: 19 }) + lab(X0 - 8, Y0 + PH + PD / 2 + 7, '3 cm', { size: 19, anchor: 'end' }), .6)
      + g('p3', lab(480, 286, '밑넓이', { c: C.green, size: 26 }), 1)
      + g('p3', lab(480, 320, '4 × 3 = 12 cm²', { c: C.green, size: 24 }), 1.4);
    put(KEY + '밑넓이', svg(id, body, motion(id)));
  }

  // 옆넓이: 직육면체의 옆면 네 개 → 전개도로 펼치면 옆면이 한 줄 → 가로 (4 + 3 + 4 + 3) cm, 세로 5 cm 인 직사각형, 70 cm²
  {
    const id = 't72-m4-yeopneolbi';
    const sides = netSides();
    const body = g('s1', solid(box, bc, { face: (fi, v) => (!v ? '' : fi >= 2 ? `fill="${SIDE[fi - 2]}" fill-opacity=".9"` : `fill="white"`) }), .2)
      + g('s1', lab(120, 318, '옆면', { c: C.orange, size: 22 }), 1)
      + sides.map((p, k) => g('s2', p.s, .2 + k * .25)).join('')
      + g('s2', netBase(Y0 - PD, `fill="white"`), 1.2) + g('s2', netBase(Y0 + PH, `fill="white"`), 1.3)
      + g('b3', g('g3', `<rect x="${X0}" y="${Y0}" width="${14 * U}" height="${PH}" fill="none" stroke="${C.orange}" stroke-width="6"/>`, .2))
      + g('b3', g('s3', sides.map((p) => lab(p.x0 + p.w * U / 2, Y0 + PH / 2 + 7, `${p.w}`, { size: 22 })).join('') + lab(X0 + 14 * U + 10, Y0 + PH / 2 + 7, '5', { size: 22, anchor: 'start' }), .4))
      + g('p3', lab(480, 82, '옆넓이', { c: C.orange, size: 26 }), 1)
      + g('p3', lab(470, 290, '(4 + 3 + 4 + 3) × 5', { size: 22 }), 1.3)
      + g('p3', lab(470, 324, '= 70 cm²', { c: C.orange, size: 24 }), 1.6);
    put(KEY + '옆넓이', svg(id, body, motion(id)));
  }
})(typeof window !== 'undefined' ? window : globalThis);
