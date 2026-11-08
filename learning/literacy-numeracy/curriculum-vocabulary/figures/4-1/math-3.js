// 수학 4-1 3단원 곱셈과 나눗셈: 낱말 도식
// 예는 원고(교과서)의 수를 그대로 쓴다: 246 × 12, 72 ÷ 12, 672 ÷ 21 = 32, 374 ÷ 60 = 6 … 14, 192 × 18 ≈ 200 × 20.
// 움직임은 transform·opacity·stroke-dashoffset 만 쓴다(아이패드 사파리).
(function (root) {
  'use strict';
  const { C, svg, text, arrow, put } = root.FigureKit;
  const f = (n) => +(+n).toFixed(1);
  const dl = (s, more = '') => `style="animation-delay:${s}s;transition-delay:${s}s;${more}"`;
  const T = (x, y, s, o = {}) => text(f(x), f(y), s, o);

  const motion = (id) => {
    let css = `
    .sc-${id} :is(.s1,.s2,.s3,.s4,.p1,.p2,.p3,.p4,.q1,.q2,.q3,.q4){opacity:0}
    .sc-${id} :is(.p1,.p2,.p3,.p4,.ring){transform-box:fill-box;transform-origin:center}
    .sc-${id} .dr{stroke-dasharray:100 110;stroke-dashoffset:101;transition:stroke-dashoffset .5s ease-in-out}
    .sc-${id} :is(.m1,.m2,.m3,.m4){transition:transform .8s ease-in-out}
    .sc-${id} :is(.g1,.g2,.g3,.g4){transition:opacity .35s linear}
    .sc-${id} .ring{opacity:0}
    @keyframes ${id}-in{from{opacity:0}to{opacity:1}}
    @keyframes ${id}-pop{0%{opacity:0;transform:scale(0)}70%{opacity:1;transform:scale(1.15)}100%{opacity:1;transform:none}}
    @keyframes ${id}-ring{0%{opacity:.9;transform:scale(1)}100%{opacity:0;transform:scale(2.2)}}
    @keyframes ${id}-blink{0%,50%,100%{opacity:1}25%,75%{opacity:.2}}
    @keyframes ${id}-peek{0%,100%{opacity:0}12%,80%{opacity:1}}`;
    for (let n = 1; n <= 4; n++) css += `
    .on${n} .sc-${id} .s${n}{animation:${id}-in .4s ease-out both}
    .on${n} .sc-${id} .p${n}{animation:${id}-pop .5s ease-out both}
    .on${n} .sc-${id} .d${n}{stroke-dashoffset:0}
    .on${n} .sc-${id} .r${n}{animation:${id}-ring 1.1s ease-out 2 both}
    .on${n} .sc-${id} .k${n}{animation:${id}-blink 1.4s ease-in-out both}
    .on${n} .sc-${id} .q${n}{animation:${id}-peek 1.3s ease-in-out both}
    .on${n} .sc-${id} .m${n}{transform:translate(var(--mx,0px),var(--my,0px))}
    .on${n} .sc-${id} .g${n}{opacity:0}`;
    return css;
  };
  const ring = (cx, cy, r, color, cls, d = 0) => `<circle class="ring ${cls}" ${dl(d)} cx="${f(cx)}" cy="${f(cy)}" r="${r}" fill="none" stroke="${color}" stroke-width="4"/>`;
  const tag = (x, y, s, color, cls, d = 0, size = 24, anchor = 'middle') => `<g class="${cls}" ${dl(d)}>${T(x, y, s, { size, color, anchor })}</g>`;
  const pill = (cx, cy, w, s, color, fill, size = 24) => `<rect x="${f(cx - w / 2)}" y="${f(cy - 21)}" width="${w}" height="42" rx="21" fill="${fill}" stroke="${color}" stroke-width="2.5"/>${T(cx, cy + size * .36, s, { size, color })}`;
  const charW = (ch) => /[0-9]/.test(ch) ? .58 : ch === '…' ? 1 : /[÷=×<>+−]/.test(ch) ? .72 : ch === ' ' ? .3 : .9;
  // 식 한 줄(가운데 맞춤): 토막은 글자 또는 {t, color, cls, d}. 돌려주는 xs 로 고리·이름표 자리를 잡는다.
  function expr(cx, cy, toks, size) {
    const items = toks.map((t) => (typeof t === 'object' ? t : { t: String(t) }));
    const ws = items.map((it) => [...it.t].reduce((s, ch) => s + charW(ch) * size, 0)), gap = size * .3;
    const total = ws.reduce((a, b) => a + b, 0) + gap * (items.length - 1);
    let x = cx - total / 2;
    const xs = [];
    const body = items.map((it, i) => {
      const c = x + ws[i] / 2; xs.push(c);
      const s = T(c, cy + size * .36, it.t, { size, color: it.color || C.ink });
      x += ws[i] + gap;
      return it.cls ? `<g class="${it.cls}" ${dl(it.d || 0)}>${s}</g>` : s;
    }).join('');
    return { body, xs, ws, total };
  }
  const brace = (x1, x2, y, color, down = true) => `<path d="M${f(x1)} ${y + (down ? -10 : 10)} V${y} H${f(x2)} V${y + (down ? -10 : 10)}" fill="none" stroke="${color}" stroke-width="3" stroke-linejoin="round"/>`;

  // 곱하는 수: 246 을 12번 → 246 × 12 로 씀(× 뒤 12 가 몇 번인지) → = 2952, 곱하는 수·곱해지는 수 자리
  (function () {
    const id = 't41-m3-gophaneun';
    let cards = '';
    for (let i = 0; i < 12; i++) {
      const cx = 84 + (i % 6) * 94, cy = i < 6 ? 52 : 104;
      cards += `<g class="p1" ${dl(.15 + i * .13)}>${pill(cx, cy, 82, '246', C.blue, C.sky, 24)}</g>`;
    }
    const E = expr(320, 226, ['246', '×', { t: '12', color: C.orange }, { t: '=', cls: 's3', d: .2 }, { t: '2952', color: C.green, cls: 'p3', d: .4 }], 52);
    const body = cards
      + `<g class="k2" ${dl(.8)}><g class="s1" ${dl(1.7)}>${brace(43, 597, 140, C.orange)}${T(320, 166, '12번', { size: 24, color: C.orange })}</g></g>`
      + `<g class="s2" ${dl(.2)}>${E.body.replace(/<g class="(s3|p3)"[^>]*>.*?<\/g>/g, '')}</g>`
      + E.body.match(/<g class="(s3|p3)"[^>]*>.*?<\/g>/g).join('')
            + ring(E.xs[2], 226, 34, C.orange, 'r2', 1.1)
      + `<g class="p3" ${dl(.9)}>${pill(E.xs[2], 306, 132, '곱하는 수', C.orange, C.peach, 24)}</g>`
      + `<g class="s3" ${dl(1.2)}>${T(E.xs[0] - 10, 314, '곱해지는 수', { size: 22, color: C.muted })}</g>`;
    put('4-1/수학/3/곱하는 수', svg(id, body, motion(id)));
  })();

  // 나누는 수: 책 72권 → 12권씩 묶으면 6묶음 → 72 ÷ 12 = 6 의 12
  (function () {
    const id = 't41-m3-nanuneun', x0 = 120, w = 468, k = w / 72, y = 76, h = 66;
    let spines = '';
    for (let i = 1; i < 72; i++) spines += `M${f(x0 + i * k)} ${y + 4} v${h - 8} `;
    let cuts = '', counts = '';
    for (let g = 0; g < 6; g++) {
      const cx = x0 + (g + .5) * 12 * k;
      if (g) cuts += `<path class="dr d2" pathLength="100" ${dl(.2 + g * .22)} d="M${f(x0 + g * 12 * k)} ${y - 8} v${h + 16}" stroke="${C.blue}" stroke-width="4"/>`;
      counts += `<g class="p2" ${dl(.3 + g * .22)}><rect x="${f(cx - 6)}" y="${y - 3}" width="12" height="${h + 6}" rx="3" fill="${C.orange}" fill-opacity=".8"/>${T(cx, y - 18, g + 1, { size: 22, color: C.green })}</g>`;
    }
    const E = expr(330, 262, [{ t: '72', color: C.ink }, '÷', { t: '12', color: C.blue }, '=', { t: '6', color: C.green }], 52);
    const body = `<g class="s1" ${dl(.2)}><rect x="${x0}" y="${y}" width="${w}" height="${h}" rx="6" fill="${C.sky}" stroke="${C.blue}" stroke-width="2.5"/><path d="${spines}" stroke="${C.blue}" stroke-width="1.2" stroke-opacity=".6"/></g>`
      + tag(62, 118, '72권', C.ink, 's1', .6, 28)
      + cuts + counts
      + `<g class="s2" ${dl(1.6)}>${brace(x0 + 2, x0 + 12 * k - 2, 158, C.blue)}${T(x0 + 6 * k, 186, '12권', { size: 22, color: C.blue })}${T(560, 186, '6묶음', { size: 22, color: C.green })}</g>`
      + `<g class="s3" ${dl(.2)}>${E.body}</g>`
      + ring(E.xs[2], 262, 34, C.blue, 'r3', .7)
      + `<g class="p3" ${dl(1)}>${pill(E.xs[2], 330, 130, '나누는 수', C.blue, C.sky, 24)}</g>`
      + `<g class="s3" ${dl(1.3)}>${T(E.xs[0] - 40, 338, '나누어지는 수', { size: 20, color: C.muted })}</g>`;
    put('4-1/수학/3/나누는 수', svg(id, body, motion(id)));
  })();

  // 몫: 딸기잼 672 g 을 21명이 똑같이 → 세로 나눗셈 672 ÷ 21 → 위에 쓴 32 가 몫
  (function () {
    const id = 't41-m3-mok', cx = [330, 356, 382], S = 40;
    const D = (col, y, s, color = C.ink, size = S) => T(cx[col], y, s, { size, color });
    const jar = `<rect x="78" y="168" width="104" height="104" rx="18" fill="${C.red}" fill-opacity=".75" stroke="#9b2c20" stroke-width="3"/>`
      + `<rect x="70" y="146" width="120" height="28" rx="8" fill="${C.peach}" stroke="${C.orange}" stroke-width="3"/>`
      + `<rect x="96" y="196" width="68" height="44" rx="6" fill="white"/>${T(130, 226, '672 g', { size: 20, color: C.red })}`;
    const body = `<g class="s1" ${dl(.1)}>${jar}${T(130, 310, '21명', { size: 24, color: C.muted })}</g>`
      + `<g class="s1" ${dl(.4)}>${T(292, 160, '21', { size: S, anchor: 'end' })}${D(0, 160, '6')}${D(1, 160, '7')}${D(2, 160, '2')}</g>`
      + `<path class="dr d1" pathLength="100" ${dl(.6)} d="M300 172 Q314 150 300 124 H404" fill="none" stroke="${C.ink}" stroke-width="3"/>`
      + `<g class="p2" ${dl(.2)}>${D(1, 108, '3', C.orange)}</g>`
      + `<g class="s2" ${dl(.5)}>${D(0, 204, '6')}${D(1, 204, '3')}<path d="M314 214 H404" stroke="${C.ink}" stroke-width="3"/></g>`
      + `<g class="s2" ${dl(.9)}>${D(1, 250, '4')}</g>`
      + `<g class="s2" ${dl(1.1)}>${arrow(cx[2], 168, cx[2], 222, C.muted, '', 2.5)}${D(2, 250, '2')}</g>`
      + `<g class="p2" ${dl(1.4)}>${D(2, 108, '2', C.orange)}</g>`
      + `<g class="s2" ${dl(1.6)}>${D(1, 294, '4')}${D(2, 294, '2')}<path d="M340 304 H404" stroke="${C.ink}" stroke-width="3"/>${D(2, 340, '0')}</g>`
      + `<g class="s3"><g class="k3" ${dl(.3)}><rect x="${cx[1] - 22}" y="72" width="70" height="48" rx="10" fill="none" stroke="${C.orange}" stroke-width="3.5"/></g></g>`
      + `<g class="s3" ${dl(.6)}>${arrow(460, 90, 412, 94, C.orange)}${T(504, 102, '몫', { size: 34, color: C.orange })}</g>`
      + `<g class="s3" ${dl(1)}>${expr(524, 226, ['672', '÷', '21', '=', { t: '32', color: C.orange }], 26).body}</g>`
      + `<g class="p3" ${dl(1.4)}>${T(524, 286, '한 사람 32 g', { size: 22, color: C.orange })}</g>`;
    put('4-1/수학/3/몫', svg(id, body, motion(id)));
  })();

  // 나머지: 블록 374개 → 로봇 하나에 60개씩 6번 덜어 내면 14개 남음 → 14 < 60 이라 하나 더 못 만듦 → 374 ÷ 60 = 6 … 14
  (function () {
    const id = 't41-m3-nameoji', x0 = 40, k = 500 / 374, y = 110, h = 60, X = (n) => x0 + n * k;
    let cuts = '', counts = '';
    for (let g = 1; g <= 6; g++) {
      cuts += `<path class="dr d2" pathLength="100" ${dl(.2 + g * .2)} d="M${f(X(g * 60))} ${y - 6} v${h + 12}" stroke="${C.green}" stroke-width="4"/>`;
      counts += tag(X((g - .5) * 60), y - 14, g, C.green, 'p2', .25 + g * .2, 22);
    }
    const E = expr(300, 270, ['374', '÷', '60', '=', '6', '…', { t: '14', color: C.orange }], 46);
    const body = `<rect x="${x0}" y="${y}" width="${f(500)}" height="${h}" rx="6" fill="${C.sky}" stroke="${C.blue}" stroke-width="2.5"/>`
      + tag(290, 58, '374개', C.blue, 's1', .2, 26)
      + `<g class="s2" ${dl(1.5)}><rect x="${f(X(360))}" y="${y}" width="${f(14 * k)}" height="${h}" fill="${C.orange}" fill-opacity=".85"/></g>`
      + cuts + counts
      + `<g class="s2" ${dl(1.6)}>${brace(x0 + 2, X(360) - 2, 186, C.green)}${T(X(180), 214, '60 × 6 = 360', { size: 22, color: C.green })}${T(X(367), 214, '14', { size: 24, color: C.orange })}</g>`
      + ring(X(367), y + h / 2, 18, C.orange, 'r2', 1.8)
      + `<g class="s3" ${dl(.2)}><rect x="${f(X(360))}" y="${y}" width="${f(60 * k)}" height="${h}" rx="6" fill="none" stroke="${C.orange}" stroke-width="3" stroke-dasharray="8 6"/>${T(X(390), y - 14, '14 < 60', { size: 22, color: C.orange })}</g>`
      + `<g class="s3" ${dl(.9)}>${E.body}</g>`
      + ring(E.xs[6], 270, 30, C.orange, 'r3', 1.3)
      + `<g class="p3" ${dl(1.5)}>${pill(E.xs[6], 334, 110, '나머지', C.orange, C.peach, 24)}</g>`;
    put('4-1/수학/3/나머지', svg(id, body, motion(id)));
  })();

  // 어림셈: 192 는 200 에, 18 은 20 에 가깝다 → 200 × 20 = 약 4000 → 정확히 192 × 18 = 3456 과 견줌
  (function () {
    const id = 't41-m3-eorimsem', y = 86;
    const line = (x0, x1, from, to, step, labels) => {
      const at = (n) => x0 + (n - from) * (x1 - x0) / (to - from);
      let d = `M${x0 - 14} ${y} H${x1 + 14} `;
      for (let n = from; n <= to; n += step) { const big = labels.includes(n); d += `M${f(at(n))} ${y - (big ? 11 : 6)} V${y + (big ? 11 : 6)} `; }
      return { at, body: `<path d="${d}" stroke="${C.ink}" stroke-width="2.5" fill="none"/>` + labels.map((n) => T(at(n), y + 38, n, { size: 20, weight: 600 })).join('') };
    };
    const A = line(50, 290, 150, 250, 10, [150, 200, 250]), B = line(360, 600, 10, 30, 1, [10, 20, 30]);
    const mover = (L, from, to, n, d) => `<g class="m${n}" ${dl(d, `--mx:${f(L.at(to) - L.at(from))}px;--my:0px`)}><circle cx="${f(L.at(from))}" cy="${y}" r="10" fill="${C.orange}" stroke="white" stroke-width="2"/></g>`;
    const E1 = expr(330, 214, ['200', '×', '20', '=', ' ', { t: '약 4000 g', color: C.green }], 34);
    const toks2 = ['192', '×', '18', '=', ' ', { t: '3456 g', color: C.orange }], E2a = expr(330, 300, toks2, 34);
    const E2 = expr(330 + E1.xs[3] - E2a.xs[3], 300, toks2, 34);
    const bx = E1.xs[3] + 22, bw = Math.max(E1.xs[5] + E1.ws[5] / 2, E2.xs[5] + E2.ws[5] / 2) + 18 - bx;
    const body = `<g class="s1" ${dl(.1)}>${A.body}</g>` + mover(A, 192, 200, 1, .9)
      + `<g class="q1" ${dl(.2)}>${T(A.at(192) - 14, y - 22, '192', { size: 24, color: C.orange })}</g>`
      + `<g class="s1" ${dl(1.6)}>${T(A.at(200), y - 22, '200', { size: 24, color: C.green })}</g>`
      + `<g class="s2" ${dl(.1)}>${B.body}${mover(B, 18, 20, 2, .8)}</g>`
      + `<g class="q2" ${dl(.2)}>${T(B.at(18) - 6, y - 22, '18', { size: 24, color: C.orange })}</g>`
      + `<g class="s2" ${dl(1.4)}>${T(B.at(20), y - 22, '20', { size: 24, color: C.green })}</g>`
      + `<g class="s2" ${dl(1.5)}>${T(70, 222, '어림셈', { size: 24, color: C.green })}${E1.body}</g>`
      + ring(E1.xs[5], 214, 40, C.green, 'r2', 1.9)
      + `<g class="s3" ${dl(.3)}>${T(70, 308, '계산', { size: 24, color: C.muted })}${E2.body}</g>`
      + `<g class="s3" ${dl(1.1)}><rect x="${f(bx)}" y="178" width="${f(bw)}" height="160" rx="12" fill="none" stroke="${C.blue}" stroke-width="3" stroke-dasharray="8 6"/></g>`;
    put('4-1/수학/3/어림셈', svg(id, body, motion(id)));
  })();
})(typeof window !== 'undefined' ? window : globalThis);
