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

  // ════ 12 인권과 기본권 ════

  // 국가 건물(창문 두 줄과 깃발): 밑 가운데 (x, y)
  const govt = (x, y, w = 110, h = 70) => `<rect x="${x - w / 2}" y="${y - h}" width="${w}" height="${h}" fill="white" stroke="${C.blue}" stroke-width="3"/>` +
    [0, 1].map((r) => [0, 1, 2].map((c) => `<rect x="${f(x - w / 2 + 14 + c * (w - 28) / 3)}" y="${y - h + 12 + r * 24}" width="${f((w - 28) / 3 - 8)}" height="13" fill="${C.sky}"/>`).join('')).join('') +
    `<path d="M${x} ${y - h} V${y - h - 22}" stroke="${C.ink}" stroke-width="2.5"/><path d="M${x} ${y - h - 22} H${x + 18} V${y - h - 12} H${x} Z" fill="${C.red}"/>`;
  // 방패: 가운데 (x, y), 크기 s
  const shield = (x, y, s = 1, [fill, stroke] = OK) => `<path d="M${x} ${f(y - 26 * s)} L${f(x + 22 * s)} ${f(y - 18 * s)} V${f(y)} Q${f(x + 22 * s)} ${f(y + 18 * s)} ${x} ${f(y + 28 * s)} Q${f(x - 22 * s)} ${f(y + 18 * s)} ${f(x - 22 * s)} ${f(y)} V${f(y - 18 * s)} Z" fill="${fill}" stroke="${stroke}" stroke-width="3" stroke-linejoin="round"/>`;
  // 번개 화살(해치는 힘): a → b
  const bolt = (a, b, color = C.red) => {
    const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, ang = Math.atan2(b[1] - a[1], b[0] - a[0]), nx = -Math.sin(ang) * 12, ny = Math.cos(ang) * 12;
    return `<path d="M${f(a[0])} ${f(a[1])} L${f(mx + nx)} ${f(my + ny)} L${f(mx - nx)} ${f(my - ny)} L${f(b[0] - 6 * Math.cos(ang))} ${f(b[1] - 6 * Math.sin(ang))}" stroke="${color}" stroke-width="5" fill="none" stroke-linejoin="round" stroke-linecap="round"/>` + head(b[0], b[1], ang, color, 5);
  };

  // ── 기본권과 다섯 갈래: 존엄과 행복 추구권 바탕 위 다섯 기둥, 헌법 지붕 ──
  const RIGHTS = ['자유권', '평등권', '참정권', '사회권', '청구권'];
  const RCOL = [OK, COLD, OLD, HOT, OK];
  const rightsFig = (word, id) => {
    const full = word === '기본권';
    const focus = RIGHTS.indexOf(word);
    // 신전 높이: 전체(기본권)는 화면 가득, 갈래는 위쪽 절반
    const T = full ? { roofTop: 40, roofBase: 112, colTop: 112, colBot: 284, baseBot: 330, lab: 206, size: 21 } : { roofTop: 12, roofBase: 54, colTop: 54, colBot: 152, baseBot: 184, lab: 110, size: 20 };
    let css = base(id) + `
      .sc-${id} .tilt { transform-box: fill-box; transform-origin: 50% 50%; transition: transform 1.4s ease-in-out .3s; transform: rotate(-9deg); }
      .on3 .sc-${id} .tilt { transform: none; }`;
    let body = '';
    const X = [96, 208, 320, 432, 544], W = 92;
    // 바탕
    body += at(1, 'rise', `<rect x="36" y="${T.colBot}" width="568" height="${T.baseBot - T.colBot}" rx="6" fill="${C.peach}" stroke="${C.orange}" stroke-width="3"/>` + text(320, f((T.colBot + T.baseBot) / 2 + 7), '인간의 존엄과 가치·행복 추구권', { size: full ? 20 : 18 }), 0);
    // 기둥
    X.forEach((x, i) => {
      const [fill, stroke] = RCOL[i];
      const pillar = `<rect class="growy growy${full ? 2 : 1}" style="transition-delay:${0.2 + i * 0.25}s" x="${x - W / 2}" y="${T.colTop}" width="${W}" height="${T.colBot - T.colTop}" fill="${fill}" stroke="${stroke}" stroke-width="3"/>`;
      const lab = at(full ? 2 : 1, 'fin', text(x, T.lab, RIGHTS[i], { size: T.size }), 0.8 + i * 0.25);
      const one = shown(full ? 2 : 1, pillar) + lab;
      body += full || i === focus ? one : dimFrom(2, one);
    });
    // 지붕: 헌법
    body += at(full ? 3 : 1, 'drop', `<path d="M24 ${T.roofBase} L320 ${T.roofTop} L616 ${T.roofBase} Z" fill="${C.lilac}" stroke="${C.purple}" stroke-width="3" stroke-linejoin="round"/>` + text(320, T.roofBase - (full ? 16 : 8), '헌법', { size: full ? 24 : 20, color: C.purple }), full ? 0.2 : 1.2);
    if (full) {
      body += at(4, 'pop', tag(320, 350 - 4, '기본권', HOT, { size: 22 }));
      X.forEach((x, i) => { body += glowRect(x - W / 2 - 4, T.colTop - 4, W + 8, T.colBot - T.colTop + 8, 4, C.orange, 0.3 + i * 0.2, 4); });
      put(KEY('12', word), svg(id, body, css));
      return;
    }
    body += glowRect(X[focus] - W / 2 - 4, T.colTop - 4, W + 8, T.colBot - T.colTop + 8, 1, C.orange, 1.6, 4);
    // 아래 장면(y 200~356): 국민과 국가
    const PX = 120, PY = 344, GX = 520, GY = 344;
    const citizen = (s = 1.6) => person(PX, PY, C.green, s) + text(PX - 28, PY - 6, '국민', { size: 19, anchor: 'end', color: C.green });
    const state = () => govt(GX, GY, 116, 70) + text(GX - 14, GY - 78, '국가', { size: 19, anchor: 'end', color: C.blue });
    if (word === '자유권') {
      body += at(1, 'pop', citizen(), 0.4) + at(1, 'rise', state(), 0.6);
      body += shown(2, g('fin fin2', bolt([GX - 70, GY - 24], [PX + 94, GY - 24]), 0.2));
      body += at(2, 'pop', shield(PX + 70, GY - 38, 1.15), 0.9);
      ['몸', '생각', '종교', '직업'].forEach((w, k) => { body += at(3, 'pop', `<g class="bob" style="animation-delay:${k * 0.3}s">${tag(262 + (k % 2) * 92, 248 + Math.floor(k / 2) * 38, w, OK, { size: 18 })}</g>`, 0.2 + k * 0.25); });
    } else if (word === '평등권') {
      body += at(1, 'pop', `<path d="M320 344 V262 M296 344 H344" stroke="${C.ink}" stroke-width="4" stroke-linecap="round"/><circle cx="320" cy="258" r="6" fill="${C.ink}"/>`, 0.4);
      const beam = `<path d="M170 258 H470" stroke="${C.ink}" stroke-width="5" stroke-linecap="round"/>` +
        [170, 470].map((x) => `<path d="M${x} 258 L${x - 34} 300 M${x} 258 L${x + 34} 300" stroke="${C.muted}" stroke-width="2"/><path d="M${x - 44} 300 H${x + 44} Q${x} 322 ${x - 44} 300 Z" fill="${C.line}" stroke="${C.muted}" stroke-width="2"/>`).join('') +
        person(170, 298, C.purple, 1.3) + person(470, 298, C.orange, 1.3);
      body += `<g class="b1"><g class="tilt">${g('pop pop1', beam, 0.6)}</g></g>`;
      body += at(2, 'pop', tag(170, 204, '성별', PLAIN, { size: 18 }) + tag(470, 204, '종교', PLAIN, { size: 18 }), 0.2);
      body += `<g class="b2 h3">${g('pop pop2', cross(320, 206, 12), 0.8)}</g>`;
      body += at(3, 'pop', text(320, 250, '=', { size: 34, color: C.green }), 1.6);
    } else if (word === '참정권') {
      body += at(1, 'pop', citizen(), 0.4) + at(1, 'rise', state(), 0.6);
      body += shown(2, g('fin fin2', flowQ([PX + 30, GY - 60], [320, 210], [GX - 66, GY - 50], C.purple, { w: 4 }), 0.2));
      body += `<g class="b2">${mover([[0, 0], [GX - 70 - PX - 30, -12]], ballot(PX + 30, GY - 60), 0.4)}</g>`;
      body += at(2, 'pop', tag(320, 236, '투표', OLD, { size: 18 }), 0.8);
      body += `<g class="b3">${mover([[0, 0], [0, 0], [GX - 20 - 240, 0]], person(240, PY, C.purple, 1.4, { tie: true }), 0.3)}</g>`;
      body += at(3, 'pop', tag(380, 300, '공직 맡기', OLD, { size: 18 }), 1.2);
    } else if (word === '사회권') {
      body += at(1, 'pop', citizen(), 0.4) + at(1, 'rise', state(), 0.6);
      body += shown(2, g('fin fin2', flow([[PX + 40, 240], [GX - 76, 240]], C.orange, { w: 4 }), 0.2));
      body += at(2, 'pop', tag(320, 240, '요구', HOT, { size: 18 }), 0.6);
      ['교육', '일자리', '인간다운 생활'].forEach((w, k) => {
        const y = 278 + k * 30, w0 = tagW(w, 18), sx = GX - 80 - w0 / 2, fx = PX + 56 + w0 / 2;
        body += `<g class="b3">${mover([[0, 0], [0, 0], [fx - sx, 0]], tag(sx, y, w, HOT, { size: 18 }), 0.2 + k * 0.3)}</g>`;
      });
    } else if (word === '청구권') {
      body += at(1, 'pop', citizen(), 0.4) + at(1, 'rise', state(), 0.6);
      body += at(1, 'pop', shield(PX + 70, GY - 38, 1.15), 0.8);
      body += `<g class="b2 h3">${g('fin fin2', bolt([PX + 190, 250], [PX + 86, GY - 52], C.red), 0.2)}${g('fin fin2', `<path d="M${PX + 66} ${GY - 64} L${PX + 74} ${GY - 44} L${PX + 64} ${GY - 32} L${PX + 72} ${GY - 14}" stroke="${C.red}" stroke-width="3" fill="none"/>`, 0.7)}</g>`;
      body += `<g class="b2 h3">${g('pop pop2', tag(PX + 230, 240, '침해', ['white', C.red], { size: 18 }), 0.5)}</g>`;
      body += `<g class="b3">${mover([[0, 0], [0, 0], [GX - 80 - (PX + 120), 0]], paper(PX + 120, GY - 40, '', 0.7), 0.2)}</g>`;
      body += at(3, 'pop', tag(320, 236, '청구', OK, { size: 18 }), 0.6);
      body += at(3, 'pop', `<circle cx="${PX + 70}" cy="${GY - 38}" r="20" fill="white" stroke="${C.green}" stroke-width="3"/>` + check(PX + 70, GY - 37, 0.8), 1.8);
    }
    body += at(4, 'pop', tag(320, 202, word, HOT, { size: 20 }), 0);
    put(KEY('12', word), svg(id, body, css));
  };
  rightsFig('기본권', 't72-so-gibongwon');
  rightsFig('자유권', 't72-so-jayu');
  rightsFig('평등권', 't72-so-pyeongdeung');
  rightsFig('참정권', 't72-so-chamjeong');
  rightsFig('사회권', 't72-so-sahoegwon');
  rightsFig('청구권', 't72-so-cheonggu');

  // ── 기본권 제한의 목적 셋(국가 안전 보장·질서 유지·공공복리): 왼쪽은 뜻, 오른쪽은 제한의 문 ──
  const LIMITS = ['국가 안전 보장', '질서 유지', '공공복리'];
  const limitFig = (word, id) => {
    const k = LIMITS.indexOf(word);
    let css = base(id) + `
      .sc-${id} .car { animation: ${id}-car 3s linear infinite; }
      @keyframes ${id}-car { from { transform: translateX(-40px); } to { transform: translateX(200px); } }`;
    let body = '';
    const LX = 160;
    if (k === 0) {
      // 나라를 둘러싼 방패, 밖에서 오는 공격이 막힌다
      body += at(1, 'pop', `<circle cx="${LX}" cy="170" r="70" fill="${C.mint}" stroke="${C.green}" stroke-width="3"/>` + text(LX, 177, '우리나라', { size: 20, color: C.green }), 0);
      body += shown(1, drawn(1, `M${LX} 74 A96 96 0 1 1 ${LX - 0.1} 74`, C.blue, 6));
      [[-1, -1], [1, -0.6], [-1, 0.8]].forEach(([dx, dy], i) => {
        const L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L;
        body += shown(1, g('fin fin1', bolt([LX + ux * 150, 170 + uy * 150], [LX + ux * 104, 170 + uy * 104]), 1 + i * 0.3));
      });
      body += at(2, 'pop', `<rect x="${LX - 70}" y="292" width="140" height="44" rx="8" fill="white" stroke="${C.red}" stroke-width="3"/>` + text(LX + 14, 321, '군사 시설', { size: 18 }) + cross(LX - 46, 314, 9), 0.2);
    } else if (k === 1) {
      // 신호등 앞 차들이 질서 있게 지나간다
      body += at(1, 'fin', `<rect x="20" y="150" width="280" height="80" fill="${C.line}"/><path d="M24 190 H296" stroke="white" stroke-width="4" stroke-dasharray="18 14"/>`, 0);
      body += at(1, 'pop', `<rect x="232" y="44" width="40" height="96" rx="8" fill="${C.ink}"/>` + [C.red, C.yellow, C.green].map((c, i) => `<circle cx="252" cy="${64 + i * 28}" r="10" fill="${i === 2 ? C.mint : c}"${i === 2 ? ` stroke="${C.green}" stroke-width="3"` : ' opacity=".25"'}/>`).join('') + `<path d="M252 140 V150" stroke="${C.ink}" stroke-width="4"/>`, 0.3);
      const car = (x, y, col) => `<rect x="${x - 24}" y="${y - 12}" width="48" height="24" rx="6" fill="${col}"/><circle cx="${x - 13}" cy="${y + 12}" r="5" fill="${C.ink}"/><circle cx="${x + 13}" cy="${y + 12}" r="5" fill="${C.ink}"/>`;
      body += `<g class="b1"><g class="car">${car(40, 170, C.blue)}</g><g class="car" style="animation-delay:-1.5s">${car(40, 212, C.orange)}</g></g>`;
      body += at(2, 'pop', `<rect x="${LX - 80}" y="282" width="160" height="50" rx="8" fill="white" stroke="${C.red}" stroke-width="3"/>` + text(LX, 314, '과속 단속', { size: 20 }), 0.2);
      body += at(2, 'pop', `<circle cx="${LX + 112}" cy="306" r="18" fill="white" stroke="${C.red}" stroke-width="3"/>` + text(LX + 112, 313, '!', { size: 22, color: C.red }), 0.6);
    } else {
      // 도시 둘레의 숲: 모두의 맑은 공기
      body += at(1, 'pop', `<circle cx="${LX}" cy="170" r="104" fill="${C.mint}" stroke="${C.green}" stroke-width="3"/><circle cx="${LX}" cy="170" r="50" fill="white" stroke="${C.muted}" stroke-width="3"/>` + text(LX, 177, '도시', { size: 20 }), 0);
      [0, 1, 2, 3, 4, 5, 6, 7].forEach((i) => { const a = i * Math.PI / 4 + 0.3, x = LX + 78 * Math.cos(a), y = 170 + 78 * Math.sin(a); body += at(1, 'pop', `<circle cx="${f(x)}" cy="${f(y)}" r="11" fill="${C.green}"/>`, 0.3 + i * 0.08); });
      body += at(1, 'pop', text(LX, 302, '모두의 숲', { size: 19, color: C.green }), 1);
      body += at(2, 'pop', `<path d="M${LX + 78} 112 V96 L${LX + 92} 84 L${LX + 106} 96 V112 Z" fill="white" stroke="${C.ink}" stroke-width="2.5" stroke-linejoin="round"/>` + cross(LX + 124, 92, 10), 0.3);
      body += at(2, 'pop', tag(LX, 338, '개발 제한 구역', ['white', C.red], { size: 18 }), 0.6);
    }
    // 오른쪽: 기본권 → 목적 셋 가운데 하나 → 법률로만
    const RX = 470;
    body += at(2, 'pop', tag(RX, 34, '기본권 제한', PLAIN, { size: 20 }), 0);
    body += shown(2, drawn(2, `M${RX} 56 V82`, C.ink, 3));
    body += at(2, 'rise', `<rect x="342" y="84" width="256" height="148" rx="12" fill="white" stroke="${C.muted}" stroke-width="3"/>`, 0.2);
    LIMITS.forEach((w, i) => {
      const t = at(2, 'pop', tag(RX, 116 + i * 44, w, i === k ? HOT : PLAIN, { size: 19 }), 0.4 + i * 0.2);
      body += i === k ? t : `<g opacity=".45">${t}</g>`;
    });
    body += shown(3, g('fin fin3', flow([[RX, 236], [RX, 268]], C.purple, { w: 4 }), 0.1));
    body += at(3, 'drop', tag(RX, 292, '법률로만', OLD, { size: 21 }), 0.4);
    body += at(3, 'pop', tag(RX, 338, '본질은 지킴', OK, { size: 18 }), 0.9);
    body += at(4, 'pop', tag(LX, 30, word, HOT, { size: 22 }));
    body += glowRect(RX - tagW(word, 19) / 2 - 6, 116 + k * 44 - 22, tagW(word, 19) + 12, 44, 4, C.orange, 0.3, 22);
    put(KEY('12', word), svg(id, body, css));
  };
  limitFig('국가 안전 보장', 't72-so-anjeon');
  limitFig('질서 유지', 't72-so-jilseo');
  limitFig('공공복리', 't72-so-gonggong');

  // ── 헌법 소원: 국가 기관의 힘에 기본권이 다치자 헌법 재판소에 바로잡아 달라고 청구한다 ──
  (function () {
    const id = 't72-so-sowon';
    let css = base(id);
    let body = '';
    const PX = 120, PY = 330;
    body += at(1, 'pop', person(PX, PY, C.green, 1.8), 0);
    body += at(1, 'pop', shield(PX + 74, PY - 44, 1.2) + text(PX + 74, PY + 22, '기본권', { size: 18, color: C.green }), 0.3);
    body += at(1, 'rise', govt(510, 130, 130, 70) + text(510, 156, '국가 기관', { size: 19, color: C.blue }), 0.5);
    body += `<g class="b1 h3">${g('fin fin1', bolt([450, 120], [PX + 96, PY - 62]), 1)}${g('fin fin1', `<path d="M${PX + 70} ${PY - 72} L${PX + 80} ${PY - 50} L${PX + 68} ${PY - 38} L${PX + 78} ${PY - 18}" stroke="${C.red}" stroke-width="3" fill="none"/>`, 1.5)}</g>`;
    // 헌법 재판소
    body += at(2, 'rise', hall(510, 340, 150, 74, OLD), 0);
    body += at(2, 'pop', text(510, 222, '헌법 재판소', { size: 19, color: C.purple }), 0.3);
    body += `<g class="b2">${mover([[0, 0], [270, 0]], paper(PX + 140, PY - 50, '', 0.75), 0.6)}</g>`;
    body += shown(2, g('fin fin2', flow([[PX + 130, PY - 96], [420, PY - 96]], C.purple, { w: 4 }), 0.3));
    body += at(2, 'pop', tag(300, PY - 120, '청구', OLD, { size: 18 }), 0.5);
    // 3칸: 바로잡힘
    body += at(3, 'drop', `<g transform="rotate(-10 590 196)">${stamp(590, 196, '판단', 26)}</g>`, 0.2);
    body += at(3, 'pop', `<circle cx="${PX + 74}" cy="${PY - 44}" r="20" fill="white" stroke="${C.green}" stroke-width="3"/>` + check(PX + 74, PY - 43, 0.8), 1);
    body += shown(3, g('fin fin3', flow([[440, 300], [PX + 110, PY - 30]], C.green, { w: 4 }), 0.6));
    body += at(4, 'pop', tag(170, 40, '헌법 소원', HOT, { size: 24 }));
    body += glowRect(424, 196, 172, 150, 4, C.orange, 0.3, 12);
    put(KEY('12', '헌법 소원'), svg(id, body, css));
  })();

  // ── 노동 3권: 뭉치고(단결권) → 마주 앉아 의논하고(단체 교섭권) → 함께 일을 멈춘다(단체 행동권) ──
  const LABOR = ['단결권', '단체 교섭권', '단체 행동권'];
  const laborFig = (word, id) => {
    const all = word === '노동 3권';
    const k = LABOR.indexOf(word);
    // 단계가 시작되는 칸: 단결, 교섭, 결렬, 멈춤
    const B = all ? { unite: 1, talk: 2, fail: 3, stop: 3, last: 4 } : k === 0 ? { unite: 2, talk: 9, fail: 9, stop: 9, last: 3 } : k === 1 ? { unite: 1, talk: 2, fail: 9, stop: 9, last: 3 } : { unite: 1, talk: 1, fail: 2, stop: 3, last: 4 };
    let css = base(id) + `
      .sc-${id} .spin { transform-box: fill-box; transform-origin: center; animation: ${id}-spin 3s linear infinite; }
      @keyframes ${id}-spin { to { transform: rotate(360deg); } }
      .on${B.stop} .sc-${id} .spin { animation-play-state: paused; }
      .on${B.stop} .sc-${id} .wk { animation: ${id}-bob 1.4s ease-in-out infinite; }`;
    let body = '';
    // 위: 세 권리 띠
    const TX = [104, 320, 536];
    LABOR.forEach((w, i) => {
      const lit = all ? [B.unite, B.talk, B.stop][i] : i === k ? 1 : 0;
      body += tag(TX[i], 32, w, PLAIN, { size: 19 });
      if (lit) body += at(lit, 'pop', tag(TX[i], 32, w, HOT, { size: 19 }), 0);
      if (i) body += `<path d="M${TX[i - 1] + tagW(LABOR[i - 1], 19) / 2 + 6} 32 H${TX[i] - tagW(w, 19) / 2 - 8}" stroke="${C.muted}" stroke-width="3"/><path d="M${TX[i] - tagW(w, 19) / 2 - 14} 26 L${TX[i] - tagW(w, 19) / 2 - 7} 32 L${TX[i] - tagW(w, 19) / 2 - 14} 38" stroke="${C.muted}" stroke-width="3" fill="none"/>`;
    });
    // 일터와 톱니
    const tooth = Array.from({ length: 8 }, (_, i) => `<rect x="-5" y="-30" width="10" height="12" rx="2" fill="${C.muted}" transform="rotate(${i * 45})"/>`).join('');
    body += `<rect x="330" y="96" width="140" height="80" fill="white" stroke="${C.muted}" stroke-width="3"/><path d="M330 96 L360 74 V96 L390 74 V96 L420 74 V96" stroke="${C.muted}" stroke-width="3" fill="none" stroke-linejoin="round"/>`;
    body += `<g transform="translate(400 138)"><g class="spin">${tooth}<circle r="20" fill="${C.muted}"/><circle r="8" fill="white"/></g></g>`;
    body += text(490, 170, '일터', { size: 18, color: C.muted, anchor: 'start' });
    // 사용자
    body += person(548, 330, C.purple, 2.1, { tie: true }) + text(548, 246, '사용자', { size: 19, color: C.purple });
    // 근로자 다섯: 흩어져 있다가 노동조합으로 모인다
    const CX = 170, CY = 248;
    const SEAT = [[130, 262], [170, 262], [210, 262], [150, 312], [190, 312]];
    const SCAT = [[40, 120], [250, 110], [60, 330], [280, 330], [150, 200]];
    if (B.unite > 1) body += at(B.unite, 'fin', `<circle cx="${CX}" cy="${CY}" r="88" fill="${C.mint}" fill-opacity=".6" stroke="${C.green}" stroke-width="3"/>` + text(CX, CY - 52, '노동조합', { size: 20, color: C.green }), 0.6);
    else body += at(1, 'fin', `<circle cx="${CX}" cy="${CY}" r="88" fill="${C.mint}" fill-opacity=".6" stroke="${C.green}" stroke-width="3"/>` + text(CX, CY - 52, '노동조합', { size: 20, color: C.green }), 0);
    SEAT.forEach(([x, y], i) => {
      const col = [C.green, C.blue, C.orange, C.blue, C.green][i];
      const p = `<g class="wk" style="animation-delay:${i * 0.2}s">${person(x, y, col, 1.15)}</g>`;
      if (B.unite > 1) body += `<g class="b1">${mover([[SCAT[i][0] - x, SCAT[i][1] - y], [0, 0]], p, i * 0.1)}</g>`;
      else body += at(1, 'pop', p, i * 0.1);
    });
    // 교섭: 탁자와 오가는 화살표
    if (B.talk < 9) {
      body += at(B.talk, 'rise', `<rect x="290" y="290" width="160" height="14" rx="4" fill="${C.orange}"/><path d="M304 304 V338 M436 304 V338" stroke="${C.orange}" stroke-width="5"/>`, 0);
      body += shown(B.talk, g(`fin fin${B.talk}`, flow([[268, 256], [500, 256]], C.green, { w: 4 }) + flow([[500, 274], [268, 274]], C.purple, { w: 4 }), B.talk === 1 ? 0 : 0.4));
      body += at(B.talk, 'pop', tag(330, 222, '임금', HOT, { size: 18 }), B.talk === 1 ? 0.3 : 0.8);
      body += at(B.talk, 'pop', tag(430, 222, '일하는 시간', HOT, { size: 18 }), B.talk === 1 ? 0.5 : 1.1);
    }
    if (B.fail < 9) body += at(B.fail, 'pop', cross(370, 265, 14), 0.3);
    if (B.stop < 9) {
      body += at(B.stop, 'pop', `<g class="bob">${tag(CX, 140, '일 멈춤', ['white', C.red], { size: 20 })}</g>`, 0.3);
      body += at(B.stop, 'pop', cross(400, 138, 12), 0.8);
    }
    body += at(B.last, 'pop', tag(556, 104, word, HOT, { size: 22 }));
    if (all) LABOR.forEach((w, i) => { body += glowRect(TX[i] - tagW(w, 19) / 2 - 5, 10, tagW(w, 19) + 10, 44, 4, C.orange, 0.3 + i * 0.3, 22); });
    else body += glowRect(TX[k] - tagW(word, 19) / 2 - 5, 10, tagW(word, 19) + 10, 44, B.last, C.orange, 0.4, 22);
    put(KEY('12', word), svg(id, body, css));
  };
  laborFig('노동 3권', 't72-so-nodong3');
  laborFig('단결권', 't72-so-dangyeol');
  laborFig('단체 교섭권', 't72-so-gyoseop');
  laborFig('단체 행동권', 't72-so-haengdonggwon');
})(typeof window !== 'undefined' ? window : globalThis);
