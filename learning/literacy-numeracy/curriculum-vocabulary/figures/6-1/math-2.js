// 수학 6-1 2단원 각기둥과 각뿔: 낱말 도식
// 입체는 조금 위에서 내려다본 평행 투영으로 그린다(세로 모서리는 화면에서도 세로, 바닥 다각형은 납작하게).
// - 꼭짓점 좌표 [x, y, z](y 위, z 보는 쪽)를 cam(yaw 돌림, pitch 내려다봄)으로 화면에 옮긴다.
// - 면이 보이는지는 바깥쪽 법선이 보는 쪽을 향하는지로 가린다. 보이는 면이 하나도 없는 모서리는 점선.
// - 입체가 도는 움직임·상자가 펼쳐지는 움직임은 장면을 여러 장(frame) 미리 그려 차례로 하나씩 보이게 한다.
//   (opacity 만 바뀌므로 아이패드 사파리에서도 똑같이 움직인다.) 도는 동안 제자리 그림은 숨긴다.
(function (root) {
  'use strict';
  const { C, svg, text, put } = root.FigureKit;
  const f = (n) => +(+n).toFixed(1);
  const P = (p) => `${f(p[0])} ${f(p[1])}`;
  const D = Math.PI / 180;
  const delay = (s, more = '') => `style="animation-delay:${s}s;transition-delay:${s}s;${more}"`;

  const motion = (id) => {
    let css = `
    .sc-${id} :is(.s1,.s2,.s3,.s4,.p1,.p2,.p3,.p4,.k1,.k2,.k3,.k4) { opacity: 0; }
    .sc-${id} :is(.p1,.p2,.p3,.p4,.ring) { transform-box: fill-box; transform-origin: center; }
    .sc-${id} .draw { stroke-dasharray: 1 1; stroke-dashoffset: 1; transition: stroke-dashoffset .6s ease-in-out; }
    .sc-${id} .ring { opacity: 0; }
    .sc-${id} .fr { opacity: 0; }
    @keyframes ${id}-fin { from { opacity: 0; } to { opacity: 1; } }
    @keyframes ${id}-pop { 0% { opacity: 0; transform: scale(0); } 70% { opacity: 1; transform: scale(1.25); } 100% { opacity: 1; transform: scale(1); } }
    @keyframes ${id}-ring { 0% { opacity: .9; transform: scale(1); } 100% { opacity: 0; transform: scale(2.3); } }
    @keyframes ${id}-blink { 0% { opacity: 0; } 20% { opacity: 1; } 40% { opacity: .15; } 60% { opacity: 1; } 80% { opacity: .15; } 100% { opacity: 1; } }
    @keyframes ${id}-glow { 0%, 100% { opacity: 1; } 25%, 75% { opacity: .25; } }
    @keyframes ${id}-show { 0%, 100% { opacity: 1; } }
    @keyframes ${id}-hide { 0%, 100% { opacity: 0; } }`;
    for (let n = 1; n <= 4; n++) css += `
    .on${n} .sc-${id} .s${n} { animation: ${id}-fin .4s ease-out both; }
    .on${n} .sc-${id} .p${n} { animation: ${id}-pop .5s ease-out both; }
    .on${n} .sc-${id} .d${n} { stroke-dashoffset: 0; }
    .on${n} .sc-${id} .r${n} { animation: ${id}-ring 1.1s ease-out 2 both; }
    .on${n} .sc-${id} .k${n} { animation: ${id}-blink 1.6s ease-in-out both; }
    .on${n} .sc-${id} .g${n} { animation: ${id}-glow 1.2s ease-in-out 2; }`;
    return css;
  };

  // ── 입체 계산 ──
  const sub3 = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const dot3 = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const avg = (pts) => pts[0].map((_, k) => pts.reduce((s, p) => s + p[k], 0) / pts.length);
  const YAW = -40, PITCH = 28;
  const cam = (cx, cy, yaw = YAW, pitch = PITCH, s = 1) => ({ cx, cy, yaw: yaw * D, pitch: pitch * D, s });
  const xf = (c, p) => {
    const cy = Math.cos(c.yaw), sy = Math.sin(c.yaw), cp = Math.cos(c.pitch), sp = Math.sin(c.pitch);
    const x1 = p[0] * cy + p[2] * sy, z1 = -p[0] * sy + p[2] * cy;
    return [x1, p[1] * cp - z1 * sp, p[1] * sp + z1 * cp];
  };
  const scr = (c, q) => [c.cx + q[0] * c.s, c.cy - q[1] * c.s];
  const at = (c, p) => scr(c, xf(c, p));
  // 밑면 다각형(바닥 [x, z] 목록)으로 각기둥·각뿔 만들기. 면 종류 kind: base / side
  function prism(base, H) {
    const n = base.length;
    const V = base.map(([x, z]) => [x, 0, z]).concat(base.map(([x, z]) => [x, H, z]));
    const F = [base.map((_, i) => i), base.map((_, i) => n + i)];
    for (let i = 0; i < n; i++) F.push([i, (i + 1) % n, n + (i + 1) % n, n + i]);
    return { V, F, kind: F.map((_, i) => (i < 2 ? 'base' : 'side')), n };
  }
  function pyramid(base, H, apex = [0, 0]) {
    const n = base.length;
    const V = base.map(([x, z]) => [x, 0, z]).concat([[apex[0], H, apex[1]]]);
    const F = [base.map((_, i) => i)];
    for (let i = 0; i < n; i++) F.push([i, (i + 1) % n, n]);
    return { V, F, kind: F.map((_, i) => (i < 1 ? 'base' : 'side')), n };
  }
  const regular = (n, r, rot = 0) => Array.from({ length: n }, (_, k) => { const a = (90 + 180 / n + 360 * k / n + rot) * D; return [r * Math.cos(a), r * Math.sin(a)]; });
  function proj(sol, c) {
    const Q = sol.V.map((p) => xf(c, p)), Pt = Q.map((q) => scr(c, q)), cen = avg(Q);
    const vis = sol.F.map((face) => {
      let n = cross(sub3(Q[face[1]], Q[face[0]]), sub3(Q[face[2]], Q[face[0]]));
      if (dot3(n, sub3(avg(face.map((i) => Q[i])), cen)) < 0) n = n.map((v) => -v);
      return n[2] > 1e-6;
    });
    const map = new Map();
    sol.F.forEach((face, fi) => face.forEach((a, k) => {
      const b = face[(k + 1) % face.length], key = a < b ? `${a}-${b}` : `${b}-${a}`;
      if (!map.has(key)) map.set(key, { a: Math.min(a, b), b: Math.max(a, b), faces: [] });
      map.get(key).faces.push(fi);
    }));
    const edges = [...map.values()].map((e) => ({ ...e, hidden: e.faces.every((fi) => !vis[fi]) }));
    const depth = sol.F.map((face) => avg(face.map((i) => Q[i]))[2]);
    return { Q, P: Pt, vis, edges, depth, c2: avg(Pt) };
  }
  const INK = `stroke="${C.ink}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"`;
  const DASH = `stroke="${C.ink}" stroke-width="2.5" stroke-dasharray="8 7" fill="none"`;
  const poly = (pts, attr) => `<polygon points="${pts.map(P).join(' ')}" ${attr}/>`;
  const seg = (p, q, attr) => `<path d="M${P(p)} L${P(q)}" ${attr}/>`;
  const dot = (p, r = 6, fill = C.ink, cls = '') => `<circle class="${cls}" cx="${f(p[0])}" cy="${f(p[1])}" r="${r}" fill="${fill}"/>`;
  const FILL = {
    base: (v) => `fill="${C.mint}" fill-opacity="${v ? .85 : .45}"`,
    side: (v) => (v ? `fill="white" fill-opacity=".55"` : '')
  };
  // 겨냥도 한 장: 면(먼 것부터) → 점선 모서리 → 실선 모서리 → 덧그림
  function draw(sol, c, o = {}) {
    const pr = proj(sol, c);
    const face = o.face || ((fi, kind, v) => FILL[kind](v));
    const order = sol.F.map((_, i) => i).sort((a, b) => pr.depth[a] - pr.depth[b]);
    let s = '';
    for (const fi of order) { const a = face(fi, sol.kind[fi], pr.vis[fi], pr); if (a) s += poly(sol.F[fi].map((i) => pr.P[i]), a); }
    const edge = o.edge || ((e) => (e.hidden ? DASH : INK));
    for (const e of pr.edges.filter((e) => e.hidden)) { const a = edge(e, pr); if (a) s += seg(pr.P[e.a], pr.P[e.b], a); }
    for (const e of pr.edges.filter((e) => !e.hidden)) { const a = edge(e, pr); if (a) s += seg(pr.P[e.a], pr.P[e.b], a); }
    return s + (o.extra ? o.extra(pr) : '');
  }
  // 여러 장을 차례로: n 번째 칸이 열린 뒤 d0 초부터 dt 초마다 한 장. 제자리 그림(.rest-이름)은 그동안 숨긴다.
  // grow 가 참이면(솟아오르기처럼 제자리 그림이 끝 모습일 때) 칸이 열리자마자 제자리 그림을 숨긴다.
  function frames(id, name, list, beat, d0 = .3, dt = .045, grow = false) {
    const t3 = (v) => +v.toFixed(3);
    const body = list.map((s, i) => `<g class="fr ${name}" style="animation-delay:${t3(d0 + i * dt)}s">${s}</g>`).join('');
    const T = list.length * dt;
    const css = `.on${beat} .sc-${id} .${name}{animation:${id}-show ${dt}s step-end;animation-fill-mode:none}
      .on${beat} .sc-${id} .rest-${name}{animation:${id}-hide ${t3(grow ? d0 + T : T)}s step-end ${grow ? 0 : d0}s;animation-fill-mode:none}`;
    return { body, css, end: d0 + T };
  }
  // 직각 표시: 화면 위 꼭짓점 O 에서 a 쪽, b 쪽으로 s 만큼
  const rmark = (O, a, b, s = 14, color = C.red) => {
    const u = (p) => { const d = [p[0] - O[0], p[1] - O[1]], l = Math.hypot(...d); return [d[0] / l * s, d[1] / l * s]; };
    const ua = u(a), ub = u(b);
    return `<path d="M${P([O[0] + ua[0], O[1] + ua[1]])} L${P([O[0] + ua[0] + ub[0], O[1] + ua[1] + ub[1]])} L${P([O[0] + ub[0], O[1] + ub[1]])}" stroke="${color}" stroke-width="2.5" fill="none"/>`;
  };
  const lab = (x, y, s, color = C.green, size = 24, anchor = 'middle') => text(f(x), f(y), s, { size, color, anchor });
  const ring = (p, r, color, cls, d = 0) => `<circle class="ring ${cls}" ${delay(d)} cx="${f(p[0])}" cy="${f(p[1])}" r="${r}" fill="none" stroke="${color}" stroke-width="4"/>`;
  const ease = (t) => (t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
  const range = (n) => Array.from({ length: n }, (_, i) => i);

  const TRI = [[-78, 46], [78, 46], [0, -84]];
  const QUAD = [[-84, 56], [76, 62], [88, -48], [-62, -62]];
  const BOX = [[-86, 52], [86, 52], [86, -52], [-86, -52]];
  const PENT = regular(5, 84);

  // 입체도형: 종이 위 사각형·삼각형(평면도형) → 위로 두께가 생겨 솟음 → 면으로 둘러싸인 입체도형
  {
    const id = 't61-m2-ipche';
    const A = cam(180, 262, YAW, PITCH), B = cam(470, 262, YAW, PITCH);
    const sq = [[-70, 60], [70, 60], [70, -60], [-70, -60]], tr = [[-80, 52], [80, 52], [0, -78]];
    const flat = (base, c) => poly(base.map(([x, z]) => at(c, [x, 0, z])), `class="fl" pathLength="1" fill="${C.peach}" stroke="${C.orange}" stroke-width="3.5" stroke-linejoin="round"`);
    const grow = (base, c, name) => frames(id, name, range(16).map((i) => draw(prism(base, 3 + 117 * ease((i + 1) / 16)), c, {
      face: (fi, k, v) => (k === 'base' && fi === 0 ? `fill="${C.peach}"` : v ? `fill="white" fill-opacity=".6"` : '')
    })), 2, .3, .05, true);
    const g1 = grow(sq, A, 'ga'), g2 = grow(tr, B, 'gb');
    const solid = (base, c, cls) => `<g class="b2 rest-${cls}">${draw(prism(base, 120), c, { face: (fi, k, v) => (v ? `class="fc" fill="${k === 'base' ? C.mint : C.peach}" fill-opacity="${k === 'base' ? .9 : .7}"` : '') })}</g>`;
    const body = `<g class="h2">${flat(sq, A)}${flat(tr, B)}</g>`
      + g1.body + g2.body + solid(sq, A, 'ga') + solid(tr, B, 'gb')
      + `<g class="h2"><g class="s1" ${delay(.9)}>${lab(180, 330, '평면도형', C.muted)}${lab(470, 330, '평면도형', C.muted)}</g></g>`
      + `<g class="b3"><g class="p3" ${delay(.4)}>${lab(180, 330, '입체도형')}${lab(470, 330, '입체도형')}</g></g>`;
    put('6-1/수학/2/입체도형', svg(id, body, motion(id) + g1.css + g2.css + `
      .sc-${id} .fl { stroke-dasharray: 1 1; stroke-dashoffset: 1; }
      .on1 .sc-${id} .fl { stroke-dashoffset: 0; transition: stroke-dashoffset 1s ease .2s; }
      .sc-${id} .fc { fill-opacity: 0; }
      .on2 .sc-${id} .fc { fill-opacity: .25; transition: fill-opacity .4s ease 1.1s; }
      .on3 .sc-${id} .fc { fill-opacity: .8; transition: fill-opacity .6s ease .2s; }`));
  }

  // 평행: 위아래 두 판 → 판을 넓혀도 사이가 그대로라 만나지 않음 → 두 판 사이에 삼각기둥, 두 밑면이 서로 평행
  {
    const id = 't61-m2-pyeonghaeng';
    const c = cam(300, 270, YAW, PITCH), H = 150;
    const sheet = (y) => poly([[-120, 85], [120, 85], [120, -85], [-120, -85]].map(([x, z]) => at(c, [x, y, z])), `fill="${C.sky}" fill-opacity=".7" stroke="${C.blue}" stroke-width="3" stroke-linejoin="round"`);
    const gaps = [[-90, 60], [90, 60], [0, -60]].map(([x, z]) => {
      const p = at(c, [x, 0, z]), q = at(c, [x, H, z]);
      return `<path d="M${P(q)} L${P(p)}" stroke="${C.orange}" stroke-width="3.5" stroke-dasharray="2 7" stroke-linecap="round"/>${dot(p, 4.5, C.orange)}${dot(q, 4.5, C.orange)}`;
    }).join('');
    const sol = prism(TRI.map(([x, z]) => [x * .8, z * .8]), H);
    const tp = draw(sol, c, { face: (fi, k, v) => (k === 'base' ? `fill="${C.mint}" fill-opacity="${v ? .9 : .7}" stroke="${C.green}" stroke-width="3"` : v ? `fill="white" fill-opacity=".5"` : '') });
    const body = `<g class="sh lo">${sheet(0)}</g>`
      + `<g class="b2 h3">${gaps}</g>`
      + `<g class="b3">${tp}</g>`
      + `<g class="sh hi">${sheet(H)}</g>`
      + `<g class="b2 h3"><g class="s2" ${delay(1.4)}>${lab(560, 160, '만나지', C.blue, 22)}${lab(560, 186, '않음', C.blue, 22)}</g></g>`
      + `<g class="b3"><g class="p3" ${delay(1)}>${lab(560, 172, '서로 평행', C.green, 24)}</g></g>`;
    const top = at(c, [0, H, 0]), low = at(c, [0, 0, 0]);
    put('6-1/수학/2/평행', svg(id, body, motion(id) + `
      .sc-${id} .sh { transform-box: view-box; opacity: 0; transform: scale(.6); }
      .sc-${id} .hi { transform-origin: ${P(top).replace(' ', 'px ')}px; }
      .sc-${id} .lo { transform-origin: ${P(low).replace(' ', 'px ')}px; }
      .on1 .sc-${id} .sh { opacity: 1; transform: scale(.8); transition: opacity .5s ease .2s, transform .8s ease .2s; }
      .on2 .sc-${id} .sh { transform: scale(1.18); transition: transform 1.4s ease-in-out .2s; }
      .on3 .sc-${id} .sh { opacity: .55; transform: scale(.9); transition: transform .8s ease-in-out .2s, opacity .6s ease .2s; }`));
  }

  // 합동: 돌아간 삼각형을 옮겨 돌려 포개면 꼭 겹침 → 삼각기둥의 위 밑면을 내려 포개도 꼭 겹침
  {
    const id = 't61-m2-hapdong';
    const tri = [[60, 250], [210, 250], [90, 130]], cen = [120, 210], rot = 140, sh = 230;
    const rp = (p) => { const a = rot * D, d = [p[0] - cen[0], p[1] - cen[1]]; return [cen[0] + sh + d[0] * Math.cos(a) - d[1] * Math.sin(a), cen[1] + d[0] * Math.sin(a) + d[1] * Math.cos(a)]; };
    const c = cam(500, 290, YAW, PITCH), H = 150;
    const sol = prism(TRI.map(([x, z]) => [x * .85, z * .85]), H);
    const pr = proj(sol, c);
    const topPts = sol.F[1].map((i) => pr.P[i]);
    const dy = H * Math.cos(c.pitch);
    const body = poly(tri, `fill="${C.mint}" stroke="${C.green}" stroke-width="3.5" stroke-linejoin="round"`)
      + `<g class="mv">${poly(tri.map(rp), `fill="${C.peach}" fill-opacity=".8" stroke="${C.orange}" stroke-width="3.5" stroke-linejoin="round"`)}</g>`
      + `<g class="g2" ${delay(1.6)}><g class="b2">${poly(tri, `fill="none" stroke="${C.red}" stroke-width="5" stroke-linejoin="round"`)}</g></g>`
      + `<g class="b3">${draw(sol, c)}</g>`
      + `<g class="b3"><g class="drop">${poly(topPts, `fill="${C.green}" fill-opacity=".35" stroke="${C.green}" stroke-width="4.5" stroke-linejoin="round"`)}</g></g>`
      + `<g class="b3"><g class="s3" ${delay(2)}>${poly(sol.F[0].map((i) => pr.P[i]), `fill="none" stroke="${C.red}" stroke-width="4" stroke-linejoin="round"`)}</g></g>`
      + `<g class="b2"><g class="p2" ${delay(1.5)}>${lab(140, 320, '합동', C.red, 26)}</g></g>`;
    put('6-1/수학/2/합동', svg(id, body, motion(id) + `
      .sc-${id} .mv { transform-box: view-box; transform-origin: ${cen[0] + sh}px ${cen[1]}px; }
      .on2 .sc-${id} .mv { transform: translate(${-sh}px, 0) rotate(${-rot}deg); transition: transform 1.3s ease-in-out .2s; }
      .on3 .sc-${id} .mv { opacity: .0; transition: opacity .4s ease; }
      .on3 .sc-${id} .drop { animation: ${id}-drop 1.8s ease-in-out .5s both; }
      @keyframes ${id}-drop { 0% { transform: none; } 60%, 100% { transform: translateY(${f(dy)}px); } }`));
  }

  // 다각형: 선분 셋·다섯·여섯으로 둘러싼 도형 → 굽은 선이 있는 도형은 다각형이 아님 → 선분으로만 둘러싸인 다각형
  {
    const id = 't61-m2-dagak';
    const shapes = [[[50, 150], [170, 150], [110, 50]], regular(5, 62).map(([x, y]) => [320 + x, 100 - y]), regular(6, 62).map(([x, y]) => [530 + x, 98 - y])];
    let sides = '';
    shapes.forEach((pts, si) => pts.forEach((p, k) => {
      const q = pts[(k + 1) % pts.length];
      sides += `<path class="draw d1" pathLength="1" ${delay(.2 + si * .45 + k * .08)} d="M${P(p)} L${P(q)}" stroke="${C.ink}" stroke-width="3.5" stroke-linecap="round"/>`;
    }));
    const fills = shapes.map((pts, i) => `<g class="s3" ${delay(.2 + i * .2)}>${poly(pts, `fill="${C.mint}"`)}</g>`).join('');
    const ticks = shapes.map((pts) => pts.map((p, k) => { const q = pts[(k + 1) % pts.length]; return dot([(p[0] + q[0]) / 2, (p[1] + q[1]) / 2], 4.5, C.blue); }).join('')).join('');
    const circ = `<circle cx="200" cy="276" r="52" fill="${C.peach}" fill-opacity=".6" stroke="${C.ink}" stroke-width="3.5"/>`;
    const door = `<path d="M380 330 V280 A50 50 0 0 1 480 280 V330 Z" fill="${C.peach}" fill-opacity=".6" stroke="${C.ink}" stroke-width="3.5" stroke-linejoin="round"/><path d="M380 280 A50 50 0 0 1 480 280" stroke="${C.red}" stroke-width="4" fill="none"/>`;
    const X = (x, y) => `<path d="M${x - 16} ${y - 16} l32 32 M${x + 16} ${y - 16} l-32 32" stroke="${C.red}" stroke-width="6" stroke-linecap="round"/>`;
    const body = fills + sides + `<g class="s1" ${delay(1.6)}>${ticks}</g>`
      + `<g class="s2" ${delay(.2)}>${circ}${door}</g>`
      + `<g class="p2" ${delay(1)}>${X(200, 276)}</g><g class="p2" ${delay(1.3)}>${X(430, 296)}</g>`
      + `<g class="b3"><g class="p3" ${delay(.9)}><rect x="250" y="176" width="140" height="44" rx="22" fill="white" stroke="${C.green}" stroke-width="3"/>${lab(320, 207, '다각형', C.green, 26)}</g></g>`;
    put('6-1/수학/2/다각형', svg(id, body, motion(id) + `.on3 .sc-${id} .s2 { opacity: .35; animation: none; transition: opacity .5s ease; }`));
  }

  // 각기둥: 서로 평행하고 합동인 오각형 둘 → 옆을 둘러싼 면이 하나씩 붙고 모두 직사각형 → 각기둥
  {
    const id = 't61-m2-gakgidung';
    const c = cam(320, 280, YAW, PITCH), H = 160, sol = prism(PENT, H), pr = proj(sol, c);
    const baseAttr = `fill="${C.mint}" fill-opacity=".85" stroke="${C.green}" stroke-width="3" stroke-linejoin="round"`;
    const bot = sol.F[0].map((i) => pr.P[i]), top = sol.F[1].map((i) => pr.P[i]);
    const sides = sol.F.slice(2).map((face, k) => ({ face, fi: k + 2 })).filter(({ fi }) => pr.vis[fi]);
    const sideFill = sides.map(({ face }, k) => `<g class="s2" ${delay(.3 + k * .3)}>${poly(face.map((i) => pr.P[i]), `fill="${C.peach}" fill-opacity=".75"`)}</g>`).join('');
    const hiddenBot = pr.edges.filter((e) => e.hidden && sol.F[0].includes(e.a) && sol.F[0].includes(e.b));
    const front = sides.reduce((a, b) => (pr.depth[a.fi] > pr.depth[b.fi] ? a : b));
    const [a0, a1, a2, a3] = front.face.map((i) => pr.P[i]);
    const marks = rmark(a0, a1, a3) + rmark(a1, a0, a2) + rmark(a2, a1, a3) + rmark(a3, a2, a0);
    const body = `<g class="s1" ${delay(.2)}>${poly(bot, baseAttr)}</g>`
      + `<g class="h2"><g class="s1" ${delay(.2)}>${hiddenBot.map((e) => seg(pr.P[e.a], pr.P[e.b], INK)).join('')}</g></g>`
      + sideFill
      + `<g class="b2">${pr.edges.filter((e) => e.hidden).map((e) => seg(pr.P[e.a], pr.P[e.b], DASH)).join('')}</g>`
      + `<g class="b2">${pr.edges.filter((e) => !e.hidden && sol.F[0].includes(e.a) !== sol.F[0].includes(e.b)).map((e) => `<path class="draw d2" pathLength="1" ${delay(.3)} d="M${P(pr.P[e.a])} L${P(pr.P[e.b])}" ${INK}/>`).join('')}</g>`
      + `<g class="s1" ${delay(.2)}>${pr.edges.filter((e) => !e.hidden && sol.F[0].includes(e.a) && sol.F[0].includes(e.b)).map((e) => seg(pr.P[e.a], pr.P[e.b], INK)).join('')}</g>`
      + `<g class="lift"><g class="s1" ${delay(.6)}>${poly(top, baseAttr)}${poly(top, INK)}</g></g>`
      + `<g class="b2"><g class="s2" ${delay(1.7)}>${marks}</g></g>`
      + `<g class="h2"><g class="s1" ${delay(1.2)}>${lab(110, 120, '평행', C.blue, 22)}${lab(110, 146, '합동', C.blue, 22)}</g></g>`
      + `<g class="b3"><g class="g3" ${delay(.2)}>${poly(top, `fill="none" stroke="${C.green}" stroke-width="5"`)}${poly(bot, `fill="none" stroke="${C.green}" stroke-width="5"`)}</g></g>`
      + `<g class="b3"><g class="p3" ${delay(1)}>${lab(540, 170, '각기둥', C.green, 28)}</g></g>`;
    put('6-1/수학/2/각기둥', svg(id, body, motion(id) + `
      .sc-${id} .lift { transform: translateY(-36px); }
      .on2 .sc-${id} .lift { transform: none; transition: transform .6s ease .1s; }`));
  }

  // 밑면: 삼각기둥의 평행하고 합동인 위아래 두 면 → 위 면을 내려 포개면 꼭 겹침 → 눕혀도 두 삼각형이 밑면 → 사각뿔의 밑면은 하나
  {
    const id = 't61-m2-mitmyeon';
    const c = cam(200, 250, YAW, PITCH), H = 140, base = TRI.map(([x, z]) => [x * .85, z * .85]);
    const sol = prism(base, H), pr = proj(sol, c);
    const green = (fi, k, v) => (k === 'base' ? `fill="${C.green}" fill-opacity="${v ? .45 : .3}"` : v ? `fill="white" fill-opacity=".5"` : '');
    // 앞 아래 모서리를 축으로 눕히기
    const z0 = base[0][1];
    const tip = (phi) => ({ ...sol, V: sol.V.map(([x, y, z]) => { const zr = z - z0; return [x, y * Math.cos(phi) - zr * Math.sin(phi), z0 + y * Math.sin(phi) + zr * Math.cos(phi)]; }) });
    const fr = frames(id, 'tp', range(18).map((i) => draw(tip(90 * D * ease((i + 1) / 18)), c, { face: green })), 3, .3, .05);
    const lying = tip(90 * D);
    const pyr = pyramid([[-70, 60], [70, 60], [70, -60], [-70, -60]], 150), cp = cam(480, 270, YAW, PITCH);
    const topPts = sol.F[1].map((i) => pr.P[i]);
    const lp = proj(lying, c), lf = [0, 1].find((fi) => lp.vis[fi]), lpts = lying.F[lf].map((i) => lp.P[i]);
    const lyTag = [avg(lpts)[0], Math.min(...lpts.map((q) => q[1])) - 16];
    const body = `<g class="still">${draw(sol, c, { face: green })}</g>`
      + fr.body
      + `<g class="b3"><g class="ly">${draw(lying, c, { face: green })}</g></g>`
      + `<g class="b2 h3"><g class="drop">${poly(topPts, `fill="${C.green}" fill-opacity=".35" stroke="${C.green}" stroke-width="4.5" stroke-linejoin="round"`)}</g></g>`
      + `<g class="h3"><g class="s1" ${delay(.9)}>${lab(200, 54, '밑면', C.green, 24)}${lab(200, 340, '밑면', C.green, 24)}</g></g>`
      + `<g class="b4">${draw(pyr, cp, { face: (fi, k, v) => (k === 'base' ? `fill="${C.green}" fill-opacity=".4"` : v ? `fill="white" fill-opacity=".5"` : '') })}</g>`
      + `<g class="b4"><g class="p4" ${delay(.5)}>${lab(480, 340, '밑면', C.green, 24)}</g></g>`
      + `<g class="b3"><g class="p3" ${delay(1.4)}>${lab(lyTag[0], lyTag[1], '밑면', C.green, 24)}</g></g>`;
    put('6-1/수학/2/밑면', svg(id, body, motion(id) + fr.css + `
      .on2 .sc-${id} .drop { animation: ${id}-drop 1.8s ease-in-out .2s both; }
      @keyframes ${id}-drop { 0% { transform: none; } 60%, 100% { transform: translateY(${f(H * Math.cos(c.pitch))}px); } }
      .on3 .sc-${id} .still { opacity: 0; transition: opacity 0s linear .3s; }
      .sc-${id} .ly { opacity: 0; }
      .on3 .sc-${id} .ly { opacity: 1; transition: opacity 0s linear ${f(fr.end * 1000) / 1000}s; }`));
  }

  // 옆면: 두 밑면을 칠함 → 오각기둥의 옆을 둘러싼 직사각형들이 칠해짐 → 사각뿔의 옆 삼각형들 → 옆면
  {
    const id = 't61-m2-yeopmyeon';
    const cA = cam(185, 262, YAW, PITCH), cB = cam(470, 272, YAW, PITCH);
    const A = prism(PENT.map(([x, z]) => [x * .85, z * .85]), 150), B = pyramid([[-72, 62], [72, 62], [72, -62], [-72, -62]], 160);
    const part = (sol, c, beat) => {
      const pr = proj(sol, c);
      const order = sol.F.map((_, i) => i).sort((a, b) => pr.depth[a] - pr.depth[b]);
      let k = 0, s = '';
      for (const fi of order) {
        const pts = sol.F[fi].map((i) => pr.P[i]);
        if (sol.kind[fi] === 'base') s += poly(pts, `fill="${C.mint}" fill-opacity="${pr.vis[fi] ? .85 : .5}"`);
        else s += `<g class="s${beat}" ${delay(.2 + (pr.vis[fi] ? 3 + k++ : 0) * .25)}>${poly(pts, `fill="${C.peach}" fill-opacity="${pr.vis[fi] ? .8 : .35}"`)}</g>`;
      }
      return s + draw(sol, c, { face: () => '' });
    };
    const pa = proj(A, cA);
    const fs = A.F.slice(2).map((face, k) => ({ face, fi: k + 2 })).filter(({ fi }) => pa.vis[fi]);
    const fr = fs.reduce((a, b) => (pa.depth[a.fi] > pa.depth[b.fi] ? a : b));
    const [a0, a1, a2, a3] = fr.face.map((i) => pa.P[i]);
    const body = part(A, cA, 2) + part(B, cB, 3)
      + `<g class="b2"><g class="s2" ${delay(1.6)}>${rmark(a0, a1, a3) + rmark(a1, a0, a2) + rmark(a2, a1, a3) + rmark(a3, a2, a0)}</g></g>`
      + `<g class="b4">${lab(185, 344, '옆면: 직사각형', C.orange, 22)}${lab(470, 344, '옆면: 삼각형', C.orange, 22)}</g>`;
    put('6-1/수학/2/옆면', svg(id, body, motion(id)));
  }

  // 각기둥의 이름: 바닥 다각형 → 위로 솟아 각기둥 → 밑면 모양이 이름
  const named = (id, key, base, shape, name, more = () => ({ body: '', css: '' })) => {
    const c = cam(230, 268, YAW, PITCH), H = 150;
    const flat = poly(base.map(([x, z]) => at(c, [x, 0, z])), `class="fl" pathLength="1" fill="${C.mint}" stroke="${C.green}" stroke-width="3.5" stroke-linejoin="round"`);
    const g = frames(id, 'gr', range(16).map((i) => draw(prism(base, 3 + (H - 3) * ease((i + 1) / 16)), c)), 2, .3, .05, true);
    const sol = prism(base, H), pr = proj(sol, c);
    const m = more(c);
    const body = `<g class="h2">${flat}</g>` + g.body + `<g class="b2 rest-gr">${draw(sol, c)}</g>`
      + `<g class="b3"><g class="g3" ${delay(.2)}>${[0, 1].map((fi) => poly(sol.F[fi].map((i) => pr.P[i]), `fill="none" stroke="${C.green}" stroke-width="5" stroke-linejoin="round"`)).join('')}</g></g>`
      + `<g class="s1" ${delay(1)}>${lab(230, 340, shape, C.green, 26)}</g>`
      + `<g class="b3"><g class="p3" ${delay(.9)}>${lab(230, 54, name, C.green, 28)}</g></g>` + m.body;
    put(key, svg(id, body, motion(id) + g.css + m.css + `
      .sc-${id} .fl { stroke-dasharray: 1 1; stroke-dashoffset: 1; }
      .on1 .sc-${id} .fl { stroke-dashoffset: 0; transition: stroke-dashoffset 1s ease .2s; }`));
  };
  named('t61-m2-samgakgi', '6-1/수학/2/삼각기둥', TRI, '밑면: 삼각형', '삼각기둥', () => {
    const c = cam(500, 250, YAW, PITCH), lie = prism(TRI.map(([x, z]) => [x * .7, z * .7]), 150);
    const t = { ...lie, V: lie.V.map(([x, y, z]) => [y - 75, 46 * .7 - z, x]) }; // 옆으로 눕힌 삼각기둥(텐트 모양)
    return { body: `<g class="b3"><g class="s3" ${delay(1.2)}>${draw(t, c, { face: (fi, k, v) => (k === 'base' ? `fill="${C.mint}" fill-opacity="${v ? .85 : .45}"` : v ? `fill="white" fill-opacity=".55"` : '') })}</g></g>`, css: '' };
  });
  named('t61-m2-sagakgi', '6-1/수학/2/사각기둥', QUAD, '밑면: 사각형', '사각기둥', () => {
    const c = cam(500, 262, YAW, PITCH), box = prism(BOX.map(([x, z]) => [x * .75, z * .75]), 120), pr = proj(box, c);
    return {
      body: `<g class="b3"><g class="s3" ${delay(1.2)}>${draw(box, c)}${lab(500, 340, '직육면체', C.muted, 22)}</g></g>`
        + `<g class="b3"><g class="g3" ${delay(1.6)}>${[0, 1].map((fi) => poly(box.F[fi].map((i) => pr.P[i]), `fill="none" stroke="${C.green}" stroke-width="5"`)).join('')}</g></g>`,
      css: ''
    };
  });

  // 도는 각기둥 한 벌: 모서리·꼭짓점·높이에서 같이 쓴다
  const spin = (id, sol, cx, cy, o, beat, yaw0 = YAW, n = 36) => frames(id, 'sp', range(n).map((i) => draw(sol, cam(cx, cy, yaw0 + 360 * (i + 1) / n, PITCH), o)), beat, .3, .045);
  const outward = (pr, p, d) => { const v = [p[0] - pr.c2[0], p[1] - pr.c2[1]], l = Math.hypot(...v) || 1; return [p[0] + v[0] / l * d, p[1] + v[1] / l * d]; };

  // 모서리: 앞면과 옆면이 만나는 선분이 주황 → 삼각기둥이 돌며 모든 모서리 주황 → 하나씩 세면 9개
  {
    const id = 't61-m2-moseori';
    const cx = 300, cy = 262, c = cam(cx, cy, YAW, PITCH), H = 150, sol = prism(TRI, H), pr = proj(sol, c);
    const OR = `stroke="${C.orange}" stroke-width="5" stroke-linecap="round"`, ORD = `stroke="${C.orange}" stroke-width="3.5" stroke-dasharray="8 7"`;
    const orange = { edge: (e) => (e.hidden ? ORD : OR) };
    const vf = sol.F.map((_, i) => i).filter((i) => pr.vis[i] && sol.kind[i] === 'side');
    const [f1, f2] = vf;
    const shared = pr.edges.find((e) => e.faces.includes(f1) && e.faces.includes(f2));
    const sp = spin(id, sol, cx, cy, orange, 2);
    const nums = pr.edges.map((e, i) => { const q = [(pr.P[e.a][0] + pr.P[e.b][0]) / 2, (pr.P[e.a][1] + pr.P[e.b][1]) / 2]; return `<g class="p3" ${delay(.2 + i * .14)}><circle cx="${f(q[0])}" cy="${f(q[1])}" r="14" fill="white" stroke="${C.orange}" stroke-width="2"/>${text(f(q[0]), f(q[1] + 7), i + 1, { size: 19, color: C.orange })}</g>`; }).join('');
    const body = `<g class="rest-sp">`
      + `<g class="h2">${draw(sol, c, { face: (fi, k, v) => (fi === f1 || fi === f2 ? `class="pk" fill="${fi === f1 ? C.sky : C.lilac}" fill-opacity=".8"` : FILL[k](v)) })}`
      + `<g class="s1" ${delay(1)}>${seg(pr.P[shared.a], pr.P[shared.b], `stroke="${C.orange}" stroke-width="7" stroke-linecap="round"`)}</g></g>`
      + `<g class="b2">${draw(sol, c, orange)}</g></g>`
      + sp.body + nums
      + `<g class="b3"><g class="p3" ${delay(1.6)}>${lab(540, 180, '모서리', C.orange, 28)}${lab(540, 216, '9개', C.orange, 26)}</g></g>`
      + `<g class="h2"><g class="s1" ${delay(1.2)}>${lab(540, 190, '모서리', C.orange, 26)}</g></g>`;
    put('6-1/수학/2/모서리', svg(id, body, motion(id) + sp.css + `
      .sc-${id} .pk { opacity: 0; }
      .on1 .sc-${id} .pk { opacity: 1; transition: opacity .5s ease .2s; }`));
  }

  // 꼭짓점: 모서리 셋이 만나는 점 → 돌며 모든 점이 빨강 → 하나씩 세면 6개
  {
    const id = 't61-m2-kkokjitjeom';
    const cx = 300, cy = 262, c = cam(cx, cy, YAW, PITCH), H = 150, sol = prism(TRI, H), pr = proj(sol, c);
    const red = { extra: (p) => p.P.map((q) => dot(q, 8, C.red)).join('') };
    const sp = spin(id, sol, cx, cy, red, 2);
    const vi = range(sol.n).map((i) => i + sol.n).reduce((b, i) => (pr.Q[i][2] > pr.Q[b][2] ? i : b), sol.n);
    const meet = pr.edges.filter((e) => e.a === vi || e.b === vi).map((e) => seg(pr.P[e.a], pr.P[e.b], `stroke="${C.orange}" stroke-width="6" stroke-linecap="round"`)).join('');
    const nums = pr.P.map((q, i) => { const p = outward(pr, q, 24); return `<g class="p3" ${delay(.2 + i * .18)}><circle cx="${f(p[0])}" cy="${f(p[1])}" r="14" fill="white" stroke="${C.red}" stroke-width="2"/>${text(f(p[0]), f(p[1] + 7), i + 1, { size: 19, color: C.red })}</g>`; }).join('');
    const body = `<g class="rest-sp">${draw(sol, c)}<g class="h2"><g class="s1" ${delay(.2)}>${meet}</g><g class="p1" ${delay(1.1)}>${dot(pr.P[vi], 10, C.red)}</g></g>`
      + `<g class="b2">${pr.P.map((q) => dot(q, 8, C.red)).join('')}</g></g>` + ring(pr.P[vi], 14, C.red, 'r1', 1.4)
      + sp.body + nums
      + `<g class="b3"><g class="p3" ${delay(1.6)}>${lab(540, 180, '꼭짓점', C.red, 28)}${lab(540, 216, '6개', C.red, 26)}</g></g>`;
    put('6-1/수학/2/꼭짓점', svg(id, body, motion(id) + sp.css));
  }

  // 높이: 두 밑면 사이를 곧게 잇는 선분 → 돌아도 옆면끼리 만나는 모서리 길이가 모두 같음 → 사각뿔 꼭짓점에서 밑면에 수직으로 내린 선분
  {
    const id = 't61-m2-nopi';
    const cx = 175, cy = 270, c = cam(cx, cy, YAW, PITCH), H = 160, sol = prism(PENT.map(([x, z]) => [x * .8, z * .8]), H), pr = proj(sol, c);
    const lateral = (e) => sol.F[0].includes(e.a) !== sol.F[0].includes(e.b);
    const BL = `stroke="${C.blue}" stroke-width="5" stroke-linecap="round"`, BLD = `stroke="${C.blue}" stroke-width="3.5" stroke-dasharray="8 7"`;
    const axis = (p) => { const a = at(p.c, [0, 0, 0]), b = at(p.c, [0, H, 0]); return seg(a, b, `stroke="${C.blue}" stroke-width="4" stroke-dasharray="3 6" stroke-linecap="round"`); };
    const sp = frames(id, 'sp', range(36).map((i) => { const cc = cam(cx, cy, YAW + 360 * (i + 1) / 36, PITCH); return draw(sol, cc, { edge: (e) => (lateral(e) ? (e.hidden ? BLD : BL) : e.hidden ? DASH : INK), extra: () => axis({ c: cc }) }); }), 2, .3, .045);
    const a = at(c, [0, 0, 0]), b = at(c, [0, H, 0]);
    const plumb = `<path class="pl" d="M${P(b)} L${P(a)}" stroke="${C.blue}" stroke-width="5" stroke-linecap="round"/>`
      + `<g class="s1" ${delay(1.1)}>${rmark(a, b, at(c, [30, 0, 0]), 13)}${rmark(b, a, at(c, [30, H, 0]), 13)}${dot(a, 5, C.blue)}${dot(b, 5, C.blue)}</g>`;
    const pc = cam(470, 262, YAW, PITCH), py = pyramid([[-78, 66], [78, 66], [78, -66], [-78, -66]], 170), pp = proj(py, pc);
    const A = pp.P[4], F0 = at(pc, [0, 0, 0]);
    const body = `<g class="rest-sp">${draw(sol, c, { face: (fi, k, v) => (k === 'base' ? `fill="${C.mint}" fill-opacity="${v ? .85 : .5}"` : v ? `fill="white" fill-opacity=".45"` : '') })}`
      + `<g class="b2">${pr.edges.filter(lateral).map((e) => seg(pr.P[e.a], pr.P[e.b], e.hidden ? BLD : BL)).join('')}</g></g>`
      + `<g class="h2">${plumb}</g><g class="b2"><g class="rest-sp">${axis({ c })}</g></g>`
      + sp.body
      + `<g class="b3">${draw(py, pc, { face: (fi, k, v) => (k === 'base' ? `fill="${C.mint}" fill-opacity=".7"` : v ? `fill="white" fill-opacity=".45"` : '') })}${dot(A, 6)}</g>`
      + `<g class="b3"><path class="pl3" d="M${P(A)} L${P(F0)}" stroke="${C.blue}" stroke-width="5" stroke-linecap="round"/>`
      + `<g class="s3" ${delay(1.2)}>${rmark(F0, A, at(pc, [36, 0, 0]), 13)}${rmark(F0, A, at(pc, [0, 0, 36]), 13)}${dot(F0, 5, C.blue)}</g></g>`
      + `<g class="s1" ${delay(1.4)}>${lab(f(a[0]) + 0, 344, '높이', C.blue, 24)}</g>`
      + `<g class="b3"><g class="s3" ${delay(1.4)}>${lab(f(F0[0]), 344, '높이', C.blue, 24)}</g></g>`
      + `<g class="b4"><g class="g4" ${delay(.1)}>${seg(b, a, `stroke="${C.orange}" stroke-width="6" stroke-linecap="round"`)}${seg(A, F0, `stroke="${C.orange}" stroke-width="6" stroke-linecap="round"`)}</g></g>`;
    put('6-1/수학/2/높이', svg(id, body, motion(id) + sp.css + `
      .sc-${id} .pl, .sc-${id} .pl3 { stroke-dasharray: 1 1; stroke-dashoffset: 1; }
      .sc-${id} .pl { stroke-dasharray: ${f(Math.hypot(a[0] - b[0], a[1] - b[1]))}; stroke-dashoffset: ${f(Math.hypot(a[0] - b[0], a[1] - b[1]))}; }
      .on1 .sc-${id} .pl { stroke-dashoffset: 0; transition: stroke-dashoffset .9s ease .3s; }
      .sc-${id} .pl3 { stroke-dasharray: ${f(Math.hypot(A[0] - F0[0], A[1] - F0[1]))}; stroke-dashoffset: ${f(Math.hypot(A[0] - F0[0], A[1] - F0[1]))}; }
      .on3 .sc-${id} .pl3 { stroke-dashoffset: 0; transition: stroke-dashoffset 1s ease-in .3s; }`));
  }

  // 전개도: 자를 모서리 빨강 → 옆면이 양옆으로, 두 밑면이 위아래로 펼쳐져 평면 위 그림 → 다시 접히면 꼭 맞는 삼각기둥 → 다시 펼친 그림이 전개도
  {
    const id = 't61-m2-jeongaedo';
    const s = 92, ht = s * Math.sqrt(3) / 2, H = 104;
    const A0 = [-s / 2, -H / 2, 0], B0 = [s / 2, -H / 2, 0], A1 = [-s / 2, H / 2, 0], B1 = [s / 2, H / 2, 0];
    // 펼친 정도 t(0 접힘 ~ 1 펼침): 옆면이 먼저, 두 밑면이 나중에
    const faces = (t) => {
      const u = Math.min(1, t * 1.6), w = Math.max(0, (t - .45) / .55);
      const ar = (-120 + 120 * u) * D, al = (-60 - 120 * u) * D, ph = 90 * w * D;
      const R = (y) => [s / 2 + s * Math.cos(ar), y, s * Math.sin(ar)], L = (y) => [-s / 2 + s * Math.cos(al), y, s * Math.sin(al)];
      const T = [0, H / 2 + ht * Math.sin(ph), -ht * Math.cos(ph)], Bt = [0, -H / 2 - ht * Math.sin(ph), -ht * Math.cos(ph)];
      return [
        { pts: [A0, B0, B1, A1], k: 'side' }, { pts: [B0, R(-H / 2), R(H / 2), B1], k: 'side' }, { pts: [A0, A1, L(H / 2), L(-H / 2)], k: 'side' },
        { pts: [A1, B1, T], k: 'base' }, { pts: [A0, B0, Bt], k: 'base' }
      ];
    };
    const view = (t) => cam(320, 182, YAW * (1 - t), PITCH * (1 - t), 1.5 - .45 * t);
    const scene = (t) => {
      const c = view(t);
      return faces(t).map((fc) => ({ ...fc, z: avg(fc.pts.map((p) => xf(c, p)))[2], sp: fc.pts.map((p) => at(c, p)) }))
        .sort((a, b) => a.z - b.z)
        .map((fc) => poly(fc.sp, `fill="${fc.k === 'base' ? C.mint : C.peach}" fill-opacity=".92" ${INK}`)).join('');
    };
    const N = 26;
    const open1 = frames(id, 'o1', range(N).map((i) => scene(ease((i + 1) / N))), 2, .3, .05);
    const close = frames(id, 'cl', range(N).map((i) => scene(ease(1 - (i + 1) / N))), 3, .3, .05);
    const open2 = frames(id, 'o2', range(N).map((i) => scene(ease((i + 1) / N))), 4, .3, .05);
    // 접힌 겨냥도(점선 포함)와 자를 모서리
    const sol = { V: [A0, B0, [0, -H / 2, -ht], A1, B1, [0, H / 2, -ht]], F: [[0, 1, 2], [3, 4, 5], [0, 1, 4, 3], [1, 2, 5, 4], [2, 0, 3, 5]], kind: ['base', 'base', 'side', 'side', 'side'] };
    const c0 = view(0), pr = proj(sol, c0);
    const cutKeys = ['2-5', '1-2', '0-2', '4-5', '3-5'];
    const folded = draw(sol, c0, { face: (fi, k, v) => (v ? `fill="${k === 'base' ? C.mint : C.peach}" fill-opacity=".8"` : '') });
    const cuts = pr.edges.filter((e) => cutKeys.includes(`${e.a}-${e.b}`)).map((e, i) => `<g class="s1" ${delay(.3 + i * .25)}>${seg(pr.P[e.a], pr.P[e.b], e.hidden ? `stroke="${C.red}" stroke-width="4" stroke-dasharray="8 7"` : `stroke="${C.red}" stroke-width="5.5" stroke-linecap="round"`)}</g>`).join('');
    const net = scene(1);
    const body = `<g class="st-fold">${folded}<g class="h2">${cuts}</g></g>`
      + `<g class="st-net">${net}</g>`
      + open1.body + close.body + open2.body
      + `<g class="b4"><g class="p4" ${delay(1.9)}>${lab(548, 190, '전개도', C.green, 28)}</g></g>`
      + `<g class="b2 h3"><g class="s2" ${delay(1.6)}>${lab(548, 176, '겹치는', C.muted, 22)}${lab(548, 202, '면 없음', C.muted, 22)}</g></g>`;
    const T = (fr) => f(fr.end * 1000) / 1000;
    put('6-1/수학/2/전개도', svg(id, body, motion(id) + open1.css + close.css + open2.css + `
      .sc-${id} .st-net { opacity: 0; }
      .on2 .sc-${id} .st-fold { opacity: 0; transition: opacity 0s linear .3s; }
      .on2 .sc-${id} .st-net { opacity: 1; transition: opacity 0s linear ${T(open1)}s; }
      .on3 .sc-${id} .st-net { opacity: 0; transition: opacity 0s linear .3s; }
      .on3 .sc-${id} .st-fold { opacity: 1; transition: opacity 0s linear ${T(close)}s; }
      .on4 .sc-${id} .st-fold { opacity: 0; transition: opacity 0s linear .3s; }
      .on4 .sc-${id} .st-net { opacity: 1; transition: opacity 0s linear ${T(open2)}s; }
      .on3 .sc-${id} .o1, .on4 .sc-${id} .cl { animation: none; }
      .on4 .sc-${id} .st-net polygon { animation: ${id}-glow 1s ease-in-out ${T(open2)}s 2; }`));
  }

  // 수직: 두 직선이 직각으로 만남 → 바닥에 곧게 선 막대는 바닥과 직각 → 각기둥의 옆면은 두 밑면과 수직
  {
    const id = 't61-m2-sujik';
    const O = [110, 250];
    const p1 = `<path d="M30 ${O[1]} H200" stroke="${C.ink}" stroke-width="4" stroke-linecap="round"/>`
      + `<g class="rot"><path d="M${O[0]} ${O[1] + 20} V${O[1] - 150}" stroke="${C.blue}" stroke-width="4" stroke-linecap="round"/></g>`
      + `<g class="s1" ${delay(1.3)}>${rmark(O, [200, O[1]], [O[0], 0], 18)}${rmark(O, [0, O[1]], [O[0], 0], 18)}</g>`;
    const c = cam(320, 262, YAW, PITCH);
    const floor = poly([[-80, 60], [80, 60], [80, -60], [-80, -60]].map(([x, z]) => at(c, [x, 0, z])), `fill="${C.sky}" fill-opacity=".6" stroke="${C.blue}" stroke-width="2.5"`);
    const F0 = at(c, [0, 0, 0]), F1 = at(c, [0, 150, 0]);
    const p2 = `<g class="b2">${floor}<path class="pole" d="M${P(F0)} L${P(F1)}" stroke="${C.orange}" stroke-width="6" stroke-linecap="round"/>${dot(F0, 5, C.orange)}`
      + `<g class="s2" ${delay(1.2)}>${rmark(F0, F1, at(c, [40, 0, 0]), 16)}${rmark(F0, F1, at(c, [0, 0, 40]), 16)}${seg(F0, at(c, [70, 0, 0]), `stroke="${C.blue}" stroke-width="2" stroke-dasharray="4 4"`)}${seg(F0, at(c, [0, 0, 52]), `stroke="${C.blue}" stroke-width="2" stroke-dasharray="4 4"`)}</g></g>`;
    const cP = cam(520, 262, YAW, PITCH), sol = prism([[-60, 46], [60, 46], [60, -46], [-60, -46]], 150), pr = proj(sol, cP);
    const front = sol.F.slice(2).map((face, k) => ({ face, fi: k + 2 })).filter(({ fi }) => pr.vis[fi]).reduce((a, b) => (pr.depth[a.fi] > pr.depth[b.fi] ? a : b));
    const [q0, q1, q2, q3] = front.face.map((i) => pr.P[i]);
    const p3 = `<g class="b3">${draw(sol, cP, { face: (fi, k, v) => (fi === front.fi ? `fill="${C.peach}" fill-opacity=".85"` : FILL[k](v)) })}`
      + `<g class="s3" ${delay(1)}>${rmark(q0, q1, q3)}${rmark(q1, q0, q2)}${rmark(q2, q1, q3)}${rmark(q3, q2, q0)}</g></g>`;
    const body = p1 + p2 + p3 + `<g class="b3"><g class="p3" ${delay(1.5)}>${lab(320, 340, '수직', C.red, 26)}</g></g>`;
    put('6-1/수학/2/수직', svg(id, body, motion(id) + `
      .sc-${id} .rot { transform-box: view-box; transform-origin: ${O[0]}px ${O[1]}px; transform: rotate(38deg); }
      .on1 .sc-${id} .rot { transform: none; transition: transform 1.1s ease-in-out .2s; }
      .sc-${id} .pole { stroke-dasharray: 160; stroke-dashoffset: 160; }
      .on2 .sc-${id} .pole { stroke-dashoffset: 0; transition: stroke-dashoffset .9s ease .2s; }`));
  }

  // 각뿔 계열: 바닥 다각형 → 꼭대기 한 점에서 모서리가 내려와 삼각형 옆면이 생김
  const cone = (id, base, Hh, c, beat) => {
    const sol = pyramid(base, Hh), pr = proj(sol, c), n = sol.n, A = pr.P[n];
    const flat = poly(base.map(([x, z]) => at(c, [x, 0, z])), `class="fl" pathLength="1" fill="${C.mint}" stroke="${C.green}" stroke-width="3.5" stroke-linejoin="round"`);
    const order = sol.F.map((_, i) => i).filter((i) => sol.kind[i] === 'side').sort((a, b) => pr.depth[a] - pr.depth[b]);
    let k = 0;
    const fills = order.map((fi) => `<g class="s${beat}" ${delay(pr.vis[fi] ? 1 + .25 * k++ : .9)}>${poly(sol.F[fi].map((i) => pr.P[i]), `class="lt" fill="${C.peach}" fill-opacity="${pr.vis[fi] ? .8 : .3}"`)}</g>`).join('');
    const up = pr.edges.filter((e) => e.b === n).map((e, i) => (e.hidden
      ? `<g class="s${beat}" ${delay(.9)}>${seg(pr.P[e.a], A, DASH)}</g>`
      : `<path class="draw d${beat}" pathLength="1" ${delay(.35 + i * .1)} d="M${P(pr.P[e.a])} L${P(A)}" ${INK}/>`)).join('');
    const baseEdges = pr.edges.filter((e) => e.b !== n);
    return {
      sol, pr, A,
      body: `<g class="b1">${poly(base.map(([x, z]) => at(c, [x, 0, z])), `fill="${C.mint}" fill-opacity=".8"`)}</g>` + `<g class="h${beat}">${flat}</g>` + fills
        + `<g class="b${beat}">${baseEdges.map((e) => seg(pr.P[e.a], pr.P[e.b], e.hidden ? DASH : INK)).join('')}</g>` + up
        + `<g class="p${beat}" ${delay(.2)}>${dot(A, 7, C.red)}</g>`,
      css: `.sc-${id} .fl { stroke-dasharray: 1 1; stroke-dashoffset: 1; } .on1 .sc-${id} .fl { stroke-dashoffset: 0; transition: stroke-dashoffset 1s ease .2s; }`
    };
  };

  // 각뿔: 오각형 → 위의 한 점으로 모서리가 모여 삼각형 옆면들 → 밑면 하나와 삼각형 옆면들
  {
    const id = 't61-m2-gakppul';
    const c = cam(300, 262, YAW, PITCH), g = cone(id, PENT.map(([x, z]) => [x * 1.1, z * 1.1]), 190, c, 2);
    const body = g.body
      + `<g class="b3"><g class="g3" ${delay(.2)}>${g.sol.F.slice(1).map((face) => poly(face.map((i) => g.pr.P[i]), `fill="none" stroke="${C.orange}" stroke-width="4" stroke-linejoin="round"`)).join('')}</g></g>`
      + `<g class="b3"><g class="p3" ${delay(1.4)}>${lab(540, 150, '각뿔', C.green, 30)}</g></g>`
      + `<g class="b3"><g class="s3" ${delay(1.6)}>${lab(540, 220, '옆면', C.orange, 22)}${lab(540, 246, '삼각형', C.orange, 22)}</g></g>`
      + `<g class="s1" ${delay(1.1)}>${lab(300, 346, '밑면', C.green, 22)}</g>`;
    put('6-1/수학/2/각뿔', svg(id, body, motion(id) + g.css));
  }

  const coneNamed = (id, key, base, shape, name) => {
    const c = cam(260, 250, YAW, PITCH), g = cone(id, base, 180, c, 2);
    const body = g.body
      + `<g class="b3"><g class="g3" ${delay(.2)}>${poly(base.map(([x, z]) => at(c, [x, 0, z])), `fill="none" stroke="${C.green}" stroke-width="5" stroke-linejoin="round"`)}</g></g>`
      + `<g class="s1" ${delay(1)}>${lab(260, 344, shape, C.green, 24)}</g>`
      + `<g class="b3"><g class="p3" ${delay(1)}>${lab(510, 170, name, C.green, 30)}</g></g>`
      + `<g class="b3"><g class="s3" ${delay(1.4)}>${lab(510, 212, `면 ${g.sol.F.length}개`, C.muted, 22)}</g></g>`;
    put(key, svg(id, body, motion(id) + g.css));
  };
  coneNamed('t61-m2-samgakppul', '6-1/수학/2/삼각뿔', TRI.map(([x, z]) => [x * 1.1, z * 1.1]), '밑면: 삼각형', '삼각뿔');
  coneNamed('t61-m2-sagakppul', '6-1/수학/2/사각뿔', [[-85, 70], [85, 70], [85, -70], [-85, -70]], '밑면: 사각형', '사각뿔');

  // 각뿔의 꼭짓점: 꼭짓점 여섯 → 옆면이 하나씩 반짝이며 모두 지나는 한 점 → 그 점이 각뿔의 꼭짓점
  {
    const id = 't61-m2-ppulkkok';
    const c = cam(270, 290, YAW, PITCH), sol = pyramid(PENT.map(([x, z]) => [x * 1.1, z * 1.1]), 200), pr = proj(sol, c), n = sol.n, A = pr.P[n];
    const sides = sol.F.map((_, i) => i).filter((i) => sol.kind[i] === 'side').sort((a, b) => pr.depth[a] - pr.depth[b]);
    let k = 0;
    const flash = sides.map((fi) => `<g class="fz" style="animation-delay:${f(.2 + .35 * (pr.vis[fi] ? k++ : 0))}s">${poly(sol.F[fi].map((i) => pr.P[i]), `fill="${C.orange}" fill-opacity="${pr.vis[fi] ? .45 : .2}"`)}</g>`).join('');
    const body = draw(sol, c, { face: (fi, kk, v) => FILL[kk](v) }) + flash
      + `<g class="dim">${pr.P.slice(0, n).map((q, i) => `<g class="p1" ${delay(.2 + i * .15)}>${dot(q, 8, C.red)}</g>`).join('')}</g>`
      + `<g class="p1" ${delay(1)}><g class="apex">${dot(A, 8, C.red)}</g></g>`
      + ring(A, 16, C.red, 'r2', 1.8) + ring(A, 16, C.red, 'r3', .4)
      + `<g class="b3"><g class="p3" ${delay(.6)}><path d="M${f(A[0] + 20)} ${f(A[1] + 4)} L${f(A[0] + 62)} ${f(A[1] + 14)}" stroke="${C.red}" stroke-width="3" stroke-linecap="round"/>${lab(A[0] + 70, A[1] + 22, '각뿔의 꼭짓점', C.red, 26, 'start')}</g></g>`;
    put('6-1/수학/2/각뿔의 꼭짓점', svg(id, body, motion(id) + `
      .sc-${id} .fz { opacity: 0; }
      .on2 .sc-${id} .fz { animation: ${id}-fz 1s ease-in-out both; }
      @keyframes ${id}-fz { 0% { opacity: 0; } 40% { opacity: 1; } 100% { opacity: .5; } }
      .on3 .sc-${id} .fz { animation: none; opacity: 0; transition: opacity .4s ease; }
      .sc-${id} .apex { transform-box: fill-box; transform-origin: center; }
      .on2 .sc-${id} .apex { transform: scale(1.5); transition: transform .4s ease 1.7s; }
      .on3 .sc-${id} .dim { opacity: .3; transition: opacity .5s ease .2s; }`));
  }
})(typeof window !== 'undefined' ? window : globalThis);
