// 과학 7-1 낱말 도식(Ⅳ단원 물질의 상태 변화): 입자 모형·확산·증발, 세 상태와 융해·응고·기화·액화·승화, 동결 건조, 열에너지.
// 고체는 줄 맞춘 입자, 액체는 붙어서 흐트러진 입자, 기체는 멀리 흩어진 입자. 열을 흡수하면 C.orange 화살표가 들어오고, 방출하면 C.blue 화살표가 나간다.
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

  // ════ Ⅳ단원 물질의 상태 변화 ════
  const beaker = (cx, by, w, h) => {
    const l = cx - w / 2, r = cx + w / 2, t = by - h;
    return `<path d="M${f(l - 5)} ${f(t)} H${f(l)} V${f(by - 9)} Q${f(l)} ${f(by)} ${f(l + 9)} ${f(by)} H${f(r - 9)} Q${f(r)} ${f(by)} ${f(r)} ${f(by - 9)} V${f(t)} H${f(r + 5)}" fill="none" stroke="${C.muted}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/>`;
  };
  const liq = (cx, by, w, lh, color, op = 1, cls = '') => `<rect class="${cls}" x="${f(cx - w / 2 + 2)}" y="${f(by - lh)}" width="${f(w - 4)}" height="${f(lh - 2)}" rx="8" fill="${color}" fill-opacity="${op}"/>`;
  // 상태마다 입자 자리(상자 가운데 cx, cy, 상자 크기 w×h, n 개)
  const spots = (kind, cx, cy, w, h, n = 12, seed = 3) => {
    const r = seeded(seed), out = [];
    if (kind === 'solid') { const cols = 4, gap = 25; for (let k = 0; k < n; k++) out.push([cx + ((k % cols) - (cols - 1) / 2) * gap, cy + h / 2 - 22 - Math.floor(k / cols) * gap]); }
    else if (kind === 'liquid') { const cols = Math.max(4, Math.min(6, Math.floor((w - 30) / 26))), gap = 26; for (let k = 0; k < n; k++) { const row = Math.floor(k / cols); out.push([cx + ((k % cols) - (cols - 1) / 2) * gap + (row % 2 ? 9 : -4) + (r() - 0.5) * 7, cy + h / 2 - 20 - row * 23 + (r() - 0.5) * 6]); } }
    else { let tries = 0; while (out.length < n && tries < 4000) { tries++; const x = cx - w / 2 + 18 + r() * (w - 36), y = cy - h / 2 + 18 + r() * (h - 36); if (out.every(([a, b]) => Math.hypot(a - x, b - y) > 34)) out.push([x, y]); } }
    return out;
  };
  const AMP = { solid: [1.2, 0.9], liquid: [3, 0.6], gas: [6, 0.4] };
  const NAMEK = { solid: '고체', liquid: '액체', gas: '기체' };
  const pfill = [C.sky, C.blue];
  // 담는 상자
  const box = (cx, cy, w, h) => `<rect x="${cx - w / 2}" y="${cy - h / 2}" width="${w}" height="${h}" rx="14" fill="white" stroke="${C.muted}" stroke-width="3"/>`;
  // 열이 들어오거나(흡수, 주황 화살표가 위로 들어옴) 나가는(방출, 파란 화살표가 아래로 나감) 표시
  const heatArrows = (x, y, absorb, n) => {
    const col = absorb ? C.orange : C.blue;
    let s = '';
    [-30, 0, 30].forEach((dx, k) => {
      const a = absorb ? solid(x + dx, y + 46, x + dx, y + 14, col, 4) : solid(x + dx, y + 14, x + dx, y + 46, col, 4);
      s += `<g class="go"${st({ '--dx': '0px', '--dy': (absorb ? -14 : 14) + 'px', '--d': '1.6s', 'animation-delay': f(-k * 0.5) + 's' })}>${a}</g>`;
    });
    return shown(n, s) + at(n, 'pop', tag(x, y + 72, absorb ? '열 흡수' : '열 방출', absorb ? HOT : COLD, { size: 18 }), 0.4);
  };
  // 입자 무리: from 자리에서 칸 n 에 to 자리로 옮겨 가고, back 칸에 되돌아온다
  const movers = (id, A, B, fromK, toK, n, back = 0, cls = 'pp') => {
    let s = '';
    const r = seeded(29);
    A.forEach(([x, y], k) => {
      const [tx, ty] = B[k];
      s += `<g class="${cls}"${st({ '--tx': f(tx - x) + 'px', '--ty': f(ty - y) + 'px', 'transition-delay': f(0.3 + r() * 0.5) + 's' })}>${jig(dot(x, y, 10, pfill[0], pfill[1], 2.2), AMP[fromK][0], AMP[fromK][1], -r())}</g>`;
    });
    let css = `.sc-${id} .${cls} { transition: transform 1.6s ease-in-out; } .on${n} .sc-${id} .${cls} { transform: translate(var(--tx), var(--ty)); }
      .on${n} .sc-${id} .${cls} .jg { --a: ${AMP[toK][0]}px !important; --d: ${AMP[toK][1]}s !important; }`;
    if (back) css += `.on${back} .sc-${id} .${cls} { transform: none; } .on${back} .sc-${id} .${cls} .jg { --a: ${AMP[fromK][0]}px !important; --d: ${AMP[fromK][1]}s !important; }`;
    return [s, css];
  };
  // ── 두 상태 사이의 변화(융해·응고·기화·액화) ──
  const LB = [130, 170], RB = [510, 170], BW2 = 200, BH2 = 180;
  const change = (id, word, fromK, toK, absorb, example) => {
    let css = base(id);
    let body = box(LB[0], LB[1], BW2, BH2) + box(RB[0], RB[1], BW2, BH2);
    body += text(LB[0], 290, NAMEK[fromK], { size: 22 }) + text(RB[0], 290, NAMEK[toK], { size: 22 });
    const A = spots(fromK, LB[0], LB[1], BW2, BH2, 12, 5), B = spots(toK, RB[0], RB[1], BW2, BH2, 12, 9);
    const [ps, pcss] = movers(id, A, B, fromK, toK, 2);
    body += ps; css += pcss;
    const col = absorb ? C.orange : C.blue;
    body += drawPath(`M244 ${LB[1]} H390`, 2, col, 6, 0) + at(2, 'fin', head(396, LB[1], 0, col, 6), 1.0);
    body += heatArrows(320, LB[1] + 10, absorb, 2);
    body += at(3, 'pop', tag(320, LB[1] - 38, word, absorb ? HOT : COLD, { size: 26 }), 0.3);
    body += at(3, 'pop', tag(320, 336, example, GRAY, { size: 18 }), 0.8);
    put(`7-1/과학/4/${word}`, svg(id, body, css));
  };
  change('t71-s4-yunghae', '융해', 'solid', 'liquid', true, '얼음이 녹아 물이 됨');
  change('t71-s4-eunggo', '응고', 'liquid', 'solid', false, '물이 얼어 얼음이 됨');
  change('t71-s4-gihwa', '기화', 'liquid', 'gas', true, '증발 · 끓음');
  change('t71-s4-aekhwa', '액화', 'gas', 'liquid', false, '컵 겉에 맺힌 물방울');

  // ── 승화: 고체 ↔ 기체가 액체를 거치지 않고 바로 ──
  (function () {
    const id = 't71-s4-seunghwa';
    let css = base(id);
    let body = box(LB[0], LB[1], BW2, BH2) + box(RB[0], RB[1], BW2, BH2);
    body += text(LB[0], 290, '고체', { size: 22 }) + text(RB[0], 290, '기체', { size: 22 });
    const A = spots('solid', LB[0], LB[1], BW2, BH2, 12, 5), B = spots('gas', RB[0], RB[1], BW2, BH2, 12, 9);
    const [ps, pcss] = movers(id, A, B, 'solid', 'gas', 2, 3);
    body += ps; css += pcss;
    body += drawPath(`M244 ${LB[1] - 30} H390`, 2, C.orange, 6, 0) + at(2, 'fin', head(396, LB[1] - 30, 0, C.orange, 6), 1.0) + at(2, 'pop', tag(318, LB[1] - 62, '열 흡수', HOT, { size: 18 }), 0.4);
    body += drawPath(`M396 ${LB[1] + 30} H250`, 3, C.blue, 6, 0) + at(3, 'fin', head(244, LB[1] + 30, Math.PI, C.blue, 6), 1.0) + at(3, 'pop', tag(322, LB[1] + 62, '열 방출', COLD, { size: 18 }), 0.4);
    body += at(1, 'pop', tag(LB[0], 32, '드라이아이스', GRAY, { size: 18 }), 0.3) + at(3, 'pop', tag(LB[0], 328, '서리', GRAY, { size: 18 }), 0.6);
    body += at(3, 'pop', tag(320, 336, '승화', LIL, { size: 26 }), 1.2);
    put('7-1/과학/4/승화', svg(id, body, css));
  })();

  // ── 상태 변화: 세 상태와 여섯 가지 변화, 입자는 그대로 ──
  (function () {
    const id = 't71-s4-sangtae';
    let css = base(id);
    const S = { gas: [320, 72], solid: [112, 274], liquid: [528, 274] }, W = 150, H = 100;
    let body = '';
    Object.entries(S).forEach(([k, [x, y]], i) => {
      body += box(x, y, W, H);
      const P = spots(k, x, y, W, H, k === 'solid' ? 8 : 9, 7 + i);
      body += P.map(([px, py], j) => jig(dot(px, py, 9, pfill[0], pfill[1], 2), AMP[k][0], AMP[k][1], -j * 0.13)).join('');
      body += ring(P[0][0], P[0][1], 12, 3, C.red, 0.2 + i * 0.3);
    });
    body += text(205, 72, '기체', { size: 22, anchor: 'end' }) + text(112, 350, '고체', { size: 22 }) + text(528, 350, '액체', { size: 22 });
    // 여섯 화살표: [그릴 길, 끝 방향, 이름, 이름 자리, 흡수?]
    const AR = [
      ['M196 258 H436', 0, '융해', [316, 248], true], ['M444 292 H204', Math.PI, '응고', [316, 318], false],
      ['M478 218 L398 130', null, '기화', [490, 160], true], ['M372 136 L452 224', null, '액화', [400, 216], false],
      ['M148 218 L238 128', null, '승화', [150, 160], true], ['M262 136 L176 224', null, '승화', [242, 216], false]
    ];
    AR.forEach(([d, ang, name, [lx, ly], abs], k) => {
      const m = d.match(/M(\S+) (\S+) [HL](\S+)(?: (\S+))?/), x1 = +m[1], y1 = +m[2], x2 = d.includes('H') ? +m[3] : +m[3], y2 = d.includes('H') ? y1 : +m[4];
      const a = Math.atan2(y2 - y1, x2 - x1), col = abs ? C.orange : C.blue;
      body += drawPath(d, 2, col, 5, f(k * 0.15)) + at(2, 'fin', head(x2, y2, a, col, 5) + text(lx, ly, name, { size: 20, color: col }), f(0.9 + k * 0.15));
    });
    body += at(3, 'pop', tag(320, 162, '상태 변화', OK, { size: 24 }), 1.2);
    put('7-1/과학/4/상태 변화', svg(id, body, css));
  })();

  // ── 입자 모형: 보이지 않는 풍선 속 공기를 동그라미로 그려 나타낸다 ──
  (function () {
    const id = 't71-s4-mohyeong';
    let css = base(id);
    const balloon = (cx, cy) => `<ellipse cx="${cx}" cy="${cy}" rx="104" ry="122" fill="${C.peach}" fill-opacity=".45" stroke="${C.orange}" stroke-width="3.5"/><path d="M${cx - 9} ${cy + 130} L${cx} ${cy + 120} L${cx + 9} ${cy + 130} Z" fill="${C.orange}"/><path d="M${cx} ${cy + 130} q-10 20 0 40 t0 40" stroke="${C.muted}" stroke-width="2.5" fill="none"/>`;
    let body = balloon(150, 150) + balloon(470, 150);
    body += at(1, 'pop', text(150, 160, '?', { size: 52, color: C.muted, weight: 800 }), 0.4) + at(1, 'pop', tag(150, 330, '눈으로 보면', GRAY, { size: 18 }), 0.6);
    const r = seeded(41), P = [];
    let tries = 0;
    while (P.length < 14 && tries < 3000) { tries++; const a = r() * Math.PI * 2, d = Math.sqrt(r()), x = 470 + Math.cos(a) * d * 82, y = 150 + Math.sin(a) * d * 100; if (P.every(([p, q]) => Math.hypot(p - x, q - y) > 36)) P.push([x, y]); }
    body += P.map(([x, y], k) => at(2, 'pop', jig(dot(x, y, 10, C.sky, C.blue, 2.2), 6, 0.45, -k * 0.1), f(0.2 + k * 0.08))).join('');
    body += at(2, 'pop', tag(470, 330, '입자로 그리면', COLD, { size: 18 }), 1.4);
    body += drawPath('M268 150 H346', 2, C.muted, 4, 0.2) + at(2, 'fin', head(350, 150, 0, C.muted, 4), 1.0);
    body += glowRect(358, 20, 224, 262, 3, C.blue, 0.2, 20) + at(3, 'pop', tag(310, 272, '입자 모형', COLD, { size: 24 }), 0.6);
    put('7-1/과학/4/입자 모형', svg(id, body, css));
  })();

  // ── 확산: 물에 떨어뜨린 잉크 입자가 스스로 사방으로 퍼진다 ──
  (function () {
    const id = 't71-s4-hwaksan';
    let css = base(id);
    const cx = 320, by = 330, w = 380, h = 240, lh = 200;
    let body = liq(cx, by, w, lh, C.sky, 0.7);
    body += `<g class="b3"><rect class="cf cf3" style="animation-delay:.6s" x="${cx - w / 2 + 2}" y="${by - lh}" width="${w - 4}" height="${lh - 2}" rx="8" fill="${C.lilac}" fill-opacity=".8"/></g>`;
    body += beaker(cx, by, w, h);
    // 잉크 방울
    body += atH(1, 2, 'drop', `<path d="M${cx} 60 Q${cx + 9} 74 ${cx + 9} 80 A9 9 0 0 1 ${cx - 9} 80 Q${cx - 9} 74 ${cx} 60 Z" fill="${C.purple}"/>`, 0) + at(1, 'pop', tag(cx + 90, 70, '잉크', LIL, { size: 18 }), 0.4);
    const r = seeded(51), N = 22, P = [], Q = [];
    for (let k = 0; k < N; k++) { const a = r() * Math.PI * 2, d = Math.sqrt(r()) * 26; P.push([cx + Math.cos(a) * d, 168 + Math.sin(a) * d * 0.8]); }
    let tries = 0;
    while (Q.length < N && tries < 5000) { tries++; const x = cx - w / 2 + 22 + r() * (w - 44), y = by - lh + 20 + r() * (lh - 40); if (Q.every(([p, q]) => Math.hypot(p - x, q - y) > 40)) Q.push([x, y]); }
    while (Q.length < N) Q.push([cx + (r() - 0.5) * 300, by - 100 + (r() - 0.5) * 140]);
    P.forEach(([x, y], k) => {
      body += `<g class="b1"><g class="fin fin1" style="animation-delay:.6s"><g class="sp"${st({ '--tx': f(Q[k][0] - x) + 'px', '--ty': f(Q[k][1] - y) + 'px', 'transition-delay': f(r() * 0.6) + 's' })}>${jig(dot(x, y, 7, C.purple, 'white', 1.5), 3, 0.5, -r())}</g></g></g>`;
    });
    css += `.sc-${id} .sp { transition: transform 3s ease-out; } .on2 .sc-${id} .sp { transform: translate(var(--tx), var(--ty)); }`;
    body += atH(2, 3, 'fin', [[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([sx, sy]) => solid(cx + sx * 40, 168 + sy * 30, cx + sx * 90, 168 + sy * 64, C.purple, 4)).join(''), 0);
    body += at(3, 'pop', tag(cx, 40, '확산', LIL, { size: 26 }), 0.6);
    put('7-1/과학/4/확산', svg(id, body, css));
  })();

  // ── 증발: 표면의 활발한 입자가 떨어져 나와 기체로 ──
  (function () {
    const id = 't71-s4-jeungbal';
    let css = base(id);
    const cx = 320, by = 330, w = 420, h = 150, lh = 112;
    let body = `<g class="wl">${liq(cx, by, w, lh, C.sky, 0.8)}</g>`;
    css += `.sc-${id} .wl { transform-box: fill-box; transform-origin: 50% 100%; }` + states(id, 'wl', 'transform', ['none', 'none', 'none', 'scaleY(.8)'], 2, 0.4);
    body += beaker(cx, by, w, h);
    const r = seeded(61);
    for (let row = 0; row < 4; row++) for (let i = 0; i < 12; i++) {
      const x = cx - w / 2 + 24 + i * 33 + (row % 2) * 14 + (r() - 0.5) * 6, y = by - 16 - row * 23 + (r() - 0.5) * 4;
      if (x > cx + w / 2 - 16) continue;
      const p = jig(dot(x, y, 9.5, 'white', C.blue, 2), 2.6, 0.6, -r());
      body += row === 3 ? `<g class="tp">${p}</g>` : p;
    }
    css += states(id, 'tp', 'opacity', ['1', '1', '1', '0'], 1.6, 0.6);
    // 칸 2: 표면에서 떨어져 나가는 입자
    let fly = '';
    [[200, -40, -170], [300, 30, -180], [400, -20, -160], [470, 40, -170], [250, 20, -150]].forEach(([x, dx, dy], k) => {
      fly += `<g class="go"${st({ '--dx': dx + 'px', '--dy': dy + 'px', '--d': '3s', 'animation-delay': f(-k * 0.6) + 's' })}>${dot(x, by - lh + 6, 9.5, 'white', C.blue, 2)}</g>`;
    });
    body += shown(2, fly) + at(2, 'pop', tag(560, 120, '기체', COLD, { size: 18 }), 0.8) + at(1, 'pop', lead(120, 196, 136, by - lh) + tag(100, 180, '표면', GRAY, { size: 18 }), 0.4);
    body += at(3, 'pop', tag(320, 60, '증발', COLD, { size: 26 }), 1.6);
    put('7-1/과학/4/증발', svg(id, body, css));
  })();

  // ── 동결 건조: 얼린 뒤 얼음을 녹이지 않고 바로 수증기로 날려 말린다 ──
  (function () {
    const id = 't71-s4-donggyeol';
    let css = base(id);
    const cx = 260, cy = 200;
    const berry = `M${cx} ${cy + 120} C${cx - 120} ${cy + 40} ${cx - 140} ${cy - 70} ${cx - 70} ${cy - 110} C${cx - 30} ${cy - 130} ${cx + 30} ${cy - 130} ${cx + 70} ${cy - 110} C${cx + 140} ${cy - 70} ${cx + 120} ${cy + 40} ${cx} ${cy + 120} Z`;
    let body = `<path d="${berry}" fill="${C.peach}" stroke="${C.red}" stroke-width="4"/>`;
    body += `<g class="b3"><path class="cf cf3" style="animation-delay:1.6s" d="${berry}" fill="white" fill-opacity=".6" stroke="${C.red}" stroke-width="4" stroke-dasharray="9 6"/></g>`;
    body += `<path d="M${cx - 40} ${cy - 118} L${cx} ${cy - 96} L${cx + 40} ${cy - 118} L${cx + 14} ${cy - 132} L${cx} ${cy - 150} L${cx - 14} ${cy - 132} Z" fill="${C.green}" stroke="${C.green}" stroke-width="2" stroke-linejoin="round"/>`;
    body += atH(1, 2, 'pop', tag(cx + 170, 70, '물이 든 딸기', RED, { size: 18 }), 0.3);
    body += [[-60, -60], [-20, -80], [30, -70], [70, -40], [-80, 0], [80, 10], [-40, 50], [40, 50], [0, 90], [-10, 10]].map(([dx, dy]) => `<ellipse cx="${cx + dx}" cy="${cy + dy}" rx="3" ry="5" fill="${C.yellow}" stroke="${C.orange}" stroke-width="1.2"/>`).join('');
    // 물 입자: 칸 1 흩어져 움직임 → 칸 2 줄 맞춰 얼음 → 칸 3 위로 날아가 사라짐
    const r = seeded(71), A = [], B = [];
    let tries = 0;
    while (A.length < 12 && tries < 4000) { tries++; const x = cx - 80 + r() * 160, y = cy - 70 + r() * 150; if (y < cy + 100 - Math.abs(x - cx) * 0.8 && A.every(([p, q]) => Math.hypot(p - x, q - y) > 32)) A.push([x, y]); }
    for (let k = 0; k < A.length; k++) B.push([cx - 48 + (k % 4) * 32, cy - 36 + Math.floor(k / 4) * 32]);
    A.forEach(([x, y], k) => {
      body += `<g class="w1"${st({ '--tx': f(B[k][0] - x) + 'px', '--ty': f(B[k][1] - y) + 'px', 'transition-delay': f(r() * 0.4) + 's' })}><g class="w2"${st({ '--up': f(-260 - r() * 60) + 'px', '--sx': f((r() - 0.5) * 120) + 'px', 'transition-delay': f(r() * 0.5) + 's' })}>${jig(dot(x, y, 10, C.sky, C.blue, 2.2), 3, 0.6, -r())}</g></g>`;
    });
    css += `.sc-${id} .w1 { transition: transform 1.4s ease-in-out; } .on2 .sc-${id} .w1 { transform: translate(var(--tx), var(--ty)); } .on2 .sc-${id} .w1 .jg { --a: 1px !important; --d: 1s !important; }
      .sc-${id} .w2 { transition: transform 1.5s ease-in, opacity 1.5s ease-in; } .on3 .sc-${id} .w2 { transform: translate(var(--sx), var(--up)); opacity: 0; }`;
    // 칸 2: 아주 차갑게
    const flake = (x, y) => { let s = ''; for (let k = 0; k < 3; k++) { const a = (k * Math.PI) / 3; s += `M${f(x - 18 * Math.cos(a))} ${f(y - 18 * Math.sin(a))} L${f(x + 18 * Math.cos(a))} ${f(y + 18 * Math.sin(a))} `; } return `<path d="${s}" stroke="${C.blue}" stroke-width="4" stroke-linecap="round"/>`; };
    body += at(2, 'pop', flake(470, 160) + tag(530, 210, '꽁꽁 얼림', COLD, { size: 18 }), 0.2);
    body += atH(2, 3, 'pop', tag(cx, 330, '얼음', COLD, { size: 18 }), 1.2);
    // 칸 3: 얼음이 바로 수증기로
    body += at(3, 'pop', tag(515, 262, '녹이지 않고 바로 수증기', LIL, { size: 18 }), 0.3);
    body += at(3, 'pop', tag(cx, 330, '바싹 마름', HOT, { size: 18 }), 1.4) + at(3, 'pop', tag(500, 60, '동결 건조', COLD, { size: 24 }), 1.6);
    put('7-1/과학/4/동결 건조', svg(id, body, css));
  })();

  // ── 열에너지: 불에서 얼음으로 들어간 열에너지가 입자를 활발하게 하고 상태를 바꾼다 ──
  (function () {
    const id = 't71-s4-yeolenergy';
    let css = base(id);
    const cx = 250, by = 270, w = 220, h = 190;
    let body = beaker(cx, by, w, h);
    body += `<g class="b3"><rect class="cf cf3" style="animation-delay:.4s" x="${cx - w / 2 + 2}" y="${by - 100}" width="${w - 4}" height="98" rx="8" fill="${C.sky}" fill-opacity=".7"/></g>`;
    const A = spots('solid', cx, by - 90, 140, 180, 12, 5), B = spots('liquid', cx, by - 60, 200, 120, 12, 9);
    const [ps, pcss] = movers(id, A, B, 'solid', 'liquid', 3);
    body += ps; css += pcss;
    css += `.on2 .sc-${id} .pp .jg { --a: 2.6px !important; --d: .4s !important; }`;
    body += `<path d="M${cx - 120} ${by + 72} H${cx + 120}" stroke="${C.muted}" stroke-width="5" stroke-linecap="round"/>` + `<g class="b1">${flame(cx - 40, by + 68, 1)}${flame(cx + 40, by + 68, 1)}</g>`;
    // 열에너지 알갱이: 불꽃에서 그릇으로
    let pk = '';
    for (let k = 0; k < 5; k++) pk += `<g class="go"${st({ '--dx': f(-30 + k * 15) + 'px', '--dy': '-60px', '--d': '1.8s', 'animation-delay': f(-k * 0.36) + 's' })}>${dot(cx - 30 + k * 15, by + 14, 6, C.orange, 'white', 1.5)}</g>`;
    body += shown(1, pk) + at(1, 'pop', tag(470, by + 30, '열에너지', HOT, { size: 20 }), 0.4) + at(1, 'fin', solid(410, by + 30, 300, by + 14, C.orange, 3), 0.6);
    // 온도계
    body += `<rect x="${cx + 140}" y="70" width="14" height="190" rx="7" fill="white" stroke="${C.muted}" stroke-width="2.5"/><circle cx="${cx + 147}" cy="262" r="11" fill="${C.red}" stroke="${C.muted}" stroke-width="2.5"/><rect class="lv tt" x="${cx + 144}" y="76" width="6" height="182" rx="3" fill="${C.red}"/>`;
    css += states(id, 'tt', 'transform', ['scaleY(.15)', 'scaleY(.15)', 'scaleY(.35)', 'scaleY(.35)'], 1.6, 0.3);
    // 녹는 동안에는 온도가 오르지 않는다: 칸 3에서 '온도 오름'을 지우고 '온도 그대로'를 띄운다
    css += `.sc-${id} .tup { transition: opacity .5s; } .on3 .sc-${id} .tup { opacity: 0; }`;
    body += `<g class="tup">${at(2, 'pop', tag(cx + 147 + 70, 120, '온도 오름', RED, { size: 18 }), 0.6)}</g>` + at(3, 'pop', tag(cx + 147 + 70, 120, '온도 그대로', RED, { size: 18 }), 0.8);
    body += at(3, 'pop', tag(cx, 40, '얼음 → 물', COLD, { size: 18 }), 1.6);
    put('7-1/과학/4/열에너지', svg(id, body, css));
  })();

  // ── 방출: 물이 얼면서 열에너지를 밖으로 내보낸다 ──
  (function () {
    const id = 't71-s4-bangchul';
    let css = base(id);
    const cx = 320, by = 290, w = 220, h = 170;
    let body = `<rect x="${cx - w / 2 + 2}" y="${by - 120}" width="${w - 4}" height="118" rx="8" fill="${C.sky}" fill-opacity=".6"/>` + beaker(cx, by, w, h);
    const A = spots('liquid', cx, by - 60, 200, 120, 12, 9), B = spots('solid', cx, by - 70, 140, 150, 12, 5);
    const [ps, pcss] = movers(id, A, B, 'liquid', 'solid', 2);
    body += ps; css += pcss;
    // 차가운 둘레
    body += at(1, 'pop', tag(cx, 330, '차가운 곳', COLD, { size: 18 }), 0.3);
    // 칸 2: 열에너지가 밖으로
    let out = '';
    [[-150, -40], [150, -40], [-160, 40], [160, 40], [0, -120], [-110, -110], [110, -110]].forEach(([dx, dy], k) => { out += `<g class="go"${st({ '--dx': dx + 'px', '--dy': dy + 'px', '--d': '2s', 'animation-delay': f(-k * 0.3) + 's' })}>${dot(cx, by - 70, 8, C.orange, 'white', 2)}</g>`; });
    body += shown(2, out) + at(2, 'pop', tag(540, 300, '열에너지', HOT, { size: 18 }), 0.6);
    // 칸 3: 밖으로 향한 화살표
    body += at(3, 'fin', [[-1, -1], [1, -1], [-1, 0.3], [1, 0.3]].map(([sx, sy]) => solid(cx + sx * 130, by - 90 + sy * 50, cx + sx * 200, by - 90 + sy * 90, C.orange, 5)).join(''), 0.2);
    body += at(3, 'pop', tag(cx, 50, '방출', HOT, { size: 26 }), 0.8);
    put('7-1/과학/4/방출', svg(id, body, css));
  })();
})(typeof window !== 'undefined' ? window : globalThis);
