(function (root) {
  'use strict';
  const { C, svg, text, put } = root.FigureKit;
  const KEY = (u, w) => `7-2/사회/${u}/${w}`;
  const f = (n) => +(+n).toFixed(1);
  const dl = (s) => (s ? ` style="animation-delay:${s}s"` : '');
  const g = (cls, inner, s = 0) => `<g class="${cls}"${dl(s)}>${inner}</g>`;
  // 칸 n 에 나타나며 kind(pop·fin·rise·drop) 움직임을 한 번 한다
  const at = (n, kind, inner, s = 0) => `<g class="b${n}">${g(`${kind} ${kind}${n}`, inner, s)}</g>`;
  // 칸 n 부터 보이고, hide 칸부터 사라진다
  const shown = (n, inner, hide) => `<g class="b${n}${hide ? ' h' + hide : ''}">${inner}</g>`;
  // 칸 n 부터 흐려진다(다른 것에 눈이 가도록)
  const dimFrom = (n, inner) => `<g class="dim dim${n}">${inner}</g>`;

  // 글자 폭 어림(맑은 고딕 굵게: 한글 1em, 숫자 .6em, 빈칸 .3em)
  const tw = (s, size) => [...String(s)].reduce((a, c) => a + (/[가-힣?→]/.test(c) ? 1 : c === ' ' ? 0.3 : 0.6), 0) * size;
  const HOT = [C.peach, C.orange], COLD = [C.sky, C.blue], OK = [C.mint, C.green], OLD = [C.lilac, C.purple], PLAIN = ['white', C.muted];
  const tagW = (label, size = 20) => Math.round(tw(label, size) + size * 1.3);
  const tag = (cx, cy, label, [fill, stroke] = OK, { size = 20 } = {}) => {
    const w = tagW(label, size), h = Math.round(size * 1.7);
    return `<g><rect x="${f(cx - w / 2)}" y="${f(cy - h / 2)}" width="${w}" height="${h}" rx="${h / 2}" fill="${fill}" stroke="${stroke}" stroke-width="2.5"/>${text(f(cx), f(cy + size * 0.36), label, { size })}</g>`;
  };
  const box = (cx, cy, w, h, label, [fill, stroke] = OK, size = 20, rx = 10) =>
    `<rect x="${f(cx - w / 2)}" y="${f(cy - h / 2)}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" stroke="${stroke}" stroke-width="3"/>` + (label ? text(f(cx), f(cy + size * 0.36), label, { size }) : '');
  const head = (x, y, ang, color, w = 4) => {
    const l = 8 + w * 1.4, p = (d) => `${f(x - l * Math.cos(ang + d))} ${f(y - l * Math.sin(ang + d))}`;
    return `<path d="M${p(-0.5)} L${f(x)} ${f(y)} L${p(0.5)}" stroke="${color}" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  };
  // 흐르는 화살표: 점선이 끝 쪽으로 흐른다(무늬 한 마디 24)
  const flow = (pts, color, { w = 5, dash = '14 10' } = {}) => {
    const [a, b] = pts.slice(-2), ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
    const end = [b[0] - w * Math.cos(ang), b[1] - w * Math.sin(ang)];
    const d = 'M' + [...pts.slice(0, -1), end].map((p) => `${f(p[0])} ${f(p[1])}`).join(' L');
    return `<g><path class="mar" d="${d}" stroke="${color}" stroke-width="${w}" stroke-dasharray="${dash}" stroke-linecap="round" stroke-linejoin="round" fill="none"/>${head(b[0], b[1], ang, color, w)}</g>`;
  };
  // 굽은 흐르는 화살표(2차 곡선): 시작 a, 꺾는 점 q, 끝 b
  const flowQ = (a, q, b, color, { w = 5 } = {}) => {
    const ang = Math.atan2(b[1] - q[1], b[0] - q[0]);
    const end = [b[0] - w * Math.cos(ang), b[1] - w * Math.sin(ang)];
    return `<g><path class="mar" d="M${f(a[0])} ${f(a[1])} Q${f(q[0])} ${f(q[1])} ${f(end[0])} ${f(end[1])}" stroke="${color}" stroke-width="${w}" stroke-dasharray="14 10" stroke-linecap="round" fill="none"/>${head(b[0], b[1], ang, color, w)}</g>`;
  };
  // 그려지는 선(칸 n 에 그려진다)
  const drawn = (n, d, color = C.ink, w = 3, extra = '') => `<path class="draw draw${n}" pathLength="1" d="${d}" stroke="${color}" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round"${extra}/>`;
  const glowRect = (x, y, w, h, n, color = C.green, delay = 0, rx = 12) =>
    `<g class="b${n}"><rect class="flash flash${n}"${dl(delay)} x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="${rx}" fill="none" stroke="${color}" stroke-width="5"/></g>`;
  const ring = (cx, cy, r, n, color = C.green, s = 0) => `<g class="b${n}"><circle class="ring ring${n}"${dl(s)} cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${color}" stroke-width="4"/></g>`;
  // 칸마다 자리를 옮기는 것: pts = [[x,y] (1칸), [x,y] (2칸) …], 빈 칸은 앞 칸 자리를 그대로 쓴다
  const mvStyle = (pts, extra = '') => {
    const out = [];
    for (let n = 1; n <= 5; n++) { const p = pts[Math.min(n, pts.length) - 1]; out.push(`--x${n}:${f(p[0])}px;--y${n}:${f(p[1])}px`); }
    return out.join(';') + (extra ? ';' + extra : '');
  };
  const mover = (pts, inner, delay = 0) => `<g class="mv" style="${mvStyle(pts, delay ? `transition-delay:${delay}s` : '')}">${inner}</g>`;
  // 사람 아이콘: (x, y) 는 발밑 가운데. tie: 넥타이
  const person = (x, y, color = C.green, s = 1, { tie = false } = {}) => {
    let o = `<circle cx="${f(x)}" cy="${f(y - 27 * s)}" r="${f(7.5 * s)}" fill="${color}"/><path d="M${f(x - 11 * s)} ${f(y)} V${f(y - 9 * s)} Q${f(x - 11 * s)} ${f(y - 18 * s)} ${f(x)} ${f(y - 18 * s)} Q${f(x + 11 * s)} ${f(y - 18 * s)} ${f(x + 11 * s)} ${f(y - 9 * s)} V${f(y)} Z" fill="${color}"/>`;
    if (tie) o += `<path d="M${f(x)} ${f(y - 17 * s)} L${f(x - 2.2 * s)} ${f(y - 9 * s)} L${f(x)} ${f(y - 5 * s)} L${f(x + 2.2 * s)} ${f(y - 9 * s)} Z" fill="${C.red}"/>`;
    return o;
  };
  // 물음표 방울과 맞음 표
  const qmark = (x, y, r = 17) => `<circle cx="${x}" cy="${y}" r="${r}" fill="white" stroke="${C.orange}" stroke-width="3"/>` + text(x, f(y + r * 0.45), '?', { size: f(r * 1.3), color: C.orange });
  const check = (x, y, s = 1, color = C.green) => `<path d="M${f(x - 12 * s)} ${f(y)} L${f(x - 3 * s)} ${f(y + 9 * s)} L${f(x + 13 * s)} ${f(y - 10 * s)}" stroke="${color}" stroke-width="${f(6 * s)}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  const cross = (x, y, r = 14) => `<circle cx="${x}" cy="${y}" r="${r + 6}" fill="white" stroke="${C.red}" stroke-width="3.5"/><path d="M${f(x - r * 0.55)} ${f(y - r * 0.55)} L${f(x + r * 0.55)} ${f(y + r * 0.55)} M${f(x + r * 0.55)} ${f(y - r * 0.55)} L${f(x - r * 0.55)} ${f(y + r * 0.55)}" stroke="${C.red}" stroke-width="5" stroke-linecap="round"/>`;
  const star = (x, y, r = 18, fill = C.yellow, stroke = C.orange) => {
    const p = [];
    for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.45 : r; p.push(`${f(x + rr * Math.cos(a))} ${f(y + rr * Math.sin(a))}`); }
    return `<path d="M${p.join(' L')} Z" fill="${fill}" stroke="${stroke}" stroke-width="2.5" stroke-linejoin="round"/>`;
  };
  // 문서 한 장: 가운데 (x, y)
  const paper = (x, y, label = '', s = 1) => `<rect x="${f(x - 24 * s)}" y="${f(y - 30 * s)}" width="${f(48 * s)}" height="${f(60 * s)}" rx="4" fill="white" stroke="${C.ink}" stroke-width="2.5"/>` +
    (label ? text(x, f(y + 6.5), label, { size: 18 }) : `<path d="M${f(x - 14 * s)} ${f(y - 14 * s)} H${f(x + 14 * s)} M${f(x - 14 * s)} ${f(y)} H${f(x + 14 * s)} M${f(x - 14 * s)} ${f(y + 14 * s)} H${f(x + 6 * s)}" stroke="${C.muted}" stroke-width="2.5" stroke-linecap="round"/>`);
  // 도장: 빨간 동그라미 안 짧은 이름
  const stamp = (x, y, label, r = 26) => `<circle cx="${x}" cy="${y}" r="${r}" fill="white" stroke="${C.red}" stroke-width="3.5"/><circle cx="${x}" cy="${y}" r="${r - 5}" fill="none" stroke="${C.red}" stroke-width="1.5"/>${text(x, f(y + 6.5), label, { size: 18, color: C.red })}`;
  // 투표용지(접은 것): 가운데 (x, y)
  const ballot = (x, y) => `<rect x="${x - 12}" y="${y - 9}" width="24" height="18" rx="2" fill="white" stroke="${C.ink}" stroke-width="2"/><path d="M${x - 12} ${y} H${x + 12}" stroke="${C.line}" stroke-width="2"/>`;
  const ballotBox = (x, top, w = 90, h = 64) => `<rect x="${x - w / 2}" y="${top}" width="${w}" height="${h}" rx="6" fill="${C.sky}" stroke="${C.blue}" stroke-width="3"/><rect x="${x - 20}" y="${top - 3}" width="40" height="7" rx="3" fill="${C.ink}"/>` + text(x, top + h / 2 + 7, '투표함', { size: 18, color: C.blue });
  // 건물(기둥과 세모 지붕): 밑 가운데 (x, y)
  const hall = (x, y, w = 150, h = 90, [fill, stroke] = OLD) => {
    const cols = 4, gap = (w - 30) / (cols - 1);
    let o = `<path d="M${f(x - w / 2 - 10)} ${f(y - h)} L${f(x)} ${f(y - h - 36)} L${f(x + w / 2 + 10)} ${f(y - h)} Z" fill="${fill}" stroke="${stroke}" stroke-width="3" stroke-linejoin="round"/>`;
    o += `<rect x="${f(x - w / 2)}" y="${f(y - h)}" width="${w}" height="${h}" fill="white" stroke="${stroke}" stroke-width="3"/>`;
    for (let i = 0; i < cols; i++) o += `<rect x="${f(x - w / 2 + 9 + i * gap)}" y="${f(y - h + 10)}" width="12" height="${h - 20}" fill="${fill}"/>`;
    return o;
  };

  // 장면마다 같이 쓰는 움직임
  const base = (id) => {
    let s = `
    .sc-${id} .pop, .sc-${id} .pulse, .sc-${id} .ring, .sc-${id} .twk { transform-box: fill-box; transform-origin: center; }
    .sc-${id} .twk { animation: ${id}-twk 1.6s ease-in-out infinite alternate; }
    .sc-${id} .mar { animation: ${id}-mar .7s linear infinite; }
    .sc-${id} .draw { stroke-dasharray: 1; stroke-dashoffset: 1; transition: stroke-dashoffset 1.4s ease-in-out .2s; }
    .sc-${id} .grow { transform-box: fill-box; transform-origin: 0 50%; transform: scaleX(0); transition: transform 1.2s ease-in-out .2s; }
    .sc-${id} .growy { transform-box: fill-box; transform-origin: 50% 100%; transform: scaleY(0); transition: transform 1s ease-out .2s; }
    .sc-${id} .mv { transform: translate(var(--x1), var(--y1)); transition: transform 1.4s ease-in-out, opacity .6s ease; }
    .sc-${id} .dim { transition: opacity .6s ease; }
    .sc-${id} .jig { animation: ${id}-jig 1.3s ease-in-out infinite; }
    .sc-${id} .bob { animation: ${id}-bob 1.4s ease-in-out infinite; }
    .sc-${id} .ring { opacity: 0; }
    @keyframes ${id}-pop { 0% { opacity: 0; transform: scale(.3); } 70% { opacity: 1; transform: scale(1.12); } 100% { opacity: 1; transform: scale(1); } }
    @keyframes ${id}-fin { from { opacity: 0; } to { opacity: 1; } }
    @keyframes ${id}-rise { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
    @keyframes ${id}-drop { from { opacity: 0; transform: translateY(-30px); } to { opacity: 1; transform: none; } }
    @keyframes ${id}-pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }
    @keyframes ${id}-flash { 0% { opacity: 0; } 20% { opacity: 1; } 40% { opacity: .25; } 60% { opacity: 1; } 80% { opacity: .25; } 100% { opacity: 1; } }
    @keyframes ${id}-ring { 0% { opacity: .9; transform: scale(1); } 100% { opacity: 0; transform: scale(1.6); } }
    @keyframes ${id}-twk { from { opacity: .35; } to { opacity: 1; } }
    @keyframes ${id}-mar { from { stroke-dashoffset: 24; } to { stroke-dashoffset: 0; } }
    @keyframes ${id}-jig { 0%, 100% { transform: translate(0, 0); } 25% { transform: translate(3px, -2px); } 50% { transform: translate(-3px, 1.5px); } 75% { transform: translate(2px, 2.5px); } }
    @keyframes ${id}-bob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
    `;
    for (let n = 1; n <= 5; n++) s += `
    .on${n} .sc-${id} .pop${n} { animation: ${id}-pop .5s ease-out both; }
    .on${n} .sc-${id} .fin${n} { animation: ${id}-fin .5s ease-out both; }
    .on${n} .sc-${id} .rise${n} { animation: ${id}-rise .45s ease-out both; }
    .on${n} .sc-${id} .drop${n} { animation: ${id}-drop .5s ease-out both; }
    .on${n} .sc-${id} .pulse${n} { animation: ${id}-pulse .7s ease-in-out .3s 2; }
    .on${n} .sc-${id} .flash${n} { animation: ${id}-flash 1.4s ease-in-out both; }
    .on${n} .sc-${id} .ring${n} { animation: ${id}-ring 1.1s ease-out .3s 2; }
    .on${n} .sc-${id} .draw${n} { stroke-dashoffset: 0; }
    .on${n} .sc-${id} .grow${n}, .on${n} .sc-${id} .growy${n} { transform: none; }
    .on${n} .sc-${id} .dim${n} { opacity: .28; }`;
    for (let n = 2; n <= 5; n++) s += `
    .on${n} .sc-${id} .mv { transform: translate(var(--x${n}), var(--y${n})); }`;
    return s;
  };

  // ════ 7 인간과 사회생활 ════

  // ── 사회화 기관: 평생의 띠 위에 가족·또래 집단·학교·직장·대중 매체 띠가 자란다 ──
  (function () {
    const id = 't72-so-gigwan';
    let css = base(id);
    const AGE = [[120, 0.8, '아기'], [252, 1.0, '어린이'], [390, 1.2, '청소년'], [530, 1.4, '어른']];
    const BAR = [
      // [이름, 시작 x, 끝 x, 색, 칸]
      ['가족', 60, 600, OK, 1],
      ['또래 집단', 186, 460, COLD, 2],
      ['학교', 186, 460, OLD, 2],
      ['직장', 460, 600, HOT, 2],
      ['대중 매체', 60, 600, PLAIN, 3]
    ];
    let body = '';
    [186, 320, 460].forEach((x) => { body += `<path d="M${x} 18 V318" stroke="${C.line}" stroke-width="2" stroke-dasharray="6 6"/>`; });
    body += `<path d="M44 324 H604" stroke="${C.ink}" stroke-width="3"/>` + `<path d="M592 316 L606 324 L592 332" stroke="${C.ink}" stroke-width="3" fill="none" stroke-linejoin="round"/>`;
    AGE.forEach(([x, s, name], i) => {
      body += at(1, 'pop', `<g class="bob" style="animation-delay:${i * 0.3}s">${person(x, 318, [C.orange, C.green, C.blue, C.purple][i], s)}</g>`, 0.2 + i * 0.25);
      body += text(x, 352, name, { size: 18, color: C.muted, weight: 600 });
    });
    BAR.forEach(([name, x0, x1, [fill, stroke], n], i) => {
      const y = 22 + i * 46, d = n === 2 ? (i - 1) * 0.35 : 0;
      body += shown(n, `<g class="grow grow${n}" style="transition-delay:${0.2 + d}s"><rect x="${x0}" y="${y}" width="${x1 - x0}" height="34" rx="17" fill="${fill}" stroke="${stroke}" stroke-width="2.5"/>${text(x0 + 16, y + 24, name, { size: 19, anchor: 'start' })}</g>`);
      body += glowRect(x0 - 3, y - 3, x1 - x0 + 6, 40, 4, stroke === C.muted ? C.ink : stroke, 0.2 + i * 0.2, 20);
    });
    put(KEY('7', '사회화 기관'), svg(id, body, css));
  })();

  // ── 재사회화: 어릴 때 배운 것을 지닌 사람이 어른이 되어 무인 주문기 쓰는 법을 새로 배운다 ──
  (function () {
    const id = 't72-so-jae';
    let css = base(id) + `
      .sc-${id} .grown { transform-box: fill-box; transform-origin: 50% 100%; transition: transform 1.4s ease-in-out .3s; }
      .on2 .sc-${id} .grown { transform: scale(1.45); }
      .sc-${id} .key { animation: none; }
      .on3 .sc-${id} .key { animation: ${id}-flash 1.2s ease-in-out both; }`;
    let body = '';
    // 시간의 띠
    body += `<path d="M40 326 H600" stroke="${C.line}" stroke-width="3"/>`;
    body += text(110, 352, '어릴 때', { size: 18, color: C.muted, weight: 600 });
    body += shown(2, drawn(2, 'M150 326 H596', C.ink, 3) + text(360, 352, '어른이 된 뒤', { size: 18, color: C.muted, weight: 600 }));
    // 사람과 배운 것(사람과 함께 옮겨 간다)
    const learned = ['말', '예절', '지식'];
    let who = `<g class="grown">${person(110, 318, C.green, 1.3)}</g>`;
    learned.forEach((w, i) => { who += at(1, 'pop', tag(110, 216 - i * 44, w, OK), 0.4 + i * 0.3); });
    who += at(3, 'pop', tag(110, 84, '주문하기', HOT), 1.6);
    body += `<g class="b1">${mover([[0, 0], [230, 0]], who)}</g>`;
    // 무인 주문기
    const K = 500;
    let kiosk = `<rect x="${K - 52}" y="130" width="104" height="188" rx="10" fill="white" stroke="${C.blue}" stroke-width="3.5"/><rect x="${K - 40}" y="144" width="80" height="104" rx="4" fill="${C.sky}"/>`;
    kiosk += [0, 1, 2].map((i) => `<rect class="key" style="animation-delay:${0.3 + i * 0.45}s" x="${K - 32}" y="${152 + i * 32}" width="64" height="24" rx="4" fill="white" stroke="${C.blue}" stroke-width="2"/>` + text(K, 171 + i * 32, i + 1, { size: 18, color: C.blue })).join('');
    kiosk += `<rect x="${K - 30}" y="262" width="60" height="10" rx="3" fill="${C.ink}"/>`;
    body += at(2, 'drop', kiosk, 0.2);
    body += at(2, 'pop', text(K, 116, '무인 주문기', { size: 19, color: C.blue }), 0.5);
    // 처음엔 물음표, 배우고 나면 맞음 표
    body += `<g class="b2 h3">${g('pop pop2', `<g class="jig">${qmark(390, 210)}</g>`, 1.4)}</g>`;
    body += at(3, 'pop', `<circle cx="390" cy="210" r="19" fill="white" stroke="${C.green}" stroke-width="3"/>` + check(390, 211, 0.8), 1.4);
    body += shown(3, g('fin fin3', flow([[380, 236], [440, 236]], C.orange, { w: 4 }), 0.3));
    // 4칸: 이름
    body += at(4, 'pop', tag(250, 40, '재사회화', HOT, { size: 24 }));
    body += glowRect(30, 60, 560, 268, 4, C.orange, 0.4, 16);
    put(KEY('7', '재사회화'), svg(id, body, css));
  })();

  // ── 사회적 지위·귀속 지위·성취 지위: 세 집단에서 얻은 세 자리가 한 사람에게 모인다 ──
  const statusFig = (word, id) => {
    let css = base(id);
    const G = [[120, '가정', '첫째 딸', OK], [320, '학교', '학생', COLD], [520, '축구 동아리', '동아리 회원', OLD]];
    const PX = 320, PY = 340, TY = 178;
    const showTags = word === '사회적 지위' ? 2 : 1;
    let body = '';
    body += at(1, 'pop', `<g class="bob">${person(PX, PY, C.green, 1.9)}</g>`);
    G.forEach(([x, gname, tname, col], i) => {
      body += at(1, 'drop', box(x, 52, gname.length > 3 ? 170 : 120, 50, gname, PLAIN, 20), 0.3 + i * 0.25);
      // 집단 → 자리 → 사람
      body += shown(1, drawn(1, `M${x} 78 V${TY} L${PX + (i - 1) * 18} ${PY - 72}`, C.line, 3));
      const focus = word === '귀속 지위' ? i === 0 : word === '성취 지위' ? i > 0 : true;
      const t = at(showTags, 'pop', tag(x, TY, tname, col, { size: 21 }), 0.6 + i * 0.3);
      body += focus ? t : dimFrom(2, t);
      if (word !== '사회적 지위' && focus) {
        const lab = word === '귀속 지위' ? '태어나면서' : '노력해서';
        // 받는 길의 표: 귀속은 선물 상자, 성취는 계단
        const icon = word === '귀속 지위'
          ? `<rect x="${x - 40}" y="106" width="26" height="22" rx="2" fill="${C.peach}" stroke="${C.orange}" stroke-width="2.5"/><path d="M${x - 27} 106 V128 M${x - 40} 116 H${x - 14} M${x - 27} 106 Q${x - 36} 96 ${x - 27} 102 Q${x - 18} 96 ${x - 27} 106" stroke="${C.orange}" stroke-width="2.5" fill="none"/>`
          : `<path d="M${x - 44} 130 H${x - 36} V122 H${x - 28} V114 H${x - 20} V106 H${x - 12}" stroke="${C.purple}" stroke-width="3.5" fill="none" stroke-linejoin="round"/>`;
        body += at(2, 'pop', icon + text(x + 10, 124, lab, { size: 18, anchor: 'start', color: word === '귀속 지위' ? C.orange : C.purple }), 0.3 + i * 0.3);
      }
    });
    const last = 3;
    body += at(last, 'pop', tag(500, 300, word, HOT, { size: 24 }));
    G.forEach(([x], i) => {
      const focus = word === '귀속 지위' ? i === 0 : word === '성취 지위' ? i > 0 : true;
      if (focus) body += glowRect(x - tagW(G[i][2], 21) / 2 - 6, TY - 24, tagW(G[i][2], 21) + 12, 48, last, C.orange, 0.4 + i * 0.2, 24);
    });
    put(KEY('7', word), svg(id, body, css));
  };
  statusFig('사회적 지위', 't72-so-jiwi');
  statusFig('귀속 지위', 't72-so-gwisok');
  statusFig('성취 지위', 't72-so-seongchwi');

  // ── 역할: '학생' 자리에 주변 사람들이 바라는 행동 셋이 모인다 ──
  (function () {
    const id = 't72-so-yeokhal';
    let css = base(id);
    let body = '';
    body += at(1, 'pop', `<g class="bob">${person(120, 330, C.green, 1.9)}</g>`);
    body += at(1, 'pop', tag(120, 210, '학생', COLD, { size: 24 }), 0.4);
    // 주변 사람들
    [[560, 120], [592, 176], [548, 236]].forEach(([x, y], i) => { body += at(2, 'pop', person(x, y + 30, [C.purple, C.orange, C.blue][i], 1.2), i * 0.15); });
    const WANT = ['수업 듣기', '숙제하기', '규칙 지키기'];
    WANT.forEach((w, i) => {
      const y = 82 + i * 92;
      body += at(2, 'pop', tag(350, y, w, OK, { size: 21 }), 0.5 + i * 0.4);
      body += shown(2, g('fin fin2', flow([[510, 150 + (i - 1) * 40], [350 + tagW(w, 21) / 2 + 14, y]], C.muted, { w: 3.5 }), 0.5 + i * 0.4));
      body += shown(2, g('fin fin2', flow([[350 - tagW(w, 21) / 2 - 8, y], [176, 210 + (i - 1) * 8]], C.blue, { w: 3.5 }), 1 + i * 0.4));
    });
    body += at(3, 'pop', tag(350, 330, '역할', HOT, { size: 24 }));
    body += glowRect(240, 52, 220, 240, 3, C.orange, 0.4, 18);
    put(KEY('7', '역할'), svg(id, body, css));
  })();

  // ── 역할 행동: 같은 '학생' 자리, 같은 숙제, 해낸 모습은 다르다 ──
  (function () {
    const id = 't72-so-haengdong';
    let css = base(id);
    let body = '';
    body += at(1, 'pop', tag(320, 42, '숙제하기', OK, { size: 22 }));
    const P = [[150, 1, C.green], [430, 0.5, C.purple]];
    P.forEach(([x, full, col], i) => {
      body += shown(1, g('fin fin1', flow([[320 + (i ? 40 : -40), 64], [x + 10, 160]], C.muted, { w: 3.5 }), 0.4));
      body += at(1, 'pop', person(x, 318, col, 1.8), 0.6 + i * 0.2);
      body += at(1, 'pop', tag(x, 186, '학생', COLD), 0.8 + i * 0.2);
      // 공책과 해낸 만큼의 막대
      const nx = x + 40;
      body += at(1, 'rise', `<rect x="${nx}" y="236" width="128" height="82" rx="6" fill="white" stroke="${C.ink}" stroke-width="2.5"/>` + text(nx + 64, 264, '숙제', { size: 18 }) + `<rect x="${nx + 14}" y="280" width="100" height="20" rx="4" fill="${C.paper}" stroke="${C.line}" stroke-width="2"/>`, 1 + i * 0.2);
      body += shown(2, `<rect class="grow grow2" style="transition-delay:${0.3 + i * 0.6}s" x="${nx + 14}" y="280" width="${100 * full}" height="20" rx="4" fill="${full === 1 ? C.green : C.orange}"/>`);
      body += at(2, 'pop', text(nx + 64, 228, full === 1 ? '다 함' : '절반', { size: 18, color: full === 1 ? C.green : C.orange }), 1.4 + i * 0.4);
    });
    body += at(3, 'pop', `<g class="bob">${star(78, 104, 26)}</g>`, 0.2);
    body += at(3, 'pop', text(78, 158, '칭찬', { size: 20, color: C.orange }), 0.6);
    body += at(4, 'pop', tag(320, 112, '역할 행동', HOT, { size: 24 }));
    body += glowRect(184, 230, 140, 94, 4, C.orange, 0.3, 10);
    body += glowRect(464, 230, 140, 94, 4, C.orange, 0.6, 10);
    put(KEY('7', '역할 행동'), svg(id, body, css));
  })();

  // ── 역할 갈등: 첫째 딸의 가족 여행, 동아리 회원의 공연이 같은 토요일에 부딪친다 ──
  (function () {
    const id = 't72-so-galdeung';
    let css = base(id) + `
      .sc-${id} .spark { transform-box: fill-box; transform-origin: center; animation: ${id}-pulse .8s ease-in-out infinite; }`;
    let body = '';
    body += at(1, 'pop', `<g class="jig">${person(320, 340, C.green, 1.9)}</g>`);
    body += at(1, 'pop', tag(170, 262, '첫째 딸', OK, { size: 21 }), 0.4);
    body += at(1, 'pop', tag(470, 262, '동아리 회원', OLD, { size: 21 }), 0.7);
    // 할 일 카드 두 장
    const card = (cx, label, icon, [fill, stroke]) => box(cx, 160, 168, 60, '', [fill, stroke], 20, 12) + icon + text(cx + 18, 167, label, { size: 20 });
    const suitcase = (x, y) => `<rect x="${x - 15}" y="${y - 10}" width="30" height="22" rx="4" fill="${C.orange}"/><path d="M${x - 6} ${y - 10} V${y - 16} H${x + 6} V${y - 10}" stroke="${C.orange}" stroke-width="3" fill="none"/>`;
    const note = (x, y) => `<ellipse cx="${x - 6}" cy="${y + 9}" rx="7" ry="5.5" fill="${C.purple}"/><path d="M${x + 0.5} ${y + 9} V${y - 15} L${x + 12} ${y - 9}" stroke="${C.purple}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`;
    const L = card(130, '가족 여행', suitcase(68, 160), HOT), R = card(510, '동아리 공연', note(440, 160), OLD);
    body += `<g class="b2">${mover([[0, 0], [0, 0], [92, 0]], g('drop drop2', L, 0.2))}</g>`;
    body += `<g class="b2">${mover([[0, 0], [0, 0], [-92, 0]], g('drop drop2', R, 0.5))}</g>`;
    body += `<g class="b2 h3">${g('fin fin2', flow([[170, 240], [140, 196]], C.green, { w: 4 }), 0.8)}${g('fin fin2', flow([[470, 240], [500, 196]], C.purple, { w: 4 }), 1.1)}</g>`;
    // 달력: 같은 토요일
    body += at(3, 'drop', box(320, 58, 140, 64, '', ['white', C.red], 20, 8) + `<rect x="250" y="26" width="140" height="18" rx="6" fill="${C.red}"/>` + text(320, 76, '토요일', { size: 22 }), 0);
    body += shown(3, drawn(3, 'M272 92 L232 128 M368 92 L408 128', C.red, 3));
    body += at(3, 'pop', `<g class="spark">${star(320, 160, 22, C.yellow, C.red)}</g>`, 1.2);
    body += at(3, 'pop', `<g class="jig">${qmark(368, 280)}</g>`, 1.4);
    body += at(4, 'pop', tag(320, 222, '역할 갈등', HOT, { size: 24 }));
    body += glowRect(132, 124, 376, 72, 4, C.red, 0.4, 14);
    put(KEY('7', '역할 갈등'), svg(id, body, css));
  })();

  // ════ 8 다양한 문화의 이해 ════

  // 숟가락과 젓가락: 가운데 (x, y)
  const spoonSticks = (x, y, s = 1) => `<ellipse cx="${f(x - 8 * s)}" cy="${f(y - 9 * s)}" rx="${f(5.5 * s)}" ry="${f(7.5 * s)}" fill="${C.orange}"/><path d="M${f(x - 8 * s)} ${f(y - 2 * s)} V${f(y + 16 * s)} M${f(x + 4 * s)} ${f(y - 16 * s)} L${f(x + 6 * s)} ${f(y + 16 * s)} M${f(x + 11 * s)} ${f(y - 16 * s)} L${f(x + 11 * s)} ${f(y + 16 * s)}" stroke="${C.orange}" stroke-width="${f(3 * s)}" stroke-linecap="round"/>`;

  // ── 공유성: 한 사회의 사람들이 모두 같은 숟가락·젓가락을 지닌다 ──
  (function () {
    const id = 't72-so-gongyu';
    let css = base(id);
    const P = [[150, 300], [240, 236], [330, 306], [420, 236], [510, 300]];
    let body = '';
    body += at(1, 'fin', `<rect x="56" y="84" width="528" height="252" rx="40" fill="${C.mint}" fill-opacity=".45" stroke="${C.green}" stroke-width="3" stroke-dasharray="10 8"/>` + text(100, 118, '한 사회', { size: 20, color: C.green, anchor: 'start' }));
    P.forEach(([x, y], i) => { body += at(1, 'pop', person(x, y, [C.green, C.blue, C.purple, C.orange, C.green][i], 1.4), 0.3 + i * 0.15); });
    P.forEach(([x, y], i) => { body += at(2, 'pop', `<circle cx="${x}" cy="${y - 84}" r="22" fill="white" stroke="${C.orange}" stroke-width="2.5"/>` + spoonSticks(x, y - 84, 0.85), 0.2 + i * 0.25); });
    // 3칸: 서로 이어진다
    const lines = P.slice(0, -1).map(([x, y], i) => `M${x + 22} ${y - 84} L${P[i + 1][0] - 22} ${P[i + 1][1] - 84}`).join(' ');
    body += shown(3, drawn(3, lines, C.orange, 4, ' stroke-dasharray="1"'));
    P.forEach(([x, y], i) => { body += ring(x, y - 84, 22, 3, C.orange, 0.8 + i * 0.15); });
    body += at(4, 'pop', tag(320, 44, '공유성', HOT, { size: 24 }));
    body += glowRect(56, 84, 528, 252, 4, C.orange, 0.3, 40);
    put(KEY('8', '공유성'), svg(id, body, css));
  })();

  // ── 학습성: 아기가 어른을 보고 따라 하며 젓가락질을 익혀 자란다 ──
  (function () {
    const id = 't72-so-hakseup';
    let css = base(id) + `
      .sc-${id} .kid { transform-box: fill-box; transform-origin: 50% 100%; transition: transform 1.6s ease-in-out .3s; }
      .on3 .sc-${id} .kid { transform: scale(1.8); }
      .sc-${id} .try { opacity: 0; transition: opacity .8s ease .6s; }
      .on2 .sc-${id} .try { opacity: .45; }
      .on3 .sc-${id} .try { opacity: 1; }`;
    let body = '';
    body += `<path d="M40 322 H600" stroke="${C.line}" stroke-width="3"/>`;
    // 어른과 밥그릇
    body += at(1, 'pop', person(450, 320, C.purple, 2.1) + `<g transform="rotate(-20 492 254)">${spoonSticks(492, 254, 1.1)}</g>`, 0.2);
    body += at(1, 'pop', `<path d="M506 290 H566 Q566 318 536 318 Q506 318 506 290 Z" fill="white" stroke="${C.ink}" stroke-width="2.5"/>`, 0.4);
    // 아기(자라면 커진다)
    body += `<g class="b1"><g class="kid">${person(190, 320, C.green, 1)}<g class="try">${spoonSticks(212, 296, 0.6)}</g></g></g>`;
    body += at(1, 'pop', `<path d="M224 306 H262 Q262 320 243 320 Q224 320 224 306 Z" fill="white" stroke="${C.ink}" stroke-width="2.5"/>`, 0.6);
    body += `<g class="b1 h3">${g('pop pop1', `<g class="jig">${qmark(190, 250)}</g>`, 0.8)}</g>`;
    body += `<g class="b1 h3">${text(190, 352, '갓 태어남', { size: 18, color: C.muted, weight: 600 })}</g>`;
    // 2칸: 보고 따라 하는 눈길
    body += `<g class="b2 h3">${g('fin fin2', flow([[204, 290], [330, 230], [470, 248]], C.blue, { w: 4 }), 0.2)}</g>`;
    body += `<g class="b2 h3">${g('pop pop2', text(330, 210, '보고 따라 하기', { size: 19, color: C.blue }), 0.5)}</g>`;
    // 3칸: 몸에 붙음
    body += at(3, 'pop', `<circle cx="196" cy="228" r="20" fill="white" stroke="${C.green}" stroke-width="3"/>` + check(196, 229, 0.8), 1.6);
    body += shown(3, text(190, 352, '자라면서', { size: 18, color: C.muted, weight: 600 }));
    body += at(4, 'pop', tag(320, 48, '학습성', HOT, { size: 24 }));
    body += glowRect(130, 160, 160, 170, 4, C.orange, 0.3, 16);
    put(KEY('8', '학습성'), svg(id, body, css));
  })();

  // ── 축적성: 세대마다 물려받은 블록 위에 새 블록을 쌓는다 ──
  (function () {
    const id = 't72-so-chukjeok';
    let css = base(id);
    const GEN = [['할머니 세대', OK, C.green], ['부모 세대', COLD, C.blue], ['우리 세대', HOT, C.orange]];
    const TX = 410, TW = 230, BH = 58, GY = 326;
    let body = '';
    body += `<path d="M40 ${GY} H600" stroke="${C.ink}" stroke-width="3"/>`;
    GEN.forEach(([name, [fill, stroke], col], i) => {
      const n = i + 1, px = 70 + i * 86, y = GY - (i + 1) * BH;
      body += at(n, 'pop', person(px, GY, col, 1.5 - i * 0.12), 0);
      body += at(n, 'drop', `<rect x="${TX - TW / 2}" y="${y}" width="${TW}" height="${BH}" rx="8" fill="${fill}" stroke="${stroke}" stroke-width="3"/>` + text(TX, y + 37, name, { size: 21 }) + (i ? `<circle cx="${TX + TW / 2 - 24}" cy="${y + 29}" r="13" fill="white" stroke="${stroke}" stroke-width="2.5"/>` + text(TX + TW / 2 - 24, y + 36, '+', { size: 22, color: stroke }) : ''), 0.4);
      // 앞 세대가 다음 세대에 물려줌
      if (i) body += shown(n, g('fin fin' + n, flowQ([px - 76, GY - 60], [px - 43, GY - 108], [px - 10, GY - 64], C.orange, { w: 3.5 }), 0.9));
    });
    // 4칸: 다음 세대로
    body += shown(4, g('fin fin4', flow([[TX + TW / 2 + 40, GY - 20], [TX + TW / 2 + 40, 96]], C.orange, { w: 5 }), 0.2));
    body += at(4, 'pop', tag(TX, 64, '축적성', HOT, { size: 24 }), 0.4);
    body += glowRect(TX - TW / 2 - 6, GY - 3 * BH - 6, TW + 12, 3 * BH + 10, 4, C.orange, 0.6, 12);
    put(KEY('8', '축적성'), svg(id, body, css));
  })();

  // ── 변동성: 편지 → 집 전화 → 휴대 전화, 시간이 흐르며 바뀐다 ──
  (function () {
    const id = 't72-so-byeondong';
    let css = base(id);
    const X = [120, 320, 520], Y = 186;
    const envelope = (x, y) => `<rect x="${x - 50}" y="${y - 34}" width="100" height="68" rx="6" fill="white" stroke="${C.purple}" stroke-width="3.5"/><path d="M${x - 50} ${y - 30} L${x} ${y + 6} L${x + 50} ${y - 30}" stroke="${C.purple}" stroke-width="3.5" fill="none" stroke-linejoin="round"/>`;
    const phone = (x, y) => `<rect x="${x - 46}" y="${y - 6}" width="92" height="48" rx="10" fill="${C.sky}" stroke="${C.blue}" stroke-width="3.5"/><path d="M${x - 54} ${y - 14} Q${x - 54} ${y - 40} ${x} ${y - 40} Q${x + 54} ${y - 40} ${x + 54} ${y - 14} L${x + 34} ${y - 10} L${x + 30} ${y - 22} Q${x} ${y - 28} ${x - 30} ${y - 22} L${x - 34} ${y - 10} Z" fill="${C.blue}"/>` +
      [-1, 0, 1].map((k) => `<circle cx="${x + k * 20}" cy="${y + 18}" r="5" fill="white"/>`).join('');
    const mobile = (x, y) => `<rect x="${x - 30}" y="${y - 50}" width="60" height="100" rx="10" fill="white" stroke="${C.green}" stroke-width="3.5"/><rect x="${x - 22}" y="${y - 38}" width="44" height="66" rx="3" fill="${C.mint}"/><circle cx="${x}" cy="${y + 40}" r="4" fill="${C.green}"/>` +
      `<rect x="${x - 16}" y="${y - 30}" width="24" height="10" rx="5" fill="${C.green}"/><rect x="${x - 8}" y="${y - 14}" width="24" height="10" rx="5" fill="white" stroke="${C.green}" stroke-width="1.5"/>`;
    const ICON = [envelope, phone, mobile], NAME = ['편지', '집 전화', '휴대 전화'], WHEN = ['옛날', '얼마 전', '오늘날'];
    let body = '';
    body += `<path d="M40 286 H596" stroke="${C.ink}" stroke-width="3"/><path d="M584 278 L598 286 L584 294" stroke="${C.ink}" stroke-width="3" fill="none" stroke-linejoin="round"/>`;
    X.forEach((x, i) => {
      const n = i + 1;
      const inner = at(n, 'pop', ICON[i](x, Y) + text(x, Y + 74, NAME[i], { size: 21 }), 0.2);
      body += i < 2 ? dimFrom(n + 1, inner) : inner;
      body += shown(n, `<path d="M${x} 278 V294" stroke="${C.ink}" stroke-width="3"/>` + text(x, 322, WHEN[i], { size: 18, color: C.muted, weight: 600 }));
    });
    // 지금을 가리키는 점
    body += `<g class="b1">${mover([[0, 0], [200, 0], [400, 0]], `<circle cx="120" cy="286" r="11" fill="${C.orange}" stroke="white" stroke-width="3"/>`)}</g>`;
    body += shown(2, g('fin fin2', flow([[176, 150], [262, 150]], C.orange, { w: 4 }), 0.6));
    body += shown(3, g('fin fin3', flow([[376, 150], [474, 150]], C.orange, { w: 4 }), 0.6));
    body += at(4, 'pop', tag(320, 48, '변동성', HOT, { size: 24 }));
    body += shown(4, g('fin fin4', `<path class="mar" d="M44 286 H580" stroke="${C.orange}" stroke-width="5" stroke-dasharray="14 10" fill="none"/>`, 0.3));
    put(KEY('8', '변동성'), svg(id, body, css));
  })();

  // ── 전체성: 서로 이어진 생활의 다섯 부분, 기술 하나가 바뀌자 나머지도 바뀐다 ──
  (function () {
    const id = 't72-so-jeonche';
    let css = base(id) + `
      .sc-${id} .chg { opacity: 0; transition: opacity .8s ease; }
      .on3 .sc-${id} .chg { opacity: 1; }
      .on2 .sc-${id} .chg0 { opacity: 1; }`;
    const NAME = ['기술', '대화', '물건 사기', '공부', '놀이'];
    const CX = 320, CY = 192, RX = 200, RY = 128;
    const P = NAME.map((_, k) => { const a = -Math.PI / 2 + k * 2 * Math.PI / 5; return [f(CX + RX * Math.cos(a)), f(CY + RY * Math.sin(a))]; });
    let body = '';
    // 서로 이어진 선(열 개)
    let d = '';
    for (let a = 0; a < 5; a++) for (let b = a + 1; b < 5; b++) d += `M${P[a][0]} ${P[a][1]} L${P[b][0]} ${P[b][1]} `;
    body += shown(1, drawn(1, d, C.line, 3));
    // 3칸: 기술에서 나머지로 퍼지는 물결
    for (let b = 1; b < 5; b++) body += shown(3, g('fin fin3', flow([P[0], [P[b][0] - (P[b][0] - P[0][0]) * 0.22, P[b][1] - (P[b][1] - P[0][1]) * 0.22]], C.orange, { w: 4.5 }), 0.1 + b * 0.25));
    P.forEach(([x, y], k) => {
      const w = 124, h = 50;
      let node = box(x, y, w, h, '', ['white', C.green], 20, 25);
      node += `<rect class="chg${k ? '' : ' chg0'}" style="transition-delay:${k ? 0.5 + k * 0.3 : 0.3}s" x="${f(x - w / 2)}" y="${f(y - h / 2)}" width="${w}" height="${h}" rx="25" fill="${C.peach}" stroke="${C.orange}" stroke-width="3"/>`;
      node += text(x, f(y + 7), NAME[k], { size: 20 });
      body += at(1, 'pop', `<g class="${k ? 'pulse3' : 'pulse2'} pulse">${node}</g>`, 0.3 + k * 0.15);
    });
    // 4칸 테두리가 꼬리표 자리를 지나므로 4칸에서는 꼬리표와 화살표를 감춘다
    body += `<g class="h4">${at(2, 'drop', tag(500, 40, '휴대 전화', HOT, { size: 20 }), 0.1)}</g>`;
    body += `<g class="h4">${shown(2, g('fin fin2', flow([[446, 44], [392, 60]], C.orange, { w: 4 }), 0.5))}</g>`;
    body += at(4, 'pop', tag(CX, CY + 10, '전체성', HOT, { size: 24 }));
    body += glowRect(CX - RX - 70, CY - RY - 32, 2 * RX + 140, 2 * RY + 64, 4, C.orange, 0.4, 30);
    put(KEY('8', '전체성'), svg(id, body, css));
  })();

  // ── 문화를 보는 태도 셋: 두 문화 카드의 받침 높이로 ──
  const attitudeFig = (word, id) => {
    const mode = word === '자문화 중심주의' ? 'self' : word === '문화 사대주의' ? 'other' : 'rel';
    const GY = 300, PH = 60, CB = GY - PH; // 받침 위 = 카드 밑
    const UP = 64, DN = 46;
    // 오르내림: [우리 문화 dy, 다른 문화 dy]를 칸마다
    const plan = mode === 'self' ? [[0, 0], [-UP, 0], [-UP, DN]] : mode === 'other' ? [[0, 0], [0, -UP], [DN, -UP]] : [[0, 0]];
    let css = base(id);
    const scaleOf = (dy) => f((PH - dy) / PH);
    [0, 1].forEach((side) => {
      plan.forEach((p, k) => {
        if (!k) return;
        const n = k + 1;
        css += `
      .on${n} .sc-${id} .lift${side} { transform: translateY(${p[side]}px); }
      .on${n} .sc-${id} .ped${side} { transform: scaleY(${scaleOf(p[side])}); }`;
      });
    });
    css += `
      .sc-${id} .lift0, .sc-${id} .lift1 { transition: transform 1.4s ease-in-out .3s; }
      .sc-${id} .ped0, .sc-${id} .ped1 { transform-box: fill-box; transform-origin: 50% 100%; transition: transform 1.4s ease-in-out .3s; }`;
    const X = [180, 460];
    const motif = (x, side) => side === 0
      ? [-36, 0, 36].map((d) => `<circle cx="${x + d}" cy="${CB - 66}" r="13" fill="${C.green}"/>`).join('')
      : [-36, 0, 36].map((d) => `<path d="M${x + d} ${CB - 80} L${x + d + 14} ${CB - 54} L${x + d - 14} ${CB - 54} Z" fill="${C.blue}"/>`).join('');
    let body = '';
    body += `<path d="M30 ${GY} H610" stroke="${C.ink}" stroke-width="3"/>`;
    X.forEach((x, side) => {
      const [fill, stroke] = side ? COLD : OK;
      body += at(1, 'rise', `<rect class="ped${side}" x="${x - 34}" y="${CB}" width="68" height="${PH}" fill="${C.line}" stroke="${C.muted}" stroke-width="2"/>`, side * 0.3);
      const cardG = `<rect x="${x - 82}" y="${CB - 116}" width="164" height="116" rx="12" fill="${fill}" stroke="${stroke}" stroke-width="3"/>` + motif(x, side) + text(x, CB - 18, side ? '다른 문화' : '우리 문화', { size: 21 });
      body += `<g class="b1"><g class="lift${side}">${g('pop pop1', cardG, side * 0.3)}` +
        // 높이 올린 쪽의 별, 낮춘 쪽의 내림 화살표
        (mode === 'self' && side === 0 || mode === 'other' && side === 1 ? at(2, 'pop', `<g class="bob">${star(x, CB - 140, 22)}</g>`, 1.4) : '') +
        (mode === 'self' && side === 1 || mode === 'other' && side === 0 ? at(3, 'pop', flow([[x + 104, CB - 100], [x + 104, CB - 20]], C.red, { w: 5 }), 1.4) : '') +
        `</g></g>`;
    });
    if (mode === 'rel') {
      // 각 문화 밑의 뿌리: 자연환경·역사
      X.forEach((x, side) => {
        body += shown(2, drawn(2, `M${x - 20} ${GY} Q${x - 30} ${GY + 18} ${x - 60} ${GY + 26} M${x + 20} ${GY} Q${x + 30} ${GY + 18} ${x + 60} ${GY + 26}`, C.orange, 3));
        body += at(2, 'pop', tag(x - 70, GY + 36, '자연환경', HOT, { size: 18 }), 0.6 + side * 0.4);
        body += at(2, 'pop', tag(x + 58, GY + 36, '역사', HOT, { size: 18 }), 0.8 + side * 0.4);
      });
      // 3칸: 높낮이 없이 나란함
      body += shown(3, drawn(3, `M${X[0] + 90} ${CB - 58} H${X[1] - 90}`, C.orange, 4, ' stroke-dasharray="1"'));
      body += at(3, 'pop', text(320, CB - 70, '=', { size: 40, color: C.orange }), 0.8);
      body += glowRect(X[0] - 88, CB - 122, 176, 128, 3, C.green, 1.2, 14);
      body += glowRect(X[1] - 88, CB - 122, 176, 128, 3, C.blue, 1.2, 14);
    }
    body += at(4, 'pop', tag(320, 40, word, HOT, { size: 24 }));
    put(KEY('8', word), svg(id, body, css));
  };
  attitudeFig('자문화 중심주의', 't72-so-jamun');
  attitudeFig('문화 사대주의', 't72-so-sadae');
  attitudeFig('문화 상대주의', 't72-so-sangdae');

  // ════ 9 민주주의와 시민 ════

  // ── 직접 민주주의: 흩어진 국민이 한자리에 모여 손을 들어 정한다 ──
  (function () {
    const id = 't72-so-jikjeop';
    let css = base(id);
    const CX = 300, CY = 258;
    const seat = [...[180, 228, 276, 324, 372, 420].map((x) => [x, 230]), ...[150, 210, 270, 330, 390, 450].map((x) => [x, 296])];
    const scatter = [[40, 120], [130, 60], [250, 40], [380, 70], [480, 40], [600, 110], [44, 330], [150, 250], [360, 350], [470, 200], [600, 300], [250, 160]];
    let body = '';
    body += at(1, 'fin', `<ellipse cx="${CX}" cy="${CY}" rx="206" ry="76" fill="${C.mint}" fill-opacity=".5" stroke="${C.green}" stroke-width="3" stroke-dasharray="10 8"/>`);
    body += at(1, 'fin', text(CX, CY + 66, '한자리', { size: 18, color: C.green }), 0.3);
    seat.map((p, k) => [p, k]).sort((a, b) => a[0][1] - b[0][1]).forEach(([[x, y], k]) => {
      const [sx, sy] = scatter[k];
      const col = [C.green, C.blue, C.purple, C.orange][k % 4];
      const hand = at(3, 'pop', `<path d="M${x + 9} ${y - 22} L${x + 15} ${y - 46}" stroke="${col}" stroke-width="5" stroke-linecap="round"/><circle cx="${x + 15}" cy="${y - 49}" r="5" fill="${col}"/>`, 0.1 + k * 0.08);
      body += `<g class="b1">${mover([[sx - x, sy - y], [0, 0]], person(x, y, col, 1.1) + hand, k * 0.05)}</g>`;
    });
    // 3칸: 모인 뜻이 그대로 결정으로
    body += shown(3, g('fin fin3', flow([[500, 236], [548, 168]], C.red, { w: 5 }), 1.2));
    body += at(3, 'drop', stamp(576, 128, '결정', 34), 1.5);
    body += at(4, 'pop', tag(220, 44, '직접 민주주의', HOT, { size: 24 }));
    body += glowRect(CX - 212, CY - 78, 424, 156, 4, C.orange, 0.4, 70);
    put(KEY('9', '직접 민주주의'), svg(id, body, css));
  })();

  // ── 간접 민주주의: 국민이 뽑은 대표가 의회에서 대신 정한다 ──
  (function () {
    const id = 't72-so-ganjeop';
    let css = base(id);
    let body = '';
    const P = [];
    for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) P.push([52 + c * 50 + (r % 2) * 20, 130 + r * 82]);
    P.forEach(([x, y], k) => { body += at(1, 'pop', person(x, y, [C.green, C.blue, C.purple, C.orange][k % 4], 1.15), k * 0.06); });
    body += at(1, 'fin', text(140, 330, '국민', { size: 20, color: C.muted }), 0.5);
    // 2칸: 표가 투표함으로
    body += at(2, 'pop', ballotBox(330, 200), 0);
    [[100, 80], [180, 160], [120, 240]].forEach(([x, y], k) => {
      body += `<g class="b2 h3">${mover([[x - 330, y - 196], [0, 0]], g('fin fin2', ballot(330, 196), 0), 0.3 + k * 0.25)}</g>`;
    });
    // 대표 셋과 의회
    body += at(2, 'rise', hall(530, 300, 150, 110, OLD), 0.8);
    body += at(2, 'pop', text(530, 146, '의회', { size: 20, color: C.purple }), 1);
    [-42, 0, 42].forEach((d, k) => { body += at(2, 'pop', person(530 + d, 296, [C.green, C.blue, C.orange][k], 1.6, { tie: true }), 1.2 + k * 0.2); });
    body += shown(2, g('fin fin2', flow([[380, 232], [440, 232]], C.blue, { w: 5 }), 1));
    body += at(2, 'pop', text(410, 214, '대표', { size: 18, color: C.blue }), 1.4);
    // 3칸: 대표가 의논해 결정
    body += at(3, 'pop', `<g class="jig">${tag(486, 96, '의논', PLAIN, { size: 18 })}</g>`, 0.2);
    body += at(3, 'drop', stamp(584, 96, '결정', 30), 0.9);
    body += at(4, 'pop', tag(200, 40, '간접 민주주의', HOT, { size: 24 }));
    body += glowRect(446, 156, 168, 152, 4, C.orange, 0.4, 14);
    put(KEY('9', '간접 민주주의'), svg(id, body, css));
  })();
})(typeof window !== 'undefined' ? window : globalThis);
