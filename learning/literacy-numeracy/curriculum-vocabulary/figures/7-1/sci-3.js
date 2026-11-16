// 과학 7-1 낱말 도식(Ⅱ단원 생물의 다양성): 변이·적응·종, 생물분류·분류체계, 핵막과 다섯 계(미래엔 62쪽 물음 차례), 생태통로.
// 움직임은 transform·opacity·stroke-dashoffset 만 쓴다(모양·위치 속성은 CSS 로 바꾸지 않는다, 아이패드 사파리).
(function (root) {
  'use strict';
  const { C, svg, text, put } = root.FigureKit;
  const f = (n) => +(+n).toFixed(1);
  const dl = (s) => (s ? ` style="animation-delay:${s}s"` : '');
  const g = (cls, inner, s = 0) => `<g class="${cls}"${dl(s)}>${inner}</g>`;
  // 칸 n 에 나타나며 kind(pop·fin·rise·drop) 움직임을 한 번 한다
  const at = (n, kind, inner, s = 0) => `<g class="b${n}">${g(`${kind} ${kind}${n}`, inner, s)}</g>`;
  // at 과 같되 hide 칸부터 사라진다
  const atH = (n, hide, kind, inner, s = 0) => `<g class="b${n} h${hide}">${g(`${kind} ${kind}${n}`, inner, s)}</g>`;
  // 칸 n 부터 보이고, hide 칸부터 사라진다
  const shown = (n, inner, hide) => `<g class="b${n}${hide ? ' h' + hide : ''}">${inner}</g>`;
  const st = (o) => ` style="${Object.entries(o).map(([k, v]) => `${k}:${v}`).join(';')}"`;
  const seeded = (seed) => () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const rad = (a) => (a * Math.PI) / 180;
  // 글자 폭 어림(맑은 고딕 굵게: 한글 1em, 숫자·기호 .6em, 빈칸 .3em)
  const tw = (s, size) => [...String(s)].reduce((a, c) => a + (/[가-힣]/.test(c) ? 1 : c === ' ' ? 0.3 : 0.6), 0) * size;
  const HOT = [C.peach, C.orange], RED = [C.peach, C.red], COLD = [C.sky, C.blue], OK = [C.mint, C.green], GRAY = ['white', C.muted], LIL = [C.lilac, C.purple], SUN = ['#fdf3d0', C.orange];
  const tag = (cx, cy, label, [fill, stroke] = OK, { size = 20 } = {}) => {
    const w = Math.round(tw(label, size) + size * 1.3), h = Math.round(size * 1.7);
    return `<g><rect x="${f(cx - w / 2)}" y="${f(cy - h / 2)}" width="${w}" height="${h}" rx="${h / 2}" fill="${fill}" stroke="${stroke}" stroke-width="2.5"/>${text(f(cx), f(cy + size * 0.36), label, { size })}</g>`;
  };
  const lead = (x1, y1, x2, y2, color = C.muted, w = 2.5) => `<path d="M${f(x1)} ${f(y1)} L${f(x2)} ${f(y2)}" stroke="${color}" stroke-width="${w}" stroke-linecap="round"/>`;
  const head = (x, y, ang, color, w = 4) => {
    const l = 8 + w * 1.4, p = (d) => `${f(x - l * Math.cos(ang + d))} ${f(y - l * Math.sin(ang + d))}`;
    return `<path d="M${p(-0.5)} L${f(x)} ${f(y)} L${p(0.5)}" stroke="${color}" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  };
  // 곧은 화살표
  const solid = (x1, y1, x2, y2, color = C.muted, w = 4) => {
    const ang = Math.atan2(y2 - y1, x2 - x1);
    return `<path d="M${f(x1)} ${f(y1)} L${f(x2 - w * Math.cos(ang))} ${f(y2 - w * Math.sin(ang))}" stroke="${color}" stroke-width="${w}" stroke-linecap="round"/>${head(x2, y2, ang, color, w)}`;
  };
  const ring = (cx, cy, r, n, color = C.green, s = 0) => `<g class="b${n}"><circle class="ring ring${n}"${dl(s)} cx="${f(cx)}" cy="${f(cy)}" r="${r}" fill="none" stroke="${color}" stroke-width="4"/></g>`;
  const glowRect = (x, y, w, h, n, color = C.green, s = 0, rx = 14) => `<g class="b${n}"><rect class="flash flash${n}"${dl(s)} x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="${rx}" fill="none" stroke="${color}" stroke-width="5"/></g>`;
  // 칸 n 에 그어지는 선(pathLength 1)
  const drawPath = (d, n, color, w = 4, s = 0, extra = '') => `<g class="b${n}"><path class="draw draw${n}"${dl(s)} pathLength="1" d="${d}" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" fill="none"${extra}/></g>`;
  // 칸마다 바뀌는 CSS 값(vals[0] 은 첫 칸이 열리기 전 모습, null 은 그대로)
  const states = (id, cls, prop, vals, sec = 1.6, delay = 0.2) => `.sc-${id} .${cls} { ${prop}: ${vals[0]}; transition: ${prop} ${sec}s ease-in-out ${delay}s; }`
    + vals.slice(1).map((v, i) => v == null ? '' : `.on${i + 1} .sc-${id} .${cls} { ${prop}: ${v}; }`).join('');
  // 떨리는 입자: a 떨림 폭(px), d 한 번 떠는 시간(s)
  const jig = (inner, a = 2, d = 0.9, s = 0, cls = 'jg') => `<g class="${cls}"${st({ '--a': a + 'px', '--d': d + 's', 'animation-delay': f(s) + 's' })}>${inner}</g>`;
  const dot = (x, y, r, fill, stroke, sw = 2) => `<circle cx="${f(x)}" cy="${f(y)}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
  // 해(빛살이 천천히 숨 쉰다)
  const sunIcon = (x, y, r = 24) => {
    let rays = '';
    for (let k = 0; k < 8; k++) { const a = (k * Math.PI) / 4; rays += `<path d="M${f(x + (r + 6) * Math.cos(a))} ${f(y + (r + 6) * Math.sin(a))} L${f(x + (r + 15) * Math.cos(a))} ${f(y + (r + 15) * Math.sin(a))}" stroke="${C.orange}" stroke-width="4" stroke-linecap="round"/>`; }
    return `<g class="rays">${rays}</g><circle cx="${x}" cy="${y}" r="${r}" fill="${C.yellow}" stroke="${C.orange}" stroke-width="3"/>`;
  };
  // 불꽃(밑 가운데 x, by)
  const flame = (x, by, s = 1) => `<g class="flk"><path d="M${f(x)} ${f(by - 46 * s)} C${f(x + 20 * s)} ${f(by - 24 * s)} ${f(x + 18 * s)} ${f(by)} ${f(x)} ${f(by)} C${f(x - 18 * s)} ${f(by)} ${f(x - 20 * s)} ${f(by - 24 * s)} ${f(x)} ${f(by - 46 * s)} Z" fill="${C.orange}"/><path d="M${f(x)} ${f(by - 24 * s)} C${f(x + 9 * s)} ${f(by - 12 * s)} ${f(x + 8 * s)} ${f(by)} ${f(x)} ${f(by)} C${f(x - 8 * s)} ${f(by)} ${f(x - 9 * s)} ${f(by - 12 * s)} ${f(x)} ${f(by - 24 * s)} Z" fill="${C.yellow}"/></g>`;
  // 흐르는 점선(행진)
  const march = (d, color, w = 4, extra = '') => `<path class="mar" d="${d}" stroke="${color}" stroke-width="${w}" stroke-dasharray="10 14" stroke-linecap="round" fill="none"${extra}/>`;
  // 아지랑이(위로 올라가며 사라지는 물결)
  const wave = (x, y, h = 30, color = C.orange) => `<path d="M${f(x)} ${f(y)} q-7 ${f(-h / 4)} 0 ${f(-h / 2)} q7 ${f(-h / 4)} 0 ${f(-h / 2)}" stroke="${color}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`;
  const waves = (xs, y, h, color, up = 26) => xs.map((x, k) => `<g class="up"${st({ '--up': -up + 'px', 'animation-delay': f(-k * 0.8) + 's' })}>${wave(x, y, h, color)}</g>`).join('');

  const base = (id) => {
    let s = `
    .sc-${id} .pop, .sc-${id} .pulse, .sc-${id} .ring, .sc-${id} .rays { transform-box: fill-box; transform-origin: center; }
    .sc-${id} .rays { animation: ${id}-pulse 2.4s ease-in-out infinite; }
    .sc-${id} .flk { transform-box: fill-box; transform-origin: 50% 100%; animation: ${id}-flk .5s ease-in-out infinite alternate; }
    .sc-${id} .mar { animation: ${id}-mar .7s linear infinite; }
    .sc-${id} .draw { stroke-dasharray: 1; stroke-dashoffset: 1; }
    .sc-${id} .ring, .sc-${id} .cf { opacity: 0; }
    .sc-${id} .lv, .sc-${id} .shr { transform-box: fill-box; transform-origin: 50% 100%; }
    .sc-${id} .up { animation: ${id}-up 2.4s ease-out infinite; }
    .sc-${id} .bob { animation: ${id}-bob 2.6s ease-in-out infinite alternate; }
    .sc-${id} .jg { animation: ${id}-jg var(--d, .9s) linear infinite; }
    @keyframes ${id}-pop { 0% { opacity: 0; transform: scale(.3); } 70% { opacity: 1; transform: scale(1.12); } 100% { opacity: 1; transform: scale(1); } }
    @keyframes ${id}-fin { from { opacity: 0; } to { opacity: 1; } }
    @keyframes ${id}-rise { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
    @keyframes ${id}-drop { from { opacity: 0; transform: translateY(-40px); } to { opacity: 1; transform: none; } }
    @keyframes ${id}-pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.12); } }
    @keyframes ${id}-flash { 0% { opacity: 0; } 20% { opacity: 1; } 40% { opacity: .25; } 60% { opacity: 1; } 80% { opacity: .25; } 100% { opacity: 1; } }
    @keyframes ${id}-ring { 0% { opacity: .9; transform: scale(1); } 100% { opacity: 0; transform: scale(1.6); } }
    @keyframes ${id}-mar { from { stroke-dashoffset: 24; } to { stroke-dashoffset: 0; } }
    @keyframes ${id}-drawk { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
    @keyframes ${id}-mv { from { transform: translate(0, 0); } to { transform: translate(var(--tx, 0px), var(--ty, 0px)); } }
    @keyframes ${id}-fly { 0% { opacity: 0; transform: translate(var(--dx, 0px), var(--dy, 0px)); } 15% { opacity: 1; } 100% { opacity: 1; transform: translate(0, 0); } }
    @keyframes ${id}-go { 0% { opacity: 0; transform: translate(0, 0); } 15% { opacity: 1; } 85% { opacity: 1; } 100% { opacity: 0; transform: translate(var(--dx, 0px), var(--dy, 0px)); } }
    @keyframes ${id}-up { 0% { opacity: 0; transform: translateY(0); } 20%, 70% { opacity: 1; } 100% { opacity: 0; transform: translateY(var(--up, -60px)); } }
    @keyframes ${id}-bob { from { transform: translateY(-3px); } to { transform: translateY(3px); } }
    @keyframes ${id}-flk { from { transform: scale(.92, .86); } to { transform: scale(1.04, 1.06); } }
    @keyframes ${id}-lv { from { transform: scaleY(0); } to { transform: scaleY(1); } }
    @keyframes ${id}-jg { 0%, 100% { transform: translate(0, 0); } 20% { transform: translate(var(--a), calc(var(--a) * -.8)); } 45% { transform: translate(calc(var(--a) * -.6), var(--a)); } 70% { transform: translate(calc(var(--a) * -1), calc(var(--a) * -.4)); } 85% { transform: translate(calc(var(--a) * .5), calc(var(--a) * .7)); } }
    .sc-${id} .go { animation: ${id}-go var(--d, 2.2s) ease-in-out infinite; }
    `;
    for (let n = 1; n <= 5; n++) s += `
    .on${n} .sc-${id} .pop${n} { animation: ${id}-pop .5s ease-out both; }
    .on${n} .sc-${id} .fin${n} { animation: ${id}-fin .6s ease-out both; }
    .on${n} .sc-${id} .rise${n} { animation: ${id}-rise .5s ease-out both; }
    .on${n} .sc-${id} .drop${n} { animation: ${id}-drop .6s ease-out both; }
    .on${n} .sc-${id} .pulse${n} { animation: ${id}-pulse .7s ease-in-out .3s 2; }
    .on${n} .sc-${id} .flash${n} { animation: ${id}-flash 1.4s ease-in-out both; }
    .on${n} .sc-${id} .ring${n} { animation: ${id}-ring 1.1s ease-out .3s 2; }
    .on${n} .sc-${id} .draw${n} { animation: ${id}-drawk 1.2s ease-in-out .2s both; }
    .on${n} .sc-${id} .cf${n} { animation: ${id}-fin .8s ease-out 1s both; }
    .on${n} .sc-${id} .mv${n} { animation: ${id}-mv 1.4s ease-in-out .2s both; }
    .on${n} .sc-${id} .fly${n} { animation: ${id}-fly 1.1s ease-out both; }
    .on${n} .sc-${id} .lv${n} { animation: ${id}-lv 1s ease-out both; }`;
    return s;
  };

  // ════ Ⅱ단원 생명활동·종·분류 ════
  const smooth3 = (pts) => {
    const n = pts.length;
    let d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
    for (let i = 0; i < n; i++) {
      const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
      d += ` C${f(p1[0] + (p2[0] - p0[0]) / 6)} ${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)} ${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])} ${f(p2[1])}`;
    }
    return d + ' Z';
  };
  const blobD3 = (rx, ry) => smooth3(Array.from({ length: 14 }, (_, i) => { const a = (i / 14) * Math.PI * 2, w = 1 + 0.045 * Math.sin(3 * a + 1) + 0.03 * Math.cos(5 * a); return [rx * w * Math.cos(a), ry * w * Math.sin(a)]; }));
  // 옆을 보는 물고기(가운데 cx, cy, 크기 s, 오른쪽을 본다)
  const fish = (cx, cy, s = 1, fill = C.sky, stroke = C.blue) => {
    const P = (x, y) => `${f(cx + x * s)} ${f(cy + y * s)}`;
    return `<path d="M${P(-40, 0)} L${P(-62, -20)} L${P(-58, 0)} L${P(-62, 20)} Z" fill="${fill}" stroke="${stroke}" stroke-width="2.5" stroke-linejoin="round"/>`
      + `<path d="M${P(-44, 0)} C${P(-24, -30)} ${P(26, -30)} ${P(46, 0)} C${P(26, 30)} ${P(-24, 30)} ${P(-44, 0)} Z" fill="${fill}" stroke="${stroke}" stroke-width="2.5"/>`
      + `<circle cx="${f(cx + 28 * s)}" cy="${f(cy - 5 * s)}" r="${f(4 * s)}" fill="${C.ink}"/><path d="M${P(14, -12)} Q${P(8, 0)} ${P(14, 12)}" stroke="${stroke}" stroke-width="2" fill="none"/>`;
  };

  // ── 생명활동: 양분 얻기·숨쉬기·자라기·자손 남기기 ──
  (function () {
    const id = 't71-s2-saengmyeong';
    let css = base(id) + `.sc-${id} .grow { transform-box: fill-box; transform-origin: center; animation: ${id}-grow 3s ease-in-out infinite; animation-play-state: paused; } .on2 .sc-${id} .grow { animation-play-state: running; }
      @keyframes ${id}-grow { 0% { transform: scale(.55); } 70%, 100% { transform: scale(1.05); } }`;
    let body = '';
    const panel = (x, y) => `<rect x="${x - 140}" y="${y - 66}" width="280" height="132" rx="16" fill="white" stroke="${C.line}" stroke-width="2.5"/>`;
    const P = [[165, 92], [475, 92], [165, 268], [475, 268]];
    P.forEach(([x, y]) => { body += panel(x, y); });
    // 양분 얻기: 먹이 알갱이가 입으로
    body += fish(150, 84, 1);
    body += shown(1, [0, 1, 2].map((k) => `<g class="go"${st({ '--dx': '-62px', '--dy': f(4 - k * 4) + 'px', '--d': '2.4s', 'animation-delay': f(-k * 0.8) + 's' })}>${dot(258, 80 + k * 4, 6, C.green, 'white', 2)}</g>`).join(''));
    body += at(1, 'fin', text(165, 148, '양분 얻기', { size: 18 }), 0.3);
    // 숨쉬기: 아가미 둘레 거품
    body += fish(470, 84, 1);
    body += shown(1, [0, 1, 2].map((k) => `<circle class="up"${st({ '--up': '-50px', 'animation-delay': f(-k * 0.8) + 's' })} cx="${506 + k * 6}" cy="70" r="${5 + k}" fill="white" stroke="${C.blue}" stroke-width="2"/>`).join(''));
    body += at(1, 'fin', text(475, 148, '숨쉬기', { size: 18 }), 0.6);
    // 자라기: 작은 물고기가 커진다
    body += `<g class="b2"><g class="grow">${fish(165, 258, 1.05)}</g></g>` + at(2, 'fin', text(165, 324, '자라기', { size: 18 }), 0.3);
    // 자손 남기기: 알과 새끼
    let eggs = '';
    [[410, 276], [426, 286], [404, 294], [422, 300], [440, 296]].forEach(([x, y], k) => { eggs += at(2, 'pop', dot(x, y, 7, C.peach, C.orange, 2), f(0.3 + k * 0.15)); });
    body += `<g class="b2">${fish(500, 250, 0.9)}</g>` + eggs + at(2, 'pop', fish(560, 296, 0.35), 1.3);
    body += at(2, 'fin', text(475, 324, '자손 남기기', { size: 18 }), 0.6);
    // 칸 3: 넷을 묶는다
    body += P.map(([x, y], k) => glowRect(x - 140, y - 66, 280, 132, 3, C.green, k * 0.15, 16)).join('');
    body += at(3, 'pop', tag(320, 180, '생명활동', OK, { size: 26 }), 0.8);
    put('7-1/과학/2/생명활동', svg(id, body, css));
  })();

  // ── 종: 말끼리는 자손이 다시 자손을 낳고, 당나귀와 말 사이의 노새는 자손을 낳지 못한다(미래엔 58쪽) ──
  (function () {
    const id = 't71-s2-jong';
    let css = base(id);
    const face = (x, y, r, name, [fill, stroke]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="3"/>` + text(x, y + 7, name, { size: name.length > 2 ? 18 : 20 });
    const HORSE = [C.peach, C.orange], DONKEY = ['white', C.muted], MULE = [C.lilac, C.purple];
    const row = (y, a, b, child, kid, ok, n) => {
      let s = at(n, 'pop', face(70, y, 38, a[0], a[1]), 0) + at(n, 'fin', text(132, y + 10, '+', { size: 30, color: C.muted }), 0.2) + at(n, 'pop', face(194, y, 38, b[0], b[1]), 0.3);
      s += drawPath(`M238 ${y} H288`, n, C.muted, 4, 0.5) + at(n, 'fin', head(292, y, 0, C.muted, 4), 1.3);
      s += at(n, 'pop', face(340, y, 34, child[0], child[1]), 1.2);
      s += drawPath(`M380 ${y} H428`, n, C.muted, 4, 1.5) + at(n, 'fin', head(432, y, 0, C.muted, 4), 2.1);
      s += at(n, 'pop', ok ? face(476, y, 28, kid, child[1]) : `<circle cx="476" cy="${y}" r="28" fill="white" stroke="${C.line}" stroke-width="3" stroke-dasharray="6 5"/>` + text(476, y + 7, kid, { size: 18, color: C.muted }), 1.9);
      s += at(n, 'pop', ok ? `<circle cx="560" cy="${y}" r="24" fill="${C.mint}" stroke="${C.green}" stroke-width="3"/><path d="M548 ${y} L557 ${y + 9} L573 ${y - 9}" stroke="${C.green}" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`
        : `<circle cx="560" cy="${y}" r="24" fill="${C.peach}" stroke="${C.red}" stroke-width="3"/><path d="M550 ${y - 10} L570 ${y + 10} M570 ${y - 10} L550 ${y + 10}" stroke="${C.red}" stroke-width="5" stroke-linecap="round"/>`, 2.0);
      return s;
    };
    let body = row(96, ['말', HORSE], ['말', HORSE], ['망아지', HORSE], '자손', true, 1);
    body += row(254, ['당나귀', DONKEY], ['말', HORSE], ['노새', MULE], '자손', false, 2);
    body += at(1, 'fin', text(340, 158, '자라서', { size: 18, color: C.muted }), 1.4) + at(2, 'fin', text(340, 316, '자라서', { size: 18, color: C.muted }), 1.4);
    // 칸 3: 같은 종 / 다른 종
    body += at(3, 'fin', `<rect x="24" y="48" width="208" height="96" rx="48" fill="none" stroke="${C.green}" stroke-width="4" stroke-dasharray="10 7"/>`, 0.2) + at(3, 'pop', tag(128, 30, '같은 종', OK, { size: 20 }), 0.5);
    body += at(3, 'fin', `<circle cx="70" cy="254" r="48" fill="none" stroke="${C.red}" stroke-width="4" stroke-dasharray="10 7"/><circle cx="194" cy="254" r="48" fill="none" stroke="${C.red}" stroke-width="4" stroke-dasharray="10 7"/>`, 0.8) + at(3, 'pop', tag(132, 336, '다른 종', RED, { size: 20 }), 1.1);
    put('7-1/과학/2/종', svg(id, body, css));
  })();

  // ── 분류체계: 종 → 속 → 과 → 목 → 강 → 문 → 계, 아래로 갈수록 넓은 무리(미래엔 59쪽 들고양이 보기) ──
  (function () {
    const id = 't71-s2-bunryu';
    let css = base(id);
    const L = [['종', '들고양이종'], ['속', '고양이속'], ['과', '고양이과'], ['목', '식육목'], ['강', '포유강'], ['문', '척삭동물문'], ['계', '동물계']];
    const CX = 370, y0 = 36, dy = 46;
    const colors = [C.orange, C.red, C.purple, C.blue, C.green, C.yellow, C.muted];
    let body = '';
    const r = seeded(17);
    L.forEach(([lv, ex], k) => {
      const w = 140 + k * 60, y = y0 + k * dy, n = k < 3 ? 1 : 2, s = f((k < 3 ? k : k - 3) * 0.35 + 0.1);
      let row = `<rect x="${f(CX - w / 2)}" y="${y - 18}" width="${w}" height="36" rx="18" fill="${k === 0 ? C.peach : 'white'}" stroke="${k === 0 ? C.orange : C.muted}" stroke-width="2.5"/>` + text(CX, y + 7, ex, { size: 18 });
      // 무리가 커질수록 함께 묶인 다른 생물(점)이 늘어난다
      for (let j = 0; j < k * 2; j++) { const side = j % 2 ? 1 : -1, off = 62 + Math.floor(j / 2) * 34 + r() * 6; row += dot(f(CX + side * off), y, 6, colors[(j + k) % 7], 'white', 1.5); }
      body += at(n, 'rise', row, s) + at(n, 'fin', text(46, y + 8, lv, { size: 22, color: C.green }), s);
    });
    // 칸 3: 왼쪽 화살표(점점 큰 무리)
    body += drawPath(`M84 ${y0 - 6} V${y0 + 6 * dy + 6}`, 3, C.green, 5, 0.1) + at(3, 'fin', head(84, y0 + 6 * dy + 8, Math.PI / 2, C.green, 5), 1.2);
    body += L.map((_, k) => glowRect(f(CX - (140 + k * 60) / 2 - 3), y0 + k * dy - 21, 146 + k * 60, 42, 3, C.green, f(0.2 + k * 0.12), 21)).join('');
    put('7-1/과학/2/분류체계', svg(id, body, css));
  })();

  // ── 핵막: 세균은 유전 물질이 그냥 퍼져 있고, 동물 세포는 얇은 막이 감싸 핵을 이룬다 ──
  (function () {
    const id = 't71-s2-haekmak';
    let css = base(id);
    let body = '';
    // 왼쪽: 세균(막대 꼴)
    body += `<rect x="40" y="130" width="220" height="110" rx="55" fill="${C.mint}" stroke="${C.green}" stroke-width="5"/><rect x="48" y="138" width="204" height="94" rx="47" fill="white"/><rect x="48" y="138" width="204" height="94" rx="47" fill="${C.yellow}" fill-opacity=".2" stroke="${C.orange}" stroke-width="2.5"/>`;
    body += `<path d="M90 190 c10 -30 30 20 44 -6 s26 -30 36 4 s24 24 36 -10 M110 168 c14 10 24 -12 40 -2 s22 18 34 -4" stroke="${C.purple}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`;
    body += text(150, 280, '세균', { size: 20 });
    // 오른쪽: 동물 세포
    const NX = 470, NY = 186;
    body += `<path d="${blobD3(130, 100)}" transform="translate(${NX} ${NY})" fill="${C.yellow}" fill-opacity=".2" stroke="${C.orange}" stroke-width="4"/>`;
    body += `<circle cx="${NX - 6}" cy="${NY - 4}" r="44" fill="${C.lilac}" fill-opacity=".55"/>`;
    body += `<path d="M${NX - 30} ${NY - 6} c8 -22 22 16 32 -4 s18 -22 26 4 M${NX - 22} ${NY + 16} c10 8 18 -10 30 -2" stroke="${C.purple}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`;
    body += `<circle cx="${NX - 6}" cy="${NY - 4}" r="44" fill="none" stroke="${C.purple}" stroke-width="3" opacity=".25"/>`;
    body += text(NX, 318, '동물 세포', { size: 20 });
    body += at(1, 'pop', lead(200, 92, 170, 160, C.purple) + lead(200, 92, NX - 10, NY - 30, C.purple) + tag(200, 76, '유전 물질', LIL, { size: 18 }), 0.4);
    // 칸 2: 오른쪽은 막이 둘러싼다, 왼쪽은 막이 없다
    body += drawPath(`M${NX - 6} ${NY - 48} A44 44 0 1 1 ${NX - 6.1} ${NY - 48}`, 2, C.purple, 6, 0.2);
    body += atH(2, 3, 'pop', lead(NX + 90, 70, NX + 26, NY - 34, C.purple) + tag(NX + 90, 56, '얇은 껍질', LIL, { size: 18 }), 1.2);
    body += at(2, 'pop', tag(150, 330, '껍질 없음', GRAY, { size: 18 }), 1.5);
    // 칸 3
    body += `<g class="b3"><circle class="flash flash3" cx="${NX - 6}" cy="${NY - 4}" r="44" fill="none" stroke="${C.purple}" stroke-width="9"/></g>`;
    body += at(3, 'pop', lead(NX + 90, 70, NX + 26, NY - 34, C.purple) + tag(NX + 90, 56, '핵막', LIL, { size: 24 }), 0.6);
    put('7-1/과학/2/핵막', svg(id, body, css));
  })();

  // ════ 다섯 계: 미래엔 62쪽 물음 차례로 갈라지는 나무 ════
  // 생물 → 핵막? 없으면 원핵생물계 / 있으면 → 구조가 단순하면 원생생물계 / 아니면 → 광합성 하면 식물계 / 못 하면 → 세포벽 있으면 균계, 없으면 동물계
  const KX = 498;
  const LEAF = { won: ['원핵생물계', 44], saeng: ['원생생물계', 112], sik: ['식물계', 182], gyun: ['균계', 256], dong: ['동물계', 330] };
  const ROUTE = {
    won: 'M79 190 H100 V44 H498',
    saeng: 'M79 190 H100 V222 H190 V112 H498',
    sik: 'M79 190 H100 V222 H190 V258 H280 V182 H498',
    gyun: 'M79 190 H100 V222 H190 V258 H280 V300 H395 V256 H498',
    dong: 'M79 190 H100 V222 H190 V258 H280 V300 H395 V330 H498'
  };
  const kingTree = () => {
    let s = `<path d="M79 190 H100 M100 44 V222 M100 44 H498 M100 222 H190 M190 112 V258 M190 112 H498 M190 258 H280 M280 182 V300 M280 182 H498 M280 300 H395 M395 256 V330 M395 256 H498 M395 330 H498" stroke="${C.line}" stroke-width="4" fill="none" stroke-linejoin="round"/>`;
    s += tag(46, 190, '생물', GRAY, { size: 20 });
    s += text(300, 34, '핵막 없음', { size: 18, color: C.muted }) + text(145, 212, '핵막 있음', { size: 18, color: C.muted }) + text(344, 102, '구조가 단순', { size: 18, color: C.muted })
      + text(389, 172, '광합성 함', { size: 18, color: C.muted }) + text(337, 290, '광합성 못 함', { size: 18, color: C.muted }) + text(446, 246, '세포벽 있음', { size: 18, color: C.muted }) + text(446, 320, '세포벽 없음', { size: 18, color: C.muted });
    Object.values(LEAF).forEach(([name, y]) => { const w = Math.round(tw(name, 18) + 24); s += `<rect x="${KX + 2}" y="${y - 16}" width="${w}" height="32" rx="16" fill="white" stroke="${C.muted}" stroke-width="2.5"/>` + text(KX + 2 + w / 2, y + 6.5, name, { size: 18 }); });
    return s;
  };
  // 왼쪽 아래 보기 칸
  const EX = {
    won: () => `<rect x="40" y="276" width="92" height="40" rx="20" fill="${C.mint}" stroke="${C.green}" stroke-width="3"/><path d="M58 298 c8 -14 16 10 24 -2 s14 -12 20 2 s10 8 14 -2" stroke="${C.purple}" stroke-width="2.5" fill="none" stroke-linecap="round"/>`,
    saeng: () => `<path d="M30 296 C34 274 70 270 92 274 C120 270 140 282 138 296 C140 312 112 320 92 316 C84 306 72 306 64 316 C44 320 28 312 30 296 Z" fill="${C.sky}" stroke="${C.blue}" stroke-width="2.5"/><ellipse cx="92" cy="292" rx="15" ry="9" fill="${C.lilac}" stroke="${C.purple}" stroke-width="2"/>`,
    gyun: () => `<path d="M50 288 C50 262 122 262 122 288 Z" fill="${C.peach}" stroke="${C.orange}" stroke-width="3" stroke-linejoin="round"/><rect x="77" y="288" width="18" height="26" rx="5" fill="white" stroke="${C.orange}" stroke-width="2.5"/><path d="M86 314 C70 322 60 318 48 324 M86 314 C100 322 114 316 126 324 M86 314 V328" stroke="${C.muted}" stroke-width="2" fill="none" stroke-linecap="round"/>`,
    sik: () => `<path d="M86 256 L60 290 H76 L52 316 H120 L96 290 H112 Z" fill="${C.mint}" stroke="${C.green}" stroke-width="3" stroke-linejoin="round"/><rect x="80" y="316" width="12" height="14" fill="${C.peach}" stroke="${C.orange}" stroke-width="2"/>`,
    dong: () => `<path class="worm" d="M40 300 C56 282 70 318 86 300 S116 282 132 300" stroke="${C.orange}" stroke-width="13" fill="none" stroke-linecap="round"/><path d="M40 300 C56 282 70 318 86 300 S116 282 132 300" stroke="${C.peach}" stroke-width="8" fill="none" stroke-linecap="round" stroke-dasharray="7 5"/><circle cx="130" cy="298" r="2.5" fill="${C.ink}"/>`
  };
  const EXNAME = { won: '대장균', saeng: '짚신벌레', gyun: '버섯', sik: '소나무', dong: '지렁이' };
  const kingdom = (key, word, idSuffix) => {
    const id = `t71-s2-k-${idSuffix}`;
    let css = base(id);
    let body = at(1, 'fin', kingTree(), 0);
    body += drawPath(ROUTE[key], 2, C.green, 7, 0.1);
    const [name, y] = LEAF[key], w = Math.round(tw(name, 18) + 24);
    body += `<g class="b2"><rect class="cf cf2" style="animation-delay:1.1s" x="${KX + 2}" y="${y - 16}" width="${w}" height="32" rx="16" fill="${C.mint}" stroke="${C.green}" stroke-width="3"/>${''}</g>`;
    body += at(2, 'fin', text(KX + 2 + w / 2, y + 6.5, name, { size: 18 }), 1.1);
    body += at(2, 'pop', `<rect x="18" y="244" width="140" height="108" rx="14" fill="white" stroke="${C.green}" stroke-width="2.5"/>` + EX[key]() + text(88, 252 + 92, EXNAME[key], { size: 18 }), 1.3);
    if (key === 'gyun') body += shown(2, [0, 1, 2].map((k) => `<g class="go"${st({ '--dx': f(-20 + k * 20) + 'px', '--dy': '26px', '--d': '2.4s', 'animation-delay': f(-k * 0.8) + 's' })}>${dot(70 + k * 16, 290, 3, C.orange, 'none', 0)}</g>`).join(''));
    if (key === 'won') body += at(2, 'fin', text(88, 268, '핵막 없음', { size: 18, color: C.muted }), 1.6);
    css += `.sc-${id} .worm { animation: ${id}-bob 1s ease-in-out infinite alternate; }`;
    body += ring(KX + 2 + w / 2, y, w / 2 + 6, 3, C.green, 0.2) + glowRect(KX - 2, y - 20, w + 8, 40, 3, C.green, 0.4, 20);
    put(`7-1/과학/2/${word}`, svg(id, body, css));
  };
  kingdom('won', '원핵생물계', 'wonhaek');
  kingdom('saeng', '원생생물계', 'wonsaeng');
  kingdom('gyun', '균계', 'gyun');
  kingdom('sik', '식물계', 'sikmul');
  kingdom('dong', '동물계', 'dongmul');
})(typeof window !== 'undefined' ? window : globalThis);
