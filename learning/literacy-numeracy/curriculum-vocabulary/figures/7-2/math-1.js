// 수학 7-2(중학교 1학년 2학기) 1단원 기본 도형: 낱말 도식
// 점·선·면·각은 화면 위 좌표로, 직육면체는 앞면을 그대로 두고 뒤로 비스듬히 미는 겨냥도로 그린다(가려진 모서리는 점선).
// 움직임은 transform·opacity·stroke-dashoffset 만 쓴다(아이패드 사파리).
//   각을 접어 포개기·돌려 포개기는 부채꼴 조각을 감싼 <g> 를 옮기거나 돌린다.
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
  const KEY = '7-2/수학/1/';

  // 교점: 두 직선이 엇갈려 한 점에서 만남 → 직선이 평면을 뚫고 한 점에서 만남 → 두 점이 교점
  {
    const id = 't72-m1-gyojeom';
    const X1 = [170, 175], X2 = [480, 215];
    const plane = [[350, 262], [570, 262], [615, 172], [395, 172]];
    const T = [500, 62], dir = [-34, 260], at = (y) => add(T, mul(dir, (y - T[1]) / dir[1]));
    const body = line(pol(X1, 140, 210), pol(X1, 140, 30), { cls: 'd1', d: .1 })
      + line(pol(X1, 130, 135), pol(X1, 130, 315), { cls: 'd1', d: .5 })
      + g('p1', dot(X1, { r: 8, c: C.orange }), 1.2)
      + g('s1', lab(170, 345, '선과 선', { c: C.muted, size: 20 }), 1.4)
      + g('b2', poly(plane, `fill="${C.sky}" fill-opacity=".75" stroke="${C.blue}" stroke-width="3" stroke-linejoin="round"`))
      + g('b2', line(T, X2, { cls: 'd2', d: .3 }) + line(at(262), at(310), { cls: 'd2', d: .9 }) + g('s2', line(X2, at(262), { w: 3, dash: '7 6' }), .8))
      + g('b2', g('p2', dot(X2, { r: 8, c: C.orange }), 1.1) + g('s2', lab(480, 345, '선과 면', { c: C.muted, size: 20 }), 1.3))
      + ring(X1, 10, C.orange, 'r3', .2) + ring(X2, 10, C.orange, 'r3', .2)
      + g('p3', lab(170, 128, '교점', { c: C.orange, size: 24 }), .5) + g('p3', lab(500, 207, '교점', { c: C.orange, size: 24, anchor: 'start' }), .7);
    put(KEY + '교점', svg(id, body, motion(id)));
  }

  // 교선: 바닥 면 위로 벽 면이 내려와 맞닿음 → 맞닿은 곳에 곧은 선 → 정육면체의 이웃한 두 면이 만나는 모서리도 교선
  {
    const id = 't72-m1-gyoseon';
    const F = [[40, 290], [300, 290], [360, 220], [100, 220]], W = [[100, 220], [360, 220], [360, 70], [100, 70]];
    const fr = [440, 180], s = 120, dp = [45, -38];
    const front = [fr, [fr[0] + s, fr[1]], [fr[0] + s, fr[1] + s], [fr[0], fr[1] + s]];
    const top = [front[0], front[1], add(front[1], dp), add(front[0], dp)];
    const side = [front[1], add(front[1], dp), add(front[2], dp), front[2]];
    const body = g('s1', poly(F, `fill="${C.mint}" fill-opacity=".8" stroke="${C.green}" stroke-width="3" stroke-linejoin="round"`))
      + g('wl', poly(W, `fill="${C.peach}" fill-opacity=".8" stroke="${C.orange}" stroke-width="3" stroke-linejoin="round"`))
      + line(W[0], W[1], { c: C.red, w: 7, cls: 'd2', d: .2 })
      + g('p2', lab(230, 264, '교선', { c: C.red, size: 26 }), 1)
      + g('b3', poly(front, `fill="${C.sky}" stroke="${C.ink}" stroke-width="3" stroke-linejoin="round"`)
        + poly(top, `fill="${C.mint}" stroke="${C.ink}" stroke-width="3" stroke-linejoin="round"`)
        + poly(side, `fill="white" stroke="${C.ink}" stroke-width="3" stroke-linejoin="round"`))
      + line(front[0], front[1], { c: C.red, w: 7, cls: 'd3', d: .6 })
      + g('b3', g('g3', line(front[0], front[1], { c: C.red, w: 7 }), 1.4))
      + g('p3', lab(522, 126, '교선', { c: C.red, size: 24 }), 1.2);
    put(KEY + '교선', svg(id, body, motion(id) + `
      .sc-${id} .wl { opacity: 0; transform: translateY(-60px); }
      .on1 .sc-${id} .wl { opacity: 1; transform: none; transition: opacity .4s ease .5s, transform 1.1s ease .5s; }`));
  }

  // 두 점 사이의 거리: A 에서 B 로 가는 굽은 길·꺾인 길 → 곧게 이은 선분 AB 가 가장 짧음 → 자로 재면 6 cm
  {
    const id = 't72-m1-geori';
    const A = [120, 180], B = [520, 180], u = (B[0] - A[0]) / 6;
    let ruler = `<rect x="96" y="272" width="448" height="50" rx="6" fill="white" stroke="${C.muted}" stroke-width="2.5"/>`;
    for (let k = 0; k <= 6; k++) ruler += line([A[0] + k * u, 272], [A[0] + k * u, 288], { w: 2.5 }) + lab(A[0] + k * u, 312, k, { size: 18, w: 600 });
    for (let k = 0; k < 6; k++) ruler += line([A[0] + (k + .5) * u, 272], [A[0] + (k + .5) * u, 281], { w: 2, c: C.muted });
    const body = g('x2', pathD(`M${P(A)} Q320 30 ${P(B)}`, { c: C.muted, w: 4, cls: 'd1', d: .2 }))
      + g('x2', pathD(`M${P(A)} L200 255 L290 150 L380 255 L460 165 L${P(B)}`, { c: C.muted, w: 4, cls: 'd1', d: .8 }))
      + line(A, B, { c: C.orange, w: 7, cls: 'd2', d: .5 })
      + g('b2', g('g2', line(A, B, { c: C.orange, w: 7 }), 1.4))
      + dot(A, { r: 8 }) + dot(B, { r: 8 })
      + lab(98, 188, 'A', { anchor: 'end', size: 26 }) + lab(542, 188, 'B', { anchor: 'start', size: 26 })
      + g('s3', ruler + line([A[0], 192], [A[0], 272], { w: 2.5, c: C.muted, dash: '6 6' }) + line([B[0], 192], [B[0], 272], { w: 2.5, c: C.muted, dash: '6 6' }), .1)
      + g('p3', lab(320, 214, '6 cm', { c: C.orange, size: 28 }), .9);
    put(KEY + '두 점 사이의 거리', svg(id, body, motion(id)));
  }

  // 중점: 8 cm 선분 AB → 오른쪽 반을 M 에서 접어 왼쪽 반에 꼭 포갬 → 펼치면 AM = MB = 4 cm, M 이 중점
  {
    const id = 't72-m1-jungjeom';
    const A = [120, 190], B = [520, 190], M = [320, 190];
    const body = g('h2', line(A, B, { w: 6, cls: 'd1', d: .2 }))
      + g('b2', line(A, M, { c: C.orange, w: 7 }))
      + `<g class="half">${g('b2', line(M, B, { c: C.blue, w: 7 }) + dot(B, { r: 8, c: C.blue }))}</g>`
      + dot(A, { r: 8 }) + g('h2', dot(B, { r: 8 }))
      + lab(A[0], 234, 'A', { size: 26 }) + g('h2', lab(B[0], 234, 'B', { size: 26 })) + g('s3', lab(B[0], 234, 'B', { size: 26 }), .9)
      + g('h3', g('s1', lab(320, 158, '8 cm', { size: 26 }), 1))
      + g('b3', g('s3', lab(220, 158, '4 cm', { c: C.orange, size: 24 }) + lab(420, 158, '4 cm', { c: C.blue, size: 24 }), 1.1)
        + g('s3', tick(A, M) + tick(M, B), 1.1))
      + g('p3', dot(M, { r: 9, c: C.green }), .9) + ring(M, 10, C.green, 'r3', 1)
      + g('p3', lab(320, 234, 'M', { c: C.green, size: 26 }), 1.1)
      + g('p3', lab(320, 286, '중점', { c: C.green, size: 28 }), 1.4);
    put(KEY + '중점', svg(id, body, motion(id) + `
      .sc-${id} .half { transform-box: view-box; transform-origin: ${M[0]}px ${M[1]}px; }
      .on2 .sc-${id} .half { animation: ${id}-fold 1.2s ease-in-out .4s both; }
      .on3 .sc-${id} .half { animation: ${id}-open 1s ease-in-out .1s both; }
      @keyframes ${id}-fold { from { transform: scaleX(1); } to { transform: scaleX(-1); } }
      @keyframes ${id}-open { from { transform: scaleX(-1); } to { transform: scaleX(1); } }`));
  }

  // 평각: ∠AOB = 60° → 변 OB 가 돌아 OA 와 반대쪽으로 뻗어 한 직선 → 180°, 평각
  {
    const id = 't72-m1-pyeonggak';
    const O = [320, 250], R = 60;
    const body = line(O, [585, 250], { w: 5 }) + dot([520, 250], { r: 7 })
      + lab(520, 286, 'A', { size: 24 }) + lab(320, 290, 'O', { size: 24 })
      + pathD(`M${O[0] + R} ${O[1]} A${R} ${R} 0 0 0 ${O[0] - R} ${O[1]}`, { c: C.orange, w: 6, cls: 'arc' }).replace('<path ', '<path pathLength="1" ')
      + `<g class="ray">${line(O, [565, 250], { w: 5, c: C.blue })}${dot([520, 250], { r: 7, c: C.blue })}</g>`
      + dot(O, { r: 7 })
      + g('h2', lab(...pol(O, 200, 60).map((v, i) => v + [22, -4][i]), 'B', { size: 24, c: C.blue, anchor: 'start' }) + lab(...pol(O, 98, 30), '60°', { c: C.orange, size: 24 }))
      + g('b2', g('s2', lab(120, 286, 'B', { size: 24, c: C.blue }), 1.7))
      + g('b3', g('g3', line([100, 250], [585, 250], { c: C.green, w: 5 }), .2))
      + g('p3', lab(320, 172, '180°', { c: C.orange, size: 28 }), .3)
      + g('p3', lab(320, 120, '평각', { c: C.green, size: 30 }), .8);
    put(KEY + '평각', svg(id, body, motion(id) + `
      .sc-${id} .ray { transform-box: view-box; transform-origin: ${O[0]}px ${O[1]}px; transform: rotate(-60deg); }
      .on2 .sc-${id} .ray { transform: rotate(-180deg); transition: transform 1.6s ease-in-out .3s; }
      .sc-${id} .arc { stroke-dasharray: 1 1; stroke-dashoffset: .6667; }
      .on2 .sc-${id} .arc { stroke-dashoffset: 0; transition: stroke-dashoffset 1.6s ease-in-out .3s; }`));
  }

  // 두 직선이 O 에서 만나는 그림(교각·맞꼭지각)
  const O2 = [320, 180], TH = 50;
  const cross = (cls1 = 'd1', cls2 = 'd1') => line([70, 180], [570, 180], { w: 5, cls: cls1, d: .1 }) + line(pol(O2, 190, TH + 180), pol(O2, 190, TH), { w: 5, cls: cls2, d: .5 });
  const ANG = [[0, TH], [TH, 180], [180, 180 + TH], [180 + TH, 360]];
  const NAME = ['a', 'b', 'c', 'd'];
  const angLab = (k, c = C.ink, size = 22) => lab(...add(pol(O2, 86, (ANG[k][0] + ANG[k][1]) / 2), [0, 8]), `∠${NAME[k]}`, { c, size });

  // 교각: 두 직선이 그려짐 → 만난 점 둘레에 각 네 개가 하나씩 → 네 각이 모두 교각
  {
    const id = 't72-m1-gyogak';
    const fills = [C.peach, C.sky, C.mint, C.lilac];
    const body = cross()
      + ANG.map(([a1, a2], k) => g('p2', sector(O2, 52, a1, a2, fills[k]), .2 + k * .4)).join('')
      + ANG.map((_, k) => g('s2', angLab(k), .4 + k * .4)).join('')
      + g('b3', g('g3', ANG.map(([a1, a2], k) => sector(O2, 52, a1, a2, fills[k])).join(''), .1))
      + dot(O2, { r: 7 }) + lab(333, 207, 'O', { size: 22, anchor: 'start' })
      + g('p3', lab(110, 80, '교각', { c: C.green, size: 30 }), .6) + g('s3', lab(110, 116, '4개', { c: C.green, size: 24 }), 1);
    put(KEY + '교각', svg(id, body, motion(id)));
  }

  // 맞꼭지각: 마주 보는 ∠a 와 ∠c → ∠a 를 O 둘레로 반 바퀴 돌리면 ∠c 에 꼭 포개짐(50°) → ∠b 와 ∠d 도 130° 로 같음
  {
    const id = 't72-m1-matkkokji';
    const sa = (fill, k) => sector(O2, 56, ANG[k][0], ANG[k][1], fill);
    const deg = (k, s, c) => lab(...add(pol(O2, 92, (ANG[k][0] + ANG[k][1]) / 2), [0, 8]), s, { c, size: 22 });
    const body = cross()
      + g('s1', sa(C.peach, 0) + sa(C.peach, 2), .9)
      + g('s1', angLab(0, C.orange) + angLab(2, C.orange), 1.1)
      + `<g class="rc1">${g('b2', sa(C.orange, 0).replace('fill="' + C.orange + '"', `fill="${C.orange}" fill-opacity=".55"`))}</g>`
      + g('b3', sa(C.sky, 1) + sa(C.sky, 3))
      + `<g class="rc2">${g('b3', sa(C.blue, 1).replace('fill="' + C.blue + '"', `fill="${C.blue}" fill-opacity=".45"`))}</g>`
      + g('b3', g('s3', angLab(1, C.blue) + angLab(3, C.blue), .1))
      + dot(O2, { r: 7 }) + lab(333, 207, 'O', { size: 22, anchor: 'start' })
      + g('b2', g('p2', lab(40, 60, '∠a = ∠c = 50°', { c: C.orange, size: 26, anchor: 'start' }), 1.7))
      + g('b3', g('p3', lab(40, 100, '∠b = ∠d = 130°', { c: C.blue, size: 26, anchor: 'start' }), 1.7));
    put(KEY + '맞꼭지각', svg(id, body, motion(id) + `
      .sc-${id} :is(.rc1,.rc2) { transform-box: view-box; transform-origin: ${O2[0]}px ${O2[1]}px; }
      .on2 .sc-${id} .rc1 { transform: rotate(180deg); transition: transform 1.3s ease-in-out .3s; }
      .on3 .sc-${id} .rc2 { transform: rotate(180deg); transition: transform 1.3s ease-in-out .3s; }`));
  }

  // 직교: 비스듬히 만나는 AB, CD → CD 가 돌아 교각이 직각 → AB ⊥ CD, 두 직선은 직교
  {
    const id = 't72-m1-jikgyo';
    const O = [300, 190];
    const body = line([80, 190], [520, 190], { w: 5 }) + lab(70, 198, 'A', { size: 24, anchor: 'end' }) + lab(530, 198, 'B', { size: 24, anchor: 'start' })
      + `<g class="rot">${line([300, 56], [300, 324], { w: 5, c: C.blue })}`
      + `<g class="up">${lab(300, 44, 'C', { c: C.blue, size: 24 })}</g><g class="up">${lab(300, 350, 'D', { c: C.blue, size: 24 })}</g></g>`
      + dot(O, { r: 7 })
      + g('b2', g('p2', rmark(O, [400, 190], [300, 90], { s: 26 }), 1.6))
      + g('b2', g('s2', lab(345, 160, '90°', { c: C.red, size: 22, anchor: 'start' }), 1.8))
      + g('p3', lab(520, 80, 'AB ⊥ CD', { c: C.green, size: 30 }), .3)
      + g('p3', lab(520, 124, '직교', { c: C.green, size: 28 }), .8);
    put(KEY + '직교', svg(id, body, motion(id) + `
      .sc-${id} .rot { transform-box: view-box; transform-origin: ${O[0]}px ${O[1]}px; transform: rotate(35deg); }
      .on2 .sc-${id} .rot { transform: none; transition: transform 1.3s ease-in-out .2s; }
      .sc-${id} .up { transform-box: fill-box; transform-origin: center; transform: rotate(-35deg); }
      .on2 .sc-${id} .up { transform: none; transition: transform 1.3s ease-in-out .2s; }`));
  }

  // 수직이등분선: 종이 위 선분 AB → A 쪽 반을 접어 A 를 B 에 포개면 접힌 자국 → 펼치면 자국이 M 을 지나고 AB 와 직교
  {
    const id = 't72-m1-sujigideung';
    const A = [140, 210], B = [500, 210], M = [320, 210];
    const paper = (x) => `<rect x="${x}" y="72" width="230" height="250" fill="${C.mint}" fill-opacity=".6" stroke="${C.line}" stroke-width="2.5"/>`;
    const body = paper(320) + line(M, B, { w: 6 }) + dot(B, { r: 8 })
      + `<g class="half">${paper(90).replace(C.mint, C.peach)}${line(A, M, { w: 6 })}${dot(A, { r: 8, c: C.orange })}</g>`
      + g('h2', lab(A[0], 254, 'A', { size: 26 })) + g('s3', lab(A[0], 254, 'A', { size: 26 }), .9) + lab(B[0], 254, 'B', { size: 26 })
      + ring(B, 10, C.orange, 'r2', 1.5)
      + g('h3', g('s2', line([320, 72], [320, 322], { w: 3, c: C.muted, dash: '8 7' }), 1.6))
      + line([320, 30], [320, 345], { c: C.green, w: 5, cls: 'd3', d: .9 })
      + g('b3', g('s3', rmark(M, [380, 210], [320, 150], { s: 22 }) + tick(A, M) + tick(M, B), 1.5))
      + g('b3', g('p3', dot(M, { r: 8, c: C.green }) + lab(305, 245, 'M', { c: C.green, size: 24, anchor: 'end' }), 1.4))
      + g('p3', lab(336, 54, '수직이등분선', { c: C.green, size: 24, anchor: 'start' }), 1.8);
    put(KEY + '수직이등분선', svg(id, body, motion(id) + `
      .sc-${id} .half { transform-box: view-box; transform-origin: ${M[0]}px ${M[1]}px; }
      .on2 .sc-${id} .half { animation: ${id}-fold 1.3s ease-in-out .2s both; }
      .on3 .sc-${id} .half { animation: ${id}-open 1s ease-in-out .1s both; }
      @keyframes ${id}-fold { from { transform: scaleX(1); } to { transform: scaleX(-1); } }
      @keyframes ${id}-open { from { transform: scaleX(-1); } to { transform: scaleX(1); } }`));
  }

  // 수선의 발: 직선 l 밖의 점 A → A 에서 l 에 수직으로 그은 선이 만나는 점 H → 삼각형 ABC 에서 AH 는 높이, H 가 수선의 발
  {
    const id = 't72-m1-suseon';
    const A = [260, 80], H = [260, 260], B = [110, 260], Cc = [530, 260];
    const body = line([50, 260], [590, 260], { w: 5 }) + lab(604, 268, 'l', { size: 26, anchor: 'start' })
      + g('s1', dot(A, { r: 8 }) + lab(260, 62, 'A', { size: 26 }), .3)
      + line(A, H, { c: C.orange, w: 6, cls: 'd2', d: .2 })
      + g('b2', g('p2', rmark(H, [300, 260], [260, 220], { s: 22 }), 1))
      + g('p2', dot(H, { r: 9, c: C.orange }), 1) + ring(H, 10, C.orange, 'r2', 1.1)
      + g('s2', lab(260, 296, 'H', { c: C.orange, size: 26 }), 1.2)
      + line(A, B, { cls: 'd3', d: .2 }) + line(A, Cc, { cls: 'd3', d: .2 })
      + g('b3', g('s3', dot(B, { r: 7 }) + dot(Cc, { r: 7 }) + lab(110, 296, 'B', { size: 26 }) + lab(530, 296, 'C', { size: 26 }), .6))
      + g('b3', g('g3', line(A, H, { c: C.orange, w: 6 }), 1))
      + g('p3', lab(248, 178, '높이', { c: C.orange, size: 22, anchor: 'end' }), 1)
      + g('p3', lab(260, 336, '수선의 발', { c: C.green, size: 26 }), 1.4);
    put(KEY + '수선의 발', svg(id, body, motion(id)));
  }

  // 꼬인 위치: 직육면체의 모서리 AB → AB 와 만나는 모서리(초록), 평행한 모서리(파랑) → 남은 네 모서리는 만나지도 평행하지도 않음
  {
    const id = 't72-m1-kkoin';
    const V = { A: [200, 160], B: [430, 160], E: [200, 300], F: [430, 300] }, dp = [110, -80];
    V.D = add(V.A, dp); V.C = add(V.B, dp); V.H = add(V.E, dp); V.G = add(V.F, dp);
    const E = (k, o = {}) => line(V[k[0]], V[k[1]], o);
    const hidden = ['DH', 'EH', 'GH'];
    const meet = ['AD', 'BC', 'AE', 'BF'], para = ['DC', 'EF', 'HG'], skew = ['CG', 'DH', 'EH', 'FG'];
    const dash = (k) => (hidden.includes(k) ? '8 7' : '');
    const all = ['AB', 'BC', 'CD', 'DA', 'EF', 'FG', 'GH', 'HE', 'AE', 'BF', 'CG', 'DH'];
    const norm = (k) => all.find((e) => e === k || e === k[1] + k[0]);
    const isHidden = (k) => hidden.some((h) => h === k || h === k[1] + k[0]);
    const body = all.filter((k) => k !== 'AB').map((k) => E(k, { w: isHidden(k) ? 2.5 : 3.5, dash: isHidden(k) ? '8 7' : '' })).join('')
      + E('AB', { c: C.orange, w: 7 })
      + g('b2', g('k2', meet.map((k) => E(k, { c: C.green, w: 6 })).join(''), .2))
      + g('b2', g('k2', para.map((k) => E(k, { c: C.blue, w: 6, dash: isHidden(norm(k)) ? '8 7' : '' })).join(''), 1.1))
      + g('b2', g('s2', `${line([24, 210], [54, 210], { c: C.green, w: 6 })}${lab(62, 217, '만남', { size: 20, anchor: 'start', c: C.green })}`, .2)
        + g('s2', `${line([24, 250], [54, 250], { c: C.blue, w: 6 })}${lab(62, 257, '평행', { size: 20, anchor: 'start', c: C.blue })}`, 1.1))
      + g('b3', g('k3', skew.map((k) => E(k, { c: C.red, w: 6, dash: isHidden(k) ? '9 7' : '' })).join(''), .2))
      + g('p3', `${line([24, 290], [54, 290], { c: C.red, w: 6 })}${lab(62, 297, '꼬인 위치', { size: 21, anchor: 'start', c: C.red })}`, 1.1)
      + Object.entries(V).map(([k, p]) => dot(p, { r: 5, c: k === 'A' || k === 'B' ? C.orange : C.ink })).join('')
      + lab(186, 154, 'A', { anchor: 'end' }) + lab(442, 188, 'B', { anchor: 'start' }) + lab(552, 76, 'C', { anchor: 'start' }) + lab(298, 72, 'D', { anchor: 'end' })
      + lab(188, 322, 'E', { anchor: 'end' }) + lab(442, 322, 'F', { anchor: 'start' }) + lab(552, 236, 'G', { anchor: 'start' }) + lab(322, 212, 'H', { anchor: 'start' });
    void dash;
    put(KEY + '꼬인 위치', svg(id, body, motion(id)));
  }

  // 평행한 두 직선 l, m 과 이를 가로지르는 직선 n (동위각·엇각)
  const X1 = [330, 120], X2 = [250, 250], NA = Math.atan2(130, 80) / D; // n 이 위로 뻗는 방향 약 58.4°
  const lines3 = () => line([60, 120], [580, 120], { w: 5, cls: 'd1', d: .1 }) + line([60, 250], [580, 250], { w: 5, cls: 'd1', d: .3 })
    + line(add(X1, mul([-80, 130], -.5)), add(X1, mul([-80, 130], 1.55)), { w: 5, cls: 'd1', d: .6 })
    + g('s1', chev(500, 120) + chev(500, 250) + lab(594, 128, 'l', { size: 26, anchor: 'start' }) + lab(594, 258, 'm', { size: 26, anchor: 'start' }) + lab(384, 52, 'n', { size: 26 }), 1)
    + dot(X1, { r: 6 }) + dot(X2, { r: 6 });

  // 동위각: l ∥ m 을 n 이 가로지름 → 위 교점의 ∠a 를 n 을 따라 내리면 아래 교점의 ∠b 에 꼭 포개짐 → 같은 자리의 다른 짝도 같음
  {
    const id = 't72-m1-dongwi';
    const r = 46;
    const body = lines3()
      + g('s2', sector(X1, r, 0, NA, C.peach) + sector(X2, r, 0, NA, C.peach), .1)
      + g('s2', lab(...add(pol(X1, 70, 26), [0, 8]), 'a', { c: C.orange, size: 24 }) + lab(...add(pol(X2, 70, 26), [0, 8]), 'b', { c: C.orange, size: 24 }), .2)
      + `<g class="mv">${g('b2', sector(X1, r, 0, NA, C.orange).replace(`fill="${C.orange}"`, `fill="${C.orange}" fill-opacity=".6"`))}</g>`
      + g('b2', g('p2', lab(520, 186, '∠a = ∠b', { c: C.orange, size: 26 }), 1.8))
      + g('b3', g('s3', sector(X1, r, 180, 180 + NA, C.sky) + sector(X2, r, 180, 180 + NA, C.sky), .2))
      + g('b3', g('k3', sector(X1, r, 180, 180 + NA, C.blue).replace(`fill="${C.blue}"`, `fill="${C.blue}" fill-opacity=".4"`) + sector(X2, r, 180, 180 + NA, C.blue).replace(`fill="${C.blue}"`, `fill="${C.blue}" fill-opacity=".4"`), .6))
      + g('p3', lab(520, 226, '동위각', { c: C.green, size: 28 }), 1.2);
    put(KEY + '동위각', svg(id, body, motion(id) + `
      .on2 .sc-${id} .mv { transform: translate(${X2[0] - X1[0]}px, ${X2[1] - X1[1]}px); transition: transform 1.3s ease-in-out .4s; }`));
  }

  // 엇각: l ∥ m 을 n 이 가로지름 → Z 모양 안쪽에 엇갈린 ∠a, ∠b → ∠a 를 n 위의 가운데 점 둘레로 반 바퀴 돌리면 ∠b 에 포개짐
  {
    const id = 't72-m1-eotgak';
    const r = 46, Mid = mid(X1, X2);
    const sA = (fill, op = '') => sector(X1, r, 180, 180 + NA, fill, op);
    const body = lines3()
      + pathD(`M170 120 L${P(X1)} L${P(X2)} L410 250`, { c: C.orange, w: 8, cls: 'd2', d: .2 })
      + g('s2', sA(C.peach) + sector(X2, r, 0, NA, C.peach), 1)
      + g('s2', lab(...add(pol(X1, 70, 206), [0, 8]), 'a', { c: C.orange, size: 24 }) + lab(...add(pol(X2, 70, 26), [0, 8]), 'b', { c: C.orange, size: 24 }), 1.1)
      + g('b2', g('p2', lab(380, 196, 'Z', { c: C.orange, size: 26 }), 1.4))
      + `<g class="rt">${g('b3', sA(C.orange).replace(`fill="${C.orange}"`, `fill="${C.orange}" fill-opacity=".6"`))}</g>`
      + g('b3', g('p3', dot(Mid, { r: 5, c: C.green }), .2))
      + g('b3', g('p3', lab(520, 186, '∠a = ∠b', { c: C.orange, size: 26 }), 1.7))
      + g('p3', lab(520, 226, '엇각', { c: C.green, size: 28 }), 2);
    put(KEY + '엇각', svg(id, body, motion(id) + `
      .sc-${id} .rt { transform-box: view-box; transform-origin: ${f(Mid[0])}px ${f(Mid[1])}px; }
      .on3 .sc-${id} .rt { transform: rotate(180deg); transition: transform 1.4s ease-in-out .3s; }`));
  }
})(typeof window !== 'undefined' ? window : globalThis);
