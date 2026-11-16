// 사회 8-1 3·4단원(시장과 가격, 우리나라 경제와 세계화) 낱말 도식.
// 그래프 수치·인구·값은 모두 '가 나라' 같은 예시 수치다(실제 통계가 아님).
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
  const dimFrom = (n, inner) => `<g class="dim dim${n}">${inner}</g>`;
  const tw = (s, size) => [...String(s)].reduce((a, c) => a + (/[가-힣?→↑↓]/.test(c) ? 1 : c === ' ' ? 0.3 : 0.6), 0) * size;
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
  const arr = (x1, y1, x2, y2, color = C.ink, w = 4) => {
    const ang = Math.atan2(y2 - y1, x2 - x1);
    return `<path d="M${f(x1)} ${f(y1)} L${f(x2 - w * Math.cos(ang))} ${f(y2 - w * Math.sin(ang))}" stroke="${color}" stroke-width="${w}" stroke-linecap="round" fill="none"/>` + head(x2, y2, ang, color, w);
  };
  // 흐르는 화살표: 점선이 끝 쪽으로 흐른다
  const flow = (pts, color, { w = 5, dash = '14 10' } = {}) => {
    const [a, b] = pts.slice(-2), ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
    const end = [b[0] - w * Math.cos(ang), b[1] - w * Math.sin(ang)];
    const d = 'M' + [...pts.slice(0, -1), end].map((p) => `${f(p[0])} ${f(p[1])}`).join(' L');
    return `<g><path class="mar" d="${d}" stroke="${color}" stroke-width="${w}" stroke-dasharray="${dash}" stroke-linecap="round" stroke-linejoin="round" fill="none"/>${head(b[0], b[1], ang, color, w)}</g>`;
  };
  const drawn = (n, d, color = C.ink, w = 3, extra = '') => `<path class="draw draw${n}" pathLength="1" d="${d}" stroke="${color}" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round"${extra}/>`;
  const glowRect = (x, y, w, h, n, color = C.orange, delay = 0, rx = 12) =>
    `<g class="b${n}"><rect class="flash flash${n}"${dl(delay)} x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="${rx}" fill="none" stroke="${color}" stroke-width="5"/></g>`;
  const ring = (cx, cy, r, n, color = C.orange, s = 0) => `<g class="b${n}"><circle class="ring ring${n}"${dl(s)} cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${color}" stroke-width="4"/></g>`;
  // 칸마다 자리를 옮기는 것: pts = [[x,y] (1칸), [x,y] (2칸) …]
  const steps = (pts, name) => {
    const out = [];
    for (let n = 1; n <= 5; n++) { const p = pts[Math.min(n, pts.length) - 1]; out.push(name === 's' ? `--s${n}:${p}` : `--x${n}:${f(p[0])}px;--y${n}:${f(p[1])}px`); }
    return out.join(';');
  };
  const mover = (pts, inner, delay = 0) => `<g class="mv" style="${steps(pts)}${delay ? `;transition-delay:${delay}s` : ''}">${inner}</g>`;
  // 칸마다 가로 비율이 바뀌는 것(sl: 왼쪽 끝 고정, sx: 가운데 고정)
  const scaler = (cls, ss, inner, delay = 0) => `<g class="${cls}" style="${steps(ss, 's')}${delay ? `;transition-delay:${delay}s` : ''}">${inner}</g>`;
  // 한 번 미끄러져 가며 사라지는 것(재료가 다음 물건 속으로 들어가는 모습)
  const feed = (n, dx, dy, inner, delay = 0) => `<g class="b${n}"><g class="feed feed${n}" style="--fx:${dx}px;--fy:${dy}px;animation-delay:${delay}s">${inner}</g></g>`;
  const person = (x, y, color = C.green, s = 1) =>
    `<circle cx="${f(x)}" cy="${f(y - 27 * s)}" r="${f(7.5 * s)}" fill="${color}"/><path d="M${f(x - 11 * s)} ${f(y)} V${f(y - 9 * s)} Q${f(x - 11 * s)} ${f(y - 18 * s)} ${f(x)} ${f(y - 18 * s)} Q${f(x + 11 * s)} ${f(y - 18 * s)} ${f(x + 11 * s)} ${f(y - 9 * s)} V${f(y)} Z" fill="${color}"/>`;
  const qmark = (x, y, r = 17) => `<circle cx="${x}" cy="${y}" r="${r}" fill="white" stroke="${C.orange}" stroke-width="3"/>` + text(x, f(y + r * 0.45), '?', { size: f(r * 1.3), color: C.orange });
  const check = (x, y, s = 1, color = C.green) => `<path d="M${f(x - 12 * s)} ${f(y)} L${f(x - 3 * s)} ${f(y + 9 * s)} L${f(x + 13 * s)} ${f(y - 10 * s)}" stroke="${color}" stroke-width="${f(6 * s)}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  const cross = (x, y, r = 14) => `<circle cx="${x}" cy="${y}" r="${r + 6}" fill="white" stroke="${C.red}" stroke-width="3.5"/><path d="M${f(x - r * 0.55)} ${f(y - r * 0.55)} L${f(x + r * 0.55)} ${f(y + r * 0.55)} M${f(x + r * 0.55)} ${f(y - r * 0.55)} L${f(x - r * 0.55)} ${f(y + r * 0.55)}" stroke="${C.red}" stroke-width="5" stroke-linecap="round"/>`;
  // 기둥 건물: 밑 가운데 (x, y)
  const hall = (x, y, w = 150, h = 90, [fill, stroke] = OLD, roofLabel = '') => {
    const cols = 4, gap = (w - 30) / (cols - 1);
    let o = `<path d="M${f(x - w / 2 - 10)} ${f(y - h)} L${f(x)} ${f(y - h - 40)} L${f(x + w / 2 + 10)} ${f(y - h)} Z" fill="${fill}" stroke="${stroke}" stroke-width="3" stroke-linejoin="round"/>`;
    o += `<rect x="${f(x - w / 2)}" y="${f(y - h)}" width="${w}" height="${h}" fill="white" stroke="${stroke}" stroke-width="3"/>`;
    for (let i = 0; i < cols; i++) o += `<rect x="${f(x - w / 2 + 9 + i * gap)}" y="${f(y - h + 10)}" width="12" height="${h - 20}" fill="${fill}"/>`;
    if (roofLabel) o += text(x, f(y - h - 8), roofLabel, { size: 18, color: stroke });
    return o;
  };

  const base = (id) => {
    let s = `
    .sc-${id} .pop, .sc-${id} .pulse, .sc-${id} .ring, .sc-${id} .twk { transform-box: fill-box; transform-origin: center; }
    .sc-${id} .mar { animation: ${id}-mar .7s linear infinite; }
    .sc-${id} .draw { stroke-dasharray: 1; stroke-dashoffset: 1; transition: stroke-dashoffset 1.4s ease-in-out .2s; }
    .sc-${id} .growy { transform-box: fill-box; transform-origin: 50% 100%; transform: scaleY(0); transition: transform 1s ease-out .2s; }
    .sc-${id} .growd { transform-box: fill-box; transform-origin: 50% 0%; transform: scaleY(0); transition: transform 1s ease-out .2s; }
    .sc-${id} .mv { transform: translate(var(--x1), var(--y1)); transition: transform 1.4s ease-in-out; }
    .sc-${id} .sl, .sc-${id} .sx { transform-box: fill-box; transform: scaleX(var(--s1)); transition: transform 1.3s ease-in-out .2s; }
    .sc-${id} .sl { transform-origin: 0 50%; }
    .sc-${id} .sx { transform-origin: 50% 50%; }
    .sc-${id} .dim { transition: opacity .6s ease; }
    .sc-${id} .bob { animation: ${id}-bob 1.4s ease-in-out infinite; }
    .sc-${id} .feed { opacity: 0; }
    .sc-${id} .ring { opacity: 0; }
    @keyframes ${id}-pop { 0% { opacity: 0; transform: scale(.3); } 70% { opacity: 1; transform: scale(1.12); } 100% { opacity: 1; transform: scale(1); } }
    @keyframes ${id}-fin { from { opacity: 0; } to { opacity: 1; } }
    @keyframes ${id}-rise { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
    @keyframes ${id}-drop { from { opacity: 0; transform: translateY(-30px); } to { opacity: 1; transform: none; } }
    @keyframes ${id}-pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.12); } }
    @keyframes ${id}-flash { 0% { opacity: 0; } 20% { opacity: 1; } 40% { opacity: .25; } 60% { opacity: 1; } 80% { opacity: .25; } 100% { opacity: 1; } }
    @keyframes ${id}-ring { 0% { opacity: .9; transform: scale(1); } 100% { opacity: 0; transform: scale(1.6); } }
    @keyframes ${id}-mar { from { stroke-dashoffset: 24; } to { stroke-dashoffset: 0; } }
    @keyframes ${id}-bob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-7px); } }
    @keyframes ${id}-feed { 0% { opacity: 0; transform: none; } 15% { opacity: 1; transform: none; } 75% { opacity: 1; transform: translate(var(--fx), var(--fy)); } 100% { opacity: 0; transform: translate(var(--fx), var(--fy)); } }
    `;
    for (let n = 1; n <= 5; n++) s += `
    .on${n} .sc-${id} .pop${n} { animation: ${id}-pop .5s ease-out both; }
    .on${n} .sc-${id} .fin${n} { animation: ${id}-fin .5s ease-out both; }
    .on${n} .sc-${id} .rise${n} { animation: ${id}-rise .45s ease-out both; }
    .on${n} .sc-${id} .drop${n} { animation: ${id}-drop .5s ease-out both; }
    .on${n} .sc-${id} .pulse${n} { animation: ${id}-pulse .7s ease-in-out .3s 2; }
    .on${n} .sc-${id} .flash${n} { animation: ${id}-flash 1.4s ease-in-out both; }
    .on${n} .sc-${id} .ring${n} { animation: ${id}-ring 1.1s ease-out .3s 2; }
    .on${n} .sc-${id} .feed${n} { animation-name: ${id}-feed; animation-duration: 1.6s; animation-timing-function: ease-in-out; animation-fill-mode: both; }
    .on${n} .sc-${id} .draw${n} { stroke-dashoffset: 0; }
    .on${n} .sc-${id} .growy${n}, .on${n} .sc-${id} .growd${n} { transform: none; }
    .on${n} .sc-${id} .dim${n} { opacity: .28; }`;
    for (let n = 2; n <= 5; n++) s += `
    .on${n} .sc-${id} .mv { transform: translate(var(--x${n}), var(--y${n})); }
    .on${n} .sc-${id} .sl, .on${n} .sc-${id} .sx { transform: scaleX(var(--s${n})); }`;
    return s;
  };

  // ════ 3 시장과 가격 ════

  // ── 생산물 시장·생산 요소 시장: 가계와 기업 사이 두 시장 ──
  const marketFig = (word, id) => {
    const prod = word === '생산물 시장';
    const css = base(id);
    let body = '';
    body += at(1, 'pop', box(100, 180, 140, 64, '가계', OK, 22)) + at(1, 'pop', box(540, 180, 140, 64, '기업', COLD, 22), 0.2);
    const PM = box(320, 58, 200, 56, '생산물 시장', prod ? HOT : PLAIN, 20);
    const FM = box(320, 302, 220, 56, '생산 요소 시장', prod ? PLAIN : HOT, 20);
    body += prod ? at(1, 'pop', PM, 0.4) + `<g opacity=".3">${FM}</g>` : at(1, 'pop', FM, 0.4) + `<g opacity=".3">${PM}</g>`;
    const G = C.orange, M = C.green;
    if (prod) {
      // 기업 → 시장 → 가계: 재화·서비스, 가계 → 시장 → 기업: 돈
      body += shown(2, g('fin fin2', flow([[575, 148], [575, 46], [424, 46]], G) + flow([[216, 46], [65, 46], [65, 148]], G), 0.1));
      body += at(2, 'pop', tag(500, 20, '재화·서비스', HOT, { size: 18 }), 0.4);
      body += shown(3, g('fin fin3', flow([[110, 148], [110, 72], [216, 72]], M) + flow([[424, 72], [530, 72], [530, 148]], M), 0.1));
      body += at(3, 'pop', tag(163, 108, '돈', OK, { size: 18 }), 0.4) + at(3, 'pop', tag(477, 108, '돈', OK, { size: 18 }), 0.6);
      body += glowRect(214, 24, 212, 68, 4, C.orange, 0.2, 12);
    } else {
      // 가계 → 시장 → 기업: 노동·토지·자본, 기업 → 시장 → 가계: 임금·지대·이자
      body += shown(2, g('fin fin2', flow([[65, 212], [65, 314], [208, 314]], G) + flow([[432, 314], [575, 314], [575, 212]], G), 0.1));
      body += at(2, 'pop', tag(128, 344, '노동·토지·자본', HOT, { size: 18 }), 0.4);
      body += shown(3, g('fin fin3', flow([[530, 212], [530, 290], [432, 290]], M) + flow([[208, 290], [110, 290], [110, 212]], M), 0.1));
      body += at(3, 'pop', tag(442, 250, '임금·지대·이자', OK, { size: 18 }), 0.4);
      body += glowRect(204, 268, 232, 68, 4, C.orange, 0.2, 12);
    }
    body += at(4, 'pop', tag(320, 180, word, HOT, { size: 22 }), 0.3);
    put(KEY('3', word), svg(id, body, css));
  };
  marketFig('생산물 시장', 't81-so3-saengsanmul');
  marketFig('생산 요소 시장', 't81-so3-yoso');

  // ── 가격-수량 그래프(값은 예시: 사려는 양 = 12 - 2×가격, 팔려는 양 = 2×가격, 가격은 천 원) ──
  const X = (q) => 120 + q * 38, Y = (p) => 312 - p * 52;
  const axes = () => {
    let o = `<path d="M120 34 V312 H606" stroke="${C.ink}" stroke-width="3" fill="none"/>` + head(120, 30, -Math.PI / 2, C.ink, 3) + head(610, 312, 0, C.ink, 3);
    for (let p = 1; p <= 5; p++) o += `<path d="M113 ${Y(p)} H120" stroke="${C.ink}" stroke-width="2"/>` + text(108, Y(p) + 6, `${p}000`, { size: 18, weight: 600, color: C.muted, anchor: 'end' });
    for (let q = 2; q <= 10; q += 2) o += `<path d="M${X(q)} 312 V319" stroke="${C.ink}" stroke-width="2"/>` + text(X(q), 340, q, { size: 18, weight: 600, color: C.muted });
    o += text(110, 30, '가격(원)', { size: 18, anchor: 'end' }) + text(634, 340, '수량(개)', { size: 18, anchor: 'end' });
    return o;
  };
  const DEM = `M${X(1)} ${Y(5.5)} L${X(10.5)} ${Y(0.75)}`, SUP = `M${X(1)} ${Y(0.5)} L${X(10.5)} ${Y(5.25)}`;
  const demLab = () => text(528, 280, '수요 곡선', { size: 18, color: C.blue, anchor: 'start' });
  const supLab = () => text(528, 46, '공급 곡선', { size: 18, color: C.orange, anchor: 'start' });
  const guide = (q, p, color) => `<path d="M120 ${Y(p)} H${X(q)} V312" stroke="${color}" stroke-width="2.5" stroke-dasharray="7 6" fill="none"/>`;
  const dot = (q, p, color) => `<circle cx="${X(q)}" cy="${Y(p)}" r="8" fill="white" stroke="${color}" stroke-width="4"/>`;
  const pchip = (p, pair = HOT) => tag(84, Y(p), `${p}000`, pair, { size: 18 });
  const qchip = (q, pair = COLD) => tag(X(q), 333, `${q}`, pair, { size: 18 });
  // 한 가격에서 읽는 자리: 안내선 + 점 + 가격·수량 표
  const read = (q, p, color, pair) => guide(q, p, color) + dot(q, p, color) + pchip(p) + qchip(q, pair);

  // 수요량·공급량: 가격 하나에 수량 하나
  const amountFig = (word, id) => {
    const dem = word === '수요량';
    const css = base(id);
    const color = dem ? C.blue : C.orange, pair = dem ? COLD : HOT;
    const A = dem ? [4, 4] : [4, 2], B = dem ? [8, 2] : [8, 4];
    let body = axes();
    body += shown(1, drawn(1, dem ? DEM : SUP, color, 5)) + at(1, 'fin', dem ? demLab() : supLab(), 1.2);
    // 수량 막대: 4 → 8
    body += shown(2, scaler('sl', [0.5, 0.5, 1], `<rect x="120" y="305" width="${X(8) - 120}" height="14" rx="5" fill="${color}" opacity=".55"/>`));
    body += shown(2, g('fin fin2', read(A[0], A[1], color, pair), 0.2), 3);
    body += shown(3, g('fin fin3', read(B[0], B[1], color, pair), 0.2));
    body += at(4, 'pop', tag(300, 287, word, HOT, { size: 20 }), 0.2);
    body += ring(X(B[0]), Y(B[1]), 14, 4, C.orange, 0.2);
    put(KEY('3', word), svg(id, body, css));
  };
  amountFig('수요량', 't81-so3-suyoryang');
  amountFig('공급량', 't81-so3-gonggeupryang');

  // 수요 법칙·공급 법칙: 가격이 오르내리면 점이 선을 따라 움직인다
  const lawFig = (word, id) => {
    const dem = word === '수요 법칙';
    const css = base(id);
    const color = dem ? C.blue : C.orange, pair = dem ? COLD : HOT;
    const up = dem ? [4, 4] : [8, 4], down = dem ? [8, 2] : [4, 2];
    let body = axes();
    body += shown(1, `<path d="${dem ? DEM : SUP}" stroke="${color}" stroke-width="5" stroke-linecap="round" fill="none"/>`) + (dem ? demLab() : supLab());
    body += shown(1, guide(6, 3, C.muted) + pchip(3, PLAIN) + qchip(6, PLAIN), 2);
    body += shown(2, g('fin fin2', guide(up[0], up[1], color) + pchip(up[1]) + qchip(up[0], pair), 0.9), 3);
    body += shown(3, g('fin fin3', guide(down[0], down[1], color) + pchip(down[1]) + qchip(down[0], pair), 0.9));
    // 가격 화살표(세로)와 수량 화살표(가로)
    body += shown(2, g('fin fin2', arr(146, 150, 146, 112, C.orange, 5) + arr(X(6), 290, X(up[0]) + (up[0] < 6 ? 8 : -8), 290, C.blue, 5), 0.3), 3);
    body += shown(3, g('fin fin3', arr(146, 162, 146, 200, C.orange, 5) + arr(X(6), 290, X(down[0]) + (down[0] < 6 ? 8 : -8), 290, C.blue, 5), 0.3));
    body += mover([[0, 0], [X(up[0]) - X(6), Y(up[1]) - Y(3)], [X(down[0]) - X(6), Y(down[1]) - Y(3)]], dot(6, 3, color));
    const sx = dem ? 520 : 236;
    body += at(4, 'pop', tag(sx, 66, dem ? '가격 ↑ 수량 ↓' : '가격 ↑ 수량 ↑', PLAIN, { size: 18 }), 0.2);
    body += at(4, 'pop', tag(sx, 106, dem ? '가격 ↓ 수량 ↑' : '가격 ↓ 수량 ↓', PLAIN, { size: 18 }), 0.5);
    body += at(4, 'pop', tag(sx, 150, word, HOT, { size: 22 }), 0.8);
    put(KEY('3', word), svg(id, body, css));
  };
  lawFig('수요 법칙', 't81-so3-suyobeop');
  lawFig('공급 법칙', 't81-so3-gonggeupbeop');

  // 수요 곡선·공급 곡선: 가격마다 찍은 점을 잇는다
  const curveFig = (word, id) => {
    const dem = word === '수요 곡선';
    const css = base(id);
    const color = dem ? C.blue : C.orange;
    let body = axes();
    [1, 2, 3, 4, 5].forEach((p, i) => {
      const q = dem ? 12 - 2 * p : 2 * p;
      body += at(2, 'pop', `<circle cx="${X(q)}" cy="${Y(p)}" r="9" fill="${color}"/>`, 0.2 + i * 0.3);
    });
    body += shown(3, drawn(3, dem ? DEM : SUP, color, 5));
    body += at(3, 'fin', dem ? demLab() : supLab(), 1.4);
    // 기울기 방향 화살표(선과 나란히, 위쪽으로 비켜서)
    body += dem ? shown(4, g('fin fin4', arr(262, 44, 462, 181, C.blue, 4), 0.2)) : shown(4, g('fin fin4', arr(240, 290, 440, 153, C.orange, 4), 0.2));
    body += at(4, 'pop', tag(dem ? 520 : 236, dem ? 110 : 90, word, HOT, { size: 22 }), 0.6);
    put(KEY('3', word), svg(id, body, css));
  };
  curveFig('수요 곡선', 't81-so3-suyogokseon');
  curveFig('공급 곡선', 't81-so3-gonggeupgokseon');

  // 균형 가격·균형 거래량: 두 선이 만나는 점
  const eqFig = (word, id) => {
    const price = word === '균형 가격';
    const css = base(id);
    let body = axes();
    body += shown(1, `<path d="${DEM}" stroke="${C.blue}" stroke-width="5" stroke-linecap="round" fill="none"/><path d="${SUP}" stroke="${C.orange}" stroke-width="5" stroke-linecap="round" fill="none"/>`) + demLab() + supLab();
    if (price) {
      // 4000원: 팔려는 양 8 > 사려는 양 4 → 남음, 2000원: 사려는 양 8 > 팔려는 양 4 → 모자람
      body += shown(2, g('fin fin2', `<path d="M120 ${Y(4)} H${X(8)}" stroke="${C.muted}" stroke-width="2.5" stroke-dasharray="7 6"/>` + dot(4, 4, C.blue) + dot(8, 4, C.orange) + pchip(4, PLAIN) +
        `<path d="M${X(4) + 10} ${Y(4)} H${X(8) - 10}" stroke="${C.red}" stroke-width="7" stroke-linecap="round" opacity=".7"/>` + tag(X(6), 78, '남음', ['white', C.red], { size: 18 }), 0.2), 3);
      body += shown(2, g('fin fin2', `<g class="bob">${arr(X(6) + 52, 66, X(6) + 52, 96, C.red, 4)}</g>`, 0.8), 3);
      body += shown(3, g('fin fin3', `<path d="M120 ${Y(2)} H${X(8)}" stroke="${C.muted}" stroke-width="2.5" stroke-dasharray="7 6"/>` + dot(4, 2, C.orange) + dot(8, 2, C.blue) + pchip(2, PLAIN) +
        `<path d="M${X(4) + 10} ${Y(2)} H${X(8) - 10}" stroke="${C.blue}" stroke-width="7" stroke-linecap="round" opacity=".7"/>` + tag(X(6), 238, '모자람', ['white', C.blue], { size: 18 }), 0.2), 4);
      body += shown(3, g('fin fin3', `<g class="bob">${arr(X(6) + 64, 250, X(6) + 64, 222, C.blue, 4)}</g>`, 0.8), 4);
      body += shown(4, g('fin fin4', guide(6, 3, C.ink).replace(` V312`, '') + dot(6, 3, C.ink) + pchip(3), 0.2));
      body += at(4, 'pop', tag(206, 132, '균형 가격', HOT, { size: 20 }), 0.6);
      body += ring(X(6), Y(3), 14, 4, C.orange, 0.4);
    } else {
      body += at(2, 'pop', dot(6, 3, C.ink), 0.3) + ring(X(6), Y(3), 14, 2, C.orange, 0.5);
      body += shown(2, g('fin fin2', `<path d="M120 ${Y(3)} H${X(6)}" stroke="${C.muted}" stroke-width="2.5" stroke-dasharray="7 6"/>` + pchip(3, PLAIN), 0.9));
      body += shown(3, drawn(3, `M${X(6)} ${Y(3) + 10} V312`, C.ink, 3));
      body += shown(3, scaler('sl', [0, 0, 1], `<rect x="120" y="305" width="${X(6) - 120}" height="14" rx="5" fill="${C.purple}" opacity=".6"/>`));
      body += at(3, 'pop', qchip(6, OLD), 1.2);
      body += at(4, 'pop', tag(282, 285, '균형 거래량', HOT, { size: 18 }), 0.3);
      body += glowRect(X(6) - 26, 315, 52, 36, 4, C.orange, 0.6, 18);
    }
    put(KEY('3', word), svg(id, body, css));
  };
  eqFig('균형 가격', 't81-so3-gyunhyeonggagyeok');
  eqFig('균형 거래량', 't81-so3-gyunhyeonggeorae');

  // ════ 4 우리나라 경제와 세계화 ════

  // 물건 그림
  const cotton = (x, y) => `<path d="M${x} ${y + 34} V${y + 4}" stroke="${C.green}" stroke-width="4"/><path d="M${x} ${y + 22} Q${x + 14} ${y + 14} ${x + 18} ${y + 22}" stroke="${C.green}" stroke-width="3" fill="none"/>` +
    [[-11, -2], [11, -2], [0, -14]].map(([dx, dy]) => `<circle cx="${x + dx}" cy="${y + dy}" r="13" fill="white" stroke="${C.muted}" stroke-width="2.5"/>`).join('');
  const spool = (x, y) => `<rect x="${x - 22}" y="${y - 26}" width="44" height="8" rx="3" fill="${C.orange}"/><rect x="${x - 22}" y="${y + 18}" width="44" height="8" rx="3" fill="${C.orange}"/><rect x="${x - 15}" y="${y - 18}" width="30" height="36" fill="${C.sky}" stroke="${C.blue}" stroke-width="2"/>` +
    [-10, -3, 4, 11].map((d) => `<path d="M${x - 15} ${y + d} H${x + 15}" stroke="${C.blue}" stroke-width="2"/>`).join('');
  const shirt = (x, y, col = C.blue) => `<path d="M${x - 14} ${y - 26} L${x - 34} ${y - 16} L${x - 26} ${y} L${x - 18} ${y - 4} V${y + 28} H${x + 18} V${y - 4} L${x + 26} ${y} L${x + 34} ${y - 16} L${x + 14} ${y - 26} Q${x} ${y - 14} ${x - 14} ${y - 26} Z" fill="${C.sky}" stroke="${col}" stroke-width="3" stroke-linejoin="round"/>`;
  const bread = (x, y) => `<path d="M${x - 30} ${y + 14} V${y - 4} Q${x - 30} ${y - 22} ${x} ${y - 22} Q${x + 30} ${y - 22} ${x + 30} ${y - 4} V${y + 14} Z" fill="${C.peach}" stroke="${C.orange}" stroke-width="3" stroke-linejoin="round"/>` +
    [-12, 0, 12].map((d) => `<path d="M${x + d - 4} ${y - 12} L${x + d + 4} ${y - 2}" stroke="${C.orange}" stroke-width="2.5" stroke-linecap="round"/>`).join('');
  const ball = (x, y) => `<circle cx="${x}" cy="${y}" r="24" fill="white" stroke="${C.ink}" stroke-width="3"/><path d="M${x - 24} ${y} Q${x} ${y - 12} ${x + 24} ${y} M${x} ${y - 24} Q${x - 12} ${y} ${x} ${y + 24}" stroke="${C.ink}" stroke-width="2.5" fill="none"/>`;

  // ── 국내 총생산·최종 생산물: 목화 → 실 → 티셔츠 ──
  const chainFig = (word, id) => {
    const gdp = word === '국내 총생산';
    const css = base(id);
    let body = '';
    if (gdp) {
      body += at(1, 'fin', `<rect x="16" y="56" width="608" height="292" rx="18" fill="none" stroke="${C.muted}" stroke-width="3" stroke-dasharray="12 8"/>`);
      body += at(1, 'pop', tag(80, 56, '가 나라', OK, { size: 20 }), 0.1) + at(1, 'pop', tag(568, 56, '1년', COLD, { size: 20 }), 0.3);
      const CY = 110, P = [[110, '목화', '2천 원', cotton], [270, '실', '5천 원', spool], [430, '티셔츠', '1만 원', shirt]];
      P.forEach(([x, name, price, icon], i) => {
        const piece = icon(x, CY) + text(x, CY + 50, name, { size: 18 });
        const pr = tag(x, CY + 80, price, PLAIN, { size: 18 });
        if (i < 2) {
          body += dimFrom(2, at(1, 'pop', piece + pr, 0.3 + i * 0.5));
          body += shown(2, `<path class="draw draw2" pathLength="1" style="transition-delay:${0.3 + i * 0.4}s" d="M${x - 46} ${CY + 92} L${x + 46} ${CY + 68}" stroke="${C.red}" stroke-width="5" stroke-linecap="round" fill="none"/>`);
        } else {
          body += at(1, 'pop', piece, 0.3 + i * 0.5);
          body += `<g class="b1">${mover([[0, 0], [0, 0], [-300, 116]], g('pop pop1', pr, 1.3))}</g>`;
        }
        if (i) body += dimFrom(2, shown(1, g('fin fin1', arr(x - 112, CY, x - 52, CY, C.muted, 4), 0.1 + i * 0.5)));
      });
      // 3칸: 그해 새로 만든 마지막 물건 값만 더한다
      body += `<g class="b3"><g class="mv" style="${steps([[0, 0], [0, 0], [-300, 142]])}">${shirt(430, CY)}</g></g>`;
      body += at(3, 'pop', text(200, 272, '+', { size: 30 }), 1.2) + at(3, 'pop', bread(270, 256) + tag(270, 306, '5천 원', PLAIN, { size: 18 }), 1.3);
      body += at(3, 'pop', text(330, 272, '+', { size: 30 }), 1.5) + at(3, 'pop', ball(390, 252) + tag(390, 306, '5천 원', PLAIN, { size: 18 }), 1.6);
      body += at(3, 'pop', text(456, 288, '=', { size: 30 }), 1.8) + at(3, 'pop', tag(540, 280, '2만 원', HOT, { size: 24 }), 1.9);
      body += at(4, 'pop', tag(320, 24, '국내 총생산', HOT, { size: 22 }), 0.2);
      body += glowRect(480, 254, 120, 52, 4, C.orange, 0.5, 26);
    } else {
      const CY = 150, P = [[90, '목화', cotton], [240, '실', spool], [390, '티셔츠', shirt]];
      P.forEach(([x, name, icon], i) => {
        body += at(1, 'pop', icon(x, CY) + text(x, CY + 52, name, { size: 18 }), 0.2 + i * 0.5);
        if (i) body += shown(1, g('fin fin1', arr(x - 112, CY, x - 52, CY, C.muted, 4), i * 0.5));
      });
      // 2칸: 목화와 실은 다음 물건의 재료로 들어간다
      body += at(2, 'pop', tag(90, 70, '재료', HOT, { size: 18 }), 0.1) + at(2, 'pop', tag(240, 70, '재료', HOT, { size: 18 }), 0.3);
      body += feed(2, 150, 0, cotton(90, CY), 0.4) + feed(2, 150, 0, spool(240, CY), 0.6);
      // 3칸: 티셔츠는 소비자가 사서 입는다
      body += at(3, 'pop', person(584, 250, C.green, 2.2) + text(584, 278, '소비자', { size: 18, color: C.green }), 0);
      body += `<g class="b3">${mover([[0, 0], [0, 0], [118, 60]], shirt(390, CY), 0.3)}</g>`;
      body += at(4, 'pop', tag(390, 240, '최종 생산물', HOT, { size: 22 }), 0.2);
      body += ring(390, 150, 44, 4, C.orange, 0.4);
    }
    put(KEY('4', word), svg(id, body, css));
  };
  chainFig('국내 총생산', 't81-so4-gdp');
  chainFig('최종 생산물', 't81-so4-choejong');

  // ── 경제 지표: 나라 경제를 숫자로 잰다 ──
  (function () {
    const id = 't81-so4-jipyo';
    const css = base(id) + `
      .sc-${id} .needle { transform-box: view-box; transform-origin: 546px 192px; transform: rotate(-80deg); transition: transform 1.2s ease-out .6s; }
      .on2 .sc-${id} .needle { transform: rotate(30deg); }
      .sc-${id} .donut { stroke-dasharray: 1; stroke-dashoffset: 1; transition: stroke-dashoffset 1.2s ease-out .9s; }
      .on2 .sc-${id} .donut { stroke-dashoffset: .96; }`;
    let body = '';
    body += at(1, 'pop', `<circle cx="120" cy="190" r="86" fill="${C.mint}" stroke="${C.green}" stroke-width="3"/>` + text(120, 180, '가 나라', { size: 20, color: C.green }) + text(120, 206, '경제', { size: 20, color: C.green }), 0);
    body += shown(1, g('pop pop1', qmark(178, 112, 20), 0.5), 3);
    body += at(3, 'pop', `<circle cx="178" cy="112" r="20" fill="white" stroke="${C.green}" stroke-width="3"/>` + check(178, 113, 0.75), 0.2);
    const CARD = [['국내 총생산', 80], ['물가 상승률', 190], ['실업률', 300]];
    CARD.forEach(([name, cy], i) => {
      body += at(2, 'rise', `<rect x="270" y="${cy - 40}" width="340" height="80" rx="12" fill="white" stroke="${C.muted}" stroke-width="3"/>` + text(292, cy + 7, name, { size: 20, anchor: 'start' }), 0.1 + i * 0.25);
      body += shown(2, g('fin fin2', arr(208, 190 + (cy - 190) * 0.25, 262, cy, C.muted, 3), 0.1 + i * 0.25));
    });
    // 국내 총생산: 커지는 막대
    [26, 34, 42, 52].forEach((h, k) => { body += shown(2, `<rect class="growy growy2" style="transition-delay:${0.6 + k * 0.15}s" x="${490 + k * 26}" y="${112 - h}" width="18" height="${h}" fill="${C.green}"/>`); });
    // 물가: 바늘이 움직이는 계기판
    body += shown(2, `<path d="M506 192 A40 40 0 0 1 586 192" stroke="${C.line}" stroke-width="10" fill="none"/><g class="needle"><path d="M546 192 V158" stroke="${C.red}" stroke-width="4" stroke-linecap="round"/></g><circle cx="546" cy="192" r="6" fill="${C.ink}"/>`);
    body += at(2, 'pop', text(462, 197, '3 %', { size: 20, color: C.orange }), 1.2);
    // 실업률: 채워지는 고리
    body += shown(2, `<circle cx="546" cy="300" r="26" fill="none" stroke="${C.line}" stroke-width="10"/><circle class="donut" pathLength="1" cx="546" cy="300" r="26" fill="none" stroke="${C.blue}" stroke-width="10" transform="rotate(-90 546 300)"/>`);
    body += at(2, 'pop', text(462, 307, '4 %', { size: 20, color: C.blue }), 1.4);
    body += glowRect(262, 32, 356, 316, 3, C.orange, 0.3, 16);
    body += at(3, 'pop', tag(120, 316, '경제 지표', HOT, { size: 22 }), 0.6);
    put(KEY('4', '경제 지표'), svg(id, body, css));
  })();

  // ── 물가: 여러 물건 값의 바뀜을 모아 평균을 낸다(예시: +10, +4, 0, -6 → 평균 +2 %) ──
  (function () {
    const id = 't81-so4-mulga';
    const css = base(id);
    let body = '';
    const BY = 210, K = 8, ITEMS = [['빵', 10], ['우유', 4], ['버스비', 0], ['공책', -6]];
    body += at(1, 'fin', `<path d="M64 ${BY} H612" stroke="${C.muted}" stroke-width="2.5" stroke-dasharray="8 6"/>` + text(18, BY + 6, '작년', { size: 18, color: C.muted, anchor: 'start' }), 0);
    ITEMS.forEach(([name, v], i) => {
      const x = 120 + i * 100;
      body += at(1, 'pop', tag(x, 326, name, PLAIN, { size: 18 }), 0.2 + i * 0.2);
      const bar = v > 0 ? `<rect class="growy growy2" style="transition-delay:${0.2 + i * 0.2}s" x="${x - 22}" y="${BY - v * K}" width="44" height="${v * K}" fill="${C.orange}"/>`
        : v < 0 ? `<rect class="growd growd2" style="transition-delay:${0.2 + i * 0.2}s" x="${x - 22}" y="${BY}" width="44" height="${-v * K}" fill="${C.blue}"/>`
          : `<rect x="${x - 22}" y="${BY - 3}" width="44" height="6" fill="${C.muted}"/>`;
      body += shown(2, bar);
      const lab = v > 0 ? `+${v} %` : v < 0 ? `−${-v} %` : '0 %';
      body += at(2, 'pop', text(x, v >= 0 ? BY - v * K - 12 : BY - v * K + 26, lab, { size: 18, color: v > 0 ? C.orange : v < 0 ? C.blue : C.muted }), 0.9 + i * 0.2);
      // 3칸: 값의 바뀜이 평균 막대 쪽으로 모인다
      if (v) body += feed(3, 540 - x, 0, `<rect x="${x - 22}" y="${v > 0 ? BY - v * K : BY}" width="44" height="${Math.abs(v) * K}" fill="${v > 0 ? C.orange : C.blue}" opacity=".5"/>`, i * 0.15);
    });
    body += at(3, 'fin', `<rect x="510" y="${BY - 2 * K}" width="60" height="${2 * K}" fill="${C.red}"/>`, 1.2);
    body += at(3, 'pop', text(540, BY - 2 * K - 12, '+2 %', { size: 20, color: C.red }), 1.4);
    body += at(3, 'pop', tag(540, 326, '평균', HOT, { size: 18 }), 1.2);
    body += at(4, 'pop', tag(540, 90, '물가', HOT, { size: 24 }), 0.2);
    body += glowRect(496, BY - 64, 88, 92, 4, C.orange, 0.5, 12);
    put(KEY('4', '물가'), svg(id, body, css));
  })();

  // ── 인플레이션: 빵값이 해마다 오르고, 같은 돈으로 사는 빵이 준다(예시 값) ──
  (function () {
    const id = 't81-so4-inflation';
    const css = base(id);
    let body = '';
    const BASE = 300, YR = [['첫해', 2, 90], ['둘째 해', 3, 170], ['셋째 해', 4, 250]];
    body += at(1, 'fin', `<path d="M44 40 V${BASE} H300" stroke="${C.ink}" stroke-width="3" fill="none"/>` + text(54, 36, '빵값', { size: 18, anchor: 'start' }), 0);
    YR.forEach(([name, p, x], i) => {
      const h = p * 50, n = i ? 2 : 1;
      body += text(x, BASE + 28, name, { size: 18, color: C.muted });
      body += shown(n, `<rect class="growy growy${n}" style="transition-delay:${0.2 + (i ? (i - 1) * 0.5 : 0)}s" x="${x - 26}" y="${BASE - h}" width="52" height="${h}" fill="${C.orange}" opacity=".85"/>`);
      body += at(n, 'pop', text(x, BASE - h - 10, `${p}천 원`, { size: 18, color: C.orange }), 0.9 + (i ? (i - 1) * 0.5 : 0));
    });
    body += shown(2, g('fin fin2', arr(60, 172, 280, 44, C.red, 4), 1.4));
    // 다른 물건값도 오른다
    body += at(2, 'pop', tag(380, 330, '우유 ↑', PLAIN, { size: 18 }), 1.5) + at(2, 'pop', tag(490, 330, '버스비 ↑', PLAIN, { size: 18 }), 1.7);
    // 오른쪽: 같은 1만 2천 원
    body += at(1, 'pop', `<rect x="400" y="30" width="170" height="56" rx="6" fill="${C.mint}" stroke="${C.green}" stroke-width="3"/>` + text(485, 65, '1만 2천 원', { size: 20, color: C.green }), 0.2);
    const SPOT = [[410, 150], [470, 150], [530, 150], [410, 220], [470, 220], [530, 220]];
    SPOT.forEach(([x, y], i) => {
      const b = `<g transform="translate(${x} ${y}) scale(.9)">${bread(0, 0)}</g>`;
      body += i < 3 ? at(1, 'pop', b, 0.4 + i * 0.12) : shown(1, g('pop pop1', b, 0.4 + i * 0.12), 3);
    });
    body += shown(1, g('pop pop1', tag(600, 186, '6개', HOT, { size: 18 }), 1.2), 3);
    body += at(3, 'pop', tag(600, 150, '3개', ['white', C.red], { size: 18 }), 0.6);
    body += at(4, 'pop', tag(485, 280, '인플레이션', HOT, { size: 22 }), 0.2);
    put(KEY('4', '인플레이션'), svg(id, body, css));
  })();

  // ── 인구 나누기: 15세 미만 / 15세 이상(노동 가능 인구) → 경제 활동 인구(취업자·실업자) / 비경제 활동 인구 ──
  // 예시 인원: 15세 미만 4, 취업자 9, 실업자 1, 비경제 활동 5
  const popFig = (word, id) => {
    const css = base(id);
    const isLab = word === '노동 가능 인구', isEco = word === '경제 활동 인구', isNon = word === '비경제 활동 인구', isRate = word === '실업률';
    // 단계: 사람·큰 상자·경제 활동 상자·나눔·비경제 상자가 나오는 칸
    const S = isLab ? { ppl: 1, big: 2, eco: 3, split: 3, non: 3, last: 4 }
      : isEco ? { ppl: 1, big: 1, eco: 2, split: 3, non: 9, last: 4 }
        : isNon ? { ppl: 1, big: 1, eco: 9, split: 9, non: 2, last: 4 }
          : { ppl: 1, big: 1, eco: 1, split: 1, non: 1, last: 4 };
    let body = '';
    // 15세 미만
    const kid = `<rect x="14" y="70" width="98" height="270" rx="12" fill="${C.sky}" fill-opacity=".45" stroke="${C.blue}" stroke-width="3"/>` + text(63, 98, '15세 미만', { size: 18, color: C.blue });
    body += isRate ? dimFrom(1, at(1, 'fin', kid, 0.1)) : at(S.big, 'fin', kid, 0.1);
    const kids = [[40, 190], [86, 190], [40, 262], [86, 262]].map(([x, y]) => person(x, y, C.blue, 0.85)).join('');
    // 큰 상자: 15세 이상
    const big = `<rect x="124" y="70" width="502" height="270" rx="12" fill="${C.mint}" fill-opacity=".35" stroke="${C.green}" stroke-width="3"/>` +
      text(375, 98, isLab ? '15세 이상' : '노동 가능 인구 (15세 이상)', { size: 19, color: C.green });
    body += at(S.big, 'fin', big, 0.3);
    const ecoBox = `<rect x="136" y="112" width="312" height="218" rx="10" fill="white" fill-opacity=".7" stroke="${C.orange}" stroke-width="3"${isLab ? ' stroke-dasharray="10 7"' : ''}/>` + text(292, 138, '경제 활동 인구', { size: 19, color: C.orange });
    const nonBox = `<rect x="458" y="112" width="156" height="218" rx="10" fill="white" fill-opacity=".7" stroke="${C.purple}" stroke-width="3"${isLab ? ' stroke-dasharray="10 7"' : ''}/>` + text(536, 140, '비경제', { size: 19, color: C.purple }) + text(536, 164, '활동 인구', { size: 19, color: C.purple });
    if (S.eco < 9) body += at(S.eco, 'fin', ecoBox, isLab ? 0.2 : 0.1);
    if (S.non < 9) body += isRate ? dimFrom(1, at(1, 'fin', nonBox, 0.1)) : at(S.non, 'fin', nonBox, isLab ? 0.5 : 0.1);
    const split = `<path d="M146 266 H438" stroke="${C.orange}" stroke-width="2.5" stroke-dasharray="8 6"/>` + text(156, 176, '취업자', { size: 18, anchor: 'start' }) + text(156, 302, '실업자', { size: 18, anchor: 'start', color: C.red });
    if (S.split < 9 && !isLab) body += at(S.split, 'fin', split, 0.2);
    // 사람들
    const work = Array.from({ length: 9 }, (_, i) => person(172 + i * 32, 252, C.green, 0.95)).join('');
    const jobless = person(270, 318, isLab ? C.green : C.red, 0.95);
    const looking = !isLab && S.split < 9 ? at(S.split, 'pop', qmark(298, 290, 12), 0.6) : '';
    const book = (x, y) => `<rect x="${x + 7}" y="${y - 20}" width="11" height="14" rx="2" fill="${C.orange}"/>`;
    const cane = (x, y) => `<path d="M${x + 14} ${y - 16} V${y} M${x + 14} ${y - 16} Q${x + 14} ${y - 22} ${x + 9} ${y - 20}" stroke="${C.ink}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
    const nonP = [[490, 244, book], [536, 244, book], [582, 244, null], [513, 312, cane], [559, 312, cane]].map(([x, y, extra]) => person(x, y, isLab ? C.green : C.purple, 0.95) + (extra ? extra(x, y) : '')).join('');
    const pplDelay = (k) => 0.2 + k * 0.2;
    let kidsG = at(S.ppl, 'pop', kids, pplDelay(0)), workG = at(S.ppl, 'pop', work, pplDelay(1)), joblessG = at(S.ppl, 'pop', jobless, pplDelay(2)), nonG = at(S.ppl, 'pop', nonP, pplDelay(3));
    if (isEco || isNon) kidsG = dimFrom(2, kidsG);
    if (isEco) nonG = dimFrom(2, nonG);
    if (isRate) { kidsG = dimFrom(1, kidsG); nonG = dimFrom(1, nonG); }
    if (isNon) { workG = dimFrom(3, workG); joblessG = dimFrom(3, joblessG); }
    body += kidsG + workG + joblessG + nonG + looking;
    if (isLab) {
      body += at(4, 'pop', tag(375, 32, '노동 가능 인구', HOT, { size: 22 }), 0.2);
      body += glowRect(120, 66, 510, 278, 4, C.orange, 0.5, 14);
    } else if (isEco) {
      body += at(4, 'pop', tag(292, 32, '경제 활동 인구', HOT, { size: 22 }), 0.2);
      body += glowRect(132, 108, 320, 226, 4, C.orange, 0.5, 12);
    } else if (isNon) {
      body += at(3, 'pop', tag(536, 188, '일 찾지 않음', ['white', C.red], { size: 18 }), 0.3);
      body += at(4, 'pop', tag(470, 32, '비경제 활동 인구', HOT, { size: 22 }), 0.2);
      body += glowRect(454, 108, 164, 226, 4, C.orange, 0.5, 12);
    } else {
      // 실업률 = 실업자 ÷ 경제 활동 인구 × 100
      body += glowRect(132, 108, 320, 226, 2, C.orange, 0.2, 12) + at(2, 'pop', tag(398, 138, '10명', HOT, { size: 18 }), 0.5);
      body += glowRect(146, 270, 292, 56, 2, C.red, 1.1, 10) + at(2, 'pop', tag(370, 300, '1명', ['white', C.red], { size: 18 }), 1.3);
      body += at(3, 'pop', tag(320, 32, '1 ÷ 10 × 100 = 10 %', HOT, { size: 20 }), 0.3);
      body += at(4, 'pop', tag(562, 32, '실업률', HOT, { size: 22 }), 0.2);
    }
    put(KEY('4', word), svg(id, body, css));
  };
  popFig('노동 가능 인구', 't81-so4-nodonggin');
  popFig('경제 활동 인구', 't81-so4-gyeongje');
  popFig('비경제 활동 인구', 't81-so4-bigyeongje');
  popFig('실업률', 't81-so4-silmeop');

  // ── 중앙은행: 돈을 찍어 내고, 은행을 거쳐 흘러가는 돈의 양을 맞춘다 ──
  (function () {
    const id = 't81-so4-jungang';
    const css = base(id) + `
      .sc-${id} .needle { transform-box: view-box; transform-origin: 540px 262px; transform: rotate(0deg); }
      .on3 .sc-${id} .needle { animation: ${id}-swing 1.8s ease-in-out .2s both; }
      @keyframes ${id}-swing { 0% { transform: rotate(0deg); } 30% { transform: rotate(62deg); } 60% { transform: rotate(-55deg); } 100% { transform: rotate(0deg); } }`;
    let body = '';
    body += at(1, 'rise', hall(260, 150, 160, 80, OLD) + `<rect x="204" y="78" width="112" height="30" rx="4" fill="white" stroke="${C.purple}" stroke-width="2.5"/>` + text(260, 100, '한국은행', { size: 18, color: C.purple }), 0) + at(1, 'pop', text(260, 178, '중앙은행', { size: 20, color: C.purple }), 0.3);
    const note = (x, y) => `<rect x="${x - 30}" y="${y - 15}" width="60" height="30" rx="4" fill="${C.mint}" stroke="${C.green}" stroke-width="2.5"/><circle cx="${x}" cy="${y}" r="8" fill="none" stroke="${C.green}" stroke-width="2.5"/>`;
    [[110, 70], [110, 116], [410, 70], [410, 116]].forEach(([x, y], i) => { body += at(1, 'rise', note(x, y), 0.5 + i * 0.2); });
    // 2칸: 은행 둘 → 가계·기업
    [140, 380].forEach((x, i) => {
      body += at(2, 'rise', hall(x, 286, 110, 44, COLD) + text(x, 310, '은행', { size: 18, color: C.blue }), 0.5 + i * 0.2);
      body += shown(2, g('fin fin2', flow([[260 + (x < 260 ? -40 : 40), 188], [x, 206]], C.green, { w: 4 }), 0.2));
      body += at(2, 'pop', tag(x - 46, 342, '가계', OK, { size: 18 }) + tag(x + 46, 342, '기업', COLD, { size: 18 }), 1.1 + i * 0.2);
    });
    // 3칸: 돈의 양을 맞추는 계기판
    body += at(3, 'fin', `<path d="M480 262 A60 60 0 0 1 488.1 232" stroke="${C.blue}" stroke-width="14" fill="none"/><path d="M591.9 232 A60 60 0 0 1 600 262" stroke="${C.orange}" stroke-width="14" fill="none"/>` +
      `<path d="M488.1 232 A60 60 0 0 1 591.9 232" stroke="${C.green}" stroke-width="14" fill="none"/>` + text(466, 290, '적음', { size: 18, color: C.blue }) + text(614, 290, '많음', { size: 18, color: C.orange }) + text(540, 330, '돈의 양', { size: 18 }), 0);
    body += shown(3, `<g class="needle"><path d="M540 262 V214" stroke="${C.red}" stroke-width="5" stroke-linecap="round"/></g><circle cx="540" cy="262" r="7" fill="${C.ink}"/>`);
    body += at(4, 'pop', tag(530, 60, '중앙은행', HOT, { size: 22 }), 0.2);
    body += glowRect(166, 22, 188, 166, 4, C.orange, 0.4, 12);
    put(KEY('4', '중앙은행'), svg(id, body, css));
  })();

  // ── 환율: 1달러를 바꾸는 데 드는 우리 돈(예시 1,000원 → 1,200원) ──
  (function () {
    const id = 't81-so4-hwanyul';
    const css = base(id);
    let body = '';
    // 저울
    body += at(1, 'fin', `<path d="M320 120 V320 M260 330 H380" stroke="${C.ink}" stroke-width="6" stroke-linecap="round"/><path d="M150 120 H490" stroke="${C.ink}" stroke-width="6" stroke-linecap="round"/><circle cx="320" cy="120" r="9" fill="${C.ink}"/>` +
      [150, 490].map((x) => `<path d="M${x} 120 L${x - 64} 236 M${x} 120 L${x + 64} 236" stroke="${C.muted}" stroke-width="2.5"/><path d="M${x - 78} 236 H${x + 78} Q${x} 270 ${x - 78} 236 Z" fill="${C.line}" stroke="${C.muted}" stroke-width="2.5"/>`).join(''), 0);
    // 1달러
    body += at(1, 'drop', `<rect x="100" y="196" width="100" height="40" rx="5" fill="${C.mint}" stroke="${C.green}" stroke-width="3"/>` + text(150, 223, '1달러', { size: 20, color: C.green }), 0.3);
    // 원화: 1,000원 지폐, 2칸에 100원 동전 둘
    body += at(1, 'drop', `<g class="won"><rect x="434" y="196" width="112" height="40" rx="5" fill="${C.peach}" stroke="${C.orange}" stroke-width="3"/>${text(490, 223, '1,000원', { size: 20, color: C.orange })}</g>`, 0.6);
    [466, 514].forEach((x, i) => { body += at(2, 'drop', `<circle cx="${x}" cy="172" r="21" fill="${C.yellow}" stroke="${C.orange}" stroke-width="3"/>` + text(x, 178, '100', { size: 18 }), 0.3 + i * 0.3); });
    body += shown(1, g('pop pop1', tag(320, 40, '1달러 = 1,000원', PLAIN, { size: 22 }), 1), 2);
    body += at(2, 'pop', tag(320, 40, '1달러 = 1,200원', HOT, { size: 22 }), 0.9);
    body += at(2, 'pop', tag(560, 120, '환율 ↑', HOT, { size: 20 }), 1.3);
    body += ring(466, 172, 22, 3, C.red, 0) + ring(514, 172, 22, 3, C.red, 0.2);
    body += at(3, 'pop', `<g class="bob">${tag(490, 300, '원화 가치 ↓', ['white', C.red], { size: 20 })}</g>`, 0.6);
    body += at(4, 'pop', tag(150, 300, '환율', HOT, { size: 24 }), 0.2);
    body += glowRect(194, 14, 252, 52, 4, C.orange, 0.5, 26);
    put(KEY('4', '환율'), svg(id, body, css));
  })();
})(typeof window !== 'undefined' ? window : globalThis);
