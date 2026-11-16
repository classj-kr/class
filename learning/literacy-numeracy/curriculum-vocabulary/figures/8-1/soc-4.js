// 사회 8-1 5·6단원(국제 사회와 한반도, 사회 변동과 사회 문제) 낱말 도식.
// '가 나라' 같은 나라 이름·인구 수치는 모두 예시다(실제 나라·통계가 아님). 실제 나라 이름은 상임 이사국 다섯뿐.
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
    .sc-${id} .feed, .sc-${id} .fly { opacity: 0; }
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
    @keyframes ${id}-fly { from { opacity: 0; transform: translate(var(--fx), var(--fy)); } to { opacity: 1; transform: none; } }
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
    .on${n} .sc-${id} .fly${n} { animation-name: ${id}-fly; animation-duration: 1s; animation-timing-function: ease-out; animation-fill-mode: both; }
    .on${n} .sc-${id} .draw${n} { stroke-dashoffset: 0; }
    .on${n} .sc-${id} .growy${n}, .on${n} .sc-${id} .growd${n} { transform: none; }
    .on${n} .sc-${id} .dim${n} { opacity: .28; }`;
    for (let n = 2; n <= 5; n++) s += `
    .on${n} .sc-${id} .mv { transform: translate(var(--x${n}), var(--y${n})); }
    .on${n} .sc-${id} .sl, .on${n} .sc-${id} .sx { transform: scaleX(var(--s${n})); }`;
    return s;
  };

  // 칸 n 에 바깥에서 날아 들어오는 것
  const fly = (n, dx, dy, inner, delay = 0) => `<g class="b${n}"><g class="fly fly${n}" style="--fx:${dx}px;--fy:${dy}px;animation-delay:${delay}s">${inner}</g></g>`;
  // 나라 건물(창문 두 줄과 깃발): 밑 가운데 (x, y)
  const govt = (x, y, w = 110, h = 70, col = C.blue, fill = C.sky) => `<rect x="${x - w / 2}" y="${y - h}" width="${w}" height="${h}" fill="white" stroke="${col}" stroke-width="3"/>` +
    [0, 1].map((r) => [0, 1, 2].map((c) => `<rect x="${f(x - w / 2 + w * 0.12 + c * w * 0.27)}" y="${f(y - h + h * 0.17 + r * h * 0.36)}" width="${f(w * 0.2)}" height="${f(h * 0.18)}" fill="${fill}"/>`).join('')).join('') +
    `<path d="M${x} ${y - h} V${y - h - 22}" stroke="${C.ink}" stroke-width="2.5"/><path d="M${x} ${y - h - 22} H${x + 18} V${y - h - 12} H${x} Z" fill="${col}"/>`;
  const factory = (x, y, col = C.muted) => `<path d="M${x - 40} ${y} V${y - 34} L${x - 20} ${y - 48} V${y - 34} L${x} ${y - 48} V${y - 34} L${x + 20} ${y - 48} V${y} Z" fill="white" stroke="${col}" stroke-width="3" stroke-linejoin="round"/><rect x="${x + 22}" y="${y - 70}" width="14" height="70" fill="white" stroke="${col}" stroke-width="3"/>` +
    `<rect x="${x - 30}" y="${y - 22}" width="14" height="12" fill="${C.sky}"/><rect x="${x - 8}" y="${y - 22}" width="14" height="12" fill="${C.sky}"/>`;
  const office = (x, y, col = C.purple) => `<rect x="${x - 26}" y="${y - 90}" width="52" height="90" fill="white" stroke="${col}" stroke-width="3"/>` +
    [0, 1, 2, 3].map((r) => [0, 1].map((c) => `<rect x="${x - 17 + c * 20}" y="${y - 80 + r * 20}" width="14" height="12" fill="${C.lilac}"/>`).join('')).join('');
  const shop = (x, y, col = C.orange) => `<rect x="${x - 36}" y="${y - 44}" width="72" height="44" fill="white" stroke="${col}" stroke-width="3"/><path d="M${x - 44} ${y - 44} L${x - 36} ${y - 64} H${x + 36} L${x + 44} ${y - 44} Z" fill="${C.peach}" stroke="${col}" stroke-width="3" stroke-linejoin="round"/><rect x="${x - 10}" y="${y - 28}" width="20" height="28" fill="${C.peach}"/>`;
  const crate = (x, y) => `<rect x="${x - 13}" y="${y - 13}" width="26" height="26" rx="3" fill="${C.peach}" stroke="${C.orange}" stroke-width="2.5"/><path d="M${x - 13} ${y} H${x + 13}" stroke="${C.orange}" stroke-width="2"/>`;
  const tie = (x, y, s = 1) => `<path d="M${f(x)} ${f(y - 17 * s)} L${f(x - 2.4 * s)} ${f(y - 9 * s)} L${f(x)} ${f(y - 5 * s)} L${f(x + 2.4 * s)} ${f(y - 9 * s)} Z" fill="${C.red}"/>`;
  const flag = (x, y, col) => `<path d="M${x} ${y} V${y - 44}" stroke="${C.ink}" stroke-width="3"/><path d="M${x} ${y - 44} H${x + 30} V${y - 26} H${x} Z" fill="${col}"/>`;
  const shieldI = (x, y, s = 1, [fill, stroke] = OK) => `<path d="M${x} ${f(y - 26 * s)} L${f(x + 22 * s)} ${f(y - 18 * s)} V${f(y)} Q${f(x + 22 * s)} ${f(y + 18 * s)} ${x} ${f(y + 28 * s)} Q${f(x - 22 * s)} ${f(y + 18 * s)} ${f(x - 22 * s)} ${f(y)} V${f(y - 18 * s)} Z" fill="${fill}" stroke="${stroke}" stroke-width="3" stroke-linejoin="round"/>`;
  const bolt = (a, b, color = C.red) => {
    const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, ang = Math.atan2(b[1] - a[1], b[0] - a[0]), nx = -Math.sin(ang) * 12, ny = Math.cos(ang) * 12;
    return `<path d="M${f(a[0])} ${f(a[1])} L${f(mx + nx)} ${f(my + ny)} L${f(mx - nx)} ${f(my - ny)} L${f(b[0] - 6 * Math.cos(ang))} ${f(b[1] - 6 * Math.sin(ang))}" stroke="${color}" stroke-width="5" fill="none" stroke-linejoin="round" stroke-linecap="round"/>` + head(b[0], b[1], ang, color, 5);
  };
  const star = (x, y, r = 18, fill = C.yellow, stroke = C.orange) => {
    const p = [];
    for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.45 : r; p.push(`${f(x + rr * Math.cos(a))} ${f(y + rr * Math.sin(a))}`); }
    return `<path d="M${p.join(' L')} Z" fill="${fill}" stroke="${stroke}" stroke-width="2.5" stroke-linejoin="round"/>`;
  };
  const paper = (x, y, label = '', s = 1) => `<rect x="${f(x - 30 * s)}" y="${f(y - 38 * s)}" width="${f(60 * s)}" height="${f(76 * s)}" rx="4" fill="white" stroke="${C.ink}" stroke-width="2.5"/>` +
    (label ? text(x, f(y - 8 * s), label, { size: 18 }) : '') + `<path d="M${f(x - 18 * s)} ${f(y + 8 * s)} H${f(x + 18 * s)} M${f(x - 18 * s)} ${f(y + 20 * s)} H${f(x + 10 * s)}" stroke="${C.muted}" stroke-width="2.5" stroke-linecap="round"/>`;
  const stamp = (x, y, col = C.red, r = 13) => `<circle cx="${x}" cy="${y}" r="${r}" fill="white" stroke="${col}" stroke-width="3"/><circle cx="${x}" cy="${y}" r="${r - 5}" fill="${col}" opacity=".35"/>`;
  const warhead = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-34 -11 H16 Q38 -11 46 0 Q38 11 16 11 H-34 Z" fill="${C.line}" stroke="${C.ink}" stroke-width="2.5" stroke-linejoin="round"/><path d="M-34 -11 L-46 -24 V-11 Z M-34 11 L-46 24 V11 Z" fill="${C.muted}" stroke="${C.ink}" stroke-width="2"/><circle cx="2" cy="0" r="13" fill="${C.yellow}" stroke="${C.orange}" stroke-width="2"/>${s >= 1 ? text(2, 6.5, '핵', { size: 18, color: C.ink }) : ''}</g>`;

  // ════ 5 국제 사회와 한반도 ════

  // ── 행위 주체: 국제 사회 무대 위 다섯 갈래 ──
  const ACT = ['국가', '정부 간 국제기구', '국제 비정부 기구', '다국적 기업', '개인'];
  const actIcon = (k, x, y) => [
    () => govt(x, y + 22, 50, 32),
    () => `<ellipse cx="${x}" cy="${y + 6}" rx="26" ry="10" fill="${C.lilac}" stroke="${C.purple}" stroke-width="2.5"/>` + [-18, 0, 18].map((d) => `<circle cx="${x + d}" cy="${y - 12}" r="6" fill="${C.blue}"/>`).join(''),
    () => [-14, 0, 14].map((d, i) => person(x + d, y + 22 - (i === 1 ? 6 : 0), [C.green, C.orange, C.purple][i], 0.75)).join(''),
    () => factory(x - 6, y + 22),
    () => person(x, y + 20, C.purple, 1.1) + star(x + 18, y - 12, 9),
  ][k]();
  // 위 띠: 다섯 갈래 이름표, 맡은 것만 주황
  const actRow = (focus) => {
    const X = [44, 163, 333, 482, 581];
    return ACT.map((w, i) => (i === focus ? at(1, 'pop', tag(X[i], 28, w, HOT, { size: 18 }), 0.1) : tag(X[i], 28, w, PLAIN, { size: 18 }))).join('');
  };
  (function () {
    const id = 't81-so5-juche';
    const css = base(id);
    let body = '';
    const CX = 320, CY = 165;
    body += at(1, 'pop', `<circle cx="${CX}" cy="${CY}" r="62" fill="${C.mint}" stroke="${C.green}" stroke-width="3"/>`, 0) + shown(1, text(CX, CY - 4, '국제', { size: 20, color: C.green }) + text(CX, CY + 22, '사회', { size: 20, color: C.green }), 4);
    const N = [[120, 86, 1], [520, 86, 2], [110, 246, 2], [530, 246, 3], [320, 270, 3]];
    N.forEach(([x, y, n], k) => {
      const d = 0.2 + (k === 2 ? 0.3 : k === 4 ? 0.3 : 0);
      const ang = Math.atan2(y - CY, x - CX), sx = CX + 64 * Math.cos(ang), sy = CY + 64 * Math.sin(ang), ex = x - 38 * Math.cos(ang), ey = y - 38 * Math.sin(ang);
      body += shown(n, drawn(n, `M${f(sx)} ${f(sy)} L${f(ex)} ${f(ey)}`, C.muted, 3));
      body += at(n, 'pop', `<circle cx="${x}" cy="${y}" r="36" fill="white" stroke="${C.muted}" stroke-width="2.5"/><g transform="translate(${x} ${y}) scale(.78) translate(${-x} ${-y})">${actIcon(k, x, y)}</g>`, d);
      body += at(n, 'pop', tag(x, y + 58, ACT[k], PLAIN, { size: 18 }), d + 0.3);
      body += ring(x, y, 38, 4, C.orange, 0.2 + k * 0.15);
    });
    body += at(4, 'pop', tag(CX, CY + 2, '행위 주체', HOT, { size: 22 }), 0.4);
    put(KEY('5', '행위 주체'), svg(id, body, css));
  })();

  // ── 주권 국가: 국민·영역·주권, 바깥 간섭을 막는다 ──
  (function () {
    const id = 't81-so5-jugwon';
    const css = base(id);
    let body = actRow(0);
    body += at(1, 'fin', `<ellipse cx="230" cy="228" rx="165" ry="98" fill="${C.mint}" stroke="${C.green}" stroke-width="3" stroke-dasharray="12 7"/>`, 0.2);
    body += at(1, 'pop', [170, 210, 250].map((x, i) => person(x, 286, [C.green, C.blue, C.orange][i], 1.25)).join(''), 0.5);
    body += at(1, 'pop', flag(306, 232, C.green), 0.8);
    body += at(2, 'pop', tag(210, 316, '국민', OK, { size: 18 }), 0.1);
    body += at(2, 'pop', tag(104, 160, '영역', OK, { size: 18 }), 0.4);
    body += at(2, 'pop', tag(340, 166, '주권', OK, { size: 18 }), 0.7);
    body += at(3, 'rise', govt(560, 320, 100, 60, C.purple, C.lilac) + text(560, 226, '다른 나라', { size: 18, color: C.purple }), 0);
    body += shown(3, g('fin fin3', bolt([505, 250], [412, 236]), 0.4));
    body += at(3, 'pop', tag(466, 196, '간섭', ['white', C.red], { size: 18 }), 0.6);
    body += at(3, 'pop', shieldI(392, 236, 1.1), 0.9) + at(3, 'pop', cross(430, 286, 11), 1.2);
    body += at(4, 'pop', tag(230, 96, '주권 국가', HOT, { size: 22 }), 0.2);
    put(KEY('5', '주권 국가'), svg(id, body, css));
  })();

  // ── 정부 간 국제기구: 여러 나라 정부가 대표를 보낸다 ──
  (function () {
    const id = 't81-so5-jeongbugan';
    const css = base(id);
    let body = actRow(1);
    body += at(1, 'pop', `<ellipse cx="320" cy="122" rx="122" ry="36" fill="${C.lilac}" stroke="${C.purple}" stroke-width="3"/>` + text(320, 129, '국제기구', { size: 20, color: C.purple }), 0.2);
    const G = [[130, '가 나라', C.blue, C.sky], [320, '나 나라', C.green, C.mint], [510, '다 나라', C.orange, C.peach]];
    const SEAT = [[230, 196], [320, 202], [410, 196]];
    G.forEach(([x, name, col, fill], i) => {
      body += at(1, 'rise', govt(x, 330, 96, 50, col, fill) + text(x, 354, name, { size: 18, color: col }), 0.4 + i * 0.2);
      const p = person(x, 250, col, 1.15) + tie(x, 250, 1.15);
      body += `<g class="b1">${mover([[0, 0], [SEAT[i][0] - x, SEAT[i][1] - 250]], g('pop pop1', p, 0.9 + i * 0.2), i * 0.2)}</g>`;
    });
    body += at(3, 'pop', tag(540, 116, '국제 연합', OLD, { size: 20 }), 0.3);
    body += shown(3, g('fin fin3', arr(484, 116, 446, 118, C.purple, 3), 0.6));
    body += glowRect(194, 82, 252, 80, 3, C.purple, 0.9, 40);
    body += at(4, 'pop', tag(320, 232, '정부 간 국제기구', HOT, { size: 22 }), 0.2);
    put(KEY('5', '정부 간 국제기구'), svg(id, body, css));
  })();

  // ── 국제 비정부 기구: 여러 나라 시민이 국경을 넘어 모인다 ──
  (function () {
    const id = 't81-so5-ngo';
    const css = base(id);
    let body = actRow(2);
    body += at(1, 'fin', `<path d="M213 64 V300 M427 64 V300" stroke="${C.muted}" stroke-width="3" stroke-dasharray="10 8"/>` + ['가 나라', '나 나라', '다 나라'].map((n, i) => text(106 + i * 214, 82, n, { size: 18, color: C.muted })).join(''), 0);
    body += at(2, 'fin', `<circle cx="320" cy="196" r="72" fill="${C.mint}" fill-opacity=".7" stroke="${C.green}" stroke-width="3"/>` + text(320, 114, '비정부 기구', { size: 18, color: C.green }), 0.6);
    const FROM = [[70, 290], [140, 290], [280, 290], [360, 290], [500, 290], [570, 290]];
    const TO = [[285, 206], [320, 206], [355, 206], [285, 250], [320, 250], [355, 250]];
    const COL = [C.blue, C.blue, C.green, C.green, C.orange, C.orange];
    FROM.forEach(([x, y], i) => { body += at(1, 'pop', mover([[0, 0], [TO[i][0] - x, TO[i][1] - y]], person(x, y, COL[i], 0.9), i * 0.08), 0.2 + i * 0.1); });
    body += at(3, 'pop', govt(560, 236, 84, 52) + text(560, 256, '정부', { size: 18, color: C.blue }), 0.1) + at(3, 'pop', cross(606, 170, 12), 0.4);
    ['인권', '보건', '환경'].forEach((w, i) => { body += at(3, 'pop', `<g class="bob" style="animation-delay:${i * 0.3}s">${tag(140 + i * 180, 338, w, OK, { size: 18 })}</g>`, 0.6 + i * 0.25); });
    body += at(4, 'pop', tag(320, 290, '국제 비정부 기구', HOT, { size: 20 }), 0.2);
    put(KEY('5', '국제 비정부 기구'), svg(id, body, css));
  })();

  // ── 다국적 기업: 본사는 가 나라, 공장은 나 나라, 가게는 다 나라 ──
  (function () {
    const id = 't81-so5-dagukjeok';
    const css = base(id);
    let body = actRow(3);
    const R = [[116, '가 나라'], [320, '나 나라'], [524, '다 나라']];
    R.forEach(([x, n], i) => { body += at(1, 'fin', `<rect x="${x - 96}" y="64" width="192" height="236" rx="12" fill="white" stroke="${C.muted}" stroke-width="2.5" stroke-dasharray="10 7"/>` + text(x, 90, n, { size: 18, color: C.muted }), i * 0.15); });
    body += at(1, 'rise', office(116, 262) + text(116, 288, '본사', { size: 18, color: C.purple }), 0.5);
    body += shown(2, g('fin fin2', flow([[146, 190], [268, 222]], C.purple, { w: 4 }), 0.1));
    body += at(2, 'rise', factory(316, 262, C.purple) + text(320, 288, '공장', { size: 18, color: C.purple }), 0.6);
    body += at(3, 'rise', shop(524, 262) + text(524, 288, '가게', { size: 18, color: C.orange }), 0);
    body += shown(3, g('fin fin3', flow([[360, 236], [474, 236]], C.orange, { w: 4 }), 0.3));
    body += `<g class="b3">${mover([[0, 0], [0, 0], [100, 0]], crate(356, 212), 0.5)}</g>`;
    body += at(3, 'pop', person(590, 262, C.green, 1.1), 1.4);
    body += at(4, 'pop', tag(320, 334, '다국적 기업', HOT, { size: 22 }), 0.2);
    body += glowRect(22, 66, 596, 232, 4, C.orange, 0.5, 12);
    put(KEY('5', '다국적 기업'), svg(id, body, css));
  })();

  // ── 국제 연합: 1945년, 193개 나라, 총회·안전 보장 이사회 ──
  (function () {
    const id = 't81-so5-un';
    const css = base(id);
    let body = '';
    const GX = 170, GY = 184, GR = 112;
    body += at(1, 'fin', `<circle cx="${GX}" cy="${GY}" r="${GR}" fill="${C.sky}" stroke="${C.blue}" stroke-width="3"/>` +
      `<ellipse cx="${GX}" cy="${GY}" rx="${GR * 0.45}" ry="${GR}" fill="none" stroke="white" stroke-width="2.5"/><path d="M${GX} ${GY - GR} V${GY + GR} M${GX - GR} ${GY} H${GX + GR}" stroke="white" stroke-width="2.5"/>` +
      [-0.55, 0.55].map((t) => { const y = GY + GR * t, hw = GR * Math.sqrt(1 - t * t); return `<path d="M${f(GX - hw)} ${f(y)} H${f(GX + hw)}" stroke="white" stroke-width="2.5"/>`; }).join(''), 0);
    // 나라 점: 1칸에 몇 개, 2칸에 가득
    const dots = [];
    for (let i = 0; i < 24; i++) { const a = i * Math.PI / 12, r = i % 2 ? 58 : 88; dots.push([GX + r * Math.cos(a), GY + r * Math.sin(a)]); }
    dots.forEach(([x, y], i) => {
      const n = i % 3 === 0 ? 1 : 2, dx = (x - GX) * 1.2, dy = (y - GY) * 1.2;
      body += fly(n, f(dx), f(dy), `<circle cx="${f(x)}" cy="${f(y)}" r="9" fill="${[C.orange, C.green, C.purple][i % 3]}" stroke="white" stroke-width="2"/>`, 0.2 + (i % 8) * 0.12);
    });
    body += at(1, 'pop', tag(470, 78, '1945년', PLAIN, { size: 20 }), 0.6);
    body += at(2, 'pop', tag(470, 130, '회원국 193', HOT, { size: 20 }), 0.8);
    body += shown(3, drawn(3, `M${GX + GR} ${GY + 12} H340 V226 H372 M340 226 V296 H352`, C.muted, 3));
    body += at(3, 'pop', box(450, 226, 150, 46, '총회', OLD, 20), 0.6) + at(3, 'pop', box(470, 296, 230, 46, '안전 보장 이사회', COLD, 20), 0.9);
    body += at(4, 'pop', tag(GX, 330, '국제 연합', HOT, { size: 22 }), 0.2);
    body += ring(GX, GY, GR, 4, C.orange, 0.3);
    put(KEY('5', '국제 연합'), svg(id, body, css));
  })();

  // ── 안전 보장 이사회·상임 이사국: 15개 자리(상임 5, 비상임 10) ──
  const P5 = ['미국', '영국', '프랑스', '러시아', '중국'];
  const seat = (x, y, r, [fill, stroke]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="3"/>` + person(x, y + r * 0.62, stroke, r / 24);
  const councilFig = (word, id) => {
    const sc = word === '안전 보장 이사회';
    const css = base(id) + `
      .sc-${id} .hop { animation: ${id}-hop 5s steps(1, end) infinite .4s; }
      @keyframes ${id}-hop { 0% { transform: translateX(0); } 20% { transform: translateX(100px); } 40% { transform: translateX(200px); } 60% { transform: translateX(300px); } 80% { transform: translateX(400px); } }`;
    let body = '';
    const PY = 112, NY = 236;
    body += at(1, 'fin', `<rect x="14" y="64" width="612" height="236" rx="14" fill="white" stroke="${C.muted}" stroke-width="2.5" stroke-dasharray="10 7"/>`, 0);
    body += sc ? at(1, 'pop', tag(320, 64, '국제 연합', PLAIN, { size: 18 }), 0.2) : at(1, 'pop', tag(320, 64, '안전 보장 이사회', COLD, { size: 18 }), 0.2);
    const GRAY = ['white', C.muted];
    const n2 = 2;
    P5.forEach((name, i) => {
      const x = 120 + i * 100;
      body += at(1, 'pop', seat(x, PY, 24, GRAY), 0.3 + i * 0.08);
      body += at(n2, 'pop', seat(x, PY, 24, HOT), 0.2 + i * 0.15);
      body += at(n2, 'pop', text(x, PY + 50, name, { size: 18, color: C.orange }), 0.5 + i * 0.15);
    });
    for (let i = 0; i < 10; i++) {
      const x = 125 + i * 50;
      body += at(1, 'pop', seat(x, NY, 18, GRAY), 0.6 + i * 0.05);
      if (sc) body += at(n2, 'pop', seat(x, NY, 18, COLD), 0.9 + i * 0.08);
    }
    body += at(n2, 'pop', tag(52, PY, '상임', HOT, { size: 18 }), 0.1);
    if (sc) {
      body += at(n2, 'pop', tag(52, NY, '비상임', COLD, { size: 18 }), 0.8) + at(n2, 'pop', tag(350, 280, '임기 2년', COLD, { size: 18 }), 1.6);
      body += at(1, 'pop', shieldI(592, 150, 0.95, OK) + text(592, 156, '평화', { size: 18, color: C.green }), 1.0);
      // 3칸: 결정하면 모든 회원국이 따른다
      body += at(3, 'drop', paper(80, 324, '', 0.55) + stamp(92, 334, C.red, 9), 0.1);
      body += shown(3, g('fin fin3', flow([[112, 330], [196, 330]], C.blue, { w: 4 }), 0.4));
      for (let i = 0; i < 14; i++) body += at(3, 'pop', `<circle cx="${220 + i * 28}" cy="330" r="9" fill="${[C.orange, C.green, C.purple, C.blue][i % 4]}"/>`, 0.6 + i * 0.05);
      body += at(4, 'pop', tag(320, 197, '안전 보장 이사회', HOT, { size: 22 }), 0.2);
      body += glowRect(22, 84, 596, 210, 4, C.orange, 0.5, 14);
    } else {
      // 3칸: 비상임은 찬성, 상임 가운데 한 나라라도 반대하면 막힌다
      for (let i = 0; i < 10; i++) body += at(3, 'pop', `<circle cx="${125 + i * 50}" cy="${NY - 34}" r="11" fill="white" stroke="${C.green}" stroke-width="2"/>` + check(125 + i * 50, NY - 33, 0.5), 0.1 + i * 0.06);
      body += `<g class="b3 h4"><g class="hop">${cross(120, PY, 13)}</g></g>`;
      body += at(3, 'drop', paper(80, 324, '', 0.55), 0.8) + at(3, 'pop', cross(104, 330, 10), 1.3);
      body += at(3, 'pop', tag(200, 330, '결정 막힘', ['white', C.red], { size: 18 }), 1.5);
      body += at(4, 'pop', tag(486, 330, '거부권', HOT, { size: 20 }), 0.5);
      body += at(4, 'pop', tag(350, 330, '상임 이사국', HOT, { size: 22 }), 0.2);
      body += glowRect(88, 80, 464, 96, 4, C.orange, 0.4, 14);
    }
    put(KEY('5', word), svg(id, body, css));
  };
  councilFig('안전 보장 이사회', 't81-so5-anbori');
  councilFig('상임 이사국', 't81-so5-sangim');

  // ── 국제법: 조약(글로 맺은 약속)과 관습(오래 지켜 온 규칙) ──
  (function () {
    const id = 't81-so5-gukjebeop';
    const css = base(id);
    let body = '';
    body += at(1, 'rise', govt(110, 330, 110, 66) + text(110, 354, '가 나라', { size: 18, color: C.blue }), 0);
    body += at(1, 'rise', govt(530, 330, 110, 66, C.orange, C.peach) + text(530, 354, '나 나라', { size: 18, color: C.orange }), 0.2);
    body += shown(1, g('pop pop1', qmark(320, 200, 26), 0.6), 2);
    // 2칸: 조약
    body += at(2, 'drop', paper(320, 140, '조약', 1.2), 0.1);
    body += at(2, 'pop', stamp(298, 186, C.blue) + stamp(342, 186, C.orange), 0.7);
    body += shown(2, g('fin fin2', flow([[170, 230], [270, 170]], C.blue, { w: 4 }) + flow([[470, 230], [370, 170]], C.orange, { w: 4 }), 0.3));
    // 3칸: 관습 — 오랫동안 되풀이되어 규칙이 된다
    body += shown(3, drawn(3, 'M200 296 H440', C.muted, 3));
    body += shown(3, g('fin fin3', head(446, 296, 0, C.muted, 3), 1.4));
    for (let i = 0; i < 5; i++) body += at(3, 'pop', `<circle cx="${214 + i * 52}" cy="296" r="13" fill="white" stroke="${C.green}" stroke-width="2.5"/>` + check(214 + i * 52, 297, 0.5), 0.2 + i * 0.25);
    body += at(3, 'pop', tag(320, 260, '관습', OK, { size: 20 }), 1.5);
    body += at(4, 'pop', tag(320, 40, '국제법', HOT, { size: 24 }), 0.2);
    body += glowRect(276, 84, 88, 116, 4, C.orange, 0.4, 8) + glowRect(192, 238, 266, 76, 4, C.orange, 0.7, 14);
    put(KEY('5', '국제법'), svg(id, body, css));
  })();

  // ── 힘의 논리: 결정이 힘센 나라 쪽으로 끌려간다 ──
  (function () {
    const id = 't81-so5-him';
    const css = base(id);
    let body = '';
    body += at(1, 'rise', govt(130, 320, 170, 110) + text(130, 346, '가 나라', { size: 18, color: C.blue }), 0);
    body += at(1, 'rise', govt(520, 320, 72, 44, C.orange, C.peach) + text(520, 346, '나 나라', { size: 18, color: C.orange }), 0.3);
    body += at(1, 'pop', tag(130, 160, '힘이 셈', COLD, { size: 18 }), 0.7) + at(1, 'pop', tag(520, 226, '힘이 약함', HOT, { size: 18 }), 0.9);
    // 결정: 2칸에 가운데, 3칸에 가 나라 쪽으로
    body += `<g class="b2">${mover([[0, 0], [0, 0], [-90, -36]], g('pop pop2', paper(330, 240, '', 0.8) + text(330, 196, '결정', { size: 20 }), 0.1), 0.2)}</g>`;
    body += shown(2, g('fin fin2', arr(222, 252, 296, 252, C.blue, 9) + arr(462, 252, 366, 252, C.orange, 3), 0.5), 3);
    body += at(3, 'pop', `<circle cx="292" cy="180" r="16" fill="white" stroke="${C.blue}" stroke-width="3"/>` + check(292, 181, 0.6, C.blue), 1.2);
    body += at(3, 'pop', cross(450, 190, 11), 1.2);
    body += at(4, 'pop', tag(420, 90, '힘의 논리', HOT, { size: 24 }), 0.2);
    put(KEY('5', '힘의 논리'), svg(id, body, css));
  })();

  // ── 국제 분쟁: 영토·자원·종교·민족을 두고 두 나라가 맞선다 ──
  (function () {
    const id = 't81-so5-bunjaeng';
    const css = base(id) + `
      .on3 .sc-${id} .shake { animation: ${id}-shake .5s ease-in-out infinite; }
      @keyframes ${id}-shake { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(4px); } }`;
    let body = '';
    body += at(1, 'fin', `<path d="M320 70 V350" stroke="${C.muted}" stroke-width="3" stroke-dasharray="10 8"/>`, 0);
    body += at(1, 'rise', `<g class="shake">${govt(120, 330, 120, 74)}</g>` + text(120, 354, '가 나라', { size: 18, color: C.blue }), 0.2);
    body += at(1, 'rise', `<g class="shake" style="animation-delay:-.25s">${govt(520, 330, 120, 74, C.orange, C.peach)}</g>` + text(520, 354, '나 나라', { size: 18, color: C.orange }), 0.4);
    ['영토', '자원', '종교', '민족'].forEach((w, i) => { body += at(2, 'pop', `<g class="bob" style="animation-delay:${i * 0.25}s">${tag(320, 100 + i * 48, w, PLAIN, { size: 18 })}</g>`, 0.2 + i * 0.25); });
    body += shown(3, g('fin fin3', bolt([190, 280], [290, 280], C.blue) + bolt([450, 280], [350, 280], C.orange), 0.1));
    body += at(3, 'pop', `<g class="bob">${star(320, 282, 22, C.yellow, C.red)}</g>`, 0.6);
    body += at(4, 'pop', tag(320, 40, '국제 분쟁', HOT, { size: 24 }), 0.2);
    put(KEY('5', '국제 분쟁'), svg(id, body, css));
  })();

  // ── 영토 분쟁·영유권: 바다 가운데 섬 ──
  const seaBase = () => `<rect x="0" y="0" width="640" height="360" fill="${C.sky}"/>`;
  const island = (x, y) => `<path d="M${x - 58} ${y + 8} Q${x - 52} ${y - 20} ${x - 18} ${y - 26} Q${x + 6} ${y - 44} ${x + 32} ${y - 24} Q${x + 60} ${y - 14} ${x + 56} ${y + 10} Q${x + 30} ${y + 30} ${x - 8} ${y + 26} Q${x - 46} ${y + 30} ${x - 58} ${y + 8} Z" fill="${C.mint}" stroke="${C.green}" stroke-width="3"/>`;
  (function () {
    const id = 't81-so5-yeongto';
    const css = base(id);
    let body = seaBase();
    body += at(1, 'fin', `<rect x="0" y="0" width="140" height="360" fill="${C.mint}"/><path d="M140 0 V360" stroke="${C.green}" stroke-width="3"/><rect x="500" y="0" width="140" height="360" fill="${C.peach}"/><path d="M500 0 V360" stroke="${C.orange}" stroke-width="3"/>` +
      text(70, 190, '가 나라', { size: 20, color: C.green }) + text(570, 190, '나 나라', { size: 20, color: C.orange }), 0);
    body += at(1, 'pop', island(320, 220), 0.5);
    body += shown(2, g('fin fin2', flow([[150, 200], [254, 208]], C.green, { w: 5 }), 0.1) + g('fin fin2', flow([[490, 200], [386, 208]], C.orange, { w: 5 }), 0.6));
    body += at(2, 'drop', flag(300, 206, C.green), 0.4) + at(2, 'drop', flag(334, 206, C.orange), 0.9);
    body += at(2, 'pop', tag(200, 160, '우리 땅', OK, { size: 18 }), 0.5) + at(2, 'pop', tag(440, 160, '우리 땅', HOT, { size: 18 }), 1.0);
    body += at(3, 'pop', `<g class="bob">${star(320, 110, 24, C.yellow, C.red)}</g>`, 0.2);
    body += shown(3, g('fin fin3', bolt([250, 120], [292, 116], C.green) + bolt([390, 120], [348, 116], C.orange), 0.4));
    body += at(4, 'pop', tag(320, 300, '영토 분쟁', HOT, { size: 24 }), 0.2);
    put(KEY('5', '영토 분쟁'), svg(id, body, css));
  })();
  (function () {
    const id = 't81-so5-yeongyu';
    const css = base(id);
    let body = seaBase();
    body += at(1, 'pop', island(320, 236), 0.2);
    body += at(2, 'fin', `<ellipse cx="320" cy="236" rx="170" ry="72" fill="none" stroke="${C.blue}" stroke-width="3" stroke-dasharray="10 8"/>`, 0.1);
    body += shown(2, drawn(2, 'M150 236 Q150 60 320 60 Q490 60 490 236', C.purple, 3));
    body += at(2, 'pop', tag(320, 246, '영토', OK, { size: 18 }), 0.5) + at(2, 'pop', tag(540, 300, '영해', COLD, { size: 18 }), 0.8) + at(2, 'pop', tag(320, 92, '영공', OLD, { size: 18 }), 1.1);
    body += at(3, 'drop', flag(318, 212, C.green), 0.1);
    body += at(3, 'pop', person(272, 232, C.green, 0.9) + person(370, 232, C.green, 0.9), 0.5);
    body += at(3, 'pop', tag(100, 140, '가 나라', OK, { size: 20 }), 0.8) + shown(3, g('fin fin3', arr(150, 158, 296, 198, C.green, 4), 1.0));
    body += at(4, 'pop', tag(320, 30, '영유권', HOT, { size: 24 }), 0.2);
    body += ring(320, 236, 64, 4, C.orange, 0.4);
    put(KEY('5', '영유권'), svg(id, body, css));
  })();

  // ── 비핵화: 만들지 않고, 갖지 않고, 있던 것도 없앤다 ──
  (function () {
    const id = 't81-so5-bihaek';
    const css = base(id) + `
      .sc-${id} .gone { transition: opacity .5s ease; }
      .on3 .sc-${id} .gone { opacity: 0; }`;
    let body = '';
    const X = [150, 270, 390, 510];
    X.forEach((x, i) => {
      body += `<g class="gone" style="transition-delay:${0.3 + i * 0.4}s">${at(1, 'pop', warhead(x, 150, 1.1), 0.1 + i * 0.15)}</g>`;
      body += ring(x + 2, 150, 30, 1, C.red, 0.6 + i * 0.1);
      body += at(3, 'pop', cross(x + 2, 150, 12), 0.5 + i * 0.4);
    });
    body += at(2, 'rise', factory(150, 320, C.ink), 0.1) + at(2, 'pop', cross(200, 268, 12), 0.5) + at(2, 'pop', tag(150, 344, '만들지 않음', ['white', C.red], { size: 18 }), 0.7);
    body += at(2, 'pop', warhead(460, 290, 0.7) + cross(500, 268, 12), 0.9) + at(2, 'pop', tag(460, 330, '갖지 않음', ['white', C.red], { size: 18 }), 1.1);
    body += at(3, 'pop', tag(330, 216, '0개', HOT, { size: 22 }), 2.0);
    body += at(4, 'pop', tag(320, 40, '비핵화', HOT, { size: 24 }), 0.2);
    put(KEY('5', '비핵화'), svg(id, body, css));
  })();

  // ════ 6 사회 변동과 사회 문제 ════

  // 나이별 인구(5세씩 18칸, 예시 수치 — 가장 넓은 칸을 100으로)
  const AGE_PAST = [100, 95, 90, 85, 78, 70, 62, 55, 48, 41, 34, 28, 22, 16, 11, 7, 4, 2];
  const AGE_MID = [48, 52, 58, 66, 78, 74, 68, 60, 52, 44, 36, 29, 23, 17, 12, 8, 5, 3];
  const AGE_LATE = [34, 37, 41, 45, 50, 56, 62, 68, 74, 79, 82, 82, 78, 70, 58, 44, 30, 18];
  const BAND = (i) => (i < 3 ? C.blue : i < 13 ? C.green : C.orange);
  const RY = (i) => 330 - (i + 1) * 15;
  const ageAxis = () => `<path d="M118 60 V330 H526" stroke="${C.ink}" stroke-width="2.5" fill="none"/>` +
    [[0, '0세'], [3, '15세'], [13, '65세'], [18, '90세']].map(([i, l]) => text(110, 330 - i * 15 + 6, l, { size: 18, color: C.muted, anchor: 'end' })).join('') +
    [3, 13].map((i) => `<path d="M118 ${330 - i * 15} H526" stroke="${C.muted}" stroke-width="2" stroke-dasharray="6 5"/>`).join('');
  (function () {
    const id = 't81-so6-jeochulsan';
    const css = base(id);
    let body = ageAxis();
    body += at(1, 'pop', tag(60, 30, '가 나라', PLAIN, { size: 18 }), 0);
    AGE_PAST.forEach((v, i) => {
      body += scaler('sx', [v / 100, AGE_MID[i] / 100, AGE_LATE[i] / 100], `<rect x="122" y="${RY(i) + 1}" width="400" height="13" fill="${BAND(i)}" opacity=".7"/>`, (i < 6 ? 0 : i > 11 ? 0.2 : 0.1));
    });
    body += at(2, 'pop', tag(586, 300, '아이 ↓', COLD, { size: 18 }), 1.0);
    body += at(3, 'pop', tag(586, 100, '노인 ↑', HOT, { size: 18 }), 1.0);
    body += at(4, 'pop', tag(320, 30, '저출산·고령화', HOT, { size: 22 }), 0.2);
    body += glowRect(120, 280, 410, 52, 4, C.blue, 0.4, 8) + glowRect(120, 56, 410, 96, 4, C.orange, 0.8, 8);
    put(KEY('6', '저출산·고령화'), svg(id, body, css));
  })();
  (function () {
    const id = 't81-so6-saengsan';
    const css = base(id) + `
      .sc-${id} .gx { transform-box: fill-box; transform-origin: 50% 50%; transform: scaleX(0); transition: transform .9s ease-out; }
      .on1 .sc-${id} .gx { transform: none; }`;
    let body = ageAxis();
    body += at(1, 'pop', tag(60, 30, '가 나라', PLAIN, { size: 18 }), 0);
    AGE_MID.forEach((v, i) => {
      const w = 4 * v, x = 322 - w / 2, y = RY(i) + 1;
      body += `<rect class="gx" style="transition-delay:${0.1 + i * 0.05}s" x="${f(x)}" y="${y}" width="${f(w)}" height="13" fill="${C.line}"/>`;
      if (i >= 3 && i < 13) body += shown(2, `<rect x="${f(x)}" y="${y}" width="${f(w)}" height="13" fill="${C.green}" opacity=".75"/>`);
      else body += shown(3, `<rect x="${f(x)}" y="${y}" width="${f(w)}" height="13" fill="${BAND(i)}" opacity=".6"/>`);
    });
    body += shown(2, drawn(2, 'M528 136 H540 V284 H528', C.green, 4));
    body += at(2, 'pop', tag(584, 210, '15~64세', OK, { size: 18 }), 0.8);
    body += shown(3, g('fin fin3', arr(556, 186, 556, 112, C.green, 4) + arr(556, 236, 556, 302, C.green, 4), 0.2));
    body += at(3, 'pop', tag(588, 92, '노인', HOT, { size: 18 }), 0.7) + at(3, 'pop', tag(588, 322, '아이', COLD, { size: 18 }), 0.9);
    body += at(4, 'pop', tag(320, 30, '생산 가능 인구', HOT, { size: 22 }), 0.2);
    body += glowRect(130, 132, 384, 156, 4, C.orange, 0.4, 8);
    put(KEY('6', '생산 가능 인구'), svg(id, body, css));
  })();
})(typeof window !== 'undefined' ? window : globalThis);
