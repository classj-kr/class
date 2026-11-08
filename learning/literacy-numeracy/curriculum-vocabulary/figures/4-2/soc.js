// 사회 4-2 낱말 도식: 지역문제 해결 과정(원인·출처·분석·장단점), 환경과 개발(기후·광역시·생태계·간척·생태 통로),
// 도시(인구·수도권·계획 도시·신도시)를 코드로 그린다.
// 지도(광역시·수도권)는 국내 지도 앱의 실제 경계(learning/inquiry/korea-map/data/provinces-topo.json, regions.js 북한 도 경계)를
// 아래 JN·SD 화면 좌표로 옮겨 줄이고 화면 밖을 잘라 낸 것이다(2018년 시·도 경계).
// 수치: 분석의 15·10·8명은 미래엔 65쪽 주민 면담 조사, 인구의 약 11만·38만 명은 동아 126쪽 세종특별자치시. 기후 막대·선은 모양만 보이는 예시다.
(function (root) {
  'use strict';
  const { C, svg, text, put } = root.FigureKit;
  const f = (n) => +(+n).toFixed(1);
  const dl = (s) => (s ? ` style="animation-delay:${s}s"` : '');
  const g = (cls, inner, s = 0) => `<g class="${cls}"${dl(s)}>${inner}</g>`;
  // 칸 n 에 나타나며 kind(pop·fin·rise·drop) 움직임을 한 번 한다
  const at = (n, kind, inner, s = 0) => `<g class="b${n}">${g(`${kind} ${kind}${n}`, inner, s)}</g>`;
  // 칸 n 부터 보이고, hide 칸부터 사라진다
  const shown = (n, inner, hide) => `<g class="b${n}${hide ? ' h' + hide : ''}">${inner}</g>`;
  const seeded = (seed) => () => (seed = (seed * 16807) % 2147483647) / 2147483647;

  // 글자 폭 어림(맑은 고딕 굵게: 한글 1em, 숫자 .6em, 빈칸 .3em)
  const tw = (s, size) => [...String(s)].reduce((a, c) => a + (/[가-힣]/.test(c) ? 1 : c === ' ' ? 0.3 : 0.6), 0) * size;
  const HOT = [C.peach, C.orange], COLD = [C.sky, C.blue], OK = [C.mint, C.green], OLD = [C.lilac, C.purple], PLAIN = ['white', C.muted];
  const tag = (cx, cy, label, [fill, stroke] = OK, { size = 20 } = {}) => {
    const w = Math.round(tw(label, size) + size * 1.3), h = Math.round(size * 1.7);
    return `<g><rect x="${f(cx - w / 2)}" y="${f(cy - h / 2)}" width="${w}" height="${h}" rx="${h / 2}" fill="${fill}" stroke="${stroke}" stroke-width="2.5"/>${text(f(cx), f(cy + size * 0.36), label, { size })}</g>`;
  };
  const tagW = (label, size = 20) => Math.round(tw(label, size) + size * 1.3);
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
  const glowRect = (x, y, w, h, n, color = C.green, delay = 0, rx = 12) =>
    `<g class="b${n}"><rect class="flash flash${n}"${dl(delay)} x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="${rx}" fill="none" stroke="${color}" stroke-width="5"/></g>`;
  const glowPath = (d, n, color = C.green, delay = 0, w = 5) => `<g class="b${n}"><path class="flash flash${n}"${dl(delay)} d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linejoin="round"/></g>`;
  const ring = (cx, cy, r, n, color = C.green, s = 0) => `<g class="b${n}"><circle class="ring ring${n}"${dl(s)} cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${color}" stroke-width="4"/></g>`;
  // 칸마다 자리를 옮기는 것: pts = [[x,y] (1칸), [x,y] (2칸) …], 빈 칸은 앞 칸 자리를 그대로 쓴다
  const mvStyle = (pts, extra = '') => {
    const out = [];
    for (let n = 1; n <= 5; n++) { const p = pts[Math.min(n, pts.length) - 1]; out.push(`--x${n}:${f(p[0])}px;--y${n}:${f(p[1])}px`); }
    return out.join(';') + (extra ? ';' + extra : '');
  };
  // 사람 아이콘: (x, y) 는 발밑 가운데
  const person = (x, y, color = C.green, s = 1) => `<circle cx="${f(x)}" cy="${f(y - 27 * s)}" r="${f(7.5 * s)}" fill="${color}"/><path d="M${f(x - 11 * s)} ${f(y)} V${f(y - 9 * s)} Q${f(x - 11 * s)} ${f(y - 18 * s)} ${f(x)} ${f(y - 18 * s)} Q${f(x + 11 * s)} ${f(y - 18 * s)} ${f(x + 11 * s)} ${f(y - 9 * s)} V${f(y)} Z" fill="${color}"/>`;
  const tree = (x, y, r = 18) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${C.green}"/><circle cx="${f(x - r * 0.3)}" cy="${f(y - r * 0.3)}" r="${f(r * 0.38)}" fill="${C.mint}" opacity=".55"/>`;

  // 장면마다 같이 쓰는 움직임
  const base = (id) => {
    let s = `
    .sc-${id} .pop, .sc-${id} .pulse, .sc-${id} .ring, .sc-${id} .spin { transform-box: fill-box; transform-origin: center; }
    .sc-${id} .twk { animation: ${id}-twk 1.6s ease-in-out infinite alternate; }
    .sc-${id} .mar { animation: ${id}-mar .7s linear infinite; }
    .sc-${id} .draw { stroke-dasharray: 1; stroke-dashoffset: 1; transition: stroke-dashoffset 1.6s ease-in-out .2s; }
    .sc-${id} .grow { transform-box: fill-box; transform-origin: 0 50%; transform: scaleX(0); transition: transform 1.2s ease-in-out; }
    .sc-${id} .growy { transform-box: fill-box; transform-origin: 50% 100%; transform: scaleY(0); transition: transform 1s ease-out .2s; }
    .sc-${id} .mv { transform: translate(var(--x1), var(--y1)); transition: transform 1.4s ease-in-out, opacity .6s ease; }
    .sc-${id} .sway { animation: ${id}-sway 3.2s ease-in-out infinite; }
    .sc-${id} .jig { animation: ${id}-jig 1.3s ease-in-out infinite; }
    .sc-${id} .spin { animation: ${id}-spin 9s linear infinite; }
    .sc-${id} .up { animation: ${id}-up 2s ease-in infinite; }
    .sc-${id} .fall { animation: ${id}-fall 1.6s ease-in infinite; }
    .sc-${id} .ring { opacity: 0; }
    @keyframes ${id}-pop { 0% { opacity: 0; transform: scale(.3); } 70% { opacity: 1; transform: scale(1.12); } 100% { opacity: 1; transform: scale(1); } }
    @keyframes ${id}-fin { from { opacity: 0; } to { opacity: 1; } }
    @keyframes ${id}-rise { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
    @keyframes ${id}-drop { from { opacity: 0; transform: translateY(-40px); } to { opacity: 1; transform: none; } }
    @keyframes ${id}-pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }
    @keyframes ${id}-flash { 0% { opacity: 0; } 20% { opacity: 1; } 40% { opacity: .25; } 60% { opacity: 1; } 80% { opacity: .25; } 100% { opacity: 1; } }
    @keyframes ${id}-ring { 0% { opacity: .9; transform: scale(1); } 100% { opacity: 0; transform: scale(1.6); } }
    @keyframes ${id}-twk { from { opacity: .35; } to { opacity: 1; } }
    @keyframes ${id}-mar { from { stroke-dashoffset: 24; } to { stroke-dashoffset: 0; } }
    @keyframes ${id}-sway { 0%, 100% { transform: translateX(-12px); } 50% { transform: translateX(12px); } }
    @keyframes ${id}-jig { 0%, 100% { transform: translate(0, 0); } 25% { transform: translate(2.5px, -2px); } 50% { transform: translate(-2px, 1.5px); } 75% { transform: translate(1.5px, 2.5px); } }
    @keyframes ${id}-spin { to { transform: rotate(360deg); } }
    @keyframes ${id}-up { 0% { opacity: 0; transform: translateY(0); } 25%, 70% { opacity: 1; } 100% { opacity: 0; transform: translateY(var(--up, -40px)); } }
    @keyframes ${id}-fall { 0% { opacity: 0; transform: translateY(0); } 15%, 75% { opacity: 1; } 100% { opacity: 0; transform: translateY(var(--fall, 30px)); } }
    `;
    for (let n = 1; n <= 5; n++) s += `
    .on${n} .sc-${id} .pop${n} { animation: ${id}-pop .5s ease-out both; }
    .on${n} .sc-${id} .fin${n} { animation: ${id}-fin .5s ease-out both; }
    .on${n} .sc-${id} .rise${n} { animation: ${id}-rise .45s ease-out both; }
    .on${n} .sc-${id} .drop${n} { animation: ${id}-drop .6s ease-out both; }
    .on${n} .sc-${id} .pulse${n} { animation: ${id}-pulse .7s ease-in-out .3s 2; }
    .on${n} .sc-${id} .flash${n} { animation: ${id}-flash 1.4s ease-in-out both; }
    .on${n} .sc-${id} .ring${n} { animation: ${id}-ring 1.1s ease-out .3s 2; }
    .on${n} .sc-${id} .draw${n} { stroke-dashoffset: 0; }
    .on${n} .sc-${id} .grow${n} { transform: scaleX(1); }
    .on${n} .sc-${id} .growy${n} { transform: scaleY(1); }`;
    for (let n = 2; n <= 5; n++) s += `
    .on${n} .sc-${id} .mv { transform: translate(var(--x${n}), var(--y${n})); }`;
    return s;
  };

  // ════ 2-1 우리가 해결하는 지역문제 ════

  // 일회용 플라스틱 쓰레기 조각(가운데가 0 0)
  const cup = (fill = C.sky, stroke = C.blue) => `<rect x="-14" y="-20" width="28" height="6" rx="2" fill="${fill}" stroke="${stroke}" stroke-width="2.5"/><path d="M-11 -14 H11 L8 16 H-8 Z" fill="${fill}" stroke="${stroke}" stroke-width="2.5" stroke-linejoin="round"/>`;
  const bottle = () => `<path d="M-5 -22 H5 V-15 Q11 -11 11 -4 V18 H-11 V-4 Q-11 -11 -5 -15 Z" fill="white" stroke="${C.blue}" stroke-width="2.5" stroke-linejoin="round"/><rect x="-11" y="0" width="22" height="7" fill="${C.sky}"/>`;
  const box = () => `<rect x="-19" y="-10" width="38" height="20" rx="3" fill="white" stroke="${C.muted}" stroke-width="2.5"/><path d="M-19 -3 H19" stroke="${C.muted}" stroke-width="2"/>`;
  const bag = () => `<path d="M-14 -8 Q-16 16 0 16 Q16 16 14 -8 Z M-8 -8 Q-8 -20 0 -20 Q8 -20 8 -8" fill="${C.lilac}" stroke="${C.purple}" stroke-width="2.5" stroke-linejoin="round"/>`;
  const place = (x, y, r, inner) => `<g transform="translate(${f(x)} ${f(y)}) rotate(${r})">${inner}</g>`;

  // ── 원인: 결과(쓰레기가 늘어남) 쪽으로 까닭 둘이 화살표로 이어진다 ──
  (function () {
    const id = 't42-s21-wonin';
    let css = base(id);
    const BX = 490, BT = 196, BB = 292;
    let body = '';
    // 쓰레기통과 쌓이는 쓰레기
    const junk = [[-38, -14, -12, cup()], [8, -18, 10, box()], [44, -12, 18, bottle()], [-12, -40, -20, bag()], [24, -46, 8, cup(C.peach, C.orange)], [-44, -46, 24, bottle()], [6, -72, -6, box()]];
    body += junk.map(([dx, dy, r, inner], i) => at(1, 'pop', place(BX + dx, BT + dy, r, inner), 0.3 + i * 0.22)).join('');
    body += `<path d="M${BX - 64} ${BT} H${BX + 64} L${BX + 52} ${BB} H${BX - 52} Z" fill="white" stroke="${C.muted}" stroke-width="3" stroke-linejoin="round"/>`;
    body += `<path d="M${BX - 30} ${BT + 18} L${BX - 26} ${BB - 14} M${BX} ${BT + 18} V${BB - 14} M${BX + 30} ${BT + 18} L${BX + 26} ${BB - 14}" stroke="${C.line}" stroke-width="3" stroke-linecap="round"/>`;
    // 계속 떨어지는 쓰레기
    body += shown(1, [[-30, cup(), 0], [20, bottle(), 0.55], [-4, bag(), 1.1]].map(([dx, inner, s]) => `<g class="fall" style="animation-delay:${s}s;--fall:42px">${place(BX + dx, 84, 0, inner)}</g>`).join(''));
    body += at(1, 'pop', tag(BX, 322, '쓰레기 증가', HOT, { size: 20 }), 0.2);
    body += shown(1, g('pop pop1', tag(352, 196, '왜?', PLAIN, { size: 22 }), 1.4), 2);
    // 까닭 둘
    body += at(2, 'pop', tag(150, 140, '분리배출 안 함', COLD, { size: 20 }));
    body += shown(2, g('fin fin2', flow([[246, 146], [412, 206]], C.blue), 0.5));
    body += at(3, 'pop', tag(150, 250, '일회용품 많이 씀', COLD, { size: 20 }));
    body += shown(3, g('fin fin3', flow([[254, 246], [412, 238]], C.blue), 0.5));
    // 4칸: 원인·결과 이름
    body += at(4, 'pop', tag(150, 56, '원인', OLD, { size: 22 }));
    body += at(4, 'pop', tag(BX, 34, '결과', HOT, { size: 22 }), 0.3);
    body += glowRect(56, 112, 188, 166, 4, C.purple, 0.5, 16) + glowRect(BX - 82, 300, 164, 44, 4, C.orange, 0.8, 22);
    put('4-2/사회/2-1/원인', svg(id, body, css));
  })();

  // ── 출처: 노트의 그래프 → 신문 → 처음 만든 곳(통계청)으로 거슬러 간다 ──
  (function () {
    const id = 't42-s21-chulcheo';
    let css = base(id);
    let body = '';
    const bars = (cx, baseY, n, cls = '') => [[-30, 34], [0, 58], [30, 44]].map(([dx, h], i) => `<rect class="${cls}" style="transition-delay:${f(0.3 + i * 0.2)}s" x="${cx + dx - 10}" y="${baseY - h}" width="20" height="${h}" rx="2" fill="${[C.orange, C.blue, C.green][i]}"/>`).join('') + `<path d="M${cx - 50} ${baseY} H${cx + 50}" stroke="${C.ink}" stroke-width="2.5"/>`;
    // 오른쪽: 우리 모둠 조사 노트
    const NX = 538;
    let note = `<rect x="${NX - 74}" y="96" width="148" height="190" rx="8" fill="white" stroke="${C.blue}" stroke-width="3"/>`;
    for (let i = 0; i < 6; i++) note += `<circle cx="${NX - 55 + i * 22}" cy="96" r="6" fill="${C.paper}" stroke="${C.blue}" stroke-width="2.5"/>`;
    note += text(NX, 136, '조사 노트', { size: 18, color: C.blue });
    note += `<rect x="${NX - 60}" y="152" width="120" height="96" fill="${C.paper}" stroke="${C.line}" stroke-width="2"/><rect x="${NX - 18}" y="146" width="36" height="12" fill="${C.yellow}" opacity=".8"/>`;
    body += at(1, 'pop', note + `<g>${bars(NX, 236, 1, 'growy growy1')}</g>`);
    // 가운데: 신문
    const PX = 320;
    let paper = `<rect x="${PX - 74}" y="96" width="148" height="190" rx="4" fill="white" stroke="${C.muted}" stroke-width="3"/><rect x="${PX - 62}" y="106" width="124" height="30" rx="3" fill="${C.ink}"/>` + text(PX, 128, '신문', { size: 18, color: 'white' });
    paper += `<path d="M${PX - 62} 150 H${PX + 62}" stroke="${C.line}" stroke-width="4" stroke-linecap="round"/>`;
    paper += bars(PX, 236, 2) + text(PX, 266, '출처: 통계청', { size: 18, weight: 700 });
    body += at(2, 'pop', paper);
    body += shown(2, g('fin fin2', flow([[458, 190], [404, 190]], C.blue), 0.5));
    // 왼쪽: 처음 만든 곳
    const GX = 100;
    let office = `<path d="M${GX - 62} 150 L${GX} 112 L${GX + 62} 150 Z" fill="${C.lilac}" stroke="${C.purple}" stroke-width="3" stroke-linejoin="round"/>`;
    office += `<rect x="${GX - 52}" y="150" width="104" height="84" fill="white" stroke="${C.purple}" stroke-width="3"/>`;
    for (let i = 0; i < 4; i++) office += `<rect x="${GX - 42 + i * 26}" y="160" width="10" height="64" fill="${C.lilac}"/>`;
    office += `<rect x="${GX - 62}" y="234" width="124" height="12" rx="2" fill="${C.purple}"/>`;
    body += glowRect(PX - 62, 248, 124, 28, 3, C.orange, 0.1, 8);
    body += shown(3, g('fin fin3', flow([[240, 190], [168, 190]], C.purple), 0.9));
    body += at(3, 'pop', office, 1.3);
    body += at(3, 'pop', tag(GX, 278, '통계청', OLD, { size: 20 }), 1.6);
    // 4칸: 노트에도 출처를 적는다, '출처' 이름표
    body += at(4, 'fin', text(NX, 266, '출처: 통계청', { size: 18, color: C.blue }), 0.4);
    body += at(4, 'pop', tag(GX, 70, '출처', HOT, { size: 22 }), 0.2);
    body += ring(GX, 180, 70, 4, C.orange, 0.3);
    body += glowRect(NX - 62, 248, 124, 28, 4, C.blue, 0.9, 8);
    put('4-2/사회/2-1/출처', svg(id, body, css));
  })();

  // ── 분석: 뒤섞인 대답 쪽지 33장을 같은 대답끼리 나누어 쌓고 센다(미래엔 65쪽 주민 면담 15·10·8명) ──
  (function () {
    const id = 't42-s21-bunseok';
    let css = base(id);
    let body = '';
    const COLS = [{ x: 352, n: 15, c: HOT, label: '분리배출' }, { x: 466, n: 10, c: COLD, label: '편리함' }, { x: 580, n: 8, c: OLD, label: '잘 모름' }];
    const BASE = 286, CH = 13;
    const rnd = seeded(4217);
    const cards = [];
    COLS.forEach((col, ci) => { for (let k = 0; k < col.n; k++) cards.push({ ci, k }); });
    // 뒤섞기
    for (let i = cards.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [cards[i], cards[j]] = [cards[j], cards[i]]; }
    body += `<path d="M${COLS[0].x - 50} ${BASE + 2} H${COLS[2].x + 46}" stroke="${C.ink}" stroke-width="3" stroke-linecap="round"/>`;
    cards.forEach(({ ci, k }, i) => {
      const col = COLS[ci], fx = col.x - 30, fy = BASE - (k + 1) * CH;
      const px = 52 + rnd() * 176, py = 92 + rnd() * 180, r = Math.round(rnd() * 50 - 25);
      css += `.sc-${id} .cd${i} { transform: translate(${f(px - fx)}px, ${f(py - fy)}px) rotate(${r}deg); transition-delay: ${f(0.04 * i)}s; }`;
      body += at(1, 'pop', `<g class="card cd${i}"><rect x="${fx}" y="${fy}" width="60" height="${CH - 3}" rx="2" fill="${col.c[0]}" stroke="${col.c[1]}" stroke-width="2"/></g>`, f(0.03 * i));
    });
    css += `
      .sc-${id} .card { transform-box: fill-box; transform-origin: center; transition: transform 1.3s ease-in-out; }
      .on2 .sc-${id} .card { transform: none; }`;
    body += shown(1, tag(140, 320, '대답 33개', PLAIN, { size: 20 }), 2);
    COLS.forEach((col, ci) => {
      body += at(2, 'fin', text(col.x, BASE + 30, col.label, { size: 18, color: col.c[1] }), 1.6);
      body += at(3, 'pop', text(col.x, BASE - col.n * CH - 12, `${col.n}명`, { size: 20, color: col.c[1] }), ci * 0.35);
    });
    body += `<g class="b3 h4"><rect class="flash flash3" style="animation-delay:1.1s" x="${COLS[0].x - 40}" y="${BASE - 15 * CH - 40}" width="80" height="${15 * CH + 52}" rx="10" fill="none" stroke="${C.orange}" stroke-width="5"/></g>`;
    // 4칸: 돋보기가 쌓인 막대를 하나하나 훑는다
    const lens = `<circle cx="0" cy="0" r="26" fill="white" fill-opacity=".35" stroke="${C.ink}" stroke-width="5"/><path d="M18 18 L36 36" stroke="${C.ink}" stroke-width="8" stroke-linecap="round"/>`;
    body += shown(4, `<g class="scan"><g transform="translate(${COLS[0].x} 200)">${lens}</g></g>`);
    body += glowRect(COLS[0].x - 44, 46, COLS[2].x - COLS[0].x + 88, 276, 4, C.green, 0.2, 14);
    css += `
      .sc-${id} .scan { animation: ${id}-scan 4.5s ease-in-out infinite; }
      @keyframes ${id}-scan { 0%, 100% { transform: translate(0, 0); } 33% { transform: translate(${COLS[1].x - COLS[0].x}px, 50px); } 66% { transform: translate(${COLS[2].x - COLS[0].x}px, 70px); } }`;
    put('4-2/사회/2-1/분석', svg(id, body, css));
  })();

  // ── 장단점: 해결 방안 하나(다회용 컵)를 좋은 점·아쉬운 점 두 접시 저울에 올린다 ──
  (function () {
    const id = 't42-s21-jangdan';
    let css = base(id);
    const PX = 320, PY = 132, L = 180;
    let body = '';
    body += at(1, 'pop', place(214, 42, 0, cup(C.sky, C.blue)) + tag(338, 42, '다회용 컵 쓰기', COLD, { size: 20 }));
    // 받침
    body += `<rect x="${PX - 6}" y="${PY}" width="12" height="${284 - PY}" fill="${C.muted}"/><path d="M262 300 H378 L358 284 H282 Z" fill="${C.muted}"/>`;
    // 접시: 줄 둘과 그릇, 그 위 카드
    const pan = (x, cls, card) => `<g class="${cls}"><path d="M${x} ${PY} L${x - 48} 206 M${x} ${PY} L${x + 48} 206" stroke="${C.muted}" stroke-width="2.5"/><path d="M${x - 58} 206 H${x + 58} Q${x + 50} 228 ${x} 228 Q${x - 50} 228 ${x - 58} 206 Z" fill="white" stroke="${C.ink}" stroke-width="3" stroke-linejoin="round"/>${card}</g>`;
    body += pan(PX - L, 'panL', at(2, 'drop', tag(PX - L, 186, '일회용품 줄어듦', OK, { size: 18 })));
    body += pan(PX + L, 'panR', at(3, 'drop', tag(PX + L, 186, '챙기기 불편', HOT, { size: 18 })));
    body += `<g class="beam"><rect x="${PX - L - 14}" y="${PY - 6}" width="${2 * L + 28}" height="12" rx="6" fill="${C.ink}"/></g><circle cx="${PX}" cy="${PY}" r="9" fill="${C.yellow}" stroke="${C.ink}" stroke-width="3"/>`;
    body += at(2, 'pop', text(PX - L, 274, '장점', { size: 22, color: C.green }), 0.6);
    body += at(3, 'pop', text(PX + L, 274, '단점', { size: 22, color: C.orange }), 0.6);
    // 4칸: 둘을 묶어 장단점
    body += shown(4, `<path class="draw draw4" pathLength="1" d="M${PX - L} 284 V312 H${PX + L} V284" stroke="${C.purple}" stroke-width="3.5" fill="none" stroke-linejoin="round"/>`);
    body += at(4, 'pop', tag(PX, 330, '장단점', OLD, { size: 22 }), 1);
    body += glowRect(PX - L - 74, 166, 148, 40, 4, C.green, 0.3, 20) + glowRect(PX + L - 66, 166, 132, 40, 4, C.orange, 0.6, 20);
    const a = 7, dy = f(L * Math.sin((a * Math.PI) / 180));
    css += `
      .sc-${id} .beam { transform-box: view-box; transform-origin: ${PX}px ${PY}px; transition: transform 1s ease-in-out .4s; }
      .sc-${id} .panL, .sc-${id} .panR { transition: transform 1s ease-in-out .4s; }
      .on2 .sc-${id} .beam { transform: rotate(-${a}deg); }
      .on2 .sc-${id} .panL { transform: translateY(${dy}px); }
      .on2 .sc-${id} .panR { transform: translateY(-${dy}px); }
      .on3 .sc-${id} .beam, .on3 .sc-${id} .panL, .on3 .sc-${id} .panR { transform: none; }`;
    put('4-2/사회/2-1/장단점', svg(id, body, css));
  })();

  // ════ 3-1 지역의 다양한 환경과 개발에 따른 변화 ════

  const sun = (x, y, r = 16) => `<g class="spin">${[0, 45, 90, 135, 180, 225, 270, 315].map((d) => { const c = Math.cos((d * Math.PI) / 180), s = Math.sin((d * Math.PI) / 180); return `<path d="M${f(x + c * (r + 5))} ${f(y + s * (r + 5))} L${f(x + c * (r + 12))} ${f(y + s * (r + 12))}" stroke="${C.orange}" stroke-width="3.5" stroke-linecap="round"/>`; }).join('')}</g><circle cx="${x}" cy="${y}" r="${r}" fill="${C.yellow}" stroke="${C.orange}" stroke-width="3"/>`;
  const cloud = (x, y, fill = 'white', stroke = C.muted) => {
    const parts = [[-13, 3, 11], [2, -6, 14], [16, 3, 10]];
    const shape = (pad) => parts.map(([dx, dy, r]) => `<circle cx="${x + dx}" cy="${y + dy}" r="${r + pad}"/>`).join('') + `<rect x="${x - 13 - pad}" y="${y + 2 - pad}" width="${29 + 2 * pad}" height="${12 + 2 * pad}" rx="5"/>`;
    return `<g fill="${stroke}">${shape(2.5)}</g><g fill="${fill}">${shape(0)}</g>`;
  };

  // ── 기후: 날마다 바뀌는 날씨와, 해마다 되풀이되는 기온·비의 모양 ──
  (function () {
    const id = 't42-s31-gihu';
    let css = base(id);
    let body = '';
    // 1칸: 날씨 카드 셋
    body += at(1, 'pop', tag(56, 58, '날씨', COLD, { size: 22 }));
    const days = [['오늘', sun(0, 0, 15)], ['내일', cloud(0, -6, C.sky, C.blue) + [-10, 2, 14].map((dx, i) => `<g class="fall" style="animation-delay:${i * 0.4}s;--fall:14px"><path d="M${dx} 12 l-3 8" stroke="${C.blue}" stroke-width="3" stroke-linecap="round"/></g>`).join('')], ['모레', cloud(0, 0, C.line, C.muted)]];
    days.forEach(([label, icon], i) => {
      const x = 156 + i * 100;
      body += at(1, 'pop', `<rect x="${x - 42}" y="14" width="84" height="90" rx="10" fill="white" stroke="${C.line}" stroke-width="2.5"/><g transform="translate(${x} 48)">${icon}</g>` + text(x, 96, label, { size: 18, weight: 600 }), 0.3 + i * 0.4);
    });
    // 2~3칸: 세 해의 기온 선과 비 막대
    const X0 = 70, X1 = 604, Y0 = 150, Y1 = 300, dx = (X1 - X0) / 36;
    const mx = (i) => X0 + (i + 0.5) * dx, ty = (t) => Y1 - ((t + 10) / 40) * (Y1 - Y0), ry = (r) => (r / 450) * (Y1 - Y0);
    const T = [[-2, 0, 6, 12, 18, 22, 25, 26, 21, 15, 7, 0], [-3, 1, 5, 13, 17, 23, 26, 25, 22, 14, 8, -1], [-1, 0, 7, 12, 18, 22, 24, 27, 21, 15, 6, 1]];
    const R = [[20, 25, 40, 75, 100, 130, 390, 330, 140, 50, 45, 20], [15, 30, 35, 65, 110, 150, 420, 300, 160, 45, 50, 25], [25, 20, 45, 80, 95, 120, 370, 360, 130, 55, 40, 20]];
    let axes = `<path d="M${X0} ${Y0 - 10} V${Y1} H${X1 + 4}" stroke="${C.ink}" stroke-width="2.5" fill="none"/>`;
    for (const t of [0, 20]) axes += `<path d="M${X0 - 6} ${f(ty(t))} H${X0}" stroke="${C.ink}" stroke-width="2"/>` + text(X0 - 10, f(ty(t) + 6.5), t, { size: 18, anchor: 'end', weight: 600 });
    axes += text(X0 - 8, Y0 - 16, '℃', { size: 18, anchor: 'end', color: C.red });
    axes += [1, 2].map((k) => `<path d="M${f(X0 + k * 12 * dx)} ${Y0 - 6} V${Y1}" stroke="${C.line}" stroke-width="2" stroke-dasharray="6 5"/>`).join('');
    body += shown(2, axes);
    body += shown(2, `<path d="M440 42 H466" stroke="${C.red}" stroke-width="4.5" stroke-linecap="round"/>` + text(474, 49, '기온', { size: 18, anchor: 'start', color: C.red }) + `<rect x="445" y="66" width="16" height="20" rx="2" fill="${C.sky}" stroke="${C.blue}" stroke-width="2"/>` + text(474, 83, '비', { size: 18, anchor: 'start', color: C.blue }));
    const years = ['올해', '다음 해', '그다음 해'];
    T.forEach((temps, y) => {
      const n = y === 0 ? 2 : 3, s0 = y === 2 ? 0.9 : 0;
      body += `<g class="b${n}">${R[y].map((r, i) => `<rect class="rb" style="transition-delay:${f(s0 + i * 0.07)}s" x="${f(mx(y * 12 + i) - 4.5)}" y="${f(Y1 - ry(r))}" width="9" height="${f(ry(r))}" rx="1.5" fill="${C.sky}" stroke="${C.blue}" stroke-width="1.5"/>`).join('')}</g>`;
      const pts = temps.map((t, i) => [mx(y * 12 + i), ty(t)]);
      if (y) pts.unshift([mx(y * 12 - 1), ty(T[y - 1][11])]);
      body += `<g class="b${n}"><path class="draw draw${n}" style="transition-delay:${f(s0 + 0.2)}s" pathLength="1" d="M${pts.map((p) => `${f(p[0])} ${f(p[1])}`).join(' L')}" stroke="${C.red}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round" fill="none"/></g>`;
      body += at(n, 'fin', text(f(X0 + (y + 0.5) * 12 * dx), Y1 + 28, years[y], { size: 18, weight: 600 }), s0);
      body += ring(f(mx(y * 12 + 7)), f(ty(T[y][7])), 12, n, C.orange, s0 + 1.4);
    });
    body += at(2, 'pop', text(f(mx(7)), Y0 - 14, '여름', { size: 18, color: C.orange }), 1.4);
    body += at(2, 'pop', text(92, 222, '겨울', { size: 18, color: C.blue }), 1.8) + ring(f(mx(0)), f(ty(T[0][0])), 10, 2, C.blue, 1.8);
    css += `
      .sc-${id} .rb { transform-box: fill-box; transform-origin: 50% 100%; transform: scaleY(0); transition: transform .6s ease-out; }
      .on2 .sc-${id} .b2 .rb, .on3 .sc-${id} .b3 .rb { transform: scaleY(1); }`;
    // 4칸: 해마다 같은 때(여름)가 차례로 반짝인다
    for (let y = 0; y < 3; y++) body += glowRect(mx(y * 12 + 5) - 9, Y0 - 4, 3 * dx + 18, Y1 - Y0 + 8, 4, C.orange, y * 0.5, 8);
    body += at(4, 'pop', tag(574, 64, '기후', HOT, { size: 24 }), 1.6);
    put('4-2/사회/3-1/기후', svg(id, body, css));
  })();

  // ── 광역시: 전라남도 땅 가운데 있는 광주가 도에서 빠져나와 도와 나란히 선다(실제 경계) ──
  const JN = {
    '광주광역시': 'M144.8 78.8L143.3 83.6L152.3 87.1L155.8 84.1L157.5 84.8L162.7 81.1L165.5 79.9L167.2 80.9L171.7 78.4L177.6 84.4L178 87.5L180.7 90.3L179.5 92.6L181.4 95.3L186.9 93.5L190.7 96.9L188.3 100.6L188.8 107.5L185 110.6L184.7 114.1L180.9 115L178.9 118.2L174.8 118.3L172.8 114.5L167.7 117.5L161.2 117.4L154.5 123L152.6 123.4L150.3 121.2L146.7 123L145.1 120.5L143.4 121.6L143.1 119.9L146.2 119.2L144.5 114.7L139.3 110L138.5 111.1L130.9 110.1L128.1 111.8L124.9 108.3L125.2 103.2L123.7 102.7L125.3 98.8L128.5 96.9L125.2 92.7L129.4 93L131.2 87.8L134 89.4L136.7 88.4L140.1 79.6L144.8 78.8Z',
    '전라북도': 'M295.9 4L295.7 7.8L291 14.3L295.8 18.2L298.8 18.2L298.2 20.2L303.1 28.9L300.2 30.7L300.2 34.8L301.7 37L306.8 38L304.5 44.6L300.2 47.9L298.3 52.7L295.5 55.1L297.4 62.3L291.2 67.4L283.4 63.2L276.3 56.7L270.7 55.2L263.6 56.8L255.3 68.8L250 64.5L242.1 68.4L237.9 66.3L232.7 66.7L228.2 62.1L226.2 61.8L224.8 65.6L223.3 66L220.3 64.5L220 61.4L215.4 63.5L212.8 67.4L205.6 69.6L194.6 64.6L196.2 60.7L199.4 60.7L199.5 55.2L197.2 51.5L193.9 52L191.8 48.9L191.7 47.7L195.3 47.2L196.2 42L193.5 40.4L193.1 33.3L189.4 35.2L186.8 34.2L185.9 39.1L183.6 41.9L181.8 41.7L182.7 47.5L181.6 48.4L175.4 48.9L175 46.4L172.2 47.2L172 44.3L169.6 43.2L168.7 40.1L170 38.8L168.5 37.3L163.8 34.4L158.4 34.2L159 30.7L154.5 29L153.8 32.8L145 33.2L140.2 37L142.7 40.1L143.1 44.1L137.5 47.7L139.1 52.7L136.9 55.3L134.3 55.3L133.4 58.5L131 59.8L127.5 58.2L123.7 65.1L120.4 64.8L116.4 61.7L113 62.8L113 69.2L107 66.4L103.7 67.9L100.4 63.5L101.5 59.1L100.2 55.9L96.8 58.5L97.5 53.7L93.9 50.7L96.2 48.7L96.2 45L93.6 41.3L91.5 42.2L88.3 40L85.4 40.6L86.4 36.9L95 21.4L97.2 23.9L96.8 22.4L100.2 19.4L105.1 18.6L105.8 20.1L108.6 16.6L114.8 17.2L114.9 19.6L118.2 10.7L121.6 9.8L124.5 10.7L129.1 16L127.2 13L128.6 10.6L125.9 7.2L124.8 8.5L111.3 6.4L103.1 8.8L100.9 8.5L100.6 7L99.4 8.8L94.3 4L91.8 4Z',
    '전라남도': 'M106.9 312.8L107.7 314.9L110.3 314.4L110.8 316.3L112.7 314.4L119.5 315.7L118.6 319L116.3 316.3L116.5 319.6L114.5 316.1L112.2 318L106.1 323.8L100 324.8L98.8 316.5L104.9 311.8L106.9 312.8ZM125.4 308.2L130.8 311.9L125.7 314L125.9 315.7L127.8 316.1L128.1 319.2L130.5 319.1L130.1 320.9L128.1 319.9L128.1 325L126.3 326.7L124.7 326.4L124.8 323.1L122.2 324.5L120.6 319.7L124.9 314.6L121.6 310.4L123.4 310.8L123.9 308.3L125.4 308.2ZM167.4 304.1L171 305.2L170.4 311.2L174.2 310.1L172.9 311.1L173.5 313.3L170.6 318.4L165.7 318.8L164 316.2L162.8 315.3L161.3 318.6L159.9 316L161.8 314.1L160.4 314.7L159.7 313.3L161.6 312.6L161.7 307.8L167.4 304.1ZM110 300.6L111.1 303.1L112 301.8L116.9 302.6L120.2 307.2L116.2 307.9L118 312L113.3 309.8L113.2 313.5L108.8 312.5L109.3 310.5L106.3 309.6L107.9 309.1L107.4 306.6L109.4 305.4L107.6 305.1L109.9 302.7L107.4 300.7L110 300.6ZM158.3 283.5L156.4 280.6L152.2 280.5L150.2 282.9L147.8 280.1L142.9 278.4L147.5 279.1L149 276.2L151.6 278.9L154.1 278.3L157.5 273.5L159.8 276.6L160.7 275.4L161.8 276.7L164.1 275.5L166 278.3L168.5 276.5L168.6 279.1L165.8 279.5L165.8 284L164.1 284.1L163.1 281.3L163.2 283.1L158.8 286.4L158.3 283.5ZM192.2 277.6L190.4 274.6L188.2 275.5L184.4 273.4L188.1 273.9L189.4 269.4L192 270.5L192.2 268.7L194.8 271.2L195.2 275.2L198.7 273.1L201.8 274.4L204.9 278L199.1 275.9L198 277.4L200.6 279.2L197 279.6L194.4 284.4L193.5 280.7L196.5 278.3L194.4 277.3L192.8 279.3L192.2 277.6ZM132.5 264.9L138.8 269L139.2 275.1L142.1 281.6L146.3 283.5L144.6 286.4L147.3 288.9L142.1 288L139.7 285.2L140.3 289.1L136.6 286.8L132.6 287.8L127.9 281L123.7 279.9L122.6 268.4L124.4 265.8L128.1 265.4L128.3 264.2L132.5 264.9ZM176.8 266L175.3 268.1L177.6 269.4L177.6 271.5L174.3 270.9L173.4 273.1L170.2 274.5L162.6 270.3L164.1 264.5L162.3 263.1L163.6 262.6L164.1 264.3L166 263L168 265.4L168.5 263.6L169.1 265L170.6 264L171.2 266.3L174.6 266.5L177.1 261.8L178.2 263.7L176.8 266ZM157.2 256.5L159.3 257.9L159.1 260L155.6 260.4L158.4 262.2L160.2 260.6L160 263.1L161.5 262.8L162.8 266.8L159.7 266.7L156.6 269.3L155.4 267.3L152 267.7L147.8 272L147.9 274.7L145.2 273.4L147.6 268.4L142.4 268.8L145.5 265L144.9 262.6L149 257.6L154.4 257.2L157.4 255.1L157.2 256.5ZM272.1 250.6L273.7 250.1L273 251.8L274.8 251.8L275.5 249.9L276.9 250.6L276.7 248.7L279.6 252.9L282.6 254.3L281.3 259.7L279.5 258.7L274.3 262L274.1 259.6L274.3 257.3L271.5 257.4L269.3 255.1L272.8 255.3L273.3 254.2L266.9 253.9L268.5 253.1L267.9 248.1L272.1 250.6ZM225.6 243.9L228.7 248.1L224 258.2L216.3 257L215 258.8L212.9 258.1L212.1 260.1L207.4 255.9L207.8 254.3L206.1 254.4L204.6 255.2L205.8 252.8L203.4 249.2L205.6 249.4L208.5 245L212.1 248.7L218.7 244.8L222.3 245.5L225.6 243.9ZM269.9 233.4L272.1 235.1L268.5 237.3L271.6 239.6L268.4 239.9L275.8 242.2L276.9 244.9L274.7 246.3L274 245L267.5 247.5L265.4 244.3L268.4 241.5L266.9 239.2L264.1 238.6L267.6 233.4L269.9 233.4ZM323.9 236.2L326.1 240.3L323.6 240.8L326.9 241.2L329 243.9L327.6 245.6L324.2 245.6L322.7 244.8L324.4 242.9L320.9 242.5L317.7 242.2L318.8 240.6L316.1 239.7L317.2 237L315.1 237.8L311 234.3L313.6 234.6L318.7 231.3L321.8 231.7L323.9 236.2ZM53.8 224.6L58.4 224.6L58.6 225.9L62.9 227.4L64 229.2L62.5 230.5L64.9 233.4L66.8 234.1L69.2 231.7L71.4 236.9L77.1 242L75.2 242.7L77.4 246.9L72.7 247L75.2 249.3L72.7 252.4L74 255.1L68.6 261.5L68.8 264.4L67 265.8L65.9 259.2L64.3 261L65 264.3L62.7 261.4L63.4 264.1L61 262.6L61.7 265.3L60.4 265.8L62.7 265.5L61.7 267.9L64.1 268.4L63.7 270.3L62.2 271.2L60.9 270.1L60.2 272.3L58.7 270.6L60.8 266.4L58.4 266L56.2 265.1L55.3 266.2L56.5 269.3L52.3 269.1L51.5 270.9L49.9 270.1L48.3 271.6L45 270.8L44.2 271.5L47 273.1L40.9 275.6L41.4 273.5L39.6 274.8L36.7 273.9L37.6 272.1L32.1 273.4L34.2 267.8L29.3 268.6L24.8 260.4L27 255.6L30 253.8L31.8 255L29.6 251.8L39.6 246.1L42.8 239.7L42.4 243.7L45.4 243.8L44.3 240.5L48.6 239.3L46.6 237L48.9 236.3L49.1 233.9L50.9 234.9L53.5 229.6L51.6 228.4L52.4 225.5L51.3 224.9L53.4 223.5L53.8 224.6ZM19.3 215L22.2 215.6L24.5 219.3L27.2 219.9L26.4 221.8L28.7 223.6L25.3 227.9L27.1 230.9L23.8 230.7L24.3 232.8L20.1 234.1L18.9 236.2L14.5 236.1L13.9 233.5L16.9 234.7L17 232.8L19.6 232.5L18.4 230.5L15.7 230.3L15 231.6L13.7 230.6L15.6 228.8L20.4 229.8L24.4 224.5L22.2 224.6L19.5 218.5L17.3 219L17.7 215.1L19.3 215ZM12 213.5L15.9 214.7L14.8 218.8L17 220.7L18.5 220.2L20.4 224.8L18.9 228.1L14.5 227.2L12.4 229L12.1 227.2L11.6 224L13.7 222.7L12.4 221.1L10.9 222L11.9 217.2L10.7 214.4L12 213.5ZM37.4 206.2L42.2 209.8L41.9 213L44.4 212L44.8 213.3L39.9 216.4L38.1 215L35 216.7L30.6 217.8L32.4 212.1L28.2 211.1L31.6 209.9L35.6 205.5L37.4 206.2ZM326.9 196.9L327.3 199.6L325 198.8L325.6 196.9L324.6 198.6L322.8 197.4L324 199L322 198.7L323.2 200.7L325.6 200.1L326.3 205.6L329.5 206.8L328.4 208L330.5 208L328.3 211.3L329.3 214.6L327.9 214.6L327.2 219.8L328.4 220.5L330.7 221.9L330 223.8L324.1 223.8L320.1 222.6L318.2 218.9L313.6 216.5L315.9 213L313.7 211.7L322.7 202.1L318.3 192.3L324.5 194.2L326.9 196.9ZM4 193.9L5.2 196L5.7 194.7L7.2 195.3L8.8 198.8L11.3 198.8L10.7 200L10.1 202.8L5.3 205.3L4 208.4ZM27.5 185.1L30.9 184.1L34.5 188.2L36.8 186.9L39.8 187.9L38.7 189.3L41.4 194.3L40 199.3L34.9 199.1L34.2 193.5L32.2 193.8L29.9 196.3L26.3 195L22.2 197.6L23.4 195.1L21.6 190.5L23.5 188.7L22.6 185.7L20.4 184.9L23.7 185.7L24.7 183.2L27.5 185.1ZM7.7 176.3L9 180.1L6.2 183.3L8.9 183.9L7.5 186.4L4 187.5L4 177.5L7.7 176.3ZM29.5 160L33.5 161.5L34.5 160.2L37 164.3L32.5 164.8L35.7 168.3L33.8 170.1L34.1 171.9L30.3 170.4L30 177.7L25.6 178.4L25 174.5L23.2 173.7L21.6 174.9L22.4 179L16.6 172.4L17.4 171.7L20.7 175L23.1 173.7L19.5 167.5L23.6 165L29.4 166.8L30.3 165.3L28.2 160.6L29.5 160ZM61.3 167L58.1 165.7L55.7 169.2L49.1 166.9L50.4 163.8L55.1 165.2L56.8 162L58.6 164L59 158.9L61 160.2L63 158.8L58.8 154L59.4 153L63.3 151.7L64.6 154.4L69.1 154.4L71.5 156.7L70.9 157.8L68.9 157.5L68.6 159L67 157.9L67.6 160.6L65.3 159.8L64.6 161L66.8 162.1L64.9 163.4L74.2 165.3L75 168.4L73.9 169.9L75.3 170.6L74.3 172.6L71.2 174.8L69.1 174.3L67.1 172.5L70 170.7L70.2 168.8L68.9 169.2L67.5 166.7L61.3 167ZM20.1 149L22.9 149.3L22.2 151.2L23.4 152L25 151.2L23.9 153.7L26.5 154L23.8 157.1L26.5 158.4L26.2 160.5L24.2 161.4L22.9 160.1L23.9 163.9L17.8 165.9L17.2 168.1L14.3 164.9L12.5 164.4L13.4 162.1L10.3 165L4.9 163.9L5.6 162.5L4 161.6L7.2 161.2L11.3 153.5L14.7 154.1L15.1 151.9L16 153.7L18.2 153.7L19.8 151.4L18.9 148L20.1 149ZM318.3 147.4L318.2 149.1L323.1 149.2L326.5 152.8L326.5 159L322.7 157.9L322.5 155.7L319 154.9L322.2 155.5L322.4 154.3L319.3 154.7L312.3 153.2L312.2 149.7L315.8 145.9L317.1 144.8L318.3 147.4ZM33 128.8L38.4 130L37.7 132.2L40.6 135.2L40.9 139.9L38.6 141.5L34.6 141.2L32.9 145.5L30.9 145.8L33.1 141.9L32.8 136.5L34.6 137.3L34.3 136L32.6 134.1L27.8 135.2L26.3 133.9L33 128.8ZM18.8 118.1L16.4 116.1L18.9 113.6L17.6 112.1L23.3 111.1L29.2 103.4L38.1 103L31.2 104.9L29.9 113.3L30.9 116.8L27.1 115.1L30.7 117.6L28.3 119.3L29.8 121.2L27.1 122.1L26.9 124L22.1 121.5L22.7 119.3L19.7 119.6L20.1 122.4L19.2 120.7L15.6 120.2L18.6 119.8L18.8 118.1ZM167.4 252.4L163.9 252.4L166.8 257.3L166.2 259.8L164.7 256.9L162.8 257.1L159.2 253.3L154.5 253.9L152.1 252.3L152.7 249.7L149.9 249.9L149.4 251.4L149 248L150.9 247.2L148.9 240L150.7 232.6L149.3 224.1L147.3 222.3L147.5 218.3L145.1 229.2L145.8 237.1L143.9 237.2L145.2 243L140.4 245.9L143.2 248.9L137.9 255.1L133.3 255.7L129 258.4L129.4 261L127.2 258.7L124.6 259.7L124 262.5L122 261.9L120.7 264.1L118.6 264.1L119.6 266.1L117.7 267.5L119.3 269.1L119.3 273.4L116 275.7L117.3 276.6L115.7 278.6L116.7 283L108.4 281.4L105.9 285.5L103.1 286.1L102.3 287.9L100.9 287L101.3 283.2L100.1 282.1L102.7 278.7L101.9 277.2L100.8 277.9L101.5 273L98.3 272.2L93.7 275.8L91.6 272.7L93.7 274.2L93.6 272.2L95.6 272.2L93.3 269.4L94.5 268.3L92.8 268.3L97.4 267.7L95.9 262.5L98.8 263.4L100.9 261.4L99.1 255.7L97.2 257.7L95.2 257.1L94.7 258.9L90.1 254.2L91.6 252.8L93.9 253.7L92.2 252.2L92.9 249.7L90 247.8L91.9 246L90.1 242.5L92.8 241.4L91.2 238.4L87.6 238L90.9 235.9L87.8 234.3L86.2 235.2L86.5 232.1L82.7 230.3L83.3 232.5L80.5 232.7L80.7 234.4L77.7 235.8L76.3 234.3L78.2 231.8L77.1 229.4L73.5 229.8L72 227.7L68.4 226.9L64.7 228.2L63 226L64.6 223.8L62.3 223.3L61.5 221L60.9 222.8L58.9 222.2L60.1 220L58.7 218.6L55 218.5L59 218.4L58.8 216.5L60.3 216.7L61.3 214.8L55.3 212.3L56.7 210.8L54.4 207.3L55 199.5L55.6 197.8L57.2 198.8L58.9 195.6L57.8 193.6L59.7 187.1L62.1 186L64.2 187.9L63.7 189.1L65.4 188.5L68.1 190.7L67.8 195L72.7 200.9L77.8 194.5L78.2 192.7L73.1 190.4L74 188.4L76.6 188L76.6 186.9L75.1 187.8L76.8 184.6L89 181.5L87.4 178L82.1 179.3L82.6 180.3L80.4 181.4L77.9 181.9L78.6 180.3L76.9 182.3L71.2 178.6L73.9 176.9L72.9 176.6L78 169.8L82.3 168.6L79.2 162.7L80.5 160.6L77.7 160.8L78.5 156.3L81 153.8L78.1 150L79.8 148.5L77.9 145.8L78.9 142L76.4 140.5L75.4 134.7L74.2 135.9L74.8 139.9L72.9 141.4L75.3 143.6L74.3 151.8L67.6 152.5L67 149.5L63.5 150L66 146.7L61.4 141.9L64.7 136.9L67.2 141.6L70.4 140.2L72.7 136L68.1 135.9L78.4 129.2L78.1 126.4L76.7 123.7L71.7 126.1L71.1 122.2L67.9 121L70.1 118.8L68.3 115.4L66.2 115.1L64.3 118L65.2 119.1L62.4 121L64.9 122.6L63.2 124.6L61.9 125.3L62.5 124L59.7 121L55.3 122.8L57.8 127L53.4 131.9L52.4 128.6L51.4 130.5L49.4 130.1L50.3 122.9L45.8 122.6L44.3 120.8L41.4 121.9L38.8 118.8L37.6 119.9L38.3 116.4L36.9 115L37.2 113L42.8 110L50.1 112.9L54.5 112.3L55.1 114.1L55.2 111.8L52.2 110.3L55 103.5L57.5 101.9L59 105.2L63.6 104.6L63.7 106.8L66 106.8L67.8 103.5L66.8 102.2L70.6 99.8L70.6 104.4L67.6 110.8L68 114.2L70 114.5L71.7 112.8L70.2 117.7L74.2 117.5L74.8 121L76.7 116.6L78.6 115.8L77.4 120.1L79.8 118.1L81.7 120.9L78.4 125.1L80.3 125.3L80.7 128.6L85 128.5L83.7 124.7L90.3 118.4L86.5 115.7L90.3 115L91.7 112.8L84 111.2L80.6 104.8L78.1 103.7L77 100L72.8 97.8L72 94.5L75.2 93.2L76 88.5L69 92.7L69.8 88L69.1 89.8L66.1 90.2L65.1 87.3L64.8 88.9L62.2 88.7L61.7 86.1L64.3 79.5L67.4 81.5L66.3 77.4L69.3 75.5L66.8 75.7L67.6 73.7L69.4 72.4L75.1 72.7L74 71.1L76.2 68.1L76.3 63.4L79.6 54.4L87.7 56.9L88.6 58.9L81.4 51.6L80.5 48.5L82.1 46.5L80.6 46.7L83.6 42.1L81.9 40.6L83.5 41.9L93.6 41.3L96.6 45.7L96.1 49L93.9 50.7L97.5 53.7L96.8 58.5L100.2 55.9L101.5 59.1L100.3 63L102.2 66.4L103.7 67.9L106.5 66.5L110.1 66.9L113 69.2L113 62.8L116.4 61.7L120.4 64.8L123.7 65.1L127.5 58.2L131 59.8L133.4 58.5L134.3 55.3L137.5 54.9L139.2 51.3L137.5 47.7L143.1 44.1L142.7 40.1L140.2 37L145 33.2L153.8 32.8L154.5 29L159 30.7L158.4 34.2L163.8 34.4L168.5 37.3L170 38.8L168.7 40.1L169.6 43.2L172.6 45.5L172.2 47.2L175 46.4L175.4 48.9L181.6 48.4L182.7 47.5L181.8 41.7L183.6 41.9L185.9 39.1L186.8 34.2L189.4 35.2L193.1 33.3L193.5 40.4L196.2 42L195.3 47.2L191.7 47.7L191.8 48.9L193.9 52L197.2 51.5L199.5 55.2L199.4 60.7L196.2 60.7L194.6 64.6L205.6 69.6L212.8 67.4L215.4 63.5L220 61.4L220.3 64.5L223.3 66L224.8 65.6L226.2 61.8L228.2 62.1L232.7 66.7L237.9 66.3L242.1 68.4L250 64.5L255.3 68.8L264.8 55.8L270.7 55.2L276.3 56.7L289.7 67.5L289.7 70.4L296.4 80.1L296.9 93L302.3 99.7L309.5 105.1L310.6 111.4L313.9 115.8L318 118.5L319.2 121.2L323.1 122.8L326.9 132.1L325.6 137L320.9 142.7L323.6 144.4L323.7 148.8L319.5 148.6L318.6 145.6L320.7 142.7L317 144.2L311.7 149.2L310.8 152L306.4 149.5L304.9 153.4L306.3 155.4L300.7 159.6L298 155.6L303.7 154.1L297.7 155L293.5 150.4L289.9 152L292 152.1L296.1 157.2L291.9 161.6L295.1 166.8L300.1 167.7L298.5 170.2L300.1 171.7L304.7 168.1L306.3 169.7L310.6 163.8L311.3 165L316.8 164.5L319.2 166.8L318.6 164.5L322.9 164L325.1 165.9L323.8 177.2L322.1 177.6L319.5 182.7L321.7 188.2L320.1 189L321.3 191.1L317.4 191L317 193.2L311.2 194.9L304.8 187.2L300.8 194.2L301.3 198.1L298.2 195.5L296.3 197.8L298.7 200.4L297.8 202.2L300.7 203L296.8 202.9L299.6 206L299 210.2L301.3 210.2L299.6 213.3L301.6 215.2L298.3 214.8L296.5 211.9L291.9 209.9L289.2 210.7L290.1 214.4L287.4 209.3L285.4 208.5L285.2 206.2L287.2 204.8L284.9 203.4L285.3 200.9L286.5 199.4L290.4 200.9L287 197.6L285.4 199.3L286 196.5L284.5 196.7L287.2 194.3L286.8 192.6L289.5 192.7L290.5 189.7L292.7 189L291.1 188.4L291 184.9L288.7 186.4L288.7 183.3L286.6 182.7L288.6 181.5L286.1 176.3L280 175.5L283.6 168.3L280.5 168L278.9 160.8L278.2 161.9L274.6 161.4L273.4 168.7L270 168.1L265.2 169.9L265.1 167.8L262.7 170.8L260.2 169.4L261.3 171.5L258.2 172.3L255.3 170L249.8 169.2L255.1 172L256.7 174.6L262.8 174.5L256.2 180.3L255.5 183.3L258.6 184.9L253.3 190.5L256.9 195.4L256.4 197.1L263.8 203.7L263.1 205.1L265.1 204.4L266.8 205.6L266.4 207.8L268.2 206.3L270.7 207.2L271.3 209.3L274 210.5L274.2 212L271.8 210.6L271.2 212.3L269.4 210.4L268.5 211.3L275.3 214.2L277.4 222.7L275.3 223.3L273.7 226.9L269 225.2L268.4 223L266 226.1L264 223.6L261.6 224.9L260.1 223.3L257.3 224L257.9 226.4L259.6 225.8L257.5 229.9L262.1 230.5L261.6 231.8L263.6 230.7L262.8 232.2L265 232.3L262.9 233.7L264.6 234.7L262.3 236.6L263.6 238.7L262.1 239.1L263.6 239.9L260.5 238.3L258.9 241.5L256.1 240.7L253.8 242.1L256.6 245.4L255.7 246.4L254.2 245.5L252.9 247.1L250.8 244.6L248.7 247.7L247.4 245.4L247.6 247L244.8 247.9L246.9 249.9L244.5 249.3L243.4 250.8L246.9 252.1L247 254.7L244.2 255.5L241.5 254L241.1 252.9L243.2 252.6L242.1 251.1L240.7 252L240.5 249.2L234.8 246.8L237.4 243.4L232.3 238.3L230.4 238.2L231.4 239.5L228.3 238.9L226.2 235.3L224.1 237.3L224.7 239.2L221.6 235.8L218.7 236.1L217.5 238.6L216.6 237.2L212.9 238.3L208.9 236.7L207 232.6L207.2 229.9L210.9 227.1L213.4 221.1L215.3 223.1L217.3 222.6L217.7 215.2L221.8 210L227.5 209.3L228.3 203.9L230.2 203.1L229 201L231.6 196.9L236.9 195.6L236.7 199.5L237.9 200.2L236.3 205L237.6 206.7L242.8 207.2L246 198.1L248.2 197.4L247.9 196.1L246.2 196.3L245.1 188.2L241 188.7L239 192.7L235.3 190.4L233.9 192.6L229.9 186.5L227.7 187L224.1 191.3L223.5 195.5L219.8 200.7L212.6 201L209 199.2L203.8 206L198.9 207.4L195.1 213.6L189.4 215.8L179.3 214.6L181 216.2L185.9 216.2L185.9 218L188.5 219.3L186.3 220.4L185.6 224.9L183.2 226.8L186.5 228.6L188.1 227.7L187.4 230.9L185 229.5L185 234.2L180.6 243.3L182.9 245.5L183.1 249.1L181.2 247.7L179.1 249.7L177 246.6L175.8 247.9L177.5 252.2L175.9 254.3L167.4 252.4ZM94 191L90.2 193.4L89 190L87.2 191.3L84.6 189.9L84.3 193.4L80.6 192.7L79.4 190.7L78 193.9L91.3 197.4L94 191ZM144.8 78.8L140.1 79.6L136.7 88.4L134 89.4L131.2 87.8L129.4 93L125.2 92.7L128.5 96.9L125.3 98.8L123.7 102.7L125.2 103.2L124.9 108.3L128.1 111.8L130.9 110.1L138.5 111.1L139.3 110L144.5 114.7L146.2 119.2L143.1 119.9L143.4 121.6L145.1 120.5L146.7 123L150.3 121.2L152.6 123.4L154.5 123L161.2 117.4L167.7 117.5L172.8 114.5L174.8 118.3L178.9 118.2L180.9 115L184.7 114.1L185 110.6L188.8 107.5L188.3 100.6L190.7 96.9L186.9 93.5L181.4 95.3L179.5 92.6L180.7 90.3L178 87.5L177.6 84.4L171.7 78.4L167.2 80.9L165.5 79.9L162.7 81.1L157.5 84.8L155.8 84.1L152.3 87.1L143.3 83.6L144.8 78.8Z',
    '경상남도': 'M370.7 151.8L366.7 163.1L369.2 163.5L368.8 160.1L371.2 156.7L371.8 157.9L373.4 156.8L372.1 158.5L376.8 161.7L374.4 166.2L376.1 165.9L375.7 168.1L378.6 168.4L379.9 170.8L376.2 171L369.2 167.5L369.1 169.3L365 170L359.4 168.4L358.1 162.7L365.4 152.8L370.7 151.8ZM347.8 164.6L350.2 170.1L353.4 170.8L354.9 175.6L356.7 176.7L363.1 170.8L370.3 170.4L372.3 172.9L374 172.1L376.7 173.8L376.1 177.8L374 178.7L375.5 178.8L373.6 181.9L375 189.6L371.1 193.1L371.1 194.8L375.6 197.4L372.8 199L370.2 197.6L368.3 198.9L369.6 195.6L367.7 194.2L366.2 197.1L363.1 195L362.1 197.5L357.3 197.4L355 189.3L356.4 182.9L348.1 185L349.4 190.7L348.2 193.5L345.6 194.8L339.5 193.3L340.3 192L338.7 191.7L338.8 189.2L336 188.8L335.6 187.3L339.6 183L338 183.1L338.9 181.6L337.2 182.4L330.7 166.2L332.5 161.6L334.4 161.4L335.2 157.7L333.6 157.4L334.8 157.1L333.8 155.7L336.8 156.5L336.7 154.6L340.4 155.8L338.6 154L339 150.1L341.9 147L345.5 146L349 147.8L351.6 147.3L350.8 148.8L352.5 150.5L351.3 150.2L351.6 157.9L347.3 159.6L347.8 164.6ZM380 4L380 152.3L380 150.3L378.1 151.2L374.4 149.6L370.2 143.6L374.2 139.4L371.8 135.2L373.9 130.9L372.9 129.2L371.6 130.5L371.2 129.4L372.4 127.7L371.9 122.1L375.8 117.4L374.5 116.7L371.1 117.6L372.2 118.7L369.5 122.2L370.4 123.6L368.6 128.2L366 127.3L368.4 125.6L366.7 123.6L367.5 125.8L362.6 124.3L360.6 127.3L364.2 126.2L366.3 131.7L368.2 132.2L366.4 138.2L365.9 137L364.9 138L364.4 135.3L361.9 139.7L358.6 135.5L355.4 138.2L356.5 139.7L354.4 139L352.8 136.2L354.3 133.5L351.1 131.4L349.7 136L351.3 136.8L350.5 138.4L348.4 138.2L348.7 140L346.6 143.9L342 145.9L337.7 145.9L336.5 142.6L336 145.4L333.3 144.2L334.5 145.7L332 145.5L332.4 147.4L329.8 148.6L330.3 150.9L329.9 149.1L328.5 149.5L324 141.6L322.1 141.6L325.8 136.5L326.9 132.1L323.6 123.5L313.9 115.8L310.6 111.4L309.5 105.1L302.3 99.7L296.9 93L296.4 80.1L295.5 77.6L292.9 76.3L289.4 68.1L297.4 62.3L295.5 55.1L298.3 52.7L300.2 47.9L304.5 44.6L306.8 38L301.7 37L300.2 34.8L300.2 30.7L303.1 28.9L298.2 20.2L298.8 18.2L295.8 18.2L291 14.3L295.7 7.8L295.9 4Z'
  };
  (function () {
    const id = 't42-s31-gwangyeok';
    let css = base(id);
    const CX = 165, CY = 108; // 광주 가운데(화면 좌표)
    let body = `<defs><clipPath id="${id}-map"><rect x="12" y="12" width="360" height="336" rx="14"/></clipPath></defs>`;
    let map = `<rect x="0" y="0" width="400" height="360" fill="${C.sky}"/>`;
    map += ['전라북도', '경상남도'].map((k) => `<path d="${JN[k]}" fill="white" stroke="${C.line}" stroke-width="1.5" stroke-linejoin="round"/>`).join('');
    map += `<path d="${JN['광주광역시']}" fill="${C.paper}" stroke="${C.orange}" stroke-width="2" stroke-dasharray="5 4"/>`;
    map += `<path d="${JN['전라남도']}" fill="${C.mint}" fill-rule="evenodd" stroke="${C.green}" stroke-width="1.5" stroke-linejoin="round"/>`;
    body += `<g clip-path="url(#${id}-map)">${map}</g><rect x="12" y="12" width="360" height="336" rx="14" fill="none" stroke="${C.line}" stroke-width="2.5"/>`;
    body += text(176, 196, '전라남도', { size: 22, color: C.green });
    body += `<g class="h2">${glowPath(JN['전라남도'], 1, C.green, 0.2, 3)}</g>`;
    // 광주: 1칸 제자리 → 2칸 들림 → 3칸 오른쪽 나란히 자리로
    const TX = 572, TY = 240;
    body += `<g class="lift"><path d="${JN['광주광역시']}" fill="${C.peach}" stroke="${C.orange}" stroke-width="2.5" stroke-linejoin="round"/>${text(CX, CY + 7, '광주', { size: 18 })}</g>`;
    body += ring(CX, CY, 34, 1, C.orange, 0.8);
    css += `
      .sc-${id} .lift { transition: transform 1.3s ease-in-out; }
      .on2 .sc-${id} .lift { transform: translate(10px, -22px); filter: drop-shadow(0 6px 3px rgba(36, 65, 60, .35)); }
      .on3 .sc-${id} .lift { transform: translate(${TX - CX}px, ${TY - CY}px); }`;
    // 3칸: 나라 아래 도와 광역시가 같은 줄에
    body += at(3, 'pop', tag(506, 52, '대한민국', OLD, { size: 20 }));
    body += shown(3, `<path class="draw draw3" pathLength="1" d="M506 69 V100 H440 V134 M506 100 H572 V134" stroke="${C.purple}" stroke-width="3" fill="none" stroke-linejoin="round"/>`);
    body += at(3, 'pop', tag(440, 152, '전라남도', OK, { size: 20 }), 0.6);
    body += at(3, 'pop', tag(572, 152, '광주광역시', HOT, { size: 18 }), 0.8);
    body += shown(3, g('fin fin3', `<path d="M572 170 V206" stroke="${C.orange}" stroke-width="3" stroke-dasharray="5 5"/>`, 1.4));
    body += `<g class="h4">${glowPath(JN['전라남도'], 3, C.green, 0.6, 3)}</g>`;
    // 4칸: 같은 급
    body += glowRect(386, 128, 246, 48, 4, C.purple, 0.2, 24);
    body += ring(TX, TY, 40, 4, C.orange, 0.6);
    put('4-2/사회/3-1/광역시', svg(id, body, css));
  })();

  // ── 생태계: 햇빛·물·흙·공기와 풀→벌레→개구리→왜가리가 서로 이어진다 ──
  (function () {
    const id = 't42-s31-saengtae';
    let css = base(id);
    let body = '';
    // 1칸: 생물이 아닌 것
    body += `<path d="M0 300 H330 V360 H0 Z" fill="${C.peach}"/><path d="M0 300 H330" stroke="${C.orange}" stroke-width="2.5"/>`;
    body += `<path d="M330 292 H640 V360 H330 Z" fill="${C.sky}"/>`;
    body += [0, -1.1, -2.2].map((s, i) => `<g class="sway" style="animation-delay:${s}s"><path d="M${360 + i * 70} ${316 + (i % 2) * 18} q14 -8 28 0 t28 0" stroke="${C.blue}" stroke-width="2.5" fill="none"/></g>`).join('');
    body += at(1, 'pop', text(64, 338, '흙', { size: 22 }), 0.6);
    body += at(1, 'pop', text(600, 340, '물', { size: 22, color: C.blue }), 0.9);
    body += at(1, 'pop', sun(70, 64, 22), 0);
    body += at(1, 'pop', text(70, 126, '햇빛', { size: 20, color: C.orange }), 0.2);
    body += at(1, 'pop', [0, 1, 2].map((i) => `<g class="sway" style="animation-delay:${-i * 0.9}s"><path d="M${214 + i * 10} ${40 + i * 16} q22 -10 44 0 t44 0" stroke="${C.muted}" stroke-width="3" fill="none" stroke-linecap="round"/></g>`).join('') + text(258, 106, '공기', { size: 20, color: C.muted }), 1.2);
    // 2칸: 생물과 먹이 사슬
    const NODE = { 풀: [190, 250, OK], 벌레: [302, 170, [C.yellow, C.orange]], 개구리: [432, 246, OK], 왜가리: [560, 146, OLD] };
    body += at(2, 'pop', [168, 182, 196, 210].map((x, i) => `<path d="M${x} 300 q${i % 2 ? 4 : -4} -14 ${i % 2 ? -2 : 2} -26" stroke="${C.green}" stroke-width="4" fill="none" stroke-linecap="round"/>`).join(''));
    body += shown(2, g('fin fin2', `<path d="M94 92 L170 228" stroke="${C.orange}" stroke-width="3" stroke-dasharray="6 6"/>${head(170, 228, Math.atan2(136, 76), C.orange, 3)}<path d="M366 296 L216 260" stroke="${C.blue}" stroke-width="3" stroke-dasharray="6 6"/>${head(216, 260, Math.atan2(-36, -150), C.blue, 3)}`, 0.2));
    const node = (k, n, s) => { const [x, y, c] = NODE[k]; return at(n, 'pop', tag(x, y, k, c, { size: 20 }), s); };
    body += node('풀', 2, 0.3) + node('벌레', 2, 0.9);
    body += `<g class="frog">${node('개구리', 2, 1.5)}</g>`;
    body += `<g class="heron">${node('왜가리', 2, 2.1)}</g>`;
    body += shown(2, g('fin fin2', flow([[212, 234], [280, 188]], C.green), 0.7));
    body += shown(2, `<g class="links">${g('fin fin2', flow([[328, 184], [404, 230]], C.green), 1.3)}${g('fin fin2', flow([[458, 230], [536, 166]], C.green), 1.9)}</g>`);
    // 3칸: 개구리가 사라지면 줄이 끊긴다
    body += shown(3, `<path d="M328 184 L404 230 M458 230 L536 166" stroke="${C.line}" stroke-width="4" stroke-dasharray="4 10" stroke-linecap="round"/><path d="M410 226 l44 40 M454 226 l-44 40" stroke="${C.red}" stroke-width="5" stroke-linecap="round"/>`, 4);
    body += shown(3, g('pop pop3', tag(238, 196, '벌레', [C.yellow, C.orange], { size: 18 }), 0.6) + g('pop pop3', tag(360, 124, '벌레', [C.yellow, C.orange], { size: 18 }), 0.9), 4);
    css += `
      .sc-${id} .frog, .sc-${id} .links { transition: opacity .6s ease; }
      .on3 .sc-${id} .frog, .on3 .sc-${id} .links { opacity: .15; }
      .on3 .sc-${id} .heron { animation: ${id}-jig .5s ease-in-out infinite; }
      .on4 .sc-${id} .frog, .on4 .sc-${id} .links { opacity: 1; }
      .on4 .sc-${id} .heron { animation: none; }`;
    // 4칸: 모두 이어진 한 덩어리
    body += glowRect(10, 10, 620, 340, 4, C.green, 0.2, 18);
    body += at(4, 'pop', tag(436, 56, '생태계', OK, { size: 24 }), 0.6);
    put('4-2/사회/3-1/생태계', svg(id, body, css));
  })();

  // ── 간척: 바다를 둑으로 막고 물을 빼내어 땅으로 만든다 ──
  (function () {
    const id = 't42-s31-ganchuk';
    let css = base(id);
    const BAY = 'M410 92 C330 98 222 108 190 150 C164 190 172 240 210 262 C258 286 340 282 410 280 Z';
    let body = `<rect width="640" height="360" fill="${C.sky}"/>`;
    body += [0, -1.2, -2.4, -0.6].map((s, i) => `<g class="sway" style="animation-delay:${s}s"><path d="M${470 + (i % 2) * 60} ${50 + i * 80} q15 -9 30 0 t30 0" stroke="${C.blue}" stroke-width="3" fill="none"/></g>`).join('');
    // 둑 안: 진흙 위에 물
    body += `<path d="${BAY}" fill="${C.peach}"/>`;
    body += `<g class="water"><path d="${BAY}" fill="${C.sky}"/>${[0, -1.5].map((s, i) => `<g class="sway" style="animation-delay:${s}s"><path d="M${250 + i * 50} ${160 + i * 60} q15 -9 30 0 t30 0" stroke="${C.blue}" stroke-width="3" fill="none"/></g>`).join('')}</g>`;
    // 4칸: 새 땅
    body += shown(4, g('fin fin4', `<path d="${BAY}" fill="${C.mint}"/>`));
    body += `<path d="M0 0 H300 C340 28 380 62 410 92 C330 98 222 108 190 150 C164 190 172 240 210 262 C258 286 340 282 410 280 C392 312 364 338 344 360 H0 Z" fill="${C.mint}" stroke="${C.green}" stroke-width="3" stroke-linejoin="round"/>`;
    body += text(80, 60, '육지', { size: 22, color: C.green }) + text(560, 196, '바다', { size: 22, color: C.blue });
    body += ring(300, 190, 70, 1, C.blue, 0.4);
    // 2칸: 둑
    body += shown(2, `<path class="draw draw2" pathLength="1" d="M410 84 V288" stroke="${C.muted}" stroke-width="14" stroke-linecap="round"/>`);
    body += at(2, 'pop', tag(462, 66, '둑', PLAIN, { size: 22 }), 1.4);
    // 3칸: 물을 빼낸다
    body += at(3, 'pop', `<rect x="402" y="172" width="16" height="30" rx="3" fill="${C.blue}"/>`);
    body += shown(3, g('fin fin3', flow([[424, 187], [492, 187]], C.blue), 0.3), 4);
    css += `
      .sc-${id} .water { transform-box: fill-box; transform-origin: 100% 50%; transition: transform 1.7s ease-in .3s; }
      .on3 .sc-${id} .water { transform: scaleX(0); }`;
    // 4칸: 논과 공장
    const field = [[214, 150], [256, 150], [214, 196], [256, 196]].map(([x, y], i) => at(4, 'pop', `<rect x="${x}" y="${y}" width="38" height="40" rx="3" fill="${C.green}" opacity=".75"/><path d="M${x + 8} ${y + 4} V${y + 36} M${x + 19} ${y + 4} V${y + 36} M${x + 30} ${y + 4} V${y + 36}" stroke="${C.mint}" stroke-width="2"/>`, 0.4 + i * 0.15)).join('');
    const factory = (x, y, s) => at(4, 'rise', `<path d="M${x} ${y} V${y - 30} L${x + 18} ${y - 42} V${y - 30} L${x + 36} ${y - 42} V${y - 30} L${x + 54} ${y - 42} V${y} Z" fill="white" stroke="${C.ink}" stroke-width="2.5" stroke-linejoin="round"/><rect x="${x + 40}" y="${y - 62}" width="10" height="24" fill="${C.ink}"/><g class="up" style="--up:-22px"><circle cx="${x + 45}" cy="${y - 70}" r="6" fill="${C.line}"/></g>`, s);
    body += field + factory(318, 258, 1.1) + factory(318, 196, 1.3);
    body += at(3, 'pop', tag(280, 124, '새 땅', OK, { size: 20 }), 1.5);
    put('4-2/사회/3-1/간척', svg(id, body, css));
  })();

  // ── 생태 통로: 찻길 위에 동물이 건너는 다리를 놓는다(위에서 본 모습) ──
  (function () {
    const id = 't42-s31-tongno';
    let css = base(id);
    const RL = 280, RR = 360, BY = 130, BH = 104, PY = 196;
    let body = `<rect width="640" height="360" fill="${C.mint}"/>`;
    const trees = [[40, 40, 20], [112, 58, 18], [196, 36, 20], [250, 92, 16], [56, 120, 18], [150, 120, 20], [44, 262, 18], [134, 286, 20], [228, 266, 18], [196, 330, 16],
      [400, 40, 18], [478, 64, 20], [566, 36, 20], [612, 104, 16], [440, 120, 18], [532, 128, 20], [414, 270, 18], [496, 290, 20], [590, 262, 18], [606, 334, 16]];
    body += trees.map(([x, y, r]) => tree(x, y, r)).join('');
    body += text(90, 346, '숲', { size: 20, color: C.green }) + text(552, 346, '숲', { size: 20, color: C.green });
    // 찻길과 달리는 차
    body += `<rect x="${RL}" y="0" width="${RR - RL}" height="360" fill="${C.muted}"/><path d="M${RL + 3} 0 V360 M${RR - 3} 0 V360" stroke="white" stroke-width="3"/>`;
    body += `<g class="lane"><path d="M320 -40 V400" stroke="${C.yellow}" stroke-width="3" stroke-dasharray="18 14"/></g>`;
    const car = (x, color, dir) => `<rect x="${x - 13}" y="${dir > 0 ? -60 : 400}" width="26" height="44" rx="7" fill="${color}"/><rect x="${x - 9}" y="${(dir > 0 ? -60 : 400) + (dir > 0 ? 28 : 6)}" width="18" height="10" rx="3" fill="${C.sky}"/>`;
    body += `<g clip-path="url(#${id}-road)">${[[C.blue, 0], [C.red, -1.4], [C.yellow, -2.6]].map(([c, s]) => `<g class="cd" style="animation-delay:${s}s">${car(300, c, 1)}</g>`).join('')}${[[C.orange, -0.6], [C.purple, -2]].map(([c, s]) => `<g class="cu" style="animation-delay:${s}s">${car(340, c, -1)}</g>`).join('')}</g>`;
    body = `<defs><clipPath id="${id}-road"><rect x="${RL}" y="0" width="${RR - RL}" height="360"/></clipPath></defs>` + body;
    css += `
      .sc-${id} .cd { animation: ${id}-cd 3.6s linear infinite; }
      .sc-${id} .cu { animation: ${id}-cu 3.6s linear infinite; }
      .sc-${id} .lane { animation: ${id}-lane 1.2s linear infinite; }
      @keyframes ${id}-cd { from { transform: translateY(0); } to { transform: translateY(480px); } }
      @keyframes ${id}-cu { from { transform: translateY(0); } to { transform: translateY(-480px); } }
      @keyframes ${id}-lane { from { transform: translateY(-32px); } to { transform: translateY(0); } }`;
    // 고라니 발자국: 두 갈래 굽 자국이 걸음마다 찍힌다
    const hoof = (x, y) => `<path d="M${x - 1} ${y + 9} C${x - 9} ${y + 9} ${x - 9} ${y - 2} ${x - 2} ${y - 10} Z M${x + 1} ${y + 9} C${x + 9} ${y + 9} ${x + 9} ${y - 2} ${x + 2} ${y - 10} Z" fill="${C.ink}"/>`;
    const steps = (x0, x1, n, s0) => { let out = ''; for (let i = 0, x = x0; x <= x1; i++, x += 30) out += at(n, 'pop', `<g transform="rotate(90 ${x} ${PY + (i % 2 ? 11 : -11)})">${hoof(x, PY + (i % 2 ? 11 : -11))}</g>`, f(s0 + i * 0.22)); return out; };
    // 2칸: 찻길 앞에서 막힌다
    body += at(2, 'pop', tag(120, PY - 40, '고라니', HOT, { size: 20 }));
    body += steps(70, 254, 2, 0.3);
    body += shown(2, g('pop pop2', `<path d="M258 ${PY - 16} l24 24 M282 ${PY - 16} l-24 24" stroke="${C.red}" stroke-width="6" stroke-linecap="round"/>`, 1.6), 3);
    // 3칸: 흙과 풀을 덮은 다리
    let bridge = `<rect x="${RL - 8}" y="${BY + 6}" width="${RR - RL + 16}" height="${BH}" fill="${C.ink}" opacity=".25"/>`;
    bridge += `<rect x="${RL - 30}" y="${BY}" width="${RR - RL + 60}" height="${BH}" rx="6" fill="#bfe0cf" stroke="${C.green}" stroke-width="4"/>`;
    bridge += [[RL - 16, BY + 14], [RR + 16, BY + 14], [RL - 16, BY + BH - 14], [RR + 16, BY + BH - 14], [RL + 6, BY + BH - 12], [RR - 6, BY + BH - 12]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="8" fill="${C.green}"/>`).join('');
    body += at(3, 'pop', bridge, 0.2);
    body += at(3, 'pop', tag(320, BY + 30, '생태 통로', OK, { size: 18 }), 1);
    // 4칸: 다리를 건너 건너편 숲으로
    body += steps(280, 560, 4, 0.2);
    body += ring(560, PY, 26, 4, C.orange, 2.8);
    put('4-2/사회/3-1/생태 통로', svg(id, body, css));
  })();

  // ════ 3-2 도시의 특징과 삶의 모습 ════

  // ── 인구: 세종특별자치시에 사는 사람 수(2012년 약 11만 명 → 2023년 약 38만 명, 동아 126쪽) ──
  (function () {
    const id = 't42-s32-ingu';
    let css = base(id);
    let body = '';
    body += at(1, 'fin', text(250, 44, '세종특별자치시', { size: 22 }));
    const pos = (i) => [70 + (i % 10) * 40, 132 + Math.floor(i / 10) * 60];
    for (let i = 0; i < 38; i++) {
      const [x, y] = pos(i);
      if (i < 11) body += at(1, 'pop', person(x, y, C.green), f(0.2 + i * 0.12));
      else body += shown(2, `<g class="walk" style="transition-delay:${f((i - 11) * 0.08)}s">${person(x, y, C.orange)}</g>`);
    }
    css += `
      .sc-${id} .walk { opacity: 0; transform: translateX(260px); transition: transform 1.1s ease-out, opacity .5s ease; }
      .on2 .sc-${id} .walk { opacity: 1; transform: none; }`;
    // 아이콘 하나 = 1만 명
    body += person(76, 350, C.muted, 0.7) + text(92, 346, '= 1만 명', { size: 18, anchor: 'start', color: C.muted });
    // 오른쪽: 해와 사람 수
    body += shown(1, tag(552, 96, '2012년', PLAIN, { size: 20 }) + tag(552, 146, '약 11만 명', OK, { size: 20 }), 3);
    body += at(3, 'pop', tag(552, 96, '2023년', PLAIN, { size: 20 }));
    body += at(3, 'pop', tag(552, 146, '약 38만 명', HOT, { size: 20 }), 0.3);
    // 2칸: 도시가 개발되며 건물이 올라간다
    const bld = [[486, 64, 1], [516, 104, 2], [546, 84, 3], [576, 124, 4], [606, 74, 5]];
    body += shown(2, bld.map(([x, h, k]) => `<g class="growy growy2" style="transition-delay:${f(k * 0.15)}s"><rect x="${x - 13}" y="${330 - h}" width="26" height="${h}" fill="white" stroke="${C.purple}" stroke-width="2.5"/>${Array.from({ length: Math.floor(h / 22) }, (_, j) => `<rect x="${x - 6}" y="${330 - h + 8 + j * 22}" width="12" height="8" fill="${C.lilac}"/>`).join('')}</g>`).join('') + `<path d="M466 330 H626" stroke="${C.ink}" stroke-width="3"/>`);
    body += ring(552, 146, 60, 3, C.orange, 0.5);
    // 4칸
    body += glowRect(46, 84, 408, 236, 4, C.green, 0.1, 14) + glowRect(486, 124, 132, 44, 4, C.orange, 0.5, 22);
    body += at(4, 'pop', tag(552, 40, '인구', OK, { size: 24 }), 0.9);
    put('4-2/사회/3-2/인구', svg(id, body, css));
  })();

  // ── 수도권: 서울특별시와 둘레의 인천광역시·경기도를 한 덩어리로(실제 경계) ──
  const SD = {
    '서울특별시': 'M162.1 166.1L167.3 159.7L166.8 157.8L167.6 156.4L175.4 162.8L178.8 161.5L180.2 158.5L180.5 159.5L182.3 159.3L184.3 148.9L183.1 147.9L186.1 148.5L189.6 146L191.1 147.2L191.5 151.6L195.2 150.4L194.5 146.6L196.7 144.5L196.4 142.1L198.9 141.1L199.9 137.9L201.8 138L202.5 139.7L205 139.3L205.3 140.8L207.2 139.1L209.5 138.9L212.2 140.3L211.7 147.8L212 148.8L214.5 149.2L213.4 153.2L215.4 154.1L215.3 158.5L213 161.9L213.6 165.7L224.5 161L225.2 166.3L225.4 167.6L222.4 167.9L219.2 173.7L219 175.5L222.1 176.5L220 180.9L217.8 181.4L217.8 182.6L216.6 182.4L215.4 184.5L213.5 183.8L211 187L208.6 187.6L208.2 189.9L205.7 190.2L203 188.3L202.9 183.4L199.8 185.2L198.2 182.7L193.7 185.3L192 188L188.5 188.9L186.7 186.1L182.9 189.2L177.8 177.6L174.3 180L174.1 181.6L169.4 181.4L170.7 178.9L169.2 177.2L171.3 174.6L170.6 168.7L168.3 168.2L166.4 169.7L165.8 168.1L162.1 166.1Z',
    '인천광역시': 'M62 220.2L63.6 225L65.1 224.1L67 226.9L70.8 227.9L67.4 229.9L68 231.5L63.4 232.4L62.3 231.4L63.2 231L62.5 229.6L61 229.9L61.2 228.4L58.5 229.9L60.8 220.3L62 220.2ZM118.9 225.6L115.3 229.5L114.4 228.2L111.2 227.8L110.7 222.1L111.9 221.5L111.6 219.9L113.5 220.4L114.6 219.1L114.7 218.1L117.1 217.3L121.2 219.4L121.8 223.1L121.1 223.8L119.6 222.7L119.6 223.7L118 223.8L118.9 225.6ZM122 170.6L124.2 170.1L125.4 171.8L131.5 173.8L134.1 178.6L131.5 180.5L122.6 183.1L119.4 187.2L113 191.7L109.5 191.6L107.7 188.4L106.6 189.3L107 188.3L105.6 186.9L103.4 189L102.9 187.8L101 187.7L102.1 186.6L99.7 183.6L100.2 181.7L102.5 181.8L109.1 177.1L117.9 176.6L120.7 175.1L122 170.6ZM166.2 160.9L163.5 164L163.8 165L161.8 165.9L161.1 173.1L158.3 174.9L158.5 179.1L162.3 182L163.9 182L164 185.9L162.7 186.6L162.5 190.5L160.1 191.4L159.9 193.6L155.3 199.1L149.8 198.3L151.3 199L146.6 205.3L143.2 205.9L144.6 206.4L143 206.9L139.1 206.7L138.8 205.8L138.4 207.7L138.2 206.6L133.9 207.8L136.2 205.9L134.2 205.9L134.2 204.4L142.7 204.4L140.1 204.4L140 205.8L143.2 205.8L145.1 204.2L139.3 199.7L138 196.9L138.3 192.6L137 192.6L138 190.6L141.8 190.6L142.1 192.3L142.1 190L138.4 190L138.9 188.4L138 187.9L139.6 187.2L138.5 185.3L137 188.4L135.8 187.8L135.8 185.2L137.3 184.9L136 184.8L136.1 183.4L140.5 184.7L139.9 183.7L140.9 183.9L139 183L140.6 183L138.7 180.9L138 182.8L136.8 183L136.5 180.9L137.8 179.2L137.6 180.4L139.4 179.7L138.3 179L140.8 178L142.7 179.7L141 177.8L142.9 177.4L142.8 175.7L140.3 177.3L137.5 177.3L136.3 167.2L137.8 166.1L135.1 164.3L133 159.6L139 156.2L140.7 156.9L142.5 152.2L144 152.1L145 150L151.2 153.5L152.8 155L152.7 156.9L154.1 156.6L155.9 158.9L158.7 158.8L159.9 161.3L162.3 159.6L166.2 160.9ZM95.7 129.3L94.4 131.1L94 135.5L97.2 138.4L101.5 139.3L103.2 141.7L102 145.1L97 148.5L95.1 146.5L95.6 143.9L94.1 141.6L86.5 136.1L88.5 136.4L89.3 135.4L90.1 129.6L94.2 128.1L95.7 129.3ZM86.1 116L90.4 118.6L93.2 118.6L94.9 117.4L96.3 119.6L95.9 121.1L93.5 124L89.7 126.1L87 124.9L82.1 126.3L80.9 128.3L76.7 124.4L78.5 123.1L79.5 118L81.8 115.9L86.1 116ZM112.3 114.2L114.9 117.4L122.6 122.4L123.3 126.1L125.6 129.1L123.5 134.9L125.3 137.5L124.2 143L126.4 144.8L125 147.1L127 153.1L127.7 152.6L128.3 153.7L124.7 155.3L123.9 158L125 157.7L124.3 158.9L125.6 159.6L124.2 161.2L122.1 159.3L123.7 158.6L123.5 157.5L122.3 158.1L118.5 156.3L118.4 157.4L115.8 159.4L113.4 158.4L107.3 158.5L102.1 155.1L103 153.6L101.2 150.7L106.8 149.1L107.9 146L106.9 142.7L104.6 140.1L105.2 139.2L100.1 137.4L99 135L99.7 130.3L98.9 120.5L104.4 117.6L105.3 114.5L108.5 114.8L110.5 112.9L112.3 114.2Z',
    '세종특별자치시': 'M241 331.9L244.4 333.5L244 336.3L241.5 338L240.6 341.1L239.5 341.6L240.1 342.8L242 342.6L244.2 348.8L243.2 352L246.5 352.4L248.7 356L254.9 356L227.8 356L228.9 352.9L226.9 352.9L226.7 350.4L225.7 351L221.2 348L220.5 345.5L221.9 344.6L220.9 340.6L222 338.5L221.1 336.9L222.5 334.2L222.1 332L221.5 330.9L221.4 331.8L219.1 332L218.3 329.1L217.1 328.5L221.9 323.8L228.5 325L235.3 331L241 331.9Z',
    '경기도': 'M158.5 265.2L160.6 261.9L148.9 249.8L149.5 248.6L148.3 246L149.8 243.7L151.4 243.5L149.4 241.7L144.4 242.8L146.1 241L144.9 237.8L145.9 238.6L147.4 236.2L145.6 236L144.3 237.2L146.1 230.1L144.1 225.9L143.8 223L145 220.7L141.8 217.5L143.9 219L146.1 216.6L144.3 216.3L141.3 217.8L146.2 216.4L146.2 219.1L149.6 218.6L147.7 220.1L148.9 223.1L151.7 222.4L155.8 223.3L157.2 224.6L160.5 223.7L161.9 225.4L163.4 225L164.7 228.4L163.9 225.3L165.6 225.6L165.8 221.3L166.6 220.6L168.9 221.1L167.8 219.4L167.9 216.1L170.1 216.8L173.5 221.1L173 219.5L171.4 218.7L169.8 215.3L162.3 216.4L148.4 211L147.6 209.4L139 212.4L133.5 216.3L134.6 216.7L134.3 217.9L135.1 216.8L138.3 218.9L135.2 216.9L134.6 217.7L140.5 221.8L142.4 220.2L143.1 222.1L143.2 220.2L141.5 218.6L143 219.9L142.4 223.7L145.1 229.3L144.7 234.5L143.6 235.6L143.8 231.9L140.8 230.4L140 227.3L139.6 228.4L135 227.7L138.3 230.1L139.1 232.3L137.5 231.8L137.2 232.6L137 230L135.3 231.5L134.8 230.2L133.2 230.1L131 235.4L128.2 231.4L130.3 230.7L127.8 228.6L132 227.1L130.9 226L131.2 223.5L128.9 218.8L126.6 217L130 218.1L130.2 219.4L131.4 219.1L133.3 216.8L132.5 215.4L133.4 216.3L137.9 212.4L150.7 208.1L150.2 205.6L152.5 205.1L156.7 198.3L158.4 199.1L157.2 197.8L158.7 196L165.8 196.8L165.5 195L164.7 197.2L159.5 195.1L160.1 191.4L162.5 190.5L162.7 186.6L164.2 185.2L163.9 182L162.3 182L158.5 179.1L158.3 174.9L161.1 173.1L162.1 166.1L165.8 168.1L166.4 169.7L168.3 168.2L170.6 168.7L171.3 174.6L169.2 177.2L170.7 178.9L169.4 181.4L174.1 181.6L174.3 180L177.8 177.6L182.9 189.2L186.7 186.1L188.5 188.9L192 188L193.7 185.3L198.2 182.7L199.8 185.2L202.9 183.4L203 188.3L205.7 190.2L208.2 189.9L208.6 187.6L211 187L213.5 183.8L215.4 184.5L216.6 182.4L217.8 182.6L217.8 181.4L220 180.9L222.1 176.5L219 175.5L219.2 173.7L222.4 167.9L225.4 166.9L224.5 161L213.6 165.7L213 161.9L215.3 158.5L215.4 154.1L213.4 153.2L214.5 149.2L212 148.8L211.7 147.8L212.2 140.3L209.5 138.9L207.2 139.1L205.3 140.8L205 139.3L202.5 139.7L201.8 138L199.9 137.9L198.9 141.1L196.4 142.1L196.7 144.5L194.5 146.6L195.5 149.6L193.9 151.3L191.5 151.6L191.1 147.2L189.6 146L186.1 148.5L183.1 147.9L184.3 148.9L182.3 159.3L180.5 159.5L180.2 158.5L178.8 161.5L175.4 162.8L167.6 156.4L166.2 160.9L162.3 159.6L159.9 161.3L158.7 158.8L155.9 158.9L154.1 156.6L152.7 156.9L152.8 155L145.5 150.1L144 152.1L142.5 152.2L140.7 156.9L139 156.2L135.5 158.7L135.6 157.5L133.5 156.4L132.8 157.5L130.7 157.1L128.8 150.8L126.4 146.9L128.3 145.3L125.7 143.1L126.7 140.1L124.9 135.4L126.3 129.1L124.4 126.1L125.3 125L124.2 124.5L125.1 120.9L133.1 126.1L135.9 126.4L140.7 123L146.3 122.7L147.6 112.3L145.8 111.2L149 110L150.8 105.8L149.5 104.8L147.8 105.5L147.7 104.1L149.2 103.6L148.1 102.7L147.5 102.1L149.4 97.3L146.8 96.1L147.6 89.2L150.1 88.8L152.6 85.4L155 87.3L157.6 87.1L160.9 83.7L163 84.8L163 83.7L164.7 84.1L165.7 80.8L169.8 80.1L171.2 75.9L171.4 76.9L173.4 74.3L175.6 74.4L175.2 70.4L177.8 65.7L175.7 61.5L176.7 59.8L179.8 58.4L180.7 55.9L183.1 54.1L185 54.4L186.6 56.2L192.5 54.2L192.7 52.3L189.9 49.4L192.4 47.7L192.5 42.4L193.8 42.3L195.1 40.2L194.8 36.9L196.3 36.6L198.3 38.1L201.2 34.2L200.7 33.4L203.2 32.7L203.9 30.9L207.7 30L209.5 27.1L213.3 26.7L214.9 35.2L217.5 35.9L220.2 34.1L222.4 34.9L221.9 38.5L223.6 39.6L224.3 43.9L225 44.9L226.4 44.5L226.4 49.6L230.9 53.9L231.6 52.4L233.3 52.3L234 50.5L236.5 49.3L238.1 46L240.6 45.5L242.9 47L240.9 49.8L239.5 56.6L241.1 58.6L244.7 57.9L246.3 62.4L248.9 63.3L249.2 61.3L253.2 60.1L255.1 57.9L259 59L259.2 60.8L260.4 61L263 58.5L265.3 61.9L265.2 69.6L268 78.4L274.2 81L279.7 80.6L280.5 86.8L289.2 89.2L291.3 94.4L290.6 95.2L291.4 98.6L289.7 104.3L285.4 104.8L281.1 110L278.1 111.4L277.4 113.3L279.3 117L276.8 120.4L280.4 126.6L275.3 131.2L274.7 134.2L275.4 135.2L277.7 133L280.1 134.4L282.2 132.6L283 134.3L281.3 140.4L281.6 145.6L279 147.6L279.4 149.4L282.6 151.9L285.9 150.9L286.5 149.2L289.1 147.5L290.2 147.8L296 151.1L296.6 152.9L298.6 153L305.1 159.9L312.2 158.9L316.8 161.6L318.3 160.2L321.5 164.3L326.5 166.5L325.6 169.1L320.7 169.2L316.7 174.2L313.1 175.9L313.1 177.9L315.4 178.1L317.6 181.4L319.2 181.8L319.8 190.2L318.4 190.9L316.8 197.9L315.7 198.9L316 201.3L313 202L313 208.9L314.4 213.2L314.3 214.4L311.5 215.8L313.2 220.1L311.1 226.5L311.4 230.6L309.4 232.6L308 237.5L306.6 237.3L305 239.8L303.3 245.5L302 246.6L299.5 246.4L295.9 243.5L293.1 242.7L294.5 245.4L294.1 253.3L290.6 255.8L288.2 255.5L289.5 259.3L285.5 258L283.5 260.9L284.2 263.3L282.3 264.6L276.4 261.3L274.3 263.3L271.5 262L268.8 262.2L267 264.4L267.3 268.6L265.6 270.4L262.8 272.1L257.3 273.1L256.1 275.6L258.6 278.7L256.5 279.3L254.7 282.4L252 282.5L250.7 281.6L247.3 284.8L242.4 285.8L243.7 288.5L241.7 292.8L236.1 287.4L234.7 288.3L229.5 285.7L228.3 281.8L219.4 278.1L217.3 278.9L214.6 278L212.3 280.3L213.2 281.6L212.2 283.6L210.7 282.5L208.9 284.3L207.6 283.6L202.3 286.3L200 284.9L196.9 284.9L183.9 291.4L182.2 285.9L180.4 284.7L177.4 285.3L176.7 282.3L175.4 282.4L176.1 283.6L174.7 282.8L171.2 275.2L170.4 275.4L170.8 274.2L169 273.5L168.5 274.7L167.8 273L165.5 273.4L164 271.1L166.8 269.8L166.4 267.4L159.7 266.8L158.5 265.2ZM160.6 261.8L162.8 260.1L161.6 260.4L161.4 259.4L162.8 253L160.9 251.1L161.2 249.9L164.5 246.6L166.4 247.8L167.4 246L169.7 245L167.1 243L164.4 243.3L166.9 241.3L166.6 238.3L167.2 234.9L166.4 237.7L163.8 240.8L159.2 240.3L156.1 245.9L154.2 247.5L152.9 247.2L152.7 248.9L149.6 250.5L160.6 261.8Z',
    '강원도': 'M400 4L399.9 243.6L396.7 244.7L394.6 246.7L391.1 244.2L389.8 241.7L392.3 239.2L394.9 239.6L394.5 237.3L396.8 236.5L397.2 234.8L399.4 234.4L400 231.3L397.7 229.6L390.4 232.6L387.7 228.4L384.3 228.7L382.2 225.3L380.2 224.7L376.1 227.9L375.9 230.5L374.5 231.6L368.6 227.5L366.1 233L360.9 235.4L355.3 236.2L353.9 233.5L355.5 231L353.1 229.2L352.5 225.6L346.5 222.9L340.3 226.3L337.7 229.2L339.3 232.8L339.5 238.8L338.1 240.9L335.7 240.4L334.2 243.8L332.4 241.6L330.1 241L328.5 242.7L327.1 241.8L326.3 243.2L317.6 245L314 242L310.7 232L311.1 226.5L313.2 220.1L311.5 215.8L314.3 214.4L314.4 213.2L313 208.9L313 202L316 201.3L315.7 198.9L316.8 197.9L318.4 190.9L319.8 190.2L319.2 181.8L317.6 181.4L315.4 178.1L313.1 177.9L313.1 175.9L316.7 174.2L320.7 169.2L325.6 169.1L326.5 166.5L321.5 164.3L318.3 160.2L316.8 161.6L312.2 158.9L305.1 159.9L298.6 153L296.6 152.9L296 151.1L290.2 147.8L289.1 147.5L286.5 149.2L285.9 150.9L282.6 151.9L279.4 149.4L279 147.6L281.6 145.6L281.3 140.4L282.7 132.7L279.7 134.4L277.4 133.1L275.4 135.2L274.7 132.2L280.4 126.6L276.8 120.4L279.3 117L277.5 114.6L277.5 112.7L279.2 110.4L283.2 108.1L284.2 105.9L286.5 104.4L289.3 104.7L290.2 103L291.3 94.4L289.2 89.2L280.5 86.8L279.7 80.6L274.2 81L268 78.4L265.2 69.6L265.3 61.9L263 58.5L260.4 61L259.2 60.8L259 59L255.1 57.9L253.2 60.1L249.2 61.3L248.9 63.3L245.8 61.7L244.7 57.9L241.1 58.6L239.5 56.6L240.9 49.8L242.9 46.8L240.6 45.5L238.1 46L236.5 49.3L234 50.5L233.3 52.3L231.6 52.4L231.3 54.2L226.6 49.9L226.4 44.5L225 44.9L224.3 43.9L223.6 39.6L221.9 38.5L222.4 34.9L220.2 34.1L216.3 35.9L214.3 34.2L214.4 28.9L212.2 26.1L214.5 23.9L217 23.1L217.7 20.4L218.8 20L221.2 22.3L234.5 16.7L236.2 17.9L240.8 17.9L243.3 20.5L247.5 19.5L249.9 17.5L252.6 18.4L255.6 15.9L262.6 17.9L265.1 19.8L266.6 19.5L266.2 17.9L267.3 18L273.2 23.1L285.4 16L290.2 16L291.2 17.9L293.9 18.7L301.6 18.4L304.1 16.1L306.4 17.4L310.9 14.8L311.8 16.5L314.5 16.3L316.5 13.6L318.8 18.6L322.5 22.3L330.6 19.8L332.7 21.3L333.6 20.6L338.5 21.2L343.2 23L347.4 28.1L348.5 27.1L350 27.7L351.9 25.3L352.4 20.3L358.3 21.5L361.8 20.4L367.2 16L370.2 16.7L371.8 14.8L373.5 14.9L376.2 10.7L377.6 11.4L378.8 9L380.8 8.6L381.9 9.6L384.8 4Z',
    '충청북도': 'M241.3 292.9L243.7 288.5L242.4 285.8L247.3 284.8L250.7 281.6L252 282.5L254.7 282.4L256.5 279.3L258.6 278.7L256.1 275.6L257.3 273.1L262.8 272.1L265.6 270.4L267.3 268.6L267 264.4L268.8 262.2L271.5 262L274.3 263.3L276.4 261.3L282.3 264.6L284.2 263.3L283.5 260.9L285.5 258L289.5 259.3L288.2 255.5L290.6 255.8L294.1 253.3L294.5 245.4L293.1 242.7L295.9 243.5L299.5 246.4L302.3 246.5L305 239.8L306.6 237.3L308 237.5L309.4 232.6L310.7 231.3L312.5 239.7L317.6 245L326.3 243.2L327.1 241.8L328.5 242.7L330.1 241L332.4 241.6L334.2 243.8L335.7 240.4L338.1 240.9L339.5 238.8L339.3 232.8L337.7 229.2L338.4 228.1L345 223.4L347.4 223L352.5 225.6L353.1 229.2L355.5 231L353.9 233.5L355.3 236.2L360.9 235.4L366.1 233L368.6 227.5L374.5 231.6L375.9 230.5L376.1 227.9L380.2 224.7L382.2 225.3L384.3 228.7L387.7 228.4L390.4 232.6L397.7 229.6L400 231.3L399.4 234.4L397.2 234.8L396.8 236.5L394.5 237.3L394.9 239.6L392.3 239.2L389.8 241.7L391.1 244.2L394.6 246.7L396.7 244.7L400 243.5L400 307.7L397.7 307.7L392.5 300.1L390.5 299.3L386.4 297L385.3 298.8L385.6 302.2L381.9 301.4L382.2 308.6L373.2 306.7L371.2 304.5L366.3 306.8L366 309.2L363.7 310.3L363.8 311.5L362.3 311L360.5 308.1L358.6 307.7L358 312.3L354.5 320.9L359.9 325.8L360.3 328.6L357.2 328.6L351.9 324.3L349.9 326.8L347.6 326.7L343.6 322.9L341.9 328.5L339.5 328.8L338.8 331.8L333.5 331.1L330.7 333.3L331.4 334.2L334.5 333.5L336.4 334.4L337.1 336.2L339.3 336.9L340.3 340.4L339.3 345.7L338.1 346.3L338.2 348.7L337.4 349L335.5 344.3L333 343.7L331.4 338.4L328.4 342.5L326.3 342.7L326.8 345.5L328.1 346.7L325.4 347.7L322.4 346.7L318.6 350.2L319 351.9L322.9 354.8L327.2 354.8L328.7 356L248.7 356L246.5 352.4L243.2 352L244.2 348.8L242 342.6L240.1 342.8L239.5 341.6L240.6 341.1L241.5 338L244 336.3L244.3 334.2L243.8 332.9L241 331.9L244.5 329.1L244.8 325.5L247.1 323.6L248.8 324.4L249.7 323.6L248.6 320L253.6 318.3L256.3 318.7L259.1 321.2L261.5 318.4L260.3 316L257.7 314.2L258.5 311.1L255.6 308.2L252 306.6L251.7 305.4L248.5 305L248.8 300.4L244.3 299.4L244.4 294.5L241.3 292.9Z',
    '충청남도': 'M102.6 349.9L102.7 353.2L100.1 354.6L102.6 356L94.1 356L93 352.5L94.1 351.9L94.6 352.5L95 351.5L94.6 349.6L100.2 346.9L102.6 349.9ZM151.2 272.4L164.6 277.3L164.1 278.9L166.3 283.2L165.9 284.6L167.6 287L168.2 285.7L169 286.8L169.8 292.4L171.3 293.9L176.6 295.5L183.3 293.9L184.9 290.5L196.9 284.9L200 284.9L202.3 286.3L207.6 283.6L208.9 284.3L210.7 282.5L212.2 283.6L213.2 281.6L212.3 280.3L215 278L217.3 278.9L221.8 278.3L221.2 279.3L224.7 279.7L225 280.8L228.7 282.1L229.8 285.9L234.7 288.3L236.1 287.4L239.2 289.5L241 292.8L244.4 294.5L244.3 299.4L248.5 300.1L248.5 305L251.7 305.4L252 306.6L255.6 308.2L258.5 311.1L257.7 314.2L260.3 316L261.4 319L260.3 319L259.1 321.2L256.3 318.7L253.6 318.3L248.6 320L249.7 323.6L248.8 324.4L247.1 323.6L244.8 325.5L244.5 329.1L241 331.9L234.9 330.9L233.5 328.6L229.2 326.4L228.5 325L222.6 323.6L217.3 328.1L219.1 332L221.4 331.8L221.5 330.9L222.1 332L222.5 334.2L221.1 336.9L222 338.5L220.9 340.6L221.9 344.6L220.5 345.5L221.2 348L225.7 351L226.7 350.4L226.9 352.9L228.9 352.9L227.9 356L116.6 356L114.8 350.1L110 348.1L108 348.5L108.6 346.4L102.2 345.3L102.5 344.3L101.2 344.1L99.4 345.7L96.6 345.7L93.3 351.5L92.3 350.1L90 352.2L88.6 350.4L89.5 348.7L88.6 345L89.5 346.4L90.9 345.3L91.4 341.9L88.8 335.5L86 335.6L85.3 331.2L87.1 329.4L86.8 324.8L88.1 324.3L86.5 324.3L83.8 327.4L81.3 326.6L81.9 329.6L80.7 331L77.4 331.4L75.4 335L69.3 334.3L67.9 329.5L70.4 328.5L71 326.8L77.1 329.1L79.5 326.7L78.3 324.8L76.3 326L77.8 322.2L75.3 322.6L73.3 321.1L73.7 319.9L71.8 319.4L67 319.7L68.4 320.9L68.7 323.7L63.8 328.4L66 320.9L64.3 319.9L64.1 317.7L62.6 316.2L66.2 315.5L65.5 313.4L66.7 314L67.8 312.5L68.4 310.2L67.3 309.2L69.1 308.7L68.3 307.7L69.4 307.5L70 305.7L67.7 303.6L69.2 303.4L68.3 302.1L69.3 302.5L69.7 301.5L69.9 302.8L71.6 303.1L70.9 305L72.1 306.2L71.7 308.6L73.6 308.4L74 305.6L72.3 304.7L75.8 300.2L74.5 297.9L73.5 298L74.7 296.1L72.5 294.7L75.6 293.9L76.4 290.8L78 291.7L83.5 289L83.3 289.9L87.6 292.1L90.1 291.5L88.8 290L90.3 286.1L89 278.4L91.9 276.6L91.8 278.7L90 279.6L92.8 280.9L91.5 283.2L92.7 286L91.3 288L94.1 291.1L94.1 293.2L95.9 293.2L95.2 294.5L93.2 294.9L90.5 300.7L90.4 302.9L93.8 303.7L90.5 306.2L88.6 306.1L89.3 311L90.2 311.2L91.9 308.1L94 308.2L94.6 307.1L95.7 308.1L96.9 307.8L93.9 302.6L95.4 299.2L98.4 299.2L97.8 302L99.6 304.6L101.1 305.2L100.1 301.5L101.9 299.8L102.1 297.8L101 296.2L102.7 295.2L106 295.4L105.8 293L111.1 291.9L110.5 290.4L108 290.1L107.1 288L109.1 287.2L109.3 284.5L108.8 285.7L105.8 284.9L104.8 286.5L103.4 283L101.6 282.7L100.3 284.2L100.6 282.1L98.9 281.6L98.8 279.8L96.2 280L96.5 277.6L97.8 278.9L100.7 278.5L101.9 280.1L102.9 278.5L104.7 278.3L102.9 277.6L102.5 275.8L101.1 276.5L95.8 275.3L95.4 272.6L96.1 273.1L100.2 270.2L100.5 271.2L109.1 270.2L109.1 269.2L114.3 271.2L114.7 272.7L117 271.3L115.5 268.6L121.3 260L124.5 261.1L125.9 264.2L127.8 265.7L130.9 265.5L131.1 266.9L142 272.3L151.2 272.4Z',
    '강원도(북)': 'M161.1 4L165.4 10L165.5 13.2L171 15L172.7 18.4L174.6 18.2L178.4 15.4L181 16.5L180.6 20.7L176.9 24L180.1 28.8L177.7 34.4L179.8 39.7L183.2 42.2L186.4 41.8L189.1 49.1L191.7 49.5L192.9 43.8L200.2 35.1L218.7 21.7L223.1 22.6L233.9 17.8L239.4 18.6L242 20.5L247.2 20.3L249 18.8L258.6 17.1L263.7 20.1L266.3 19.8L274.2 23.4L282 18.2L286.7 16.7L289 17.1L290.9 19L297 18.2L301.3 19.4L304.5 17.3L313.7 17.8L317.8 15.5L324.2 23L331.4 20.3L333.3 17.5L343.5 20.5L346.4 19.8L356.7 22.1L361.5 21.3L367.2 17.1L371.6 17.1L376.4 12.3L382.6 8.3L385.8 4Z',
    '황해북도': 'M4 4L4 14L6.8 14.8L8.1 17.8L5.2 21.1L9 22.5L12.3 20L16.7 22.6L17.3 19.8L20.4 19.2L21.6 23L24 25.3L24.5 29.2L28.3 30.9L30.7 33.6L33.6 45.9L36 48.2L46.7 46.6L52.4 43.8L56.1 46.6L57.9 46.8L63.8 41.1L69.6 41.6L76.3 36.1L83.1 34.5L89.1 34.7L104.7 41.8L107.3 44.1L112.8 53.7L112.3 57.8L111.3 58L109.1 52L108.1 51.8L105.9 54.7L103.1 56.2L103.5 58.1L102 60.8L102.9 62.8L105.6 62.6L103.5 70.2L106.7 72.9L104.7 78.5L107.5 82.3L105.2 86.2L104.4 92.9L104.9 95L107.8 96.3L109.1 99.8L107 104L109.9 109L115.8 111.9L117.3 115.9L122.7 116.1L130 121.1L132.8 124.9L136.2 124.7L139.8 121.3L144.9 121.5L144.4 118.8L146.8 112.6L148.5 114.8L150.3 107.7L151.2 97.7L149.9 89.8L152.9 90L158.4 87.7L162.5 87.9L164.8 86.7L175.9 73.9L179.7 63.1L193.2 53.2L191.7 49.5L189.1 49.1L186.4 41.8L183.2 42.2L181 41.3L177.7 35.5L180.3 29.7L176.9 24L180.6 20.7L181 16.5L178.4 15.4L174.6 18.2L172.7 18.4L171 15L165.5 13.2L165.4 10L161.1 4Z',
    '황해남도': 'M4 97.7L5.3 95.4L5 92.7L4 94.3L4 78.1L6.5 77.5L11.7 81.6L16.1 82.5L16.6 83.9L14 87.9L14.7 90.6L16.9 92.1L19.6 91L18.7 92.7L22.6 97.7L24.5 98.3L24.3 100.9L27.1 102.3L30.7 111.7L35 111.1L38.9 113.4L42.1 113.4L42.3 112.3L40.1 110.3L41 106.9L40.1 106.9L38.5 103.6L42 101.7L44.1 102.7L44.7 105L50.3 110.2L52.7 105.2L54.3 105.2L55.6 117.6L58.5 120.9L60.2 121.9L61.4 121.3L60.6 128.6L65.7 130.5L70.4 130.3L71.6 123.8L70.4 122.4L69.8 117.6L68.1 115.5L68.4 113.8L69.3 112.1L77.8 109.6L76.3 105.2L77.8 107.1L82.2 109.2L83.3 108.6L86.2 111.3L86.9 109.4L87.9 110.5L97.4 104.2L105.3 102.7L107.8 97.9L108.4 98.3L107.8 96.3L104.9 95L104.4 92.9L105.2 86.2L107.5 82.3L104.7 78.5L106.7 72.9L103.5 70.2L105.6 62.6L102.9 62.8L102 60.8L103.5 58.1L103.1 56.2L105.9 54.7L108.1 51.8L109.1 52L110.4 56.8L112.3 57.8L112.8 53.7L107.3 44.1L104.7 41.8L86.9 34.4L76.3 36.1L69.6 41.6L63.8 41.1L57.9 46.8L56.1 46.6L52.4 43.8L41.2 48L35.1 47.6L33 43.9L30.7 33.6L28.3 30.9L24.5 29.2L24 25.3L21.6 23L20.4 19.2L17.3 19.8L16.7 22.6L12.3 20L9 22.5L5.2 21.1L8.1 17.8L6.8 14.8L4 14L4 6.6Z'
  };
  (function () {
    const id = 't42-s32-sudo';
    let css = base(id);
    const AREA = ['서울특별시', '인천광역시', '경기도'];
    // 작은 섬은 빼고 큰 땅덩이 테두리만(굵은 둘레·반짝임용)
    const big = (d) => d.split('M').filter(Boolean).filter((r) => { const p = r.replace('Z', '').split('L').map((q) => q.split(' ').map(Number)); let a = 0; for (let i = 0, j = p.length - 1; i < p.length; j = i++) a += (p[j][0] + p[i][0]) * (p[j][1] - p[i][1]); return Math.abs(a / 2) > 300; }).map((r) => 'M' + r).join('');
    let body = `<defs><clipPath id="${id}-map"><rect x="12" y="12" width="380" height="336" rx="14"/></clipPath></defs>`;
    let map = `<rect x="0" y="0" width="400" height="360" fill="${C.sky}"/>`;
    map += Object.keys(SD).filter((k) => !AREA.includes(k)).map((k) => `<path d="${SD[k]}" fill="white" stroke="${C.line}" stroke-width="1.5" stroke-linejoin="round"/>`).join('');
    map += AREA.map((k) => `<path d="${SD[k]}" fill="white" fill-rule="evenodd" stroke="${C.line}" stroke-width="1.5" stroke-linejoin="round"/>`).join('');
    // 3칸 굵은 테두리: 세 곳의 굵은 선을 먼저 깔고 칠을 덮으면 바깥 둘레만 남는다
    map += shown(3, AREA.map((k) => `<path d="${big(SD[k])}" fill="none" stroke="${C.purple}" stroke-width="7" stroke-linejoin="round"/>`).join(''));
    const COL = { 서울특별시: [1, C.peach, C.orange], 인천광역시: [2, C.lilac, C.purple], 경기도: [2, C.mint, C.green] };
    map += AREA.map((k) => { const [n, fill, stroke] = COL[k]; return shown(n, g(`fin fin${n}`, `<path d="${SD[k]}" fill="${fill}" fill-rule="evenodd" stroke="${stroke}" stroke-width="1.8" stroke-linejoin="round"/>`, k === '경기도' ? 0.5 : 0)); }).join('');
    // 3칸: 사람들이 모여든다
    map += shown(3, [[380, 340, 0], [300, 352, 0.5], [392, 250, 1], [360, 300, 1.5], [250, 352, 0.8]].map(([x, y, s]) => `<g class="go" style="animation-delay:${s}s;--dx:${196 - x}px;--dy:${168 - y}px"><circle cx="${x}" cy="${y}" r="7" fill="${C.orange}" stroke="white" stroke-width="2"/></g>`).join(''));
    body += `<g clip-path="url(#${id}-map)">${map}</g><rect x="12" y="12" width="380" height="336" rx="14" fill="none" stroke="${C.line}" stroke-width="2.5"/>`;
    css += `
      .sc-${id} .go { animation: ${id}-go 2.2s ease-in infinite; }
      @keyframes ${id}-go { 0% { opacity: 0; transform: translate(0, 0); } 20% { opacity: 1; } 85% { opacity: 1; } 100% { opacity: 0; transform: translate(var(--dx), var(--dy)); } }`;
    // 지도 위 짧은 이름
    body += at(1, 'pop', text(198, 170, '서울', { size: 18 }), 0.4) + ring(196, 163, 30, 1, C.orange, 0.6);
    body += at(2, 'pop', `<path d="M104 206 L138 196" stroke="${C.purple}" stroke-width="2.5"/>` + text(84, 214, '인천', { size: 18, color: C.purple }), 0.3);
    body += at(2, 'pop', text(250, 108, '경기도', { size: 20, color: C.green }), 0.8);
    // 오른쪽: 셋을 더해 수도권
    body += at(1, 'pop', tag(518, 66, '서울특별시', HOT, { size: 20 }), 0.2);
    body += at(2, 'pop', tag(518, 122, '인천광역시', OLD, { size: 20 }), 0.3);
    body += at(2, 'pop', tag(518, 178, '경기도', OK, { size: 20 }), 0.8);
    body += shown(3, `<path class="grow grow3" d="M424 218 H612" stroke="${C.purple}" stroke-width="3.5"/>`);
    body += at(3, 'pop', tag(518, 262, '수도권', OLD, { size: 26 }), 0.8);
    body += glowPath(AREA.map((k) => big(SD[k])).join(' '), 4, C.purple, 0.1, 4);
    body += glowRect(448, 236, 140, 52, 4, C.purple, 0.5, 26);
    put('4-2/사회/3-2/수도권', svg(id, body, css));
  })();

  // ── 계획 도시: 빈 땅에 설계도 → 길 → 정해 둔 자리마다 건물 ──
  const LOTS = { 관청: [52, 34, 248, 130], 학교: [342, 34, 248, 130], 공원: [52, 202, 248, 128], 집: [342, 202, 248, 128] };
  const plan = (cls = '') => `<g class="${cls}" fill="none" stroke="${C.blue}" stroke-width="2.5" stroke-dasharray="9 7">${Object.values(LOTS).map(([x, y, w, h]) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8"/>`).join('')}<path d="M30 172 H610 M30 196 H610 M308 20 V340 M332 20 V340"/></g>`;
  const buildings = {
    관청: `<path d="M140 92 L196 66 L252 92 Z" fill="${C.lilac}" stroke="${C.purple}" stroke-width="2.5" stroke-linejoin="round"/><rect x="146" y="92" width="100" height="56" fill="white" stroke="${C.purple}" stroke-width="2.5"/>${[0, 1, 2, 3].map((i) => `<rect x="${156 + i * 23}" y="100" width="9" height="40" fill="${C.lilac}"/>`).join('')}<path d="M196 66 V44" stroke="${C.ink}" stroke-width="2.5"/><path d="M196 44 H214 V54 H196" fill="${C.red}"/>`,
    학교: `<rect x="410" y="96" width="150" height="54" fill="white" stroke="${C.orange}" stroke-width="2.5"/><rect x="462" y="70" width="46" height="80" fill="white" stroke="${C.orange}" stroke-width="2.5"/><circle cx="485" cy="88" r="10" fill="${C.peach}" stroke="${C.orange}" stroke-width="2.5"/><path d="M485 81 V88 H491" stroke="${C.ink}" stroke-width="2"/>${[0, 1, 2, 3].map((i) => `<rect x="${420 + (i > 1 ? 104 : 0) + (i % 2) * 18}" y="108" width="12" height="12" fill="${C.sky}"/>`).join('')}<rect x="477" y="128" width="16" height="22" fill="${C.peach}"/>`,
    공원: `<ellipse cx="226" cy="290" rx="44" ry="20" fill="${C.sky}" stroke="${C.blue}" stroke-width="2.5"/>${tree(110, 290, 16)}${tree(150, 268, 18)}${tree(262, 248, 15)}${tree(102, 248, 14)}`,
    집: [0, 1, 2].map((i) => { const x = 420 + i * 56, h = [80, 100, 70][i]; return `<rect x="${x}" y="${318 - h}" width="40" height="${h}" fill="white" stroke="${C.green}" stroke-width="2.5"/>${Array.from({ length: Math.floor(h / 20) }, (_, j) => `<rect x="${x + 7}" y="${318 - h + 8 + j * 20}" width="9" height="8" fill="${C.mint}"/><rect x="${x + 24}" y="${318 - h + 8 + j * 20}" width="9" height="8" fill="${C.mint}"/>`).join('')}`; }).join('')
  };
  (function () {
    const id = 't42-s32-gyehoek';
    let css = base(id);
    let body = `<rect x="30" y="20" width="580" height="320" rx="10" fill="${C.peach}" opacity=".55"/>`;
    // 1칸: 설계도(점선)와 자리 이름
    body += shown(1, g('fin fin1', plan(), 0.2));
    Object.entries(LOTS).forEach(([k, [x, y]], i) => { body += at(1, 'pop', text(x + 14, y + 28, k, { size: 20, anchor: 'start', color: C.blue }), 0.6 + i * 0.25); });
    // 2칸: 길
    body += shown(2, `<rect class="grow grow2" x="30" y="172" width="580" height="24" fill="${C.muted}"/><rect class="growy growy2" x="308" y="20" width="24" height="320" fill="${C.muted}"/><path class="grow grow2" d="M30 184 H610" stroke="white" stroke-width="2.5" stroke-dasharray="12 10"/>`);
    css += `.sc-${id} .growy { transform-origin: 50% 0; transition-duration: 1.2s; }`;
    // 3칸: 정해 둔 자리마다 건물
    Object.keys(LOTS).forEach((k, i) => { body += shown(3, g('growy growy3', buildings[k]).replace('class="growy growy3"', `class="growy growy3" style="transition-delay:${f(0.2 + i * 0.5)}s"`)); });
    css += `.sc-${id} .b3 .growy { transform-origin: 50% 100%; }`;
    // 4칸: 설계도가 다시 겹쳐 반짝인다
    body += `<g class="b4"><g class="flash flash4">${plan()}</g></g>`;
    body += glowRect(30, 20, 580, 320, 4, C.green, 1.2, 12);
    put('4-2/사회/3-2/계획 도시', svg(id, body, css));
  })();

  // ── 신도시: 붐비는 대도시 → 둘레 빈 땅에 새 도시 → 사람이 옮겨 가고 길·전철로 이어진다 ──
  (function () {
    const id = 't42-s32-sindosi';
    let css = base(id);
    let body = '';
    // 대도시: 빽빽한 높은 건물
    const city = [[44, 130], [74, 160], [104, 110], [134, 170], [164, 140], [194, 166], [224, 124], [254, 150]];
    body += city.map(([x, h]) => `<rect x="${x}" y="${244 - h}" width="34" height="${h}" fill="white" stroke="${C.purple}" stroke-width="2.5"/>${Array.from({ length: Math.floor(h / 26) }, (_, j) => `<rect x="${x + 7}" y="${244 - h + 10 + j * 26}" width="8" height="10" fill="${C.lilac}"/><rect x="${x + 19}" y="${244 - h + 10 + j * 26}" width="8" height="10" fill="${C.lilac}"/>`).join('')}`).join('');
    body += `<path d="M30 244 H300" stroke="${C.ink}" stroke-width="3"/>`;
    // 길: 1칸엔 대도시 쪽만, 3칸에 새 도시까지
    body += `<rect x="30" y="252" width="270" height="30" fill="${C.muted}"/>`;
    body += shown(3, `<rect class="grow grow3" x="300" y="252" width="310" height="30" fill="${C.muted}"/>`);
    // 꽉 막힌 차
    body += [40, 82, 124, 166, 208, 250].map((x, i) => `<g class="jig" style="animation-delay:${-i * 0.2}s"><rect x="${x}" y="257" width="36" height="20" rx="6" fill="${[C.blue, C.red, C.yellow, C.orange, C.blue, C.red][i]}"/></g>`).join('');
    body += at(1, 'pop', tag(96, 40, '집 부족', HOT, { size: 20 }), 0.5) + at(1, 'pop', tag(232, 40, '길 막힘', HOT, { size: 20 }), 0.9);
    body += at(1, 'pop', tag(165, 340, '대도시', OLD, { size: 20 }), 0.2);
    // 2칸: 둘레 빈 땅에 새 도시
    body += `<rect x="400" y="130" width="210" height="114" rx="6" fill="${C.peach}" opacity=".55"/><path d="M380 244 H620" stroke="${C.ink}" stroke-width="3"/>`;
    body += shown(2, g('fin fin2', `<rect x="408" y="138" width="194" height="100" rx="6" fill="none" stroke="${C.blue}" stroke-width="2.5" stroke-dasharray="9 7"/>`));
    body += shown(2, [[420, 70], [470, 90], [520, 60], [566, 80]].map(([x, h], k) => `<g class="growy growy2" style="transition-delay:${f(0.7 + k * 0.25)}s"><rect x="${x}" y="${244 - h}" width="32" height="${h}" fill="white" stroke="${C.green}" stroke-width="2.5"/>${Array.from({ length: Math.floor(h / 22) }, (_, j) => `<rect x="${x + 7}" y="${244 - h + 8 + j * 22}" width="18" height="8" fill="${C.mint}"/>`).join('')}</g>`).join(''));
    // 3칸: 사람들이 옮겨 가고 전철이 오간다
    body += shown(3, `<path d="M30 300 H610 M30 310 H610" stroke="${C.ink}" stroke-width="2.5"/>${Array.from({ length: 30 }, (_, i) => `<path d="M${36 + i * 20} 296 V314" stroke="${C.muted}" stroke-width="3"/>`).join('')}<g class="train"><rect x="40" y="290" width="76" height="22" rx="8" fill="${C.green}"/>${[0, 1, 2].map((i) => `<rect x="${50 + i * 22}" y="295" width="14" height="8" rx="2" fill="${C.mint}"/>`).join('')}</g>`);
    css += `
      .sc-${id} .train { animation: ${id}-train 4s ease-in-out infinite; }
      @keyframes ${id}-train { 0%, 10% { transform: translateX(0); } 50%, 60% { transform: translateX(480px); } 100% { transform: translateX(0); } }`;
    const crowd = [[60, 0], [80, 1], [100, 2], [120, 3], [140, 4], [160, 5], [180, 6], [200, 7]];
    body += crowd.map(([x, i]) => {
      const move = i % 2 === 0, tx = 420 + (i / 2) * 50;
      return `<g class="${move ? 'mv' : ''}" style="${move ? mvStyle([[0, 0], [0, 0], [tx - x, 0]], `transition-delay:${f(0.3 + i * 0.12)}s`) : ''}">${person(x, 244, i % 2 ? C.orange : C.blue, 0.9)}</g>`;
    }).join('');
    // 4칸
    body += at(4, 'pop', tag(505, 340, '신도시', OK, { size: 20 }), 0.3);
    body += glowRect(392, 122, 226, 130, 4, C.green, 0.6, 10);
    put('4-2/사회/3-2/신도시', svg(id, body, css));
  })();
})(typeof window !== 'undefined' ? window : globalThis);
