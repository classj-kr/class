// 사회 6-2 낱말 도식: 그래프·지구본으로 보여야 하는 낱말(위도·기후·해발 고도·인구 피라미드·국내 총생산 …)을 코드로 그린다.
// 지구본은 대륙을 그리지 않고 원과 가로줄(위도)·띠(기후대)만 쓴다. 기온·강수량·인구 막대의 수치는 모양만 보이는 예시다.
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
  const sinD = (d) => Math.sin((d * Math.PI) / 180), cosD = (d) => Math.cos((d * Math.PI) / 180);

  // 글자 폭 어림(맑은 고딕 굵게: 한글·℃ 1em, 숫자 .6em, 빈칸 .3em)
  const tw = (s, size) => [...String(s)].reduce((a, c) => a + (/[가-힣℃]/.test(c) ? 1 : c === ' ' ? 0.3 : 0.6), 0) * size;
  const HOT = [C.peach, C.orange], COLD = [C.sky, C.blue], OK = [C.mint, C.green], OLD = [C.lilac, C.purple];
  const tag = (cx, cy, label, [fill, stroke] = OK, { size = 20 } = {}) => {
    const w = Math.round(tw(label, size) + size * 1.3), h = Math.round(size * 1.7);
    return `<g><rect x="${f(cx - w / 2)}" y="${f(cy - h / 2)}" width="${w}" height="${h}" rx="${h / 2}" fill="${fill}" stroke="${stroke}" stroke-width="2.5"/>${text(f(cx), f(cy + size * 0.36), label, { size })}</g>`;
  };
  const head = (x, y, ang, color, w = 4) => {
    const l = 8 + w * 1.4, p = (d) => `${f(x - l * Math.cos(ang + d))} ${f(y - l * Math.sin(ang + d))}`;
    return `<path d="M${p(-0.5)} L${f(x)} ${f(y)} L${p(0.5)}" stroke="${color}" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  };
  // 흐르는 화살표: 점선이 끝 쪽으로 흐른다(무늬 한 마디 24)
  const flow = (pts, color, { w = 5, dash = '14 10' } = {}) => {
    const [a, b] = pts.slice(-2), ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
    const end = [b[0] - w * Math.cos(ang), b[1] - w * Math.sin(ang)];
    const d = 'M' + [...pts.slice(0, -1), end].map((p) => `${f(p[0])} ${f(p[1])}`).join(' L');
    return `<g><path class="mar" d="${d}" stroke="${color}" stroke-width="${w}" stroke-dasharray="${dash}" stroke-linecap="round" stroke-linejoin="round" fill="none"/>${head(b[0], b[1], ang, color, w)}</g>`;
  };
  // 양쪽 화살촉이 있는 세로 자(높이 재기)
  const ruler = (x, y1, y2, color) => `<path d="M${x} ${y1 + 3} V${y2 - 3}" stroke="${color}" stroke-width="4" stroke-linecap="round"/>${head(x, y1, -Math.PI / 2, color, 4)}${head(x, y2, Math.PI / 2, color, 4)}`;
  const glowRect = (x, y, w, h, n, color = C.green, delay = 0, rx = 12) =>
    `<g class="b${n}"><rect class="flash flash${n}"${dl(delay)} x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="${rx}" fill="none" stroke="${color}" stroke-width="5"/></g>`;
  // 칸마다 자리를 옮기는 것: pts = [[x,y] (1칸), [x,y] (2칸) …], 빈 칸은 앞 칸 자리를 그대로 쓴다
  const mvStyle = (pts, extra = '') => {
    const out = [];
    for (let n = 1; n <= 5; n++) { const p = pts[Math.min(n, pts.length) - 1]; out.push(`--x${n}:${f(p[0])}px;--y${n}:${f(p[1])}px`); }
    return out.join(';') + (extra ? ';' + extra : '');
  };
  const coin = (x = 0, y = 0) => `<ellipse cx="${x}" cy="${y + 3.5}" rx="15" ry="6" fill="${C.orange}"/><ellipse cx="${x}" cy="${y}" rx="15" ry="6" fill="${C.yellow}" stroke="${C.orange}" stroke-width="2"/>`;

  // 장면마다 같이 쓰는 움직임
  const base = (id) => {
    let s = `
    .sc-${id} .pop, .sc-${id} .pulse, .sc-${id} .ring, .sc-${id} .twk { transform-box: fill-box; transform-origin: center; }
    .sc-${id} .twk { animation: ${id}-twk 1.6s ease-in-out infinite alternate; }
    .sc-${id} .mar { animation: ${id}-mar .7s linear infinite; }
    .sc-${id} .draw { stroke-dasharray: 1; stroke-dashoffset: 1; transition: stroke-dashoffset 1.6s ease-in-out .2s; }
    .sc-${id} .grow { transform-box: fill-box; transform-origin: 0 50%; transform: scaleX(0); transition: transform 1.2s ease-in-out; }
    .sc-${id} .growy { transform-box: fill-box; transform-origin: 50% 100%; transform: scaleY(0); transition: transform 1s ease-out .2s; }
    .sc-${id} .mer { transform-box: view-box; animation: ${id}-mer 10s linear infinite; }
    .sc-${id} .mv { transform: translate(var(--x1), var(--y1)); transition: transform 1.4s ease-in-out, opacity .6s ease; }
    .sc-${id} .sway { animation: ${id}-sway 3.2s ease-in-out infinite; }
    .sc-${id} .jig { animation: ${id}-jig 1.3s ease-in-out infinite; }
    .sc-${id} .up { animation: ${id}-up 2s ease-in infinite; }
    .sc-${id} .fall { animation: ${id}-fall 1.1s ease-in infinite; }
    .sc-${id} .ring { opacity: 0; }
    @keyframes ${id}-pop { 0% { opacity: 0; transform: scale(.3); } 70% { opacity: 1; transform: scale(1.12); } 100% { opacity: 1; transform: scale(1); } }
    @keyframes ${id}-fin { from { opacity: 0; } to { opacity: 1; } }
    @keyframes ${id}-rise { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
    @keyframes ${id}-drop { from { opacity: 0; transform: translateY(-26px); } to { opacity: 1; transform: none; } }
    @keyframes ${id}-pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }
    @keyframes ${id}-flash { 0% { opacity: 0; } 20% { opacity: 1; } 40% { opacity: .25; } 60% { opacity: 1; } 80% { opacity: .25; } 100% { opacity: 1; } }
    @keyframes ${id}-ring { 0% { opacity: .9; transform: scale(1); } 100% { opacity: 0; transform: scale(1.6); } }
    @keyframes ${id}-twk { from { opacity: .35; } to { opacity: 1; } }
    @keyframes ${id}-mar { from { stroke-dashoffset: 24; } to { stroke-dashoffset: 0; } }
    @keyframes ${id}-mer { 0% { transform: scaleX(-1); } 16.67% { transform: scaleX(-.866); } 33.33% { transform: scaleX(-.5); } 49.9% { transform: scaleX(-.02); } 50.1% { transform: scaleX(.02); } 66.67% { transform: scaleX(.5); } 83.33% { transform: scaleX(.866); } 100% { transform: scaleX(1); } }
    @keyframes ${id}-sway { 0%, 100% { transform: translateX(-12px); } 50% { transform: translateX(12px); } }
    @keyframes ${id}-jig { 0%, 100% { transform: translate(0, 0); } 25% { transform: translate(2.5px, -2px); } 50% { transform: translate(-2px, 1.5px); } 75% { transform: translate(1.5px, 2.5px); } }
    @keyframes ${id}-up { 0% { opacity: 0; transform: translateY(0); } 25%, 70% { opacity: 1; } 100% { opacity: 0; transform: translateY(var(--up, -40px)); } }
    @keyframes ${id}-fall { 0% { opacity: 0; transform: translateY(0); } 20%, 80% { opacity: 1; } 100% { opacity: 0; transform: translateY(var(--fall, 30px)); } }
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
    .on${n} .sc-${id} .growy${n} { transform: scaleY(1); }`;
    for (let n = 2; n <= 5; n++) s += `
    .on${n} .sc-${id} .mv { transform: translate(var(--x${n}), var(--y${n})); }`;
    return s;
  };
  const ring = (cx, cy, r, n, color = C.green, s = 0) => `<g class="b${n}"><circle class="ring ring${n}"${dl(s)} cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${color}" stroke-width="4"/></g>`;

  // ── 지구본: 원 + 돌아가는 경선(가는 줄) + 위도 가로줄. 대륙은 그리지 않는다. ──
  const latY = (G, lat) => G.cy - G.R * sinD(lat);
  const chordD = (G, lat) => `M${f(G.cx - G.R * cosD(lat))} ${f(latY(G, lat))} H${f(G.cx + G.R * cosD(lat))}`;
  // 위도 a~b(a<b) 사이 띠
  const bandD = (G, a, b) => {
    const ya = latY(G, a), yb = latY(G, b), xa = G.R * cosD(a), xb = G.R * cosD(b);
    return `M${f(G.cx - xb)} ${f(yb)} H${f(G.cx + xb)} A${G.R} ${G.R} 0 0 1 ${f(G.cx + xa)} ${f(ya)} H${f(G.cx - xa)} A${G.R} ${G.R} 0 0 1 ${f(G.cx - xb)} ${f(yb)} Z`;
  };
  // 경선 넷이 왼쪽에서 오른쪽으로 돈다(지구가 서쪽에서 동쪽으로 도는 쪽)
  const meridians = (G, color = C.line) => [0, 1, 2, 3].map((k) => `<path class="mer" style="transform-origin:${G.cx}px ${G.cy}px;animation-delay:${-k * 2.5}s" d="M${G.cx} ${G.cy - G.R} A${G.R} ${G.R} 0 0 1 ${G.cx} ${G.cy + G.R}" stroke="${color}" stroke-width="2" fill="none" vector-effect="non-scaling-stroke"/>`).join('');
  const disk = (G) => `<circle cx="${G.cx}" cy="${G.cy}" r="${G.R}" fill="white"/>`;
  const rim = (G) => `<circle cx="${G.cx}" cy="${G.cy}" r="${G.R}" fill="none" stroke="${C.muted}" stroke-width="3"/>`;
  const latLine = (G, lat, color = C.muted, { w = 2, dash = '6 5', cls = '' } = {}) => `<path class="${cls}" d="${chordD(G, lat)}" stroke="${color}" stroke-width="${w}"${dash ? ` stroke-dasharray="${dash}"` : ''} fill="none"/>`;
  // 위도 이름표: 원 왼쪽 바깥
  const latLabel = (G, lat, label, { size = 18, color = C.ink } = {}) => text(f(G.cx - G.R * cosD(lat) - 8), f(latY(G, lat) + size * 0.36), label, { size, color, anchor: 'end' });

  // ── 기후 그래프: 달마다 기온(꺾은선)과 강수량(막대) ──
  const climo = ({ x0 = 352, x1 = 590, y0 = 64, y1 = 290, tmin = -30, tmax = 40, ticks = [-20, 0, 20, 40], rmax = 400, rainAxis = true }) => {
    const dx = (x1 - x0) / 12, mx = (i) => x0 + (i + 0.5) * dx, ty = (t) => y1 - ((t - tmin) / (tmax - tmin)) * (y1 - y0);
    let axes = `<path d="M${x0} ${y0 - 8} V${y1} H${x1 + 4}" stroke="${C.ink}" stroke-width="2.5" fill="none"/>`;
    for (const t of ticks) axes += `<path d="M${x0 - 6} ${f(ty(t))} H${x0}" stroke="${C.ink}" stroke-width="2"/>` + text(x0 - 10, f(ty(t) + 6.5), t, { size: 18, anchor: 'end', weight: 600 });
    axes += text(x0 - 10, y0 - 22, '℃', { size: 18, anchor: 'end', color: C.red });
    if (tmin < 0) axes += `<path d="M${x0} ${f(ty(0))} H${x1}" stroke="${C.muted}" stroke-width="2" stroke-dasharray="6 5"/>`;
    for (const i of dx < 18 ? [0, 6, 11] : [0, 3, 6, 9]) axes += text(f(mx(i)), y1 + 26, `${i + 1}월`, { size: 18, weight: 600 });
    // 오른쪽 축: 강수량(mm). 막대는 이 눈금으로 읽는다.
    if (rainAxis) {
      axes += `<path d="M${x1 + 4} ${y0 - 8} V${y1}" stroke="${C.blue}" stroke-width="2.5"/>`;
      for (const r of [0, rmax / 2, rmax]) { const y = f(y1 - (r / rmax) * (y1 - y0)); axes += `<path d="M${x1 + 4} ${y} H${x1 + 10}" stroke="${C.blue}" stroke-width="2"/>` + text(x1 + 13, f(y + 6.5), r, { size: 18, anchor: 'start', weight: 600, color: C.blue }); }
      axes += text(x1 + 13, y0 - 22, 'mm', { size: 18, anchor: 'start', color: C.blue });
    }
    const bars = (n, rains) => `<g class="b${n}">${rains.map((r, i) => {
      const h = Math.max(3, (r / rmax) * (y1 - y0));
      return `<rect class="rb" style="transition-delay:${f(i * 0.07)}s" x="${f(mx(i) - 7.5)}" y="${f(y1 - h)}" width="15" height="${f(h)}" rx="2" fill="${C.sky}" stroke="${C.blue}" stroke-width="2"/>`;
    }).join('')}</g>`;
    const line = (n, temps, color = C.red) => {
      const d = 'M' + temps.map((t, i) => `${f(mx(i))} ${f(ty(t))}`).join(' L');
      return `<g class="b${n}"><path class="draw draw${n}" pathLength="1" d="${d}" stroke="${color}" stroke-width="4.5" stroke-linejoin="round" stroke-linecap="round" fill="none"/></g>`;
    };
    // 그래프 위 이름표(기온 선·강수량 막대)
    const legend = (n, kind, x, y = 20) => kind === 'rain'
      ? shown(n, `<rect x="${x}" y="${y - 13}" width="15" height="17" rx="2" fill="${C.sky}" stroke="${C.blue}" stroke-width="2"/>` + text(x + 23, y + 2, '강수량', { size: 18, anchor: 'start', color: C.blue }))
      : shown(n, `<path d="M${x} ${y - 5} H${x + 24}" stroke="${C.red}" stroke-width="4.5" stroke-linecap="round"/>` + text(x + 32, y + 2, '기온', { size: 18, anchor: 'start', color: C.red }));
    const css = (id, n) => `
      .sc-${id} .rb { transform-box: fill-box; transform-origin: 50% 100%; transform: scaleY(0); transition: transform .7s ease-out; }
      .on${n} .sc-${id} .rb { transform: scaleY(1); }`;
    return { axes, bars, line, legend, css, mx, ty, dx, x0, x1, y0, y1 };
  };

  // ════ 1-1 세계의 다양한 지형과 생활 모습 ════

  // ── 해발 고도: 바다 높이에서 뻗은 기준선(0 m)부터 잰 높이 ──
  (function () {
    const id = 't62-s11-haebal';
    let css = base(id);
    const SEA = 230;
    let body = `<defs><clipPath id="${id}-sea"><rect x="0" y="${SEA - 12}" width="200" height="${360 - SEA + 12}"/></clipPath></defs>`;
    body += `<rect x="0" y="${SEA}" width="200" height="${360 - SEA}" fill="${C.sky}"/>`;
    const wave = (y, amp, ph) => {
      let d = '';
      for (let x = -30; x <= 230; x += 5) d += `${d ? ' L' : 'M'}${x} ${f(y + amp * Math.sin((x / 38) * Math.PI + ph))}`;
      return d;
    };
    body += `<g clip-path="url(#${id}-sea)"><g class="sway"><path d="${wave(SEA, 4, 0)}" stroke="${C.blue}" stroke-width="3" fill="none"/></g><g class="sway" style="animation-delay:-1.6s"><path d="${wave(SEA + 40, 4, 1)}" stroke="${C.blue}" stroke-width="2.5" fill="none" opacity=".6"/></g><g class="sway" style="animation-delay:-.8s"><path d="${wave(SEA + 80, 4, 2)}" stroke="${C.blue}" stroke-width="2.5" fill="none" opacity=".6"/></g></g>`;
    // 땅: 바닷가 → 높은 산 → 높고 평평한 땅
    body += `<path d="M184 360 V236 L240 232 Q290 228 330 160 L400 80 L452 146 Q472 131 505 130 H640 V360 Z" fill="${C.mint}" stroke="${C.green}" stroke-width="3" stroke-linejoin="round"/>`;
    body += text(90, 298, '바다', { size: 20, color: C.blue });
    // 1칸: 기준선
    body += shown(1, `<g class="grow grow1"><path d="M8 ${SEA} H632" stroke="${C.blue}" stroke-width="3" stroke-dasharray="12 7"/></g>`);
    body += at(1, 'pop', tag(48, SEA - 26, '0 m', COLD, { size: 18 }), 0.9);
    // 2칸: 산꼭대기 높이
    body += shown(2, `<circle cx="400" cy="80" r="6" fill="${C.orange}"/><g class="growy growy2">${ruler(400, 86, SEA - 2, C.orange)}</g>`);
    body += at(2, 'pop', tag(400, 52, '3,000 m', HOT, { size: 18 }), 0.9);
    // 3칸: 높고 평평한 땅의 높이도 기준선에서
    body += shown(3, `<circle cx="575" cy="130" r="6" fill="${C.purple}"/><g class="growy growy3">${ruler(575, 136, SEA - 2, C.purple)}</g>`);
    body += at(3, 'pop', tag(575, 102, '2,000 m', OLD, { size: 18 }), 0.9);
    // 4칸: 기준선과 두 자가 반짝인다
    body += glowRect(4, SEA - 9, 632, 18, 4, C.blue, 0.1, 9);
    body += glowRect(386, 74, 28, SEA - 70, 4, C.orange, 0.5, 10) + glowRect(561, 124, 28, SEA - 120, 4, C.purple, 0.8, 10);
    put('6-2/사회/1-1/해발 고도', svg(id, body, css));
  })();

  // ════ 1-2 세계의 다양한 기후와 생활 모습 ════

  // ── 위도: 적도 0°에서 북쪽·남쪽으로 지구 중심에서 잰 각도 ──
  (function () {
    const id = 't62-s12-wido';
    let css = base(id);
    const G = { cx: 330, cy: 182, R: 144 };
    let body = disk(G) + meridians(G) + rim(G);
    body += text(G.cx, G.cy - G.R - 10, '북극', { size: 18, color: C.muted });
    body += text(G.cx, G.cy + G.R + 24, '남극', { size: 18, color: C.muted });
    // 1칸: 적도
    body += shown(1, `<g class="grow grow1">${latLine(G, 0, C.red, { w: 4, dash: '' })}</g>`);
    body += at(1, 'fin', latLabel(G, 0, '적도 0°', { size: 20, color: C.red }), 0.8);
    // 중심에서 뻗은 반지름이 북쪽으로 돈다
    const rad = `<path d="M${G.cx} ${G.cy} H${G.cx + G.R}" stroke="${C.green}" stroke-width="3.5"/><circle cx="${G.cx + G.R}" cy="${G.cy}" r="8" fill="${C.green}" stroke="white" stroke-width="2.5"/>`;
    body += shown(2, `<circle cx="${G.cx}" cy="${G.cy}" r="5" fill="${C.ink}"/><g class="rad">${rad}</g>`);
    const arc = (deg, r) => `M${G.cx + r} ${G.cy} A${r} ${r} 0 0 0 ${f(G.cx + r * cosD(deg))} ${f(G.cy - r * sinD(deg))}`;
    // 2칸: 30°
    body += shown(2, `<path class="draw draw2" pathLength="1" d="${arc(30, 58)}" stroke="${C.orange}" stroke-width="4" fill="none"/>`, 3);
    body += shown(2, g('pop pop2', text(f(G.cx + 82 * cosD(15)), f(G.cy - 82 * sinD(15) + 7), '30°', { size: 20, color: C.orange }), 1.1), 3);
    body += shown(2, `<g class="grow grow2" style="transition-delay:.8s">${latLine(G, 30, C.green, { w: 3 })}</g>`);
    body += at(2, 'fin', latLabel(G, 30, '북위 30°', { size: 20, color: C.green }), 1.2);
    // 3칸: 60°, 그리고 남쪽
    body += shown(3, `<path class="draw draw3" pathLength="1" d="${arc(60, 58)}" stroke="${C.orange}" stroke-width="4" fill="none"/>`);
    body += at(3, 'pop', text(f(G.cx + 84 * cosD(36)), f(G.cy - 84 * sinD(36) + 7), '60°', { size: 20, color: C.orange }), 1.1);
    body += shown(3, `<g class="grow grow3" style="transition-delay:.6s">${latLine(G, 60, C.green, { w: 3 })}</g>`);
    body += at(3, 'fin', latLabel(G, 60, '북위 60°', { size: 20, color: C.green }), 1);
    body += shown(3, `<g class="grow grow3" style="transition-delay:1s">${latLine(G, -30, C.blue, { w: 3 })}${latLine(G, -60, C.blue, { w: 3 })}</g>`);
    body += at(3, 'fin', latLabel(G, -30, '남위 30°', { size: 20, color: C.blue }) + latLabel(G, -60, '남위 60°', { size: 20, color: C.blue }), 1.4);
    // 4칸: 줄들이 반짝인다
    body += glowRect(G.cx - G.R - 4, G.cy - 10, 2 * G.R + 8, 20, 4, C.red, 0, 10);
    body += ring(G.cx + G.R * cosD(60), latY(G, 60), 14, 4, C.green);
    css += `
      .sc-${id} .rad { transform-box: view-box; transform-origin: ${G.cx}px ${G.cy}px; transition: transform 1.1s ease-in-out; }
      .on2 .sc-${id} .rad { transform: rotate(-30deg); }
      .on3 .sc-${id} .rad { transform: rotate(-60deg); }`;
    put('6-2/사회/1-2/위도', svg(id, body, css));
  })();

  // ── 기후 여섯: 왼쪽 지구본의 띠 + 오른쪽 기후 그래프 ──
  const GC = { cx: 168, cy: 182, R: 118 };
  // 띠 칠하기: bands = [[a, b], …]
  const climateGlobe = (id, bands, [fill, stroke], labels) => {
    const G = GC;
    let b = `<defs><clipPath id="${id}-g"><circle cx="${G.cx}" cy="${G.cy}" r="${G.R}"/></clipPath></defs>` + disk(G);
    b += shown(1, `<g class="fin fin1">${bands.map(([a, c]) => `<path d="${bandD(G, a, c)}" fill="${fill}"/>`).join('')}</g>`);
    b += meridians(G);
    b += latLine(G, 0, C.red, { w: 3, dash: '' });
    b += shown(1, bands.map(([a, c]) => [a, c].filter((l) => Math.abs(l) < 89).map((l) => latLine(G, l, stroke, { w: 2.5 })).join('')).join(''));
    b += rim(G);
    b += latLabel(G, 0, '적도', { color: C.red });
    b += at(1, 'fin', labels.map(([lat, label]) => latLabel(G, lat, label, { color: stroke })).join(''), 0.4);
    b += `<g class="b1"><path class="flash flash1" d="${bands.map(([a, c]) => bandD(G, a, c)).join(' ')}" fill="none" stroke="${stroke}" stroke-width="4"/></g>`;
    return b;
  };

  // ── 열대 기후 ──
  (function () {
    const id = 't62-s12-yeoldae';
    const K = climo({});
    let css = base(id) + K.css(id, 3);
    let body = climateGlobe(id, [[-20, 20]], HOT, []);
    body += K.axes + K.legend(2, 'temp', 370) + K.legend(3, 'rain', 470);
    body += K.bars(3, [240, 170, 190, 180, 170, 150, 160, 170, 170, 190, 250, 290]);
    body += K.line(2, [26.5, 27, 27.5, 28, 28.3, 28.3, 28, 28, 27.8, 27.6, 27, 26.5]);
    body += glowRect(K.x0 + 4, K.ty(32), K.x1 - K.x0 - 4, K.ty(23) - K.ty(32), 4, C.red, 0.2, 10);
    body += `<g class="b4"><path class="flash flash4" style="animation-delay:.6s" d="${bandD(GC, -20, 20)}" fill="none" stroke="${C.orange}" stroke-width="5"/></g>`;
    put('6-2/사회/1-2/열대 기후', svg(id, body, css));
  })();

  // ── 건조 기후: 비가 아주 적고, 내린 비보다 증발하는 물이 많다 ──
  (function () {
    const id = 't62-s12-geonjo';
    const K = climo({ x1: 492 });
    let css = base(id) + K.css(id, 2);
    let body = climateGlobe(id, [[20, 30], [-30, -20]], [C.yellow, C.orange], [[20, '20°'], [30, '30°'], [-20, '20°'], [-30, '30°']]);
    body += K.axes + K.legend(2, 'rain', 430);
    body += K.legend(1, 'temp', 352);
    body += K.line(1, [14, 15, 18, 21, 25, 27, 28, 28, 26, 24, 19, 15]);
    body += K.bars(2, [5, 4, 3, 1, 1, 0, 0, 0, 0, 1, 3, 5]);
    body += at(2, 'pop', tag(422, 264, '아주 적음', COLD, { size: 18 }), 0.9);
    // 3칸: 일 년 동안 내린 비(파랑)와 증발하는 물(주황)
    const xa = 574, xb = 616, Y = K.y1;
    body += shown(3, `<rect class="growy growy3" x="${xa - 15}" y="${Y - 22}" width="30" height="22" rx="3" fill="${C.sky}" stroke="${C.blue}" stroke-width="2.5"/>`
      + `<rect class="growy growy3" style="transition-delay:.9s" x="${xb - 15}" y="${Y - 170}" width="30" height="170" rx="3" fill="${C.peach}" stroke="${C.orange}" stroke-width="2.5"/>`
      + text(xa, Y + 26, '비', { size: 18, color: C.blue }) + text(xb, Y + 26, '증발', { size: 18, color: C.orange }) + text(595, Y + 52, '1년 동안', { size: 18 }));
    body += shown(3, [0, 0.5, 1, 1.5].map((s, i) => `<g class="up" style="animation-delay:${s + 1.6}s;--up:-46px"><path d="M${xb - 8 + (i % 2) * 16} ${Y - 178} v-10" stroke="${C.orange}" stroke-width="3.5" stroke-linecap="round"/>${head(xb - 8 + (i % 2) * 16, Y - 192, -Math.PI / 2, C.orange, 3)}</g>`).join(''));
    body += glowRect(xb - 22, Y - 178, 44, 184, 4, C.orange, 0.2, 10) + glowRect(xa - 22, Y - 30, 44, 36, 4, C.blue, 0.2, 10);
    css += `.sc-${id} .growy { transform-origin: 50% 100%; }`;
    put('6-2/사회/1-2/건조 기후', svg(id, body, css));
  })();

  // ── 온대 기후: 사계절, 알맞은 기온과 비 ──
  (function () {
    const id = 't62-s12-ondae';
    const K = climo({});
    let css = base(id) + K.css(id, 3);
    let body = climateGlobe(id, [[30, 50], [-50, -30]], OK, [[30, '30°'], [50, '50°'], [-30, '30°'], [-50, '50°']]);
    body += K.axes + K.legend(2, 'temp', 370) + K.legend(3, 'rain', 470);
    body += K.bars(3, [55, 45, 50, 50, 65, 55, 60, 55, 55, 60, 50, 55]);
    const T = [4, 5, 8, 11, 15, 18, 20, 20, 17, 13, 8, 5];
    body += K.line(2, T);
    // 계절 이름표: 선을 따라 하나씩
    [[0, '겨울', COLD], [3, '봄', OK], [6, '여름', HOT], [9, '가을', [C.peach, C.orange]]].forEach(([i, s, col], k) => {
      body += at(2, 'pop', text(f(K.mx(i)), K.y1 + 52, s, { size: 18, color: col[1] }), 0.9 + k * 0.25) + ring(f(K.mx(i)), f(K.ty(T[i])), 10, 2, col[1], 0.9 + k * 0.25);
    });
    body += glowRect(K.x0 + 4, K.ty(24), K.x1 - K.x0 - 4, K.ty(0) - K.ty(24), 4, C.green, 0.2, 10);
    put('6-2/사회/1-2/온대 기후', svg(id, body, css));
  })();

  // ── 냉대 기후: 겨울이 몹시 춥고 길며 여름은 짧다(북반구에만) ──
  (function () {
    const id = 't62-s12-naengdae';
    const K = climo({});
    let css = base(id) + K.css(id, 2);
    let body = climateGlobe(id, [[50, 70]], [C.lilac, C.purple], [[50, '50°'], [70, '70°']]);
    const T = [-20, -16, -7, 4, 11, 17, 21, 20, 14, 5, -7, -17];
    // 3칸: 0 ℃ 아래 달(겨울)과 따뜻한 달(여름) 바탕 칠하기
    const col = (i0, i1, fill) => `<rect x="${f(K.x0 + i0 * K.dx + 1)}" y="${K.y0}" width="${f((i1 - i0 + 1) * K.dx - 2)}" height="${K.y1 - K.y0 - 1}" fill="${fill}"/>`;
    body += at(3, 'fin', col(0, 2, C.sky) + col(10, 11, C.sky) + col(5, 7, C.peach));
    body += K.axes + K.legend(2, 'temp', 370) + K.legend(2, 'rain', 470);
    body += K.bars(2, [15, 12, 18, 35, 55, 85, 115, 125, 85, 40, 25, 18]);
    body += K.line(2, T);
    body += at(3, 'pop', text(f(K.mx(1)), 96, '겨울', { size: 18, color: C.blue }), 0.5) + at(3, 'pop', text(f(K.mx(11) - K.dx * 0.5), 96, '겨울', { size: 18, color: C.blue }), 0.7);
    body += at(3, 'pop', text(f(K.mx(6)), 96, '여름', { size: 18, color: C.orange }), 1);
    body += ring(f(K.mx(0)), f(K.ty(-20)), 14, 2, C.blue, 1.8);
    body += glowRect(K.x0 + 2, K.ty(0), 3 * K.dx - 2, K.y1 - K.ty(0) - 2, 4, C.blue, 0.2, 6) + glowRect(K.x0 + 10 * K.dx + 1, K.ty(0), 2 * K.dx - 3, K.y1 - K.ty(0) - 2, 4, C.blue, 0.2, 6);
    put('6-2/사회/1-2/냉대 기후', svg(id, body, css));
  })();

  // ── 한대 기후: 일 년 내내 기온이 매우 낮다(극지방) ──
  (function () {
    const id = 't62-s12-handae';
    const K = climo({});
    let css = base(id) + K.css(id, 2);
    let body = climateGlobe(id, [[66, 90], [-90, -66]], COLD, [[66, '66°'], [-66, '66°']]);
    body += text(GC.cx, GC.cy - GC.R - 10, '북극', { size: 18, color: C.blue }) + text(GC.cx, GC.cy + GC.R + 24, '남극', { size: 18, color: C.blue });
    const T = [-25, -26, -25, -17, -6, 2, 5, 4, 0, -9, -18, -23];
    // 2칸: 0 ℃ 아래 넓게 옅은 파랑
    body += at(2, 'fin', `<rect x="${K.x0 + 1}" y="${f(K.ty(0))}" width="${K.x1 - K.x0 - 1}" height="${f(K.y1 - K.ty(0) - 1)}" fill="${C.sky}" opacity=".7"/>`, 1.4);
    body += K.axes + K.legend(2, 'temp', 370) + K.legend(2, 'rain', 470);
    body += K.bars(2, [5, 4, 4, 4, 5, 9, 25, 25, 18, 12, 6, 5]);
    body += K.line(2, T);
    // 3칸: 얼음 반짝임(극지방 띠와 0 ℃ 아래)
    const star = (x, y, s) => g('twk', `<path d="M${x} ${y - 9} L${x + 2.5} ${y - 2.5} L${x + 9} ${y} L${x + 2.5} ${y + 2.5} L${x} ${y + 9} L${x - 2.5} ${y + 2.5} L${x - 9} ${y} L${x - 2.5} ${y - 2.5} Z" fill="${C.blue}"/>`, s);
    body += shown(3, [[136, 70, 0], [200, 70, 0.5], [136, 294, 0.3], [200, 294, 0.8], [400, 270, 0.2], [470, 250, 0.7], [560, 268, 1.1]].map(([x, y, s]) => star(x, y, s)).join(''));
    body += glowRect(K.x0 + 3, K.ty(0) + 2, K.x1 - K.x0 - 6, K.y1 - K.ty(0) - 5, 3, C.blue, 0.2, 6);
    put('6-2/사회/1-2/한대 기후', svg(id, body, css));
  })();

  // ── 고산 기후: 적도 부근이라도 높이 올라가면 서늘하다 ──
  (function () {
    const id = 't62-s12-gosan';
    const K = climo({ x0: 384, x1: 540, tmin: 0, tmax: 40, ticks: [0, 10, 20, 30, 40], rainAxis: false });
    let css = base(id);
    // 산: 왼쪽 비탈 (30,300) → 꼭대기 (172,92)
    let body = `<path d="M24 300 L100 196 Q120 168 140 140 L172 92 L204 138 Q224 170 246 200 L320 300 Z" fill="${C.mint}" stroke="${C.green}" stroke-width="3" stroke-linejoin="round"/>`;
    body += `<path d="M10 300 H334" stroke="${C.muted}" stroke-width="3"/>`;
    body += tag(172, 330, '적도 부근', HOT, { size: 18 });
    // 오르는 점과 온도계
    const thermo = `<rect x="-34" y="-82" width="16" height="66" rx="8" fill="white" stroke="${C.muted}" stroke-width="2.5"/><g class="lv"><rect x="-29.5" y="-76" width="7" height="58" rx="3.5" fill="${C.red}"/></g><circle cx="-26" cy="-10" r="11" fill="${C.red}" stroke="${C.muted}" stroke-width="2.5"/>`;
    const A = [60, 240], B = [148, 118];
    body += shown(1, `<g class="mv" style="${mvStyle([A, B])}">${thermo}<circle r="9" fill="${C.orange}" stroke="white" stroke-width="3"/></g>`);
    body += at(1, 'fin', text(122, 288, '낮은 곳', { size: 18, color: C.orange }), 0.5);
    body += at(2, 'fin', text(232, 104, '높은 곳', { size: 18, color: C.green }), 1.4);
    // 그래프
    body += K.axes + K.legend(1, 'temp', 400);
    const low = Array.from({ length: 12 }, (_, i) => 27 + 0.6 * Math.sin((i / 12) * Math.PI * 2));
    const high = Array.from({ length: 12 }, (_, i) => 14 + 0.5 * Math.sin((i / 12) * Math.PI * 2));
    body += K.line(1, low, C.orange) + at(1, 'fin', text(K.x1 + 6, f(K.ty(27) + 6), '낮은 곳', { size: 18, anchor: 'start', color: C.orange }), 1.6);
    body += K.line(3, high, C.green) + at(3, 'fin', text(K.x1 + 6, f(K.ty(14) + 6), '높은 곳', { size: 18, anchor: 'start', color: C.green }), 1.6);
    body += at(3, 'pop', tag(f((K.x0 + K.x1) / 2), f(K.ty(14) + 50), '봄처럼', OK, { size: 18 }), 1.4);
    body += glowRect(K.x0 + 4, K.ty(18), K.x1 - K.x0 - 4, K.ty(10) - K.ty(18), 4, C.green, 0.2, 10);
    body += ring(B[0], B[1], 16, 4, C.green, 0.3);
    css += `
      .sc-${id} .lv { transform-box: fill-box; transform-origin: 50% 100%; transform: scaleY(.95); transition: transform 1.4s ease-in-out; }
      .on2 .sc-${id} .lv { transform: scaleY(.5); }
      .sc-${id} .mv { transition-duration: 2s; }`;
    put('6-2/사회/1-2/고산 기후', svg(id, body, css));
  })();

  // ════ 2-2 경제 성장과 우리 생활 ════

  // 물건·서비스 그림(가운데 x, y)
  const goods = [
    (x, y) => `<rect x="${x - 24}" y="${y - 20}" width="48" height="40" rx="3" fill="${C.peach}" stroke="${C.orange}" stroke-width="3"/><path d="M${x - 24} ${y - 6} H${x + 24} M${x} ${y - 20} V${y - 6}" stroke="${C.orange}" stroke-width="3"/>`,
    (x, y) => `<rect x="${x - 15}" y="${y - 26}" width="30" height="52" rx="6" fill="${C.sky}" stroke="${C.blue}" stroke-width="3"/><rect x="${x - 9}" y="${y - 18}" width="18" height="30" rx="2" fill="white"/><circle cx="${x}" cy="${y + 19}" r="2.5" fill="${C.blue}"/>`,
    (x, y) => `<path d="M${x - 28} ${y + 10} V${y - 2} L${x - 18} ${y - 4} L${x - 10} ${y - 16} H${x + 12} L${x + 20} ${y - 4} L${x + 28} ${y - 2} V${y + 10} Z" fill="${C.mint}" stroke="${C.green}" stroke-width="3" stroke-linejoin="round"/><circle cx="${x - 15}" cy="${y + 12}" r="6.5" fill="${C.ink}"/><circle cx="${x + 15}" cy="${y + 12}" r="6.5" fill="${C.ink}"/>`,
    (x, y) => `<rect x="${x - 24}" y="${y - 24}" width="48" height="48" rx="8" fill="white" stroke="${C.green}" stroke-width="3"/><path d="M${x - 6} ${y - 16} H${x + 6} V${y - 6} H${x + 16} V${y + 6} H${x + 6} V${y + 16} H${x - 6} V${y + 6} H${x - 16} V${y - 6} H${x - 6} Z" fill="${C.green}"/>`,
    (x, y) => `<path d="M${x - 4} ${y + 14} V${y - 22} L${x + 18} ${y - 26} V${y + 8}" stroke="${C.purple}" stroke-width="4" fill="none" stroke-linejoin="round"/><ellipse cx="${x - 11}" cy="${y + 15}" rx="9" ry="7" fill="${C.purple}"/><ellipse cx="${x + 11}" cy="${y + 9}" rx="9" ry="7" fill="${C.purple}"/>`,
    (x, y) => `<rect x="${x - 28}" y="${y - 20}" width="56" height="34" rx="6" fill="${C.yellow}" stroke="${C.orange}" stroke-width="3"/><rect x="${x - 22}" y="${y - 14}" width="12" height="11" fill="white"/><rect x="${x - 6}" y="${y - 14}" width="12" height="11" fill="white"/><rect x="${x + 10}" y="${y - 14}" width="12" height="11" fill="white"/><circle cx="${x - 15}" cy="${y + 16}" r="6" fill="${C.ink}"/><circle cx="${x + 15}" cy="${y + 16}" r="6" fill="${C.ink}"/>`
  ];

  // ── 국내 총생산: 나라 안에서 한 해 동안 만든 물건·서비스의 값을 모두 더한 것 ──
  (function () {
    const id = 't62-s22-gdp';
    let css = base(id);
    let body = `<rect x="20" y="66" width="352" height="236" rx="16" fill="white" stroke="${C.green}" stroke-width="3" stroke-dasharray="10 7"/>`;
    body += tag(196, 66, '나라 안', OK, { size: 18 }) + tag(196, 302, '1년 동안', [C.paper, C.muted], { size: 18 });
    const spots = [[78, 140], [188, 140], [298, 140], [78, 240], [188, 240], [298, 240]];
    const counts = [2, 3, 4, 3, 2, 3];
    spots.forEach(([x, y], i) => { body += at(1, 'pop', goods[i](x, y), i * 0.2); });
    // 2칸: 값만큼 동전이 생긴다 → 3칸: 오른쪽 한 줄로 모인다
    const SX = 520, SY = 288;
    let k = 0;
    spots.forEach(([x, y], i) => {
      for (let j = 0; j < counts[i]; j++, k++) {
        const from = [x + 46, y + 26 - j * 11], to = [SX, SY - k * 11];
        body += `<g class="b2"><g class="mv" style="${mvStyle([from, from, to], `transition-delay:${f(k * 0.08)}s`)}"><g class="pop pop2" style="animation-delay:${f(i * 0.25 + j * 0.1)}s">${coin()}</g></g></g>`;
      }
    });
    body += shown(3, flow([[384, 186], [470, 186]], C.orange, { w: 5 }));
    body += at(4, 'pop', tag(SX, 72, '국내 총생산', HOT), 0.2);
    body += glowRect(SX - 26, SY - (k - 1) * 11 - 12, 52, (k - 1) * 11 + 28, 4, C.orange, 0.5, 12);
    put('6-2/사회/2-2/국내 총생산', svg(id, body, css));
  })();

  // ── 경제 성장: 해가 지날수록 국내 총생산 막대가 길어진다 ──
  (function () {
    const id = 't62-s22-seongjang';
    let css = base(id);
    const X0 = 100, Y1 = 300;
    let body = `<path d="M${X0} 52 V${Y1} H604" stroke="${C.ink}" stroke-width="2.5" fill="none"/>`;
    body += text(X0 + 10, 44, '국내 총생산', { size: 18, anchor: 'start', color: C.green });
    const years = ['1980', '1990', '2000', '2010', '2020'], blocks = [2, 4, 7, 11, 16];
    const bx = (i) => 160 + i * 100, BH = 14.5;
    years.forEach((y, i) => {
      body += text(bx(i), Y1 + 26, y, { size: 18, weight: 600 });
      const n = i === 0 ? 1 : 2;
      let col = '';
      for (let j = 0; j < blocks[i]; j++) col += `<g class="rise rise${n}" style="animation-delay:${f((i === 0 ? 0 : (i - 1) * 0.4) + j * 0.035 + 0.2)}s"><rect x="${bx(i) - 26}" y="${f(Y1 - (j + 1) * BH + 1)}" width="52" height="${BH - 2}" rx="2.5" fill="${C.mint}" stroke="${C.green}" stroke-width="2"/></g>`;
      body += shown(n, col);
    });
    // 3칸: 막대 꼭대기를 잇는 오름 화살표
    const tops = years.map((_, i) => [bx(i), Y1 - blocks[i] * BH - 12]);
    const d = 'M' + tops.map(([x, y]) => `${x} ${f(y)}`).join(' L');
    body += shown(3, `<path class="draw draw3" pathLength="1" d="${d}" stroke="${C.orange}" stroke-width="4.5" stroke-linejoin="round" stroke-linecap="round" fill="none"/>`);
    body += at(3, 'pop', head(tops[4][0], tops[4][1], Math.atan2(tops[4][1] - tops[3][1], tops[4][0] - tops[3][0]), C.orange, 4.5), 1.6);
    body += `<g class="b3"><g class="pulse pulse3" style="animation-delay:1.8s">${tag(bx(1), 150, '점점 커짐', HOT, { size: 18 })}</g></g>`;
    body += glowRect(bx(0) - 36, Y1 - blocks[4] * BH - 8, bx(4) - bx(0) + 72, blocks[4] * BH + 12, 4, C.green, 0.2, 12);
    put('6-2/사회/2-2/경제 성장', svg(id, body, css));
  })();

  // ── 일인당 국민 총소득: 사람들이 번 돈을 모두 더해 사람 수로 나눈 것 ──
  (function () {
    const id = 't62-s22-gni';
    let css = base(id);
    const px = [96, 186, 276, 366, 456], earned = [2, 6, 3, 5, 4];
    const person = (x) => `<circle cx="${x}" cy="${288}" r="13" fill="${C.green}"/><path d="M${x - 21} 340 V324 Q${x - 21} 306 ${x} 306 Q${x + 21} 306 ${x + 21} 324 V340 Z" fill="${C.green}"/>`;
    let body = px.map(person).join('');
    const BASE = 256, GAP = 11, PX = [560, 596], PY = 318;
    let k = 0;
    earned.forEach((n, i) => {
      for (let j = 0; j < n; j++, k++) {
        const start = [px[i], BASE - j * GAP];
        const pile = [PX[k % 2], PY - Math.floor(k / 2) * GAP];
        const share = [px[Math.floor(k / 4)], BASE - (k % 4) * GAP];
        body += `<g class="b1"><g class="mv" style="${mvStyle([start, pile, share], `transition-delay:${f(k * 0.06)}s`)}"><g class="pop pop1" style="animation-delay:${f(i * 0.3 + j * 0.08)}s">${coin()}</g></g></g>`;
      }
    });
    body += shown(2, `<rect x="536" y="198" width="84" height="132" rx="12" fill="none" stroke="${C.orange}" stroke-width="3" stroke-dasharray="8 6"/>`, 3);
    body += shown(2, g('pop pop2', tag(578, 176, '모두 20', HOT, { size: 18 }), 1.2), 3);
    body += at(3, 'pop', tag(556, 176, '20 ÷ 5 = 4', HOT, { size: 18 }), 0.1);
    body += at(3, 'pop', tag(276, 168, '4', OK), 1.6);
    body += glowRect(250, BASE - 3 * GAP - 16, 52, 3 * GAP + 30, 4, C.green, 0.2, 12);
    body += at(4, 'pop', tag(276, 120, '한 사람 몫', OK, { size: 18 }), 0.4);
    css += `.sc-${id} .h3 { transition: opacity .3s; }`;
    put('6-2/사회/2-2/일인당 국민 총소득', svg(id, body, css));
  })();

  // ════ 3-1 세계의 인구 분포와 인구 특징 ════

  // ── 북반구·남반구: 적도를 기준으로 지구를 위아래로 나눈 절반 ──
  const hemi = (north) => {
    const id = north ? 't62-s31-bukban' : 't62-s31-namban';
    let css = base(id);
    const G = { cx: 300, cy: 180, R: 128 };
    const topD = `M${G.cx - G.R} ${G.cy} A${G.R} ${G.R} 0 0 1 ${G.cx + G.R} ${G.cy} Z`;
    const botD = `M${G.cx + G.R} ${G.cy} A${G.R} ${G.R} 0 0 1 ${G.cx - G.R} ${G.cy} Z`;
    const half = (isTop) => {
      const d = isTop ? topD : botD, mine = isTop === north, cid = `${id}-${isTop ? 't' : 'b'}`;
      let h = `<defs><clipPath id="${cid}"><path d="${d}"/></clipPath></defs><path d="${d}" fill="white"/>`;
      if (mine) h += `<g class="b3"><path class="fin fin3" d="${d}" fill="${C.mint}"/></g>`;
      h += `<g clip-path="url(#${cid})">${meridians(G)}${latLine(G, isTop ? 30 : -30, C.line)}${latLine(G, isTop ? 60 : -60, C.line)}</g>`;
      h += `<path d="${d}" fill="none" stroke="${C.muted}" stroke-width="3" stroke-linejoin="round"/>`;
      h += text(G.cx, isTop ? G.cy - G.R - 12 : G.cy + G.R + 28, isTop ? '북극' : '남극', { size: 18, color: mine ? C.green : C.muted });
      return `<g class="${isTop ? 'hn' : 'hs'}">${h}</g>`;
    };
    let body = half(true) + half(false);
    body += shown(1, `<g class="grow grow1">${latLine(G, 0, C.red, { w: 4, dash: '' })}</g>`);
    body += at(1, 'fin', latLabel(G, 0, '적도', { size: 20, color: C.red }), 0.9);
    // 2칸: 위아래로 벌어진다
    body += shown(2, flow([[G.cx + G.R + 40, G.cy - 8], [G.cx + G.R + 40, G.cy - 54]], C.muted, { w: 4 }) + flow([[G.cx + G.R + 40, G.cy + 8], [G.cx + G.R + 40, G.cy + 54]], C.muted, { w: 4 }), 3);
    // 3칸: 맡은 절반에 이름표
    const ty = north ? G.cy - 70 : G.cy + 70, oy = north ? G.cy + 70 : G.cy - 70;
    body += at(3, 'pop', tag(G.cx + G.R + 92, ty, north ? '북반구' : '남반구', OK), 0.5);
    body += at(3, 'fin', text(G.cx + G.R + 92, oy + 7, north ? '남반구' : '북반구', { size: 18, color: C.muted }), 0.9);
    body += `<g class="b3"><path class="flash flash3" d="${north ? topD : botD}" fill="none" stroke="${C.green}" stroke-width="5" style="transform:translateY(${north ? -12 : 12}px);animation-delay:1.2s"/></g>`;
    css += `
      .sc-${id} .hn, .sc-${id} .hs { transition: transform 1.1s ease-in-out; }
      .on2 .sc-${id} .hn { transform: translateY(-12px); }
      .on2 .sc-${id} .hs { transform: translateY(12px); }`;
    put(`6-2/사회/3-1/${north ? '북반구' : '남반구'}`, svg(id, body, css));
  };
  hemi(true);
  hemi(false);

  // ── 인구 밀도: 같은 넓이(1 km²) 안의 사람 수 ──
  (function () {
    const id = 't62-s31-milto';
    let css = base(id);
    const S = 96, L = [120, 78], Rt = [440, 174];
    let body = `<rect x="${L[0]}" y="${L[1]}" width="${2 * S}" height="${2 * S}" fill="${C.mint}" stroke="${C.green}" stroke-width="3"/>`;
    body += `<rect x="${Rt[0]}" y="${Rt[1]}" width="${S}" height="${S}" fill="${C.mint}" stroke="${C.green}" stroke-width="3"/>`;
    const rnd = seeded(11);
    const dot = (x, y, s, cls = '') => `<g class="${cls}"><g class="drop drop1" style="animation-delay:${f(s)}s"><circle cx="${f(x)}" cy="${f(y)}" r="7" fill="${C.orange}" stroke="white" stroke-width="2"/></g></g>`;
    // 왼쪽: 네 칸에 세 명씩
    const tri = [[0.28, 0.3], [0.72, 0.38], [0.45, 0.74]];
    [[0, 0], [1, 0], [0, 1], [1, 1]].forEach(([cx, cy], c) => tri.forEach(([u, v], j) => {
      body += dot(L[0] + cx * S + u * S + (rnd() - 0.5) * 10, L[1] + cy * S + v * S + (rnd() - 0.5) * 10, (c * 3 + j) * 0.08, c ? 'far' : '');
    }));
    // 오른쪽: 한 칸에 열두 명
    for (let r = 0; r < 3; r++) for (let q = 0; q < 4; q++) body += dot(Rt[0] + 15 + q * 22 + (rnd() - 0.5) * 5, Rt[1] + 20 + r * 28 + (rnd() - 0.5) * 5, (r * 4 + q) * 0.08);
    body += shown(1, text(L[0] + S, 306, '12명', { size: 20 }) + text(Rt[0] + S / 2, 306, '12명', { size: 20 }));
    // 2칸: 1 km² 칸 나누기
    body += shown(2, `<path class="draw draw2" pathLength="1" d="M${L[0] + S} ${L[1]} V${L[1] + 2 * S}" stroke="${C.green}" stroke-width="2.5" stroke-dasharray="1" fill="none"/><path class="draw draw2" pathLength="1" d="M${L[0]} ${L[1] + S} H${L[0] + 2 * S}" stroke="${C.green}" stroke-width="2.5" stroke-dasharray="1" fill="none"/>`);
    const bracket = (x1, x2, y) => `<path d="M${x1 + 2} ${y + 7} V${y} H${x2 - 2} V${y + 7}" stroke="${C.ink}" stroke-width="2.5" fill="none"/>` + text((x1 + x2) / 2, y - 10, '1 km²', { size: 18 });
    body += at(2, 'fin', bracket(L[0], L[0] + S, L[1] - 10) + bracket(Rt[0], Rt[0] + S, Rt[1] - 10), 1);
    // 3칸: 한 칸씩 견주기
    body += glowRect(L[0] + 3, L[1] + 3, S - 6, S - 6, 3, C.orange, 0.1, 6) + glowRect(Rt[0] + 3, Rt[1] + 3, S - 6, S - 6, 3, C.orange, 0.1, 6);
    body += at(3, 'pop', tag(L[0] - 46, L[1] + S / 2, '3명', HOT), 0.5) + at(3, 'pop', tag(Rt[0] + S + 46, Rt[1] + S / 2, '12명', HOT), 0.8);
    // 4칸: 낮다·높다
    body += at(4, 'pop', tag(L[0] + S, 342, '인구 밀도 낮음', COLD, { size: 18 }), 0.2) + at(4, 'pop', tag(Rt[0] + S / 2, 342, '인구 밀도 높음', HOT, { size: 18 }), 0.6);
    css += `
      .sc-${id} .far { transition: opacity .6s; }
      .on3 .sc-${id} .far { opacity: .3; }`;
    put('6-2/사회/3-1/인구 밀도', svg(id, body, css));
  })();

  // ── 인구 구조: 사람들을 나이로, 다시 성별로 나누기 ──
  (function () {
    const id = 't62-s31-gujo';
    let css = base(id);
    const CX = 340, SP = 21;
    const groups = [['old', 2, 4, 112, '65세 이상'], ['mid', 8, 8, 192, '15~64세'], ['kid', 5, 5, 272, '0~14세']];
    const people = [];
    groups.forEach(([g0, m, w, y]) => { for (let i = 0; i < m + w; i++) people.push({ g: g0, man: i < m, y }); });
    // 1칸 자리: 흩어진 격자에 섞어 앉힌다
    const rnd = seeded(5);
    const cells = [];
    for (let r = 0; r < 4; r++) for (let q = 0; q < 8; q++) cells.push([186 + q * 44 + (rnd() - 0.5) * 18, 92 + r * 56 + (rnd() - 0.5) * 18]);
    for (let i = cells.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [cells[i], cells[j]] = [cells[j], cells[i]]; }
    // 2칸 자리: 나이 무리마다 한 줄(남녀 섞임) / 3칸 자리: 남자 왼쪽, 여자 오른쪽
    let body = '';
    groups.forEach(([g0, , , y]) => {
      const row = people.filter((p) => p.g === g0);
      const mixed = row.map((p, i) => ({ p, k: (i * 7 + 3) % row.length })).sort((a, b) => a.k - b.k).map((o) => o.p);
      mixed.forEach((p, i) => { p.mix = [CX + (i - (row.length - 1) / 2) * SP, y]; });
      let mi = 0, wi = 0;
      row.forEach((p) => { p.side = p.man ? [CX - 16 - (mi++) * SP, y] : [CX + 16 + (wi++) * SP, y]; });
    });
    people.forEach((p, i) => {
      body += `<g class="b1"><g class="mv" style="${mvStyle([cells[i], p.mix, p.side], `transition-delay:${f((i % 8) * 0.04)}s`)}"><g class="jig" style="animation-delay:${f(-i * 0.13)}s"><circle r="9" fill="${p.man ? C.blue : C.orange}" stroke="white" stroke-width="2"/></g></g></g>`;
    });
    groups.forEach(([, , , y, label], i) => { body += at(2, 'fin', text(150, y + 7, label, { size: 18, anchor: 'end', color: C.green }), 0.9 + i * 0.2); });
    body += shown(2, `<path d="M162 152 H520 M162 232 H520" stroke="${C.line}" stroke-width="2" stroke-dasharray="6 5"/>`);
    body += shown(3, `<path class="draw draw3" pathLength="1" d="M${CX} 80 V300" stroke="${C.ink}" stroke-width="2.5" fill="none"/>`);
    body += at(3, 'fin', text(CX - 90, 56, '남자', { size: 20, color: C.blue }) + text(CX + 90, 56, '여자', { size: 20, color: C.orange }), 1);
    groups.forEach(([, m, w, y], i) => { const xa = CX - 16 - (m - 1) * SP - 16, xb = CX + 16 + (w - 1) * SP + 16; body += glowRect(xa, y - 18, xb - xa, 36, 4, C.green, i * 0.35, 18); });
    css += `.on2 .sc-${id} .jig { animation: none; }`;
    put('6-2/사회/3-1/인구 구조', svg(id, body, css));
  })();

  // ── 인구 피라미드 공통: 가운데 나이 줄, 왼쪽 남자·오른쪽 여자 막대 18줄(5세 단위) ──
  const P = { cx: 300, gap: 20, L: 160, top: 66, bot: 318, n: 18 };
  const RH = (P.bot - P.top) / P.n;
  const ageY = (a) => P.bot - (a / 5) * RH;
  const bandOf = (i) => (i < 3 ? 'kid' : i < 13 ? 'mid' : 'old');
  const BAND = { kid: [C.yellow, C.orange], mid: [C.mint, C.green], old: [C.lilac, C.purple] };
  // ws: 남자 쪽 길이(px). 여자 쪽은 나이 든 줄에서 조금 더 길다.
  const womenOf = (ws) => ws.map((w, i) => w * (1 + 0.04 * Math.max(0, i - 11)));
  const pyramidBars = (wsA, wsB, colorOf) => {
    const wA = womenOf(wsA), wB = wsB ? womenOf(wsB) : null;
    let s = '';
    for (let i = 0; i < P.n; i++) {
      const y = f(P.bot - (i + 1) * RH + 1.6), h = f(RH - 3.2), [fill, stroke] = colorOf(i, 'm'), [fill2, stroke2] = colorOf(i, 'w');
      const vars = (a, b) => `--a:${f(a / P.L)};--b:${f((b ?? a) / P.L)};transition-delay:${f(i * 0.05)}s`;
      s += `<rect class="bar bl ${bandOf(i)}" style="${vars(wsA[i], wsB && wsB[i])}" x="${P.cx - P.gap - P.L}" y="${y}" width="${P.L}" height="${h}" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/>`;
      s += `<rect class="bar br ${bandOf(i)}" style="${vars(wA[i], wB && wB[i])}" x="${P.cx + P.gap}" y="${y}" width="${P.L}" height="${h}" fill="${fill2}" stroke="${stroke2}" stroke-width="1.5"/>`;
    }
    return s;
  };
  const pyramidCss = (id, showAt, change) => `
    .sc-${id} .bar { transform-box: fill-box; transform: scaleX(0); transition: transform .7s ease-out, fill .6s, stroke .6s; }
    .sc-${id} .bl { transform-origin: 100% 50%; }
    .sc-${id} .br { transform-origin: 0 50%; }
    .on${showAt} .sc-${id} .bar { transform: scaleX(var(--a)); }` + (change ? `
    .on${change} .sc-${id} .bar { transform: scaleX(var(--b)); transition: transform 1.8s ease-in-out, fill .6s, stroke .6s; transition-delay: .2s; }` : '');
  const pyramidAxis = (ticks, n = 1) => {
    let s = `<path d="M${P.cx - P.gap} ${P.top - 6} V${P.bot}" stroke="${C.muted}" stroke-width="2"/><path d="M${P.cx + P.gap} ${P.top - 6} V${P.bot}" stroke="${C.muted}" stroke-width="2"/>`;
    s += `<path d="M${P.cx - P.gap - P.L - 8} ${P.bot} H${P.cx + P.gap + P.L + 8}" stroke="${C.ink}" stroke-width="2.5"/>`;
    for (const a of ticks) s += text(P.cx, f(a ? ageY(a) + 6.5 : P.bot - 3), a, { size: 18, weight: 600 });
    s += text(P.cx, P.top - 16, '나이', { size: 18, color: C.muted });
    return shown(n, s);
  };
  const sexLabels = (n, s = 0) => at(n, 'fin', text(P.cx - P.gap - P.L / 2, 44, '남자', { size: 20, color: C.blue }) + text(P.cx + P.gap + P.L / 2, 44, '여자', { size: 20, color: C.orange }), s);
  const layerLines = (n, s = 0) => shown(n, `<g class="grow grow${n}" style="transition-delay:${s}s"><path d="M${P.cx - P.gap - P.L} ${f(ageY(15))} H${P.cx + P.gap + P.L}" stroke="${C.ink}" stroke-width="2.5" stroke-dasharray="8 5"/><path d="M${P.cx - P.gap - P.L} ${f(ageY(65))} H${P.cx + P.gap + P.L}" stroke="${C.ink}" stroke-width="2.5" stroke-dasharray="8 5"/></g>`)
    + at(n, 'fin', [15, 65].map((a) => `<rect x="${P.cx - 17}" y="${f(ageY(a) - 11)}" width="34" height="22" rx="5" fill="${C.paper}"/>` + text(P.cx, f(ageY(a) + 6.5), a, { size: 18 })).join(''), s + 0.8);
  const sideGlow = (yT, yB, n, color, s) => glowRect(P.cx - P.gap - P.L - 6, yT - 3, P.L + 4, yB - yT + 6, n, color, s, 8) + glowRect(P.cx + P.gap + 2, yT - 3, P.L + 4, yB - yT + 6, n, color, s, 8);
  const PY_YOUNG = [160, 150, 140, 130, 120, 110, 100, 90, 80, 70, 60, 50, 41, 33, 25, 18, 12, 7];
  const PY_BELL = [104, 108, 112, 118, 124, 130, 136, 140, 140, 136, 130, 122, 112, 98, 82, 62, 42, 24];
  const PY_OLD = [62, 66, 72, 80, 92, 108, 124, 138, 148, 155, 158, 156, 150, 138, 118, 94, 68, 44];

  // ── 인구 피라미드 ──
  (function () {
    const id = 't62-s31-pyramid';
    let css = base(id) + pyramidCss(id, 2);
    let body = pyramidAxis([0, 20, 40, 60, 80], 1);
    body += at(1, 'pop', flow([[P.cx + P.gap + P.L + 40, P.bot - 20], [P.cx + P.gap + P.L + 40, P.top + 20]], C.muted, { w: 4 }), 0.6);
    body += shown(2, pyramidBars(PY_YOUNG, null, (i, s) => (s === 'm' ? COLD : HOT)));
    body += sexLabels(2, 0.2);
    body += shown(2, flow([[P.cx - P.gap - 6, P.bot + 20], [P.cx - P.gap - 90, P.bot + 20]], C.blue, { w: 4 }) + flow([[P.cx + P.gap + 6, P.bot + 20], [P.cx + P.gap + 90, P.bot + 20]], C.orange, { w: 4 }));
    // 3칸: 피라미드 모양 테두리
    // 막대 바깥 끝을 따라 계단처럼 도는 테두리(왼쪽 아래 → 꼭대기 → 오른쪽 아래)
    const wW = womenOf(PY_YOUNG), top = (i) => f(P.bot - (i + 1) * RH), bot = (i) => f(P.bot - i * RH);
    let d = `M${f(P.cx - P.gap - PY_YOUNG[0] - 6)} ${P.bot}`;
    for (let i = 0; i < P.n; i++) d += ` H${f(P.cx - P.gap - PY_YOUNG[i] - 6)} V${top(i)}`;
    for (let i = P.n - 1; i >= 0; i--) d += ` H${f(P.cx + P.gap + wW[i] + 6)} V${bot(i)}`;
    body += shown(3, `<path class="draw draw3" pathLength="1" d="${d}" stroke="${C.green}" stroke-width="3.5" stroke-dasharray="1" stroke-linejoin="round" fill="none"/>`);
    body += glowRect(P.cx - P.gap - P.L - 10, P.top - 8, 2 * (P.gap + P.L) + 20, P.bot - P.top + 16, 4, C.green, 0.2, 10);
    put('6-2/사회/3-1/인구 피라미드', svg(id, body, css));
  })();

  // ── 유소년층·청장년층·노년층: 피라미드의 세 층 가운데 한 층 ──
  const layer = (key, word, idv, label, range) => {
    const id = `t62-s31-${idv}`;
    let css = base(id) + pyramidCss(id, 1);
    let body = pyramidAxis([0], 1);
    body += shown(1, pyramidBars(PY_BELL, null, (i) => BAND[bandOf(i)]));
    body += sexLabels(1, 0.4);
    body += layerLines(1, 0.6);
    const [lo, hi] = range;
    const yTop = f(ageY(hi)), yBot = f(ageY(lo)), [fill, stroke] = BAND[key];
    const bx = P.cx + P.gap + P.L + 16;
    body += shown(2, `<path class="draw draw2" pathLength="1" d="M${bx - 6} ${yTop + 2} H${bx} V${yBot - 2} H${bx - 6}" stroke="${stroke}" stroke-width="3.5" stroke-dasharray="1" fill="none"/>`);
    body += at(2, 'pop', tag(bx + 64, (yTop + yBot) / 2, label, [fill, stroke], { size: 18 }), 0.9);
    body += sideGlow(yTop, yBot, 3, stroke, 0.3);
    body += at(3, 'pop', tag(bx + 64, f((yTop + yBot) / 2 + 40), word, [fill, stroke], { size: 18 }), 0.4);
    const others = ['kid', 'mid', 'old'].filter((b) => b !== key).map((b) => `.on2 .sc-${id} .bar.${b}`).join(', ');
    css += `${others} { fill: ${C.paper}; stroke: ${C.line}; }`;
    put(`6-2/사회/3-1/${word}`, svg(id, body, css));
  };
  layer('kid', '유소년층', 'yuso', '0~14세', [0, 15]);
  layer('mid', '청장년층', 'cheongjang', '15~64세', [15, 65]);
  layer('old', '노년층', 'nonyeon', '65세 이상', [65, 90]);

  // ── 고령화: 피라미드가 아래는 좁아지고 위는 넓어진다, 노인 비율이 늘어난다 ──
  (function () {
    const id = 't62-s31-goryeong';
    let css = base(id) + pyramidCss(id, 1, 2);
    let body = pyramidAxis([0], 1);
    body += shown(1, pyramidBars(PY_YOUNG, PY_OLD, (i) => BAND[bandOf(i)]));
    body += sexLabels(1, 0.3) + layerLines(1, 0.5);
    body += shown(1, g('pop pop1', tag(62, 44, '예전', [C.paper, C.muted], { size: 18 }), 0.2), 2);
    body += at(2, 'pop', tag(70, 44, '오늘날', OK, { size: 18 }), 0.4);
    // 노년층 비율 막대(오른쪽): 전체 중 노년층이 차지하는 몫 — 막대 길이에서 계산
    const share = (ws) => { const w = ws.concat(womenOf(ws)); const old = ws.slice(13).concat(womenOf(ws).slice(13)); return old.reduce((a, b) => a + b, 0) / w.reduce((a, b) => a + b, 0); };
    const sA = share(PY_YOUNG), sB = share(PY_OLD), GX = 580, GT = 96, GB = 300;
    body += shown(1, `<rect x="${GX - 18}" y="${GT}" width="36" height="${GB - GT}" rx="6" fill="white" stroke="${C.muted}" stroke-width="2.5"/><g class="gauge"><rect x="${GX - 15}" y="${GT + 3}" width="30" height="${GB - GT - 6}" rx="4" fill="${C.purple}"/></g>` + text(GX, GT - 14, '노년층', { size: 18, color: C.purple }) + text(GX, GB + 26, '비율', { size: 18, color: C.purple }));
    body += glowRect(GX - 24, GT - 6, 48, GB - GT + 12, 3, C.purple, 0.2, 10);
    body += sideGlow(P.top, ageY(65), 3, C.purple, 0.6);
    body += at(4, 'pop', tag(580, 40, '고령화', OLD, { size: 18 }), 0.3);
    css += `
      .sc-${id} .gauge { transform-box: fill-box; transform-origin: 50% 100%; transform: scaleY(${f(sA)}); transition: transform 1.8s ease-in-out .2s; }
      .on2 .sc-${id} .gauge { transform: scaleY(${f(sB)}); }
      .on3 .sc-${id} .gauge { transform: scaleY(${f(sB)}); }`;
    put('6-2/사회/3-1/고령화', svg(id, body, css));
  })();
})(typeof window !== 'undefined' ? window : globalThis);
