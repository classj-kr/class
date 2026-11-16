(function (root) {
  'use strict';
  const { C, svg, text, put } = root.FigureKit;
  const KEY = (u, w) => `7-2/사회/${u}/${w}`;
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

  // 사회 7-2 넷째 묶음: 보편성·특수성, 정치권력·정당성, 국민 주권·국민 자치·입헌주의, 법 이름 다섯(형법·민법·노동법·경제법·사회 보장법), 사법권의 독립

  // 국가 기관 건물(창문 두 줄과 깃발): 밑 가운데 (x, y)
  const govt = (x, y, w = 120, h = 70) => `<rect x="${x - w / 2}" y="${y - h}" width="${w}" height="${h}" fill="white" stroke="${C.blue}" stroke-width="3"/>` +
    [0, 1].map((r) => [0, 1, 2].map((c) => `<rect x="${f(x - w / 2 + 14 + c * (w - 28) / 3)}" y="${y - h + 12 + r * 24}" width="${f((w - 28) / 3 - 8)}" height="13" fill="${C.sky}"/>`).join('')).join('') +
    `<path d="M${x} ${y - h} V${y - h - 22}" stroke="${C.ink}" stroke-width="2.5"/><path d="M${x} ${y - h - 22} H${x + 18} V${y - h - 12} H${x} Z" fill="${C.red}"/>`;
  // 왕관: 가운데 (x, y)
  const crown = (x, y, s = 1) => `<path d="M${f(x - 26 * s)} ${f(y + 12 * s)} L${f(x - 30 * s)} ${f(y - 14 * s)} L${f(x - 14 * s)} ${f(y - 2 * s)} L${x} ${f(y - 20 * s)} L${f(x + 14 * s)} ${f(y - 2 * s)} L${f(x + 30 * s)} ${f(y - 14 * s)} L${f(x + 26 * s)} ${f(y + 12 * s)} Z" fill="${C.yellow}" stroke="${C.orange}" stroke-width="3" stroke-linejoin="round"/>`;

  // ── 보편성·특수성: 세 나라 모두 생일을 축하하지만(보편) 먹는 음식은 다르다(특수) ──
  const cultureFig = (word, id) => {
    const uni = word === '보편성';
    let css = base(id);
    let body = '';
    const X = [110, 320, 530], NAME = ['우리나라', '가 나라', '나 나라'];
    const bowl = (x, y) => `<path d="M${x - 38} ${y - 8} H${x + 38} Q${x + 38} ${y + 28} ${x} ${y + 28} Q${x - 38} ${y + 28} ${x - 38} ${y - 8} Z" fill="white" stroke="${C.ink}" stroke-width="3"/>`;
    const FOOD = [
      (x, y) => bowl(x, y) + `<path d="M${x - 26} ${y - 2} Q${x - 16} ${y - 12} ${x - 6} ${y - 2} T${x + 14} ${y - 2} T${x + 30} ${y - 4}" stroke="${C.green}" stroke-width="4" fill="none" stroke-linecap="round"/>`,
      (x, y) => bowl(x, y) + `<path d="M${x - 8} ${y - 2} C${x - 10} ${y - 30} ${x + 4} ${y - 40} ${x + 6} ${y - 58} M${x + 2} ${y - 2} C${x} ${y - 30} ${x + 14} ${y - 40} ${x + 16} ${y - 58}" stroke="${C.orange}" stroke-width="3" fill="none"/><path d="M${x + 2} ${y - 66} L${x + 26} ${y - 40} M${x + 10} ${y - 70} L${x + 34} ${y - 44}" stroke="${C.ink}" stroke-width="3" stroke-linecap="round"/>`,
      (x, y) => `<rect x="${x - 40}" y="${y - 10}" width="80" height="38" rx="6" fill="${C.peach}" stroke="${C.orange}" stroke-width="3"/><path d="M${x - 40} ${y + 4} H${x + 40}" stroke="white" stroke-width="4"/>` + [-20, 0, 20].map((d) => `<rect x="${x + d - 3}" y="${y - 32}" width="6" height="22" fill="${C.blue}"/><path d="M${x + d} ${y - 44} Q${x + d + 6} ${y - 36} ${x + d} ${y - 33} Q${x + d - 6} ${y - 36} ${x + d} ${y - 44} Z" fill="${C.orange}"/>`).join('')
    ];
    const FNAME = ['미역국', '긴 국수', '케이크'];
    X.forEach((x, i) => {
      body += at(1, 'pop', `<rect x="${x - 96}" y="60" width="192" height="276" rx="14" fill="white" stroke="${C.muted}" stroke-width="3"/>` + text(x, 92, NAME[i], { size: 21 }), i * 0.25);
      body += at(uni ? 2 : 1, 'pop', tag(x, 140, '생일 축하', OK, { size: 19 }), uni ? 0.3 + i * 0.35 : 0.5 + i * 0.25);
      if (uni) {
        // 생일 모임: 풍선 셋과 모인 사람들(세 나라 모두 같다)
        const bal = [-26, 0, 26].map((d, j) => `<path d="M${x + d} ${222 - (j === 1 ? 10 : 0)} V${262}" stroke="${C.muted}" stroke-width="2"/><ellipse cx="${x + d}" cy="${206 - (j === 1 ? 10 : 0)}" rx="13" ry="16" fill="${[C.orange, C.yellow, C.blue][j]}"/>`).join('');
        body += at(2, 'pop', `<g class="bob" style="animation-delay:${i * 0.3}s">${bal}</g>` + person(x - 30, 314, C.green, 1.1) + person(x, 314, C.purple, 1.1) + person(x + 30, 314, C.orange, 1.1), 0.6 + i * 0.35);
      }
      if (!uni) {
        body += at(2, 'pop', FOOD[i](x, 232) + text(x, 300, FNAME[i], { size: 20, color: [C.green, C.orange, C.blue][i] }), 0.3 + i * 0.5);
        body += glowRect(x - 80, 178, 160, 136, 3, [C.green, C.orange, C.blue][i], 0.3 + i * 0.3, 12);
      }
    });
    if (uni) {
      body += shown(3, drawn(3, `M${X[0] + 52} 140 H${X[1] - 52} M${X[1] + 52} 140 H${X[2] - 52}`, C.orange, 4));
      X.forEach((x, i) => { body += glowRect(x - 56, 120, 112, 40, 3, C.orange, 0.8 + i * 0.2, 20); });
    }
    body += at(uni ? 3 : 3, 'pop', tag(320, 30, word, HOT, { size: 24 }));
    put(KEY('8', word), svg(id, body, css));
  };
  cultureFig('보편성', 't72-so-bopyeon');
  cultureFig('특수성', 't72-so-teuksu');

  // ── 정치권력·정당성: 위에서 내려가는 결정, 아래에서 받쳐 주는 동의 ──
  const powerFig = (word, id, unit) => {
    const legit = word === '정당성';
    let css = base(id);
    let body = '';
    const PXs = [100, 170, 240, 310, 380, 450, 520], PY = 344;
    PXs.forEach((x, k) => { body += at(1, 'pop', `<g class="${legit ? '' : 'wk'}" style="animation-delay:${k * 0.15}s">${person(x, PY, [C.green, C.blue, C.purple, C.orange][k % 4], 1.3)}</g>`, k * 0.08); });
    css += `
      .on3 .sc-${id} .wk { animation: ${id}-bob 1.4s ease-in-out infinite; }`;
    body += at(1, 'rise', govt(320, 128, 150, 76), 0.4);
    body += at(1, 'pop', text(190, 98, '국가 기관', { size: 20, color: C.blue }), 0.7);
    // 위에서 아래로 퍼지는 결정
    const downN = legit ? 1 : 2;
    let fan = '';
    PXs.forEach((x) => { fan += flow([[320 + (x - 320) * 0.18, 138], [x, PY - 58]], legit ? C.muted : C.blue, { w: 3.5 }); });
    body += shown(downN, g(`fin fin${downN}`, fan, legit ? 0.9 : 0.6));
    body += at(downN, 'pop', tag(320, 190, '결정', legit ? PLAIN : COLD, { size: 20 }), legit ? 1.2 : 0.2);
    if (!legit) {
      PXs.forEach((x, k) => { body += at(3, 'pop', check(x, PY - 62, 0.6), 0.2 + k * 0.12); });
      body += at(4, 'pop', tag(500, 50, '정치권력', HOT, { size: 24 }));
      body += glowRect(240, 40, 160, 94, 4, C.orange, 0.3, 8);
    } else {
      // 2칸: 선거라는 옳은 절차로 세웠다
      body += at(2, 'pop', ballotBox(560, 196), 0);
      [[380, PY - 48], [450, PY - 48], [520, PY - 48]].forEach(([x, y], k) => { body += `<g class="b2">${mover([[0, 0], [560 - x, 192 - y]], ballot(x, y), 0.3 + k * 0.25)}</g>`; });
      body += shown(2, g('fin fin2', flowQ([560, 186], [500, 90], [400, 96], C.purple, { w: 4 }), 1.4));
      body += at(2, 'pop', tag(560, 286 - 8, '선거', OLD, { size: 18 }), 0.6);
      // 3칸: 아래에서 받쳐 주는 동의 기둥
      [150, 250, 390, 490].forEach((x, k) => {
        body += shown(3, `<path class="draw draw3" pathLength="1" style="transition-delay:${0.2 + k * 0.2}s" d="M${x} ${PY - 60} L${320 + (x - 320) * 0.35} 132" stroke="${C.green}" stroke-width="7" stroke-linecap="round"/>`);
      });
      body += at(3, 'pop', tag(320, 250, '동의', OK, { size: 21 }), 1);
      body += at(4, 'pop', tag(170, 40, '정당성', HOT, { size: 24 }));
      body += glowRect(240, 40, 160, 94, 4, C.green, 0.3, 8);
    }
    put(KEY(unit, word), svg(id, body, css));
  };
  powerFig('정치권력', 't72-so-gwonryeok', '9');
  powerFig('정당성', 't72-so-jeongdang', '10');

  // ── 국민 주권: 가장 높은 힘(왕관)이 왕 한 사람에게서 국민 모두에게로 ──
  (function () {
    const id = 't72-so-jugwon';
    let css = base(id);
    let body = '';
    const PXs = [110, 180, 250, 320, 390, 460, 530], PY = 344;
    PXs.forEach((x, k) => { body += at(1, 'pop', person(x, PY, [C.green, C.blue, C.purple, C.orange][k % 4], 1.3), k * 0.08); });
    // 왕: 2칸부터 흐려지고 사라진다
    body += `<g class="b1 h2">${g('pop pop1', person(320, 150, C.purple, 2.2), 0.3)}</g>`;
    body += `<g class="b1 h2">${g('fin fin1', [110, 250, 390, 530].map((x) => flow([[320, 160], [x, PY - 62]], C.purple, { w: 3 })).join(''), 0.9)}</g>`;
    // 왕관(주권): 왕의 머리에서 국민 위로
    body += `<g class="b1">${mover([[0, 0], [0, 140]], crown(320, 72, 1.2) + text(320, 44 - 4, '주권', { size: 20, color: C.orange }), 0.2)}</g>`;
    body += shown(2, drawn(2, `M${PXs[0]} 258 Q320 236 ${PXs[6]} 258`, C.orange, 4));
    PXs.forEach((x, k) => { const t = (x - PXs[0]) / (PXs[6] - PXs[0]), ay = 258 - 44 * t * (1 - t); body += shown(2, `<path class="draw draw2" pathLength="1" style="transition-delay:${1.2 + k * 0.08}s" d="M${x} ${f(ay)} V292" stroke="${C.orange}" stroke-width="2.5"/>`); });
    // 3칸: 국민이 뜻을 모아 나랏일을 정한다 → 국가 기관
    body += at(3, 'rise', govt(320, 150, 140, 70), 0);
    body += shown(3, g('fin fin3', flow([[180, 224], [252, 150]], C.green, { w: 4 }) + flow([[460, 224], [388, 150]], C.green, { w: 4 }), 0.5));
    body += at(3, 'pop', tag(140, 120, '국민의 뜻', OK, { size: 19 }), 0.9);
    body += at(4, 'pop', tag(510, 60, '국민 주권', HOT, { size: 24 }));
    body += glowRect(80, 196, 480, 156, 4, C.orange, 0.3, 16);
    put(KEY('9', '국민 주권'), svg(id, body, css));
  })();

  // ── 국민 자치: 국민이 직접(국민 투표) 또는 대표를 통해 나랏일을 한다 ──
  (function () {
    const id = 't72-so-jachi';
    let css = base(id);
    let body = '';
    const P = [];
    for (let r = 0; r < 2; r++) for (let c = 0; c < 4; c++) P.push([60 + c * 48 + r * 22, 270 + r * 66]);
    P.forEach(([x, y], k) => { body += at(1, 'pop', person(x, y, [C.green, C.blue, C.purple, C.orange][k % 4], 1.2), k * 0.06); });
    body += at(1, 'pop', crown(150, 186, 0.9) + text(150, 222, '주권', { size: 18, color: C.orange }), 0.6);
    // 나랏일
    body += at(1, 'rise', box(520, 120, 150, 70, '나랏일', COLD, 22, 12), 0.4);
    // 2칸: 직접(국민 투표)
    body += shown(2, g('fin fin2', flowQ([210, 168], [330, 70], [442, 108], C.green, { w: 5 }), 0.2));
    body += at(2, 'pop', tag(320, 70, '국민 투표', OK, { size: 19 }), 0.6);
    // 3칸: 대표를 통해
    body += at(3, 'pop', [-28, 0, 28].map((d, k) => person(380 + d, 296, [C.green, C.blue, C.orange][k], 1.3, { tie: true })).join('') + text(380, 330, '대표', { size: 19, color: C.purple }), 0.3);
    body += shown(3, g('fin fin3', flow([[262, 290], [338, 290]], C.purple, { w: 4.5 }), 0.1) + g('fin fin3', flowQ([420, 260], [500, 230], [514, 162], C.purple, { w: 4.5 }), 0.8));
    body += at(3, 'pop', tag(300, 256, '선거', OLD, { size: 18 }), 0.4);
    body += at(4, 'pop', tag(170, 40, '국민 자치', HOT, { size: 24 }));
    body += glowRect(30, 160, 240, 190, 4, C.orange, 0.3, 14);
    put(KEY('9', '국민 자치'), svg(id, body, css));
  })();

  // ── 입헌주의: 권력이 헌법 울타리 안에서만 쓰여 국민의 기본권이 지켜진다 ──
  (function () {
    const id = 't72-so-ipheon';
    let css = base(id);
    let body = '';
    body += at(1, 'rise', govt(320, 214, 140, 76), 0);
    body += at(1, 'pop', text(320, 240, '권력', { size: 21, color: C.blue }), 0.3);
    const PP = [[70, 150], [70, 300], [570, 150], [570, 300]];
    PP.forEach(([x, y], k) => { body += at(1, 'pop', person(x, y, [C.green, C.orange, C.purple, C.blue][k], 1.4), 0.4 + k * 0.1); });
    // 1칸: 권력이 마음대로 뻗어 사람에게 닿는다
    body += `<g class="b1 h2">${g('fin fin1', PP.map(([x, y]) => flow([[320 + (x < 320 ? -74 : 74), 180], [x + (x < 320 ? 26 : -26), y - 24]], C.red, { w: 4 })).join(''), 0.8)}</g>`;
    body += `<g class="b1 h2">${PP.map(([x, y], k) => g('pop pop1', `<g class="jig">${qmark(x, y - 66, 14)}</g>`, 1.2 + k * 0.1)).join('')}</g>`;
    // 2칸: 헌법 울타리
    body += shown(2, drawn(2, 'M196 60 H444 V264 H196 Z', C.purple, 6, ' stroke-dasharray="1"'));
    // 4칸 테두리는 헌법 꼬리표 아래에 깐다(꼬리표 글자를 가리지 않게)
    body += glowRect(192, 56, 256, 212, 4, C.orange, 0.3, 4);
    body += at(2, 'pop', tag(320, 60, '헌법', OLD, { size: 22 }), 1.2);
    body += shown(2, g('fin fin2', [[-1, 160], [1, 160], [-1, 236], [1, 236]].map(([s, y]) => flow([[320 + s * 74, y], [320 + s * 118, y]], C.blue, { w: 4 })).join(''), 1.4));
    // 3칸: 기본권이 지켜진다
    PP.forEach(([x, y], k) => { body += at(3, 'pop', `<circle cx="${x}" cy="${y - 66}" r="16" fill="white" stroke="${C.green}" stroke-width="3"/>` + check(x, y - 65, 0.65), 0.2 + k * 0.2); });
    body += at(3, 'pop', tag(120, 336, '기본권', OK, { size: 19 }) + tag(520, 336, '기본권', OK, { size: 19 }), 1);
    body += at(4, 'pop', tag(320, 316, '입헌주의', HOT, { size: 24 }));
    put(KEY('9', '입헌주의'), svg(id, body, css));
  })();

  // ── 법 이름 다섯(형법·민법·노동법·경제법·사회 보장법): 법의 나무에서 자리를 찾고, 다루는 일을 펼친다 ──
  const LEAF = {
    '형법': { cat: 0, panel: [['범죄', '사기·폭행'], ['형벌', '벌금·징역']], arrow: true },
    '민법': { cat: 1, panel: [['재산 관계', '계약·빌리기'], ['가족 관계', '결혼·입양']] },
    '노동법': { cat: 2, panel: [['일하는 시간', ''], ['임금', ''], ['쉬는 날', '']] },
    '경제법': { cat: 2, panel: [['공정한 경쟁', ''], ['소비자 보호', '거짓 광고 막기']] },
    '사회 보장법': { cat: 2, panel: [['질병·실업·노령', ''], ['국가의 도움', '']], arrow: true }
  };
  const lawLeafFig = (word, id) => {
    const L = LEAF[word];
    const CAT = [['공법', 110, OLD], ['사법', 320, COLD], ['사회법', 530, OK]];
    const LAWS = [['헌법', 76, 156, 0], ['형법', 146, 156, 0], ['민법', 286, 156, 1], ['상법', 356, 156, 1], ['노동법', 478, 156, 2], ['경제법', 580, 156, 2], ['사회 보장법', 530, 200, 2]];
    let css = base(id);
    let body = '';
    body += at(1, 'pop', tag(320, 30, '법', PLAIN, { size: 22 }));
    body += shown(1, drawn(1, 'M320 48 V64 M110 80 V64 H530 V80 M320 64 V80', C.muted, 3));
    CAT.forEach(([name, x, col], i) => {
      const one = at(1, 'pop', tag(x, 98, name, col, { size: 21 }), 0.3 + i * 0.2);
      body += i === L.cat ? one : dimFrom(2, one);
    });
    LAWS.forEach(([name, x, y, c]) => {
      const [, cx, col] = CAT[c];
      const line = shown(1, drawn(1, name === '사회 보장법' ? `M${cx} 116 V${y - 16}` : `M${cx} 116 L${x} ${y - 16}`, col[1], 2.5));
      const t = at(1, 'pop', tag(x, y, name, name === word ? HOT : ['white', col[1]], { size: 18 }), 0.9 + (x / 640) * 0.6);
      body += name === word ? line + t : dimFrom(2, line + t);
    });
    body += ring(LAWS.find((l) => l[0] === word)[1], LAWS.find((l) => l[0] === word)[2], 40, 2, C.orange, 0.4);
    // 3칸: 다루는 일
    const [, , col] = CAT[L.cat];
    body += at(3, 'rise', `<rect x="30" y="232" width="580" height="118" rx="14" fill="white" stroke="${col[1]}" stroke-width="3"/>`, 0);
    const n = L.panel.length, xs = n === 2 ? [190, 450] : [130, 320, 510];
    L.panel.forEach(([a, b], i) => {
      body += at(3, 'pop', tag(xs[i], b ? 276 : 291, a, HOT, { size: 21 }) + (b ? text(xs[i], 326, b, { size: 19, color: C.muted, weight: 600 }) : ''), 0.4 + i * 0.4);
    });
    if (L.arrow) body += shown(3, g('fin fin3', flow([[xs[0] + 84, b0y(L)], [xs[1] - 84, b0y(L)]], C.orange, { w: 5 }), 0.8));
    body += at(4, 'pop', tag(110, 30, word, HOT, { size: 22 }), 0);
    body += glowRect(30, 232, 580, 118, 4, C.orange, 0.3, 14);
    put(KEY('11', word), svg(id, body, css));
  };
  const b0y = (L) => (L.panel[0][1] ? 276 : 291);
  ['형법', '민법', '노동법', '경제법', '사회 보장법'].forEach((w, i) => lawLeafFig(w, ['t72-so-hyeongbeop', 't72-so-minbeop', 't72-so-nodongbeop', 't72-so-gyeongjebeop', 't72-so-sahoebojang'][i]));

  // ── 사법권의 독립: 국회·정부·다른 세력의 간섭이 법원 둘레의 울타리에서 막힌다 ──
  (function () {
    const id = 't72-so-dongnip';
    let css = base(id);
    let body = '';
    const CX = 320, CY = 214, R = 120;
    body += at(1, 'rise', hall(CX, 262, 150, 80, OLD), 0);
    body += at(1, 'pop', person(CX, 254, C.ink, 1.5), 0.4);
    body += at(1, 'pop', text(CX, 134, '법원', { size: 21, color: C.purple }), 0.6);
    const SRC = [['국회', 90, 70], ['정부', 550, 70], ['힘센 세력', 550, 320]];
    SRC.forEach(([w, x, y], i) => {
      body += at(2, 'pop', tag(x, y, w, ['white', C.red], { size: 20 }), i * 0.25);
      const ang = Math.atan2(CY - y, CX - x), ex = CX - Math.cos(ang) * (R + 10), ey = CY - Math.sin(ang) * (R + 10);
      const sx = x + Math.cos(ang) * 50, sy = y + Math.sin(ang) * 24;
      // 2칸: 법원까지 밀고 들어오는 화살, 3칸: 울타리에서 멈춘 짧은 화살
      body += `<g class="b2 h3">${g('fin fin2', flow([[sx, sy], [CX - Math.cos(ang) * 70, CY - Math.sin(ang) * 50]], C.red, { w: 4.5 }), 0.4 + i * 0.25)}</g>`;
      body += shown(3, g('fin fin3', flow([[sx, sy], [ex, ey]], C.red, { w: 4.5 }), 0.6));
    });
    body += shown(3, drawn(3, `M${CX} ${CY - R} A${R} ${R} 0 1 1 ${CX - 0.1} ${CY - R}`, C.purple, 7));
    body += at(3, 'pop', tag(CX, 304, '헌법·법률·양심', OK, { size: 18 }), 1.2);
    body += at(4, 'pop', tag(160, 330, '사법권의 독립', HOT, { size: 22 }));
    body += glowRect(CX - R - 6, CY - R - 6, 2 * R + 12, 2 * R + 12, 4, C.orange, 0.3, R);
    put(KEY('11', '사법권의 독립'), svg(id, body, css));
  })();
})(typeof window !== 'undefined' ? window : globalThis);
