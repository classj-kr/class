// 과학 중2-1(8-1) Ⅰ단원 「물질의 특성」 낱말 도식: 입자 모형, 끓는점·녹는점·어는점 그래프, 용해도 곡선, 혼합물 분리 기구(증류 장치·분별 깔때기).
// 물 입자는 C.blue, 녹아 있는 다른 물질은 C.orange, 불순물은 C.red. 뜨거움 C.orange·C.red, 차가움 C.blue.
// 용해도 곡선 값은 질산 칼륨·염화 나트륨의 널리 알려진 값(물 100 g 기준)을 어림해 그렸다.
// 움직임은 transform·opacity·stroke-dashoffset 만 쓴다(모양·위치 속성은 CSS 로 바꾸지 않는다, 아이패드 사파리).
(function (root) {
  'use strict';
  const { C, svg, text, put } = root.FigureKit;
  const f = (n) => +(+n).toFixed(1);
  const dl = (s) => (s ? ` style="animation-delay:${s}s"` : '');
  const g = (cls, inner, s = 0) => `<g class="${cls}"${dl(s)}>${inner}</g>`;
  const at = (n, kind, inner, s = 0) => `<g class="b${n}">${g(`${kind} ${kind}${n}`, inner, s)}</g>`;
  const atH = (n, hide, kind, inner, s = 0) => `<g class="b${n} h${hide}">${g(`${kind} ${kind}${n}`, inner, s)}</g>`;
  const shown = (n, inner, hide) => `<g class="b${n}${hide ? ' h' + hide : ''}">${inner}</g>`;
  const st = (o) => ` style="${Object.entries(o).map(([k, v]) => `${k}:${v}`).join(';')}"`;
  const seeded = (seed) => () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const tw = (s, size) => [...String(s)].reduce((a, c) => a + (/[가-힣]/.test(c) ? 1 : c === ' ' ? 0.3 : /[÷=℃]/.test(c) ? 0.9 : 0.6), 0) * size;
  const HOT = [C.peach, C.orange], RED = [C.peach, C.red], COLD = [C.sky, C.blue], OK = [C.mint, C.green], GRAY = ['white', C.muted], LIL = [C.lilac, C.purple];
  const tag = (cx, cy, label, [fill, stroke] = OK, { size = 20 } = {}) => {
    const w = Math.round(tw(label, size) + size * 1.3), h = Math.round(size * 1.7);
    return `<g><rect x="${f(cx - w / 2)}" y="${f(cy - h / 2)}" width="${w}" height="${h}" rx="${h / 2}" fill="${fill}" stroke="${stroke}" stroke-width="2.5"/>${text(f(cx), f(cy + size * 0.36), label, { size })}</g>`;
  };
  const lead = (x1, y1, x2, y2, color = C.muted, w = 2.5) => `<path d="M${f(x1)} ${f(y1)} L${f(x2)} ${f(y2)}" stroke="${color}" stroke-width="${w}" stroke-linecap="round"/>`;
  const head = (x, y, ang, color, w = 4) => {
    const l = 8 + w * 1.4, p = (d) => `${f(x - l * Math.cos(ang + d))} ${f(y - l * Math.sin(ang + d))}`;
    return `<path d="M${p(-0.5)} L${f(x)} ${f(y)} L${p(0.5)}" stroke="${color}" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  };
  const solid = (x1, y1, x2, y2, color = C.muted, w = 4) => {
    const ang = Math.atan2(y2 - y1, x2 - x1);
    return `<path d="M${f(x1)} ${f(y1)} L${f(x2 - w * Math.cos(ang))} ${f(y2 - w * Math.sin(ang))}" stroke="${color}" stroke-width="${w}" stroke-linecap="round"/>${head(x2, y2, ang, color, w)}`;
  };
  const ring = (cx, cy, r, n, color = C.green, s = 0) => `<g class="b${n}"><circle class="ring ring${n}"${dl(s)} cx="${f(cx)}" cy="${f(cy)}" r="${r}" fill="none" stroke="${color}" stroke-width="4"/></g>`;
  const glowRect = (x, y, w, h, n, color = C.green, s = 0, rx = 14) => `<g class="b${n}"><rect class="flash flash${n}"${dl(s)} x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="${rx}" fill="none" stroke="${color}" stroke-width="5"/></g>`;
  const drawPath = (d, n, color, w = 4, s = 0, extra = '') => `<g class="b${n}"><path class="draw draw${n}"${dl(s)} pathLength="1" d="${d}" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" fill="none"${extra}/></g>`;
  // 칸마다 transform 을 바꾸는 이음. vals[0] 은 처음, vals[k] 는 칸 k(null 은 그대로)
  const steps = (id, cls, vals, sec = 1.2, delay = 0.2) => `.sc-${id} .${cls} { transform: ${vals[0]}; transition: transform ${sec}s ease-in-out ${delay}s; }`
    + vals.slice(1).map((v, i) => (v == null ? '' : `.on${i + 1} .sc-${id} .${cls} { transform: ${v}; }`)).join('');
  // 떨리는 입자(a 떨림 폭 px, d 한 번 떠는 시간 s)
  const jig = (inner, a = 2, d = 0.9, s = 0) => `<g class="jg"${st({ '--a': a + 'px', '--d': d + 's', 'animation-delay': f(-s) + 's' })}>${inner}</g>`;
  const dot = (x, y, r, fill, stroke, sw = 2) => `<circle cx="${f(x)}" cy="${f(y)}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
  const W = (x, y, r = 8) => dot(x, y, r, C.sky, C.blue, 2.2);
  const S = (x, y, r = 6) => dot(x, y, r, C.peach, C.orange, 2.2);

  const base = (id) => {
    let s = `
    .sc-${id} .pop, .sc-${id} .pulse, .sc-${id} .ring { transform-box: fill-box; transform-origin: center; }
    .sc-${id} .flk { transform-box: fill-box; transform-origin: 50% 100%; animation: ${id}-flk .5s ease-in-out infinite alternate; }
    .sc-${id} .draw { stroke-dasharray: 1; stroke-dashoffset: 1; }
    .sc-${id} .ring { opacity: 0; }
    .sc-${id} .jg { animation: ${id}-jg var(--d, .9s) linear infinite; }
    .sc-${id} .bub { animation: ${id}-bub 1.3s ease-in infinite; }
    .sc-${id} .mar { animation: ${id}-mar .7s linear infinite; }
    .sc-${id} .lv { transform-box: fill-box; transform-origin: 50% 100%; }
    @keyframes ${id}-pop { 0% { opacity: 0; transform: scale(.3); } 70% { opacity: 1; transform: scale(1.12); } 100% { opacity: 1; transform: scale(1); } }
    @keyframes ${id}-fin { from { opacity: 0; } to { opacity: 1; } }
    @keyframes ${id}-fout { from { opacity: 1; } to { opacity: 0; } }
    @keyframes ${id}-rise { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
    @keyframes ${id}-drop { from { opacity: 0; transform: translateY(-46px); } to { opacity: 1; transform: none; } }
    @keyframes ${id}-pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.14); } }
    @keyframes ${id}-flash { 0% { opacity: 0; } 20% { opacity: 1; } 40% { opacity: .25; } 60% { opacity: 1; } 80% { opacity: .25; } 100% { opacity: 1; } }
    @keyframes ${id}-ring { 0% { opacity: .9; transform: scale(1); } 100% { opacity: 0; transform: scale(1.6); } }
    @keyframes ${id}-drawk { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
    @keyframes ${id}-flk { from { transform: scale(.92, .86); } to { transform: scale(1.04, 1.06); } }
    @keyframes ${id}-bub { 0% { opacity: 0; transform: translateY(0); } 25% { opacity: 1; } 100% { opacity: 0; transform: translateY(-58px); } }
    @keyframes ${id}-mar { from { stroke-dashoffset: 24; } to { stroke-dashoffset: 0; } }
    @keyframes ${id}-jg { 0%, 100% { transform: translate(0, 0); } 20% { transform: translate(var(--a), calc(var(--a) * -.8)); } 45% { transform: translate(calc(var(--a) * -.6), var(--a)); } 70% { transform: translate(calc(var(--a) * -1), calc(var(--a) * -.4)); } 85% { transform: translate(calc(var(--a) * .5), calc(var(--a) * .7)); } }
    `;
    for (let n = 1; n <= 5; n++) s += `
    .on${n} .sc-${id} .pop${n} { animation: ${id}-pop .5s ease-out both; }
    .on${n} .sc-${id} .fin${n} { animation: ${id}-fin .6s ease-out both; }
    .on${n} .sc-${id} .fout${n} { animation: ${id}-fout .6s ease-out both; }
    .on${n} .sc-${id} .rise${n} { animation: ${id}-rise .5s ease-out both; }
    .on${n} .sc-${id} .drop${n} { animation: ${id}-drop .6s ease-out both; }
    .on${n} .sc-${id} .pulse${n} { animation: ${id}-pulse .7s ease-in-out .3s 2; }
    .on${n} .sc-${id} .flash${n} { animation: ${id}-flash 1.4s ease-in-out both; }
    .on${n} .sc-${id} .ring${n} { animation: ${id}-ring 1.1s ease-out .3s 2; }
    .on${n} .sc-${id} .draw${n} { animation: ${id}-drawk 1.2s ease-in-out .2s both; }`;
    return s;
  };

  // ── 공통 그림 ──
  const beaker = (cx, by, w, h, color = C.muted) => {
    const L = cx - w / 2, R = cx + w / 2, t = by - h;
    return `<path d="M${f(L - 7)} ${f(t)} L${f(L)} ${f(t + 7)} V${f(by - 10)} Q${f(L)} ${f(by)} ${f(L + 10)} ${f(by)} H${f(R - 10)} Q${f(R)} ${f(by)} ${f(R)} ${f(by - 10)} V${f(t + 7)} L${f(R + 7)} ${f(t)}" fill="none" stroke="${color}" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round"/>`;
  };
  const liquid = (cx, by, w, lh, color = C.sky, op = 1, cls = '') => `<rect class="${cls}" x="${f(cx - w / 2 + 2)}" y="${f(by - lh)}" width="${f(w - 4)}" height="${f(lh - 2)}" rx="8" fill="${color}" fill-opacity="${op}"/>`;
  const flame = (x, by, s = 1) => `<g class="flk"><path d="M${f(x)} ${f(by - 46 * s)} C${f(x + 20 * s)} ${f(by - 24 * s)} ${f(x + 18 * s)} ${f(by)} ${f(x)} ${f(by)} C${f(x - 18 * s)} ${f(by)} ${f(x - 20 * s)} ${f(by - 24 * s)} ${f(x)} ${f(by - 46 * s)} Z" fill="${C.orange}"/><path d="M${f(x)} ${f(by - 24 * s)} C${f(x + 9 * s)} ${f(by - 12 * s)} ${f(x + 8 * s)} ${f(by)} ${f(x)} ${f(by)} C${f(x - 8 * s)} ${f(by)} ${f(x - 9 * s)} ${f(by - 12 * s)} ${f(x)} ${f(by - 24 * s)} Z" fill="${C.yellow}"/></g>`;
  // 받침 위 불꽃(가열 기구는 단순한 받침대와 불꽃)
  const burner = (x, top, s = 1) => { const y = top + 6 + 46 * s; return `<rect x="${f(x - 26)}" y="${f(y)}" width="52" height="14" rx="5" fill="${C.line}" stroke="${C.muted}" stroke-width="2.5"/>${flame(x, y - 1, s)}`; };
  // 온도계: 눈금 기둥(cls 로 scaleY), 기둥 위 끝 top, 망울 by
  const thermo = (x, top, by, cls) => `<rect x="${x - 7}" y="${top - 12}" width="14" height="${by - top + 12}" rx="7" fill="white" stroke="${C.muted}" stroke-width="2.5"/>`
    + `<g class="lv ${cls}"><rect x="${x - 3}" y="${top}" width="6" height="${by - top}" fill="${C.red}"/></g><circle cx="${x}" cy="${by + 4}" r="10" fill="${C.red}" stroke="${C.muted}" stroke-width="2.5"/>`;
  const bubbles = (xs, y, s0 = 0) => xs.map((x, k) => `<g class="bub" style="animation-delay:${f(s0 - k * 0.37)}s"><circle cx="${x}" cy="${y}" r="5" fill="white" stroke="${C.blue}" stroke-width="2"/></g>`).join('');
  // 그래프 축: 왼쪽 아래 (x0, y0), 오른쪽 끝 x1, 위 끝 y1
  const axes = (x0, y0, x1, y1, xl = '시간', yl = '온도') => `<path d="M${x0} ${y1} V${y0} H${x1}" stroke="${C.ink}" stroke-width="3" fill="none"/>${head(x0, y1 - 4, -Math.PI / 2, C.ink, 3)}${head(x1 + 4, y0, 0, C.ink, 3)}`
    + text(x1 - 4, y0 + 30, xl, { size: 18, color: C.muted, anchor: 'end' }) + text(x0 + 10, y1 + 4, yl, { size: 18, color: C.muted, anchor: 'start' });
  const hline = (x0, x1, y, label, color = C.muted) => `<path d="M${x0} ${y} H${x1}" stroke="${color}" stroke-width="2" stroke-dasharray="6 6"/>` + (label === '' ? '' : text(x0 - 8, y + 6, label, { size: 18, anchor: 'end', color }));

  // ════ 순물질·혼합물: 물(한 가지 입자)과 소금물(두 가지 입자), 가열 곡선 ════
  const pureMix = (id, focus) => {
    let css = base(id);
    const P = focus === 'pure';
    let body = '';
    const BX = [100, 250], BY = 280, BW = 120, BH = 140;
    const rnd = seeded(P ? 7 : 11);
    BX.forEach((cx, k) => {
      const mine = (k === 0) === P;
      let inner = liquid(cx, BY, BW, 110, C.sky, 0.45);
      for (let i = 0; i < 12; i++) {
        const x = cx - 42 + (i % 4) * 28 + (Math.floor(i / 4) % 2) * 12, y = BY - 86 + Math.floor(i / 4) * 30;
        inner += jig(W(x, y), 2, 0.8 + rnd() * 0.5, rnd());
      }
      if (k === 1) [[cx - 30, BY - 72], [cx + 22, BY - 42], [cx - 6, BY - 18], [cx + 40, BY - 88], [cx - 46, BY - 30]].forEach(([x, y]) => { inner += jig(S(x, y), 2, 0.9 + rnd() * 0.4, rnd()); });
      body += `<g opacity="${mine ? 1 : 0.4}">${inner}${beaker(cx, BY, BW, BH)}${text(cx, BY + 32, k === 0 ? '물' : '소금물', { size: 20 })}</g>`;
    });
    const fx = P ? BX[0] : BX[1];
    body += glowRect(fx - BW / 2 - 14, BY - BH - 14, BW + 28, BH + 28, 1, P ? C.blue : C.orange, 0.2);
    body += at(1, 'pop', tag(fx, 70, P ? '한 가지 입자' : '두 가지 입자', P ? COLD : HOT, { size: 18 }), 0.7);
    if (!P) body += at(1, 'pop', `${S(BX[1] - 40, 112)}${text(BX[1] - 28, 118, '소금', { size: 18, anchor: 'start' })}`, 1.1);
    // 끓는 거품
    body += shown(2, bubbles([fx - 30, fx, fx + 30], BY - 14));
    // 가열 곡선
    const X0 = 390, Y0 = 300, X1 = 620, Y1 = 70, Y100 = 160;
    body += axes(X0, Y0, X1, Y1) + hline(X0, X1, Y100, '100');
    const pureD = `M${X0 + 6} 284 L${X0 + 84} ${Y100} H${X1 - 10}`, mixD = `M${X0 + 6} 284 L${X0 + 92} ${Y100 - 8} Q${X0 + 160} ${Y100 - 20} ${X1 - 10} ${Y100 - 40}`;
    if (P) {
      body += drawPath(pureD, 2, C.blue, 5, 0.1);
      body += at(2, 'pop', tag(X0 + 150, Y100 + 36, '100 ℃ 일정', COLD, { size: 18 }), 1.3);
    } else {
      body += shown(2, `<path d="${pureD}" stroke="${C.blue}" stroke-width="3" stroke-dasharray="6 7" fill="none" opacity=".6"/>`) + at(2, 'fin', text(X1 - 14, Y100 + 28, '물', { size: 18, color: C.blue, anchor: 'end' }), 0.4);
      body += drawPath(mixD, 2, C.orange, 5, 0.2);
      body += at(2, 'pop', tag(X0 + 130, Y100 - 64, '계속 오름', HOT, { size: 18 }), 1.3);
    }
    body += at(3, 'pop', tag(fx, 70, P ? '순물질' : '혼합물', P ? COLD : HOT, { size: 22 }), 0.2);
    body += ring(fx, BY - 60, 70, 3, P ? C.blue : C.orange, 0.4);
    css += `.on3 .sc-${id} .b1 .pop1 { visibility: hidden; }`;
    return svg(id, body, css);
  };
  put('8-1/과학/1/순물질', pureMix('t81-s1-sunmul', 'pure'));
  put('8-1/과학/1/혼합물', pureMix('t81-s1-honhap', 'mix'));

  // ── 물질의 특성: 물의 양이 달라도 끓는 온도는 같다 ──
  (function () {
    const id = 't81-s1-teukseong';
    let css = base(id);
    let body = '';
    const D = [[120, 70, 76, '한 컵', 'ta'], [320, 190, 130, '한 솥', 'tb']];
    D.forEach(([cx, w, h, name, cls], k) => {
      const by = 262;
      body += liquid(cx, by, w, h * 0.72, C.sky, 0.6) + beaker(cx, by, w, h);
      body += burner(cx, by, 0.7);
      body += text(cx, by + 80, name, { size: 20 });
      body += shown(2, bubbles(k ? [cx - 50, cx - 10, cx + 30, cx + 60] : [cx - 14, cx + 12], by - 12));
      const tx = cx + w / 2 - 20;
      body += thermo(tx, by - h - 40, by - 24, cls);
      css += steps(id, cls, ['scaleY(.25)', 'scaleY(.25)', 'scaleY(1)'], 1.2, 0.3);
      body += at(2, 'pop', tag(tx + 44, by - h - 46, '100 ℃', HOT, { size: 18 }), 1.5);
    });
    body += at(1, 'pop', tag(220, 46, '양이 다름', GRAY, { size: 20 }), 0.4);
    // 3칸: 물질의 특성 예
    body += at(3, 'pop', tag(530, 120, '끓는점', OK, { size: 20 }), 0.2) + at(3, 'pop', tag(530, 180, '밀도', OK, { size: 20 }), 0.45) + at(3, 'pop', tag(530, 240, '용해도', OK, { size: 20 }), 0.7);
    body += at(3, 'pop', tag(530, 46, '물질의 특성', LIL, { size: 20 }), 1);
    body += shown(3, lead(530, 64, 530, 98, C.purple));
    return put('8-1/과학/1/물질의 특성', svg(id, body, css));
  })();

  // ── 밀도: 부피가 같은 두 상자, 빽빽한 쪽이 더 무겁다 ──
  (function () {
    const id = 't81-s1-mildo';
    let css = base(id);
    let body = '';
    const PV = [260, 268], A = 8 * Math.PI / 180;
    const rotP = (x, y) => { const dx = x - PV[0], dy = y - PV[1]; return [PV[0] + dx * Math.cos(A) - dy * Math.sin(A), PV[1] + dx * Math.sin(A) + dy * Math.cos(A)]; };
    // 받침
    body += `<path d="M${PV[0]} ${PV[1]} L${PV[0] - 30} 330 H${PV[0] + 30} Z" fill="${C.line}" stroke="${C.muted}" stroke-width="3" stroke-linejoin="round"/><path d="M150 330 H370" stroke="${C.muted}" stroke-width="4" stroke-linecap="round"/>`;
    let beam = `<rect x="80" y="${PV[1] - 6}" width="360" height="12" rx="6" fill="white" stroke="${C.muted}" stroke-width="3"/>`;
    const box = (x0, n, fill, stroke, r) => {
      let s = `<rect x="${x0}" y="${PV[1] - 106}" width="100" height="100" rx="6" fill="white" stroke="${stroke}" stroke-width="3.5"/>`;
      const rr = seeded(n * 13);
      const k = Math.round(Math.sqrt(n));
      for (let i = 0; i < n; i++) {
        const cx = x0 + 50 + ((i % k) - (k - 1) / 2) * (84 / k), cy = PV[1] - 56 + (Math.floor(i / k) - (k - 1) / 2) * (84 / k);
        s += jig(dot(cx, cy, r, fill, stroke, 2), 1.5, 0.8 + rr() * 0.6, rr());
      }
      return s;
    };
    beam += box(100, 4, C.mint, C.green, 11) + box(320, 16, C.lilac, C.purple, 9);
    body += `<g class="beam">${beam}</g>`;
    css += `.sc-${id} .beam { transform-origin: ${PV[0]}px ${PV[1]}px; }` + steps(id, 'beam', ['rotate(0deg)', 'rotate(0deg)', 'rotate(8deg)'], 1.1, 0.2);
    // 1칸: 크기 같음
    body += atH(1, 2, 'fin', `<path d="M100 ${PV[1] - 122} H200 M320 ${PV[1] - 122} H420" stroke="${C.blue}" stroke-width="3"/>${head(100, PV[1] - 122, Math.PI, C.blue, 3)}${head(200, PV[1] - 122, 0, C.blue, 3)}${head(320, PV[1] - 122, Math.PI, C.blue, 3)}${head(420, PV[1] - 122, 0, C.blue, 3)}`, 0.2);
    body += atH(1, 2, 'pop', tag(260, 92, '부피 같음', COLD, { size: 20 }), 0.6);
    // 2칸: 기울어진 뒤 상자 위에 무게
    const L = rotP(150, PV[1] - 106), R = rotP(370, PV[1] - 106);
    body += atH(2, 3, 'pop', tag(L[0], L[1] - 30, '가벼움', GRAY, { size: 18 }), 1.3) + at(2, 'pop', tag(R[0], R[1] - 30, '무거움', LIL, { size: 18 }), 1.4);
    // 3칸: 밀도 = 질량 ÷ 부피
    body += at(3, 'pop', tag(L[0], L[1] - 30, '밀도 작음', OK, { size: 18 }), 0.2);
    body += at(3, 'pop', tag(R[0] + 12, R[1] - 72, '밀도 큼', LIL, { size: 20 }), 0.5);
    body += ring(R[0] + 4, R[1] + 50, 64, 3, C.purple, 0.7);
    body += at(3, 'pop', tag(540, 140, '밀도', LIL, { size: 22 }), 0.9) + at(3, 'fin', text(540, 196, '= 질량 ÷ 부피', { size: 20 }), 1.2);
    css += `.on3 .sc-${id} .b2 .pop2 { visibility: hidden; }`;
    return put('8-1/과학/1/밀도', svg(id, body, css));
  })();

  // ── 용해도: 20 ℃ 물 100 g 에 소금을 넣으면 36 g 까지 녹고, 더 넣은 것은 바닥에 남는다 ──
  (function () {
    const id = 't81-s1-yonghaedo';
    let css = base(id);
    let body = '';
    const cx = 200, by = 300, bw = 190, bh = 190;
    body += liquid(cx, by, bw, 150, C.sky, 0.5) + beaker(cx, by, bw, bh);
    body += tag(cx, by + 34, '물 100 g', COLD, { size: 18 });
    body += tag(cx - 120, 40, '20 ℃', GRAY, { size: 18 });
    // 숟가락으로 넣는 알갱이(떨어져 녹아 사라짐 / 마지막은 바닥에 쌓임)
    const grains = (x0, y0) => { let s = ''; for (let i = 0; i < 7; i++) s += `<rect x="${f(x0 + (i % 4) * 10 - 16)}" y="${f(y0 + Math.floor(i / 4) * 9)}" width="7" height="7" fill="white" stroke="${C.muted}" stroke-width="1.6"/>`; return s; };
    const drops = (n, k, keep) => `<g class="b${n}"><g class="${keep ? 'gdk' : 'gd' + n}" style="animation-delay:${f(k * 0.6)}s">${grains(cx - 30 + k * 34, 70)}</g></g>`;
    body += drops(1, 0) + drops(1, 1) + drops(2, 0) + drops(2, 1, true);
    css += `
      .sc-${id} .gd1, .sc-${id} .gd2, .sc-${id} .gdk { opacity: 0; }
      @keyframes ${id}-gd { 0% { opacity: 0; transform: translateY(0); } 15% { opacity: 1; } 55% { opacity: 1; transform: translateY(120px); } 100% { opacity: 0; transform: translateY(150px); } }
      @keyframes ${id}-gk { 0% { opacity: 0; transform: translateY(0); } 15% { opacity: 1; } 100% { opacity: 1; transform: translateY(206px); } }
      .on1 .sc-${id} .gd1 { animation: ${id}-gd 1s ease-in both; }
      .on2 .sc-${id} .gd2 { animation: ${id}-gd 1s ease-in both; }
      .on2 .sc-${id} .gdk { animation: ${id}-gk .9s ease-in both; }`;
    // 바닥에 남은 알갱이 무더기
    body += at(2, 'fin', `<path d="M${cx - 34} ${by - 3} Q${cx + 4} ${by - 34} ${cx + 42} ${by - 3} Z" fill="white" stroke="${C.muted}" stroke-width="2"/>`, 1.2);
    body += at(2, 'pop', tag(348, by - 40, '더 안 녹음', RED, { size: 18 }), 1.5) + at(2, 'fin', lead(300, by - 34, cx + 40, by - 14), 1.5);
    // 녹아 물속에 퍼진 소금 입자(1칸 몇 개, 2칸 더)
    [[cx - 60, by - 110], [cx + 40, by - 90], [cx - 20, by - 60], [cx + 66, by - 120], [cx - 70, by - 40], [cx + 10, by - 124]].forEach(([x, y], k) => { body += at(k < 4 ? 1 : 2, 'fin', jig(S(x, y, 6), 2, 0.9, k * 0.3), f(0.9 + (k % 4) * 0.15)); });
    // 녹은 양 막대(0~40 g)
    const gx = 466, gy0 = 300, gpx = 5.2;
    body += `<path d="M${gx} ${gy0 - 220} V${gy0} H${gx + 80}" stroke="${C.ink}" stroke-width="3" fill="none"/>`;
    [0, 10, 20, 30, 40].forEach((v) => { const y = gy0 - v * gpx; body += `<path d="M${gx - 8} ${y} H${gx}" stroke="${C.ink}" stroke-width="2.5"/>` + text(gx - 14, y + 6, v, { size: 18, anchor: 'end' }); });
    body += text(gx + 40, gy0 + 34, '녹은 양(g)', { size: 18, color: C.muted });
    body += `<g class="lv bar"><rect x="${gx + 14}" y="${gy0 - 36 * gpx}" width="52" height="${36 * gpx}" fill="${C.peach}" stroke="${C.orange}" stroke-width="3"/></g>`;
    css += steps(id, 'bar', ['scaleY(0)', 'scaleY(.67)', 'scaleY(1)'], 1, 0.6);
    body += at(3, 'pop', tag(gx + 40, gy0 - 36 * gpx - 30, '36 g', HOT, { size: 20 }), 0.2);
    body += glowRect(gx + 6, gy0 - 36 * gpx - 8, 68, 36 * gpx + 16, 3, C.orange, 0.4, 8);
    body += at(3, 'pop', tag(588, 150, '용해도', LIL, { size: 22 }), 0.8);
    return put('8-1/과학/1/용해도', svg(id, body, css));
  })();

  // ── 용해도 곡선: 온도마다 용해도를 점으로 찍고 이은 굽은 선 ──
  (function () {
    const id = 't81-s1-gokseon';
    let css = base(id);
    let body = '';
    const X0 = 110, Y0 = 300, X = (t) => X0 + t * 5.6, Y = (v) => Y0 - v * 1.3;
    body += `<path d="M${X0} 52 V${Y0} H${X(80) + 40}" stroke="${C.ink}" stroke-width="3" fill="none"/>${head(X0, 48, -Math.PI / 2, C.ink, 3)}${head(X(80) + 44, Y0, 0, C.ink, 3)}`;
    [0, 20, 40, 60, 80].forEach((t) => { body += `<path d="M${X(t)} ${Y0} V${Y0 + 8}" stroke="${C.ink}" stroke-width="2.5"/>` + text(X(t), Y0 + 30, t, { size: 18 }); });
    [50, 100, 150].forEach((v) => { body += `<path d="M${X0 - 8} ${Y(v)} H${X0}" stroke="${C.ink}" stroke-width="2.5"/><path d="M${X0} ${Y(v)} H${X(80) + 30}" stroke="${C.line}" stroke-width="1.5"/>` + text(X0 - 14, Y(v) + 6, v, { size: 18, anchor: 'end' }); });
    body += text(X(80) + 40, Y0 - 14, '온도(℃)', { size: 18, color: C.muted, anchor: 'end' }) + text(X0 + 12, 60, '용해도(g/물 100 g)', { size: 18, color: C.muted, anchor: 'start' });
    // 질산 칼륨(가파름), 염화 나트륨(거의 평평)
    const KN = [[0, 13], [20, 32], [40, 64], [60, 109], [80, 169]], NA = [[0, 36], [20, 36], [40, 37], [60, 37], [80, 38]];
    KN.forEach(([t, v], k) => { body += at(1, 'pop', dot(X(t), Y(v), 7, C.orange, 'white', 2.5), f(0.2 + k * 0.25)); });
    NA.forEach(([t, v], k) => { body += at(1, 'pop', dot(X(t), Y(v), 7, C.blue, 'white', 2.5), f(0.3 + k * 0.25)); });
    const smooth = (P) => { let d = `M${f(X(P[0][0]))} ${f(Y(P[0][1]))}`; for (let i = 1; i < P.length; i++) { const p0 = P[i - 1], p1 = P[i], pm = P[Math.max(0, i - 2)], pn = P[Math.min(P.length - 1, i + 1)]; const c1 = [X(p0[0]) + (X(p1[0]) - X(pm[0])) / 6, Y(p0[1]) + (Y(p1[1]) - Y(pm[1])) / 6], c2 = [X(p1[0]) - (X(pn[0]) - X(p0[0])) / 6, Y(p1[1]) - (Y(pn[1]) - Y(p0[1])) / 6]; d += ` C${f(c1[0])} ${f(c1[1])} ${f(c2[0])} ${f(c2[1])} ${f(X(p1[0]))} ${f(Y(p1[1]))}`; } return d; };
    body += drawPath(smooth(KN), 2, C.orange, 5, 0) + drawPath(smooth(NA), 2, C.blue, 5, 0.2);
    body += at(2, 'fin', text(X(80) - 16, Y(169) + 6, '질산 칼륨', { size: 18, color: C.orange, anchor: 'end' }), 1.2);
    body += at(2, 'fin', text(X(80) + 34, Y(38) - 16, '염화 나트륨', { size: 18, color: C.blue, anchor: 'end' }), 1.3);
    body += at(3, 'pop', tag(300, 110, '용해도 곡선', LIL, { size: 22 }), 0.2);
    body += shown(3, `<g class="pulse pulse3">${dot(X(60), Y(109), 9, C.orange, 'white', 2.5)}</g>`);
    return put('8-1/과학/1/용해도 곡선', svg(id, body, css));
  })();

  // ── 포화 용액: 같은 온도에서 왼쪽 용액에는 더 녹고, 오른쪽 용액에는 더 녹지 않는다 ──
  (function () {
    const id = 't81-s1-pohwa';
    let css = base(id);
    let body = '';
    const by = 300, bw = 170, bh = 170;
    [[160, 5], [460, 20]].forEach(([cx, n], k) => {
      let inner = liquid(cx, by, bw, 136, C.sky, 0.5);
      const rr = seeded(5 + k * 9);
      for (let i = 0; i < n; i++) {
        const cols = k ? 5 : 3, x = cx - (cols - 1) * 15 + (i % cols) * 30 + (Math.floor(i / cols) % 2) * 8, y = by - 110 + Math.floor(i / cols) * (k ? 24 : 34) + (k ? 0 : 20);
        inner += jig(S(x, y, 6), 2, 0.8 + rr() * 0.5, rr());
      }
      body += inner + beaker(cx, by, bw, bh);
      body += text(cx, by + 34, '20 ℃ 물 100 g', { size: 18, color: C.muted });
      // 떨어지는 알갱이
      const n2 = k + 1;
      body += `<g class="b${n2}"><g class="${k ? 'gk' : 'gd'}"><rect x="${cx - 9}" y="64" width="18" height="18" rx="2" fill="white" stroke="${C.ink}" stroke-width="2.5"/></g></g>`;
    });
    css += `
      .sc-${id} .gd, .sc-${id} .gk { opacity: 0; }
      @keyframes ${id}-gd { 0% { opacity: 0; transform: translateY(0); } 15% { opacity: 1; } 55% { opacity: 1; transform: translateY(130px); } 100% { opacity: 0; transform: translateY(160px); } }
      @keyframes ${id}-gk { 0% { opacity: 0; transform: translateY(0); } 15% { opacity: 1; } 100% { opacity: 1; transform: translateY(212px); } }
      .on1 .sc-${id} .gd { animation: ${id}-gd 1.1s ease-in .2s both; }
      .on2 .sc-${id} .gk { animation: ${id}-gk 1s ease-in .2s both; }`;
    body += at(1, 'pop', tag(160, 46, '녹음', COLD, { size: 20 }), 1.2) + at(1, 'fin', jig(S(170, 230, 6), 2, 0.9), 1.1);
    body += at(2, 'pop', tag(460, 46, '안 녹고 남음', RED, { size: 20 }), 1.2);
    body += at(3, 'pop', tag(460, 46, '포화 용액', LIL, { size: 22 }), 0.2);
    body += ring(460, by - 70, 80, 3, C.purple, 0.4);
    css += `.on3 .sc-${id} .b2 .pop2 { visibility: hidden; }`;
    return put('8-1/과학/1/포화 용액', svg(id, body, css));
  })();

  // ── 끓는점·녹는점·어는점: 그릇 + 온도 그래프 ──
  // pts: 그래프 꺾은선 [x, y] 셋 이상(가운데 두 점 사이가 평평한 구간), lvl: 온도계 높이 비율 [처음, 1칸, 2칸]
  const curveScene = (id, o) => {
    let css = base(id);
    let body = '';
    const X0 = 330, Y0 = 300, X1 = 620, Y1 = 66;
    body += axes(X0, Y0, X1, Y1) + hline(X0, X1, o.yFlat, o.flatLabel);
    // 그릇
    body += o.vessel;
    const [p0, p1, p2, p3] = o.pts;
    body += drawPath(`M${p0[0]} ${p0[1]} L${p1[0]} ${p1[1]}`, 1, o.color, 5, 0.1);
    body += drawPath(`M${p1[0]} ${p1[1]} L${p2[0]} ${p2[1]}`, 2, o.color, 5, 0.1);
    if (p3) body += drawPath(`M${p2[0]} ${p2[1]} L${p3[0]} ${p3[1]}`, 2, o.color, 5, 1.1);
    css += o.css || '';
    body += o.extra || '';
    return { body, css };
  };

  // 끓는점
  (function () {
    const id = 't81-s1-kkeul';
    const cx = 150, by = 250;
    let vessel = liquid(cx, by, 130, 96, C.sky, 0.6) + beaker(cx, by, 130, 140) + burner(cx, by, 0.9);
    vessel += thermo(cx + 30, 70, by - 20, 'tm');
    vessel += shown(2, bubbles([cx - 40, cx - 12, cx + 8], by - 12));
    const yF = 150;
    const { body, css } = curveScene(id, {
      vessel, yFlat: yF, flatLabel: '100', color: C.orange,
      pts: [[338, 286], [440, yF], [610, yF]],
      css: steps(id, 'tm', ['scaleY(.2)', 'scaleY(.8)', 'scaleY(1)'], 1.2, 0.2),
      extra: at(1, 'pop', tag(420, 230, '온도 오름', HOT, { size: 18 }), 1.2)
        + at(2, 'pop', tag(525, 112, '온도 그대로', HOT, { size: 18 }), 1.3)
        + at(2, 'fin', text(cx, by + 88, '끓는 중', { size: 18, color: C.muted }), 0.4)
        + at(3, 'pop', tag(525, 190, '끓는점 100 ℃', RED, { size: 20 }), 0.2)
        + glowRect(436, yF - 16, 180, 32, 3, C.red, 0.5, 16)
    });
    return put('8-1/과학/1/끓는점', svg(id, body, css + `.on3 .sc-${id} .b2 .pop2 { visibility: hidden; }`));
  })();

  // 얼음 조각
  const ice = (x, y, s = 26) => `<rect x="${f(x - s / 2)}" y="${f(y - s / 2)}" width="${s}" height="${s}" rx="5" fill="white" stroke="${C.blue}" stroke-width="2.5"/><path d="M${f(x - s / 4)} ${f(y - s / 5)} l${f(s / 6)} ${f(-s / 8)}" stroke="${C.blue}" stroke-width="2" stroke-linecap="round"/>`;

  // 녹는점: 얼음을 데우면 0 ℃ 에서 녹는 동안 온도가 그대로
  (function () {
    const id = 't81-s1-nokneun';
    const cx = 150, by = 250;
    let vessel = `<g class="lv wl">${liquid(cx, by, 130, 70, C.sky, 0.6)}</g>` + beaker(cx, by, 130, 140) + burner(cx, by, 0.7);
    [[cx - 34, by - 26], [cx, by - 30], [cx + 30, by - 24], [cx - 16, by - 56], [cx + 18, by - 58]].forEach(([x, y], k) => { vessel += `<g class="ic" style="transition-delay:${f(0.2 + k * 0.12)}s">${ice(x, y)}</g>`; });
    vessel += thermo(cx + 44, 70, by - 20, 'tm');
    const yF = 220;
    const css0 = `.sc-${id} .ic { transform-box: fill-box; transform-origin: center; transition: transform 1.2s ease-in-out, opacity 1.2s ease-in-out; }
      .on2 .sc-${id} .ic { transform: scale(.3); opacity: 0; }`
      + steps(id, 'wl', ['scaleY(.15)', 'scaleY(.15)', 'scaleY(1)'], 1.4, 0.3) + steps(id, 'tm', ['scaleY(.1)', 'scaleY(.45)', 'scaleY(.45)'], 1.1, 0.2);
    const { body, css } = curveScene(id, {
      vessel, yFlat: yF, flatLabel: '0', color: C.blue,
      pts: [[338, 286], [400, yF], [560, yF], [610, 150]],
      css: css0,
      extra: at(1, 'pop', tag(450, 288, '온도 오름', HOT, { size: 18 }), 1.2)
        + at(2, 'pop', tag(480, 182, '0 ℃ 그대로', COLD, { size: 18 }), 1.3)
        + at(2, 'fin', text(cx, by + 88, '녹는 중', { size: 18, color: C.muted }), 0.4)
        + at(3, 'pop', tag(480, 120, '녹는점 0 ℃', COLD, { size: 20 }), 0.2)
        + glowRect(396, yF - 16, 170, 32, 3, C.blue, 0.5, 16)
    });
    return put('8-1/과학/1/녹는점', svg(id, body, css + `.on3 .sc-${id} .b2 .pop2 { visibility: hidden; }`));
  })();

  // 어는점: 물을 식히면 0 ℃ 에서 어는 동안 온도가 그대로(녹는점과 같은 온도)
  (function () {
    const id = 't81-s1-eoneun';
    const cx = 150, by = 260;
    // 얼음이 든 비커 속 시험관
    let vessel = liquid(cx, by, 150, 100, C.sky, 0.35) + beaker(cx, by, 150, 140);
    [[cx - 52, by - 22], [cx + 50, by - 26], [cx - 50, by - 60], [cx + 52, by - 64]].forEach(([x, y]) => { vessel += ice(x, y, 24); });
    vessel += `<rect x="${cx - 18}" y="${by - 104}" width="36" height="92" rx="4" fill="${C.sky}" fill-opacity=".9"/>`;
    vessel += `<g class="b2"><g class="frz"><rect x="${cx - 18}" y="${by - 104}" width="36" height="92" rx="4" fill="white" stroke="${C.blue}" stroke-width="2"/><path d="M${cx - 10} ${by - 90} l12 10 M${cx + 6} ${by - 60} l-10 12 M${cx - 8} ${by - 40} l12 6" stroke="${C.blue}" stroke-width="2" stroke-linecap="round"/></g></g>`;
    vessel += `<path d="M${cx - 22} ${by - 160} V${by - 18} Q${cx - 22} ${by - 4} ${cx} ${by - 4} Q${cx + 22} ${by - 4} ${cx + 22} ${by - 18} V${by - 160}" fill="none" stroke="${C.muted}" stroke-width="3"/>`;
    vessel += at(1, 'fin', `<g class="pulse pulse1">${solid(cx - 96, by - 70, cx - 84, by - 70, C.blue, 3)}${solid(cx + 96, by - 70, cx + 84, by - 70, C.blue, 3)}</g>`, 0.2);
    const yF = 220;
    const css0 = `.sc-${id} .frz { transform-box: fill-box; transform-origin: 50% 100%; }
      @keyframes ${id}-frz { from { transform: scaleY(0); opacity: .3; } to { transform: scaleY(1); opacity: 1; } }
      .on2 .sc-${id} .frz { animation: ${id}-frz 1.4s ease-in-out .2s both; }`;
    const ghost = `<path d="M338 286 L400 ${yF} L560 ${yF} L610 150" stroke="${C.orange}" stroke-width="3" stroke-dasharray="7 7" fill="none"/>`;
    const { body, css } = curveScene(id, {
      vessel, yFlat: yF, flatLabel: '0', color: C.blue,
      pts: [[338, 110], [400, yF], [560, yF], [610, 290]],
      css: css0,
      extra: at(1, 'pop', tag(470, 120, '온도 내려감', COLD, { size: 18 }), 1.2)
        + at(2, 'pop', tag(480, 258, '0 ℃ 그대로', COLD, { size: 18 }), 1.3)
        + at(2, 'fin', text(cx, by + 60, '어는 중', { size: 18, color: C.muted }), 0.4)
        + at(3, 'fin', ghost, 0.2)
        + at(3, 'pop', tag(480, 258, '어는점 0 ℃', COLD, { size: 20 }), 0.3)
        + at(3, 'pop', tag(560, 150, '= 녹는점', HOT, { size: 18 }), 0.9)
    });
    return put('8-1/과학/1/어는점', svg(id, body, css + `.on3 .sc-${id} .b2 .pop2 { visibility: hidden; } .on3 .sc-${id} .b1 .pop1 { visibility: hidden; }`));
  })();

  // ── 증류: 물과 에탄올 혼합물을 데우면 끓는점이 낮은 에탄올이 먼저 기체로 나오고, 찬물 속에서 식어 액체로 모인다 ──
  (function () {
    const id = 't81-s1-jeungryu';
    let css = base(id);
    let body = '';
    const fx = 150, fy = 210, fr = 62;
    // 둥근 플라스크
    body += `<path d="M${fx - fr} ${fy} A${fr} ${fr} 0 1 0 ${fx + fr} ${fy} Z" fill="${C.sky}" fill-opacity=".55"/>`;
    const rr = seeded(21);
    for (let i = 0; i < 10; i++) {
      const x = fx - 44 + (i % 5) * 22, y = fy + 14 + Math.floor(i / 5) * 24;
      body += jig(i % 2 ? W(x, y, 7) : S(x, y, 6), 2, 0.8 + rr() * 0.4, rr());
    }
    body += `<path d="M${fx - 14} ${fy - fr + 4} A${fr} ${fr} 0 1 0 ${fx + 14} ${fy - fr + 4} V${fy - fr - 60} H${fx - 14} Z" fill="none" stroke="${C.muted}" stroke-width="3.5" stroke-linejoin="round"/>`;
    body += burner(fx, fy + fr, 0.8);
    // 관: 플라스크 목 위 → 오른쪽 아래 시험관
    const tube = `M${fx} ${fy - fr - 40} V${fy - fr - 70} H420 V180`;
    body += `<path d="${tube}" stroke="${C.muted}" stroke-width="12" fill="none" stroke-linejoin="round"/><path d="${tube}" stroke="white" stroke-width="6" fill="none" stroke-linejoin="round"/>`;
    body += shown(1, `<path class="mar" d="${tube}" stroke="${C.orange}" stroke-width="5" stroke-dasharray="10 14" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`);
    // 얼음물 비커와 시험관
    const bx = 420, bby = 310;
    body += liquid(bx, bby, 150, 100, C.sky, 0.45) + beaker(bx, bby, 150, 130);
    [[bx - 52, bby - 24], [bx + 52, bby - 30], [bx + 50, bby - 66]].forEach(([x, y]) => { body += ice(x, y, 22); });
    body += `<g class="lv tl"><rect x="${bx - 14}" y="${bby - 70}" width="28" height="54" rx="4" fill="${C.peach}"/></g>`;
    body += `<path d="M${bx - 18} 160 V${bby - 26} Q${bx - 18} ${bby - 12} ${bx} ${bby - 12} Q${bx + 18} ${bby - 12} ${bx + 18} ${bby - 26} V160" fill="none" stroke="${C.muted}" stroke-width="3"/>`;
    body += shown(2, [0, 0.45, 0.9].map((s) => `<g class="drip" style="animation-delay:${s}s"><circle cx="${bx}" cy="190" r="5" fill="${C.orange}"/></g>`).join(''));
    css += steps(id, 'tl', ['scaleY(0)', 'scaleY(0)', 'scaleY(1)'], 1.4, 0.4)
      + `@keyframes ${id}-drip { 0% { opacity: 0; transform: translateY(0); } 20% { opacity: 1; } 100% { opacity: 0; transform: translateY(60px); } }
      .sc-${id} .drip { animation: ${id}-drip 1.3s ease-in infinite; }`;
    // 이름표
    body += at(1, 'pop', tag(fx, 40, '에탄올 78 ℃', HOT, { size: 18 }), 0.4);
    body += at(1, 'pop', tag(fx + 270, 40, '먼저 끓어 나옴', HOT, { size: 18 }), 1);
    body += `${S(236, 340, 6)}${text(248, 346, '에탄올', { size: 18, anchor: 'start' })}${W(322, 340, 7)}${text(334, 346, '물', { size: 18, anchor: 'start' })}`;
    body += at(2, 'pop', tag(560, 220, '식어서 액체', COLD, { size: 18 }), 1.2);
    body += at(3, 'pop', tag(56, 120, '증류', LIL, { size: 22 }), 0.2) + at(3, 'pop', tag(fx + 270, 40, '끓는점 차', LIL, { size: 18 }), 0.5);
    css += `.on3 .sc-${id} .b1 .pop1 { visibility: hidden; }`;
    return put('8-1/과학/1/증류', svg(id, body, css));
  })();

  // ── 재결정: 불순물이 섞인 가루를 뜨거운 물에 녹였다가 식히면 순수한 결정만 다시 생긴다 ──
  (function () {
    const id = 't81-s1-jaegyeol';
    let css = base(id);
    let body = '';
    const cx = 220, by = 270, bw = 180, bh = 170;
    body += liquid(cx, by, bw, 130, C.sky, 0.45);
    // 가루 더미(흰 알갱이 + 붉은 불순물 몇 개) → 1칸에 녹아 사라짐
    let pile = `<path d="M${cx - 60} ${by - 4} Q${cx} ${by - 60} ${cx + 60} ${by - 4} Z" fill="white" stroke="${C.muted}" stroke-width="2"/>`;
    [[cx - 20, by - 18], [cx + 18, by - 26], [cx + 2, by - 12]].forEach(([x, y]) => { pile += dot(x, y, 4, C.red, 'white', 1.5); });
    body += `<g class="pile">${pile}</g>`;
    css += `.sc-${id} .pile { transform-box: fill-box; transform-origin: 50% 100%; transition: transform 1.2s ease-in, opacity 1.2s ease-in; } .on1 .sc-${id} .pile { transform: scale(.3); opacity: 0; }`;
    // 녹아 떠다니는 입자(흰 용질 + 붉은 불순물)
    const rr = seeded(33);
    let sol = '';
    for (let i = 0; i < 12; i++) {
      const x = cx - 66 + (i % 6) * 26, y = by - 104 + Math.floor(i / 6) * 34;
      sol += jig(dot(x, y, 6, 'white', C.muted, 2), 2.5, 0.6 + rr() * 0.3, rr());
    }
    const imp = [[cx - 50, by - 72], [cx + 40, by - 98], [cx + 8, by - 80]];
    let impD = '';
    imp.forEach(([x, y]) => { impD += jig(dot(x, y, 6, C.red, 'white', 1.5), 2.5, 0.7, rr()); });
    body += `<g class="b1 h2">${sol}</g><g class="b1">${impD}</g>`;
    body += beaker(cx, by, bw, bh);
    // 불꽃(1칸) → 얼음물(2칸)
    body += shown(1, burner(cx, by, 0.9), 2);
    body += at(1, 'pop', tag(cx, 50, '뜨거운 물', HOT, { size: 18 }), 0.4);
    body += shown(2, `<g class="pulse pulse2">${solid(cx - 130, by - 70, cx - 104, by - 70, C.blue, 4)}${solid(cx + 130, by - 70, cx + 104, by - 70, C.blue, 4)}</g>`);
    body += at(2, 'pop', tag(cx, 50, '식힘', COLD, { size: 18 }), 0.2);
    // 2칸: 하얀 결정이 바닥에 생긴다
    const cr = (x, y, s = 1) => `<path d="M${f(x)} ${f(y - 12 * s)} L${f(x + 10 * s)} ${f(y - 6 * s)} V${f(y + 6 * s)} L${f(x)} ${f(y + 12 * s)} L${f(x - 10 * s)} ${f(y + 6 * s)} V${f(y - 6 * s)} Z" fill="white" stroke="${C.ink}" stroke-width="2.2" stroke-linejoin="round"/>`;
    [[cx - 52, by - 16], [cx - 24, by - 14], [cx + 4, by - 18], [cx + 32, by - 14], [cx + 58, by - 16], [cx - 38, by - 38], [cx + 18, by - 40]].forEach(([x, y], k) => { body += at(2, 'pop', cr(x, y), f(0.5 + k * 0.12)); });
    body += at(2, 'pop', tag(470, 170, '하얀 결정만', OK, { size: 18 }), 1.4);
    body += at(2, 'fin', `${lead(400, 182, cx + 70, by - 24)}`, 1.4);
    body += at(2, 'pop', `${dot(430, 250, 7, C.red, 'white', 1.5)}${text(444, 256, '불순물은 녹은 채', { size: 18, anchor: 'start' })}`, 1.6);
    body += at(3, 'pop', tag(470, 110, '재결정', LIL, { size: 22 }), 0.2);
    body += ring(cx, by - 24, 74, 3, C.purple, 0.4);
    css += `.on2 .sc-${id} .b1 .pop1 { visibility: hidden; }`;
    return put('8-1/과학/1/재결정', svg(id, body, css));
  })();

  // ── 분별 깔때기: 섞이지 않는 물과 식용유가 두 층으로 나뉘고, 아래 꼭지로 아래층(물)부터 받는다 ──
  (function () {
    const id = 't81-s1-bunbyeol';
    let css = base(id);
    let body = '';
    const cx = 260;
    // 스탠드
    body += `<path d="M120 345 H250 M140 345 V40" stroke="${C.muted}" stroke-width="6" stroke-linecap="round"/><path d="M140 150 H${cx - 52}" stroke="${C.muted}" stroke-width="4"/>`;
    // 깔때기 몸통(위 목 → 둥근 어깨 → 아래로 좁아짐)
    const bodyD = `M${cx - 14} 58 V84 C${cx - 70} 100 ${cx - 72} 150 ${cx - 50} 176 L${cx - 8} 244 H${cx + 8} L${cx + 50} 176 C${cx + 72} 150 ${cx + 70} 100 ${cx + 14} 84 V58 Z`;
    body += `<defs><clipPath id="${id}-cl"><path d="${bodyD}"/></clipPath></defs>`;
    let inside = `<g class="oil"><rect x="${cx - 80}" y="104" width="160" height="62" fill="${C.yellow}" fill-opacity=".7"/></g>`;
    inside += `<g class="lv wat"><rect x="${cx - 80}" y="166" width="160" height="80" fill="${C.sky}"/></g>`;
    // 처음엔 섞여 있음(동그란 기름방울) → 1칸에 위로 올라가 사라짐
    let mix = `<rect x="${cx - 80}" y="104" width="160" height="142" fill="${C.sky}"/>`;
    [[cx - 30, 210], [cx + 20, 196], [cx - 6, 150], [cx + 34, 130], [cx - 40, 172], [cx + 4, 226]].forEach(([x, y]) => { mix += `<circle cx="${x}" cy="${y}" r="13" fill="${C.yellow}" stroke="${C.orange}" stroke-width="1.5"/>`; });
    inside += `<g class="mix">${mix}</g>`;
    body += `<g clip-path="url(#${id}-cl)">${inside}</g>`;
    body += `<path d="${bodyD}" fill="none" stroke="${C.muted}" stroke-width="3.5" stroke-linejoin="round"/>`;
    body += `<rect x="${cx - 18}" y="44" width="36" height="16" rx="4" fill="${C.line}" stroke="${C.muted}" stroke-width="2.5"/>`;
    // 꼭지와 아래 관
    body += `<path d="M${cx} 244 V300" stroke="${C.muted}" stroke-width="8" stroke-linecap="round"/><path d="M${cx} 244 V300" stroke="white" stroke-width="3"/>`;
    body += `<g class="cock"><rect x="${cx - 22}" y="256" width="44" height="12" rx="5" fill="${C.ink}"/></g>`;
    css += `.sc-${id} .cock { transform-box: fill-box; transform-origin: center; }` + steps(id, 'cock', ['rotate(0deg)', 'rotate(0deg)', 'rotate(90deg)'], 0.5, 0.1);
    css += `.sc-${id} .mix { transition: opacity 1.2s ease-in-out .3s; } .on1 .sc-${id} .mix { opacity: 0; }`;
    css += steps(id, 'wat', ['scaleY(1)', 'scaleY(1)', 'scaleY(.12)'], 1.3, 0.5) + steps(id, 'oil', ['translateY(0px)', 'translateY(0px)', 'translateY(70px)'], 1.3, 0.5);
    // 받는 비커
    const bx = cx, bby = 350;
    body += `<g class="lv bw">${liquid(bx, bby, 90, 40, C.sky, 1)}</g>` + beaker(bx, bby, 90, 52);
    css += steps(id, 'bw', ['scaleY(0)', 'scaleY(0)', 'scaleY(1)'], 1.3, 0.5);
    body += shown(2, [0, 0.4, 0.8].map((s) => `<g class="drip" style="animation-delay:${s}s"><circle cx="${cx}" cy="300" r="4.5" fill="${C.blue}"/></g>`).join(''), 3);
    css += `@keyframes ${id}-drip { 0% { opacity: 0; transform: translateY(0); } 20% { opacity: 1; } 100% { opacity: 0; transform: translateY(36px); } } .sc-${id} .drip { animation: ${id}-drip 1.1s ease-in infinite; }`;
    // 이름표
    body += atH(1, 2, 'fin', `${lead(cx + 60, 134, 420, 120)}${lead(cx + 44, 206, 420, 206)}`, 1.2);
    body += atH(1, 2, 'pop', tag(490, 120, '식용유', HOT, { size: 18 }), 1.3) + atH(1, 2, 'pop', tag(475, 206, '물', COLD, { size: 18 }), 1.4);
    body += at(2, 'fin', lead(cx + 34, 196, 420, 180), 1.6) + at(2, 'pop', tag(490, 180, '식용유', HOT, { size: 18 }), 1.6);
    body += atH(1, 3, 'pop', tag(510, 50, '밀도 차로 나뉨', GRAY, { size: 18 }), 1.6);
    body += at(2, 'pop', tag(430, 300, '아래층 물부터', COLD, { size: 18 }), 1);
    body += at(2, 'fin', lead(360, 300, cx + 26, 290), 1);
    body += at(3, 'pop', tag(510, 50, '분별 깔때기', LIL, { size: 22 }), 0.2);
    body += ring(cx, 160, 86, 3, C.purple, 0.4);
    return put('8-1/과학/1/분별 깔때기', svg(id, body, css));
  })();

  // ── 석출: 녹아 있던 입자가 식으면서 모여 고체 알갱이로 나온다 ──
  (function () {
    const id = 't81-s1-seokchul';
    let css = base(id);
    let body = '';
    const cx = 230, by = 290, bw = 220, bh = 200;
    body += liquid(cx, by, bw, 170, C.sky, 0.45);
    const rr = seeded(51);
    // 처음 자리(용액 속 흩어짐) → 2칸 자리(바닥에 줄 맞춰 모임)
    const N = 14, slots = [];
    for (let i = 0; i < 10; i++) slots.push([cx - 44 + (i % 5) * 22, by - 14 - Math.floor(i / 5) * 20]);
    for (let i = 0; i < N; i++) {
      const x = cx - 84 + (i % 7) * 28 + (Math.floor(i / 7) % 2) * 12, y = by - 140 + Math.floor(i / 7) * 52 + rr() * 16;
      const s = slots[i];
      const inner = jig(S(x, y, 8), 3, 0.5 + rr() * 0.3, rr());
      if (s) {
        body += `<g class="mv"${st({ '--dx': f(s[0] - x) + 'px', '--dy': f(s[1] - y) + 'px', 'transition-delay': f(0.2 + i * 0.07) + 's' })}><g class="jgw">${inner}</g></g>`;
      } else body += inner;
    }
    css += `.sc-${id} .mv { transition: transform 1.2s ease-in-out; } .on2 .sc-${id} .mv { transform: translate(var(--dx), var(--dy)); } .on2 .sc-${id} .jgw .jg { animation: none; }`;
    body += beaker(cx, by, bw, bh);
    body += shown(1, burner(cx, by, 0.9), 2);
    body += at(1, 'pop', tag(cx, 50, '뜨거운 용액', HOT, { size: 18 }), 0.4);
    body += shown(2, `<g class="pulse pulse2">${solid(cx - 150, by - 90, cx - 124, by - 90, C.blue, 4)}${solid(cx + 150, by - 90, cx + 124, by - 90, C.blue, 4)}</g>`);
    body += at(2, 'pop', tag(cx, 50, '식힘', COLD, { size: 18 }), 0.2);
    body += glowRect(cx - 62, by - 52, 124, 50, 2, C.orange, 1.2, 10);
    body += at(2, 'pop', tag(500, 200, '고체 알갱이', HOT, { size: 18 }), 1.4) + at(2, 'fin', lead(440, 212, cx + 64, by - 28), 1.4);
    body += at(3, 'pop', tag(500, 120, '석출', LIL, { size: 22 }), 0.2);
    body += ring(cx, by - 26, 70, 3, C.purple, 0.4);
    css += `.on2 .sc-${id} .b1 .pop1 { visibility: hidden; }`;
    return put('8-1/과학/1/석출', svg(id, body, css));
  })();
})(typeof window !== 'undefined' ? window : globalThis);
