// 사회 4-1 낱말 도식(셋째 묶음): 경제활동과 합리적 선택(경제활동·생산·소비·자원·한정·희소성·합리적 선택·이윤·소득),
// 경제활동에서의 다양한 교류(교류·생산지·인적 교류·물적 교류·상호 의존·상생)를 코드로 그린다.
// 합리적 선택의 표는 동아 112~113쪽 가방 고르기(가격·디자인·무게·많이 들어감, 3·2·1점, 총점 7·10·9점)를 따른다.
// 생산지의 감귤-서귀포, 포도-영동, 굴-통영은 동아 119쪽, 교류의 조개 마을·배추 마을은 동아 125쪽,
// 이윤의 쿠키 1,500원·재료비 1,000원은 화면 설명에 쓴 간단한 예다. 마을은 모두 가상의 마을이고 지도는 쓰지 않는다.
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

  // 글자 폭 어림(맑은 고딕 굵게: 한글 1em, 숫자 .6em, 빈칸 .3em)
  const tw = (s, size) => [...String(s)].reduce((a, c) => a + (/[가-힣]/.test(c) ? 1 : c === ' ' ? 0.3 : 0.6), 0) * size;
  const HOT = [C.peach, C.orange], COLD = [C.sky, C.blue], OK = [C.mint, C.green], OLD = [C.lilac, C.purple], PLAIN = ['white', C.muted];
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
  // 굽은 흐르는 화살표(2차 곡선): 시작 a, 꺾는 점 q, 끝 b
  const flowQ = (a, q, b, color, { w = 5 } = {}) => {
    const ang = Math.atan2(b[1] - q[1], b[0] - q[0]);
    const end = [b[0] - w * Math.cos(ang), b[1] - w * Math.sin(ang)];
    return `<g><path class="mar" d="M${f(a[0])} ${f(a[1])} Q${f(q[0])} ${f(q[1])} ${f(end[0])} ${f(end[1])}" stroke="${color}" stroke-width="${w}" stroke-dasharray="14 10" stroke-linecap="round" fill="none"/>${head(b[0], b[1], ang, color, w)}</g>`;
  };
  const glowRect = (x, y, w, h, n, color = C.green, delay = 0, rx = 12) =>
    `<g class="b${n}"><rect class="flash flash${n}"${dl(delay)} x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="${rx}" fill="none" stroke="${color}" stroke-width="5"/></g>`;
  const ring = (cx, cy, r, n, color = C.green, s = 0) => `<g class="b${n}"><circle class="ring ring${n}"${dl(s)} cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${color}" stroke-width="4"/></g>`;
  // 칸마다 자리를 옮기는 것: pts = [[x,y] (1칸), [x,y] (2칸) …], 빈 칸은 앞 칸 자리를 그대로 쓴다
  const mvStyle = (pts, extra = '') => {
    const out = [];
    for (let n = 1; n <= 5; n++) { const p = pts[Math.min(n, pts.length) - 1]; out.push(`--x${n}:${f(p[0])}px;--y${n}:${f(p[1])}px`); }
    return out.join(';') + (extra ? ';' + extra : '');
  };
  const mv = (pts, inner, extra = '') => `<g class="mv" style="${mvStyle(pts, extra)}">${inner}</g>`;
  // 오가기: (dx, dy) 만큼 갔다가 사라지고 처음 자리에서 다시 나온다
  const trip = (dx, dy, inner, { dur = 3, delay = 0 } = {}) => `<g class="trip" style="--tx:${f(dx)}px;--ty:${f(dy)}px;animation-duration:${dur}s;animation-delay:${delay}s">${inner}</g>`;
  // 굽은 길로 오가기: 가운데 (mx, my) 를 거쳐 (dx, dy) 로
  const arcTrip = (mx, my, dx, dy, inner, { dur = 3, delay = 0 } = {}) => `<g class="arctrip" style="--mx:${f(mx)}px;--my:${f(my)}px;--tx:${f(dx)}px;--ty:${f(dy)}px;animation-duration:${dur}s;animation-delay:${delay}s">${inner}</g>`;
  const place = (x, y, inner, s = 1) => `<g transform="translate(${f(x)} ${f(y)})${s !== 1 ? ` scale(${s})` : ''}">${inner}</g>`;

  // ── 그림 조각(가운데가 0 0) ──
  const person = (x, y, color = C.green, s = 1) => `<circle cx="${f(x)}" cy="${f(y - 27 * s)}" r="${f(7.5 * s)}" fill="${color}"/><path d="M${f(x - 11 * s)} ${f(y)} V${f(y - 9 * s)} Q${f(x - 11 * s)} ${f(y - 18 * s)} ${f(x)} ${f(y - 18 * s)} Q${f(x + 11 * s)} ${f(y - 18 * s)} ${f(x + 11 * s)} ${f(y - 9 * s)} V${f(y)} Z" fill="${color}"/>`;
  // 제빵사: 흰 모자를 쓴 사람
  const baker = (x, y, s = 1) => person(x, y, C.green, s) + `<path d="M${f(x - 9 * s)} ${f(y - 32 * s)} H${f(x + 9 * s)} V${f(y - 38 * s)} Q${f(x + 15 * s)} ${f(y - 46 * s)} ${f(x + 6 * s)} ${f(y - 49 * s)} Q${f(x)} ${f(y - 56 * s)} ${f(x - 6 * s)} ${f(y - 49 * s)} Q${f(x - 15 * s)} ${f(y - 46 * s)} ${f(x - 9 * s)} ${f(y - 38 * s)} Z" fill="white" stroke="${C.muted}" stroke-width="2"/>`;
  const coin = (x = 0, y = 0) => `<ellipse cx="${x}" cy="${y + 3.5}" rx="13" ry="5.5" fill="${C.orange}"/><ellipse cx="${x}" cy="${y}" rx="13" ry="5.5" fill="${C.yellow}" stroke="${C.orange}" stroke-width="2"/>`;
  const bread = () => `<path d="M-24 10 Q-28 -12 0 -14 Q28 -12 24 10 Z" fill="${C.peach}" stroke="${C.orange}" stroke-width="3" stroke-linejoin="round"/><path d="M-10 -8 L-5 3 M3 -10 L8 1" stroke="${C.orange}" stroke-width="2.5" stroke-linecap="round"/>`;
  const oven = (x, y, w = 80, h = 80) => `<rect x="${f(x - w / 2)}" y="${f(y - h)}" width="${w}" height="${h}" rx="6" fill="white" stroke="${C.ink}" stroke-width="3"/><rect x="${f(x - w / 2 + 10)}" y="${f(y - h + 18)}" width="${w - 20}" height="${f(h - 34)}" rx="4" fill="${C.peach}" stroke="${C.orange}" stroke-width="2.5"/><g class="twk"><rect x="${f(x - w / 2 + 16)}" y="${f(y - 26)}" width="${w - 32}" height="6" rx="3" fill="${C.orange}"/></g><circle cx="${f(x - w / 2 + 14)}" cy="${f(y - h + 9)}" r="3.5" fill="${C.muted}"/><circle cx="${f(x - w / 2 + 26)}" cy="${f(y - h + 9)}" r="3.5" fill="${C.muted}"/>`;
  const house = (x, y, s = 1, [fill, stroke] = PLAIN) => {
    const k = (v) => f(v * s);
    return `<path d="M${f(x - k(30))} ${y} V${f(y - k(32))} L${x} ${f(y - k(56))} L${f(x + k(30))} ${f(y - k(32))} V${y} Z" fill="${fill}" stroke="${stroke}" stroke-width="3" stroke-linejoin="round"/><rect x="${f(x - k(8))}" y="${f(y - k(20))}" width="${k(16)}" height="${k(20)}" fill="${stroke}"/>`;
  };
  const truck = (cargo = '') => `<rect x="-42" y="-38" width="54" height="32" rx="3" fill="white" stroke="${C.ink}" stroke-width="3"/>${cargo}<path d="M14 -6 V-28 H30 L40 -16 V-6 Z" fill="${C.sky}" stroke="${C.ink}" stroke-width="3" stroke-linejoin="round"/><circle cx="-26" cy="-4" r="7" fill="${C.ink}"/><circle cx="26" cy="-4" r="7" fill="${C.ink}"/>`;
  const fish = (s = 1, [fill, stroke] = COLD) => `<g transform="scale(${s})"><ellipse cx="-3" cy="0" rx="15" ry="8" fill="${fill}" stroke="${stroke}" stroke-width="2.5"/><path d="M11 0 L23 -8 V8 Z" fill="${fill}" stroke="${stroke}" stroke-width="2.5" stroke-linejoin="round"/><circle cx="-10" cy="-2" r="2" fill="${C.ink}"/></g>`;
  const rice = () => `<path d="M-17 -18 Q0 -24 17 -18 L21 15 Q0 21 -21 15 Z" fill="white" stroke="${C.muted}" stroke-width="2.5" stroke-linejoin="round"/>${text(0, 6, '쌀', { size: 18 })}`;
  const cabbage = () => `<circle r="16" fill="${C.mint}" stroke="${C.green}" stroke-width="2.5"/><path d="M0 -14 V14 M0 -1 Q-8 -5 -11 -10 M0 5 Q8 1 11 -5" stroke="${C.green}" stroke-width="2" fill="none" stroke-linecap="round"/>`;
  const clam = () => `<path d="M-16 6 Q-18 -14 0 -16 Q18 -14 16 6 Q0 12 -16 6 Z" fill="${C.peach}" stroke="${C.orange}" stroke-width="2.5" stroke-linejoin="round"/><path d="M0 -14 V8 M-8 -12 L-5 8 M8 -12 L5 8" stroke="${C.orange}" stroke-width="1.8"/>`;
  const tangerine = () => `<circle r="13" fill="${C.orange}"/><ellipse cx="5" cy="-14" rx="6" ry="3" fill="${C.green}" transform="rotate(-25 5 -14)"/>`;
  const grapes = () => [[-8, -8], [0, -8], [8, -8], [-4, 0], [4, 0], [0, 8]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="${C.purple}"/>`).join('') + `<path d="M0 -13 V-18" stroke="${C.green}" stroke-width="3" stroke-linecap="round"/>`;
  const oyster = () => `<path d="M-15 1 Q-13 -11 1 -11 Q15 -9 15 2 Q8 11 -5 9 Q-15 7 -15 1 Z" fill="${C.line}" stroke="${C.muted}" stroke-width="2.5" stroke-linejoin="round"/><path d="M-8 1 Q0 -4 8 1" stroke="${C.muted}" stroke-width="2" fill="none"/>`;
  const apple = () => `<path d="M0 -9 Q-14 -15 -14 0 Q-12 13 0 11 Q12 13 14 0 Q14 -15 0 -9 Z" fill="${C.red}"/><path d="M0 -9 V-15" stroke="${C.ink}" stroke-width="2.5" stroke-linecap="round"/><ellipse cx="6" cy="-15" rx="5" ry="2.5" fill="${C.green}"/>`;
  const crate = (inner) => `<rect x="-20" y="-14" width="40" height="28" rx="3" fill="${C.peach}" stroke="${C.orange}" stroke-width="2.5"/><g transform="scale(.7)">${inner}</g>`;
  const egg = () => `<ellipse rx="11" ry="14" fill="white" stroke="${C.muted}" stroke-width="2.5"/>`;
  const sack = (label) => `<path d="M-30 -22 Q0 -30 30 -22 L34 20 Q0 28 -34 20 Z" fill="white" stroke="${C.muted}" stroke-width="2.5" stroke-linejoin="round"/>${text(0, 7, label, { size: 18 })}`;
  const clock = () => `<circle r="22" fill="white" stroke="${C.ink}" stroke-width="3"/><path d="M0 0 L9 5" stroke="${C.ink}" stroke-width="3" stroke-linecap="round"/><g class="spin"><path d="M0 16 V-16" stroke="none"/><path d="M0 0 V-16" stroke="${C.blue}" stroke-width="3" stroke-linecap="round"/></g><circle r="3" fill="${C.ink}"/>`;
  const scissors = () => `<circle cx="-6" cy="11" r="5" fill="none" stroke="${C.ink}" stroke-width="2.5"/><circle cx="6" cy="11" r="5" fill="none" stroke="${C.ink}" stroke-width="2.5"/><path d="M-4 7 L6 -14 M4 7 L-6 -14" stroke="${C.ink}" stroke-width="3" stroke-linecap="round"/>`;
  const cookie = () => `<circle r="18" fill="${C.peach}" stroke="${C.orange}" stroke-width="3"/>${[[-7, -5], [6, -8], [2, 5], [-6, 8], [9, 4]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.6" fill="${C.ink}"/>`).join('')}`;
  const pudding = () => `<path d="M-14 -10 H14 L10 12 H-10 Z" fill="${C.yellow}" stroke="${C.orange}" stroke-width="2.5" stroke-linejoin="round"/><path d="M-14 -10 Q-10 -19 0 -19 Q10 -19 14 -10 Z" fill="${C.orange}"/>`;
  // 가방: mark 는 ○·△·□
  const bagMark = (m, color) => m === 'o' ? `<circle cx="0" cy="3" r="8" fill="none" stroke="${color}" stroke-width="3"/>` : m === 't' ? `<path d="M0 -6 L9 10 H-9 Z" fill="none" stroke="${color}" stroke-width="3" stroke-linejoin="round"/>` : `<rect x="-8" y="-5" width="16" height="16" fill="none" stroke="${color}" stroke-width="3"/>`;
  const bag = (m, [fill, stroke]) => `<path d="M-12 -14 Q-12 -30 0 -30 Q12 -30 12 -14" fill="none" stroke="${stroke}" stroke-width="4"/><rect x="-27" y="-15" width="54" height="38" rx="8" fill="${fill}" stroke="${stroke}" stroke-width="3"/>${bagMark(m, stroke)}`;
  const building = (x, y, w, h, [fill, stroke] = COLD) => {
    let o = `<rect x="${f(x - w / 2)}" y="${f(y - h)}" width="${w}" height="${h}" rx="3" fill="${fill}" stroke="${stroke}" stroke-width="3"/>`;
    const cols = Math.max(1, Math.floor((w - 10) / 18)), rows = Math.max(1, Math.floor((h - 20) / 22));
    const x0 = x - ((cols - 1) * 18) / 2;
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) o += `<rect x="${f(x0 + c * 18 - 5)}" y="${f(y - h + 10 + r * 22)}" width="10" height="11" rx="1.5" fill="white"/>`;
    return o;
  };
  const tree = (x, y, r = 18) => `<rect x="${f(x - r * 0.18)}" y="${f(y + r * 0.5)}" width="${f(r * 0.36)}" height="${f(r * 1.05)}" fill="${C.muted}"/><circle cx="${x}" cy="${y}" r="${r}" fill="${C.green}"/><circle cx="${f(x - r * 0.3)}" cy="${f(y - r * 0.3)}" r="${f(r * 0.38)}" fill="${C.mint}" opacity=".55"/>`;
  const mountain = (x, y, w, h) => `<path d="M${f(x - w / 2)} ${y} L${x} ${f(y - h)} L${f(x + w / 2)} ${y} Z" fill="${C.mint}" stroke="${C.green}" stroke-width="3" stroke-linejoin="round"/><path d="M${f(x - w * 0.12)} ${f(y - h * 0.76)} L${x} ${f(y - h)} L${f(x + w * 0.12)} ${f(y - h * 0.76)}" fill="none" stroke="${C.green}" stroke-width="3" stroke-linejoin="round"/>`;
  const waves = (x0, x1, y, color = C.blue) => {
    let d = `M${x0} ${y}`;
    for (let x = x0; x < x1; x += 24) d += ` q6 -7 12 0 q6 7 12 0`;
    return `<path d="${d}" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round"/>`;
  };
  const school = (x, y) => `<path d="M${x} ${y - 112} V${y - 140}" stroke="${C.ink}" stroke-width="2.5"/><path d="M${x} ${y - 140} H${x + 20} V${y - 128} H${x} Z" fill="${C.orange}"/><path d="M${x - 80} ${y - 86} L${x} ${y - 112} L${x + 80} ${y - 86} Z" fill="${C.peach}" stroke="${C.orange}" stroke-width="3" stroke-linejoin="round"/>` +
    `<rect x="${x - 72}" y="${y - 86}" width="144" height="86" fill="white" stroke="${C.orange}" stroke-width="3"/>` +
    [-52, -26, 26, 52].map((dx) => `<rect x="${x + dx - 8}" y="${y - 70}" width="16" height="16" rx="2" fill="${C.sky}" stroke="${C.blue}" stroke-width="1.5"/>`).join('') +
    `<rect x="${x - 12}" y="${y - 32}" width="24" height="32" fill="${C.orange}"/>`;
  const bus = () => `<rect x="-46" y="-40" width="92" height="34" rx="7" fill="${C.yellow}" stroke="${C.orange}" stroke-width="3"/>${[-34, -14, 6].map((x) => `<rect x="${x}" y="-34" width="15" height="12" rx="2" fill="white" stroke="${C.orange}" stroke-width="1.5"/>`).join('')}<rect x="26" y="-34" width="14" height="20" rx="2" fill="${C.sky}" stroke="${C.orange}" stroke-width="1.5"/><circle cx="-28" cy="-5" r="7" fill="${C.ink}"/><circle cx="28" cy="-5" r="7" fill="${C.ink}"/>`;

  // 장면마다 같이 쓰는 움직임
  const base = (id) => {
    let s = `
    .sc-${id} .pop, .sc-${id} .pulse, .sc-${id} .ring, .sc-${id} .spin, .sc-${id} .snip { transform-box: fill-box; transform-origin: center; }
    .sc-${id} .twk { animation: ${id}-twk 1.2s ease-in-out infinite alternate; }
    .sc-${id} .mar { animation: ${id}-mar .7s linear infinite; }
    .sc-${id} .draw { stroke-dasharray: 1; stroke-dashoffset: 1; transition: stroke-dashoffset 1.4s ease-in-out .2s; }
    .sc-${id} .grow { transform-box: fill-box; transform-origin: 0 50%; transform: scaleX(0); transition: transform .9s ease-in-out; }
    .sc-${id} .growy { transform-box: fill-box; transform-origin: 50% 100%; transform: scaleY(0); transition: transform 1s ease-out .2s; }
    .sc-${id} .mv { transform: translate(var(--x1), var(--y1)); transition: transform 1.4s ease-in-out, opacity .6s ease; }
    .sc-${id} .bob { animation: ${id}-bob 1.1s ease-in-out infinite; }
    .sc-${id} .jig { animation: ${id}-jig 1.3s ease-in-out infinite; }
    .sc-${id} .spin { animation: ${id}-spin 4s linear infinite; }
    .sc-${id} .snip { animation: ${id}-snip .5s ease-in-out infinite alternate; }
    .sc-${id} .trip { animation: ${id}-trip 3s ease-in-out infinite; }
    .sc-${id} .arctrip { animation: ${id}-arctrip 3s linear infinite; }
    .sc-${id} .ring { opacity: 0; }
    @keyframes ${id}-pop { 0% { opacity: 0; transform: scale(.3); } 70% { opacity: 1; transform: scale(1.12); } 100% { opacity: 1; transform: scale(1); } }
    @keyframes ${id}-fin { from { opacity: 0; } to { opacity: 1; } }
    @keyframes ${id}-rise { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
    @keyframes ${id}-drop { from { opacity: 0; transform: translateY(-30px); } to { opacity: 1; transform: none; } }
    @keyframes ${id}-pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.12); } }
    @keyframes ${id}-flash { 0% { opacity: 0; } 20% { opacity: 1; } 40% { opacity: .25; } 60% { opacity: 1; } 80% { opacity: .25; } 100% { opacity: 1; } }
    @keyframes ${id}-ring { 0% { opacity: .9; transform: scale(1); } 100% { opacity: 0; transform: scale(1.6); } }
    @keyframes ${id}-twk { from { opacity: .35; } to { opacity: 1; } }
    @keyframes ${id}-mar { from { stroke-dashoffset: 24; } to { stroke-dashoffset: 0; } }
    @keyframes ${id}-bob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-9px); } }
    @keyframes ${id}-jig { 0%, 100% { transform: translate(0, 0); } 25% { transform: translate(2.5px, -2px); } 50% { transform: translate(-2px, 1.5px); } 75% { transform: translate(1.5px, 2.5px); } }
    @keyframes ${id}-spin { to { transform: rotate(360deg); } }
    @keyframes ${id}-snip { from { transform: rotate(-14deg); } to { transform: rotate(14deg); } }
    @keyframes ${id}-trip { 0% { opacity: 0; transform: translate(0, 0); } 12% { opacity: 1; transform: translate(0, 0); } 80% { opacity: 1; transform: translate(var(--tx), var(--ty)); } 100% { opacity: 0; transform: translate(var(--tx), var(--ty)); } }
    @keyframes ${id}-arctrip { 0% { opacity: 0; transform: translate(0, 0); } 8% { opacity: 1; transform: translate(0, 0); } 46% { transform: translate(var(--mx), var(--my)); } 84% { opacity: 1; transform: translate(var(--tx), var(--ty)); } 100% { opacity: 0; transform: translate(var(--tx), var(--ty)); } }
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

  // ════ 3-1 경제활동과 합리적 선택 ════

  // ── 경제활동: 빵을 굽고(생산) 팔고(생산) 사 먹는(소비) 빵집의 흐름을 한 테두리로 묶는다 ──
  (function () {
    const id = 't41-s3-gyeongje';
    let css = base(id);
    const GY = 220;
    let body = '';
    body += `<path d="M24 ${GY} H616" stroke="${C.line}" stroke-width="3" stroke-linecap="round"/>`;
    // 1칸: 오븐과 제빵사, 빵 둘이 구워져 나온다
    body += at(1, 'pop', oven(85, GY, 90, 96));
    body += at(1, 'pop', baker(188, GY, 1.35), 0.2);
    body += `<rect x="240" y="188" width="140" height="10" rx="3" fill="${C.muted}"/><path d="M252 198 V${GY} M368 198 V${GY}" stroke="${C.muted}" stroke-width="5"/>`;
    // 빵 A: 오븐 위 → 진열대
    body += at(1, 'pop', mv([[0, 0], [221, 66]], place(61, 110, bread(), 0.85), 'transition-delay:.2s'), 0.6);
    // 빵 B: 오븐 위 → 진열대 → 손님
    body += at(1, 'pop', mv([[0, 0], [231, 66], [417, 78]], place(109, 110, bread(), 0.85), 'transition-delay:.5s'), 0.9);
    body += at(1, 'pop', tag(85, 262, '굽기', OK), 1.1);
    body += at(2, 'pop', tag(310, 262, '팔기', OK), 1.2);
    // 3칸: 손님이 와서 돈을 내고 빵을 가져간다
    body += at(3, 'pop', person(565, GY, C.blue, 1.35));
    body += shown(3, mv([[0, 0], [0, 0], [-335, 8]], coin(540, 170), 'transition-delay:.3s'));
    body += at(3, 'pop', tag(565, 262, '사 먹기', COLD), 1.2);
    // 4칸: 생산·소비로 묶고 큰 테두리 경제활동
    body += shown(4, `<path class="draw draw4" pathLength="1" d="M40 282 V294 H380 V282" stroke="${C.green}" stroke-width="3.5" fill="none" stroke-linejoin="round"/><path class="draw draw4" pathLength="1" d="M505 282 V294 H625 V282" stroke="${C.blue}" stroke-width="3.5" fill="none" stroke-linejoin="round"/>`);
    body += at(4, 'pop', tag(210, 318, '생산', OK, { size: 20 }), 0.9);
    body += at(4, 'pop', tag(565, 318, '소비', COLD, { size: 20 }), 1.1);
    body += glowRect(12, 40, 616, 308, 4, C.purple, 1.4, 18);
    body += at(4, 'pop', tag(320, 40, '경제활동', OLD, { size: 22 }), 1.6);
    put('4-1/사회/3-1/경제활동', svg(id, body, css));
  })();

  // ── 생산: 만들기·나르기·남을 위해 일해 주기 세 칸을 생산 테두리로 묶는다 ──
  (function () {
    const id = 't41-s3-saengsan';
    let css = base(id);
    const GY = 200, XS = [115, 320, 525];
    let body = '';
    const panel = (x) => `<rect x="${x - 92}" y="56" width="184" height="196" rx="14" fill="white" stroke="${C.line}" stroke-width="3"/><path d="M${x - 80} ${GY} H${x + 80}" stroke="${C.line}" stroke-width="3" stroke-linecap="round"/>`;
    // 1칸: 빵 만들기
    body += at(1, 'pop', panel(XS[0]) + oven(78, GY, 64, 66) + baker(158, GY, 1.2));
    body += at(1, 'pop', place(80, 120, bread()), 0.6);
    body += at(1, 'pop', tag(XS[0], 228, '만들기', OK), 0.9);
    // 2칸: 트럭이 빵 상자를 실어 나른다
    body += at(2, 'pop', panel(XS[1]));
    body += at(2, 'pop', `<path d="M362 ${GY} V150 H400 V${GY}" fill="white" stroke="${C.orange}" stroke-width="3" stroke-linejoin="round"/>` + [0, 1].map((i) => `<path d="M${359 + i * 22} 150 h22 v12 q-11 8 -22 0 Z" fill="${i ? 'white' : C.peach}" stroke="${C.orange}" stroke-width="2"/>`).join('') + `<rect x="373" y="176" width="16" height="24" fill="${C.orange}"/>`);
    body += shown(2, trip(54, 0, place(270, GY, truck(`<g transform="translate(-15 -22) scale(.62)">${bread()}</g>`), 0.85), { dur: 2.6 }));
    body += at(2, 'pop', tag(XS[1], 228, '나르기', OK), 0.6);
    // 3칸: 미용사가 손님 머리를 잘라 준다
    body += at(3, 'pop', panel(XS[2]) + `<path d="M470 ${GY} V172 H508 V${GY}" fill="none" stroke="${C.muted}" stroke-width="5"/>` + person(489, 182, C.blue) + `<path d="M472 182 L489 160 L506 182 Z" fill="${C.sky}" stroke="${C.blue}" stroke-width="2"/>` + person(570, GY, C.green, 1.2));
    body += shown(3, place(528, 140, `<g class="snip">${scissors()}</g>`));
    body += at(3, 'pop', tag(XS[2], 228, '일해 주기', OK), 0.6);
    // 4칸: 셋을 생산으로 묶는다
    body += glowRect(14, 44, 612, 220, 4, C.green, 0.2, 18);
    body += shown(4, `<path class="draw draw4" pathLength="1" d="M${XS[0]} 256 V278 H${XS[2]} V256 M${XS[1]} 256 V278" stroke="${C.green}" stroke-width="3.5" fill="none" stroke-linejoin="round"/>`);
    body += at(4, 'pop', tag(320, 312, '생산', OK, { size: 26 }), 1);
    put('4-1/사회/3-1/생산', svg(id, body, css));
  })();

  // ── 소비: 빵을 사서 먹고, 미용실에서 머리를 자른다 — 사서 쓰는 사람 쪽을 짚는다 ──
  (function () {
    const id = 't41-s3-sobi';
    let css = base(id);
    const Y1 = 150, Y2 = 300;
    let body = '';
    body += `<path d="M24 ${Y1} H616 M24 ${Y2} H616" stroke="${C.line}" stroke-width="3" stroke-linecap="round"/>`;
    body += `<path d="M24 185 H616" stroke="${C.line}" stroke-width="2" stroke-dasharray="6 8"/>`;
    // 만드는 쪽(4칸에 흐려진다)
    body += at(1, 'pop', `<g class="prod">${baker(70, Y1, 1.25)}<rect x="110" y="120" width="120" height="9" rx="3" fill="${C.muted}"/><path d="M120 129 V${Y1} M220 129 V${Y1}" stroke="${C.muted}" stroke-width="5"/></g>`);
    // 1칸: 손님이 돈을 내고 빵을 산다
    body += at(1, 'pop', person(478, Y1, C.blue, 1.25), 0.2);
    const bites = [[20, -4, 0.5], [12, -11, 1.1], [22, 5, 1.7]].map(([x, y, s]) => `<circle class="bite" cx="${x}" cy="${y}" r="9" fill="${C.paper}" style="transition-delay:${s}s"/>`).join('');
    body += at(1, 'pop', `<g class="breadmv">${place(168, 108, bread() + bites)}</g>`, 0.3);
    body += `<g class="b1"><g class="coinmv">${coin(452, 112)}</g></g>`;
    body += at(1, 'pop', tag(570, 92, '사기', COLD, { size: 18 }), 1.6);
    // 2칸: 빵을 먹는다(한 입씩 줄어든다)
    body += at(2, 'pop', tag(570, 134, '먹기', COLD, { size: 18 }), 0.4);
    // 3칸: 미용실에서 머리를 자른다
    body += at(3, 'pop', `<g class="prod">${person(388, Y2, C.green, 1.25)}</g>`);
    body += at(3, 'pop', `<path d="M442 ${Y2} V272 H484 V${Y2}" fill="none" stroke="${C.muted}" stroke-width="5"/>` + person(463, 282, C.blue) + `<path d="M445 282 L463 260 L481 282 Z" fill="${C.sky}" stroke="${C.blue}" stroke-width="2"/>`, 0.2);
    body += shown(3, place(428, 240, `<g class="snip">${scissors()}</g>`));
    body += at(3, 'pop', tag(570, 262, '이용하기', COLD, { size: 18 }), 0.8);
    // 4칸: 사서 쓰는 쪽에 고리, 소비
    body += ring(470, 120, 34, 4, C.blue) + ring(463, 262, 30, 4, C.blue, 0.3);
    body += glowRect(424, 58, 96, 100, 4, C.blue, 0.4, 14) + glowRect(424, 214, 96, 94, 4, C.blue, 0.6, 14);
    body += at(4, 'pop', tag(560, 205, '소비', COLD, { size: 24 }), 0.6);
    css += `
      .sc-${id} .bite { opacity: 0; transition: opacity .3s ease; }
      .on2 .sc-${id} .bite { opacity: 1; }
      .sc-${id} .breadmv { transition: transform 1.3s ease-in-out 1.4s; }
      .on1 .sc-${id} .breadmv { transform: translate(276px, 4px); }
      .sc-${id} .coinmv { transition: transform 1.2s ease-in-out .4s; }
      .on1 .sc-${id} .coinmv { transform: translate(-344px, 14px); }
      .sc-${id} .prod { transition: opacity .8s ease; }
      .on4 .sc-${id} .prod { opacity: .3; }`;
    put('4-1/사회/3-1/소비', svg(id, `<g transform="translate(0 18)">${body}</g>`, css));
  })();

  // ── 자원: 재료(밀가루·달걀), 돈, 시간이 오븐으로 들어가 빵이 된다 ──
  (function () {
    const id = 't41-s3-jawon';
    let css = base(id);
    let body = '';
    // 1칸: 재료
    body += at(1, 'pop', place(82, 108, sack('밀가루')));
    body += at(1, 'pop', place(176, 110, egg()) + place(206, 110, egg()), 0.3);
    body += at(1, 'pop', tag(140, 166, '재료', HOT), 0.6);
    // 2칸: 돈과 시간
    body += at(2, 'pop', coin(70, 250) + coin(70, 240) + coin(70, 230) + coin(98, 250), 0);
    body += at(2, 'pop', place(192, 236, clock()), 0.3);
    body += at(2, 'pop', tag(82, 292, '돈', HOT), 0.6) + at(2, 'pop', tag(192, 292, '시간', HOT), 0.8);
    // 3칸: 모두 오븐으로, 빵이 나온다
    body += at(1, 'fin', oven(430, 250, 104, 100));
    body += shown(3, g('fin fin3', flow([[248, 122], [370, 180]], C.orange) + flow([[248, 238], [370, 214]], C.orange)));
    body += shown(3, g('fin fin3', flow([[490, 200], [522, 200]], C.green, { w: 4 }), 1));
    body += at(3, 'pop', place(568, 196, bread(), 1.2), 1.3);
    body += at(3, 'pop', tag(568, 246, '빵', OK), 1.6);
    // 4칸: 넷을 묶어 자원
    body += glowRect(26, 70, 228, 246, 4, C.orange, 0.2, 16);
    body += at(4, 'pop', tag(140, 40, '자원', HOT, { size: 26 }), 0.6);
    put('4-1/사회/3-1/자원', svg(id, body, css));
  })();

  // ── 한정: 하루 24시간 띠가 꽉 차서, 더 넣으려는 칸이 튕겨 나온다 ──
  (function () {
    const id = 't41-s3-hanjeong';
    let css = base(id);
    const X0 = 60, W = 520, H = W / 24, Y0 = 160, BH = 60;
    let body = '';
    // 1칸: 빈 띠와 양 끝 벽
    body += at(1, 'fin', `<rect x="${X0}" y="${Y0}" width="${W}" height="${BH}" fill="white"/>`);
    body += shown(1, `<rect class="draw draw1" pathLength="1" x="${X0}" y="${Y0}" width="${W}" height="${BH}" fill="none" stroke="${C.ink}" stroke-width="3"/>`);
    for (let h = 3; h < 24; h += 3) body += shown(1, `<path d="M${f(X0 + h * H)} ${Y0 + BH} V${Y0 + BH + 10}" stroke="${C.muted}" stroke-width="2"/>`);
    const walls = `<rect x="${X0 - 10}" y="${Y0 - 14}" width="10" height="${BH + 28}" rx="3" fill="${C.ink}"/><rect x="${X0 + W}" y="${Y0 - 14}" width="10" height="${BH + 28}" rx="3" fill="${C.ink}"/>`;
    body += at(1, 'pop', walls, 0.4);
    body += at(1, 'pop', text(X0, Y0 + BH + 38, '0', { size: 20 }) + text(X0 + W, Y0 + BH + 38, '24', { size: 20 }), 0.6);
    body += at(1, 'pop', tag(320, 112, '하루 24시간', PLAIN, { size: 20 }), 0.8);
    // 2칸: 잠·학교·밥·숙제·놀이가 차례로 채운다(9·6·3·3·3시간)
    const blocks = [['잠', 9, OLD], ['학교', 6, COLD], ['밥', 3, HOT], ['숙제', 3, OK], ['놀이', 3, [C.yellow, C.orange]]];
    let x = X0;
    blocks.forEach(([label, h, [fill, stroke]], i) => {
      const w = h * H;
      body += shown(2, `<g class="grow grow2" style="transition-delay:${f(0.2 + i * 0.35)}s"><rect x="${f(x + 2)}" y="${Y0 + 3}" width="${f(w - 4)}" height="${BH - 6}" rx="4" fill="${fill}" stroke="${stroke}" stroke-width="2.5"/>${text(f(x + w / 2), Y0 + 37, label, { size: 20 })}</g>`);
      x += w;
    });
    // 3칸: 책 읽기 칸이 들어가려다 튕긴다
    body += at(3, 'pop', `<g class="bounce"><rect x="470" y="40" width="100" height="48" rx="6" fill="${C.sky}" stroke="${C.blue}" stroke-width="2.5"/>${text(520, 71, '책 읽기', { size: 20 })}</g>`);
    body += at(3, 'pop', `<path d="M418 52 L442 76 M442 52 L418 76" stroke="${C.red}" stroke-width="6" stroke-linecap="round"/>`, 1);
    body += glowRect(X0, Y0, W, BH, 3, C.red, 0.8, 4);
    // 4칸: 양 끝 벽이 반짝, 한정
    body += `<g class="b4">${g('flash flash4', `<rect x="${X0 - 14}" y="${Y0 - 18}" width="18" height="${BH + 36}" rx="5" fill="none" stroke="${C.orange}" stroke-width="4"/><rect x="${X0 + W - 4}" y="${Y0 - 18}" width="18" height="${BH + 36}" rx="5" fill="none" stroke="${C.orange}" stroke-width="4"/>`, 0.2)}</g>`;
    body += at(4, 'pop', tag(320, 316, '한정', HOT, { size: 26 }), 0.6);
    css += `
      .sc-${id} .bounce { animation: ${id}-bounce 1.6s ease-in-out infinite; }
      @keyframes ${id}-bounce { 0%, 100% { transform: translateY(0); } 45% { transform: translateY(66px); } 55% { transform: translateY(54px); } }`;
    put('4-1/사회/3-1/한정', svg(id, body, css));
  })();

  // ── 희소성: 푸딩 3개, 먹고 싶은 사람 8명 — 3명만 받고 5명은 못 받는다 ──
  (function () {
    const id = 't41-s3-huiso';
    let css = base(id);
    const XS = [330, 400, 470, 540], R1 = 165, R2 = 275;
    let body = '';
    // 1칸: 쟁반 위 푸딩 셋
    body += at(1, 'pop', `<rect x="50" y="200" width="160" height="10" rx="5" fill="${C.muted}"/>`);
    [85, 130, 175].forEach((x, i) => {
      body += at(1, 'pop', mv([[0, 0], [0, 0], [XS[i] - x, -88]], place(x, 186, pudding()), `transition-delay:${f(0.3 + i * 0.3)}s`), 0.3 + i * 0.2);
    });
    body += at(1, 'pop', tag(130, 250, '푸딩 3개', HOT), 0.9);
    // 2칸: 원하는 사람 여덟
    const cols = [C.green, C.blue, C.purple, C.orange];
    let k = 0;
    [R1, R2].forEach((y) => XS.forEach((x, i) => {
      const lucky = y === R1 && i < 3;
      body += at(2, 'pop', `<g class="${lucky ? '' : 'miss'}"><g class="bob" style="animation-delay:${f(k * 0.13)}s">${person(x, y, cols[i])}<path d="M${x + 9} ${y - 17} L${x + 17} ${y - 40}" stroke="${cols[i]}" stroke-width="5" stroke-linecap="round"/></g></g>`, k * 0.08);
      k++;
    }));
    body += at(2, 'pop', tag(435, 322, '원하는 사람 8명', COLD), 0.9);
    // 4칸: 희소성
    body += glowRect(296, 58, 280, 236, 4, C.blue, 0.2, 16);
    body += at(4, 'pop', tag(130, 132, '8명 > 3개', PLAIN, { size: 20 }), 0.5);
    body += at(4, 'pop', tag(130, 300, '희소성', HOT, { size: 26 }), 0.9);
    css += `
      .sc-${id} .miss { transition: opacity .8s ease 1.4s; }
      .on3 .sc-${id} .miss { opacity: .35; }`;
    put('4-1/사회/3-1/희소성', svg(id, body, css));
  })();

  // ── 합리적 선택: 가방 셋을 기준 넷으로 점수 매겨 더하고, 가장 높은 것을 고른다(동아 113쪽) ──
  (function () {
    const id = 't41-s3-hamni';
    let css = base(id);
    const CX = [280, 405, 530], LX = 115, TOP = 122, RH = 42;
    const BAGS = [['o', COLD], ['t', HOT], ['s', OLD]];
    const ROWS = [['가격', [1, 2, 3]], ['디자인', [2, 3, 2]], ['무게', [1, 2, 3]], ['많이 들어감', [3, 3, 1]]];
    const TOTALS = [7, 10, 9];
    const BOT = TOP + RH * 4 + 46;
    let body = '';
    // 1칸: 가방 셋
    BAGS.forEach(([m, c], i) => { body += at(1, 'pop', place(CX[i], 92, bag(m, c)), i * 0.25); });
    // 2칸: 표와 기준
    let grid = `<rect x="30" y="${TOP}" width="563" height="${BOT - TOP}" rx="6" fill="white" stroke="${C.ink}" stroke-width="2.5"/>`;
    for (let r = 1; r <= 4; r++) grid += `<path d="M30 ${TOP + r * RH} H593" stroke="${r === 4 ? C.ink : C.line}" stroke-width="${r === 4 ? 2.5 : 2}"/>`;
    grid += [200, 343, 468].map((x) => `<path d="M${x} ${TOP} V${BOT}" stroke="${C.line}" stroke-width="2"/>`).join('');
    body += at(2, 'fin', grid);
    ROWS.forEach(([label], r) => { body += at(2, 'rise', text(LX, TOP + r * RH + 28, label, { size: 20, color: C.green }), 0.3 + r * 0.25); });
    body += at(2, 'rise', text(LX, BOT - 15, '총점', { size: 20 }), 1.3);
    // 3칸: 점수와 총점
    ROWS.forEach(([, sc], r) => sc.forEach((v, i) => { body += at(3, 'pop', text(CX[i], TOP + r * RH + 29, v, { size: 22, weight: 600 }), 0.15 + r * 0.25 + i * 0.06); }));
    TOTALS.forEach((v, i) => { body += at(3, 'pop', text(CX[i], BOT - 14, `${v}점`, { size: 24, color: BAGS[i][1][1] }), 1.4 + i * 0.15); });
    // 4칸: 10점짜리 가방을 고른다
    body += glowRect(346, 52, 119, BOT - 52 + 2, 4, C.orange, 0.2, 10);
    body += ring(CX[1], 92, 40, 4, C.orange, 0.6);
    body += at(4, 'pop', tag(LX, 88, '합리적 선택', HOT, { size: 20 }), 0.9);
    put('4-1/사회/3-1/합리적 선택', svg(id, body, css));
  })();

  // ── 이윤: 판 돈 1,500원 막대에서 든 돈 1,000원 막대를 빼면 500원이 남는다 ──
  (function () {
    const id = 't41-s3-iyun';
    let css = base(id);
    const X0 = 170, K = 0.28, Y1 = 100, Y2 = 210, BH = 50;
    const xa = (won) => X0 + won * K;
    let body = '';
    // 1칸: 쿠키와 판 돈 막대
    body += at(1, 'pop', place(70, 58, cookie()));
    body += at(1, 'fin', text(92, Y1 + 33, '판 돈', { size: 20 }));
    body += shown(1, `<g class="grow grow1" style="transition-delay:.3s"><rect x="${X0}" y="${Y1}" width="${f(1500 * K)}" height="${BH}" rx="4" fill="${C.yellow}" stroke="${C.orange}" stroke-width="2.5"/></g>`);
    body += at(1, 'pop', text(xa(1500), Y1 - 12, '1,500원', { size: 20, anchor: 'end', color: C.orange }), 1.2);
    // 2칸: 든 돈 막대
    body += at(2, 'fin', text(92, Y2 + 33, '든 돈', { size: 20 }));
    body += shown(3, `<rect x="${X0}" y="${Y2}" width="${f(1000 * K)}" height="${BH}" rx="4" fill="none" stroke="${C.line}" stroke-width="2.5" stroke-dasharray="8 6"/>`);
    body += shown(2, mv([[0, 0], [0, 0], [0, Y1 - Y2]], `<g class="grow grow2" style="transition-delay:.3s"><rect x="${X0}" y="${Y2}" width="${f(1000 * K)}" height="${BH}" rx="4" fill="${C.sky}" stroke="${C.blue}" stroke-width="2.5" fill-opacity=".92"/>${text(f(X0 + 500 * K), Y2 + 33, '1,000원', { size: 20, color: C.blue })}</g>`, 'transition-delay:.3s'));
    // 3칸: 빼고 남은 조각
    body += at(3, 'pop', `<rect x="${xa(1000)}" y="${Y1}" width="${f(500 * K)}" height="${BH}" rx="4" fill="${C.mint}" stroke="${C.green}" stroke-width="3"/>${text(f(xa(1250)), Y1 + 33, '500원', { size: 20, color: C.green })}`, 1.6);
    // 4칸: 남은 조각이 이윤
    body += glowRect(xa(1000) - 4, Y1 - 4, 500 * K + 8, BH + 8, 4, C.green, 0.2, 8);
    body += shown(4, `<path class="draw draw4" pathLength="1" d="M${f(xa(1250))} ${Y1 + BH + 6} V${Y2 + 50}" stroke="${C.green}" stroke-width="3.5" fill="none"/>`);
    body += at(4, 'pop', tag(f(xa(1250)), Y2 + 78, '이윤', OK, { size: 26 }), 0.9);
    put('4-1/사회/3-1/이윤', svg(id, body, css));
  })();

  // ── 소득: 농사지어 판 돈과 회사에서 일한 돈이 집으로 들어온다 ──
  (function () {
    const id = 't41-s3-sodeuk';
    let css = base(id);
    const HX = 505, HY = 252;
    let body = '';
    // 집(늘 보인다)
    body += `<path d="M${HX - 80} ${HY} V${HY - 70} L${HX} ${HY - 120} L${HX + 80} ${HY - 70} V${HY} Z" fill="white" stroke="${C.muted}" stroke-width="3" stroke-linejoin="round"/>`;
    body += tag(HX, HY + 30, '우리 집', PLAIN, { size: 18 });
    // 1칸: 농부가 배추를 기른다
    body += `<path d="M30 150 H250" stroke="${C.line}" stroke-width="3" stroke-linecap="round"/>`;
    body += at(1, 'pop', `<g class="bob">${person(66, 150, C.green, 1.25)}</g>`);
    [128, 172, 216].forEach((x, i) => { body += shown(1, `<g class="growy growy1" style="transition-delay:${f(0.3 + i * 0.25)}s">${place(x, 134, cabbage())}</g>`); });
    body += at(1, 'pop', tag(140, 180, '농사', OK, { size: 18 }), 1.1);
    // 2칸: 판 돈이 집으로
    body += shown(2, g('fin fin2', flow([[256, 112], [410, 176]], C.orange)));
    [0, 1, 2].forEach((i) => { body += at(2, 'pop', mv([[0, 0], [HX - 34 - 88 + i * 2, HY - 14 - i * 9 - 96]], coin(88, 96), `transition-delay:${f(0.5 + i * 0.3)}s`)); });
    // 3칸: 회사에서 일한 돈도 집으로
    body += `<path d="M30 300 H250" stroke="${C.line}" stroke-width="3" stroke-linecap="round"/>`;
    body += at(3, 'pop', building(110, 300, 80, 92) + person(196, 300, C.orange, 1.25));
    body += at(3, 'pop', tag(150, 330, '회사 일', COLD, { size: 18 }), 0.4);
    body += shown(3, g('fin fin3', flow([[232, 262], [412, 226]], C.orange), 0.3));
    [0, 1, 2].forEach((i) => { body += at(3, 'pop', mv([[0, 0], [0, 0], [HX + 30 - 210 + i * 2, HY - 14 - i * 9 - 250]], coin(210, 250), `transition-delay:${f(0.5 + i * 0.3)}s`)); });
    // 4칸: 들어온 돈이 소득
    body += ring(HX, HY - 34, 54, 4, C.orange, 0.2);
    body += at(4, 'pop', tag(HX, 92, '소득', HOT, { size: 26 }), 0.6);
    put('4-1/사회/3-1/소득', svg(id, body, css));
  })();

  // ════ 3-2 경제활동에서의 다양한 교류 ════

  // 두 마을(바닷가·산골) 바탕
  const seaVillage = (cx, cy, r = 80) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${C.sky}" stroke="${C.blue}" stroke-width="3"/>` + waves(cx - 52, cx + 48, cy + 44) + waves(cx - 40, cx + 36, cy + 60);
  const hillVillage = (cx, cy, r = 80) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${C.mint}" stroke="${C.green}" stroke-width="3"/>` + mountain(cx + 6, cy + 2, 104, 64);

  // ── 교류: 바닷가 마을과 산골 마을 사이로 조개·배추가 오가고 사람도 오간다 ──
  (function () {
    const id = 't41-s3-gyoryu';
    let css = base(id);
    const LX = 120, RX = 520, CY = 215;
    let body = '';
    // 1칸: 두 마을
    body += at(1, 'pop', seaVillage(LX, CY) + place(LX - 30, CY - 12, clam()) + place(LX + 12, CY - 26, clam()) + place(LX + 30, CY + 6, clam()));
    body += at(1, 'pop', hillVillage(RX, CY) + place(RX - 36, CY + 30, cabbage()) + place(RX + 4, CY + 40, cabbage()) + place(RX + 42, CY + 28, cabbage()), 0.3);
    body += at(1, 'pop', tag(LX, 322, '바닷가 마을', COLD, { size: 18 }), 0.5) + at(1, 'pop', tag(RX, 322, '산골 마을', OK, { size: 18 }), 0.7);
    // 2칸: 물건이 오간다
    body += shown(2, g('fin fin2', flow([[210, 170], [430, 170]], C.orange) + flow([[430, 278], [210, 278]], C.orange)));
    body += shown(2, trip(184, 0, place(228, 148, clam()), { dur: 2.8, delay: 0.4 }));
    body += shown(2, trip(-184, 0, place(412, 256, cabbage()), { dur: 2.8, delay: 1.2 }));
    // 3칸: 사람이 오간다
    body += shown(3, trip(176, 0, `<g>${person(232, 206, C.blue, 0.85)}</g>`, { dur: 3.2, delay: 0.3 }));
    body += shown(3, trip(-176, 0, `<g>${person(408, 232, C.purple, 0.85)}</g>`, { dur: 3.2, delay: 1.5 }));
    // 4칸: 교류 ⊃ 물적 교류·인적 교류
    body += shown(4, `<path class="draw draw4" pathLength="1" d="M320 54 V66 M190 80 V66 H450 V80" stroke="${C.purple}" stroke-width="3" fill="none" stroke-linejoin="round"/>`);
    body += at(4, 'pop', tag(320, 36, '교류', OLD, { size: 22 }), 0.1);
    body += at(4, 'pop', tag(190, 98, '물적 교류', HOT, { size: 20 }), 0.7);
    body += at(4, 'pop', tag(450, 98, '인적 교류', COLD, { size: 20 }), 0.9);
    body += glowRect(206, 132, 228, 162, 4, C.purple, 1.1, 14);
    put('4-1/사회/3-2/교류', svg(id, body, css));
  })();

  // ── 생산지: 가게의 상자마다 길러져 나온 곳(서귀포·영동·통영)까지 거슬러 간다(동아 119쪽) ──
  (function () {
    const id = 't41-s3-saengsanji';
    let css = base(id);
    const YS = [120, 190, 260];
    const ITEMS = [['감귤', tangerine(), '서귀포', `<circle r="30" fill="${C.mint}" stroke="${C.green}" stroke-width="3"/>` + tree(-11, -8, 11) + tree(11, -8, 11) + [[-14, -10], [-7, -4], [8, -11], [14, -4]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.2" fill="${C.orange}"/>`).join('')],
      ['포도', grapes(), '영동', `<circle r="30" fill="${C.lilac}" stroke="${C.purple}" stroke-width="3"/><path d="M-20 -12 H20" stroke="${C.green}" stroke-width="3"/>` + place(-9, 6, grapes(), 0.8) + place(11, 6, grapes(), 0.8)],
      ['굴', oyster(), '통영', `<circle r="30" fill="${C.sky}" stroke="${C.blue}" stroke-width="3"/>` + waves(-22, 18, -10) + place(0, 10, oyster(), 0.9)]];
    let body = '';
    // 1칸: 가게 진열대와 상자 셋
    let shop = `<rect x="440" y="70" width="172" height="240" rx="6" fill="white" stroke="${C.muted}" stroke-width="3"/>`;
    for (let i = 0; i < 6; i++) shop += `<path d="M${440 + i * 28.7} 52 h28.7 v18 q-14.3 10 -28.7 0 Z" fill="${i % 2 ? 'white' : C.peach}" stroke="${C.orange}" stroke-width="2"/>`;
    body += at(1, 'pop', shop);
    ITEMS.forEach(([name, icon], i) => {
      body += at(1, 'pop', `<rect x="456" y="${YS[i] - 26}" width="140" height="52" rx="5" fill="${C.peach}" stroke="${C.orange}" stroke-width="2.5"/>` + place(490, YS[i], icon) + text(550, YS[i] + 7, name, { size: 20 }), 0.3 + i * 0.2);
    });
    // 2·3칸: 길러진 곳에서 가게로
    ITEMS.forEach(([, , where, badge], i) => {
      const n = i === 0 ? 2 : 3, s = i === 0 ? 0 : (i - 1) * 0.6;
      body += at(n, 'pop', place(70, YS[i], badge), s);
      body += at(n, 'pop', tag(160, YS[i], where, OK, { size: 20 }), s + 0.3);
      body += shown(n, g(`fin fin${n}`, flow([[214, YS[i]], [446, YS[i]]], C.orange), s + 0.6));
    });
    // 4칸: 생산지
    body += glowRect(30, 80, 190, 220, 4, C.green, 0.2, 16);
    body += at(4, 'pop', tag(125, 46, '생산지', OK, { size: 24 }), 0.6);
    put('4-1/사회/3-2/생산지', svg(id, body, css));
  })();

  // ── 인적 교류: 도시 친구들이 버스로 시골 마을에 가서 어울리고, 일자리를 찾아 도시로 오는 사람도 있다 ──
  (function () {
    const id = 't41-s3-injeok';
    let css = base(id);
    const GY = 250;
    let body = '';
    body += `<path d="M20 ${GY} H620" stroke="${C.line}" stroke-width="4" stroke-linecap="round"/>`;
    // 도시와 시골 마을(늘 보인다)
    body += building(52, GY, 50, 120) + building(108, GY, 56, 160) + building(166, GY, 48, 96);
    body += house(530, GY, 0.9, OK) + house(590, GY, 0.75, OK);
    body += tag(110, 284, '도시', COLD, { size: 18 }) + tag(555, 284, '시골 마을', OK, { size: 18 });
    // 1칸: 버스가 시골로
    body += `<g class="b1 h2"><g class="busgo">${place(240, GY, bus())}</g></g>`;
    css += `
      .sc-${id} .busgo { transition: transform 1.8s ease-in-out .3s; }
      .on1 .sc-${id} .busgo { transform: translateX(170px); }`;
    // 2칸: 함께 어울린다
    [[360, C.blue], [394, C.blue], [436, C.green], [470, C.green]].forEach(([x, c], i) => {
      body += at(2, 'pop', `<g class="bob" style="animation-delay:${f(i * 0.18)}s">${person(x, GY, c, 1.1)}</g>`, i * 0.12);
    });
    // 3칸: 일자리를 찾아 도시로 가는 사람
    body += at(3, 'fin', mv([[0, 0], [0, 0], [-290, 0]], person(510, GY, C.purple, 1.25) + `<rect x="${510 + 10}" y="${GY - 26}" width="18" height="15" rx="2" fill="${C.peach}" stroke="${C.orange}" stroke-width="2"/>`, 'transition-delay:.4s;transition-duration:2.2s'));
    // 4칸: 사람이 오가는 화살표, 인적 교류
    body += shown(4, g('fin fin4', flow([[214, 54], [430, 54]], C.blue) + flow([[430, 96], [214, 96]], C.blue)));
    body += at(4, 'pop', person(322, 46, C.blue, 0.7) + person(322, 88, C.purple, 0.7), 0.4);
    body += at(4, 'pop', tag(320, 324, '인적 교류', COLD, { size: 24 }), 0.8);
    put('4-1/사회/3-2/인적 교류', svg(id, body, css));
  })();

  // ── 물적 교류: 바닷가의 멸치가 트럭으로 산골에, 산골의 사과가 트럭으로 바닷가에 간다 ──
  (function () {
    const id = 't41-s3-muljeok';
    let css = base(id);
    const LX = 110, RX = 530, CY = 200, LA = 250, LB = 150;
    const anch = place(-8, -2, fish(0.7)) + place(8, 6, fish(0.6));
    let body = '';
    // 두 마을(늘 보인다)
    body += seaVillage(LX, CY) + house(LX + 40, CY - 8, 0.6) + house(LX - 40, CY - 34, 0.5);
    body += `<circle cx="${RX}" cy="${CY}" r="80" fill="${C.mint}" stroke="${C.green}" stroke-width="3"/>` + mountain(RX + 28, CY + 14, 70, 58) + tree(RX - 32, CY - 14, 19) + place(RX - 40, CY - 16, apple(), 0.5) + place(RX - 24, CY - 8, apple(), 0.5);
    body += `<path d="M174 ${LA} H466 M174 ${LB} H466" stroke="${C.line}" stroke-width="4" stroke-linecap="round"/>`;
    body += tag(LX, 318, '바닷가 마을', COLD, { size: 18 }) + tag(RX, 318, '산골 마을', OK, { size: 18 });
    // 1칸: 멸치 상자를 트럭에 싣는다(상자가 마을에서 트럭 짐칸으로)
    const TA = 232, TB = 408;
    body += `<g class="b1"><g class="truckA">${place(TA, LA, truck())}<g class="loadA">${place(TA - 15, LA - 22, crate(anch))}</g></g></g>`;
    // 2칸: 산골 마을로 실어 나르고 내려놓는다
    body += at(2, 'pop', place(RX + 12, CY + 46, crate(anch)), 2.4);
    // 3칸: 사과 상자를 실어 바닷가 마을로
    body += `<g class="b3"><g class="truckB">${place(TB, LB, `<g transform="scale(-1 1)">${truck()}</g>`)}<g class="loadB">${place(TB + 15, LB - 22, crate(apple()))}</g></g></g>`;
    body += at(3, 'pop', place(LX + 22, CY + 18, crate(apple())), 3);
    // 4칸: 두 길이 물건이 오가는 화살표가 된다
    body += shown(4, g('fin fin4', flow([[180, LA], [460, LA]], C.orange) + flow([[460, LB], [180, LB]], C.orange)));
    body += shown(4, trip(236, 0, place(204, LA - 24, crate(anch)), { dur: 2.8, delay: 0.3 }));
    body += shown(4, trip(-236, 0, place(436, LB - 24, crate(apple())), { dur: 2.8, delay: 1.2 }));
    body += at(4, 'pop', tag(320, 60, '물적 교류', HOT, { size: 24 }), 0.6);
    css += `
      .sc-${id} .loadA { transform: translate(${LX - 14 - (TA - 15)}px, ${CY - 22 - (LA - 22)}px); transition: transform .9s ease-in-out .5s; }
      .on1 .sc-${id} .loadA { transform: none; }
      .sc-${id} .loadB { transform: translate(${RX - 30 - (TB + 15)}px, ${CY + 34 - (LB - 22)}px); transition: transform .8s ease-in-out .2s; }
      .on3 .sc-${id} .loadB { transform: none; }
      .sc-${id} .truckA { transition: transform 1.6s ease-in-out .3s, opacity .5s ease 1.9s; }
      .on2 .sc-${id} .truckA { transform: translateX(180px); opacity: 0; }
      .sc-${id} .truckB { transition: transform 1.6s ease-in-out 1.1s, opacity .5s ease 2.7s; }
      .on3 .sc-${id} .truckB { transform: translateX(-180px); opacity: 0; }`;
    put('4-1/사회/3-2/물적 교류', svg(id, body, css));
  })();

  // ── 상호 의존: 어촌은 쌀이, 농촌은 생선이 모자라 서로 주고받는 고리 ──
  (function () {
    const id = 't41-s3-sangho';
    let css = base(id);
    const LX = 140, RX = 500, CY = 200, R = 92;
    let body = '';
    const slot = (x, y, icon) => `<rect x="${x - 26}" y="${y - 24}" width="52" height="48" rx="8" fill="white" stroke="${C.red}" stroke-width="3" stroke-dasharray="6 5"/><g opacity=".25">${place(x, y, icon)}</g>`;
    const filled = (x, y, icon) => `<rect x="${x - 26}" y="${y - 24}" width="52" height="48" rx="8" fill="white" stroke="${C.green}" stroke-width="3"/>${place(x, y, icon)}`;
    // 1칸: 어촌 — 생선 많고 쌀 모자람
    body += at(1, 'pop', `<circle cx="${LX}" cy="${CY}" r="${R}" fill="${C.sky}" stroke="${C.blue}" stroke-width="3"/>` + place(LX - 42, CY - 34, fish()) + place(LX + 2, CY - 50, fish()) + place(LX + 42, CY - 30, fish()) + slot(LX, CY + 34, rice()));
    body += at(1, 'pop', tag(LX, 318, '어촌', COLD), 0.4);
    // 2칸: 농촌 — 쌀 많고 생선 모자람
    body += at(2, 'pop', `<circle cx="${RX}" cy="${CY}" r="${R}" fill="${C.mint}" stroke="${C.green}" stroke-width="3"/>` + place(RX - 44, CY - 34, rice()) + place(RX, CY - 48, rice()) + place(RX + 44, CY - 34, rice()) + slot(RX, CY + 34, fish()));
    body += at(2, 'pop', tag(RX, 318, '농촌', OK), 0.4);
    // 3칸: 서로 모자란 것을 주고받는다
    body += shown(3, g('fin fin3', flowQ([206, 128], [320, 40], [434, 128], C.blue) + flowQ([434, 272], [320, 360], [206, 272], C.green)));
    body += shown(3, arcTrip(114, -44, 228, 0, place(206, 104, fish()), { dur: 2.6, delay: 0.2 }));
    body += shown(3, arcTrip(-114, 44, -228, 0, place(434, 296, rice(), 0.85), { dur: 2.6, delay: 1.1 }));
    body += at(3, 'pop', filled(LX, CY + 34, rice()), 2.4) + at(3, 'pop', filled(RX, CY + 34, fish()), 1.7);
    // 4칸: 상호 의존
    body += at(4, 'pop', tag(320, 200, '상호 의존', OLD, { size: 24 }), 0.4);
    body += ring(LX, CY, R, 4, C.blue, 0.8) + ring(RX, CY, R, 4, C.green, 0.8);
    put('4-1/사회/3-2/상호 의존', svg(id, body, css));
  })();

  // ── 상생: 농부의 채소가 학교 급식으로, 급식비가 농부에게 — 두 쪽 이득 막대가 함께 자란다 ──
  (function () {
    const id = 't41-s3-sangsaeng';
    let css = base(id);
    const GY = 196, BB = 330, BMAX = 104;
    let body = '';
    body += `<path d="M24 ${GY} H616" stroke="${C.line}" stroke-width="3" stroke-linecap="round"/>`;
    // 농부와 밭, 학교(늘 보인다)
    body += person(64, GY, C.green) + place(116, GY - 14, cabbage()) + place(156, GY - 14, cabbage());
    body += school(525, GY);
    body += tag(70, 120, '농부', OK, { size: 18 }) + tag(525, 30, '학교', HOT, { size: 18 });
    // 이득 막대 자리
    const bar = (x, cls, [fill, stroke]) => `<rect x="${x - 24}" y="${BB - BMAX}" width="48" height="${BMAX}" rx="4" fill="none" stroke="${C.line}" stroke-width="2" stroke-dasharray="6 5"/><g class="${cls}"><rect x="${x - 24}" y="${BB - BMAX}" width="48" height="${BMAX}" rx="4" fill="${fill}" stroke="${stroke}" stroke-width="2.5"/></g><path d="M${x - 40} ${BB} H${x + 40}" stroke="${C.ink}" stroke-width="3"/>`;
    body += bar(90, 'barL', OK) + bar(525, 'barR', HOT);
    body += text(130, BB - 8, '농부 이득', { size: 18, anchor: 'start', color: C.green });
    body += text(485, BB - 8, '학생 이득', { size: 18, anchor: 'end', color: C.orange });
    // 1칸: 채소가 학교 급식실로
    body += shown(1, g('fin fin1', flow([[200, 104], [430, 104]], C.green)));
    body += shown(1, trip(206, 0, place(212, 82, cabbage()), { dur: 2.6, delay: 0.5 }));
    // 2칸: 학생들이 급식을 먹는다, 학생 이득이 자란다
    body += at(2, 'pop', `<g class="bob">${person(472, GY, C.blue, 0.8)}</g>` + `<g class="bob" style="animation-delay:.3s">${person(578, GY, C.purple, 0.8)}</g>`);
    // 3칸: 채소 값이 농부에게, 농부 이득이 자란다
    body += shown(3, g('fin fin3', flow([[430, 150], [200, 150]], C.orange)));
    body += shown(3, trip(-206, 0, coin(418, 136), { dur: 2.6, delay: 0.4 }));
    // 4칸: 둘 다 자라 상생
    body += glowRect(60, BB - BMAX - 6, 60, BMAX + 12, 4, C.green, 1.2, 8) + glowRect(495, BB - BMAX - 6, 60, BMAX + 12, 4, C.orange, 1.2, 8);
    body += shown(4, `<path class="draw draw4" pathLength="1" d="M190 270 H260 M380 270 H450" stroke="${C.purple}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`);
    body += at(4, 'pop', tag(320, 270, '상생', OLD, { size: 26 }), 0.6);
    css += `
      .sc-${id} .barL, .sc-${id} .barR { transform-box: fill-box; transform-origin: 50% 100%; transform: scaleY(0); transition: transform 1.2s ease-out .5s; }
      .on2 .sc-${id} .barR { transform: scaleY(.55); }
      .on3 .sc-${id} .barL { transform: scaleY(.55); }
      .on4 .sc-${id} .barL, .on4 .sc-${id} .barR { transform: scaleY(1); }`;
    put('4-1/사회/3-2/상생', svg(id, body, css));
  })();
})(typeof window !== 'undefined' ? window : globalThis);
