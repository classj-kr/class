// 수학 4-1 2단원 각도: 낱말 도식
// 각은 한 점에서 그은 두 반직선으로 이루어진 도형(교과서 정의), 각의 크기는 두 변이 벌어진 정도,
// 직각을 똑같이 90으로 나눈 하나가 1°. 각도기는 중심을 꼭짓점에, 밑금을 한 변에 맞추고 다른 변이 지나는 눈금을 읽는다.
// 각 색 약속(4-2 와 같게): 예각 파랑, 직각 빨강, 둔각 초록.
// 부채꼴은 굵은 테두리 동그라미를 stroke-dashoffset 으로 열고 닫는다. 움직임은 transform·opacity·stroke-dashoffset 만(아이패드 사파리).
(function (root) {
  'use strict';
  const { C, svg, text, arrow, put } = root.FigureKit;
  const f = (n) => +(+n).toFixed(2);
  const dl = (s, more = '') => `style="animation-delay:${s}s;transition-delay:${s}s;${more}"`;
  const T = (x, y, s, o = {}) => text(f(x), f(y), s, o);
  const rad = (d) => d * Math.PI / 180;
  // 꼭짓점 O 에서 각 a(도, 시계 반대 방향, 오른쪽이 0) 쪽으로 r 만큼 간 점
  const pt = (O, a, r) => [O[0] + r * Math.cos(rad(a)), O[1] - r * Math.sin(rad(a))];

  const motion = (id) => {
    let css = `
    .sc-${id} :is(.s1,.s2,.s3,.s4,.p1,.p2,.p3,.p4,.q1,.q2,.q3,.q4){opacity:0}
    .sc-${id} :is(.p1,.p2,.p3,.p4,.ring){transform-box:fill-box;transform-origin:center}
    .sc-${id} .dr{stroke-dasharray:100 110;stroke-dashoffset:101;transition:stroke-dashoffset .7s ease-in-out}
    .sc-${id} :is(.m1,.m2,.m3,.m4){transition:transform .9s ease-in-out}
    .sc-${id} :is(.g1,.g2,.g3,.g4){transition:opacity .35s linear}
    .sc-${id} .ring{opacity:0}
    @keyframes ${id}-in{from{opacity:0}to{opacity:1}}
    @keyframes ${id}-pop{0%{opacity:0;transform:scale(0)}70%{opacity:1;transform:scale(1.15)}100%{opacity:1;transform:none}}
    @keyframes ${id}-ring{0%{opacity:.9;transform:scale(1)}100%{opacity:0;transform:scale(2.2)}}
    @keyframes ${id}-blink{0%,50%,100%{opacity:1}25%,75%{opacity:.2}}
    @keyframes ${id}-peek{0%,100%{opacity:0}15%,80%{opacity:1}}`;
    for (let n = 1; n <= 4; n++) css += `
    .on${n} .sc-${id} .s${n}{animation:${id}-in .4s ease-out both}
    .on${n} .sc-${id} .p${n}{animation:${id}-pop .5s ease-out both}
    .on${n} .sc-${id} .d${n}{stroke-dashoffset:0}
    .on${n} .sc-${id} .r${n}{animation:${id}-ring 1.1s ease-out 2 both}
    .on${n} .sc-${id} .k${n}{animation:${id}-blink 1.4s ease-in-out both}
    .on${n} .sc-${id} .q${n}{animation:${id}-peek 1.2s ease-in-out both}
    .on${n} .sc-${id} .m${n}{transform:translate(var(--mx,0px),var(--my,0px))}
    .on${n} .sc-${id} .g${n}{opacity:0}`;
    return css;
  };
  const ring = (cx, cy, r, color, cls, d = 0) => `<circle class="ring ${cls}" ${dl(d)} cx="${f(cx)}" cy="${f(cy)}" r="${r}" fill="none" stroke="${color}" stroke-width="4"/>`;
  const tag = (x, y, s, color, cls, d = 0, size = 24, anchor = 'middle') => `<g class="${cls}" ${dl(d)}>${T(x, y, s, { size, color, anchor })}</g>`;
  const pill = (cx, cy, w, s, color, fill, size = 24) => `<rect x="${f(cx - w / 2)}" y="${f(cy - 21)}" width="${w}" height="42" rx="21" fill="${fill}" stroke="${color}" stroke-width="2.5"/>${T(cx, cy + size * .36, s, { size, color })}`;
  const seg = (A, B, color = C.ink, w = 5, more = '') => `<path ${more} d="M${f(A[0])} ${f(A[1])} L${f(B[0])} ${f(B[1])}" stroke="${color}" stroke-width="${w}" stroke-linecap="round" fill="none"/>`;
  const dot = (P, color = C.ink, r = 7) => `<circle cx="${f(P[0])}" cy="${f(P[1])}" r="${r}" fill="${color}"/>`;
  // 꼭짓점 O, 두 변 방향 a0 < a1 사이의 부채꼴(정지 그림)
  const wedge = (O, a0, a1, r, color, op = .35) => {
    const p = pt(O, a0, r), q = pt(O, a1, r);
    return `<path d="M${f(O[0])} ${f(O[1])} L${f(p[0])} ${f(p[1])} A${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 0 ${f(q[0])} ${f(q[1])} Z" fill="${color}" fill-opacity="${op}" stroke="${color}" stroke-width="2"/>`;
  };
  // 직각 표시(네모): O 에서 a 방향과 a+90 방향
  const square = (O, a, s, color = C.red) => {
    const p = pt(O, a, s), q = pt(O, a + 90, s), m = [p[0] + q[0] - O[0], p[1] + q[1] - O[1]];
    return `<path d="M${f(p[0])} ${f(p[1])} L${f(m[0])} ${f(m[1])} L${f(q[0])} ${f(q[1])}" fill="none" stroke="${color}" stroke-width="3"/>`;
  };
  // 움직이는 부채꼴: 굵은 테두리 동그라미, 오른쪽(0°)부터 시계 반대 방향으로 a° 만큼 열린다. len(a) 를 dashoffset 에 쓴다.
  const PR = 55, CIRC = 2 * Math.PI * PR;
  const pieOff = (a) => f(CIRC - PR * rad(a));
  const pie = (O, cls, color, op = .4) => `<g transform="translate(${O[0]} ${O[1]}) scale(1 -1)"><circle class="${cls}" r="${PR}" fill="none" stroke="${color}" stroke-width="${2 * PR}" stroke-opacity="${op}" stroke-dasharray="${f(CIRC)} ${f(CIRC)}" stroke-dashoffset="${f(CIRC)}"/></g>`;
  // 각도기: 중심 O, 반지름 R. 바깥 눈금은 왼쪽이 0, 안쪽 눈금은 오른쪽이 0. labels: 몇 도마다 수를 쓸지
  function protractor(O, R, { every = 30, inner = true } = {}) {
    let ticks = '';
    for (let a = 0; a <= 180; a += 5) {
      const long = a % 10 === 0, p = pt(O, a, R), q = pt(O, a, R - (a % 30 === 0 ? 20 : long ? 13 : 7));
      ticks += `M${f(p[0])} ${f(p[1])} L${f(q[0])} ${f(q[1])} `;
    }
    let labels = '';
    for (let a = 0; a <= 180; a += every) {
      const end = a % 180 === 0, po = pt(O, a, R - (end ? 26 : 34)), pi = pt(O, a, R - (end ? 76 : 62)), up = end ? -6 : 7;
      po[1] += up; pi[1] += up;
      labels += T(po[0], po[1], 180 - a, { size: 18, color: C.blue, weight: 600 });
      if (inner) labels += T(pi[0], pi[1], a, { size: 18, color: C.orange, weight: 600 });
    }
    return `<path d="M${O[0] - R} ${O[1]} A${R} ${R} 0 0 1 ${O[0] + R} ${O[1]} Z" fill="${C.sky}" fill-opacity=".6" stroke="${C.blue}" stroke-width="2.5"/>`
      + `<path d="${ticks}" stroke="${C.blue}" stroke-width="2"/>` + labels
      + `<path class="base" d="M${O[0] - R + 6} ${O[1]} H${O[0] + R - 6}" stroke="${C.blue}" stroke-width="3"/>`
      + `<path d="M${O[0]} ${O[1] - 16} V${O[1]}" stroke="${C.blue}" stroke-width="3"/><circle cx="${O[0]}" cy="${O[1]}" r="5" fill="white" stroke="${C.blue}" stroke-width="2.5"/>`;
  }

  // 각 ㄱㄴㄷ 그림 바탕: 꼭짓점 O, 두 변 방향 a(ㄷ 쪽) b(ㄱ 쪽), 길이 L
  const names = (O, a, b, r) => {
    const A = pt(O, b, r), Cc = pt(O, a, r);
    return { A, Cc };
  };

  // 각: 점 ㄴ 에서 반직선 ㄴㄷ → 같은 점에서 반직선 ㄴㄱ → 둘이 이룬 도형이 각 ㄱㄴㄷ
  (function () {
    const id = 't41-m2-gak', O = [170, 280], a = 0, b = 48, L = 400;
    const { A, Cc } = names(O, a, b, 250);
    const E1 = pt(O, a, L), E2 = pt(O, b, 340);
    const body = `<g class="s3" ${dl(.1)}>${wedge(O, a, b, 70, C.blue)}</g>`
      + `<path class="dr d1" pathLength="100" ${dl(.4)} d="M${O[0]} ${O[1]} L${f(E1[0])} ${f(E1[1])}" stroke="${C.ink}" stroke-width="5" stroke-linecap="round"/>`
      + `<path class="dr d2" pathLength="100" ${dl(.3)} d="M${O[0]} ${O[1]} L${f(E2[0])} ${f(E2[1])}" stroke="${C.ink}" stroke-width="5" stroke-linecap="round"/>`
      + `<g class="p1" ${dl(.1)}>${dot(O, C.orange, 9)}${T(O[0] - 4, O[1] + 40, 'ㄴ', { size: 26 })}</g>`
      + `<g class="p1" ${dl(.9)}>${dot(Cc)}${T(Cc[0], Cc[1] + 40, 'ㄷ', { size: 26 })}</g>`
      + `<g class="p2" ${dl(.9)}>${dot(A)}${T(A[0] - 28, A[1] - 10, 'ㄱ', { size: 26 })}</g>`
      + `<g class="h3">${tag(520, 330, '반직선 ㄴㄷ', C.muted, 's1', 1.2, 22)}${tag(470, 60, '반직선 ㄴㄱ', C.muted, 's2', 1.2, 22)}</g>`
      + ring(O[0], O[1], 18, C.orange, 'r2', .1)
      + `<g class="p3" ${dl(.6)}>${pill(520, 150, 140, '각 ㄱㄴㄷ', C.blue, C.sky, 26)}</g>`;
    put('4-1/수학/2/각', svg(id, body, motion(id)));
  })();

  // 꼭짓점: 각 ㄱㄴㄷ → 두 변을 따라 점이 미끄러져 와서 점 ㄴ 에서 만남 → 꼭짓점
  (function () {
    const id = 't41-m2-kkok', O = [250, 290], a = 8, b = 70;
    const { A, Cc } = names(O, a, b, 210);
    const E1 = pt(O, a, 340), E2 = pt(O, b, 270), S1 = pt(O, a, 320), S2 = pt(O, b, 250);
    const slide = (S, color, d) => `<g class="glide" ${dl(d, `--gx:${f(S[0] - O[0])}px;--gy:${f(S[1] - O[1])}px`)}>${dot(O, color, 11)}</g>`;
    const lab1 = pt(O, a, 160), lab2 = pt(O, b, 140);
    const body = seg(O, E1) + seg(O, E2)
      + dot(O) + dot(A) + dot(Cc)
      + T(A[0] - 30, A[1] + 4, 'ㄱ', { size: 26 }) + T(Cc[0], Cc[1] + 40, 'ㄷ', { size: 26 }) + T(O[0] - 6, O[1] + 42, 'ㄴ', { size: 26 })
      + tag(lab1[0], lab1[1] + 36, '변', C.muted, 's1', .3, 22) + tag(lab2[0] - 30, lab2[1], '변', C.muted, 's1', .5, 22)
      + `<g class="b2">${slide(S1, C.blue, .2)}${slide(S2, C.blue, .2)}</g>`
      + ring(O[0], O[1], 20, C.orange, 'r2', 1.5) + ring(O[0], O[1], 20, C.orange, 'r3', .2)
      + `<g class="s3" ${dl(.6)}>${arrow(130, 210, O[0] - 22, O[1] - 18, C.orange)}${T(110, 196, '꼭짓점', { size: 28, color: C.orange })}</g>`
      + `<g class="p3" ${dl(.3)}>${dot(O, C.orange, 11)}</g>`;
    put('4-1/수학/2/꼭짓점', svg(id, body, motion(id) + `
      .sc-${id} .glide{transform:translate(var(--gx),var(--gy))}
      .on2 .sc-${id} .glide{animation:${id}-glide 1.3s ease-in-out .2s both}
      .on3 .sc-${id} .glide{animation:none;opacity:0}
      @keyframes ${id}-glide{from{transform:translate(var(--gx),var(--gy))}to{transform:none}}`));
  })();

  // 변: 각 ㄱㄴㄷ → 꼭짓점에서 ㄱ 쪽 반직선이 변 ㄴㄱ → ㄷ 쪽 반직선이 변 ㄴㄷ
  (function () {
    const id = 't41-m2-byeon', O = [180, 290], a = 0, b = 52;
    const { A, Cc } = names(O, a, b, 230);
    const E1 = pt(O, a, 400), E2 = pt(O, b, 320);
    const l2 = pt(O, b, 200), l1 = pt(O, a, 300);
    const body = seg(O, E1) + seg(O, E2)
      + `<path class="dr d2" pathLength="100" ${dl(.2)} d="M${O[0]} ${O[1]} L${f(E2[0])} ${f(E2[1])}" stroke="${C.orange}" stroke-width="11" stroke-linecap="round" stroke-opacity=".75"/>`
      + `<path class="dr d3" pathLength="100" ${dl(.2)} d="M${O[0]} ${O[1]} L${f(E1[0])} ${f(E1[1])}" stroke="${C.blue}" stroke-width="11" stroke-linecap="round" stroke-opacity=".75"/>`
      + dot(O) + dot(A) + dot(Cc)
      + T(A[0] - 30, A[1] + 2, 'ㄱ', { size: 26 }) + T(Cc[0], Cc[1] + 40, 'ㄷ', { size: 26 }) + T(O[0] - 6, O[1] + 42, 'ㄴ', { size: 26 })
      + `<g class="s1" ${dl(.4)}>${T(O[0] - 60, O[1] - 10, '꼭짓점', { size: 20, color: C.muted })}</g>` + ring(O[0], O[1], 16, C.muted, 'r1', .3)
      + `<g class="p2" ${dl(.9)}>${pill(l2[0] - 100, l2[1] - 10, 110, '변 ㄴㄱ', C.orange, C.peach, 24)}</g>`
      + `<g class="p3" ${dl(.9)}>${pill(l1[0], l1[1] - 42, 110, '변 ㄴㄷ', C.blue, C.sky, 24)}</g>`;
    put('4-1/수학/2/변', svg(id, body, motion(id)));
  })();

  // 직각: 동그란 종이를 반듯하게 반으로 접고 → 한 번 더 접으면 모서리 → 펼치면 접은 선이 만나 직각 4개, 90°
  (function () {
    const id = 't41-m2-jikgak', O = [300, 186], R = 128;
    const q = (a0) => wedgePaper(O, a0, R);
    const body = `<g class="s3" ${dl(1.6)}>${seg([O[0] - R - 14, O[1]], [O[0] + R + 14, O[1]], C.muted, 2.5, 'stroke-dasharray="8 6"')}${seg([O[0], O[1] - R - 14], [O[0], O[1] + R + 14], C.muted, 2.5, 'stroke-dasharray="8 6"')}</g>`
      + q(0) + `<g class="fb">${q(270)}</g>`
      + `<g class="fl">${q(90)}<g class="fb">${q(180)}</g></g>`
      + `<g class="s2" ${dl(1.9)}><g class="h3">${square(O, 0, 24)}</g></g>`
      + ring(O[0], O[1], 18, C.red, 'r2', 2)
      + `<g class="s3" ${dl(1.8)}>${square(O, 0, 24)}${square(O, 90, 24)}${square(O, 180, 24)}${square(O, 270, 24)}</g>`
      + `<g class="p3" ${dl(2)}>${T(O[0] + 46, O[1] - 32, '90°', { size: 24, color: C.red })}${pill(540, 186, 96, '직각', C.red, C.peach, 28)}</g>`;
    put('4-1/수학/2/직각', svg(id, body, motion(id) + `
      .sc-${id} .fb{transform-box:view-box;transform-origin:0 ${O[1]}px;transition:transform 1s ease-in-out .2s}
      .sc-${id} .fl{transform-box:view-box;transform-origin:${O[0]}px 0;transition:transform 1s ease-in-out .2s}
      .on1 .sc-${id} .fb{transform:scaleY(-1)}
      .on2 .sc-${id} .fl{transform:scaleX(-1)}
      .on3 .sc-${id} .fl{transform:none;transition-delay:.1s}
      .on3 .sc-${id} .fb{transform:none;transition-delay:.9s}`));
  })();
  function wedgePaper(O, a0, R) {
    const p = pt(O, a0, R), q = pt(O, a0 + 90, R);
    return `<path d="M${O[0]} ${O[1]} L${f(p[0])} ${f(p[1])} A${R} ${R} 0 0 0 ${f(q[0])} ${f(q[1])} Z" fill="${C.peach}" fill-opacity=".8" stroke="${C.orange}" stroke-width="2.5" stroke-linejoin="round"/>`;
  }

  // 각도: 두 변이 벌어지며 각이 커짐 → 직각을 90으로 똑같이 나눈 하나가 1° → 30°, 60° 처럼 수로 나타냄
  (function () {
    const id = 't41-m2-gakdo', O = [150, 300], R = 280;
    let fan = '';
    for (let a = 0; a <= 90; a++) {
      const p = pt(O, a, 236), q = pt(O, a, a % 10 === 0 ? 216 : a % 5 === 0 ? 224 : 229);
      fan += `M${f(p[0])} ${f(p[1])} L${f(q[0])} ${f(q[1])} `;
    }
    const band = (a0, a1, r0, r1) => [pt(O, a0, r0), pt(O, a0, r1), pt(O, a1, r1), pt(O, a1, r0)].map((p) => `${f(p[0])},${f(p[1])}`).join(' ');
    const one = `<polygon points="${band(40, 41, 206, 246)}" fill="${C.orange}" stroke="${C.orange}" stroke-width="1.5" stroke-linejoin="round"/>`;
    const oneTip = pt(O, 40.5, 250);
    const l30 = pt(O, 15, 132), l60 = pt(O, 30, 140), l90 = pt(O, 90, 262);
    const body = pie(O, 'pa', C.blue, .35)
      + `<path class="dr d2" pathLength="100" ${dl(.4)} d="${fan}" stroke="${C.muted}" stroke-width="1.6"/>`
      + `<g class="s2" ${dl(1.2)}>${seg(O, pt(O, 90, 250), C.red, 3, 'stroke-dasharray="10 8"')}${square(O, 0, 26)}${T(l90[0] + 34, l90[1] + 4, '90°', { size: 22, color: C.red })}</g>`
      + `<g class="h3"><g class="s2" ${dl(1.5)}>${one}${arrow(oneTip[0] + 70, oneTip[1] + 20, oneTip[0] + 8, oneTip[1] + 2, C.orange)}${T(oneTip[0] + 96, oneTip[1] + 32, '1°', { size: 30, color: C.orange })}</g></g>`
      + seg(O, pt(O, 0, R))
      + `<g class="ray">${seg(O, pt(O, 0, R))}</g>`
      + dot(O, C.ink, 7)
      + `<g class="q3" ${dl(.3)}>${T(l30[0] + 70, l30[1] + 10, '30°', { size: 28, color: C.blue })}</g>`
      + `<g class="s3" ${dl(1.6)}>${T(l60[0] + 60, l60[1] + 10, '60°', { size: 28, color: C.blue })}</g>`
      + `<g class="p3" ${dl(1.8)}>${pill(520, 120, 96, '각도', C.blue, C.sky, 28)}</g>`;
    put('4-1/수학/2/각도', svg(id, body, motion(id) + `
      .sc-${id} .ray{transform-box:view-box;transform-origin:${O[0]}px ${O[1]}px;transform:rotate(-15deg)}
      .sc-${id} .pa{stroke-dashoffset:${pieOff(15)}}
      .on1 .sc-${id} .ray{animation:${id}-r1 1.6s ease-in-out .3s both}
      .on1 .sc-${id} .pa{animation:${id}-p1 1.6s ease-in-out .3s both}
      .on2 .sc-${id} .ray{animation:${id}-r2 1s ease-in-out .2s both}
      .on2 .sc-${id} .pa{animation:${id}-p2 1s ease-in-out .2s both}
      .on3 .sc-${id} .ray{animation:${id}-r3 1.8s ease-in-out .2s both}
      .on3 .sc-${id} .pa{animation:${id}-p3 1.8s ease-in-out .2s both}
      @keyframes ${id}-r1{from{transform:rotate(-15deg)}to{transform:rotate(-55deg)}}
      @keyframes ${id}-p1{from{stroke-dashoffset:${pieOff(15)}}to{stroke-dashoffset:${pieOff(55)}}}
      @keyframes ${id}-r2{from{transform:rotate(-55deg)}to{transform:rotate(-90deg)}}
      @keyframes ${id}-p2{from{stroke-dashoffset:${pieOff(55)}}to{stroke-dashoffset:${pieOff(90)}}}
      @keyframes ${id}-r3{0%{transform:rotate(-90deg)}30%,55%{transform:rotate(-30deg)}85%,100%{transform:rotate(-60deg)}}
      @keyframes ${id}-p3{0%{stroke-dashoffset:${pieOff(90)}}30%,55%{stroke-dashoffset:${pieOff(30)}}85%,100%{stroke-dashoffset:${pieOff(60)}}}`));
  })();

  // 각도기: 반원 모양에 0~180 눈금 → 중심을 꼭짓점에, 밑금을 한 변에 맞춤 → 다른 변이 지나는 안쪽 눈금 60 을 읽음
  (function () {
    const id = 't41-m2-gakdogi', O = [320, 306], R = 210, ang = 60;
    const E2 = pt(O, ang, 300), lab = pt(O, ang, R - 62);
    const body = `<g class="s2" ${dl(.6)}>${seg(O, [O[0] + 300, O[1]])}${seg(O, E2)}${dot(O, C.ink, 7)}</g>`
      + `<g class="s3" ${dl(1)}>${seg(O, E2, C.orange, 6)}</g>`
      + `<g class="pro">${protractor(O, R)}</g>`
      + ring(O[0] - R + 26, O[1] - 12, 18, C.blue, 'r1', 1) + ring(O[0] + R - 76, O[1] - 12, 18, C.orange, 'r1', 1)
      + `<g class="s2" ${dl(1.6)}>${seg([O[0] - R + 6, O[1]], [O[0] + R - 6, O[1]], C.orange, 5)}</g>`
      + ring(O[0], O[1], 14, C.orange, 'r2', 1.6)
      + `<g class="s2" ${dl(1.7)}>${T(O[0] - 140, O[1] + 40, '밑금', { size: 22, color: C.orange })}${T(O[0], O[1] + 40, '중심', { size: 22, color: C.orange })}</g>`
      + `<path class="dr d3" pathLength="100" ${dl(.2)} d="M${O[0] + 90} ${O[1]} A90 90 0 0 0 ${f(pt(O, ang, 90)[0])} ${f(pt(O, ang, 90)[1])}" fill="none" stroke="${C.orange}" stroke-width="5"/>`
      + ring(lab[0], lab[1], 20, C.orange, 'r3', .8)
      + `<g class="s3" ${dl(1)}>${T(E2[0] + 44, E2[1] + 30, '60°', { size: 30, color: C.orange })}</g>`
      + `<g class="p3" ${dl(1.4)}>${pill(110, 70, 120, '각도기', C.blue, C.sky, 26)}</g>`;
    put('4-1/수학/2/각도기', svg(id, body, motion(id) + `
      .sc-${id} .pro{transform-box:view-box;transform-origin:${O[0]}px ${O[1]}px}
      .on2 .sc-${id} .pro{animation:${id}-place 1.6s ease-in-out .1s both}
      @keyframes ${id}-place{0%{transform:none}35%,55%{transform:translate(-70px,-40px) rotate(-14deg)}100%{transform:none}}`));
  })();

  // 예각·둔각: 한 변이 0°에서 90°까지 열려 직각(빨강) → 직각보다 덜/더 벌어짐 → 그 범위 안에서 열렸다 닫혔다
  // 부채꼴은 빨강·파랑(초록) 두 겹을 같이 움직이고, 겹 사이를 opacity 로 바꾼다.
  function angleFig(id, key, O, R, a2, lo, hi, color, pieColor, name, namePos, ninetyX, more = '') {
    const v = pt(O, a2 / 2, 150);
    const body = more
      + pie(O, 'pr', C.red, .4) + pie(O, 'pc', pieColor, .45)
      + `<g class="s1" ${dl(1.5)}>${seg(O, pt(O, 90, R), C.red, 3, 'stroke-dasharray="10 8"')}${square(O, 0, 26)}${T(ninetyX, O[1] - R + 30, '90°', { size: 22, color: C.red })}</g>`
      + seg(O, pt(O, 0, R))
      + `<g class="ray">${seg(O, pt(O, 0, R))}</g>`
      + dot(O)
      + `<g class="h3"><g class="s2" ${dl(1.5)}>${T(v[0], v[1] + 8, `${a2}°`, { size: 24, color })}</g></g>`
      + `<g class="s2" ${dl(1.7)}>${T(namePos[0], namePos[1], name, { size: 36, color })}</g>`;
    const css = `
      .sc-${id} .ray{transform-box:view-box;transform-origin:${O[0]}px ${O[1]}px}
      .sc-${id} .pc{opacity:0}
      .on1 .sc-${id} .ray{animation:${id}-r1 1.2s ease-in-out .3s both}
      .on1 .sc-${id} .pr{animation:${id}-p1 1.2s ease-in-out .3s both}
      .on2 .sc-${id} .ray{animation:${id}-r2 1.2s ease-in-out .3s both}
      .on2 .sc-${id} .pr{animation:${id}-p2r 1.2s ease-in-out .3s both}
      .on2 .sc-${id} .pc{animation:${id}-p2c 1.2s ease-in-out .3s both}
      .on3 .sc-${id} .ray{animation:${id}-r3 3.6s ease-in-out .2s infinite}
      .on3 .sc-${id} .pr{animation:none;opacity:0}
      .on3 .sc-${id} .pc{animation:${id}-p3 3.6s ease-in-out .2s infinite}
      @keyframes ${id}-r1{from{transform:rotate(0deg)}to{transform:rotate(-90deg)}}
      @keyframes ${id}-p1{from{stroke-dashoffset:${pieOff(0)}}to{stroke-dashoffset:${pieOff(90)}}}
      @keyframes ${id}-r2{from{transform:rotate(-90deg)}to{transform:rotate(${-a2}deg)}}
      @keyframes ${id}-p2r{from{stroke-dashoffset:${pieOff(90)};opacity:1}40%{opacity:0}to{stroke-dashoffset:${pieOff(a2)};opacity:0}}
      @keyframes ${id}-p2c{from{stroke-dashoffset:${pieOff(90)};opacity:0}40%{opacity:1}to{stroke-dashoffset:${pieOff(a2)};opacity:1}}
      @keyframes ${id}-r3{0%,100%{transform:rotate(${-a2}deg)}25%{transform:rotate(${-lo}deg)}75%{transform:rotate(${-hi}deg)}}
      @keyframes ${id}-p3{0%,100%{opacity:1;stroke-dashoffset:${pieOff(a2)}}25%{opacity:1;stroke-dashoffset:${pieOff(lo)}}75%{opacity:1;stroke-dashoffset:${pieOff(hi)}}}`;
    put(`4-1/수학/2/${key}`, svg(id, body, motion(id) + css));
  }
  angleFig('t41-m2-yegak', '예각', [150, 300], 260, 50, 12, 80, C.blue, C.blue, '예각', [480, 130], 116);
  angleFig('t41-m2-dungak', '둔각', [320, 290], 250, 130, 100, 170, C.green, '#2e9b57', '둔각', [520, 120], 352,
    `<g class="s3" ${dl(.2)}>${seg([320, 290], [56, 290], C.muted, 3, 'stroke-dasharray="4 8"')}${T(86, 326, '180°', { size: 22, color: C.muted })}</g>`);

  // 어림: 직각보다 조금 작은 각 → 직각의 반(45°)쯤이라 약 45° 로 어림 → 각도기로 재면 50°, 어림한 각도와 견줌
  (function () {
    const id = 't41-m2-eorim', O = [200, 310], R = 170, ang = 50;
    const E2 = pt(O, ang, 300), b = pt(O, 45, 236), bl = pt(O, 36, 250);
    const body = `<g class="s1" ${dl(.9)}>${seg(O, pt(O, 90, 260), C.red, 3, 'stroke-dasharray="10 8"')}${square(O, 0, 24)}${T(O[0] - 34, O[1] - 236, '90°', { size: 22, color: C.red })}</g>`
      + `<g class="pro">${protractor(O, R, { every: 30, inner: true })}</g>`
      + seg(O, [O[0] + 380, O[1]])
      + `<path class="dr d1" pathLength="100" ${dl(.2)} d="M${O[0]} ${O[1]} L${f(E2[0])} ${f(E2[1])}" stroke="${C.ink}" stroke-width="5" stroke-linecap="round"/>`
      + dot(O)
      + `<path class="dr d2" pathLength="100" ${dl(.2)} d="M${O[0]} ${O[1]} L${f(b[0])} ${f(b[1])}" stroke="${C.purple}" stroke-width="3.5" stroke-dasharray="9 7" style="transition-delay:.2s"/>`
      + `<g class="s2" ${dl(1)}>${T(bl[0], bl[1] + 8, '약 45°', { size: 24, color: C.purple })}</g>`
      + `<path class="dr d3" pathLength="100" ${dl(1.3)} d="M${O[0] + 80} ${O[1]} A80 80 0 0 0 ${f(pt(O, ang, 80)[0])} ${f(pt(O, ang, 80)[1])}" fill="none" stroke="${C.orange}" stroke-width="5"/>`
      + `<g class="s2" ${dl(1.2)}><rect x="448" y="60" width="176" height="76" rx="12" fill="white" stroke="${C.purple}" stroke-width="2.5"/>${T(536, 88, '어림한 각도', { size: 19, color: C.muted })}${T(536, 122, '약 45°', { size: 28, color: C.purple })}</g>`
      + `<g class="s3" ${dl(1.6)}><rect x="448" y="150" width="176" height="76" rx="12" fill="white" stroke="${C.orange}" stroke-width="2.5"/>${T(536, 178, '잰 각도', { size: 19, color: C.muted })}${T(536, 212, '50°', { size: 28, color: C.orange })}</g>`
      + ring(536, 112, 34, C.purple, 'r3', 2) + ring(536, 202, 34, C.orange, 'r3', 2);
    put('4-1/수학/2/어림', svg(id, body, motion(id) + `
      .sc-${id} .pro{opacity:0;transform-box:view-box;transform-origin:${O[0]}px ${O[1]}px}
      .on3 .sc-${id} .pro{animation:${id}-place 1.2s ease-out .1s both}
      @keyframes ${id}-place{0%{opacity:0;transform:translate(-60px,-50px) rotate(-12deg)}30%{opacity:1}100%{opacity:1;transform:none}}`));
  })();
})(typeof window !== 'undefined' ? window : globalThis);
