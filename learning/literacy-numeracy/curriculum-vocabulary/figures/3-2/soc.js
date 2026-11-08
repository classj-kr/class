// 사회 3-2 낱말 도식: 인구·저출산·고령화(사람 아이콘), 음력(달 모양), 동지(낮·밤 띠), 생활공간(동심원)을 코드로 그린다.
// 수치: 출생아 수 101·65·47·25만 명은 미래엔 18쪽 그래프(1970·1990·2010·2022년), 100명 마을의 노인 5·23·40명은 미래엔 17쪽.
// 동지의 낮·밤 길이는 서울의 해 뜨고 지는 시각을 시간 단위로 어림한 것이다(6월 21일 14시간 45분, 12월 22일 9시간 34분 → 15·10시간).
// 생활공간은 지도를 그리지 않고 집을 가운데 둔 원 셋으로만 보인다.
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
  const sinD = (d) => Math.sin((d * Math.PI) / 180), cosD = (d) => Math.cos((d * Math.PI) / 180);

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
  const glowRect = (x, y, w, h, n, color = C.green, delay = 0, rx = 12) =>
    `<g class="b${n}"><rect class="flash flash${n}"${dl(delay)} x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="${rx}" fill="none" stroke="${color}" stroke-width="5"/></g>`;
  const ring = (cx, cy, r, n, color = C.green, s = 0) => `<g class="b${n}"><circle class="ring ring${n}"${dl(s)} cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${color}" stroke-width="4"/></g>`;

  // 사람 아이콘: (x, y) 는 발밑 가운데. 동그란 머리 + 둥근 몸, 눈 두 점으로 다정하게(작으면 눈은 뺀다).
  const person = (x, y, color = C.green, s = 1, { cane = false } = {}) => {
    let o = `<circle cx="${f(x)}" cy="${f(y - 27 * s)}" r="${f(7.5 * s)}" fill="${color}"/><path d="M${f(x - 11 * s)} ${f(y)} V${f(y - 9 * s)} Q${f(x - 11 * s)} ${f(y - 18 * s)} ${f(x)} ${f(y - 18 * s)} Q${f(x + 11 * s)} ${f(y - 18 * s)} ${f(x + 11 * s)} ${f(y - 9 * s)} V${f(y)} Z" fill="${color}"/>`;
    if (s >= 1) o += `<circle cx="${f(x - 2.6 * s)}" cy="${f(y - 27.5 * s)}" r="${f(1.2 * s)}" fill="white"/><circle cx="${f(x + 2.6 * s)}" cy="${f(y - 27.5 * s)}" r="${f(1.2 * s)}" fill="white"/>`;
    // 지팡이: 몸 오른쪽에 손잡이가 굽은 막대
    if (cane) o += `<path d="M${f(x + 16 * s)} ${f(y)} V${f(y - 17 * s)} Q${f(x + 16 * s)} ${f(y - 21 * s)} ${f(x + 12.5 * s)} ${f(y - 21 * s)}" stroke="${C.ink}" stroke-width="${f(2.2 * s)}" stroke-linecap="round" fill="none"/>`;
    return o;
  };
  // 아기 아이콘: 주황 머리 + 포대기에 싸인 몸
  const baby = (x, y, s = 1) => `<rect x="${f(x - 8 * s)}" y="${f(y - 15 * s)}" width="${f(16 * s)}" height="${f(15 * s)}" rx="${f(7 * s)}" fill="${C.peach}" stroke="${C.orange}" stroke-width="2"/><circle cx="${f(x)}" cy="${f(y - 21 * s)}" r="${f(6.5 * s)}" fill="${C.orange}"/>`;
  const house = (x, y, s = 1, color = C.green) => `<path d="M${f(x - 16 * s)} ${f(y)} V${f(y - 16 * s)} L${f(x)} ${f(y - 30 * s)} L${f(x + 16 * s)} ${f(y - 16 * s)} V${f(y)} Z" fill="white" stroke="${color}" stroke-width="3" stroke-linejoin="round"/><rect x="${f(x - 4.5 * s)}" y="${f(y - 11 * s)}" width="${f(9 * s)}" height="${f(11 * s)}" rx="1.5" fill="${color}"/>`;

  // 장면마다 같이 쓰는 움직임
  const base = (id) => {
    let s = `
    .sc-${id} .pop, .sc-${id} .pulse, .sc-${id} .ring { transform-box: fill-box; transform-origin: center; }
    .sc-${id} .twk { animation: ${id}-twk 1.6s ease-in-out infinite alternate; }
    .sc-${id} .mar { animation: ${id}-mar .7s linear infinite; }
    .sc-${id} .draw { stroke-dasharray: 1; stroke-dashoffset: 1; transition: stroke-dashoffset 1.6s ease-in-out .2s; }
    .sc-${id} .grow { transform-box: fill-box; transform-origin: 0 50%; transform: scaleX(0); transition: transform 1.2s ease-in-out; }
    .sc-${id} .ring { opacity: 0; }
    @keyframes ${id}-pop { 0% { opacity: 0; transform: scale(.3); } 70% { opacity: 1; transform: scale(1.12); } 100% { opacity: 1; transform: scale(1); } }
    @keyframes ${id}-fin { from { opacity: 0; } to { opacity: 1; } }
    @keyframes ${id}-rise { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
    @keyframes ${id}-drop { from { opacity: 0; transform: translateY(-26px); } to { opacity: 1; transform: none; } }
    @keyframes ${id}-pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }
    @keyframes ${id}-flash { 0% { opacity: 0; } 20% { opacity: 1; } 40% { opacity: .25; } 60% { opacity: 1; } 80% { opacity: .25; } 100% { opacity: 1; } }
    @keyframes ${id}-ring { 0% { opacity: .9; transform: scale(1); } 100% { opacity: 0; transform: scale(1.6); } }
    @keyframes ${id}-twk { from { opacity: .35; } to { opacity: 1; } }
    @keyframes ${id}-mar { from { stroke-dashoffset: 24; } to { stroke-dashoffset: 0; } }
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
    return s;
  };
  // 흐르는 화살표(굽은 길): d 는 path, 끝점과 끝 방향을 따로 받는다
  const flowD = (d, end, ang, color, w = 4) => `<g><path class="mar" d="${d}" stroke="${color}" stroke-width="${w}" stroke-dasharray="14 10" stroke-linecap="round" fill="none"/>${head(end[0], end[1], ang, color, w)}</g>`;

  // ════ 1-1 사회 변화로 달라진 생활 모습 ════

  // ── 인구: 한 지역에 사는 사람을 모두 센 수 ──
  (function () {
    const id = 't32-s11-ingu';
    let css = base(id);
    const R = { x: 36, y: 56, w: 372, h: 282 };
    let body = `<rect x="${R.x}" y="${R.y}" width="${R.w}" height="${R.h}" rx="28" fill="${C.mint}" stroke="${C.green}" stroke-width="3" stroke-dasharray="12 8"/>`;
    body += house(84, 118, 0.9) + house(360, 118, 0.9);
    const cols = [92, 168, 244, 320], rows = [168, 244, 320];
    const colors = [C.green, C.blue, C.orange, C.purple];
    const spots = [];
    rows.forEach((y, r) => cols.forEach((x, c) => spots.push([x + (r === 0 ? 6 : r === 1 ? -6 : 0), y])));
    // 1칸: 사람들이 하나둘 나타난다
    spots.forEach(([x, y], i) => { body += at(1, 'drop', person(x, y, colors[(i + Math.floor(i / 4)) % 4], 1), f(0.1 + i * 0.1)); });
    // 2칸: 한 명씩 수를 붙인다
    spots.forEach(([x, y], i) => {
      body += at(2, 'pop', `<circle cx="${x + 17}" cy="${y - 44}" r="13" fill="white" stroke="${C.ink}" stroke-width="2"/>` + text(x + 17, y - 37.5, i + 1, { size: 18 }), f(0.1 + i * 0.13));
    });
    // 3칸: 모두 센 수가 인구
    body += shown(3, flowD(`M${R.x + R.w + 10} 197 H${508}`, [520, 197], 0, C.green, 4));
    body += at(3, 'pop', `<rect x="${526}" y="${130}" width="${100}" height="${134}" rx="16" fill="white" stroke="${C.green}" stroke-width="3"/>` + text(576, 172, '인구', { size: 22, color: C.green }) + text(576, 226, '12명', { size: 34 }), 0.5);
    body += glowRect(R.x - 4, R.y - 4, R.w + 8, R.h + 8, 3, C.green, 0.1, 30);
    body += tag(R.x + R.w / 2, R.y, '우리 마을', OK);
    put('3-2/사회/1-1/인구', svg(id, body, css));
  })();

  // ── 저출산: 해마다 태어나는 아기 줄이 짧아진다 ──
  (function () {
    const id = 't32-s11-jeochulsan';
    let css = base(id);
    const X0 = 132, DX = 22;
    const rows = [
      { year: '1970년', n: 20, label: '101만 명', y: 100, beat: 1 },
      { year: '1990년', n: 13, label: '65만 명', y: 166, beat: 2 },
      { year: '2010년', n: 9, label: '47만 명', y: 232, beat: 2, s: 1.2 },
      { year: '2022년', n: 5, label: '25만 명', y: 298, beat: 3 }
    ];
    // 범례: 아기 하나 = 5만 명
    let body = baby(498, 46) + text(514, 41, '= 5만 명', { size: 18, anchor: 'start', color: C.muted });
    body += text(40, 41, '한 해에 태어난 아기', { size: 18, anchor: 'start', color: C.muted });
    const ends = [];
    rows.forEach((r) => {
      const endX = X0 + (r.n - 1) * DX;
      ends.push([endX + 18, r.y - 12]);
      let row = text(62, r.y - 14, r.year, { size: 18 });
      for (let i = 0; i < r.n; i++) row += g(`pop pop${r.beat}`, baby(X0 + i * DX, r.y, 0.92), f((r.s || 0) + 0.1 + i * 0.05));
      row += g(`fin fin${r.beat}`, text(62, r.y + 10, r.label, { size: 18, color: C.orange }), f((r.s || 0) + 0.2 + r.n * 0.05));
      body += `<g class="b${r.beat}">${row}</g>`;
    });
    // 3칸: 맨 아래 줄이 반짝인다
    body += glowRect(X0 - 16, 298 - 36, 5 * DX + 12, 44, 3, C.orange, 0.9, 10);
    // 4칸: 줄 끝을 잇는 선이 아래로 내려간다
    const d = 'M' + ends.map(([x, y]) => `${f(x)} ${f(y)}`).join(' L');
    const [pa, pb] = ends.slice(-2);
    body += shown(4, `<path class="draw draw4" pathLength="1" d="${d}" stroke="${C.red}" stroke-width="4" stroke-dasharray="1" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`);
    body += at(4, 'pop', head(pb[0], pb[1], Math.atan2(pb[1] - pa[1], pb[0] - pa[0]), C.red, 4), 1.7);
    body += at(4, 'pop', tag(500, 300, '저출산', HOT, { size: 22 }), 1.2);
    css += `.sc-${id} .draw4 { stroke-dasharray: 1; }`;
    put('3-2/사회/1-1/저출산', svg(id, body, css));
  })();

  // ── 고령화: 100명 가운데 노인이 차지하는 몫이 커진다 ──
  (function () {
    const id = 't32-s11-goryeong';
    let css = base(id);
    const GX = 46, GY = 74, SX = 25, SY = 29, S = 0.64;
    const counts = [5, 23, 40];
    let body = text(GX + 4.5 * SX, 38, '마을 사람 100명', { size: 18, color: C.muted });
    // 아래 줄 오른쪽부터 노인으로 칠해진다(칸 1: 5명, 칸 2: 23명, 칸 3: 40명)
    for (let k = 0; k < 100; k++) {
      const row = 9 - Math.floor(k / 10), col = 9 - (k % 10);
      const cls = counts.map((c, i) => (k < c ? ` e${i + 1}` : '')).join('');
      const old = counts.findIndex((c) => k < c);
      const delay = old < 0 ? 0 : f(0.3 + (k - (old ? counts[old - 1] : 0)) * (old === 0 ? 0.12 : 0.05));
      body += `<g class="pp${cls}" style="--d:${delay}s">${person(GX + col * SX, GY + row * SY, C.green, S)}</g>`;
    }
    // 오른쪽: 해 이름표, 100칸 막대, 노인 수
    const BX = 336, BW = 270, BY = 150, BH = 44;
    const years = ['1970년', '2020년', '2050년'];
    years.forEach((y, i) => {
      body += i < 2 ? shown(i + 1, g(`pop pop${i + 1}`, tag(BX + BW / 2, 72, y, PLAIN, { size: 22 }), 0.1), i + 2) : at(3, 'pop', tag(BX + BW / 2, 72, y, PLAIN, { size: 22 }), 0.1);
    });
    body += text(BX, BY - 14, '100명 가운데', { size: 18, anchor: 'start', color: C.muted });
    body += `<rect x="${BX}" y="${BY}" width="${BW}" height="${BH}" rx="8" fill="${C.mint}" stroke="${C.green}" stroke-width="2.5"/>`;
    body += `<defs><clipPath id="${id}-bar"><rect x="${BX}" y="${BY}" width="${BW}" height="${BH}" rx="8"/></clipPath></defs><g clip-path="url(#${id}-bar)"><g class="gauge"><rect x="${BX}" y="${BY}" width="${BW}" height="${BH}" fill="${C.purple}"/></g></g>`;
    body += `<rect x="${BX}" y="${BY}" width="${BW}" height="${BH}" rx="8" fill="none" stroke="${C.green}" stroke-width="2.5"/>`;
    for (let i = 1; i < 10; i++) body += `<path d="M${f(BX + (i * BW) / 10)} ${BY + 4} V${BY + BH - 4}" stroke="white" stroke-width="1.5" opacity=".7"/>`;
    counts.forEach((c, i) => {
      const inner = text(BX, BY + BH + 34, `노인 ${c}명`, { size: 24, anchor: 'start', color: C.purple });
      body += i < 2 ? shown(i + 1, g(`fin fin${i + 1}`, inner, 0.6), i + 2) : at(3, 'fin', inner, 0.6);
    });
    // 범례
    body += person(BX + 14, 334, C.purple, 0.9) + text(BX + 40, 328, '65세가 넘는 노인', { size: 18, anchor: 'start', color: C.purple });
    // 4칸: 막대가 반짝이고 이름표
    body += glowRect(BX - 5, BY - 5, BW + 10, BH + 10, 4, C.purple, 0.1, 11);
    body += at(4, 'pop', tag(BX + BW - 62, BY + BH + 30, '고령화', OLD, { size: 22 }), 0.6);
    css += `
      .sc-${id} .pp > * { transition: fill .5s ease; transition-delay: var(--d); }
      .on1 .sc-${id} .e1 > *, .on2 .sc-${id} .e2 > *, .on3 .sc-${id} .e3 > * { fill: ${C.purple}; }
      .sc-${id} .gauge { transform-box: fill-box; transform-origin: 0 50%; transform: scaleX(0); transition: transform 1.4s ease-in-out .3s; }
      .on1 .sc-${id} .gauge { transform: scaleX(.05); }
      .on2 .sc-${id} .gauge { transform: scaleX(.23); }
      .on3 .sc-${id} .gauge { transform: scaleX(.4); }`;
    put('3-2/사회/1-1/고령화', svg(id, body, css));
  })();

  // ════ 2-1 옛날과 오늘날의 풍습 ════

  // 달 모양: age 는 1일(보이지 않음)부터 센 날수(0~29.5). 차오를 때는 오른쪽, 기울 때는 왼쪽이 밝다.
  const moon = (cx, cy, r, age) => {
    const th = (age / 29.5) * 360;
    const waxing = th <= 180, c = waxing ? cosD(th) : cosD(360 - th), side = waxing ? 1 : -1;
    const pts = [];
    for (let t = -90; t <= 90; t += 6) pts.push([cx + side * r * cosD(t), cy + r * sinD(t)]);
    for (let t = 90; t >= -90; t -= 6) pts.push([cx + side * r * c * cosD(t), cy + r * sinD(t)]);
    const d = 'M' + pts.map(([x, y]) => `${f(x)} ${f(y)}`).join(' L') + ' Z';
    return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="white" stroke="${C.line}" stroke-width="2.5"/><path d="${d}" fill="${C.yellow}" stroke="${C.orange}" stroke-width="2" stroke-linejoin="round"/>`;
  };

  // ── 음력: 달의 모양이 바뀌는 것으로 날짜를 센다 ──
  (function () {
    const id = 't32-s21-eumryeok';
    let css = base(id);
    const X0 = 70, X1 = 590, LY = 250, MY = 160, MR = 23;
    const dx = (d) => X0 + ((d - 1) * (X1 - X0)) / 29;
    let body = `<rect x="30" y="${MY - 50}" width="580" height="100" rx="20" fill="${C.sky}" opacity=".55"/>`;
    // 날짜 줄: 1일~30일
    body += `<path d="M${X0 - 14} ${LY} H${X1 + 14}" stroke="${C.ink}" stroke-width="3"/>`;
    for (let d = 1; d <= 30; d++) body += `<path d="M${f(dx(d))} ${LY - (d % 5 === 0 || d === 1 ? 9 : 5)} V${LY + (d % 5 === 0 || d === 1 ? 9 : 5)}" stroke="${C.ink}" stroke-width="2"/>`;
    const dayLabel = (d, n, s = 0) => (n ? at(n, 'fin', text(f(dx(d)), LY + 34, `${d}일`, { size: 18 }), s) : text(f(dx(d)), LY + 34, `${d}일`, { size: 18 }));
    body += dayLabel(1) + dayLabel(30);
    // 달 하나: 날짜 점선 + 달 + (이름)
    const put1 = (day, n, s, name, nameColor = C.ink) => {
      const x = f(dx(day));
      let o = `<path d="M${x} ${MY + MR + 6} V${LY - 12}" stroke="${C.muted}" stroke-width="2" stroke-dasharray="4 5"/><circle cx="${x}" cy="${LY}" r="5.5" fill="${C.orange}"/>`;
      o += g(`pop pop${n}`, day === 1 ? `<circle cx="${x}" cy="${MY}" r="${MR}" fill="white" stroke="${C.muted}" stroke-width="2.5" stroke-dasharray="6 5"/>` : moon(x, MY, MR, day - 1), s);
      if (name) o += g(`fin fin${n}`, text(x, MY - MR - 16, name, { size: 18, color: nameColor }), s + 0.3);
      return `<g class="b${n}">${o}</g>`;
    };
    // 1칸: 1일(보이지 않음) → 초승달 → 반달
    body += put1(1, 1, 0.1) + put1(4, 1, 0.6, '초승달') + put1(8, 1, 1.1) + dayLabel(8, 1, 1.2);
    // 2칸: 15일 보름달
    body += put1(15, 2, 0.2, '보름달', C.orange) + dayLabel(15, 2, 0.3) + ring(f(dx(15)), MY, MR + 2, 2, C.orange, 0.5);
    // 3칸: 반달 → 그믐달, 그리고 다시 1일로
    body += put1(23, 3, 0.1) + dayLabel(23, 3, 0.2) + put1(27, 3, 0.6, '그믐달');
    const back = `M${X1} ${LY + 50} Q${(X0 + X1) / 2} ${LY + 100} ${X0 + 8} ${LY + 52}`;
    body += shown(3, g('fin fin3', flowD(back, [X0 + 8, LY + 52], Math.atan2(-14, -60), C.green, 4) + text((X0 + X1) / 2, LY + 66, '다음 달 1일', { size: 18, color: C.green }), 1.2));
    // 4칸: 1일~30일이 한 달
    body += shown(4, `<path class="draw draw4" pathLength="1" d="M${X0} 88 V76 H${X1} V88" stroke="${C.purple}" stroke-width="3.5" stroke-dasharray="1" fill="none" stroke-linejoin="round"/>`);
    body += at(4, 'pop', tag((X0 + X1) / 2, 64, '음력 한 달', OLD, { size: 20 }), 1.2);
    put('3-2/사회/2-1/음력', svg(id, body, css));
  })();

  // ── 동지: 일 년 가운데 밤이 가장 긴 날 ──
  (function () {
    const id = 't32-s21-dongji';
    let css = base(id);
    const BX = 166, BW = 432, BH = 40, U = BW / 24;
    const rows = [
      { date: '3월 21일', day: 12, y: 94, beat: 1 },
      { date: '6월 21일', day: 15, y: 152, beat: 1, s: 0.6 },
      { date: '9월 23일', day: 12, y: 210, beat: 2 },
      { date: '12월 22일', day: 10, y: 268, beat: 3 }
    ];
    const sun = (x, y) => `<circle cx="${x}" cy="${y}" r="7" fill="${C.orange}"/>` + [0, 45, 90, 135, 180, 225, 270, 315].map((a) => `<path d="M${f(x + 10 * cosD(a))} ${f(y + 10 * sinD(a))} L${f(x + 13.5 * cosD(a))} ${f(y + 13.5 * sinD(a))}" stroke="${C.orange}" stroke-width="2.2" stroke-linecap="round"/>`).join('');
    const crescent = (x, y) => `<path d="M${x + 4} ${y - 9.2} A10 10 0 1 0 ${x + 4} ${y + 9.2} A12 12 0 0 1 ${x + 4} ${y - 9.2} Z" fill="${C.yellow}"/>`;
    // 맨 위: 띠 하나가 하루 24시간
    let body = `<path d="M${BX} 58 V48 H${BX + BW} V58" stroke="${C.muted}" stroke-width="2.5" fill="none"/>` + `<rect x="${BX + BW / 2 - 66}" y="36" width="132" height="24" fill="${C.paper}"/>` + text(BX + BW / 2, 55, '하루 24시간', { size: 18, color: C.muted });
    // 3칸: 12월 22일 밤이 시작하는 자리의 세로 점선(띠 뒤에 깔려 띠 사이로만 보인다)
    const dec = rows[3], xd = BX + dec.day * U;
    body += shown(3, `<path class="draw draw3" pathLength="1" d="M${xd} ${dec.y + BH / 2} V${rows[0].y - BH / 2 - 6}" stroke="${C.ink}" stroke-width="2.5" stroke-dasharray="1" fill="none"/>`);
    rows.forEach((r, i) => {
      const top = r.y - BH / 2, dw = r.day * U;
      body += `<defs><clipPath id="${id}-c${i}"><rect x="${BX}" y="${top}" width="${BW}" height="${BH}" rx="8"/></clipPath></defs>`;
      let row = text(BX - 14, r.y + 6.5, r.date, { size: 18, anchor: 'end' });
      row += `<g class="grow grow${r.beat}" style="transition-delay:${(r.s || 0) + 0.1}s">`
        + `<g clip-path="url(#${id}-c${i})"><rect x="${BX}" y="${top}" width="${f(dw)}" height="${BH}" fill="${C.yellow}"/><rect x="${f(BX + dw)}" y="${top}" width="${f(BW - dw)}" height="${BH}" fill="${C.blue}"/></g>`
        + sun(BX + 22, r.y) + text(f(BX + dw / 2 + 14), r.y + 6.5, `${r.day}시간`, { size: 18 })
        + crescent(f(BX + dw + 22), r.y) + text(f(BX + dw + (BW - dw) / 2 + 14), r.y + 6.5, `${24 - r.day}시간`, { size: 18, color: 'white' })
        + `</g>`;
      body += `<g class="b${r.beat}">${row}</g>`;
    });
    // 이름표: 낮·밤
    body += shown(1, g('fin fin1', text(BX + 6 * U, 336, '낮', { size: 18, color: C.orange }) + `<rect x="${BX + 6 * U - 34}" y="${321}" width="18" height="18" rx="4" fill="${C.yellow}"/>`, 1.2), 4);
    body += shown(1, g('fin fin1', text(BX + 18 * U, 336, '밤', { size: 18, color: C.blue }) + `<rect x="${BX + 18 * U - 34}" y="${321}" width="18" height="18" rx="4" fill="${C.blue}"/>`, 1.2), 4);
    // 3칸: 12월 22일의 밤 띠가 가장 길다 — 밤이 시작하는 자리에 세로 점선
    body += glowRect(xd - 3, dec.y - BH / 2 - 4, BX + BW - xd + 7, BH + 8, 3, C.purple, 1.3, 11);
    // 4칸: 동지 이름표와 팥죽
    body += at(4, 'pop', tag(78, 310, '동지', OLD, { size: 22 }), 0.2);
    const bowl = (x, y) => `<path d="M${x - 32} ${y} Q${x - 30} ${y + 30} ${x} ${y + 30} Q${x + 30} ${y + 30} ${x + 32} ${y} Z" fill="white" stroke="${C.muted}" stroke-width="2.5" stroke-linejoin="round"/><ellipse cx="${x}" cy="${y}" rx="32" ry="9" fill="${C.red}" stroke="${C.muted}" stroke-width="2.5"/><circle cx="${x - 12}" cy="${y - 1}" r="3.5" fill="white"/><circle cx="${x + 4}" cy="${y + 1}" r="3.5" fill="white"/><circle cx="${x + 15}" cy="${y - 2}" r="3.5" fill="white"/>`;
    body += at(4, 'pop', bowl(520, 312) + text(574, 330, '팥죽', { size: 18, anchor: 'start', color: C.red }), 0.8);
    put('3-2/사회/2-1/동지', svg(id, body, css));
  })();

  // ════ 2-2 교통 발달에 따른 생활 모습의 변화 ════

  // ── 생활공간: 교통이 발달하며 하루에 오가는 곳이 넓어진다 ──
  (function () {
    const id = 't32-s22-saenghwal';
    let css = base(id);
    const CX = 300, CY = 190;
    const rings = [
      { r: 62, n: 1, col: OK, label: '걸어서', place: '학교', ang: 90, tp: [0, 27] },
      { r: 112, n: 2, col: COLD, label: '버스·지하철', place: '옆 도시', ang: 20, tp: [0, 33] },
      { r: 162, n: 3, col: HOT, label: '고속 열차', place: '먼 도시', ang: 196 }
    ];
    let body = '';
    // 큰 원부터 깔고, 원은 앞 원 크기에서 넓어진다
    [...rings].reverse().forEach((c, idx) => {
      const prev = idx < 2 ? [...rings].reverse()[idx + 1].r : 0;
      body += `<g class="b${c.n}"><g class="sp sp${c.n}" style="--from:${f(prev / c.r)}"><circle cx="${CX}" cy="${CY}" r="${c.r}" fill="${c.col[0]}" stroke="${c.col[1]}" stroke-width="3"/></g></g>`;
    });
    // 4칸: 가장 큰 원 전체가 반짝인다(이름표 아래에 깔림)
    body += `<g class="b4"><circle class="flash flash4" cx="${CX}" cy="${CY}" r="${rings[2].r + 3}" fill="none" stroke="${C.purple}" stroke-width="5"/></g>`;
    body += house(CX, CY + 14, 1.1, C.ink) + text(CX, CY - 28, '집', { size: 18 });
    let trips = '';
    rings.forEach((c) => {
      const px = f(CX + c.r * cosD(c.ang)), py = f(CY + c.r * sinD(c.ang));
      // 오가는 점: 집에서 그곳까지 갔다가 돌아온다(맨 위에 그린다)
      const sx = f(CX + 24 * cosD(c.ang)), sy = f(CY + 24 * sinD(c.ang));
      trips += `<g class="b${c.n}"><g class="trip trip${c.n}" style="--tx:${f(px - sx)}px;--ty:${f(py - sy)}px"><circle cx="${sx}" cy="${sy}" r="9" fill="${c.col[1]}" stroke="white" stroke-width="3"/></g></g>`;
      // 그곳 점과 이름: 점 바로 아래(tp) 또는 원 바깥
      const lx = c.tp ? px + c.tp[0] : f(CX + (c.r + 30) * cosD(c.ang)), ly = c.tp ? py + c.tp[1] : f(CY + (c.r + 30) * sinD(c.ang));
      body += at(c.n, 'pop', `<circle cx="${px}" cy="${py}" r="7" fill="white" stroke="${c.col[1]}" stroke-width="3"/>` + tag(lx, ly, c.place, PLAIN, { size: 18 }), 0.6);
      // 원 위쪽의 교통 이름표
      body += at(c.n, 'pop', tag(CX, CY - c.r, c.label, c.col, { size: 18 }), 1.0);
    });
    body += trips;
    body += shown(4, `<path class="draw draw4" pathLength="1" d="M${CX + rings[2].r + 6} ${CY} H${484}" stroke="${C.purple}" stroke-width="3.5" stroke-dasharray="1" fill="none"/>`);
    body += at(4, 'pop', tag(552, CY, '생활공간', OLD, { size: 22 }), 0.6);
    css += `
      .sc-${id} .sp { transform-box: fill-box; transform-origin: center; transform: scale(var(--from)); transition: transform 1.3s ease-out .1s; }
      .on1 .sc-${id} .sp1, .on2 .sc-${id} .sp2, .on3 .sc-${id} .sp3 { transform: scale(1); }
      .on1 .sc-${id} .trip1, .on2 .sc-${id} .trip2, .on3 .sc-${id} .trip3 { animation: ${id}-trip 3.2s ease-in-out .6s infinite; }
      @keyframes ${id}-trip { 0%, 10% { transform: translate(0, 0); } 40%, 60% { transform: translate(var(--tx), var(--ty)); } 92%, 100% { transform: translate(0, 0); } }`;
    put('3-2/사회/2-2/생활공간', svg(id, body, css));
  })();
})(typeof window !== 'undefined' ? window : globalThis);
