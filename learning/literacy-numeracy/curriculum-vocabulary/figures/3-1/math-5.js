// 수학 3-1 5단원 길이와 시간: 낱말 도식
// 자: 위 모서리에서 눈금이 내려온다(cm 긴 눈금, 5 mm 중간, mm 짧은 눈금). 눈금은 굵기마다 path 하나로 그린다.
// 시계: 바늘은 12시를 향하게 그리고, 속성 없는 <g> 를 시계 가운데를 축으로 돌린다(transform-box: view-box).
// 바늘 이름은 교과서마다 다르므로(초바늘·초침) 그림에도 칸 글에도 이름을 쓰지 않는다. 가장 빨리 도는 가는 바늘은 빨강.
(function (root) {
  'use strict';
  const { C, svg, text, arrow, put } = root.FigureKit;
  const f = (n) => +(+n).toFixed(1);
  const delay = (s, more = '') => `style="animation-delay:${s}s;transition-delay:${s}s;${more}"`;

  // 같이 쓰는 움직임. sN 나타나기, pN 튀어나오기, dN 선 그리기(pathLength="1"), rN 퍼지는 고리, kN 깜빡이며 남기,
  // fN 날아오기(--dx,--dy 만큼 떨어진 곳에서 제자리로), iN 왼쪽에서 밀려 들어오기, gN 그 칸에서 사라지기
  const motion = (id) => {
    let css = `
    .sc-${id} :is(.s1,.s2,.s3,.s4,.p1,.p2,.p3,.p4,.k1,.k2,.k3,.k4,.f1,.f2,.f3,.f4,.i1,.i2,.i3,.i4) { opacity: 0; }
    .sc-${id} :is(.p1,.p2,.p3,.p4,.ring) { transform-box: fill-box; transform-origin: center; }
    .sc-${id} .draw { stroke-dasharray: 1; stroke-dashoffset: 1; transition: stroke-dashoffset .5s ease-in-out; }
    .sc-${id} :is(.g2,.g3,.g4) { transition: opacity .4s linear; }
    .sc-${id} .ring { opacity: 0; }
    @keyframes ${id}-fin { from { opacity: 0; } to { opacity: 1; } }
    @keyframes ${id}-pop { 0% { opacity: 0; transform: scale(0); } 70% { opacity: 1; transform: scale(1.2); } 100% { opacity: 1; transform: scale(1); } }
    @keyframes ${id}-ring { 0% { opacity: .9; transform: scale(1); } 100% { opacity: 0; transform: scale(2.4); } }
    @keyframes ${id}-blink { 0% { opacity: 0; } 20% { opacity: 1; } 40% { opacity: .15; } 60% { opacity: 1; } 80% { opacity: .15; } 100% { opacity: 1; } }
    @keyframes ${id}-fly { from { opacity: 0; transform: translate(var(--dx), var(--dy)); } 20% { opacity: 1; } to { opacity: 1; transform: none; } }
    @keyframes ${id}-in { from { opacity: 0; transform: translateX(-60px); } to { opacity: 1; transform: none; } }`;
    for (let n = 1; n <= 4; n++) css += `
    .on${n} .sc-${id} .s${n} { animation: ${id}-fin .4s ease-out both; }
    .on${n} .sc-${id} .p${n} { animation: ${id}-pop .5s ease-out both; }
    .on${n} .sc-${id} .d${n} { stroke-dashoffset: 0; }
    .on${n} .sc-${id} .r${n} { animation: ${id}-ring 1.1s ease-out 2 both; }
    .on${n} .sc-${id} .k${n} { animation: ${id}-blink 1.6s ease-in-out both; }
    .on${n} .sc-${id} .f${n} { animation: ${id}-fly .7s ease-in-out both; }
    .on${n} .sc-${id} .i${n} { animation: ${id}-in .7s ease-out both; }
    .on${n} .sc-${id} .g${n} { opacity: 0; }`;
    return css;
  };
  const T = (x, y, s, o = {}) => text(f(x), f(y), s, o);
  const ring = (x, y, r, color, cls, d = 0) => `<circle class="ring ${cls}" ${delay(d)} cx="${f(x)}" cy="${f(y)}" r="${r}" fill="none" stroke="${color}" stroke-width="4"/>`;
  const label = (x, y, s, color, cls, d = 0, size = 28) => `<g class="${cls}" ${delay(d)}>${T(x, y, s, { size, color })}</g>`;
  // 아래로 벌어지는 묶음 괄호(x1~x2, 위 y)
  const brace = (x1, x2, y, color, down = true) => {
    const m = (x1 + x2) / 2, s = down ? 1 : -1;
    return `<path d="M${f(x1)} ${y} Q${f(x1)} ${y + 12 * s} ${f(x1 + 12)} ${y + 12 * s} H${f(m - 12)} Q${f(m)} ${y + 12 * s} ${f(m)} ${y + 24 * s} Q${f(m)} ${y + 12 * s} ${f(m + 12)} ${y + 12 * s} H${f(x2 - 12)} Q${f(x2)} ${y + 12 * s} ${f(x2)} ${y}" fill="none" stroke="${color}" stroke-width="3"/>`;
  };

  // ---------- 자 ----------
  // x0 = 0 눈금 자리, y = 자의 위 모서리, ppc = 1 cm 의 화면 길이, n = 몇 cm 까지, every = 몇 cm 마다 수를 쓰나, mm = 작은 눈금
  function ruler(x0, y, ppc, n, { every = 1, mm = true, h = 50, size = 18 } = {}) {
    let big = '', mid = '', small = '', nums = '';
    for (let c = 0; c <= n; c++) {
      const x = x0 + c * ppc;
      big += `M${f(x)} ${y}v${c % 5 ? 16 : 20}`;
      if (c % every === 0) nums += T(x, y + h - 10, c, { size, weight: 600 });
      if (c === n) break;
      if (mm) {
        for (let k = 1; k < 10; k++) (k === 5 ? (mid += `M${f(x + k * ppc / 10)} ${y}v11`) : (small += `M${f(x + k * ppc / 10)} ${y}v7`));
      } else mid += `M${f(x + ppc / 2)} ${y}v9`;
    }
    return `<rect x="${f(x0 - 12)}" y="${y}" width="${f(n * ppc + 24)}" height="${h}" rx="4" fill="white" stroke="${C.ink}" stroke-width="2.5"/>`
      + (small ? `<path d="${small}" stroke="${C.ink}" stroke-width="1.2"/>` : '')
      + `<path d="${mid}" stroke="${C.ink}" stroke-width="1.6"/><path d="${big}" stroke="${C.ink}" stroke-width="2.4"/>` + nums;
  }

  // 단위: 1 cm 칸 하나 → 연필 옆에 1 cm 가 12번 → 12 cm → 길이의 단위 mm·cm·m·km, 시간의 단위 초·분·시간
  (function () {
    const id = 't31-m5-danwi', x0 = 70, ppc = 34;
    const pencil = `<rect x="${x0}" y="58" width="${370}" height="28" fill="${C.yellow}" stroke="${C.orange}" stroke-width="2.5"/>`
      + `<path d="M${x0 + 370} 58 L${x0 + 12 * ppc} 72 L${x0 + 370} 86 Z" fill="${C.peach}" stroke="${C.orange}" stroke-width="2.5" stroke-linejoin="round"/>`
      + `<path d="M${x0 + 12 * ppc - 12} 69 L${x0 + 12 * ppc} 72 L${x0 + 12 * ppc - 12} 75 Z" fill="${C.ink}"/>`;
    const tile = (k, cls, d) => `<g class="${cls}" ${delay(d)}><rect x="${x0 + k * ppc}" y="96" width="${ppc}" height="28" fill="${C.peach}" stroke="${C.orange}" stroke-width="2"/></g>`;
    const tiles = tile(0, 'p1', .3) + Array.from({ length: 11 }, (_, k) => tile(k + 1, 'p2', .2 + k * .13)).join('')
      + `<g class="s2" ${delay(1.7)}>${Array.from({ length: 12 }, (_, k) => T(x0 + k * ppc + ppc / 2, 117, k + 1, { size: 18, color: C.orange })).join('')}</g>`;
    const cards = (list, y, color, fill, d0, size = 26) => list.map((u, k) => `<g class="p3" ${delay(d0 + k * .18)}><rect x="${68 + k * 100}" y="${y}" width="84" height="44" rx="10" fill="${fill}" stroke="${color}" stroke-width="3"/>${T(110 + k * 100, y + 31, u, { size, color })}</g>`).join('');
    const body = pencil + tiles
      + `<g class="s1" ${delay(.1)}>${ruler(x0, 134, ppc, 14, { h: 50 })}</g>`
      + ring(x0 + ppc / 2, 110, 18, C.orange, 'r1', .5)
      + `<g class="h2"><g class="s1" ${delay(.6)}>${T(500, 119, '1 cm', { size: 26, color: C.orange, anchor: 'start' })}</g></g>`
      + `<g class="p2" ${delay(1.9)}>${T(500, 119, '12 cm', { size: 26, color: C.orange, anchor: 'start' })}</g>`
      + cards(['mm', 'cm', 'm', 'km'], 212, C.green, C.mint, .2)
      + cards(['초', '분', '시간'], 276, C.blue, C.sky, .9, 24)
      + `<g class="k4" ${delay(.1)}><rect x="56" y="202" width="408" height="128" rx="14" fill="none" stroke="${C.orange}" stroke-width="3" stroke-dasharray="9 7"/></g>`
      + label(548, 280, '단위', C.green, 'p4', .6, 36)
      + ring(548, 268, 34, C.green, 'r4', 1);
    put('3-1/수학/5/단위', svg(id, body, motion(id)));
  })();

  // 센티미터: 자의 0~1 눈금 사이 1 cm → 수학책 긴 쪽 28 cm → 30 cm 자가 줄어 1 m 막대의 앞 30 cm 에 놓이고 10 cm 씩 채워 100 cm = 1 m
  (function () {
    const id = 't31-m5-cm', x0 = 65, ppc = 17, y = 150, mx = 70, my = 262, seg = 50;
    const k = (3 * seg) / (30 * ppc);
    const book = `<g class="h3"><g class="f2" ${delay(.2, '--dx:0px;--dy:-50px')}><rect x="${x0}" y="66" width="${28 * ppc}" height="76" rx="4" fill="${C.sky}" stroke="${C.blue}" stroke-width="3"/>${T(x0 + 14 * ppc, 113, '수학책', { size: 24, color: C.blue })}</g>`
      + `<g class="s2" ${delay(.9)}><path d="M${x0 + 28 * ppc} 142 V${y}" stroke="${C.orange}" stroke-width="3"/>${T(x0 + 28 * ppc, 54, '28 cm', { size: 26, color: C.orange })}</g></g>`;
    const rul = `<g class="rl"><g class="s1" ${delay(.1)}>${ruler(x0, y, ppc, 30, { every: 5, mm: false, h: 50 })}</g>`
      + `<g class="p1" ${delay(.5)}><rect x="${x0}" y="${y + 2}" width="${ppc}" height="22" fill="${C.orange}" opacity=".55"/></g></g>`;
    const one = `<g class="h2"><g class="s1" ${delay(.8)}>${T(x0 + 34, y - 14, '1 cm', { size: 26, color: C.orange, anchor: 'start' })}</g></g>` + ring(x0 + ppc / 2, y + 13, 16, C.orange, 'r1', .7);
    const segs = Array.from({ length: 10 }, (_, i) => `<rect class="sg" ${delay(.9 + i * .12)} x="${mx + i * seg}" y="${my}" width="${seg}" height="24" fill="${i % 2 ? 'white' : C.peach}" stroke="${C.orange}" stroke-width="2"/>`).join('');
    const nums = `<g class="s3" ${delay(2)}>${Array.from({ length: 11 }, (_, i) => T(mx + i * seg, my + 50, i * 10, { size: 18, weight: 600 })).join('')}${T(612, my + 50, '(cm)', { size: 18, color: C.muted })}</g>`;
    const body = book + rul + one + segs + nums
      + `<g class="s3" ${delay(1.6)}>${brace(mx, mx + 10 * seg, my - 8, C.green, false)}${T(mx + 5 * seg, my - 40, '1 m', { size: 26, color: C.green })}</g>`
      + `<g class="s3" ${delay(.4)}>${T(320, 130, '100 cm = 1 m', { size: 40 })}</g>`;
    put('3-1/수학/5/센티미터', svg(id, body, motion(id) + `
      .sc-${id} .rl { transform-box: view-box; transform-origin: 0 0; transition: transform .8s ease-in-out .2s, opacity .4s linear 1.2s; }
      .on3 .sc-${id} .rl { transform: translate(${mx}px, ${my}px) scale(${k.toFixed(4)}) translate(${-x0}px, ${-y}px); opacity: 0; }
      .sc-${id} .sg { transform-box: fill-box; transform-origin: left center; transform: scaleX(0); transition: transform .25s ease-out; }
      .on3 .sc-${id} .sg { transform: none; }
    `));
  })();

  // 밀리미터: 자의 0~1 cm 를 크게 → 작은 눈금 9개로 10칸, 한 칸이 1 mm → 수박씨가 7칸, 7 mm → 10칸이 1 cm, 1 cm = 10 mm
  (function () {
    const id = 't31-m5-mm', x0 = 70, Z = 500, zy = 200, zh = 44, c = Z / 10;
    const ticks = Array.from({ length: 9 }, (_, i) => `<path class="draw d2" pathLength="1" ${delay(.15 + i * .08)} d="M${x0 + (i + 1) * c} ${zy} V${zy + (i === 4 ? 30 : 22)}" stroke="${C.ink}" stroke-width="2.5"/>`).join('');
    const cellNums = (from, to, cls, d0) => Array.from({ length: to - from + 1 }, (_, i) => {
      const n = from + i;
      return `<g class="${cls}" ${delay(d0 + i * .12)}>${T(x0 + (n - .5) * c, zy + zh - 6, n, { size: 18, color: C.orange })}</g>`;
    }).join('');
    const body = ruler(x0, 36, 50, 10, { h: 48 })
      + `<g class="s1" ${delay(.2)}><rect x="${x0 - 2}" y="33" width="54" height="54" rx="4" fill="none" stroke="${C.orange}" stroke-width="3.5"/>`
      + `<path d="M${x0} 87 L${x0} ${zy} M${x0 + 50} 87 L${x0 + Z} ${zy}" stroke="${C.orange}" stroke-width="2" stroke-dasharray="6 5"/></g>`
      + `<g class="p1" ${delay(.6)}><rect x="${x0}" y="${zy}" width="${Z}" height="${zh}" fill="white" stroke="${C.ink}" stroke-width="3"/>`
      + `<path d="M${x0} ${zy} v${zh} M${x0 + Z} ${zy} v${zh}" stroke="${C.ink}" stroke-width="4"/></g>`
      + `<g class="s1" ${delay(1)}>${T(x0, zy + 72, '0', { size: 22 })}${T(x0 + Z, zy + 72, '1 cm', { size: 22 })}</g>`
      + `<g class="s2" ${delay(1)}><rect x="${x0 + 2}" y="${zy + 2}" width="${c - 2}" height="${zh - 4}" fill="${C.peach}"/></g>`
      + ticks
      + `<g class="s2" ${delay(1.3)}>${T(x0 + c / 2, zy + 104, '1 mm', { size: 26, color: C.orange })}</g>`
      + ring(x0 + c / 2, zy + zh / 2, 20, C.orange, 'r2', 1.2)
      + `<g class="f3" ${delay(.2, '--dx:0px;--dy:-60px')}><ellipse cx="${x0 + 3.5 * c}" cy="166" rx="${3.5 * c}" ry="20" fill="${C.ink}"/>${T(x0 + 3.5 * c, 175, '7 mm', { size: 26, color: 'white' })}</g>`
      + `<g class="s3" ${delay(.8)}><path d="M${x0 + 7 * c} 186 V${zy}" stroke="${C.ink}" stroke-width="2" stroke-dasharray="4 4"/></g>`
      + cellNums(1, 7, 'p3', .9)
      + cellNums(8, 10, 'p4', .2)
      + `<g class="s4" ${delay(.8)}>${T(380, 336, '1 cm = 10 mm', { size: 36 })}</g>`
      + `<g class="k4" ${delay(.9)}><rect x="${x0 - 6}" y="${zy - 6}" width="${Z + 12}" height="${zh + 12}" rx="6" fill="none" stroke="${C.green}" stroke-width="4"/></g>`;
    put('3-1/수학/5/밀리미터', svg(id, body, motion(id)));
  })();

  // 미터: 10 cm 막대가 하나씩 10개 → 100 cm → 하나로 묶여 1 m, 100 cm = 1 m → 20 cm 를 더 이어 1 m 20 cm = 120 cm
  (function () {
    const id = 't31-m5-m', x0 = 70, seg = 40, y = 140, h = 36;
    const piece = (i, cls, d) => `<g class="${cls}" ${delay(d, '--dx:0px;--dy:-60px')}><rect x="${x0 + i * seg}" y="${y}" width="${seg}" height="${h}" fill="${i % 2 ? 'white' : C.peach}" stroke="${C.orange}" stroke-width="2.5"/></g>`;
    const num = (i, cls, d) => `<g class="${cls}" ${delay(d)}>${T(x0 + (i + 1) * seg, y + h + 28, (i + 1) * 10, { size: 18, weight: 600 })}</g>`;
    const segs = Array.from({ length: 10 }, (_, i) => piece(i, 'f1', .2 + i * .15)).join('');
    const nums = Array.from({ length: 10 }, (_, i) => num(i, 's1', .35 + i * .15)).join('')
      + T(x0, y + h + 28, 0, { size: 18, weight: 600 }) + T(x0 + 12 * seg + 30, y + h + 28, '(cm)', { size: 18, color: C.muted, anchor: 'start' });
    const body = segs + nums
      + `<g class="h2"><g class="p1" ${delay(1.9)}>${T(x0 + 10 * seg, y - 16, '100 cm', { size: 24, color: C.orange })}</g></g>`
      + `<g class="s2" ${delay(.2)}><rect x="${x0}" y="${y}" width="${10 * seg}" height="${h}" fill="${C.mint}" stroke="${C.green}" stroke-width="4"/></g>`
      + `<g class="s2" ${delay(.6)}>${brace(x0, x0 + 10 * seg, y - 10, C.green, false)}${T(x0 + 5 * seg, y - 44, '1 m', { size: 32, color: C.green })}</g>`
      + `<g class="h3"><g class="s2" ${delay(1.1)}>${T(320, 280, '100 cm = 1 m', { size: 42 })}</g></g>`
      + piece(10, 'f3', .2) + piece(11, 'f3', .5) + num(10, 's3', .5) + num(11, 's3', .8)
      + `<g class="s3" ${delay(1)}>${brace(x0 + 10 * seg, x0 + 12 * seg, y - 10, C.orange, false)}${T(x0 + 11 * seg, y - 44, '20 cm', { size: 24, color: C.orange })}</g>`
      + `<g class="s3" ${delay(1.4)}>${T(320, 280, '1 m 20 cm = 120 cm', { size: 38 })}</g>`
      + ring(x0 + 5 * seg, y - 56, 34, C.green, 'r4', .2)
      + `<g class="k4" ${delay(.2)}><rect x="${x0 - 6}" y="${y - 6}" width="${10 * seg + 12}" height="${h + 12}" rx="6" fill="none" stroke="${C.green}" stroke-width="3"/></g>`
      + label(560, 338, '미터', C.green, 'p4', .8, 30);
    put('3-1/수학/5/미터', svg(id, body, motion(id)));
  })();

  // 킬로미터: 학교에서 우체국까지 100 m 씩 10칸을 걸어감 → 1000 m = 1 km → 긴 거리를 나타내는 단위
  (function () {
    const id = 't31-m5-km', x0 = 100, seg = 46, y = 172, h = 30, x1 = x0 + 10 * seg;
    const school = `<rect x="34" y="132" width="52" height="${y + h - 132}" fill="${C.peach}" stroke="${C.orange}" stroke-width="3"/>`
      + `<path d="M28 134 L60 108 L92 134 Z" fill="${C.orange}"/><path d="M60 108 V86" stroke="${C.ink}" stroke-width="2.5"/><path d="M60 86 h16 l-4 6 l4 6 h-16 Z" fill="${C.red}"/>`
      + `<rect x="52" y="${y + h - 22}" width="16" height="22" fill="white" stroke="${C.orange}" stroke-width="2"/>`;
    const post = `<rect x="572" y="132" width="52" height="${y + h - 132}" fill="${C.sky}" stroke="${C.blue}" stroke-width="3"/>`
      + `<rect x="580" y="142" width="36" height="24" fill="white" stroke="${C.blue}" stroke-width="2"/><path d="M580 142 L598 156 L616 142" fill="none" stroke="${C.blue}" stroke-width="2"/>`
      + `<rect x="590" y="${y + h - 22}" width="16" height="22" fill="white" stroke="${C.blue}" stroke-width="2"/>`;
    const road = `<rect x="${x0}" y="${y}" width="${10 * seg}" height="${h}" fill="${C.line}"/>`
      + Array.from({ length: 10 }, (_, i) => `<rect class="sg" ${delay(.2 + i * .18)} x="${x0 + i * seg}" y="${y}" width="${seg}" height="${h}" fill="${C.mint}"/>`).join('')
      + `<path d="${Array.from({ length: 9 }, (_, i) => `M${x0 + (i + 1) * seg} ${y}v${h}`).join('')}" stroke="white" stroke-width="2.5"/>`
      + `<rect x="${x0}" y="${y}" width="${10 * seg}" height="${h}" fill="none" stroke="${C.green}" stroke-width="2.5"/>`;
    const nums = Array.from({ length: 10 }, (_, i) => `<g class="s1" ${delay(.35 + i * .18)}>${T(x0 + (i + .5) * seg, y + 22, i + 1, { size: 18, color: C.green })}</g>`).join('');
    const walker = `<g class="wk"><circle cx="${x0}" cy="${y - 42}" r="8" fill="${C.orange}"/><path d="M${x0} ${y - 34} V${y - 16} M${x0 - 9} ${y - 28} H${x0 + 9} M${x0} ${y - 16} L${x0 - 7} ${y - 3} M${x0} ${y - 16} L${x0 + 7} ${y - 3}" stroke="${C.orange}" stroke-width="4" stroke-linecap="round"/></g>`;
    const body = school + post + road + nums + walker
      + T(60, y + 58, '학교', { size: 20, color: C.orange }) + T(598, y + 58, '우체국', { size: 20, color: C.blue })
      + `<g class="h2"><g class="s1" ${delay(.4)}>${brace(x0, x0 + seg, y + h + 8, C.ink)}${T(x0 + seg / 2, y + h + 58, '100 m', { size: 20 })}</g></g>`
      + `<g class="s2" ${delay(.2)}>${brace(x0, x1, y + h + 8, C.green)}</g>`
      + `<g class="p2" ${delay(.6)}>${T((x0 + x1) / 2, y + h + 66, '1000 m', { size: 28, color: C.green })}</g>`
      + `<g class="s2" ${delay(1.2)}>${T(320, 334, '1000 m = 1 km', { size: 38 })}</g>`
      + label(320, 66, '킬로미터', C.green, 'p3', .3, 32)
      + `<g class="k3" ${delay(.6)}><rect x="${x0 - 6}" y="${y - 6}" width="${10 * seg + 12}" height="${h + 12}" rx="6" fill="none" stroke="${C.orange}" stroke-width="3"/></g>`;
    put('3-1/수학/5/킬로미터', svg(id, body, motion(id) + `
      .sc-${id} .sg { transform-box: fill-box; transform-origin: left center; transform: scaleX(0); transition: transform .18s linear; }
      .on1 .sc-${id} .sg { transform: none; }
      .sc-${id} .wk { transition: transform 1.8s linear .2s; }
      .on1 .sc-${id} .wk { transform: translateX(${10 * seg}px); }
    `));
  })();

  // 어림: 둘째 손가락 너비 약 1 cm → 연필 옆에 손가락을 차례로 대어 15번쯤, 약 15 cm → 자로 재니 14 cm → 짐작과 잰 길이를 견줌
  (function () {
    const id = 't31-m5-eorim', x0 = 80, ppc = 28, fw = 26.5, steps = 14;
    const pencil = `<rect x="${x0}" y="120" width="${360}" height="30" fill="${C.yellow}" stroke="${C.orange}" stroke-width="2.5"/>`
      + `<path d="M${x0 + 360} 120 L${x0 + 14 * ppc} 135 L${x0 + 360} 150 Z" fill="${C.peach}" stroke="${C.orange}" stroke-width="2.5" stroke-linejoin="round"/>`
      + `<path d="M${x0 + 14 * ppc - 11} 132 L${x0 + 14 * ppc} 135 L${x0 + 14 * ppc - 11} 138 Z" fill="${C.ink}"/>`;
    const finger = `<g class="fg"><rect x="${x0}" y="54" width="${fw}" height="84" rx="13" fill="${C.peach}" stroke="${C.orange}" stroke-width="2.5"/>`
      + `<rect x="${x0 + 5}" y="112" width="${fw - 10}" height="20" rx="7" fill="white" stroke="${C.orange}" stroke-width="2"/></g>`;
    const marks = Array.from({ length: 15 }, (_, i) => `<g class="${i ? 'p2' : 'p1'}" ${delay(i ? .2 + i * 1.7 / steps : .5)}><rect x="${f(x0 + i * fw + 1)}" y="156" width="${f(fw - 2)}" height="12" rx="4" fill="${i % 2 ? C.purple : C.lilac}" stroke="${C.purple}" stroke-width="1.5"/></g>`).join('');
    const body = pencil + marks + finger
      + `<g class="h2"><g class="s1" ${delay(.7)}>${T(x0 + 40, 96, '약 1 cm', { size: 24, color: C.purple, anchor: 'start' })}</g></g>`
      + `<g class="p2" ${delay(2)}>${T(565, 170, '약 15 cm', { size: 26, color: C.purple })}</g>`
      + `<g class="i3" ${delay(.2)}>${ruler(x0, 184, ppc, 16, { h: 48 })}</g>`
      + `<g class="s3" ${delay(1)}><path d="M${x0 + 14 * ppc} 150 V184" stroke="${C.red}" stroke-width="3" stroke-dasharray="5 4"/></g>`
      + ring(x0 + 14 * ppc, 186, 14, C.red, 'r3', 1.1)
      + `<g class="p3" ${delay(1.4)}>${T(592, 222, '14 cm', { size: 26, color: C.red })}</g>`
      + `<g class="s4" ${delay(.2)}><rect x="90" y="262" width="210" height="72" rx="12" fill="${C.lilac}"/>${T(195, 292, '어림', { size: 22, color: C.purple })}${T(195, 324, '약 15 cm', { size: 28, color: C.purple })}</g>`
      + `<g class="s4" ${delay(.6)}><rect x="340" y="262" width="210" height="72" rx="12" fill="${C.peach}"/>${T(445, 292, '잰 길이', { size: 22, color: C.red })}${T(445, 324, '14 cm', { size: 28, color: C.red })}</g>`
      + `<g class="k4" ${delay(1)}><rect x="84" y="256" width="222" height="84" rx="15" fill="none" stroke="${C.purple}" stroke-width="3.5"/></g>`;
    put('3-1/수학/5/어림', svg(id, body, motion(id) + `
      .sc-${id} .fg { transform: none; }
      .on2 .sc-${id} .fg { animation: ${id}-step 1.7s steps(${steps}, end) .2s both; }
      @keyframes ${id}-step { from { transform: none; } to { transform: translateX(${f(steps * fw)}px); } }
      .on3 .sc-${id} .fg { opacity: .35; transition: opacity .4s; }
    `));
  })();

  // ---------- 시계 ----------
  const pol = (cx, cy, r, deg) => [cx + r * Math.sin(deg * Math.PI / 180), cy - r * Math.cos(deg * Math.PI / 180)];
  function clockFace(cx, cy, R) {
    let small = '', big = '', nums = '';
    for (let k = 0; k < 60; k++) {
      const [x1, y1] = pol(cx, cy, R - 4, k * 6), [x2, y2] = pol(cx, cy, R - (k % 5 ? 12 : 20), k * 6);
      const d = `M${f(x1)} ${f(y1)}L${f(x2)} ${f(y2)}`;
      if (k % 5) small += d; else big += d;
    }
    for (let h = 1; h <= 12; h++) { const [x, y] = pol(cx, cy, R - 40, h * 30); nums += T(x, y + 8, h, { size: 22, weight: 700 }); }
    return `<circle cx="${cx}" cy="${cy}" r="${R}" fill="white" stroke="${C.ink}" stroke-width="5"/>`
      + `<path d="${small}" stroke="${C.ink}" stroke-width="1.6"/><path d="${big}" stroke="${C.ink}" stroke-width="3.5"/>` + nums;
  }
  // 12시를 향한 바늘(움직임은 바깥 <g class=cls> 에)
  const hand = (cx, cy, len, w, color, cls, tail = 0) => `<g class="${cls}"><path d="M${cx} ${cy + tail} V${cy - len}" stroke="${color}" stroke-width="${w}" stroke-linecap="round"/></g>`;
  const handCss = (id, cls, cx, cy, from) => `
      .sc-${id} .${cls} { transform-box: view-box; transform-origin: ${cx}px ${cy}px; transform: rotate(${from}deg); }`;

  // 시각: 바늘이 8시 5분 10초로 돌아감 → 8시, 5분, 10초를 차례로 읽음 → 시간 띠 위의 한 점 → 시계가 가리키는 한 때
  (function () {
    const id = 't31-m5-sigak', cx = 172, cy = 182, R = 140;
    const H = (8 + 5 / 60 + 10 / 3600) * 30, M = (5 + 10 / 60) * 6, S = 60;
    const hTip = pol(cx, cy, 72, H), mTip = pol(cx, cy, 104, M), sTip = pol(cx, cy, 116, S);
    const read = [[392, '8시', C.blue, hTip], [470, '5분', C.green, mTip], [556, '10초', C.red, sTip]];
    const reads = read.map(([x, s, c, tip], i) => `<g class="p2" ${delay(.3 + i * .55)}>${T(x, 128, s, { size: 38, color: c })}</g>` + ring(tip[0], tip[1], 14, c, 'r2', .3 + i * .55)).join('');
    const sx = 350, cw = 40, sy = 236;
    const strip = `<rect x="${sx}" y="${sy}" width="${6 * cw}" height="26" fill="white" stroke="${C.ink}" stroke-width="2.5"/>`
      + `<path d="${Array.from({ length: 5 }, (_, i) => `M${sx + (i + 1) * cw} ${sy}v26`).join('')}" stroke="${C.ink}" stroke-width="1.5"/>`
      + `<path d="M${sx} ${sy - 8}v42 M${sx + 6 * cw} ${sy - 8}v42" stroke="${C.ink}" stroke-width="3"/>`
      + T(sx, sy + 60, '8시 5분', { size: 18, weight: 600 }) + T(sx + 6 * cw, sy + 60, '8시 6분', { size: 18, weight: 600 });
    const body = clockFace(cx, cy, R)
      + hand(cx, cy, 72, 10, C.blue, 'hh', 10) + hand(cx, cy, 104, 7, C.green, 'mh', 12) + hand(cx, cy, 116, 3, C.red, 'sh', 20)
      + `<circle cx="${cx}" cy="${cy}" r="8" fill="${C.ink}"/>`
      + reads
      + `<g class="s3" ${delay(.2)}>${strip}</g>`
      + `<g class="s3" ${delay(.8)}>${arrow(470, 150, sx + cw + 4, sy - 16, C.muted)}</g>`
      + `<g class="p3" ${delay(1.2)}><circle cx="${sx + cw}" cy="${sy + 13}" r="10" fill="${C.purple}" stroke="white" stroke-width="2.5"/></g>`
      + ring(sx + cw, sy + 13, 12, C.purple, 'r3', 1.5)
      + label(470, 62, '시각', C.green, 'p4', .3, 34)
      + `<g class="k4" ${delay(.6)}><rect x="344" y="88" width="272" height="58" rx="12" fill="none" stroke="${C.green}" stroke-width="3"/></g>`;
    put('3-1/수학/5/시각', svg(id, body, motion(id)
      + handCss(id, 'hh', cx, cy, 0) + handCss(id, 'mh', cx, cy, 0) + handCss(id, 'sh', cx, cy, 0) + `
      .sc-${id} :is(.hh,.mh,.sh) { transition: transform 1.4s ease-in-out .2s; }
      .on1 .sc-${id} .hh { transform: rotate(${f(H)}deg); }
      .on1 .sc-${id} .mh { transform: rotate(${f(M)}deg); }
      .on1 .sc-${id} .sh { transform: rotate(${S}deg); }
    `));
  })();

  // 시간: 시간 띠(10초 칸) 위 8시 5분 10초에 점 → 2분, 20초만큼 색칠 → 끝이 8시 7분 30초 → 두 시각 사이의 길이 2분 20초
  (function () {
    const id = 't31-m5-sigan', x0 = 50, cw = 30, y = 140, h = 40;
    const X = (sec) => x0 + sec / 10 * cw;                    // 8시 5분부터 지난 초
    let minor = '', major = '';
    for (let i = 0; i <= 18; i++) (i % 6 ? (minor += `M${x0 + i * cw} ${y}v${h}`) : (major += `M${x0 + i * cw} ${y - 8}v${h + 16}`));
    const strip = `<rect x="${x0}" y="${y}" width="${18 * cw}" height="${h}" fill="white"/>`
      + `<rect class="ba" x="${X(10)}" y="${y}" width="${X(130) - X(10)}" height="${h}" fill="${C.peach}"/>`
      + `<rect class="bb" x="${X(130)}" y="${y}" width="${X(150) - X(130)}" height="${h}" fill="${C.lilac}"/>`
      + `<path d="${minor}" stroke="${C.muted}" stroke-width="1.5"/>`
      + `<rect x="${x0}" y="${y}" width="${18 * cw}" height="${h}" fill="none" stroke="${C.ink}" stroke-width="2.5"/>`
      + `<path d="${major}" stroke="${C.ink}" stroke-width="3"/>`
      + ['8시 5분', '8시 6분', '8시 7분', '8시 8분'].map((s, i) => T(x0 + i * 6 * cw, y + h + 30, s, { size: 18, weight: 600 })).join('');
    const dot = (sec, cls, d) => `<g class="${cls}" ${delay(d)}><circle cx="${X(sec)}" cy="${y + h / 2}" r="10" fill="${C.blue}" stroke="white" stroke-width="2.5"/></g>`;
    const body = strip
      + dot(10, 'p1', .3) + `<g class="s1" ${delay(.6)}>${T(X(10) + 4, y - 20, '8시 5분 10초', { size: 22, color: C.blue })}</g>`
      + `<g class="s2" ${delay(1)}>${brace(X(10), X(130), y + h + 44, C.orange)}${T((X(10) + X(130)) / 2, y + h + 96, '2분', { size: 24, color: C.orange })}</g>`
      + `<g class="s2" ${delay(1.7)}>${brace(X(130), X(150), y + h + 44, C.purple)}${T((X(130) + X(150)) / 2 + 6, y + h + 96, '20초', { size: 24, color: C.purple })}</g>`
      + dot(150, 'p3', .2) + `<g class="s3" ${delay(.5)}>${T(X(150), y - 20, '8시 7분 30초', { size: 22, color: C.blue })}</g>`
      + ring(X(150), y + h / 2, 12, C.blue, 'r3', .4)
      + `<g class="s4" ${delay(.2)}>${T(X(10) + 4, y - 54, '시각', { size: 22, color: C.blue })}${T(X(150), y - 54, '시각', { size: 22, color: C.blue })}</g>`
      + `<g class="k4" ${delay(.5)}><rect x="${X(10) - 4}" y="${y - 4}" width="${X(150) - X(10) + 8}" height="${h + 8}" rx="6" fill="none" stroke="${C.green}" stroke-width="4"/></g>`
      + `<g class="p4" ${delay(1)}>${T(250, 336, '시간', { size: 32, color: C.green })}${T(390, 336, '2분 20초', { size: 30 })}</g>`;
    put('3-1/수학/5/시간', svg(id, body, motion(id) + `
      .sc-${id} :is(.ba,.bb) { transform-box: fill-box; transform-origin: left center; transform: scaleX(0); }
      .sc-${id} .ba { transition: transform 1.1s linear .2s; }
      .sc-${id} .bb { transition: transform .4s linear 1.4s; }
      .on2 .sc-${id} :is(.ba,.bb) { transform: none; }
    `));
  })();

  // 초: 10시 30분에서 가는 바늘이 작은 눈금 한 칸 → 1초 → 한 바퀴를 도는 동안 둘레가 칠해지고 30분이 31분으로 → 60초 = 1분
  (function () {
    const id = 't31-m5-cho', cx = 180, cy = 182, R = 140;
    const [ax, ay] = pol(cx, cy, R - 8, 0), [bx, by] = pol(cx, cy, R - 8, 6);
    const tickArc = `<path d="M${f(ax)} ${f(ay)} A${R - 8} ${R - 8} 0 0 1 ${f(bx)} ${f(by)}" stroke="${C.orange}" stroke-width="12" fill="none"/>`;
    const lap = `<circle class="draw d2" pathLength="1" cx="${cx}" cy="${cy}" r="${R - 8}" transform="rotate(-84 ${cx} ${cy})" fill="none" stroke="${C.peach}" stroke-width="12"/>`;
    const rd = (m, mc, cls, d) => `<g class="${cls}" ${delay(d)}>${T(400, 128, '10시', { size: 32 })}${T(476, 128, m, { size: 32, color: mc })}${T(552, 128, '1초', { size: 32, color: C.red })}</g>`;
    const body = clockFace(cx, cy, R).replace('<path', `${lap}<path`)
      + `<g class="s1" ${delay(.9)}>${tickArc}</g>`
      + hand(cx, cy, 70, 10, C.ink, 'hh', 10) + hand(cx, cy, 104, 7, C.ink, 'mh', 12) + hand(cx, cy, 118, 3, C.red, 'sh', 22)
      + `<circle cx="${cx}" cy="${cy}" r="8" fill="${C.ink}"/>`
      + `<g class="h2">${rd('30분', C.ink, 's1', .9)}</g>`
      + `<g class="s1" ${delay(1.1)}>${T(214, 32, '1초', { size: 26, color: C.orange, anchor: 'start' })}</g>`
      + ring(f((ax + bx) / 2), f((ay + by) / 2), 14, C.orange, 'r1', 1)
      + rd('31분', C.green, 's2', 2)
      + `<g class="p2" ${delay(2)}>${T(476, 214, '60초', { size: 40, color: C.red })}</g>`
      + `<g class="s3" ${delay(.3)}>${T(476, 300, '60초 = 1분', { size: 40 })}</g>`
      + `<g class="k3" ${delay(.8)}><rect x="360" y="256" width="232" height="60" rx="12" fill="none" stroke="${C.green}" stroke-width="3.5"/></g>`;
    put('3-1/수학/5/초', svg(id, body, motion(id)
      + handCss(id, 'hh', cx, cy, 315) + handCss(id, 'mh', cx, cy, 180) + handCss(id, 'sh', cx, cy, 0) + `
      .on1 .sc-${id} .sh { animation: ${id}-tick .3s ease-out .6s both; }
      @keyframes ${id}-tick { from { transform: rotate(0deg); } to { transform: rotate(6deg); } }
      .on2 .sc-${id} .sh { animation: ${id}-lap 1.8s steps(60, end) .2s both; }
      @keyframes ${id}-lap { from { transform: rotate(6deg); } to { transform: rotate(366deg); } }
      .sc-${id} .mh { transition: transform 1.8s linear .2s; }
      .on2 .sc-${id} .mh { transform: rotate(186deg); }
      .sc-${id} .hh { transition: transform 1.8s linear .2s; }
      .on2 .sc-${id} .hh { transform: rotate(315.5deg); }
      .on2 .sc-${id} .d2 { transition: stroke-dashoffset 1.8s linear .2s; }
    `));
  })();
})(typeof window !== 'undefined' ? window : globalThis);
