// 수학 5-1 4단원 대응 관계: 낱말 도식
// 교과서를 따른다: 한 양이 변할 때 다른 양이 짝을 지어 변하는 관계(꿀벌 수와 날개 수, 책상 수와 다리 수), 표에서 규칙 찾기(피자 1판에 8조각),
// 두 양을 ○, □, △ 같은 기호로 나타내어 식으로 쓰기(사진 수와 누름 못 수).
(function (root) {
  'use strict';
  const { C, svg, text, arrow, put } = root.FigureKit;
  const f = (n) => +(+n).toFixed(1);
  const delay = (s, more = '') => `style="animation-delay:${s}s;transition-delay:${s}s;${more}"`;

  // 같이 쓰는 움직임. sN 나타나기, oN 사라지기, pN 튀어나오기, dN 선 그리기, rN 퍼지는 고리, kN 깜빡이며 남기
  const motion = (id) => {
    let css = `
    .sc-${id} :is(.s1,.s2,.s3,.s4,.p1,.p2,.p3,.p4,.k1,.k2,.k3,.k4) { opacity: 0; }
    .sc-${id} :is(.p1,.p2,.p3,.p4,.ring) { transform-box: fill-box; transform-origin: center; }
    .sc-${id} .draw { stroke-dasharray: 1; stroke-dashoffset: 1; transition: stroke-dashoffset .5s ease-in-out; }
    .sc-${id} .ring { opacity: 0; }
    .sc-${id} :is(.h2,.h3,.h4) { transition: opacity .4s ease; }
    @keyframes ${id}-fin { from { opacity: 0; } to { opacity: 1; } }
    @keyframes ${id}-out { from { opacity: 1; } to { opacity: 0; } }
    @keyframes ${id}-pop { 0% { opacity: 0; transform: scale(0); } 70% { opacity: 1; transform: scale(1.2); } 100% { opacity: 1; transform: scale(1); } }
    @keyframes ${id}-ring { 0% { opacity: .9; transform: scale(1); } 100% { opacity: 0; transform: scale(2.2); } }
    @keyframes ${id}-blink { 0% { opacity: 0; } 20% { opacity: 1; } 40% { opacity: .15; } 60% { opacity: 1; } 80% { opacity: .15; } 100% { opacity: 1; } }`;
    for (let n = 1; n <= 4; n++) css += `
    .on${n} .sc-${id} .s${n} { animation: ${id}-fin .4s ease-out both; }
    .on${n} .sc-${id} .o${n} { animation: ${id}-out .3s ease-out both; }
    .on${n} .sc-${id} .p${n} { animation: ${id}-pop .5s ease-out both; }
    .on${n} .sc-${id} .d${n} { stroke-dashoffset: 0; }
    .on${n} .sc-${id} .r${n} { animation: ${id}-ring 1.1s ease-out 2 both; }
    .on${n} .sc-${id} .k${n} { animation: ${id}-blink 1.6s ease-in-out both; }`;
    return css;
  };
  const ring = (cx, cy, r, color, cls, d = 0) => `<circle class="ring ${cls}" ${delay(d)} cx="${f(cx)}" cy="${f(cy)}" r="${r}" fill="none" stroke="${color}" stroke-width="4"/>`;
  const tag = (x, y, s, color, cls, d = 0, size = 24, anchor = 'middle') => `<g class="${cls}" ${delay(d)}>${text(f(x), f(y), s, { size, color, anchor })}</g>`;
  const pill = (cx, cy, w, s, color, fill, size = 22) => `<rect x="${f(cx - w / 2)}" y="${f(cy - 20)}" width="${w}" height="40" rx="20" fill="${fill}" stroke="${color}" stroke-width="2.5"/>${text(f(cx), f(cy + size * .36), s, { size, color })}`;
  // 휘는 화살표 (x1,y1) → (x2,y2), 가운데가 bend 만큼 위(음수)·아래(양수)로
  const bow = (x1, y1, x2, y2, bend, color, cls, d = 0) => {
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2 + bend, a = Math.atan2(y2 - my, x2 - mx), l = 10;
    const p = (t) => `${f(x2 - l * Math.cos(a + t))} ${f(y2 - l * Math.sin(a + t))}`;
    return `<path class="draw ${cls}" pathLength="1" ${delay(d)} d="M${f(x1)} ${f(y1)} Q${f(mx)} ${f(my)} ${f(x2)} ${f(y2)} M${p(-0.5)} L${f(x2)} ${f(y2)} L${p(0.5)}" fill="none" stroke="${color}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>`;
  };
  // 표 한 줄: 이름 칸(x0~x1) + 수 칸들
  const row = (x0, x1, cw, y, h, label, n, fill, color) => {
    let s = `<rect x="${x0}" y="${y}" width="${x1 - x0}" height="${h}" fill="${fill}" stroke="${C.ink}" stroke-width="2.5"/>` + text(f((x0 + x1) / 2), f(y + h / 2 + 8), label, { size: 22, color });
    for (let i = 0; i < n; i++) s += `<rect x="${x1 + i * cw}" y="${y}" width="${cw}" height="${h}" fill="white" stroke="${C.ink}" stroke-width="2.5"/>`;
    return s;
  };

  // 꿀벌(위에서 본 모양): 날개 넷
  const bee = (x, y) => `<path d="M${x - 6} ${y - 44} Q${x - 14} ${y - 58} ${x - 20} ${y - 60} M${x + 6} ${y - 44} Q${x + 14} ${y - 58} ${x + 20} ${y - 60}" stroke="${C.ink}" stroke-width="2.5" fill="none" stroke-linecap="round"/>`
    + [[-1, 1], [1, 1]].map(([sx]) => `<ellipse cx="${x + sx * 28}" cy="${y - 12}" rx="24" ry="12" transform="rotate(${sx * 22} ${x + sx * 28} ${y - 12})" fill="${C.sky}" fill-opacity=".85" stroke="${C.blue}" stroke-width="2.5"/>`
      + `<ellipse cx="${x + sx * 24}" cy="${y + 12}" rx="18" ry="10" transform="rotate(${sx * -18} ${x + sx * 24} ${y + 12})" fill="${C.sky}" fill-opacity=".85" stroke="${C.blue}" stroke-width="2.5"/>`).join('')
    + `<ellipse cx="${x}" cy="${y + 4}" rx="15" ry="28" fill="${C.yellow}" stroke="${C.ink}" stroke-width="2.5"/>`
    + `<path d="M${x - 14} ${y - 2} H${x + 14} M${x - 13} ${y + 12} H${x + 13}" stroke="${C.ink}" stroke-width="4"/>`
    + `<circle cx="${x}" cy="${y - 34}" r="11" fill="${C.ink}"/>`;

  // 양: 꿀벌 1마리에 날개 4개 → 3마리가 되자 날개도 12개 → 꿀벌 수·날개 수처럼 세거나 잴 수 있는 것
  (function () {
    const id = 't51-m4-yang', bx = [90, 210, 330], by = 150;
    const card = (y, label, color, fill) => `<rect x="420" y="${y}" width="190" height="104" rx="16" fill="${fill}" stroke="${color}" stroke-width="3"/>` + text(515, y + 32, label, { size: 22, color });
    const big = (y, v, color, cls, d) => `<g class="${cls}" ${delay(d)}>${text(515, y + 86, v, { size: 46, color })}</g>`;
    const body = `<g class="p1" ${delay(.1)}>${bee(bx[0], by)}</g>`
      + `<g class="p2" ${delay(.2)}>${bee(bx[1], by)}</g><g class="p2" ${delay(.6)}>${bee(bx[2], by)}</g>`
      + tag(bx[0], by + 70, '날개 4', C.blue, 's1', .6, 20)
      + tag(bx[1], by + 70, '날개 4', C.blue, 's2', .5, 20) + tag(bx[2], by + 70, '날개 4', C.blue, 's2', .9, 20)
      + `<g class="s1" ${delay(.3)}>${card(28, '꿀벌 수', C.orange, C.peach)}${card(208, '날개 수', C.blue, C.sky)}</g>`
      + `<g class="o2" ${delay(1)}>${big(28, '1', C.orange, 's1', .5)}${big(208, '4', C.blue, 's1', .8)}</g>`
      + big(28, '3', C.orange, 'p2', 1.1) + big(208, '12', C.blue, 'p2', 1.3)
      + `<g class="k3" ${delay(.2)}><rect x="414" y="22" width="202" height="116" rx="20" fill="none" stroke="${C.green}" stroke-width="4"/><rect x="414" y="202" width="202" height="116" rx="20" fill="none" stroke="${C.green}" stroke-width="4"/></g>`
      + `<g class="p3" ${delay(1)}>${pill(515, 170, 80, '양', C.green, C.mint, 26)}</g>`;
    put('5-1/수학/4/양', svg(id, body, motion(id)));
  })();

  // 대응 관계: 책상 1개에 다리 4개 → 표에서 책상 수와 다리 수가 위아래로 짝 → 짝마다 ×4, (책상 수) × 4 = (다리 수)
  (function () {
    const id = 't51-m4-daeung', x0 = 200, x1 = 330, cw = 74, yA = 66, yB = 176, h = 50;
    const desk = `<path d="M40 92 L170 92 L150 70 L60 70 Z" fill="${C.peach}" stroke="${C.orange}" stroke-width="3" stroke-linejoin="round"/>`
      + `<rect x="40" y="92" width="130" height="10" fill="${C.orange}"/>`
      + [[48, 102, 170], [162, 102, 170], [66, 80, 150], [144, 80, 150]].map(([x, y1, y2]) => `<path d="M${x} ${y1} V${y2}" stroke="${C.orange}" stroke-width="6" stroke-linecap="round"/>`).join('');
    const legNo = [[48, 192], [162, 192], [66, 172], [144, 172]].map(([x, y], i) => tag(x, y, i + 1, C.blue, 'p1', .5 + i * .2, 20)).join('');
    const top = [1, 2, 3, 4], bot = [4, 8, 12, 16];
    const cx = (i) => x1 + i * cw + cw / 2;
    const body = desk + legNo
      + `<g class="s1" ${delay(.2)}>${row(x0, x1, cw, yA, h, '책상 수', 4, C.peach, C.orange)}${row(x0, x1, cw, yB, h, '다리 수', 4, C.sky, C.blue)}</g>`
      + `<g class="s1" ${delay(1.2)}>${text(cx(0), yA + 34, 1, { size: 26 })}${text(cx(0), yB + 34, 4, { size: 26 })}</g>`
      + top.slice(1).map((v, i) => tag(cx(i + 1), yA + 34, v, C.ink, 'p2', .2 + i * .4, 26) + tag(cx(i + 1), yB + 34, bot[i + 1], C.ink, 'p2', .4 + i * .4, 26)).join('')
      + top.map((_, i) => `<path class="draw d2" pathLength="1" ${delay(.3 + i * .3)} d="M${cx(i)} ${yA + h + 6} V${yB - 8} M${cx(i) - 7} ${yB - 16} L${cx(i)} ${yB - 8} L${cx(i) + 7} ${yB - 16}" stroke="${C.green}" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`).join('')
      + top.map((_, i) => tag(cx(i) + 22, yA + h + 38, '×4', C.green, 'p3', .2 + i * .2, 20)).join('')
      + `<g class="s3" ${delay(1)}>${text(424, 290, '(책상 수) × 4 = (다리 수)', { size: 26, color: C.ink })}</g>`
      + `<g class="p3" ${delay(1.4)}>${pill(110, 290, 136, '대응 관계', C.green, C.mint, 22)}</g>`;
    put('5-1/수학/4/대응 관계', svg(id, body, motion(id)));
  })();

  // 규칙: 피자 1판=8조각 표 → 피자가 1판 늘 때마다(+1) 조각은 8개씩(+8) → 규칙대로 5판이면 40조각
  (function () {
    const id = 't51-m4-gyuchik', x0 = 24, x1 = 150, cw = 92, yA = 150, yB = 200, h = 50;
    const cx = (i) => x1 + i * cw + cw / 2;
    const pizza = (x, y) => `<circle cx="${f(x)}" cy="${f(y)}" r="16" fill="${C.peach}" stroke="${C.orange}" stroke-width="2.5"/>`
      + `<path d="M${f(x - 16)} ${f(y)} H${f(x + 16)} M${f(x)} ${f(y - 16)} V${f(y + 16)} M${f(x - 11.3)} ${f(y - 11.3)} L${f(x + 11.3)} ${f(y + 11.3)} M${f(x + 11.3)} ${f(y - 11.3)} L${f(x - 11.3)} ${f(y + 11.3)}" stroke="${C.orange}" stroke-width="1.5"/>`;
    const spots = [[-19, -19], [19, -19], [-19, 19], [19, 19]];
    let pies = '';
    for (let k = 1; k <= 4; k++) for (let j = 0; j < k; j++) pies += `<g class="p1" ${delay(.2 + k * .15 + j * .1)}>${pizza(cx(k - 1) + spots[j][0], 76 + spots[j][1])}</g>`;
    const A = [1, 2, 3, 4], B = [8, 16, 24, 32];
    const body = pies
      + row(x0, x1, cw, yA, h, '피자 수', 5, C.peach, C.orange) + row(x0, x1, cw, yB, h, '조각 수', 5, C.sky, C.blue)
      + A.map((v, i) => tag(cx(i), yA + 34, v, C.ink, 's1', .3 + i * .15, 26) + tag(cx(i), yB + 34, B[i], C.ink, 's1', .5 + i * .15, 26)).join('')
      + [0, 1, 2].map((i) => bow(cx(i) + 12, yA - 4, cx(i + 1) - 12, yA - 4, -24, C.orange, 'd2', .2 + i * .3) + tag((cx(i) + cx(i + 1)) / 2, yA - 24, '+1', C.orange, 's2', .3 + i * .3, 20)).join('')
      + [0, 1, 2].map((i) => bow(cx(i) + 12, yB + h + 4, cx(i + 1) - 12, yB + h + 4, 24, C.blue, 'd2', 1 + i * .3) + tag((cx(i) + cx(i + 1)) / 2, yB + h + 48, '+8', C.blue, 's2', 1.1 + i * .3, 22)).join('')
      + `<g class="h3">${text(cx(4), yA + 34, '5', { size: 26 })}${text(cx(4), yB + 34, '?', { size: 26, color: C.muted })}</g>`
      + `<g class="s3">${text(cx(4), yA + 34, '5', { size: 26 })}</g>`
      + bow(cx(3) + 12, yA - 4, cx(4) - 12, yA - 4, -24, C.orange, 'd3', .2) + tag((cx(3) + cx(4)) / 2, yA - 24, '+1', C.orange, 's3', .3, 20)
      + bow(cx(3) + 12, yB + h + 4, cx(4) - 12, yB + h + 4, 24, C.blue, 'd3', .5) + tag((cx(3) + cx(4)) / 2, yB + h + 48, '+8', C.blue, 's3', .6, 22)
      + `<g class="p3" ${delay(1)}><rect x="${cx(4) - 40}" y="${yB + 6}" width="80" height="${h - 12}" rx="8" fill="${C.yellow}"/>${text(cx(4), yB + 34, 40, { size: 26, color: C.ink })}</g>`
      + ring(cx(4), yB + h / 2, 30, C.orange, 'r3', 1.2)
      + `<g class="p3" ${delay(1.4)}>${pill(cx(4), 76, 90, '규칙', C.green, C.mint, 26)}</g>`;
    put('5-1/수학/4/규칙', svg(id, body, motion(id)));
  })();

  // 기호: 사진을 누름 못으로 이어 붙임(사진 1장에 못 2개, 한 장 늘면 못 1개) → 사진 수를 □, 누름 못 수를 △ 로 → □ + 1 = △
  (function () {
    const id = 't51-m4-giho', px = 150, pw = 92, gap = 4, py = 46, ph = 72, x0 = 30, x1 = 200, cw = 100, yA = 168, yB = 226, h = 50;
    const sq = (x, y, s = 30, c = C.purple) => `<rect x="${f(x - s / 2)}" y="${f(y - s / 2)}" width="${s}" height="${s}" fill="${C.lilac}" stroke="${c}" stroke-width="3.5"/>`;
    const tri = (x, y, s = 34, c = C.green) => `<path d="M${f(x)} ${f(y - s * .55)} L${f(x + s * .58)} ${f(y + s * .45)} L${f(x - s * .58)} ${f(y + s * .45)} Z" fill="${C.mint}" stroke="${c}" stroke-width="3.5" stroke-linejoin="round"/>`;
    const photo = (k) => { const x = px + k * (pw + gap); return `<rect x="${x}" y="${py}" width="${pw}" height="${ph}" rx="4" fill="white" stroke="${C.muted}" stroke-width="2.5"/><rect x="${x + 8}" y="${py + 8}" width="${pw - 16}" height="${ph - 16}" fill="${[C.sky, C.peach, C.mint, C.lilac][k]}"/>`
      + `<path d="M${x + 14} ${py + ph - 12} L${x + 36} ${py + 30} L${x + 52} ${py + 48} L${x + 64} ${py + 36} L${x + pw - 14} ${py + ph - 12} Z" fill="${C.line}"/>`; };
    const pin = (k) => `<circle cx="${f(px - gap / 2 + k * (pw + gap))}" cy="${py + 4}" r="9" fill="${C.red}" stroke="white" stroke-width="2"/>`;
    let board = '';
    for (let k = 0; k < 4; k++) board += `<g class="p1" ${delay(.2 + k * .35)}>${photo(k)}${k === 0 ? pin(0) : ''}${pin(k + 1)}</g>`;
    const cx = (i) => x1 + i * cw + cw / 2;
    const A = [1, 2, 3, 4], B = [2, 3, 4, 5];
    const body = board
      + `<g class="s1" ${delay(.2)}>${row(x0, x1, cw, yA, h, '', 4, C.lilac, C.purple)}${row(x0, x1, cw, yB, h, '', 4, C.mint, C.green)}</g>`
      + A.map((v, i) => tag(cx(i), yA + 34, v, C.ink, 's1', .4 + i * .35, 26) + tag(cx(i), yB + 34, B[i], C.ink, 's1', .5 + i * .35, 26)).join('')
      + `<g class="o2" ${delay(.2)}>${`<g class="s1">${text(115, yA + 33, '사진 수', { size: 22, color: C.purple })}${text(115, yB + 33, '누름 못 수', { size: 22, color: C.green })}</g>`}</g>`
      + `<g class="p2" ${delay(.6)}>${sq(115, yA + h / 2)}</g><g class="p2" ${delay(.9)}>${tri(115, yB + h / 2)}</g>`
      + ring(115, yA + h / 2, 24, C.purple, 'r2', 1) + ring(115, yB + h / 2, 24, C.green, 'r2', 1.2)
      + `<g class="s3" ${delay(.3)}>${sq(300, 316)}${text(370, 326, '+ 1 =', { size: 30 })}${tri(440, 316)}</g>`
      + `<g class="k3" ${delay(.9)}><rect x="266" y="288" width="208" height="56" rx="14" fill="none" stroke="${C.orange}" stroke-width="3.5"/></g>`
      + `<g class="p3" ${delay(1.3)}>${pill(100, 316, 90, '기호', C.orange, C.peach, 26)}</g>`
      + `<g class="s3" ${delay(1.5)}>${arrow(150, 316, 270, 316, C.orange)}</g>`;
    put('5-1/수학/4/기호', svg(id, body, motion(id)));
  })();
})(typeof window !== 'undefined' ? window : globalThis);
