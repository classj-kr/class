// 과학 중2-1(8-1) Ⅲ단원 「빛과 파동」 낱말 도식: 빛은 주황 줄(화살 머리로 방향), 법선은 회색 점선, 각은 호로 잰다.
// 볼록·오목 거울의 빛은 둥근 거울 면에서 반사 법칙으로 직접 셈해 그린다. 파동은 사인 곡선을 옆으로 미는 것(transform)으로 움직인다.
(function (root) {
  'use strict';
  const { C, svg, text, put } = root.FigureKit;
  const f = (n) => +(+n).toFixed(1);
  const dl = (s) => (s ? ` style="animation-delay:${s}s"` : '');
  const g = (cls, inner, s = 0) => `<g class="${cls}"${dl(s)}>${inner}</g>`;
  // 칸 n 에 나타나며 kind(pop·fin·rise·drop) 움직임을 한 번 한다. hide 칸부터 사라진다
  const at = (n, kind, inner, s = 0, hide) => `<g class="b${n}${hide ? ' h' + hide : ''}">${g(`${kind} ${kind}${n}`, inner, s)}</g>`;
  const shown = (n, inner, hide) => `<g class="b${n}${hide ? ' h' + hide : ''}">${inner}</g>`;
  const tw = (s, size) => [...String(s)].reduce((a, c) => a + (/[가-힣]/.test(c) ? 1 : c === ' ' ? 0.34 : /[+−=×÷]/.test(c) ? 0.78 : 0.62), 0) * size;
  const OK = [C.mint, C.green], GRAY = ['white', C.muted], LIL = [C.lilac, C.purple], KEY = [C.peach, C.red], COLD = [C.sky, C.blue];
  const tag = (cx, cy, label, [fill, stroke] = OK, { size = 20 } = {}) => {
    const w = Math.round(tw(label, size) + size * 1.3), h = Math.round(size * 1.7);
    return `<g><rect x="${f(cx - w / 2)}" y="${f(cy - h / 2)}" width="${w}" height="${h}" rx="${h / 2}" fill="${fill}" stroke="${stroke}" stroke-width="2.5"/>${text(f(cx), f(cy + size * 0.36), label, { size })}</g>`;
  };
  const lead = (x1, y1, x2, y2, color = C.muted) => `<path d="M${f(x1)} ${f(y1)} L${f(x2)} ${f(y2)}" stroke="${color}" stroke-width="2.5" stroke-linecap="round"/>`;
  const ring = (cx, cy, r, n, color = C.green, s = 0) => `<g class="b${n}"><circle class="ring ring${n}"${dl(s)} cx="${f(cx)}" cy="${f(cy)}" r="${r}" fill="none" stroke="${color}" stroke-width="4"/></g>`;
  const glowRect = (x, y, w, h, n, color = C.green, s = 0, rx = 14) => `<g class="b${n}"><rect class="flash flash${n}"${dl(s)} x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="${rx}" fill="none" stroke="${color}" stroke-width="5"/></g>`;
  const drawPath = (d, n, color, w = 4, s = 0, hide) => `<g class="b${n}${hide ? ' h' + hide : ''}"><path class="draw draw${n}"${dl(s)} pathLength="1" d="${d}" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" fill="none"/></g>`;
  const steps = (id, cls, vals, sec = 1.2, delay = 0.2) => `.sc-${id} .${cls} { transform: ${vals[0]}; transition: transform ${sec}s ease-in-out ${delay}s; }`
    + vals.slice(1).map((v, i) => (v == null ? '' : `.on${i + 1} .sc-${id} .${cls} { transform: ${v}; }`)).join('');
  const base = (id) => {
    let s = `
    .sc-${id} .pop, .sc-${id} .pulse, .sc-${id} .ring { transform-box: fill-box; transform-origin: center; }
    .sc-${id} .gy { transform-box: fill-box; transform-origin: 50% 100%; }
    .sc-${id} .gx { transform-box: fill-box; transform-origin: center; }
    .sc-${id} .draw { stroke-dasharray: 1; stroke-dashoffset: 1; }
    .sc-${id} .ring { opacity: 0; }
    @keyframes ${id}-pop { 0% { opacity: 0; transform: scale(.3); } 70% { opacity: 1; transform: scale(1.12); } 100% { opacity: 1; transform: scale(1); } }
    @keyframes ${id}-fin { from { opacity: 0; } to { opacity: 1; } }
    @keyframes ${id}-drop { from { opacity: 0; transform: translateY(-40px); } to { opacity: 1; transform: none; } }
    @keyframes ${id}-pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.14); } }
    @keyframes ${id}-flash { 0% { opacity: 0; } 20% { opacity: 1; } 40% { opacity: .25; } 60% { opacity: 1; } 80% { opacity: .25; } 100% { opacity: 1; } }
    @keyframes ${id}-ring { 0% { opacity: .9; transform: scale(1); } 100% { opacity: 0; transform: scale(1.6); } }
    @keyframes ${id}-drawk { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
    @keyframes ${id}-gy { from { transform: scaleY(0); } to { transform: scaleY(1); } }
    @keyframes ${id}-gx { from { transform: scaleX(0); } to { transform: scaleX(1); } }
    `;
    for (let n = 1; n <= 5; n++) s += `
    .on${n} .sc-${id} .pop${n} { animation: ${id}-pop .5s ease-out both; }
    .on${n} .sc-${id} .fin${n} { animation: ${id}-fin .5s ease-out both; }
    .on${n} .sc-${id} .drop${n} { animation: ${id}-drop .5s ease-out both; }
    .on${n} .sc-${id} .pulse${n} { animation: ${id}-pulse .6s ease-in-out .2s 2; }
    .on${n} .sc-${id} .flash${n} { animation: ${id}-flash 1.4s ease-in-out both; }
    .on${n} .sc-${id} .ring${n} { animation: ${id}-ring 1s ease-out .2s 2; }
    .on${n} .sc-${id} .draw${n} { animation: ${id}-drawk .8s ease-in-out .1s both; }
    .on${n} .sc-${id} .gy${n} { animation: ${id}-gy .8s ease-out both; }
    .on${n} .sc-${id} .gx${n} { animation: ${id}-gx .7s ease-out both; }`;
    return s;
  };
  const rad = (d) => (d * Math.PI) / 180;
  // 빛줄기 머리(채운 세모): (x, y) 가 꼭짓점, a 는 나아가는 쪽(라디안)
  const head = (x, y, a, color = C.orange, l = 16, w = 9) => {
    const bx = x - l * Math.cos(a), by = y - l * Math.sin(a), px = -Math.sin(a) * w, py = Math.cos(a) * w;
    return `<path d="M${f(x)} ${f(y)} L${f(bx + px)} ${f(by + py)} L${f(bx - px)} ${f(by - py)} Z" fill="${color}"/>`;
  };
  // 칸 n 에 (x1,y1)→(x2,y2) 로 그어지는 빛줄기. 머리는 가운데쯤에 그은 뒤 나타난다
  const ray = (n, x1, y1, x2, y2, s = 0, hide, color = C.orange, w = 5, pos = 0.6) => {
    const a = Math.atan2(y2 - y1, x2 - x1), mx = x1 + (x2 - x1) * pos, my = y1 + (y2 - y1) * pos;
    return drawPath(`M${f(x1)} ${f(y1)} L${f(x2)} ${f(y2)}`, n, color, w, s, hide) + at(n, 'fin', head(mx + 8 * Math.cos(a), my + 8 * Math.sin(a), a, color), s + 0.5, hide);
  };
  const dash = (d, color = C.muted, w = 3, da = '9 7') => `<path d="${d}" stroke="${color}" stroke-width="${w}" stroke-dasharray="${da}" fill="none" stroke-linecap="round"/>`;
  // 각을 재는 호: 중심 (cx, cy), 반지름 r, a1→a2(도, 화면 좌표)
  const arcD = (cx, cy, r, a1, a2) => {
    const p = (a) => `${f(cx + r * Math.cos(rad(a)))} ${f(cy + r * Math.sin(rad(a)))}`;
    return `M${p(a1)} A${r} ${r} 0 0 ${a2 > a1 ? 1 : 0} ${p(a2)}`;
  };
  const polar = (cx, cy, r, a) => [cx + r * Math.cos(rad(a)), cy + r * Math.sin(rad(a))];

  // ════ 반사: 바닥 거울(y=290), 빛이 닿는 점 P(320, 290) ════
  const PX = 320, PY = 290, LEN = 230;
  const mirrorFloor = () => `<path d="M80 ${PY} H560" stroke="${C.ink}" stroke-width="6" stroke-linecap="round"/>`
    + `<path d="${Array.from({ length: 20 }, (_, k) => `M${92 + k * 24} ${PY + 5} l-12 14`).join(' ')}" stroke="${C.muted}" stroke-width="2.5"/>`;
  const normalLine = (top = 72) => dash(`M${PX} ${PY} V${top}`);
  const srcPt = (th) => [PX - LEN * Math.sin(rad(th)), PY - LEN * Math.cos(rad(th))];
  const outPt = (th) => [PX + LEN * Math.sin(rad(th)), PY - LEN * Math.cos(rad(th))];
  // 손전등: 빛이 나오는 끝이 (x, y), 몸통은 빛 반대쪽
  const torch = (x, y, a) => `<g transform="translate(${f(x)} ${f(y)}) rotate(${f((a * 180) / Math.PI)})"><rect x="-58" y="-11" width="44" height="22" rx="5" fill="${C.line}" stroke="${C.ink}" stroke-width="2.5"/><path d="M-14 -11 L0 -17 V17 L-14 11 Z" fill="${C.yellow}" stroke="${C.ink}" stroke-width="2.5" stroke-linejoin="round"/></g>`;
  const incoming = (n, th, s = 0, hide) => {
    const [sx, sy] = srcPt(th), a = Math.atan2(PY - sy, PX - sx);
    return shown(n, torch(sx, sy, a), hide) + ray(n, sx, sy, PX, PY, s, hide, C.orange, 5, 0.4);
  };
  const outgoing = (n, th, s = 0, hide) => { const [ex, ey] = outPt(th); return ray(n, PX, PY, ex, ey, s, hide, C.orange, 5, 0.7); };
  const angIn = (n, th, r, color, s = 0, hide) => drawPath(arcD(PX, PY, r, -90, -90 - th), n, color, 4, s, hide);
  const angOut = (n, th, r, color, s = 0, hide) => drawPath(arcD(PX, PY, r, -90, -90 + th), n, color, 4, s, hide);
  const degLabel = (n, th, r, side, color, s = 0, hide) => {
    const [x, y] = polar(PX, PY, r, -90 + side * th / 2);
    return at(n, 'pop', text(f(x), f(y + 7), `${th}°`, { size: 20, color }), s, hide);
  };

  // ── 광원: 불 켜진 전구는 스스로 빛을 내고, 사과는 받은 빛을 되비춰야 보인다 ──
  (function () {
    const id = 't81-s3-gwangwon';
    let css = base(id);
    const bx = 130, by = 165;
    let body = `<rect x="${bx - 20}" y="${by + 36}" width="40" height="34" rx="5" fill="${C.line}" stroke="${C.muted}" stroke-width="3"/>`
      + `<path d="M${bx - 20} ${by + 48} H${bx + 20} M${bx - 20} ${by + 59} H${bx + 20}" stroke="${C.muted}" stroke-width="2.5"/>`
      + `<circle cx="${bx}" cy="${by}" r="42" fill="white" stroke="${C.ink}" stroke-width="3"/>`;
    body += at(1, 'fin', `<circle cx="${bx}" cy="${by}" r="42" fill="${C.yellow}" stroke="${C.orange}" stroke-width="3"/><path d="M${bx - 14} ${by + 10} l7 -16 l7 12 l7 -12 l7 16" stroke="${C.orange}" stroke-width="3" fill="none" stroke-linejoin="round"/>`, 0.1);
    [-90, -45, 0, 45, 135, 180, -135].forEach((a, k) => {
      const [x1, y1] = polar(bx, by, 54, a), [x2, y2] = polar(bx, by, 84, a);
      body += drawPath(`M${f(x1)} ${f(y1)} L${f(x2)} ${f(y2)}`, 1, C.orange, 5, 0.4 + k * 0.05);
    });
    // 사과
    const ax = 350, ay = 230;
    body += `<path d="M${ax} ${ay - 30} C${ax + 30} ${ay - 46} ${ax + 48} ${ay - 10} ${ax + 34} ${ay + 18} C${ax + 24} ${ay + 40} ${ax + 8} ${ay + 38} ${ax} ${ay + 32} C${ax - 8} ${ay + 38} ${ax - 24} ${ay + 40} ${ax - 34} ${ay + 18} C${ax - 48} ${ay - 10} ${ax - 30} ${ay - 46} ${ax} ${ay - 30} Z" fill="${C.red}" stroke="${C.ink}" stroke-width="2.5"/>`
      + `<path d="M${ax} ${ay - 30} q2 -14 8 -20" stroke="${C.ink}" stroke-width="3" fill="none"/><path d="M${ax + 6} ${ay - 44} q16 -8 24 2 q-14 8 -24 -2 Z" fill="${C.green}"/>`;
    // 눈(왼쪽을 본다)
    const ex = 550, ey = 110;
    body += `<path d="M${ex - 38} ${ey} Q${ex} ${ey - 30} ${ex + 38} ${ey} Q${ex} ${ey + 30} ${ex - 38} ${ey} Z" fill="white" stroke="${C.ink}" stroke-width="3"/><circle cx="${ex - 12}" cy="${ey}" r="13" fill="${C.ink}"/>`;
    body += ray(2, bx + 50, by + 14, ax - 40, ay - 8, 0.1) + ray(2, ax + 30, ay - 30, ex - 44, ey + 8, 0.9);
    body += ring(bx, by, 50, 3, C.orange) + at(3, 'pop', tag(bx, by + 140, '광원', KEY, { size: 24 }), 0.3);
    put('8-1/과학/3/광원', svg(id, body, css));
  })();

  // ── 법선: 빛이 닿은 점에서 거울 면에 수직으로 세운 점선 ──
  (function () {
    const id = 't81-s3-beopseon', th = 40;
    let css = base(id);
    let body = mirrorFloor() + incoming(1, th, 0.1);
    body += `<g class="b2"><g class="gy gy2">${normalLine(76)}</g></g>` + at(2, 'fin', `<path d="M${PX + 18} ${PY} V${PY - 18} H${PX}" stroke="${C.ink}" stroke-width="2.5" fill="none"/>`, 0.8) + ring(PX, PY, 18, 2, C.purple, 0.6);
    body += outgoing(3, th, 0.1) + angIn(3, th, 70, C.red, 0.9) + angOut(3, th, 70, C.blue, 0.9);
    body += `<g class="b3"><path class="flash flash3" d="M${PX} ${PY} V76" stroke="${C.purple}" stroke-width="7" stroke-opacity=".6" stroke-linecap="round"/></g>` + at(3, 'pop', tag(PX, 44, '법선', KEY, { size: 22 }), 0.3);
    put('8-1/과학/3/법선', svg(id, body, css));
  })();

  // ── 입사각: 들어오는 빛과 법선 사이의 각 ──
  (function () {
    const id = 't81-s3-ipsagak', th = 40;
    let css = base(id);
    let body = mirrorFloor() + shown(1, normalLine(76)) + incoming(1, th, 0.1);
    body += angIn(2, th, 70, C.red, 0.1) + degLabel(2, th, 98, -1, C.red, 0.8);
    const [lx, ly] = polar(PX, PY, 152, -90 - th / 2);
    body += `<g class="b3"><g class="flash flash3">${`<path d="${arcD(PX, PY, 70, -90, -90 - th)}" stroke="${C.red}" stroke-width="8" fill="none"/>`}</g></g>` + at(3, 'pop', text(f(lx), f(ly + 8), '입사각', { size: 22, color: C.red }), 0.2);
    put('8-1/과학/3/입사각', svg(id, body, css));
  })();

  // ── 반사각: 튕겨 나가는 빛과 법선 사이의 각 ──
  (function () {
    const id = 't81-s3-bansagak', th = 40;
    let css = base(id);
    let body = mirrorFloor() + shown(1, normalLine(76)) + incoming(1, th, 0.1) + outgoing(1, th, 0.9);
    body += angOut(2, th, 70, C.blue, 0.1) + degLabel(2, th, 98, 1, C.blue, 0.8);
    const [lx, ly] = polar(PX, PY, 152, -90 + th / 2);
    body += `<g class="b3"><g class="flash flash3"><path d="${arcD(PX, PY, 70, -90, -90 + th)}" stroke="${C.blue}" stroke-width="8" fill="none"/></g></g>` + at(3, 'pop', text(f(lx), f(ly + 8), '반사각', { size: 22, color: C.blue }), 0.2);
    put('8-1/과학/3/반사각', svg(id, body, css));
  })();

  // ── 반사 법칙: 30° 로 들어오면 30° 로, 55° 로 들어오면 55° 로 나간다 ──
  (function () {
    const id = 't81-s3-bansabeop';
    let css = base(id);
    let body = mirrorFloor() + normalLine(112);
    const pair = (n, th, r, lr, hide) => incoming(n, th, 0.1, hide) + outgoing(n, th, 0.8, hide)
      + angIn(n, th, r, C.red, 1.3, hide) + angOut(n, th, r, C.blue, 1.3, hide)
      + degLabel(n, th, lr, -1, C.red, 1.6, hide) + degLabel(n, th, lr, 1, C.blue, 1.6, hide);
    body += pair(1, 30, 75, 112, 2) + pair(2, 55, 60, 96);
    body += `<g class="b3"><g class="flash flash3"><path d="${arcD(PX, PY, 60, -90, -145)}" stroke="${C.red}" stroke-width="8" fill="none"/><path d="${arcD(PX, PY, 60, -90, -35)}" stroke="${C.blue}" stroke-width="8" fill="none"/></g></g>`;
    body += at(3, 'pop', tag(PX, 86, '입사각 = 반사각', LIL, { size: 20 }), 0.2) + at(3, 'pop', tag(PX, 38, '반사 법칙', KEY, { size: 22 }), 0.6);
    put('8-1/과학/3/반사 법칙', svg(id, body, css));
  })();

  // ── 상: 거울에 반사된 빛이 거울 뒤에서 곧게 온 것처럼 보여 거울 뒤에 촛불 모습이 보인다 ──
  (function () {
    const id = 't81-s3-sang';
    let css = base(id);
    const MX = 330, ox = 200, ix = 2 * MX - ox, top = 168, foot = 282, E = [118, 92];
    const candle = (x, ghost) => {
      const o = ghost ? ' opacity=".55"' : '', d = ghost ? ' stroke-dasharray="6 5"' : '';
      return `<g${o}><rect x="${x - 14}" y="${top + 34}" width="28" height="${foot - top - 34}" rx="4" fill="white" stroke="${C.ink}" stroke-width="3"${d}/>`
        + `<path d="M${x} ${top + 34} V${top + 26}" stroke="${C.ink}" stroke-width="3"/>`
        + `<path d="M${x} ${top} C${x + 14} ${top + 12} ${x + 12} ${top + 26} ${x} ${top + 26} C${x - 12} ${top + 26} ${x - 14} ${top + 12} ${x} ${top} Z" fill="${C.orange}" stroke="${C.red}" stroke-width="2"${d}/></g>`;
    };
    let body = `<path d="M${MX} 50 V320" stroke="${C.ink}" stroke-width="6" stroke-linecap="round"/>`
      + `<path d="${Array.from({ length: 11 }, (_, k) => `M${MX + 5} ${62 + k * 24} l14 12`).join(' ')}" stroke="${C.muted}" stroke-width="2.5"/>`;
    body += `<path d="M${E[0] - 36} ${E[1]} Q${E[0]} ${E[1] - 28} ${E[0] + 36} ${E[1]} Q${E[0]} ${E[1] + 28} ${E[0] - 36} ${E[1]} Z" fill="white" stroke="${C.ink}" stroke-width="3"/><circle cx="${E[0] + 12}" cy="${E[1]}" r="12" fill="${C.ink}"/>`;
    body += at(1, 'fin', candle(ox, false), 0.1);
    const T = [E[0] + 40, E[1] + 2], hit = (py) => T[1] + (py - T[1]) * (MX - T[0]) / (ix - T[0]); // 눈 쪽 끝점과 상을 잇는 곧은 선이 거울과 만나는 곳
    const my = hit(top + 2);
    body += ray(2, ox, top + 2, MX, my, 0.1) + ray(2, MX, my, T[0], T[1], 0.8);
    body += at(2, 'fin', dash(`M${MX} ${f(my)} L${ix} ${top + 2}`, C.purple, 3, '7 6'), 1.4);
    body += at(2, 'fin', candle(ix, true), 1.4);
    body += glowRect(ix - 30, top - 10, 60, foot - top + 20, 3, C.purple, 0.2) + at(3, 'pop', tag(ix, foot + 34, '상', KEY, { size: 24 }), 0.3) + at(3, 'pop', tag(ox, foot + 34, '물체', GRAY, { size: 20 }), 0.5);
    put('8-1/과학/3/상', svg(id, body, css));
  })();

  // ════ 둥근 거울: 원(중심 cx, cy, 반지름 R) 위에서 반사 법칙으로 셈한다 ════
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1]], add = (a, b) => [a[0] + b[0], a[1] + b[1]], mul = (a, k) => [a[0] * k, a[1] * k];
  const dot2 = (a, b) => a[0] * b[0] + a[1] * b[1], unit = (a) => mul(a, 1 / Math.hypot(a[0], a[1]));
  // p 에서 d 쪽으로 가는 빛이 원과 만나는 점(near: 가까운 쪽/먼 쪽)과 반사된 방향
  const hitCircle = (p, d, c, R, near) => {
    d = unit(d);
    const m = sub(p, c), b = dot2(m, d), q = dot2(m, m) - R * R, disc = Math.sqrt(b * b - q);
    const t = near ? -b - disc : -b + disc, h = add(p, mul(d, t)), n = mul(sub(h, c), 1 / R);
    return { h, r: sub(d, mul(n, 2 * dot2(d, n))) };
  };
  // 두 직선(p+t·u, q+s·v)의 만나는 점
  const meet = (p, u, q, v) => { const den = u[0] * v[1] - u[1] * v[0], w = sub(q, p), t = (w[0] * v[1] - w[1] * v[0]) / den; return add(p, mul(u, t)); };
  const P = (a) => `${f(a[0])} ${f(a[1])}`;
  const arrowObj = (x, y0, y1, color = C.green, ghost) => {
    const up = y1 < y0 ? 1 : -1, d = ghost ? ' stroke-dasharray="6 5"' : '';
    return `<path d="M${f(x)} ${f(y0)} V${f(y1 + up * 10)}" stroke="${color}" stroke-width="6"${d}/><path d="M${f(x)} ${f(y1)} L${f(x - 11)} ${f(y1 + up * 16)} L${f(x + 11)} ${f(y1 + up * 16)} Z" fill="${color}"${ghost ? ' fill-opacity=".6"' : ''}/>`;
  };
  // 거울 호: 위 끝 → 꼭짓점 → 아래 끝. 뒷면 빗금은 오른쪽(+x)
  const mirrorArc = (c, R, ay, half, convex) => {
    const sx = convex ? -1 : 1, xe = c[0] + sx * Math.sqrt(R * R - half * half), vx = c[0] + sx * R;
    let s = `<path d="M${f(xe)} ${ay - half} A${R} ${R} 0 0 ${convex ? 0 : 1} ${f(vx)} ${ay} A${R} ${R} 0 0 ${convex ? 0 : 1} ${f(xe)} ${ay + half}" stroke="${C.ink}" stroke-width="6" fill="none" stroke-linecap="round"/>`;
    let h = '';
    for (let y = ay - half + 12; y <= ay + half - 8; y += 22) { const x = c[0] + sx * Math.sqrt(R * R - (y - ay) * (y - ay)); h += `M${f(x + 4)} ${f(y)} l14 10 `; }
    return s + `<path d="${h}" stroke="${C.muted}" stroke-width="2.5"/>`;
  };

  // ── 볼록 거울: 빛을 퍼지게 반사하고, 늘 작고 바로 선 상이 거울 뒤에 보인다 ──
  (function () {
    const id = 't81-s3-bolrok';
    let css = base(id);
    const ay = 215, R = 260, c = [640, ay], half = 125;
    let body = dash(`M40 ${ay} H630`, C.line, 2.5, '4 6') + mirrorArc(c, R, ay, half, true);
    // 칸 1: 나란한 빛 셋이 퍼져 나간다
    [ay - 70, ay, ay + 70].forEach((y, k) => {
      const { h, r } = hitCircle([60, y], [1, 0], c, R, true), e = add(h, mul(r, 190));
      body += ray(1, 60, y, h[0], h[1], 0.1 + k * 0.05, 2, C.orange, 5, 0.45) + (k === 1 ? ray(1, h[0], h[1], 60, y, 0.9, 2, C.orange, 5, 0.25) : ray(1, h[0], h[1], e[0], e[1], 0.9, 2));
    });
    body += at(1, 'pop', tag(160, 60, '퍼짐', GRAY, { size: 20 }), 1.6, 2);
    // 칸 2: 물체와 상
    const ox = 262, oy = ay - 92, O = [ox, oy];
    const r1 = hitCircle(O, [1, 0], c, R, true), r2 = hitCircle(O, sub(c, O), c, R, true);
    const I = meet(r1.h, mul(r1.r, -1), r2.h, unit(sub(c, r2.h)));
    body += at(2, 'fin', arrowObj(ox, ay, oy), 0.1);
    body += ray(2, ox + 6, oy, r1.h[0], r1.h[1], 0.2) + ray(2, r1.h[0], r1.h[1], ...add(r1.h, mul(r1.r, 170)), 0.9);
    body += ray(2, ox + 6, oy + 1, r2.h[0], r2.h[1], 0.4, null, C.orange, 4, 0.35) + ray(2, r2.h[0], r2.h[1], ...add(r2.h, mul(r2.r, 210)), 1.0, null, C.orange, 4, 0.75);
    body += at(2, 'fin', dash(`M${P(r1.h)} L${P(I)} M${P(r2.h)} L${P(I)}`, C.purple, 3, '6 5'), 1.3) + at(2, 'fin', arrowObj(I[0], ay, I[1], C.purple, true), 1.5);
    body += at(2, 'pop', tag(ox, ay + 30, '물체', GRAY, { size: 18 }), 0.3);
    body += at(2, 'pop', tag(560, 160, '작고 바로 선 상', LIL, { size: 18 }), 1.6) + at(2, 'fin', lead(I[0] + 8, I[1] + 4, 500, 172), 1.6);
    body += glowRect(372, ay - half - 8, 60, 2 * half + 16, 3, C.red, 0.2) + at(3, 'pop', tag(540, 46, '볼록 거울', KEY, { size: 22 }), 0.4) + at(3, 'fin', lead(476, 58, 432, 92), 0.6);
    put('8-1/과학/3/볼록 거울', svg(id, body, css));
  })();

  // ── 오목 거울: 빛을 모으고, 가까운 물체는 크고 바로 선 상, 먼 물체는 거꾸로 선 상 ──
  (function () {
    const id = 't81-s3-omok';
    let css = base(id);
    const ay = 200, R = 280, vx = 440, c = [vx - R, ay], half = 125, F = [vx - R / 2, ay];
    let body = dash(`M20 ${ay} H${vx + 10}`, C.line, 2.5, '4 6') + mirrorArc(c, R, ay, half, false);
    // 칸 1: 나란한 빛이 한 점에 모인다
    [ay - 60, ay - 30, ay + 30, ay + 60].forEach((y) => {
      const { h, r } = hitCircle([30, y], [1, 0], c, R, false), len = ((F[0] - h[0]) / r[0]) * 1.3;
      body += ray(1, 30, y, h[0], h[1], 0.1, 2, C.orange, 5, 0.45) + ray(1, h[0], h[1], ...add(h, mul(r, len)), 0.8, 2, C.orange, 5, 0.5);
    });
    body += at(1, 'pop', `<circle cx="${F[0]}" cy="${ay}" r="11" fill="${C.yellow}" stroke="${C.orange}" stroke-width="3"/>`, 1.5, 2) + at(1, 'pop', tag(F[0], ay + 108, '모임', GRAY, { size: 20 }), 1.6, 2);
    // 물체 끝에서 나온 두 빛(축에 나란한 빛, 거울 중심을 지나는 빛)으로 상을 찾는다
    const scene = (n, ox, oh, hide) => {
      const O = [ox, ay - oh], d2 = mul(unit(sub(O, c)), ox > c[0] ? 1 : -1);
      const r1 = hitCircle(O, [1, 0], c, R, false), r2 = hitCircle(O, d2, c, R, false);
      const I = meet(r1.h, r1.r, r2.h, r2.r);
      let b = at(n, 'fin', arrowObj(ox, ay, ay - oh), 0.1, hide) + at(n, 'pop', tag(ox, ay + 26, '물체', GRAY, { size: 18 }), 0.3, hide);
      b += ray(n, ox + 6, O[1], r1.h[0], r1.h[1], 0.1, hide, C.orange, 5, 0.5) + ray(n, ox + 6 * d2[0], O[1] + 6 * d2[1], r2.h[0], r2.h[1], 0.3, hide, C.orange, 4, 0.35);
      if (I[0] > vx) {
        // 반사된 빛이 퍼진다 → 거꾸로 이은 선이 거울 뒤에서 만난다(바로 선 상)
        b += ray(n, r1.h[0], r1.h[1], ...add(r1.h, mul(r1.r, 170)), 0.8, hide, C.orange, 5, 0.6) + ray(n, r2.h[0], r2.h[1], ...add(r2.h, mul(r2.r, 150)), 1.0, hide, C.orange, 4, 0.75);
        b += at(n, 'fin', dash(`M${P(r1.h)} L${P(I)} M${P(r2.h)} L${P(I)}`, C.purple, 3, '6 5'), 1.4, hide) + at(n, 'fin', arrowObj(I[0], ay, I[1], C.purple, true), 1.5, hide);
      } else {
        // 반사된 빛이 거울 앞에서 실제로 만난다(거꾸로 선 상)
        const e1 = add(I, mul(r1.r, 28)), e2 = add(I, mul(r2.r, 28));
        b += ray(n, r1.h[0], r1.h[1], e1[0], e1[1], 0.8, hide, C.orange, 5, 0.5) + ray(n, r2.h[0], r2.h[1], e2[0], e2[1], 1.0, hide, C.orange, 4, 0.7);
        b += at(n, 'fin', arrowObj(I[0], ay, I[1], C.purple), 1.5, hide);
      }
      return { b, I };
    };
    const near = scene(2, 372, 56, 3);
    body += near.b + at(2, 'pop', tag(560, 46, '크고 바로 선 상', LIL, { size: 18 }), 1.6, 3) + at(2, 'fin', lead(near.I[0] - 2, near.I[1] - 8, 562, 64), 1.6, 3);
    const far = scene(3, 50, 60, null);
    body += far.b + at(3, 'pop', tag(far.I[0], 300, '거꾸로 선 상', LIL, { size: 18 }), 1.6) + at(3, 'fin', lead(far.I[0], 283, far.I[0], far.I[1] + 6), 1.7);
    body += glowRect(vx - 40, ay - half - 8, 58, 2 * half + 16, 4, C.red, 0.2) + at(4, 'pop', tag(560, 46, '오목 거울', KEY, { size: 22 }), 0.4) + at(4, 'fin', lead(530, 64, 424, 92), 0.6);
    put('8-1/과학/3/오목 거울', svg(id, body, css));
  })();

  // ════ 굴절: 위는 공기, 아래는 물. 경계면 y=180, 빛이 닿는 점 Q(320, 180) ════
  const QX = 320, QY = 180, TH1 = 50, TH2 = +(Math.asin(Math.sin(rad(50)) / 1.33) * 180 / Math.PI).toFixed(1);
  const S1 = [QX - 200 * Math.sin(rad(TH1)), QY - 200 * Math.cos(rad(TH1))], E2 = [QX + 150 * Math.sin(rad(TH2)), QY + 150 * Math.cos(rad(TH2))];
  const waterBase = () => `<rect x="0" y="${QY}" width="640" height="${360 - QY}" fill="${C.sky}"/><path d="M0 ${QY} H640" stroke="${C.blue}" stroke-width="4"/>`
    + text(560, 70, '공기', { size: 22, color: C.muted }) + text(560, 320, '물', { size: 22, color: C.blue });

  // ── 굴절: 공기에서 물로 비스듬히 들어가는 빛이 경계면에서 꺾인다. 물속에서는 더 느리다 ──
  (function () {
    const id = 't81-s3-guljeol';
    let css = base(id);
    let body = waterBase();
    const a = Math.atan2(QY - S1[1], QX - S1[0]);
    body += shown(1, torch(S1[0], S1[1], a)) + ray(1, S1[0], S1[1], QX, QY, 0.1) + ray(1, QX, QY, E2[0], E2[1], 0.8);
    const G = [QX + 150 * Math.cos(a), QY + 150 * Math.sin(a)];
    body += at(1, 'fin', dash(`M${QX} ${QY} L${f(G[0])} ${f(G[1])}`, C.muted, 3, '7 7'), 1.5);
    // 칸 2: 빛 알갱이가 공기에서는 빠르게, 물에서는 느리게 간다(길이÷빠르기 비)
    const t1 = 200, t2 = 150 * 1.33, mid = f((t1 / (t1 + t2)) * 100);
    css += `@keyframes ${id}-run { 0% { transform: translate(${f(S1[0])}px, ${f(S1[1])}px); opacity: 0; } 6% { opacity: 1; } ${mid}% { transform: translate(${QX}px, ${QY}px); } 94% { opacity: 1; } 100% { transform: translate(${f(E2[0])}px, ${f(E2[1])}px); opacity: 0; } }
      .sc-${id} .runner { opacity: 0; } .on2 .sc-${id} .runner { animation: ${id}-run 2s linear infinite; }`;
    body += `<g class="b2"><g class="runner"><circle r="11" fill="${C.yellow}" stroke="${C.red}" stroke-width="3"/></g></g>`;
    body += at(2, 'pop', tag(170, 150, '빠름', GRAY, { size: 20 }), 0.2) + at(2, 'pop', tag(470, 240, '느림', COLD, { size: 20 }), 0.4);
    body += ring(QX, QY, 22, 3, C.red) + at(3, 'pop', tag(QX + 120, QY - 60, '굴절', KEY, { size: 24 }), 0.3) + at(3, 'fin', lead(QX + 82, QY - 46, QX + 14, QY - 8), 0.5);
    put('8-1/과학/3/굴절', svg(id, body, css));
  })();

  // ── 굴절각: 꺾여 나간 빛과 법선 사이의 각 ──
  (function () {
    const id = 't81-s3-guljeolgak';
    let css = base(id);
    let body = waterBase() + dash(`M${QX} 40 V340`);
    const a = Math.atan2(QY - S1[1], QX - S1[0]);
    body += shown(1, torch(S1[0], S1[1], a)) + ray(1, S1[0], S1[1], QX, QY, 0.1) + ray(1, QX, QY, E2[0], E2[1], 0.8);
    body += drawPath(arcD(QX, QY, 64, -90, -90 - TH1), 2, C.red, 4, 0.1) + drawPath(arcD(QX, QY, 64, 90, 90 - TH2), 2, C.blue, 4, 0.7);
    const [ix, iy] = polar(QX, QY, 124, -90 - TH1 / 2);
    body += at(2, 'pop', text(f(ix), f(iy + 7), '입사각', { size: 20, color: C.red }), 0.5);
    body += `<g class="b3"><g class="flash flash3"><path d="${arcD(QX, QY, 64, 90, 90 - TH2)}" stroke="${C.blue}" stroke-width="8" fill="none"/></g></g>` + at(3, 'pop', text(382, 346, '굴절각', { size: 22, color: C.ink }), 0.2);
    put('8-1/과학/3/굴절각', svg(id, body, css));
  })();

  // ════ 빛의 색: 어두운 막 위에 빨강·초록·파랑 빛을 비춘다(빛 색은 실제 빛 색에 가깝게) ════
  const LR = '#e5483c', LG = '#45b852', LB = '#3f6fe0', LY = '#f4dc3e', LC = '#5ad3e0', LM = '#d957c9', LW = '#ffffff', PANEL = '#2b323c';
  const CR = [170, 140], CG = [270, 140], CB = [220, 227], RR = 95;
  const circ = (c, fill) => `<circle cx="${c[0]}" cy="${c[1]}" r="${RR}" fill="${fill}"/>`;
  const lightMix = (id, nRG, nB) => {
    const defs = `<defs><clipPath id="${id}-r">${circ(CR, '#000')}</clipPath><clipPath id="${id}-g">${circ(CG, '#000')}</clipPath></defs>`;
    let b = defs + `<rect x="30" y="20" width="380" height="320" rx="16" fill="${PANEL}"/>`;
    b += at(nRG, 'fin', circ(CR, LR), 0.1) + at(nRG, 'fin', circ(CG, LG), 0.4)
      + at(nRG, 'fin', `<g clip-path="url(#${id}-r)">${circ(CG, LY)}</g>`, 0.9);
    b += at(nB, 'fin', circ(CB, LB), 0.1)
      + at(nB, 'fin', `<g clip-path="url(#${id}-r)">${circ(CB, LM)}</g>`, 0.7) + at(nB, 'fin', `<g clip-path="url(#${id}-g)">${circ(CB, LC)}</g>`, 0.9)
      + at(nB, 'fin', `<g clip-path="url(#${id}-r)"><g clip-path="url(#${id}-g)">${circ(CB, LW)}</g></g>`, 1.2);
    return b;
  };
  const lab = (n, x, y, s, label, color = C.ink, hide) => at(n, 'pop', text(x, y, label, { size: 20, color }), s, hide);

  // ── 빛의 합성: 빨강+초록=노랑, 초록+파랑=청록, 빨강+파랑=자홍, 셋=흰색 ──
  (function () {
    const id = 't81-s3-hapseong';
    let css = base(id);
    let body = lightMix(id, 1, 2);
    body += lab(1, 110, 120, 0.6, '빨강', 'white') + lab(1, 330, 120, 0.6, '초록') + lab(1, 220, 103, 1.3, '노랑');
    body += lab(2, 220, 310, 0.5, '파랑', 'white') + lab(2, 283, 212, 1.4, '청록') + lab(2, 157, 212, 1.4, '자홍', 'white') + lab(2, 220, 176, 1.6, '흰색');
    body += at(1, 'pop', tag(525, 120, '빨강 + 초록 = 노랑', [LY, C.orange], { size: 18 }), 1.4);
    body += at(2, 'pop', tag(525, 170, '초록 + 파랑 = 청록', [LC, C.blue], { size: 18 }), 1.5) + at(2, 'pop', tag(525, 220, '빨강 + 파랑 = 자홍', [C.lilac, C.purple], { size: 18 }), 1.6) + at(2, 'pop', tag(525, 270, '세 빛 = 흰색', GRAY, { size: 18 }), 1.7);
    body += at(3, 'pop', tag(525, 56, '빛의 합성', KEY, { size: 24 }), 0.3) + glowRect(30, 20, 380, 320, 3, C.orange, 0.2, 16);
    put('8-1/과학/3/빛의 합성', svg(id, body, css));
  })();

  // ── 빛의 삼원색: 빨강·초록·파랑 세 빛의 세기를 바꾸어 섞으면 여러 색이 된다 ──
  (function () {
    const id = 't81-s3-samwonsaek';
    let css = base(id);
    let body = lightMix(id, 1, 1);
    body += lab(1, 110, 120, 1.4, '빨강', 'white') + lab(1, 330, 120, 1.5, '초록') + lab(1, 220, 310, 1.6, '파랑', 'white');
    // 칸 2: 세 빛의 세기 막대와, 섞인 빛의 색 견본. 7초마다 주황 → 하늘 → 분홍
    const states = [[1, 0.5, 0.02, '#ff8000'], [0.3, 0.75, 1, '#4dbfff'], [1, 0.4, 0.7, '#ff66b3']];
    const bx = [446, 482, 518], top = 120, bot = 250, H = bot - top;
    let bars = `<rect x="430" y="96" width="196" height="196" rx="14" fill="${PANEL}"/>`;
    [LR, LG, LB].forEach((col, k) => {
      bars += `<rect x="${bx[k] - 13}" y="${top}" width="26" height="${H}" rx="4" fill="#4a535f"/><g class="bar bar${k}"><rect x="${bx[k] - 13}" y="${top}" width="26" height="${H}" rx="4" fill="${col}"/></g>`;
      const kf = [[0, 0], [37, 0], [43, 1], [66, 1], [72, 2], [93, 2], [100, 0]].map(([p, si]) => `${p}% { transform: scaleY(${states[si][k]}); }`).join(' ');
      css += `@keyframes ${id}-b${k} { ${kf} } .sc-${id} .bar${k} { transform-box: fill-box; transform-origin: 50% 100%; transform: scaleY(${states[0][k]}); } .on2 .sc-${id} .bar${k} { animation: ${id}-b${k} 7s ease-in-out infinite; }`;
    });
    states.forEach((st, si) => {
      const op = [[0, si === 0], [37, si === 0], [43, si === 1], [66, si === 1], [72, si === 2], [93, si === 2], [100, si === 0]].map(([p, on]) => `${p}% { opacity: ${on ? 1 : 0}; }`).join(' ');
      css += `@keyframes ${id}-s${si} { ${op} } .sc-${id} .sw${si} { opacity: ${si === 0 ? 1 : 0}; } .on2 .sc-${id} .sw${si} { animation: ${id}-s${si} 7s ease-in-out infinite; }`;
      bars += `<g class="sw${si}"><rect x="552" y="${top}" width="62" height="${H}" rx="8" fill="${st[3]}"/></g>`;
    });
    bars += text(bx[0], 278, 'R', { size: 20, color: 'white' }) + text(bx[1], 278, 'G', { size: 20, color: 'white' }) + text(bx[2], 278, 'B', { size: 20, color: 'white' });
    body += at(2, 'fin', bars, 0.1);
    body += ring(110, 114, 34, 3, LR, 0.1) + ring(330, 114, 34, 3, C.green, 0.3) + ring(220, 304, 34, 3, LB, 0.5);
    body += at(3, 'pop', tag(528, 50, '빛의 삼원색', KEY, { size: 22 }), 0.4);
    put('8-1/과학/3/빛의 삼원색', svg(id, body, css));
  })();

  // ── 화소: 화면 그림은 작은 네모 점으로 되어 있고, 점 하나는 빨강·초록·파랑 빛으로 되어 있다 ──
  (function () {
    const id = 't81-s3-hwaso';
    let css = base(id);
    const pic = ['bbbbbbbb', 'bbbyybbb', 'bbyyyybb', 'bbyyyybb', 'bbbyybbb', 'bbbbbbbb', 'gggggggg', 'gggggggg', 'gggggggg'];
    const col = { b: '#3f6fe0', y: '#f4dc3e', g: '#45b852' };
    const sx = 64, sy = 58, cs = 24;
    let body = `<rect x="44" y="30" width="232" height="300" rx="26" fill="${C.ink}"/>`;
    let px = '';
    pic.forEach((row, r) => [...row].forEach((ch, k) => { px += `<rect x="${sx + k * cs + 1}" y="${sy + r * cs + 1}" width="${cs - 2}" height="${cs - 2}" fill="${col[ch]}"/>`; }));
    body += px;
    // 고른 2×2 칸: 3~4행? → 4·5행, 3·4열 (노랑 둘, 파랑 둘)
    const br = 4, bc = 3, bxx = sx + bc * cs, byy = sy + br * cs;
    body += at(1, 'pop', `<rect x="${bxx - 3}" y="${byy - 3}" width="${2 * cs + 6}" height="${2 * cs + 6}" fill="none" stroke="white" stroke-width="4"/>`, 0.6);
    // 칸 2: 크게 본 네 점
    const zc = [470, 180], zr = 132, big = 90;
    const lit = { y: [1, 1, 0], b: [0, 0, 1] };
    let zoom = `<defs><clipPath id="${id}-z"><circle cx="${zc[0]}" cy="${zc[1]}" r="${zr}"/></clipPath></defs>`
      + lead(bxx + 2 * cs + 3, byy - 3, zc[0] - 92, zc[1] - 96) + lead(bxx + 2 * cs + 3, byy + 2 * cs + 3, zc[0] - 92, zc[1] + 96)
      + `<circle cx="${zc[0]}" cy="${zc[1]}" r="${zr}" fill="#1f252d" stroke="${C.ink}" stroke-width="5"/><g clip-path="url(#${id}-z)">`;
    [['y', 'y'], ['b', 'b']].forEach((row, r) => row.forEach((ch, k) => {
      const x0 = zc[0] - big + k * big, y0 = zc[1] - big + r * big;
      zoom += `<rect x="${x0 + 3}" y="${y0 + 3}" width="${big - 6}" height="${big - 6}" rx="6" fill="#2b323c"/>`;
      [LR, LG, LB].forEach((c, s) => { zoom += `<rect x="${x0 + 10 + s * 25}" y="${y0 + 10}" width="20" height="${big - 20}" rx="4" fill="${lit[ch][s] ? c : '#3d4550'}"/>`; });
    }));
    zoom += `</g>`;
    body += at(2, 'pop', zoom, 0.1);
    body += glowRect(zc[0] - big, zc[1] - big, big, big, 3, C.yellow, 0.2, 8) + `<g class="b3"><rect class="flash flash3" x="${bxx - 2}" y="${byy - 2}" width="${cs + 4}" height="${cs + 4}" fill="none" stroke="${C.red}" stroke-width="4"/></g>`;
    body += at(3, 'pop', tag(zc[0], 340, '화소', KEY, { size: 22 }), 0.4);
    put('8-1/과학/3/화소', svg(id, body, css));
  })();

  // ════ 파동: 사인 곡선. y = y0 − A·sin(2π(x − x0)/λ − 2πt/T) 꼴로 오른쪽으로 나아간다 ════
  const sinePath = (xa, xb, y0, A, lam, x0 = 0, step = 4) => {
    let d = '';
    for (let x = xa; x <= xb + 0.01; x += step) d += `${d ? 'L' : 'M'}${f(x)} ${f(y0 - A * Math.sin((2 * Math.PI * (x - x0)) / lam))} `;
    return d.trim();
  };
  // 제자리 x 에서 위아래로만 움직이는 점의 transform 열쇠틀(파동이 오른쪽으로 갈 때)
  const bobKeys = (name, x, A, lam, x0) => {
    let k = '';
    for (let i = 0; i <= 16; i++) { const t = i / 16; k += `${f(t * 100)}% { transform: translateY(${f(-A * Math.sin((2 * Math.PI * (x - x0)) / lam - 2 * Math.PI * t))}px); } `; }
    return `@keyframes ${name} { ${k} }`;
  };

  // ── 파동: 줄 끝을 위아래로 흔들면 떨림이 줄을 따라 퍼져 나간다. 줄의 한 점은 제자리에서 떨기만 한다 ──
  (function () {
    const id = 't81-s3-padong';
    let css = base(id);
    const y0 = 200, A = 52, lam = 200, T = 1.6, x0 = 80;
    css += `@keyframes ${id}-mv { from { transform: translateX(0); } to { transform: translateX(${lam}px); } }
      .sc-${id} .mv { animation: ${id}-mv ${T}s linear infinite; }
      ${bobKeys(`${id}-hand`, x0, A, lam, x0)} ${bobKeys(`${id}-dot`, 380, A, lam, x0)}
      .sc-${id} .hand { animation: ${id}-hand ${T}s linear infinite; } .sc-${id} .bob { animation: ${id}-dot ${T}s linear infinite; }`;
    let body = `<defs><clipPath id="${id}-c"><rect x="${x0}" y="0" width="${600 - x0}" height="360"/></clipPath></defs>`;
    body += shown(1, `<g clip-path="url(#${id}-c)"><g class="mv"><path d="${sinePath(x0 - lam, 600, y0, A, lam, x0)}" stroke="${C.orange}" stroke-width="7" fill="none" stroke-linecap="round"/></g></g>`
      + `<g class="hand"><circle cx="${x0}" cy="${y0}" r="22" fill="${C.peach}" stroke="${C.ink}" stroke-width="3"/></g>`);
    body += at(2, 'fin', dash(`M380 ${y0 - A - 22} V${y0 + A + 22}`, C.muted, 3, '6 6'), 0.1) + shown(2, `<g class="bob"><circle cx="380" cy="${y0}" r="12" fill="${C.red}" stroke="white" stroke-width="3"/></g>`);
    body += at(2, 'pop', `<path d="M406 ${y0 - 40} V${y0 + 40} M398 ${y0 - 30} L406 ${y0 - 42} L414 ${y0 - 30} M398 ${y0 + 30} L406 ${y0 + 42} L414 ${y0 + 30}" stroke="${C.red}" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`, 0.3);
    body += `<g class="b2"><g class="gx gx2" style="transform-origin:left center">${`<path d="M200 66 H540" stroke="${C.blue}" stroke-width="6" stroke-linecap="round"/>` + head(560, 66, 0, C.blue, 22, 12)}</g></g>`;
    body += glowRect(170, 40, 410, 52, 3, C.blue, 0.2, 26) + at(3, 'pop', tag(380, 318, '파동', KEY, { size: 24 }), 0.4);
    put('8-1/과학/3/파동', svg(id, body, css));
  })();

  // ── 매질: 물결파가 지나가도 물에 뜬 공은 제자리에서 오르내린다. 물이 떨림을 전해 준다 ──
  (function () {
    const id = 't81-s3-maejil';
    let css = base(id);
    const y0 = 200, A = 34, lam = 220, T = 2, bx = 330;
    css += `@keyframes ${id}-mv { from { transform: translateX(0); } to { transform: translateX(${lam}px); } }
      .sc-${id} .mv { animation: ${id}-mv ${T}s linear infinite; }
      ${bobKeys(`${id}-ball`, bx, A, lam, 0)} .sc-${id} .bob { animation: ${id}-ball ${T}s linear infinite; }`;
    const surf = sinePath(-lam, 640, y0, A, lam, 0, 5);
    let body = shown(1, `<g class="mv"><path d="${surf} L640 360 L${-lam} 360 Z" fill="${C.sky}"/><path d="${surf}" stroke="${C.blue}" stroke-width="4" fill="none"/><g class="b3"><g class="flash flash3"><path d="${surf} L640 360 L${-lam} 360 Z" fill="${C.blue}" fill-opacity=".22"/><path d="${surf}" stroke="${C.blue}" stroke-width="9" fill="none"/></g></g></g>`);
    body += `<g class="b1"><g class="gx gx1" style="transform-origin:left center"><path d="M150 70 H470" stroke="${C.blue}" stroke-width="6" stroke-linecap="round"/>${head(490, 70, 0, C.blue, 22, 12)}</g></g>`;
    body += at(2, 'fin', dash(`M${bx} ${y0 - A - 40} V${y0 + A + 10}`, C.muted, 3, '6 6'), 0.1) + shown(2, `<g class="bob"><circle cx="${bx}" cy="${y0 - 12}" r="18" fill="${C.yellow}" stroke="${C.orange}" stroke-width="3"/></g>`);
    body += at(2, 'pop', tag(bx + 100, 132, '제자리', GRAY, { size: 20 }), 0.5);
    body += at(3, 'pop', tag(320, 304, '매질', KEY, { size: 24 }), 0.4);
    put('8-1/과학/3/매질', svg(id, body, css));
  })();

  // ════ 파동의 생김새: 가운데 y=190, 진폭 80, 파장 200. 마루 x=110·310·510, 골 x=210·410 ════
  const WY = 190, WA = 80, WL = 200, WX = 60;
  const wave = (n = 1, s = 0.1) => drawPath(sinePath(WX, WX + 2.5 * WL, WY, WA, WL, WX), n, C.orange, 6, s);
  const crests = [110, 310, 510], troughs = [210, 410];
  const centerLine = () => dash(`M40 ${WY} H600`, C.muted, 2.5, '8 7');
  const pts = (xs, y, n, color, s0 = 0) => xs.map((x, k) => at(n, 'pop', `<circle cx="${x}" cy="${y}" r="10" fill="${color}" stroke="white" stroke-width="3"/>`, s0 + k * 0.15)).join('');
  // 양쪽 화살표(가로·세로)
  const dbl = (x1, y1, x2, y2, color) => {
    const a = Math.atan2(y2 - y1, x2 - x1);
    return `<path d="M${x1} ${y1} L${x2} ${y2}" stroke="${color}" stroke-width="4"/>` + head(x2, y2, a, color, 14, 8) + head(x1, y1, a + Math.PI, color, 14, 8);
  };

  // ── 마루 ──
  (function () {
    const id = 't81-s3-maru';
    let css = base(id);
    let body = shown(1, centerLine()) + wave(1);
    body += pts(crests, WY - WA, 2, C.red, 0.1);
    body += crests.map((x, k) => ring(x, WY - WA, 16, 3, C.red, k * 0.1)).join('') + at(3, 'pop', tag(310, 56, '마루', KEY, { size: 24 }), 0.4);
    put('8-1/과학/3/마루', svg(id, body, css));
  })();

  // ── 골 ──
  (function () {
    const id = 't81-s3-gol';
    let css = base(id);
    let body = shown(1, centerLine()) + wave(1);
    body += pts(troughs, WY + WA, 2, C.blue, 0.1);
    body += troughs.map((x, k) => ring(x, WY + WA, 16, 3, C.blue, k * 0.1)).join('') + at(3, 'pop', tag(410, 324, '골', KEY, { size: 24 }), 0.4);
    put('8-1/과학/3/골', svg(id, body, css));
  })();

  // ── 파장: 이웃한 마루와 마루, 골과 골 사이 거리 ──
  (function () {
    const id = 't81-s3-pajang';
    let css = base(id);
    let body = shown(1, centerLine()) + wave(1) + pts(crests, WY - WA, 1, C.red, 0.9) + pts(troughs, WY + WA, 1, C.blue, 1.1);
    body += at(2, 'fin', dash(`M110 ${WY - WA - 14} V62 M310 ${WY - WA - 14} V62`, C.muted, 2.5, '5 5'), 0.1)
      + `<g class="b2"><g class="gx gx2">${dbl(116, 74, 304, 74, C.red)}</g></g>`;
    body += at(3, 'fin', dash(`M210 ${WY + WA + 14} V318 M410 ${WY + WA + 14} V318`, C.muted, 2.5, '5 5'), 0.1)
      + `<g class="b3"><g class="gx gx3">${dbl(216, 306, 404, 306, C.blue)}</g></g>`;
    body += at(3, 'pop', tag(210, 40, '파장', KEY, { size: 22 }), 0.6) + at(3, 'pop', tag(478, 306, '파장', KEY, { size: 22 }), 0.8);
    put('8-1/과학/3/파장', svg(id, body, css));
  })();

  // ── 진폭: 진동 중심에서 마루나 골까지의 높이 ──
  (function () {
    const id = 't81-s3-jinpok';
    let css = base(id);
    let body = drawPath(`M40 ${WY} H600`, 1, C.muted, 2.5, 0.1) + wave(1, 0.4) + at(1, 'pop', text(104, WY + 34, '진동 중심', { size: 18, color: C.muted }), 1.1);
    body += `<g class="b2"><g class="gy gy2">${dbl(310, WY - 6, 310, WY - WA + 2, C.red)}</g></g>`
      + `<g class="b2"><g class="gy gy2" style="transform-origin:50% 0%">${dbl(410, WY + 6, 410, WY + WA - 2, C.red)}</g></g>`;
    body += at(3, 'pop', tag(310, 70, '진폭', KEY, { size: 22 }), 0.3) + at(3, 'pop', tag(410, 312, '진폭', KEY, { size: 22 }), 0.5);
    put('8-1/과학/3/진폭', svg(id, body, css));
  })();

  // ── 진동수: 1초 동안 진동하는 횟수. 위는 2번(2 Hz), 아래는 4번(4 Hz) ──
  (function () {
    const id = 't81-s3-jindongsu';
    let css = base(id);
    const xa = 110, xb = 510, ya = 110, yb = 250, A = 40;
    let body = dash(`M${xa} 50 V310 M${xb} 50 V310`, C.line, 2.5, '6 6') + `<path d="M${xa - 10} 310 H${xb + 20}" stroke="${C.ink}" stroke-width="3"/>`
      + text(xa, 338, '0', { size: 20 }) + text(xb, 338, '1초', { size: 20 });
    body += `<path d="M${xa} ${ya} H${xb} M${xa} ${yb} H${xb}" stroke="${C.line}" stroke-width="2"/>`;
    body += drawPath(sinePath(xa, xb, ya, A, (xb - xa) / 2, xa, 3), 1, C.orange, 5, 0.1);
    const badge = (n, x, y, k, s) => at(n, 'pop', `<circle cx="${x}" cy="${y}" r="15" fill="${C.yellow}" stroke="${C.orange}" stroke-width="2.5"/>` + text(x, y + 7, k, { size: 18 }), s);
    [1, 2].forEach((k) => { body += badge(2, xa + k * 200, ya - A - 20, k, 0.1 + k * 0.35); });
    body += at(2, 'pop', tag(574, ya, '2 Hz', OK, { size: 20 }), 1.0);
    body += drawPath(sinePath(xa, xb, yb, A, (xb - xa) / 4, xa, 3), 3, C.blue, 5, 0.1);
    [1, 2, 3, 4].forEach((k) => { body += badge(3, xa + k * 100, yb - A - 20, k, 0.6 + k * 0.2); });
    body += at(3, 'pop', tag(574, yb, '4 Hz', COLD, { size: 20 }), 1.6);
    body += glowRect(530, ya - 22, 88, 44, 4, C.red, 0.1, 22) + glowRect(530, yb - 22, 88, 44, 4, C.red, 0.1, 22) + at(4, 'pop', tag(574, 180, '진동수', KEY, { size: 20 }), 0.4);
    put('8-1/과학/3/진동수', svg(id, body, css));
  })();

  // ── 음색: 진동수와 진폭이 같아도 파형이 다르면 다른 소리로 들린다 ──
  (function () {
    const id = 't81-s3-eumsaek';
    let css = base(id);
    const xa = 190, xb = 510, per = 160, A = 36, rows = [75, 180, 285];
    const shapes = [
      (p) => Math.sin(p),
      (p) => Math.sin(p) + 0.45 * Math.sin(2 * p + 0.6),
      (p) => { let v = 0; for (let k = 1; k <= 12; k++) { const x = (Math.PI * k) / 13; v += (Math.sin(k * p) / k) * (Math.sin(x) / x); } return v; }
    ];
    const names = ['소리굽쇠', '리코더', '바이올린'], cols = [C.orange, C.green, C.purple];
    let body = dash(`M${xa} 30 V330 M${xa + per} 30 V330 M${xb} 30 V330`, C.line, 2.5, '6 6');
    rows.forEach((y, r) => {
      let mx = 0;
      for (let i = 0; i <= 400; i++) mx = Math.max(mx, Math.abs(shapes[r]((2 * Math.PI * i) / 400)));
      let d = '';
      for (let x = xa; x <= xb; x += 2) d += `${d ? 'L' : 'M'}${x} ${f(y - (A * shapes[r]((2 * Math.PI * (x - xa)) / per)) / mx)} `;
      body += `<path d="M${xa} ${y} H${xb}" stroke="${C.line}" stroke-width="2"/>` + text(95, y + 7, names[r], { size: 20 });
      body += drawPath(d.trim(), 1, cols[r], 5, 0.1 + r * 0.3);
      body += at(2, 'fin', dash(`M${xa - 8} ${y - A} H${xb + 8} M${xa - 8} ${y + A} H${xb + 8}`, C.muted, 2, '4 5'), 0.2 + r * 0.15);
      body += `<g class="b3"><path class="flash flash3" style="animation-delay:${f(r * 0.25)}s" d="${d.trim()}" stroke="${cols[r]}" stroke-width="9" stroke-opacity=".45" fill="none"/></g>`;
    });
    body += at(2, 'pop', `<g>${dbl(xa + 6, 22, xa + per - 6, 22, C.ink)}</g>`, 0.6) + at(2, 'pop', `<g>${dbl(xa + per + 6, 22, xb - 6, 22, C.ink)}</g>`, 0.8);
    body += at(3, 'pop', tag(578, 180, '음색', KEY, { size: 24 }), 0.8);
    put('8-1/과학/3/음색', svg(id, body, css));
  })();
})(typeof window !== 'undefined' ? window : globalThis);
