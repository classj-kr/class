// 과학 3-1 2단원 「동물의 생활」·3단원 「식물의 생활」 낱말 도식: 지느러미·물갈퀴(헤엄치는 몸의 생김새)와 잎의 생김새(가장자리·톱니·잎자루).
// 물은 하늘색 바탕(C.sky), 몸통은 회녹색, 따로 보여 줄 부분(지느러미·물갈퀴)은 다른 색으로 칠해 몸통과 구별한다.
// 잎은 연두(C.mint) 바탕에 초록 테두리, 잎맥은 초록 가는 선. 벚나무 잎은 가장자리가 톱니 모양, 강아지풀 잎은 길쭉하고 매끈하다(교과서).
// 강아지풀 잎은 잎자루 없이 줄기에 바로 붙는다(아이스크림 '잎자루가 있는가?' 분류).
// 움직임은 transform·opacity·stroke-dashoffset 만 쓴다.
(function (root) {
  'use strict';
  const { C, svg, text, put } = root.FigureKit;
  const f = (n) => +(+n).toFixed(1);
  const dl = (s) => (s ? ` style="animation-delay:${s}s"` : '');
  const g = (cls, inner, s = 0) => `<g class="${cls}"${dl(s)}>${inner}</g>`;
  const at = (n, kind, inner, s = 0) => `<g class="b${n}">${g(`${kind} ${kind}${n}`, inner, s)}</g>`;
  const shown = (n, inner, hide) => `<g class="b${n}${hide ? ' h' + hide : ''}">${inner}</g>`;
  const tw = (s, size) => [...String(s)].reduce((a, c) => a + (/[가-힣]/.test(c) ? 1 : c === ' ' ? 0.3 : 0.6), 0) * size;
  const HOT = [C.peach, C.orange], OK = [C.mint, C.green], COLD = [C.sky, C.blue], GRAY = ['white', C.muted];
  const tag = (cx, cy, label, [fill, stroke] = OK, { size = 20 } = {}) => {
    const w = Math.round(tw(label, size) + size * 1.3), h = Math.round(size * 1.7);
    return `<g><rect x="${f(cx - w / 2)}" y="${f(cy - h / 2)}" width="${w}" height="${h}" rx="${h / 2}" fill="${fill}" stroke="${stroke}" stroke-width="2.5"/>${text(f(cx), f(cy + size * 0.36), label, { size })}</g>`;
  };
  const lead = (x1, y1, x2, y2, color = C.muted) => `<path d="M${f(x1)} ${f(y1)} L${f(x2)} ${f(y2)}" stroke="${color}" stroke-width="2.5" stroke-linecap="round"/>`;
  const head = (x, y, ang, color, w = 4) => {
    const l = 8 + w * 1.4, p = (d) => `${f(x - l * Math.cos(ang + d))} ${f(y - l * Math.sin(ang + d))}`;
    return `<path d="M${p(-0.5)} L${f(x)} ${f(y)} L${p(0.5)}" stroke="${color}" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  };
  // 흐르는 화살표(점선이 끝 쪽으로 흐른다)
  const flow = (x1, y1, x2, y2, color, w = 5) => {
    const ang = Math.atan2(y2 - y1, x2 - x1);
    return `<g><path class="mar" d="M${f(x1)} ${f(y1)} L${f(x2 - w * Math.cos(ang))} ${f(y2 - w * Math.sin(ang))}" stroke="${color}" stroke-width="${w}" stroke-dasharray="12 9" stroke-linecap="round" fill="none"/>${head(x2, y2, ang, color, w)}</g>`;
  };
  const ring = (cx, cy, r, n, color = C.green, s = 0) => `<g class="b${n}"><circle class="ring ring${n}"${dl(s)} cx="${f(cx)}" cy="${f(cy)}" r="${r}" fill="none" stroke="${color}" stroke-width="4"/></g>`;
  const pts = (list) => list.map(([x, y], i) => `${i ? 'L' : 'M'}${f(x)} ${f(y)}`).join(' ');
  const rot = (cx, cy, deg) => `translate(${cx}px, ${cy}px) rotate(${deg}deg) translate(${-cx}px, ${-cy}px)`;

  const base = (id) => {
    let s = `
    .sc-${id} .pop, .sc-${id} .pulse, .sc-${id} .ring { transform-box: fill-box; transform-origin: center; }
    .sc-${id} .ring { opacity: 0; }
    .sc-${id} .mar { animation: ${id}-mar .7s linear infinite; }
    .sc-${id} .draw { stroke-dasharray: 1; stroke-dashoffset: 1; transition: stroke-dashoffset 1.5s ease-in-out .2s; }
    @keyframes ${id}-pop { 0% { opacity: 0; transform: scale(.3); } 70% { opacity: 1; transform: scale(1.12); } 100% { opacity: 1; transform: scale(1); } }
    @keyframes ${id}-fin { from { opacity: 0; } to { opacity: 1; } }
    @keyframes ${id}-rise { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
    @keyframes ${id}-pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.15); } }
    @keyframes ${id}-flash { 0% { opacity: 0; } 20% { opacity: 1; } 40% { opacity: .25; } 60% { opacity: 1; } 80% { opacity: .25; } 100% { opacity: 1; } }
    @keyframes ${id}-ring { 0% { opacity: .9; transform: scale(1); } 100% { opacity: 0; transform: scale(1.6); } }
    @keyframes ${id}-mar { from { stroke-dashoffset: 21; } to { stroke-dashoffset: 0; } }
    `;
    for (let n = 1; n <= 5; n++) s += `
    .on${n} .sc-${id} .pop${n} { animation: ${id}-pop .5s ease-out both; }
    .on${n} .sc-${id} .fin${n} { animation: ${id}-fin .5s ease-out both; }
    .on${n} .sc-${id} .rise${n} { animation: ${id}-rise .5s ease-out both; }
    .on${n} .sc-${id} .pulse${n} { animation: ${id}-pulse .6s ease-in-out both; }
    .on${n} .sc-${id} .flash${n} { animation: ${id}-flash 1.4s ease-in-out both; }
    .on${n} .sc-${id} .ring${n} { animation: ${id}-ring 1.1s ease-out .3s 2; }
    .on${n} .sc-${id} .draw${n} { stroke-dashoffset: 0; }`;
    return s;
  };
  const steps = (id, cls, vals, sec = 1.2, delay = 0.2) => `.sc-${id} .${cls} { transform: ${vals[0]}; transition: transform ${sec}s ease-in-out ${delay}s; }`
    + vals.slice(1).map((v, i) => v == null ? '' : `.on${i + 1} .sc-${id} .${cls} { transform: ${v}; }`).join('');

  // ════ 2단원 동물의 생활 ════

  // ── 지느러미: 붕어 몸에 붙은 납작한 부분들, 흔들어 물을 밀며 앞으로 나아간다 ──
  (function () {
    const id = 't31-s2-jineurami';
    let css = base(id);
    let body = `<rect width="640" height="360" fill="${C.sky}"/>`;
    // 물결(뒤로 흐르는 물)
    body += `<g class="b2">${[90, 300].map((y, k) => `<path class="mar" d="M${470 + k * 20} ${y} H${600 + k * 10}" stroke="white" stroke-width="5" stroke-dasharray="12 9" stroke-linecap="round"/>`).join('')}</g>`;
    const FIN = `fill="${C.peach}" stroke="${C.orange}" stroke-width="3" stroke-linejoin="round"`;
    const tail = `<path d="M452 172 L528 118 Q512 180 528 242 L452 190 Z" ${FIN}/><path d="M462 178 L512 140 M462 184 L512 222" stroke="${C.orange}" stroke-width="2" opacity=".7"/>`;
    const dorsal = `<path d="M292 118 Q322 70 372 82 Q392 100 404 132 Z" ${FIN}/>`;
    const pect = `<path d="M262 206 Q300 214 318 246 Q286 246 262 220 Z" ${FIN}/>`;
    const pelvic = `<path d="M336 240 Q350 262 370 270 Q376 252 366 236 Z" ${FIN}/>`;
    const anal = `<path d="M404 222 Q414 250 440 252 Q440 230 430 212 Z" ${FIN}/>`;
    const bodyShape = `<path d="M190 182 Q214 128 300 116 Q400 106 456 172 L456 190 Q400 246 300 244 Q214 238 190 182 Z" fill="${C.line}" stroke="${C.green}" stroke-width="3.5" stroke-linejoin="round"/>`
      + `<path d="M258 140 Q246 182 258 226" stroke="${C.green}" stroke-width="3" fill="none"/>`
      + `<circle cx="222" cy="170" r="9" fill="white" stroke="${C.ink}" stroke-width="2.5"/><circle cx="220" cy="170" r="4.5" fill="${C.ink}"/>`
      + `<path d="M196 190 Q204 194 212 192" stroke="${C.ink}" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;
    const finG = (cls, inner, k) => `<g class="${cls}"><g class="pulse pulse1"${dl(0.3 + 0.35 * k)}>${inner}</g></g>`;
    let fish = finG('ft', tail, 0) + finG('fd', dorsal, 1) + finG('fa', anal, 4) + finG('fv', pelvic, 3) + bodyShape + finG('fp', pect, 2);
    body += `<g class="swim">${fish}</g>`;
    css += steps(id, 'swim', ['translateX(0px)', null, 'translateX(-70px)', null], 2.2, 0.2);
    css += `
    .sc-${id} .ft { transform: ${rot(454, 181, 0)}; }
    .on2 .sc-${id} .ft { animation: ${id}-wag .55s ease-in-out infinite alternate; }
    @keyframes ${id}-wag { from { transform: ${rot(454, 181, -14)}; } to { transform: ${rot(454, 181, 14)}; } }
    .sc-${id} .fp { transform: ${rot(264, 210, 0)}; }
    .on2 .sc-${id} .fp { animation: ${id}-fl .8s ease-in-out infinite alternate; }
    @keyframes ${id}-fl { from { transform: ${rot(264, 210, -12)}; } to { transform: ${rot(264, 210, 10)}; } }
    `;
    // 2칸: 꼬리 뒤로 밀려나는 물과 나아가는 쪽
    body += at(2, 'fin', flow(470, 181, 600, 181, C.blue, 6), 0.3);
    body += at(2, 'fin', `<g transform="translate(-70 0)">${flow(170, 181, 90, 181, C.orange, 6)}</g>`, 1.4);
    // 3칸: 지느러미 이름표
    body += shown(3, `<g transform="translate(-70 0)">${lead(560, 64, 494, 150, C.orange)}${lead(500, 52, 360, 96, C.orange)}${lead(316, 312, 292, 232, C.orange)}${lead(340, 306, 354, 256, C.orange)}${lead(370, 310, 422, 240, C.orange)}</g>`);
    body += at(3, 'pop', tag(500, 46, '지느러미', HOT, { size: 24 }), 0.3) + at(3, 'pop', tag(280, 324, '지느러미', HOT, { size: 24 }), 0.5);
    body += `<g transform="translate(-70 0)">${ring(494, 181, 40, 3, C.orange, 0)}${ring(348, 100, 30, 3, C.orange, 0.15)}${ring(290, 228, 26, 3, C.orange, 0.3)}${ring(356, 254, 20, 3, C.orange, 0.4)}${ring(424, 234, 22, 3, C.orange, 0.5)}</g>`;
    put('3-1/과학/2/지느러미', svg(id, body, css));
  })();

  // ── 물갈퀴: 개구리 뒷발의 발가락 사이를 잇는 얇은 살갗. 있으면 물을 많이 밀어 낸다 ──
  (function () {
    const id = 't31-s2-mulgalkwi';
    let css = base(id);
    let body = `<rect width="640" height="360" fill="${C.sky}"/>`;
    // 발: (0,0) 발뒤꿈치, 발가락이 아래로 퍼진다
    const A = [-54, -30, -7, 17, 42].map((d) => d * Math.PI / 180), Lt = [86, 112, 136, 156, 116];
    const tip = (i, k = 1) => [Lt[i] * k * Math.sin(A[i]), Lt[i] * k * Math.cos(A[i])];
    // 발가락은 바깥쪽으로 살짝 휜다
    const toes = A.map((a, i) => { const [x, y] = tip(i), bend = (i - 2) * 5; return `M0 0 Q${f(x / 2 + Math.cos(a) * bend)} ${f(y / 2 - Math.sin(a) * bend)} ${f(x)} ${f(y)}`; }).join(' ');
    const foot = (web, webCls = '') => {
      let s = `<path d="M0 -56 L0 0" stroke="${C.green}" stroke-width="22" stroke-linecap="round"/><ellipse cx="0" cy="14" rx="22" ry="26" fill="${C.green}"/>`;
      if (web) {
        let d = `M0 0 L${f(tip(0)[0])} ${f(tip(0)[1])}`;
        for (let i = 1; i < 5; i++) {
          const a = tip(i - 1), b = tip(i), m = [(a[0] + b[0]) / 2 * 0.74, (a[1] + b[1]) / 2 * 0.74];
          d += ` Q${f(m[0])} ${f(m[1])} ${f(b[0])} ${f(b[1])}`;
        }
        s += `<g class="${webCls}"><path d="${d} Z" fill="${C.mint}" stroke="${C.green}" stroke-width="3" stroke-linejoin="round"/></g>`;
      }
      s += `<path d="${toes}" stroke="${C.green}" stroke-width="11" stroke-linecap="round" fill="none"/>`;
      s += A.map((_, i) => `<circle cx="${f(tip(i)[0])}" cy="${f(tip(i)[1])}" r="9" fill="${C.green}"/>`).join('');
      return s;
    };
    // 1칸: 가운데 큰 발, 살갗이 채워진다
    body += `<g class="move"><g transform="translate(320 110)"><g class="paddle">${foot(true, 'web')}</g></g></g>`;
    css += `.sc-${id} .web { opacity: 0; transition: opacity .8s ease .5s; } .on1 .sc-${id} .web { opacity: 1; }`;
    css += steps(id, 'move', ['translateX(0px)', null, 'translateX(150px)'], 0.9, 0.1);
    body += `<g class="b1 h2"><g class="ring ring1" style="animation-delay:1.2s"><circle cx="${f(320 + tip(1)[0] * 0.75)}" cy="${f(110 + tip(1)[1] * 0.75)}" r="22" fill="none" stroke="${C.orange}" stroke-width="4"/></g></g>`;
    const wm = [320 + (tip(3)[0] + tip(4)[0]) / 2 * 0.72, 110 + (tip(3)[1] + tip(4)[1]) / 2 * 0.72];
    body += shown(1, lead(wm[0], wm[1], 466, 160, C.green) + tag(526, 160, '얇은 살갗', OK, { size: 20 }), 2);
    // 2칸: 왼쪽에 살갗 없는 발. 둘 다 아래로 젓는다.
    body += at(2, 'fin', `<g transform="translate(170 110)"><g class="paddle">${foot(false)}</g></g>`, 0.2);
    css += `.on2 .sc-${id} .paddle { animation: ${id}-pad 1.4s ease-in-out infinite; }
    @keyframes ${id}-pad { 0%, 100% { transform: translateY(-14px); } 50% { transform: translateY(14px); } }`;
    // 살갗이 없으면 물이 발가락 사이로 빠져나간다(위로), 있으면 물을 아래로 많이 밀어 낸다
    const gaps = [0, 1, 2, 3].map((i) => { const a = tip(i, 0.95), b = tip(i + 1, 0.95); return [170 + (a[0] + b[0]) / 2 * 0.9, 110 + (a[1] + b[1]) / 2 * 0.9]; });
    body += at(2, 'fin', gaps.map(([x, y]) => flow(x, y + 44, x, y - 60, C.blue, 4)).join(''), 0.8);
    body += at(2, 'fin', [-60, 0, 60].map((dx) => flow(470 + dx * 1.2, 284, 470 + dx * 1.5, 346, C.blue, 8)).join(''), 0.8);
    body += at(2, 'rise', text(170, 30, '살갗 없음', { size: 20 }) + text(470, 30, '살갗 있음', { size: 20 }), 0.1);
    // 3칸: 물갈퀴
    body += `<g class="b3"><g class="ring ring3"><circle cx="470" cy="200" r="80" fill="none" stroke="${C.orange}" stroke-width="4"/></g></g>`;
    body += shown(3, lead(574, 116, 540, 150, C.orange)) + at(3, 'pop', tag(574, 96, '물갈퀴', HOT, { size: 24 }), 0.3);
    put('3-1/과학/2/물갈퀴', svg(id, body, css));
  })();

  // ════ 3단원 식물의 생활 ════

  // 잎 윤곽: 밑(0,0)에서 끝(0,-L)까지. teeth 는 한쪽 톱니 수(0 이면 매끈).
  const leafOutline = (L, W, teeth = 0, tooth = 6) => {
    const half = (t) => (W / 2) * Math.sin(Math.PI * Math.pow(t, 0.75)) * (1 - 0.15 * t);
    const N = teeth || 28, right = [];
    for (let i = 0; i <= N; i++) right.push([half(i / N), -L * i / N]);
    let side = [right[0]];
    if (teeth) {
      for (let i = 1; i <= N; i++) {
        const a = right[i - 1], b = right[i], dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy) || 1;
        const n = [-dy / len, dx / len];
        const sz = i === N || i === 1 ? 0 : tooth;
        side.push([a[0] + 0.7 * dx + n[0] * sz, a[1] + 0.7 * dy + n[1] * sz], b);
      }
    } else side = right;
    const left = side.slice().reverse().map(([x, y]) => [-x, y]);
    return side.concat(left.slice(1));
  };
  const veins = (L, W) => {
    let d = `M0 0 L0 ${f(-L * 0.95)}`;
    [0.18, 0.34, 0.5, 0.66, 0.8].forEach((t) => {
      const w = (W / 2) * 0.7 * Math.sin(Math.PI * Math.pow(t + 0.1, 0.75));
      d += ` M0 ${f(-L * t)} Q${f(w * 0.4)} ${f(-L * (t + 0.06))} ${f(w)} ${f(-L * (t + 0.14))} M0 ${f(-L * t)} Q${f(-w * 0.4)} ${f(-L * (t + 0.06))} ${f(-w)} ${f(-L * (t + 0.14))}`;
    });
    return `<path d="${d}" stroke="${C.green}" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;
  };
  const LEAF = `fill="${C.mint}" stroke="${C.green}" stroke-width="3" stroke-linejoin="round"`;
  const cherryLeaf = (L = 200, W = 112) => `<path d="${pts(leafOutline(L, W, 22, 6))} Z" ${LEAF}/>` + veins(L, W);
  // 강아지풀 잎: 길쭉하고 매끈하며 조금 휜다
  const grassLeaf = (L = 240, W = 30) => `<path d="M0 0 Q${W * 0.9} ${-L * 0.4} ${W * 0.5} ${-L * 0.8} Q${W * 0.2} ${-L * 0.95} ${-W * 0.1} ${-L} Q${-W * 0.1} ${-L * 0.7} ${-W * 0.6} ${-L * 0.35} Q${-W * 0.6} ${-L * 0.1} 0 0 Z" ${LEAF}/>`
    + `<path d="M0 -6 Q${W * 0.15} ${-L * 0.5} ${-W * 0.02} ${-L * 0.96}" stroke="${C.green}" stroke-width="2.5" fill="none"/>`;
  const grassEdge = (L = 240, W = 30) => `M0 0 Q${W * 0.9} ${-L * 0.4} ${W * 0.5} ${-L * 0.8} Q${W * 0.2} ${-L * 0.95} ${-W * 0.1} ${-L} Q${-W * 0.1} ${-L * 0.7} ${-W * 0.6} ${-L * 0.35} Q${-W * 0.6} ${-L * 0.1} 0 0 Z`;

  // ── 가장자리: 잎의 둘레를 따라가 본다. 벚나무는 톱니 모양, 강아지풀은 매끈하다 ──
  (function () {
    const id = 't31-s3-gajang';
    let css = base(id);
    const L = 210, W = 120, CX = 210, BY = 290;
    let body = `<path d="M${CX} ${BY} V${BY + 40}" stroke="${C.green}" stroke-width="6" stroke-linecap="round"/>`;
    body += `<g transform="translate(${CX} ${BY})">${cherryLeaf(L, W)}</g>`;
    body += `<g transform="translate(${CX} ${BY})"><g class="b1"><path class="draw draw1" pathLength="1" d="${pts(leafOutline(L, W, 22, 6))} Z" fill="none" stroke="${C.orange}" stroke-width="6" stroke-linejoin="round"/></g></g>`;
    const GX = 470, GY = 320;
    body += at(2, 'fin', `<g transform="translate(${GX} ${GY}) rotate(8)">${grassLeaf(270, 34)}</g>`, 0);
    body += `<g transform="translate(${GX} ${GY}) rotate(8)"><g class="b2"><path class="draw draw2" pathLength="1" d="${grassEdge(270, 34)}" fill="none" stroke="${C.orange}" stroke-width="6" stroke-linejoin="round" style="transition-delay:.6s"/></g></g>`;
    body += at(2, 'pop', tag(CX + 130, 300, '톱니 모양', GRAY, { size: 18 }), 1.6) + at(2, 'pop', tag(GX + 90, 330, '매끈함', GRAY, { size: 18 }), 2);
    // 1칸 이름표 → 3칸에 두 잎을 함께 가리킨다
    const e = leafOutline(L, W, 0)[19], E = [CX + e[0] + 6, BY + e[1]];
    body += shown(1, lead(E[0], E[1], 346, 64, C.orange) + tag(390, 50, '가장자리', HOT, { size: 22 }), 2);
    body += shown(3, lead(E[0], E[1], 312, 64, C.orange) + lead(GX + 20, 112, 392, 64, C.orange)) + at(3, 'pop', tag(352, 50, '가장자리', HOT, { size: 24 }), 0.2);
    body += `<g transform="translate(${CX} ${BY})"><g class="b3"><path class="flash flash3" d="${pts(leafOutline(L, W, 22, 6))} Z" fill="none" stroke="${C.orange}" stroke-width="6" stroke-linejoin="round"/></g></g>`;
    body += `<g transform="translate(${GX} ${GY}) rotate(8)"><g class="b3"><path class="flash flash3" d="${grassEdge(270, 34)}" fill="none" stroke="${C.orange}" stroke-width="6" stroke-linejoin="round"/></g></g>`;
    put('3-1/과학/3/가장자리', svg(id, body, css));
  })();

  // ── 톱니: 톱날의 뾰족뾰족한 부분. 벚나무 잎 가장자리에도 있다 ──
  (function () {
    const id = 't31-s3-topni';
    let css = base(id);
    // 톱: 날 아래쪽에 이(톱니)가 줄지어 있다
    const yB = (x) => 112 + (x - 90) * (8 / 380);
    let tooth = `M90 ${f(yB(90))}`;
    for (let k = 0; k < 16; k++) { const x0 = 90 + 24 * k; tooth += ` L${f(x0 + 17)} ${f(yB(x0 + 17) + 14)} L${f(x0 + 24)} ${f(yB(x0 + 24))}`; }
    const saw = `<path d="M470 64 L94 82 Q86 84 88 92 L90 ${f(yB(90))} ${tooth.slice(tooth.indexOf('L'))} L470 ${f(yB(470))} Z" fill="${C.line}" stroke="${C.muted}" stroke-width="3" stroke-linejoin="round"/>`
      + `<rect x="466" y="48" width="96" height="96" rx="26" fill="${C.peach}" stroke="${C.orange}" stroke-width="3"/><rect x="494" y="72" width="44" height="48" rx="14" fill="${C.paper}" stroke="${C.orange}" stroke-width="2.5"/>`;
    let body = `<g class="saw">${saw}<g class="b1"><path class="flash flash1" style="animation-delay:.8s" d="${tooth}" fill="none" stroke="${C.orange}" stroke-width="5" stroke-linejoin="round"/></g></g>`;
    css += `.on1 .sc-${id} .saw { animation: ${id}-saw 1s ease-in-out 2; } @keyframes ${id}-saw { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(-26px); } }`;
    // 2칸: 가로로 누운 벚나무 잎과 돋보기
    const LX = 70, LY = 262;
    body += at(2, 'fin', `<path d="M${LX - 40} ${LY} H${LX}" stroke="${C.green}" stroke-width="6" stroke-linecap="round"/><g transform="translate(${LX} ${LY}) rotate(90)">${cherryLeaf(200, 100)}</g>`, 0);
    const spot = [LX + 110, LY - 48];
    body += at(2, 'fin', `<circle cx="${spot[0]}" cy="${spot[1]}" r="18" fill="none" stroke="${C.ink}" stroke-width="3"/>` + lead(spot[0] + 12, spot[1] - 13, 402, 194, C.ink) + lead(spot[0] + 15, spot[1] + 10, 410, 300, C.ink), 0.4);
    const MX = 470, MY = 248, MR = 82;
    let big = `M${MX - 100} ${MY + 18}`;
    for (let k = 0; k < 6; k++) { const x0 = MX - 100 + 34 * k, y0 = MY + 18 - 6 * k; big += ` L${x0 + 26} ${y0 - 24} L${x0 + 34} ${y0 - 6}`; }
    const clip = `${id}-clip`;
    const lens = `<defs><clipPath id="${clip}"><circle cx="${MX}" cy="${MY}" r="${MR}"/></clipPath></defs>`
      + `<circle cx="${MX}" cy="${MY}" r="${MR}" fill="${C.paper}"/>`
      + `<g clip-path="url(#${clip})"><path d="${big} L${MX + 110} ${MY + 120} L${MX - 110} ${MY + 120} Z" fill="${C.mint}" stroke="${C.green}" stroke-width="4" stroke-linejoin="round"/>`
      + `<path d="M${MX - 60} ${MY + 90} Q${MX - 20} ${MY + 40} ${MX + 40} ${MY + 20}" stroke="${C.green}" stroke-width="3" fill="none"/></g>`
      + `<circle cx="${MX}" cy="${MY}" r="${MR}" fill="none" stroke="${C.ink}" stroke-width="5"/>`;
    body += at(2, 'pop', lens, 0.6);
    body += `<g class="b2"><g clip-path="url(#${clip})"><path class="flash flash2" style="animation-delay:1.3s" d="${big}" fill="none" stroke="${C.orange}" stroke-width="6" stroke-linejoin="round"/></g></g>`;
    // 3칸: 톱니
    body += shown(3, lead(300, 150, 300, 118, C.orange) + lead(MX + 70, MY - 110, MX + 30, MY - 52, C.orange)) + at(3, 'pop', tag(300, 168, '톱니', HOT, { size: 24 }), 0.2) + at(3, 'pop', tag(MX + 90, MY - 128, '톱니', HOT, { size: 24 }), 0.4);
    body += `<g class="b3"><path class="flash flash3" d="${tooth}" fill="none" stroke="${C.orange}" stroke-width="5" stroke-linejoin="round"/></g>`;
    put('3-1/과학/3/톱니', svg(id, body, css));
  })();

  // ── 잎자루: 줄기와 잎몸 사이를 잇는 가느다란 부분. 강아지풀 잎에는 없다 ──
  (function () {
    const id = 't31-s3-ipjaru';
    let css = base(id);
    const SX = 150, J = [SX, 210]; // 줄기와 잎자루가 만나는 곳
    let body = `<path d="M${SX} 340 L${SX} 30" stroke="${C.orange}" stroke-width="12" stroke-linecap="round"/>`;
    // 잎자루(가는 막대)와 잎몸(가로로 뻗음). 잎몸 밑은 J 에서 오른쪽 위로 70 떨어진 곳.
    const PB = [J[0] + 70, J[1] - 34];
    const petiole = `M${J[0] + 4} ${J[1]} Q${J[0] + 40} ${J[1] - 6} ${PB[0]} ${PB[1]}`;
    const blade = `<g transform="translate(${PB[0]} ${PB[1]}) rotate(64)">${cherryLeaf(190, 104)}</g>`;
    body += `<g class="lf"><g class="b1"><path class="draw draw1" pathLength="1" d="${petiole}" fill="none" stroke="${C.green}" stroke-width="7" stroke-linecap="round"/></g>${at(1, 'pop', blade, 1.3)}</g>`;
    css += `.sc-${id} .lf { transform: ${rot(J[0], J[1], 0)}; }
    .on2 .sc-${id} .lf { animation: ${id}-sway 1.6s ease-in-out infinite alternate; }
    .on3 .sc-${id} .lf { animation: none; }
    @keyframes ${id}-sway { from { transform: ${rot(J[0], J[1], -5)}; } to { transform: ${rot(J[0], J[1], 7)}; } }`;
    body += at(1, 'fin', text(SX - 34, 300, '줄기', { size: 20, anchor: 'end' }), 0.2);
    body += at(1, 'pop', lead(258, 66, 278, 100, C.green) + tag(246, 52, '잎몸', OK, { size: 20 }), 1.8);
    // 2칸: 강아지풀 잎은 줄기에 바로 붙는다
    const GX = 540;
    body += at(2, 'fin', `<path d="M${GX} 340 L${GX} 60" stroke="${C.green}" stroke-width="8" stroke-linecap="round"/><g transform="translate(${GX + 2} 236) rotate(30)">${grassLeaf(120, 22)}</g><g transform="translate(${GX - 2} 160) rotate(-30)">${grassLeaf(110, 20)}</g>`, 0.3);
    body += at(2, 'fin', text(GX, 30, '강아지풀', { size: 20 }), 0.4);
    body += ring(GX + 3, 236, 16, 2, C.blue, 1) + ring(GX - 3, 160, 16, 2, C.blue, 1.2);
    // 3칸: 잎자루
    body += `<g class="b3"><path class="flash flash3" d="${petiole}" fill="none" stroke="${C.orange}" stroke-width="10" stroke-linecap="round"/></g>`;
    body += shown(3, lead(J[0] + 40, J[1] + 2, 236, 262, C.orange)) + at(3, 'pop', tag(270, 280, '잎자루', HOT, { size: 24 }), 0.3);
    put('3-1/과학/3/잎자루', svg(id, body, css));
  })();

  // ── 동물 카드(미래엔 동물 카드에서 여섯): 80×92, (0,0) 은 왼쪽 위 ──
  const ANIMALS = {
    나비: { legs: true, wings: true, art: `<path d="M40 18 V50" stroke="${C.ink}" stroke-width="4" stroke-linecap="round"/><ellipse cx="27" cy="27" rx="13" ry="10" fill="white" stroke="${C.muted}" stroke-width="2.5"/><ellipse cx="53" cy="27" rx="13" ry="10" fill="white" stroke="${C.muted}" stroke-width="2.5"/><ellipse cx="30" cy="44" rx="9" ry="8" fill="white" stroke="${C.muted}" stroke-width="2.5"/><ellipse cx="50" cy="44" rx="9" ry="8" fill="white" stroke="${C.muted}" stroke-width="2.5"/><path d="M38 18 L30 8 M42 18 L50 8" stroke="${C.ink}" stroke-width="2"/>` },
    참새: { legs: true, wings: true, art: `<path d="M44 52 V60 M50 52 V60" stroke="${C.orange}" stroke-width="2.5"/><path d="M58 36 L74 30 L70 42 Z" fill="${C.orange}"/><ellipse cx="44" cy="40" rx="20" ry="13" fill="${C.peach}" stroke="${C.orange}" stroke-width="2.5"/><circle cx="25" cy="30" r="10" fill="${C.peach}" stroke="${C.orange}" stroke-width="2.5"/><path d="M15 30 L8 33 L15 35 Z" fill="${C.ink}"/><circle cx="23" cy="28" r="2" fill="${C.ink}"/><path d="M38 36 Q48 30 58 38 Q48 44 38 36 Z" fill="${C.orange}"/>` },
    토끼: { legs: true, wings: false, art: `<path d="M34 50 V60 M54 50 V60" stroke="${C.muted}" stroke-width="4" stroke-linecap="round"/><ellipse cx="46" cy="42" rx="20" ry="13" fill="white" stroke="${C.muted}" stroke-width="2.5"/><ellipse cx="22" cy="14" rx="4" ry="12" fill="white" stroke="${C.muted}" stroke-width="2.5"/><ellipse cx="31" cy="13" rx="4" ry="12" fill="white" stroke="${C.muted}" stroke-width="2.5"/><circle cx="27" cy="32" r="11" fill="white" stroke="${C.muted}" stroke-width="2.5"/><circle cx="24" cy="30" r="2" fill="${C.ink}"/>` },
    붕어: { legs: false, wings: false, art: `<path d="M54 36 L72 24 L72 48 Z" fill="${C.line}" stroke="${C.green}" stroke-width="2.5" stroke-linejoin="round"/><ellipse cx="36" cy="36" rx="22" ry="12" fill="${C.line}" stroke="${C.green}" stroke-width="2.5"/><circle cx="22" cy="33" r="2.5" fill="${C.ink}"/>` },
    지렁이: { legs: false, wings: false, art: `<path d="M12 44 Q22 28 34 42 T56 40 T72 32" stroke="${C.orange}" stroke-width="8" fill="none" stroke-linecap="round"/>` },
    뱀: { legs: false, wings: false, art: `<path d="M10 54 Q20 34 32 48 T56 46 Q64 42 66 32" stroke="${C.green}" stroke-width="8" fill="none" stroke-linecap="round"/><circle cx="67" cy="28" r="7" fill="${C.green}"/><circle cx="69" cy="26" r="1.8" fill="white"/>` },
  };
  const NAMES = Object.keys(ANIMALS);
  const card = (name) => `<rect x="0" y="0" width="80" height="92" rx="10" fill="white" stroke="${C.line}" stroke-width="2.5"/><g transform="translate(0 4)">${ANIMALS[name].art}</g>${text(40, 84, name, { size: 18 })}`;
  // 무리 상자: 왼쪽 '그렇다', 오른쪽 '그렇지 않다'. 칸은 한 줄에 셋, 두 줄.
  const SLOT = [[38, 116], [128, 116], [218, 116], [38, 226], [128, 226], [218, 226]];
  const slot = (side, k) => [SLOT[k][0] + (side ? 310 : 0), SLOT[k][1]];
  const groupBoxes = () => `<rect x="20" y="70" width="290" height="270" rx="16" fill="${C.mint}" stroke="${C.green}" stroke-width="3"/>`
    + `<rect x="330" y="70" width="290" height="270" rx="16" fill="${C.sky}" stroke="${C.blue}" stroke-width="3"/>`
    + text(165, 100, '그렇다', { size: 20, color: C.green }) + text(475, 100, '그렇지 않다', { size: 20, color: C.blue });
  // 기준(물음)에 따라 각 카드의 칸 자리
  const placeBy = (key) => { const c = [0, 0]; return NAMES.map((n) => { const side = ANIMALS[n][key] ? 0 : 1; return slot(side, c[side]++); }); };
  const tr = ([x, y]) => `translate(${x}px, ${y}px)`;

  // ── 분류: 섞인 동물 카드를 '다리가 있는가?'에 따라 두 무리로 나눈다 ──
  (function () {
    const id = 't31-s2-bunryu';
    let css = base(id);
    let body = at(2, 'fin', groupBoxes(), 0) + at(2, 'pop', tag(320, 34, '다리가 있는가?', ['white', C.ink], { size: 22 }), 0.2);
    const start = [[40, 150], [140, 196], [240, 140], [330, 200], [430, 146], [526, 190]];
    const legs = placeBy('legs');
    NAMES.forEach((n, k) => {
      body += `<g class="b1"><g class="cd${k}"><g class="pop pop1"${dl(0.15 * k)}>${card(n)}</g></g></g>`;
      css += steps(id, `cd${k}`, [tr(start[k]), null, tr(legs[k])], 0.8, 0.6 + 0.12 * k);
    });
    body += `<g class="b3"><rect class="flash flash3" x="20" y="70" width="290" height="270" rx="16" fill="none" stroke="${C.orange}" stroke-width="5"/><rect class="flash flash3" style="animation-delay:.3s" x="330" y="70" width="290" height="270" rx="16" fill="none" stroke="${C.orange}" stroke-width="5"/></g>`;
    body += at(3, 'pop', tag(84, 34, '분류', HOT, { size: 26 }), 0.6);
    put('3-1/과학/2/분류', svg(id, body, css));
  })();

  // ── 기준: 같은 카드도 물음이 '다리'에서 '날개'로 바뀌면 무리가 달라진다 ──
  (function () {
    const id = 't31-s2-gijun';
    let css = base(id);
    let body = groupBoxes();
    body += shown(1, g('pop pop1', tag(320, 34, '다리가 있는가?', ['white', C.ink], { size: 22 })), 2) + at(2, 'pop', tag(320, 34, '날개가 있는가?', ['white', C.orange], { size: 22 }), 0.3);
    const legs = placeBy('legs'), wings = placeBy('wings');
    NAMES.forEach((n, k) => {
      body += `<g class="cd${k}"><g class="pop pop1"${dl(0.12 * k)}>${card(n)}</g></g>`;
      css += steps(id, `cd${k}`, [tr(legs[k]), null, tr(wings[k])], 1, 0.9);
    });
    // 자리를 옮긴 카드(토끼)에 고리
    const t = NAMES.indexOf('토끼');
    body += ring(wings[t][0] + 40, wings[t][1] + 46, 50, 2, C.orange, 1.8);
    body += `<g class="b3"><rect class="flash flash3" x="${f(320 - (tw('날개가 있는가?', 22) + 28.6) / 2 - 4)}" y="11" width="${f(tw('날개가 있는가?', 22) + 36.6)}" height="45" rx="22" fill="none" stroke="${C.orange}" stroke-width="5"/></g>`;
    body += at(3, 'pop', tag(560, 34, '기준', HOT, { size: 26 }), 0.4) + shown(3, lead(522, 34, 476, 34, C.orange));
    put('3-1/과학/2/기준', svg(id, body, css));
  })();

  // ── 강아지풀(풀)과 벚나무(나무) 견주기: 땅 y 250, 뿌리는 땅속 ──
  const GND = 250, GX = 160, TX = 470;
  const grassPlant = () => {
    let s = `<path d="M${GX} ${GND} V120" stroke="${C.green}" stroke-width="4" stroke-linecap="round"/>`;
    s += `<g transform="translate(${GX} 112) rotate(10)"><ellipse cx="0" cy="-10" rx="8" ry="24" fill="${C.mint}" stroke="${C.green}" stroke-width="2.5"/><path d="M-8 -26 l-6 -3 M8 -24 l6 -3 M-8 -10 l-7 -1 M8 -8 l7 -1 M-7 6 l-6 2 M7 6 l6 2" stroke="${C.green}" stroke-width="2"/></g>`;
    s += `<g transform="translate(${GX} 230) rotate(40)">${grassLeaf(90, 16)}</g><g transform="translate(${GX} 196) rotate(-36)">${grassLeaf(80, 14)}</g>`;
    return s;
  };
  const grassRoot = `M${GX} ${GND} q-14 22 -26 34 M${GX} ${GND} q2 26 -2 46 M${GX} ${GND} q14 20 26 32 M${GX - 12} ${GND + 18} l-10 6 M${GX + 12} ${GND + 16} l12 4`;
  const treeTrunk = `M${TX - 16} ${GND} L${TX - 11} 120 L${TX + 11} 120 L${TX + 16} ${GND} Z`;
  const treePlant = () => `<path d="${treeTrunk}" fill="${C.peach}" stroke="${C.orange}" stroke-width="3" stroke-linejoin="round"/>`
    + `<path d="M${TX} 140 L${TX - 46} 96 M${TX} 130 L${TX + 50} 90" stroke="${C.orange}" stroke-width="7" stroke-linecap="round"/>`
    + `<circle cx="${TX - 52}" cy="92" r="40" fill="${C.mint}" stroke="${C.green}" stroke-width="3"/><circle cx="${TX + 54}" cy="88" r="40" fill="${C.mint}" stroke="${C.green}" stroke-width="3"/><circle cx="${TX}" cy="62" r="46" fill="${C.mint}" stroke="${C.green}" stroke-width="3"/>`
    + [[-60, 86], [-30, 70], [10, 50], [40, 80], [64, 96], [-6, 84]].map(([dx, y], k) => leafAt(TX + dx, y, k % 2 ? 30 : -30)).join('');
  const treeRoot = `M${TX} ${GND} q-30 20 -70 36 M${TX} ${GND} q-10 30 -24 60 M${TX} ${GND} q8 32 18 62 M${TX} ${GND} q34 18 72 30 M${TX - 40} ${GND + 22} l-12 14 M${TX + 40} ${GND + 18} l14 12`;
  const leafAt = (x, y, ang) => `<path d="M0 0 Q9 -10 0 -22 Q-9 -10 0 0 Z" transform="translate(${f(x)} ${f(y)}) rotate(${ang})" fill="${C.mint}" stroke="${C.green}" stroke-width="2"/>`;
  const plantsScene = () => `<rect x="10" y="${GND}" width="620" height="${360 - GND}" fill="${C.peach}"/><path d="M10 ${GND} H630" stroke="${C.orange}" stroke-width="3"/>`
    + `<path d="${grassRoot}" stroke="${C.orange}" stroke-width="3" fill="none" stroke-linecap="round"/><path d="${treeRoot}" stroke="${C.orange}" stroke-width="5" fill="none" stroke-linecap="round"/>`
    + grassPlant() + treePlant()
    + text(GX, 340, '강아지풀', { size: 20 }) + text(TX, 340, '벚나무', { size: 20 });

  // ── 공통점: 강아지풀과 벚나무는 둘 다 뿌리·줄기·잎이 있다 ──
  (function () {
    const id = 't31-s3-gongtong';
    let css = base(id);
    let body = at(1, 'fin', plantsScene(), 0);
    // 세 부분을 차례로 양쪽에서 짚는다(가운데 이름표에서 두 식물로 줄)
    const parts = [
      ['잎', 152, [GX + 10, 186], [TX - 70, 110], C.green],
      ['줄기', 212, [GX + 3, 160], [TX - 12, 180], C.orange],
      ['뿌리', 292, [GX + 18, GND + 26], [TX - 40, GND + 26], C.purple],
    ];
    parts.forEach(([lab, y, a, b, col], k) => {
      const s = 0.3 + 0.6 * k;
      body += at(2, 'fin', lead(290, y, a[0], a[1], col) + lead(350, y, b[0], b[1], col), s) + at(2, 'pop', tag(320, y, lab, ['white', col], { size: 20 }), s);
    });
    body += ring(GX + 10, 186, 24, 2, C.green, 0.4) + ring(TX - 70, 110, 30, 2, C.green, 0.4);
    body += at(3, 'pop', tag(320, 40, '공통점', OK, { size: 26 }), 0.3) + at(3, 'fin', text(320, 84, '=', { size: 30, color: C.green }), 0.1);
    put('3-1/과학/3/공통점', svg(id, body, css));
  })();

  // ── 차이점: 강아지풀은 키가 작고 줄기가 가늘다, 벚나무는 키가 크고 줄기가 굵다 ──
  (function () {
    const id = 't31-s3-chaijeom';
    let css = base(id);
    let body = at(1, 'fin', plantsScene(), 0);
    // 키: 땅에서 꼭대기까지 자로 잰다
    const bar = (x, top, col, cls) => `<g class="${cls}"><path d="M${x} ${GND} V${top}" stroke="${col}" stroke-width="4"/><path d="M${x - 9} ${top} H${x + 9} M${x - 9} ${GND} H${x + 9}" stroke="${col}" stroke-width="4"/></g>`;
    body += `<g class="b2">${bar(GX - 70, 86, C.blue, 'k1')}${bar(TX - 120, 16, C.red, 'k2')}</g>`;
    css += `.sc-${id} .k1, .sc-${id} .k2 { transform-box: fill-box; transform-origin: 50% 100%; transform: scaleY(0); transition: transform 1s ease-out .3s; } .on2 .sc-${id} .k1, .on2 .sc-${id} .k2 { transform: scaleY(1); }`;
    body += at(2, 'pop', tag(GX - 70, 66, '작다', ['white', C.blue], { size: 18 }), 1.2) + at(2, 'pop', tag(TX - 160, 160, '크다', ['white', C.red], { size: 18 }), 1.3);
    // 줄기 굵기
    body += `<g class="b2"><path class="flash flash2" style="animation-delay:1.6s" d="M${GX} ${GND - 4} V150" stroke="${C.blue}" stroke-width="10" stroke-linecap="round" opacity=".55"/><path class="flash flash2" style="animation-delay:1.6s" d="${treeTrunk}" fill="none" stroke="${C.red}" stroke-width="5" stroke-linejoin="round"/></g>`;
    body += at(2, 'pop', tag(GX + 102, 232, '가늘다', ['white', C.blue], { size: 18 }), 1.8) + at(2, 'pop', tag(TX + 66, 200, '굵다', ['white', C.red], { size: 18 }), 1.9);
    body += at(3, 'pop', tag(214, 36, '차이점', HOT, { size: 26 }), 0.3) + at(3, 'fin', text(316, 222, '≠', { size: 34, color: C.orange }), 0.1);
    put('3-1/과학/3/차이점', svg(id, body, css));
  })();
})(typeof window !== 'undefined' ? window : globalThis);
