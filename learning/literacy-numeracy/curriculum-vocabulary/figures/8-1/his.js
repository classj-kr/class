// 역사 8-1(중학교 역사① 앞부분) 1·2단원 도식: 지도 없이 짜임·흐름으로 뜻이 잡히는 낱말.
// 1단원: 사실로서의 역사·기록으로서의 역사·사관(같은 일 → 두 역사가가 골라 적은 기록), 사료 비판, 역사 시대, 서기·기원전·기원후(해 칸 띠, 0년 없음), 세기(100년 묶음 띠).
// 2단원: 계급·카스트제(신분 층), 봉건제·군현제(땅 나누어 주기 / 관리 보내기), 민주 정치(아테네 민회), 공화정·제정(로마 짜임), 법가.
// 지도가 필요한 낱말(문명·네 문명·아케메네스 왕조·헬레니즘·춘추 전국 시대·비단길)은 his-2.js.
(function (root) {
  'use strict';
  const { C, svg, text, put } = root.FigureKit;
  const KEY = (u, w) => `8-1/역사/${u}/${w}`;
  const f = (n) => +(+n).toFixed(1);
  const dl = (s) => (s ? ` style="animation-delay:${s}s"` : '');
  const g = (cls, inner, s = 0) => `<g class="${cls}"${dl(s)}>${inner}</g>`;
  // 칸 n 에 나타나며 kind(pop·fin·rise·drop) 움직임을 한 번 한다
  const at = (n, kind, inner, s = 0) => `<g class="b${n}">${g(`${kind} ${kind}${n}`, inner, s)}</g>`;
  // 칸 n 부터 보이고, hide 칸부터 사라진다
  const shown = (n, inner, hide) => `<g class="b${n}${hide ? ' h' + hide : ''}">${inner}</g>`;
  // 칸 n 부터 흐려진다(다른 것에 눈이 가도록)
  const dimFrom = (n, inner) => `<g class="dim dim${n}">${inner}</g>`;

  // 글자 폭 어림(맑은 고딕 굵게: 한글 1em, 숫자 .6em, 빈칸 .3em)
  const tw = (s, size) => [...String(s)].reduce((a, c) => a + (/[가-힣?→]/.test(c) ? 1 : c === ' ' ? 0.3 : 0.6), 0) * size;
  const HOT = [C.peach, C.orange], COLD = [C.sky, C.blue], OK = [C.mint, C.green], OLD = [C.lilac, C.purple], PLAIN = ['white', C.muted];
  const tagW = (label, size = 20) => Math.round(tw(label, size) + size * 1.3);
  const tag = (cx, cy, label, [fill, stroke] = OK, { size = 20 } = {}) => {
    const w = tagW(label, size), h = Math.round(size * 1.7);
    return `<g><rect x="${f(cx - w / 2)}" y="${f(cy - h / 2)}" width="${w}" height="${h}" rx="${h / 2}" fill="${fill}" stroke="${stroke}" stroke-width="2.5"/>${text(f(cx), f(cy + size * 0.36), label, { size })}</g>`;
  };
  const box = (cx, cy, w, h, label, [fill, stroke] = OK, size = 20, rx = 10) =>
    `<rect x="${f(cx - w / 2)}" y="${f(cy - h / 2)}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" stroke="${stroke}" stroke-width="3"/>` + (label ? text(f(cx), f(cy + size * 0.36), label, { size }) : '');
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
  // 굽은 흐르는 화살표(2차 곡선): 시작 a, 꺾는 점 q, 끝 b
  const flowQ = (a, q, b, color, { w = 5 } = {}) => {
    const ang = Math.atan2(b[1] - q[1], b[0] - q[0]);
    const end = [b[0] - w * Math.cos(ang), b[1] - w * Math.sin(ang)];
    return `<g><path class="mar" d="M${f(a[0])} ${f(a[1])} Q${f(q[0])} ${f(q[1])} ${f(end[0])} ${f(end[1])}" stroke="${color}" stroke-width="${w}" stroke-dasharray="14 10" stroke-linecap="round" fill="none"/>${head(b[0], b[1], ang, color, w)}</g>`;
  };
  // 그려지는 선(칸 n 에 그려진다)
  const drawn = (n, d, color = C.ink, w = 3, extra = '') => `<path class="draw draw${n}" pathLength="1" d="${d}" stroke="${color}" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round"${extra}/>`;
  const glowRect = (x, y, w, h, n, color = C.green, delay = 0, rx = 12) =>
    `<g class="b${n}"><rect class="flash flash${n}"${dl(delay)} x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="${rx}" fill="none" stroke="${color}" stroke-width="5"/></g>`;
  const ring = (cx, cy, r, n, color = C.green, s = 0) => `<g class="b${n}"><circle class="ring ring${n}"${dl(s)} cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${color}" stroke-width="4"/></g>`;
  // 칸마다 자리를 옮기는 것: pts = [[x,y] (1칸), [x,y] (2칸) …], 빈 칸은 앞 칸 자리를 그대로 쓴다
  const mvStyle = (pts, extra = '') => {
    const out = [];
    for (let n = 1; n <= 5; n++) { const p = pts[Math.min(n, pts.length) - 1]; out.push(`--x${n}:${f(p[0])}px;--y${n}:${f(p[1])}px`); }
    return out.join(';') + (extra ? ';' + extra : '');
  };
  const mover = (pts, inner, delay = 0) => `<g class="mv" style="${mvStyle(pts, delay ? `transition-delay:${delay}s` : '')}">${inner}</g>`;
  // 사람 아이콘: (x, y) 는 발밑 가운데. tie: 넥타이
  const person = (x, y, color = C.green, s = 1, { tie = false } = {}) => {
    let o = `<circle cx="${f(x)}" cy="${f(y - 27 * s)}" r="${f(7.5 * s)}" fill="${color}"/><path d="M${f(x - 11 * s)} ${f(y)} V${f(y - 9 * s)} Q${f(x - 11 * s)} ${f(y - 18 * s)} ${f(x)} ${f(y - 18 * s)} Q${f(x + 11 * s)} ${f(y - 18 * s)} ${f(x + 11 * s)} ${f(y - 9 * s)} V${f(y)} Z" fill="${color}"/>`;
    if (tie) o += `<path d="M${f(x)} ${f(y - 17 * s)} L${f(x - 2.2 * s)} ${f(y - 9 * s)} L${f(x)} ${f(y - 5 * s)} L${f(x + 2.2 * s)} ${f(y - 9 * s)} Z" fill="${C.red}"/>`;
    return o;
  };
  // 물음표 방울과 맞음 표
  const qmark = (x, y, r = 17) => `<circle cx="${x}" cy="${y}" r="${r}" fill="white" stroke="${C.orange}" stroke-width="3"/>` + text(x, f(y + r * 0.45), '?', { size: f(r * 1.3), color: C.orange });
  const check = (x, y, s = 1, color = C.green) => `<path d="M${f(x - 12 * s)} ${f(y)} L${f(x - 3 * s)} ${f(y + 9 * s)} L${f(x + 13 * s)} ${f(y - 10 * s)}" stroke="${color}" stroke-width="${f(6 * s)}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  const cross = (x, y, r = 14) => `<circle cx="${x}" cy="${y}" r="${r + 6}" fill="white" stroke="${C.red}" stroke-width="3.5"/><path d="M${f(x - r * 0.55)} ${f(y - r * 0.55)} L${f(x + r * 0.55)} ${f(y + r * 0.55)} M${f(x + r * 0.55)} ${f(y - r * 0.55)} L${f(x - r * 0.55)} ${f(y + r * 0.55)}" stroke="${C.red}" stroke-width="5" stroke-linecap="round"/>`;
  const star = (x, y, r = 18, fill = C.yellow, stroke = C.orange) => {
    const p = [];
    for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.45 : r; p.push(`${f(x + rr * Math.cos(a))} ${f(y + rr * Math.sin(a))}`); }
    return `<path d="M${p.join(' L')} Z" fill="${fill}" stroke="${stroke}" stroke-width="2.5" stroke-linejoin="round"/>`;
  };
  // 문서 한 장: 가운데 (x, y)
  const paper = (x, y, label = '', s = 1) => `<rect x="${f(x - 24 * s)}" y="${f(y - 30 * s)}" width="${f(48 * s)}" height="${f(60 * s)}" rx="4" fill="white" stroke="${C.ink}" stroke-width="2.5"/>` +
    (label ? text(x, f(y + 6.5), label, { size: 18 }) : `<path d="M${f(x - 14 * s)} ${f(y - 14 * s)} H${f(x + 14 * s)} M${f(x - 14 * s)} ${f(y)} H${f(x + 14 * s)} M${f(x - 14 * s)} ${f(y + 14 * s)} H${f(x + 6 * s)}" stroke="${C.muted}" stroke-width="2.5" stroke-linecap="round"/>`);
  // 도장: 빨간 동그라미 안 짧은 이름
  const stamp = (x, y, label, r = 26) => `<circle cx="${x}" cy="${y}" r="${r}" fill="white" stroke="${C.red}" stroke-width="3.5"/><circle cx="${x}" cy="${y}" r="${r - 5}" fill="none" stroke="${C.red}" stroke-width="1.5"/>${text(x, f(y + 6.5), label, { size: 18, color: C.red })}`;
  // 투표용지(접은 것): 가운데 (x, y)
  const ballot = (x, y) => `<rect x="${x - 12}" y="${y - 9}" width="24" height="18" rx="2" fill="white" stroke="${C.ink}" stroke-width="2"/><path d="M${x - 12} ${y} H${x + 12}" stroke="${C.line}" stroke-width="2"/>`;
  const ballotBox = (x, top, w = 90, h = 64) => `<rect x="${x - w / 2}" y="${top}" width="${w}" height="${h}" rx="6" fill="${C.sky}" stroke="${C.blue}" stroke-width="3"/><rect x="${x - 20}" y="${top - 3}" width="40" height="7" rx="3" fill="${C.ink}"/>` + text(x, top + h / 2 + 7, '투표함', { size: 18, color: C.blue });
  // 건물(기둥과 세모 지붕): 밑 가운데 (x, y)
  const hall = (x, y, w = 150, h = 90, [fill, stroke] = OLD) => {
    const cols = 4, gap = (w - 30) / (cols - 1);
    let o = `<path d="M${f(x - w / 2 - 10)} ${f(y - h)} L${f(x)} ${f(y - h - 36)} L${f(x + w / 2 + 10)} ${f(y - h)} Z" fill="${fill}" stroke="${stroke}" stroke-width="3" stroke-linejoin="round"/>`;
    o += `<rect x="${f(x - w / 2)}" y="${f(y - h)}" width="${w}" height="${h}" fill="white" stroke="${stroke}" stroke-width="3"/>`;
    for (let i = 0; i < cols; i++) o += `<rect x="${f(x - w / 2 + 9 + i * gap)}" y="${f(y - h + 10)}" width="12" height="${h - 20}" fill="${fill}"/>`;
    return o;
  };

  // 장면마다 같이 쓰는 움직임
  const base = (id) => {
    let s = `
    .sc-${id} .pop, .sc-${id} .pulse, .sc-${id} .ring, .sc-${id} .twk { transform-box: fill-box; transform-origin: center; }
    .sc-${id} .twk { animation: ${id}-twk 1.6s ease-in-out infinite alternate; }
    .sc-${id} .mar { animation: ${id}-mar .7s linear infinite; }
    .sc-${id} .draw { stroke-dasharray: 1; stroke-dashoffset: 1; transition: stroke-dashoffset 1.4s ease-in-out .2s; }
    .sc-${id} .grow { transform-box: fill-box; transform-origin: 0 50%; transform: scaleX(0); transition: transform 1.2s ease-in-out .2s; }
    .sc-${id} .growy { transform-box: fill-box; transform-origin: 50% 100%; transform: scaleY(0); transition: transform 1s ease-out .2s; }
    .sc-${id} .mv { transform: translate(var(--x1), var(--y1)); transition: transform 1.4s ease-in-out, opacity .6s ease; }
    .sc-${id} .dim { transition: opacity .6s ease; }
    .sc-${id} .jig { animation: ${id}-jig 1.3s ease-in-out infinite; }
    .sc-${id} .bob { animation: ${id}-bob 1.4s ease-in-out infinite; }
    .sc-${id} .ring { opacity: 0; }
    @keyframes ${id}-pop { 0% { opacity: 0; transform: scale(.3); } 70% { opacity: 1; transform: scale(1.12); } 100% { opacity: 1; transform: scale(1); } }
    @keyframes ${id}-fin { from { opacity: 0; } to { opacity: 1; } }
    @keyframes ${id}-rise { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
    @keyframes ${id}-drop { from { opacity: 0; transform: translateY(-30px); } to { opacity: 1; transform: none; } }
    @keyframes ${id}-pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }
    @keyframes ${id}-flash { 0% { opacity: 0; } 20% { opacity: 1; } 40% { opacity: .25; } 60% { opacity: 1; } 80% { opacity: .25; } 100% { opacity: 1; } }
    @keyframes ${id}-ring { 0% { opacity: .9; transform: scale(1); } 100% { opacity: 0; transform: scale(1.6); } }
    @keyframes ${id}-twk { from { opacity: .35; } to { opacity: 1; } }
    @keyframes ${id}-mar { from { stroke-dashoffset: 24; } to { stroke-dashoffset: 0; } }
    @keyframes ${id}-jig { 0%, 100% { transform: translate(0, 0); } 25% { transform: translate(3px, -2px); } 50% { transform: translate(-3px, 1.5px); } 75% { transform: translate(2px, 2.5px); } }
    @keyframes ${id}-bob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
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
    .on${n} .sc-${id} .grow${n}, .on${n} .sc-${id} .growy${n} { transform: none; }
    .on${n} .sc-${id} .dim${n} { opacity: .28; }`;
    for (let n = 2; n <= 5; n++) s += `
    .on${n} .sc-${id} .mv { transform: translate(var(--x${n}), var(--y${n})); }`;
    return s;
  };


  // 이 파일에서 더 쓰는 작은 그림
  const GRAY = ['#f1f3f0', C.muted], PAPER = ['white', C.ink];
  const T = (x, y, inner, s = 1) => `<g transform="translate(${f(x)} ${f(y)})${s !== 1 ? ` scale(${s})` : ''}">${inner}</g>`;
  // 왕관: 밑 가운데 (x, y)
  const crown = (x, y, s = 1) => `<path d="M${f(x - 10 * s)} ${f(y)} L${f(x - 10 * s)} ${f(y - 10 * s)} L${f(x - 5 * s)} ${f(y - 5 * s)} L${f(x)} ${f(y - 12 * s)} L${f(x + 5 * s)} ${f(y - 5 * s)} L${f(x + 10 * s)} ${f(y - 10 * s)} L${f(x + 10 * s)} ${f(y)} Z" fill="${C.yellow}" stroke="${C.orange}" stroke-width="2" stroke-linejoin="round"/>`;
  // 안경: 사람(x, y, s) 얼굴에
  const glasses = (x, y, s, color) => `<circle cx="${f(x - 4.2 * s)}" cy="${f(y - 27.5 * s)}" r="${f(3.6 * s)}" fill="${color}" stroke="${C.ink}" stroke-width="2"/><circle cx="${f(x + 4.2 * s)}" cy="${f(y - 27.5 * s)}" r="${f(3.6 * s)}" fill="${color}" stroke="${C.ink}" stroke-width="2"/>`;
  // 자물쇠: 가운데 (x, y)
  const lock = (x, y) => `<path d="M${x - 8} ${y - 4} V${y - 11} A8 8 0 0 1 ${x + 8} ${y - 11} V${y - 4}" stroke="${C.ink}" stroke-width="4" fill="none"/><rect x="${x - 13}" y="${y - 5}" width="26" height="20" rx="4" fill="${C.orange}" stroke="${C.ink}" stroke-width="2"/><circle cx="${x}" cy="${y + 4}" r="3" fill="${C.ink}"/>`;
  // 곡식 자루: 밑 가운데 (x, y)
  const sack = (x, y) => `<path d="M${x - 11} ${y} Q${x - 13} ${y - 10} ${x - 6} ${y - 14} L${x - 4} ${y - 17} H${x + 4} L${x + 6} ${y - 14} Q${x + 13} ${y - 10} ${x + 11} ${y} Z" fill="${C.yellow}" stroke="${C.orange}" stroke-width="2" stroke-linejoin="round"/>`;
  // 줄친 문서 줄
  const bar = (x, y, w, color = C.line) => `<rect x="${x}" y="${y - 5}" width="${w}" height="10" rx="5" fill="${color}"/>`;
  // 아래로 벌어진 괄호(위에서 감싸기)와 이름
  const brace = (x1, x2, y, label, color = C.ink) => `<path d="M${x1 + 4} ${y + 10} V${y} H${x2 - 4} V${y + 10}" stroke="${color}" stroke-width="3" fill="none" stroke-linejoin="round"/>` + text(f((x1 + x2) / 2), y - 10, label, { size: 20, color });

  // ════ 1 역사 학습의 기초 ════

  // ── 사실로서의 역사 · 기록으로서의 역사 · 사관: 같은 전쟁(일어난 일) → 두 역사가가 저마다 골라 적은 기록 ──
  // 위 상자 = 일어난 일(왕·장군·싸움·백성·피란), 아래 = 두 역사가의 기록. 왼쪽 역사가는 왕·장군·싸움, 오른쪽은 백성·피란을 고른다.
  const EV = ['왕', '장군', '싸움', '백성', '피란'];
  const EX = [176, 248, 320, 392, 464], EY = 88;
  const SLOT = [[225, 222], [225, 262], [225, 302], [415, 222], [415, 262]];
  const factFig = (mode, word, id) => {
    let css = base(id), body = '';
    const moveN = mode === 'fact' ? 3 : 2;
    const view = mode === 'view';
    if (view) body += at(2, 'fin', `<path d="M86 288 L150 108 L356 108 Z" fill="${C.orange}" fill-opacity=".16"/><path d="M554 288 L362 108 L490 108 Z" fill="${C.blue}" fill-opacity=".16"/>`, 0.1);
    body += at(1, 'pop', `<rect x="120" y="14" width="400" height="108" rx="16" fill="white" stroke="${C.ink}" stroke-width="3"/>`);
    body += mode === 'fact' ? shown(1, text(320, 44, '일어난 일', { size: 20 }), 3) : shown(1, text(320, 44, '일어난 일', { size: 20 }));
    EV.forEach((w, i) => { body += at(1, 'pop', tag(EX[i], EY, w, PLAIN, { size: 19 }), 0.25 + i * 0.15); });
    if (view) EV.forEach((w, i) => { body += at(2, 'fin', tag(EX[i], EY, w, i < 3 ? HOT : COLD, { size: 19 }), 0.2 + i * 0.1); });
    // 역사가 둘과 빈 기록
    const histN = mode === 'fact' ? 3 : view ? 1 : 2;
    body += at(histN, 'pop', person(78, 340, C.green, 1.6) + (view ? glasses(78, 340, 1.6, C.orange) : ''));
    body += at(histN, 'pop', person(562, 340, C.purple, 1.6) + (view ? glasses(562, 340, 1.6, C.blue) : ''), 0.15);
    body += at(histN, 'pop', `<rect x="150" y="190" width="150" height="148" rx="6" fill="white" stroke="${C.ink}" stroke-width="2.5"/><rect x="340" y="190" width="150" height="148" rx="6" fill="white" stroke="${C.ink}" stroke-width="2.5"/>`, 0.1);
    if (view) body += ring(78, 296, 16, 1, C.orange, 0.6) + ring(562, 296, 16, 1, C.blue, 0.6);
    // 골라 적기: 일어난 일에서 기록으로 옮겨 간다(원래 자리는 그대로)
    EV.forEach((w, i) => {
      const [sx, sy] = SLOT[i], pts = [];
      for (let n = 1; n < moveN; n++) pts.push([0, 0]);
      pts.push([sx - EX[i], sy - EY]);
      body += shown(moveN, T(EX[i], EY, mover(pts, tag(0, 0, w, i < 3 ? HOT : COLD, { size: 19 }), 0.15 + i * 0.12)));
    });
    if (mode === 'fact') {
      // 2칸: 지나간 일은 잠긴다 — 그때에서 오늘로 시간이 흐른다
      body += at(2, 'pop', lock(512, 22), 0.2);
      body += shown(2, `<path class="draw draw2" pathLength="1" d="M60 160 H596" stroke="${C.muted}" stroke-width="4" stroke-linecap="round"/>` + `<g class="fin fin2" style="animation-delay:1.2s">${head(604, 160, 0, C.muted, 4)}</g>`, 3);
      body += shown(2, at(2, 'pop', `<circle cx="320" cy="160" r="8" fill="${C.ink}"/>` + text(320, 192, '그때', { size: 19 })) + at(2, 'pop', `<circle cx="560" cy="160" r="8" fill="${C.orange}"/>` + text(560, 192, '오늘', { size: 19, color: C.orange }), 1.2), 3);
      body += at(3, 'pop', tag(320, 42, word, HOT, { size: 22 }), 1.2);
      body += glowRect(120, 14, 400, 108, 3, C.orange, 1.2, 16);
    } else if (mode === 'rec') {
      body += at(3, 'pop', tag(320, 162, word, HOT, { size: 22 }));
      body += glowRect(150, 190, 150, 148, 3, C.orange, 0.3, 6) + glowRect(340, 190, 150, 148, 3, C.orange, 0.3, 6);
    } else {
      body += at(3, 'pop', tag(320, 162, word, HOT, { size: 24 }));
      body += ring(78, 296, 16, 3, C.orange, 0.3) + ring(562, 296, 16, 3, C.blue, 0.3);
    }
    put(KEY('1', word), svg(id, body, css));
  };
  factFig('fact', '사실로서의 역사', 't81-h1-sasil');
  factFig('rec', '기록으로서의 역사', 't81-h1-girok');
  factFig('view', '사관', 't81-h1-sagwan');

  // ── 사료 비판: 왕을 칭찬한 옛 글을 돋보기로 — 누가? 언제? 왜? ──
  (function () {
    const id = 't81-h1-saryobipan';
    let css = base(id), body = '';
    body += at(1, 'pop', `<rect x="40" y="26" width="210" height="300" rx="8" fill="white" stroke="${C.ink}" stroke-width="3"/>` + crown(145, 84, 2.4));
    [[70, 120, 150], [70, 152, 128], [70, 184, 150], [70, 216, 110], [70, 248, 150], [70, 280, 96]].forEach(([x, y, w]) => { body += at(1, 'fin', bar(x, y, w), 0.3); });
    [[72, 70], [218, 70], [216, 298]].forEach(([x, y], i) => { body += shown(1, `<g class="twk" style="animation-delay:${i * 0.4}s">${star(x, y, 11)}</g>`); });
    // 돋보기: 아래에서 위로 글을 훑는다
    const glass = `<circle cx="0" cy="0" r="30" fill="${C.sky}" fill-opacity=".35" stroke="${C.ink}" stroke-width="5"/><path d="M21 21 L44 44" stroke="${C.ink}" stroke-width="9" stroke-linecap="round"/>`;
    body += shown(2, mover([[110, 290], [180, 160]], glass), 0);
    css += `.on2 .sc-${id} .mv { transition-duration: 1.6s; }`;
    const Q = [['누가?', 80, '왕의 신하'], ['언제?', 160, '왕이 다스릴 때'], ['왜?', 240, '왕을 높이려고']];
    Q.forEach(([q, y, a], i) => {
      body += at(2, 'drop', tag(334, y, q, COLD, { size: 20 }), 0.3 + i * 0.3);
      body += shown(3, `<path class="draw draw3" pathLength="1" style="transition-delay:${0.2 + i * 0.3}s" d="M376 ${y} H420" stroke="${C.muted}" stroke-width="3.5" stroke-linecap="round"/>`);
      body += at(3, 'pop', tag(512, y, a, HOT, { size: 19 }), 0.5 + i * 0.3);
    });
    // 부풀렸을지 모르는 곳
    body += at(3, 'fin', bar(70, 152, 128, C.orange) + bar(70, 216, 110, C.orange), 1.2);
    body += at(3, 'pop', qmark(226, 152, 13) + qmark(206, 216, 13), 1.4);
    body += at(4, 'pop', tag(460, 314, '사료 비판', HOT, { size: 24 }));
    body += glowRect(40, 26, 210, 300, 4, C.orange, 0.3, 8);
    put(KEY('1', '사료 비판'), svg(id, body, css));
  })();

  // ── 역사 시대: 시간 띠 — 선사 시대 | 문자 사용 | 역사 시대 ──
  (function () {
    const id = 't81-h1-yeoksasidae';
    let css = base(id), body = '';
    // 시간 화살표
    body += shown(1, `<path d="M40 328 H592" stroke="${C.muted}" stroke-width="3"/>${head(600, 328, 0, C.muted, 3)}` + text(44, 318, '옛날', { size: 18, anchor: 'start', color: C.muted }) + text(596, 318, '오늘', { size: 18, anchor: 'end', color: C.muted }));
    body += `<g class="b1"><rect class="grow grow1" x="40" y="200" width="320" height="50" fill="${C.lilac}" stroke="${C.purple}" stroke-width="2.5"/></g>`;
    body += at(1, 'fin', text(200, 232, '선사 시대', { size: 20, color: C.purple }), 0.9);
    // 남은 유물: 뗀석기, 토기
    body += at(1, 'pop', `<path d="M100 186 L88 150 Q96 124 112 122 Q128 126 132 150 L120 186 Z" fill="#c9c3b8" stroke="${C.ink}" stroke-width="2.5" stroke-linejoin="round"/>`, 0.6);
    body += at(1, 'pop', `<path d="M196 124 H244 L238 160 Q220 192 202 160 Z" fill="${C.peach}" stroke="${C.orange}" stroke-width="2.5" stroke-linejoin="round"/><path d="M200 136 H240 M202 148 H238" stroke="${C.orange}" stroke-width="2"/>`, 0.8);
    body += at(1, 'pop', tag(170, 282, '유물·유적', OLD, { size: 19 }), 1.1);
    // 2칸: 문자 사용
    body += at(2, 'drop', `<path d="M360 110 V262" stroke="${C.ink}" stroke-width="4" stroke-dasharray="8 6"/>` + tag(360, 92, '문자 사용', COLD, { size: 20 }));
    body += at(2, 'pop', `<rect x="398" y="124" width="56" height="62" rx="8" fill="${C.peach}" stroke="${C.orange}" stroke-width="2.5"/><path d="M408 140 l8 4 l-8 4 M424 140 l8 4 l-8 4 M408 160 l8 4 l-8 4 M424 160 v10 M436 158 l8 4 l-8 4" stroke="${C.ink}" stroke-width="2.5" fill="none" stroke-linejoin="round"/>`, 0.6);
    // 3칸: 글로 남긴 기록
    body += `<g class="b3"><rect class="grow grow3" x="360" y="200" width="240" height="50" fill="${C.peach}" stroke="${C.orange}" stroke-width="2.5"/></g>`;
    body += at(3, 'pop', `<rect x="486" y="128" width="60" height="54" fill="white" stroke="${C.ink}" stroke-width="2.5"/><rect x="480" y="122" width="12" height="66" rx="6" fill="${C.yellow}" stroke="${C.orange}" stroke-width="2"/><rect x="540" y="122" width="12" height="66" rx="6" fill="${C.yellow}" stroke="${C.orange}" stroke-width="2"/><path d="M500 144 H532 M500 156 H532 M500 168 H524" stroke="${C.muted}" stroke-width="2.5"/>`, 0.6);
    body += at(3, 'pop', tag(480, 282, '기록', HOT, { size: 19 }), 1.0);
    // 4칸: 역사 시대
    body += at(4, 'pop', text(480, 233, '역사 시대', { size: 21, color: C.orange }));
    body += glowRect(360, 200, 240, 50, 4, C.orange, 0.3, 4);
    put(KEY('1', '역사 시대'), svg(id, body, css));
  })();

  // ── 서기 · 기원전 · 기원후: 해 칸 띠(기원전 3년 … 기원전 1년 | 1년 2년 3년 … 2026년), 0년은 없다 ──
  const CY = 150, CH = 70;
  const CXS = { '-3': 20, '-2': 100, '-1': 180, '1': 260, '2': 340, '3': 420 };
  const yearCell = (k, [fill, stroke] = PLAIN) => {
    const x = CXS[k], r = `<rect x="${x}" y="${CY}" width="80" height="${CH}" fill="${fill}" stroke="${stroke}" stroke-width="2.5"/>`;
    return r + (k < 0 ? text(x + 40, CY + 30, '기원전', { size: 18 }) + text(x + 40, CY + 57, `${-k}년`, { size: 20 }) : text(x + 40, CY + 43, `${k}년`, { size: 22 }));
  };
  const lastCell = ([fill, stroke] = PLAIN) => text(522, CY + 42, '⋯', { size: 24, color: C.muted }) + `<rect x="545" y="${CY}" width="80" height="${CH}" fill="${fill}" stroke="${stroke}" stroke-width="2.5"/>` + text(585, CY + 42, '2026년', { size: 19 });
  const firstStar = star(326, CY + 14, 9);
  const yearFig = (word, id) => {
    let css = base(id), body = '';
    if (word === '서기') {
      [1, 2, 3].forEach((k, i) => { body += at(1, 'pop', yearCell(k), 0.2 + i * 0.15); });
      body += at(1, 'pop', lastCell(HOT), 0.8);
      body += at(2, 'drop', firstStar + tag(300, 98, '출발점', HOT, { size: 19 }), 0.1);
      body += shown(2, `<path class="draw draw2" pathLength="1" d="M268 300 H606" stroke="${C.orange}" stroke-width="5" stroke-linecap="round"/><g class="fin fin2" style="animation-delay:1.5s">${head(616, 300, 0, C.orange, 5)}</g>`);
      [[300, '1'], [380, '2'], [460, '3'], [585, '2026']].forEach(([x, n], i) => { body += at(2, 'pop', text(x, 290, n, { size: 18, color: C.orange }), 0.4 + i * 0.3); });
      [-1, -2, -3].forEach((k, i) => { body += at(3, 'pop', yearCell(k, GRAY), i * 0.15); });
      body += at(3, 'fin', brace(20, 258, 138, '기원전', C.purple) + brace(262, 625, 138, '기원후', C.green), 0.3);
      body += at(3, 'pop', tag(110, 60, '서기', HOT, { size: 26 }), 0.6);
    }
    if (word === '기원전') {
      [1, 2, 3].forEach((k, i) => { body += at(1, 'pop', yearCell(k), 0.2 + i * 0.15); });
      body += at(1, 'pop', lastCell(), 0.7) + at(1, 'pop', firstStar, 0.9);
      [-1, -2, -3].forEach((k, i) => { body += at(2, 'pop', yearCell(k, OLD), 0.2 + i * 0.4); });
      body += shown(2, `<path class="draw draw2" pathLength="1" d="M252 320 H34" stroke="${C.purple}" stroke-width="5" stroke-linecap="round"/><g class="fin fin2" style="animation-delay:1.5s">${head(24, 320, Math.PI, C.purple, 5)}</g>`);
      body += shown(3, `<path class="draw draw3" pathLength="1" d="M220 224 Q260 272 296 228" stroke="${C.orange}" stroke-width="4" fill="none" stroke-linecap="round"/><g class="fin fin3" style="animation-delay:1.3s">${head(300, 224, -0.95, C.orange, 4)}</g>`);
      body += at(3, 'pop', tag(260, 286, '바로 다음 해', HOT, { size: 19 }), 0.5);
      body += at(3, 'drop', tag(260, 106, '0년', GRAY, { size: 22 }), 0.2);
      body += shown(3, `<path class="draw draw3" pathLength="1" style="transition-delay:.9s" d="M232 120 L288 92" stroke="${C.red}" stroke-width="4" stroke-linecap="round"/>`);
      body += at(4, 'pop', tag(510, 72, '기원전', OLD, { size: 26 }), 0.3);
      body += glowRect(20, CY, 240, CH, 4, C.purple, 0.3, 2);
    }
    if (word === '기원후') {
      [-3, -2, -1].forEach((k, i) => { body += at(1, 'pop', yearCell(k, GRAY), 0.1 + i * 0.1); });
      [1, 2, 3].forEach((k, i) => { body += at(1, 'pop', yearCell(k), 0.4 + i * 0.1); });
      body += at(1, 'pop', lastCell(), 0.8) + at(1, 'pop', firstStar, 1.0);
      [1, 2, 3].forEach((k, i) => { body += at(2, 'fin', `<rect x="${CXS[k]}" y="${CY}" width="80" height="${CH}" fill="${C.green}" fill-opacity=".18"/>`, 0.2 + i * 0.3); });
      body += at(2, 'fin', `<rect x="545" y="${CY}" width="80" height="${CH}" fill="${C.green}" fill-opacity=".18"/>`, 1.2);
      body += shown(2, `<path class="draw draw2" pathLength="1" d="M268 300 H606" stroke="${C.green}" stroke-width="5" stroke-linecap="round"/><g class="fin fin2" style="animation-delay:1.5s">${head(616, 300, 0, C.green, 5)}</g>`);
      body += at(3, 'pop', tag(130, 72, '기원후', OK, { size: 26 }), 0.3);
      body += glowRect(260, CY, 365, CH, 3, C.green, 0.3, 2);
    }
    put(KEY('1', word), svg(id, body, css));
  };
  yearFig('서기', 't81-h1-seogi');
  yearFig('기원전', 't81-h1-giwonjeon');
  yearFig('기원후', 't81-h1-giwonhu');

  // ── 세기: 100년 묶음 — 기원전 1세기 | 1세기 | 2세기 ⋯ 20세기 | 21세기 ──
  (function () {
    const id = 't81-h1-segi';
    let css = base(id), body = '';
    const BY = 150, BH = 64;
    const B = [[30, 100, '1세기', -4, OLD], [130, 100, '1세기', 1, OK], [230, 100, '2세기', 2, OK], [370, 110, '20세기', 3, OK], [480, 120, '21세기', 3, HOT]];
    // 빈 띠와 기원선
    body += shown(1, B.map(([x, w]) => `<rect x="${x}" y="${BY}" width="${w}" height="${BH}" fill="white" stroke="${C.line}" stroke-width="2.5"/>`).join('') + text(350, BY + 40, '⋯', { size: 24, color: C.muted }));
    body += shown(1, text(80, 132, '기원전', { size: 19, color: C.purple }) + text(365, 132, '기원후', { size: 19, color: C.green }) + `<path d="M130 ${BY - 14} V${BY + BH + 14}" stroke="${C.ink}" stroke-width="4"/>`);
    B.forEach(([x, w, label, n, [fill, stroke]], i) => {
      const n2 = Math.abs(n), originR = n < 0;
      body += `<g class="b${n2}"><rect class="grow grow${n2}" style="transition-delay:${i === 4 ? 0.5 : 0.1}s${originR ? ';transform-origin:100% 50%' : ''}" x="${x}" y="${BY}" width="${w}" height="${BH}" fill="${fill}" stroke="${stroke}" stroke-width="2.5"/></g>`;
      body += at(n2, 'fin', text(x + w / 2, BY + 40, label, { size: 21 }), i === 4 ? 1.4 : 1.0);
    });
    // 해의 범위
    body += at(1, 'pop', tag(180, 250, '1년~100년', OK, { size: 19 }), 1.2);
    body += at(2, 'pop', tag(280, 300, '101년~200년', OK, { size: 19 }), 1.2);
    body += at(3, 'pop', tag(536, 250, '2001년~2100년', HOT, { size: 19 }), 1.5);
    body += at(3, 'drop', `<path d="M511 ${BY - 4} l-8 -14 h16 Z" fill="${C.red}"/>` + text(511, BY - 26, '2026년', { size: 19, color: C.red }), 1.7);
    body += at(4, 'pop', tag(104, 300, '기원전 100년~1년', OLD, { size: 19 }), 1.2);
    body += at(4, 'pop', tag(548, 44, '세기', HOT, { size: 26 }), 1.6);
    put(KEY('1', '세기'), svg(id, body, css));
  })();

  // ════ 2 문명의 발생과 고대 세계의 형성 (지도 없는 도식) ════

  // ── 계급: 곡식을 많이 가진 사람이 위로 — 지배하는 사람 / 지배받는 사람 ──
  (function () {
    const id = 't81-h2-gyegeup';
    let css = base(id), body = '';
    const PEOPLE = [[90, 1], [180, 4], [270, 1], [370, 2], [460, 1], [550, 5]];
    const TOP = [[300, 172], [342, 172]], LOW = [[236, 290], [288, 290], [342, 290], [396, 290]];
    // 2칸: 피라미드
    body += at(2, 'fin', `<path d="M320 60 L251 170 L389 170 Z" fill="${C.peach}" stroke="${C.orange}" stroke-width="3" stroke-linejoin="round"/><path d="M251 170 L389 170 L470 300 L170 300 Z" fill="${C.mint}" stroke="${C.green}" stroke-width="3" stroke-linejoin="round"/>`);
    // 사람과 곡식 자루: 자루가 많은 둘이 꼭대기로
    let ti = 0, li = 0;
    PEOPLE.forEach(([x, n], i) => {
      const top = n >= 4, to = top ? TOP[ti++] : LOW[li++];
      body += shown(1, Array.from({ length: n }, (_, k) => `<g class="pop pop1" style="animation-delay:${f(0.3 + k * 0.15)}s">${sack(x + 26, 340 - k * 18)}</g>`).join(''), 2);
      body += at(1, 'pop', T(x, 340, mover([[0, 0], [to[0] - x, to[1] - 340]], person(0, 0, top ? C.orange : C.green, 1.25), 0.1 * i)), 0.1 * i);
    });
    body += at(2, 'pop', `<path d="M402 120 H430" stroke="${C.orange}" stroke-width="3"/>` + text(438, 127, '지배하는 사람', { size: 20, anchor: 'start', color: C.orange }), 1.0);
    body += at(2, 'pop', `<path d="M452 250 H480" stroke="${C.green}" stroke-width="3"/>` + text(488, 257, '지배받는 사람', { size: 20, anchor: 'start', color: C.green }), 1.2);
    body += at(3, 'pop', tag(110, 90, '계급', HOT, { size: 26 }));
    body += shown(3, `<path class="flash flash3" d="M320 60 L251 170 L389 170 Z M251 170 L389 170 L470 300 L170 300 Z" fill="none" stroke="${C.red}" stroke-width="5" stroke-linejoin="round"/>`);
    put(KEY('2', '계급'), svg(id, body, css));
  })();

  // ── 카스트제: 네 신분 층 — 브라만(사제) · 크샤트리아(왕족·무사) · 바이샤(평민) · 수드라(노예) ──
  (function () {
    const id = 't81-h2-caste';
    let css = base(id), body = '';
    const cx = 230, hw = (y) => 40 + (y - 60) * 0.62;
    const L = [['브라만', '사제', OLD], ['크샤트리아', '왕족·무사', HOT], ['바이샤', '평민', OK], ['수드라', '노예', COLD]];
    L.forEach(([name, role, [fill, stroke]], i) => {
      const y1 = 60 + i * 65, y2 = y1 + 65, my = (y1 + y2) / 2;
      body += at(1, 'drop', `<path d="M${f(cx - hw(y1))} ${y1} L${f(cx + hw(y1))} ${y1} L${f(cx + hw(y2))} ${y2} L${f(cx - hw(y2))} ${y2} Z" fill="${fill}" stroke="${stroke}" stroke-width="2.5" stroke-linejoin="round"/>` + text(cx, my + 7, name, { size: 21 }), 0.15 + i * 0.3);
      body += at(2, 'pop', `<path d="M${f(cx + hw(my) + 8)} ${my} H458" stroke="${stroke}" stroke-width="2.5" stroke-dasharray="5 5"/>` + text(466, my + 7, role, { size: 20, anchor: 'start', color: stroke }), 0.2 + i * 0.35);
    });
    // 3칸: 태어날 때 정해진 신분 — 위로 오를 수 없다
    body += at(3, 'drop', person(330, 246, C.green, 0.9), 0.1);
    body += at(3, 'pop', lock(362, 228), 0.6);
    body += shown(3, `<path class="draw draw3" pathLength="1" style="transition-delay:.7s" d="M318 208 V160" stroke="${C.muted}" stroke-width="4" stroke-linecap="round"/>`);
    body += at(3, 'pop', cross(318, 176, 10), 1.4);
    body += at(4, 'pop', tag(530, 40, '카스트제', HOT, { size: 24 }));
    body += shown(4, `<path class="flash flash4" d="M${f(cx - hw(60))} 60 L${f(cx + hw(60))} 60 L${f(cx + hw(320))} 320 L${f(cx - hw(320))} 320 Z" fill="none" stroke="${C.red}" stroke-width="5" stroke-linejoin="round"/>`);
    put(KEY('2', '카스트제'), svg(id, body, css));
  })();

  // ── 봉건제: 주 왕은 수도 둘레만 — 나머지 땅을 제후에게 나누어 주고, 제후는 공물·군사를 바친다 ──
  (function () {
    const id = 't81-h2-bonggeon';
    let css = base(id), body = '';
    const LAND = [[40, 40], [40, 196], [440, 40], [440, 196]], LW = 160, LH = 126;
    body += at(1, 'pop', `<rect x="244" y="110" width="152" height="140" rx="12" fill="${C.lilac}" stroke="${C.purple}" stroke-width="3"/>` + person(320, 214, C.purple, 1.5) + crown(320, 168, 1.3) + text(320, 240, '왕', { size: 20, color: C.purple }));
    body += at(1, 'pop', tag(320, 92, '수도 둘레', OLD, { size: 19 }), 0.5);
    LAND.forEach(([x, y], i) => {
      body += at(2, 'fin', `<rect x="${x}" y="${y}" width="${LW}" height="${LH}" rx="12" fill="${C.mint}" stroke="${C.green}" stroke-width="3"/>`, 0.9 + i * 0.1);
      const tx = x + LW / 2, ty = y + LH / 2;
      body += shown(2, T(320, 180, mover([[0, 0], [tx - 320 - 34, ty - 180 - 6]], `<rect x="-18" y="-18" width="36" height="36" rx="5" fill="${C.yellow}" stroke="${C.orange}" stroke-width="2.5"/>` + text(0, 7, '땅', { size: 18 }), 0.1 + i * 0.1)));
      body += at(2, 'pop', person(tx + 26, ty + 30, C.green, 1.2) + text(tx + 26, ty + 54, '제후', { size: 18, color: C.green }), 1.2 + i * 0.1);
      // 3칸: 제후 → 왕 (공물·군사)
      const from = [x < 320 ? x + LW + 4 : x - 4, ty], to = [x < 320 ? 240 : 400, y < 150 ? 140 : 220];
      body += shown(3, flow([from, to], C.orange, { w: 4 }));
    });
    body += at(3, 'pop', tag(320, 290, '공물·군사', HOT, { size: 20 }), 0.4);
    body += at(4, 'pop', tag(320, 38, '봉건제', HOT, { size: 26 }));
    LAND.forEach(([x, y]) => { body += glowRect(x, y, LW, LH, 4, C.orange, 0.3, 12); });
    put(KEY('2', '봉건제'), svg(id, body, css));
  })();

  // ── 민주 정치: 아테네 민회 — 성인 남자 시민이 모여 손 들어 정하고, 관리도 제비뽑기 ──
  (function () {
    const id = 't81-h2-minju';
    let css = base(id), body = '';
    const O = [240, 330], ROWS = [[92, 5], [134, 7], [176, 9], [218, 11]];
    const seats = [];
    ROWS.forEach(([r, n]) => { for (let k = 0; k < n; k++) { const a = Math.PI * (1.08 + (0.84 * k) / (n - 1)); seats.push([O[0] + r * Math.cos(a), O[1] + r * Math.sin(a) + 18]); } });
    seats.forEach(([x, y], i) => { body += at(1, 'rise', person(x, y, C.blue, 0.8), f(0.05 * i)); });
    // 연단과 말하는 사람
    body += at(1, 'pop', `<rect x="206" y="326" width="68" height="20" rx="4" fill="${C.line}"/>`);
    body += `<g class="b1 h4">${g('pop pop1', tag(240, 62, '성인 남자 시민', COLD, { size: 20 }), 0.9)}</g>`;
    // 들어가지 못한 사람
    body += at(1, 'fin', `<path d="M478 92 V344" stroke="${C.muted}" stroke-width="3" stroke-dasharray="8 7"/>`, 1.0);
    [['여성', 140], ['노예', 222], ['외국인', 304]].forEach(([w, y], i) => { body += at(1, 'pop', person(518, y, C.muted, 1.1) + text(542, y - 10, w, { size: 19, anchor: 'start', color: C.muted }), 1.1 + i * 0.15); });
    // 2칸: 앞에 나가 말하고, 손 들어 정한다
    body += at(2, 'pop', person(240, 326, C.orange, 1.1));
    body += ring(240, 300, 20, 2, C.orange, 0.2);
    seats.forEach(([x, y], i) => { if (i % 4 !== 1) body += at(2, 'rise', `<path d="M${f(x + 7)} ${f(y - 16)} V${f(y - 34)}" stroke="${C.blue}" stroke-width="3.5" stroke-linecap="round"/><circle cx="${f(x + 7)}" cy="${f(y - 35)}" r="3.5" fill="${C.blue}"/>`, f(0.5 + 0.03 * i)); });
    // 3칸: 제비뽑기 — 고리가 자리를 옮겨 다니다 한 사람에게 멈춘다
    const pick = seats[16], hop = [seats[3], seats[24], seats[9], seats[29], pick];
    let kf = '';
    hop.forEach(([x, y], k) => { kf += `${Math.round((k * 100) / (hop.length - 1))}% { transform: translate(${f(x)}px, ${f(y - 16)}px); } `; });
    css += `@keyframes ${id}-lot { ${kf} } .on3 .sc-${id} .lot { animation: ${id}-lot 1.6s steps(1, end) both; } .sc-${id} .lot { transform: translate(${f(hop[0][0])}px, ${f(hop[0][1] - 16)}px); }`;
    body += `<g class="b3"><g class="lot"><circle r="19" fill="none" stroke="${C.orange}" stroke-width="4"/></g></g>`;
    body += at(3, 'pop', tag(pick[0], pick[1] - 54, '관리', HOT, { size: 19 }), 1.7);
    body += at(4, 'pop', tag(240, 62, '민주 정치', HOT, { size: 26 }));
    put(KEY('2', '민주 정치'), svg(id, body, css));
  })();

  // ── 공화정 · 제정: 로마의 다스리는 짜임 — 왕을 몰아낸 뒤 집정관·원로원·민회가 나누어 맡다가, 황제 한 사람에게 모인다 ──
  const ORG = [['집정관 2명', 120, 2], ['원로원', 320, 4], ['민회', 520, 4]];
  const romeBase = (n, weak = false) => {
    let o = '';
    ORG.forEach(([w, x, k], i) => {
      o += at(n, 'pop', (weak ? '<g class="weak">' : '<g>') + `<rect x="${x - 80}" y="150" width="160" height="96" rx="12" fill="white" stroke="${C.ink}" stroke-width="3"/>` + text(x, 180, w, { size: 20 }) +
        Array.from({ length: k }, (_, j) => person(x - (k - 1) * 17 + j * 34, 238, i === 1 ? C.purple : i === 0 ? C.orange : C.blue, 1)).join('') + '</g>', 0.15 + i * 0.2);
    });
    for (let j = 0; j < 9; j++) o += at(n, 'rise', person(160 + j * 40, 346, C.green, 0.9), 0.5 + j * 0.05);
    o += at(n, 'fin', text(560, 336, '시민', { size: 19, color: C.green }), 0.9);
    return o;
  };
  (function () {
    const id = 't81-h2-gonghwa';
    let css = base(id), body = '';
    body += at(1, 'pop', person(320, 110, C.purple, 1.5) + crown(320, 64, 1.3));
    body += shown(1, `<path class="draw draw1" pathLength="1" style="transition-delay:.9s" d="M290 40 L350 112 M350 40 L290 112" stroke="${C.red}" stroke-width="7" stroke-linecap="round"/>`);
    body += at(1, 'pop', tag(420, 76, '왕', GRAY, { size: 20 }), 0.4);
    body += romeBase(2);
    body += shown(2, flow([[200, 312], [140, 254]], C.green, { w: 4 }) + flow([[440, 312], [500, 254]], C.green, { w: 4 }));
    body += at(2, 'pop', tag(92, 292, '뽑음', OK, { size: 18 }) + tag(548, 292, '뽑음', OK, { size: 18 }), 1.0);
    body += at(2, 'pop', tag(120, 124, '임기 1년', HOT, { size: 18 }), 1.2);
    body += shown(3, `<path d="M206 198 H234 M406 198 H434" stroke="${C.muted}" stroke-width="4" stroke-linecap="round"/>` + head(234, 198, 0, C.muted, 4) + head(206, 198, Math.PI, C.muted, 4) + head(434, 198, 0, C.muted, 4) + head(406, 198, Math.PI, C.muted, 4));
    body += at(3, 'pop', tag(530, 60, '공화정', HOT, { size: 26 }), 0.3);
    ORG.forEach(([, x]) => { body += glowRect(x - 80, 150, 160, 96, 3, C.orange, 0.3, 12); });
    put(KEY('2', '공화정'), svg(id, body, css));
  })();
  (function () {
    const id = 't81-h2-jejeong';
    let css = base(id), body = '';
    body += romeBase(1, true);
    // 2칸: 권력이 한 사람에게 모인다
    ORG.forEach(([, x], i) => {
      body += shown(2, T(x, 160, mover([[0, 0], [320 - x, 90 - 160]], `<circle r="11" fill="${C.yellow}" stroke="${C.orange}" stroke-width="2.5"/>`, 0.1 + i * 0.15)), 3);
    });
    body += at(2, 'pop', person(320, 110, C.red, 1.5) + `<path d="M306 64 Q320 54 334 64" stroke="${C.green}" stroke-width="4" fill="none" stroke-linecap="round"/>`, 1.3);
    body += at(2, 'pop', tag(420, 76, '황제', HOT, { size: 20 }) + text(200, 84, '옥타비아누스', { size: 19, color: C.red }), 1.5);
    // 3칸: 원로원은 남았지만 힘이 약해진다
    css += `.on3 .sc-${id} .weak { opacity: .4; } .sc-${id} .weak { transition: opacity .8s ease .2s; }`;
    [[300, 150], [320, 320], [340, 490]].forEach(([sx, x]) => { body += shown(3, flow([[sx, 118], [x, 146]], C.red, { w: 4 })); });
    body += at(3, 'pop', tag(530, 40, '제정', HOT, { size: 26 }), 0.3);
    body += ring(320, 90, 30, 3, C.red, 0.3);
    put(KEY('2', '제정'), svg(id, body, css));
  })();

  // ── 법가: 엄한 법 — 공을 세우면 상, 법을 어기면 벌, 신분이 높든 낮든 같은 법 ──
  (function () {
    const id = 't81-h2-beopga';
    let css = base(id), body = '';
    body += at(1, 'drop', `<rect x="270" y="26" width="100" height="112" rx="10" fill="${C.lilac}" stroke="${C.purple}" stroke-width="3"/><path d="M286 26 Q320 8 354 26" fill="${C.lilac}" stroke="${C.purple}" stroke-width="3"/>` + text(320, 100, '법', { size: 46, color: C.purple }));
    body += at(1, 'pop', tag(320, 162, '엄한 법', OLD, { size: 20 }), 0.6);
    // 2칸: 상과 벌
    body += shown(2, flow([[262, 90], [150, 170]], C.green, { w: 4 }) + flow([[378, 90], [490, 170]], C.red, { w: 4 }));
    body += at(2, 'pop', person(120, 262, C.green, 1.4) + star(150, 196, 13) + tag(120, 290, '공을 세움', OK, { size: 18 }), 0.3);
    body += at(2, 'pop', `<circle cx="72" cy="196" r="15" fill="${C.yellow}" stroke="${C.orange}" stroke-width="3"/>` + text(72, 203, '상', { size: 18 }), 0.9);
    body += at(2, 'pop', person(520, 262, C.muted, 1.4) + tag(520, 290, '법을 어김', GRAY, { size: 18 }), 0.5);
    body += at(2, 'pop', `<rect x="552" y="180" width="40" height="32" rx="6" fill="white" stroke="${C.red}" stroke-width="3"/>` + text(572, 203, '벌', { size: 18, color: C.red }), 1.1);
    // 3칸: 높은 사람도 낮은 사람도 같은 법
    body += at(3, 'pop', person(280, 330, C.purple, 1.25) + `<rect x="270" y="268" width="20" height="16" rx="2" fill="${C.purple}"/>`, 0.2);
    body += at(3, 'pop', person(360, 330, C.green, 1.25), 0.35);
    body += shown(3, `<path class="draw draw3" pathLength="1" style="transition-delay:.5s" d="M320 180 V236 M280 248 V236 H360 V248" stroke="${C.purple}" stroke-width="4" fill="none" stroke-linejoin="round"/>`);
    body += at(3, 'pop', text(220, 314, '귀족', { size: 18, color: C.purple }) + text(420, 314, '백성', { size: 18, color: C.green }), 0.8);
    body += at(4, 'pop', tag(530, 50, '법가', HOT, { size: 26 }), 0.2);
    body += glowRect(270, 26, 100, 112, 4, C.orange, 0.3, 10);
    put(KEY('2', '법가'), svg(id, body, css));
  })();

  // ── 군현제: 나라를 군·현으로 나누고 황제가 관리를 보낸다(물려줄 수 없고 언제든 바꾼다) ──
  (function () {
    const id = 't81-h2-gunhyeon';
    let css = base(id), body = '';
    const GX = 210, GY = 32, W = 134, H = 148;
    body += at(1, 'fin', `<rect x="${GX}" y="${GY}" width="${W * 3}" height="${H * 2}" rx="10" fill="${C.mint}" stroke="${C.green}" stroke-width="3"/>`);
    body += shown(1, `<path class="draw draw1" pathLength="1" d="M${GX + W} ${GY} V${GY + 2 * H} M${GX + 2 * W} ${GY + 2 * H} V${GY} M${GX + 3 * W} ${GY + H} H${GX}" stroke="${C.green}" stroke-width="4" fill="none"/>`);
    let thin = '';
    for (let c = 0; c < 3; c++) for (let r = 0; r < 2; r++) { const x = GX + c * W, y = GY + r * H; thin += `M${x + W / 2} ${y + 8} V${y + H - 8} M${x + 8} ${y + H / 2} H${x + W - 8}`; }
    body += shown(1, `<path class="draw draw1" pathLength="1" style="transition-delay:.9s" d="${thin}" stroke="${C.green}" stroke-width="1.8" fill="none" opacity=".7"/>`);
    body += at(1, 'pop', tag(GX + 34, GY + 26, '군', OK, { size: 19 }), 1.0) + at(1, 'pop', tag(GX + W / 2 + 32, GY + H / 2 + 28, '현', PLAIN, { size: 18 }), 1.3);
    // 황제와 수도
    body += at(1, 'pop', `<circle cx="96" cy="180" r="62" fill="${C.lilac}" stroke="${C.purple}" stroke-width="3"/>` + person(96, 200, C.purple, 1.5) + crown(96, 154, 1.3) + text(96, 226, '황제', { size: 19, color: C.purple }), 0.2);
    // 2칸: 관리를 보낸다 / 3칸: 한 사람을 바꾼다
    const official = (color) => person(0, 0, color, 1.05) + `<rect x="-7" y="-41" width="14" height="7" rx="2" fill="${C.ink}"/>`;
    for (let c = 0; c < 3; c++) for (let r = 0; r < 2; r++) {
      const k = c * 2 + r, tx = GX + c * W + W * 0.75, ty = GY + r * H + H * 0.42, back = k === 3;
      const pts = [[0, 0], [tx - 120, ty - 196]];
      if (back) pts.push([0, 0]);
      body += shown(2, T(120, 196, `<g class="${back ? 'gone' : ''}">${mover(pts, official(C.blue), 0.1 + k * 0.08)}</g>`));
    }
    // 바뀐 관리
    const [nx, ny] = [GX + 1 * W + W * 0.75, GY + 1 * H + H * 0.42];
    body += shown(3, T(120, 196, mover([[0, 0], [0, 0], [nx - 120, ny - 196]], official(C.orange), 0.5)));
    css += `.sc-${id} .gone { transition: opacity .6s ease .9s; } .on3 .sc-${id} .gone { opacity: 0; }`;
    body += at(3, 'pop', tag(GX + W * 1.27, GY + H * 1.75, '새 관리', HOT, { size: 18 }), 1.6);
    body += at(4, 'pop', tag(96, 60, '군현제', HOT, { size: 24 }), 0.2);
    body += glowRect(GX, GY, W * 3, H * 2, 4, C.orange, 0.3, 10);
    put(KEY('2', '군현제'), svg(id, body, css));
  })();
})(typeof window !== 'undefined' ? window : globalThis);
