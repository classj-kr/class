// 수학 5-2 6단원 평균과 가능성: 낱말 도식
(function (root) {
  'use strict';
  const { C, svg, text, arrow, put } = root.FigureKit;
  const TONES = [[C.sky, C.blue], [C.peach, C.orange], [C.lilac, C.purple], [C.mint, C.green]];

  // 평균: 6, 9, 8, 5 → 9에서 2칸, 8에서 1칸을 낮은 막대로 → 모두 7
  {
    const base = 318, u = 26, w = 70, xs = [150, 260, 370, 480], vals = [6, 9, 8, 5];
    const top = (n) => base - n * u;
    // 옮길 칸: [막대, 몇 번째 칸, 가는 막대, 가는 칸, 늦춤]
    const moves = [[1, 9, 3, 6, 0.3], [1, 8, 3, 7, 0.9], [2, 8, 0, 7, 0.9]];
    let blocks = '';
    vals.forEach((v, bi) => {
      const [fill, stroke] = TONES[bi];
      for (let k = 1; k <= v; k++) {
        const mv = moves.find((m) => m[0] === bi && m[1] === k);
        const rect = `<rect x="${xs[bi] + 1.5}" y="${top(k) + 1.5}" width="${w - 3}" height="${u - 3}" rx="3" fill="${fill}" stroke="${stroke}" stroke-width="3"/>`;
        if (!mv) { blocks += rect; continue; }
        const dx = xs[mv[2]] - xs[bi], dy = top(mv[3]) - top(k), lift = 44 - top(k);
        blocks += `<g class="mv" style="--dx:${dx}px;--dy:${dy}px;--lift:${lift}px;--d:${mv[4]}s">${rect}</g>`;
      }
    });
    const nums = vals.map((v, i) => text(xs[i] + w / 2, top(v) - 12, v, { size: 24 })).join('');
    const body = `<path d="M120 ${base} H580" stroke="${C.ink}" stroke-width="3"/>` + blocks
      + `<g class="h2">${nums}</g>`
      + `<g class="b3"><path class="avg" d="M124 ${top(7)} H560" stroke="${C.red}" stroke-width="3" stroke-dasharray="10 7"/>${text(586, top(7) + 9, 7, { size: 28, color: C.red })}</g>`;
    put('5-2/수학/6/평균', svg('m6-mean', body, `
      .on2 .sc-m6-mean .mv{animation:m6m-move .7s ease-in-out var(--d) both}
      @keyframes m6m-move{0%{transform:none}30%{transform:translate(0,var(--lift))}70%{transform:translate(var(--dx),var(--lift))}100%{transform:translate(var(--dx),var(--dy))}}
      .sc-m6-mean .avg{stroke-dashoffset:0}
      .on3 .sc-m6-mean .avg{animation:m6m-run 1.6s linear infinite}
      @keyframes m6m-run{to{stroke-dashoffset:-34}}
    `));
  }

  // 자룟값: 닷새 동안 읽은 쪽수 막대 → 12, 15, 9, 20, 14가 하나씩 → 카드로 떨어져 나와 한 줄
  {
    const base = 300, k = 9, w = 52, vals = [12, 15, 9, 20, 14], days = ['월', '화', '수', '목', '금'];
    const xs = [160, 240, 320, 400, 480];
    let bars = '', nums = '', cards = '';
    vals.forEach((v, i) => {
      const t = base - v * k, x = xs[i];
      bars += `<g class="bar" style="transform-origin:${x}px ${base}px;--d:${(0.12 * i + 0.1).toFixed(2)}s"><rect x="${x - w / 2}" y="${t}" width="${w}" height="${v * k}" rx="3" fill="${C.sky}" stroke="${C.blue}" stroke-width="3"/></g>`;
      bars += text(x, 328, days[i], { size: 18, color: C.muted });
      nums += `<g class="nm" style="--d:${(0.3 * i + 0.1).toFixed(2)}s;--up:${(52 - (t - 12)).toFixed(0)}px">${text(x, t - 12, v, { size: 24 })}</g>`;
      cards += `<g class="cd" style="--d:${(0.12 * i).toFixed(2)}s"><rect x="${x - 30}" y="24" width="60" height="42" rx="8" fill="${C.peach}" stroke="${C.orange}" stroke-width="3"/></g>`;
    });
    const body = `<path d="M110 ${base} H530" stroke="${C.ink}" stroke-width="3"/>` + bars + cards + nums;
    put('5-2/수학/6/자룟값', svg('m6-values', body, `
      .sc-m6-values .bar{transform:scaleY(0)}
      .on1 .sc-m6-values .bar{transform:none;transition:transform .5s ease-out var(--d)}
      .sc-m6-values .nm{opacity:0;transform:translateY(12px)}
      .on2 .sc-m6-values .nm{opacity:1;transform:none;transition:opacity .3s ease var(--d),transform .4s cubic-bezier(.3,1.6,.6,1) var(--d)}
      .on3 .sc-m6-values .nm{transform:translateY(var(--up));transition:transform .6s cubic-bezier(.4,0,.2,1) calc(var(--d) * .4)}
      .sc-m6-values .cd{opacity:0}
      .on3 .sc-m6-values .cd{opacity:1;transition:opacity .3s ease calc(var(--d) + .5s)}
    `));
  }

  // 자료 수: 8, 3, 6, 7, 6 막대 → 아래에 1~5 → (8+3+6+7+6)÷5=6
  {
    const base = 278, k = 20, w = 50, vals = [8, 3, 6, 7, 6], xs = [170, 245, 320, 395, 470];
    const tone = [TONES[0], TONES[2], TONES[3], TONES[1], TONES[3]];
    let bars = '', nos = '';
    vals.forEach((v, i) => {
      const t = base - v * k, x = xs[i];
      bars += `<rect x="${x - w / 2}" y="${t}" width="${w}" height="${v * k}" rx="3" fill="${tone[i][0]}" stroke="${tone[i][1]}" stroke-width="3"/>` + text(x, t - 10, v, { size: 24 });
      nos += `<g class="no" style="--d:${(0.3 * i + 0.1).toFixed(2)}s"><circle cx="${x}" cy="306" r="16" fill="${C.ink}"/>${text(x, 313, i + 1, { size: 19, color: C.paper })}</g>`;
    });
    const body = `<path d="M130 ${base} H510" stroke="${C.ink}" stroke-width="3"/>` + bars
      + `<g class="b2">${nos}</g>`
      + `<g class="b3"><g class="eq">${text(320, 56, `(8+3+6+7+6)÷<tspan fill="${C.orange}">5</tspan>=6`, { size: 32 })}</g></g>`;
    put('5-2/수학/6/자료 수', svg('m6-count', body, `
      .sc-m6-count .no{transform-box:fill-box;transform-origin:center;transform:scale(0)}
      .on2 .sc-m6-count .no{transform:none;transition:transform .35s cubic-bezier(.3,1.6,.6,1) var(--d)}
      .sc-m6-count .eq{transform:translateY(-10px)}
      .on3 .sc-m6-count .eq{transform:none;transition:transform .5s ease .1s}
    `));
  }

  // 가능성: 0~1 띠, 흰 공만 든 주머니 → 0 / 빨간 공만 든 주머니 → 1 / 반반 주머니 → 2분의 1, 말 세 개
  {
    const bag = (bx, balls) => {
      const body = `<path d="M${bx - 44} 88 Q${bx - 50} 146 ${bx} 146 Q${bx + 50} 146 ${bx + 44} 88 Q${bx + 40} 64 ${bx + 16} 58 L${bx - 16} 58 Q${bx - 40} 64 ${bx - 44} 88 Z" fill="${C.mint}" stroke="${C.green}" stroke-width="3"/>`
        + `<path d="M${bx - 14} 58 L${bx - 22} 40 L${bx + 22} 40 L${bx + 14} 58" fill="${C.mint}" stroke="${C.green}" stroke-width="3" stroke-linejoin="round"/>`;
      const at = [[-17, 92], [17, 92], [-17, 122], [17, 122]];
      return body + balls.map((r, i) => `<circle cx="${bx + at[i][0]}" cy="${at[i][1]}" r="13" fill="${r ? C.red : C.paper}" stroke="${r ? C.red : C.muted}" stroke-width="2.5"/>`).join('');
    };
    const X = [100, 320, 540];
    const tick = (x) => `<path d="M${x} 188 V220" stroke="${C.ink}" stroke-width="3"/>`;
    const half = text(X[1], 244, 1, { size: 20 }) + `<path d="M${X[1] - 9} 251 H${X[1] + 9}" stroke="${C.ink}" stroke-width="2.5"/>` + text(X[1], 272, 2, { size: 20 });
    const word = (x, s) => text(x, 314, s, { size: 19, color: C.green });
    const set = (x, balls, mark, cls) => `<g class="${cls}"><g class="bg">${bag(x, balls)}</g><g class="ar" style="transform-origin:${x}px 152px">${arrow(x, 152, x, 184, C.orange, '', 4)}</g>${mark}</g>`;
    const body = `<rect x="${X[0]}" y="196" width="${X[2] - X[0]}" height="16" rx="8" fill="${C.sky}" stroke="${C.blue}" stroke-width="2.5"/>`
      + tick(X[0])
      + set(X[0], [0, 0, 0, 0], text(X[0], 252, 0, { size: 22 }), 'b1 s1')
      + set(X[2], [1, 1, 1, 1], tick(X[2]) + text(X[2], 252, 1, { size: 22 }), 'b2 s2')
      + set(X[1], [1, 0, 0, 1], tick(X[1]) + half, 'b3 s3')
      + `<g class="b3"><g class="wd">${word(X[0], '불가능하다')}${word(X[1], '반반이다')}${word(X[2], '확실하다')}</g></g>`;
    put('5-2/수학/6/가능성', svg('m6-chance', body, `
      .sc-m6-chance .bg{transform:translateY(-24px)}
      .sc-m6-chance .ar{transform:scaleY(0)}
      .on1 .sc-m6-chance .s1 .bg,.on2 .sc-m6-chance .s2 .bg,.on3 .sc-m6-chance .s3 .bg{transform:none;transition:transform .5s cubic-bezier(.3,1.5,.6,1) .1s}
      .on1 .sc-m6-chance .s1 .ar,.on2 .sc-m6-chance .s2 .ar,.on3 .sc-m6-chance .s3 .ar{transform:none;transition:transform .35s ease-out .6s}
      .sc-m6-chance .wd{opacity:0}
      .on3 .sc-m6-chance .wd{opacity:1;transition:opacity .4s ease 1s}
    `));
  }
})(typeof window !== 'undefined' ? window : globalThis);
