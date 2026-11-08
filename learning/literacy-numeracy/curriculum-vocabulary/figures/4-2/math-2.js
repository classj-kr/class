// 수학 4-2 2단원 삼각형: 낱말 도식
// 각 색 약속(교과서와 같게): 예각 파랑, 직각 빨강, 둔각 초록. 같은 길이의 변은 주황으로 칠하고 짧은 눈금을 긋는다.
// 부채꼴(각의 크기 표시)은 굵은 테두리 동그라미의 stroke-dasharray 로 그려, 각이 바뀌면 부채꼴도 함께 열리고 닫힌다.
(function (root) {
  'use strict';
  const { C, svg, text, put } = root.FigureKit;
  const f = (n) => +n.toFixed(2);
  const delay = (s, more = '') => `style="animation-delay:${s}s;transition-delay:${s}s;${more}"`;
  const rad = (d) => d * Math.PI / 180, deg = (r) => r * 180 / Math.PI;
  const P = (pts) => pts.map(([x, y]) => `${f(x)},${f(y)}`).join(' ');

  const motion = (id) => {
    let css = `
    .sc-${id} :is(.s1,.s2,.s3,.s4,.p1,.p2,.p3,.p4,.k1,.k2,.k3,.k4) { opacity: 0; }
    .sc-${id} :is(.p1,.p2,.p3,.p4,.ring) { transform-box: fill-box; transform-origin: center; }
    .sc-${id} .draw { stroke-dasharray: 1; stroke-dashoffset: 1; transition: stroke-dashoffset .6s ease-in-out; }
    .sc-${id} .ring { opacity: 0; }
    @keyframes ${id}-fin { from { opacity: 0; } to { opacity: 1; } }
    @keyframes ${id}-pop { 0% { opacity: 0; transform: scale(0); } 70% { opacity: 1; transform: scale(1.2); } 100% { opacity: 1; transform: scale(1); } }
    @keyframes ${id}-ring { 0% { opacity: .9; transform: scale(1); } 100% { opacity: 0; transform: scale(2.4); } }
    @keyframes ${id}-blink { 0% { opacity: 0; } 20% { opacity: 1; } 40% { opacity: .15; } 60% { opacity: 1; } 80% { opacity: .15; } 100% { opacity: 1; } }`;
    for (let n = 1; n <= 4; n++) css += `
    .on${n} .sc-${id} .s${n} { animation: ${id}-fin .4s ease-out both; }
    .on${n} .sc-${id} .p${n} { animation: ${id}-pop .5s ease-out both; }
    .on${n} .sc-${id} .d${n} { stroke-dashoffset: 0; }
    .on${n} .sc-${id} .r${n} { animation: ${id}-ring 1.1s ease-out 2 both; }
    .on${n} .sc-${id} .k${n} { animation: ${id}-blink 1.4s ease-in-out both; }`;
    return css;
  };

  // 기하 도구
  const dir = (V, Q) => deg(Math.atan2(Q[1] - V[1], Q[0] - V[0]));            // 화면 각(시계 방향이 +)
  const unit = (V, Q) => { const l = Math.hypot(Q[0] - V[0], Q[1] - V[1]); return [(Q[0] - V[0]) / l, (Q[1] - V[1]) / l]; };
  const angleAt = (V, A, B) => { const u = unit(V, A), v = unit(V, B); return deg(Math.acos(Math.max(-1, Math.min(1, u[0] * v[0] + u[1] * v[1])))); };
  const kind = (a) => (a > 90.5 ? 'obtuse' : a > 89.5 ? 'right' : 'acute');
  const KC = { acute: C.blue, right: C.red, obtuse: C.green };
  // 꼭짓점 V 에서 A 쪽과 B 쪽 사이의 부채꼴(정지 그림)
  function wedge(V, A, B, r, color, extra = '') {
    let a0 = dir(V, A), a1 = dir(V, B);
    let d = ((a1 - a0) % 360 + 360) % 360;
    if (d > 180) { [a0, a1] = [a1, a0]; d = 360 - d; }
    const p = (a) => `${f(V[0] + r * Math.cos(rad(a)))} ${f(V[1] + r * Math.sin(rad(a)))}`;
    return `<path ${extra} d="M${f(V[0])} ${f(V[1])} L${p(a0)} A${r} ${r} 0 0 1 ${p(a0 + d)} Z" fill="${color}" fill-opacity=".35" stroke="${color}" stroke-width="2"/>`;
  }
  function square(V, A, B, s, color, extra = '') {
    const u = unit(V, A), v = unit(V, B);
    return `<path ${extra} d="M${f(V[0] + u[0] * s)} ${f(V[1] + u[1] * s)} L${f(V[0] + (u[0] + v[0]) * s)} ${f(V[1] + (u[1] + v[1]) * s)} L${f(V[0] + v[0] * s)} ${f(V[1] + v[1] * s)}" fill="${C.red}" fill-opacity=".2" stroke="${color}" stroke-width="2.5"/>`;
  }
  // 각 표시: 직각이면 네모, 아니면 부채꼴. 색은 각의 종류대로.
  const mark = (V, A, B, r) => { const k = kind(angleAt(V, A, B)); return k === 'right' ? square(V, A, B, r * 0.8, C.red) : wedge(V, A, B, r, KC[k]); };
  // 변 가운데의 짧은 눈금(같은 길이 표시)
  function tick(A, B, color = C.orange, n = 1, len = 9) {
    const m = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2], u = unit(A, B), nx = -u[1], ny = u[0];
    let s = '';
    for (let i = 0; i < n; i++) {
      const o = (i - (n - 1) / 2) * 7, cx = m[0] + u[0] * o, cy = m[1] + u[1] * o;
      s += `<path d="M${f(cx - nx * len)} ${f(cy - ny * len)} L${f(cx + nx * len)} ${f(cy + ny * len)}" stroke="${color}" stroke-width="3.5" stroke-linecap="round"/>`;
    }
    return s;
  }
  // 각의 이등분선 쪽으로 d 만큼 들어간 자리
  function inside(V, A, B, d) {
    const u = unit(V, A), v = unit(V, B), l = Math.hypot(u[0] + v[0], u[1] + v[1]);
    return [V[0] + (u[0] + v[0]) / l * d, V[1] + (u[1] + v[1]) / l * d];
  }
  const seg = (A, B, color = C.ink, w = 4, extra = '') => `<path ${extra} d="M${f(A[0])} ${f(A[1])} L${f(B[0])} ${f(B[1])}" stroke="${color}" stroke-width="${w}" stroke-linecap="round"/>`;

  // 분류: 섞인 삼각형 카드 → 각을 색으로 표시 → 같은 종류끼리 세 묶음
  (function () {
    const id = 't42-m2-bunryu', CW = 90, CH = 80;
    const tris = [
      [[10, 68], [82, 68], [38, 12]],
      [[6, 68], [62, 68], [84, 24]],
      [[14, 68], [78, 68], [14, 14]],
      [[12, 68], [78, 68], [45, 10]],
      [[6, 62], [84, 62], [28, 38]],
      [[10, 68], [80, 68], [80, 22]]
    ];
    const at = [[40, 24], [176, 96], [300, 20], [420, 100], [526, 26], [70, 124]];
    const boxX = [14, 218, 422], BW = 204, BY = 222, BH = 130;
    const group = (t) => { const ks = t.map((V, i) => kind(angleAt(V, t[(i + 1) % 3], t[(i + 2) % 3]))); return ks.includes('obtuse') ? 2 : ks.includes('right') ? 1 : 0; };
    const used = [0, 0, 0];
    const boxes = boxX.map((x, i) => `<g class="s2" ${delay(.9 + i * .15)}><rect x="${x}" y="${BY}" width="${BW}" height="${BH}" rx="14" fill="white" stroke="${[C.blue, C.red, C.green][i]}" stroke-width="3"/>${text(x + BW / 2, BY + 28, ['예각삼각형', '직각삼각형', '둔각삼각형'][i], { size: 20, color: [C.blue, C.red, C.green][i] })}</g>`).join('');
    const cards = tris.map((t, i) => {
      const g = group(t), slot = used[g]++;
      const tx = boxX[g] + 8 + slot * 98 - at[i][0], ty = BY + 40 - at[i][1];
      const marks = t.map((V, j) => mark(V, t[(j + 1) % 3], t[(j + 2) % 3], 13)).join('');
      return `<g class="cd" ${delay(.1 + i * .18, `--tx:${tx}px;--ty:${ty}px`)}><g class="p1" ${delay(.1 + i * .12)}><g transform="translate(${at[i][0]} ${at[i][1]})">`
        + `<rect width="${CW}" height="${CH}" rx="8" fill="white" stroke="${C.line}" stroke-width="2.5"/>`
        + `<g class="s2" ${delay(.2 + i * .1)}>${marks}</g>`
        + `<polygon points="${P(t)}" fill="none" stroke="${C.ink}" stroke-width="3" stroke-linejoin="round"/></g></g></g>`;
    }).join('');
    put('4-2/수학/2/분류', svg(id, boxes + cards, motion(id) + `
      .sc-${id} .cd { transition: transform 1s ease-in-out; }
      .on3 .sc-${id} .cd { transform: translate(var(--tx), var(--ty)); }`));
  })();

  // 성질: 이등변삼각형을 반으로 접으면 두 밑각이 겹친다 → 모양이 다른 이등변삼각형도 두 밑각이 같다
  (function () {
    const id = 't42-m2-seongjil';
    const A = [190, 80], L = [110, 300], R = [270, 300], M = [190, 300];
    const lab = (V, O1, O2, s) => { const p = inside(V, O1, O2, 50); return text(f(p[0]), f(p[1] + 7), s, { size: 20, color: C.blue }); };
    const iso = (apex, l, r, ang, d) => `<g class="p3" ${delay(d)}>`
      + `<polygon points="${P([apex, l, r])}" fill="${C.mint}" stroke="${C.ink}" stroke-width="3" stroke-linejoin="round"/>`
      + wedge(l, r, apex, 22, C.blue) + wedge(r, l, apex, 22, C.blue) + tick(apex, l) + tick(apex, r)
      + text(l[0] + 12, 332, ang, { size: 20, color: C.blue }) + text(r[0] - 12, 332, ang, { size: 20, color: C.blue }) + '</g>';
    const h45 = 60, h30 = 75 * Math.tan(rad(30));
    const body = `<polygon points="${P([A, L, M])}" fill="${C.mint}" stroke="${C.ink}" stroke-width="3.5" stroke-linejoin="round"/>`
      + wedge(L, R, A, 34, C.blue) + tick(A, L)
      + `<g class="fold"><polygon points="${P([A, R, M])}" fill="${C.mint}" fill-opacity=".75" stroke="${C.ink}" stroke-width="3.5" stroke-linejoin="round"/>${wedge(R, L, A, 34, C.blue)}${tick(A, R)}</g>`
      + `<path class="draw d1" pathLength="1" ${delay(.3)} d="M190 60 V320" stroke="${C.purple}" stroke-width="3" stroke-dasharray="1"/>`
      + `<g class="s1" ${delay(.9)}><path d="M190 60 V320" stroke="${C.paper}" stroke-width="3" stroke-dasharray="2 8"/></g>`
      + lab(L, R, A, '70°') + `<g class="rl">${lab(R, L, A, '70°')}</g>`
      + `<circle class="ring r2" ${delay(1.5)} cx="${L[0] + 22}" cy="${L[1] - 14}" r="20" fill="none" stroke="${C.blue}" stroke-width="3"/>`
      + iso([370, 300 - h45], [310, 300], [430, 300], '45°', .6) + iso([541, 300 - h30], [466, 300], [616, 300], '30°', .9);
    put('4-2/수학/2/성질', svg(id, body, motion(id) + `
      .sc-${id} .fold { transform-box: view-box; transform-origin: 190px 0; transition: transform 1.2s ease-in-out .2s; }
      .on2 .sc-${id} .fold { transform: scaleX(-1); }
      .on3 .sc-${id} .fold { transform: none; }
      .sc-${id} .rl { transition: opacity .3s ease; }
      .on2 .sc-${id} .rl { opacity: 0; }
      .on3 .sc-${id} .rl { opacity: 1; transition-delay: 1.3s; }`));
  })();

  // 이등변삼각형: 왼쪽 변과 같은 막대를 꼭대기에 대고 돌리면 오른쪽 변에 꼭 겹친다
  (function () {
    const id = 't42-m2-ideungbyeon';
    const A = [320, 60], B = [210, 300], Cc = [430, 300];
    const turn = dir(A, Cc) - dir(A, B);
    const sideLabel = (P1, P2, s, out) => { const m = [(P1[0] + P2[0]) / 2, (P1[1] + P2[1]) / 2], u = unit(P1, P2); const n = [-u[1] * out, u[0] * out]; return text(f(m[0] + n[0] * 44), f(m[1] + n[1] * 44 + 7), s, { size: 22, color: C.orange }); };
    const body = `<polygon points="${P([A, B, Cc])}" fill="${C.mint}" stroke="${C.ink}" stroke-width="4" stroke-linejoin="round"/>`
      + `<g class="s1" ${delay(.1)}>${seg(A, B, C.orange, 6)}</g>`
      + `<g class="s2" ${delay(1.5)}>${seg(A, Cc, C.orange, 6)}</g>`
      + `<g class="bar"><g class="s1" ${delay(.5)}>${seg(A, B, C.orange, 14, 'stroke-opacity=".45"')}</g></g>`
      + `<circle class="ring r2" ${delay(1.5)} cx="${(A[0] + Cc[0]) / 2}" cy="${(A[1] + Cc[1]) / 2}" r="22" fill="none" stroke="${C.orange}" stroke-width="3"/>`
      + `<circle cx="${A[0]}" cy="${A[1]}" r="6" fill="${C.ink}"/>`
      + `<g class="p3" ${delay(.1)}>${tick(A, B, C.orange, 1, 12)}</g><g class="p3" ${delay(.3)}>${tick(A, Cc, C.orange, 1, 12)}</g>`
      + `<g class="s3" ${delay(.6)}>${sideLabel(A, B, '6 cm', 1)}${sideLabel(A, Cc, '6 cm', -1)}${text(320, 334, '5 cm', { size: 22, color: C.muted })}</g>`;
    put('4-2/수학/2/이등변삼각형', svg(id, body, motion(id) + `
      .sc-${id} .bar { transform-box: view-box; transform-origin: ${A[0]}px ${A[1]}px; transition: transform 1.2s ease-in-out .2s; }
      .on2 .sc-${id} .bar { transform: rotate(${f(turn)}deg); }`));
  })();

  // 정삼각형: 막대를 두 번 돌려 세 변이 모두 같다 → 이등변삼각형 무리 안의 정삼각형 무리로 들어감
  (function () {
    const id = 't42-m2-jeong', s = 210;
    const B = [50, 310], Cc = [260, 310], A = [155, 310 - s * Math.sqrt(3) / 2];
    const G = [(A[0] + B[0] + Cc[0]) / 3, (A[1] + B[1] + Cc[1]) / 3], k = .45, T = [462, 252];
    const tri = `<polygon points="${P([A, B, Cc])}" fill="${C.mint}" stroke="${C.ink}" stroke-width="4" stroke-linejoin="round"/>`
      + `<g class="s1" ${delay(.1)}>${seg(B, Cc, C.orange, 6)}</g>`
      + `<g class="s1" ${delay(1.7)}>${seg(Cc, A, C.orange, 6)}</g>`
      + `<g class="s2" ${delay(1.5)}>${seg(A, B, C.orange, 6)}</g>`
      + `<g class="b1"><g class="h2"><g class="bar1">${seg(B, Cc, C.orange, 14, 'stroke-opacity=".45"')}</g></g></g>`
      + `<g class="b2"><g class="h3"><g class="bar2">${seg(Cc, A, C.orange, 14, 'stroke-opacity=".45"')}</g></g></g>`
      + `<g class="p2" ${delay(1.6)}>${tick(A, B, C.orange, 1, 12)}${tick(B, Cc, C.orange, 1, 12)}${tick(Cc, A, C.orange, 1, 12)}</g>`;
    const ex = (pts, d) => `<g class="p3" ${delay(d)}><polygon points="${P(pts)}" fill="${C.peach}" stroke="${C.ink}" stroke-width="2.5" stroke-linejoin="round"/>${tick(pts[0], pts[1], C.orange, 1, 7)}${tick(pts[0], pts[2], C.orange, 1, 7)}</g>`;
    const sets = `<g class="s3" ${delay(.1)}><rect x="300" y="36" width="326" height="304" rx="22" fill="white" stroke="${C.orange}" stroke-width="3"/>${text(463, 72, '이등변삼각형', { size: 22, color: C.orange })}</g>`
      + ex([[340, 90], [318, 148], [362, 148]], .4) + ex([[588, 110], [558, 150], [618, 150]], .6)
      + `<g class="s3" ${delay(.8)}><ellipse cx="462" cy="240" rx="128" ry="86" fill="${C.mint}" fill-opacity=".5" stroke="${C.green}" stroke-width="3"/>${text(462, 184, '정삼각형', { size: 22, color: C.green })}</g>`;
    const body = sets + `<g class="mv">${tri}</g>`;
    put('4-2/수학/2/정삼각형', svg(id, body, motion(id) + `
      .sc-${id} :is(.bar1,.bar2) { transform-box: view-box; transition: transform 1.1s ease-in-out .5s; }
      .sc-${id} .bar1 { transform-origin: ${Cc[0]}px ${Cc[1]}px; }
      .sc-${id} .bar2 { transform-origin: ${f(A[0])}px ${f(A[1])}px; }
      .on1 .sc-${id} .bar1, .on2 .sc-${id} .bar2 { transform: rotate(60deg); }
      .sc-${id} .mv { transform-box: view-box; transform-origin: 0 0; transition: transform 1.2s ease-in-out .9s; }
      .on3 .sc-${id} .mv { transform: translate(${f(T[0] - G[0] * k)}px, ${f(T[1] - G[1] * k)}px) scale(${k}); }`));
  })();

  // 예각·둔각: 한 변이 0°에서 90°까지 열려 직각(빨강) → 직각보다 덜/더 벌어짐 → 그 범위 안에서 열렸다 닫혔다
  function angleFig(id, key, O, R, a2, lo, hi, color, name, namePos, ninetyX, more = '') {
    const r = 55, len = (a) => f(r * rad(a));
    const tip = (a, d) => [O[0] + d * Math.cos(rad(a)), O[1] - d * Math.sin(rad(a))];
    const v = tip(a2 / 2, 150);
    const body = more
      + `<g transform="translate(${O[0]} ${O[1]}) scale(1 -1)"><circle class="pie" r="${r}" fill="none" stroke-width="${2 * r}" stroke-opacity=".32"/></g>`
      + `<g class="s1" ${delay(1.5)}><path d="M${O[0]} ${O[1]} V${O[1] - R}" stroke="${C.red}" stroke-width="3" stroke-dasharray="10 8"/>`
      + `<path d="M${O[0] + 26} ${O[1]} V${O[1] - 26} H${O[0]}" fill="none" stroke="${C.red}" stroke-width="3"/>${text(ninetyX, O[1] - R + 30, '90°', { size: 22, color: C.red })}</g>`
      + `<path d="M${O[0]} ${O[1]} H${O[0] + R}" stroke="${C.ink}" stroke-width="5" stroke-linecap="round"/>`
      + `<path class="ray" d="M${O[0]} ${O[1]} H${O[0] + R}" stroke="${C.ink}" stroke-width="5" stroke-linecap="round"/>`
      + `<circle cx="${O[0]}" cy="${O[1]}" r="7" fill="${C.ink}"/>`
      + `<g class="h3"><g class="s2" ${delay(1.5)}>${text(f(v[0]), f(v[1] + 8), `${a2}°`, { size: 24, color })}</g></g>`
      + `<g class="s2" ${delay(1.7)}>${text(namePos[0], namePos[1], name, { size: 36, color })}</g>`;
    const css = `
      .sc-${id} .ray { transform-box: view-box; transform-origin: ${O[0]}px ${O[1]}px; }
      .sc-${id} .pie { stroke: ${C.red}; stroke-dasharray: 0 400; }
      .on1 .sc-${id} .ray { animation: ${id}-r1 1.2s ease-in-out .3s both; }
      .on1 .sc-${id} .pie { animation: ${id}-p1 1.2s ease-in-out .3s both; }
      .on2 .sc-${id} .ray { animation: ${id}-r2 1.2s ease-in-out .3s both; }
      .on2 .sc-${id} .pie { animation: ${id}-p2 1.2s ease-in-out .3s both; }
      .on3 .sc-${id} .ray { animation: ${id}-r3 3.6s ease-in-out .2s infinite; }
      .on3 .sc-${id} .pie { animation: ${id}-p3 3.6s ease-in-out .2s infinite; }
      @keyframes ${id}-r1 { from { transform: rotate(0deg); } to { transform: rotate(-90deg); } }
      @keyframes ${id}-p1 { from { stroke-dasharray: 0 400; } to { stroke-dasharray: ${len(90)} 400; } }
      @keyframes ${id}-r2 { from { transform: rotate(-90deg); } to { transform: rotate(${-a2}deg); } }
      @keyframes ${id}-p2 { from { stroke-dasharray: ${len(90)} 400; stroke: ${C.red}; } 30% { stroke: ${color}; } to { stroke-dasharray: ${len(a2)} 400; stroke: ${color}; } }
      @keyframes ${id}-r3 { 0%, 100% { transform: rotate(${-a2}deg); } 25% { transform: rotate(${-lo}deg); } 75% { transform: rotate(${-hi}deg); } }
      @keyframes ${id}-p3 { 0%, 100% { stroke-dasharray: ${len(a2)} 400; stroke: ${color}; } 25% { stroke-dasharray: ${len(lo)} 400; stroke: ${color}; } 75% { stroke-dasharray: ${len(hi)} 400; stroke: ${color}; } }`;
    put(`4-2/수학/2/${key}`, svg(id, body, motion(id) + css));
  }
  angleFig('t42-m2-yegak', '예각', [150, 300], 260, 50, 12, 80, C.blue, '예각', [480, 130], 116);
  angleFig('t42-m2-dungak', '둔각', [320, 290], 250, 130, 100, 170, C.green, '둔각', [520, 120], 352,
    `<g class="s3" ${delay(.2)}><path d="M320 290 H56" stroke="${C.muted}" stroke-width="3" stroke-dasharray="4 8"/>${text(86, 326, '180°', { size: 22, color: C.muted })}</g>`);

  // 예각·직각·둔각삼각형: 밑변을 두고 위 꼭짓점을 옆으로 끌면 각이 바뀌며 이름이 바뀐다
  // 위 꼭짓점은 높이가 같은 가로줄 위에서만 움직인다. 변은 '돌리기+늘이기', 부채꼴은 stroke-dasharray 로,
  // 움직이는 동안을 잘게 나눈 열쇠 그림(keyframes)으로 따라가게 한다.
  const TB = [150, 310], TC = [350, 310], TH = 200 * Math.tan(rad(50)), TY = 310 - TH;
  const AX = { acute: 150 + TH / Math.tan(rad(65)), right: 350, obtuse: 350 + TH / Math.tan(rad(55)), acute2: 150 + TH / Math.tan(rad(75)) };
  function triGeo(x) {
    const A = [x, TY];
    const b = deg(Math.atan2(TH, x - TB[0])), c = 180 - deg(Math.atan2(TH, x - TC[0]));
    return { A, b, c, a: 180 - b - c, thB: dir(TB, A), lB: Math.hypot(x - TB[0], TH), thC: dir(TC, A), lC: Math.hypot(x - TC[0], TH), psi: dir(A, TC) };
  }
  // 반올림한 세 각의 합이 180°가 되게(가장 큰 어림 차이를 고침)
  function rounded(g) {
    const raw = [g.a, g.b, g.c], r = raw.map(Math.round);
    const diff = 180 - r.reduce((s, x) => s + x, 0);
    if (diff) { const i = raw.map((x, j) => (x - r[j]) * Math.sign(diff)).reduce((best, x, j, arr) => (x > arr[best] ? j : best), 0); r[i] += diff; }
    return r;
  }
  function triFig(id, key, states, extra = { body: '', css: '' }) {
    const g0 = triGeo(AX[states[0].at]), WR = 18, len = (a) => f(WR * rad(a));
    const ease = (t) => t * t * (3 - 2 * t);
    let css = `
      .sc-${id} .sB { transform-box: view-box; transform-origin: ${TB[0]}px ${TB[1]}px; transform: rotate(${f(g0.thB)}deg) scaleX(1); }
      .sc-${id} .sC { transform-box: view-box; transform-origin: ${TC[0]}px ${TC[1]}px; transform: rotate(${f(g0.thC)}deg) scaleX(1); }
      .sc-${id} .wA { transform-box: fill-box; transform-origin: center; transform: rotate(${f(g0.psi)}deg); }
      .sc-${id} .wB { stroke-dasharray: ${len(g0.b)} 200; stroke: ${KC[kind(g0.b)]}; }
      .sc-${id} .wC { stroke-dasharray: ${len(g0.c)} 200; stroke: ${KC[kind(g0.c)]}; }
      .sc-${id} .wA { stroke-dasharray: ${len(g0.a)} 200; stroke: ${KC[kind(g0.a)]}; }
      .sc-${id} :is(${states.map((_, i) => `.st${i}`).join(',')}) { opacity: 0; }
      .sc-${id} .hint { opacity: 0; }
      @keyframes ${id}-hint { 0% { opacity: 0; } 15%, 80% { opacity: 1; } 100% { opacity: 0; } }
      @keyframes ${id}-pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.35); } }
      .sc-${id} .hd { transform-box: fill-box; transform-origin: center; }
      .on1 .sc-${id} .hd { animation: ${id}-pulse .6s ease-in-out .3s 3; }`;
    let labels = '', hints = '';
    states.forEach((st, s) => {
      const g = triGeo(AX[st.at]), [ra, rb, rc] = rounded(g);
      const vals = [[g.A, TB, TC, ra, g.a], [TB, TC, g.A, rb, g.b], [TC, TB, g.A, rc, g.c]].map(([V, P1, P2, v, a], j) => {
        const d = Math.min(118, Math.max(54, 24 / Math.sin(rad(a / 2)) + 12)), p = inside(V, P1, P2, d);
        return `<g class="v${j}">${text(f(p[0]), f(p[1] + 7), `${v}°`, { size: 20, color: KC[kind(a)] })}</g>`;
      }).join('');
      const sq = kind(g.c) === 'right' ? square(TC, TB, g.A, 22, C.red) : '';
      labels += `<g class="st${s}">${vals}${sq}${text(108, 58, st.name, { size: 30, color: KC[kind(Math.max(g.a, g.b, g.c))] })}</g>`;
      const showAt = s === 0 ? `.on1 .sc-${id} .st0 { animation: ${id}-fin .4s ease-out .2s both; }` : `.on${st.beat} .sc-${id} .st${s} { animation: ${id}-fin .4s ease-out 1.75s both; }`;
      css += `\n      ${showAt}`;
      if (s + 1 < states.length) css += `\n      .on${states[s + 1].beat} .sc-${id} .st${s} { animation: none; opacity: 0; }`;
      if (s === 0) return;
      // 앞 상태 → 이 상태로 끄는 열쇠 그림
      const xa = AX[states[s - 1].at], xb = AX[st.at], N = 16;
      const frames = { sB: [], sC: [], wA: [], wB: [], wC: [], fa: [] };
      for (let i = 0; i <= N; i++) {
        const q = triGeo(xa + (xb - xa) * ease(i / N)), pc = f(i / N * 100) + '%';
        frames.sB.push(`${pc} { transform: rotate(${f(q.thB)}deg) scaleX(${f(q.lB / g0.lB)}); }`);
        frames.sC.push(`${pc} { transform: rotate(${f(q.thC)}deg) scaleX(${f(q.lC / g0.lC)}); }`);
        frames.wA.push(`${pc} { transform: rotate(${f(q.psi)}deg); stroke-dasharray: ${len(q.a)} 200; stroke: ${KC[kind(q.a)]}; }`);
        frames.wB.push(`${pc} { stroke-dasharray: ${len(q.b)} 200; stroke: ${KC[kind(q.b)]}; }`);
        frames.wC.push(`${pc} { stroke-dasharray: ${len(q.c)} 200; stroke: ${KC[kind(q.c)]}; }`);
        frames.fa.push(`${pc} { transform: translate(${f(q.A[0] - g0.A[0])}px, 0px); }`);
      }
      for (const [k, list] of Object.entries(frames)) css += `
      @keyframes ${id}-m${s}-${k} { ${list.join(' ')} }
      .on${st.beat} .sc-${id} .${k} { animation: ${id}-m${s}-${k} 1.4s linear .3s both; }`;
      const y = TY - 30, a0 = xa + (xb > xa ? 16 : -16), a1 = xb + (xb > xa ? -16 : 16), h = xb > xa ? -1 : 1;
      hints += `<g class="hint hint${s}"><path d="M${f(a0)} ${f(y)} H${f(a1)} M${f(a1 + h * 11)} ${f(y - 8)} L${f(a1)} ${f(y)} L${f(a1 + h * 11)} ${f(y + 8)}" fill="none" stroke="${C.orange}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></g>`;
      css += `\n      .on${st.beat} .sc-${id} .hint${s} { animation: ${id}-hint 1.6s ease-in-out .2s both; }`;
    });
    const circ = (cls, tr) => `<g transform="${tr}"><circle class="${cls}" r="${WR / 2}" fill="none" stroke-width="${WR}" stroke-opacity=".45"/></g>`;
    const body = `<path d="M${TB[0] - 40} ${TB[1]} H${TC[0] + 230}" stroke="${C.line}" stroke-width="2" stroke-dasharray="4 8"/>`
      + `<path d="M${TB[0] - 40} ${f(TY)} H${TC[0] + 250}" stroke="${C.line}" stroke-width="2" stroke-dasharray="4 8"/>`
      + circ('wB', `translate(${TB[0]} ${TB[1]}) scale(1 -1)`) + circ('wC', `translate(${TC[0]} ${TC[1]}) rotate(180)`)
      + `<g class="fa">${circ('wA', `translate(${f(g0.A[0])} ${f(g0.A[1])})`)}</g>`
      + `<path d="M${TB[0]} ${TB[1]} H${TC[0]}" stroke="${C.ink}" stroke-width="4" stroke-linecap="round"/>`
      + `<path class="sB" d="M${TB[0]} ${TB[1]} H${f(TB[0] + g0.lB)}" stroke="${C.ink}" stroke-width="4"/>`
      + `<path class="sC" d="M${TC[0]} ${TC[1]} H${f(TC[0] + g0.lC)}" stroke="${C.ink}" stroke-width="4"/>`
      + `<circle cx="${TB[0]}" cy="${TB[1]}" r="5" fill="${C.ink}"/><circle cx="${TC[0]}" cy="${TC[1]}" r="5" fill="${C.ink}"/>`
      + labels + hints + extra.body
      + `<g class="fa"><g transform="translate(${f(g0.A[0])} ${f(g0.A[1])})"><circle class="hd" r="11" fill="${C.orange}" stroke="white" stroke-width="3"/></g></g>`;
    put(`4-2/수학/2/${key}`, svg(id, body, motion(id) + css + extra.css));
  }
  // 마지막 칸: 꼭짓점 C 의 각에 고리, 나머지 두 각 글자가 깜빡인다
  const finale = (id, s) => ({
    body: `<circle class="ring r3" ${delay(.2)} cx="${TC[0]}" cy="${TC[1]}" r="26" fill="none" stroke="${s === 'right' ? C.red : C.green}" stroke-width="3.5"/>`,
    css: `
      .on3 .sc-${id} .st1 :is(.v0,.v1) { animation: ${id}-blink 1.4s ease-in-out .5s both; }`
  });
  triFig('t42-m2-yegaksam', '예각삼각형', [
    { at: 'acute', name: '예각삼각형' }, { at: 'right', beat: 2, name: '직각삼각형' }, { at: 'acute2', beat: 3, name: '예각삼각형' }
  ], { body: '', css: `
      .on3 .sc-t42-m2-yegaksam .st2 :is(.v0,.v1,.v2) { animation: t42-m2-yegaksam-blink 1.4s ease-in-out 2s both; }` });
  triFig('t42-m2-jikgaksam', '직각삼각형', [
    { at: 'acute', name: '예각삼각형' }, { at: 'right', beat: 2, name: '직각삼각형' }
  ], finale('t42-m2-jikgaksam', 'right'));
  triFig('t42-m2-dungaksam', '둔각삼각형', [
    { at: 'right', name: '직각삼각형' }, { at: 'obtuse', beat: 2, name: '둔각삼각형' }
  ], finale('t42-m2-dungaksam', 'obtuse'));
})(typeof window !== 'undefined' ? window : globalThis);
