// 수학 2-1 5단원 분류하기: 낱말 도식
// 분류는 옷을 윗옷·아래옷으로(교과서 옷 정리), 기준은 같은 블록을 색깔로 한 번, 모양으로 한 번 나누어 기준이 바뀌면 결과가 바뀜을 보인다.
// 움직임은 transform·opacity·stroke-dashoffset 만(아이패드 사파리).
(function (root) {
  'use strict';
  const { C, svg, text, arrow, put } = root.FigureKit;
  const f = (n) => +(+n).toFixed(1);
  const dl = (s, more = '') => `style="animation-delay:${s}s;transition-delay:${s}s;${more}"`;
  const T = (x, y, s, o = {}) => text(f(x), f(y), s, o);

  // 칸 움직임(N = 1~4): sN 나타나기, pN 튀어나오기, dN 선 그리기(class="dr" pathLength="100"), rN 퍼지는 고리,
  // kN 깜빡이며 남기, fN 날아오기(--dx,--dy 에서 제자리로), mN 옮겨 가 머물기(--mx,--my), gN 사라지기, xN 흐려지기
  const motion = (id) => {
    let css = `
    .sc-${id} :is(.s1,.s2,.s3,.s4,.p1,.p2,.p3,.p4,.f1,.f2,.f3,.f4,.k1,.k2,.k3,.k4){opacity:0}
    .sc-${id} :is(.p1,.p2,.p3,.p4,.ring){transform-box:fill-box;transform-origin:center}
    .sc-${id} .dr{stroke-dasharray:100 110;stroke-dashoffset:101;transition:stroke-dashoffset .6s ease-in-out}
    .sc-${id} :is(.m1,.m2,.m3,.m4){transition:transform .8s ease-in-out}
    .sc-${id} :is(.g1,.g2,.g3,.g4,.x1,.x2,.x3,.x4){transition:opacity .4s linear}
    .sc-${id} .ring{opacity:0}
    @keyframes ${id}-in{from{opacity:0}to{opacity:1}}
    @keyframes ${id}-pop{0%{opacity:0;transform:scale(0)}70%{opacity:1;transform:scale(1.18)}100%{opacity:1;transform:none}}
    @keyframes ${id}-ring{0%{opacity:.9;transform:scale(1)}100%{opacity:0;transform:scale(2.2)}}
    @keyframes ${id}-blink{0%{opacity:0}20%{opacity:1}40%{opacity:.2}60%{opacity:1}80%{opacity:.2}100%{opacity:1}}
    @keyframes ${id}-fly{from{opacity:1;transform:translate(var(--dx),var(--dy))}to{opacity:1;transform:none}}`;
    for (let n = 1; n <= 4; n++) css += `
    .on${n} .sc-${id} .s${n}{animation:${id}-in .4s ease-out both}
    .on${n} .sc-${id} .p${n}{animation:${id}-pop .45s ease-out both}
    .on${n} .sc-${id} .d${n}{stroke-dashoffset:0}
    .on${n} .sc-${id} .r${n}{animation:${id}-ring 1s ease-out 2 both}
    .on${n} .sc-${id} .k${n}{animation:${id}-blink 1.2s ease-in-out both}
    .on${n} .sc-${id} .f${n}{animation:${id}-fly .7s ease-in-out both}
    .on${n} .sc-${id} .m${n}{transform:translate(var(--mx,0px),var(--my,0px))}
    .on${n} .sc-${id} .g${n}{opacity:0}
    .on${n} .sc-${id} .x${n}{opacity:.22}`;
    return css;
  };
  const G = (cls, d, inner, more = '') => `<g class="${cls}" ${dl(d, more)}>${inner}</g>`;
  const ring = (cx, cy, r, color, cls, d = 0) => `<circle class="ring ${cls}" ${dl(d)} cx="${f(cx)}" cy="${f(cy)}" r="${r}" fill="none" stroke="${color}" stroke-width="4"/>`;
  const tag = (x, y, s, color, cls, d = 0, size = 26, anchor = 'middle') => G(cls, d, T(x, y, s, { size, color, anchor }));
  const rect = (x, y, w, h, fill, stroke, sw = 3, rx = 6) => `<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="${rx}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
  const pill = (cx, cy, w, s, color, fill, size = 28) => rect(cx - w / 2, cy - 24, w, 48, fill, color, 3, 24) + T(cx, cy + size * .36, s, { size, color });
  const line = (d, color = C.ink, w = 3, cls = '', more = '') => `<path class="${cls}" ${more} d="${d}" stroke="${color}" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  const draw = (d, color, w, n, delay = 0) => `<path class="dr d${n}" pathLength="100" ${dl(delay)} d="${d}" stroke="${color}" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  // 묶음 괄호(x1~x2, 모서리 y, down 이면 아래로 벌어짐)
  const brace = (x1, x2, y, color, down = true) => {
    const m = (x1 + x2) / 2, s = down ? 1 : -1;
    return `<path d="M${f(x1)} ${y} Q${f(x1)} ${y + 12 * s} ${f(x1 + 12)} ${y + 12 * s} H${f(m - 12)} Q${f(m)} ${y + 12 * s} ${f(m)} ${y + 24 * s} Q${f(m)} ${y + 12 * s} ${f(m + 12)} ${y + 12 * s} H${f(x2 - 12)} Q${f(x2)} ${y + 12 * s} ${f(x2)} ${y}" fill="none" stroke="${color}" stroke-width="3"/>`;
  };
  const reg = (key, id, body, css = '') => put(key, svg(id, body, motion(id) + css));
  const shapePath = (pts, x, y, fill, stroke) => `<path d="M${pts.map(([a, b]) => `${f(x + a)} ${f(y + b)}`).join(' L')} Z" fill="${fill}" stroke="${stroke}" stroke-width="3" stroke-linejoin="round"/>`;

  // 분류: 섞인 옷 6벌 → 윗옷·아래옷 바구니로 옮겨 감 → 분류
  (function () {
    const id = 't21-m5-bunryu';
    const tee = [[-14, -30], [-36, -18], [-27, -2], [-18, -8], [-18, 30], [18, 30], [18, -8], [27, -2], [36, -18], [14, -30], [0, -22]];
    const pants = [[-22, -30], [22, -30], [24, 30], [6, 30], [0, -4], [-6, 30], [-24, 30]];
    const skirt = [[-16, -26], [16, -26], [30, 26], [-30, 26]];
    const shorts = [[-24, -20], [24, -20], [27, 16], [5, 16], [0, 0], [-5, 16], [-27, 16]];
    const items = [
      [tee, C.sky, C.blue, 80, 100, 90], [tee, C.peach, C.orange, 330, 90, 170], [tee, C.lilac, C.purple, 500, 150, 250],
      [pants, C.sky, C.blue, 200, 150, 390], [skirt, C.peach, C.red, 420, 80, 470], [shorts, C.mint, C.green, 575, 84, 550]
    ];
    const body = G('s2', .1, rect(30, 196, 280, 140, 'white', C.orange, 3, 14) + rect(330, 196, 280, 140, 'white', C.blue, 3, 14)
      + T(170, 228, '윗옷', { size: 28, color: C.orange }) + T(470, 228, '아래옷', { size: 28, color: C.blue }))
      + items.map(([pts, fill, stroke, x, y, tx], i) => `<g class="m2" ${dl(.5 + i * .18, `--mx:${tx - x}px;--my:${285 - y}px`)}>${G('p1', .2 + i * .15, shapePath(pts, x, y, fill, stroke))}</g>`).join('')
      + G('k3', .2, rect(24, 190, 292, 152, 'none', C.orange, 4, 18) + rect(324, 190, 292, 152, 'none', C.blue, 4, 18))
      + G('p3', .9, pill(320, 50, 110, '분류', C.green, C.mint, 32));
    reg('2-1/수학/5/분류', id, body);
  })();

  // 기준: 블록 6개 → 기준 색깔이면 빨강·파랑 두 무리 → 기준 모양이면 삼각형·사각형·원 세 무리
  (function () {
    const id = 't21-m5-gijun', y0 = 110;
    const blk = (kind, x, y, red) => {
      const fill = red ? C.peach : C.sky, stroke = red ? C.red : C.blue;
      if (kind === 0) return shapePath([[0, -26], [-28, 22], [28, 22]], x, y, fill, stroke);
      if (kind === 1) return rect(x - 24, y - 24, 48, 48, fill, stroke, 3, 3);
      return `<circle cx="${x}" cy="${y}" r="26" fill="${fill}" stroke="${stroke}" stroke-width="3"/>`;
    };
    // [모양, 빨강?]
    const list = [[0, 1], [2, 0], [1, 1], [0, 0], [2, 1], [1, 0]];
    let ri = 0, bi = 0;
    const kinds = [0, 0, 0];
    const body = list.map(([kind, red], i) => {
      const x = 70 + i * 100;
      const cx = red ? 80 + 90 * ri++ : 380 + 90 * bi++;
      const sx = [75, 275, 475][kind] + 90 * kinds[kind]++;
      return `<g class="m2" ${dl(.4 + i * .1, `--mx:${cx - x}px;--my:${250 - y0}px`)}><g class="m3" ${dl(.3 + i * .1, `--mx:${sx - cx}px;--my:0px`)}>${G('p1', .2 + i * .12, blk(kind, x, y0, red))}</g></g>`;
    }).join('')
      + `<g class="h3">${G('s2', .1, rect(30, 200, 280, 130, 'none', C.red, 3, 14) + rect(330, 200, 280, 130, 'none', C.blue, 3, 14) + T(170, 318, '빨강', { size: 24, color: C.red }) + T(470, 318, '파랑', { size: 24, color: C.blue }))}`
      + G('p2', .2, pill(320, 46, 200, '기준: 색깔', C.purple, C.lilac, 28)) + '</g>'
      + G('s3', .9, [['삼각형', 25], ['사각형', 225], ['원', 425]].map(([s, x]) => rect(x, 200, 190, 130, 'none', C.green, 3, 14) + T(x + 95, 318, s, { size: 24, color: C.green })).join(''))
      + G('p3', .2, pill(320, 46, 200, '기준: 모양', C.purple, C.lilac, 28))
      + `<g class="h2">${tag(320, 60, '?', C.purple, 'p1', 1, 44)}</g>`;
    reg('2-1/수학/5/기준', id, body);
  })();
})(typeof window !== 'undefined' ? window : globalThis);
