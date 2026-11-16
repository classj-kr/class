// 수학 7-2(중학교 1학년 2학기) 5단원 통계: 낱말 도식
// 자료는 작고 셈이 맞게: 키 152·148·160·155·149 cm(중앙값 152), 책 2·5·3·7·3 권(평균 4, 중앙값·최빈값 3),
// 점수 20개를 10점씩 다섯 계급으로 나누면 도수 2·5·7·4·2(합 20), 상대도수 0.1·0.25·0.35·0.2·0.1(합 1).
// 막대는 scaleY 로 솟고, 수 카드는 translate 로 옮겨 간다.
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
  const KEY = '7-2/수학/5/';
  // 수 카드
  const chip = (x, y, s, { w = 76, h = 44, fill = 'white', c = C.ink, edge = C.line, size = 24 } = {}) =>
    `<rect x="${f(x - w / 2)}" y="${f(y - h / 2)}" width="${w}" height="${h}" rx="9" fill="${fill}" stroke="${edge}" stroke-width="2.5"/>` + lab(x, y + size * .36, s, { c, size });
  // 칸이 열리면 (dx, dy) 만큼 옮겨 가는 것(제자리 → 옮긴 자리)
  const moveCss = (id, n, cls, dur = 1, wait = 0) => `
      .sc-${id} .${cls} { transition: transform ${dur}s ease-in-out ${wait}s; }
      .on${n} .sc-${id} .${cls} { transform: translate(var(--dx), var(--dy)); }`;
  const mv = (cls, dx, dy, inner, d = 0) => `<g class="${cls}" style="--dx:${f(dx)}px;--dy:${f(dy)}px;${d ? `transition-delay:${d}s` : ''}">${inner}</g>`;
  // 아래에서 솟는 막대
  const barCss = (id, n) => `
      .sc-${id} .bar { transform-box: fill-box; transform-origin: 50% 100%; transform: scaleY(0); transition: transform .6s ease-out; }
      .on${n} .sc-${id} .bar { transform: none; }`;
  const bar = (x, y, w, h, fill, d = 0, cls = 'bar') => `<rect class="${cls}" ${st(d)} x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" fill="${fill}" stroke="${C.ink}" stroke-width="2.5"/>`;

  // 점수 자료 20개(50점 이상 100점 미만, 계급의 크기 10점): 2, 5, 7, 4, 2 명
  const SC = [54, 58, 61, 63, 65, 67, 69, 70, 72, 74, 75, 77, 78, 79, 81, 84, 86, 88, 92, 96];
  const CL = [50, 60, 70, 80, 90], CNT = CL.map((a) => SC.filter((v) => v >= a && v < a + 10).length);
  const BAND = [C.peach, C.sky, C.mint, C.lilac, C.peach];
  // 수직선 위 점(가까운 수는 위아래 두 줄로)
  const scoreLine = ({ y = 170, x0 = 60, x1 = 580, from = 50, to = 100 } = {}) => {
    const at = (v) => x0 + (v - from) * (x1 - x0) / (to - from);
    let s = line([x0 - 14, y], [x1 + 14, y], { w: 3 });
    for (let v = from; v <= to; v += 10) s += line([at(v), y - 8], [at(v), y + 8], { w: 2.5 }) + lab(at(v), y + 32, v, { size: 19, w: 600 });
    return { s, at, dotY: (i) => y - 16 - (i % 2) * 18 };
  };

  // 변량: 다섯 명의 키를 막대로 → 키를 수 카드로 늘어놓음 → 카드 하나하나가 변량
  {
    const id = 't72-m5-byeollyang';
    const H = [152, 148, 160, 155, 149], xs = H.map((_, i) => 140 + i * 95), base = 240;
    let body = line([90, base], [570, base], { w: 3 }) + lab(24, 34, '키(cm)', { size: 20, c: C.muted, anchor: 'start' });
    H.forEach((v, i) => {
      const h = (v - 128) * 5.4;
      body += bar(xs[i] - 26, base - h, 52, h, C.sky, .2 + i * .2);
      body += g('s1', lab(xs[i], base - h - 10, v, { size: 22 }), .7 + i * .2);
      body += mv('cd', 0, 0, g('s2', chip(xs[i], 300, v), .2 + i * .25));
      body += ring([xs[i], 300], 20, C.orange, 'r3', .2 + i * .15);
    });
    body += g('b3', g('s3', lab(52, 307, '변량', { c: C.orange, size: 24 }), .1));
    body += g('b3', g('g3', H.map((v, i) => `<rect x="${xs[i] - 38}" y="278" width="76" height="44" rx="9" fill="none" stroke="${C.orange}" stroke-width="4"/>`).join(''), .3));
    put(KEY + '변량', svg(id, body, motion(id) + barCss(id, 1)));
  }

  // 대푯값: 다섯 명이 읽은 책 수 2, 5, 3, 7, 3 → 깔때기로 모아 한 수로 → 평균 4, 중앙값 3, 최빈값 3
  {
    const id = 't72-m5-daepyo';
    const V = [2, 5, 3, 7, 3], xs = V.map((_, i) => 140 + i * 90);
    let body = lab(60, 42, '읽은 책(권)', { size: 19, c: C.muted, anchor: 'start' });
    body += V.map((v, i) => `<g class="fun" style="--dx:${320 - xs[i]}px;--dy:96px;animation-delay:${.2 + i * .15}s">${g('s1', chip(xs[i], 76, v), .1 + i * .15)}</g>`).join('');
    body += g('b2', g('s2', `<path d="M170 122 L470 122 L360 188 L280 188 Z" fill="${C.sky}" fill-opacity=".6" stroke="${C.blue}" stroke-width="3" stroke-linejoin="round"/>`, .1));
    body += g('b2', g('p2', `<rect x="200" y="200" width="240" height="56" rx="12" fill="white" stroke="${C.green}" stroke-width="3.5"/>` + lab(320, 238, '한 수', { c: C.green, size: 26 }), 1.4));
    body += g('b3', g('s3', `<rect x="190" y="200" width="260" height="146" rx="12" fill="white" stroke="${C.green}" stroke-width="3.5"/>`, 0)
      + g('s3', lab(222, 240, '평균', { size: 22, anchor: 'start' }) + lab(418, 240, '4', { c: C.orange, size: 26, anchor: 'end' }), .2)
      + g('s3', lab(222, 282, '중앙값', { size: 22, anchor: 'start' }) + lab(418, 282, '3', { c: C.orange, size: 26, anchor: 'end' }), .6)
      + g('s3', lab(222, 324, '최빈값', { size: 22, anchor: 'start' }) + lab(418, 324, '3', { c: C.orange, size: 26, anchor: 'end' }), 1));
    body += g('p3', lab(540, 280, '대푯값', { c: C.green, size: 30 }), 1.4);
    put(KEY + '대푯값', svg(id, body, motion(id) + `
      .on2 .sc-${id} .fun { animation: ${id}-fun 1.1s ease-in both; }
      @keyframes ${id}-fun { 0% { transform: none; opacity: 1; } 80% { opacity: 1; } 100% { transform: translate(var(--dx), var(--dy)) scale(.4); opacity: 0; } }
      .sc-${id} .fun { transform-box: fill-box; transform-origin: center; }`));
  }

  // 중앙값: 다섯 명의 키 → 작은 값부터 차례로 늘어놓음 → 한가운데 셋째 값 152 가 중앙값(양쪽에 2개씩)
  {
    const id = 't72-m5-jungang';
    const H = [152, 148, 160, 155, 149], sorted = [...H].sort((a, b) => a - b), xs = H.map((_, i) => 120 + i * 100);
    let body = lab(60, 60, '키(cm)', { size: 20, c: C.muted, anchor: 'start' });
    H.forEach((v, i) => { const to = sorted.indexOf(v); body += mv('so', xs[to] - xs[i], 0, g('s1', chip(xs[i], 150, v, { w: 84, h: 52, size: 26 }), .2 + i * .15)); });
    body += g('b2', g('s2', `<path d="M90 214 H560" stroke="${C.blue}" stroke-width="4" fill="none"/><path d="M546 204 L562 214 L546 224" stroke="${C.blue}" stroke-width="4" stroke-linejoin="round" fill="none"/>` + lab(110, 246, '작은 값', { c: C.blue, size: 19, anchor: 'start' }) + lab(560, 246, '큰 값', { c: C.blue, size: 19, anchor: 'end' }), 1.3));
    body += g('b3', g('s3', `<rect x="274" y="120" width="92" height="60" rx="11" fill="${C.peach}" stroke="${C.orange}" stroke-width="4"/>` + lab(320, 159, 152, { c: C.orange, size: 28 }), .1));
    body += ring([320, 150], 44, C.orange, 'r3', .3);
    body += g('b3', g('s3', `<path d="M78 100 H262" stroke="${C.muted}" stroke-width="3" fill="none"/><path d="M378 100 H562" stroke="${C.muted}" stroke-width="3" fill="none"/>` + lab(170, 90, '2개', { c: C.muted, size: 20 }) + lab(470, 90, '2개', { c: C.muted, size: 20 }), .7));
    body += g('p3', lab(320, 310, '중앙값 152', { c: C.orange, size: 30 }), 1.1);
    put(KEY + '중앙값', svg(id, body, motion(id) + moveCss(id, 2, 'so', 1.1, .2)));
  }

  // 최빈값: 신발 치수 일곱 개 → 같은 치수끼리 위로 쌓음 → 가장 높이 쌓인 240 이 최빈값
  {
    const id = 't72-m5-choebin';
    const V = [230, 240, 235, 240, 250, 240, 235], xs = V.map((_, i) => 80 + i * 80);
    const cols = { 230: 120, 235: 220, 240: 320, 245: 420, 250: 520 }, base = 300, hh = 40;
    const seen = {};
    let body = lab(40, 34, '신발 치수(mm)', { size: 19, c: C.muted, anchor: 'start' });
    body += g('b2', g('s2', line([70, base + 4], [570, base + 4], { w: 3 }) + Object.entries(cols).map(([v, x]) => lab(x, base + 32, v, { size: 19, w: 600 })).join(''), .1));
    V.forEach((v, i) => {
      const k = seen[v] = (seen[v] || 0) + 1, tx = cols[v], ty = base - hh / 2 - (k - 1) * hh;
      body += mv('st', tx - xs[i], ty - 76, g('s1', chip(xs[i], 76, v, { w: 70, h: 36, size: 20 }), .1 + i * .12), .2 + i * .12);
    });
    body += g('b3', g('s3', [0, 1, 2].map((k) => chip(320, base - hh / 2 - k * hh, 240, { w: 70, h: 36, size: 20, fill: C.peach })).join(''), .1));
    body += g('b3', g('g3', `<rect x="280" y="${base - 3 * hh - 6}" width="80" height="${3 * hh + 8}" rx="10" fill="none" stroke="${C.orange}" stroke-width="4"/>`, .2));
    body += g('p3', lab(320, 160, '최빈값 240', { c: C.orange, size: 28 }), .8);
    put(KEY + '최빈값', svg(id, body, motion(id) + moveCss(id, 2, 'st', 1)));
  }

  // 줄기와 잎 그림: 몸무게 열 개 → 십의 자리는 줄기, 일의 자리는 잎으로 옮겨 적음 → 줄기 3·4·5, 3 | 6 은 36 kg
  {
    const id = 't72-m5-julgi';
    const W = [36, 42, 51, 38, 45, 40, 53, 39, 47, 44];
    const pos = W.map((_, i) => [120 + (i % 5) * 100, i < 5 ? 62 : 108]);
    const rows = { 3: 212, 4: 254, 5: 296 };
    const leaves = {};
    for (const s of [3, 4, 5]) leaves[s] = W.filter((v) => Math.floor(v / 10) === s).map((v) => v % 10).sort((a, b) => a - b);
    let body = lab(20, 32, '몸무게(kg)', { size: 18, c: C.muted, anchor: 'start' });
    body += W.map((v, i) => g('x2', g('s1', chip(...pos[i], v, { w: 66, h: 38, size: 22 }), .1 + i * .08))).join('');
    body += g('b2', g('s2', lab(150, 168, '줄기', { size: 22 }) + lab(300, 168, '잎', { size: 22 })
      + line([80, 180], [440, 180], { w: 3 }) + line([196, 150], [196, 318], { w: 3 })
      + [3, 4, 5].map((s) => lab(150, rows[s] + 8, s, { size: 26, c: C.blue })).join(''), .1));
    W.forEach((v, i) => {
      const s = Math.floor(v / 10), k = leaves[s].indexOf(v % 10), x = 232 + k * 40, y = rows[s] + 8;
      body += `<g class="fly" style="--dx:${f(pos[i][0] + 10 - x)}px;--dy:${f(pos[i][1] + 8 - y)}px;animation-delay:${f(.3 + i * .1)}s">${lab(x, y, v % 10, { size: 26, c: C.orange })}</g>`;
    });
    body += g('b3', g('g3', `<rect x="118" y="188" width="64" height="126" rx="10" fill="none" stroke="${C.blue}" stroke-width="3.5"/>`, .1)
      + g('g3', `<rect x="210" y="188" width="222" height="126" rx="10" fill="none" stroke="${C.orange}" stroke-width="3.5"/>`, .5));
    body += g('p3', lab(540, 220, '3 | 6', { size: 26 }), 1) + g('p3', lab(540, 256, '= 36 kg', { size: 22, c: C.muted }), 1.2);
    put(KEY + '줄기와 잎 그림', svg(id, body, motion(id) + `
      .sc-${id} .fly { opacity: 0; }
      .on2 .sc-${id} .fly { animation: ${id}-fly .8s ease-in-out both; }
      @keyframes ${id}-fly { 0% { opacity: 0; transform: translate(var(--dx), var(--dy)); } 20% { opacity: 1; } 100% { opacity: 1; transform: none; } }`));
  }

  // 계급: 열두 명의 키를 수직선 위 점으로 → 5 cm 씩 구간으로 나눔 → 150 이상 155 미만이 계급 하나(155 는 다음 구간)
  {
    const id = 't72-m5-gyegeup';
    const H = [142, 146, 148, 150, 151, 153, 155, 155, 157, 158, 161, 163];
    const x0 = 60, x1 = 580, at = (v) => x0 + (v - 140) * (x1 - x0) / 25, y = 210;
    const bandOf = (v) => Math.floor((v - 140) / 5);
    const BC = [C.peach, C.sky, C.mint, C.lilac, C.yellow];
    const DC = [C.orange, C.blue, C.green, C.purple, '#b58a12'];
    let body = '';
    body += [0, 1, 2, 3, 4].map((k) => g('s2', `<rect x="${f(at(140 + 5 * k))}" y="80" width="${f(at(145) - at(140))}" height="${y - 80}" fill="${BC[k]}" fill-opacity=".7"/>`, .1 + k * .15)).join('');
    body += line([x0 - 14, y], [x1 + 14, y], { w: 3 });
    for (let v = 140; v <= 165; v += 5) body += line([at(v), y - 9], [at(v), y + 9], { w: 2.5 }) + lab(at(v), y + 34, v, { size: 19, w: 600 });
    body += lab(x1 + 12, y + 60, '(cm)', { size: 18, c: C.muted, anchor: 'end' });
    const seen = {};
    H.forEach((v, i) => {
      const k = seen[v] = (seen[v] || 0) + 1, p = [at(v), y - 16 - (k - 1) * 22];
      body += g('p1', `<circle cx="${f(p[0])}" cy="${f(p[1])}" r="9" fill="${C.ink}"/>`, .1 + i * .08);
      body += g('b2', g('s2', `<circle cx="${f(p[0])}" cy="${f(p[1])}" r="9" fill="${DC[bandOf(v)]}"/>`, .9));
    });
    body += g('b3', g('g3', `<rect x="${f(at(150))}" y="80" width="${f(at(155) - at(150))}" height="${y - 80}" fill="none" stroke="${C.green}" stroke-width="5"/>`, .1));
    body += g('p3', lab(f((at(150) + at(155)) / 2), 300, '150 이상 155 미만', { c: C.green, size: 24 }), .5);
    body += g('p3', lab(f((at(150) + at(155)) / 2), 60, '계급', { c: C.green, size: 28 }), .9);
    body += ring([at(155), y - 16], 11, C.purple, 'r3', 1.3) + ring([at(155), y - 38], 11, C.purple, 'r3', 1.3);
    put(KEY + '계급', svg(id, body, motion(id)));
  }

  // 계급의 크기: 점수 수직선을 10점씩 나눈 구간 → 60 이상 70 미만의 너비 70 - 60 = 10 → 모든 구간의 너비가 10점
  {
    const id = 't72-m5-gyegeupkeugi';
    const L = scoreLine({ y: 200 });
    let body = CL.map((a, k) => g('s1', `<rect x="${f(L.at(a))}" y="90" width="${f(L.at(a + 10) - L.at(a))}" height="110" fill="${BAND[k]}" fill-opacity=".75" stroke="white" stroke-width="2"/>`, .1 + k * .15)).join('') + L.s;
    body += lab(592, 260, '(점)', { size: 18, c: C.muted, anchor: 'end' });
    const dim = (a, y, c, size) => { const p = L.at(a) + 6, q = L.at(a + 10) - 6; return line([p, y], [q, y], { c, w: 3.5 }) + `<path d="M${f(p + 10)} ${y - 8} L${f(p)} ${y} L${f(p + 10)} ${y + 8} M${f(q - 10)} ${y - 8} L${f(q)} ${y} L${f(q - 10)} ${y + 8}" stroke="${c}" stroke-width="3.5" fill="none" stroke-linejoin="round"/>` + lab((p + q) / 2, y - 14, size, { c, size: 22 }); };
    body += g('b2', g('h3', g('p2', dim(60, 150, C.orange, '10'), .3)));
    body += g('b2', g('h3', g('s2', lab(320, 300, '70 − 60 = 10', { c: C.orange, size: 26 }), 1)));
    body += CL.map((a, k) => g('b3', g('p3', dim(a, 150, C.orange, '10'), .1 + k * .15))).join('');
    body += g('p3', lab(320, 300, '계급의 크기 10점', { c: C.green, size: 28 }), 1.1);
    put(KEY + '계급의 크기', svg(id, body, motion(id)));
  }

  // 도수: 스무 명의 점수 점 → 70 이상 80 미만 구간의 점을 하나씩 셈 → 7 개, 이 계급의 도수는 7
  {
    const id = 't72-m5-dosu';
    const L = scoreLine({ y: 230 });
    let body = g('b2', g('s2', `<rect x="${f(L.at(70))}" y="120" width="${f(L.at(80) - L.at(70))}" height="110" fill="${C.mint}" stroke="${C.green}" stroke-width="3"/>`, .1)) + L.s;
    body += lab(592, 292, '(점)', { size: 18, c: C.muted, anchor: 'end' });
    let n = 0;
    SC.forEach((v, i) => {
      const p = [L.at(v), L.dotY(i)];
      body += g('p1', `<circle cx="${f(p[0])}" cy="${f(p[1])}" r="7" fill="${C.ink}"/>`, .1 + i * .05);
      if (v >= 70 && v < 80) {
        n++;
        body += g('b2', g('p2', `<circle cx="${f(p[0])}" cy="${f(p[1])}" r="8" fill="${C.orange}"/>`, .4 + n * .2));
        body += `<g class="cn${n < 7 ? '' : ' last'}" style="animation-delay:${f(.5 + n * .2)}s">${lab(L.at(75), 106, n, { c: C.orange, size: 30 })}</g>`;
      }
    });
    body += g('p3', lab(L.at(75), 330, '도수 7', { c: C.green, size: 30 }), .3);
    body += g('b3', g('g3', `<rect x="${f(L.at(70))}" y="120" width="${f(L.at(80) - L.at(70))}" height="110" fill="none" stroke="${C.green}" stroke-width="5"/>`, .1));
    body += g('s3', lab(L.at(75), 52, '70 이상 80 미만', { c: C.green, size: 22 }), .6);
    put(KEY + '도수', svg(id, body, motion(id) + `
      .sc-${id} .cn { opacity: 0; }
      .on2 .sc-${id} .cn { animation: ${id}-cn .2s step-end; }
      .on2 .sc-${id} .cn.last { animation: ${id}-pop .5s ease-out both; transform-box: fill-box; transform-origin: center; }
      @keyframes ${id}-cn { 0%, 100% { opacity: 1; } }`));
  }

  // 도수분포표 표 그리기: 계급 | 도수 (| 상대도수)
  const table = ({ x = 90, y = 112, rowH = 31, cols = [{ w: 210, t: '계급(점)' }, { w: 110, t: '도수(명)' }], rows, total, size = 19, rowCls = () => '', hi = -1 }) => {
    const W = cols.reduce((s, c) => s + c.w, 0), N = rows.length + 2;
    let s = `<rect x="${x}" y="${y}" width="${W}" height="${rowH}" fill="${C.mint}"/>`;
    if (hi >= 0) s += `<rect class="hi" x="${x}" y="${y + rowH * (hi + 1)}" width="${W}" height="${rowH}" fill="${C.yellow}" fill-opacity=".55"/>`;
    s += `<rect x="${x}" y="${y}" width="${W}" height="${rowH * N}" fill="none" stroke="${C.ink}" stroke-width="2.5"/>`;
    for (let r = 1; r < N; r++) s += line([x, y + r * rowH], [x + W, y + r * rowH], { w: r === 1 || r === N - 1 ? 2.5 : 1.5, c: r === 1 || r === N - 1 ? C.ink : C.line });
    let cx = x;
    const mids = cols.map((c) => { const m = cx + c.w / 2; cx += c.w; return m; });
    cx = x; cols.slice(0, -1).forEach((c) => { cx += c.w; s += line([cx, y], [cx, y + rowH * N], { w: 2 }); });
    s += cols.map((c, i) => lab(mids[i], y + rowH * .68, c.t, { size: Math.max(18, size - 1) })).join('');
    const cells = (vals, r, cls) => `<g class="${cls}">${vals.map((v, i) => lab(mids[i], y + rowH * (r + .68), v, { size, c: i ? C.ink : C.ink, w: i ? 700 : 600 })).join('')}</g>`;
    let body = '';
    rows.forEach((vals, r) => { body += cells(vals, r + 1, rowCls(r)); });
    return { frame: s, body, foot: cells(total, N - 1, ''), mids, W };
  };
  const clsName = (a) => `${a} 이상 ${a + 10} 미만`;

  // 도수분포표: 점수 점과 다섯 계급 → 계급마다 점을 세어 표에 도수를 적음 → 합계 20, 도수분포표
  {
    const id = 't72-m5-dosubunpo';
    const L = scoreLine({ y: 72, x0: 70, x1: 570 });
    let body = CL.map((a, k) => `<rect x="${f(L.at(a))}" y="22" width="${f(L.at(a + 10) - L.at(a))}" height="50" fill="${BAND[k]}" fill-opacity=".75"/>`).join('') + L.s.replace(/font-size="19"/g, 'font-size="18"');
    SC.forEach((v, i) => { body += g('p1', `<circle cx="${f(L.at(v))}" cy="${f(64 - (i % 2) * 18 + 4)}" r="6" fill="${C.ink}"/>`, .1 + i * .05); });
    const T = table({ x: 110, y: 132, rows: CL.map((a, k) => [clsName(a), CNT[k]]), total: ['합계', 20], rowCls: (r) => `s2 rw${r}` });
    body += g('b2', T.frame) + T.body.replace(/class="s2 rw(\d)"/g, (m, r) => `${m} ${st(.2 + r * .35)}`);
    body += g('b3', g('s3', T.foot, .2));
    body += g('b3', g('g3', `<rect x="${110 + 210}" y="${132 + 31}" width="110" height="${31 * 6}" fill="none" stroke="${C.orange}" stroke-width="4"/>`, .5));
    body += g('p3', lab(530, 250, '도수분포표', { c: C.green, size: 28 }), 1);
    put(KEY + '도수분포표', svg(id, body, motion(id)));
  }

  // 히스토그램 축: 가로 계급(점), 세로 도수(명)
  const histo = ({ from = 50, to = 100, x0 = 110, x1 = 560, y0 = 300, unitH = 30 } = {}) => {
    const at = (v) => x0 + (v - from) * (x1 - x0) / (to - from), yv = (n) => y0 - n * unitH;
    let s = '';
    for (let n = 1; n <= 7; n++) s += line([x0, yv(n)], [x1 + 10, yv(n)], { w: 1.2, c: C.line }) + lab(x0 - 12, yv(n) + 7, n, { size: 18, w: 600, anchor: 'end' });
    s += line([x0, y0], [x1 + 18, y0], { w: 3 }) + line([x0, y0], [x0, yv(7) - 18], { w: 3 }) + lab(x0 - 12, y0 + 7, 0, { size: 18, w: 600, anchor: 'end' });
    for (let v = from; v <= to; v += 10) s += line([at(v), y0], [at(v), y0 + 7], { w: 2.5 }) + lab(at(v), y0 + 28, v, { size: 18, w: 600 });
    return { s, at, yv };
  };

  // 히스토그램: 가로축 점수, 세로축 학생 수 → 계급마다 도수만큼 직사각형이 솟음 → 히스토그램
  {
    const id = 't72-m5-histogram';
    const Hs = histo();
    let body = g('s1', Hs.s, .1);
    body += g('s1', lab(582, 328, '(점)', { size: 18, c: C.muted, anchor: 'start' }) + lab(110, 66, '(명)', { size: 18, c: C.muted }), .4);
    CL.forEach((a, k) => {
      body += bar(Hs.at(a), Hs.yv(CNT[k]), Hs.at(a + 10) - Hs.at(a), CNT[k] * 30, C.sky, .2 + k * .3);
      body += g('s2', lab(Hs.at(a + 5), Hs.yv(CNT[k]) - 10, CNT[k], { c: C.blue, size: 22 }), .7 + k * .3);
    });
    body += g('b3', g('g3', CL.map((a, k) => `<rect x="${f(Hs.at(a))}" y="${f(Hs.yv(CNT[k]))}" width="${f(Hs.at(a + 10) - Hs.at(a))}" height="${CNT[k] * 30}" fill="none" stroke="${C.orange}" stroke-width="4"/>`).join(''), .1));
    body += g('p3', lab(582, 288, '계급', { c: C.green, size: 20, anchor: 'start' }), .6) + g('p3', lab(110, 40, '도수', { c: C.green, size: 20 }), .8);
    body += g('p3', lab(470, 70, '히스토그램', { c: C.green, size: 28 }), 1.1);
    put(KEY + '히스토그램', svg(id, body, motion(id) + barCss(id, 2)));
  }

  // 도수분포다각형: 히스토그램 → 막대 윗변의 가운데 점, 양 끝에 도수 0 인 계급의 가운데 점 → 점을 선분으로 이음
  {
    const id = 't72-m5-dabakgak';
    const Hs = histo({ from: 40, to: 110, x0: 100, x1: 580 });
    const pts = [[45, 0]].concat(CL.map((a, k) => [a + 5, CNT[k]]), [[105, 0]]).map(([v, n]) => [Hs.at(v), Hs.yv(n)]);
    let body = Hs.s + lab(600, 328, '(점)', { size: 18, c: C.muted, anchor: 'start' }) + lab(100, 66, '(명)', { size: 18, c: C.muted });
    body += g('x3', CL.map((a, k) => `<rect x="${f(Hs.at(a))}" y="${f(Hs.yv(CNT[k]))}" width="${f(Hs.at(a + 10) - Hs.at(a))}" height="${CNT[k] * 30}" fill="${C.sky}" stroke="${C.ink}" stroke-width="2.5"/>`).join(''));
    body += pts.map((p, i) => g('p2', dot(p, { r: 7, c: i === 0 || i === pts.length - 1 ? C.red : C.orange }), .2 + i * .2)).join('');
    body += ring(pts[0], 9, C.red, 'r2', 1.6) + ring(pts[pts.length - 1], 9, C.red, 'r2', 1.6);
    body += pathD(`M${pts.map(P).join(' L')}`, { c: C.orange, w: 5, cls: 'd3', d: .2 });
    body += pts.map((p, i) => g('b3', dot(p, { r: 7, c: i === 0 || i === pts.length - 1 ? C.red : C.orange }))).join('');
    body += g('p3', lab(470, 70, '도수분포다각형', { c: C.green, size: 26 }), 1.4);
    put(KEY + '도수분포다각형', svg(id, body, motion(id) + `.sc-${id} .d3 { transition-duration: 1.4s; }`));
  }

  // 상대도수: 스무 명 가운데 70 이상 80 미만은 7 명 → 7 ÷ 20 = 0.35 → 계급마다 상대도수, 모두 더하면 1
  {
    const id = 't72-m5-sangdae';
    let body = lab(130, 50, '전체 20명', { size: 22 });
    for (let i = 0; i < 20; i++) {
      const r = Math.floor(i / 5), c = i % 5, x = 34 + c * 40, y = 70 + r * 40;
      body += `<rect x="${x}" y="${y}" width="34" height="34" rx="6" fill="white" stroke="${C.line}" stroke-width="2.5"/>`;
      if (i < 7) body += g('p1', `<rect x="${x}" y="${y}" width="34" height="34" rx="6" fill="${C.orange}" fill-opacity=".85"/>`, .3 + i * .15);
    }
    body += g('s1', lab(130, 262, '70 이상 80 미만', { c: C.orange, size: 20 }) + lab(130, 290, '7명', { c: C.orange, size: 22 }), 1.4);
    body += g('b2', g('p2', `<rect x="12" y="304" width="236" height="46" rx="10" fill="${C.peach}"/>` + lab(130, 336, '7 ÷ 20 = 0.35', { c: C.ink, size: 26 }), .3));
    const T = table({ x: 262, y: 54, rowH: 36, cols: [{ w: 188, t: '계급(점)' }, { w: 72, t: '도수' }, { w: 104, t: '상대도수' }], rows: CL.map((a, k) => [clsName(a), CNT[k], +(CNT[k] / 20).toFixed(2)]), total: ['합계', 20, 1], size: 18, rowCls: (r) => `s3 rv${r}`, hi: 2 });
    body += g('b3', T.frame.replace('class="hi"', `class="s3" ${st(.2)}`)) + T.body.replace(/class="s3 rv(\d)"/g, (m, r) => `${m} ${st(.3 + r * .2)}`);
    body += g('b3', g('s3', T.foot, 1.4));
    body += g('p3', lab(452, 352, '상대도수', { c: C.green, size: 22 }), 1.8);
    put(KEY + '상대도수', svg(id, body, motion(id)));
  }
})(typeof window !== 'undefined' ? window : globalThis);
