// 수학 6-2 3단원 소수의 나눗셈: 낱말 도식
(function (root) {
  'use strict';
  const { C, svg, text, arrow, put } = root.FigureKit;
  // 수직선 눈금 수는 19px 로(kit 기본 17px)
  const numberLine = (...a) => { const r = root.FigureKit.numberLine(...a); r.body = r.body.replace(/font-size="17"/g, 'font-size="19"'); return r; };
  const f = (n) => +n.toFixed(1);
  const delay = (s, more = '') => `style="animation-delay:${s}s;transition-delay:${s}s;${more}"`;

  const motion = (id) => {
    let css = `
    .sc-${id} :is(.s1,.s2,.s3,.s4,.p1,.p2,.p3,.p4,.k1,.k2,.k3,.k4,.f1,.f2,.f3,.f4) { opacity: 0; }
    .sc-${id} :is(.p1,.p2,.p3,.p4,.ring) { transform-box: fill-box; transform-origin: center; }
    .sc-${id} .draw { stroke-dasharray: 1; stroke-dashoffset: 1; transition: stroke-dashoffset .7s ease-in-out; }
    .sc-${id} .ring { opacity: 0; }
    @keyframes ${id}-fin { from { opacity: 0; } to { opacity: 1; } }
    @keyframes ${id}-pop { 0% { opacity: 0; transform: scale(0); } 70% { opacity: 1; transform: scale(1.2); } 100% { opacity: 1; transform: scale(1); } }
    @keyframes ${id}-ring { 0% { opacity: .9; transform: scale(1); } 100% { opacity: 0; transform: scale(2.2); } }
    @keyframes ${id}-blink { 0% { opacity: 0; } 20% { opacity: 1; } 40% { opacity: .15; } 60% { opacity: 1; } 80% { opacity: .15; } 100% { opacity: 1; } }
    @keyframes ${id}-fly { from { opacity: 0; transform: translate(var(--dx), var(--dy)); } 25% { opacity: 1; } to { opacity: 1; transform: none; } }`;
    for (let n = 1; n <= 4; n++) css += `
    .on${n} .sc-${id} .s${n} { animation: ${id}-fin .4s ease-out both; }
    .on${n} .sc-${id} .p${n} { animation: ${id}-pop .5s ease-out both; }
    .on${n} .sc-${id} .d${n} { stroke-dashoffset: 0; }
    .on${n} .sc-${id} .r${n} { animation: ${id}-ring 1.1s ease-out 2 both; }
    .on${n} .sc-${id} .k${n} { animation: ${id}-blink 1.6s ease-in-out both; }
    .on${n} .sc-${id} .f${n} { animation: ${id}-fly .8s ease-in-out both; }`;
    return css;
  };

  // 식: 토막마다 따로 놓아 가운데 x 를 돌려준다(둘레 표시·화살표 자리 잡기용)
  const charW = (ch) => /[0-9]/.test(ch) ? .58 : ch === '.' ? .3 : ch === '…' ? 1 : /[÷=×<>]/.test(ch) ? .72 : .6;
  function eq(cx, y, toks, size, { cls = '', d = 0 } = {}) {
    const items = toks.map((t) => (typeof t === 'string' ? { t } : t));
    const ws = items.map(({ t }) => [...String(t)].reduce((s, ch) => s + charW(ch) * size, 0));
    const gap = size * .38, total = ws.reduce((a, b) => a + b, 0) + gap * (items.length - 1);
    let x = cx - total / 2;
    const xs = [];
    const body = items.map((it, i) => {
      const c = x + ws[i] / 2; xs.push(c); x += ws[i] + gap;
      const t = text(f(c), y, it.t, { size, color: it.color || C.ink });
      return it.cls ? `<g class="${it.cls}" ${delay(it.d || 0)}>${t}</g>` : t;
    }).join('');
    return { body: cls ? `<g class="${cls}" ${delay(d)}>${body}</g>` : body, xs, ws, mid: y - size * .36 };
  }
  const oval = (x, y, w, h, color, cls = '', d = 0) => `<ellipse class="${cls}" ${cls ? delay(d) : ''} cx="${f(x)}" cy="${f(y)}" rx="${f(w)}" ry="${f(h)}" fill="none" stroke="${color}" stroke-width="3.5"/>`;
  const tenths = (nl, from, to, y, len = 6) => {
    let s = '';
    for (let v = from * 10; v <= to * 10; v++) if (v % 10) s += `<path d="M${f(nl.at(v / 10))} ${y - len} V${y + len}" stroke="${C.ink}" stroke-width="1.5"/>`;
    return s;
  };
  const tape = (x, y, w, h, fill = 'white') => `<rect x="${f(x)}" y="${y}" width="${f(w)}" height="${h}" fill="${fill}"/>`;
  const outline = (x, y, w, h, color = C.ink, sw = 3) => `<rect x="${f(x)}" y="${y}" width="${f(w)}" height="${h}" fill="none" stroke="${color}" stroke-width="${sw}"/>`;
  const check = (x, y) => `<path d="M${f(x - 11)} ${y} l8 9 l16 -19" stroke="${C.green}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`;
  const cross = (x, y) => `<path d="M${f(x - 10)} ${y - 10} l20 20 M${f(x + 10)} ${y - 10} l-20 20" stroke="${C.red}" stroke-width="5" stroke-linecap="round" fill="none"/>`;

  // 나누어지는 수: 1.8 띠 → 0.3씩 덜어 6번 → ÷ 앞의 1.8, 0.5 ÷ 2 의 0.5
  (function () {
    const id = 't62-m3-nanueo', y = 168, h = 44;
    const nl = numberLine(0, 2, { y: 258, x0: 80, x1: 560 });
    const E = eq(300, 96, [{ t: '1.8', color: C.orange }, '÷', '0.3', { t: '=', cls: 's2', d: 2 }, { t: '6', cls: 's2', d: 2 }], 44);
    const end = nl.at(1.8), seg = nl.at(0.3) - nl.at(0);
    const segs = Array.from({ length: 6 }, (_, k) => `<rect class="s2" ${delay(.2 + k * .28)} x="${f(80 + k * seg)}" y="${y}" width="${f(seg)}" height="${h}" fill="${k % 2 ? C.sky : C.mint}"/>`).join('');
    const nums = Array.from({ length: 6 }, (_, k) => `<g class="p2" ${delay(.3 + k * .28)}>${text(f(80 + (k + .5) * seg), y + 30, k + 1, { size: 22 })}</g>`).join('');
    const cuts = Array.from({ length: 5 }, (_, k) => `<path class="s2" ${delay(.45 + k * .28)} d="M${f(80 + (k + 1) * seg)} ${y - 8} V${y + h + 8}" stroke="${C.red}" stroke-width="3.5" stroke-linecap="round"/>`).join('');
    const E2 = eq(480, 338, [{ t: '0.5', color: C.orange }, '÷', '2'], 32);
    const body = nl.body + tenths(nl, 0, 2, 258)
      + `<g class="tp">${tape(80, y, end - 80, h, C.peach)}</g>` + segs + `<g class="tp">${outline(80, y, end - 80, h)}</g>` + cuts + nums
      + `<g class="s1" ${delay(1.1)}>${text(f(end), 154, '1.8', { size: 22, color: C.orange })}</g>`
      + E.body
      + `<g class="s3">${oval(E.xs[0], E.mid, E.ws[0] / 2 + 9, 30, C.orange)}${text(f(E.xs[0]), 34, '÷ 앞', { size: 22, color: C.orange })}</g>`
      + `<g class="s3" ${delay(.9)}>${E2.body}${oval(E2.xs[0], E2.mid, E2.ws[0] / 2 + 7, 22, C.orange)}</g>`;
    put('6-2/수학/3/나누어지는 수', svg(id, body, motion(id) + `
      .sc-${id} .tp { transform-box: view-box; transform-origin: 80px 0; transform: scaleX(0); transition: transform 1s ease-out .2s; }
      .on1 .sc-${id} .tp { transform: none; }`));
  })();

  // 나누는 수: 4.5를 1.5씩 → 3번, 0.5씩 → 9번 → ÷ 뒤의 수
  (function () {
    const id = 't62-m3-nanuneun', yA = 124, yB = 184, h = 36;
    const nl = numberLine(0, 5, { y: 262, x0: 70, x1: 570 });
    const u = 100, x0 = 70, len = 4.5 * u;
    let halves = '';
    for (let k = 0; k < 5; k++) halves += `<path d="M${f(nl.at(k + .5))} 256 V268" stroke="${C.ink}" stroke-width="1.8"/>`;
    const EA = eq(165, 84, ['4.5', '÷', { t: '1.5', color: C.orange }, { t: '=', cls: 's2', d: 1.5 }, { t: '3', cls: 's2', d: 1.5 }], 32);
    const EB = eq(478, 84, ['4.5', '÷', { t: '0.5', color: C.blue }, '=', '9'], 32, { cls: 's3', d: 1.4 });
    const hopT = 1.5, land = (k) => .3 + hopT * k / 2;
    const segA = [0, 1, 2].map((k) => `<rect class="s2" ${delay(k ? land(k) : .1)} x="${x0 + k * 150}" y="${yA}" width="150" height="${h}" fill="${k % 2 ? C.yellow : C.peach}" fill-opacity="${k % 2 ? .5 : 1}"/>`
      + `<g class="p2" ${delay((k ? land(k) : .1) + .1)}>${text(x0 + k * 150 + 75, yA + 26, k + 1, { size: 22 })}</g>`).join('');
    const segB = Array.from({ length: 9 }, (_, k) => `<rect class="s3" ${delay(.2 + k * .13)} x="${x0 + k * 50}" y="${yB}" width="50" height="${h}" fill="${k % 2 ? C.sky : C.mint}"/>`
      + `<g class="p3" ${delay(.25 + k * .13)}>${text(x0 + k * 50 + 25, yB + 26, k + 1, { size: 19 })}</g>`).join('');
    const hops = `50% { transform: translate(150px, 0); } 25% { transform: translate(75px, -26px); } 75% { transform: translate(225px, -26px); } 100% { transform: translate(300px, 0); }`;
    const body = nl.body + halves
      + tape(x0, yA, len, h) + segA + outline(x0, yA, len, h)
      + `<g class="s3">${tape(x0, yB, len, h)}</g>` + segB + `<g class="s3">${outline(x0, yB, len, h)}</g>`
      + text(x0 + len + 8, yA + 26, '4.5', { size: 20, anchor: 'start', color: C.muted })
      + `<g class="s1"><g class="hop">${outline(x0, yA - 4, 150, h + 8, C.orange, 5)}</g></g>`
      + `<g class="h2"><g class="s1" ${delay(.4)}>${text(x0 + 75, yA + 26, '1.5', { size: 22, color: C.orange })}</g></g>`
      + EA.body + EB.body
      + `<g class="s3" ${delay(.2)}>${outline(x0, yB - 4, 50, h + 8, C.blue, 5)}</g>`
      + `<g class="s4">${oval(EA.xs[2], EA.mid, EA.ws[2] / 2 + 9, 25, C.orange)}${text(f(EA.xs[2]), 34, '÷ 뒤', { size: 22, color: C.orange })}`
      + `${oval(EB.xs[2], EB.mid, EB.ws[2] / 2 + 9, 25, C.blue)}${text(f(EB.xs[2]), 34, '÷ 뒤', { size: 22, color: C.blue })}</g>`
      + `<g class="ring r4" ${delay(.5)}>${oval(EA.xs[2], EA.mid, EA.ws[2] / 2 + 9, 25, C.orange)}</g>`
      + `<g class="ring r4" ${delay(.5)}>${oval(EB.xs[2], EB.mid, EB.ws[2] / 2 + 9, 25, C.blue)}</g>`;
    put('6-2/수학/3/나누는 수', svg(id, body, motion(id) + `
      .on2 .sc-${id} .hop { animation: ${id}-hop ${hopT}s ease-in-out .3s both; }
      @keyframes ${id}-hop { 0% { transform: none; } ${hops} }
      .on3 .sc-${id} .hop { opacity: .35; transition: opacity .4s ease; }`));
  })();

  // 소수점: 1.5 ÷ 0.3 → 두 수의 소수점을 오른쪽으로 한 자리 → 15 ÷ 3, 몫은 둘 다 5
  (function () {
    const id = 't62-m3-sosujeom', S = 64, sp = 56;
    const Y1 = 118, Y2 = 290;
    const A = 128, B = 316; // 두 수의 첫 숫자 자리
    const num = (x, y, a, b, { zero = '', shift = '' } = {}) => `<g class="${zero}">${text(x, y, a, { size: S })}</g><g class="${shift}">${text(x + sp, y, b, { size: S })}</g>`;
    const dot = (x, y, cls = '') => `<g class="${cls}"><circle cx="${x + sp / 2}" cy="${y - 3}" r="6.5" fill="${C.orange}"/></g>`;
    const row = (y, moving) => num(A, y, 1, 5, moving ? { zero: 'cr', shift: 'cl' } : {}) + text(252, y, '÷', { size: S }) + num(B, y, 0, 3, moving ? { zero: 'gone', shift: 'shift' } : {})
      + `<g class="s3" ${delay(moving ? 1.2 : .3)}>${text(434, y, '=', { size: S })}${text(494, y, 5, { size: S, color: C.green })}</g>`;
    const arc = (x, y) => `<path class="draw d2" pathLength="1" ${delay(.3)} d="M${x + sp / 2} ${y - 52} Q${x + sp} ${y - 92} ${x + sp * 1.5} ${y - 52}" fill="none" stroke="${C.orange}" stroke-width="3.5" stroke-linecap="round"/>`
      + `<g class="s2" ${delay(.9)}>${text(x + sp, y - 84, '×10', { size: 18, color: C.orange })}</g>`;
    const tags = (cls, d) => `<g class="${cls}" ${delay(d)}><path d="M${A} ${Y1 + 10} V${Y1 + 34} H${A - 10} M${A + sp} ${Y1 + 10} V${Y1 + 34} H${A + sp + 10}" fill="none" stroke="${C.muted}" stroke-width="2.5"/>`
      + `${text(A - 16, Y1 + 41, '일의 자리', { size: 19, color: C.green, anchor: 'end' })}${text(A + sp + 16, Y1 + 41, '소수 첫째 자리', { size: 19, color: C.blue, anchor: 'start' })}</g>`;
    const body = row(Y1, false) + dot(A, Y1) + dot(B, Y1)
      + `<circle class="ring r1" ${delay(.5)} cx="${A + sp / 2}" cy="${Y1 - 3}" r="12" fill="none" stroke="${C.orange}" stroke-width="4"/>`
      + `<g class="h2">${tags('s1', .3)}</g>` + tags('s4', .2)
      + `<circle class="ring r4" ${delay(.6)} cx="${A + sp / 2}" cy="${Y1 - 3}" r="12" fill="none" stroke="${C.orange}" stroke-width="4"/>`
      + `<circle class="ring r4" ${delay(.6)} cx="${B + sp / 2}" cy="${Y1 - 3}" r="12" fill="none" stroke="${C.orange}" stroke-width="4"/>`
      + `<g class="s2">${row(Y2, true)}${dot(A, Y2, 'hop tail')}${dot(B, Y2, 'hop tail')}</g>`
      + `<g class="h4">${arc(A, Y2)}${arc(B, Y2)}</g>`;
    put('6-2/수학/3/소수점', svg(id, body, motion(id) + `
      .on2 .sc-${id} .hop { animation: ${id}-hop .9s ease-in-out .4s both; }
      @keyframes ${id}-hop { 0% { transform: none; } 50% { transform: translate(${sp / 2}px, -44px); } 100% { transform: translate(${sp}px, 0); } }
      .sc-${id} .tail, .sc-${id} .gone { transition: opacity .5s ease .3s; }
      .on3 .sc-${id} .tail, .on3 .sc-${id} .gone { opacity: 0; }
      .sc-${id} .shift { transition: transform .6s ease-in-out .8s; }
      .on3 .sc-${id} .shift { transform: translateX(${-sp / 2}px); }
      .sc-${id} .cr, .sc-${id} .cl { transition: transform .6s ease-in-out .8s; }
      .on3 .sc-${id} .cr { transform: translateX(8px); }
      .on3 .sc-${id} .cl { transform: translateX(-8px); }`));
  })();

  // 어림: 7.8 ÷ 2 → 7.8은 약 8 → 8 ÷ 2 = 4 → 3.9는 4 가까이, 39는 멀리
  (function () {
    const id = 't62-m3-eorim';
    const E = eq(130, 66, ['7.8', '÷', '2'], 40);
    const n1 = numberLine(7, 9, { y: 168, x0: 80, x1: 560 });
    const a = n1.at(7.8), b = n1.at(8);
    const E2 = eq(470, 66, [{ t: '8', color: C.blue }, '÷', '2', '=', { t: '4', color: C.blue }], 40, { cls: 's2', d: .2 });
    const n2 = numberLine(0, 40, { y: 292, x0: 80, x1: 560, every: 10 });
    let minor = '';
    for (let v = 1; v < 40; v++) if (v % 10) minor += `<path d="M${f(n2.at(v))} 287 V297" stroke="${C.ink}" stroke-width="1.3"/>`;
    const chip = (x, y, s, color, fill, cls, d) => `<g class="${cls}" ${delay(d)}><rect x="${x - 44}" y="${y - 22}" width="88" height="40" rx="20" fill="${fill}" stroke="${color}" stroke-width="3"/>${text(x, y + 6, s, { size: 22, color })}</g>`;
    const body = E.body + n1.body + tenths(n1, 7, 9, 168)
      + text(f(a), 204, '7.8', { size: 20, color: C.orange })
      + `<circle cx="${f(a)}" cy="168" r="8" fill="${C.orange}"/>`
      + `<path class="draw d1" pathLength="1" ${delay(.3)} d="M${f(a)} 156 Q${f((a + b) / 2)} 118 ${f(b)} 154" fill="none" stroke="${C.blue}" stroke-width="4" stroke-linecap="round"/>`
      + `<g class="p1" ${delay(1)}><circle cx="${f(b)}" cy="168" r="12" fill="none" stroke="${C.blue}" stroke-width="4"/></g>`
      + chip(f(b), 108, '약 8', C.blue, C.sky, 'p1', 1.2)
      + E2.body + chip(470, 116, '약 4', C.blue, C.sky, 'p2', 1)
      + `<g class="s3">${n2.body}${minor}</g>`
      + `<g class="p3" ${delay(.4)}><circle cx="${f(n2.at(4))}" cy="292" r="13" fill="none" stroke="${C.blue}" stroke-width="4"/></g>`
      + `<g class="p3" ${delay(.8)}><circle cx="${f(n2.at(3.9))}" cy="292" r="7" fill="${C.orange}"/></g>`
      + `<g class="s3" ${delay(.8)}>${text(f(n2.at(3.9) + 26), 262, '3.9', { size: 22, color: C.orange })}${check(f(n2.at(3.9) + 70), 256)}</g>`
      + `<g class="p3" ${delay(1.3)}><circle cx="${f(n2.at(39))}" cy="292" r="7" fill="${C.red}"/></g>`
      + `<g class="s3" ${delay(1.3)}>${text(f(n2.at(39) - 6), 262, '39', { size: 22, color: C.red, anchor: 'end' })}${cross(f(n2.at(39) - 62), 252)}</g>`
      + `<g class="ring r4" ${delay(.2)}><rect x="${470 - 44}" y="${116 - 22}" width="88" height="40" rx="20" fill="none" stroke="${C.blue}" stroke-width="3"/></g>`
      + `<circle class="ring r4" ${delay(.6)} cx="${f(n2.at(4))}" cy="292" r="13" fill="none" stroke="${C.blue}" stroke-width="4"/>`;
    put('6-2/수학/3/어림', svg(id, body, motion(id)));
  })();

  // 반올림: 2 ÷ 3 = 0.666… → 소수 셋째 자리 6을 봄(0~4 버림, 5~9 올림) → 0.67
  (function () {
    const id = 't62-m3-banollim', Y = 74, S = 42;
    const left = [['2', 168], ['÷', 212], ['3', 256], ['=', 300]].map(([t, x]) => text(x, Y, t, { size: S })).join('');
    const q = [['0', 344], ['.', 366], ['6', 388], ['6', 416], ['6', 444], ['…', 478]];
    const quot = q.map(([t, x], i) => i < 2 ? text(x, Y, t, { size: S }) : `<g class="s1" ${delay(.3 + (i - 2) * .4)}>${text(x, Y, t, { size: S, color: i === 4 ? C.orange : C.ink })}</g>`).join('');
    const cx0 = 100, cw = 44, cy = 132, ch = 42;
    const cellsRow = Array.from({ length: 10 }, (_, k) => `<rect x="${cx0 + k * cw}" y="${cy}" width="${cw}" height="${ch}" fill="${k < 5 ? C.sky : C.peach}" stroke="${k < 5 ? C.blue : C.orange}" stroke-width="2"/>${text(cx0 + k * cw + cw / 2, cy + 30, k, { size: 22 })}`).join('');
    const six = cx0 + 6 * cw + cw / 2;
    const nl = numberLine(0, 1, { y: 282, x0: 110, x1: 510, label: 2 });
    let ticks = '';
    for (let k = 1; k < 10; k++) ticks += `<path d="M${f(nl.at(k / 10))} ${k === 5 ? 272 : 276} V${k === 5 ? 292 : 288}" stroke="${C.ink}" stroke-width="${k === 5 ? 2.5 : 1.6}"/>`;
    const d6 = nl.at(.6), d7 = nl.at(1);
    const body = left + quot
      + `<g class="s2"><rect x="${444 - 18}" y="${Y - 38}" width="36" height="48" rx="5" fill="none" stroke="${C.orange}" stroke-width="3.5"/>`
      + `<path d="M330 ${Y + 12} H430" stroke="${C.green}" stroke-width="4" stroke-linecap="round"/></g>`
      + `<g class="s2">${cellsRow}${text(cx0 + 2.5 * cw, cy + ch + 28, '버림', { size: 20, color: C.blue })}${text(cx0 + 7.5 * cw, cy + ch + 28, '올림', { size: 20, color: C.orange })}</g>`
      + `<g class="f2" ${delay(.6, `--dx:${f(444 - six)}px;--dy:${f(Y - 18 - (cy + 21))}px`)}><circle cx="${six}" cy="${cy + 21}" r="20" fill="none" stroke="${C.orange}" stroke-width="5"/></g>`
      + `<circle class="ring r2" ${delay(1.5)} cx="${six}" cy="${cy + 21}" r="20" fill="none" stroke="${C.orange}" stroke-width="4"/>`
      + `<g class="s3">${nl.body.replace(/<text[^>]*>[^<]*<\/text>/g, '')}${ticks}${text(110, 318, '0.66', { size: 20 })}${text(510, 318, '0.67', { size: 20, color: C.orange })}`
      + `<circle cx="${f(d6)}" cy="282" r="8" fill="${C.ink}"/>${text(f(d6), 318, '0.666…', { size: 20 })}</g>`
      + `<path class="draw d3" pathLength="1" ${delay(.5)} d="M${f(d6 + 6)} 270 Q${f((d6 + d7) / 2)} 214 ${f(d7)} 268" fill="none" stroke="${C.orange}" stroke-width="4" stroke-linecap="round"/>`
      + `<g class="p3" ${delay(1.2)}><circle cx="${f(d7)}" cy="282" r="12" fill="${C.orange}"/></g>`
      + `<g class="s3" ${delay(1.4)}><rect x="530" y="200" width="96" height="40" rx="20" fill="${C.peach}" stroke="${C.orange}" stroke-width="3"/>${text(578, 227, '약 0.67', { size: 20, color: C.orange })}</g>`
      + `<rect class="k4" ${delay(.1)} x="${cx0 - 4}" y="${cy - 4}" width="${5 * cw + 8}" height="${ch + 8}" fill="none" stroke="${C.blue}" stroke-width="5"/>`
      + `<rect class="k4" ${delay(1)} x="${cx0 + 5 * cw - 4}" y="${cy - 4}" width="${5 * cw + 8}" height="${ch + 8}" fill="none" stroke="${C.orange}" stroke-width="5"/>`;
    put('6-2/수학/3/반올림', svg(id, body, motion(id)));
  })();
})(typeof window !== 'undefined' ? window : globalThis);
