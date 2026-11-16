// 과학 7-1 낱말 도식(Ⅰ단원 과학적 탐구 방법·증기 기관, Ⅲ단원 열): 탐구 단계와 입자 운동·열의 이동처럼 움직임으로 보여야 하는 낱말을 코드로 그린다.
// 탐구 낱말은 한 가지 탐구(햇빛 아래 검은 컵·흰 컵의 온도, 미래엔 14~15쪽)를 따라가고, 위 띠에 여섯 단계 중 지금 단계를 짙게 칠한다.
// 입자는 동그라미, 뜨거움은 C.orange·C.red, 차가움은 C.blue. 입자의 떨림 폭·빠르기로 온도를 나타낸다.
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

  // ════ Ⅰ단원 과학적 탐구 방법: 한 가지 탐구(햇빛 아래 검은 컵·흰 컵의 온도)를 따라 단계마다 보여 준다 ════
  // 위쪽 띠: 탐구의 여섯 단계(미래엔·천재 공통 순서), 지금 단계만 짙은 초록
  const STEPS = ['문제 인식', '가설 설정', '탐구 설계', '탐구 수행', '자료 해석', '결론 도출'];
  const stepStrip = (active) => {
    const w = 92, h = 32, gap = 11.6, x0 = (640 - (6 * w + 5 * gap)) / 2, y = 30;
    let s = '';
    STEPS.forEach((t, k) => {
      const x = x0 + k * (w + gap), on = k === active, done = k < active;
      const box = `<rect x="${f(x)}" y="${y - h / 2}" width="${w}" height="${h}" rx="${h / 2}" fill="${on ? C.green : done ? C.mint : 'white'}" stroke="${on ? C.green : C.line}" stroke-width="2.5"/>`
        + text(f(x + w / 2), y + 6.5, t, { size: 18, color: on ? 'white' : done ? C.ink : C.muted });
      s += on ? `<g class="b1"><g class="pulse pulse1">${box}</g></g>` : box;
      if (k < 5) { const cx = x + w + gap / 2; s += `<path d="M${f(cx - 2.5)} ${y - 5} L${f(cx + 2.5)} ${y} L${f(cx - 2.5)} ${y + 5}" stroke="${C.muted}" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`; }
    });
    return s;
  };
  // 색종이로 감싼 컵: 밑 가운데 (cx, by). paper 가 C.ink 이면 검은 컵
  const cup = (cx, by, paper, s = 1) => {
    const tw2 = 38 * s, bw2 = 30 * s, h = 92 * s, t = by - h;
    return `<path d="M${f(cx - tw2)} ${f(t)} L${f(cx - bw2)} ${f(by)} H${f(cx + bw2)} L${f(cx + tw2)} ${f(t)} Z" fill="${paper}" stroke="${C.muted}" stroke-width="3" stroke-linejoin="round"/>`
      + `<ellipse cx="${f(cx)}" cy="${f(t)}" rx="${f(tw2)}" ry="${f(7 * s)}" fill="${C.sky}" stroke="${C.muted}" stroke-width="3"/>`;
  };
  // 컵에 꽂은 온도계: 눈금 기둥 cls 를 칸마다 늘인다(scaleY)
  const thermo = (x, top, bot, cls, color = C.red) => `<rect x="${f(x - 6)}" y="${f(top)}" width="12" height="${f(bot - top)}" rx="6" fill="white" stroke="${C.muted}" stroke-width="2.5"/>`
    + `<rect class="${cls}" x="${f(x - 2.5)}" y="${f(top + 6)}" width="5" height="${f(bot - top - 6)}" rx="2.5" fill="${color}"/>`;
  // 비스듬히 내리쬐는 햇빛 줄기
  const beam = (x1, y1, x2, y2) => march(`M${x1} ${y1} L${x2} ${y2}`, C.yellow, 5);
  // 물음 카드: 색깔 → 온도 변화 ?
  const askCard = (cx, cy) => `<rect x="${cx - 92}" y="${cy - 78}" width="184" height="156" rx="16" fill="white" stroke="${C.green}" stroke-width="3"/>`
    + `<rect x="${cx - 62}" y="${cy - 62}" width="22" height="22" rx="4" fill="${C.ink}"/><rect x="${cx - 36}" y="${cy - 62}" width="22" height="22" rx="4" fill="white" stroke="${C.muted}" stroke-width="2.5"/>`
    + text(cx + 22, cy - 44, '색깔', { size: 20 }) + solid(cx, cy - 28, cx, cy + 4, C.green, 4)
    + text(cx, cy + 34, '온도 변화', { size: 20 }) + text(cx + 66, cy + 62, '?', { size: 34, color: C.orange, weight: 800 });

  // ── 문제 인식 ──
  (function () {
    const id = 't71-s1-munje';
    let css = base(id);
    let body = stepStrip(0);
    body += at(1, 'pop', sunIcon(84, 120, 30));
    body += shown(1, beam(116, 140, 222, 222) + beam(120, 134, 356, 222));
    body += cup(240, 330, C.ink) + cup(380, 330, 'white');
    body += shown(1, waves([222, 240, 258], 224, 34, C.orange) + waves([380], 224, 34, C.orange));
    body += text(240, 352, '검은 컵', { size: 18 }) + text(380, 352, '흰 컵', { size: 18 });
    // 칸 2: 궁금증
    body += at(2, 'pop', `<circle cx="310" cy="112" r="34" fill="white" stroke="${C.orange}" stroke-width="3"/>` + text(310, 128, '?', { size: 46, color: C.orange, weight: 800 }));
    body += at(2, 'fin', `<circle cx="290" cy="160" r="7" fill="white" stroke="${C.orange}" stroke-width="2.5"/><circle cx="300" cy="182" r="4.5" fill="white" stroke="${C.orange}" stroke-width="2"/>`, 0.2);
    // 칸 3: 탐구할 물음으로 적은 카드
    body += at(3, 'fly', askCard(530, 220), 0);
    body += drawPath('M348 120 C420 110 470 120 500 136', 3, C.green, 4, 0.2) + at(3, 'fin', head(502, 138, rad(30), C.green, 4), 1.2);
    body += glowRect(434, 138, 192, 164, 3, C.green, 1.2, 18);
    put('7-1/과학/1/문제 인식', svg(id, body, css));
  })();

  // ── 가설: 물음 → 경험을 떠올림 → 미리 내린 답(확인 전) ──
  (function () {
    const id = 't71-s1-gaseol';
    let css = base(id);
    let body = stepStrip(1);
    body += at(1, 'pop', askCard(118, 230));
    // 칸 2: 경험(여름에 검은 옷이 더 더웠던 일)
    const shirt = (x, y, fill) => `<path d="M${x - 30} ${y - 26} L${x - 12} ${y - 34} Q${x} ${y - 26} ${x + 12} ${y - 34} L${x + 30} ${y - 26} L${x + 40} ${y - 6} L${x + 26} ${y} L${x + 24} ${y + 34} H${x - 24} L${x - 26} ${y} L${x - 40} ${y - 6} Z" fill="${fill}" stroke="${C.muted}" stroke-width="3" stroke-linejoin="round"/>`;
    const memo = `<ellipse cx="320" cy="140" rx="104" ry="66" fill="white" stroke="${C.muted}" stroke-width="3" stroke-dasharray="8 6"/>`
      + shirt(278, 166, C.ink) + shirt(358, 168, 'white') + sunIcon(372, 102, 11);
    body += at(2, 'pop', memo, 0) + `<g class="b2">${waves([266, 290], 128, 20, C.orange, 16)}</g>` + at(2, 'pop', tag(320, 226, '경험', GRAY), 0.5);
    // 칸 3: 미리 내린 답(점선 테두리 = 아직 확인 전)
    const ans = `<rect x="430" y="150" width="184" height="160" rx="16" fill="white" stroke="${C.orange}" stroke-width="3" stroke-dasharray="9 7"/>`
      + cup(480, 290, C.ink, 0.62) + cup(566, 290, 'white', 0.62)
      + solid(480, 222, 480, 172, C.red, 6) + solid(566, 222, 566, 202, C.red, 6);
    body += at(3, 'pop', ans, 0) + at(3, 'pop', tag(522, 336, '확인 전', HOT), 0.6);
    body += drawPath('M214 250 C280 290 360 290 420 250', 3, C.orange, 4, 0.1) + at(3, 'fin', head(424, 246, rad(-35), C.orange, 4), 1.1);
    body += drawPath('M352 212 C380 232 400 236 420 236', 3, C.muted, 3, 0.1);
    body += glowRect(424, 144, 196, 172, 3, C.orange, 1.3, 18);
    put('7-1/과학/1/가설', svg(id, body, css));
  })();

  // ── 탐구 설계: 계획서 칸이 차례로 채워진다(준비물 → 조건 → 잴 것·순서) ──
  (function () {
    const id = 't71-s1-seolgye';
    let css = base(id);
    let body = stepStrip(2);
    body += `<rect x="96" y="62" width="448" height="290" rx="14" fill="white" stroke="${C.muted}" stroke-width="3"/>`;
    body += `<rect x="270" y="54" width="100" height="18" rx="6" fill="${C.line}"/>`;
    const row = (y, label) => text(158, y + 7, label, { size: 18, color: C.muted }) + `<path d="M210 ${y - 26} V${y + 26}" stroke="${C.line}" stroke-width="2"/>`;
    body += row(112, '준비물') + `<path d="M110 150 H530" stroke="${C.line}" stroke-width="2"/>` + row(206, '조건') + `<path d="M110 268 H530" stroke="${C.line}" stroke-width="2"/>` + row(310, '잴 것');
    // 칸 1: 준비물(검은 컵·흰 컵·온도계·물)
    const tool = (x, inner, k) => `<g class="b1"><g class="fly fly1"${st({ '--dx': '120px', '--dy': '-30px', 'animation-delay': f(0.3 + k * 0.25) + 's' })}>${inner}</g></g>`;
    body += tool(250, cup(250, 136, C.ink, 0.42), 0) + tool(300, cup(300, 136, 'white', 0.42), 1);
    body += tool(350, `<rect x="345" y="86" width="10" height="52" rx="5" fill="white" stroke="${C.muted}" stroke-width="2.5"/><circle cx="350" cy="136" r="8" fill="${C.red}" stroke="${C.muted}" stroke-width="2"/>`, 2);
    body += tool(420, `<path d="M400 96 H440 L436 138 H404 Z" fill="${C.sky}" stroke="${C.muted}" stroke-width="2.5" stroke-linejoin="round"/>` + text(420, 126, '물', { size: 18 }), 3);
    // 칸 2: 다르게 할 조건 · 같게 할 조건
    body += at(2, 'rise', tag(290, 182, '다르게', HOT, { size: 18 }), 0.1) + at(2, 'rise', `<rect x="350" y="170" width="24" height="24" rx="4" fill="${C.ink}"/><rect x="380" y="170" width="24" height="24" rx="4" fill="white" stroke="${C.muted}" stroke-width="2.5"/>` + text(446, 189, '색깔', { size: 18 }), 0.3);
    body += at(2, 'rise', tag(290, 234, '같게', OK, { size: 18 }), 0.8) + at(2, 'rise', text(424, 241, '물의 양 · 놓는 곳', { size: 18 }), 1.0);
    // 칸 3: 잴 것과 시간(시계 바늘이 돈다)
    const clock = `<circle cx="262" cy="310" r="22" fill="white" stroke="${C.muted}" stroke-width="3"/><g class="hand"><path d="M262 310 V294" stroke="${C.ink}" stroke-width="3" stroke-linecap="round"/></g><path d="M262 310 H274" stroke="${C.ink}" stroke-width="3" stroke-linecap="round"/>`;
    body += at(3, 'pop', clock, 0.1) + at(3, 'rise', text(370, 317, '1시간마다 온도', { size: 18 }), 0.4) + at(3, 'rise', thermo(486, 288, 330, 'none'), 0.6);
    css += `.sc-${id} .hand { transform-box: view-box; transform-origin: 262px 310px; } .on3 .sc-${id} .hand { animation: ${id}-spin 2.4s linear infinite; } @keyframes ${id}-spin { to { transform: rotate(360deg); } }`;
    body += glowRect(96, 62, 448, 290, 3, C.green, 1.4);
    put('7-1/과학/1/탐구 설계', svg(id, body, css));
  })();

  // ── 변인: 컵 속 물 온도에 영향을 줄 수 있는 조건들이 모였다가, 다르게 할 것 하나와 같게 할 것으로 나뉜다 ──
  (function () {
    const id = 't71-s1-byeonin';
    let css = base(id);
    let body = '';
    body += at(1, 'pop', sunIcon(320, 64, 22));
    body += cup(320, 300, C.ink) + thermo(334, 140, 214, 'none');
    body += text(320, 340, '물의 온도', { size: 18, color: C.muted });
    // 다섯 조건: [이름, 처음 자리, 옮겨 갈 자리]
    const F = [['컵 색깔', 150, 110, 96, 160], ['물의 양', 490, 110, 544, 130], ['처음 온도', 140, 210, 544, 190], ['컵 크기', 500, 210, 544, 250], ['놓는 곳', 168, 300, 544, 310]];
    F.forEach(([t, x, y, tx, ty], k) => {
      const col = k === 0 ? HOT : OK;
      body += atH(1, 2, 'fin', solid(x + (x < 320 ? 50 : -50), y, x < 320 ? 272 : 368, y < 200 ? 220 : y > 260 ? 280 : 250, C.line, 3), f(0.4 + k * 0.15));
      body += at(1, 'pop', `<g class="mv mv2"${st({ '--tx': (tx - x) + 'px', '--ty': (ty - y) + 'px', 'animation-delay': f(0.2 + k * 0.12) + 's' })}>${tag(x, y, t, [col[0], C.muted], { size: 18 })}</g>`, f(0.3 + k * 0.15));
    });
    // 칸 2: 두 무리의 머리말
    body += at(2, 'fin', text(96, 120, '다르게', { size: 18, color: C.orange }), 1.4) + at(2, 'fin', text(544, 92, '같게', { size: 18, color: C.green }), 1.5);
    body += glowRect(32, 136, 128, 48, 2, C.orange, 1.6, 24);
    // 칸 3: 모두 변인
    body += F.map(([, , , tx, ty], k) => ring(tx, ty, 40, 3, k ? C.green : C.orange, k * 0.12)).join('');
    body += at(3, 'pop', tag(96, 240, '모두 변인', [C.mint, C.green], { size: 26 }), 0.9);
    put('7-1/과학/1/변인', svg(id, body, css));
  })();

  // ── 자료 해석: 표의 수 → 그래프의 점·선 → 두 선의 차이(관계) ──
  (function () {
    const id = 't71-s1-haeseok';
    let css = base(id);
    let body = stepStrip(4);
    // 표
    const cx = [64, 150, 236], ry = [104, 150, 196, 242];
    body += `<rect x="24" y="82" width="256" height="184" rx="10" fill="white" stroke="${C.muted}" stroke-width="2.5"/>`
      + `<path d="M24 127 H280 M107 82 V266 M193 82 V266" stroke="${C.line}" stroke-width="2"/>`;
    body += text(cx[0], ry[0] + 7, '시간', { size: 18 }) + text(cx[1], ry[0] + 7, '검은 컵', { size: 18, color: C.orange }) + text(cx[2], ry[0] + 7, '흰 컵', { size: 18, color: C.blue });
    const T = ['처음', '1시간', '2시간'], B = [20, 27, 32], W = [20, 23, 25];
    T.forEach((t, k) => {
      body += at(1, 'fin', text(cx[0], ry[k + 1] + 7, t, { size: 18 }) + text(cx[1], ry[k + 1] + 7, B[k] + ' ℃', { size: 18 }) + text(cx[2], ry[k + 1] + 7, W[k] + ' ℃', { size: 18 }), f(0.2 + k * 0.4));
    });
    // 그래프
    const gx = (k) => 368 + k * 108, gy = (v) => 292 - (v - 18) * 11;
    body += `<path d="M340 ${gy(18) + 10} H612 M340 ${gy(18) + 10} V92" stroke="${C.ink}" stroke-width="3" fill="none"/>`;
    body += text(600, gy(18) + 36, '시간', { size: 18, color: C.muted }) + text(368, 84, '온도', { size: 18, color: C.muted, anchor: 'start' });
    T.forEach((t, k) => { body += `<path d="M${gx(k)} ${gy(18) + 4} V${gy(18) + 16}" stroke="${C.ink}" stroke-width="2"/>`; });
    const pts = (V) => V.map((v, k) => `${gx(k)} ${f(gy(v))}`).join(' L');
    body += drawPath(`M${pts(B)}`, 2, C.orange, 5, 0.7) + drawPath(`M${pts(W)}`, 2, C.blue, 5, 0.8);
    T.forEach((t, k) => {
      [[B, C.orange, 1], [W, C.blue, 2]].forEach(([V, color, c], j) => {
        body += `<g class="b2"><g class="fly fly2"${st({ '--dx': f(cx[c] - gx(k)) + 'px', '--dy': f(ry[k + 1] - gy(V[k])) + 'px', 'animation-delay': f(k * 0.2 + j * 0.1) + 's' })}>${dot(gx(k), gy(V[k]), 7, color, 'white', 2.5)}</g></g>`;
      });
    });
    body += at(2, 'fin', text(432, 176, '검은 컵', { size: 18, color: C.orange }), 1.4) + at(2, 'fin', text(gx(2) - 20, gy(25) + 32, '흰 컵', { size: 18, color: C.blue }), 1.5);
    // 칸 3: 두 선 사이가 벌어진다
    body += drawPath(`M${gx(2) + 24} ${gy(32)} H${gx(2) + 34} V${gy(25)} H${gx(2) + 24}`, 3, C.red, 4, 0.2);
    body += glowRect(gx(2) - 14, gy(32) - 12, 52, gy(25) - gy(32) + 24, 3, C.red, 0.6, 12);
    body += at(3, 'fin', lead(552, 112, gx(2) + 22, gy(32) - 12, C.red), 1.1) + at(3, 'pop', tag(490, 104, '더 많이 오름', RED, { size: 18 }), 1.2);
    put('7-1/과학/1/자료 해석', svg(id, body, css));
  })();

  // ── 결론 도출: 가설(점선) 과 해석한 결과(그래프)를 견주어 맞으면 결론 ──
  (function () {
    const id = 't71-s1-gyeollon';
    let css = base(id);
    let body = stepStrip(5);
    const hyp = cup(92, 268, C.ink, 0.62) + cup(178, 268, 'white', 0.62) + solid(92, 200, 92, 150, C.red, 6) + solid(178, 200, 178, 180, C.red, 6);
    body += `<rect x="42" y="128" width="186" height="162" rx="16" fill="white" stroke="${C.orange}" stroke-width="3" stroke-dasharray="9 7"/>` + hyp;
    body += text(135, 318, '가설', { size: 20, color: C.orange });
    // 결과 그래프
    const gx = (k) => 446 + k * 70, gy = (v) => 262 - (v - 18) * 8;
    body += `<rect x="410" y="128" width="190" height="162" rx="16" fill="white" stroke="${C.muted}" stroke-width="3"/><path d="M430 274 H588 M430 274 V140" stroke="${C.ink}" stroke-width="2.5" fill="none"/>`;
    body += `<path d="M${gx(0)} ${gy(20)} L${gx(1)} ${gy(27)} L${gx(2)} ${gy(32)}" stroke="${C.orange}" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M${gx(0)} ${gy(20)} L${gx(1)} ${gy(23)} L${gx(2)} ${gy(25)}" stroke="${C.blue}" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
    body += text(505, 318, '자료 해석 결과', { size: 20, color: C.muted });
    body += glowRect(36, 122, 198, 174, 1, C.orange, 0.3) + glowRect(404, 122, 202, 174, 1, C.muted, 0.6);
    // 칸 2: 가운데에서 견주어 맞음
    body += drawPath('M234 210 H286', 2, C.muted, 4, 0) + drawPath('M404 210 H352', 2, C.muted, 4, 0);
    body += at(2, 'pop', `<circle cx="320" cy="210" r="34" fill="${C.mint}" stroke="${C.green}" stroke-width="4"/><path d="M304 211 L316 223 L338 198" stroke="${C.green}" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`, 1.0);
    body += at(2, 'fin', text(320, 272, '맞음', { size: 20, color: C.green }), 1.4);
    // 칸 3: 가설 테두리가 굵은 실선으로 바뀌고 '결론'
    body += `<g class="b3"><rect class="cf cf3" style="animation-delay:.3s" x="42" y="128" width="186" height="162" rx="16" fill="none" stroke="${C.green}" stroke-width="5"/></g>`;
    body += glowRect(36, 122, 198, 174, 3, C.green, 0.9) + at(3, 'pop', tag(135, 96, '결론', [C.mint, C.green], { size: 24 }), 0.8);
    put('7-1/과학/1/결론 도출', svg(id, body, css));
  })();

  // ── 증기 기관: 끓는 물의 김이 피스톤을 밀고, 피스톤이 막대로 바퀴를 돌린다 ──
  (function () {
    const id = 't71-s1-jeunggi';
    let css = base(id);
    let body = '';
    // 보일러(물통)와 불
    body += `<rect x="40" y="150" width="150" height="140" rx="22" fill="white" stroke="${C.muted}" stroke-width="4"/>`;
    body += `<rect x="46" y="214" width="138" height="70" rx="16" fill="${C.sky}"/><path d="M46 214 H184" stroke="${C.blue}" stroke-width="2.5" opacity=".7"/>`;
    body += [70, 100, 130, 160].map((x, k) => `<g class="b1">${flame(x, 340, 0.8)}</g>`).join('');
    body += `<path d="M30 342 H200" stroke="${C.muted}" stroke-width="5" stroke-linecap="round"/>`;
    // 끓는 물속 기포와 물 위 김
    const r = seeded(11);
    let bub = '';
    for (let k = 0; k < 7; k++) bub += `<circle class="up" style="--up:-44px;animation-delay:${f(-r() * 2.4)}s" cx="${f(60 + r() * 110)}" cy="${f(276 - r() * 10)}" r="${f(3 + r() * 3)}" fill="white" stroke="${C.blue}" stroke-width="1.8"/>`;
    body += shown(1, bub);
    const puff = (x, y, rr = 9) => `<circle cx="${x}" cy="${y}" r="${rr}" fill="white" stroke="${C.muted}" stroke-width="2"/>`;
    body += shown(1, [80, 115, 150].map((x, k) => `<g class="up"${st({ '--up': '-36px', 'animation-delay': f(-k * 0.8) + 's' })}>${puff(x, 200)}</g>`).join(''));
    // 관과 실린더
    body += `<path d="M150 150 V110 H250 V150" stroke="${C.muted}" stroke-width="16" fill="none" stroke-linejoin="round"/><path d="M150 150 V110 H250 V150" stroke="white" stroke-width="9" fill="none" stroke-linejoin="round"/>`;
    body += `<rect x="226" y="150" width="140" height="64" rx="8" fill="white" stroke="${C.muted}" stroke-width="4"/>`;
    // 실린더 속으로 흘러드는 김(칸 2부터)
    body += shown(2, `<path class="dots" d="M150 196 V110 H250 V162" stroke="${C.muted}" stroke-width="7" stroke-dasharray="0 18" stroke-linecap="round" fill="none"/>`);
    css += `.sc-${id} .dots { animation: ${id}-m18 .8s linear infinite; } @keyframes ${id}-m18 { from { stroke-dashoffset: 18; } to { stroke-dashoffset: 0; } }`;
    // 피스톤·바퀴·연결 막대(크랭크): 바퀴 중심 W, 크랭크 반지름 R, 연결 막대 길이 L
    const Wx = 520, Wy = 182, R = 40, L = 112, PR = 112;
    const N = 24, keysP = [], keysR = [];
    for (let i = 0; i <= N; i++) {
      const th = (i / N) * Math.PI * 2, px = Wx + R * Math.cos(th), py = Wy + R * Math.sin(th);
      const phi = Math.asin((R * Math.sin(th)) / L), hx = px - L * Math.cos(phi);
      keysP.push(`${f((i / N) * 100)}% { transform: translateX(${f(hx - (Wx + R - L))}px); }`);
      keysR.push(`${f((i / N) * 100)}% { transform: translate(${f(px)}px, ${f(py)}px) rotate(${f((phi * 180) / Math.PI)}deg); }`);
    }
    const H0 = Wx + R - L; // 크랭크가 오른쪽(0도)일 때 막대 머리 자리
    const piston = `<rect x="${H0 - PR - 8}" y="156" width="16" height="52" rx="3" fill="${C.line}" stroke="${C.ink}" stroke-width="3"/>`
      + `<path d="M${H0 - PR + 8} 182 H${H0}" stroke="${C.ink}" stroke-width="7" stroke-linecap="round"/><circle cx="${H0}" cy="182" r="7" fill="white" stroke="${C.ink}" stroke-width="3"/>`;
    body += `<g class="pis">${piston}</g>`;
    // 바퀴(살 넷)와 크랭크 핀
    let spokes = '';
    for (let k = 0; k < 4; k++) { const a = (k * Math.PI) / 4; spokes += `<path d="M${f(Wx - 66 * Math.cos(a))} ${f(Wy - 66 * Math.sin(a))} L${f(Wx + 66 * Math.cos(a))} ${f(Wy + 66 * Math.sin(a))}" stroke="${C.muted}" stroke-width="5"/>`; }
    body += `<g class="whl"><circle cx="${Wx}" cy="${Wy}" r="72" fill="none" stroke="${C.ink}" stroke-width="9"/>${spokes}<circle cx="${Wx + R}" cy="${Wy}" r="9" fill="${C.orange}" stroke="${C.ink}" stroke-width="2.5"/></g>`;
    body += `<circle cx="${Wx}" cy="${Wy}" r="12" fill="${C.line}" stroke="${C.ink}" stroke-width="3"/>`;
    body += `<g class="rod"><path d="M0 0 H${-L}" stroke="${C.orange}" stroke-width="8" stroke-linecap="round"/></g>`;
    css += `.sc-${id} .whl { transform-box: view-box; transform-origin: ${Wx}px ${Wy}px; }
      .sc-${id} .rod { transform-box: view-box; transform-origin: 0 0; transform: translate(${Wx + R}px, ${Wy}px); }
      .sc-${id} .whl, .sc-${id} .rod, .sc-${id} .pis { animation-duration: 1.6s; animation-timing-function: linear; animation-iteration-count: infinite; animation-play-state: paused; }
      .sc-${id} .whl { animation-name: ${id}-whl; } .sc-${id} .rod { animation-name: ${id}-rod; } .sc-${id} .pis { animation-name: ${id}-pis; }
      .on2 .sc-${id} .whl, .on2 .sc-${id} .rod, .on2 .sc-${id} .pis { animation-play-state: running; }
      @keyframes ${id}-whl { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      @keyframes ${id}-pis { ${keysP.join(' ')} }
      @keyframes ${id}-rod { ${keysR.join(' ')} }`;
    body += `<path d="M430 270 H610" stroke="${C.muted}" stroke-width="5" stroke-linecap="round"/><path d="M${Wx} ${Wy + 12} V270" stroke="${C.muted}" stroke-width="6"/>`;
    // 이름표
    body += at(1, 'pop', tag(115, 254, '물', COLD, { size: 18 }), 0.3) + at(1, 'pop', tag(96, 128, '김', GRAY, { size: 18 }), 0.6);
    body += at(2, 'pop', lead(296, 236, 296, 214) + tag(296, 252, '피스톤', GRAY, { size: 18 }), 0.6);
    body += at(3, 'pop', lead(586, 112, 566, 130) + tag(588, 96, '바퀴', GRAY, { size: 18 }), 0.2);
    body += ring(Wx, Wy, 76, 3, C.orange, 0.4) + at(3, 'pop', tag(420, 320, '증기 기관', HOT, { size: 24 }), 1.0);
    put('7-1/과학/1/증기 기관', svg(id, body, css));
  })();

  // ── 자원 고갈: 땅속에 묻힌 양이 정해진 자원을 해마다 꺼내 써서 남은 양이 바닥나 간다 ──
  (function () {
    const id = 't71-s1-gogal';
    let css = base(id);
    let body = `<path d="M20 120 H620" stroke="${C.green}" stroke-width="4"/><rect x="20" y="122" width="600" height="230" fill="${C.peach}" fill-opacity=".35"/>`;
    body += text(600, 108, '땅', { size: 18, color: C.muted, anchor: 'end' });
    const R = [[140, '석유', C.ink, 0.72], [320, '석탄', C.muted, 0.85], [500, '광물', C.orange, 0.55]];
    R.forEach(([x, name, color, op], k) => {
      body += `<rect x="${x - 60}" y="150" width="120" height="160" rx="12" fill="white" stroke="${C.muted}" stroke-width="3"/>`;
      body += `<rect class="lv q" x="${x - 54}" y="156" width="108" height="148" rx="8" fill="${color}" fill-opacity="${op}"/>`;
      body += text(x, 338, name, { size: 20 });
      // 칸 2: 위로 꺼내 쓴다
      body += shown(2, `<g class="go"${st({ '--dx': '0px', '--dy': '-110px', '--d': '1.6s', 'animation-delay': f(-k * 0.5) + 's' })}>${`<rect x="${x - 10}" y="150" width="20" height="16" rx="4" fill="${color}" fill-opacity="${op}" stroke="${C.muted}" stroke-width="1.5"/>`}</g><g class="go"${st({ '--dx': '0px', '--dy': '-110px', '--d': '1.6s', 'animation-delay': f(-k * 0.5 - 0.8) + 's' })}>${`<rect x="${x - 10}" y="150" width="20" height="16" rx="4" fill="${color}" fill-opacity="${op}" stroke="${C.muted}" stroke-width="1.5"/>`}</g>`, 3);
    });
    css += states(id, 'q', 'transform', ['scaleY(.95)', 'scaleY(.95)', 'scaleY(.45)', 'scaleY(.1)'], 2, 0.3);
    body += atH(1, 3, 'pop', tag(320, 64, '묻힌 양이 정해져 있음', GRAY, { size: 18 }), 0.4);
    body += at(2, 'pop', solid(560, 90, 560, 40, C.red, 4) + tag(500, 30, '많이 씀', RED, { size: 18 }), 0.3);
    body += [140, 320, 500].map((x, k) => glowRect(x - 60, 270, 120, 40, 3, C.red, 1.2 + k * 0.15, 10)).join('');
    body += at(3, 'pop', tag(320, 64, '자원 고갈', RED, { size: 26 }), 1.6);
    put('7-1/과학/1/자원 고갈', svg(id, body, css));
  })();


  // ════ Ⅲ단원 열 ════
  // 유리 그릇 테두리: 밑 가운데 (cx, by), 폭 w, 높이 h
  const beaker = (cx, by, w, h) => {
    const l = cx - w / 2, r = cx + w / 2, t = by - h;
    return `<path d="M${f(l - 5)} ${f(t)} H${f(l)} V${f(by - 9)} Q${f(l)} ${f(by)} ${f(l + 9)} ${f(by)} H${f(r - 9)} Q${f(r)} ${f(by)} ${f(r)} ${f(by - 9)} V${f(t)} H${f(r + 5)}" fill="none" stroke="${C.muted}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/>`;
  };
  const liq = (cx, by, w, lh, color, op = 1, cls = '', s = 0) => `<rect class="${cls}"${dl(s)} x="${f(cx - w / 2 + 2)}" y="${f(by - lh)}" width="${f(w - 4)}" height="${f(lh - 2)}" rx="8" fill="${color}" fill-opacity="${op}"/>`;
  // 크게 보기 원과 두 줄(작은 원 c1 → 큰 원 c2)
  const zoomLines = ([x1, y1], r1, [x2, y2], r2) => {
    const d = Math.hypot(x2 - x1, y2 - y1), nx = -(y2 - y1) / d, ny = (x2 - x1) / d;
    return [1, -1].map((k) => `<path d="M${f(x1 + k * r1 * nx)} ${f(y1 + k * r1 * ny)} L${f(x2 + k * r2 * nx)} ${f(y2 + k * r2 * ny)}" stroke="${C.muted}" stroke-width="2.5" stroke-dasharray="7 5"/>`).join('');
  };
  const lens = (cx, cy, r, fill = 'white') => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" stroke="${C.muted}" stroke-width="3.5"/>`;
  const clip = (id, cx, cy, r) => `<clipPath id="${id}"><circle cx="${cx}" cy="${cy}" r="${r - 2}"/></clipPath>`;
  // 줄 맞춘 입자(고체), 흐트러진 입자(액체) 자리
  const lattice = (cx, cy, cols, rows, gap) => {
    const out = [];
    for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) out.push([cx + (i - (cols - 1) / 2) * gap, cy + (j - (rows - 1) / 2) * gap]);
    return out;
  };
  const loose = (cx, cy, cols, rows, gap, seed) => {
    const r = seeded(seed);
    return lattice(cx, cy, cols, rows, gap).map(([x, y], k) => [x + (r() - 0.5) * gap * 0.55 + ((Math.floor(k / cols) % 2) * gap) / 2, y + (r() - 0.5) * gap * 0.4]);
  };
  const parts = (pts, rr, fill, stroke, a, d, seed) => {
    const r = seeded(seed);
    return pts.map(([x, y]) => jig(dot(x, y, rr, fill, stroke, 2.2), a, d, -r() * d)).join('');
  };

  // ── 입자: 쇠 덩어리와 물을 크게 확대하면 작은 알갱이 ──
  (function () {
    const id = 't71-s3-ipja';
    let css = base(id);
    let body = clip(`${id}-a`, 450, 100, 78) + clip(`${id}-b`, 450, 268, 78);
    // 쇠 덩어리
    body += `<path d="M60 92 L150 92 L176 74 L86 74 Z" fill="white" stroke="${C.muted}" stroke-width="3" stroke-linejoin="round"/><path d="M150 92 L176 74 V134 L150 152 Z" fill="${C.line}" stroke="${C.muted}" stroke-width="3" stroke-linejoin="round"/><rect x="60" y="92" width="90" height="60" fill="${C.line}" fill-opacity=".6" stroke="${C.muted}" stroke-width="3"/>`;
    body += text(118, 184, '쇠', { size: 20 });
    // 물 한 컵
    body += liq(118, 320, 96, 70, C.sky) + beaker(118, 320, 96, 100) + text(118, 350, '물', { size: 20 });
    // 칸 2: 크게 보기
    body += at(2, 'fin', zoomLines([150, 112], 20, [450, 100], 78) + zoomLines([140, 280], 20, [450, 268], 78), 0);
    body += at(2, 'pop', lens(450, 100, 78) + `<g clip-path="url(#${id}-a)">${parts(lattice(450, 100, 6, 6, 28), 10, C.line, C.muted, 1.4, 0.8, 3)}</g>`, 0.3);
    body += at(2, 'pop', lens(450, 268, 78) + `<g clip-path="url(#${id}-b)">${parts(loose(450, 268, 5, 5, 32, 9), 10, C.sky, C.blue, 2.6, 0.8, 5)}</g>`, 0.6);
    body += shown(2, `<circle cx="150" cy="112" r="20" fill="none" stroke="${C.muted}" stroke-width="2.5"/><circle cx="140" cy="280" r="20" fill="none" stroke="${C.muted}" stroke-width="2.5"/>`);
    // 칸 3: 알갱이 하나에 고리
    body += ring(450, 100, 16, 3, C.orange) + ring(450, 268, 16, 3, C.orange, 0.3);
    body += at(3, 'pop', tag(580, 184, '입자', HOT, { size: 24 }), 0.8);
    body += at(3, 'fin', lead(580, 164, 466, 108, C.orange) + lead(580, 204, 466, 262, C.orange), 0.9);
    put('7-1/과학/3/입자', svg(id, body, css));
  })();

  // ── 온도: 찬물 입자는 느리게, 뜨거운 물 입자는 활발하게 ──
  (function () {
    const id = 't71-s3-ondo';
    let css = base(id);
    let body = clip(`${id}-a`, 160, 112, 72) + clip(`${id}-b`, 460, 112, 72);
    const cups = [[160, C.sky, C.blue, '10 ℃', 0.22], [460, C.peach, C.orange, '60 ℃', 0.72]];
    cups.forEach(([x, fill, stroke, t, lv], k) => {
      body += liq(x, 330, 130, 76, fill) + beaker(x, 330, 130, 104);
      body += `<rect x="${x + 82}" y="200" width="14" height="126" rx="7" fill="white" stroke="${C.muted}" stroke-width="2.5"/><circle cx="${x + 89}" cy="326" r="11" fill="${C.red}" stroke="${C.muted}" stroke-width="2.5"/>`;
      body += `<rect class="lv t${k}" x="${x + 86}" y="206" width="6" height="116" rx="3" fill="${C.red}"/>`;
      body += at(1, 'fin', text(x + 89, 190, t, { size: 20 }), 1.0);
    });
    css += states(id, 't0', 'transform', ['scaleY(0)', 'scaleY(.22)'], 1.2, 0.2) + states(id, 't1', 'transform', ['scaleY(0)', 'scaleY(.72)'], 1.2, 0.2);
    // 칸 2: 크게 보기(찬물은 느리고 작게, 뜨거운 물은 빠르고 크게 떤다)
    body += at(2, 'fin', zoomLines([160, 270], 14, [160, 112], 72) + zoomLines([460, 270], 14, [460, 112], 72), 0);
    body += at(2, 'pop', lens(160, 112, 72) + `<g clip-path="url(#${id}-a)">${parts(loose(160, 112, 5, 5, 30, 4), 10, C.sky, C.blue, 1.2, 1.6, 2)}</g>`, 0.2);
    body += at(2, 'pop', lens(460, 112, 72) + `<g clip-path="url(#${id}-b)">${parts(loose(460, 112, 5, 5, 30, 8), 10, C.peach, C.orange, 5.5, 0.3, 6)}</g>`, 0.4);
    body += shown(2, `<circle cx="160" cy="270" r="14" fill="none" stroke="${C.muted}" stroke-width="2.5"/><circle cx="460" cy="270" r="14" fill="none" stroke="${C.muted}" stroke-width="2.5"/>`);
    body += at(2, 'fin', text(52, 118, '느림', { size: 20, color: C.blue }), 0.8) + at(2, 'fin', text(580, 118, '활발', { size: 20, color: C.orange }), 0.9);
    // 칸 3: 느림 → 활발 화살표와 '온도'
    body += drawPath('M250 112 H372', 3, C.orange, 5, 0.1) + at(3, 'fin', head(374, 112, 0, C.orange, 5), 1.2);
    body += at(3, 'pop', tag(311, 74, '온도', RED, { size: 24 }), 0.6) + at(3, 'fin', text(311, 150, '높을수록', { size: 18, color: C.muted }), 0.9);
    body += ring(549, 290, 30, 3, C.red, 1.0) + ring(249, 316, 26, 3, C.red, 1.2);
    put('7-1/과학/3/온도', svg(id, body, css));
  })();

  // ── 열평형: 맞닿은 두 물체, 뜨거운 쪽에서 찬 쪽으로 열이 옮겨 가 온도가 같아진다 ──
  (function () {
    const id = 't71-s3-pyeonghyeong';
    let css = base(id);
    let body = '';
    body += `<rect x="40" y="130" width="130" height="140" rx="8" fill="${C.orange}" fill-opacity=".45"/><rect x="170" y="130" width="130" height="140" rx="8" fill="${C.sky}"/>`;
    body += `<g class="b3"><rect class="cf cf3" style="animation-delay:.2s" x="40" y="130" width="260" height="140" rx="8" fill="${C.peach}"/></g>`;
    body += `<rect x="40" y="130" width="130" height="140" rx="8" fill="none" stroke="${C.orange}" stroke-width="3"/><rect x="170" y="130" width="130" height="140" rx="8" fill="none" stroke="${C.blue}" stroke-width="3"/>`;
    body += `<g class="ph">${parts(lattice(105, 200, 3, 4, 32), 10, 'white', C.orange, 4.5, 0.32, 3)}</g><g class="pc">${parts(lattice(235, 200, 3, 4, 32), 10, 'white', C.blue, 1.2, 1.5, 4)}</g>`;
    css += `.on3 .sc-${id} .ph .jg, .on3 .sc-${id} .pc .jg { --a: 2.6px !important; --d: .6s !important; }`;
    body += atH(1, 3, 'fin', text(105, 114, '80 ℃', { size: 20, color: C.orange }) + text(235, 114, '20 ℃', { size: 20, color: C.blue }), 0.2);
    body += at(3, 'fin', text(105, 114, '50 ℃', { size: 20 }) + text(235, 114, '50 ℃', { size: 20 }), 0.6);
    // 칸 2: 열이 옮겨 간다
    body += shown(2, march('M100 300 Q170 340 240 300', C.orange, 5) + head(242, 299, rad(-30), C.orange, 5), 3) + atH(2, 3, 'pop', tag(170, 346, '열', HOT, { size: 18 }), 0.3);
    // 그래프
    const gy = (t) => 300 - t * 2.4;
    body += `<path d="M360 300 H612 M360 300 V84" stroke="${C.ink}" stroke-width="3" fill="none"/>` + text(600, 328, '시간', { size: 18, color: C.muted }) + text(372, 78, '온도', { size: 18, color: C.muted, anchor: 'start' });
    body += at(1, 'pop', dot(372, gy(80), 7, C.orange, 'white', 2.5) + dot(372, gy(20), 7, C.blue, 'white', 2.5), 0.4);
    body += drawPath(`M372 ${gy(80)} C420 ${gy(60)} 460 ${gy(51)} 510 ${gy(50)}`, 2, C.orange, 5, 0.3) + drawPath(`M372 ${gy(20)} C420 ${gy(40)} 460 ${gy(49)} 510 ${gy(50)}`, 2, C.blue, 5, 0.3);
    body += drawPath(`M510 ${gy(50)} H600`, 3, C.green, 6, 0.2);
    body += glowRect(500, gy(50) - 18, 110, 36, 3, C.green, 1.0, 18) + at(3, 'pop', tag(556, gy(50) - 46, '열평형', OK, { size: 22 }), 1.2);
    put('7-1/과학/3/열평형', svg(id, body, css));
  })();

  // ── 열량: 뜨거운 쇠구슬에서 찬물로 옮겨 간 열을 모은 양 ──
  (function () {
    const id = 't71-s3-yeollyang';
    let css = base(id);
    let body = '';
    const bx = 220, by = 320, bw = 230, lh = 130;
    body += liq(bx, by, bw, lh, C.sky) + `<g class="b2"><rect class="cf cf2" style="animation-delay:1.5s" x="${bx - bw / 2 + 2}" y="${by - lh}" width="${bw - 4}" height="${lh - 2}" rx="8" fill="${C.peach}" fill-opacity=".75"/></g>`;
    // 쇠구슬(칸 1에 떨어진다): 빨강 → 칸 2에 식어 옅어진다
    const ball = `<circle cx="${bx}" cy="${by - 62}" r="32" fill="${C.red}" stroke="${C.ink}" stroke-width="3"/><g class="b2"><circle class="cf cf2" style="animation-delay:1.5s" cx="${bx}" cy="${by - 62}" r="32" fill="${C.peach}" stroke="${C.ink}" stroke-width="3"/></g>`;
    body += `<g class="b1"><g class="drop drop1" style="animation-duration:.9s">${ball}</g></g>`;
    body += beaker(bx, by, bw, 170) + text(bx, 350, '찬물', { size: 18, color: C.blue });
    body += at(1, 'pop', lead(bx + 40, by - 104, bx + 22, by - 86) + tag(bx + 62, by - 122, '뜨거운 쇠구슬', RED, { size: 18 }), 0.8);
    // 칸 2: 열 알갱이가 구슬에서 물로 퍼져 나간다
    let pk = '';
    for (let k = 0; k < 8; k++) { const a = (k * Math.PI) / 4 + 0.3; pk += `<g class="go"${st({ '--dx': f(80 * Math.cos(a)) + 'px', '--dy': f(48 * Math.sin(a)) + 'px', '--d': '2s', 'animation-delay': f(-k * 0.25) + 's' })}>${dot(bx, by - 62, 7, C.orange, 'white', 2)}</g>`; }
    body += shown(2, pk, 3);
    // 칸 3: 옮겨 간 열을 오른쪽 기둥에 쌓는다
    const cx = 500, base0 = 320, hh = 34;
    body += at(3, 'fin', `<rect x="${cx - 40}" y="${base0 - 6 * hh - 10}" width="80" height="${6 * hh + 10}" rx="10" fill="white" stroke="${C.muted}" stroke-width="3" stroke-dasharray="7 5"/>`, 0);
    for (let k = 0; k < 6; k++) {
      const y = base0 - (k + 0.5) * hh - 4;
      body += `<g class="b3"><g class="fly fly3"${st({ '--dx': f(bx - cx) + 'px', '--dy': f(by - 62 - y) + 'px', 'animation-delay': f(0.2 + k * 0.18) + 's' })}><rect x="${cx - 32}" y="${f(y - hh / 2 + 3)}" width="64" height="${hh - 6}" rx="8" fill="${C.peach}" stroke="${C.orange}" stroke-width="2.5"/>${text(cx, f(y + 6), '열', { size: 18, color: C.orange })}</g></g>`;
    }
    body += drawPath(`M${cx + 54} ${base0 - 6 * hh - 6} H${cx + 64} V${base0} H${cx + 54}`, 3, C.orange, 4, 1.2);
    body += at(3, 'pop', tag(cx + 30, 66, '열량', HOT, { size: 24 }), 1.5);
    put('7-1/과학/3/열량', svg(id, body, css));
  })();

  // ── 전도: 데운 쪽 입자의 떨림이 이웃 입자로 차례차례 ──
  (function () {
    const id = 't71-s3-jeondo';
    let css = base(id);
    const x0 = 60, cw = 54, n = 10, top = 150, h = 80;
    let body = `<rect x="${x0}" y="${top}" width="${cw * n}" height="${h}" rx="10" fill="${C.line}" fill-opacity=".55"/>`;
    // 칸마다 데워지는 색(왼쪽이 가장 진하다)
    for (let k = 0; k < n; k++) {
      const beat = k < 2 ? 1 : 2, s = k < 2 ? 0.3 + k * 0.3 : 0.2 + (k - 1) * 0.35;
      body += `<g class="b${beat}"><rect class="cf cf${beat}" style="animation-delay:${f(s)}s" x="${x0 + k * cw}" y="${top}" width="${cw}" height="${h}" fill="${C.orange}" fill-opacity="${f(0.62 - k * 0.045)}"/></g>`;
    }
    body += `<rect x="${x0}" y="${top}" width="${cw * n}" height="${h}" rx="10" fill="none" stroke="${C.muted}" stroke-width="3"/>`;
    // 입자: 바깥은 늘 조금 떨고, 안쪽(hj)은 데워지면 세게 떤다
    const r = seeded(7);
    for (let k = 0; k < n; k++) {
      const beat = k < 2 ? 1 : 2, s = k < 2 ? 0.2 + k * 0.3 : 0.2 + (k - 1) * 0.35;
      [172, 208].forEach((y) => {
        const p = dot(x0 + cw / 2 + k * cw, y, 12, 'white', C.ink, 2.2);
        body += jig(`<g class="hj hj${beat}"${st({ '--a': f(4.5 - k * 0.25) + 'px', 'animation-delay': f(s) + 's' })}>${p}</g>`, 1, 1.4, -r() * 1.4);
      });
    }
    for (let n2 = 1; n2 <= 2; n2++) css += `.on${n2} .sc-${id} .hj${n2} { animation: ${id}-jg .22s linear infinite; }`;
    body += `<path d="M40 284 H160" stroke="${C.muted}" stroke-width="5" stroke-linecap="round"/>` + `<g class="b1">${flame(87, 280, 1.1)}</g>`;
    body += at(1, 'pop', tag(210, 270, '가열', HOT, { size: 18 }), 0.4);
    // 칸 3: 열 화살표와 제자리 표시
    body += shown(3, march(`M90 120 H560`, C.orange, 5) + head(572, 120, 0, C.orange, 5));
    body += at(3, 'pop', tag(330, 88, '열', HOT, { size: 18 }), 0.4);
    body += at(3, 'fin', `<circle cx="${x0 + cw / 2 + 5 * cw}" cy="208" r="22" fill="none" stroke="${C.green}" stroke-width="3" stroke-dasharray="6 4"/>` + lead(x0 + cw / 2 + 5 * cw, 230, x0 + cw / 2 + 5 * cw, 266, C.green) + tag(x0 + cw / 2 + 5 * cw, 284, '제자리', OK, { size: 18 }), 0.8);
    body += at(3, 'pop', tag(520, 300, '전도', HOT, { size: 24 }), 1.4);
    put('7-1/과학/3/전도', svg(id, body, css));
  })();

  // ── 대류: 바닥 한쪽을 데우면 물 입자가 직접 돌며 열을 옮긴다 ──
  (function () {
    const id = 't71-s3-daeryu';
    let css = base(id);
    const L = 150, R = 490, T = 70, B = 300;
    let body = `<rect x="${L}" y="${T}" width="${R - L}" height="${B - T}" rx="10" fill="${C.sky}"/>`;
    body += `<g class="b3"><rect class="cf cf3" style="animation-delay:1.2s" x="${L}" y="${T}" width="${R - L}" height="${B - T}" rx="10" fill="${C.peach}" fill-opacity=".7"/></g>`;
    body += `<path d="M${L} ${T - 10} V${B - 10} Q${L} ${B} ${L + 10} ${B} H${R - 10} Q${R} ${B} ${R} ${B - 10} V${T - 10}" fill="none" stroke="${C.muted}" stroke-width="4" stroke-linejoin="round"/>`;
    body += `<path d="M150 344 H490" stroke="${C.muted}" stroke-width="5" stroke-linecap="round"/>` + `<g class="b1">${flame(214, 340, 0.9)}${flame(254, 340, 0.9)}</g>`;
    // 도는 길(시계 방향, 둥근 네모): 왼쪽 아래에서 올라가기 시작
    const lx = 214, rx = 426, ty = 124, byy = 256, cr = 48;
    const pts = [];
    const seg = (n, fn) => { for (let i = 0; i < n; i++) pts.push(fn(i / n)); };
    const arc = (cx, cy, a0, a1) => (t) => [cx + cr * Math.cos(a0 + (a1 - a0) * t), cy + cr * Math.sin(a0 + (a1 - a0) * t)];
    seg(4, (t) => [lx, byy - cr - t * (byy - ty - 2 * cr)]);
    seg(3, arc(lx + cr, ty + cr, Math.PI, 1.5 * Math.PI));
    seg(5, (t) => [lx + cr + t * (rx - lx - 2 * cr), ty]);
    seg(3, arc(rx - cr, ty + cr, 1.5 * Math.PI, 2 * Math.PI));
    seg(4, (t) => [rx, ty + cr + t * (byy - ty - 2 * cr)]);
    seg(3, arc(rx - cr, byy - cr, 0, 0.5 * Math.PI));
    seg(5, (t) => [rx - cr - t * (rx - lx - 2 * cr), byy]);
    seg(3, arc(lx + cr, byy - cr, 0.5 * Math.PI, Math.PI));
    const N = pts.length, [sx, sy] = pts[0];
    const keys = pts.concat([pts[0]]).map(([x, y], i) => `${f((i / N) * 100)}% { transform: translate(${f(x - sx)}px, ${f(y - sy)}px); }`).join(' ');
    // 데워진 정도(주황 겉옷): 올라갈 때 진하고 오른쪽으로 가며 식는다
    const warm = pts.concat([pts[0]]).map((p, i) => { const u = i / N; const o = u < 0.12 ? 1 : u < 0.55 ? 1 - (u - 0.12) / 0.43 : u < 0.86 ? 0 : (u - 0.86) / 0.14; return `${f(u * 100)}% { opacity: ${f(o)}; }`; }).join(' ');
    const DUR = 7, M = 14;
    let ps = '';
    for (let k = 0; k < M; k++) {
      const s = f(-(k / M) * DUR);
      ps += `<g class="lp" style="animation-delay:${s}s"><circle cx="${f(sx)}" cy="${f(sy)}" r="11" fill="white" stroke="${C.blue}" stroke-width="2.2"/><circle class="wm" style="animation-delay:${s}s" cx="${f(sx)}" cy="${f(sy)}" r="11" fill="${C.peach}" stroke="${C.orange}" stroke-width="2.2"/></g>`;
    }
    body += ps;
    css += `.sc-${id} .lp { animation: ${id}-lp ${DUR}s linear infinite; animation-play-state: paused; }
      .sc-${id} .wm { animation: ${id}-wm ${DUR}s linear infinite; animation-play-state: paused; }
      .on2 .sc-${id} .lp, .on2 .sc-${id} .wm { animation-play-state: running; }
      @keyframes ${id}-lp { ${keys} } @keyframes ${id}-wm { ${warm} }`;
    // 칸 2: 올라가는 쪽과 내려오는 쪽
    body += at(2, 'pop', solid(110, 230, 110, 150, C.orange, 5) + tag(86, 266, '데워진 물', HOT, { size: 18 }), 0.4);
    body += at(2, 'pop', solid(540, 150, 540, 230, C.blue, 5) + tag(560, 116, '찬물', COLD, { size: 18 }), 0.8);
    // 칸 3: 도는 길
    const loopD = `M${lx} ${byy - cr} V${ty + cr} A${cr} ${cr} 0 0 1 ${lx + cr} ${ty} H${rx - cr} A${cr} ${cr} 0 0 1 ${rx} ${ty + cr} V${byy - cr} A${cr} ${cr} 0 0 1 ${rx - cr} ${byy} H${lx + cr} A${cr} ${cr} 0 0 1 ${lx} ${byy - cr}`;
    body += shown(3, march(loopD, C.orange, 4, ' opacity=".8"'));
    body += at(3, 'pop', tag(320, 190, '대류', HOT, { size: 26 }), 0.6);
    put('7-1/과학/3/대류', svg(id, body, css));
  })();

  // ── 복사: 물질이 거의 없는 우주를 지나 해의 열이 곧바로 지구에 ──
  (function () {
    const id = 't71-s3-boksa';
    let css = base(id);
    let body = '';
    body += sunIcon(92, 180, 52);
    body += `<circle cx="548" cy="180" r="62" fill="${C.sky}" stroke="${C.blue}" stroke-width="3"/>`;
    body += `<g class="b2"><path class="cf cf2" style="animation-delay:1.4s" d="M548 118 A62 62 0 0 0 548 242 Z" fill="${C.orange}" fill-opacity=".5"/></g>`;
    body += text(92, 290, '해', { size: 20 }) + text(548, 290, '지구', { size: 20 });
    // 가운데: 물질이 거의 없는 곳
    body += at(1, 'fin', `<rect x="186" y="96" width="268" height="168" rx="18" fill="none" stroke="${C.muted}" stroke-width="2.5" stroke-dasharray="8 7"/>`, 0.2) + at(1, 'pop', tag(320, 300, '우주', GRAY, { size: 18 }), 0.5);
    // 칸 2: 물결 줄기 셋이 곧바로 건너간다
    const wv = (y) => { let d = `M168 ${y}`; for (let x = 168; x < 470; x += 30) d += ` q7.5 -12 15 0 q7.5 12 15 0`; return d; };
    body += shown(2, [130, 180, 230].map((y) => `<path class="mar2" d="${wv(y)}" stroke="${C.orange}" stroke-width="4" stroke-dasharray="26 16" fill="none" stroke-linecap="round"/>` + head(482, y, 0, C.orange, 4)).join(''));
    css += `.sc-${id} .mar2 { animation: ${id}-m42 .9s linear infinite; } @keyframes ${id}-m42 { from { stroke-dashoffset: 42; } to { stroke-dashoffset: 0; } }`;
    body += ring(548, 180, 64, 2, C.orange, 1.6);
    // 칸 3
    body += at(3, 'pop', tag(320, 58, '복사', HOT, { size: 26 }), 0.4);
    body += glowRect(186, 96, 268, 168, 3, C.orange, 0.8, 18);
    put('7-1/과학/3/복사', svg(id, body, css));
  })();

  // ── 비열: 같은 열을 받아도 식용유가 물보다 온도가 많이 오른다 ──
  (function () {
    const id = 't71-s3-biyeol';
    let css = base(id);
    let body = '';
    const B = [[110, C.sky, 1, '물', 'tw', ['scaleY(.15)', 'scaleY(.15)', 'scaleY(.32)']], [290, C.yellow, 0.55, '식용유', 'to', ['scaleY(.15)', 'scaleY(.15)', 'scaleY(.8)']]];
    B.forEach(([x, color, op, name, cls, v]) => {
      body += liq(x, 250, 120, 84, color, op) + beaker(x, 250, 120, 130);
      body += thermo(x + 30, 92, 242, `lv ${cls}`);
      body += `<rect x="${x - 64}" y="256" width="128" height="18" rx="6" fill="${C.line}" stroke="${C.muted}" stroke-width="2.5"/>`;
      body += `<g class="b1"><rect class="cf cf1" style="animation-delay:.2s" x="${x - 58}" y="260" width="116" height="10" rx="4" fill="${C.orange}"/></g>`;
      body += `<g class="b1"><g class="pulse heat">${solid(x - 40, 244, x - 40, 220, C.orange, 3)}${solid(x - 14, 244, x - 14, 220, C.orange, 3)}${solid(x + 12, 244, x + 12, 220, C.orange, 3)}</g></g>`;
      body += text(x, 318, name, { size: 20 });
      css += states(id, cls, 'transform', v, 1.8, 0.4);
    });
    body += at(1, 'pop', tag(200, 46, '질량 같음', GRAY, { size: 18 }), 0.5);
    css += `.on1 .sc-${id} .heat { animation: ${id}-pulse 1s ease-in-out infinite; }`;
    // 그래프
    body += `<path d="M410 300 H620 M410 300 V84" stroke="${C.ink}" stroke-width="3" fill="none"/>` + text(606, 328, '시간', { size: 18, color: C.muted }) + text(422, 78, '온도', { size: 18, color: C.muted, anchor: 'start' });
    body += drawPath('M420 276 L600 236', 2, C.blue, 5, 0.4) + drawPath('M420 276 L600 116', 2, C.orange, 5, 0.4);
    body += at(2, 'fin', text(560, 102, '식용유', { size: 18, color: C.orange }), 1.4) + at(2, 'fin', text(590, 266, '물', { size: 18, color: C.blue }), 1.5);
    // 칸 3
    body += at(3, 'pop', tag(110, 342, '비열 큼', COLD, { size: 18 }), 0.3) + at(3, 'pop', tag(290, 342, '비열 작음', HOT, { size: 18 }), 0.6);
    body += ring(110, 208, 60, 3, C.blue, 0.9);
    put('7-1/과학/3/비열', svg(id, body, css));
  })();

  // ── 열팽창: 가열하면 입자 사이가 멀어지고 막대가 늘어난다 ──
  (function () {
    const id = 't71-s3-paengchang';
    let css = base(id);
    const ZX = 250, ZY = 136, ZR = 100;
    let body = '';
    body += lens(ZX, ZY, ZR) + zoomLines([250, 276], 16, [ZX, ZY], ZR) + `<circle cx="250" cy="276" r="16" fill="none" stroke="${C.muted}" stroke-width="2.5"/>`;
    const r = seeded(13);
    lattice(ZX, ZY, 5, 4, 28).forEach(([x, y]) => {
      const p = dot(x, y, 11, C.line, C.ink, 2.2);
      body += `<g class="sp"${st({ '--tx': f((x - ZX) * 0.22) + 'px', '--ty': f((y - ZY) * 0.22) + 'px' })}>${jig(`<g class="hj">${p}</g>`, 1.2, 1.2, -r() * 1.2)}</g>`;
    });
    css += `.sc-${id} .sp { transition: transform 1.8s ease-in-out .4s; } .on2 .sc-${id} .sp { transform: translate(var(--tx), var(--ty)); }
      .sc-${id} .hj { --a: 3.5px; } .on2 .sc-${id} .hj { animation: ${id}-jg .3s linear infinite; }`;
    // 막대: 칸 3에 오른쪽으로 늘어난다
    const X0 = 70, X1 = 430;
    body += `<path d="M${X1} 250 V314" stroke="${C.muted}" stroke-width="2.5" stroke-dasharray="6 5"/>`;
    body += `<g class="bar"><rect x="${X0}" y="262" width="${X1 - X0}" height="28" rx="6" fill="${C.line}" stroke="${C.muted}" stroke-width="3"/><g class="b2"><rect class="cf cf2" style="animation-delay:.3s" x="${X0}" y="262" width="${X1 - X0}" height="28" rx="6" fill="${C.orange}" fill-opacity=".45"/></g></g>`;
    css += `.sc-${id} .bar { transform-box: view-box; transform-origin: ${X0}px 276px; }` + states(id, 'bar', 'transform', ['none', 'none', 'none', 'scaleX(1.13)'], 1.6, 0.3);
    body += `<g class="b2">${flame(180, 344, 0.9)}${flame(250, 344, 0.9)}${flame(320, 344, 0.9)}</g>`;
    body += at(2, 'pop', tag(400, 330, '가열', HOT, { size: 18 }), 0.2);
    // 칸 3: 늘어난 만큼
    body += drawPath(`M${X1} 236 H${f(X0 + (X1 - X0) * 1.13)}`, 3, C.red, 4, 1.2) + at(3, 'pop', tag(548, 236, '늘어남', RED, { size: 18 }), 1.4);
    body += at(3, 'pop', tag(510, 100, '열팽창', HOT, { size: 26 }), 1.7);
    put('7-1/과학/3/열팽창', svg(id, body, css));
  })();

  // ── 바이메탈: 많이 늘어나는 금속(위)과 적게 늘어나는 금속(아래), 데우면 아래로 휜다 ──
  (function () {
    const id = 't71-s3-bimetal';
    let css = base(id);
    const X = 96, Y = 180, SEG = 40, NS = 8, A = 3.5;
    let body = '';
    // 전기 회로: 고정대 → 전지 → 전구 → 맞닿는 점
    body += `<path d="M66 140 V60 H${X + SEG * NS - 2} V150" stroke="${C.muted}" stroke-width="4" fill="none" stroke-linejoin="round"/>`;
    body += `<rect x="140" y="44" width="40" height="32" fill="${C.paper}"/><path d="M150 44 V76 M164 52 V68" stroke="${C.ink}" stroke-width="4" stroke-linecap="round"/>`;
    body += `<circle class="glow" cx="300" cy="60" r="34" fill="${C.yellow}" fill-opacity=".6"/><circle cx="300" cy="60" r="18" fill="white" stroke="${C.ink}" stroke-width="3"/><path d="M292 66 L296 54 L300 64 L304 54 L308 66" stroke="${C.orange}" stroke-width="2.5" fill="none" stroke-linejoin="round"/>`;
    css += states(id, 'glow', 'opacity', ['1', '1', '0', '1'], 0.6, 1.0);
    body += `<rect x="${X + SEG * NS - 12}" y="150" width="20" height="16" rx="3" fill="${C.line}" stroke="${C.ink}" stroke-width="2.5"/>`;
    // 휘는 띠: 마디마다 속성 없는 <g> 를 겹겹이 넣어 차례로 조금씩 돈다
    let strip = '';
    for (let k = NS - 1; k >= 0; k--) {
      const x = X + k * SEG;
      const seg = `<rect x="${x - 1}" y="${Y - 13}" width="${SEG + 2}" height="13" fill="${C.peach}" stroke="${C.orange}" stroke-width="2"/><rect x="${x - 1}" y="${Y}" width="${SEG + 2}" height="13" fill="${C.sky}" stroke="${C.blue}" stroke-width="2"/>`;
      strip = `<g class="sg" style="transform-origin:${x}px ${Y}px">${seg}${strip}</g>`;
    }
    body += strip;
    css += `.sc-${id} .sg { transform-box: view-box; }` + states(id, 'sg', 'transform', ['none', 'none', `rotate(${A}deg)`, 'none'], 1.6, 0.4);
    body += `<rect x="40" y="140" width="56" height="84" rx="6" fill="${C.line}" stroke="${C.muted}" stroke-width="3"/>`;
    // 칸 1: 두 금속 이름
    body += atH(1, 2, 'fin', lead(250, 132, 250, 166, C.orange) + tag(250, 116, '많이 늘어남', HOT, { size: 18 }), 0.3);
    body += atH(1, 2, 'fin', lead(250, 228, 250, 194, C.blue) + tag(250, 244, '적게 늘어남', COLD, { size: 18 }), 0.6);
    // 칸 2: 가열
    body += `<g class="b2 h3">${flame(170, 344, 0.9)}${flame(240, 344, 0.9)}${flame(310, 344, 0.9)}</g>`;
    body += atH(2, 3, 'pop', tag(500, 300, '가열', HOT, { size: 18 }), 0.2);
    body += atH(2, 3, 'fin', `<path d="M444 160 L460 176 M460 160 L444 176" stroke="${C.red}" stroke-width="4" stroke-linecap="round"/>`, 1.6);
    // 칸 3: 식어서 펴짐, '바이메탈'
    body += at(3, 'pop', tag(530, 220, '바이메탈', HOT, { size: 24 }), 1.4) + glowRect(36, 160, 386, 40, 3, C.orange, 1.6, 10);
    put('7-1/과학/3/바이메탈', svg(id, body, css));
  })();
})(typeof window !== 'undefined' ? window : globalThis);
