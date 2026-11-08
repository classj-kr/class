// 과학 5-1 2단원 「빛의 성질」 낱말 도식: 빛이 곧게 나아가고, 거울에 부딪쳐 방향이 바뀌고, 경계에서 꺾이는 모습을 코드로 그린다.
// 빛줄기는 노란 선(주황 테두리), 공기는 바탕 그대로, 물은 C.sky, 유리·렌즈는 C.mint 면으로 칠한다.
// 꺾이는 각도는 실제 값에 맞춘다(공기→물 1.33, 공기→유리 1.5). 렌즈는 얇은 렌즈로 보아 가운데 줄에서 꺾는다.
// 움직임은 transform·opacity·stroke-dashoffset 만 쓴다(빛줄기는 pathLength 1 로 그어진다).
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
  // 글자 폭 어림(맑은 고딕 굵게: 한글 1em, 숫자·기호 .6em, 빈칸 .3em)
  const tw = (s, size) => [...String(s)].reduce((a, c) => a + (/[가-힣]/.test(c) ? 1 : c === ' ' ? 0.3 : 0.6), 0) * size;
  const OK = [C.mint, C.green], COLD = [C.sky, C.blue], KEY = [C.peach, C.orange], LIL = [C.lilac, C.purple];
  const tag = (cx, cy, label, [fill, stroke] = OK, { size = 20 } = {}) => {
    const w = Math.round(tw(label, size) + size * 1.3), h = Math.round(size * 1.7);
    return `<g><rect x="${f(cx - w / 2)}" y="${f(cy - h / 2)}" width="${w}" height="${h}" rx="${h / 2}" fill="${fill}" stroke="${stroke}" stroke-width="2.5"/>${text(f(cx), f(cy + size * 0.36), label, { size })}</g>`;
  };
  const lead = (x1, y1, x2, y2, color = C.muted) => `<path d="M${f(x1)} ${f(y1)} L${f(x2)} ${f(y2)}" stroke="${color}" stroke-width="2.5" stroke-linecap="round"/>`;
  const rad = (a) => (a * Math.PI) / 180;
  const deg = (a) => (a * 180) / Math.PI;
  const ring = (cx, cy, r, n, color = C.orange, s = 0) => `<g class="b${n}"><circle class="ring ring${n}"${dl(s)} cx="${f(cx)}" cy="${f(cy)}" r="${r}" fill="none" stroke="${color}" stroke-width="4"/></g>`;
  const pathD = (pts) => 'M' + pts.map(([x, y]) => `${f(x)} ${f(y)}`).join(' L');
  // (x, y) 에서 ang 쪽으로 d 만큼 간 점
  const go = ([x, y], ang, d) => [x + d * Math.cos(ang), y + d * Math.sin(ang)];
  // 위에서 내려오는 빛의 방향: 수직(아래)에서 오른쪽으로 a 도 기운 쪽
  const down = (a) => Math.PI / 2 - rad(a);
  // 굴절각(공기 → 굴절률 n)
  const refr = (a, n) => deg(Math.asin(Math.sin(rad(a)) / n));

  // 빛줄기: 칸 n 에 s 초 뒤부터 처음 점에서 끝 점으로 그어진다. 다 그어지면 끝에 화살촉, 흰 점선이 흐른다.
  const beam = (pts, n, s = 0, { hide = 0, arrow = true, dur = 1.2 } = {}) => {
    const d = pathD(pts), sty = ` style="animation-delay:${s}s;animation-duration:${dur}s"`;
    const [a, b] = pts.slice(-2), ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
    const tip = go(b, ang, 9), l = go(go(b, ang, -9), ang + Math.PI / 2, 9), r = go(go(b, ang, -9), ang - Math.PI / 2, 9);
    const arrowHead = arrow ? `<path d="${pathD([tip, l, r])}Z" fill="${C.yellow}" stroke="${C.orange}" stroke-width="2.5" stroke-linejoin="round"/>` : '';
    return `<g class="b${n}${hide ? ' h' + hide : ''}">`
      + `<path class="draw draw${n}"${sty} pathLength="1" d="${d}" stroke="${C.orange}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`
      + `<path class="draw draw${n}"${sty} pathLength="1" d="${d}" stroke="${C.yellow}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`
      + g(`fin fin${n}`, `<path class="mar" d="${d}" stroke="white" stroke-width="2" stroke-dasharray="6 18" stroke-linecap="round" fill="none"/>${arrowHead}`, f(s + dur * 0.9))
      + `</g>`;
  };
  // 레이저 지시기: 앞 끝 (x, y), ang 쪽으로 빛을 쏜다
  const laser = ([x, y], ang, len = 62) => `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(deg(ang))})"><rect x="${-len}" y="-12" width="${len - 6}" height="24" rx="7" fill="white" stroke="${C.ink}" stroke-width="2.5"/><rect x="-8" y="-7" width="8" height="14" rx="2" fill="${C.muted}"/><circle cx="${f(-len + 18)}" cy="0" r="4.5" fill="${C.red}"/></g>`;
  // 세 줄기 레이저 상자: 오른쪽 끝 x, 가운데 yc, 줄 간격 h
  const laser3 = (x, yc, h) => `<g><rect x="${x - 46}" y="${f(yc - h - 20)}" width="44" height="${f(2 * h + 40)}" rx="9" fill="white" stroke="${C.ink}" stroke-width="2.5"/>${[-h, 0, h].map((d) => `<rect x="${x - 6}" y="${f(yc + d - 6)}" width="7" height="12" rx="2" fill="${C.muted}"/>`).join('')}<circle cx="${x - 30}" cy="${f(yc - h - 4)}" r="4.5" fill="${C.red}"/></g>`;
  // 직각 표시: 꼭짓점 (x, y), 두 변이 (dx, 0) 과 (0, dy) 쪽
  const square = (x, y, dx, dy, color = C.red) => `<path d="M${f(x + dx)} ${f(y)} V${f(y + dy)} H${f(x)}" stroke="${color}" stroke-width="3.5" fill="none" stroke-linejoin="round"/>`;
  // 위가 뾰족한 별(모양 종이)
  const star = (cx, cy, R) => {
    let d = '';
    for (let k = 0; k < 10; k++) { const a = -Math.PI / 2 + (k * Math.PI) / 5, r = k % 2 ? R * 0.45 : R; d += `${k ? 'L' : 'M'}${f(cx + r * Math.cos(a))} ${f(cy + r * Math.sin(a))}`; }
    return d + 'Z';
  };
  // 무당벌레(렌즈로 들여다볼 물체)
  const bug = (cx, cy, r) => `<g><circle cx="${f(cx)}" cy="${f(cy - r * 0.92)}" r="${f(r * 0.46)}" fill="${C.ink}"/><circle cx="${f(cx)}" cy="${f(cy)}" r="${r}" fill="${C.red}" stroke="${C.ink}" stroke-width="2"/><path d="M${f(cx)} ${f(cy - r)} V${f(cy + r)}" stroke="${C.ink}" stroke-width="2"/>`
    + [[-0.48, -0.32], [0.48, -0.32], [-0.52, 0.38], [0.52, 0.38]].map(([dx, dy]) => `<circle cx="${f(cx + dx * r)}" cy="${f(cy + dy * r)}" r="${f(r * 0.17)}" fill="${C.ink}"/>`).join('') + `</g>`;
  // 손잡이 렌즈(앞모습): 렌즈 안은 inner 를 zoom 움직임으로 키우거나 줄인다
  const magnifier = (id, cx, cy, R, inner, zoomCls) => {
    const h1 = go([cx, cy], rad(135), R + 3), h2 = go([cx, cy], rad(135), R + 48);
    return `<defs><clipPath id="${id}-lens"><circle cx="${cx}" cy="${cy}" r="${R}"/></clipPath></defs>`
      + `<path d="${pathD([h1, h2])}" stroke="${C.muted}" stroke-width="15" stroke-linecap="round"/>`
      + `<circle cx="${cx}" cy="${cy}" r="${R}" fill="${C.paper}"/>`
      + `<g clip-path="url(#${id}-lens)"><g class="${zoomCls}">${inner}</g></g>`
      + `<circle cx="${cx}" cy="${cy}" r="${R}" fill="${C.sky}" fill-opacity=".3" stroke="${C.muted}" stroke-width="7"/>`
      + `<path d="M${f(cx - R * 0.62)} ${f(cy - R * 0.28)} A${f(R * 0.68)} ${f(R * 0.68)} 0 0 1 ${f(cx - R * 0.2)} ${f(cy - R * 0.64)}" stroke="white" stroke-width="5" fill="none" stroke-linecap="round"/>`;
  };
  // 렌즈 단면: 가운데 x, yc, 반높이 H, 가장자리 반두께 e, 가운데 반두께 m (m > e 볼록, m < e 오목)
  const lensShape = (x, yc, H, e, m) => {
    const q = 2 * (m - e);  // 이차 곡선 조절점은 불룩한 만큼의 두 배
    return `<path d="M${f(x - e)} ${f(yc - H)} Q${f(x - e - q)} ${f(yc)} ${f(x - e)} ${f(yc + H)} L${f(x + e)} ${f(yc + H)} Q${f(x + e + q)} ${f(yc)} ${f(x + e)} ${f(yc - H)} Z" fill="${C.mint}" fill-opacity=".6" stroke="${C.green}" stroke-width="3" stroke-linejoin="round"/>`;
  };
  // 두께 눈금(양 끝에 짧은 가로막대)
  const gauge = (x1, x2, y, color = C.red) => `<path d="M${f(x1)} ${f(y)} H${f(x2)} M${f(x1)} ${f(y - 7)} V${f(y + 7)} M${f(x2)} ${f(y - 7)} V${f(y + 7)}" stroke="${color}" stroke-width="3.5" stroke-linecap="round"/>`;

  // 장면마다 같이 쓰는 움직임
  const base = (id) => {
    let s = `
    .sc-${id} .pop, .sc-${id} .pulse, .sc-${id} .ring { transform-box: fill-box; transform-origin: center; }
    .sc-${id} .mar { animation: ${id}-mar .7s linear infinite; }
    .sc-${id} .draw { stroke-dasharray: 1; stroke-dashoffset: 1; }
    .sc-${id} .ring { opacity: 0; }
    @keyframes ${id}-pop { 0% { opacity: 0; transform: scale(.3); } 70% { opacity: 1; transform: scale(1.12); } 100% { opacity: 1; transform: scale(1); } }
    @keyframes ${id}-fin { from { opacity: 0; } to { opacity: 1; } }
    @keyframes ${id}-drop { from { opacity: 0; transform: translateY(-40px); } to { opacity: 1; transform: none; } }
    @keyframes ${id}-pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.12); } }
    @keyframes ${id}-flash { 0% { opacity: 0; } 20% { opacity: 1; } 40% { opacity: .25; } 60% { opacity: 1; } 80% { opacity: .25; } 100% { opacity: 1; } }
    @keyframes ${id}-ring { 0% { opacity: .9; transform: scale(1); } 100% { opacity: 0; transform: scale(1.7); } }
    @keyframes ${id}-mar { from { stroke-dashoffset: 24; } to { stroke-dashoffset: 0; } }
    @keyframes ${id}-drawk { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
    `;
    for (let n = 1; n <= 4; n++) s += `
    .on${n} .sc-${id} .pop${n} { animation: ${id}-pop .5s ease-out both; }
    .on${n} .sc-${id} .fin${n} { animation: ${id}-fin .6s ease-out both; }
    .on${n} .sc-${id} .drop${n} { animation: ${id}-drop .6s ease-out both; }
    .on${n} .sc-${id} .pulse${n} { animation: ${id}-pulse .7s ease-in-out .3s 2; }
    .on${n} .sc-${id} .flash${n} { animation: ${id}-flash 1.4s ease-in-out both; }
    .on${n} .sc-${id} .ring${n} { animation: ${id}-ring 1.1s ease-out .3s 2; }
    .on${n} .sc-${id} .draw${n} { animation: ${id}-drawk 1.2s linear .2s both; }`;
    return s;
  };

  // ── 직진: 손전등 빛이 곧게 나아가고, 별 모양 종이 뒤 스크린에 닮은 그림자 ──
  (function () {
    const id = 't51-c2-jikjin';
    let css = base(id);
    const P = [106, 188], O = [300, 170], R = 34, X = 545;
    const k = (X - P[0]) / (O[0] - P[0]);
    const img = ([x, y]) => [P[0] + k * (x - P[0]), P[1] + k * (y - P[1])];  // 종이 위 점 → 스크린 위 그림자 점
    const toX = (y) => [X, y];
    let body = '';
    // 스크린
    body += `<path d="M490 318 V334 M598 318 V334" stroke="${C.muted}" stroke-width="5" stroke-linecap="round"/>`;
    body += `<rect x="458" y="30" width="172" height="288" rx="6" fill="white" stroke="${C.line}" stroke-width="3"/>`;
    body += at(1, 'fin', `<rect x="460" y="32" width="168" height="284" rx="5" fill="${C.yellow}" fill-opacity=".3"/>`, 1.0);
    body += text(544, 354, '스크린', { size: 18, color: C.muted });
    // 손전등
    body += `<rect x="30" y="176" width="58" height="24" rx="6" fill="${C.muted}"/><path d="M86 172 L104 164 V212 L86 204 Z" fill="white" stroke="${C.ink}" stroke-width="2.5" stroke-linejoin="round"/>`;
    body += text(66, 236, '손전등', { size: 18, color: C.muted });
    // 칸 1: 사방으로 곧게 뻗는 빛
    [40, 104, 188, 254, 314].forEach((y, i) => { body += beam([P, toX(y)], 1, 0.1 + i * 0.08, { hide: 2, arrow: false }); });
    // 칸 2: 별 모양 종이를 놓으니 빛이 막힌 뒤쪽에 별 그림자
    const top = [O[0], O[1] - R], low = [O[0] + R * Math.cos(rad(126)), O[1] + R * Math.sin(rad(126))];
    const stickTop = img([O[0], O[1] + R * 0.5]);
    body += at(2, 'fin', `<path d="${star(...img(O), R * k)}" fill="${C.ink}" fill-opacity=".5"/><path d="M${f(stickTop[0])} ${f(stickTop[1])} V316" stroke="${C.ink}" stroke-opacity=".5" stroke-width="${f(5 * k)}"/>`, 1.2);
    body += beam([P, toX(40)], 2, 0.1, { arrow: false }) + beam([P, toX(314)], 2, 0.15, { arrow: false });
    body += beam([P, img(top)], 2, 0.25, { arrow: false }) + beam([P, img(low)], 2, 0.3, { arrow: false });
    body += beam([P, [O[0] - 6, O[1]]], 2, 0.2, { arrow: false, dur: 0.6 });
    body += at(2, 'drop', `<path d="M${O[0]} ${O[1] + R * 0.5} V318" stroke="${C.muted}" stroke-width="5"/><rect x="${O[0] - 24}" y="316" width="48" height="10" rx="4" fill="${C.muted}"/><path d="${star(O[0], O[1], R)}" fill="${C.lilac}" stroke="${C.purple}" stroke-width="3" stroke-linejoin="round"/>`, 0);
    // 칸 3
    body += ring(...img(O), 70, 3, C.purple, 0.1);
    body += at(3, 'pop', tag(280, 46, '직진', KEY, { size: 22 }), 0.3);
    put('5-1/과학/2/직진', svg(id, body, css));
  })();

  // ── 반사: 레이저 빛이 거울에 부딪쳐 방향을 바꾸어 나아간다 ──
  (function () {
    const id = 't51-c2-bansa';
    let css = base(id);
    const H = [320, 272];
    let body = '';
    // 거울(위에서 본 모습): 앞면 C.sky, 뒷면 빗금
    let hatch = '';
    for (let x = 150; x <= 490; x += 16) hatch += `M${x} 284 L${x - 10} 296 `;
    body += `<path d="${hatch}" stroke="${C.muted}" stroke-width="2.5" stroke-linecap="round"/><rect x="140" y="272" width="360" height="12" rx="3" fill="${C.sky}" stroke="${C.blue}" stroke-width="3"/>`;
    body += text(320, 330, '거울', { size: 20, color: C.muted });
    const shot = (a, dIn, dOut) => { const ang = down(a); return { ang, front: go(H, ang + Math.PI, dIn), end: go(H, -ang, dOut) }; };
    // 칸 1: 비스듬히 비춘 빛이 거울에 닿는다
    const A = shot(40, 190, 230);
    body += at(1, 'fin', laser(A.front, A.ang), 0);
    body += beam([A.front, H], 1, 0.2, { arrow: false, dur: 1 });
    body += ring(H[0], H[1] - 2, 20, 1, C.orange, 1.1);
    // 칸 2: 방향이 바뀌어 다른 쪽으로 나아간다
    body += beam([H, A.end], 2, 0.1);
    body += at(2, 'pop', tag(320, 48, '반사', KEY, { size: 22 }), 1.2);
    // 칸 3: 비추는 각도를 바꾸어도 방향이 바뀌어 나아간다
    const B = shot(64, 170, 200);
    body += at(3, 'fin', laser(B.front, B.ang), 0);
    body += beam([B.front, H, B.end], 3, 0.2, { dur: 1.5 });
    body += ring(H[0], H[1] - 2, 20, 3, C.orange, 0.7);
    body += `<g class="b3">${g('pulse pulse3', tag(320, 48, '반사', KEY, { size: 22 }), 1.5)}</g>`;
    put('5-1/과학/2/반사', svg(id, body, css));
  })();

  // ── 수직: 종이 위에 똑바로 세운 거울, 수면에 똑바로 내려 비춘 빛 ──
  (function () {
    const id = 't51-c2-sujik';
    let css = base(id) + `
      .sc-${id} .stand { transform-box: fill-box; transform-origin: 50% 100%; }
      .on1 .sc-${id} .stand { animation: ${id}-stand 1.1s ease-in-out .1s both; }
      @keyframes ${id}-stand { from { transform: rotate(-40deg); } to { transform: rotate(0deg); } }`;
    let body = '';
    // 왼쪽: 종이와 거울(옆모습)
    body += `<rect x="40" y="290" width="270" height="8" rx="2" fill="white" stroke="${C.line}" stroke-width="2.5"/>`;
    body += text(80, 326, '종이', { size: 18, color: C.muted });
    body += `<g class="b1"><g class="stand"><rect x="170" y="128" width="12" height="162" rx="2" fill="${C.sky}" stroke="${C.blue}" stroke-width="3"/></g></g>`;
    body += at(1, 'fin', text(200, 190, '거울', { size: 18, color: C.muted, anchor: 'start' }), 1.0);
    body += at(1, 'fin', square(182, 290, 22, -22), 1.2);
    body += at(1, 'pop', tag(176, 88, '수직', LIL, { size: 22 }), 1.3);
    // 오른쪽: 물이 든 수조와 위에서 똑바로 내려 비춘 빛
    body += `<rect x="362" y="222" width="236" height="96" fill="${C.sky}"/><path d="M362 222 H598" stroke="${C.blue}" stroke-width="3"/>`;
    body += `<path d="M360 150 V320 H600 V150" stroke="${C.muted}" stroke-width="4" fill="none" stroke-linejoin="round"/>`;
    body += text(380, 196, '공기', { size: 18, color: C.muted, anchor: 'start' }) + text(380, 300, '물', { size: 18, color: C.muted, anchor: 'start' });
    body += at(2, 'drop', laser([490, 92], Math.PI / 2), 0);
    body += beam([[490, 92], [490, 318]], 2, 0.3, { arrow: false, dur: 1.1 });
    body += ring(490, 222, 18, 2, C.orange, 0.9);
    body += at(2, 'fin', square(495, 222, 20, -20), 1.3);
    // 칸 3: 두 곳의 직각 표시가 깜박이고 오른쪽에도 '수직'
    body += `<g class="b3"><rect class="flash flash3" x="176" y="262" width="34" height="34" rx="6" fill="none" stroke="${C.purple}" stroke-width="3.5"/></g>`;
    body += `<g class="b3"><rect class="flash flash3"${dl(0.2)} x="488" y="195" width="34" height="34" rx="6" fill="none" stroke="${C.purple}" stroke-width="3.5"/></g>`;
    body += at(3, 'pop', tag(556, 110, '수직', LIL, { size: 22 }), 0.4);
    body += `<g class="b3">${g('pulse pulse3', tag(176, 88, '수직', LIL, { size: 22 }), 0.8)}</g>`;
    put('5-1/과학/2/수직', svg(id, body, css));
  })();

  // ── 굴절: 공기에서 물로 비스듬히 들어간 빛이 수면에서 꺾인다 ──
  (function () {
    const id = 't51-c2-gulj';
    let css = base(id);
    const H = [320, 200], floor = 326, a = 50, r = refr(a, 1.33);
    let body = '';
    body += `<rect x="62" y="200" width="516" height="126" fill="${C.sky}"/><path d="M62 200 H578" stroke="${C.blue}" stroke-width="3"/>`;
    body += `<path d="M60 70 V328 H580 V70" stroke="${C.muted}" stroke-width="4" fill="none" stroke-linejoin="round"/>`;
    body += text(82, 186, '공기', { size: 18, color: C.muted, anchor: 'start' }) + text(82, 306, '물', { size: 18, color: C.muted, anchor: 'start' });
    const dy = floor - H[1];
    const side = (sgn) => {
      const inAng = down(sgn * a);
      return { inAng, front: go(H, inAng + Math.PI, 170), bent: [H[0] + sgn * dy * Math.tan(rad(r)), floor], ghost: [H[0] + sgn * dy * Math.tan(rad(a)), floor] };
    };
    const L = side(1), Rt = side(-1);
    // 칸 1: 왼쪽 위에서 비스듬히 비춘 빛이 수면에 닿는다
    body += at(1, 'fin', laser(L.front, L.inAng), 0);
    body += beam([L.front, H], 1, 0.2, { arrow: false, dur: 1 });
    body += ring(H[0], H[1], 18, 1, C.orange, 1.1);
    // 칸 2: 곧게 갔을 길(점선)과 달리 꺾여서 물속으로
    body += at(2, 'fin', `<path d="${pathD([H, L.ghost])}" stroke="${C.muted}" stroke-width="3.5" stroke-dasharray="9 8" stroke-linecap="round"/>`, 0);
    body += beam([H, L.bent], 2, 0.5, { arrow: false, dur: 0.9 });
    body += ring(H[0], H[1], 18, 2, C.orange, 0.4);
    // 칸 3: 오른쪽에서 비추어도 같은 자리에서 꺾인다
    body += at(3, 'fin', laser(Rt.front, Rt.inAng), 0);
    body += beam([Rt.front, H, Rt.bent], 3, 0.2, { arrow: false, dur: 1.4 });
    body += ring(H[0], H[1], 18, 3, C.orange, 1.0);
    body += at(3, 'pop', tag(320, 52, '굴절', KEY, { size: 22 }), 1.2);
    put('5-1/과학/2/굴절', svg(id, body, css));
  })();

  // ── 경계: 공기와 물이 맞닿은 수면, 공기와 유리가 맞닿은 유리판 윗면 ──
  (function () {
    const id = 't51-c2-gyeonggye';
    let css = base(id);
    let body = '';
    // 왼쪽: 공기와 물
    body += `<rect x="32" y="200" width="276" height="116" fill="${C.sky}"/>`;
    body += `<path d="M30 70 V318 H310 V70" stroke="${C.muted}" stroke-width="4" fill="none" stroke-linejoin="round"/>`;
    body += text(270, 120, '공기', { size: 18, color: C.muted }) + text(70, 290, '물', { size: 18, color: C.muted });
    // 오른쪽: 공기와 유리판(아래로 이어진다)
    body += `<rect x="372" y="200" width="236" height="170" fill="${C.mint}" stroke="${C.green}" stroke-width="3"/>`;
    body += text(570, 120, '공기', { size: 18, color: C.muted }) + text(420, 306, '유리', { size: 18, color: C.muted });
    // 칸 1: 수면이 그어지며 반짝이고 '경계'
    body += `<path d="M32 200 H308" stroke="${C.blue}" stroke-width="2" opacity=".5"/>`;
    body += `<g class="b1"><path class="draw draw1" pathLength="1" d="M32 200 H308" stroke="${C.purple}" stroke-width="6" stroke-linecap="round"/></g>`;
    body += at(1, 'pop', tag(252, 200, '경계', LIL), 1.3);
    // 칸 2: 유리판 윗면이 그어지며 '경계'
    body += `<g class="b2"><path class="draw draw2" pathLength="1" d="M372 200 H608" stroke="${C.purple}" stroke-width="6" stroke-linecap="round"/></g>`;
    body += at(2, 'pop', tag(560, 200, '경계', LIL), 1.3);
    // 칸 3: 빛이 바로 그 경계에서 꺾인다
    const shot = (H, n, bottom, dIn) => {
      const ang = down(45), front = go(H, ang + Math.PI, dIn), rr = refr(45, n);
      return { front, ang, end: [H[0] + (bottom - H[1]) * Math.tan(rad(rr)), bottom] };
    };
    const W = shot([170, 200], 1.33, 316, 100), G = shot([460, 200], 1.5, 362, 100);
    body += at(3, 'fin', laser(W.front, W.ang, 54) + laser(G.front, G.ang, 54), 0);
    body += beam([W.front, [170, 200], W.end], 3, 0.2, { arrow: false, dur: 1.3 });
    body += beam([G.front, [460, 200], G.end], 3, 0.35, { arrow: false, dur: 1.3 });
    body += ring(170, 200, 18, 3, C.orange, 0.8) + ring(460, 200, 18, 3, C.orange, 0.95);
    body += `<g class="b3">${g('pulse pulse3', tag(252, 200, '경계', LIL), 1.2)}</g><g class="b3">${g('pulse pulse3', tag(560, 200, '경계', LIL), 1.3)}</g>`;
    put('5-1/과학/2/경계', svg(id, body, css));
  })();

  // ── 렌즈: 볼록 렌즈·오목 렌즈에 나란히 비춘 세 빛줄기가 지나며 꺾인다 ──
  (function () {
    const id = 't51-c2-lens';
    let css = base(id);
    const X = 320, h = 28, F = 150, END = 600;
    const rows = [{ yc: 100, conv: true }, { yc: 262, conv: false }];
    let body = '';
    rows.forEach(({ yc, conv }, i) => {
      body += at(1, 'fin', laser3(106, yc, h), i * 0.15);
      [-h, 0, h].forEach((d, j) => {
        const y = yc + d, yEnd = conv ? y - (d * (END - X)) / F : y + (d * (END - X)) / F;
        body += beam([[108, y], [X, y]], 1, 0.5 + i * 0.15 + j * 0.05, { arrow: false, dur: 0.9 });
        body += beam([[X, y], [END, yEnd]], 2, 0.1 + i * 0.4 + j * 0.05, { dur: 1 });
      });
      body += at(1, 'pop', conv ? lensShape(X, yc, 52, 5, 18) : lensShape(X, yc, 52, 16, 4), 0.2 + i * 0.15);
    });
    body += text(X, 32, '볼록 렌즈', { size: 18, color: C.muted }) + text(X, 350, '오목 렌즈', { size: 18, color: C.muted });
    body += ring(X + F, 100, 16, 2, C.orange, 1.0);
    // 칸 3: 두 렌즈가 깜박이고 '렌즈'
    body += `<g class="b3"><rect class="flash flash3" x="${X - 34}" y="38" width="68" height="124" rx="16" fill="none" stroke="${C.orange}" stroke-width="4"/></g>`;
    body += `<g class="b3"><rect class="flash flash3"${dl(0.2)} x="${X - 34}" y="200" width="68" height="124" rx="16" fill="none" stroke="${C.orange}" stroke-width="4"/></g>`;
    body += at(3, 'pop', tag(72, 181, '렌즈', OK, { size: 22 }), 0.6);
    put('5-1/과학/2/렌즈', svg(id, body, css));
  })();

  // ── 볼록 렌즈 · 오목 렌즈: 두께 → 세 빛줄기 → 손잡이 렌즈로 본 무당벌레 ──
  const lensWord = ({ id, word, conv }) => {
    const zoom = conv ? 2 : 0.6;
    let css = base(id) + `
      .sc-${id} .zoom { transform-box: fill-box; transform-origin: center; }
      .on3 .sc-${id} .zoom { animation: ${id}-zoom 1s ease-in-out 1s both; }
      @keyframes ${id}-zoom { from { transform: scale(1); } to { transform: scale(${zoom}); } }`;
    const X = 210, yc = 190, LH = 92, h = 50, F = 130, END = 400;
    let body = '';
    // 칸 1: 렌즈 단면과 가운데·가장자리 두께
    const mid = conv ? 24 : 4, edge = conv ? 6 : 20;
    const gm = gauge(X - mid, X + mid, yc), ge = gauge(X - edge, X + edge, yc - LH + 8);
    // 칸 2: 나란한 세 빛줄기가 렌즈를 지나며 모이거나 퍼진다
    body += at(2, 'fin', laser3(72, yc, h), 0);
    [-h, 0, h].forEach((d, j) => {
      const y = yc + d, yEnd = conv ? y - (d * (END - X)) / F : y + (d * (END - X)) / F;
      body += beam([[74, y], [X, y], [END, yEnd]], 2, 0.2 + j * 0.06, { dur: 1.3 });
    });
    if (conv) body += ring(X + F, yc, 16, 2, C.orange, 1.3);
    body += lensShape(X, yc, LH, edge, mid);
    body += shown(1, g('fin fin1', gm + lead(X - mid - 10, yc, 140, yc) + text(98, yc + 7, conv ? '두꺼움' : '얇음', { size: 20, color: C.red }), 0.4), 2);
    body += shown(1, g('fin fin1', ge + lead(X + edge + 10, yc - LH + 8, 252, yc - LH + 8) + text(258, yc - LH + 15, conv ? '얇음' : '두꺼움', { size: 20, color: C.red, anchor: 'start' }), 0.9), 2);
    // 칸 3: 손잡이 렌즈로 본 무당벌레(옆은 실제 크기)
    const M = [500, 214], MR = 56, r = conv ? 15 : 24;
    body += at(3, 'fin', bug(598, M[1], r), 0) + at(3, 'fin', bug(M[0], M[1], r), 0);
    body += at(3, 'drop', magnifier(id, M[0], M[1], MR, `<circle cx="${M[0]}" cy="${M[1]}" r="${f(r * 1.6)}" fill="none"/>` + bug(M[0], M[1], r), 'zoom'), 0.4);
    body += at(3, 'pop', tag(530, 56, word, conv ? KEY : COLD), 1.6);
    put(`5-1/과학/2/${word}`, svg(id, body, css));
  };
  lensWord({ id: 't51-c2-bollok', word: '볼록 렌즈', conv: true });
  lensWord({ id: 't51-c2-omok', word: '오목 렌즈', conv: false });
})(typeof window !== 'undefined' ? window : globalThis);
