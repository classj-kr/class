// 수학 6-1 5단원 여러 가지 그래프: 낱말 도식
// 원그래프의 부채꼴은 반지름 R/2 인 원 경로(pathLength 100)에 굵기 R 의 선을 긋고, stroke-dasharray "p 100" 으로 p % 만 칠한다.
// 시작 자리는 경로의 transform 속성 rotate 로 돌리고, 펼치는 움직임은 stroke-dashoffset(p → 0)만 쓴다.
// 띠그래프의 칸은 왼쪽부터 늘어나는 scaleX. 움직임은 transform·opacity·stroke-dashoffset 만 쓴다(아이패드 사파리).
(function (root) {
  'use strict';
  const { C, svg, text, put } = root.FigureKit;
  const f = (n) => +(+n).toFixed(1);
  const dl = (s, more = '') => `style="animation-delay:${s}s;transition-delay:${s}s;${more}"`;

  // 같이 쓰는 움직임(N 은 칸 번호). sN 나타나기, pN 튀어나오기, kN 깜빡이기(보이던 것), zN 커졌다 돌아오기,
  // fN 날아오기(--dx,--dy 에서 제자리로), xN 왼쪽부터 늘어나기, yN 아래부터 자라기, dN 선 그리기(class="dr dN" pathLength="100"),
  // wN 부채꼴 펼치기(class="sec wN"), mN 옮겨 가 머물기(--mx,--my), gN 사라지기. 한 요소에 움직임 하나만 — 겹치려면 <g> 로 감싼다.
  const motion = (id) => {
    let css = `
    .sc-${id} :is(.s1,.s2,.s3,.s4,.p1,.p2,.p3,.p4,.f1,.f2,.f3,.f4){opacity:0}
    .sc-${id} :is(.p1,.p2,.p3,.p4,.z1,.z2,.z3,.z4){transform-box:fill-box;transform-origin:center}
    .sc-${id} :is(.x1,.x2,.x3,.x4){transform-box:fill-box;transform-origin:left center;transform:scaleX(0)}
    .sc-${id} :is(.y1,.y2,.y3,.y4){transform-box:fill-box;transform-origin:center bottom;transform:scaleY(0)}
    .sc-${id} .dr{stroke-dasharray:100;stroke-dashoffset:100}
    .sc-${id} .sec{stroke-dashoffset:var(--o)}
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
    .on${n} .sc-${id} :is(.x${n},.y${n}){transform:none;transition:transform .5s ease-out}
    .on${n} .sc-${id} .d${n}{stroke-dashoffset:0;transition:stroke-dashoffset .8s ease-in-out}
    .on${n} .sc-${id} .w${n}{stroke-dashoffset:0;transition:stroke-dashoffset .6s ease-in-out}
    .on${n} .sc-${id} .m${n}{transform:translate(var(--mx,0px),var(--my,0px))}
    .on${n} .sc-${id} .g${n}{opacity:0}`;
    return css;
  };
  const T = (x, y, s, o = {}) => text(f(x), f(y), s, o);
  const frame = (x, y, w, h, color, extra = '') => `<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="8" fill="none" stroke="${color}" stroke-width="4" ${extra}/>`;
  const PAL = [[C.sky, C.blue], [C.peach, C.orange], [C.mint, C.green], [C.lilac, C.purple], ['#eef2ef', C.muted]];

  // 원그래프 조각들. parts: [{ p, fill, cls, d }] 시작은 12시, 시계 방향
  const at = (cx, cy, r, pct) => { const a = pct * 3.6 * Math.PI / 180; return [cx + r * Math.sin(a), cy - r * Math.cos(a)]; };
  function pie(cx, cy, R, parts) {
    const r = R / 2;
    const ring = `M${cx} ${cy - r} A${r} ${r} 0 1 1 ${cx} ${cy + r} A${r} ${r} 0 1 1 ${cx} ${cy - r}`;
    let start = 0, secs = '', seps = '';
    const mids = [];
    parts.forEach(({ p, fill, cls = 'w1', d = 0, wrap = '' }) => {
      const sec = `<path class="sec ${cls}" ${dl(d, `--o:${p}px`)} d="${ring}" pathLength="100" fill="none" stroke="${fill}" stroke-width="${R}" stroke-dasharray="${p} 100" transform="rotate(${f(start * 3.6)} ${cx} ${cy})"/>`;
      secs += wrap ? `<g class="${wrap}">${sec}</g>` : sec;
      const e = at(cx, cy, R, start);
      seps += `<g class="s${cls.slice(1)}" ${dl(d)}><path d="M${cx} ${cy} L${f(e[0])} ${f(e[1])}" stroke="white" stroke-width="3"/></g>`;
      mids.push(start + p / 2);
      start += p;
    });
    return { secs, seps, mids, label: (i, k = 0.6) => at(cx, cy, R * k, mids[i]) };
  }
  // 띠: x0 부터 폭 W 를 parts 의 백분율만큼 나눈다
  function band(x0, y, W, h, parts) {
    let x = x0, segs = '';
    const cx = [];
    parts.forEach(({ p, fill, stroke, cls = 'x1', d = 0 }) => {
      const w = W * p / 100;
      segs += `<g class="${cls}" ${dl(d)}><rect x="${f(x)}" y="${y}" width="${f(w)}" height="${h}" fill="${fill}" stroke="${stroke}" stroke-width="2"/></g>`;
      cx.push(x + w / 2);
      x += w;
    });
    return { segs, cx, outline: `<rect x="${x0}" y="${y}" width="${W}" height="${h}" fill="none" stroke="${C.ink}" stroke-width="3"/>` };
  }

  // 띠그래프: 띠 하나에 0~100 % 눈금 → 좋음 25, 보통 40, 나쁨 20, 매우 나쁨 15 % 만큼 칸이 나뉨 → 백분율, 합 100 % → '띠그래프'
  {
    const id = 't61-m5-tti';
    const x0 = 40, W = 560, y = 116, h = 96;
    const data = [['좋음', 25], ['보통', 40], ['나쁨', 20], ['매우 나쁨', 15]];
    const b = band(x0, y, W, h, data.map(([, p], i) => ({ p, fill: PAL[i][0], stroke: PAL[i][1], cls: 'x2', d: .2 + .5 * i })));
    let ruler = `<path d="M${x0} 100 H${x0 + W}" stroke="${C.ink}" stroke-width="2"/>`;
    for (let k = 0; k <= 10; k++) {
      ruler += `<path d="M${x0 + 56 * k} 100 V${k % 5 ? 92 : 88}" stroke="${C.ink}" stroke-width="2"/>`;
      ruler += T(x0 + 56 * k, 80, k === 10 ? '100 (%)' : 10 * k, { size: 18, weight: 600, color: C.muted });
    }
    const names = data.map(([n], i) => `<g class="s2" ${dl(.6 + .5 * i)}>${n.includes(' ') ? n.split(' ').map((w, j) => T(b.cx[i], 142 + 24 * j, w, { size: 20 })).join('') : T(b.cx[i], 154, n, { size: 22 })}</g>`).join('');
    const pcts = data.map(([, p], i) => `<g class="p3" ${dl(.2 + .25 * i)}>${T(b.cx[i], data[i][0].includes(' ') ? 196 : 190, `(${p} %)`, { size: 20, color: PAL[i][1] })}</g>`).join('');
    const brace = `<path d="M${x0} 226 q0 14 14 14 H${x0 + W / 2 - 14} q14 0 14 14 q0 -14 14 -14 H${x0 + W - 14} q14 0 14 -14" stroke="${C.green}" stroke-width="3" fill="none"/>`;
    const body = `<g class="s1" ${dl(.6)}>${ruler}</g>`
      + `<rect x="${x0}" y="${y}" width="${W}" height="${h}" fill="white"/>` + b.segs
      + `<path class="dr d1" pathLength="100" d="M${x0} ${y} H${x0 + W} V${y + h} H${x0} Z" stroke="${C.ink}" stroke-width="3" fill="none"/>`
      + names + pcts
      + `<g class="s3" ${dl(1.3)}>${brace}${T(x0 + W / 2, 284, '100 %', { size: 24, color: C.green })}</g>`
      + `<g class="s3" ${dl(.2)}><g class="k3" ${dl(.4)}>${frame(x0 + 140, y - 4, 224, h + 8, C.orange)}</g></g>`
      + `<g class="s4" ${dl(.1)}><g class="k4" ${dl(.2)}>${frame(x0 - 4, y - 4, W + 8, h + 8, C.green)}</g></g>`
      + `<g class="p4" ${dl(.6)}>${T(x0 + W / 2, 336, '띠그래프', { size: 28, color: C.green })}</g>`;
    put('6-1/수학/5/띠그래프', svg(id, body, motion(id)));
  }

  // 원그래프: 원 둘레에 0~100 눈금 → 축구 34 % 부채꼴 → 야구, 농구, 배드민턴, 기타(맨 끝) → 합계 100 %, '원그래프'
  {
    const id = 't61-m5-won';
    const cx = 290, cy = 192, R = 125;
    const data = [['축구', 34], ['야구', 25], ['농구', 19], ['배드민턴', 16], ['기타', 6]];
    const P = pie(cx, cy, R, data.map(([, p], i) => ({ p, fill: PAL[i][0], cls: i ? 'w3' : 'w2', d: i ? .2 + .45 * (i - 1) : .3 })));
    let ticks = '';
    for (let k = 0; k < 20; k++) {
      const a = at(cx, cy, R, 5 * k), b = at(cx, cy, R + (k % 5 ? 7 : 12), 5 * k);
      ticks += `<path d="M${f(a[0])} ${f(a[1])} L${f(b[0])} ${f(b[1])}" stroke="${C.ink}" stroke-width="2"/>`;
    }
    const nums = [[0, cx, cy - R - 20, 'middle'], [25, cx + R + 18, cy + 6, 'start'], [50, cx, cy + R + 32, 'middle'], [75, cx - R - 18, cy + 6, 'end']]
      .map(([v, x, y, anchor]) => T(x, y, v, { size: 18, weight: 600, color: C.muted, anchor })).join('');
    const lab = (i, k, beat, d) => {
      const [x, y] = P.label(i, k);
      return `<g class="s${beat}" ${dl(d)}>${T(x, y - 4, data[i][0], { size: data[i][0].length > 2 ? 18 : 22 })}${T(x, y + 20, `(${data[i][1]} %)`, { size: 18, color: PAL[i][1] })}</g>`;
    };
    const rim = at(cx, cy, R, 97);
    const body = P.secs
      + P.seps
      + `<path class="dr d1" pathLength="100" d="M${cx} ${cy - R} A${R} ${R} 0 1 1 ${cx} ${cy + R} A${R} ${R} 0 1 1 ${cx} ${cy - R}" stroke="${C.ink}" stroke-width="3" fill="none"/>`
      + `<g class="s1" ${dl(.7)}>${ticks}${nums}</g>`
      + lab(0, .58, 2, .8) + lab(1, .6, 3, .6) + lab(2, .6, 3, 1) + lab(3, .6, 3, 1.45)
      + `<g class="s3" ${dl(1.9)}><path d="M${f(rim[0])} ${f(rim[1])} L${f(rim[0] - 40)} ${f(rim[1] - 10)} H120" stroke="${C.muted}" stroke-width="2" fill="none"/>${T(116, f(rim[1] - 4), '기타 (6 %)', { size: 20, anchor: 'end' })}</g>`
      + `<g class="s4" ${dl(.1)}><g class="k4" ${dl(.3)}><circle cx="${cx}" cy="${cy}" r="${R + 3}" fill="none" stroke="${C.green}" stroke-width="5"/></g></g>`
      + `<g class="p4" ${dl(.5)}>${T(540, 170, '합계', { size: 22, color: C.muted })}${T(540, 206, '100 %', { size: 30, color: C.green })}</g>`
      + `<g class="p4" ${dl(1)}>${T(540, 268, '원그래프', { size: 28, color: C.green })}</g>`;
    put('6-1/수학/5/원그래프', svg(id, body, motion(id)));
  }

  // 막대그래프와 꺾은선그래프의 축
  const AX = 110, AY = 300;
  const grid = (vals, yOf, x1, every) => vals.map((v) => `<path d="M${AX} ${f(yOf(v))} H${x1}" stroke="${C.line}" stroke-width="${v % every === 0 ? 2 : 1.2}"/>`).join('')
    + vals.filter((v) => v % every === 0).map((v) => T(AX - 12, f(yOf(v) + 6), v, { size: 18, weight: 600, anchor: 'end' })).join('');
  const axes = (x1, top = 60) => `<path d="M${AX} ${top} V${AY} H${x1}" stroke="${C.ink}" stroke-width="3" fill="none"/>`;
  const range = (a, b, s = 1) => { const r = []; for (let v = a; v <= b; v += s) r.push(v); return r; };

  // 막대그래프: 반별 폐지 양만큼 막대가 자람 → 막대 위 수, 가장 긴 2반이 깜빡임 → '막대그래프'
  {
    const id = 't61-m5-makdae';
    const yOf = (v) => AY - 12 * v;
    const names = ['1반', '2반', '3반'], vals = [12, 18, 9], xs = [210, 320, 430];
    const bars = vals.map((v, i) => `<g class="k3" ${dl(.4 + .3 * i)}><g class="y1" ${dl(.4 + .3 * i)}><rect x="${xs[i] - 35}" y="${yOf(v)}" width="70" height="${12 * v}" fill="${C.sky}" stroke="${C.blue}" stroke-width="3"/></g></g>`).join('');
    const body = grid(range(0, 20), yOf, 500, 5) + axes(500) + T(AX, 46, '(kg)', { size: 18, weight: 600 })
      + names.map((n, i) => T(xs[i], 330, n, { size: 22 })).join('')
      + bars
      + vals.map((v, i) => `<g class="p2" ${dl(.2 + .25 * i)}>${T(xs[i], yOf(v) - 12, `${v} kg`, { size: 22, color: C.blue })}</g>`).join('')
      + `<g class="s2" ${dl(1)}><g class="k2" ${dl(1)}>${frame(xs[1] - 46, yOf(18) - 40, 92, 12 * 18 + 44, C.orange)}</g></g>`
      + `<g class="p3" ${dl(.3)}>${T(562, 150, '막대그래프', { size: 24, color: C.green })}</g>`;
    put('6-1/수학/5/막대그래프', svg(id, body, motion(id)));
  }

  // 꺾은선그래프: 달마다 잰 나무의 키를 점으로 → 이웃한 점을 선분으로 → 가장 많이 자란 선분이 깜빡임, '꺾은선그래프'
  {
    const id = 't61-m5-kkeok';
    const yOf = (v) => AY - 4 * v;
    const months = ['3월', '4월', '5월', '6월', '7월'], vals = [20, 26, 35, 50, 56];
    const pts = vals.map((v, i) => [170 + 95 * i, yOf(v)]);
    const dots = pts.map(([x, y], i) => `<g class="p1" ${dl(.3 + .3 * i)}><circle cx="${x}" cy="${y}" r="8" fill="${C.orange}" stroke="white" stroke-width="2"/></g>`).join('');
    const guides = pts.map(([x, y], i) => `<g class="s1" ${dl(.2 + .3 * i)}><path d="M${x} ${AY} V${y}" stroke="${C.orange}" stroke-width="2" stroke-dasharray="4 5" opacity=".6"/></g>`).join('');
    const segs = pts.slice(1).map((p, i) => `<path class="dr d2" ${dl(.2 + .35 * i)} pathLength="100" d="M${pts[i][0]} ${f(pts[i][1])} L${p[0]} ${f(p[1])}" stroke="${C.orange}" stroke-width="5" stroke-linecap="round"/>`).join('');
    const body = grid(range(0, 60, 10), yOf, 600, 10) + axes(600) + T(AX, 46, '(cm)', { size: 18, weight: 600 })
      + months.map((m, i) => T(pts[i][0], 330, m, { size: 20 })).join('')
      + `<g class="g2">${guides}</g>` + segs + dots
      + `<g class="s3" ${dl(.2)}><g class="k3" ${dl(.3)}><path d="M${pts[2][0]} ${pts[2][1]} L${pts[3][0]} ${pts[3][1]}" stroke="${C.red}" stroke-width="9" stroke-linecap="round" opacity=".55"/></g></g>`
      + `<g class="p3" ${dl(1)}><rect x="160" y="76" width="180" height="40" rx="8" fill="${C.paper}"/>${T(250, 105, '꺾은선그래프', { size: 24, color: C.green })}</g>`;
    put('6-1/수학/5/꺾은선그래프', svg(id, body, motion(id)));
  }

  // 그림그래프: 큰 그림 10명, 작은 그림 1명 → 가 동 32명 = 큰 3 + 작은 2 → 나 동, 다 동도 채움, '그림그래프'
  {
    const id = 't61-m5-geurim';
    const person = (x, y, s, color = C.green) => `<g transform="translate(${f(x)} ${f(y)}) scale(${s})"><circle cx="0" cy="-13" r="8" fill="${color}"/><path d="M-13 13 V3 Q-13 -3 -6 -3 H6 Q13 -3 13 3 V13 Z" fill="${color}"/></g>`;
    const rows = [['가 동', 32], ['나 동', 24], ['다 동', 41]];
    const rowY = (i) => 90 + 80 * i;
    const icons = (n, y, beat, d0) => {
      let s = '', x = 160, k = 0;
      for (let b = 0; b < Math.floor(n / 10); b++, x += 46, k++) s += `<g class="p${beat}" ${dl(d0 + .18 * k)}>${person(x, y + 2, 1.35)}</g>`;
      x += 6;
      for (let m = 0; m < n % 10; m++, x += 26, k++) s += `<g class="p${beat}" ${dl(d0 + .18 * k)}>${person(x, y + 8, .7)}</g>`;
      return s;
    };
    const table = `<rect x="30" y="50" width="440" height="240" fill="white" stroke="${C.ink}" stroke-width="3"/><rect x="30" y="50" width="100" height="240" fill="${C.mint}" stroke="${C.ink}" stroke-width="3"/>`
      + `<path d="M30 130 H470 M30 210 H470" stroke="${C.muted}" stroke-width="2"/>`
      + rows.map(([n], i) => T(80, rowY(i) + 8, n, { size: 22 })).join('');
    const legend = `<rect x="490" y="60" width="130" height="130" rx="10" fill="white" stroke="${C.line}" stroke-width="3"/>`
      + `<g class="p1" ${dl(.3)}>${person(522, 100, 1.35)}${T(590, 108, '10명', { size: 22 })}</g>`
      + `<g class="p1" ${dl(.8)}>${person(522, 158, .7)}${T(590, 166, '1명', { size: 22 })}</g>`;
    const body = table + legend
      + icons(32, rowY(0), 2, .3)
      + icons(24, rowY(1), 3, .2) + icons(41, rowY(2), 3, .9)
      + `<g class="s3" ${dl(1.9)}><g class="k3" ${dl(2)}>${frame(140, rowY(2) - 34, 230, 68, C.orange)}</g></g>`
      + `<g class="g3"><g class="p2" ${dl(1.4)}>${T(555, 240, '가 동 32명', { size: 22, color: C.orange })}</g></g>`
      + `<g class="p3" ${dl(1.9)}>${T(555, 240, '다 동 41명', { size: 22, color: C.orange })}</g>`
      + `<g class="p3" ${dl(1.6)}>${T(555, 300, '그림그래프', { size: 24, color: C.green })}</g>`;
    put('6-1/수학/5/그림그래프', svg(id, body, motion(id)));
  }

  // 자료: 친구들에게 좋아하는 체험 활동을 물음 → 대답 카드가 날아와 모임 → 모은 것이 '자료'
  {
    const id = 't61-m5-jaryo';
    const face = (x, y) => `<circle cx="${x}" cy="${y}" r="22" fill="${C.peach}" stroke="${C.orange}" stroke-width="2.5"/><circle cx="${x - 8}" cy="${y - 4}" r="3" fill="${C.ink}"/><circle cx="${x + 8}" cy="${y - 4}" r="3" fill="${C.ink}"/><path d="M${x - 8} ${y + 7} Q${x} ${y + 14} ${x + 8} ${y + 7}" stroke="${C.ink}" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;
    const kinds = [['코딩', C.blue], ['요리', C.orange], ['농장', C.green]];
    const answers = [0, 1, 0, 2, 1, 0, 2, 0];
    const fx = (i) => 78 + 68 * i;
    const faces = answers.map((_, i) => `<g class="p1" ${dl(.2 + .1 * i)}>${face(fx(i), 306)}</g>`).join('');
    const cards = answers.map((k, i) => {
      const c = i % 4, r = Math.floor(i / 4), x = 170 + 100 * c, y = 134 + 58 * r;
      return `<g class="f2" ${dl(.2 + .2 * i, `--dx:${f(fx(i) - x)}px;--dy:${f(306 - y)}px`)}><rect x="${x - 44}" y="${y - 20}" width="88" height="40" rx="8" fill="white" stroke="${kinds[k][1]}" stroke-width="3"/>${T(x, y + 7, kinds[k][0], { size: 20, color: kinds[k][1] })}</g>`;
    }).join('');
    const body = `<g class="s1" ${dl(1)}><rect x="180" y="30" width="280" height="48" rx="24" fill="${C.sky}" stroke="${C.blue}" stroke-width="3"/>${T(320, 62, '좋아하는 체험 활동?', { size: 22, color: C.blue })}</g>`
      + faces
      + `<g class="s2" ${dl(.1)}><rect x="110" y="100" width="420" height="126" rx="12" fill="white" stroke="${C.line}" stroke-width="3" stroke-dasharray="8 6"/></g>`
      + cards
      + `<g class="s3" ${dl(.1)}><g class="k3" ${dl(.3)}>${frame(110, 100, 420, 126, C.green)}</g></g>`
      + `<g class="s3" ${dl(.5)}><path d="M540 100 q14 0 14 14 v35 q0 14 12 14 q-12 0 -12 14 v35 q0 14 -14 14" stroke="${C.green}" stroke-width="4" fill="none" stroke-linecap="round"/></g>`
      + `<g class="p3" ${dl(.9)}>${T(574, 174, '자료', { size: 30, color: C.green, anchor: 'start' })}</g>`;
    put('6-1/수학/5/자료', svg(id, body, motion(id)));
  }

  // 표 그리기: cols 칸 너비, rows 글자 줄. 첫 줄과 첫 칸은 옅은 바탕. cellAttr(r, c) 로 칸마다 감쌀 클래스를 준다
  function table(x, y, cols, rh, rows, { size = 20, cellAttr = () => '', under = () => '' } = {}) {
    const W = cols.reduce((a, b) => a + b, 0), H = rh * rows.length;
    const xs = cols.reduce((a, w) => [...a, a[a.length - 1] + w], [x]);
    let s = `<rect x="${x}" y="${y}" width="${W}" height="${H}" fill="white"/><rect x="${x}" y="${y}" width="${W}" height="${rh}" fill="${C.mint}"/><rect x="${x}" y="${y}" width="${cols[0]}" height="${H}" fill="${C.mint}"/>`;
    rows.forEach((row, r) => row.forEach((_, c) => { s += under(r, c, xs[c], y + r * rh, cols[c], rh); }));
    rows.forEach((row, r) => row.forEach((cell, c) => {
      if (cell === '') return;
      s += `<g ${cellAttr(r, c)}>${T((xs[c] + xs[c + 1]) / 2, y + r * rh + rh / 2 + size * .36, cell, { size, weight: r && c ? 700 : 600 })}</g>`;
    }));
    let lines = '';
    for (let r = 1; r < rows.length; r++) lines += `M${x} ${y + r * rh} H${x + W} `;
    for (let c = 1; c < cols.length; c++) lines += `M${xs[c]} ${y} V${y + H} `;
    s += `<path d="${lines}" stroke="${C.muted}" stroke-width="2"/><rect x="${x}" y="${y}" width="${W}" height="${H}" fill="none" stroke="${C.ink}" stroke-width="3"/>`;
    return { body: s, xs, cx: (c) => (xs[c] + xs[c + 1]) / 2, cy: (r) => y + r * rh + rh / 2, W, H };
  }

  // 항목: 간식 조사표 → 떡볶이, 김밥, 빵, 만두 칸이 차례로 색칠 → 같은 색으로 띠그래프의 칸이 됨 → 표와 그래프의 항목이 함께 깜빡임, '항목'
  {
    const id = 't61-m5-hangmok';
    const items = ['떡볶이', '김밥', '빵', '만두'], n = [9, 7, 5, 4], pc = [36, 28, 20, 16];
    const tb = table(30, 30, [130, 90, 90, 90, 90, 90], 44, [['간식', ...items, '합계'], ['학생 수(명)', ...n, 25], ['백분율(%)', ...pc, 100]], {
      size: 20,
      under: (r, c, x, y, w, h) => (r === 0 && c >= 1 && c <= 4) ? `<g class="s2" ${dl(.2 + .45 * (c - 1))}><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${PAL[c - 1][0]}"/></g>` : ''
    });
    const b = band(40, 226, 560, 74, pc.map((p, i) => ({ p, fill: PAL[i][0], stroke: PAL[i][1], cls: 'x3', d: .2 + .4 * i })));
    const blabels = items.map((it, i) => `<g class="s3" ${dl(.5 + .4 * i)}>${T(b.cx[i], 258, it, { size: 22 })}${T(b.cx[i], 286, `(${pc[i]} %)`, { size: 18, color: PAL[i][1] })}</g>`).join('');
    const rings = items.map((_, i) => `<g class="s2" ${dl(.2 + .45 * i)}><g class="k4" ${dl(.2)}>${frame(tb.xs[i + 1] + 2, 32, 86, 40, PAL[i][1])}</g></g>`).join('');
    const brings = items.map((_, i) => `<g class="s4" ${dl(.1)}><g class="k4" ${dl(.2)}>${frame(40 + 5.6 * pc.slice(0, i).reduce((a, v) => a + v, 0) + 2, 228, 5.6 * pc[i] - 4, 70, PAL[i][1])}</g></g>`).join('');
    const body = `<g class="s1" ${dl(.2)}>${tb.body}</g>` + rings
      + `<rect x="40" y="226" width="560" height="74" fill="white" stroke="${C.line}" stroke-width="2" stroke-dasharray="6 5"/>`
      + b.segs + `<g class="s3" ${dl(.1)}>${b.outline}</g>` + blabels + brings
      + `<g class="s3" ${dl(.4)}>${items.map((_, i) => `<path d="M${tb.cx(i + 1)} 168 L${f(b.cx[i])} 222" stroke="${PAL[i][1]}" stroke-width="2.5" stroke-dasharray="5 5"/>`).join('')}</g>`
      + `<g class="p4" ${dl(.8)}>${T(320, 338, '항목', { size: 28, color: C.green })}</g>`;
    put('6-1/수학/5/항목', svg(id, body, motion(id)));
  }

  // 기타: 문화유산 조사 6갈래 → 1명씩인 숭례문과 미륵사지 석탑이 모여 '기타 2명' → 띠그래프, 기타는 맨 끝 → 기타가 깜빡임
  {
    const id = 't61-m5-gita';
    const chipAt = (x, y, label, w = 190, stroke = C.line) => `<rect x="${x - w / 2}" y="${y - 22}" width="${w}" height="44" rx="22" fill="white" stroke="${stroke}" stroke-width="3"/>${T(x, y + 7, label, { size: 20 })}`;
    const list = [['경복궁 6명', 115, 56], ['경주 첨성대 5명', 320, 56], ['수원 화성 4명', 525, 56], ['종묘 3명', 115, 116]];
    const chips = list.map(([l, x, y], i) => `<g class="p1" ${dl(.2 + .2 * i)}>${chipAt(x, y, l)}</g>`).join('');
    const small = [['숭례문 1명', 300, 116, 102], ['미륵사지 석탑 1명', 510, 116, -88]].map(([l, x, y, mx], i) =>
      `<g class="g2" ${dl(.9)}><g class="m2" ${dl(.1, `--mx:${mx + (i ? 1 : -1) * 0}px;--my:0px`)}><g class="p1" ${dl(1 + .2 * i)}>${chipAt(x, y, l, i ? 200 : 160, C.orange)}</g></g></g>`).join('');
    const data = [['경복궁', 30], ['경주 첨성대', 25], ['수원 화성', 20], ['종묘', 15], ['기타', 10]];
    const b = band(40, 206, 560, 80, data.map(([, p], i) => ({ p, fill: PAL[i][0], stroke: PAL[i][1], cls: 'x3', d: .2 + .35 * i })));
    const blabels = data.map(([nm, p], i) => `<g class="s3" ${dl(.45 + .35 * i)}>${T(b.cx[i], i === 4 ? 253 : 240, nm, { size: nm.length > 3 ? 18 : 20 })}${T(b.cx[i], i === 4 ? 310 : 268, `(${p} %)`, { size: 18, color: PAL[i][1] })}</g>`).join('');
    const body = chips + small
      + `<g class="p2" ${dl(1)}><g class="k4" ${dl(.2)}>${chipAt(405, 116, '기타 2명', 150, C.green)}</g></g>`
      + `<rect x="40" y="206" width="560" height="80" fill="white" stroke="${C.line}" stroke-width="2" stroke-dasharray="6 5"/>`
      + b.segs + `<g class="s3" ${dl(.1)}>${b.outline}</g>` + blabels
      + `<g class="s4" ${dl(.1)}><g class="k4" ${dl(.2)}>${frame(546, 204, 56, 84, C.green)}</g></g>`
      + `<g class="p4" ${dl(.6)}><path d="M572 158 V194 M563 184 L572 196 L581 184" stroke="${C.green}" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>${T(554, 182, '맨 끝', { size: 22, color: C.green, anchor: 'end' })}</g>`;
    put('6-1/수학/5/기타', svg(id, body, motion(id)));
  }

  // 합계: 재활용품 배출량 표 → kg 수가 합계 칸으로 모여 400 → 백분율이 모여 100, 원그래프가 원 전체를 채움 → 합계 줄과 원 테두리가 깜빡임
  {
    const id = 't61-m5-hapgye';
    const items = ['종이류', '플라스틱류', '유리병류', '캔류', '기타'], kg = [220, 100, 40, 20, 20], pc = [55, 25, 10, 5, 5];
    const rows = [['항목', '배출량(kg)', '백분율(%)'], ...items.map((it, i) => [it, kg[i], pc[i]]), ['합계', '', '']];
    const tb = table(24, 40, [158, 112, 104], 40, rows, {
      size: 20,
      under: (r, c, x, y) => (c === 0 && r >= 1 && r <= 5) ? `<rect x="${x + 8}" y="${y + 13}" width="14" height="14" rx="3" fill="${PAL[r - 1][0]}" stroke="${PAL[r - 1][1]}" stroke-width="2"/>` : ''
    });
    const sumY = tb.cy(6);
    const flyTo = (col, vals, beat, d0) => vals.map((v, i) => `<g class="g${beat}" ${dl(d0 + .25 * i + .8)}><g class="s${beat}" ${dl(d0 + .25 * i)}><g class="m${beat}" ${dl(d0 + .25 * i + .1, `--mx:0px;--my:${f(sumY - tb.cy(i + 1))}px`)}>${T(tb.cx(col), tb.cy(i + 1) + 7, v, { size: 20, color: C.orange })}</g></g></g>`).join('');
    const P = pie(522, 180, 100, pc.map((p, i) => ({ p, fill: PAL[i][0], cls: 'w3', d: .2 + .25 * i })));
    const body = tb.body
      + flyTo(1, kg, 2, .2)
      + `<g class="p2" ${dl(1.6)}>${T(tb.cx(1), sumY + 7, '400', { size: 22, color: C.orange })}</g>`
      + flyTo(2, pc, 3, .2)
      + `<g class="p3" ${dl(1.6)}>${T(tb.cx(2), sumY + 7, '100', { size: 22, color: C.green })}</g>`
      + P.secs + P.seps
      + `<g class="s3" ${dl(.1)}><circle cx="522" cy="180" r="100" fill="none" stroke="${C.ink}" stroke-width="3"/></g>`
      + `<g class="s4" ${dl(.1)}><g class="k4" ${dl(.2)}>${frame(26, tb.cy(6) - 18, 370, 36, C.green)}<circle cx="522" cy="180" r="104" fill="none" stroke="${C.green}" stroke-width="5"/></g></g>`
      + `<g class="p4" ${dl(.6)}>${T(522, 322, '100 %', { size: 30, color: C.green })}</g>`;
    put('6-1/수학/5/합계', svg(id, body, motion(id)));
  }

  // 해석: 만족도 원그래프 높음 70, 보통 20, 낮음 10 → 높음 부채꼴이 튀어나옴 → 70 + 20 = 90 → 웃는 얼굴 말풍선, '해석'
  {
    const id = 't61-m5-haeseok';
    const cx = 230, cy = 185, R = 130;
    const data = [['높음', 70], ['보통', 20], ['낮음', 10]];
    const mid = at(0, 0, 16, 35);
    const P = pie(cx, cy, R, data.map(([, p], i) => ({ p, fill: PAL[i === 0 ? 2 : i === 1 ? 0 : 1][0], cls: 'w1', d: .2 + .5 * [0, 1.4, 2][i], wrap: i ? '' : 'out' })));
    const cols = [PAL[2], PAL[0], PAL[1]];
    const labs = data.map(([n, p], i) => { const [x, y] = P.label(i, i ? .66 : .55); return `<g class="${i ? '' : 'out'}"><g class="s1" ${dl(.8 + .6 * i)}>${T(x, y - 4, n, { size: 22 })}${T(x, y + 22, `(${p} %)`, { size: 18, color: cols[i][1] })}</g></g>`; }).join('');
    const smile = `<path d="M490 186 a52 44 0 1 1 30 38 l-26 14 l6 -22 a52 44 0 0 1 -10 -30 Z" fill="white" stroke="${C.green}" stroke-width="3" stroke-linejoin="round"/>`
      + `<circle cx="542" cy="198" r="26" fill="${C.yellow}" stroke="${C.orange}" stroke-width="2.5"/><circle cx="533" cy="192" r="3" fill="${C.ink}"/><circle cx="551" cy="192" r="3" fill="${C.ink}"/><path d="M532 205 Q542 214 552 205" stroke="${C.ink}" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;
    const body = P.secs + P.seps + labs
      + `<g class="s3" ${dl(.2)}>${T(520, 96, `${'<tspan fill="' + C.green + '">70</tspan>'} + ${'<tspan fill="' + C.blue + '">20</tspan>'} = 90`, { size: 28 })}${T(520, 128, '(%)', { size: 18, color: C.muted })}</g>`
      + `<g class="s4" ${dl(.1)}><path class="dr d4" pathLength="100" d="M386 200 H470" stroke="${C.green}" stroke-width="4" stroke-linecap="round"/><path d="M458 190 L470 200 L458 210" stroke="${C.green}" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>`
      + `<g class="p4" ${dl(.6)}>${smile}</g>`
      + `<g class="p4" ${dl(1.1)}>${T(542, 300, '해석', { size: 30, color: C.green })}</g>`;
    put('6-1/수학/5/해석', svg(id, body, motion(id) + `
      .sc-${id} .out{transition:transform .6s cubic-bezier(.3,1.6,.6,1) .2s}
      .on2 .sc-${id} .out{transform:translate(${f(mid[0])}px,${f(mid[1])}px)}
      .on2 .sc-${id} .out .sec{animation:${id}-blink 1.4s ease-in-out .8s both}
    `));
  }
})(typeof window !== 'undefined' ? window : globalThis);
