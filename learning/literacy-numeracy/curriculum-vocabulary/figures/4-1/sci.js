// 과학 4-1 낱말 도식(1단원 자석의 이용·2단원 물의 상태 변화): 자석의 힘과 물의 상태 변화를 교과서 실험 그대로 코드로 그린다.
// 자석은 N극 C.red, S극 C.blue 로 칠하고 극 글자를 흰색으로 적는다. 철로 된 물체는 회색(C.line/C.muted).
// 물은 하늘색, 얼음은 하늘색에 흰 금, 눈에 보이지 않는 수증기는 점선 테두리의 빈 동그라미(칸 글에서 보이지 않는다고 말한다).
// 물속 기포는 눈에 보이므로 실선 동그라미로 그린다. 하얀 김은 그리지 않는다.
// 움직임은 transform·opacity·stroke-dashoffset 만 쓴다.
(function (root) {
  'use strict';
  const { C, svg, text, arrow, put } = root.FigureKit;
  const f = (n) => +(+n).toFixed(1);
  const dl = (s) => (s ? ` style="animation-delay:${s}s"` : '');
  const g = (cls, inner, s = 0) => `<g class="${cls}"${dl(s)}>${inner}</g>`;
  // 칸 n 에 나타나며 kind(pop·fin·rise·drop) 움직임을 한 번 한다
  const at = (n, kind, inner, s = 0) => `<g class="b${n}">${g(`${kind} ${kind}${n}`, inner, s)}</g>`;
  // 칸 n 부터 보이고, hide 칸부터 사라진다
  const shown = (n, inner, hide) => `<g class="b${n}${hide ? ' h' + hide : ''}">${inner}</g>`;
  const seeded = (seed) => () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const tw = (s, size) => [...String(s)].reduce((a, c) => a + (/[가-힣]/.test(c) ? 1 : c === ' ' ? 0.3 : 0.6), 0) * size;
  const HOT = [C.peach, C.orange], COLD = [C.sky, C.blue], OK = [C.mint, C.green], GRAY = ['white', C.muted], NP = [C.peach, C.red];
  const tag = (cx, cy, label, [fill, stroke] = OK, { size = 20, dash = false } = {}) => {
    const w = Math.round(tw(label, size) + size * 1.3), h = Math.round(size * 1.7);
    return `<g><rect x="${f(cx - w / 2)}" y="${f(cy - h / 2)}" width="${w}" height="${h}" rx="${h / 2}" fill="${fill}" stroke="${stroke}" stroke-width="2.5"${dash ? ' stroke-dasharray="6 4"' : ''}/>${text(f(cx), f(cy + size * 0.36), label, { size })}</g>`;
  };
  const lead = (x1, y1, x2, y2, color = C.muted) => `<path d="M${f(x1)} ${f(y1)} L${f(x2)} ${f(y2)}" stroke="${color}" stroke-width="2.5" stroke-linecap="round"/>`;
  const head = (x, y, ang, color, w = 4) => {
    const l = 8 + w * 1.4, p = (d) => `${f(x - l * Math.cos(ang + d))} ${f(y - l * Math.sin(ang + d))}`;
    return `<path d="M${p(-0.5)} L${f(x)} ${f(y)} L${p(0.5)}" stroke="${color}" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  };
  // 흐르는 화살표: 점선이 끝 쪽으로 흐른다. pts 는 꺾은선 [[x,y], ...].
  const flow = (pts, color, { w = 5, dash = '14 10' } = {}) => {
    const [a, b] = pts.slice(-2), ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
    const end = [b[0] - w * Math.cos(ang), b[1] - w * Math.sin(ang)];
    const d = 'M' + [...pts.slice(0, -1), end].map((p) => `${f(p[0])} ${f(p[1])}`).join(' L');
    return `<g><path class="mar" d="${d}" stroke="${color}" stroke-width="${w}" stroke-dasharray="${dash}" stroke-linecap="round" stroke-linejoin="round" fill="none"/>${head(b[0], b[1], ang, color, w)}</g>`;
  };
  // 흐르는 굽은 화살표(2차 곡선)
  const arc = (x1, y1, cx, cy, x2, y2, color, w = 5) => `<g><path class="mar" d="M${x1} ${y1} Q${cx} ${cy} ${x2} ${y2}" stroke="${color}" stroke-width="${w}" stroke-dasharray="14 10" fill="none" stroke-linecap="round"/>${head(x2, y2, Math.atan2(y2 - cy, x2 - cx), color, w)}</g>`;
  const gas = (x, y, color = C.blue, r = 8) => `<circle cx="${f(x)}" cy="${f(y)}" r="${r}" fill="white" stroke="${color}" stroke-width="2.5" stroke-dasharray="3.5 2.5"/>`;
  // 흔들흔들 떠다니는 수증기 알갱이
  const jig = (x, y, k, color = C.blue, r = 8) => `<g class="jig" style="animation-delay:${f(-(k * 0.37) % 2.4)}s">${gas(x, y, color, r)}</g>`;
  // 위로 오르며 사라지는 수증기(또는 기포): dur 초, up 픽셀
  const rise = (x, y, k, { up = -80, dur = 2.4, r = 8, bubble = false } = {}) => `<g class="up" style="animation-delay:${f(k)}s;animation-duration:${dur}s;--up:${up}px">${bubble ? `<circle cx="${f(x)}" cy="${f(y)}" r="${r}" fill="white" stroke="${C.blue}" stroke-width="2.5"/>` : gas(x, y, C.blue, r)}</g>`;
  const glowRect = (x, y, w, h, n, color = C.green, delay = 0, rx = 14) =>
    `<g class="b${n}"><rect class="flash flash${n}"${dl(delay)} x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="${rx}" fill="none" stroke="${color}" stroke-width="5"/></g>`;
  const glowPath = (d, n, color = C.green, delay = 0, w = 6) => `<g class="b${n}"><path class="flash flash${n}"${dl(delay)} d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"/></g>`;
  const ring = (cx, cy, r, n, color = C.green, s = 0) => `<g class="b${n}"><circle class="ring ring${n}"${dl(s)} cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${color}" stroke-width="4"/></g>`;
  const flame = (x, y, h = 32, w = 14) => `<g class="flk"><path d="M${x} ${y - h} Q${x + w} ${f(y - h * 0.35)} ${f(x + w * 0.6)} ${y} H${f(x - w * 0.6)} Q${x - w} ${f(y - h * 0.35)} ${x} ${y - h} Z" fill="${C.orange}"/><path d="M${x} ${f(y - h * 0.55)} Q${f(x + w * 0.5)} ${f(y - h * 0.2)} ${f(x + w * 0.3)} ${y} H${f(x - w * 0.3)} Q${f(x - w * 0.5)} ${f(y - h * 0.2)} ${x} ${f(y - h * 0.55)} Z" fill="${C.yellow}"/></g>`;
  // 막대자석: first 는 왼쪽(세로면 위쪽) 극
  const magnet = (x, y, w, h, first = 'N', vert = false, size = 20) => {
    const P = { N: C.red, S: C.blue }, second = first === 'N' ? 'S' : 'N';
    const [w1, h1] = vert ? [w, h / 2] : [w / 2, h];
    const [x2, y2] = vert ? [x, y + h / 2] : [x + w / 2, y];
    const ltr = (cx, cy, l) => text(f(cx), f(cy + size * 0.36), l, { size, color: 'white' });
    return `<g><rect x="${x}" y="${y}" width="${f(w1)}" height="${f(h1)}" fill="${P[first]}"/><rect x="${f(x2)}" y="${f(y2)}" width="${f(w1)}" height="${f(h1)}" fill="${P[second]}"/>`
      + `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="none" stroke="${C.ink}" stroke-width="2.5"/>`
      + ltr(x + w1 / 2, y + h1 / 2, first) + ltr(x2 + w1 / 2, y2 + h1 / 2, second) + '</g>';
  };
  // 물방울: (x, y) 는 둥근 아랫부분의 가운데
  const drop = (x, y, r, fill = C.sky, stroke = C.blue) => `<path d="M${f(x)} ${f(y - r * 1.8)} C${f(x + r * 0.5)} ${f(y - r * 1)} ${f(x + r)} ${f(y - r * 0.5)} ${f(x + r)} ${f(y)} A${r} ${r} 0 0 1 ${f(x - r)} ${f(y)} C${f(x - r)} ${f(y - r * 0.5)} ${f(x - r * 0.5)} ${f(y - r * 1)} ${f(x)} ${f(y - r * 1.8)} Z" fill="${fill}" stroke="${stroke}" stroke-width="2.5" stroke-linejoin="round"/>`;
  // 위가 트인 투명 그릇의 테두리
  const openLine = (x1, y1, x2, y2, stroke = C.blue) => `<path d="M${x1} ${y1} V${y2 - 6} Q${x1} ${y2} ${x1 + 6} ${y2} H${x2 - 6} Q${x2} ${y2} ${x2} ${y2 - 6} V${y1}" fill="none" stroke="${stroke}" stroke-width="4" stroke-linejoin="round"/>`;
  // 얼음 조각
  const ice = (x, y, s, rot = 0) => `<rect x="${f(x)}" y="${f(y)}" width="${s}" height="${s}" rx="${f(s * 0.14)}" fill="white" stroke="${C.blue}" stroke-width="3"${rot ? ` transform="rotate(${rot} ${f(x + s / 2)} ${f(y + s / 2)})"` : ''}/>`
    + `<path d="M${f(x + s * 0.22)} ${f(y + s * 0.62)} V${f(y + s * 0.22)} H${f(x + s * 0.62)}" stroke="${C.sky}" stroke-width="${f(Math.max(3, s * 0.09))}" fill="none" stroke-linecap="round"${rot ? ` transform="rotate(${rot} ${f(x + s / 2)} ${f(y + s / 2)})"` : ''}/>`;
  const woodBlock = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="5" fill="${C.peach}" stroke="${C.orange}" stroke-width="3"/>`
    + `<path d="M${x + 7} ${f(y + h * 0.36)} Q${f(x + w * 0.5)} ${f(y + h * 0.2)} ${x + w - 7} ${f(y + h * 0.4)} M${x + 7} ${f(y + h * 0.7)} Q${f(x + w * 0.5)} ${f(y + h * 0.84)} ${x + w - 7} ${f(y + h * 0.66)}" stroke="${C.orange}" stroke-width="2" fill="none" opacity=".7"/>`;
  const table = (x1, x2, y = 300) => `<rect x="${x1}" y="${y}" width="${x2 - x1}" height="12" rx="5" fill="${C.peach}" stroke="${C.orange}" stroke-width="3"/>`;

  // 장면마다 같이 쓰는 움직임
  const base = (id) => {
    let s = `
    .sc-${id} .pop, .sc-${id} .pulse, .sc-${id} .ring, .sc-${id} .flk { transform-box: fill-box; transform-origin: center; }
    .sc-${id} .flk { transform-origin: 50% 100%; animation: ${id}-flk .6s ease-in-out infinite alternate; }
    .sc-${id} .mar { animation: ${id}-mar .7s linear infinite; }
    .sc-${id} .draw { stroke-dasharray: 1; stroke-dashoffset: 1; transition: stroke-dashoffset 1.4s ease-in-out .2s; }
    .sc-${id} .lv { transform-box: fill-box; transform-origin: 50% 100%; }
    .sc-${id} .ring { opacity: 0; }
    .sc-${id} .jig { animation: ${id}-jig 2.4s ease-in-out infinite; }
    .sc-${id} .up { animation: ${id}-up 2.4s ease-out infinite; }
    @keyframes ${id}-pop { 0% { opacity: 0; transform: scale(.3); } 70% { opacity: 1; transform: scale(1.12); } 100% { opacity: 1; transform: scale(1); } }
    @keyframes ${id}-fin { from { opacity: 0; } to { opacity: 1; } }
    @keyframes ${id}-rise { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
    @keyframes ${id}-drop { from { opacity: 0; transform: translateY(-40px); } to { opacity: 1; transform: none; } }
    @keyframes ${id}-pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }
    @keyframes ${id}-flash { 0% { opacity: 0; } 20% { opacity: 1; } 40% { opacity: .25; } 60% { opacity: 1; } 80% { opacity: .25; } 100% { opacity: 1; } }
    @keyframes ${id}-ring { 0% { opacity: .9; transform: scale(1); } 100% { opacity: 0; transform: scale(1.5); } }
    @keyframes ${id}-flk { from { transform: scaleY(1); } to { transform: scaleY(.8) scaleX(1.06); } }
    @keyframes ${id}-mar { from { stroke-dashoffset: 24; } to { stroke-dashoffset: 0; } }
    @keyframes ${id}-jig { 0%, 100% { transform: translate(0, 0); } 25% { transform: translate(3px, -3px); } 50% { transform: translate(-2px, 3px); } 75% { transform: translate(-3px, -1px); } }
    @keyframes ${id}-up { 0% { opacity: 0; transform: translateY(0); } 20%, 70% { opacity: 1; } 100% { opacity: 0; transform: translateY(var(--up, -60px)); } }
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
  // 칸마다 값이 바뀌는 transform. vals[0] 은 처음, vals[n] 은 n칸. null 은 그대로.
  const steps = (id, cls, vals, sec = 1.6, delay = 0.2) => `.sc-${id} .${cls} { transform: ${vals[0]}; transition: transform ${sec}s ease-in-out ${delay}s; }`
    + vals.slice(1).map((v, i) => v == null ? '' : `.on${i + 1} .sc-${id} .${cls} { transform: ${v}; }`).join('');
  // 칸 n 에서 delay 초 뒤 서서히 사라진다
  const fadeAt = (id, cls, n, delay = 0, sec = 0.6) => `.sc-${id} .${cls} { transition: opacity ${sec}s ease ${delay}s; } .on${n} .sc-${id} .${cls} { opacity: 0; }`;

  // ════ 1단원 자석의 이용 ════

  // ── 자석: 막대자석을 가까이 하면 철 클립과 철 못만 끌려 올라와 붙는다 ──
  (function () {
    const id = 't41-c1-jaseok';
    let css = base(id);
    let body = table(30, 610, 296);
    const X = [110, 250, 390, 530];
    const clip = (cx, cy) => `<path d="M${cx + 28} ${cy + 11} H${cx - 26} A11 11 0 0 1 ${cx - 26} ${cy - 11} H${cx + 24} A8 8 0 0 1 ${cx + 24} ${cy + 5} H${cx - 18} A5 5 0 0 1 ${cx - 18} ${cy - 5} H${cx + 14}" fill="none" stroke="${C.muted}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`;
    const nail = `<rect x="499" y="276" width="7" height="22" rx="2" fill="${C.line}" stroke="${C.muted}" stroke-width="2.5"/><path d="M506 284 H554 L568 287 L554 290 H506 Z" fill="${C.line}" stroke="${C.muted}" stroke-width="2.5" stroke-linejoin="round"/>`;
    const glass = `<circle cx="250" cy="279" r="17" fill="${C.sky}" stroke="${C.blue}" stroke-width="3"/><circle cx="244" cy="273" r="4.5" fill="white"/>`;
    body += at(1, 'fin', `<g class="it0">${clip(110, 284)}</g>`) + at(1, 'fin', glass, 0.1) + at(1, 'fin', woodBlock(362, 264, 56, 32), 0.2) + at(1, 'fin', `<g class="it1">${nail}</g>`, 0.3);
    [['철', C.ink], ['유리', C.blue], ['나무', C.orange], ['철', C.ink]].forEach(([name, color], k) => { body += at(1, 'fin', text(X[k], 340, name, { size: 20, color }), 0.2 + 0.1 * k); });
    // 세로로 든 막대자석(위 S, 아래 N)
    X.forEach((x, k) => { body += at(1, 'drop', `<g class="mg">${magnet(x - 20, 30, 40, 120, 'S', true)}</g>`, 0.15 * k); });
    css += steps(id, 'mg', ['none', null, 'translateY(80px)'], 1, 0.2)
      + steps(id, 'it0', ['none', null, 'translateY(-43px)'], 0.45, 1.15) + steps(id, 'it1', ['none', null, 'translateY(-46px)'], 0.45, 1.25);
    body += ring(110, 241, 42, 3, C.green, 0) + ring(530, 241, 42, 3, C.green, 0.2);
    body += shown(3, X.map((x) => lead(320, 70, x, 108, C.green)).join('')) + at(3, 'pop', tag(320, 50, '자석', OK, { size: 26 }), 0.4);
    put('4-1/과학/1/자석', svg(id, body, css));
  })();

  // ── 극: 빵 끈 조각 속 막대자석을 들어 올리면 양쪽 끝에 많이 붙는다. 같은 끝끼리 밀고 다른 끝끼리 당긴다 ──
  (function () {
    const id = 't41-c1-geuk';
    let css = base(id);
    const rnd = seeded(41127);
    const seg = (x, y) => { const a = rnd() * Math.PI, l = 7; return `M${f(x - l * Math.cos(a))} ${f(y - l * Math.sin(a))} L${f(x + l * Math.cos(a))} ${f(y + l * Math.sin(a))} `; };
    const segs = (d) => `<path d="${d}" stroke="${C.ink}" stroke-width="3.5" stroke-linecap="round"/>`;
    // 접시와 빵 끈 조각
    let stay = '', gone = '';
    for (let k = 0; k < 40; k++) {
      const a = rnd() * Math.PI * 2, r = Math.sqrt(rnd());
      const d = seg(320 + 185 * r * Math.cos(a), 304 + 19 * r * Math.sin(a));
      if (k % 3) gone += d; else stay += d;
    }
    let body = `<g class="h3"><ellipse cx="320" cy="304" rx="232" ry="36" fill="white" stroke="${C.muted}" stroke-width="3"/><ellipse cx="320" cy="304" rx="206" ry="27" fill="none" stroke="${C.line}" stroke-width="2.5"/>${segs(stay)}<g class="gone">${segs(gone)}</g></g>`;
    // 들어 올린 막대자석에 붙은 조각: 양쪽 끝에 수북이, 가운데엔 하나
    let stuck = '';
    [[170, 1], [470, -1]].forEach(([ex, s]) => {
      for (let k = 0; k < 15; k++) {
        const a = Math.PI / 2 + (k / 14) * Math.PI, r = 18 + rnd() * 26;
        stuck += seg(ex - s * Math.abs(r * Math.cos(a)) * (s > 0 ? 1 : 1), 135 + r * Math.sin(a));
      }
      [[18, 103], [36, 104], [22, 168], [42, 167]].forEach(([dx, y]) => { stuck += seg(ex + s * dx, y); });
    });
    stuck += seg(318, 167);
    body += `<g class="lift">${magnet(170, 110, 300, 50, 'N', false, 24)}<g class="stuck">${segs(stuck)}</g></g>`;
    css += `
      .on1 .sc-${id} .lift { animation: ${id}-lift 2s ease-in-out both; }
      .on1 .sc-${id} .stuck { animation: ${id}-stk 2s linear both; }
      .on1 .sc-${id} .gone { animation: ${id}-gone 2s linear both; }
      @keyframes ${id}-lift { 0% { transform: translateY(-50px); } 35%, 50% { transform: translateY(150px); } 100% { transform: none; } }
      @keyframes ${id}-stk { 0%, 40% { opacity: 0; } 46%, 100% { opacity: 1; } }
      @keyframes ${id}-gone { 0%, 40% { opacity: 1; } 46%, 100% { opacity: 0; } }`;
    // 2칸: 양쪽 끝은 많이, 가운데는 거의 없음
    body += ring(170, 135, 52, 2, C.green, 0) + ring(470, 135, 52, 2, C.green, 0.15);
    body += `<g class="b2 h4">${g('pop pop2', tag(170, 208, '많이', OK, { size: 19 }), 0.5)}${g('pop pop2', tag(320, 208, '거의 없음', GRAY, { size: 19 }), 0.7)}${g('pop pop2', tag(470, 208, '많이', OK, { size: 19 }), 0.9)}</g>`;
    // 3칸: 같은 끝끼리 밀어 내고, 다른 끝끼리 끌어당긴다
    body += at(3, 'fin', `<g class="pa">${magnet(30, 262, 120, 36, 'S', false, 19)}</g><g class="pb">${magnet(170, 262, 120, 36, 'N', false, 19)}</g>`, 0.2);
    body += at(3, 'fin', `<g class="pc">${magnet(350, 262, 120, 36, 'S', false, 19)}</g><g class="pd">${magnet(490, 262, 120, 36, 'S', false, 19)}</g>`, 0.2);
    css += steps(id, 'pa', ['translateX(9px)', null, null, 'none'], 0.7, 0.9) + steps(id, 'pb', ['translateX(-9px)', null, null, 'none'], 0.7, 0.9)
      + steps(id, 'pc', ['none', null, null, 'translateX(10px)'], 0.6, 0.9) + steps(id, 'pd', ['none', null, null, 'translateX(-10px)'], 0.6, 0.9);
    body += at(3, 'fin', arrow(112, 246, 58, 246, C.purple, '', 4) + arrow(208, 246, 262, 246, C.purple, '', 4) + text(160, 330, '밀어 냄', { size: 20, color: C.purple }), 1.0);
    body += at(3, 'fin', arrow(378, 246, 432, 246, C.green, '', 4) + arrow(582, 246, 528, 246, C.green, '', 4) + text(480, 330, '끌어당김', { size: 20, color: C.green }), 1.0);
    // 4칸: 두 끝이 극
    body += ring(170, 135, 52, 4, C.green, 0) + ring(470, 135, 52, 4, C.green, 0);
    body += at(4, 'pop', tag(170, 208, 'N극', NP, { size: 20 }), 0.2) + at(4, 'pop', tag(470, 208, 'S극', COLD, { size: 20 }), 0.3);
    body += shown(4, lead(298, 58, 190, 92, C.green) + lead(342, 58, 450, 92, C.green)) + at(4, 'pop', tag(320, 46, '극', OK, { size: 26 }), 0.5);
    put('4-1/과학/1/극', svg(id, body, css));
  })();

  // ── 나침반: 바늘은 북쪽을 가리키고, 자석을 대면 자석 쪽으로 돌았다가 치우면 되돌아온다 ──
  (function () {
    const id = 't41-c1-nachimban';
    let css = base(id);
    const cx = 250, cy = 185;
    let body = `<circle cx="${cx}" cy="${cy}" r="118" fill="white" stroke="${C.muted}" stroke-width="5"/><circle cx="${cx}" cy="${cy}" r="104" fill="none" stroke="${C.line}" stroke-width="2.5"/>`;
    body += text(cx, cy - 74, '북', { size: 22, color: C.red }) + text(cx, cy + 90, '남', { size: 22 }) + text(cx + 82, cy + 8, '동', { size: 22 }) + text(cx - 82, cy + 8, '서', { size: 22 });
    const needle = `<path d="M${cx} ${cy - 62} L${cx + 12} ${cy} H${cx - 12} Z" fill="${C.red}" stroke="${C.ink}" stroke-width="2" stroke-linejoin="round"/><path d="M${cx} ${cy + 62} L${cx + 12} ${cy} H${cx - 12} Z" fill="${C.blue}" stroke="${C.ink}" stroke-width="2" stroke-linejoin="round"/><circle cx="${cx}" cy="${cy}" r="6" fill="${C.ink}"/>`;
    body += `<g class="nd2"><g class="nd">${needle}</g></g>`;
    css += `.sc-${id} .nd, .sc-${id} .nd2 { transform-box: view-box; transform-origin: ${cx}px ${cy}px; }
      .on1 .sc-${id} .nd { animation: ${id}-sw 2s ease-in-out both; }
      @keyframes ${id}-sw { 0% { transform: rotate(80deg); } 25% { transform: rotate(-45deg); } 45% { transform: rotate(25deg); } 65% { transform: rotate(-12deg); } 82% { transform: rotate(5deg); } 100% { transform: none; } }`
      + steps(id, 'nd2', ['none', null, 'rotate(-90deg)', 'none'], 0.9, 0.9);
    body += ring(cx, cy - 81, 20, 1, C.red, 1.5);
    // 막대자석(N극이 나침반 쪽)
    body += `<g class="mv">${magnet(405, 163, 190, 44, 'N', false, 22)}</g>`;
    css += steps(id, 'mv', ['translateX(260px)', null, 'none', 'translateX(260px)'], 1.1, 0.1);
    body += ring(cx + 52, cy, 16, 2, C.blue, 1.4);
    body += `<g class="b4"><circle class="flash flash4" cx="${cx}" cy="${cy}" r="118" fill="none" stroke="${C.green}" stroke-width="6"/></g>`;
    body += shown(4, lead(452, 185, 372, 185, C.green)) + at(4, 'pop', tag(518, 185, '나침반', OK, { size: 24 }), 0.4);
    put('4-1/과학/1/나침반', svg(id, body, css));
  })();

  // ════ 2단원 물의 상태 변화 ════

  // ── 상태 변화: 얼음 → 물 → 수증기, 거꾸로 수증기 → 물 → 얼음 ──
  (function () {
    const id = 't41-c2-sangtae';
    let css = base(id);
    let body = '';
    body += at(1, 'pop', ice(72, 112, 76));
    body += at(1, 'fin', arc(165, 122, 215, 70, 268, 122, C.orange), 0.5) + at(1, 'drop', drop(320, 172, 34), 1.0);
    let vap = '';
    [[500, 122], [540, 112], [572, 136], [512, 160], [550, 158], [488, 190], [532, 192], [570, 178]].forEach(([x, y], k) => { vap += jig(x, y, k, C.blue, 10); });
    body += at(2, 'fin', arc(372, 122, 425, 70, 478, 122, C.orange), 0) + at(2, 'fin', vap, 0.6);
    [[110, '얼음', '고체', 1, 0.2], [320, '물', '액체', 1, 1.2], [530, '수증기', '기체', 2, 0.8]].forEach(([x, name, st, n, s]) => {
      body += at(n, 'fin', text(x, 238, name, { size: 22 }) + text(x, 266, st, { size: 18, color: C.muted, weight: 600 }), s);
    });
    body += at(3, 'fin', arc(478, 292, 425, 344, 372, 292, C.blue), 0.2) + at(3, 'fin', arc(268, 292, 215, 344, 165, 292, C.blue), 0.8);
    ['M165 122 Q215 70 268 122', 'M372 122 Q425 70 478 122', 'M478 292 Q425 344 372 292', 'M268 292 Q215 344 165 292'].forEach((d, k) => { body += glowPath(d, 4, C.green, 0.15 * k, 9); });
    body += at(4, 'pop', tag(320, 36, '상태 변화', OK, { size: 24 }), 0.6);
    put('4-1/과학/2/상태 변화', svg(id, body, css));
  })();

  // ── 고체: 얼음 틀에서 꺼낸 얼음 조각은 틀 모양 그대로이고, 접시 위에 쌓을 수 있다 ──
  (function () {
    const id = 't41-c2-goche';
    let css = base(id);
    let body = `<path d="M60 222 V286 Q60 292 66 292 H264 Q270 292 270 286 V222 M130 228 V292 M200 228 V292" fill="none" stroke="${C.purple}" stroke-width="4" stroke-linejoin="round"/>`;
    body = `<path d="M60 222 V286 Q60 292 66 292 H264 Q270 292 270 286 V222 Z" fill="${C.lilac}"/>` + body;
    body += text(165, 330, '얼음 틀', { size: 19, color: C.purple });
    body += `<path d="M380 290 Q390 304 480 304 Q570 304 580 290 Z" fill="white" stroke="${C.muted}" stroke-width="3" stroke-linejoin="round"/><path d="M370 290 H590" stroke="${C.muted}" stroke-width="5" stroke-linecap="round"/>`;
    body += text(480, 334, '접시', { size: 19, color: C.muted });
    // 떠난 자리에 남는 점선 테두리
    [69, 139, 209].forEach((x, k) => { body += at(1, 'fin', `<rect x="${x}" y="236" width="52" height="52" rx="7" fill="none" stroke="${C.blue}" stroke-width="3" stroke-dasharray="7 5"/>`, 0.9 + 0.2 * k); });
    // 얼음 조각: 꺼내서(1칸) 접시에 쌓는다(2칸)
    const to = [[357, 2], [343, 2], [245, -50]];
    [69, 139, 209].forEach((x, k) => {
      body += `<g class="cb${k}">${ice(x, 236, 52)}</g>`;
      css += `.sc-${id} .cb${k} { transition: transform .8s ease-in-out ${f(0.2 * k)}s; } .on1 .sc-${id} .cb${k} { transform: translateY(-120px); }`
        + `.on2 .sc-${id} .cb${k} { transform: translate(${to[k][0]}px, ${to[k][1]}px); transition: transform .9s ease-in-out ${f(0.2 + 0.5 * k)}s; }`;
    });
    body += glowRect(421, 181, 118, 114, 3, C.green, 0.2, 10);
    [69, 139, 209].forEach((x, k) => { body += glowRect(x - 3, 233, 58, 58, 3, C.blue, 0.2 + 0.15 * k, 9); });
    body += at(3, 'pop', tag(165, 180, '모양 그대로', COLD, { size: 20 }), 0.6) + at(3, 'pop', tag(480, 120, '고체', OK, { size: 26 }), 0.9);
    put('4-1/과학/2/고체', svg(id, body, css));
  })();

  // ── 액체: 얼음이 녹은 물은 접시에 납작하게 퍼지고, 기울이면 흘러 컵 모양대로 담긴다 ──
  (function () {
    const id = 't41-c2-aekche';
    let css = base(id);
    let body = '';
    const dish = `<path d="M40 190 Q50 230 190 230 Q330 230 340 190 Z" fill="white" stroke="${C.muted}" stroke-width="3.5" stroke-linejoin="round"/>`
      + `<g class="pd"><g class="pd2"><path d="M56 204 Q74 225 190 225 Q306 225 324 204 Z" fill="${C.sky}"/><path d="M56 204 H324" stroke="${C.blue}" stroke-width="3"/></g></g>`
      + `<g class="ic">${ice(155, 154, 70)}</g><path d="M32 190 H348" stroke="${C.muted}" stroke-width="5" stroke-linecap="round"/>`;
    body += `<g class="tilt">${dish}</g>`;
    css += `.sc-${id} .tilt { transform-box: view-box; transform-origin: 340px 190px; }` + steps(id, 'tilt', ['none', null, 'rotate(20deg)'], 0.7, 0.1)
      + `.sc-${id} .ic, .sc-${id} .icl { transform-box: fill-box; transform-origin: 50% 100%; transition: transform 1.6s ease-in .3s, opacity .4s ease 1.6s; } .on1 .sc-${id} .ic { transform: scaleY(.05); opacity: 0; } .on1 .sc-${id} .icl { opacity: 0; }`
      + `.sc-${id} .pd { transform-box: fill-box; transform-origin: 50% 0; transform: scaleX(.3); opacity: 0; transition: transform 1.4s ease-out .6s, opacity .4s ease .5s; }`
      + `.on1 .sc-${id} .pd { transform: none; opacity: 1; }`
      + `.sc-${id} .pd2 { transform-box: fill-box; transform-origin: 100% 0; }` + steps(id, 'pd2', ['none', null, 'scaleX(0)'], 1.4, 0.7)
      + `.on2 .sc-${id} .st { animation: ${id}-st 3s linear both; } @keyframes ${id}-st { 0%, 15% { opacity: 0; } 25%, 88% { opacity: 1; } 100% { opacity: 0; } }`;
    body += at(1, 'fin', `<g class="icl">${text(110, 180, '얼음', { size: 19, color: C.blue })}</g>`, 0) + `<g class="h2">${at(1, 'pop', tag(190, 264, '물', COLD, { size: 20 }), 1.6)}</g>`;
    // 2칸: 흘러서 컵으로
    body += `<g class="lv cw"><rect x="403" y="262" width="114" height="72" fill="${C.sky}"/><path d="M403 262 H517" stroke="${C.blue}" stroke-width="3"/></g>`;
    css += steps(id, 'cw', ['scaleY(0)', null, 'none'], 1.6, 0.8);
    body += shown(2, `<g class="st"><path class="mar" d="M346 196 Q420 190 452 262" stroke="${C.blue}" stroke-width="6" stroke-dasharray="14 10" stroke-linecap="round" fill="none"/></g>`);
    body += openLine(400, 206, 520, 337);
    body += `<g class="st">${at(2, 'pop', tag(440, 150, '흐름', COLD, { size: 20 }), 0.6)}</g>`;
    body += glowPath('M403 262 H517 V334 H403 Z', 3, C.green, 0.2, 5) + at(3, 'pop', tag(586, 300, '컵 모양', COLD, { size: 19 }), 0.5) + at(3, 'pop', tag(586, 220, '액체', OK, { size: 26 }), 0.8);
    put('4-1/과학/2/액체', svg(id, body, css));
  })();

  // ── 기체: 뚜껑 닫은 병 속 물에서 생긴 수증기가 사방으로 퍼져 병 안을 가득 채운다 ──
  (function () {
    const id = 't41-c2-giche';
    let css = base(id);
    const jar = 'M280 58 V84 Q280 108 236 112 H210 Q182 112 182 140 V290 Q182 310 202 310 H438 Q458 310 458 290 V140 Q458 112 430 112 H404 Q360 108 360 84 V58';
    let body = `<defs><clipPath id="${id}-c"><path d="${jar} Z"/></clipPath></defs>`;
    body += `<path d="${jar} Z" fill="white"/><g clip-path="url(#${id}-c)"><rect x="176" y="272" width="288" height="44" fill="${C.sky}"/><path d="M176 272 H464" stroke="${C.blue}" stroke-width="3"/></g>`;
    body += text(320, 300, '물', { size: 20, color: C.blue });
    // 수증기: 처음엔 물 표면 가까이, 2칸에 병 속 구석구석으로
    const rnd = seeded(4127), pts = [];
    const inside = (x, y) => (x > 200 && x < 440 && y > 132 && y < 256) || (x > 296 && x < 344 && y > 70 && y < 112);
    for (let t = 0; t < 2000 && pts.length < 24; t++) {
      const x = 196 + rnd() * 248, y = 66 + rnd() * 194;
      if (inside(x, y) && pts.every(([a, b]) => Math.hypot(a - x, b - y) >= 34)) pts.push([x, y]);
    }
    let vap = '';
    pts.forEach(([x, y], k) => {
      const sx = 320 + (x - 320) * 0.85, sy = 200 + (y - 66) * 0.3;
      vap += `<g class="vp" style="--dx:${f(sx - x)}px;--dy:${f(sy - y)}px;transition-delay:${f(rnd() * 0.5)}s">${jig(x, y, k, C.blue, 9)}</g>`;
    });
    body += at(1, 'fin', vap, 0.4);
    css += `.sc-${id} .vp { transform: translate(var(--dx), var(--dy)); transition: transform 2s ease-in-out; } .on2 .sc-${id} .vp { transform: none; }`;
    body += `<path class="rim" d="${jar}" fill="none" stroke="${C.blue}" stroke-width="4" stroke-linejoin="round"/><rect x="270" y="42" width="100" height="18" rx="5" fill="${C.line}" stroke="${C.muted}" stroke-width="3"/>`;
    body += at(1, 'pop', tag(552, 250, '수증기', GRAY, { size: 20, dash: true }), 1.0) + shown(1, lead(506, 250, 462, 250, C.muted));
    body += at(2, 'pop', tag(552, 190, '안 보임', GRAY, { size: 19, dash: true }), 1.6);
    body += glowPath(`${jar} Z`, 3, C.green, 0.2, 6) + at(3, 'pop', tag(552, 110, '기체', OK, { size: 26 }), 0.6);
    put('4-1/과학/2/기체', svg(id, body, css));
  })();

  // ── 수증기: 물로 쓰는 종이에 그린 그림이 사라진다. 물이 보이지 않는 수증기가 되어 날아간다 ──
  (function () {
    const id = 't41-c2-sujeunggi';
    let css = base(id);
    let body = `<rect x="60" y="100" width="380" height="210" rx="8" fill="white" stroke="${C.line}" stroke-width="3"/>`;
    const heart = 'M250 266 C178 220 168 162 210 150 C232 144 246 160 250 178 C254 160 268 144 290 150 C332 162 322 220 250 266 Z';
    body += `<g class="hf"><path class="draw draw1" pathLength="1" d="${heart}" fill="none" stroke="${C.muted}" stroke-width="15" stroke-linejoin="round" stroke-linecap="round"/></g>`;
    css += fadeAt(id, 'hf', 2, 0.3, 2);
    body += at(1, 'fin', text(250, 90, '물로 그린 그림', { size: 19, color: C.muted }), 0.3).replace('class="b1"', 'class="b1 h2"');
    let vap = '';
    [[208, 152], [292, 152], [186, 196], [314, 196], [222, 236], [278, 236], [250, 178], [250, 262], [200, 172], [300, 172]].forEach(([x, y], k) => { vap += rise(x, y, f(0.25 * k), { up: -110, dur: 2.6, r: 9 }); });
    body += shown(2, vap, 3);
    // 3칸: 날아간 수증기는 공기 중에 흩어져 있다
    let air = '';
    [[96, 40], [176, 64], [262, 34], [348, 58], [420, 30], [130, 150], [370, 170], [220, 236], [310, 276], [404, 250]].forEach(([x, y], k) => { air += jig(x, y, k, C.blue, 9); });
    body += at(3, 'fin', air, 0.2);
    body += at(2, 'pop', tag(555, 110, '수증기', GRAY, { size: 20, dash: true }), 1.0) + shown(2, lead(509, 110, 470, 110, C.muted), 3);
    body += at(2, 'pop', tag(555, 150, '안 보임', GRAY, { size: 18, dash: true }), 1.3);
    body += at(3, 'pop', tag(555, 290, '물', COLD, { size: 20 }), 0.2) + shown(3, flow([[555, 266], [555, 176]], C.blue, { w: 5 }));
    put('4-1/과학/2/수증기', svg(id, body, css));
  })();

  // ── 부피: 시험관 속 물을 얼리면 높이가 올라가고, 녹이면 처음 높이로 돌아온다 ──
  (function () {
    const id = 't41-c2-bupi';
    let css = base(id);
    const tube = (x) => `M${x - 32} 66 V258 A32 32 0 0 0 ${x + 32} 258 V66`;
    let body = `<defs>${[100, 290, 480].map((x, k) => `<clipPath id="${id}-c${k}"><path d="${tube(x)} Z"/></clipPath>`).join('')}</defs>`;
    const fill = (x, k, top, isIce, n, cls) => {
      let inner = `<rect x="${x - 34}" y="${top}" width="68" height="${294 - top}" fill="${C.sky}"/>`;
      if (isIce) inner += `<path d="M${x - 30} ${top + 30} L${x - 4} ${top + 12} M${x + 6} ${top + 56} L${x + 30} ${top + 34} M${x - 26} ${top + 86} L${x + 4} ${top + 64} M${x - 10} ${top + 110} L${x + 22} ${top + 92}" stroke="white" stroke-width="4" stroke-linecap="round"/>`;
      inner += `<path d="M${x - 34} ${top} H${x + 34}" stroke="${C.blue}" stroke-width="3"/>`;
      return `<g class="b${n}"><g clip-path="url(#${id}-c${k})"><g class="lv ${cls}">${inner}</g></g></g>`;
    };
    body += fill(100, 0, 190, false, 1, 'f0') + fill(290, 1, 172, true, 2, 'f1') + fill(480, 2, 190, false, 3, 'f2');
    css += steps(id, 'f0', ['scaleY(0)', 'none'], 1.2, 0.2) + steps(id, 'f1', ['scaleY(.88)', null, 'none'], 1.4, 0.6) + steps(id, 'f2', ['scaleY(1.12)', null, null, 'none'], 1.4, 0.6);
    [100, 290, 480].forEach((x, k) => { body += at(k + 1, 'fin', `<path d="${tube(x)}" fill="none" stroke="${C.muted}" stroke-width="4" stroke-linejoin="round"/><path d="M${x - 40} 66 H${x + 40}" stroke="${C.muted}" stroke-width="5" stroke-linecap="round"/>`); });
    [[100, '물', 1], [290, '얼음', 2], [480, '물', 3]].forEach(([x, name, n]) => { body += at(n, 'fin', text(x, 330, name, { size: 20, color: C.blue }), 0.2); });
    body += at(1, 'fin', `<path d="M60 190 H520" stroke="${C.red}" stroke-width="3" stroke-dasharray="9 6"/>` + text(195, 180, '처음 높이', { size: 18, color: C.red }), 1.3);
    body += at(2, 'fin', arrow(142, 120, 246, 120, C.blue, '', 4) + text(195, 106, '얼리기', { size: 18, color: C.blue }), 0);
    body += at(3, 'fin', arrow(332, 120, 436, 120, C.orange, '', 4) + text(385, 106, '녹이기', { size: 18, color: C.orange }), 0);
    body += at(2, 'pop', tag(372, 156, '늘어남', COLD, { size: 19 }), 1.8) + at(3, 'pop', tag(564, 156, '줄어듦', COLD, { size: 19 }), 1.8);
    [[100, 190], [290, 172], [480, 190]].forEach(([x, top], k) => { body += glowPath(`M${x - 32} ${top} V258 A32 32 0 0 0 ${x + 32} 258 V${top} Z`, 4, C.green, 0.2 * k, 5); });
    body += at(4, 'pop', tag(290, 36, '부피', OK, { size: 26 }), 0.6);
    put('4-1/과학/2/부피', svg(id, body, css));
  })();

  // ── 증발: 페트리접시에 퍼진 물 한 방울이 표면에서 천천히 수증기가 되어 사라진다 ──
  (function () {
    const id = 't41-c2-jeungbal';
    let css = base(id);
    let body = `<path d="M100 256 V270 A220 46 0 0 0 540 270 V256" fill="white" stroke="${C.muted}" stroke-width="3.5"/><ellipse cx="320" cy="256" rx="220" ry="46" fill="white" stroke="${C.muted}" stroke-width="3.5"/><ellipse cx="320" cy="262" rx="200" ry="36" fill="none" stroke="${C.line}" stroke-width="2.5"/>`;
    const blob = 'M190 262 C190 242 258 238 320 240 C388 238 452 246 450 262 C448 280 380 286 318 285 C252 286 190 280 190 262 Z';
    body += `<g class="pd"><path d="${blob}" fill="${C.sky}" stroke="${C.blue}" stroke-width="3"/></g>`;
    css += `.sc-${id} .pd { transform-box: fill-box; transform-origin: center; }` + steps(id, 'pd', ['scale(.08)', 'none', null, 'scale(0)'], 1.6, 0.6);
    // 1칸: 스포이트로 한 방울
    body += shown(1, `<rect x="312" y="62" width="16" height="70" rx="3" fill="white" stroke="${C.muted}" stroke-width="3"/><path d="M320 140 L312 132 H328 Z" fill="white" stroke="${C.muted}" stroke-width="3" stroke-linejoin="round"/><ellipse cx="320" cy="48" rx="17" ry="20" fill="${C.orange}" stroke="${C.ink}" stroke-width="2.5"/>`, 2);
    body += shown(1, `<g class="dr">${drop(320, 160, 9)}</g>`, 2);
    css += `.on1 .sc-${id} .dr { animation: ${id}-dr .7s ease-in both; }
      @keyframes ${id}-dr { 0% { opacity: 1; transform: none; } 90% { opacity: 1; transform: translateY(92px); } 100% { opacity: 0; transform: translateY(96px); } }`;
    // 2칸: 표면에서 수증기가 천천히 오른다
    let vap = '';
    [[240, 250], [300, 246], [360, 246], [420, 252], [270, 258], [390, 258]].forEach(([x, y], k) => { vap += rise(x, y, f(0.5 * k), { up: -120, dur: 3, r: 9 }); });
    body += shown(2, `<g class="vg">${vap}</g>`);
    css += fadeAt(id, 'vg', 3, 1.4, 0.6);
    body += `<g class="h3">${at(2, 'pop', tag(110, 176, '물 표면', COLD, { size: 19 }), 0.4)}${shown(2, lead(130, 194, 196, 250, C.blue))}</g>`;
    body += `<g class="h3">${at(2, 'pop', tag(540, 120, '수증기', GRAY, { size: 20, dash: true }), 1.2)}${shown(2, lead(494, 124, 440, 150, C.muted))}</g>`;
    // 3칸: 처음 자리만 점선으로 남는다
    body += at(3, 'fin', `<path d="${blob}" fill="none" stroke="${C.blue}" stroke-width="3" stroke-dasharray="8 6"/>`, 1.6);
    body += glowPath(blob, 4, C.green, 0.2, 5) + at(4, 'pop', tag(320, 60, '증발', OK, { size: 26 }), 0.6);
    put('4-1/과학/2/증발', svg(id, body, css));
  })();

  // ── 끓음: 가만히 둔 물(증발)과 가열한 물(끓음)을 견준다. 끓는 물은 물속에서도 기포가 생긴다 ──
  (function () {
    const id = 't41-c2-kkeueum';
    let css = base(id);
    let body = table(40, 260, 302);
    body += `<path d="M335 302 H525 M360 302 L348 350 M500 302 L512 350" stroke="${C.muted}" stroke-width="5" stroke-linecap="round"/>`;
    // 왼쪽: 가만히 둔 물
    body += `<rect x="73" y="190" width="154" height="108" fill="${C.sky}"/><path d="M73 190 H227" stroke="${C.blue}" stroke-width="3"/>`;
    let lv = '';
    [[110, 186], [160, 186], [200, 186]].forEach(([x, y], k) => { lv += rise(x, y, f(1.1 * k), { up: -58, dur: 3.4, r: 8 }); });
    body += shown(2, lv);
    // 오른쪽: 가열한 물
    body += `<g class="lv wR"><rect x="353" y="190" width="154" height="108" fill="${C.sky}"/></g>`;
    let bub = '', rv = '';
    [[372, 292, 5, -50], [394, 294, 7, -58], [418, 290, 4, -44], [440, 294, 8, -60], [462, 292, 5, -52], [486, 294, 6, -56], [406, 292, 6, -48], [452, 292, 4, -46], [430, 294, 5, -54]].forEach(([x, y, r, up], k) => {
      bub += rise(x, y, f(0.17 * k), { up, dur: 1.3, r, bubble: true });
    });
    [[372, 186], [404, 186], [436, 186], [468, 186], [492, 186], [388, 186], [452, 186]].forEach(([x, y], k) => { rv += rise(x, y, f(0.2 * k), { up: -96, dur: 1.5, r: 8 }); });
    body += `<g class="sR"><path d="M353 190 H507" stroke="${C.blue}" stroke-width="3"/>${shown(3, rv)}</g>` + shown(3, bub);
    css += steps(id, 'wR', ['none', null, null, 'scaleY(.7)'], 2, 0.3) + steps(id, 'sR', ['none', null, null, 'translateY(32px)'], 2, 0.3);
    body += openLine(70, 110, 230, 300) + openLine(350, 110, 510, 300);
    body += `<path d="M60 190 H240 M340 190 H520" stroke="${C.red}" stroke-width="2.5" stroke-dasharray="8 6"/>`;
    body += at(1, 'fin', flame(430, 348, 40, 18), 0.3);
    body += at(1, 'pop', tag(150, 50, '가만히 둠', GRAY, { size: 20 }), 0.2) + at(1, 'pop', tag(430, 50, '가열함', HOT, { size: 20 }), 0.4);
    body += at(2, 'pop', tag(150, 94, '증발', OK, { size: 22 }), 1.4);
    body += at(3, 'pop', tag(584, 286, '기포', COLD, { size: 20 }), 1.0) + shown(3, lead(550, 286, 500, 276, C.blue));
    body += ring(430, 262, 58, 4, C.orange, 0) + at(4, 'pop', tag(584, 200, '끓음', HOT, { size: 26 }), 0.5);
    put('4-1/과학/2/끓음', svg(id, body, css));
  })();

  // ── 응결: 얼음이 든 비커 바깥면에 공기 중의 수증기가 물방울로 맺힌다. 닦아 보면 색깔이 없다 ──
  (function () {
    const id = 't41-c2-eunggyeol';
    let css = base(id);
    let body = table(40, 600, 302);
    body += `<rect x="243" y="160" width="154" height="138" fill="${C.purple}" fill-opacity=".32"/><path d="M243 160 H397" stroke="${C.purple}" stroke-width="3"/>`;
    body += ice(258, 140, 40, -8) + ice(306, 146, 38, 10) + ice(352, 138, 36, -4);
    body += openLine(240, 120, 400, 300, C.muted);
    body += `<rect x="222" y="108" width="196" height="12" rx="3" fill="${C.sky}" stroke="${C.blue}" stroke-width="2.5"/>`;
    // 수증기가 바깥면으로 모여 물방울이 된다
    const rnd = seeded(4170);
    const spots = [];
    [178, 206, 234, 262, 288].forEach((y, k) => { spots.push([231, y + (k % 2) * 6, 'L']); spots.push([409, y + ((k + 1) % 2) * 6, 'R']); });
    let vapor = '', dL = '', dR = '';
    spots.forEach(([x, y, side], k) => {
      const sx = side === 'L' ? 60 + rnd() * 120 : 460 + rnd() * 130, sy = 80 + rnd() * 200;
      vapor += `<g class="vd" style="--x:${f(sx - x)}px;--y:${f(sy - y)}px;transition-delay:${f(rnd() * 0.5)}s"><g class="vc">${jig(x, y, k, C.blue, 8)}</g></g>`;
      const d = at(2, 'pop', drop(x, y, 6), f(1.6 + 0.06 * k));
      if (side === 'L') dL += d; else dR += d;
    });
    body += vapor + dL + `<g class="dR">${dR}</g>`;
    css += `.sc-${id} .vd { transform: translate(var(--x), var(--y)); transition: transform 1.5s ease-in-out; } .on2 .sc-${id} .vd { transform: none; }`
      + fadeAt(id, 'vc', 2, 1.6, 0.4) + fadeAt(id, 'dR', 3, 0.9, 0.3);
    body += at(1, 'pop', tag(110, 46, '수증기', GRAY, { size: 20, dash: true }), 0.6).replace('class="b1"', 'class="b1 h3"');
    body += at(2, 'pop', tag(110, 336, '물방울', COLD, { size: 20 }), 2) + shown(2, lead(140, 320, 224, 290, C.blue));
    // 3칸: 화장지로 오른쪽 물방울을 닦는다
    body += `<g class="b3"><g class="tis"><rect x="404" y="150" width="72" height="84" rx="4" fill="white" stroke="${C.muted}" stroke-width="3"/><path d="M404 192 H476" stroke="${C.line}" stroke-width="2.5" stroke-dasharray="6 5"/><g class="wet"><ellipse cx="428" cy="200" rx="16" ry="22" fill="${C.sky}" stroke="${C.blue}" stroke-width="1.5" stroke-dasharray="4 3"/></g></g></g>`;
    css += `.on3 .sc-${id} .tis { animation: ${id}-tis 1.8s ease-in-out both; }
      .on3 .sc-${id} .wet { animation: ${id}-wet 1.8s linear both; }
      @keyframes ${id}-tis { 0% { transform: translate(0, -20px); } 50% { transform: translate(0, 66px); } 100% { transform: translate(116px, 30px); } }
      @keyframes ${id}-wet { 0%, 40% { opacity: 0; } 60%, 100% { opacity: 1; } }`;
    body += at(3, 'pop', tag(556, 142, '색깔 없음', GRAY, { size: 18 }), 1.8);
    body += glowRect(216, 160, 32, 140, 4, C.green, 0.2, 12) + at(4, 'pop', tag(320, 50, '응결', OK, { size: 26 }), 0.6);
    put('4-1/과학/2/응결', svg(id, body, css));
  })();
})(typeof window !== 'undefined' ? window : globalThis);
