// 수학 6-2 6단원 원기둥, 원뿔, 구: 낱말 도식
// 입체는 조금 위에서 내려다본 모습으로 그린다. 바닥에 놓인 원은 가로 a, 세로 b = K·a 인 타원.
// - 원기둥: 윗면 타원은 다 보이고, 아랫면은 앞쪽 반이 실선·뒤쪽 반이 점선. 옆 선은 타원의 양 끝(x = cx ± a)에서 내린다.
// - 원뿔: 꼭짓점에서 밑면 타원에 그은 접선이 옆 선이다. 접점은 타원의 양 끝보다 조금 뒤(위)라서, 보이는 앞쪽 호가 반보다 길다.
// - 구: 테두리 원 + 적도 타원(앞쪽 반 실선, 뒤쪽 반 점선).
// 평면도형을 세로 축으로 돌리는 움직임은 matrix 열쇠틀로: 점 (x, y) → (cx + (x−cx)cosθ, y + (x−cx)·K·sinθ).
(function (root) {
  'use strict';
  const { C, svg, text, put } = root.FigureKit;
  const K = 0.3;
  const f = (n) => +(+n).toFixed(1);
  const px = (n) => `${f(n)}px`;
  const P = (p) => `${f(p[0])} ${f(p[1])}`;
  const seg = (p, q, a = '') => `<path d="M${P(p)} L${P(q)}" ${a}/>`;
  const dot = (p, r = 6, fill = C.ink) => `<circle cx="${f(p[0])}" cy="${f(p[1])}" r="${r}" fill="${fill}"/>`;
  const INK = `stroke="${C.ink}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"`;
  const DASH = `stroke="${C.ink}" stroke-width="2.5" stroke-dasharray="8 7" fill="none"`;
  // 타원의 앞쪽 반(왼쪽 → 아래 → 오른쪽), 뒤쪽 반(왼쪽 → 위 → 오른쪽)
  const front = (cx, cy, a, b) => `M${f(cx - a)} ${f(cy)} A${f(a)} ${f(b)} 0 0 0 ${f(cx + a)} ${f(cy)}`;
  const back = (cx, cy, a, b) => `M${f(cx - a)} ${f(cy)} A${f(a)} ${f(b)} 0 0 1 ${f(cx + a)} ${f(cy)}`;
  const ell = (cx, cy, a, b, attr) => `<ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(a)}" ry="${f(b)}" ${attr}/>`;

  // 원기둥 겨냥도 조각
  function cyl(cx, yT, yB, a) {
    const b = K * a;
    return {
      a, b, cx, yT, yB,
      side: `M${f(cx - a)} ${yT} V${yB} A${f(a)} ${f(b)} 0 0 0 ${f(cx + a)} ${yB} V${yT} A${f(a)} ${f(b)} 0 0 1 ${f(cx - a)} ${yT} Z`,
      top: (attr) => ell(cx, yT, a, b, attr),
      bottom: (attr) => ell(cx, yB, a, b, attr),
      lines: `<path d="M${f(cx - a)} ${yT} V${yB} M${f(cx + a)} ${yT} V${yB}" ${INK} fill="none"/>`
        + `<path d="${front(cx, yB, a, b)}" ${INK} fill="none"/><path d="${back(cx, yB, a, b)}" ${DASH}/>`
        + ell(cx, yT, a, b, `${INK} fill="none"`)
    };
  }
  // 원뿔 겨냥도 조각
  function cone(cx, yA, yB, a) {
    const b = K * a, H = yB - yA;
    const y0 = -b * b / H, x0 = a * Math.sqrt(1 - (b / H) ** 2);
    const T1 = [cx - x0, yB + y0], T2 = [cx + x0, yB + y0], A = [cx, yA];
    return {
      a, b, cx, yA, yB, H, A, T1, T2, hide: -b / H,
      side: `M${P(A)} L${P(T2)} A${f(a)} ${f(b)} 0 1 1 ${P(T1)} Z`,
      base: (attr) => ell(cx, yB, a, b, attr),
      lines: `<path d="M${P(T1)} L${P(A)} L${P(T2)} A${f(a)} ${f(b)} 0 1 1 ${P(T1)}" ${INK} fill="none"/>`
        + `<path d="M${P(T1)} A${f(a)} ${f(b)} 0 0 1 ${P(T2)}" ${DASH}/>`,
      rim: (deg) => [cx + a * Math.cos(deg * Math.PI / 180), yB + b * Math.sin(deg * Math.PI / 180)]
    };
  }
  // 구 겨냥도 조각
  function ball(cx, cy, R) {
    const b = K * R;
    return {
      R, b, cx, cy,
      lines: `<circle cx="${cx}" cy="${cy}" r="${R}" ${INK} fill="none"/><path d="${front(cx, cy, R, b)}" ${INK} fill="none"/><path d="${back(cx, cy, R, b)}" ${DASH}/>`
    };
  }

  // 세로 축(x = cx) 둘레로 한 바퀴 도는 열쇠틀.
  // matrix 사이를 브라우저가 이어 그리면(분해 보간) 90°·270° 근처에서 모양이 엉뚱한 곳으로 튄다.
  // 그래서 5°마다 열쇠를 두고 사이는 잇지 않는다(step-end) — 1.5초에 72장이라 매끄럽게 보인다.
  const N = 30, NR = 72;
  const rotKeys = (name, cx) => {
    let k = `@keyframes ${name}{`;
    for (let i = 0; i <= NR; i++) {
      const t = 2 * Math.PI * i / NR, c = Math.cos(t), s = Math.sin(t);
      k += `${f(100 * i / NR)}%{transform:matrix(${c.toFixed(4)},${(K * s).toFixed(4)},0,1,${f(cx * (1 - c))},${f(-cx * K * s)})}`;
    }
    return k + '}';
  };
  // 돌아가는 점이 지나간 자리: 30조각이 차례로 나타남. hideBelow 보다 sin 이 작은 뒤쪽 조각은 점선
  const trace = (cx, cy, a, t0, T, hideBelow = 0, color = C.orange) => {
    let s = '';
    for (let i = 0; i < N; i++) {
      const t1 = 2 * Math.PI * i / N, t2 = 2 * Math.PI * (i + 1) / N, mid = (t1 + t2) / 2;
      const p = [cx + a * Math.cos(t1), cy + a * K * Math.sin(t1)], q = [cx + a * Math.cos(t2), cy + a * K * Math.sin(t2)];
      const hidden = Math.sin(mid) < hideBelow;
      s += seg(p, q, `class="tr" style="--d:${f(t0 + T * (i + 1) / N)}s" stroke="${color}" stroke-width="3.5" stroke-linecap="round"${hidden ? ' stroke-dasharray="4 4" stroke-opacity=".7"' : ''}`);
    }
    return s;
  };
  const ROT0 = 0.2, ROTT = 1.5;
  const rotCss = (id, cx) => `
    .sc-${id} .rot{transform-box:view-box;transform-origin:0 0}
    .on2 .sc-${id} .rot{animation:${id}-rot ${ROTT}s step-end ${ROT0}s both}
    ${rotKeys(`${id}-rot`, cx)}
    .sc-${id} .tr{opacity:0}
    .on2 .sc-${id} .tr{animation:${id}-tr .05s linear var(--d) both}
    @keyframes ${id}-tr{from{opacity:0}to{opacity:1}}`;
  const axis = (cx, y1, y2) => `<path d="M${cx} ${y1} V${y2}" stroke="${C.muted}" stroke-width="6" stroke-linecap="round"/>`;
  const SHAPE = `fill="${C.peach}" fill-opacity=".8" stroke="${C.orange}" stroke-width="3.5" stroke-linejoin="round"`;

  // 입체도형: 종이 위 사각형과 원 → 두께가 생겨 상자와 공 → 그림자가 생기고 속이 채워짐
  {
    const id = 't62-m6-ipche';
    const A = [90, 150], B = [240, 150], Cc = [240, 260], D = [90, 260], d = [60, -40];
    const o = (p) => [p[0] + d[0], p[1] + d[1]];
    const E = o(A), F = o(B), G = o(Cc), H = o(D);
    const poly = (pts, attr) => `<polygon points="${pts.map(P).join(' ')}" ${attr}/>`;
    const sx = 470, sy = 195, R = 85;
    const sph = ball(sx, sy, R);
    const body = `<g class="b3"><g class="shadow">${ell(200, 268, 150, 16, `fill="${C.line}" fill-opacity=".7"`)}${ell(sx, 290, 90, 14, `fill="${C.line}" fill-opacity=".7"`)}</g></g>`
      + `<clipPath id="${id}-clip"><polygon points="${[A, E, F, G, Cc, B].map(P).join(' ')}"/></clipPath>`
      + `<g clip-path="url(#${id}-clip)"><g class="grow">${poly([A, B, F, E], `class="fc" fill="${C.mint}" ${INK}`)}${poly([B, Cc, G, F], `class="fc" fill="${C.mint}" ${INK}`)}</g></g>`
      + `<g class="b2"><g class="late">${poly([A, B, F, E], `fill="none" ${INK}`)}${poly([B, Cc, G, F], `fill="none" ${INK}`)}</g></g>`
      + poly([A, B, Cc, D], `class="fr" fill="${C.paper}" ${INK}`)
      + `<g class="b2"><g class="late">${seg(D, H, DASH)}${seg(H, G, DASH)}${seg(H, E, DASH)}</g></g>`
      + `<circle class="disc" cx="${sx}" cy="${sy}" r="${R}" fill="${C.paper}" ${INK}/>`
      + `<g class="eq"><path d="${front(sx, sy, R, sph.b)}" ${INK} fill="none"/><path d="${back(sx, sy, R, sph.b)}" ${DASH}/></g>`
      + `<g class="h3">${text(165, 320, '평면도형', { size: 24, color: C.muted })}${text(sx, 320, '평면도형', { size: 24, color: C.muted })}</g>`
      + `<g class="b3"><g class="tag">${text(195, 320, '입체도형', { size: 24, color: C.green })}${text(sx, 320, '입체도형', { size: 24, color: C.green })}</g></g>`;
    put('6-2/수학/6/입체도형', svg(id, body, `
      .sc-${id} .fr,.sc-${id} .disc{stroke-dasharray:600;stroke-dashoffset:600}
      .on1 .sc-${id} .fr,.on1 .sc-${id} .disc{stroke-dashoffset:0;transition:stroke-dashoffset 1.2s ease .2s}
      .sc-${id} .grow{transform:translate(${-d[0]}px,${-d[1]}px)}
      .on2 .sc-${id} .grow{transform:none;transition:transform 1s ease .2s}
      .sc-${id} .late{opacity:0}
      .on2 .sc-${id} .late{opacity:1;transition:opacity .4s ease 1.2s}
      .sc-${id} .eq{transform-box:view-box;transform-origin:${sx}px ${sy}px;transform:scaleY(0)}
      .on2 .sc-${id} .eq{transform:none;transition:transform 1s ease .2s}
      .on2 .sc-${id} .disc{fill:${C.sky};transition:stroke-dashoffset 1.2s ease .2s,fill .8s ease .4s}
      .on3 .sc-${id} .fr{fill:${C.mint};transition:fill .6s ease .3s}
      .on3 .sc-${id} .fc{fill:${C.green};fill-opacity:.3;transition:fill .6s ease .3s,fill-opacity .6s ease .3s}
      .on3 .sc-${id} .disc{fill:${C.blue};fill-opacity:.45;transition:fill .6s ease .3s}
      .sc-${id} .shadow{transform-box:fill-box;transform-origin:center;transform:scaleX(.3)}
      .on3 .sc-${id} .shadow{transform:none;transition:transform .8s ease .2s}
      .sc-${id} .tag{transform-box:fill-box;transform-origin:center}
      .on3 .sc-${id} .tag{animation:${id}-pop .5s ease .6s}
      @keyframes ${id}-pop{50%{transform:scale(1.15)}}
    `));
  }

  // 원기둥: 직사각형 한 변에 막대 → 막대를 축으로 한 바퀴 → 두 원이 위아래에 있는 원기둥
  {
    const id = 't62-m6-wongidung';
    const cx = 320, yT = 80, yB = 260, a = 95;
    const c = cyl(cx, yT, yB, a);
    const rect = `<rect x="${cx}" y="${yT}" width="${a}" height="${yB - yT}" ${SHAPE}/>`;
    const body = `<g class="b3"><g class="solid"><path d="${c.side}" fill="${C.peach}" fill-opacity=".55"/>${c.bottom(`fill="${C.mint}" fill-opacity=".5"`)}${c.top(`class="bs" fill="${C.mint}"`)}${c.lines}</g></g>`
      + `<g class="shape"><g class="rot">${rect}</g></g>`
      + `<g class="h3"><g class="trs">${trace(cx, yT, a, ROT0, ROTT, -2)}${trace(cx, yB, a, ROT0, ROTT, 0)}</g></g>`
      + `<g class="stick">${axis(cx, 40, 300)}</g>`;
    put('6-2/수학/6/원기둥', svg(id, body, `
      .sc-${id} .shape{opacity:0;transform:translateX(40px)}
      .on1 .sc-${id} .shape{opacity:1;transform:none;transition:all .6s ease .2s}
      .sc-${id} .stick{transform-box:fill-box;transform-origin:center top;transform:scaleY(0)}
      .on1 .sc-${id} .stick{transform:none;transition:transform .6s ease .8s}
      ${rotCss(id, cx)}
      .on3 .sc-${id} .shape{opacity:0;transition:opacity .5s ease}
      .on3 .sc-${id} .solid .bs{animation:${id}-flash .7s ease .6s 2}
      .on3 .sc-${id} .solid ellipse{animation:${id}-flash .7s ease .6s 2}
      @keyframes ${id}-flash{50%{fill:${C.green};fill-opacity:.6}}
    `));
  }

  // 밑면: 원기둥의 두 원 → 위 원을 내려 포개면 꼭 맞음 → 원뿔의 원 하나 → 이름표
  {
    const id = 't62-m6-mitmyeon';
    const c = cyl(170, 95, 255, 85), n = cone(460, 70, 255, 100);
    const body = `<path d="${c.side}" fill="${C.paper}"/><path d="${n.side}" fill="${C.paper}"/>`
      + `<g class="b1"><g class="cb">${c.bottom(`fill="${C.mint}" fill-opacity=".7"`)}${c.top(`fill="${C.mint}"`)}</g></g>`
      + `<g class="b3"><g class="nb">${n.base(`fill="${C.mint}" fill-opacity=".7"`)}</g></g>`
      + c.lines + n.lines
      + `<g class="b2 h3"><g class="drop">${c.top(`fill="${C.green}" fill-opacity=".35" stroke="${C.green}" stroke-width="4.5"`)}</g></g>`
      + `<g class="b4">${text(268, 102, '밑면', { size: 24, anchor: 'start', color: C.green })}${text(268, 263, '밑면', { size: 24, anchor: 'start', color: C.green })}${text(568, 263, '밑면', { size: 24, anchor: 'start', color: C.green })}</g>`;
    put('6-2/수학/6/밑면', svg(id, body, `
      .sc-${id} .drop{transform:none}
      .on2 .sc-${id} .drop{animation:${id}-drop 2.2s ease .2s both}
      @keyframes ${id}-drop{0%{transform:none}45%,100%{transform:translateY(160px)}}
      .sc-${id} .cb,.sc-${id} .nb{transform-box:fill-box;transform-origin:center}
      .on3 .sc-${id} .nb{animation:${id}-pulse .8s ease .5s 2}
      .on4 .sc-${id} .cb,.on4 .sc-${id} .nb{animation:${id}-pulse .8s ease .2s 2}
      @keyframes ${id}-pulse{50%{opacity:.35}}
    `));
  }

  // 옆면: 밑면을 칠함 → 원기둥의 굽은 면이 칠해지며 세로줄이 빙 돎 → 원뿔도 → 이름표
  {
    const id = 't62-m6-yeopmyeon';
    const c = cyl(170, 95, 255, 85), n = cone(460, 70, 255, 100);
    const M = 24, T = 4;
    // 원기둥 세로줄: (cx, yT)–(cx, yB) 선을 (a cosφ, b sinφ) 만큼 옮김, 뒤쪽이면 숨김
    let kc = `@keyframes ${id}-mc{`, kn = `@keyframes ${id}-mn{`;
    for (let i = 0; i <= M; i++) {
      const t = 2 * Math.PI * i / M, s = Math.sin(t), co = Math.cos(t);
      kc += `${f(100 * i / M)}%{transform:translate(${f(c.a * co)}px,${f(c.b * s)}px);opacity:${s > 0.05 ? 1 : 0}}`;
      const sc = (n.H + n.b * s) / n.H, al = Math.atan(n.a * co / (sc * n.H)) * 180 / Math.PI;
      kn += `${f(100 * i / M)}%{transform:skewX(${f(al)}deg) scaleY(${sc.toFixed(4)});opacity:${s > n.hide + 0.05 ? 1 : 0}}`;
    }
    kc += '}'; kn += '}';
    const lineC = (i) => `<path class="mc" style="animation-delay:-${f(T * i / 4)}s" d="M${c.cx} ${c.yT} V${c.yB}" stroke="${C.orange}" stroke-width="2.5"/>`;
    const lineN = (i) => `<path class="mn" style="animation-delay:-${f(T * i / 4)}s" d="M${n.cx} ${n.yA} V${n.yB}" stroke="${C.orange}" stroke-width="2.5"/>`;
    const body = `<g class="b1">${c.bottom(`fill="${C.mint}" fill-opacity=".7"`)}${n.base(`fill="${C.mint}" fill-opacity=".7"`)}</g>`
      + `<g class="b2"><g class="sc">${`<path d="${c.side}" fill="${C.peach}"/>`}${[0, 1, 2, 3].map(lineC).join('')}</g></g>`
      + `<g class="b3"><g class="sn">${`<path d="${n.side}" fill="${C.peach}"/>`}${[0, 1, 2, 3].map(lineN).join('')}</g></g>`
      + `<g class="b1">${c.top(`fill="${C.mint}"`)}</g>`
      + c.lines + n.lines
      + `<g class="b4">${text(268, 182, '옆면', { size: 24, anchor: 'start', color: C.orange })}${text(548, 200, '옆면', { size: 24, anchor: 'start', color: C.orange })}</g>`;
    put('6-2/수학/6/옆면', svg(id, body, `
      .sc-${id} .sc,.sc-${id} .sn{opacity:0}
      .on2 .sc-${id} .sc{opacity:1;transition:opacity .6s ease .2s}
      .on3 .sc-${id} .sn{opacity:1;transition:opacity .6s ease .2s}
      .sc-${id} .mc{opacity:0}
      .on2 .sc-${id} .mc{animation:${id}-mc ${T}s linear infinite}
      .sc-${id} .mn{opacity:0;transform-box:view-box;transform-origin:${n.cx}px ${n.yA}px}
      .on3 .sc-${id} .mn{animation:${id}-mn ${T}s linear infinite}
      ${kc}${kn}
    `));
  }

  // 높이: 원기둥의 두 밑면 사이를 곧게 → 원뿔 꼭짓점에서 밑면에 수직으로 내린 선분 → 두 높이가 반짝
  {
    const id = 't62-m6-nopi';
    const c = cyl(170, 95, 255, 80), n = cone(470, 60, 270, 110);
    const rx = c.cx + c.a;
    const body = `<path d="${c.side}" fill="${C.paper}"/>${c.bottom(`fill="${C.mint}" fill-opacity=".6"`)}${c.top(`fill="${C.mint}"`)}`
      + `<path d="${n.side}" fill="${C.paper}"/>${n.base(`fill="${C.mint}" fill-opacity=".6"`)}`
      + c.lines + n.lines
      + `<g class="b1"><path class="dr h1" pathLength="1" d="M${rx} ${c.yT} V${c.yB}" stroke="${C.blue}" stroke-width="7" stroke-linecap="round" fill="none"/>`
      + `<g class="mk"><path d="M${rx - 15} ${c.yT} V${c.yT + 15} H${rx}" stroke="${C.red}" stroke-width="3" fill="none"/><path d="M${rx - 15} ${c.yB} V${c.yB - 15} H${rx}" stroke="${C.red}" stroke-width="3" fill="none"/></g>`
      + `${text(rx + 14, 183, '높이', { size: 24, anchor: 'start', color: C.blue })}</g>`
      + `<g class="b2"><g class="plumb"><path class="h2l" d="M${n.cx} ${n.yA} V${n.yB}" stroke="${C.blue}" stroke-width="5" stroke-dasharray="10 7" fill="none"/></g>`
      + `<g class="mk2"><path d="M${n.cx + 16} ${n.yB} V${n.yB - 16} H${n.cx}" stroke="${C.red}" stroke-width="3" fill="none"/>${dot([n.cx, n.yB], 5, C.blue)}</g>`
      + `${text(n.cx - 12, 190, '높이', { size: 24, anchor: 'end', color: C.blue })}</g>`
      + dot(n.A, 5);
    put('6-2/수학/6/높이', svg(id, body, `
      .sc-${id} .dr{stroke-dasharray:1 1;stroke-dashoffset:1}
      .on1 .sc-${id} .dr{stroke-dashoffset:0;transition:stroke-dashoffset 1s ease .3s}
      .sc-${id} .mk,.sc-${id} .mk2{opacity:0}
      .on1 .sc-${id} .mk{opacity:1;transition:opacity .4s ease 1.3s}
      .on2 .sc-${id} .mk2{opacity:1;transition:opacity .4s ease 1.3s}
      .sc-${id} .plumb{transform-box:view-box;transform-origin:${n.cx}px ${n.yA}px;transform:scaleY(0)}
      .on2 .sc-${id} .plumb{transform:none;transition:transform 1s ease-in .3s}
      .on3 .sc-${id} .h1,.on3 .sc-${id} .h2l{animation:${id}-glow 1s ease-in-out .2s 2}
      @keyframes ${id}-glow{50%{stroke:${C.orange}}}
    `));
  }

  // 전개도: 옆면의 곧은 선과 두 밑면 둘레를 자름 → 옆면은 직사각형, 밑면은 원으로 펼침 → 같은 길이끼리 색 → 전개도 반짝
  {
    const id = 't62-m6-jeongaedo';
    const c = cyl(120, 110, 250, 50);
    const W = 2 * Math.PI * c.a, rx = 290, ry = c.yT, h = c.yB - c.yT;
    const top = [360, ry - c.a], bot = [360, ry + h + c.a];
    const ghost = `<path d="${c.side}" fill="${C.paper}"/>${c.bottom(`fill="${C.mint}" fill-opacity=".6"`)}${c.top(`fill="${C.mint}"`)}${c.lines}`;
    const cuts = `<path class="dr" pathLength="1" d="M${c.cx} ${f(c.yT + c.b)} V${f(c.yB + c.b)}" stroke="${C.red}" stroke-width="4.5" fill="none" style="--d:.2s"/>`
      + c.top(`class="dr" pathLength="1" fill="none" stroke="${C.red}" stroke-width="4.5" style="--d:.9s"`)
      + `<path class="dr" pathLength="1" d="${front(c.cx, c.yB, c.a, c.b)}" stroke="${C.red}" stroke-width="4.5" fill="none" style="--d:1.4s"/>`
      + `<path d="${back(c.cx, c.yB, c.a, c.b)}" class="dr" pathLength="1" stroke="${C.red}" stroke-width="3.5" stroke-dasharray=".04 .035" fill="none" style="--d:1.4s"/>`;
    const sideCx = rx + W / 2, sideCy = ry + h / 2;
    const net = `<g class="pc" style="--tx:${px(c.cx - sideCx)};--ty:0px;--sx:${(2 * c.a / W).toFixed(3)};--sy:1;transform-origin:${f(sideCx)}px ${f(sideCy)}px">`
      + `<rect x="${rx}" y="${ry}" width="${f(W)}" height="${h}" fill="${C.peach}" stroke="${C.ink}" stroke-width="3"/></g>`
      + `<g class="pc" style="--tx:${px(c.cx - top[0])};--ty:${px(c.yT - top[1])};--sx:1;--sy:${K};transform-origin:${top[0]}px ${top[1]}px"><circle cx="${top[0]}" cy="${top[1]}" r="${c.a}" fill="${C.mint}" stroke="${C.ink}" stroke-width="3"/></g>`
      + `<g class="pc" style="--tx:${px(c.cx - bot[0])};--ty:${px(c.yB - bot[1])};--sx:1;--sy:${K};transform-origin:${bot[0]}px ${bot[1]}px"><circle cx="${bot[0]}" cy="${bot[1]}" r="${c.a}" fill="${C.mint}" stroke="${C.ink}" stroke-width="3"/></g>`;
    const marks = `<g class="b3"><path d="M${rx} ${ry} H${f(rx + W)} M${rx} ${ry + h} H${f(rx + W)}" stroke="${C.red}" stroke-width="6" stroke-linecap="round"/>`
      + `<circle cx="${top[0]}" cy="${top[1]}" r="${c.a}" fill="none" stroke="${C.red}" stroke-width="5"/><circle cx="${bot[0]}" cy="${bot[1]}" r="${c.a}" fill="none" stroke="${C.red}" stroke-width="5"/>`
      + `<path d="M${rx} ${ry} V${ry + h} M${f(rx + W)} ${ry} V${ry + h}" stroke="${C.blue}" stroke-width="6" stroke-linecap="round"/>`
      + `<g class="gm">${c.top(`fill="none" stroke="${C.red}" stroke-width="4.5"`)}<path d="M${f(c.cx + c.a)} ${c.yT} V${c.yB}" stroke="${C.blue}" stroke-width="6" stroke-linecap="round"/></g></g>`;
    const body = `<g class="gh">${ghost}</g><g class="b1 h2">${cuts}</g>` + net + marks;
    put('6-2/수학/6/전개도', svg(id, body, `
      .sc-${id} .dr{stroke-dashoffset:1}
      .sc-${id} .dr:not([stroke-dasharray]){stroke-dasharray:1 1}
      .on1 .sc-${id} .dr{stroke-dashoffset:0;transition:stroke-dashoffset .6s linear var(--d)}
      .on2 .sc-${id} .gh{opacity:.3;transition:opacity .5s ease}
      .on3 .sc-${id} .gh{opacity:.6}
      .sc-${id} .pc{opacity:0;transform-box:view-box;transform:translate(var(--tx),var(--ty)) scale(var(--sx),var(--sy))}
      .on2 .sc-${id} .pc{opacity:1;transform:none;transition:transform 1.3s ease .3s,opacity .3s ease .2s}
      .on4 .sc-${id} .pc{animation:${id}-glow 1s ease-in-out .2s 2}
      @keyframes ${id}-glow{50%{opacity:.45}}
    `));
  }

  // 원뿔: 직각삼각형의 직각을 낀 변에 막대 → 한 바퀴 → 원 하나 위로 뾰족한 원뿔
  {
    const id = 't62-m6-wonppul';
    const cx = 320, yA = 70, yB = 260, a = 120;
    const n = cone(cx, yA, yB, a);
    const tri = `<path d="M${cx} ${yA} L${cx} ${yB} L${cx + a} ${yB} Z" ${SHAPE}/><path d="M${cx + 16} ${yB} V${yB - 16} H${cx}" stroke="${C.red}" stroke-width="3" fill="none"/>`;
    const body = `<g class="b3"><g class="solid"><path d="${n.side}" fill="${C.peach}" fill-opacity=".55"/>${n.base(`class="bs" fill="${C.mint}" fill-opacity=".7"`)}${n.lines}${dot(n.A, 6)}</g></g>`
      + `<g class="shape"><g class="rot">${tri}</g></g>`
      + `<g class="h3">${trace(cx, yB, a, ROT0, ROTT, n.hide)}</g>`
      + `<g class="stick">${axis(cx, 40, 300)}</g>`;
    put('6-2/수학/6/원뿔', svg(id, body, `
      .sc-${id} .shape{opacity:0;transform:translateX(40px)}
      .on1 .sc-${id} .shape{opacity:1;transform:none;transition:all .6s ease .2s}
      .sc-${id} .stick{transform-box:fill-box;transform-origin:center top;transform:scaleY(0)}
      .on1 .sc-${id} .stick{transform:none;transition:transform .6s ease .8s}
      ${rotCss(id, cx)}
      .on3 .sc-${id} .shape{opacity:0;transition:opacity .5s ease}
      .on3 .sc-${id} .bs{animation:${id}-flash .7s ease .6s 2}
      @keyframes ${id}-flash{50%{fill:${C.green};fill-opacity:.6}}
    `));
  }

  // 원뿔의 꼭짓점: 원뿔 → 옆면을 따라 올라간 선들이 한 점에서 만남 → 그 점에 이름
  {
    const id = 't62-m6-kkokjitjeom';
    const n = cone(260, 60, 270, 130);
    const ups = [20, 55, 90, 125, 160].map((deg, i) => seg(n.rim(deg), n.A, `class="dr" pathLength="1" style="--d:${f(0.2 + 0.18 * i)}s" stroke="${C.orange}" stroke-width="3.5" stroke-linecap="round"`)).join('');
    const body = `<g class="whole"><path d="${n.side}" fill="${C.peach}" fill-opacity=".6"/>${n.base(`fill="${C.mint}" fill-opacity=".7"`)}${n.lines}</g>`
      + `<g class="b2">${ups}<g class="pt">${dot(n.A, 9, C.red)}</g></g>`
      + `<g class="b3"><g class="ring"><circle cx="${n.A[0]}" cy="${n.A[1]}" r="16" fill="none" stroke="${C.red}" stroke-width="3.5"/></g>`
      + `<path d="M312 66 L282 61" stroke="${C.red}" stroke-width="3" stroke-linecap="round"/>${text(320, 74, '원뿔의 꼭짓점', { size: 26, anchor: 'start', color: C.red })}</g>`;
    put('6-2/수학/6/원뿔의 꼭짓점', svg(id, body, `
      .sc-${id} .whole{opacity:0;transform:translateY(20px)}
      .on1 .sc-${id} .whole{opacity:1;transform:none;transition:all .7s ease .2s}
      .sc-${id} .dr{stroke-dasharray:1 1;stroke-dashoffset:1}
      .on2 .sc-${id} .dr{stroke-dashoffset:0;transition:stroke-dashoffset .7s ease-in var(--d)}
      .sc-${id} .pt{transform-box:fill-box;transform-origin:center;transform:scale(0)}
      .on2 .sc-${id} .pt{transform:none;transition:transform .35s cubic-bezier(.3,1.6,.6,1) 1.6s}
      .sc-${id} .ring{transform-box:fill-box;transform-origin:center}
      .on3 .sc-${id} .ring{animation:${id}-ring 1.2s ease-in-out infinite}
      @keyframes ${id}-ring{0%,100%{transform:scale(1)}50%{transform:scale(1.4)}}
    `));
  }

  // 모선: 꼭짓점과 밑면 둘레의 한 점을 이음 → 둘레를 돌며 여럿 → 옆 선 하나를 세워 높이와 견줌 → 모선 반짝
  {
    const id = 't62-m6-moseon';
    const n = cone(220, 60, 270, 135);
    const g0 = 60;
    const others = [0, 30, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => {
      const s = Math.sin(deg * Math.PI / 180), hidden = s < n.hide;
      return seg(n.A, n.rim(deg), `class="gl" style="--d:${f(0.15 + 0.13 * i)}s" stroke="${C.orange}" stroke-width="3"${hidden ? ' stroke-dasharray="7 6" stroke-opacity=".75"' : ''}`);
    }).join('');
    const G0 = n.rim(g0);
    const gl = Math.hypot(G0[0] - n.A[0], G0[1] - n.A[1]);
    const tilt = Math.atan2(G0[0] - n.A[0], G0[1] - n.A[1]) * 180 / Math.PI;
    const bx = 470, hx = 540;
    const body = `<path d="${n.side}" fill="${C.paper}"/>${n.base(`fill="${C.mint}" fill-opacity=".6"`)}${n.lines}`
      + `<g class="b2">${others}</g>`
      + `<g class="first">${seg(n.A, n.rim(g0), `class="dr" pathLength="1" stroke="${C.orange}" stroke-width="5.5" stroke-linecap="round"`)}${dot(n.rim(g0), 6, C.orange)}</g>`
      + `<g class="b3"><path d="M${n.cx} ${n.yA} V${n.yB}" stroke="${C.blue}" stroke-width="4" stroke-dasharray="9 7"/>`
      + `<path d="M${n.cx + 15} ${n.yB} V${n.yB - 15} H${n.cx}" stroke="${C.red}" stroke-width="3" fill="none"/>`
      + `<g class="cg" style="--tx:${px(n.A[0] - bx)};--rot:${f(-tilt)}deg">${seg([bx, n.yA], [bx, n.yA + gl], `stroke="${C.orange}" stroke-width="7" stroke-linecap="round"`)}</g>`
      + `<g class="chh" style="--tx:${px(n.cx - hx)}">${seg([hx, n.yA], [hx, n.yB], `stroke="${C.blue}" stroke-width="7" stroke-linecap="round"`)}</g>`
      + `<g class="lab">${text(bx, 46, '모선', { size: 24, color: C.orange })}${text(hx, 46, '높이', { size: 24, color: C.blue })}`
      + `<path d="M${bx - 22} ${f(n.yA + gl)} H${hx + 22}" stroke="${C.muted}" stroke-width="2" stroke-dasharray="4 4"/></g></g>`
      + dot(n.A, 6);
    put('6-2/수학/6/모선', svg(id, body, `
      .sc-${id} .dr{stroke-dasharray:1 1;stroke-dashoffset:1}
      .on1 .sc-${id} .dr{stroke-dashoffset:0;transition:stroke-dashoffset .9s ease .3s}
      .sc-${id} .gl{opacity:0}
      .on2 .sc-${id} .gl{opacity:1;transition:opacity .2s ease var(--d)}
      .on3 .sc-${id} .gl{opacity:.35;transition:opacity .4s ease}
      .sc-${id} .cg{transform-box:view-box;transform-origin:${bx}px ${n.yA}px;transform:translateX(var(--tx)) rotate(var(--rot))}
      .on3 .sc-${id} .cg{transform:none;transition:transform 1.1s ease .4s}
      .sc-${id} .chh{transform:translateX(var(--tx))}
      .on3 .sc-${id} .chh{transform:none;transition:transform 1.1s ease .4s}
      .sc-${id} .lab{opacity:0}
      .on3 .sc-${id} .lab{opacity:1;transition:opacity .4s ease 1.5s}
      .on4 .sc-${id} .gl{opacity:1}
      .on4 .sc-${id} .first,.on4 .sc-${id} .gl{animation:${id}-glow 1s ease-in-out .2s 2}
      @keyframes ${id}-glow{50%{stroke:${C.red}}}
      .on4 .sc-${id} .first path{animation:${id}-glow 1s ease-in-out .2s 2}
    `));
  }

  // 반원 만들기(구·구의 반지름 공통): 원 → 지름을 따라 반으로 나눔
  const semi = (cx, cy, R) => `M${cx} ${cy - R} A${R} ${R} 0 0 1 ${cx} ${cy + R} Z`;
  const semiLeft = (cx, cy, R) => `M${cx} ${cy - R} A${R} ${R} 0 0 0 ${cx} ${cy + R} Z`;

  // 구: 원을 반으로 나눈 반원 → 지름을 축으로 한 바퀴 → 공 모양
  {
    const id = 't62-m6-gu';
    const cx = 320, cy = 185, R = 115;
    const s = ball(cx, cy, R);
    const body = `<g class="b3"><g class="solid"><circle cx="${cx}" cy="${cy}" r="${R}" fill="${C.sky}"/>${s.lines}</g></g>`
      + `<g class="cutL"><path d="${semiLeft(cx, cy, R)}" fill="${C.peach}" fill-opacity=".5" stroke="${C.orange}" stroke-width="3" stroke-dasharray="7 5"/></g>`
      + `<g class="shape"><g class="rot"><path d="${semi(cx, cy, R)}" ${SHAPE}/></g></g>`
      + `<g class="h3">${trace(cx, cy, R, ROT0, ROTT, 0)}</g>`
      + `<g class="stick">${axis(cx, 45, 325)}</g>`;
    put('6-2/수학/6/구', svg(id, body, `
      .sc-${id} .shape,.sc-${id} .cutL{opacity:0}
      .on1 .sc-${id} .shape{opacity:1;transition:opacity .5s ease .2s}
      .on1 .sc-${id} .cutL{animation:${id}-away 1.6s ease .2s both}
      @keyframes ${id}-away{0%{opacity:0;transform:none}25%,45%{opacity:1;transform:none}100%{opacity:0;transform:translateX(-90px)}}
      .sc-${id} .stick{transform-box:fill-box;transform-origin:center top;transform:scaleY(0)}
      .on1 .sc-${id} .stick{transform:none;transition:transform .6s ease 1s}
      ${rotCss(id, cx)}
      .on3 .sc-${id} .shape{opacity:0;transition:opacity .5s ease}
      .sc-${id} .solid{transform-box:fill-box;transform-origin:center}
      .on3 .sc-${id} .solid{animation:${id}-pop .6s ease .5s}
      @keyframes ${id}-pop{50%{transform:scale(1.05)}}
    `));
  }

  // 구의 중심: 구 → 위쪽 반을 들어 올리면 자른 면 한가운데 점 → 그 점에 이름
  {
    const id = 't62-m6-gu-jungsim';
    const cx = 290, cy = 218, R = 110;
    const s = ball(cx, cy, R), b = s.b;
    const upper = `M${cx - R} ${cy} A${R} ${R} 0 0 1 ${cx + R} ${cy} A${R} ${f(b)} 0 0 1 ${cx - R} ${cy} Z`;
    const lower = `M${cx - R} ${cy} A${R} ${R} 0 0 0 ${cx + R} ${cy} Z`;
    const body = `<path d="${lower}" fill="${C.sky}" ${INK}/>${ell(cx, cy, R, b, `fill="${C.mint}" ${INK}`)}`
      + `<g class="b2"><g class="ctr">${dot([cx, cy], 8, C.red)}</g></g>`
      + `<g class="lid"><path d="${upper}" fill="${C.sky}" ${INK}/></g>`
      + `<g class="h2"><path d="${back(cx, cy, R, b)}" ${DASH}/></g>`
      + `<g class="b3"><g class="ring"><circle cx="${cx}" cy="${cy}" r="16" fill="none" stroke="${C.red}" stroke-width="3.5"/></g>`
      + `<path d="M${cx + 150} ${cy + 70} L${cx + 14} ${cy + 8}" stroke="${C.red}" stroke-width="3" stroke-linecap="round"/>`
      + `${text(cx + 156, cy + 80, '구의 중심', { size: 26, anchor: 'start', color: C.red })}</g>`;
    put('6-2/수학/6/구의 중심', svg(id, body, `
      .on2 .sc-${id} .lid{transform:translate(0px,-98px);transition:transform 1.2s ease .3s}
      .sc-${id} .ctr{transform-box:fill-box;transform-origin:center;transform:scale(0)}
      .on2 .sc-${id} .ctr{transform:none;transition:transform .35s cubic-bezier(.3,1.6,.6,1) 1.5s}
      .sc-${id} .ring{transform-box:fill-box;transform-origin:center}
      .on3 .sc-${id} .ring{animation:${id}-ring 1.2s ease-in-out infinite}
      @keyframes ${id}-ring{0%,100%{transform:scale(1)}50%{transform:scale(1.4)}}
    `));
  }

  // 구의 반지름: 반원의 중심에서 둘레까지 선분 → 반원을 돌려 구 → 중심에서 겉면까지 같은 선분 여럿
  {
    const id = 't62-m6-gu-banjireum';
    const cx = 280, cy = 185, R = 115;
    const s = ball(cx, cy, R);
    const at = (deg) => [cx + R * Math.cos(deg * Math.PI / 180), cy + R * Math.sin(deg * Math.PI / 180)];
    const r0 = -40;
    const radius = (deg, cls = '', st = '') => `<g class="${cls}"${st}>${seg([cx, cy], at(deg), `stroke="${C.orange}" stroke-width="5" stroke-linecap="round"`)}${dot(at(deg), 6, C.orange)}</g>`;
    const more = [-160, -100, 20, 80, 140].map((deg, i) => radius(deg, 'more', ` style="--d:${f(0.2 + 0.25 * i)}s"`)).join('');
    const lab = at(r0);
    const body = `<g class="b3"><g class="solid"><circle cx="${cx}" cy="${cy}" r="${R}" fill="${C.sky}"/>${s.lines}</g></g>`
      + `<g class="shape"><g class="rot"><path d="${semi(cx, cy, R)}" ${SHAPE}/>${radius(r0)}</g></g>`
      + `<g class="h3">${trace(cx, cy, R, ROT0, ROTT, 0)}</g>`
      + `<g class="b3">${more}${radius(r0)}</g>`
      + `<g class="stick">${axis(cx, 45, 325)}</g>` + dot([cx, cy], 7)
      + `<g class="b3"><g class="lab"><path d="M${f(lab[0] + 64)} ${f(lab[1] - 30)} L${f((cx + lab[0]) / 2 + 10)} ${f((cy + lab[1]) / 2 - 8)}" stroke="${C.red}" stroke-width="3" stroke-linecap="round"/>`
      + `${text(f(lab[0] + 70), f(lab[1] - 32), '구의 반지름', { size: 26, anchor: 'start', color: C.red })}</g></g>`;
    put('6-2/수학/6/구의 반지름', svg(id, body, `
      .sc-${id} .shape{opacity:0}
      .on1 .sc-${id} .shape{opacity:1;transition:opacity .6s ease .2s}
      .sc-${id} .stick{transform-box:fill-box;transform-origin:center top;transform:scaleY(0)}
      .on1 .sc-${id} .stick{transform:none;transition:transform .6s ease .6s}
      ${rotCss(id, cx)}
      .on3 .sc-${id} .shape{opacity:0;transition:opacity .4s ease}
      .on3 .sc-${id} .stick{opacity:.2;transition:opacity .4s ease}
      .sc-${id} .more{transform-box:view-box;transform-origin:${cx}px ${cy}px;transform:scale(0)}
      .on3 .sc-${id} .more{transform:none;transition:transform .35s ease-out var(--d)}
      .sc-${id} .lab{opacity:0}
      .on3 .sc-${id} .lab{opacity:1;transition:opacity .4s ease 1.5s}
    `));
  }
})(typeof window !== 'undefined' ? window : globalThis);
