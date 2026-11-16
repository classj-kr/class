// 과학 중2-2(8-2) Ⅷ단원 「별과 우주」 낱말 도식: 시차·연주 시차·파섹·광년, 겉보기 등급·절대 등급, 은하·우리은하, 성단·성간 물질·성운, 외부 은하·우주 팽창.
// 각과 거리는 잘 보이게 크게 그렸다(실제 연주 시차는 1″보다 작다). 연주 시차는 6개월 간격 두 자리에서 본 시차의 절반, 1 pc ≈ 3.26 광년, 등급은 숫자가 작을수록 밝다.
// 우리은하는 지름 약 30000 pc, 태양계는 중심에서 약 8500 pc 떨어진 나선팔에 있다(옆에서 보면 중심부가 볼록한 원반).
// 위에서 본 공전은 시계 반대 방향. 모양·위치 속성은 CSS 로 바꾸지 않는다(transform·opacity·stroke-dashoffset 만).
(function (root) {
  'use strict';
  const { C, svg, text, put } = root.FigureKit;
  const f = (n) => +(+n).toFixed(1);
  const rad = (a) => (a * Math.PI) / 180;
  const dl = (s) => (s ? ` style="animation-delay:${s}s"` : '');
  const g = (cls, inner, s = 0) => `<g class="${cls}"${dl(s)}>${inner}</g>`;
  const at = (n, kind, inner, s = 0) => `<g class="b${n}">${g(`${kind} ${kind}${n}`, inner, s)}</g>`;
  const shown = (n, inner, hide) => `<g class="b${n}${hide ? ' h' + hide : ''}">${inner}</g>`;
  const tw = (s, size) => [...String(s)].reduce((a, c) => a + (/[가-힣]/.test(c) ? 1 : c === ' ' ? 0.34 : /[+−=×÷≈~]/.test(c) ? 0.78 : 0.62), 0) * size;
  const HOT = [C.peach, C.red], COLD = [C.sky, C.blue], OK = [C.mint, C.green], GRAY = ['white', C.muted], LIL = [C.lilac, C.purple], KEY = [C.peach, C.red], SUN = [C.yellow, C.orange];
  const tag = (cx, cy, label, [fill, stroke] = OK, { size = 20 } = {}) => {
    const w = Math.round(tw(label, size) + size * 1.3), h = Math.round(size * 1.7);
    return `<g><rect x="${f(cx - w / 2)}" y="${f(cy - h / 2)}" width="${w}" height="${h}" rx="${h / 2}" fill="${fill}" stroke="${stroke}" stroke-width="2.5"/>${text(f(cx), f(cy + size * 0.36), label, { size })}</g>`;
  };
  const lead = (x1, y1, x2, y2, color = C.muted) => `<path d="M${f(x1)} ${f(y1)} L${f(x2)} ${f(y2)}" stroke="${color}" stroke-width="2.5" stroke-linecap="round"/>`;
  const ring = (cx, cy, r, n, color = C.green, s = 0) => `<g class="b${n}"><circle class="ring ring${n}"${dl(s)} cx="${f(cx)}" cy="${f(cy)}" r="${r}" fill="none" stroke="${color}" stroke-width="4"/></g>`;
  const drawPath = (d, n, color, w = 4, s = 0, extra = '') => `<g class="b${n}"><path class="draw draw${n}"${dl(s)} pathLength="1" d="${d}" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" fill="none"${extra}/></g>`;
  // 흰 테두리 글자(선 위에 얹는 수)
  const halo = (x, y, s, { size = 18, color = C.ink, anchor = 'middle' } = {}) => `<text x="${f(x)}" y="${f(y)}" text-anchor="${anchor}" font-size="${size}" font-weight="700" fill="${color}" stroke="${C.paper}" stroke-width="5" paint-order="stroke" stroke-linejoin="round">${s}</text>`;

  const base = (id) => {
    let s = `
    .sc-${id} .pop, .sc-${id} .pulse, .sc-${id} .ring { transform-box: fill-box; transform-origin: center; }
    .sc-${id} .draw { stroke-dasharray: 1; stroke-dashoffset: 1; }
    .sc-${id} .ring { opacity: 0; }
    .sc-${id} .tw { animation: ${id}-tw 2.4s ease-in-out infinite; }
    @keyframes ${id}-tw { 0%, 100% { opacity: 1; } 50% { opacity: .55; } }
    @keyframes ${id}-spin { to { transform: rotate(360deg); } }
    @keyframes ${id}-pop { 0% { opacity: 0; transform: scale(.3); } 70% { opacity: 1; transform: scale(1.12); } 100% { opacity: 1; transform: scale(1); } }
    @keyframes ${id}-fin { from { opacity: 0; } to { opacity: 1; } }
    @keyframes ${id}-rise { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
    @keyframes ${id}-pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.14); } }
    @keyframes ${id}-flash { 0% { opacity: 0; } 20% { opacity: 1; } 40% { opacity: .25; } 60% { opacity: 1; } 80% { opacity: .25; } 100% { opacity: 1; } }
    @keyframes ${id}-ring { 0% { opacity: .9; transform: scale(1); } 100% { opacity: 0; transform: scale(1.6); } }
    @keyframes ${id}-drawk { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
    `;
    for (let n = 1; n <= 5; n++) s += `
    .on${n} .sc-${id} .pop${n} { animation: ${id}-pop .5s ease-out both; }
    .on${n} .sc-${id} .fin${n} { animation: ${id}-fin .6s ease-out both; }
    .on${n} .sc-${id} .rise${n} { animation: ${id}-rise .5s ease-out both; }
    .on${n} .sc-${id} .pulse${n} { animation: ${id}-pulse .7s ease-in-out .3s 2; }
    .on${n} .sc-${id} .flash${n} { animation: ${id}-flash 1.4s ease-in-out both; }
    .on${n} .sc-${id} .ring${n} { animation: ${id}-ring 1.1s ease-out .3s 2; }
    .on${n} .sc-${id} .draw${n} { animation: ${id}-drawk 1.2s ease-in-out .2s both; }`;
    return s;
  };
  const fade = (id, cls, states, delay = 0.6, sec = 0.5) => `.sc-${id} .${cls} { opacity: ${states[0]}; transition: opacity ${sec}s ease; }`
    + states.slice(1).map((v, i) => (v == null ? '' : `.on${i + 1} .sc-${id} .${cls} { opacity: ${v}; transition-delay: ${v ? delay : 0.1}s; }`)).join('');
  const steps = (id, cls, vals, sec = 1.1, delay = 0.2, extra = '') => `.sc-${id} .${cls} { transform: ${vals[0]}; transition: transform ${sec}s ease-in-out ${delay}s;${extra} }`
    + vals.slice(1).map((v, i) => (v == null ? '' : `.on${i + 1} .sc-${id} .${cls} { transform: ${v}; }`)).join('');
  const seeded = (seed) => () => (seed = (seed * 16807) % 2147483647) / 2147483647;

  // ── 공통 그림 ──
  // 반짝이는 별(네 갈래)
  const spark = (x, y, r, fill = C.yellow, stroke = C.orange) => `<path d="M${f(x)} ${f(y - r)} Q${f(x + r * 0.18)} ${f(y - r * 0.18)} ${f(x + r)} ${f(y)} Q${f(x + r * 0.18)} ${f(y + r * 0.18)} ${f(x)} ${f(y + r)} Q${f(x - r * 0.18)} ${f(y + r * 0.18)} ${f(x - r)} ${f(y)} Q${f(x - r * 0.18)} ${f(y - r * 0.18)} ${f(x)} ${f(y - r)} Z" fill="${fill}" stroke="${stroke}" stroke-width="2" stroke-linejoin="round"/>`;
  // 빛나는 별(둥근 빛무리 + 몸통)
  const glowStar = (x, y, r, fill = C.yellow, stroke = C.orange) => `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r * 1.7)}" fill="${fill}" opacity=".35"/><circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="${fill}" stroke="${stroke}" stroke-width="2.5"/>`;
  // 점 여러 개를 한 줄(path)로: 둥근 끝 0 길이 선
  const dots = (pts, w, color, op = 1) => `<path d="${pts.map(([x, y]) => `M${f(x)} ${f(y)}h0`).join('')}" stroke="${color}" stroke-width="${w}" stroke-linecap="round" fill="none" opacity="${op}"/>`;
  const eye = (x, y) => `<path d="M${x - 22} ${y} Q${x} ${y - 17} ${x + 22} ${y} Q${x} ${y + 17} ${x - 22} ${y} Z" fill="white" stroke="${C.ink}" stroke-width="2.5"/><circle cx="${x}" cy="${y}" r="7" fill="${C.ink}"/>`;
  const earth = (x, y, r = 12) => `<circle cx="${f(x)}" cy="${f(y)}" r="${r}" fill="${C.sky}" stroke="${C.blue}" stroke-width="3"/><path d="M${f(x - r * 0.5)} ${f(y - r * 0.3)} q${f(r * 0.4)} ${f(-r * 0.3)} ${f(r * 0.7)} ${f(r * 0.1)} q${f(-r * 0.1)} ${f(r * 0.5)} ${f(-r * 0.6)} ${f(r * 0.5)}" fill="${C.green}" opacity=".7"/>`;
  // 몽실한 구름 모양(가장자리를 흔든 닫힌 곡선)
  const blob = (cx, cy, rx, ry, seed = 3, amp = 0.16) => {
    const r = seeded(seed), ph = [r() * 6, r() * 6, r() * 6], n = 28, pts = [];
    for (let i = 0; i < n; i++) { const t = (i / n) * Math.PI * 2, k = 1 + amp * (Math.sin(3 * t + ph[0]) * 0.6 + Math.sin(5 * t + ph[1]) * 0.3 + Math.sin(7 * t + ph[2]) * 0.2); pts.push([cx + rx * k * Math.cos(t), cy + ry * k * Math.sin(t)]); }
    const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
    let d = `M${f(mid(pts[n - 1], pts[0])[0])} ${f(mid(pts[n - 1], pts[0])[1])}`;
    for (let i = 0; i < n; i++) { const m = mid(pts[i], pts[(i + 1) % n]); d += ` Q${f(pts[i][0])} ${f(pts[i][1])} ${f(m[0])} ${f(m[1])}`; }
    return d + ' Z';
  };
  // 나선 은하(가운데 0,0, 평평한 좌표). bar 가 있으면 막대 나선
  const spiral = ({ R = 140, seed = 7, bar = 0, turns = 3.6, n = 70 } = {}) => {
    const r = seeded(seed), r0 = bar || R * 0.14, b = Math.log(R / r0) / turns;
    const small = [], big = [], dust = [];
    let arms = '';
    for (const a0 of [0, Math.PI]) {
      let arm = '';
      for (let i = 0; i <= 40; i++) { const t = (i / 40) * turns, rr = r0 * Math.exp(b * t), ang = t + a0 + rad(25); arm += `${i ? 'L' : 'M'}${f(rr * Math.cos(ang))} ${f(rr * Math.sin(ang))} `; }
      arms += arm;
      for (let i = 0; i < n; i++) {
        const t = r() * turns, rr = r0 * Math.exp(b * t), ang = t + a0 + rad(25) + (r() - 0.5) * 0.35, j = (r() - 0.5) * rr * 0.16;
        const p = [(rr + j) * Math.cos(ang), (rr + j) * Math.sin(ang)];
        (r() < 0.22 ? big : small).push(p);
      }
      for (let i = 0; i <= 30; i++) { const t = 0.4 + (i / 30) * (turns - 0.6), rr = r0 * Math.exp(b * t) * 0.93, ang = t + a0 + rad(25) - 0.12; dust.push(`${i ? 'L' : 'M'}${f(rr * Math.cos(ang))} ${f(rr * Math.sin(ang))}`); }
    }
    for (let i = 0; i < 70; i++) { const rr = Math.sqrt(r()) * R * 0.9, ang = r() * Math.PI * 2; small.push([rr * Math.cos(ang), rr * Math.sin(ang)]); }
    let s = `<circle r="${f(R)}" fill="${C.sky}" opacity=".35"/>`;
    s += `<path d="${arms}" stroke="${C.sky}" stroke-width="${f(R * 0.2)}" fill="none" stroke-linecap="round" opacity=".9"/>`;
    s += `<path d="${dust.join(' ')}" stroke="${C.muted}" stroke-width="${f(R * 0.035)}" fill="none" stroke-linecap="round" opacity=".45"/>`;
    s += dots(small, Math.max(2.5, R * 0.025), C.blue, 0.7) + dots(big, Math.max(4, R * 0.045), C.blue);
    if (bar) s += `<ellipse rx="${f(bar * 1.05)}" ry="${f(bar * 0.36)}" fill="${C.yellow}" stroke="${C.orange}" stroke-width="2" transform="rotate(25)"/>`;
    s += `<circle r="${f(R * 0.16)}" fill="${C.yellow}" opacity=".85"/><circle r="${f(R * 0.08)}" fill="white" opacity=".8"/>`;
    return s;
  };
  // 작은 은하 그림: 나선(기울기 tilt 0~1), 타원, 불규칙
  const spiralIcon = (x, y, R, rot = 0, tilt = 1, seed = 5) => `<g transform="translate(${f(x)} ${f(y)}) rotate(${rot}) scale(1 ${tilt})">${spiral({ R, seed, n: 26 })}</g>`;
  const ellipIcon = (x, y, rx, ry, rot = 0) => `<g transform="translate(${f(x)} ${f(y)}) rotate(${rot})"><ellipse rx="${rx}" ry="${ry}" fill="${C.peach}" opacity=".7"/><ellipse rx="${f(rx * 0.62)}" ry="${f(ry * 0.62)}" fill="${C.yellow}" opacity=".8"/><ellipse rx="${f(rx * 0.25)}" ry="${f(ry * 0.25)}" fill="white" opacity=".9"/></g>`;
  const irrIcon = (x, y, R, seed = 9) => {
    const r = seeded(seed), pts = Array.from({ length: 26 }, () => [x + (r() - 0.5) * R * 2, y + (r() - 0.5) * R * 1.4]);
    return `<path d="${blob(x, y, R, R * 0.7, seed, 0.3)}" fill="${C.lilac}" opacity=".8"/>` + dots(pts, 3.5, C.purple, 0.8);
  };

  // ════ 시차·연주 시차·파섹·광년 ════

  // ── 시차: 보는 자리를 옮기면 가까운 물체가 먼 배경 위에서 옮겨 가 보인다 ──
  (function () {
    const id = 't82-s8-sicha';
    let css = base(id);
    const BY = 96, A = [220, 320], Bp = [420, 320], O = [320, 190], O2 = [320, 255];
    const hit = (e, o) => e[0] + (o[0] - e[0]) * ((BY - e[1]) / (o[1] - e[1]));
    let body = `<path d="M0 ${BY} L0 70 L40 58 L80 78 L130 44 L180 74 L230 52 L280 82 L330 50 L380 74 L430 46 L480 80 L530 56 L580 76 L640 52 L640 ${BY} Z" fill="${C.mint}" stroke="${C.green}" stroke-width="2.5" stroke-linejoin="round"/>`;
    body += text(600, 128, '먼 산', { size: 18, color: C.muted });
    const tree = (x, y, s = 1, op = 1) => `<g opacity="${op}"><path d="M${x} ${y} V${f(y - 26 * s)}" stroke="${C.orange}" stroke-width="${f(6 * s)}" stroke-linecap="round"/><circle cx="${x}" cy="${f(y - 34 * s)}" r="${f(16 * s)}" fill="${C.green}"/></g>`;
    const sight = (e, o, n, s, color) => drawPath(`M${e[0]} ${e[1]} L${f(hit(e, o))} ${BY}`, n, color, 3, s, ' stroke-dasharray="1"');
    body += sight(A, O, 1, 0.3, C.blue) + sight(Bp, O, 2, 0.3, C.red);
    body += tree(O[0], O[1] + 20) + text(O[0] + 52, O[1] + 6, '나무', { size: 18 });
    body += eye(A[0], A[1]) + eye(Bp[0], Bp[1]) + text(A[0] - 44, A[1] + 7, 'A', { size: 20, color: C.blue }) + text(Bp[0] + 44, Bp[1] + 7, 'B', { size: 20, color: C.red });
    body += at(1, 'pop', tree(f(hit(A, O)), BY - 2, 0.7, 0.75) + `<circle cx="${f(hit(A, O))}" cy="${BY}" r="7" fill="${C.blue}"/>`, 1.2);
    body += at(2, 'pop', tree(f(hit(Bp, O)), BY - 2, 0.7, 0.75) + `<circle cx="${f(hit(Bp, O))}" cy="${BY}" r="7" fill="${C.red}"/>`, 1.2);
    body += at(2, 'fin', `<path d="M${f(hit(A, O) - 14)} ${BY + 18} Q320 ${BY + 40} ${f(hit(Bp, O) + 18)} ${BY + 18}" stroke="${C.purple}" stroke-width="3.5" fill="none"/><path d="M${f(hit(Bp, O) + 30)} ${BY + 14} L${f(hit(Bp, O) + 17)} ${BY + 18} L${f(hit(Bp, O) + 26)} ${BY + 29}" stroke="${C.purple}" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`, 1.5);
    // 각
    const arc = (o, r, color, w) => { const a1 = Math.atan2(A[1] - o[1], A[0] - o[0]), a2 = Math.atan2(Bp[1] - o[1], Bp[0] - o[0]); return `<path d="M${f(o[0] + r * Math.cos(a1))} ${f(o[1] + r * Math.sin(a1))} A${r} ${r} 0 0 0 ${f(o[0] + r * Math.cos(a2))} ${f(o[1] + r * Math.sin(a2))}" stroke="${color}" stroke-width="${w}" fill="none"/>`; };
    body += drawPath(`M${A[0]} ${A[1]} L${O[0]} ${O[1]} L${Bp[0]} ${Bp[1]}`, 3, C.purple, 3, 0.1);
    body += at(3, 'pop', arc(O, 38, C.purple, 5), 0.8) + at(3, 'pop', tag(O[0] + 92, O[1] + 34, '시차', LIL, { size: 20 }), 1.0);
    // 4칸: 더 가까운 물체
    body += shown(4, `<g opacity=".95">${tree(O2[0], O2[1] + 18, 0.8)}</g>`);
    body += drawPath(`M${f(hit(A, O2))} ${BY} L${A[0]} ${A[1]} M${f(hit(Bp, O2))} ${BY} L${Bp[0]} ${Bp[1]}`, 4, C.orange, 2.5, 0.2, ' stroke-dasharray="1"');
    body += at(4, 'pop', arc(O2, 26, C.orange, 5), 1.0) + at(4, 'pop', tag(500, 236, '시차 큼', HOT, { size: 18 }), 1.2) + at(4, 'fin', lead(452, 240, 348, 266, C.orange), 1.2);
    css += `.on4 .sc-${id} .b3 .pop3 { opacity: .35; animation: none; transition: opacity .4s; }`;
    put('8-2/과학/8/시차', svg(id, body, css));
  })();

  // ── 연주 시차: 6개월 간격 두 자리에서 본 시차의 절반 ──
  (function () {
    const id = 't82-s8-yeonju';
    let css = base(id);
    const S = [320, 250], R = 95, ST = [320, 110], BY = 46, E1 = [S[0] + R, S[1]], E2 = [S[0] - R, S[1]];
    const hit = (e) => e[0] + (ST[0] - e[0]) * ((BY - e[1]) / (ST[1] - e[1]));
    const r = seeded(11);
    let bg = '';
    for (let i = 0; i < 16; i++) bg += spark(30 + i * 38 + r() * 14, BY - 14 + r() * 26, 5 + r() * 3, C.line, C.muted);
    let body = bg + text(600, 96, '먼 별', { size: 18, color: C.muted });
    body += `<circle cx="${S[0]}" cy="${S[1]}" r="${R}" fill="none" stroke="${C.line}" stroke-width="2.5" stroke-dasharray="7 6"/>`;
    // 공전 방향(시계 반대)
    body += `<path d="M${f(S[0] + R * Math.cos(rad(-20)))} ${f(S[1] + R * Math.sin(rad(-20)))} A${R} ${R} 0 0 0 ${f(S[0] + R * Math.cos(rad(-50)))} ${f(S[1] + R * Math.sin(rad(-50)))}" stroke="${C.blue}" stroke-width="3" fill="none"/>`;
    { const a = rad(-50), x = S[0] + R * Math.cos(a), y = S[1] + R * Math.sin(a); body += `<path d="M${f(x + 2)} ${f(y + 13)} L${f(x)} ${f(y)} L${f(x + 13)} ${f(y - 3)}" stroke="${C.blue}" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`; }
    body += glowStar(S[0], S[1], 18) + text(S[0], S[1] + 46, '태양', { size: 18 });
    body += spark(ST[0], ST[1], 16, C.yellow, C.orange) + text(ST[0] + 40, ST[1] + 6, '별', { size: 18 });
    const sight = (e, n, s, color) => drawPath(`M${e[0]} ${e[1]} L${f(hit(e))} ${BY}`, n, color, 3, s, ' stroke-dasharray="1"');
    body += sight(E1, 1, 0.4, C.blue) + at(1, 'pop', `<circle cx="${f(hit(E1))}" cy="${BY}" r="9" fill="none" stroke="${C.blue}" stroke-width="3.5"/>`, 1.4);
    body += sight(E2, 2, 1.5, C.red) + at(2, 'pop', `<circle cx="${f(hit(E2))}" cy="${BY}" r="9" fill="none" stroke="${C.red}" stroke-width="3.5"/>`, 2.0);
    body += shown(2, `<g opacity=".4">${earth(E1[0], E1[1], 11)}</g>`);
    body += `<g class="orb">${earth(E1[0], E1[1], 11)}</g>`;
    body += at(1, 'fin', text(E1[0] + 22, E1[1] + 7, '지구', { size: 18, anchor: 'start' }), 0.3);
    body += at(2, 'pop', tag(E2[0] - 64, E2[1], '6개월 뒤', COLD, { size: 18 }), 1.3);
    css += `.sc-${id} .orb { transform-box: view-box; transform-origin: ${S[0]}px ${S[1]}px; transition: transform 1.3s ease-in-out .1s; } .on2 .sc-${id} .orb { transform: rotate(-180deg); }`;
    // 3칸: 시차(두 시선이 이루는 각)와 그 절반인 연주 시차
    const a1 = Math.atan2(E1[1] - ST[1], E1[0] - ST[0]), a2 = Math.atan2(E2[1] - ST[1], E2[0] - ST[0]), a0 = Math.PI / 2;
    const pt = (a, rr) => `${f(ST[0] + rr * Math.cos(a))} ${f(ST[1] + rr * Math.sin(a))}`;
    body += drawPath(`M${ST[0]} ${ST[1] + 16} L${S[0]} ${S[1] - 20}`, 3, C.ink, 2.5, 0.1, ' stroke-dasharray="1"');
    body += at(3, 'fin', `<path d="M${pt(a1, 62)} A62 62 0 0 1 ${pt(a2, 62)}" stroke="${C.muted}" stroke-width="3" fill="none"/>`, 0.5) + at(3, 'pop', tag(222, 176, '시차', GRAY, { size: 18 }), 0.7);
    body += at(3, 'pop', `<path d="M${pt(a1, 44)} A44 44 0 0 1 ${pt(a0, 44)}" stroke="${C.red}" stroke-width="6" fill="none"/>`, 1.0);
    body += at(3, 'pop', tag(458, 162, '연주 시차', KEY, { size: 20 }), 1.2) + at(3, 'fin', lead(400, 160, 337, 152, C.red), 1.2);
    put('8-2/과학/8/연주 시차', svg(id, body, css));
  })();

  // ── 파섹: 연주 시차가 1″인 별까지의 거리가 1 pc. 시차가 절반이면 거리는 두 배 ──
  (function () {
    const id = 't82-s8-parsec';
    let css = base(id);
    const SUNP = [80, 236], EP = [80, 156], S1 = [300, 236], S2 = [540, 236];
    let body = glowStar(SUNP[0], SUNP[1], 16) + text(30, SUNP[1] + 7, '태양', { size: 18 }) + earth(EP[0], EP[1], 11) + text(EP[0], EP[1] - 22, '지구', { size: 18 });
    body += `<path d="M${EP[0]} ${EP[1] + 12} V${SUNP[1] - 18}" stroke="${C.muted}" stroke-width="2.5" stroke-dasharray="5 5"/>`;
    const arc = (s, r) => { const a = Math.atan2(EP[1] - s[1], EP[0] - s[0]); return `<path d="M${s[0] - r} ${s[1]} A${r} ${r} 0 0 1 ${f(s[0] + r * Math.cos(a))} ${f(s[1] + r * Math.sin(a))}" stroke="${C.red}" stroke-width="5" fill="none"/>`; };
    const tri = (s, n, color) => drawPath(`M${SUNP[0] + 18} ${SUNP[1]} L${s[0] - 16} ${s[1]} M${EP[0] + 12} ${EP[1] + 4} L${s[0] - 14} ${s[1] - 5}`, n, color, 3, 0.4);
    body += at(1, 'pop', spark(S1[0], S1[1], 16), 0.1) + tri(S1, 1, C.blue) + at(1, 'pop', arc(S1, 64), 1.3) + at(1, 'pop', halo(236, 210, '1″', { size: 22, color: C.red }), 1.4);
    const brace = (x1, x2, y, label, color) => `<path d="M${x1} ${y - 8} V${y + 8} M${x1} ${y} H${x2} M${x2} ${y - 8} V${y + 8}" stroke="${color}" stroke-width="3" fill="none"/>` + halo((x1 + x2) / 2, y + 26, label, { size: 20, color });
    body += at(1, 'fin', brace(SUNP[0], S1[0], 272, '1 pc', C.blue), 1.5);
    body += at(2, 'pop', spark(S2[0], S2[1], 16), 0.1) + tri(S2, 2, C.purple) + at(2, 'pop', arc(S2, 90), 1.3) + at(2, 'pop', halo(472, 206, '0.5″', { size: 22, color: C.red }), 1.4);
    body += at(2, 'fin', brace(SUNP[0], S2[0], 318, '2 pc', C.purple), 1.5);
    body += at(3, 'pop', tag(330, 58, '1 pc ≈ 3.26 광년', SUN, { size: 22 }), 0.2) + at(3, 'pop', tag(330, 112, '파섹 (pc)', KEY, { size: 22 }), 0.6);
    put('8-2/과학/8/파섹', svg(id, body, css));
  })();

  // ── 광년: 빛이 1년 동안 가는 거리 ──
  (function () {
    const id = 't82-s8-gwangnyeon';
    let css = base(id);
    const Y = 200, X0 = 70, X1 = 520;
    let body = `<path d="M${X0} ${Y} H610" stroke="${C.line}" stroke-width="3" stroke-dasharray="8 8"/>`;
    body += glowStar(X0, Y, 24) + text(X0, Y - 50, '별', { size: 18 });
    // 1년 달력 고리: 열두 칸이 차례로 찬다
    const CX = 320, CY = 82;
    for (let k = 0; k < 12; k++) {
      const a = rad(-90 + k * 30), x = CX + 44 * Math.cos(a), y = CY + 44 * Math.sin(a);
      body += `<circle cx="${f(x)}" cy="${f(y)}" r="8" fill="white" stroke="${C.muted}" stroke-width="2"/>`;
      body += `<g class="b1"><g class="mo" style="animation-delay:${f(0.25 + k * 0.14)}s"><circle cx="${f(x)}" cy="${f(y)}" r="8" fill="${C.orange}"/></g></g>`;
    }
    body += text(CX, CY + 8, '1년', { size: 22 });
    body += `<g class="b1"><g class="lp"><path d="M${X0 - 44} ${Y} H${X0}" stroke="${C.yellow}" stroke-width="10" stroke-linecap="round" opacity=".6"/><circle cx="${X0}" cy="${Y}" r="11" fill="${C.yellow}" stroke="${C.orange}" stroke-width="3"/></g></g>`;
    css += `
      .sc-${id} .mo { opacity: 0; }
      .on1 .sc-${id} .mo { animation: ${id}-fin .15s linear both; }
      .sc-${id} .lp { transform: none; opacity: 0; }
      .on1 .sc-${id} .lp { animation: ${id}-lp 1.75s linear .2s both; }
      @keyframes ${id}-lp { 0% { opacity: 0; transform: none; } 6% { opacity: 1; } 100% { opacity: 1; transform: translateX(${X1 - X0}px); } }`;
    body += at(2, 'fin', `<path d="M${X0} ${Y + 30} V${Y + 48} M${X0} ${Y + 40} H${X1} M${X1} ${Y + 30} V${Y + 48}" stroke="${C.red}" stroke-width="3.5" fill="none"/>`, 0.2);
    body += at(2, 'pop', tag((X0 + X1) / 2, Y + 82, '1 광년', KEY, { size: 24 }), 0.5);
    body += ring(X1, Y, 26, 2, C.orange, 0.2);
    body += at(3, 'pop', tag((X0 + X1) / 2, Y + 132, '거리 단위', OK, { size: 22 }), 0.3);
    put('8-2/과학/8/광년', svg(id, body, css));
  })();

  // ════ 겉보기 등급·절대 등급 ════

  // ── 겉보기 등급: 지구에서 보이는 밝기. 밝을수록 숫자가 작다 ──
  (function () {
    const id = 't82-s8-geotbogi';
    let css = base(id);
    const tickX = (m) => 100 + 88 * (m - 1), SY = 296;
    const sky = [[430, 92], [150, 132], [290, 62], [548, 150], [236, 196], [372, 170]];
    let body = `<path d="M70 ${SY} H570" stroke="${C.ink}" stroke-width="3"/>`;
    for (let m = 1; m <= 6; m++) body += `<path d="M${tickX(m)} ${SY - 8} V${SY + 8}" stroke="${C.ink}" stroke-width="2.5"/>` + text(tickX(m), SY + 34, m, { size: 20 });
    body += text(600, SY + 6, '등급', { size: 18 });
    for (let m = 1; m <= 6; m++) {
      const rr = 25 - 3.4 * (m - 1), [x, y] = sky[m - 1];
      body += `<g class="st st${m}" style="--dx:${tickX(m) - x}px;--dy:${SY - 44 - y}px">${spark(x, y, rr)}</g>`;
    }
    css += `.sc-${id} .st { transition: transform 1s ease-in-out; } .on2 .sc-${id} .st { transform: translate(var(--dx), var(--dy)); }`;
    for (let m = 1; m <= 6; m++) css += `.on2 .sc-${id} .st${m} { transition-delay: ${f(0.2 + m * 0.1)}s; }`;
    body += at(1, 'pop', tag(560, 50, '지구에서 본 별', GRAY, { size: 18 }), 0.4);
    css += `.on2 .sc-${id} .b1 .pop1 { opacity: 0; animation: none; transition: opacity .3s; }`;
    body += at(3, 'fin', `<path d="M170 200 H470" stroke="${C.purple}" stroke-width="4"/><path d="M182 191 L168 200 L182 209 M458 191 L472 200 L458 209" stroke="${C.purple}" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`, 0.2);
    body += at(3, 'pop', tag(116, 200, '밝음', SUN, { size: 20 }), 0.5) + at(3, 'pop', tag(526, 200, '어두움', GRAY, { size: 20 }), 0.7);
    body += at(3, 'pop', tag(320, 60, '겉보기 등급', KEY, { size: 24 }), 1.0) + ring(tickX(1), SY - 44, 34, 3, C.orange, 0.6);
    put('8-2/과학/8/겉보기 등급', svg(id, body, css));
  })();

  // ── 절대 등급: 모든 별을 10 pc 에 옮겨 놓고 본 밝기 ──
  // 별 A: 100 pc, 겉보기 4등급 → 절대 −1등급. 별 B: 2.5 pc, 겉보기 2등급 → 절대 5등급(m − M = 5 log(d/10)). 거리는 차례만 맞춘 그림.
  (function () {
    const id = 't82-s8-jeoldae';
    let css = base(id);
    const LX = 340, A = [565, 110], B = [175, 250], A2 = [LX, 112], B2 = [LX, 246];
    let body = earth(54, 180, 18) + text(54, 222, '지구', { size: 18 });
    body += `<path d="M${LX} 40 V312" stroke="${C.green}" stroke-width="3" stroke-dasharray="8 7"/>`;
    body += at(2, 'pop', tag(LX, 330, '10 pc', OK, { size: 20 }), 0.2);
    const star = (cls, [x, y], r, k, name, fill, stroke) => `<g class="${cls}"><g class="${cls}s" style="--k:${k}">${glowStar(x, y, r, fill, stroke)}</g>${text(x - (name === 'A' ? 62 : 50), y + 7, name, { size: 20 })}</g>`;
    body += star('sA', A, 13, f(29 / 13), 'A', C.sky, C.blue) + star('sB', B, 20, f(11 / 20), 'B', C.yellow, C.orange);
    css += `
      .sc-${id} .sA, .sc-${id} .sB { transition: transform 1.2s ease-in-out .3s; }
      .on2 .sc-${id} .sA { transform: translate(${A2[0] - A[0]}px, ${A2[1] - A[1]}px); }
      .on2 .sc-${id} .sB { transform: translate(${B2[0] - B[0]}px, ${B2[1] - B[1]}px); }
      .sc-${id} .sAs, .sc-${id} .sBs { transform-box: fill-box; transform-origin: center; transition: transform 1.2s ease-in-out .3s; }
      .on2 .sc-${id} .sAs, .on2 .sc-${id} .sBs { transform: scale(var(--k)); }`;
    body += shown(1, at(1, 'pop', tag(A[0], A[1] + 46, '4등급', GRAY, { size: 18 }), 0.5) + at(1, 'pop', tag(B[0], B[1] + 56, '2등급', GRAY, { size: 18 }), 0.7), 2);
    body += at(1, 'pop', tag(200, 50, '겉보기 등급', COLD, { size: 18 }), 1.0);
    css += `.on2 .sc-${id} .b1 .pop1 { opacity: 0; animation: none; transition: opacity .3s; }`;
    body += at(2, 'pop', tag(A2[0] + 104, A2[1], '−1등급', HOT, { size: 18 }), 1.6) + at(2, 'pop', tag(B2[0] + 90, B2[1], '5등급', GRAY, { size: 18 }), 1.7);
    body += at(3, 'pop', tag(520, 300, '절대 등급', KEY, { size: 24 }), 0.3) + ring(A2[0], A2[1], 44, 3, C.red, 0.6);
    put('8-2/과학/8/절대 등급', svg(id, body, css));
  })();

  // ════ 은하·우리은하 ════

  // ── 은하: 수많은 별과 가스·먼지가 모인 거대한 무리 ──
  (function () {
    const id = 't82-s8-eunha';
    let css = base(id);
    const r = seeded(21);
    const scat = Array.from({ length: 90 }, () => [30 + r() * 580, 30 + r() * 300]);
    const scatBig = Array.from({ length: 16 }, () => [40 + r() * 560, 40 + r() * 280]);
    let body = `<g class="sc"><g class="tw">${dots(scat, 4, C.blue, 0.7) + dots(scatBig, 7, C.blue)}</g>`;
    body += `<path d="${blob(150, 110, 60, 30, 4)}" fill="${C.muted}" opacity=".18"/><path d="${blob(500, 260, 70, 34, 6)}" fill="${C.muted}" opacity=".18"/></g>`;
    body += `<g transform="translate(320 180) scale(1 .5)"><g class="gin"><g class="gsp">${spiral({ R: 260, seed: 3, n: 90 })}</g></g></g>`;
    css += fade(id, 'sc', [1, null, 0], 0.1, 1.0);
    css += `
      .sc-${id} .gin { transform-box: fill-box; transform-origin: center; opacity: 0; transform: scale(.35) rotate(-120deg); transition: transform 1.6s ease-out .2s, opacity 1s ease .2s; }
      .on2 .sc-${id} .gin { opacity: 1; transform: none; }
      .sc-${id} .gsp { transform-box: fill-box; transform-origin: center; }
      `;
    body += at(3, 'pop', tag(96, 40, '별', COLD, { size: 20 }), 0.2) + at(3, 'fin', lead(104, 58, 141, 150, C.blue), 0.2);
    body += at(3, 'pop', tag(548, 40, '가스·먼지', GRAY, { size: 20 }), 0.4) + at(3, 'fin', lead(530, 58, 458, 160, C.muted), 0.4);
    body += at(3, 'pop', tag(320, 330, '은하', KEY, { size: 26 }), 0.8);
    put('8-2/과학/8/은하', svg(id, body, css));
  })();

  // ── 우리은하: 위에서 보면 막대 모양 중심부와 나선팔, 옆에서 보면 중심부가 볼록한 원반 ──
  (function () {
    const id = 't82-s8-urieunha';
    let css = base(id);
    const TX = 165, TY = 182, TR = 132, SX = 475, SY = 182, SW = 150;
    let body = text(TX, 30, '위에서 본 모습', { size: 18, color: C.muted }) + text(SX, 92, '옆에서 본 모습', { size: 18, color: C.muted });
    body += `<g class="b1"><g transform="translate(${TX} ${TY})"><g class="gin">${spiral({ R: TR, seed: 8, bar: 40, turns: 3.2, n: 55 })}</g></g></g>`;
    css += `.sc-${id} .gin { transform-box: fill-box; transform-origin: center; opacity: 0; transform: scale(.4) rotate(-90deg); transition: transform 1.4s ease-out .2s, opacity .8s ease .2s; } .on1 .sc-${id} .gin { opacity: 1; transform: none; }`;
    body += at(1, 'pop', tag(TX - 80, 336, '막대', SUN, { size: 18 }), 1.3) + at(1, 'fin', lead(TX - 70, 318, TX - 14, TY + 10, C.orange), 1.3);
    body += at(1, 'pop', tag(TX + 72, 336, '나선팔', COLD, { size: 18 }), 1.5) + at(1, 'fin', lead(TX + 72, 318, TX + 96, TY + 72, C.blue), 1.5);
    // 옆모습
    const r = seeded(31);
    const disk = Array.from({ length: 60 }, () => { const x = (r() - 0.5) * 2 * SW * 0.95; return [SX + x, SY + (r() - 0.5) * 10 * (1 - Math.abs(x) / SW)]; });
    let side = `<ellipse cx="${SX}" cy="${SY}" rx="${SW}" ry="11" fill="${C.sky}" stroke="${C.blue}" stroke-width="2"/>` + dots(disk, 3, C.blue, 0.7);
    side += `<ellipse cx="${SX}" cy="${SY}" rx="44" ry="27" fill="${C.yellow}" opacity=".9"/><ellipse cx="${SX}" cy="${SY}" rx="20" ry="13" fill="white" opacity=".8"/>`;
    side += `<path d="M${SX - SW + 30} ${SY} H${SX + SW - 30}" stroke="${C.muted}" stroke-width="2" opacity=".5"/>`;
    body += at(2, 'rise', side, 0.2);
    body += at(2, 'pop', tag(SX + 74, 130, '중심부', SUN, { size: 18 }), 0.9) + at(2, 'fin', lead(SX + 50, 142, SX + 26, 160, C.orange), 0.9);
    body += at(2, 'pop', tag(SX + 108, 236, '원반', COLD, { size: 18 }), 1.1) + at(2, 'fin', lead(SX + 104, 218, SX + 120, SY + 8, C.blue), 1.1);
    // 3칸: 태양계 자리와 크기
    const rs = TR * (8500 / 15000), th = Math.log(rs / 40) / (Math.log(TR / 40) / 3.2), ang = th + rad(25);
    const sun = [TX + rs * Math.cos(ang), TY + rs * Math.sin(ang)], sun2 = [SX - SW * (8500 / 15000), SY];
    const sunDot = (x, y) => `<circle cx="${f(x)}" cy="${f(y)}" r="8" fill="${C.red}" stroke="white" stroke-width="2.5"/>`;
    body += at(3, 'pop', sunDot(...sun), 0.2) + ring(sun[0], sun[1], 16, 3, C.red, 0.3);
    body += at(3, 'pop', sunDot(...sun2), 0.4) + ring(sun2[0], sun2[1], 16, 3, C.red, 0.5);
    body += at(3, 'pop', tag(sun2[0] - 30, 290, '태양계', HOT, { size: 18 }), 0.7) + at(3, 'fin', lead(sun2[0] - 22, 272, sun2[0] - 2, SY + 10, C.red), 0.7);
    body += at(3, 'pop', tag(58, 290, '태양계', HOT, { size: 18 }), 0.6) + at(3, 'fin', lead(76, 274, f(sun[0]) - 6, f(sun[1]) + 6, C.red), 0.6);
    body += at(3, 'fin', `<path d="M${f(sun2[0])} 140 H${SX} M${f(sun2[0])} 132 V148 M${SX} 132 V148" stroke="${C.red}" stroke-width="2.5" fill="none"/>` + halo((sun2[0] + SX) / 2 - 20, 124, '약 8500 pc', { size: 18, color: C.red }), 1.0);
    body += at(3, 'fin', `<path d="M${SX - SW} 226 H${SX + SW} M${SX - SW} 218 V234 M${SX + SW} 218 V234" stroke="${C.ink}" stroke-width="2.5" fill="none"/>` + halo(SX + 40, 254, '약 30000 pc', { size: 18 }), 1.2);
    css += `.on3 .sc-${id} .b2 .pop2, .on3 .sc-${id} .b2 .fin2, .on3 .sc-${id} .b1 .pop1, .on3 .sc-${id} .b1 .fin1 { opacity: 0; animation: none; transition: opacity .3s; }`;
    body += at(3, 'pop', tag(560, 330, '우리은하', KEY, { size: 22 }), 1.5);
    put('8-2/과학/8/우리은하', svg(id, body, css));
  })();

  // ════ 성단: 산개 성단(왼쪽)과 구상 성단(오른쪽) ════
  const clusterScene = (word, id) => {
    let css = base(id);
    const r = seeded(41), OC = [170, 160], GC = [470, 160];
    const open = [], openBig = [];
    for (let i = 0; i < 44; i++) { const rr = Math.sqrt(r()) * 96, a = r() * Math.PI * 2; (r() < 0.35 ? openBig : open).push([OC[0] + rr * Math.cos(a), OC[1] + rr * Math.sin(a) * 0.9]); }
    const glob = [], globBig = [];
    for (let i = 0; i < 420; i++) {
      const u = Math.max(1e-6, r()), v = r(), rr = Math.min(92, 30 * Math.sqrt(-2 * Math.log(u))), a = v * Math.PI * 2;
      (i % 14 === 0 ? globBig : glob).push([GC[0] + rr * Math.cos(a), GC[1] + rr * Math.sin(a)]);
    }
    let openS = dots(open, 5, C.blue, 0.85) + dots(openBig, 9, C.blue);
    let globS = `<circle cx="${GC[0]}" cy="${GC[1]}" r="48" fill="${C.peach}" opacity=".6"/>` + dots(glob, 3.5, C.orange, 0.8) + dots(globBig, 6, C.red);
    const emph = word === '산개 성단' ? 'o' : word === '구상 성단' ? 'g' : '';
    let body = `<g class="dO"><g class="b1"><g class="cO"><g class="tw">${openS}</g></g></g></g><g class="dG"><g class="b1"><g class="cG"><g class="tw" style="animation-delay:1.2s">${globS}</g></g></g></g>`;
    css += `.sc-${id} .cO, .sc-${id} .cG { transform-box: fill-box; transform-origin: center; }
      .on1 .sc-${id} .cO { animation: ${id}-pop .8s ease-out .2s both; } .on1 .sc-${id} .cG { animation: ${id}-pop .8s ease-out .6s both; }`;
    const circ = (c, rr, color, n, s) => drawPath(`M${c[0] - rr} ${c[1]} A${rr} ${rr} 0 1 1 ${c[0] + rr} ${c[1]} A${rr} ${rr} 0 1 1 ${c[0] - rr} ${c[1]}`, n, color, 3, s, ' stroke-dasharray="1"');
    if (!emph) {
      body += circ(OC, 112, C.blue, 2, 0.2) + circ(GC, 104, C.red, 2, 0.4);
      body += at(2, 'pop', tag(OC[0], 300, '산개 성단', COLD, { size: 20 }), 1.2) + at(2, 'pop', tag(GC[0], 300, '구상 성단', HOT, { size: 20 }), 1.4);
      body += at(3, 'pop', tag(320, 40, '성단', KEY, { size: 26 }), 0.3) + ring(OC[0], OC[1], 100, 3, C.blue, 0.5) + ring(GC[0], GC[1], 96, 3, C.red, 0.7);
      body += at(3, 'pop', tag(320, 340, '별의 무리', GRAY, { size: 18 }), 0.9);
    } else if (emph === 'o') {
      body += circ(OC, 112, C.blue, 2, 0.2);
      body += at(2, 'pop', tag(OC[0], 296, '파란 별', COLD, { size: 18 }), 1.0) + at(2, 'pop', tag(OC[0], 336, '수십~수만 개', COLD, { size: 18 }), 1.3);
      body += at(2, 'pop', tag(OC[0], 30, '듬성듬성', GRAY, { size: 18 }), 1.5);
      css += fade(id, 'dG', [1, null, 0.3], 0.2);
      body += at(3, 'pop', tag(340, 36, '산개 성단', KEY, { size: 24 }), 0.4);
    } else {
      body += circ(GC, 104, C.red, 2, 0.2);
      body += at(2, 'pop', tag(GC[0], 296, '붉은 별', HOT, { size: 18 }), 1.0) + at(2, 'pop', tag(GC[0], 336, '수만~수십만 개', HOT, { size: 18 }), 1.3);
      body += at(2, 'pop', tag(GC[0], 30, '공 모양', GRAY, { size: 18 }), 1.5);
      css += fade(id, 'dO', [1, null, 0.3], 0.2);
      body += at(3, 'pop', tag(300, 36, '구상 성단', KEY, { size: 24 }), 0.4);
    }
    return { body, css };
  };
  (function () { const id = 't82-s8-seongdan'; const { body, css } = clusterScene('성단', id); put('8-2/과학/8/성단', svg(id, body, css)); })();
  (function () { const id = 't82-s8-sangae'; const { body, css } = clusterScene('산개 성단', id); put('8-2/과학/8/산개 성단', svg(id, body, css)); })();
  (function () { const id = 't82-s8-gusang'; const { body, css } = clusterScene('구상 성단', id); put('8-2/과학/8/구상 성단', svg(id, body, css)); })();

  // ════ 성간 물질·성운 ════
  const r0 = seeded(51);
  const GAS = Array.from({ length: 150 }, () => [20 + r0() * 600, 20 + r0() * 320]);
  const DUST = Array.from({ length: 60 }, () => [20 + r0() * 600, 20 + r0() * 320]);
  const STARS = [[90, 80], [270, 250], [470, 70], [560, 270], [150, 300]];

  // ── 성간 물질: 별과 별 사이에 엷게 퍼진 가스와 먼지 ──
  (function () {
    const id = 't82-s8-seonggan';
    let css = base(id);
    let body = `<g class="gd"><g class="drift">${dots(GAS, 4, C.purple, 0.45) + dots(DUST, 5, C.muted, 0.55)}</g></g>`;
    body += STARS.map(([x, y], i) => at(1, 'pop', glowStar(x, y, 14), f(0.2 + i * 0.15))).join('');
    body += at(1, 'fin', `<path d="M118 92 L242 236" stroke="${C.muted}" stroke-width="2.5" stroke-dasharray="6 6"/>`, 1.0);
    css += fade(id, 'gd', [0, 0, 1], 0.2, 1.2);
    css += `.sc-${id} .drift { animation: ${id}-drift 4s ease-in-out infinite alternate; } @keyframes ${id}-drift { from { transform: translate(-6px, 3px); } to { transform: translate(6px, -3px); } }`;
    // 3칸: 돋보기로 크게 본 모습
    const r = seeded(57);
    let lens = `<circle cx="420" cy="180" r="78" fill="white" stroke="${C.ink}" stroke-width="5"/><path d="M475 235 L520 280" stroke="${C.ink}" stroke-width="12" stroke-linecap="round"/>`;
    lens += dots(Array.from({ length: 14 }, () => [370 + r() * 70, 130 + r() * 100]), 11, C.purple, 0.75);
    for (let i = 0; i < 6; i++) { const x = 432 + r() * 40, y = 132 + r() * 92; lens += `<path d="M${f(x)} ${f(y)} l7 -3 l5 6 l-3 7 l-8 1 Z" fill="${C.muted}"/>`; }
    body += at(3, 'pop', lens, 0.2);
    body += at(3, 'pop', tag(316, 112, '가스', LIL, { size: 18 }), 0.8) + at(3, 'pop', tag(560, 150, '먼지', GRAY, { size: 18 }), 1.0);
    body += at(3, 'pop', tag(200, 40, '성간 물질', KEY, { size: 24 }), 1.2);
    put('8-2/과학/8/성간 물질', svg(id, body, css));
  })();

  // ── 성운: 성간 물질이 많이 모여 구름처럼 보인다 ──
  (function () {
    const id = 't82-s8-seongun';
    let css = base(id);
    let body = `<g class="b1"><g class="gas"><g class="drift">${dots(GAS, 4, C.purple, 0.5) + dots(DUST, 5, C.muted, 0.6)}</g></g></g>`;
    body += `<g class="b2"><g class="cl"><path d="${blob(320, 140, 150, 82, 5, 0.2)}" fill="${C.lilac}" stroke="${C.purple}" stroke-width="2.5"/><path d="${blob(305, 140, 95, 50, 8, 0.25)}" fill="${C.purple}" opacity=".25"/>${dots(GAS.slice(0, 40).map(([x, y]) => [200 + (x / 640) * 240, 90 + (y / 360) * 100]), 4, C.purple, 0.6)}</g></g>`;
    css += `
      .sc-${id} .gas { transform-box: view-box; transform-origin: 320px 140px; transition: transform 1.4s ease-in .2s, opacity .8s ease 1s; }
      .on2 .sc-${id} .gas { transform: scale(.3); opacity: 0; }
      .sc-${id} .cl { transform-box: fill-box; transform-origin: center; opacity: 0; transform: scale(.5); transition: transform 1s ease-out .9s, opacity .8s ease .9s; }
      .on2 .sc-${id} .cl { opacity: 1; transform: none; }
      .sc-${id} .drift { animation: ${id}-drift 4s ease-in-out infinite alternate; } @keyframes ${id}-drift { from { transform: translate(-6px, 3px); } to { transform: translate(6px, -3px); } }`;
    body += [[60, 70], [92, 196], [596, 128], [560, 206]].map(([x, y], i) => at(1, 'rise', glowStar(x, y, 12), f(0.2 + i * 0.12))).join('');
    body += at(1, 'pop', tag(320, 330, '성간 물질', GRAY, { size: 18 }), 0.5);
    css += `.on2 .sc-${id} .b1 .pop1 { opacity: 0; animation: none; transition: opacity .3s; }`;
    body += at(2, 'pop', tag(540, 56, '성운', KEY, { size: 24 }), 1.6);
    // 3칸: 성운의 세 갈래
    const kinds = [[140, '방출', C.red, C.peach], [320, '반사', C.blue, C.sky], [500, '암흑', C.ink, C.ink]];
    kinds.forEach(([x, label, stroke, fill], i) => {
      let k = `<path d="${blob(x, 262, 54, 30, 12 + i, 0.22)}" fill="${fill}" opacity="${label === '암흑' ? 0.85 : 0.75}" stroke="${stroke}" stroke-width="2"/>`;
      if (label === '방출') k += glowStar(x - 6, 262, 6, 'white', C.blue);
      if (label === '반사') k += glowStar(x + 70, 236, 7);
      if (label === '암흑') k = dots([[x - 70, 245], [x - 62, 285], [x + 66, 250], [x + 72, 284], [x - 20, 296], [x + 30, 232]], 6, C.yellow) + k;
      body += at(3, 'pop', k, f(0.2 + i * 0.3)) + at(3, 'pop', tag(x, 326, label, label === '방출' ? HOT : label === '반사' ? COLD : GRAY, { size: 18 }), f(0.5 + i * 0.3));
    });
    put('8-2/과학/8/성운', svg(id, body, css));
  })();

  // ── 방출 성운·반사 성운·암흑 성운: 오른쪽 아래 눈이 지구에서 보는 사람 ──
  const EYE = [588, 300];
  const viewBox = (inner) => `<rect x="452" y="20" width="168" height="112" rx="10" fill="white" stroke="${C.muted}" stroke-width="2.5"/>${inner}`;

  (function () {
    const id = 't82-s8-bangchul';
    let css = base(id);
    const CL = [280, 170];
    let body = `<path d="${blob(CL[0], CL[1], 170, 105, 21, 0.18)}" fill="${C.line}" stroke="${C.muted}" stroke-width="2.5"/>`;
    body += `<g class="red"><path d="${blob(CL[0], CL[1], 170, 105, 21, 0.18)}" fill="${C.peach}" stroke="${C.red}" stroke-width="3"/><path d="${blob(CL[0] + 10, CL[1], 110, 64, 23, 0.22)}" fill="${C.red}" opacity=".35"/></g>`;
    let rays = '';
    for (let k = 0; k < 10; k++) { const a = rad(k * 36 + 10); rays += `M${f(CL[0] + 22 * Math.cos(a))} ${f(CL[1] + 22 * Math.sin(a))} L${f(CL[0] + 60 * Math.cos(a))} ${f(CL[1] + 60 * Math.sin(a))} `; }
    body += `<g class="b2"><g class="ray"><path d="${rays}" stroke="${C.blue}" stroke-width="3" stroke-linecap="round" stroke-dasharray="4 6"/></g></g>`;
    body += glowStar(CL[0], CL[1], 13, 'white', C.blue);
    body += at(1, 'pop', tag(CL[0], 36, '뜨거운 별', COLD, { size: 18 }), 0.4) + at(1, 'fin', lead(CL[0], 52, CL[0], CL[1] - 20, C.blue), 0.4);
    body += at(1, 'pop', tag(110, 320, '가스', GRAY, { size: 18 }), 0.7);
    body += eye(EYE[0], EYE[1]) + text(EYE[0], EYE[1] + 38, '지구', { size: 18 });
    body += ring(CL[0], CL[1], 150, 2, C.red, 1.0);
    body += drawPath(`M${CL[0] + 160} ${CL[1] + 60} Q 500 ${EYE[1] - 10} ${EYE[0] - 30} ${EYE[1]}`, 3, C.red, 5, 0.2) + at(3, 'fin', `<path d="M${EYE[0] - 44} ${EYE[1] - 12} L${EYE[0] - 30} ${EYE[1]} L${EYE[0] - 48} ${EYE[1] + 8}" stroke="${C.red}" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`, 1.2);
    body += at(3, 'pop', viewBox(`<path d="${blob(536, 76, 54, 34, 21, 0.18)}" fill="${C.red}" opacity=".55"/>`), 0.9);
    body += at(3, 'pop', tag(536, 156, '방출 성운', KEY, { size: 22 }), 1.3);
    css += fade(id, 'red', [0, 0, 1], 0.9, 0.9);
    css += `.sc-${id} .ray { transform-box: fill-box; transform-origin: center; } .on2 .sc-${id} .ray { animation: ${id}-ray 1s ease-out .2s 2 both; } @keyframes ${id}-ray { from { opacity: 0; transform: scale(.4); } 50% { opacity: 1; } to { opacity: .8; transform: scale(1.3); } }`;
    put('8-2/과학/8/방출 성운', svg(id, body, css));
  })();

  (function () {
    const id = 't82-s8-bansa';
    let css = base(id);
    const ST = [96, 96], CL = [310, 205];
    let body = `<path d="${blob(CL[0], CL[1], 150, 92, 31, 0.18)}" fill="${C.line}" stroke="${C.muted}" stroke-width="2.5"/>`;
    body += `<g class="blue"><path d="${blob(CL[0], CL[1], 150, 92, 31, 0.18)}" fill="${C.sky}" stroke="${C.blue}" stroke-width="3"/><path d="${blob(CL[0] - 30, CL[1] - 10, 90, 50, 33, 0.2)}" fill="${C.blue}" opacity=".25"/></g>`;
    const r = seeded(37);
    body += dots(Array.from({ length: 40 }, () => [CL[0] - 120 + r() * 240, CL[1] - 70 + r() * 140]), 4, C.muted, 0.7);
    body += glowStar(ST[0], ST[1], 16) + text(ST[0], ST[1] - 38, '별', { size: 18 });
    body += at(1, 'pop', tag(CL[0] + 40, 330, '먼지', GRAY, { size: 18 }), 0.5);
    body += eye(EYE[0], EYE[1]) + text(EYE[0], EYE[1] + 38, '지구', { size: 18 });
    // 2칸: 별빛이 먼지에 부딪혀 지구 쪽으로 되돌아 나간다
    const inR = [[ST[0] + 22, ST[1] + 12, 230, 150], [ST[0] + 22, ST[1] + 24, 210, 200], [ST[0] + 26, ST[1], 300, 140]];
    inR.forEach(([x1, y1, x2, y2], i) => { body += drawPath(`M${x1} ${y1} L${x2} ${y2}`, 2, C.orange, 4, f(0.1 + i * 0.12)); });
    const outR = [[230, 150, EYE[0] - 30, EYE[1] - 10], [300, 140, EYE[0] - 28, EYE[1] - 4], [210, 200, EYE[0] - 30, EYE[1] + 4]];
    outR.forEach(([x1, y1, x2, y2], i) => { body += drawPath(`M${x1} ${y1} L${x2} ${y2}`, 2, C.blue, 4, f(1.0 + i * 0.12)); });
    body += at(2, 'fin', `<path d="M${EYE[0] - 46} ${EYE[1] - 16} L${EYE[0] - 30} ${EYE[1] - 4} L${EYE[0] - 50} ${EYE[1] + 2}" stroke="${C.blue}" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`, 1.9);
    css += fade(id, 'blue', [0, 0, 1], 1.0, 0.9);
    body += at(3, 'pop', viewBox(`<path d="${blob(536, 76, 54, 34, 31, 0.18)}" fill="${C.blue}" opacity=".45"/>${glowStar(478, 40, 6)}`), 0.3);
    body += at(3, 'pop', tag(536, 156, '반사 성운', KEY, { size: 22 }), 0.8) + ring(CL[0], CL[1], 130, 3, C.blue, 0.4);
    put('8-2/과학/8/반사 성운', svg(id, body, css));
  })();

  (function () {
    const id = 't82-s8-amheuk';
    let css = base(id);
    const E = [588, 210];
    const BG = [[60, 110], [110, 170], [70, 240], [150, 120], [130, 290], [40, 180], [175, 220]];
    let body = BG.map(([x, y]) => spark(x, y, 10)).join('') + text(100, 60, '뒤쪽 별', { size: 18, color: C.muted });
    body += eye(E[0], E[1]) + text(E[0], E[1] + 38, '지구', { size: 18 });
    // 별빛: 구름 앞까지(near)와 구름 뒤 지구까지(far)
    const CX = 360;
    let near = '', far = '';
    [[110, 170], [150, 120], [175, 220], [130, 290]].forEach(([x, y]) => {
      const t = (CX - 60 - x) / (E[0] - 30 - x), yc = y + (E[1] - y) * t;
      near += `M${x + 12} ${y} L${f(CX - 60)} ${f(yc)} `;
      far += `M${f(CX - 60)} ${f(yc)} L${E[0] - 30} ${E[1]} `;
    });
    body += drawPath(near, 1, C.orange, 3, 0.2) + `<g class="far">${drawPath(far, 1, C.orange, 3, 0.9)}</g>`;
    css += fade(id, 'far', [1, null, 0], 1.2, 0.4);
    body += `<g class="b2"><g class="dk"><path d="${blob(CX, 205, 70, 120, 41, 0.2)}" fill="${C.ink}" opacity=".9"/></g></g>`;
    css += `.sc-${id} .dk { transform: translateY(-300px); transition: transform 1.1s ease-out .1s; } .on2 .sc-${id} .dk { transform: none; }`;
    body += at(2, 'pop', tag(CX, 32, '짙은 먼지', GRAY, { size: 18 }), 1.3);
    body += at(3, 'pop', viewBox(dots([[470, 40], [500, 112], [600, 38], [604, 110], [480, 80], [592, 72], [560, 30], [512, 34], [566, 120]], 6, C.orange) + `<path d="${blob(536, 76, 40, 34, 41, 0.22)}" fill="${C.ink}" opacity=".9"/>`), 0.3);
    css += `.on3 .sc-${id} .b2 .pop2 { opacity: 0; animation: none; transition: opacity .3s; }`;
    body += at(3, 'pop', tag(536, 160, '암흑 성운', KEY, { size: 22 }), 0.8);
    put('8-2/과학/8/암흑 성운', svg(id, body, css));
  })();

  // ════ 외부 은하·우주 팽창 ════

  // ── 외부 은하: 우리은하 바깥의 수많은 은하 ──
  (function () {
    const id = 't82-s8-oebu';
    let css = base(id);
    // 우리은하: 처음엔 가운데 크게, 2칸에 왼쪽 아래로 작아진다
    let body = `<g class="ours"><g transform="translate(320 170)">${spiral({ R: 120, seed: 8, bar: 36, turns: 3.2, n: 50 })}</g></g>`;
    body += `<g class="ou2"><circle cx="${f(320 - 196)}" cy="${f(170 + 66)}" r="62" fill="none" stroke="${C.green}" stroke-width="3" stroke-dasharray="7 6"/></g>`;
    css += `.sc-${id} .ours { transform-box: view-box; transform-origin: 320px 170px; transition: transform 1.2s ease-in-out .2s; } .on2 .sc-${id} .ours { transform: translate(-196px, 66px) scale(.42); }`;
    css += fade(id, 'ou2', [0, 0, 1], 1.2);
    body += shown(1, at(1, 'pop', tag(320, 330, '우리은하', OK, { size: 22 }), 0.4), 2);
    body += at(2, 'pop', tag(124, 330, '우리은하', OK, { size: 20 }), 1.3);
    const others = [[330, 64, (x, y) => spiralIcon(x, y, 40, 30, 0.45, 11)], [500, 92, (x, y) => ellipIcon(x, y, 36, 22, -20)], [560, 250, (x, y) => spiralIcon(x, y, 44, -40, 0.7, 12)],
      [400, 300, (x, y) => irrIcon(x, y, 30, 14)], [300, 196, (x, y) => ellipIcon(x, y, 26, 18, 10)], [450, 180, (x, y) => spiralIcon(x, y, 32, 70, 0.32, 13)],
      [70, 64, (x, y) => ellipIcon(x, y, 26, 20, 30)], [196, 64, (x, y) => spiralIcon(x, y, 28, 0, 0.9, 15)], [604, 140, (x, y) => ellipIcon(x, y, 18, 12, 0)]];
    others.forEach(([x, y, fn], i) => { body += at(2, 'pop', fn(x, y), f(0.9 + i * 0.12)); });
    others.forEach(([x, y], i) => { body += ring(x, y, 40, 3, C.purple, f(0.2 + i * 0.06)); });
    body += at(3, 'pop', tag(522, 336, '외부 은하', KEY, { size: 24 }), 0.6);
    put('8-2/과학/8/외부 은하', svg(id, body, css));
  })();

  // ── 우주 팽창: 풍선이 부풀면 붙임딱지(은하) 사이가 모두 멀어지고, 먼 것일수록 더 많이 멀어진다 ──
  // 1 cm = 26 px. A-B 2 cm → 3 cm, A-C 4 cm → 6 cm(1.5배)
  (function () {
    const id = 't82-s8-paengchang';
    let css = base(id);
    const CX = 320, CY = 186, R = 100, K = 1.5, U = 26;
    const A = [-78, 34], Bq = [-78 + 2 * U, 34], Cq = [-78 + 4 * U * Math.cos(rad(-40)), 34 + 4 * U * Math.sin(rad(-40))];
    const P = ([x, y]) => [CX + x, CY + y];
    let ball = `<circle cx="${CX}" cy="${CY}" r="${R}" fill="${C.sky}" stroke="${C.blue}" stroke-width="3" vector-effect="non-scaling-stroke" opacity=".9"/>`;
    ball += `<path d="M${CX - 7} ${CY + R + 10} L${CX} ${CY + R - 1} L${CX + 7} ${CY + R + 10} Z" fill="${C.blue}"/>`;
    ball += `<path d="M${CX - 50} ${CY - 50} q20 -18 44 -20" stroke="white" stroke-width="6" fill="none" stroke-linecap="round" vector-effect="non-scaling-stroke" opacity=".8"/>`;
    ball += `<path d="M${P(A)[0]} ${P(A)[1]} L${P(Bq)[0]} ${P(Bq)[1]} M${P(A)[0]} ${P(A)[1]} L${f(P(Cq)[0])} ${f(P(Cq)[1])}" stroke="${C.ink}" stroke-width="2.5" stroke-dasharray="5 5" vector-effect="non-scaling-stroke"/>`;
    const stk = (q, label, i) => { const [x, y] = P(q); return `<g class="stk" style="transform-origin:${f(x)}px ${f(y)}px">${spiralIcon(x, y, 11, i * 40, 0.8, 60 + i)}${text(f(x), f(y - 18), label, { size: 18 })}</g>`; };
    ball += stk(A, 'A', 0) + stk(Bq, 'B', 1) + stk(Cq, 'C', 2);
    let body = `<g class="bl">${ball}</g>`;
    css += `
      .sc-${id} .bl { transform-box: view-box; transform-origin: ${CX}px ${CY}px; transition: transform 1.4s ease-in-out .3s; }
      .on2 .sc-${id} .bl { transform: scale(${K}); }
      .sc-${id} .stk { transform-box: view-box; transition: transform 1.4s ease-in-out .3s; }
      .on2 .sc-${id} .stk { transform: scale(${f(1 / K)}); }`;
    // 거리 글자(풍선 밖에 따로 둔다)
    const labAt = (q1, q2, k, side) => {
      const mx = (q1[0] + q2[0]) / 2 * k, my = (q1[1] + q2[1]) / 2 * k, dx = q2[0] - q1[0], dy = q2[1] - q1[1], L = Math.hypot(dx, dy);
      return [CX + mx + side * (-dy / L) * 20, CY + my + side * (dx / L) * 20 + 6];
    };
    const lab = (q1, q2, k, s, side) => { const [x, y] = labAt(q1, q2, k, side); return halo(f(x), f(y), s, { size: 18 }); };
    body += shown(1, lab(A, Bq, 1, '2 cm', 1) + lab(A, Cq, 1, '4 cm', -1), 2);
    body += at(2, 'fin', lab(A, Bq, K, '3 cm', 1) + lab(A, Cq, K, '6 cm', -1), 1.6);
    const [bx, by] = labAt(A, Bq, K, 1), [cx2, cy2] = labAt(A, Cq, K, -1);
    body += at(3, 'pop', tag(110, 300, '+1 cm', COLD, { size: 18 }), 0.3) + at(3, 'fin', lead(146, 296, bx - 30, by - 4, C.blue), 0.3);
    body += at(3, 'pop', tag(100, 130, '+2 cm', HOT, { size: 18 }), 0.6) + at(3, 'fin', lead(136, 138, cx2 - 30, cy2 - 6, C.red), 0.6);
    body += at(3, 'pop', tag(520, 60, '우주 팽창', KEY, { size: 24 }), 1.0);
    put('8-2/과학/8/우주 팽창', svg(id, body, css));
  })();
})(typeof window !== 'undefined' ? window : globalThis);
