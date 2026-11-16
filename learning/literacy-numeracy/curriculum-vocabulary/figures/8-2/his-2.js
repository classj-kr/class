// 역사 8-2(중학교 역사② 근현대) 낱말 도식 2: 지도 없이 짜임·흐름으로 뜻이 잡히는 낱말.
// 신분 층, 권력 짜임, 저울, 세 갈래, 시간 띠, 원인 → 결과 흐름. 잔인한 장면은 그리지 않고 까닭과 결과만 보인다.
(function (root) {
  'use strict';
  const { C, svg, text, put } = root.FigureKit;
  const KEY = (u, w) => `8-2/역사/${u}/${w}`;
  const f = (n) => Math.round(n * 10) / 10;
  const dl = (s) => (s ? ` style="animation-delay:${s}s"` : '');
  const g = (cls, inner, s = 0) => `<g class="${cls}"${dl(s)}>${inner}</g>`;
  const at = (n, kind, inner, s = 0) => `<g class="b${n}">${g(`${kind} ${kind}${n}`, inner, s)}</g>`;
  const shown = (n, inner, hide) => `<g class="b${n}${hide ? ' h' + hide : ''}">${inner}</g>`;
  const tw = (s, size) => [...String(s)].reduce((a, c) => a + (/[가-힣·民族權生]/.test(c) ? 1 : c === ' ' ? 0.3 : 0.6), 0) * size;
  const HOT = [C.peach, C.orange], COLD = [C.sky, C.blue], OK = [C.mint, C.green], OLD = [C.lilac, C.purple], RED = ['#f6d5d1', C.red], PLAIN = ['white', C.muted], GRAY = ['#eceeec', C.muted];
  const tag = (cx, cy, label, [fill, stroke] = OK, { size = 18 } = {}) => {
    const w = Math.round(tw(label, size) + size * 1.2), h = Math.round(size * 1.65);
    return `<g><rect x="${f(cx - w / 2)}" y="${f(cy - h / 2)}" width="${w}" height="${h}" rx="${h / 2}" fill="${fill}" stroke="${stroke}" stroke-width="2.5"/>${text(f(cx), f(cy + size * 0.36), label, { size })}</g>`;
  };
  // 네모 칸(글 한두 줄)
  const card = (cx, cy, w, h, lines, [fill, stroke] = PLAIN, { size = 20 } = {}) => {
    const ls = Array.isArray(lines) ? lines : [lines], y0 = cy - ((ls.length - 1) * size * 1.2) / 2 + size * 0.36;
    return `<g><rect x="${f(cx - w / 2)}" y="${f(cy - h / 2)}" width="${w}" height="${h}" rx="12" fill="${fill}" stroke="${stroke}" stroke-width="2.5"/>${ls.map((l, i) => text(f(cx), f(y0 + i * size * 1.2), l, { size })).join('')}</g>`;
  };
  const head = (x, y, ang, color, w = 4) => {
    const l = 8 + w * 1.4, p = (d) => `${f(x - l * Math.cos(ang + d))} ${f(y - l * Math.sin(ang + d))}`;
    return `<path d="M${p(-0.5)} L${f(x)} ${f(y)} L${p(0.5)}" stroke="${color}" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  };
  const ptsD = (pts) => 'M' + pts.map((p) => `${f(p[0])} ${f(p[1])}`).join(' L');
  const drawArrow = (pts, color, n, { w = 5, delay = 0, dur = 1 } = {}) => {
    const [a, b] = pts.slice(-2), ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
    const end = [b[0] - w * Math.cos(ang), b[1] - w * Math.sin(ang)];
    return `<g class="b${n}"><path class="draw draw${n}" pathLength="1" style="transition-duration:${dur}s;transition-delay:${f(delay)}s" d="${ptsD([...pts.slice(0, -1), end])}" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" fill="none"/><g class="fin fin${n}" style="animation-delay:${f(delay + dur * 0.85)}s">${head(b[0], b[1], ang, color, w)}</g></g>`;
  };
  const drawLine = (d, color, n, { w = 5, delay = 0, dur = 1, cls = '' } = {}) =>
    `<g class="b${n}"><path class="draw draw${n} ${cls}" pathLength="1" style="transition-duration:${dur}s;transition-delay:${f(delay)}s" d="${d}" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" fill="none"/></g>`;
  const glowRect = (x, y, w, h, n, color = C.green, delay = 0, rx = 12) =>
    `<g class="b${n}"><rect class="flash flash${n}"${dl(delay)} x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="${rx}" fill="none" stroke="${color}" stroke-width="5"/></g>`;
  const ring = (cx, cy, r, n, color = C.green, s = 0) => `<g class="b${n}"><circle class="ring ring${n}"${dl(s)} cx="${f(cx)}" cy="${f(cy)}" r="${r}" fill="none" stroke="${color}" stroke-width="4"/></g>`;
  const trip = (a, b, inner, { dur = 3.2, delay = 0 } = {}) =>
    `<g transform="translate(${f(a[0])} ${f(a[1])})"><g class="trip" style="--dx:${f(b[0] - a[0])}px;--dy:${f(b[1] - a[1])}px;animation-duration:${dur}s;animation-delay:${delay}s">${inner}</g></g>`;
  const mvStyle = (pts) => {
    const out = [];
    for (let n = 1; n <= 5; n++) { const p = pts[Math.min(n, pts.length) - 1]; out.push(`--x${n}:${f(p[0])}px;--y${n}:${f(p[1])}px`); }
    return out.join(';');
  };
  const xMark = (x, y, r = 10, color = C.red) => `<path d="M${f(x - r)} ${f(y - r)} L${f(x + r)} ${f(y + r)} M${f(x + r)} ${f(y - r)} L${f(x - r)} ${f(y + r)}" stroke="white" stroke-width="${r * 0.8}" stroke-linecap="round"/><path d="M${f(x - r)} ${f(y - r)} L${f(x + r)} ${f(y + r)} M${f(x + r)} ${f(y - r)} L${f(x - r)} ${f(y + r)}" stroke="${color}" stroke-width="${r * 0.45}" stroke-linecap="round"/>`;
  const crown = (x, y, sc = 1) => `<g transform="translate(${f(x)} ${f(y)}) scale(${sc})"><path d="M-22 12 L-25 -12 L-11 0 L0 -18 L11 0 L25 -12 L22 12 Z" fill="${C.yellow}" stroke="${C.orange}" stroke-width="3" stroke-linejoin="round"/><circle cx="0" cy="-18" r="3.5" fill="${C.red}"/></g>`;
  const ship = (color = C.blue) => `<path d="M-26 -2 H26 L17 12 H-17 Z" fill="${color}" stroke="white" stroke-width="2" stroke-linejoin="round"/><path d="M-9 -2 V-18 H9 V-2 M-3 -18 V-26" stroke="${color}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
  const person = (x, y, skin, sc = 1) => `<g transform="translate(${f(x)} ${f(y)}) scale(${sc})"><circle cx="0" cy="-46" r="14" fill="${skin}" stroke="${C.ink}" stroke-width="2"/><path d="M-18 0 V-20 Q-18 -30 -8 -30 H8 Q18 -30 18 -20 V0 Z" fill="${skin}" stroke="${C.ink}" stroke-width="2" stroke-linejoin="round"/></g>`;
  const candle = (x, y) => `<g transform="translate(${f(x)} ${f(y)})"><rect x="-9" y="-6" width="18" height="36" rx="3" fill="white" stroke="${C.muted}" stroke-width="2.5"/><g class="twk"><path d="M0 -26 C8 -16 7 -8 0 -8 C-7 -8 -8 -16 0 -26 Z" fill="${C.yellow}" stroke="${C.orange}" stroke-width="2"/></g></g>`;
  const doc = (x, y, color = C.ink, sc = 1) => `<g transform="translate(${f(x)} ${f(y)}) scale(${sc})"><path d="M-20 -26 H12 L20 -18 V26 H-20 Z" fill="white" stroke="${color}" stroke-width="2.5" stroke-linejoin="round"/><path d="M-12 -12 H12 M-12 -2 H12 M-12 8 H12 M-12 18 H4" stroke="${color}" stroke-width="2.5" stroke-linecap="round"/></g>`;

  const base = (id) => {
    let s = `
    .sc-${id} .pop, .sc-${id} .pulse, .sc-${id} .ring, .sc-${id} .twk { transform-box: fill-box; transform-origin: center; }
    .sc-${id} .twk { animation: ${id}-twk 1.6s ease-in-out infinite alternate; }
    .sc-${id} .mar { animation: ${id}-mar .7s linear infinite; }
    .sc-${id} .draw { stroke-dasharray: 1; stroke-dashoffset: 1; transition: stroke-dashoffset 1s ease-in-out; }
    .sc-${id} .mv { transform: translate(var(--x1), var(--y1)); transition: transform 1.2s ease-in-out, opacity .6s ease; }
    .sc-${id} .trip { opacity: 0; animation: ${id}-trip 3.2s ease-in-out infinite; }
    .sc-${id} .ring { opacity: 0; }
    @keyframes ${id}-pop { 0% { opacity: 0; transform: scale(.3); } 70% { opacity: 1; transform: scale(1.12); } 100% { opacity: 1; transform: scale(1); } }
    @keyframes ${id}-fin { from { opacity: 0; } to { opacity: 1; } }
    @keyframes ${id}-rise { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
    @keyframes ${id}-drop { from { opacity: 0; transform: translateY(-40px); } to { opacity: 1; transform: none; } }
    @keyframes ${id}-pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.12); } }
    @keyframes ${id}-flash { 0% { opacity: 0; } 20% { opacity: 1; } 40% { opacity: .3; } 60% { opacity: 1; } 80% { opacity: .3; } 100% { opacity: 1; } }
    @keyframes ${id}-ring { 0% { opacity: .9; transform: scale(1); } 100% { opacity: 0; transform: scale(1.8); } }
    @keyframes ${id}-twk { from { opacity: .4; } to { opacity: 1; } }
    @keyframes ${id}-mar { from { stroke-dashoffset: 24; } to { stroke-dashoffset: 0; } }
    @keyframes ${id}-trip { 0% { opacity: 0; transform: translate(0, 0); } 12%, 82% { opacity: 1; } 100% { opacity: 0; transform: translate(var(--dx), var(--dy)); } }
    `;
    for (let n = 1; n <= 5; n++) s += `
    .on${n} .sc-${id} .pop${n} { animation: ${id}-pop .5s ease-out both; }
    .on${n} .sc-${id} .fin${n} { animation: ${id}-fin .6s ease-out both; }
    .on${n} .sc-${id} .rise${n} { animation: ${id}-rise .45s ease-out both; }
    .on${n} .sc-${id} .drop${n} { animation: ${id}-drop .55s ease-out both; }
    .on${n} .sc-${id} .pulse${n} { animation: ${id}-pulse .7s ease-in-out .3s 2; }
    .on${n} .sc-${id} .flash${n} { animation: ${id}-flash 1.4s ease-in-out both; }
    .on${n} .sc-${id} .ring${n} { animation: ${id}-ring 1s ease-out .2s 2; }
    .on${n} .sc-${id} .draw${n} { stroke-dashoffset: 0; }`;
    for (let n = 2; n <= 5; n++) s += `
    .on${n} .sc-${id} .mv { transform: translate(var(--x${n}), var(--y${n})); }`;
    return s;
  };

  // ════ 5 제국주의와 국민 국가 건설 운동 ════

  // ── 입헌 군주제: 왕이 마음대로 → 헌법이 왕을 묶음 → 국민이 뽑은 의회·총리가 나라 일 → 이름 ──
  (function () {
    const id = 't82-h5-ipheon';
    let css = base(id);
    let body = '';
    const PEOPLE = [230, 280, 330, 380, 430];
    PEOPLE.forEach((x) => { body += person(x, 330, '#e8c9a8', 0.72); });
    body += text(330, 352, '국민', { size: 18 });
    // 왕(오른쪽 위)
    body += `<g class="kg"><g class="kgi">${crown(470, 86, 1.5)}</g></g>`;
    body += text(470, 140, '왕', { size: 22 });
    body += `<g class="b1 h2">${[260, 330, 400].map((x) => `<path d="M470 156 L${x} 268" stroke="${C.red}" stroke-width="4" stroke-dasharray="10 8" class="mar"/>${head(x, 268, Math.atan2(268 - 156, x - 470), C.red, 4)}`).join('')}</g>`;
    body += `<g class="b1 h2">${g('pop pop1', tag(560, 206, '마음대로', RED), 0.6)}</g>`;
    // 2칸: 헌법이 왕을 둘러 묶음
    body += at(2, 'pop', `<rect x="396" y="34" width="148" height="122" rx="14" fill="none" stroke="${C.purple}" stroke-width="5"/>`);
    body += at(2, 'pop', tag(470, 34, '헌법', OLD, { size: 20 }), 0.3);
    body += at(2, 'pop', doc(590, 92, C.purple, 1), 0.6);
    // 3칸: 국민 → 의회 → 총리
    body += at(3, 'pop', card(140, 196, 150, 56, '의회', COLD, { size: 22 }), 0.4);
    body += at(3, 'pop', card(140, 76, 150, 56, '총리', COLD, { size: 22 }), 1.2);
    body += drawArrow([[250, 280], [190, 228]], C.blue, 3, { w: 5, dur: 0.6 });
    body += at(3, 'pop', tag(262, 236, '선거', COLD), 0.4);
    body += drawArrow([[140, 166], [140, 108]], C.blue, 3, { w: 5, delay: 0.8, dur: 0.5 });
    body += drawArrow([[218, 76], [252, 76]], C.blue, 3, { w: 4, delay: 1.3, dur: 0.3 });
    body += at(3, 'pop', card(312, 76, 110, 50, '나라 일', PLAIN, { size: 20 }), 1.6);
    body += at(4, 'pop', tag(560, 300, '입헌 군주제', OLD, { size: 22 }), 0.2);
    body += glowRect(396, 34, 148, 122, 4, C.purple, 0.4, 14);
    css += `
      .sc-${id} .kgi { transform-box: fill-box; transform-origin: center; transition: transform 1s ease .2s; }
      .on2 .sc-${id} .kgi { transform: scale(.72); }`;
    put(KEY(5, '입헌 군주제'), svg(id, body, css));
  })();

  // ── 크리오요: 맨 위 본국 출신 → 그 아래 크리오요 → 높은 관리 자리는 막힘 → 독립운동, 이름 ──
  (function () {
    const id = 't82-h5-criollo';
    let css = base(id);
    let body = '';
    const CX = 250, ROWS = [[78, 210, '본국 출신 백인', HOT], [150, 290, '크리오요', OK], [222, 370, '혼혈인', GRAY], [294, 450, '원주민·흑인 노예', GRAY]];
    const bar = ([y, w, label, [fill, stroke]]) => `<rect x="${CX - w / 2}" y="${y - 28}" width="${w}" height="56" rx="10" fill="${fill}" stroke="${stroke}" stroke-width="2.5"/>${text(CX, y + 7, label, { size: 20 })}`;
    body += at(1, 'drop', bar(ROWS[0]));
    body += at(2, 'drop', bar(ROWS[1]));
    body += at(2, 'fin', bar(ROWS[2]) + bar(ROWS[3]), 0.5);
    // 1칸: 에스파냐에서 배가 옴
    body += `<g class="b1"><g transform="translate(66 50)"><g class="sail">${ship(C.orange)}</g></g></g>`;
    css += `.on1 .sc-${id} .sail { animation: ${id}-sail 1.2s ease-out both; } @keyframes ${id}-sail { from { transform: translateX(150px); } to { transform: none; } }`;
    body += at(1, 'pop', tag(68, 94, '에스파냐에서', HOT), 1);
    body += at(2, 'pop', tag(530, 196, '식민지에서 태어남', OK), 0.6);
    body += at(2, 'fin', `<path d="M${CX + 150} 150 L440 186" stroke="${C.green}" stroke-width="2.5" stroke-dasharray="5 5"/>`, 0.6);
    // 3칸: 높은 관리 자리로 오르려다 막힘
    body += at(3, 'pop', tag(500, 40, '높은 관리 자리', RED), 0.1);
    body += at(3, 'fin', `<path d="M${CX + 105} 66 L428 44" stroke="${C.red}" stroke-width="2.5" stroke-dasharray="5 5"/>`, 0.1);
    body += drawArrow([[CX + 130, 120], [CX + 190, 76]], C.green, 3, { w: 6, dur: 0.5, delay: 0.3 });
    body += at(3, 'pop', `<rect x="${CX + 150}" y="78" width="80" height="8" rx="4" fill="${C.red}" transform="rotate(-36 ${CX + 190} 82)"/>`, 0.8);
    body += at(3, 'pop', xMark(CX + 168, 100, 10), 1);
    body += at(3, 'pop', `<g transform="translate(${CX + 70} 150)">${[0, 1, 2].map((i) => `<ellipse cx="0" cy="${-i * 7}" rx="13" ry="5" fill="${C.yellow}" stroke="${C.orange}" stroke-width="2"/>`).join('')}</g>`, 0.3);
    // 4칸: 독립운동
    body += drawArrow([[CX + 145, 150], [470, 270]], C.green, 4, { w: 5, dur: 0.6 });
    body += at(4, 'pop', tag(540, 284, '독립운동', OK, { size: 20 }), 0.6);
    body += glowRect(CX - 145, 122, 290, 56, 4, C.green, 0.2, 10);
    body += at(4, 'pop', tag(540, 330, '크리오요', OK, { size: 22 }), 1);
    put(KEY(5, '크리오요'), svg(id, body, css));
  })();

  // ── 인종주의: 생김새가 여러 가지인 사람들 → 피부색으로 매긴 사다리 → 지배를 옳은 일처럼 꾸밈 → 틀렸다 ──
  (function () {
    const id = 't82-h5-racism';
    let css = base(id);
    let body = '';
    const SKIN = ['#f3d8be', '#c9986a', '#7c5233'];
    const GROUND = 300, LX = 330;
    body += `<path d="M60 ${GROUND} H600" stroke="${C.line}" stroke-width="4" stroke-linecap="round"/>`;
    // 사다리(2~3칸)
    const RUNG = [110, 190, 270];
    body += `<g class="b2"><g class="lad">${`<path d="M${LX - 40} 70 V${GROUND} M${LX + 40} 70 V${GROUND}" stroke="${C.muted}" stroke-width="7" stroke-linecap="round"/>` + RUNG.map((y) => `<path d="M${LX - 40} ${y} H${LX + 40}" stroke="${C.muted}" stroke-width="7" stroke-linecap="round"/>`).join('')}</g></g>`;
    body += `<g class="h4">${at(2, 'pop', tag(LX + 120, 110, '위', PLAIN) + tag(LX + 120, 270, '아래', PLAIN), 1)}</g>`;
    // 사람 셋: 1칸 땅 위 나란히 → 2·3칸 사다리 칸 → 4칸 다시 나란히
    const HOME = [[180, GROUND], [330, GROUND], [480, GROUND]];
    SKIN.forEach((s, i) => {
      const onL = [LX, RUNG[i]];
      body += `<g class="mv" style="${mvStyle([HOME[i], onL, onL, HOME[i]])}">${person(0, 0, s, 0.9)}</g>`;
    });
    // 3칸: 맨 위에서 아래로 '지배'
    body += `<g class="h4">${drawArrow([[LX - 70, 74], [LX - 70, 262]], C.red, 3, { w: 5, dur: 0.8 })}${at(3, 'pop', tag(LX - 150, 168, '지배', RED, { size: 20 }), 0.6)}${at(3, 'pop', tag(120, 60, '제국주의', HOT), 1)}</g>`;
    // 4칸: 틀렸다
    body += at(4, 'pop', `<path d="M${LX - 70} 80 L${LX + 70} 250 M${LX + 70} 80 L${LX - 70} 250" stroke="${C.red}" stroke-width="10" stroke-linecap="round" opacity=".85"/>`, 0.1);
    body += at(4, 'pop', tag(LX, 50, '틀렸다', RED, { size: 24 }), 0.3);
    body += at(4, 'pop', tag(LX, 336, '피부색과 능력은 상관없음', OK), 1.2);
    css += `
      .sc-${id} .mv { transition: transform 1.2s ease-in-out .2s; }
      .sc-${id} .lad { transition: opacity 1s ease .6s; }
      .on4 .sc-${id} .lad { opacity: .35; }`;
    put(KEY(5, '인종주의'), svg(id, body, css));
  })();

  // ── 불평등 조약: 고른 저울 → 군함을 앞세워 억지로 → 한쪽에만 이득인 조항이 쌓여 기움 → 이름 ──
  (function () {
    const id = 't82-h5-unequal';
    let css = base(id);
    const PX = 320, PY = 120, L = 190;
    let body = '';
    body += `<path d="M${PX} ${PY} V300 M${PX - 60} 300 H${PX + 60}" stroke="${C.ink}" stroke-width="7" stroke-linecap="round"/><path d="M${PX - 14} ${PY - 4} L${PX} ${PY - 22} L${PX + 14} ${PY - 4} Z" fill="${C.ink}"/>`;
    body += `<g class="beam"><path d="M${PX - L} ${PY} H${PX + L}" stroke="${C.ink}" stroke-width="7" stroke-linecap="round"/></g>`;
    const pan = (x, label, cls, extra = '') => `<g class="${cls}"><path d="M${x} ${PY} L${x - 56} ${PY + 80} M${x} ${PY} L${x + 56} ${PY + 80}" stroke="${C.muted}" stroke-width="2.5"/><path d="M${x - 70} ${PY + 80} H${x + 70} Q${x + 60} ${PY + 104} ${x} ${PY + 104} Q${x - 60} ${PY + 104} ${x - 70} ${PY + 80} Z" fill="white" stroke="${C.ink}" stroke-width="3"/>${extra}${text(x, PY + 136, label, { size: 20 })}</g>`;
    const loads = at(3, 'drop', tag(PX - L, PY + 30, '영사 재판권', RED), 0.1) + at(3, 'drop', tag(PX - L, PY + 62, '관세', RED), 0.5);
    body += pan(PX - L, '힘센 나라', 'panL', loads);
    body += pan(PX + L, '약한 나라', 'panR');
    body += at(1, 'pop', `<g transform="translate(${PX} 46)"><path d="M-30 -22 H22 L30 -14 V22 H-30 Z" fill="white" stroke="${C.ink}" stroke-width="2.5" stroke-linejoin="round"/>${text(0, 8, '조약', { size: 20 })}</g>`);
    body += `<g class="b1 h2">${g('pop pop1', tag(PX, 336, '고르게', OK, { size: 20 }), 0.6)}</g>`;
    // 2칸: 군함을 앞세워 억지로
    body += `<g class="b2"><g class="mv" style="${mvStyle([[-60, 332], [56, 332], [56, 332], [56, 332]])}">${ship(C.red)}</g></g>`;
    body += drawArrow([[100, 338], [460, 338]], C.red, 2, { w: 5, delay: 0.6, dur: 0.8 });
    body += at(2, 'pop', tag(540, 338, '억지로', RED), 1.2);
    // 4칸
    body += at(4, 'pop', tag(110, 36, '불평등 조약', RED, { size: 22 }), 0.2);
    const tilt = 12, dy = Math.round(L * Math.sin((tilt * Math.PI) / 180));
    css += `
      .sc-${id} .beam { transform-box: view-box; transform-origin: ${PX}px ${PY}px; transition: transform 1.2s ease-in-out .7s; }
      .sc-${id} .panL, .sc-${id} .panR { transition: transform 1.2s ease-in-out .7s; }
      .on3 .sc-${id} .beam { transform: rotate(-${tilt}deg); }
      .on3 .sc-${id} .panL { transform: translateY(${dy}px); }
      .on3 .sc-${id} .panR { transform: translateY(-${dy}px); }`;
    put(KEY(5, '불평등 조약'), svg(id, body, css));
  })();

  // ── 아편 전쟁: 차·은(18세기) → 면직물·아편(19세기) → 은이 청에서 빠져나가 청이 아편을 막음 → 1840 군함 ──
  (function () {
    const id = 't82-h5-opium';
    let css = base(id);
    let body = '';
    const UK = [120, 70], IN = [150, 290], QG = [520, 180];
    // a → b 를 옆으로 off 만큼 옮긴 선(끝은 칸 가장자리에서 r 만큼 떨어지게)
    const edge = (a, b, off, ra = 50, rb = 50) => {
      const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L, nx = -uy * off, ny = ux * off;
      return [[a[0] + ux * ra + nx, a[1] + uy * ra + ny], [b[0] - ux * rb + nx, b[1] - uy * rb + ny]];
    };
    const flow = (pts, color) => {
      const [a, b] = pts, ang = Math.atan2(b[1] - a[1], b[0] - a[0]), e = [b[0] - 5 * Math.cos(ang), b[1] - 5 * Math.sin(ang)];
      return `<path class="mar" d="${ptsD([a, e])}" stroke="${color}" stroke-width="5" stroke-dasharray="14 10" stroke-linecap="round" fill="none"/>${head(b[0], b[1], ang, color, 5)}`;
    };
    const lbl = (pts, off, label, col) => { const m = [(pts[0][0] + pts[1][0]) / 2, (pts[0][1] + pts[1][1]) / 2], dx = pts[1][0] - pts[0][0], dy = pts[1][1] - pts[0][1], L = Math.hypot(dx, dy); return tag(m[0] - (dy / L) * off, m[1] + (dx / L) * off, label, col); };
    const TEA = edge(QG, UK, 16, 64, 66), SIL1 = edge(UK, QG, 16, 66, 64), COT = edge(UK, IN, 14, 32, 32), OPI = edge(IN, QG, 14, 66, 64), SIL2 = edge(QG, IN, 14, 64, 66);
    body += shown(1, flow(TEA, C.green) + lbl(TEA, 26, '차', OK));
    body += shown(1, flow(SIL1, C.muted) + lbl(SIL1, 26, '은', PLAIN), 2);
    body += shown(2, flow(COT, C.blue) + lbl(COT, 40, '면직물', COLD));
    body += shown(2, flow(OPI, C.purple) + lbl(OPI, 28, '아편', OLD));
    body += shown(3, flow(SIL2, C.muted) + lbl(SIL2, 26, '은', PLAIN));
    const st = [OPI[0][0] + (OPI[1][0] - OPI[0][0]) * 0.78, OPI[0][1] + (OPI[1][1] - OPI[0][1]) * 0.78];
    body += at(3, 'pop', `<circle cx="${f(st[0])}" cy="${f(st[1])}" r="17" fill="white" stroke="${C.red}" stroke-width="5"/><path d="M${f(st[0] - 12)} ${f(st[1] + 12)} L${f(st[0] + 12)} ${f(st[1] - 12)}" stroke="${C.red}" stroke-width="5"/>`, 0.9);
    body += at(3, 'pop', tag(QG[0], QG[1] + 62, '광저우에서 막음', RED), 1.1);
    // 칸(나라)
    body += card(UK[0], UK[1], 120, 58, '영국', COLD, { size: 24 }) + card(IN[0], IN[1], 120, 58, '인도', OLD, { size: 24 }) + card(QG[0], QG[1], 120, 58, '청', RED, { size: 24 });
    // 4칸: 군함
    const S0 = [IN[0] + 80, IN[1] + 34], S1 = [QG[0] - 10, QG[1] + 96];
    body += shown(4, `<path class="mar" d="${ptsD([S0, S1])}" stroke="${C.red}" stroke-width="4" stroke-dasharray="10 8" fill="none"/>` + trip(S0, S1, ship(C.red), { dur: 2.2 }));
    body += at(4, 'pop', tag(540, 338, '아편 전쟁 1840', RED, { size: 22 }), 0.8);
    body += `<g class="h2">${at(1, 'pop', tag(560, 40, '18세기', PLAIN), 0.2)}</g>`;
    body += at(2, 'pop', tag(560, 40, '19세기', PLAIN), 0.2);
    put(KEY(5, '아편 전쟁'), svg(id, body, css));
  })();

  // ── 삼민주의: '민' 셋 → 민족(나라의 독립) → 민권·민생 → 세 원칙 ──
  (function () {
    const id = 't82-h5-sanmin';
    let css = base(id);
    let body = '';
    const TOP = [320, 62], XS = [120, 320, 520], CY = 210;
    body += card(TOP[0], TOP[1], 170, 58, '삼민주의', HOT, { size: 24 });
    const tile = (x, rest, color) => `<rect x="${x - 70}" y="${CY - 34}" width="140" height="68" rx="12" fill="white" stroke="${color}" stroke-width="3"/><text x="${x}" y="${CY + 10}" text-anchor="middle" font-size="28" font-weight="800"><tspan fill="${C.orange}">민</tspan><tspan fill="${C.ink}">${rest}</tspan></text>`;
    const NAMES = ['족', '권', '생'], COLORS = [C.green, C.blue, C.purple];
    XS.forEach((x, i) => {
      body += `<path d="M${TOP[0]} ${TOP[1] + 29} L${x} ${CY - 34}" stroke="${C.line}" stroke-width="3"/>`;
      body += at(1, 'pop', `<rect x="${x - 70}" y="${CY - 34}" width="140" height="68" rx="12" fill="white" stroke="${C.line}" stroke-width="3"/><text x="${x}" y="${CY + 10}" text-anchor="middle" font-size="28" font-weight="800" fill="${C.orange}">민</text>`, 0.2 + i * 0.2);
    });
    body += drawLine(`M${TOP[0]} ${TOP[1] + 29} L${XS[0]} ${CY - 34}`, C.green, 2, { w: 5, dur: 0.6 });
    body += at(2, 'pop', tile(XS[0], NAMES[0], C.green), 0.5);
    body += drawLine(`M${TOP[0]} ${TOP[1] + 29} L${XS[1]} ${CY - 34}`, C.blue, 3, { w: 5, dur: 0.5 });
    body += drawLine(`M${TOP[0]} ${TOP[1] + 29} L${XS[2]} ${CY - 34}`, C.purple, 3, { w: 5, dur: 0.5, delay: 0.7 });
    body += at(3, 'pop', tile(XS[1], NAMES[1], C.blue), 0.4) + at(3, 'pop', tile(XS[2], NAMES[2], C.purple), 1.1);
    // 아이콘과 뜻
    const flag = (x) => `<g transform="translate(${x} 280)"><path d="M-14 22 V-22" stroke="${C.ink}" stroke-width="3.5" stroke-linecap="round"/><path d="M-12 -22 H18 L12 -12 L18 -2 H-12 Z" fill="${C.green}" stroke="${C.green}" stroke-width="2" stroke-linejoin="round"/></g>`;
    const ballot = (x) => `<g transform="translate(${x} 284)"><rect x="-20" y="-6" width="40" height="28" rx="4" fill="white" stroke="${C.blue}" stroke-width="3"/><path d="M-10 -6 H10" stroke="${C.blue}" stroke-width="4"/><rect x="-7" y="-24" width="14" height="20" fill="${C.sky}" stroke="${C.blue}" stroke-width="2.5"/></g>`;
    const bowl = (x) => `<g transform="translate(${x} 284)"><path d="M-22 -4 H22 Q20 20 0 20 Q-20 20 -22 -4 Z" fill="white" stroke="${C.purple}" stroke-width="3"/><path d="M-14 -4 Q-10 -16 0 -16 Q10 -16 14 -4" fill="white" stroke="${C.purple}" stroke-width="2.5"/></g>`;
    body += at(2, 'pop', flag(XS[0] - 64), 0.9) + at(2, 'fin', text(XS[0] + 18, 292, '나라의 독립', { size: 18 }), 0.9);
    body += at(3, 'pop', ballot(XS[1] - 64), 0.8) + at(3, 'fin', text(XS[1] + 18, 292, '국민의 권리', { size: 18 }), 0.8);
    body += at(3, 'pop', bowl(XS[2] - 66), 1.4) + at(3, 'fin', text(XS[2] + 16, 292, '고른 살림', { size: 18 }), 1.4);
    body += at(4, 'pop', tag(320, 340, '민족 · 민권 · 민생', HOT, { size: 20 }), 0.3);
    XS.forEach((x, i) => { body += glowRect(x - 70, CY - 34, 140, 68, 4, COLORS[i], 0.2 + i * 0.25, 12); });
    put(KEY(5, '삼민주의'), svg(id, body, css));
  })();

  // ════ 6 세계 대전과 사회 변동 ════

  // ── 블록 경제: 대공황으로 팔리지 않음 → 본국·식민지를 한 덩어리로 → 다른 나라 상품은 관세로 막음 → 이름 ──
  (function () {
    const id = 't82-h6-bloc';
    let css = base(id);
    let body = '';
    const O = [230, 180], COL = [[230, 84], [146, 230], [314, 230]];
    const box = (color) => `<rect x="-11" y="-10" width="22" height="20" rx="3" fill="${color}" stroke="white" stroke-width="2"/>`;
    const factory = `<path d="M-34 24 V-6 L-18 -16 V-6 L-2 -16 V-6 L14 -16 V-28 H26 V24 Z" fill="white" stroke="${C.ink}" stroke-width="3" stroke-linejoin="round"/>`;
    body += `<g transform="translate(${O[0]} ${O[1]})">${factory}</g>` + text(O[0], O[1] + 52, '본국', { size: 20 });
    COL.forEach(([x, y]) => { body += `<circle cx="${x}" cy="${y}" r="30" fill="${C.mint}" stroke="${C.green}" stroke-width="2.5"/>` + text(x, y + 7, '식민지', { size: 18 }); });
    // 1칸: 팔리지 않고 쌓이는 상자
    body += `<g class="b1 h2">${[0, 1, 2].map((i) => g('drop drop1', `<g transform="translate(${O[0] + 50} ${O[1] + 14 - i * 22})">${box(C.orange)}</g>`, 0.3 + i * 0.3)).join('')}</g>`;
    body += `<g class="b1 h2">${g('pop pop1', tag(O[0] + 4, 30, '대공황 1929', RED), 0.2)}</g>`;
    // 2칸: 한 덩어리로 묶는 울타리
    body += drawLine(`M${O[0] + 146} ${O[1]} A146 146 0 1 1 ${O[0] + 146} ${O[1] - 0.1}`, C.orange, 2, { w: 7, dur: 1 });
    body += COL.map(([x, y], i) => shown(2, trip([O[0] + (x - O[0]) * 0.25, O[1] + (y - O[1]) * 0.25], [x + (O[0] - x) * 0.3, y + (O[1] - y) * 0.3], box(C.orange), { dur: 2, delay: i * 0.4 }))).join('');
    body += at(2, 'pop', tag(O[0], 344, '본국 + 식민지 = 한 덩어리', HOT), 1);
    // 3칸: 다른 나라 상품이 튕겨 나감
    body += `<circle cx="560" cy="190" r="44" fill="white" stroke="${C.blue}" stroke-width="3"/>` + text(560, 197, '다른 나라', { size: 18 });
    body += `<g class="b3">${[146, 214].map((y, i) => `<g transform="translate(500 ${y})"><g class="bounce"${dl(i * 0.6)}>${box(C.blue)}</g></g>`).join('')}</g>`;
    body += at(3, 'pop', `<rect x="386" y="126" width="20" height="110" rx="4" fill="${C.red}"/>`, 0.2);
    body += at(3, 'pop', tag(470, 80, '관세로 막음', RED), 0.6);
    body += at(4, 'pop', tag(560, 300, '블록 경제', HOT, { size: 22 }), 0.2);
    body += `<g class="b4"><circle class="flash flash4" cx="${O[0]}" cy="${O[1]}" r="146" fill="none" stroke="${C.orange}" stroke-width="10" opacity=".6"/></g>`;
    css += `
      .sc-${id} .bounce { animation: ${id}-bounce 1.8s ease-in-out infinite; }
      @keyframes ${id}-bounce { 0% { transform: translateX(30px); opacity: 0; } 15% { opacity: 1; } 50% { transform: translateX(-90px); } 60% { transform: translateX(-70px); } 100% { transform: translateX(30px); opacity: 0; } }`;
    put(KEY(6, '블록 경제'), svg(id, body, css));
  })();

  // ── 국공 합작: 1924 처음 손잡음 → 1927 깨짐 → 1937 다시 손잡음 → 1949 공산당 승리 ──
  (function () {
    const id = 't82-h6-gukgong';
    let css = base(id);
    let body = '';
    const X = { 1924: 110, 1927: 220, 1937: 330, 1945: 450, 1949: 560 };
    const AX = 316;
    body += `<path d="M40 ${AX} H610" stroke="${C.ink}" stroke-width="3"/>`;
    Object.entries(X).forEach(([yr, x]) => { body += `<path d="M${x} ${AX - 8} V${AX + 8}" stroke="${C.ink}" stroke-width="3"/>` + text(x, AX + 32, yr, { size: 18 }); });
    const KY = 110, CY = 230, JK = 158, JC = 182;
    const lane = (y, j, a, b) => `M${a} ${y} L${a + 20} ${y} C${a + 40} ${y} ${a + 40} ${j} ${a + 60} ${j} L${b - 30} ${j}`;
    // 국민당(파랑)·공산당(빨강)
    const seg = (n, k, c, d) => drawLine(k, C.blue, n, { w: 7 }) + drawLine(c, C.red, n, { w: 7, delay: 0.1 }) + (d || '');
    body += text(40, KY - 18, '국민당', { size: 20, color: C.blue, anchor: 'start' }) + text(40, CY + 34, '공산당', { size: 20, color: C.red, anchor: 'start' });
    body += seg(1, `M40 ${KY} H70 C90 ${KY} 90 ${JK} 110 ${JK} H200`, `M40 ${CY} H70 C90 ${CY} 90 ${JC} 110 ${JC} H200`);
    body += seg(2, `M200 ${JK} C215 ${JK} 215 ${KY} 230 ${KY} H290`, `M200 ${JC} C215 ${JC} 215 ${CY} 230 ${CY} H290`);
    body += seg(3, `M290 ${KY} C310 ${KY} 310 ${JK} 330 ${JK} H430`, `M290 ${CY} C310 ${CY} 310 ${JC} 330 ${JC} H430`);
    body += seg(4, `M430 ${JK} C445 ${JK} 445 ${KY} 460 ${KY} H540 L600 ${KY - 50}`, `M430 ${JC} C445 ${JC} 445 ${CY} 460 ${CY} H600`);
    body += at(1, 'pop', tag(155, 60, '제1차 1924', COLD), 0.9) + at(1, 'pop', tag(155, 270, '군벌에 맞서', PLAIN), 1.2);
    body += at(2, 'pop', `<g class="pulse pulse2">${xMark(260, 170, 12)}</g>`, 0.8) + at(2, 'pop', tag(262, 270, '1927 깨짐', RED), 1);
    body += at(3, 'pop', tag(380, 60, '제2차 1937', COLD), 0.9) + at(3, 'pop', tag(380, 270, '일본에 맞서', PLAIN), 1.2);
    body += at(4, 'pop', tag(560, 270, '1949 공산당 승리', RED), 1) + at(4, 'pop', tag(560, 34, '타이완으로', COLD), 1.2);
    body += `<g class="b4"><rect class="flash flash4" x="100" y="138" width="110" height="64" rx="14" fill="none" stroke="${C.purple}" stroke-width="5"/><rect class="flash flash4" x="320" y="138" width="120" height="64" rx="14" fill="none" stroke="${C.purple}" stroke-width="5"/></g>`;
    put(KEY(6, '국공 합작'), svg(id, body, css));
  })();

  // ── 홀로코스트: 잘못된 인종주의 → 차별하는 법 → 수용소, 약 600만 명 희생 → 1월 27일 추모 ──
  (function () {
    const id = 't82-h6-holocaust';
    let css = base(id);
    let body = '';
    const XS = [86, 246, 406, 566], Y = 150;
    const STEP = [['잘못된', '인종주의'], ['차별하는', '법'], ['수용소'], ['추모']];
    const COLS = [RED, HOT, GRAY, OK];
    STEP.forEach((s, i) => { body += at(i + 1, 'pop', card(XS[i], Y, 122, 86, s, COLS[i], { size: 20 })); });
    [0, 1, 2].forEach((i) => { body += drawArrow([[XS[i] + 64, Y], [XS[i + 1] - 66, Y]], C.ink, i + 2, { w: 4, dur: 0.4 }); });
    // 아래 그림
    body += at(1, 'pop', tag(XS[0], 62, '나치 독일', RED), 0.5);
    body += at(1, 'pop', `<g transform="translate(${XS[0]} 250)"><path d="M-16 -36 V36 M16 -36 V36 M-16 -18 H16 M-16 0 H16 M-16 18 H16" stroke="${C.muted}" stroke-width="5" stroke-linecap="round"/>${xMark(0, 0, 22)}</g>`, 0.8);
    body += at(2, 'pop', `<g transform="translate(${XS[1]} 250)"><path d="M-22 -30 H14 L22 -22 V30 H-22 Z" fill="white" stroke="${C.ink}" stroke-width="2.5" stroke-linejoin="round"/><path d="M-13 -14 H13 M-13 -3 H13 M-13 8 H13" stroke="${C.ink}" stroke-width="2.5"/><circle cx="12" cy="20" r="14" fill="white" stroke="${C.red}" stroke-width="3.5"/><path d="M2 30 L22 10" stroke="${C.red}" stroke-width="3.5"/></g>`, 0.6);
    body += at(2, 'pop', tag(XS[1], 62, '유대인 차별', HOT), 0.9);
    body += at(3, 'pop', `<g transform="translate(${XS[2]} 246)"><rect x="-34" y="-12" width="68" height="40" fill="white" stroke="${C.muted}" stroke-width="2.5"/><path d="M-34 -12 L0 -32 L34 -12" fill="none" stroke="${C.muted}" stroke-width="2.5"/><path d="M-56 30 V-26 M56 30 V-26 M-56 -16 H56 M-56 4 H56 M-56 22 H56" stroke="${C.muted}" stroke-width="2" stroke-dasharray="4 3"/></g>`, 0.6);
    body += at(3, 'pop', tag(XS[2], 62, '약 600만 명 희생', GRAY), 1);
    body += at(4, 'pop', candle(XS[3], 240), 0.5);
    body += at(4, 'pop', tag(XS[3], 62, '1월 27일', OK), 0.8);
    body += at(4, 'pop', tag(320, 330, '홀로코스트', PLAIN, { size: 22 }), 1.2);
    put(KEY(6, '홀로코스트'), svg(id, body, css));
  })();

  // ── 전쟁 범죄: 전쟁의 규칙(민간인·포로 보호) → 어김 → 전범 재판(뉘른베르크·도쿄) → 국제 형사 재판소 ──
  (function () {
    const id = 't82-h6-warcrime';
    let css = base(id);
    let body = '';
    // 왼쪽: 규칙 책과 방패 둘
    body += at(1, 'pop', `<g transform="translate(150 96)"><rect x="-56" y="-38" width="112" height="76" rx="6" fill="white" stroke="${C.blue}" stroke-width="3"/><path d="M0 -38 V38" stroke="${C.blue}" stroke-width="3"/><path d="M-44 -18 H-12 M-44 -4 H-12 M-44 10 H-12 M12 -18 H44 M12 -4 H44 M12 10 H44" stroke="${C.blue}" stroke-width="2.5"/></g>`);
    body += at(1, 'pop', tag(150, 160, '전쟁의 규칙', COLD), 0.3);
    const shield = (x, label) => `<g transform="translate(${x} 226)"><path d="M0 -36 L30 -26 V0 Q30 26 0 38 Q-30 26 -30 0 V-26 Z" fill="${C.sky}" stroke="${C.blue}" stroke-width="3" stroke-linejoin="round"/></g>${text(x, 290, label, { size: 18 })}`;
    body += at(1, 'pop', shield(90, '민간인 보호'), 0.6) + at(1, 'pop', shield(210, '포로 보호'), 0.8);
    // 2칸: 어김
    body += at(2, 'pop', `<path d="M66 198 L104 222 L80 238 L116 262 M186 198 L224 222 L200 238 L236 262" stroke="${C.red}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`, 0.2);
    body += at(2, 'pop', tag(150, 330, '규칙을 어김 = 전쟁 범죄', RED), 0.6);
    // 3칸: 재판
    body += drawArrow([[262, 150], [360, 150]], C.muted, 3, { w: 5, dur: 0.5 });
    body += at(3, 'pop', `<g transform="translate(470 120)"><g class="hammer"><rect x="-34" y="-16" width="44" height="22" rx="4" fill="${C.orange}" stroke="${C.ink}" stroke-width="2.5"/><path d="M-4 6 L30 40" stroke="${C.ink}" stroke-width="6" stroke-linecap="round"/></g><rect x="-50" y="52" width="80" height="12" rx="3" fill="${C.ink}"/></g>`, 0.4);
    body += at(3, 'pop', tag(470, 220, '전범 재판', HOT, { size: 20 }), 0.8);
    body += at(3, 'pop', tag(410, 264, '뉘른베르크', PLAIN) + tag(550, 264, '도쿄', PLAIN), 1.1);
    // 4칸: 오늘날
    body += at(4, 'pop', tag(480, 320, '국제 형사 재판소', OK, { size: 20 }), 0.3);
    body += at(4, 'pop', tag(480, 40, '전쟁 범죄', RED, { size: 22 }), 0.9);
    css += `
      .sc-${id} .hammer { transform-box: fill-box; transform-origin: 100% 100%; }
      .on3 .sc-${id} .hammer { animation: ${id}-ham .5s ease-in-out .9s 3; }
      @keyframes ${id}-ham { 50% { transform: rotate(-24deg); } }`;
    put(KEY(6, '전쟁 범죄'), svg(id, body, css));
  })();

  // ════ 7 현대 세계의 전개와 과제 ════

  // ── 대량 살상 무기: 세 갈래 → 넓은 곳을 한꺼번에 → 금지 조약 → 조사단이 살핌 ──
  (function () {
    const id = 't82-h7-wmd';
    let css = base(id);
    let body = '';
    const XS = [110, 320, 530], Y = 110;
    const atom = `<circle r="7" fill="${C.red}"/>${[0, 60, 120].map((a) => `<ellipse rx="34" ry="12" transform="rotate(${a})" fill="none" stroke="${C.red}" stroke-width="3"/>`).join('')}`;
    let spikes = ''; for (let i = 0; i < 10; i++) { const a = (i * Math.PI) / 5; spikes += `M${f(22 * Math.cos(a))} ${f(22 * Math.sin(a))} L${f(32 * Math.cos(a))} ${f(32 * Math.sin(a))}`; }
    const germ = `<circle r="22" fill="#e3f0d8" stroke="${C.green}" stroke-width="3"/><path d="${spikes}" stroke="${C.green}" stroke-width="3.5" stroke-linecap="round"/><circle cx="-7" cy="-5" r="4" fill="${C.green}"/><circle cx="7" cy="6" r="5" fill="${C.green}"/>`;
    const flask = `<path d="M-8 -32 H8 M-5 -32 V-10 L-26 26 Q-28 32 -22 32 H22 Q28 32 26 26 L5 -10 V-32" fill="white" stroke="${C.purple}" stroke-width="3" stroke-linejoin="round"/><path d="M-17 12 L-24 26 Q-25 28 -21 28 H21 Q25 28 24 26 L17 12 Z" fill="${C.lilac}"/>`;
    const ICON = [atom, germ, flask], NAME = ['핵무기', '생물 무기', '화학 무기'], COL = [C.red, C.green, C.purple];
    XS.forEach((x, i) => {
      body += at(1, 'pop', `<g transform="translate(${x} ${Y})">${ICON[i]}</g>`, i * 0.3);
      body += at(1, 'fin', text(x, Y + 64, NAME[i], { size: 20 }), 0.2 + i * 0.3);
      body += `<g class="b2 h3">${[0, 0.7].map((d) => `<circle class="wave" style="animation-delay:${d}s" cx="${x}" cy="${Y}" r="40" fill="none" stroke="${COL[i]}" stroke-width="3"/>`).join('')}</g>`;
    });
    body += `<g class="b2 h3">${g('pop pop2', tag(320, 234, '넓은 곳을 한꺼번에', RED, { size: 20 }), 0.6)}</g>`;
    const TREATY = [['핵 확산', '금지 조약'], ['생물 무기', '금지 협약'], ['화학 무기', '금지 협약']];
    XS.forEach((x, i) => { body += at(3, 'drop', card(x, 252, 160, 72, TREATY[i], OK, { size: 18 }), 0.2 + i * 0.3); });
    body += at(3, 'pop', XS.map((x) => `<g transform="translate(${x + 70} 222)"><rect x="-11" y="-4" width="22" height="18" rx="3" fill="${C.green}"/><path d="M-6 -4 V-10 A6 6 0 0 1 6 -10 V-4" stroke="${C.green}" stroke-width="3" fill="none"/></g>`).join(''), 1.2);
    // 4칸: 돋보기(조사단)
    body += `<g class="b4"><g class="scan"><circle cx="0" cy="0" r="22" fill="white" fill-opacity=".5" stroke="${C.ink}" stroke-width="4"/><path d="M16 16 L34 34" stroke="${C.ink}" stroke-width="7" stroke-linecap="round"/></g></g>`;
    body += at(4, 'pop', tag(320, 336, '대량 살상 무기', RED, { size: 22 }), 0.8);
    body += at(4, 'pop', tag(84, 336, '조사단', PLAIN), 0.3);
    css += `
      .sc-${id} .wave { transform-box: fill-box; transform-origin: center; animation: ${id}-wave 1.4s ease-out infinite; }
      @keyframes ${id}-wave { from { transform: scale(1); opacity: .9; } to { transform: scale(2.4); opacity: 0; } }
      .sc-${id} .scan { transform: translate(110px, 110px); }
      .on4 .sc-${id} .scan { animation: ${id}-scan 3s ease-in-out infinite; }
      @keyframes ${id}-scan { 0%, 100% { transform: translate(100px, 104px); } 50% { transform: translate(540px, 104px); } }`;
    put(KEY(7, '대량 살상 무기'), svg(id, body, css));
  })();
})(typeof window !== 'undefined' ? window : globalThis);
