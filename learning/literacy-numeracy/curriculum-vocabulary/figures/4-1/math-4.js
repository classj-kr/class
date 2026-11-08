// 수학 4-1 4단원 평면도형의 이동: 낱말 도식
// 교과서를 따른다: 밀면 모양·방향은 그대로이고 위치만 바뀐다. 오른쪽(왼쪽)으로 뒤집으면 왼쪽과 오른쪽이,
// 위쪽(아래쪽)으로 뒤집으면 위쪽과 아래쪽이 바뀐다. 시계 방향·시계 반대 방향으로 90°, 180°, 270°, 360°만큼 돌린다.
// 움직이는 조각은 좌우·상하가 모두 다른 깃발(왼쪽에 깃대, 위쪽에 오른쪽을 가리키는 깃발)이라 바뀐 것이 한눈에 보인다.
// 조각은 3칸 × 3칸 네모 안에 있고, 돌리기는 그 네모의 가운데를, 뒤집기는 맞닿은 변을 기준으로 한다.
(function (root) {
  'use strict';
  const { C, svg, text, arrow, put } = root.FigureKit;
  const f = (n) => +(+n).toFixed(1);
  const delay = (s, more = '') => `style="animation-delay:${s}s;transition-delay:${s}s;${more}"`;
  const rad = (d) => d * Math.PI / 180;

  // 같이 쓰는 움직임. sN 나타나기, pN 튀어나오기, dN 선 그리기(pathLength="1"), rN 퍼지는 고리, kN 깜빡이며 남기
  const motion = (id) => {
    let css = `
    .sc-${id} :is(.s1,.s2,.s3,.s4,.p1,.p2,.p3,.p4,.k1,.k2,.k3,.k4) { opacity: 0; }
    .sc-${id} :is(.p1,.p2,.p3,.p4,.ring) { transform-box: fill-box; transform-origin: center; }
    .sc-${id} .draw { stroke-dasharray: 1; stroke-dashoffset: 1; transition: stroke-dashoffset .9s ease-in-out; }
    .sc-${id} .ring { opacity: 0; }
    @keyframes ${id}-fin { from { opacity: 0; } to { opacity: 1; } }
    @keyframes ${id}-pop { 0% { opacity: 0; transform: scale(0); } 70% { opacity: 1; transform: scale(1.2); } 100% { opacity: 1; transform: scale(1); } }
    @keyframes ${id}-ring { 0% { opacity: .9; transform: scale(1); } 100% { opacity: 0; transform: scale(2.4); } }
    @keyframes ${id}-blink { 0% { opacity: 0; } 20% { opacity: 1; } 40% { opacity: .15; } 60% { opacity: 1; } 80% { opacity: .15; } 100% { opacity: 1; } }
    @keyframes ${id}-fl { 0%, 50%, 100% { opacity: 1; } 25%, 75% { opacity: .3; } }`;
    for (let n = 1; n <= 4; n++) css += `
    .on${n} .sc-${id} .s${n} { animation: ${id}-fin .4s ease-out both; }
    .on${n} .sc-${id} .p${n} { animation: ${id}-pop .5s ease-out both; }
    .on${n} .sc-${id} .d${n} { stroke-dashoffset: 0; }
    .on${n} .sc-${id} .r${n} { animation: ${id}-ring 1.1s ease-out 2 both; }
    .on${n} .sc-${id} .k${n} { animation: ${id}-blink 1.6s ease-in-out both; }
    .on${n} .sc-${id} .fl${n} { animation: ${id}-fl 1.4s ease-in-out both; }`;
    return css;
  };
  // 모눈 위에서도 읽히게 바탕색 테두리를 두른 글자
  const H = (x, y, s, { size = 20, color = C.ink, anchor = 'middle', weight = 700 } = {}) =>
    `<text x="${f(x)}" y="${f(y)}" text-anchor="${anchor}" font-size="${size}" font-weight="${weight}" fill="${color}" stroke="${C.paper}" stroke-width="6" stroke-linejoin="round" paint-order="stroke">${s}</text>`;
  const pill = (cx, cy, w, s, color = C.green, fill = C.mint, size = 24) => `<rect x="${f(cx - w / 2)}" y="${f(cy - 21)}" width="${w}" height="42" rx="21" fill="${fill}" stroke="${color}" stroke-width="2.5"/>${text(f(cx), f(cy + size * .36), s, { size, color })}`;
  const ring = (cx, cy, r, color, cls, d = 0) => `<circle class="ring ${cls}" ${delay(d)} cx="${f(cx)}" cy="${f(cy)}" r="${r}" fill="none" stroke="${color}" stroke-width="4"/>`;
  // 모눈: 선 하나로
  const grid = (x0, y0, cols, rows, s, color = C.line, w = 1.5) => {
    let d = '';
    for (let i = 0; i <= cols; i++) d += `M${f(x0 + i * s)} ${y0}V${f(y0 + rows * s)}`;
    for (let j = 0; j <= rows; j++) d += `M${x0} ${f(y0 + j * s)}H${f(x0 + cols * s)}`;
    return `<path d="${d}" stroke="${color}" stroke-width="${w}" fill="none"/>`;
  };
  // 깃발 조각: (x, y) 는 3칸 네모의 왼쪽 위
  const parts = (x, y, s) => {
    const X = (u) => f(x + u * s), Y = (v) => f(y + v * s);
    return { pole: `M${X(.5)} ${Y(.25)}H${X(.86)}V${Y(2.75)}H${X(.5)}Z`, flag: `M${X(.86)} ${Y(.3)}L${X(2.7)} ${Y(.98)}L${X(.86)} ${Y(1.66)}Z` };
  };
  const flag = (x, y, s, color = C.orange) => { const p = parts(x, y, s); return `<path d="${p.flag}" fill="${color}" stroke="${C.ink}" stroke-width="2.5" stroke-linejoin="round"/><path d="${p.pole}" fill="${C.ink}"/>`; };
  const ghost = (x, y, s, color = C.muted, w = 2.5, dash = '6 5') => { const p = parts(x, y, s); return `<path d="${p.pole}${p.flag}" fill="none" stroke="${color}" stroke-width="${w}" ${dash ? `stroke-dasharray="${dash}"` : ''} stroke-linejoin="round"/>`; };
  // 돌린 양을 보이는 굽은 화살표: 12시에서 a0°부터 a1°까지(a1 > a0 이면 시계 방향)
  function arcArrow(cx, cy, r, a0, a1, color, cls, d = 0, w = 4, dur = 1) {
    const P = (a) => [cx + r * Math.sin(rad(a)), cy - r * Math.cos(rad(a))];
    const cw = a1 > a0, span = Math.abs(a1 - a0), [sx, sy] = P(a0), [ex, ey] = P(a1);
    const line = `<path class="draw ${cls}" pathLength="1" ${delay(d, `transition-duration:${dur}s;transition-timing-function:linear;`)} d="M${f(sx)} ${f(sy)} A${r} ${r} 0 ${span > 180 ? 1 : 0} ${cw ? 1 : 0} ${f(ex)} ${f(ey)}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round"/>`;
    const t = cw ? [Math.cos(rad(a1)), Math.sin(rad(a1))] : [-Math.cos(rad(a1)), -Math.sin(rad(a1))];
    const back = (k) => { const c = Math.cos(k), s = Math.sin(k); return [ex - 13 * (t[0] * c - t[1] * s), ey - 13 * (t[0] * s + t[1] * c)]; };
    const [b1, b2] = [back(.5), back(-.5)];
    return { line, head: `<path d="M${f(b1[0])} ${f(b1[1])}L${f(ex)} ${f(ey)}L${f(b2[0])} ${f(b2[1])}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>` };
  }
  const pin = (x, y) => `<circle cx="${f(x)}" cy="${f(y)}" r="5" fill="${C.ink}"/><circle cx="${f(x)}" cy="${f(y)}" r="2" fill="white"/>`;
  // 움직임: 감싼 <g> 의 기준점을 화면 좌표로 정한다
  const origin = (x, y) => `transform-box: view-box; transform-origin: ${f(x)}px ${f(y)}px;`;

  // 평면도형: 평평한 종이 위에 삼각형·사각형·원·별 → 종이를 눕혀 옆에서 보면 도형이 종이와 함께 얇은 선 → 다시 펼치고 이름
  (function () {
    const id = 't41-m4-pyeongmyeon';
    const st = [];
    for (let k = 0; k < 10; k++) { const R = k % 2 ? 19 : 46, a = rad(-90 + 36 * k); st.push(`${f(505 + R * Math.cos(a))} ${f(200 + R * Math.sin(a))}`); }
    const shapes = [
      ['M110 250L210 250L160 142Z', C.sky, C.blue],
      ['M240 155H330V250H240Z', C.mint, C.green],
      ['M357 202A48 48 0 1 0 453 202A48 48 0 1 0 357 202Z', C.peach, C.orange],
      [`M${st.join('L')}Z`, C.lilac, C.purple]
    ];
    const fills = shapes.map(([d, fill], i) => `<path class="s1" ${delay(.5 + i * .35)} d="${d}" fill="${fill}"/>`).join('');
    const lines = shapes.map(([d, , stroke], i) => `<path class="draw d1" pathLength="1" ${delay(.1 + i * .35)} d="${d}" fill="none" stroke="${stroke}" stroke-width="4" stroke-linejoin="round"/>`).join('');
    const eye = `<path d="M22 195Q44 177 66 195Q44 213 22 195Z" fill="white" stroke="${C.ink}" stroke-width="3"/><circle cx="46" cy="195" r="6" fill="${C.ink}"/>`;
    const body = `<g class="sheet"><rect x="80" y="105" width="480" height="180" rx="6" fill="white" stroke="${C.line}" stroke-width="3"/><g class="fl3" ${delay(.9)}>${fills}${lines}</g></g>`
      + `<g class="b2 h3"><g class="s2" ${delay(.9)}>${eye}</g><path class="s2" ${delay(1.8)} d="M80 195H560" stroke="${C.ink}" stroke-width="3" opacity=".55"/></g>`
      + `<g class="p3" ${delay(1.2)}>${pill(320, 58, 140, '평면도형')}</g>`;
    put('4-1/수학/4/평면도형', svg(id, body, motion(id) + `
      .sc-${id} .sheet { ${origin(320, 195)} }
      .on2 .sc-${id} .sheet { animation: ${id}-tilt 2s ease-in-out .2s both; }
      .on3 .sc-${id} .sheet { animation: ${id}-open .9s ease-in-out .1s both; }
      @keyframes ${id}-tilt { 0% { transform: scaleY(1); } 40%, 55% { transform: scaleY(.4); } 100% { transform: scaleY(.03); } }
      @keyframes ${id}-open { from { transform: scaleY(.03); } to { transform: scaleY(1); } }`));
  })();

  // 이동: 세 칸에서 차례로 밀기(오른쪽으로 3칸), 뒤집기(오른쪽으로), 돌리기(시계 방향 90°) → 셋을 묶어 이동
  (function () {
    const id = 't41-m4-idong', s = 30, cxs = [115, 320, 525], gy = 95, py = 125;
    const A = [cxs[0] - 90, py], B = [cxs[1] - 90, py], Cc = [cxs[2] - 60, py];
    const cC = [Cc[0] + 45, py + 45];
    const flip = `<path class="draw d2" pathLength="1" d="M275 84Q320 46 365 84" fill="none" stroke="${C.purple}" stroke-width="4" stroke-linecap="round"/><g class="s2" ${delay(1)}><path d="M352 74L365 84L349 88" fill="none" stroke="${C.purple}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></g>`;
    const rot = arcArrow(cC[0], cC[1], 62, 0, 90, C.green, 'd3', .3);
    const names = [['밀기', C.blue], ['뒤집기', C.purple], ['돌리기', C.green]];
    const body = cxs.map((cx) => grid(cx - 90, gy, 6, 5, s)).join('')
      + `<g class="b1">${ghost(...A, s)}</g><g class="b2">${ghost(...B, s)}</g>`
      + `<g class="mvA">${flag(...A, s)}</g><g class="mvB">${flag(...B, s)}</g><g class="mvC">${flag(...Cc, s)}</g>`
      + `<g class="b3">${pin(...cC)}</g>`
      + `<g class="s1" ${delay(.3)}>${arrow(70, 80, 160, 80, C.blue)}</g>` + flip + rot.line + `<g class="s3" ${delay(1.2)}>${rot.head}</g>`
      + names.map(([n, c], i) => `<g class="s${i + 1}" ${delay(1)}>${text(cxs[i], 282, n, { size: 26, color: c })}</g>`).join('')
      + `<path class="draw d4" pathLength="1" d="M115 296V306H525V296M320 306V316" fill="none" stroke="${C.green}" stroke-width="3"/>`
      + `<g class="p4" ${delay(.6)}>${pill(320, 336, 100, '이동')}</g>`;
    put('4-1/수학/4/이동', svg(id, body, motion(id) + `
      .sc-${id} .mvA { ${origin(A[0] + 45, py + 45)} transition: transform 1.2s ease-in-out .3s; }
      .on1 .sc-${id} .mvA { transform: translate(90px, 0px); }
      .sc-${id} .mvB { ${origin(cxs[1], py + 45)} transition: transform 1.2s ease-in-out .3s; }
      .on2 .sc-${id} .mvB { transform: scaleX(-1); }
      .sc-${id} .mvC { ${origin(...cC)} transition: transform 1.2s ease-in-out .3s; }
      .on3 .sc-${id} .mvC { transform: rotate(90deg); }
      .on4 .sc-${id} :is(.mvA, .mvB, .mvC) { animation: ${id}-fl 1.4s ease-in-out .9s both; }`));
  })();

  // 위치: 가~라 줄, 1~6 줄 → 빨간 점은 다의 2 → 점을 옮기면 나의 5 → 점 고리와 이름
  (function () {
    const id = 't41-m4-wichi', s = 50, X0 = 150, Y0 = 80;
    const rows = ['가', '나', '다', '라'];
    const cx = (c) => X0 + s * c + s / 2, cy = (r) => Y0 + s * r + s / 2;
    const P0 = [cx(1), cy(2)], P1 = [cx(4), cy(1)];
    const labels = [1, 2, 3, 4, 5, 6].map((n, c) => text(cx(c), Y0 - 14, n, { size: 22 })).join('') + rows.map((n, r) => text(X0 - 24, cy(r) + 8, n, { size: 22 })).join('');
    const body = `<g class="b2"><g class="rowB"><rect x="${X0 - 46}" y="${Y0 + 2 * s}" width="${6 * s + 46}" height="${s}" fill="${C.yellow}" opacity=".35"/></g>`
      + `<g class="colB"><rect x="${X0 + s}" y="${Y0 - 40}" width="${s}" height="${4 * s + 40}" fill="${C.sky}" opacity=".7"/></g></g>`
      + grid(X0, Y0, 6, 4, s, C.muted, 2) + labels
      + `<g class="b3"><circle cx="${P0[0]}" cy="${P0[1]}" r="14" fill="none" stroke="${C.red}" stroke-width="3" stroke-dasharray="5 4"/></g>`
      + `<g class="dot"><circle cx="${P0[0]}" cy="${P0[1]}" r="14" fill="${C.red}" stroke="white" stroke-width="3"/></g>`
      + ring(...P1, 15, C.red, 'r4', .2)
      + `<g class="b2 h3"><g class="s2" ${delay(1)}>${text(550, P0[1] + 9, '다의 2', { size: 28, color: C.red })}</g></g>`
      + `<g class="s3" ${delay(1.7)}>${text(550, P1[1] + 9, '나의 5', { size: 28, color: C.red })}</g>`
      + `<g class="p4" ${delay(.6)}>${pill(550, 280, 100, '위치')}</g>`;
    const dx = P1[0] - P0[0], dy = P1[1] - P0[1];
    put('4-1/수학/4/위치', svg(id, body, motion(id) + `
      .sc-${id} :is(.dot, .rowB, .colB) { transition: transform .8s ease-in-out; }
      .on3 .sc-${id} .dot { animation: ${id}-go 1.5s ease-in-out .2s both; }
      @keyframes ${id}-go { 0% { transform: translate(0px, 0px); } 60% { transform: translate(${dx}px, 0px); } 100% { transform: translate(${dx}px, ${dy}px); } }
      .on3 .sc-${id} .colB { transform: translate(${dx}px, 0px); transition-delay: .2s; }
      .on3 .sc-${id} .rowB { transform: translate(0px, ${dy}px); transition-delay: 1.1s; }`));
  })();

  // 방향: 점에서 네 쪽 화살표 → 점을 오른쪽으로 3칸, 위쪽으로 2칸 → 거꾸로 붙은 화살표를 오른쪽으로 뒤집어 보건실 쪽으로 → 네 쪽 이름
  (function () {
    const id = 't41-m4-banghyang', s = 40, O = [180, 180];
    const cmp = `<circle cx="${O[0]}" cy="${O[1]}" r="9" fill="${C.ink}"/>`
      + arrow(180, 166, 180, 108, C.blue) + arrow(180, 194, 180, 252, C.blue) + arrow(166, 180, 108, 180, C.blue) + arrow(194, 180, 252, 180, C.blue)
      + H(180, 96, '위쪽', { size: 22, color: C.blue }) + H(180, 282, '아래쪽', { size: 22, color: C.blue })
      + H(80, 188, '왼쪽', { size: 22, color: C.blue }) + H(292, 188, '오른쪽', { size: 22, color: C.blue });
    const sign = `<path d="M500 210V300" stroke="${C.muted}" stroke-width="8" stroke-linecap="round"/><rect x="400" y="130" width="200" height="80" rx="12" fill="white" stroke="${C.ink}" stroke-width="3"/>`
      + `<path d="M553 157h12v-12h12v12h12v12h-12v12h-12v-12h-12Z" fill="${C.red}"/>`
      + text(500, 116, '보건실', { size: 22, color: C.red });
    const blk = `<path d="M420 170L452 146V160H520V180H452V194Z" fill="${C.orange}" stroke="${C.ink}" stroke-width="2.5" stroke-linejoin="round"/>`;
    const body = grid(20, 60, 8, 6, s)
      + `<g class="cmp"><g class="s1" ${delay(.2)}>${cmp}</g></g>`
      + `<g class="mvset"><g class="b2"><circle cx="${O[0]}" cy="${O[1]}" r="11" fill="none" stroke="${C.red}" stroke-width="3" stroke-dasharray="5 4"/></g>`
      + `<path class="draw d2" pathLength="1" ${delay(.3)} d="M180 180H300V100" fill="none" stroke="${C.orange}" stroke-width="4" stroke-linecap="round"/>`
      + `<g class="dot"><circle cx="${O[0]}" cy="${O[1]}" r="11" fill="${C.red}" stroke="white" stroke-width="3"/></g>`
      + `<g class="s2" ${delay(1)}>${H(250, 212, '오른쪽 3칸', { size: 20, color: C.orange })}</g><g class="s2" ${delay(1.7)}>${H(290, 146, '위쪽 2칸', { size: 20, color: C.orange, anchor: 'end' })}</g></g>`
      + `<g class="b3">${sign}<g class="flipA">${blk}</g></g>`
      + ring(570, 163, 22, C.red, 'r3', 1.5)
      + `<g class="p4" ${delay(1)}>${pill(500, 300, 100, '방향')}</g>`;
    put('4-1/수학/4/방향', svg(id, body, motion(id) + `
      .sc-${id} .cmp { transition: opacity .4s ease; }
      .on2 .sc-${id} .cmp { opacity: 0; }
      .on4 .sc-${id} .cmp { opacity: 1; animation: ${id}-fl 1.4s ease-in-out .6s both; }
      .sc-${id} .mvset { transition: opacity .4s ease; }
      .on4 .sc-${id} .mvset { opacity: 0; }
      .on2 .sc-${id} .dot { animation: ${id}-go 1.6s ease-in-out .3s both; }
      @keyframes ${id}-go { 0% { transform: translate(0px, 0px); } 60% { transform: translate(120px, 0px); } 100% { transform: translate(120px, -80px); } }
      .sc-${id} .flipA { ${origin(470, 170)} transition: transform 1s ease-in-out .7s; }
      .on3 .sc-${id} .flipA { transform: scaleX(-1); }`));
  })();

  // 밀기: 오른쪽으로 5칸 → 아래쪽으로 5칸 → 옮긴 조각의 테두리를 처음 자리로 가져가면 꼭 겹침 → 이름
  (function () {
    const id = 't41-m4-milgi', s = 30, A = [80, 60];
    const body = grid(50, 30, 18, 10, s)
      + `<g class="b1">${ghost(...A, s)}</g><g class="b2">${ghost(A[0] + 150, A[1], s)}</g>`
      + `<g class="mv">${flag(...A, s)}</g>`
      + `<g class="s1" ${delay(1.2)}>${arrow(100, 168, 248, 168, C.blue)}${H(175, 197, '오른쪽 5칸', { size: 20, color: C.blue })}</g>`
      + `<g class="s2" ${delay(1.2)}>${arrow(338, 105, 338, 253, C.blue)}${H(352, 186, '아래쪽 5칸', { size: 20, color: C.blue, anchor: 'start' })}</g>`
      + `<g class="trace"><g fill-opacity=".25">${flag(A[0] + 150, A[1] + 150, s, C.green)}</g>${ghost(A[0] + 150, A[1] + 150, s, C.green, 4, '')}</g>`
      + ring(A[0] + 2.7 * s, A[1] + .98 * s, 14, C.green, 'r3', 1.6)
      + `<g class="p4" ${delay(.6)}>${pill(500, 90, 100, '밀기')}</g>`;
    put('4-1/수학/4/밀기', svg(id, body, motion(id) + `
      .sc-${id} .mv { transition: transform 1.2s ease-in-out .2s; }
      .on1 .sc-${id} .mv { transform: translate(150px, 0px); }
      .on2 .sc-${id} .mv { transform: translate(150px, 150px); }
      .sc-${id} .trace { opacity: 0; }
      .on3 .sc-${id} .trace { opacity: 1; animation: ${id}-back 1.3s ease-in-out .2s both; }
      @keyframes ${id}-back { from { transform: translate(0px, 0px); } to { transform: translate(-150px, -150px); } }
      .on4 .sc-${id} .mv { animation: ${id}-fl 1.4s ease-in-out .2s both; }`));
  })();

  // 뒤집기: 가운데 조각을 오른쪽·왼쪽으로 뒤집으면 깃발이 왼쪽을 가리킴 → 위쪽·아래쪽으로 뒤집으면 깃발이 아래로 → 이름
  (function () {
    const id = 't41-m4-dwijipgi', s = 30, O = [275, 135];
    const copy = (cls) => `<g class="${cls}">${flag(...O, s, C.blue)}</g>`;
    const body = grid(5, 15, 21, 11, s)
      + `<g class="b1">${copy('cR')}${copy('cL')}</g><g class="b2">${copy('cU')}${copy('cD')}</g>`
      + flag(...O, s)
      + `<g class="b1"><path d="M365 122V238M275 122V238" stroke="${C.green}" stroke-width="3.5" stroke-dasharray="9 7"/></g>`
      + `<g class="b2"><path d="M262 135H378M262 225H378" stroke="${C.green}" stroke-width="3.5" stroke-dasharray="9 7"/></g>`
      + `<g class="s1" ${delay(1.3)}>${H(468, 187, '오른쪽으로', { color: C.blue, anchor: 'start' })}${H(172, 187, '왼쪽으로', { color: C.blue, anchor: 'end' })}</g>`
      + `<g class="s2" ${delay(1.3)}>${H(382, 97, '위쪽으로', { color: C.blue, anchor: 'start' })}${H(382, 280, '아래쪽으로', { color: C.blue, anchor: 'start' })}</g>`
      + `<g class="p3" ${delay(1.6)}>${pill(540, 322, 110, '뒤집기')}</g>`;
    const t = 'transition: transform 1.1s ease-in-out .3s;';
    put('4-1/수학/4/뒤집기', svg(id, body, motion(id) + `
      .sc-${id} .cR { ${origin(365, 180)} ${t} } .on1 .sc-${id} .cR { transform: scaleX(-1); }
      .sc-${id} .cL { ${origin(275, 180)} ${t} } .on1 .sc-${id} .cL { transform: scaleX(-1); }
      .sc-${id} .cU { ${origin(320, 135)} ${t} } .on2 .sc-${id} .cU { transform: scaleY(-1); }
      .sc-${id} .cD { ${origin(320, 225)} ${t} } .on2 .sc-${id} .cD { transform: scaleY(-1); }
      .on3 .sc-${id} :is(.cR, .cL) { animation: ${id}-fl 1.2s ease-in-out .1s both; }
      .on3 .sc-${id} :is(.cU, .cD) { animation: ${id}-fl 1.2s ease-in-out 1.1s both; }`));
  })();

  // 돌리기: 시계 방향으로 90° → 180°, 270° → 360°는 처음과 같음 → 가운데 점과 이름
  (function () {
    const id = 't41-m4-dolligi', s = 26, y = 120, ang = [0, 90, 180, 270, 360];
    const xs = ang.map((_, i) => 45 + 118 * i), cen = (i) => [xs[i] + 39, y + 39];
    const beatOf = [0, 1, 2, 2, 3], dl = [0, .3, .2, .8, .2];
    let body = '', css = '';
    ang.forEach((a, i) => {
      const [cx, cy] = cen(i);
      body += grid(xs[i], y, 3, 3, s);
      if (i === 0) { body += flag(xs[i], y, s); }
      else {
        body += `<g class="rt${i}">${flag(xs[i], y, s, C.blue)}</g>`;
        const arc = arcArrow(cx, cy, 52, 0, Math.min(a, 348), C.green, `d${beatOf[i]}`, dl[i], 3.5, 1.1);
        body += arc.line + `<g class="s${beatOf[i]}" ${delay(dl[i] + 1.1)}>${arc.head}</g>`;
        css += `.sc-${id} .rt${i} { ${origin(cx, cy)} transition: transform 1.1s ease-in-out ${dl[i]}s; } .on${beatOf[i]} .sc-${id} .rt${i} { transform: rotate(${a}deg); }`;
      }
      body += pin(cx, cy) + text(cx, 246, i ? `${a}°` : '처음', { size: 22, color: i ? C.green : C.ink });
    });
    body += `<g class="k3" ${delay(1.5)}><rect x="${xs[0] - 6}" y="${y - 6}" width="90" height="90" rx="8" fill="none" stroke="${C.red}" stroke-width="3.5"/><rect x="${xs[4] - 6}" y="${y - 6}" width="90" height="90" rx="8" fill="none" stroke="${C.red}" stroke-width="3.5"/></g>`
      + ang.map((_, i) => ring(...cen(i), 6, C.ink, 'r4', .2)).join('')
      + `<g class="p4" ${delay(.8)}>${pill(320, 310, 110, '돌리기')}</g>`;
    put('4-1/수학/4/돌리기', svg(id, body, motion(id) + css));
  })();

  // 시계 그림: 바늘이 도는 쪽을 keyframes 로(돌 방향 dir = 1 시계, -1 반대)
  const clock = (cx, cy, r) => {
    let ticks = '';
    for (let k = 0; k < 12; k++) { const a = rad(30 * k); ticks += `M${f(cx + (r - 13) * Math.sin(a))} ${f(cy - (r - 13) * Math.cos(a))}L${f(cx + (r - 2) * Math.sin(a))} ${f(cy - (r - 2) * Math.cos(a))}`; }
    const n = r - 32;
    return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="white" stroke="${C.ink}" stroke-width="4"/><path d="${ticks}" stroke="${C.ink}" stroke-width="3"/>`
      + text(cx, cy - n + 9, 12, { size: 24 }) + text(cx + n, cy + 8, 3, { size: 24 }) + text(cx, cy + n + 8, 6, { size: 24 }) + text(cx - n, cy + 8, 9, { size: 24 });
  };
  const hand = (cx, cy, r) => `<g class="hand"><path d="M${cx} ${cy + 12}V${cy - r + 62}" stroke="${C.red}" stroke-width="6" stroke-linecap="round"/><path d="M${cx - 10} ${cy - r + 70}L${cx} ${cy - r + 52}L${cx + 10} ${cy - r + 70}Z" fill="${C.red}"/></g><circle cx="${cx}" cy="${cy}" r="8" fill="${C.ink}"/>`;
  const handCss = (id, cx, cy, dir) => `
      .sc-${id} .hand { ${origin(cx, cy)} }
      .on1 .sc-${id} .hand { animation: ${id}-tick 4s ease-in-out .2s both; }
      .on2 .sc-${id} .hand { animation: ${id}-q 1.2s ease-in-out .3s both; }
      @keyframes ${id}-tick { 0% { transform: rotate(0deg); } 18%, 28% { transform: rotate(${90 * dir}deg); } 46%, 56% { transform: rotate(${180 * dir}deg); } 74%, 84% { transform: rotate(${270 * dir}deg); } 100% { transform: rotate(${360 * dir}deg); } }
      @keyframes ${id}-q { from { transform: rotate(0deg); } to { transform: rotate(${90 * dir}deg); } }`;

  // 시계 방향: 바늘이 12 → 3 → 6 → 9 → 12 → 깃발 조각을 바늘이 도는 쪽으로 90°(깃발이 아래쪽을 가리킴) → 이름
  (function () {
    const id = 't41-m4-sigye', s = 30, K = [165, 185], R = 112, Q = [405, 140], qc = [450, 185];
    const outer = arcArrow(...K, 130, 12, 340, C.green, 'd1', .2, 4, 3.8);
    const turn = arcArrow(...qc, 64, 0, 90, C.green, 'd2', .3, 4, 1.2);
    const body = clock(...K, R) + hand(...K, R)
      + `<g class="fl3" ${delay(.2)}>${outer.line}<g class="s1" ${delay(3.9)}>${outer.head}</g></g>`
      + `<g class="s2">${grid(...Q, 3, 3, s)}</g>`
      + `<g class="s2"><g class="rt">${flag(...Q, s)}</g>${pin(...qc)}</g>`
      + `<g class="fl3" ${delay(.2)}>${turn.line}<g class="s2" ${delay(1.4)}>${turn.head}${H(518, 140, '90°', { size: 24, color: C.green, anchor: 'start' })}</g></g>`
      + `<g class="p3" ${delay(1)}>${pill(450, 310, 130, '시계 방향')}</g>`;
    put('4-1/수학/4/시계 방향', svg(id, body, motion(id) + handCss(id, ...K, 1) + `
      .sc-${id} .rt { ${origin(...qc)} transition: transform 1.2s ease-in-out .3s; }
      .on2 .sc-${id} .rt { transform: rotate(90deg); }`));
  })();

  // 시계 반대 방향: 바늘이 12 → 9 → 6 → 3 → 12 → 깃발 조각을 90°(깃발이 위쪽을 가리킴) → 시계 방향 270°와 같음 → 이름
  (function () {
    const id = 't41-m4-bandae', s = 30, K = [150, 185], R = 106, QA = [325, 140], ca = [370, 185], QB = [495, 140], cb = [540, 185];
    const outer = arcArrow(...K, 124, -12, -340, C.purple, 'd1', .2, 4, 3.8);
    const tA = arcArrow(...ca, 62, 0, -90, C.purple, 'd2', .3, 4, 1.2);
    const tB = arcArrow(...cb, 62, 0, 270, C.green, 'd3', .2, 4, 1.3);
    const body = clock(...K, R) + hand(...K, R)
      + `<g class="fl4" ${delay(.2)}>${outer.line}<g class="s1" ${delay(3.9)}>${outer.head}</g></g>`
      + `<g class="s2">${grid(...QA, 3, 3, s)}<g class="rtA">${flag(...QA, s)}</g>${pin(...ca)}</g>`
      + `<g class="fl4" ${delay(.2)}>${tA.line}<g class="s2" ${delay(1.4)}>${tA.head}${text(ca[0], 284, '90°', { size: 24, color: C.purple })}</g></g>`
      + `<g class="s3">${grid(...QB, 3, 3, s)}<g class="rtB">${flag(...QB, s, C.blue)}</g>${pin(...cb)}</g>`
      + tB.line + `<g class="s3" ${delay(1.5)}>${tB.head}${text(cb[0], 284, '270°', { size: 24, color: C.green })}</g>`
      + `<g class="p3" ${delay(1.7)}>${text(455, 196, '=', { size: 40 })}</g>`
      + `<g class="p4" ${delay(.6)}>${pill(370, 330, 180, '시계 반대 방향')}</g>`;
    put('4-1/수학/4/시계 반대 방향', svg(id, body, motion(id) + handCss(id, ...K, -1) + `
      .sc-${id} .rtA { ${origin(...ca)} transition: transform 1.2s ease-in-out .3s; }
      .on2 .sc-${id} .rtA { transform: rotate(-90deg); }
      .sc-${id} .rtB { ${origin(...cb)} transition: transform 1.3s ease-in-out .2s; }
      .on3 .sc-${id} .rtB { transform: rotate(270deg); }`));
  })();
})(typeof window !== 'undefined' ? window : globalThis);
