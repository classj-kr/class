// 과학 3-1 4단원 「생물의 한살이」 낱말 도식: 배추흰나비의 한살이·허물·마디·곤충의 몸, 한해살이식물과 여러해살이식물, 새순.
// 배추흰나비 알은 노랗고 길쭉하며 세로 주름이 있다. 애벌레는 초록이고 몸이 여러 마디로 나뉜다. 번데기는 가운데가 볼록하고 실로 몸을 묶어 붙어 있다.
// 어른벌레는 하얀 날개(앞날개 끝이 회색, 검은 점 둘), 몸은 머리·가슴·배, 가슴에 다리 세 쌍과 날개 두 쌍(교과서).
// 한해살이식물은 고추(미래엔), 여러해살이식물은 사과나무(두 교과서). 계절 이름은 땅 아래에 적는다.
// 움직임은 transform·opacity·stroke-dashoffset 만 쓴다.
(function (root) {
  'use strict';
  const { C, svg, text, put } = root.FigureKit;
  const f = (n) => +(+n).toFixed(1);
  const dl = (s) => (s ? ` style="animation-delay:${s}s"` : '');
  const g = (cls, inner, s = 0) => `<g class="${cls}"${dl(s)}>${inner}</g>`;
  const at = (n, kind, inner, s = 0) => `<g class="b${n}">${g(`${kind} ${kind}${n}`, inner, s)}</g>`;
  const shown = (n, inner, hide) => `<g class="b${n}${hide ? ' h' + hide : ''}">${inner}</g>`;
  const tw = (s, size) => [...String(s)].reduce((a, c) => a + (/[가-힣]/.test(c) ? 1 : c === ' ' ? 0.3 : 0.6), 0) * size;
  const HOT = [C.peach, C.orange], OK = [C.mint, C.green], GRAY = ['white', C.muted];
  const tag = (cx, cy, label, [fill, stroke] = OK, { size = 20 } = {}) => {
    const w = Math.round(tw(label, size) + size * 1.3), h = Math.round(size * 1.7);
    return `<g><rect x="${f(cx - w / 2)}" y="${f(cy - h / 2)}" width="${w}" height="${h}" rx="${h / 2}" fill="${fill}" stroke="${stroke}" stroke-width="2.5"/>${text(f(cx), f(cy + size * 0.36), label, { size })}</g>`;
  };
  const lead = (x1, y1, x2, y2, color = C.muted) => `<path d="M${f(x1)} ${f(y1)} L${f(x2)} ${f(y2)}" stroke="${color}" stroke-width="2.5" stroke-linecap="round"/>`;
  const head = (x, y, ang, color, w = 4) => {
    const l = 8 + w * 1.4, p = (d) => `${f(x - l * Math.cos(ang + d))} ${f(y - l * Math.sin(ang + d))}`;
    return `<path d="M${p(-0.5)} L${f(x)} ${f(y)} L${p(0.5)}" stroke="${color}" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  };
  // 흐르는 굽은 화살표
  const arc = (x1, y1, cx, cy, x2, y2, color, w = 5) => `<g><path class="mar" d="M${x1} ${y1} Q${cx} ${cy} ${x2} ${y2}" stroke="${color}" stroke-width="${w}" stroke-dasharray="12 9" fill="none" stroke-linecap="round"/>${head(x2, y2, Math.atan2(y2 - cy, x2 - cx), color, w)}</g>`;
  const ring = (cx, cy, r, n, color = C.green, s = 0) => `<g class="b${n}"><circle class="ring ring${n}"${dl(s)} cx="${f(cx)}" cy="${f(cy)}" r="${r}" fill="none" stroke="${color}" stroke-width="4"/></g>`;
  const rot = (cx, cy, deg) => `translate(${cx}px, ${cy}px) rotate(${deg}deg) translate(${-cx}px, ${-cy}px)`;

  const base = (id) => {
    let s = `
    .sc-${id} .pop, .sc-${id} .pulse, .sc-${id} .ring, .sc-${id} .grow { transform-box: fill-box; transform-origin: center; }
    .sc-${id} .grow { transform-origin: 50% 100%; }
    .sc-${id} .ring { opacity: 0; }
    .sc-${id} .mar { animation: ${id}-mar .7s linear infinite; }
    .sc-${id} .draw { stroke-dasharray: 1; stroke-dashoffset: 1; transition: stroke-dashoffset 1.4s ease-in-out .2s; }
    @keyframes ${id}-pop { 0% { opacity: 0; transform: scale(.3); } 70% { opacity: 1; transform: scale(1.12); } 100% { opacity: 1; transform: scale(1); } }
    @keyframes ${id}-fin { from { opacity: 0; } to { opacity: 1; } }
    @keyframes ${id}-grow { from { opacity: 0; transform: scaleY(0); } to { opacity: 1; transform: scaleY(1); } }
    @keyframes ${id}-pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.15); } }
    @keyframes ${id}-flash { 0% { opacity: 0; } 20% { opacity: 1; } 40% { opacity: .25; } 60% { opacity: 1; } 80% { opacity: .25; } 100% { opacity: 1; } }
    @keyframes ${id}-ring { 0% { opacity: .9; transform: scale(1); } 100% { opacity: 0; transform: scale(1.6); } }
    @keyframes ${id}-mar { from { stroke-dashoffset: 21; } to { stroke-dashoffset: 0; } }
    `;
    for (let n = 1; n <= 5; n++) s += `
    .on${n} .sc-${id} .pop${n} { animation: ${id}-pop .5s ease-out both; }
    .on${n} .sc-${id} .fin${n} { animation: ${id}-fin .5s ease-out both; }
    .on${n} .sc-${id} .grow${n} { animation: ${id}-grow .8s ease-out both; }
    .on${n} .sc-${id} .pulse${n} { animation: ${id}-pulse .6s ease-in-out both; }
    .on${n} .sc-${id} .flash${n} { animation: ${id}-flash 1.4s ease-in-out both; }
    .on${n} .sc-${id} .ring${n} { animation: ${id}-ring 1.1s ease-out .3s 2; }
    .on${n} .sc-${id} .draw${n} { stroke-dashoffset: 0; }`;
    return s;
  };
  const steps = (id, cls, vals, sec = 1.2, delay = 0.2) => `.sc-${id} .${cls} { transform: ${vals[0]}; transition: transform ${sec}s ease-in-out ${delay}s; }`
    + vals.slice(1).map((v, i) => v == null ? '' : `.on${i + 1} .sc-${id} .${cls} { transform: ${v}; }`).join('');

  // ── 배추흰나비 그림 ──
  // 알: (x, y) 는 밑 가운데
  const egg = (x, y, s = 1) => {
    const h = 40 * s, w = 9 * s;
    return `<path d="M${f(x - w)} ${y} Q${f(x - w * 1.25)} ${f(y - h * 0.6)} ${x} ${f(y - h)} Q${f(x + w * 1.25)} ${f(y - h * 0.6)} ${f(x + w)} ${y} Z" fill="${C.yellow}" stroke="${C.orange}" stroke-width="2.5" stroke-linejoin="round"/>`
      + `<path d="M${x} ${f(y - 3)} V${f(y - h * 0.85)} M${f(x - w * 0.5)} ${f(y - 3)} Q${f(x - w * 0.6)} ${f(y - h * 0.5)} ${f(x - w * 0.15)} ${f(y - h * 0.8)} M${f(x + w * 0.5)} ${f(y - 3)} Q${f(x + w * 0.6)} ${f(y - h * 0.5)} ${f(x + w * 0.15)} ${f(y - h * 0.8)}" stroke="${C.orange}" stroke-width="1.5" fill="none"/>`;
  };
  // 애벌레(머리가 왼쪽): x 는 왼쪽 끝, y 는 바닥, len 은 몸길이. skin 이면 벗은 허물(속이 빈 회색 껍질).
  const larva = (x, y, len, skin = false) => {
    const h = Math.max(12, len * 0.17), n = Math.max(6, Math.round(len / (h * 0.8)));
    const lg = skin ? 0 : h * 0.28, yb = y - lg; // y 는 땅, yb 는 몸 아래
    const [fill, stroke] = skin ? ['white', C.muted] : [C.mint, C.green];
    let s = `<rect x="${f(x)}" y="${f(yb - h)}" width="${f(len)}" height="${f(h)}" rx="${f(h / 2)}" fill="${fill}" stroke="${stroke}" stroke-width="2.5"${skin ? ' stroke-dasharray="5 3"' : ''}/>`;
    let d = '';
    for (let i = 1; i < n; i++) { const xi = x + h * 0.9 + ((len - h * 1.1) * i) / n; d += `M${f(xi)} ${f(yb - h + 2)} Q${f(xi + h * 0.18)} ${f(yb - h / 2)} ${f(xi)} ${f(yb - 2)} `; }
    s += `<path d="${d}" stroke="${stroke}" stroke-width="1.6" fill="none"/>`;
    if (!skin) {
      s += `<circle cx="${f(x + h * 0.5)}" cy="${f(yb - h * 0.52)}" r="${f(h * 0.5)}" fill="${C.green}"/>`;
      let lgp = '';
      for (let i = 0; i < n; i++) if (i < 3 || (i > n - 6 && i < n - 1) || i === n - 1) { const xi = x + h * 1.1 + ((len - h * 1.4) * i) / (n - 1); lgp += `M${f(xi)} ${f(yb - 1)} V${f(y)} `; }
      s += `<path d="${lgp}" stroke="${C.green}" stroke-width="2.5" stroke-linecap="round"/>`;
    }
    return s;
  };
  // 번데기: (x, y) 는 아래 끝, 위로 선다
  const pupa = (x, y, s = 1) => `<path d="M${x} ${y} Q${f(x - 16 * s)} ${f(y - 22 * s)} ${f(x - 14 * s)} ${f(y - 40 * s)} L${f(x - 20 * s)} ${f(y - 54 * s)} L${f(x - 8 * s)} ${f(y - 66 * s)} L${x} ${f(y - 86 * s)} L${f(x + 8 * s)} ${f(y - 66 * s)} Q${f(x + 22 * s)} ${f(y - 48 * s)} ${f(x + 14 * s)} ${f(y - 30 * s)} Q${f(x + 10 * s)} ${f(y - 12 * s)} ${x} ${y} Z" fill="${C.mint}" stroke="${C.green}" stroke-width="2.5" stroke-linejoin="round"/>`
    + `<path d="M${f(x - 12 * s)} ${f(y - 22 * s)} H${f(x + 12 * s)} M${f(x - 14 * s)} ${f(y - 34 * s)} H${f(x + 15 * s)}" stroke="${C.green}" stroke-width="1.6"/>`;
  // 어른벌레(위에서 본 모습). (0,0) 은 가슴 가운데.
  const BW = {
    fore: 'M10 -16 C60 -72 140 -84 152 -48 C158 -10 120 8 12 8 Z',
    hind: 'M10 6 C90 10 130 42 112 82 C96 112 40 98 8 30 Z',
    tip: 'M114 -74 C138 -80 152 -66 152 -48 C138 -52 124 -60 114 -74 Z',
    legs: ['M14 -14 L46 -34 L58 -60', 'M16 0 L58 4 L78 22', 'M14 14 L48 36 L62 68'],
  };
  const wing = (side) => `<g transform="scale(${side} 1)"><path d="${BW.fore}" fill="white" stroke="${C.muted}" stroke-width="2.5" stroke-linejoin="round"/><path d="${BW.hind}" fill="white" stroke="${C.muted}" stroke-width="2.5" stroke-linejoin="round"/><path d="${BW.tip}" fill="${C.muted}"/><circle cx="96" cy="-24" r="7" fill="${C.ink}"/><circle cx="104" cy="-2" r="6" fill="${C.ink}"/></g>`;
  const bHead = `<circle cx="0" cy="-36" r="13" fill="${C.ink}"/><path d="M-5 -46 Q-14 -78 -32 -98 M5 -46 Q14 -78 32 -98" stroke="${C.ink}" stroke-width="2.5" fill="none"/><circle cx="-32" cy="-98" r="4.5" fill="${C.ink}"/><circle cx="32" cy="-98" r="4.5" fill="${C.ink}"/>`;
  const bThorax = `<ellipse cx="0" cy="0" rx="16" ry="24" fill="${C.ink}"/>`;
  const bAbd = `<ellipse cx="0" cy="72" rx="12" ry="48" fill="${C.ink}"/><path d="M-10 46 Q0 50 10 46 M-11 62 Q0 66 11 62 M-11 78 Q0 82 11 78 M-10 94 Q0 98 10 94" stroke="${C.muted}" stroke-width="2" fill="none"/>`;
  const bLegs = (k, color = C.ink, w = 3) => `<path d="${BW.legs[k]}" stroke="${color}" stroke-width="${w}" fill="none" stroke-linejoin="round" stroke-linecap="round"/><path d="${BW.legs[k]}" transform="scale(-1 1)" stroke="${color}" stroke-width="${w}" fill="none" stroke-linejoin="round" stroke-linecap="round"/>`;
  const butterfly = () => bLegs(0) + bLegs(1) + bLegs(2) + wing(1) + wing(-1) + bAbd + bThorax + bHead;

  // ════ 한살이: 알 → 애벌레 → 번데기 → 어른벌레 → (알을 낳는다) → 알 ════
  (function () {
    const id = 't31-s4-hansari';
    let css = base(id);
    let body = '';
    // 자리: 알(왼쪽), 애벌레(위), 번데기(오른쪽), 어른벌레(아래)
    body += at(1, 'pop', `<path d="M78 214 Q120 196 162 214 Q120 226 78 214 Z" fill="${C.mint}" stroke="${C.green}" stroke-width="2.5"/>${egg(120, 210, 1.3)}`, 0.1) + at(1, 'fin', text(120, 252, '알', { size: 22 }), 0.2);
    body += at(1, 'fin', arc(150, 150, 170, 84, 236, 74, C.green), 0.5);
    body += at(1, 'pop', larva(252, 92, 136), 0.9) + at(1, 'fin', text(320, 40, '애벌레', { size: 22 }), 1);
    body += at(2, 'fin', arc(404, 74, 476, 84, 498, 128, C.green), 0.1);
    body += at(2, 'pop', `<path d="M546 128 V236" stroke="${C.orange}" stroke-width="6" stroke-linecap="round"/>${pupa(524, 230, 0.95)}<path d="M512 192 Q530 200 546 190" stroke="${C.muted}" stroke-width="2" fill="none"/>`, 0.4) + at(2, 'fin', text(520, 256, '번데기', { size: 22 }), 0.5);
    body += at(2, 'fin', arc(520, 268, 500, 318, 418, 304, C.green), 1);
    body += at(2, 'pop', `<g transform="translate(320 282) scale(.42)">${butterfly()}</g>`, 1.4) + at(2, 'fin', text(320, 352, '어른벌레', { size: 22 }), 1.5);
    body += at(3, 'fin', arc(222, 300, 150, 300, 124, 268, C.orange), 0.1);
    body += ring(120, 192, 30, 3, C.orange, 0.8);
    body += `<g class="b3"><path class="flash flash3" style="animation-delay:.5s" d="M222 300 Q150 300 124 268" stroke="${C.orange}" stroke-width="9" fill="none" stroke-linecap="round" opacity=".5"/></g>`;
    body += at(4, 'pop', tag(320, 168, '한살이', OK, { size: 28 }), 0.3);
    body += `<g class="b4">${[[150, 150, 170, 84, 236, 74], [404, 74, 476, 84, 498, 128], [520, 268, 500, 318, 418, 304], [222, 300, 150, 300, 124, 268]].map(([a, b, c, d, e, h], k) => `<path class="flash flash4"${dl(0.5 + 0.25 * k)} d="M${a} ${b} Q${c} ${d} ${e} ${h}" stroke="${C.green}" stroke-width="8" fill="none" stroke-linecap="round" opacity=".45"/>`).join('')}</g>`;
    put('3-1/과학/4/한살이', svg(id, body, css));
  })();

  // ════ 허물: 껍질을 벗고 빠져나와 커진다, 네 번 벗으며 자란다 ════
  (function () {
    const id = 't31-s4-heomul';
    let css = base(id);
    let body = `<path d="M30 152 H610" stroke="${C.green}" stroke-width="4" stroke-linecap="round"/><path d="M20 292 H620" stroke="${C.line}" stroke-width="3" stroke-linecap="round"/>`;
    // 위: 벗고 빠져나오기
    body += `<g class="b1"><g class="skin">${larva(140, 150, 150, true)}</g></g>`;
    body += `<g class="b1"><g class="out"><g class="big">${larva(140, 150, 150)}</g></g></g>`;
    css += `.sc-${id} .big { transform-box: fill-box; transform-origin: 0% 100%; }`
      + steps(id, 'out', ['translateX(0px)', 'translateX(220px)'], 1.2, 0.3) + steps(id, 'big', ['scale(1)', 'scale(1.3)'], 0.7, 1.5)
      + `.sc-${id} .skin { transform-box: fill-box; transform-origin: 0% 100%; transition: transform .6s ease 1.2s; } .on1 .sc-${id} .skin { transform: scaleX(.86) scaleY(.8); }`;
    // 아래: 네 번 벗으며 자란다
    const lens = [40, 54, 70, 88, 110];
    let x = 32;
    lens.forEach((len, k) => {
      body += at(2, 'pop', larva(x, 290, len), 0.3 + 0.45 * k);
      x += len + 10;
      if (k < 4) {
        body += at(2, 'fin', `<path d="M${x} 276 H${x + 26}" stroke="${C.muted}" stroke-width="3"/>${head(x + 28, 276, 0, C.muted, 3)}` + text(x + 14, 258, `${k + 1}번`, { size: 18, color: C.orange }), 0.5 + 0.45 * k);
        const sl = Math.min(len * 0.8, 52);
        body += at(2, 'fin', larva(x + 14 - sl / 2, 330, sl, true), 0.6 + 0.45 * k);
        x += 44;
      }
    });
    // 3칸: 허물
    body += shown(3, lead(212, 122, 230, 70, C.orange)) + at(3, 'pop', tag(236, 54, '허물', HOT, { size: 24 }), 0.3);
    body += `<g class="b3"><g class="skin2"><rect class="flash flash3" x="134" y="120" width="140" height="38" rx="19" fill="none" stroke="${C.orange}" stroke-width="5"/></g></g>`;
    put('3-1/과학/4/허물', svg(id, body, css));
  })();

  // ════ 마디: 애벌레의 몸은 칸칸이 나뉘어 있고, 칸을 차례로 움직여 기어간다 ════
  (function () {
    const id = 't31-s4-madi';
    let css = base(id);
    let body = `<path d="M30 271 H610" stroke="${C.green}" stroke-width="4" stroke-linecap="round"/>`;
    const N = 11, R = 25, X0 = 150, SP = 36, Y = 236;
    let crawl = '';
    for (let i = N - 1; i >= 0; i--) {
      const x = X0 + SP * (i + 1), leg = i < 3 || (i > 4 && i < 9) || i === N - 1;
      crawl += `<g class="sg" style="animation-delay:${f(-i * 0.09)}s"><g class="pulse pulse1"${dl(0.2 + 0.12 * i)}>`
        + (leg ? `<path d="M${x - 6} ${Y + R - 4} v12 M${x + 6} ${Y + R - 4} v12" stroke="${C.green}" stroke-width="4" stroke-linecap="round"/>` : '')
        + `<circle cx="${x}" cy="${Y}" r="${R}" fill="${C.mint}" stroke="${C.green}" stroke-width="3"/></g></g>`;
    }
    crawl += `<g class="sg" style="animation-delay:-1.01s"><circle cx="${X0 + 2}" cy="${Y - 4}" r="${R + 2}" fill="${C.green}"/><circle cx="${X0 - 8}" cy="${Y - 10}" r="4" fill="white"/></g>`;
    body += `<g class="go">${crawl}</g>`;
    css += steps(id, 'go', ['translateX(0px)', null, 'translateX(-60px)'], 2.2, 0.1);
    css += `.on2 .sc-${id} .sg { animation: ${id}-hump 1.1s ease-in-out infinite; } .on3 .sc-${id} .sg { animation: none; }
    @keyframes ${id}-hump { 0%, 60%, 100% { transform: translateY(0); } 30% { transform: translateY(-16px); } }`;
    // 3칸: 한 칸을 가리킨다(움직인 뒤 자리)
    const k = 5, mx = X0 + SP * (k + 1) - 60;
    body += `<g class="b3"><circle class="flash flash3" cx="${mx}" cy="${Y}" r="${R + 3}" fill="none" stroke="${C.orange}" stroke-width="6"/></g>`;
    body += shown(3, lead(mx, Y - R - 4, mx + 40, 140, C.orange)) + at(3, 'pop', tag(mx + 60, 124, '마디', HOT, { size: 26 }), 0.3);
    put('3-1/과학/4/마디', svg(id, body, css));
  })();

  // ════ 곤충: 머리·가슴·배 세 부분, 가슴에 다리 세 쌍. 개미도 같다 ════
  (function () {
    const id = 't31-s4-gonchung';
    let css = base(id);
    const BX = 236, BY = 150;
    let body = `<g transform="translate(${BX} ${BY})">`
      + `<g class="lg0">${bLegs(0)}</g><g class="lg1">${bLegs(1)}</g><g class="lg2">${bLegs(2)}</g>`
      + `<g class="wg">${wing(1)}${wing(-1)}</g>`
      + `<g class="pa">${bAbd}</g><g class="pt">${bThorax}</g><g class="ph">${bHead}</g>`;
    // 부분 테두리(반짝)
    body += `<g class="b1"><ellipse class="flash flash1" style="animation-delay:.9s" cx="0" cy="-36" rx="19" ry="19" fill="none" stroke="${C.orange}" stroke-width="5"/>`
      + `<ellipse class="flash flash1" style="animation-delay:1.2s" cx="0" cy="0" rx="22" ry="30" fill="none" stroke="${C.blue}" stroke-width="5"/>`
      + `<ellipse class="flash flash1" style="animation-delay:1.5s" cx="0" cy="72" rx="18" ry="54" fill="none" stroke="${C.purple}" stroke-width="5"/></g>`;
    // 2칸: 다리 세 쌍
    body += `<g class="b2 h4">${[0, 1, 2].map((k) => `<g class="flash flash2"${dl(0.3 + 0.4 * k)}>${bLegs(k, C.orange, 5)}</g>`).join('')}</g>`;
    body += '</g>';
    css += `.sc-${id} .wg { transition: opacity .8s ease .2s; } .on1 .sc-${id} .wg { opacity: .22; } .on4 .sc-${id} .wg { opacity: 1; }`;
    const L = [['머리', 50, BY - 36, BX - 20, BY - 36, C.orange], ['가슴', 50, BY, BX - 22, BY, C.blue], ['배', 50, BY + 80, BX - 16, BY + 80, C.purple]];
    body += shown(1, L.map(([lab, x, y, tx, ty, col], k) => g('fin fin1', lead(x + 34, y, tx, ty, col) + tag(x, y, lab, [col === C.orange ? C.peach : col === C.blue ? C.sky : C.lilac, col], { size: 20 }), 0.9 + 0.3 * k)).join(''), 4);
    body += shown(2, g('pop pop2', tag(BX + 210, BY + 70, '다리 세 쌍', HOT, { size: 20 }), 1.4), 3) + shown(2, lead(BX + 160, BY + 70, BX + 64, BY + 64, C.orange), 3);
    body += `<g class="b2 h3">${[0, 1, 2].map((k) => text(BX + 92, BY + [-62, 26, 80][k], `${k + 1}`, { size: 18, color: C.orange })).join('')}</g>`;
    // 3칸: 개미
    const AX = 520, AY = 172;
    const antLeg = ['M8 -8 L32 -26 L42 -48', 'M9 2 L38 6 L52 24', 'M8 10 L32 30 L42 58'];
    const ant = `<g transform="translate(${AX} ${AY})">`
      + antLeg.map((d) => `<path d="${d}" stroke="${C.ink}" stroke-width="3.5" fill="none" stroke-linejoin="round"/><path d="${d}" transform="scale(-1 1)" stroke="${C.ink}" stroke-width="3.5" fill="none" stroke-linejoin="round"/>`).join('')
      + `<path d="M-6 -46 L-16 -66 L-32 -72 M6 -46 L16 -66 L32 -72" stroke="${C.ink}" stroke-width="3" fill="none" stroke-linejoin="round"/>`
      + `<ellipse cx="0" cy="-36" rx="15" ry="13" fill="${C.ink}"/><ellipse cx="0" cy="0" rx="10" ry="20" fill="${C.ink}"/><circle cx="0" cy="25" r="5" fill="${C.ink}"/><ellipse cx="0" cy="60" rx="22" ry="30" fill="${C.ink}"/>`
      + `<g class="b3"><circle class="flash flash3" style="animation-delay:.8s" cx="0" cy="-36" r="20" fill="none" stroke="${C.orange}" stroke-width="5"/><ellipse class="flash flash3" style="animation-delay:1.1s" cx="0" cy="0" rx="16" ry="26" fill="none" stroke="${C.blue}" stroke-width="5"/><ellipse class="flash flash3" style="animation-delay:1.4s" cx="0" cy="60" rx="28" ry="36" fill="none" stroke="${C.purple}" stroke-width="5"/></g>`
      + '</g>';
    body += at(3, 'fin', ant, 0.1) + at(3, 'fin', text(AX, AY + 126, '개미', { size: 22 }), 0.2) + at(3, 'fin', text(BX, BY + 176, '배추흰나비', { size: 22 }), 0.2);
    // 4칸: 곤충
    body += at(4, 'pop', tag(390, 40, '곤충', OK, { size: 28 }), 0.3) + shown(4, lead(350, 52, BX + 70, 90, C.green) + lead(430, 52, AX - 30, 100, C.green));
    put('3-1/과학/4/곤충', svg(id, body, css));
  })();

  // ── 계절 칸 4개(봄·여름·가을·겨울), 땅은 y 300 ──
  const PXs = [85, 245, 405, 565], SEASON = ['봄', '여름', '가을', '겨울'];
  const ground = () => `<rect x="10" y="300" width="620" height="18" rx="6" fill="${C.peach}" stroke="${C.orange}" stroke-width="2.5"/>`
    + `<path d="M165 60 V318 M325 60 V318 M485 60 V318" stroke="${C.line}" stroke-width="2.5" stroke-dasharray="6 6"/>`;
  const seasonLabel = (k, n, s = 0) => at(n, 'fin', text(PXs[k], 346, SEASON[k], { size: 22, color: k === 3 ? C.blue : k === 2 ? C.orange : C.green }), s);
  const leafAt = (x, y, ang, s = 1) => `<path d="M0 0 Q${8 * s} ${-10 * s} 0 ${-24 * s} Q${-8 * s} ${-10 * s} 0 0 Z" transform="translate(${f(x)} ${f(y)}) rotate(${ang})" fill="${C.mint}" stroke="${C.green}" stroke-width="2"/>`;

  // ════ 한해살이식물: 고추가 봄에 싹 트고 여름에 꽃, 가을에 열매·씨, 겨울에 죽고 씨만 남는다 ════
  (function () {
    const id = 't31-s4-hanhae';
    let css = base(id);
    let body = ground();
    const stem = (x, h) => `<path d="M${x} 300 V${300 - h}" stroke="${C.green}" stroke-width="5" stroke-linecap="round"/>`;
    const plant = (x, h, extra = '') => {
      let s = stem(x, h);
      for (let i = 1; i <= 4; i++) { const y = 300 - h * i / 5; s += leafAt(x, y, i % 2 ? 55 : -55, 1.4); }
      return s + extra;
    };
    // 봄: 씨에서 싹
    const seed = (x, y) => `<ellipse cx="${x}" cy="${y}" rx="6" ry="4.5" fill="${C.yellow}" stroke="${C.orange}" stroke-width="2"/>`;
    body += at(1, 'fin', seed(PXs[0], 308), 0) + at(1, 'grow', stem(PXs[0], 50) + leafAt(PXs[0], 250, 60, 1.3) + leafAt(PXs[0], 250, -60, 1.3), 0.4);
    body += seasonLabel(0, 1, 0);
    // 여름: 자라서 하얀 꽃
    const flower = (x, y) => `<g><circle cx="${x}" cy="${y}" r="8" fill="white" stroke="${C.muted}" stroke-width="2"/><circle cx="${x}" cy="${y}" r="3" fill="${C.yellow}"/></g>`;
    body += at(1, 'grow', plant(PXs[1], 150, flower(PXs[1] + 16, 196) + flower(PXs[1] - 16, 166) + flower(PXs[1], 146)), 1.2) + seasonLabel(1, 1, 1.2);
    // 가을: 빨간 고추 열매
    const pepper = (x, y, ang) => `<path d="M0 0 Q7 14 3 36 Q0 42 -3 36 Q-7 14 0 0 Z" transform="translate(${x} ${y}) rotate(${ang})" fill="${C.red}" stroke="${C.red}" stroke-width="1.5" stroke-linejoin="round"/>`;
    body += at(2, 'fin', plant(PXs[2], 150), 0) + seasonLabel(2, 2, 0);
    body += [[16, 196, -14], [-16, 166, 12], [14, 140, -10]].map(([dx, y, a], k) => at(2, 'pop', pepper(PXs[2] + dx, y, a), 0.5 + 0.25 * k)).join('');
    // 열매 속 씨(확대)
    body += at(2, 'pop', `<circle cx="${PXs[2] + 52}" cy="108" r="24" fill="white" stroke="${C.red}" stroke-width="3"/>${seed(PXs[2] + 44, 102)}${seed(PXs[2] + 60, 112)}${seed(PXs[2] + 48, 118)}` + lead(PXs[2] + 34, 124, PXs[2] + 20, 140, C.red), 1.4);
    body += at(2, 'fin', text(PXs[2] + 52, 76, '씨', { size: 18, color: C.orange }), 1.5);
    // 겨울: 시들어 쓰러지고 씨만 남는다
    const dead = `<path d="M${PXs[3]} 300 V200" stroke="${C.muted}" stroke-width="5" stroke-linecap="round"/><path d="M${PXs[3]} 266 l16 -12 M${PXs[3]} 240 l-16 -10 M${PXs[3]} 218 l14 -10" stroke="${C.muted}" stroke-width="3.5" stroke-linecap="round"/>`;
    body += at(3, 'fin', `<g class="wilt">${dead}</g>`, 0) + seasonLabel(3, 3, 0);
    css += `.sc-${id} .wilt { transform: ${rot(PXs[3], 300, 0)}; transition: transform 1.2s ease-in .6s; } .on3 .sc-${id} .wilt { transform: ${rot(PXs[3], 300, -62)}; }`;
    body += at(3, 'pop', seed(PXs[3] + 22, 296) + seed(PXs[3] + 38, 297) + seed(PXs[3] + 52, 296), 1.6) + ring(PXs[3] + 37, 296, 26, 3, C.orange, 1.7);
    body += at(3, 'fin', text(PXs[3] + 37, 272, '씨', { size: 18, color: C.orange }), 1.8);
    // 4칸: 한 해
    body += at(4, 'fin', `<path d="M14 60 V48 H626 V60" stroke="${C.green}" stroke-width="4" fill="none" stroke-linejoin="round"/>`, 0) + at(4, 'pop', tag(320, 48, '한 해', OK, { size: 20 }), 0.3);
    body += at(4, 'pop', tag(320, 110, '한해살이식물', OK, { size: 24 }), 0.6);
    put('3-1/과학/4/한해살이식물', svg(id, body, css));
  })();

  // ── 사과나무 ──
  const tree = (x, { canopy = false, flowers = false, apples = null, buds = false, bare = false } = {}) => {
    let s = `<path d="M${x - 9} 300 L${x - 6} 214 L${x + 6} 214 L${x + 9} 300 Z" fill="${C.peach}" stroke="${C.orange}" stroke-width="3" stroke-linejoin="round"/>`
      + `<path d="M${x} 218 L${x - 42} 156 M${x - 24} 190 L${x - 52} 186 M${x} 218 L${x + 44} 150 M${x + 26} 184 L${x + 56} 178 M${x} 216 L${x + 2} 128" stroke="${C.orange}" stroke-width="5" stroke-linecap="round" fill="none"/>`;
    const tips = [[x - 42, 156], [x - 52, 186], [x + 44, 150], [x + 56, 178], [x + 2, 128], [x - 22, 140], [x + 24, 136]];
    if (canopy) s += `<g><circle cx="${x - 30}" cy="170" r="38" fill="${C.mint}" stroke="${C.green}" stroke-width="3"/><circle cx="${x + 32}" cy="166" r="38" fill="${C.mint}" stroke="${C.green}" stroke-width="3"/><circle cx="${x}" cy="138" r="42" fill="${C.mint}" stroke="${C.green}" stroke-width="3"/></g>`;
    if (flowers) s += tips.slice(0, 5).map(([a, b]) => `<circle cx="${a}" cy="${b}" r="7" fill="white" stroke="${C.red}" stroke-width="2"/>`).join('') + tips.slice(0, 5).map(([a, b], k) => leafAt(a + (k % 2 ? 8 : -8), b + 6, k % 2 ? 50 : -50, 0.8)).join('');
    if (buds) s += tips.slice(0, 5).map(([a, b], k) => leafAt(a, b, k % 2 ? 30 : -30, 1)).join('');
    if (apples) s += [[x - 34, 172], [x + 30, 168], [x - 4, 144], [x + 12, 190], [x - 18, 120]].map(([a, b]) => `<circle cx="${a}" cy="${b}" r="${apples === C.green ? 6 : 8}" fill="${apples}" stroke="${apples === C.red ? C.red : C.green}" stroke-width="2"/>`).join('');
    return s;
  };

  // ════ 여러해살이식물: 사과나무는 겨울에 잎이 지지만 죽지 않고, 이듬해 다시 새순·꽃·열매를 거듭한다 ════
  (function () {
    const id = 't31-s4-yeoreohae';
    let css = base(id);
    let body = ground();
    body += at(1, 'pop', tree(PXs[0], { flowers: true }), 0.1) + seasonLabel(0, 1, 0);
    body += at(1, 'pop', tree(PXs[1], { canopy: true, apples: C.green }), 1.0) + seasonLabel(1, 1, 1.0);
    body += at(2, 'pop', tree(PXs[2], { canopy: true }), 0) + seasonLabel(2, 2, 0);
    body += [[-34, 172], [30, 168], [-4, 144], [12, 190], [-18, 120]].map(([dx, y], k) => at(2, 'pop', `<circle cx="${PXs[2] + dx}" cy="${y}" r="9" fill="${C.red}" stroke="${C.red}" stroke-width="2"/>`, 0.5 + 0.12 * k)).join('');
    // 겨울: 앙상한 가지, 잎이 떨어진다
    body += at(2, 'fin', tree(PXs[3], { bare: true }), 1.1) + seasonLabel(3, 2, 1.1);
    body += [[-30, 170, 20], [24, 160, -30], [0, 140, 40], [40, 186, -10]].map(([dx, y, a], k) => `<g class="b2"><g class="fall" style="animation-delay:${f(1.3 + 0.2 * k)}s">${leafAt(PXs[3] + dx, y, a, 1.1)}</g></g>`).join('');
    css += `.sc-${id} .fall { opacity: 0; transform-box: fill-box; transform-origin: center; } .on2 .sc-${id} .fall { animation: ${id}-fall 1.2s ease-in both; }
    @keyframes ${id}-fall { 0% { opacity: 1; transform: translate(0, 0) rotate(0deg); } 85% { opacity: 1; } 100% { opacity: 0; transform: translate(14px, 110px) rotate(60deg); } }`;
    // 3칸: 이듬해 봄으로 돌아간다
    body += `<g class="b3"><path class="draw draw3" pathLength="1" d="M${PXs[3]} 92 Q${PXs[3] - 40} 26 325 26 Q${PXs[0] + 40} 26 ${PXs[0]} 92" stroke="${C.blue}" stroke-width="5" fill="none" stroke-dasharray="1" stroke-linecap="round"/></g>`;
    body += at(3, 'fin', head(PXs[0], 92, Math.atan2(92 - 26, PXs[0] - (PXs[0] + 40)), C.blue, 5), 1.4) + at(3, 'pop', tag(325, 26, '이듬해', ['white', C.blue], { size: 20 }), 0.8);
    body += ring(PXs[0], 160, 60, 3, C.green, 1.4);
    // 4칸
    body += at(4, 'pop', tag(325, 72, '여러해살이식물', OK, { size: 24 }), 0.3);
    put('3-1/과학/4/여러해살이식물', svg(id, body, css));
  })();

  // ════ 새순: 겨울에 앙상하던 가지에서 봄에 여리고 연한 싹이 돋는다 ════
  (function () {
    const id = 't31-s4-saesun';
    let css = base(id);
    let body = `<path d="M20 330 Q200 250 360 190 Q480 146 612 122 M200 262 Q230 190 216 120 M360 190 Q330 130 352 70 M480 150 Q520 100 520 50 M276 228 Q330 250 380 290" stroke="${C.orange}" stroke-width="9" stroke-linecap="round" fill="none"/>`;
    const nodes = [[216, 120, -10], [352, 70, 10], [520, 50, 0], [612, 122, 60], [380, 290, 120], [226, 178, 70], [338, 124, -60], [512, 92, 60]];
    // 가지 끝의 작은 겨울눈
    body += nodes.map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="6" ry="9" fill="${C.peach}" stroke="${C.orange}" stroke-width="2.5"/>`).join('');
    body += shown(1, g('fin fin1', text(70, 60, '겨울', { size: 24, color: C.blue })), 2);
    // 2칸: 연한 싹이 돋는다
    body += nodes.map(([x, y, a], k) => at(2, 'pop', `<g transform="translate(${x} ${y}) rotate(${a})">${leafAt(-2, -5, -30, 1.6)}${leafAt(2, -5, 30, 1.6)}${leafAt(0, -7, 0, 1.15)}</g>`, 0.3 + 0.18 * k)).join('');
    body += at(2, 'fin', text(70, 60, '봄', { size: 24, color: C.green }), 0.1);
    // 3칸
    body += ring(352, 62, 28, 3, C.green, 0) + ring(520, 42, 28, 3, C.green, 0.2) + ring(216, 112, 28, 3, C.green, 0.4);
    body += shown(3, lead(440, 300, 386, 278, C.green)) + at(3, 'pop', tag(490, 300, '새순', OK, { size: 26 }), 0.3);
    put('3-1/과학/4/새순', svg(id, body, css));
  })();

  // ── 한살이 띠(위): 알 → 애벌레 → 번데기 → 어른벌레, 지금 단계에 고리. 아래에 그 단계를 크게 ──
  const STRIP_X = [90, 240, 400, 550];
  const strip = (cur) => {
    let s = `<rect x="14" y="8" width="612" height="96" rx="14" fill="white" stroke="${C.line}" stroke-width="2.5"/>`;
    s += egg(STRIP_X[0], 62, 0.8) + larva(STRIP_X[1] - 34, 60, 68) + pupa(STRIP_X[2], 66, 0.5) + `<g transform="translate(${STRIP_X[3]} 46) scale(.2)">${butterfly()}</g>`;
    ['알', '애벌레', '번데기', '어른벌레'].forEach((lab, k) => { s += text(STRIP_X[k], 94, lab, { size: 18, color: k === cur ? C.orange : C.muted }); });
    for (let k = 0; k < 3; k++) s += `<path d="M${STRIP_X[k] + 44} 50 H${STRIP_X[k + 1] - 48}" stroke="${C.muted}" stroke-width="3"/>` + head(STRIP_X[k + 1] - 46, 50, 0, C.muted, 3);
    s += `<rect x="${STRIP_X[cur] - 56}" y="14" width="112" height="84" rx="12" fill="none" stroke="${C.orange}" stroke-width="4"/>`;
    return s;
  };
  // 띠의 칸에서 아래 큰 그림으로 퍼지는 두 줄
  const zoom = (cur) => `<path d="M${STRIP_X[cur] - 56} 98 L60 122 M${STRIP_X[cur] + 56} 98 L580 122" stroke="${C.orange}" stroke-width="2" stroke-dasharray="6 5"/>`;

  // ════ 애벌레: 초록 몸, 여러 마디, 잎을 갉아 먹으며 기어다닌다 ════
  (function () {
    const id = 't31-s4-aebeolle';
    let css = base(id);
    let body = at(1, 'fin', strip(1) + zoom(1), 0);
    // 큰 잎(가로)과 애벌레
    const leaf = `<path d="M40 330 Q140 190 330 200 Q520 200 610 300 Q520 340 330 340 Q150 344 40 330 Z" fill="${C.mint}" stroke="${C.green}" stroke-width="3" stroke-linejoin="round"/><path d="M60 328 Q330 270 600 300" stroke="${C.green}" stroke-width="2.5" fill="none"/>`;
    body += at(1, 'fin', leaf, 0.3);
    // 갉아 먹은 자리(잎 가장자리가 패인다): 바탕색 반원이 하나씩
    body += [[250, 204, 18], [214, 210, 14], [180, 220, 12]].map(([x, y, r], k) => `<g class="b2"><g class="fin fin2"${dl(0.6 + 0.5 * k)}><circle cx="${x}" cy="${y}" r="${r}" fill="${C.paper}"/></g></g>`).join('');
    body += `<g class="b1"><g class="crawl"><g class="pop pop1" style="animation-delay:.6s">${larva(270, 252, 230)}</g></g></g>`;
    css += steps(id, 'crawl', ['translateX(0px)', null, 'translateX(-40px)'], 2, 0.3);
    css += `.on2 .sc-${id} .crawl > g { animation: ${id}-hump .9s ease-in-out 3; } @keyframes ${id}-hump { 50% { transform: translateY(-6px) scaleX(.96); } }`;
    body += at(2, 'pop', tag(560, 150, '초록색', OK, { size: 20 }) + lead(560, 166, 470, 222, C.green), 1.0);
    body += at(2, 'pop', tag(130, 150, '마디', HOT, { size: 20 }) + lead(150, 166, 300, 218, C.orange), 1.4);
    body += at(3, 'pop', tag(400, 160, '애벌레', OK, { size: 26 }), 0.3);
    body += `<g class="b3"><rect class="flash flash3" x="${STRIP_X[1] - 56}" y="14" width="112" height="84" rx="12" fill="none" stroke="${C.green}" stroke-width="5"/></g>`;
    put('3-1/과학/4/애벌레', svg(id, body, css));
  })();

  // ════ 번데기: 실로 몸을 묶어 한곳에 붙어 있고, 가운데가 볼록하며 마디가 있다. 색이 둘레와 비슷해진다 ════
  (function () {
    const id = 't31-s4-beondegi';
    let css = base(id);
    let body = at(1, 'fin', strip(2) + zoom(2), 0);
    body += at(1, 'fin', `<path d="M380 350 L380 120" stroke="${C.orange}" stroke-width="18" stroke-linecap="round"/>`, 0.2);
    const pp = pupa(330, 340, 2.4);
    body += at(1, 'pop', pp, 0.5);
    // 둘레 색을 닮아 간다: 같은 모양의 살구색 덮개가 서서히 나타난다
    body += `<g class="b2"><g class="tone">${pp.replace(/fill="[^"]+"/, `fill="${C.peach}"`).replace(/stroke="[^"]+"/, `stroke="${C.orange}"`)}</g></g>`;
    css += `.sc-${id} .tone { opacity: 0; transition: opacity 1.6s ease 1.4s; } .on2 .sc-${id} .tone { opacity: .75; }`;
    // 몸을 묶은 실
    body += `<g class="b2"><path class="draw draw2" pathLength="1" d="M318 232 Q350 252 382 226" stroke="${C.ink}" stroke-width="3" fill="none"/></g>`;
    body += at(2, 'pop', tag(510, 214, '실', ['white', C.ink], { size: 20 }) + lead(486, 220, 384, 228, C.ink), 0.9);
    body += ring(332, 262, 46, 2, C.green, 0.6);
    body += at(2, 'pop', tag(170, 270, '볼록', OK, { size: 20 }) + lead(196, 266, 290, 262, C.green), 1.1);
    body += at(3, 'pop', tag(170, 170, '번데기', OK, { size: 26 }) + lead(212, 182, 300, 210, C.green), 0.3);
    body += `<g class="b3"><rect class="flash flash3" x="${STRIP_X[2] - 56}" y="14" width="112" height="84" rx="12" fill="none" stroke="${C.green}" stroke-width="5"/></g>`;
    put('3-1/과학/4/번데기', svg(id, body, css));
  })();

  // ════ 어른벌레: 번데기에서 나와 젖은 날개를 펴고, 날개 두 쌍으로 날아다니며 알을 낳는다 ════
  (function () {
    const id = 't31-s4-eoreunbeolle';
    let css = base(id);
    let body = at(1, 'fin', strip(3) + zoom(3), 0);
    const BX = 320, BY = 232;
    // 빈 번데기 껍질(왼쪽)
    body += at(1, 'fin', `<path d="M110 350 V180" stroke="${C.orange}" stroke-width="10" stroke-linecap="round"/><g opacity=".7">${pupa(92, 300, 1.2).replace(/fill="[^"]+"/, 'fill="white"').replace(/stroke="[^"]+"/, `stroke="${C.muted}"`)}</g><path d="M86 200 L92 214 L98 200" stroke="${C.muted}" stroke-width="2.5" fill="none"/>`, 0.1);
    body += `<g transform="translate(${BX} ${BY}) scale(.82)">`
      + `<g class="wr"><g class="flp">${wing(1)}</g></g><g class="wl"><g class="flp">${wing(-1)}</g></g>`
      + bAbd + bThorax + bHead + '</g>';
    css += `.sc-${id} .wr, .sc-${id} .wl { transform-box: fill-box; transform: scaleX(.18); transition: transform 1.4s ease-out 1s; }
    .sc-${id} .wr { transform-origin: 0% 50%; } .sc-${id} .wl { transform-origin: 100% 50%; }
    .on1 .sc-${id} .wr, .on1 .sc-${id} .wl { transform: scaleX(1); }
    .sc-${id} .flp { transform-box: fill-box; }
    .sc-${id} .wr .flp { transform-origin: 0% 50%; } .sc-${id} .wl .flp { transform-origin: 100% 50%; }
    .on2 .sc-${id} .flp { animation: ${id}-flap .5s ease-in-out 3 alternate; } .on3 .sc-${id} .flp { animation: none; }
    @keyframes ${id}-flap { from { transform: scaleX(1); } to { transform: scaleX(.45); } }`;
    // 2칸: 꽃과 알
    const flower = (x, y) => `<path d="M${x} ${y + 12} V350" stroke="${C.green}" stroke-width="5"/>` + [0, 72, 144, 216, 288].map((a) => `<ellipse cx="${x}" cy="${y - 14}" rx="9" ry="15" transform="rotate(${a} ${x} ${y})" fill="${C.yellow}" stroke="${C.orange}" stroke-width="2"/>`).join('') + `<circle cx="${x}" cy="${y}" r="9" fill="${C.orange}"/>`;
    body += at(2, 'pop', flower(560, 230), 0.2);
    body += at(2, 'pop', `<path d="M500 330 Q540 300 600 318 Q560 342 500 330 Z" fill="${C.mint}" stroke="${C.green}" stroke-width="2.5"/>${egg(548, 322, 0.9)}`, 1.4) + at(2, 'fin', text(600, 354, '알', { size: 18, color: C.orange }), 1.5);
    body += at(2, 'pop', tag(470, 140, '날개 두 쌍', OK, { size: 20 }) + lead(430, 150, 400, 186, C.green), 0.6);
    body += at(3, 'pop', tag(150, 150, '어른벌레', OK, { size: 26 }) + lead(192, 162, 296, 210, C.green), 0.3);
    body += `<g class="b3"><rect class="flash flash3" x="${STRIP_X[3] - 56}" y="14" width="112" height="84" rx="12" fill="none" stroke="${C.green}" stroke-width="5"/></g>`;
    put('3-1/과학/4/어른벌레', svg(id, body, css));
  })();

  // ════ 자손: 어미 나비가 낳은 알 → 닮은 나비 → 그 나비가 낳은 알 → 또 닮은 나비, 대를 잇는 줄 ════
  (function () {
    const id = 't31-s4-jason';
    let css = base(id);
    const X = [90, 320, 550], BY = 140;
    const bfly = (x) => `<g transform="translate(${x} ${BY}) scale(.4)">${butterfly()}</g>`;
    const eggs = (x) => `<path d="M${x - 44} 244 Q${x} 220 ${x + 44} 244 Q${x} 258 ${x - 44} 244 Z" fill="${C.mint}" stroke="${C.green}" stroke-width="2.5"/>${egg(x - 16, 242, 0.7)}${egg(x, 238, 0.7)}${egg(x + 16, 242, 0.7)}`;
    // 알에서 다음 나비로: 비스듬한 흐르는 화살표, 위에 작은 애벌레·번데기
    const grow = (x1, x2) => {
      const a = [x1 + 52, 232], b = [x2 - 66, 168], ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
      return `<path class="mar" d="M${a[0]} ${a[1]} L${f(b[0] - 5 * Math.cos(ang))} ${f(b[1] - 5 * Math.sin(ang))}" stroke="${C.green}" stroke-width="5" stroke-dasharray="12 9" fill="none" stroke-linecap="round"/>${head(b[0], b[1], ang, C.green, 5)}`
        + larva(f(x1 + 70), 196, 36) + pupa(f(x1 + 140), 176, 0.38);
    };
    let body = at(1, 'pop', bfly(X[0]), 0) + at(1, 'fin', text(X[0], 58, '어미', { size: 20 }), 0.2);
    body += at(1, 'pop', eggs(X[0]), 0.9) + at(1, 'fin', text(X[0], 282, '알', { size: 20 }), 1);
    body += at(2, 'fin', grow(X[0], X[1]), 0.1) + at(2, 'pop', bfly(X[1]), 0.8) + ring(X[1], BY, 50, 2, C.green, 1.3);
    body += at(3, 'pop', eggs(X[1]), 0.1) + at(3, 'fin', grow(X[1], X[2]), 0.6) + at(3, 'pop', bfly(X[2]), 1.3) + ring(X[2], BY, 50, 3, C.green, 1.8);
    // 4칸: 자손 괄호(첫 알부터 마지막 나비까지)
    body += at(4, 'fin', `<path d="M${X[0] - 48} 300 V312 H${X[2] + 64} V300" stroke="${C.orange}" stroke-width="4" fill="none" stroke-linejoin="round"/>`, 0) + at(4, 'pop', tag(f((X[0] + X[2]) / 2 + 8), 334, '자손', HOT, { size: 24 }), 0.3);
    body += ring(X[0], BY, 54, 4, C.muted, 0);
    put('3-1/과학/4/자손', svg(id, body, css));
  })();
})(typeof window !== 'undefined' ? window : globalThis);
