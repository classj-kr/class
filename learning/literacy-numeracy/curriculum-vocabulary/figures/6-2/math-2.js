// 수학 6-2 2단원 공간과 입체: 낱말 도식(쌓기나무)
// 쌓기나무는 사선 투영으로 그린다. 앞면은 정사각형 그대로, 뒤로 한 칸 갈 때마다 (dx, -dy) 만큼 밀린다.
// 칸 (x, y, z): x 는 왼쪽→오른쪽, y 는 앞→뒤, z 는 아래→위. 앞면·윗면·오른쪽 옆면만 보이므로
// 뒤(y 큰 것)부터, 같은 줄은 왼쪽부터, 같은 기둥은 아래부터 그리면 가려지는 것이 맞게 가려진다.
(function (root) {
  'use strict';
  const { C, svg, text, arrow, put } = root.FigureKit;
  const f = (n) => +n.toFixed(1);
  const delay = (s, more = '') => `style="animation-delay:${s}s;transition-delay:${s}s;${more}"`;
  const P = (pts) => pts.map(([x, y]) => `${f(x)},${f(y)}`).join(' ');
  const STROKE = `stroke="${C.ink}" stroke-width="2.5" stroke-linejoin="round"`;

  const motion = (id) => {
    let css = `
    .sc-${id} :is(.s1,.s2,.s3,.s4,.p1,.p2,.p3,.p4) { opacity: 0; }
    .sc-${id} :is(.p1,.p2,.p3,.p4,.ring) { transform-box: fill-box; transform-origin: center; }
    .sc-${id} .ring { opacity: 0; }
    @keyframes ${id}-fin { from { opacity: 0; } to { opacity: 1; } }
    @keyframes ${id}-pop { 0% { opacity: 0; transform: scale(0); } 70% { opacity: 1; transform: scale(1.15); } 100% { opacity: 1; transform: scale(1); } }
    @keyframes ${id}-ring { 0% { opacity: .9; transform: scale(1); } 100% { opacity: 0; transform: scale(2.2); } }
    @keyframes ${id}-drop { 0% { opacity: 0; transform: translateY(-110px); } 55% { opacity: 1; transform: translateY(5px); } 78% { transform: translateY(-3px); } 100% { opacity: 1; transform: none; } }`;
    for (let n = 1; n <= 4; n++) css += `
    .on${n} .sc-${id} .s${n} { animation: ${id}-fin .4s ease-out both; }
    .on${n} .sc-${id} .p${n} { animation: ${id}-pop .45s ease-out both; }
    .on${n} .sc-${id} .r${n} { animation: ${id}-ring 1.1s ease-out 2 both; }
    .sc-${id} .dr${n} { opacity: 0; }
    .on${n} .sc-${id} .dr${n} { animation: ${id}-drop .6s ease-out both; }`;
    return css;
  };

  // 사선 투영 틀
  function frame(ox, oy, s, dx, dy) {
    const at = (x, y, z) => [ox + x * s + y * dx, oy - z * s - y * dy];
    const faces = (x, y, z) => {
      const [bx, by] = at(x, y, z);
      return {
        front: [[bx, by], [bx + s, by], [bx + s, by - s], [bx, by - s]],
        top: [[bx, by - s], [bx + s, by - s], [bx + s + dx, by - s - dy], [bx + dx, by - s - dy]],
        right: [[bx + s, by], [bx + s + dx, by - dy], [bx + s + dx, by - s - dy], [bx + s, by - s]]
      };
    };
    return { at, faces, s, dx, dy };
  }
  const order = (list) => list.slice().sort((a, b) => b[1] - a[1] || a[0] - b[0] || a[2] - b[2]);
  // 색: [앞면, 윗면 색과 진하기, 옆면 색과 진하기]
  const WOOD = [C.peach, [C.yellow, .45], [C.orange, .5]];
  const BLUE = [C.sky, [C.sky, .45], [C.blue, .42]];
  const GREEN = [C.mint, [C.mint, .45], [C.green, .4]];
  const ORANGE = [C.peach, [C.yellow, .45], [C.orange, .5]];
  const shade = (pts, [color, a]) => `<polygon points="${P(pts)}" fill="${C.paper}"/><polygon points="${P(pts)}" fill="${color}" fill-opacity="${a}" ${STROKE}/>`;
  // 쌓기나무 한 개. over: 면마다 덧칠할 색(보는 방향 표시용, 처음엔 투명)
  function cube(F, pal = WOOD, over = null) {
    let s = `<polygon points="${P(F.front)}" fill="${pal[0]}" ${STROKE}/>` + shade(F.top, pal[1]) + shade(F.right, pal[2]);
    if (over) s += ['front', 'top', 'right'].map((k) => `<polygon class="ov h${k[0]}" style="--a:${over[k][1]}" points="${P(F[k])}" fill="${over[k][0]}" ${STROKE}/>`).join('');
    return s;
  }
  // 본 모양: 정사각형 칸 모눈. cellsList = [[열, 아래에서 몇째 줄]]
  const view = (x0, bottom, c, list, fill, stroke, cls = '', d0 = 0, step = .12) => list.map(([col, row], i) =>
    `<rect class="${cls}" ${cls ? delay(d0 + i * step) : ''} x="${x0 + col * c}" y="${bottom - (row + 1) * c}" width="${c}" height="${c}" fill="${fill}" stroke="${stroke}" stroke-width="2.5"/>`).join('');

  // 쌓기나무: 한 개를 놓고 → 다섯 개를 더 쌓아 계단 → 같은 여섯 개로 다른 모양
  (function () {
    const id = 't62-m2-ssaki';
    const G = frame(199, 314, 70, 32, 26);
    const A = [[0, 0, 0], [0, 0, 1], [0, 0, 2], [1, 0, 0], [1, 0, 1], [2, 0, 0]];
    const B = [[0, 1, 0], [0, 1, 1], [1, 1, 0], [0, 0, 0], [1, 0, 0], [2, 0, 0]];
    const tick = (x, y, vertical) => vertical
      ? `<path d="M${f(x - 8)} ${f(y - 3)} H${f(x + 8)} M${f(x - 8)} ${f(y + 3)} H${f(x + 8)}" stroke="${C.red}" stroke-width="3" stroke-linecap="round"/>`
      : `<path d="M${f(x - 3)} ${f(y - 8)} V${f(y + 8)} M${f(x + 3)} ${f(y - 8)} V${f(y + 8)}" stroke="${C.red}" stroke-width="3" stroke-linecap="round"/>`;
    const body = A.map((c, i) => {
      const F = G.faces(...c), [ax, ay] = G.at(...c), [bx, by] = G.at(...B[i]);
      const fc = [ax + G.s / 2, ay - G.s / 2];
      const ticks = i === 0 ? `<g class="h2"><g class="s1" ${delay(.8)}>${tick(fc[0], ay, false)}${tick(fc[0], ay - G.s, false)}${tick(ax, fc[1], true)}${tick(ax + G.s, fc[1], true)}</g></g>` : '';
      return `<g class="mv" style="--tx:${f(bx - ax)}px;--ty:${f(by - ay)}px;--md:${(i * .08).toFixed(2)}s">`
        + `<g class="${i === 0 ? 'dr1' : 'dr2'}" ${delay(i === 0 ? .1 : .1 + (i - 1) * .3)}>${cube(F)}`
        + `<g class="h3"><g class="p2" ${delay(.5 + i * .25)}>${text(f(fc[0]), f(fc[1] + 8), i + 1, { size: 24 })}</g></g>${ticks}</g></g>`;
    }).join('');
    put('6-2/수학/2/쌓기나무', svg(id, body, motion(id) + `
      .sc-${id} .mv { transition: transform 1.2s ease-in-out; transition-delay: var(--md); }
      .on3 .sc-${id} .mv { transform: translate(var(--tx), var(--ty)); }`));
  })();

  // 방향: 같은 쌓은 모양을 앞, 옆, 위에서 보면 다른 모양
  (function () {
    const id = 't62-m2-banghyang';
    const G = frame(60, 292, 46, 22, 17);
    const H = { '0,0': 2, '1,0': 1, '2,0': 1, '0,1': 3, '1,1': 1 };
    const list = [];
    for (const [k, h] of Object.entries(H)) { const [x, y] = k.split(',').map(Number); for (let z = 0; z < h; z++) list.push([x, y, z]); }
    const over = { front: [C.sky, 1], right: [C.mint, 1], top: [C.orange, .5] };
    const solid = order(list).map((c) => cube(G.faces(...c), WOOD, over)).join('');
    const c = 32, bottom = 262;
    const front = view(290, bottom, c, [[0, 0], [0, 1], [0, 2], [1, 0], [2, 0]], C.sky, C.blue, 'p1', .5);
    const side = view(418, bottom, c, [[0, 0], [0, 1], [1, 0], [1, 1], [1, 2]], C.mint, C.green, 'p2', .5);
    const top = view(516, bottom, c, [[0, 0], [1, 0], [2, 0], [0, 1], [1, 1]], C.peach, C.orange, 'p3', .5);
    const glow = (x, w, h, color, d) => `<rect class="gl" ${delay(d)} x="${x - 7}" y="${bottom - h - 7}" width="${w + 14}" height="${h + 14}" rx="6" fill="none" stroke="${color}" stroke-width="5"/>`;
    const body = solid
      + `<g class="s1">${arrow(112, 352, 112, 306, C.blue, 'nb', 5)}${text(84, 344, '앞', { size: 24, color: C.blue })}</g>`
      + `<g class="s2">${arrow(270, 236, 228, 236, C.green, 'nr', 5)}${text(250, 220, '옆', { size: 24, color: C.green })}</g>`
      + `<g class="s3">${arrow(118, 44, 118, 104, C.orange, 'nt', 5)}${text(90, 70, '위', { size: 24, color: C.orange })}</g>`
      + front + side + top
      + `<g class="s1" ${delay(.5)}>${text(338, 300, '앞', { size: 22, color: C.blue })}</g>`
      + `<g class="s2" ${delay(.5)}>${text(450, 300, '옆', { size: 22, color: C.green })}</g>`
      + `<g class="s3" ${delay(.5)}>${text(564, 300, '위', { size: 22, color: C.orange })}</g>`
      + glow(290, 96, 96, C.blue, .1) + glow(418, 64, 96, C.green, .8) + glow(516, 96, 64, C.orange, 1.5);
    put('6-2/수학/2/방향', svg(id, body, motion(id) + `
      .sc-${id} .ov { opacity: 0; transition: opacity .5s ease .2s; }
      .sc-${id} .ov { fill-opacity: var(--a); }
      .on1 .sc-${id} .hf, .on2 .sc-${id} .hr, .on3 .sc-${id} .ht { opacity: 1; }
      .on2 .sc-${id} .hf, .on3 .sc-${id} .hr, .on4 .sc-${id} .ht { opacity: 0; }
      .on4 .sc-${id} .hf { animation: ${id}-ov 1s ease-in-out .1s both; }
      .on4 .sc-${id} .hr { animation: ${id}-ov 1s ease-in-out .8s both; }
      .on4 .sc-${id} .ht { animation: ${id}-ov 1s ease-in-out 1.5s both; }
      @keyframes ${id}-ov { 0%, 100% { opacity: 0; } 45% { opacity: 1; } }
      .sc-${id} .gl { opacity: 0; }
      .on4 .sc-${id} .gl { animation: ${id}-gl 1s ease-in-out both; }
      @keyframes ${id}-gl { 0%, 100% { opacity: 0; } 45% { opacity: 1; } }
      .on1 .sc-${id} .nb { animation: ${id}-nb 1s ease-in-out .2s 2 both; }
      .on2 .sc-${id} .nr { animation: ${id}-nr 1s ease-in-out .2s 2 both; }
      .on3 .sc-${id} .nt { animation: ${id}-nt 1s ease-in-out .2s 2 both; }
      @keyframes ${id}-nb { 50% { transform: translateY(-8px); } }
      @keyframes ${id}-nr { 50% { transform: translateX(-8px); } }
      @keyframes ${id}-nt { 50% { transform: translateY(8px); } }`));
  })();

  // 층: 한 겹씩 쌓고 → 떼어 내어 1층·2층·3층 → 층마다 위에서 본 모양
  (function () {
    const id = 't62-m2-cheung';
    const G = frame(120, 310, 46, 22, 17);
    const layers = [
      [[0, 0], [1, 0], [2, 0], [0, 1], [1, 1]],
      [[0, 0], [0, 1], [1, 1]],
      [[0, 1]]
    ];
    const pals = [BLUE, GREEN, ORANGE], ink = [C.blue, C.green, C.orange], lift = [0, -42, -84];
    const labelY = [310 - 23 + 8, 310 - 46 - 23 + 8, 310 - 17 - 92 - 23 + 8];
    const solid = layers.map((cells, z) => {
      const cubes = order(cells.map(([x, y]) => [x, y, z])).map((c) => cube(G.faces(...c), pals[z])).join('');
      return `<g class="sep" style="--sy:${lift[z]}px"><g class="dr1" ${delay(.1 + z * .6)}>${cubes}</g>`
        + `<g class="s2" ${delay(.9 + z * .15)}>${text(78, labelY[z], `${z + 1}층`, { size: 22, color: ink[z] })}</g></g>`;
    }).join('');
    const c = 30, pc = [[0, 1], [1, 1], [2, 1], [0, 0], [1, 0], [2, 0]];
    const planBottom = [300, 210, 120];
    const plans = layers.map((cells, z) => {
      const has = new Set(cells.map(([x, y]) => `${x},${y}`));
      const grid = pc.map(([x, y]) => `<rect x="${450 + x * c}" y="${planBottom[z] - (y + 1) * c}" width="${c}" height="${c}" fill="${has.has(`${x},${y}`) ? (z === 0 ? C.sky : z === 1 ? C.mint : C.peach) : C.paper}" stroke="${has.has(`${x},${y}`) ? ink[z] : C.line}" stroke-width="2.5"/>`).join('');
      return `<g class="pl" ${delay(.2 + (2 - z) * .4)}>${text(410, planBottom[z] - 22, `${z + 1}층`, { size: 22, color: ink[z] })}${grid}${text(578, planBottom[z] - 22, `${cells.length}개`, { size: 22, color: ink[z] })}</g>`;
    }).join('');
    put('6-2/수학/2/층', svg(id, solid + plans, motion(id) + `
      .sc-${id} .sep { transition: transform .9s ease-in-out .2s; }
      .on2 .sc-${id} .sep { transform: translateY(var(--sy)); }
      .sc-${id} .pl { opacity: 0; }
      .on3 .sc-${id} .pl { animation: ${id}-pl .7s ease-out both; }
      @keyframes ${id}-pl { from { opacity: 0; transform: translateX(-70px); } to { opacity: 1; transform: none; } }`));
  })();
})(typeof window !== 'undefined' ? window : globalThis);
