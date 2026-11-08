// 수학 6-1 4단원 비와 비율: 낱말 도식
// 비교하는 양(기호 : 앞)은 주황, 기준량(기호 : 뒤)은 파랑으로 단원 내내 같은 색을 쓴다.
// 움직임은 transform·opacity·stroke-dashoffset 만 쓴다(아이패드 사파리).
(function (root) {
  'use strict';
  const { C, svg, text, put } = root.FigureKit;
  const f = (n) => +(+n).toFixed(1);
  const dl = (s, more = '') => `style="animation-delay:${s}s;transition-delay:${s}s;${more}"`;

  // 같이 쓰는 움직임(N 은 칸 번호). sN 나타나기, pN 튀어나오기, kN 깜빡이기(보이던 것), zN 커졌다 돌아오기,
  // fN 날아오기(--dx,--dy 에서 제자리로), xN 왼쪽부터 늘어나기, dN 선 그리기(class="dr dN" pathLength="100"),
  // mN 옮겨 가 머물기(--mx,--my), gN 사라지기. 한 요소에 움직임 하나만 — 겹치려면 <g> 로 감싼다.
  const motion = (id) => {
    let css = `
    .sc-${id} :is(.s1,.s2,.s3,.s4,.p1,.p2,.p3,.p4,.f1,.f2,.f3,.f4){opacity:0}
    .sc-${id} :is(.p1,.p2,.p3,.p4,.z1,.z2,.z3,.z4){transform-box:fill-box;transform-origin:center}
    .sc-${id} :is(.x1,.x2,.x3,.x4){transform-box:fill-box;transform-origin:left center;transform:scaleX(0)}
    .sc-${id} .dr{stroke-dasharray:100;stroke-dashoffset:100}
    .sc-${id} :is(.m2,.m3,.m4){transition:transform .9s ease-in-out}
    .sc-${id} :is(.g2,.g3,.g4){transition:opacity .35s linear}
    @keyframes ${id}-in{from{opacity:0}to{opacity:1}}
    @keyframes ${id}-pop{0%{opacity:0;transform:scale(0)}70%{opacity:1;transform:scale(1.15)}100%{opacity:1;transform:none}}
    @keyframes ${id}-blink{0%,50%,100%{opacity:1}25%,75%{opacity:.2}}
    @keyframes ${id}-zoom{0%,100%{transform:none}50%{transform:scale(1.18)}}
    @keyframes ${id}-fly{from{opacity:1;transform:translate(var(--dx),var(--dy))}to{opacity:1;transform:none}}`;
    for (let n = 1; n <= 4; n++) css += `
    .on${n} .sc-${id} .s${n}{animation:${id}-in .45s ease-out both}
    .on${n} .sc-${id} .p${n}{animation:${id}-pop .5s ease-out both}
    .on${n} .sc-${id} .k${n}{animation:${id}-blink 1.4s ease-in-out both}
    .on${n} .sc-${id} .z${n}{animation:${id}-zoom .7s ease-in-out 2 both}
    .on${n} .sc-${id} .f${n}{animation:${id}-fly .8s ease-in-out both}
    .on${n} .sc-${id} .x${n}{transform:none;transition:transform .5s ease-out}
    .on${n} .sc-${id} .d${n}{stroke-dashoffset:0;transition:stroke-dashoffset .8s ease-in-out}
    .on${n} .sc-${id} .m${n}{transform:translate(var(--mx,0px),var(--my,0px))}
    .on${n} .sc-${id} .g${n}{opacity:0}`;
    return css;
  };
  const T = (x, y, s, o = {}) => text(f(x), f(y), s, o);
  const O = (s) => `<tspan fill="${C.orange}">${s}</tspan>`;
  const B = (s) => `<tspan fill="${C.blue}">${s}</tspan>`;
  const FRONT = [C.peach, C.orange], BACK = [C.sky, C.blue], PLAIN = ['white', C.line];
  // 식 조각: 수는 테두리 있는 조각
  const tile = (cx, cy, label, [fill, stroke] = PLAIN, { w = 60, h = 66, size = 36 } = {}) =>
    `<rect x="${f(cx - w / 2)}" y="${f(cy - h / 2)}" width="${w}" height="${h}" rx="10" fill="${fill}" stroke="${stroke}" stroke-width="3"/>${T(cx, cy + size * 0.36, label, { size })}`;
  const colon = (cx, cy, size = 36) => T(cx, cy + size * 0.33, ':', { size, color: C.muted });
  const chip = (cx, cy, label, w, { size = 22, color = C.ink, stroke = C.line } = {}) =>
    `<rect x="${f(cx - w / 2)}" y="${f(cy - 22)}" width="${w}" height="44" rx="22" fill="white" stroke="${stroke}" stroke-width="3"/>${T(cx, cy + size * 0.36, label, { size, color })}`;
  // 분수: y 는 가로선 높이
  const frac = (x, y, n, d, { size = 32, nc = C.ink, dc = C.ink } = {}) =>
    T(x, y - 8, n, { size, color: nc }) + `<path d="M${f(x - size * 0.7)} ${y} H${f(x + size * 0.7)}" stroke="${C.ink}" stroke-width="3" stroke-linecap="round"/>` + T(x, y + size * 0.95, d, { size, color: dc });
  const frame = (x, y, w, h, color, extra = '') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="none" stroke="${color}" stroke-width="4" ${extra}/>`;

  // 비: 빨간 구슬 3개, 파란 구슬 2개 → 파란 구슬 수를 기준으로 3 : 2 → 읽는 법 넷 → '비'
  {
    const id = 't61-m4-bi';
    const bead = (x, y, fill) => `<circle cx="${x}" cy="${y}" r="20" fill="${fill}" stroke="${C.ink}" stroke-width="2"/><circle cx="${x - 7}" cy="${y - 7}" r="5" fill="white" opacity=".75"/>`;
    const reds = [190, 248, 306].map((x, i) => `<g class="p1" ${dl(.2 + .2 * i)}>${bead(x, 80, C.red)}</g>`).join('');
    const blues = [190, 248].map((x, i) => `<g class="p1" ${dl(.9 + .2 * i)}>${bead(x, 150, C.blue)}</g>`).join('');
    const body = T(40, 88, '빨간 구슬', { size: 22, anchor: 'start' }) + T(40, 158, '파란 구슬', { size: 22, anchor: 'start' })
      + reds + blues
      + `<g class="s1" ${dl(.8)}>${T(360, 89, '3개', { size: 24, anchor: 'start', color: C.red })}</g>`
      + `<g class="s1" ${dl(1.4)}>${T(360, 159, '2개', { size: 24, anchor: 'start', color: C.blue })}</g>`
      + `<g class="s2" ${dl(.1)}>${frame(160, 122, 118, 56, C.blue)}${T(430, 159, '기준', { size: 22, anchor: 'start', color: C.blue })}</g>`
      + `<g class="z4" ${dl(.2)}><g class="f2" ${dl(.6, '--dx:222px;--dy:-170px')}>${tile(150, 250, '3', FRONT)}</g>`
      + `<g class="s2" ${dl(1.3)}>${colon(200, 250)}</g>`
      + `<g class="f2" ${dl(.9, '--dx:122px;--dy:-100px')}>${tile(250, 250, '2', BACK)}</g></g>`
      + `<g class="p3" ${dl(.2)}>${chip(440, 250, `${O('3')} 대 ${B('2')}`, 140, { size: 28 })}</g>`
      + `<g class="p3" ${dl(.7)}>${chip(115, 322, `${O('3')}과 ${B('2')}의 비`, 180)}</g>`
      + `<g class="p3" ${dl(1.1)}>${chip(320, 322, `${B('2')}에 대한 ${O('3')}의 비`, 180)}</g>`
      + `<g class="p3" ${dl(1.5)}>${chip(525, 322, `${O('3')}의 ${B('2')}에 대한 비`, 180)}</g>`
      + `<g class="p4" ${dl(.6)}>${T(320, 262, '비', { size: 32, color: C.green })}</g>`;
    put('6-1/수학/4/비', svg(id, body, motion(id)));
  }

  // 기준량: 사과 4개, 귤 5개 → 귤 수에 대한 사과 수 4 : 5, 귤이 기준(뒤) → 사과 수에 대한 귤 수 5 : 4, 사과가 기준(뒤) → 뒤의 수가 기준량
  {
    const id = 't61-m4-gijun';
    const apple = (x, y) => `<circle cx="${x}" cy="${y}" r="19" fill="${C.red}"/><path d="M${x} ${y - 18} q4 -10 12 -12" stroke="${C.green}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
    const tang = (x, y) => `<circle cx="${x}" cy="${y}" r="19" fill="${C.orange}"/><circle cx="${x}" cy="${y - 15}" r="4" fill="${C.green}"/>`;
    const apples = [0, 1, 2, 3].map((i) => `<g class="p1" ${dl(.2 + .15 * i)}>${apple(140 + 52 * i, 100)}</g>`).join('');
    const tangs = [0, 1, 2, 3, 4].map((i) => `<g class="p1" ${dl(.8 + .15 * i)}>${tang(140 + 52 * i, 220)}</g>`).join('');
    const body = T(40, 108, '사과', { size: 24, anchor: 'start' }) + T(40, 228, '귤', { size: 24, anchor: 'start' })
      + apples + tangs
      + `<g class="s1" ${dl(1.6)}>${tile(470, 110, '4')}${colon(520, 110)}<g class="k2" ${dl(.6)}>${tile(570, 110, '5')}</g></g>`
      + `<g class="g3"><g class="s2" ${dl(.1)}>${frame(112, 192, 264, 56, C.blue)}${T(390, 229, '기준', { size: 22, anchor: 'start', color: C.blue })}</g></g>`
      + `<g class="s2" ${dl(.5)}>${tile(570, 110, '5', BACK)}</g>`
      + `<g class="s3" ${dl(.1)}>${frame(112, 72, 212, 56, C.blue)}${T(338, 109, '기준', { size: 22, anchor: 'start', color: C.blue })}</g>`
      + `<g class="s3" ${dl(.6)}>${tile(470, 250, '5')}${colon(520, 250)}<g class="k3" ${dl(.7)}>${tile(570, 250, '4', BACK)}</g></g>`
      + `<g class="p4" ${dl(.2)}>${T(570, 170, '기준량', { size: 22, color: C.blue })}</g>`
      + `<g class="p4" ${dl(.5)}>${T(570, 310, '기준량', { size: 22, color: C.blue })}</g>`
      + `<g class="s4" ${dl(.8)}><g class="k4" ${dl(.9)}>${frame(536, 73, 68, 74, C.blue)}${frame(536, 213, 68, 74, C.blue)}</g></g>`;
    put('6-1/수학/4/기준량', svg(id, body, motion(id)));
  }

  // 비교하는 양: 동전 20번 → 숫자 면 9번이 뒤집힘 → 9 : 20(20은 기준량) → 앞의 9가 비교하는 양
  {
    const id = 't61-m4-bigyo';
    const heads = new Set([1, 3, 4, 7, 10, 12, 15, 16, 18]);
    let coins = '';
    for (let i = 0; i < 20; i++) {
      const x = 110 + 44 * (i % 10), y = i < 10 ? 80 : 132;
      const base = `<circle cx="${x}" cy="${y}" r="17" fill="white" stroke="${C.muted}" stroke-width="3"/><circle cx="${x}" cy="${y}" r="10" fill="none" stroke="${C.line}" stroke-width="2"/>`;
      const face = heads.has(i) ? `<g class="hd" ${dl(0, `--d:${f(.2 + .12 * [...heads].indexOf(i))}s`)}><circle cx="${x}" cy="${y}" r="17" fill="${C.peach}" stroke="${C.orange}" stroke-width="3"/>${T(x, y + 7, '1', { size: 18, color: C.orange })}</g>` : '';
      coins += `<g class="p1" ${dl(.1 + .05 * i)}><g class="${heads.has(i) ? 'fl' : ''}" style="--d:${f(.2 + .12 * [...heads].indexOf(i))}s">${base}${face}</g></g>`;
    }
    const body = coins
      + `<g class="s1" ${dl(1.2)}>${T(548, 100, '20번', { size: 24, anchor: 'start', color: C.blue })}</g>`
      + `<g class="s2" ${dl(1.4)}>${T(548, 142, '9번', { size: 24, anchor: 'start', color: C.orange })}</g>`
      + `<g class="s3" ${dl(.2)}><g class="z4" ${dl(.4)}>${tile(250, 240, '9', FRONT, { w: 70, h: 72, size: 40 })}</g>${colon(320, 240, 40)}${tile(390, 240, '20', BACK, { w: 76, h: 72, size: 40 })}</g>`
      + `<g class="s3" ${dl(.8)}>${T(390, 308, '기준량', { size: 22, color: C.blue })}</g>`
      + `<g class="p4" ${dl(.4)}>${T(250, 308, '비교하는 양', { size: 22, color: C.orange })}</g>`
      + `<g class="s4" ${dl(1)}>${T(250, 192, '앞', { size: 20, color: C.muted })}${T(390, 192, '뒤', { size: 20, color: C.muted })}</g>`;
    put('6-1/수학/4/비교하는 양', svg(id, body, motion(id) + `
      .sc-${id} .fl{transform-box:fill-box;transform-origin:center}
      .sc-${id} .hd{opacity:0}
      .on2 .sc-${id} .fl{animation:${id}-flip .5s ease-in-out var(--d) both}
      .on2 .sc-${id} .hd{opacity:1;transition:opacity 0s linear calc(var(--d) + .25s)}
      @keyframes ${id}-flip{0%,100%{transform:none}50%{transform:scaleX(0)}}
      .on4 .sc-${id} .hd{animation:${id}-blink 1.4s ease-in-out .9s both}
    `));
  }

  // 비율: 15경기 중 6경기 이김 → 6 ÷ 15 = 15분의 6 = 0.4 → 15칸 띠 아래 0~1 수직선, 6칸 끝이 0.4 → '비율'
  {
    const id = 't61-m4-biyul';
    const x0 = 60, u = 30;
    let cells = '';
    for (let i = 0; i < 15; i++) {
      cells += `<g class="x1" ${dl(.1 + .04 * i)}><rect x="${x0 + u * i}" y="50" width="${u}" height="44" fill="${C.sky}" stroke="${C.blue}" stroke-width="2"/></g>`;
    }
    let won = '';
    for (let i = 0; i < 6; i++) won += `<g class="p1" ${dl(.9 + .12 * i)}><rect x="${x0 + u * i + 3}" y="53" width="${u - 6}" height="38" rx="4" fill="${C.orange}" opacity=".8"/></g>`;
    let ticks = '';
    for (let k = 0; k <= 10; k++) ticks += `<path d="M${x0 + 45 * k} ${k % 5 ? 120 : 116} V${k % 5 ? 136 : 140}" stroke="${C.ink}" stroke-width="${k % 5 ? 2 : 3}"/>`;
    const body = cells + won
      + `<g class="s1" ${dl(.8)}>${T(522, 80, '15경기', { size: 22, anchor: 'start', color: C.blue })}</g>`
      + `<g class="s1" ${dl(1.7)}>${T(150, 36, '6경기', { size: 22, color: C.orange })}</g>`
      + `<g class="g2"><g class="s1" ${dl(1.9)}>${tile(270, 240, '6', FRONT)}${colon(320, 240)}${tile(370, 240, '15', BACK, { w: 70 })}</g></g>`
      + `<g class="s2" ${dl(.3)}>${T(110, 252, '6', { size: 34, color: C.orange })}${T(165, 252, '÷', { size: 34, color: C.muted })}${T(225, 252, '15', { size: 34, color: C.blue })}`
      + `${T(110, 205, '비교하는 양', { size: 20, color: C.orange })}${T(225, 296, '기준량', { size: 20, color: C.blue })}</g>`
      + `<g class="s2" ${dl(.9)}>${T(290, 252, '=', { size: 34, color: C.muted })}${frac(345, 240, '6', '15', { size: 32, nc: C.orange, dc: C.blue })}</g>`
      + `<g class="s2" ${dl(1.5)}>${T(400, 252, '=', { size: 34, color: C.muted })}<g class="z4" ${dl(.2)}>${T(460, 252, '0.4', { size: 36, color: C.green })}</g></g>`
      + `<g class="s3" ${dl(.1)}><path d="M${x0 - 10} 128 H${x0 + 460}" stroke="${C.ink}" stroke-width="3"/>${ticks}`
      + `${T(x0, 160, '0', { size: 20 })}${T(x0 + 450, 160, '1', { size: 22, color: C.blue })}</g>`
      + `<g class="s3" ${dl(.8)}><path d="M${x0 + 180} 96 V124" stroke="${C.orange}" stroke-width="3" stroke-dasharray="5 4"/><g class="k4" ${dl(.2)}>${T(x0 + 180, 162, '0.4', { size: 22, color: C.orange })}<circle cx="${x0 + 180}" cy="128" r="7" fill="${C.orange}"/></g></g>`
      + `<g class="p4" ${dl(.6)}>${T(460, 298, '비율', { size: 26, color: C.green })}</g>`;
    put('6-1/수학/4/비율', svg(id, body, motion(id)));
  }

  // 백분율: 25칸 중 12칸(공 25번 중 12번) → 칸마다 4칸으로 나누면 100칸 중 48칸 → 48 % → '백분율'
  {
    const id = 't61-m4-baekbun';
    const x0 = 50, y0 = 50, U = 50;
    let fills = '';
    for (let i = 0; i < 12; i++) {
      const c = i % 5, r = Math.floor(i / 5);
      fills += `<g class="p1" ${dl(.6 + .1 * i)}><rect x="${x0 + U * c}" y="${y0 + U * r}" width="${U}" height="${U}" fill="${C.orange}" fill-opacity=".5"/></g>`;
    }
    let big = '', small = '';
    for (let k = 1; k < 5; k++) big += `M${x0 + U * k} ${y0} V${y0 + 250} M${x0} ${y0 + U * k} H${x0 + 250} `;
    for (let k = 0; k < 5; k++) small += `M${x0 + U * k + 25} ${y0} V${y0 + 250} M${x0} ${y0 + U * k + 25} H${x0 + 250} `;
    const body = `<rect x="${x0}" y="${y0}" width="250" height="250" fill="white"/>` + fills
      + `<path class="dr d2" pathLength="100" d="${small}" stroke="${C.muted}" stroke-width="1.5"/>`
      + `<path class="dr d1" pathLength="100" d="${big}" stroke="${C.ink}" stroke-width="2.5"/>`
      + `<rect x="${x0}" y="${y0}" width="250" height="250" fill="none" stroke="${C.ink}" stroke-width="3"/><g class="s4" ${dl(.1)}><g class="k4" ${dl(.3)}><rect x="${x0}" y="${y0}" width="250" height="250" fill="none" stroke="${C.blue}" stroke-width="5"/></g></g>`
      + `<g class="s1" ${dl(1.8)}>${frac(395, 110, '12', '25', { size: 34, nc: C.orange, dc: C.blue })}</g>`
      + `<g class="s2" ${dl(1)}>${T(455, 122, '=', { size: 34, color: C.muted })}${frac(530, 110, '48', '100', { size: 34, nc: C.orange, dc: C.blue })}</g>`
      + `<g class="s3" ${dl(.2)}>${T(390, 238, '=', { size: 40, color: C.muted, anchor: 'start' })}<g class="z4" ${dl(.4)}>${T(500, 238, '48 %', { size: 44, color: C.orange })}</g></g>`
      + `<g class="s3" ${dl(.8)}>${T(500, 276, '48 퍼센트', { size: 20, color: C.muted })}</g>`
      + `<g class="p4" ${dl(.8)}>${T(500, 330, '백분율', { size: 28, color: C.green })}</g>`;
    put('6-1/수학/4/백분율', svg(id, body, motion(id)));
  }

  // 할인율: 3000원 → 2100원 → 깎아 준 900원 → 900원 조각이 0~100 % 자로 옮겨 가 30 % → '할인율'
  {
    const id = 't61-m4-halin';
    const x0 = 130, k = 0.15; // 1원 = 0.15px, 3000원 = 450px
    const disc = `<rect x="${x0 + 2100 * k}" y="126" width="${900 * k}" height="48" fill="${C.peach}" stroke="${C.red}" stroke-width="3" stroke-dasharray="7 5"/>${T(x0 + 2550 * k, 158, '900원', { size: 22, color: C.red })}`;
    let ticks = '';
    for (let i = 0; i <= 10; i++) ticks += `<path d="M${x0 + 45 * i} 262 V${i % 5 ? 272 : 276}" stroke="${C.ink}" stroke-width="2"/>`;
    const body = T(118, 82, '원래 가격', { size: 20, anchor: 'end' }) + T(118, 158, '파는 가격', { size: 20, anchor: 'end' })
      + `<g class="x1" ${dl(.2)}><rect x="${x0}" y="50" width="450" height="48" fill="${C.sky}" stroke="${C.blue}" stroke-width="3"/></g>`
      + `<g class="s1" ${dl(.7)}>${T(x0 + 225, 83, '3000원', { size: 24, color: C.blue })}</g>`
      + `<g class="x1" ${dl(1)}><rect x="${x0}" y="126" width="${2100 * k}" height="48" fill="${C.mint}" stroke="${C.green}" stroke-width="3"/></g>`
      + `<g class="s1" ${dl(1.5)}>${T(x0 + 1050 * k, 159, '2100원', { size: 24, color: C.green })}</g>`
      + `<g class="s2" ${dl(.2)}><rect x="${x0 + 2100 * k}" y="50" width="${900 * k}" height="48" fill="none" stroke="${C.red}" stroke-width="4"/>${disc}</g>`
      + `<g class="g3"><g class="s2" ${dl(.9)}>${T(330, 328, '3000 − 2100 = 900', { size: 26 })}</g></g>`
      + `<g class="s3" ${dl(.1)}><path d="M${x0} 262 H${x0 + 450}" stroke="${C.ink}" stroke-width="3"/>${ticks}`
      + `${T(x0, 296, '0', { size: 20 })}${T(x0 + 450, 296, '100 (%)', { size: 20 })}</g>`
      + `<g class="s3" ${dl(.2)}><g class="m3" ${dl(.4, `--mx:${f(-2100 * k)}px;--my:88px`)}><g class="k4" ${dl(.6)}>${disc}</g></g></g>`
      + `<g class="s3" ${dl(1.3)}>${T(x0 + 135, 296, '30', { size: 20, color: C.red })}</g>`
      + `<g class="s3" ${dl(1.6)}>${T(330, 336, `900 ÷ 3000 = 0.3 = ${'<tspan fill="' + C.red + '">30 %</tspan>'}`, { size: 26 })}</g>`
      + `<g class="p4" ${dl(.3)}>${T(x0 + 160, 247, '할인율', { size: 26, color: C.green, anchor: 'start' })}</g>`;
    put('6-1/수학/4/할인율', svg(id, body, motion(id)));
  }

  // 득표율: 30표가 들어옴 → 건우 18표(주황), 수빈 12표(파랑) → 표를 한 줄로 이어 0~100 % 자 위에, 60 %와 40 % → '득표율'
  {
    const id = 't61-m4-deukpyo';
    let slips = '';
    for (let i = 0; i < 30; i++) {
      const c = i % 15, r = Math.floor(i / 15);
      const gx = 112 + 30 * c, gy = r ? 112 : 56, sx = 95 + 15 * i, sy = 226;
      const side = i < 18 ? 'o' : 'b';
      slips += `<g class="m3" ${dl(.1 + .03 * i, `--mx:${sx - gx}px;--my:${sy - gy}px`)}><g class="f1" ${dl(.1 + .04 * i, '--dx:0px;--dy:-60px')}>`
        + `<rect x="${gx}" y="${gy}" width="15" height="44" fill="white" stroke="${C.muted}" stroke-width="1.5"/>`
        + `<g class="s2" ${dl(.1 + .03 * i)}><rect x="${gx}" y="${gy}" width="15" height="44" fill="${side === 'o' ? C.peach : C.sky}" stroke="${side === 'o' ? C.orange : C.blue}" stroke-width="1.5"/></g></g></g>`;
    }
    let ticks = '';
    for (let i = 0; i <= 10; i++) ticks += `<path d="M${95 + 45 * i} 280 V${i % 5 ? 290 : 294}" stroke="${C.ink}" stroke-width="2"/>`;
    const body = slips
      + `<g class="g3"><g class="s1" ${dl(1.4)}>${T(578, 110, '30표', { size: 24, anchor: 'start' })}</g></g>`
      + `<g class="g3"><g class="s2" ${dl(.9)}>${T(250, 200, '건우 18표', { size: 24, color: C.orange })}${T(470, 200, '수빈 12표', { size: 24, color: C.blue })}</g></g>`
      + `<g class="s3" ${dl(1.3)}><path d="M95 280 H545" stroke="${C.ink}" stroke-width="3"/>${ticks}${T(95, 316, '0', { size: 20 })}${T(365, 316, '60', { size: 20, color: C.orange })}${T(545, 316, '100 (%)', { size: 20 })}</g>`
      + `<g class="s3" ${dl(1.6)}>${T(230, 256, '건우', { size: 22 })}${T(455, 256, '수빈', { size: 22 })}</g>`
      + `<g class="s3" ${dl(1.5)}>${T(320, 110, `18 ÷ 30 = 0.6 = ${'<tspan fill="' + C.orange + '">60 %</tspan>'}`, { size: 28 })}</g>`
      + `<g class="s3" ${dl(1.5)}><g class="k4" ${dl(.4)}>${T(230, 214, '60 %', { size: 24, color: C.orange })}${T(455, 214, '40 %', { size: 24, color: C.blue })}</g></g>`
      + `<g class="p4" ${dl(.2)}>${T(48, 256, '득표율', { size: 24, color: C.green })}</g>`;
    put('6-1/수학/4/득표율', svg(id, body, motion(id)));
  }
})(typeof window !== 'undefined' ? window : globalThis);
