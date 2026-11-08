// 과학 6-1 낱말 도식(1단원 산과 염기·2단원 물체의 운동·4단원 지구의 운동): 색 변화·움직임·도는 길로 보여야 하는 낱말을 코드로 그린다.
// 유리 그릇은 회색 테두리, 색깔 없는(무색) 용액은 옅은 회색 물에 수면 선으로 적는다.
// 지시약 색: 산성 쪽은 C.red(옅고 짙음은 투명도), 염기성 쪽은 C.blue·C.yellow, 붉은 양배추 지시약 자체는 C.purple.
// 색이 바뀌는 것은 새 색 층을 겹쳐 두고 opacity 로 드러낸다(모양·위치 속성은 CSS 로 바꾸지 않는다).
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
  // 글자 폭 어림(맑은 고딕 굵게: 한글 1em, 숫자·기호 .6em, 빈칸 .3em)
  const tw = (s, size) => [...String(s)].reduce((a, c) => a + (/[가-힣]/.test(c) ? 1 : c === ' ' ? 0.3 : 0.6), 0) * size;
  const HOT = [C.peach, C.red], COLD = [C.sky, C.blue], OK = [C.mint, C.green], GRAY = ['white', C.muted], LIL = [C.lilac, C.purple], KEY = [C.peach, C.red];
  const tag = (cx, cy, label, [fill, stroke] = OK, { size = 20 } = {}) => {
    const w = Math.round(tw(label, size) + size * 1.3), h = Math.round(size * 1.7);
    return `<g><rect x="${f(cx - w / 2)}" y="${f(cy - h / 2)}" width="${w}" height="${h}" rx="${h / 2}" fill="${fill}" stroke="${stroke}" stroke-width="2.5"/>${text(f(cx), f(cy + size * 0.36), label, { size })}</g>`;
  };
  const lead = (x1, y1, x2, y2, color = C.muted) => `<path d="M${f(x1)} ${f(y1)} L${f(x2)} ${f(y2)}" stroke="${color}" stroke-width="2.5" stroke-linecap="round"/>`;
  const head = (x, y, ang, color, w = 4) => {
    const l = 8 + w * 1.4, p = (d) => `${f(x - l * Math.cos(ang + d))} ${f(y - l * Math.sin(ang + d))}`;
    return `<path d="M${p(-0.5)} L${f(x)} ${f(y)} L${p(0.5)}" stroke="${color}" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  };
  const rad = (a) => (a * Math.PI) / 180;
  const ring = (cx, cy, r, n, color = C.green, s = 0) => `<g class="b${n}"><circle class="ring ring${n}"${dl(s)} cx="${f(cx)}" cy="${f(cy)}" r="${r}" fill="none" stroke="${color}" stroke-width="4"/></g>`;
  const glowRect = (x, y, w, h, n, color = C.green, s = 0, rx = 14) => `<g class="b${n}"><rect class="flash flash${n}"${dl(s)} x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="${rx}" fill="none" stroke="${color}" stroke-width="5"/></g>`;
  // 칸 n 에 그어지는 선(pathLength 1)
  const drawPath = (d, n, color, w = 4, s = 0, extra = '') => `<g class="b${n}"><path class="draw draw${n}"${dl(s)} pathLength="1" d="${d}" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" fill="none"${extra}/></g>`;
  // 해(빛살이 천천히 숨 쉰다)
  const sunIcon = (x, y, r = 24) => {
    let rays = '';
    for (let k = 0; k < 8; k++) { const a = (k * Math.PI) / 4; rays += `<path d="M${f(x + (r + 6) * Math.cos(a))} ${f(y + (r + 6) * Math.sin(a))} L${f(x + (r + 15) * Math.cos(a))} ${f(y + (r + 15) * Math.sin(a))}" stroke="${C.orange}" stroke-width="4" stroke-linecap="round"/>`; }
    return `<g class="rays">${rays}</g><circle cx="${x}" cy="${y}" r="${r}" fill="${C.yellow}" stroke="${C.orange}" stroke-width="3"/>`;
  };

  // ── 실험 도구 ──
  const NONE = [C.line, 0.3];  // 무색 용액
  // 유리 그릇 테두리: 밑 가운데 (cx, by), 폭 w, 높이 h
  const beaker = (cx, by, w, h) => {
    const l = cx - w / 2, r = cx + w / 2, t = by - h;
    return `<path d="M${f(l - 5)} ${f(t)} H${f(l)} V${f(by - 9)} Q${f(l)} ${f(by)} ${f(l + 9)} ${f(by)} H${f(r - 9)} Q${f(r)} ${f(by)} ${f(r)} ${f(by - 9)} V${f(t)} H${f(r + 5)}" fill="none" stroke="${C.muted}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/>`
      + `<path d="M${f(l + 10)} ${f(t + 16)} V${f(by - 18)}" stroke="white" stroke-width="5" stroke-linecap="round" opacity=".9"/>`;
  };
  // 그릇 속 용액: 높이 lh. cls 에 cf cfN 을 주면 칸 N 에 그 색으로 바뀐다(겹친 층이 드러남)
  const liq = (cx, by, w, lh, [color, op], cls = '', s = 0) => `<rect class="${cls}"${dl(s)} x="${f(cx - w / 2 + 2)}" y="${f(by - lh)}" width="${f(w - 4)}" height="${f(lh - 2)}" rx="8" fill="${color}" fill-opacity="${op}"/>`;
  const surface = (cx, by, w, lh) => `<path d="M${f(cx - w / 2 + 4)} ${f(by - lh)} H${f(cx + w / 2 - 4)}" stroke="${C.muted}" stroke-width="2.5" opacity=".7"/>`;
  // 스포이트: 끝 (x, tip)
  const dropper = (x, tip, s = 1) => `<g><path d="M${f(x - 6 * s)} ${f(tip - 52 * s)} V${f(tip - 10 * s)} L${f(x - 2 * s)} ${f(tip)} H${f(x + 2 * s)} L${f(x + 6 * s)} ${f(tip - 10 * s)} V${f(tip - 52 * s)} Z" fill="white" stroke="${C.muted}" stroke-width="2.5" stroke-linejoin="round"/>`
    + `<path d="M${f(x - 7 * s)} ${f(tip - 52 * s)} V${f(tip - 68 * s)} Q${f(x - 7 * s)} ${f(tip - 82 * s)} ${f(x)} ${f(tip - 82 * s)} Q${f(x + 7 * s)} ${f(tip - 82 * s)} ${f(x + 7 * s)} ${f(tip - 68 * s)} V${f(tip - 52 * s)} Z" fill="${C.muted}" stroke="${C.ink}" stroke-width="2" stroke-linejoin="round"/></g>`;
  // 떨어지는 방울(칸 n 에 세 번 떨어진다)
  const drip = (x, y0, y1, color, n, s = 0, r = 5.5) => `<g class="b${n}"><path class="fall fall${n}" style="--fall:${f(y1 - y0)}px;animation-delay:${s}s" d="M${f(x)} ${f(y0 - r * 1.6)} Q${f(x + r)} ${f(y0 - r * 0.2)} ${f(x + r)} ${f(y0 + r * 0.3)} A${r} ${r} 0 0 1 ${f(x - r)} ${f(y0 + r * 0.3)} Q${f(x - r)} ${f(y0 - r * 0.2)} ${f(x)} ${f(y0 - r * 1.6)} Z" fill="${color}"/></g>`;
  // 리트머스 종이 띠: 위 (x, top), 아래쪽 dip 만큼이 칸 n 에 새 색으로 바뀐다
  const strip = (x, top, w, h, color, { to = null, dip = 0, n = 1, s = 1.5 } = {}) => `<rect x="${f(x - w / 2)}" y="${f(top)}" width="${w}" height="${h}" rx="3" fill="${color}" fill-opacity=".8" stroke="${color}" stroke-width="2"/>`
    + (to ? `<rect class="cf cf${n}"${dl(s)} x="${f(x - w / 2)}" y="${f(top + h - dip)}" width="${w}" height="${dip}" rx="3" fill="${to}" stroke="${to}" stroke-width="2"/>` : '');
  // 떠오르는 기포
  const bubbles = (x, y, up, count, seed, spread = 18) => {
    const r = seeded(seed);
    let s = '';
    for (let k = 0; k < count; k++) s += `<circle class="up" style="--up:${-up}px;animation-delay:${f(-r() * 2.4)}s" cx="${f(x + (r() - 0.5) * 2 * spread)}" cy="${f(y - r() * 8)}" r="${f(3 + r() * 3.5)}" fill="white" stroke="${C.muted}" stroke-width="2"/>`;
    return s;
  };
  const marble = (x, y, s = 1) => `<g><path d="M${f(x - 30 * s)} ${f(y + 14 * s)} L${f(x - 24 * s)} ${f(y - 10 * s)} L${f(x - 2 * s)} ${f(y - 20 * s)} L${f(x + 24 * s)} ${f(y - 12 * s)} L${f(x + 30 * s)} ${f(y + 12 * s)} L${f(x + 6 * s)} ${f(y + 18 * s)} Z" fill="${C.line}" stroke="${C.muted}" stroke-width="3" stroke-linejoin="round"/>`
    + `<path d="M${f(x - 18 * s)} ${f(y - 4 * s)} Q${f(x)} ${f(y + 2 * s)} ${f(x + 18 * s)} ${f(y - 6 * s)} M${f(x - 8 * s)} ${f(y + 10 * s)} Q${f(x + 6 * s)} ${f(y + 4 * s)} ${f(x + 20 * s)} ${f(y + 8 * s)}" stroke="white" stroke-width="2.5" fill="none" stroke-linecap="round"/></g>`;
  // 대리암 겉에 붙어 생기는 작은 기포(흔들린다)
  const fizz = (x, y, s = 1) => [[-24, -8], [-12, -18], [4, -21], [18, -14], [28, 2], [-30, 6], [10, 16]].map(([dx, dy], k) => `<g class="jig" style="animation-delay:${f(-k * 0.33)}s"><circle cx="${f(x + dx * s)}" cy="${f(y + dy * s)}" r="${f(3 + (k % 3))}" fill="white" stroke="${C.muted}" stroke-width="1.8"/></g>`).join('');
  // 바퀴 달린 자동차(옆모습), (x, base) 는 바닥 가운데
  const car = (x, base, color, s = 1) => {
    const fill = color === C.orange ? C.peach : color === C.blue ? C.sky : 'white';
    return `<g><path d="M${f(x - 30 * s)} ${f(base - 8 * s)} V${f(base - 22 * s)} Q${f(x - 30 * s)} ${f(base - 26 * s)} ${f(x - 26 * s)} ${f(base - 26 * s)} H${f(x - 16 * s)} L${f(x - 8 * s)} ${f(base - 38 * s)} H${f(x + 12 * s)} L${f(x + 20 * s)} ${f(base - 26 * s)} H${f(x + 26 * s)} Q${f(x + 30 * s)} ${f(base - 26 * s)} ${f(x + 30 * s)} ${f(base - 22 * s)} V${f(base - 8 * s)} Z" fill="${fill}" stroke="${color}" stroke-width="3" stroke-linejoin="round"/>`
      + `<path d="M${f(x - 5 * s)} ${f(base - 34 * s)} H${f(x + 10 * s)} L${f(x + 15 * s)} ${f(base - 26 * s)} H${f(x - 10 * s)} Z" fill="white" stroke="${color}" stroke-width="2"/>`
      + `<circle cx="${f(x - 17 * s)}" cy="${f(base - 7 * s)}" r="${f(7 * s)}" fill="${C.ink}"/><circle cx="${f(x + 17 * s)}" cy="${f(base - 7 * s)}" r="${f(7 * s)}" fill="${C.ink}"/></g>`;
  };
  // 둥근 지구(옆모습). 위도선 셋, 기울기 tilt
  const LATS = [0, 38, -38];
  const globeFace = (cx, cy, r) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${C.sky}" stroke="${C.blue}" stroke-width="3"/>`
    + LATS.map((lat) => { const y = cy - r * Math.sin(rad(lat)), rx = r * Math.cos(rad(lat)); return `<ellipse cx="${cx}" cy="${f(y)}" rx="${f(rx)}" ry="${f(rx * 0.19)}" fill="none" stroke="${C.blue}" stroke-width="2" opacity=".45"/>`; }).join('');
  // 앞면을 왼쪽(서)에서 오른쪽(동)으로 지나가는 점들. mark 를 주면 그 위도에 빨간 점 하나를 더 돌린다
  const spinDots = (cx, cy, r, dur = 6, mark = null) => {
    let dots = '';
    const arc = (lat) => { const y = cy - r * Math.sin(rad(lat)), rx = r * Math.cos(rad(lat)), ry = rx * 0.19; return `M${f(cx - rx)} ${f(y)} A${f(rx)} ${f(ry)} 0 0 0 ${f(cx + rx)} ${f(y)}`; };
    const one = (path, begin, fill, rr, stroke = '') => `<circle r="${rr}" fill="${fill}"${stroke} opacity="0"><animateMotion dur="${dur}s" repeatCount="indefinite" begin="${begin}" path="${path}" calcMode="spline" keyTimes="0;1" keyPoints="0;1" keySplines=".45 0 .55 1"/><animate attributeName="opacity" dur="${dur}s" repeatCount="indefinite" begin="${begin}" values="0;1;1;0" keyTimes="0;.12;.88;1"/></circle>`;
    LATS.forEach((lat, li) => { for (let k = 0; k < 3; k++) dots += one(arc(lat), `-${f(k * dur / 3 + li * 0.7)}s`, C.green, 6); });
    if (mark != null) dots += one(arc(mark), '-1.2s', C.red, 9, ` stroke="white" stroke-width="2.5"`);
    return dots;
  };

  // 장면마다 같이 쓰는 움직임
  const base = (id) => {
    let s = `
    .sc-${id} .pop, .sc-${id} .pulse, .sc-${id} .ring, .sc-${id} .rays { transform-box: fill-box; transform-origin: center; }
    .sc-${id} .rays { animation: ${id}-pulse 2.4s ease-in-out infinite; }
    .sc-${id} .mar { animation: ${id}-mar .7s linear infinite; }
    .sc-${id} .draw { stroke-dasharray: 1; stroke-dashoffset: 1; }
    .sc-${id} .ring, .sc-${id} .cf, .sc-${id} .fall { opacity: 0; }
    .sc-${id} .shr, .sc-${id} .lv { transform-box: fill-box; transform-origin: 50% 100%; }
    .sc-${id} .up { animation: ${id}-up 2.4s ease-out infinite; }
    .sc-${id} .bob { animation: ${id}-bob 2.6s ease-in-out infinite alternate; }
    .sc-${id} .jig { animation: ${id}-jig 2.4s ease-in-out infinite; }
    @keyframes ${id}-pop { 0% { opacity: 0; transform: scale(.3); } 70% { opacity: 1; transform: scale(1.12); } 100% { opacity: 1; transform: scale(1); } }
    @keyframes ${id}-fin { from { opacity: 0; } to { opacity: 1; } }
    @keyframes ${id}-rise { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
    @keyframes ${id}-drop { from { opacity: 0; transform: translateY(-40px); } to { opacity: 1; transform: none; } }
    @keyframes ${id}-pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.12); } }
    @keyframes ${id}-flash { 0% { opacity: 0; } 20% { opacity: 1; } 40% { opacity: .25; } 60% { opacity: 1; } 80% { opacity: .25; } 100% { opacity: 1; } }
    @keyframes ${id}-ring { 0% { opacity: .9; transform: scale(1); } 100% { opacity: 0; transform: scale(1.6); } }
    @keyframes ${id}-mar { from { stroke-dashoffset: 24; } to { stroke-dashoffset: 0; } }
    @keyframes ${id}-drawk { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
    @keyframes ${id}-fall { 0% { opacity: 0; transform: translateY(0); } 15% { opacity: 1; } 85% { opacity: 1; } 100% { opacity: 0; transform: translateY(var(--fall, 50px)); } }
    @keyframes ${id}-mv { from { transform: translate(0, 0); } to { transform: translate(var(--tx, 0px), var(--ty, 0px)); } }
    @keyframes ${id}-fly { 0% { opacity: 0; transform: translate(var(--dx, 0px), var(--dy, 0px)); } 15% { opacity: 1; } 100% { opacity: 1; transform: translate(0, 0); } }
    @keyframes ${id}-shr { from { transform: scale(1); opacity: 1; } to { transform: scale(.42); opacity: .55; } }
    @keyframes ${id}-lv { from { transform: scaleY(0); } to { transform: scaleY(1); } }
    @keyframes ${id}-up { 0% { opacity: 0; transform: translateY(0); } 20%, 70% { opacity: 1; } 100% { opacity: 0; transform: translateY(var(--up, -60px)); } }
    @keyframes ${id}-bob { from { transform: translateY(-3px); } to { transform: translateY(3px); } }
    @keyframes ${id}-jig { 0%, 100% { transform: translate(0, 0); } 25% { transform: translate(3px, -3px); } 50% { transform: translate(-2px, 3px); } 75% { transform: translate(-3px, -1px); } }
    `;
    for (let n = 1; n <= 5; n++) s += `
    .on${n} .sc-${id} .pop${n} { animation: ${id}-pop .5s ease-out both; }
    .on${n} .sc-${id} .fin${n} { animation: ${id}-fin .6s ease-out both; }
    .on${n} .sc-${id} .rise${n} { animation: ${id}-rise .5s ease-out both; }
    .on${n} .sc-${id} .drop${n} { animation: ${id}-drop .6s ease-out both; }
    .on${n} .sc-${id} .pulse${n} { animation: ${id}-pulse .7s ease-in-out .3s 2; }
    .on${n} .sc-${id} .flash${n} { animation: ${id}-flash 1.4s ease-in-out both; }
    .on${n} .sc-${id} .ring${n} { animation: ${id}-ring 1.1s ease-out .3s 2; }
    .on${n} .sc-${id} .draw${n} { animation: ${id}-drawk 1.2s ease-in-out .2s both; }
    .on${n} .sc-${id} .fall${n} { animation: ${id}-fall 1s ease-in 3; }
    .on${n} .sc-${id} .cf${n} { animation: ${id}-fin .8s ease-out 1.2s both; }
    .on${n} .sc-${id} .mv${n} { animation: ${id}-mv 1.4s ease-in-out .2s both; }
    .on${n} .sc-${id} .fly${n} { animation: ${id}-fly 1.1s ease-out both; }
    .on${n} .sc-${id} .shr${n} { animation: ${id}-shr 3s ease-in-out .9s both; }
    .on${n} .sc-${id} .lv${n} { animation: ${id}-lv 1s ease-out both; }`;
    return s;
  };
  // 한 요소에 여러 움직임 값을 inline 으로 준다(지연·길이·이동량)
  const st = (o) => ` style="${Object.entries(o).map(([k, v]) => `${k}:${v}`).join(';')}"`;

  // ════ 1단원 산과 염기 ════

  // ── 지시약: 똑같이 투명한 두 컵에 같은 약품을 떨어뜨리니 한쪽은 붉게, 한쪽은 푸르게 ──
  (function () {
    const id = 't61-c1-jisiyak';
    let css = base(id);
    const L = 200, R = 440, by = 300, w = 140, h = 150, lh = 88;
    let body = '';
    [L, R].forEach((x) => { body += liq(x, by, w, lh, NONE); });
    body += liq(L, by, w, lh, [C.red, 0.72], 'cf cf2', 1.1) + liq(R, by, w, lh, [C.blue, 0.62], 'cf cf2', 1.3);
    [L, R].forEach((x) => { body += surface(x, by, w, lh) + beaker(x, by, w, h); });
    body += shown(1, g('pulse pulse1', text(L, 272, '?', { size: 44, color: C.muted })) + g('pulse pulse1', text(R, 272, '?', { size: 44, color: C.muted }), 0.2), 2);
    body += at(2, 'drop', dropper(L, 146)) + at(2, 'drop', dropper(R, 146), 0.15);
    body += drip(L, 152, by - lh, C.purple, 2, 0.4) + drip(R, 152, by - lh, C.purple, 2, 0.55);
    body += at(2, 'pop', tag(320, 100, '지시약', LIL), 0.3);
    body += ring(L, by - lh / 2, 62, 3, C.red) + ring(R, by - lh / 2, 62, 3, C.blue, 0.2);
    body += at(3, 'pop', tag(L, 334, '산성', HOT), 0.3) + at(3, 'pop', tag(R, 334, '염기성', COLD), 0.5);
    put('6-1/과학/1/지시약', svg(id, body, css));
  })();

  // ── 리트머스 종이: 푸른 종이는 산성에서 붉게, 붉은 종이는 염기성에서 푸르게 ──
  (function () {
    const id = 't61-c1-litmus';
    let css = base(id);
    const L = 190, R = 450, by = 290, w = 180, h = 140, lh = 80;
    const top = 24, sh = 120, sw = 26, dy = 130, dip = top + sh + dy - (by - lh);
    let body = '';
    [L, R].forEach((x) => { body += liq(x, by, w, lh, NONE); });
    // 푸른 종이(칸 1에 담근다): 산성에서만 붉게
    body += `<g class="mv mv1"${st({ '--ty': dy + 'px', 'animation-duration': '1s' })}>${strip(L - 34, top, sw, sh, C.blue, { to: C.red, dip, n: 1, s: 1.2 })}</g>`;
    body += `<g class="mv mv1"${st({ '--ty': dy + 'px', 'animation-delay': '.4s', 'animation-duration': '1s' })}>${strip(R - 34, top, sw, sh, C.blue)}</g>`;
    // 붉은 종이(칸 2에 나타나 담근다): 염기성에서만 푸르게
    body += `<g class="b2"><g class="mv mv2"${st({ '--ty': dy + 'px', 'animation-delay': '.2s', 'animation-duration': '1s' })}>${strip(L + 34, top, sw, sh, C.red)}</g></g>`;
    body += `<g class="b2"><g class="mv mv2"${st({ '--ty': dy + 'px', 'animation-delay': '.4s', 'animation-duration': '1s' })}>${strip(R + 34, top, sw, sh, C.red, { to: C.blue, dip, n: 2, s: 1.3 })}</g></g>`;
    [L, R].forEach((x) => { body += surface(x, by, w, lh) + beaker(x, by, w, h); });
    body += text(L, 330, '산성 용액', { size: 20 }) + text(R, 330, '염기성 용액', { size: 20 });
    const yc = top + sh + dy - dip / 2;
    body += ring(L - 34, yc, 34, 3, C.red) + ring(R + 34, yc, 34, 3, C.blue, 0.2);
    body += at(3, 'pop', tag(320, 70, '리트머스 종이', KEY, { size: 22 }), 0.6);
    put('6-1/과학/1/리트머스 종이', svg(id, body, css));
  })();

  // ── 페놀프탈레인 용액: 산성 용액에서는 그대로, 염기성 용액에서는 붉게 ──
  (function () {
    const id = 't61-c1-phenol';
    let css = base(id);
    const L = 200, R = 440, by = 290, w = 150, h = 145, lh = 88;
    let body = '';
    [L, R].forEach((x) => { body += liq(x, by, w, lh, NONE); });
    body += liq(R, by, w, lh, [C.red, 0.7], 'cf cf2', 1.1);
    [L, R].forEach((x) => { body += surface(x, by, w, lh) + beaker(x, by, w, h); });
    body += dropper(L, 140) + dropper(R, 140);
    body += at(1, 'pop', tag(320, 40, '페놀프탈레인 용액', GRAY), 0);
    body += drip(L, 146, by - lh, C.line, 1, 0.3) + drip(R, 146, by - lh, C.line, 2, 0.3);
    body += at(1, 'pop', tag(L, 250, '변화 없음', GRAY, { size: 18 }), 1.5);
    body += at(2, 'pop', tag(R, 250, '붉은색', HOT, { size: 18 }), 1.6);
    body += text(L, 330, '산성 용액', { size: 20 }) + text(R, 330, '염기성 용액', { size: 20 });
    body += ring(R, by - lh / 2, 64, 3, C.red) + `<g class="b3">${g('pulse pulse3', tag(320, 40, '페놀프탈레인 용액', KEY))}</g>`;
    put('6-1/과학/1/페놀프탈레인 용액', svg(id, body, css));
  })();

  // ── 붉은 양배추 지시약: 보랏빛 물이 산성에서 붉은색 계열, 염기성에서 푸른색·노란색 계열로 ──
  (function () {
    const id = 't61-c1-cabbage';
    let css = base(id);
    // 위: 양배추 → 보랏빛 지시약
    let cab = `<circle cx="96" cy="96" r="46" fill="${C.lilac}" stroke="${C.purple}" stroke-width="3.5"/>`
      + `<path d="M96 140 Q80 96 96 52 M96 120 Q122 104 132 74 M96 104 Q70 92 62 64 M96 132 Q66 124 54 100 M96 128 Q124 124 138 104" stroke="${C.purple}" stroke-width="2.5" fill="none" stroke-linecap="round" opacity=".8"/>`;
    let body = at(1, 'pop', cab);
    body += drawPath('M154 96 H208', 1, C.muted, 4, 0.5) + at(1, 'fin', head(212, 96, 0, C.muted, 4), 1.4);
    const bx = 270, bby = 150, bw = 84, bh = 104;
    body += `<g class="b1">${g('lv lv1', liq(bx, bby, bw, 76, [C.purple, 0.72]), 0.9)}</g>` + beaker(bx, bby, bw, bh);
    body += at(1, 'pop', tag(458, 96, '붉은 양배추 지시약', LIL), 1.4);
    // 아래: 홈판 여섯 칸
    const xs = [100, 180, 260, 380, 460, 540], by = 300, w = 58, h = 80, lh = 54;
    const after = [[C.red, 0.38], [C.red, 0.6], [C.red, 0.85], [C.blue, 0.42], [C.blue, 0.78], [C.yellow, 0.95]];
    body += `<rect x="64" y="${by + 2}" width="512" height="10" rx="5" fill="${C.line}"/>`;
    xs.forEach((x, k) => {
      const n = k < 3 ? 2 : 3, kk = k % 3;
      body += liq(x, by, w, lh, NONE) + liq(x, by, w, lh, after[k], `cf cf${n}`, f(1.1 + kk * 0.2)) + surface(x, by, w, lh) + beaker(x, by, w, h);
      body += at(n, 'drop', dropper(x, by - h - 4, 0.62), f(kk * 0.15)) + drip(x, by - h, by - lh, C.purple, n, f(0.4 + kk * 0.15), 4.5);
    });
    body += at(2, 'pop', tag(180, 336, '산성', HOT), 1.6) + at(3, 'pop', tag(460, 336, '염기성', COLD), 1.6);
    body += glowRect(60, 200, 240, 108, 4, C.red) + glowRect(340, 200, 240, 108, 4, C.blue, 0.2) + `<g class="b4">${g('pulse pulse4', tag(458, 96, '붉은 양배추 지시약', KEY))}</g>`;
    put('6-1/과학/1/붉은 양배추 지시약', svg(id, body, css));
  })();

  // ── 산성 용액: 푸른 리트머스 종이가 붉게, 대리암이 기포를 내며 녹는다 ──
  (function () {
    const id = 't61-c1-sanseong';
    let css = base(id);
    const xs = [80, 180, 280], cby = 250, cw = 80, ch = 110, clh = 68;
    const liquids = [NONE, [C.yellow, 0.35], NONE], names = ['식초', '레몬즙', '탄산수'];
    const top = 26, sh = 92, dy = 104, dip = top + sh + dy - (cby - clh);
    let body = '';
    xs.forEach((x, k) => {
      body += liq(x, cby, cw, clh, liquids[k]);
      if (k === 2) body += bubbles(x + 18, cby - 10, 50, 4, 7, 10);
      body += `<g class="mv mv1"${st({ '--ty': dy + 'px', 'animation-delay': f(0.2 + k * 0.2) + 's', 'animation-duration': '1s' })}>${strip(x - 14, top, 20, sh, C.blue, { to: C.red, dip, n: 1, s: f(1.2 + k * 0.2) })}</g>`;
      body += surface(x, cby, cw, clh) + beaker(x, cby, cw, ch) + text(x, 282, names[k], { size: 20 });
    });
    // 대리암 + 묽은 염산
    const bx = 490, by = 300, bw = 170, bh = 165, blh = 110;
    body += liq(bx, by, bw, blh, NONE);
    body += shown(2, bubbles(bx, by - 30, blh - 36, 9, 21, 22));
    body += `<g class="b2">${g('drop drop2', g('shr shr2', marble(bx, by - 22) + `<g class="fin fin2" style="animation-delay:.7s">${fizz(bx, by - 22)}</g>`))}</g>`;
    body += surface(bx, by, bw, blh) + beaker(bx, by, bw, bh) + text(bx, 330, '묽은 염산', { size: 20 });
    body += at(2, 'pop', lead(440, 124, 476, 262) + tag(440, 108, '대리암', GRAY), 0.7) + at(2, 'pop', lead(548, 124, 506, 214) + tag(548, 108, '기포', GRAY), 1.0);
    body += xs.map((x, k) => glowRect(x - cw / 2 - 6, cby - ch - 4, cw + 12, ch + 10, 3, C.red, k * 0.1)).join('') + glowRect(bx - bw / 2 - 6, by - bh - 4, bw + 12, bh + 10, 3, C.red, 0.3);
    body += at(3, 'pop', tag(520, 56, '산성 용액', KEY, { size: 24 }), 0.6);
    put('6-1/과학/1/산성 용액', svg(id, body, css));
  })();

  // ── 염기성 용액: 붉은 리트머스 종이가 푸르게, 페놀프탈레인 용액이 붉게, 두부가 녹는다 ──
  (function () {
    const id = 't61-c1-yeomgi';
    let css = base(id);
    const xs = [100, 250], cby = 250, cw = 100, ch = 110, clh = 68;
    const liquids = [NONE, [C.line, 0.55]], names = ['석회수', '빨랫비누 물'];
    const top = 26, sh = 92, dy = 104, dip = top + sh + dy - (cby - clh);
    let body = '';
    xs.forEach((x, k) => {
      body += liq(x, cby, cw, clh, liquids[k]) + liq(x, cby, cw, clh, [C.red, 0.62], 'cf cf2', f(1.2 + k * 0.2));
      body += `<g class="mv mv1"${st({ '--ty': dy + 'px', 'animation-delay': f(0.2 + k * 0.25) + 's', 'animation-duration': '1s' })}>${strip(x - 22, top, 20, sh, C.red, { to: C.blue, dip, n: 1, s: f(1.2 + k * 0.25) })}</g>`;
      body += surface(x, cby, cw, clh) + beaker(x, cby, cw, ch) + text(x, 282, names[k], { size: 20 });
      body += at(2, 'drop', dropper(x + 24, 132, 0.85), k * 0.15) + drip(x + 24, 136, cby - clh, C.line, 2, f(0.4 + k * 0.15));
    });
    body += at(2, 'pop', tag(175, 34, '페놀프탈레인 용액', GRAY, { size: 18 }), 0.2);
    // 두부 + 묽은 수산화 나트륨 용액
    const bx = 490, by = 300, bw = 170, bh = 165, blh = 110;
    body += liq(bx, by, bw, blh, NONE);
    const r = seeded(5);
    let specks = '';
    for (let k = 0; k < 12; k++) { const x = bx - 60 + (k % 6) * 24 + r() * 8, y = by - 18 - Math.floor(k / 6) * 26 - r() * 16, a = Math.round(r() * 60 - 30); specks += `<g class="jig" style="animation-delay:${f(-r() * 2.4)}s"><rect x="${f(x - 5)}" y="${f(y - 3.5)}" width="10" height="7" rx="2" transform="rotate(${a} ${f(x)} ${f(y)})" fill="white" stroke="${C.muted}" stroke-width="1.5"/></g>`; }
    body += liq(bx, by, bw, blh, [C.muted, 0.22], 'cf cf3', 1.3);
    body += `<g class="b3">${g('fin fin3', specks, 1.4)}</g>`;
    const tofu = `<rect x="${bx - 26}" y="${by - 50}" width="52" height="44" rx="5" fill="white" stroke="${C.muted}" stroke-width="3"/><path d="M${bx - 26} ${by - 38} H${bx + 26}" stroke="${C.line}" stroke-width="2"/>`;
    body += `<g class="b3">${g('drop drop3', g('shr shr3', tofu))}</g>`;
    body += surface(bx, by, bw, blh) + beaker(bx, by, bw, bh) + text(bx, 330, '묽은 수산화 나트륨 용액', { size: 19 });
    body += at(3, 'pop', lead(430, 124, 470, 256) + tag(430, 108, '두부', GRAY), 0.7);
    body += xs.map((x, k) => glowRect(x - cw / 2 - 6, cby - ch - 4, cw + 12, ch + 10, 4, C.blue, k * 0.1)).join('') + glowRect(bx - bw / 2 - 6, by - bh - 4, bw + 12, bh + 10, 4, C.blue, 0.2);
    body += at(4, 'pop', tag(520, 56, '염기성 용액', COLD, { size: 24 }), 0.6);
    put('6-1/과학/1/염기성 용액', svg(id, body, css));
  })();

  // ── 무색: 여러 용액을 색깔 있는 것과 없는 것으로 나누고, 없는 쪽이 무색 ──
  (function () {
    const id = 't61-c1-musaek';
    let css = base(id);
    const xs = [80, 176, 272, 368, 464, 560], by = 268, w = 60, h = 100, lh = 70;
    const colors = [[C.orange, 0.75], NONE, [C.yellow, 0.75], NONE, [C.purple, 0.6], NONE];
    const to = [90, 390, 170, 470, 250, 550];
    let body = '';
    xs.forEach((x, k) => {
      const cup = liq(x, by, w, lh, colors[k]) + surface(x, by, w, lh) + beaker(x, by, w, h);
      body += `<g class="mv mv2"${st({ '--tx': (to[k] - x) + 'px', 'animation-delay': f(0.2 + (k % 2) * 0.15) + 's', 'animation-duration': '1.5s' })}>${g('drop drop1', cup, f(k * 0.12))}</g>`;
    });
    body += at(2, 'rise', tag(170, 316, '색깔 있음', GRAY), 1.7) + at(2, 'rise', tag(470, 316, '색깔 없음', GRAY), 1.8);
    body += glowRect(344, 156, 252, 124, 3, C.green);
    body += at(3, 'pop', tag(470, 110, '무색', KEY, { size: 24 }), 0.5);
    put('6-1/과학/1/무색', svg(id, body, css));
  })();

  // ── 탄산 칼슘: 달걀 껍데기·조개껍데기·대리암을 이루는 물질, 산성 용액에서 기포를 내며 녹는다 ──
  (function () {
    const id = 't61-c1-tansan';
    let css = base(id);
    const egg = `<path d="M46 98 L54 88 L62 97 L71 86 L80 96 L89 86 L98 97 L106 88 L114 98 Q116 138 80 140 Q44 138 46 98 Z" fill="${C.peach}" stroke="${C.orange}" stroke-width="3" stroke-linejoin="round"/><path d="M58 104 Q56 124 70 132" stroke="white" stroke-width="4" fill="none" stroke-linecap="round" opacity=".9"/>`;
    let ridges = '';
    for (let k = 0; k < 5; k++) { const a = rad(200 + k * 35); ridges += `<path d="M200 130 L${f(200 + 40 * Math.cos(a))} ${f(98 + 34 * Math.sin(a))}" stroke="${C.muted}" stroke-width="2"/>`; }
    const shell = `<path d="M200 132 L166 96 Q200 56 234 96 Z" fill="white" stroke="${C.muted}" stroke-width="3" stroke-linejoin="round"/>${ridges}<path d="M190 128 L186 138 H214 L210 128" fill="white" stroke="${C.muted}" stroke-width="3" stroke-linejoin="round"/>`;
    let body = at(1, 'pop', egg) + at(1, 'pop', shell, 0.2) + at(1, 'pop', marble(320, 104, 1.2), 0.4);
    body += text(80, 166, '달걀 껍데기', { size: 18 }) + text(200, 166, '조개껍데기', { size: 18 }) + text(320, 166, '대리암', { size: 18 });
    [80, 200, 320].forEach((x, k) => { body += drawPath(`M${x} 180 L${f(200 + (x - 200) * 0.3)} 236`, 1, C.green, 3, f(0.8 + k * 0.1)); });
    body += at(1, 'pop', tag(200, 256, '탄산 칼슘', KEY, { size: 22 }), 1.5);
    // 산성 용액 속으로
    const bx = 510, by = 300, bw = 160, bh = 170, blh = 120;
    body += liq(bx, by, bw, blh, NONE);
    body += shown(2, bubbles(bx, by - 30, blh - 36, 10, 33, 22));
    body += `<g class="b2"><g class="fly fly2"${st({ '--dx': '-190px', '--dy': '-174px' })}>${g('shr shr3', marble(bx, by - 22, 1.2) + `<g class="fin fin2" style="animation-delay:1s">${fizz(bx, by - 22, 1.2)}</g>`)}</g></g>`;
    body += surface(bx, by, bw, blh) + beaker(bx, by, bw, bh) + text(bx, 330, '산성 용액', { size: 20 });
    body += at(2, 'pop', lead(600, 116, 528, 200) + tag(604, 98, '기포', GRAY), 1.3);
    body += ring(bx, by - 24, 46, 3, C.red, 1.6) + `<g class="b3">${g('pulse pulse3', tag(200, 256, '탄산 칼슘', KEY, { size: 22 }))}</g>`;
    put('6-1/과학/1/탄산 칼슘', svg(id, body, css));
  })();

  // ── 산성화: 오염 물질이 섞인 비는 흙에, 이산화 탄소는 바닷물에 녹아 흙과 바다가 산성 쪽으로 ──
  (function () {
    const id = 't61-c1-sanseonghwa';
    let css = base(id);
    let body = `<rect x="20" y="282" width="310" height="62" rx="10" fill="${C.peach}" stroke="${C.orange}" stroke-width="3"/>`
      + `<rect x="330" y="282" width="290" height="62" rx="10" fill="${C.sky}" stroke="${C.blue}" stroke-width="3"/>`
      + `<path d="M344 300 q14 -8 28 0 t28 0 t28 0 t28 0 t28 0 t28 0 t28 0 t28 0 t28 0" stroke="${C.blue}" stroke-width="2.5" fill="none" opacity=".6"/>`
      + text(175, 324, '흙', { size: 22 }) + text(475, 330, '바다', { size: 22 });
    const factory = `<path d="M50 282 V214 L80 196 V214 L110 196 V214 L150 196 V282 Z" fill="${C.line}" stroke="${C.muted}" stroke-width="3" stroke-linejoin="round"/><rect x="116" y="148" width="20" height="60" fill="${C.line}" stroke="${C.muted}" stroke-width="3"/><rect x="66" y="236" width="20" height="20" fill="white" stroke="${C.muted}" stroke-width="2"/><rect x="104" y="236" width="20" height="20" fill="white" stroke="${C.muted}" stroke-width="2"/>`;
    body += `<g class="h3">${factory}${car(240, 282, C.muted, 1.1)}</g>`;
    const puff = (x, y, k, rr = 11, up = 70) => `<circle class="up" style="--up:-${up}px;animation-delay:${f(-k * 0.6)}s" cx="${x}" cy="${y}" r="${rr}" fill="white" stroke="${C.muted}" stroke-width="2.5" stroke-dasharray="4 3"/>`;
    let smoke = '';
    for (let k = 0; k < 4; k++) smoke += puff(126, 138, k) + puff(196, 262, k + 0.3, 8, 90);
    body += shown(1, smoke, 3);
    const cloud = `<path d="M128 104 Q112 104 112 88 Q112 70 132 70 Q136 46 162 48 Q178 30 204 40 Q226 30 240 52 Q268 50 270 76 Q286 82 280 98 Q276 106 262 106 Z" fill="${C.line}" stroke="${C.muted}" stroke-width="3" stroke-linejoin="round"/>`;
    body += `<g class="h3">${at(1, 'pop', cloud, 1.0)}</g>`;
    // 칸 2: 흙에는 산성비, 바다에는 공기 속 이산화 탄소가 녹아든다(아이스크림 31쪽: 바다 산성화의 주된 원인은 이산화 탄소)
    let rain = '';
    const r = seeded(9);
    for (let k = 0; k < 12; k++) { const x = 130 + k * 12 + r() * 6; rain += `<path class="rain" style="--fall:160px;animation-delay:${f(-r())}s" d="M${f(x)} 112 l-4 14" stroke="${C.blue}" stroke-width="3" stroke-linecap="round"/>`; }
    body += shown(2, rain, 3);
    let gas = '';
    for (let k = 0; k < 7; k++) gas += `<circle class="sink" style="--fall:170px;animation-delay:${f(-k * 0.42)}s" cx="${f(400 + k * 28)}" cy="${f(130 + (k % 3) * 10)}" r="8" fill="${C.lilac}" stroke="${C.purple}" stroke-width="2.5"/>`;
    body += shown(2, gas, 3);
    body += `<g class="h3">${at(2, 'pop', tag(340, 64, '산성비', COLD), 0.5)}${at(2, 'pop', tag(500, 100, '이산화 탄소', LIL), 0.9)}</g>`;
    // 칸 3: 흙과 바다의 눈금이 산성 쪽으로
    const gauge = (x0) => {
      const bx0 = x0 + 52, bx1 = x0 + 202, mid = (bx0 + bx1) / 2;
      return `<rect x="${x0}" y="196" width="270" height="70" rx="14" fill="white" stroke="${C.line}" stroke-width="3"/>`
        + `<rect x="${bx0}" y="232" width="${(bx1 - bx0) / 2}" height="16" fill="${C.red}" fill-opacity=".55"/><rect x="${mid}" y="232" width="${(bx1 - bx0) / 2}" height="16" fill="${C.blue}" fill-opacity=".55"/>`
        + `<rect x="${bx0}" y="232" width="${bx1 - bx0}" height="16" rx="3" fill="none" stroke="${C.muted}" stroke-width="2"/>`
        + text(x0 + 26, 247, '산성', { size: 18 }) + text(x0 + 238, 247, '염기성', { size: 18 })
        + `<g class="mv mv3"${st({ '--tx': '-56px', 'animation-delay': '.8s', 'animation-duration': '1.3s' })}><path d="M${mid - 9} 210 H${mid + 9} L${mid} 228 Z" fill="${C.ink}"/></g>`;
    };
    body += at(3, 'rise', gauge(40), 0.1) + at(3, 'rise', gauge(340), 0.25);
    body += at(3, 'pop', tag(330, 150, '산성화', KEY, { size: 24 }), 1.6);
    css += `.sc-${id} .rain { animation: ${id}-fall .9s linear infinite; } .sc-${id} .sink { animation: ${id}-fall 2.8s ease-in infinite; }`;
    put('6-1/과학/1/산성화', svg(id, body, css));
  })();

  // ════ 2단원 물체의 운동 ════

  // ── 운동: 3초 동안 배는 자리를 옮기고 등대는 그대로 ──
  (function () {
    const id = 't61-c2-undong';
    let css = base(id);
    let body = `<rect x="0" y="232" width="640" height="128" fill="${C.sky}"/>`
      + `<path d="M0 262 q20 -8 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0" stroke="${C.blue}" stroke-width="2.5" fill="none" opacity=".5"/>`;
    // 등대
    let lh = `<path d="M60 240 Q100 214 140 240 Z" fill="${C.line}" stroke="${C.muted}" stroke-width="3"/>`
      + `<path d="M82 230 L90 104 H110 L118 230 Z" fill="white" stroke="${C.muted}" stroke-width="3" stroke-linejoin="round"/>`
      + `<path d="M85.5 175 L87.5 145 H112.5 L114.5 175 Z M81.5 230 L83.5 205 H116.5 L118.5 230 Z" fill="${C.red}" opacity=".8"/>`
      + `<rect x="86" y="84" width="28" height="20" fill="${C.yellow}" stroke="${C.orange}" stroke-width="3"/><path d="M80 84 L100 66 L120 84 Z" fill="${C.red}" stroke="${C.red}" stroke-width="2" stroke-linejoin="round"/>`;
    body += lh + tag(100, 40, '등대', GRAY);
    const boat = (x, dash = false) => {
      const st2 = dash ? ` stroke-dasharray="7 5" fill="none"` : '';
      return `<path d="M${x - 52} 222 H${x + 52} L${x + 36} 248 H${x - 36} Z"${dash ? st2 : ` fill="${C.peach}"`} stroke="${dash ? C.muted : C.orange}" stroke-width="3" stroke-linejoin="round"/>`
        + `<path d="M${x} 222 V146"${dash ? st2 : ''} stroke="${dash ? C.muted : C.ink}" stroke-width="3"/><path d="M${x + 4} 152 L${x + 42} 212 H${x + 4} Z"${dash ? st2 : ` fill="white"`} stroke="${C.muted}" stroke-width="3" stroke-linejoin="round"/>`;
    };
    body += at(2, 'fin', boat(250, true), 0.3);
    body += drawPath('M300 284 H468', 2, C.green, 5, 0.3) + at(2, 'fin', head(474, 284, 0, C.green, 5), 1.4);
    body += `<g class="mv mv2"${st({ '--tx': '280px', 'animation-duration': '1.6s' })}><g class="bob">${boat(250)}${tag(250, 120, '배', OK)}</g></g>`;
    body += shown(1, tag(330, 44, '0초', GRAY), 2) + at(2, 'pop', tag(330, 44, '3초', GRAY), 1.6);
    body += at(3, 'pop', tag(100, 300, '그대로', GRAY, { size: 18 }), 0.2);
    body += ring(530, 196, 70, 3, C.red, 0.3) + at(3, 'pop', tag(530, 64, '운동', KEY, { size: 24 }), 0.7);
    put('6-1/과학/2/운동', svg(id, body, css));
  })();

  // ── 이동 거리: 출발선에서 결승선까지 간 길이 50 m ──
  (function () {
    const id = 't61-c2-geori';
    let css = base(id);
    const x0 = 90, step = 96, gy = 240;
    let body = `<path d="M40 ${gy} H610" stroke="${C.ink}" stroke-width="3"/>`;
    for (let k = 0; k <= 5; k++) body += `<path d="M${x0 + k * step} ${gy} V${gy + 12}" stroke="${C.ink}" stroke-width="2.5"/>` + text(x0 + k * step, gy + 38, `${k * 10} m`, { size: 18, weight: 600 });
    body += `<path d="M${x0} 128 V${gy}" stroke="${C.green}" stroke-width="3" stroke-dasharray="7 5"/><path d="M${x0 + 5 * step} 128 V${gy}" stroke="${C.red}" stroke-width="3" stroke-dasharray="7 5"/>`;
    body += tag(x0, 108, '출발선', OK, { size: 18 }) + tag(x0 + 5 * step, 108, '결승선', HOT, { size: 18 });
    body += drawPath(`M${x0} ${gy} H${x0 + 5 * step}`, 2, C.green, 8, 0.2) ;
    body += `<g class="mv mv2"${st({ '--tx': 5 * step + 'px', 'animation-duration': '1.6s' })}>${car(x0, gy - 4, C.orange, 1.1)}<circle cx="${x0}" cy="${gy}" r="6" fill="${C.red}" stroke="white" stroke-width="2"/></g>`;
    const ay = 316;
    body += drawPath(`M${x0} ${ay} H${x0 + 5 * step}`, 3, C.purple, 4, 0.1) + at(3, 'fin', head(x0, ay, Math.PI, C.purple, 4) + head(x0 + 5 * step, ay, 0, C.purple, 4) + `<path d="M${x0} ${ay - 12} V${ay + 12} M${x0 + 5 * step} ${ay - 12} V${ay + 12}" stroke="${C.purple}" stroke-width="3"/>`, 1.0);
    body += at(3, 'pop', tag(330, ay, '50 m', LIL), 1.1) + at(3, 'pop', tag(330, 56, '이동 거리', KEY, { size: 24 }), 1.4);
    css += `.on2 .sc-${id} .draw2 { animation-duration: 1.6s; animation-timing-function: ease-in-out; }`;
    put('6-1/과학/2/이동 거리', svg(id, body, css));
  })();

  // ── 빠르기: 같은 시간이면 멀리 간 쪽, 같은 거리면 짧은 시간에 간 쪽이 빠르다 ──
  (function () {
    const id = 't61-c2-ppareugi';
    let css = base(id);
    const sx = 70;
    let body = `<path d="M20 182 H620" stroke="${C.line}" stroke-width="3"/>`;
    // 위: 같은 시간
    body += tag(82, 34, '같은 시간', GRAY, { size: 18 }) + tag(560, 34, '10초', GRAY, { size: 18 });
    body += `<path d="M${sx - 34} 112 H600 M${sx - 34} 168 H600" stroke="${C.line}" stroke-width="2" stroke-dasharray="10 8"/>`;
    body += drawPath(`M${sx} 106 H${sx + 400}`, 1, C.orange, 5, 0.2, '') + drawPath(`M${sx} 162 H${sx + 200}`, 1, C.blue, 5, 0.2);
    body += `<g class="mv mv1"${st({ '--tx': '400px', 'animation-duration': '1.6s' })}>${car(sx, 104, C.orange)}</g>`;
    body += `<g class="mv mv1"${st({ '--tx': '200px', 'animation-duration': '1.6s' })}>${car(sx, 160, C.blue)}</g>`;
    css += `.on1 .sc-${id} .draw1 { animation-duration: 1.6s; }`;
    // 아래: 같은 거리
    const fx = 520;
    body += tag(82, 208, '같은 거리', GRAY, { size: 18 });
    body += `<path d="M${sx - 34} 282 H600 M${sx - 34} 342 H600" stroke="${C.line}" stroke-width="2" stroke-dasharray="10 8"/>`;
    body += `<path d="M${fx} 226 V346" stroke="${C.ink}" stroke-width="3"/><path d="M${fx} 226 h34 v20 h-34 Z" fill="white" stroke="${C.ink}" stroke-width="2"/><path d="M${fx} 226 h11 v10 h-11 Z M${fx + 22} 226 h12 v10 h-12 Z M${fx + 11} 236 h11 v10 h-11 Z" fill="${C.ink}"/>`;
    body += `<g class="b2"><g class="mv mv2"${st({ '--tx': (fx - 30 - sx) + 'px', 'animation-duration': '1s', 'animation-timing-function': 'linear' })}>${car(sx, 276, C.orange)}</g></g>`;
    body += `<g class="b2"><g class="mv mv2"${st({ '--tx': (fx - 30 - sx) + 'px', 'animation-duration': '1.5s', 'animation-timing-function': 'linear' })}>${car(sx, 336, C.blue)}</g></g>`;
    body += at(2, 'pop', tag(586, 262, '6초', HOT, { size: 18 }), 1.2) + at(2, 'pop', tag(586, 322, '9초', COLD, { size: 18 }), 1.7);
    // 칸 3: 빠른 쪽 표시
    body += at(3, 'pop', tag(sx + 400, 48, '빠름', HOT, { size: 18 }), 0.2) + at(3, 'pop', tag(fx - 30, 208, '빠름', HOT, { size: 18 }), 0.4);
    body += at(3, 'pop', tag(330, 208, '빠르기', KEY, { size: 22 }), 0.8);
    put('6-1/과학/2/빠르기', svg(id, body, css));
  })();

  // ── 속력: 10초 동안 50 m, 1초마다 5 m, 50 m ÷ 10 s = 5 m/s ──
  (function () {
    const id = 't61-c2-sokryeok';
    let css = base(id);
    const x0 = 70, step = 50, gy = 200;
    let body = `<path d="M30 ${gy} H610" stroke="${C.ink}" stroke-width="3"/>`;
    for (let k = 0; k <= 10; k++) body += `<path d="M${x0 + k * step} ${gy} V${gy + (k % 2 ? 7 : 12)}" stroke="${C.ink}" stroke-width="2.5"/>` + (k % 2 ? '' : text(x0 + k * step, gy + 34, `${k * 5} m`, { size: 18, weight: 600 }));
    const bike = (x) => `<g><circle cx="${x - 24}" cy="${gy - 18}" r="16" fill="white" stroke="${C.ink}" stroke-width="3"/><circle cx="${x + 24}" cy="${gy - 18}" r="16" fill="white" stroke="${C.ink}" stroke-width="3"/>`
      + `<path d="M${x - 24} ${gy - 18} L${x - 6} ${gy - 46} H${x + 16} L${x + 24} ${gy - 18} M${x - 6} ${gy - 46} L${x + 2} ${gy - 18} L${x + 16} ${gy - 46} M${x - 10} ${gy - 54} H${x} M${x + 12} ${gy - 54} L${x + 16} ${gy - 46}" stroke="${C.blue}" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>`;
    body += `<g class="mv mv1"${st({ '--tx': 10 * step + 'px', 'animation-duration': '1.6s', 'animation-timing-function': 'linear' })}>${bike(x0)}</g>`;
    body += drawPath(`M${x0} 110 H${x0 + 10 * step}`, 1, C.purple, 3, 1.7) + at(1, 'fin', head(x0, 110, Math.PI, C.purple, 3) + head(x0 + 10 * step, 110, 0, C.purple, 3), 2.0);
    body += at(1, 'pop', tag(320, 110, '50 m', LIL), 1.8) + at(1, 'pop', tag(560, 44, '10초', GRAY), 1.9);
    // 칸 2: 1초마다 5 m 씩
    for (let k = 0; k < 10; k++) body += at(2, 'fin', `<rect x="${x0 + k * step + 3}" y="250" width="${step - 6}" height="32" rx="6" fill="${C.mint}" stroke="${C.green}" stroke-width="2.5"/>` + text(x0 + k * step + step / 2, 272, '5 m', { size: 18, weight: 600 }), f(0.2 + k * 0.13));
    body += at(2, 'pop', tag(300, 44, '1초에 5 m', OK), 1.6);
    // 칸 3: 식
    body += at(3, 'pop', `<rect x="96" y="298" width="370" height="50" rx="12" fill="white" stroke="${C.purple}" stroke-width="3"/>` + text(220, 332, '50 m ÷ 10 s', { size: 26 }), 0.1);
    body += at(3, 'pop', text(366, 332, '= 5 m/s', { size: 26, color: C.red }), 0.6);
    body += at(3, 'pop', tag(548, 323, '속력', KEY, { size: 24 }), 1.0);
    put('6-1/과학/2/속력', svg(id, body, css));
  })();

  // ════ 4단원 지구의 운동 ════

  // ── 자전: 자전축을 중심으로 서에서 동으로, 햇빛 받는 쪽은 낮, 반대쪽은 밤 ──
  (function () {
    const id = 't61-c4-jajeon';
    let css = base(id);
    const cx = 320, cy = 176, r = 108, tilt = 23.5;
    let inner = globeFace(cx, cy, r) + spinDots(cx, cy, r, 6, 38);
    inner += `<path d="M${cx} ${cy - r - 24} V${cy + r + 24}" stroke="${C.red}" stroke-width="4"/>`;
    let body = `<g transform="rotate(${tilt} ${cx} ${cy})">${inner}</g>`;
    // 칸 2: 해와 밤 쪽 그늘
    body += at(2, 'fin', `<path d="M${cx} ${cy - r} A${r} ${r} 0 0 1 ${cx} ${cy + r} Z" fill="${C.purple}" fill-opacity=".32"/>`, 0.5);
    body += at(2, 'pop', sunIcon(58, cy, 30));
    [-56, 0, 56].forEach((dy, k) => { body += drawPath(`M104 ${cy + dy} H${f(cx - Math.sqrt(r * r - dy * dy) - 14)}`, 2, C.orange, 4, f(0.3 + k * 0.1)); });
    body += at(2, 'pop', tag(cx - 52, cy + 4, '낮', ['white', C.orange]), 1.1) + at(2, 'pop', tag(cx + 52, cy + 4, '밤', ['white', C.purple]), 1.3);
    // 서 → 동 화살표(아래)
    body += `<path d="M236 324 Q320 352 404 324" stroke="${C.green}" stroke-width="4" fill="none" stroke-linecap="round"/>` + head(404, 324, -0.32, C.green, 4);
    body += text(212, 332, '서', { size: 22 }) + text(430, 332, '동', { size: 22 });
    body += at(3, 'pop', tag(538, 290, '하루에 한 바퀴', OK), 0.2) + at(3, 'pop', tag(548, 52, '자전', KEY, { size: 24 }), 0.6);
    put('6-1/과학/4/자전', svg(id, body, css));
  })();

  // ── 자전축: 팽이가 가운데 막대를 중심으로 돌듯, 지구는 북극과 남극을 잇는 선을 중심으로 ──
  (function () {
    const id = 't61-c4-chuk';
    let css = base(id);
    // 팽이
    const tx = 150;
    const shape = `M${tx - 74} 170 A74 20 0 0 1 ${tx + 74} 170 L${tx} 292 Z`;
    let stripes = '';
    for (let k = -6; k < 9; k++) stripes += `<rect x="${tx - 80 + k * 20}" y="140" width="10" height="160" fill="${C.orange}" opacity=".75"/>`;
    let body = `<defs><clipPath id="${id}-top"><path d="${shape}"/><ellipse cx="${tx}" cy="170" rx="74" ry="20"/></clipPath></defs>`;
    body += `<path d="${shape}" fill="${C.yellow}"/><g clip-path="url(#${id}-top)"><g class="spin">${stripes}</g></g>`;
    body += `<path d="${shape}" fill="none" stroke="${C.orange}" stroke-width="3" stroke-linejoin="round"/><ellipse cx="${tx}" cy="170" rx="74" ry="20" fill="${C.yellow}" stroke="${C.orange}" stroke-width="3"/>`;
    body += `<rect x="${tx - 6}" y="104" width="12" height="66" rx="5" fill="${C.purple}"/>`;
    body += `<path d="M${tx - 30} 132 A30 8 0 0 0 ${tx + 30} 132" stroke="${C.green}" stroke-width="4" fill="none" stroke-linecap="round"/>` + head(tx + 30, 132, -0.4, C.green, 4);
    body += drawPath(`M${tx} 74 V326`, 1, C.red, 3, 0.4);
    body += at(1, 'pop', tag(tx + 56, 86, '중심', ['white', C.red], { size: 18 }), 1.3);
    // 지구
    const cx = 455, cy = 186, r = 96, tilt = 23.5;
    let inner = globeFace(cx, cy, r) + shown(2, spinDots(cx, cy, r, 6));
    inner += `<g class="b3"><path class="flash flash3" d="M${cx} ${cy - r - 34} V${cy + r + 34}" stroke="${C.yellow}" stroke-width="12" opacity=".7"/></g>`;
    inner += `<g class="b2"><path class="draw draw2" pathLength="1" d="M${cx} ${cy - r - 34} V${cy + r + 34}" stroke="${C.red}" stroke-width="4" fill="none"/></g>`;
    inner += at(2, 'pop', `<circle cx="${cx}" cy="${cy - r}" r="7" fill="${C.red}" stroke="white" stroke-width="2"/>`, 0.1) + at(2, 'pop', `<circle cx="${cx}" cy="${cy + r}" r="7" fill="${C.red}" stroke="white" stroke-width="2"/>`, 0.2);
    body += at(3, 'fin', `<path d="M${cx} 52 V330" stroke="${C.muted}" stroke-width="3" stroke-dasharray="8 8"/>`);
    body += `<g transform="rotate(${tilt} ${cx} ${cy})">${inner}</g>`;
    const nx = cx + r * Math.sin(rad(tilt)), ny = cy - r * Math.cos(rad(tilt)), sxp = cx - r * Math.sin(rad(tilt)), syp = cy + r * Math.cos(rad(tilt));
    body += at(2, 'pop', tag(f(nx + 54), f(ny - 4), '북극', ['white', C.red], { size: 18 }), 0.9) + at(2, 'pop', tag(f(sxp - 54), f(syp + 6), '남극', ['white', C.red], { size: 18 }), 1.1);
    const ar = 128;
    body += at(3, 'fin', `<path d="M${cx} ${cy - ar} A${ar} ${ar} 0 0 1 ${f(cx + ar * Math.sin(rad(tilt)))} ${f(cy - ar * Math.cos(rad(tilt)))}" stroke="${C.purple}" stroke-width="5" fill="none"/>`, 0.4);
    body += at(3, 'pop', tag(580, 300, '자전축', KEY, { size: 24 }), 0.8);
    css += `.sc-${id} .spin { animation: ${id}-spin .5s linear infinite; } @keyframes ${id}-spin { from { transform: translateX(0); } to { transform: translateX(20px); } }`;
    put('6-1/과학/4/자전축', svg(id, body, css));
  })();

  // ── 공전: 태양 둘레를 정해진 길을 따라 일 년에 한 바퀴 ──
  (function () {
    const id = 't61-c4-gongjeon';
    let css = base(id);
    const cx = 320, cy = 176, rx = 236, ry = 108, tilt = 23.5;
    const orbit = `M${cx - rx} ${cy} A${rx} ${ry} 0 0 0 ${cx + rx} ${cy} A${rx} ${ry} 0 0 0 ${cx - rx} ${cy}`;
    let body = `<path d="${orbit}" stroke="${C.muted}" stroke-width="3" stroke-dasharray="6 8" fill="none"/>`;
    body += head(cx + 8, cy + ry, 0, C.muted, 3) + head(cx - 8, cy - ry, Math.PI, C.muted, 3);
    body += drawPath(orbit, 2, C.orange, 6, 0.1);
    body += sunIcon(cx, cy, 38) + text(cx, cy + 82, '태양', { size: 20 });
    const earth = `<g transform="rotate(${tilt})"><circle r="21" fill="${C.sky}" stroke="${C.blue}" stroke-width="2.5"/><ellipse rx="21" ry="4.5" fill="none" stroke="${C.blue}" stroke-width="1.5" opacity=".5"/><path d="M0 -32 V32" stroke="${C.red}" stroke-width="3"/></g>`
      + `<rect x="-24" y="34" width="48" height="26" rx="13" fill="white" stroke="${C.blue}" stroke-width="2"/>` + text(0, 53, '지구', { size: 18 });
    body += `<g>${earth}<animateMotion dur="8s" repeatCount="indefinite" path="${orbit}"/></g>`;
    body += at(2, 'pop', tag(536, 334, '일 년에 한 바퀴', OK), 1.2);
    body += `<g class="b3"><path class="flash flash3" d="${orbit}" stroke="${C.yellow}" stroke-width="8" fill="none" opacity=".8"/></g>`;
    body += at(3, 'pop', tag(560, 42, '공전', KEY, { size: 24 }), 0.6);
    css += `.on2 .sc-${id} .draw2 { animation-duration: 1.8s; }`;
    put('6-1/과학/4/공전', svg(id, body, css));
  })();

  // ── 규칙성: 해는 날마다 동쪽에서 남쪽을 지나 서쪽으로, 같은 길을 되풀이한다 ──
  (function () {
    const id = 't61-c4-gyuchik';
    let css = base(id);
    const cx = 320, cy = 236, R = 186, hy = 230;
    const P = (a, rr = R, x = cx, y = cy) => [x + rr * Math.sin(rad(a)), y - rr * Math.cos(rad(a))];
    const arcPath = (rr, x, y) => { const [ax, ay] = P(-80, rr, x, y), [bx, by] = P(80, rr, x, y); return `M${f(ax)} ${f(ay)} A${rr} ${rr} 0 0 1 ${f(bx)} ${f(by)}`; };
    let body = `<rect x="20" y="${hy}" width="600" height="40" rx="8" fill="${C.mint}"/><path d="M20 ${hy} H620" stroke="${C.green}" stroke-width="3"/>`;
    body += text(64, hy + 30, '동', { size: 22 }) + text(cx, hy + 30, '남', { size: 22 }) + text(576, hy + 30, '서', { size: 22 });
    body += `<path d="${arcPath(R, cx, cy)}" stroke="${C.orange}" stroke-width="3" stroke-dasharray="7 7" fill="none" opacity=".7"/>`;
    // 사람(뒷모습, 남쪽을 본다)
    body += `<circle cx="${cx}" cy="${hy - 34}" r="9" fill="${C.ink}"/><path d="M${cx - 11} ${hy} V${hy - 16} Q${cx - 11} ${hy - 24} ${cx} ${hy - 24} Q${cx + 11} ${hy - 24} ${cx + 11} ${hy - 16} V${hy} Z" fill="${C.ink}"/>`;
    [-55, 0, 55].forEach((a, k) => { const [x, y] = P(a); body += at(1, 'fin', `<circle cx="${f(x)}" cy="${f(y)}" r="16" fill="${C.yellow}" fill-opacity=".45" stroke="${C.orange}" stroke-width="2" stroke-dasharray="4 3"/>`, f(0.55 + k * 0.5)); });
    body += `<g class="sun"><g>${sunIcon(cx, cy - R, 18)}</g></g>`;
    // 칸 2: 날마다 같은 길
    ['1일', '2일', '3일'].forEach((d, k) => {
      const x0 = 34 + k * 196, mx = x0 + 110, my = 346, mr = 54;
      let p = `<rect x="${x0}" y="282" width="180" height="72" rx="12" fill="white" stroke="${C.line}" stroke-width="3"/>` + text(x0 + 30, 326, d, { size: 20 });
      p += `<path d="M${mx - 62} ${my - 4} H${mx + 62}" stroke="${C.green}" stroke-width="2.5"/><path d="${arcPath(mr, mx, my)}" stroke="${C.orange}" stroke-width="2.5" stroke-dasharray="5 5" fill="none"/>`;
      [-55, 0, 55].forEach((a) => { const [x, y] = P(a, mr, mx, my); p += `<circle cx="${f(x)}" cy="${f(y)}" r="7" fill="${C.yellow}" stroke="${C.orange}" stroke-width="2"/>`; });
      body += at(2, 'pop', p, f(0.2 + k * 0.45));
    });
    [0, 1, 2].forEach((k) => { body += glowRect(30 + k * 196, 278, 188, 80, 3, C.green, f(k * 0.35), 14); });
    body += at(3, 'pop', tag(96, 42, '규칙성', KEY, { size: 24 }), 0.4);
    css += `
      .sc-${id} .sun { transform-box: view-box; transform-origin: ${cx}px ${cy}px; transform: rotate(-80deg); }
      @keyframes ${id}-sweep { from { transform: rotate(-80deg); } to { transform: rotate(80deg); } }
      @keyframes ${id}-sweepb { from { transform: rotate(-80deg); } to { transform: rotate(80deg); } }
      @keyframes ${id}-sweepc { 0% { transform: rotate(-80deg); opacity: 0; } 8% { opacity: 1; } 90% { opacity: 1; } 100% { transform: rotate(80deg); opacity: 0; } }
      .on1 .sc-${id} .sun { animation: ${id}-sweep 2s ease-in-out both; }
      .on2 .sc-${id} .sun { animation: ${id}-sweepb 1.4s ease-in-out .2s 1 both; }
      .on3 .sc-${id} .sun { animation: ${id}-sweepc 2.4s linear infinite; }`;
    put('6-1/과학/4/규칙성', svg(id, body, css));
  })();

  // ── 방위: 나침반 바늘이 북쪽을 가리키고, 둘레에 북·동·남·서 ──
  (function () {
    const id = 't61-c4-bangwi';
    let css = base(id);
    const cx = 320, cy = 180, r = 80;
    let body = `<circle cx="${cx}" cy="${cy}" r="${r + 10}" fill="${C.line}" stroke="${C.muted}" stroke-width="3"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="white" stroke="${C.muted}" stroke-width="2"/>`;
    for (let k = 0; k < 16; k++) { const a = rad(k * 22.5), l = k % 4 ? 8 : 16; body += `<path d="M${f(cx + (r - l) * Math.sin(a))} ${f(cy - (r - l) * Math.cos(a))} L${f(cx + r * Math.sin(a))} ${f(cy - r * Math.cos(a))}" stroke="${C.muted}" stroke-width="${k % 4 ? 2 : 3}"/>`; }
    const needle = `<path d="M${cx} ${cy - 64} L${cx + 13} ${cy} L${cx - 13} ${cy} Z" fill="${C.red}" stroke="${C.red}" stroke-width="2" stroke-linejoin="round"/><path d="M${cx} ${cy + 64} L${cx + 13} ${cy} L${cx - 13} ${cy} Z" fill="${C.line}" stroke="${C.muted}" stroke-width="2" stroke-linejoin="round"/>`;
    body += `<g class="needle">${needle}</g><circle cx="${cx}" cy="${cy}" r="7" fill="${C.ink}"/>`;
    // 칸 2: 네 쪽
    const dirs = [['북', 0, -1, KEY], ['동', 1, 0, OK], ['남', 0, 1, OK], ['서', -1, 0, OK]];
    dirs.forEach(([name, dx, dy, col], k) => {
      const x1 = cx + dx * (r + 12), y1 = cy + dy * (r + 12), d = dy ? 18 : 110, bx = cx + dx * (r + 12 + d), byy = cy + dy * (r + 12 + d);
      body += drawPath(`M${x1} ${y1} L${bx} ${byy}`, 2, C.muted, 3, f(0.1 + k * 0.25));
      const lx = bx + dx * 26, ly = byy + dy * 24;
      body += at(2, 'pop', `<circle cx="${lx}" cy="${ly}" r="23" fill="${col[0]}" stroke="${col[1]}" stroke-width="3"/>` + text(lx, ly + 8, name, { size: 22 }), f(0.5 + k * 0.25));
      body += ring(lx, ly, 26, 3, C.green, f(k * 0.3));
    });
    body += at(3, 'pop', tag(548, 52, '방위', KEY, { size: 24 }), 1.0);
    css += `
      .sc-${id} .needle { transform-box: fill-box; transform-origin: center; }
      @keyframes ${id}-swing { 0% { transform: rotate(130deg); } 35% { transform: rotate(-42deg); } 58% { transform: rotate(20deg); } 78% { transform: rotate(-8deg); } 100% { transform: rotate(0deg); } }
      .on1 .sc-${id} .needle { animation: ${id}-swing 2s ease-out both; }`;
    put('6-1/과학/4/방위', svg(id, body, css));
  })();

  // ── 궤도: 인공위성이 지구 둘레를, 지구가 태양 둘레를 돌며 그리는 길 ──
  (function () {
    const id = 't61-c4-gwedo';
    let css = base(id);
    const ex = 180, ey = 186, er = 46, sr = 116;
    const circ = (x, y, rr) => `M${x - rr} ${y} A${rr} ${rr} 0 1 0 ${x + rr} ${y} A${rr} ${rr} 0 1 0 ${x - rr} ${y}`;
    let body = `<path d="${circ(ex, ey, sr)}" stroke="${C.line}" stroke-width="2.5" stroke-dasharray="5 7" fill="none"/>`;
    body += drawPath(circ(ex, ey, sr), 2, C.purple, 5, 0.1);
    body += globeFace(ex, ey, er) + text(ex, ey + 8, '지구', { size: 20 });
    const sat = `<rect x="-8" y="-7" width="16" height="14" rx="2" fill="${C.line}" stroke="${C.ink}" stroke-width="2"/><rect x="-30" y="-5" width="18" height="10" fill="${C.sky}" stroke="${C.blue}" stroke-width="2"/><rect x="12" y="-5" width="18" height="10" fill="${C.sky}" stroke="${C.blue}" stroke-width="2"/><path d="M-12 0 H-8 M8 0 H12" stroke="${C.ink}" stroke-width="2"/>`;
    body += `<g>${sat}<animateMotion dur="6s" repeatCount="indefinite" path="${circ(ex, ey, sr)}"/></g>`;
    body += at(1, 'pop', tag(70, 40, '인공위성', GRAY, { size: 18 }), 0.3);
    body += at(2, 'pop', tag(310, 322, '궤도', KEY, { size: 22 }), 1.2);
    // 칸 3: 태양과 지구
    const sx = 486, sy = 186, or = 110;
    let right = `<path d="${circ(sx, sy, or)}" stroke="${C.line}" stroke-width="2.5" stroke-dasharray="5 7" fill="none"/>` + sunIcon(sx, sy, 26) + text(sx, sy + 68, '태양', { size: 20 });
    right += `<g><circle r="13" fill="${C.sky}" stroke="${C.blue}" stroke-width="2.5"/>${text(0, -20, '지구', { size: 18 })}<animateMotion dur="9s" repeatCount="indefinite" path="${circ(sx, sy, or)}"/></g>`;
    body += at(3, 'fin', right);
    body += drawPath(circ(sx, sy, or), 3, C.purple, 5, 0.6);
    body += at(3, 'pop', tag(596, 322, '궤도', KEY, { size: 22 }), 1.5);
    put('6-1/과학/4/궤도', svg(id, body, css));
  })();
})(typeof window !== 'undefined' ? window : globalThis);
