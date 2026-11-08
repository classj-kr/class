// 국어 5-1 낱말 도식(3단원 발표·매체 단원 검색·4단원 설명하는 글): 자료 갈래·검색 화면·글의 구조 낱말을 낱말 조각과 그림 조각으로 움직여 보인다.
// 도구(tile·tag·row·base·move 따위)는 figures/6-1/kor-2.js 와 같은 것을 옮겨 왔다(학기마다 그 학기 도식 파일만 불러오므로).
(function (root) {
  'use strict';
  const { C, svg, text, put } = root.FigureKit;
  const f = (n) => +(+n).toFixed(1);

  // 글자 폭 어림(맑은 고딕 굵게 실측: 한글 1em, 괄호 .36em, 쉼표·마침표·쌍점 .26em)
  const cw = (ch) => /[가-힣ㄱ-ㅎㅏ-ㅣ○]/.test(ch) ? 1 : ch === ' ' ? 0.3 : /[(),.:;'"!\[\]·]/.test(ch) ? 0.36 : ch === '?' ? 0.5 : /[0-9]/.test(ch) ? 0.6 : 0.75;
  const tw = (s, size) => [...s].reduce((a, c) => a + cw(c), 0) * size;
  const wOf = (label, size = 28) => Math.round(tw(label, size) + size * 1.3);
  const dl = (s) => (s ? ` style="animation-delay:${s}s"` : '');
  const g = (cls, inner, s = 0) => `<g class="${cls}"${dl(s)}>${inner}</g>`;
  // 칸 n 에 나타나며 kind(pop·fin·rise·drop·slide) 움직임을 한 번 한다
  const at = (n, kind, inner, s = 0) => `<g class="b${n}">${g(`${kind} ${kind}${n}`, inner, s)}</g>`;

  // 낱말 조각: 배경 rect.bg, 글자 text.tx — 색 바꾸기는 CSS 로 .bg 의 fill/stroke 를 바꾼다
  const tile = (cx, cy, label, o = {}) => {
    const { size = 28, h = 56, fill = 'white', stroke = C.line, cls = '', sw = 3, rx = 12, dash = '', color = C.ink } = o;
    const w = o.w || wOf(label, size);
    return `<g class="tl ${cls}"><rect class="bg" x="${f(cx - w / 2)}" y="${f(cy - h / 2)}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"${dash ? ` stroke-dasharray="${dash}"` : ''}/>${text(f(cx), f(cy + size * 0.36), label, { size, cls: 'tx', color })}</g>`;
  };
  const tag = (cx, cy, label, [fill, stroke] = [C.mint, C.green], size = 20) =>
    tile(cx, cy, label, { size, h: 34, rx: 17, fill, stroke, sw: 2.5, cls: 'tag', w: wOf(label, size) + 4 });
  const ROLE = { s: [C.sky, C.blue], o: [C.peach, C.orange], p: [C.mint, C.green], x: [C.lilac, C.purple], y: ['#fdf3d3', C.orange], r: [C.peach, C.red] };
  // 낱말 줄: 폭을 재어 왼쪽 x0 부터(또는 가운데 cx 에 맞춰) 늘어놓는다
  const row = (labels, { y, x0, cx = 320, gap = 16, size = 28 }) => {
    const ws = labels.map((l) => wOf(l, size));
    const total = ws.reduce((a, b) => a + b, 0) + gap * (labels.length - 1);
    let x = x0 != null ? x0 : cx - total / 2;
    return labels.map((label, i) => { const c = x + ws[i] / 2; x += ws[i] + gap; return { label, cx: c, w: ws[i], y, size, l: c - ws[i] / 2, r: c + ws[i] / 2 }; });
  };
  const paint = (id, sel, [fill, stroke], n, delay = 0) =>
    `.on${n} .sc-${id} ${sel} .bg { fill: ${fill}; stroke: ${stroke};${delay ? ` transition-delay: ${delay}s;` : ''} }`;

  const head = (x, y, ang, color, w = 4) => {
    const l = 13, p = (d) => `${f(x - l * Math.cos(ang + d))} ${f(y - l * Math.sin(ang + d))}`;
    return `<path d="M${p(-0.5)} L${f(x)} ${f(y)} L${p(0.5)}" stroke="${color}" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  };
  // 그어지는 곧은 화살표(칸 n)
  const drawArrow = (x1, y1, x2, y2, color, n, { width = 5, delay = 0, dash = '' } = {}) =>
    `<g class="b${n}">${dash ? `<path d="M${f(x1)} ${f(y1)} L${f(x2)} ${f(y2)}" stroke="${C.line}" stroke-width="${width}" stroke-dasharray="${dash}" fill="none" stroke-linecap="round"/>` : ''}<path class="draw draw${n}" pathLength="1" d="M${f(x1)} ${f(y1)} L${f(x2)} ${f(y2)}" stroke="${color}" stroke-width="${width}" fill="none" stroke-linecap="round"${delay ? ` style="transition-delay:${delay}s"` : ''}/>`
    + g(`fin fin${n}`, head(x2, y2, Math.atan2(y2 - y1, x2 - x1), color, width), delay + 0.9) + '</g>';
  // 그어지는 선(칸 n, 화살촉 없음)
  const drawLine = (d, color, n, { width = 4, delay = 0, cls = '' } = {}) =>
    `<g class="b${n}"><path class="draw draw${n} ${cls}" pathLength="1" d="${d}" stroke="${color}" stroke-width="${width}" fill="none" stroke-linecap="round" stroke-linejoin="round"${delay ? ` style="transition-delay:${delay}s"` : ''}/></g>`;
  const check = (x, y, r = 13, color = C.green) => `<g><circle cx="${x}" cy="${y}" r="${r + 9}" fill="white" stroke="${color}" stroke-width="3"/><path d="M${x - r * 0.65} ${y + 1} L${x - r * 0.15} ${y + r * 0.55} L${x + r * 0.7} ${y - r * 0.55}" stroke="${color}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none"/></g>`;
  const glowRect = (x, y, w, h, n, color = C.green, delay = 0, rx = 14) =>
    `<g class="b${n}"><rect class="flash flash${n}"${dl(delay)} x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="${rx}" fill="none" stroke="${color}" stroke-width="5"/></g>`;

  // 장면마다 같이 쓰는 움직임. 같은 요소에 여러 칸 움직임이 붙으면 뒤 칸 것이 이긴다(칸 차례로 적는다).
  const base = (id) => {
    let s = `
    .sc-${id} .pop, .sc-${id} .pulse, .sc-${id} .shake, .sc-${id} .ring { transform-box: fill-box; transform-origin: center; }
    .sc-${id} .draw { stroke-dasharray: 1; stroke-dashoffset: 1; transition: stroke-dashoffset 1s ease-in-out; }
    .sc-${id} .bg { transition: fill .5s ease, stroke .5s ease; }
    .sc-${id} .dim { transition: opacity .6s ease; }
    .sc-${id} .ring { opacity: 0; }
    @keyframes ${id}-pop { 0% { opacity: 0; transform: scale(.3); } 70% { opacity: 1; transform: scale(1.12); } 100% { opacity: 1; transform: scale(1); } }
    @keyframes ${id}-fin { from { opacity: 0; } to { opacity: 1; } }
    @keyframes ${id}-rise { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
    @keyframes ${id}-drop { from { opacity: 0; transform: translateY(-24px); } to { opacity: 1; transform: none; } }
    @keyframes ${id}-slide { from { opacity: 0; transform: translateX(-36px); } to { opacity: 1; transform: none; } }
    @keyframes ${id}-pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }
    @keyframes ${id}-flash { 0% { opacity: 0; } 20% { opacity: 1; } 40% { opacity: .25; } 60% { opacity: 1; } 80% { opacity: .25; } 100% { opacity: 1; } }
    @keyframes ${id}-shake { 0%, 100% { transform: translateX(0); } 20%, 60% { transform: translateX(-8px); } 40%, 80% { transform: translateX(8px); } }
    @keyframes ${id}-ring { 0% { opacity: .9; transform: scale(1); } 100% { opacity: 0; transform: scale(1.5); } }
    `;
    for (let n = 1; n <= 6; n++) s += `
    .on${n} .sc-${id} .pop${n} { animation: ${id}-pop .5s ease-out both; }
    .on${n} .sc-${id} .fin${n} { animation: ${id}-fin .45s ease-out both; }
    .on${n} .sc-${id} .rise${n} { animation: ${id}-rise .5s ease-out both; }
    .on${n} .sc-${id} .drop${n} { animation: ${id}-drop .5s ease-out both; }
    .on${n} .sc-${id} .slide${n} { animation: ${id}-slide .55s ease-out both; }
    .on${n} .sc-${id} .pulse${n} { animation: ${id}-pulse .7s ease-in-out .2s 2; }
    .on${n} .sc-${id} .flash${n} { animation: ${id}-flash 1.4s ease-in-out both; }
    .on${n} .sc-${id} .shake${n} { animation: ${id}-shake .6s ease-in-out .2s 2; }
    .on${n} .sc-${id} .ring${n} { animation: ${id}-ring 1s ease-out .3s 2; }
    .on${n} .sc-${id} .draw${n} { stroke-dashoffset: 0; }
    .on${n} .sc-${id} .dim${n} { opacity: .3; }`;
    return s;
  };
  const pulseCss = (id, sel, n, delay = 0.4) => `.on${n} .sc-${id} ${sel} { animation: ${id}-pulse .7s ease-in-out ${delay}s 2; transform-box: fill-box; transform-origin: center; }`;
  // 칸 n 에서 늘어나며 나타나기(scaleX·scaleY), origin 은 fill-box 기준
  const growCss = (id, sel, n, { axis = 'X', origin = 'left center', delay = 0, dur = 0.7 } = {}) => `
    .sc-${id} ${sel} { transform-box: fill-box; transform-origin: ${origin}; transform: scale${axis}(0); transition: transform ${dur}s ease-out ${delay}s; }
    .on${n} .sc-${id} ${sel} { transform: none; }`;
  // 칸 n 에서 흰 덮개가 왼쪽부터 걷히며 글자가 한 자씩 찍히듯 보인다(steps)
  const typeCover = (id, cls, x, y, w, h, n, { delay = 0.3, steps = 6, dur = 1.1, fill = 'white' } = {}) => ({
    body: `<g class="${cls}"><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}"/></g>`,
    css: `.sc-${id} .${cls} { transform-box: fill-box; transform-origin: right center; transition: transform ${dur}s steps(${steps}) ${delay}s; }
      .on${n} .sc-${id} .${cls} { transform: scaleX(0); }`
  });

  const K = '5-1/국어/';
  const TAN = '#fdf3d3';
  const bar = (x, y, w, color = '#c4d3cc', h = 8, cls = '') => `<rect class="${cls}" x="${f(x)}" y="${f(y - h / 2)}" width="${f(w)}" height="${h}" rx="${h / 2}" fill="${color}"/>`;
  // 사람(머리와 어깨). x, y 는 어깨선 가운데
  const person = (x, y, color = C.blue, r = 18) =>
    `<circle cx="${x}" cy="${y - r - 14}" r="${r}" fill="${color}"/><path d="M${x - r * 1.6} ${y + r * 1.5} Q${x - r * 1.6} ${y} ${x} ${y} Q${x + r * 1.6} ${y} ${x + r * 1.6} ${y + r * 1.5} Z" fill="${color}"/>`;
  // 돋보기: (x, y) 는 렌즈 가운데
  const lens = (x, y, r, color = C.blue, fill = 'none') => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="${color}" stroke-width="${f(r * 0.28)}"/><path d="M${f(x + r * 0.72)} ${f(y + r * 0.72)} L${f(x + r * 1.6)} ${f(y + r * 1.6)}" stroke="${color}" stroke-width="${f(r * 0.4)}" stroke-linecap="round"/>`;
  // 인터넷 창: 맨 위 띠(점 셋, addr 가 있으면 주소 칸)
  const browser = (x, y, w, h, { barH = 32, addr = null, dots = true } = {}) =>
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="white" stroke="${C.ink}" stroke-width="3"/>`
    + `<path d="M${x + 1.5} ${y + barH} V${y + 12} Q${x + 1.5} ${y + 1.5} ${x + 12} ${y + 1.5} H${x + w - 12} Q${x + w - 1.5} ${y + 1.5} ${x + w - 1.5} ${y + 12} V${y + barH} Z" fill="${C.sky}"/>`
    + `<path d="M${x} ${y + barH} H${x + w}" stroke="${C.ink}" stroke-width="2.5"/>`
    + (dots ? [0, 1, 2].map((i) => `<circle cx="${x + 18 + i * 15}" cy="${y + barH / 2}" r="5" fill="${[C.red, C.yellow, C.green][i]}"/>`).join('') : '')
    + (addr ? `<rect x="${addr[0]}" y="${y + 7}" width="${addr[1]}" height="${barH - 14}" rx="${(barH - 14) / 2}" fill="white" stroke="${C.line}" stroke-width="2"/>` : '');
  // 검색 칸: 둥근 네모 칸과 오른쪽 돋보기 단추(.btn)
  const searchBox = (x, y, w, h) => {
    const r = h / 2 - 5, bx = x + w - h / 2, by = y + h / 2;
    return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2}" fill="white" stroke="${C.blue}" stroke-width="3"/>`
      + `<g class="btn"><circle cx="${bx}" cy="${by}" r="${r}" fill="${C.blue}"/>${lens(bx - r * 0.18, by - r * 0.18, r * 0.42, 'white')}</g>`;
  };

  // ── 3단원: 유형(섞인 발표 자료가 글·표나 그래프·영상·그림이나 사진 네 묶음으로 모인다) ──────────────────────────────
  const docIcon = (cx, cy) => `<rect x="${cx - 22}" y="${cy - 28}" width="44" height="56" rx="5" fill="white" stroke="${C.blue}" stroke-width="3"/>` + [-16, -5, 6, 17].map((d, i) => bar(cx - 14, cy + d, i === 3 ? 18 : 28, C.blue, 5)).join('');
  const graphIcon = (cx, cy, v) => `<rect x="${cx - 30}" y="${cy - 25}" width="60" height="50" rx="5" fill="white" stroke="${C.orange}" stroke-width="3"/>`
    + (v ? `<path d="M${cx - 30} ${cy - 8} H${cx + 30} M${cx - 30} ${cy + 8} H${cx + 30} M${cx - 10} ${cy - 25} V${cy + 25} M${cx + 10} ${cy - 25} V${cy + 25}" stroke="${C.orange}" stroke-width="2.5"/>`
      : `<rect x="${cx - 20}" y="${cy - 2}" width="10" height="20" fill="${C.orange}"/><rect x="${cx - 5}" y="${cy - 16}" width="10" height="34" fill="${C.orange}"/><rect x="${cx + 10}" y="${cy + 4}" width="10" height="14" fill="${C.orange}"/>`);
  const videoIcon = (cx, cy) => `<rect x="${cx - 31}" y="${cy - 23}" width="62" height="46" rx="7" fill="${C.lilac}" stroke="${C.purple}" stroke-width="3"/><path d="M${cx - 8} ${cy - 12} L${cx + 13} ${cy} L${cx - 8} ${cy + 12} Z" fill="${C.purple}"/>`;
  const picIcon = (cx, cy) => `<rect x="${cx - 30}" y="${cy - 25}" width="60" height="50" rx="5" fill="white" stroke="${C.green}" stroke-width="3"/><path d="M${cx - 26} ${cy + 21} L${cx - 9} ${cy - 2} L${cx + 3} ${cy + 11} L${cx + 12} ${cy + 3} L${cx + 26} ${cy + 21} Z" fill="${C.mint}" stroke="${C.green}" stroke-width="2.5" stroke-linejoin="round"/><circle cx="${cx + 14}" cy="${cy - 11}" r="6" fill="${C.yellow}"/>`;
  (function () {
    const id = 't51-k2-yuhyeong';
    let css = base(id);
    const bins = [[89, '글', C.blue, C.sky], [243, '표나 그래프', C.orange, C.peach], [397, '영상', C.purple, C.lilac], [551, '그림이나 사진', C.green, C.mint]];
    const icons = [(x, y) => docIcon(x, y), (x, y) => docIcon(x, y), (x, y) => graphIcon(x, y, 0), (x, y) => graphIcon(x, y, 1), (x, y) => videoIcon(x, y), (x, y) => videoIcon(x, y), (x, y) => picIcon(x, y), (x, y) => picIcon(x, y)];
    const scatter = [[300, 172], [520, 252], [92, 228], [400, 82], [200, 92], [566, 124], [430, 262], [160, 296]];
    const tilt = [-12, 10, -8, 14, 8, -14, 12, -6];
    let body = `<g class="b1 h2">${g('fin fin1', text(320, 36, '발표 자료', { size: 20, color: C.muted }))}</g>`;
    // 칸 2: 묶음 칸
    body += bins.map(([x, label, col, soft], k) => at(2, 'fin', `<rect x="${x - 70}" y="112" width="140" height="196" rx="14" fill="${soft}" opacity=".55"/><rect x="${x - 70}" y="112" width="140" height="196" rx="14" fill="none" stroke="${col}" stroke-width="3"/>`, k * 0.1)
      + at(2, 'pop', `<g class="lb lb${k}">${text(x, 290, label, { size: 19, color: col === C.yellow ? C.ink : C.ink })}</g>`, 1.4 + k * 0.12)).join('');
    icons.forEach((draw, k) => {
      const bx = bins[k >> 1][0], by = (k & 1) ? 226 : 162;
      const [sx, sy] = scatter[k];
      body += `<g class="cd cd${k}">` + at(1, 'pop', draw(bx, by), 0.2 + k * 0.12) + '</g>';
      css += `.sc-${id} .cd${k} { transform-box: fill-box; transform-origin: center; transform: translate(${sx - bx}px, ${sy - by}px) rotate(${tilt[k]}deg); transition: transform 1s ease-in-out ${0.2 + (k >> 1) * 0.25 + (k & 1) * 0.1}s; }
        .on2 .sc-${id} .cd${k} { transform: none; }`;
    });
    // 칸 3: 갈래 하나하나가 유형
    body += bins.map(([x], k) => drawLine(`M320 57 Q${f((320 + x) / 2)} 66 ${x} 108`, C.green, 3, { width: 3.5, delay: 0.4 + k * 0.1 })).join('');
    body += at(3, 'drop', tag(320, 40, '유형', ROLE.p, 24), 0.1);
    body += bins.map(([x, , col], k) => glowRect(x - 74, 108, 148, 204, 3, col, 1.2 + k * 0.2)).join('');
    css += bins.map((_, k) => pulseCss(id, `.lb${k}`, 3, 1.3 + k * 0.2)).join('');
    put(K + '3/유형', svg(id, body, css));
  })();

  // ── 3단원: 수치(「백두산 화산 분화 현황」 — 세어서 얻은 횟수가 반짝이고 막대그래프가 된다) ──────────────────────────────
  (function () {
    const id = 't51-k2-suchi';
    let css = base(id);
    const D = [[900, 3], [1000, 7], [1100, 3], [1200, 3], [1300, 1], [1400, 5], [1500, 2], [1600, 3], [1700, 1], [1800, 1], [1900, 2]];
    const cx = (i) => 82 + 52 * i;
    let grid = 'M8 26 H628 V104 H8 Z M56 26 V104 M8 62 H628';
    for (let i = 1; i < D.length; i++) grid += ` M${56 + 52 * i} 26 V104`;
    let body = drawLine(grid, C.ink, 1, { width: 2.5 });
    body += at(1, 'fin', text(32, 51, '시기', { size: 18, color: C.muted }) + text(32, 91, '횟수', { size: 18, color: C.muted }), 0.6);
    D.forEach(([yr, v], i) => {
      body += at(1, 'fin', text(cx(i), 51, yr, { size: 18, weight: 600 }), 0.7 + i * 0.05);
      body += `<g class="b2"><rect class="flash flash2" x="${cx(i) - 19}" y="66" width="38" height="34" rx="8" fill="${C.yellow}" fill-opacity=".45" style="animation-delay:${f(0.2 + i * 0.13)}s"/></g>`;
      body += at(1, 'fin', `<g class="ct ct${i}">${text(cx(i), 92, v, { size: 22, color: C.orange })}</g>`, 1 + i * 0.05);
      css += pulseCss(id, `.ct${i}`, 2, f(0.2 + i * 0.13));
    });
    // 칸 3: 막대그래프
    body += drawLine('M52 128 V322 H630', C.ink, 3, { width: 3 });
    D.forEach(([, v], i) => {
      const h = 26 * v;
      body += `<g class="b3"><g class="br br${i}"><rect x="${cx(i) - 15}" y="${322 - h}" width="30" height="${h}" rx="3" fill="${C.blue}"/></g></g>`;
      css += growCss(id, `.br${i}`, 3, { axis: 'Y', origin: 'center bottom', delay: 0.3 + i * 0.1, dur: 0.6 });
      body += at(3, 'fin', text(cx(i), 322 - h - 8, v, { size: 18, color: C.blue }), 0.9 + i * 0.1);
    });
    css += `.sc-${id} .br1 rect { transition: fill .5s ease; } .on3 .sc-${id} .br1 rect { fill: ${C.orange}; transition-delay: 2s; }`;
    body += `<g class="b3"><circle class="ring ring3" cx="${cx(1)}" cy="124" r="22" fill="none" stroke="${C.orange}" stroke-width="3" style="animation-delay:1.9s"/></g>`;
    // 칸 4: 수치
    body += glowRect(56, 64, 572, 38, 4, C.green, 0.1, 8) + at(4, 'pop', tag(560, 196, '수치', ROLE.p, 24), 0.5);
    css += D.map((_, i) => pulseCss(id, `.ct${i}`, 4, 0.4)).join('');
    put(K + '3/수치', svg(id, body, css));
  })();

  // ── 3단원: 개요(「수현이의 발표」 개요 — 처음·가운데·끝 뼈대에 말할 내용이 채워진다) ──────────────────────────────
  (function () {
    const id = 't51-k2-gaeyo';
    let css = base(id);
    let body = at(1, 'fin', `<rect x="140" y="16" width="470" height="314" rx="12" fill="white" stroke="${C.ink}" stroke-width="3"/>`
      + `<path d="M140 66 H610 M140 132 H610 M140 258 H610 M250 66 V330" stroke="${C.line}" stroke-width="2.5"/>`);
    body += at(1, 'fin', tag(186, 41, '주제', ROLE.p, 19) + text(228, 48, '윌리엄 길버트', { size: 20, anchor: 'start' }), 0.3);
    const rows = [['처음', 99], ['가운데', 195], ['끝', 294]];
    body += rows.map(([label, y], k) => at(1, 'pop', tag(195, y, label, ROLE.s, 19), 0.6 + k * 0.25)).join('');
    const say = [['소개할 인물 밝히기', 99], ['사람들의 잘못된 생각', 166], ['길버트가 직접 한 실험', 224], ['대단하다고 말하는 까닭', 294]];
    body += '<g class="b1 h2">' + say.map(([, y], i) => g('fin fin1', `<rect x="280" y="${y - 20}" width="300" height="40" rx="10" fill="none" stroke="${C.line}" stroke-width="2.5" stroke-dasharray="8 7"/>`, 1.2 + i * 0.1)).join('') + '</g>';
    body += say.map(([label, y], i) => at(2, 'pop', `<g class="sy sy${i}">${tile(430, y, label, { size: 20, h: 42, w: 300, fill: TAN, stroke: C.orange })}</g>`, 0.3 + i * 0.4)).join('');
    // 칸 3: 발표하는 사람이 뼈대를 차례로 따라간다
    body += at(3, 'pop', person(64, 214, C.purple, 20));
    body += `<g class="b3"><g class="snd">` + [0, 1].map((i) => `<path d="M${96 + i * 9} ${170 - i * 6} Q${104 + i * 11} ${180} ${96 + i * 9} ${190 + i * 6}" stroke="${C.purple}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`).join('') + '</g></g>';
    css += `@keyframes ${id}-snd { 0%, 100% { opacity: .2; } 50% { opacity: 1; } } .on3 .sc-${id} .snd { animation: ${id}-snd .8s ease-in-out infinite; }`;
    body += drawLine('M124 99 V294', C.orange, 3, { width: 4, delay: 0.1 });
    body += `<g class="b3">` + rows.map(([, y]) => `<circle cx="124" cy="${y}" r="5" fill="${C.orange}"/>`).join('') + `<g class="mk"><circle cx="124" cy="99" r="11" fill="white" stroke="${C.orange}" stroke-width="4"/></g></g>`;
    css += `@keyframes ${id}-mk { 0%, 12% { transform: none; } 38%, 58% { transform: translateY(96px); } 84%, 100% { transform: translateY(195px); } }
      .on3 .sc-${id} .mk { animation: ${id}-mk 3s ease-in-out .4s both; }`;
    css += paint(id, '.sy0', ROLE.p, 3, 0.5) + paint(id, '.sy1', ROLE.p, 3, 1.4) + paint(id, '.sy2', ROLE.p, 3, 1.5) + paint(id, '.sy3', ROLE.p, 3, 2.3);
    body += glowRect(136, 12, 478, 322, 4, C.green, 0.2) + at(4, 'pop', tag(64, 60, '개요', ROLE.p, 22), 0.5);
    put(K + '3/개요', svg(id, body, css));
  })();

  // ── 3단원: 다수결(체험 학습 장소 — 손든 사람을 세어 더 많은 쪽으로 정한다) ──────────────────────────────
  (function () {
    const id = 't51-k2-dasugyeol';
    let css = base(id);
    let body = at(1, 'pop', `<g class="bdL"><rect class="bgL" x="40" y="20" width="240" height="56" rx="12" fill="white" stroke="${C.blue}" stroke-width="3"/>${text(160, 57, '과학관', { size: 26 })}</g>`);
    body += `<g class="dim dim3">` + at(1, 'pop', `<rect x="360" y="20" width="240" height="56" rx="12" fill="white" stroke="${C.orange}" stroke-width="3"/>${text(480, 57, '박물관', { size: 26 })}`, 0.2) + '</g>';
    css += `.sc-${id} .bgL { transition: fill .5s ease .3s, stroke .5s ease .3s; } .on3 .sc-${id} .bgL { fill: ${C.mint}; stroke: ${C.green}; }`;
    // 사람: 처음엔 섞여 앉았다가 칸 2에 찬성하는 쪽으로 가서 손을 든다
    const L = [], R = [];
    [190, 248, 306].forEach((y, r) => [64, 110, 156, 202, 248].forEach((x, c) => { if (r < 2 || c < 3) L.push([x, y]); }));
    [190, 248].forEach((y) => [412, 458, 504, 550].forEach((x) => R.push([x, y])));
    const pat = 'LRLLRLLRLLRLRLLRLLRLR';
    const slots = [];
    [190, 248, 306].forEach((y) => [200, 240, 280, 320, 360, 400, 440].forEach((x) => slots.push([x, y])));
    let li = 0, ri = 0;
    [...pat].forEach((side, s) => {
      const left = side === 'L';
      const [x, y] = left ? L[li++] : R[ri++];
      const k = s, col = left ? C.blue : C.orange;
      body += `<g class="pp pp${k}">` + at(1, 'pop', `<circle class="hd" cx="${x}" cy="${y - 24}" r="10" fill="${C.muted}"/><path class="bd" d="M${x - 16} ${y + 15} Q${x - 16} ${y} ${x} ${y} Q${x + 16} ${y} ${x + 16} ${y + 15} Z" fill="${C.muted}"/>`
        + `<path class="draw draw2 arm" pathLength="1" d="M${x + 10} ${y + 2} L${x + 14} ${y - 34}" stroke="${col}" stroke-width="5" stroke-linecap="round" style="transition-delay:${f(1.3 + s * 0.03)}s"/>`, 0.2 + s * 0.04) + '</g>';
      const [sx, sy] = slots[s];
      css += `.sc-${id} .pp${k} { transform: translate(${sx - x}px, ${sy - y}px); transition: transform 1s ease-in-out ${f(0.1 + s * 0.02)}s; }
        .on2 .sc-${id} .pp${k} { transform: none; }
        .on2 .sc-${id} .pp${k} .hd, .on2 .sc-${id} .pp${k} .bd { fill: ${col}; }`;
    });
    css += `.sc-${id} .hd, .sc-${id} .bd { transition: fill .5s ease .9s; }`;
    // 표 세기: 다섯씩 묶음
    const tally = (x0, n, col, d0) => {
      let s = '', k = 0;
      for (let gi = 0; gi * 5 < n; gi++) {
        const x = x0 + gi * 52, m = Math.min(5, n - gi * 5);
        for (let j = 0; j < Math.min(4, m); j++, k++) s += drawLine(`M${x + j * 9} 92 V124`, col, 2, { width: 3.5, delay: f(d0 + k * 0.05) });
        if (m === 5) { s += drawLine(`M${x - 5} 120 L${x + 32} 96`, col, 2, { width: 3.5, delay: f(d0 + k * 0.05) }); k++; }
      }
      return s;
    };
    body += tally(56, 13, C.blue, 1.0) + tally(376, 8, C.orange, 1.0);
    body += at(2, 'pop', text(240, 118, '13명', { size: 24, color: C.blue }), 1.9) + at(2, 'pop', text(504, 118, '8명', { size: 24, color: C.orange }), 1.9);
    // 칸 3: 더 많은 쪽으로 정한다
    body += at(3, 'pop', text(320, 120, '>', { size: 34, color: C.ink }), 0.2) + at(3, 'pop', check(320, 48, 12), 0.8);
    body += `<g class="b3"><rect class="ring ring3" x="40" y="20" width="240" height="56" rx="12" fill="none" stroke="${C.green}" stroke-width="3" style="animation-delay:1s"/></g>`;
    body += glowRect(34, 14, 252, 68, 4, C.green, 0.2) + at(4, 'pop', tag(320, 326, '다수결', ROLE.p, 24), 0.5);
    put(K + '3/다수결', svg(id, body, css));
  })();

  // ── 매체 단원: 검색 도구(검색 칸에 낱말을 넣고 단추를 누르면 자료를 찾아 보여 준다) ──────────────────────────────
  (function () {
    const id = 't51-k2-gsdogu';
    let css = base(id);
    let body = at(1, 'fin', browser(30, 14, 580, 300));
    body += at(1, 'pop', `<g class="sb">${searchBox(110, 76, 420, 52)}</g>`, 0.4);
    css += pulseCss(id, '.sb', 1, 1);
    // 칸 2: 낱말이 찍히고 단추를 누른다
    const tc = typeCover(id, 'cv', 130, 82, 230, 40, 2, { delay: 0.2, steps: 6 });
    body += `<g class="b2">${text(136, 111, '드론 조종사', { size: 24, anchor: 'start' })}${tc.body}</g>`;
    css += tc.css + pulseCss(id, '.btn', 2, 1.5);
    body += `<g class="b2"><circle class="ring ring2" cx="504" cy="102" r="21" fill="none" stroke="${C.blue}" stroke-width="3" style="animation-delay:1.6s"/></g>`;
    // 칸 3: 찾은 자료가 줄줄이 나온다
    const ic = [C.orange, C.green, C.purple, C.blue];
    [166, 204, 242, 280].forEach((y, i) => {
      body += at(3, 'slide', `<rect x="70" y="${y - 15}" width="30" height="30" rx="6" fill="${ic[i]}" opacity=".85"/>` + bar(114, y - 6, [260, 220, 300, 240][i], C.blue, 10) + bar(114, y + 9, [380, 330, 400, 350][i], C.line, 8), 0.6 + i * 0.25);
    });
    body += `<g class="b3"><g class="lz">${lens(504, 102, 15, C.orange)}</g></g>`;
    css += `@keyframes ${id}-lz { 0% { opacity: 0; transform: none; } 15% { opacity: 1; } 50% { transform: translate(-60px, 80px); } 100% { opacity: 1; transform: translate(-30px, 170px); } }
      .on3 .sc-${id} .lz { animation: ${id}-lz 1.8s ease-in-out .1s both; }`;
    body += glowRect(26, 10, 588, 308, 4, C.blue, 0.2) + at(4, 'pop', tag(320, 338, '검색 도구', ROLE.s, 22), 0.5);
    put(K + 'media/검색 도구', svg(id, body, css));
  })();

  // ── 매체 단원: 검색어('드론'만 넣으면 엉뚱한 자료가 쏟아지고, 자세히 쓰면 알맞은 자료가 나온다) ──────────────────────────────
  (function () {
    const id = 't51-k2-gsword';
    let css = base(id);
    let body = at(1, 'fin', browser(30, 14, 580, 300)) + at(1, 'fin', searchBox(56, 70, 528, 52), 0.2);
    const chips = row(['드론', '조종사가', '하는 일'], { y: 96, x0: 74, size: 22, gap: 10 });
    const chip = (p) => tile(p.cx, p.y, p.label, { size: 22, h: 38, w: p.w, fill: C.sky, stroke: C.blue, sw: 2.5 });
    body += at(1, 'drop', chip(chips[0]), 0.6);
    // 칸 2: 너무 많고 엉뚱한 자료
    const many = ['드론 가격', '드론 쇼', '드론 장난감', '드론 대회', '드론 수리점', '드론 사진'];
    body += `<g class="b2"><g class="many"><g class="mshake">` + many.map((label, i) => g('pop pop2', tile(i % 2 ? 455 : 185, 170 + (i >> 1) * 54, label, { size: 19, h: 42, w: 250, fill: 'white', stroke: C.line }), 0.2 + i * 0.15)).join('')
      + `<rect x="596" y="138" width="6" height="168" rx="3" fill="${C.line}"/><rect x="596" y="138" width="6" height="22" rx="3" fill="${C.muted}"/></g></g></g>`;
    css += `.on2 .sc-${id} .mshake { animation: ${id}-shake .5s ease-in-out 1.4s 2; }
      .sc-${id} .many { transition: transform .8s ease-in, opacity .6s ease; }
      .on3 .sc-${id} .many { transform: translateY(40px); opacity: 0; }`;
    // 칸 3: 낱말을 더 붙여 자세히 쓴다
    body += at(3, 'slide', chip(chips[1]), 0.5) + at(3, 'slide', chip(chips[2]), 0.8);
    body += at(3, 'pop', tile(320, 206, '드론 조종사가 하는 일', { size: 20, h: 44, w: 360, fill: C.mint, stroke: C.green }) + check(530, 206, 11), 1.3);
    body += at(3, 'pop', tile(320, 262, '드론 조종사 직업 소개', { size: 20, h: 44, w: 360, fill: C.mint, stroke: C.green }) + check(530, 262, 11), 1.6);
    body += glowRect(chips[0].l - 6, 72, chips[2].r - chips[0].l + 12, 48, 4, C.blue, 0.1, 12) + at(4, 'pop', `<g class="kw">${tag(230, 152, '검색어', ROLE.s, 22)}</g>`, 0.5);
    css += pulseCss(id, '.kw', 4, 1);
    put(K + 'media/검색어', svg(id, body, css));
  })();

  // ── 매체 단원: 통합 검색(찾은 자료가 뉴스·이미지·동영상·사전 칸으로 나뉘어 한 화면에 모인다) ──────────────────────────────
  (function () {
    const id = 't51-k2-tonghap';
    let css = base(id);
    let body = at(1, 'fin', browser(20, 14, 600, 332)) + at(1, 'fin', searchBox(120, 58, 320, 44), 0.2);
    const tc = typeCover(id, 'cv', 138, 64, 160, 32, 1, { delay: 0.6, steps: 6 });
    body += `<g class="b1">${text(142, 88, '드론 조종사', { size: 22, anchor: 'start' })}${tc.body}</g>`;
    css += tc.css + pulseCss(id, '.btn', 1, 1.8);
    body += `<g class="b1"><circle class="ring ring1" cx="418" cy="80" r="18" fill="none" stroke="${C.blue}" stroke-width="3" style="animation-delay:1.9s"/></g>`;
    // 칸 2: 갈래 이름 줄과 네 칸
    const tabs = row(['통합', '뉴스', '이미지', '동영상', '사전'], { y: 124, x0: 36, size: 18, gap: 10 });
    body += tabs.map((p, i) => at(2, 'fin', `<g class="tb tb${i}">${tag(p.cx, p.y, p.label, ['white', C.line], 18)}</g>`, 0.1 + i * 0.08)).join('');
    const S = [['뉴스', 36, 146, C.blue], ['이미지', 324, 146, C.green], ['동영상', 36, 246, C.purple], ['사전', 324, 246, C.orange]];
    const inner = [
      (x, y) => [44, 62, 80].map((d, i) => `<circle cx="${x + 22}" cy="${y + d}" r="4" fill="${C.blue}"/>` + bar(x + 34, y + d, [220, 186, 206][i], i ? C.line : C.blue, 9)).join(''),
      (x, y) => [0, 1, 2, 3].map((j) => { const X = x + 16 + j * 64, Y = y + 34; return `<rect x="${X}" y="${Y}" width="54" height="48" rx="5" fill="${C.mint}"/><path d="M${X + 4} ${Y + 44} L${X + 18} ${Y + 24} L${X + 28} ${Y + 34} L${X + 36} ${Y + 28} L${X + 50} ${Y + 44} Z" fill="${C.green}" opacity=".7"/><circle cx="${X + 40}" cy="${Y + 12}" r="5" fill="${C.yellow}"/>`; }).join(''),
      (x, y) => [0, 1].map((j) => { const X = x + 16 + j * 128, Y = y + 34; return `<rect x="${X}" y="${Y}" width="118" height="50" rx="6" fill="${C.lilac}"/><path d="M${X + 50} ${Y + 13} L${X + 72} ${Y + 25} L${X + 50} ${Y + 37} Z" fill="${C.purple}"/>`; }).join(''),
      (x, y) => `<rect x="${x + 18}" y="${y + 34}" width="40" height="50" rx="4" fill="${C.peach}" stroke="${C.orange}" stroke-width="2.5"/><rect x="${x + 18}" y="${y + 34}" width="9" height="50" rx="3" fill="${C.orange}"/>` + [46, 62, 78].map((d, i) => bar(x + 74, y + d, [190, 160, 176][i], i ? C.line : C.orange, 9)).join('')
    ];
    S.forEach(([label, x, y, col], i) => {
      body += `<g class="b2"><g class="sec sec${i}"><rect x="${x}" y="${y}" width="280" height="92" rx="10" fill="white" stroke="${col}" stroke-width="2.5"/>${text(x + 14, y + 24, label, { size: 18, color: col, anchor: 'start' })}${inner[i](x, y)}</g></g>`;
      const dx = 280 - (x + 140), dy = 80 - (y + 46);
      css += `.sc-${id} .sec${i} { transform-box: fill-box; transform-origin: center; transform: translate(${dx}px, ${dy}px) scale(.15); opacity: 0; transition: transform .9s ease-out ${f(0.3 + i * 0.25)}s, opacity .4s ease ${f(0.3 + i * 0.25)}s; }
        .on2 .sc-${id} .sec${i} { transform: none; opacity: 1; }`;
    });
    // 칸 3: 한 화면에 모아 보여 주는 방식
    css += paint(id, '.tb0', ROLE.p, 3, 0.2) + pulseCss(id, '.tb0', 3, 0.3);
    body += S.map(([, x, y, col], i) => glowRect(x - 3, y - 3, 286, 98, 3, col, 0.6 + i * 0.3, 12)).join('');
    body += at(3, 'pop', tag(538, 80, '통합 검색', ROLE.p, 22), 0.4);
    put(K + 'media/통합 검색', svg(id, body, css));
  })();

  // ── 매체 단원: 누리집(주소 띠로 들어가면 축제를 연 사람들이 차려 둔 화면 — 인터넷 세상의 집) ──────────────────────────────
  (function () {
    const id = 't51-k2-nurijip';
    let css = base(id);
    // 칸 3에 얹힐 지붕(창 뒤에 깔린다)
    let body = `<g class="b3">${g('fin fin3', `<path d="M104 76 L350 16 L596 76 Z" fill="${C.peach}"/><rect x="488" y="22" width="24" height="34" fill="${C.orange}"/>`, 0.9)}</g>`;
    body += drawLine('M104 76 L350 16 L596 76', C.orange, 3, { width: 6, delay: 0.1 });
    body += at(1, 'fin', browser(120, 70, 460, 260, { barH: 42, dots: false, addr: [132, 436] }));
    const tc = typeCover(id, 'cv', 146, 80, 200, 26, 1, { delay: 0.7, steps: 7 });
    body += `<g class="b1">${text(150, 99, 'www.○○축제.kr', { size: 18, anchor: 'start', weight: 600 })}${tc.body}</g>`;
    css += tc.css;
    body += at(1, 'pop', tag(58, 91, '주소', ROLE.s, 19), 1.6) + drawArrow(96, 91, 126, 91, C.blue, 1, { width: 3.5, delay: 1.7 });
    body += glowRect(130, 75, 440, 32, 1, C.blue, 1.9, 16);
    // 칸 2: 화면이 열린다
    let page = `<rect x="122" y="113.5" width="456" height="46" fill="${C.mint}"/>` + text(350, 145, '○○ 축제', { size: 24 });
    page += [['일정', 214], ['사진', 314], ['게시판', 424]].map(([l, x]) => tag(x, 184, l, ROLE.s, 19)).join('');
    page += `<rect x="150" y="210" width="176" height="104" rx="8" fill="${C.sky}"/><path d="M156 308 L206 256 L240 286 L262 268 L320 308 Z" fill="${C.green}" opacity=".7"/>`
      + [[196, 236], [232, 228], [272, 238]].map(([x, y], i) => `<path d="M${x} 210 V${y - 12}" stroke="${C.muted}" stroke-width="2"/><ellipse cx="${x}" cy="${y}" rx="11" ry="13" fill="${[C.red, C.orange, C.yellow][i]}"/>`).join('');
    page += [226, 248, 270, 292].map((y, i) => bar(348, y, [200, 170, 196, 140][i])).join('');
    body += `<g class="b2"><g class="pg">${page}</g></g>`;
    css += `.sc-${id} .pg { transform: translateY(30px); opacity: 0; transition: transform .8s ease-out .2s, opacity .6s ease .2s; }
      .on2 .sc-${id} .pg { transform: none; opacity: 1; }`;
    // 칸 3: 지붕을 얹으니 집. 누리(세상) + 집
    body += at(3, 'pop', `<circle cx="58" cy="196" r="32" fill="${C.sky}" stroke="${C.blue}" stroke-width="3"/><ellipse cx="58" cy="196" rx="13" ry="32" fill="none" stroke="${C.blue}" stroke-width="2.5"/><path d="M26 196 H90 M32 180 H84 M32 212 H84" stroke="${C.blue}" stroke-width="2.5"/>`, 1.2);
    body += at(3, 'pop', tag(58, 256, '누리', ROLE.s, 20), 1.5) + at(3, 'pop', tag(350, 52, '집', ROLE.o, 20), 1.6);
    body += glowRect(114, 64, 472, 272, 4, C.green, 0.2) + at(4, 'pop', tag(58, 318, '누리집', ROLE.p, 22), 0.5);
    put(K + 'media/누리집', svg(id, body, css));
  })();

  // ── 4단원: 글의 구조(설명하는 글을 짜는 틀 — 열거·순서·비교와 대조) ──────────────────────────────
  // 왼쪽 글 종이(같은 틀): x 18~254, y 20~340
  const paper = () => `<rect x="18" y="20" width="236" height="320" rx="10" fill="white" stroke="${C.line}" stroke-width="3"/>`;
  // 신호 낱말 조각(왼쪽 x 에서 시작)
  const sig = (x, y, label, cls) => { const w = wOf(label, 18); return { cx: x + w / 2, r: x + w, svg: `<g class="${cls}">${tile(x + w / 2, y, label, { size: 18, h: 28, w, rx: 8, sw: 2.5 })}</g>` }; };
  (function () {
    const id = 't51-k2-gujo';
    let css = base(id);
    let lines = '';
    for (let i = 0; i < 13; i++) { const y = 80 + i * 20, ind = i % 4 === 0; lines += bar(ind ? 42 : 30, y, i % 4 === 3 ? 130 : (ind ? 192 : 204)); }
    let body = `<g class="dim dim3">` + at(1, 'fin', paper() + text(136, 52, '설명하는 글', { size: 19, color: C.muted })) + at(1, 'fin', lines, 0.3) + '</g>';
    body += `<g class="b1"><g class="lz">${lens(70, 110, 20, C.orange, 'rgba(255,255,255,.35)')}</g></g>`;
    css += `@keyframes ${id}-lz { 0% { transform: none; } 33% { transform: translate(110px, 70px); } 66% { transform: translate(20px, 140px); } 100% { transform: translate(120px, 190px); } }
      .on1 .sc-${id} .lz { animation: ${id}-lz 2.4s ease-in-out .6s both; }
      .sc-${id} .lz { transition: opacity .4s ease; } .on2 .sc-${id} .lz { opacity: 0; }`;
    // 칸 2: 세 가지 틀
    const R = [['열거', 75, ROLE.s], ['순서', 180, ROLE.o], ['비교와 대조', 285, ROLE.x]];
    R.forEach(([label, y, col], k) => { body += at(2, 'slide', `<g class="lb lb${k}">${tag(336, y, label, col, 19)}</g>`, 0.2 + k * 0.5); });
    // 열거: 하나에서 셋이 나란히
    body += at(2, 'pop', `<rect x="470" y="38" width="60" height="26" rx="6" fill="${C.mint}" stroke="${C.green}" stroke-width="2.5"/>`, 0.4);
    body += drawLine('M500 64 V74 H440 V86 M500 74 V86 M500 74 H560 V86', C.blue, 2, { width: 3, delay: 0.5 });
    body += [440, 500, 560].map((x, i) => at(2, 'pop', `<rect x="${x - 24}" y="86" width="48" height="26" rx="6" fill="white" stroke="${C.blue}" stroke-width="2.5"/>`, 1 + i * 0.1)).join('');
    // 순서: 1 → 2 → 3
    body += [430, 510, 590].map((x, i) => at(2, 'pop', `<rect x="${x - 23}" y="160" width="46" height="40" rx="8" fill="white" stroke="${C.orange}" stroke-width="2.5"/>` + text(x, 187, i + 1, { size: 20, color: C.orange }), 0.7 + i * 0.2)).join('');
    body += drawArrow(456, 180, 484, 180, C.orange, 2, { width: 3.5, delay: 0.8 }) + drawArrow(536, 180, 564, 180, C.orange, 2, { width: 3.5, delay: 1.0 });
    // 비교와 대조: 둘을 나란히 놓고 같다·다르다
    body += at(2, 'pop', `<rect x="418" y="257" width="64" height="56" rx="8" fill="${C.lilac}" stroke="${C.purple}" stroke-width="2.5"/><rect x="538" y="257" width="64" height="56" rx="8" fill="${C.lilac}" stroke="${C.purple}" stroke-width="2.5"/>`, 1.2);
    body += at(2, 'pop', text(510, 282, '=', { size: 26, color: C.green }), 1.5) + at(2, 'pop', text(510, 310, '≠', { size: 26, color: C.orange }), 1.7);
    // 칸 3: 이런 틀이 글의 구조
    body += glowRect(266, 24, 364, 312, 3, C.green, 0.3) + at(3, 'pop', `<g class="nm">${tag(136, 180, '글의 구조', ROLE.p, 24)}</g>`, 0.6);
    css += R.map((_, k) => pulseCss(id, `.lb${k}`, 3, 1 + k * 0.25)).join('') + pulseCss(id, '.nm', 3, 1.8);
    put(K + '4/글의 구조', svg(id, body, css));
  })();

  // ── 4단원: 열거 구조(「십장생」 — 첫째·둘째·셋째를 따라 특징이 나란히 늘어선다) ──────────────────────────────
  (function () {
    const id = 't51-k2-yeolgeo';
    let css = base(id);
    let body = at(1, 'fin', paper() + text(136, 52, '십장생', { size: 21 }));
    let lines = bar(42, 82, 192) + bar(30, 100, 204);
    const S = [['첫째,', 136], ['둘째,', 208], ['셋째,', 280]].map(([label, y], i) => ({ ...sig(30, y, label, `sg sg${i}`), y }));
    S.forEach((s) => { lines += bar(s.r + 8, s.y, 234 - s.r - 8) + bar(30, s.y + 20, 204) + bar(30, s.y + 38, 150); });
    body += at(1, 'fin', lines, 0.3) + at(1, 'fin', S.map((s) => s.svg).join(''), 0.5);
    css += S.map((_, i) => paint(id, `.sg${i}`, ROLE.s, 1, 0.9 + i * 0.4) + pulseCss(id, `.sg${i}`, 1, 0.9 + i * 0.4)).join('');
    // 칸 2: 십장생 아래로 세 특징이 하나씩 놓인다
    body += at(2, 'pop', tile(450, 60, '십장생', { size: 22, h: 46, w: 150, fill: C.mint, stroke: C.green }));
    body += drawLine('M450 83 V114 H326 V150 M450 114 V150 M450 114 H574 V150', C.green, 2, { width: 3.5, delay: 0.3 });
    const items = [['첫째', '열 가지', 326], ['둘째', '장수 상징', 450], ['셋째', '전통 예술', 574]];
    items.forEach(([n, label, x], i) => {
      body += at(2, 'pop', `<g class="it it${i}"><rect x="${x - 56}" y="150" width="112" height="92" rx="12" fill="white" stroke="${C.blue}" stroke-width="3"/>${text(x, 226, label, { size: 20 })}</g>`, 0.7 + i * 0.35);
      body += `<g class="b2"><g class="fl fl${i}">${text(x, 180, n, { size: 19, color: C.blue })}</g></g>`;
      css += `.sc-${id} .fl${i} { transform: translate(${f(S[i].cx - x)}px, ${S[i].y - 174}px); opacity: 0; transition: transform .9s ease-in-out ${f(0.4 + i * 0.35)}s, opacity .3s ease ${f(0.4 + i * 0.35)}s; }
        .on2 .sc-${id} .fl${i} { transform: none; opacity: 1; }`;
    });
    // 칸 3: 세 특징이 나란히
    body += drawLine('M272 254 Q272 266 284 266 H438 Q450 266 450 278 Q450 266 462 266 H616 Q628 266 628 254', C.blue, 3, { width: 3.5, delay: 0.2 });
    css += items.map((_, i) => pulseCss(id, `.it${i}`, 3, 1.2)).join('') + S.map((_, i) => pulseCss(id, `.sg${i}`, 3, 1.2)).join('');
    body += glowRect(266, 144, 368, 104, 4, C.green, 0.2) + at(4, 'pop', tag(450, 304, '열거 구조', ROLE.p, 22), 0.5);
    put(K + '4/열거 구조', svg(id, body, css));
  })();

  // ── 4단원: 순서 구조(「폐현수막으로 가방을 만드는 방법」 — 먼저·다음으로·그 뒤·마지막으로를 따라 단계가 차례로) ──────────────────────────────
  (function () {
    const id = 't51-k2-sunseo';
    let css = base(id);
    let body = at(1, 'fin', paper() + text(136, 46, '폐현수막으로', { size: 18 }) + text(136, 68, '가방을 만드는 방법', { size: 18 }));
    const S = [['먼저,', 106], ['다음으로,', 172], ['그 뒤,', 238], ['마지막으로,', 304]].map(([label, y], i) => ({ ...sig(30, y, label, `sg sg${i}`), y }));
    let lines = '';
    S.forEach((s, i) => { lines += bar(s.r + 8, s.y, 234 - s.r - 8) + bar(30, s.y + 20, i === 3 ? 150 : 204) + (i < 3 ? bar(30, s.y + 38, 120) : ''); });
    body += at(1, 'fin', lines, 0.3) + at(1, 'fin', S.map((s) => s.svg).join(''), 0.5);
    css += S.map((_, i) => paint(id, `.sg${i}`, ROLE.o, 1, 0.9 + i * 0.35) + pulseCss(id, `.sg${i}`, 1, 0.9 + i * 0.35)).join('');
    // 칸 2: 단계 상자가 위에서 아래로
    const ys = [46, 120, 194, 268], steps = ['분리하기', '크기대로 자르기', '깨끗이 씻기', '바느질하기'];
    ys.forEach((y, k) => {
      body += at(2, 'pop', `<circle cx="318" cy="${y}" r="17" fill="${C.orange}"/>` + text(318, y + 7, k + 1, { size: 20, color: 'white' }), 0.2 + k * 0.55);
      body += at(2, 'pop', `<g class="st st${k}">${tile(480, y, steps[k], { size: 20, h: 46, w: 220, fill: 'white', stroke: C.orange })}</g>`, 0.3 + k * 0.55);
      if (k < 3) body += drawArrow(480, y + 27, 480, ys[k + 1] - 27, C.orange, 2, { width: 4, delay: 0.6 + k * 0.55 });
      css += pulseCss(id, `.sg${k}`, 2, 0.3 + k * 0.55);
    });
    // 칸 3: 점이 1단계부터 4단계까지 차례로 내려간다
    body += drawLine('M614 46 V268', C.line, 3, { width: 5 });
    body += `<g class="b3"><g class="mk"><circle cx="614" cy="46" r="10" fill="${C.orange}" stroke="white" stroke-width="3"/></g></g>`;
    css += `@keyframes ${id}-mk { 0%, 8% { transform: none; } 28%, 36% { transform: translateY(74px); } 56%, 64% { transform: translateY(148px); } 84%, 100% { transform: translateY(222px); } }
      .on3 .sc-${id} .mk { animation: ${id}-mk 2.6s ease-in-out .3s both; }`;
    css += ys.map((_, k) => paint(id, `.st${k}`, ROLE.p, 3, f(0.4 + k * 0.72))).join('');
    body += glowRect(296, 18, 334, 280, 4, C.green, 0.2) + at(4, 'pop', tag(480, 324, '순서 구조', ROLE.p, 22), 0.5);
    put(K + '4/순서 구조', svg(id, body, css));
  })();

  // ── 4단원: 비교와 대조 구조(「소나무와 잣나무」 — 같은 점은 한 띠로, 다른 점은 양쪽으로 갈린다) ──────────────────────────────
  (function () {
    const id = 't51-k2-bigyo';
    let css = base(id);
    let body = at(1, 'fin', paper() + text(136, 52, '소나무와 잣나무', { size: 20 }));
    const s1 = sig(30, 102, '모두', 'sg sgA'), s2 = sig(128, 156, '차이', 'sg sgB'), s3 = sig(30, 200, '반면,', 'sg sgC'), s4 = sig(30, 302, '공통점', 'sg sgD');
    let lines = bar(42, 82, 192) + bar(s1.r + 8, 102, 234 - s1.r - 8) + bar(30, 122, 150)
      + bar(42, 156, 78) + bar(s2.r + 8, 156, 234 - s2.r - 8) + bar(30, 176, 204) + bar(s3.r + 8, 200, 234 - s3.r - 8) + bar(30, 220, 204) + bar(30, 238, 120)
      + bar(42, 266, 192) + bar(30, 284, 120) + bar(s4.r + 8, 302, 234 - s4.r - 8) + bar(30, 322, 170);
    body += at(1, 'fin', lines, 0.3) + at(1, 'fin', s1.svg + s2.svg + s3.svg + s4.svg, 0.5);
    css += paint(id, '.sgA', ROLE.p, 1, 0.9) + paint(id, '.sgD', ROLE.p, 1, 1.1) + paint(id, '.sgB', ROLE.o, 1, 1.4) + paint(id, '.sgC', ROLE.o, 1, 1.6);
    // 칸 2: 두 나무와 같은 점
    body += at(2, 'pop', tile(420, 40, '소나무', { size: 20, h: 38, w: 124, stroke: C.green }), 0.1) + at(2, 'pop', tile(560, 40, '잣나무', { size: 20, h: 38, w: 124, stroke: C.green }), 0.3);
    body += at(2, 'pop', tag(305, 90, '공통점', ROLE.p, 18), 0.6);
    body += `<g class="b2"><g class="band"><rect x="358" y="68" width="264" height="44" rx="10" fill="${C.mint}" stroke="${C.green}" stroke-width="2.5"/>${text(490, 97, '상록수 · 침엽수', { size: 20 })}</g></g>`;
    css += growCss(id, '.band', 2, { origin: 'center', delay: 0.8, dur: 0.8 }) + pulseCss(id, '.sgA', 2, 0.6) + pulseCss(id, '.sgD', 2, 0.6);
    // 칸 3: 다른 점 — 잎 묶음과 껍질
    body += at(3, 'pop', tag(305, 146, '차이점', ROLE.o, 18), 0.1);
    body += at(3, 'fin', text(305, 202, '잎', { size: 19, color: C.muted }) + text(305, 278, '껍질', { size: 19, color: C.muted }), 0.2);
    const needles = (x, angs, d0) => angs.map((a, i) => { const r = a * Math.PI / 180; return drawLine(`M${x} 224 L${f(x + 62 * Math.cos(r))} ${f(224 + 62 * Math.sin(r))}`, C.green, 3, { width: 4, delay: f(d0 + i * 0.12) }); }).join('')
      + at(3, 'fin', `<rect x="${x - 5}" y="222" width="10" height="12" rx="2" fill="${C.orange}"/>`, d0);
    body += needles(406, [-102, -78], 0.3) + needles(546, [-126, -108, -90, -72, -54], 0.6);
    body += at(3, 'pop', text(450, 206, '2개', { size: 20, color: C.green }), 1.1) + at(3, 'pop', text(604, 206, '5개', { size: 20, color: C.green }), 1.4);
    let barkA = `<rect x="370" y="250" width="100" height="40" rx="6" fill="${C.peach}" stroke="${C.orange}" stroke-width="2.5"/>`
      + [384, 410, 436, 458].map((x, i) => `<path d="M${x} 252 l${i % 2 ? -5 : 6} 12 l${i % 2 ? 6 : -5} 12 l${i % 2 ? -4 : 5} 12" stroke="${C.orange}" stroke-width="3" fill="none" stroke-linejoin="round"/>`).join('')
      + `<path d="M372 270 H468" stroke="${C.orange}" stroke-width="2" stroke-dasharray="10 12"/>`;
    let barkB = `<rect x="510" y="250" width="100" height="40" rx="6" fill="${C.line}" stroke="${C.ink}" stroke-width="2.5"/>`;
    [262, 278].forEach((y, r) => { for (let x = 520 + (r ? 10 : 0); x < 604; x += 20) barkB += `<path d="M${x - 8} ${y} Q${x} ${y + 10} ${x + 8} ${y}" stroke="${C.ink}" stroke-width="2.5" fill="none"/>`; });
    body += at(3, 'pop', barkA, 1.6) + at(3, 'pop', barkB, 1.8);
    body += at(3, 'pop', text(490, 213, '≠', { size: 28, color: C.orange }), 1.4) + at(3, 'pop', text(490, 281, '≠', { size: 28, color: C.orange }), 1.9);
    css += pulseCss(id, '.sgB', 3, 0.3) + pulseCss(id, '.sgC', 3, 0.3);
    body += glowRect(264, 18, 366, 280, 4, C.green, 0.2) + at(4, 'pop', tag(490, 324, '비교와 대조 구조', ROLE.p, 20), 0.5);
    put(K + '4/비교와 대조 구조', svg(id, body, css));
  })();

  // ── 4단원: 요약(「자연재해, 알고 대처해요」 — 문단마다 중심 문장만 골라 처음·가운데·끝으로 모은다) ──────────────────────────────
  (function () {
    const id = 't51-k2-yoyak';
    let css = base(id);
    const P = [[72, 3, 0], [134, 3, 0], [196, 3, 0], [258, 3, 0], [316, 2, 1]];
    let lines = '', ul = '';
    const keyY = [];
    P.forEach(([y0, n, key], k) => {
      for (let j = 0; j < n; j++) {
        const y = y0 + j * 17, x = j === 0 ? 42 : 30, w = j === n - 1 ? 160 : (j === 0 ? 246 : 258);
        lines += bar(x, y, w, j === key ? '#8fa39b' : '#c4d3cc', 8);
        if (j === key) { ul += drawLine(`M${x} ${y + 8} H${x + w}`, C.orange, 2, { width: 3.5, delay: f(0.2 + k * 0.4) }); keyY.push(y); }
      }
    });
    let body = `<g class="dim dim4">` + at(1, 'fin', `<rect x="18" y="20" width="282" height="326" rx="10" fill="white" stroke="${C.line}" stroke-width="3"/>` + text(159, 46, '자연재해, 알고 대처해요', { size: 18 }))
      + `<g class="b1"><g class="ln">${lines}</g></g>` + ul + '</g>';
    css += growCss(id, '.ln', 1, { delay: 0.3, dur: 1.4 });
    // 칸 3: 오른쪽 짧은 정리
    body += at(3, 'fin', `<rect x="310" y="46" width="318" height="280" rx="14" fill="${C.mint}" opacity=".55"/>`);
    body += at(3, 'pop', tag(360, 82, '처음', ROLE.s, 19), 0.1) + at(3, 'pop', tag(360, 176, '가운데', ROLE.s, 19), 0.2) + at(3, 'pop', tag(360, 284, '끝', ROLE.s, 19), 0.3);
    const keep = ['대처법 알면 피해 줄임', '지진: 몸 보호하며 대피', '태풍: 위험한 곳 피하기', '폭염: 야외 활동 줄이기', '평소 안전 수칙 익히기'];
    const ty = [82, 130, 176, 222, 284];
    keep.forEach((label, i) => {
      body += `<g class="b3"><g class="fy fy${i}">${tile(516, ty[i], label, { size: 18, h: 38, w: 212, fill: 'white', stroke: C.green })}</g></g>`;
      css += `.sc-${id} .fy${i} { transform: translate(${159 - 516}px, ${keyY[i] - ty[i]}px) scale(.55); opacity: 0; transition: transform .8s ease-in-out ${f(0.2 + i * 0.28)}s, opacity .4s ease ${f(0.2 + i * 0.28)}s; }
        .on3 .sc-${id} .fy${i} { transform: none; opacity: 1; }`;
    });
    body += glowRect(306, 42, 326, 288, 4, C.green, 0.2) + at(4, 'drop', tag(470, 20, '요약', ROLE.p, 22), 0.5);
    put(K + '4/요약', svg(id, body, css));
  })();

  // ── 4단원: 기상 특보(비가 세질수록 호우 주의보에서 호우 경보로 — 텔레비전 아래 띠로 알린다) ──────────────────────────────
  (function () {
    const id = 't51-k2-teukbo';
    let css = base(id);
    const cloud = (x, y, s, cls) => `<g class="${cls}"><circle cx="${x}" cy="${y}" r="${22 * s}"/><circle cx="${x + 26 * s}" cy="${y - 12 * s}" r="${26 * s}"/><circle cx="${x + 54 * s}" cy="${y}" r="${20 * s}"/><rect x="${x}" y="${y - 4 * s}" width="${54 * s}" height="${24 * s}"/></g>`;
    let body = at(1, 'fin', `<rect x="24" y="24" width="330" height="236" rx="14" fill="white" stroke="${C.ink}" stroke-width="4"/><path d="M189 260 L162 286 M189 260 L216 286 M140 288 H238" stroke="${C.ink}" stroke-width="4" stroke-linecap="round"/>`
      + `<defs><clipPath id="${id}-scr"><rect x="38" y="38" width="302" height="172"/></clipPath><clipPath id="${id}-tube"><rect x="440" y="44" width="50" height="262" rx="25"/></clipPath></defs>`
      + `<rect x="38" y="38" width="302" height="172" fill="${C.sky}"/><rect x="38" y="214" width="302" height="38" rx="6" fill="white" stroke="${C.line}" stroke-width="2"/>`);
    // 빗줄기: 칸이 지날수록 늘어나고 빨라진다
    const drops = (n, seed, cls) => {
      let s = '';
      for (let i = 0; i < n; i++) { const x = 60 + ((i * 53 + seed * 31) % 270), y = 100 + ((i * 37 + seed * 17) % 40); s += `<path d="M${x} ${y} l-4 14" stroke="${C.blue}" stroke-width="3" stroke-linecap="round"/>`; }
      return `<g class="${cls}">${s}</g>`;
    };
    body += `<g clip-path="url(#${id}-scr)"><g class="b1">${drops(6, 1, 'rn rn1')}</g><g class="b2">${drops(9, 2, 'rn rn2')}</g><g class="b3">${drops(12, 3, 'rn rn3')}</g>`
      + `<g class="b1">${g('drop drop1', `<g fill="${C.line}">${cloud(70, 86, 1, 'cl')}${cloud(200, 84, 1.15, 'cl')}</g>`, 0.2)}</g></g>`;
    css += `@keyframes ${id}-rain { from { transform: translateY(0); opacity: 1; } to { transform: translateY(70px); opacity: 0; } }
      .sc-${id} .rn1 { animation: ${id}-rain 1.1s linear infinite; } .sc-${id} .rn2 { animation: ${id}-rain .8s linear .3s infinite; } .sc-${id} .rn3 { animation: ${id}-rain .6s linear .15s infinite; }
      .sc-${id} .cl { transition: fill .8s ease; } .on3 .sc-${id} .cl { fill: ${C.muted}; }`;
    // 아래 띠: 보통 소식 → 주의보 → 경보
    body += `<g class="b1 h2">${g('fin fin1', bar(60, 233, 180, C.line, 9) + bar(250, 233, 70, C.line, 9), 0.5)}</g>`;
    body += `<g class="b2 h3"><g class="bn bn2">${tile(190, 233, '호우 주의보', { size: 20, h: 32, w: 180, fill: TAN, stroke: C.orange, rx: 8 })}</g></g>`;
    body += `<g class="b3"><g class="bn bn3">${tile(190, 233, '호우 경보', { size: 20, h: 32, w: 180, fill: C.peach, stroke: C.red, rx: 8, color: C.red })}</g></g>`;
    css += `.sc-${id} .bn { transform: translateX(150px); opacity: 0; transition: transform .7s ease-out .9s, opacity .4s ease .9s; }
      .on2 .sc-${id} .bn2, .on3 .sc-${id} .bn3 { transform: none; opacity: 1; }`;
    // 오른쪽 눈금: 비의 양
    body += at(1, 'fin', `<g clip-path="url(#${id}-tube)"><rect x="440" y="44" width="50" height="80" fill="${C.peach}"/><rect x="440" y="124" width="50" height="80" fill="${TAN}"/><rect x="440" y="204" width="50" height="102" fill="white"/>`
      + `<g class="wt"><rect x="440" y="44" width="50" height="262" fill="${C.blue}" opacity=".6"/></g></g>`
      + `<rect x="440" y="44" width="50" height="262" rx="25" fill="none" stroke="${C.ink}" stroke-width="3"/><path d="M440 124 H526 M440 204 H526" stroke="${C.muted}" stroke-width="2.5" stroke-dasharray="6 5"/>`
      + text(465, 334, '비의 양', { size: 18, color: C.muted }), 0.4);
    css += `.sc-${id} .wt { transform-box: fill-box; transform-origin: center bottom; transform: scaleY(0); transition: transform 1.4s ease-in-out .3s; }
      .on1 .sc-${id} .wt { transform: scaleY(.25); } .on2 .sc-${id} .wt { transform: scaleY(.55); } .on3 .sc-${id} .wt { transform: scaleY(.86); }`;
    body += at(1, 'fin', `<g class="lw">${text(560, 172, '주의보', { size: 22, color: C.orange })}</g><g class="lk">${text(552, 92, '경보', { size: 22, color: C.red })}</g>`, 0.6);
    css += pulseCss(id, '.lw', 2, 1.2) + pulseCss(id, '.lk', 3, 1.2);
    body += `<g class="h3">${glowRect(434, 120, 62, 88, 2, C.orange, 1.4, 10)}</g>` + glowRect(434, 40, 62, 88, 3, C.red, 1.4, 10);
    body += drawArrow(414, 190, 414, 88, C.red, 3, { width: 4, delay: 0.4 });
    // 칸 4: 주의보와 경보를 묶어 기상 특보
    body += drawLine('M608 70 H620 V190 H608', C.green, 4, { width: 3.5, delay: 0.1 }) + glowRect(36, 212, 306, 42, 4, C.green, 0.3, 8);
    body += at(4, 'pop', tag(560, 252, '기상 특보', ROLE.p, 22), 0.6);
    css += pulseCss(id, '.lw', 4, 0.8) + pulseCss(id, '.lk', 4, 0.8);
    put(K + '4/기상 특보', svg(id, body, css));
  })();

  // ── 4단원: 대피(지진 — 흔들림이 멈추면 건물 밖 넓은 운동장으로 옮겨 간다) ──────────────────────────────
  (function () {
    const id = 't51-k2-daepi';
    let css = base(id);
    const kid = (x, y, col, bag) => `<circle cx="${x}" cy="${y - 22}" r="10" fill="${col}"/><path d="M${x - 14} ${y + 14} Q${x - 14} ${y} ${x} ${y} Q${x + 14} ${y} ${x + 14} ${y + 14} Z" fill="${col}"/>`
      + (bag ? `<rect x="${x - 15}" y="${y - 45}" width="30" height="12" rx="3" fill="${bag}"/><path d="M${x - 11} ${y + 3} L${x - 21} ${y - 16} L${x - 12} ${y - 34} M${x + 11} ${y + 3} L${x + 21} ${y - 16} L${x + 12} ${y - 34}" stroke="${col}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>` : '');
    let bld = `<rect x="30" y="96" width="200" height="214" fill="white" stroke="${C.ink}" stroke-width="3"/><rect x="24" y="84" width="212" height="16" rx="4" fill="${C.sky}" stroke="${C.ink}" stroke-width="3"/>`
      + `<circle cx="130" cy="130" r="16" fill="white" stroke="${C.ink}" stroke-width="3"/><path d="M130 120 V130 H138" stroke="${C.ink}" stroke-width="3" stroke-linecap="round" fill="none"/>`
      + `<rect x="56" y="166" width="148" height="88" rx="4" fill="${C.sky}" stroke="${C.blue}" stroke-width="3"/>`
      + `<rect x="80" y="206" width="100" height="9" rx="2" fill="${C.orange}"/><path d="M88 215 V252 M172 215 V252" stroke="${C.orange}" stroke-width="5"/>`
      + `<rect x="112" y="266" width="36" height="44" fill="${C.peach}" stroke="${C.ink}" stroke-width="3"/>`;
    let body = at(1, 'fin', `<path d="M10 310 H630" stroke="${C.green}" stroke-width="4"/>`);
    body += `<g class="b1"><g class="bld">${bld}<g class="h3">${kid(112, 240, C.purple)}${kid(150, 240, C.blue)}</g></g></g>`;
    css += `@keyframes ${id}-sway { 0%, 100% { transform: none; } 25% { transform: translateX(-5px) rotate(-.6deg); } 75% { transform: translateX(5px) rotate(.6deg); } }
      .sc-${id} .bld { transform-box: fill-box; transform-origin: center bottom; }
      .on1 .sc-${id} .bld { animation: ${id}-sway .7s ease-in-out .4s 3; }`;
    // 흔들림 물결(칸 2에 사라짐)
    body += `<g class="b1 h2">` + [16, 244].map((x) => g('fin fin1', [150, 200, 250].map((y) => `<path d="M${x - 6} ${y} q4 -6 8 0 q4 6 8 0" stroke="${C.orange}" stroke-width="3" fill="none" stroke-linecap="round"/>`).join(''), 0.4)).join('') + '</g>';
    // 칸 2: 운동장과 대피 장소 표지, 이어지는 길
    body += at(2, 'fin', `<rect x="392" y="240" width="236" height="70" rx="10" fill="${C.mint}"/>`, 0.1);
    body += at(2, 'pop', `<path d="M604 162 V240" stroke="${C.ink}" stroke-width="5"/><rect x="508" y="118" width="120" height="44" rx="8" fill="${C.green}"/>` + text(568, 147, '대피 장소', { size: 19, color: 'white' }), 0.3);
    body += drawArrow(166, 292, 410, 292, C.green, 2, { width: 5, delay: 0.8, dash: '10 9' });
    // 칸 3: 가방으로 머리를 가리고 운동장으로
    const K3 = [[0, C.purple], [50, C.blue], [100, C.orange]];
    body += `<g class="b3">` + K3.map(([dx, col], i) => `<g class="kd kd${i}">${kid(160 + dx, 286, col, col === C.orange ? C.blue : C.orange)}</g>`).join('') + '</g>';
    css += K3.map((_, i) => `.sc-${id} .kd${i} { transform: translateX(-20px); opacity: 0; transition: transform 1.8s ease-in-out ${f(0.2 + i * 0.15)}s, opacity .3s ease ${f(0.2 + i * 0.15)}s; }
      .on3 .sc-${id} .kd${i} { transform: translateX(290px); opacity: 1; }`).join('');
    // 칸 4: 안전한 곳
    body += glowRect(388, 236, 244, 78, 4, C.green, 0.2, 12) + at(4, 'pop', check(440, 196, 13), 0.5) + at(4, 'pop', tag(340, 56, '대피', ROLE.p, 24), 0.7);
    put(K + '4/대피', svg(id, body, css));
  })();
})(typeof window !== 'undefined' ? window : globalThis);
