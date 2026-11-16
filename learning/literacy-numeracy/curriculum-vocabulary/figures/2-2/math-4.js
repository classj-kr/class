// 수학 2-2 4단원 시각과 시간: 낱말 도식
// 시계: 바늘은 12시를 향하게 그리고 속성 없는 <g> 를 시계 가운데를 축으로 돌린다. 짧은바늘 파랑, 긴바늘 주황.
// 짧은바늘 각도 = (시 + 분/60) × 30°, 긴바늘 = 분 × 6° — 7시 15분이면 짧은바늘은 7과 8 사이(217.5°).
// 하루 띠: 밤 12시 → 낮 12시(오전, 하늘색) → 밤 12시(오후, 살구색), 한 칸 1시간.
// 달력은 교과서처럼 일요일부터 토요일까지.
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
  const pol = (cx, cy, r, deg) => [cx + r * Math.sin(deg * Math.PI / 180), cy - r * Math.cos(deg * Math.PI / 180)];
  const clockFace = (cx, cy, R, size = 24) => {
    let small = '', big = '', nums = '';
    for (let k = 0; k < 60; k++) {
      const [x1, y1] = pol(cx, cy, R - 5, k * 6), [x2, y2] = pol(cx, cy, R - (k % 5 ? 13 : 21), k * 6);
      const d = `M${f(x1)} ${f(y1)}L${f(x2)} ${f(y2)}`;
      if (k % 5) small += d; else big += d;
    }
    for (let h = 1; h <= 12; h++) { const [x, y] = pol(cx, cy, R - 38, h * 30); nums += T(x, y + size * .36, h, { size }); }
    return `<circle cx="${cx}" cy="${cy}" r="${R}" fill="white" stroke="${C.ink}" stroke-width="5"/><path d="${small}" stroke="${C.ink}" stroke-width="1.6"/><path d="${big}" stroke="${C.ink}" stroke-width="3.5"/>` + nums;
  };
  const hand = (cx, cy, len, w, color, cls) => `<g class="${cls}"><path d="M${cx} ${cy + 12} V${cy - len}" stroke="${color}" stroke-width="${w}" stroke-linecap="round"/></g>`;
  // 바늘 각도: 처음 a0, 칸마다 [칸, 각도, 걸리는 초, 기다리는 초]
  const turn = (id, cls, cx, cy, a0, steps) => `
      .sc-${id} .${cls} { transform-box: view-box; transform-origin: ${cx}px ${cy}px; transform: rotate(${a0}deg); }`
    + steps.map(([n, a, dur = 1.2, wait = .2, ease = 'ease-in-out']) => `
      .on${n} .sc-${id} .${cls} { transform: rotate(${a}deg); transition: transform ${dur}s ${ease} ${wait}s; }`).join('');
  const arcPath = (cx, cy, r, a, b) => { const [x1, y1] = pol(cx, cy, r, a), [x2, y2] = pol(cx, cy, r, b); return `M${f(x1)} ${f(y1)} A${r} ${r} 0 ${b - a > 180 ? 1 : 0} 1 ${f(x2)} ${f(y2)}`; };
  const pin = (cx, cy) => `<circle cx="${cx}" cy="${cy}" r="9" fill="${C.ink}"/>`;

  // 시각: 바늘이 7시 15분으로 → 짧은바늘 7과 8 사이(7시), 긴바늘 3(5·10·15, 15분) → 7시 15분, 시각
  (function () {
    const id = 't22-m4-sigak', cx = 170, cy = 180, R = 145, H = 7.25 * 30, M = 90;
    const outer = [5, 10, 15].map((m, i) => { const [x, y] = pol(cx, cy, R + 20, m * 6); return tag(x + 6, y + 7, m, C.orange, 's2', 1 + i * .25, 20); }).join('');
    const body = clockFace(cx, cy, R)
      + G('s2', .2, `<path d="M${cx} ${cy} L${pol(cx, cy, R - 22, 210).map(f).join(' ')} ${arcPath(cx, cy, R - 22, 210, 240).replace(/^M[^A]+/, '')} Z" fill="${C.sky}" opacity=".85"/>`)
      + hand(cx, cy, 74, 12, C.blue, 'hh') + hand(cx, cy, 116, 7, C.orange, 'mh') + pin(cx, cy)
      + ring(...pol(cx, cy, 70, H), 14, C.blue, 'r2', .4) + tag(450, 112, '7시', C.blue, 'p2', .6, 38)
      + outer + ring(...pol(cx, cy, 112, M), 14, C.orange, 'r2', 1.6) + tag(560, 112, '15분', C.orange, 'p2', 1.8, 38)
      + G('k3', .2, rect(400, 66, 220, 64, 'none', C.green, 3.5, 12))
      + tag(510, 210, '7시 15분', C.green, 'p3', .7, 44)
      + G('p3', 1.3, pill(510, 296, 100, '시각', C.green, C.mint, 32));
    reg('2-2/수학/4/시각', id, body, turn(id, 'hh', cx, cy, 0, [[1, H, 1.4]]) + turn(id, 'mh', cx, cy, 0, [[1, M, 1.4]]));
  })();

  // 분: 1시에서 긴바늘이 작은 눈금 한 칸 → 1분 → 숫자마다 5분씩, 긴바늘 2 → 10분 → 작은 눈금 3칸 더 → 1시 13분
  (function () {
    const id = 't22-m4-bun', cx = 184, cy = 180, R = 145;
    const outer = Array.from({ length: 11 }, (_, i) => { const m = (i + 1) * 5, [x, y] = pol(cx, cy, R + 19, m * 6); return tag(x, y + 7, m, C.orange, 's2', .1 + i * .1, 19); }).join('');
    const tickArc = (a, b, cls, d) => G(cls, d, `<path d="${arcPath(cx, cy, R - 9, a, b)}" stroke="${C.orange}" stroke-width="12" fill="none" opacity=".75"/>`);
    const body = clockFace(cx, cy, R)
      + tickArc(0, 6, 's1', .9) + ring(...pol(cx, cy, R - 9, 3), 14, C.orange, 'r1', 1)
      + outer
      + tickArc(60, 66, 'p3', .3) + tickArc(66, 72, 'p3', .6) + tickArc(72, 78, 'p3', .9)
      + hand(cx, cy, 74, 12, C.blue, 'hh') + hand(cx, cy, 116, 7, C.orange, 'mh') + pin(cx, cy)
      + tag(500, 100, '1분', C.orange, 's1', 1, 40)
      + tag(500, 176, '10분', C.orange, 's2', 1.6, 40)
      + tag(500, 250, '1시 13분', C.green, 'p3', 1.2, 40)
      + G('p3', 1.6, pill(500, 316, 80, '분', C.green, C.mint, 32));
    reg('2-2/수학/4/분', id, body,
      turn(id, 'hh', cx, cy, 30, [[1, 30.5, .5, .4], [2, 35, 1.2, .3], [3, 36.5, .8, .2]])
      + turn(id, 'mh', cx, cy, 0, [[1, 6, .5, .4], [2, 60, 1.2, .3], [3, 78, .8, .2]]));
  })();

  // 시간: 5시에 시작 → 긴바늘이 한 바퀴 돌며 띠가 10분씩 채워져 6시 → 60분 = 1시간, 시간
  (function () {
    const id = 't22-m4-sigan', cx = 170, cy = 180, R = 135, sx = 380, cw = 40, sy = 150;
    const strip = rect(sx, sy, 6 * cw, 36, 'white', C.ink, 2.5, 3)
      + `<rect class="fl" x="${sx}" y="${sy}" width="${6 * cw}" height="36" fill="${C.peach}"/>`
      + `<path d="${Array.from({ length: 5 }, (_, i) => `M${sx + (i + 1) * cw} ${sy}v36`).join('')}" stroke="${C.ink}" stroke-width="1.5"/>`
      + `<path d="M${sx} ${sy - 8}v52M${sx + 6 * cw} ${sy - 8}v52" stroke="${C.ink}" stroke-width="3"/>`
      + T(sx, sy + 70, '5시', { size: 22 }) + T(sx + 6 * cw, sy + 70, '6시', { size: 22 });
    const body = clockFace(cx, cy, R, 22)
      + hand(cx, cy, 68, 12, C.blue, 'hh') + hand(cx, cy, 106, 7, C.orange, 'mh') + pin(cx, cy)
      + G('s1', .9, strip) + tag(sx, 104, '시작', C.blue, 's1', 1.2, 24)
      + `<g class="h3">${tag(sx + 6 * cw, 104, '끝', C.blue, 's2', 1.8, 24)}</g>`
      + G('s3', .1, brace(sx, sx + 6 * cw, sy - 14, C.green, false) + T(sx + 3 * cw, sy - 48, '1시간', { size: 30, color: C.green }))
      + `<g class="h3">${G('s2', 1.8, brace(sx, sx + 6 * cw, sy - 14, C.orange, false) + T(sx + 3 * cw, sy - 48, '60분', { size: 30, color: C.orange }))}</g>`
      + tag(500, 290, '60분 = 1시간', C.ink, 's3', .5, 36)
      + G('p3', 1.2, pill(500, 334, 100, '시간', C.green, C.mint, 30));
    reg('2-2/수학/4/시간', id, body,
      turn(id, 'hh', cx, cy, 0, [[1, 150, 1.2, .1], [2, 180, 1.6, .2, 'linear']])
      + turn(id, 'mh', cx, cy, 0, [[1, 0, .1, 0], [2, 360, 1.6, .2, 'linear']]) + `
      .sc-${id} .fl { transform-box: fill-box; transform-origin: left center; transform: scaleX(0); }
      .on2 .sc-${id} .fl { transform: none; transition: transform 1.6s linear .2s; }`);
  })();

  // 하루 띠
  const bx0 = 40, bw = 560 / 24, by = 150, bh = 40, bx = (hr) => bx0 + hr * bw;
  const band = () => {
    let cells = '';
    for (let k = 1; k < 24; k++) cells += `M${f(bx(k))} ${by}v${bh}`;
    return `<rect x="${bx0}" y="${by}" width="560" height="${bh}" fill="white"/>`
      + `<rect class="am" x="${bx0}" y="${by}" width="280" height="${bh}" fill="${C.sky}"/><rect class="pm" x="${bx(12)}" y="${by}" width="280" height="${bh}" fill="${C.peach}"/>`
      + `<path d="${cells}" stroke="${C.line}" stroke-width="1.5"/><rect x="${bx0}" y="${by}" width="560" height="${bh}" fill="none" stroke="${C.ink}" stroke-width="3"/>`
      + `<path d="M${bx(12)} ${by - 8}v${bh + 16}" stroke="${C.ink}" stroke-width="3"/>`
      + [12, 3, 6, 9, 12, 3, 6, 9, 12].map((s, i) => T(bx(i * 3), by + bh + 26, s, { size: 18, weight: 600 })).join('')
      + T(bx(0), by + bh + 52, '밤', { size: 20, color: C.purple }) + T(bx(12), by + bh + 52, '낮', { size: 20, color: C.orange }) + T(bx(24), by + bh + 52, '밤', { size: 20, color: C.purple });
  };
  const bandCss = (id, amOn, pmOn, dur = .9) => `
      .sc-${id} :is(.am,.pm) { transform-box: fill-box; transform-origin: left center; transform: scaleX(0); }
      .on${amOn} .sc-${id} .am { transform: none; transition: transform ${dur}s linear .2s; }
      .on${pmOn} .sc-${id} .pm { transform: none; transition: transform ${dur}s linear .2s; }`;

  // 하루: 짧은바늘 한 바퀴 동안 오전 반이 채워짐(12시간) → 한 바퀴 더(12시간) → 24시간, 하루
  (function () {
    const id = 't22-m4-haru', cx = 320, cy = 66, R = 50;
    let tk = '';
    for (let h = 0; h < 12; h++) { const [x1, y1] = pol(cx, cy, R - 4, h * 30), [x2, y2] = pol(cx, cy, R - 12, h * 30); tk += `M${f(x1)} ${f(y1)}L${f(x2)} ${f(y2)}`; }
    const clock = `<circle cx="${cx}" cy="${cy}" r="${R}" fill="white" stroke="${C.ink}" stroke-width="4"/><path d="${tk}" stroke="${C.ink}" stroke-width="3"/>${T(cx, cy - 22, 12, { size: 18 })}`
      + hand(cx, cy, 20, 8, C.blue, 'hh') + `<circle cx="${cx}" cy="${cy}" r="6" fill="${C.ink}"/>`;
    const body = band() + clock
      + G('s1', 1.4, brace(bx(0), bx(12), by - 10, C.blue, false) + T(bx(6), by - 44, '12시간', { size: 26, color: C.blue }))
      + G('s2', 1.4, brace(bx(12), bx(24), by - 10, C.orange, false) + T(bx(18), by - 44, '12시간', { size: 26, color: C.orange }))
      + G('s3', .2, brace(bx(0), bx(24), by + bh + 66, C.green))
      + tag(320, 340, '하루 = 24시간', C.green, 'p3', .7, 34);
    reg('2-2/수학/4/하루', id, body, bandCss(id, 1, 2, 1.6)
      + turn(id, 'hh', cx, cy, 0, [[1, 360, 1.6, .2, 'linear'], [2, 720, 1.6, .2, 'linear']]));
  })();

  // 오전·오후: 띠 → 그 반이 칠해지고 위에 이름 → 한 시각에 점과 이름
  const halfDay = (key, id, am) => {
    const [a, b] = am ? [0, 12] : [12, 24], hr = am ? 9 : 15, color = am ? C.blue : C.orange, name = am ? '오전' : '오후';
    const body = band()
      + G('s2', .9, brace(bx(a), bx(b), by - 10, color, false) + T(bx((a + b) / 2), by - 44, name, { size: 36, color }))
      + ring(bx(a), by + bh / 2, 16, color, 'r2', .2) + ring(bx(b), by + bh / 2, 16, color, 'r2', 1.1)
      + G('p3', .2, `<circle cx="${f(bx(hr))}" cy="${by + bh / 2}" r="11" fill="${C.red}" stroke="white" stroke-width="3"/>`)
      + G('s3', .5, `<path d="M${f(bx(hr))} ${by + bh + 62} V${by + bh + 84}" stroke="${C.red}" stroke-width="3"/>`)
      + tag(bx(hr), 330, `${name} ${am ? 9 : 3}시`, C.red, 'p3', .8, 34);
    reg(key, id, body, bandCss(id, am ? 2 : 9, am ? 9 : 2) + `
      .sc-${id} .${am ? 'pm' : 'am'} { opacity: .25; transform: none; }`);
  };
  halfDay('2-2/수학/4/오전', 't22-m4-ojeon', true);
  halfDay('2-2/수학/4/오후', 't22-m4-ohu', false);

  // 일주일: 일~토 한 줄(5~11일) → 하루씩 세어 7일 → 다음 줄 12일도 일요일, 1주일 = 7일
  (function () {
    const id = 't22-m4-iljuil', x0 = 40, cw = 80;
    const days = ['일', '월', '화', '수', '목', '금', '토'], dc = (i) => (i === 0 ? C.red : i === 6 ? C.blue : C.ink);
    const head = rect(x0, 30, 7 * cw, 40, C.mint, C.green, 2.5, 4) + days.map((s, i) => T(x0 + i * cw + cw / 2, 58, s, { size: 22, color: dc(i) })).join('');
    const grid = `<path d="${Array.from({ length: 6 }, (_, i) => `M${x0 + (i + 1) * cw} 30v180`).join('')}M${x0} 140h${7 * cw}" stroke="${C.line}" stroke-width="2"/>` + rect(x0, 30, 7 * cw, 180, 'none', C.ink, 2.5, 4);
    const row1 = days.map((_, i) => G('p1', .3 + i * .1, T(x0 + i * cw + cw / 2, 118, 5 + i, { size: 30, color: dc(i) }))).join('');
    const fills = days.map((_, i) => G('s2', .2 + i * .2, `<rect x="${x0 + i * cw + 3}" y="73" width="${cw - 6}" height="64" fill="${C.yellow}" opacity=".45"/>`)
      + G('p2', .3 + i * .2, `<circle cx="${x0 + i * cw + 15}" cy="86" r="12" fill="${C.orange}"/>` + T(x0 + i * cw + 15, 92.5, i + 1, { size: 18, color: 'white' }))).join('');
    const row2 = days.map((_, i) => T(x0 + i * cw + cw / 2, 188, 12 + i, { size: 30, color: dc(i) })).join('');
    const body = head + G('s1', .1, grid) + fills + row1
      + `<g class="h3">${G('s2', 1.7, brace(x0, x0 + 7 * cw, 146, C.orange) + T(320, 198, '7일', { size: 32, color: C.orange }))}</g>`
      + G('s3', .1, row2)
      + ring(x0 + cw / 2, 108, 26, C.red, 'r3', .6) + ring(x0 + cw / 2, 178, 26, C.red, 'r3', 1)
      + G('s3', .8, `<path d="M${x0 + 18} 126 Q${x0 - 6} 150 ${x0 + 18} 166" stroke="${C.red}" stroke-width="3" fill="none"/>` + arrow(x0 + 14, 160, x0 + 22, 168, C.red, '', 3))
      + tag(320, 290, '1주일 = 7일', C.green, 'p3', 1.3, 40);
    reg('2-2/수학/4/일주일', id, body);
  })();

  // 달력: 10월과 요일 → 1~31일이 요일에 맞추어 줄마다 → 9일과 목요일 세로줄, 달력
  (function () {
    const id = 't22-m4-dallyeok', x0 = 20, cw = 64, rh = 44, top = 80, first = 3;
    const days = ['일', '월', '화', '수', '목', '금', '토'], dc = (i) => (i === 0 ? C.red : i === 6 ? C.blue : C.ink);
    const head = T(x0 + 3.5 * cw, 34, '10월', { size: 28, color: C.green })
      + rect(x0, 46, 7 * cw, 34, C.mint, C.green, 2.5, 3) + days.map((s, i) => T(x0 + i * cw + cw / 2, 70, s, { size: 20, color: dc(i) })).join('');
    const grid = `<path d="${Array.from({ length: 6 }, (_, i) => `M${x0 + (i + 1) * cw} ${top}v${5 * rh}`).join('')}${Array.from({ length: 4 }, (_, i) => `M${x0} ${top + (i + 1) * rh}h${7 * cw}`).join('')}" stroke="${C.line}" stroke-width="1.5"/>` + rect(x0, 46, 7 * cw, 34 + 5 * rh, 'none', C.ink, 2.5, 3);
    const rows = [];
    for (let d = 1; d <= 31; d++) { const p = first + d - 1, r = Math.floor(p / 7), c = p % 7; (rows[r] ||= []).push(T(x0 + c * cw + cw / 2, top + r * rh + 30, d, { size: 22, color: dc(c) })); }
    const body = G('p1', .2, head) + G('s1', .6, grid)
      + rows.map((list, r) => G('s2', .2 + r * .3, list.join(''))).join('')
      + G('s3', .1, `<rect x="${x0 + 4 * cw + 2}" y="48" width="${cw - 4}" height="${30 + 5 * rh}" fill="${C.yellow}" opacity=".35"/>`)
      + ring(x0 + 4.5 * cw, top + rh + 22, 22, C.red, 'r3', .5)
      + G('s3', .4, `<circle cx="${x0 + 4.5 * cw}" cy="${top + rh + 22}" r="19" fill="none" stroke="${C.red}" stroke-width="3"/>`)
      + tag(555, 140, '10월 9일', C.red, 's3', .9, 28) + tag(555, 184, '목요일', C.red, 's3', 1.2, 28)
      + G('p3', 1.5, pill(555, 300, 100, '달력', C.green, C.mint, 30));
    reg('2-2/수학/4/달력', id, body);
  })();

  // 개월: 1월~12월 카드 → 3월에서 한 달씩 6번 뛰어 9월, 6개월 → 열두 달, 1년 = 12개월
  (function () {
    const id = 't22-m4-gaewol', y = 170, xc = (i) => 45 + 50 * i;
    const cards = Array.from({ length: 12 }, (_, i) => G('p1', .1 + i * .1, rect(22 + i * 50, y, 46, 50, i === 2 || i === 8 ? C.peach : C.sky, i === 2 || i === 8 ? C.orange : C.blue, 2.5, 8) + T(xc(i), y + 32, `${i + 1}월`, { size: 18, color: C.ink }))).join('');
    let hops = '';
    for (let k = 0; k < 6; k++) {
      const a = xc(2 + k), b = xc(3 + k);
      hops += draw(`M${a + 4} ${y - 4} Q${(a + b) / 2} ${y - 46} ${b - 4} ${y - 4}`, C.orange, 3.5, 2, .2 + k * .25) + tag((a + b) / 2, y - 34, k + 1, C.orange, 's2', .35 + k * .25, 18);
    }
    const body = cards + hops
      + ring(xc(2), y + 25, 28, C.orange, 'r2', .1)
      + tag(xc(8), 100, '6개월', C.orange, 'p2', 1.8, 32)
      + G('s3', .2, brace(22, 22 + 12 * 50 - 4, y + 58, C.green) + T(320, y + 110, '12개월', { size: 30, color: C.green }))
      + tag(320, 340, '1년 = 12개월', C.green, 'p3', 1, 32);
    reg('2-2/수학/4/개월', id, body);
  })();

  // 날수: 4월 달력에 1~30일이 차례로, 날수 30일 → 열두 달의 날수 카드 → 31일인 달 테두리, 2월은 28(29)
  (function () {
    const id = 't22-m4-nalsu', x0 = 20, cw = 34, rh = 30, top = 96, first = 2;
    const dc = (i) => (i === 0 ? C.red : i === 6 ? C.blue : C.ink);
    const head = T(x0 + 3.5 * cw, 54, '4월', { size: 28, color: C.green })
      + rect(x0, 68, 7 * cw, 28, C.mint, C.green, 2, 3) + ['일', '월', '화', '수', '목', '금', '토'].map((s, i) => T(x0 + i * cw + cw / 2, 89, s, { size: 18, color: dc(i) })).join('')
      + rect(x0, 68, 7 * cw, 28 + 5 * rh, 'none', C.ink, 2, 3);
    let dates = '';
    for (let d = 1; d <= 30; d++) { const p = first + d - 1, c = p % 7, r = Math.floor(p / 7); dates += tag(x0 + c * cw + cw / 2, top + r * rh + 22, d, dc(c), 'p1', .1 + d * .05, 18); }
    const days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    const cards = days.map((n, i) => {
      const c = i % 3, r = Math.floor(i / 3), x = 300 + c * 110, y = 30 + r * 72;
      const color = n === 31 ? C.orange : n === 30 ? C.blue : C.purple, fill = n === 31 ? C.peach : n === 30 ? C.sky : C.lilac;
      return G('p2', .1 + i * .1, rect(x, y, 100, 60, fill, color, 2.5, 8) + T(x + 50, y + 24, `${i + 1}월`, { size: 18 }) + T(x + 50, y + 52, n === 28 ? '28(29)' : n, { size: n === 28 ? 22 : 26, color }));
    }).join('');
    const outline31 = days.map((n, i) => n === 31 ? rect(300 + (i % 3) * 110 - 4, 30 + Math.floor(i / 3) * 72 - 4, 108, 68, 'none', C.orange, 3.5, 10) : '').join('');
    const body = head + dates
      + tag(x0 + 3.5 * cw, 290, '날수 30일', C.green, 's1', 1.8, 30)
      + cards
      + G('k3', .2, outline31)
      + ring(350, 30 + 72 + 30, 34, C.blue, 'r3', 1) + ring(460, 30 + 30, 36, C.purple, 'r3', 1.4)
      + G('p3', 1.2, pill(x0 + 3.5 * cw, 334, 100, '날수', C.green, C.mint, 30));
    reg('2-2/수학/4/날수', id, body);
  })();
})(typeof window !== 'undefined' ? window : globalThis);
