// 사회 6-1 낱말 도식(둘째 묶음): 국가기관(권력 분립·견제·삼심 제도·행정 각부·예산안·결산), 미디어(여론·양방향),
// 공간 자료(공간 자료·디지털 공간 영상 정보)를 코드로 그린다.
// 견제의 네 화살표는 교과서(미래엔 82쪽, 동아 82쪽, 아이스크림 88쪽)에 나온 사례만 쓴다: 국정 감사, 법률안 거부, 위헌 심판 요청, 대법관 임명 동의.
// 행정 각부의 부 이름은 미래엔 88~91쪽에 나온 것, 삼심 제도의 법원 차례는 아이스크림 84쪽 그림을 따른다.
// 세계 지도·지구본의 땅 모양은 지구본 앱의 실제 경계(learning/inquiry/globe/data/atlas-countries.json)를
// 정거 원통 도법(가로 176)과 정사 도법(반지름 70, 동경 125°·북위 22° 가운데)으로 옮겨 줄인 것이다(남극은 지구본에서 뺌).
// 디지털 공간 영상 정보의 마을 화면은 실제 장소가 아닌 단순한 격자 마을이다.
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
  const tagW = (label, size = 20) => Math.round(tw(label, size) + size * 1.3);
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
  // 사람 아이콘: (x, y) 는 발밑 가운데
  const person = (x, y, color = C.green, s = 1) => `<circle cx="${f(x)}" cy="${f(y - 27 * s)}" r="${f(7.5 * s)}" fill="${color}"/><path d="M${f(x - 11 * s)} ${f(y)} V${f(y - 9 * s)} Q${f(x - 11 * s)} ${f(y - 18 * s)} ${f(x)} ${f(y - 18 * s)} Q${f(x + 11 * s)} ${f(y - 18 * s)} ${f(x + 11 * s)} ${f(y - 9 * s)} V${f(y)} Z" fill="${color}"/>`;
  const coin = (x = 0, y = 0) => `<ellipse cx="${x}" cy="${y + 3.5}" rx="13" ry="5.5" fill="${C.orange}"/><ellipse cx="${x}" cy="${y}" rx="13" ry="5.5" fill="${C.yellow}" stroke="${C.orange}" stroke-width="2"/>`;
  // 돋보기: (x, y) 는 렌즈 가운데
  const lens = (x, y, r = 22) => `<path d="M${f(x + r * 0.7)} ${f(y + r * 0.7)} L${f(x + r * 1.6)} ${f(y + r * 1.6)}" stroke="${C.ink}" stroke-width="7" stroke-linecap="round"/><circle cx="${x}" cy="${y}" r="${r}" fill="white" fill-opacity=".35" stroke="${C.ink}" stroke-width="4"/>`;
  // 도장: 빨간 동그라미 안 짧은 이름
  const stamp = (x, y, label, r = 26) => `<circle cx="${x}" cy="${y}" r="${r}" fill="white" stroke="${C.red}" stroke-width="3.5"/><circle cx="${x}" cy="${y}" r="${r - 5}" fill="none" stroke="${C.red}" stroke-width="1.5"/>${text(x, f(y + 6.5), label, { size: 18, color: C.red })}`;

  // ── 건물 아이콘(단순하게). (x, y) 는 바닥 가운데, 높이는 대략 80*s ──
  // 국회: 둥근 지붕
  const assembly = (x, y, s = 1) => {
    const k = (v) => f(v * s);
    let o = `<path d="M${f(x - k(30))} ${f(y - k(50))} A${k(30)} ${k(26)} 0 0 1 ${f(x + k(30))} ${f(y - k(50))} Z" fill="${C.sky}" stroke="${C.blue}" stroke-width="3"/>`;
    o += `<rect x="${f(x - k(48))}" y="${f(y - k(54))}" width="${k(96)}" height="${k(9)}" rx="2" fill="${C.blue}"/>`;
    o += `<rect x="${f(x - k(44))}" y="${f(y - k(45))}" width="${k(88)}" height="${k(35)}" fill="white" stroke="${C.blue}" stroke-width="3"/>`;
    for (let i = -2; i <= 2; i++) o += `<path d="M${f(x + k(i * 16))} ${f(y - k(41))} V${f(y - k(14))}" stroke="${C.blue}" stroke-width="${k(5)}"/>`;
    o += `<rect x="${f(x - k(52))}" y="${f(y - k(10))}" width="${k(104)}" height="${k(10)}" rx="2" fill="${C.blue}"/>`;
    return o;
  };
  // 정부: 창문 많은 건물과 깃발
  const government = (x, y, s = 1) => {
    const k = (v) => f(v * s);
    let o = `<path d="M${x} ${f(y - k(66))} V${f(y - k(94))}" stroke="${C.ink}" stroke-width="2.5"/><path d="M${x} ${f(y - k(94))} H${f(x + k(20))} V${f(y - k(82))} H${x} Z" fill="${C.green}"/>`;
    o += `<rect x="${f(x - k(42))}" y="${f(y - k(66))}" width="${k(84)}" height="${k(66)}" rx="2" fill="white" stroke="${C.green}" stroke-width="3"/>`;
    for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) if (!(r === 2 && (c === 1 || c === 2))) o += `<rect x="${f(x - k(34) + k(c * 18))}" y="${f(y - k(58) + k(r * 18))}" width="${k(12)}" height="${k(11)}" rx="1.5" fill="${C.mint}" stroke="${C.green}" stroke-width="1.5"/>`;
    o += `<rect x="${f(x - k(10))}" y="${f(y - k(20))}" width="${k(20)}" height="${k(20)}" fill="${C.green}"/>`;
    return o;
  };
  // 법원: 세모 지붕과 기둥
  const court = (x, y, s = 1) => {
    const k = (v) => f(v * s);
    let o = `<path d="M${f(x - k(50))} ${f(y - k(56))} L${x} ${f(y - k(80))} L${f(x + k(50))} ${f(y - k(56))} Z" fill="${C.lilac}" stroke="${C.purple}" stroke-width="3" stroke-linejoin="round"/>`;
    o += `<rect x="${f(x - k(46))}" y="${f(y - k(56))}" width="${k(92)}" height="${k(7)}" fill="${C.purple}"/>`;
    for (let i = 0; i < 4; i++) o += `<rect x="${f(x - k(38) + k(i * 23))}" y="${f(y - k(49))}" width="${k(10)}" height="${k(39)}" fill="white" stroke="${C.purple}" stroke-width="2.5"/>`;
    o += `<rect x="${f(x - k(52))}" y="${f(y - k(10))}" width="${k(104)}" height="${k(10)}" rx="2" fill="${C.purple}"/>`;
    return o;
  };
  const BLD = { 국회: [assembly, COLD], 정부: [government, OK], 법원: [court, OLD] };

  // 장면마다 같이 쓰는 움직임
  const base = (id) => {
    let s = `
    .sc-${id} .pop, .sc-${id} .pulse, .sc-${id} .ring, .sc-${id} .twk { transform-box: fill-box; transform-origin: center; }
    .sc-${id} .twk { animation: ${id}-twk 1.6s ease-in-out infinite alternate; }
    .sc-${id} .mar { animation: ${id}-mar .7s linear infinite; }
    .sc-${id} .draw { stroke-dasharray: 1; stroke-dashoffset: 1; transition: stroke-dashoffset 1.4s ease-in-out .2s; }
    .sc-${id} .grow { transform-box: fill-box; transform-origin: 0 50%; transform: scaleX(0); transition: transform 1.2s ease-in-out .2s; }
    .sc-${id} .mv { transform: translate(var(--x1), var(--y1)); transition: transform 1.4s ease-in-out, opacity .6s ease; }
    .sc-${id} .sway { animation: ${id}-sway 2.6s ease-in-out infinite; }
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
    @keyframes ${id}-sway { 0%, 100% { transform: translateX(-14px); } 50% { transform: translateX(14px); } }
    @keyframes ${id}-jig { 0%, 100% { transform: translate(0, 0); } 25% { transform: translate(2.5px, -2px); } 50% { transform: translate(-2px, 1.5px); } 75% { transform: translate(1.5px, 2.5px); } }
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
    .on${n} .sc-${id} .grow${n} { transform: scaleX(1); }`;
    for (let n = 2; n <= 5; n++) s += `
    .on${n} .sc-${id} .mv { transform: translate(var(--x${n}), var(--y${n})); }`;
    return s;
  };

  // ════ 2-2 민주주의를 실현하는 국가기관 ════

  // ── 권력 분립: 한 덩이 권력이 세 조각으로 나뉘어 국회·정부·법원 위로 옮겨 간다 ──
  (function () {
    const id = 't61-s2-bunrip';
    let css = base(id);
    const XS = [130, 320, 510], GY = 236, NAMES = ['국회', '정부', '법원'], BRANCH = ['입법부', '행정부', '사법부'], POW = ['입법권', '행정권', '사법권'];
    const ROLE = ['법 만들기', '나라 살림', '재판'];
    let body = '';
    // 1칸: 왕관 쓴 한 사람과 큰 권력 덩이
    const king = person(320, 300, C.ink, 1.7) + `<path d="M306 236 L308 222 L314 230 L320 218 L326 230 L332 222 L334 236 Z" fill="${C.yellow}" stroke="${C.orange}" stroke-width="2.5" stroke-linejoin="round"/>`;
    body += `<g class="b1 h2">${g('pop pop1', king, 0.2)}</g>`;
    // 덩이 세 조각: 1칸엔 붙어 있다가 2칸에 나뉘어 건물 위로
    for (let i = 0; i < 3; i++) {
      const cx = 230 + i * 90;
      const piece = `<rect x="${cx - 45}" y="96" width="90" height="56" rx="10" fill="${C.yellow}" stroke="${C.orange}" stroke-width="3"/>` + shown(2, text(cx, 131, POW[i], { size: 20 }));
      body += `<g class="b1"><g class="mv" style="${mvStyle([[0, 0], [XS[i] - cx, 0]])}">${g('pop pop1', piece)}</g></g>`;
    }
    body += `<g class="b1 h2">${g('pop pop1', `<rect x="185" y="96" width="270" height="56" rx="12" fill="${C.yellow}" stroke="${C.orange}" stroke-width="3"/>` + text(320, 134, '권력', { size: 28 }))}</g>`;
    body += `<g class="b1 h2"><g class="jig">${`<path d="M292 160 L306 196 M348 160 L334 196" stroke="${C.orange}" stroke-width="4" stroke-linecap="round"/>`}</g></g>`;
    // 2칸: 세 건물과 이름
    XS.forEach((x, i) => {
      const [draw, col] = BLD[NAMES[i]];
      body += at(2, 'rise', draw(x, GY) + text(x, GY + 30, NAMES[i], { size: 22 }) + text(x, GY + 54, `(${BRANCH[i]})`, { size: 18, color: C.muted, weight: 600 }), 0.4 + i * 0.15);
      // 3칸: 맡은 일
      body += at(3, 'pop', tag(x, 326, ROLE[i], col, { size: 20 }), i * 0.3);
    });
    // 4칸: 이름과 반짝임
    body += at(4, 'pop', tag(250, 40, '권력 분립', OK, { size: 24 }));
    body += at(4, 'pop', tag(420, 40, '삼권 분립', PLAIN, { size: 20 }), 0.4);
    XS.forEach((x, i) => { body += glowRect(x - 66, 84, 132, 266, 4, BLD[NAMES[i]][1][1], 0.3 + i * 0.25, 16); });
    put('6-1/사회/2-2/권력 분립', svg(id, body, css));
  })();

  // ── 견제: 세 기관이 서로 화살표로 감시하고 억누른다. 화살을 받은 기관은 부풀었다가 제 크기로 줄어든다 ──
  (function () {
    const id = 't61-s2-gyeonje';
    let css = base(id) + `
    .sc-${id} .tame { transform-box: fill-box; transform-origin: 50% 100%; }
    @keyframes ${id}-tame { 0% { transform: scale(1.22); } 45% { transform: scale(1.22); } 100% { transform: scale(1); } }
    .on1 .sc-${id} .tame1, .on2 .sc-${id} .tame2, .on3 .sc-${id} .tame3 { animation: ${id}-tame 1.6s ease-in-out both; }
    .on3 .sc-${id} .tame3 { animation-delay: 1.2s; }`;
    // 국회 위 가운데, 정부 왼쪽 아래, 법원 오른쪽 아래
    const P = { 국회: [320, 132], 정부: [100, 300], 법원: [540, 300] };
    let body = '';
    // 건물(화살을 받는 칸에 부풀었다 줄어든다)
    const bld = (k, tameN) => {
      const [x, y] = P[k], [draw] = BLD[k];
      return `<g class="tame${tameN ? ' tame' + tameN : ''}">${draw(x, y)}</g>` + text(x, y + 28, k, { size: 22 });
    };
    body += at(1, 'fin', bld('국회', 2)) + at(1, 'fin', bld('정부', 1)) + at(1, 'fin', bld('법원', 3));
    // 가장자리마다 화살표 둘: 바깥쪽·안쪽으로 휘게 해서 꼬리표를 화살표 가운데에 얹는다
    const edge = (A, B, out) => {
      const M = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2], L = Math.hypot(B[0] - A[0], B[1] - A[1]);
      let n = [-(B[1] - A[1]) / L, (B[0] - A[0]) / L];
      if ((n[0] * (M[0] - 320) + n[1] * (M[1] - 230)) < 0) n = [-n[0], -n[1]]; // 삼각형 바깥 쪽
      const k = out ? 72 : -72;
      return { q: [M[0] + n[0] * k, M[1] + n[1] * k], mid: [M[0] + n[0] * k / 2, M[1] + n[1] * k / 2] };
    };
    const arc = (n, from, to, out, color, label, pal, s = 0.5) => {
      const e = edge(from, to, out);
      return shown(n, g(`fin fin${n}`, flowQ(from, e.q, to, color), s)) + at(n, 'pop', tag(f(e.mid[0]), f(e.mid[1]), label, pal, { size: 19 }), s + 0.5);
    };
    const QL = [264, 112], GV = [148, 218], QR = [376, 112], CT = [492, 218];
    body += arc(1, QL, GV, true, C.blue, '국정 감사', COLD, 0.2);
    body += arc(2, GV, QL, false, C.green, '법률안 거부', OK);
    body += arc(3, CT, QR, true, C.purple, '위헌 심판 요청', OLD);
    body += arc(3, QR, CT, false, C.blue, '대법관 임명 동의', COLD, 1.4);
    // 4칸: 가운데 이름, 세 기관에 고리
    body += at(4, 'pop', tag(320, 272, '견제', HOT, { size: 26 }));
    body += ring(320, 92, 56, 4, C.blue, 0.2) + ring(100, 258, 56, 4, C.green, 0.4) + ring(540, 262, 56, 4, C.purple, 0.6);
    put('6-1/사회/2-2/견제', svg(id, body, css));
  })();

  // ── 삼심 제도: 사건 서류가 지방 법원 → 고등 법원 → 대법원 계단을 오른다 ──
  (function () {
    const id = 't61-s2-samsim';
    let css = base(id);
    const STEP = [[30, 226, 270], [226, 422, 200], [422, 618, 130]]; // [왼쪽, 오른쪽, 윗면 y]
    const NAME = ['지방 법원', '고등 법원', '대법원'], GY = 342;
    let body = '';
    const paper = `<rect x="-24" y="-29" width="48" height="58" rx="4" fill="white" stroke="${C.ink}" stroke-width="2.5"/><path d="M-14 -16 H14 M-14 16 H14" stroke="${C.muted}" stroke-width="2.5" stroke-linecap="round"/>` + text(0, 6.5, '사건', { size: 18 });
    const docAt = (i) => [(STEP[i][0] + STEP[i][1]) / 2 - 42, STEP[i][2] - 34];
    STEP.forEach(([x0, x1, top], i) => {
      const n = i + 1, cx = (x0 + x1) / 2;
      body += at(n, 'rise', `<rect x="${x0}" y="${top}" width="${x1 - x0}" height="${GY - top}" fill="${[C.mint, C.sky, C.lilac][i]}" stroke="${[C.green, C.blue, C.purple][i]}" stroke-width="3"/>` + text(x0 + 76, top + 42, NAME[i], { size: 22, anchor: 'start' }) + court(cx + 40, top, 0.62), 0);
      body += at(n, 'pop', tag(x0 + 38, top + 34, `${n}심`, [OK, COLD, OLD][i], { size: 22 }), 0.3);
      body += at(n, 'drop', stamp(cx + 40, top - 80, '판결', 22), 1.3);
    });
    // 사건 서류: 계단마다 위로 옮겨 간다
    const d0 = docAt(0);
    body += `<g class="b1"><g class="mv" style="${mvStyle([[0, 0], [docAt(1)[0] - d0[0], docAt(1)[1] - d0[1]], [docAt(2)[0] - d0[0], docAt(2)[1] - d0[1]]])}"><g transform="translate(${d0[0]} ${d0[1]})">${paper}</g></g></g>`;
    // 다시 재판받으러 올라가는 화살표
    const jump = (i) => { const [x, y] = docAt(i), [x2, y2] = docAt(i + 1); return flowQ([x, y - 36], [(x + x2) / 2 - 10, y2 - 62], [x2 - 34, y2 - 10], [C.blue, C.purple][i]); };
    body += shown(2, g('fin fin2', jump(0), 0));
    body += shown(3, g('fin fin3', jump(1), 0));
    // 4칸: 이름과 세 칸 반짝임
    body += at(4, 'pop', tag(140, 50, '삼심 제도', HOT, { size: 24 }));
    body += at(4, 'pop', tag(140, 100, '세 번까지', PLAIN, { size: 20 }), 0.4);
    STEP.forEach(([x0, x1, top], i) => { body += glowRect(x0, top, x1 - x0, GY - top, 4, [C.green, C.blue, C.purple][i], 0.6 + i * 0.3, 2); });
    put('6-1/사회/2-2/삼심 제도', svg(id, body, css));
  })();

  // ── 행정 각부: 대통령 → 국무총리 → 여러 부 조직도 ──
  (function () {
    const id = 't61-s2-gakbu';
    let css = base(id);
    const box = (cx, cy, w, h, label, [fill, stroke], size = 20) => `<rect x="${f(cx - w / 2)}" y="${f(cy - h / 2)}" width="${w}" height="${h}" rx="10" fill="${fill}" stroke="${stroke}" stroke-width="3"/>${text(cx, f(cy + size * 0.36), label, { size })}`;
    const MIN = ['교육부', '국방부', '통일부', '보건복지부', '국토교통부'], MX = [76, 198, 320, 442, 564], BY = 214;
    let body = '';
    body += at(1, 'pop', box(320, 42, 150, 46, '대통령', HOT, 22));
    body += shown(1, `<path class="draw draw1" pathLength="1" d="M320 65 V101" stroke="${C.ink}" stroke-width="3"/>`);
    body += at(1, 'pop', box(320, 124, 150, 46, '국무총리', OK, 22), 0.6);
    // 2칸: 갈래 줄이 그려지고 부가 하나씩 내려온다
    body += shown(2, `<path class="draw draw2" pathLength="1" d="M320 147 V172 M${MX[0]} 192 V172 H${MX[4]} V192 M${MX[1]} 172 V192 M${MX[2]} 172 V192 M${MX[3]} 172 V192" stroke="${C.ink}" stroke-width="3" fill="none"/>`);
    MIN.forEach((m, i) => { body += at(2, 'drop', box(MX[i], BY, 112, 44, m, COLD, 18), 0.6 + i * 0.2); });
    // 3칸: 부마다 맡은 일 그림
    const ic = [
      // 교육부: 펼친 책
      (x, y) => `<path d="M${x} ${y - 14} Q${x - 14} ${y - 22} ${x - 30} ${y - 16} V${y + 14} Q${x - 14} ${y + 8} ${x} ${y + 16} Q${x + 14} ${y + 8} ${x + 30} ${y + 14} V${y - 16} Q${x + 14} ${y - 22} ${x} ${y - 14} Z" fill="white" stroke="${C.orange}" stroke-width="3" stroke-linejoin="round"/><path d="M${x} ${y - 14} V${y + 16}" stroke="${C.orange}" stroke-width="2.5"/>`,
      // 국방부: 방패
      (x, y) => `<path d="M${x} ${y - 24} L${x + 22} ${y - 16} V${y} Q${x + 22} ${y + 16} ${x} ${y + 24} Q${x - 22} ${y + 16} ${x - 22} ${y} V${y - 16} Z" fill="${C.sky}" stroke="${C.blue}" stroke-width="3" stroke-linejoin="round"/><path d="M${x - 11} ${y - 8} L${x} ${y + 1} L${x + 11} ${y - 8} M${x - 11} ${y + 2} L${x} ${y + 11} L${x + 11} ${y + 2}" stroke="${C.blue}" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`,
      // 통일부: 두 사람이 손을 맞잡음
      (x, y) => person(x - 16, y + 22, C.green, 0.95) + person(x + 16, y + 22, C.purple, 0.95) + `<path d="M${x - 8} ${y + 6} Q${x} ${y - 2} ${x + 8} ${y + 6}" stroke="${C.ink}" stroke-width="3" fill="none" stroke-linecap="round"/>`,
      // 보건복지부: 더하기 표
      (x, y) => `<circle cx="${x}" cy="${y}" r="24" fill="white" stroke="${C.red}" stroke-width="3"/><path d="M${x - 6} ${y - 15} H${x + 6} V${y - 6} H${x + 15} V${y + 6} H${x + 6} V${y + 15} H${x - 6} V${y + 6} H${x - 15} V${y - 6} H${x - 6} Z" fill="${C.red}"/>`,
      // 국토교통부: 길과 집
      (x, y) => `<path d="M${x - 30} ${y + 22} L${x - 8} ${y - 18} H${x + 8} L${x + 30} ${y + 22} Z" fill="${C.line}"/><path d="M${x} ${y - 14} V${y - 6} M${x} ${y + 2} V${y + 10} M${x} ${y + 16} V${y + 22}" stroke="white" stroke-width="3"/><path d="M${x + 18} ${y - 4} V${y - 14} L${x + 28} ${y - 22} L${x + 38} ${y - 14} V${y - 4} Z" fill="white" stroke="${C.green}" stroke-width="2.5" stroke-linejoin="round"/>`
    ];
    ic.forEach((fn, i) => { body += at(3, 'pop', fn(MX[i], 274), i * 0.2); });
    // 4칸: 다섯 부를 묶는 괄호와 이름
    body += shown(4, `<path class="draw draw4" pathLength="1" d="M22 304 V316 H618 V304" stroke="${C.green}" stroke-width="3.5" fill="none" stroke-linejoin="round"/>`);
    body += at(4, 'pop', tag(320, 334, '행정 각부', OK, { size: 22 }), 0.6);
    body += glowRect(16, 186, 608, 56, 4, C.blue, 0.8, 14);
    put('6-1/사회/2-2/행정 각부', svg(id, body, css));
  })();

  // 나라 살림 계획서(예산안): 가운데 0 0, 너비 160
  const PLAN_ROWS = [['국방', 70, C.blue], ['복지', 50, C.orange], ['교육', 62, C.green]];

  // ── 예산안: 정부가 계획서를 짜서 국회에 내고, 국회가 심의해 고친 뒤 확정한다 ──
  (function () {
    const id = 't61-s2-yesanan';
    let css = base(id) + `
    .sc-${id} .adj { transform-box: fill-box; transform-origin: 0 50%; transition: transform 1.2s ease-in-out .6s; }
    .on3 .sc-${id} .adj-dn { transform: scaleX(.6); }
    .on3 .sc-${id} .adj-up { transform: scaleX(1.4); }`;
    const GX = 92, AX = 552, GY = 300, PX = 236, PY = 170, MOVE = 168;
    let body = '';
    body += at(1, 'rise', government(GX, GY) + text(GX, GY + 30, '정부', { size: 22 }));
    body += at(2, 'rise', assembly(AX, GY) + text(AX, GY + 30, '국회', { size: 22 }));
    // 계획서
    let plan = `<rect x="${PX - 82}" y="${PY - 92}" width="164" height="204" rx="8" fill="white" stroke="${C.ink}" stroke-width="3"/>` + text(PX, PY - 56, '예산안', { size: 22 });
    plan += `<path d="M${PX - 66} ${PY - 40} H${PX + 66}" stroke="${C.line}" stroke-width="2.5"/>`;
    PLAN_ROWS.forEach(([lab, w, col], i) => {
      const y = PY - 12 + i * 32;
      const cls = i === 0 ? 'adj adj-dn' : i === 1 ? 'adj adj-up' : '';
      plan += text(PX - 46, y + 7, lab, { size: 18 });
      plan += `<g class="${cls}"><rect class="grow grow1" style="transition-delay:${f(0.4 + i * 0.25)}s" x="${PX - 18}" y="${y - 10}" width="${w}" height="20" rx="4" fill="${col}"/></g>`;
    });
    // 3칸: 줄고 느는 표시
    plan += at(3, 'pop', `<path d="M${PX + 56} ${PY - 19} L${PX + 65} ${PY - 6} L${PX + 74} ${PY - 19} Z" fill="${C.blue}"/>`, 1.4);
    plan += at(3, 'pop', `<path d="M${PX + 65} ${PY + 13} L${PX + 74} ${PY + 26} H${PX + 56} Z" fill="${C.orange}"/>`, 1.6);
    plan += at(3, 'drop', `<g transform="rotate(-12 ${PX + 46} ${PY + 88})">${stamp(PX + 46, PY + 88, '확정', 22)}</g>`, 1.6);
    body += `<g class="b1"><g class="mv" style="${mvStyle([[0, 0], [MOVE, 0]])}">${g('pop pop1', plan, 0.2)}</g></g>`;
    // 2칸: 넘겨주는 화살표와 돋보기
    body += shown(2, g('fin fin2', flow([[150, 56], [490, 56]], C.green), 0.2));
    body += at(2, 'pop', tag(320, 28, '정부 → 국회', PLAIN, { size: 19 }), 0.2);
    body += `<g class="b2 h3"><g class="sway" style="animation-delay:1.4s">${g('fin fin2', lens(PX + MOVE + 4, PY + 14, 26), 1.4)}</g></g>`;
    body += at(2, 'pop', tag(AX, 196, '심의', COLD, { size: 20 }), 1.6);
    body += at(3, 'pop', tag(AX, 150, '확정', HOT, { size: 20 }), 1.8);
    // 4칸
    body += glowRect(PX + MOVE - 90, PY - 100, 180, 220, 4, C.green, 0.2, 12);
    body += ring(PX + MOVE, PY + 10, 100, 4, C.green, 0.6);
    put('6-1/사회/2-2/예산안', svg(id, body, css));
  })();

  // ── 결산: 한 해 동안 쓰고, 한 해가 끝나면 들어온 돈과 나간 돈을 마감해 셈하고, 국회가 심사한다 ──
  (function () {
    const id = 't61-s2-gyeolsan';
    let css = base(id) + `
    .sc-${id} .year { transform-box: fill-box; transform-origin: 0 50%; transform: scaleX(0); transition: transform 2.6s linear .3s; }
    .on1 .sc-${id} .year { transform: scaleX(1); }
    .sc-${id} .run { animation: ${id}-run 2.1s ease-in-out infinite; opacity: 0; }
    @keyframes ${id}-run { 0% { opacity: 0; transform: translate(0, 0); } 15% { opacity: 1; } 80% { opacity: 1; } 100% { opacity: 0; transform: translate(var(--tx), var(--ty)); } }`;
    let body = '';
    // 위: 한 해 막대(1월 → 12월)
    const YX0 = 70, YX1 = 570, YY = 40;
    body += `<rect x="${YX0}" y="${YY - 9}" width="${YX1 - YX0}" height="18" rx="9" fill="white" stroke="${C.line}" stroke-width="2.5"/>`;
    body += `<g class="b1"><rect class="year" x="${YX0}" y="${YY - 9}" width="${YX1 - YX0}" height="18" rx="9" fill="${C.green}"/></g>`;
    body += text(YX0, YY + 34, '1월', { size: 18 }) + text(YX1, YY + 34, '12월', { size: 18 });
    // 1칸: 예산 상자에서 도로·학교·병원으로 돈이 나간다
    const CX = 100, CY = 160;
    body += at(1, 'pop', `<rect x="${CX - 42}" y="${CY - 26}" width="84" height="52" rx="8" fill="${C.peach}" stroke="${C.orange}" stroke-width="3"/>` + coin(CX - 14, CY - 34) + coin(CX + 12, CY - 40) + text(CX, CY + 8, '예산', { size: 20 }));
    const TG = [[270, '도로'], [370, '학교'], [470, '병원']];
    const icon = {
      도로: (x, y) => `<path d="M${x - 30} ${y + 20} L${x - 9} ${y - 20} H${x + 9} L${x + 30} ${y + 20} Z" fill="${C.line}"/><path d="M${x} ${y - 16} V${y - 8} M${x} ${y} V${y + 8} M${x} ${y + 14} V${y + 20}" stroke="white" stroke-width="3"/>`,
      학교: (x, y) => `<path d="M${x - 30} ${y + 20} V${y - 6} L${x} ${y - 24} L${x + 30} ${y - 6} V${y + 20} Z" fill="white" stroke="${C.orange}" stroke-width="3" stroke-linejoin="round"/><circle cx="${x}" cy="${y - 6}" r="5" fill="${C.orange}"/><rect x="${x - 7}" y="${y + 6}" width="14" height="14" fill="${C.orange}"/>`,
      병원: (x, y) => `<rect x="${x - 28}" y="${y - 22}" width="56" height="42" rx="3" fill="white" stroke="${C.red}" stroke-width="3"/><path d="M${x - 4} ${y - 14} H${x + 4} V${y - 6} H${x + 12} V${y + 2} H${x + 4} V${y + 10} H${x - 4} V${y + 2} H${x - 12} V${y - 6} H${x - 4} Z" fill="${C.red}"/>`
    };
    TG.forEach(([x, k], i) => {
      body += at(1, 'pop', icon[k](x, CY) + text(x, CY + 46, k, { size: 18 }), 0.4 + i * 0.2);
      body += `<g class="b1 h2">${[0, 0.7, 1.4].map((s) => `<g class="run" style="--tx:${x - CX - 92}px;--ty:-6px;animation-delay:${f(s + i * 0.23)}s">${coin(CX + 52, CY)}</g>`).join('')}</g>`;
    });
    // 2칸: 12월 끝에 마감 줄, 장부에 들어온 돈·나간 돈
    body += shown(2, `<path class="draw draw2" pathLength="1" d="M${YX1} ${YY - 22} V${YY + 14}" stroke="${C.red}" stroke-width="4" stroke-linecap="round"/>`);
    body += at(2, 'pop', tag(YX1 - 76, YY + 30, '마감', HOT, { size: 18 }), 0.5);
    const LX = 120, LY = 236;
    let ledger = `<rect x="${LX}" y="${LY}" width="350" height="110" rx="10" fill="white" stroke="${C.ink}" stroke-width="3"/>`;
    ledger += text(LX + 18, LY + 44, '들어온 돈', { size: 19, anchor: 'start' }) + `<rect class="grow grow2" style="transition-delay:.8s" x="${LX + 130}" y="${LY + 26}" width="200" height="22" rx="4" fill="${C.blue}"/>`;
    ledger += text(LX + 18, LY + 88, '나간 돈', { size: 19, anchor: 'start' }) + `<rect class="grow grow2" style="transition-delay:1.3s" x="${LX + 130}" y="${LY + 70}" width="170" height="22" rx="4" fill="${C.orange}"/>`;
    body += at(2, 'pop', ledger, 0.3);
    // 3칸: 국회가 돋보기로 따져 본다
    const AX = 560, AY = 334;
    body += at(3, 'rise', assembly(AX, AY, 0.9));
    body += at(3, 'pop', tag(AX, 224, '결산 심사', COLD, { size: 19 }), 0.3);
    body += `<g class="b3 h4"><g class="sway" style="animation-delay:.9s">${g('fin fin3', lens(LX + 236, LY + 54, 26), 0.6)}</g></g>`;
    body += at(3, 'pop', `<path d="M${LX + 316} ${LY + 58} l9 9 l17 -20" stroke="${C.green}" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`, 1.8);
    // 4칸
    body += at(4, 'pop', tag(56, LY + 55, '결산', HOT, { size: 24 }));
    body += glowRect(LX - 6, LY - 6, 362, 122, 4, C.orange, 0.4, 14);
    put('6-1/사회/2-2/결산', svg(id, body, css));
  })();

  // ════ 2-3 민주주의의 발전과 미디어 생활 ════

  // 텔레비전 아이콘: 가운데 (x, y)
  const tv = (x, y, s = 1) => {
    const k = (v) => f(v * s);
    return `<path d="M${f(x - k(14))} ${f(y - k(40))} L${x} ${f(y - k(28))} L${f(x + k(14))} ${f(y - k(40))}" stroke="${C.ink}" stroke-width="2.5" fill="none" stroke-linecap="round"/><rect x="${f(x - k(40))}" y="${f(y - k(28))}" width="${k(80)}" height="${k(56)}" rx="${k(8)}" fill="white" stroke="${C.ink}" stroke-width="3"/><rect x="${f(x - k(32))}" y="${f(y - k(21))}" width="${k(64)}" height="${k(42)}" rx="${k(4)}" fill="${C.sky}"/><path d="M${f(x - k(22))} ${f(y - k(8))} H${f(x + k(18))} M${f(x - k(22))} ${f(y + k(4))} H${f(x + k(8))}" stroke="${C.blue}" stroke-width="${k(4)}" stroke-linecap="round"/>`;
  };
  // 말풍선: 꼬리가 왼쪽 아래, 가운데 (x, y)
  const bubble = (x, y, fill, stroke, w = 40, h = 26) => `<path d="M${f(x - w / 2 + 8)} ${f(y + h / 2)} L${f(x - w / 2 + 2)} ${f(y + h / 2 + 9)} L${f(x - w / 2 + 16)} ${f(y + h / 2)} Z" fill="${fill}" stroke="${stroke}" stroke-width="2.5" stroke-linejoin="round"/><rect x="${f(x - w / 2)}" y="${f(y - h / 2)}" width="${w}" height="${h}" rx="${f(h / 2)}" fill="${fill}" stroke="${stroke}" stroke-width="2.5"/><path d="M${f(x - w / 2 + 6)} ${f(y + h / 2 - 1.5)} H${f(x - w / 2 + 18)}" stroke="${fill}" stroke-width="3"/>`;

  // ── 여론: 저마다 다른 생각(색이 다른 말풍선)이 한 가지로 모여 큰 말풍선이 되고, 미디어를 타고 정부로 간다 ──
  (function () {
    const id = 't61-s2-yeoron';
    let css = base(id) + `
    .sc-${id} .gather { transition: transform 1.3s ease-in, opacity .5s ease 1s; }
    .on3 .sc-${id} .gather { opacity: 0; }`;
    let body = '';
    const PAL = [[C.peach, C.orange], [C.sky, C.blue], [C.lilac, C.purple], ['white', C.muted], [C.yellow, C.orange]];
    const ppl = [];
    [128, 222, 316].forEach((gy, r) => [52, 132, 212, 292].forEach((x, c) => ppl.push([x + (r % 2) * 18, gy])));
    const keep = new Set([3, 6, 10]); // 생각이 다른 채로 남는 사람
    const BIG = [470, 112];
    ppl.forEach(([x, y], i) => {
      body += at(1, 'pop', person(x, y, C.ink, 1), i * 0.06);
      const bx = x + 22, by = y - 56;
      const col = PAL[(i * 3 + 1) % PAL.length];
      const colored = `<g class="jig" style="animation-delay:${f(-i * 0.17)}s">${bubble(bx, by, col[0], col[1])}</g>`;
      if (keep.has(i)) { body += at(1, 'pop', colored, 0.3 + i * 0.06); return; }
      body += `<g class="b1 h2">${g('pop pop1', colored, 0.3 + i * 0.06)}</g>`;
      // 2칸: 초록 생각으로 바뀌고, 3칸: 큰 말풍선 쪽으로 날아간다
      body += `<g class="b2"><g class="mv gather" style="${mvStyle([[0, 0], [0, 0], [BIG[0] - bx, BIG[1] - by]])};transition-delay:${f(i * 0.05)}s">${g('pop pop2', bubble(bx, by, C.mint, C.green), 0.2 + i * 0.08)}</g></g>`;
    });
    // 3칸: 큰 말풍선 → 미디어 → 정부
    body += at(3, 'pop', bubble(BIG[0], BIG[1], C.mint, C.green, 160, 84) + text(BIG[0], BIG[1] + 10, '여론', { size: 30 }), 1.0);
    body += at(3, 'pop', tv(468, 252, 0.9), 1.2);
    body += shown(3, g('fin fin3', flow([[470, 166], [470, 210]], C.green), 1.3));
    body += shown(3, g('fin fin3', flow([[512, 262], [548, 262]], C.green), 1.5));
    body += at(3, 'rise', government(594, 300, 0.75) + text(594, 326, '정부', { size: 20 }), 1.4);
    body += at(3, 'fin', text(468, 306, '미디어', { size: 18, color: C.muted }), 1.3);
    // 4칸
    body += ring(BIG[0], BIG[1], 70, 4, C.green, 0.2);
    body += glowRect(BIG[0] - 88, BIG[1] - 50, 176, 100, 4, C.green, 0.4, 40);
    put('6-1/사회/2-3/여론', svg(id, body, css));
  })();

  // ── 양방향: 왼쪽은 텔레비전에서 사람에게 한쪽으로만, 오른쪽은 두 사람이 말을 서로 주고받는다 ──
  (function () {
    const id = 't61-s2-yangbang';
    let css = base(id) + `
    .sc-${id} .send { animation: ${id}-send 2.4s ease-in-out infinite; opacity: 0; }
    @keyframes ${id}-send { 0% { opacity: 0; transform: translateX(0); } 12% { opacity: 1; } 85% { opacity: 1; } 100% { opacity: 0; transform: translateX(var(--d)); } }`;
    let body = '';
    body += `<path d="M320 24 V340" stroke="${C.line}" stroke-width="3" stroke-dasharray="8 8"/>`;
    // 왼쪽: 한 방향
    body += at(1, 'pop', tv(82, 190, 1.2));
    const LP = [[262, 128], [262, 214], [262, 300]];
    LP.forEach(([x, y], i) => {
      body += at(1, 'pop', person(x, y, C.ink, 1.15), 0.2 + i * 0.1);
      body += shown(1, g('fin fin1', flow([[138, 190 + (i - 1) * 22], [x - 26, y - 22]], C.blue), 0.4 + i * 0.1));
    });
    // 받는 쪽에서 되돌아가지 못한다
    body += at(1, 'pop', tag(165, 44, '한 방향', COLD, { size: 22 }), 0.6);
    // 오른쪽: 두 사람이 휴대 전화로 주고받는다
    const phone = (x, y) => `<rect x="${x - 11}" y="${y - 19}" width="22" height="38" rx="4" fill="white" stroke="${C.ink}" stroke-width="2.5"/><rect x="${x - 7}" y="${y - 13}" width="14" height="22" rx="1.5" fill="${C.sky}"/>`;
    const A = [372, 278], B = [582, 278], PA = [400, 226], PB = [554, 226];
    body += at(2, 'pop', person(A[0], A[1], C.green, 1.7) + phone(PA[0], PA[1]));
    body += at(2, 'pop', person(B[0], B[1], C.purple, 1.7) + phone(PB[0], PB[1]), 0.2);
    const dots = (x, y, col) => [-8, 0, 8].map((d) => `<circle cx="${x + d}" cy="${y}" r="2.6" fill="${col}"/>`).join('');
    // 2칸: A → B (위)
    body += shown(2, g('fin fin2', flow([[420, 208], [534, 208]], C.green), 0.4));
    body += `<g class="b2"><g class="send" style="--d:92px;animation-delay:.8s">${bubble(432, 176, C.mint, C.green, 44, 28)}${dots(432, 176, C.green)}</g></g>`;
    // 3칸: B → A (아래)
    body += shown(3, g('fin fin3', flow([[534, 246], [420, 246]], C.purple), 0.4));
    body += `<g class="b3"><g class="send" style="--d:-92px;animation-delay:1.4s">${bubble(524, 278, C.lilac, C.purple, 44, 28)}${dots(524, 278, C.purple)}</g></g>`;
    body += at(3, 'pop', tag(475, 44, '양방향', OK, { size: 22 }), 0.8);
    // 4칸
    body += glowRect(338, 142, 270, 172, 4, C.green, 0.3, 18);
    body += at(4, 'pulse', tag(475, 44, '양방향', OK, { size: 22 }));
    put('6-1/사회/2-3/양방향', svg(id, body, css));
  })();

  // ════ 3-1 세계를 표현한 공간 자료 ════

  // 실제 경계에서 뽑은 땅 모양(파일 머리 주석 참고)
  const WORLD = { W: 176, H: 88, d: 'M104.5 44.5L107 46.5L107.5 49.5L105 49.5L102.5 47L103 44.5L104.5 44.5ZM84 30.5L84 31.5L82 31.5L81.5 33.5L79.5 33.5L84 30.5ZM28 20L25.5 19L24.5 16.5L22 15L19 14.5L19 10L25.5 9.5L35 11L36 10.5L41 11L42 10L41 9.5L41.5 9L45.5 11L46 10L47.5 10L48 11L42 14L43 16L48 17L49 19L49 17.5L50.5 16.5L50 13.5L52 13.5L55 15.5L56.5 14.5L61 18.5L55.5 19.5L53 21L56 20L56.5 21.5L58.5 21L56 22.5L56.5 22L54 21L47.5 23.5L47.5 22L45 20.5L28 20ZM45 7.5L40.5 6.5L48.5 7L45 7.5ZM61 19L60 19.5L62 20L62 21L59 20.5L61 19ZM49.5 8.5L58 11.5L57 12L54.5 11.5L56.5 13L54.5 13L55.5 13.5L50 12.5L52 12L52 10.5L44 8.5L46 8L49.5 8.5ZM28.5 7.5L31.5 8L28 9.5L26.5 9L27 7.5L28.5 7.5ZM36 8.5L38.5 10L38 10.5L32.5 10.5L30.5 10L33 9.5L29.5 9L36 8.5ZM41 4.5L46 5L42.5 5.5L41 4.5ZM43 4L58 3.5L50.5 5L51 5.5L48.5 7L44 6.5L46.5 6L45 5.5L46.5 5L45.5 5L48 4.5L43 4ZM28 20L45 20.5L47.5 22L47.5 23.5L54 21L55.5 22L50.5 25.5L51 26.5L48 28.5L48.5 31.5L46 29L41.5 29.5L40.5 31.5L36 28.5L29 27L27 24.5L27 20.5L28 21L28 20ZM19 10L19 14.5L22 15L24 17L19.5 15L16 14L14 15L14.5 14L10.5 16.5L7.5 17.5L11 15L7 14.5L9.5 12.5L6 12L9 11.5L6.5 10.5L11.5 9L19 10ZM130.5 20L127 22L127 23.5L124.5 23L121.5 24L116.5 21.5L115.5 22L115.5 24L113.5 23.5L112.5 22L114 21L110.5 20.5L113 18.5L118 19L118 17.5L122 17L125.5 17.5L127 19L130.5 20ZM115.5 24L115.5 22L116.5 21.5L121.5 24L122.5 23.5L123.5 24L121 24.5L121 26L116.5 23L115.5 24ZM157 45.5L160 47L161.5 49L159 47.5L157 48.5L157 45.5ZM157 45.5L157 48.5L155.5 48L155.5 46.5L153 46L153.5 45L152 44.5L153.5 44.5L154 45.5L157 45.5ZM145.5 42L146 43.5L145 46L142 45.5L141.5 43L143.5 43.5L145.5 42ZM148 43.5L146.5 44.5L148.5 44.5L147.5 45L148 46.5L147 45.5L146.5 47L146.5 44L148 43.5ZM139 44.5L140 45.5L139 47L134.5 41.5L139 44.5ZM60 59L60 62L56 64L57 65L55 66.5L56 67L54 69L54.5 69.5L53 69.5L52 68L54.5 56L55.5 54.5L57.5 55L60 56.5L59.5 57.5L61.5 56.5L60 59ZM54.5 69.5L54.5 71L51.5 70L54.5 69.5ZM54 52.5L55 55L53.5 59.5L53 66L52 68L53 69.5L54.5 69.5L53 70.5L51.5 69.5L52 67L51 67L52.5 64.5L51.5 65L52 62L54 52.5ZM102.5 46L102.5 50.5L99 49.5L98.5 47.5L94 47L96 45.5L97.5 41.5L102.5 42L103 43L102.5 46ZM108.5 45L108 42.5L113 38L112 41.5L108.5 45ZM107 46.5L104.5 44.5L105.5 41.5L108.5 42L107 46.5ZM100 40L98.5 38L100 33L106 33L107 35L104.5 40L104 38L103.5 39L100.5 39L100 40ZM99.5 34.5L99 38.5L95.5 40.5L94.5 37L95.5 33L99.5 34.5ZM112 21.5L111 22L111.5 24L107.5 23L106 22L107.5 20L103.5 18.5L103 17L102 16.5L101.5 14.5L103.5 13.5L102 10L103.5 10L108 11L104 11.5L106 13L109.5 11.5L109 10.5L110.5 11.5L117.5 10L121.5 10.5L120.5 9.5L122 8.5L123.5 8.5L123.5 11.5L124.5 11L123.5 9L124.5 8.5L128 9L127.5 8L139 6L144 7L141.5 7.5L150 8L152 9.5L156.5 8.5L176 10.5L176 12L174.5 12.5L175.5 13.5L168 14.5L167.5 17L164.5 19L164 16L168.5 13.5L164.5 14L164 15L157.5 15L154 17L157 18L156.5 20.5L152 23.5L154 20.5L152 20.5L148.5 18L145.5 20L141 20L136.5 18.5L135.5 19.5L130.5 20L127 19L125.5 17.5L122 17L118 17.5L118 19L111 19.5L110.5 20.5L112 21.5ZM134 4.5L137 5L134.5 5.5L132.5 4.5L134 4.5ZM114 8L121.5 6.5L116.5 7.5L115 8.5L116 9.5L113 9L114 8ZM2.5 11L5 11.5L3.5 12.5L0 12L0 10.5L2.5 11ZM95.5 5L98.5 5.5L96 6.5L93 5L95.5 5ZM103 10L97 10.5L94 12.5L93.5 15L91 15.5L90.5 13.5L97.5 10L102 9L103 10ZM65 3.5L75 3L78 3.5L72.5 4L82 4.5L78 5L79.5 5L78.5 5.5L79 6.5L77.5 6.5L78.5 7.5L76 8.5L77.5 9.5L75 9.5L77 9.5L68.5 12L66 14.5L63 13L61.5 11L63 10L61.5 10L63 9.5L60.5 9L61 8.5L59.5 7L52 6L57.5 4L65 3.5ZM96 58L97.5 58L97.5 56L98.5 57L102.5 55L103.5 56L103 57L104 57L102 60L98 61L96 58ZM30.5 28L38.5 29.5L40.5 31.5L41 35L45.5 33.5L45 35L43.5 35.5L43 37L37.5 35L32.5 29L32 29.5L34 33L30.5 28ZM60 59L61.5 59.5L61.5 61L59.5 60.5L60 59ZM62 60.5L60 59L62 57L59.5 55L59.5 52L56 49L53.5 49.5L52 47.5L54 46L54 43L56 43.5L57 43L56.5 42L58.5 41.5L59 43.5L63 42L63.5 44L68.5 45.5L71 47.5L68 54.5L64.5 56L62 60.5ZM54 49.5L56 49L59.5 52L59.5 54L55 55L54 49.5ZM54 46L52 47.5L54.5 50L53.5 53L51 51L48 46.5L49.5 46L51.5 44L54 46ZM55.5 43.5L54 43L54 46L49.5 43.5L50 40L53 38L52 39.5L55 41L55.5 43.5ZM47 38.5L45 37.5L47.5 36.5L47 38.5ZM58.5 41.5L56.5 42L57 43L55.5 43.5L55 41L53 40.5L52.5 39L53 38L53 39.5L54 38L57.5 39L59 40L58.5 41.5ZM60.5 43L59 43L58 41L59 40L60.5 43ZM61.5 43L60 42.5L60 41L61.5 41L61.5 43ZM91 20L92 20L91 21L91.5 22.5L89 23.5L87 23L87.5 21.5L86 20L89 19L91 20ZM51 44L48.5 46L49 43.5L51 44ZM48 32.5L51.5 34L46.5 33.5L48 32.5ZM103 55L100.5 52.5L103 51.5L104 52L103 55ZM102.5 55L98.5 57L97.5 56L98 53L100.5 52.5L102.5 55ZM97.5 56L97.5 58L96 58L93.5 52.5L100.5 52.5L98 53L97.5 56ZM80 37.5L81 36L82.5 38L80 37.5ZM82.5 38L82.5 36.5L85.5 36.5L85 32L90 34.5L90 36.5L86 37.5L85.5 39L82.5 38ZM79.5 33.5L81.5 33.5L82 31.5L84 30.5L85.5 32L85 32L85.5 36.5L80 36L79.5 33.5ZM95.5 33L95 38L88.5 37.5L88 36.5L90 36.5L90 34.5L94 32.5L95.5 33ZM89.5 41L90 37.5L95 38L92 41.5L89.5 41ZM95 37.5L96 43L92.5 43L92.5 41.5L93.5 40.5L95 37.5ZM88 38.5L88.5 41L86.5 41.5L86.5 38.5L88 38.5ZM84 39L86.5 39.5L86.5 41.5L84 42L84 39ZM81.5 38L83.5 38L84 40L82.5 39L81.5 39.5L80.5 38.5L81.5 38ZM85.5 39L87.5 36.5L89 38L86.5 39.5L85.5 39ZM101.5 41.5L97.5 41.5L96 43L95 41.5L99 38.5L101.5 41.5ZM97 42.5L96 45.5L94 46.5L93.5 45.5L95 44.5L94.5 43L97 42.5ZM93.5 43L95 43.5L95 44.5L93.5 46L92.5 44.5L93.5 43ZM103 48L104 48.5L104 51L101 53L99.5 52.5L98.5 50.5L99.5 50.5L99.5 49.5L102.5 50.5L102 48.5L103 48ZM105 49.5L107.5 49L108 51L105 53.5L105.5 56L103.5 57L104 52L103 51L104 51L105 52L105 49.5ZM94 47L98.5 47.5L99 49.5L99.5 49.5L98.5 50.5L99.5 52.5L93.5 52.5L94.5 49.5L94 47ZM112 50L112.5 51.5L110 56.5L109 55L109.5 52.5L112 50ZM92.5 29L91.5 27.5L92.5 25.5L93.5 28L92.5 29ZM84 30.5L87.5 28L87.5 26.5L92 26L92.5 31L94 32.5L89.5 34.5L84 30.5ZM107 28.5L108 26L110 26L111.5 29.5L110 29.5L107 28.5ZM115 33L115.5 32L117 33L114 36L113.5 34.5L115 34L115 33ZM138 38L138.5 37L140.5 37.5L140 38.5L138 38ZM139.5 37L138 38L137 37.5L136.5 39.5L137.5 41L136 40L136.5 38L135.5 35L137 34L137.5 35.5L139 35.5L139.5 37ZM140.5 37L139.5 37L139 35L137.5 35.5L137.5 33L140.5 37ZM137 34L135.5 35L136 39L135.5 35.5L134 36L133 33.5L136 30L135.5 32.5L137.5 33.5L137 34ZM139 39L140.5 38L140.5 36.5L138 33L139.5 32.5L141 33.5L139.5 34.5L141.5 37.5L139.5 40L139 39ZM152 23.5L150.5 25L149 25.5L149 24L152 23.5ZM131 20L135.5 19.5L136.5 18.5L141 20L145 19.5L144.5 20.5L146.5 21L139.5 23.5L135 23L131 20ZM135.5 30L133.5 33L133 32L131.5 31L131.5 33.5L127.5 36L126 40L123.5 33.5L121.5 32.5L122.5 32L122 31L125 28L124 27L126 26.5L127 30L128.5 30.5L135.5 30ZM133.5 33L131.5 33L131.5 31L133 32L133.5 33ZM131 30.5L130.5 31L127 30L128 29L131 30.5ZM126 26.5L124 27L125 28L122 31L122.5 32L118 31.5L119 31L118 29.5L120.5 29.5L123 26L126 26.5ZM120.5 25.5L124.5 26L123 26.5L120.5 29.5L118 29.5L118 26.5L120.5 25.5ZM121 26L121 24.5L122.5 24L122 24.5L124.5 25.5L121 26ZM122.5 23.5L127 23.5L123 25L122 24.5L123.5 24L122.5 23.5ZM113.5 23.5L116.5 23L120.5 25.5L118.5 27L116 25.5L114.5 26L114 24.5L115 24L113.5 23.5ZM111.5 29.5L109.5 24.5L113.5 26L116 25.5L118 26L118 29.5L119 31L116 31.5L111.5 29.5ZM105.5 28L106 26L108.5 26L108 27L105.5 28ZM93.5 15L94 13L96 11L99.5 11L99.5 11.5L96.5 13.5L97 14.5L96 16.5L94.5 17L93.5 15ZM102 16.5L103 17L103.5 18.5L99.5 19L99.5 17.5L102 16.5ZM103.5 18.5L107.5 20L105 21.5L102 22L102 20.5L99 20.5L99.5 19L103.5 18.5ZM99.5 17.5L99 20L96 19.5L95 18L96.5 17L99.5 17.5ZM102 22L102 22.5L99 22.5L98 21.5L101 20.5L102 22ZM95 17.5L94.5 21L91.5 20.5L91.5 18L95 17.5ZM99 22.5L102 22.5L99 24L99 22.5ZM99 24L101 23.5L99 24.5L100 25.5L99 26L98 24.5L99 24ZM110 26L102.5 26.5L101 24.5L104.5 23.5L109 23.5L110 26ZM84.5 26L85 24L83.5 23L89.5 23L87 26L84.5 26ZM174.5 63.5L173.5 64L172.5 61L175.5 62.5L174.5 63.5ZM171 65.5L173 64L171 67L169.5 66.5L171 65.5ZM149.5 60L144 60.5L143.5 55L147 53.5L149.5 51L151.5 51.5L152.5 49.5L154.5 50L154 51.5L156.5 52.5L157.5 49L163 57.5L161.5 62.5L159.5 63L157 62.5L155.5 61L155 61L155.5 60L154.5 61L152 59.5L149.5 60ZM127 23.5L127 22L131 20L135 23L141.5 23L146.5 21L144.5 20.5L148 18L149.5 18L152 20.5L154 20.5L152 23.5L145.5 25L148 25.5L146.5 27L147.5 28.5L147.5 30L142 34L139.5 32.5L138 33.5L136.5 33L135.5 32.5L136 30.5L135 29.5L131.5 30.5L126.5 28.5L126.5 27L124 24.5L127 23.5ZM93 21L95 21.5L94 22.5L97 24.5L95.5 25.5L93 22.5L91.5 22.5L91.5 21.5L93 21ZM86.5 18L85 16L85.5 15.5L89 18L85.5 19.5L86.5 18ZM81 11.5L81.5 12L79 13L76 12L81 11.5ZM110.5 23.5L112.5 24.5L112 25.5L110.5 24.5L110.5 23.5ZM150 40L149.5 41.5L147.5 40.5L149.5 39L150 40ZM145.5 42L144 43.5L141.5 43.5L145 40.5L146.5 41.5L145.5 42ZM102 10L103 13.5L98.5 14.5L98.5 13L100.5 12L98 10L102 10ZM95.5 19L97 20L95 20.5L94 19.5L95.5 19ZM106 37L107 35L109 38L106 37ZM157.5 25L156.5 27L152 27.5L151.5 28.5L151.5 27.5L156 25.5L156.5 24L157.5 25ZM59.5 54L61.5 55.5L61 57.5L59.5 57.5L60 56.5L57.5 55L58 53.5L59.5 54ZM113.5 34.5L113.5 36.5L109.5 38L109 35.5L113.5 34.5ZM105 29.5L107 28.5L111 30L113.5 33L115 33L115 34L109 36L105 29.5ZM64 82L67 83L61.5 83.5L64 82ZM176 85.5L176 88L0 88L0.5 85L18 85.5L13 85L13.5 84L11.5 83.5L16.5 83.5L10.5 81.5L32.5 80L39 81L37.5 79.5L51.5 80L55 79.5L55 77L59.5 75L56 77L58.5 80L50 81.5L52 82L50 82.5L59.5 84.5L74 83.5L70.5 82L79.5 80.5L84.5 78.5L107 78L114.5 76L121.5 77L121 79L122 79.5L131 76.5L146.5 77L154 76L171.5 79L168 81.5L169.5 82.5L166 83.5L176 85.5ZM87 27L87.5 28L79.5 33.5L84 27.5L85 26.5L87 27ZM106 33L100 33L100.5 28.5L105 28.5L104.5 30.5L104 29.5L106 33ZM100 33L99.5 34.5L93 32L93 28.5L93.5 28L97.5 29L98 28L100 28.5L100 33ZM111.5 40L107.5 42.5L104 40L106.5 36.5L111.5 40ZM112 38.5L111.5 40L109 39L112 38.5ZM104.5 44.5L102.5 44.5L103.5 42L105 42.5L104.5 44.5ZM103 42.5L99.5 40L100.5 39L103.5 39L104 38L104 40L105.5 41.5L103 42.5Z', seoul: [150,25.5] };
  const GLOBE = { R: 70, d: 'M42.5 -55.5L36 -58L34.5 -58.5L36 -57.5L34.5 -57.5L24 -61.5L25 -62L22.5 -63.5L23 -64L22 -65L23 -65L21.5 -66L11 -69L23 -66L11.5 -69L0.5 -70L11.5 -69L4.5 -70L22.5 -66.5L33 -61.5L42.5 -55.5ZM16 -67L18.5 -67L22 -65L16 -67ZM6 -67L1 -67.5L7 -68.5L9.5 -68L5 -68L6 -67ZM42.5 -55.5L28 -64L11 -69L23 -66L34 -61L44.5 -54L53 -46L42.5 -55.5ZM24 -61.5L34.5 -57.5L36 -57.5L34.5 -58.5L39 -57L36.5 -57.5L34 -56L35.5 -54L33.5 -55.5L38 -50.5L38.5 -47.5L35.5 -53L35 -51.5L32.5 -52L30 -54L30 -55L26.5 -55L26 -56L27 -56.5L23.5 -57L22 -60L24 -61.5ZM-28 -35.5L-30.5 -33.5L-31.5 -34.5L-33 -33L-35 -32.5L-36.5 -30L-39.5 -32.5L-44.5 -31.5L-44 -35.5L-45 -36L-45 -39L-46 -39.5L-49 -36L-49 -37.5L-50 -37.5L-48 -40.5L-47 -40.5L-45.5 -42L-47 -42.5L-45.5 -45L-42 -46.5L-41.5 -44.5L-39.5 -43L-37 -45.5L-33 -45L-32.5 -42.5L-30.5 -42.5L-31 -38.5L-29 -38L-28 -35.5ZM-49 -36L-46 -39.5L-45 -39L-45 -36L-44 -35.5L-45 -32.5L-44 -31.5L-42 -32.5L-42.5 -31.5L-41.5 -30L-43 -30L-44 -31L-45.5 -30.5L-47 -28L-47 -36.5L-49 -36ZM19.5 28L27 31L26 32.5L30 35L27 35L23.5 33L21 35L19 35L19.5 28ZM19.5 28L19 35L15 35L16.5 33.5L15.5 31.5L10.5 30L9.5 30.5L8.5 29L10.5 28.5L6.5 27L11 27L11.5 29L12.5 29.5L15 27.5L19.5 28ZM-8.5 21.5L-9.5 22.5L-7.5 25L-9 25L-10.5 30.5L-18 28.5L-19.5 24.5L-18.5 23L-17.5 24.5L-12.5 24L-11 21L-8.5 21.5ZM3.5 23.5L4.5 25L4 27L3 25L3.5 23.5ZM-2.5 25L0 24.5L-0.5 25.5L-6 26L-6 26.5L-5 27.5L-2 27L-4.5 28.5L-2 32L-4.5 31.5L-5 29L-6.5 32.5L-7.5 29L-6.5 26L-5 24.5L-2.5 25ZM-20 32L-11 35L-20 33.5L-23.5 32.5L-22.5 31.5L-20 32ZM-24.5 26L-22.5 28L-23 31.5L-26.5 29L-34.5 16.5L-32 17L-24.5 26ZM-69.5 5L-69.5 -1.5L-68.5 -1L-66 -6.5L-69.5 5ZM-47 -42.5L-49 -42L-51.5 -38.5L-50.5 -43L-49.5 -45.5L-45 -48L-43 -52L-37.5 -56.5L-25 -61.5L-24 -61.5L-26.5 -59L-28.5 -58.5L-28 -60L-31 -58L-29.5 -58.5L-30 -57.5L-28 -57.5L-25.5 -59L-27 -57.5L-24 -57.5L-24.5 -57L-23.5 -56L-22 -57L-22 -55L-19.5 -57L-16.5 -57.5L-22.5 -53L-16 -57L-17 -56L-15 -55.5L-14 -57L-5.5 -58L-3 -56.5L-5 -55.5L0.5 -55L2.5 -52.5L3 -53.5L5.5 -53.5L5.5 -54.5L14.5 -53.5L18 -53.5L17 -55L20 -55.5L26.5 -50.5L25 -49L25 -47L24 -47L22 -46L24.5 -41L23 -36.5L19.5 -42L21 -47L20.5 -48.5L20 -46L18.5 -47L17.5 -46.5L18 -44L10.5 -43L7 -38L12 -37L12 -32L8.5 -26L5 -24.5L5 -27.5L7 -27.5L8 -31.5L5 -30.5L2 -32.5L0 -36L-3 -36.5L-5.5 -32.5L-8.5 -33.5L-11.5 -32.5L-16.5 -34L-19 -36.5L-21 -34.5L-24 -36.5L-28 -35.5L-29 -38L-31 -38.5L-30.5 -42.5L-32.5 -42.5L-33 -45L-37 -45.5L-39.5 -43L-41.5 -44.5L-42 -46.5L-44 -45.5L-43.5 -46.5L-47 -42.5ZM-18.5 -60L-13 -60L-20 -59L-21.5 -58L-21.5 -59L-18.5 -60ZM12.5 -37.5L15.5 -33L14 -33L15.5 -29.5L14.5 -30L14.5 -29L12 -37L12 -38L12.5 -37.5ZM23.5 -55L26 -55L27 -53L23.5 -53.5L24.5 -52.5L20.5 -55L23.5 -55ZM-24.5 -61.5L-23.5 -62L-25 -62L-24 -63L-25 -63.5L-33 -61L-28 -63.5L-22.5 -63L-24.5 -61.5ZM-1.5 -67.5L-7 -67L-13 -68.5L-0.5 -70L4.5 -68.5L-1.5 -67.5ZM-66 20.5L-62 32.5L-66 23.5L-66 20.5ZM-61 -20L-60.5 -18.5L-58.5 -20L-61 -16.5L-61 -20ZM-59 -33L-56 -36L-55 -36.5L-55 -35.5L-59 -27L-60 -27L-59 -33ZM-60.5 -16.5L-59 -18.5L-59 -14.5L-61 -11.5L-63.5 -10.5L-63.5 -14L-62 -14L-60.5 -16.5ZM-26 10L-25.5 7.5L-22 8.5L-21.5 7.5L-20.5 9L-20.5 10.5L-22.5 11L-22 12L-25 12L-26 10ZM-23 8L-25.5 7.5L-26 10L-28.5 8L-30 13L-27 17L-28 17.5L-31.5 13.5L-29.5 10L-31 1.5L-27.5 -0.5L-26.5 1L-27 3.5L-24.5 2.5L-23 4L-23 8ZM-20.5 8.5L-23 8L-22.5 6.5L-24 3L-27 3.5L-26.5 1L-27.5 -0.5L-25.5 -1L-25.5 -2.5L-24.5 -0.5L-23 0L-22.5 1L-24 1.5L-20.5 6L-20.5 8.5ZM-27.5 -0.5L-31 1.5L-29.5 10L-30.5 12L-31 4.5L-31.5 3.5L-33.5 4.5L-34.5 3.5L-34 1L-35 -3L-31 -8.5L-29 -9L-28 -10.5L-28 -7L-29.5 -5L-28.5 -5L-28 -2.5L-26.5 -2L-27.5 -0.5ZM-24.5 12.5L-20.5 10.5L-20.5 6L-24 1.5L-22.5 1L-23 0L-24.5 -0.5L-25 -2.5L-21.5 -3L-19 -0.5L-22 2L-18.5 7L-18.5 11.5L-23.5 14.5L-24.5 12.5ZM5 -24.5L2.5 -21.5L3 -20L-0.5 -19.5L0 -22.5L4.5 -25L5 -24.5ZM1 -19L3 -20L4 -16L1.5 -15L1 -19ZM-27.5 -35.5L-24 -36.5L-21 -34.5L-19 -36.5L-16.5 -34L-14 -34L-13 -33L-6.5 -33L-7.5 -30.5L-5.5 -31L-4.5 -29.5L-10 -27.5L-11 -28L-13 -25.5L-18 -24.5L-24.5 -27L-25 -29L-27.5 -31L-27 -32.5L-27.5 -35.5ZM-28.5 -10.5L-29 -9L-31 -8.5L-34.5 -4L-35 -6L-35.5 -5L-35.5 -6L-34 -7.5L-36.5 -8.5L-37 -10L-38.5 -4.5L-40 -4.5L-41 -3L-47.5 0L-49 6.5L-51 8.5L-52.5 -2L-51.5 -8.5L-53.5 -9L-53.5 -13L-51.5 -12.5L-51.5 -16L-49.5 -16.5L-45 -20.5L-45 -23L-42 -23L-43 -18.5L-42 -16.5L-43.5 -15L-40 -11L-37.5 -10L-36.5 -12L-36 -10L-34 -9.5L-34 -11L-29.5 -12L-29.5 -10.5L-28.5 -10.5ZM-34.5 -4L-35.5 -2L-35.5 -5L-38 -4.5L-37 -10L-36.5 -8.5L-34 -7.5L-35.5 -6L-35.5 -5L-35 -6L-34.5 -4ZM-34 -11L-34 -9.5L-37 -10.5L-35.5 -12L-34 -11ZM-37 -12L-38.5 -10.5L-43.5 -15L-41.5 -16.5L-37 -12ZM-42 -23L-45 -23L-45 -20.5L-49.5 -16.5L-51.5 -16L-51.5 -12.5L-53.5 -13L-54 -15.5L-56.5 -17L-55 -18L-54.5 -22.5L-52 -20.5L-51 -22L-49 -21.5L-45 -26L-42.5 -25.5L-42 -23ZM-47.5 -28.5L-46 -27.5L-44.5 -28.5L-45 -26L-42.5 -25.5L-45.5 -25.5L-49 -21.5L-51 -22L-52 -20.5L-54 -21L-54.5 -22.5L-51 -28.5L-50.5 -27.5L-47.5 -28.5ZM-47 -28L-45.5 -30.5L-43 -31L-44.5 -30L-42 -28.5L-42.5 -26L-45 -26L-44.5 -28.5L-47 -28ZM-42 -32.5L-39.5 -32.5L-36.5 -30L-43.5 -29L-44.5 -30L-41.5 -30L-42.5 -31.5L-42 -32.5ZM-50 -37.5L-49 -37.5L-48.5 -35.5L-47 -36.5L-47 -29L-50.5 -27.5L-51 -32L-52.5 -32.5L-51 -35.5L-50 -36L-50 -37.5ZM-59 -27L-57 -32.5L-53 -38L-53.5 -36.5L-52.5 -37L-54 -33L-51 -32.5L-50.5 -29.5L-54.5 -22.5L-55 -18L-56.5 -17L-58.5 -19L-58 -21L-59.5 -22L-59 -27ZM-59 -35L-56 -38.5L-55.5 -36.5L-57.5 -34.5L-59 -34L-59 -35ZM-33 -61L-24 -63L-37 -58.5L-33 -61ZM-38.5 -55.5L-43.5 -52L-42.5 -54L-38.5 -55.5ZM-43 -52L-45 -48L-49 -46.5L-48 -48.5L-49 -48L-46 -52L-42.5 -54L-43 -52ZM-40.5 -55.5L-45 -52.5L-39.5 -57.5L-38.5 -57.5L-40.5 -55.5ZM-48.5 -48.5L-50.5 -47L-49.5 -49L-46 -52L-48.5 -48.5ZM-55 -35.5L-56 -38.5L-56.5 -37.5L-56.5 -40L-52.5 -44.5L-53 -41.5L-52 -40.5L-55 -35.5ZM42 54L40 55.5L42.5 51.5L43 52.5L44.5 52L42 54ZM20.5 60.5L20 62L18 62L18 61L20.5 60.5ZM1 57L-7 58.5L-10 58L-9.5 56.5L-12.5 51.5L-11.5 52L-12.5 48.5L-5 46.5L1 41.5L5.5 42L6.5 39.5L9 39L8 38L13.5 38.5L12.5 41.5L17.5 44L20.5 36.5L22 40.5L23.5 40.5L24 44L26.5 45L29.5 48.5L28 54L23.5 58.5L20 60L15 60L13 58.5L13 57.5L11.5 58.5L13 56.5L11 58L6.5 56L1 57ZM-47.5 10.5L-49 12L-48.5 7L-47.5 10.5ZM-18 3.5L-18.5 2L-16 1.5L-18 3.5ZM-36.5 -30L-35 -32.5L-27.5 -35.5L-27 -32.5L-27.5 -31L-25 -29L-24.5 -27L-18 -24.5L-13 -25.5L-11 -28L-4.5 -29.5L-5.5 -31L-7.5 -31L-6.5 -33L-4.5 -33L-3 -36.5L0.5 -36L2 -32.5L5 -30.5L8 -31.5L7 -27.5L5 -27.5L5 -24.5L4.5 -25L3 -23.5L1.5 -23.5L-2.5 -20.5L-4 -20.5L-3 -23L-7 -20.5L-5 -18.5L-2.5 -18.5L-6 -16L-3 -12L-3.5 -7.5L-7 -3.5L-10 -1.5L-16 0L-16.5 1L-17 0L-20 -1L-21.5 -3L-25.5 -2.5L-26.5 -1L-28 -2.5L-28.5 -5L-29.5 -5L-27.5 -9L-29.5 -10.5L-29.5 -12L-33 -11L-35.5 -12L-36.5 -11L-36.5 -12L-39 -13L-42 -16.5L-43 -18.5L-41.5 -21.5L-42.5 -24L-42 -28.5L-36.5 -30ZM-3.5 -3L-5 0L-5.5 -2L-4 -4L-3.5 -3ZM-51 -39.5L-51.5 -36.5L-53.5 -35.5L-53 -38L-51 -39.5ZM-50.5 -43L-51.5 -38.5L-52 -41L-50.5 -43ZM1.5 16.5L0.5 20L-1.5 17L-3.5 18L-2 16L0.5 16L0.5 15L1.5 16.5ZM-3 4.5L-4 9.5L-1 10L-1 11.5L-5 10L-4.5 9L-6 8L-5 4L-3 4.5ZM0.5 12L1 13.5L0 13L0 14.5L-1 11.5L0.5 12ZM-29.5 16.5L-26 18L-25 23L-28 21L-29.5 16.5ZM-8.5 21.5L-11 21L-12.5 24L-17.5 24.5L-18.5 23L-16.5 23.5L-13 20.5L-11.5 21L-10 18L-7 20L-8.5 21.5ZM-25 -61.5L-34 -58L-34.5 -59L-31.5 -60.5L-24 -63L-25 -62L-23.5 -62L-25 -61.5ZM-68 -15.5L-66.5 -18.5L-67.5 -10.5L-68 -15.5ZM16 -21.5L15 -16.5L11 -14.5L10 -15.5L6 -14.5L7 -13.5L6.5 -11.5L5.5 -11.5L4.5 -14L7.5 -16.5L10.5 -16.5L11.5 -19L12 -18.5L13.5 -20L14 -23.5L15 -24L16 -21.5ZM17 -27.5L17.5 -28L18 -26.5L16 -25L14.5 -25.5L13.5 -24L14.5 -29L17 -27.5ZM7.5 -14L9 -15L10 -14.5L8 -13L7.5 -14ZM-63.5 -14L-64.5 -10L-67.5 -10L-66 -16L-65.5 -13.5L-64.5 -14.5L-63.5 -14ZM-61 -32L-59 -33L-61.5 -18.5L-60.5 -15.5L-62 -14L-64.5 -14.5L-65.5 -13.5L-66 -16L-66.5 -15L-65.5 -20.5L-61 -32ZM-65 -23.5L-64 -28.5L-59 -38L-65 -23.5ZM-67.5 -3.5L-68.5 -1L-70 -2.5L-68 -15.5L-67.5 -3.5ZM-66.5 -6.5L-67.5 -3.5L-68 -8.5L-68 -9.5L-68 -7.5L-66.5 -6.5Z', seoul: [2,-18.5] };
  // 지구본: 가운데 (cx, cy)
  const globe = (cx, cy, uid) => `<defs><clipPath id="${uid}"><circle cx="${cx}" cy="${cy}" r="${GLOBE.R}"/></clipPath></defs>`
    + `<path d="M${cx - 82} ${cy + 24} A86 86 0 0 0 ${cx + 30} ${cy + 80}" stroke="${C.muted}" stroke-width="5" fill="none" stroke-linecap="round"/>`
    + `<path d="M${cx} ${cy + 72} V${cy + 96} M${cx - 34} ${cy + 100} H${cx + 34}" stroke="${C.muted}" stroke-width="7" stroke-linecap="round"/>`
    + `<circle cx="${cx}" cy="${cy}" r="${GLOBE.R}" fill="${C.sky}"/>`
    + `<g clip-path="url(#${uid})"><path transform="translate(${cx} ${cy})" d="${GLOBE.d}" fill="${C.green}" stroke="${C.green}" stroke-width=".8" stroke-linejoin="round"/></g>`
    + `<circle cx="${cx}" cy="${cy}" r="${GLOBE.R}" fill="none" stroke="${C.blue}" stroke-width="2.5"/>`;
  // 세계 지도: 왼쪽 위 (x, y)
  const worldMap = (x, y) => `<rect x="${x}" y="${y}" width="${WORLD.W}" height="${WORLD.H}" fill="${C.sky}" stroke="${C.blue}" stroke-width="2.5"/>`
    + `<path transform="translate(${x} ${y})" d="${WORLD.d}" fill="${C.green}" stroke="${C.green}" stroke-width=".6" stroke-linejoin="round"/>`;
  // 하늘에서 찍은 마을(실제 장소 아님): 가로 200 × 세로 270, 왼쪽 위 0 0
  // 하늘에서 찍은 마을(실제 장소 아님): 가로 200 × 세로 270, 왼쪽 위 0 0. 학교 운동장 가운데가 (133, 93), 역은 (148, 146)
  const town = () => {
    let o = `<rect width="200" height="270" fill="${C.mint}"/>`;
    o += `<path d="M0 222 Q70 206 110 226 T200 216 V244 Q150 254 110 254 T0 252 Z" fill="${C.sky}" stroke="${C.blue}" stroke-width="2"/>`;
    o += `<path d="M0 120 H200 M92 0 V270" stroke="${C.line}" stroke-width="12"/>`;
    const roofs = [[16, 26, 28, 22, C.peach], [50, 24, 30, 28, 'white'], [18, 58, 24, 20, C.lilac], [48, 62, 32, 22, C.sky], [16, 88, 30, 22, 'white'], [54, 92, 26, 18, C.peach], [168, 52, 22, 30, 'white'], [104, 188, 30, 20, C.sky], [142, 190, 26, 18, C.peach], [176, 186, 16, 22, C.lilac], [110, 20, 22, 18, C.lilac], [140, 22, 30, 16, 'white']];
    roofs.forEach(([x, y, w, h, c]) => { o += `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="2" fill="${c}" stroke="${C.muted}" stroke-width="1.5"/>`; });
    // 학교(건물 + 운동장), 역(긴 건물), 공원(나무)
    o += `<rect x="106" y="50" width="54" height="22" rx="2" fill="${C.peach}" stroke="${C.orange}" stroke-width="2"/><rect x="106" y="78" width="54" height="30" rx="14" fill="${C.yellow}" stroke="${C.orange}" stroke-width="2"/>`;
    o += `<rect x="114" y="136" width="66" height="20" rx="2" fill="${C.lilac}" stroke="${C.purple}" stroke-width="2"/>`;
    [[22, 190], [40, 180], [58, 192], [74, 182]].forEach(([x, y]) => { o += `<circle cx="${x}" cy="${y}" r="10" fill="${C.green}"/>`; });
    return o;
  };

  // ── 공간 자료: 지구본 · 세계 지도 · 디지털 공간 영상 정보 카드가 차례로 나오고, 모두 같은 곳(우리나라)을 짚는다 ──
  (function () {
    const id = 't61-s2-gonggan';
    let css = base(id);
    const CARD = [115, 320, 525], CT = 66, CH = 236;
    const pin = (x, y) => `<path d="M${x} ${y} C${x - 4} ${y - 9} ${x - 10} ${y - 13} ${x - 10} ${y - 20} A10 10 0 0 1 ${x + 10} ${y - 20} C${x + 10} ${y - 13} ${x + 4} ${y - 9} ${x} ${y} Z" fill="${C.red}" stroke="white" stroke-width="1.5"/><circle cx="${x}" cy="${y - 20}" r="3.5" fill="white"/>`;
    const card = (cx, inner) => `<rect x="${cx - 94}" y="${CT}" width="188" height="${CH}" rx="14" fill="white" stroke="${C.line}" stroke-width="3"/>${inner}`;
    let body = '';
    // 1칸: 지구본
    const gc = [CARD[0], 170];
    body += at(1, 'pop', card(CARD[0], globe(gc[0], gc[1], `${id}-gclip`)) + text(CARD[0], 330, '지구본', { size: 22 }));
    // 2칸: 세계 지도
    const mx = CARD[1] - WORLD.W / 2, my = 140;
    body += at(2, 'pop', card(CARD[1], worldMap(mx, my)) + text(CARD[1], 330, '세계 지도', { size: 22 }));
    // 3칸: 스마트폰 화면 속 하늘에서 찍은 마을
    const ph = [CARD[2] - 54, 92];
    let phone = `<rect x="${ph[0]}" y="${ph[1]}" width="108" height="184" rx="14" fill="${C.ink}"/>`;
    phone += `<defs><clipPath id="${id}-pclip"><rect x="${ph[0] + 7}" y="${ph[1] + 14}" width="94" height="156" rx="3"/></clipPath></defs>`;
    phone += `<g clip-path="url(#${id}-pclip)"><g transform="translate(${ph[0] + 7} ${ph[1] + 14}) scale(.58)">${town()}</g></g>`;
    body += at(3, 'pop', card(CARD[2], phone) + text(CARD[2], 324, '디지털 공간', { size: 19 }) + text(CARD[2], 348, '영상 정보', { size: 19 }));
    body += shown(3, `<path class="twk" d="M${ph[0] + 7} ${ph[1] + 60} H${ph[0] + 101}" stroke="white" stroke-width="2.5" opacity=".8"/>`);
    // 4칸: 세 자료 모두 우리나라 자리를 짚는다 + 묶음 이름
    body += at(4, 'drop', pin(gc[0] + GLOBE.seoul[0], gc[1] + GLOBE.seoul[1]), 0.3);
    body += at(4, 'drop', pin(mx + WORLD.seoul[0], my + WORLD.seoul[1]), 0.5);
    body += at(4, 'drop', pin(ph[0] + 7 + 133 * 0.58, ph[1] + 14 + 100 * 0.58), 0.7);
    body += shown(4, `<path class="draw draw4" pathLength="1" d="M22 58 V46 H618 V58" stroke="${C.green}" stroke-width="3.5" fill="none" stroke-linejoin="round"/>`);
    body += at(4, 'pop', `<rect x="${320 - tagW('공간 자료', 24) / 2 - 8}" y="20" width="${tagW('공간 자료', 24) + 16}" height="44" fill="${C.paper}"/>` + tag(320, 42, '공간 자료', OK, { size: 24 }), 0.9);
    put('6-1/사회/3-1/공간 자료', svg(id, body, css));
  })();

  // ── 디지털 공간 영상 정보: 위성이 찍은 사진 위에 길·이름을 얹고, 손가락으로 벌려 확대한다 ──
  (function () {
    const id = 't61-s2-digital';
    // 화면 안쪽: x 392~568, y 102~332
    const SX = 392, SY = 102, SW = 176, SH = 230, MX = SX - 12, MY = SY - 20;
    const ZX = MX + 133, ZY = MY + 82; // 확대 가운데(학교 운동장, 핀 머리)
    let css = base(id) + `
    .sc-${id} .cover { transform-box: fill-box; transform-origin: 50% 100%; transition: transform 1.8s ease-in-out .4s; }
    .on1 .sc-${id} .cover { transform: scaleY(0); }
    .sc-${id} .zm { transform-origin: ${ZX}px ${ZY}px; transition: transform 1.8s ease-in-out .6s; }
    .on3 .sc-${id} .zm { transform: translate(${SX + SW / 2 - ZX}px, ${SY + 116 - ZY}px) scale(1.8); }
    .sc-${id} .fa, .sc-${id} .fb { transition: transform 1.6s ease-in-out .6s; }
    .on3 .sc-${id} .fa { transform: translate(-34px, -34px); }
    .on3 .sc-${id} .fb { transform: translate(34px, 34px); }`;
    let body = '';
    // 휴대 전화
    body += `<rect x="${SX - 14}" y="${SY - 26}" width="${SW + 28}" height="${SH + 46}" rx="22" fill="${C.ink}"/>`;
    body += `<defs><clipPath id="${id}-clip"><rect x="${SX}" y="${SY}" width="${SW}" height="${SH}" rx="4"/></clipPath></defs>`;
    let map = `<g transform="translate(${MX} ${MY})">${town()}</g>`;
    // 2칸: 얹는 지리 정보(길·이름·경로·핀)
    let info = `<path d="M${MX} ${MY + 120} H${MX + 200} M${MX + 92} ${MY} V${MY + 270}" stroke="white" stroke-width="4" stroke-dasharray="10 8"/>`;
    info += `<path class="draw draw2" pathLength="1" d="M${MX + 147} ${MY + 136} V${MY + 120} H${MX + 133} V${MY + 108}" stroke="${C.blue}" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
    const lab = (x, y, s, w) => `<rect x="${x - w / 2}" y="${y - 14}" width="${w}" height="28" rx="6" fill="white" stroke="${C.ink}" stroke-width="2"/>` + text(x, y + 6.5, s, { size: 18 });
    info += g('pop pop2', lab(MX + 133, MY + 37, '학교', 52), 0.6) + g('pop pop2', lab(MX + 147, MY + 172, '역', 34), 0.8) + g('pop pop2', lab(MX + 48, MY + 152, '공원', 52), 1);
    info += g('drop drop2', `<path d="M${ZX} ${ZY + 12} C${ZX - 4} ${ZY + 3} ${ZX - 10} ${ZY - 1} ${ZX - 10} ${ZY - 8} A10 10 0 0 1 ${ZX + 10} ${ZY - 8} C${ZX + 10} ${ZY - 1} ${ZX + 4} ${ZY + 3} ${ZX} ${ZY + 12} Z" fill="${C.red}" stroke="white" stroke-width="1.5"/><circle cx="${ZX}" cy="${ZY - 8}" r="3.5" fill="white"/>`, 1.3);
    map += `<g class="b2">${info}</g>`;
    body += `<g clip-path="url(#${id}-clip)"><g class="zm">${map}</g><rect class="cover" x="${SX}" y="${SY}" width="${SW}" height="${SH}" fill="${C.ink}"/></g>`;
    // 3칸: 손가락 둘이 벌어지고, + 단추가 반짝인다
    const fx = SX + SW / 2 + 10, fy = SY + 170;
    body += `<g class="b3 h4"><g class="fa"><circle cx="${fx - 12}" cy="${fy - 12}" r="15" fill="${C.peach}" fill-opacity=".85" stroke="${C.orange}" stroke-width="3"/></g><g class="fb"><circle cx="${fx + 12}" cy="${fy + 12}" r="15" fill="${C.peach}" fill-opacity=".85" stroke="${C.orange}" stroke-width="3"/></g></g>`;
    body += at(3, 'pop', `<rect x="${SX + SW - 40}" y="${SY + 66}" width="32" height="64" rx="8" fill="white" stroke="${C.muted}" stroke-width="2"/><path d="M${SX + SW - 32} ${SY + 82} H${SX + SW - 16} M${SX + SW - 24} ${SY + 74} V${SY + 90} M${SX + SW - 32} ${SY + 114} H${SX + SW - 16}" stroke="${C.ink}" stroke-width="3.5" stroke-linecap="round"/>`, 0.2);
    body += glowRect(SX + SW - 40, SY + 66, 32, 32, 3, C.orange, 0.6, 8);
    // 위성: 하늘에서 화면 쪽으로 찍는다
    const sat = `<rect x="-14" y="-10" width="28" height="20" rx="3" fill="white" stroke="${C.ink}" stroke-width="2.5"/><rect x="-54" y="-8" width="34" height="16" fill="${C.sky}" stroke="${C.blue}" stroke-width="2"/><rect x="20" y="-8" width="34" height="16" fill="${C.sky}" stroke="${C.blue}" stroke-width="2"/><path d="M-20 0 H-14 M14 0 H20 M-37 -8 V8 M37 -8 V8" stroke="${C.blue}" stroke-width="2"/><circle cx="0" cy="14" r="5" fill="${C.ink}"/>`;
    body += at(1, 'pop', `<g class="bob"><g transform="translate(${SX + SW / 2} 38)">${sat}</g></g>`);
    body += shown(1, `<path class="mar" d="M${SX + SW / 2 - 6} 58 L${SX + 20} ${SY - 30} M${SX + SW / 2 + 6} 58 L${SX + SW - 20} ${SY - 30}" stroke="${C.orange}" stroke-width="3" stroke-dasharray="8 8" fill="none"/>`, 4);
    // 왼쪽: 칸마다 하는 일 이름
    body += at(1, 'pop', tag(190, 120, '하늘에서 찍은 사진', COLD, { size: 20 }), 0.6);
    body += at(2, 'pop', tag(190, 180, '+ 길·장소 이름', HOT, { size: 20 }), 0.3);
    body += at(3, 'pop', tag(190, 240, '확대·이동', OLD, { size: 20 }), 0.3);
    body += shown(2, g('fin fin2', flow([[300, 180], [364, 180]], C.orange), 0.5), 3);
    body += shown(3, g('fin fin3', flow([[262, 240], [364, 240]], C.purple), 0.5), 4);
    body += at(4, 'pop', tag(190, 312, '디지털 공간 영상 정보', OK, { size: 21 }));
    body += glowRect(SX - 14, SY - 26, SW + 28, SH + 46, 4, C.green, 0.4, 22);
    put('6-1/사회/3-1/디지털 공간 영상 정보', svg(id, body, css));
  })();
})(typeof window !== 'undefined' ? window : globalThis);
