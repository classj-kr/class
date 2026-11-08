// 수학 4-1 1단원 큰 수: 낱말 도식
// 교과서 차례를 따른다: 1000이 10개 → 만, 10000이 10·100·1000개 → 십만·백만·천만(10배씩), 1000만이 10개 → 억, 1000억이 10개 → 조.
// 억·조는 교과서 자리 표처럼 일의 자리부터 네 자리씩(천·백·십·일) 끊고, 묶음 이름이 일·만·억·조로 바뀌게 그린다.
// 움직임은 transform·opacity·stroke-dashoffset 만 쓴다(아이패드 사파리).
(function (root) {
  'use strict';
  const { C, svg, text, arrow, put } = root.FigureKit;
  const f = (n) => +(+n).toFixed(1);
  const dl = (s, more = '') => `style="animation-delay:${s}s;transition-delay:${s}s;${more}"`;
  const T = (x, y, s, o = {}) => text(f(x), f(y), s, o);

  // 같이 쓰는 움직임(N 은 칸 번호). sN 나타나기, pN 튀어나오기, dN 선 그리기(class="dr dN" pathLength="100"), rN 퍼지는 고리,
  // kN 깜빡이기(보이던 것), mN 옮겨 가 머물기(--mx,--my), gN 사라지기. 한 요소에 움직임 하나만.
  const motion = (id) => {
    let css = `
    .sc-${id} :is(.s1,.s2,.s3,.s4,.p1,.p2,.p3,.p4){opacity:0}
    .sc-${id} :is(.p1,.p2,.p3,.p4,.ring){transform-box:fill-box;transform-origin:center}
    .sc-${id} .dr{stroke-dasharray:100 110;stroke-dashoffset:101;transition:stroke-dashoffset .6s ease-in-out}
    .sc-${id} :is(.m1,.m2,.m3,.m4){transition:transform .9s ease-in-out}
    .sc-${id} :is(.g1,.g2,.g3,.g4){transition:opacity .35s linear}
    .sc-${id} .ring{opacity:0}
    @keyframes ${id}-in{from{opacity:0}to{opacity:1}}
    @keyframes ${id}-pop{0%{opacity:0;transform:scale(0)}70%{opacity:1;transform:scale(1.15)}100%{opacity:1;transform:none}}
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
  const pill = (cx, cy, w, s, color, fill, size = 24) => `<rect x="${f(cx - w / 2)}" y="${f(cy - 21)}" width="${w}" height="42" rx="21" fill="${fill}" stroke="${color}" stroke-width="2.5"/>${T(cx, cy + size * .36, s, { size, color })}`;
  // 숫자 한 줄을 글자마다 정한 x 에 둔다(요소 하나)
  const row = (xs, y, s, { size = 28, color = C.ink, weight = 700 } = {}) => `<text x="${xs.map(f).join(' ')}" y="${f(y)}" text-anchor="middle" font-size="${size}" font-weight="${weight}" fill="${color}">${s}</text>`;
  // 칸 여러 개를 한 경로로
  const boxes = (xs, y, w, h, stroke = C.line, fill = 'white', sw = 2.5) => `<path d="${xs.map((x) => `M${f(x)} ${f(y)} h${w} v${h} h${-w} Z`).join(' ')}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round"/>`;
  // 천 모형(앞면 정사각형 왼쪽 위가 x,y)
  const kcube = (x, y, s = 40, d = 12, stroke = C.orange) => `<path d="M${x} ${y} l${d} ${-d} h${s} l${-d} ${d} Z" fill="white" stroke="${stroke}" stroke-width="2" stroke-linejoin="round"/>`
    + `<path d="M${x + s} ${y} l${d} ${-d} v${s} l${-d} ${d} Z" fill="${C.orange}" fill-opacity=".35" stroke="${stroke}" stroke-width="2" stroke-linejoin="round"/>`
    + `<rect x="${x}" y="${y}" width="${s}" height="${s}" fill="${C.peach}" stroke="${stroke}" stroke-width="2"/>`
    + `<path d="M${x + s / 3} ${y} v${s} M${x + 2 * s / 3} ${y} v${s} M${x} ${y + s / 3} h${s} M${x} ${y + 2 * s / 3} h${s}" stroke="${stroke}" stroke-width="1" stroke-opacity=".6"/>`;

  // 만: 천 모형이 하나씩 1000, 2000, … 9000 → 10개째에 10000, 10개를 묶음 → 10000 = 1만, 만(일만)
  (function () {
    const id = 't41-m1-man', X = (i) => 34 + i * 58, Y = 118;
    let cubes = '';
    for (let i = 0; i < 10; i++) {
      const n = i < 9 ? 1 : 2, d = i < 9 ? .15 + i * .14 : .2;
      cubes += `<g class="p${n}" ${dl(d)}>${kcube(X(i), Y, 40, 12, i < 9 ? C.orange : C.red)}</g>`
        + tag(X(i) + 20, 186, (i + 1) * 1000, i < 9 ? C.ink : C.red, `s${n}`, d + .1, 18);
    }
    const body = cubes
      + `<rect class="dr d2" pathLength="100" ${dl(.6)} x="22" y="90" width="598" height="108" rx="20" fill="none" stroke="${C.green}" stroke-width="4"/>`
      + tag(320, 76, '10개', C.green, 'p2', 1.1, 26)
      + `<g class="s2" ${dl(1.3)}>${arrow(200, 204, 200, 226, C.green)}</g>`
      + `<g class="p2" ${dl(1.4)}>${T(200, 274, '10000', { size: 56, color: C.green })}</g>`
      + `<g class="s3" ${dl(.2)}>${T(330, 272, '=', { size: 50 })}${T(430, 274, '1만', { size: 56, color: C.green })}</g>`
      + ring(430, 254, 40, C.green, 'r3', .5)
      + `<g class="p3" ${dl(.9)}>${pill(320, 328, 150, '만 · 일만', C.green, C.mint, 24)}</g>`;
    put('4-1/수학/1/만', svg(id, body, motion(id)));
  })();

  // 다섯 자리 수: 21735 의 숫자를 하나씩 세면 5개 → 가장 작은 10000, 가장 큰 99999 → 99999 + 1 = 100000 은 6개
  (function () {
    const id = 't41-m1-daseot', bx = (i) => 130 + i * 80;
    let top = '';
    '21735'.split('').forEach((ch, i) => {
      top += `<g class="p1" ${dl(.2 + i * .3)}>${T(bx(i) + 34, 132, ch, { size: 46 })}</g>`
        + tag(bx(i) + 34, 62, i + 1, C.orange, 'p1', .3 + i * .3, 22);
    });
    const sx = (x0, n) => Array.from({ length: n }, (_, i) => x0 + i * 44);
    const g1 = sx(70, 5), g2 = sx(360, 5), g3 = sx(336, 6);
    const body = boxes([0, 1, 2, 3, 4].map(bx), 78, 68, 72) + top
      + tag(590, 126, '5개', C.orange, 'p1', 1.8, 30)
      + `<g class="k3" ${dl(1)}>${boxes([0, 1, 2, 3, 4].map(bx), 78, 68, 72, C.green, 'none', 3.5)}</g>`
      + `<g class="s2" ${dl(.2)}>${T(178, 198, '가장 작은 수', { size: 19, color: C.muted })}${boxes(g1, 210, 40, 44)}${row(g1.map((x) => x + 20), 242, '10000', { color: C.blue })}</g>`
      + `<g class="s2" ${dl(.8)}>${T(323, 242, '~', { size: 34 })}</g>`
      + `<g class="s2" ${dl(1.1)}>${T(468, 198, '가장 큰 수', { size: 19, color: C.muted })}${boxes(g2, 210, 40, 44)}${row(g2.map((x) => x + 20), 242, '99999', { color: C.blue })}</g>`
      + `<g class="s3" ${dl(.2)}>${arrow(468, 258, 468, 290, C.red)}${T(486, 282, '+1', { size: 20, color: C.red, anchor: 'start' })}</g>`
      + `<g class="p3" ${dl(.7)}>${boxes(g3, 296, 40, 44, C.red)}${row(g3.map((x) => x + 20), 328, '100000', { color: C.red })}</g>`
      + tag(302, 328, '6개', C.red, 'p3', 1.1, 24)
      + `<g class="p3" ${dl(1.5)}>${pill(130, 318, 160, '다섯 자리 수', C.green, C.mint, 22)}</g>`;
    put('4-1/수학/1/다섯 자리 수', svg(id, body, motion(id)));
  })();

  // 만의 자리: 82019 를 자리 칸에 → 일의 자리부터 왼쪽으로 1~5 세면 다섯째가 만의 자리 → 8 은 80000
  (function () {
    const id = 't41-m1-manjari', cw = 100, x0 = 70, cx = (i) => x0 + i * cw + cw / 2;
    const heads = ['만의 자리', '천의 자리', '백의 자리', '십의 자리', '일의 자리'];
    const vals = ['80000', '2000', '0', '10', '9'];
    let grid = `<rect x="${x0}" y="52" width="${cw * 5}" height="48" fill="${C.mint}"/>`
      + `<path d="M${x0} 52 h${cw * 5} v184 h${-cw * 5} Z M${x0} 100 h${cw * 5} M${x0} 180 h${cw * 5}${[1, 2, 3, 4].map((i) => ` M${x0 + i * cw} 52 v184`).join('')}" fill="none" stroke="${C.line}" stroke-width="2.5"/>`;
    heads.forEach((h, i) => { grid += T(cx(i), 83, h, { size: 19, color: C.green }); });
    const digits = '82019'.split('').map((ch, i) => `<g class="p1" ${dl(.2 + i * .25)}>${T(cx(i), 158, ch, { size: 52, color: i === 0 ? C.orange : C.ink })}</g>`).join('');
    const counts = [4, 3, 2, 1, 0].map((i, k) => `<g class="p2" ${dl(.3 + k * .25)}><circle cx="${cx(i)}" cy="286" r="17" fill="white" stroke="${C.orange}" stroke-width="2.5"/>${T(cx(i), 293, k + 1, { size: 20, color: C.orange })}</g>`).join('');
    const values = vals.map((v, i) => `<g class="s3" ${dl(.2 + i * .12)}>${T(cx(i), 217, v, { size: 24, color: i === 0 ? C.orange : C.muted })}</g>`).join('');
    const body = grid + digits
      + `<g class="h3"><path class="dr d2" pathLength="100" ${dl(.1)} d="M560 254 H84 M96 246 L84 254 L96 262" fill="none" stroke="${C.orange}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>${counts}</g>`
      + `<g class="s2" ${dl(1.6)}><rect x="${x0 + 3}" y="55" width="${cw - 6}" height="178" rx="6" fill="none" stroke="${C.orange}" stroke-width="4"/></g>`
      + ring(cx(0), 76, 30, C.orange, 'r2', 1.7)
      + values + ring(cx(0), 210, 34, C.orange, 'r3', .6)
      + `<g class="s3" ${dl(1)}>${T(320, 306, '82019 = <tspan fill="' + C.orange + '">80000</tspan> + 2000 + 10 + 9', { size: 30 })}</g>`;
    put('4-1/수학/1/만의 자리', svg(id, body, motion(id)));
  })();

  // 십만: 10000원짜리 지폐 10장 → 한 묶음으로 모여 100000 → 10만, 십만
  (function () {
    const id = 't41-m1-sipman';
    const bill = (x, y) => `<rect x="${x}" y="${y}" width="100" height="46" rx="6" fill="${C.mint}" stroke="${C.green}" stroke-width="2.5"/>${T(x + 50, y + 30, '10000', { size: 20, color: C.green })}`;
    let bills = '';
    for (let i = 0; i < 10; i++) {
      const x = 40 + (i % 5) * 114, y = i < 5 ? 36 : 94, tx = 56 + i * 5, ty = 186 + i * 6;
      bills += `<g class="m2" ${dl(.1 + i * .06, `--mx:${tx - x}px;--my:${ty - y}px`)}><g class="p1" ${dl(.15 + i * .16)}>${bill(x, y)}</g></g>`;
    }
    const body = bills
      + tag(130, 326, '10개', C.green, 's2', 1.1, 24)
      + `<g class="s2" ${dl(1.1)}>${arrow(222, 232, 290, 232, C.green)}</g>`
      + `<g class="p2" ${dl(1.3)}>${T(410, 250, '100000', { size: 50, color: C.green })}</g>`
      + `<g class="s3" ${dl(.2)}>${T(400, 312, '= 10만', { size: 38, color: C.green })}</g>`
      + `<g class="p3" ${dl(.8)}>${pill(568, 300, 86, '십만', C.green, C.mint, 26)}</g>`
      + ring(410, 233, 46, C.green, 'r3', .3);
    put('4-1/수학/1/십만', svg(id, body, motion(id)));
  })();

  // 백만: 한 칸이 10000 인 모눈 → 한 줄(10칸)이 100000 → 10줄 다 차면 1000000 → 100만, 백만
  (function () {
    const id = 't41-m1-baekman', x0 = 40, y0 = 64, u = 24;
    let lines = '';
    for (let i = 1; i < 10; i++) lines += `M${x0 + i * u} ${y0} v${10 * u} M${x0} ${y0 + i * u} h${10 * u} `;
    let rows = '', counts = '';
    for (let r = 0; r < 10; r++) {
      const n = r === 0 ? 1 : 2, d = r === 0 ? .8 : .2 + (r - 1) * .16;
      rows += `<rect class="fill fill${n}" ${dl(d)} x="${x0}" y="${y0 + r * u}" width="${10 * u}" height="${u}" fill="${r === 0 ? C.orange : C.blue}" fill-opacity="${r === 0 ? .5 : .35}"/>`;
      counts += tag(x0 + 10 * u + 18, y0 + r * u + 18, r + 1, r === 0 ? C.orange : C.blue, `s${n}`, d + .4, 18);
    }
    const body = `<rect x="${x0}" y="${y0}" width="${10 * u}" height="${10 * u}" fill="white"/>` + rows
      + `<g class="p1" ${dl(.2)}><rect x="${x0}" y="${y0}" width="${u}" height="${u}" fill="${C.orange}"/></g>`
      + `<path d="${lines}" stroke="${C.line}" stroke-width="1.5"/><rect x="${x0}" y="${y0}" width="${10 * u}" height="${10 * u}" fill="none" stroke="${C.ink}" stroke-width="2.5"/>`
      + tag(x0 + 12, y0 - 14, '10000', C.orange, 's1', .3, 18) + counts
      + `<g class="s1" ${dl(1.3)}>${T(340, 130, '100000', { size: 40, color: C.orange, anchor: 'start' })}${T(570, 130, '십만', { size: 24, color: C.muted })}</g>`
      + `<g class="p2" ${dl(1.9)}>${T(340, 216, '1000000', { size: 44, color: C.blue, anchor: 'start' })}</g>`
      + `<g class="k3" ${dl(.1)}><rect x="${x0}" y="${y0}" width="${10 * u}" height="${10 * u}" fill="none" stroke="${C.green}" stroke-width="5"/></g>`
      + tag(x0 + 5 * u, 336, '100개', C.green, 'p3', .3, 22)
      + `<g class="s3" ${dl(.6)}>${T(340, 296, '= 100만', { size: 36, color: C.green, anchor: 'start' })}</g>`
      + `<g class="p3" ${dl(1.1)}>${pill(564, 284, 86, '백만', C.green, C.mint, 26)}</g>`;
    put('4-1/수학/1/백만', svg(id, body, motion(id) + `
      .sc-${id} .fill{transform-box:fill-box;transform-origin:left center;transform:scaleX(0);transition:transform .45s ease-out}
      .on1 .sc-${id} .fill1,.on2 .sc-${id} .fill2{transform:none}`));
  })();

  // 천만: 1만 → 10만 → 100만 → 1000만, 10개씩(10배씩) 커지는 사다리 → 10000 이 1000개
  (function () {
    const id = 't41-m1-cheonman', ys = [74, 144, 214, 284];
    const nums = ['10000', '100000', '1000000', '10000000'], short = ['1만', '10만', '100만', '1000만'], reads = ['만', '십만', '백만', '천만'];
    let body = '';
    ys.forEach((y, i) => {
      const n = i < 3 ? 1 : 2, d = i < 3 ? .2 + i * .55 : .9;
      const last = i === 3;
      body += `<g class="${last ? 'p2' : 's1'}" ${dl(d)}>${T(330, y + 13, last ? `<tspan fill="${C.orange}">1</tspan>0000000` : nums[i], { size: 36, anchor: 'end' })}</g>`;
      body += `<g class="${last ? 's3' : 's1'}" ${dl(last ? .3 : d + .15)}>${pill(480, y, 100, short[i], last ? C.orange : C.green, last ? C.peach : C.mint, 22)}${T(590, y + 9, reads[i], { size: 26, color: last ? C.orange : C.muted })}</g>`;
      if (i) {
        const y1 = ys[i - 1] + 6, y2 = y - 14;
        body += `<g class="s${n}" ${dl(i < 3 ? d - .15 : .3)}><path d="M344 ${y1} C380 ${y1} 380 ${y2} 350 ${y2}" fill="none" stroke="${C.muted}" stroke-width="3"/><path d="M360 ${y2 - 8} L350 ${y2} L360 ${y2 + 8}" fill="none" stroke="${C.muted}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>${T(386, (y1 + y2) / 2 + 6, '10개', { size: 18, color: C.muted, anchor: 'start' })}</g>`;
      }
    });
    body += ring(480, ys[3], 34, C.orange, 'r3', .7) + ring(590, ys[3], 30, C.orange, 'r3', .9)
      + `<g class="s3" ${dl(1.3)}><path d="M150 60 H138 V296 H150" fill="none" stroke="${C.green}" stroke-width="3.5" stroke-linejoin="round"/>${T(84, 190, '1000개', { size: 22, color: C.green })}</g>`;
    put('4-1/수학/1/천만', svg(id, body, motion(id)));
  })();

  // 억·조: 1000만(1000억) 10개를 묶음 → 그 수의 숫자들이 자리 표(네 자리씩 천·백·십·일, 묶음 이름 일·만·억·조)로 들어감
  //        → 맨 앞 1 이 새 묶음(억·조)의 일의 자리 → 1억, 1조
  function bigTable(id, key, unit, groups, cw, gap, big, reading) {
    const G = groups.length, n = G * 4, total = n * cw + (G - 1) * gap, x0 = (640 - total) / 2;
    const colX = (j) => x0 + j * cw + Math.floor(j / 4) * gap + cw / 2;
    const num = '1' + '0'.repeat(n - 4), L = num.length, ts = 26, sx = 320 - (L - 1) * ts / 2;
    // 위: 묶음 카드 10장
    let cards = '';
    for (let i = 0; i < 10; i++) {
      const cx = 84 + (i % 5) * 104, cy = i < 5 ? 48 : 96;
      cards += `<g class="p1" ${dl(.1 + i * .1)}>${pill(cx, cy, 92, unit, C.blue, C.sky, 20)}</g>`;
    }
    cards += `<rect class="dr d1" pathLength="100" ${dl(1.2)} x="26" y="18" width="532" height="108" rx="18" fill="none" stroke="${C.green}" stroke-width="3.5"/>`
      + tag(596, 80, '10개', C.green, 'p1', 1.6, 24);
    // 가운데 수 → 자리 표로 옮겨 가는 숫자
    let digits = '';
    for (let k = 0; k < L; k++) {
      const j = n - L + k, x = sx + k * ts, tx = colX(j);
      digits += `<g class="m2" ${dl(.1 + (L - 1 - k) * .07, `--mx:${f(tx - x)}px;--my:${252 - 184}px`)}><g class="p1" ${dl(1.6 + k * .03)}>${T(x, 184, num[k], { size: 40, color: k === 0 ? C.orange : C.ink })}</g></g>`;
    }
    // 자리 표
    let d = '', heads = [];
    for (let g = 0; g < G; g++) {
      const gx = x0 + g * (4 * cw + gap);
      d += `M${f(gx)} 222 h${4 * cw} v72 h${-4 * cw} Z M${f(gx)} 264 h${4 * cw} `;
      for (let c = 1; c < 4; c++) d += `M${f(gx + c * cw)} 222 v72 `;
      heads.push(...['천', '백', '십', '일'].map((h, c) => [gx + c * cw + cw / 2, h]));
    }
    const table = `<g class="s2" ${dl(0)}><path d="${d}" fill="white" stroke="${C.line}" stroke-width="2"/>`
      + `<text x="${heads.map((h) => f(h[0])).join(' ')}" y="286" text-anchor="middle" font-size="18" font-weight="700" fill="${C.muted}">${heads.map((h) => h[1]).join('')}</text></g>`;
    let labels = '';
    for (let g = 0; g < G; g++) {
      const gx = x0 + g * (4 * cw + gap), first = g === 0;
      labels += `<g class="s2" ${dl(1.2 + (G - 1 - g) * .25)}><path d="M${f(gx + 4)} 300 v8 h${4 * cw - 8} v-8" fill="none" stroke="${first ? C.orange : C.green}" stroke-width="3"/>${T(gx + 2 * cw, 334, groups[g], { size: 24, color: first ? C.orange : C.green })}</g>`;
    }
    const lead = colX(n - L);
    const body = cards + table + digits + labels
      + ring(lead, 243, 22, C.orange, 'r3', .2) + ring(x0 + 2 * cw, 326, 22, C.orange, 'r3', .5)
      + `<g class="p3" ${dl(.9)}>${T(230, 196, big, { size: 46, color: C.orange })}</g>`
      + `<g class="p3" ${dl(1.3)}>${pill(410, 182, 150, reading, C.orange, C.peach, 24)}</g>`;
    put(key, svg(id, body, motion(id)));
  }
  bigTable('t41-m1-eok', '4-1/수학/1/억', '1000만', ['억', '만', '일'], 40, 12, '1억', '억 · 일억');
  bigTable('t41-m1-jo', '4-1/수학/1/조', '1000억', ['조', '억', '만', '일'], 34, 10, '1조', '조 · 일조');

  // 뛰어 세기: 20000 에서 10000 씩 → 30000, 40000, 50000, 60000(만의 자리 숫자가 1씩) → 거꾸로 10000 씩 50000, 40000
  (function () {
    const id = 't41-m1-ttwieo', at = (n) => 70 + (n - 20000) / 100;
    const line = (y) => {
      let ticks = '';
      for (let n = 20000; n <= 70000; n += 10000) ticks += `M${at(n)} ${y - 10} v20 `;
      const lab = [2, 3, 4, 5, 6, 7].map((k) => `<g>${T(at(k * 10000), y + 36, `<tspan fill="${C.orange}">${k}</tspan>0000`, { size: 20, weight: 600 })}</g>`).join('');
      return `<path d="M44 ${y} H596" stroke="${C.ink}" stroke-width="3"/><path d="${ticks}" stroke="${C.ink}" stroke-width="2.5"/>${lab}`;
    };
    // 깡충 화살표: a → b, 줄 y 위로 h 만큼 솟는 곡선 + 끝 화살촉
    const hop = (a, b, y, h, cls, d, color) => {
      const xa = at(a), xb = at(b), m = (xa + xb) / 2, s = Math.sign(xb - xa);
      const ex = xb - s * 4, ey = y - 6, ang = Math.atan2(ey - (y - h * 2), ex - m), l = 13;
      const p = (q) => `${f(ex - l * Math.cos(ang + q))} ${f(ey - l * Math.sin(ang + q))}`;
      return `<path class="dr ${cls}" pathLength="100" ${dl(d)} d="M${xa + s * 4} ${ey} Q${m} ${y - h * 2} ${ex} ${ey} M${p(-.5)} L${ex} ${ey} L${p(.5)}" fill="none" stroke="${color}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>`;
    };
    let fw = '';
    for (let k = 0; k < 4; k++) {
      const a = 20000 + k * 10000, n = k ? 2 : 1, d = k ? .2 + (k - 1) * .6 : .4;
      fw += hop(a, a + 10000, 150, 40, `d${n}`, d, C.orange) + tag((at(a) + at(a + 10000)) / 2, 100, '+10000', C.orange, `p${n}`, d + .4, 18);
    }
    let bw = '';
    for (let k = 0; k < 2; k++) {
      const a = 60000 - k * 10000;
      bw += hop(a, a - 10000, 300, 40, 'd3', .5 + k * .6, C.blue) + tag((at(a) + at(a - 10000)) / 2, 250, '−10000', C.blue, 'p3', .9 + k * .6, 18);
    }
    const body = line(150) + fw
      + `<g class="dot1"><circle cx="${at(20000)}" cy="150" r="10" fill="${C.orange}" stroke="white" stroke-width="2.5"/></g>`
      + `<g class="s3" ${dl(.1)}>${line(300)}</g>` + bw
      + `<g class="s3" ${dl(.2)}><g class="dot2"><circle cx="${at(60000)}" cy="300" r="10" fill="${C.blue}" stroke="white" stroke-width="2.5"/></g></g>`;
    put('4-1/수학/1/뛰어 세기', svg(id, body, motion(id) + `
      @keyframes ${id}-h1{0%{transform:none}50%{transform:translate(50px,-40px)}100%{transform:translate(100px,0)}}
      @keyframes ${id}-h2{0%{transform:translate(100px,0)}16.7%{transform:translate(150px,-40px)}33.3%{transform:translate(200px,0)}50%{transform:translate(250px,-40px)}66.7%{transform:translate(300px,0)}83.3%{transform:translate(350px,-40px)}100%{transform:translate(400px,0)}}
      @keyframes ${id}-h3{0%{transform:none}25%{transform:translate(-50px,-40px)}50%{transform:translate(-100px,0)}75%{transform:translate(-150px,-40px)}100%{transform:translate(-200px,0)}}
      .on1 .sc-${id} .dot1{animation:${id}-h1 .7s ease-in-out .4s both}
      .on2 .sc-${id} .dot1{animation:${id}-h2 1.8s linear .2s both}
      .on3 .sc-${id} .dot2{animation:${id}-h3 1.2s linear .5s both}`));
  })();
})(typeof window !== 'undefined' ? window : globalThis);
