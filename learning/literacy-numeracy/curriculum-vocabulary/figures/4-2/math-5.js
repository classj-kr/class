// 수학 4-2 5단원 꺾은선그래프: 낱말 도식
// 그래프는 세로축 x = AX, 가로축 y = AY. 값 v 의 높이는 그림마다 yOf(v) 로 정한다.
// 물결선의 꺾은선은 모양 바꾸기(math-4.js 와 같은 방법: 짧은 선 하나를 matrix 로 늘이고 돌림, 18 걸음 열쇠틀)로 늘어난다.
(function (root) {
  'use strict';
  const { C, svg, text, put } = root.FigureKit;
  const f = (n) => +(+n).toFixed(2);
  const P = (p) => `${f(p[0])} ${f(p[1])}`;
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1]];
  const seg = (p, q, { color = C.ink, w = 4, cls = '', extra = '' } = {}) =>
    `<path class="${cls}" d="M${P(p)} L${P(q)}" stroke="${color}" stroke-width="${w}" stroke-linecap="round" fill="none" ${extra}/>`;
  const drawSeg = (p, q, o = {}) => seg(p, q, { ...o, extra: `pathLength="100" ${o.extra || ''}` });
  const dot = (p, { r = 8, color = C.orange, cls = '' } = {}) => `<circle class="${cls}" cx="${f(p[0])}" cy="${f(p[1])}" r="${r}" fill="${color}" stroke="white" stroke-width="2"/>`;
  const drawCss = (id, n, cls, delay = 0, dur = .8) =>
    `.sc-${id} .${cls}{stroke-dasharray:100;stroke-dashoffset:100}.on${n} .sc-${id} .${cls}{stroke-dashoffset:0;transition:stroke-dashoffset ${dur}s ease ${delay}s}`;
  const popCss = (id, n, cls, delay = 0) =>
    `.sc-${id} .${cls}{transform-box:fill-box;transform-origin:center;transform:scale(0)}.on${n} .sc-${id} .${cls}{transform:none;transition:transform .45s cubic-bezier(.3,1.6,.6,1) ${delay}s}`;
  const fadeCss = (id, n, cls, delay = 0, dur = .4) =>
    `.sc-${id} .${cls}{opacity:0}.on${n} .sc-${id} .${cls}{opacity:1;transition:opacity ${dur}s ease ${delay}s}`;
  const growCss = (id, n, cls) =>
    `.sc-${id} .${cls}{transform-box:fill-box;transform-origin:center bottom;transform:scaleY(0)}.on${n} .sc-${id} .${cls}{transform:none;transition:transform .7s ease-out var(--d,0s)}`;
  const flash = (id) => `@keyframes ${id}-fl{0%,50%,100%{opacity:1}25%,75%{opacity:.25}}`;
  const AX = 110, AY = 300;
  // 눈금선(옅은 가로줄)과 세로축 수
  const gridLines = (vals, yOf, x1, every) => vals.map((v) => `<path d="M${AX} ${f(yOf(v))} H${x1}" stroke="${C.line}" stroke-width="${v % every === 0 ? 2 : 1.2}"/>`).join('');
  const yLabels = (vals, yOf) => vals.map((v) => text(AX - 12, f(yOf(v) + 6), v, { size: 18, weight: 600, anchor: 'end' })).join('');
  const axes = (x1, top = 70) => seg([AX, top], [AX, AY], { w: 3 }) + seg([AX, AY], [x1, AY], { w: 3 });
  const range = (a, b, s = 1) => { const r = []; for (let v = a; v <= b + 1e-9; v += s) r.push(+v.toFixed(3)); return r; };

  // 모양 바꾸기(열린 꺾은선)
  const STEPS = 18;
  const ease = (t) => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const lerp = (A, B, t) => A.map((p, i) => [p[0] + (B[i][0] - p[0]) * t, p[1] + (B[i][1] - p[1]) * t]);
  const segM = (p, q) => { const d = sub(q, p); return `matrix(${f(d[0])},${f(d[1])},${f(-d[1])},${f(d[0])},${f(p[0])},${f(p[1])})`; };
  function morphLine(id, name, states, beats, { stroke = C.orange, width = 5, dur = 1.2, delay = .3 } = {}) {
    let body = '', css = '';
    for (let j = 0; j < states[0].length - 1; j++) {
      const cls = `${name}s${j}`, m = (q) => segM(q[j], q[j + 1]);
      body += `<path class="${cls}" d="M0 0H1" stroke="${stroke}" stroke-width="${width}" stroke-linecap="round" vector-effect="non-scaling-stroke" fill="none" style="transform:${m(states[0])}"/>`;
      beats.forEach((b, i) => {
        const kf = Array.from({ length: STEPS + 1 }, (_, s) => `${f(100 * s / STEPS)}%{transform:${m(lerp(states[i], states[i + 1], ease(s / STEPS)))}}`).join('');
        css += `@keyframes ${id}-${cls}-${i}{${kf}}.on${b} .sc-${id} .${cls}{animation:${id}-${cls}-${i} ${dur}s linear ${delay}s both}`;
      });
    }
    return { body, css };
  }

  // 막대그래프: 눈금 그리기 → 동물별 학생 수만큼 막대가 자람 → 막대 위 수, 가장 긴 막대 옆 길이 화살표
  {
    const id = 't42-m5-makdae';
    const yOf = (v) => AY - 20 * v;
    const names = ['개', '고양이', '토끼', '햄스터'], vals = [8, 6, 4, 3];
    const cx = (i) => 171 + 122 * i;
    const bars = vals.map((v, i) => `<g class="bar" style="--d:${f(.2 + .25 * i)}s"><rect x="${cx(i) - 32}" y="${yOf(v)}" width="64" height="${20 * v}" fill="${C.sky}" stroke="${C.blue}" stroke-width="3"/></g>`).join('');
    const tops = vals.map((v, i) => `<g class="tp tp${i}">${text(cx(i), yOf(v) - 12, v, { size: 22, color: C.blue })}</g>`).join('');
    const len = `<path d="M${cx(0) + 50} ${AY - 4} V${yOf(8) + 4} M${cx(0) + 42} ${yOf(8) + 14} L${cx(0) + 50} ${yOf(8) + 4} L${cx(0) + 58} ${yOf(8) + 14} M${cx(0) + 42} ${AY - 14} L${cx(0) + 50} ${AY - 4} L${cx(0) + 58} ${AY - 14}" stroke="${C.orange}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`;
    const body = `<g class="b1"><g class="gl">${gridLines(range(1, 10), yOf, 600, 2)}</g>${drawSeg([AX, AY], [AX, 70], { w: 3, cls: 'ax1' })}${drawSeg([AX, AY], [600, AY], { w: 3, cls: 'ax2' })}`
      + `<g class="yl">${yLabels(range(0, 10, 2), yOf)}${text(AX, 54, '(명)', { size: 18, weight: 600 })}</g>`
      + `<g class="nm">${names.map((n, i) => text(cx(i), 330, n, { size: 20 })).join('')}</g></g>`
      + `<g class="b2">${bars}</g>`
      + `<g class="b3">${tops}<g class="len">${len}</g></g>`;
    put('4-2/수학/5/막대그래프', svg(id, body, `
      ${drawCss(id, 1, 'ax1', .1, .6)}${drawCss(id, 1, 'ax2', .1, .6)}${fadeCss(id, 1, 'gl', .5)}${fadeCss(id, 1, 'yl', .8)}${fadeCss(id, 1, 'nm', 1.1)}
      ${growCss(id, 2, 'bar')}
      ${vals.map((_, i) => popCss(id, 3, `tp${i}`, .2 + .15 * i)).join('')}
      ${fadeCss(id, 3, 'len', .9)}
    `));
  }

  // 꺾은선그래프: 강낭콩 줄기 길이 막대 → 막대 끝에 점, 막대 지움 → 점을 선분으로 잇고 빛 점이 따라감 → 선과 점이 반짝임
  {
    const id = 't42-m5-kkeokkeun';
    const yOf = (v) => AY - 14 * v;
    const days = ['월', '화', '수', '목', '금'], vals = [2, 3, 5, 8, 12];
    const pts = vals.map((v, i) => [170 + 100 * i, yOf(v)]);
    const bars = pts.map(([x, y], i) => `<g class="bar" style="--d:${f(.2 + .2 * i)}s"><rect x="${x - 20}" y="${f(y)}" width="40" height="${f(AY - y)}" fill="${C.sky}" stroke="${C.blue}" stroke-width="3"/></g>`).join('');
    const dots = pts.map((p, i) => `<g class="dt dt${i}">${dot(p)}</g>`).join('');
    const segs = pts.slice(1).map((p, i) => `<g class="b3">${drawSeg(pts[i], p, { w: 5, color: C.orange, cls: `sg sg${i}` })}</g>`).join('');
    const rel = pts.map((p) => sub(p, pts[0]));
    const travel = rel.map((r, i) => `${f(100 * i / (rel.length - 1))}%{transform:translate(${f(r[0])}px,${f(r[1])}px)}`).join('');
    const body = gridLines(range(1, 15), yOf, 590, 5) + axes(590) + yLabels(range(0, 15, 5), yOf) + text(AX, 54, '(cm)', { size: 18, weight: 600 })
      + days.map((d, i) => text(170 + 100 * i, 330, d, { size: 20 })).join('') + text(614, 306, '(요일)', { size: 18, weight: 600 })
      + `<g class="b1 h3"><g class="bars">${bars}</g></g>`
      + segs + `<g class="b2"><g class="ln">${dots}</g></g>`
      + `<g class="b3"><g class="tr"><circle cx="${pts[0][0]}" cy="${f(pts[0][1])}" r="14" fill="${C.yellow}" opacity=".8"/></g></g>`;
    put('4-2/수학/5/꺾은선그래프', svg(id, body, `
      ${growCss(id, 1, 'bar')}
      ${pts.map((_, i) => popCss(id, 2, `dt${i}`, .2 + .15 * i)).join('')}
      .on2 .sc-${id} .bars{opacity:.15;transition:opacity .6s ease 1.1s}
      ${pts.slice(1).map((_, i) => drawCss(id, 3, `sg${i}`, .1 + .3 * i, .35)).join('')}
      .sc-${id} .tr{opacity:0}
      .on3 .sc-${id} .tr{animation:${id}-tr 1.6s linear 1.4s both}
      @keyframes ${id}-tr{${travel}}
      .on3 .sc-${id} .tr{opacity:1}
      .on4 .sc-${id} .tr{opacity:0;transition:opacity .3s}
      .on4 .sc-${id} .sg,.on4 .sc-${id} .ln{animation:${id}-fl 1.4s ease-in-out .2s both}
      ${flash(id)}
    `));
  }

  // 눈금: 세로줄에 같은 간격으로 금 → 0, 5, 10을 적고 한 칸 1 cm → 강낭콩 싹이 자라 높이를 눈금으로 읽음 7 cm → 금이 차례로 반짝임
  {
    const id = 't42-m5-nungeum';
    const X = 240, yOf = (v) => AY - 22 * v;
    const ticks = range(0, 10).map((v, i) => {
      const big = v % 5 === 0, w = big ? 20 : 11;
      return `<g class="tk" style="--d:${f(.15 + .09 * i)}s"><path class="tl" d="M${X - w} ${yOf(v)} H${X + w}" stroke="${C.ink}" stroke-width="${big ? 4 : 3}" stroke-linecap="round"/></g>`;
    }).join('');
    const cells = range(0, 4).map((v, i) => `<g class="cl" style="--d:${f(.6 + .15 * i)}s"><path d="M${X + 26} ${yOf(v) - 3} V${yOf(v + 1) + 3}" stroke="${C.green}" stroke-width="6" stroke-linecap="round"/></g>`).join('');
    const PX = 470, top = yOf(7);
    const plant = `<path d="M${PX - 40} ${AY} H${PX + 40} L${PX + 30} ${AY + 46} H${PX - 30} Z" fill="${C.peach}" stroke="${C.orange}" stroke-width="3" stroke-linejoin="round"/>`
      + `<g class="stem"><path d="M${PX} ${AY} V${top}" stroke="${C.green}" stroke-width="6" stroke-linecap="round"/>`
      + `<path d="M${PX} ${top + 30} q-34 -6 -42 -30 q30 0 42 30 Z M${PX} ${top + 60} q34 -6 42 -30 q-30 0 -42 30 Z" fill="#7dbb8f" stroke="${C.green}" stroke-width="2.5"/></g>`;
    const body = seg([X, AY + 14], [X, yOf(10) - 16], { w: 4 }) + seg([X, AY], [PX + 80, AY], { w: 2, color: C.line })
      + `<g class="b1">${ticks}</g>`
      + `<g class="b2"><g class="nums">${text(X - 32, yOf(0) + 7, '0', { size: 22, anchor: 'end' })}${text(X - 32, yOf(5) + 7, '5', { size: 22, anchor: 'end' })}${text(X - 32, yOf(10) + 7, '10', { size: 22, anchor: 'end' })}${text(X, yOf(10) - 30, '(cm)', { size: 18, weight: 600 })}</g>`
      + `${cells}<g class="one">${text(X + 40, f((yOf(0) + yOf(1)) / 2 + 7), '1 cm', { size: 22, color: C.green, anchor: 'start' })}</g></g>`
      + `<g class="b3">${plant}<g class="rd"><path d="M${X + 12} ${top} H${PX - 10}" stroke="${C.orange}" stroke-width="3" stroke-dasharray="7 7"/>${dot([PX, top], { r: 9 })}`
      + `${text(X - 32, top + 7, '7', { size: 22, anchor: 'end', color: C.orange })}${text(PX + 22, top - 14, '7 cm', { size: 22, anchor: 'start', color: C.orange })}</g></g>`;
    put('4-2/수학/5/눈금', svg(id, body, `
      .sc-${id} .tk{transform-box:fill-box;transform-origin:center;transform:scaleX(0)}
      .on1 .sc-${id} .tk{transform:none;transition:transform .3s ease-out var(--d)}
      ${fadeCss(id, 2, 'nums', .1)}
      .sc-${id} .cl{opacity:0}
      .on2 .sc-${id} .cl{opacity:1;transition:opacity .2s ease var(--d)}
      .on3 .sc-${id} .cl{opacity:0;transition:opacity .3s}
      ${fadeCss(id, 2, 'one', 1.4)}
      .on3 .sc-${id} .one{opacity:0;transition:opacity .3s}
      ${growCss(id, 3, 'stem')}
      .on3 .sc-${id} .stem{transition-duration:1s;transition-delay:.2s}
      ${fadeCss(id, 3, 'rd', 1.3)}
      .on4 .sc-${id} .tl{animation:${id}-wave .5s ease-in-out var(--d) 2 alternate}
      @keyframes ${id}-wave{to{stroke:${C.orange}}}
    `));
  }

  // 물결선: 0~300 g 눈금에선 선이 위에 몰려 평평 → 점이 없는 0~220 g 띠 → 띠가 줄며 물결선, 눈금 220~260으로 바뀌고 선이 크게 꺾임 → 물결선 반짝임
  {
    const id = 't42-m5-mulgyeol';
    const days = ['월', '화', '수', '목', '금'], vals = [230, 235, 245, 240, 255];
    const yA = (v) => AY - v * 220 / 300, yB = (v) => 250 - (v - 220) * 4.25;
    const xs = vals.map((_, i) => 190 + 90 * i);
    const A = vals.map((v, i) => [xs[i], yA(v)]), B = vals.map((v, i) => [xs[i], yB(v)]);
    const m = morphLine(id, 'k', [A, B], [3]);
    const dots = A.map((p, i) => `<g class="dt" style="--dy:${f(B[i][1] - p[1])}px">${dot(p)}</g>`).join('');
    const wave = `<g class="wv"><rect x="${AX - 18}" y="262" width="36" height="28" fill="${C.paper}"/>`
      + `<path d="M${AX - 18} 270 q4.5 -8 9 0 t9 0 t9 0 t9 0 M${AX - 18} 284 q4.5 -8 9 0 t9 0 t9 0 t9 0" stroke="${C.red}" stroke-width="4" fill="none" stroke-linecap="round"/></g>`;
    const body = seg([AX, 70], [AX, AY], { w: 3 }) + seg([AX, AY], [610, AY], { w: 3 })
      + text(AX - 12, AY + 6, '0', { size: 18, weight: 600, anchor: 'end' }) + text(AX, 54, '(g)', { size: 18, weight: 600 })
      + days.map((d, i) => text(xs[i], 330, d, { size: 20 })).join('')
      + `<g class="ga">${gridLines(range(50, 300, 50), yA, 610, 50)}${yLabels(range(50, 300, 50), yA)}</g>`
      + `<g class="gb">${gridLines(range(220, 260, 5), yB, 610, 10)}${yLabels(range(220, 260, 10), yB)}</g>`
      + `<g class="b2"><g class="band"><rect x="${AX}" y="${f(yA(220))}" width="500" height="${f(AY - yA(220))}" fill="${C.peach}" opacity=".7"/>${seg([AX, yA(220)], [AX, AY], { w: 6, color: C.orange })}`
      + `${text(360, 236, '0 g ~ 220 g', { size: 24, color: C.orange })}</g></g>`
      + `<g class="b1"><g class="ln">${m.body}${dots}</g></g>`
      + `<g class="b3">${wave}</g>`
      + `<g class="b4"><g class="lab">${text(AX + 30, 286, '물결선', { size: 24, color: C.red, anchor: 'start' })}</g></g>`;
    put('4-2/수학/5/물결선', svg(id, body, `
      ${m.css}
      .sc-${id} .gb{opacity:0}
      .on3 .sc-${id} .gb{opacity:1;transition:opacity .5s ease 1s}
      .on3 .sc-${id} .ga{opacity:0;transition:opacity .4s ease .1s}
      .sc-${id} .band{transform-box:fill-box;transform-origin:center bottom}
      .on3 .sc-${id} .band{transform:scaleY(.1);opacity:0;transition:transform .8s ease-in .1s,opacity .3s ease .7s}
      .on3 .sc-${id} .dt{transform:translateY(var(--dy));transition:transform 1.2s cubic-bezier(.65,0,.35,1) .3s}
      ${popCss(id, 3, 'wv', .7)}
      ${popCss(id, 4, 'lab', .2)}
      .on4 .sc-${id} .wv{animation:${id}-fl 1.4s ease-in-out .5s both}
      ${flash(id)}
    `));
  }

  // 자료: 시각마다 온도계 눈금이 올라가고 기온을 적음 → 수가 표 칸으로 날아가 정리됨 → 표가 반짝이고 '자료'
  {
    const id = 't42-m5-jaryo';
    const times = ['9시', '11시', '13시', '15시'], temps = [14, 17, 20, 19];
    const cx = (i) => 190 + 100 * i;
    const lv = (t) => 160 - (t - 10) * 7;
    const thermo = temps.map((t, i) => {
      const x = cx(i);
      return `<rect x="${x - 9}" y="50" width="18" height="122" rx="9" fill="white" stroke="${C.muted}" stroke-width="3"/>`
        + `<g class="hg" style="--d:${f(.2 + .25 * i)}s"><rect x="${x - 4}" y="${lv(t)}" width="8" height="${172 - lv(t)}" fill="${C.red}"/></g>`
        + `<circle cx="${x}" cy="176" r="14" fill="${C.red}" stroke="${C.muted}" stroke-width="3"/>`
        + text(x, 216, times[i], { size: 20, weight: 600 })
        + `<g class="vl" style="--d:${f(.9 + .25 * i)}s">${text(x + 16, lv(t) + 7, `${t} ℃`, { size: 20, anchor: 'start', color: C.red })}</g>`;
    }).join('');
    const tx0 = 30, tx1 = 540, r0 = 236, r1 = 278, r2 = 320;
    const grid = `<rect x="${tx0}" y="${r0}" width="${tx1 - tx0}" height="${r2 - r0}" fill="white" stroke="${C.muted}" stroke-width="2"/>`
      + `<rect x="${tx0}" y="${r0}" width="${tx1 - tx0}" height="${r1 - r0}" fill="${C.mint}"/>`
      + `<path d="M${tx0} ${r1} H${tx1} M140 ${r0} V${r2} ${times.map((_, i) => `M${240 + 100 * i} ${r0} V${r2}`).slice(0, 3).join(' ')}" stroke="${C.muted}" stroke-width="2"/>`
      + text(85, 264, '시각', { size: 20 }) + text(85, 306, '기온(℃)', { size: 19 })
      + times.map((t, i) => text(cx(i), 264, t, { size: 20, weight: 600 })).join('');
    const fly = temps.map((t, i) => `<g class="fy" style="--dx:${f(cx(i) + 34 - cx(i))}px;--dy:${f(lv(t) - 306)}px;--d:${f(.6 + .2 * i)}s">${text(cx(i), 306, t, { size: 22 })}</g>`).join('');
    const brace = `<path d="M556 ${r0} q12 0 12 12 v18 q0 12 10 12 q-10 0 -10 12 v18 q0 12 -12 12" stroke="${C.green}" stroke-width="3" fill="none"/>`;
    const body = thermo
      + `<g class="b2"><g class="tb">${grid}</g>${fly}</g>`
      + `<g class="b3"><g class="ol"><rect x="${tx0}" y="${r0}" width="${tx1 - tx0}" height="${r2 - r0}" fill="none" stroke="${C.green}" stroke-width="5"/></g>${brace}<g class="lab">${text(606, 286, '자료', { size: 26, color: C.green })}</g></g>`;
    put('4-2/수학/5/자료', svg(id, body, `
      .sc-${id} .hg{transform-box:fill-box;transform-origin:center bottom;transform:scaleY(0)}
      .on1 .sc-${id} .hg{transform:none;transition:transform .7s ease-out var(--d)}
      .sc-${id} .vl{opacity:0}
      .on1 .sc-${id} .vl{opacity:1;transition:opacity .3s ease var(--d)}
      ${fadeCss(id, 2, 'tb', .1)}
      .sc-${id} .fy{opacity:0;transform:translate(var(--dx),var(--dy))}
      .on2 .sc-${id} .fy{opacity:1;transform:none;transition:opacity .2s ease var(--d),transform .8s ${'cubic-bezier(.65,0,.35,1)'} var(--d)}
      .on3 .sc-${id} .ol{animation:${id}-fl 1.4s ease-in-out .2s both}
      ${flash(id)}
      ${popCss(id, 3, 'lab', .5)}
    `));
  }

  // 해석: 수건 무게 꺾은선이 그려짐 → 빛 점이 선을 따라 내려가고 화살표 → 처음 두 선분 주황(많이), 나중 두 선분 파랑(조금) → 물방울이 사라지고 '마름'
  {
    const id = 't42-m5-haeseok';
    const yOf = (v) => AY - v * 220 / 300;
    const mins = [0, 10, 20, 30, 40], vals = [300, 240, 190, 160, 150];
    const pts = vals.map((v, i) => [150 + 90 * i, yOf(v)]);
    const segs = pts.slice(1).map((p, i) => drawSeg(pts[i], p, { w: 5, color: C.ink, cls: `sg sg${i} ${i < 2 ? 'big' : 'small'}` })).join('');
    const dots = pts.map((p, i) => `<g class="dt dt${i}">${dot(p, { color: C.ink })}</g>`).join('');
    const rel = pts.map((p) => sub(p, pts[0]));
    const travel = rel.map((r, i) => `${f(100 * i / (rel.length - 1))}%{transform:translate(${f(r[0])}px,${f(r[1])}px)}`).join('');
    const drops = [0, 1, 2].map((i) => `<g class="drop drop${i}"><path d="M${578 + 17 * i} ${186 + (i % 2) * 14} q-7 10 0 14 q7 -4 0 -14 Z" fill="${C.blue}"/></g>`).join('');
    const towel = `<path d="M548 88 H636" stroke="${C.muted}" stroke-width="4" stroke-linecap="round"/>`
      + `<rect class="tw" x="564" y="88" width="56" height="84" rx="5" fill="${C.sky}" stroke="${C.blue}" stroke-width="3"/>`
      + `<path d="M564 150 H620 M564 158 H620" stroke="${C.blue}" stroke-width="2"/>` + drops;
    const body = gridLines(range(50, 300, 50), yOf, 530, 100) + axes(530) + yLabels(range(0, 300, 100), yOf) + text(AX, 54, '(g)', { size: 18, weight: 600 })
      + mins.map((mn, i) => text(pts[i][0], 330, mn, { size: 20 })).join('') + text(552, 306, '(분)', { size: 18, weight: 600 })
      + towel
      + `<g class="b1"><g class="ln">${segs}${dots}</g></g>`
      + `<g class="b2"><g class="tr"><circle cx="${pts[0][0]}" cy="${f(pts[0][1])}" r="14" fill="${C.yellow}" opacity=".8"/></g>`
      + `<g class="ar"><path d="M200 168 L430 246" stroke="${C.red}" stroke-width="5" stroke-linecap="round" pathLength="100"/><path d="M414 252 L430 246 L420 232" stroke="${C.red}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none"/></g></g>`
      + `<g class="b3"><g class="l1">${text(236, 96, '많이', { size: 22, color: C.orange, anchor: 'start' })}</g><g class="l2">${text(462, 224, '조금', { size: 22, color: C.blue })}</g></g>`
      + `<g class="b4"><g class="lab">${text(592, 236, '마름', { size: 24, color: C.green })}</g></g>`;
    put('4-2/수학/5/해석', svg(id, body, `
      ${pts.slice(1).map((_, i) => drawCss(id, 1, `sg${i}`, .2 + .3 * i, .35)).join('')}
      ${pts.map((_, i) => popCss(id, 1, `dt${i}`, .1 + .3 * i)).join('')}
      .sc-${id} .tr{opacity:0}
      .on2 .sc-${id} .tr{opacity:1;animation:${id}-tr 1.6s linear .2s both}
      .on3 .sc-${id} .tr{opacity:0;transition:opacity .3s}
      @keyframes ${id}-tr{${travel}}
      ${fadeCss(id, 2, 'ar', 1.2)}
      .on3 .sc-${id} .ar{opacity:0;transition:opacity .3s}
      .on3 .sc-${id} .big{stroke:${C.orange};stroke-width:7;transition:stroke .4s ease .2s,stroke-width .4s ease .2s}
      .on3 .sc-${id} .small{stroke:${C.blue};stroke-width:7;transition:stroke .4s ease .9s,stroke-width .4s ease .9s}
      ${fadeCss(id, 3, 'l1', .5)}${fadeCss(id, 3, 'l2', 1.2)}
      .on4 .sc-${id} .drop{opacity:0;transform:translateY(16px);transition:opacity .5s ease var(--d,0s),transform .5s ease var(--d,0s)}
      .on4 .sc-${id} .drop1{--d:.35s}.on4 .sc-${id} .drop2{--d:.7s}
      .on4 .sc-${id} .tw{fill:white;transition:fill .6s ease 1s}
      ${popCss(id, 4, 'lab', 1.3)}
    `));
  }
})(typeof window !== 'undefined' ? window : globalThis);
