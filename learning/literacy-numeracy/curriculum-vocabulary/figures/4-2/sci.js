// 과학 4-2 1단원 「밤하늘 관찰」 낱말 도식: 달 모양 변화·태양계·별자리처럼 움직임과 짜임으로 보여야 하는 낱말을 코드로 그린다.
// 밤하늘은 검정 대신 kit 의 옅은 보라→하늘색 띠로 칠하고, 별은 노랑에 주황 테두리로 적는다.
// 달은 빛나는 쪽만 노랗게, 보이지 않는 쪽은 점선 테두리의 옅은 동그라미로 적는다(우리나라에서 본 모습).
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
  const seeded = (seed) => () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const tw = (s, size) => [...String(s)].reduce((a, c) => a + (/[가-힣]/.test(c) ? 1 : c === ' ' ? 0.3 : 0.6), 0) * size;
  const HOT = [C.peach, C.orange], COLD = [C.sky, C.blue], OK = [C.mint, C.green], NIGHT = [C.lilac, C.purple], LIGHT = [C.yellow, C.orange];
  const tag = (cx, cy, label, [fill, stroke] = OK, { size = 20 } = {}) => {
    const w = Math.round(tw(label, size) + size * 1.3), h = Math.round(size * 1.7);
    return `<g><rect x="${f(cx - w / 2)}" y="${f(cy - h / 2)}" width="${w}" height="${h}" rx="${h / 2}" fill="${fill}" stroke="${stroke}" stroke-width="2.5"/>${text(f(cx), f(cy + size * 0.36), label, { size })}</g>`;
  };
  const lead = (x1, y1, x2, y2, color = C.muted) => `<path d="M${f(x1)} ${f(y1)} L${f(x2)} ${f(y2)}" stroke="${color}" stroke-width="2.5" stroke-linecap="round"/>`;
  const head = (x, y, ang, color, w = 4) => {
    const l = 8 + w * 1.4, p = (d) => `${f(x - l * Math.cos(ang + d))} ${f(y - l * Math.sin(ang + d))}`;
    return `<path d="M${p(-0.5)} L${f(x)} ${f(y)} L${p(0.5)}" stroke="${color}" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  };
  // 흐르는 화살표: 점선이 끝 쪽으로 흐른다
  const flow = (pts, color, { w = 5, dash = '14 10' } = {}) => {
    const [a, b] = pts.slice(-2), ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
    const end = [b[0] - w * Math.cos(ang), b[1] - w * Math.sin(ang)];
    const d = 'M' + [...pts.slice(0, -1), end].map((p) => `${f(p[0])} ${f(p[1])}`).join(' L');
    return `<g><path class="mar" d="${d}" stroke="${color}" stroke-width="${w}" stroke-dasharray="${dash}" stroke-linecap="round" stroke-linejoin="round" fill="none"/>${head(b[0], b[1], ang, color, w)}</g>`;
  };
  // 해(빛살이 천천히 숨 쉰다)
  const sunIcon = (x, y, r = 24) => {
    let rays = '';
    for (let k = 0; k < 8; k++) { const a = (k * Math.PI) / 4; rays += `<path d="M${f(x + (r + 6) * Math.cos(a))} ${f(y + (r + 6) * Math.sin(a))} L${f(x + (r + 15) * Math.cos(a))} ${f(y + (r + 15) * Math.sin(a))}" stroke="${C.orange}" stroke-width="4" stroke-linecap="round"/>`; }
    return `<g class="rays">${rays}</g><circle cx="${x}" cy="${y}" r="${r}" fill="${C.yellow}" stroke="${C.orange}" stroke-width="3"/>`;
  };
  // 밤하늘 띠: 옅은 보라에서 하늘색으로
  const skyDefs = (id) => `<defs><linearGradient id="${id}-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.lilac}"/><stop offset="1" stop-color="${C.sky}"/></linearGradient></defs>`;
  const sky = (id, x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="18" fill="url(#${id}-sky)"/>`;
  // 별(다섯 꼭지). tw 를 주면 반짝인다
  const star = (x, y, R = 9, { cls = 'tw', s = 0, fill = C.yellow, stroke = C.orange } = {}) => {
    let d = '';
    for (let k = 0; k < 10; k++) { const a = -Math.PI / 2 + (k * Math.PI) / 5, r = k % 2 ? R * 0.45 : R; d += `${k ? 'L' : 'M'}${f(x + r * Math.cos(a))} ${f(y + r * Math.sin(a))}`; }
    return `<path class="${cls}"${dl(s)} d="${d}Z" fill="${fill}" stroke="${stroke}" stroke-width="${R > 6 ? 1.8 : 1.2}" stroke-linejoin="round"/>`;
  };
  // 달 모양. ph: 0 안 보임, .25 오른쪽 반, .5 보름, .75 왼쪽 반
  const moon = (cx, cy, r, ph) => {
    let s = `<circle cx="${f(cx)}" cy="${f(cy)}" r="${r}" fill="white" fill-opacity=".6" stroke="${C.muted}" stroke-width="${r > 30 ? 2.5 : 1.6}" stroke-dasharray="${r > 30 ? '7 5' : '3 3'}"/>`;
    ph = ((ph % 1) + 1) % 1;
    const t = Math.cos(2 * Math.PI * ph), sw = r > 30 ? 3 : 1.8;
    if (Math.abs(ph - 0.5) < 0.01) return s + `<circle cx="${f(cx)}" cy="${f(cy)}" r="${r}" fill="${C.yellow}" stroke="${C.orange}" stroke-width="${sw}"/>`;
    if (t > 0.995) return s;
    const right = ph < 0.5, top = `${f(cx)} ${f(cy - r)}`, bot = `${f(cx)} ${f(cy + r)}`;
    const s1 = right ? 1 : 0, s2 = right ? (t > 0 ? 0 : 1) : (t > 0 ? 1 : 0);
    return s + `<path d="M${top} A${r} ${r} 0 0 ${s1} ${bot} A${f(Math.abs(t) * r)} ${r} 0 0 ${s2} ${top} Z" fill="${C.yellow}" stroke="${C.orange}" stroke-width="${sw}" stroke-linejoin="round"/>`;
  };
  // 음력 날짜 → 달 모양(교과서 그림의 3·7·15·22·27일 모양을 잇는다)
  const ANCHOR = [[1, 0], [3, 0.12], [7, 0.25], [15, 0.5], [22, 0.75], [27, 0.88], [30, 1]];
  const PHASE = (d) => {
    for (let i = 1; i < ANCHOR.length; i++) {
      const [d0, p0] = ANCHOR[i - 1], [d1, p1] = ANCHOR[i];
      if (d <= d1) return p0 + ((d - d0) * (p1 - p0)) / (d1 - d0);
    }
    return 1;
  };
  // 둥근 길을 따라 도는 것(시계 방향). rot 이면 진행 방향을 따라 돌아 늘 해 쪽(안쪽)이 아래(+y)가 된다
  const orbitPath = (cx, cy, rx, ry = rx) => `M${f(cx - rx)} ${f(cy)} A${f(rx)} ${f(ry)} 0 1 1 ${f(cx + rx)} ${f(cy)} A${f(rx)} ${f(ry)} 0 1 1 ${f(cx - rx)} ${f(cy)}`;
  const mover = (path, dur, begin, inner, rot = false) => `<g>${inner}<animateMotion dur="${dur}s" begin="${f(begin)}s" repeatCount="indefinite" path="${path}"${rot ? ' rotate="auto"' : ''}/></g>`;

  // 장면마다 같이 쓰는 움직임
  const base = (id) => {
    let s = `
    .sc-${id} .pop, .sc-${id} .pulse, .sc-${id} .ring, .sc-${id} .rays, .sc-${id} .tw, .sc-${id} .bob { transform-box: fill-box; transform-origin: center; }
    .sc-${id} .rays { animation: ${id}-pulse 2.4s ease-in-out infinite; }
    .sc-${id} .tw { animation: ${id}-tw 1.6s ease-in-out infinite alternate; }
    .sc-${id} .bob { animation: ${id}-bob 3.2s ease-in-out infinite alternate; }
    .sc-${id} .mar { animation: ${id}-mar .7s linear infinite; }
    .sc-${id} .draw { stroke-dasharray: 1; stroke-dashoffset: 1; transition: stroke-dashoffset 1.3s ease-in-out .2s; }
    .sc-${id} .ring { opacity: 0; }
    @keyframes ${id}-pop { 0% { opacity: 0; transform: scale(.3); } 70% { opacity: 1; transform: scale(1.12); } 100% { opacity: 1; transform: scale(1); } }
    @keyframes ${id}-fin { from { opacity: 0; } to { opacity: 1; } }
    @keyframes ${id}-rise { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
    @keyframes ${id}-drop { from { opacity: 0; transform: translateY(-40px); } to { opacity: 1; transform: none; } }
    @keyframes ${id}-pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.12); } }
    @keyframes ${id}-flash { 0% { opacity: 0; } 20% { opacity: 1; } 40% { opacity: .25; } 60% { opacity: 1; } 80% { opacity: .25; } 100% { opacity: 1; } }
    @keyframes ${id}-ring { 0% { opacity: .9; transform: scale(1); } 100% { opacity: 0; transform: scale(1.6); } }
    @keyframes ${id}-mar { from { stroke-dashoffset: 24; } to { stroke-dashoffset: 0; } }
    @keyframes ${id}-tw { from { opacity: 1; transform: scale(1); } to { opacity: .6; transform: scale(.78); } }
    @keyframes ${id}-bob { from { transform: translateY(-4px); } to { transform: translateY(4px); } }
    `;
    for (let n = 1; n <= 5; n++) s += `
    .on${n} .sc-${id} .pop${n} { animation: ${id}-pop .5s ease-out both; }
    .on${n} .sc-${id} .fin${n} { animation: ${id}-fin .6s ease-out both; }
    .on${n} .sc-${id} .rise${n} { animation: ${id}-rise .5s ease-out both; }
    .on${n} .sc-${id} .drop${n} { animation: ${id}-drop .6s ease-out both; }
    .on${n} .sc-${id} .pulse${n} { animation: ${id}-pulse .7s ease-in-out .3s 2; }
    .on${n} .sc-${id} .flash${n} { animation: ${id}-flash 1.4s ease-in-out both; }
    .on${n} .sc-${id} .ring${n} { animation: ${id}-ring 1.1s ease-out .3s 2; }
    .on${n} .sc-${id} .draw${n} { stroke-dashoffset: 0; }`;
    return s;
  };
  const ring = (cx, cy, r, n, color = C.green, s = 0) => `<g class="b${n}"><circle class="ring ring${n}"${dl(s)} cx="${f(cx)}" cy="${f(cy)}" r="${r}" fill="none" stroke="${color}" stroke-width="4"/></g>`;
  const turnCss = (id, cls, x, y, angles, sec = 2) => `.sc-${id} .${cls} { transform-box: view-box; transform-origin: ${x}px ${y}px; transform: rotate(${angles[0]}deg); transition: transform ${sec}s ease-in-out .2s; }`
    + angles.slice(1).map((v, i) => v == null ? '' : `.on${i + 1} .sc-${id} .${cls} { transform: rotate(${v}deg); }`).join('');
  // 선을 그어 나가는 꺾은선(칸 n 에 그려진다)
  const drawLine = (pts, n, color, w = 4, s = 0) => `<g class="b${n}"><path class="draw draw${n}"${dl(s)} pathLength="1" d="M${pts.map(([x, y]) => `${f(x)} ${f(y)}`).join(' L')}" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" fill="none"/></g>`;

  // ════ 1단원 밤하늘 관찰 ════

  // ── 천체: 해·달·별·행성이 하나씩 나타나고, 점선 고리가 모두를 묶는다 ──
  (function () {
    const id = 't42-c1-cheonche';
    let css = base(id);
    let body = skyDefs(id) + sky(id, 20, 14, 600, 286);
    body += `<g class="b3"><ellipse class="draw draw3" pathLength="1" cx="320" cy="152" rx="282" ry="128" fill="none" stroke="${C.purple}" stroke-width="4"/></g>`;
    body += `<g class="b3"><ellipse class="flash flash3" cx="320" cy="152" rx="282" ry="128" fill="none" stroke="${C.purple}" stroke-width="3" stroke-dasharray="10 8" style="animation-delay:1.3s"/></g>`;
    body += at(1, 'pop', g('bob', sunIcon(122, 140, 38)) + text(122, 228, '해', { size: 22 }), 0.2);
    body += at(1, 'pop', g('bob', moon(258, 96, 30, 0.12), 0) + text(258, 158, '달', { size: 22 }), 0.8);
    const saturn = `<g transform="rotate(-14 402 176)"><ellipse cx="402" cy="176" rx="44" ry="11" fill="none" stroke="${C.orange}" stroke-width="3" opacity=".7"/><circle cx="402" cy="176" r="24" fill="${C.peach}" stroke="${C.orange}" stroke-width="3"/><path d="M358 176 A44 11 0 0 0 446 176" stroke="${C.orange}" stroke-width="4" fill="none"/></g>`;
    body += at(2, 'pop', g('bob', saturn) + text(402, 236, '행성', { size: 22 }), 0.2);
    body += at(2, 'pop', star(512, 84, 14) + star(560, 134, 11, { s: 0.5 }) + star(506, 168, 9, { s: 0.9 }) + star(584, 72, 7, { s: 0.3 }) + text(536, 222, '별', { size: 22 }), 0.8);
    body += at(3, 'pop', tag(320, 328, '천체', NIGHT, { size: 24 }), 1.2);
    put('4-2/과학/1/천체', svg(id, body, css));
  })();

  // ── 충돌 구덩이: 바위가 날아와 달 표면에 부딪치고, 움푹 팬 자국이 남는다 ──
  (function () {
    const id = 't42-c1-crater';
    let css = base(id);
    const ix = 300, iy = 250;
    let body = skyDefs(id) + sky(id, 20, 14, 600, 300);
    const flat = `<path d="M20 360 V${iy} H620 V360 Z" fill="${C.line}" stroke="${C.muted}" stroke-width="3"/>`;
    const bowl = `<path d="M20 360 V${iy} H206 Q228 ${iy} 238 238 Q256 304 ${ix} 306 Q344 304 362 238 Q372 ${iy} 394 ${iy} H620 V360 Z" fill="${C.line}" stroke="${C.muted}" stroke-width="3"/>`;
    body += shown(1, flat, 2) + shown(2, bowl);
    body += `<g class="b2"><path class="flash flash2" d="M238 238 Q256 304 ${ix} 306 Q344 304 362 238" stroke="${C.orange}" stroke-width="6" fill="none" style="animation-delay:.5s"/></g>`;
    body += text(92, 300, '달 표면', { size: 20 });
    // 바위: 오른쪽 위에서 날아와 부딪칠 자리에 닿는다
    const rock = `<path d="M${ix + 34} ${iy - 46} l44 -36 M${ix + 26} ${iy - 30} l52 -40 M${ix + 14} ${iy - 40} l36 -32" stroke="${C.orange}" stroke-width="3" stroke-linecap="round" opacity=".7"/>`
      + `<path d="M${ix - 16} ${iy - 22} L${ix - 4} ${iy - 40} L${ix + 16} ${iy - 36} L${ix + 22} ${iy - 16} L${ix + 6} ${iy - 4} L${ix - 12} ${iy - 8} Z" fill="${C.muted}" stroke="${C.ink}" stroke-width="2.5" stroke-linejoin="round"/>`;
    body += `<g class="b1 h2"><g class="fly">${rock}</g></g>`;
    body += `<g class="b1 h2">${g('fin fin1', tag(222, 196, '바위', ['white', C.muted]), 1.3)}</g>`;
    // 2칸: 부딪치는 순간 번쩍이고 흙이 튄다
    body += `<g class="b2"><circle class="ring ring2" cx="${ix}" cy="${iy}" r="40" fill="none" stroke="${C.orange}" stroke-width="5" style="animation-delay:0s"/></g>`;
    const r = seeded(11);
    let dust = '';
    for (let k = 0; k < 14; k++) {
      const a = Math.PI + (k / 13) * Math.PI, d = 80 + r() * 70;
      dust += `<circle class="dust" cx="${ix}" cy="${iy - 4}" r="${f(3 + r() * 3)}" fill="${C.muted}" style="--dx:${f(d * Math.cos(a))}px;--dy:${f(d * Math.sin(a) * 0.9)}px;animation-delay:${f(r() * 0.2)}s"/>`;
    }
    body += shown(2, dust, 3);
    // 3칸: 위에서 본 달 표면의 크고 작은 둥근 자국
    const cx = 520, cy = 112, R = 72;
    let top = `<circle cx="${cx}" cy="${cy}" r="${R}" fill="${C.line}" stroke="${C.muted}" stroke-width="3"/>`;
    [[-30, -26, 18], [24, -34, 11], [28, 14, 22], [-24, 30, 13], [-46, 2, 8], [2, 46, 7], [6, -6, 6], [48, -10, 6]].forEach(([dx, dy, cr]) => {
      top += `<circle cx="${cx + dx}" cy="${cy + dy}" r="${cr}" fill="${C.muted}" fill-opacity=".35" stroke="${C.muted}" stroke-width="2"/><path d="M${f(cx + dx - cr * 0.7)} ${f(cy + dy - cr * 0.7)} A${cr} ${cr} 0 0 1 ${f(cx + dx + cr * 0.7)} ${f(cy + dy - cr * 0.7)}" stroke="white" stroke-width="2.5" fill="none"/>`;
    });
    body += at(3, 'pop', top, 0.2) + at(3, 'pop', tag(cx, 214, '충돌 구덩이', HOT, { size: 22 }), 0.8);
    css += `
      .sc-${id} .fly { opacity: 0; }
      .on1 .sc-${id} .fly { animation: ${id}-fly 1.1s ease-in .2s both; }
      @keyframes ${id}-fly { 0% { opacity: 0; transform: translate(260px, -220px); } 15% { opacity: 1; } 100% { opacity: 1; transform: translate(0, 0); } }
      .sc-${id} .dust { opacity: 0; }
      .on2 .sc-${id} .dust { animation: ${id}-dust 1.3s ease-out both; }
      @keyframes ${id}-dust { 0% { opacity: 1; transform: translate(0, 0); } 70% { opacity: 1; } 100% { opacity: 0; transform: translate(var(--dx), var(--dy)); } }`;
    put('4-2/과학/1/충돌 구덩이', svg(id, body, css));
  })();

  // ── 달 모양 네 낱말: 위에 큰 달, 아래에 음력 날짜 줄. 표시 고리가 날짜를 옮겨 가며 큰 달이 바뀐다 ──
  const DAYS = [1, 3, 7, 15, 22, 27];
  const dayX = (d) => f(110 + ((d - 1) * 480) / 29);
  const phaseFig = (word, id, from, to, side) => {
    let css = base(id);
    const mx = 320, my = 124, R = 78;
    let body = skyDefs(id) + sky(id, 20, 14, 600, 226);
    body += `<path d="M${dayX(1) - 26} 304 H${dayX(30)}" stroke="${C.muted}" stroke-width="3" stroke-linecap="round"/>` + head(dayX(30) + 4, 304, 0, C.muted, 3);
    body += text(54, 334, '음력', { size: 18, color: C.muted });
    DAYS.forEach((d, i) => {
      body += `<path d="M${dayX(d)} 298 V310" stroke="${C.muted}" stroke-width="2.5"/>`;
      body += text(dayX(d), 334, `${d}일`, { size: 18, weight: d === to ? 800 : 600, color: d === to ? C.red : C.ink });
      body += at(1, 'pop', moon(dayX(d), 272, 14, PHASE(d)), 0.1 + i * 0.12);
    });
    body += `<g class="b1"><g transform="translate(0 272)"><g class="mk"><circle cx="0" cy="0" r="21" fill="none" stroke="${C.red}" stroke-width="3.5"/></g></g></g>`;
    css += `
      .sc-${id} .mk { transform: translateX(${dayX(from)}px); transition: transform 1.4s ease-in-out .2s; }
      .on2 .sc-${id} .mk { transform: translateX(${dayX(to)}px); }`;
    body += shown(1, moon(mx, my, R, PHASE(from)), 2) + at(2, 'fin', moon(mx, my, R, PHASE(to)), 0.9);
    const lx = side === 'R' ? mx + R + 50 : mx - R - 50;
    body += at(2, 'fin', text(lx, my + 7, side === 'R' ? '오른쪽' : '왼쪽', { size: 20, color: C.orange }), 1.5);
    body += ring(mx, my, R + 6, 3, C.orange, 0.2);
    body += at(3, 'pop', tag(side === 'R' ? 150 : 490, my, word, LIGHT, { size: 24 }), 0.4);
    put(`4-2/과학/1/${word}`, svg(id, body, css));
  };
  phaseFig('초승달', 't42-c1-choseung', 1, 3, 'R');
  phaseFig('상현달', 't42-c1-sanghyeon', 3, 7, 'R');
  phaseFig('하현달', 't42-c1-hahyeon', 15, 22, 'L');
  phaseFig('그믐달', 't42-c1-geumeum', 22, 27, 'L');

  // ── 주기: 달 모양이 둥근 길을 따라 한 바퀴 돌고, 약 30일 만에 다시 처음으로 돌아온다 ──
  (function () {
    const id = 't42-c1-jugi';
    let css = base(id);
    const cx = 280, cy = 178, R = 116;
    const ang = (d) => ((d - 1) / 29.5) * 2 * Math.PI;
    const P = (a, r = R) => [cx + r * Math.sin(a), cy - r * Math.cos(a)];
    const arc = (a1, a2) => { const [x1, y1] = P(a1), [x2, y2] = P(a2); return `M${f(x1)} ${f(y1)} A${R} ${R} 0 ${a2 - a1 > Math.PI ? 1 : 0} 1 ${f(x2)} ${f(y2)}`; };
    let body = `<circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="${C.line}" stroke-width="4" stroke-dasharray="6 8"/>`;
    body += `<g class="b1"><path class="draw draw1" pathLength="1" d="${arc(0, ang(27))}" stroke="${C.orange}" stroke-width="6" fill="none" stroke-linecap="round" style="transition-duration:2s"/></g>`;
    body += `<g class="b2"><path class="draw draw2" pathLength="1" d="${arc(ang(27), 2 * Math.PI - 0.02)}" stroke="${C.red}" stroke-width="6" fill="none" stroke-linecap="round"/></g>`;
    body += `<g class="b3"><circle class="flash flash3" cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="${C.yellow}" stroke-width="14" opacity=".8"/></g>`;
    // 2칸부터 길을 따라 도는 점
    body += shown(2, `<circle r="9" fill="${C.red}"><animateMotion dur="6s" repeatCount="indefinite" path="M${cx} ${cy - R} A${R} ${R} 0 1 1 ${cx} ${cy + R} A${R} ${R} 0 1 1 ${cx} ${cy - R}"/></circle>`);
    [7, 22].forEach((d) => { const a = ang(d) + 0.33, [x, y] = P(a); body += head(x, y, a, C.muted, 3); });
    DAYS.forEach((d, i) => {
      const [x, y] = P(ang(d)), [lx, ly] = P(ang(d), R + 42);
      body += at(1, 'pop', moon(x, y, 20, PHASE(d)) + text(f(lx), f(ly + 7), `${d}일`, { size: 18, weight: 600 }), 0.1 + i * 0.32);
    });
    body += at(2, 'pop', text(cx, cy + 10, '약 30일', { size: 28, color: C.red }), 1.2);
    body += at(3, 'pop', tag(540, 178, '주기', HOT, { size: 26 }), 0.4);
    put('4-2/과학/1/주기', svg(id, body, css));
  })();

  // ── 음력: 음력 8월 달력. 칸마다 그날 보이는 달 모양, 15일 추석의 보름달 ──
  (function () {
    const id = 't42-c1-eumryeok';
    let css = base(id);
    const x0 = 36, y0 = 74, W = 68, H = 50;
    const cell = (d) => [x0 + ((d - 1) % 6) * W, y0 + Math.floor((d - 1) / 6) * H];
    let body = text(240, 52, '음력 8월', { size: 22 });
    body += `<rect x="${x0}" y="${y0}" width="${W * 6}" height="${H * 5}" fill="white" stroke="${C.muted}" stroke-width="2.5"/>`;
    for (let c = 1; c < 6; c++) body += `<path d="M${x0 + c * W} ${y0} V${y0 + H * 5}" stroke="${C.line}" stroke-width="1.5"/>`;
    for (let r = 1; r < 5; r++) body += `<path d="M${x0} ${y0 + r * H} H${x0 + W * 6}" stroke="${C.line}" stroke-width="1.5"/>`;
    const [hx, hy] = cell(15);
    body += `<g class="b3"><rect class="flash flash3" x="${hx + 2}" y="${hy + 2}" width="${W - 4}" height="${H - 4}" fill="${C.peach}" stroke="${C.orange}" stroke-width="4"/></g>`;
    for (let d = 1; d <= 30; d++) {
      const [x, y] = cell(d), n = d <= 15 ? 1 : 2;
      body += text(x + 17, y + 22, d, { size: 18, weight: 600, color: d === 15 ? C.red : C.ink });
      body += at(n, 'pop', moon(x + 45, y + 29, 14, PHASE(d)), 0.1 + ((d - 1) % 15) * 0.1);
    }
    body += `<g class="b4"><rect class="flash flash4" x="${x0 - 4}" y="${y0 - 4}" width="${W * 6 + 8}" height="${H * 5 + 8}" fill="none" stroke="${C.purple}" stroke-width="5" rx="6"/></g>`;
    body += at(3, 'pop', moon(546, 140, 50, 0.5), 0.6) + at(3, 'pop', tag(546, 224, '추석', HOT), 1.0) + at(3, 'fin', text(546, 266, '8월 15일', { size: 18, color: C.muted }), 1.2);
    body += ring(546, 140, 56, 3, C.orange, 0.8);
    body += at(4, 'pop', tag(546, 318, '음력', NIGHT, { size: 24 }), 0.4);
    put('4-2/과학/1/음력', svg(id, body, css));
  })();

  // ── 태양계: 가운데 태양, 둘레를 도는 여덟 행성, 지구를 도는 달, 모두를 감싸는 공간 ──
  (function () {
    const id = 't42-c1-taeyanggye';
    let css = base(id);
    const cx = 320, cy = 180, k = 0.42;
    // 수성·금성·지구·화성·목성·토성·천왕성·해왕성
    const P = [
      [52, 4, C.muted, C.ink, 5], [74, 6, C.yellow, C.orange, 8], [96, 7, C.blue, C.ink, 11], [118, 5, C.red, C.ink, 15],
      [166, 13, C.peach, C.orange, 24], [210, 11, C.yellow, C.orange, 34], [252, 8, C.sky, C.blue, 44], [290, 8, C.blue, C.ink, 54]
    ];
    let body = `<g class="b4"><ellipse class="fin fin4" cx="${cx}" cy="${cy}" rx="310" ry="132" fill="${C.lilac}" stroke="${C.purple}" stroke-width="3.5" stroke-dasharray="12 9"/></g>`;
    body += `<g class="b2">${P.map(([rx], i) => `<ellipse class="fin fin2" style="animation-delay:${f(i * 0.12)}s" cx="${cx}" cy="${cy}" rx="${rx}" ry="${f(rx * k)}" fill="none" stroke="${C.muted}" stroke-width="1.8" opacity=".7"/>`).join('')}</g>`;
    body += at(1, 'pop', sunIcon(cx, cy, 26), 0.2);
    const r = seeded(5);
    body += P.map(([rx, pr, fill, stroke, dur], i) => {
      let planet = `<circle r="${pr}" fill="${fill}" stroke="${stroke}" stroke-width="2"/>`;
      if (i === 5) planet = `<ellipse rx="${pr + 9}" ry="4" fill="none" stroke="${C.orange}" stroke-width="2.5"/>` + planet;
      if (i === 2) planet += `<g class="b3"><circle class="ring ring3" r="14" fill="none" stroke="${C.blue}" stroke-width="3"/></g>`;
      return at(2, 'fin', mover(orbitPath(cx, cy, rx, rx * k), dur, -r() * dur, planet), 0.3 + i * 0.15);
    }).join('');
    body += at(1, 'pop', tag(84, 40, '태양', LIGHT), 0.6) + at(1, 'fin', lead(112, 56, cx - 30, cy - 14), 0.6);
    body += at(2, 'pop', tag(560, 40, '행성', COLD), 1.6);
    // 3칸: 지구와 달을 크게 본 작은 창
    const ex = 524, ey = 272;
    let inset = `<rect x="446" y="190" width="184" height="162" rx="14" fill="white" stroke="${C.blue}" stroke-width="2.5"/>`;
    inset += `<circle cx="${ex}" cy="${ey}" r="40" fill="none" stroke="${C.muted}" stroke-width="2" stroke-dasharray="5 5"/>`;
    inset += `<circle cx="${ex}" cy="${ey}" r="17" fill="${C.blue}" stroke="${C.ink}" stroke-width="2"/>`;
    inset += mover(orbitPath(ex, ey, 40), 5, 0, `<circle r="8" fill="${C.line}" stroke="${C.muted}" stroke-width="2"/>`);
    inset += text(ex, 340, '지구', { size: 18 });
    inset += tag(590, 214, '위성', NIGHT, { size: 18 }) + lead(576, 228, ex + 30, ey - 28);
    body += `<g class="b3 h4">${g('pop pop3', inset, 0.2)}</g>`;
    body += at(4, 'pop', tag(cx, 340, '태양계', NIGHT, { size: 22 }), 0.6);
    put('4-2/과학/1/태양계', svg(id, body, css));
  })();

  // ── 행성: 태양 둘레를 도는 둥근 천체들. 햇빛을 받는 쪽만 밝다 ──
  (function () {
    const id = 't42-c1-haengseong';
    let css = base(id);
    const cx = 300, cy = 180;
    // 진행 방향을 따라 도는 행성: 안쪽(+y)이 늘 해 쪽, 바깥 반쪽은 그늘
    const planet = (pr, fill, stroke) => `<circle r="${pr}" fill="${fill}" stroke="${stroke}" stroke-width="2.5"/><path d="M${-pr} 0 A${pr} ${pr} 0 0 1 ${pr} 0 Z" fill="${C.ink}" fill-opacity=".45"/><g class="b3"><path class="flash flash3" d="M${-pr - 3} 0 A${pr + 3} ${pr + 3} 0 0 0 ${pr + 3} 0" stroke="${C.yellow}" stroke-width="5" fill="none"/></g>`;
    const orb = [[64, 11, C.peach, C.orange, '금성', 7, 2, 90], [106, 15, C.blue, C.ink, '지구', 11, 1, 50], [146, 11, C.red, C.ink, '화성', 16, 2, 20]];
    let body = '';
    orb.forEach(([R, , , , , , n]) => { body += shown(n, `<circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="${C.muted}" stroke-width="2" stroke-dasharray="6 6"/>`); });
    // 3칸: 해에서 사방으로 빛이 퍼진다
    let rays = '';
    for (let k = 0; k < 8; k++) { const a = (k * Math.PI) / 4 + Math.PI / 8; rays += flow([[cx + 48 * Math.cos(a), cy + 48 * Math.sin(a)], [cx + 150 * Math.cos(a), cy + 150 * Math.sin(a)]], C.yellow, { w: 4, dash: '10 12' }); }
    body += shown(3, `<g opacity=".9">${rays}</g>`);
    body += sunIcon(cx, cy, 30);
    orb.forEach(([R, pr, fill, stroke, , dur, n], i) => {
      body += shown(n, mover(orbitPath(cx, cy, R), dur, -[0.3, 0.55, 0.15][i] * dur, planet(pr, fill, stroke), true));
    });
    // 길마다 이름표: 길 위에 얹는다(도는 행성은 이름표 밑으로 지나간다)
    orb.forEach(([R, , , , name, , n, deg]) => {
      const a = (deg * Math.PI) / 180;
      body += at(n, 'pop', tag(cx + R * Math.cos(a), cy + R * Math.sin(a), name, name === '지구' ? COLD : name === '금성' ? HOT : ['white', C.red], { size: 18 }), n === 1 ? 0.4 : 0.6);
    });
    body += at(3, 'pop', tag(560, 60, '햇빛', LIGHT), 0.6);
    body += at(4, 'pop', tag(560, 340, '행성', COLD, { size: 22 }), 0.4);
    body += ring(cx, cy, 106, 4, C.blue, 0.4);
    put('4-2/과학/1/행성', svg(id, body, css));
  })();

  // ── 위성: 달은 지구 둘레를, 작은 천체들은 목성 둘레를 돈다 ──
  (function () {
    const id = 't42-c1-wiseong';
    let css = base(id);
    const ex = 200, ey = 186, jx = 476, jy = 186;
    let body = `<circle cx="${ex}" cy="${ey}" r="96" fill="none" stroke="${C.muted}" stroke-width="2" stroke-dasharray="6 6"/>`;
    body += `<circle cx="${ex}" cy="${ey}" r="34" fill="${C.blue}" stroke="${C.ink}" stroke-width="2.5"/>` + text(ex, ey + 7, '지구', { size: 20, color: 'white' });
    body += `<g class="b3"><circle class="flash flash3" cx="${ex}" cy="${ey}" r="96" fill="none" stroke="${C.purple}" stroke-width="5"/></g>`;
    const moonBall = (r) => `<circle r="${r}" fill="${C.line}" stroke="${C.muted}" stroke-width="2"/><circle cx="${-r * 0.3}" cy="${-r * 0.2}" r="${r * 0.28}" fill="${C.muted}" fill-opacity=".4"/>`;
    body += mover(orbitPath(ex, ey, 96), 8, -2, moonBall(13)) + mover(orbitPath(ex, ey, 96), 8, -2, text(0, -21, '달', { size: 18 }));
    // 2칸: 목성과 그 둘레를 도는 작은 천체들
    let jup = '';
    [62, 78, 96, 114].forEach((R, i) => { jup += `<circle cx="${jx}" cy="${jy}" r="${R}" fill="none" stroke="${C.muted}" stroke-width="1.8" stroke-dasharray="5 6"/>`; });
    jup += `<circle cx="${jx}" cy="${jy}" r="42" fill="${C.peach}" stroke="${C.orange}" stroke-width="2.5"/>`;
    [-16, -4, 10].forEach((dy) => { jup += `<path d="M${f(jx - Math.sqrt(42 * 42 - dy * dy))} ${jy + dy} H${f(jx + Math.sqrt(42 * 42 - dy * dy))}" stroke="${C.orange}" stroke-width="3" opacity=".55"/>`; });
    jup += text(jx, jy + 7, '목성', { size: 20 });
    [[62, 4, 6], [78, 5.5, 7], [96, 7, 6.5], [114, 9.5, 7.5]].forEach(([R, dur, mr], i) => { jup += mover(orbitPath(jx, jy, R), dur, -dur * [0.1, 0.6, 0.35, 0.8][i], moonBall(mr)); });
    jup += `<g class="b3">${[62, 78, 96, 114].map((R) => `<circle class="flash flash3" cx="${jx}" cy="${jy}" r="${R}" fill="none" stroke="${C.purple}" stroke-width="3.5"/>`).join('')}</g>`;
    body += at(2, 'fin', jup, 0.2);
    body += at(3, 'pop', tag(338, 40, '위성', NIGHT, { size: 22 }), 0.8) + at(3, 'fin', lead(310, 52, ex + 74, ey - 60) + lead(366, 52, jx - 80, jy - 80), 0.8);
    body += at(3, 'pop', tag(ex, 322, '행성', COLD), 0.3) + at(3, 'pop', tag(jx, 330, '행성', COLD), 0.5);
    put('4-2/과학/1/위성', svg(id, body, css));
  })();

  // ── 별: 해는 제 몸에서 빛을 내고, 달은 햇빛을 받은 쪽만 밝다. 밤하늘의 별도 스스로 빛난다 ──
  (function () {
    const id = 't42-c1-byeol';
    let css = base(id);
    const sx = 118, sy = 156, mx = 318, my = 156;
    let body = skyDefs(id);
    body += shown(1, [0, 0.8, 1.6].map((s) => `<circle class="wave" style="animation-delay:${s}s" cx="${sx}" cy="${sy}" r="50" fill="none" stroke="${C.orange}" stroke-width="3"/>`).join(''));
    body += at(1, 'pop', sunIcon(sx, sy, 46), 0.1) + at(1, 'pop', tag(sx, 250, '태양', LIGHT), 0.6);
    body += at(2, 'fin', flow([[sx + 70, sy - 16], [mx - 42, my - 16]], C.orange, { w: 4 }) + flow([[sx + 70, sy + 16], [mx - 42, my + 16]], C.orange, { w: 4 }), 0.1);
    body += at(2, 'pop', moon(mx, my, 32, 0.75), 0.7) + at(2, 'pop', tag(mx, 226, '달', ['white', C.muted]), 1.0);
    // 3칸: 밤하늘 창의 별들이 저마다 빛을 낸다
    let panel = sky(id, 412, 30, 210, 252);
    [[460, 80, 13], [560, 70, 10], [520, 140, 15], [450, 200, 9], [590, 180, 12], [500, 246, 8], [580, 250, 9]].forEach(([x, y, R], i) => {
      let sp = '';
      for (let k = 0; k < 4; k++) { const a = (k * Math.PI) / 2 + Math.PI / 4; sp += `<path d="M${f(x + (R + 4) * Math.cos(a))} ${f(y + (R + 4) * Math.sin(a))} L${f(x + (R + 11) * Math.cos(a))} ${f(y + (R + 11) * Math.sin(a))}" stroke="${C.orange}" stroke-width="2.5" stroke-linecap="round"/>`; }
      panel += `<g class="tw" style="animation-delay:${f(i * 0.35)}s">${sp}${star(x, y, R, { cls: '' })}</g>`;
    });
    body += at(3, 'fin', panel, 0.1);
    body += ring(sx, sy, 56, 4, C.orange, 0.2) + `<g class="b4"><rect class="flash flash4" x="408" y="26" width="218" height="260" rx="20" fill="none" stroke="${C.orange}" stroke-width="5" style="animation-delay:.3s"/></g>`;
    body += at(4, 'pop', tag(300, 318, '별', LIGHT, { size: 24 }), 0.6) + at(4, 'fin', lead(276, 312, sx + 34, sy + 58) + lead(324, 312, 410, 270), 0.6);
    css += `
      .sc-${id} .wave { transform-box: fill-box; transform-origin: center; animation: ${id}-wave 2.4s ease-out infinite; opacity: 0; }
      @keyframes ${id}-wave { 0% { opacity: .8; transform: scale(1); } 100% { opacity: 0; transform: scale(1.9); } }`;
    put('4-2/과학/1/별', svg(id, body, css));
  })();

  // ── 별자리: 흩어진 별 가운데 무리 지은 별을 선으로 이어 이름을 붙인다 ──
  (function () {
    const id = 't42-c1-byeoljari';
    let css = base(id);
    const cas = [[92, 92], [142, 134], [188, 98], [228, 146], [282, 118]];
    const umi = [[566, 66], [532, 92], [502, 114], [474, 140], [458, 184], [404, 192], [412, 148], [474, 140]];
    let body = skyDefs(id) + sky(id, 20, 14, 600, 272);
    // 흩어진 작은 별(이름 붙일 별과 이름표 자리는 피한다)
    const keep = [...cas, ...umi], boxes = [[96, 172, 280, 206], [400, 218, 560, 252]];
    const segs = [];
    for (let i = 1; i < cas.length; i++) segs.push([cas[i - 1], cas[i]]);
    for (let i = 1; i < umi.length; i++) segs.push([umi[i - 1], umi[i]]);
    const segD = ([x, y], [[ax, ay], [bx, by]]) => { const l = (bx - ax) ** 2 + (by - ay) ** 2, t = Math.max(0, Math.min(1, ((x - ax) * (bx - ax) + (y - ay) * (by - ay)) / l)); return Math.hypot(x - ax - t * (bx - ax), y - ay - t * (by - ay)); };
    const r = seeded(23), dots = [];
    for (let tries = 0; dots.length < 30 && tries < 900; tries++) {
      const p = [40 + r() * 560, 30 + r() * 240];
      if (keep.some(([x, y]) => Math.hypot(p[0] - x, p[1] - y) < 26) || segs.some((s) => segD(p, s) < 16) || boxes.some(([x1, y1, x2, y2]) => p[0] > x1 - 8 && p[0] < x2 + 8 && p[1] > y1 - 8 && p[1] < y2 + 8) || dots.some(([x, y]) => Math.hypot(p[0] - x, p[1] - y) < 34)) continue;
      dots.push(p);
    }
    body += at(1, 'fin', dots.map(([x, y], i) => star(x, y, 3 + (i % 3), { s: f((i % 7) * 0.25) })).join(''), 0.1);
    body += drawLine(cas, 2, C.purple, 4, 0.3) + drawLine(umi, 3, C.purple, 4, 0.3);
    body += at(1, 'fin', cas.map(([x, y], i) => star(x, y, 9, { s: i * 0.3 })).join('') + umi.slice(0, 7).map(([x, y], i) => star(x, y, 8, { s: i * 0.2 })).join(''), 0.3);
    body += at(2, 'pop', text(188, 196, '카시오페이아자리', { size: 20, color: C.purple }), 1.4);
    body += at(3, 'pop', text(480, 242, '작은곰자리', { size: 20, color: C.purple }), 1.4);
    body += at(3, 'pop', tag(320, 324, '별자리', NIGHT, { size: 24 }), 1.8);
    put('4-2/과학/1/별자리', svg(id, body, css));
  })();

  // ── 북두칠성: 일곱 별 → 국자 모양 → 큰곰자리의 꼬리 쪽 ──
  (function () {
    const id = 't42-c1-bukdu';
    let css = base(id);
    // 손잡이 끝부터: 1~3 손잡이, 4~7 국자 그릇
    const S = [[84, 120], [146, 98], [204, 106], [254, 120], [332, 120], [336, 184], [262, 178]];
    const B = { b1: [398, 128], b2: [458, 104], b3: [520, 120], b4: [432, 170], b5: [458, 232], b6: [496, 282], b7: [430, 284], b8: [300, 240], b9: [272, 288], b10: [334, 288] };
    const bearLines = [[S[4], B.b1, B.b2, B.b3], [B.b1, B.b4], [S[5], B.b4, B.b5, B.b6], [B.b5, B.b7], [S[6], B.b8, B.b9], [B.b8, B.b10]];
    let body = skyDefs(id) + sky(id, 20, 14, 600, 290);
    body += at(2, 'fin', `<path d="M${S[3].join(' ')} L${S[4].join(' ')} L${S[5].join(' ')} L${S[6].join(' ')} Z" fill="${C.peach}" opacity=".85"/>`, 0.9);
    body += `<g class="b3">${bearLines.map((pts, i) => `<path class="draw draw3" style="transition-delay:${f(0.2 + i * 0.12)}s" pathLength="1" d="M${pts.map((p) => p.join(' ')).join(' L')}" stroke="${C.purple}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none" stroke-opacity=".7"/>`).join('')}</g>`;
    body += drawLine([...S, S[3]], 2, C.orange, 5, 0);
    body += at(3, 'fin', Object.values(B).map(([x, y], i) => star(x, y, 7, { s: i * 0.2 })).join(''), 0.2);
    S.forEach(([x, y], i) => {
      body += at(1, 'pop', star(x, y, 11, { s: i * 0.2 }), 0.15 + i * 0.25);
      body += `<g class="b1 h3">${g('fin fin1', text(x, i >= 5 ? y + 32 : y - 20, i + 1, { size: 18, color: C.muted }), 0.15 + i * 0.25)}</g>`;
    });
    body += `<g class="b2 h3">${g('fin fin2', text(300, 226, '국자', { size: 20, color: C.orange }), 1.4)}</g>`;
    body += at(3, 'pop', tag(520, 44, '큰곰자리', NIGHT), 1.2);
    body += `<g class="b4"><path class="flash flash4" d="M${[...S, S[3]].map((p) => p.join(' ')).join(' L')}" stroke="${C.yellow}" stroke-width="13" stroke-linejoin="round" stroke-linecap="round" fill="none" opacity=".85"/></g>`;
    body += at(4, 'pop', tag(168, 194, '북두칠성', LIGHT, { size: 22 }), 0.5);
    put('4-2/과학/1/북두칠성', svg(id, body, css));
  })();

  // ── 북극성: 북쪽 하늘의 별들이 북극성을 가운데 두고 돈다. 북두칠성 국자 끝 두 별 사이의 약 다섯 배 ──
  (function () {
    const id = 't42-c1-bukgeuk';
    let css = base(id);
    const px = 320, py = 150, hz = 290;
    // 북극성을 (0,0)으로 둔 자리. 북두칠성: 두 별(메라크→두베) 사이 22, 두베까지 110
    const dip = [[117, 93], [107, 71], [110, 49], [113, 25], [135, 25], [132, 0], [110, 0]];
    const cas = [[-112, -50], [-132, -26], [-112, -4], [-134, 20], [-116, 46]];
    const at0 = ([x, y]) => [px + x, py + y];
    let spin = '';
    const r = seeded(31);
    for (let k = 0; k < 40; k++) {
      const a = r() * Math.PI * 2, d = 40 + r() * 300, x = d * Math.cos(a), y = d * Math.sin(a);
      if ([...dip, ...cas].some(([u, v]) => Math.hypot(u - x, v - y) < 24) || Math.hypot(x, y) < 40) continue;
      spin += star(px + x, py + y, 3 + (k % 2), { s: f((k % 6) * 0.3) });
    }
    const dipLine = [...dip.slice(0, 4), dip[6], dip[5], dip[4], dip[3]].map(at0);
    spin += `<path d="M${dipLine.map((p) => p.join(' ')).join(' L')}" stroke="${C.orange}" stroke-width="3.5" stroke-linejoin="round" fill="none" opacity=".8"/>`;
    spin += `<path d="M${cas.map(at0).map((p) => p.join(' ')).join(' L')}" stroke="${C.purple}" stroke-width="3.5" stroke-linejoin="round" fill="none" opacity=".7"/>`;
    // 3칸: 두 별 사이 거리를 다섯 번 이어 북극성까지
    let ptr = `<path class="draw draw3" pathLength="1" d="M${px + 132} ${py} H${px + 12}" stroke="${C.red}" stroke-width="3" fill="none"/>`;
    for (let i = 1; i <= 4; i++) ptr += g('fin fin3', `<path d="M${px + 22 * i} ${py - 8} V${py + 8}" stroke="${C.red}" stroke-width="3"/>`, 0.5 + (5 - i) * 0.2);
    ptr += `<path d="M${px + 110} ${py} H${px + 132}" stroke="${C.red}" stroke-width="6" stroke-linecap="round"/>`;
    spin += `<g class="b3">${ptr}</g>`;
    spin += dip.map((p, i) => star(...at0(p), 9, { s: i * 0.2 })).join('') + cas.map((p, i) => star(...at0(p), 8, { s: i * 0.25 })).join('');
    let body = skyDefs(id) + `<defs><clipPath id="${id}-c"><rect x="20" y="14" width="600" height="${hz - 14}" rx="18"/></clipPath></defs>`;
    body += sky(id, 20, 14, 600, hz - 14);
    body += `<g clip-path="url(#${id}-c)"><g class="rot">${spin}</g></g>`;
    body += `<rect x="0" y="${hz}" width="640" height="${360 - hz}" fill="${C.mint}"/><path d="M0 ${hz} H640" stroke="${C.green}" stroke-width="3"/>`;
    body += `<g class="h4">${text(px, 334, '북', { size: 26, color: C.green })}</g>`;
    body += ring(px, py, 22, 2, C.red, 0.3) + ring(px, py, 22, 4, C.red, 0.3);
    body += star(px, py, 10, { cls: '' });
    body += at(2, 'pop', tag(196, 70, '북극성', LIGHT), 1.0) + at(2, 'fin', lead(220, 86, px - 14, py - 10), 1.0);
    body += at(3, 'pop', text(352, 96, '5배', { size: 22, color: C.red }), 1.4);
    body += at(4, 'fin', flow([[px, py + 22], [px, hz - 8]], C.green, { w: 4 }), 0.2) + `<g class="b4">${g('pulse pulse4', text(px, 334, '북', { size: 26, color: C.green }), 0.6)}</g>`;
    css += turnCss(id, 'rot', px, py, [35, 0, -40]);
    put('4-2/과학/1/북극성', svg(id, body, css));
  })();
})(typeof window !== 'undefined' ? window : globalThis);
