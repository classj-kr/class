// 사회 6-1 3-1 「세계를 표현한 공간 자료」 낱말 도식: 위선·경선·위도·경도·적도·본초 자오선·북위·남위·동경·서경·북반구·남반구·시차.
// 지구본은 대륙을 그리지 않는다. 원 + 가로줄(위선) + 타원 호(경선) + 띠만 쓴다.
// - 앞에서 본 지구본(기울기 0): 위선은 원 위의 곧은 가로줄, 경선은 북극과 남극을 잇는 타원 호.
// - 조금 위에서 본 지구본(기울기 24°): 경도처럼 적도 면 위에서 잰 각도를 보일 때. 뒤쪽 줄은 옅은 점선.
// - 북극 위에서 내려다본 지구(시차): 경선이 북극에서 뻗은 바퀴살이 된다.
// 도시 점(서울·시드니·뉴욕)은 교과서·화면 글의 대략 위도·경도 자리에만 찍는다.
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
  const sinD = (d) => Math.sin((d * Math.PI) / 180), cosD = (d) => Math.cos((d * Math.PI) / 180);
  const xy = (p) => `${f(p[0])} ${f(p[1])}`;

  // 글자 폭 어림(맑은 고딕 굵게: 한글 1em, 숫자·기호 .6em, 빈칸 .3em)
  const tw = (s, size) => [...String(s)].reduce((a, c) => a + (/[가-힣]/.test(c) ? 1 : c === ' ' ? 0.3 : 0.6), 0) * size;
  const RED = [C.peach, C.red], NORTH = [C.mint, C.green], SOUTH = [C.sky, C.blue], ANG = [C.peach, C.orange], ODD = [C.lilac, C.purple];
  const tag = (cx, cy, label, [fill, stroke] = NORTH, { size = 20 } = {}) => {
    const w = Math.round(tw(label, size) + size * 1.3), h = Math.round(size * 1.7);
    return `<g><rect x="${f(cx - w / 2)}" y="${f(cy - h / 2)}" width="${w}" height="${h}" rx="${h / 2}" fill="${fill}" stroke="${stroke}" stroke-width="2.5"/>${text(f(cx), f(cy + size * 0.36), label, { size })}</g>`;
  };
  // 흰 바탕을 깐 글자(줄 위에 얹을 때)
  const plate = (x, y, label, { size = 18, color = C.ink, anchor = 'middle' } = {}) => {
    const w = tw(label, size) + 10, x0 = anchor === 'middle' ? x - w / 2 : anchor === 'end' ? x - w + 5 : x - 5;
    return `<rect x="${f(x0)}" y="${f(y - size * 0.95)}" width="${f(w)}" height="${f(size * 1.3)}" rx="5" fill="${C.paper}" fill-opacity=".92"/>` + text(f(x), f(y), label, { size, color, anchor });
  };
  const head = (x, y, ang, color, w = 4) => {
    const l = 8 + w * 1.4, p = (d) => `${f(x - l * Math.cos(ang + d))} ${f(y - l * Math.sin(ang + d))}`;
    return `<path d="M${p(-0.5)} L${f(x)} ${f(y)} L${p(0.5)}" stroke="${color}" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  };
  // 흐르는 화살표: 점선이 끝 쪽으로 흐른다(무늬 한 마디 24)
  const flow = (pts, color, { w = 5, dash = '14 10' } = {}) => {
    const [a, b] = pts.slice(-2), ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
    const end = [b[0] - w * Math.cos(ang), b[1] - w * Math.sin(ang)];
    const d = 'M' + [...pts.slice(0, -1), end].map(xy).join(' L');
    return `<g><path class="mar" d="${d}" stroke="${color}" stroke-width="${w}" stroke-dasharray="${dash}" stroke-linecap="round" stroke-linejoin="round" fill="none"/>${head(b[0], b[1], ang, color, w)}</g>`;
  };
  const ring = (cx, cy, r, n, color = C.green, s = 0) => `<g class="b${n}"><circle class="ring ring${n}"${dl(s)} cx="${f(cx)}" cy="${f(cy)}" r="${r}" fill="none" stroke="${color}" stroke-width="4"/></g>`;
  const flashPath = (d, n, color, s = 0, w = 5) => `<g class="b${n}"><path class="flash flash${n}"${dl(s)} d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/></g>`;
  const dot = (x, y, color, r = 7) => `<circle cx="${f(x)}" cy="${f(y)}" r="${r}" fill="${color}" stroke="white" stroke-width="2.5"/>`;

  // 장면마다 같이 쓰는 움직임
  const base = (id) => {
    let s = `
    .sc-${id} .pop, .sc-${id} .pulse, .sc-${id} .ring { transform-box: fill-box; transform-origin: center; }
    .sc-${id} .mar { animation: ${id}-mar .7s linear infinite; }
    .sc-${id} .draw { stroke-dasharray: 1; stroke-dashoffset: 1; transition: stroke-dashoffset 1.4s ease-in-out .2s; }
    .sc-${id} .grow { transform-box: fill-box; transform-origin: 0 50%; transform: scaleX(0); transition: transform 1.2s ease-in-out; }
    .sc-${id} .growy { transform-box: fill-box; transform-origin: 50% 0; transform: scaleY(0); transition: transform 1s ease-out .2s; }
    .sc-${id} .mer { transform-box: view-box; animation: ${id}-mer 10s linear infinite; }
    .sc-${id} .ring { opacity: 0; }
    @keyframes ${id}-pop { 0% { opacity: 0; transform: scale(.3); } 70% { opacity: 1; transform: scale(1.12); } 100% { opacity: 1; transform: scale(1); } }
    @keyframes ${id}-fin { from { opacity: 0; } to { opacity: 1; } }
    @keyframes ${id}-rise { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
    @keyframes ${id}-drop { from { opacity: 0; transform: translateY(-26px); } to { opacity: 1; transform: none; } }
    @keyframes ${id}-pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.12); } }
    @keyframes ${id}-flash { 0% { opacity: 0; } 20% { opacity: 1; } 40% { opacity: .25; } 60% { opacity: 1; } 80% { opacity: .25; } 100% { opacity: 1; } }
    @keyframes ${id}-ring { 0% { opacity: .9; transform: scale(1); } 100% { opacity: 0; transform: scale(1.7); } }
    @keyframes ${id}-mar { from { stroke-dashoffset: 24; } to { stroke-dashoffset: 0; } }
    @keyframes ${id}-mer { 0% { transform: scaleX(-1); } 16.67% { transform: scaleX(-.866); } 33.33% { transform: scaleX(-.5); } 49.9% { transform: scaleX(-.02); } 50.1% { transform: scaleX(.02); } 66.67% { transform: scaleX(.5); } 83.33% { transform: scaleX(.866); } 100% { transform: scaleX(1); } }
    @keyframes ${id}-trip { 0% { opacity: 0; transform: translateX(0); } 12%, 88% { opacity: 1; } 100% { opacity: 0; transform: translateX(var(--dx)); } }
    `;
    for (let n = 1; n <= 5; n++) s += `
    .on${n} .sc-${id} .pop${n} { animation: ${id}-pop .5s ease-out both; }
    .on${n} .sc-${id} .fin${n} { animation: ${id}-fin .5s ease-out both; }
    .on${n} .sc-${id} .rise${n} { animation: ${id}-rise .45s ease-out both; }
    .on${n} .sc-${id} .drop${n} { animation: ${id}-drop .5s ease-out both; }
    .on${n} .sc-${id} .pulse${n} { animation: ${id}-pulse .7s ease-in-out .3s 2; }
    .on${n} .sc-${id} .flash${n} { animation: ${id}-flash 1.4s ease-in-out both; }
    .on${n} .sc-${id} .ring${n} { animation: ${id}-ring 1.1s ease-out .3s 2; }
    .on${n} .sc-${id} .draw${n} { stroke-dashoffset: 0; }
    .on${n} .sc-${id} .grow${n} { transform: scaleX(1); }
    .on${n} .sc-${id} .growy${n} { transform: scaleY(1); }
    .on${n} .sc-${id} .trip${n} { animation: ${id}-trip 2.6s ease-in-out infinite; }`;
    return s;
  };

  // ════ 앞에서 본 지구본 ════
  const FG = (cx = 320) => ({ cx, cy: 182, R: 135 });
  const latY = (G, lat) => G.cy - G.R * sinD(lat);
  const halfW = (G, lat) => G.R * cosD(lat);
  const chordD = (G, lat) => `M${f(G.cx - halfW(G, lat))} ${f(latY(G, lat))} H${f(G.cx + halfW(G, lat))}`;
  // 위도 a~b(a<b) 사이 띠
  const bandD = (G, a, b) => {
    const ya = latY(G, a), yb = latY(G, b), xa = halfW(G, a), xb = halfW(G, b);
    return `M${f(G.cx - xb)} ${f(yb)} H${f(G.cx + xb)} A${G.R} ${G.R} 0 0 1 ${f(G.cx + xa)} ${f(ya)} H${f(G.cx - xa)} A${G.R} ${G.R} 0 0 1 ${f(G.cx - xb)} ${f(yb)} Z`;
  };
  // 경선 넷이 왼쪽에서 오른쪽으로 돈다(지구가 서쪽에서 동쪽으로 도는 쪽)
  const meridians = (G, color = C.line) => [0, 1, 2, 3].map((k) => `<path class="mer" style="transform-origin:${G.cx}px ${G.cy}px;animation-delay:${-k * 2.5}s" d="M${G.cx} ${G.cy - G.R} A${G.R} ${G.R} 0 0 1 ${G.cx} ${G.cy + G.R}" stroke="${color}" stroke-width="2" fill="none" vector-effect="non-scaling-stroke"/>`).join('');
  // 멈춰 있는 경선: 가운데 경선에서 a° 떨어진 경선(-90~90)
  const merD = (G, a) => {
    if (Math.abs(a) < 0.5) return `M${G.cx} ${G.cy - G.R} V${G.cy + G.R}`;
    return `M${G.cx} ${G.cy - G.R} A${f(G.R * Math.abs(sinD(a)))} ${G.R} 0 0 ${a > 0 ? 1 : 0} ${G.cx} ${G.cy + G.R}`;
  };
  const stillMeridians = (G, list = [-60, -30, 0, 30, 60], color = C.line) => list.map((a) => `<path d="${merD(G, a)}" stroke="${color}" stroke-width="2" fill="none"/>`).join('');
  const disk = (G) => `<circle cx="${G.cx}" cy="${G.cy}" r="${G.R}" fill="white"/>`;
  const rim = (G) => `<circle cx="${G.cx}" cy="${G.cy}" r="${G.R}" fill="none" stroke="${C.muted}" stroke-width="3"/>`;
  const latLine = (G, lat, color = C.muted, { w = 2, dash = '6 5', cls = '' } = {}) => `<path class="${cls}" d="${chordD(G, lat)}" stroke="${color}" stroke-width="${w}"${dash ? ` stroke-dasharray="${dash}"` : ''} fill="none"/>`;
  // 위도 이름표: 원 왼쪽(또는 오른쪽) 바깥
  const latLabel = (G, lat, label, { size = 18, color = C.ink, right = false } = {}) => right
    ? text(f(G.cx + halfW(G, lat) + 8), f(latY(G, lat) + size * 0.36), label, { size, color, anchor: 'start' })
    : text(f(G.cx - halfW(G, lat) - 8), f(latY(G, lat) + size * 0.36), label, { size, color, anchor: 'end' });
  const poles = (G, color = C.muted) => text(G.cx, G.cy - G.R - 11, '북극', { size: 18, color }) + text(G.cx, G.cy + G.R + 26, '남극', { size: 18, color });
  // 지구 중심에서 뻗은 반지름이 위아래로 돈다(위도 각도). 각도 호 path
  const latArc = (G, from, to, r) => {
    const p = (d) => [G.cx + r * cosD(d), G.cy - r * sinD(d)];
    return `M${xy(p(from))} A${r} ${r} 0 0 ${to > from ? 0 : 1} ${xy(p(to))}`;
  };

  // ════ 조금 위에서 본 지구본(기울기 tilt°, 가운데 경도 v) ════
  const TG = (v, cx = 320) => ({ cx, cy: 178, R: 132, tilt: 24, v });
  const P3 = (G, lat, lon) => {
    const a = lon - G.v, t = G.tilt;
    return [G.cx + G.R * cosD(lat) * sinD(a), G.cy - G.R * (sinD(lat) * cosD(t) - cosD(lat) * cosD(a) * sinD(t)), sinD(lat) * sinD(t) + cosD(lat) * cosD(a) * cosD(t)];
  };
  // 점들을 보이는 쪽(앞)과 가려진 쪽(뒤)으로 나눈다
  const split = (pts) => {
    const out = { vis: '', hid: '' };
    let cur = null;
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i], k = p[2] >= 0 ? 'vis' : 'hid';
      if (cur === null) { out[k] += `M${xy(p)}`; cur = k; continue; }
      if (k !== cur) {
        const q = pts[i - 1], t = q[2] / (q[2] - p[2]), b = [q[0] + (p[0] - q[0]) * t, q[1] + (p[1] - q[1]) * t];
        out[cur] += ` L${xy(b)}`;
        out[k] += `${out[k] ? ' ' : ''}M${xy(b)}`;
        cur = k;
      }
      out[k] += ` L${xy(p)}`;
    }
    return out;
  };
  const meridianT = (G, lon) => { const pts = []; for (let lat = 90; lat >= -90; lat -= 2) pts.push(P3(G, lat, lon)); return split(pts); };
  const parallelT = (G, lat, from = G.v - 180, to = G.v + 180) => { const pts = []; const st = (to - from) / Math.ceil(Math.abs(to - from) / 3); for (let lon = from; st > 0 ? lon <= to + 1e-6 : lon >= to - 1e-6; lon += st) pts.push(P3(G, lat, lon)); return split(pts); };
  // 적도 면 위의 점(지구 중심에서 r 떨어짐)
  const PE = (G, lon, r = G.R) => { const a = lon - G.v; return [G.cx + r * sinD(a), G.cy + r * cosD(a) * sinD(G.tilt)]; };
  const arcE = (G, from, to, r) => { const pts = [], n = Math.max(6, Math.ceil(Math.abs(to - from) / 3)); for (let i = 0; i <= n; i++) pts.push(PE(G, from + ((to - from) * i) / n, r)); return 'M' + pts.map(xy).join(' L'); };
  const tiltGrid = (G) => {
    let b = `<circle cx="${G.cx}" cy="${G.cy}" r="${G.R}" fill="white"/>`;
    for (let lon = -150; lon <= 180; lon += 30) {
      const m = meridianT(G, lon);
      b += `<path d="${m.hid}" stroke="${C.line}" stroke-width="1.5" stroke-dasharray="3 5" fill="none" opacity=".7"/><path d="${m.vis}" stroke="${C.line}" stroke-width="2" fill="none"/>`;
    }
    for (const lat of [-60, -30, 30, 60]) {
      const p = parallelT(G, lat);
      b += `<path d="${p.hid}" stroke="${C.line}" stroke-width="1.5" stroke-dasharray="3 5" fill="none" opacity=".7"/><path d="${p.vis}" stroke="${C.line}" stroke-width="2" fill="none"/>`;
    }
    const e = parallelT(G, 0);
    b += `<path d="${e.hid}" stroke="${C.muted}" stroke-width="2" stroke-dasharray="5 6" fill="none" opacity=".8"/><path d="${e.vis}" stroke="${C.muted}" stroke-width="3" fill="none"/>`;
    return b;
  };
  const tiltRim = (G) => `<circle cx="${G.cx}" cy="${G.cy}" r="${G.R}" fill="none" stroke="${C.muted}" stroke-width="3"/>`;
  const northPole = (G) => { const p = P3(G, 90, 0); return `<circle cx="${f(p[0])}" cy="${f(p[1])}" r="5" fill="${C.ink}"/>` + text(G.cx, G.cy - G.R - 10, '북극', { size: 18, color: C.muted }); };
  // 적도 면 안에서 도는 반지름. 처음엔 경도 lon0 을 가리키고, CSS 로 돌린다(동쪽 = 음수 각).
  const planeRadius = (G, cls, lon0, color) => {
    const a = lon0 - G.v, s = sinD(G.tilt);
    return `<g transform="translate(${G.cx} ${G.cy}) scale(1 ${f(s)})"><g class="${cls}"><circle r="${G.R + 10}" fill="none"/><path d="M0 0 L${f(G.R * sinD(a))} ${f(G.R * cosD(a))}" stroke="${color}" stroke-width="4" stroke-linecap="round" vector-effect="non-scaling-stroke"/><circle cx="${f(G.R * sinD(a))}" cy="${f(G.R * cosD(a))}" r="9" fill="${color}" stroke="white" stroke-width="2.5" vector-effect="non-scaling-stroke"/></g></g>`;
  };
  const turnCss = (id, cls, steps, dur = 1.5) => `
      .sc-${id} .${cls} { transform-box: fill-box; transform-origin: center; transition: transform ${dur}s ease-in-out; }` + steps.map(([n, deg]) => `
      .on${n} .sc-${id} .${cls} { transform: rotate(${deg}deg); }`).join('');

  // ════ 3-1 세계를 표현한 공간 자료 ════

  // ── 위선: 적도와 나란하게 지구를 가로로 빙 둘러 그은 선 ──
  (function () {
    const id = 't61-s3-wiseon';
    let css = base(id);
    const G = FG(300);
    let body = `<defs><clipPath id="${id}-c"><circle cx="${G.cx}" cy="${G.cy}" r="${G.R}"/></clipPath></defs>`;
    body += disk(G) + meridians(G) + rim(G) + poles(G);
    // 1칸: 적도
    body += shown(1, `<g class="grow grow1">${latLine(G, 0, C.red, { w: 4, dash: '' })}</g>`);
    body += at(1, 'fin', latLabel(G, 0, '적도', { size: 20, color: C.red }), 0.8);
    // 2칸: 적도 줄을 본뜬 줄이 위아래로 미끄러져 가며 짧아진다
    const lats = [30, 60, -30, -60];
    body += shown(2, `<g clip-path="url(#${id}-c)">` + lats.map((L, i) => `<g class="sl" style="--ty:${f(-G.R * sinD(L))}px;--sx:${f(cosD(L))};transition-delay:${f(0.2 + i * 0.25)}s"><path d="${chordD(G, 0)}" stroke="${C.green}" stroke-width="3.5" fill="none"/></g>`).join('') + '</g>');
    // 이름표: 오른쪽에 '위선', 줄 끝으로 이은 짧은 선
    const TX = 548, TY = 120;
    const leads = lats.map((L) => `<path d="M${TX - 44} ${TY + (L > 0 ? -6 : 6) * 0 + (L > 0 ? 0 : 124)} L${f(G.cx + halfW(G, L) + 6)} ${f(latY(G, L))}" stroke="${C.green}" stroke-width="2.5" stroke-linecap="round"/>`).join('');
    body += at(2, 'fin', leads, 1.4);
    body += at(2, 'pop', tag(TX, TY, '위선', NORTH, { size: 22 }), 1.4);
    body += at(2, 'pop', tag(TX, TY + 124, '위선', NORTH, { size: 22 }), 1.6);
    // 3칸: 줄마다 점이 가로로 빙 돈다(앞쪽을 지나 뒤로 넘어간다)
    body += shown(3, [0, ...lats].map((L, i) => {
      const x0 = G.cx - halfW(G, L), dx = 2 * halfW(G, L);
      return `<g class="trip trip3" style="--dx:${f(dx)}px;animation-delay:${f(i * 0.35)}s">${dot(x0, latY(G, L), L === 0 ? C.red : C.green, 8)}</g>`;
    }).join(''));
    body += at(3, 'pop', tag(TX, TY + 62, '가로선', NORTH, { size: 20 }), 0.3);
    body += flashPath(lats.map((L) => chordD(G, L)).join(' '), 3, C.green, 0.6, 6);
    css += `
      .sc-${id} .sl { transform-box: view-box; transform-origin: ${G.cx}px ${G.cy}px; opacity: 0; transition: transform 1.3s ease-in-out, opacity .3s ease; }
      .on2 .sc-${id} .sl { opacity: 1; transform: translateY(var(--ty)) scaleX(var(--sx)); }`;
    put('6-1/사회/3-1/위선', svg(id, body, css));
  })();

  // ── 경선: 북극과 남극을 이어 세로로 그은 선 ──
  (function () {
    const id = 't61-s3-gyeongseon';
    let css = base(id);
    const G = FG(300);
    let body = disk(G);
    body += latLine(G, 0, C.line, { dash: '' }) + latLine(G, 30, C.line, { dash: '' }) + latLine(G, -30, C.line, { dash: '' }) + latLine(G, 60, C.line, { dash: '' }) + latLine(G, -60, C.line, { dash: '' });
    body += rim(G);
    // 1칸: 북극과 남극
    body += at(1, 'pop', dot(G.cx, G.cy - G.R, C.ink, 9) + text(G.cx + 20, G.cy - G.R - 6, '북극', { size: 20, anchor: 'start' }));
    body += at(1, 'pop', dot(G.cx, G.cy + G.R, C.ink, 9) + text(G.cx + 20, G.cy + G.R + 20, '남극', { size: 20, anchor: 'start' }), 0.4);
    // 2칸: 북극에서 남극까지 세로줄을 차례로 긋는다
    const list = [0, -35, 35, -65, 65];
    body += shown(2, list.map((a, i) => `<path class="draw draw2" pathLength="1" style="transition-delay:${f(0.1 + i * 0.35)}s" d="${merD(G, a)}" stroke="${C.orange}" stroke-width="4" fill="none" stroke-linecap="round"/>`).join(''), 3);
    body += at(2, 'pop', tag(G.cx + G.R + 90, G.cy - 40, '경선', ANG, { size: 22 }), 1.8);
    body += at(2, 'fin', `<path d="M${G.cx + G.R + 50} ${G.cy - 40} L${f(G.cx + G.R * sinD(65) * cosD(15) + 5)} ${f(G.cy - G.R * sinD(15))}" stroke="${C.orange}" stroke-width="2.5" stroke-linecap="round"/>`, 1.8);
    // 3칸: 경선이 돌아가도 모두 북극과 남극에서 만난다
    body += shown(3, meridians(G, C.orange).replace(/stroke-width="2"/g, 'stroke-width="3.5"'));
    body += shown(3, `<path d="${merD(G, 0)}" stroke="${C.orange}" stroke-width="2" stroke-dasharray="6 6" fill="none" opacity=".5"/>`);
    body += at(3, 'pop', tag(G.cx + G.R + 90, G.cy + 22, '세로선', ANG, { size: 20 }), 0.3);
    body += ring(G.cx, G.cy - G.R, 14, 3, C.orange, 0.6) + ring(G.cx, G.cy + G.R, 14, 3, C.orange, 0.6);
    body += at(3, 'pulse', dot(G.cx, G.cy - G.R, C.ink, 9)) + at(3, 'pulse', dot(G.cx, G.cy + G.R, C.ink, 9));
    put('6-1/사회/3-1/경선', svg(id, body, css));
  })();

  // ── 위도: 적도 0°에서 북쪽·남쪽으로 0°~90° ──
  (function () {
    const id = 't61-s3-wido';
    let css = base(id);
    const G = FG(330);
    let body = disk(G) + meridians(G) + rim(G);
    // 1칸: 적도 0°
    body += shown(1, `<g class="grow grow1">${latLine(G, 0, C.red, { w: 4, dash: '' })}</g>`);
    body += at(1, 'fin', latLabel(G, 0, '적도 0°', { size: 20, color: C.red }), 0.8);
    body += `<circle cx="${G.cx}" cy="${G.cy}" r="5" fill="${C.ink}"/>`;
    // 반지름(북쪽): 오른쪽 적도 끝에서 위로 돈다
    const radius = (cls, color) => `<g class="${cls}"><circle cx="${G.cx}" cy="${G.cy}" r="${G.R + 10}" fill="none"/><path d="M${G.cx} ${G.cy} H${G.cx + G.R}" stroke="${color}" stroke-width="4" stroke-linecap="round"/><circle cx="${G.cx + G.R}" cy="${G.cy}" r="9" fill="${color}" stroke="white" stroke-width="2.5"/></g>`;
    body += shown(2, radius('radN', C.green));
    // 2칸: 30°
    body += shown(2, `<path class="draw draw2" pathLength="1" d="${latArc(G, 0, 30, 54)}" stroke="${C.orange}" stroke-width="4" fill="none"/>`, 3);
    body += shown(2, g('pop pop2', plate(f(G.cx + 80 * cosD(15)), f(G.cy - 80 * sinD(15) + 7), '30°', { size: 20, color: C.orange }), 1.2), 3);
    body += shown(2, `<g class="grow grow2" style="transition-delay:1s">${latLine(G, 30, C.green, { w: 3 })}</g>`);
    body += at(2, 'fin', latLabel(G, 30, '30°', { size: 20, color: C.green }), 1.5);
    // 3칸: 끝까지 돌면 북극 90°, 남쪽으로 돌면 남극 90°
    body += shown(3, radius('radS', C.blue));
    body += shown(3, `<path class="draw draw3" pathLength="1" d="${latArc(G, 0, 90, 54)}" stroke="${C.green}" stroke-width="4" fill="none"/><path class="draw draw3" pathLength="1" d="${latArc(G, 0, -90, 54)}" stroke="${C.blue}" stroke-width="4" fill="none"/>`);
    body += at(3, 'pop', plate(f(G.cx + 78 * cosD(36)), f(G.cy - 78 * sinD(36) + 7), '90°', { size: 20, color: C.green }), 1.3);
    body += at(3, 'pop', plate(f(G.cx + 78 * cosD(36)), f(G.cy + 78 * sinD(36) + 7), '90°', { size: 20, color: C.blue }), 1.5);
    body += at(3, 'pop', text(G.cx, G.cy - G.R - 12, '북극 90°', { size: 20, color: C.green }), 1.3);
    body += at(3, 'pop', text(G.cx, G.cy + G.R + 27, '남극 90°', { size: 20, color: C.blue }), 1.5);
    // 4칸: 왼쪽 바깥 테두리를 따라 0°→90° 화살표 둘
    const rimArc = (from, to, r) => { const pts = []; for (let i = 0; i <= 18; i++) { const d = from + ((to - from) * i) / 18; pts.push([G.cx + r * cosD(d), G.cy - r * sinD(d)]); } return pts; };
    body += shown(4, flow(rimArc(4, 64, G.R + 20), C.green, { w: 4 }) + flow(rimArc(-4, -64, G.R + 20), C.blue, { w: 4 }));
    body += at(4, 'pop', tag(G.cx + G.R + 90, G.cy - 92, '0°~90°', NORTH, { size: 20 }), 0.3);
    body += at(4, 'pop', tag(G.cx + G.R + 90, G.cy + 92, '0°~90°', SOUTH, { size: 20 }), 0.6);
    body += ring(G.cx, G.cy, 12, 4, C.red, 0.2);
    css += `
      .sc-${id} .radN, .sc-${id} .radS { transform-box: fill-box; transform-origin: center; transition: transform 1.3s ease-in-out; }
      .on2 .sc-${id} .radN { transform: rotate(-30deg); }
      .on3 .sc-${id} .radN { transform: rotate(-90deg); }
      .on3 .sc-${id} .radS { transform: rotate(90deg); }`;
    put('6-1/사회/3-1/위도', svg(id, body, css));
  })();

  // ── 경도: 본초 자오선 0°에서 동쪽·서쪽으로 0°~180° ──
  (function () {
    const id = 't61-s3-gyeongdo';
    let css = base(id);
    const G = TG(15);
    let body = tiltGrid(G) + tiltRim(G) + northPole(G);
    body += `<circle cx="${G.cx}" cy="${G.cy}" r="5" fill="${C.ink}"/>`;
    // 1칸: 본초 자오선 0°
    const pm = meridianT(G, 0);
    body += shown(1, `<path class="draw draw1" pathLength="1" d="${pm.vis}" stroke="${C.red}" stroke-width="4.5" fill="none" stroke-linecap="round"/>`);
    const p0 = PE(G, 0);
    body += at(1, 'pop', plate(p0[0] - 14, p0[1] + 26, '0°', { size: 20, color: C.red }), 1.2);
    body += at(1, 'fin', text(G.cx, G.cy + G.R + 27, '본초 자오선', { size: 19, color: C.red }), 1.2);
    // 2칸: 동쪽으로 60°
    body += shown(2, planeRadius(G, 'rotE', 0, C.green));
    body += shown(2, `<path class="draw draw2" pathLength="1" d="${arcE(G, 0, 60, 62)}" stroke="${C.orange}" stroke-width="4" fill="none"/>`, 4);
    const lE = PE(G, 30, 92);
    body += shown(2, g('pop pop2', plate(lE[0], lE[1] + 8, '60°', { size: 20, color: C.orange }), 1.3), 4);
    body += shown(2, `<path class="draw draw2" pathLength="1" style="transition-delay:1.3s" d="${meridianT(G, 60).vis}" stroke="${C.green}" stroke-width="3.5" fill="none"/>`);
    body += at(2, 'fin', text(G.cx + G.R + 10, G.cy + 44, '동쪽', { size: 20, color: C.green, anchor: 'start' }), 1.4);
    // 3칸: 서쪽으로 30°
    body += shown(3, planeRadius(G, 'rotW', 0, C.blue));
    body += shown(3, `<path class="draw draw3" pathLength="1" d="${arcE(G, 0, -30, 62)}" stroke="${C.orange}" stroke-width="4" fill="none"/>`, 4);
    const lW = PE(G, -18, 96);
    body += shown(3, g('pop pop3', plate(lW[0], lW[1] + 8, '30°', { size: 20, color: C.orange }), 1.1), 4);
    body += shown(3, `<path class="draw draw3" pathLength="1" style="transition-delay:1.1s" d="${meridianT(G, -30).vis}" stroke="${C.blue}" stroke-width="3.5" fill="none"/>`);
    body += at(3, 'fin', text(G.cx - G.R - 10, G.cy + 44, '서쪽', { size: 20, color: C.blue, anchor: 'end' }), 1.2);
    // 4칸: 동쪽·서쪽 모두 180°까지 돌아 뒤쪽에서 만난다
    const back = PE(G, 180);
    body += at(4, 'pop', plate(back[0], back[1] - 14, '180°', { size: 20, color: C.purple }), 1.5);
    body += at(4, 'pop', tag(G.cx + G.R + 92, G.cy - 30, '동쪽 0°~180°', NORTH, { size: 18 }), 0.4);
    body += at(4, 'pop', tag(G.cx - G.R - 92, G.cy - 30, '서쪽 0°~180°', SOUTH, { size: 18 }), 0.7);
    body += flashPath(arcE(G, 0, 180, G.R), 4, C.green, 1.7, 5) + flashPath(arcE(G, 0, -180, G.R), 4, C.blue, 1.7, 5);
    css += turnCss(id, 'rotE', [[2, -60], [4, -180]]) + turnCss(id, 'rotW', [[3, 30], [4, 180]]);
    put('6-1/사회/3-1/경도', svg(id, body, css));
  })();

  // ── 적도: 북극과 남극 한가운데를 가로로 한 바퀴 두른 선, 위도 0° ──
  (function () {
    const id = 't61-s3-jeokdo';
    let css = base(id);
    const G = FG(300);
    let body = disk(G) + meridians(G) + latLine(G, 30, C.line, { dash: '' }) + latLine(G, -30, C.line, { dash: '' }) + latLine(G, 60, C.line, { dash: '' }) + latLine(G, -60, C.line, { dash: '' }) + rim(G);
    // 1칸: 북극과 남극
    body += at(1, 'pop', dot(G.cx, G.cy - G.R, C.ink, 9) + text(G.cx, G.cy - G.R - 14, '북극', { size: 20 }));
    body += at(1, 'pop', dot(G.cx, G.cy + G.R, C.ink, 9) + text(G.cx, G.cy + G.R + 28, '남극', { size: 20 }), 0.4);
    // 2칸: 두 극에서 같은 길이만큼 내려오고 올라와 한가운데에서 만난다
    const X = G.cx + G.R + 36;
    body += shown(2, `<path d="M${X - 10} ${G.cy - G.R} H${X + 10} M${X - 10} ${G.cy + G.R} H${X + 10}" stroke="${C.muted}" stroke-width="3" stroke-linecap="round"/>`);
    body += shown(2, `<g class="growy growy2">${`<path d="M${X} ${G.cy - G.R + 4} V${G.cy - 6}" stroke="${C.purple}" stroke-width="4" stroke-linecap="round"/>`}</g>` + `<g class="growu growu2"><path d="M${X} ${G.cy + 6} V${G.cy + G.R - 4}" stroke="${C.purple}" stroke-width="4" stroke-linecap="round"/></g>`);
    body += at(2, 'pop', `<path d="M${X - 8} ${G.cy - 74} H${X + 8} M${X - 8} ${G.cy - 64} H${X + 8} M${X - 8} ${G.cy + 64} H${X + 8} M${X - 8} ${G.cy + 74} H${X + 8}" stroke="${C.purple}" stroke-width="3" stroke-linecap="round"/>`, 1.1);
    body += shown(2, `<g class="grow grow2" style="transition-delay:1.2s">${latLine(G, 0, C.red, { w: 5, dash: '' })}</g>`);
    body += at(2, 'fin', latLabel(G, 0, '적도', { size: 22, color: C.red }), 2);
    // 3칸: 점이 적도를 따라 빙 돌고, 0° 꼬리표
    body += shown(3, [0, 1].map((k) => `<g class="trip trip3" style="--dx:${2 * G.R}px;animation-delay:${k * 1.3}s">${dot(G.cx - G.R, G.cy, C.red, 9)}</g>`).join(''));
    body += at(3, 'pop', tag(G.cx + G.R + 104, G.cy, '0°', RED, { size: 22 }), 0.3);
    body += flashPath(chordD(G, 0), 3, C.red, 0.5, 8);
    css += `
      .sc-${id} .growu { transform-box: fill-box; transform-origin: 50% 100%; transform: scaleY(0); transition: transform 1s ease-out .2s; }
      .on2 .sc-${id} .growu2 { transform: scaleY(1); }`;
    put('6-1/사회/3-1/적도', svg(id, body, css));
  })();

  // ── 본초 자오선: 영국 그리니치 천문대를 지나는 경도 0°의 경선 ──
  (function () {
    const id = 't61-s3-bonchojaoseon';
    let css = base(id);
    const G = FG(290);
    let body = disk(G) + latLine(G, 0, C.line, { dash: '' }) + latLine(G, 30, C.line, { dash: '' }) + latLine(G, -30, C.line, { dash: '' }) + latLine(G, 60, C.line, { dash: '' }) + latLine(G, -60, C.line, { dash: '' });
    // 1칸: 경선 여러 개가 그어진다
    body += shown(1, [-65, -35, 0, 35, 65].map((a, i) => `<path class="draw draw1" pathLength="1" style="transition-delay:${f(i * 0.2)}s" d="${merD(G, a)}" stroke="${C.muted}" stroke-width="2.5" fill="none"/>`).join(''));
    body += rim(G) + poles(G);
    // 2칸: 그리니치 천문대(북위 약 51°)를 찾는다
    const gy = latY(G, 51.5);
    body += at(2, 'pop', `<circle cx="${G.cx}" cy="${f(gy)}" r="10" fill="${C.purple}" stroke="white" stroke-width="3"/>`, 0.2);
    body += ring(G.cx, gy, 14, 2, C.purple, 0.5);
    body += at(2, 'fin', `<path d="M${G.cx + 14} ${f(gy - 4)} L${G.cx + G.R + 40} ${f(gy - 30)}" stroke="${C.purple}" stroke-width="2.5" stroke-linecap="round"/>`, 0.6);
    body += at(2, 'pop', tag(G.cx + G.R + 118, gy - 30, '그리니치 천문대', ODD, { size: 18 }), 0.6);
    body += at(2, 'fin', text(G.cx + G.R + 118, f(gy + 6), '영국', { size: 18, color: C.purple }), 0.9);
    // 3칸: 그 경선이 빨갛게 이어지고 0°, 동쪽·서쪽으로 세기 시작
    body += shown(3, `<path class="draw draw3" pathLength="1" d="${merD(G, 0)}" stroke="${C.red}" stroke-width="6" fill="none" stroke-linecap="round"/>`);
    body += shown(3, `<circle cx="${G.cx}" cy="${f(gy)}" r="10" fill="${C.purple}" stroke="white" stroke-width="3"/>`);
    body += at(3, 'fin', `<path d="M${G.cx + G.R + 50} ${G.cy + 56} L${G.cx + 8} ${G.cy + 96}" stroke="${C.red}" stroke-width="2.5" stroke-linecap="round"/>`, 1.2);
    body += at(3, 'pop', tag(G.cx + G.R + 118, G.cy + 46, '본초 자오선', RED, { size: 20 }), 1.2);
    body += at(3, 'pop', plate(G.cx, G.cy + 62, '0°', { size: 22, color: C.red }), 1.2);
    body += shown(3, flow([[G.cx + 12, G.cy + 24], [G.cx + 96, G.cy + 24]], C.green, { w: 4 }) + flow([[G.cx - 12, G.cy + 24], [G.cx - 96, G.cy + 24]], C.blue, { w: 4 }));
    body += at(3, 'fin', text(G.cx + 70, G.cy + 4, '동', { size: 20, color: C.green }) + text(G.cx - 70, G.cy + 4, '서', { size: 20, color: C.blue }), 1.4);
    body += flashPath(merD(G, 0), 3, C.red, 1.8, 9);
    put('6-1/사회/3-1/본초 자오선', svg(id, body, css));
  })();

  // ── 북위·남위: 적도의 북쪽·남쪽 위도, 도시 하나를 예로 ──
  const latSide = (north) => {
    const id = north ? 't61-s3-bugwi' : 't61-s3-namwi';
    const word = north ? '북위' : '남위', col = north ? C.green : C.blue, pair = north ? NORTH : SOUTH, sg = north ? 1 : -1;
    let css = base(id);
    const G = FG(310);
    let body = disk(G);
    // 2칸: 맡은 절반이 옅게 칠해진다
    body += shown(2, `<path class="fin fin2" d="${north ? bandD(G, 0, 90) : bandD(G, -90, 0)}" fill="${north ? C.mint : C.sky}" opacity=".7"/>`);
    body += stillMeridians(G) + rim(G) + poles(G);
    // 1칸: 적도 0°
    body += shown(1, `<g class="grow grow1">${latLine(G, 0, C.red, { w: 4, dash: '' })}</g>`);
    body += at(1, 'fin', latLabel(G, 0, '적도 0°', { size: 20, color: C.red }), 0.8);
    // 2칸: 북위(남위) 30°·60°·90°
    [30, 60].forEach((L, i) => {
      body += shown(2, `<g class="grow grow2" style="transition-delay:${f(0.3 + i * 0.4)}s">${latLine(G, sg * L, col, { w: 3 })}</g>`, 3);
      body += shown(2, g('fin fin2', latLabel(G, sg * L, `${word} ${L}°`, { size: 20, color: col }), 0.7 + i * 0.4), 3);
    });
    body += at(2, 'pop', text(G.cx + 64, north ? G.cy - G.R - 11 : G.cy + G.R + 26, `${word} 90°`, { size: 20, color: col, anchor: 'start' }), 1.5);
    body += shown(2, flow(north ? [[G.cx + G.R + 40, G.cy - 10], [G.cx + G.R + 40, G.cy - 96]] : [[G.cx + G.R + 40, G.cy + 10], [G.cx + G.R + 40, G.cy + 96]], col, { w: 4 }));
    body += at(2, 'fin', text(G.cx + G.R + 56, north ? G.cy - 46 : G.cy + 60, north ? '북쪽' : '남쪽', { size: 20, color: col, anchor: 'start' }), 0.4);
    // 3칸: 도시 하나(서울 북위 약 37°, 시드니 남위 약 34°)
    const L = north ? 37 : -34, city = north ? '서울' : '시드니';
    body += shown(3, `<g class="grow grow3">${latLine(G, L, col, { w: 3.5 })}</g>`);
    body += at(3, 'fin', latLabel(G, L, `${word} 약 ${Math.abs(L)}°`, { size: 20, color: col }), 0.6);
    body += at(3, 'drop', dot(G.cx + 20, latY(G, L), C.orange, 10), 0.9);
    body += ring(G.cx + 20, latY(G, L), 14, 3, C.orange, 1.2);
    body += at(3, 'pop', tag(G.cx + 20, latY(G, L) + (north ? 38 : -38), city, ANG, { size: 20 }), 1.1);
    body += flashPath(north ? bandD(G, 0, 90) : bandD(G, -90, 0), 3, col, 1.6, 5);
    put(`6-1/사회/3-1/${word}`, svg(id, body, css));
  };
  latSide(true);
  latSide(false);

  // ── 동경·서경: 본초 자오선의 동쪽·서쪽 경도, 도시 하나를 예로 ──
  const lonSide = (east) => {
    const id = east ? 't61-s3-donggyeong' : 't61-s3-seogyeong';
    const word = east ? '동경' : '서경', col = east ? C.green : C.blue, pair = east ? NORTH : SOUTH, sg = east ? 1 : -1;
    let css = base(id);
    const G = TG(sg * 60);
    let body = tiltGrid(G) + tiltRim(G) + northPole(G);
    body += `<circle cx="${G.cx}" cy="${G.cy}" r="5" fill="${C.ink}"/>`;
    // 1칸: 본초 자오선 0°
    body += shown(1, `<path class="draw draw1" pathLength="1" d="${meridianT(G, 0).vis}" stroke="${C.red}" stroke-width="4.5" fill="none" stroke-linecap="round"/>`);
    const p0 = PE(G, 0);
    body += at(1, 'pop', plate(p0[0] + sg * 4, p0[1] + 26, '0°', { size: 20, color: C.red }), 1.1);
    const top0 = P3(G, 62, 0);
    body += at(1, 'fin', plate(f(top0[0] - sg * 12), f(top0[1] - 4), '본초 자오선', { size: 18, color: C.red, anchor: east ? 'end' : 'start' }), 1.1);
    // 2칸: 동쪽(서쪽)으로 30°마다 경선
    const steps = [30, 60, 90, 120];
    steps.forEach((d, i) => {
      body += shown(2, `<path class="draw draw2" pathLength="1" style="transition-delay:${f(i * 0.3)}s" d="${meridianT(G, sg * d).vis}" stroke="${col}" stroke-width="3" fill="none"/>`);
      const p = PE(G, sg * d);
      body += shown(2, g('fin fin2', plate(p[0], p[1] + 26, `${d}°`, { size: 18, color: col }), 0.5 + i * 0.3), 3);
    });
    const eq = []; for (let d = 6; d <= 134; d += 4) eq.push(PE(G, sg * d));
    body += shown(2, flow(eq, col, { w: 4 }), 3);
    body += at(2, 'pop', tag(G.cx + sg * (G.R + 86), G.cy + 70, east ? '동쪽' : '서쪽', pair, { size: 20 }), 1.4);
    // 3칸: 도시 하나(서울 동경 약 127°, 뉴욕 서경 약 74°)
    const lon = east ? 127 : -74, lat = east ? 37 : 41, city = east ? '서울' : '뉴욕';
    body += shown(3, planeRadius(G, 'rotC', 0, C.orange));
    body += shown(3, `<path class="draw draw3" pathLength="1" d="${arcE(G, 0, lon, 70)}" stroke="${C.orange}" stroke-width="4" fill="none"/>`);
    body += shown(3, `<path class="draw draw3" pathLength="1" style="transition-delay:1.2s" d="${meridianT(G, lon).vis}" stroke="${C.orange}" stroke-width="4" fill="none"/>`);
    const c = P3(G, lat, lon);
    body += at(3, 'drop', dot(c[0], c[1], C.orange, 10), 1.5);
    body += ring(c[0], c[1], 14, 3, C.orange, 1.7);
    body += at(3, 'pop', tag(c[0] + sg * 6, c[1] - 36, city, ANG, { size: 20 }), 1.6);
    body += at(3, 'pop', tag(G.cx + sg * (G.R + 86), G.cy + 18, `${word} 약 ${Math.abs(lon)}°`, pair, { size: 18 }), 1.8);
    css += turnCss(id, 'rotC', [[3, -sg * Math.abs(lon)]], 1.5);
    put(`6-1/사회/3-1/${word}`, svg(id, body, css));
  };
  lonSide(true);
  lonSide(false);

  // ── 북반구·남반구: 적도를 기준으로 지구를 반으로 나눈 북쪽·남쪽 ──
  const hemi = (north) => {
    const id = north ? 't61-s3-bukbangu' : 't61-s3-nambangu';
    let css = base(id);
    const G = FG(290);
    const topD = `M${G.cx - G.R} ${G.cy} A${G.R} ${G.R} 0 0 1 ${G.cx + G.R} ${G.cy} Z`;
    const botD = `M${G.cx + G.R} ${G.cy} A${G.R} ${G.R} 0 0 1 ${G.cx - G.R} ${G.cy} Z`;
    const half = (isTop) => {
      const d = isTop ? topD : botD, mine = isTop === north, cid = `${id}-${isTop ? 't' : 'b'}`;
      let h = `<defs><clipPath id="${cid}"><path d="${d}"/></clipPath></defs><path d="${d}" fill="white"/>`;
      if (mine) h += `<g class="b3"><path class="fin fin3" d="${d}" fill="${isTop ? C.mint : C.sky}"/></g>`;
      h += `<g clip-path="url(#${cid})">${stillMeridians(G)}${latLine(G, isTop ? 30 : -30, C.line, { dash: '' })}${latLine(G, isTop ? 60 : -60, C.line, { dash: '' })}</g>`;
      h += `<path d="${d}" fill="none" stroke="${C.muted}" stroke-width="3" stroke-linejoin="round"/>`;
      h += text(G.cx, isTop ? G.cy - G.R - 11 : G.cy + G.R + 26, isTop ? '북극' : '남극', { size: 18, color: C.muted });
      if (mine) {
        const L = north ? 37 : -34;
        h += `<g class="b3">${g('drop drop3', dot(G.cx + 20, latY(G, L), C.orange, 10), 1)}</g>`;
        h += `<g class="b3">${g('pop pop3', tag(G.cx + 20, latY(G, L) + (north ? 36 : -36), north ? '서울' : '시드니', ANG, { size: 18 }), 1.2)}</g>`;
      }
      return `<g class="${isTop ? 'hn' : 'hs'}">${h}</g>`;
    };
    let body = half(true) + half(false);
    // 1칸: 적도
    body += shown(1, `<g class="grow grow1">${latLine(G, 0, C.red, { w: 4, dash: '' })}</g>`, 2);
    body += at(1, 'fin', latLabel(G, 0, '적도', { size: 20, color: C.red }), 0.9);
    // 2칸: 적도에서 위아래로 벌어진다(벌어진 틈에도 적도 줄이 남는다)
    body += shown(2, latLine(G, 0, C.red, { w: 3, dash: '8 6' }));
    const X = G.cx + G.R + 44;
    body += shown(2, flow([[X, G.cy - 10], [X, G.cy - 60]], C.muted, { w: 4 }) + flow([[X, G.cy + 10], [X, G.cy + 60]], C.muted, { w: 4 }), 3);
    // 3칸: 맡은 절반에 이름표, 다른 절반은 옅은 글씨
    const ty = north ? G.cy - 74 : G.cy + 74, oy = north ? G.cy + 74 : G.cy - 74;
    const pair = north ? NORTH : SOUTH;
    body += at(3, 'pop', tag(G.cx + G.R + 104, ty, north ? '북반구' : '남반구', pair, { size: 24 }), 0.4);
    body += at(3, 'fin', text(G.cx + G.R + 104, oy + 7, north ? '남반구' : '북반구', { size: 18, color: C.muted }), 0.8);
    body += `<g class="b3"><g class="${north ? 'hn' : 'hs'}"><path class="flash flash3" style="animation-delay:1.4s" d="${north ? topD : botD}" fill="none" stroke="${north ? C.green : C.blue}" stroke-width="5"/></g></g>`;
    css += `
      .sc-${id} .hn, .sc-${id} .hs { transition: transform 1.1s ease-in-out; }
      .on2 .sc-${id} .hn { transform: translateY(-14px); }
      .on2 .sc-${id} .hs { transform: translateY(14px); }`;
    put(`6-1/사회/3-1/${north ? '북반구' : '남반구'}`, svg(id, body, css));
  };
  hemi(true);
  hemi(false);

  // ── 시차: 지구가 24시간에 360° 돌아 경도 15°마다 1시간씩 시각이 달라진다 ──
  (function () {
    const id = 't61-s3-sicha';
    let css = base(id);
    const E = { cx: 196, cy: 190, R: 104 };
    // 북극 위에서 내려다보면 지구는 시계 반대 방향으로 돈다. 본초 자오선(0°)이 해 쪽(왼쪽)을 볼 때가 그곳의 낮 12시.
    // 화면 각(y 아래가 +): 왼쪽 = 180°. 동쪽 경도 L 은 시계 반대 방향 → 화면 각 180° − L.
    const spoke = (L) => { const ang = 180 - L; return [E.cx + E.R * cosD(ang), E.cy + E.R * sinD(ang)]; };
    let body = '';
    // 해
    const sx = 34, sy = E.cy;
    let rays = '';
    for (let k = 0; k < 8; k++) { const a = k * 45; rays += `<path d="M${f(sx + 28 * cosD(a))} ${f(sy + 28 * sinD(a))} L${f(sx + 38 * cosD(a))} ${f(sy + 38 * sinD(a))}" stroke="${C.orange}" stroke-width="4" stroke-linecap="round"/>`; }
    body += `<g class="sunr">${rays}</g><circle cx="${sx}" cy="${sy}" r="21" fill="${C.yellow}" stroke="${C.orange}" stroke-width="3"/>`;
    body += text(E.cx, 34, '북극 위에서 본 지구', { size: 18, color: C.muted });
    // 도는 지구: 바퀴살 24개(15°마다)
    let wheel = `<circle cx="${E.cx}" cy="${E.cy}" r="${E.R}" fill="white"/>`;
    for (let k = 0; k < 24; k++) { const p = spoke(k * 15); wheel += `<path d="M${E.cx} ${E.cy} L${f(p[0])} ${f(p[1])}" stroke="${C.line}" stroke-width="${k % 2 ? 1.5 : 2}"/>`; }
    // 2칸: 0°~15° 부채꼴
    const w0 = spoke(0), w1 = spoke(15);
    wheel += `<g class="b2"><path class="fin fin2" d="M${E.cx} ${E.cy} L${xy(w0)} A${E.R} ${E.R} 0 0 0 ${xy(w1)} Z" fill="${C.peach}" stroke="${C.orange}" stroke-width="3" stroke-linejoin="round"/></g>`;
    const spokeLine = (L, color, w = 4) => { const p = spoke(L); return `<path d="M${E.cx} ${E.cy} L${xy(p)}" stroke="${color}" stroke-width="${w}" stroke-linecap="round"/>`; };
    wheel += spokeLine(0, C.red, 5);
    wheel += `<g class="b3">${spokeLine(15, C.orange)}${spokeLine(30, C.purple)}</g>`;
    wheel += `<g class="b3">${dot(...spoke(0), C.red, 8)}${dot(...spoke(15), C.orange, 8)}${dot(...spoke(30), C.purple, 8)}</g>`;
    body += `<g class="spin">${wheel}</g>`;
    // 밤 쪽(해 반대편) 그늘
    body += `<path d="M${E.cx} ${E.cy - E.R} A${E.R} ${E.R} 0 0 1 ${E.cx} ${E.cy + E.R} Z" fill="${C.ink}" opacity=".1"/>`;
    body += `<circle cx="${E.cx}" cy="${E.cy}" r="${E.R}" fill="none" stroke="${C.muted}" stroke-width="3"/>`;
    body += `<circle cx="${E.cx}" cy="${E.cy}" r="6" fill="${C.ink}"/>`;
    body += plate(E.cx + 38, E.cy - 8, '북극', { size: 18, color: C.ink });
    // 1칸: 시계 반대 방향 둥근 화살표 + 360°·24시간
    const ringPts = []; for (let d = 200; d <= 500; d += 6) { const a = -d; ringPts.push([E.cx + (E.R + 20) * cosD(a), E.cy + (E.R + 20) * sinD(a)]); }
    body += shown(1, flow(ringPts, C.green, { w: 4 }), 2);
    body += at(1, 'pop', tag(E.cx - 56, E.cy + E.R + 40, '360°', NORTH, { size: 20 }), 0.3);
    body += at(1, 'pop', tag(E.cx + 56, E.cy + E.R + 40, '24시간', NORTH, { size: 20 }), 0.6);
    // 2칸: 15° = 1시간
    const mid = 180 - 7.5;
    body += at(2, 'pop', plate(f(E.cx + 62 * cosD(mid)), f(E.cy + 62 * sinD(mid) + 7), '15°', { size: 20, color: C.orange }), 0.4);
    body += at(2, 'pop', tag(E.cx - 56, 68, '15° → 1시간', ANG, { size: 20 }), 0.9);
    // 3칸: 오른쪽 시계 셋 — 0° 12시, 동쪽 15° 1시, 동쪽 30° 2시
    const clocks = [[0, C.red, '0°'], [15, C.orange, '동경 15°'], [30, C.purple, '동경 30°']];
    const CY = 176, CR = 36;
    clocks.forEach(([L, color, label], i) => {
      const x = 398 + i * 92, h = L / 15;
      let face = `<circle cx="${x}" cy="${CY}" r="${CR}" fill="white" stroke="${color}" stroke-width="4"/>`;
      for (let k = 0; k < 12; k++) { const a = k * 30 - 90; face += `<path d="M${f(x + (CR - 5) * cosD(a))} ${f(CY + (CR - 5) * sinD(a))} L${f(x + (CR - (k % 3 ? 9 : 12)) * cosD(a))} ${f(CY + (CR - (k % 3 ? 9 : 12)) * sinD(a))}" stroke="${C.ink}" stroke-width="${k % 3 ? 1.5 : 2.5}"/>`; }
      face += `<g class="hand hh${i}"><path d="M${x} ${CY + 4} V${CY - 19}" stroke="${C.ink}" stroke-width="5" stroke-linecap="round"/></g>`;
      face += `<g class="hand mh${i}"><path d="M${x} ${CY + 5} V${CY - 29}" stroke="${C.ink}" stroke-width="3" stroke-linecap="round"/></g>`;
      face += `<circle cx="${x}" cy="${CY}" r="4" fill="${C.ink}"/>`;
      body += at(3, 'pop', face, i * 0.25);
      body += at(3, 'fin', text(x, CY + CR + 28, label, { size: 18, color }), i * 0.25);
      body += at(3, 'fin', text(x, CY + CR + 54, `${h ? h : 12}시`, { size: 20 }), 1.6 + i * 0.25);
      css += `
      .sc-${id} .hh${i}, .sc-${id} .mh${i} { transform-origin: ${x}px ${CY}px; }
      .on3 .sc-${id} .hh${i} { transform: rotate(${h * 30}deg); }
      .on3 .sc-${id} .mh${i} { transform: rotate(${h * 360}deg); }`;
      if (i) body += at(3, 'pop', text(f(398 + (i - 0.5) * 92), CY - CR - 16, '+1시간', { size: 18, color: C.orange }), 1.4 + i * 0.2);
    });
    // 4칸: 0°와 동경 30°의 시차 2시간
    const by = CY + CR + 74;
    body += shown(4, `<path class="draw draw4" pathLength="1" d="M398 ${by - 10} V${by} H582 V${by - 10}" stroke="${C.green}" stroke-width="4" fill="none" stroke-linejoin="round" stroke-linecap="round"/>`);
    body += at(4, 'pop', tag(490, by + 26, '시차 2시간', NORTH, { size: 20 }), 1);
    body += `<g class="b4"><circle class="flash flash4" cx="398" cy="${CY}" r="${CR + 6}" fill="none" stroke="${C.green}" stroke-width="4"/><circle class="flash flash4" cx="582" cy="${CY}" r="${CR + 6}" fill="none" stroke="${C.green}" stroke-width="4"/></g>`;
    css += `
      .sc-${id} .spin { transform-box: view-box; transform-origin: ${E.cx}px ${E.cy}px; transition: transform 4s linear; }
      .on1 .sc-${id} .spin { transform: rotate(-360deg); }
      .sc-${id} .hand { transform-box: view-box; transition: transform 2s ease-in-out .6s; }
      .sc-${id} .sunr { transform-box: fill-box; transform-origin: center; animation: ${id}-sun 6s linear infinite; }
      @keyframes ${id}-sun { to { transform: rotate(360deg); } }`;
    put('6-1/사회/3-1/시차', svg(id, body, css));
  })();
})(typeof window !== 'undefined' ? window : globalThis);
