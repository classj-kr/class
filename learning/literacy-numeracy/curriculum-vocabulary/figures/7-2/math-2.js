// 수학 7-2(중학교 1학년 2학기) 2단원 작도와 합동: 낱말 도식
// 작도는 눈금 없는 자와 컴퍼스로 정삼각형을 그린다(컴퍼스는 바늘 끝을 축으로 돌고, 호는 stroke-dashoffset 으로 함께 그려진다).
// 합동은 한 삼각형을 옮기고 돌려(transform) 다른 삼각형에 포갠다. 움직임은 transform·opacity·stroke-dashoffset 만.
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
  const KEY = '7-2/수학/2/';
  // 화면 위 각도(오른쪽 0°, 시계 반대 방향)와 삼각형 안쪽 각 표시
  const ang = (V, Q) => (Math.atan2(V[1] - Q[1], Q[0] - V[0]) / D + 360) % 360;
  const angAt = (V, P1, P2, r, fill, extra = '') => {
    let a1 = ang(V, P1), a2 = ang(V, P2);
    if ((a2 - a1 + 360) % 360 > 180) [a1, a2] = [a2, a1];
    if (a2 < a1) a2 += 360;
    return sector(V, r, a1, a2, fill, extra);
  };
  const cen = (T) => [(T[0][0] + T[1][0] + T[2][0]) / 3, (T[0][1] + T[1][1] + T[2][1]) / 3];
  const out = (V, G, d = 24) => add(add(V, mul(unit(sub(V, G)), d)), [0, 8]);
  const tri = (T, attr) => poly(T, attr);
  const vlabels = (T, names, cs = [C.ink, C.ink, C.ink], size = 24) => { const G = cen(T); return T.map((V, i) => lab(...out(V, G), names[i], { c: cs[i], size })).join(''); };
  const tint = (s, c, op) => s.replace(`fill="${c}"`, `fill="${c}" fill-opacity="${op}"`);

  // 작도: 눈금 없는 자로 선분 AB → 컴퍼스로 A, B 에서 AB 길이만큼 호 → 두 호가 만나는 C 와 이어 정삼각형
  {
    const id = 't72-m2-jakdo';
    const A = [200, 280], B = [400, 280], R = 200, Cp = [300, 280 - 200 * Math.sin(60 * D)];
    const arcA = `M${P(pol(A, R, 40))} A${R} ${R} 0 0 0 ${P(pol(A, R, 80))}`, arcB = `M${P(pol(B, R, 100))} A${R} ${R} 0 0 0 ${P(pol(B, R, 140))}`;
    const compass = (pv, hl) => {
      const pen = add(pv, [R, 0]), hin = add(pv, hl);
      return line(pv, hin, { w: 5, c: C.muted }) + line(hin, pen, { w: 5, c: C.muted })
        + line(hin, add(hin, mul(unit(sub(hin, mid(pv, pen))), 28)), { w: 9, c: C.ink })
        + `<circle cx="${f(hin[0])}" cy="${f(hin[1])}" r="8" fill="${C.ink}"/>` + `<circle cx="${f(pen[0])}" cy="${f(pen[1])}" r="6" fill="${C.orange}"/>`;
    };
    const ruler = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="5" fill="${C.sky}" stroke="${C.blue}" stroke-width="3"/>`;
    const miniCompass = (x, y) => line([x, y], [x - 30, y + 70], { w: 5, c: C.muted }) + line([x, y], [x + 30, y + 70], { w: 5, c: C.muted }) + line([x, y], [x, y - 22], { w: 9 })
      + `<circle cx="${x}" cy="${y}" r="7" fill="${C.ink}"/><circle cx="${x + 30}" cy="${y + 70}" r="5" fill="${C.orange}"/>`;
    const drawable = (s) => s.replace('<path ', '<path pathLength="1" ');
    const body = g('h2', g('rl', ruler(192, 290, 216, 30)) + g('s1', lab(300, 346, '눈금 없는 자', { c: C.blue, size: 22 }), .9))
      + line(A, B, { w: 5, cls: 'd1', d: .9 })
      + dot(A, { r: 7 }) + dot(B, { r: 7 }) + lab(184, 300, 'A', { size: 24, anchor: 'end' }) + lab(416, 300, 'B', { size: 24, anchor: 'start' })
      + drawable(pathD(arcA, { c: C.orange, w: 4, cls: 'aa' })) + drawable(pathD(arcB, { c: C.orange, w: 4, cls: 'ab' }))
      + `<g class="ca">${compass(A, [100, -150])}</g><g class="cb">${compass(B, [100, 150])}</g>`
      + line(A, Cp, { w: 5, cls: 'd3', d: .5 }) + line(B, Cp, { w: 5, cls: 'd3', d: .5 })
      + g('p3', dot(Cp, { r: 8, c: C.orange }), .2) + ring(Cp, 10, C.orange, 'r3', .3) + g('s3', lab(300, Cp[1] - 18, 'C', { size: 24 }), .3)
      + g('b3', g('s3', tick(A, B) + tick(B, Cp) + tick(Cp, A), 1.3))
      + g('b3', g('s3', ruler(480, 112, 130, 24) + lab(545, 168, '눈금 없는 자', { c: C.blue, size: 19 }) + miniCompass(545, 214) + lab(545, 318, '컴퍼스', { c: C.muted, size: 20 }), 1.6));
    const t = (v) => +v.toFixed(2);
    put(KEY + '작도', svg(id, body, motion(id) + `
      .sc-${id} .rl { opacity: 0; transform: translateY(30px); }
      .on1 .sc-${id} .rl { opacity: 1; transform: none; transition: opacity .4s ease .1s, transform .7s ease .1s; }
      .sc-${id} :is(.aa,.ab) { stroke-dasharray: 1 1; stroke-dashoffset: 1; }
      .on2 .sc-${id} .aa { stroke-dashoffset: 0; transition: stroke-dashoffset ${t(1.5 * .68)}s linear ${t(.1 + 1.5 * .12)}s; }
      .on2 .sc-${id} .ab { stroke-dashoffset: 0; transition: stroke-dashoffset ${t(1.5 * .68)}s linear ${t(1.7 + 1.5 * .12)}s; }
      .sc-${id} .ca { opacity: 0; transform-box: view-box; transform-origin: ${A[0]}px ${A[1]}px; }
      .sc-${id} .cb { opacity: 0; transform-box: view-box; transform-origin: ${B[0]}px ${B[1]}px; }
      .on2 .sc-${id} .ca { animation: ${id}-ca 1.5s linear .1s both; }
      .on2 .sc-${id} .cb { animation: ${id}-cb 1.5s linear 1.7s both; }
      @keyframes ${id}-ca { 0%, 12% { opacity: 1; transform: rotate(-40deg); } 80% { opacity: 1; transform: rotate(-80deg); } 100% { opacity: 0; transform: rotate(-80deg); } }
      @keyframes ${id}-cb { 0%, 12% { opacity: 1; transform: rotate(-100deg); } 80% { opacity: 1; transform: rotate(-140deg); } 100% { opacity: 0; transform: rotate(-140deg); } }`));
  }

  // 같은 삼각형 ABC (대변·대각)
  const T = [[250, 70], [90, 290], [470, 290]], [TA, TB, TC] = T;
  const triBase = () => pathD(`M${P(TA)} L${P(TB)} L${P(TC)} Z`, { w: 4, cls: 'd1', d: .1 })
    + g('s1', tri(T, `fill="${C.mint}" fill-opacity=".35"`), .6) + g('s1', vlabels(T, ['A', 'B', 'C']), .7);
  const side = (p, q, c, cls, d = 0) => line(p, q, { c, w: 8, cls, d });
  const angS = (k, c, cls, d = 0) => g(cls, tint(angAt(T[k], T[(k + 1) % 3], T[(k + 2) % 3], 40, c), c, .75), d);

  // 대변: 삼각형 ABC → ∠A 와 마주 보는 변 BC → ∠B 와 변 CA, ∠C 와 변 AB 도 짝
  {
    const id = 't72-m2-daebyeon';
    const body = triBase()
      + angS(0, C.orange, 'p2', .1) + side(TB, TC, C.orange, 'd2', .7)
      + g('s2', `<path d="M252 114 L272 270" stroke="${C.orange}" stroke-width="3" stroke-dasharray="6 6" fill="none"/>`, .5)
      + g('p2', lab(280, 336, '∠A의 대변', { c: C.orange, size: 22 }), 1.4)
      + angS(1, C.blue, 'p3', .1) + side(TC, TA, C.blue, 'd3', .3)
      + g('p3', lab(392, 160, '∠B의 대변', { c: C.blue, size: 22, anchor: 'start' }), .8)
      + angS(2, C.green, 'p3', .8) + side(TA, TB, C.green, 'd3', 1)
      + g('p3', lab(150, 160, '∠C의 대변', { c: C.green, size: 22, anchor: 'end' }), 1.5);
    put(KEY + '대변', svg(id, body, motion(id)));
  }

  // 대각: 삼각형 ABC → 변 BC 와 마주 보는 각 ∠A → 변 CA 와 ∠B, 변 AB 와 ∠C 도 짝
  {
    const id = 't72-m2-daegak';
    const body = triBase()
      + side(TB, TC, C.orange, 'd2', .1) + angS(0, C.orange, 'p2', .9) + ring(TA, 14, C.orange, 'r2', 1)
      + g('p2', lab(292, 84, '변 BC의 대각', { c: C.orange, size: 22, anchor: 'start' }), 1.4)
      + side(TC, TA, C.blue, 'd3', .1) + angS(1, C.blue, 'p3', .6)
      + g('p3', lab(112, 342, '변 CA의 대각', { c: C.blue, size: 21 }), .8)
      + side(TA, TB, C.green, 'd3', .8) + angS(2, C.green, 'p3', 1.3)
      + g('p3', lab(448, 342, '변 AB의 대각', { c: C.green, size: 21 }), 1.5);
    put(KEY + '대각', svg(id, body, motion(id)));
  }

  // 끼인각: 변 AB, AC 두 개 → 두 변 사이의 ∠A 가 끼인각 → 세 번째 변 BC 를 이으면 삼각형이 하나로 정해짐
  {
    const id = 't72-m2-kkiingak';
    const A = [250, 70], B = [100, 290], Cc = [480, 290], G = cen([A, B, Cc]);
    const wedge = () => tint(angAt(A, B, Cc, 52, C.green), C.green, .55);
    const body = line(A, B, { c: C.orange, w: 7, cls: 'd1', d: .2 }) + line(A, Cc, { c: C.blue, w: 7, cls: 'd1', d: .7 })
      + g('s1', lab(...out(A, G), 'A', { size: 24 }) + lab(...out(B, G), 'B', { size: 24 }) + lab(...out(Cc, G), 'C', { size: 24 }), 1)
      + dot(A, { r: 6 }) + dot(B, { r: 6 }) + dot(Cc, { r: 6 })
      + g('p2', wedge(), .2) + ring(A, 16, C.green, 'r2', .5)
      + g('p2', lab(330, 70, '끼인각', { c: C.green, size: 26, anchor: 'start' }), .9)
      + line(B, Cc, { w: 5, cls: 'd3', d: .3 })
      + g('b3', g('s3', tri([A, B, Cc], `fill="${C.mint}" fill-opacity=".45"`), 1))
      + g('s2', lab(250, 158, '∠A', { c: C.green, size: 22 }), .6)
      + g('b3', g('g3', wedge(), 1.2));
    put(KEY + '끼인각', svg(id, body, motion(id)));
  }

  // 합동: △ABC 와 돌아간 △DEF → △ABC 를 옮기고 돌려 포개면 꼭 겹침 → △ABC ≡ △DEF, 대응점 → 합동 조건 SSS·SAS·ASA
  {
    const id = 't72-m2-hapdong';
    const ABC = [[120, 80], [60, 250], [240, 250]], G = cen(ABC), G2 = [455, 185], PHI = 35;
    const rot = (X) => { const c = Math.cos(PHI * D), s = Math.sin(PHI * D), x = X[0] - G[0], y = X[1] - G[1]; return [G2[0] + x * c - y * s, G2[1] + x * s + y * c]; };
    const DEF = ABC.map(rot);
    const cs = [C.orange, C.blue, C.green];
    // 합동 조건: 작은 삼각형 한 쌍씩
    const sm = [[-44, 34], [44, 34], [-10, -42]], tk = { c: C.red, len: 7 };
    const pair = (cx, kind) => {
      let s = '';
      for (const dx of [-51, 51]) {
        const t = sm.map(([x, y]) => [cx + dx + x, 200 + y]);
        s += tri(t, `fill="${C.mint}" fill-opacity=".6" stroke="${C.ink}" stroke-width="3" stroke-linejoin="round"`);
        if (kind === 'SSS') s += tick(t[0], t[1], { ...tk, n: 1 }) + tick(t[1], t[2], { ...tk, n: 2 }) + tick(t[2], t[0], { ...tk, n: 3 });
        if (kind === 'SAS') s += tick(t[0], t[1], { ...tk, n: 1 }) + tick(t[2], t[0], { ...tk, n: 2 }) + angAt(t[0], t[1], t[2], 18, C.orange);
        if (kind === 'ASA') s += tick(t[0], t[1], { ...tk, n: 1 }) + angAt(t[0], t[1], t[2], 16, C.orange) + angAt(t[1], t[0], t[2], 16, C.blue);
      }
      return s + lab(cx, 290, kind, { c: C.green, size: 24 }) + lab(cx, 318, '합동', { c: C.green, size: 20 });
    };
    const body = g('h4', tri(ABC, `fill="${C.mint}" stroke="${C.ink}" stroke-width="3.5" stroke-linejoin="round"`)
        + tri(DEF, `fill="${C.peach}" stroke="${C.ink}" stroke-width="3.5" stroke-linejoin="round"`)
        + g('h3', vlabels(ABC, ['A', 'B', 'C']) + vlabels(DEF, ['D', 'E', 'F']))
        + g('b3', vlabels(ABC, ['A', 'B', 'C'], cs) + vlabels(DEF, ['D', 'E', 'F'], cs))
        + `<g class="mv">${g('b2', tri(ABC, `fill="none" stroke="${C.green}" stroke-width="6" stroke-linejoin="round"`))}</g>`
        + g('b3', g('p3', lab(320, 340, '△ABC ≡ △DEF', { c: C.green, size: 30 }), .3)))
      + g('b4', g('s4', pair(110, 'SSS'), .1) + g('s4', pair(320, 'SAS'), .6) + g('s4', pair(530, 'ASA'), 1.1));
    put(KEY + '합동', svg(id, body, motion(id) + `
      .sc-${id} .mv { transform-box: view-box; transform-origin: ${f(G[0])}px ${f(G[1])}px; }
      .on2 .sc-${id} .mv { transform: translate(${f(G2[0] - G[0])}px, ${f(G2[1] - G[1])}px) rotate(${PHI}deg); transition: transform 1.6s ease-in-out .3s; }`));
  }
})(typeof window !== 'undefined' ? window : globalThis);
