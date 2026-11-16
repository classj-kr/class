// 과학 7-1 낱말 도식(Ⅱ단원 생물의 구성): 세포 구조(동물·식물 세포 견줌), 단세포·다세포생물, 구성 단계(세포→조직→기관→기관계→개체, 식물은 조직계).
// 세포 속 구조 색: 핵 C.purple, 세포막 C.orange, 세포질 옅은 C.yellow, 마이토콘드리아 C.red, 엽록체 C.green, 세포벽 C.green 굵은 테.
// 움직임은 transform·opacity·stroke-dashoffset 만 쓴다(모양·위치 속성은 CSS 로 바꾸지 않는다, 아이패드 사파리).
(function (root) {
  'use strict';
  const { C, svg, text, put } = root.FigureKit;
  const f = (n) => +(+n).toFixed(1);
  const dl = (s) => (s ? ` style="animation-delay:${s}s"` : '');
  const g = (cls, inner, s = 0) => `<g class="${cls}"${dl(s)}>${inner}</g>`;
  // 칸 n 에 나타나며 kind(pop·fin·rise·drop) 움직임을 한 번 한다
  const at = (n, kind, inner, s = 0) => `<g class="b${n}">${g(`${kind} ${kind}${n}`, inner, s)}</g>`;
  // at 과 같되 hide 칸부터 사라진다
  const atH = (n, hide, kind, inner, s = 0) => `<g class="b${n} h${hide}">${g(`${kind} ${kind}${n}`, inner, s)}</g>`;
  // 칸 n 부터 보이고, hide 칸부터 사라진다
  const shown = (n, inner, hide) => `<g class="b${n}${hide ? ' h' + hide : ''}">${inner}</g>`;
  const st = (o) => ` style="${Object.entries(o).map(([k, v]) => `${k}:${v}`).join(';')}"`;
  const seeded = (seed) => () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const rad = (a) => (a * Math.PI) / 180;
  // 글자 폭 어림(맑은 고딕 굵게: 한글 1em, 숫자·기호 .6em, 빈칸 .3em)
  const tw = (s, size) => [...String(s)].reduce((a, c) => a + (/[가-힣]/.test(c) ? 1 : c === ' ' ? 0.3 : 0.6), 0) * size;
  const HOT = [C.peach, C.orange], RED = [C.peach, C.red], COLD = [C.sky, C.blue], OK = [C.mint, C.green], GRAY = ['white', C.muted], LIL = [C.lilac, C.purple], SUN = ['#fdf3d0', C.orange];
  const tag = (cx, cy, label, [fill, stroke] = OK, { size = 20 } = {}) => {
    const w = Math.round(tw(label, size) + size * 1.3), h = Math.round(size * 1.7);
    return `<g><rect x="${f(cx - w / 2)}" y="${f(cy - h / 2)}" width="${w}" height="${h}" rx="${h / 2}" fill="${fill}" stroke="${stroke}" stroke-width="2.5"/>${text(f(cx), f(cy + size * 0.36), label, { size })}</g>`;
  };
  const lead = (x1, y1, x2, y2, color = C.muted, w = 2.5) => `<path d="M${f(x1)} ${f(y1)} L${f(x2)} ${f(y2)}" stroke="${color}" stroke-width="${w}" stroke-linecap="round"/>`;
  const head = (x, y, ang, color, w = 4) => {
    const l = 8 + w * 1.4, p = (d) => `${f(x - l * Math.cos(ang + d))} ${f(y - l * Math.sin(ang + d))}`;
    return `<path d="M${p(-0.5)} L${f(x)} ${f(y)} L${p(0.5)}" stroke="${color}" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  };
  // 곧은 화살표
  const solid = (x1, y1, x2, y2, color = C.muted, w = 4) => {
    const ang = Math.atan2(y2 - y1, x2 - x1);
    return `<path d="M${f(x1)} ${f(y1)} L${f(x2 - w * Math.cos(ang))} ${f(y2 - w * Math.sin(ang))}" stroke="${color}" stroke-width="${w}" stroke-linecap="round"/>${head(x2, y2, ang, color, w)}`;
  };
  const ring = (cx, cy, r, n, color = C.green, s = 0) => `<g class="b${n}"><circle class="ring ring${n}"${dl(s)} cx="${f(cx)}" cy="${f(cy)}" r="${r}" fill="none" stroke="${color}" stroke-width="4"/></g>`;
  const glowRect = (x, y, w, h, n, color = C.green, s = 0, rx = 14) => `<g class="b${n}"><rect class="flash flash${n}"${dl(s)} x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="${rx}" fill="none" stroke="${color}" stroke-width="5"/></g>`;
  // 칸 n 에 그어지는 선(pathLength 1)
  const drawPath = (d, n, color, w = 4, s = 0, extra = '') => `<g class="b${n}"><path class="draw draw${n}"${dl(s)} pathLength="1" d="${d}" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" fill="none"${extra}/></g>`;
  // 칸마다 바뀌는 CSS 값(vals[0] 은 첫 칸이 열리기 전 모습, null 은 그대로)
  const states = (id, cls, prop, vals, sec = 1.6, delay = 0.2) => `.sc-${id} .${cls} { ${prop}: ${vals[0]}; transition: ${prop} ${sec}s ease-in-out ${delay}s; }`
    + vals.slice(1).map((v, i) => v == null ? '' : `.on${i + 1} .sc-${id} .${cls} { ${prop}: ${v}; }`).join('');
  // 떨리는 입자: a 떨림 폭(px), d 한 번 떠는 시간(s)
  const jig = (inner, a = 2, d = 0.9, s = 0, cls = 'jg') => `<g class="${cls}"${st({ '--a': a + 'px', '--d': d + 's', 'animation-delay': f(s) + 's' })}>${inner}</g>`;
  const dot = (x, y, r, fill, stroke, sw = 2) => `<circle cx="${f(x)}" cy="${f(y)}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
  // 해(빛살이 천천히 숨 쉰다)
  const sunIcon = (x, y, r = 24) => {
    let rays = '';
    for (let k = 0; k < 8; k++) { const a = (k * Math.PI) / 4; rays += `<path d="M${f(x + (r + 6) * Math.cos(a))} ${f(y + (r + 6) * Math.sin(a))} L${f(x + (r + 15) * Math.cos(a))} ${f(y + (r + 15) * Math.sin(a))}" stroke="${C.orange}" stroke-width="4" stroke-linecap="round"/>`; }
    return `<g class="rays">${rays}</g><circle cx="${x}" cy="${y}" r="${r}" fill="${C.yellow}" stroke="${C.orange}" stroke-width="3"/>`;
  };
  // 불꽃(밑 가운데 x, by)
  const flame = (x, by, s = 1) => `<g class="flk"><path d="M${f(x)} ${f(by - 46 * s)} C${f(x + 20 * s)} ${f(by - 24 * s)} ${f(x + 18 * s)} ${f(by)} ${f(x)} ${f(by)} C${f(x - 18 * s)} ${f(by)} ${f(x - 20 * s)} ${f(by - 24 * s)} ${f(x)} ${f(by - 46 * s)} Z" fill="${C.orange}"/><path d="M${f(x)} ${f(by - 24 * s)} C${f(x + 9 * s)} ${f(by - 12 * s)} ${f(x + 8 * s)} ${f(by)} ${f(x)} ${f(by)} C${f(x - 8 * s)} ${f(by)} ${f(x - 9 * s)} ${f(by - 12 * s)} ${f(x)} ${f(by - 24 * s)} Z" fill="${C.yellow}"/></g>`;
  // 흐르는 점선(행진)
  const march = (d, color, w = 4, extra = '') => `<path class="mar" d="${d}" stroke="${color}" stroke-width="${w}" stroke-dasharray="10 14" stroke-linecap="round" fill="none"${extra}/>`;
  // 아지랑이(위로 올라가며 사라지는 물결)
  const wave = (x, y, h = 30, color = C.orange) => `<path d="M${f(x)} ${f(y)} q-7 ${f(-h / 4)} 0 ${f(-h / 2)} q7 ${f(-h / 4)} 0 ${f(-h / 2)}" stroke="${color}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`;
  const waves = (xs, y, h, color, up = 26) => xs.map((x, k) => `<g class="up"${st({ '--up': -up + 'px', 'animation-delay': f(-k * 0.8) + 's' })}>${wave(x, y, h, color)}</g>`).join('');

  const base = (id) => {
    let s = `
    .sc-${id} .pop, .sc-${id} .pulse, .sc-${id} .ring, .sc-${id} .rays { transform-box: fill-box; transform-origin: center; }
    .sc-${id} .rays { animation: ${id}-pulse 2.4s ease-in-out infinite; }
    .sc-${id} .flk { transform-box: fill-box; transform-origin: 50% 100%; animation: ${id}-flk .5s ease-in-out infinite alternate; }
    .sc-${id} .mar { animation: ${id}-mar .7s linear infinite; }
    .sc-${id} .draw { stroke-dasharray: 1; stroke-dashoffset: 1; }
    .sc-${id} .ring, .sc-${id} .cf { opacity: 0; }
    .sc-${id} .lv, .sc-${id} .shr { transform-box: fill-box; transform-origin: 50% 100%; }
    .sc-${id} .up { animation: ${id}-up 2.4s ease-out infinite; }
    .sc-${id} .bob { animation: ${id}-bob 2.6s ease-in-out infinite alternate; }
    .sc-${id} .jg { animation: ${id}-jg var(--d, .9s) linear infinite; }
    @keyframes ${id}-pop { 0% { opacity: 0; transform: scale(.3); } 70% { opacity: 1; transform: scale(1.12); } 100% { opacity: 1; transform: scale(1); } }
    @keyframes ${id}-fin { from { opacity: 0; } to { opacity: 1; } }
    @keyframes ${id}-rise { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
    @keyframes ${id}-drop { from { opacity: 0; transform: translateY(-40px); } to { opacity: 1; transform: none; } }
    @keyframes ${id}-pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.12); } }
    @keyframes ${id}-flash { 0% { opacity: 0; } 20% { opacity: 1; } 40% { opacity: .25; } 60% { opacity: 1; } 80% { opacity: .25; } 100% { opacity: 1; } }
    @keyframes ${id}-ring { 0% { opacity: .9; transform: scale(1); } 100% { opacity: 0; transform: scale(1.6); } }
    @keyframes ${id}-mar { from { stroke-dashoffset: 24; } to { stroke-dashoffset: 0; } }
    @keyframes ${id}-drawk { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
    @keyframes ${id}-mv { from { transform: translate(0, 0); } to { transform: translate(var(--tx, 0px), var(--ty, 0px)); } }
    @keyframes ${id}-fly { 0% { opacity: 0; transform: translate(var(--dx, 0px), var(--dy, 0px)); } 15% { opacity: 1; } 100% { opacity: 1; transform: translate(0, 0); } }
    @keyframes ${id}-go { 0% { opacity: 0; transform: translate(0, 0); } 15% { opacity: 1; } 85% { opacity: 1; } 100% { opacity: 0; transform: translate(var(--dx, 0px), var(--dy, 0px)); } }
    @keyframes ${id}-up { 0% { opacity: 0; transform: translateY(0); } 20%, 70% { opacity: 1; } 100% { opacity: 0; transform: translateY(var(--up, -60px)); } }
    @keyframes ${id}-bob { from { transform: translateY(-3px); } to { transform: translateY(3px); } }
    @keyframes ${id}-flk { from { transform: scale(.92, .86); } to { transform: scale(1.04, 1.06); } }
    @keyframes ${id}-lv { from { transform: scaleY(0); } to { transform: scaleY(1); } }
    @keyframes ${id}-jg { 0%, 100% { transform: translate(0, 0); } 20% { transform: translate(var(--a), calc(var(--a) * -.8)); } 45% { transform: translate(calc(var(--a) * -.6), var(--a)); } 70% { transform: translate(calc(var(--a) * -1), calc(var(--a) * -.4)); } 85% { transform: translate(calc(var(--a) * .5), calc(var(--a) * .7)); } }
    .sc-${id} .go { animation: ${id}-go var(--d, 2.2s) ease-in-out infinite; }
    `;
    for (let n = 1; n <= 5; n++) s += `
    .on${n} .sc-${id} .pop${n} { animation: ${id}-pop .5s ease-out both; }
    .on${n} .sc-${id} .fin${n} { animation: ${id}-fin .6s ease-out both; }
    .on${n} .sc-${id} .rise${n} { animation: ${id}-rise .5s ease-out both; }
    .on${n} .sc-${id} .drop${n} { animation: ${id}-drop .6s ease-out both; }
    .on${n} .sc-${id} .pulse${n} { animation: ${id}-pulse .7s ease-in-out .3s 2; }
    .on${n} .sc-${id} .flash${n} { animation: ${id}-flash 1.4s ease-in-out both; }
    .on${n} .sc-${id} .ring${n} { animation: ${id}-ring 1.1s ease-out .3s 2; }
    .on${n} .sc-${id} .draw${n} { animation: ${id}-drawk 1.2s ease-in-out .2s both; }
    .on${n} .sc-${id} .cf${n} { animation: ${id}-fin .8s ease-out 1s both; }
    .on${n} .sc-${id} .mv${n} { animation: ${id}-mv 1.4s ease-in-out .2s both; }
    .on${n} .sc-${id} .fly${n} { animation: ${id}-fly 1.1s ease-out both; }
    .on${n} .sc-${id} .lv${n} { animation: ${id}-lv 1s ease-out both; }`;
    return s;
  };

  // ════ Ⅱ단원 생물의 구성 ════
  // 매끈한 닫힌 곡선(점들을 이은 캣멀-롬 곡선)
  const smooth = (pts) => {
    const n = pts.length;
    let d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
    for (let i = 0; i < n; i++) {
      const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
      d += ` C${f(p1[0] + (p2[0] - p0[0]) / 6)} ${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)} ${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])} ${f(p2[1])}`;
    }
    return d + ' Z';
  };
  const blobD = (rx, ry, k = 1) => smooth(Array.from({ length: 14 }, (_, i) => { const a = (i / 14) * Math.PI * 2, w = 1 + 0.045 * Math.sin(3 * a + k) + 0.03 * Math.cos(5 * a); return [rx * w * Math.cos(a), ry * w * Math.sin(a)]; }));
  const zoomLines2 = ([x1, y1], r1, [x2, y2], r2) => {
    const d = Math.hypot(x2 - x1, y2 - y1), nx = -(y2 - y1) / d, ny = (x2 - x1) / d;
    return [1, -1].map((k) => `<path d="M${f(x1 + k * r1 * nx)} ${f(y1 + k * r1 * ny)} L${f(x2 + k * r2 * nx)} ${f(y2 + k * r2 * ny)}" stroke="${C.muted}" stroke-width="2.5" stroke-dasharray="7 5"/>`).join('');
  };
  const CYTO = C.yellow, CYTO_OP = 0.2;
  const nucleus = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${C.lilac}" stroke="${C.purple}" stroke-width="3"/>`
    + `<path d="M${f(x - r * 0.55)} ${f(y + r * 0.1)} q${f(r * 0.18)} ${f(-r * 0.5)} ${f(r * 0.36)} 0 t${f(r * 0.36)} 0 t${f(r * 0.36)} 0" stroke="${C.purple}" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;
  const mito = (x, y, a, s = 1) => `<g transform="rotate(${a} ${x} ${y})"><ellipse cx="${x}" cy="${y}" rx="${f(20 * s)}" ry="${f(10 * s)}" fill="${C.peach}" stroke="${C.red}" stroke-width="2.5"/><path d="M${f(x - 13 * s)} ${y} l${f(4 * s)} ${f(-6 * s)} l${f(4 * s)} ${f(12 * s)} l${f(5 * s)} ${f(-12 * s)} l${f(5 * s)} ${f(12 * s)} l${f(4 * s)} ${f(-6 * s)}" stroke="${C.red}" stroke-width="1.8" fill="none" stroke-linejoin="round"/></g>`;
  const chloro = (x, y, a, s = 1) => `<g transform="rotate(${a} ${x} ${y})"><ellipse cx="${x}" cy="${y}" rx="${f(18 * s)}" ry="${f(10 * s)}" fill="${C.green}" fill-opacity=".72" stroke="${C.green}" stroke-width="2"/><path d="M${f(x - 9 * s)} ${f(y - 3 * s)} V${f(y + 3 * s)} M${x} ${f(y - 4 * s)} V${f(y + 4 * s)} M${f(x + 9 * s)} ${f(y - 3 * s)} V${f(y + 3 * s)}" stroke="${C.mint}" stroke-width="3" stroke-linecap="round"/></g>`;
  // 꾸러미 안에 싼다(cls 가 있으면 그 이름의 <g>)
  const wrap = (cls, inner) => (cls ? `<g class="${cls}">${inner}</g>` : inner);
  // 동물 세포(0,0 가운데, 가로 반지름 118). o: 부분마다 감쌀 클래스
  const A_MITO = [[58, -42, 25], [62, 42, -30], [-70, 44, 40]];
  const cellA = (o = {}) => `<path d="${blobD(118, 92)}" fill="white"/><path d="${blobD(118, 92)}" fill="${CYTO}" fill-opacity="${CYTO_OP}"/>`
    + (o.cyto ? `<path class="${o.cyto}" d="${blobD(118, 92)}" fill="${CYTO}" fill-opacity=".75"/>` : '')
    + wrap(o.mem, `<path d="${blobD(118, 92)}" fill="none" stroke="${C.orange}" stroke-width="4"/>`)
    + A_MITO.map(([x, y, a]) => wrap(o.mito, mito(x, y, a))).join('') + wrap(o.nuc, nucleus(-18, -6, 30));
  // 식물 세포(0,0 가운데, 250×196). 세포벽(초록 굵은 테) 안쪽에 세포막
  const P_MITO = [[-84, -58, 20], [92, 62, -25]], P_CHL = [[30, -60, 10], [88, -12, 70], [54, 50, -20], [-16, 62, 15], [-86, 36, -40], [-20, -66, -10]];
  const cellP = (o = {}) => `<rect x="-125" y="-98" width="250" height="196" rx="16" fill="${C.mint}" stroke="${C.green}" stroke-width="8"/>`
    + `<rect x="-115" y="-88" width="230" height="176" rx="10" fill="white"/><rect x="-115" y="-88" width="230" height="176" rx="10" fill="${CYTO}" fill-opacity="${CYTO_OP}"/>`
    + (o.cyto ? `<rect class="${o.cyto}" x="-115" y="-88" width="230" height="176" rx="10" fill="${CYTO}" fill-opacity=".75"/>` : '')
    + wrap(o.mem, `<rect x="-115" y="-88" width="230" height="176" rx="10" fill="none" stroke="${C.orange}" stroke-width="3.5"/>`)
    + P_CHL.map(([x, y, a]) => wrap(o.chl, chloro(x, y, a))).join('') + P_MITO.map(([x, y, a]) => wrap(o.mito, mito(x, y, a))).join('') + wrap(o.nuc, nucleus(-50, -18, 28));
  const place = (x, y, s, inner) => `<g transform="translate(${x} ${y})${s !== 1 ? ` scale(${s})` : ''}">${inner}</g>`;
  const AX = 165, AY = 196, PX = 478, PY = 196;
  const twoCells = (oa, op, s = 1, ax = AX, ay = AY, px = PX, py = PY) => place(ax, ay, s, cellA(oa)) + place(px, py, s, cellP(op))
    + text(ax, f(ay + 132 * s + 8), '동물 세포', { size: 20 }) + text(px, f(py + 132 * s + 8), '식물 세포', { size: 20 });
  const cellCss = (id) => `.sc-${id} .bobm { animation: ${id}-bob 1.8s ease-in-out infinite alternate; transform-box: fill-box; }`;

  // ── 세포: 잎을 크게 보면 작은 방이 빽빽, 방 하나가 세포 ──
  (function () {
    const id = 't71-s2-sepo';
    let css = base(id) + cellCss(id);
    const leaf = `<path d="M100 330 C96 300 96 290 98 270 C40 240 30 140 100 50 C170 140 160 240 102 270" fill="${C.mint}" stroke="${C.green}" stroke-width="3.5" stroke-linejoin="round"/><path d="M100 300 V80 M100 220 L70 190 M100 180 L130 150 M100 140 L76 116" stroke="${C.green}" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;
    let body = leaf + `<circle cx="112" cy="196" r="14" fill="none" stroke="${C.muted}" stroke-width="2.5"/>`;
    // 크게 본 원: 벽돌처럼 쌓인 세포
    body += `<defs><clipPath id="${id}-c"><circle cx="300" cy="190" r="104"/></clipPath><pattern id="${id}-p" width="40" height="30" patternUnits="userSpaceOnUse" x="0" y="5"><rect x="1.5" y="1.5" width="37" height="27" rx="5" fill="${C.mint}" stroke="${C.green}" stroke-width="2.5"/><circle cx="14" cy="13" r="4.5" fill="${C.purple}" fill-opacity=".6"/></pattern></defs>`;
    body += at(1, 'fin', zoomLines2([112, 196], 14, [300, 190], 106), 0.3);
    body += at(1, 'pop', `<circle cx="300" cy="190" r="106" fill="white" stroke="${C.muted}" stroke-width="3.5"/><g clip-path="url(#${id}-c)"><rect x="190" y="80" width="230" height="230" fill="url(#${id}-p)"/></g>`, 0.6);
    // 칸 2: 한 칸이 커져 나온다
    body += glowRect(281, 186, 37, 27, 2, C.orange, 0, 5);
    body += at(2, 'fin', zoomLines2([300, 200], 18, [520, 196], 70), 0.4);
    body += at(2, 'pop', place(520, 196, 0.55, cellP({ mito: 'bobm', chl: 'bobm' })), 0.7);
    body += shown(2, `<g class="go"${st({ '--dx': '30px', '--dy': '-10px', '--d': '2.4s' })}>${dot(476, 214, 5, C.orange, 'white', 1.5)}</g><g class="go"${st({ '--dx': '-26px', '--dy': '-16px', '--d': '2.4s', 'animation-delay': '-1.2s' })}>${dot(556, 222, 5, C.orange, 'white', 1.5)}</g>`);
    // 칸 3
    body += ring(520, 196, 66, 3, C.green, 0.2) + at(3, 'pop', tag(520, 70, '세포', OK, { size: 26 }), 0.6);
    body += glowRect(281, 186, 37, 27, 3, C.green, 0.4, 5);
    put('7-1/과학/2/세포', svg(id, body, css));
  })();

  // ── 핵: 두 세포에 하나씩, 속에 유전 물질, 둘레로 조절 신호 ──
  (function () {
    const id = 't71-s2-haek';
    let css = base(id) + `.sc-${id} .nk { transform-box: fill-box; transform-origin: center; } .on1 .sc-${id} .nk { animation: ${id}-pulse .8s ease-in-out .3s 2; }`;
    let body = twoCells({ nuc: 'nk' }, { nuc: 'nk' });
    const nA = [AX - 18, AY - 6], nP = [PX - 50, PY - 18];
    body += at(1, 'pop', lead(nA[0] - 40, 64, nA[0] - 8, nA[1] - 30, C.purple) + tag(nA[0] - 40, 50, '핵', LIL, { size: 22 }), 0.4);
    body += at(1, 'pop', lead(nP[0] - 20, 64, nP[0] - 4, nP[1] - 28, C.purple) + tag(nP[0] - 20, 50, '핵', LIL, { size: 22 }), 0.6);
    // 칸 2: 유전 물질이 그어진다
    const dna = (x, y, r) => `M${f(x - r * 0.6)} ${f(y - r * 0.3)} c${f(r * 0.3)} ${f(-r * 0.5)} ${f(r * 0.5)} ${f(r * 0.7)} ${f(r * 0.8)} ${f(r * 0.2)} s${f(r * 0.3)} ${f(r * 0.6)} ${f(r * 0.5)} ${f(r * 0.5)} M${f(x - r * 0.5)} ${f(y + r * 0.35)} c${f(r * 0.3)} ${f(r * 0.3)} ${f(r * 0.6)} ${f(-r * 0.3)} ${f(r * 0.9)} 0`;
    body += drawPath(dna(nA[0], nA[1], 30), 2, C.purple, 3.5, 0.2) + drawPath(dna(nP[0], nP[1], 28), 2, C.purple, 3.5, 0.4);
    body += at(2, 'pop', lead(320, 96, nA[0] + 22, nA[1] - 6, C.purple) + lead(320, 96, nP[0] - 22, nP[1] - 8, C.purple) + tag(320, 82, '유전 물질', LIL, { size: 18 }), 1.2);
    // 칸 3: 핵에서 세포 전체로 신호(퍼지는 고리)
    [nA, nP].forEach(([x, y], k) => { for (let j = 0; j < 3; j++) body += `<g class="b3"><circle class="sig" style="animation-delay:${f(j * 0.6 + k * 0.2)}s" cx="${x}" cy="${y}" r="34" fill="none" stroke="${C.purple}" stroke-width="3" stroke-dasharray="6 6"/></g>`; });
    css += `.sc-${id} .sig { opacity: 0; transform-box: fill-box; transform-origin: center; } .on3 .sc-${id} .sig { animation: ${id}-sig 1.8s ease-out infinite; } @keyframes ${id}-sig { 0% { opacity: .9; transform: scale(1); } 100% { opacity: 0; transform: scale(2.6); } }`;
    put('7-1/과학/2/핵', svg(id, body, css));
  })();

  // ── 세포막: 세포를 감싸는 얇은 막, 필요한 물질만 드나든다 ──
  (function () {
    const id = 't71-s2-semak';
    let css = base(id);
    let body = twoCells({}, {});
    body += place(AX, AY, 1, `<path class="draw draw1" pathLength="1" d="${blobD(118, 92)}" fill="none" stroke="${C.orange}" stroke-width="8"/>`);
    body += place(PX, PY, 1, `<path class="draw draw1" style="animation-delay:.5s" pathLength="1" d="M-105 -88 H105 Q115 -88 115 -78 V78 Q115 88 105 88 H-105 Q-115 88 -115 78 V-78 Q-115 -88 -105 -88 Z" fill="none" stroke="${C.orange}" stroke-width="6"/>`);
    body += at(1, 'pop', lead(AX + 70, 70, AX + 74, AY - 82, C.orange) + tag(AX + 70, 56, '세포막', HOT, { size: 20 }), 1.2);
    body += at(1, 'pop', lead(PX + 80, 70, PX + 96, PY - 88, C.orange) + tag(PX + 80, 56, '세포막', HOT, { size: 20 }), 1.4);
    // 칸 2: 위에서 다가오는 물질 — 초록 알갱이는 들어가고, 회색 네모는 막에 막혀 되돌아간다
    css += `@keyframes ${id}-bnc { 0% { opacity: 0; transform: translate(0, 0); } 15% { opacity: 1; } 45% { transform: translate(0, var(--dy)); } 85% { opacity: 1; } 100% { opacity: 0; transform: translate(0, 0); } }
      .sc-${id} .bnc { animation: ${id}-bnc 2.4s ease-in-out infinite; }`;
    const ins = [[AX - 40, 50, 120], [AX + 10, 40, 140], [PX + 20, 36, 140]], outs = [[AX - 10, 44, 46], [PX - 30, 40, 52], [PX - 76, 46, 46]];
    let mv = '';
    ins.forEach(([x, y, dy], k) => { mv += `<g class="go"${st({ '--dx': '0px', '--dy': dy + 'px', '--d': '2.4s', 'animation-delay': f(-k * 0.8) + 's' })}>${dot(x, y, 8, C.green, 'white', 2)}</g>`; });
    outs.forEach(([x, y, dy], k) => { mv += `<g class="bnc"${st({ '--dy': dy + 'px', 'animation-delay': f(-k * 0.8 - 0.4) + 's' })}><rect x="${x - 8}" y="${y - 8}" width="16" height="16" rx="3" fill="${C.line}" stroke="${C.muted}" stroke-width="2"/></g>`; });
    body += shown(2, mv);
    // 칸 3: 안과 밖
    body += at(3, 'pop', text(AX, AY + 64, '안', { size: 22, color: C.ink }) + text(AX - 92, AY - 96, '밖', { size: 22, color: C.muted }), 0.2);
    body += place(AX, AY, 1, `<g class="b3"><path class="flash flash3" style="animation-delay:.6s" d="${blobD(118, 92)}" fill="none" stroke="${C.orange}" stroke-width="9"/></g>`);
    put('7-1/과학/2/세포막', svg(id, body, css));
  })();

  // ── 세포질: 핵을 뺀 나머지 부분, 여러 구조가 들어 있고 움직인다 ──
  (function () {
    const id = 't71-s2-sejil';
    let css = base(id) + cellCss(id) + `.sc-${id} .cy { opacity: 0; } .on1 .sc-${id} .cy { animation: ${id}-fin 1s ease-out .4s both; }
      .sc-${id} .bobm { animation-play-state: paused; } .on2 .sc-${id} .bobm { animation-play-state: running; animation-duration: 1.2s; }`;
    let body = twoCells({ cyto: 'cy', mito: 'bobm' }, { cyto: 'cy', mito: 'bobm', chl: 'bobm' });
    body += at(1, 'pop', lead(AX + 46, 74, AX + 30, AY + 30, C.orange) + tag(AX + 46, 58, '세포질', [C.yellow, C.orange], { size: 20 }), 1.2);
    body += at(1, 'pop', lead(PX + 40, 74, PX + 10, PY + 10, C.orange) + tag(PX + 40, 58, '세포질', [C.yellow, C.orange], { size: 20 }), 1.4);
    // 칸 2: 구조들이 움직이고 고리
    body += A_MITO.map(([x, y], k) => ring(AX + x, AY + y, 22, 2, C.red, 0.3 + k * 0.15)).join('') + P_CHL.slice(0, 4).map(([x, y], k) => ring(PX + x, PY + y, 20, 2, C.green, 0.4 + k * 0.15)).join('');
    // 칸 3: 핵은 빼고
    body += at(3, 'pop', lead(AX - 80, 84, AX - 34, AY - 30, C.purple) + tag(AX - 80, 70, '핵 아님', LIL, { size: 18 }), 0.3);
    body += glowRect(PX - 119, PY - 92, 238, 184, 3, C.orange, 0.6, 12);
    put('7-1/과학/2/세포질', svg(id, body, css));
  })();

  // ── 마이토콘드리아: 양분을 분해해 에너지를 만든다 ──
  (function () {
    const id = 't71-s2-mito';
    let css = base(id) + `.sc-${id} .mk { transform-box: fill-box; transform-origin: center; } .on1 .sc-${id} .mk { animation: ${id}-pulse .7s ease-in-out .5s 2; }`;
    const ax = 112, ay = 112, px = 326, py = 112, s = 0.7;
    let body = place(ax, ay, s, cellA({ mito: 'mk' })) + place(px, py, s, cellP({ mito: 'mk' }));
    body += text(ax, 212, '동물 세포', { size: 18 }) + text(px, 212, '식물 세포', { size: 18 });
    body += at(1, 'fin', lead(200, 248, ax + 62 * s, ay + 42 * s + 6, C.red) + lead(200, 248, px - 84 * s - 6, py - 58 * s + 8, C.red), 0.8) + at(1, 'pop', tag(200, 262, '마이토콘드리아', RED, { size: 20 }), 1.0);
    // 칸 2: 크게 본 마이토콘드리아에 양분이 들어가고 에너지가 나온다
    const MX = 512, MY = 150;
    body += at(2, 'fin', zoomLines2([px + 92 * s, py + 62 * s], 12, [MX, MY], 70), 0);
    body += at(2, 'pop', `<g class="bigm">${mito(MX, MY, -12, 3.6)}</g>`, 0.3);
    css += `.on2 .sc-${id} .bigm, .on3 .sc-${id} .bigm { animation: ${id}-hum 1.2s ease-in-out infinite; transform-box: fill-box; transform-origin: center; } @keyframes ${id}-hum { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }`;
    let food = '';
    for (let k = 0; k < 4; k++) food += `<g class="go"${st({ '--dx': '70px', '--dy': '-118px', '--d': '2.4s', 'animation-delay': f(-k * 0.6) + 's' })}>${dot(400, 300, 8, C.orange, 'white', 2)}</g>`;
    body += shown(2, food) + at(2, 'pop', tag(400, 330, '양분', HOT, { size: 18 }), 0.6);
    const bolt = (x, y) => `<path d="M${x} ${y} l-10 18 h10 l-8 18 l20 -24 h-10 l8 -12 z" fill="${C.yellow}" stroke="${C.orange}" stroke-width="2" stroke-linejoin="round"/>`;
    let bolts = '';
    [[560, 210, 30, 70], [586, 132, 30, -30], [470, 80, -30, -40], [560, 76, 20, -40]].forEach(([x, y, dx, dy], k) => { bolts += `<g class="go"${st({ '--dx': dx + 'px', '--dy': dy + 'px', '--d': '2s', 'animation-delay': f(-k * 0.5) + 's' })}>${bolt(x, y)}</g>`; });
    body += shown(2, bolts) + at(2, 'pop', tag(578, 316, '에너지', SUN, { size: 18 }), 1.0);
    // 칸 3
    body += ring(MX, MY, 80, 3, C.red, 0.2) + glowRect(124, 245, 152, 34, 3, C.red, 0.6, 17);
    put('7-1/과학/2/마이토콘드리아', svg(id, body, css));
  })();

  // ── 엽록체: 식물 세포에만 있는 초록 알갱이, 빛을 받아 광합성 ──
  (function () {
    const id = 't71-s2-yeoprok';
    let css = base(id) + `.sc-${id} .ck { transform-box: fill-box; transform-origin: center; } .on1 .sc-${id} .ck { animation: ${id}-pulse .7s ease-in-out .5s 2; } .on2 .sc-${id} .ck { animation: ${id}-glow 1.2s ease-in-out infinite; } @keyframes ${id}-glow { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.18); } }`;
    const s = 0.88, ax = 150, ay = 214, px = 462, py = 214;
    let body = twoCells({}, { chl: 'ck' }, s, ax, ay, px, py);
    body += atH(1, 3, 'pop', lead(px + 70, 76, px + 30 * s, py - 60 * s - 8, C.green) + tag(px + 70, 62, '초록색 알갱이', OK, { size: 18 }), 0.4);
    body += at(1, 'pop', tag(ax, 74, '없음', GRAY, { size: 18 }), 0.9) + at(1, 'fin', `<path d="M${ax - 9} 98 L${ax + 9} 116 M${ax + 9} 98 L${ax - 9} 116" stroke="${C.muted}" stroke-width="3.5" stroke-linecap="round"/>`, 1.0);
    // 칸 2: 햇빛이 비치고 알갱이 둘레에 양분이 생긴다
    body += at(2, 'pop', sunIcon(300, 56, 20), 0);
    body += shown(2, march(`M322 72 L${px - 60} ${py - 70}`, C.yellow, 5) + march(`M326 60 L${px + 10} ${py - 76}`, C.yellow, 5) + march(`M318 82 L${px - 90} ${py + 10}`, C.yellow, 5));
    body += P_CHL.map(([x, y], k) => at(2, 'pop', dot(f(px + x * s + 14), f(py + y * s - 12), 5, C.orange, 'white', 1.5), f(1 + k * 0.15))).join('');
    body += at(2, 'pop', tag(290, 124, '광합성', SUN, { size: 18 }), 1.6);
    // 칸 3
    body += P_CHL.map(([x, y], k) => ring(f(px + x * s), f(py + y * s), 18, 3, C.green, k * 0.12)).join('') + at(3, 'pop', lead(px + 70, 78, px + 30 * s, py - 60 * s - 8, C.green) + tag(px + 70, 62, '엽록체', OK, { size: 22 }), 0.6);
    put('7-1/과학/2/엽록체', svg(id, body, css));
  })();

  // ── 단세포생물: 세포 하나가 먹고 움직이고 둘로 나뉜다(짚신벌레) ──
  const zipD = (cx, cy, s) => smooth([[-100, 0], [-84, -34], [-30, -46], [30, -44], [84, -30], [100, 0], [84, 30], [30, 42], [0, 26], [-30, 44], [-84, 34]].map(([x, y]) => [cx + x * s, cy + y * s]));
  const zip = (cx, cy, s = 1) => {
    let cil = '';
    for (let k = 0; k < 22; k++) { const a = (k / 22) * Math.PI * 2, x = cx + 104 * s * Math.cos(a), y = cy + 46 * s * Math.sin(a); cil += `M${f(x)} ${f(y)} l${f(9 * s * Math.cos(a))} ${f(9 * s * Math.sin(a))} `; }
    return `<path class="cil" d="${cil}" stroke="${C.muted}" stroke-width="2" stroke-linecap="round"/><path d="${zipD(cx, cy, s)}" fill="${C.sky}" stroke="${C.blue}" stroke-width="3"/>`
      + `<ellipse cx="${f(cx + 6 * s)}" cy="${f(cy - 6 * s)}" rx="${f(26 * s)}" ry="${f(15 * s)}" fill="${C.lilac}" stroke="${C.purple}" stroke-width="2.5"/>`
      + `<circle cx="${f(cx - 50 * s)}" cy="${f(cy + 6 * s)}" r="${f(7 * s)}" fill="white" stroke="${C.blue}" stroke-width="2"/><circle cx="${f(cx + 56 * s)}" cy="${f(cy + 4 * s)}" r="${f(7 * s)}" fill="white" stroke="${C.blue}" stroke-width="2"/>`;
  };
  (function () {
    const id = 't71-s2-danse';
    let css = base(id) + `.sc-${id} .swim { animation: ${id}-swim 4s ease-in-out infinite alternate; } @keyframes ${id}-swim { from { transform: translateX(-30px); } to { transform: translateX(30px); } }
      .sc-${id} .cil { animation: ${id}-cil .4s linear infinite; stroke-dasharray: 4 3; } @keyframes ${id}-cil { from { stroke-dashoffset: 7; } to { stroke-dashoffset: 0; } }`;
    let body = `<g class="b1 h3"><g class="swim">${zip(320, 180)}</g></g>`;
    body += atH(1, 3, 'pop', tag(320, 70, '짚신벌레', COLD, { size: 20 }), 0.3) + atH(1, 3, 'pop', tag(320, 300, '세포 1개', GRAY, { size: 20 }), 0.7);
    // 칸 2: 먹이가 몸속으로
    let food = '';
    [[150, 110, 150, 80], [170, 280, 140, -86], [500, 300, -170, -100]].forEach(([x, y, dx, dy], k) => { food += `<g class="go"${st({ '--dx': dx + 'px', '--dy': dy + 'px', '--d': '2.6s', 'animation-delay': f(-k * 0.85) + 's' })}>${dot(x, y, 7, C.green, 'white', 2)}</g>`; });
    body += `<g class="b2 h3">${food}</g>` + atH(2, 3, 'pop', tag(110, 200, '먹이', OK, { size: 18 }), 0.4);
    // 칸 3: 둘로 나뉜다
    body += `<g class="b3"><g class="mv mv3"${st({ '--tx': '-110px', '--ty': '0px' })}>${g('swim', zip(320, 180, 0.72))}</g></g>`;
    body += `<g class="b3"><g class="mv mv3"${st({ '--tx': '110px', '--ty': '0px' })}>${g('swim', zip(320, 180, 0.72))}</g></g>`;
    body += at(3, 'pop', tag(320, 310, '단세포생물', COLD, { size: 24 }), 1.4);
    put('7-1/과학/2/단세포생물', svg(id, body, css));
  })();

  // ── 다세포생물: 몸이 많은 세포로, 세포마다 맡은 일이 다르다 ──
  (function () {
    const id = 't71-s2-dase';
    let css = base(id);
    const fishD = 'M60 190 C110 110 250 96 330 150 C352 165 362 180 362 190 C362 200 352 215 330 230 C250 284 110 270 60 190 Z';
    let body = `<defs><pattern id="${id}-p" width="22" height="22" patternUnits="userSpaceOnUse"><rect x="1.5" y="1.5" width="19" height="19" rx="7" fill="${C.peach}" stroke="${C.orange}" stroke-width="1.6"/><circle cx="11" cy="11" r="3" fill="${C.purple}" fill-opacity=".55"/></pattern></defs>`;
    body += `<path d="M66 190 L18 136 L28 190 L18 244 Z" fill="${C.peach}" stroke="${C.orange}" stroke-width="3" stroke-linejoin="round"/>`;
    body += `<path d="${fishD}" fill="white" stroke="${C.orange}" stroke-width="3.5"/><g class="b1"><path class="fin fin1" style="animation-delay:.4s" d="${fishD}" fill="url(#${id}-p)" stroke="${C.orange}" stroke-width="3.5"/></g>`;
    body += `<circle cx="318" cy="176" r="9" fill="white" stroke="${C.ink}" stroke-width="3"/><circle cx="320" cy="176" r="4" fill="${C.ink}"/>`;
    body += at(1, 'pop', tag(200, 316, '세포가 아주 많음', GRAY, { size: 18 }), 1.0);
    // 칸 2: 세 가지 세포
    const box = (y, inner, name, color) => `<rect x="430" y="${y - 44}" width="190" height="88" rx="14" fill="white" stroke="${color}" stroke-width="3"/>${inner}${text(560, y + 7, name, { size: 18 })}`;
    let skin = '';
    for (let k = 0; k < 4; k++) skin += `<rect x="${448 + k * 16}" y="56" width="15" height="12" rx="2" fill="${C.peach}" stroke="${C.orange}" stroke-width="1.8"/>`;
    skin += `<path d="M448 68 H512" stroke="${C.orange}" stroke-width="1"/>`;
    const musc = [0, 1, 2].map((k) => `<path d="M446 ${172 + k * 14} Q480 ${164 + k * 14} 514 ${172 + k * 14} Q480 ${180 + k * 14} 446 ${172 + k * 14} Z" fill="${C.peach}" stroke="${C.red}" stroke-width="2"/>`).join('');
    const nerve = `<circle cx="470" cy="290" r="11" fill="${C.lilac}" stroke="${C.purple}" stroke-width="2.5"/><path d="M462 282 L448 270 M478 282 L488 268 M462 298 L450 310 M481 290 H516 M512 290 l6 -6 M512 290 l6 6" stroke="${C.purple}" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;
    body += at(2, 'fly', box(66, skin, '상피세포', C.orange), 0.1) + at(2, 'fly', box(180, musc, '근육세포', C.red), 0.5) + at(2, 'fly', box(294, nerve, '신경세포', C.purple), 0.9);
    body += at(2, 'fin', lead(230, 116, 430, 66, C.orange) + lead(240, 196, 430, 180, C.red) + lead(300, 200, 430, 294, C.purple), 1.4);
    css += `.sc-${id} .fly2 { --dx: -120px; }`;
    // 칸 3
    body += ring(200, 190, 120, 3, C.orange, 0.2) + at(3, 'pop', tag(200, 316, '다세포생물', HOT, { size: 24 }), 0.6);
    put('7-1/과학/2/다세포생물', svg(id, body, css));
  })();

  // ════ 생물의 구성 단계: 위 머리말 여섯 칸(세포·조직·조직계·기관·기관계·개체), 윗줄 동물, 아랫줄 식물 ════
  // 미래엔 44~45쪽: 동물 상피세포 → 상피 조직 → 위 → 소화계 → 개체, 식물 잎살세포 → 울타리 조직 → 기본 조직계 → 잎 → 개체
  const LV = ['세포', '조직', '조직계', '기관', '기관계', '개체'];
  const LX = (c) => 5 + c * 106, BW = 100, BH = 116, ROWY = [44, 196];
  const ICON = {
    a0: () => `<circle cx="0" cy="0" r="26" fill="${C.peach}" stroke="${C.orange}" stroke-width="3"/><circle cx="-4" cy="-3" r="9" fill="${C.lilac}" stroke="${C.purple}" stroke-width="2"/>`,
    a1: () => { let s = ''; for (let j = 0; j < 3; j++) for (let i = 0; i < 3; i++) s += `<rect x="${-36 + i * 24}" y="${-34 + j * 22}" width="23" height="21" rx="5" fill="${C.peach}" stroke="${C.orange}" stroke-width="2"/><circle cx="${-24.5 + i * 24}" cy="${-23.5 + j * 22}" r="3.5" fill="${C.purple}" fill-opacity=".7"/>`; return s; },
    a3: () => `<path d="M-18 -36 C-14 -26 -8 -20 0 -18 C26 -16 40 2 32 20 C24 36 -6 40 -24 28 C-30 24 -34 18 -36 12 L-26 8 C-22 16 -14 20 -6 18 C6 14 4 2 -4 -2 C-14 -6 -24 -16 -28 -32 Z" fill="${C.peach}" stroke="${C.orange}" stroke-width="3" stroke-linejoin="round"/>`,
    a4: () => `<path d="M-4 -40 V-22 C-4 -14 2 -12 8 -14" stroke="${C.orange}" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M6 -18 C20 -24 32 -14 28 -4 C24 6 10 6 2 2 Z" fill="${C.peach}" stroke="${C.orange}" stroke-width="2.5" stroke-linejoin="round"/><path d="M0 4 C-24 6 -24 14 -2 14 H14 C24 14 24 22 14 22 H-14 C-24 22 -24 30 -14 30 H12" stroke="${C.orange}" stroke-width="4.5" fill="none" stroke-linecap="round"/><path d="M-30 36 V0 C-30 -10 -26 -12 -18 -12" stroke="${C.red}" stroke-width="3" fill="none" stroke-linecap="round" opacity=".7"/>`,
    a5: () => `<circle cx="0" cy="-27" r="11" fill="white" stroke="${C.ink}" stroke-width="3"/><path d="M-16 -12 Q0 -18 16 -12 L20 22 H10 L8 40 H-8 L-10 22 H-20 Z" fill="white" stroke="${C.ink}" stroke-width="3" stroke-linejoin="round"/><path d="M-2 -12 V0 C6 2 8 10 2 12 C-6 14 -6 22 2 24" stroke="${C.orange}" stroke-width="3" fill="none" stroke-linecap="round"/>`,
    p0: () => `<rect x="-26" y="-22" width="52" height="44" rx="6" fill="${C.mint}" stroke="${C.green}" stroke-width="4"/><circle cx="-10" cy="-5" r="7" fill="${C.lilac}" stroke="${C.purple}" stroke-width="2"/><ellipse cx="10" cy="-8" rx="6" ry="3.5" fill="${C.green}"/><ellipse cx="8" cy="10" rx="6" ry="3.5" fill="${C.green}"/>`,
    p1: () => { let s = ''; for (let i = 0; i < 5; i++) s += `<rect x="${-38 + i * 15.5}" y="-32" width="14" height="60" rx="5" fill="${C.mint}" stroke="${C.green}" stroke-width="2"/><ellipse cx="${-31 + i * 15.5}" cy="${-12 + (i % 2) * 18}" rx="3.5" ry="5" fill="${C.green}"/>`; return s; },
    p2: () => { let s = `<rect x="-42" y="-34" width="84" height="66" rx="4" fill="white" stroke="${C.green}" stroke-width="2"/><rect x="-42" y="-34" width="84" height="8" fill="${C.sky}" stroke="${C.blue}" stroke-width="1.5"/><rect x="-42" y="24" width="84" height="8" fill="${C.sky}" stroke="${C.blue}" stroke-width="1.5"/>`;
      s += `<rect x="-42" y="-26" width="84" height="50" fill="${C.mint}"/>`; for (let i = 0; i < 6; i++) s += `<rect x="${-40 + i * 13.6}" y="-24" width="12" height="24" rx="4" fill="white" stroke="${C.green}" stroke-width="1.8"/>`;
      for (let i = 0; i < 5; i++) s += `<circle cx="${-32 + i * 16}" cy="${12 + (i % 2) * 4}" r="6" fill="white" stroke="${C.green}" stroke-width="1.8"/>`; return s; },
    p3: () => `<path d="M-36 30 C-40 -6 -10 -38 34 -36 C36 6 8 34 -36 30 Z" fill="${C.mint}" stroke="${C.green}" stroke-width="3" stroke-linejoin="round"/><path d="M-40 36 L-36 30 C-16 10 6 -10 30 -32 M-18 12 L-14 -10 M0 -2 L4 -20 M-14 14 L8 12 M2 0 L22 -2" stroke="${C.green}" stroke-width="2.2" fill="none" stroke-linecap="round"/>`,
    p5: () => `<path d="M0 34 V-18" stroke="${C.green}" stroke-width="4"/><path d="M0 8 C-24 8 -30 -6 -28 -10 C-12 -12 -2 -2 0 6 M0 -4 C20 -6 28 -18 26 -22 C10 -24 2 -14 0 -6" fill="${C.mint}" stroke="${C.green}" stroke-width="2.5"/><circle cx="0" cy="-26" r="9" fill="${C.peach}" stroke="${C.orange}" stroke-width="2.5"/><circle cx="0" cy="-26" r="3.5" fill="${C.yellow}"/><path d="M0 34 L-12 42 M0 34 L12 42 M0 34 V44 M-30 34 H30" stroke="${C.muted}" stroke-width="2.5" stroke-linecap="round"/>`
  };
  const NAME = { a0: '상피세포', a1: '상피 조직', a3: '위', a4: '소화계', a5: '사람', p0: '잎살세포', p1: '울타리 조직', p2: '기본 조직계', p3: '잎', p5: '식물' };
  const HAS = [[0, 1, 3, 4, 5], [0, 1, 2, 3, 5]];
  const box = (r, c) => `<rect x="${LX(c)}" y="${ROWY[r]}" width="${BW}" height="${BH}" rx="12" fill="white" stroke="${C.line}" stroke-width="2.5"/>`;
  const emptyBox = (r, c) => `<rect x="${LX(c) + 4}" y="${ROWY[r] + 4}" width="${BW - 8}" height="${BH - 8}" rx="10" fill="none" stroke="${C.line}" stroke-width="2.5" stroke-dasharray="7 6"/>`;
  const iconAt = (r, c) => { const k = (r ? 'p' : 'a') + c; return `<g transform="translate(${LX(c) + BW / 2} ${ROWY[r] + 46})">${ICON[k]()}</g>` + text(LX(c) + BW / 2, ROWY[r] + 104, NAME[k], { size: 18 }); };
  // 한 줄의 화살표(빈칸은 건너뛴다)
  const rowArrows = (r) => { const h = HAS[r]; let s = ''; for (let i = 0; i < h.length - 1; i++) { const x1 = LX(h[i]) + BW + 1, x2 = LX(h[i + 1]) - 1, y = ROWY[r] + BH / 2; s += x2 - x1 > 20 ? solid(x1, y, x2, y, C.muted, 3) : `<path d="M${x1 + 2} ${y - 5} L${x2 - 2} ${y} L${x1 + 2} ${y + 5}" stroke="${C.muted}" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`; } return s; };
  // cur: 이 낱말의 칸, rows: 다룰 줄
  const levels = (id, cur, rows, opts = {}) => {
    let body = '';
    LV.forEach((t, c) => { body += text(LX(c) + BW / 2, 28, t, { size: 20, color: C.muted }); });
    body += `<g class="b3">${g('fin fin3', text(LX(cur) + BW / 2, 28, LV[cur], { size: 20, color: C.green }), 0.3)}</g>`;
    [0, 1].forEach((r) => {
      const on = rows.includes(r);
      let row = rowArrows(r);
      LV.forEach((t, c) => {
        if (!HAS[r].includes(c)) { row += emptyBox(r, c); return; }
        row += box(r, c);
        if (c < cur) row += at(1, 'fin', iconAt(r, c), f(0.2 + c * 0.3));
        else if (c === cur) row += `<g class="b2"><g class="fly fly2"${st({ '--dx': (c ? -106 * (HAS[r].includes(c - 1) ? 1 : 2) : 0) + 'px', '--dy': '0px', 'animation-delay': f(0.3 + r * 0.4) + 's' })}>${iconAt(r, c)}</g></g>`;
        else if (opts.all) row += at(2, 'fin', iconAt(r, c), 1.2);
      });
      body += on ? row : `<g opacity=".35">${row}</g>`;
    });
    return body;
  };

  // ── 조직 ──
  (function () {
    const id = 't71-s2-jojik';
    let css = base(id);
    let body = levels(id, 1, [0, 1]);
    body += glowRect(LX(1) - 4, ROWY[0] - 4, BW + 8, BH + 8, 3, C.green, 0.4) + glowRect(LX(1) - 4, ROWY[1] - 4, BW + 8, BH + 8, 3, C.green, 0.6);
    body += at(3, 'pop', tag(LX(1) + BW / 2, 342, '조직', OK, { size: 22 }), 0.9);
    put('7-1/과학/2/조직', svg(id, body, css));
  })();

  // ── 조직계: 식물에만 ──
  (function () {
    const id = 't71-s2-jojikgye';
    let css = base(id);
    let body = levels(id, 2, [1]);
    body += glowRect(LX(2) - 4, ROWY[1] - 4, BW + 8, BH + 8, 3, C.green, 0.4);
    body += at(3, 'pop', tag(LX(2) + BW / 2, ROWY[0] + BH / 2, '없음', GRAY, { size: 20 }), 0.8);
    body += at(3, 'pop', tag(LX(2) + BW / 2, 342, '조직계', OK, { size: 22 }), 1.1);
    put('7-1/과학/2/조직계', svg(id, body, css));
  })();

  // ── 기관 ──
  (function () {
    const id = 't71-s2-gigwan';
    let css = base(id);
    let body = levels(id, 3, [0, 1]);
    body += glowRect(LX(3) - 4, ROWY[0] - 4, BW + 8, BH + 8, 3, C.green, 0.4) + glowRect(LX(3) - 4, ROWY[1] - 4, BW + 8, BH + 8, 3, C.green, 0.6);
    body += at(3, 'pop', tag(LX(3) + BW / 2, 342, '기관', OK, { size: 22 }), 0.9);
    put('7-1/과학/2/기관', svg(id, body, css));
  })();

  // ── 기관계: 동물에만 ──
  (function () {
    const id = 't71-s2-gigwangye';
    let css = base(id);
    let body = levels(id, 4, [0]);
    body += glowRect(LX(4) - 4, ROWY[0] - 4, BW + 8, BH + 8, 3, C.green, 0.4);
    body += at(3, 'pop', tag(LX(4) + BW / 2, ROWY[1] + BH / 2, '없음', GRAY, { size: 20 }), 0.8);
    body += at(3, 'pop', tag(LX(4) + BW / 2, 342, '기관계', OK, { size: 22 }), 1.1);
    put('7-1/과학/2/기관계', svg(id, body, css));
  })();

  // ── 개체 ──
  (function () {
    const id = 't71-s2-gaeche';
    let css = base(id);
    let body = levels(id, 5, [0, 1]);
    body += glowRect(LX(5) - 4, ROWY[0] - 4, BW + 8, BH + 8, 3, C.green, 0.4) + glowRect(LX(5) - 4, ROWY[1] - 4, BW + 8, BH + 8, 3, C.green, 0.6);
    body += at(3, 'pop', tag(LX(5) + BW / 2, 342, '개체', OK, { size: 22 }), 0.9);
    put('7-1/과학/2/개체', svg(id, body, css));
  })();
})(typeof window !== 'undefined' ? window : globalThis);
