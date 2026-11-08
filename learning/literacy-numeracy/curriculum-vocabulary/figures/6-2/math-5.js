// 수학 6-2 5단원 원의 둘레와 넓이: 낱말 도식
// 원은 끈으로 그리고, 둘레는 굴리거나 끈을 펴서 곧은 선으로 보인다.
(function (root) {
  'use strict';
  const { C, svg, text, put } = root.FigureKit;
  const f = (n) => +(+n).toFixed(1);
  const px = (n) => `${f(n)}px`;
  const rad = (d) => d * Math.PI / 180;
  const on = (cx, cy, r, deg) => [cx + r * Math.cos(rad(deg)), cy + r * Math.sin(rad(deg))];
  const seg = (p, q, a = '') => `<path d="M${f(p[0])} ${f(p[1])} L${f(q[0])} ${f(q[1])}" ${a}/>`;
  const dot = (p, r = 6, fill = C.ink) => `<circle cx="${f(p[0])}" cy="${f(p[1])}" r="${r}" fill="${fill}"/>`;
  // 오른쪽(각 0)에서 시작해 시계 방향으로 한 바퀴 도는 원 경로
  const ring = (cx, cy, r, start = 0) => {
    const a = on(cx, cy, r, start), b = on(cx, cy, r, start + 180);
    return `M${f(a[0])} ${f(a[1])} A${r} ${r} 0 1 1 ${f(b[0])} ${f(b[1])} A${r} ${r} 0 1 1 ${f(a[0])} ${f(a[1])}`;
  };
  const DRAW = (id) => `.sc-${id} .dr{stroke-dasharray:1 1;stroke-dashoffset:1}`;

  // 원의 중심: 못에 맨 끈을 팽팽히 돌려 원을 그림 → 중심에서 원 위 여러 점까지 같은 길이 → 가운데 점이 반짝
  {
    const id = 't62-m5-jungsim';
    const cx = 230, cy = 180, r = 125;
    const angles = [-120, -60, 0, 60, 120, 180];
    const spokes = angles.map((a, i) => {
      const p = on(cx, cy, r, a), m = on(cx, cy, r / 2, a), n = [-Math.sin(rad(a)) * 9, Math.cos(rad(a)) * 9];
      return `<g class="sp" style="--d:${f(0.2 + 0.25 * i)}s">${seg([cx, cy], p, `stroke="${C.orange}" stroke-width="4" stroke-linecap="round"`)}`
        + seg([m[0] - n[0], m[1] - n[1]], [m[0] + n[0], m[1] + n[1]], `stroke="${C.orange}" stroke-width="3" stroke-linecap="round"`)
        + dot(p, 5, C.orange) + '</g>';
    }).join('');
    const body = `<path class="dr cir" pathLength="1" d="${ring(cx, cy, r)}" stroke="${C.ink}" stroke-width="4" fill="${C.paper}"/>`
      + `<g class="h2"><g class="arm">${seg([cx, cy], [cx + r, cy], `stroke="${C.muted}" stroke-width="3"`)}<circle cx="${cx + r}" cy="${cy}" r="8" fill="${C.orange}"/></g></g>`
      + `<g class="b2">${spokes}</g>`
      + `<g class="b3"><g class="ring"><circle cx="${cx}" cy="${cy}" r="14" fill="none" stroke="${C.red}" stroke-width="3.5"/></g>`
      + `<path d="M392 118 L250 168" stroke="${C.red}" stroke-width="3" stroke-linecap="round"/>${text(400, 116, '원의 중심', { size: 26, anchor: 'start', color: C.red })}</g>`
      + dot([cx, cy], 7, C.ink);
    put('6-2/수학/5/원의 중심', svg(id, body, `
      ${DRAW(id)}
      .sc-${id} .cir{fill-opacity:0}
      .on1 .sc-${id} .cir{stroke-dashoffset:0;fill-opacity:1;transition:stroke-dashoffset 1.8s linear .2s,fill-opacity .4s ease 2s}
      .sc-${id} .arm{transform-box:view-box;transform-origin:${cx}px ${cy}px}
      .on1 .sc-${id} .arm{transform:rotate(360deg);transition:transform 1.8s linear .2s}
      .sc-${id} .sp{transform-box:view-box;transform-origin:${cx}px ${cy}px;transform:scale(0)}
      .on2 .sc-${id} .sp{transform:none;transition:transform .35s ease-out var(--d)}
      .sc-${id} .ring{transform-box:fill-box;transform-origin:center}
      .on3 .sc-${id} .ring{animation:${id}-ring 1.2s ease-in-out infinite}
      @keyframes ${id}-ring{0%,100%{transform:scale(1)}50%{transform:scale(1.5)}}
    `));
  }

  // 지름: 원 위 두 점을 잇는 선분 여럿 → 중심을 지나는 선분, 윗반원을 접으면 아랫반원과 꼭 맞음 → 그 선분이 돌며 여러 지름
  {
    const id = 't62-m5-jireum';
    const cx = 220, cy = 180, r = 125;
    const chords = [[200, 300], [20, 130], [235, 5]].map(([a, b], i) => {
      const p = on(cx, cy, r, a), q = on(cx, cy, r, b);
      return `<g class="ch">${seg(p, q, `class="dr" pathLength="1" style="--d:${f(0.2 + 0.5 * i)}s" stroke="${C.blue}" stroke-width="4" stroke-linecap="round"`)}<g class="ep" style="--d:${f(0.2 + 0.5 * i)}s">${dot(p, 5, C.blue)}${dot(q, 5, C.blue)}</g></g>`;
    }).join('');
    const half = (top) => `M${cx - r} ${cy} A${r} ${r} 0 0 ${top ? 1 : 0} ${cx + r} ${cy} Z`;
    const dia = (deg, cls = '') => seg(on(cx, cy, r, deg), on(cx, cy, r, deg + 180), `class="${cls}" stroke="${C.orange}" stroke-width="5" stroke-linecap="round"`);
    const copies = [45, 90, 135].map((a, i) => `<g class="cp" style="--d:${f(0.2 + 0.5 * (i + 1))}s">${dia(a)}</g>`).join('');
    const body = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${C.paper}" stroke="${C.ink}" stroke-width="4"/>`
      + `<g class="b2"><path d="${half(false)}" fill="${C.sky}"/><g class="fold"><path d="${half(true)}" fill="${C.mint}" fill-opacity=".85" stroke="${C.green}" stroke-width="2.5"/></g></g>`
      + `<g class="dim">${chords}</g>`
      + `<g class="b2">${dia(0, 'dr dd')}</g>`
      + `<g class="b3">${copies}<g class="spin">${dia(0)}</g>${text(cx + r + 14, cy + 8, '지름', { size: 26, anchor: 'start', color: C.orange })}</g>`
      + `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${C.ink}" stroke-width="4"/>` + dot([cx, cy], 6);
    put('6-2/수학/5/지름', svg(id, body, `
      ${DRAW(id)}
      .on1 .sc-${id} .ch .dr{stroke-dashoffset:0;transition:stroke-dashoffset .5s ease var(--d)}
      .sc-${id} .ep{opacity:0}
      .on1 .sc-${id} .ep{opacity:1;transition:opacity .2s ease var(--d)}
      .on2 .sc-${id} .dim{opacity:.3;transition:opacity .4s ease}
      .on2 .sc-${id} .dd{stroke-dashoffset:0;transition:stroke-dashoffset .5s ease .2s}
      .sc-${id} .fold{transform-box:view-box;transform-origin:${cx}px ${cy}px}
      .on2 .sc-${id} .fold{animation:${id}-fold 1s ease-in-out .8s both}
      .on3 .sc-${id} .fold{animation:${id}-unfold .6s ease-in-out both}
      @keyframes ${id}-fold{from{transform:scaleY(1)}to{transform:scaleY(-1)}}
      @keyframes ${id}-unfold{from{transform:scaleY(-1)}to{transform:scaleY(1)}}
      .sc-${id} .spin{transform-box:view-box;transform-origin:${cx}px ${cy}px}
      .on3 .sc-${id} .spin{animation:${id}-spin 2s linear .2s both}
      @keyframes ${id}-spin{from{transform:rotate(0deg)}to{transform:rotate(180deg)}}
      .sc-${id} .cp{opacity:0}
      .on3 .sc-${id} .cp{opacity:1;transition:opacity .15s linear var(--d)}
    `));
  }

  // 반지름: 중심과 원 위 한 점을 잇는 선분 → 그 선분이 한 바퀴 돌며 자국을 남김 → 첫 선분에 이름
  {
    const id = 't62-m5-banjireum';
    const cx = 230, cy = 180, r = 125, a0 = -40;
    const hand = (deg, color = C.orange) => seg([cx, cy], on(cx, cy, r, deg), `stroke="${color}" stroke-width="5" stroke-linecap="round"`) + dot(on(cx, cy, r, deg), 6, color);
    const marks = Array.from({ length: 7 }, (_, j) => `<g class="cp" style="--d:${f(0.2 + 2 * (j + 1) / 8)}s">${hand(a0 + 45 * (j + 1))}</g>`).join('');
    const tip = on(cx, cy, r + 46, a0);
    const body = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${C.paper}" stroke="${C.ink}" stroke-width="4"/>`
      + `<g class="b2">${marks}<g class="sweep">${hand(a0)}</g></g>`
      + `<g class="first"><g class="grow">${hand(a0)}</g></g>`
      + `<g class="b3">${text(f(tip[0]), f(tip[1] + 8), '반지름', { size: 26, color: C.red })}</g>`
      + dot([cx, cy], 7);
    put('6-2/수학/5/반지름', svg(id, body, `
      .sc-${id} .grow{transform-box:view-box;transform-origin:${cx}px ${cy}px;transform:scale(0)}
      .on1 .sc-${id} .grow{transform:none;transition:transform .7s ease-out .3s}
      .sc-${id} .sweep{transform-box:view-box;transform-origin:${cx}px ${cy}px}
      .on2 .sc-${id} .sweep{animation:${id}-sweep 2s linear .2s both}
      @keyframes ${id}-sweep{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
      .sc-${id} .cp{opacity:0}
      .on2 .sc-${id} .cp{opacity:1;transition:opacity .1s linear var(--d)}
      .on3 .sc-${id} .first path{stroke:${C.red};transition:stroke .4s ease}
      .on3 .sc-${id} .first circle{fill:${C.red};transition:fill .4s ease}
      .on3 .sc-${id} .grow{animation:${id}-blink 1.2s ease-in-out .3s infinite}
      @keyframes ${id}-blink{50%{opacity:.35}}
    `));
  }

  // 원주: 둘레를 색칠 → 원을 곧은 선 위에서 한 바퀴 굴리면 둘레가 곧게 펴짐 → 그 길이가 원주
  {
    const id = 't62-m5-wonju';
    const cx = 90, cy = 140, r = 62, L = 2 * Math.PI * r;
    const loop = `M${cx} ${cy + r} A${r} ${r} 0 1 1 ${cx} ${cy - r} A${r} ${r} 0 1 1 ${cx} ${cy + r}`;
    const body = `<path d="M40 ${cy + r} H600" stroke="${C.line}" stroke-width="3"/>`
      + `<g class="b2"><circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${C.muted}" stroke-width="2.5" stroke-dasharray="7 6"/></g>`
      + `<g class="flat"><path d="M${cx} ${cy + r} H${f(cx + L)}" stroke="${C.orange}" stroke-width="7" stroke-linecap="round"/></g>`
      + `<g class="roll"><circle cx="${cx}" cy="${cy}" r="${r}" fill="${C.sky}" stroke="${C.ink}" stroke-width="3"/>`
      + `<path class="arc" pathLength="1" d="${loop}" stroke="${C.orange}" stroke-width="7" fill="none"/>`
      + `<path d="M${cx} ${cy} L${cx} ${cy + r}" stroke="${C.muted}" stroke-width="2.5"/>${dot([cx, cy + r], 7, C.red)}</g>`
      + `<g class="b1">${`<path d="M${cx} ${cy + r - 12} V${cy + r + 12}" stroke="${C.red}" stroke-width="3"/>`}</g>`
      + `<g class="b3"><path d="M${cx} ${cy + r + 18} V${cy + r + 30} H${f(cx + L)} V${cy + r + 18}" stroke="${C.orange}" stroke-width="3.5" fill="none" stroke-linejoin="round"/>`
      + `${text(f(cx + L / 2), cy + r + 64, '원주', { size: 28, color: C.orange })}</g>`;
    put('6-2/수학/5/원주', svg(id, body, `
      .sc-${id} .arc{stroke-dasharray:1 1;stroke-dashoffset:1}
      .on1 .sc-${id} .arc{stroke-dashoffset:0;transition:stroke-dashoffset 1.4s linear .3s}
      .on2 .sc-${id} .arc{stroke-dashoffset:1;transition:stroke-dashoffset 1.8s linear .2s}
      .sc-${id} .roll{transform-box:view-box;transform-origin:${cx}px ${cy}px;transform:translateX(0px) rotate(0deg)}
      .on2 .sc-${id} .roll{transform:translateX(${f(L)}px) rotate(360deg);transition:transform 1.8s linear .2s}
      .sc-${id} .flat{transform-box:view-box;transform-origin:${cx}px ${cy + r}px;transform:scaleX(0)}
      .on2 .sc-${id} .flat{transform:none;transition:transform 1.8s linear .2s}
      .on3 .sc-${id} .flat{animation:${id}-glow 1.2s ease-in-out .5s 2}
      @keyframes ${id}-glow{50%{opacity:.4}}
    `));
  }

  // 원주율: 큰 원에 끈을 감음 → 끈을 펴고 지름을 대면 3개와 조금 → 작은 원도 3개와 조금 → 원주 ÷ 지름 = 3.14…
  {
    const id = 't62-m5-wonjuyul';
    // 한 줄: 원 (cx, cy, r), 끈은 원 아래 점에서 오른쪽으로 펴진다
    const row = (cx, cy, r, key) => {
      const L = 2 * Math.PI * r, d = 2 * r, y = cy + r, by = y + 14;
      const loop = `M${cx} ${y} A${r} ${r} 0 1 1 ${cx} ${cy - r} A${r} ${r} 0 1 1 ${cx} ${y}`;
      let bars = '';
      for (let i = 0; i < 3; i++) {
        const x0 = cx + d * i;
        bars += `<g class="bar ${key}" style="--dx:${px(cx - r - x0)};--dy:${px(cy - 5 - by)};--d:${i}">`
          + `<rect x="${f(x0 + 1)}" y="${by}" width="${d - 2}" height="10" rx="4" fill="${C.blue}"/>`
          + text(f(x0 + d / 2), by + 36, i + 1, { size: 20, color: C.blue }) + '</g>';
      }
      return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${C.paper}" stroke="${C.ink}" stroke-width="3"/>`
        + `<path d="M${cx - r} ${cy} H${cx + r}" stroke="${C.blue}" stroke-width="5" stroke-linecap="round"/>`
        + `<g class="str ${key}"><path class="arc" pathLength="1" d="${loop}" stroke="${C.orange}" stroke-width="6" fill="none"/></g>`
        + `<g class="flat ${key}" style="transform-origin:${cx}px ${y}px"><path d="M${cx} ${y} H${f(cx + L)}" stroke="${C.orange}" stroke-width="6" stroke-linecap="round"/></g>`
        + bars
        + `<g class="left ${key}"><rect x="${f(cx + 3 * d)}" y="${by - 3}" width="${f(L - 3 * d)}" height="16" rx="3" fill="${C.red}"/></g>`;
    };
    const big = row(70, 78, 50, 'r1'), small = row(70, 245, 32, 'r2');
    const body = big + small
      + `<g class="b4"><g class="v v0">${text(530, 62, '원주 ÷ 지름', { size: 26, color: C.ink })}</g>`
      + `<g class="v v1">${text(530, 150, '3.14…', { size: 34, color: C.orange })}</g><g class="v v2">${text(530, 300, '3.14…', { size: 34, color: C.orange })}</g></g>`;
    // 칸 n 에서 감기 → 펴기 → 지름 대기 순서(시각 t0 부터)
    const steps = (key, wrapN, wrap0, wrapT, unrollN, un0, unT, bar0, barStep) => `
      .on${wrapN} .sc-${id} .str.${key} .arc{stroke-dashoffset:0;transition:stroke-dashoffset ${wrapT}s linear ${wrap0}s}
      .on${unrollN} .sc-${id} .str.${key} .arc{stroke-dashoffset:1;transition:stroke-dashoffset ${unT}s linear ${un0}s}
      .on${unrollN} .sc-${id} .flat.${key}{transform:none;transition:transform ${unT}s linear ${un0}s}
      .on${unrollN} .sc-${id} .bar.${key}{opacity:1;transform:none;transition:transform .35s ease calc(${bar0}s + var(--d) * ${barStep}s),opacity .1s linear calc(${bar0}s + var(--d) * ${barStep}s)}
      .on${unrollN} .sc-${id} .left.${key}{animation:${id}-blink .6s ease ${f(bar0 + 3 * barStep + 0.1)}s 3 both}`;
    put('6-2/수학/5/원주율', svg(id, body, `
      .sc-${id} .arc{stroke-dasharray:1 1;stroke-dashoffset:1}
      .sc-${id} .flat{transform-box:view-box;transform:scaleX(0)}
      .sc-${id} .bar{opacity:0;transform:translate(var(--dx),var(--dy))}
      .sc-${id} .left{opacity:0}
      @keyframes ${id}-blink{0%{opacity:0}50%{opacity:1}100%{opacity:1}}
      ${steps('r1', 1, .3, 1.4, 2, .1, 1.1, 1.2, .25)}
      .on3 .sc-${id} .str.r2 .arc{animation:${id}-wrap 1.3s linear .1s both}
      @keyframes ${id}-wrap{0%{stroke-dashoffset:1}46%,54%{stroke-dashoffset:0}100%{stroke-dashoffset:1}}
      .on3 .sc-${id} .flat.r2{animation:${id}-flat 1.3s linear .1s both}
      @keyframes ${id}-flat{0%,54%{transform:scaleX(0)}100%{transform:scaleX(1)}}
      .on3 .sc-${id} .bar.r2{opacity:1;transform:none;transition:transform .35s ease calc(1.4s + var(--d) * .15s),opacity .1s linear calc(1.4s + var(--d) * .15s)}
      .on3 .sc-${id} .left.r2{animation:${id}-blink .6s ease 1.95s 3 both}
      .sc-${id} .v{opacity:0;transform:translateY(10px)}
      .on4 .sc-${id} .v{opacity:1;transform:none}
      .on4 .sc-${id} .v0{transition:all .4s ease .2s}
      .on4 .sc-${id} .v1{transition:all .4s ease .7s}
      .on4 .sc-${id} .v2{transition:all .4s ease 1.1s}
    `));
  }
})(typeof window !== 'undefined' ? window : globalThis);
