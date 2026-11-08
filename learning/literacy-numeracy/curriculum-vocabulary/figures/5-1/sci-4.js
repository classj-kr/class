// 과학 5-1 낱말 도식(4단원 우리 몸의 구조와 기능 — 호흡·배설): 노폐물, 호흡, 숨관, 숨관가지, 배설, 콩팥, 방광, 요도를 코드로 그린다.
// 몸은 머리·몸통 윤곽만 있는 단순한 선 그림 둘(가슴을 크게 본 chest, 배까지 보이는 belly)을 같이 쓴다.
// 색 약속: 공기는 눈에 보이지 않으므로 파란 점선 동그라미, 혈액은 빨강, 노폐물은 회색 알갱이, 오줌은 옅은 노랑 알갱이.
// 교과서(미래엔·아이스크림)대로 공기 길은 코 → 숨관 → 숨관가지 → 폐, 오줌 길은 콩팥 → 오줌관 → 방광 → 요도.
// 움직임은 transform·opacity·stroke-dashoffset 만 쓴다(아이패드 사파리).
(function (root) {
  'use strict';
  const { C, svg, text, put } = root.FigureKit;
  const f = (n) => +(+n).toFixed(1);
  const dl = (s) => (s ? ` style="animation-delay:${s}s"` : '');
  const g = (cls, inner, s = 0) => `<g class="${cls}"${dl(s)}>${inner}</g>`;
  // 칸 n 에 나타나며 kind(pop·fin·rise) 움직임을 한 번 한다
  const at = (n, kind, inner, s = 0) => `<g class="b${n}">${g(`${kind} ${kind}${n}`, inner, s)}</g>`;
  const atH = (n, hide, kind, inner, s = 0) => `<g class="b${n} h${hide}">${g(`${kind} ${kind}${n}`, inner, s)}</g>`;
  const shown = (n, inner, hide) => `<g class="b${n}${hide ? ' h' + hide : ''}">${inner}</g>`;
  // 글자 폭 어림(맑은 고딕 굵게: 한글 1em, 숫자·기호 .6em, 빈칸 .3em)
  const tw = (s, size) => [...String(s)].reduce((a, c) => a + (/[가-힣]/.test(c) ? 1 : c === ' ' ? 0.3 : 0.6), 0) * size;
  const HOT = [C.peach, C.orange], COLD = [C.sky, C.blue], OK = [C.mint, C.green], GRAY = ['white', C.muted], PEE = ['#fdf3d0', C.orange], BLOOD = ['white', C.red];
  // dot: 꼬리표 앞에 그 알갱이 모양을 하나 그려 넣는다(dot(x, y) 꼴)
  const tag = (cx, cy, label, [fill, stroke] = OK, { size = 20, dash = false, dot = null } = {}) => {
    const pad = dot ? 22 : 0, w = Math.round(tw(label, size) + size * 1.3 + pad), h = Math.round(size * 1.7);
    return `<g><rect x="${f(cx - w / 2)}" y="${f(cy - h / 2)}" width="${w}" height="${h}" rx="${h / 2}" fill="${fill}" stroke="${stroke}" stroke-width="2.5"${dash ? ' stroke-dasharray="6 4"' : ''}/>${dot ? dot(cx - w / 2 + size * 0.65 + 6, cy) : ''}${text(f(cx + pad / 2), f(cy + size * 0.36), label, { size })}</g>`;
  };
  const lead = (x1, y1, x2, y2, color = C.muted) => `<path d="M${f(x1)} ${f(y1)} L${f(x2)} ${f(y2)}" stroke="${color}" stroke-width="2.5" stroke-linecap="round"/><circle cx="${f(x2)}" cy="${f(y2)}" r="3.5" fill="${color}"/>`;
  const head = (x, y, ang, color, w = 4) => {
    const l = 8 + w * 1.4, p = (d) => `${f(x - l * Math.cos(ang + d))} ${f(y - l * Math.sin(ang + d))}`;
    return `<path d="M${p(-0.5)} L${f(x)} ${f(y)} L${p(0.5)}" stroke="${color}" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  };
  const solid = (x1, y1, x2, y2, color, w = 4) => {
    const ang = Math.atan2(y2 - y1, x2 - x1);
    return `<path d="M${f(x1)} ${f(y1)} L${f(x2 - w * Math.cos(ang))} ${f(y2 - w * Math.sin(ang))}" stroke="${color}" stroke-width="${w}" stroke-linecap="round"/>${head(x2, y2, ang, color, w)}`;
  };
  // 공기: 눈에 안 보이므로 점선 테두리
  const air = (x, y, r = 6.5) => `<circle cx="${f(x)}" cy="${f(y)}" r="${r}" fill="white" stroke="${C.blue}" stroke-width="2.5" stroke-dasharray="3.5 2.5"/>`;
  const waste = (x, y, r = 5) => `<circle cx="${f(x)}" cy="${f(y)}" r="${r}" fill="${C.muted}" stroke="white" stroke-width="1.5"/>`;
  const pee = (x, y, r = 5.5) => `<circle cx="${f(x)}" cy="${f(y)}" r="${r}" fill="${C.yellow}" fill-opacity=".55" stroke="${C.yellow}" stroke-width="2"/>`;
  const cellR = (x, y, r = 5.5) => `<circle cx="${f(x)}" cy="${f(y)}" r="${r}" fill="${C.red}" fill-opacity=".8"/>`;
  const nut = (x, y, r = 5.5) => `<circle cx="${f(x)}" cy="${f(y)}" r="${r}" fill="${C.orange}" stroke="white" stroke-width="1.5"/>`;
  const ring = (cx, cy, r, n, color = C.green, s = 0) => `<g class="b${n}"><circle class="ring ring${n}"${dl(s)} cx="${f(cx)}" cy="${f(cy)}" r="${r}" fill="none" stroke="${color}" stroke-width="4"/></g>`;
  const zoomLines = ([x1, y1], r1, [x2, y2], r2) => {
    const d = Math.hypot(x2 - x1, y2 - y1), nx = -(y2 - y1) / d, ny = (x2 - x1) / d;
    return [1, -1].map((k) => `<path d="M${f(x1 + k * r1 * nx)} ${f(y1 + k * r1 * ny)} L${f(x2 + k * r2 * nx)} ${f(y2 + k * r2 * ny)}" stroke="${C.muted}" stroke-width="2.5" stroke-dasharray="7 5"/>`).join('');
  };
  // 칸마다 바뀌는 CSS 값(vals[0] 은 첫 칸이 열리기 전 모습)
  const states = (id, cls, prop, vals, sec = 2, delay = 0.2) => `.sc-${id} .${cls} { ${prop}: ${vals[0]}; transition: ${prop} ${sec}s ease-in-out ${delay}s; }`
    + vals.slice(1).map((v, i) => v == null ? '' : `.on${i + 1} .sc-${id} .${cls} { ${prop}: ${v}; }`).join('');
  // 꺾은선 길을 따라 가는 움직임: pts[0] 에 놓인 알갱이가 a%~b% 동안 길을 따라 간다
  const route = (name, pts, { a = 0, b = 100, fade = 6 } = {}) => {
    const L = [0];
    for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
    const tot = L[L.length - 1], [x0, y0] = pts[0], fr = {};
    const put1 = (p, k, v) => { (fr[f(p)] = fr[f(p)] || {})[k] = v; };
    const tr = (p) => `translate(${f(p[0] - x0)}px, ${f(p[1] - y0)}px)`;
    put1(0, 'opacity', 0); put1(0, 'transform', tr(pts[0]));
    put1(a, 'opacity', 0); put1(a + fade, 'opacity', 1); put1(b - fade, 'opacity', 1); put1(b, 'opacity', 0); put1(100, 'opacity', 0);
    pts.forEach((p, i) => put1(a + (b - a) * L[i] / tot, 'transform', tr(p)));
    put1(100, 'transform', tr(pts[pts.length - 1]));
    return `@keyframes ${name} { ${Object.keys(fr).map(Number).sort((x, y) => x - y).map((k) => `${k}% { ${Object.entries(fr[k]).map(([p, v]) => `${p}: ${v};`).join(' ')} }`).join(' ')} }`;
  };
  // 세 점 베지어를 꺾은선으로
  const bez = (P, n = 8) => Array.from({ length: n + 1 }, (_, i) => {
    const t = i / n, u = 1 - t;
    return [0, 1].map((k) => u * u * u * P[0][k] + 3 * u * u * t * P[1][k] + 3 * u * t * t * P[2][k] + t * t * t * P[3][k]);
  });
  const rev = (pts) => pts.slice().reverse();

  // 장면마다 같이 쓰는 움직임
  const base = (id) => {
    let s = `
    .sc-${id} .pop, .sc-${id} .ring, .sc-${id} .pulse { transform-box: fill-box; transform-origin: center; }
    .sc-${id} .mar { animation: ${id}-mar .9s linear infinite; }
    .sc-${id} .draw { stroke-dasharray: 1; stroke-dashoffset: 1; transition: stroke-dashoffset 1.2s ease-in-out .2s; }
    .sc-${id} .ring { opacity: 0; }
    @keyframes ${id}-pop { 0% { opacity: 0; transform: scale(.3); } 70% { opacity: 1; transform: scale(1.12); } 100% { opacity: 1; transform: scale(1); } }
    @keyframes ${id}-fin { from { opacity: 0; } to { opacity: 1; } }
    @keyframes ${id}-rise { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
    @keyframes ${id}-pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }
    @keyframes ${id}-flash { 0% { opacity: 0; } 20% { opacity: 1; } 40% { opacity: .25; } 60% { opacity: 1; } 80% { opacity: .25; } 100% { opacity: 1; } }
    @keyframes ${id}-ring { 0% { opacity: .9; transform: scale(1); } 100% { opacity: 0; transform: scale(1.6); } }
    @keyframes ${id}-mar { from { stroke-dashoffset: 36; } to { stroke-dashoffset: 0; } }
    @keyframes ${id}-glow { 0%, 100% { opacity: .55; } 50% { opacity: 1; } }
    @keyframes ${id}-go { 0% { opacity: 0; transform: translate(0, 0); } 18% { opacity: 1; } 82% { opacity: 1; } 100% { opacity: 0; transform: translate(var(--dx, 0), var(--dy, 0)); } }
    .sc-${id} .go { animation: ${id}-go 2.2s ease-in-out infinite; }
    `;
    for (let n = 1; n <= 5; n++) s += `
    .on${n} .sc-${id} .pop${n} { animation: ${id}-pop .5s ease-out both; }
    .on${n} .sc-${id} .fin${n} { animation: ${id}-fin .5s ease-out both; }
    .on${n} .sc-${id} .rise${n} { animation: ${id}-rise .5s ease-out both; }
    .on${n} .sc-${id} .pulse${n} { animation: ${id}-pulse .8s ease-in-out .3s 3; }
    .on${n} .sc-${id} .flash${n} { animation: ${id}-flash 1.4s ease-in-out both; }
    .on${n} .sc-${id} .ring${n} { animation: ${id}-ring 1.1s ease-out .3s 2; }
    .on${n} .sc-${id} .draw${n} { stroke-dashoffset: 0; }
    .sc-${id} .glow${n} { opacity: 0; } .on${n} .sc-${id} .glow${n} { animation: ${id}-glow 2s ease-in-out .3s infinite; }`;
    return s;
  };
  // 길 위를 되풀이해 가는 알갱이들: 같은 길에 delays 만큼 엇갈려 놓는다
  const riders = (cls, pts, draw, delays) => delays.map((s) => `<g class="${cls}" style="animation-delay:${f(s)}s">${draw(pts[0][0], pts[0][1])}</g>`).join('');

  // ════════ 가슴을 크게 본 몸(호흡기관) ════════
  const RX = 200, BIF = [200, 206], NOSE = [200, 78];
  const mx = (p) => [2 * RX - p[0], p[1]];
  const chestBody = () => `<path d="M184 90 L184 118 Q184 130 160 134 L122 141 Q97 147 95 175 L95 364 L305 364 L305 175 Q303 147 278 141 L240 134 Q216 130 216 118 L216 90 Z" fill="white" stroke="${C.muted}" stroke-width="3" stroke-linejoin="round"/>`
    + `<circle cx="200" cy="56" r="40" fill="white" stroke="${C.muted}" stroke-width="3"/>`
    + `<circle cx="186" cy="46" r="3.5" fill="${C.ink}"/><circle cx="214" cy="46" r="3.5" fill="${C.ink}"/>`;
  const noseLine = `<path d="M200 50 Q197 60 193 66 Q200 71 207 66" stroke="${C.muted}" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  const lungD = (k) => {
    const X = (x) => f(RX + k * (x - RX));
    return `M${X(178)} 150 C${X(150)} 150 ${X(122)} 200 ${X(116)} 288 Q${X(150)} 306 ${X(190)} 294 L${X(190)} 214 C${X(190)} 180 ${X(188)} 158 ${X(178)} 150 Z`;
  };
  const lungs = (op = 1) => `<g opacity="${op}"><path d="${lungD(1)}" fill="${C.peach}" stroke="${C.orange}" stroke-width="3"/><path d="${lungD(-1)}" fill="${C.peach}" stroke="${C.orange}" stroke-width="3"/></g>`;
  // 숨관가지(왼쪽 폐 기준, 오른쪽은 거울): 굵은 두 갈래 → 셋 → 여섯
  const M0 = [180, 226], U = [160, 194], MI = [146, 240], LO = [168, 268];
  const BR1 = [[BIF, M0]];
  const BR2 = [[M0, U], [M0, MI], [M0, LO]];
  const BR3 = [[U, [156, 172]], [U, [142, 204]], [MI, [134, 224]], [MI, [132, 262]], [LO, [150, 284]], [LO, [182, 286]]];
  const both = (segs) => segs.concat(segs.map(([p, q]) => [mx(p), mx(q)]));
  const segD = ([p, q]) => `M${f(p[0])} ${f(p[1])} L${f(q[0])} ${f(q[1])}`;
  const branches = (segs, w, color = C.blue, cls = '', extra = '') => both(segs).map((s) => `<path class="${cls}"${extra} pathLength="1" d="${segD(s)}" stroke="${color}" stroke-width="${w}" fill="none" stroke-linecap="round"/>`).join('');
  const bronchi = (color = C.blue) => branches(BR1, 8, color) + branches(BR2, 5, color) + branches(BR3, 3.5, color);
  // 숨관: 고리 무늬가 있는 굵은 관(코 안쪽 → 갈림목)
  const tracheaD = `M${NOSE[0]} ${NOSE[1]} L${BIF[0]} ${BIF[1]}`;
  const trachea = () => {
    let s = `<path d="${tracheaD}" stroke="${C.blue}" stroke-width="22" stroke-linecap="round"/><path d="${tracheaD}" stroke="white" stroke-width="15" stroke-linecap="round"/>`;
    for (let y = 130; y <= 194; y += 10) s += `<path d="M191 ${y} H209" stroke="${C.blue}" stroke-width="2" stroke-opacity=".55"/>`;
    return s;
  };
  // 공기 길: 코 앞 → 코 → 숨관 → 숨관가지 끝
  const OUT = [292, 92];
  const inRoutes = [[U, [156, 172]], [MI, [132, 262]], [LO, [182, 286]], [MI, [134, 224]]].flatMap(([p, q]) => [[OUT, [208, 74], NOSE, BIF, M0, p, q], [OUT, [208, 74], NOSE, BIF, mx(M0), mx(p), mx(q)]]);
  const labelsChest = () => lead(330, 66, 210, 62) + tag(352, 66, '코', GRAY, { size: 18 })
    + lead(330, 132, 210, 132) + tag(364, 132, '숨관', COLD, { size: 18 })
    + lead(324, 214, 254, 238) + tag(372, 214, '숨관가지', COLD, { size: 18 })
    + lead(330, 286, 274, 276) + tag(352, 286, '폐', HOT, { size: 18 });

  // ════ 호흡: 숨을 들이마시고 내쉬는 것 ════
  (function () {
    const id = 't51-c4b-hoheup';
    let css = base(id);
    let body = chestBody() + trachea() + noseLine;
    body += `<g class="lungs">${lungs()}${bronchi()}</g>`;
    // 칸 1: 들이마시기 — 공기가 코로 들어가 폐까지, 폐가 부푼다
    let a1 = '', a2 = '', a3i = '', a3o = '';
    inRoutes.forEach((r, i) => {
      css += route(`${id}-in${i}`, r) + route(`${id}-out${i}`, rev(r)) + route(`${id}-ci${i}`, r, { a: 0, b: 48 }) + route(`${id}-co${i}`, rev(r), { a: 52, b: 100 });
      css += `.sc-${id} .in${i} { animation: ${id}-in${i} 2.6s linear infinite both; } .sc-${id} .out${i} { animation: ${id}-out${i} 2.6s linear infinite both; }
        .on3 .sc-${id} .ci${i} { animation: ${id}-ci${i} 4.4s linear infinite both; } .on3 .sc-${id} .co${i} { animation: ${id}-co${i} 4.4s linear infinite both; }`;
      a1 += riders(`in${i}`, r, air, [i * 0.32]);
      a2 += riders(`out${i}`, rev(r), air, [i * 0.32]);
      a3i += riders(`ci${i}`, r, air, [0]);
      a3o += riders(`co${i}`, rev(r), air, [0]);
    });
    body += shown(1, a1, 2) + shown(2, a2, 3) + `<g class="b3">${a3i}${a3o}</g>`;
    body += at(1, 'pop', labelsChest(), 0.3);
    body += atH(1, 2, 'pop', solid(300, 104, 252, 86, C.blue, 5) + tag(520, 120, '들이마시기', COLD, { size: 22 }), 0.6);
    body += atH(2, 3, 'pop', solid(252, 86, 300, 104, C.purple, 5) + tag(520, 120, '내쉬기', [C.lilac, C.purple], { size: 22 }), 0.6);
    // 칸 3: 되풀이, 이름
    body += at(3, 'pop', tag(520, 120, '호흡', OK, { size: 26 }), 0.4);
    css += `.sc-${id} .lungs { transform-origin: ${BIF[0]}px ${BIF[1]}px; }`
      + states(id, 'lungs', 'transform', ['scale(1)', 'scale(1.12)', 'scale(.88)'], 1.8, 0.4)
      + `.on3 .sc-${id} .lungs { animation: ${id}-breathe 4.4s ease-in-out infinite; }
      @keyframes ${id}-breathe { 0% { transform: scale(.88); } 48% { transform: scale(1.12); } 52% { transform: scale(1.12); } 100% { transform: scale(.88); } }`;
    put('5-1/과학/4/호흡', svg(id, body, css));
  })();

  // ════ 숨관: 코와 폐 사이에서 공기가 지나가는 굵은 관 ════
  (function () {
    const id = 't51-c4b-sumgwan';
    let css = base(id);
    let body = chestBody() + `<g opacity=".55">${lungs()}${bronchi()}</g>` + trachea() + noseLine;
    // 칸 1: 코로 들어온 공기가 목을 따라 가슴 쪽으로 내려간다
    const r1 = [OUT, [208, 74], NOSE, BIF, M0], r2 = [OUT, [208, 74], NOSE, BIF, mx(M0)];
    css += route(`${id}-a`, r1) + route(`${id}-b`, r2)
      + `.sc-${id} .ra { animation: ${id}-a 2.6s linear infinite both; } .sc-${id} .rb { animation: ${id}-b 2.6s linear infinite both; }`;
    body += `<g class="b1">${riders('ra', r1, air, [0, 1.3])}${riders('rb', r2, air, [0.65, 1.95])}</g>`;
    body += atH(1, 2, 'pop', solid(300, 104, 252, 86, C.blue, 5), 0.3);
    // 칸 2: 그 길이 반짝이고, 두 끝(코·폐)에 고리
    body += `<g class="b2"><path class="glow2" d="${tracheaD}" stroke="${C.yellow}" stroke-width="42" stroke-linecap="round"/></g>`;
    body += `<g class="b2">${trachea()}</g>`;
    body += ring(NOSE[0], NOSE[1] - 4, 18, 2, C.orange, 0.2) + ring(150, 236, 44, 2, C.orange, 0.6) + ring(250, 236, 44, 2, C.orange, 0.6);
    body += at(2, 'pop', lead(320, 64, 212, 62) + tag(344, 64, '코', GRAY, { size: 18 }), 0.4)
      + at(2, 'pop', lead(326, 290, 274, 276) + tag(350, 290, '폐', HOT, { size: 18 }), 0.7);
    // 칸 3: 이름
    body += at(3, 'pop', lead(330, 150, 212, 150) + tag(380, 150, '숨관', COLD, { size: 26 }), 0.4);
    body += `<g class="b3"><path class="flash flash3" d="${tracheaD}" stroke="${C.blue}" stroke-width="24" stroke-linecap="round" fill="none" stroke-opacity=".35"/></g>`;
    put('5-1/과학/4/숨관', svg(id, body, css));
  })();

  // ════ 숨관가지: 숨관에서 나뭇가지처럼 갈라진 관 ════
  (function () {
    const id = 't51-c4b-sumgwangaji';
    let css = base(id);
    let body = chestBody() + lungs() + trachea() + noseLine;
    // 칸 1: 숨관이 가슴 속에서 두 갈래로
    body += branches(BR1, 8, C.blue, 'draw draw1');
    body += ring(BIF[0], BIF[1], 16, 1, C.orange, 0.6);
    body += atH(1, 3, 'pop', lead(330, 132, 210, 132) + tag(364, 132, '숨관', GRAY, { size: 18 }), 0.4);
    // 칸 2: 폐 속에서 여러 갈래로 잘게
    body += branches(BR2, 5, C.blue, 'draw draw2') + branches(BR3, 3.5, C.blue, 'draw draw2', ' style="transition-delay:1s"');
    // 칸 3: 공기가 가지를 따라 폐 구석구석으로
    let a3 = '';
    inRoutes.forEach((r, i) => {
      const rr = r.slice(3);
      css += route(`${id}-a${i}`, rr) + `.sc-${id} .a${i} { animation: ${id}-a${i} 1.8s linear infinite both; }`;
      a3 += riders(`a${i}`, rr, air, [(i * 0.23) % 1.8]);
    });
    body += shown(3, a3);
    body += at(3, 'pop', lead(326, 290, 274, 276) + tag(350, 290, '폐', HOT, { size: 18 }), 0.4);
    // 칸 4: 가지가 반짝이고 이름
    body += `<g class="b4">${branches(BR1, 22, C.yellow, 'glow4')}${branches(BR2, 17, C.yellow, 'glow4')}${branches(BR3, 13, C.yellow, 'glow4')}</g>`;
    body += shown(4, bronchi());
    body += at(4, 'pop', lead(330, 214, 254, 238) + tag(400, 214, '숨관가지', COLD, { size: 26 }), 0.4);
    put('5-1/과학/4/숨관가지', svg(id, body, css));
  })();

  // ════════ 배까지 보이는 몸(배설 기관) ════════
  const bellyBody = () => `<path d="M206 54 L206 70 Q206 78 188 81 L140 88 Q112 93 110 120 L110 290 Q110 326 150 332 L200 336 Q220 338 240 336 L290 332 Q330 326 330 290 L330 120 Q328 93 300 88 L252 81 Q234 78 234 70 L234 54 Z" fill="white" stroke="${C.muted}" stroke-width="3" stroke-linejoin="round"/>`
    + `<circle cx="220" cy="34" r="26" fill="white" stroke="${C.muted}" stroke-width="3"/>`
    + `<circle cx="211" cy="31" r="3" fill="${C.ink}"/><circle cx="229" cy="31" r="3" fill="${C.ink}"/>`;
  // 강낭콩 모양: (cx,cy) 가운데, dir 은 오목한 쪽(+1 오른쪽), s 배율
  const beanD = (cx, cy, dir, s = 1) => {
    const P = (x, y) => `${f(cx + dir * x * s)} ${f(cy + y * s)}`;
    return `M${P(0, -34)} C${P(-30, -34)} ${P(-30, 34)} ${P(0, 34)} C${P(18, 34)} ${P(20, 14)} ${P(9, 0)} C${P(20, -14)} ${P(18, -34)} ${P(0, -34)} Z`;
  };
  const KL = [168, 168], KR = [272, 168];
  const kidneys = (cls = '') => `<path class="${cls}" d="${beanD(KL[0], KL[1], 1)}" fill="${C.peach}" stroke="${C.orange}" stroke-width="3"/><path class="${cls}" d="${beanD(KR[0], KR[1], -1)}" fill="${C.peach}" stroke="${C.orange}" stroke-width="3"/>`;
  const URL_ = [[178, 176], [190, 200], [200, 226], [206, 256]], URR = URL_.map(mx2);
  function mx2(p) { return [440 - p[0], p[1]]; }
  const curveD = (P) => `M${P[0][0]} ${P[0][1]} C${P[1][0]} ${P[1][1]} ${P[2][0]} ${P[2][1]} ${P[3][0]} ${P[3][1]}`;
  const tube = (d, color = C.orange, w = 10) => `<path d="${d}" stroke="${color}" stroke-width="${w}" fill="none" stroke-linecap="round"/><path d="${d}" stroke="white" stroke-width="${w - 5}" fill="none" stroke-linecap="round"/>`;
  const ureters = () => tube(curveD(URL_)) + tube(curveD(URR));
  const URETHRA = 'M220 306 L220 338';
  const urethra = () => tube(URETHRA);
  const bladderD = 'M188 258 Q220 244 252 258 Q272 282 246 302 Q234 310 220 310 Q206 310 194 302 Q168 282 188 258 Z';
  // 방광: 오줌 높이(.lvl)와 부풂(.blad)을 CSS 로 바꾼다
  const bladder = (id) => `<g class="blad"><defs><clipPath id="${id}-bl"><path d="${bladderD}"/></clipPath></defs>`
    + `<path d="${bladderD}" fill="white"/><g clip-path="url(#${id}-bl)"><rect class="lvl" x="160" y="244" width="120" height="68" fill="${C.yellow}" fill-opacity=".5"/></g>`
    + `<path d="${bladderD}" fill="none" stroke="${C.orange}" stroke-width="3"/></g>`;
  const bladderCss = (id, lv, sw) => `.sc-${id} .lvl { transform-box: fill-box; transform-origin: 50% 100%; } .sc-${id} .blad { transform-box: fill-box; transform-origin: 50% 40%; }`
    + states(id, 'lvl', 'transform', lv.map((v) => v == null ? null : `scaleY(${v})`), 1.6, 0.4)
    + states(id, 'blad', 'transform', sw.map((v) => v == null ? null : `scale(${v})`), 1.6, 0.4);
  // 혈관(빨강): 가슴에서 내려와 두 콩팥으로
  const vesselL = `M220 96 L220 150 Q204 150 184 160`, vesselR = `M220 96 L220 150 Q236 150 256 160`, vesselT = 'M220 150 L220 236';
  const vessels = () => [vesselL, vesselR, vesselT].map((d) => `<path d="${d}" stroke="${C.red}" stroke-width="7" fill="none" stroke-linecap="round" stroke-opacity=".75"/>`).join('');
  const peeL = bez(URL_, 6), peeR = bez(URR, 6), outR = [[220, 304], [220, 356]];
  const belly = (id, withUrethra = true) => bellyBody() + ureters() + (withUrethra ? urethra() : '') + bladder(id) + kidneys();

  // ════ 노폐물: 몸이 영양소를 쓰고 나면 생기는 필요 없는 것 ════
  (function () {
    const id = 't51-c4b-nopyemul';
    let css = base(id);
    const S = 0.66, TX = -46, TY = 58, T = ([x, y]) => [f(TX + x * S), f(TY + y * S)];
    let body = `<g transform="translate(${TX} ${TY}) scale(${S})">${bellyBody()}<path d="M220 96 V300 M220 140 Q176 150 156 212 M220 140 Q264 150 284 212 M220 220 Q186 232 170 300 M220 220 Q254 232 270 300" fill="none" stroke="${C.red}" stroke-width="7" stroke-linecap="round" stroke-opacity=".7"/></g>`;
    const M = T([276, 190]), Z = [440, 186], R = 150;
    body += `<circle cx="${M[0]}" cy="${M[1]}" r="18" fill="none" stroke="${C.muted}" stroke-width="3" stroke-dasharray="6 4"/>`;
    body += zoomLines(M, 18, Z, R);
    // 큰 원: 가운데 혈관, 위아래로 몸의 여러 부분(초록 덩어리)
    const VY = 186, BL = [[364, 104], [470, 92], [548, 128], [342, 270], [440, 282], [530, 254]];
    let zin = `<rect x="${Z[0] - R}" y="${Z[1] - R}" width="${2 * R}" height="${2 * R}" fill="${C.paper}"/>`;
    zin += BL.map(([x, y]) => `<g class="pulse pulse2"><rect x="${x - 42}" y="${y - 30}" width="84" height="60" rx="26" fill="${C.mint}" stroke="${C.green}" stroke-width="3"/></g>`).join('');
    zin += `<rect x="${Z[0] - R}" y="${VY - 26}" width="${2 * R}" height="52" fill="${C.red}" fill-opacity=".14"/><path d="M${Z[0] - R} ${VY - 26} H${Z[0] + R} M${Z[0] - R} ${VY + 26} H${Z[0] + R}" stroke="${C.red}" stroke-width="4"/>`;
    zin += `<path class="mar" d="M${Z[0] - R} ${VY} H${Z[0] + R}" stroke="${C.red}" stroke-width="11" stroke-dasharray="0.1 36" stroke-linecap="round" stroke-opacity=".8"/>`;
    // 칸 1: 영양소가 혈관에서 덩어리로
    let n1 = '';
    BL.forEach(([x, y], i) => { const y0 = y < VY ? VY - 12 : VY + 12; n1 += `<g class="go" style="--dx:${f((x - (x - 30)) * 0.9)}px;--dy:${f(y - y0)}px;animation-delay:${f(i * 0.35)}s">${nut(x - 30, y0, 6)}</g>`; });
    zin += shown(1, n1, 2);
    // 칸 2: 덩어리 안에 회색 알갱이가 생긴다
    const WD = BL.flatMap(([x, y], i) => (i % 2 ? [[x - 14, y - 6], [x + 12, y + 8]] : [[x, y]]));
    zin += WD.map(([x, y], i) => atH(2, 3, 'pop', waste(x, y, 6), 0.4 + i * 0.12)).join('');
    // 칸 3: 회색 알갱이가 혈관으로 들어가 혈액을 따라 흘러간다
    let w3 = '';
    WD.forEach(([x, y], i) => {
      const vy = y < VY ? VY - 10 + (i % 2) * 6 : VY + 10 - (i % 2) * 6;
      const r = [[x, y], [x + 16, vy], [Z[0] + R + 90, vy]];
      css += route(`${id}-w${i}`, r, { fade: 4 }) + `.sc-${id} .w${i} { animation: ${id}-w${i} 3.2s linear infinite both; }`;
      w3 += riders(`w${i}`, r, (a, b) => waste(a, b, 6), [(i * 0.41) % 3.2]);
    });
    zin += shown(3, w3, 4);
    // 칸 4: 혈관 속 노폐물 알갱이가 멈춰 서고 고리가 퍼진다
    const W4 = [[322, VY - 9], [374, VY + 10], [508, VY - 8], [560, VY + 9]];
    zin += W4.map(([x, y], i) => at(4, 'pop', waste(x, y, 7), 0.1 + i * 0.1) + ring(x, y, 12, 4, C.muted, 0.6 + i * 0.1)).join('');
    body += `<defs><clipPath id="${id}-z"><circle cx="${Z[0]}" cy="${Z[1]}" r="${R}"/></clipPath></defs>`;
    body += `<g clip-path="url(#${id}-z)">${zin}</g><circle cx="${Z[0]}" cy="${Z[1]}" r="${R}" fill="none" stroke="${C.muted}" stroke-width="4"/>`;
    body += at(1, 'pop', tag(Z[0], VY, '혈액', BLOOD, { size: 18 }), 0.2);
    body += atH(1, 2, 'pop', tag(110, 330, '영양소', HOT, { dot: (x, y) => nut(x, y, 6) }), 0.5);
    body += at(2, 'pop', tag(110, 330, '필요 없는 것', GRAY, { size: 18, dot: (x, y) => waste(x, y, 6) }), 0.9).replace('class="b2"', 'class="b2 h4"');
    body += at(4, 'pop', tag(110, 330, '노폐물', GRAY, { size: 24, dot: (x, y) => waste(x, y, 7) }), 0.4);
    put('5-1/과학/4/노폐물', svg(id, body, css));
  })();

  // 칸에서 오줌이 오줌관을 따라 내려오고(ur), 요도로 나가는(ex) 알갱이
  const peeRiders = (id) => {
    let c = route(`${id}-pl`, peeL) + route(`${id}-pr`, peeR) + route(`${id}-ex`, outR)
      + `.sc-${id} .pl, .sc-${id} .pr { animation: ${id}-pl 2s linear infinite both; } .sc-${id} .pr { animation-name: ${id}-pr; }
        .sc-${id} .ex { animation: ${id}-ex 1.3s ease-in infinite both; }`;
    return { css: c, ur: riders('pl', peeL, pee, [0, 1]) + riders('pr', peeR, pee, [0.5, 1.5]), ex: riders('ex', outR, pee, [0, 0.45, 0.9]) };
  };

  // ════ 배설: 노폐물을 걸러 몸 밖으로 내보내는 것 ════
  (function () {
    const id = 't51-c4b-baeseol';
    let css = base(id);
    let body = bellyBody() + vessels() + ureters() + urethra() + bladder(id) + `<g class="kid">${kidneys()}</g>`;
    // 칸 1: 혈액에 노폐물이 섞여 콩팥으로 들어온다
    const vl = [[220, 96], [220, 150], [200, 152], [180, 162]], vr = vl.map(mx2);
    css += route(`${id}-vl`, vl) + route(`${id}-vr`, vr)
      + `.sc-${id} .vl { animation: ${id}-vl 2.2s linear infinite both; } .sc-${id} .vr { animation: ${id}-vr 2.2s linear infinite both; }`;
    const bl = (cls, pts, s) => riders(cls, pts, waste, [s]) + riders(cls, pts, (x, y) => cellR(x, y + 0.1, 4.5), [s + 0.55]);
    body += `<g class="b1">${bl('vl', vl, 0)}${bl('vl', vl, 1.1)}${bl('vr', vr, 0.3)}${bl('vr', vr, 1.4)}</g>`;
    body += at(1, 'pop', lead(368, 106, 226, 118) + tag(408, 106, '혈액', BLOOD, { size: 18 }), 0.2) + at(1, 'pop', tag(530, 106, '노폐물', GRAY, { size: 18, dot: waste }), 0.5);
    // 칸 2: 콩팥이 걸러 오줌을 만든다
    body += `<g class="b2">${[KL, KR].map(([x, y], i) => [[-4, -12], [2, 4], [-6, 16]].map(([dx, dy], j) => `<g class="pop pop2" style="animation-delay:${f(0.5 + i * 0.2 + j * 0.25)}s">${pee(x + (i ? -dx : dx), y + dy)}</g>`).join('')).join('')}</g>`;
    body += at(2, 'pop', lead(370, 168, 292, 168) + tag(410, 168, '콩팥', HOT, { size: 18 }), 0.3);
    body += at(2, 'pop', tag(530, 168, '오줌', PEE, { size: 18, dot: pee }), 1.2);
    css += `.on2 .sc-${id} .kid { animation: ${id}-pulse .8s ease-in-out .2s 2; } .sc-${id} .kid { transform-box: fill-box; transform-origin: center; }`;
    // 칸 3: 오줌관 → 방광 → 요도 → 몸 밖
    const P = peeRiders(id);
    css += P.css;
    body += `<g class="b3">${P.ur}${P.ex}</g>`;
    body += at(3, 'pop', lead(372, 222, 248, 222) + tag(416, 222, '오줌관', HOT, { size: 18 }), 0.2)
      + at(3, 'pop', lead(372, 276, 266, 276) + tag(410, 276, '방광', HOT, { size: 18 }), 0.6)
      + at(3, 'pop', lead(372, 326, 228, 326) + tag(410, 326, '요도', HOT, { size: 18 }), 1.0);
    css += bladderCss(id, [0.1, 0.1, 0.1, 0.55], [1, 1, 1, 1]);
    // 칸 4: 이름
    body += at(4, 'pop', tag(560, 260, '배설', OK, { size: 26 }), 0.4);
    body += ring(220, 350, 22, 4, C.orange, 0.2);
    put('5-1/과학/4/배설', svg(id, body, css));
  })();

  // ════ 콩팥: 혈액 속 노폐물을 걸러 오줌을 만드는 기관 ════
  (function () {
    const id = 't51-c4b-kongpat';
    let css = base(id);
    const S = 0.62, TX = -50, TY = 70, T = ([x, y]) => [f(TX + x * S), f(TY + y * S)];
    let body = `<g transform="translate(${TX} ${TY}) scale(${S})">${bellyBody()}${ureters()}${urethra()}<path d="${bladderD}" fill="white" stroke="${C.orange}" stroke-width="3"/>${kidneys()}</g>`;
    const KLs = T(KL), KRs = T(KR);
    body += ring(KLs[0], KLs[1], 26, 1, C.orange, 0.3) + ring(KRs[0], KRs[1], 26, 1, C.orange, 0.5);
    const Z = [430, 186], R = 140, K = [392, 186], KS = 3;
    body += `<circle cx="${KLs[0]}" cy="${KLs[1]}" r="24" fill="none" stroke="${C.muted}" stroke-width="3" stroke-dasharray="6 4"/>`;
    body += zoomLines(KLs, 24, Z, R);
    // 큰 원: 콩팥 하나와 들어오는 혈관·나가는 혈관·오줌관
    const H = [K[0] + 9 * KS, K[1]];
    const vin = [[Z[0] + R + 10, 104], [520, 128], [H[0] + 6, H[1] - 22]], vout = [[H[0] + 6, H[1]], [520, 192], [Z[0] + R + 10, 196]];
    const uD = `M${H[0] + 4} ${H[1] + 22} C${H[0] + 40} ${H[1] + 40} ${H[0] + 50} ${H[1] + 90} ${H[0] + 56} ${Z[1] + R + 10}`;
    let zin = `<rect x="${Z[0] - R}" y="${Z[1] - R}" width="${2 * R}" height="${2 * R}" fill="${C.paper}"/>`;
    const pl = (pts) => 'M' + pts.map((p) => `${f(p[0])} ${f(p[1])}`).join(' L');
    zin += `<path d="${pl(vin)}" stroke="${C.red}" stroke-width="20" fill="none" stroke-linejoin="round" stroke-opacity=".85"/><path d="${pl(vin)}" stroke="#f6dcd8" stroke-width="13" fill="none" stroke-linejoin="round"/>`;
    zin += `<path d="${pl(vout)}" stroke="${C.red}" stroke-width="20" fill="none" stroke-linejoin="round" stroke-opacity=".85"/><path d="${pl(vout)}" stroke="#f6dcd8" stroke-width="13" fill="none" stroke-linejoin="round"/>`;
    zin += tube(uD, C.orange, 20);
    zin += `<path d="${beanD(K[0], K[1], 1, KS)}" fill="${C.peach}" stroke="${C.orange}" stroke-width="4"/>`;
    // 콩팥 안: 걸러지는 곳(가운데 점선 둘레)
    const IN = [vin[2], [H[0] - 30, H[1] - 30], [K[0] - 20, K[1] - 10]];
    const OUTB = [[K[0] - 20, K[1] - 10], [H[0] - 30, H[1] - 2], ...vout];
    const URN = [[K[0] - 20, K[1] - 10], [H[0] - 26, H[1] + 22], [H[0] + 4, H[1] + 22], ...bez([[H[0] + 4, H[1] + 22], [H[0] + 40, H[1] + 40], [H[0] + 50, H[1] + 90], [H[0] + 56, Z[1] + R + 10]], 6).slice(1)];
    const bin = [...vin, ...IN.slice(1)];
    css += route(`${id}-rin`, bin) + route(`${id}-rout`, OUTB) + route(`${id}-urn`, URN)
      + `.sc-${id} .rin { animation: ${id}-rin 2.4s linear infinite both; } .sc-${id} .rout { animation: ${id}-rout 2.4s linear infinite both; } .sc-${id} .urn { animation: ${id}-urn 2.6s linear infinite both; }`;
    const inner = riders('rin', bin, (x, y) => cellR(x, y, 6), [0, 0.6, 1.2, 1.8]) + riders('rin', bin, (x, y) => waste(x, y + 0.1, 6), [0.3, 1.5]);
    zin += `<g class="b2">${inner}</g>`;
    zin += `<g class="b3">${riders('rout', OUTB, (x, y) => cellR(x, y, 6), [0, 0.6, 1.2, 1.8])}${riders('urn', URN, (x, y) => pee(x, y, 7), [0.2, 1.1, 2.0])}</g>`;
    body += `<defs><clipPath id="${id}-z"><circle cx="${Z[0]}" cy="${Z[1]}" r="${R}"/></clipPath></defs>`;
    body += `<g class="b1"><g class="pop pop1"><g clip-path="url(#${id}-z)">${zin}</g><circle cx="${Z[0]}" cy="${Z[1]}" r="${R}" fill="none" stroke="${C.muted}" stroke-width="4"/></g></g>`;
    // 칸 1: 강낭콩과 닮은 모양
    body += atH(1, 2, 'pop', `<path d="${beanD(598, 66, 1, 0.8)}" fill="${C.red}" fill-opacity=".75" stroke="${C.red}" stroke-width="2"/>` + tag(590, 130, '강낭콩', BLOOD, { size: 18 }), 0.8);
    // 칸 2·3: 꼬리표
    body += at(2, 'pop', tag(584, 40, '혈액', BLOOD, { size: 18, dot: (x, y) => cellR(x, y, 6) }) + tag(584, 82, '노폐물', GRAY, { size: 18, dot: (x, y) => waste(x, y, 6) }), 0.6);
    body += at(3, 'pop', tag(588, 250, '오줌', PEE, { size: 18, dot: (x, y) => pee(x, y, 6) }), 0.8);
    // 칸 4: 이름
    body += ring(K[0], K[1], 80, 4, C.orange, 0.1);
    body += at(4, 'pop', tag(110, 330, '콩팥', HOT, { size: 26 }), 0.4);
    put('5-1/과학/4/콩팥', svg(id, body, css));
  })();

  // ════ 방광: 오줌을 모아 두었다가 내보내는 주머니 ════
  (function () {
    const id = 't51-c4b-banggwang';
    let css = base(id);
    let body = belly(id);
    const P = peeRiders(id);
    css += P.css;
    // 칸 1: 콩팥에서 만든 오줌이 오줌관을 따라 내려온다
    body += `<g class="b1 h3">${P.ur}</g>`;
    body += at(1, 'pop', lead(370, 168, 292, 168) + tag(410, 168, '콩팥', HOT, { size: 18 }), 0.2)
      + at(1, 'pop', lead(372, 222, 248, 222) + tag(416, 222, '오줌관', HOT, { size: 18 }), 0.5)
      + atH(1, 2, 'pop', tag(530, 168, '오줌', PEE, { size: 18, dot: pee }), 0.8);
    // 칸 2: 아랫배 주머니에 모이고, 차면 부푼다 — 칸 3: 요도로 나가며 줄어든다
    body += `<g class="b3 h4">${P.ex}</g>`;
    body += at(3, 'pop', lead(372, 326, 228, 326) + tag(410, 326, '요도', HOT, { size: 18 }), 0.4);
    css += bladderCss(id, [0.08, 0.3, 0.92, 0.2, 0.6], [1, 1, 1.18, 1, 1.06]);
    // 칸 4: 이름
    body += ring(220, 280, 50, 2, C.orange, 1.4) + ring(220, 280, 50, 4, C.green, 0.2);
    body += at(4, 'pop', lead(380, 280, 270, 280) + tag(430, 280, '방광', OK, { size: 26 }), 0.4);
    put('5-1/과학/4/방광', svg(id, body, css));
  })();

  // ════ 요도: 방광의 오줌을 몸 밖으로 내보내는 관 ════
  (function () {
    const id = 't51-c4b-yodo';
    let css = base(id);
    let body = belly(id, false);
    const P = peeRiders(id);
    css += P.css;
    // 칸 1: 오줌관을 지나 방광에 모인다
    body += `<g class="b1 h2">${P.ur}</g>`;
    body += at(1, 'pop', lead(370, 168, 292, 168) + tag(410, 168, '콩팥', HOT, { size: 18 }), 0.2)
      + at(1, 'pop', lead(372, 222, 248, 222) + tag(416, 222, '오줌관', HOT, { size: 18 }), 0.4)
      + at(1, 'pop', lead(372, 276, 266, 276) + tag(410, 276, '방광', HOT, { size: 18 }), 0.6);
    // 칸 2: 방광 아래 몸 밖까지 이어진 관이 그려지고 반짝인다
    body += `<g class="b2"><path class="glow2" d="${URETHRA}" stroke="${C.yellow}" stroke-width="30" stroke-linecap="round"/></g>`;
    body += `<g class="b2"><g class="ureth">${tube(URETHRA)}</g></g>`;
    css += `.sc-${id} .ureth { transform-box: fill-box; transform-origin: 50% 0%; transform: scaleY(0); transition: transform 1s ease-out .3s; } .on2 .sc-${id} .ureth { transform: scaleY(1); }`;
    body += ring(220, 338, 16, 2, C.orange, 1.2);
    // 칸 3: 오줌이 이 관을 지나 몸 밖으로
    body += `<g class="b3">${P.ex}</g>`;
    css += bladderCss(id, [0.1, 0.85, 0.85, 0.2, 0.2], [1, 1.1, 1.1, 1, 1]);
    // 칸 4: 이름(맨 끝 길)
    body += at(4, 'pop', lead(372, 326, 228, 326) + tag(426, 326, '요도', OK, { size: 26 }), 0.4);
    body += ring(220, 322, 24, 4, C.green, 0.2);
    put('5-1/과학/4/요도', svg(id, body, css));
  })();
})(typeof window !== 'undefined' ? window : globalThis);
