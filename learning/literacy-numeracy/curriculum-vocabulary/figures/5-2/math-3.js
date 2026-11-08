// 수학 5-2 3단원 합동과 대칭: 낱말 도식
(function (root) {
  'use strict';
  const { C, svg, text, put } = root.FigureKit;
  const f = (n) => +n.toFixed(1);
  const P = (pts) => pts.map(([x, y]) => `${f(x)},${f(y)}`).join(' ');
  const delay = (s) => `style="animation-delay:${s}s"`;

  // 합동인 두 삼각형 ㄱㄴㄷ(왼쪽, 움직임)과 ㄹㅁㅂ(오른쪽, 30° 돌아가 있음)
  // 각 ㄴ = 70°, 각 ㄷ = 50°, 각 ㄱ = 60°, 변 ㄴㄷ = 170, 변 ㄱㄴ = 150.4(5 cm)
  const rad = (d) => d * Math.PI / 180;
  const sideAB = 170 * Math.sin(rad(50)) / Math.sin(rad(60));
  const local = [[sideAB * Math.cos(rad(70)), -sideAB * Math.sin(rad(70))], [0, 0], [170, 0]]; // ㄱ, ㄴ, ㄷ
  const G = [(local[0][0] + local[1][0] + local[2][0]) / 3, (local[0][1] + local[1][1] + local[2][1]) / 3];
  const TH = 30, AC = [150, 200], BC = [470, 182];
  const DX = BC[0] - AC[0], DY = BC[1] - AC[1];
  const rot = ([x, y], d) => [x * Math.cos(rad(d)) - y * Math.sin(rad(d)), x * Math.sin(rad(d)) + y * Math.cos(rad(d))];
  const off = local.map(([x, y]) => [x - G[0], y - G[1]]);
  const TA = off.map(([x, y]) => [AC[0] + x, AC[1] + y]);
  const TB = off.map((o) => { const [x, y] = rot(o, TH); return [BC[0] + x, BC[1] + y]; });
  const unit = ([x, y]) => { const l = Math.hypot(x, y); return [x / l, y / l]; };
  const PAIR = [C.red, C.blue, C.green];

  const moveCss = (id, back) => `
    .sc-${id} .mv { transform-box: view-box; transform-origin: ${AC[0]}px ${AC[1]}px; transition: transform 1.3s ease-in-out .5s; }
    .on2 .sc-${id} .mv { transform: translate(${DX}px, ${DY}px) rotate(${TH}deg); }
    .sc-${id} .cr { transform-box: fill-box; transform-origin: center; transition: transform 1.3s ease-in-out .5s; }
    .on2 .sc-${id} .cr { transform: rotate(${-TH}deg); }
    ${back ? `.on3 .sc-${id} .mv, .on3 .sc-${id} .cr { transform: none; }` : ''}
    .sc-${id} .hid2 { transition: opacity .4s ease; }
    .on2 .sc-${id} .hid2 { opacity: 0; }
    ${back ? `.on3 .sc-${id} .hid2 { opacity: 1; transition-delay: 1.6s; }` : ''}
    .on1 .sc-${id} .s1, .on2 .sc-${id} .s2, .on3 .sc-${id} .s3 { animation: ${id}-fin .4s ease-out both; }
    .sc-${id} .ring { transform-box: fill-box; transform-origin: center; opacity: 0; }
    .on3 .sc-${id} .ring { animation: ${id}-ring 1s ease-out .2s 2 both; }
    .on3 .sc-${id} .flash { animation: ${id}-flash 1.6s ease-in-out .2s both; }
    @keyframes ${id}-fin { from { opacity: 0; } to { opacity: 1; } }
    @keyframes ${id}-ring { 0% { opacity: .9; transform: scale(1); } 100% { opacity: 0; transform: scale(2.6); } }
    @keyframes ${id}-flash { 0% { opacity: 0; } 20% { opacity: 1; } 40% { opacity: .2; } 60% { opacity: 1; } 80% { opacity: .2; } 100% { opacity: 1; } }
  `;
  const tri = (pts, fill, stroke, extra = '') => `<polygon points="${P(pts)}" fill="${fill}" stroke="${stroke}" stroke-width="3" stroke-linejoin="round" ${extra}/>`;
  // 꼭짓점 이름: 무게중심에서 바깥쪽으로, 짝끼리 겹치지 않게 ±spread 만큼 비켜 둔다
  function vlabel(pts, i, name, spread, moving) {
    const center = [(pts[0][0] + pts[1][0] + pts[2][0]) / 3, (pts[0][1] + pts[1][1] + pts[2][1]) / 3];
    const dir = rot(unit([pts[i][0] - center[0], pts[i][1] - center[1]]), spread);
    const x = pts[i][0] + dir[0] * 34, y = pts[i][1] + dir[1] * 34 + 11;
    const t = text(f(x), f(y), name, { size: 31 });
    return moving ? `<g class="cr">${t}</g>` : t;
  }
  const namesA = ['ㄱ', 'ㄴ', 'ㄷ'], namesB = ['ㄹ', 'ㅁ', 'ㅂ'];
  const labelsA = (moving = true) => namesA.map((n, i) => vlabel(TA, i, n, -28, moving)).join('');
  const labelsB = () => namesB.map((n, i) => vlabel(TB, i, n, 28, false)).join('');

  // 합동: 밀고 돌려서는 안 겹치고, 뒤집어야 겹치는 두 삼각형.
  // 꼭짓점이 한쪽으로 크게 치우친 삼각형이라야 뒤집기 전후가 한눈에 다르다(위의 60°·70°·50° 삼각형은 거의 정삼각형이라 쓰지 않는다).
  (function () {
    const id = 'm3-hapdong';
    const O = [-110, 0], Rt = [110, 0], Top = [-65, -125];       // 밑변 가운데를 기준으로 한 자리
    const HA = [170, 255], HB = [450, 232], HT = 20;               // 왼쪽 삼각형 자리, 오른쪽 삼각형 자리, 돌린 각
    const hdx = HB[0] - HA[0], hdy = HB[1] - HA[1];
    const A = [O, Rt, Top].map(([x, y]) => [HA[0] + x, HA[1] + y]);
    const B = [O, Rt, Top].map(([x, y]) => { const [u, v] = rot([-x, y], HT); return [HB[0] + u, HB[1] + v]; });
    const wrongTop = (() => { const [u, v] = rot(Top, HT); return [HB[0] + u, HB[1] + v]; })();
    const move = (s) => `translate(${f(hdx)}px, ${f(hdy)}px) rotate(${s === 0 ? 0 : HT}deg) scale(${s < 0 ? -1 : 1}, 1)`;
    const css = `
      .sc-${id} .mv { transform-box: view-box; transform-origin: ${HA[0]}px ${HA[1]}px; transform: translate(0px, 0px) rotate(0deg) scale(1, 1); transition: transform 1.4s ease-in-out .4s; }
      .on2 .sc-${id} .mv { transform: ${move(1)}; }
      .on3 .sc-${id} .mv { transform: ${move(-1)}; transition-duration: 1.2s; }
      .on4 .sc-${id} .mv { animation: ${id}-replay 3.4s ease-in-out .3s both; }
      @keyframes ${id}-replay {
        0% { transform: translate(0px, 0px) rotate(0deg) scale(1, 1); }
        28%, 36% { transform: translate(${f(hdx)}px, ${f(hdy)}px) rotate(0deg) scale(1, 1); }
        60%, 68% { transform: ${move(1)}; }
        92%, 100% { transform: ${move(-1)}; }
      }
      .sc-${id} .miss { transform-box: fill-box; transform-origin: center; }
      .on2 .sc-${id} .miss { animation: ${id}-miss .5s ease-out 1.9s both; }
      @keyframes ${id}-miss { from { opacity: 0; transform: scale(2.2); } to { opacity: 1; transform: scale(1); } }
      .sc-${id} .flip { opacity: 0; }
      .on3 .sc-${id} .flip { animation: ${id}-flip 1.6s ease-in-out .1s both; }
      @keyframes ${id}-flip { 0% { opacity: 0; } 20%, 70% { opacity: 1; } 100% { opacity: 0; } }
      .on3 .sc-${id} .flash { animation: ${id}-flash 1.6s ease-in-out 1.7s both; }
      @keyframes ${id}-flash { 0% { opacity: 0; } 20% { opacity: 1; } 40% { opacity: .2; } 60% { opacity: 1; } 80% { opacity: .2; } 100% { opacity: 1; } }
      .on4 .sc-${id} .lb { animation: ${id}-lb .4s ease-out both; }
      @keyframes ${id}-lb { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
    `;
    const ring = ([x, y]) => `<circle class="miss" cx="${f(x)}" cy="${f(y)}" r="20" fill="none" stroke="${C.red}" stroke-width="4" stroke-dasharray="7 5"/>`;
    // 뒤집기 화살표: 오른쪽 삼각형 위에서 좌우로 넘어가는 굽은 화살표
    const cx = HB[0], cy = 62;
    const flip = `<g class="flip"><g transform="rotate(${HT} ${cx} ${HB[1]})"><path d="M${cx - 70} ${cy + 26} Q${cx} ${cy - 26} ${cx + 70} ${cy + 26}" fill="none" stroke="${C.purple}" stroke-width="4" stroke-linecap="round"/>`
      + `<path d="M${cx - 70} ${cy + 26} l4 -17 M${cx - 70} ${cy + 26} l17 -3 M${cx + 70} ${cy + 26} l-4 -17 M${cx + 70} ${cy + 26} l-17 -3" stroke="${C.purple}" stroke-width="4" stroke-linecap="round"/></g></g>`;
    const labels = ['밀기', '돌리기', '뒤집기'].map((name, i) => `<g class="lb" ${delay([0.3, 1.4, 2.5][i])}>${text(110 + i * 110, 44, name, { size: 24, color: [C.blue, C.green, C.purple][i] })}</g>`).join('');
    const body = `<g class="b2"><polygon points="${P(A)}" fill="none" stroke="${C.line}" stroke-width="3" stroke-dasharray="8 6"/></g>` + tri(B, C.peach, C.orange)
      + `<g class="mv">${tri(A, C.sky, C.blue, 'fill-opacity=".8"')}</g>`
      + `<g class="b2 h3">${ring(wrongTop)}${ring(B[2])}</g>`
      + `<g class="b3 h4">${flip}<polygon class="flash" points="${P(B)}" fill="none" stroke="${C.green}" stroke-width="7" stroke-linejoin="round"/></g>`
      + `<g class="b4">${labels}</g>`;
    put('5-2/수학/3/합동', svg(id, body, css));
  })();

  // 대응점
  (function () {
    const id = 'm3-eungjeom';
    const dots = (pts) => pts.map((p, i) => `<circle cx="${f(p[0])}" cy="${f(p[1])}" r="9" fill="${PAIR[i]}" stroke="white" stroke-width="2"/>`).join('');
    const body = tri(TB, C.peach, C.orange) + `<g class="b2">${dots(TB)}</g>` + labelsB()
      + `<g class="mv">${tri(TA, C.sky, C.blue, 'fill-opacity=".8"')}<g class="b2">${dots(TA)}</g>${labelsA()}</g>`
      + `<g class="b3">${TB.map((p, i) => `<circle class="ring" cx="${f(p[0])}" cy="${f(p[1])}" r="10" fill="none" stroke="${PAIR[i]}" stroke-width="4"/>`).join('')}</g>`;
    put('5-2/수학/3/대응점', svg(id, body, moveCss(id, false)));
  })();

  // 대응변
  (function () {
    const id = 'm3-byeon';
    const edge = (pts, i, j, color) => `<path d="M${f(pts[i][0])} ${f(pts[i][1])} L${f(pts[j][0])} ${f(pts[j][1])}" stroke="${color}" stroke-width="8" stroke-linecap="round"/>`;
    const lenLabel = (pts) => {
      const c = [(pts[0][0] + pts[1][0] + pts[2][0]) / 3, (pts[0][1] + pts[1][1] + pts[2][1]) / 3];
      const m = [(pts[0][0] + pts[1][0]) / 2, (pts[0][1] + pts[1][1]) / 2];
      const n = unit([m[0] - c[0], m[1] - c[1]]);
      return text(f(m[0] + n[0] * 36), f(m[1] + n[1] * 36 + 6), '5 cm', { size: 18, color: C.red });
    };
    const others = (pts) => `<g class="b3"><g class="s3" ${delay(1.9)}>${edge(pts, 1, 2, C.purple)}${edge(pts, 2, 0, C.green)}</g></g>`;
    const body = tri(TB, C.peach, C.orange) + edge(TB, 0, 1, C.red) + others(TB) + labelsB() + lenLabel(TB)
      + `<g class="mv">${tri(TA, C.sky, C.blue, 'fill-opacity=".8"')}${edge(TA, 0, 1, C.red)}${others(TA)}${labelsA()}<g class="cr hid2">${lenLabel(TA)}</g></g>`;
    put('5-2/수학/3/대응변', svg(id, body, moveCss(id, true)));
  })();

  // 대응각
  (function () {
    const id = 'm3-gak';
    const deg = ['60°', '70°', '50°'];
    const wedge = (pts, i, color, r = 32) => {
      const a = unit([pts[(i + 1) % 3][0] - pts[i][0], pts[(i + 1) % 3][1] - pts[i][1]]);
      const b = unit([pts[(i + 2) % 3][0] - pts[i][0], pts[(i + 2) % 3][1] - pts[i][1]]);
      const [x, y] = pts[i];
      const sweep = (a[0] * b[1] - a[1] * b[0]) > 0 ? 1 : 0;
      return `<path d="M${f(x)} ${f(y)} L${f(x + a[0] * r)} ${f(y + a[1] * r)} A${r} ${r} 0 0 ${sweep} ${f(x + b[0] * r)} ${f(y + b[1] * r)} Z" fill="${color}" fill-opacity=".75" stroke="${color}" stroke-width="2"/>`;
    };
    const degLabel = (pts, i) => {
      const a = unit([pts[(i + 1) % 3][0] - pts[i][0], pts[(i + 1) % 3][1] - pts[i][1]]);
      const b = unit([pts[(i + 2) % 3][0] - pts[i][0], pts[(i + 2) % 3][1] - pts[i][1]]);
      const m = unit([a[0] + b[0], a[1] + b[1]]);
      return text(f(pts[i][0] + m[0] * 60), f(pts[i][1] + m[1] * 60 + 6), deg[i], { size: 18 });
    };
    const others = (pts) => `<g class="b3"><g class="s3" ${delay(1.9)}>${wedge(pts, 0, C.purple)}${wedge(pts, 2, C.green)}</g></g>`;
    const body = tri(TB, C.peach, C.orange) + wedge(TB, 1, C.red) + others(TB) + labelsB() + degLabel(TB, 1)
      + `<g class="mv">${tri(TA, C.sky, C.blue, 'fill-opacity=".8"')}${wedge(TA, 1, C.red)}${others(TA)}${labelsA()}<g class="cr hid2">${degLabel(TA, 1)}</g></g>`;
    put('5-2/수학/3/대응각', svg(id, body, moveCss(id, true)));
  })();

  // 접기·돌리기 공통
  const foldCss = (id) => `
    .on1 .sc-${id} .s1, .on2 .sc-${id} .s2, .on3 .sc-${id} .s3 { animation: ${id}-fin .4s ease-out both; }
    .on3 .sc-${id} .flash { animation: ${id}-flash 1.6s ease-in-out .9s both; }
    .sc-${id} .ring { transform-box: fill-box; transform-origin: center; opacity: 0; }
    .on3 .sc-${id} .ring { animation: ${id}-ring 1s ease-out .2s 2 both; }
    @keyframes ${id}-fin { from { opacity: 0; } to { opacity: 1; } }
    @keyframes ${id}-flash { 0% { opacity: 0; } 20% { opacity: 1; } 40% { opacity: .2; } 60% { opacity: 1; } 80% { opacity: .2; } 100% { opacity: 1; } }
    @keyframes ${id}-ring { 0% { opacity: .9; transform: scale(1); } 100% { opacity: 0; transform: scale(3); } }
  `;
  const dash = (x1, y1, x2, y2, color = C.green, cls = '') => `<path class="${cls}" d="M${f(x1)} ${f(y1)} L${f(x2)} ${f(y2)}" stroke="${color}" stroke-width="3.5" stroke-dasharray="10 7"/>`;

  // 선대칭도형: 하트를 세로 점선으로 접는다
  (function () {
    const id = 'm3-seon';
    const half = 'M320 305 C270 262 170 212 170 145 C170 98 210 72 252 75 C288 78 312 102 320 125 Z';
    const mirror = half.replace(/(\d+(?:\.\d+)?) (\d+(?:\.\d+)?)/g, (_, x, y) => `${640 - x} ${y}`);
    const open = (d) => d.replace(' Z', '');
    const body = `<path d="${half}" fill="${C.peach}"/><path d="${open(half)}" fill="none" stroke="${C.orange}" stroke-width="3.5" stroke-linejoin="round"/>`
      + `<g class="fold"><path class="flap" d="${mirror}" fill="${C.peach}"/><path d="${open(mirror)}" fill="none" stroke="${C.orange}" stroke-width="3.5" stroke-linejoin="round"/></g>`
      + dash(320, 48, 320, 332)
      + `<g class="b3"><path class="flash" d="${open(half)}" fill="none" stroke="${C.green}" stroke-width="6" stroke-linejoin="round"/></g>`;
    put('5-2/수학/3/선대칭도형', svg(id, body, foldCss(id) + `
      .sc-${id} .fold { transform-box: view-box; transform-origin: 320px 0; transition: transform 1.5s ease-in-out .3s; }
      .on2 .sc-${id} .fold { transform: scaleX(-1); }
      .sc-${id} .flap { transition: fill .6s ease 1.1s, fill-opacity .6s ease 1.1s; }
      .on2 .sc-${id} .flap { fill: ${C.orange}; fill-opacity: .45; }`));
  })();

  // 대칭축: 정사각형은 네 번, 직사각형은 두 번만 겹친다
  (function () {
    const id = 'm3-chuk';
    const sq = { x: 100, y: 90, s: 180 }, cx = 190, cy = 180;
    const R = { x: 360, y: 115, w: 220, h: 130 }, rx = 470, ry = 180;
    const flap = (cls, pts) => `<g class="${cls}"><polygon points="${P(pts)}" fill="${C.orange}" fill-opacity=".55" stroke="${C.orange}" stroke-width="3" stroke-linejoin="round"/></g>`;
    const al = Math.atan2(R.h, R.w) * 180 / Math.PI;
    const body = `<g class="sqw"><rect x="${sq.x}" y="${sq.y}" width="${sq.s}" height="${sq.s}" fill="${C.peach}" stroke="${C.orange}" stroke-width="3.5"/>`
      + `<g class="b1">${dash(cx, sq.y - 26, cx, sq.y + sq.s + 26, C.green, 's1')}<g class="s1" ${delay(1.2)}>${dash(sq.x - 26, cy, sq.x + sq.s + 26, cy)}</g></g>`
      + `<g class="b2">${dash(sq.x - 18, sq.y - 18, sq.x + sq.s + 18, sq.y + sq.s + 18, C.green, 's2')}<g class="s2" ${delay(1.2)}>${dash(sq.x + sq.s + 18, sq.y - 18, sq.x - 18, sq.y + sq.s + 18)}</g></g>`
      + flap('fv', [[cx, sq.y], [sq.x + sq.s, sq.y], [sq.x + sq.s, sq.y + sq.s], [cx, sq.y + sq.s]])
      + flap('fh', [[sq.x, cy], [sq.x + sq.s, cy], [sq.x + sq.s, sq.y + sq.s], [sq.x, sq.y + sq.s]])
      + flap('fd1', [[sq.x, sq.y], [sq.x + sq.s, sq.y], [sq.x + sq.s, sq.y + sq.s]])
      + flap('fd2', [[sq.x, sq.y], [sq.x + sq.s, sq.y], [sq.x, sq.y + sq.s]]) + `</g>`
      + `<g class="b3"><g class="s3" ${delay(.8)}><rect x="${R.x}" y="${R.y}" width="${R.w}" height="${R.h}" fill="${C.sky}" stroke="${C.blue}" stroke-width="3.5"/>`
      + `<g class="dg">${dash(R.x, R.y, R.x + R.w, R.y + R.h, C.red)}</g>`
      + flap('fr', [[R.x, R.y], [R.x + R.w, R.y], [R.x + R.w, R.y + R.h]])
      + `<g class="ax">${dash(rx, R.y - 22, rx, R.y + R.h + 22)}${dash(R.x - 22, ry, R.x + R.w + 22, ry)}</g></g></g>`;
    const k = (name, a, b) => `@keyframes ${id}-${name} { 0% { opacity: 0; transform: ${a}; } 8% { opacity: 1; } 50% { transform: ${b}; } 92% { opacity: 1; transform: ${a}; } 100% { opacity: 0; transform: ${a}; } }`;
    put('5-2/수학/3/대칭축', svg(id, body, foldCss(id) + `
      .sc-${id} :is(.fv, .fh, .fd1, .fd2) { transform-box: view-box; transform-origin: ${cx}px ${cy}px; opacity: 0; }
      .sc-${id} .fr { transform-box: view-box; transform-origin: ${rx}px ${ry}px; opacity: 0; }
      .on1 .sc-${id} .fv { animation: ${id}-v 1.1s ease-in-out .1s both; }
      .on1 .sc-${id} .fh { animation: ${id}-h 1.1s ease-in-out 1.3s both; }
      .on2 .sc-${id} .fd1 { animation: ${id}-d1 1.1s ease-in-out .1s both; }
      .on2 .sc-${id} .fd2 { animation: ${id}-d2 1.1s ease-in-out 1.3s both; }
      .on3 .sc-${id} .fr { animation: ${id}-r 2s ease-in-out 1.1s both; }
      .sc-${id} .sqw { transform: translateX(${320 - cx}px); transition: transform 1s ease-in-out; }
      .on3 .sc-${id} .sqw { transform: none; }
      .sc-${id} .dg { opacity: 0; }
      .on3 .sc-${id} .dg { animation: ${id}-dg 2.3s ease .9s both; }
      .sc-${id} .ax { opacity: 0; transition: opacity .5s ease; }
      .on3 .sc-${id} .ax { opacity: 1; transition-delay: 3.1s; }
      ${k('v', 'scaleX(1)', 'scaleX(-1)')}
      ${k('h', 'scaleY(1)', 'scaleY(-1)')}
      ${k('d1', 'rotate(45deg) scaleY(1) rotate(-45deg)', 'rotate(45deg) scaleY(-1) rotate(-45deg)')}
      ${k('d2', 'rotate(-45deg) scaleY(1) rotate(45deg)', 'rotate(-45deg) scaleY(-1) rotate(45deg)')}
      @keyframes ${id}-r { 0% { opacity: 0; transform: rotate(${f(al)}deg) scaleY(1) rotate(${f(-al)}deg); } 6% { opacity: 1; } 35% { transform: rotate(${f(al)}deg) scaleY(-1) rotate(${f(-al)}deg); } 70% { transform: rotate(${f(al)}deg) scaleY(-1) rotate(${f(-al)}deg); } 94% { opacity: 1; } 100% { opacity: 0; transform: rotate(${f(al)}deg) scaleY(1) rotate(${f(-al)}deg); } }
      @keyframes ${id}-dg { 0% { opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { opacity: 0; } }`));
  })();

  // 평행사변형(점대칭): 가운데 O, 꼭짓점 넷
  const para = (ox, oy, k = 1) => [[-115, 50], [65, 50], [115, -50], [-65, -50]].map(([x, y]) => [ox + x * k, oy + y * k]);

  // 점대칭도형: 핀을 꽂고 반 바퀴
  (function () {
    const id = 'm3-jeom', O = [200, 205], Q = para(...O);
    const pin = `<circle cx="${O[0]}" cy="${O[1]}" r="9" fill="${C.ink}"/><circle cx="${O[0]}" cy="${O[1]}" r="3.5" fill="white"/>`;
    const r = 140, aEnd = [O[0] + r, O[1]];
    const S = para(505, 215, 0.75), cxs = 505;
    const leftHalf = [S[0], [cxs, S[0][1]], [cxs, S[3][1]], S[3]];
    const rightHalf = [[cxs, S[0][1]], S[1], S[2], [cxs, S[3][1]]];
    const body = `<polygon points="${P(Q)}" fill="none" stroke="${C.muted}" stroke-width="3" stroke-dasharray="7 6"/>`
      + `<g class="rot"><polygon points="${P(Q)}" fill="${C.sky}" fill-opacity=".85" stroke="${C.blue}" stroke-width="3.5" stroke-linejoin="round"/>`
      + `<path d="M${P([Q[0]])} L${P([Q[2]])} M${P([Q[1]])} L${P([Q[3]])}" stroke="${C.blue}" stroke-width="2" stroke-dasharray="6 6" opacity=".7"/>`
      + `<circle cx="${Q[0][0]}" cy="${Q[0][1]}" r="9" fill="${C.red}" stroke="white" stroke-width="2"/></g>`
      + `<g class="b3"><polygon class="flash" points="${P(Q)}" fill="none" stroke="${C.green}" stroke-width="6" stroke-linejoin="round"/></g>`
      + pin
      + `<g class="b2"><path class="arc" pathLength="1" d="M${O[0] - r} ${O[1]} A${r} ${r} 0 0 1 ${aEnd[0]} ${aEnd[1]}" stroke="${C.orange}" stroke-width="5" fill="none" stroke-linecap="round"/>`
      + `<path class="tip" d="M${aEnd[0] - 11} ${aEnd[1] - 10} L${aEnd[0]} ${aEnd[1] + 8} L${aEnd[0] + 11} ${aEnd[1] - 10} Z" fill="${C.orange}" stroke="${C.orange}" stroke-width="3" stroke-linejoin="round"/>`
      + `</g>`
      + `<g class="b3"><g class="s3" ${delay(1.2)}><polygon points="${P(leftHalf)}" fill="${C.sky}" stroke="${C.blue}" stroke-width="3" stroke-linejoin="round"/>`
      + `<polygon points="${P(rightHalf)}" fill="none" stroke="${C.muted}" stroke-width="2" stroke-dasharray="5 5"/>`
      + `<g class="sfold"><polygon points="${P(rightHalf)}" fill="${C.orange}" fill-opacity=".55" stroke="${C.orange}" stroke-width="3" stroke-linejoin="round"/></g>`
      + dash(cxs, S[3][1] - 22, cxs, S[0][1] + 22)
      + `<path d="M${cxs - 11} 112 l22 22 M${cxs + 11} 112 l-22 22" stroke="${C.red}" stroke-width="5" stroke-linecap="round"/></g></g>`;
    put('5-2/수학/3/점대칭도형', svg(id, body, foldCss(id) + `
      .sc-${id} .rot { transform-box: view-box; transform-origin: ${O[0]}px ${O[1]}px; transition: transform 1.6s ease-in-out .5s; }
      .on2 .sc-${id} .rot { transform: rotate(180deg); }
      .sc-${id} .arc { stroke-dasharray: 1; stroke-dashoffset: 1; transition: stroke-dashoffset 1.6s ease-in-out .5s; }
      .on2 .sc-${id} .arc { stroke-dashoffset: 0; }
      .sc-${id} .tip { opacity: 0; transition: opacity .3s ease 2s; }
      .on2 .sc-${id} .tip { opacity: 1; }
      .on3 .sc-${id} .flash { animation-delay: .2s; }
      .sc-${id} .sfold { transform-box: view-box; transform-origin: ${cxs}px 0; transition: transform 1s ease-in-out 1.5s; }
      .on3 .sc-${id} .sfold { transform: scaleX(-1); }`));
  })();

  // 대칭의 중심: 대각선이 만나는 점
  (function () {
    const id = 'm3-jungsim', O = [320, 182], Q = para(...O, 1.3);
    const Pa = [O[0] - 70, Q[0][1]], Pb = [2 * O[0] - Pa[0], 2 * O[1] - Pa[1]];
    const u = unit([Pb[0] - Pa[0], Pb[1] - Pa[1]]), nrm = [-u[1], u[0]];
    const tick = (m) => [-4, 4].map((s) => {
      const c = [m[0] + u[0] * s, m[1] + u[1] * s];
      return `M${f(c[0] - nrm[0] * 9)} ${f(c[1] - nrm[1] * 9)} L${f(c[0] + nrm[0] * 9)} ${f(c[1] + nrm[1] * 9)}`;
    }).join(' ');
    const m1 = [(Pa[0] + O[0]) / 2, (Pa[1] + O[1]) / 2], m2 = [(Pb[0] + O[0]) / 2, (Pb[1] + O[1]) / 2];
    const body = `<polygon points="${P(Q)}" fill="none" stroke="${C.muted}" stroke-width="3" stroke-dasharray="7 6"/>`
      + `<g class="rot"><polygon points="${P(Q)}" fill="${C.sky}" stroke="${C.blue}" stroke-width="3.5" stroke-linejoin="round"/>`
      + `<g class="b1"><path d="M${P([Q[0]])} L${P([Q[2]])} M${P([Q[1]])} L${P([Q[3]])}" stroke="${C.blue}" stroke-width="3" stroke-dasharray="12 8" fill="none"/></g>`
      + `<g class="b2"><path class="seg" pathLength="1" d="M${f(Pa[0])} ${f(Pa[1])} L${f(Pb[0])} ${f(Pb[1])}" stroke="${C.orange}" stroke-width="5" fill="none"/>`
      + `<g class="s2" ${delay(1.1)}><path d="${tick(m1)} ${tick(m2)}" stroke="${C.ink}" stroke-width="3" stroke-linecap="round"/></g>`
      + `<circle cx="${f(Pa[0])}" cy="${f(Pa[1])}" r="9" fill="${C.red}" stroke="white" stroke-width="2"/><circle cx="${f(Pb[0])}" cy="${f(Pb[1])}" r="9" fill="${C.purple}" stroke="white" stroke-width="2"/></g></g>`
      + `<g class="b1"><circle cx="${O[0]}" cy="${O[1]}" r="10" fill="${C.ink}"/></g>`
      + `<g class="b3"><circle class="ring" cx="${O[0]}" cy="${O[1]}" r="11" fill="none" stroke="${C.ink}" stroke-width="4"/></g>`;
    put('5-2/수학/3/대칭의 중심', svg(id, body, foldCss(id) + `
      .sc-${id} .seg { stroke-dasharray: 1; stroke-dashoffset: 1; transition: stroke-dashoffset .9s ease-in-out .2s; }
      .on2 .sc-${id} .seg { stroke-dashoffset: 0; }
      .sc-${id} .rot { transform-box: view-box; transform-origin: ${O[0]}px ${O[1]}px; transition: transform 1.6s ease-in-out .6s; }
      .on3 .sc-${id} .rot { transform: rotate(180deg); }`));
  })();
})(typeof window !== 'undefined' ? window : globalThis);
