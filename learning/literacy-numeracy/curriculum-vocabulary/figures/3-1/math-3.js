// 수학 3-1 3단원 나눗셈: 낱말 도식
// 나눗셈의 두 뜻(교과서 차례): 똑같이 나누기(토마토 모종 6개를 2명이) · 몇씩 묶어 덜어 내기(달걀 10개를 2개씩 → 10 − 2 − 2 − 2 − 2 − 2 = 0).
// 물건은 처음 자리에 그리고 mN(옮겨 가 머물기)으로 담긴 자리로 보낸다. 움직임은 transform·opacity·stroke-dashoffset 만(아이패드 사파리).
(function (root) {
  'use strict';
  const { C, svg, text, arrow, put } = root.FigureKit;
  const f = (n) => +(+n).toFixed(2);
  const dl = (s, more = '') => `style="animation-delay:${s}s;transition-delay:${s}s;${more}"`;
  const T = (x, y, s, o = {}) => text(f(x), f(y), s, o);

  const motion = (id) => {
    let css = `
    .sc-${id} :is(.s1,.s2,.s3,.s4,.p1,.p2,.p3,.p4){opacity:0}
    .sc-${id} :is(.p1,.p2,.p3,.p4,.ring){transform-box:fill-box;transform-origin:center}
    .sc-${id} .dr{stroke-dasharray:100 110;stroke-dashoffset:101;transition:stroke-dashoffset .6s ease-in-out}
    .sc-${id} :is(.m1,.m2,.m3,.m4){transition:transform .7s ease-in-out}
    .sc-${id} :is(.g1,.g2,.g3,.g4){transition:opacity .4s linear}
    .sc-${id} .ring{opacity:0}
    @keyframes ${id}-in{from{opacity:0}to{opacity:1}}
    @keyframes ${id}-pop{0%{opacity:0;transform:scale(0)}70%{opacity:1;transform:scale(1.18)}100%{opacity:1;transform:none}}
    @keyframes ${id}-ring{0%{opacity:.9;transform:scale(1)}100%{opacity:0;transform:scale(2.2)}}
    @keyframes ${id}-blink{0%,50%,100%{opacity:1}25%,75%{opacity:.2}}`;
    for (let n = 1; n <= 4; n++) css += `
    .on${n} .sc-${id} .s${n}{animation:${id}-in .4s ease-out both}
    .on${n} .sc-${id} .p${n}{animation:${id}-pop .5s ease-out both}
    .on${n} .sc-${id} .d${n}{stroke-dashoffset:0}
    .on${n} .sc-${id} .r${n}{animation:${id}-ring 1.1s ease-out 2 both}
    .on${n} .sc-${id} .k${n}{animation:${id}-blink 1.4s ease-in-out both}
    .on${n} .sc-${id} .m${n}{transform:translate(var(--mx,0px),var(--my,0px))}
    .on${n} .sc-${id} .g${n}{opacity:0}`;
    return css;
  };
  const ring = (cx, cy, r, color, cls, d = 0) => `<circle class="ring ${cls}" ${dl(d)} cx="${f(cx)}" cy="${f(cy)}" r="${r}" fill="none" stroke="${color}" stroke-width="4"/>`;
  const tag = (x, y, s, color, cls, d = 0, size = 24, anchor = 'middle') => `<g class="${cls}" ${dl(d)}>${T(x, y, s, { size, color, anchor })}</g>`;
  const pill = (cx, cy, w, s, color, fill, size = 26) => `<rect x="${f(cx - w / 2)}" y="${f(cy - 22)}" width="${w}" height="44" rx="22" fill="${fill}" stroke="${color}" stroke-width="2.5"/>${T(cx, cy + size * .36, s, { size, color })}`;
  // 식 조각: [x, 글자, 색]
  const eq = (y, parts, size = 34) => parts.map(([x, s, color = C.ink]) => T(x, y, s, { size, color })).join('');
  // 처음 자리 from 에 그린 것을 to 로 보낸다
  const go = (n, d, from, to, draw, inner = '') => `<g class="m${n}" ${dl(d, `--mx:${f(to[0] - from[0])}px;--my:${f(to[1] - from[1])}px`)}>${inner ? `<g class="${inner}">` : ''}${draw(...from)}${inner ? '</g>' : ''}</g>`;

  // 물건 모양
  const sprout = (x, y) => `<path d="M${x} ${y + 16}V${y}" stroke="${C.green}" stroke-width="3"/><path d="M${x} ${y + 4}c-3 -12 -14 -14 -16 -8c4 8 10 9 16 8zM${x} ${y + 2}c3 -12 14 -14 16 -8c-4 8 -10 9 -16 8z" fill="${C.green}"/>`;
  const egg = (x, y) => `<ellipse cx="${x}" cy="${y}" rx="10" ry="13" fill="#fff7e6" stroke="#c99a1b" stroke-width="2.5"/>`;
  const orange = (x, y) => `<circle cx="${x}" cy="${y}" r="11" fill="${C.orange}" stroke="#b5601f" stroke-width="2"/>`;
  const stone = (x, y) => `<circle cx="${x}" cy="${y}" r="9" fill="${C.ink}"/>`;
  const SHEET = [[C.sky, C.blue], [C.peach, C.orange], [C.mint, C.green], [C.lilac, C.purple]];
  const sheet = (i) => (x, y) => `<rect x="${x}" y="${y}" width="34" height="42" rx="3" fill="${SHEET[i % 4][0]}" stroke="${SHEET[i % 4][1]}" stroke-width="2.5"/>`;
  const person = (x, y, color) => `<circle cx="${x}" cy="${y}" r="16" fill="${color}"/><path d="M${x - 26} ${y + 46}Q${x - 26} ${y + 20} ${x} ${y + 20}Q${x + 26} ${y + 20} ${x + 26} ${y + 46}Z" fill="${color}"/>`;

  // 나눗셈: 토마토 모종 6개를 텃밭 2곳에 번갈아 → 3개씩, 6 ÷ 2 = 3 → 달걀 10개를 2개씩 봉투에, 5번 → 10 ÷ 2 = 5 → 둘 다 ÷
  (function () {
    const id = 't31-m3-nanutsem', gx = [340, 490];
    let top = '';
    for (let i = 0; i < 6; i++) top += go(1, .2 + i * .18, [56 + i * 44, 56], [gx[i % 2] + 24 + Math.floor(i / 2) * 36, 60], sprout);
    let bottom = '';
    const ex = (k) => 346 + k * 56;
    for (let i = 0; i < 10; i++) {
      const k = Math.floor(i / 2);
      bottom += go(2, .1 + k * .25, [44 + i * 28, 240], [ex(k) + 15 + (i % 2) * 18, 240], egg);
    }
    const envelopes = [0, 1, 2, 3, 4].map((k) => `<rect x="${ex(k)}" y="218" width="48" height="44" rx="4" fill="white" stroke="${C.muted}" stroke-width="2.5"/>`
      + tag(ex(k) + 24, 288, k + 1, C.blue, 'p2', .5 + k * .25, 20)).join('');
    const body = gx.map((x) => `<rect x="${x}" y="40" width="120" height="66" rx="8" fill="${C.peach}" stroke="${C.orange}" stroke-width="2.5"/>`).join('')
      + top
      + gx.map((x) => tag(x + 60, 134, '3개', C.orange, 's1', 1.5, 22)).join('')
      + `<g class="s1" ${dl(1.7)}>${eq(176, [[400, '6'], [440, '÷'], [480, '2'], [520, '='], [560, '3', C.green]])}</g>`
      + `<g class="s2" ${dl(0)}>${envelopes}</g>`
      + `<g class="s2" ${dl(0)}>${bottom}</g>`
      + `<g class="s2" ${dl(1.5)}>${T(40, 334, '10 − 2 − 2 − 2 − 2 − 2 = 0', { size: 24, anchor: 'start' })}</g>`
      + `<g class="s2" ${dl(1.9)}>${eq(336, [[420, '10'], [470, '÷'], [510, '2'], [550, '='], [590, '5', C.green]])}</g>`
      + ring(440, 164, 20, C.orange, 'r3', .6) + ring(470, 324, 20, C.orange, 'r3', .6)
      + `<g class="p3" ${dl(.8)}>${pill(150, 120, 120, '나눗셈', C.green, C.mint, 28)}</g>`;
    put('3-1/수학/3/나눗셈', svg(id, body, motion(id)));
  })();

  // 나누어지는 수: 색종이 8장(묶음 괄호 8장) → 2명이 번갈아 4장씩 → 8 ÷ 2 = 4 의 8, 처음 전체 8장이 깜빡
  (function () {
    const id = 't31-m3-nanueojineun', px = [150, 490];
    let sheets = '';
    for (let i = 0; i < 8; i++) {
      const p = i % 2, slot = Math.floor(i / 2);
      sheets += go(2, .2 + i * .14, [120 + i * 52, 40], [px[p] - 84 + slot * 44, 230], sheet(i), 'k3');
    }
    const body = person(px[0], 158, C.blue) + person(px[1], 158, C.purple)
      + `<g class="h2"><path d="M120 92V102H518V92M319 102V110" stroke="${C.orange}" stroke-width="3" fill="none"/>${T(319, 136, '8장', { size: 24, color: C.orange })}</g>`
      + sheets
      + px.map((x) => tag(x + 64, 180, '4장', C.ink, 's2', 1.6, 24)).join('')
      + `<g class="s3" ${dl(.2)}>${eq(330, [[290, '8', C.orange], [340, '÷'], [384, '2'], [428, '='], [474, '4']], 40)}</g>`
      + ring(290, 316, 26, C.orange, 'r3', .7)
      + `<g class="s3" ${dl(1)}>${arrow(208, 318, 262, 314, C.orange)}${T(118, 328, '나누어지는 수', { size: 24, color: C.orange })}</g>`;
    put('3-1/수학/3/나누어지는 수', svg(id, body, motion(id) + `.on3 .sc-${id} .k3{animation-delay:.4s}`));
  })();

  // 나누는 수: 귤 12개를 접시 4개에 → 3개씩, 12 ÷ 4 = 3 → 바둑돌 15개를 5개씩 묶어 3묶음, 15 ÷ 5 = 3 → 4와 5가 나누는 수
  (function () {
    const id = 't31-m3-nanuneun', plates = [70, 160, 250, 340];
    let fruits = '';
    for (let i = 0; i < 12; i++) {
      const k = i % 4, s = Math.floor(i / 4);
      fruits += go(1, .2 + i * .09, [40 + i * 28, 40], [plates[k] + (s - 1) * 22, 114], orange);
    }
    const sx = (i) => 48 + i * 22 + Math.floor(i / 5) * 18;
    let stones = '';
    for (let i = 0; i < 15; i++) stones += stone(sx(i), 262);
    const lassos = [0, 1, 2].map((g) => {
      const x0 = sx(g * 5) - 18, w = sx(g * 5 + 4) - sx(g * 5) + 36;
      return `<rect class="dr d2" pathLength="100" ${dl(.2 + g * .4)} x="${f(x0)}" y="240" width="${f(w)}" height="44" rx="20" fill="none" stroke="${C.blue}" stroke-width="3.5"/>`
        + tag(x0 + w / 2, 312, '5개씩', C.blue, 's2', .5 + g * .4, 20);
    }).join('');
    const top = [[452, '12'], [498, '÷'], [536, '4', C.blue], [572, '='], [608, '3']];
    const bot = [[452, '15'], [498, '÷'], [536, '5', C.blue], [572, '='], [608, '3']];
    const body = plates.map((x, k) => `<ellipse cx="${x}" cy="126" rx="40" ry="12" fill="white" stroke="${C.muted}" stroke-width="2.5"/>` + tag(x, 162, k + 1, C.blue, 'p1', 1 + k * .15, 20)).join('')
      + fruits
      + `<g class="s1" ${dl(1.7)}>${eq(100, top)}</g>`
      + `<g class="s2" ${dl(0)}>${stones}</g>` + lassos
      + `<g class="s2" ${dl(1.6)}>${eq(280, bot)}</g>`
      + ring(536, 88, 22, C.blue, 'r3', .7) + ring(536, 268, 22, C.blue, 'r3', .7)
      + `<g class="s3" ${dl(.8)}>${arrow(536, 166, 536, 114, C.blue)}${arrow(536, 214, 536, 248, C.blue)}</g>`
      + `<g class="p3" ${dl(.6)}>${pill(536, 190, 140, '나누는 수', C.blue, C.sky, 26)}</g>`;
    put('3-1/수학/3/나누는 수', svg(id, body, motion(id)));
  })();

  // 몫: 연필 42자루를 6자루씩 상자에 → 상자 1~7 → 42 ÷ 6 = 7 의 7, '몫' → 14 ÷ 2, 28 ÷ 4, 63 ÷ 9 도 몫이 7
  (function () {
    const id = 't31-m3-mok';
    const box = (k) => {
      const x = 30 + k * 84;
      let pens = '', tips = '';
      for (let j = 0; j < 6; j++) { const px = x + 11 + j * 10; pens += `M${px} 70V114`; tips += `M${px} 62V70`; }
      return `<rect x="${x}" y="54" width="72" height="68" rx="5" fill="white" stroke="${C.muted}" stroke-width="2.5"/>`
        + `<path d="${pens}" stroke="${C.yellow}" stroke-width="7"/><path d="${tips}" stroke="${C.ink}" stroke-width="4"/>`;
    };
    const card = (cx, a, b) => `<rect x="${cx - 85}" y="270" width="170" height="54" rx="10" fill="white" stroke="${C.line}" stroke-width="2.5"/>`
      + eq(306, [[cx - 52, a], [cx - 18, '÷'], [cx + 10, b], [cx + 36, '='], [cx + 62, '7', C.orange]], 24);
    const body = `<g class="s1" ${dl(.1)}>${T(30, 38, '6자루씩', { size: 20, color: C.muted, anchor: 'start' })}</g>`
      + [0, 1, 2, 3, 4, 5, 6].map((k) => `<g class="p1" ${dl(.2 + k * .2)}>${box(k)}</g>` + tag(66 + k * 84, 150, k + 1, C.orange, 'p1', .3 + k * .2, 22)).join('')
      + `<g class="s2" ${dl(.2)}>${eq(222, [[150, '42'], [204, '÷'], [246, '6'], [290, '=']], 40)}<g class="k3" ${dl(1.4)}>${T(336, 222, '7', { size: 40, color: C.orange })}</g></g>`
      + ring(336, 208, 26, C.orange, 'r2', .8)
      + `<g class="s2" ${dl(1.1)}>${arrow(412, 214, 364, 210, C.orange)}${T(444, 226, '몫', { size: 36, color: C.orange })}</g>`
      + [[115, '14', '2'], [320, '28', '4'], [525, '63', '9']].map(([cx, a, b], i) => `<g class="p3" ${dl(.2 + i * .35)}>${card(cx, a, b)}</g>` + ring(cx + 62, 298, 16, C.orange, 'r3', 1.4)).join('');
    put('3-1/수학/3/몫', svg(id, body, motion(id)));
  })();

  // 곱셈구구: 1단~9단 카드 → 7단을 펼쳐 7 × 1 = 7 … 7 × 9 = 63 → 21 ÷ 7 은 7단에서 7 × 3 = 21 을 찾아 몫 3
  (function () {
    const id = 't31-m3-gopsemgugu', cx7 = 14 + 6 * 68 + 31, row = (n) => 96 + (n - 1) * 28;
    const cards = Array.from({ length: 9 }, (_, i) => `<g class="p1" ${dl(.1 + i * .12)}><rect x="${14 + i * 68}" y="18" width="62" height="44" rx="8" fill="white" stroke="${C.blue}" stroke-width="2.5"/>${T(45 + i * 68, 48, `${i + 1}단`, { size: 20, color: C.blue })}</g>`).join('');
    let lines = '';
    for (let n = 1; n <= 9; n++) {
      const t = T(cx7, row(n), `7 × ${n} = ${7 * n}`, { size: 20 });
      lines += `<g class="s2" ${dl(.4 + n * .12)}>${n < 3 ? `<g class="k3" ${dl(.2 + (n - 1) * .4)}>${t}</g>` : t}</g>`;
    }
    const body = cards
      + `<g class="s2" ${dl(.1)}><rect x="${14 + 6 * 68}" y="18" width="62" height="44" rx="8" fill="${C.peach}" stroke="${C.orange}" stroke-width="3"/>${T(cx7, 48, '7단', { size: 20, color: C.orange })}</g>`
      + `<g class="s3" ${dl(1)}><rect x="${cx7 - 62}" y="${row(3) - 21}" width="124" height="29" rx="6" fill="${C.peach}" stroke="${C.orange}" stroke-width="2.5"/></g>`
      + lines
      + `<g class="s3" ${dl(1)}>${T(cx7, row(3), '7 × 3 = 21', { size: 20, color: C.orange })}</g>`
      + `<g class="s3" ${dl(.1)}>${eq(214, [[120, '21'], [170, '÷'], [210, '7', C.orange], [250, '=']], 40)}<rect x="274" y="180" width="44" height="46" rx="6" fill="white" stroke="${C.ink}" stroke-width="2.5"/></g>`
      + ring(210, 200, 22, C.orange, 'r3', .3)
      + `<g class="s3" ${dl(1.3)}>${arrow(cx7 - 66, row(3) + 2, 330, 196, C.orange)}</g>`
      + tag(296, 216, '3', C.green, 'p3', 1.7, 34);
    put('3-1/수학/3/곱셈구구', svg(id, body, motion(id)));
  })();
})(typeof window !== 'undefined' ? window : globalThis);
