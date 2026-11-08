// 과학 6-1 낱말 도식(3단원 앞쪽): 광학 현미경의 부분과 배율, 세포와 그 짜임, 식물의 기관.
// 현미경은 옆에서 본 단순한 선 그림 하나(scope)를 같이 쓰고, 확대해 본 모습은 동그라미 시야(view)로 그린다.
// 색 약속: 세포벽은 초록, 세포막은 주황, 핵은 보라(아세트산 카민 용액으로 물들인 핵만 빨강).
(function (root) {
  'use strict';
  const { C, svg, text, put } = root.FigureKit;
  const f = (n) => +(+n).toFixed(1);
  const dl = (s) => (s ? ` style="animation-delay:${s}s"` : '');
  const g = (cls, inner, s = 0) => `<g class="${cls}"${dl(s)}>${inner}</g>`;
  // 칸 n 에 나타나며 kind(pop·fin·rise·drop) 움직임을 한 번 한다
  const at = (n, kind, inner, s = 0) => `<g class="b${n}">${g(`${kind} ${kind}${n}`, inner, s)}</g>`;
  const shown = (n, inner, hide) => `<g class="b${n}${hide ? ' h' + hide : ''}">${inner}</g>`;
  const seeded = (seed) => () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const tw = (s, size) => [...String(s)].reduce((a, c) => a + (/[가-힣]/.test(c) ? 1 : c === ' ' ? 0.3 : 0.6), 0) * size;
  const HOT = [C.peach, C.orange], COLD = [C.sky, C.blue], OK = [C.mint, C.green], GAS = [C.lilac, C.purple];
  const tag = (cx, cy, label, [fill, stroke] = OK, { size = 20 } = {}) => {
    const w = Math.round(tw(label, size) + size * 1.3), h = Math.round(size * 1.7);
    return `<g><rect x="${f(cx - w / 2)}" y="${f(cy - h / 2)}" width="${w}" height="${h}" rx="${h / 2}" fill="${fill}" stroke="${stroke}" stroke-width="2.5"/>${text(f(cx), f(cy + size * 0.36), label, { size })}</g>`;
  };
  const lead = (x1, y1, x2, y2, color = C.muted) => `<path d="M${f(x1)} ${f(y1)} L${f(x2)} ${f(y2)}" stroke="${color}" stroke-width="2.5" stroke-linecap="round"/>`;
  const head = (x, y, ang, color, w = 4) => {
    const l = 8 + w * 1.4, p = (d) => `${f(x - l * Math.cos(ang + d))} ${f(y - l * Math.sin(ang + d))}`;
    return `<path d="M${p(-0.5)} L${f(x)} ${f(y)} L${p(0.5)}" stroke="${color}" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  };
  const flow = (pts, color, { w = 5, dash = '14 10' } = {}) => {
    const [a, b] = pts.slice(-2), ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
    const end = [b[0] - w * Math.cos(ang), b[1] - w * Math.sin(ang)];
    const d = 'M' + [...pts.slice(0, -1), end].map((p) => `${f(p[0])} ${f(p[1])}`).join(' L');
    return `<g><path class="mar" d="${d}" stroke="${color}" stroke-width="${w}" stroke-dasharray="${dash}" stroke-linecap="round" stroke-linejoin="round" fill="none"/>${head(b[0], b[1], ang, color, w)}</g>`;
  };
  const drop = (x, y, r = 7) => `<path d="M${f(x)} ${f(y - r * 1.5)} Q${f(x + r * 1.05)} ${f(y - r * 0.2)} ${f(x + r)} ${f(y + r * 0.2)} A${r} ${r} 0 0 1 ${f(x - r)} ${f(y + r * 0.2)} Q${f(x - r * 1.05)} ${f(y - r * 0.2)} ${f(x)} ${f(y - r * 1.5)} Z" fill="${C.sky}" stroke="${C.blue}" stroke-width="2"/>`;
  const sunIcon = (x, y, r = 24) => {
    let rays = '';
    for (let k = 0; k < 8; k++) { const a = (k * Math.PI) / 4; rays += `<path d="M${f(x + (r + 6) * Math.cos(a))} ${f(y + (r + 6) * Math.sin(a))} L${f(x + (r + 15) * Math.cos(a))} ${f(y + (r + 15) * Math.sin(a))}" stroke="${C.orange}" stroke-width="4" stroke-linecap="round"/>`; }
    return `<g class="rays">${rays}</g><circle cx="${x}" cy="${y}" r="${r}" fill="${C.yellow}" stroke="${C.orange}" stroke-width="3"/>`;
  };
  const states = (id, cls, prop, vals, sec = 2, delay = 0.2) => `.sc-${id} .${cls} { ${prop}: ${vals[0]}; transition: ${prop} ${sec}s ease-in-out ${delay}s; }`
    + vals.slice(1).map((v, i) => v == null ? '' : `.on${i + 1} .sc-${id} .${cls} { ${prop}: ${v}; }`).join('');
  const glowRect = (x, y, w, h, n, color = C.orange, delay = 0, rx = 10, kind = 'flash') =>
    `<g class="b${n}"><rect class="${kind} ${kind}${n}"${dl(delay)} x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="${rx}" fill="none" stroke="${color}" stroke-width="5"/></g>`;
  const ring = (cx, cy, r, n, color = C.green, s = 0) => `<g class="b${n}"><circle class="ring ring${n}"${dl(s)} cx="${f(cx)}" cy="${f(cy)}" r="${r}" fill="none" stroke="${color}" stroke-width="4"/></g>`;
  // 둥근 네모를 path 로(선 그리기 움직임에 pathLength 를 쓰려고)
  const rrect = (x, y, w, h, r) => `M${f(x + r)} ${f(y)} H${f(x + w - r)} A${r} ${r} 0 0 1 ${f(x + w)} ${f(y + r)} V${f(y + h - r)} A${r} ${r} 0 0 1 ${f(x + w - r)} ${f(y + h)} H${f(x + r)} A${r} ${r} 0 0 1 ${f(x)} ${f(y + h - r)} V${f(y + r)} A${r} ${r} 0 0 1 ${f(x + r)} ${f(y)} Z`;
  const oval = (cx, cy, rx, ry) => `M${f(cx - rx)} ${f(cy)} A${rx} ${ry} 0 1 1 ${f(cx + rx)} ${f(cy)} A${rx} ${ry} 0 1 1 ${f(cx - rx)} ${f(cy)} Z`;

  const base = (id) => {
    let s = `
    .sc-${id} .pop, .sc-${id} .pulse, .sc-${id} .ring, .sc-${id} .rays, .sc-${id} .grow, .sc-${id} .zoomgrid, .sc-${id} .spin { transform-box: fill-box; transform-origin: center; }
    .sc-${id} .rays { animation: ${id}-pulse 2.4s ease-in-out infinite; }
    .sc-${id} .mar { animation: ${id}-mar .7s linear infinite; }
    .sc-${id} .draw { stroke-dasharray: 1; stroke-dashoffset: 1; transition: stroke-dashoffset 1.6s ease-in-out .3s; }
    .sc-${id} .ring, .sc-${id} .blink { opacity: 0; }
    .sc-${id} .jig { animation: ${id}-jig 1.3s ease-in-out infinite alternate; }
    @keyframes ${id}-pop { 0% { opacity: 0; transform: scale(.3); } 70% { opacity: 1; transform: scale(1.12); } 100% { opacity: 1; transform: scale(1); } }
    @keyframes ${id}-fin { from { opacity: 0; } to { opacity: 1; } }
    @keyframes ${id}-rise { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
    @keyframes ${id}-drop { from { opacity: 0; transform: translateY(-40px); } to { opacity: 1; transform: none; } }
    @keyframes ${id}-grow { from { opacity: 0; transform: translate(var(--dx, 0), var(--dy, 0)) scale(.1); } 30% { opacity: 1; } to { opacity: 1; transform: none; } }
    @keyframes ${id}-pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.12); } }
    @keyframes ${id}-flash { 0% { opacity: 0; } 20% { opacity: 1; } 40% { opacity: .25; } 60% { opacity: 1; } 80% { opacity: .25; } 100% { opacity: 1; } }
    @keyframes ${id}-blink { 0% { opacity: 0; } 20% { opacity: 1; } 40% { opacity: .25; } 60% { opacity: 1; } 100% { opacity: 0; } }
    @keyframes ${id}-ring { 0% { opacity: .9; transform: scale(1); } 100% { opacity: 0; transform: scale(1.6); } }
    @keyframes ${id}-mar { from { stroke-dashoffset: 24; } to { stroke-dashoffset: 0; } }
    @keyframes ${id}-jig { 0% { transform: translate(0, 0); } 33% { transform: translate(3px, -2px); } 66% { transform: translate(-2px, 2px); } 100% { transform: translate(2px, 3px); } }
    @keyframes ${id}-up { 0% { opacity: 0; transform: translateY(0); } 20%, 75% { opacity: 1; } 100% { opacity: 0; transform: translateY(var(--up, -60px)); } }
    @keyframes ${id}-in { 0% { opacity: 0; transform: translate(var(--dx, 0), var(--dy, 0)); } 25% { opacity: 1; } 85% { opacity: 1; } 100% { opacity: 0; transform: translate(0, 0); } }
    .sc-${id} .up { animation: ${id}-up 2.4s ease-in infinite; }
    .sc-${id} .in { animation: ${id}-in 2s ease-in infinite; }
    `;
    for (let n = 1; n <= 5; n++) s += `
    .on${n} .sc-${id} .pop${n} { animation: ${id}-pop .5s ease-out both; }
    .on${n} .sc-${id} .fin${n} { animation: ${id}-fin .5s ease-out both; }
    .on${n} .sc-${id} .rise${n} { animation: ${id}-rise .5s ease-out both; }
    .on${n} .sc-${id} .drop${n} { animation: ${id}-drop .6s ease-out both; }
    .on${n} .sc-${id} .grow${n} { animation: ${id}-grow 1.3s ease-out both; }
    .on${n} .sc-${id} .pulse${n} { animation: ${id}-pulse .7s ease-in-out .3s 2; }
    .on${n} .sc-${id} .flash${n} { animation: ${id}-flash 1.4s ease-in-out both; }
    .on${n} .sc-${id} .blink${n} { animation: ${id}-blink 1.8s ease-in-out both; }
    .on${n} .sc-${id} .ring${n} { animation: ${id}-ring 1.1s ease-out .3s 2; }
    .on${n} .sc-${id} .draw${n} { stroke-dashoffset: 0; }`;
    return s;
  };

  // ── 광학 현미경(옆모습): cx 는 경통 가운데. 접안렌즈 위 56, 재물대 위 244, 받침 아래 344 ──
  const scope = (cx) => {
    const armD = `M${cx - 80} 326 V262 C${cx - 80} 196 ${cx - 62} 146 ${cx} 124`;
    const obj = (len) => `<rect x="${cx - 10}" y="182" width="20" height="${len}" rx="2" fill="${C.sky}" stroke="${C.blue}" stroke-width="3"/><rect x="${cx - 6}" y="${182 + len}" width="12" height="6" rx="1.5" fill="${C.blue}"/>`;
    return {
      arm: `<path d="${armD}" stroke="${C.muted}" stroke-width="28" fill="none"/><path d="${armD}" stroke="${C.line}" stroke-width="22" fill="none"/>`,
      base: `<rect x="${cx - 112}" y="322" width="204" height="22" rx="10" fill="${C.line}" stroke="${C.muted}" stroke-width="3"/>`,
      lamp: `<rect x="${cx - 16}" y="298" width="32" height="25" rx="3" fill="${C.line}" stroke="${C.muted}" stroke-width="3"/><ellipse cx="${cx}" cy="298" rx="16" ry="5" fill="${C.yellow}" stroke="${C.orange}" stroke-width="2.5"/>`,
      knob: `<circle cx="${cx - 80}" cy="282" r="16" fill="white" stroke="${C.muted}" stroke-width="3"/>`,
      knobMark: `<path d="M${cx - 91} 282 H${cx - 69} M${cx - 80} 271 V293" stroke="${C.muted}" stroke-width="2.5" stroke-linecap="round"/>`,
      tube: `<rect x="${cx - 18}" y="96" width="36" height="74" rx="3" fill="white" stroke="${C.muted}" stroke-width="3"/>`,
      eye: `<rect x="${cx - 14}" y="56" width="28" height="40" rx="3" fill="${C.sky}" stroke="${C.blue}" stroke-width="3"/><ellipse cx="${cx}" cy="56" rx="14" ry="4.5" fill="white" stroke="${C.blue}" stroke-width="2.5"/>`,
      nose: `<path d="M${cx - 32} 170 H${cx + 32} L${cx + 24} 184 H${cx - 24} Z" fill="${C.line}" stroke="${C.muted}" stroke-width="3" stroke-linejoin="round"/>`,
      objSide: `<g transform="rotate(40 ${cx} 178)">${obj(24)}</g><g transform="rotate(-40 ${cx} 178)">${obj(14)}</g>`,
      objLong: obj(34), objShort: obj(16),
      stage: `<rect x="${cx - 88}" y="244" width="26" height="18" fill="${C.line}" stroke="${C.muted}" stroke-width="3"/><rect x="${cx - 66}" y="244" width="130" height="10" rx="3" fill="${C.line}" stroke="${C.muted}" stroke-width="3"/>`,
      slide: `<rect x="${cx - 36}" y="238" width="72" height="6" rx="1.5" fill="white" stroke="${C.blue}" stroke-width="2"/><rect x="${cx - 11}" y="235.5" width="22" height="3" rx="1" fill="${C.purple}"/>`
    };
  };
  // 눈(관찰하는 사람)
  const eyeIcon = (x, y) => `<path d="M${x - 26} ${y} Q${x} ${y - 20} ${x + 26} ${y} Q${x} ${y + 20} ${x - 26} ${y} Z" fill="white" stroke="${C.ink}" stroke-width="3" stroke-linejoin="round"/><circle cx="${x}" cy="${y}" r="8" fill="${C.green}"/><circle cx="${x}" cy="${y}" r="3.5" fill="${C.ink}"/>`;

  // ── 양파 표피세포: 엇갈려 쌓은 벽돌 모양. 반지름 R 동그라미를 덮을 만큼만 만든다 ──
  const bricks = (cx, cy, R, w, h, seed, { fill = 'white', wall = 2.5, nucR = null } = {}) => {
    const rnd = seeded(seed), list = [];
    const rows = Math.ceil(R / h) + 1, cols = Math.ceil(R / w) + 1;
    for (let k = -rows; k <= rows; k++) {
      const y = cy + k * h - h / 2, off = (k & 1) ? w / 2 : 0;
      for (let j = -cols - 1; j <= cols; j++) {
        const x = cx + j * w - w / 2 + off;
        const nx = Math.max(x, Math.min(cx, x + w)), ny = Math.max(y, Math.min(cy, y + h));
        if ((nx - cx) ** 2 + (ny - cy) ** 2 > R * R) continue;
        list.push({ x, y, w, h, nx: x + w * (0.3 + rnd() * 0.4), ny: y + h * (0.38 + rnd() * 0.24) });
      }
    }
    const r = nucR || h * 0.17;
    return {
      list, r,
      walls: list.map((b) => `<rect x="${f(b.x)}" y="${f(b.y)}" width="${w}" height="${h}" rx="2" fill="${fill}" stroke="${C.green}" stroke-width="${wall}"/>`).join(''),
      lines: list.map((b) => `<rect x="${f(b.x)}" y="${f(b.y)}" width="${w}" height="${h}" rx="2" fill="none" stroke="${C.green}" stroke-width="${wall}"/>`).join(''),
      halo: list.map((b) => `<rect x="${f(b.x)}" y="${f(b.y)}" width="${w}" height="${h}" rx="2" fill="none" stroke="${C.yellow}" stroke-width="${wall + 6}"/>`).join(''),
      nucs: (color = C.purple) => list.map((b) => `<circle cx="${f(b.nx)}" cy="${f(b.ny)}" r="${f(r)}" fill="${color}"/>`).join('')
    };
  };
  // 사철나무잎 뒷면 표피세포: 구불구불한 칸과 공변세포 한 쌍(기공)
  const leafCells = (cx, cy, R, step, seed) => {
    const rnd = seeded(seed), n = Math.ceil(R / step) + 1, P = {};
    for (let i = -n; i <= n + 1; i++) for (let j = -n; j <= n + 1; j++) P[i + ',' + j] = [cx + (i - 0.5) * step + (rnd() - 0.5) * step * 0.4 + (j & 1) * step * 0.3, cy + (j - 0.5) * step + (rnd() - 0.5) * step * 0.4];
    const near = (p) => (p[0] - cx) ** 2 + (p[1] - cy) ** 2 < (R + step) ** 2;
    let d = '';
    const edge = (a, b) => {
      if (!near(a) && !near(b)) return;
      const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy), k = (rnd() - 0.5) * 0.5 * L;
      d += `M${f(a[0])} ${f(a[1])} Q${f(mx - dy / L * k)} ${f(my + dx / L * k)} ${f(b[0])} ${f(b[1])} `;
    };
    for (let i = -n; i <= n; i++) for (let j = -n; j <= n + 1; j++) edge(P[i + ',' + j], P[(i + 1) + ',' + j]);
    for (let i = -n; i <= n + 1; i++) for (let j = -n; j <= n; j++) edge(P[i + ',' + j], P[i + ',' + (j + 1)]);
    const mid = (i, j) => { const q = [P[i + ',' + j], P[(i + 1) + ',' + j], P[(i + 1) + ',' + (j + 1)], P[i + ',' + (j + 1)]]; return [q.reduce((a, p) => a + p[0], 0) / 4, q.reduce((a, p) => a + p[1], 0) / 4]; };
    const stoma = ([x, y]) => `<ellipse cx="${f(x - 6)}" cy="${f(y)}" rx="6" ry="12" fill="${C.mint}" stroke="${C.green}" stroke-width="2.2"/><ellipse cx="${f(x + 6)}" cy="${f(y)}" rx="6" ry="12" fill="${C.mint}" stroke="${C.green}" stroke-width="2.2"/>`;
    return { lines: `<path d="${d}" stroke="${C.green}" stroke-width="2.5" fill="none" stroke-linecap="round"/>`, mid, stoma };
  };
  // 동그라미 시야: 바깥 네모(fill none)로 무리의 크기를 가운데에 맞춰 키우기·옮기기의 중심이 시야 가운데가 되게 한다
  const view = (id, key, cx, cy, r, inner, { pad = 0 } = {}) => `<rect x="${cx - r - pad}" y="${cy - r - pad}" width="${2 * (r + pad)}" height="${2 * (r + pad)}" fill="none"/>`
    + `<defs><clipPath id="${id}-${key}"><circle cx="${cx}" cy="${cy}" r="${r}"/></clipPath></defs>`
    + `<circle cx="${cx}" cy="${cy}" r="${r}" fill="white"/><g clip-path="url(#${id}-${key})">${inner}</g>`
    + `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${C.ink}" stroke-width="4"/>`;

  // ── 세포 그림 조각 ──
  const NUC = (x, y, r = 20) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${C.lilac}" stroke="${C.purple}" stroke-width="3"/>`;
  const dots = (cx, cy, rx, ry, seed, nRx = 0, k = 16) => {
    const rnd = seeded(seed); let s = '';
    for (let i = 0; i < k; i++) {
      const a = rnd() * Math.PI * 2, t = 0.35 + rnd() * 0.5, x = cx + Math.cos(a) * rx * t, y = cy + Math.sin(a) * ry * t;
      if (nRx && Math.hypot(x - cx, y - cy) < nRx) continue;
      s += `<circle cx="${f(x)}" cy="${f(y)}" r="2.6" fill="${C.line}"/>`;
    }
    return s;
  };
  // 식물 세포 상자: 바깥 세포벽 띠(두께 t), 안쪽 세포막(간격 gap)
  const plantCell = (x, y, w, h, { t = 14, gap = 7, r = 10 } = {}) => ({
    wallBand: `<path d="${rrect(x, y, w, h, r)} ${rrect(x + t, y + t, w - 2 * t, h - 2 * t, Math.max(2, r - t / 2))}" fill="${C.mint}" fill-rule="evenodd" stroke="${C.green}" stroke-width="2.5"/>`,
    inside: `<path d="${rrect(x + t, y + t, w - 2 * t, h - 2 * t, Math.max(2, r - t / 2))}" fill="white"/>`,
    memD: rrect(x + t + gap, y + t + gap, w - 2 * (t + gap), h - 2 * (t + gap), 6)
  });
  const mem = (d, cls = '', w = 4) => `<path class="${cls}" pathLength="1" d="${d}" fill="none" stroke="${C.orange}" stroke-width="${w}" stroke-linejoin="round"/>`;

  // ── 식물 몸 ──
  const leafD = (x, y, dir, len) => `M${x} ${y} Q${x + dir * len * 0.45} ${y - 34} ${x + dir * len} ${y - 12} Q${x + dir * len * 0.45} ${y + 12} ${x} ${y} Z`;
  const leaf = (x, y, dir, len) => `<path d="${leafD(x, y, dir, len)}" fill="${C.mint}" stroke="${C.green}" stroke-width="3"/><path d="M${x} ${y} Q${x + dir * len * 0.5} ${y - 12} ${x + dir * len * 0.9} ${y - 11}" stroke="${C.green}" stroke-width="2" fill="none"/>`;
  const soilBand = (gy) => `<rect x="0" y="${gy}" width="640" height="${360 - gy}" fill="${C.peach}"/><path d="M0 ${gy} H640" stroke="${C.orange}" stroke-width="3"/>`;
  const rootsD = (px, gy) => `M${px} ${gy} C${px - 2} ${gy + 30} ${px + 4} ${gy + 56} ${px} ${gy + 80} M${px} ${gy + 16} Q${px - 24} ${gy + 30} ${px - 44} ${gy + 58} M${px} ${gy + 22} Q${px + 26} ${gy + 34} ${px + 46} ${gy + 62} M${px - 26} ${gy + 34} L${px - 34} ${gy + 70} M${px + 2} ${gy + 50} Q${px + 18} ${gy + 60} ${px + 22} ${gy + 76} M${px - 1} ${gy + 44} Q${px - 16} ${gy + 56} ${px - 18} ${gy + 74}`;
  const roots = (px, gy) => `<path d="${rootsD(px, gy)}" stroke="${C.orange}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
  const stemD = (px, gy, top) => `M${px} ${gy} C${px - 6} ${gy - (gy - top) * 0.35} ${px + 6} ${gy - (gy - top) * 0.7} ${px} ${top}`;
  const flower = (x, y) => {
    let s = '';
    for (let k = 0; k < 6; k++) { const a = k * 60; s += `<ellipse cx="${x}" cy="${y - 23}" rx="11" ry="17" fill="${C.lilac}" stroke="${C.purple}" stroke-width="2.5" transform="rotate(${a} ${x} ${y})"/>`; }
    return s + `<circle cx="${x}" cy="${y}" r="12" fill="${C.yellow}" stroke="${C.orange}" stroke-width="2.5"/>`;
  };
  const nut = (x, y, r = 6) => `<circle cx="${f(x)}" cy="${f(y)}" r="${r}" fill="${C.orange}" stroke="white" stroke-width="2"/>`;

  // ════ 3단원 식물의 구조와 기능 ════

  // ── 세포: 양파 표피와 사철나무잎 뒷면 표피를 크게 보면 작은 칸(세포)이 빼곡하다 ──
  (function () {
    const id = 't61-c3a-sepo';
    let css = base(id);
    const A = { x: 200, y: 190, r: 100 }, B = { x: 500, y: 190, r: 100 };
    // 양파 조각(위에 한 겹 막)과 사철나무잎
    const onion = `<path d="M30 92 Q70 60 110 92 L104 104 Q70 78 36 104 Z" fill="${C.peach}" stroke="${C.orange}" stroke-width="2.5" stroke-linejoin="round"/><path d="M36 104 Q70 78 104 104" stroke="${C.blue}" stroke-width="3" fill="none"/>`;
    const sleaf = `<path d="M330 96 Q370 50 420 70 Q392 112 330 96 Z" fill="${C.mint}" stroke="${C.green}" stroke-width="3"/><path d="M330 96 Q376 82 412 72" stroke="${C.green}" stroke-width="2" fill="none"/>`;
    let body = onion + sleaf;
    const on = bricks(A.x, A.y, A.r, 72, 24, 3);
    const lf = leafCells(B.x, B.y, B.r, 46, 11);
    const st1 = lf.mid(0, 0), st2 = lf.mid(-1, 1), st3 = lf.mid(1, -1);
    const leafInner = `<rect x="${B.x - B.r}" y="${B.y - B.r}" width="${2 * B.r}" height="${2 * B.r}" fill="white"/>${lf.lines}${lf.stoma(st2)}${lf.stoma(st3)}`;
    const zl = (x1, y1, x2, y2) => `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="${C.muted}" stroke-width="2" stroke-dasharray="6 5"/>`;
    body += at(1, 'fin', zl(38, 106, A.x - 92, A.y - 38) + zl(104, 102, A.x - 22, A.y - 97), 0.2);
    body += `<g class="b1"><g class="grow grow1" style="--dx:-130px;--dy:-100px">${view(id, 'a', A.x, A.y, A.r, on.walls + on.nucs(), { pad: 4 })}</g></g>`;
    body += at(1, 'fin', text(A.x, 334, '양파', { size: 20 }), 0.9);
    body += at(2, 'fin', zl(336, 100, B.x - 92, B.y - 38) + zl(416, 76, B.x - 20, B.y - 98), 0.2);
    body += `<g class="b2"><g class="grow grow2" style="--dx:-120px;--dy:-110px">${view(id, 'b', B.x, B.y, B.r, leafInner, { pad: 4 })}</g></g>`;
    body += at(2, 'fin', text(B.x, 334, '사철나무잎', { size: 20 }), 0.9);
    // 칸 3: 칸 하나씩 반짝이고 '세포'
    const ob = on.list.reduce((a, b) => (Math.hypot(b.x + 36 - A.x, b.y + 12 - A.y) < Math.hypot(a.x + 36 - A.x, a.y + 12 - A.y) ? b : a));
    body += `<g class="b3"><rect class="flash flash3" x="${f(ob.x)}" y="${f(ob.y)}" width="72" height="24" rx="2" fill="none" stroke="${C.orange}" stroke-width="5"/></g>`;
    const lc = lf.mid(0, -1);
    body += `<g class="b3"><circle class="flash flash3" cx="${f(lc[0])}" cy="${f(lc[1])}" r="20" fill="none" stroke="${C.orange}" stroke-width="5" style="animation-delay:.3s"/></g>`;
    body += ring(ob.x + 36, ob.y + 12, 40, 3, C.orange, 0.2) + ring(lc[0], lc[1], 30, 3, C.orange, 0.5);
    body += at(3, 'pop', tag(350, 190, '세포', HOT, { size: 22 }), 0.8);
    put('6-1/과학/3/세포', svg(id, body, css));
  })();

  // ── 접안렌즈: 현미경 맨 위, 눈을 대고 들여다보는 렌즈 ──
  (function () {
    const id = 't61-c3a-jeopan';
    let css = base(id);
    const cx = 200, S = scope(cx);
    let body = S.arm + S.base + S.lamp + S.knob + S.knobMark + S.stage + S.slide + S.tube + S.eye + S.objSide + S.objLong + S.nose;
    body += glowRect(cx - 21, 48, 42, 54, 1, C.orange, 0.1, 8);
    body += at(1, 'fin', lead(cx + 22, 72, 397, 72), 0.4) + at(1, 'pop', tag(450, 72, '접안렌즈', COLD), 0.5);
    // 칸 2: 눈이 내려와 렌즈에 닿고, 눈길이 표본까지 내려간다. 오른쪽에 크게 보인 세포
    body += at(2, 'drop', eyeIcon(cx, 30), 0);
    body += at(2, 'fin', `<path class="mar" d="M${cx} 44 V232" stroke="${C.orange}" stroke-width="4" stroke-dasharray="10 8" fill="none" stroke-linecap="round"/>`, 0.6);
    const on = bricks(480, 228, 82, 64, 22, 5);
    body += `<g class="b2"><g class="grow grow2" style="--dx:-280px;--dy:10px;animation-delay:1s">${view(id, 'v', 480, 228, 82, on.walls + on.nucs(), { pad: 4 })}</g></g>`;
    // 칸 3
    body += ring(cx, 56, 34, 3, C.orange, 0.1) + `<g class="b3"><g class="pulse pulse3">${tag(450, 72, '접안렌즈', COLD, { size: 22 })}</g></g>`;
    put('6-1/과학/3/접안렌즈', svg(id, body, css));
  })();

  // ── 대물렌즈: 표본 바로 위에서 물체 쪽을 마주하는 렌즈. 짧을수록 낮은 배율 ──
  (function () {
    const id = 't61-c3a-daemul';
    let css = base(id);
    const cx = 170, S = scope(cx);
    let body = S.arm + S.base + S.lamp + S.knob + S.knobMark + S.stage + S.slide + S.tube + S.eye + S.objSide + S.objLong + S.nose;
    body += glowRect(cx - 16, 178, 32, 50, 1, C.orange, 0.1, 6);
    body += at(1, 'fin', `<path class="mar" d="M${cx} 226 V234" stroke="${C.orange}" stroke-width="4" stroke-dasharray="4 4"/>`, 0.4);
    body += at(1, 'fin', lead(cx + 18, 214, 382, 290), 0.4) + at(1, 'pop', tag(436, 294, '대물렌즈', COLD), 0.5);
    // 칸 2: 회전판의 대물렌즈 셋이 반짝이고, 오른쪽에 길이 차례로 늘어선다
    body += glowRect(cx - 50, 162, 100, 70, 2, C.orange, 0.1, 12, 'blink');
    const big = (x, len) => `<rect x="${x - 26}" y="58" width="52" height="16" rx="3" fill="${C.line}" stroke="${C.muted}" stroke-width="3"/><rect x="${x - 15}" y="74" width="30" height="${len}" rx="3" fill="${C.sky}" stroke="${C.blue}" stroke-width="3"/><rect x="${x - 9}" y="${74 + len}" width="18" height="8" rx="2" fill="${C.blue}"/>`;
    [[400, 40], [480, 70], [560, 100]].forEach(([x, len], i) => { body += at(2, 'drop', big(x, len), 0.2 + i * 0.3); });
    body += at(2, 'pop', tag(400, 214, '낮은 배율', HOT, { size: 18 }), 1.3) + at(2, 'pop', tag(560, 214, '높은 배율', HOT, { size: 18 }), 1.6);
    body += at(2, 'fin', `<path d="M456 214 H496" stroke="${C.orange}" stroke-width="4" stroke-linecap="round"/>` + head(504, 214, 0, C.orange, 4), 1.5);
    // 칸 3
    body += ring(cx, 206, 30, 3, C.orange, 0.1) + `<g class="b3"><g class="pulse pulse3">${tag(436, 294, '대물렌즈', COLD, { size: 22 })}</g></g>`;
    put('6-1/과학/3/대물렌즈', svg(id, body, css));
  })();

  // ── 재물대: 표본을 올려놓는 평평한 판. 조동 나사를 돌리면 오르내린다 ──
  (function () {
    const id = 't61-c3a-jaemul';
    let css = base(id);
    const cx = 220, S = scope(cx);
    let body = S.arm + S.base + S.lamp;
    body += `<g class="knob">${S.knob}<g class="spin">${S.knobMark}</g></g>`;
    // 오르내리는 무리: 재물대 + (밀려 들어오는) 표본 + 반짝임
    body += `<g class="stg">${S.stage}<g class="sl">${S.slide}</g>${glowRect(cx - 70, 240, 138, 18, 1, C.orange, 0.1, 5, 'blink')}</g>`;
    body += S.tube + S.eye + S.objSide + S.objLong + S.nose;
    body += at(1, 'fin', lead(cx + 68, 249, 404, 249), 0.4) + at(1, 'pop', tag(450, 249, '재물대', HOT), 0.5);
    // 칸 2: 표본이 오른쪽에서 들어와 가운데에 놓이고 아래 불빛이 비춘다
    body += at(2, 'pop', tag(450, 170, '표본', GAS), 1.4) + at(2, 'fin', lead(418, 176, cx + 30, 234), 1.4);
    body += at(2, 'fin', `<path class="mar" d="M${cx} 292 V258" stroke="${C.yellow}" stroke-width="6" stroke-dasharray="8 6" stroke-linecap="round"/>`, 1.2);
    // 칸 3: 조동 나사가 돌고 재물대가 오르내린다
    body += at(3, 'pop', tag(80, 214, '조동 나사'), 0.1) + at(3, 'fin', lead(108, 230, cx - 90, 270), 0.1);
    // 칸 4
    body += ring(cx, 249, 70, 4, C.orange, 0.1) + `<g class="b4"><g class="pulse pulse4">${tag(450, 249, '재물대', HOT, { size: 22 })}</g></g>`;
    css += states(id, 'sl', 'transform', ['translateX(330px)', 'translateX(330px)', 'none'], 1.2, 0.2) + `.sc-${id} .sl { opacity: 0; } .on2 .sc-${id} .sl { opacity: 1; }`;
    css += `@keyframes ${id}-updown { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-14px); } }
      @keyframes ${id}-turn { from { transform: rotate(0); } to { transform: rotate(-360deg); } }
      .on3 .sc-${id} .stg { animation: ${id}-updown 2.4s ease-in-out .5s infinite; }
      .on3 .sc-${id} .spin { animation: ${id}-turn 2.4s linear .5s infinite; }
      .on4 .sc-${id} .stg, .on4 .sc-${id} .spin { animation: none; }`;
    put('6-1/과학/3/재물대', svg(id, body, css));
  })();

  // ── 배율: 접안렌즈 배율 × 대물렌즈 배율. 10 × 10 = 100배 → 10 × 40 = 400배 ──
  (function () {
    const id = 't61-c3a-baeyul';
    let css = base(id);
    const cx = 170, S = scope(cx), V = { x: 470, y: 168, r: 118 };
    let body = S.arm + S.base + S.lamp + S.knob + S.knobMark + S.stage + S.slide + S.tube + S.eye + S.objSide;
    body += `<g class="oS">${S.objShort}</g><g class="oL">${S.objLong}</g>` + S.nose;
    css += states(id, 'oS', 'opacity', [1, 1, 0], 0.6, 0.2) + states(id, 'oL', 'opacity', [0, 0, 1], 0.6, 0.6);
    // 렌즈 이름과 배율
    body += text(258, 46, '접안렌즈', { size: 18, color: C.muted });
    body += text(258, 160, '대물렌즈', { size: 18, color: C.muted });
    body += at(1, 'pop', tag(258, 78, '10배', COLD), 0.1);
    body += shown(1, g('pop pop1', tag(258, 196, '10배', COLD), 0.4), 2) + at(2, 'pop', tag(258, 196, '40배', COLD), 0.8);
    // 시야: 같은 세포를 100배(작게) → 400배(크게)
    const on = bricks(V.x, V.y, V.r, 36, 12, 9, { wall: 1.4 });
    const pad = V.r + 80;
    const grid = `<g class="zoomgrid"><rect x="${V.x - pad}" y="${V.y - pad}" width="${2 * pad}" height="${2 * pad}" fill="none"/>${on.walls}${on.nucs()}</g>`;
    body += `<g class="b1"><g class="fin fin1">${view(id, 'v', V.x, V.y, V.r, grid)}</g></g>`;
    css += states(id, 'zoomgrid', 'transform', ['scale(1)', 'scale(1)', 'scale(4)'], 1.8, 0.9);
    // 식
    body += shown(1, g('rise rise1', text(V.x, 334, '10 × 10 = 100배', { size: 26 }), 0.7), 2);
    body += at(2, 'rise', text(V.x, 334, '10 × 40 = 400배', { size: 26, color: C.red }), 1.2);
    // 칸 3
    body += `<g class="b3"><rect class="flash flash3" x="${V.x - 112}" y="304" width="224" height="44" rx="12" fill="none" stroke="${C.orange}" stroke-width="4"/></g>`;
    body += at(3, 'pop', tag(V.x + 96, 46, '배율', HOT, { size: 22 }), 0.5);
    put('6-1/과학/3/배율', svg(id, body, css));
  })();

  // ── 표피: 양파 조각 안쪽의 얇은 막을 핀셋으로 벗겨 내고 크게 본다 ──
  (function () {
    const id = 't61-c3a-pyopi';
    let css = base(id);
    // 위가 오목한 양파 조각(두께 있는 띠). 안쪽 겉면 = 얇은 막
    const outerD = 'M60 176 Q190 336 320 176', innerD = 'M86 176 Q190 300 294 176';
    const piece = `<path d="${outerD} L294 176 Q190 300 86 176 Z" fill="${C.peach}" stroke="${C.orange}" stroke-width="3" stroke-linejoin="round"/>`;
    let body = piece + `<path class="outer" d="${outerD}" stroke="${C.orange}" stroke-width="3" fill="none"/>`;
    body += text(190, 300, '양파 조각', { size: 20, color: C.muted });
    // 얇은 막 + 핀셋(칸 2에 함께 들린다)
    const tweez = `<path d="M292 170 L392 136 M298 180 L396 148" stroke="${C.muted}" stroke-width="5" stroke-linecap="round"/><path d="M392 136 Q404 140 396 148" stroke="${C.muted}" stroke-width="5" fill="none" stroke-linecap="round"/>`;
    body += `<g class="peel"><path d="${innerD}" stroke="${C.blue}" stroke-width="5" fill="none" stroke-linecap="round"/><g class="b2">${tweez}</g></g>`;
    body += `<g class="b1"><path class="blink blink1" d="${innerD}" stroke="${C.yellow}" stroke-width="13" fill="none" stroke-linecap="round" style="animation-delay:.2s"/></g>`;
    body += shown(1, g('pop pop1', tag(190, 130, '얇은 막', COLD), 0.6), 2);
    css += states(id, 'peel', 'transform', ['none', 'none', 'translateY(-112px)'], 1.3, 0.8);
    // 칸 3: 벗겨 낸 막을 크게 보면 세포가 빼곡하다
    const V = { x: 500, y: 200, r: 108 };
    const on = bricks(V.x, V.y, V.r, 70, 24, 13);
    body += `<g class="b3">${lead(298, 62, V.x - 70, V.y - 84)}${lead(232, 118, V.x - 106, V.y - 20)}</g>`;
    body += `<g class="b3"><g class="grow grow3" style="--dx:-290px;--dy:-110px">${view(id, 'v', V.x, V.y, V.r, on.walls + on.nucs(), { pad: 4 })}</g></g>`;
    // 칸 4: 막과 바깥 겉면이 반짝이고 '표피'
    body += `<g class="b4"><g class="peelGlow"><path class="flash flash4" d="${innerD}" stroke="${C.yellow}" stroke-width="13" fill="none" opacity=".75" stroke-linecap="round"/></g></g>`;
    body += `<g class="b4"><path class="flash flash4" d="${outerD}" stroke="${C.yellow}" stroke-width="11" fill="none" opacity=".75" stroke-linecap="round" style="animation-delay:.4s"/></g>`;
    body += `<g class="b4"><path d="${outerD}" stroke="${C.blue}" stroke-width="4" fill="none"/></g>`;
    body += at(4, 'pop', tag(190, 30, '표피', COLD, { size: 22 }), 0.7) + at(4, 'pop', tag(380, 306, '표피', COLD, { size: 22 }), 0.9);
    body += at(4, 'fin', lead(340, 296, 290, 230), 0.9);
    css += `.sc-${id} .peelGlow { transform: translateY(-112px); }`;
    put('6-1/과학/3/표피', svg(id, body, css));
  })();

  // ── 세포막: 식물 세포도 동물 세포도 얇은 막이 감싸 안과 밖을 나눈다 ──
  (function () {
    const id = 't61-c3a-sepomak';
    let css = base(id);
    const P = plantCell(54, 96, 232, 156, { t: 14, gap: 8 });
    let body = P.wallBand + P.inside + dots(170, 174, 90, 56, 21, 26) + NUC(150, 174, 20);
    body += `<g class="b1">${mem(P.memD, 'draw draw1')}</g>`;
    body += at(1, 'fin', lead(212, 104, 212, 54), 1.6) + at(1, 'pop', tag(212, 40, '세포막', HOT), 1.7);
    body += text(170, 300, '식물 세포', { size: 20, color: C.muted });
    // 동물 세포
    const A = { x: 472, y: 174, rx: 118, ry: 82 };
    body += at(2, 'fin', `<path d="${oval(A.x, A.y, A.rx, A.ry)}" fill="white"/>` + dots(A.x, A.y, A.rx, A.ry, 33, 30) + NUC(A.x - 6, A.y, 22) + text(A.x, 300, '동물 세포', { size: 20, color: C.muted }), 0);
    body += `<g class="b2">${mem(oval(A.x, A.y, A.rx, A.ry), 'draw draw2')}</g>`;
    body += at(2, 'fin', lead(A.x + 60, A.y - 72, A.x + 60, 54), 1.6) + at(2, 'pop', tag(A.x + 60, 40, '세포막', HOT), 1.7);
    // 칸 3: 두 막이 반짝이고 안·밖
    body += `<g class="b3">${mem(P.memD, 'flash flash3', 7)}${mem(oval(A.x, A.y, A.rx, A.ry), 'flash flash3', 7)}</g>`;
    body += at(3, 'pop', text(A.x + 52, A.y + 44, '안', { size: 24, color: C.orange }), 0.6) + at(3, 'pop', text(614, 182, '밖', { size: 24, color: C.orange }), 0.9);
    body += at(3, 'pop', text(232, 204, '안', { size: 24, color: C.orange }), 0.6) + at(3, 'pop', text(28, 182, '밖', { size: 24, color: C.orange }), 0.9);
    put('6-1/과학/3/세포막', svg(id, body, css));
  })();

  // ── 세포벽: 양파 표피세포 가장자리가 뚜렷한 까닭. 식물 세포에만 있다 ──
  (function () {
    const id = 't61-c3a-sepobyeok';
    let css = base(id);
    const V = { x: 122, y: 170, r: 100 };
    const on = bricks(V.x, V.y, V.r, 64, 26, 17, { wall: 3 });
    let body = `<g>${view(id, 'v', V.x, V.y, V.r, on.walls + `<g class="b1"><g class="flash flash1" style="animation-delay:.2s"><g opacity=".6">${on.halo}</g></g></g>` + on.lines + on.nucs())}</g>`;
    body += text(V.x, 324, '양파 표피세포', { size: 18, color: C.muted });
    body += `<g class="b1"><circle class="flash flash1" cx="${V.x}" cy="${V.y}" r="${V.r + 8}" fill="none" stroke="${C.yellow}" stroke-width="5"/></g>`;
    // 칸 2: 세포 하나가 크게 — 세포막 바깥을 두꺼운 벽이 한 겹 더
    const P = plantCell(266, 108, 168, 124, { t: 13, gap: 7 });
    const ob = on.list.reduce((a, b) => (Math.hypot(b.x + 32 - V.x, b.y + 13 - V.y) < Math.hypot(a.x + 32 - V.x, a.y + 13 - V.y) ? b : a));
    body += `<g class="b2"><rect class="flash flash2" x="${f(ob.x)}" y="${f(ob.y)}" width="64" height="26" rx="2" fill="none" stroke="${C.orange}" stroke-width="5"/></g>`;
    body += `<g class="b2">${lead(ob.x + 64, ob.y, 266, 108)}${lead(ob.x + 64, ob.y + 26, 266, 232)}</g>`;
    body += `<g class="b2"><g class="grow grow2" style="--dx:-220px;--dy:4px;animation-delay:.3s">${P.wallBand}${P.inside}${dots(350, 170, 60, 36, 41, 22)}${NUC(330, 170, 17)}${mem(P.memD, '', 3.5)}</g></g>`;
    body += glowRect(260, 102, 180, 136, 2, C.yellow, 1.4, 14);
    body += at(2, 'fin', lead(350, 108, 350, 72), 1.5) + at(2, 'pop', tag(350, 56, '세포벽', OK), 1.6);
    body += at(2, 'fin', lead(400, 218, 420, 268), 1.8) + at(2, 'pop', tag(420, 280, '세포막', HOT, { size: 18 }), 1.9);
    body += at(2, 'fin', text(330, 324, '식물 세포', { size: 18, color: C.muted }), 1.2);
    // 칸 3: 동물 세포에는 세포벽이 없다
    const A = { x: 548, y: 170, rx: 70, ry: 54 };
    body += at(3, 'pop', `<path d="${oval(A.x, A.y, A.rx, A.ry)}" fill="white"/>${dots(A.x, A.y, A.rx, A.ry, 43, 22, 12)}${NUC(A.x - 4, A.y, 16)}${mem(oval(A.x, A.y, A.rx, A.ry), '', 3.5)}`, 0.1);
    body += at(3, 'pop', tag(548, 56, '세포벽 없음', GAS, { size: 18 }), 0.7);
    body += at(3, 'fin', text(548, 324, '동물 세포', { size: 18, color: C.muted }), 0.4);
    // 칸 4
    body += glowRect(260, 102, 180, 136, 4, C.green, 0.1, 14) + `<g class="b4"><g class="pulse pulse4">${tag(350, 56, '세포벽', OK, { size: 22 })}</g></g>`;
    put('6-1/과학/3/세포벽', svg(id, body, css));
  })();

  // ── 핵: 아세트산 카민 용액으로 물들이면 세포마다 동그란 핵이 붉게 보인다 ──
  (function () {
    const id = 't61-c3a-haek';
    let css = base(id);
    const V = { x: 360, y: 186, r: 128 };
    // 스포이트와 받침 유리 위 표본
    const dropper = `<rect x="104" y="20" width="32" height="30" rx="14" fill="${C.peach}" stroke="${C.orange}" stroke-width="3"/><path d="M110 50 H130 L124 118 H116 Z" fill="white" stroke="${C.muted}" stroke-width="3" stroke-linejoin="round"/><path d="M114 84 H126 L124 116 H116 Z" fill="${C.red}" opacity=".8"/>`;
    let body = dropper;
    body += `<rect x="50" y="196" width="140" height="12" rx="2" fill="white" stroke="${C.blue}" stroke-width="2.5"/><rect x="82" y="188" width="76" height="8" rx="1.5" fill="${C.sky}" stroke="${C.blue}" stroke-width="2"/>`;
    body += `<rect class="stain" x="84" y="189" width="72" height="6" fill="${C.red}"/>`;
    body += lead(158, 190, V.x - 112, V.y - 60) + lead(158, 196, V.x - 120, V.y + 30);
    const on = bricks(V.x, V.y, V.r, 84, 30, 23, { fill: 'none', wall: 2.5, nucR: 6.5 });
    const inner = `<rect class="wash" x="${V.x - V.r}" y="${V.y - V.r}" width="${2 * V.r}" height="${2 * V.r}" fill="${C.peach}"/>` + on.walls + `<g class="nuc">${on.nucs(C.red)}</g>`;
    body += view(id, 'v', V.x, V.y, V.r, inner);
    body += `<g class="b1">${[0, 0.7, 1.4].map((s) => `<g class="up" style="--up:66px;animation-delay:${s}s"><circle cx="120" cy="122" r="5" fill="${C.red}"/></g>`).join('')}</g>`;
    body += at(1, 'pop', tag(120, 262, '아세트산 카민 용액', HOT, { size: 18 }), 0.3);
    css += states(id, 'stain', 'opacity', [0, 0.5], 1.2, 0.8) + states(id, 'wash', 'opacity', [0, 0.45], 1.6, 1.2) + states(id, 'nuc', 'opacity', [0.15, 1], 1.6, 1.4);
    // 칸 2: 세포마다 하나씩 — 고리가 퍼진다
    const inView = on.list.filter((b) => Math.hypot(b.nx - V.x, b.ny - V.y) < V.r - 14);
    inView.forEach((b, i) => { body += ring(b.nx, b.ny, 12, 2, C.red, f(0.1 + (i % 6) * 0.15)); });
    const whole = on.list.filter((b) => [[0, 0], [84, 0], [0, 30], [84, 30]].every(([dx, dy]) => Math.hypot(b.x + dx - V.x, b.y + dy - V.y) < V.r - 6));
    const pick = whole.reduce((a, b) => (Math.hypot(b.nx - 430, b.ny - 120) < Math.hypot(a.nx - 430, a.ny - 120) ? b : a));
    body += at(2, 'fin', lead(pick.nx + 8, pick.ny - 6, 540, 70), 1.0) + at(2, 'pop', tag(560, 60, '핵', GAS, { size: 22 }), 1.1);
    // 칸 3: 세포 하나를 두르고 그 핵이 커졌다 작아진다
    body += `<g class="b3"><rect class="flash flash3" x="${f(pick.x)}" y="${f(pick.y)}" width="84" height="30" rx="2" fill="none" stroke="${C.orange}" stroke-width="5"/></g>`;
    body += `<g class="b3"><g class="pulse pulse3"><circle cx="${f(pick.nx)}" cy="${f(pick.ny)}" r="9" fill="${C.red}" stroke="white" stroke-width="2"/></g></g>`;
    body += ring(pick.nx, pick.ny, 16, 3, C.red, 0.6) + `<g class="b3"><g class="pulse pulse3">${tag(560, 60, '핵', GAS, { size: 24 })}</g></g>`;
    put('6-1/과학/3/핵', svg(id, body, css));
  })();

  // ── 구조: 세포벽·세포막·핵이 제자리에 모여 식물 세포의 짜임을 이룬다 ──
  (function () {
    const id = 't61-c3a-gujo';
    let css = base(id);
    const P = plantCell(220, 110, 200, 140, { t: 14, gap: 8 });
    const NX = 300, NY = 180;
    let body = '';
    body += `<g class="mw"><g class="b1"><g class="pop pop1">${P.wallBand}</g></g></g>`;
    body += `<g class="mm"><g class="b1"><g class="pop pop1" style="animation-delay:.35s">${mem(P.memD, '', 4)}</g></g></g>`;
    body += `<g class="mn"><g class="b1"><g class="pop pop1" style="animation-delay:.7s">${NUC(NX, NY, 20)}</g></g></g>`;
    css += states(id, 'mw', 'transform', ['translateX(-208px)', 'translateX(-208px)', 'none'], 1.4, 0.3)
      + states(id, 'mm', 'transform', ['translateX(4px)', 'translateX(4px)', 'none'], 1.4, 0.3)
      + states(id, 'mn', 'transform', ['translateX(232px)', 'translateX(232px)', 'none'], 1.4, 0.3);
    body += shown(1, g('fin fin1', text(112, 290, '세포벽', { size: 20 })), 2) + shown(1, g('fin fin1', text(324, 290, '세포막', { size: 20 }), 0.35), 2) + shown(1, g('fin fin1', text(532, 290, '핵', { size: 20 }), 0.7), 2);
    // 칸 2: 모인 뒤 이름표
    body += at(2, 'fin', lead(420, 122, 494, 100), 1.4) + at(2, 'pop', tag(530, 100, '세포벽', OK), 1.5);
    body += at(2, 'fin', lead(398, 180, 494, 180), 1.55) + at(2, 'pop', tag(530, 180, '세포막', HOT), 1.65);
    body += at(2, 'fin', lead(320, 186, 504, 258), 1.7) + at(2, 'pop', tag(530, 260, '핵', GAS), 1.8);
    // 칸 3: 부분이 차례로 반짝이고 '식물 세포의 구조'
    body += glowRect(214, 104, 212, 152, 3, C.green, 0.1, 14);
    body += `<g class="b3">${mem(P.memD, 'flash flash3', 7).replace('class="flash flash3"', 'class="flash flash3" style="animation-delay:.6s"')}</g>`;
    body += `<g class="b3"><circle class="flash flash3" cx="${NX}" cy="${NY}" r="26" fill="none" stroke="${C.purple}" stroke-width="5" style="animation-delay:1.1s"/></g>`;
    body += at(3, 'pop', tag(320, 50, '식물 세포의 구조', OK, { size: 22 }), 1.6);
    put('6-1/과학/3/구조', svg(id, body, css));
  })();

  // ── 기능: 뿌리는 물을 빨아들이고, 줄기는 물을 나르고, 잎은 양분을 만든다 ──
  (function () {
    const id = 't61-c3a-gineung';
    let css = base(id);
    const px = 300, gy = 232, top = 66;
    const leaves = [[gy - 56, -1, 86], [gy - 100, 1, 86], [gy - 140, -1, 64]];
    let body = soilBand(gy) + `<g class="sun">${sunIcon(70, 60, 26)}</g>`;
    body += `<g class="rootG">${roots(px, gy)}</g>`;
    body += `<path d="${stemD(px, gy, top)}" stroke="${C.green}" stroke-width="7" fill="none" stroke-linecap="round"/>`;
    body += leaves.map(([y, d, l]) => leaf(px, y, d, l)).join('');
    body += `<path d="M${px} ${top} Q${px - 12} ${top - 20} ${px} ${top - 30} Q${px + 12} ${top - 20} ${px} ${top} Z" fill="${C.mint}" stroke="${C.green}" stroke-width="3"/>`;
    // 칸 1: 흙 속 물이 뿌리로 들어간다
    body += `<g class="b1"><path class="blink blink1" d="${rootsD(px, gy)}" stroke="${C.yellow}" stroke-width="11" fill="none" stroke-linecap="round"/></g>`;
    body += `<g class="b1"><path d="${rootsD(px, gy)}" stroke="${C.orange}" stroke-width="4" fill="none" stroke-linecap="round"/></g>`;
    [[px - 44, gy + 58, -40, 10], [px + 46, gy + 62, 40, 12], [px - 34, gy + 72, -34, 30], [px + 22, gy + 78, 36, 30], [px, gy + 82, 0, 40]].forEach(([x, y, dx, dy], i) => {
      body += `<g class="b1"><g class="in" style="--dx:${dx}px;--dy:${dy}px;animation-delay:${f(i * 0.4)}s">${drop(x, y, 6)}</g></g>`;
    });
    body += at(1, 'fin', lead(px + 40, gy + 40, 420, 300), 0.4) + at(1, 'pop', tag(450, 300, '뿌리', HOT), 0.5);
    // 칸 2: 물이 줄기를 따라 위로
    body += `<g class="b2"><path class="blink blink2" d="${stemD(px, gy, top)}" stroke="${C.yellow}" stroke-width="15" fill="none" stroke-linecap="round"/></g>`;
    body += `<g class="b2"><path d="${stemD(px, gy, top)}" stroke="${C.green}" stroke-width="7" fill="none" stroke-linecap="round"/></g>`;
    body += `<g class="b2">${[0, 0.8, 1.6].map((s) => `<g class="up" style="--up:-150px;animation-delay:${s}s">${drop(px, gy - 6, 5.5)}</g>`).join('')}</g>`;
    body += at(2, 'fin', lead(px + 8, 200, 420, 210), 0.4) + at(2, 'pop', tag(450, 210, '줄기', OK), 0.5);
    // 칸 3: 햇빛을 받은 잎이 양분을 만든다
    body += at(3, 'fin', flow([[100, 86], [px - 70, gy - 74]], C.orange, { w: 4 }) + flow([[104, 70], [px - 44, gy - 152]], C.orange, { w: 4 }), 0.1);
    body += `<g class="b3">${leaves.map(([y, d, l]) => `<path class="blink blink3" d="${leafD(px, y, d, l)}" fill="${C.yellow}" style="animation-delay:.6s"/>`).join('')}</g>`;
    body += leaves.map(([y, d, l], i) => at(3, 'pop', nut(px + d * l * 0.42, y - 8) + nut(px + d * l * 0.7, y - 10, 5), 0.9 + i * 0.2)).join('');
    body += at(3, 'fin', lead(px + 80, gy - 116, 420, 120), 1.2) + at(3, 'pop', tag(450, 120, '잎', OK), 1.3) + at(3, 'pop', tag(546, 120, '양분', HOT), 1.6);
    // 칸 4
    body += ring(px, gy + 40, 54, 4, C.orange, 0.1) + ring(px, gy - 80, 40, 4, C.green, 0.4) + ring(px, gy - 110, 70, 4, C.green, 0.7);
    body += at(4, 'pop', tag(560, 40, '기능', HOT, { size: 22 }), 1.0);
    put('6-1/과학/3/기능', svg(id, body, css));
  })();

  // ── 기관: 뿌리·줄기·잎·꽃. 생김새가 다르고 맡은 일이 따로 있는 부분 ──
  (function () {
    const id = 't61-c3a-gigwan';
    let css = base(id);
    const px = 320, gy = 250, top = 66;
    let body = soilBand(gy);
    // 부분마다 무리를 나눠 칸 2에 벌어졌다가 칸 3에 다시 모인다
    const rootG = roots(px, gy)
      + `<g class="b1"><path class="blink blink1" d="${rootsD(px, gy)}" stroke="${C.yellow}" stroke-width="11" fill="none" stroke-linecap="round"/></g><g class="b1"><path d="${rootsD(px, gy)}" stroke="${C.orange}" stroke-width="4" fill="none" stroke-linecap="round"/></g>`
      + at(1, 'fin', lead(px - 40, gy + 50, 196, 300), 0.2) + at(1, 'pop', tag(160, 300, '뿌리', HOT), 0.3)
      + `<g class="b2">${[[px - 44, gy + 58, -36, 10], [px + 46, gy + 62, 36, 12], [px, gy + 82, 0, 30]].map(([x, y, dx, dy], i) => `<g class="in" style="--dx:${dx}px;--dy:${dy}px;animation-delay:${f(0.6 + i * 0.5)}s">${drop(x, y, 6)}</g>`).join('')}</g>`;
    const stemG = `<path d="${stemD(px, gy, top)}" stroke="${C.green}" stroke-width="7" fill="none" stroke-linecap="round"/>`
      + `<g class="b1"><path class="blink blink1" d="${stemD(px, gy, top)}" stroke="${C.yellow}" stroke-width="15" fill="none" stroke-linecap="round" style="animation-delay:.5s"/></g>`
      + `<g class="b1"><path d="${stemD(px, gy, top)}" stroke="${C.green}" stroke-width="7" fill="none" stroke-linecap="round"/></g>`
      + at(1, 'fin', lead(px + 6, 226, 444, 226), 0.6) + at(1, 'pop', tag(476, 226, '줄기', OK), 0.7)
      + `<g class="b2">${[0.6, 1.4].map((s) => `<g class="up" style="--up:-130px;animation-delay:${s}s">${drop(px, gy - 10, 5.5)}</g>`).join('')}</g>`;
    const LL = [[gy - 50, -1, 90], [gy - 135, -1, 66]], LR = [gy - 95, 1, 90];
    const leafL = LL.map(([y, d, l]) => leaf(px, y, d, l)).join('')
      + `<g class="b1">${LL.map(([y, d, l]) => `<path class="blink blink1" d="${leafD(px, y, d, l)}" fill="${C.yellow}" style="animation-delay:1s"/>`).join('')}</g>`
      + at(1, 'fin', lead(px - 84, gy - 60, 182, 170), 1.0) + at(1, 'pop', tag(150, 162, '잎', OK), 1.1)
      + LL.map(([y, d, l], i) => at(2, 'pop', nut(px + d * l * 0.5, y - 8, 5), 1.0 + i * 0.3)).join('');
    const leafR = leaf(px, LR[0], LR[1], LR[2])
      + `<g class="b1"><path class="blink blink1" d="${leafD(px, LR[0], LR[1], LR[2])}" fill="${C.yellow}" style="animation-delay:1s"/></g>`
      + at(2, 'pop', nut(px + 45, LR[0] - 8, 5), 1.2);
    const flowerG = `<g class="fl">${flower(px, 56)}</g>` + ring(px, 56, 40, 1, C.purple, 1.4)
      + at(1, 'fin', lead(px + 42, 56, 444, 56), 1.5) + at(1, 'pop', tag(470, 56, '꽃', GAS), 1.6);
    body += `<g class="gR">${rootG}</g><g class="gS">${stemG}</g><g class="gL">${leafL}</g><g class="gLR">${leafR}</g><g class="gF">${flowerG}</g>`;
    css += states(id, 'gR', 'transform', ['none', 'none', 'translateY(20px)', 'none'], 1, 0.2)
      + states(id, 'gL', 'transform', ['none', 'none', 'translateX(-34px)', 'none'], 1, 0.2)
      + states(id, 'gLR', 'transform', ['none', 'none', 'translateX(34px)', 'none'], 1, 0.2)
      + states(id, 'gF', 'transform', ['none', 'none', 'translateY(-14px)', 'none'], 1, 0.2);
    css += `.sc-${id} .fl { transform-box: fill-box; transform-origin: center; } .on2 .sc-${id} .fl { animation: ${id}-pulse 1.4s ease-in-out 1s 2; } .on3 .sc-${id} .fl { animation: none; }`;
    // 칸 3: 네 부분에 고리가 퍼지고 '기관'
    body += ring(px, gy + 44, 56, 3, C.orange, 0.9) + ring(px, gy - 70, 36, 3, C.green, 1.1) + ring(px - 50, gy - 80, 60, 3, C.green, 1.3) + ring(px, 56, 44, 3, C.purple, 1.5);
    body += at(3, 'pop', tag(560, 130, '기관', OK, { size: 22 }), 1.8);
    put('6-1/과학/3/기관', svg(id, body, css));
  })();
})(typeof window !== 'undefined' ? window : globalThis);
