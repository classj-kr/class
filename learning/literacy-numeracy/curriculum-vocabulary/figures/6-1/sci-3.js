// 과학 6-1 낱말 도식(3단원 식물의 구조와 기능 — 뿌리·잎·꽃): 흡수, 광합성, 아이오딘-아이오딘화 칼륨 용액,
// 잎몸·잎자루·잎맥, 기공, 증산 작용, 암술·수술·꽃받침, 꽃가루받이를 코드로 그린다.
// 눈에 보이지 않는 기체(이산화 탄소·수증기)는 점선 테두리의 빈 동그라미로 적는다(6-2 sci.js 와 같은 약속).
// 교과서(미래엔·아이스크림)가 이 단원에서 다루지 않는 것(광합성에서 나오는 산소, 기공을 여닫는 세포)은 그리지 않는다.
// 움직임은 transform·opacity·stroke-dashoffset 만 쓴다(아이패드 사파리).
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
  const seeded = (seed) => () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  // 글자 폭 어림(맑은 고딕 굵게: 한글 1em, 숫자·기호 .6em, 빈칸 .3em)
  const tw = (s, size) => [...String(s)].reduce((a, c) => a + (/[가-힣]/.test(c) ? 1 : c === ' ' ? 0.3 : 0.6), 0) * size;
  const HOT = [C.peach, C.orange], COLD = [C.sky, C.blue], OK = [C.mint, C.green], GAS = [C.lilac, C.purple], GRAY = ['white', C.muted];
  const tag = (cx, cy, label, [fill, stroke] = OK, { size = 20, dash = false } = {}) => {
    const w = Math.round(tw(label, size) + size * 1.3), h = Math.round(size * 1.7);
    return `<g><rect x="${f(cx - w / 2)}" y="${f(cy - h / 2)}" width="${w}" height="${h}" rx="${h / 2}" fill="${fill}" stroke="${stroke}" stroke-width="2.5"${dash ? ' stroke-dasharray="6 4"' : ''}/>${text(f(cx), f(cy + size * 0.36), label, { size })}</g>`;
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
  const solid = (x1, y1, x2, y2, color, w = 4) => {
    const ang = Math.atan2(y2 - y1, x2 - x1);
    return `<path d="M${f(x1)} ${f(y1)} L${f(x2 - w * Math.cos(ang))} ${f(y2 - w * Math.sin(ang))}" stroke="${color}" stroke-width="${w}" stroke-linecap="round"/>${head(x2, y2, ang, color, w)}`;
  };
  // 기체 알갱이: 눈에 안 보이므로 점선 테두리
  const gas = (x, y, color = C.purple, r = 7) => `<circle cx="${f(x)}" cy="${f(y)}" r="${r}" fill="white" stroke="${color}" stroke-width="2.5" stroke-dasharray="3.5 2.5"/>`;
  const drop = (x, y, r = 7) => `<path d="M${f(x)} ${f(y - r * 1.5)} Q${f(x + r * 1.05)} ${f(y - r * 0.2)} ${f(x + r)} ${f(y + r * 0.2)} A${r} ${r} 0 0 1 ${f(x - r)} ${f(y + r * 0.2)} Q${f(x - r * 1.05)} ${f(y - r * 0.2)} ${f(x)} ${f(y - r * 1.5)} Z" fill="${C.sky}" stroke="${C.blue}" stroke-width="2"/>`;
  const nut = (x, y, r = 6) => `<circle cx="${f(x)}" cy="${f(y)}" r="${r}" fill="${C.orange}" stroke="white" stroke-width="2"/>`;
  const pollen = (x, y, r = 4.5) => `<circle cx="${f(x)}" cy="${f(y)}" r="${r}" fill="${C.yellow}" stroke="${C.orange}" stroke-width="1.6"/>`;
  const sunIcon = (x, y, r = 24) => {
    let rays = '';
    for (let k = 0; k < 8; k++) { const a = (k * Math.PI) / 4; rays += `<path d="M${f(x + (r + 6) * Math.cos(a))} ${f(y + (r + 6) * Math.sin(a))} L${f(x + (r + 15) * Math.cos(a))} ${f(y + (r + 15) * Math.sin(a))}" stroke="${C.orange}" stroke-width="4" stroke-linecap="round"/>`; }
    return `<g class="rays">${rays}</g><circle cx="${x}" cy="${y}" r="${r}" fill="${C.yellow}" stroke="${C.orange}" stroke-width="3"/>`;
  };
  // 칸마다 바뀌는 CSS 값(vals[0] 은 첫 칸이 열리기 전 모습)
  const states = (id, cls, prop, vals, sec = 2, delay = 0.2) => `.sc-${id} .${cls} { ${prop}: ${vals[0]}; transition: ${prop} ${sec}s ease-in-out ${delay}s; }`
    + vals.slice(1).map((v, i) => v == null ? '' : `.on${i + 1} .sc-${id} .${cls} { ${prop}: ${v}; }`).join('');
  const ring = (cx, cy, r, n, color = C.green, s = 0) => `<g class="b${n}"><circle class="ring ring${n}"${dl(s)} cx="${f(cx)}" cy="${f(cy)}" r="${r}" fill="none" stroke="${color}" stroke-width="4"/></g>`;
  const glowRect = (x, y, w, h, n, color = C.green, delay = 0, rx = 14) =>
    `<g class="b${n}"><rect class="flash flash${n}"${dl(delay)} x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="${rx}" fill="none" stroke="${color}" stroke-width="5"/></g>`;
  // 움직이는 알갱이(go: 제자리에서 --dx,--dy 만큼 갔다가 사라지기를 되풀이)
  const mover = (cls, inner, dx, dy, s = 0) => `<g class="${cls}" style="--dx:${f(dx)}px;--dy:${f(dy)}px;animation-delay:${s}s">${inner}</g>`;
  // 크게 보기 원: 작은 원(c1,r1)과 큰 원(c2,r2)을 두 줄로 잇는다
  const zoomLines = ([x1, y1], r1, [x2, y2], r2) => {
    const d = Math.hypot(x2 - x1, y2 - y1), nx = -(y2 - y1) / d, ny = (x2 - x1) / d;
    return [1, -1].map((k) => `<path d="M${f(x1 + k * r1 * nx)} ${f(y1 + k * r1 * ny)} L${f(x2 + k * r2 * nx)} ${f(y2 + k * r2 * ny)}" stroke="${C.muted}" stroke-width="2.5" stroke-dasharray="7 5"/>`).join('');
  };

  // 장면마다 같이 쓰는 움직임
  const base = (id) => {
    let s = `
    .sc-${id} .pop, .sc-${id} .pulse, .sc-${id} .ring, .sc-${id} .rays { transform-box: fill-box; transform-origin: center; }
    .sc-${id} .rays { animation: ${id}-pulse 2.4s ease-in-out infinite; }
    .sc-${id} .mar { animation: ${id}-mar .7s linear infinite; }
    .sc-${id} .draw { stroke-dasharray: 1; stroke-dashoffset: 1; transition: stroke-dashoffset 1.2s ease-in-out .2s; }
    .sc-${id} .ring { opacity: 0; }
    @keyframes ${id}-pop { 0% { opacity: 0; transform: scale(.3); } 70% { opacity: 1; transform: scale(1.12); } 100% { opacity: 1; transform: scale(1); } }
    @keyframes ${id}-fin { from { opacity: 0; } to { opacity: 1; } }
    @keyframes ${id}-rise { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
    @keyframes ${id}-drop { from { opacity: 0; transform: translateY(-40px); } to { opacity: 1; transform: none; } }
    @keyframes ${id}-pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.12); } }
    @keyframes ${id}-flash { 0% { opacity: 0; } 20% { opacity: 1; } 40% { opacity: .25; } 60% { opacity: 1; } 80% { opacity: .25; } 100% { opacity: 1; } }
    @keyframes ${id}-ring { 0% { opacity: .9; transform: scale(1); } 100% { opacity: 0; transform: scale(1.6); } }
    @keyframes ${id}-mar { from { stroke-dashoffset: 24; } to { stroke-dashoffset: 0; } }
    @keyframes ${id}-up { 0% { opacity: 0; transform: translateY(0); } 20%, 75% { opacity: 1; } 100% { opacity: 0; transform: translateY(var(--up, -60px)); } }
    @keyframes ${id}-go { 0% { opacity: 0; transform: translate(0, 0); } 18% { opacity: 1; } 82% { opacity: 1; } 100% { opacity: 0; transform: translate(var(--dx, 0), var(--dy, 0)); } }
    .sc-${id} .up { animation: ${id}-up 2.4s ease-in infinite; }
    .sc-${id} .go { animation: ${id}-go 2.2s ease-in-out infinite; }
    `;
    for (let n = 1; n <= 5; n++) s += `
    .on${n} .sc-${id} .pop${n} { animation: ${id}-pop .5s ease-out both; }
    .on${n} .sc-${id} .fin${n} { animation: ${id}-fin .5s ease-out both; }
    .on${n} .sc-${id} .rise${n} { animation: ${id}-rise .5s ease-out both; }
    .on${n} .sc-${id} .drop${n} { animation: ${id}-drop .6s ease-out both; }
    .on${n} .sc-${id} .pulse${n} { animation: ${id}-pulse .7s ease-in-out .3s 2; }
    .on${n} .sc-${id} .flash${n} { animation: ${id}-flash 1.4s ease-in-out both; }
    .on${n} .sc-${id} .ring${n} { animation: ${id}-ring 1.1s ease-out .3s 2; }
    .on${n} .sc-${id} .draw${n} { stroke-dashoffset: 0; }`;
    return s;
  };

  // ── 식물 그림 조각 ──
  const soil = (gy) => `<rect x="0" y="${gy}" width="640" height="${360 - gy}" fill="${C.peach}"/>`
    + `<rect x="0" y="${gy - 6}" width="640" height="10" fill="${C.mint}"/><path d="M0 ${gy - 6} H640" stroke="${C.green}" stroke-width="3"/>`;
  // 줄기에 달린 잎(4-2 생산자와 같은 꼴): 잎자루 쪽이 (sx, y)
  const sleafD = (sx, y, dir, len) => `M${f(sx)} ${f(y)} Q${f(sx + dir * len * 0.45)} ${f(y - 34)} ${f(sx + dir * len)} ${f(y - 12)} Q${f(sx + dir * len * 0.45)} ${f(y + 12)} ${f(sx)} ${f(y)} Z`;
  const sleaf = (sx, y, dir, len, fill = C.mint, stroke = C.green) => `<path d="${sleafD(sx, y, dir, len)}" fill="${fill}" stroke="${stroke}" stroke-width="3"/>`
    + `<path d="M${f(sx)} ${f(y)} Q${f(sx + dir * len * 0.5)} ${f(y - 14)} ${f(sx + dir * len * 0.92)} ${f(y - 12)}" stroke="${stroke}" stroke-width="2" fill="none"/>`;
  const stem = (sx, y1, y2) => `<path d="M${sx} ${y1} C${sx - 5} ${f(y1 - (y1 - y2) * 0.35)} ${sx + 5} ${f(y1 - (y1 - y2) * 0.7)} ${sx} ${y2}" stroke="${C.green}" stroke-width="6" fill="none" stroke-linecap="round"/>`;
  const roots = (sx, gy) => `<path d="M${sx} ${gy} C${sx - 2} ${gy + 40} ${sx + 6} ${gy + 80} ${sx} ${gy + 128} M${sx} ${gy + 30} Q${sx - 22} ${gy + 60} ${sx - 48} ${gy + 92} M${sx + 1} ${gy + 52} Q${sx + 26} ${gy + 78} ${sx + 46} ${gy + 108} M${sx + 1} ${gy + 92} Q${sx - 12} ${gy + 112} ${sx - 26} ${gy + 138}" stroke="${C.orange}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`;
  // 뿌리 끝의 솜털(맨눈 크기)
  const fuzz = (x, y, ang, n = 5) => {
    let s = '';
    for (let i = 0; i < n; i++) {
      const t = i * 6, bx = x - t * Math.cos(ang), by = y - t * Math.sin(ang);
      [1, -1].forEach((k) => { const a = ang + k * 1.25; s += `<path d="M${f(bx)} ${f(by)} l${f(7 * Math.cos(a))} ${f(7 * Math.sin(a))}" stroke="${C.orange}" stroke-width="1.6" stroke-linecap="round"/>`; });
    }
    return s;
  };

  // ── 큰 잎 하나(잎몸·잎자루·잎맥): 줄기 x=110, 잎자루가 (110,214)→(210,200), 가운데 줄 y=200 ──
  const LF = (() => {
    const bx = 210, cy = 200, tx = 565;
    const up = [[bx, cy], [250, 120], [340, 92], [420, 100]], up2 = [[420, 100], [490, 108], [540, 150], [tx, cy]];
    const mir = (p) => [p[0], 2 * cy - p[1]];
    const bez = (P, t) => [0, 1].map((k) => (1 - t) ** 3 * P[0][k] + 3 * (1 - t) ** 2 * t * P[1][k] + 3 * (1 - t) * t * t * P[2][k] + t ** 3 * P[3][k]);
    const curve = (P) => `C${P.slice(1).map((p) => `${p[0]} ${p[1]}`).join(' ')}`;
    const lo = up2.slice().reverse().map(mir), lo2 = up.slice().reverse().map(mir);
    const blade = `M${bx} ${cy} ${curve(up)} ${curve(up2)} ${curve(lo)} ${curve(lo2)} Z`;
    // 곁 잎맥: 가장자리 점 E 에서 왼쪽 아래 가운데 줄 S 로, 가장자리 못 미쳐 끝난다
    const veins = [];
    [[up, 0.45], [up, 0.72], [up2, 0.18], [up2, 0.45], [up2, 0.7]].forEach(([P, t]) => {
      const E = bez(P, t), S = [E[0] - 58, cy], end = [S[0] + 0.8 * (E[0] - S[0]), cy + 0.8 * (E[1] - cy)];
      veins.push([S, end], [S, [end[0], 2 * cy - end[1]]]);
    });
    return { bx, cy, tx, blade, veins, J: [110, 214] };
  })();
  const petioleD = `M${LF.J[0]} ${LF.J[1]} Q160 203 ${LF.bx + 2} ${LF.cy}`;
  const leafStem = (top = 34) => `<path d="M110 360 L110 ${top}" stroke="${C.green}" stroke-width="10" stroke-linecap="round"/>`
    + sleaf(110, 96, -1, 64);
  const bladeShape = (fill = C.mint, extra = '') => `<path d="${LF.blade}" fill="${fill}" stroke="${C.green}" stroke-width="3.5"${extra}/>`;
  const petiole = (color = C.green) => `<path d="${petioleD}" stroke="${color}" stroke-width="8" fill="none" stroke-linecap="round"/>`;
  const midribD = `M${LF.bx + 2} ${LF.cy} L${LF.tx - 22} ${LF.cy}`;
  const veinLines = (cls = '', w = 2.5, color = C.green, extra = '') => `<path class="${cls}"${extra} d="${midribD}" stroke="${color}" stroke-width="${w + 1.5}" fill="none" stroke-linecap="round"/>`
    + LF.veins.map(([S, E]) => `<path class="${cls}"${extra} d="M${f(S[0])} ${f(S[1])} L${f(E[0])} ${f(E[1])}" stroke="${color}" stroke-width="${w}" fill="none" stroke-linecap="round"/>`).join('');

  // ════ 흡수: 뿌리털이 흙 속 물을 빨아들여 줄기로 올려 보낸다 ════
  (function () {
    const id = 't61-c3b-heupsu';
    let css = base(id);
    const sx = 150, gy = 146;
    let body = soil(gy);
    [[40, 190], [92, 336], [250, 212], [300, 330], [30, 280], [236, 300], [330, 190]].forEach(([x, y]) => { body += `<ellipse cx="${x}" cy="${y}" rx="8" ry="5" fill="${C.line}"/>`; });
    body += roots(sx, gy) + fuzz(sx - 48, gy + 92, Math.atan2(32, -26)) + fuzz(sx + 46, gy + 108, Math.atan2(30, 20)) + fuzz(sx, gy + 128, Math.PI / 2) + fuzz(sx - 26, gy + 138, Math.atan2(26, -14));
    body += stem(sx, gy, 22) + [[124, 1, 84], [98, -1, 76], [70, 1, 68], [46, -1, 50]].map(([y, d, l]) => sleaf(sx, y, d, l)).join('');
    // 크게 보기: 뿌리 끝 → 오른쪽 원(흙 속)
    const M = [sx + 42, gy + 102], Z = [470, 252], R = 100;
    const A = [Z[0] - 82, Z[1] - 82], B = [Z[0] + 50, Z[1] + 50], ux = (B[0] - A[0]) / Math.hypot(B[0] - A[0], B[1] - A[1]), uy = (B[1] - A[1]) / Math.hypot(B[0] - A[0], B[1] - A[1]);
    const nx = uy, ny = -ux; // 뿌리에 수직(오른쪽 위)
    let zin = `<rect x="${Z[0] - R}" y="${Z[1] - R}" width="${2 * R}" height="${2 * R}" fill="${C.peach}"/>`;
    const rnd = seeded(11);
    for (let i = 0; i < 26; i++) {
      const x = Z[0] - R + rnd() * 2 * R, y = Z[1] - R + rnd() * 2 * R;
      if (Math.abs((x - A[0]) * nx + (y - A[1]) * ny) < 48) continue;
      zin += `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(7 + rnd() * 5)}" ry="${f(5 + rnd() * 3)}" fill="${C.line}"/>`;
    }
    const hairs = [];
    for (let t = 0.14; t <= 0.72; t += 0.09) [1, -1].forEach((k, j) => {
      const L = 22 + ((t * 100 + j * 7) % 9), P = [A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t];
      hairs.push({ P, k, L });
    });
    zin += hairs.map(({ P, k, L }) => `<path d="M${f(P[0] + k * 14 * nx)} ${f(P[1] + k * 14 * ny)} q${f(k * L * 0.5 * nx + 3 * ux)} ${f(k * L * 0.5 * ny + 3 * uy)} ${f(k * L * nx)} ${f(k * L * ny)}" stroke="${C.orange}" stroke-width="3" fill="none" stroke-linecap="round"/>`).join('');
    zin += `<path d="M${A[0] - 60 * ux} ${A[1] - 60 * uy} L${B[0]} ${B[1]}" stroke="${C.orange}" stroke-width="34" stroke-linecap="round"/><path d="M${A[0] - 60 * ux} ${A[1] - 60 * uy} L${B[0]} ${B[1]}" stroke="white" stroke-width="28" stroke-linecap="round"/>`;
    // 칸 2: 물방울이 뿌리털 끝으로 빨려 든다
    let w2 = '';
    hairs.forEach(({ P, k, L }, i) => {
      if (i % 2 && i !== 5) return;
      const sx0 = P[0] + k * (L + 40) * nx, sy0 = P[1] + k * (L + 40) * ny;
      w2 += mover('go', drop(sx0, sy0, 6), -k * (L + 30) * nx, -k * (L + 30) * ny, (i * 0.37) % 2);
    });
    // 칸 3: 뿌리 속을 따라 원 밖(줄기 쪽)으로
    let w3 = '';
    [0, 0.7, 1.4].forEach((s) => { w3 += mover('go', drop(B[0] - 30 * ux, B[1] - 30 * uy, 6), -190 * ux, -190 * uy, s); });
    body += `<defs><clipPath id="${id}-z"><circle cx="${Z[0]}" cy="${Z[1]}" r="${R}"/></clipPath></defs>`;
    body += `<circle cx="${M[0]}" cy="${M[1]}" r="20" fill="none" stroke="${C.muted}" stroke-width="3" stroke-dasharray="6 4"/>`;
    body += at(1, 'fin', zoomLines(M, 20, Z, R), 0);
    body += `<g class="b1"><g class="pop pop1"><g clip-path="url(#${id}-z)">${zin}<g class="b2">${w2}</g><g class="b3">${w3}</g></g><circle cx="${Z[0]}" cy="${Z[1]}" r="${R}" fill="none" stroke="${C.muted}" stroke-width="4"/></g></g>`;
    const h4 = hairs.filter((h) => h.k === 1)[3], tip = [h4.P[0] + (14 + h4.L) * nx, h4.P[1] + (14 + h4.L) * ny];
    body += at(1, 'pop', lead(566, 128, tip[0] + 4, tip[1] - 4) + tag(578, 112, '뿌리털', HOT), 0.6);
    body += at(2, 'pop', tag(602, 330, '물', COLD), 0.5);
    // 칸 3: 줄기를 타고 오르는 물
    body += `<g class="b3">${[0, 0.8, 1.6].map((s) => `<g class="up" style="--up:-200px;animation-delay:${s}s">${drop(sx, gy + 90, 6)}</g>`).join('')}</g>`;
    body += ring(Z[0], Z[1], R - 6, 4, C.blue, 0) + ring(sx, 96, 56, 4, C.blue, 0.3);
    body += at(4, 'pop', tag(360, 64, '흡수', COLD, { size: 22 }), 0.5);
    put('6-1/과학/3/흡수', svg(id, body, css));
  })();

  // ════ 광합성: 잎이 빛·물·이산화 탄소로 양분을 만든다 ════
  (function () {
    const id = 't61-c3b-gwanghap';
    let css = base(id);
    let body = `<rect x="0" y="332" width="640" height="28" fill="${C.peach}"/><path d="M0 332 H640" stroke="${C.green}" stroke-width="3"/>`;
    body += leafStem(60) + petiole() + bladeShape() + veinLines();
    body += `<g class="sunG">${sunIcon(598, 46, 22)}</g>`;
    // 칸 1: 햇빛이 잎에 닿는다
    body += at(1, 'fin', flow([[572, 66], [498, 128]], C.orange, { w: 4 }) + flow([[586, 80], [548, 168]], C.orange, { w: 4 }) + flow([[566, 52], [430, 108]], C.orange, { w: 4 }), 0.2);
    body += `<g class="b1"><g class="leafglow">${bladeShape(C.yellow, ' opacity=".5"')}</g></g>`;
    body += at(1, 'pop', tag(478, 36, '햇빛', HOT), 0.6);
    // 칸 2: 물이 줄기→잎자루→잎맥으로, 이산화 탄소가 밖에서 잎으로
    body += `<g class="b2">${[0, 0.9, 1.8].map((s) => `<g class="wpath" style="animation-delay:${s}s">${drop(110, 330, 6)}</g>`).join('')}</g>`;
    body += at(2, 'pop', tag(52, 300, '물', COLD), 0.3);
    const rnd = seeded(5);
    let co = '';
    [[612, 300], [590, 330], [630, 262], [560, 340], [620, 330]].forEach(([x, y], i) => { co += mover('go', gas(x, y), -120 - rnd() * 30, -50 - rnd() * 20, i * 0.45); });
    body += `<g class="b2">${co}</g>`;
    body += at(2, 'pop', tag(522, 338, '이산화 탄소', GAS, { dash: true }), 0.6);
    // 칸 3: 잎에 양분이 생기고 줄기로 빠져나간다
    const spots = [[300, 150], [356, 128], [424, 140], [486, 162], [330, 252], [404, 232], [470, 238], [270, 196], [528, 206], [372, 186]];
    body += spots.map(([x, y], i) => at(3, 'pop', nut(x, y, 6), 0.1 + i * 0.09)).join('');
    body += `<g class="b3">${[1.0, 1.7, 2.4].map((s) => `<g class="npath" style="animation-delay:${s}s">${nut(300, 205, 6)}</g>`).join('')}</g>`;
    body += at(3, 'pop', tag(404, 270, '양분', HOT), 0.9);
    body += ring(388, 200, 150, 4, C.green, 0.1) + at(4, 'pop', tag(320, 48, '광합성', OK, { size: 22 }), 0.4);
    css += `.sc-${id} .leafglow { opacity: 0; } .on1 .sc-${id} .leafglow { animation: ${id}-flash 1.6s ease-in-out .6s both; } .on2 .sc-${id} .leafglow { animation: none; opacity: 0; transition: opacity .6s; }
      .sc-${id} .wpath { animation: ${id}-wpath 2.7s linear infinite; }
      .sc-${id} .npath { animation: ${id}-npath 2.4s linear infinite; }
      @keyframes ${id}-wpath { 0% { opacity: 0; transform: translate(0, 0); } 8% { opacity: 1; } 42% { transform: translate(0, -116px); } 58% { transform: translate(100px, -130px); } 90% { opacity: 1; } 100% { opacity: 0; transform: translate(300px, -130px); } }
      @keyframes ${id}-npath { 0% { opacity: 0; transform: translate(0, 0); } 10% { opacity: 1; } 40% { transform: translate(-90px, -5px); } 58% { transform: translate(-190px, 9px); } 90% { opacity: 1; } 100% { opacity: 0; transform: translate(-190px, 115px); } }`;
    put('6-1/과학/3/광합성', svg(id, body, css));
  })();

  // ════ 아이오딘-아이오딘화 칼륨 용액: 빛을 받은 잎 vs 포일로 가린 잎 ════
  (function () {
    const id = 't61-c3b-iodine';
    let css = base(id);
    const sx = 140;
    let body = '';
    // 화분과 식물
    body += `<path d="M92 318 H188 L176 358 H104 Z" fill="${C.peach}" stroke="${C.orange}" stroke-width="3" stroke-linejoin="round"/>`;
    body += stem(sx, 320, 104) + sleaf(sx, 128, 1, 62);
    const foilLeaf = `<path d="${sleafD(sx, 176, -1, 104)}" fill="${C.line}" stroke="${C.muted}" stroke-width="3"/>`
      + `<path d="M${sx - 88} 164 l10 7 l9 -8 l10 8 l9 -8 l10 7 l9 -7" stroke="white" stroke-width="2.5" fill="none" stroke-linejoin="round"/><path d="M${sx - 70} 178 l11 -6 l10 6 l11 -6 l10 5" stroke="white" stroke-width="2.5" fill="none" stroke-linejoin="round"/>`;
    body += `<g class="h2">${foilLeaf}</g>`;
    body += `<g class="h2">${sleaf(sx, 246, 1, 112)}</g>`;
    body += `<g class="h2">${sunIcon(258, 56, 22)}</g>`;
    body += atH(1, 2, 'fin', flow([[236, 78], [206, 214]], C.orange, { w: 4 }) + flow([[230, 70], [62, 150]], C.orange, { w: 4 }), 0.2);
    body += atH(1, 2, 'pop', lead(100, 116, 92, 152) + tag(100, 98, '알루미늄 포일', GRAY, { size: 18 }), 0.5);
    // 칸 2: 두 잎을 따서 초록색을 빼고 접시에 올린다
    const D = [[378, 238], [548, 238]];
    const dish = ([x, y]) => `<ellipse cx="${x}" cy="${y + 6}" rx="76" ry="30" fill="white" stroke="${C.muted}" stroke-width="3"/><ellipse cx="${x}" cy="${y}" rx="70" ry="25" fill="${C.paper}" stroke="${C.line}" stroke-width="2.5"/>`;
    const dleafD = ([x, y]) => `M${x - 50} ${y + 2} Q${x - 6} ${y - 26} ${x + 50} ${y - 4} Q${x} ${y + 22} ${x - 50} ${y + 2} Z`;
    const dleaf = (p, fill, stroke, op = 1) => `<path d="${dleafD(p)}" fill="${fill}" stroke="${stroke}" stroke-width="2.5" opacity="${op}"/><path d="M${p[0] - 46} ${p[1] + 2} Q${p[0]} ${p[1] - 6} ${p[0] + 44} ${p[1] - 4}" stroke="${C.line}" stroke-width="2" fill="none"/>`;
    body += at(2, 'rise', dish(D[0]) + dleaf(D[0], C.peach, C.orange, 0.75), 0.1) + at(2, 'rise', dish(D[1]) + dleaf(D[1], C.peach, C.orange, 0.75), 0.4);
    body += at(2, 'fin', text(D[0][0], 296, '빛 받은 잎', { size: 18 }), 0.5) + at(2, 'fin', text(D[1][0], 296, '빛 가린 잎', { size: 18 }), 0.8);
    // 칸 3: 스포이트로 갈색 용액을 떨어뜨린다 → 빛 받은 잎만 청람색
    const dropper = (x) => `<rect x="${x - 7}" y="118" width="14" height="66" rx="4" fill="white" stroke="${C.muted}" stroke-width="2.5"/><rect x="${x - 3.5}" y="148" width="7" height="34" rx="2" fill="${C.orange}" opacity=".8"/>`
      + `<path d="M${x - 12} 120 Q${x - 14} 88 ${x} 86 Q${x + 14} 88 ${x + 12} 120 Z" fill="${C.red}" stroke="${C.red}" stroke-width="2"/>`;
    const brown = (x) => `<path d="M${x} 190 Q${x + 5} 197 ${x + 5} 200 A5 5 0 0 1 ${x - 5} 200 Q${x - 5} 197 ${x} 190 Z" fill="${C.orange}"/>`;
    D.forEach(([x], i) => {
      body += `<g class="b3 h4"><g class="drop drop3"${dl(i * 0.2)}>${dropper(x)}</g><g class="fall" style="animation-delay:${0.6 + i * 0.2}s">${brown(x)}</g></g>`;
    });
    body += `<g class="b3"><g class="blue">${dleaf(D[0], C.blue, C.blue)}<path d="${dleafD(D[0])}" fill="${C.purple}" opacity=".6"/><path d="${dleafD(D[0])}" fill="${C.ink}" opacity=".3"/></g></g>`;
    body += `<g class="b3"><g class="brownL"><path d="${dleafD(D[1])}" fill="${C.orange}" opacity=".45"/></g></g>`;
    body += at(3, 'pop', tag(D[0][0], 334, '청람색', [C.sky, C.purple]), 1.6);
    // 칸 4: 녹말과 용액 이름
    body += ring(D[0][0], D[0][1], 56, 4, C.purple, 0.1) + at(4, 'pop', lead(D[0][0], 186, D[0][0] - 4, 222) + tag(D[0][0], 168, '녹말', HOT), 0.4);
    body += at(4, 'pop', tag(456, 56, '아이오딘-아이오딘화 칼륨 용액', HOT), 0.8);
    css += `.sc-${id} .blue, .sc-${id} .brownL { opacity: 0; transition: opacity 1s ease-in-out 1.1s; } .on3 .sc-${id} .blue, .on3 .sc-${id} .brownL { opacity: 1; }
      .sc-${id} .fall { opacity: 0; } .on3 .sc-${id} .fall { animation: ${id}-fall .8s ease-in 3; }
      @keyframes ${id}-fall { 0% { opacity: 1; transform: translateY(0); } 85% { opacity: 1; } 100% { opacity: 0; transform: translateY(40px); } }`;
    put('6-1/과학/3/아이오딘-아이오딘화 칼륨 용액', svg(id, body, css));
  })();

  // ════ 잎몸: 잎에서 넓적하게 펼쳐져 햇빛을 받는 부분 ════
  (function () {
    const id = 't61-c3b-ipmom';
    let css = base(id);
    let body = leafStem(34);
    body += `<g class="leafG"><g class="pt">${petiole()}</g>${bladeShape()}${veinLines()}</g>`;
    // 칸 2: 햇빛이 넓적한 부분에 닿는다
    body += `<g class="b2">${sunIcon(598, 48, 22)}</g>`;
    body += at(2, 'fin', flow([[574, 70], [500, 130]], C.orange, { w: 4 }) + flow([[566, 54], [420, 112]], C.orange, { w: 4 }) + flow([[560, 40], [320, 112]], C.orange, { w: 4 }), 0.2);
    body += `<g class="b2"><g class="leafglow">${bladeShape(C.yellow, ' opacity=".32"')}</g></g>`;
    // 칸 3: 이름
    body += at(3, 'pop', tag(390, 168, '잎몸', OK, { size: 22 }), 0.4);
    body += `<g class="b3"><path class="flash flash3" d="${LF.blade}" fill="none" stroke="${C.yellow}" stroke-width="8" stroke-linejoin="round"/></g>`;
    css += `.sc-${id} .leafG { transform-box: fill-box; transform-origin: 0% 56%; }` + states(id, 'leafG', 'transform', ['scale(.12)', 'scale(1)'], 1.6, 0.1)
      + states(id, 'pt', 'opacity', [1, 1, 1, 0.35], 0.8)
      + `.sc-${id} .leafglow { opacity: 0; } .on2 .sc-${id} .leafglow { animation: ${id}-flash 1.6s ease-in-out .6s both; } .on3 .sc-${id} .leafglow { animation: none; opacity: 0; transition: opacity .6s; }`;
    put('6-1/과학/3/잎몸', svg(id, body, css));
  })();

  // ════ 잎자루: 잎몸을 줄기에 이어 주는 가느다란 꼭지 ════
  (function () {
    const id = 't61-c3b-ipjaru';
    let css = base(id);
    let body = leafStem(34);
    body += `<g class="sway"><g class="bl">${bladeShape()}${veinLines()}</g>${petiole()}<g class="b2"><path class="flash flash2" d="${petioleD}" stroke="${C.yellow}" stroke-width="16" fill="none" stroke-linecap="round" opacity=".8"/></g>${petiole()}</g>`;
    body += atH(1, 3, 'pop', tag(390, 168, '넓적한 부분', OK, { size: 18 }), 0.3);
    // 칸 2: 이어진 두 곳이 반짝이고 잎이 흔들린다
    body += ring(LF.J[0], LF.J[1], 14, 2, C.orange, 0.2) + ring(LF.bx, LF.cy, 14, 2, C.orange, 0.5);
    body += atH(2, 3, 'pop', lead(158, 222, 160, 260) + tag(160, 276, '가느다란 꼭지', HOT, { size: 18 }), 0.8);
    // 칸 3: 이름
    body += `<g class="b3"><g class="pop pop3" style="animation-delay:.3s">${lead(160, 222, 160, 260)}${tag(160, 280, '잎자루', OK, { size: 22 })}</g></g>`;
    css += `.sc-${id} .sway { transform-box: fill-box; transform-origin: 0% 54%; } .on2 .sc-${id} .sway { animation: ${id}-sway 1.8s ease-in-out .6s infinite alternate; }
      @keyframes ${id}-sway { from { transform: rotate(-3deg); } to { transform: rotate(3deg); } }
`
      + states(id, 'bl', 'opacity', [1, 1, 1, 0.35], 0.8);
    put('6-1/과학/3/잎자루', svg(id, body, css));
  })();

  // ════ 잎맥: 잎몸에 뻗은 줄, 물과 양분이 지나는 길 ════
  (function () {
    const id = 't61-c3b-ipmaek';
    let css = base(id);
    let body = leafStem(34) + petiole() + bladeShape();
    // 칸 1: 가운데 줄 → 곁줄이 차례로 그려진다
    body += `<path class="draw draw1" pathLength="1" d="${midribD}" stroke="${C.green}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
    LF.veins.forEach(([S, E], i) => {
      body += `<path class="draw draw1" pathLength="1" style="transition-delay:${f(0.7 + Math.floor(i / 2) * 0.18)}s" d="M${f(S[0])} ${f(S[1])} L${f(E[0])} ${f(E[1])}" stroke="${C.green}" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;
    });
    // 칸 2: 물방울이 잎자루→가운데 줄→곁줄로
    let w = '';
    w += [0, 1.1].map((s) => mover('go', drop(120, 212, 6), 330, -12, s)).join('');
    LF.veins.forEach(([S, E], i) => { w += mover('go', drop(S[0], S[1] + 2, 5.5), E[0] - S[0], E[1] - S[1], 0.3 + (i % 5) * 0.35); });
    body += `<g class="b2 h3">${w}</g>`;
    body += atH(2, 3, 'pop', tag(54, 300, '물', COLD), 0.4);
    // 칸 3: 양분이 곁줄→가운데 줄→잎자루로 빠져나간다
    let n = '';
    LF.veins.forEach(([S, E], i) => { if (i % 2 === 0) n += mover('go', nut(E[0], E[1], 5.5), S[0] - E[0], S[1] - E[1], (i % 5) * 0.4); });
    n += [0.2, 1.3].map((s) => mover('go', nut(470, 200, 6), -350, 14, s)).join('');
    body += `<g class="b3">${n}</g>`;
    body += at(3, 'pop', tag(54, 300, '양분', HOT), 0.4);
    // 칸 4: 잎맥이 반짝이고 이름
    body += `<g class="b4"><g class="glow">${veinLines('', 7, C.yellow)}</g></g>${shown(4, veinLines('', 2.5, C.green))}`;
    css += `.sc-${id} .glow { opacity: 0; } .on4 .sc-${id} .glow { animation: ${id}-glow 2.4s ease-in-out .2s infinite; }
      @keyframes ${id}-glow { 0%, 100% { opacity: 0; } 50% { opacity: .9; } }`;
    body += at(4, 'pop', lead(458, 316, 444, 282) + tag(470, 332, '잎맥', OK, { size: 22 }), 0.5);
    put('6-1/과학/3/잎맥', svg(id, body, css));
  })();

  // ── 잎 겉을 크게 본 모습: 세포 그물 + 입술 모양 구멍 ──
  const stoma = (x, y, rot = 0, s = 1) => `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">`
    + `<ellipse cx="0" cy="0" rx="22" ry="29" fill="${C.mint}"/>`
    + `<path d="M0 -24 C-24 -24 -24 24 0 24 C-8 12 -8 -12 0 -24 Z" fill="${C.green}" fill-opacity=".45" stroke="${C.green}" stroke-width="2.5" stroke-linejoin="round"/>`
    + `<path d="M0 -24 C24 -24 24 24 0 24 C8 12 8 -12 0 -24 Z" fill="${C.green}" fill-opacity=".45" stroke="${C.green}" stroke-width="2.5" stroke-linejoin="round"/>`
    + `<path d="M0 -15 C-5 -6 -5 6 0 15 C5 6 5 -6 0 -15 Z" fill="${C.ink}"/></g>`;
  const cellMesh = (cx, cy, R, seed) => {
    const rnd = seeded(seed), step = 46, pts = [];
    for (let i = -5; i <= 5; i++) { pts[i + 5] = []; for (let j = -5; j <= 5; j++) pts[i + 5][j + 5] = [cx + j * step + (rnd() - 0.5) * 22, cy + i * step * 0.8 + (rnd() - 0.5) * 18]; }
    let s = '';
    for (let i = 0; i < 11; i++) for (let j = 0; j < 10; j++) { const [a, b] = [pts[i][j], pts[i][j + 1]]; s += `M${f(a[0])} ${f(a[1])} Q${f((a[0] + b[0]) / 2 + (rnd() - 0.5) * 14)} ${f((a[1] + b[1]) / 2 + (rnd() - 0.5) * 14)} ${f(b[0])} ${f(b[1])} `; }
    for (let i = 0; i < 10; i++) for (let j = 0; j < 11; j++) { if ((i + j) % 2) continue; const [a, b] = [pts[i][j], pts[i + 1][j]]; s += `M${f(a[0])} ${f(a[1])} Q${f((a[0] + b[0]) / 2 + (rnd() - 0.5) * 14)} ${f((a[1] + b[1]) / 2)} ${f(b[0])} ${f(b[1])} `; }
    for (let i = 0; i < 10; i++) for (let j = 0; j < 11; j++) { if (!((i + j) % 2)) continue; const [a, b] = [pts[i][j], pts[i + 1][j]]; s += `M${f(a[0])} ${f(a[1])} L${f(b[0])} ${f(b[1])} `; }
    return `<rect x="${cx - R}" y="${cy - R}" width="${2 * R}" height="${2 * R}" fill="${C.mint}"/><path d="${s}" stroke="${C.green}" stroke-opacity=".45" stroke-width="2.5" fill="none"/>`;
  };

  // ════ 기공: 잎의 겉에 있는 아주 작은 구멍 ════
  (function () {
    const id = 't61-c3b-gigong';
    let css = base(id);
    // 왼쪽 잎 하나
    let body = `<path d="M24 210 Q60 205 86 202" stroke="${C.green}" stroke-width="7" fill="none" stroke-linecap="round"/>`
      + `<path d="M84 202 C110 140 190 120 250 150 C276 164 290 182 296 196 C284 218 260 250 200 258 C140 264 100 240 84 202 Z" fill="${C.mint}" stroke="${C.green}" stroke-width="3.5"/>`
      + `<path d="M86 202 Q190 190 290 196 M150 196 L182 156 M150 197 L178 240 M210 194 L240 156 M212 195 L238 240" stroke="${C.green}" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;
    const M = [196, 214], Z = [452, 186], R = 136;
    body += `<circle cx="${M[0]}" cy="${M[1]}" r="16" fill="none" stroke="${C.muted}" stroke-width="3" stroke-dasharray="6 4"/>`;
    const S = [[402, 112, -18], [512, 120, 22], [366, 214, 8], [470, 206, -30], [548, 232, 14], [430, 292, 40]];
    let zin = cellMesh(Z[0], Z[1], R, 21) + S.map(([x, y, r]) => stoma(x, y, r)).join('');
    let vap = '';
    S.forEach(([x, y], i) => { [0, 1.2].forEach((d) => { vap += `<g class="up" style="--up:-62px;animation-delay:${f(i * 0.33 + d)}s">${gas(x, y - 12, C.blue, 9)}</g>`; }); });
    body += `<defs><clipPath id="${id}-z"><circle cx="${Z[0]}" cy="${Z[1]}" r="${R}"/></clipPath></defs>`;
    body += at(1, 'fin', zoomLines(M, 16, Z, R), 0);
    let rings = S.map(([x, y], i) => ring(x, y, 26, 2, C.orange, 0.15 * i)).join('');
    body += `<g class="b1"><g class="pop pop1"><g clip-path="url(#${id}-z)">${zin}${rings}<g class="b3">${vap}</g></g><circle cx="${Z[0]}" cy="${Z[1]}" r="${R}" fill="none" stroke="${C.muted}" stroke-width="4"/></g></g>`;
    body += atH(1, 4, 'pop', tag(150, 300, '잎의 겉', GRAY, { size: 18 }), 0.6);
    body += at(3, 'pop', tag(560, 30, '수증기', COLD, { size: 18, dash: true }), 0.8);
    // 칸 4: 이름
    body += at(4, 'pop', lead(334, 330, 410, 304) + tag(298, 334, '기공', OK, { size: 22 }), 0.4);
    body += S.map(([x, y], i) => ring(x, y, 24, 4, C.green, 0.1 * i)).join('').replace(/class="b4"/g, 'class="b4" clip-path="url(#' + id + '-z)"');
    put('6-1/과학/3/기공', svg(id, body, css));
  })();

  // ════ 증산 작용: 잎까지 올라온 물이 수증기가 되어 기공으로 나간다 ════
  (function () {
    const id = 't61-c3b-jeungsan';
    let css = base(id);
    const sx = 150, gy = 322;
    let body = soil(gy) + `<path d="M${sx} ${gy} L${sx - 4} ${gy + 30} M${sx} ${gy + 6} L${sx - 26} ${gy + 30} M${sx} ${gy + 8} L${sx + 24} ${gy + 32}" stroke="${C.orange}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`;
    const LV = [[262, 1, 122], [218, -1, 100], [166, 1, 118], [120, -1, 86], [86, 1, 60]];
    body += stem(sx, gy, 60) + LV.map(([y, d, l]) => sleaf(sx, y, d, l)).join('');
    // 칸 1: 뿌리에서 줄기를 거쳐 잎까지
    body += `<g class="b1">${[0, 0.8, 1.6].map((s) => `<g class="up" style="--up:-210px;animation-delay:${s}s">${drop(sx, gy + 4, 6)}</g>`).join('')}</g>`;
    body += at(1, 'pop', tag(84, 340, '물', COLD), 0.4);
    // 칸 2: 잎을 크게 보면 기공으로 수증기가 나간다
    const M = [216, 150], Z = [470, 128], R = 90;
    let zin = cellMesh(Z[0], Z[1], R, 9) + stoma(Z[0], Z[1] + 12, 0, 1.3);
    zin += [0, 0.8, 1.6].map((s) => `<g class="up" style="--up:-70px;animation-delay:${s}s">${gas(Z[0], Z[1] - 6, C.blue, 8)}</g>`).join('');
    zin += [0.4, 1.2].map((s) => mover('go', drop(Z[0], Z[1] + 86, 6), 0, -60, s)).join('');
    body += `<defs><clipPath id="${id}-z"><circle cx="${Z[0]}" cy="${Z[1]}" r="${R}"/></clipPath></defs>`;
    body += `<g class="b2 h3"><circle cx="${M[0]}" cy="${M[1]}" r="14" fill="none" stroke="${C.muted}" stroke-width="3" stroke-dasharray="6 4"/><g class="fin fin2">${zoomLines(M, 14, Z, R)}</g>`
      + `<g class="pop pop2"><g clip-path="url(#${id}-z)">${zin}</g><circle cx="${Z[0]}" cy="${Z[1]}" r="${R}" fill="none" stroke="${C.muted}" stroke-width="4"/></g>`
      + `<g class="pop pop2" style="animation-delay:.6s">${tag(470, 246, '기공')}</g><g class="pop pop2" style="animation-delay:.9s">${tag(594, 58, '수증기', COLD, { size: 18, dash: true })}</g></g>`;
    // 칸 3: 지퍼 백 실험(잎 뒷면에 푸른색 염화 코발트 종이)
    const bag = `M176 214 L302 200 Q312 200 312 210 L314 284 Q314 294 304 294 L184 302 Q176 302 176 294 Z`;
    body += `<g class="b3"><g class="fin fin3"><path d="${bag}" fill="${C.sky}" fill-opacity=".35" stroke="${C.blue}" stroke-width="2.5"/><path d="M178 212 L178 302" stroke="${C.blue}" stroke-width="6" stroke-linecap="round"/></g></g>`;
    body += `<g class="b3"><g transform="rotate(-6 236 250)"><rect x="224" y="243" width="26" height="13" rx="2" fill="${C.blue}"/><rect class="redp" x="224" y="243" width="26" height="13" rx="2" fill="${C.red}"/></g></g>`;
    [[192, 226], [236, 214], [284, 210], [300, 244], [298, 276], [252, 288], [204, 286]].forEach(([x, y], i) => { body += at(3, 'pop', `<circle cx="${x}" cy="${y}" r="4.5" fill="${C.sky}" stroke="${C.blue}" stroke-width="2"/>`, 1.0 + i * 0.12); });
    body += at(3, 'pop', lead(342, 230, 314, 236) + tag(388, 230, '지퍼 백', COLD), 0.4);
    body += at(3, 'pop', lead(346, 296, 252, 254) + tag(430, 300, '염화 코발트 종이', GRAY, { size: 18 }), 0.7);
    // 칸 4: 잎마다 수증기가 나가고 이름
    let v = '';
    [[sx + 70, 144], [sx - 62, 198], [sx + 100, 150], [sx - 48, 104], [sx + 36, 72], [sx - 84, 204]].forEach(([x, y], i) => { [0, 1.2].forEach((d) => { v += `<g class="up" style="--up:-52px;animation-delay:${f(i * 0.3 + d)}s">${gas(x, y, C.blue, 9)}</g>`; }); });
    body += `<g class="b4">${v}</g>`;
    body += at(4, 'pop', tag(470, 110, '증산 작용', COLD, { size: 22 }), 0.5);
    css += `.sc-${id} .redp { opacity: 0; transition: opacity 1.2s ease-in-out 1.2s; } .on3 .sc-${id} .redp { opacity: 1; }`;
    put('6-1/과학/3/증산 작용', svg(id, body, css));
  })();

  // ── 꽃 단면(옆에서 본 모습): (cx, by) 는 꽃받기 윗면 가운데, s 는 배율 ──
  const flower = (cx, by, s) => {
    const P = (x, y) => `${f(cx + x * s)} ${f(by + y * s)}`;
    const X = (x) => f(cx + x * s), Y = (y) => f(by + y * s);
    const stemD = `<path d="M${P(0, 8)} L${cx} 360" stroke="${C.green}" stroke-width="${f(8 * s)}" stroke-linecap="round"/>`;
    const sepalD = (k) => `M${P(k * 14, 4)} Q${P(k * 56, 6)} ${P(k * 66, -36)} Q${P(k * 40, -20)} ${P(k * 18, -4)} Z`;
    const sepals = `<ellipse cx="${cx}" cy="${Y(6)}" rx="${f(24 * s)}" ry="${f(11 * s)}" fill="${C.green}"/>` + [-1, 1].map((k) => `<path d="${sepalD(k)}" fill="${C.green}" stroke="${C.green}" stroke-width="2.5" stroke-linejoin="round"/>`).join('');
    const backPetal = `<path d="M${P(-12, -4)} C${P(-56, -60)} ${P(-44, -152)} ${P(0, -162)} C${P(44, -152)} ${P(56, -60)} ${P(12, -4)} Z" fill="${C.lilac}" stroke="${C.purple}" stroke-width="2.5"/>`;
    const petal = (k) => `<path d="M${P(k * 14, -2)} C${P(k * 40, -30)} ${P(k * 130, -60)} ${P(k * 128, -120)} C${P(k * 90, -132)} ${P(k * 40, -82)} ${P(k * 6, -12)} Z" fill="${C.lilac}" stroke="${C.purple}" stroke-width="2.5" stroke-linejoin="round"/>`;
    const frontPetals = petal(-1) + petal(1);
    const ST = [[-10, -4, -62, -106], [-5, -6, -32, -120], [5, -6, 32, -120], [10, -4, 62, -106]];
    const anthers = ST.map(([, , tx, ty]) => [X(tx), Y(ty)]);
    const stamens = ST.map(([bx, byy, tx, ty]) => `<path d="M${P(bx, byy)} Q${P(tx * 0.6, -50)} ${P(tx, ty)}" stroke="${C.orange}" stroke-width="${f(3 * s)}" fill="none" stroke-linecap="round"/>`
      + `<ellipse cx="${X(tx)}" cy="${Y(ty)}" rx="${f(9 * s)}" ry="${f(5.5 * s)}" fill="${C.yellow}" stroke="${C.orange}" stroke-width="2" transform="rotate(${f(Math.atan2(ty - byy, tx - bx) * 180 / Math.PI + 90)} ${X(tx)} ${Y(ty)})"/>`).join('');
    const pistil = `<path d="M${P(-4.5, -36)} L${P(-4.5, -128)} L${P(4.5, -128)} L${P(4.5, -36)} Z" fill="${C.mint}" stroke="${C.green}" stroke-width="2.5" stroke-linejoin="round"/>`
      + `<ellipse cx="${cx}" cy="${Y(-22)}" rx="${f(18 * s)}" ry="${f(22 * s)}" fill="${C.mint}" stroke="${C.green}" stroke-width="2.5"/>`
      + `<ellipse cx="${cx}" cy="${Y(-131)}" rx="${f(14 * s)}" ry="${f(6.5 * s)}" fill="${C.mint}" stroke="${C.green}" stroke-width="2.5"/>`;
    return { stemD, sepalD, sepals, backPetal, frontPetals, stamens, pistil, anthers, stigma: [cx, Y(-131)], ovary: [cx, Y(-22)], X, Y, P };
  };

  // 꽃의 네 부분(암술·수술·꽃잎·꽃받침) 장면: 칸 1 은 네 부분과 이름, 칸 2 부터 target 만 또렷하게
  const flowerScene = (id, target, dimVals) => {
    const F = flower(320, 250, 1.15);
    const part = (name, inner) => `<g class="${name === target ? 'tg' : 'dm'} p-${name}">${inner}</g>`;
    let body = F.stemD;
    body += `<g class="pl">${part('꽃잎', F.backPetal)}</g>`;
    body += part('수술', F.stamens) + part('암술', F.pistil);
    body += `<g class="pl">${part('꽃잎', F.frontPetals)}</g>`;
    body += part('꽃받침', F.sepals);
    const T = {
      '암술': [478, 46, F.stigma[0] + 14, F.stigma[1] - 2], '수술': [104, 70, F.anthers[0][0] - 8, F.anthers[0][1] - 4],
      '꽃잎': [548, 168, 452, 150], '꽃받침': [130, 300, F.X(-46), F.Y(-6)]
    };
    let tags = '';
    Object.entries(T).forEach(([name, [tx, ty, px, py]], i) => {
      const w = tw(name, 20) + 26, ex = px > tx ? tx + w / 2 : tx - w / 2;
      tags += `<g class="b1"><g class="pop pop1" style="animation-delay:${f(0.3 + i * 0.25)}s"><g class="${name === target ? 'tgT' : 'dmT'}">${lead(ex, ty, px, py)}${tag(tx, ty, name, name === target ? HOT : OK)}</g></g></g>`;
    });
    body += tags;
    const [tx, ty] = T[target], w = tw(target, 20) + 26;
    body += glowRect(tx - w / 2 - 6, ty - 23, w + 12, 46, 4, C.orange, 0.3, 23);
    let css = base(`${id}`) + states(id, 'dm', 'opacity', dimVals, 0.8) + states(id, 'dmT', 'opacity', dimVals, 0.8)
      + `.sc-${id} .tgT { transform-box: fill-box; transform-origin: center; } .on2 .sc-${id} .tgT { animation: ${id}-pulse .7s ease-in-out .3s 2; }`;
    return { F, body, css };
  };

  // ════ 암술: 꽃 한가운데, 꽃가루를 받고 아랫부분에서 씨가 생긴다 ════
  (function () {
    const id = 't61-c3b-amsul';
    let { F, body, css } = flowerScene(id, '암술', [1, 1, 0.3, 0.3, 0.3]);
    css += `.on3 .sc-${id} .p-수술 { opacity: 1; }`;
    // 칸 2: 암술이 반짝인다
    body += `<g class="b2"><g class="flash flash2"><path d="M${F.P(-4.5, -36)} L${F.P(-4.5, -128)} L${F.P(4.5, -128)} L${F.P(4.5, -36)} Z" fill="none" stroke="${C.yellow}" stroke-width="7" stroke-linejoin="round"/><ellipse cx="${F.ovary[0]}" cy="${F.ovary[1]}" rx="${f(18 * 1.15 + 3)}" ry="${f(22 * 1.15 + 3)}" fill="none" stroke="${C.yellow}" stroke-width="6"/></g></g>`;
    // 칸 3: 수술의 꽃가루가 암술 끝으로 → 아랫부분에 씨
    let pg = '';
    F.anthers.forEach(([x, y], i) => { pg += mover('go', pollen(x, y), F.stigma[0] - x + (i - 1.5) * 4, F.stigma[1] - y - 4, i * 0.3); });
    body += `<g class="b3">${pg}</g>`;
    body += [[-6, -1], [0, -2], [6, -1]].map(([dx, dy], i) => at(3, 'pop', pollen(F.stigma[0] + dx * 1.6, F.stigma[1] + dy * 3 - 6, 4), 0.8 + i * 0.2)).join('');
    body += [[-5, -34], [5, -27], [-5, -20], [5, -13]].map(([dx, dy], i) => at(3, 'pop', `<ellipse cx="${F.X(dx)}" cy="${F.Y(dy)}" rx="4" ry="5" fill="white" stroke="${C.green}" stroke-width="2"/>`, 1.4 + i * 0.15)).join('');
    body += at(3, 'pop', lead(410, 226, F.ovary[0] + 24, F.ovary[1]) + tag(432, 226, '씨'), 1.9);
    body += ring(F.stigma[0], (F.stigma[1] + F.ovary[1]) / 2, 70, 4, C.orange, 0.1);
    put('6-1/과학/3/암술', svg(id, body, css));
  })();

  // ════ 수술: 꽃가루를 만드는 부분, 암술 둘레에 여러 개 ════
  (function () {
    const id = 't61-c3b-susul';
    let { F, body, css } = flowerScene(id, '수술', [1, 1, 0.3, 0.3, 0.3]);
    // 칸 2: 수술 끝이 하나씩 반짝인다
    body += F.anthers.map(([x, y], i) => ring(x, y, 12, 2, C.orange, 0.2 * i)).join('');
    // 칸 3: 수술 끝에서 꽃가루가 흩어져 나온다
    let pg = '';
    F.anthers.forEach(([x, y], i) => {
      [[-1, -1.2], [1, -1.4], [0.2, -1.8]].forEach(([kx, ky], j) => { pg += mover('go', pollen(x, y, 4), kx * 22 + (x - 320) * 0.25, ky * 18, (i * 0.25 + j * 0.6) % 1.8); });
    });
    body += `<g class="b3">${pg}</g>`;
    body += F.anthers.map(([x, y], i) => at(3, 'pop', pollen(x + (i < 2 ? -6 : 6), y - 7, 4) + pollen(x + (i < 2 ? 3 : -3), y - 9, 3.5), 0.4 + i * 0.15)).join('');
    body += at(3, 'pop', tag(560, 250, '꽃가루', [C.peach, C.orange]), 1.0) + at(3, 'fin', lead(520, 246, F.anthers[3][0] + 12, F.anthers[3][1] + 4), 1.0);
    body += F.anthers.map(([x, y], i) => ring(x, y, 14, 4, C.orange, 0.12 * i)).join('');
    put('6-1/과학/3/수술', svg(id, body, css));
  })();

  // ════ 꽃받침: 꽃잎을 아래에서 감싸 받치는 초록색 부분 ════
  (function () {
    const id = 't61-c3b-kkotbatchim';
    let { F, body, css } = flowerScene(id, '꽃받침', [1, 1, 0.3, 0.3, 0.3]);
    css += `.on3 .sc-${id} .p-꽃잎 { opacity: 1; }`;
    // 칸 2: 꽃받침이 반짝인다
    body += `<g class="b2"><g class="flash flash2">${[-1, 1].map((k) => `<path d="${F.sepalD(k)}" fill="none" stroke="${C.yellow}" stroke-width="6" stroke-linejoin="round"/>`).join('')}</g></g>`;
    body += ring(F.X(-44), F.Y(-10), 28, 2, C.orange, 0.2) + ring(F.X(44), F.Y(-10), 28, 2, C.orange, 0.4);
    // 칸 3: 꽃잎이 들렸다가 꽃받침 위에 내려앉고, 아래에서 받치는 화살표
    body += at(3, 'fin', solid(F.X(-50), 344, F.X(-40), F.Y(14), C.orange, 4) + solid(F.X(50), 344, F.X(40), F.Y(14), C.orange, 4), 1.0);
    css += `.sc-${id} .pl { transform-box: view-box; } .on3 .sc-${id} .pl { animation: ${id}-lift 1.4s ease-in-out .2s both; }
      @keyframes ${id}-lift { 0% { transform: translateY(0); } 35% { transform: translateY(-22px); } 75% { transform: translateY(2px); } 100% { transform: translateY(0); } }`;
    body += ring(F.X(0), F.Y(-10), 76, 4, C.orange, 0.1);
    put('6-1/과학/3/꽃받침', svg(id, body, css));
  })();

  // ── 벌: (x, y) 몸 가운데, 왼쪽을 본다 ──
  const bee = (x, y) => `<g class="wing"><ellipse cx="${x + 2}" cy="${y - 17}" rx="9" ry="15" fill="white" fill-opacity=".9" stroke="${C.blue}" stroke-width="2" transform="rotate(-22 ${x + 2} ${y - 17})"/><ellipse cx="${x + 13}" cy="${y - 15}" rx="8" ry="13" fill="white" fill-opacity=".9" stroke="${C.blue}" stroke-width="2" transform="rotate(20 ${x + 13} ${y - 15})"/></g>`
    + `<path d="M${x - 8} ${y + 12} l-3 8 M${x + 2} ${y + 13} l0 8 M${x + 12} ${y + 12} l3 8" stroke="${C.ink}" stroke-width="2.2" stroke-linecap="round"/>`
    + `<ellipse cx="${x}" cy="${y}" rx="22" ry="14" fill="${C.yellow}" stroke="${C.ink}" stroke-width="2.5"/>`
    + `<path d="M${x - 3} ${y - 13} Q${x + 1} ${y} ${x - 3} ${y + 13} M${x + 9} ${y - 11} Q${x + 13} ${y} ${x + 9} ${y + 11}" stroke="${C.ink}" stroke-width="4" fill="none"/>`
    + `<circle cx="${x - 24}" cy="${y - 2}" r="10" fill="${C.ink}"/><circle cx="${x - 27}" cy="${y - 5}" r="2.6" fill="white"/>`
    + `<path d="M${x - 27} ${y - 10} Q${x - 32} ${y - 22} ${x - 38} ${y - 22} M${x - 22} ${y - 11} Q${x - 22} ${y - 24} ${x - 16} ${y - 27}" stroke="${C.ink}" stroke-width="2" fill="none" stroke-linecap="round"/>`;

  // ════ 꽃가루받이: 수술의 꽃가루가 암술로 옮겨진다(벌·바람) ════
  (function () {
    const id = 't61-c3b-kkotgarubati';
    let css = base(id);
    const F1 = flower(170, 272, 0.8), F2 = flower(470, 272, 0.8);
    const draw = (F) => F.stemD + F.backPetal + F.stamens + F.pistil + F.frontPetals + F.sepals;
    let body = draw(F1) + draw(F2);
    // 수술 끝마다 꽃가루
    const dust = (F) => F.anthers.map(([x, y]) => pollen(x - 4, y - 5, 3.5) + pollen(x + 4, y - 6, 3.5)).join('');
    body += `<g class="h2">${dust(F1)}</g>` + dust(F2);
    body += atH(1, 3, 'pop', lead(56, 236, F1.anthers[0][0] - 6, F1.anthers[0][1] + 4) + tag(48, 254, '수술'), 0.3);
    // 벌: 칸 1 에 왼쪽 꽃으로 날아와 앉고, 칸 2 에 오른쪽 꽃으로 옮겨 간다
    const bx = 140, by = 132;
    const onBee = [[-10, 14], [2, 15], [13, 13], [-4, 11]].map(([dx, dy], i) => `<g class="b1"><g class="pop pop1" style="animation-delay:${f(1.4 + i * 0.12)}s">${pollen(bx + dx, by + dy, 4)}</g></g>`).join('');
    body += `<g class="b1 h3"><g class="beeMove"><g class="beeBob">${bee(bx, by)}${onBee}</g></g></g>`;
    body += atH(1, 2, 'pop', lead(178, 80, bx + 6, by + 18) + tag(210, 66, '꽃가루', [C.peach, C.orange]), 1.7);
    // 칸 2: 오른쪽 꽃 암술에 꽃가루가 붙는다
    const sg = (F, n, s0) => [[-7, -4], [0, -6], [7, -4]].map(([dx, dy], i) => at(n, 'pop', pollen(F.stigma[0] + dx, F.stigma[1] + dy, 3.8), s0 + i * 0.15)).join('');
    body += sg(F2, 2, 1.7) + ring(F2.stigma[0], F2.stigma[1], 16, 2, C.orange, 1.9);
    body += at(2, 'pop', lead(556, 236, F2.stigma[0] + 12, F2.stigma[1] + 4) + tag(590, 254, '암술'), 1.2);
    // 칸 3: 바람이 왼쪽 꽃가루를 오른쪽 꽃으로 날린다
    const wind = (x, y, len) => `<path class="mar" d="M${x} ${y} q${len / 6} -10 ${len / 3} 0 t${len / 3} 0 t${len / 3} 0" stroke="${C.blue}" stroke-width="3.5" stroke-dasharray="14 10" fill="none" stroke-linecap="round"/>`;
    body += at(3, 'fin', wind(20, 112, 120) + wind(36, 146, 96), 0) + at(3, 'pop', tag(80, 74, '바람', COLD), 0.3);
    body += `<g class="b3">${F1.anthers.map(([x, y], i) => `<g class="blow" style="--dx:${f(F2.stigma[0] - x)}px;--mx:${f((F2.stigma[0] - x) / 2)}px;--dy:${f(F2.stigma[1] - y - 6)}px;animation-delay:${f(i * 0.45)}s">${pollen(x, y - 6, 4)}</g>`).join('')}</g>`;
    // 칸 4: 이름
    body += ring(F2.stigma[0], F2.stigma[1], 22, 4, C.orange, 0.1) + ring(F1.anthers[1][0], F1.anthers[1][1], 22, 4, C.orange, 0.4);
    body += at(4, 'pop', tag(320, 44, '꽃가루받이', HOT, { size: 22 }), 0.5);
    css += `.sc-${id} .beeMove { transform: translate(-260px, -150px); }
      .on1 .sc-${id} .beeMove { animation: ${id}-enter 1.3s ease-out .1s both; }
      .on2 .sc-${id} .beeMove { animation: ${id}-fly 1.6s ease-in-out .1s both; }
      @keyframes ${id}-enter { 0% { transform: translate(-260px, -150px); } 60% { transform: translate(-30px, -40px); } 100% { transform: translate(0, 0); } }
      @keyframes ${id}-fly { 0% { transform: translate(0, 0); } 50% { transform: translate(150px, -80px); } 100% { transform: translate(300px, 0); } }
      .sc-${id} .beeBob { animation: ${id}-bob .5s ease-in-out infinite alternate; }
      @keyframes ${id}-bob { from { transform: translateY(-2px); } to { transform: translateY(2px); } }
      .sc-${id} .wing { transform-box: fill-box; transform-origin: 50% 100%; animation: ${id}-flap .14s linear infinite alternate; }
      @keyframes ${id}-flap { from { transform: scaleY(1); } to { transform: scaleY(.55); } }
      .sc-${id} .blow { animation: ${id}-blow 2.4s ease-in-out infinite; }
      @keyframes ${id}-blow { 0% { opacity: 0; transform: translate(0, 0); } 12% { opacity: 1; } 50% { transform: translate(var(--mx), -70px); } 88% { opacity: 1; } 100% { opacity: 0; transform: translate(var(--dx), var(--dy)); } }`;
    put('6-1/과학/3/꽃가루받이', svg(id, body, css));
  })();
})(typeof window !== 'undefined' ? window : globalThis);
