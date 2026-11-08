// 수학 3-2 6단원 그림그래프: 낱말 도식
// 그림그래프는 큰 그림 = 10, 작은 그림 = 1. 큰 그림이 먼저 쌓이고 작은 그림이 뒤따라, 한 줄의 그림 수가 표의 수와 같아진다.
(function (root) {
  'use strict';
  const { C, svg, text, arrow, put } = root.FigureKit;
  const f = (n) => +(+n).toFixed(1);
  const delay = (s, more = '') => `style="animation-delay:${s}s;transition-delay:${s}s;${more}"`;

  // 같이 쓰는 움직임. sN 나타나기, pN 튀어나오기, dN 선 그리기(pathLength="1"), rN 퍼지는 고리, kN 깜빡이며 남기,
  // fN 날아오기(--dx,--dy 만큼 떨어진 곳에서 제자리로), mN 옮겨 가 머물기(--mx,--my), gN 그 칸에서 사라지기
  const motion = (id) => {
    let css = `
    .sc-${id} :is(.s1,.s2,.s3,.s4,.p1,.p2,.p3,.p4,.k1,.k2,.k3,.k4,.f1,.f2,.f3,.f4) { opacity: 0; }
    .sc-${id} :is(.p1,.p2,.p3,.p4,.ring) { transform-box: fill-box; transform-origin: center; }
    .sc-${id} .draw { stroke-dasharray: 1; stroke-dashoffset: 1; transition: stroke-dashoffset .5s ease-in-out; }
    .sc-${id} :is(.m2,.m3,.m4) { transition: transform .8s ease-in-out; }
    .sc-${id} :is(.g2,.g3,.g4) { transition: opacity .2s linear; }
    .sc-${id} .ring { opacity: 0; }
    @keyframes ${id}-fin { from { opacity: 0; } to { opacity: 1; } }
    @keyframes ${id}-pop { 0% { opacity: 0; transform: scale(0); } 70% { opacity: 1; transform: scale(1.2); } 100% { opacity: 1; transform: scale(1); } }
    @keyframes ${id}-ring { 0% { opacity: .9; transform: scale(1); } 100% { opacity: 0; transform: scale(2.4); } }
    @keyframes ${id}-blink { 0% { opacity: 0; } 20% { opacity: 1; } 40% { opacity: .15; } 60% { opacity: 1; } 80% { opacity: .15; } 100% { opacity: 1; } }
    @keyframes ${id}-fly { from { opacity: 1; transform: translate(var(--dx), var(--dy)); } to { opacity: 1; transform: none; } }`;
    for (let n = 1; n <= 4; n++) css += `
    .on${n} .sc-${id} .s${n} { animation: ${id}-fin .4s ease-out both; }
    .on${n} .sc-${id} .p${n} { animation: ${id}-pop .5s ease-out both; }
    .on${n} .sc-${id} .d${n} { stroke-dashoffset: 0; }
    .on${n} .sc-${id} .r${n} { animation: ${id}-ring 1.1s ease-out 2 both; }
    .on${n} .sc-${id} .k${n} { animation: ${id}-blink 1.6s ease-in-out both; }
    .on${n} .sc-${id} .f${n} { animation: ${id}-fly .7s ease-in-out both; }
    .on${n} .sc-${id} .m${n} { transform: translate(var(--mx, 0px), var(--my, 0px)); }
    .on${n} .sc-${id} .g${n} { opacity: 0; }`;
    return css;
  };
  const T = (x, y, s, o = {}) => text(f(x), f(y), s, o);
  const ring = (x, y, r, color, cls, d = 0) => `<circle class="ring ${cls}" ${delay(d)} cx="${f(x)}" cy="${f(y)}" r="${r}" fill="none" stroke="${color}" stroke-width="4"/>`;
  const label = (x, y, s, color, cls, d = 0, size = 28) => `<g class="${cls}" ${delay(d)}>${T(x, y, s, { size, color })}</g>`;
  // 표: cols 는 칸 너비 목록, rows 는 줄마다 글자 목록. 첫 줄과 첫 칸은 옅은 바탕
  function table(x, y, cols, rh, rows, { size = 21, cls = '', cellAttr = () => '' } = {}) {
    const W = cols.reduce((a, b) => a + b, 0), H = rh * rows.length;
    const xs = cols.reduce((a, w) => [...a, a[a.length - 1] + w], [x]);
    let s = `<rect x="${x}" y="${y}" width="${W}" height="${H}" fill="white"/><rect x="${x}" y="${y}" width="${W}" height="${rh}" fill="${C.mint}"/><rect x="${x}" y="${y}" width="${cols[0]}" height="${H}" fill="${C.mint}"/>`;
    rows.forEach((row, r) => row.forEach((cell, c) => {
      if (cell === '') return;
      s += `<g ${cellAttr(r, c)}>${T((xs[c] + xs[c + 1]) / 2, y + r * rh + rh / 2 + size * .36, cell, { size, weight: r && c ? 700 : 600 })}</g>`;
    }));
    let lines = '';
    for (let r = 1; r < rows.length; r++) lines += `M${x} ${y + r * rh} H${x + W} `;
    for (let c = 1; c < cols.length; c++) lines += `M${xs[c]} ${y} V${y + H} `;
    s += `<path class="${cls}" ${cls.includes('draw') ? 'pathLength="1"' : ''} d="${lines}" stroke="${C.muted}" stroke-width="2"/><rect x="${x}" y="${y}" width="${W}" height="${H}" fill="none" stroke="${C.ink}" stroke-width="3"/>`;
    return { body: s, xs, cx: (c) => (xs[c] + xs[c + 1]) / 2, cy: (r) => y + r * rh + rh / 2, W, H };
  }
  const face = (x, y, c = C.peach) => `<circle cx="${x}" cy="${y}" r="22" fill="${c}" stroke="${C.orange}" stroke-width="2.5"/><circle cx="${x - 8}" cy="${y - 4}" r="3" fill="${C.ink}"/><circle cx="${x + 8}" cy="${y - 4}" r="3" fill="${C.ink}"/><path d="M${x - 8} ${y + 7} Q${x} ${y + 14} ${x + 8} ${y + 7}" stroke="${C.ink}" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;
  const apple = (x, y, r) => `<circle cx="${f(x - r * .35)}" cy="${y}" r="${r}" fill="${C.red}"/><circle cx="${f(x + r * .35)}" cy="${y}" r="${r}" fill="${C.red}"/><path d="M${x} ${f(y - r * .8)} q${f(r * .1)} ${f(-r * .5)} ${f(r * .4)} ${f(-r * .7)}" stroke="${C.ink}" stroke-width="${r > 15 ? 3 : 2}" fill="none" stroke-linecap="round"/><path d="M${f(x + r * .15)} ${f(y - r * 1.05)} q${f(r * .6)} ${f(-r * .45)} ${f(r * .95)} 0 q${f(-r * .5)} ${f(r * .4)} ${f(-r * .95)} 0 Z" fill="${C.green}"/>`;
  const book = (x, y, s, color) => `<rect x="${f(x - s / 2)}" y="${f(y - s * .62)}" width="${s}" height="${f(s * 1.24)}" rx="${f(s * .12)}" fill="${color}" stroke="${C.ink}" stroke-width="${s > 24 ? 2.5 : 1.8}"/><path d="M${f(x - s / 2 + s * .2)} ${f(y - s * .62)} V${f(y + s * .62)}" stroke="white" stroke-width="${s > 24 ? 2.5 : 1.5}"/>`;

  // 조사: 친구 8명에게 좋아하는 과일을 묻고 → 붙임딱지를 과일 칸에 붙임 → 과일마다 몇 명인지
  (function () {
    const id = 't32-m6-josa';
    const fruits = [['사과', C.red], ['바나나', C.yellow], ['포도', C.purple], ['귤', C.orange]];
    const cx = (k) => 110 + k * 140;
    const picks = [0, 1, 0, 2, 3, 0, 2, 1];
    const fx = (i) => 62 + i * 74;
    const cards = fruits.map(([name, c], k) => `<rect x="${cx(k) - 60}" y="30" width="120" height="124" rx="12" fill="white" stroke="${C.line}" stroke-width="3"/>`
      + `<circle cx="${cx(k)}" cy="62" r="16" fill="${c}"/>` + T(cx(k), 102, name, { size: 22 })).join('');
    const used = [0, 0, 0, 0];
    let stickers = '';
    picks.forEach((k, i) => {
      const slot = used[k]++;
      const to = [cx(k) - 36 + slot * 24, 134], from = [fx(i), 300];
      stickers += `<g class="f2" ${delay(.2 + i * .2, `--dx:${f(from[0] - to[0])}px;--dy:${f(from[1] - to[1])}px`)}><circle cx="${to[0]}" cy="${to[1]}" r="10" fill="${fruits[k][1]}" stroke="${C.ink}" stroke-width="2"/></g>`;
    });
    const faces = Array.from({ length: 8 }, (_, i) => `<g class="p1" ${delay(.2 + i * .1)}>${face(fx(i), 300)}</g>`).join('');
    const body = cards + faces
      + `<g class="s1" ${delay(1.1)}><rect x="200" y="206" width="240" height="50" rx="25" fill="${C.sky}" stroke="${C.blue}" stroke-width="3"/>${T(320, 239, '좋아하는 과일?', { size: 24, color: C.blue })}</g>`
      + stickers
      + used.map((n, k) => `<g class="p3" ${delay(.2 + k * .2)}>${T(cx(k), 186, `${n}명`, { size: 24, color: C.orange })}</g>`).join('')
      + `<g class="k3" ${delay(1.1)}><rect x="200" y="206" width="240" height="50" rx="25" fill="none" stroke="${C.green}" stroke-width="5"/></g>`
      + label(560, 242, '조사', C.green, 'p3', 1.2, 30);
    put('3-2/수학/6/조사', svg(id, body, motion(id)));
  })();

  // 자료: 친구들의 대답 카드가 하나씩 모임 → 종류별로 나란히 → 세어 4, 3, 2 → 모은 것이 자료
  (function () {
    const id = 't32-m6-jaryo';
    const kinds = ['달리기', '수영', '줄넘기'], colors = [C.orange, C.blue, C.purple];
    const answers = [0, 1, 0, 2, 1, 0, 2, 1, 0];
    const scatter = [[100, 70], [230, 58], [360, 76], [130, 136], [270, 128], [400, 146], [86, 206], [222, 214], [352, 200]];
    const colX = (k) => 110 + k * 150;
    const used = [0, 0, 0];
    const cards = answers.map((k, i) => {
      const [sx, sy] = scatter[i], slot = used[k]++;
      const tx = colX(k), ty = 66 + slot * 46;
      const card = `<rect x="${sx - 52}" y="${sy - 20}" width="104" height="40" rx="8" fill="white" stroke="${colors[k]}" stroke-width="3"/>${T(sx, sy + 7, kinds[k], { size: 20, color: colors[k] })}`;
      return `<g class="m2" ${delay(.2 + i * .1, `--mx:${tx - sx}px;--my:${ty - sy}px`)}><g class="f1" ${delay(.2 + i * .18, `--dx:${f(560 - sx)}px;--dy:${f(-40 - sy)}px`)}>${card}</g></g>`;
    }).join('');
    const body = cards
      + used.map((n, k) => `<g class="p3" ${delay(.2 + k * .2)}>${T(colX(k), 270, `${n}명`, { size: 26, color: colors[k] })}</g>`).join('')
      + `<g class="s3" ${delay(.9)}><path d="M478 40 q14 0 14 14 v86 q0 14 12 14 q-12 0 -12 14 v86 q0 14 -14 14" stroke="${C.green}" stroke-width="4" fill="none" stroke-linecap="round"/></g>`
      + label(560, 164, '자료', C.green, 'p3', 1.2, 32);
    put('3-2/수학/6/자료', svg(id, body, motion(id)));
  })();

  // 표: 칸을 나누는 선이 그려짐 → 계절별 학생 수가 칸마다 → 가로줄·세로줄이 차례로 반짝
  (function () {
    const id = 't32-m6-pyo';
    const vals = [6, 4, 5, 3];
    const tb = table(40, 110, [160, 100, 100, 100, 100], 70, [['계절', '봄', '여름', '가을', '겨울'], ['학생 수(명)', ...vals]], {
      cls: 'draw d1', cellAttr: (r, c) => r && c ? `class="p2" ${delay(.2 + (c - 1) * .3)}` : `class="s1" ${delay(.6)}`
    });
    const body = tb.body
      + `<g class="k3" ${delay(.2)}><rect x="40" y="110" width="${tb.W}" height="70" fill="none" stroke="${C.orange}" stroke-width="6"/></g>`
      + `<g class="k3" ${delay(1.2)}><rect x="${tb.xs[1]}" y="110" width="100" height="140" fill="none" stroke="${C.blue}" stroke-width="6"/></g>`
      + `<g class="s3" ${delay(.4)}>${T(320, 80, '가로줄', { size: 22, color: C.orange })}</g>`
      + `<g class="s3" ${delay(1.4)}>${T(tb.cx(1), 290, '세로줄', { size: 22, color: C.blue })}</g>`
      + label(480, 300, '표', C.green, 'p3', 1.8, 34);
    put('3-2/수학/6/표', svg(id, body, motion(id)));
  })();

  // 합계: 음식별 학생 수 15, 26, 12, 7 → 수가 합계 칸으로 하나씩 모여 → 60
  (function () {
    const id = 't32-m6-hapgye';
    const vals = [15, 26, 12, 7];
    const tb = table(20, 100, [110, 98, 98, 98, 98, 98], 64, [['음식', '잡채', '비빔밥', '불고기', '김치찌개', '합계'], ['학생 수', ...vals, '']], { size: 20 });
    const sumX = tb.cx(5), sumY = tb.cy(1);
    const flies = vals.map((v, k) => `<g class="f2" ${delay(.2 + k * .35, `--dx:${f(tb.cx(k + 1) - 120 - k * 70)}px;--dy:${f(sumY - 268)}px`)}>${T(120 + k * 70, 276, v, { size: 28, color: C.orange })}</g>`
      + (k ? `<g class="s2" ${delay(.3 + k * .35)}>${T(85 + k * 70, 276, '+', { size: 28 })}</g>` : '')).join('');
    const body = tb.body
      + `<g class="h3"><g class="s1" ${delay(.6)}>${T(sumX, sumY + 10, '?', { size: 28, color: C.muted })}</g></g>`
      + `<g class="k2" ${delay(.1)}><rect x="${tb.xs[1]}" y="${100 + 64}" width="${98 * 4}" height="64" fill="none" stroke="${C.orange}" stroke-width="5"/></g>`
      + flies
      + `<g class="s3" ${delay(.2)}>${T(364, 276, '= 60', { size: 28, color: C.green, anchor: 'start' })}</g>`
      + `<g class="p3" ${delay(.6)}>${T(sumX, sumY + 10, 60, { size: 28, color: C.green })}</g>`
      + ring(sumX, sumY, 28, C.green, 'r3', .9)
      + `<g class="s3" ${delay(1.1)}>${arrow(sumX, 300, sumX, sumY + 36, C.green)}${T(sumX, 330, '합계', { size: 28, color: C.green })}</g>`;
    put('3-2/수학/6/합계', svg(id, body, motion(id)));
  })();

  // 그래프: 계절별 학생 수 표 → 한 명에 ○ 하나씩 쌓임 → 가장 높은 줄(봄)이 한눈에
  (function () {
    const id = 't32-m6-graph';
    const names = ['봄', '여름', '가을', '겨울'], vals = [6, 4, 5, 3];
    const tb = table(20, 60, [96, 72], 46, [['계절', '수'], ...names.map((n, k) => [n, vals[k]])], { size: 20 });
    const gx = (k) => 300 + k * 86, cell = 36, base = 290;
    let grid = '';
    for (let k = 0; k < 4; k++) for (let r = 0; r < 6; r++) grid += `<rect x="${gx(k) - 30}" y="${base - (r + 1) * cell}" width="60" height="${cell}" fill="white" stroke="${C.line}" stroke-width="1.5"/>`;
    let marks = '', t = .2;
    vals.forEach((v, k) => { for (let r = 0; r < v; r++) { marks += `<circle class="p2" ${delay(f(t))} cx="${gx(k)}" cy="${base - (r + .5) * cell}" r="13" fill="none" stroke="${C.blue}" stroke-width="4"/>`; t += .08; } t += .1; });
    const body = tb.body
      + `<g class="s1" ${delay(.3)}>${grid}<path d="M250 ${base} H630" stroke="${C.ink}" stroke-width="3"/>${names.map((n, k) => T(gx(k), base + 32, n, { size: 22 })).join('')}</g>`
      + `<g class="s1" ${delay(.8)}>${arrow(204, 170, 246, 170, C.muted)}</g>`
      + marks
      + `<g class="k3" ${delay(.2)}><rect x="${gx(0) - 32}" y="${base - 6 * cell - 2}" width="64" height="${6 * cell + 4}" fill="none" stroke="${C.orange}" stroke-width="5" rx="6"/></g>`
      + `<g class="s3" ${delay(.6)}>${T(gx(0), 52, '가장 많다', { size: 20, color: C.orange })}</g>`
      + label(130, 338, '그래프', C.green, 'p3', 1.2, 30);
    put('3-2/수학/6/그래프', svg(id, body, motion(id)));
  })();

  // 그림그래프: 마을별 과수원 수 32, 15, 23 → 큰 사과(10) → 작은 사과(1) → 그림 수가 표의 수와 같다
  (function () {
    const id = 't32-m6-grimgraph';
    const names = ['가', '나', '다'], vals = [32, 15, 23];
    const tb = table(20, 70, [70, 80], 60, [['마을', '수'], ...names.map((n, k) => [n, vals[k]])], { size: 22 });
    const gy = (k) => 100 + k * 80, gx0 = 200, big = 22, small = 11;
    const frame = `<rect x="${gx0}" y="60" width="420" height="240" fill="white" stroke="${C.ink}" stroke-width="3"/>`
      + `<path d="M${gx0 + 60} 60 V300 M${gx0} 140 H620 M${gx0} 220 H620" stroke="${C.muted}" stroke-width="2"/>`
      + names.map((n, k) => T(gx0 + 30, gy(k) + 8, n, { size: 24 })).join('');
    let bigs = '', smalls = '', t2 = .3, t3 = .2;
    vals.forEach((v, k) => {
      const nb = Math.floor(v / 10), ns = v % 10;
      for (let i = 0; i < nb; i++) { bigs += `<g class="p2" ${delay(f(t2))}>${apple(gx0 + 100 + i * 64, gy(k) + 2, big)}</g>`; t2 += .25; }
      for (let i = 0; i < ns; i++) { smalls += `<g class="p3" ${delay(f(t3))}>${apple(gx0 + 88 + nb * 64 + i * 32, gy(k) + 10, small)}</g>`; t3 += .1; }
      t2 += .1; t3 += .15;
    });
    const legend = `${apple(250, 334, big)}${T(288, 342, '10개', { size: 22, anchor: 'start' })}${apple(400, 340, small)}${T(422, 342, '1개', { size: 22, anchor: 'start' })}`;
    const checks = vals.map((v, k) => `<g class="p4" ${delay(.3 + k * .4)}><rect x="566" y="${gy(k) - 20}" width="48" height="36" rx="8" fill="${C.mint}"/>${T(590, gy(k) + 7, v, { size: 22, color: C.green })}</g>`
      + `<g class="k4" ${delay(.3 + k * .4)}><rect x="${tb.xs[1] + 3}" y="${tb.cy(k + 1) - 27}" width="74" height="54" fill="none" stroke="${C.green}" stroke-width="4"/></g>`).join('');
    const body = tb.body + frame
      + `<g class="s1" ${delay(.6)}>${legend}</g>`
      + ring(250, 334, 26, C.red, 'r2', .1) + ring(400, 340, 16, C.red, 'r3', .1)
      + bigs + smalls + checks;
    put('3-2/수학/6/그림그래프', svg(id, body, motion(id)));
  })();

  // 해석: 다 그린 그림그래프 → 가장 긴 줄(동화책) → 가장 짧은 줄(위인전) → 알아낸 사실
  (function () {
    const id = 't32-m6-haeseok';
    const names = ['동화책', '과학책', '위인전', '만화책'], vals = [34, 21, 12, 25];
    const gy = (k) => 64 + k * 62, x0 = 30, nameW = 110, big = 30, small = 16;
    let pics = '';
    vals.forEach((v, k) => {
      const nb = Math.floor(v / 10), ns = v % 10;
      for (let i = 0; i < nb; i++) pics += book(x0 + nameW + 36 + i * 44, gy(k), big, C.sky);
      for (let i = 0; i < ns; i++) pics += book(x0 + nameW + 36 + nb * 44 + i * 24, gy(k) + 6, small, C.sky);
    });
    const frame = `<rect x="${x0}" y="32" width="470" height="248" fill="white" stroke="${C.ink}" stroke-width="3"/>`
      + `<path d="M${x0 + nameW} 32 V280 ${[1, 2, 3].map((k) => `M${x0} ${32 + k * 62} H${x0 + 470}`).join(' ')}" stroke="${C.muted}" stroke-width="2"/>`;
    const nameText = names.map((n, k) => T(x0 + nameW / 2, gy(k) + 8, n, { size: 22 })).join('');
    const legend = `${book(160, 320, big, C.sky)}${T(186, 330, '10권', { size: 22, anchor: 'start' })}${book(290, 326, small, C.sky)}${T(306, 330, '1권', { size: 22, anchor: 'start' })}`;
    const hi = (k, color, cls, d) => `<g class="${cls}" ${delay(d)}><rect x="${x0 + 3}" y="${32 + k * 62 + 3}" width="464" height="56" fill="${color}" opacity=".45"/></g>`;
    const body = `<g class="s1" ${delay(.2)}>${frame}</g>`
      + hi(0, C.peach, 's2', 1.3) + hi(2, C.sky, 's3', .3)
      + `<g class="s1" ${delay(.4)}>${nameText}${pics}${legend}</g>`
      + `<g class="s2"><g class="scan"><rect x="${x0}" y="32" width="470" height="62" fill="none" stroke="${C.orange}" stroke-width="5"/></g></g>`
      + `<g class="p2" ${delay(1.5)}>${T(570, gy(0) + 8, '가장 많다', { size: 24, color: C.orange })}</g>`
      + `<g class="p3" ${delay(.5)}>${T(570, gy(2) + 8, '가장 적다', { size: 24, color: C.blue })}</g>`
      + `<g class="s3" ${delay(1)}>${arrow(570, 264, 570, 224, C.green)}${T(570, 300, '해석', { size: 30, color: C.green })}</g>`;
    put('3-2/수학/6/해석', svg(id, body, motion(id) + `
      .on2 .sc-${id} .scan { animation: ${id}-scan 1.3s ease-in-out .1s both; }
      @keyframes ${id}-scan { 0% { transform: translateY(0); } 25% { transform: translateY(62px); } 50% { transform: translateY(124px); } 75% { transform: translateY(186px); } 100% { transform: translateY(0); } }
      .on3 .sc-${id} .scan { opacity: 0; transition: opacity .3s; }
    `));
  })();
})(typeof window !== 'undefined' ? window : globalThis);
