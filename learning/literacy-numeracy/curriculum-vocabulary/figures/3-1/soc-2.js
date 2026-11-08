// 사회 3-1 낱말 도식(둘째 묶음): 2-1 과거·현재·미래·시대·연표·사건·역사, 2-2 흔적·복원·타임캡슐·자료, 2-3 유래.
// - 사건: 미래엔 74~75쪽 체육 대회·현장 학습·학예회. 역사: 미래엔 73쪽 훈민정음 창제(1443), 78~81쪽 할머니가 겪은 서울 올림픽(1988)·월드컵(2002),
//   '나와 우리 가족이 겪은 일도 중요한 역사의 일부분'. 자료: 미래엔 101쪽·아이스크림(사진·일기·책·물건)과 2-2 증언.
// - 시간 표현: 동아 71쪽 '과거 지나간 시간(어릴 적·오래전·옛날·작년), 현재(지금·오늘), 미래 앞으로 다가올 시간(20년 뒤·앞으로·훗날)',
//   '오늘 아침도 지금을 기준으로 보면 과거야'. 아이스크림 73쪽 '어제·옛날·오래전 / 오늘·오늘날 / 내일·나중·훗날'.
// - 시대: 미래엔 72쪽 '돌로 / 청동으로 / 철로 도구를 만들었던 시대'(주먹 도끼·청동 거울·철로 만든 투구). 띠 길이는 차례만 보이는 어림이다.
// - 연표: 동아 72~73쪽 연표 만드는 과정(오래된 순서대로 배열 → 처음과 마지막을 양 끝에 → 나머지 표시). 가족 일은 예시다.
// - 복원: 미래엔 104쪽 수원 화성(6·25 전쟁으로 훼손 → 『화성성역의궤』 기록으로 복원). 성문은 단순한 모형이다.
// - 타임캡슐: 동아 91쪽 '20년 만에 열린 초등학교의 타임캡슐'(편지 등을 넣고 20년 뒤에 엶). 2026년은 지금 해.
// - 유래: 동아 115쪽·아이스크림 122쪽 병점(서울에서 충청도·경상도·전라도로 통하는 길목, 떡을 파는 가게 → 떡전 거리 → 떡 '병' + 가게 '점').
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
  // 흐르는 화살표: 점선이 끝 쪽으로 흐른다
  const flow = (pts, color, { w = 5, dash = '14 10' } = {}) => {
    const [a, b] = pts.slice(-2), ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
    const end = [b[0] - w * Math.cos(ang), b[1] - w * Math.sin(ang)];
    const d = 'M' + [...pts.slice(0, -1), end].map((p) => `${f(p[0])} ${f(p[1])}`).join(' L');
    return `<g><path class="mar" d="${d}" stroke="${color}" stroke-width="${w}" stroke-dasharray="${dash}" stroke-linecap="round" stroke-linejoin="round" fill="none"/>${head(b[0], b[1], ang, color, w)}</g>`;
  };
  const glowRect = (x, y, w, h, n, color = C.green, delay = 0, rx = 12) =>
    `<g class="b${n}"><rect class="flash flash${n}"${dl(delay)} x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="${rx}" fill="none" stroke="${color}" stroke-width="5"/></g>`;
  const ring = (cx, cy, r, n, color = C.green, s = 0) => `<g class="b${n}"><circle class="ring ring${n}"${dl(s)} cx="${f(cx)}" cy="${f(cy)}" r="${r}" fill="none" stroke="${color}" stroke-width="4"/></g>`;
  // 사람 아이콘: (x, y) 는 발밑 가운데
  const person = (x, y, color = C.green, s = 1) => `<circle cx="${f(x)}" cy="${f(y - 27 * s)}" r="${f(7.5 * s)}" fill="${color}"/><path d="M${f(x - 11 * s)} ${f(y)} V${f(y - 9 * s)} Q${f(x - 11 * s)} ${f(y - 18 * s)} ${f(x)} ${f(y - 18 * s)} Q${f(x + 11 * s)} ${f(y - 18 * s)} ${f(x + 11 * s)} ${f(y - 9 * s)} V${f(y)} Z" fill="${color}"/>`;
  // 칸마다 자리를 옮기는 것: pts = [[x, y, 돌림각], …] (1칸, 2칸 …), 빈 칸은 앞 칸 자리를 쓴다
  const mvStyle = (pts, extra = '') => {
    const out = [];
    for (let n = 1; n <= 5; n++) { const p = pts[Math.min(n, pts.length) - 1]; out.push(`--x${n}:${f(p[0])}px;--y${n}:${f(p[1])}px;--r${n}:${f(p[2] || 0)}deg`); }
    return out.join(';') + (extra ? ';' + extra : '');
  };
  const mv = (pts, inner, extra = '') => `<g class="mv" style="${mvStyle(pts, extra)}">${inner}</g>`;
  const KEY = (u, w) => `3-1/사회/${u}/${w}`;

  // 장면마다 같이 쓰는 움직임
  const base = (id) => {
    let s = `
    .sc-${id} .pop, .sc-${id} .pulse, .sc-${id} .ring { transform-box: fill-box; transform-origin: center; }
    .sc-${id} .twk { animation: ${id}-twk 1.6s ease-in-out infinite alternate; }
    .sc-${id} .mar { animation: ${id}-mar .7s linear infinite; }
    .sc-${id} .draw { stroke-dasharray: 1 1; stroke-dashoffset: 1; transition: stroke-dashoffset 1.4s ease-in-out .2s; }
    .sc-${id} .grow { transform-box: fill-box; transform-origin: 0 50%; transform: scaleX(0); transition: transform 1.2s ease-in-out .2s; }
    .sc-${id} .growl { transform-box: fill-box; transform-origin: 100% 50%; transform: scaleX(0); transition: transform 1.2s ease-in-out .2s; }
    .sc-${id} .growy { transform-box: fill-box; transform-origin: 50% 100%; transform: scaleY(0); transition: transform 1.2s ease-out .2s; }
    .sc-${id} .mv { transform-box: fill-box; transform-origin: center; transform: translate(var(--x1), var(--y1)) rotate(var(--r1)); transition: transform 1.4s ease-in-out .3s; }
    .sc-${id} .bob { animation: ${id}-bob 1.4s ease-in-out infinite; }
    .sc-${id} .ring { opacity: 0; }
    @keyframes ${id}-pop { 0% { opacity: 0; transform: scale(.3); } 70% { opacity: 1; transform: scale(1.12); } 100% { opacity: 1; transform: scale(1); } }
    @keyframes ${id}-fin { from { opacity: 0; } to { opacity: 1; } }
    @keyframes ${id}-rise { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
    @keyframes ${id}-drop { from { opacity: 0; transform: translateY(-40px); } to { opacity: 1; transform: none; } }
    @keyframes ${id}-pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.12); } }
    @keyframes ${id}-flash { 0% { opacity: 0; } 20% { opacity: 1; } 40% { opacity: .25; } 60% { opacity: 1; } 80% { opacity: .25; } 100% { opacity: 1; } }
    @keyframes ${id}-ring { 0% { opacity: .9; transform: scale(1); } 100% { opacity: 0; transform: scale(1.7); } }
    @keyframes ${id}-twk { from { opacity: .35; } to { opacity: 1; } }
    @keyframes ${id}-mar { from { stroke-dashoffset: 24; } to { stroke-dashoffset: 0; } }
    @keyframes ${id}-bob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
    `;
    for (let n = 1; n <= 5; n++) s += `
    .on${n} .sc-${id} .pop${n} { animation: ${id}-pop .5s ease-out both; }
    .on${n} .sc-${id} .fin${n} { animation: ${id}-fin .5s ease-out both; }
    .on${n} .sc-${id} .rise${n} { animation: ${id}-rise .45s ease-out both; }
    .on${n} .sc-${id} .drop${n} { animation: ${id}-drop .6s ease-out both; }
    .on${n} .sc-${id} .pulse${n} { animation: ${id}-pulse .7s ease-in-out .3s 2; }
    .on${n} .sc-${id} .flash${n} { animation: ${id}-flash 1.4s ease-in-out both; }
    .on${n} .sc-${id} .ring${n} { animation: ${id}-ring 1.1s ease-out .3s 2; }
    .on${n} .sc-${id} .draw${n} { stroke-dashoffset: 0; }
    .on${n} .sc-${id} .grow${n}, .on${n} .sc-${id} .growl${n} { transform: scaleX(1); }
    .on${n} .sc-${id} .growy${n} { transform: scaleY(1); }`;
    for (let n = 2; n <= 5; n++) s += `
    .on${n} .sc-${id} .mv { transform: translate(var(--x${n}), var(--y${n})) rotate(var(--r${n})); }`;
    return s;
  };

  // ════ 시간 줄(과거·현재·미래가 같이 쓴다) ════
  const LY = 214, LX0 = 36, LX1 = 606;
  const timeLine = () => `<path d="M${LX0} ${LY} H${LX1 - 6}" stroke="${C.ink}" stroke-width="4" stroke-linecap="round"/>${head(LX1, LY, 0, C.ink, 4)}`
    + `<path class="mar" d="M${LX0 + 8} ${LY} H${LX1 - 20}" stroke="white" stroke-width="2" stroke-dasharray="6 18" fill="none"/>`
    + text(LX1 - 14, LY + 40, '시간', { size: 18, color: C.muted, anchor: 'end' });
  // 띠(줄 둘레의 칠): x0~x1
  const band = (x0, x1, fill) => `<rect x="${f(x0)}" y="${LY - 18}" width="${f(x1 - x0)}" height="36" fill="${fill}"/>`;
  // 지금 표시: 빨간 세로선과 점, 아래 '지금'
  const nowMark = (x) => `<path d="M${x} ${LY - 30} V${LY + 26}" stroke="${C.red}" stroke-width="4" stroke-linecap="round"/><circle cx="${x}" cy="${LY}" r="8" fill="${C.red}"/>` + tag(x, LY + 52, '지금', ['white', C.red], { size: 20 });
  const CHY = 160; // 낱말 쪽지 높이
  const moveCss = (id, cls, n, dx, sec = 1.8, delay = 0.3) => `
    .sc-${id} .${cls} { transition: transform ${sec}s ease-in-out ${delay}s; }
    .on${n} .sc-${id} .${cls} { transform: translateX(${dx}px); }`;

  // ── 과거 ──
  (function () {
    const id = 't31-so-gwageo';
    const NX = 320, DX = 96;
    let css = base(id) + moveCss(id, 'nowmv', 3, DX);
    let body = '';
    body += shown(2, `<g class="growl growl2">${band(LX0, NX, C.lilac)}</g>`);
    body += shown(3, `<g class="grow grow3" style="transition-duration:1.8s;transition-delay:.3s">${band(NX, NX + DX, C.lilac)}</g>`);
    body += at(1, 'fin', timeLine());
    // 1칸: 지금과, 지금 하고 있는 일
    body += at(1, 'pop', tag(NX, CHY, '아침 먹기', OK, { size: 20 }), 0.5);
    body += `<g class="b1"><g class="nowmv">${g('pop pop1', nowMark(NX), 0.2)}</g></g>`;
    // 2칸: 지나간 때의 말들
    [['어제', 214], ['작년', 136], ['옛날', 62]].forEach(([w, x], i) => { body += at(2, 'drop', tag(x, CHY, w, OLD, { size: 20 }), 0.5 + i * 0.35); });
    // 3칸: 지금이 앞으로 가면 아침 먹기도 지나간 때
    body += `<g class="b3">${g('flash flash3', `<rect x="${NX - 66}" y="${CHY - 23}" width="132" height="46" rx="23" fill="none" stroke="${C.purple}" stroke-width="4"/>`, 1.9)}</g>`;
    // 4칸
    body += glowRect(LX0, LY - 20, NX + DX - LX0, 40, 4, C.purple, 0.2, 6);
    body += at(4, 'pop', tag(200, 72, '과거', OLD, { size: 28 }), 0.7);
    put(KEY('2-1', '과거'), svg(id, body, css));
  })();

  // ── 현재 ──
  (function () {
    const id = 't31-so-hyeonjae';
    const NX = 250, DX = 190;
    let css = base(id) + moveCss(id, 'nowmv', 3, DX, 3, 0.3);
    let body = '';
    body += shown(3, `<g class="grow grow3" style="transition-duration:3s;transition-delay:.3s;transition-timing-function:ease-in-out">${band(NX, NX + DX, C.lilac)}</g>`);
    body += at(1, 'fin', timeLine());
    // 1칸: 시간 줄 위를 흘러가는 점
    body += `<g class="b1 h2"><g class="slide"><circle cx="${LX0 + 20}" cy="${LY}" r="9" fill="${C.orange}"/></g></g>`;
    // 2칸: 지금 표시와 지금을 나타내는 말
    const now = nowMark(NX) + `<g class="b2">${g('pop pop2', tag(NX, CHY, '오늘', HOT, { size: 20 }), 0.7)}${g('pop pop2', tag(NX, CHY - 46, '오늘날', HOT, { size: 20 }), 1)}</g>`;
    body += `<g class="b2"><g class="nowmv">${g('drop drop2', now, 0.1)}</g></g>`;
    body += ring(NX, LY, 16, 2, C.red, 0.4);
    // 4칸
    body += `<g class="b4"><g style="transform:translateX(${DX}px)">${g('flash flash4', `<rect x="${NX - 48}" y="${CHY - 72}" width="96" height="${LY + 74 - CHY + 72}" rx="14" fill="none" stroke="${C.red}" stroke-width="4"/>`, 0.2)}</g></g>`;
    body += at(4, 'pop', tag(NX + DX + 120, 80, '현재', HOT, { size: 28 }), 0.7);
    css += `
      .sc-${id} .slide { animation: ${id}-slide 2.4s linear infinite; }
      @keyframes ${id}-slide { 0% { opacity: 0; transform: translateX(0); } 10%, 85% { opacity: 1; } 100% { opacity: 0; transform: translateX(${LX1 - LX0 - 60}px); } }`;
    put(KEY('2-1', '현재'), svg(id, body, css));
  })();

  // ── 미래 ──
  (function () {
    const id = 't31-so-mirae';
    const NX = 190, DX = 100;
    let css = base(id) + moveCss(id, 'nowmv', 3, DX);
    let body = '';
    body += shown(2, `<g class="grow grow2">${band(NX, LX1 - 14, C.peach)}</g>`);
    body += shown(3, `<g class="grow grow3" style="transition-duration:1.8s;transition-delay:.3s">${band(NX, NX + DX, C.paper)}</g>`);
    body += at(1, 'fin', timeLine());
    body += `<g class="b1"><g class="nowmv">${g('pop pop1', nowMark(NX), 0.2)}</g></g>`;
    // 2칸: 아직 오지 않은 때의 말들
    [['내일', NX + DX], ['내년', 410], ['20년 뒤', 530]].forEach(([w, x], i) => { body += at(2, 'rise', tag(x, CHY, w, HOT, { size: 20 }), 0.5 + i * 0.35); });
    // 3칸: 내일이 오면 그날이 지금
    body += `<g class="b3">${g('fin fin3', tag(NX + DX, CHY, '내일', ['white', C.red], { size: 20 }), 2)}</g>` + ring(NX + DX, CHY, 30, 3, C.red, 2);
    // 4칸
    body += glowRect(NX + DX, LY - 20, LX1 - 14 - NX - DX, 40, 4, C.orange, 0.2, 6);
    body += at(4, 'pop', tag(470, 76, '미래', HOT, { size: 28 }), 0.7);
    put(KEY('2-1', '미래'), svg(id, body, css));
  })();

  // ════ 시대: 돌·청동·철로 도구를 만든 긴 기간을 하나씩 묶는다 ════
  const axe = (x, y) => `<path d="M${x - 2} ${y - 32} L${x + 12} ${y - 18} L${x + 18} ${y + 2} L${x + 13} ${y + 22} L${x + 1} ${y + 30} L${x - 12} ${y + 23} L${x - 18} ${y + 4} L${x - 13} ${y - 17} Z" fill="${C.line}" stroke="${C.muted}" stroke-width="3" stroke-linejoin="round"/><path d="M${x - 2} ${y - 30} L${x + 10} ${y - 17} L${x + 2} ${y - 8} Z M${x - 16} ${y + 4} L${x - 6} ${y + 2} L${x - 10} ${y + 21} Z M${x + 16} ${y + 3} L${x + 12} ${y + 20} L${x + 5} ${y + 10} Z" fill="white" opacity=".55"/>`;
  const mirror = (x, y) => `<circle cx="${x}" cy="${y}" r="25" fill="${C.peach}" stroke="${C.orange}" stroke-width="3.5"/><circle cx="${x}" cy="${y}" r="16" fill="none" stroke="${C.orange}" stroke-width="2.5"/><circle cx="${x}" cy="${y}" r="5" fill="${C.orange}"/>`;
  const helmet = (x, y) => `<path d="M${x - 20} ${y + 14} C${x - 22} ${y - 12} ${x - 10} ${y - 26} ${x} ${y - 26} C${x + 10} ${y - 26} ${x + 22} ${y - 12} ${x + 20} ${y + 14} Z" fill="${C.muted}" stroke="${C.ink}" stroke-width="3" stroke-linejoin="round"/><path d="M${x - 24} ${y + 14} H${x + 24}" stroke="${C.ink}" stroke-width="5" stroke-linecap="round"/><path d="M${x} ${y - 26} V${y + 12}" stroke="${C.ink}" stroke-width="2.5"/>`;
  (function () {
    const id = 't31-so-sidae';
    let css = base(id);
    const Y = 270, IY = 150;
    const GROUPS = [
      { x0: 40, x1: 318, items: [90, 170, 250].map((x) => axe(x, IY)), label: '돌', col: PLAIN, band: C.line, n: 2 },
      { x0: 330, x1: 462, items: [366, 428].map((x) => mirror(x, IY)), label: '청동', col: HOT, n: 3 },
      { x0: 474, x1: 600, items: [506, 568].map((x) => helmet(x, IY + 4)), label: '철', col: COLD, n: 3 }
    ];
    let body = '';
    // 시간 줄
    body += `<path d="M30 ${Y} H604" stroke="${C.ink}" stroke-width="4" stroke-linecap="round"/>` + head(612, Y, 0, C.ink, 4);
    body += text(612, Y + 82, '시간', { size: 18, color: C.muted, anchor: 'end' });
    // 1칸: 만든 차례대로 도구가 나타난다
    let k = 0;
    GROUPS.forEach((gr) => gr.items.forEach((it) => { body += at(1, 'pop', it, 0.2 + k * 0.28); k++; }));
    body += shown(1, g('fin fin1', flow([[40, 222], [596, 222]], C.orange, { w: 4 }), 2.2), 2);
    // 2·3칸: 같은 재료로 만든 긴 기간을 묶는 띠
    GROUPS.forEach((gr, i) => {
      const [fill0, stroke] = gr.col, fill = gr.band || fill0;
      const d = gr.n === 3 ? (i - 1) * 0.7 : 0;
      body += shown(gr.n, `<g class="grow grow${gr.n}" style="transition-delay:${f(0.2 + d)}s"><rect x="${gr.x0}" y="${Y - 18}" width="${gr.x1 - gr.x0}" height="36" rx="10" fill="${fill}" stroke="${stroke}" stroke-width="3"/></g>`);
      body += shown(gr.n, `<g class="grow grow${gr.n}" style="transition-delay:${f(0.2 + d)}s"><path d="M${gr.x0 + 4} ${IY - 46} V${IY - 56} H${gr.x1 - 4} V${IY - 46}" stroke="${stroke}" stroke-width="3.5" fill="none" stroke-linejoin="round"/></g>`);
      body += at(gr.n, 'pop', tag((gr.x0 + gr.x1) / 2, Y + 44, gr.label, gr.col, { size: 20 }), 1.1 + d);
    });
    // 4칸: 묶음 하나하나가 시대
    GROUPS.forEach((gr, i) => { body += glowRect(gr.x0 - 3, Y - 21, gr.x1 - gr.x0 + 6, 42, 4, gr.col[1], 0.2 + i * 0.25, 12); });
    body += at(4, 'pop', tag(320, 44, '시대', OLD, { size: 28 }), 1);
    put(KEY('2-1', '시대'), svg(id, body, css));
  })();

  // ════ 연표: 뒤섞인 일을 해의 차례대로 띠 위에 놓는다 ════
  (function () {
    const id = 't31-so-yeonpyo';
    let css = base(id);
    const SY = 290, YX = (yr) => 70 + (yr - 2017) * 55;
    // [해, 일, 마지막 자리 x, 섞인 자리 dx, dy, 돌림, 칸(놓이는 칸)]
    const EV = [[2017, '태어남', 96, 290, -4, -8, 2], [2020, '동생', 236, 260, -112, 7, 3], [2024, '입학', 396, -270, -96, -6, 3], [2026, '3학년', 548, -300, 16, 9, 2]];
    const CY = 190, CW = 104, CH = 70;
    let body = '';
    // 2칸: 띠와 해 눈금
    let strip = `<rect x="44" y="${SY - 14}" width="560" height="28" rx="14" fill="${C.mint}" stroke="${C.green}" stroke-width="3"/>`;
    for (let yr = 2017; yr <= 2026; yr++) strip += `<path d="M${YX(yr)} ${SY - 14} V${SY + 14}" stroke="${C.green}" stroke-width="2"/>`;
    body += at(2, 'fin', strip);
    EV.forEach(([yr, , , , , , n]) => {
      body += at(n, 'pop', `<circle cx="${YX(yr)}" cy="${SY}" r="8" fill="${C.orange}" stroke="white" stroke-width="2"/>` + text(YX(yr), SY + 44, yr, { size: 18, weight: 600 }), 1.4);
    });
    // 카드: 1칸에는 뒤섞여 있다가, 놓이는 칸에 제자리로
    EV.forEach(([yr, w, x, dx, dy, r, n]) => {
      const card = `<rect x="${x - CW / 2}" y="${CY - CH / 2}" width="${CW}" height="${CH}" rx="10" fill="white" stroke="${n === 2 ? C.orange : C.blue}" stroke-width="3"/>`
        + text(x, CY - 6, yr, { size: 20, color: n === 2 ? C.orange : C.blue }) + text(x, CY + 24, w, { size: 20 });
      const pts = n === 2 ? [[dx, dy, r], [0, 0, 0]] : [[dx, dy, r], [dx, dy, r], [0, 0, 0]];
      body += at(1, 'pop', mv(pts, card), 0.2 + (yr % 7) * 0.12);
      // 카드와 해 눈금을 잇는 선
      body += shown(n, `<path class="draw draw${n}" pathLength="1" style="transition-delay:1.5s" d="M${x} ${CY + CH / 2} L${YX(yr)} ${SY - 16}" stroke="${C.muted}" stroke-width="2.5" fill="none"/>`);
    });
    // 4칸
    body += shown(4, g('fin fin4', flow([[60, SY], [588, SY]], C.green, { w: 4 }), 0.2));
    body += at(4, 'pop', tag(320, 48, '연표', OK, { size: 28 }), 0.8);
    put(KEY('2-1', '연표'), svg(id, body, css));
  })();

  // ════ 흔적: 기둥에 그은 키 금이 아이가 떠난 뒤에도 남는다 ════
  (function () {
    const id = 't31-so-heunjeok';
    let css = base(id);
    const FY = 312, PX = 236, KX = 282, HT = 150;
    const SC = [1, 1.18, 1.36], TOPS = SC.map((k) => f(FY - HT * k));
    // 아이 온몸: (x, y) 발밑 가운데, h 키
    const kidFig = (x, y, h, col) => {
      const r = h * 0.11, t0 = y - h + 2 * r + 3, t1 = y - h * 0.42, w = h * 0.3;
      return `<circle cx="${f(x)}" cy="${f(y - h + r)}" r="${f(r)}" fill="${col}"/>`
        + `<path d="M${f(x - w / 2 + 3)} ${f(t0 + 6)} L${f(x - w * 0.78)} ${f(t1 - 4)} M${f(x + w / 2 - 3)} ${f(t0 + 6)} L${f(x + w * 0.78)} ${f(t1 - 4)}" stroke="${col}" stroke-width="${f(w * 0.24)}" stroke-linecap="round"/>`
        + `<rect x="${f(x - w / 2)}" y="${f(t0)}" width="${f(w)}" height="${f(t1 - t0 + 6)}" rx="${f(w * 0.3)}" fill="${col}"/>`
        + `<rect x="${f(x - w * 0.44)}" y="${f(t1)}" width="${f(w * 0.36)}" height="${f(y - t1)}" rx="${f(w * 0.16)}" fill="${col}"/><rect x="${f(x + w * 0.08)}" y="${f(t1)}" width="${f(w * 0.36)}" height="${f(y - t1)}" rx="${f(w * 0.16)}" fill="${col}"/>`;
    };
    const LABEL = ['1학년', '2학년', '3학년'];
    let body = '';
    // 바닥과 기둥
    body += `<path d="M20 ${FY} H620" stroke="${C.line}" stroke-width="4" stroke-linecap="round"/>`;
    body += `<rect x="${PX - 18}" y="48" width="36" height="${FY - 48}" fill="${C.peach}" stroke="${C.orange}" stroke-width="3"/>`;
    // 아이(1~2칸에 자라고 3칸에 떠난다)
    const kid = `<g class="kid">${kidFig(KX, FY, HT, C.blue)}</g>`;
    body += `<g class="b1"><g class="leave">${g('pop pop1', kid, 0.1)}</g></g>`;
    // 키 금과 이름표
    const mark = (i) => `<path d="M${PX - 24} ${TOPS[i]} H${PX + 24}" stroke="${C.ink}" stroke-width="3.5" stroke-linecap="round"/>` + text(PX - 32, TOPS[i] + 7, LABEL[i], { size: 18, anchor: 'end' });
    body += at(1, 'fin', mark(0), 1);
    body += at(2, 'fin', mark(1), 1.1);
    body += at(2, 'fin', mark(2), 2.5);
    // 4칸: 금들이 반짝이고, 금 높이의 아이 모습을 짐작해 본다
    body += `<g class="b4">${[0, 1, 2].map((i) => g('flash flash4', `<path d="M${PX - 24} ${TOPS[i]} H${PX + 24}" stroke="${C.orange}" stroke-width="6" stroke-linecap="round"/>`, 0.2 + i * 0.2)).join('')}</g>`;
    [0, 1, 2].forEach((i) => {
      const gx = [380, 474, 568][i];
      body += shown(4, `<path class="draw draw4" pathLength="1" style="transition-delay:${f(0.6 + i * 0.3)}s" d="M${PX + 26} ${TOPS[i]} H${gx}" stroke="${C.muted}" stroke-width="2.5" fill="none"/>`);
      body += at(4, 'fin', `<g opacity=".4">${kidFig(gx, FY, HT * SC[i], C.blue)}</g>`, 1 + i * 0.3);
    });
    body += at(4, 'pop', tag(100, 80, '흔적', OLD, { size: 28 }), 1.8);
    css += `
      .sc-${id} .kid { transform-box: fill-box; transform-origin: 50% 100%; }
      .on2 .sc-${id} .kid { animation: ${id}-grow 2.6s ease-in-out .3s both; }
      @keyframes ${id}-grow { 0% { transform: scale(1); } 35%, 55% { transform: scale(${SC[1]}); } 100% { transform: scale(${SC[2]}); } }
      .sc-${id} .leave { transition: transform 1.8s ease-in, opacity 1s ease 1s; }
      .on3 .sc-${id} .leave { transform: translateX(380px); opacity: 0; }`;
    put(KEY('2-2', '흔적'), svg(id, body, css));
  })();

  // ════ 복원: 옛 성문이 부서지고, 기록을 보고 처음 모습대로 다시 짓는다 ════
  (function () {
    const id = 't31-so-bokwon';
    let css = base(id);
    const GX = 230, GY = 318; // 성문 가운데 아래
    // 성문 조각들: [모양, 떨어질 때 옮김 dx, dy, 돌림]
    const wall = `<path d="M${GX - 130} ${GY} V${GY - 98} H${GX + 130} V${GY} Z" fill="${C.line}" stroke="${C.muted}" stroke-width="3"/>`
      + `<path d="M${GX - 130} ${GY - 66} H${GX + 130} M${GX - 130} ${GY - 33} H${GX + 130} M${GX - 90} ${GY - 98} V${GY - 66} M${GX + 80} ${GY - 98} V${GY - 66} M${GX - 110} ${GY - 33} V${GY} M${GX + 104} ${GY - 33} V${GY}" stroke="${C.muted}" stroke-width="2"/>`
      + `<path d="M${GX - 34} ${GY} V${GY - 44} A34 34 0 0 1 ${GX + 34} ${GY - 44} V${GY} Z" fill="${C.ink}" opacity=".8"/>`;
    const PIECES = [
      // 지붕 왼쪽, 지붕 오른쪽, 기둥 둘, 성벽 윗돌 둘
      [`<path d="M${GX - 134} ${GY - 158} Q${GX - 96} ${GY - 152} ${GX - 62} ${GY - 190} H${GX} V${GY - 150} H${GX - 112} Q${GX - 126} ${GY - 150} ${GX - 134} ${GY - 158} Z" fill="${C.muted}" stroke="${C.ink}" stroke-width="3" stroke-linejoin="round"/><path d="M${GX - 108} ${GY - 160} H${GX}" stroke="${C.ink}" stroke-width="2"/>`, -40, 150, -24],
      [`<path d="M${GX + 134} ${GY - 158} Q${GX + 96} ${GY - 152} ${GX + 62} ${GY - 190} H${GX} V${GY - 150} H${GX + 112} Q${GX + 126} ${GY - 150} ${GX + 134} ${GY - 158} Z" fill="${C.muted}" stroke="${C.ink}" stroke-width="3" stroke-linejoin="round"/><path d="M${GX + 108} ${GY - 160} H${GX}" stroke="${C.ink}" stroke-width="2"/>`, 70, 150, 30],
      [`<rect x="${GX - 70}" y="${GY - 150}" width="14" height="52" fill="${C.red}" stroke="${C.ink}" stroke-width="2"/>`, -96, 104, -80],
      [`<rect x="${GX + 56}" y="${GY - 150}" width="14" height="52" fill="${C.red}" stroke="${C.ink}" stroke-width="2"/>`, 110, 112, 76],
      [`<rect x="${GX - 126}" y="${GY - 120}" width="44" height="22" fill="${C.line}" stroke="${C.muted}" stroke-width="2.5"/>`, -42, 120, 14],
      [`<rect x="${GX + 82}" y="${GY - 120}" width="44" height="22" fill="${C.line}" stroke="${C.muted}" stroke-width="2.5"/>`, 36, 120, -12]
    ];
    const beam = `<rect x="${GX - 80}" y="${GY - 112}" width="160" height="14" fill="${C.peach}" stroke="${C.orange}" stroke-width="2.5"/>`;
    let body = '';
    body += `<path d="M20 ${GY} H620" stroke="${C.line}" stroke-width="4" stroke-linecap="round"/>`;
    // 늘 서 있는 성벽 몸체
    body += wall + beam;
    // 1·2칸: 조각이 제자리에 있다가 부서져 떨어진다(4칸에 치운다)
    body += `<g class="h4">${PIECES.map(([d, dx, dy, r], i) => `<g class="fall" style="--fx:${dx}px;--fy:${dy}px;--fr:${r}deg;transition-delay:${f(0.2 + i * 0.12)}s">${d}</g>`).join('')}</g>`;
    body += `<g class="b1 h2">${g('pop pop1', tag(GX, 46, '옛 모습', OLD, { size: 20 }), 0.4)}</g>`;
    // 2칸: 무너진 더미(4칸에 치운다)
    const rub = (x, y, w, h, r, fill, stroke) => `<rect x="${x - w / 2}" y="${y - h / 2}" width="${w}" height="${h}" fill="${fill}" stroke="${stroke}" stroke-width="2.5" transform="rotate(${r} ${x} ${y})"/>`;
    const pile = rub(GX - 112, GY - 10, 46, 20, -12, C.line, C.muted) + rub(GX - 70, GY - 9, 40, 18, 8, C.line, C.muted) + rub(GX + 74, GY - 10, 44, 20, 10, C.line, C.muted) + rub(GX + 118, GY - 8, 40, 16, -6, C.line, C.muted)
      + rub(GX - 92, GY - 26, 52, 12, -20, C.red, C.ink) + rub(GX + 96, GY - 26, 52, 12, 24, C.red, C.ink)
      + `<path d="M${GX - 150} ${GY} L${GX - 128} ${GY - 40} L${GX - 52} ${GY - 30} L${GX - 40} ${GY} Z" fill="${C.muted}" stroke="${C.ink}" stroke-width="3" stroke-linejoin="round"/><path d="M${GX + 150} ${GY} L${GX + 132} ${GY - 36} L${GX + 50} ${GY - 32} L${GX + 40} ${GY} Z" fill="${C.muted}" stroke="${C.ink}" stroke-width="3" stroke-linejoin="round"/>`;
    body += `<g class="b2 h4">${g('fin fin2', pile, 0.9)}</g>`;
    body += shown(2, `<g class="shake">${[[GX - 150, GY - 40], [GX + 160, GY - 60], [GX - 20, GY - 170]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="14" fill="${C.line}" opacity=".7"/>`).join('')}</g>`, 3);
    // 3칸: 기록(책)과, 기록에서 알아낸 처음 모습(점선)
    const BX = 520, BY = 150;
    const book = `<path d="M${BX - 88} ${BY - 56} Q${BX - 44} ${BY - 70} ${BX} ${BY - 56} Q${BX + 44} ${BY - 70} ${BX + 88} ${BY - 56} V${BY + 52} Q${BX + 44} ${BY + 38} ${BX} ${BY + 52} Q${BX - 44} ${BY + 38} ${BX - 88} ${BY + 52} Z" fill="white" stroke="${C.purple}" stroke-width="3" stroke-linejoin="round"/><path d="M${BX} ${BY - 56} V${BY + 52}" stroke="${C.purple}" stroke-width="2.5"/>`
      + `<path d="M${BX + 14} ${BY + 26} H${BX + 74} M${BX + 14} ${BY + 8} V${BY + 26} M${BX + 74} ${BY + 8} V${BY + 26} M${BX + 6} ${BY + 8} Q${BX + 44} ${BY - 4} ${BX + 82} ${BY + 8} Q${BX + 44} ${BY - 18} ${BX + 6} ${BY + 8}" stroke="${C.ink}" stroke-width="2" fill="none"/>`
      + `<path d="M${BX - 74} ${BY - 30} H${BX - 14} M${BX - 74} ${BY - 10} H${BX - 14} M${BX - 74} ${BY + 10} H${BX - 14} M${BX - 74} ${BY + 30} H${BX - 30}" stroke="${C.muted}" stroke-width="2.5"/>`;
    body += at(3, 'pop', book, 0.2);
    body += at(3, 'pop', tag(BX, BY + 92, '기록', OLD, { size: 20 }), 0.6);
    body += shown(3, g('fin fin3', flow([[BX - 96, BY - 10], [GX + 140, GY - 170]], C.purple, { w: 4 }), 0.9), 4);
    const outline = `<path d="M${GX - 70} ${GY - 150} V${GY - 98} M${GX + 70} ${GY - 150} V${GY - 98} M${GX - 130} ${GY - 98} V${GY - 120} H${GX + 130} V${GY - 98}" fill="none" stroke="${C.purple}" stroke-width="3" stroke-dasharray="8 6" stroke-linejoin="round"/>`;
    body += shown(3, `<path class="draw draw3" pathLength="1" style="transition-delay:1.3s;transition-duration:1.6s" d="M${GX - 134} ${GY - 158} Q${GX - 96} ${GY - 152} ${GX - 62} ${GY - 190} H${GX + 62} Q${GX + 96} ${GY - 152} ${GX + 134} ${GY - 158} Q${GX + 126} ${GY - 150} ${GX + 112} ${GY - 150} H${GX - 112} Q${GX - 126} ${GY - 150} ${GX - 134} ${GY - 158} Z" fill="none" stroke="${C.purple}" stroke-width="3"/>`, 4);
    body += shown(3, g('fin fin3', outline, 1.6), 4);
    // 4칸: 새 조각이 하나씩 제자리에 올라가 처음 모습이 된다
    PIECES.slice().reverse().forEach(([d], i) => { body += at(4, 'drop', d, 0.2 + i * 0.22); });
    body += glowRect(GX - 146, GY - 202, 292, 206, 4, C.green, 1.8, 14);
    body += at(4, 'pop', tag(BX, 290, '복원', OK, { size: 28 }), 2);
    css += `
      .sc-${id} .fall { transform-box: fill-box; transform-origin: center; transition: transform 1s cubic-bezier(.5,0,.9,.6); }
      .on2 .sc-${id} .fall { transform: translate(var(--fx), var(--fy)) rotate(var(--fr)); opacity: 0; transition: transform 1s cubic-bezier(.5,0,.9,.6), opacity .4s ease .7s; }
      .sc-${id} .shake { animation: ${id}-dust 1.2s ease-out 1s both; }
      @keyframes ${id}-dust { 0% { opacity: 0; transform: translateY(10px); } 30% { opacity: 1; } 100% { opacity: .5; transform: translateY(-10px); } }`;
    put(KEY('2-2', '복원'), svg(id, body, css));
  })();

  // ════ 타임캡슐: 지금 물건을 담아 묻고, 20년 뒤에 꺼내 연다 ════
  (function () {
    const id = 't31-so-taimcapsule';
    let css = base(id);
    const GY = 196, CX = 220, CT = 120; // 땅 높이, 캡슐 가운데 x, 캡슐 몸통 위 y
    const DOWN = 132;
    const letter = (x, y) => `<rect x="${x - 22}" y="${y - 15}" width="44" height="30" rx="3" fill="white" stroke="${C.blue}" stroke-width="2.5"/><path d="M${x - 22} ${y - 15} L${x} ${y + 3} L${x + 22} ${y - 15}" stroke="${C.blue}" stroke-width="2.5" fill="none" stroke-linejoin="round"/>`;
    const photo = (x, y) => `<rect x="${x - 20}" y="${y - 17}" width="40" height="34" rx="3" fill="white" stroke="${C.orange}" stroke-width="2.5"/><path d="M${x - 15} ${y + 11} L${x - 4} ${y - 2} L${x + 4} ${y + 6} L${x + 9} ${y + 1} L${x + 15} ${y + 11} Z" fill="${C.green}"/><circle cx="${x + 9}" cy="${y - 8}" r="4" fill="${C.yellow}"/>`;
    const table = (x, y) => `<rect x="${x - 20}" y="${y - 18}" width="40" height="36" rx="3" fill="white" stroke="${C.purple}" stroke-width="2.5"/><path d="M${x - 20} ${y - 6} H${x + 20} M${x - 20} ${y + 6} H${x + 20} M${x - 7} ${y - 18} V${y + 18} M${x + 7} ${y - 18} V${y + 18}" stroke="${C.purple}" stroke-width="1.8"/>`;
    const ITEMS = [[letter, -34], [photo, 0], [table, 34]];
    let body = '';
    // 땅(잘라 본 모습)과 하늘
    body += `<rect x="0" y="${GY}" width="640" height="${360 - GY}" fill="${C.peach}"/><path d="M0 ${GY} H640" stroke="${C.orange}" stroke-width="3"/>`;
    // 3칸: 나무가 자란다(땅 위)
    body += shown(3, `<g class="growy growy3" style="transition-duration:2.6s;transition-delay:.4s"><path d="M${CX + 150} ${GY} V${GY - 60}" stroke="${C.orange}" stroke-width="8" stroke-linecap="round"/><circle cx="${CX + 150}" cy="${GY - 80}" r="34" fill="${C.green}"/><circle cx="${CX + 138}" cy="${GY - 92}" r="12" fill="${C.mint}" opacity=".5"/></g>`);
    body += shown(1, `<g class="h3"><path d="M${CX + 150} ${GY} V${GY - 18}" stroke="${C.green}" stroke-width="5" stroke-linecap="round"/><path d="M${CX + 150} ${GY - 14} q-12 -8 -16 -2 M${CX + 150} ${GY - 16} q12 -8 16 -2" stroke="${C.green}" stroke-width="4" fill="none" stroke-linecap="round"/></g>`);
    // 캡슐: 물건(몸통 뒤) → 몸통 → 뚜껑. 2칸에 땅속으로, 4칸에 올라온다
    const items = ITEMS.map(([fn, dx], i) => `<g class="b1">${g('drop drop1', `<g class="inside" style="--iy:${f(68 - i * 2)}px;transition-delay:${f(0.6 + i * 0.4)}s">${fn(CX + dx, CT - 50)}</g>`, 0.2 + i * 0.4)}</g>`).join('');
    const bodyShape = `<rect x="${CX - 66}" y="${CT}" width="132" height="72" rx="14" fill="${C.sky}" stroke="${C.blue}" stroke-width="3.5"/><path d="M${CX - 66} ${CT + 20} H${CX + 66}" stroke="${C.blue}" stroke-width="2.5"/>`;
    const lid = `<g class="lid"><rect x="${CX - 72}" y="${CT - 16}" width="144" height="18" rx="8" fill="${C.blue}"/></g>`;
    body += `<g class="b1"><g class="cap"><g class="h4">${items}</g>${bodyShape}${lid}</g></g>`;
    // 흙을 덮는다(2칸)
    body += shown(2, g('fin fin2', `<path d="M${CX - 90} ${GY} Q${CX} ${GY - 22} ${CX + 90} ${GY}" fill="${C.peach}" stroke="${C.orange}" stroke-width="3"/>`, 1.6), 4);
    // 해 이름표: 2026년 → 2036년 → 2046년
    const YX = 520, YY = 70;
    body += `<g class="b1 h3">${g('pop pop1', tag(YX, YY, '2026년', OK, { size: 22 }), 0.1)}</g>`;
    body += `<g class="b3">${g('yr1', tag(YX, YY, '2036년', COLD, { size: 22 }))}</g>`;
    body += `<g class="b3">${g('yr2', tag(YX, YY, '2046년', HOT, { size: 22 }))}</g>`;
    body += shown(3, g('fin fin3', tag(YX, YY + 54, '20년 뒤', PLAIN, { size: 20 }), 2.4));
    // 4칸: 꺼낸 캡슐에서 물건이 나온다
    ITEMS.forEach(([fn, dx], i) => { body += at(4, 'pop', fn(CX + dx * 2.6, CT - 62 - (i === 1 ? 14 : 0)), 1.7 + i * 0.25); });
    body += ring(CX, CT - 56, 40, 4, C.orange, 1.9);
    body += at(4, 'pop', tag(YX, 270, '타임캡슐', OK, { size: 26 }), 2.4);
    css += `
      .sc-${id} .inside { transition: transform .8s ease-in; }
      .on1 .sc-${id} .inside { transform: translateY(var(--iy)); }
      .sc-${id} .lid { transform: translate(-146px, ${GY - CT - 2}px); transition: transform .8s ease-in-out .3s; }
      .on2 .sc-${id} .lid { transform: none; }
      .on4 .sc-${id} .lid { transform: translate(-146px, ${GY - CT - 2}px); transition-delay: 1.4s; }
      .sc-${id} .cap { transition: transform 1.4s ease-in-out .9s; }
      .on2 .sc-${id} .cap { transform: translateY(${DOWN}px); }
      .on4 .sc-${id} .cap { transform: none; transition-delay: .2s; }
      .sc-${id} .yr1, .sc-${id} .yr2 { opacity: 0; }
      .on3 .sc-${id} .yr1 { animation: ${id}-yr1 2.4s linear both; }
      .on3 .sc-${id} .yr2 { animation: ${id}-fin .5s ease-out 2s both; }
      @keyframes ${id}-yr1 { 0%, 20% { opacity: 0; } 30%, 80% { opacity: 1; } 100% { opacity: 0; } }`;
    put(KEY('2-2', '타임캡슐'), svg(id, body, css));
  })();

  // ════ 유래: 길목 → 떡 가게 → 떡전 거리 → 병점 ════
  (function () {
    const id = 't31-so-yurae';
    let css = base(id);
    const J = [200, 150]; // 길목
    const ENDS = [['서울', [200, 22], [200, 44]], ['전라도', [40, 318], [72, 322]], ['충청도', [200, 340], [200, 322]], ['경상도', [360, 318], [328, 322]]];
    let body = '';
    // 길
    ENDS.forEach(([, p]) => { body += `<path d="M${J[0]} ${J[1]} L${p[0]} ${p[1]}" stroke="${C.line}" stroke-width="22" stroke-linecap="round"/>`; });
    ENDS.forEach(([, p]) => { body += `<path d="M${J[0]} ${J[1]} L${p[0]} ${p[1]}" stroke="white" stroke-width="2" stroke-dasharray="8 8"/>`; });
    // 1칸: 길 끝 이름과 오가는 사람
    ENDS.forEach(([w, , t], i) => { body += at(1, 'pop', tag(t[0], t[1], w, PLAIN, { size: 18 }), 0.2 + i * 0.15); });
    const WALK = [[[200, 60], [0, 230]], [[70, 300], [116, -128]], [[340, 300], [-118, -128]], [[200, 160], [0, 140]]];
    WALK.forEach(([[x, y], [dx, dy]], i) => {
      body += shown(1, `<g class="walk" style="--wx:${dx}px;--wy:${dy}px;animation-delay:${f(-i * 0.9)}s">${person(x, y, [C.green, C.blue, C.purple, C.orange][i], 0.9)}</g>`, 4);
    });
    // 2칸: 떡 가게가 생긴다
    const shop = (x, y) => `<rect x="${x - 30}" y="${y - 30}" width="60" height="40" fill="white" stroke="${C.orange}" stroke-width="2.5"/><path d="M${x - 36} ${y - 30} L${x - 28} ${y - 46} H${x + 28} L${x + 36} ${y - 30} Z" fill="${C.orange}"/>`
      + `<rect x="${x - 18}" y="${y - 20}" width="36" height="9" rx="4" fill="${C.peach}" stroke="${C.orange}" stroke-width="1.5"/><rect x="${x - 14}" y="${y - 10}" width="28" height="9" rx="4" fill="white" stroke="${C.orange}" stroke-width="1.5"/>`;
    const SHOPS = [[120, 140], [282, 140], [96, 204], [304, 204]];
    body += `<g class="h4">${SHOPS.map(([x, y], i) => `<g class="b2">${g('pop pop2', shop(x, y), 0.2 + i * 0.3)}</g>`).join('')}</g>`;
    body += `<g class="b2 h4">${g('pop pop2', tag(200, 250, '떡 가게', HOT, { size: 20 }), 1.5)}</g>`;
    // 3칸: 떡전 거리 → 병점
    body += `<g class="b3 h4">${g('pop pop3', tag(J[0], 90, '떡전 거리', HOT, { size: 18 }), 0.2)}</g>`;
    const TX = [470, 580], tile = (x, y, s, col) => `<rect x="${x - 40}" y="${y - 26}" width="80" height="52" rx="10" fill="${col[0]}" stroke="${col[1]}" stroke-width="3"/>` + text(x, y + 8, s, { size: 22 });
    body += at(3, 'pop', tile(TX[0], 70, '떡', HOT) + tile(TX[1], 70, '가게', HOT), 0.8);
    body += at(3, 'fin', head(TX[0], 140, Math.PI / 2, C.muted, 4) + `<path d="M${TX[0]} 102 V136" stroke="${C.muted}" stroke-width="4"/>` + head(TX[1], 140, Math.PI / 2, C.muted, 4) + `<path d="M${TX[1]} 102 V136" stroke="${C.muted}" stroke-width="4"/>`, 1.3);
    body += at(3, 'pop', tile(TX[0], 172, '병', OLD) + tile(TX[1], 172, '점', OLD), 1.6);
    body += at(3, 'fin', `<path d="M${TX[0]} 204 Q${TX[0]} 236 ${(TX[0] + TX[1]) / 2} 240 Q${TX[1]} 236 ${TX[1]} 204" stroke="${C.muted}" stroke-width="4" fill="none"/>` + head((TX[0] + TX[1]) / 2, 252, Math.PI / 2, C.muted, 4) + `<path d="M${(TX[0] + TX[1]) / 2} 240 V248" stroke="${C.muted}" stroke-width="4"/>`, 2.1);
    body += at(3, 'pop', tag((TX[0] + TX[1]) / 2, 282, '병점', OLD, { size: 26 }), 2.4);
    // 4칸: 떡 가게는 사라지고 이름이 길목에 남는다
    body += at(4, 'pop', tag(J[0], J[1], '병점', OLD, { size: 26 }), 0.8);
    body += ring(J[0], J[1], 46, 4, C.purple, 1);
    body += glowRect(418, 34, 214, 274, 4, C.purple, 1.3, 14);
    body += at(4, 'pop', tag(525, 334, '유래', OK, { size: 22 }), 1.8);
    css += `
      .sc-${id} .walk { animation: ${id}-walk 3.6s linear infinite; }
      @keyframes ${id}-walk { 0% { opacity: 0; transform: translate(0, 0); } 12%, 85% { opacity: 1; } 100% { opacity: 0; transform: translate(var(--wx), var(--wy)); } }`;
    put(KEY('2-3', '유래'), svg(id, body, css));
  })();
  // ════ 사건: 늘 같은 하루 사이에 특별히 일어난 일을 콕 찍는다 ════
  (function () {
    const id = 't31-so-sageon';
    let css = base(id) + `
      .sc-${id} .usual { transition: opacity .8s ease .3s; }
      .on4 .sc-${id} .usual { opacity: .35; }`;
    const N = 11, X = (i) => 60 + i * 52, BT = 150, BHh = 56, LY2 = 238;
    const bagIcon = (x, y) => `<path d="M${x - 6} ${y - 12} Q${x} ${y - 20} ${x + 6} ${y - 12}" stroke="${C.muted}" stroke-width="2.5" fill="none"/><rect x="${x - 11}" y="${y - 12}" width="22" height="26" rx="6" fill="${C.line}" stroke="${C.muted}" stroke-width="2"/><path d="M${x - 11} ${y - 2} H${x + 11}" stroke="${C.muted}" stroke-width="2"/>`;
    const starP = (x, y, r) => { let d = ''; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + (i * Math.PI) / 5, rr = i % 2 ? r * 0.45 : r; d += `${i ? 'L' : 'M'}${f(x + rr * Math.cos(a))} ${f(y + rr * Math.sin(a))}`; } return d + 'Z'; };
    const SPECIAL = [[6, '체육 대회', HOT, 2], [2, '현장 학습', COLD, 3], [9, '학예회', OLD, 3]];
    const isSp = (i) => SPECIAL.some((s) => s[0] === i);
    let body = '';
    // 시간 줄
    body += `<path d="M30 ${LY2} H600" stroke="${C.ink}" stroke-width="4" stroke-linecap="round"/>` + head(608, LY2, 0, C.ink, 4);
    body += text(606, LY2 + 34, '시간', { size: 18, color: C.muted, anchor: 'end' });
    // 1칸: 날마다 같은 하루(책가방)
    for (let i = 0; i < N; i++) {
      const box = `<rect x="${X(i) - 22}" y="${BT}" width="44" height="${BHh}" rx="8" fill="white" stroke="${C.line}" stroke-width="2.5"/>` + bagIcon(X(i), BT + 30) + `<path d="M${X(i)} ${BT + BHh} V${LY2}" stroke="${C.line}" stroke-width="2"/>`;
      body += `<g class="${isSp(i) ? '' : 'usual'}">${at(1, 'pop', box, 0.1 + i * 0.12)}</g>`;
    }
    body += `<g class="b1 h4">${g('pop pop1', tag(320, 296, '늘 하는 일', PLAIN, { size: 20 }), 1.5)}</g>`;
    // 2·3칸: 특별한 날
    SPECIAL.forEach(([i, w, col, n], k) => {
      const d = n === 3 ? (k - 1) * 0.7 : 0;
      body += at(n, 'pop', `<rect x="${X(i) - 25}" y="${BT - 3}" width="50" height="${BHh + 6}" rx="9" fill="${col[0]}" stroke="${col[1]}" stroke-width="3"/><path d="${starP(X(i), BT + 28, 15)}" fill="${C.yellow}" stroke="${col[1]}" stroke-width="2" stroke-linejoin="round"/>`, 0.2 + d);
      body += ring(X(i), BT + 28, 26, n, col[1], 0.4 + d);
      body += shown(n, `<path class="draw draw${n}" pathLength="1" style="transition-delay:${f(0.6 + d)}s;transition-duration:.6s" d="M${X(i)} ${BT - 6} V108" stroke="${col[1]}" stroke-width="2.5" fill="none"/>`);
      body += at(n, 'pop', tag(X(i), 90, w, col, { size: 20 }), 0.9 + d);
      // 시간 줄 위에 콕 찍는 점
      body += at(n, 'drop', `<circle cx="${X(i)}" cy="${LY2}" r="9" fill="${col[1]}" stroke="white" stroke-width="2.5"/>`, 1.1 + d);
    });
    // 4칸
    SPECIAL.forEach(([i, , col], k) => { body += glowRect(X(i) - 29, BT - 7, 58, BHh + 14, 4, col[1], 0.2 + k * 0.2, 11); });
    body += at(4, 'pop', tag(320, 300, '사건', HOT, { size: 28 }), 0.9);
    put(KEY('2-1', '사건'), svg(id, body, css));
  })();

  // ════ 역사: 오래전 일부터 내가 겪은 일까지 차곡차곡 쌓여 이어진다 ════
  (function () {
    const id = 't31-so-yeoksa';
    let css = base(id) + `
      .on1 .sc-${id} .st1, .on2 .sc-${id} .st2, .on3 .sc-${id} .st3 { animation: ${id}-st .7s cubic-bezier(.5,0,.7,1) both; }
      @keyframes ${id}-st { 0% { opacity: 0; transform: translateY(-150px); } 30% { opacity: 1; } 85% { transform: translateY(4px); } 100% { opacity: 1; transform: none; } }`;
    const SX0 = 140, SW0 = 280, BH0 = 50, BOT = 320;
    const BLOCKS = [[1443, '훈민정음', OLD, 1, 0.3], [1988, '서울 올림픽', HOT, 2, 0.2], [2002, '월드컵', COLD, 2, 1], [2024, '나의 입학', OK, 3, 0.2]];
    let body = '';
    // 오래전 → 지금 화살표
    body += at(1, 'fin', `<path d="M86 ${BOT} V112" stroke="${C.muted}" stroke-width="4" stroke-linecap="round"/>` + head(86, 104, -Math.PI / 2, C.muted, 4) + text(86, BOT + 28, '오래전', { size: 18, color: C.muted }) + text(86, 90, '지금', { size: 18, color: C.muted }));
    // 땅
    body += `<path d="M120 ${BOT} H440" stroke="${C.line}" stroke-width="4" stroke-linecap="round"/>`;
    BLOCKS.forEach(([yr, w, [fill, stroke], n, d], i) => {
      const y = BOT - (i + 1) * BH0;
      const blk = `<rect x="${SX0}" y="${y}" width="${SW0}" height="${BH0 - 4}" rx="8" fill="${fill}" stroke="${stroke}" stroke-width="3"/>` + text(SX0 + 62, y + 31, yr, { size: 20, color: stroke }) + text(SX0 + 180, y + 31, w, { size: 20 });
      body += `<g class="b${n}">${g(`st${n}`, blk, d)}</g>`;
    });
    // 2칸: 할머니, 3칸: 나
    body += at(2, 'pop', person(456, BOT - 2 * BH0 + 6, C.purple, 1.3) + text(456, BOT - 2 * BH0 + 30, '할머니', { size: 18, color: C.purple }), 1.6);
    body += at(3, 'pop', person(456, BOT - 4 * BH0 + 6, C.green, 1.1) + text(456, BOT - 4 * BH0 + 28, '나', { size: 18, color: C.green }), 1.1);
    body += ring(280, BOT - 3.5 * BH0, 40, 3, C.green, 1.2);
    // 4칸: 기록으로 남긴다
    const BX = 556, BY = 236;
    const book = `<path d="M${BX - 62} ${BY - 44} Q${BX - 31} ${BY - 54} ${BX} ${BY - 44} Q${BX + 31} ${BY - 54} ${BX + 62} ${BY - 44} V${BY + 44} Q${BX + 31} ${BY + 34} ${BX} ${BY + 44} Q${BX - 31} ${BY + 34} ${BX - 62} ${BY + 44} Z" fill="white" stroke="${C.purple}" stroke-width="3" stroke-linejoin="round"/><path d="M${BX} ${BY - 44} V${BY + 44}" stroke="${C.purple}" stroke-width="2.5"/>`
      + [-24, -8, 8, 24].map((dy) => `<path d="M${BX - 50} ${BY + dy} H${BX - 12} M${BX + 12} ${BY + dy} H${BX + 50}" stroke="${C.muted}" stroke-width="2.5"/>`).join('');
    body += at(4, 'pop', book, 0.2);
    body += shown(4, g('fin fin4', flow([[426, 292], [486, 262]], C.purple, { w: 4 }), 0.5));
    body += glowRect(SX0 - 6, BOT - 4 * BH0 - 6, SW0 + 12, 4 * BH0 + 4, 4, C.purple, 0.6, 12);
    body += at(4, 'pop', tag(BX, 322, '역사', OLD, { size: 28 }), 1);
    put(KEY('2-1', '역사'), svg(id, body, css));
  })();

  // ════ 자료: 알아보려는 것 하나에 사진·책·증언·물건이 모여든다 ════
  (function () {
    const id = 't31-so-jaryo';
    let css = base(id);
    const CX = 320, CY = 172;
    const photoI = (x, y) => `<rect x="${x - 34}" y="${y - 28}" width="68" height="56" rx="4" fill="white" stroke="${C.orange}" stroke-width="3"/><path d="M${x - 26} ${y + 20} L${x - 8} ${y - 2} L${x + 4} ${y + 10} L${x + 12} ${y + 2} L${x + 26} ${y + 20} Z" fill="${C.green}"/><circle cx="${x + 14}" cy="${y - 12}" r="6" fill="${C.yellow}"/>`;
    const bookI = (x, y) => `<rect x="${x - 26}" y="${y - 32}" width="52" height="64" rx="4" fill="${C.lilac}" stroke="${C.purple}" stroke-width="3"/><path d="M${x - 18} ${y - 32} V${y + 32}" stroke="${C.purple}" stroke-width="2.5"/><path d="M${x - 8} ${y - 14} H${x + 16} M${x - 8} ${y - 2} H${x + 16} M${x - 8} ${y + 10} H${x + 10}" stroke="${C.purple}" stroke-width="2"/>`;
    const talkI = (x, y) => person(x - 16, y + 30, C.blue, 1.6) + `<path d="M${x + 2} ${y - 34} H${x + 44} Q${x + 50} ${y - 34} ${x + 50} ${y - 28} V${y - 8} Q${x + 50} ${y - 2} ${x + 44} ${y - 2} H${x + 16} L${x + 6} ${y + 8} L${x + 8} ${y - 2} Q${x + 2} ${y - 2} ${x + 2} ${y - 8} Z" fill="white" stroke="${C.blue}" stroke-width="2.5" stroke-linejoin="round"/>` + [14, 26, 38].map((dx) => `<circle cx="${x + dx}" cy="${y - 18}" r="3" fill="${C.blue}"/>`).join('');
    const jarI = (x, y) => `<path d="M${x - 14} ${y - 30} H${x + 14} L${x + 12} ${y - 22} Q${x + 34} ${y - 10} ${x + 30} ${y + 12} Q${x + 26} ${y + 30} ${x} ${y + 30} Q${x - 26} ${y + 30} ${x - 30} ${y + 12} Q${x - 34} ${y - 10} ${x - 12} ${y - 22} Z" fill="${C.peach}" stroke="${C.orange}" stroke-width="3" stroke-linejoin="round"/><path d="M${x - 24} ${y} Q${x} ${y + 8} ${x + 24} ${y}" stroke="${C.orange}" stroke-width="2" fill="none"/>`;
    // [그림, 자리, 이름, 색, 칸, 처음 옮김]
    const ITEMS = [[photoI, [160, 96], '사진', HOT, 2, [-120, -40, -14]], [bookI, [480, 96], '책', OLD, 2, [120, -40, 12]],
      [talkI, [160, 258], '증언', COLD, 3, [-120, 40, 0]], [jarI, [480, 258], '물건', HOT, 3, [120, 40, 10]]];
    let body = '';
    // 1칸: 알아보려는 것
    body += at(1, 'pop', `<circle cx="${CX}" cy="${CY}" r="52" fill="white" stroke="${C.green}" stroke-width="4"/>` + text(CX, CY + 16, '?', { size: 46, color: C.green }), 0.2);
    body += at(1, 'pop', tag(CX, CY + 82, '옛날 모습', OK, { size: 22 }), 0.6);
    body += ring(CX, CY, 56, 1, C.green, 0.8);
    ITEMS.forEach(([fn, [x, y], w, col, n, [dx, dy, r]], i) => {
      const pts = n === 2 ? [[dx, dy, r], [0, 0, 0]] : [[dx, dy, r], [dx, dy, r], [0, 0, 0]];
      const d = i % 2 ? 0.4 : 0;
      body += at(n, 'fin', mv(pts, fn(x, y) + tag(x, y + 52, w, col, { size: 20 }), `transition-delay:${f(0.3 + d)}s`), d);
      const ex = x < CX ? CX - 62 : CX + 62, ey = y < CY ? CY - 22 : CY + 22;
      body += shown(n, g(`fin fin${n}`, flow([[x < CX ? x + 52 : x - 52, y], [ex, ey]], col[1], { w: 4 }), 1.8 + d));
    });
    // 4칸
    body += glowRect(CX - 58, CY - 58, 116, 116, 4, C.green, 0.2, 58);
    ITEMS.forEach(([, [x, y], w, col], i) => { const ww = Math.round(tw(w, 20) + 26) + 10; body += glowRect(x - ww / 2, y + 30, ww, 44, 4, col[1], 0.4 + i * 0.15, 22); });
    body += at(4, 'pop', tag(CX, 32, '자료', OK, { size: 28 }), 1.1);
    put(KEY('2-2', '자료'), svg(id, body, css));
  })();
})(typeof window !== 'undefined' ? window : globalThis);
