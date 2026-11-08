// 수학 5-2 1단원 수의 범위와 어림하기: 낱말 도식
(function (root) {
  'use strict';
  const { C, svg, text, numberLine, put } = root.FigureKit;
  const f = (n) => +n.toFixed(1);

  // 같이 쓰는 움직임(장면 id 를 붙여 이름이 겹치지 않게 한다)
  const motion = (id) => `
    .sc-${id} .pop { transform-box: fill-box; transform-origin: center; }
    .on1 .sc-${id} .pop1, .on2 .sc-${id} .pop2 { animation: ${id}-pop .5s ease-out both; }
    .sc-${id} .grow { stroke-dasharray: 1; stroke-dashoffset: 1; transition: stroke-dashoffset 1s ease-in-out; }
    .on2 .sc-${id} .grow2, .on1 .sc-${id} .grow1 { stroke-dashoffset: 0; }
    .on1 .sc-${id} .late1, .on2 .sc-${id} .late2, .on3 .sc-${id} .late3 { animation: ${id}-fin .35s ease-out both; }
    .on3 .sc-${id} .rise { animation: ${id}-rise .5s ease-out both; }
    .sc-${id} .ring { transform-box: fill-box; transform-origin: center; opacity: 0; }
    .on3 .sc-${id} .ring { animation: ${id}-ring 1s ease-out .9s both; }
    .on1 .sc-${id} .seq { animation: ${id}-fin .3s ease-out both; }
    .on3 .sc-${id} .seq3 { animation: ${id}-fin .3s ease-out both; }
    .sc-${id} .dg { transition: fill .4s ease; }
    .on2 .sc-${id} .dg2 { fill: ${C.orange}; }
    @keyframes ${id}-pop { 0% { transform: scale(0); } 70% { transform: scale(1.25); } 100% { transform: scale(1); } }
    @keyframes ${id}-fin { from { opacity: 0; } to { opacity: 1; } }
    @keyframes ${id}-rise { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
    @keyframes ${id}-ring { 0% { opacity: .9; transform: scale(1); } 100% { opacity: 0; transform: scale(2.8); } }
  `;
  const delay = (s) => `style="animation-delay:${s}s"`;

  // 점: 속이 찬 점(이상·이하)과 속이 빈 점(초과·미만)
  const dot = (x, y, filled, cls = 'pop1', d = 0) =>
    `<g class="pop ${cls}" ${delay(d)}><circle cx="${f(x)}" cy="${y}" r="11" fill="${filled ? C.orange : C.paper}" stroke="${C.orange}" stroke-width="4"/></g>`;
  const ring = (x, y) => `<circle class="ring" cx="${f(x)}" cy="${y}" r="13" fill="none" stroke="${C.orange}" stroke-width="4"/>`;
  const check = (x, y, d) => `<g class="rise" ${delay(d)}><path d="M${f(x - 10)} ${y} l7 8 l14 -17" stroke="${C.green}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none"/></g>`;
  const cross = (x, y, d) => `<g class="rise" ${delay(d)}><path d="M${f(x - 9)} ${y - 9} l18 18 M${f(x + 9)} ${y - 9} l-18 18" stroke="${C.red}" stroke-width="5" stroke-linecap="round" fill="none"/></g>`;
  // 굵은 색 선(그어지는 선)과 끝 화살촉
  const band = (xa, xb, y) => `<path class="grow grow2" pathLength="1" d="M${f(xa)} ${y} H${f(xb)}" stroke="${C.orange}" stroke-width="9" stroke-linecap="butt" fill="none"/>`;
  const head = (x, y, dir) => `<path class="late2" ${delay(.9)} d="M${x} ${y - 13} L${x + dir * 22} ${y} L${x} ${y + 13} Z" fill="${C.orange}"/>`;

  // 이상·이하·초과·미만: 한쪽 끝까지 뻗는 범위
  function ray(id, { from, n, filled, dir, marks, crossAt }) {
    const y = 200;
    const nl = numberLine(from, from + 10, { y, x0: 80, x1: 560 });
    const end = dir > 0 ? 584 : 56;
    const body = nl.body
      + `<g class="b2">${band(nl.at(n), end, y)}${head(end, y, dir)}</g>`
      + `<g class="b1">${dot(nl.at(n), y, filled)}</g>`
      + `<g class="b3">${marks.map((m, i) => check(nl.at(m), 162, .15 + i * .25)).join('')}`
      + (crossAt != null ? cross(nl.at(crossAt), 162, .15 + marks.length * .25) : ring(nl.at(n), y)) + `</g>`;
    put(`5-2/수학/1/${id[0]}`, svg(id[1], body, motion(id[1])));
  }
  ray(['이상', 'm1-isang'], { from: 20, n: 25, filled: true, dir: 1, marks: [25, 26, 28] });
  ray(['이하', 'm1-iha'], { from: 13, n: 18, filled: true, dir: -1, marks: [18, 17, 15] });
  ray(['초과', 'm1-chogwa'], { from: 10, n: 15, filled: false, dir: 1, marks: [16, 18], crossAt: 15 });
  ray(['미만', 'm1-miman'], { from: 3, n: 8, filled: false, dir: -1, marks: [7, 5], crossAt: 8 });

  // 수의 범위: 18 이상 22 미만
  (function () {
    const id = 'm1-range', y = 200;
    const nl = numberLine(15, 25, { y, x0: 80, x1: 560 });
    const body = nl.body
      + `<g class="b2">${band(nl.at(18), nl.at(22), y)}</g>`
      + `<g class="b1">${dot(nl.at(18), y, true)}${dot(nl.at(22), y, false, 'pop1', .6)}</g>`
      + `<g class="b3">${[18, 19, 20, 21].map((m, i) => check(nl.at(m), 162, .15 + i * .25)).join('')}${cross(nl.at(22), 162, 1.2)}</g>`;
    put('5-2/수학/1/수의 범위', svg(id, body, motion(id)));
  })();

  // 휘어진 화살표: 그어지는 곡선 + 끝 화살촉
  function curve(x1, y1, x2, y2, peak, color, cls) {
    const cx = (x1 + x2) / 2, cy = 2 * peak - (y1 + y2) / 2;
    const a = Math.atan2(y2 - cy, x2 - cx), l = 16;
    const p = (d) => `${f(x2 - l * Math.cos(a + d))} ${f(y2 - l * Math.sin(a + d))}`;
    return `<path class="grow ${cls}" pathLength="1" d="M${f(x1)} ${y1} Q${f(cx)} ${f(cy)} ${f(x2)} ${y2}" stroke="${color}" stroke-width="5" stroke-linecap="round" fill="none"/>`
      + `<path class="late${cls.slice(-1)}" ${delay(.9)} d="M${p(-0.45)} L${f(x2)} ${y2} L${p(0.45)} Z" fill="${color}" stroke="${color}" stroke-width="3" stroke-linejoin="round"/>`;
  }
  // 수 글자: 한 자리만 따로 색을 바꿀 수 있게 나눈다
  const digits = (x, y, num, i, { size = 22, cls = 'dg dg2', color = C.ink, tail = '', mark = '' } = {}) => {
    const s = String(num);
    return `<text x="${f(x)}" y="${y}" text-anchor="middle" font-size="${size}" font-weight="700" fill="${color}">${s.slice(0, i)}<tspan class="${cls}" ${mark ? `fill="${mark}"` : ''}>${s[i]}</tspan>${s.slice(i + 1)}${tail}</text>`;
  };

  // 올림·버림: 일의 자리를 올리거나 버린다
  function round(word, id, { from, n, target, extra }) {
    const y = 240;
    const nl = numberLine(from, from + 10, { y, x0: 90, x1: 550, label: 10 });
    const xn = nl.at(n), xt = nl.at(target);
    const body = nl.body
      + `<g class="b1">${dot(xn, y, true)}${digits(xn, y + 34, n, 2, { size: 21 })}</g>`
      + `<g class="b2">${curve(xn, y - 18, xt, y - 18, y - 92, C.orange, 'grow2')}<g class="pop pop2" ${delay(.9)}><circle cx="${f(xt)}" cy="${y}" r="15" fill="${C.orange}"/></g></g>`
      + `<g class="b3">${text(320, 92, `${n} → ${target}`, { size: 34 })}${extra ? text(320, 132, extra, { size: 22, color: C.muted, weight: 600 }) : ''}</g>`;
    put(`5-2/수학/1/${word}`, svg(id, body, motion(id)));
  }
  round('올림', 'm1-ollim', { from: 270, n: 271, target: 280, extra: '270 → 270' });
  round('버림', 'm1-beorim', { from: 430, n: 438, target: 430 });

  // 반올림: 2648 → 2600, 2650 → 2700
  (function () {
    const id = 'm1-banollim', y = 200;
    const nl = numberLine(2600, 2700, { y, x0: 90, x1: 550, every: 10, label: 50 });
    const a = nl.at(2648), b = nl.at(2650), lo = nl.at(2600), hi = nl.at(2700);
    const small = (x, color, cls, d) => `<g class="pop ${cls}" ${delay(d)}><circle cx="${f(x)}" cy="${y}" r="5.5" fill="${color}" stroke="${C.paper}" stroke-width="1.5"/></g>`;
    const big = (x, color, cls) => `<g class="pop ${cls}" ${delay(1)}><circle cx="${f(x)}" cy="${y}" r="14" fill="${color}"/></g>`;
    const cells = Array.from({ length: 10 }, (_, k) => {
      const x = 120 + k * 40, lowSide = k < 5;
      return `<g class="seq3" ${delay(k * .07)}><rect x="${x}" y="258" width="40" height="40" fill="${lowSide ? C.sky : C.peach}" stroke="${lowSide ? C.blue : C.orange}" stroke-width="2"/>${text(x + 20, 285, k, { size: 20 })}</g>`;
    }).join('');
    const body = nl.body
      + `<path d="M${b} ${y - 16} V${y + 16}" stroke="${C.ink}" stroke-width="5"/>`
      + `<g class="b1">${digits(170, 70, 2648, 2, { size: 26, cls: '', mark: C.blue, tail: ' → 2600' })}`
      + `${curve(a - 4, y - 14, lo, y - 18, 128, C.blue, 'grow1')}${small(a, C.blue, 'pop1', 0)}${big(lo, C.blue, 'pop1')}</g>`
      + `<g class="b2">${digits(470, 70, 2650, 2, { size: 26, cls: '', mark: C.orange, tail: ' → 2700' })}`
      + `${curve(b + 4, y - 14, hi, y - 18, 128, C.orange, 'grow2')}${small(b, C.orange, 'pop2', 0)}${big(hi, C.orange, 'pop2')}</g>`
      + `<g class="b3">${cells}${text(220, 326, '버림', { size: 18, color: C.blue })}${text(420, 326, '올림', { size: 18, color: C.orange })}</g>`;
    put('5-2/수학/1/반올림', svg(id, body, motion(id)));
  })();
})(typeof window !== 'undefined' ? window : globalThis);
