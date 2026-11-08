// 수학 6-2 4단원 비례식과 비례배분: 낱말 도식
// 비는 두 양을 같은 크기 칸으로 된 막대로 견주고, 식의 수는 식 조각(타일)에 색을 칠해 가리킨다.
(function (root) {
  'use strict';
  const { C, svg, text, put } = root.FigureKit;
  const f = (n) => +(+n).toFixed(1);
  const px = (n) => `${f(n)}px`;

  // 식 조각: 수는 테두리 있는 조각, 기호(:, =, ÷)는 글자만
  const tile = (cx, cy, label, { w = 56, h = 64, size = 36, cls = '' } = {}) =>
    `<g class="tl ${cls}"><rect class="bg" x="${f(cx - w / 2)}" y="${f(cy - h / 2)}" width="${w}" height="${h}" rx="10" fill="white" stroke="${C.line}" stroke-width="3"/>${text(f(cx), f(cy + size * 0.36), label, { size })}</g>`;
  const sym = (cx, cy, label, size = 36, cls = '') => `<g class="${cls}">${text(f(cx), f(cy + size * 0.33), label, { size, color: C.muted })}</g>`;
  // 분수: y 는 가로선 높이
  const frac = (x, y, n, d, { size = 30, color = C.ink } = {}) =>
    text(x, f(y - 8), n, { size, color }) + `<path d="M${f(x - size * 0.5)} ${y} H${f(x + size * 0.5)}" stroke="${color}" stroke-width="3" stroke-linecap="round"/>` + text(x, f(y + size * 0.95), d, { size, color });
  const paint = (id, sel, [fill, stroke], n, delay = 0) =>
    `.on${n} .sc-${id} ${sel} .bg{fill:${fill};stroke:${stroke};transition:fill .4s ease ${delay}s,stroke .4s ease ${delay}s}`;
  const FRONT = [C.peach, C.orange], BACK = [C.sky, C.blue], OUTER = [C.lilac, C.purple], INNER = [C.mint, C.green];
  // 칸 막대: x0 부터 n 칸
  const blocks = (x0, y, n, u, h, [fill, stroke], cls, d0 = 0, step = 0.18) => {
    let s = '';
    for (let i = 0; i < n; i++) s += `<g class="${cls}" style="--d:${f(d0 + step * i)}s"><rect x="${x0 + u * i + 2}" y="${y}" width="${u - 4}" height="${h}" rx="6" fill="${fill}" stroke="${stroke}" stroke-width="3"/></g>`;
    return s;
  };

  // 비: 주스 2칸, 물 3칸 → 같은 칸으로 세고 물을 기준으로 → 2 : 3
  {
    const id = 't62-m4-bi';
    const u = 72, x0 = 130;
    const counts = (y, n, d0) => Array.from({ length: n }, (_, i) => `<g class="ct" style="--d:${f(d0 + 0.3 * i)}s">${text(x0 + u * i + u / 2, y, i + 1, { size: 22, color: C.ink })}</g>`).join('');
    const body = text(112, 132, '주스', { size: 24, anchor: 'end' }) + text(112, 212, '물', { size: 24, anchor: 'end' })
      + blocks(x0, 100, 2, u, 48, FRONT, 'blk', 0.2) + blocks(x0, 180, 3, u, 48, BACK, 'blk', 0.7)
      + `<g class="b1">${text(x0 + 2 * u + 16, 132, '2컵', { size: 24, anchor: 'start', color: C.orange })}${text(x0 + 3 * u + 16, 212, '3컵', { size: 24, anchor: 'start', color: C.blue })}</g>`
      + `<g class="b2"><path d="M${x0 + u} 90 V238 M${x0 + 2 * u} 90 V238" stroke="${C.muted}" stroke-width="2.5" stroke-dasharray="6 6"/>`
      + `<g class="frame"><rect x="${x0 - 7}" y="173" width="${3 * u + 14}" height="62" rx="10" fill="none" stroke="${C.blue}" stroke-width="4"/>${text(470, 213, '기준', { size: 24, color: C.blue })}</g>`
      + counts(132, 2, 0.2) + counts(212, 3, 0.2) + '</g>'
      + `<g class="b3"><g class="fly" style="--dx:${px(x0 + 2 * u + 34 - 270)};--dy:${px(124 - 300)}">${tile(270, 300, '2', { size: 40, w: 60, h: 70, cls: 'ta' })}</g>`
      + `<g class="pop">${sym(320, 300, ':', 40)}</g>`
      + `<g class="fly" style="--dx:${px(x0 + 3 * u + 34 - 370)};--dy:${px(204 - 300)}">${tile(370, 300, '3', { size: 40, w: 60, h: 70, cls: 'tb' })}</g></g>`;
    put('6-2/수학/4/비', svg(id, body, `
      .sc-${id} .blk{transform-box:fill-box;transform-origin:left center;transform:scaleX(0)}
      .on1 .sc-${id} .blk{transform:none;transition:transform .35s ease-out var(--d)}
      .sc-${id} .ct{opacity:0}
      .on2 .sc-${id} .ct{opacity:1;transition:opacity .25s ease calc(var(--d) + .3s)}
      .sc-${id} .frame{opacity:0}
      .on2 .sc-${id} .frame{opacity:1;transition:opacity .4s ease 1.4s}
      .sc-${id} .fly{transform:translate(var(--dx),var(--dy));transition:transform .8s ease .2s}
      .on3 .sc-${id} .fly{transform:none}
      .sc-${id} .pop{opacity:0}
      .on3 .sc-${id} .pop{opacity:1;transition:opacity .3s ease 1s}
      ${paint(id, '.ta', FRONT, 3, 1)}${paint(id, '.tb', BACK, 3, 1)}
    `));
  }

  // 비율: 2 : 5 → 기준 5칸 막대 위에 2칸 막대를 포갬 → 2 ÷ 5 = 5분의 2 = 0.4
  {
    const id = 't62-m4-biyul';
    const u = 56, x0 = 110;
    const body = tile(110, 62, '2', { size: 34, w: 50, h: 56, cls: 'ta' }) + sym(150, 62, ':', 34) + tile(190, 62, '5', { size: 34, w: 50, h: 56, cls: 'tb' })
      + blocks(x0, 130, 5, u, 46, BACK, 'blk', 0.3, 0.12)
      + `<g class="b1"><g class="frame">${text(x0 + 5 * u + 16, 161, '기준', { size: 22, anchor: 'start', color: C.blue })}</g></g>`
      + `<g class="mv">${blocks(x0, 220, 2, u, 46, FRONT, 'blk', 1.0, 0.12)}</g>`
      + `<g class="b2"><g class="out"><rect x="${x0 - 4}" y="124" width="${2 * u + 8}" height="58" rx="9" fill="none" stroke="${C.orange}" stroke-width="4"/></g>`
      + `<g class="eq1">${text(540, 110, '2 ÷ 5', { size: 32 })}</g><g class="eq2">${text(492, 194, '=', { size: 32, color: C.muted })}${frac(545, 184, 2, 5, { size: 32 })}</g></g>`
      + `<g class="b3"><g class="eq3">${text(540, 292, '= 0.4', { size: 32 })}</g><g class="tag">${text(540, 336, '비율', { size: 24, color: C.green })}</g></g>`;
    put('6-2/수학/4/비율', svg(id, body, `
      .sc-${id} .blk{transform-box:fill-box;transform-origin:left center;transform:scaleX(0)}
      .on1 .sc-${id} .blk{transform:none;transition:transform .3s ease-out var(--d)}
      ${paint(id, '.tb', BACK, 1, .1)}
      .on2 .sc-${id} .mv{transform:translateY(-90px);transition:transform .8s ease .2s}
      ${paint(id, '.ta', FRONT, 2, .2)}
      .sc-${id} .out{opacity:0}
      .on2 .sc-${id} .out{opacity:1;transition:opacity .3s ease 1s}
      .sc-${id} .eq1,.sc-${id} .eq2,.sc-${id} .eq3,.sc-${id} .tag{opacity:0;transform:translateY(10px)}
      .on2 .sc-${id} .eq1{opacity:1;transform:none;transition:all .4s ease 1.1s}
      .on2 .sc-${id} .eq2{opacity:1;transform:none;transition:all .4s ease 1.6s}
      .on3 .sc-${id} .eq3{opacity:1;transform:none;transition:all .4s ease .2s}
      .on3 .sc-${id} .tag{opacity:1;transform:none;transition:all .4s ease .8s}
    `));
  }

  // 전항·후항: 3 : 4 조각 → : 앞(뒤) 조각에 색 → 다른 비 5 : 2, 7 : 10 에서도 같은 자리에 색
  const termScene = (id, key, side, pair, label) => {
    const main = [['3', 220], ['4', 420]];
    const pick = side === 'front' ? 0 : 1;
    const ex = [[['5', 160, 46], ['2', 240, 46], 200], [['7', 395, 46], ['10', 491, 58], 440]];
    let body = '';
    main.forEach(([n, x], i) => { body += `<g class="rise" style="--d:${f(0.15 + 0.35 * i * 2)}s">${tile(x, 130, n, { size: 56, w: 84, h: 96, cls: i === pick ? 'tp' : '' })}</g>`; });
    body += `<g class="rise" style="--d:.5s"><g class="colon">${sym(320, 130, ':', 56)}</g></g>`;
    body += `<g class="b2"><g class="lab">${text(main[pick][1], 226, label, { size: 28, color: pair[1] })}</g></g>`;
    let exb = '';
    ex.forEach(([a, b, cx], j) => {
      const t = [a, b];
      t.forEach(([n, x, w], i) => { exb += tile(x, 300, n, { size: 30, w, h: 52, cls: i === pick ? `ep ep${j}` : '' }); });
      exb += sym(cx, 300, ':', 30);
    });
    body += `<g class="b3">${exb}</g>`;
    put(key, svg(id, body, `
      .sc-${id} .rise{opacity:0;transform:translateY(26px)}
      .on1 .sc-${id} .rise{opacity:1;transform:none;transition:opacity .4s ease var(--d),transform .4s ease var(--d)}
      .sc-${id} .colon{transform-box:fill-box;transform-origin:center}
      .on2 .sc-${id} .colon{animation:${id}-pulse .7s ease .1s 2}
      @keyframes ${id}-pulse{50%{transform:scale(1.5)}}
      ${paint(id, '.tp', pair, 2, 1.1)}
      .sc-${id} .tp{transform-box:fill-box;transform-origin:center}
      .on2 .sc-${id} .tp{animation:${id}-hop .5s ease 1.1s}
      @keyframes ${id}-hop{40%{transform:translateY(-14px)}}
      .sc-${id} .lab{opacity:0;transform:translateY(-12px)}
      .on2 .sc-${id} .lab{opacity:1;transform:none;transition:all .4s ease 1.5s}
      ${paint(id, '.ep0', pair, 3, .5)}${paint(id, '.ep1', pair, 3, 1.1)}
    `));
  };
  termScene('t62-m4-jeonhang', '6-2/수학/4/전항', 'front', FRONT, '전항');
  termScene('t62-m4-huhang', '6-2/수학/4/후항', 'back', BACK, '후항');

  // 비례식: 2 : 3 과 4 : 6 을 막대로(길이가 같음) → 비율 3분의 2로 같음 → 2 : 3 = 4 : 6
  {
    const id = 't62-m4-bilye';
    const group = (cx, a, b, u, n0) => {
      const x0 = cx - 60;
      const pos = [cx - 45, cx + 45];
      return {
        bars: blocks(x0, 110, a, u, 28, FRONT, 'blk', n0, 0.08) + blocks(x0, 150, b, u, 28, BACK, 'blk', n0 + 0.3, 0.08),
        pos
      };
    };
    const L = group(165, 2, 3, 40, 0.2), R = group(475, 4, 6, 20, 0.7);
    const bottom = { a: 150, c: 200, b: 250, eq: 320, d: 390, c2: 440, e: 490 };
    const mover = (x0, x1, label, cls) => `<g class="mv" style="--dx:${px(x0 - x1)};--dy:${px(60 - 305)}">${tile(x1, 305, label, { size: 34, w: 52, h: 60, cls })}</g>`;
    const colon = (x0, x1) => `<g class="mv" style="--dx:${px(x0 - x1)};--dy:${px(60 - 305)}">${sym(x1, 305, ':', 34)}</g>`;
    const body = L.bars + R.bars
      + mover(L.pos[0], bottom.a, '2', 'p1') + colon(165, bottom.c) + mover(L.pos[1], bottom.b, '3', 'p2')
      + mover(R.pos[0], bottom.d, '4', 'p1') + colon(475, bottom.c2) + mover(R.pos[1], bottom.e, '6', 'p2')
      + `<g class="b2"><g class="v1">${frac(165, 222, 2, 3, { size: 28, color: C.green })}</g><g class="v2">${frac(475, 222, 2, 3, { size: 28, color: C.green })}</g>`
      + `<g class="guide"><path d="M${165 - 60 + 80} 102 V186 M${165 - 60 + 120} 102 V186 M${475 - 60 + 80} 102 V186 M${475 - 60 + 120} 102 V186" stroke="${C.muted}" stroke-width="2.5" stroke-dasharray="5 5"/></g></g>`
      + `<g class="b3"><g class="eqs">${sym(bottom.eq, 305, '=', 38)}</g></g>`;
    put('6-2/수학/4/비례식', svg(id, body, `
      .sc-${id} .blk{transform-box:fill-box;transform-origin:left center;transform:scaleX(0)}
      .on1 .sc-${id} .blk{transform:none;transition:transform .3s ease-out var(--d)}
      .sc-${id} .mv{transform:translate(var(--dx),var(--dy))}
      .on3 .sc-${id} .mv{transform:none;transition:transform .9s ease .3s}
      ${paint(id, '.p1', FRONT, 1, .1)}${paint(id, '.p2', BACK, 1, .1)}
      .sc-${id} .v1,.sc-${id} .v2{opacity:0;transform:translateY(-10px)}
      .on2 .sc-${id} .v1{opacity:1;transform:none;transition:all .4s ease .3s}
      .on2 .sc-${id} .v2{opacity:1;transform:none;transition:all .4s ease .9s}
      .sc-${id} .guide{opacity:0}
      .on2 .sc-${id} .guide{opacity:1;transition:opacity .4s ease 1.5s}
      .sc-${id} .eqs{transform-box:fill-box;transform-origin:center;transform:scale(0)}
      .on3 .sc-${id} .eqs{transform:none;transition:transform .4s cubic-bezier(.3,1.6,.6,1) 1.2s}
    `));
  }

  // 외항·내항: 2 : 3 = 4 : 6 조각 → 바깥(안쪽) 두 조각에 색과 묶음 줄 → 8 : 5 = 16 : 10 에서도
  const pairScene = (id, key, outer) => {
    const pair = outer ? OUTER : INNER;
    const label = outer ? '외항' : '내항';
    const main = [['2', 120], [':', 185], ['3', 250], ['=', 320], ['4', 390], [':', 455], ['6', 520]];
    const pickMain = outer ? [0, 6] : [2, 4];
    let body = '';
    main.forEach(([n, x], i) => {
      const inner = /\d/.test(n) ? tile(x, 130, n, { size: 44, w: 64, h: 76, cls: pickMain.includes(i) ? 'pk' : '' }) : sym(x, 130, n, 44);
      body += `<g class="rise" style="--d:${f(0.1 + 0.12 * i)}s">${inner}</g>`;
    });
    const brMain = outer
      ? `<path class="dr" pathLength="1" d="M120 86 V70 H520 V86" stroke="${C.purple}" stroke-width="4" fill="none" stroke-linejoin="round"/>`
      : `<path class="dr" pathLength="1" d="M250 174 V190 H390 V174" stroke="${C.green}" stroke-width="4" fill="none" stroke-linejoin="round"/>`;
    body += `<g class="b2">${brMain}<g class="lab">${text(320, outer ? 56 : 222, label, { size: 26, color: pair[1] })}</g></g>`;
    const ex = [['8', 165, 46], [':', 207], ['5', 249, 46], ['=', 320], ['16', 393, 58], [':', 440], ['10', 487, 58]];
    const pickEx = outer ? [0, 6] : [2, 4];
    let exb = '';
    ex.forEach(([n, x, w], i) => { exb += /\d/.test(n) ? tile(x, 300, n, { size: 30, w, h: 50, cls: pickEx.includes(i) ? 'pe' : '' }) : sym(x, 300, n, 30); });
    const brEx = outer
      ? `<path class="dr2" pathLength="1" d="M165 273 V262 H487 V273" stroke="${C.purple}" stroke-width="3.5" fill="none" stroke-linejoin="round"/>`
      : `<path class="dr2" pathLength="1" d="M249 327 V338 H393 V327" stroke="${C.green}" stroke-width="3.5" fill="none" stroke-linejoin="round"/>`;
    body += `<g class="b3">${exb}${brEx}</g>`;
    put(key, svg(id, body, `
      .sc-${id} .rise{opacity:0;transform:translateY(24px)}
      .on1 .sc-${id} .rise{opacity:1;transform:none;transition:opacity .35s ease var(--d),transform .35s ease var(--d)}
      ${paint(id, '.pk', pair, 2, .2)}
      .sc-${id} .pk{transform-box:fill-box;transform-origin:center}
      .on2 .sc-${id} .pk{animation:${id}-hop .5s ease .2s}
      @keyframes ${id}-hop{40%{transform:translateY(${outer ? -12 : 12}px)}}
      .sc-${id} .dr,.sc-${id} .dr2{stroke-dasharray:1 1;stroke-dashoffset:1}
      .on2 .sc-${id} .dr{stroke-dashoffset:0;transition:stroke-dashoffset .8s ease .7s}
      .sc-${id} .lab{opacity:0}
      .on2 .sc-${id} .lab{opacity:1;transition:opacity .4s ease 1.4s}
      ${paint(id, '.pe', pair, 3, .6)}
      .on3 .sc-${id} .dr2{stroke-dashoffset:0;transition:stroke-dashoffset .7s ease 1.1s}
    `));
  };
  pairScene('t62-m4-oehang', '6-2/수학/4/외항', true);
  pairScene('t62-m4-naehang', '6-2/수학/4/내항', false);

  // 비례배분: 사탕 10개 → 2 : 3 에 맞춰 한 번에 2개·3개씩 두 번 담기 → 4개, 6개 → 2 : 3 이 반짝
  {
    const id = 't62-m4-baebun';
    const candy = (x, y) => `<path d="M${x - 11} ${y} L${x - 19} ${y - 7} L${x - 19} ${y + 7} Z M${x + 11} ${y} L${x + 19} ${y - 7} L${x + 19} ${y + 7} Z" fill="${C.yellow}" stroke="${C.orange}" stroke-width="2.5" stroke-linejoin="round"/><circle cx="${x}" cy="${y}" r="12" fill="${C.yellow}" stroke="${C.orange}" stroke-width="3"/>`;
    // 한 번에 담는 사탕은 한 줄: 첫 번째는 아랫줄, 두 번째는 윗줄
    const left = [[180, 262], [220, 262], [180, 230], [220, 230]];
    const right = [[400, 262], [440, 262], [480, 262], [400, 230], [440, 230], [480, 230]];
    const plan = [['L', 0], ['L', 1], ['R', 0], ['R', 1], ['R', 2], ['L', 2], ['L', 3], ['R', 3], ['R', 4], ['R', 5]];
    let candies = '';
    plan.forEach(([side, k], i) => {
      const [tx, ty] = side === 'L' ? left[k] : right[k];
      const sx = 122 + 44 * i, sy = 70;
      const d = i < 5 ? 0.1 + 0.08 * i : 0.9 + 0.08 * (i - 5);
      candies += `<g class="cd" style="--dx:${px(sx - tx)};--dy:${px(sy - ty)};--d:${f(d)}s">${candy(tx, ty)}</g>`;
    });
    const bowl = (cx, cls) => `<g class="${cls}"><path d="M${cx - 95} 238 C${cx - 90} 300 ${cx + 90} 300 ${cx + 95} 238 Z" fill="${C.mint}" stroke="${C.green}" stroke-width="3.5" stroke-linejoin="round"/></g>`;
    const body = bowl(200, 'bw') + bowl(440, 'bw')
      + `<g class="b3"><g class="ncount">${text(58, 268, '4개', { size: 26, color: C.orange })}${text(584, 268, '6개', { size: 26, color: C.blue })}</g></g>`
      + candies
      + tile(200, 324, '2', { size: 30, w: 50, h: 48, cls: 'ra' }) + sym(320, 324, ':', 30) + tile(440, 324, '3', { size: 30, w: 50, h: 48, cls: 'rb' });
    put('6-2/수학/4/비례배분', svg(id, body, `
      .sc-${id} .cd{transform:translate(var(--dx),var(--dy))}
      .on2 .sc-${id} .cd{transform:none;transition:transform .6s cubic-bezier(.4,0,.3,1.2) var(--d)}
      .sc-${id} .ncount{transform-box:fill-box;transform-origin:center}
      .on3 .sc-${id} .ncount{animation:${id}-pop .5s ease .2s}
      @keyframes ${id}-pop{50%{transform:scale(1.25)}}
      ${paint(id, '.ra', FRONT, 4, .1)}${paint(id, '.rb', BACK, 4, .1)}
      .sc-${id} .bw{transform-box:fill-box;transform-origin:center bottom}
      .on4 .sc-${id} .bw{animation:${id}-bounce .9s ease .5s 2}
      @keyframes ${id}-bounce{40%{transform:scaleY(1.08)}}
    `));
  }
})(typeof window !== 'undefined' ? window : globalThis);
