// 수학 2-2 5단원 표와 그래프: 낱말 도식
// 다섯 낱말이 같은 예시 자료(좋아하는 동물: 개 5, 고양이 4, 토끼 3, 금붕어 2, 합계 14명)를 쓰고, 낱말마다 그 단계를 강조한다.
// 그래프는 교과서처럼 ○ 를 아래에서부터 위로 하나씩.
// 움직임은 transform·opacity·stroke-dashoffset 만(아이패드 사파리).
(function (root) {
  'use strict';
  const { C, svg, text, arrow, put } = root.FigureKit;
  const f = (n) => +(+n).toFixed(1);
  const dl = (s, more = '') => `style="animation-delay:${s}s;transition-delay:${s}s;${more}"`;
  const T = (x, y, s, o = {}) => text(f(x), f(y), s, o);

  // 칸 움직임(N = 1~4): sN 나타나기, pN 튀어나오기, dN 선 그리기(class="dr" pathLength="100"), rN 퍼지는 고리,
  // kN 깜빡이며 남기, fN 날아오기(--dx,--dy 에서 제자리로), mN 옮겨 가 머물기(--mx,--my), gN 사라지기, xN 흐려지기
  const motion = (id) => {
    let css = `
    .sc-${id} :is(.s1,.s2,.s3,.s4,.p1,.p2,.p3,.p4,.f1,.f2,.f3,.f4,.k1,.k2,.k3,.k4){opacity:0}
    .sc-${id} :is(.p1,.p2,.p3,.p4,.ring){transform-box:fill-box;transform-origin:center}
    .sc-${id} .dr{stroke-dasharray:100 110;stroke-dashoffset:101;transition:stroke-dashoffset .6s ease-in-out}
    .sc-${id} :is(.m1,.m2,.m3,.m4){transition:transform .8s ease-in-out}
    .sc-${id} :is(.g1,.g2,.g3,.g4,.x1,.x2,.x3,.x4){transition:opacity .4s linear}
    .sc-${id} .ring{opacity:0}
    @keyframes ${id}-in{from{opacity:0}to{opacity:1}}
    @keyframes ${id}-pop{0%{opacity:0;transform:scale(0)}70%{opacity:1;transform:scale(1.18)}100%{opacity:1;transform:none}}
    @keyframes ${id}-ring{0%{opacity:.9;transform:scale(1)}100%{opacity:0;transform:scale(2.2)}}
    @keyframes ${id}-blink{0%{opacity:0}20%{opacity:1}40%{opacity:.2}60%{opacity:1}80%{opacity:.2}100%{opacity:1}}
    @keyframes ${id}-fly{from{opacity:1;transform:translate(var(--dx),var(--dy))}to{opacity:1;transform:none}}`;
    for (let n = 1; n <= 4; n++) css += `
    .on${n} .sc-${id} .s${n}{animation:${id}-in .4s ease-out both}
    .on${n} .sc-${id} .p${n}{animation:${id}-pop .45s ease-out both}
    .on${n} .sc-${id} .d${n}{stroke-dashoffset:0}
    .on${n} .sc-${id} .r${n}{animation:${id}-ring 1s ease-out 2 both}
    .on${n} .sc-${id} .k${n}{animation:${id}-blink 1.2s ease-in-out both}
    .on${n} .sc-${id} .f${n}{animation:${id}-fly .7s ease-in-out both}
    .on${n} .sc-${id} .m${n}{transform:translate(var(--mx,0px),var(--my,0px))}
    .on${n} .sc-${id} .g${n}{opacity:0}
    .on${n} .sc-${id} .x${n}{opacity:.22}`;
    return css;
  };
  const G = (cls, d, inner, more = '') => `<g class="${cls}" ${dl(d, more)}>${inner}</g>`;
  const ring = (cx, cy, r, color, cls, d = 0) => `<circle class="ring ${cls}" ${dl(d)} cx="${f(cx)}" cy="${f(cy)}" r="${r}" fill="none" stroke="${color}" stroke-width="4"/>`;
  const tag = (x, y, s, color, cls, d = 0, size = 26, anchor = 'middle') => G(cls, d, T(x, y, s, { size, color, anchor }));
  const rect = (x, y, w, h, fill, stroke, sw = 3, rx = 6) => `<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="${rx}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
  const pill = (cx, cy, w, s, color, fill, size = 28) => rect(cx - w / 2, cy - 24, w, 48, fill, color, 3, 24) + T(cx, cy + size * .36, s, { size, color });
  const line = (d, color = C.ink, w = 3, cls = '', more = '') => `<path class="${cls}" ${more} d="${d}" stroke="${color}" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  const draw = (d, color, w, n, delay = 0) => `<path class="dr d${n}" pathLength="100" ${dl(delay)} d="${d}" stroke="${color}" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  // 묶음 괄호(x1~x2, 모서리 y, down 이면 아래로 벌어짐)
  const brace = (x1, x2, y, color, down = true) => {
    const m = (x1 + x2) / 2, s = down ? 1 : -1;
    return `<path d="M${f(x1)} ${y} Q${f(x1)} ${y + 12 * s} ${f(x1 + 12)} ${y + 12 * s} H${f(m - 12)} Q${f(m)} ${y + 12 * s} ${f(m)} ${y + 24 * s} Q${f(m)} ${y + 12 * s} ${f(m + 12)} ${y + 12 * s} H${f(x2 - 12)} Q${f(x2)} ${y + 12 * s} ${f(x2)} ${y}" fill="none" stroke="${color}" stroke-width="3"/>`;
  };
  const reg = (key, id, body, css = '') => put(key, svg(id, body, motion(id) + css));
  const A = [
    { name: '개', n: 5, color: C.orange, fill: C.peach },
    { name: '고양이', n: 4, color: C.purple, fill: C.lilac },
    { name: '토끼', n: 3, color: C.green, fill: C.mint },
    { name: '금붕어', n: 2, color: C.blue, fill: C.sky }
  ];
  // 친구 14명이 고른 동물(차례대로)
  const picks = [0, 1, 0, 2, 3, 0, 1, 2, 0, 1, 3, 2, 0, 1];
  // 표: 첫 칸 너비 fw, 동물 칸 cw, 줄 높이 rh
  const table = (x0, y0, { fw = 130, cw = 90, rh = 44, total = true, nums = true, totalVal = '14', size = 22 } = {}) => {
    const cols = 4 + (total ? 1 : 0), W = fw + cols * cw;
    let lines = `M${x0} ${y0 + rh}h${W}`;
    for (let k = 0; k < cols; k++) lines += `M${x0 + fw + k * cw} ${y0}v${2 * rh}`;
    const head = [T(x0 + fw / 2, y0 + rh / 2 + 8, '동물', { size: 20 }), ...A.map((a, k) => T(x0 + fw + k * cw + cw / 2, y0 + rh / 2 + 8, a.name, { size: 20, color: a.color })), total ? T(x0 + fw + 4 * cw + cw / 2, y0 + rh / 2 + 8, '합계', { size: 20 }) : ''].join('');
    const row = T(x0 + fw / 2, y0 + rh * 1.5 + 7, '학생 수(명)', { size: 18 })
      + (nums ? A.map((a, k) => T(x0 + fw + k * cw + cw / 2, y0 + rh * 1.5 + 8, a.n, { size })).join('') + (total && totalVal ? T(x0 + fw + 4 * cw + cw / 2, y0 + rh * 1.5 + 8, totalVal, { size }) : '') : '');
    return `<rect x="${x0}" y="${y0}" width="${W}" height="${rh}" fill="${C.mint}"/>` + rect(x0, y0, W, 2 * rh, 'none', C.ink, 2.5, 3) + `<path d="${lines}" stroke="${C.ink}" stroke-width="2"/>` + head + row;
  };
  const kid = (x, y, body = C.sky) => `<path d="M${x - 17} ${y + 32} q17 -26 34 0 Z" fill="${body}" stroke="${C.blue}" stroke-width="2"/><circle cx="${x}" cy="${y}" r="13" fill="${C.peach}" stroke="${C.orange}" stroke-width="2.5"/>`;

  // 조사: 친구 14명에게 좋아하는 동물을 물음 → 같은 동물을 고른 친구끼리 모임 → 세어 5명, 4명, 3명, 2명
  (function () {
    const id = 't22-m5-josa', gx = [110, 250, 390, 530];
    const seen = [0, 0, 0, 0];
    const kids = picks.map((p, i) => {
      const x = 32 + i * 44, y = 120, k = seen[p]++;
      return `<g class="m2" ${dl(.2 + i * .08, `--mx:${gx[p] - x}px;--my:${290 - k * 48 - y}px`)}>${G('p1', .2 + i * .08, kid(x, y))}</g>`;
    }).join('');
    const body = `<g class="h2">${G('p1', 1.3, pill(320, 50, 230, '좋아하는 동물은?', C.green, C.mint, 26))}</g>`
      + kids
      + A.map((a, k) => tag(gx[k], 346, a.name, a.color, 's2', .1, 24)).join('')
      + A.map((a, k) => tag(gx[k], 290 - a.n * 48 + 20, `${a.n}명`, a.color, 'p3', .2 + k * .3, 28)).join('')
      + G('p3', 1.5, pill(590, 60, 90, '조사', C.green, C.mint, 30));
    reg('2-2/수학/5/조사', id, body);
  })();

  // 자료: 친구들이 적어 낸 동물 카드가 흩어짐 → 한 상자에 모음 → 자료
  (function () {
    const id = 't22-m5-jaryo';
    const spots = [[60, 55, -8], [180, 70, 6], [300, 48, -4], [420, 72, 8], [540, 52, -6], [110, 122, 5], [230, 112, -7], [350, 128, 4], [470, 114, -5], [585, 126, 7], [60, 186, 6], [180, 176, -5], [300, 190, 7], [420, 180, -6]];
    const card = (x, y, rot, s) => `<g transform="rotate(${rot} ${x} ${y})">${rect(x - 37, y - 17, 74, 34, 'white', C.ink, 2, 6)}${T(x, y + 7, s, { size: 18 })}</g>`;
    const cards = spots.map(([x, y, rot], i) => {
      const tx = 80 + (i % 7) * 80, ty = 260 + Math.floor(i / 7) * 46;
      return `<g class="m2" ${dl(.2 + i * .06, `--mx:${tx - x}px;--my:${ty - y}px`)}>${G('p1', .1 + i * .1, card(x, y, rot, A[picks[i]].name))}</g>`;
    }).join('');
    const body = G('s2', .1, rect(30, 228, 580, 112, C.paper, C.green, 3, 14))
      + cards
      + G('k3', .2, rect(24, 222, 592, 124, 'none', C.green, 4, 18))
      + G('p3', .6, pill(320, 190, 100, '자료', C.green, C.mint, 30))
      + G('s3', 1.2, arrow(380, 190, 450, 190, C.muted) + T(462, 197, '표', { size: 24, anchor: 'start' }) + T(500, 197, '그래프', { size: 24, anchor: 'start' }));
    reg('2-2/수학/5/자료', id, body);
  })();

  // 표: 카드가 동물별로 쌓임 → 칸을 나눈 표에 동물 이름과 학생 수 → 표 테두리, 표
  (function () {
    const id = 't22-m5-pyo', x0 = 30, fw = 130, cw = 90;
    const seen = [0, 0, 0, 0];
    const cards = picks.map((p, i) => {
      const k = seen[p]++, x = x0 + fw + p * cw + 5, y = 200 - (k + 1) * 32;
      return G('p1', .1 + i * .09, rect(x, y, 80, 28, A[p].fill, A[p].color, 2, 5) + T(x + 40, y + 21, A[p].name, { size: 18, color: A[p].color }));
    }).join('');
    const nums = A.map((a, k) => G('p2', .9 + k * .2, T(x0 + fw + k * cw + cw / 2, 220 + 66 + 8, a.n, { size: 24, color: a.color }))).join('')
      + G('p2', 1.8, T(x0 + fw + 4 * cw + cw / 2, 294, 14, { size: 24 }));
    const body = cards
      + G('s2', .1, table(x0, 220, { nums: false }))
      + nums
      + G('k3', .2, rect(x0 - 6, 214, fw + 5 * cw + 12, 100, 'none', C.green, 4, 8))
      + G('p3', .8, pill(565, 110, 80, '표', C.green, C.mint, 32));
    reg('2-2/수학/5/표', id, body);
  })();

  // 합계: 표의 학생 수 → 수들이 내려와 5 + 4 + 3 + 2 = 14 → 14 가 합계 칸으로, 합계
  (function () {
    const id = 't22-m5-hapgye', x0 = 30, fw = 130, cw = 90, y0 = 40, rh = 44, ey = 236;
    const cellX = (k) => x0 + fw + k * cw + cw / 2, cellY = y0 + rh * 1.5 + 8;
    const parts = [[150, '5', 0], [190, '+'], [230, '4', 1], [270, '+'], [310, '3', 2], [350, '+'], [390, '2', 3], [430, '=']];
    const expr = parts.map(([x, s, k], i) => k === undefined ? tag(x, ey, s, C.muted, 's2', .5 + i * .1, 36)
      : G('f2', .1 + k * .15, T(x, ey, s, { size: 36, color: A[k].color }), `--dx:${cellX(k) - x}px;--dy:${cellY - ey}px`)).join('');
    const body = table(x0, y0, { totalVal: '' })
      + `<g class="h3">${tag(cellX(4), cellY, '?', C.red, 's1', .6, 26)}</g>`
      + ring(cellX(4), cellY - 8, 22, C.red, 'r1', .8)
      + expr + tag(490, ey, '14', C.green, 'p2', 1.4, 40)
      + G('f3', .2, T(cellX(4), cellY, '14', { size: 26, color: C.green }), `--dx:${490 - cellX(4)}px;--dy:${ey - cellY}px`)
      + ring(cellX(4), cellY - 8, 24, C.green, 'r3', 1)
      + G('p3', 1.3, pill(320, 316, 110, '합계', C.green, C.mint, 30));
    reg('2-2/수학/5/합계', id, body);
  })();

  // 그래프: 표 → 학생 수만큼 ○ 가 아래에서부터 하나씩 → 가장 높은 개 칸 강조, 그래프
  (function () {
    const id = 't22-m5-graph', x0 = 50, fw = 110, cw = 90, gy = 130, gh = 36, gx = x0 + fw;
    let grid = '';
    for (let k = 0; k <= 4; k++) grid += `M${gx + k * cw} ${gy}v${5 * gh + 36}`;
    for (let r = 0; r <= 5; r++) grid += `M${x0} ${gy + r * gh}h${fw + 4 * cw}`;
    const frame = rect(x0, gy, fw + 4 * cw, 5 * gh + 36, 'white', C.ink, 2.5, 3) + `<path d="${grid}" stroke="${C.line}" stroke-width="1.8"/>`
      + `<path d="M${gx} ${gy}v${5 * gh + 36}M${x0} ${gy + 5 * gh}h${fw + 4 * cw}" stroke="${C.ink}" stroke-width="2.5"/>`
      + Array.from({ length: 5 }, (_, r) => T(x0 + fw / 2, gy + (4 - r) * gh + 26, r + 1, { size: 20 })).join('')
      + A.map((a, k) => T(gx + k * cw + cw / 2, gy + 5 * gh + 26, a.name, { size: 20, color: a.color })).join('')
      + T(x0 + fw / 2, gy + 5 * gh + 26, '동물', { size: 18, color: C.muted });
    let dots = '', d = .15;
    A.forEach((a, k) => { for (let i = 0; i < a.n; i++) { dots += G('p2', d, `<circle cx="${gx + k * cw + cw / 2}" cy="${gy + (4 - i) * gh + gh / 2}" r="14" fill="none" stroke="${a.color}" stroke-width="4"/>`); d += .12; } });
    const body = G('s1', .1, table(x0, 16, { fw, cw, rh: 40, size: 20 }))
      + G('s1', .9, frame) + dots
      + G('k3', .2, rect(gx + 3, gy + 3, cw - 6, 5 * gh - 6, 'none', C.red, 4, 8))
      + G('p3', 1, pill(580, 230, 110, '그래프', C.green, C.mint, 28));
    reg('2-2/수학/5/그래프', id, body);
  })();
})(typeof window !== 'undefined' ? window : globalThis);
