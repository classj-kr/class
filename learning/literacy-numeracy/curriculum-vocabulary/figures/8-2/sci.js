// 과학 중2-2(8-2) Ⅴ「식물과 에너지」·Ⅵ「동물과 에너지」(소화·호흡) 낱말 도식.
// 물질은 모양으로 가른다: 포도당은 노란 육각형, 녹말은 육각형 사슬, 단백질은 색 구슬 사슬, 지방은 받침에 꼬리 셋.
// 흐름은 점이 길을 따라 가는 것(stroke-dashoffset)으로, 나머지 움직임은 transform·opacity 로만 그린다.
(function (root) {
  'use strict';
  const { C, svg, text, put } = root.FigureKit;
  const f = (n) => +(+n).toFixed(1);
  const dl = (s) => (s ? ` style="animation-delay:${s}s"` : '');
  const g = (cls, inner, s = 0) => `<g class="${cls}"${dl(s)}>${inner}</g>`;
  const at = (n, kind, inner, s = 0) => `<g class="b${n}">${g(`${kind} ${kind}${n}`, inner, s)}</g>`;
  const shown = (n, inner, hide) => `<g class="b${n}${hide ? ' h' + hide : ''}">${inner}</g>`;
  const tw = (s, size) => [...String(s)].reduce((a, c) => a + (/[가-힣]/.test(c) ? 1 : c === ' ' ? 0.34 : /[+−=×÷→]/.test(c) ? 0.9 : 0.62), 0) * size;
  const HOT = [C.peach, C.red], COLD = [C.sky, C.blue], OK = [C.mint, C.green], GRAY = ['white', C.muted], LIL = [C.lilac, C.purple], KEY = [C.peach, C.red], SUN = ['#fdf3d0', C.orange];
  const tag = (cx, cy, label, [fill, stroke] = OK, { size = 20 } = {}) => {
    const w = Math.round(tw(label, size) + size * 1.3), h = Math.round(size * 1.7);
    return `<g><rect x="${f(cx - w / 2)}" y="${f(cy - h / 2)}" width="${w}" height="${h}" rx="${h / 2}" fill="${fill}" stroke="${stroke}" stroke-width="2.5"/>${text(f(cx), f(cy + size * 0.36), label, { size })}</g>`;
  };
  const lead = (x1, y1, x2, y2, color = C.muted) => `<path d="M${f(x1)} ${f(y1)} L${f(x2)} ${f(y2)}" stroke="${color}" stroke-width="2.5" stroke-linecap="round"/>`;
  const ring = (cx, cy, r, n, color = C.green, s = 0) => `<g class="b${n}"><circle class="ring ring${n}"${dl(s)} cx="${f(cx)}" cy="${f(cy)}" r="${r}" fill="none" stroke="${color}" stroke-width="4"/></g>`;
  const glowRect = (x, y, w, h, n, color = C.green, s = 0, rx = 14) => `<g class="b${n}"><rect class="flash flash${n}"${dl(s)} x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="${rx}" fill="none" stroke="${color}" stroke-width="5"/></g>`;
  const glowPath = (d, n, color = C.green, s = 0, w = 5) => `<g class="b${n}"><path class="flash flash${n}"${dl(s)} d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linejoin="round"/></g>`;
  const drawPath = (d, n, color, w = 4, s = 0, extra = '') => `<g class="b${n}"><path class="draw draw${n}"${dl(s)} pathLength="1" d="${d}" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" fill="none"${extra}/></g>`;
  // 화살표(머리 채움). 칸 n 에 그려지며 나타난다
  const harrow = (x1, y1, x2, y2, color = C.muted, w = 5) => {
    const a = Math.atan2(y2 - y1, x2 - x1), hl = w * 2.6, hw = w * 1.6;
    const bx = x2 - hl * Math.cos(a), by = y2 - hl * Math.sin(a), px = -Math.sin(a) * hw, py = Math.cos(a) * hw;
    return `<path d="M${f(x1)} ${f(y1)} L${f(bx)} ${f(by)}" stroke="${color}" stroke-width="${w}" stroke-linecap="round"/>`
      + `<path d="M${f(x2)} ${f(y2)} L${f(bx + px)} ${f(by + py)} L${f(bx - px)} ${f(by - py)} Z" fill="${color}" stroke="${color}" stroke-width="1.5" stroke-linejoin="round"/>`;
  };
  // 길 d 를 따라 점 n 개가 흘러간다(한 바퀴 dur 초)
  const flow = (id, d, color, { n = 4, dur = 2.4, w = 11, delay = 0, trail = false } = {}) => {
    const sp = f(100 / n);
    return (trail ? `<path d="${d}" fill="none" stroke="${color}" stroke-width="3" stroke-opacity=".3" stroke-linecap="round"/>` : '') + `<path d="${d}" pathLength="100" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-dasharray="0.01 ${f(sp - 0.01)}" style="animation:${id}-fl${n} ${dur}s linear ${delay}s infinite"/>`;
  };
  // 칸마다 transform 을 바꾸는 이음. vals[0] 은 처음, vals[k] 는 칸 k(null 은 그대로)
  const steps = (id, cls, vals, sec = 1.2, delay = 0.2) => `.sc-${id} .${cls} { transform: ${vals[0]}; transition: transform ${sec}s ease-in-out ${delay}s; }`
    + vals.slice(1).map((v, i) => (v == null ? '' : `.on${i + 1} .sc-${id} .${cls} { transform: ${v}; }`)).join('');
  const box = (cls, inner) => `<g class="${cls}">${inner}</g>`;

  const base = (id) => {
    let s = `
    .sc-${id} .pop, .sc-${id} .pulse, .sc-${id} .ring, .sc-${id} .fb { transform-box: fill-box; transform-origin: center; }
    .sc-${id} .draw { stroke-dasharray: 1; stroke-dashoffset: 1; }
    .sc-${id} .ring { opacity: 0; }
    @keyframes ${id}-pop { 0% { opacity: 0; transform: scale(.3); } 70% { opacity: 1; transform: scale(1.12); } 100% { opacity: 1; transform: scale(1); } }
    @keyframes ${id}-fin { from { opacity: 0; } to { opacity: 1; } }
    @keyframes ${id}-fout { from { opacity: 1; } to { opacity: 0; } }
    @keyframes ${id}-rise { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
    @keyframes ${id}-drop { from { opacity: 0; transform: translateY(-46px); } to { opacity: 1; transform: none; } }
    @keyframes ${id}-pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.14); } }
    @keyframes ${id}-beat { 0%, 100% { transform: scale(1); } 30% { transform: scale(.9); } }
    @keyframes ${id}-flash { 0% { opacity: 0; } 20% { opacity: 1; } 40% { opacity: .25; } 60% { opacity: 1; } 80% { opacity: .25; } 100% { opacity: 1; } }
    @keyframes ${id}-ring { 0% { opacity: .9; transform: scale(1); } 100% { opacity: 0; transform: scale(1.6); } }
    @keyframes ${id}-drawk { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
    `;
    for (let n = 1; n <= 12; n++) s += `@keyframes ${id}-fl${n} { from { stroke-dashoffset: 0; } to { stroke-dashoffset: -${f(100 / n)}; } }`;
    for (let n = 1; n <= 5; n++) s += `
    .on${n} .sc-${id} .pop${n} { animation: ${id}-pop .5s ease-out both; }
    .on${n} .sc-${id} .fin${n} { animation: ${id}-fin .6s ease-out both; }
    .on${n} .sc-${id} .fout${n} { animation: ${id}-fout .6s ease-out both; }
    .on${n} .sc-${id} .rise${n} { animation: ${id}-rise .5s ease-out both; }
    .on${n} .sc-${id} .drop${n} { animation: ${id}-drop .6s ease-out both; }
    .on${n} .sc-${id} .pulse${n} { animation: ${id}-pulse .7s ease-in-out .3s 2; }
    .on${n} .sc-${id} .flash${n} { animation: ${id}-flash 1.4s ease-in-out both; }
    .on${n} .sc-${id} .ring${n} { animation: ${id}-ring 1.1s ease-out .3s 2; }
    .on${n} .sc-${id} .draw${n} { animation: ${id}-drawk 1.2s ease-in-out .2s both; }`;
    return s;
  };

  // ── 공통 모양 ──
  const hexPts = (cx, cy, r) => Array.from({ length: 6 }, (_, k) => { const a = Math.PI / 6 + (k * Math.PI) / 3; return `${f(cx + r * Math.cos(a))},${f(cy + r * Math.sin(a))}`; }).join(' ');
  const hex = (cx, cy, r = 16, fill = C.yellow, stroke = C.orange) => `<polygon points="${hexPts(cx, cy, r)}" fill="${fill}" stroke="${stroke}" stroke-width="2.5" stroke-linejoin="round"/>`;
  const BEAD = [C.orange, C.blue, C.purple, C.green, C.red, C.yellow];
  const bead = (cx, cy, k, r = 11) => `<circle cx="${f(cx)}" cy="${f(cy)}" r="${r}" fill="${BEAD[k % BEAD.length]}" stroke="white" stroke-width="2.5"/>`;
  const leafPath = (x1, y1, x2, y2, wd) => {
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy), nx = -dy / L, ny = dx / L;
    return `M${f(x1)} ${f(y1)} Q${f(mx + nx * wd)} ${f(my + ny * wd)} ${f(x2)} ${f(y2)} Q${f(mx - nx * wd)} ${f(my - ny * wd)} ${f(x1)} ${f(y1)} Z`;
  };
  const leaf = (x1, y1, x2, y2, wd, fill = C.mint, stroke = C.green) => `<path d="${leafPath(x1, y1, x2, y2, wd)}" fill="${fill}" stroke="${stroke}" stroke-width="3"/><path d="M${x1} ${y1} L${x2} ${y2}" stroke="${stroke}" stroke-width="2" opacity=".6"/>`;
  const sun = (cx, cy, r = 26) => Array.from({ length: 8 }, (_, k) => { const a = (k * Math.PI) / 4; return `<path d="M${f(cx + Math.cos(a) * (r + 6))} ${f(cy + Math.sin(a) * (r + 6))} L${f(cx + Math.cos(a) * (r + 16))} ${f(cy + Math.sin(a) * (r + 16))}" stroke="${C.orange}" stroke-width="4" stroke-linecap="round"/>`; }).join('') + `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${C.yellow}" stroke="${C.orange}" stroke-width="3"/>`;
  const moon = (cx, cy, r = 24) => `<path d="M${cx} ${cy - r} A${r} ${r} 0 0 0 ${cx} ${cy + r} A${f(r * 0.55)} ${r} 0 0 1 ${cx} ${cy - r} Z" fill="${C.yellow}" stroke="${C.orange}" stroke-width="3" stroke-linejoin="round"/>`;
  const star = (cx, cy, r = 14, color = C.yellow) => `<path d="${Array.from({ length: 10 }, (_, k) => { const a = -Math.PI / 2 + (k * Math.PI) / 5, rr = k % 2 ? r * 0.45 : r; return `${k ? 'L' : 'M'}${f(cx + rr * Math.cos(a))} ${f(cy + rr * Math.sin(a))}`; }).join(' ')} Z" fill="${color}" stroke="${C.orange}" stroke-width="2" stroke-linejoin="round"/>`;
  const pot = (cx, by) => `<path d="M${cx - 40} ${by - 46} H${cx + 40} L${cx + 30} ${by} H${cx - 30} Z" fill="${C.peach}" stroke="${C.orange}" stroke-width="3" stroke-linejoin="round"/>`;
  const sprout = (cx, by, h = 120) => `<path d="M${cx} ${by} V${by - h}" stroke="${C.green}" stroke-width="5" stroke-linecap="round"/>` + leaf(cx, by - h * 0.55, cx - 62, by - h * 0.8, 18) + leaf(cx, by - h * 0.8, cx + 60, by - h * 1.02, 18) + leaf(cx, by - h, cx - 20, by - h - 40, 12);
  const cross = (cx, cy, r = 16, color = C.red) => `<path d="M${cx - r} ${cy - r} L${cx + r} ${cy + r} M${cx + r} ${cy - r} L${cx - r} ${cy + r}" stroke="${color}" stroke-width="6" stroke-linecap="round"/>`;
  const okMark = (cx, cy, r = 16, color = C.green) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${color}" stroke-width="5"/>`;

  // ════ Ⅴ 식물과 에너지 ════

  // ── 광합성: 빛을 받은 잎이 물과 이산화 탄소로 포도당을 만들고 산소를 내보낸다 ──
  (function () {
    const id = 't82-s5-gh';
    let css = base(id);
    const LP = leafPath(170, 262, 500, 140, 95);
    let body = sun(64, 62) + `<path d="M120 300 L170 262" stroke="${C.green}" stroke-width="6" stroke-linecap="round"/><path d="${LP}" fill="${C.mint}" stroke="${C.green}" stroke-width="3.5"/><path d="M170 262 L500 140" stroke="${C.green}" stroke-width="2.5" opacity=".6"/>`;
    // 칸 1: 빛, 물, 이산화 탄소가 들어온다
    body += shown(1, flow(id, 'M100 86 L250 170', C.orange, { n: 3, dur: 1.4, w: 9, trail: true }) + flow(id, 'M112 66 L330 146', C.orange, { n: 3, dur: 1.6, w: 9, trail: true }));
    body += shown(1, flow(id, 'M56 350 L120 300 L170 262 L300 214', C.blue, { n: 4, dur: 2.2 })) + at(1, 'pop', tag(40, 286, '물', COLD), 0.5);
    body += shown(1, flow(id, 'M372 54 L360 160', C.muted, { n: 3, dur: 1.6 }) + flow(id, 'M440 54 L420 150', C.muted, { n: 3, dur: 1.8 })) + at(1, 'pop', tag(400, 30, '이산화 탄소', GRAY), 0.9);
    // 칸 2: 포도당이 생기고 산소가 나간다
    body += at(2, 'pop', hex(300, 206, 20) + tag(300, 248, '포도당', SUN, { size: 18 }), 0.3);
    body += shown(2, flow(id, 'M460 190 L600 240', C.purple, { n: 3, dur: 1.6 }), 0) + at(2, 'pop', tag(590, 276, '산소', LIL), 0.9);
    // 칸 3: 식으로 묶는다
    body += at(3, 'rise', `<rect x="150" y="296" width="476" height="54" rx="12" fill="white" stroke="${C.green}" stroke-width="2.5"/>` + text(214, 336, '이산화 탄소', { size: 19 }) + text(284, 336, '+', { size: 20 }) + text(312, 336, '물', { size: 19 })
      + harrow(338, 330, 410, 330, C.orange, 4) + text(374, 320, '빛', { size: 18, color: C.orange }) + text(458, 336, '포도당', { size: 19 }) + text(508, 336, '+', { size: 20 }) + text(550, 336, '산소', { size: 19 }), 0.2);
    body += at(3, 'pop', tag(560, 36, '광합성', KEY, { size: 24 }), 0.8);
    put('8-2/과학/5/광합성', svg(id, body, css));
  })();

  // ── 엽록소: 잎 세포의 초록 알갱이(엽록체) 속 초록 색소가 빛을 빨아들인다. 흰 무늬 부분은 녹말이 안 생긴다 ──
  (function () {
    const id = 't82-s5-yr';
    let css = base(id);
    let first = leaf(30, 250, 180, 100, 60) + `<rect x="98" y="150" width="32" height="32" fill="none" stroke="${C.ink}" stroke-width="2.5"/>` + lead(130, 150, 220, 70) + lead(130, 182, 220, 250);
    first += `<rect x="220" y="70" width="190" height="180" rx="22" fill="#eef8f1" stroke="${C.green}" stroke-width="4"/>`;
    const grains = [[260, 110], [320, 98], [376, 118], [250, 170], [370, 182], [270, 224], [334, 226], [312, 160]];
    grains.forEach(([x, y], k) => { first += g(`pop pop1`, `<ellipse cx="${x}" cy="${y}" rx="20" ry="11" fill="${C.green}" fill-opacity=".85"/>`, f(0.3 + k * 0.1)); });
    first += at(1, 'pop', lead(376, 118, 470, 60) + tag(520, 56, '엽록체', OK), 1.3);
    let body = `<g class="h3">${first}</g>`;
    // 칸 2: 엽록체 하나를 크게 — 빛이 들어가 사라진다
    let big = lead(394, 118, 446, 170) + lead(394, 120, 470, 270) + `<ellipse cx="530" cy="222" rx="90" ry="54" fill="${C.green}" fill-opacity=".85" stroke="${C.green}" stroke-width="3"/>`;
    [490, 530, 570].forEach((x) => { big += `<path d="M${x - 16} 210 h32 M${x - 16} 222 h32 M${x - 16} 234 h32" stroke="white" stroke-width="3" opacity=".6"/>`; });
    big += ['M470 92 L500 200', 'M540 92 L540 196', 'M610 92 L576 200'].map((d) => `<path d="${d}" stroke="${C.orange}" stroke-width="3" opacity=".35"/>`).join('') + harrow(470, 92, 476, 114, C.orange, 3) + harrow(540, 92, 540, 114, C.orange, 3) + harrow(610, 92, 604, 114, C.orange, 3);
    body += `<g class="b2 h3">${big}${flow(id, 'M470 92 L500 200', C.orange, { n: 3, dur: 1.2, w: 9 })}${flow(id, 'M540 92 L540 196', C.orange, { n: 3, dur: 1.4, w: 9 })}${flow(id, 'M610 92 L576 200', C.orange, { n: 3, dur: 1.3, w: 9 })}</g>`;
    body += `<g class="b2 h3">${g('pulse pulse2', `<ellipse cx="530" cy="222" rx="90" ry="54" fill="none" stroke="${C.yellow}" stroke-width="5"/>`, 0.6)}</g>`;
    body += `<g class="b2 h3">${g('pop pop2', tag(530, 312, '초록 색소', OK), 1)}</g>`;
    // 칸 3: 흰 무늬 잎에 빛을 쬔 뒤 아이오딘 반응
    const OUT = leafPath(60, 230, 380, 150, 110), IN = leafPath(110, 220, 330, 165, 52);
    let v = `<path d="M30 250 L60 230" stroke="${C.green}" stroke-width="6" stroke-linecap="round"/><path d="${OUT}" fill="white" stroke="${C.muted}" stroke-width="3.5"/><path d="${IN}" fill="${C.green}" fill-opacity=".8"/>`;
    v += g('fin fin3', `<path d="${IN}" fill="${C.purple}"/>`, 1.2) + `<path d="${OUT}" fill="none" stroke="${C.muted}" stroke-width="3.5"/>`;
    v += g('drop drop3', `<path d="M236 70 V112 M224 70 H248" stroke="${C.ink}" stroke-width="5" stroke-linecap="round"/><path d="M236 118 q-7 10 0 14 q7 -4 0 -14" fill="${C.orange}"/>`, 0.3);
    body += shown(3, v);
    body += at(3, 'pop', lead(470, 116, 300, 190) + tag(530, 112, '청람색', LIL), 1.6) + at(3, 'pop', lead(470, 262, 340, 220) + tag(530, 266, '그대로', GRAY), 1.9);
    body += at(4, 'pop', tag(220, 320, '엽록소', KEY, { size: 24 }), 0.5) + glowPath(IN, 4, C.yellow, 0.2, 6);
    put('8-2/과학/5/엽록소', svg(id, body, css));
  })();

  // ── 빛에너지: 빛을 받은 식물은 포도당을 만들고, 어두운 곳의 식물은 못 만든다 ──
  (function () {
    const id = 't82-s5-bit';
    let css = base(id);
    let body = sun(70, 64) + pot(200, 330) + sprout(200, 284, 130);
    body += shown(1, flow(id, 'M100 92 L150 168', C.orange, { n: 3, dur: 1.2, w: 10, trail: true }) + flow(id, 'M110 76 L240 152', C.orange, { n: 3, dur: 1.4, w: 10, trail: true }) + flow(id, 'M96 100 L176 216', C.orange, { n: 3, dur: 1.3, w: 10, trail: true }));
    body += at(1, 'pop', tag(70, 140, '빛', SUN), 0.6);
    // 칸 2: 별(에너지)이 잎에 들어가 포도당이 생긴다
    body += at(2, 'pop', star(250, 130, 14), 0.1) + at(2, 'pop', star(146, 182, 12), 0.3);
    body += at(2, 'pop', hex(290, 210, 20) + tag(290, 252, '포도당', SUN, { size: 18 }), 0.9);
    // 칸 3: 어두운 상자 속 식물
    body += at(3, 'fin', `<rect x="380" y="70" width="230" height="276" rx="14" fill="${C.muted}" fill-opacity=".45" stroke="${C.ink}" stroke-width="4"/>` + pot(495, 330) + sprout(495, 284, 130) + `<rect x="380" y="70" width="230" height="276" rx="14" fill="${C.ink}" fill-opacity=".18"/>`, 0)
      + at(3, 'pop', hex(560, 120, 18, 'white', C.muted) + cross(560, 120, 18), 0.8) + at(3, 'pop', tag(495, 46, '빛 없음', GRAY), 0.5);
    body += at(3, 'pop', tag(200, 36, '빛에너지', KEY, { size: 24 }), 1.3);
    put('8-2/과학/5/빛에너지', svg(id, body, css));
  })();

  // ── 광합성산물: 낮에 잎에 녹말로 쌓였다가, 밤에 설탕으로 바뀌어 체관으로 뿌리·열매에 옮겨져 저장된다 ──
  (function () {
    const id = 't82-s5-gs';
    let css = base(id);
    let body = `<rect x="0" y="252" width="640" height="108" fill="${C.peach}" fill-opacity=".55"/><path d="M0 252 H640" stroke="${C.orange}" stroke-width="3"/>`;
    body += `<path d="M300 252 V70 M300 200 Q350 190 400 210" stroke="${C.green}" stroke-width="7" stroke-linecap="round" fill="none"/>`;
    body += leaf(300, 120, 160, 96, 34) + leaf(300, 150, 440, 122, 34) + leaf(300, 72, 270, 30, 14);
    body += `<path d="M400 210 V222" stroke="${C.green}" stroke-width="4"/><circle cx="400" cy="244" r="22" fill="${C.peach}" stroke="${C.red}" stroke-width="3"/>`;
    body += `<path d="M300 252 Q300 268 300 272 M300 330 Q310 348 318 352" stroke="${C.orange}" stroke-width="4" fill="none"/><ellipse cx="300" cy="302" rx="30" ry="32" fill="${C.lilac}" stroke="${C.purple}" stroke-width="3"/>`;
    body += `<g class="h2">${sun(60, 54)}</g><g class="b2">${g('fin fin2', moon(60, 54), 0)}</g>`;
    // 칸 1: 잎에 녹말이 쌓인다
    [[200, 102], [222, 106], [244, 110], [370, 132], [392, 136]].forEach(([x, y], k) => { body += `<g class="b1 h3">${g('pop pop1', hex(x, y, 10), f(0.4 + k * 0.15))}</g>`; });
    body += at(1, 'pop', lead(200, 90, 150, 50) + tag(130, 44, '녹말', SUN, { size: 18 }), 1.3);
    // 칸 2: 설탕이 되어 뿌리·열매로
    body += shown(2, flow(id, 'M200 104 L300 120 V296', C.orange, { n: 5, dur: 2.4, w: 9 }) + flow(id, 'M392 134 L300 150 V200 Q350 190 400 210 V236', C.orange, { n: 4, dur: 2.2, w: 9 }));
    body += at(2, 'pop', lead(196, 214, 294, 214) + tag(160, 214, '설탕', SUN, { size: 18 }), 1);
    // 칸 3: 뿌리와 열매에 저장
    body += at(3, 'fin', `<ellipse cx="300" cy="302" rx="30" ry="32" fill="${C.purple}" fill-opacity=".45"/>` + hex(290, 296, 8) + hex(308, 310, 8), 0.2) + ring(300, 302, 36, 3, C.purple, 0.2) + ring(400, 244, 26, 3, C.red, 0.5);
    body += at(3, 'pop', lead(332, 306, 420, 316) + tag(470, 316, '녹말', SUN, { size: 18 }), 0.6);
    body += at(3, 'pop', tag(150, 300, '광합성산물', KEY, { size: 22 }), 1.2);
    put('8-2/과학/5/광합성산물', svg(id, body, css));
  })();

  // ── 포도당: 광합성으로 처음 생기는 단 양분 → 녹말로 이어져 쌓이고, 세포에서 분해되어 에너지 ──
  (function () {
    const id = 't82-s5-pd';
    let css = base(id);
    let body = '';
    body += at(1, 'pop', tag(96, 70, '이산화 탄소', GRAY), 0.1) + at(1, 'pop', tag(96, 170, '물', COLD), 0.3);
    body += at(1, 'fin', harrow(172, 80, 248, 112, C.muted, 4) + harrow(130, 166, 248, 136, C.muted, 4) + sun(226, 186, 9) + text(256, 193, '빛', { size: 18, color: C.orange }), 0.6);
    body += at(1, 'pop', hex(290, 124, 36) + text(290, 131, '포도당', { size: 18 }), 1.1);
    // 칸 2: 여러 개가 이어져 녹말
    let chain = `<path d="M412 124 H592" stroke="${C.orange}" stroke-width="4"/>`;
    [412, 448, 484, 520, 556, 592].forEach((x) => { chain += hex(x, 124, 16); });
    body += at(2, 'fin', harrow(334, 124, 384, 124, C.muted, 4), 0.1) + at(2, 'rise', chain, 0.4) + at(2, 'pop', tag(502, 176, '녹말', SUN, { size: 18 }), 1.1);
    // 칸 3: 세포에서 분해되어 에너지
    body += `<g class="b3"><circle cx="320" cy="282" r="62" fill="#eef8f1" stroke="${C.green}" stroke-width="4"/>${text(320, 330, '세포', { size: 18, color: C.green })}</g>`;
    body += `<g class="b3">${box('hv', hex(290, 124, 22))}</g>`;
    css += steps(id, 'hv', ['translate(0px,0px)', null, null, 'translate(30px,158px)'], 0.9, 0.2);
    body += at(3, 'pop', star(250, 250, 13) + star(392, 252, 13) + star(320, 214, 12), 1.2) + at(3, 'pop', tag(480, 300, '에너지', SUN), 1.4);
    body += at(3, 'pop', tag(140, 300, '포도당', KEY, { size: 24 }), 1.8);
    put('8-2/과학/5/포도당', svg(id, body, css));
  })();

  // ── 광합성량: 빛의 세기·이산화 탄소 농도는 늘다가 멈추고, 온도는 늘다가 줄어든다 ──
  (function () {
    const id = 't82-s5-ghr';
    let css = base(id);
    let body = '';
    const P = [[30, '빛의 세기'], [240, '이산화 탄소 농도'], [450, '온도']];
    const curves = [
      (x0) => `M${x0 + 10} 290 C${x0 + 60} 200 ${x0 + 80} 160 ${x0 + 110} 150 L${x0 + 160} 150`,
      (x0) => `M${x0 + 10} 270 C${x0 + 60} 196 ${x0 + 80} 160 ${x0 + 110} 150 L${x0 + 160} 150`,
      (x0) => `M${x0 + 10} 286 C${x0 + 60} 240 ${x0 + 90} 140 ${x0 + 118} 136 C${x0 + 140} 136 ${x0 + 150} 220 ${x0 + 162} 286`
    ];
    P.forEach(([x0, name], k) => {
      body += `<path d="M${x0 + 10} 96 V290 H${x0 + 172}" fill="none" stroke="${C.ink}" stroke-width="3"/>` + text(x0 + 10, 84, '광합성량', { size: 18, anchor: 'start' }) + text(x0 + 94, 322, name, { size: 18 });
      body += drawPath(curves[k](x0), k + 1, k === 2 ? C.red : C.green, 5, 0.2);
    });
    body += glowRect(32, 62, 92, 32, 4, C.red, 0, 10) + glowRect(242, 62, 92, 32, 4, C.red, 0.1, 10) + glowRect(452, 62, 92, 32, 4, C.red, 0.2, 10);
    body += at(4, 'pop', tag(320, 30, '광합성량', KEY, { size: 22 }), 0.6);
    put('8-2/과학/5/광합성량', svg(id, body, css));
  })();

  // ── 물관·체관: 줄기 속 두 길과 줄기 단면의 관다발(물관은 안쪽, 체관은 바깥쪽) ──
  const plantTubes = (id, which) => {
    let css = base(id);
    const W = which === 'water';
    let body = `<rect x="0" y="268" width="330" height="92" fill="${C.peach}" fill-opacity=".55"/><path d="M0 268 H330" stroke="${C.orange}" stroke-width="3"/>`;
    body += `<path d="M200 268 L150 336 M200 268 L200 350 M200 268 L252 334" stroke="${C.green}" stroke-width="6" stroke-linecap="round"/>`;
    body += `<rect x="184" y="64" width="32" height="206" rx="10" fill="${C.mint}" stroke="${C.green}" stroke-width="3"/>`;
    body += leaf(190, 112, 60, 84, 30) + leaf(210, 146, 320, 112, 30) + leaf(200, 66, 196, 22, 12);
    const wc = W ? C.blue : C.line, sc = W ? C.line : C.orange;
    const kc = W ? C.blue : C.orange, kx = W ? 193 : 207;
    body += `<path d="M193 268 V70" stroke="${wc}" stroke-width="5" fill="none"/><path d="M207 268 V70" stroke="${sc}" stroke-width="5" fill="none"/><path d="M${kx} 112 L82 88 M${kx} 146 L300 117" stroke="${kc}" stroke-width="4" fill="none"/>`;
    // 칸 1: 흐름
    if (W) {
      body += shown(1, flow(id, 'M152 334 L193 270 V112 L84 89', C.blue, { n: 5, dur: 2.6 }) + flow(id, 'M250 334 L193 270 V146 L296 118', C.blue, { n: 5, dur: 2.4 }));
      body += at(1, 'pop', tag(272, 316, '물', COLD), 0.6) + at(1, 'fin', harrow(110, 300, 110, 220, C.blue, 4), 0.6);
    } else {
      body += shown(1, flow(id, 'M84 89 L207 112 V266 L250 332', C.orange, { n: 5, dur: 2.6, w: 10 }) + flow(id, 'M296 118 L207 146 V74', C.orange, { n: 3, dur: 1.6, w: 10 }));
      body += at(1, 'pop', tag(76, 140, '양분', SUN), 0.6) + at(1, 'fin', harrow(140, 210, 140, 290, C.orange, 4) + harrow(250, 90, 250, 40, C.orange, 4), 0.6);
    }
    // 칸 2: 단면
    let sec = `<rect x="182" y="176" width="36" height="16" fill="none" stroke="${C.ink}" stroke-width="2.5"/>` + lead(218, 176, 400, 82) + lead(218, 192, 400, 268);
    sec += `<circle cx="490" cy="175" r="108" fill="#eef8f1" stroke="${C.green}" stroke-width="4"/>`;
    let inner = '', outer = '';
    for (let k = 0; k < 8; k++) {
      const a = (k * Math.PI) / 4 + Math.PI / 8, cx = 490 + Math.cos(a) * 66, cy = 175 + Math.sin(a) * 66;
      const ox = 490 + Math.cos(a) * 82, oy = 175 + Math.sin(a) * 82;
      inner += `<circle cx="${f(cx)}" cy="${f(cy)}" r="11" fill="${W ? C.blue : C.sky}" stroke="${C.blue}" stroke-width="2"/>`;
      outer += `<ellipse cx="${f(ox)}" cy="${f(oy)}" rx="12" ry="7" transform="rotate(${f((a * 180) / Math.PI + 90)} ${f(ox)} ${f(oy)})" fill="${W ? C.peach : C.orange}" stroke="${C.orange}" stroke-width="2"/>`;
    }
    sec += inner + outer;
    body += at(2, 'fin', sec, 0.1);
    if (W) body += at(2, 'fin', `<circle cx="490" cy="175" r="66" fill="none" stroke="${C.blue}" stroke-width="22" stroke-opacity=".35"/>`, 1.0) + at(2, 'pop', lead(490, 306, 514, 240) + tag(490, 322, '안쪽', COLD), 1.3);
    else body += at(2, 'fin', `<circle cx="490" cy="175" r="83" fill="none" stroke="${C.orange}" stroke-width="18" stroke-opacity=".35"/>`, 1.0) + at(2, 'pop', lead(490, 306, 520, 256) + tag(490, 322, '바깥쪽', SUN), 1.3);
    body += at(3, 'pop', tag(96, 36, W ? '물관' : '체관', KEY, { size: 24 }), 0.5) + glowPath(W ? 'M193 266 V72' : 'M207 266 V72', 3, W ? C.blue : C.orange, 0.1, 9);
    return { body, css };
  };
  (function () { const { body, css } = plantTubes('t82-s5-mg', 'water'); put('8-2/과학/5/물관', svg('t82-s5-mg', body, css)); })();
  (function () { const { body, css } = plantTubes('t82-s5-cg', 'food'); put('8-2/과학/5/체관', svg('t82-s5-cg', body, css)); })();

  // ── 호흡(식물): 세포가 포도당을 산소로 분해 → 이산화 탄소·물·에너지. 낮과 밤 모두 ──
  (function () {
    const id = 't82-s5-hh';
    let css = base(id);
    let body = `<circle cx="190" cy="180" r="74" fill="#eef8f1" stroke="${C.green}" stroke-width="4"/>` + text(190, 146, '세포', { size: 18, color: C.green });
    body += at(1, 'pop', tag(110, 36, '포도당', SUN), 0.1) + at(1, 'pop', tag(270, 36, '산소', LIL), 0.3);
    body += at(1, 'fin', harrow(118, 58, 150, 118, C.orange, 4) + harrow(262, 58, 230, 118, C.purple, 4), 0.5);
    body += at(1, 'pop', star(156, 184, 12) + star(224, 184, 12), 1.1) + at(1, 'pop', tag(190, 222, '에너지', SUN, { size: 18 }), 1.3);
    body += at(1, 'fin', harrow(150, 244, 118, 300, C.muted, 4) + harrow(230, 244, 262, 300, C.blue, 4), 1.5);
    body += at(1, 'pop', tag(100, 326, '이산화 탄소', GRAY), 1.7) + at(1, 'pop', tag(280, 326, '물', COLD), 1.8);
    // 칸 2: 낮·밤 표
    body += `<g class="b2"><path d="M386 130 H624 M386 210 H624 M480 70 V290 M556 70 V290" stroke="${C.line}" stroke-width="2.5"/>${sun(518, 98, 14)}${moon(592, 98, 16)}${text(432, 178, '광합성', { size: 19 })}${text(432, 258, '호흡', { size: 19 })}</g>`;
    body += at(2, 'pop', okMark(518, 170), 0.5) + at(2, 'pop', cross(592, 170, 14), 0.8) + at(2, 'pop', okMark(518, 250), 1.1) + at(2, 'pop', okMark(592, 250), 1.4);
    body += glowRect(392, 220, 228, 62, 3, C.red, 0.2, 12) + at(3, 'pop', tag(506, 326, '호흡', KEY, { size: 24 }), 0.7);
    put('8-2/과학/5/호흡', svg(id, body, css));
  })();

  // ════ Ⅵ 동물과 에너지 — 소화 ════
  // 소화관(정면, 몸의 오른쪽이 화면 왼쪽): 간은 화면 왼쪽, 위는 오른쪽. 원점 기준 좌표, 무늬는 TR(dx, dy, s)로 옮긴다.
  const SI = 'M150 226 C110 230 112 248 150 248 S220 254 188 266 S106 276 138 286 S214 296 170 304 Q122 310 104 300';
  const LI = 'M104 300 Q92 300 92 288 V236 Q92 226 102 226 H228 Q238 226 238 236 V300 Q238 316 220 318 H172 V340';
  const ORG = {
    입: (st) => `<ellipse cx="150" cy="34" rx="20" ry="8" ${st}/>`,
    식도: (st) => `<path d="M150 42 V100 Q152 112 168 116" fill="none" ${st}/>`,
    위: (st) => `<ellipse cx="202" cy="140" rx="44" ry="30" transform="rotate(-24 202 140)" ${st}/>`,
    간: (st) => `<path d="M58 114 Q108 86 170 104 Q166 140 120 152 Q76 160 58 142 Z" ${st}/>`,
    쓸개: (st) => `<ellipse cx="114" cy="166" rx="13" ry="10" ${st}/>`,
    이자: (st) => `<path d="M156 200 Q194 182 242 188 Q234 204 192 208 Q168 210 156 206 Z" ${st}/>`,
    십이지장: (st) => `<path d="M168 166 Q150 180 146 196 Q142 212 150 226" fill="none" ${st}/>`,
    작은창자: (st) => `<path d="${SI}" fill="none" ${st}/>`,
    큰창자: (st) => `<path d="${LI}" fill="none" ${st}/>`
  };
  const tube = (k) => ORG[k](`stroke="${C.orange}" stroke-width="15" stroke-linecap="round" stroke-linejoin="round"`) + ORG[k](`stroke="${C.peach}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"`);
  const tractBody = () => tube('큰창자') + tube('작은창자') + tube('십이지장') + tube('식도')
    + ORG.위(`fill="${C.peach}" stroke="${C.orange}" stroke-width="3"`) + ORG.간(`fill="#f3dccd" stroke="${C.red}" stroke-width="3"`)
    + ORG.쓸개(`fill="${C.mint}" stroke="${C.green}" stroke-width="3"`) + ORG.이자(`fill="#f8e9b8" stroke="${C.orange}" stroke-width="3"`)
    + `<path d="M118 175 Q126 194 146 202" fill="none" stroke="${C.green}" stroke-width="3"/><path d="M172 203 H150" stroke="${C.orange}" stroke-width="3"/>`
    + ORG.입(`fill="${C.peach}" stroke="${C.red}" stroke-width="3"`);
  // 기관을 노랗게 덮어 가리킨다(칸 n, s 초 뒤)
  const hilite = (k, n, s = 0, hide, W = ET) => {
    const tubeLike = ['식도', '십이지장', '작은창자', '큰창자'].includes(k);
    const st = tubeLike ? `stroke="${C.yellow}" stroke-width="17" stroke-opacity=".9" stroke-linecap="round" stroke-linejoin="round"` : `fill="${C.yellow}" fill-opacity=".75" stroke="${C.red}" stroke-width="4"`;
    return `<g class="b${n}${hide ? ' h' + hide : ''}">${g(`fin fin${n}`, W.g(ORG[k](st)), s)}</g>`;
  };
  const TR = (dx, dy, s) => ({ g: (inner) => `<g transform="translate(${dx} ${dy}) scale(${s})">${inner}</g>`, p: (x, y) => [f(dx + s * x), f(dy + s * y)] });
  const ET = TR(-24, 12, 0.92);
  const FOOD = 'M150 34 L150 102 Q152 114 172 120 Q214 130 210 150 Q204 168 168 166 Q150 180 146 196 Q142 212 150 226 C110 230 112 248 150 248 S220 254 188 266 S106 276 138 286 S214 296 170 304 Q122 310 104 300 Q92 300 92 288 V236 Q92 226 102 226 H228 Q238 226 238 236 V300 Q238 316 220 318 H172 V340';
  const BILE = 'M120 132 L116 160 Q126 192 146 202';
  const PANC = 'M214 194 L150 204';
  const scissors = (cx, cy, s = 1, rot = 0) => `<g transform="translate(${cx} ${cy}) rotate(${rot}) scale(${s})"><path d="M-14 -14 L22 10 M-14 14 L22 -10" stroke="${C.ink}" stroke-width="5" stroke-linecap="round"/><circle cx="-21" cy="-18" r="8" fill="white" stroke="${C.ink}" stroke-width="4"/><circle cx="-21" cy="18" r="8" fill="white" stroke="${C.ink}" stroke-width="4"/></g>`;
  const snip = (cx, cy, n, s = 0, sc = 1, rot = 0) => `<g class="b${n}"><g class="fb snp snp${n}"${dl(s)}>${scissors(cx, cy, sc, rot)}</g></g>`;
  const snipCss = (id) => `@keyframes ${id}-snp { 0% { opacity: 0; transform: scale(.4); } 30% { opacity: 1; transform: scale(1.1); } 50% { transform: scale(.9) rotate(-8deg); } 70% { transform: scale(1.05); } 100% { opacity: 1; transform: none; } }`
    + [1, 2, 3, 4].map((n) => `.on${n} .sc-${id} .snp${n} { animation: ${id}-snp 1s ease-out both; }`).join('');
  // 조각(여러 알갱이)을 칸마다 옮긴다: moves[k] = [dx, dy] 또는 null
  const piece = (id, cls, inner, moves, sec = 0.9, delay = 0.9) => ({ body: `<g class="pz-${cls}">${inner}</g>`, css: steps(id, `pz-${cls}`, moves.map((m, i) => (m == null ? (i ? null : 'translate(0px,0px)') : `translate(${m[0]}px,${m[1]}px)`)), sec, delay) });
  const link = (x1, y1, x2, y2, color = C.muted) => `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="${color}" stroke-width="4"/>`;
  // 알갱이 줄(구슬·육각형)을 groups 크기대로 나눠 조각마다 옮긴다
  const chainPieces = (id, key, xs, y, groups, moves, unit, linkColor = C.muted) => {
    let body = '', css = '', k = 0;
    groups.forEach((len, gi) => {
      let inner = '';
      for (let j = 0; j < len - 1; j++) inner += link(xs[k + j], y, xs[k + j + 1], y, linkColor);
      for (let j = 0; j < len; j++) inner += unit(xs[k + j], y, k + j);
      const pc = piece(id, `${key}${gi}`, inner, moves.map((m) => (m == null ? null : m[gi])));
      body += pc.body; css += pc.css; k += len;
    });
    // 조각 사이의 끊길 이음은 칸 cutAt 부터 사라진다
    return { body, css };
  };
  const cutLinks = (xs, y, groups, hideAt, color = C.muted) => {
    let k = 0, s = '';
    groups.slice(0, -1).forEach((len) => { k += len; s += `<g class="h${hideAt}">${link(xs[k - 1], y, xs[k], y, color)}</g>`; });
    return s;
  };

  // ── 소화계 ──
  (function () {
    const id = 't82-s6-shg';
    let css = base(id);
    const T = TR(170, 6, 1);
    let body = T.g(tractBody());
    body += shown(1, T.g(flow(id, FOOD, C.green, { n: 3, dur: 4.5, w: 12 })), 3);
    const L = (k, x, y, tx, ty, n, s, anchor) => at(n, 'fin', lead(...T.p(x, y), tx, ty) + text(tx + (anchor === 'end' ? -6 : 6), ty + 7, k, { size: 19, anchor }), s);
    body += L('입', 130, 34, 250, 34, 1, 0.1, 'end') + L('식도', 150, 76, 250, 86, 1, 0.3, 'end') + L('위', 236, 128, 470, 118, 1, 0.5, 'start')
      + L('작은창자', 186, 266, 470, 262, 1, 0.8, 'start') + L('큰창자', 238, 290, 470, 300, 1, 1.0, 'start') + L('항문', 172, 340, 250, 346, 1, 1.2, 'end');
    body += L('간', 70, 120, 200, 112, 2, 0.1, 'end') + L('쓸개', 104, 170, 200, 176, 2, 0.4, 'end') + L('이자', 236, 194, 470, 196, 2, 0.7, 'start');
    body += hilite('간', 2, 0, 0, T) + hilite('쓸개', 2, 0.3, 0, T) + hilite('이자', 2, 0.6, 0, T);
    body += shown(2, T.g(flow(id, BILE, C.green, { n: 3, dur: 1.6, w: 8 }) + flow(id, PANC, C.orange, { n: 2, dur: 1.2, w: 8 })));
    body += glowRect(132, 6, 424, 350, 3, C.green, 0.1, 18) + at(3, 'pop', tag(66, 40, '소화계', KEY, { size: 24 }), 0.6);
    put('8-2/과학/6/소화계', svg(id, body, css));
  })();

  // ── 소화효소: 큰 영양소는 벽을 못 지나고, 가위처럼 작게 잘린 뒤에 흡수된다 ──
  (function () {
    const id = 't82-s6-shh';
    let css = base(id) + snipCss(id);
    let body = `<rect x="460" y="20" width="20" height="320" rx="6" fill="${C.peach}" stroke="${C.orange}" stroke-width="3"/>`;
    for (let y = 46; y < 330; y += 42) body += `<rect x="456" y="${y}" width="28" height="12" fill="${C.paper}"/>`;
    body += text(575, 136, '몸속', { size: 18, color: C.muted });
    // 녹말 사슬(육각형)
    const xs1 = [70, 110, 150, 190, 230, 270];
    const r1 = chainPieces(id, 'a', xs1, 70, [1, 1, 1, 1, 1, 1], [null, null, xs1.map((x, k) => [f((k - 2.5) * 10), 0]), xs1.map((x, k) => [515 + 40 * (k % 3) - x, 55 + 38 * Math.floor(k / 3) - 70])], (x, y) => hex(x, y, 15), C.orange);
    body += cutLinks(xs1, 70, [1, 1, 1, 1, 1, 1], 2, C.orange) + r1.body; css += r1.css;
    // 단백질 사슬(구슬)
    const xs2 = [70, 104, 138, 172, 206, 240, 274];
    const r2 = chainPieces(id, 'b', xs2, 180, [1, 1, 1, 1, 1, 1, 1], [null, null, xs2.map((x, k) => [f((k - 3) * 10), 0]), xs2.map((x, k) => [(k < 4 ? 512 + 36 * k : 530 + 36 * (k - 4)) - x, (k < 4 ? 168 : 204) - 180])], (x, y, k) => bead(x, y, k, 12));
    body += cutLinks(xs2, 180, [1, 1, 1, 1, 1, 1, 1], 2) + r2.body; css += r2.css;
    // 지방: 받침 + 꼬리 셋. 가운데 꼬리는 받침에 붙은 채 간다
    const tail = (x, y) => `<path d="M${x} ${y} l14 -8 l14 8 l14 -8 l14 8 l14 -8 l14 8" fill="none" stroke="${C.orange}" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"/>`;
    const fg = piece(id, 'fg', `<rect x="70" y="258" width="14" height="70" rx="5" fill="${C.lilac}" stroke="${C.purple}" stroke-width="3"/>` + tail(84, 293), [null, null, null, [440, 0]]);
    body += fg.body; css += fg.css;
    [[84, 266, -18], [84, 320, 18]].forEach(([x, y, dy], k) => { const pc = piece(id, `t${k}`, tail(x, y), [null, null, [40, 0], [436, dy]]); body += pc.body; css += pc.css; });
    // 칸 1: 큰 채로 벽 앞에서 막힌다
    body += `<g class="b1 h2">${g('pop pop1', cross(436, 70, 13) + cross(436, 180, 13) + cross(436, 293, 13), 1)}</g>`;
    body += at(1, 'pop', tag(170, 30, '녹말', SUN, { size: 18 }), 0.3) + at(1, 'pop', tag(172, 140, '단백질', HOT, { size: 18 }), 0.5) + at(1, 'pop', tag(116, 232, '지방', LIL, { size: 18 }), 0.7);
    // 칸 2: 가위가 자른다(녹말 가위는 녹말만, 단백질 가위는 단백질만)
    body += snip(330, 70, 2, 0.1) + snip(330, 180, 2, 0.4) + snip(330, 293, 2, 0.7);
    // 칸 3: 작아진 알갱이가 벽을 지나간다
    body += at(3, 'pop', tag(150, 336, '소화효소', KEY, { size: 22 }), 1.2) + ring(330, 70, 30, 3, C.red, 0.2) + ring(330, 180, 30, 3, C.red, 0.4) + ring(330, 293, 30, 3, C.red, 0.6);
    put('8-2/과학/6/소화효소', svg(id, body, css));
  })();

  // ── 효소 한 가지씩: 왼쪽 소화관에서 나오는 곳을 가리키고, 오른쪽에서 영양소를 자른다 ──
  const enzymeBase = (id) => ET.g(tractBody());
  const elabel = (k, x, y, tx, ty, n, s = 0) => at(n, 'fin', lead(...ET.p(x, y), tx, ty) + tag(tx, ty, k, GRAY, { size: 18 }), s);

  // 아밀레이스: 녹말 사슬 → 엿당(두 개씩)
  (function () {
    const id = 't82-s6-am';
    let css = base(id) + snipCss(id);
    let body = enzymeBase(id);
    body += hilite('입', 2, 0.1) + elabel('침', 130, 34, 60, 64, 2, 0.3) + hilite('이자', 2, 1.0) + hilite('작은창자', 2, 1.2) + elabel('이자액', 230, 200, 240, 236, 2, 1.3) + elabel('작은창자', 120, 296, 70, 344, 2, 1.4) + at(2, 'fin', ET.g(flow(id, PANC, C.orange, { n: 2, dur: 1.2, w: 8 })), 1.3);
    const xs = [330, 374, 418, 462, 506, 550];
    const r = chainPieces(id, 'p', xs, 110, [2, 2, 2], [null, null, [[-36, 120], [0, 120], [36, 120]]], (x, y) => hex(x, y, 17), C.orange);
    body += cutLinks(xs, 110, [2, 2, 2], 2, C.orange) + r.body; css += r.css;
    body += `<g class="b1 h2">${g('pop pop1', tag(440, 56, '녹말', SUN), 0.4)}</g>`;
    body += snip(396, 170, 2, 0.1) + snip(484, 170, 2, 0.3);
    body += at(2, 'pop', tag(440, 290, '엿당', SUN), 1.9);
    body += at(3, 'pop', tag(440, 336, '아밀레이스', KEY, { size: 22 }), 0.5) + ring(440, 170, 64, 3, C.red, 0.2);
    put('8-2/과학/6/아밀레이스', svg(id, body, css));
  })();

  // 펩신: 위에서 단백질 사슬 → 짧은 조각
  (function () {
    const id = 't82-s6-ps';
    let css = base(id) + snipCss(id);
    let body = enzymeBase(id);
    body += hilite('위', 2, 0.1) + elabel('위액', 236, 120, 250, 70, 2, 0.4);
    const xs = [316, 352, 388, 424, 460, 496, 532, 568];
    const G = [3, 3, 2];
    const r = chainPieces(id, 'p', xs, 110, G, [null, null, [[-30, 120], [0, 120], [30, 120]]], (x, y, k) => bead(x, y, k, 13));
    body += cutLinks(xs, 110, G, 2) + r.body; css += r.css;
    body += `<g class="b1 h2">${g('pop pop1', tag(442, 56, '단백질', HOT), 0.4)}</g>`;
    body += snip(406, 172, 2, 0.1) + snip(514, 172, 2, 0.3);
    body += at(2, 'pop', tag(442, 290, '짧은 조각', HOT, { size: 18 }), 1.9);
    body += at(3, 'pop', tag(442, 336, '펩신', KEY, { size: 24 }), 0.5) + ring(460, 172, 70, 3, C.red, 0.2);
    put('8-2/과학/6/펩신', svg(id, body, css));
  })();

  // 트립신: 이자액이 작은창자로 나와 단백질 조각을 더 잘게
  (function () {
    const id = 't82-s6-tr';
    let css = base(id) + snipCss(id);
    let body = enzymeBase(id);
    body += hilite('이자', 2, 0.1) + hilite('작은창자', 2, 0.4) + elabel('이자액', 230, 200, 244, 274, 2, 0.5) + elabel('작은창자', 120, 296, 70, 344, 2, 0.6) + at(2, 'fin', ET.g(flow(id, PANC, C.orange, { n: 2, dur: 1.2, w: 8 })), 0.5);
    body += hilite('위', 1, 0.1, 2);
    const xs = [280, 316, 352, 412, 448, 484, 544, 580];
    const G = [2, 1, 2, 1, 1, 1];
    // 칸 1: 위에서 온 세 조각(3·3·2)이 떨어져 들어온다 — 같은 줄에서 조각 사이만 벌어져 있다
    const r = chainPieces(id, 'p', xs, 110, G, [null, null, [[-24, 120], [-6, 120], [-4, 120], [10, 120], [6, 120], [24, 120]]], (x, y, k) => bead(x, y, k, 13));
    body += `<g class="b1">${g('drop drop1', cutLinks(xs, 110, G, 2).replace(/<g class="h2">.*?<\/g>/g, '') + r.body, 0.2)}</g>`;
    // 같은 조각(3개) 안의 이음은 칸 2에 끊긴다
    body += `<g class="b1 h2">${g('drop drop1', link(316, 110, 352, 110) + link(448, 110, 484, 110) + link(544, 110, 580, 110), 0.2)}</g>`;
    body += `<g class="b1 h2">${g('pop pop1', tag(430, 56, '단백질 조각', HOT, { size: 18 }), 0.8)}</g>`;
    body += snip(334, 172, 2, 0.1) + snip(466, 172, 2, 0.3);
    body += at(2, 'pop', tag(430, 290, '더 짧은 조각', HOT, { size: 18 }), 1.9);
    css += r.css;
    body += at(3, 'pop', tag(430, 336, '트립신', KEY, { size: 24 }), 0.5) + ring(400, 172, 72, 3, C.red, 0.2);
    put('8-2/과학/6/트립신', svg(id, body, css));
  })();

  // 라이페이스: 지방(받침+꼬리 셋) → 지방산 둘 + 모노글리세리드
  const fatTail = (x, y) => `<path d="M${x} ${y} l16 -9 l16 9 l16 -9 l16 9 l16 -9 l16 9 l16 -9" fill="none" stroke="${C.orange}" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/>`;
  (function () {
    const id = 't82-s6-rp';
    let css = base(id) + snipCss(id);
    let body = enzymeBase(id);
    body += hilite('이자', 2, 0.1) + hilite('작은창자', 2, 0.4) + elabel('이자액', 230, 200, 240, 236, 2, 0.5) + elabel('작은창자', 120, 296, 70, 344, 2, 0.6) + at(2, 'fin', ET.g(flow(id, PANC, C.orange, { n: 2, dur: 1.2, w: 8 })), 0.5);
    body += `<rect x="470" y="70" width="18" height="120" rx="6" fill="${C.lilac}" stroke="${C.purple}" stroke-width="3"/>`;
    const ty = [88, 130, 172];
    ty.forEach((y, k) => {
      if (k === 1) { body += fatTail(488, y); return; }
      const pc = piece(id, `t${k}`, fatTail(488, y), [null, null, [10, k === 0 ? 162 : 128]], 0.9, 1.0);
      body += pc.body; css += pc.css;
    });
    body += `<g class="b1 h3">${g('pop pop1', tag(420, 40, '지방', LIL), 0.4)}</g>`;
    body += snip(502, 52, 2, 0.1, 0.8, 90) + snip(502, 208, 2, 0.3, 0.8, -90);
    body += at(3, 'pop', tag(398, 40, '모노글리세리드', LIL, { size: 18 }), 0.2) + at(3, 'pop', tag(410, 272, '지방산', SUN, { size: 18 }), 0.4);
    body += at(3, 'pop', tag(470, 338, '라이페이스', KEY, { size: 22 }), 0.8);
    put('8-2/과학/6/라이페이스', svg(id, body, css));
  })();

  // 쓸개즙: 간에서 만들어져 쓸개에 모였다가 작은창자로. 큰 지방 덩어리를 작은 방울로
  (function () {
    const id = 't82-s6-sg';
    let css = base(id) + snipCss(id);
    let body = enzymeBase(id);
    body += hilite('간', 1, 0.1) + elabel('간', 70, 120, 40, 74, 1, 0.3) + hilite('쓸개', 1, 0.8) + elabel('쓸개', 104, 172, 40, 208, 1, 1.0);
    body += at(1, 'fin', ET.g(flow(id, BILE, C.green, { n: 3, dur: 1.6, w: 9 })), 1.3);
    // 오른쪽: 큰 덩어리 → 작은 방울
    body += `<g class="h2"><circle cx="450" cy="170" r="62" fill="${C.yellow}" fill-opacity=".8" stroke="${C.orange}" stroke-width="3"/></g>`;
    body += `<g class="b1 h2">${g('pop pop1', tag(450, 270, '지방 덩어리', SUN, { size: 18 }), 1.6)}</g>`;
    const drops = [[-70, -60], [0, -84], [70, -60], [-92, 4], [92, 4], [-62, 70], [0, 92], [62, 70], [-24, -8], [28, 16], [0, -36], [-30, 36], [34, -32]];
    let dd = '';
    drops.forEach(([dx, dy], k) => {
      dd += `<g class="dp${k}"><circle cx="450" cy="170" r="${k > 7 ? 13 : 16}" fill="${C.yellow}" fill-opacity=".85" stroke="${C.orange}" stroke-width="2.5"/></g>`;
      css += steps(id, `dp${k}`, ['translate(0px,0px)', null, `translate(${dx}px,${dy}px)`], 0.9, 0.3);
    });
    body += `<g class="b2">${dd}</g>`;
    body += at(2, 'pop', tag(450, 300, '작은 방울', SUN, { size: 18 }), 1.3);
    body += snip(590, 90, 3, 0.2, 0.8) + at(3, 'pop', tag(580, 46, '라이페이스', GRAY, { size: 18 }), 0.5);
    body += at(3, 'fin', ET.g(flow(id, BILE, C.green, { n: 3, dur: 1.6, w: 9 })), 0) + at(3, 'pop', tag(300, 336, '쓸개즙', KEY, { size: 24 }), 0.9);
    put('8-2/과학/6/쓸개즙', svg(id, body, css));
  })();

  // 아미노산: 단백질 사슬 → 짧은 조각 → 낱낱의 구슬
  (function () {
    const id = 't82-s6-amn';
    let css = base(id) + snipCss(id);
    let body = '';
    const xs = [194, 230, 266, 302, 338, 374, 410, 446], y = 76;
    const G1 = [3, 3, 2];
    const mv2 = [-50, -50, -50, 0, 0, 0, 50, 50];
    const pos3 = xs.map((x, k) => 110 + 60 * k - x);
    // 이음: 같은 조각 안은 칸 2까지 따라가고 칸 3에 사라진다, 조각 사이는 칸 2에 사라진다(구슬보다 먼저 깐다)
    let k0 = 0;
    G1.forEach((len, gi) => {
      for (let j = 0; j < len - 1; j++) {
        const a = k0 + j;
        const pc = piece(id, `l${a}`, link(xs[a], y, xs[a + 1], y), [null, null, [mv2[a], 100]], 0.9, 0.9);
        body += `<g class="h3">${pc.body}</g>`; css += pc.css;
      }
      if (gi < G1.length - 1) body += `<g class="h2">${link(xs[k0 + len - 1], y, xs[k0 + len], y)}</g>`;
      k0 += len;
    });
    xs.forEach((x, k) => {
      const pc = piece(id, `b${k}`, bead(x, y, k, 14), [null, null, [mv2[k], 100], [pos3[k], 200]], 0.9, 0.9);
      body += pc.body; css += pc.css;
    });
    body += `<g class="b1 h2">${g('pop pop1', tag(560, 76, '단백질', HOT), 0.4)}</g>`;
    body += snip(255, 128, 2, 0.1, 0.8) + snip(413, 128, 2, 0.3, 0.8) + `<g class="b2 h3">${g('pop pop2', tag(110, 130, '펩신·트립신', GRAY, { size: 18 }), 0.6)}</g>`;
    body += snip(206, 228, 3, 0.1, 0.7) + snip(330, 228, 3, 0.25, 0.7) + snip(440, 228, 3, 0.4, 0.7) + at(3, 'pop', tag(320, 336, '아미노산', KEY, { size: 24 }), 1.3);
    put('8-2/과학/6/아미노산', svg(id, body, css));
  })();

  // 융털: 작은창자 안쪽 벽의 주름 위 손가락 모양 돌기. 속에 모세혈관과 암죽관
  (function () {
    const id = 't82-s6-yt';
    let css = base(id);
    let body = `<path d="M10 320 V250 Q60 150 120 250 Q180 150 240 250 V320 Z" fill="${C.peach}" stroke="${C.orange}" stroke-width="3"/>`;
    // 주름 위 융털(작은 손가락)
    let vil = '';
    const fold = (t, x0) => [x0 + 110 * t, 250 - 200 * t * (1 - t)];
    const fingers = [];
    [10, 120].forEach((x0) => { for (let t = 0.07; t < 0.97; t += 0.124) fingers.push(fold(t, x0)); });
    fingers.forEach(([x, y]) => { vil += `<path d="M${f(x - 6)} ${f(y + 4)} V${f(y - 14)} Q${f(x)} ${f(y - 24)} ${f(x + 6)} ${f(y - 14)} V${f(y + 4)}" fill="${C.peach}" stroke="${C.orange}" stroke-width="2.5"/>`; });
    body += vil + text(125, 346, '작은창자 안쪽 벽', { size: 18, color: C.muted });
    body += at(1, 'pop', lead(60, 168, 110, 96) + tag(110, 80, '주름', GRAY, { size: 18 }), 0.4);
    // 확대
    const [zx, zy] = fingers[4];
    body += `<rect x="${f(zx - 14)}" y="${f(zy - 30)}" width="28" height="36" fill="none" stroke="${C.ink}" stroke-width="2.5"/>` + lead(zx + 14, zy - 30, 420, 70) + lead(zx + 14, zy + 6, 420, 330);
    const V = 'M420 336 V150 Q420 64 490 64 Q560 64 560 150 V336';
    body += `<path d="${V}" fill="${C.peach}" stroke="${C.orange}" stroke-width="4"/>`;
    body += `<path d="M444 336 V150 Q444 96 490 96 Q536 96 536 150 V336 M444 190 Q490 214 536 190 M444 260 Q490 284 536 260" fill="none" stroke="${C.red}" stroke-width="4"/>`;
    body += `<path d="M490 336 V128" stroke="${C.yellow}" stroke-width="9" stroke-linecap="round"/><path d="M490 336 V128" stroke="${C.orange}" stroke-width="2" stroke-dasharray="1 0" opacity=".6"/>`;
    body += at(1, 'pop', lead(444, 220, 376, 220) + tag(330, 220, '모세혈관', HOT, { size: 18 }), 1.0) + at(1, 'pop', lead(494, 160, 590, 140) + tag(596, 120, '암죽관', SUN, { size: 18 }), 1.2);
    // 칸 2: 흡수
    body += shown(2, flow(id, 'M300 40 L436 150 V330', C.orange, { n: 4, dur: 2.2, w: 11, trail: true }) + flow(id, 'M630 40 L490 130 V330', C.purple, { n: 4, dur: 2.2, w: 9, trail: true }));
    body += at(2, 'pop', tag(300, 30, '포도당·아미노산', HOT, { size: 18 }), 0.3) + at(2, 'pop', tag(560, 24, '지방산 등', LIL, { size: 18 }), 0.6);
    // 칸 3: 겉넓이 — 융털 테두리를 따라 그린다
    const outline = 'M10 250 ' + fingers.map(([x, y]) => `L${f(x - 6)} ${f(y + 4)} V${f(y - 14)} Q${f(x)} ${f(y - 24)} ${f(x + 6)} ${f(y - 14)} V${f(y + 4)}`).join(' ') + ' L240 250';
    body += drawPath(outline, 3, C.red, 4, 0.1);
    body += at(3, 'pop', tag(120, 30, '융털', KEY, { size: 24 }), 0.8);
    put('8-2/과학/6/융털', svg(id, body, css));
  })();

  // ════ Ⅵ 동물과 에너지 — 호흡 ════

  // ── 호흡계: 코 → 숨관 → 숨관가지 → 허파, 아래에 가로막 ──
  (function () {
    const id = 't82-s6-hhg';
    let css = base(id);
    let body = `<path d="M308 18 L296 52 Q320 62 344 52 L332 18" fill="${C.peach}" stroke="${C.orange}" stroke-width="3" stroke-linejoin="round"/>`;
    body += `<ellipse cx="236" cy="222" rx="72" ry="96" fill="${C.peach}" stroke="${C.red}" stroke-width="3"/><ellipse cx="404" cy="222" rx="72" ry="96" fill="${C.peach}" stroke="${C.red}" stroke-width="3"/>`;
    const AIR = 'M320 58 V150 L270 186 M320 150 L370 186 M270 186 L230 220 M270 186 L262 250 M370 186 L410 220 M370 186 L378 250 M230 220 L206 250 M230 220 L222 286 M410 220 L434 250 M410 220 L418 286';
    body += `<path d="${AIR}" fill="none" stroke="${C.muted}" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/><path d="${AIR}" fill="none" stroke="white" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>`;
    for (let y = 72; y < 146; y += 14) body += `<path d="M314 ${y} h12" stroke="${C.muted}" stroke-width="2.5"/>`;
    body += `<path d="M150 336 Q320 280 490 336" fill="none" stroke="${C.orange}" stroke-width="9" stroke-linecap="round"/>`;
    const L = (k, x, y, tx, ty, n, s, anchor) => at(n, 'fin', lead(x, y, tx, ty) + text(tx + (anchor === 'end' ? -6 : 6), ty + 7, k, { size: 19, anchor }), s);
    body += L('코', 340, 36, 420, 36, 1, 0.1, 'start') + L('숨관', 326, 100, 420, 90, 1, 0.4, 'start') + L('숨관가지', 290, 172, 128, 110, 1, 0.7, 'end') + L('허파', 470, 200, 540, 180, 1, 1.0, 'start') + L('가로막', 470, 330, 540, 318, 1, 1.2, 'start');
    const IN = ['M320 30 V150 L270 186 L230 220 L214 270', 'M320 30 V150 L370 186 L410 220 L426 270', 'M320 30 V150 L270 186 L262 250', 'M320 30 V150 L370 186 L378 250'];
    body += shown(1, IN.map((d, k) => flow(id, d, C.blue, { n: 3, dur: 2.2, w: 8, delay: -k * 0.4 })).join(''), 2);
    body += `<g class="b1 h2">${g('pop pop1', tag(220, 36, '공기', COLD, { size: 18 }), 1.4)}</g>`; // 2칸부터는 같은 자리에 '이산화 탄소'
    const OUT = ['M214 270 L230 220 L270 186 L320 150 V24', 'M426 270 L410 220 L370 186 L320 150 V24'];
    body += shown(2, OUT.map((d, k) => flow(id, d, C.muted, { n: 3, dur: 2.2, w: 8, delay: -k * 0.7 })).join(''));
    body += at(2, 'pop', tag(220, 36, '이산화 탄소', GRAY, { size: 18 }), 0.5) + at(2, 'pop', star(236, 230, 12, C.lilac) + star(404, 230, 12, C.lilac), 0.2);
    body += glowRect(140, 10, 360, 340, 3, C.green, 0.1, 22) + at(3, 'pop', tag(80, 320, '호흡계', KEY, { size: 24 }), 0.6);
    put('8-2/과학/6/호흡계', svg(id, body, css));
  })();

  // ── 허파꽈리: 숨관가지 끝의 포도송이 같은 주머니, 둘레 모세혈관과 기체를 주고받는다 ──
  (function () {
    const id = 't82-s6-hk';
    let css = base(id);
    const TREE = 'M120 20 V96 L70 150 M120 96 L176 150 M70 150 L52 220 M70 150 L104 214 M176 150 L160 230 M176 150 L214 206';
    const cluster = (cx, cy) => [[0, 0], [-14, 10], [14, 10], [-8, 24], [8, 24], [0, -12]].map(([dx, dy]) => `<circle cx="${cx + dx}" cy="${cy + dy}" r="10" fill="${C.sky}" stroke="${C.blue}" stroke-width="2.5"/>`).join('');
    const tips = [[52, 228], [104, 222], [160, 238], [214, 214]];
    let body = `<path d="${TREE}" fill="none" stroke="${C.muted}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/><g class="b1">${tips.map(([x, y], k) => g('pop pop1', cluster(x, y), f(0.3 + k * 0.2))).join('')}</g>`;
    body += at(1, 'pop', lead(140, 60, 200, 60) + tag(260, 60, '숨관가지', GRAY, { size: 18 }), 0.2);
    // 확대한 주머니 하나
    body += `<rect x="190" y="190" width="48" height="52" fill="none" stroke="${C.ink}" stroke-width="2.5"/>` + lead(238, 190, 370, 76) + lead(238, 242, 370, 270);
    body += `<path d="M470 70 V20" stroke="${C.muted}" stroke-width="16" stroke-linecap="round"/><circle cx="470" cy="166" r="96" fill="#eef5fb" stroke="${C.blue}" stroke-width="4"/><path d="M470 70 V20" stroke="#eef5fb" stroke-width="10" stroke-linecap="round"/>`;
    // 모세혈관: 왼쪽(들어옴)은 파랑, 오른쪽(나감)은 빨강
    body += `<path d="M356 120 Q352 284 470 284" fill="none" stroke="${C.blue}" stroke-width="16" stroke-linecap="round" stroke-opacity=".75"/><path d="M470 284 Q588 284 584 120" fill="none" stroke="${C.red}" stroke-width="16" stroke-linecap="round" stroke-opacity=".75"/>`;
    body += shown(1, flow(id, 'M356 120 Q352 284 470 284 Q588 284 584 120', 'white', { n: 6, dur: 3.2, w: 6 }));
    body += at(1, 'pop', tag(400, 330, '모세혈관', HOT, { size: 18 }), 1.2);
    // 칸 2: 산소는 주머니 → 혈관, 이산화 탄소는 혈관 → 주머니
    body += shown(2, flow(id, 'M450 150 L410 262', C.purple, { n: 3, dur: 1.4, w: 10, trail: true }) + flow(id, 'M500 150 L470 270', C.purple, { n: 3, dur: 1.6, w: 10, trail: true }) + flow(id, 'M548 262 L520 170', C.ink, { n: 3, dur: 1.5, w: 10, trail: true }));
    body += at(2, 'pop', tag(450, 110, '산소', LIL, { size: 18 }), 0.4) + at(2, 'pop', tag(575, 324, '이산화 탄소', GRAY, { size: 18 }), 0.8);
    body += ring(470, 166, 100, 3, C.red, 0.1) + at(3, 'pop', tag(120, 320, '허파꽈리', KEY, { size: 24 }), 0.6) + glowPath(tips.map(([x, y]) => `M${x - 26} ${y + 10} a26 26 0 1 0 52 0 a26 26 0 1 0 -52 0`).join(' '), 3, C.red, 0.3, 3);
    put('8-2/과학/6/허파꽈리', svg(id, body, css));
  })();

  // ── 가슴(정면): 갈비뼈·허파·가로막. 숨 들이쉬면 갈비뼈가 올라가고 가로막이 내려간다 ──
  const chest = (cx, cy, s, diaHi = '') => {
    let ribs = '';
    for (let i = 0; i < 5; i++) {
      const y = -78 + i * 30;
      ribs += `<path d="M-12 ${y} Q-128 ${y + 6} -122 ${y + 46}" fill="none" stroke="${C.muted}" stroke-width="7" stroke-linecap="round"/><path d="M12 ${y} Q128 ${y + 6} 122 ${y + 46}" fill="none" stroke="${C.muted}" stroke-width="7" stroke-linecap="round"/>`;
    }
    ribs += `<rect x="-10" y="-88" width="20" height="134" rx="8" fill="white" stroke="${C.muted}" stroke-width="3"/>`;
    const lungs = `<path d="M-14 -96 Q-90 -100 -100 -10 Q-104 60 -86 80 Q-50 66 -14 70 Z" fill="${C.peach}" stroke="${C.red}" stroke-width="3"/><path d="M14 -96 Q90 -100 100 -10 Q104 60 86 80 Q50 66 14 70 Z" fill="${C.peach}" stroke="${C.red}" stroke-width="3"/>`;
    const trach = `<path d="M0 -150 V-104 M0 -104 L-24 -84 M0 -104 L24 -84" fill="none" stroke="${C.muted}" stroke-width="10" stroke-linecap="round"/>`;
    const dia = diaHi + `<path d="M-140 112 Q0 46 140 112" fill="none" stroke="${C.orange}" stroke-width="9" stroke-linecap="round" vector-effect="non-scaling-stroke"/>`;
    return `<g transform="translate(${cx} ${cy}) scale(${s})">${trach}<g class="lg">${lungs}</g><g class="rb">${ribs}</g><g class="dia">${dia}</g></g>`;
  };
  const chestCss = (id, vals) => `.sc-${id} .lg { transform-box: fill-box; transform-origin: 50% 0%; } .sc-${id} .rb, .sc-${id} .dia { transform-box: fill-box; transform-origin: 50% 100%; }`
    + steps(id, 'lg', vals.map((v) => (v == null ? null : v ? 'scale(1.06,1.14)' : 'scale(1,1)')), 1.1, 0.3)
    + steps(id, 'rb', vals.map((v) => (v == null ? null : v ? 'translateY(-8px) scaleX(1.05)' : 'translateY(0px) scaleX(1)')), 1.1, 0.3)
    + steps(id, 'dia', vals.map((v) => (v == null ? null : v ? 'translateY(16px) scaleY(.45)' : 'translateY(0px) scaleY(1)')), 1.1, 0.3);

  // ── 가로막 ──
  (function () {
    const id = 't82-s6-grm';
    let css = base(id) + chestCss(id, [false, null, true, false]);
    let body = chest(320, 186, 1.15, at(1, 'fin', `<path d="M-140 112 Q0 46 140 112" fill="none" stroke="${C.yellow}" stroke-width="18" stroke-linecap="round" stroke-opacity=".75" vector-effect="non-scaling-stroke"/>`, 0.2));
    body += `<g class="b1 h2">${g('pop pop1', tag(560, 210, '가슴', GRAY, { size: 18 }) + tag(560, 336, '배', GRAY, { size: 18 }), 0.6)}</g>`;
    body += shown(2, flow(id, 'M320 6 V60', C.blue, { n: 2, dur: 1, w: 10, trail: true }), 3) + `<g class="b2 h3">${g('pop pop2', harrow(560, 250, 560, 320, C.orange, 6) + tag(560, 216, '들숨', COLD), 0.4)}</g>`;
    body += shown(3, flow(id, 'M320 60 V6', C.muted, { n: 2, dur: 1, w: 10, trail: true })) + `<g class="b3">${g('pop pop3', harrow(560, 320, 560, 250, C.orange, 6) + tag(560, 216, '날숨', GRAY), 0.4)}</g>`;
    body += at(3, 'pop', tag(96, 40, '가로막', KEY, { size: 24 }), 1.2);
    put('8-2/과학/6/가로막', svg(id, body, css));
  })();

  // ── 호흡운동: 병 모형(풍선=허파, 고무 막=가로막)과 사람 가슴을 나란히 ──
  (function () {
    const id = 't82-s6-hhu';
    let css = base(id) + chestCss(id, [false, null, true, false, null]);
    let body = `<path d="M106 62 V92 Q50 104 50 156 V300 M194 62 V92 Q250 104 250 156 V300" fill="none" stroke="${C.ink}" stroke-width="4" stroke-linejoin="round"/><rect x="100" y="50" width="100" height="16" rx="4" fill="${C.line}" stroke="${C.muted}" stroke-width="3"/>`;
    body += `<path d="M150 14 V128 M150 128 L118 156 M150 128 L182 156" fill="none" stroke="${C.muted}" stroke-width="7" stroke-linecap="round"/>`;
    const bal = (x) => `<ellipse cx="${x}" cy="184" rx="22" ry="28" fill="${C.peach}" stroke="${C.red}" stroke-width="3"/>`;
    body += `<g class="bl">${bal(112)}</g><g class="br">${bal(188)}</g>`;
    css += `.sc-${id} .bl, .sc-${id} .br { transform-box: fill-box; transform-origin: 50% 0%; }` + steps(id, 'bl', ['scale(1)', null, 'scale(1.35)', 'scale(.7)', null], 1.1, 0.3) + steps(id, 'br', ['scale(1)', null, 'scale(1.35)', 'scale(.7)', null], 1.1, 0.3);
    const mem = (q) => `<path d="M50 300 Q150 ${q} 250 300" fill="${C.peach}" fill-opacity=".6" stroke="${C.orange}" stroke-width="6" stroke-linecap="round"/>`;
    body += `<g class="h2">${mem(300)}</g><g class="b2 h3">${mem(372)}<path d="M150 336 V352" stroke="${C.ink}" stroke-width="6" stroke-linecap="round"/></g><g class="b3">${mem(240)}</g>`;
    body += at(1, 'pop', lead(208, 196, 280, 160) + tag(300, 140, '허파', HOT, { size: 18 }), 0.4) + at(1, 'pop', lead(250, 300, 280, 322) + tag(310, 330, '가로막', SUN, { size: 18 }), 0.7);
    // 칸 2: 막을 당긴다 → 공기가 들어온다
    body += `<g class="b2 h3">${flow(id, 'M150 0 V120', C.blue, { n: 2, dur: 1, w: 10 })}${g('pop pop2', tag(318, 236, '압력 낮아짐', COLD, { size: 18 }), 0.8)}</g>`;
    // 칸 3: 막을 민다 → 공기가 나간다
    body += `<g class="b3">${flow(id, 'M150 120 V0', C.muted, { n: 2, dur: 1, w: 10 })}${g('pop pop3', tag(318, 236, '압력 높아짐', HOT, { size: 18 }), 0.8)}</g>`;
    // 오른쪽: 사람 가슴
    body += chest(490, 196, 0.85);
    body += `<g class="b2 h3">${g('pop pop2', tag(490, 30, '들숨', COLD), 0.4)}</g><g class="b3 h4">${g('pop pop3', tag(490, 30, '날숨', GRAY), 0.4)}</g>`;
    body += at(4, 'pop', lead(397, 120, 360, 90) + tag(360, 70, '갈비뼈', GRAY, { size: 18 }), 0.2) + at(4, 'pop', lead(560, 280, 600, 310) + tag(590, 334, '가로막', SUN, { size: 18 }), 0.4);
    body += at(4, 'pop', tag(490, 30, '호흡운동', KEY, { size: 22 }), 0.8);
    put('8-2/과학/6/호흡운동', svg(id, body, css));
  })();

  // ── 세포호흡: 소화계의 영양소와 호흡계의 산소가 순환계로 세포에 와서 에너지가 되고, 이산화 탄소와 물이 나간다 ──
  (function () {
    const id = 't82-s6-sph';
    let css = base(id);
    let body = tag(90, 60, '소화계', SUN) + tag(90, 300, '호흡계', COLD);
    body += `<path d="M250 20 V318" stroke="${C.red}" stroke-width="22" stroke-opacity=".25" stroke-linecap="round"/>` + text(250, 350, '순환계', { size: 18, color: C.red });
    body += `<circle cx="470" cy="180" r="100" fill="#eef8f1" stroke="${C.green}" stroke-width="4"/>` + text(470, 112, '세포', { size: 20, color: C.green });
    body += shown(1, flow(id, 'M150 60 L250 60 V150 L380 160', C.orange, { n: 4, dur: 2.4, w: 12, trail: true }) + flow(id, 'M150 300 L250 300 V210 L380 200', C.purple, { n: 4, dur: 2.4, w: 12, trail: true }));
    body += at(1, 'pop', tag(170, 120, '영양소', SUN, { size: 18 }), 0.8) + at(1, 'pop', tag(170, 240, '산소', LIL, { size: 18 }), 1.0);
    body += at(2, 'pop', hex(430, 170, 18), 0.1) + at(2, 'pop', `<circle cx="470" cy="200" r="11" fill="${C.purple}"/><circle cx="492" cy="182" r="11" fill="${C.purple}"/>`, 0.3);
    body += at(2, 'pop', star(440, 220, 16) + star(512, 150, 16) + star(520, 222, 14), 1.0) + at(2, 'pop', tag(470, 260, '에너지', SUN), 1.3);
    body += shown(3, flow(id, 'M560 140 L630 90', C.muted, { n: 3, dur: 1.4, w: 10, trail: true }) + flow(id, 'M560 220 L630 270', C.blue, { n: 3, dur: 1.4, w: 10, trail: true }));
    body += at(3, 'pop', tag(560, 60, '이산화 탄소', GRAY, { size: 18 }), 0.4) + at(3, 'pop', tag(590, 306, '물', COLD, { size: 18 }), 0.6);
    body += ring(470, 180, 104, 3, C.red, 0.2) + at(3, 'pop', tag(470, 336, '세포호흡', KEY, { size: 24 }), 1.0);
    put('8-2/과학/6/세포호흡', svg(id, body, css));
  })();
})(typeof window !== 'undefined' ? window : globalThis);
