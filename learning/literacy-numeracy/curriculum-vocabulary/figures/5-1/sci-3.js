// 과학 5-1 낱말 도식(4단원 우리 몸의 구조와 기능 — 뼈와 근육, 소화기관, 순환기관):
// 구조, 기능, 기관, 소화, 흡수, 식도, 작은창자, 큰창자, 이자, 순환, 혈액, 혈관, 펌프 작용을 코드로 그린다.
// 몸은 머리·몸통 윤곽만 있는 단순한 선 그림(bodyLine)을 같이 쓰고, 몸속 기관은 옅은 색 면과 선으로만 그린다.
// 사람을 마주 보고 그리므로 위·심장은 그림의 오른쪽(사람의 왼쪽)에 놓는다.
// 관(식도·창자·혈관) 속을 지나가는 알갱이는 점선(stroke-dasharray 0 간격)을 흘려서 그린다.
// 교과서(미래엔·아이스크림)가 이 단원에서 다루지 않는 것(간·쓸개의 일, 동맥과 정맥 구분, 노폐물)은 그리지 않는다.
// 움직임은 transform·opacity·stroke-dashoffset 만 쓴다(아이패드 사파리).
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
  // 글자 폭 어림(맑은 고딕 굵게: 한글 1em, 숫자·기호 .6em, 빈칸 .3em)
  const tw = (s, size) => [...String(s)].reduce((a, c) => a + (/[가-힣]/.test(c) ? 1 : c === ' ' ? 0.3 : 0.6), 0) * size;
  const HOT = [C.peach, C.orange], COLD = [C.sky, C.blue], OK = [C.mint, C.green], GAS = [C.lilac, C.purple], BLOOD = ['white', C.red], GRAY = ['white', C.muted];
  const tag = (cx, cy, label, [fill, stroke] = OK, { size = 20 } = {}) => {
    const w = Math.round(tw(label, size) + size * 1.3), h = Math.round(size * 1.7);
    return `<g><rect x="${f(cx - w / 2)}" y="${f(cy - h / 2)}" width="${w}" height="${h}" rx="${h / 2}" fill="${fill}" stroke="${stroke}" stroke-width="2.5"/>${text(f(cx), f(cy + size * 0.36), label, { size })}</g>`;
  };
  const lead = (x1, y1, x2, y2, color = C.muted) => `<path d="M${f(x1)} ${f(y1)} L${f(x2)} ${f(y2)}" stroke="${color}" stroke-width="2.5" stroke-linecap="round"/>`;
  const head = (x, y, ang, color, w = 4) => {
    const l = 8 + w * 1.4, p = (d) => `${f(x - l * Math.cos(ang + d))} ${f(y - l * Math.sin(ang + d))}`;
    return `<path d="M${p(-0.5)} L${f(x)} ${f(y)} L${p(0.5)}" stroke="${color}" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  };
  const solid = (x1, y1, x2, y2, color, w = 4) => {
    const ang = Math.atan2(y2 - y1, x2 - x1);
    return `<path d="M${f(x1)} ${f(y1)} L${f(x2 - w * Math.cos(ang))} ${f(y2 - w * Math.sin(ang))}" stroke="${color}" stroke-width="${w}" stroke-linecap="round"/>${head(x2, y2, ang, color, w)}`;
  };
  const drop = (x, y, r = 7, fill = C.sky, stroke = C.blue) => `<path d="M${f(x)} ${f(y - r * 1.5)} Q${f(x + r * 1.05)} ${f(y - r * 0.2)} ${f(x + r)} ${f(y + r * 0.2)} A${r} ${r} 0 0 1 ${f(x - r)} ${f(y + r * 0.2)} Q${f(x - r * 1.05)} ${f(y - r * 0.2)} ${f(x)} ${f(y - r * 1.5)} Z" fill="${fill}" stroke="${stroke}" stroke-width="2"/>`;
  // 영양소 알갱이(주황), 산소(눈에 안 보이는 기체라 점선 테두리)
  const nut = (x, y, r = 6) => `<circle cx="${f(x)}" cy="${f(y)}" r="${r}" fill="${C.orange}" stroke="white" stroke-width="2"/>`;
  const oxy = (x, y, r = 8) => `<circle cx="${f(x)}" cy="${f(y)}" r="${r}" fill="white" stroke="${C.blue}" stroke-width="2.5" stroke-dasharray="3.5 2.5"/>`;
  const ring = (cx, cy, r, n, color = C.green, s = 0) => `<g class="b${n}"><circle class="ring ring${n}"${dl(s)} cx="${f(cx)}" cy="${f(cy)}" r="${r}" fill="none" stroke="${color}" stroke-width="4"/></g>`;
  // 칸마다 바뀌는 CSS 값(vals[0] 은 첫 칸이 열리기 전 모습)
  const states = (id, cls, prop, vals, sec = 2, delay = 0.2) => `.sc-${id} .${cls} { ${prop}: ${vals[0]}; transition: ${prop} ${sec}s ease-in-out ${delay}s; }`
    + vals.slice(1).map((v, i) => v == null ? '' : `.on${i + 1} .sc-${id} .${cls} { ${prop}: ${v}; }`).join('');
  // 움직이는 알갱이(go: 제자리에서 --dx,--dy 만큼 갔다가 사라지기를 되풀이)
  const mover = (cls, inner, dx, dy, s = 0) => `<g class="${cls}" style="--dx:${f(dx)}px;--dy:${f(dy)}px;animation-delay:${s}s">${inner}</g>`;
  // 크게 보기 원: 작은 원(c1,r1)과 큰 원(c2,r2)을 두 줄로 잇는다
  const zoomLines = ([x1, y1], r1, [x2, y2], r2) => {
    const d = Math.hypot(x2 - x1, y2 - y1), nx = -(y2 - y1) / d, ny = (x2 - x1) / d;
    return [1, -1].map((k) => `<path d="M${f(x1 + k * r1 * nx)} ${f(y1 + k * r1 * ny)} L${f(x2 + k * r2 * nx)} ${f(y2 + k * r2 * ny)}" stroke="${C.muted}" stroke-width="2.5" stroke-dasharray="7 5"/>`).join('');
  };
  // 관: 짙은 테두리 위에 옅은 속
  const tube = (d, w, fill, stroke, extra = '') => `<path d="${d}" stroke="${stroke}" stroke-width="${w + 5}" fill="none" stroke-linecap="round" stroke-linejoin="round"${extra}/><path d="${d}" stroke="${fill}" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round"${extra}/>`;
  // 관 속을 흘러가는 알갱이: 점 간격 per(24 또는 40)
  const dots = (d, color, w, per = 24, s = 0) => `<path class="dots${per}" d="${d}" stroke="${color}" stroke-width="${w}" stroke-dasharray="0 ${per}" stroke-linecap="round" fill="none"${s ? ` style="animation-delay:${s}s"` : ''}/>`;
  // 선 그리기(pathLength=1)
  const drawn = (n, d, color, w, s = 0, extra = '') => `<g class="b${n}"><path class="draw draw${n}" pathLength="1" d="${d}" stroke="${color}" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round"${s ? ` style="transition-delay:${s}s"` : ''}${extra}/></g>`;

  const base = (id) => {
    let s = `
    .sc-${id} .pop, .sc-${id} .pulse, .sc-${id} .ring, .sc-${id} .hb, .sc-${id} .lung { transform-box: fill-box; transform-origin: center; }
    .sc-${id} .dots24 { animation: ${id}-m24 1.1s linear infinite; }
    .sc-${id} .dots40 { animation: ${id}-m40 1.1s linear infinite; }
    .sc-${id} .draw { stroke-dasharray: 1; stroke-dashoffset: 1; transition: stroke-dashoffset 1.6s ease-in-out .2s; }
    .sc-${id} .ring { opacity: 0; }
    @keyframes ${id}-pop { 0% { opacity: 0; transform: scale(.3); } 70% { opacity: 1; transform: scale(1.12); } 100% { opacity: 1; transform: scale(1); } }
    @keyframes ${id}-fin { from { opacity: 0; } to { opacity: 1; } }
    @keyframes ${id}-rise { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
    @keyframes ${id}-pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.12); } }
    @keyframes ${id}-flash { 0% { opacity: 0; } 20% { opacity: 1; } 40% { opacity: .25; } 60% { opacity: 1; } 80% { opacity: .25; } 100% { opacity: 1; } }
    @keyframes ${id}-ring { 0% { opacity: .9; transform: scale(1); } 100% { opacity: 0; transform: scale(1.6); } }
    @keyframes ${id}-m24 { from { stroke-dashoffset: 24; } to { stroke-dashoffset: 0; } }
    @keyframes ${id}-m40 { from { stroke-dashoffset: 40; } to { stroke-dashoffset: 0; } }
    @keyframes ${id}-go { 0% { opacity: 0; transform: translate(0, 0); } 18% { opacity: 1; } 82% { opacity: 1; } 100% { opacity: 0; transform: translate(var(--dx, 0), var(--dy, 0)); } }
    @keyframes ${id}-beat { 0%, 60%, 100% { transform: scale(1); } 25% { transform: scale(.84); } }
    @keyframes ${id}-breathe { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.06); } }
    .sc-${id} .go { animation: ${id}-go 2.2s ease-in-out infinite; }
    .sc-${id} .goslow { animation: ${id}-go 3s linear infinite; }
    .sc-${id} .beating { animation: ${id}-beat 1.2s ease-in-out infinite; }
    `;
    for (let n = 1; n <= 5; n++) s += `
    .on${n} .sc-${id} .pop${n} { animation: ${id}-pop .5s ease-out both; }
    .on${n} .sc-${id} .fin${n} { animation: ${id}-fin .5s ease-out both; }
    .on${n} .sc-${id} .rise${n} { animation: ${id}-rise .5s ease-out both; }
    .on${n} .sc-${id} .pulse${n} { animation: ${id}-pulse .7s ease-in-out .3s 2; }
    .on${n} .sc-${id} .flash${n} { animation: ${id}-flash 1.4s ease-in-out both; }
    .on${n} .sc-${id} .ring${n} { animation: ${id}-ring 1.1s ease-out .3s 2; }
    .on${n} .sc-${id} .draw${n} { stroke-dashoffset: 0; }`;
    return s;
  };

  // ════ 몸 윤곽(머리·몸통): 가운데 x=320, 머리 (320,46) 반지름 34, 몸통은 그림 아래 끝까지 ════
  const TORSO = 'M304 74 L304 96 C290 100 262 102 238 110 C222 116 214 130 214 150 L222 250 C216 290 214 330 214 364 L426 364 C426 330 424 290 418 250 L426 150 C426 130 418 116 402 110 C378 102 350 100 336 96 L336 74 Z';
  const bodyLine = (mouth = false) => `<path d="${TORSO}" fill="white" stroke="${C.muted}" stroke-width="3" stroke-linejoin="round"/>`
    + `<circle cx="320" cy="46" r="34" fill="white" stroke="${C.muted}" stroke-width="3"/>`
    + (mouth ? `<path d="M310 62 Q320 69 330 62" stroke="${C.muted}" stroke-width="3" fill="none" stroke-linecap="round"/>` : '');

  // ── 소화기관(몸통 윤곽에 맞춘 자리) ──
  const ESO = 'M320 68 L320 112 C320 140 326 158 340 176';
  const STOM = 'M338 172 C354 160 402 164 404 196 C406 226 376 242 342 238 C330 237 320 232 312 226 L320 214 C330 220 344 224 358 220 C372 214 370 198 356 192 C348 188 342 184 338 172 Z';
  const SI = 'M314 222 C298 228 288 240 290 252 C291 262 296 268 306 270 L352 270 C370 270 370 288 352 288 L290 288 C272 288 272 306 290 306 L352 306 C370 306 370 324 352 324 L270 324 C264 324 262 328 261 334';
  const SI1 = 'M314 222 C298 228 288 240 290 252 C291 262 296 268 306 270 L352 270 C370 270 370 288 352 288';
  const SI2 = 'M352 288 L290 288 C272 288 272 306 290 306 L352 306 C370 306 370 324 352 324 L270 324 C264 324 262 328 261 334';
  const LI = 'M260 342 C254 322 250 292 250 266 C250 255 256 250 268 250 L374 250 C386 250 392 256 392 268 L392 322 C392 338 380 344 356 346 C340 347 328 350 322 360';
  const IJA = 'M300 232 C304 224 322 224 342 226 C362 228 382 220 398 218 C406 218 406 228 398 232 C382 238 362 238 342 238 C322 239 304 242 300 232 Z';
  const siT = (extra = '') => tube(SI, 11, C.peach, C.orange, extra);
  const liT = (extra = '') => tube(LI, 18, C.peach, C.orange, extra);
  const esoT = (extra = '') => tube(ESO, 11, C.peach, C.orange, extra);
  const stomS = (extra = '') => `<path d="${STOM}" fill="${C.peach}" stroke="${C.orange}" stroke-width="3" stroke-linejoin="round"${extra}/>`;
  const ijaS = (extra = '') => `<path d="${IJA}" fill="${C.lilac}" stroke="${C.purple}" stroke-width="3" stroke-linejoin="round"${extra}/>`;
  // 위 속에서 음식물이 섞이는 고리
  const CHURN = 'M352 202 C352 190 392 186 392 204 C392 222 352 222 352 210 Z';
  const tract = ({ ija = false } = {}) => siT() + liT() + (ija ? ijaS() : '') + stomS() + esoT();

  // ── 심장: (cx,cy) 가운데, s 크기의 둥근 하트 꼴 ──
  const heartD = (cx, cy, s) => {
    const P = (x, y) => `${f(cx + x * s)} ${f(cy + y * s)}`;
    return `M${P(0, -0.3)} C${P(0.1, -0.75)} ${P(0.95, -0.65)} ${P(0.9, -0.05)} C${P(0.85, 0.4)} ${P(0.3, 0.6)} ${P(0, 0.95)} C${P(-0.3, 0.6)} ${P(-0.85, 0.4)} ${P(-0.9, -0.05)} C${P(-0.95, -0.65)} ${P(-0.1, -0.75)} ${P(0, -0.3)} Z`;
  };
  const heart = (cx, cy, s, cls = 'hb') => `<g class="${cls}"><path d="${heartD(cx, cy, s)}" fill="white"/><path d="${heartD(cx, cy, s)}" fill="${C.red}" fill-opacity=".22" stroke="${C.red}" stroke-width="3" stroke-linejoin="round"/></g>`;
  // 혈관 관(붉은 테두리, 옅은 속)
  const vessel = (d, w = 7) => tube(d, w, C.peach, C.red);

  // ── 순환 고리: 심장 (338,158). 고리마다 [나가는 길, 돌아오는 길] ──
  const HX = 338, HY = 158;
  const LOOPS = [
    ['M348 144 C354 116 354 90 346 66 C340 46 330 34 320 34', 'M320 34 C310 34 300 46 294 66 C286 90 290 118 326 146'],
    ['M352 176 C390 208 402 262 388 306 C380 326 352 334 320 334', 'M320 334 C288 334 260 326 252 306 C238 262 254 210 326 178']
  ];
  // 고리 위 방향 화살촉(경로의 끝 근처 방향)
  const tipAt = (x, y, x0, y0, color = C.red) => head(x, y, Math.atan2(y - y0, x - x0), color, 4);

  // ════ 구조: 몸속 자리마다 모양이 다른 뼈, 그 뼈에 붙은 근육 ════
  // 팔다리가 있는 몸(이 장면만): 가운데 x=320, 머리 (320,40)
  const FIG = {
    torso: 'M308 64 L308 80 C296 82 278 84 268 90 C260 95 258 104 260 116 L270 180 C266 194 266 206 270 222 L370 222 C374 206 374 194 370 180 L380 116 C382 104 380 95 372 90 C362 84 344 82 332 80 L332 64 Z',
    arms: ['M266 100 L250 166 L240 232', 'M374 100 L390 166 L400 232'],
    legs: ['M298 214 L296 342', 'M342 214 L344 342']
  };
  const limb = (d, w) => `<path d="${d}" stroke="${C.muted}" stroke-width="${w + 5}" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" stroke="white" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  const bone = (d, w) => `<path d="${d}" stroke="${C.muted}" stroke-width="${w + 4}" fill="none" stroke-linecap="round"/><path d="${d}" stroke="${C.line}" stroke-width="${w}" fill="none" stroke-linecap="round"/>`;
  // 근육: 두 점을 잇는 볼록한 렌즈 꼴
  const lens = (x1, y1, x2, y2, hw) => {
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, L = Math.hypot(x2 - x1, y2 - y1), nx = -(y2 - y1) / L, ny = (x2 - x1) / L;
    return `M${f(x1)} ${f(y1)} Q${f(mx + nx * hw * 2)} ${f(my + ny * hw * 2)} ${f(x2)} ${f(y2)} Q${f(mx - nx * hw * 2)} ${f(my - ny * hw * 2)} ${f(x1)} ${f(y1)} Z`;
  };
  const muscle = (d) => `<path d="${d}" fill="${C.peach}" fill-opacity=".85" stroke="${C.orange}" stroke-width="2.5" stroke-linejoin="round"/>`;
  (function () {
    const id = 't51-c4a-gujo';
    let css = base(id);
    let body = FIG.arms.map((d) => limb(d, 27)).join('') + FIG.legs.map((d) => limb(d, 31)).join('')
      + `<path d="${FIG.torso}" fill="white" stroke="${C.muted}" stroke-width="3" stroke-linejoin="round"/><circle cx="320" cy="40" r="28" fill="white" stroke="${C.muted}" stroke-width="3"/>`;
    const skull = `<path d="M301 40 C301 19 339 19 339 40 C339 50 334 56 328 58 L312 58 C306 56 301 50 301 40 Z" fill="${C.line}" stroke="${C.muted}" stroke-width="2.5"/>`;
    let spine = '';
    for (let y = 86; y <= 206; y += 12) spine += `<rect x="314" y="${y}" width="12" height="9" rx="3" fill="${C.line}" stroke="${C.muted}" stroke-width="2"/>`;
    let ribs = '';
    for (let i = 0; i < 4; i++) { const y = 98 + i * 18; ribs += bone(`M312 ${y} C298 ${y - 4} 286 ${y + 2} 284 ${y + 13}`, 3) + bone(`M328 ${y} C342 ${y - 4} 354 ${y + 2} 356 ${y + 13}`, 3); }
    const armB = bone('M264 106 L251 161', 7) + bone('M249 171 L241 225', 6) + bone('M376 106 L389 161', 7) + bone('M391 171 L399 225', 6);
    const legB = bone('M298 222 L297 276', 9) + bone('M297 286 L296 334', 8) + bone('M342 222 L343 276', 9) + bone('M343 286 L344 334', 8);
    // 칸 1: 뼈가 차례로 나타나고 이름표
    body += at(1, 'pop', skull, 0) + at(1, 'fin', lead(186, 40, 299, 40), 0.1) + at(1, 'pop', tag(150, 40, '머리뼈', GRAY), 0.15);
    body += at(1, 'fin', ribs, 0.5) + at(1, 'fin', lead(454, 110, 360, 112), 0.6) + at(1, 'pop', tag(490, 110, '갈비뼈', GRAY), 0.65);
    body += at(1, 'fin', spine, 1.0) + at(1, 'fin', lead(186, 128, 312, 150), 1.1) + at(1, 'pop', tag(150, 128, '척추뼈', GRAY), 1.15);
    body += at(1, 'fin', armB, 1.5) + at(1, 'fin', lead(186, 212, 244, 200), 1.6) + at(1, 'pop', tag(150, 212, '팔뼈', GRAY), 1.65);
    body += at(1, 'fin', legB, 2.0) + at(1, 'fin', lead(454, 300, 346, 300), 2.1) + at(1, 'pop', tag(490, 300, '다리뼈', GRAY), 2.15);
    // 칸 2: 뼈에 붙은 근육
    const ms = [lens(263, 110, 251, 158, 7), lens(248, 174, 241, 222, 6), lens(377, 110, 389, 158, 7), lens(392, 174, 399, 222, 6),
      lens(298, 226, 297, 276, 9), lens(297, 288, 296, 332, 7), lens(342, 226, 343, 276, 9), lens(343, 288, 344, 332, 7)];
    body += ms.map((d, i) => at(2, 'pop', muscle(d), 0.1 + i * 0.12)).join('');
    body += at(2, 'fin', lead(454, 200, 400, 196), 1.1) + at(2, 'pop', tag(490, 200, '근육', HOT), 1.2);
    // 칸 3: 뼈와 근육이 함께 반짝이고 '구조'
    body += `<g class="b3"><g class="flash flash3">${ms.map((d) => `<path d="${d}" fill="none" stroke="${C.orange}" stroke-width="3"/>`).join('')}</g></g>`;
    body += ring(320, 40, 34, 3, C.muted, 0.2) + ring(320, 140, 70, 3, C.muted, 0.5) + ring(320, 280, 70, 3, C.orange, 0.8);
    body += at(3, 'pop', tag(510, 40, '우리 몸의 구조', OK, { size: 22 }), 1.3);
    put('5-1/과학/4/구조', svg(id, body, css));
  })();

  // ════ 기능: 위팔 안쪽 근육이 줄어들면 팔이 구부러지고, 늘어나면 펴진다 ════
  (function () {
    const id = 't51-c4a-gineung';
    let css = base(id);
    const Y = 240, EX = 320;
    const upSkin = `<path d="M-40 ${Y} L${EX} ${Y}" stroke="${C.muted}" stroke-width="75" stroke-linecap="round"/><path d="M-40 ${Y} L${EX} ${Y}" stroke="white" stroke-width="70" stroke-linecap="round"/>`;
    const foreSkin = `<path d="M${EX} ${Y} L470 ${Y}" stroke="${C.muted}" stroke-width="63" stroke-linecap="round"/><path d="M${EX} ${Y} L470 ${Y}" stroke="white" stroke-width="58" stroke-linecap="round"/>`
      + `<circle cx="494" cy="${Y - 2}" r="30" fill="white" stroke="${C.muted}" stroke-width="3"/>`;
    const upBone = bone(`M10 ${Y + 4} L304 ${Y + 4}`, 15);
    const foreBone = bone(`M336 ${Y + 4} L462 ${Y + 4}`, 13);
    const mus = `<path d="M110 226 Q229 195 348 236 Q229 252 110 226 Z" fill="${C.peach}" stroke="${C.orange}" stroke-width="3" stroke-linejoin="round"/>`;
    // 아래팔(살갗·뼈)은 팔꿈치를 축으로 돈다. 근육은 어깨 쪽 끝을 축으로 짧아지며 굵어진다
    let body = `<g class="fa">${foreSkin}</g>` + upSkin + upBone + `<g class="fa">${foreBone}</g>` + `<g class="mu">${mus}</g>`;
    const BENT = 'rotate(-70deg)', MBENT = 'rotate(-6deg) scale(.91, 1.5)';
    css += `.sc-${id} .fa { transform-box: view-box; transform-origin: ${EX}px ${Y}px; } .sc-${id} .mu { transform-box: view-box; transform-origin: 110px 226px; }`;
    css += states(id, 'fa', 'transform', ['none', 'none', BENT, 'none'], 1.6, 0.3) + states(id, 'mu', 'transform', ['none', 'none', MBENT, 'none'], 1.6, 0.3);
    css += `@keyframes ${id}-bend { 0%, 100% { transform: none; } 45%, 55% { transform: ${BENT}; } } @keyframes ${id}-mbend { 0%, 100% { transform: none; } 45%, 55% { transform: ${MBENT}; } }`
      + `.on4 .sc-${id} .fa { animation: ${id}-bend 3s ease-in-out .4s infinite; } .on4 .sc-${id} .mu { animation: ${id}-mbend 3s ease-in-out .4s infinite; }`;
    // 칸 1: 이름표
    body += atH(1, 2, 'fin', lead(170, 302, 170, 252) + tag(170, 318, '위팔뼈', GRAY), 0.1);
    body += atH(1, 2, 'fin', lead(410, 302, 410, 252) + tag(410, 318, '아래팔뼈', GRAY), 0.3);
    body += at(1, 'fin', lead(200, 168, 200, 214), 0.5) + at(1, 'pop', tag(200, 150, '근육', HOT), 0.6);
    body += `<g class="b1 h2"><path class="flash flash1" style="animation-delay:.6s" d="M110 226 Q229 195 348 236 Q229 252 110 226 Z" fill="none" stroke="${C.orange}" stroke-width="6"/></g>`;
    // 칸 2: 근육이 줄어든다(마주 보는 화살표), 아래팔이 올라간다(굽은 화살표)
    body += atH(2, 3, 'fin', solid(96, 194, 140, 194, C.orange, 4) + solid(316, 194, 272, 194, C.orange, 4), 0.2);
    const arc = 'M500 196 A182 182 0 0 0 440 102';
    body += atH(2, 3, 'fin', `<path d="${arc}" stroke="${C.green}" stroke-width="4" fill="none" stroke-linecap="round"/>` + head(440, 102, Math.atan2(102 - 112, 440 - 455), C.green, 4), 1.4);
    // 칸 3: 근육이 늘어난다(바깥 화살표)
    body += atH(3, 4, 'fin', solid(150, 194, 100, 194, C.orange, 4) + solid(262, 194, 312, 194, C.orange, 4), 0.2);
    // 칸 4: 되풀이하며 근육에 고리, '기능'
    body += ring(229, 228, 60, 4, C.orange, 0.2) + ring(229, 228, 60, 4, C.orange, 1.6);
    body += at(4, 'pop', tag(540, 320, '기능', HOT, { size: 22 }), 0.8);
    put('5-1/과학/4/기능', svg(id, body, css));
  })();

  // ════ 기관: 폐·심장·위·콩팥. 맡은 일이 따로 있는 몸속 부분 ════
  (function () {
    const id = 't51-c4a-gigwan';
    let css = base(id);
    let body = bodyLine();
    const lungs = `<path d="M308 112 C290 104 262 118 256 150 C250 176 254 188 268 190 C284 192 300 186 308 180 Z" fill="${C.sky}" stroke="${C.blue}" stroke-width="3" stroke-linejoin="round"/>`
      + `<path d="M332 112 C350 104 378 118 384 150 C390 176 386 188 372 190 C356 192 340 186 332 180 Z" fill="${C.sky}" stroke="${C.blue}" stroke-width="3" stroke-linejoin="round"/>`;
    // 콩팥: 강낭콩 꼴, 오목한 쪽(k)이 몸 가운데를 본다
    const kid = (cx, k) => `<path d="M${cx} 250 C${cx - k * 22} 250 ${cx - k * 22} 294 ${cx} 294 C${cx + k * 12} 294 ${cx + k * 14} 284 ${cx + k * 8} 278 C${cx + k * 3} 274 ${cx + k * 3} 270 ${cx + k * 8} 266 C${cx + k * 14} 260 ${cx + k * 12} 250 ${cx} 250 Z" fill="${C.lilac}" stroke="${C.purple}" stroke-width="3" stroke-linejoin="round"/>`;
    // 위는 폐와 겹치지 않게 조금 내려 그린다
    const stom = `<g transform="translate(0 16)">${stomS()}<path class="dots24" d="${CHURN}" stroke="${C.orange}" stroke-width="7" stroke-dasharray="0 24" stroke-linecap="round" fill="none"/></g>`;
    body += at(1, 'pop', `<g class="lung">${lungs}</g>`, 0) + at(1, 'fin', lead(186, 140, 256, 150), 0.1) + at(1, 'pop', tag(160, 140, '폐', COLD), 0.15);
    body += at(1, 'pop', heart(336, 150, 26, 'hb beat2'), 0.5) + at(1, 'fin', lead(468, 132, 360, 144), 0.6) + at(1, 'pop', tag(500, 132, '심장', BLOOD), 0.65);
    body += at(1, 'pop', stom, 1.0) + at(1, 'fin', lead(468, 220, 404, 214), 1.1) + at(1, 'pop', tag(500, 220, '위', HOT), 1.15);
    body += at(1, 'pop', kid(288, 1) + kid(352, -1), 1.5) + at(1, 'fin', lead(186, 276, 270, 274), 1.6) + at(1, 'pop', tag(150, 276, '콩팥', GAS), 1.65);
    css += `.on2 .sc-${id} .beat2 { animation: ${id}-beat 1.2s ease-in-out .3s infinite; }`;
    // 칸 2: 심장이 뛰며 혈액을 내보내고, 위 속 음식물이 섞인다
    body += shown(2, vessel('M344 134 C350 110 350 92 346 82') + dots('M344 134 C350 110 350 92 346 82', C.red, 6, 24));
    css += `.sc-${id} .dots24 { animation-play-state: paused; } .on2 .sc-${id} .dots24 { animation-play-state: running; }`;
    // 칸 3: 네 기관에 고리, '기관'
    body += ring(282, 150, 40, 3, C.blue, 0.1) + ring(336, 150, 30, 3, C.red, 0.4) + ring(366, 218, 46, 3, C.orange, 0.7) + ring(320, 272, 56, 3, C.purple, 1.0);
    body += at(3, 'pop', tag(520, 320, '기관', OK, { size: 22 }), 1.4);
    put('5-1/과학/4/기관', svg(id, body, css));
  })();

  // ════ 소화: 입 → 식도 → 위 → 작은창자 → 큰창자 → 항문, 지나가며 잘게 쪼개진다 ════
  (function () {
    const id = 't51-c4a-sohwa';
    let css = base(id);
    let body = bodyLine(true) + tract();
    // 칸 1: 입에서 큰 덩어리가 작게 부서진다
    body += atH(1, 2, 'pop', `<g class="chunk"><circle cx="320" cy="56" r="11" fill="${C.orange}" stroke="white" stroke-width="2"/></g>`, 0);
    [[-9, -2], [0, 6], [9, -2]].forEach(([dx, dy], i) => { body += shown(1, `<g class="bit" style="--dx:${dx}px;--dy:${dy}px;animation-delay:${0.9 + i * 0.08}s"><circle cx="320" cy="56" r="5" fill="${C.orange}" stroke="white" stroke-width="1.5"/></g>`, 2); });
    css += `@keyframes ${id}-chunk { 0%, 55% { opacity: 1; transform: scale(1); } 100% { opacity: 0; transform: scale(.4); } }`
      + `@keyframes ${id}-bit { 0% { opacity: 0; transform: none; } 100% { opacity: 1; transform: translate(var(--dx), var(--dy)); } }`
      + `.sc-${id} .chunk { transform-box: fill-box; transform-origin: center; } .on1 .sc-${id} .chunk { animation: ${id}-chunk 1.2s ease-out .5s both; }`
      + `.sc-${id} .bit { opacity: 0; } .on1 .sc-${id} .bit { animation: ${id}-bit .5s ease-out both; }`;
    body += at(1, 'fin', lead(186, 64, 308, 64), 0.2) + at(1, 'pop', tag(160, 64, '입', HOT), 0.3);
    // 칸 2: 식도를 지나 위로, 위에서 섞이며 더 작아진다
    body += shown(2, dots(ESO, C.orange, 10, 24) + dots(CHURN, C.orange, 7, 24));
    body += at(2, 'fin', lead(186, 140, 316, 140), 0.2) + at(2, 'pop', tag(160, 140, '식도', HOT), 0.3);
    body += at(2, 'fin', lead(468, 190, 404, 196), 0.6) + at(2, 'pop', tag(500, 190, '위', HOT), 0.7);
    // 칸 3: 작은창자에서 아주 작아져 몸속으로, 찌꺼기는 큰창자를 지나 항문으로
    body += shown(3, dots(SI, C.orange, 5, 24) + dots(LI, C.muted, 9, 24, 0.3));
    [[300, 270, -30, -26], [352, 288, 34, -10], [290, 306, -36, 8], [340, 324, 24, 18], [320, 270, 8, -30]].forEach(([x, y, dx, dy], i) => {
      body += shown(3, mover('go', `<circle cx="${x}" cy="${y}" r="3.5" fill="${C.orange}"/>`, dx, dy, f(0.6 + i * 0.35)));
    });
    body += at(3, 'fin', lead(468, 280, 372, 288), 0.2) + at(3, 'pop', tag(520, 280, '작은창자', HOT), 0.3);
    body += at(3, 'fin', lead(186, 270, 242, 270), 0.6) + at(3, 'pop', tag(140, 270, '큰창자', HOT), 0.7);
    body += at(3, 'fin', lead(186, 336, 318, 356), 1.0) + at(3, 'pop', tag(150, 336, '항문', HOT), 1.1);
    // 칸 4: 지나가는 길 전체가 반짝이고 '소화'
    body += `<g class="b4"><g class="flash flash4">${[ESO, SI, LI].map((d) => `<path d="${d}" stroke="${C.yellow}" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`).join('')}<path d="${STOM}" fill="none" stroke="${C.yellow}" stroke-width="4"/></g></g>`;
    body += at(4, 'pop', tag(520, 70, '소화', HOT, { size: 22 }), 0.9);
    put('5-1/과학/4/소화', svg(id, body, css));
  })();

  // ════ 흡수: 작은창자에서 영양소와 물이, 큰창자에서 물이 몸속으로 들어간다 ════
  (function () {
    const id = 't51-c4a-heupsu';
    let css = base(id);
    const DX = -150;
    let body = `<g transform="translate(${DX} 0)">${bodyLine() + tract()}</g>`;
    const Z = [470, 192], R = 134;
    const MS = [326 + DX, 296], ML = [251 + DX, 300];
    // 작은창자를 크게: 가는 관 속을 아주 작은 알갱이가 흐른다
    const band = (y1, y2, wall) => `<rect x="${Z[0] - R}" y="${Z[1] - R}" width="${2 * R}" height="${2 * R}" fill="white"/>`
      + `<rect x="${Z[0] - R}" y="${y1}" width="${2 * R}" height="${y2 - y1}" fill="${C.peach}"/>`
      + `<path d="M${Z[0] - R} ${y1} H${Z[0] + R} M${Z[0] - R} ${y2} H${Z[0] + R}" stroke="${C.orange}" stroke-width="${wall}"/>`;
    const lane = (y, color, w, per, s) => dots(`M${Z[0] - R - 40} ${y} H${Z[0] + R + 40}`, color, w, per, s);
    let zs = band(150, 234, 5) + lane(170, C.orange, 7, 24, 0) + lane(192, C.blue, 7, 40, 0.4) + lane(214, C.orange, 7, 24, 0.7);
    // 칸 2: 영양소와 물이 벽을 지나 몸속(아래)으로
    let out2 = '';
    [[392, 214, 'n'], [440, 214, 'w'], [488, 214, 'n'], [536, 214, 'w'], [414, 214, 'w'], [512, 214, 'n']].forEach(([x, y, k], i) => {
      out2 += mover('go', k === 'n' ? nut(x, y, 6) : drop(x, y, 6), 14, 84, f(i * 0.37));
    });
    zs += `<g class="b2">${out2}</g>`;
    // 큰창자를 크게: 굵은 관 속의 찌꺼기에서 물만 빠져나간다
    let zl = band(140, 248, 6) + lane(172, C.muted, 13, 40, 0) + lane(214, C.muted, 13, 40, 0.5);
    let out3 = '';
    [[400, 228], [452, 228], [504, 228], [548, 228], [426, 228]].forEach(([x, y], i) => { out3 += mover('go', drop(x, y, 6), 10, 76, f(i * 0.44)); });
    zl += out3;
    body += `<defs><clipPath id="${id}-z"><circle cx="${Z[0]}" cy="${Z[1]}" r="${R}"/></clipPath></defs>`;
    body += shown(1, `<circle cx="${MS[0]}" cy="${MS[1]}" r="32" fill="none" stroke="${C.muted}" stroke-width="3" stroke-dasharray="6 4"/>` + zoomLines(MS, 32, Z, R), 3);
    body += shown(3, `<circle cx="${ML[0]}" cy="${ML[1]}" r="24" fill="none" stroke="${C.muted}" stroke-width="3" stroke-dasharray="6 4"/>` + zoomLines(ML, 24, Z, R));
    body += `<g class="b1 h3"><g class="pop pop1"><g clip-path="url(#${id}-z)">${zs}</g><circle cx="${Z[0]}" cy="${Z[1]}" r="${R}" fill="none" stroke="${C.muted}" stroke-width="4"/></g></g>`;
    body += `<g class="b3"><g class="pop pop3"><g clip-path="url(#${id}-z)">${zl}</g><circle cx="${Z[0]}" cy="${Z[1]}" r="${R}" fill="none" stroke="${C.muted}" stroke-width="4"/></g></g>`;
    body += atH(1, 3, 'pop', tag(Z[0], 100, '작은창자', HOT), 0.5);
    body += atH(2, 3, 'pop', tag(Z[0] - 52, 296, '영양소', HOT) + tag(Z[0] + 58, 296, '물', COLD), 0.9);
    body += at(3, 'pop', tag(Z[0], 92, '큰창자', HOT), 0.5) + atH(3, 4, 'pop', tag(Z[0], 300, '물', COLD), 1.0);
    // 칸 4: '흡수'
    body += ring(Z[0], Z[1], R - 8, 4, C.blue, 0.1);
    body += at(4, 'pop', tag(Z[0], 300, '흡수', COLD, { size: 22 }), 0.5);
    put('5-1/과학/4/흡수', svg(id, body, css));
  })();

  // ════ 식도: 입과 위를 잇는 관. 삼킨 음식물이 지나 위로 간다 ════
  (function () {
    const id = 't51-c4a-sikdo';
    let css = base(id);
    let body = bodyLine(true) + `<g opacity=".35">${siT() + liT()}</g>` + stomS() + esoT();
    // 음식물 덩어리가 식도를 따라 내려가 위에 닿는다
    const bolus = `<circle cx="320" cy="64" r="8" fill="${C.orange}" stroke="white" stroke-width="2"/>`;
    css += `@keyframes ${id}-swallow { 0% { opacity: 0; transform: translate(0, 0); } 8% { opacity: 1; transform: translate(0, 0); } 40% { transform: translate(0, 48px); } 62% { transform: translate(4px, 86px); } 80% { opacity: 1; transform: translate(20px, 112px); } 100% { opacity: 0; transform: translate(40px, 134px); } }`
      + `.sc-${id} .bolus { opacity: 0; } .on2 .sc-${id} .bolus { animation: ${id}-swallow 2.4s ease-in-out infinite; }`;
    body += atH(1, 2, 'pop', bolus, 0.2) + `<g class="b2">${[0, 1.2].map((s) => `<g class="bolus" style="animation-delay:${s}s">${bolus}</g>`).join('')}</g>`;
    body += at(1, 'fin', lead(186, 64, 308, 64), 0.3) + at(1, 'pop', tag(160, 64, '입', HOT), 0.4);
    // 칸 2: 관이 반짝이고 위에 닿는다
    body += `<g class="b2"><path class="flash flash2" d="${ESO}" stroke="${C.yellow}" stroke-width="5" fill="none" stroke-linecap="round"/></g>`;
    body += at(2, 'fin', lead(468, 196, 404, 196), 0.8) + at(2, 'pop', tag(500, 196, '위', HOT), 0.9);
    // 칸 3: 식도에 고리, '식도'
    body += ring(324, 124, 52, 3, C.orange, 0.1);
    body += at(3, 'fin', lead(186, 130, 314, 130), 0.4) + at(3, 'pop', tag(150, 130, '식도', HOT, { size: 22 }), 0.5);
    put('5-1/과학/4/식도', svg(id, body, css));
  })();

  // ════ 작은창자: 위 다음의 가늘고 긴 관. 음식물을 더 잘게 쪼개고 영양소와 물을 흡수한다 ════
  (function () {
    const id = 't51-c4a-jageunchangja';
    let css = base(id);
    let body = bodyLine() + `<g opacity=".35">${liT() + esoT()}</g>` + siT() + stomS();
    // 칸 1: 위에서 작은창자로 들어간다
    body += shown(1, dots(CHURN, C.orange, 8, 24) + dots(SI1, C.orange, 8, 24));
    body += at(1, 'fin', lead(468, 190, 404, 196), 0.2) + at(1, 'pop', tag(500, 190, '위', HOT), 0.3);
    body += atH(1, 4, 'fin', lead(468, 286, 372, 288) + tag(520, 286, '작은창자', HOT), 0.6);
    // 칸 2: 길게 이어진 관을 따라 선이 그어지고, 뒤쪽에서는 알갱이가 더 작아진다
    body += drawn(2, SI, C.yellow, 4, 0.1) + shown(2, dots(SI2, C.orange, 4.5, 24, 0.2));
    // 칸 3: 영양소와 물이 관 밖(몸속)으로
    [[300, 288, -34, -18, 'n'], [356, 270, 30, -22, 'w'], [290, 306, -40, 10, 'n'], [362, 306, 34, 6, 'w'], [330, 324, 10, 24, 'n'], [306, 270, -16, -30, 'w']].forEach(([x, y, dx, dy, k], i) => {
      body += shown(3, mover('go', k === 'n' ? nut(x, y, 5) : drop(x, y, 5), dx, dy, f(i * 0.36)));
    });
    body += at(3, 'pop', tag(172, 262, '영양소', HOT), 0.4) + at(3, 'pop', tag(456, 334, '물', COLD), 0.6);
    // 칸 4: 작은창자에 고리
    body += ring(320, 292, 60, 4, C.orange, 0.1);
    body += shown(4, lead(462, 286, 372, 288)) + at(4, 'pop', tag(526, 286, '작은창자', HOT, { size: 22 }), 0.5);
    put('5-1/과학/4/작은창자', svg(id, body, css));
  })();

  // ════ 큰창자: 작은창자를 둘러싼 굵은 관. 찌꺼기에서 물을 흡수하고 항문으로 보낸다 ════
  (function () {
    const id = 't51-c4a-keunchangja';
    let css = base(id);
    let body = bodyLine() + `<g opacity=".35">${siT() + stomS() + esoT()}</g>` + liT();
    const LI1 = 'M261 334 L260 342 C254 322 250 292 250 266 C250 255 256 250 268 250 L374 250';
    const LI2 = 'M374 250 C386 250 392 256 392 268 L392 322 C392 338 380 344 356 346 C340 347 328 350 322 360';
    // 칸 1: 작은창자 끝에서 찌꺼기가 큰창자로
    body += shown(1, `<g opacity=".7">${dots(SI2, C.orange, 4.5, 24)}</g>` + dots(LI1, C.muted, 10, 24, 0.3));
    body += atH(1, 4, 'fin', lead(186, 270, 242, 270) + tag(140, 270, '큰창자', HOT), 0.3);
    // 칸 2: 굵은 관이 그어지고 찌꺼기에서 물이 빠져나간다
    body += drawn(2, LI, C.yellow, 5, 0.1);
    [[250, 270, -34, -4], [392, 284, 32, 0], [250, 300, -34, 2], [392, 314, 32, 4], [250, 326, -32, 8]].forEach(([x, y, dx, dy], i) => {
      body += shown(2, mover('go', drop(x, y, 6), dx, dy, f(i * 0.42)));
    });
    body += at(2, 'fin', lead(452, 262, 430, 278), 0.6) + at(2, 'pop', tag(476, 252, '물', COLD), 0.6);
    // 칸 3: 남은 찌꺼기가 항문으로
    body += shown(3, dots(LI2, C.muted, 10, 24));
    body += at(3, 'fin', lead(468, 338, 326, 354), 0.3) + at(3, 'pop', tag(500, 330, '항문', HOT), 0.4);
    // 칸 4: 큰창자에 고리
    body += ring(320, 296, 78, 4, C.orange, 0.1);
    body += shown(4, lead(186, 270, 242, 270)) + at(4, 'pop', tag(136, 270, '큰창자', HOT, { size: 22 }), 0.5);
    put('5-1/과학/4/큰창자', svg(id, body, css));
  })();

  // ════ 이자: 위 뒤쪽의 길쭉한 기관. 음식물이 지나가지 않고, 소화를 돕는 액체를 작은창자로 보낸다 ════
  (function () {
    const id = 't51-c4a-ija';
    let css = base(id);
    let body = bodyLine(true) + siT() + `<g class="st">${liT()}</g>` + ijaS() + `<g class="st">${stomS()}</g>` + esoT();
    css += states(id, 'st', 'opacity', ['1', '1', '.3'], 1.2, 0.2);
    // 칸 1: 음식물이 지나가는 길
    body += shown(1, dots(ESO, C.orange, 9, 24) + `<g class="st">${dots(CHURN, C.orange, 7, 24)}</g>` + dots(SI, C.orange, 6, 24, 0.2) + `<g class="st">${dots(LI, C.muted, 8, 24, 0.4)}</g>`);
    body += at(1, 'fin', lead(468, 190, 404, 196), 0.3) + at(1, 'pop', tag(500, 190, '위', HOT), 0.4);
    // 칸 2: 위가 옅어지며 뒤쪽의 이자가 드러난다
    body += `<g class="b2"><path class="flash flash2" style="animation-delay:.8s" d="${IJA}" fill="none" stroke="${C.purple}" stroke-width="5"/></g>`;
    body += atH(2, 4, 'fin', lead(468, 248, 404, 228), 1.0) + atH(2, 4, 'pop', tag(500, 250, '이자', GAS), 1.1);
    // 칸 3: 소화를 돕는 액체가 작은창자로
    [0, 0.6, 1.2].forEach((s) => { body += shown(3, mover('go', drop(306, 232, 6, C.lilac, C.purple), -16, 22, s)); });
    body += `<g class="b3"><path class="flash flash3" style="animation-delay:.6s" d="M314 222 C298 228 288 240 290 252 C291 262 296 268 306 270" stroke="${C.purple}" stroke-width="4" fill="none" stroke-linecap="round"/></g>`;
    body += at(3, 'fin', lead(186, 250, 284, 252), 0.4) + at(3, 'pop', tag(140, 250, '작은창자', HOT), 0.5);
    // 칸 4: 이자에 고리, '이자'
    body += ring(352, 230, 56, 4, C.purple, 0.1);
    body += shown(4, lead(468, 248, 404, 228)) + at(4, 'pop', tag(500, 250, '이자', GAS, { size: 22 }), 0.5);
    put('5-1/과학/4/이자', svg(id, body, css));
  })();

  // ════ 순환: 혈액이 심장에서 나와 온몸을 돌고 다시 심장으로 돌아온다 ════
  (function () {
    const id = 't51-c4a-sunhwan';
    let css = base(id);
    let body = bodyLine();
    body += LOOPS.map(([a, b]) => vessel(a) + vessel(b)).join('');
    body += heart(HX, HY, 26, 'hb beating');
    // 칸 1: 나가는 길
    body += shown(1, LOOPS.map(([a]) => dots(a, C.red, 7, 24)).join('') + tipAt(353, 104, 352, 116) + tipAt(399, 250, 396, 232));
    body += at(1, 'fin', lead(468, 160, 364, 158), 0.2) + at(1, 'pop', tag(500, 160, '심장', BLOOD), 0.3);
    // 칸 2: 돌아오는 길
    body += shown(2, LOOPS.map(([, b]) => dots(b, C.red, 7, 24, 0.3)).join('') + tipAt(289, 100, 288, 88) + tipAt(243, 254, 244, 272));
    body += at(2, 'fin', lead(186, 300, 248, 300), 0.4) + at(2, 'pop', tag(150, 300, '혈관', BLOOD), 0.5);
    // 칸 3: 두 고리를 따라 노란 선이 한 바퀴씩, '순환'
    body += LOOPS.map(([a, b], i) => drawn(3, `${a} ${b.replace(/^M[\d.]+ [\d.]+ /, '')}`, C.yellow, 4, 0.2 + i * 0.3)).join('');
    body += at(3, 'pop', tag(520, 60, '순환', BLOOD, { size: 22 }), 1.6);
    put('5-1/과학/4/순환', svg(id, body, css));
  })();

  // ════ 혈액: 혈관 속을 흐르며 영양소와 산소를 나른다 ════
  (function () {
    const id = 't51-c4a-hyeolaek';
    let css = base(id);
    const DX = -150;
    let body = `<g transform="translate(${DX} 0)">${bodyLine() + LOOPS.map(([a, b]) => vessel(a) + vessel(b)).join('') + LOOPS.map(([a, b]) => dots(a, C.red, 7, 24) + dots(b, C.red, 7, 24)).join('') + heart(HX, HY, 26, 'hb beating')}</g>`;
    const Z = [470, 180], R = 134, M = [396 + DX, 262];
    let zin = `<rect x="${Z[0] - R}" y="${Z[1] - R}" width="${2 * R}" height="${2 * R}" fill="white"/>`
      + `<rect x="${Z[0] - R}" y="140" width="${2 * R}" height="84" fill="${C.peach}"/>`
      + `<path d="M${Z[0] - R} 140 H${Z[0] + R} M${Z[0] - R} 224 H${Z[0] + R}" stroke="${C.red}" stroke-width="5"/>`;
    [[160, 0], [182, 0.5], [204, 0.25]].forEach(([y, s]) => { zin += dots(`M${Z[0] - R - 40} ${y} H${Z[0] + R + 40}`, C.red, 12, 40, s); });
    // 칸 2: 영양소와 산소가 혈액에 실려 간다
    let ride = '';
    [[0, 'n', 171], [0.75, 'o', 193], [1.5, 'n', 193], [2.25, 'o', 171]].forEach(([s, k, y]) => { ride += mover('goslow', k === 'n' ? nut(Z[0] - R - 6, y, 9) : oxy(Z[0] - R - 6, y, 10), 2 * R + 12, 0, s); });
    // 칸 3: 몸 곳곳(관 밖)으로 내려 준다
    let give = '';
    [[400, 'n'], [450, 'o'], [500, 'n'], [548, 'o'], [426, 'o'], [524, 'n']].forEach(([x, k], i) => { give += mover('go', k === 'n' ? nut(x, 210, 9) : oxy(x, 210, 10), 20, 74, f(i * 0.37)); });
    zin += `<g class="b2">${ride}</g><g class="b3 h4">${give}</g>`;
    body += `<defs><clipPath id="${id}-z"><circle cx="${Z[0]}" cy="${Z[1]}" r="${R}"/></clipPath></defs>`;
    body += `<circle cx="${M[0]}" cy="${M[1]}" r="20" fill="none" stroke="${C.muted}" stroke-width="3" stroke-dasharray="6 4"/>` + at(1, 'fin', zoomLines(M, 20, Z, R), 0);
    body += `<g class="b1"><g class="pop pop1"><g clip-path="url(#${id}-z)">${zin}</g><circle cx="${Z[0]}" cy="${Z[1]}" r="${R}" fill="none" stroke="${C.muted}" stroke-width="4"/></g></g>`;
    body += atH(1, 2, 'pop', tag(Z[0], 92, '혈액', BLOOD), 0.6);
    body += at(2, 'pop', tag(Z[0] - 56, 92, '영양소', HOT), 0.6) + at(2, 'pop', tag(Z[0] + 62, 92, '산소', COLD), 0.9);
    // 칸 4: 고리와 '혈액'
    body += ring(Z[0], 182, 70, 4, C.red, 0.1);
    body += at(4, 'pop', tag(Z[0], 280, '혈액', BLOOD, { size: 22 }), 0.5);
    put('5-1/과학/4/혈액', svg(id, body, css));
  })();

  // ════ 혈관: 심장에서 뻗어 나가 점점 가늘게 갈라지며 온몸에 퍼진 관 ════
  (function () {
    const id = 't51-c4a-hyeolgwan';
    let css = base(id);
    let body = bodyLine();
    // 굵은 관(심장에서 바깥쪽으로)
    const BIG = ['M330 138 C326 116 322 98 320 72', 'M320 72 C314 60 306 50 298 42', 'M320 72 C326 60 334 50 342 42',
      'M322 150 C296 138 268 128 236 130', 'M354 146 C376 134 398 128 414 134', 'M344 182 C356 222 356 272 344 316', 'M344 316 C330 330 312 342 300 362', 'M344 316 C356 332 370 346 380 362'];
    // 가는 가지
    // 가는 가지: 굵은 관 위 한 점에서 굽어 나가며 두 번 더 갈라진다
    const THIN = [];
    const branch = (x, y, ang, len, depth) => {
      const ex = x + len * Math.cos(ang), ey = y + len * Math.sin(ang), bend = depth % 2 ? 0.35 : -0.35;
      const cx = x + len * 0.5 * Math.cos(ang + bend), cy = y + len * 0.5 * Math.sin(ang + bend);
      THIN.push([`M${f(x)} ${f(y)} Q${f(cx)} ${f(cy)} ${f(ex)} ${f(ey)}`, depth]);
      if (depth > 1) { branch(ex, ey, ang - 0.55, len * 0.62, depth - 1); branch(ex, ey, ang + 0.5, len * 0.58, depth - 1); }
    };
    [[298, 42, -2.2, 14, 2], [342, 42, -0.9, 14, 2], [270, 129, 2.0, 24, 3], [246, 129, -2.3, 18, 2], [392, 129, 1.1, 24, 3], [404, 131, -0.8, 16, 2],
      [353, 214, -0.25, 34, 3], [354, 228, 3.0, 30, 3], [353, 262, 0.35, 34, 3], [352, 282, 2.75, 34, 3], [350, 300, 0.2, 30, 2], [331, 334, 3.4, 26, 2], [356, 334, -0.3, 22, 2]
    ].forEach(([x, y, a, l, d]) => branch(x, y, a, l, d));
    body += BIG.map((d, i) => drawn(1, d, C.red, 11, 0.1 + i * 0.12) + drawn(1, d, C.peach, 5, 0.1 + i * 0.12)).join('');
    body += THIN.map(([d, dep], i) => drawn(2, d, C.red, dep + 1, f(0.1 + (3 - dep) * 0.45 + (i % 5) * 0.04))).join('');
    body += heart(HX, HY, 26, 'hb beating');
    body += at(1, 'fin', lead(468, 160, 364, 158), 0.3) + at(1, 'pop', tag(500, 160, '심장', BLOOD), 0.4);
    // 칸 3: 혈액이 관을 따라 흐른다
    body += shown(3, BIG.map((d, i) => dots(d, C.red, 5, 24, f(i * 0.1))).join(''));
    // 칸 4: '혈관'
    body += `<g class="b4"><g class="flash flash4">${BIG.map((d) => `<path d="${d}" stroke="${C.orange}" stroke-width="12" stroke-opacity=".45" fill="none" stroke-linecap="round"/>`).join('')}</g></g>`;
    body += at(4, 'fin', lead(186, 250, 340, 250), 0.6) + at(4, 'pop', tag(150, 250, '혈관', BLOOD, { size: 22 }), 0.7);
    put('5-1/과학/4/혈관', svg(id, body, css));
  })();

  // ════ 펌프 작용: 심장이 오므라들면 혈액이 나가고, 펴지면 들어온다 ════
  (function () {
    const id = 't51-c4a-pump';
    let css = base(id);
    const HC = [250, 196], S = 92;
    const OUT = 'M282 176 L290 150 C300 100 340 74 400 74 L660 74', IN = 'M-20 124 L110 124 C150 124 176 136 194 154 L214 178';
    let body = vessel(OUT, 18) + vessel(IN, 18);
    body += `<g class="pumpH">${heart(HC[0], HC[1], S, 'hb')}</g>`;
    css += `.sc-${id} .pumpH { transform-box: view-box; transform-origin: ${HC[0]}px ${HC[1] + 10}px; }`
      + states(id, 'pumpH', 'transform', ['none', 'scale(.82)', 'none'], 0.7, 0.3)
      + `@keyframes ${id}-pump { 0%, 60%, 100% { transform: none; } 25% { transform: scale(.82); } } .on3 .sc-${id} .pumpH { animation: ${id}-pump 1.4s ease-in-out infinite; }`;
    // 칸 1: 오므라든다(안쪽 화살표) → 나가는 관으로 혈액이 밀려 나간다
    body += atH(1, 2, 'fin', solid(108, 220, 150, 220, C.red, 4) + solid(392, 220, 350, 220, C.red, 4), 0.2);
    body += shown(1, dots(OUT, C.red, 12, 40));
    body += at(1, 'pop', tag(250, 324, '심장', BLOOD), 0.5);
    // 칸 2: 펴진다(바깥 화살표) → 들어오는 관으로 혈액이 들어온다
    body += atH(2, 3, 'fin', solid(150, 220, 104, 220, C.red, 4) + solid(350, 220, 396, 220, C.red, 4), 0.2);
    body += shown(2, dots(IN, C.red, 12, 40));
    // 칸 4: '펌프 작용'
    body += ring(HC[0], HC[1], 90, 4, C.red, 0.1);
    body += at(4, 'pop', tag(500, 230, '펌프 작용', BLOOD, { size: 22 }), 0.6);
    put('5-1/과학/4/펌프 작용', svg(id, body, css));
  })();
})(typeof window !== 'undefined' ? window : globalThis);
