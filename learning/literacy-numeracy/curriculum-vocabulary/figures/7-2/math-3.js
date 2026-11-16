// 수학 7-2(중학교 1학년 2학기) 3단원 평면도형: 낱말 도식
// 원은 path 두 반원으로 그려 stroke-dashoffset 으로 그려지게 한다. 부채꼴·활꼴 조각은 감싼 <g> 를 옮겨 빼낸다.
// 외각은 ∠B 를 BC 따라 옮기고(동위각) ∠A 를 AC 의 가운데 점 둘레로 반 바퀴 돌려(엇각) 외각에 채운다.
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
  const KEY = '7-2/수학/3/';
  const tint = (s, c, op) => s.replace(`fill="${c}"`, `fill="${c}" fill-opacity="${op}"`);
  // 원 한 바퀴(그려지는 원): 오른쪽 끝에서 시작해 시계 반대 방향
  const circle = (O, r, { c = C.ink, w = 4, cls = 'd1', d = 0, fill = 'none' } = {}) =>
    pathD(`M${P(pol(O, r, 0))} A${r} ${r} 0 1 0 ${P(pol(O, r, 180))} A${r} ${r} 0 1 0 ${P(pol(O, r, 0))}`, { c, w, cls, d, fill });
  const arcD = (O, r, a1, a2) => `M${P(pol(O, r, a1))} A${r} ${r} 0 ${a2 - a1 > 180 ? 1 : 0} 0 ${P(pol(O, r, a2))}`;
  const drawable = (s) => (s.includes('pathLength') ? s : s.replace('<path ', '<path pathLength="1" '));

  // 내각: 오각형 → 꼭짓점마다 이웃한 두 변이 안쪽에 만드는 각 → 다섯 각 모두 내각(정오각형은 108°)
  {
    const id = 't72-m3-naegak';
    const O = [320, 196], R = 132, as = [90, 162, 234, 306, 18], V = as.map((a) => pol(O, R, a));
    // 꼭짓점 k 의 안쪽 각: 이웃 두 꼭짓점 방향 사이
    const dir = (p, q) => (Math.atan2(p[1] - q[1], q[0] - p[0]) / D + 360) % 360;
    const inner = (k, r, fill) => { let a1 = dir(V[k], V[(k + 1) % 5]), a2 = dir(V[k], V[(k + 4) % 5]); if ((a2 - a1 + 360) % 360 > 180) [a1, a2] = [a2, a1]; if (a2 < a1) a2 += 360; return sector(V[k], r, a1, a2, fill); };
    const body = pathD(`M${V.map(P).join(' L')} Z`, { w: 5, cls: 'd1', d: .2 })
      + g('s1', poly(V, `fill="${C.mint}" fill-opacity=".4"`), 1)
      + V.map((_, k) => g('p2', tint(inner(k, 34, C.orange), C.orange, .7), .2 + k * .3)).join('')
      + g('b3', g('g3', V.map((_, k) => tint(inner(k, 34, C.orange), C.orange, .7)).join(''), .1))
      + g('p3', lab(320, 120, '108°', { c: C.orange, size: 22 }), .5)
      + g('p3', lab(320, 214, '내각', { c: C.green, size: 32 }), .9);
    put(KEY + '내각', svg(id, body, motion(id)));
  }

  // 외각: 삼각형 ABC 에서 BC 를 늘인 선과 변 CA 가 이루는 각 → 내각 50° + 외각 130° = 180° → 외각 = ∠A 70° + ∠B 60°
  {
    const id = 't72-m3-oegak';
    const B = [90, 280], Cc = [350, 280], AB = 260 * Math.sin(50 * D) / Math.sin(70 * D), A = pol(B, AB, 60), Dd = [575, 280];
    const Mac = mid(A, Cc);
    const body = pathD(`M${P(A)} L${P(B)} L${P(Cc)} Z`, { w: 4.5, cls: 'd1', d: .1 })
      + g('s1', line(Cc, Dd, { w: 4, c: C.muted, dash: '9 8' }), .8)
      + lab(A[0], A[1] - 16, 'A', { size: 24 }) + lab(B[0] - 14, B[1] + 8, 'B', { size: 24, anchor: 'end' }) + lab(Cc[0], Cc[1] + 34, 'C', { size: 24 }) + lab(Dd[0] + 4, Dd[1] + 34, 'D', { size: 24 })
      + g('h3', g('p1', tint(sector(Cc, 46, 0, 130, C.orange), C.orange, .7), 1.2))
      + g('b3', sector(Cc, 46, 0, 130, 'none').replace(`stroke="${C.ink}" stroke-width="1.5"`, `stroke="${C.orange}" stroke-width="3"`))
      + g('p1', tint(sector(Cc, 30, 130, 180, C.blue), C.blue, .6), 1.4)
      + g('s1', lab(...add(pol(Cc, 92, 75), [0, 8]), '외각', { c: C.orange, size: 24 }), 1.6)
      + g('s2', pathD(arcD(Cc, 56, 0, 180), { c: C.green, w: 4 }), .1)
      + g('s2', lab(...add(pol(Cc, 64, 148), [-6, 4]), '50°', { c: C.blue, size: 20, anchor: 'end' }) + lab(...add(pol(Cc, 84, 25), [6, 0]), '130°', { c: C.orange, size: 20, anchor: 'start' }), .4)
      + g('b2', g('h3', g('p2', lab(500, 70, '50° + 130° = 180°', { c: C.green, size: 24 }), .9)))
      + g('b3', g('s3', sector(A, 42, 240, 310, C.peach) + sector(B, 42, 0, 60, C.mint), .1))
      + g('b3', g('s3', lab(A[0] + 2, A[1] + 68, '70°', { c: C.purple, size: 20 }) + lab(B[0] + 64, B[1] - 14, '60°', { c: C.green, size: 20 }), .2))
      + `<g class="ma">${g('b3', sector(A, 42, 240, 310, C.purple).replace(`fill="${C.purple}"`, `fill="${C.purple}" fill-opacity=".55"`))}</g>`
      + `<g class="mb">${g('b3', sector(B, 42, 0, 60, C.green).replace(`fill="${C.green}"`, `fill="${C.green}" fill-opacity=".55"`))}</g>`
      + g('b3', g('p3', lab(500, 70, '130° = 70° + 60°', { c: C.orange, size: 24 }), 1.9));
    put(KEY + '외각', svg(id, body, motion(id) + `
      .sc-${id} .ma { transform-box: view-box; transform-origin: ${f(Mac[0])}px ${f(Mac[1])}px; }
      .on3 .sc-${id} .ma { transform: rotate(180deg); transition: transform 1.3s ease-in-out .5s; }
      .on3 .sc-${id} .mb { transform: translate(${Cc[0] - B[0]}px, 0); transition: transform 1.3s ease-in-out .5s; }`));
  }

  const OC = [300, 185], RC = 130;
  const base = (O = OC, R = RC, name = true) => circle(O, R, { d: .1 }) + g('s1', dot(O, { r: 6 }) + (name ? lab(O[0] - 4, O[1] + 30, 'O', { size: 22 }) : ''), .8);

  // 호: 원 위의 두 점 A, B → 두 점 사이의 원의 일부분이 칠해짐 → 호 AB
  {
    const id = 't72-m3-ho';
    const A = pol(OC, RC, 20), B = pol(OC, RC, 110);
    const body = base()
      + g('p1', dot(A, { r: 8 }), 1) + g('p1', dot(B, { r: 8 }), 1.2)
      + g('s1', lab(...add(pol(OC, RC + 26, 20), [0, 8]), 'A', { size: 24 }) + lab(...add(pol(OC, RC + 26, 110), [0, 8]), 'B', { size: 24 }), 1.2)
      + `<g class="lift">${drawable(pathD(arcD(OC, RC, 20, 110), { c: C.orange, w: 9, cls: 'd2', d: .3 }))}</g>`
      + g('p2', lab(...add(pol(OC, RC + 40, 66), [0, 8]), '호 AB', { c: C.orange, size: 26 }), 1.2)
      + g('b3', g('s3', pathD(arcD(OC, RC, 110, 380), { c: C.blue, w: 6 }).replace('stroke-linecap', 'stroke-dasharray="10 9" stroke-linecap'), .3))
      + g('b3', g('s3', dot(A, { r: 8 }) + dot(B, { r: 8 }), .3));
    put(KEY + '호', svg(id, body, motion(id) + `
      .on3 .sc-${id} .lift { animation: ${id}-lift 1.2s ease-in-out .2s 2; }
      @keyframes ${id}-lift { 0%, 100% { transform: none; } 50% { transform: translate(${f(12 * Math.cos(65 * D))}px, ${f(-12 * Math.sin(65 * D))}px); } }`));
  }

  // 현: 원 위의 두 점 A, B 를 곧게 이은 선분 → 같은 두 점을 잇는 호와 다름 → 중심을 지나는 현이 지름
  {
    const id = 't72-m3-hyeon';
    const A = pol(OC, RC, 205), B = pol(OC, RC, 320), E1 = pol(OC, RC, 75), E2 = pol(OC, RC, 255);
    const body = base(OC, RC, false) + g('s1', lab(OC[0] - 16, OC[1] + 8, 'O', { size: 22, anchor: 'end' }), .8)
      + g('s1', dot(A, { r: 8 }) + dot(B, { r: 8 }) + lab(...add(pol(OC, RC + 26, 205), [0, 8]), 'A', { size: 24 }) + lab(...add(pol(OC, RC + 26, 320), [0, 8]), 'B', { size: 24 }), 1)
      + line(A, B, { c: C.blue, w: 7, cls: 'd1', d: 1.3 })
      + g('p1', lab(...add(mid(A, B), [30, 34]), '현 AB', { c: C.blue, size: 22 }), 1.9)
      + drawable(pathD(arcD(OC, RC, 205, 320), { c: C.orange, w: 7, cls: 'd2', d: .2 }))
      + g('p2', lab(...add(pol(OC, RC + 26, 262), [0, 8]), '호 AB', { c: C.orange, size: 22 }), .9)
      + line(E2, E1, { c: C.green, w: 7, cls: 'd3', d: .3 })
      + g('b3', g('g3', line(E2, E1, { c: C.green, w: 7 }), 1.1))
      + g('p3', lab(...add(pol(OC, 84, 104), [0, 8]), '지름', { c: C.green, size: 24 }), 1)
      + g('b3', dot(OC, { r: 6 }));
    put(KEY + '현', svg(id, body, motion(id)));
  }

  // 할선: 원과 떨어진 직선 → 직선이 내려와 원을 가로지르며 두 점에서 만남 → 이 직선이 할선, 원 안쪽 부분은 현
  {
    const id = 't72-m3-halseon';
    const O = [270, 190], R = 120, dv = [Math.cos(15 * D), Math.sin(15 * D)], nv = [-dv[1], dv[0]];
    const Q = add(O, mul(nv, -40)), h = Math.sqrt(R * R - 40 * 40);
    const P1 = add(Q, mul(dv, -h)), P2 = add(Q, mul(dv, h)), shift = mul(nv, -105);
    const body = base(O, R)
      + `<g class="sl">${g('s1', line(add(Q, mul(dv, -330)), add(Q, mul(dv, 340)), { w: 5, c: C.purple }), .9)}</g>`
      + g('p2', dot(P1, { r: 8, c: C.orange }), 1.5) + g('p2', dot(P2, { r: 8, c: C.orange }), 1.6)
      + ring(P1, 10, C.orange, 'r2', 1.6) + ring(P2, 10, C.orange, 'r2', 1.7)
      + g('p3', lab(590, 214, '할선', { c: C.purple, size: 26 }), .3)
      + line(P1, P2, { c: C.orange, w: 8, cls: 'd3', d: .8 })
      + g('p3', lab(...add(Q, [4, 38]), '현', { c: C.orange, size: 24 }), 1.4);
    put(KEY + '할선', svg(id, body, motion(id) + `
      .sc-${id} .sl { transform: translate(${f(shift[0])}px, ${f(shift[1])}px); }
      .on2 .sc-${id} .sl { transform: none; transition: transform 1.3s ease-in-out .2s; }`));
  }

  // 부채꼴: 원에 반지름 OA, OB → 두 반지름과 호로 둘러싸인 조각이 칠해져 밖으로 빠짐 → 부채꼴 AOB
  {
    const id = 't72-m3-buchae';
    const O = [250, 190], R = 130, A = pol(O, R, 10), B = pol(O, R, 80), out = [f(36 * Math.cos(45 * D)), f(-36 * Math.sin(45 * D))];
    const slice = (fill, extra = '') => sector(O, R, 10, 80, fill, extra).replace('stroke-width="1.5"', 'stroke-width="4"');
    const body = base(O, R)
      + line(O, A, { w: 4, cls: 'd1', d: .9 }) + line(O, B, { w: 4, cls: 'd1', d: 1.1 })
      + g('s1', lab(...add(pol(O, R + 24, 10), [0, 8]), 'A', { size: 24 }) + lab(...add(pol(O, R + 24, 80), [0, 8]), 'B', { size: 24 }), 1.4)
      + `<g class="pull">${g('b2', slice(C.peach))}${g('b3', g('s3', drawable(pathD(arcD(O, R, 10, 80), { c: C.orange, w: 7 })), .1))}</g>`
      + g('p3', lab(500, 110, '부채꼴', { c: C.orange, size: 30 }), .5) + g('p3', lab(500, 148, 'AOB', { c: C.orange, size: 24 }), .7)
      + g('s3', lab(...add(pol(O, R + 70, 45), [0, 8]), '호', { c: C.orange, size: 22 }), 1)
      + g('s3', lab(...add(pol(O, 60, 10), [6, 26]), '반지름', { c: C.ink, size: 19 }), 1.2);
    put(KEY + '부채꼴', svg(id, body, motion(id) + `
      .on2 .sc-${id} .pull { transform: translate(${out[0]}px, ${out[1]}px); transition: transform 1s ease-in-out .5s; }`));
  }

  // 중심각: 원을 반지름 여섯 개로 똑같이 자름 → 한 조각이 빠져나옴 → 그 조각의 두 반지름이 이루는 각 60° 가 중심각
  {
    const id = 't72-m3-jungsim';
    const O = [240, 190], R = 130, mv = [f(34 * Math.cos(30 * D)), f(-34 * Math.sin(30 * D))];
    const body = base(O, R, false)
      + [0, 60, 120, 180, 240, 300].map((a, k) => line(O, pol(O, R, a), { w: 4, cls: 'd1', d: .5 + k * .15 })).join('')
      + `<g class="pull">${g('b2', sector(O, R, 0, 60, C.peach).replace('stroke-width="1.5"', 'stroke-width="4"'))}`
      + `${g('b3', g('p3', tint(sector(O, 40, 0, 60, C.orange), C.orange, .8), .2))}${g('b3', g('s3', lab(...add(pol(O, 62, 30), [0, 8]), '60°', { c: C.orange, size: 20 }), .6))}</g>`
      + g('b3', g('s3', lab(500, 120, '360° ÷ 6', { c: C.ink, size: 24 }) + lab(500, 156, '= 60°', { c: C.orange, size: 24 }), 1))
      + g('p3', lab(500, 220, '중심각', { c: C.orange, size: 30 }), 1.5);
    put(KEY + '중심각', svg(id, body, motion(id) + `
      .on2 .sc-${id} .pull { transform: translate(${mv[0]}px, ${mv[1]}px); transition: transform 1s ease-in-out .3s; }`));
  }

  // 활꼴: 원에 현 AB → 현과 호로 둘러싸인 조각이 칠해져 아래로 빠짐 → 활꼴
  {
    const id = 't72-m3-hwalkkol';
    const O = [270, 160], R = 130, A = pol(O, R, 215), B = pol(O, R, 325);
    const seg = `M${P(A)} A${R} ${R} 0 0 0 ${P(B)} Z`;
    const body = base(O, R)
      + g('s1', dot(A, { r: 7 }) + dot(B, { r: 7 }) + lab(A[0] - 14, A[1] + 4, 'A', { size: 24, anchor: 'end' }) + lab(B[0] + 14, B[1] + 4, 'B', { size: 24, anchor: 'start' }), 1)
      + line(A, B, { w: 5, cls: 'd1', d: 1.2 })
      + `<g class="pull">${g('b2', `<path d="${seg}" fill="${C.peach}" stroke="${C.orange}" stroke-width="4" stroke-linejoin="round"/>`)}</g>`
      + g('p2', lab(520, 300, '활꼴', { c: C.orange, size: 30 }), 1.3)
      + g('b3', g('s3', lab(O[0], A[1] - 12, '현', { c: C.blue, size: 22 }), .2))
      + g('b3', g('s3', line(A, B, { c: C.blue, w: 6 }), .2))
      + g('b3', g('s3', drawable(pathD(arcD(O, R, 215, 325), { c: C.orange, w: 7, cls: 'd3', d: .4 }))))
      + g('b3', g('s3', lab(O[0], O[1] + R + 34, '호', { c: C.orange, size: 22 }), .9));
    put(KEY + '활꼴', svg(id, body, motion(id) + `
      .on2 .sc-${id} .pull { animation: ${id}-pull 1.8s ease-in-out .3s both; }
      @keyframes ${id}-pull { 0% { transform: none; } 45%, 60% { transform: translate(0, 34px); } 100% { transform: none; } }`));
  }
})(typeof window !== 'undefined' ? window : globalThis);
