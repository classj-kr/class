// 과학 중2-2(8-2) Ⅵ「동물과 에너지」(순환·배설) 낱말 도식.
// 심장은 정면에서 본 네 방(몸의 오른쪽이 화면 왼쪽): 위 둘은 심방, 아래 둘은 심실, 좌심실 벽이 가장 두껍다.
// 산소가 많은 혈액이 흐르는 길은 빨강, 적은 길은 파랑. 흐름은 점이 길을 따라 가는 것(stroke-dashoffset)으로 그린다.
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
  const glowPath = (d, n, color = C.green, s = 0, w = 5, hide) => `<g class="b${n}${hide ? ' h' + hide : ''}"><path class="flash flash${n}"${dl(s)} d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-opacity=".55" stroke-linejoin="round" stroke-linecap="round"/></g>`;
  const drawPath1 = (d, n, color, w = 4, s = 0) => `<g class="b${n} h${n + 1}"><path class="draw draw${n}"${dl(s)} pathLength="1" d="${d}" stroke="${color}" stroke-width="${w}" stroke-linecap="round" fill="none"/></g>`;
  const drawPath = (d, n, color, w = 4, s = 0, extra = '') => `<g class="b${n}"><path class="draw draw${n}"${dl(s)} pathLength="1" d="${d}" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" fill="none"${extra}/></g>`;
  const harrow = (x1, y1, x2, y2, color = C.muted, w = 5) => {
    const a = Math.atan2(y2 - y1, x2 - x1), hl = w * 2.6, hw = w * 1.6;
    const bx = x2 - hl * Math.cos(a), by = y2 - hl * Math.sin(a), px = -Math.sin(a) * hw, py = Math.cos(a) * hw;
    return `<path d="M${f(x1)} ${f(y1)} L${f(bx)} ${f(by)}" stroke="${color}" stroke-width="${w}" stroke-linecap="round"/>`
      + `<path d="M${f(x2)} ${f(y2)} L${f(bx + px)} ${f(by + py)} L${f(bx - px)} ${f(by - py)} Z" fill="${color}" stroke="${color}" stroke-width="1.5" stroke-linejoin="round"/>`;
  };
  const flow = (id, d, color, { n = 4, dur = 2.4, w = 11, delay = 0, trail = false } = {}) => {
    const sp = f(100 / n);
    return (trail ? `<path d="${d}" fill="none" stroke="${color}" stroke-width="3" stroke-opacity=".3" stroke-linecap="round"/>` : '') + `<path d="${d}" pathLength="100" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-dasharray="0.01 ${f(sp - 0.01)}" style="animation:${id}-fl${n} ${dur}s linear ${delay}s infinite"/>`;
  };
  const steps = (id, cls, vals, sec = 1.2, delay = 0.2) => `.sc-${id} .${cls} { transform: ${vals[0]}; transition: transform ${sec}s ease-in-out ${delay}s; }`
    + vals.slice(1).map((v, i) => (v == null ? '' : `.on${i + 1} .sc-${id} .${cls} { transform: ${v}; }`)).join('');
  const piece = (id, cls, inner, moves, sec = 0.9, delay = 0.6) => ({ body: `<g class="pz-${cls}">${inner}</g>`, css: steps(id, `pz-${cls}`, moves.map((m, i) => (m == null ? (i ? null : 'translate(0px,0px)') : `translate(${m[0]}px,${m[1]}px)`)), sec, delay) });

  const base = (id) => {
    let s = `
    .sc-${id} .pop, .sc-${id} .pulse, .sc-${id} .ring, .sc-${id} .fb { transform-box: fill-box; transform-origin: center; }
    .sc-${id} .draw { stroke-dasharray: 1; stroke-dashoffset: 1; }
    .sc-${id} .ring { opacity: 0; }
    @keyframes ${id}-pop { 0% { opacity: 0; transform: scale(.3); } 70% { opacity: 1; transform: scale(1.12); } 100% { opacity: 1; transform: scale(1); } }
    @keyframes ${id}-fin { from { opacity: 0; } to { opacity: 1; } }
    @keyframes ${id}-fout { from { opacity: 1; } to { opacity: 0; } }
    @keyframes ${id}-rise { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
    @keyframes ${id}-pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.14); } }
    @keyframes ${id}-beat { 0%, 60%, 100% { transform: scale(1); } 25% { transform: scale(.92); } }
    @keyframes ${id}-flash { 0% { opacity: 0; } 20% { opacity: 1; } 40% { opacity: .25; } 60% { opacity: 1; } 80% { opacity: .25; } 100% { opacity: 1; } }
    @keyframes ${id}-ring { 0% { opacity: .9; transform: scale(1); } 100% { opacity: 0; transform: scale(1.6); } }
    @keyframes ${id}-drawk { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
    @keyframes ${id}-bob { 0%, 100% { transform: translate(0px, 0px); } 50% { transform: translate(5px, -4px); } }
    .sc-${id} .bob { animation: ${id}-bob 2.6s ease-in-out infinite; }
    `;
    for (let n = 1; n <= 12; n++) s += `@keyframes ${id}-fl${n} { from { stroke-dashoffset: 0; } to { stroke-dashoffset: -${f(100 / n)}; } }`;
    for (let n = 1; n <= 5; n++) s += `
    .on${n} .sc-${id} .pop${n} { animation: ${id}-pop .5s ease-out both; }
    .on${n} .sc-${id} .fin${n} { animation: ${id}-fin .6s ease-out both; }
    .on${n} .sc-${id} .fout${n} { animation: ${id}-fout .6s ease-out both; }
    .on${n} .sc-${id} .rise${n} { animation: ${id}-rise .5s ease-out both; }
    .on${n} .sc-${id} .pulse${n} { animation: ${id}-pulse .7s ease-in-out .3s 2; }
    .on${n} .sc-${id} .beat${n} { animation: ${id}-beat 1s ease-in-out infinite; }
    .on${n} .sc-${id} .flash${n} { animation: ${id}-flash 1.4s ease-in-out both; }
    .on${n} .sc-${id} .ring${n} { animation: ${id}-ring 1.1s ease-out .3s 2; }
    .on${n} .sc-${id} .draw${n} { animation: ${id}-drawk 1.2s ease-in-out .2s both; }`;
    return s;
  };
  const hex = (cx, cy, r = 10) => `<polygon points="${Array.from({ length: 6 }, (_, k) => { const a = Math.PI / 6 + (k * Math.PI) / 3; return `${f(cx + r * Math.cos(a))},${f(cy + r * Math.sin(a))}`; }).join(' ')}" fill="${C.yellow}" stroke="${C.orange}" stroke-width="2.5" stroke-linejoin="round"/>`;
  const star = (cx, cy, r = 14, color = C.yellow) => `<path d="${Array.from({ length: 10 }, (_, k) => { const a = -Math.PI / 2 + (k * Math.PI) / 5, rr = k % 2 ? r * 0.45 : r; return `${k ? 'L' : 'M'}${f(cx + rr * Math.cos(a))} ${f(cy + rr * Math.sin(a))}`; }).join(' ')} Z" fill="${color}" stroke="${C.orange}" stroke-width="2" stroke-linejoin="round"/>`;
  const cross = (cx, cy, r = 14, color = C.red) => `<path d="M${cx - r} ${cy - r} L${cx + r} ${cy + r} M${cx + r} ${cy - r} L${cx - r} ${cy + r}" stroke="${color}" stroke-width="6" stroke-linecap="round"/>`;
  // 혈구 모양
  const rbc = (cx, cy, r = 17) => `<circle cx="${f(cx)}" cy="${f(cy)}" r="${r}" fill="${C.peach}" stroke="${C.red}" stroke-width="3"/><circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r * 0.45)}" fill="white" fill-opacity=".7"/>`;
  const wbc = (cx, cy, r = 25) => `<circle cx="${f(cx)}" cy="${f(cy)}" r="${r}" fill="white" stroke="${C.purple}" stroke-width="3"/><path d="M${f(cx - r * 0.5)} ${f(cy)} q${f(r * 0.2)} ${f(-r * 0.5)} ${f(r * 0.5)} ${f(-r * 0.2)} q${f(r * 0.3)} ${f(-r * 0.4)} ${f(r * 0.5)} ${f(r * 0.1)} q${f(-r * 0.1)} ${f(r * 0.5)} ${f(-r * 0.5)} ${f(r * 0.4)} q${f(-r * 0.4)} ${f(r * 0.1)} ${f(-r * 0.5)} ${f(-r * 0.3)} Z" fill="${C.purple}" fill-opacity=".7"/>`;
  const plt = (cx, cy, s = 1) => `<path d="M${f(cx - 7 * s)} ${f(cy - 2 * s)} L${f(cx - 1 * s)} ${f(cy - 7 * s)} L${f(cx + 7 * s)} ${f(cy - 3 * s)} L${f(cx + 5 * s)} ${f(cy + 5 * s)} L${f(cx - 4 * s)} ${f(cy + 6 * s)} Z" fill="${C.lilac}" stroke="${C.purple}" stroke-width="2.5" stroke-linejoin="round"/>`;

  // ════ 심장(자세히): 네 방, 판막, 혈관 그루터기 ════
  const RA = [180, 80, 120, 85], LA = [340, 80, 120, 85], RV = [180, 175, 125, 135], LV = [335, 175, 125, 140];
  const room = ([x, y, w, h], fill, stroke, sw) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="22" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
  const VES = {
    대정맥: 'M50 122 H182', 폐정맥: 'M600 122 H458', 폐동맥: 'M300 196 L320 172 V18', 대동맥: 'M455 268 H600'
  };
  const heartDetail = () => {
    let s = `<path d="${VES.대정맥}" stroke="${C.blue}" stroke-width="28" stroke-opacity=".55"/><path d="${VES.폐정맥}" stroke="${C.red}" stroke-width="28" stroke-opacity=".5"/>`
      + `<path d="${VES.대동맥}" stroke="${C.red}" stroke-width="28" stroke-opacity=".5"/>`;
    s += room(RA, '#eef5fb', C.blue, 4) + room(LA, '#fdf0e6', C.red, 4) + room(RV, '#eef5fb', C.blue, 6) + room(LV, '#fdf0e6', C.red, 12);
    s += `<path d="${VES.폐동맥}" stroke="${C.blue}" stroke-width="28" stroke-opacity=".55" fill="none" stroke-linejoin="round"/>`;
    s += text(240, 106, '우심방', { size: 18 }) + text(400, 106, '좌심방', { size: 18 }) + text(242, 298, '우심실', { size: 18 }) + text(398, 298, '좌심실', { size: 18 });
    s += text(98, 98, '대정맥', { size: 18 }) + text(548, 98, '폐정맥', { size: 18 }) + text(342, 40, '폐동맥', { size: 18, anchor: 'start' }) + text(548, 302, '대동맥', { size: 18 });
    return s;
  };
  // 판막 날개: 경첩 (hx, hy), 닫힌 방향 벡터 (dx, dy). open 칸들에서 deg 만큼 돈다
  const flap = (id, cls, hx, hy, dx, dy, color) => ({
    body: `<g class="${cls}"><path d="M${hx} ${hy} l${dx} ${dy}" stroke="${color}" stroke-width="6" stroke-linecap="round"/></g>`,
    css: `.sc-${id} .${cls} { transform-box: view-box; transform-origin: ${hx}px ${hy}px; }`
  });
  const valves = (id, openAV, openSL) => {
    // openAV/openSL: 칸마다 열림(true)/닫힘(false)/그대로(null)
    let body = '', css = '';
    const set = (cls, deg, vals) => steps(id, cls, vals.map((v) => (v == null ? null : `rotate(${v ? deg : 0}deg)`)), 0.6, 0.3);
    [[RA, '#3d7fc1'], [LA, '#c0392b']].forEach(([[x, , w], color], k) => {
      const cx = x + w / 2, y = 170;
      const L = flap(id, `av${k}l`, cx - 30, y, 29, 0, color), R = flap(id, `av${k}r`, cx + 30, y, -29, 0, color);
      body += L.body + R.body; css += L.css + R.css + set(`av${k}l`, 65, openAV) + set(`av${k}r`, -65, openAV);
    });
    const P1 = flap(id, 'sl0l', 307, 150, 12, 0, C.blue), P2 = flap(id, 'sl0r', 333, 150, -12, 0, C.blue);
    const A1 = flap(id, 'sl1t', 470, 255, 0, 12, C.red), A2 = flap(id, 'sl1b', 470, 281, 0, -12, C.red);
    body += P1.body + P2.body + A1.body + A2.body;
    css += P1.css + P2.css + A1.css + A2.css + set('sl0l', -65, openSL) + set('sl0r', 65, openSL) + set('sl1t', -65, openSL) + set('sl1b', 65, openSL);
    return { body, css };
  };
  const roomFill = (r, n, color, s = 0, hide) => `<g class="b${n}${hide ? ' h' + hide : ''}">${g(`fin fin${n}`, `<rect x="${r[0]}" y="${r[1]}" width="${r[2]}" height="${r[3]}" rx="22" fill="${color}" fill-opacity=".35"/>`, s)}</g>`;
  const IN_RA = 'M50 122 H196', IN_LA = 'M600 122 H444', RA_RV = 'M240 132 V276', LA_LV = 'M400 132 V276', RV_OUT = 'M242 270 V214 L300 196 L320 172 V18', LV_OUT = 'M398 270 V240 L455 268 H600';

  // ── 심방 ──
  (function () {
    const id = 't82-s6-sb';
    let css = base(id);
    let body = heartDetail();
    const v = valves(id, [false, null, null, true], [false]); body += v.body; css += v.css;
    body += drawPath1(`M${RA[0] + 22} ${RA[1]} h${RA[2] - 44} a22 22 0 0 1 22 22 v${RA[3] - 44} a22 22 0 0 1 -22 22 h${-(RA[2] - 44)} a22 22 0 0 1 -22 -22 v${-(RA[3] - 44)} a22 22 0 0 1 22 -22`, 1, C.green, 5, 0.2)
      + drawPath1(`M${LA[0] + 22} ${LA[1]} h${LA[2] - 44} a22 22 0 0 1 22 22 v${LA[3] - 44} a22 22 0 0 1 -22 22 h${-(LA[2] - 44)} a22 22 0 0 1 -22 -22 v${-(LA[3] - 44)} a22 22 0 0 1 22 -22`, 1, C.green, 5, 0.4)
      + drawPath1(`M${RV[0] + 22} ${RV[1]} h${RV[2] - 44} a22 22 0 0 1 22 22 v${RV[3] - 44} a22 22 0 0 1 -22 22 h${-(RV[2] - 44)} a22 22 0 0 1 -22 -22 v${-(RV[3] - 44)} a22 22 0 0 1 22 -22`, 1, C.green, 5, 0.6)
      + drawPath1(`M${LV[0] + 22} ${LV[1]} h${LV[2] - 44} a22 22 0 0 1 22 22 v${LV[3] - 44} a22 22 0 0 1 -22 22 h${-(LV[2] - 44)} a22 22 0 0 1 -22 -22 v${-(LV[3] - 44)} a22 22 0 0 1 22 -22`, 1, C.green, 5, 0.8);
    body += shown(2, flow(id, IN_RA, C.blue, { n: 4, dur: 2 }) + flow(id, IN_LA, C.red, { n: 4, dur: 2 })) + roomFill(RA, 2, C.blue, 0.8) + roomFill(LA, 2, C.red, 0.8);
    body += shown(3, flow(id, RA_RV, C.blue, { n: 3, dur: 1.6, w: 9 }) + flow(id, LA_LV, C.red, { n: 3, dur: 1.6, w: 9 }));
    body += glowRect(RA[0] - 6, RA[1] - 6, LA[0] + LA[2] - RA[0] + 12, RA[3] + 12, 3, C.yellow, 0.1, 26) + at(3, 'pop', tag(320, 340, '심방', KEY, { size: 24 }), 0.8);
    put('8-2/과학/6/심방', svg(id, body, css));
  })();

  // ── 심실 ──
  (function () {
    const id = 't82-s6-ss';
    let css = base(id);
    let body = heartDetail();
    const v = valves(id, [false, true, false, null], [false, false, true, null]); body += v.body; css += v.css;
    body += shown(1, flow(id, RA_RV, C.blue, { n: 3, dur: 1.6, w: 9 }) + flow(id, LA_LV, C.red, { n: 3, dur: 1.6, w: 9 }), 2);
    // 칸 2: 심실이 오므라든다
    css += `.sc-${id} .sq { transform-box: fill-box; transform-origin: 50% 100%; } .on2 .sc-${id} .sq { animation: ${id}-beat 1s ease-in-out .2s infinite; }`;
    body += `<g class="b2"><g class="sq">${room(RV, 'none', C.blue, 6)}</g><g class="sq">${room(LV, 'none', C.red, 12)}</g></g>`;
    body += roomFill(RV, 2, C.blue, 0.1) + roomFill(LV, 2, C.red, 0.1);
    body += shown(2, flow(id, RV_OUT, C.blue, { n: 4, dur: 1.8, delay: 0.4 }) + flow(id, LV_OUT, C.red, { n: 4, dur: 1.8, delay: 0.4 }));
    // 칸 3: 벽 두께
    body += glowRect(LV[0], LV[1], LV[2], LV[3], 3, C.yellow, 0.1, 22) + at(3, 'pop', lead(470, 200, 540, 190) + tag(570, 190, '두꺼운 벽', HOT, { size: 18 }), 0.4);
    body += at(3, 'pop', tag(110, 330, '심실', KEY, { size: 24 }), 0.8);
    put('8-2/과학/6/심실', svg(id, body, css));
  })();

  // ── 판막 ──
  (function () {
    const id = 't82-s6-pm';
    let css = base(id);
    let body = heartDetail();
    const v = valves(id, [false, null, true, false, null], [false, null, false, true, null]); body += v.body; css += v.css;
    [[240, 170], [400, 170], [320, 150], [470, 268]].forEach(([x, y], k) => { body += ring(x, y, 32, 1, C.purple, f(0.2 + k * 0.25)); });
    body += `<g class="b1 h4">${g('pop pop1', tag(110, 330, '얇은 막', LIL, { size: 18 }), 1.2)}</g>`;
    body += shown(2, flow(id, RA_RV, C.blue, { n: 3, dur: 1.6, w: 9, delay: 0.6 }) + flow(id, LA_LV, C.red, { n: 3, dur: 1.6, w: 9, delay: 0.6 }), 3);
    body += `<g class="b2 h3">${g('pop pop2', tag(560, 196, '열림', OK, { size: 18 }), 0.6)}</g>`;
    body += shown(3, flow(id, RV_OUT, C.blue, { n: 4, dur: 1.8, delay: 0.6 }) + flow(id, LV_OUT, C.red, { n: 4, dur: 1.8, delay: 0.6 }));
    body += `<g class="b3">${g('pop pop3', cross(240, 196, 12) + cross(400, 196, 12), 1.0)}</g>` + at(3, 'pop', tag(560, 196, '닫힘', HOT, { size: 18 }), 0.6);
    body += at(4, 'pop', tag(110, 330, '판막', KEY, { size: 24 }), 0.4) + [[240, 170], [400, 170], [320, 150], [470, 268]].map(([x, y], k) => ring(x, y, 32, 4, C.red, f(k * 0.15))).join('');
    put('8-2/과학/6/판막', svg(id, body, css));
  })();

  // ════ 혈관: 심장 → 동맥 → 모세혈관(조직 세포 사이) → 정맥 → 심장 ════
  const ART = 'M104 150 Q130 92 190 92 H430', VEIN = 'M430 268 H190 Q130 268 104 210';
  const CAPS = [500, 570, 640].map((c) => `M430 92 C${c} 92 ${c} 268 430 268`);
  const vesselBase = () => {
    let s = `<path d="M75 228 C10 185 22 128 52 128 C66 128 75 140 75 148 C75 140 84 128 98 128 C128 128 140 185 75 228 Z" fill="${C.peach}" stroke="${C.red}" stroke-width="3"/>` + text(75, 190, '심장', { size: 18 });
    s += `<path d="${ART}" fill="none" stroke="${C.red}" stroke-width="32" stroke-opacity=".8"/><path d="${ART}" fill="none" stroke="#fdf0e6" stroke-width="14"/>`;
    s += `<path d="${VEIN}" fill="none" stroke="${C.blue}" stroke-width="34" stroke-opacity=".75"/><path d="${VEIN}" fill="none" stroke="#eef5fb" stroke-width="26"/>`;
    [330, 240].forEach((x) => { s += `<path d="M${x} 257 L${x - 16} 266 M${x} 279 L${x - 16} 270" stroke="${C.blue}" stroke-width="4" stroke-linecap="round"/>`; });
    s += CAPS.map((d) => `<path d="${d}" fill="none" stroke="${C.purple}" stroke-width="4"/>`).join('');
    [[455, 180], [508, 180], [561, 180], [613, 180]].forEach(([x, y]) => { s += `<circle cx="${x}" cy="${y}" r="13" fill="${C.mint}" stroke="${C.green}" stroke-width="2.5"/>`; });
    return s;
  };
  const VXS = (n, kind, s = 0) => {
    // 가운데 단면: 동맥(두꺼운 벽)·정맥(얇은 벽, 넓은 속)·모세혈관(세포 한 겹)
    if (kind === 'a') return at(n, 'pop', `<circle cx="300" cy="180" r="32" fill="#fdf0e6" stroke="${C.red}" stroke-width="16" stroke-opacity=".85"/>`, s);
    if (kind === 'v') return at(n, 'pop', `<circle cx="300" cy="180" r="36" fill="#eef5fb" stroke="${C.blue}" stroke-width="5"/>`, s);
    return at(n, 'pop', `<circle cx="300" cy="180" r="20" fill="#f6f0fb" stroke="${C.purple}" stroke-width="5"/>` + [0, 120, 240].map((a) => { const r = (a * Math.PI) / 180; return `<circle cx="${f(300 + 20 * Math.cos(r))}" cy="${f(180 + 20 * Math.sin(r))}" r="4" fill="${C.purple}"/>`; }).join(''), s);
  };

  (function () {
    const id = 't82-s6-dm';
    let css = base(id);
    let body = vesselBase();
    body += shown(1, flow(id, ART, C.red, { n: 7, dur: 1.1, w: 9 })) + at(1, 'pop', tag(300, 46, '심장에서 나감', HOT, { size: 18 }), 0.6);
    body += VXS(2, 'a', 0.2) + `<g class="b2">${g('pulse pulse2', '<circle cx="300" cy="180" r="44" fill="none" stroke="#c0392b" stroke-width="3" stroke-opacity=".5"/>', 0.6)}</g>` + at(2, 'pop', tag(300, 238, '두꺼운 벽', HOT, { size: 18 }), 0.8);
    body += glowPath(ART, 3, C.yellow, 0.1, 8) + at(3, 'pop', tag(110, 320, '동맥', KEY, { size: 24 }), 0.6);
    put('8-2/과학/6/동맥', svg(id, body, css));
  })();

  (function () {
    const id = 't82-s6-jm';
    let css = base(id);
    let body = vesselBase();
    body += shown(1, flow(id, VEIN, C.blue, { n: 5, dur: 3.6, w: 9 })) + at(1, 'pop', tag(300, 318, '심장으로 돌아옴', COLD, { size: 18 }), 0.6);
    body += VXS(2, 'v', 0.2) + at(2, 'pop', tag(300, 122, '얇은 벽', COLD, { size: 18 }), 0.6) + ring(322, 268, 22, 2, C.purple, 0.9) + ring(232, 268, 22, 2, C.purple, 1.1) + at(2, 'pop', lead(232, 282, 140, 304) + tag(108, 306, '판막', LIL, { size: 18 }), 1.3);
    body += glowPath(VEIN, 3, C.yellow, 0.1, 8) + at(3, 'pop', tag(560, 330, '정맥', KEY, { size: 24 }), 0.6);
    put('8-2/과학/6/정맥', svg(id, body, css));
  })();

  (function () {
    const id = 't82-s6-ms';
    let css = base(id);
    let body = vesselBase();
    body += CAPS.map((d, k) => drawPath(d, 1, C.purple, 7, f(k * 0.2))).join('') + at(1, 'pop', tag(560, 40, '아주 가는 혈관', LIL, { size: 18 }), 1.2);
    body += shown(2, CAPS.map((d, k) => flow(id, d, 'white', { n: 4, dur: 4, w: 5, delay: -k })).join(''));
    // 주고받기: 혈관 → 세포(산소·영양소), 세포 → 혈관(이산화 탄소·노폐물)
    body += shown(2, flow(id, 'M478 132 L500 168', C.red, { n: 2, dur: 1, w: 8 }) + flow(id, 'M530 132 L553 168', C.red, { n: 2, dur: 1.1, w: 8 }) + flow(id, 'M508 194 L484 232', C.muted, { n: 2, dur: 1, w: 8 }) + flow(id, 'M561 194 L536 232', C.muted, { n: 2, dur: 1.2, w: 8 }));
    body += VXS(2, 'c', 0.2) + at(2, 'pop', tag(300, 236, '세포 한 겹', LIL, { size: 18 }), 0.6);
    body += shown(3, flow(id, VEIN, C.blue, { n: 5, dur: 3.6, w: 9 })) + at(3, 'pop', tag(560, 330, '모세혈관', KEY, { size: 22 }), 0.6);
    put('8-2/과학/6/모세혈관', svg(id, body, css));
  })();

  // ════ 혈액: 시험관(혈장 층·혈구 층)과 크게 본 창 ════
  const tube = () => `<path d="M76 70 H124 V196 H76 Z" fill="${C.yellow}" fill-opacity=".5"/><path d="M76 196 H124 V204 H76 Z" fill="white"/><path d="M76 204 H124 V290 Q124 326 100 326 Q76 326 76 290 Z" fill="${C.red}" fill-opacity=".45"/>`;
  const tubeGlass = `<path d="M72 40 V290 Q72 330 100 330 Q128 330 128 290 V40" fill="none" stroke="${C.ink}" stroke-width="4" stroke-linecap="round"/>`;
  const tubeScene = (id) => {
    // 칸 1: 섞인 혈액이 두 층으로 나뉜다
    let s = `<g class="fout fout1" style="animation-delay:.7s"><path d="M76 70 H124 V290 Q124 326 100 326 Q76 326 76 290 Z" fill="${C.red}" fill-opacity=".38"/></g>`;
    s += `<g class="b1">${g('fin fin1', tube(), 0.6)}</g>` + tubeGlass;
    s += at(1, 'pop', lead(128, 130, 170, 130) + text(178, 137, '혈장', { size: 19, anchor: 'start' }), 1.2) + at(1, 'pop', lead(128, 262, 170, 262) + text(178, 269, '혈구', { size: 19, anchor: 'start' }), 1.4);
    return s;
  };
  const WIN = [240, 30, 270, 300];
  const win = () => `<rect x="${WIN[0]}" y="${WIN[1]}" width="${WIN[2]}" height="${WIN[3]}" rx="20" fill="#fdf6dc" stroke="${C.orange}" stroke-width="3"/>`;
  const R_POS = [[290, 72], [352, 96], [420, 70], [474, 118], [300, 160], [382, 176], [452, 196], [292, 252], [362, 290], [446, 300], [478, 250], [330, 210]];
  const P_POS = [[336, 128], [420, 128], [486, 168], [292, 306], [418, 236]];
  const cellsIn = () => R_POS.map(([x, y], k) => `<g class="bob" style="animation-delay:-${f(k * 0.37)}s">${rbc(x, y)}</g>`).join('')
    + `<g class="bob" style="animation-delay:-1s">${wbc(392, 246, 26)}</g>` + P_POS.map(([x, y], k) => `<g class="bob" style="animation-delay:-${f(k * 0.5)}s">${plt(x, y)}</g>`).join('');

  (function () {
    const id = 't82-s6-hj';
    let css = base(id);
    let body = tubeScene(id);
    body += at(2, 'fin', win() + lead(218, 130, 240, 124), 0);
    const W1 = 'M250 90 C320 60 400 120 500 90', W2 = 'M250 180 C320 150 400 210 500 180', W3 = 'M250 270 C320 240 400 300 500 270';
    body += shown(2, flow(id, W1, C.orange, { n: 5, dur: 3, w: 12 }) + flow(id, W2, C.muted, { n: 6, dur: 3.2, w: 10 }) + flow(id, W3, C.purple, { n: 5, dur: 3.4, w: 10 }));
    body += at(2, 'pop', tag(572, 90, '영양소', SUN, { size: 18 }), 0.6) + at(2, 'pop', tag(572, 180, '이산화 탄소', GRAY, { size: 18 }), 0.8) + at(2, 'pop', tag(572, 270, '노폐물', LIL, { size: 18 }), 1.0);
    body += at(2, 'pop', tag(375, 330, '대부분 물', COLD, { size: 18 }), 1.3);
    body += glowRect(70, 64, 60, 138, 3, C.red, 0.1, 8) + at(3, 'pop', tag(180, 60, '혈장', KEY, { size: 24 }), 0.6);
    put('8-2/과학/6/혈장', svg(id, body, css));
  })();

  (function () {
    const id = 't82-s6-hg';
    let css = base(id);
    let body = tubeScene(id);
    body += at(2, 'fin', win() + lead(218, 262, 240, 262) + cellsIn(), 0);
    body += at(2, 'pop', lead(474, 118, 530, 90) + tag(574, 90, '적혈구', HOT, { size: 18 }), 0.6) + at(2, 'pop', lead(418, 246, 530, 200) + tag(574, 200, '백혈구', LIL, { size: 18 }), 0.9) + at(2, 'pop', lead(492, 172, 530, 300) + tag(574, 300, '혈소판', LIL, { size: 18 }), 1.2);
    body += glowRect(70, 200, 60, 132, 3, C.red, 0.1, 10) + at(3, 'pop', tag(180, 330, '혈구', KEY, { size: 24 }), 0.6);
    put('8-2/과학/6/혈구', svg(id, body, css));
  })();

  // ── 적혈구: 가운데가 오목한 원반, 허파에서 산소를 싣고 조직 세포에 내려놓는다 ──
  (function () {
    const id = 't82-s6-jh';
    let css = base(id);
    let body = `<circle cx="130" cy="120" r="66" fill="${C.peach}" stroke="${C.red}" stroke-width="4"/><circle cx="130" cy="120" r="30" fill="white" fill-opacity=".7"/>`;
    body += `<path d="M64 270 Q64 240 98 244 Q130 254 162 244 Q196 240 196 270 Q196 300 162 296 Q130 286 98 296 Q64 300 64 270 Z" fill="${C.peach}" stroke="${C.red}" stroke-width="4"/>`;
    body += text(130, 214, '위에서', { size: 18, color: C.muted }) + text(130, 334, '옆에서', { size: 18, color: C.muted });
    body += at(1, 'pop', lead(130, 260, 230, 300) + tag(276, 312, '오목', HOT, { size: 18 }), 0.6);
    // 칸 2: 허파 → 조직 세포
    body += at(2, 'fin', `<rect x="300" y="40" width="130" height="64" rx="14" fill="#fbe3cf" stroke="${C.red}" stroke-width="3"/>` + text(365, 80, '허파', { size: 19 }) + `<rect x="470" y="250" width="150" height="70" rx="14" fill="${C.mint}" stroke="${C.green}" stroke-width="3"/>` + text(545, 292, '조직 세포', { size: 19 })
      + `<path d="M380 104 Q410 190 480 222" fill="none" stroke="${C.line}" stroke-width="4" stroke-dasharray="6 8"/>`, 0);
    const O2 = [[-12, -18], [14, -16], [18, 10]].map(([dx, dy], k) => `<g class="o2 o2${k}"><circle cx="${380 + dx}" cy="${128 + dy}" r="7" fill="${C.purple}" stroke="white" stroke-width="2"/></g>`).join('');
    body += `<g class="b2"><g class="rc">${rbc(380, 128, 20)}<g class="b2">${g('pop pop2', O2, 0.3)}</g></g></g>`;
    css += steps(id, 'rc', ['translate(0px,0px)', null, 'translate(100px,92px)'], 1.0, 0.7);
    css += `.sc-${id} .o2 { opacity: 1; transition: transform .5s ease-in 1.7s, opacity .5s ease-in 1.7s; } .on2 .sc-${id} .o2 { transform: translate(28px, 38px); opacity: 0; }`;
    body += at(2, 'pop', star(528, 244, 10, C.lilac) + star(560, 248, 10, C.lilac), 1.9) + at(2, 'pop', tag(470, 160, '산소', LIL, { size: 18 }), 0.4);
    body += at(3, 'pop', lead(168, 132, 204, 150) + tag(262, 152, '헤모글로빈', HOT, { size: 18 }), 0.3) + ring(130, 120, 70, 3, C.red, 0.2) + at(3, 'pop', tag(380, 330, '적혈구', KEY, { size: 24 }), 0.8);
    put('8-2/과학/6/적혈구', svg(id, body, css));
  })();

  // ── 백혈구: 세균 쪽으로 가서 감싸 잡아먹는다 ──
  (function () {
    const id = 't82-s6-bh';
    let css = base(id);
    let body = `<rect x="20" y="20" width="600" height="320" rx="22" fill="#fdf6dc" stroke="${C.orange}" stroke-width="3"/>`;
    [[90, 70], [180, 300], [300, 60], [560, 300], [420, 300], [600, 70]].forEach(([x, y], k) => { body += `<g class="bob" style="animation-delay:-${f(k * 0.4)}s">${rbc(x, y, 18)}</g>`; });
    const bac = (x, y, a) => `<rect x="${x - 16}" y="${y - 7}" width="32" height="14" rx="7" transform="rotate(${a} ${x} ${y})" fill="${C.green}" fill-opacity=".85"/>`;
    const BAC = [[470, 160, 20], [500, 200, -30], [456, 214, 70]];
    body += `<g class="b1"><g class="bx">${g('pop pop1', BAC.map(([x, y, a]) => bac(x, y, a)).join(''), 0.3)}</g></g>` + `<g class="b1 h3">${g('pop pop1', tag(480, 110, '세균', OK, { size: 18 }), 0.8)}</g>`;
    css += `.sc-${id} .bx { transform-box: fill-box; transform-origin: center; transition: transform .5s ease-in 1.5s, opacity .5s ease-in 1.5s; } .on2 .sc-${id} .bx { transform: scale(.2); opacity: 0; }`;
    body += `<g class="wc">${wbc(170, 186, 44)}</g>`;
    css += steps(id, 'wc', ['translate(0px,0px)', null, 'translate(306px,0px)'], 1.1, 0.3);
    css += `@keyframes ${id}-gulp { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.18, .9); } } .sc-${id} .wg { transform-box: fill-box; transform-origin: center; } .on2 .sc-${id} .wg { animation: ${id}-gulp .6s ease-in-out 1.4s 2; }`;
    body = body.replace(`<g class="wc">`, `<g class="wc"><g class="wg">`).replace(`${wbc(170, 186, 44)}</g>`, `${wbc(170, 186, 44)}</g></g>`);
    body += `<g class="b1 h2">${g('pop pop1', lead(186, 176, 240, 120) + tag(262, 104, '핵', LIL, { size: 18 }), 1.1)}</g>`;
    body += at(3, 'pop', tag(300, 292, '백혈구', KEY, { size: 24 }), 0.4) + ring(476, 186, 50, 3, C.purple, 0.1);
    put('8-2/과학/6/백혈구', svg(id, body, css));
  })();

  // ── 혈소판: 혈관 벽의 틈에 모여 엉기고, 실 같은 그물이 틈을 막는다 ──
  (function () {
    const id = 't82-s6-hs';
    let css = base(id);
    let body = `<rect x="0" y="70" width="640" height="210" fill="#fdf6dc"/><rect x="0" y="52" width="640" height="20" fill="#f3dccd" stroke="${C.red}" stroke-width="3"/>`;
    body += `<rect x="-4" y="278" width="294" height="20" fill="#f3dccd" stroke="${C.red}" stroke-width="3"/><rect x="350" y="278" width="294" height="20" fill="#f3dccd" stroke="${C.red}" stroke-width="3"/>`;
    body += `<g class="fout fout1" style="animation-delay:.3s"><rect x="288" y="279" width="64" height="18" fill="#f3dccd"/><path d="M288 279 H352 M288 297 H352" stroke="${C.red}" stroke-width="3"/></g>`;
    [[70, 130], [170, 200], [420, 120], [540, 200], [600, 120], [250, 120]].forEach(([x, y], k) => { body += `<g class="bob" style="animation-delay:-${f(k * 0.4)}s">${rbc(x, y, 18)}</g>`; });
    body += at(1, 'pop', lead(320, 300, 320, 326) + tag(320, 338, '상처', HOT, { size: 18 }), 0.6);
    const PL = [[110, 220, 196, 52], [210, 150, 104, 120], [460, 230, -144, 46], [520, 150, -196, 122], [380, 200, -40, 72]];
    PL.forEach(([x, y, dx, dy], k) => {
      const pc = piece(id, `pl${k}`, plt(x, y, 1.6), [null, null, [dx, dy]], 1.0, f(0.2 + k * 0.1));
      body += pc.body; css += pc.css;
    });
    body += at(2, 'pop', tag(540, 330, '작은 조각', LIL, { size: 18 }), 0.8);
    const NET = 'M276 246 L364 290 M276 290 L364 246 M286 236 L300 300 M354 236 L340 300 M270 268 H370';
    body += drawPath(NET, 3, C.purple, 3, 0.2) + at(3, 'pop', tag(320, 30, '혈소판', KEY, { size: 24 }), 0.9);
    put('8-2/과학/6/혈소판', svg(id, body, css));
  })();

  // ════ 혈액 순환 고리: 위는 허파, 아래는 온몸, 가운데 심장 네 방 ════
  const L_RA = [200, 98, 98, 60], L_LA = [342, 98, 98, 60], L_RV = [200, 166, 110, 90], L_LV = [330, 166, 110, 92];
  const P = {
    폐동맥: 'M300 174 L320 154 V64', 허파: 'M320 40 H410', 폐정맥: 'M410 40 H500 V128 H436',
    대동맥: 'M400 212 H480 V321 H410', 온몸: 'M410 321 H230', 대정맥: 'M230 321 H160 V128 H204'
  };
  const loopBase = (dim = {}) => {
    const op = (k) => (dim[k] ? 0.25 : 0.7);
    let s = `<rect x="230" y="16" width="180" height="48" rx="14" fill="#fbe3cf" stroke="${C.red}" stroke-width="3"/>` + text(262, 47, '허파', { size: 19 });
    s += `<path d="M300 40 q10 -16 20 0 t20 0 t20 0 t20 0 t20 0" fill="none" stroke="${C.purple}" stroke-width="3"/>`;
    s += `<rect x="230" y="298" width="180" height="48" rx="14" fill="${C.mint}" stroke="${C.green}" stroke-width="3"/>` + text(262, 329, '온몸', { size: 19 });
    s += `<path d="M300 322 q10 -16 20 0 t20 0 t20 0 t20 0 t20 0" fill="none" stroke="${C.purple}" stroke-width="3"/>`;
    s += `<path d="${P.대정맥}" fill="none" stroke="${C.blue}" stroke-width="14" stroke-opacity="${op('대정맥')}" stroke-linejoin="round"/><path d="${P.폐정맥}" fill="none" stroke="${C.red}" stroke-width="14" stroke-opacity="${op('폐정맥')}" stroke-linejoin="round"/>`;
    s += `<path d="${P.대동맥}" fill="none" stroke="${C.red}" stroke-width="14" stroke-opacity="${op('대동맥')}" stroke-linejoin="round"/>`;
    s += room(L_RA, '#eef5fb', C.blue, 3) + room(L_LA, '#fdf0e6', C.red, 3) + room(L_RV, '#eef5fb', C.blue, 4) + room(L_LV, '#fdf0e6', C.red, 8);
    s += `<path d="${P.폐동맥}" fill="none" stroke="${C.blue}" stroke-width="14" stroke-opacity="${op('폐동맥')}" stroke-linejoin="round"/>`;
    s += text(249, 134, '우심방', { size: 18 }) + text(391, 134, '좌심방', { size: 18 }) + text(250, 238, '우심실', { size: 18 }) + text(385, 238, '좌심실', { size: 18 });
    return s;
  };
  const vlabel = (k, x, y, n, s = 0, anchor = 'start') => at(n, 'fin', text(x, y, k, { size: 18, anchor, color: C.ink }), s);
  const rf = (r, n, color, s = 0) => roomFill([r[0], r[1], r[2], r[3]], n, color, s);

  // ── 순환계 ──
  (function () {
    const id = 't82-s6-shw';
    let css = base(id);
    let body = loopBase();
    css += `.sc-${id} .hb { transform-box: fill-box; transform-origin: center; }`;
    body += `<g class="b1"><g class="hb beat1">${room(L_RA, 'none', C.blue, 3)}${room(L_LA, 'none', C.red, 3)}${room(L_RV, 'none', C.blue, 4)}${room(L_LV, 'none', C.red, 8)}</g></g>`;
    body += at(1, 'pop', lead(200, 200, 120, 200) + tag(80, 200, '심장', HOT), 0.5);
    body += shown(2, flow(id, P.대동맥, C.red, { n: 4, dur: 2 }) + flow(id, P.온몸, C.purple, { n: 3, dur: 2 }) + flow(id, P.대정맥, C.blue, { n: 5, dur: 2.6 }) + flow(id, P.폐동맥, C.blue, { n: 3, dur: 1.6 }) + flow(id, P.허파, C.purple, { n: 2, dur: 1.2 }) + flow(id, P.폐정맥, C.red, { n: 4, dur: 2 }));
    body += at(2, 'pop', lead(488, 290, 530, 290) + tag(574, 290, '혈관', COLD), 0.5);
    body += at(3, 'pop', lead(488, 236, 530, 236) + tag(574, 236, '혈액', HOT), 0.3) + at(3, 'pop', tag(560, 340, '순환계', KEY, { size: 24 }), 0.9);
    put('8-2/과학/6/순환계', svg(id, body, css));
  })();

  // ── 혈액 순환 ──
  (function () {
    const id = 't82-s6-hsh';
    let css = base(id);
    let body = glowPath(`${P.대동맥} ${P.온몸} ${P.대정맥}`, 2, C.yellow, 0.1, 30) + glowPath(`${P.폐동맥} ${P.허파} ${P.폐정맥}`, 2, C.orange, 1.2, 30) + loopBase();
    body += shown(1, flow(id, P.대동맥, C.red, { n: 4, dur: 2 }) + flow(id, P.온몸, C.purple, { n: 3, dur: 2 }) + flow(id, P.대정맥, C.blue, { n: 5, dur: 2.6 }) + flow(id, P.폐동맥, C.blue, { n: 3, dur: 1.6 }) + flow(id, P.허파, C.purple, { n: 2, dur: 1.2 }) + flow(id, P.폐정맥, C.red, { n: 4, dur: 2 }));
    body += at(2, 'pop', tag(80, 230, '온몸순환', OK, { size: 18 }), 0.4);
    body += at(2, 'pop', tag(570, 40, '허파순환', HOT, { size: 18 }), 1.5);
    body += at(3, 'pop', tag(560, 330, '혈액 순환', KEY, { size: 22 }), 0.6);
    put('8-2/과학/6/혈액 순환', svg(id, body, css));
  })();

  // ── 온몸순환 ──
  (function () {
    const id = 't82-s6-om';
    let css = base(id);
    let body = loopBase({ 폐동맥: 1, 폐정맥: 1 });
    body += rf(L_LV, 1, C.red, 0.1) + shown(1, flow(id, P.대동맥, C.red, { n: 4, dur: 2, delay: 0.3 })) + vlabel('대동맥', 492, 280, 1, 0.5);
    body += shown(2, flow(id, P.온몸, C.purple, { n: 3, dur: 2 })) + at(2, 'pop', tag(320, 278, '물질 교환', OK, { size: 18 }), 0.4);
    body += shown(3, flow(id, P.대정맥, C.blue, { n: 5, dur: 2.6 })) + vlabel('대정맥', 150, 230, 3, 0.3, 'end') + rf(L_RA, 3, C.blue, 0.9);
    body += at(3, 'pop', tag(560, 330, '온몸순환', KEY, { size: 22 }), 1.2);
    put('8-2/과학/6/온몸순환', svg(id, body, css));
  })();

  // ── 허파순환 ──
  (function () {
    const id = 't82-s6-hp';
    let css = base(id);
    let body = loopBase({ 대동맥: 1, 대정맥: 1 });
    body += rf(L_RV, 1, C.blue, 0.1) + shown(1, flow(id, P.폐동맥, C.blue, { n: 3, dur: 1.6, delay: 0.3 })) + vlabel('폐동맥', 330, 88, 1, 0.5);
    body += shown(2, flow(id, P.허파, C.purple, { n: 2, dur: 1.2 }) + flow(id, 'M380 0 V32', C.purple, { n: 2, dur: 0.9, w: 8 }) + flow(id, 'M350 32 V0', C.muted, { n: 2, dur: 0.9, w: 8 }));
    body += at(2, 'pop', tag(580, 150, '산소 받음', LIL, { size: 18 }), 0.4) + at(2, 'pop', tag(140, 40, '이산화 탄소 내놓음', GRAY, { size: 18 }), 0.7);
    body += shown(3, flow(id, P.폐정맥, C.red, { n: 4, dur: 2 })) + vlabel('폐정맥', 512, 100, 3, 0.3) + rf(L_LA, 3, C.red, 0.9);
    body += at(3, 'pop', tag(560, 330, '허파순환', KEY, { size: 22 }), 1.2);
    put('8-2/과학/6/허파순환', svg(id, body, css));
  })();

  // ════ 배설 ════
  const kidneyL = (cx, cy, s = 1) => `<path d="M${cx} ${cy - 64 * s} C${cx + 46 * s} ${cy - 64 * s} ${cx + 54 * s} ${cy - 14 * s} ${cx + 32 * s} ${cy} C${cx + 54 * s} ${cy + 14 * s} ${cx + 46 * s} ${cy + 64 * s} ${cx} ${cy + 64 * s} C${cx - 44 * s} ${cy + 64 * s} ${cx - 48 * s} ${cy - 64 * s} ${cx} ${cy - 64 * s} Z" fill="#f3dccd" stroke="${C.red}" stroke-width="3"/>`;
  const kidneyR = (cx, cy, s = 1) => `<path d="M${cx} ${cy - 64 * s} C${cx - 46 * s} ${cy - 64 * s} ${cx - 54 * s} ${cy - 14 * s} ${cx - 32 * s} ${cy} C${cx - 54 * s} ${cy + 14 * s} ${cx - 46 * s} ${cy + 64 * s} ${cx} ${cy + 64 * s} C${cx + 44 * s} ${cy + 64 * s} ${cx + 48 * s} ${cy - 64 * s} ${cx} ${cy - 64 * s} Z" fill="#f3dccd" stroke="${C.red}" stroke-width="3"/>`;
  const liver = (cx, cy) => `<path d="M${cx - 70} ${cy - 10} Q${cx - 10} ${cy - 50} ${cx + 66} ${cy - 30} Q${cx + 60} ${cy + 20} ${cx} ${cy + 36} Q${cx - 50} ${cy + 46} ${cx - 72} ${cy + 22} Z" fill="#f3dccd" stroke="${C.red}" stroke-width="3"/>`;

  // ── 배설계 ──
  (function () {
    const id = 't82-s6-bsg';
    let css = base(id);
    let body = `<path d="M306 16 V250" stroke="${C.red}" stroke-width="14" stroke-opacity=".55"/><path d="M334 16 V250" stroke="${C.blue}" stroke-width="14" stroke-opacity=".5"/>`;
    body += `<path d="M306 140 H258 M306 140 H382" stroke="${C.red}" stroke-width="8" stroke-opacity=".6"/><path d="M262 160 H334 M334 160 H378" stroke="${C.blue}" stroke-width="8" stroke-opacity=".55"/>`;
    body += kidneyL(226, 150) + kidneyR(414, 150);
    const UL = 'M254 176 Q268 240 298 278', UR = 'M386 176 Q372 240 342 278';
    body += [UL, UR, 'M320 322 V354'].map((d) => `<path d="${d}" fill="none" stroke="${C.orange}" stroke-width="10" stroke-linecap="round"/><path d="${d}" fill="none" stroke="#fdf3d0" stroke-width="5" stroke-linecap="round"/>`).join('');
    body += `<ellipse cx="320" cy="292" rx="48" ry="32" fill="#fdf3d0" stroke="${C.orange}" stroke-width="3"/>`;
    body += shown(1, flow(id, 'M306 16 V140 H226', C.red, { n: 4, dur: 2 }) + flow(id, 'M306 16 V140 H414', C.red, { n: 4, dur: 2 })) + at(1, 'pop', lead(186, 120, 120, 90) + tag(90, 76, '콩팥', HOT), 0.5);
    body += shown(2, flow(id, `M232 160 L254 176 Q268 240 298 278 L320 296 V354`, C.orange, { n: 4, dur: 2.4, w: 8 }) + flow(id, `M408 160 L386 176 Q372 240 342 278`, C.orange, { n: 3, dur: 2, w: 8 }));
    body += at(2, 'pop', lead(262, 230, 160, 236) + tag(116, 236, '오줌관', SUN, { size: 18 }), 0.3) + at(2, 'pop', lead(368, 296, 450, 300) + tag(490, 300, '방광', SUN, { size: 18 }), 0.6) + at(2, 'pop', lead(326, 342, 400, 346) + tag(436, 344, '요도', SUN, { size: 18 }), 0.9);
    body += ring(226, 150, 68, 3, C.green, 0.1) + ring(414, 150, 68, 3, C.green, 0.1) + ring(320, 292, 54, 3, C.green, 0.4) + at(3, 'pop', tag(560, 60, '배설계', KEY, { size: 24 }), 0.6);
    put('8-2/과학/6/배설계', svg(id, body, css));
  })();

  // ── 배설: 세포에서 생긴 노폐물 — 이산화 탄소는 허파로, 암모니아는 간에서 요소로, 요소와 물은 콩팥에서 오줌으로 ──
  (function () {
    const id = 't82-s6-bs';
    let css = base(id);
    let body = `<circle cx="100" cy="180" r="76" fill="#eef8f1" stroke="${C.green}" stroke-width="4"/>` + text(100, 128, '세포', { size: 19, color: C.green });
    body += hex(70, 168, 14) + `<rect x="104" y="150" width="8" height="34" rx="3" fill="${C.lilac}" stroke="${C.purple}" stroke-width="2"/><path d="M112 156 l10 -6 l10 6 M112 168 l10 -6 l10 6 M112 180 l10 -6 l10 6" fill="none" stroke="${C.orange}" stroke-width="3"/>` + `<circle cx="86" cy="214" r="10" fill="${C.orange}" stroke="white" stroke-width="2"/><circle cx="108" cy="214" r="10" fill="${C.blue}" stroke="white" stroke-width="2"/>`;
    body += at(1, 'fin', harrow(170, 140, 216, 86, C.muted, 4) + harrow(178, 180, 222, 180, C.blue, 4) + harrow(150, 230, 210, 280, C.red, 4), 0.2);
    body += at(1, 'pop', tag(290, 74, '이산화 탄소', GRAY, { size: 18 }), 0.5) + at(1, 'pop', tag(262, 180, '물', COLD, { size: 18 }), 0.7) + at(1, 'pop', tag(280, 292, '암모니아', HOT, { size: 18 }), 0.9);
    // 칸 2
    body += at(2, 'fin', `<rect x="440" y="44" width="110" height="58" rx="14" fill="#fbe3cf" stroke="${C.red}" stroke-width="3"/>` + text(495, 80, '허파', { size: 19 }) + harrow(354, 74, 432, 74, C.muted, 4), 0.1);
    body += at(2, 'fin', `<rect x="400" y="264" width="90" height="56" rx="14" fill="#f3dccd" stroke="${C.red}" stroke-width="3"/>` + text(445, 299, '간', { size: 19 }) + harrow(340, 292, 394, 292, C.red, 4), 0.6);
    body += at(2, 'pop', harrow(494, 292, 520, 292, C.orange, 4) + tag(568, 292, '요소', SUN, { size: 18 }), 1.2);
    // 칸 3: 콩팥 → 오줌
    body += at(3, 'fin', `<rect x="420" y="152" width="110" height="56" rx="14" fill="#f3dccd" stroke="${C.red}" stroke-width="3"/>` + text(475, 187, '콩팥', { size: 19 }) + harrow(286, 180, 412, 180, C.blue, 4) + harrow(568, 274, 512, 214, C.orange, 4), 0.1);
    body += at(3, 'pop', harrow(534, 180, 566, 180, C.orange, 4) + tag(600, 180, '오줌', SUN, { size: 18 }), 0.8);
    body += at(3, 'pop', tag(100, 320, '배설', KEY, { size: 24 }), 1.2);
    put('8-2/과학/6/배설', svg(id, body, css));
  })();

  // ── 암모니아·요소: 세포 → 간 → 콩팥 → 방광 ──
  const wastePath = (id, focus) => {
    let css = base(id);
    let body = `<circle cx="80" cy="170" r="58" fill="#eef8f1" stroke="${C.green}" stroke-width="4"/>` + text(80, 136, '세포', { size: 18, color: C.green });
    body += liver(260, 170) + text(256, 178, '간', { size: 19 });
    body += kidneyR(440, 170, 0.8);
    body += `<path d="M138 170 H190 M326 170 H400" stroke="${C.red}" stroke-width="10" stroke-opacity=".3" stroke-linecap="round"/>`;
    body += `<path d="M420 196 Q470 260 530 262" fill="none" stroke="${C.orange}" stroke-width="10" stroke-linecap="round"/><path d="M420 196 Q470 260 530 262" fill="none" stroke="#fdf3d0" stroke-width="5" stroke-linecap="round"/><ellipse cx="568" cy="266" rx="40" ry="28" fill="#fdf3d0" stroke="${C.orange}" stroke-width="3"/>`;
    body += text(440, 100, '콩팥', { size: 18 }) + text(568, 316, '방광', { size: 18 });
    const AM = flow(id, 'M100 170 H210', C.red, { n: 3, dur: 1.4, w: 12 }), UR = flow(id, 'M300 170 H430', C.orange, { n: 3, dur: 1.4, w: 12 }), PEE = flow(id, 'M430 186 Q470 260 530 262 L560 266', C.yellow, { n: 3, dur: 1.6, w: 10 });
    if (focus === 'am') {
      body += at(1, 'pop', `<circle cx="64" cy="186" r="10" fill="${C.orange}" stroke="white" stroke-width="2"/><circle cx="86" cy="190" r="10" fill="${C.blue}" stroke="white" stroke-width="2"/><circle cx="104" cy="182" r="10" fill="${C.purple}" stroke="white" stroke-width="2"/>`, 0.1) + at(1, 'pop', tag(80, 254, '단백질', HOT, { size: 18 }), 0.3);
      body += at(1, 'pop', harrow(80, 110, 80, 64, C.muted, 4) + tag(80, 42, '이산화 탄소·물', GRAY, { size: 18 }), 0.8) + at(1, 'pop', `<circle cx="70" cy="160" r="8" fill="${C.red}"/><circle cx="92" cy="156" r="8" fill="${C.red}"/>`, 1.2);
      body += shown(2, AM) + at(2, 'pop', tag(176, 100, '독성 강함', HOT, { size: 18 }), 0.5);
      body += shown(3, UR) + at(3, 'pop', tag(360, 110, '요소', SUN, { size: 18 }), 0.4) + at(3, 'pop', tag(160, 300, '암모니아', KEY, { size: 24 }), 0.9) + ring(160, 170, 30, 3, C.red, 0.2);
    } else {
      body += shown(1, AM) + at(1, 'pop', tag(176, 100, '암모니아', HOT, { size: 18 }), 0.5);
      body += `<g class="b2">${g('pulse pulse2', liver(260, 170).replace('#f3dccd', C.yellow).replace('stroke-width="3"', 'stroke-width="4" fill-opacity=".6"'), 0.1)}${text(256, 178, '간', { size: 19 })}</g>` + shown(2, UR) + at(2, 'pop', tag(362, 214, '독성 약함', OK, { size: 18 }), 0.7);
      body += shown(3, PEE) + at(3, 'pop', tag(568, 200, '오줌', SUN, { size: 18 }), 0.6) + at(3, 'pop', tag(360, 300, '요소', KEY, { size: 24 }), 0.9) + ring(360, 170, 30, 3, C.orange, 0.2);
    }
    return { body, css };
  };
  (function () { const r = wastePath('t82-s6-amo', 'am'); put('8-2/과학/6/암모니아', svg('t82-s6-amo', r.body, r.css)); })();
  (function () { const r = wastePath('t82-s6-yo', 'yo'); put('8-2/과학/6/요소', svg('t82-s6-yo', r.body, r.css)); })();

  // ════ 콩팥단위: 토리(실뭉치 혈관) · 보먼주머니(컵) · 세뇨관(가는 관) · 둘레 모세혈관 · 집합관 ════
  const GX = 170, GY = 165, CUP = 'M238 140 A72 72 0 1 1 102 140';
  const TUB = 'M222 214 C262 236 290 160 320 160 S352 186 380 186 V300 Q380 330 410 330 Q440 330 440 300 V160 C440 130 480 122 520 140 S566 172 596 160 V352';
  const TUB_OPEN = TUB.replace(' V352', '');
  const nephron = () => {
    let s = `<path d="M20 40 H104 Q148 40 150 124" fill="none" stroke="${C.red}" stroke-width="10" stroke-opacity=".7" stroke-linecap="round"/>`;
    s += `<path d="M190 128 Q206 74 262 74 H560" fill="none" stroke="${C.red}" stroke-width="7" stroke-opacity=".6" stroke-linecap="round"/><path d="M560 74 H640" stroke="${C.blue}" stroke-width="10" stroke-opacity=".6"/>`;
    s += `<path d="${TUB}" fill="none" stroke="${C.orange}" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/><path d="${TUB}" fill="none" stroke="#fff6d6" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>`;
    s += `<path d="${CUP}" fill="none" stroke="${C.blue}" stroke-width="20" stroke-linecap="round"/><path d="${CUP}" fill="none" stroke="${C.sky}" stroke-width="13" stroke-linecap="round"/>`;
    s += [[-15, -12], [15, -15], [-18, 15], [18, 12], [0, 0], [0, 21]].map(([dx, dy]) => `<circle cx="${GX + dx}" cy="${GY + dy}" r="19" fill="${C.peach}" stroke="${C.red}" stroke-width="3"/>`).join('');
    return s;
  };
  const NL = {
    토리: (n, s) => at(n, 'pop', lead(150, 172, 92, 214) + tag(60, 214, '토리', HOT, { size: 18 }), s),
    보먼주머니: (n, s) => at(n, 'pop', lead(236, 150, 256, 126) + tag(312, 118, '보먼주머니', COLD, { size: 18 }), s),
    세뇨관: (n, s) => at(n, 'pop', lead(440, 236, 486, 236) + tag(528, 236, '세뇨관', SUN, { size: 18 }), s),
    모세혈관: (n, s) => at(n, 'pop', lead(420, 74, 420, 44) + tag(420, 28, '모세혈관', HOT, { size: 18 }), s)
  };
  // 걸러지는 알갱이: 작은 것(물·포도당·아미노산·요소)은 칸 n 에 보먼주머니 안쪽으로 빠져나가고, 큰 것(혈구·단백질)은 남는다
  const dotP = (color, r = 8) => (x, y) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${color}" stroke="white" stroke-width="2"/>`;
  const SMALL = [[dotP(C.blue), [-14, -12], 25], [dotP(C.blue), [16, 8], 55], [(x, y) => hex(x, y, 9), [10, -18], 85], [dotP(C.orange), [-16, 14], 115], [dotP(C.purple, 7), [4, 4], 145], [dotP(C.purple, 7), [-6, -24], 70]]
    .map(([draw, [dx, dy], a]) => { const r = a === 70 ? 46 : 56, t = (a * Math.PI) / 180; return [draw, [GX + dx, GY + dy], [f(GX + r * Math.cos(t)), f(GY + r * Math.sin(t))]]; });
  const PROT = (x, y) => `<path d="M${x - 14} ${y} q5 -14 16 -8 q11 -8 16 6 q8 8 -3 16 q-8 11 -19 3 q-13 0 -10 -17 Z" fill="${C.green}" fill-opacity=".85"/>`;
  const filtering = (id, n) => {
    let body = '', css = '';
    SMALL.forEach(([draw, [x, y], [tx, ty]], k) => { const pc = piece(id, `sm${k}`, draw(x, y), Array.from({ length: n + 1 }, (_, i) => (i === 0 ? [0, 0] : i === n ? [tx - x, ty - y] : null)), 0.9, f(0.3 + k * 0.12)); body += pc.body; css += pc.css; });
    body += `<g class="bob">${rbc(GX + 8, GY - 4, 13)}</g><g class="bob" style="animation-delay:-1.3s">${PROT(GX - 8, GY + 12)}</g>`;
    return { body, css };
  };

  // ── 콩팥단위 ──
  (function () {
    const id = 't82-s6-kp';
    let css = base(id);
    let body = nephron();
    body += at(1, 'pop', kidneyL(300, 284, 0.8) + `<path d="M286 244 q-14 30 6 52 q10 12 -4 22" fill="none" stroke="${C.orange}" stroke-width="3"/>` + text(300, 356, '콩팥', { size: 18 }), 0.2) + at(1, 'pop', `<rect x="278" y="238" width="22" height="22" fill="none" stroke="${C.ink}" stroke-width="2.5"/>` + lead(278, 238, 226, 222), 0.8);
    body += NL.토리(2, 0.1) + NL.보먼주머니(2, 0.5) + NL.세뇨관(2, 0.9);
    body += glowPath(`${CUP} ${TUB_OPEN}`, 3, C.yellow, 0.1, 26) + at(3, 'pop', tag(520, 320, '콩팥단위', KEY, { size: 22 }), 0.7);
    put('8-2/과학/6/콩팥단위', svg(id, body, css));
  })();

  // ── 토리 ──
  (function () {
    const id = 't82-s6-tori';
    let css = base(id);
    let body = nephron();
    body += shown(1, flow(id, 'M20 40 H104 Q148 40 150 124', C.red, { n: 3, dur: 1.4, w: 9 })) + ring(GX, GY, 44, 1, C.red, 0.4) + NL.토리(1, 0.8);
    const fl = filtering(id, 2); body += fl.body; css += fl.css;
    body += at(2, 'pop', tag(300, 290, '압력이 높음', HOT, { size: 18 }), 0.2);
    body += at(3, 'pop', tag(80, 300, '토리', KEY, { size: 24 }), 0.4) + ring(GX, GY, 44, 3, C.red, 0.1);
    put('8-2/과학/6/토리', svg(id, body, css));
  })();

  // ── 보먼주머니 ──
  (function () {
    const id = 't82-s6-bm';
    let css = base(id);
    let body = nephron();
    body += glowPath(CUP, 1, C.yellow, 0.2, 26) + NL.보먼주머니(1, 0.8);
    const fl = filtering(id, 2); body += fl.body; css += fl.css;
    body += shown(3, flow(id, 'M170 222 L222 214 C262 236 290 160 320 160 S352 186 380 186 V250', C.blue, { n: 4, dur: 2, w: 8 }));
    body += at(3, 'pop', tag(110, 300, '보먼주머니', KEY, { size: 22 }), 0.6);
    put('8-2/과학/6/보먼주머니', svg(id, body, css));
  })();

  // ── 세뇨관·재흡수 공통: 관을 따라 흐르다가 쓸 것은 위의 모세혈관으로 돌아간다 ──
  const TUB_FLOW = (id) => flow(id, TUB, C.blue, { n: 6, dur: 4.5, w: 8 }) + flow(id, TUB, C.orange, { n: 4, dur: 4.5, w: 8, delay: -0.6 }) + flow(id, TUB, C.purple, { n: 5, dur: 4.5, w: 7, delay: -1.2 });
  const BACK = (id) => flow(id, 'M304 162 V82', C.orange, { n: 2, dur: 1, w: 9, trail: true }) + flow(id, 'M350 176 V82', C.blue, { n: 2, dur: 1.1, w: 9, trail: true }) + flow(id, 'M500 134 V82', C.orange, { n: 2, dur: 1, w: 9, trail: true }) + flow(id, 'M546 152 V82', C.blue, { n: 2, dur: 1.2, w: 9, trail: true }) + flow(id, 'M440 190 V82', C.blue, { n: 2, dur: 1.2, w: 9, trail: true });
  const URINE = (id) => flow(id, 'M596 170 V352', C.purple, { n: 4, dur: 2, w: 8 }) + flow(id, 'M596 170 V352', C.blue, { n: 2, dur: 2, w: 8, delay: -0.5 });

  (function () {
    const id = 't82-s6-snk';
    let css = base(id);
    let body = nephron();
    body += glowPath(TUB_OPEN, 1, C.yellow, 0.1, 26) + shown(1, TUB_FLOW(id), 3) + NL.세뇨관(1, 0.6);
    body += shown(2, BACK(id)) + NL.모세혈관(2, 0.2) + at(2, 'pop', tag(190, 292, '포도당·아미노산·물', SUN, { size: 18 }), 0.6);
    body += shown(3, URINE(id)) + at(3, 'pop', tag(530, 330, '오줌', SUN, { size: 18 }), 0.4) + at(3, 'pop', tag(110, 338, '세뇨관', KEY, { size: 24 }), 0.8);
    put('8-2/과학/6/세뇨관', svg(id, body, css));
  })();

  // ── 여과 ──
  (function () {
    const id = 't82-s6-yg';
    let css = base(id);
    let body = nephron() + NL.토리(1, 0.2) + NL.보먼주머니(1, 0.4);
    const fl = filtering(id, 2); body += fl.body; css += fl.css;
    // 범례
    const LG = `<rect x="16" y="256" width="340" height="96" rx="14" fill="white" stroke="${C.line}" stroke-width="2.5"/>`
      + `<circle cx="36" cy="282" r="7" fill="${C.blue}"/>` + text(50, 289, '물', { size: 18, anchor: 'start' }) + hex(92, 282, 8) + text(106, 289, '포도당', { size: 18, anchor: 'start' })
      + `<circle cx="180" cy="282" r="7" fill="${C.orange}"/>` + text(194, 289, '아미노산', { size: 18, anchor: 'start' }) + `<circle cx="282" cy="282" r="6" fill="${C.purple}"/>` + text(294, 289, '요소', { size: 18, anchor: 'start' })
      + rbc(38, 324, 10) + text(56, 331, '혈구', { size: 18, anchor: 'start' }) + PROT(128, 322) + text(156, 331, '단백질', { size: 18, anchor: 'start' });
    body += at(1, 'fin', LG, 0.6);
    body += at(2, 'pop', cross(240, 324, 10), 1.2) + at(2, 'pop', tag(304, 324, '남음', GRAY, { size: 18 }), 1.3);
    body += ring(GX, GY, 76, 3, C.blue, 0.1) + at(3, 'pop', tag(520, 320, '여과', KEY, { size: 24 }), 0.6);
    put('8-2/과학/6/여과', svg(id, body, css));
  })();

  // ── 재흡수 ──
  (function () {
    const id = 't82-s6-jhs';
    let css = base(id);
    let body = nephron() + NL.세뇨관(1, 0.2) + NL.모세혈관(1, 0.4);
    body += shown(1, TUB_FLOW(id));
    body += at(1, 'pop', tag(190, 270, '요소·물·포도당·아미노산', GRAY, { size: 18 }), 0.8);
    body += shown(2, BACK(id)) + at(2, 'pop', tag(190, 306, '포도당·아미노산: 모두', SUN, { size: 18 }), 0.5) + at(2, 'pop', tag(190, 342, '물: 대부분', COLD, { size: 18 }), 0.8);
    body += shown(3, URINE(id)) + at(3, 'pop', tag(530, 330, '오줌', SUN, { size: 18 }), 0.4) + at(3, 'pop', tag(66, 104, '재흡수', KEY, { size: 22 }), 0.8);
    put('8-2/과학/6/재흡수', svg(id, body, css));
  })();
})(typeof window !== 'undefined' ? window : globalThis);
