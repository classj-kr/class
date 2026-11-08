// 사회 4-1 1-1 낱말 도식: 지도·방위·방위표·기호·범례·축척·등고선·높낮이·약도·노선도.
// 지도는 손으로 그린 실제 지역이 아니다. 마을·산·강·노선은 모두 가상의 단순한 모형이다.
// - 기호: 교과서(미래엔 20쪽 '산, 강, 학교, 병원 등')의 네 가지만 쓴다. 산은 세모, 학교는 깃발, 병원은 동그라미 안 십자, 강은 파란 띠.
// - 방위표: 미래엔 18쪽 '여러 가지 방위표'(북 화살표, 4방위, 8방위)와 '방위표가 없다면 지도의 위쪽이 북쪽'.
// - 축척: 미래엔 22쪽 막대 축척(0—1 km)과 축척 막대자, '4 cm이므로 실제 거리는 4 km' 꼴을 가상 마을로 옮겼다.
// - 등고선: 아이스크림 23쪽 '등고선 간격이 좁을수록 경사가 가파른 곳'. 왼쪽은 완만, 오른쪽은 가파른 가상의 산.
// - 높낮이: 미래엔 26쪽 색 차례(낮은 곳부터 초록색, 연두색, 노란색, 갈색, 진한 갈색). 이 다섯 색만 kit 밖 색이다.
// - 노선도: 미래엔 29쪽 '버스가 지나가는 정류장 순서와 방향'. 정류장 이름은 가상(시장·학교·병원·도서관·공원·역).
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
  const glowRect = (x, y, w, h, n, color = C.green, delay = 0, rx = 12) =>
    `<g class="b${n}"><rect class="flash flash${n}"${dl(delay)} x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="${rx}" fill="none" stroke="${color}" stroke-width="5"/></g>`;
  const glowPath = (d, n, color = C.green, delay = 0, w = 5) => `<g class="b${n}"><path class="flash flash${n}"${dl(delay)} d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"/></g>`;
  const ring = (cx, cy, r, n, color = C.green, s = 0) => `<g class="b${n}"><circle class="ring ring${n}"${dl(s)} cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${color}" stroke-width="4"/></g>`;
  // 칸마다 자리를 옮기는 것: pts = [[x,y] (1칸), [x,y] (2칸) …], 빈 칸은 앞 칸 자리를 그대로 쓴다
  const mvStyle = (pts, extra = '') => {
    const out = [];
    for (let n = 1; n <= 5; n++) { const p = pts[Math.min(n, pts.length) - 1]; out.push(`--x${n}:${f(p[0])}px;--y${n}:${f(p[1])}px`); }
    return out.join(';') + (extra ? ';' + extra : '');
  };
  // 사람 아이콘: (x, y) 는 발밑 가운데
  const person = (x, y, color = C.green, s = 1) => `<circle cx="${f(x)}" cy="${f(y - 27 * s)}" r="${f(7.5 * s)}" fill="${color}"/><path d="M${f(x - 11 * s)} ${f(y)} V${f(y - 9 * s)} Q${f(x - 11 * s)} ${f(y - 18 * s)} ${f(x)} ${f(y - 18 * s)} Q${f(x + 11 * s)} ${f(y - 18 * s)} ${f(x + 11 * s)} ${f(y - 9 * s)} V${f(y)} Z" fill="${color}"/>`;
  const tree = (x, y, r = 9) => `<circle cx="${f(x)}" cy="${f(y)}" r="${r}" fill="${C.green}"/><circle cx="${f(x - r * 0.3)}" cy="${f(y - r * 0.3)}" r="${f(r * 0.4)}" fill="${C.mint}" opacity=".55"/>`;
  // pathLength=1 로 긋기
  const drawP = (d, n, color, w, sec = 1.4, s = 0, extra = '') => `<g class="b${n}"><path class="draw draw${n}" pathLength="1" style="transition-duration:${sec}s;transition-delay:${s}s" d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"${extra}/></g>`;
  const KEY = (w) => `4-1/사회/1-1/${w}`;

  // 장면마다 같이 쓰는 움직임
  const base = (id) => {
    let s = `
    .sc-${id} .pop, .sc-${id} .pulse, .sc-${id} .ring { transform-box: fill-box; transform-origin: center; }
    .sc-${id} .twk { animation: ${id}-twk 1.6s ease-in-out infinite alternate; }
    .sc-${id} .mar { animation: ${id}-mar .7s linear infinite; }
    .sc-${id} .draw { stroke-dasharray: 1 1; stroke-dashoffset: 1; transition: stroke-dashoffset 1.4s ease-in-out .2s; }
    .sc-${id} .grow { transform-box: fill-box; transform-origin: 0 50%; transform: scaleX(0); transition: transform 1.2s ease-in-out .2s; }
    .sc-${id} .growy { transform-box: fill-box; transform-origin: 50% 100%; transform: scaleY(0); transition: transform 1.2s ease-out .2s; }
    .sc-${id} .mv { transform: translate(var(--x1), var(--y1)); transition: transform 1.4s ease-in-out .3s, opacity .6s ease; }
    .sc-${id} .sway { animation: ${id}-sway 4s ease-in-out infinite; }
    .sc-${id} .jig { animation: ${id}-jig 1.3s ease-in-out infinite; }
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
    @keyframes ${id}-sway { 0%, 100% { transform: translateX(-26px); } 50% { transform: translateX(26px); } }
    @keyframes ${id}-jig { 0%, 100% { transform: translate(0, 0); } 25% { transform: translate(2.5px, -2px); } 50% { transform: translate(-2px, 1.5px); } 75% { transform: translate(1.5px, 2.5px); } }
    @keyframes ${id}-bob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-7px); } }
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
    .on${n} .sc-${id} .grow${n} { transform: scaleX(1); }
    .on${n} .sc-${id} .growy${n} { transform: scaleY(1); }`;
    for (let n = 2; n <= 5; n++) s += `
    .on${n} .sc-${id} .mv { transform: translate(var(--x${n}), var(--y${n})); }`;
    return s;
  };

  // ════ 지도 기호(교과서의 산·강·학교·병원). (x, y) 는 가운데, s 는 크기 ════
  const symMt = (x, y, s = 1) => `<path d="M${f(x)} ${f(y - 13 * s)} L${f(x + 15 * s)} ${f(y + 11 * s)} L${f(x - 15 * s)} ${f(y + 11 * s)} Z" fill="${C.ink}" stroke="${C.ink}" stroke-width="${f(2 * s)}" stroke-linejoin="round"/>`;
  const symSchool = (x, y, s = 1) => `<path d="M${f(x - 9 * s)} ${f(y + 14 * s)} V${f(y - 14 * s)}" stroke="${C.ink}" stroke-width="${f(3.2 * s)}" stroke-linecap="round"/><path d="M${f(x - 9 * s)} ${f(y - 14 * s)} H${f(x + 13 * s)} V${f(y)} H${f(x - 9 * s)} Z" fill="${C.ink}"/>`;
  const symHosp = (x, y, s = 1) => `<circle cx="${f(x)}" cy="${f(y)}" r="${f(13 * s)}" fill="white" stroke="${C.ink}" stroke-width="${f(2.6 * s)}"/><path d="M${f(x)} ${f(y - 8 * s)} V${f(y + 8 * s)} M${f(x - 8 * s)} ${f(y)} H${f(x + 8 * s)}" stroke="${C.red}" stroke-width="${f(4.2 * s)}"/>`;
  const symRiver = (x, y, s = 1) => {
    const d = `M${f(x - 17 * s)} ${f(y + 4 * s)} Q${f(x - 8 * s)} ${f(y - 7 * s)} ${f(x)} ${f(y)} T${f(x + 17 * s)} ${f(y - 4 * s)}`;
    return `<path d="${d}" stroke="${C.blue}" stroke-width="${f(11 * s)}" fill="none" stroke-linecap="round"/><path d="${d}" stroke="${C.sky}" stroke-width="${f(6 * s)}" fill="none" stroke-linecap="round"/>`;
  };
  const SYM = { 산: symMt, 강: symRiver, 학교: symSchool, 병원: symHosp };
  // 집(옆에서 본 작은 집): (x, y) 는 바닥 가운데
  const house = (x, y, s = 1, fill = C.peach, stroke = C.orange) => `<path d="M${f(x - 16 * s)} ${f(y - 18 * s)} L${f(x)} ${f(y - 32 * s)} L${f(x + 16 * s)} ${f(y - 18 * s)} Z" fill="${stroke}" stroke="${stroke}" stroke-width="2" stroke-linejoin="round"/><rect x="${f(x - 12 * s)}" y="${f(y - 18 * s)}" width="${f(24 * s)}" height="${f(18 * s)}" fill="${fill}" stroke="${stroke}" stroke-width="2"/><rect x="${f(x - 3.5 * s)}" y="${f(y - 10 * s)}" width="${f(7 * s)}" height="${f(10 * s)}" fill="${stroke}"/>`;

  // ════ 가상 마을(가로세로 240). 같은 자리를 하늘에서 본 모습(aerial)과 지도(mapBase + 기호)로 그린다 ════
  const RIVER = 'M-4 198 C60 176 100 216 150 196 S214 174 244 186';
  const HOUSES = [[10, 128, 22, 16], [36, 134, 18, 14], [12, 152, 18, 16], [100, 36, 22, 18], [104, 64, 18, 16], [124, 44, 16, 16], [96, 92, 24, 16],
    [160, 128, 18, 16], [184, 132, 22, 14], [212, 128, 20, 18], [166, 152, 20, 14], [194, 154, 16, 14], [218, 154, 18, 14]];
  const ROOF = [C.peach, 'white', C.lilac, C.sky];
  const aerial = () => {
    let o = `<rect width="240" height="240" fill="${C.mint}"/>`;
    // 논밭
    o += `<rect x="162" y="208" width="72" height="28" fill="#eef3c6" stroke="${C.line}" stroke-width="1.5"/><path d="M162 217 H234 M162 226 H234" stroke="#cfdb94" stroke-width="2"/>`;
    o += `<rect x="8" y="212" width="58" height="24" fill="#eef3c6" stroke="${C.line}" stroke-width="1.5"/><path d="M27 212 V236 M46 212 V236" stroke="#cfdb94" stroke-width="2"/>`;
    // 강
    o += `<path d="${RIVER}" stroke="${C.blue}" stroke-width="26" fill="none" opacity=".55"/><path d="${RIVER}" stroke="${C.sky}" stroke-width="20" fill="none"/>`;
    o += `<path d="M20 190 q8 -4 16 0 M110 202 q8 -4 16 0 M196 180 q8 -4 16 0" stroke="white" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;
    // 산: 나무가 빽빽한 둥근 덩이, 꼭대기로 갈수록 짙다
    o += `<ellipse cx="54" cy="58" rx="50" ry="44" fill="#a9d39b"/><ellipse cx="56" cy="54" rx="34" ry="29" fill="#7cb46d"/><ellipse cx="58" cy="50" rx="17" ry="14" fill="${C.green}"/>`;
    [[20, 40], [30, 82], [86, 34], [90, 74], [48, 92], [16, 64], [74, 18], [36, 22]].forEach(([x, y]) => { o += `<circle cx="${x}" cy="${y}" r="6" fill="#5f9d55"/>`; });
    // 길(가로 하나, 세로 하나)과 다리
    o += `<path d="M0 118 H240 M146 0 V240" stroke="#b5c4be" stroke-width="11"/><path d="M0 118 H240 M146 0 V240" stroke="white" stroke-width="1.6" stroke-dasharray="7 7"/>`;
    o += `<path d="M139 180 V210 M153 180 V210" stroke="${C.muted}" stroke-width="2.5"/>`;
    // 집 지붕
    HOUSES.forEach(([x, y, w, h], i) => { o += `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="2" fill="${ROOF[i % 4]}" stroke="${C.muted}" stroke-width="1.5"/>`; });
    // 학교: 건물과 운동장
    o += `<rect x="170" y="30" width="58" height="20" rx="2" fill="${C.peach}" stroke="${C.orange}" stroke-width="2"/><rect x="170" y="58" width="58" height="40" rx="18" fill="#f3dfb0" stroke="${C.orange}" stroke-width="2"/>`;
    o += `<ellipse cx="199" cy="78" rx="20" ry="10" fill="none" stroke="white" stroke-width="2"/>`;
    // 병원: 흰 큰 건물
    o += `<rect x="74" y="134" width="50" height="32" rx="2" fill="white" stroke="${C.muted}" stroke-width="2"/><rect x="80" y="140" width="38" height="20" fill="${C.sky}" opacity=".7"/>`;
    // 나무
    [[134, 100], [160, 104], [230, 104], [8, 104], [60, 128], [60, 158], [234, 168], [130, 150]].forEach(([x, y]) => { o += tree(x, y, 6); });
    return o;
  };
  // 지도: 흰 종이 위 길·강·집 자리(기호는 따로 얹는다)
  const mapBase = () => {
    let o = `<rect width="240" height="240" fill="white"/>`;
    o += `<path d="${RIVER}" stroke="${C.blue}" stroke-width="22" fill="none"/><path d="${RIVER}" stroke="${C.sky}" stroke-width="17" fill="none"/>`;
    o += `<path d="M0 118 H240 M146 0 V240" stroke="${C.ink}" stroke-width="10"/><path d="M0 118 H240 M146 0 V240" stroke="white" stroke-width="6.5"/>`;
    HOUSES.forEach(([x, y, w, h]) => { o += `<rect x="${x + 2}" y="${y + 2}" width="${w - 4}" height="${h - 4}" fill="${C.line}"/>`; });
    return o;
  };
  // 마을 지도에 얹는 기호 자리
  const MAPSYM = [['산', 58, 54, 1.5], ['학교', 199, 64, 1.3], ['병원', 99, 150, 1.25]];

  // ════ 1. 지도: 하늘에서 본 마을 → 일정하게 줄임 → 약속된 기호 ════
  (function () {
    const id = 't41-s1-jido';
    const AX = 30, AY = 72, PX = 410, PY = 102, K = 0.75;
    let css = base(id) + `
    .sc-${id} .shrink { transform: none; transition: transform 1.7s ease-in-out .5s; }
    .on2 .sc-${id} .shrink { transform: translate(${PX}px, ${PY}px) scale(${K}) translate(${-AX}px, ${-AY}px); }`;
    let body = '';
    // 1칸: 하늘에서 본 마을과 지나가는 구름
    body += at(1, 'fin', `<g transform="translate(${AX} ${AY})">${aerial()}</g><rect x="${AX}" y="${AY}" width="240" height="240" fill="none" stroke="${C.line}" stroke-width="3"/>`);
    body += shown(1, `<g class="sway"><ellipse cx="110" cy="140" rx="46" ry="16" fill="white" opacity=".75"/><ellipse cx="132" cy="130" rx="28" ry="14" fill="white" opacity=".75"/></g><g class="sway" style="animation-delay:-2s"><ellipse cx="200" cy="250" rx="40" ry="14" fill="white" opacity=".7"/></g>`, 2);
    body += at(1, 'pop', tag(150, 40, '하늘에서 본 모습', COLD, { size: 20 }), 0.4);
    // 2칸: 오른쪽 종이 위로 줄어들며 옮겨 간다
    body += at(2, 'fin', `<rect x="${PX - 10}" y="${PY - 10}" width="${240 * K + 20}" height="${240 * K + 20}" rx="6" fill="white" stroke="${C.line}" stroke-width="3"/>`);
    body += `<g class="b2 h3"><g class="shrink"><g transform="translate(${AX} ${AY})">${aerial()}</g></g></g>`;
    body += shown(2, g('fin fin2', flow([[282, 192], [394, 192]], C.orange), 0.4));
    body += at(2, 'pop', tag(340, 156, '줄이기', HOT, { size: 20 }), 0.6);
    // 3칸: 종이 위 모습이 지도로 바뀌고 기호가 하나씩
    let mp = shown(3, g('fin fin3', mapBase()));
    MAPSYM.forEach(([k, x, y, s], i) => { mp += at(3, 'pop', SYM[k](x, y, s), 0.6 + i * 0.35); });
    body += `<g transform="translate(${PX} ${PY}) scale(${K})">${mp}</g>`;
    body += at(3, 'pop', tag(500, 326, '약속된 기호', OLD, { size: 20 }), 1.6);
    // 4칸
    body += at(4, 'pop', tag(500, 62, '지도', OK, { size: 24 }));
    body += glowRect(PX - 10, PY - 10, 240 * K + 20, 240 * K + 20, 4, C.green, 0.3, 8);
    put(KEY('지도'), svg(id, body, css));
  })();

  // 산 그림(옆에서 본 모습): (x, y) 는 밑변 가운데, 너비 w, 높이 h
  const hill = (x, y, w, h) => `<path d="M${f(x - w / 2)} ${f(y)} Q${f(x - w * 0.22)} ${f(y - h * 0.55)} ${f(x - w * 0.06)} ${f(y - h)} Q${f(x + w * 0.04)} ${f(y - h * 1.04)} ${f(x + w * 0.12)} ${f(y - h * 0.92)} Q${f(x + w * 0.3)} ${f(y - h * 0.5)} ${f(x + w / 2)} ${f(y)} Z" fill="#a9d39b" stroke="${C.green}" stroke-width="3" stroke-linejoin="round"/>`;

  // ════ 2. 방위: 반대쪽을 본 두 친구의 '오른쪽'은 다르지만 '동쪽'은 하나 ════
  (function () {
    const id = 't41-s1-bangwi';
    let css = base(id);
    const CX = 320, CY = 196, MX = 548;
    let body = '';
    // 바탕: 운동장, 동쪽 산, 서쪽 냇물
    body += `<ellipse cx="${CX}" cy="${CY}" rx="160" ry="104" fill="#f6ead2" stroke="${C.orange}" stroke-width="2.5" opacity=".9"/>`;
    body += `<path d="M78 24 C58 90 102 140 80 200 S62 300 84 344" stroke="${C.sky}" stroke-width="34" fill="none" stroke-linecap="round"/><path d="M78 24 C58 90 102 140 80 200 S62 300 84 344" stroke="${C.blue}" stroke-width="3" fill="none" stroke-dasharray="10 12" class="mar"/>`;
    body += hill(MX, 236, 110, 92) + text(MX, 268, '산', { size: 20, color: C.green });
    body += tag(82, 328, '냇물', COLD, { size: 18 });
    // 두 친구와 보는 쪽(부채꼴)
    const A = [292, 222], B = [350, 222];
    body += at(1, 'fin', `<path d="M${A[0]} ${A[1] - 46} L${A[0] - 36} 112 Q${A[0]} 100 ${A[0] + 36} 112 Z" fill="${C.green}" opacity=".18"/>`, 0.3);
    body += at(1, 'fin', `<path d="M${B[0]} ${B[1] + 4} L${B[0] - 36} 292 Q${B[0]} 304 ${B[0] + 36} 292 Z" fill="${C.orange}" opacity=".2"/>`, 0.5);
    body += at(1, 'pop', person(A[0], A[1], C.green, 1.4), 0.1) + at(1, 'pop', person(B[0], B[1], C.orange, 1.4), 0.2);
    body += shown(1, `<g class="bob">${head(A[0], 118, -Math.PI / 2, C.green, 4)}</g><g class="bob" style="animation-delay:.7s">${head(B[0], 288, Math.PI / 2, C.orange, 4)}</g>`);
    // 2칸: 각자의 '오른쪽'
    body += shown(2, g('fin fin2', flow([[A[0] + 14, 160], [MX - 58, 160]], C.green), 0.2), 3);
    body += shown(2, g('fin fin2', flow([[B[0] - 14, 244], [112, 244]], C.orange), 0.8), 3);
    body += `<g class="b2 h3">${g('pop pop2', tag(430, 128, '오른쪽', OK, { size: 20 }), 0.5)}${g('pop pop2', tag(214, 272, '오른쪽', HOT, { size: 20 }), 1.1)}</g>`;
    // 3칸: 동서남북을 정하면 둘 다 같은 쪽을 가리킨다
    body += at(3, 'fin', `<path d="M${CX} 58 V334 M36 ${CY} H604" stroke="${C.muted}" stroke-width="2" stroke-dasharray="6 8"/>`);
    const LET = [['북', CX, 36], ['남', CX, 340], ['동', 616, CY], ['서', 26, CY]];
    LET.forEach(([l, x, y], i) => { body += at(3, 'pop', `<circle cx="${x}" cy="${y}" r="19" fill="white" stroke="${C.ink}" stroke-width="2.5"/>` + text(x, y + 7, l, { size: 20 }), 0.2 + i * 0.15); });
    body += shown(3, g('fin fin3', flow([[A[0] + 14, 160], [MX - 58, 160]], C.green), 0.9));
    body += shown(3, g('fin fin3', flow([[B[0] + 14, 244], [MX - 58, 244]], C.orange), 1.1));
    body += at(3, 'pop', tag(MX, 304, '동쪽', OLD, { size: 20 }), 1.4);
    // 4칸
    body += at(4, 'pop', tag(470, 40, '방위', OLD, { size: 24 }));
    LET.forEach(([, x, y], i) => { body += `<g class="b4"><circle class="flash flash4"${dl(0.3 + i * 0.15)} cx="${x}" cy="${y}" r="23" fill="none" stroke="${C.purple}" stroke-width="4"/></g>`; });
    put(KEY('방위'), svg(id, body, css));
  })();

  // 방위표: (x, y) 가운데, r 팔 길이, kind 'arrow'(북 화살표만)·'four'·'eight'
  const rose = (x, y, r, kind, { size = 20 } = {}) => {
    let o = '';
    const arm = (ang, len, w, fill) => {
      const tx = x + len * Math.cos(ang), ty = y + len * Math.sin(ang), px = Math.cos(ang + Math.PI / 2) * w, py = Math.sin(ang + Math.PI / 2) * w;
      return `<path d="M${f(x + px)} ${f(y + py)} L${f(tx)} ${f(ty)} L${f(x - px)} ${f(y - py)} Z" fill="${fill}" stroke="${C.ink}" stroke-width="2" stroke-linejoin="round"/>`;
    };
    if (kind === 'arrow') {
      o += `<path d="M${x} ${f(y + r)} V${f(y - r + 10)}" stroke="${C.ink}" stroke-width="4"/>` + `<path d="M${x} ${f(y - r)} L${f(x - 11)} ${f(y - r + 18)} L${x} ${f(y - r + 12)} Z" fill="${C.ink}"/><path d="M${x} ${f(y - r)} L${f(x + 11)} ${f(y - r + 18)} L${x} ${f(y - r + 12)} Z" fill="white" stroke="${C.ink}" stroke-width="2" stroke-linejoin="round"/>`;
      o += text(x, f(y - r - 10), '북', { size });
      return o;
    }
    [0, 1, 2, 3].forEach((i) => { o += arm(-Math.PI / 2 + i * Math.PI / 2, r, r * 0.16, i === 0 ? C.red : 'white'); });
    o += `<circle cx="${x}" cy="${y}" r="${f(r * 0.12)}" fill="${C.ink}"/>`;
    const L = r + size * 0.85;
    o += text(x, f(y - L + size * 0.35), '북', { size, color: C.red }) + text(x, f(y + L + size * 0.35), '남', { size }) + text(f(x + L), f(y + size * 0.35), '동', { size }) + text(f(x - L), f(y + size * 0.35), '서', { size });
    return o;
  };

  // ════ 3. 방위표 ════
  (function () {
    const id = 't41-s1-bangwipyo';
    let css = base(id);
    const P = [30, 52, 270, 278]; // 종이 x, y, 너비, 높이
    let body = '';
    // 지도 종이(가상의 간단한 지도)
    body += `<rect x="${P[0]}" y="${P[1]}" width="${P[2]}" height="${P[3]}" rx="6" fill="white" stroke="${C.line}" stroke-width="3"/>`;
    body += `<path d="M30 292 C90 270 150 310 210 288 S280 276 300 284" stroke="${C.blue}" stroke-width="20" fill="none"/><path d="M30 292 C90 270 150 310 210 288 S280 276 300 284" stroke="${C.sky}" stroke-width="15" fill="none"/>`;
    body += `<path d="M30 190 H300 M226 52 V330" stroke="${C.ink}" stroke-width="10"/><path d="M30 190 H300 M226 52 V330" stroke="white" stroke-width="6.5"/>`;
    body += symMt(84, 104, 1.4) + symMt(124, 124, 1.1) + symSchool(176, 128, 1.2) + symHosp(100, 236, 1.2) + symSchool(184, 240, 1.2);
    // 1칸: 구석의 작은 방위표
    body += `<g class="b1 h3">${g('drop drop1', rose(264, 116, 26, 'arrow', { size: 18 }), 0.3)}</g>` + ring(264, 116, 30, 1, C.orange, 0.8);
    body += shown(1, g('fin fin1', flow([[300, 112], [380, 146]], C.orange), 1.2), 3);
    body += `<g class="b1 h3">${g('pop pop1', rose(470, 180, 70, 'four', { size: 22 }), 1.4)}</g>`;
    // 2칸: 8방위로 늘어난다
    const D8 = [['북동', -45], ['남동', 45], ['남서', 135], ['북서', -135]];
    D8.forEach(([l, a], i) => {
      const r = a * Math.PI / 180, tx = 470 + 52 * Math.cos(r), ty = 180 + 52 * Math.sin(r), px = Math.cos(r + Math.PI / 2) * 7, py = Math.sin(r + Math.PI / 2) * 7;
      body += `<g class="b2 h3">${g('pop pop2', `<path d="M${f(470 + px)} ${f(180 + py)} L${f(tx)} ${f(ty)} L${f(470 - px)} ${f(180 - py)} Z" fill="${C.sky}" stroke="${C.ink}" stroke-width="2" stroke-linejoin="round"/>` + text(f(470 + 84 * Math.cos(r)), f(180 + 84 * Math.sin(r) + 7), l, { size: 19, color: C.blue }), 0.2 + i * 0.25)}</g>`;
    });
    // 3칸: 방위표가 없으면 위쪽이 북쪽
    body += glowPath(`M${P[0] + 6} ${P[1]} H${P[0] + P[2] - 6}`, 3, C.orange, 0.3, 7);
    body += `<g class="b3 h4">${g('pop pop3', `<g class="bob"><path d="M470 220 V96" stroke="${C.orange}" stroke-width="10" stroke-linecap="round"/>${head(470, 84, -Math.PI / 2, C.orange, 10)}</g>`, 0.4)}${g('pop pop3', tag(470, 262, '위쪽이 북쪽', HOT, { size: 22 }), 0.8)}</g>`;
    body += at(3, 'pop', text(165, 36, '북', { size: 22, color: C.orange }), 0.6);
    // 4칸: 다시 방위표
    body += at(4, 'drop', rose(264, 116, 26, 'arrow', { size: 18 }), 0.1);
    body += at(4, 'pop', rose(470, 172, 70, 'four', { size: 22 }), 0.3);
    body += at(4, 'pop', tag(470, 316, '방위표', OK, { size: 24 }), 0.6);
    body += glowRect(352, 60, 236, 222, 4, C.green, 0.8, 16);
    put(KEY('방위표'), svg(id, body, css));
  })();

  // ════ 4. 기호: 실제 모습 → 생김새를 본뜬 표시 ════
  (function () {
    const id = 't41-s1-giho';
    let css = base(id);
    const XS = [92, 244, 396, 548], NAMES = ['산', '강', '학교', '병원'];
    let body = '';
    // 실제 모습(위)
    const pics = [
      (x) => hill(x - 18, 140, 96, 70) + hill(x + 26, 140, 80, 54) + [[x - 36, 132], [x - 16, 120], [x + 22, 130], [x + 40, 134]].map(([tx, ty]) => `<path d="M${tx} ${ty - 12} L${tx + 6} ${ty} L${tx - 6} ${ty} Z" fill="#5f9d55"/>`).join(''),
      (x) => `<rect x="${x - 60}" y="62" width="120" height="80" rx="10" fill="${C.mint}"/><path d="M${x - 60} 124 C${x - 20} 96 ${x + 10} 134 ${x + 60} 90" stroke="${C.blue}" stroke-width="30" fill="none"/><path d="M${x - 60} 124 C${x - 20} 96 ${x + 10} 134 ${x + 60} 90" stroke="#9cc3ea" stroke-width="24" fill="none"/><path d="M${x - 40} 112 q8 -4 16 0 M${x + 14} 104 q8 -4 16 0" stroke="white" stroke-width="2.5" fill="none" stroke-linecap="round"/>`,
      (x) => `<rect x="${x - 50}" y="96" width="100" height="44" fill="${C.peach}" stroke="${C.orange}" stroke-width="2.5"/>` + [0, 1, 2, 3].map((i) => `<rect x="${x - 42 + i * 22}" y="104" width="14" height="12" fill="white" stroke="${C.orange}" stroke-width="1.5"/>`).join('') + `<rect x="${x - 9}" y="122" width="18" height="18" fill="${C.orange}"/><path d="M${x} 96 V62" stroke="${C.ink}" stroke-width="3"/><path class="pf" d="M${x} 62 H${x + 26} V78 H${x} Z" fill="${C.red}"/>`,
      (x) => `<rect x="${x - 46}" y="84" width="92" height="56" fill="white" stroke="${C.muted}" stroke-width="2.5"/>` + [0, 1, 2].map((i) => `<rect x="${x - 38 + i * 28}" y="112" width="20" height="12" fill="${C.sky}" stroke="${C.blue}" stroke-width="1.5"/>`).join('') + `<circle cx="${x}" cy="98" r="11" fill="white" stroke="${C.red}" stroke-width="2"/><path d="M${x} 91 V105 M${x - 7} 98 H${x + 7}" stroke="${C.red}" stroke-width="4"/>`
    ];
    XS.forEach((x, i) => {
      body += at(1, 'rise', text(x, 40, NAMES[i], { size: 22 }) + pics[i](x), 0.2 + i * 0.3);
      // 2칸: 본뜬 기호
      body += shown(2, g('fin fin2', flow([[x, 152], [x, 196]], C.muted, { w: 4 }), i * 0.4));
      body += at(2, 'pop', `<rect x="${x - 38}" y="204" width="76" height="76" rx="12" fill="white" stroke="${C.line}" stroke-width="3"/>` + SYM[NAMES[i]](x, 242, 1.6), 0.5 + i * 0.4);
    });
    // 2칸 끝: 본뜬 자리가 함께 반짝인다(학교 깃발, 병원 십자, 산 모양)
    body += glowRect(XS[2] - 4, 56, 36, 28, 2, C.orange, 2.4, 6) + glowRect(XS[3] - 16, 82, 32, 32, 2, C.orange, 2.4, 16);
    // 3칸
    body += at(3, 'pop', tag(320, 324, '기호', OLD, { size: 24 }));
    body += glowRect(40, 198, 560, 88, 3, C.purple, 0.4, 16);
    put(KEY('기호'), svg(id, body, css));
  })();

  // ════ 5. 범례: 지도에 쓰인 기호와 그 뜻을 한곳에 ════
  (function () {
    const id = 't41-s1-beomrye';
    let css = base(id);
    let body = '';
    const RV = 'M30 262 C100 236 170 284 250 258 S340 240 380 252';
    body += `<rect x="30" y="40" width="350" height="290" rx="6" fill="white" stroke="${C.line}" stroke-width="3"/>`;
    body += `<path d="${RV}" stroke="${C.blue}" stroke-width="22" fill="none"/><path d="${RV}" stroke="${C.sky}" stroke-width="17" fill="none"/>`;
    body += `<path d="M30 160 H380 M270 40 V330" stroke="${C.ink}" stroke-width="10"/><path d="M30 160 H380 M270 40 V330" stroke="white" stroke-width="6.5"/>`;
    [[60, 190], [96, 196], [300, 180], [300, 296], [150, 196], [180, 200], [210, 104], [200, 126]].forEach(([x, y]) => { body += `<rect x="${x}" y="${y}" width="16" height="12" fill="${C.line}"/>`; });
    const ON = { 산: [[78, 92], [140, 78]], 강: [], 학교: [[330, 100], [126, 214]], 병원: [[230, 104], [334, 204]] };
    let k = 0;
    Object.entries(ON).forEach(([name, pts]) => pts.forEach(([x, y]) => { body += at(1, 'pop', SYM[name](x, y, 1.3), 0.2 + (k++) * 0.15); }));
    // 2칸: 범례 상자, 기호가 날아가 줄을 선다
    const LX = 456, ROWS = [['산', 104, [78, 92]], ['강', 162, [200, 262]], ['학교', 220, [330, 100]], ['병원', 278, [230, 104]]];
    body += at(2, 'fin', `<rect x="420" y="62" width="190" height="258" rx="12" fill="white" stroke="${C.ink}" stroke-width="2.5"/>`);
    ROWS.forEach(([name, y, from], i) => {
      body += `<g class="b2"><g class="mv" style="${mvStyle([[from[0] - LX, from[1] - y], [0, 0]])};transition:transform 1.1s ease-in-out ${0.2 + i * 0.2}s">${SYM[name](LX, y, 1.3)}</g></g>`;
      body += at(2, 'rise', text(500, y + 7, name, { size: 22, anchor: 'start' }), 1.0 + i * 0.25);
    });
    // 3칸: 범례의 병원 → 지도의 병원 두 곳
    body += glowRect(428, 254, 174, 48, 3, C.red, 0.2, 10);
    ON.병원.forEach(([x, y], i) => { body += ring(x, y, 18, 3, C.red, 1 + i * 0.3) + `<g class="b3"><circle class="pulse pulse3" cx="${x}" cy="${y}" r="21" fill="none" stroke="${C.red}" stroke-width="3.5"${dl(1 + i * 0.3)}/></g>`; });
    body += shown(3, g('fin fin3', flow([[426, 278], [356, 222]], C.red, { w: 4 }), 0.8));
    // 4칸
    body += at(4, 'pop', tag(515, 36, '범례', OK, { size: 24 }));
    body += glowRect(420, 62, 190, 258, 4, C.green, 0.3, 12);
    put(KEY('범례'), svg(id, body, css));
  })();

  // ════ 6. 축척: 막대 축척 한 칸 = 1 km, 막대자로 재어 실제 거리 ════
  (function () {
    const id = 't41-s1-chukcheok';
    const U = 70, HX = 110, SX = HX + 4 * U, RY = 150; // 집 x, 학교 x, 길 y
    let css = base(id) + `
    .sc-${id} .ruler { transform: translate(0, 128px); transition: transform 1.5s ease-in-out .5s; }
    .on2 .sc-${id} .ruler { transform: translate(0, 0); }`;
    let body = '';
    // 지도 종이
    body += `<rect x="30" y="30" width="580" height="236" rx="6" fill="white" stroke="${C.line}" stroke-width="3"/>`;
    body += `<path d="M250 30 C236 90 270 130 252 180 S240 240 258 266" stroke="${C.blue}" stroke-width="20" fill="none"/><path d="M250 30 C236 90 270 130 252 180 S240 240 258 266" stroke="${C.sky}" stroke-width="15" fill="none"/>`;
    body += `<path d="M30 ${RY} H610" stroke="${C.ink}" stroke-width="10"/><path d="M30 ${RY} H610" stroke="white" stroke-width="6.5"/>`;
    body += symMt(520, 84, 1.4) + symMt(566, 100, 1.1) + symMt(60, 70, 1.1);
    [[160, 98], [186, 104], [316, 100], [530, 172], [150, 226], [186, 232]].forEach(([x, y]) => { body += `<rect x="${x}" y="${y}" width="16" height="12" fill="${C.line}"/>`; });
    body += house(HX, RY - 8, 1.1) + symSchool(SX + 12, RY - 26, 1.3);
    body += `<circle cx="${HX}" cy="${RY}" r="6" fill="${C.red}" stroke="white" stroke-width="2"/><circle cx="${SX}" cy="${RY}" r="6" fill="${C.red}" stroke="white" stroke-width="2"/>`;
    body += text(HX, 86, '집', { size: 20 }) + text(SX, 86, '학교', { size: 20 });
    // 막대 축척(종이 오른쪽 아래): 막대 한 칸 U = 1 km
    const BX = 480, BY = 226;
    const bar = `<rect x="${BX}" y="${BY - 6}" width="${U}" height="12" fill="white" stroke="${C.ink}" stroke-width="2.5"/><rect x="${BX}" y="${BY - 6}" width="${U / 2}" height="12" fill="${C.ink}"/>` + text(BX, BY + 30, '0', { size: 18 }) + text(BX + U, BY + 30, '1 km', { size: 18 });
    body += at(1, 'pop', bar, 0.2) + glowRect(BX - 8, BY - 14, U + 16, 28, 1, C.orange, 0.8, 6);
    // 2칸: 축척과 같은 눈금을 새긴 막대자가 올라와 집에 0을 맞춘다
    let rul = `<rect x="${HX - 14}" y="${RY + 12}" width="${5 * U + 28}" height="46" rx="6" fill="#fff6dc" stroke="${C.orange}" stroke-width="2.5"/>`;
    for (let i = 0; i <= 5; i++) rul += `<path d="M${HX + i * U} ${RY + 12} V${RY + 26}" stroke="${C.ink}" stroke-width="2.5"/>` + text(HX + i * U, RY + 48, i, { size: 18 });
    for (let i = 0; i < 5; i++) rul += `<path d="M${HX + i * U + U / 2} ${RY + 12} V${RY + 20}" stroke="${C.ink}" stroke-width="1.5"/>`;
    rul += text(HX + 5 * U + 28, RY + 48, 'km', { size: 18, anchor: 'start' });
    body += `<g class="b2"><g class="ruler">${rul}</g></g>`;
    // 3칸: 한 칸씩 세어 4 km
    for (let i = 0; i < 4; i++) body += at(3, 'fin', `<rect x="${HX + i * U + 2}" y="${RY + 28}" width="${U - 4}" height="8" rx="3" fill="${C.orange}"/>`, 0.2 + i * 0.35);
    body += ring(SX, RY + 30, 14, 3, C.red, 1.6);
    body += at(3, 'pop', tag((HX + SX) / 2, 54, '4 km', HOT, { size: 24 }), 1.8);
    body += shown(3, g('fin fin3', `<path d="M${HX + 34} 74 H${SX - 40}" stroke="${C.orange}" stroke-width="3"/>${head(HX + 26, 74, Math.PI, C.orange, 3)}${head(SX - 32, 74, 0, C.orange, 3)}`, 1.8));
    // 4칸
    body += at(4, 'pop', tag(BX + U / 2 + 7, 302, '축척', OK, { size: 24 }));
    body += glowRect(BX - 20, BY - 16, U + 54, 56, 4, C.green, 0.3, 8);
    put(KEY('축척'), svg(id, body, css));
  })();

  // 단면 h(x) 에서 높이 L 을 넘는 구간 [a, b] 들
  const spans = (h, L, x0, x1) => {
    const out = []; let a = null;
    for (let x = x0; x <= x1; x += 0.25) { const up = h(x) > L; if (up && a == null) a = x; if (!up && a != null) { out.push([a, x]); a = null; } }
    if (a != null) out.push([a, x1]);
    return out;
  };
  // 위에서 본 고리: 가운데 cx, 왼쪽 반지름 rl, 오른쪽 반지름 rr, 세로 반지름 ry
  const loop = (cx, cy, rl, rr, ry) => `M${f(cx - rl)} ${cy} A${f(rl)} ${f(ry)} 0 0 1 ${f(cx)} ${f(cy - ry)} A${f(rr)} ${f(ry)} 0 0 1 ${f(cx + rr)} ${cy} A${f(rr)} ${f(ry)} 0 0 1 ${f(cx)} ${f(cy + ry)} A${f(rl)} ${f(ry)} 0 0 1 ${f(cx - rl)} ${cy} Z`;

  // ════ 7. 등고선: 옆에서 본 산을 높이마다 자르고, 같은 높이를 위에서 이으면 고리 ════
  (function () {
    const id = 't41-s1-deunggoseon';
    let css = base(id);
    const XL = 100, XP = 410, XR = 540, TOP = 400, YB = 170, KY = 0.3, CY = 272;
    const h = (x) => (x <= XL || x >= XR ? 0 : x <= XP ? TOP * (1 - Math.pow((XP - x) / (XP - XL), 1.5)) : TOP * (1 - Math.pow((x - XP) / (XR - XP), 1.5)));
    const ys = (m) => YB - m * KY;
    const pts = []; for (let x = XL; x <= XR; x += 2) pts.push(`${x} ${f(ys(h(x)))}`);
    const side = `M${XL} ${YB} L${pts.join(' L')} Z`;
    let body = '';
    // 1칸: 옆에서 본 산과 높이마다 긋는 가로줄
    body += at(1, 'fin', `<path d="M60 ${YB} H580" stroke="${C.muted}" stroke-width="2.5"/><path d="${side}" fill="#cfe8c4" stroke="${C.green}" stroke-width="3" stroke-linejoin="round"/>`);
    const LV = [100, 200, 300];
    const ext = LV.map((L) => spans(h, L, XL, XR)[0]);
    LV.forEach((L, i) => {
      body += drawP(`M96 ${f(ys(L))} H548`, 1, C.purple, 2.5, 1, 0.4 + i * 0.4);
      body += at(1, 'fin', text(88, f(ys(L) + 6), `${L} m`, { size: 18, color: C.purple, anchor: 'end' }), 0.6 + i * 0.4);
    });
    // 2칸: 자른 자리를 아래로 내려 위에서 본 고리를 긋는다
    const RY = [62, 46, 28];
    LV.forEach((L, i) => {
      const [a, b] = ext[i], y = f(ys(L)), s = 0.1 + i * 0.4;
      body += at(2, 'pop', `<circle cx="${f(a)}" cy="${y}" r="5" fill="${C.purple}"/><circle cx="${f(b)}" cy="${y}" r="5" fill="${C.purple}"/>`, s);
      body += drawP(`M${f(a)} ${y} V${CY}`, 2, C.muted, 1.8, 0.6, s, ' stroke-dasharray="1 1"').replace('class="draw draw2"', 'class="draw draw2 dash"');
      body += drawP(`M${f(b)} ${y} V${CY}`, 2, C.muted, 1.8, 0.6, s, '').replace('class="draw draw2"', 'class="draw draw2 dash"');
      body += drawP(loop(XP, CY, XP - a, b - XP, RY[i]), 2, C.purple, 3.5, 0.9, s + 0.3);
      body += at(2, 'pop', `<rect x="${f(a + 4)}" y="${CY - 12}" width="38" height="24" rx="4" fill="${C.paper}"/>` + text(f(a + 23), CY + 7, L, { size: 18, color: C.purple }), s + 1.0);
    });
    css += `.sc-${id} .dash { stroke-dasharray: .03 .02; stroke-dashoffset: 0; opacity: 0; transition: opacity .8s ease; } .on2 .sc-${id} .dash { opacity: .8; }`;
    body += at(2, 'pop', `<circle cx="${XP}" cy="${CY}" r="5" fill="${C.ink}"/>`, 1.5);
    // 3칸: 오른쪽은 고리가 촘촘(가파름), 왼쪽은 성김(완만함)
    const rightD = `M${XP} ${ys(TOP)} ` + pts.filter((p) => +p.split(' ')[0] >= XP).map((p) => 'L' + p).join(' ');
    const leftD = `M${XL} ${YB} ` + pts.filter((p) => +p.split(' ')[0] <= XP).map((p) => 'L' + p).join(' ');
    body += glowPath(rightD, 3, C.orange, 0.2, 6) + glowPath(leftD, 3, C.blue, 0.9, 6);
    body += at(3, 'pop', tag(588, CY, '가파름', HOT, { size: 20 }), 0.4);
    body += at(3, 'pop', tag(58, CY, '완만함', COLD, { size: 20 }), 1.1);
    // 4칸
    body += at(4, 'pop', tag(220, 46, '등고선', OLD, { size: 24 }));
    LV.forEach((L, i) => { const [a, b] = ext[i]; body += glowPath(loop(XP, CY, XP - a, b - XP, RY[i]), 4, C.purple, 0.3 + i * 0.2, 5); });
    put(KEY('등고선'), svg(id, body, css));
  })();

  // ════ 8. 높낮이: 앞에서는 보이고 위에서는 안 보이는 높고 낮음 → 색으로 ════
  (function () {
    const id = 't41-s1-nopnaji';
    let css = base(id);
    // 교과서 색 차례(미래엔 26쪽): 낮은 곳부터 초록색, 연두색, 노란색, 갈색, 진한 갈색
    const BAND = ['#6fb465', '#b6dc84', '#f1dc7c', '#cf9757', '#94602f'];
    const X0 = 60, X1 = 520, YB = 150, KY = 0.24, CY = 272;
    const h = (x) => 450 * Math.exp(-(((x - 360) / 85) ** 2)) + 230 * Math.exp(-(((x - 170) / 60) ** 2));
    const ys = (m) => YB - m * KY;
    const pts = []; for (let x = X0; x <= X1; x += 2) pts.push(`${x} ${f(ys(h(x)))}`);
    const side = `M${X0} ${YB} L${pts.join(' L')} L${X1} ${YB} Z`;
    let body = `<defs><clipPath id="${id}-side"><path d="${side}"/></clipPath><clipPath id="${id}-top"><rect x="${X0}" y="190" width="${X1 - X0}" height="160" rx="10"/></clipPath></defs>`;
    // 1칸: 앞에서 본 모습(솟아오른다)
    body += `<g class="b1"><g class="growy growy1"><path d="${side}" fill="#cfe8c4"/>`;
    // 3칸: 같은 높이 띠를 색으로
    BAND.forEach((c, i) => { body += `<g class="b3"><g class="fin fin3"${dl(0.2 + i * 0.35)}><rect clip-path="url(#${id}-side)" x="${X0}" y="${f(ys((i + 1) * 100))}" width="${X1 - X0}" height="${f(100 * KY + 0.6)}" fill="${c}"/></g></g>`; });
    body += `<path d="${side}" fill="none" stroke="${C.green}" stroke-width="3" stroke-linejoin="round"/></g></g>`;
    body += `<path d="M40 ${YB} H540" stroke="${C.muted}" stroke-width="2.5"/>`;
    body += at(1, 'pop', tag(130, 44, '앞에서 본 모습', COLD, { size: 20 }), 1);
    body += shown(1, `<g class="bob">${head(360, f(ys(450) - 10), -Math.PI / 2, C.red, 4)}</g>`, 2);
    // 2칸: 위에서 본 모습(나무 덮인 평평한 땅)
    let top = `<rect x="${X0}" y="190" width="${X1 - X0}" height="160" fill="#a9d39b"/>`;
    const rnd = seeded(41);
    let trees = '';
    for (let i = 0; i < 60; i++) trees += `<circle cx="${f(X0 + 10 + rnd() * (X1 - X0 - 20))}" cy="${f(200 + rnd() * 140)}" r="${f(5 + rnd() * 4)}" fill="#7cb46d"/>`;
    // 3칸: 높이에 따라 색을 칠한 고리
    let rings = '';
    [100, 200, 300, 400].forEach((L, li) => {
      spans(h, L, X0, X1).forEach(([a, b]) => {
        let cx = a, hm = -1; for (let x = a; x <= b; x += 0.5) if (h(x) > hm) { hm = h(x); cx = x; }
        const ry = Math.min(72, 0.55 * (b - a) / 2);
        rings += `<g class="fin fin3"${dl(0.55 + li * 0.35)}><path d="${loop(f(cx), CY, cx - a, b - cx, ry)}" fill="${BAND[li + 1]}" stroke="${C.ink}" stroke-width="1.2" stroke-opacity=".45"/></g>`;
      });
    });
    body += shown(2, `<g clip-path="url(#${id}-top)">${top}<g class="b3"><g class="fin fin3"${dl(0.2)}><rect x="${X0}" y="190" width="${X1 - X0}" height="160" fill="${BAND[0]}"/></g>${rings}</g><g class="b2 h3">${trees}</g></g><rect x="${X0}" y="190" width="${X1 - X0}" height="160" rx="10" fill="none" stroke="${C.line}" stroke-width="2.5"/>`);
    body += at(2, 'pop', tag(148, 212, '위에서 본 모습', COLD, { size: 18 }), 0.3);
    body += `<g class="b2 h3">${g('pop pop2', `<g class="jig">${tag(330, 280, '?', PLAIN, { size: 30 })}</g>`, 0.8)}</g>`;
    // 3칸: 범례(색 차례)
    for (let i = 0; i < 5; i++) {
      const y = 310 - i * 30;
      body += at(3, 'pop', `<rect x="548" y="${y}" width="28" height="30" fill="${BAND[i]}" stroke="${C.ink}" stroke-width="1.2" stroke-opacity=".5"/>`, 0.2 + i * 0.35);
      body += at(3, 'fin', text(584, y + 36, i * 100, { size: 18, anchor: 'start', color: C.ink }), 0.2 + i * 0.35);
    }
    body += at(3, 'fin', text(570, 178, '높이(m)', { size: 18, color: C.muted }), 0.2);
    // 4칸
    body += at(4, 'pop', tag(480, 46, '높낮이', OK, { size: 24 }));
    body += shown(4, `<g class="bob">${head(360, f(ys(450) - 10), -Math.PI / 2, C.red, 4)}</g><g class="bob" style="animation-delay:.7s">${head(265, f(ys(h(265)) - 8), Math.PI / 2, C.blue, 4)}</g>`);
    body += glowRect(544, 186, 36, 158, 4, C.green, 0.4, 6);
    put(KEY('높낮이'), svg(id, body, css));
  })();

  // ════ 9. 약도: 빽빽한 지도에서 필요한 길과 건물만 남긴다 ════
  (function () {
    const id = 't41-s1-yakdo';
    let css = base(id);
    const P = [40, 30, 560, 300];
    const ST = [104, 290], TURN = [104, 116], EN = [500, 116];
    let body = `<rect x="${P[0]}" y="${P[1]}" width="${P[2]}" height="${P[3]}" rx="8" fill="white" stroke="${C.line}" stroke-width="3"/>`;
    // 지울 것: 골목·집·나무·다른 기호
    let busy = '';
    const lanes = 'M40 200 H600 M40 60 H600 M40 260 C200 240 300 280 600 250 M200 30 V330 M330 30 V330 M450 30 C440 120 470 220 455 330 M560 30 V330 M150 116 C170 170 140 220 170 330 M260 200 L330 140';
    busy += `<path d="${lanes}" stroke="#b5c4be" stroke-width="7" fill="none"/>`;
    const rnd = seeded(77);
    const near = (x, y) => (Math.abs(x - ST[0]) < 24 && y > 100) || (Math.abs(y - TURN[1]) < 22 && x < 540) || (x > 470 && x < 560 && y > 84 && y < 150) || (x > 130 && x < 220 && y > 62 && y < 112) || (x > 290 && x < 370 && y > 62 && y < 112);
    for (let i = 0; i < 70; i++) {
      const x = 50 + rnd() * 530, y = 40 + rnd() * 270;
      if (near(x, y)) continue;
      busy += rnd() < 0.7 ? `<rect x="${f(x)}" y="${f(y)}" width="${f(12 + rnd() * 10)}" height="${f(10 + rnd() * 8)}" rx="2" fill="${ROOF[i % 4]}" stroke="${C.muted}" stroke-width="1.2"/>` : tree(x, y, 6);
    }
    busy += symMt(560, 60, 1.1) + symHosp(400, 240, 1) + symSchool(250, 290, 1);
    body += `<g class="b1 h2">${busy}</g>`;
    // 남길 것: 가는 길과 눈에 띄는 건물
    body += `<path d="M${ST[0]} 330 V${TURN[1]} H600" stroke="${C.muted}" stroke-width="12" fill="none"/><path d="M${ST[0]} 330 V${TURN[1]} H600" stroke="white" stroke-width="8" fill="none"/>`;
    body += symSchool(176, 86, 1.2) + symHosp(330, 86, 1.2);
    body += `<rect x="478" y="70" width="44" height="28" rx="3" fill="${C.lilac}" stroke="${C.purple}" stroke-width="2.5"/>`;
    body += house(ST[0] + 36, 300, 1, C.peach, C.orange);
    // 2칸: 남은 것이 고리로 드러난다
    [[176, 80], [330, 86], [500, 84], [140, 286]].forEach(([x, y], i) => { body += ring(x, y, 22, 2, C.orange, 0.5 + i * 0.25); });
    // 3칸: 길을 따라 화살표, 이름표
    body += shown(3, g('fin fin3', flow([[ST[0], 300], TURN, [EN[0] - 14, EN[1]]], C.orange, { w: 6 }), 0.2));
    body += at(3, 'pop', tag(ST[0] + 88, 292, '출발', HOT, { size: 18 }), 0.4);
    body += at(3, 'pop', text(176, 60, '학교', { size: 19 }), 0.8) + at(3, 'pop', text(330, 60, '병원', { size: 19 }), 1.1);
    body += at(3, 'pop', text(500, 60, '도서관', { size: 19, color: C.purple }), 1.4) + at(3, 'pop', tag(560, 150, '도착', OLD, { size: 18 }), 1.6);
    // 4칸
    body += at(4, 'pop', tag(330, 230, '약도', OK, { size: 26 }));
    body += glowRect(P[0], P[1], P[2], P[3], 4, C.green, 0.3, 8);
    put(KEY('약도'), svg(id, body, css));
  })();

  // ════ 10. 노선도: 구불구불한 길의 정류장을 곧은 줄 위에 차례로 ════
  (function () {
    const id = 't41-s1-noseondo';
    const CP = [[70, 150], [160, 68], [262, 138], [346, 56], [456, 124], [566, 64]];
    const NAMES = ['시장', '학교', '병원', '도서관', '공원', '역'];
    const LY = 290, LX = (i) => 80 + i * 96;
    // 점들을 지나는 매끈한 곡선(캣멀롬 → 3차 곡선)
    const seg = [];
    for (let i = 0; i < CP.length - 1; i++) {
      const p0 = CP[Math.max(0, i - 1)], p1 = CP[i], p2 = CP[i + 1], p3 = CP[Math.min(CP.length - 1, i + 2)];
      seg.push([p1, [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6], [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6], p2]);
    }
    const road = `M${CP[0][0]} ${CP[0][1]} ` + seg.map(([, a, b, c]) => `C${f(a[0])} ${f(a[1])} ${f(b[0])} ${f(b[1])} ${c[0]} ${c[1]}`).join(' ');
    const bez = ([p, a, b, c], t) => { const u = 1 - t; return [0, 1].map((k) => u * u * u * p[k] + 3 * u * u * t * a[k] + 3 * u * t * t * b[k] + t * t * t * c[k]); };
    // 버스가 곡선을 따라가는 열쇠틀(정류장마다 잠깐 선다)
    const total = seg.length, kf = [];
    seg.forEach((s, i) => {
      for (let j = 0; j <= 8; j++) { const p = bez(s, j / 8); kf.push([f(4 + ((i + j / 8 * 0.8) / total) * 86), p]); }
      kf.push([f(4 + ((i + 1) / total) * 86), s[3]]);
    });
    let css = base(id) + `
    .sc-${id} .busA { animation: ${id}-busA 7s linear infinite; }
    @keyframes ${id}-busA { 0% { opacity: 0; transform: translate(${CP[0][0]}px, ${CP[0][1]}px); } ${kf.map(([pc, p]) => `${pc}% { opacity: 1; transform: translate(${f(p[0])}px, ${f(p[1])}px); }`).join(' ')} 100% { opacity: 0; transform: translate(${CP[5][0]}px, ${CP[5][1]}px); } }
    .sc-${id} .busB { animation: ${id}-busB 6s ease-in-out infinite; }
    @keyframes ${id}-busB { 0% { opacity: 0; transform: translate(${LX(0)}px, ${LY}px); } 4% { opacity: 1; } ${[1, 2, 3, 4, 5].map((i) => `${f(4 + i * 17 - 7)}% { transform: translate(${LX(i)}px, ${LY}px); } ${f(4 + i * 17)}% { transform: translate(${LX(i)}px, ${LY}px); }`).join(' ')} 96% { opacity: 1; } 100% { opacity: 0; transform: translate(${LX(5)}px, ${LY}px); } }`;
    const bus = `<g transform="translate(0 -16)"><rect x="-20" y="-11" width="40" height="22" rx="6" fill="${C.orange}" stroke="${C.ink}" stroke-width="2"/><rect x="-15" y="-7" width="9" height="7" rx="1.5" fill="white"/><rect x="-3" y="-7" width="9" height="7" rx="1.5" fill="white"/><rect x="9" y="-7" width="7" height="7" rx="1.5" fill="white"/><circle cx="-11" cy="11" r="4" fill="${C.ink}"/><circle cx="11" cy="11" r="4" fill="${C.ink}"/></g>`;
    let body = '';
    // 1칸: 마을 사이 구불구불한 길
    const rnd = seeded(29);
    let town = '';
    for (let i = 0; i < 34; i++) {
      const x = 40 + rnd() * 560, y = 30 + rnd() * 170;
      town += rnd() < 0.65 ? `<rect x="${f(x)}" y="${f(y)}" width="14" height="11" rx="2" fill="${C.line}" opacity=".7"/>` : `<circle cx="${f(x)}" cy="${f(y)}" r="6" fill="#a9d39b"/>`;
    }
    body += at(1, 'fin', `<rect x="30" y="22" width="580" height="190" rx="10" fill="${C.mint}" opacity=".6"/>${town}<path d="${road}" stroke="#b5c4be" stroke-width="16" fill="none" stroke-linecap="round"/><path d="${road}" stroke="white" stroke-width="2" stroke-dasharray="8 8" fill="none"/>`);
    body += shown(1, `<g class="busA">${bus}</g>`, 2);
    // 정류장: 1칸엔 길 위, 2칸에 곧은 줄 위로 옮겨 간다
    body += drawP(`M${LX(0)} ${LY} H${LX(5)}`, 2, C.blue, 9, 1.2, 0.3);
    CP.forEach(([x, y], i) => {
      body += `<g class="b1"><g class="mv" style="${mvStyle([[x - LX(i), y - LY], [0, 0]])};transition-delay:${0.2 + i * 0.12}s">${g('pop pop1', `<circle cx="${LX(i)}" cy="${LY}" r="11" fill="white" stroke="${C.blue}" stroke-width="4"/>`, 0.4 + i * 0.15)}</g></g>`;
      body += at(2, 'rise', text(LX(i), LY + 42, NAMES[i], { size: 19 }), 1.0 + i * 0.1);
      body += shown(2, `<circle cx="${x}" cy="${y}" r="9" fill="white" stroke="${C.muted}" stroke-width="2.5" stroke-dasharray="4 4"/>`);
    });
    body += at(1, 'pop', tag(560, 186, '정류장', COLD, { size: 18 }), 1.6).replace('class="b1"', 'class="b1 h2"');
    // 3칸: 방향 화살표와 버스
    for (let i = 0; i < 5; i++) body += at(3, 'pop', `<path d="M${LX(i) + 42} ${LY - 8} L${LX(i) + 54} ${LY} L${LX(i) + 42} ${LY + 8}" stroke="white" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`, 0.2 + i * 0.15);
    body += shown(3, `<g class="busB">${bus}</g>`);
    // 4칸
    body += at(4, 'pop', tag(320, 236, '노선도', OK, { size: 24 }));
    body += glowRect(LX(0) - 22, LY - 20, LX(5) - LX(0) + 44, 38, 4, C.green, 0.3, 19);
    put(KEY('노선도'), svg(id, body, css));
  })();
})(typeof window !== 'undefined' ? window : globalThis);
