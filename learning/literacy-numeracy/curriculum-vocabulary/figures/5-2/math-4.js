// 수학 5-2 4단원 소수의 곱셈: 낱말 도식
(function (root) {
  'use strict';
  const { C, svg, text, arrow, numberLine, put } = root.FigureKit;

  // 소수점: 자리 칸 위 1.25 → ×10, 숫자가 한 칸씩 왼쪽으로 가 12.5 → 소수점이 반짝
  {
    const cols = ['십의 자리', '일의 자리', '소수 첫째 자리', '소수 둘째 자리'];
    const x0 = 48, cw = 136;
    let grid = `<rect x="${x0}" y="44" width="${cw * 4}" height="48" fill="${C.mint}"/>`
      + `<rect x="${x0}" y="44" width="${cw * 4}" height="168" fill="none" stroke="${C.line}" stroke-width="2.5"/>`
      + `<path d="M${x0} 92 H${x0 + cw * 4}" stroke="${C.line}" stroke-width="2.5"/>`;
    for (let i = 1; i < 4; i++) grid += `<path d="M${x0 + cw * i} 44 V212" stroke="${C.line}" stroke-width="2.5"/>`;
    cols.forEach((c, i) => { grid += text(x0 + cw * i + cw / 2, 75, c, { size: 17, color: C.green }); });
    const digits = [['1', 1], ['2', 2], ['5', 3]]
      .map(([d, col]) => text(x0 + cw * col + cw / 2, 178, d, { size: 64 })).join('');
    const body = grid
      + `<g class="dg">${digits}</g>`
      + `<g class="pt"><circle cx="${x0 + cw * 2}" cy="174" r="8" fill="${C.orange}"/></g>`
      + `<g class="ring"><circle cx="${x0 + cw * 2}" cy="174" r="16" fill="none" stroke="${C.orange}" stroke-width="3"/></g>`
      + `<g class="h2">${text(320, 292, '1.25', { size: 38 })}</g>`
      + `<g class="eq">${text(320, 292, `1.25 × 10 = 12.5`, { size: 38 })}</g>`
      + `<g class="b2"><g class="tm">${arrow(512, 238, 392, 238, C.orange, '', 4)}${text(562, 246, '× 10', { size: 24, color: C.orange })}</g></g>`;
    put('5-2/수학/4/소수점', svg('m4-point', body, `
      .on2 .sc-m4-point .dg{transform:translateX(-${cw}px);transition:transform .9s cubic-bezier(.5,0,.3,1) .4s}
      .sc-m4-point .eq{opacity:0}
      .on2 .sc-m4-point .eq{opacity:1;transition:opacity .4s ease 1.4s}
      .sc-m4-point .ring{opacity:0;transform-box:fill-box;transform-origin:center}
      .on3 .sc-m4-point .ring{animation:m4p-ring 1.3s ease-out infinite}
      @keyframes m4p-ring{0%{opacity:.9;transform:scale(.6)}100%{opacity:0;transform:scale(1.8)}}
      .on3 .sc-m4-point .pt circle{fill:${C.red}}
    `));
  }

  // 곱: 0~6 수직선 위에 1.5 막대 4개를 잇기 → 전체 6 → 1.5×4=6
  {
    const nl = numberLine(0, 6, { y: 214, x0: 70, x1: 570 });
    let minor = '';
    for (let i = 0; i < 6; i++) minor += `<path d="M${nl.at(i + 0.5)} 208 V220" stroke="${C.ink}" stroke-width="2"/>`;
    const bars = [0, 1, 2, 3].map((i) => {
      const a = nl.at(1.5 * i), b = nl.at(1.5 * (i + 1));
      const [fill, stroke] = i % 2 ? [C.peach, C.orange] : [C.sky, C.blue];
      return `<g class="bar" style="transform-origin:${a}px 172px;--d:${(0.45 * i + 0.2).toFixed(2)}s"><rect x="${a + 1.5}" y="152" width="${b - a - 3}" height="40" rx="6" fill="${fill}" stroke="${stroke}" stroke-width="3"/>${text((a + b) / 2, 179, '1.5', { size: 20 })}</g>`;
    }).join('');
    const halves = [1.5, 4.5].map((n) => `<g class="hv">${text(nl.at(n), 248, n, { size: 17, color: C.orange })}</g>`).join('');
    const brace = `<path d="M72 140 Q72 128 84 128 H308 Q320 128 320 116 Q320 128 332 128 H556 Q568 128 568 140" stroke="${C.orange}" stroke-width="3.5" fill="none" stroke-linejoin="round"/>`;
    const body = nl.body + minor + bars + halves
      + `<g class="b2"><g class="br">${brace}${text(320, 104, 6, { size: 30, color: C.orange })}</g></g>`
      + `<g class="b3">${text(320, 312, `1.5 × 4 = <tspan fill="${C.orange}">6</tspan>`, { size: 36 })}</g>`;
    put('5-2/수학/4/곱', svg('m4-product', body, `
      .sc-m4-product .bar{transform:scaleX(0)}
      .on1 .sc-m4-product .bar{transform:none;transition:transform .4s ease-out var(--d)}
      .sc-m4-product .hv{opacity:0}
      .on1 .sc-m4-product .hv{opacity:1;transition:opacity .3s ease 1.9s}
      .sc-m4-product .br{transform-origin:320px 128px;transform:scaleX(.2)}
      .on2 .sc-m4-product .br{transform:none;transition:transform .6s ease-out .1s}
    `));
  }

  // 곱해지는 수: 3.5×2=7에서 3.5 → 둘 다 ×10, 35×2=70 → × 앞 자리 표시
  {
    const row = (y, a, c, cls) => `<g class="${cls}">${text(200, y, a, { size: 48 })}${text(280, y, '×', { size: 48 })}${text(340, y, 2, { size: 48 })}${text(400, y, '=', { size: 48 })}${text(460, y, c, { size: 48 })}</g>`;
    const down = (x) => `<g class="dn" style="transform-origin:${x}px 168px">${arrow(x, 168, x, 252, C.orange, '', 4)}</g>`;
    const body = `<ellipse cx="200" cy="133" rx="54" ry="34" fill="${C.peach}" stroke="${C.orange}" stroke-width="3.5"/>`
      + row(150, '3.5', 7, '')
      + `<g class="b2">${down(200)}${down(460)}${text(178, 218, '×10', { size: 22, color: C.orange, anchor: 'end' })}${text(482, 218, '×10', { size: 22, color: C.orange, anchor: 'start' })}</g>`
      + `<g class="r2">${row(304, 35, 70, '')}</g>`
      + `<g class="b3"><g class="tag">${text(200, 52, '× 앞', { size: 22, color: C.orange })}${arrow(200, 62, 200, 94, C.orange, '', 3)}</g></g>`;
    put('5-2/수학/4/곱해지는 수', svg('m4-multiplicand', body, `
      .sc-m4-multiplicand .dn{transform:scaleY(0)}
      .on2 .sc-m4-multiplicand .dn{transform:none;transition:transform .5s ease-out .2s}
      .sc-m4-multiplicand .r2{opacity:0;transform:translateY(-12px)}
      .on2 .sc-m4-multiplicand .r2{opacity:1;transform:none;transition:opacity .4s ease .8s,transform .4s ease .8s}
      .on3 .sc-m4-multiplicand .tag{animation:m4m-bob 1.2s ease-in-out infinite}
      @keyframes m4m-bob{0%,100%{transform:none}50%{transform:translateY(-6px)}}
    `));
  }

  // 곱하는 수: 3×0.7=2.1에서 0.7 → 길이 3 막대의 10칸 중 7칸 → × 뒤 자리 표시, 칠한 길이와 3 비교
  {
    const eq = `${text(180, 128, 3, { size: 46 })}${text(250, 128, '×', { size: 46 })}${text(340, 128, '0.7', { size: 46 })}${text(430, 128, '=', { size: 46 })}${text(510, 128, '2.1', { size: 46 })}`;
    const x0 = 80, cell = 48;
    let cells = '';
    for (let i = 0; i < 7; i++) cells += `<rect class="cl" x="${x0 + cell * i}" y="168" width="${cell}" height="40" fill="${C.peach}" style="--d:${(0.15 * i + 0.4).toFixed(2)}s"/>`;
    let ticks = '';
    for (let i = 1; i < 10; i++) ticks += `<path d="M${x0 + cell * i} 168 V208" stroke="${C.ink}" stroke-width="${i === 7 ? 3 : 1.5}"${i === 7 ? '' : ` stroke-opacity=".55"`}/>`;
    const bar = `<rect x="${x0}" y="168" width="${cell * 10}" height="40" fill="${C.paper}"/>` + cells + ticks
      + `<rect x="${x0}" y="168" width="${cell * 10}" height="40" fill="none" stroke="${C.ink}" stroke-width="3"/>`
      + text(x0, 236, 0, { size: 18, color: C.muted }) + text(x0 + cell * 10, 236, 3, { size: 18 })
      + `<g class="lb">${text(x0 + cell * 7, 236, '2.1', { size: 20, color: C.orange })}</g>`;
    const cmp = `<path class="ln" d="M${x0} 272 H${x0 + cell * 7}" stroke="${C.orange}" stroke-width="6" stroke-linecap="round"/>`
      + `<path d="M${x0} 304 H${x0 + cell * 10}" stroke="${C.ink}" stroke-width="6" stroke-linecap="round"/>`
      + `<path d="M${x0 + cell * 7} 246 V272 M${x0 + cell * 10} 246 V304" stroke="${C.muted}" stroke-width="2" stroke-dasharray="5 4"/>`;
    const body = `<ellipse cx="340" cy="111" rx="52" ry="32" fill="${C.peach}" stroke="${C.orange}" stroke-width="3.5"/>` + eq
      + `<g class="b2">${bar}</g>`
      + `<g class="b3"><g class="tag">${text(340, 44, '× 뒤', { size: 22, color: C.orange })}${arrow(340, 52, 340, 76, C.orange, '', 3)}</g>${cmp}</g>`;
    put('5-2/수학/4/곱하는 수', svg('m4-multiplier', body, `
      .sc-m4-multiplier .cl{opacity:0}
      .on2 .sc-m4-multiplier .cl{opacity:1;transition:opacity .2s ease var(--d)}
      .sc-m4-multiplier .lb{opacity:0}
      .on2 .sc-m4-multiplier .lb{opacity:1;transition:opacity .3s ease 1.5s}
      .on3 .sc-m4-multiplier .tag{animation:m4x-bob 1.2s ease-in-out infinite}
      @keyframes m4x-bob{0%,100%{transform:none}50%{transform:translateY(-5px)}}
    `));
  }

  // 어림셈: 3.98 → 약 4 → 4×2=8, 수직선의 7.96과 8 → 3.98×2=7.96, 약 8
  {
    const T = (x, y, s, o = {}) => text(x, y, s, { size: 40, ...o });
    const rowA = T(150, 120, '3.98') + T(232, 120, '×') + T(282, 120, 2);
    const restA = T(332, 120, '=') + T(412, 120, '7.96', { color: C.orange });
    const rowB = T(150, 196, 4) + T(232, 196, '×') + T(282, 196, 2) + T(332, 196, '=') + T(382, 196, 8, { color: C.blue });
    const bubble = `<g class="bb"><rect x="104" y="28" width="92" height="40" rx="20" fill="${C.sky}" stroke="${C.blue}" stroke-width="3"/>`
      + `<path d="M142 67 L150 80 L158 67" fill="${C.sky}" stroke="${C.blue}" stroke-width="3" stroke-linejoin="round"/><path d="M143 66 H157" stroke="${C.sky}" stroke-width="4"/>`
      + text(150, 56, '약 4', { size: 22, color: C.blue }) + '</g>';
    const nl = numberLine(7, 9, { y: 290, x0: 100, x1: 540 });
    let minor = '';
    for (let i = 1; i < 20; i++) if (i % 10) minor += `<path d="M${nl.at(7 + i / 10)} 284 V296" stroke="${C.ink}" stroke-width="1.5"/>`;
    const dots = `<circle cx="${nl.at(7.96)}" cy="290" r="6" fill="${C.orange}"/><circle cx="${nl.at(8)}" cy="290" r="10" fill="none" stroke="${C.blue}" stroke-width="3"/>`
      + text(nl.at(7.96) - 10, 266, '7.96', { size: 20, color: C.orange, anchor: 'end' })
      + text(nl.at(8) + 10, 266, 8, { size: 20, color: C.blue, anchor: 'start' });
    const chip = `<rect x="486" y="84" width="104" height="50" rx="12" fill="${C.sky}" stroke="${C.blue}" stroke-width="3"/>` + text(538, 120, '약 8', { size: 28, color: C.blue });
    const body = rowA + `<g class="h2">${bubble}</g>`
      + `<g class="b2"><g class="rb">${rowB}</g><g class="nl">${nl.body}${minor}${dots}</g></g>`
      + `<g class="b3"><g class="ra">${restA}</g><g class="cp">${chip}</g></g>`;
    put('5-2/수학/4/어림셈', svg('m4-estimate', body, `
      .sc-m4-estimate .bb{opacity:0;transform:translateY(16px)}
      .on1 .sc-m4-estimate .bb{opacity:1;transform:none;transition:opacity .4s ease .3s,transform .5s cubic-bezier(.3,1.5,.6,1) .3s}
      .sc-m4-estimate .rb{transform:translateY(-40px)}
      .on2 .sc-m4-estimate .rb{transform:none;transition:transform .6s ease .1s}
      .sc-m4-estimate .nl{opacity:0}
      .on2 .sc-m4-estimate .nl{opacity:1;transition:opacity .5s ease .8s}
      .sc-m4-estimate .ra{opacity:0;transform:translateX(-20px)}
      .on3 .sc-m4-estimate .ra{opacity:1;transform:none;transition:opacity .4s ease .2s,transform .4s ease .2s}
      .sc-m4-estimate .cp{opacity:0}
      .on3 .sc-m4-estimate .cp{opacity:1;transition:opacity .4s ease .8s}
    `));
  }
})(typeof window !== 'undefined' ? window : globalThis);
