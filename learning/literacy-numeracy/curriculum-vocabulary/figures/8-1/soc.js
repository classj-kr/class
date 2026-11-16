(function (root) {
  'use strict';
  const { C, svg, text, put } = root.FigureKit;
  const KEY = (u, w) => `8-1/사회/${u}/${w}`;
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
  const tw = (s, size) => [...String(s)].reduce((a, c) => a + (/[가-힣?→○]/.test(c) ? 1 : c === ' ' ? 0.3 : 0.6), 0) * size;
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

  // 칸 n 에 (dx, dy) 만큼 날아가 그 자리에 머문다
  const fly = (n, dx, dy, inner, s = 0) => `<g class="b${n}"><g class="fly fly${n}" style="--dx:${f(dx)}px;--dy:${f(dy)}px${s ? `;animation-delay:${s}s` : ''}">${inner}</g></g>`;
  const base2 = (id) => base(id) + `
    .sc-${id} .fly { opacity: 0; }
    @keyframes ${id}-fly { 0% { opacity: 0; transform: translate(0, 0); } 15% { opacity: 1; transform: translate(0, 0); } 100% { opacity: 1; transform: translate(var(--dx), var(--dy)); } }
    ` + [1, 2, 3, 4, 5].map((n) => `.on${n} .sc-${id} .fly${n} { animation: ${id}-fly 1.3s ease-in-out both; } .on${n} .sc-${id} .ring${n} { animation-iteration-count: 1; }`).join('\n');
  // 돋보기
  const lens = (x, y, r = 16, color = C.ink) => `<circle cx="${x}" cy="${y}" r="${r}" fill="white" fill-opacity=".7" stroke="${color}" stroke-width="4"/><path d="M${f(x + r * 0.7)} ${f(y + r * 0.7)} L${f(x + r * 1.6)} ${f(y + r * 1.6)}" stroke="${color}" stroke-width="6" stroke-linecap="round"/>`;

  // 재판관 아홉(3×3, 발밑 top 부터 gap 간격): 회색 아홉과, 칸 n 에 차례로 초록이 되는 k 명
  const jxy = (cx, top, i, gap = 45) => [cx + ((i % 3) - 1) * 40, top + Math.floor(i / 3) * gap];
  const judgesGrey = (cx, top) => { let o = ''; for (let i = 0; i < 9; i++) { const [x, y] = jxy(cx, top, i); o += person(x, y, C.muted, 0.85); } return o; };
  const judgesGreen = (cx, top, k, n, s) => { let o = ''; for (let i = 0; i < k; i++) { const [x, y] = jxy(cx, top, i); o += at(n, 'pop', person(x, y, C.green, 0.85), s + i * 0.22); } return o; };

  // ════ 1 헌법과 국가 기관 ════

  // ── 정부 형태·대통령제·의원 내각제: 국민이 누구를 뽑고, 의회와 행정부가 어떻게 이어지는가 ──
  // o: show(나타나는 칸), step(벽·구성 칸), checks(견제 화살표 칸, 0 이면 없음), roles(입법부·행정부 꼬리표)
  const govPanel = (kind, ox, o) => {
    const X = (x) => f(ox + x);
    const pres = kind === 'pres';
    let b = '';
    let ppl = '';
    for (let i = 0; i < 5; i++) ppl += person(X(90 + 30 * i), 350, C.blue, 0.75);
    b += at(o.show, 'rise', ppl + text(X(40), 345, '국민', { size: 18, color: C.muted, weight: 600 }));
    // 의회: 초록 정당 넷, 주황 정당 셋
    let par = box(X(65), 205, 110, 80, '', COLD) + text(X(65), 196, '의회', { size: 20 });
    let maj = '';
    for (let i = 0; i < 4; i++) maj += `<circle cx="${X(26 + 13 * i)}" cy="226" r="5.5" fill="${C.green}"/>`;
    par += pres ? maj : `<g class="pulse pulse${o.step}">${maj}</g>`;
    for (let i = 4; i < 7; i++) par += `<circle cx="${X(26 + 13 * i)}" cy="226" r="5.5" fill="${C.orange}"/>`;
    b += at(o.show, 'drop', par, 0.1);
    if (pres) {
      b += at(o.show, 'drop', box(X(235), 205, 110, 80, '', OK) + text(X(235), 196, '대통령', { size: 20 }) + person(X(235), 240, C.green, 0.7, { tie: true }), 0.3);
    } else {
      b += at(o.show, 'drop', `<rect x="${X(180)}" y="165" width="110" height="80" rx="10" fill="white" stroke="${C.green}" stroke-width="3" stroke-dasharray="8 6"/>` + text(X(235), 196, '내각', { size: 20 }), 0.3);
      b += at(o.step, 'fin', box(X(235), 205, 110, 80, '', OK) + text(X(235), 196, '내각', { size: 20 }), 0.6);
      [215, 235, 255].forEach((x, i) => { b += at(o.step, 'pop', person(X(x), 240, C.green, i === 1 ? 0.72 : 0.6, { tie: true }), 0.9 + i * 0.15); });
    }
    // 선거
    const elect = (x2) => flow([[X(x2 < 150 ? 132 : 168), 318], [X(x2), 252]], C.blue, { w: 4 });
    b += shown(o.show, g(`fin fin${o.show}`, elect(84) + (pres ? elect(216) : ''), 0.4));
    b += fly(o.show, -55, -52, ballot(X(150), 322), 0.5);
    if (pres) b += fly(o.show, 55, -52, ballot(X(150), 322), 0.7);
    // 대통령제는 둘 사이의 벽, 의원 내각제는 의회가 내각을 꾸리는 다리
    if (pres) b += `<g class="b${o.step}"><g class="growy growy${o.step}"><rect x="${X(143)}" y="140" width="14" height="128" rx="4" fill="${C.ink}"/></g></g>`;
    else b += shown(o.step, g(`fin fin${o.step}`, flow([[X(122), 205], [X(178), 205]], C.green, { w: 5 }) + text(X(150), 188, '구성', { size: 18, color: C.green }), 0.3));
    if (o.roles) {
      b += at(o.step, 'pop', tag(X(-60), 205, '입법부', COLD, { size: 18 }), 0.8);
      b += at(o.step, 'pop', tag(X(360), 205, '행정부', OK, { size: 18 }), 1.0);
    }
    if (o.checks) {
      const [inL, outL] = pres ? ['거부권', '탄핵 소추'] : ['해산', '불신임'];
      b += shown(o.checks, g(`fin fin${o.checks}`, flowQ([X(205), 163], [X(150), 60], [X(95), 163], C.orange, { w: 4 }) + tag(X(150), 112, inL, HOT, { size: 18 }), 0.2));
      b += shown(o.checks, g(`fin fin${o.checks}`, flowQ([X(35), 163], [X(150), -30], [X(265), 163], C.purple, { w: 4 }) + tag(X(150), 67, outL, OLD, { size: 18 }), 0.9));
    }
    return b;
  };
  const govFig = (word, id) => {
    const css = base2(id);
    let body = '';
    if (word === '정부 형태') {
      body += govPanel('pres', 10, { show: 1, step: 1 });
      body += govPanel('parl', 330, { show: 2, step: 2 });
      body += shown(1, `<path d="M320 150 V350" stroke="${C.line}" stroke-width="3" stroke-dasharray="8 8"/>`);
      body += at(3, 'pop', tag(160, 108, '대통령제', OLD), 0.3) + at(3, 'pop', tag(480, 108, '의원 내각제', OLD), 0.6);
      body += at(3, 'pop', tag(320, 40, '정부 형태', HOT, { size: 24 }));
      body += glowRect(14, 84, 296, 268, 3, C.orange, 0.5, 16) + glowRect(334, 84, 296, 268, 3, C.orange, 0.8, 16);
    } else {
      body += govPanel(word === '대통령제' ? 'pres' : 'parl', 170, { show: 1, step: 2, checks: 3, roles: true });
      body += at(4, 'pop', tag(95, 40, word, HOT, { size: 24 }));
      body += glowRect(178, 30, 286, 326, 4, C.orange, 0.4, 16);
    }
    put(KEY('1', word), svg(id, body, css));
  };
  govFig('정부 형태', 't81-so1-hyeongtae');
  govFig('대통령제', 't81-so1-daetong');
  govFig('의원 내각제', 't81-so1-naegak');

  // ── 국가 원수·수반: 대통령 한 사람이 맡는 두 자리 ──
  const headFig = (word, id) => {
    const css = base2(id);
    const won = word === '국가 원수';
    let body = '';
    body += at(1, 'pop', person(320, 250, C.green, 1.9, { tie: true }) + text(320, 172, '대통령', { size: 20 }));
    const foreign = person(110, 250, C.purple, 1.7, { tie: true }) + text(110, 172, '외국 대표', { size: 20 });
    if (won) {
      body += at(1, 'pop', foreign, 0.3);
      body += shown(1, g('fin fin1', flow([[160, 205], [262, 205]], C.green, { w: 4 }) + flow([[262, 230], [160, 230]], C.purple, { w: 4 }), 0.6));
      body += at(1, 'drop', paper(212, 118, '조약'), 1.0);
      let ppl = '';
      for (let i = 0; i < 7; i++) ppl += person(230 + 30 * i, 352, C.blue, 0.7);
      body += at(2, 'rise', ppl);
      body += shown(2, g('fin fin2', flow([[262, 318], [306, 266]], C.blue, { w: 3 }) + flow([[320, 318], [320, 266]], C.blue, { w: 3 }) + flow([[378, 318], [334, 266]], C.blue, { w: 3 }), 0.5));
      body += at(2, 'pop', tag(480, 335, '국민 모두', COLD, { size: 18 }), 0.9);
      body += at(3, 'pop', tag(320, 40, '국가 원수', HOT, { size: 24 }));
      body += glowRect(262, 150, 116, 112, 3, C.orange, 0.4, 14);
    } else {
      body += at(1, 'pop', tag(515, 62, '행정부', OK, { size: 18 }), 0.2);
      body += shown(1, drawn(1, 'M342 205 H400 V120 H457', C.ink, 3));
      body += at(1, 'drop', box(515, 120, 116, 44, '국무총리', OK, 20), 0.4);
      body += shown(1, drawn(1, 'M515 142 V182 M445 210 V182 H585 V210 M515 182 V210', C.ink, 3));
      ['교육부', '국방부', '환경부'].forEach((w, i) => { body += at(1, 'drop', box(445 + 70 * i, 230, 62, 40, w, PLAIN, 18), 0.8 + i * 0.15); });
      body += at(2, 'pop', tag(352, 92, '임명·지휘', HOT, { size: 18 }), 0.2);
      body += ring(515, 120, 44, 2, C.orange, 0.2);
      [445, 515, 585].forEach((x, i) => { body += ring(x, 230, 32, 2, C.orange, 0.35 + i * 0.15); });
      body += at(3, 'pop', foreign, 0.4);
      body += shown(3, g('fin fin3', flow([[160, 205], [262, 205]], C.purple, { w: 4 }), 0.7));
      body += at(3, 'pop', tag(320, 305, '국가 원수', COLD, { size: 20 }), 0.9);
      body += at(3, 'pop', tag(515, 300, '행정부 수반', HOT, { size: 22 }));
      body += glowRect(410, 40, 222, 222, 3, C.orange, 0.3, 14);
    }
    put(KEY('1', word), svg(id, body, css));
  };
  headFig('국가 원수', 't81-so1-wonsu');
  headFig('수반', 't81-so1-suban');

  // ── 법률이 만들어지는 길: 제출 → 상임 위원회 → 본회의 → 대통령 → 공포 ──
  const LX = { s0: 62, s1: 195, s2: 330, s3: 450, s4: 575 };
  const lawFig = (word, id) => {
    const css = base2(id) + `
      .sc-${id} .mag { animation: ${id}-jig 1.3s ease-in-out infinite; }`;
    const P = {
      '상임 위원회': { s1: 2, doc: ['s0', 's1'] },
      '본회의': { s1: 1, s2: 2, doc: ['s1', 's2'] },
      '공포': { s1: 1, s2: 1, s3: 2, s4: 3, doc: ['s2', 's3', 's4'], pass: true },
      '법률안 거부권': { s1: 1, s2: 1, s3: 2, doc: ['s2', 's3', 's2'], pass: true }
    }[word];
    let body = '';
    body += at(1, 'pop', tag(62, 125, '국회 의원', COLD, { size: 18 }) + tag(62, 185, '정부', OLD, { size: 18 }));
    if (P.s1) body += shown(P.s1, g(`fin fin${P.s1}`, flow([[112, 131], [136, 143]], C.muted, { w: 3 }) + flow([[93, 182], [136, 158]], C.muted, { w: 3 }), 0.1)) + at(P.s1, 'drop', box(195, 150, 112, 56, '상임 위원회', OK, 18), 0.2);
    if (P.s2) body += shown(P.s2, g(`fin fin${P.s2}`, flow([[253, 150], [280, 150]], C.muted, { w: 3 }), 0.1)) + at(P.s2, 'drop', box(330, 150, 96, 56, '본회의', OK, 20), 0.2);
    if (P.s3) body += shown(P.s3, g(`fin fin${P.s3}`, flow([[380, 150], [400, 150]], C.muted, { w: 3 }), 0.1)) + at(P.s3, 'drop', box(450, 150, 96, 56, '대통령', COLD, 20), 0.2);
    if (P.s4) {
      const mega = `<path d="M548 140 H562 L604 116 V184 L562 160 H548 Z" fill="${C.peach}" stroke="${C.orange}" stroke-width="3" stroke-linejoin="round"/><path class="twk" d="M614 132 Q628 150 614 168" stroke="${C.orange}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
      body += shown(P.s4, g(`fin fin${P.s4}`, flow([[500, 150], [540, 150]], C.muted, { w: 3 }), 0.1)) + at(P.s4, 'drop', mega, 0.2);
    }
    // 법률안 서류(통과 도장은 서류와 함께 움직인다)
    let doc = paper(62, 70, '법률');
    if (P.pass) doc += `<g class="${word === '법률안 거부권' ? 'h3' : ''}">${stamp(92, 46, '가결', 22)}</g>`;
    body += at(1, 'pop', mover(P.doc.map((k) => [LX[k] - 62, 0]), doc));

    if (word === '상임 위원회') {
      body += shown(2, drawn(2, 'M195 178 V215 M115 250 V215 H275 V250 M195 215 V250', C.muted, 3));
      [['교육', 115], ['국방', 195], ['환경', 275]].forEach(([w, x], i) => { body += at(2, 'drop', box(x, 270, 64, 40, w, i === 2 ? HOT : PLAIN, 18), 0.4 + i * 0.2); });
      body += ring(275, 270, 40, 2, C.orange, 0.6);
      body += at(2, 'pop', `<g class="mag">${lens(300, 246)}</g>`, 1.2);
      body += at(2, 'pop', tag(275, 325, '심사', HOT, { size: 18 }), 1.4);
      body += at(3, 'pop', tag(470, 150, '상임 위원회', HOT, { size: 24 }));
      body += glowRect(136, 119, 118, 62, 3, C.orange, 0.3, 12) + glowRect(78, 246, 234, 48, 3, C.orange, 0.5, 12);
    }
    if (word === '본회의') {
      let grey = '', green = '';
      [[36, 7], [58, 11], [80, 15]].forEach(([r, n]) => {
        for (let i = 0; i < n; i++) {
          const a = Math.PI * (i + 0.5) / n, x = 330 - r * Math.cos(a), y = 340 - r * Math.sin(a);
          grey += `<circle cx="${f(x)}" cy="${f(y)}" r="6.5" fill="${C.line}"/>`;
          if ((i + 0.5) / n < 0.62) green += `<circle cx="${f(x)}" cy="${f(y)}" r="6.5" fill="${C.green}"/>`;
        }
      });
      body += at(2, 'fin', grey, 0.4);
      body += at(2, 'fin', green, 1.0);
      body += at(2, 'pop', tag(205, 322, '찬성', OK, { size: 18 }), 1.1);
      body += at(2, 'pop', stamp(450, 300, '가결', 24), 1.5);
      body += at(3, 'pop', tag(520, 150, '본회의', HOT, { size: 24 }));
      body += glowRect(279, 119, 102, 62, 3, C.orange, 0.3, 12) + glowRect(242, 252, 176, 98, 3, C.orange, 0.5, 12);
    }
    if (word === '공포') {
      body += at(2, 'drop', `<rect x="412" y="232" width="76" height="66" rx="6" fill="white" stroke="${C.blue}" stroke-width="3"/><rect x="412" y="232" width="76" height="16" rx="4" fill="${C.blue}"/>` + text(450, 286, '15일', { size: 22, color: C.blue }), 1.0);
      body += ring(604, 150, 26, 3, C.orange, 0.7);
      [534, 562, 590, 618].forEach((x, i) => { body += at(3, 'rise', person(x, 340, C.blue, 0.75), 1.0 + i * 0.1); body += at(3, 'pop', check(x, 290, 0.55), 1.4 + i * 0.12); });
      body += at(4, 'pop', tag(250, 290, '공포', HOT, { size: 26 }));
      body += glowRect(520, 108, 114, 242, 4, C.orange, 0.3, 14);
    }
    if (word === '법률안 거부권') {
      body += at(2, 'pop', cross(528, 150), 1.3);
      body += at(2, 'pop', tag(590, 150, '거부', ['white', C.red], { size: 18 }), 1.5);
      body += shown(3, g('fin fin3', flowQ([440, 180], [390, 262], [340, 180], C.red, { w: 4 }), 0.1));
      body += at(3, 'pop', tag(390, 250, '다시 의결', OK, { size: 18 }), 0.5);
      body += at(3, 'fin', `<rect x="230" y="300" width="200" height="22" rx="4" fill="white" stroke="${C.ink}" stroke-width="2.5"/>`, 0.5);
      body += `<g class="b3"><rect class="grow grow3" style="transition-delay:.7s" x="232" y="302" width="160" height="18" rx="3" fill="${C.green}"/></g>`;
      body += at(3, 'fin', `<path d="M363 292 V330" stroke="${C.red}" stroke-width="3"/>` + text(363, 286, '3분의 2', { size: 18, color: C.red }), 0.5);
      body += at(4, 'pop', tag(530, 262, '법률안 거부권', HOT, { size: 22 }));
      body += glowRect(398, 116, 236, 70, 4, C.orange, 0.3, 14);
    }
    put(KEY('1', word), svg(id, body, css));
  };
  lawFig('상임 위원회', 't81-so1-sangim');
  lawFig('본회의', 't81-so1-bonhoe');
  lawFig('공포', 't81-so1-gongpo');
  lawFig('법률안 거부권', 't81-so1-geobu');

  // ── 감사원: 대통령 소속으로 나랏돈과 공무원의 일을 살핀다 ──
  (function () {
    const id = 't81-so1-gamsawon';
    const css = base2(id) + `
      .sc-${id} .mag { animation: ${id}-jig 1.3s ease-in-out infinite; }`;
    let body = '';
    body += at(1, 'drop', box(320, 55, 110, 44, '대통령', COLD, 20));
    body += shown(1, drawn(1, 'M320 77 V128 M320 172 V205 M210 225 V205 H430 V225 M320 205 V225', C.ink, 3));
    body += at(1, 'drop', box(320, 150, 120, 44, '국무총리', OK, 20), 0.3);
    ['교육부', '국방부', '환경부'].forEach((w, i) => { body += at(1, 'drop', box(210 + 110 * i, 245, 84, 40, w, PLAIN, 18), 0.6 + i * 0.15); });
    body += shown(2, drawn(2, 'M320 100 H445', C.purple, 3));
    body += at(2, 'drop', box(500, 100, 110, 44, '감사원', OLD, 20), 0.6);
    body += at(3, 'drop', `<rect x="515" y="222" width="90" height="62" rx="4" fill="white" stroke="${C.ink}" stroke-width="2.5"/><path d="M560 222 V284" stroke="${C.ink}" stroke-width="2"/><path d="M526 240 H550 M526 254 H550 M526 268 H544 M570 240 H594 M570 254 H594 M570 268 H588" stroke="${C.muted}" stroke-width="2.5" stroke-linecap="round"/>`, 0.2);
    body += at(3, 'pop', tag(560, 316, '나랏돈', HOT, { size: 18 }), 0.4);
    body += shown(3, g('fin fin3', flow([[520, 124], [548, 208]], C.purple, { w: 4 }) + flowQ([475, 124], [470, 190], [448, 220], C.purple, { w: 4 }), 0.5));
    body += at(3, 'pop', `<g class="mag">${lens(588, 238)}</g>`, 0.9);
    [210, 320, 430].forEach((x, i) => { body += at(3, 'pop', `<circle cx="${x - 40}" cy="226" r="12" fill="white" stroke="${C.green}" stroke-width="2.5"/>` + check(x - 40, 227, 0.55), 1.1 + i * 0.2); });
    body += at(3, 'pop', tag(320, 300, '공무원의 일', HOT, { size: 18 }), 1.3);
    body += at(4, 'pop', tag(110, 100, '감사원', HOT, { size: 24 }));
    body += glowRect(440, 74, 120, 52, 4, C.orange, 0.3, 12);
    put(KEY('1', '감사원'), svg(id, body, css));
  })();

  // ── 국회: 국민이 뽑은 300명이 모여 법을 만들고 나라 살림과 행정부를 살핀다 ──
  (function () {
    const id = 't81-so1-gukhoe';
    const css = base2(id);
    let body = '';
    let ppl = '';
    [[50, 250], [85, 250], [120, 250], [155, 250], [50, 300], [85, 300], [120, 300], [155, 300]].forEach(([x, y]) => { ppl += person(x, y, C.blue, 0.8); });
    body += at(1, 'rise', ppl + text(102, 336, '국민', { size: 18, color: C.muted, weight: 600 }));
    body += shown(1, g('fin fin1', flow([[182, 272], [262, 272]], C.blue, { w: 4 }), 0.2));
    body += fly(1, 70, 0, ballot(185, 255), 0.3);
    [80, 112, 144].forEach((r, i) => {
      const per = Math.PI * r / Math.round(Math.PI * r / 16), d = per * 0.62, gp = per - d;
      body += at(1, 'fin', `<path d="M${420 - r} 312 A${r} ${r} 0 0 1 ${420 + r} 312" stroke="${C.green}" stroke-width="15" stroke-dasharray="${f(d)} ${f(gp)}" stroke-dashoffset="${f(d + gp / 2)}" fill="none"/>`, 0.5 + i * 0.25);
    });
    body += at(1, 'pop', tag(420, 290, '300명', OK), 1.3);
    body += at(1, 'pop', tag(221, 312, '4년마다', COLD, { size: 18 }), 1.5);
    body += shown(2, g('fin fin2', flow([[400, 160], [250, 82]], C.green, { w: 4 }), 0.1));
    body += at(2, 'pop', tag(240, 60, '법 만들기', OK), 0.5);
    body += shown(3, g('fin fin3', flow([[420, 160], [400, 82]], C.green, { w: 4 }) + flow([[440, 160], [550, 82]], C.green, { w: 4 }), 0.1));
    body += at(3, 'pop', tag(400, 60, '나라 살림', OK), 0.5);
    body += at(3, 'pop', tag(560, 60, '행정부 감시', OK), 0.8);
    body += at(4, 'pop', tag(102, 60, '국회', HOT, { size: 26 }));
    body += glowRect(262, 154, 316, 172, 4, C.orange, 0.3, 16);
    put(KEY('1', '국회'), svg(id, body, css));
  })();

  // ── 지역구·비례 대표: 투표용지 두 장 ──
  const voteFig = (word, id) => {
    const css = base2(id) + `
      .sc-${id} .win { transform-box: fill-box; transform-origin: 50% 100%; transition: transform .8s ease-out 1s; }
      .on2 .sc-${id} .win { transform: scale(1.35); }`;
    const ji = word === '지역구';
    let body = '';
    // 왼쪽: 투표용지 ①(후보) ②(정당)과 투표하는 사람
    const sheet = (cx, num, rows) => {
      let o = `<rect x="${cx - 52}" y="48" width="104" height="176" rx="6" fill="white" stroke="${C.ink}" stroke-width="2.5"/>` + text(cx, 78, num, { size: 22 });
      rows.forEach((r, i) => { o += r(cx, 112 + i * 40) + `<rect x="${cx + 26}" y="${102 + i * 40}" width="18" height="18" rx="3" fill="white" stroke="${C.muted}" stroke-width="2"/>`; });
      return o;
    };
    const cand = (cx, y) => person(cx - 18, y + 14, C.muted, 0.6);
    const party = (k) => (cx, y) => text(cx - 12, y + 6, k, { size: 18 });
    body += at(1, 'drop', sheet(70, '①', [cand, cand, cand]), 0.1);
    body += at(1, 'drop', sheet(190, '②', [party('가'), party('나'), party('다')]), 0.3);
    body += at(1, 'rise', person(130, 340, C.blue, 1.2), 0.5);
    body += `<g class="h4">${glowRect(ji ? 14 : 134, 44, 112, 184, 2, C.orange, 0.2, 8)}</g>`;
    if (ji) {
      // 오른쪽: 여섯 칸으로 나눈 선거구, 칸마다 후보 셋
      const cells = [];
      for (let r = 0; r < 2; r++) for (let c = 0; c < 3; c++) cells.push([340 + c * 100, 100 + r * 100]);
      cells.forEach(([x, y], k) => {
        body += at(1, 'fin', `<rect x="${x - 48}" y="${y - 46}" width="96" height="92" rx="6" fill="${k === 0 ? C.mint : 'white'}" stroke="${k === 0 ? C.green : C.muted}" stroke-width="2.5" stroke-dasharray="${k === 0 ? '' : '7 5'}"/>`, 0.3 + k * 0.1);
        const win = (k * 2) % 3;
        [-28, 0, 28].forEach((dx, j) => {
          const p = person(x + dx, y + 34, C.muted, 0.75);
          const won = k === 0 ? `<g class="b2">${g('fin fin2', person(x + dx, y + 34, C.purple, 0.75), 0.9)}</g>` : '';
          body += j === win ? `<g class="h3">${at(1, 'pop', `<g class="${k === 0 ? 'win' : ''}">${p}${won}</g>`, 0.5 + k * 0.1)}</g>` : dimFrom(3, at(1, 'pop', p, 0.5 + k * 0.1));
        });
      });
      body += at(1, 'pop', tag(340, 30, '우리 동네', OK, { size: 18 }), 1.0);
      body += fly(2, 300, -86, ballot(70, 156), 0.2);
      body += at(2, 'pop', star(312, 84, 13), 1.5);
      // 칸마다 뽑힌 한 사람씩 국회로
      body += at(3, 'fin', box(440, 300, 300, 56, '', COLD) + text(318, 307, '국회', { size: 20 }), 0.1);
      cells.forEach(([x, y], k) => {
        const win = (k * 2) % 3, sx = x + (win - 1) * 28;
        body += fly(3, 372 + k * 30 - sx, 318 - (y + 34), person(sx, y + 34, C.purple, 0.75), 0.3 + k * 0.12);
      });
      body += at(4, 'pop', tag(220, 285, '지역구', HOT, { size: 26 }));
      body += glowRect(288, 50, 104, 100, 4, C.orange, 0.3, 10);
    } else {
      // 오른쪽: 정당 득표율 → 의석
      const PT = [['가 정당', 50, 5, C.green], ['나 정당', 30, 3, C.orange], ['다 정당', 20, 2, C.purple]];
      body += fly(2, 80, -150, ballot(190, 210), 0.1);
      PT.forEach(([name, pct, seat, col], i) => {
        const y = 80 + i * 86;
        body += at(2, 'fin', text(300, y + 7, name, { size: 18, anchor: 'start' }), 0.3 + i * 0.1);
        body += `<g class="b2"><rect class="grow grow2" style="transition-delay:${f(0.5 + i * 0.2)}s" x="380" y="${y - 13}" width="${pct * 4}" height="26" rx="4" fill="${col}"/></g>`;
        body += at(2, 'fin', text(388 + pct * 4, y + 7, `${pct} %`, { size: 18, anchor: 'start' }), 1.3 + i * 0.1);
        for (let s = 0; s < seat; s++) body += at(3, 'pop', `<rect x="${380 + s * 30}" y="${y + 22}" width="22" height="22" rx="5" fill="white" stroke="${col}" stroke-width="3"/><path d="M${384 + s * 30} ${y + 38} H${398 + s * 30}" stroke="${col}" stroke-width="3"/>`, 0.3 + (i * 5 + s) * 0.09);
        body += at(3, 'fin', text(380 + seat * 30 + 6, y + 40, `${seat}자리`, { size: 18, color: col, anchor: 'start' }), 1.4);
      });
      body += at(3, 'pop', tag(560, 34, '10자리', COLD, { size: 18 }), 0.2);
      body += at(4, 'pop', tag(450, 330, '비례 대표', HOT, { size: 24 }));
      body += glowRect(290, 56, 342, 246, 4, C.orange, 0.3, 14);
    }
    put(KEY('1', word), svg(id, body, css));
  };
  voteFig('지역구', 't81-so1-jiyeokgu');
  voteFig('비례 대표', 't81-so1-birye');

  // ── 국정 감사·국정 조사: 국회가 행정부의 일을 살피는 두 방법 ──
  const MIN = [['교육부', 370, 195], ['국방부', 470, 195], ['환경부', 570, 195], ['외교부', 370, 275], ['법무부', 470, 275], ['통일부', 570, 275]];
  const auditFig = (word, id) => {
    const gam = word === '국정 감사';
    const css = base2(id) + `
      .sc-${id} .sweep { opacity: 0; }
      .on3 .sc-${id} .sweep { animation: ${id}-sweep 1.7s ease-in-out both; }
      @keyframes ${id}-sweep { 0% { opacity: 0; transform: translate(0, 0); } 8% { opacity: 1; transform: translate(0, 0); } 30% { transform: translate(100px, 0); } 50% { transform: translate(200px, 0); } 65% { transform: translate(200px, 80px); } 80% { opacity: 1; transform: translate(100px, 80px); } 92% { opacity: 1; transform: translate(0, 80px); } 100% { opacity: 0; transform: translate(0, 80px); } }`;
    let body = '';
    body += at(1, 'pop', hall(110, 255, 150, 90, COLD) + text(110, 288, '국회', { size: 20 }));
    body += at(1, 'pop', tag(470, 140, '행정부', OK, { size: 18 }), 0.2);
    MIN.forEach(([w, x, y], i) => {
      const bx = at(1, 'drop', box(x, y, 84, 50, w, PLAIN, 18), 0.3 + i * 0.1);
      body += gam || i === 4 ? bx : dimFrom(3, bx);
    });
    const barBase = `<rect x="330" y="60" width="280" height="26" rx="4" fill="white" stroke="${C.muted}" stroke-width="2.5"/>`;
    if (gam) {
      let yr = barBase;
      for (let i = 1; i < 12; i++) yr += `<path d="M${f(330 + i * 280 / 12)} 60 V86" stroke="${C.line}" stroke-width="2"/>`;
      body += at(2, 'fin', yr + text(470, 110, '1년', { size: 18, color: C.muted }));
      body += at(2, 'pop', tag(258, 73, '해마다', OK, { size: 18 }), 0.3);
      body += at(2, 'fin', `<rect x="${f(330 + 8 * 280 / 12)}" y="61" width="${f(280 / 12)}" height="24" fill="${C.orange}"/>`, 0.7);
      body += at(2, 'pop', tag(f(330 + 8.5 * 280 / 12), 36, '30일 이내', HOT, { size: 18 }), 1.0);
      body += shown(3, g('fin fin3', flow([[188, 235], [322, 235]], C.purple, { w: 4 }), 0.1));
      body += `<g class="b3"><g class="sweep">${lens(392, 178)}</g></g>`;
      [0, 1, 2, 5, 4, 3].forEach((k, j) => {
        const [, x, y] = MIN[k];
        body += at(3, 'pop', `<circle cx="${x - 38}" cy="${y - 22}" r="12" fill="white" stroke="${C.green}" stroke-width="2.5"/>` + check(x - 38, y - 21, 0.55), [0.15, 0.5, 0.85, 1.1, 1.4, 1.6][j]);
      });
      body += at(4, 'pop', tag(110, 60, '국정 감사', HOT, { size: 24 }));
      body += glowRect(322, 164, 296, 142, 4, C.orange, 0.3, 12);
    } else {
      let bar = barBase;
      for (let i = 1; i < 4; i++) bar += `<path d="M${330 + i * 70} 60 V86" stroke="${C.line}" stroke-width="2"/>`;
      body += at(2, 'fin', bar + text(470, 110, '국회 의원', { size: 18, color: C.muted }));
      body += `<g class="b2"><rect class="grow grow2" style="transition-delay:.6s" x="332" y="62" width="72" height="22" rx="3" fill="${C.orange}"/></g>`;
      body += at(2, 'pop', tag(380, 36, '4분의 1 이상', HOT, { size: 18 }), 1.3);
      body += glowRect(426, 248, 88, 54, 2, C.red, 0.2, 10);
      body += at(2, 'pop', `<circle cx="428" cy="250" r="13" fill="${C.red}"/>` + text(428, 257, '!', { size: 20, color: 'white' }), 0.4);
      body += at(2, 'pop', tag(470, 330, '큰 사고', ['white', C.red], { size: 18 }), 0.6);
      body += shown(3, g('fin fin3', flow([[188, 235], [452, 235], [452, 246]], C.purple, { w: 4 }), 0.1));
      body += fly(3, 118, 62, lens(392, 178), 0.3);
      body += at(4, 'pop', tag(110, 60, '국정 조사', HOT, { size: 24 }));
      body += glowRect(424, 246, 92, 58, 4, C.orange, 0.3, 12);
    }
    put(KEY('1', word), svg(id, body, css));
  };
  auditFig('국정 감사', 't81-so1-gamsa');
  auditFig('국정 조사', 't81-so1-josa');

  // ── 탄핵: 국회가 소추하고 헌법재판소가 심판한다 ──
  (function () {
    const id = 't81-so1-tanhaek';
    const css = base2(id) + `
      .sc-${id} .fall { transition: transform 1.2s ease-in, opacity 1.2s ease-in; }
      .on4 .sc-${id} .fall { transform: translateY(30px); opacity: .18; }`;
    let body = '';
    body += at(1, 'drop', `<rect x="68" y="63" width="64" height="84" rx="5" fill="${C.lilac}" stroke="${C.purple}" stroke-width="3"/>` + text(100, 112, '헌법', { size: 20, color: C.purple }));
    body += at(1, 'pop', `<rect x="58" y="265" width="84" height="16" rx="3" fill="${C.line}"/>` + text(100, 308, '대통령', { size: 20 }), 0.2);
    body += `<g class="b1"><g class="fall">${person(100, 265, C.green, 1.6, { tie: true })}</g></g>`;
    body += shown(1, g('fin fin1', flow([[100, 200], [100, 160]], C.red, { w: 4 }), 0.6));
    body += at(1, 'pop', cross(140, 70, 12), 1.0);
    // 국회: 3분의 2 이상 찬성
    body += at(2, 'pop', hall(320, 190, 120, 70, COLD) + text(320, 218, '국회', { size: 20 }));
    body += at(2, 'fin', `<rect x="240" y="245" width="160" height="20" rx="4" fill="white" stroke="${C.ink}" stroke-width="2.5"/>`, 0.3);
    body += `<g class="b2"><rect class="grow grow2" style="transition-delay:.5s" x="242" y="247" width="134" height="16" rx="3" fill="${C.green}"/></g>`;
    body += at(2, 'fin', `<path d="M346.7 238 V272" stroke="${C.red}" stroke-width="3"/>` + text(347, 292, '3분의 2', { size: 18, color: C.red }), 0.3);
    body += at(2, 'pop', tag(320, 330, '탄핵 소추', HOT, { size: 18 }), 1.4);
    // 헌법재판소: 9명 중 6명 이상
    body += at(3, 'pop', tag(530, 60, '헌법재판소', COLD, { size: 18 }));
    body += at(3, 'fin', judgesGrey(530, 130));
    body += judgesGreen(530, 130, 6, 3, 0.5);
    body += shown(3, g('fin fin3', flow([[392, 160], [468, 160]], C.purple, { w: 4 }), 0.1));
    body += at(3, 'pop', tag(530, 262, '9명 중 6명', OK, { size: 18 }), 1.6);
    body += at(4, 'pop', stamp(100, 215, '파면', 26), 1.0);
    body += at(4, 'pop', tag(320, 40, '탄핵', HOT, { size: 26 }));
    body += glowRect(470, 92, 120, 190, 4, C.orange, 0.3, 12);
    put(KEY('1', '탄핵'), svg(id, body, css));
  })();

  // ── 대법원: 재판의 마지막 계단 ──
  (function () {
    const id = 't81-so1-daebeobwon';
    const css = base2(id) + `
      .sc-${id} .climb { transform: translate(0, 0); }
      .on2 .sc-${id} .climb { animation: ${id}-climb 1.8s ease-in-out .2s both; }
      @keyframes ${id}-climb { 0% { transform: translate(0, 0); } 40%, 55% { transform: translate(180px, -60px); } 100% { transform: translate(300px, -120px); } }`;
    let body = '';
    body += at(1, 'rise', `<rect x="40" y="270" width="180" height="70" fill="${C.mint}" stroke="${C.green}" stroke-width="3"/>` + text(130, 300, '지방 법원', { size: 19 }) + text(130, 328, '1심', { size: 18, color: C.muted }));
    body += at(2, 'rise', `<rect x="220" y="210" width="180" height="130" fill="${C.sky}" stroke="${C.blue}" stroke-width="3"/>` + text(310, 240, '고등 법원', { size: 19 }) + text(310, 268, '2심', { size: 18, color: C.muted }));
    body += at(2, 'rise', `<rect x="400" y="150" width="200" height="190" fill="${C.lilac}" stroke="${C.purple}" stroke-width="3"/>` + text(500, 186, '대법원', { size: 22 }) + text(500, 214, '3심', { size: 18, color: C.muted }), 0.3);
    body += shown(2, g('fin fin2', flowQ([140, 210], [170, 170], [255, 186], C.orange, { w: 4 }) + flowQ([318, 150], [335, 108], [382, 118], C.orange, { w: 4 }), 0.2));
    body += at(1, 'pop', `<g class="climb">${paper(110, 238, '', 0.8)}</g>`, 0.3);
    for (let i = 0; i < 14; i++) {
      const row = Math.floor(i / 7), col = i % 7, x = 462 + col * 21 + (row ? 10 : 0), y = row ? 148 : 126;
      body += at(3, 'pop', person(x, y, i === 10 ? C.purple : C.blue, 0.55, { tie: i === 10 }), 0.2 + i * 0.07);
    }
    body += at(3, 'pop', tag(530, 64, '14명', OLD, { size: 20 }), 1.3);
    body += at(4, 'pop', tag(130, 110, '대법원', HOT, { size: 26 }));
    body += glowRect(396, 146, 208, 198, 4, C.orange, 0.3, 6);
    put(KEY('1', '대법원'), svg(id, body, css));
  })();

  // ── 헌법재판소: 재판관 아홉과 다섯 가지 심판 ──
  (function () {
    const id = 't81-so1-heonjae';
    const css = base2(id);
    let body = '';
    body += at(1, 'pop', hall(320, 250, 170, 80, OLD));
    const grp = [[C.blue, '대통령', 230], [C.green, '국회', 320], [C.purple, '대법원장', 410]];
    for (let i = 0; i < 9; i++) body += at(1, 'pop', person(200 + i * 30, 300, grp[Math.floor(i / 3)][0], 0.85), 0.3 + i * 0.08);
    grp.forEach(([col, name, x], i) => { body += at(1, 'pop', tag(x, 336, name, [C.paper, col], { size: 18 }), 1.1 + i * 0.15); });
    const JOB = [['위헌 법률 심판', 105, 60], ['정당 해산 심판', 105, 150], ['헌법 소원 심판', 105, 240], ['탄핵 심판', 535, 60], ['권한 쟁의 심판', 535, 150]];
    JOB.forEach(([name, x, y], i) => {
      const left = x < 320, ex = left ? x + tagW(name, 18) / 2 + 4 : x - tagW(name, 18) / 2 - 4;
      body += shown(2, drawn(2, `M${left ? 236 : 404} ${200 + (y - 150) * 0.25} L${f(ex)} ${y}`, C.muted, 3));
      body += at(2, 'pop', tag(x, y, name, OLD, { size: 18 }), 0.3 + i * 0.2);
    });
    body += at(3, 'pop', tag(320, 40, '헌법재판소', HOT, { size: 24 }));
    body += glowRect(228, 128, 184, 128, 3, C.orange, 0.3, 12);
    put(KEY('1', '헌법재판소'), svg(id, body, css));
  })();

  // ── 위헌: 헌법이라는 틀에 맞지 않는 법률 ──
  (function () {
    const id = 't81-so1-wiheon';
    const css = base2(id) + `
      .on3 .sc-${id} .bump { animation: ${id}-jig .4s ease-in-out 1.3s 2; }`;
    let body = '';
    body += at(1, 'drop', `<path d="M150 40 H490 V150 H420 V120 H360 V150 H280 V120 H220 V150 H150 Z" fill="${C.lilac}" stroke="${C.purple}" stroke-width="3" stroke-linejoin="round"/>` + text(320, 104, '헌법', { size: 28, color: C.purple }));
    const cardA = `<path d="M190 255 H220 V225 H280 V255 H310 V325 H190 Z" fill="${C.mint}" stroke="${C.green}" stroke-width="3" stroke-linejoin="round"/>` + text(250, 298, '가 법률', { size: 20 });
    const cardB = `<path d="M330 255 H345 V225 H435 V255 H450 V325 H330 Z" fill="${C.peach}" stroke="${C.orange}" stroke-width="3" stroke-linejoin="round"/>` + text(390, 298, '나 법률', { size: 20 });
    body += at(1, 'rise', mover([[0, 0], [0, -105]], cardA), 0.3);
    body += at(1, 'rise', mover([[0, 0], [0, 0], [0, -75]], `<g class="bump">${cardB}</g>`), 0.5);
    body += at(2, 'pop', `<circle cx="160" cy="185" r="19" fill="white" stroke="${C.green}" stroke-width="3"/>` + check(160, 186, 0.8), 1.3);
    body += at(3, 'pop', cross(484, 214), 1.3);
    body += at(4, 'pop', tag(390, 300, '위헌', HOT, { size: 26 }));
    body += glowRect(322, 146, 136, 112, 4, C.orange, 0.3, 10);
    put(KEY('1', '위헌'), svg(id, body, css));
  })();

  // ── 위헌 법률 심판·권한 쟁의 심판·정당 해산 심판: 헌법재판소가 맡는 심판 ──
  const courtFig = (word, id) => {
    const css = base2(id) + `
      .sc-${id} .scat { transition: transform 1.2s ease-out .3s, opacity 1.2s ease-out .3s; }
      .on4 .sc-${id} .scat { transform: translate(var(--sx), var(--sy)); opacity: .12; }`;
    let body = '';
    body += at(1, 'pop', tag(520, 60, '헌법재판소', COLD, { size: 18 }));
    body += at(1, 'fin', judgesGrey(520, 135), 0.2);
    const greens = (s) => judgesGreen(520, 135, 6, 3, s);
    if (word === '위헌 법률 심판') {
      body += at(1, 'pop', hall(110, 230, 130, 74, OK) + text(110, 260, '법원', { size: 20 }), 0.2);
      body += at(1, 'pop', mover([[0, 0], [290, 45]], paper(110, 75, '법률') + `<g class="h3"><g class="jig">${qmark(150, 46)}</g></g>`), 0.5);
      body += shown(2, g('fin fin2', flow([[180, 205], [452, 205]], C.purple, { w: 4 }), 0.1));
      body += at(2, 'pop', tag(315, 182, '제청', OLD, { size: 18 }), 0.5);
      body += greens(0.2);
      body += at(3, 'pop', tag(520, 268, '9명 중 6명', OK, { size: 18 }), 1.4);
      body += at(3, 'pop', cross(432, 94, 12), 1.6);
      body += at(3, 'pop', tag(400, 172, '효력 잃음', ['white', C.red], { size: 18 }), 1.6);
      body += at(4, 'pop', tag(170, 330, '위헌 법률 심판', HOT, { size: 22 }));
    }
    if (word === '권한 쟁의 심판') {
      body += at(1, 'pop', hall(90, 290, 100, 60, COLD) + text(90, 316, '국회', { size: 20 }), 0.1);
      body += at(1, 'pop', hall(300, 290, 100, 60, OK) + text(300, 316, '정부', { size: 20 }), 0.2);
      body += at(1, 'drop', mover([[0, 0], [0, 0], [-105, 25]], box(195, 120, 90, 46, '권한', HOT, 20)), 0.4);
      body += `<g class="h3">${shown(1, g('fin fin1', flow([[100, 190], [160, 148]], C.blue, { w: 4 }) + flow([[290, 190], [230, 148]], C.green, { w: 4 }), 0.7))}</g>`;
      body += `<g class="h3">${at(1, 'pop', `<g class="jig">${qmark(195, 62)}</g>`, 1.0)}</g>`;
      body += shown(2, g('fin fin2', flow([[352, 262], [452, 262]], C.purple, { w: 4 }), 0.1));
      body += at(2, 'pop', tag(402, 240, '청구', OLD, { size: 18 }), 0.5);
      body += ring(520, 180, 70, 3, C.green, 0.2);
      body += shown(3, drawn(3, 'M195 180 V340', C.red, 4, ' stroke-dasharray="10 8"'));
      body += at(3, 'pop', `<circle cx="150" cy="122" r="17" fill="white" stroke="${C.green}" stroke-width="3"/>` + check(150, 123, 0.7), 1.6);
      body += at(3, 'pop', stamp(520, 288, '판단', 26), 1.0);
      body += at(4, 'pop', tag(430, 336, '권한 쟁의 심판', HOT, { size: 22 }));
    }
    if (word === '정당 해산 심판') {
      body += at(1, 'rise', `<rect x="30" y="318" width="180" height="30" rx="4" fill="${C.lilac}" stroke="${C.purple}" stroke-width="2.5"/>` + text(120, 340, '민주주의', { size: 18, color: C.purple }));
      body += `<g class="b1 h4">${g('pop pop1', `<circle cx="120" cy="240" r="62" fill="white" stroke="${C.orange}" stroke-width="3" stroke-dasharray="9 6"/>` + tag(120, 160, '○○당', HOT, { size: 18 }), 0.2)}</g>`;
      [[92, 245, -70, -40], [120, 245, 0, -70], [148, 245, 70, -40], [106, 285, -60, 20], [134, 285, 60, 20]].forEach(([x, y, sx, sy], i) => {
        body += at(1, 'pop', `<g class="scat" style="--sx:${sx}px;--sy:${sy}px">${person(x, y, C.orange, 0.8)}</g>`, 0.4 + i * 0.1);
      });
      body += shown(1, drawn(1, 'M48 318 L58 330 L50 340 L62 348 M192 318 L182 331 L194 340 L184 348', C.red, 3));
      body += at(2, 'pop', hall(300, 270, 100, 56, OK) + text(300, 296, '정부', { size: 20 }), 0.1);
      body += shown(2, g('fin fin2', flow([[355, 238], [458, 238]], C.purple, { w: 4 }), 0.4));
      body += at(2, 'pop', tag(405, 216, '청구', OLD, { size: 18 }), 0.8);
      body += greens(0.2);
      body += at(3, 'pop', tag(520, 268, '9명 중 6명', OK, { size: 18 }), 1.4);
      body += at(4, 'pop', stamp(120, 230, '해산', 26), 1.0);
      body += at(4, 'pop', tag(345, 336, '정당 해산 심판', HOT, { size: 22 }));
    }
    body += glowRect(460, 92, 120, 152, 4, C.orange, 0.3, 12);
    put(KEY('1', word), svg(id, body, css));
  };
  courtFig('위헌 법률 심판', 't81-so1-wiheonbeop');
  courtFig('권한 쟁의 심판', 't81-so1-gwonhan');
  courtFig('정당 해산 심판', 't81-so1-jeongdang');
})(typeof window !== 'undefined' ? window : globalThis);
