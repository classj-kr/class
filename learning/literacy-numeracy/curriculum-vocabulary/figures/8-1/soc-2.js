(function (root) {
  'use strict';
  const { C, svg, text, put } = root.FigureKit;
  const KEY = (u, w) => `8-1/사회/${u}/${w}`;
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
  const tw = (s, size) => [...String(s)].reduce((a, c) => a + (/[가-힣?→○]/.test(c) ? 1 : c === ' ' ? 0.3 : 0.6), 0) * size;
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

  // 칸 n 에 (dx, dy) 만큼 날아가 그 자리에 머문다
  const fly = (n, dx, dy, inner, s = 0) => `<g class="b${n}"><g class="fly fly${n}" style="--dx:${f(dx)}px;--dy:${f(dy)}px${s ? `;animation-delay:${s}s` : ''}">${inner}</g></g>`;
  const base2 = (id) => base(id) + `
    .sc-${id} .fly { opacity: 0; }
    @keyframes ${id}-fly { 0% { opacity: 0; transform: translate(0, 0); } 15% { opacity: 1; transform: translate(0, 0); } 100% { opacity: 1; transform: translate(var(--dx), var(--dy)); } }
    ` + [1, 2, 3, 4, 5].map((n) => `.on${n} .sc-${id} .fly${n} { animation: ${id}-fly 1.3s ease-in-out both; } .on${n} .sc-${id} .ring${n} { animation-iteration-count: 1; }`).join('\n');
  // 돋보기
  const lens = (x, y, r = 16, color = C.ink) => `<circle cx="${x}" cy="${y}" r="${r}" fill="white" fill-opacity=".7" stroke="${color}" stroke-width="4"/><path d="M${f(x + r * 0.7)} ${f(y + r * 0.7)} L${f(x + r * 1.6)} ${f(y + r * 1.6)}" stroke="${color}" stroke-width="6" stroke-linecap="round"/>`;

  // 동전
  const coin = (x, y, r = 9) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${C.yellow}" stroke="${C.orange}" stroke-width="2.5"/>`;

  // ════ 2 경제생활과 선택 ════

  // ── 경제 주체: 가계·기업·정부 사이를 오가는 것 ──
  (function () {
    const id = 't81-so2-juche';
    const css = base2(id);
    let body = '';
    const house = `<path d="M70 168 L98 142 L126 168 V196 H70 Z" fill="white" stroke="${C.green}" stroke-width="3" stroke-linejoin="round"/><rect x="91" y="176" width="14" height="20" fill="${C.green}"/>`;
    const factory = `<path d="M512 196 V160 L532 172 V160 L552 172 V136 H566 V196 Z" fill="white" stroke="${C.blue}" stroke-width="3" stroke-linejoin="round"/>`;
    body += at(1, 'drop', box(98, 130, 135, 160, '', OK) + text(98, 90, '가계', { size: 24 }) + house);
    body += at(1, 'drop', box(542, 130, 135, 160, '', COLD) + text(542, 90, '기업', { size: 24 }) + factory, 0.2);
    const lane = (n, y, toRight, color, label, s) => shown(n, g(`fin fin${n}`, flow(toRight ? [[170, y], [468, y]] : [[468, y], [170, y]], color, { w: 4 }) + text(320, y - 8, label, { size: 18, color }), s));
    body += lane(1, 70, true, C.blue, '노동', 0.4) + lane(1, 110, false, C.green, '임금', 1.0);
    body += lane(2, 150, false, C.orange, '재화·서비스', 0.2) + lane(2, 190, true, C.green, '값', 0.8);
    body += at(3, 'drop', box(320, 300, 160, 60, '정부', OLD, 22), 0.1);
    body += shown(3, g('fin fin3', flow([[60, 214], [60, 315], [236, 315]], C.green, { w: 4 }) + text(150, 337, '세금', { size: 18, color: C.green }) + flow([[580, 214], [580, 315], [404, 315]], C.green, { w: 4 }) + text(490, 337, '세금', { size: 18, color: C.green }), 0.4));
    body += shown(3, g('fin fin3', flow([[238, 285], [120, 285], [120, 216]], C.purple, { w: 4 }) + text(180, 276, '국방·도로', { size: 18, color: C.purple }) + flow([[402, 285], [520, 285], [520, 216]], C.purple, { w: 4 }) + text(460, 276, '국방·도로', { size: 18, color: C.purple }), 1.0));
    body += at(4, 'pop', tag(320, 235, '경제 주체', HOT, { size: 24 }));
    body += glowRect(26, 46, 144, 168, 4, C.orange, 0.3, 12) + glowRect(470, 46, 144, 168, 4, C.orange, 0.5, 12) + glowRect(236, 266, 168, 68, 4, C.orange, 0.7, 12);
    put(KEY('2', '경제 주체'), svg(id, body, css));
  })();

  // ── 생애 주기: 나이에 따른 소득과 소비 ──
  (function () {
    const id = 't81-so2-saengae';
    const css = base2(id);
    const INC = 'M60 300 L175 300 C215 300 250 150 330 112 C390 85 440 95 468 150 L486 254 L600 262';
    const CON = 'M60 252 C140 240 230 205 330 190 C430 176 520 188 600 206';
    let body = `<defs><clipPath id="${id}-a"><path d="${CON} L600 0 L60 0 Z"/></clipPath><clipPath id="${id}-b"><path d="${INC} L600 0 L60 0 Z"/></clipPath></defs>`;
    body += at(1, 'fin', `<path d="M60 40 V300 H606" stroke="${C.ink}" stroke-width="3" fill="none"/><path d="M598 292 L610 300 L598 308" stroke="${C.ink}" stroke-width="3" fill="none" stroke-linejoin="round"/>` + text(60, 30, '돈', { size: 18, color: C.muted }) + text(612, 330, '나이', { size: 18, color: C.muted }));
    [180, 300, 480].forEach((x) => { body += at(1, 'fin', `<path d="M${x} 50 V300" stroke="${C.line}" stroke-width="2" stroke-dasharray="6 6"/>`, 0.2); });
    [['유소년기', 120], ['청년기', 240], ['중장년기', 390], ['노년기', 540]].forEach(([w, x], i) => { body += at(1, 'pop', text(x, 330, w, { size: 18 }), 0.3 + i * 0.3); });
    body += shown(2, drawn(2, INC, C.blue, 5));
    body += at(2, 'pop', text(372, 80, '소득', { size: 20, color: C.blue }), 1.0);
    body += at(2, 'pop', tag(483, 34, '은퇴', COLD, { size: 18 }), 1.4);
    body += shown(3, drawn(3, CON, C.orange, 5));
    body += at(3, 'pop', text(580, 186, '소비', { size: 20, color: C.orange }), 0.9);
    body += at(3, 'fin', `<path d="${INC} L600 300 L60 300 Z" clip-path="url(#${id}-a)" fill="${C.green}" fill-opacity=".22"/>` + text(360, 156, '저축', { size: 20, color: C.green }), 1.2);
    body += at(3, 'fin', `<path d="${CON} L600 300 L60 300 Z" clip-path="url(#${id}-b)" fill="${C.red}" fill-opacity=".16"/>` + text(118, 286, '모자람', { size: 18, color: C.red }) + text(545, 240, '모자람', { size: 18, color: C.red }), 1.4);
    body += at(4, 'pop', tag(190, 60, '생애 주기', HOT, { size: 24 }));
    body += glowRect(64, 310, 524, 30, 4, C.orange, 0.3, 10);
    put(KEY('2', '생애 주기'), svg(id, body, css));
  })();

  // ── 금융: 맡기고 빌리며 돈이 흐른다 ──
  (function () {
    const id = 't81-so2-geumyung';
    const css = base2(id);
    let body = '';
    body += at(1, 'pop', person(80, 230, C.blue, 1.5) + text(80, 262, '맡기는 사람', { size: 18 }));
    body += at(1, 'pop', hall(320, 250, 140, 90, COLD) + text(320, 282, '은행', { size: 20 }), 0.2);
    body += at(2, 'pop', person(560, 230, C.purple, 1.5, { tie: true }) + text(560, 262, '빌리는 사람', { size: 18 }), 0.1);
    body += shown(1, g('fin fin1', flow([[110, 120], [236, 120]], C.green, { w: 4 }) + text(173, 106, '예금', { size: 18, color: C.green }), 0.3));
    [0, 1, 2].forEach((i) => { body += `<g class="h2">${fly(1, 190, 0, coin(112 + i * 14, 212 - i * 8), 0.4 + i * 0.15)}</g>`; });
    body += shown(2, g('fin fin2', flow([[404, 120], [530, 120]], C.green, { w: 4 }) + text(467, 106, '대출', { size: 18, color: C.green }), 0.3));
    [0, 1, 2].forEach((i) => { body += fly(2, 200, 0, coin(302 + i * 14, 212 - i * 8), 0.4 + i * 0.15); });
    body += shown(3, g('fin fin3', flow([[530, 305], [404, 305]], C.orange, { w: 4 }) + text(467, 330, '갚음 + 이자', { size: 18, color: C.orange }) + flow([[236, 305], [110, 305]], C.orange, { w: 4 }) + text(173, 330, '이자', { size: 18, color: C.orange }), 0.2));
    body += fly(3, -176, 76, coin(520, 222, 7), 0.5) + fly(3, -186, 76, coin(296, 222, 7), 1.0);
    body += at(4, 'pop', tag(320, 40, '금융', HOT, { size: 26 }));
    body += glowRect(14, 70, 612, 280, 4, C.orange, 0.3, 16);
    put(KEY('2', '금융'), svg(id, body, css));
  })();

  // ── 안전성·수익성: 같은 돈을 예금과 주식에 넣으면 ──
  const jarFig = (word, id) => {
    const safe = word === '안전성';
    const css = base2(id) + `
      .sc-${id} .lv { transform-box: fill-box; transform-origin: 50% 100%; }
      .sc-${id} .upA { transition: transform 1s ease-out .4s; }
      .on2 .sc-${id} .upA { transform: scaleY(1.15); }
      .on3 .sc-${id} .wob { animation: ${id}-wob 1.8s ease-in-out .1s both; }
      @keyframes ${id}-wob { 0% { transform: scaleY(1); } 25% { transform: scaleY(${safe ? 1.35 : 0.85}); } 50% { transform: scaleY(${safe ? 0.85 : 1.5}); } 75% { transform: scaleY(${safe ? 1.2 : 1.3}); } 100% { transform: scaleY(${safe ? 0.6 : 1.95}); } }`;
    let body = '';
    const jar = (x, name, cls) => `<rect x="${x - 55}" y="100" width="110" height="200" rx="8" fill="white" stroke="${C.ink}" stroke-width="3"/>` +
      `<g class="growy growy1"><g class="lv ${cls}"><rect x="${x - 51}" y="200" width="102" height="96" rx="4" fill="${C.yellow}"/></g></g>` + text(x, 330, name, { size: 22 });
    body += at(1, 'fin', jar(200, '예금', safe ? '' : 'upA'));
    body += at(1, 'fin', jar(440, '주식', 'wob'), 0.2);
    body += at(1, 'fin', `<path d="M138 200 H502" stroke="${C.ink}" stroke-width="2.5" stroke-dasharray="8 6"/>` + text(132, 206, '넣은 돈', { size: 18, anchor: 'end' }), 0.8);
    if (safe) {
      body += at(2, 'pop', `<path d="M200 118 L230 130 V156 Q230 182 200 194 Q170 182 170 156 V130 Z" fill="${C.sky}" stroke="${C.blue}" stroke-width="3" stroke-linejoin="round"/>` + check(200, 156, 0.8), 0.3);
      body += shown(3, g('fin fin3', flow([[516, 190], [516, 246]], C.red, { w: 5 }), 1.2));
      body += at(3, 'pop', tag(560, 280, '줄어듦', ['white', C.red], { size: 18 }), 1.5);
    } else {
      body += at(2, 'pop', tag(292, 184, '이자', OK, { size: 18 }), 1.0);
      body += shown(3, g('fin fin3', flow([[516, 240], [516, 132]], C.green, { w: 5 }), 1.2));
      body += at(3, 'pop', tag(560, 100, '크게 늘어남', OK, { size: 18 }), 1.5);
    }
    const hi = ['높음', OK], lo = ['낮음', ['white', C.red]];
    const [a, b] = safe ? [hi, lo] : [lo, hi];
    body += at(4, 'pop', tag(200, 70, a[0], a[1], { size: 18 }), 0.3) + at(4, 'pop', tag(440, 70, b[0], b[1], { size: 18 }), 0.5);
    body += at(4, 'pop', tag(320, 36, word, HOT, { size: 24 }));
    body += safe ? glowRect(140, 96, 120, 208, 4, C.orange, 0.6, 12) : glowRect(380, 96, 120, 208, 4, C.orange, 0.6, 12);
    put(KEY('2', word), svg(id, body, css));
  };
  jarFig('안전성', 't81-so2-anjeon');
  jarFig('수익성', 't81-so2-suik');

  // ── 유동성: 예금은 바로, 집은 몇 달 ──
  (function () {
    const id = 't81-so2-yudong';
    const css = base2(id);
    let body = '';
    body += at(1, 'drop', `<rect x="95" y="212" width="110" height="76" rx="6" fill="${C.sky}" stroke="${C.blue}" stroke-width="3"/>` + text(150, 258, '예금', { size: 22 }));
    body += at(1, 'drop', `<path d="M425 226 L490 172 L555 226 Z" fill="${C.peach}" stroke="${C.orange}" stroke-width="3" stroke-linejoin="round"/><rect x="438" y="226" width="104" height="74" fill="white" stroke="${C.orange}" stroke-width="3"/>` + text(490, 276, '집', { size: 24 }), 0.2);
    body += at(1, 'pop', person(320, 300, C.green, 1.6), 0.4);
    body += `<g class="h2">${at(1, 'pop', `<g class="jig">${qmark(352, 222)}</g>`, 0.8)}</g>`;
    body += at(1, 'pop', tag(320, 180, '현금', HOT, { size: 18 }), 1.0);
    body += at(2, 'pop', tag(150, 180, '바로', OK, { size: 18 }), 0.2);
    [0, 1, 2].forEach((i) => { body += fly(2, 160 - i * 8, 30, coin(130 + i * 14, 226), 0.3 + i * 0.12); });
    body += at(2, 'pop', `<circle cx="352" cy="222" r="17" fill="white" stroke="${C.green}" stroke-width="3"/>` + check(352, 223, 0.7), 1.6);
    [0, 1, 2].forEach((i) => { body += at(3, 'pop', `<rect x="${458 + i * 6}" y="${88 + i * 6}" width="64" height="52" rx="5" fill="white" stroke="${C.blue}" stroke-width="2.5"/><rect x="${458 + i * 6}" y="${88 + i * 6}" width="64" height="12" rx="4" fill="${C.blue}"/>`, 0.2 + i * 0.3); });
    body += at(3, 'pop', tag(580, 120, '몇 달', COLD, { size: 18 }), 1.1);
    body += fly(3, -150, 30, coin(480, 226), 0.8);
    body += at(4, 'pop', tag(150, 330, '높음', OK, { size: 18 }), 0.3) + at(4, 'pop', tag(490, 330, '낮음', ['white', C.red], { size: 18 }), 0.5);
    body += at(4, 'pop', tag(320, 40, '유동성', HOT, { size: 24 }));
    body += glowRect(90, 206, 120, 88, 4, C.orange, 0.6, 10);
    put(KEY('2', '유동성'), svg(id, body, css));
  })();
})(typeof window !== 'undefined' ? window : globalThis);
