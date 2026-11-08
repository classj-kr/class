// 수학 4-1 6단원 막대그래프: 낱말 도식
// 교과서를 따른다: 조사한 자료의 수량을 막대 모양으로 나타낸 그래프가 막대그래프, 가로와 세로를 바꾸어 막대를 가로로 나타낼 수 있다.
// 눈금 한 칸의 크기를 정해 막대 길이를 읽는다. 표는 정확한 수와 합계를, 그래프는 많고 적음을 한눈에 보여 준다.
// 자료는 교과서 것: 희망 직업별 학생 수(운동선수 12, 요리사 1, 경찰관 2, 의사 5, 연예인 8, 합계 28),
// 쓰담 달리기를 하고 싶어 하는 요일별 학생 수(월 40, 화 10, 수 50, 목 30, 금 80, 눈금 한 칸 10명).
(function (root) {
  'use strict';
  const { C, svg, text, put } = root.FigureKit;
  const f = (n) => +(+n).toFixed(1);
  const delay = (s, more = '') => `style="animation-delay:${s}s;transition-delay:${s}s;${more}"`;

  // 같이 쓰는 움직임. sN 나타나기, pN 튀어나오기, dN 선 그리기, rN 퍼지는 고리, kN 깜빡이며 남기, flN 깜빡이기,
  // gyN 아래에서 위로 자라기, gxN 왼쪽에서 오른쪽으로 자라기, mvN 제자리로 옮겨 오기(--dx, --dy 만큼 떨어진 곳에서)
  const motion = (id) => {
    let css = `
    .sc-${id} :is(.s1,.s2,.s3,.s4,.p1,.p2,.p3,.p4,.k1,.k2,.k3,.k4) { opacity: 0; }
    .sc-${id} :is(.p1,.p2,.p3,.p4,.ring) { transform-box: fill-box; transform-origin: center; }
    .sc-${id} .draw { stroke-dasharray: 1; stroke-dashoffset: 1; transition: stroke-dashoffset .6s ease-in-out; }
    .sc-${id} .ring { opacity: 0; }
    .sc-${id} :is(.gy1,.gy2,.gy3,.gy4) { transform-box: fill-box; transform-origin: center bottom; transform: scaleY(0); }
    .sc-${id} :is(.gx1,.gx2,.gx3,.gx4) { transform-box: fill-box; transform-origin: left center; transform: scaleX(0); }
    .sc-${id} :is(.mv1,.mv2,.mv3,.mv4) { transform: translate(var(--dx), var(--dy)); transition: transform 1s ease-in-out; }
    @keyframes ${id}-fin { from { opacity: 0; } to { opacity: 1; } }
    @keyframes ${id}-pop { 0% { opacity: 0; transform: scale(0); } 70% { opacity: 1; transform: scale(1.2); } 100% { opacity: 1; transform: scale(1); } }
    @keyframes ${id}-ring { 0% { opacity: .9; transform: scale(1); } 100% { opacity: 0; transform: scale(2.2); } }
    @keyframes ${id}-blink { 0% { opacity: 0; } 20% { opacity: 1; } 40% { opacity: .15; } 60% { opacity: 1; } 80% { opacity: .15; } 100% { opacity: 1; } }
    @keyframes ${id}-fl { 0%, 50%, 100% { opacity: 1; } 25%, 75% { opacity: .3; } }`;
    for (let n = 1; n <= 4; n++) css += `
    .on${n} .sc-${id} .s${n} { animation: ${id}-fin .4s ease-out both; }
    .on${n} .sc-${id} .p${n} { animation: ${id}-pop .5s ease-out both; }
    .on${n} .sc-${id} .d${n} { stroke-dashoffset: 0; }
    .on${n} .sc-${id} .r${n} { animation: ${id}-ring 1.1s ease-out 2 both; }
    .on${n} .sc-${id} .k${n} { animation: ${id}-blink 1.6s ease-in-out both; }
    .on${n} .sc-${id} .fl${n} { animation: ${id}-fl 1.4s ease-in-out both; }
    .on${n} .sc-${id} :is(.gy${n},.gx${n}) { transform: none; transition: transform .7s ease-out; }
    .on${n} .sc-${id} .mv${n} { transform: translate(0px, 0px); }`;
    return css;
  };
  const ring = (cx, cy, r, color, cls, d = 0) => `<circle class="ring ${cls}" ${delay(d)} cx="${f(cx)}" cy="${f(cy)}" r="${r}" fill="none" stroke="${color}" stroke-width="4"/>`;
  const tag = (x, y, s, color, cls, d = 0, size = 20, anchor = 'middle') => `<g class="${cls}" ${delay(d)}>${text(f(x), f(y), s, { size, color, anchor })}</g>`;
  const pill = (cx, cy, w, s, color = C.green, fill = C.mint, size = 24) => `<rect x="${f(cx - w / 2)}" y="${f(cy - 21)}" width="${w}" height="42" rx="21" fill="${fill}" stroke="${color}" stroke-width="2.5"/>${text(f(cx), f(cy + size * .36), s, { size, color })}`;
  const hiBox = (x, y, w, h, color, cls, d = 0) => `<g class="${cls}" ${delay(d)}><rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="6" fill="none" stroke="${color}" stroke-width="4"/></g>`;
  // 선 그리기 화살표(머리는 다 그린 뒤 나타남)
  const drawArrow = (x1, y1, x2, y2, color, n, d = 0, dur = 1, w = 5) => {
    const a = Math.atan2(y2 - y1, x2 - x1), l = 14, p = (k) => `${f(x2 - l * Math.cos(a + k))} ${f(y2 - l * Math.sin(a + k))}`;
    return `<path class="draw d${n}" pathLength="1" ${delay(d, `transition-duration:${dur}s;`)} d="M${x1} ${y1}L${x2} ${y2}" stroke="${color}" stroke-width="${w}" stroke-linecap="round" fill="none"/>`
      + `<g class="s${n}" ${delay(d + dur)}><path d="M${p(-.5)}L${x2} ${y2}L${p(.5)}" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" fill="none"/></g>`;
  };
  // 표: cols 는 칸 너비 목록, rows 는 줄마다 글자 목록. 첫 줄과 첫 칸은 옅은 바탕
  function table(x, y, cols, rh, rows, { size = 19, lineCls = '', cellCls = () => '' } = {}) {
    const W = cols.reduce((a, b) => a + b, 0), Ht = rh * rows.length;
    const xs = cols.reduce((a, w) => [...a, a[a.length - 1] + w], [x]);
    let s = `<rect x="${x}" y="${y}" width="${W}" height="${Ht}" fill="white"/><rect x="${x}" y="${y}" width="${W}" height="${rh}" fill="${C.mint}"/><rect x="${x}" y="${y}" width="${cols[0]}" height="${Ht}" fill="${C.mint}"/>`;
    let lines = '';
    for (let r = 1; r < rows.length; r++) lines += `M${x} ${y + r * rh}H${x + W}`;
    for (let c = 1; c < cols.length; c++) lines += `M${xs[c]} ${y}V${y + Ht}`;
    s += `<path class="${lineCls}" ${lineCls.includes('draw') ? 'pathLength="1"' : ''} d="${lines}" stroke="${C.muted}" stroke-width="2"/><rect x="${x}" y="${y}" width="${W}" height="${Ht}" fill="none" stroke="${C.ink}" stroke-width="3"/>`;
    rows.forEach((row, r) => row.forEach((cell, c) => {
      if (cell === '') return;
      const t = text(f((xs[c] + xs[c + 1]) / 2), f(y + r * rh + rh / 2 + size * .36), cell, { size, weight: r && c ? 700 : 600 });
      const cls = cellCls(r, c);
      s += cls ? `<g ${cls}>${t}</g>` : t;
    }));
    return { body: s, xs, cx: (c) => (xs[c] + xs[c + 1]) / 2, cy: (r) => y + r * rh + rh / 2, W, H: Ht };
  }
  // 세로 막대그래프의 틀: 세로축 x = ax, 가로축 y = ay, 값 v 의 높이 = v * u
  const vFrame = ({ ax, ay, x1, top, u, every, labelEvery, max, unitLabel = '(명)', size = 18 }) => {
    let g = '';
    for (let v = every; v <= max; v += every) g += `M${ax} ${f(ay - v * u)}H${x1}`;
    let labels = '';
    for (let v = 0; v <= max; v += labelEvery) labels += text(ax - 12, f(ay - v * u + 6), v, { size, weight: 600, anchor: 'end' });
    return {
      grid: `<path d="${g}" stroke="${C.line}" stroke-width="1.5" fill="none"/>`,
      labels: labels + text(ax, top - 12, unitLabel, { size, weight: 600 }),
      axes: `<path d="M${ax} ${top}V${ay}H${x1}" stroke="${C.ink}" stroke-width="3" fill="none"/>`
    };
  };
  const vBar = (cx, ay, h, w, cls, d, fill = C.sky, stroke = C.blue) => `<rect class="${cls}" ${delay(d)} x="${f(cx - w / 2)}" y="${f(ay - h)}" width="${w}" height="${f(h)}" fill="${fill}" stroke="${stroke}" stroke-width="3"/>`;

  const JOB = ['운동선수', '요리사', '경찰관', '의사', '연예인'], JV = [12, 1, 2, 5, 8];
  const DAY = ['월', '화', '수', '목', '금'], DV = [40, 10, 50, 30, 80];

  // 그래프: 직업별 학생 수를 수로만 → 수만큼 막대가 자라고 수가 막대 끝으로 → 가장 긴 막대와 가장 짧은 막대
  (function () {
    const id = 't41-m6-graph', ax = 90, ay = 300, u = 15, cx = (i) => 160 + 105 * i;
    const F = vFrame({ ax, ay, x1: 620, top: 100, u, every: 5, labelEvery: 5, max: 10 });
    const bars = JV.map((v, i) => vBar(cx(i), ay, v * u, 56, 'gy2', .3 + i * .15)).join('');
    const nums = JV.map((v, i) => `<g class="nm" ${delay(.3 + i * .15, `--dy:${8 - v * u}px`)}><g class="p1" ${delay(.2 + i * .2)}>${text(cx(i), ay - 18, v, { size: 30, color: C.blue })}</g></g>`).join('');
    const body = `<g class="s2">${F.grid}${F.labels}</g><path class="draw d2" pathLength="1" d="M${ax} 100V${ay}H620" stroke="${C.ink}" stroke-width="3" fill="none"/>`
      + bars + nums
      + JOB.map((n, i) => text(cx(i), 330, n, { size: 20 })).join('')
      + hiBox(cx(0) - 34, ay - 12 * u - 44, 68, 12 * u + 48, C.red, 'k3', .2)
      + ring(cx(1), ay - u - 12, 18, C.orange, 'r3', 1.2)
      + `<g class="p3" ${delay(1.6)}>${pill(520, 70, 110, '그래프')}</g>`;
    put('4-1/수학/6/그래프', svg(id, body, motion(id) + `
      .sc-${id} .nm { transition: transform .7s ease-out; }
      .on2 .sc-${id} .nm { transform: translate(0px, var(--dy)); }`));
  })();

  // 그림그래프: 큰 그림 10명, 작은 그림 1명 → 직업마다 그림, 운동선수는 큰 1 + 작은 2 = 12명 → 같은 수를 막대로 → 이름
  (function () {
    const id = 't41-m6-geurim', yc = (i) => 50 + 50 * i, bx = 392, bu = 17;
    const person = (x, y, k, color) => `<path d="M${f(x - 7 * k)} ${f(y - 9 * k)}A${f(7 * k)} ${f(7 * k)} 0 1 0 ${f(x + 7 * k)} ${f(y - 9 * k)}A${f(7 * k)} ${f(7 * k)} 0 1 0 ${f(x - 7 * k)} ${f(y - 9 * k)}ZM${f(x - 12 * k)} ${f(y + 16 * k)}Q${f(x - 12 * k)} ${f(y + 1 * k)} ${f(x)} ${f(y + 1 * k)}Q${f(x + 12 * k)} ${f(y + 1 * k)} ${f(x + 12 * k)} ${f(y + 16 * k)}Z" fill="${color}" stroke="${C.ink}" stroke-width="1.5"/>`;
    let icons = '', ends = [];
    JV.forEach((v, i) => {
      let x = 140, j = 0;
      const row = [];
      for (let b = 0; b < Math.floor(v / 10); b++, j++) { row.push(`<g class="p2" ${delay(.2 + i * .25 + j * .04)}>${person(x + 14, yc(i), 1.15, C.orange)}</g>`); x += 32; }
      for (let s = 0; s < v % 10; s++, j++) { row.push(`<g class="p2" ${delay(.2 + i * .25 + j * .04)}>${person(x + 9, yc(i) + 4, .7, C.peach)}</g>`); x += 21; }
      icons += row.join(''); ends.push(x);
    });
    let frame = '';
    for (let i = 1; i < 5; i++) frame += `M10 ${25 + 50 * i}H360`;
    frame += 'M115 25V275';
    const bars = JV.map((v, i) => `<rect class="gx3" ${delay(.3 + i * .15)} x="${bx}" y="${yc(i) - 13}" width="${v * bu}" height="26" fill="${C.sky}" stroke="${C.blue}" stroke-width="2.5"/>`).join('');
    const body = `<rect x="10" y="25" width="350" height="250" fill="white" stroke="${C.ink}" stroke-width="2.5"/><path d="${frame}" stroke="${C.line}" stroke-width="2"/>`
      + JOB.map((n, i) => text(62, yc(i) + 7, n, { size: 19 })).join('')
      + `<g class="s1" ${delay(.2)}>${person(40, 320, 1.15, C.orange)}${text(60, 328, '10명', { size: 20, anchor: 'start' })}${person(150, 324, .7, C.peach)}${text(166, 328, '1명', { size: 20, anchor: 'start' })}</g>`
      + ring(40, 320, 20, C.orange, 'r1', .6) + ring(150, 322, 14, C.orange, 'r1', .9)
      + `<g class="fl4" ${delay(.2)}>${icons}</g>`
      + tag(ends[0] + 12, yc(0) + 8, '12명', C.orange, 's2', 1.7, 22, 'start')
      + `<g class="s3"><path d="M${bx} 25V275" stroke="${C.ink}" stroke-width="3"/>${[0, 5, 10].map((v) => text(bx + v * bu, 300, v, { size: 18, weight: 600 })).join('')}${text(614, 300, '(명)', { size: 18, weight: 600 })}</g>`
      + bars
      + `<g class="p4" ${delay(.8)}>${pill(510, 330, 150, '그림그래프')}</g>`;
    put('4-1/수학/6/그림그래프', svg(id, body, motion(id)));
  })();

  // 막대그래프: 직업별 학생 수만큼 막대를 세로로 → 막대 끝의 수, 가장 긴 막대 → 가로와 세로를 바꾸어 가로 막대 → 이름
  (function () {
    const id = 't41-m6-makdae', ax = 100, ay = 290, u = 15, cx = (i) => 170 + 100 * i;
    const F = vFrame({ ax, ay, x1: 620, top: 92, u, every: 1, labelEvery: 5, max: 13 });
    const vert = F.grid + F.axes + F.labels + JOB.map((n, i) => text(cx(i), 318, n, { size: 20 })).join('')
      + JV.map((v, i) => vBar(cx(i), ay, v * u, 56, 'gy1', .2 + i * .15)).join('')
      + JV.map((v, i) => tag(cx(i), ay - v * u - 10, v, C.blue, 'p2', .2 + i * .15, 22)).join('')
      + hiBox(cx(0) - 34, ay - 12 * u - 40, 68, 12 * u + 44, C.red, 'k2', 1.1);
    const hx = 130, hu = 35, ry = (i) => 66 + 52 * i;
    let hg = '';
    for (let v = 1; v <= 13; v++) hg += `M${hx + v * hu} 40V300`;
    const hor = `<path d="${hg}" stroke="${C.line}" stroke-width="1.5"/><path d="M${hx} 40V300H${hx + 13 * hu + 10}" stroke="${C.ink}" stroke-width="3" fill="none"/>`
      + [0, 5, 10].map((v) => text(hx + v * hu, 324, v, { size: 18, weight: 600 })).join('') + text(hx + 13 * hu + 34, 324, '(명)', { size: 18, weight: 600 })
      + JOB.map((n, i) => text(hx - 10, ry(i) + 7, n, { size: 20, anchor: 'end' })).join('')
      + `<g class="fl4" ${delay(.2)}>${JV.map((v, i) => `<rect class="gx3" ${delay(.5 + i * .15)} x="${hx}" y="${ry(i) - 15}" width="${v * hu}" height="30" fill="${C.sky}" stroke="${C.blue}" stroke-width="3"/>`).join('')}</g>`;
    const body = `<g class="h3">${vert}</g><g class="b3">${hor}</g>`
      + `<g class="p4" ${delay(.8)}>${pill(540, 30, 150, '막대그래프')}</g>`;
    put('4-1/수학/6/막대그래프', svg(id, body, motion(id)));
  })();

  // 표: 가로줄·세로줄로 칸을 나누어 직업과 학생 수 → 운동선수 12명, 합계 28명 → 표의 수를 막대로 → 이름
  (function () {
    const id = 't41-m6-pyo', cols = [110, 78, 78, 78, 78, 78, 80];
    const T = table(30, 26, cols, 44, [['직업', ...JOB, '합계'], ['학생 수(명)', ...JV.map(String), '28']], {
      size: 18, lineCls: 'draw d1', cellCls: (r, c) => `class="p1" ${delay(.6 + (r * 7 + c) * .06)}`
    });
    const ay = 322, u = 12;
    const body = `<g class="fl4" ${delay(.2)}>${T.body}</g>`
      + hiBox(T.xs[1] + 3, 73, 72, 38, C.red, 'k2', .2) + hiBox(T.xs[6] + 3, 73, 74, 38, C.red, 'k2', .9)
      + `<g class="s3"><path d="M${T.xs[1] - 10} ${ay}H${T.xs[6]}" stroke="${C.ink}" stroke-width="3"/>${[1, 2, 3, 4, 5].map((c) => `<path d="M${T.cx(c)} 116V${ay - JV[c - 1] * u - 30}" stroke="${C.line}" stroke-width="2" stroke-dasharray="5 5"/>`).join('')}</g>`
      + JV.map((v, i) => vBar(T.cx(i + 1), ay, v * u, 46, 'gy3', .3 + i * .15)).join('')
      + JV.map((v, i) => tag(T.cx(i + 1), ay - v * u - 8, v, C.blue, 's3', 1.1 + i * .1, 20)).join('')
      + `<g class="p4" ${delay(.8)}>${pill(T.cx(6), 290, 64, '표')}</g>`;
    put('4-1/수학/6/표', svg(id, body, motion(id)));
  })();

  // 자료: 좋아하는 멸종 위기 야생 동물을 붙임딱지로 모음 → 같은 동물끼리 줄 세워 셈 → 표에 정리하니 수가 보임, 표의 수가 반짝임
  (function () {
    const id = 't41-m6-jaryo', yc = (i) => 80 + 58 * i;
    const AN = [['수달', 6, C.orange, C.peach], ['반달가슴곰', 4, C.blue, C.sky], ['여우', 3, C.green, C.mint], ['산양', 2, C.purple, C.lilac]];
    let notes = '', n = 0;
    AN.forEach(([, v, st, fill], i) => {
      for (let j = 0; j < v; j++, n++) {
        const x = 145 + 40 * j, y = yc(i) - 17;
        const sx = 50 + ((n * 137) % 540), sy = 40 + ((n * 71 + i * 23) % 240), r = ((n * 47) % 50) - 25;
        notes += `<g class="nt" style="--dx:${f(sx - x)}px;--dy:${f(sy - y)}px;--r:${r}deg;transition-delay:${f(.2 + n * .05)}s"><g class="p1" ${delay(.1 + n * .1)}><rect x="${x}" y="${y}" width="34" height="34" rx="3" fill="${fill}" stroke="${st}" stroke-width="2.5"/></g></g>`;
      }
    });
    const T = table(410, 38, [114, 106], 42, [['동물', '학생 수(명)'], ...AN.map(([a, v]) => [a, String(v)]), ['합계', '15']], { size: 18 });
    const body = `<g class="s2">${AN.map(([a, , st], i) => text(130, yc(i) + 7, a, { size: 20, color: st, anchor: 'end' })).join('')}</g>`
      + notes
      + AN.map(([, v, st], i) => tag(145 + 40 * v + 6, yc(i) + 9, v, st, 'p2', 1.4 + i * .15, 26, 'start')).join('')
      + `<g class="s3">${T.body}</g>`
      + hiBox(T.xs[1] + 4, 38 + 42 + 4, 98, 42 * 5 - 8, C.red, 'k3', .7);
    put('4-1/수학/6/자료', svg(id, body, motion(id) + `
      .sc-${id} .nt { transform-box: fill-box; transform-origin: center; transform: translate(var(--dx), var(--dy)) rotate(var(--r)); transition: transform 1s ease-in-out; }
      .on2 .sc-${id} .nt { transform: translate(0px, 0px) rotate(0deg); }`));
  })();

  // 조사: 친구 10명에게 좋아하는 운동을 물음 → 운동마다 손 든 친구를 셈(축구 4, 수영 3, 줄넘기 3) → 표에 정리, 수가 반짝임
  (function () {
    const id = 't41-m6-josa';
    const OPT = [['축구', 220, C.orange, [0, 3, 5, 7]], ['수영', 350, C.blue, [1, 6, 9]], ['줄넘기', 480, C.green, [2, 4, 8]]];
    const fx = (k) => 140 + 80 * (k % 5), fy = (k) => (k < 5 ? 180 : 268);
    const face = (x, y) => `<circle cx="${x}" cy="${y}" r="22" fill="${C.peach}" stroke="${C.orange}" stroke-width="2.5"/><path d="M${x - 11} ${y - 4}a3.5 3.5 0 1 0 7 0a3.5 3.5 0 1 0 -7 0M${x + 4} ${y - 4}a3.5 3.5 0 1 0 7 0a3.5 3.5 0 1 0 -7 0M${x - 8} ${y + 8}Q${x} ${y + 14} ${x + 8} ${y + 8}" fill="${C.ink}" stroke="${C.ink}" stroke-width="2"/>`;
    const hand = (x, y, color) => `<path d="M${x + 18} ${y - 10}L${x + 32} ${y - 40}" stroke="${color}" stroke-width="6" stroke-linecap="round"/><circle cx="${x + 34}" cy="${y - 47}" r="8" fill="${color}"/>`;
    let crowd = '';
    for (let k = 0; k < 10; k++) crowd += face(fx(k), fy(k));
    OPT.forEach(([, , color, who], j) => who.forEach((k, m) => { crowd += `<g class="p2" ${delay(.35 + j * .6 + m * .06)}>${hand(fx(k), fy(k), color)}</g>`; }));
    const chips = OPT.map(([n, x, color]) => `<rect x="${x - 50}" y="44" width="100" height="40" rx="20" fill="white" stroke="${color}" stroke-width="3"/>${text(x, 72, n, { size: 21, color })}`).join('');
    const counts = OPT.map(([, x, color, who], j) => tag(x, 116, `${who.length}명`, color, 'p2', .7 + j * .6, 24)).join('');
    const T = table(55, 160, [130, 100, 100, 100, 100], 46, [['운동', '축구', '수영', '줄넘기', '합계'], ['학생 수(명)', '4', '3', '3', '10']], { size: 19 });
    const body = `<circle cx="72" cy="64" r="28" fill="${C.sky}" stroke="${C.blue}" stroke-width="3"/>${text(72, 76, '?', { size: 34, color: C.blue })}`
      + chips + OPT.map(([, x, color], j) => hiBox(x - 55, 39, 110, 50, color, 'k2', .2 + j * .6)).join('')
      + `<g class="h3">${crowd}${counts}</g>`
      + `<g class="s3" ${delay(.3)}>${T.body}</g>`
      + hiBox(T.xs[1] + 4, 210, T.xs[5] - T.xs[1] - 8, 38, C.red, 'k3', 1.1)
      + `<g class="p3" ${delay(1.6)}>${pill(540, 310, 80, '조사')}</g>`;
    put('4-1/수학/6/조사', svg(id, body, motion(id)));
  })();

  // 눈금: 세로에 같은 간격으로 줄 → 한 칸은 10명 → 수요일 막대는 5칸, 50명 → 줄이 반짝임
  (function () {
    const id = 't41-m6-nungeum', ax = 130, ay = 305, u = 2.5, cx = (i) => 210 + 90 * i, top = 92;
    const lines = [10, 20, 30, 40, 50, 60, 70, 80].map((v, k) => `<path class="draw d1" pathLength="1" ${delay(.1 + k * .12)} d="M${ax} ${ay - v * u}H612" stroke="${C.muted}" stroke-width="${v % 20 ? 1.2 : 2}" opacity=".7"/>`).join('');
    let labels = '';
    for (let v = 0; v <= 80; v += 20) labels += text(ax - 12, ay - v * u + 6, v, { size: 18, weight: 600, anchor: 'end' });
    const cells = [0, 1, 2, 3, 4].map((k) => `<path class="s3" ${delay(1 + k * .14)} d="M${cx(2) + 34} ${f(ay - k * 25 - 3)}V${f(ay - (k + 1) * 25 + 3)}" stroke="${C.green}" stroke-width="7"/>`).join('');
    const body = `<g class="fl4" ${delay(.2)}>${lines}</g><path d="M${ax} ${top}V${ay}H612" stroke="${C.ink}" stroke-width="3" fill="none"/>`
      + `<g class="s1" ${delay(1.1)}>${labels}${text(ax, top - 12, '(명)', { size: 18, weight: 600 })}</g>`
      + DAY.map((d, i) => text(cx(i), 332, d, { size: 20 })).join('')
      + `<g class="h3"><g class="s2"><rect x="${ax}" y="${ay - 25}" width="482" height="25" fill="${C.mint}" opacity=".8"/></g></g>`
      + `<g class="s2" ${delay(.3)}><path d="M${ax} ${ay}V${ay - 25}" stroke="${C.green}" stroke-width="8" stroke-linecap="round"/></g>`
      + `<g class="h3"><g class="s2" ${delay(.6)}>${text(ax + 14, ay - 6, '10명', { size: 20, color: C.green, anchor: 'start' })}</g></g>`
      + DV.map((v, i) => vBar(cx(i), ay, v * u, 50, 'gy3', .2 + i * .12)).join('')
      + cells + tag(cx(2), ay - 125 - 12, '50명', C.green, 's3', 1.7, 22)
      + `<g class="p4" ${delay(.9)}>${pill(560, 52, 90, '눈금')}</g>`;
    put('4-1/수학/6/눈금', svg(id, body, motion(id)));
  })();

  // 가로·세로: 직업별 학생 수 세로 막대그래프에서 한쪽 축을 강조
  function axisFig(id, key, mode) {
    const ax = 110, ay = 280, u = 15, cx = (i) => 180 + 95 * i, top = 92, x1 = 610;
    const F = vFrame({ ax, ay, x1, top, u, every: 1, labelEvery: 5, max: 13 });
    const names = JOB.map((n, i) => mode === 'garo' ? tag(cx(i), 308, n, C.blue, 'p2', .2 + i * .2, 20) : text(cx(i), 308, n, { size: 20 })).join('');
    const bars = JV.map((v, i) => vBar(cx(i), ay, v * u, 54, 'gy3', .2 + i * .15)).join('');
    let body;
    if (mode === 'garo') {
      body = `<g class="s3">${F.grid}${F.labels}<path d="M${ax} ${top}V${ay}" stroke="${C.ink}" stroke-width="3"/></g>`
        + `<path class="draw d1" pathLength="1" ${delay(.2, 'transition-duration:1.2s;')} d="M${ax} ${ay}H${x1}" stroke="${C.ink}" stroke-width="3"/>`
        + bars + `<g class="fl4" ${delay(.2)}>${names}</g>`
        + `<g class="fl4" ${delay(.2)}>${drawArrow(120, 340, 600, 340, C.green, 1, .3, 1.2)}</g>`
        + `<g class="s1" ${delay(1.5)}>${text(62, 347, '가로', { size: 24, color: C.green })}</g>`
        + `<g class="k3" ${delay(1.2)}><rect x="${ax + 8}" y="${ay + 4}" width="${x1 - ax - 8}" height="34" rx="8" fill="none" stroke="${C.blue}" stroke-width="3"/></g>`
        + `<g class="p4" ${delay(.8)}>${pill(520, 60, 80, '가로')}</g>`;
    } else {
      const ylab = [0, 5, 10].map((v, k) => tag(ax - 12, ay - v * u + 6, v, C.blue, 'p2', .3 + k * .25, 20, 'end')).join('');
      body = `<g class="s2" ${delay(.2)}>${F.grid}</g><path d="M${ax} ${ay}H${x1}" stroke="${C.ink}" stroke-width="3"/>`
        + `<path class="draw d1" pathLength="1" ${delay(.2, 'transition-duration:1.2s;')} d="M${ax} ${top}V${ay}" stroke="${C.ink}" stroke-width="3"/>`
        + names + bars
        + `<g class="fl4" ${delay(.2)}>${ylab}<g class="s2" ${delay(1)}>${text(ax, top - 12, '(명)', { size: 18, color: C.blue })}</g></g>`
        + `<g class="fl4" ${delay(.2)}>${drawArrow(38, 76, 38, 300, C.green, 1, .3, 1.2)}</g>`
        + `<g class="s1" ${delay(1.5)}>${text(38, 336, '세로', { size: 24, color: C.green })}</g>`
        + tag(cx(0), ay - 12 * u - 10, 12, C.blue, 's3', 1.2, 22)
        + `<path class="s3" ${delay(1.3)} d="M${ax} ${ay - 12 * u}H${cx(0) - 27}" stroke="${C.blue}" stroke-width="2.5" stroke-dasharray="6 5"/>`
        + `<g class="p4" ${delay(.8)}>${pill(520, 60, 80, '세로')}</g>`;
    }
    put(key, svg(id, body, motion(id)));
  }
  axisFig('t41-m6-garo', '4-1/수학/6/가로', 'garo');
  axisFig('t41-m6-sero', '4-1/수학/6/세로', 'sero');

  // 합계: 표의 합계 칸이 비어 있음 → 직업별 막대 토막이 이어 붙어 12 + 1 + 2 + 5 + 8 = 28 → 28이 합계 칸으로
  (function () {
    const id = 't41-m6-hapgye', cols = [110, 78, 78, 78, 78, 78, 80], su = 18, sy = 214, x0 = 68;
    const T = table(30, 30, cols, 44, [['직업', ...JOB, '합계'], ['학생 수(명)', ...JV.map(String), '']], { size: 18 });
    const fills = [[C.peach, C.orange], [C.sky, C.blue], [C.mint, C.green], [C.lilac, C.purple], ['#fdf0c4', C.orange]];
    let x = x0, segs = '';
    JV.forEach((v, i) => {
      const w = v * su, tx = T.cx(i + 1) - w / 2;
      segs += `<g class="mv2" style="--dx:${f(tx - x)}px;--dy:${150 - sy}px;transition-delay:${f(.3 + i * .25)}s"><rect x="${x}" y="${sy}" width="${w}" height="40" fill="${fills[i][0]}" stroke="${fills[i][1]}" stroke-width="2.5"/>${text(f(x + w / 2), sy - 10, v, { size: 20, color: fills[i][1] })}</g>`;
      x += w;
    });
    const sum = T.cx(6), sumY = T.cy(1) + 7, ex = 471, ey = 300;
    const body = T.body + hiBox(T.xs[6] + 4, 78, 72, 36, C.red, 'k1', .4)
      + `<g class="s1" ${delay(.8)}>${segs}</g>`
      + `<g class="s2" ${delay(1.7)}>${text(440, ey, '12 + 1 + 2 + 5 + 8 =', { size: 32, anchor: 'end' })}${text(ex, ey, '28', { size: 32, color: C.red })}</g>`
      + `<g class="s3"><g class="fly">${text(sum, sumY, '28', { size: 22, color: C.red })}</g></g>`
      + ring(sum, T.cy(1), 22, C.red, 'r3', 1.3)
      + `<g class="p3" ${delay(1.6)}>${pill(320, 340, 80, '합계', C.red, C.peach)}</g>`;
    // 28 은 식의 끝자리에서 합계 칸으로 날아간다
    put('4-1/수학/6/합계', svg(id, body, motion(id) + `
      .sc-${id} .fly { transform: translate(${f(ex - sum)}px, ${f(ey - sumY - 3)}px) scale(1.45); transform-box: fill-box; transform-origin: center; }
      .on3 .sc-${id} .fly { transform: translate(0px, 0px) scale(1); transition: transform 1s ease-in-out .3s; }`));
  })();

  // 해석: 요일별 학생 수 막대그래프 → 돋보기가 막대를 훑고 금요일 80명이 가장 많음 → 화요일 10명이 가장 적고 70명 차이 → 금요일에
  (function () {
    const id = 't41-m6-haeseok', ax = 110, ay = 300, u = 2.5, cx = (i) => 175 + 85 * i, top = 88;
    const F = vFrame({ ax, ay, x1: 600, top, u, every: 10, labelEvery: 20, max: 80 });
    const tops = DV.map((v, i) => [cx(i), ay - v * u - 36]), [ex, ey] = tops[4];
    const lens = `<circle cx="${ex}" cy="${ey}" r="20" fill="white" fill-opacity=".35" stroke="${C.ink}" stroke-width="5"/><path d="M${ex + 14} ${ey + 14}L${ex + 30} ${ey + 30}" stroke="${C.ink}" stroke-width="7" stroke-linecap="round"/>`;
    const path = tops.map(([x, y], i) => `${f(100 * i / 5)}% { transform: translate(${f(x - ex)}px, ${f(y - ey)}px); opacity: 1; }`).join(' ');
    const y10 = ay - 10 * u, y80 = ay - 80 * u;
    const body = F.grid + F.axes + F.labels + DAY.map((d, i) => text(cx(i), 326, d, { size: 21 })).join('')
      + DV.map((v, i) => vBar(cx(i), ay, v * u, 50, 'gy1', .2 + i * .12)).join('')
      + `<g class="b2 h3"><g class="lens">${lens}</g></g>`
      + hiBox(cx(4) - 31, y80 - 6, 62, 80 * u + 8, C.red, 'k2', 1.7) + tag(cx(4), y80 - 12, '80명', C.red, 's2', 1.8, 22)
      + hiBox(cx(1) - 31, y10 - 6, 62, 10 * u + 8, C.blue, 'k3', .2) + tag(cx(1), y10 - 12, '10명', C.blue, 's3', .4, 22)
      + `<path class="s3" ${delay(.8)} d="M${cx(1) + 31} ${y10}H${cx(4) + 40}" stroke="${C.blue}" stroke-width="2.5" stroke-dasharray="6 5"/>`
      + drawArrow(565, y10 - 4, 565, y80 + 10, C.orange, 3, 1, .7, 4) + `<path class="s3" ${delay(1)} d="M557 ${y10 - 14}L565 ${y10 - 4}L573 ${y10 - 14}" stroke="${C.orange}" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`
      + tag(578, (y10 + y80) / 2 + 8, '70명', C.orange, 's3', 1.6, 22, 'start')
      + ring(cx(4), 319, 18, C.red, 'r4', .2)
      + `<g class="k4" ${delay(.2)}><circle cx="${cx(4)}" cy="319" r="18" fill="none" stroke="${C.red}" stroke-width="3.5"/></g>`
      + `<g class="p4" ${delay(.9)}>${pill(320, 50, 90, '해석')}</g>`;
    put('4-1/수학/6/해석', svg(id, body, motion(id) + `
      .sc-${id} .lens { opacity: 0; }
      .on2 .sc-${id} .lens { animation: ${id}-scan 2s ease-in-out .2s both; }
      @keyframes ${id}-scan { ${path} 85% { transform: translate(0px, 0px); opacity: 1; } 100% { transform: translate(0px, 0px); opacity: 0; } }`));
  })();
})(typeof window !== 'undefined' ? window : globalThis);
