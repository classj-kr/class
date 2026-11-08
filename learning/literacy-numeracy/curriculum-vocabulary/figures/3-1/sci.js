// 과학 3-1 1단원 「힘과 우리 생활」 낱말 도식: 수평 잡기·용수철저울·지레·빗면을 교과서 실험 그대로 코드로 그린다.
// 판과 나무토막은 나무색(C.peach/C.orange), 받침대는 회색(C.line/C.muted). 드는 힘과 지구가 당기는 힘은 굵은 주황 화살표.
// 수평 잡기 판의 숫자는 받침점에서 떨어진 칸 수(눈금 자리)이고, 나무토막은 눈금 위에 올린다(2칸에 둘 = 4칸에 하나).
// 판 돌리기는 transform-origin 에 기대지 않고 translate-rotate-translate 로 적는다.
// 움직임은 transform·opacity·stroke-dashoffset 만 쓴다.
(function (root) {
  'use strict';
  const { C, svg, text, put } = root.FigureKit;
  const f = (n) => +(+n).toFixed(1);
  const dl = (s) => (s ? ` style="animation-delay:${s}s"` : '');
  const g = (cls, inner, s = 0) => `<g class="${cls}"${dl(s)}>${inner}</g>`;
  // 칸 n 에 나타나며 kind(pop·fin·rise·drop) 움직임을 한 번 한다
  const at = (n, kind, inner, s = 0) => `<g class="b${n}">${g(`${kind} ${kind}${n}`, inner, s)}</g>`;
  // 칸 n 부터 보이고, hide 칸부터 사라진다
  const shown = (n, inner, hide) => `<g class="b${n}${hide ? ' h' + hide : ''}">${inner}</g>`;
  const tw = (s, size) => [...String(s)].reduce((a, c) => a + (/[가-힣]/.test(c) ? 1 : c === ' ' ? 0.3 : 0.6), 0) * size;
  const HOT = [C.peach, C.orange], OK = [C.mint, C.green], NP = [C.peach, C.red];
  const tag = (cx, cy, label, [fill, stroke] = OK, { size = 20 } = {}) => {
    const w = Math.round(tw(label, size) + size * 1.3), h = Math.round(size * 1.7);
    return `<g><rect x="${f(cx - w / 2)}" y="${f(cy - h / 2)}" width="${w}" height="${h}" rx="${h / 2}" fill="${fill}" stroke="${stroke}" stroke-width="2.5"/>${text(f(cx), f(cy + size * 0.36), label, { size })}</g>`;
  };
  const lead = (x1, y1, x2, y2, color = C.muted) => `<path d="M${f(x1)} ${f(y1)} L${f(x2)} ${f(y2)}" stroke="${color}" stroke-width="2.5" stroke-linecap="round"/>`;
  // 굵은 힘 화살표(머리는 채운 세모)
  const force = (x1, y1, x2, y2, color = C.orange, w = 8) => {
    const a = Math.atan2(y2 - y1, x2 - x1), L = w * 2.3, bx = x2 - L * Math.cos(a), by = y2 - L * Math.sin(a), s = w * 1.25;
    return `<g><path d="M${f(x1)} ${f(y1)} L${f(bx)} ${f(by)}" stroke="${color}" stroke-width="${w}" stroke-linecap="round"/><path d="M${f(x2)} ${f(y2)} L${f(bx - s * Math.sin(a))} ${f(by + s * Math.cos(a))} L${f(bx + s * Math.sin(a))} ${f(by - s * Math.cos(a))} Z" fill="${color}" stroke="${color}" stroke-width="2" stroke-linejoin="round"/></g>`;
  };
  const glowPath = (d, n, color = C.green, s = 0, w = 6) => `<g class="b${n}"><path class="flash flash${n}"${dl(s)} d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"/></g>`;
  const ring = (cx, cy, r, n, color = C.green, s = 0) => `<g class="b${n}"><circle class="ring ring${n}"${dl(s)} cx="${f(cx)}" cy="${f(cy)}" r="${r}" fill="none" stroke="${color}" stroke-width="4"/></g>`;
  const woodBlock = (x, y, w, h) => `<rect x="${f(x)}" y="${f(y)}" width="${w}" height="${h}" rx="4" fill="${C.peach}" stroke="${C.orange}" stroke-width="3"/>`
    + `<path d="M${f(x + 7)} ${f(y + h * 0.4)} Q${f(x + w * 0.5)} ${f(y + h * 0.22)} ${f(x + w - 7)} ${f(y + h * 0.42)}" stroke="${C.orange}" stroke-width="2" fill="none" opacity=".7"/>`;
  const rot = (cx, cy, deg) => `translate(${cx}px, ${cy}px) rotate(${deg}deg) translate(${-cx}px, ${-cy}px)`;

  // 장면마다 같이 쓰는 움직임
  const base = (id) => {
    let s = `
    .sc-${id} .pop, .sc-${id} .pulse, .sc-${id} .ring, .sc-${id} .spin { transform-box: fill-box; transform-origin: center; }
    .sc-${id} .ring { opacity: 0; }
    .sc-${id} .draw { stroke-dasharray: 1; stroke-dashoffset: 1; transition: stroke-dashoffset 1.2s ease-in-out .2s; }
    @keyframes ${id}-pop { 0% { opacity: 0; transform: scale(.3); } 70% { opacity: 1; transform: scale(1.12); } 100% { opacity: 1; transform: scale(1); } }
    @keyframes ${id}-fin { from { opacity: 0; } to { opacity: 1; } }
    @keyframes ${id}-rise { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
    @keyframes ${id}-drop { from { opacity: 0; transform: translateY(-50px); } to { opacity: 1; transform: none; } }
    @keyframes ${id}-pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.12); } }
    @keyframes ${id}-flash { 0% { opacity: 0; } 20% { opacity: 1; } 40% { opacity: .25; } 60% { opacity: 1; } 80% { opacity: .25; } 100% { opacity: 1; } }
    @keyframes ${id}-ring { 0% { opacity: .9; transform: scale(1); } 100% { opacity: 0; transform: scale(1.6); } }
    `;
    for (let n = 1; n <= 5; n++) s += `
    .on${n} .sc-${id} .pop${n} { animation: ${id}-pop .5s ease-out both; }
    .on${n} .sc-${id} .fin${n} { animation: ${id}-fin .5s ease-out both; }
    .on${n} .sc-${id} .rise${n} { animation: ${id}-rise .5s ease-out both; }
    .on${n} .sc-${id} .drop${n} { animation: ${id}-drop .5s ease-in both; }
    .on${n} .sc-${id} .pulse${n} { animation: ${id}-pulse .7s ease-in-out .3s 2; }
    .on${n} .sc-${id} .flash${n} { animation: ${id}-flash 1.4s ease-in-out both; }
    .on${n} .sc-${id} .ring${n} { animation: ${id}-ring 1.1s ease-out .3s 2; }
    .on${n} .sc-${id} .draw${n} { stroke-dashoffset: 0; }`;
    return s;
  };
  // 칸마다 값이 바뀌는 transform. vals[0] 은 처음, vals[n] 은 n칸. null 은 그대로.
  const steps = (id, cls, vals, sec = 1.2, delay = 0.2) => `.sc-${id} .${cls} { transform: ${vals[0]}; transition: transform ${sec}s ease-in-out ${delay}s; }`
    + vals.slice(1).map((v, i) => v == null ? '' : `.on${i + 1} .sc-${id} .${cls} { transform: ${v}; }`).join('');

  // ── 수평 잡기 도구 ──
  // 받침점 P(320, 200). 판은 x 96~544, 위 176, 아래 200. 칸 k 의 눈금은 x = 320 ± 50k.
  const PX = 320, PY = 200, TOP = 176;
  const posX = (k) => PX + 50 * k; // k 는 -4~4 (음수는 왼쪽)
  const stand = () => `<rect x="60" y="292" width="520" height="10" rx="4" fill="${C.peach}" stroke="${C.orange}" stroke-width="2.5"/>`
    + `<path d="M${PX} ${PY} L${PX - 30} 292 H${PX + 30} Z" fill="${C.line}" stroke="${C.muted}" stroke-width="3" stroke-linejoin="round"/>`;
  const plank = (numbers = true) => {
    let s = `<rect x="96" y="${TOP}" width="448" height="${PY - TOP}" rx="4" fill="${C.peach}" stroke="${C.orange}" stroke-width="3"/>`;
    if (numbers) {
      for (let k = 1; k <= 4; k++) for (const sg of [-1, 1]) s += text(posX(sg * k), PY - 6, k, { size: 18, weight: 700 });
      s += `<path d="M${PX} ${TOP} V${PY}" stroke="${C.orange}" stroke-width="2.5" stroke-dasharray="4 3"/>`;
    }
    return s;
  };
  // 눈금 k 위에 쌓은 나무토막 n 개(아래부터 0)
  const blockAt = (k, level = 0) => woodBlock(posX(k) - 20, TOP - 30 * (level + 1), 40, 30);

  // ════ 무게: 무거운 쪽으로 기울어지는 까닭은 지구가 더 큰 힘으로 당기기 때문 ════
  (function () {
    const id = 't31-s1-muge';
    let css = base(id);
    const tilt = 8, dy = f(150 * Math.sin(tilt * Math.PI / 180));
    let body = `<path d="M-10 380 Q320 262 650 380 Z" fill="${C.sky}" stroke="${C.blue}" stroke-width="3"/>`;
    body += stand();
    let beam = plank(false);
    beam += at(1, 'drop', blockAt(-3), 0.1);
    [0, 1, 2].forEach((lv) => { beam += at(1, 'drop', blockAt(3, lv), 0.25 + 0.15 * lv); });
    body += `<g class="beam">${beam}</g>`;
    css += steps(id, 'beam', [rot(PX, PY, 0), rot(PX, PY, tilt)], 1, 0.9);
    // 지구가 당기는 힘: 판 아래에서 아래로. 판이 기울어진 만큼 위아래로 옮겨 둔다.
    body += shown(2, `<g transform="translate(0 ${-dy})">${at(2, 'pop', g('pulse pulse3', force(170, PY + 6, 170, PY + 40)), 0.2)}</g>`
      + `<g transform="translate(0 ${dy})">${at(2, 'pop', g('pulse pulse3', force(470, PY + 6, 470, PY + 92)), 0.5)}</g>`);
    body += at(2, 'rise', text(320, 344, '지구', { size: 22, color: C.blue }), 0);
    body += shown(3, lead(470 + 10, PY + dy + 60, 548, 250, C.green)) + at(3, 'pop', tag(568, 236, '무게', OK, { size: 24 }), 0.4);
    put('3-1/과학/1/무게', svg(id, body, css));
  })();

  // ════ 수평: 한쪽에만 올리면 기울고, 같은 거리에 같은 무게를 올리면 반듯해진다 ════
  (function () {
    const id = 't31-s1-supyeong';
    let css = base(id);
    let body = stand();
    let beam = plank(true);
    beam += at(1, 'drop', blockAt(-3), 0.1);
    beam += at(2, 'drop', blockAt(3), 0.1);
    body += `<g class="beam">${beam}</g>`;
    css += steps(id, 'beam', [rot(PX, PY, 0), rot(PX, PY, -8), rot(PX, PY, 0)], 0.9, 0.6);
    // 기울어진 판과 수평선
    body += shown(1, `<path d="M70 ${TOP} H570" stroke="${C.muted}" stroke-width="2.5" stroke-dasharray="8 6"/>`, 2);
    body += `<g class="b3"><path class="draw draw3" pathLength="1" d="M60 ${TOP - 2} H580" stroke="${C.green}" stroke-width="5" stroke-dasharray="1" fill="none"/></g>`;
    body += at(3, 'pop', tag(320, 70, '수평', OK, { size: 26 }), 0.9);
    body += ring(posX(-3), TOP - 15, 30, 3, C.green, 0.2) + ring(posX(3), TOP - 15, 30, 3, C.green, 0.2);
    put('3-1/과학/1/수평', svg(id, body, css));
  })();

  // ════ 받침점: 판을 아래에서 버티는 자리. 수평일 때 받침점에 가까운 쪽이 더 무겁다 ════
  (function () {
    const id = 't31-s1-batchim';
    let css = base(id);
    let body = stand();
    let beam = plank(true);
    beam += at(2, 'drop', blockAt(-2, 0), 0.1) + at(2, 'drop', blockAt(-2, 1), 0.25);
    beam += at(2, 'drop', blockAt(4), 1.0);
    body += `<g class="beam"><g class="rock">${beam}</g></g>`;
    css += `
    .sc-${id} .rock { transform: ${rot(PX, PY, 0)}; }
    .on1 .sc-${id} .rock { animation: ${id}-rock 2.4s ease-in-out infinite; }
    .on2 .sc-${id} .rock { animation: none; }
    @keyframes ${id}-rock { 0%, 100% { transform: ${rot(PX, PY, -6)}; } 50% { transform: ${rot(PX, PY, 6)}; } }
    .sc-${id} .beam { transform: ${rot(PX, PY, 0)}; }
    .on2 .sc-${id} .beam { animation: ${id}-tilt 2s ease-in-out both; }
    @keyframes ${id}-tilt { 0%, 15% { transform: ${rot(PX, PY, 0)}; } 35%, 58% { transform: ${rot(PX, PY, -9)}; } 85%, 100% { transform: ${rot(PX, PY, 0)}; } }
    `;
    body += ring(PX, PY, 18, 1, C.green, 0) + ring(PX, PY, 18, 3, C.green, 0);
    body += shown(1, lead(PX + 8, PY + 6, 420, 250, C.green)) + at(1, 'pop', tag(470, 252, '받침점', OK, { size: 22 }), 0.3);
    // 받침점에서 잰 거리
    const bracket = (x1, x2, y, color) => `<path d="M${x1} ${y - 8} V${y + 8} M${x1} ${y} H${x2} M${x2} ${y - 8} V${y + 8}" stroke="${color}" stroke-width="4" stroke-linecap="round" fill="none"/>`;
    body += at(3, 'fin', bracket(posX(-2), PX, 92, C.orange) + text(f((posX(-2) + PX) / 2), 76, '가까움', { size: 18, color: C.orange }), 0.2);
    body += at(3, 'fin', bracket(PX, posX(4), 92, C.blue) + text(f((posX(4) + PX) / 2), 76, '멂', { size: 18, color: C.blue }), 0.5);
    body += at(3, 'fin', `<path d="M${PX} 100 V${TOP - 4}" stroke="${C.muted}" stroke-width="2.5" stroke-dasharray="5 4"/>`, 0.1);
    put('3-1/과학/1/받침점', svg(id, body, css));
  })();

  // ── 용수철저울 ──
  // 0 g 눈금 y=100, 1 g = 0.35 px(300 g 까지). 몸통 y 46~226. 고리는 아래로 나온 막대 끝.
  const Z0 = 100, PXG = 0.35;
  const springScale = ({ pointerG = 0, hang = null } = {}) => {
    const cx = 0; // 바깥 <g transform> 으로 자리를 옮긴다
    let s = `<circle cx="${cx}" cy="22" r="13" fill="none" stroke="${C.ink}" stroke-width="5"/><path d="M${cx} 35 V46" stroke="${C.ink}" stroke-width="5"/>`;
    s += `<rect x="${cx - 50}" y="46" width="112" height="180" rx="12" fill="white" stroke="${C.ink}" stroke-width="3"/>`;
    s += `<rect x="${cx - 40}" y="72" width="24" height="146" rx="6" fill="${C.sky}" stroke="${C.line}" stroke-width="2"/>`;
    // 눈금: 20 g 마다 작은 눈금, 100 g 마다 큰 눈금과 숫자
    let d = '';
    for (let gr = 0; gr <= 300; gr += 20) {
      const y = f(Z0 + gr * PXG), big = gr % 100 === 0;
      d += `M${cx - 6} ${y} H${cx + (big ? 12 : 4)} `;
      if (big) s += text(cx + 18, f(y + 6.5), gr, { size: 18, anchor: 'start', weight: 700 });
    }
    s += `<path d="${d}" stroke="${C.ink}" stroke-width="2.2"/>` + text(cx + 46, 72, 'g', { size: 18, weight: 700, color: C.muted });
    // 영점 조절 나사
    s += `<g class="spin"><circle cx="${cx - 28}" cy="59" r="8" fill="${C.line}" stroke="${C.ink}" stroke-width="2.5"/><path d="M${cx - 33} 59 H${cx - 23}" stroke="${C.ink}" stroke-width="2.5"/></g>`;
    // 용수철(위 끝 y=66, 아래 끝 = 표시 자)
    let zz = `M${cx - 28} 66`;
    const n = 7, top = 66, len = Z0 - top;
    for (let i = 1; i <= n; i++) zz += ` L${i % 2 ? cx - 36 : cx - 20} ${f(top + len * (i - 0.5) / n)}`;
    zz += ` L${cx - 28} ${Z0}`;
    s += `<g class="spr"><path d="${zz}" fill="none" stroke="${C.muted}" stroke-width="3" vector-effect="non-scaling-stroke" stroke-linejoin="round"/></g>`;
    // 움직이는 부분: 표시 자 + 막대 + 고리 (+ 매단 물체)
    let mv = `<path d="M${cx - 28} ${Z0} V244" stroke="${C.ink}" stroke-width="3.5"/>`
      + `<path d="M${cx - 28} 240 V250 A9 9 0 1 1 ${cx - 46} 250" fill="none" stroke="${C.ink}" stroke-width="3.5" stroke-linecap="round"/>`
      + `<path d="M${cx - 42} ${Z0 - 3} H${cx + 4} L${cx + 12} ${Z0} L${cx + 4} ${Z0 + 3} H${cx - 42} Z" fill="${C.red}" stroke="${C.red}" stroke-width="1.5" stroke-linejoin="round"/>`;
    if (hang) mv += hang;
    s += `<g class="mv">${mv}</g>`;
    return s;
  };
  // 필통: 고리에 건 끈과 지퍼가 있는 통
  const pencilCase = (cx, top) => `<path d="M${cx} ${top} V${top + 8}" stroke="${C.ink}" stroke-width="2.5"/>`
    + `<rect x="${cx - 46}" y="${top + 7}" width="92" height="28" rx="11" fill="${C.lilac}" stroke="${C.purple}" stroke-width="3"/>`
    + `<path d="M${cx - 36} ${top + 16} H${cx + 36}" stroke="${C.purple}" stroke-width="2.5" stroke-dasharray="4 3"/>`;

  // ════ 영점: 나사를 돌려 표시 자를 0 에 맞추고, 전자저울은 영점 단추로 0 을 맞춘다 ════
  (function () {
    const id = 't31-s1-yeongjeom';
    let css = base(id);
    const OX = 200, OY = -6, S = 1.3, off = 40 * PXG; // 처음에 표시 자가 40 g 자리에 있다
    const M = (x, y) => [f(OX + S * x), f(OY + S * y)];
    const inner = springScale() + ring(12, Z0 + off, 20, 1, C.red, 0.2)
      + `<g class="b2"><path class="flash flash2" style="animation-delay:1.5s" d="M-8 ${Z0} H14" stroke="${C.green}" stroke-width="6" stroke-linecap="round"/></g>`
      + ring(12, Z0, 20, 4, C.green, 0);
    let body = `<g transform="translate(${OX} ${OY}) scale(${S})">${inner}</g>`;
    const sprScale = f((Z0 - 66 + off) / (Z0 - 66));
    css += `.sc-${id} .spr { transform-box: fill-box; transform-origin: 50% 0; }`;
    css += steps(id, 'mv', [`translateY(${f(off)}px)`, null, 'translateY(0px)'], 1.1, 0.7);
    css += steps(id, 'spr', [`scaleY(${sprScale})`, null, 'scaleY(1)'], 1.1, 0.7);
    css += `.on2 .sc-${id} .spin { animation: ${id}-spin 1.8s ease-in-out both; } @keyframes ${id}-spin { from { transform: rotate(0deg); } to { transform: rotate(540deg); } }`;
    // 1칸: 0 이 아닌 자리를 가리킨다
    body += shown(1, lead(84, 178, ...M(-47, Z0 + off), C.red) + tag(70, 192, '0 아님', NP, { size: 20 }), 2);
    // 2칸: 나사를 돌린다
    body += shown(2, lead(128, 40, ...M(-34, 64), C.green)) + at(2, 'pop', tag(78, 30, '영점 조절 나사', OK, { size: 18 }), 0.1);
    // 3칸: 전자저울
    const ex = 500;
    let scale = `<rect x="${ex - 95}" y="236" width="190" height="56" rx="12" fill="white" stroke="${C.ink}" stroke-width="3"/>`
      + `<rect x="${ex - 110}" y="222" width="220" height="16" rx="6" fill="${C.line}" stroke="${C.muted}" stroke-width="2.5"/>`
      + `<rect x="${ex - 70}" y="246" width="96" height="36" rx="6" fill="${C.ink}"/>`
      + `<g class="btn"><circle cx="${ex + 60}" cy="264" r="15" fill="${C.mint}" stroke="${C.green}" stroke-width="3"/></g>`
      + text(ex + 60, 316, '영점', { size: 18 });
    body += at(3, 'rise', scale, 0);
    body += `<g class="b3"><g class="d1">${text(ex + 18, 272, '5 g', { size: 22, color: 'white', anchor: 'end' })}</g><g class="d0">${text(ex + 18, 272, '0 g', { size: 22, color: C.yellow, anchor: 'end' })}</g></g>`;
    css += `.sc-${id} .d0 { opacity: 0; transition: opacity .3s ease 1.3s; } .on3 .sc-${id} .d0 { opacity: 1; }`
      + `.sc-${id} .d1 { transition: opacity .3s ease 1.3s; } .on3 .sc-${id} .d1 { opacity: 0; }`
      + `.sc-${id} .btn { transform-box: fill-box; transform-origin: center; } .on3 .sc-${id} .btn { animation: ${id}-press .5s ease-in-out .9s 1; }`
      + `@keyframes ${id}-press { 50% { transform: scale(.75); } }`;
    // 4칸: 영점
    body += ring(ex - 22, 264, 40, 4, C.green, 0.2);
    body += shown(4, lead(...M(64, Z0), 360, 112, C.green) + lead(ex - 60, 238, 400, 128, C.green)) + at(4, 'pop', tag(392, 110, '영점', OK, { size: 26 }), 0.4);
    put('3-1/과학/1/영점', svg(id, body, css));
  })();

  // ════ 용수철저울: 각 부분, 물체를 걸면 용수철이 늘어나 표시 자가 내려간다, 눈금 읽기 ════
  (function () {
    const id = 't31-s1-yongsu';
    let css = base(id);
    const OX = 300, w = 160, d = f(w * PXG);
    const hang = `<g class="b2">${pencilCase(-37, 259)}</g>`;
    let body = `<g transform="translate(${OX} 0)">${springScale({ hang })}</g>`;
    const sprScale = f((Z0 - 66 + d) / (Z0 - 66));
    css += `.sc-${id} .spr { transform-box: fill-box; transform-origin: 50% 0; }`;
    css += steps(id, 'mv', ['translateY(0px)', null, `translateY(${d}px)`], 1.2, 0.6);
    css += steps(id, 'spr', ['scaleY(1)', null, `scaleY(${sprScale})`], 1.2, 0.6);
    // 1칸: 각 부분 이름
    const L = [['손잡이', 160, 22, OX - 15, 22], ['영점 조절 나사', 140, 62, OX - 37, 59], ['용수철', 160, 104, OX - 37, 86], ['고리', 190, 252, OX - 46, 252]];
    const R = [['표시 자', 470, 100, OX + 14, Z0], ['눈금', 470, 170, OX + 64, 165]];
    let parts = '';
    L.forEach(([lab, x, y, tx, ty], k) => { parts += at(1, 'fin', lead(x + tw(lab, 18) / 2 + 12, y, tx, ty) + tag(x, y, lab, OK, { size: 18 }), 0.15 * k); });
    R.forEach(([lab, x, y, tx, ty], k) => { parts += at(1, 'fin', lead(x - tw(lab, 18) / 2 - 12, y, tx, ty) + tag(x, y, lab, OK, { size: 18 }), 0.6 + 0.15 * k); });
    body += shown(1, parts, 2);
    // 2칸: 늘어남 표시
    body += at(2, 'fin', `<path d="M${OX - 62} 66 V${Z0 + d}" stroke="${C.orange}" stroke-width="3" stroke-dasharray="5 4"/>`
      + `<path d="M${OX - 70} ${Z0} H${OX - 54} M${OX - 70} ${Z0 + d} H${OX - 54}" stroke="${C.orange}" stroke-width="3"/>`, 1.6);
    body += at(2, 'fin', `<path d="M${OX - 62} ${Z0 + 6} V${Z0 + d - 6}" stroke="${C.orange}" stroke-width="4"/><path d="M${OX - 68} ${Z0 + d - 14} L${OX - 62} ${Z0 + d - 4} L${OX - 56} ${Z0 + d - 14}" stroke="${C.orange}" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`, 1.6);
    body += at(2, 'pop', tag(OX - 150, 130, '늘어남', HOT, { size: 18 }), 1.7);
    // 3칸: 눈금 읽기
    body += ring(OX + 12, Z0 + d, 22, 3, C.green, 0);
    body += shown(3, lead(OX + 64, Z0 + d, 446, Z0 + d, C.green)) + at(3, 'pop', tag(490, Z0 + d, '160 g', OK, { size: 24 }), 0.3);
    // 4칸: 용수철저울
    body += `<g class="b4"><rect class="flash flash4" x="${OX - 54}" y="42" width="120" height="188" rx="14" fill="none" stroke="${C.green}" stroke-width="5"/></g>`;
    body += at(4, 'pop', tag(490, 56, '용수철저울', OK, { size: 24 }), 0.3);
    put('3-1/과학/1/용수철저울', svg(id, body, css));
  })();

  // ════ 지레: 직접 들 때보다 받침점 가까이 놓고 먼 쪽을 누르면 작은 힘으로 든다 ════
  (function () {
    const id = 't31-s1-jire';
    let css = base(id);
    const P = [330, 268];
    let body = `<rect x="20" y="300" width="600" height="10" rx="4" fill="${C.peach}" stroke="${C.orange}" stroke-width="2.5"/>`;
    const milk = (cx, bottom, w = 40, h = 58) => `<path d="M${cx - w / 2} ${bottom} V${bottom - h + 14} L${cx - w / 2 + 6} ${bottom - h} H${cx + w / 2 - 6} L${cx + w / 2} ${bottom - h + 14} V${bottom} Z" fill="white" stroke="${C.blue}" stroke-width="3" stroke-linejoin="round"/>`
      + `<rect x="${cx - w / 2}" y="${bottom - h * 0.55}" width="${w}" height="${f(h * 0.3)}" fill="${C.sky}" stroke="${C.blue}" stroke-width="2"/>`;
    // 왼쪽: 직접 들기
    body += at(1, 'fin', `<g class="lift">${milk(100, 300)}${g('pulse pulse3', force(100, 232, 100, 122))}</g>`);
    css += steps(id, 'lift', ['translateY(0px)', 'translateY(-30px)'], 1, 0.6);
    body += at(1, 'fin', text(100, 340, '직접 들기', { size: 20 }), 0.2);
    // 오른쪽: 지레
    let beam = `<rect x="240" y="${P[1] - 12}" width="380" height="12" rx="3" fill="${C.peach}" stroke="${C.orange}" stroke-width="3"/>`;
    beam += milk(265, P[1] - 12);
    beam += at(2, 'pop', g('pulse pulse3', force(605, P[1] - 56, 605, P[1] - 15)), 0.2);
    body += `<path d="M${P[0]} ${P[1]} L${P[0] - 22} 300 H${P[0] + 22} Z" fill="${C.line}" stroke="${C.muted}" stroke-width="3" stroke-linejoin="round"/>`;
    body += shown(2, `<g class="lever">${beam}</g>`);
    css += steps(id, 'lever', [rot(P[0], P[1], -20), null, rot(P[0], P[1], 5)], 1.3, 0.6);
    body += at(2, 'fin', text(420, 340, '지레로 들기', { size: 20 }), 0.2);
    // 3칸: 힘 견주기
    body += at(3, 'pop', tag(100, 66, '큰 힘', HOT, { size: 20 }), 0.2);
    const a = 5 * Math.PI / 180, ex = P[0] + 275 * Math.cos(a), ey = P[1] + 275 * Math.sin(a);
    body += at(3, 'pop', tag(560, 196, '작은 힘', HOT, { size: 20 }), 0.6) + shown(3, lead(580, 212, f(ex - 2), f(ey - 58), C.orange));
    // 4칸: 받침점과 지레
    body += ring(P[0], P[1], 18, 4, C.green, 0);
    body += `<g class="b4" style="transform:${rot(P[0], P[1], 5)}"><rect class="flash flash4" x="234" y="${P[1] - 18}" width="392" height="24" rx="8" fill="none" stroke="${C.green}" stroke-width="4"/></g>`;
    body += at(4, 'pop', tag(430, 190, '지레', OK, { size: 26 }), 0.3);
    put('3-1/과학/1/지레', svg(id, body, css));
  })();

  // ════ 빗면: 같은 높이까지 올릴 때 비스듬한 판을 따라 끌면 힘이 덜 든다 ════
  (function () {
    const id = 't31-s1-bitmyeon';
    let css = base(id);
    const H = 160; // 받침 상자 윗면
    let body = `<rect x="20" y="300" width="600" height="10" rx="4" fill="${C.peach}" stroke="${C.orange}" stroke-width="2.5"/>`;
    body += `<rect x="450" y="${H}" width="160" height="140" rx="4" fill="${C.line}" stroke="${C.muted}" stroke-width="3"/>`;
    const pc = (x, y) => `<rect x="${x}" y="${y}" width="46" height="30" rx="9" fill="${C.lilac}" stroke="${C.purple}" stroke-width="3"/><path d="M${x + 6} ${y + 10} H${x + 40}" stroke="${C.purple}" stroke-width="2.5" stroke-dasharray="4 3"/>`;
    // 힘 막대(왼쪽 위): 막대 높이가 드는 힘
    const MX = 50, MT = 40, MH = 120;
    body += `<rect x="${MX}" y="${MT}" width="36" height="${MH}" rx="6" fill="white" stroke="${C.ink}" stroke-width="3"/>`;
    body += `<g class="bar"><rect x="${MX + 5}" y="${MT + 5}" width="26" height="${MH - 10}" rx="3" fill="${C.orange}"/></g>`;
    body += text(MX + 18, MT + MH + 28, '힘', { size: 20 });
    // 판 하나: (170, 300) 에서 상자 위 모서리 (450, 160) 까지
    const X0 = 170, dx = 450 - X0, dy = 300 - H, L = Math.hypot(dx, dy), ang = -Math.atan2(dy, dx) * 180 / Math.PI, sn = dy / L;
    css += `.sc-${id} .bar { transform-box: fill-box; transform-origin: 50% 100%; }` + steps(id, 'bar', ['scaleY(0)', 'scaleY(1)', `scaleY(${f(sn)})`], 0.9, 0.5);
    // 1칸: 똑바로 들기
    body += shown(1, `<g class="up1">${pc(398, 270)}${force(421, 262, 421, 162)}</g>`, 2);
    css += steps(id, 'up1', ['translateY(0px)', 'translateY(-140px)'], 1.3, 0.5);
    body += at(1, 'fin', `<path d="M372 ${H} H450" stroke="${C.muted}" stroke-width="2.5" stroke-dasharray="7 5"/>`, 0.2);
    // 2칸: 빗면 따라 끌기(화살표 길이 = 100 × 기울기)
    const board = `<path d="M${X0} 300 L450 ${H} L450 ${H + 12} L${f(X0 + 12 * dx / dy)} 300 Z" fill="${C.peach}" stroke="${C.orange}" stroke-width="3" stroke-linejoin="round"/>`;
    css += steps(id, 'up2', ['translateX(0px)', null, `translateX(${f(L - 70)}px)`], 1.4, 0.6);
    body += shown(2, board + `<g transform="translate(${X0} 300) rotate(${f(ang)})"><g class="up2">${pc(8, -32)}${force(58, -17, f(58 + 100 * sn), -17)}</g></g>`);
    body += at(2, 'fin', `<path d="M${X0} ${H} H450" stroke="${C.muted}" stroke-width="2.5" stroke-dasharray="7 5"/>`, 0.1) + at(2, 'fin', text(250, H - 12, '같은 높이', { size: 18, color: C.muted }), 0.2);
    // 3칸: 빗면
    body += glowPath(`M${X0} 300 L450 ${H}`, 3, C.green, 0, 8);
    body += at(3, 'pop', tag(390, 272, '빗면', OK, { size: 26 }), 0.3);
    put('3-1/과학/1/빗면', svg(id, body, css));
  })();

  // ════ 힘: 상자를 밀면 미는 쪽으로, 당기면 당기는 쪽으로 움직인다. 무거운 상자는 더 큰 힘이 든다 ════
  (function () {
    const id = 't31-s1-him';
    let css = base(id);
    let body = `<rect x="20" y="290" width="600" height="10" rx="4" fill="${C.peach}" stroke="${C.orange}" stroke-width="2.5"/>`;
    const box = (cx, w, h) => `<rect x="${f(cx - w / 2)}" y="${290 - h}" width="${w}" height="${h}" rx="5" fill="${C.peach}" stroke="${C.orange}" stroke-width="3"/>`
      + `<path d="M${f(cx - w / 2)} ${f(290 - h * 0.62)} H${f(cx + w / 2)} M${cx} ${290 - h} V${f(290 - h * 0.62)}" stroke="${C.orange}" stroke-width="2.5"/>`;
    // 1·2칸: 한 상자를 밀고 당긴다. 상자 가운데는 처음 300.
    let bx = box(300, 100, 80);
    bx += shown(1, force(170, 250, 244, 250) + tag(206, 214, '밀기', HOT, { size: 20 }), 2);
    bx += shown(2, `<path d="M250 250 H156" stroke="${C.ink}" stroke-width="4" stroke-linecap="round"/>` + force(150, 250, 84, 250) + tag(118, 214, '당기기', HOT, { size: 20 }), 3);
    body += shown(1, `<g class="bx">${bx}</g>`, 3);
    css += steps(id, 'bx', ['translateX(0px)', 'translateX(150px)', 'translateX(-30px)'], 1.3, 0.7);
    // 3칸: 가벼운 상자와 무거운 상자
    const books = (cx, top) => [[-36, C.blue], [-12, C.red], [12, C.green], [34, C.purple]].map(([d, col]) => `<rect x="${cx + d - 9}" y="${top - 30}" width="18" height="30" rx="2" fill="${col}"/>`).join('');
    body += at(3, 'fin', `<g class="lt">${box(170, 70, 56)}${g('pulse pulse4', force(76, 262, 128, 262))}</g>`, 0);
    body += at(3, 'fin', `<g class="hv">${books(470, 196)}${box(470, 110, 94)}${g('pulse pulse4', force(296, 244, 408, 244, C.orange, 12))}</g>`, 0.1);
    css += steps(id, 'lt', ['translateX(0px)', null, null, 'translateX(60px)'], 1.2, 0.6) + steps(id, 'hv', ['translateX(0px)', null, null, 'translateX(60px)'], 1.2, 0.6);
    body += at(3, 'fin', text(200, 330, '가벼운 상자', { size: 18 }) + text(500, 330, '무거운 상자', { size: 18 }), 0.3);
    // 4칸: 힘
    body += shown(4, lead(320, 92, 166, 250, C.green) + lead(330, 94, 410, 226, C.green)) + at(4, 'pop', tag(320, 76, '힘', OK, { size: 28 }), 0.3);
    put('3-1/과학/1/힘', svg(id, body, css));
  })();

  // ════ 저울: 전자저울·가정용 저울·용수철저울. 숫자나 바늘·표시 자가 무게를 알려 준다 ════
  (function () {
    const id = 't31-s1-jeoul';
    let css = base(id);
    let body = '';
    // 전자저울(왼쪽): 500원짜리 동전 네 개(한 개 7.7 g)를 올리면 0 g → 31 g(숫자는 미래엔)
    const ex = 115;
    body += at(1, 'rise', `<rect x="${ex - 80}" y="236" width="160" height="56" rx="12" fill="white" stroke="${C.ink}" stroke-width="3"/><rect x="${ex - 92}" y="222" width="184" height="16" rx="6" fill="${C.line}" stroke="${C.muted}" stroke-width="2.5"/><rect x="${ex - 56}" y="246" width="112" height="36" rx="6" fill="${C.ink}"/>`, 0);
    body += at(1, 'drop', [0, 1, 2, 3].map((k) => `<rect x="${ex - 26 + [0, 3, -2, 1][k]}" y="${213 - k * 8}" width="52" height="8" rx="3" fill="white" stroke="${C.muted}" stroke-width="2.5"/>`).join(''), 0.6);
    body += `<g class="b1"><g class="d0">${text(ex + 40, 272, '0 g', { size: 22, color: 'white', anchor: 'end' })}</g><g class="d1">${text(ex + 40, 272, '31 g', { size: 22, color: C.yellow, anchor: 'end' })}</g></g>`;
    css += `.sc-${id} .d1 { opacity: 0; transition: opacity .3s ease 1.2s; } .on1 .sc-${id} .d1 { opacity: 1; } .sc-${id} .d0 { transition: opacity .3s ease 1.2s; } .on1 .sc-${id} .d0 { opacity: 0; }`;
    body += at(1, 'fin', text(ex, 326, '전자저울', { size: 20 }), 0.2);
    // 가정용 저울(가운데): 바늘이 돈다. 한 바퀴 2 kg, 우유 220 g(미래엔)
    const hx = 330, hy = 212, R = 52;
    let dial = `<rect x="${hx - 72}" y="148" width="144" height="144" rx="16" fill="white" stroke="${C.ink}" stroke-width="3"/>`
      + `<rect x="${hx - 84}" y="124" width="168" height="14" rx="6" fill="${C.line}" stroke="${C.muted}" stroke-width="2.5"/><path d="M${hx} 138 V148" stroke="${C.muted}" stroke-width="6"/>`
      + `<circle cx="${hx}" cy="${hy}" r="${R}" fill="${C.paper}" stroke="${C.ink}" stroke-width="2.5"/>`;
    let tk = '';
    for (let k = 0; k < 20; k++) { const a = k * Math.PI / 10, r1 = k % 5 ? R - 7 : R - 13; tk += `M${f(hx + r1 * Math.sin(a))} ${f(hy - r1 * Math.cos(a))} L${f(hx + R * Math.sin(a))} ${f(hy - R * Math.cos(a))} `; }
    dial += `<path d="${tk}" stroke="${C.ink}" stroke-width="2"/>` + text(hx, hy - 20, '0', { size: 18 });
    body += at(2, 'rise', dial, 0);
    body += `<g class="b2"><g class="ndl"><path d="M${hx} ${hy + 8} V${hy - R + 8}" stroke="${C.red}" stroke-width="4" stroke-linecap="round"/></g><circle cx="${hx}" cy="${hy}" r="6" fill="${C.red}"/></g>`;
    css += steps(id, 'ndl', [rot(hx, hy, 0), null, rot(hx, hy, 39.6)], 1, 1.1);
    const milk = `<path d="M${hx - 18} 124 V82 L${hx - 12} 70 H${hx + 12} L${hx + 18} 82 V124 Z" fill="white" stroke="${C.blue}" stroke-width="3" stroke-linejoin="round"/><rect x="${hx - 18}" y="92" width="36" height="16" fill="${C.sky}" stroke="${C.blue}" stroke-width="2"/>`;
    body += at(2, 'drop', milk, 0.6);
    body += at(2, 'pop', tag(hx + 102, 96, '220 g', OK, { size: 20 }), 2);
    body += at(2, 'fin', text(hx, 326, '가정용 저울', { size: 20 }), 0.2);
    // 용수철저울(오른쪽): 걸면 표시 자가 내려간다(눈금만)
    const sx = 548;
    let sp = `<circle cx="${sx}" cy="34" r="11" fill="none" stroke="${C.ink}" stroke-width="4"/><rect x="${sx - 24}" y="46" width="48" height="150" rx="10" fill="white" stroke="${C.ink}" stroke-width="3"/>`;
    let tks = '';
    for (let k = 0; k <= 10; k++) tks += `M${sx + 4} ${70 + k * 11} H${sx + (k % 5 ? 12 : 18)} `;
    sp += `<path d="${tks}" stroke="${C.ink}" stroke-width="2"/>`;
    let zz = `M${sx - 8} 56`;
    for (let i = 1; i <= 6; i++) zz += ` L${i % 2 ? sx - 15 : sx - 1} ${f(56 + 14 * (i - 0.5) / 6)}`;
    zz += ` L${sx - 8} 70`;
    sp += `<g class="spr"><path d="${zz}" fill="none" stroke="${C.muted}" stroke-width="3" vector-effect="non-scaling-stroke"/></g>`;
    sp += `<g class="mv"><path d="M${sx - 18} 70 H${sx + 14}" stroke="${C.red}" stroke-width="5" stroke-linecap="round"/><path d="M${sx - 8} 70 V206 a7 7 0 1 1 -12 4" stroke="${C.ink}" stroke-width="3" fill="none" stroke-linecap="round"/>`
      + `<path d="M${sx - 14} 214 V226" stroke="${C.ink}" stroke-width="2.5"/><circle cx="${sx - 14}" cy="244" r="18" fill="${C.red}" stroke="${C.red}" stroke-width="2"/><path d="M${sx - 14} 226 q6 -4 8 2" stroke="${C.green}" stroke-width="3" fill="none"/></g>`;
    body += at(2, 'rise', sp, 0.2);
    css += `.sc-${id} .spr { transform-box: fill-box; transform-origin: 50% 0; }` + steps(id, 'mv', ['translateY(0px)', null, 'translateY(44px)'], 1, 1.1) + steps(id, 'spr', ['scaleY(1)', null, 'scaleY(4.1)'], 1, 1.1);
    body += at(2, 'fin', text(sx, 326, '용수철저울', { size: 20 }), 0.4);
    // 3칸: 저울
    body += ring(ex + 12, 264, 34, 3, C.green, 0) + ring(hx, hy, R + 6, 3, C.green, 0.2) + ring(sx, 120, 32, 3, C.green, 0.4);
    body += shown(3, lead(196, 50, ex + 10, 200, C.green) + lead(232, 52, hx - 40, 140, C.green) + lead(256, 36, sx - 26, 70, C.green)) + at(3, 'pop', tag(220, 36, '저울', OK, { size: 28 }), 0.3);
    put('3-1/과학/1/저울', svg(id, body, css));
  })();
})(typeof window !== 'undefined' ? window : globalThis);
