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

  // ════ 10 정치 과정과 시민 참여 ════

  // ── 정치 주체: 국가 기관(국회·정부·법원)을 정당·이익 집단·시민 단체·언론·개인이 둘러싸고 의견을 보낸다 ──
  (function () {
    const id = 't72-so-juche';
    let css = base(id);
    let body = '';
    body += at(1, 'pop', box(320, 176, 236, 116, '', OLD, 20, 16) + text(320, 148, '국가 기관', { size: 21, color: C.purple }));
    [['국회', 248], ['정부', 320], ['법원', 392]].forEach(([w, x], i) => { body += at(1, 'pop', tag(x, 196, w, PLAIN, { size: 19 }), 0.4 + i * 0.25); });
    const AROUND = [['정당', 96, 64, COLD, [210, 128]], ['이익 집단', 544, 64, HOT, [430, 128]], ['시민 단체', 96, 290, OK, [210, 226]], ['언론', 544, 290, COLD, [430, 226]]];
    AROUND.forEach(([w, x, y, col, to], i) => {
      body += at(2, 'pop', tag(x, y, w, col, { size: 21 }), i * 0.3);
      body += shown(2, g('fin fin2', flow([[x + (x < 320 ? 50 : -50), y + (y < 176 ? 16 : -16)], to], C.muted, { w: 4 }), 0.4 + i * 0.3));
    });
    body += at(3, 'pop', person(320, 344, C.green, 1.4), 0);
    body += at(3, 'pop', text(350, 336, '개인', { size: 20, anchor: 'start' }), 0.3);
    body += shown(3, g('fin fin3', flow([[320, 290], [320, 240]], C.green, { w: 4 }), 0.5));
    [['투표', 210], ['서명', 430]].forEach(([w, x], i) => { body += at(3, 'pop', tag(x, 320, w, PLAIN, { size: 18 }), 0.8 + i * 0.3); });
    body += at(4, 'pop', tag(320, 36, '정치 주체', HOT, { size: 24 }));
    AROUND.forEach(([w, x, y], i) => { body += glowRect(x - tagW(w, 21) / 2 - 5, y - 23, tagW(w, 21) + 10, 46, 4, C.orange, 0.3 + i * 0.15, 23); });
    body += glowRect(290, 296, 92, 56, 4, C.orange, 0.9, 14);
    put(KEY('10', '정치 주체'), svg(id, body, css));
  })();

  // ── 정치 과정 다섯 단계 사슬(정치 과정·이익 표출·이익 집약·정책 결정·정책 집행) ──
  const STAGE = [['이익 표출', '개인·집단'], ['이익 집약', '정당·언론'], ['정책 결정', '국회·정부'], ['정책 집행', '정부'], ['정책 평가', '시민']];
  const SX = [68, 194, 320, 446, 572], SY = 246, SW = 108, SH = 66;
  const chainBox = (i, hot = false) => box(SX[i], SY, SW, SH, '', hot ? HOT : PLAIN, 20, 10) + text(SX[i], SY - 6, STAGE[i][0], { size: 19 }) + text(SX[i], SY + 20, STAGE[i][1], { size: 18, color: C.muted, weight: 600 });
  const chainArrow = (i) => `<path d="M${SX[i] + SW / 2 + 2} ${SY} H${SX[i + 1] - SW / 2 - 4}" stroke="${C.ink}" stroke-width="3"/><path d="M${SX[i + 1] - SW / 2 - 10} ${SY - 6} L${SX[i + 1] - SW / 2 - 3} ${SY} L${SX[i + 1] - SW / 2 - 10} ${SY + 6}" stroke="${C.ink}" stroke-width="3" fill="none" stroke-linejoin="round"/>`;
  const FEED = `M${SX[4]} ${SY + SH / 2} V318 H${SX[0]} V${SY + SH / 2 + 8}`;
  const feedback = () => `<path d="${FEED}" stroke="${C.orange}" stroke-width="3.5" fill="none" stroke-dasharray="10 8" class="mar"/><path d="M${SX[0] - 7} ${SY + SH / 2 + 15} L${SX[0]} ${SY + SH / 2 + 5} L${SX[0] + 7} ${SY + SH / 2 + 15}" stroke="${C.orange}" stroke-width="3.5" fill="none" stroke-linejoin="round"/>` + text(320, 346, '다시 반영', { size: 18, color: C.orange });
  // 말풍선 이름표: 꼬리가 아래로
  const bubble = (cx, cy, label, [fill, stroke] = PLAIN, size = 18) => {
    const w = tagW(label, size), h = Math.round(size * 1.8);
    return `<path d="M${f(cx - 6)} ${f(cy + h / 2 - 1)} L${f(cx - 12)} ${f(cy + h / 2 + 12)} L${f(cx + 6)} ${f(cy + h / 2 - 1)} Z" fill="${fill}" stroke="${stroke}" stroke-width="2.5" stroke-linejoin="round"/><rect x="${f(cx - w / 2)}" y="${f(cy - h / 2)}" width="${w}" height="${h}" rx="10" fill="${fill}" stroke="${stroke}" stroke-width="2.5"/><path d="M${f(cx - 4.5)} ${f(cy + h / 2 - 1.5)} H${f(cx + 4.5)}" stroke="${fill}" stroke-width="4"/>` + text(cx, f(cy + size * 0.36), label, { size });
  };
  const bus = (x, y) => `<rect x="${x - 40}" y="${y - 26}" width="80" height="40" rx="8" fill="${C.yellow}" stroke="${C.orange}" stroke-width="3"/>` + [-24, -4, 16].map((d) => `<rect x="${x + d}" y="${y - 19}" width="14" height="13" rx="2" fill="white"/>`).join('') + `<circle cx="${x - 22}" cy="${y + 15}" r="7" fill="${C.ink}"/><circle cx="${x + 22}" cy="${y + 15}" r="7" fill="${C.ink}"/>`;
  const govt = (x, y, w = 110, h = 80) => `<rect x="${x - w / 2}" y="${y - h}" width="${w}" height="${h}" fill="white" stroke="${C.blue}" stroke-width="3"/>` +
    [0, 1].map((r) => [0, 1, 2].map((c) => `<rect x="${f(x - w / 2 + 14 + c * (w - 28) / 3)}" y="${y - h + 12 + r * 26}" width="${f((w - 28) / 3 - 8)}" height="14" fill="${C.sky}"/>`).join('')).join('') +
    `<path d="M${x} ${y - h} V${y - h - 22}" stroke="${C.ink}" stroke-width="2.5"/><path d="M${x} ${y - h - 22} H${x + 18} V${y - h - 12} H${x} Z" fill="${C.red}"/>`;

  const procFig = (word, id) => {
    const focus = STAGE.findIndex((s) => s[0] === word); // 정치 과정이면 -1
    let css = base(id) + `
      .sc-${id} .sink { transition: opacity .5s ease 1.5s; }
      .on2 .sc-${id} .sink { opacity: 0; }`;
    let body = '';
    if (focus < 0) {
      // 사슬이 두 칸씩 이어지고, 위에 단계마다 작은 그림
      const icon = [
        (x) => bubble(x - 22, 112, '!', PLAIN) + bubble(x + 20, 146, '!', PLAIN),
        (x) => `<path d="M${x - 40} 108 H${x + 40} L${x + 8} 146 V172 H${x - 8} V146 Z" fill="${C.lilac}" stroke="${C.purple}" stroke-width="3" stroke-linejoin="round"/>` + [-24, 0, 24].map((d) => `<circle cx="${x + d}" cy="98" r="7" fill="${C.purple}"/>`).join(''),
        (x) => paper(x - 8, 140, '', 0.9) + `<g transform="rotate(-14 ${x + 22} 160)">${stamp(x + 22, 160, '결정', 22)}</g>`,
        (x) => `<path d="M${x - 46} 176 H${x + 46}" stroke="${C.ink}" stroke-width="3"/>` + bus(x, 156),
        (x) => `<circle cx="${x - 20}" cy="140" r="18" fill="white" stroke="${C.green}" stroke-width="3"/>` + check(x - 20, 141, 0.7) + cross(x + 24, 140, 11)
      ];
      STAGE.forEach((_, i) => {
        const n = i < 2 ? 1 : i < 4 ? 2 : 3, d = (i % 2) * 0.7;
        body += at(n, 'pop', chainBox(i), d);
        body += at(n, 'pop', icon[i](SX[i]), d + 0.3);
        if (i) body += shown(i < 2 ? 1 : i < 4 ? 2 : 3, g(`fin fin${i < 2 ? 1 : i < 4 ? 2 : 3}`, chainArrow(i - 1), d));
      });
      body += shown(3, g('fin fin3', feedback(), 1));
      body += at(4, 'pop', tag(320, 40, '정치 과정', HOT, { size: 24 }));
      STAGE.forEach((_, i) => { body += glowRect(SX[i] - SW / 2 - 4, SY - SH / 2 - 4, SW + 8, SH + 8, 4, C.orange, 0.2 + i * 0.3, 12); });
      put(KEY('10', word), svg(id, body, css));
      return;
    }
    // 아래 사슬은 1칸에 한꺼번에, 맡은 단계만 주황
    STAGE.forEach((_, i) => {
      body += at(1, 'fin', chainBox(i, i === focus), i * 0.12);
      if (i) body += shown(1, chainArrow(i - 1));
    });
    body += shown(1, feedback());
    body += ring(SX[focus], SY, 46, 1, C.orange, 0.8);
    const last = focus === 1 ? 4 : 3;
    if (focus === 0) {
      // 이익 표출: 사람들이 저마다 요구를 드러낸다
      const P = [[110, '버스 노선', C.green], [250, '공원', C.blue], [390, '안전한 길', C.purple], [530, '도서관', C.orange]];
      P.forEach(([x, w, col], i) => {
        body += at(2, 'pop', person(x, 190, col, 1.4), i * 0.2);
        body += at(2, 'pop', `<g class="bob" style="animation-delay:${i * 0.35}s">${bubble(x + 14, 94 + (i % 2) * 18, w, PLAIN, 19)}</g>`, 0.5 + i * 0.35);
      });
      body += shown(2, g('fin fin2', flow([[96, 196], [76, 208]], C.orange, { w: 4 }), 1.8));
    } else if (focus === 1) {
      // 이익 집약: 흩어진 요구가 깔때기에 모여 정책 대안 하나로
      const B = [['버스 노선', 80, 50], ['공원', 190, 104], ['안전한 길', 90, 160], ['도서관', 210, 30]];
      B.forEach(([w, x, y], i) => {
        body += `<g class="b1">${mover([[0, 0], [330 - x, 84 - y]], `<g class="sink">${g('pop pop1', bubble(x, y, w, PLAIN, 18), 0.3 + i * 0.2)}</g>`, i * 0.2)}</g>`;
      });
      body += at(2, 'pop', `<path d="M262 60 H398 L342 120 V160 H318 V120 Z" fill="${C.lilac}" stroke="${C.purple}" stroke-width="3" stroke-linejoin="round"/>` + text(470, 76, '정당·언론', { size: 20, color: C.purple }), 0);
      body += at(3, 'drop', paper(330, 182 - 4, '', 0.75), 0.1);
      body += shown(3, g('fin fin3', flow([[362, 172], [470, 150]], C.orange, { w: 4 }), 0.4));
      body += at(3, 'pop', tag(530, 146, '정책 대안', HOT, { size: 19 }), 0.8);
    } else if (focus === 2) {
      // 정책 결정: 국회와 정부가 정책 대안을 정한다
      body += at(1, 'rise', hall(140, 196, 140, 80, OLD) + text(140, 72, '국회', { size: 20, color: C.purple }), 0.3);
      body += at(1, 'rise', govt(500, 196) + text(500, 84, '정부', { size: 20, color: C.blue }), 0.5);
      body += at(1, 'drop', paper(320, 150, '', 1) + `<rect x="270" y="82" width="100" height="32" rx="8" fill="white" stroke="${C.orange}" stroke-width="2.5"/>` + text(320, 104, '정책 대안', { size: 18 }), 0.8);
      body += shown(2, g('fin fin2', flow([[214, 150], [282, 150]], C.purple, { w: 4 }), 0.6) + g('fin fin2', flow([[442, 150], [358, 150]], C.blue, { w: 4 }), 0.9));
      body += at(2, 'drop', `<g transform="rotate(-12 344 160)">${stamp(344, 160, '결정', 26)}</g>`, 1.6);
    } else if (focus === 3) {
      // 정책 집행: 정부가 정해진 정책대로 버스를 실제로 다니게 한다
      body += at(1, 'rise', govt(90, 196) + text(90, 84, '정부', { size: 20, color: C.blue }), 0.2);
      body += at(1, 'pop', paper(200, 130, '', 0.85) + `<g transform="rotate(-12 222 146)">${stamp(222, 146, '결정', 20)}</g>`, 0.5);
      body += at(1, 'fin', `<rect x="160" y="172" width="460" height="26" fill="${C.line}"/><path d="M168 185 H612" stroke="white" stroke-width="3" stroke-dasharray="16 12"/>`, 0.3);
      body += at(1, 'pop', `<path d="M584 172 V108" stroke="${C.ink}" stroke-width="3"/><rect x="566" y="92" width="36" height="24" rx="4" fill="${C.green}"/>` + text(584, 84, '정류장', { size: 18, color: C.green }), 0.6);
      body += `<g class="b2">${mover([[0, 0], [220, 0]], bus(250, 160), 0.6)}</g>`;
      body += shown(2, g('fin fin2', flow([[124, 160], [190, 160]], C.blue, { w: 4 }), 0.2));
      body += at(2, 'pop', person(530, 172, C.orange, 1.1) + person(556, 172, C.purple, 1.1), 1.6);
    }
    body += at(last, 'pop', tag(320, 36, word, HOT, { size: 24 }));
    body += glowRect(SX[focus] - SW / 2 - 4, SY - SH / 2 - 4, SW + 8, SH + 8, last, C.orange, 0.3, 12);
    put(KEY('10', word), svg(id, body, css));
  };
  procFig('정치 과정', 't72-so-gwajeong');
  procFig('이익 표출', 't72-so-pyochul');
  procFig('이익 집약', 't72-so-jibyak');
  procFig('정책 결정', 't72-so-gyeoljeong');
  procFig('정책 집행', 't72-so-jiphaeng');

  // ── 광역·기초 자치 단체: 도 하나가 시·군을 아우른다 ──
  const localFig = (word, id) => {
    const wide = word === '광역 자치 단체';
    let css = base(id);
    let body = '';
    body += shown(1, drawn(1, 'M60 52 H580 Q606 52 606 78 V308 Q606 334 580 334 H60 Q34 334 34 308 V78 Q34 52 60 52 Z', C.green, 4));
    body += at(1, 'fin', `<rect x="34" y="52" width="572" height="282" rx="26" fill="${C.mint}" fill-opacity=".35"/>` + text(62, 92, '○○도', { size: 24, anchor: 'start', color: C.green }), 0.6);
    const IN = [[136, '△△시', '시의회', '시장'], [320, '□□군', '군의회', '군수'], [504, '◇◇시', '시의회', '시장']];
    IN.forEach(([x, name, a, b], i) => {
      const inner = at(1, 'pop', box(x, 228, 164, 168, '', ['white', C.blue], 20, 14) + text(x, 172, name, { size: 21, color: C.blue }), 0.8 + i * 0.2);
      body += wide ? dimFrom(2, inner) : inner;
      if (!wide) {
        body += at(2, 'pop', tag(x, 222, a, COLD, { size: 19 }), 0.3 + i * 0.3);
        body += at(2, 'pop', tag(x, 266, b, COLD, { size: 19 }), 0.5 + i * 0.3);
      }
    });
    if (wide) {
      body += at(2, 'pop', tag(420, 86, '도의회', OK, { size: 19 }), 0.3);
      body += at(2, 'pop', tag(530, 86, '도지사', OK, { size: 19 }), 0.6);
      body += glowRect(30, 48, 580, 290, 2, C.green, 0.9, 28);
    } else {
      IN.forEach(([x], i) => { body += glowRect(x - 86, 140, 172, 176, 3, C.blue, 0.3 + i * 0.2, 16); });
    }
    body += at(3, 'pop', tag(320, 30, word, HOT, { size: 24 }));
    if (wide) body += glowRect(30, 48, 580, 290, 3, C.orange, 0.4, 28);
    put(KEY('10', word), svg(id, body, css));
  };
  localFig('광역 자치 단체', 't72-so-gwangyeok');
  localFig('기초 자치 단체', 't72-so-gicho');

  // ── 지방 의회: 주민이 뽑은 의원들이 조례를 만들고 단체장의 예산안을 살펴 확정한다 ──
  (function () {
    const id = 't72-so-uihoe';
    let css = base(id);
    let body = '';
    // 주민
    [220, 270, 320, 370, 420].forEach((x, k) => { body += at(1, 'pop', person(x, 344, [C.green, C.blue, C.purple, C.orange, C.green][k], 1.15), k * 0.1); });
    body += at(1, 'fin', text(150, 338, '주민', { size: 20, color: C.muted }), 0.3);
    // 지방 의회와 단체장
    body += at(1, 'rise', hall(190, 226, 160, 96, OLD), 0.4);
    [-42, 0, 42].forEach((d, k) => { body += at(1, 'pop', person(190 + d, 222, [C.green, C.blue, C.orange][k], 1.3), 0.8 + k * 0.15); });
    body += at(1, 'pop', text(190, 76, '지방 의회', { size: 21, color: C.purple }), 0.9);
    body += at(1, 'rise', `<rect x="404" y="130" width="132" height="96" fill="white" stroke="${C.blue}" stroke-width="3"/>` + person(470, 222, C.purple, 1.6, { tie: true }), 0.5);
    body += at(1, 'pop', text(470, 116, '단체장', { size: 21, color: C.blue }), 1);
    body += shown(1, g('fin fin1', flow([[272, 300], [222, 236]], C.purple, { w: 4 }), 1.2) + g('fin fin1', flow([[368, 300], [436, 236]], C.blue, { w: 4 }), 1.4));
    body += at(1, 'pop', tag(320, 262, '선거', PLAIN, { size: 18 }), 1.6);
    // 2칸: 조례
    body += shown(2, g('fin fin2', flow([[104, 170], [70, 170]], C.purple, { w: 4 }), 0.2));
    body += at(2, 'drop', paper(44, 170, '', 0.75) + text(44, 224, '조례', { size: 20, color: C.purple }), 0.5);
    // 3칸: 예산안이 의회로 와서 확정
    body += `<g class="b3">${mover([[150, 0], [150, 0], [0, 0]], paper(320, 150, '', 0.9) + text(320, 108, '예산안', { size: 19, color: C.blue }), 0.2)}</g>`;
    body += at(3, 'drop', `<g transform="rotate(-12 344 166)">${stamp(344, 166, '확정', 22)}</g>`, 1.8);
    body += at(4, 'pop', tag(320, 36, '지방 의회', HOT, { size: 24 }));
    body += glowRect(98, 86, 184, 146, 4, C.orange, 0.3, 12);
    put(KEY('10', '지방 의회'), svg(id, body, css));
  })();

  // ── 주민 소환: 4년 임기 도중에 주민 투표로 단체장을 물러나게 한다 ──
  (function () {
    const id = 't72-so-sohwan';
    let css = base(id) + `
      .sc-${id} .gone { transition: opacity .8s ease .3s, transform .8s ease .3s; }
      .on4 .sc-${id} .gone { opacity: 0; transform: translateY(30px); }`;
    const X0 = 80, X1 = 560, BY = 118;
    const xAt = (yr) => X0 + (X1 - X0) * yr / 4;
    let body = '';
    body += at(1, 'fin', text(X1, 102, '임기 4년', { size: 20, anchor: 'end', color: C.blue }));
    body += shown(1, `<rect x="${X0}" y="${BY}" width="${X1 - X0}" height="24" rx="12" fill="white" stroke="${C.blue}" stroke-width="2.5"/>`);
    body += shown(1, `<rect class="grow grow1" style="transition-duration:1.4s" x="${X0}" y="${BY}" width="${xAt(1) - X0}" height="24" rx="12" fill="${C.blue}"/>`);
    body += shown(2, `<rect class="grow grow2" style="transition-duration:1.4s" x="${xAt(1) - 12}" y="${BY}" width="${xAt(2) - xAt(1) + 12}" height="24" fill="${C.blue}"/>`);
    [1, 2, 3, 4].forEach((y) => { body += shown(1, `<path d="M${xAt(y)} ${BY + 28} V${BY + 38}" stroke="${C.ink}" stroke-width="2.5"/>` + text(xAt(y), BY + 60, `${y}년`, { size: 18, color: C.muted, weight: 600 })); });
    // 단체장: 임기 띠 위를 걸어간다
    body += `<g class="b1"><g class="gone">${mover([[0, 0], [xAt(2) - X0 - 20, 0]], person(X0 + 20, BY - 4, C.purple, 1.4, { tie: true }) + at(1, 'pop', text(X0 + 20, BY - 60, '단체장', { size: 18, color: C.purple }), 0.4))}</g></g>`;
    // 주민
    const R = [90, 145, 200, 255, 310, 365];
    R.forEach((x, k) => { body += at(1, 'pop', person(x, 340, [C.green, C.blue, C.orange][k % 3], 1.25), 0.5 + k * 0.08); });
    // 2칸: 주민의 뜻과 어긋남
    [145, 255, 365].forEach((x, k) => { body += at(2, 'pop', cross(x, 268, 10), 1 + k * 0.25); });
    // 3칸: 투표
    body += at(3, 'pop', ballotBox(520, 268), 0);
    [[145, 290], [255, 290], [365, 290]].forEach(([x, y], k) => { body += `<g class="b3 h4">${mover([[0, 0], [0, 0], [0, 0]], `<g class="mv3x" style="--dx:${520 - x}px;--dy:${264 - y}px;transition-delay:${0.4 + k * 0.25}s">${ballot(x, y)}</g>`)}</g>`; });
    css += `
      .sc-${id} .mv3x { transition: transform 1.2s ease-in-out; }
      .on3 .sc-${id} .mv3x { transform: translate(var(--dx), var(--dy)); }`;
    body += at(3, 'drop', `<g transform="rotate(-10 560 214)">${stamp(560, 214, '해임', 28)}</g>`, 1.6);
    // 4칸: 남은 임기가 끊긴다
    body += shown(4, `<rect x="${xAt(2)}" y="${BY - 4}" width="${X1 - xAt(2) + 4}" height="32" fill="${C.paper}" opacity=".7"/>` + `<path d="M${xAt(2)} ${BY - 14} V${BY + 38}" stroke="${C.red}" stroke-width="5" stroke-linecap="round"/>`);
    body += at(4, 'pop', tag(440, 60, '주민 소환', HOT, { size: 24 }), 0.4);
    put(KEY('10', '주민 소환'), svg(id, body, css));
  })();

  // ════ 11 일상생활과 법 ════

  // ── 법의 세 갈래(공법·사법·사회법): 누구와 누구 사이를 다루는가 ──
  const lawFig = (word, id) => {
    const COL = [
      ['공법', 110, ['헌법', '형법'], OLD],
      ['사법', 320, ['민법', '상법'], COLD],
      ['사회법', 530, ['노동법', '경제법', '사회 보장법'], OK]
    ];
    const focus = COL.findIndex((c) => c[0] === word);
    const lawBeat = focus === 2 ? 3 : 3;
    let css = base(id);
    let body = '';
    const twoWay = (x1, x2, y, col) => flow([[x1 + 30, y], [x2 - 16, y]], col, { w: 4 }) + flow([[x2 - 30, y + 14], [x1 + 16, y + 14]], col, { w: 4 });
    COL.forEach(([name, x, laws, [fill, stroke]], i) => {
      let top = '';
      if (i === 0) {
        top += hall(x - 46, 120, 54, 36, OLD) + text(x - 46, 146, '국가', { size: 18 });
        top += person(x + 46, 120, C.green, 1.5) + text(x + 46, 146, '개인', { size: 18 });
      } else if (i === 1) {
        top += person(x - 46, 120, C.blue, 1.5) + text(x - 46, 146, '개인', { size: 18 });
        top += person(x + 46, 120, C.orange, 1.5) + text(x + 46, 146, '개인', { size: 18 });
      } else {
        top += person(x - 50, 120, C.purple, 1.9, { tie: true }) + text(x - 50, 146, '회사', { size: 18 });
        top += person(x + 50, 120, C.green, 1.1) + text(x + 50, 146, '근로자', { size: 18 });
      }
      const head = at(1, 'pop', top, 0.2 + i * 0.3) + at(1, 'pop', tag(x, 186, name, [fill, stroke], { size: 22 }), 0.4 + i * 0.3);
      // 관계 화살표: 맡은 갈래는 2칸에, 나머지는 1칸에
      const arrows = i === 2
        ? flow([[x - 24, 90], [x + 6, 90]], C.purple, { w: 4.5 })
        : twoWay(x - 46, x + 46, 94, stroke);
      body += i === focus ? head : dimFrom(2, head);
      body += i === focus ? shown(2, g('fin fin2', arrows, 0.3)) : dimFrom(2, shown(1, arrows));
      if (i === focus) {
        if (i === 2) {
          // 국가가 끼어들어 약한 쪽을 지킨다: 위에서 국가가 내려와 둘 사이에 방패를 세운다
          body += at(3, 'drop', `<path d="M${x + 4} 24 L${x + 22} 12 L${x + 40} 24 Z" fill="${C.lilac}" stroke="${C.purple}" stroke-width="2.5" stroke-linejoin="round"/><rect x="${x + 6}" y="24" width="32" height="20" fill="white" stroke="${C.purple}" stroke-width="2.5"/>` + text(x + 50, 40, '국가', { size: 18, anchor: 'start', color: C.purple }), 0);
          body += shown(3, g('fin fin3', flow([[x + 22, 48], [x + 22, 64]], C.purple, { w: 3.5 }), 0.4));
          body += at(3, 'pop', `<path d="M${x + 22} 68 L${x + 38} 74 V88 Q${x + 38} 102 ${x + 22} 110 Q${x + 6} 102 ${x + 6} 88 V74 Z" fill="${C.lilac}" stroke="${C.purple}" stroke-width="3" stroke-linejoin="round"/>`, 0.8);
        }
        laws.forEach((l, k) => {
          const y = 240 + k * 42;
          body += shown(lawBeat, drawn(lawBeat, `M${x} 206 V${y - 16}`, stroke, 3));
          body += at(lawBeat, 'drop', tag(x, y, l, [fill, stroke], { size: 20 }), 0.3 + k * 0.3);
        });
      }
    });
    body += at(4, 'pop', tag(320, 32, word, HOT, { size: 24 }));
    const [, fx, laws] = COL[focus];
    body += glowRect(fx - 100, 60, 200, 152 + (laws.length) * 42 + 4, 4, C.orange, 0.3, 16);
    put(KEY('11', word), svg(id, body, css));
  };
  lawFig('공법', 't72-so-gongbeop');
  lawFig('사법', 't72-so-sabeop');
  lawFig('사회법', 't72-so-sahoebeop');

  // ── 법정(민사 재판·원고·피고 / 형사 재판·피고인) ──
  const courtFig = (word, id) => {
    const criminal = word === '형사 재판' || word === '피고인';
    let css = base(id);
    let body = '';
    // 판사석
    body += at(1, 'rise', person(320, 120, C.ink, 1.8) + `<rect x="226" y="96" width="188" height="46" rx="6" fill="${C.lilac}" stroke="${C.purple}" stroke-width="3"/>` + text(320, 127, '판사', { size: 21 }), 0);
    const desk = (x0, x1, y = 252) => `<rect x="${x0}" y="${y}" width="${x1 - x0}" height="40" rx="6" fill="white" stroke="${C.muted}" stroke-width="3"/>`;
    const deskLabel = (x, y, label, n, col, s = 0) => at(n, 'pop', text(x, y, label, { size: 21, color: col }), s);
    if (!criminal) {
      // 왼쪽은 돈을 빌려준 사람, 오른쪽은 빌린 사람
      body += at(1, 'pop', person(140, 272, C.green, 1.8) + desk(50, 230), 0.3);
      body += at(1, 'pop', person(500, 272, C.orange, 1.8) + desk(410, 590), 0.5);
      body += `<g class="b1 h2">${g('fin fin1', flow([[180, 196], [460, 196]], C.orange, { w: 4 }), 0.8)}${g('pop pop1', `<ellipse cx="320" cy="186" rx="16" ry="7" fill="${C.yellow}" stroke="${C.orange}" stroke-width="2.5"/>`, 1)}</g>`;
      body += `<g class="b1 h2">${g('pop pop1', `<g class="jig">${qmark(140, 176)}</g>`, 1.4)}</g>`;
      // 소장이 법원으로, 다시 상대에게
      const toBench = word === '피고' || word === '민사 재판' || word === '원고';
      if (toBench) body += `<g class="b2">${mover([[-170, 30], [0, 0]], paper(320, 196, '', 0.85), 0.2)}</g>`;
      body += at(2, 'pop', text(320, 248, '소장', { size: 18, color: C.muted }), 0.8);
      body += deskLabel(140, 280, '원고', 2, C.green, 0.6);
      const defBeat = word === '피고' ? 3 : 2;
      if (word !== '원고') {
        body += `<g class="b${defBeat}">${mover([0, 1, 2].map((k) => (k + 1 < defBeat ? [-180, 28] : [0, 0])), paper(500, 168, '', 0.7), defBeat === 2 ? 1.6 : 0.3)}</g>`;
        body += deskLabel(500, 280, '피고', defBeat, C.orange, defBeat === 2 ? 2.4 : 1);
      }
      if (word === '원고') { body += ring(140, 232, 46, 2, C.orange, 1); body += glowRect(46, 186, 188, 112, 3, C.orange, 0.4, 12); }
      if (word === '피고') { body += ring(500, 232, 46, 3, C.orange, 1.4); body += glowRect(406, 198, 188, 100, 4, C.orange, 0.4, 12); }
      if (word === '민사 재판') {
        body += at(3, 'drop', `<g transform="rotate(-12 380 64)">${stamp(380, 64, '판결', 28)}</g>`, 0.3);
        body += glowRect(40, 40, 560, 264, 4, C.orange, 0.4, 16);
      }
    } else {
      // 범죄를 저질렀다는 의심을 받는 사람
      body += at(3, 'pop', person(556, 272, C.green, 1.6, { tie: true }), 0);
      body += at(1, 'pop', person(476, 272, C.orange, 1.8) + desk(410, 600), 0.3);
      body += `<g class="b1 h3">${g('pop pop1', `<g class="jig">${qmark(476, 178)}</g>`, 0.8)}</g>`;
      body += at(2, 'pop', person(140, 272, C.blue, 1.8, { tie: true }) + desk(50, 230), 0);
      body += deskLabel(140, 280, '검사', 2, C.blue, 0.3);
      body += `<g class="b2">${mover([[-150, 30], [0, 0]], paper(320, 196, '', 0.85), 0.6)}</g>`;
      body += at(2, 'pop', text(320, 248, '기소', { size: 18, color: C.muted }), 1.2);
      body += deskLabel(476, 280, '피고인', 2, C.orange, 1.8);
      body += at(3, 'pop', text(556, 330, '변호인', { size: 19, color: C.green }), 0.3);
      body += at(3, 'drop', `<g transform="rotate(-12 380 64)">${stamp(380, 64, '판결', 28)}</g>`, 1);
      if (word === '피고인') { body += ring(476, 232, 46, 2, C.orange, 2.2); body += glowRect(410, 186, 126, 112, 4, C.orange, 0.4, 12); }
      else body += glowRect(40, 40, 568, 264, 4, C.orange, 0.4, 16);
    }
    const last = word === '원고' ? 3 : 4;
    body += at(last, 'pop', tag(word === '피고인' || word === '피고' ? 200 : 150, 40, word, HOT, { size: 24 }));
    put(KEY('11', word), svg(id, body, css));
  };
  courtFig('민사 재판', 't72-so-minsa');
  courtFig('형사 재판', 't72-so-hyeongsa');
  courtFig('원고', 't72-so-wongo');
  courtFig('피고', 't72-so-pigo');
  courtFig('피고인', 't72-so-pigoin');

  // ── 심급 제도·항소·상고: 사건이 지방 법원 → 고등 법원 → 대법원 계단을 오른다 ──
  const courtStair = (word, id) => {
    let css = base(id);
    const STEP = [[24, 220, 262], [220, 416, 194], [416, 616, 126]];
    const NAME = ['지방 법원', '고등 법원', '대법원'], GY = 340;
    const COLS = [OK, COLD, OLD];
    // 칸마다 서류가 있는 계단 번호, 계단이 나타나는 칸
    const plan = word === '심급 제도' ? { stairs: [1, 2, 3], doc: [0, 1, 2], up: [2, 3] } : word === '항소' ? { stairs: [1, 1, 1], doc: [0, 1], up: [2, 9] } : { stairs: [1, 1, 1], doc: [1, 2], up: [1, 2] };
    const docAt = (i) => [(STEP[i][0] + STEP[i][1]) / 2 - 40, STEP[i][2] - 36];
    let body = '';
    STEP.forEach(([x0, x1, top], i) => {
      const n = plan.stairs[i], [fill, stroke] = COLS[i];
      body += at(n, 'rise', `<rect x="${x0}" y="${top}" width="${x1 - x0}" height="${GY - top}" fill="${fill}" stroke="${stroke}" stroke-width="3"/>` + text(x0 + 14, top + 40, NAME[i], { size: 21, anchor: 'start' }), i * (n === 1 ? 0.25 : 0));
      body += at(n, 'pop', tag(x1 - 42, top + 33, `${i + 1}심`, [fill, stroke], { size: 20 }), 0.3 + i * (n === 1 ? 0.25 : 0));
    });
    // 서류
    const d0 = docAt(0), pts = plan.doc.map((k) => [docAt(k)[0] - d0[0], docAt(k)[1] - d0[1]]);
    body += `<g class="b1">${mover(pts, `<g transform="translate(${f(d0[0])} ${f(d0[1])})">${paper(0, 0, '', 0.75)}</g>`)}</g>`;
    // 올라가는 화살표와 이름
    const jump = (i, n, label, hot) => {
      const [x, y] = docAt(i), [x2, y2] = docAt(i + 1);
      const col = hot ? C.orange : C.muted;
      return shown(n, g(`fin fin${n}`, flowQ([x + 10, y - 30], [(x + x2) / 2 - 10, y2 - 66], [x2 - 30, y2 - 14], col, { w: hot ? 5 : 3.5 }), 0)) +
        at(n, 'pop', tag((x + x2) / 2 - 6, y2 - 74, label, hot ? HOT : PLAIN, { size: hot ? 21 : 18 }), 0.5);
    };
    if (word === '심급 제도') { body += jump(0, 2, '항소', true) + jump(1, 3, '상고', true); }
    else if (word === '항소') { body += jump(0, 2, '항소', true); }
    else { body += jump(0, 1, '항소', false) + jump(1, 2, '상고', true); }
    // 판결 도장
    body += at(1, 'drop', `<g transform="rotate(-12 ${(STEP[0][0] + STEP[0][1]) / 2 + 40} ${STEP[0][2] - 40})">${stamp((STEP[0][0] + STEP[0][1]) / 2 + 40, STEP[0][2] - 40, '판결', 22)}</g>`, 1);
    const last = word === '심급 제도' ? 4 : 3;
    body += at(last, 'pop', tag(556, 40, word, HOT, { size: 24 }));
    if (word === '심급 제도') STEP.forEach(([x0, x1, top], i) => { body += glowRect(x0, top, x1 - x0, GY - top, 4, COLS[i][1], 0.4 + i * 0.3, 2); });
    else { const i = word === '항소' ? 1 : 2; body += glowRect(STEP[i][0], STEP[i][2], STEP[i][1] - STEP[i][0], GY - STEP[i][2], 3, C.orange, 0.4, 2); }
    put(KEY('11', word), svg(id, body, css));
  };
  courtStair('심급 제도', 't72-so-simgeup');
  courtStair('항소', 't72-so-hangso');
  courtStair('상고', 't72-so-sanggo');

  // ── 국민 참여 재판·배심원: 시민 가운데 뽑힌 배심원이 의견을 판사에게 낸다 ──
  const juryFig = (word, id) => {
    const pick = word === '배심원';
    let css = base(id);
    let body = '';
    body += at(1, 'rise', person(320, 96, C.ink, 1.6) + `<rect x="244" y="74" width="152" height="40" rx="6" fill="${C.lilac}" stroke="${C.purple}" stroke-width="3"/>` + text(320, 101, '판사', { size: 20 }), 0);
    body += at(1, 'pop', person(110, 170, C.blue, 1.5, { tie: true }) + `<rect x="40" y="150" width="140" height="36" rx="6" fill="white" stroke="${C.muted}" stroke-width="3"/>` + text(110, 175, '검사', { size: 19, color: C.blue }), 0.3);
    body += at(1, 'pop', person(530, 170, C.orange, 1.5) + `<rect x="460" y="150" width="140" height="36" rx="6" fill="white" stroke="${C.muted}" stroke-width="3"/>` + text(530, 175, '피고인', { size: 19, color: C.orange }), 0.5);
    // 배심원석
    const boxN = pick ? 2 : 1;
    body += at(boxN, 'fin', `<rect x="170" y="212" width="300" height="80" rx="10" fill="${C.peach}" fill-opacity=".5" stroke="${C.orange}" stroke-width="3"/>` + text(100, 258, '배심원석', { size: 19, color: C.orange }), pick ? 0 : 0.6);
    const SEAT = [200, 240, 280, 320, 360, 400, 440];
    const COL = [C.green, C.blue, C.purple, C.orange];
    if (pick) {
      // 시민 줄: 일곱 사람이 배심원석으로 올라간다
      const CROWD = Array.from({ length: 13 }, (_, k) => 34 + k * 47.6);
      const chosen = [1, 3, 4, 6, 8, 10, 11];
      CROWD.forEach((x, k) => {
        const si = chosen.indexOf(k);
        const p = person(x, 352, COL[k % 4], 0.95);
        if (si < 0) body += dimFrom(2, at(1, 'pop', p, k * 0.05));
        else body += `<g class="b1">${mover([[0, 0], [SEAT[si] - x, -68]], g('pop pop1', p, k * 0.05), 0.2 + si * 0.12)}</g>`;
      });
      chosen.forEach((k, si) => { body += `<g class="b1 h2">${ring(CROWD[k], 334, 18, 1, C.orange, 0.8 + si * 0.1)}</g>`; });
    } else {
      SEAT.forEach((x, k) => { body += at(2, 'pop', person(x, 284, COL[k % 4], 0.95), 0.2 + k * 0.12); });
    }
    // 의견을 판사에게
    const opN = 3;
    body += shown(opN, g('fin fin' + opN, flow([[320, 206], [320, 124]], C.orange, { w: 5 }), 0.3));
    body += at(opN, 'pop', tag(380, 166, '의견', HOT, { size: 20 }), 0.6);
    if (!pick) body += at(3, 'drop', `<g transform="rotate(-12 440 56)">${stamp(440, 56, '판결', 24)}</g>`, 1.4);
    body += at(4, 'pop', tag(130, 40, word, HOT, { size: 24 }));
    body += glowRect(166, 208, 308, 88, 4, C.orange, 0.3, 12);
    put(KEY('11', word), svg(id, body, css));
  };
  juryFig('국민 참여 재판', 't72-so-chamyeo');
  juryFig('배심원', 't72-so-baesim');
})(typeof window !== 'undefined' ? window : globalThis);
