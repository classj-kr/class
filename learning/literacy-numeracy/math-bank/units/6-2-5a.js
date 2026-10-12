// 6학년 2학기 5단원 원의 넓이 — 단원 틀, 그림 도구, 기본 문항(원주와 지름의 관계, 원주율, 원주와 지름 구하기, 굴러간 거리).
// 수집해 둔 교과서 9종의 평가 자료에서 뽑은 문제 꼴 목록(기본꼴 1~3: 60·68·64꼴, 심화꼴 71꼴)을 번호마다 따져서 실었다.
// 꼴마다 「실음(유형 이름) / 뺌(까닭)」을 가른 대조표는 references/textbooks/수학/_분석/6-2-5/싣기_대조표.md 에 있다.
// (원의 넓이 어림하기·원의 넓이 구하기·여러 가지 원의 넓이의 기본 문항은 6-2-5b.js, 실력 문항은 6-2-5c.js 에 있다.)
// ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2, ③n = 기본꼴_3, 심n = 심화꼴.
//
// 영역: 도형과 측정 가운데 측정. 원주·지름·넓이를 셈하는 것이 이 단원의 일이다.
//   6수03-15 원주와 지름을 재어 원주율이 일정한 값임을 알고 그 근삿값을 쓴다 / 6수03-16 원주와 원의 넓이를 구하는 방법을 이해하고 구한다
//
// 싣는 기준
//  - 주는 것(지름·반지름·원주·넓이, 문장·그림·표), 묻는 것(원주율, 원주, 지름, 반지름, 넓이, 견주기, 방법), 셈의 구조가 다르면 다른 문제다.
//    수만 다르거나 물건 이름만 다른 것은 한 번만 싣는다.
//  - 기본에는 공식을 한 번 대는 것, 한 번 거꾸로 구하는 것, 거기에 지름과 반지름을 바꾸거나 바퀴 수·조각 수를 한 번 곱하고 나누는 것까지 싣는다
//    (반지름 → 원주, 지름 → 넓이, 원주 × 바퀴 수, 원의 반·4분의 1). 길을 스스로 세워 세 단계로 푸는 것(원주 → 넓이, 색칠한 부분의 넓이,
//    굴러간 거리에서 지름)과 뜻을 정확히 대야 풀리는 것은 실력에 싣는다.
//  - 교육과정 「원주율, 원주, 원의 넓이를 구할 때 복잡한 계산은 계산기를 사용하게 한다」: 지름·반지름은 한두 자리 자연수로 주고(크기 비교의 반지름만 0.5 cm 단위일 수 있다)
//    답은 소수 둘째 자리 안에서 떨어진다(반올림 문항 pi-round 의 3.142만 셋째 자리).
//    문항마다 원주율을 얼마로 셈하는지 밝힌다(3.14가 바탕이고 3.1과 3을 쓰는 문항을 조금 섞었다). 셈이 없는 문항에는 적지 않는다.
//  - 소수는 100배 한 자연수로 셈한 뒤 글로 바꾼다(자바스크립트에서 3.14 × 5 는 15.7 이 아닐 수 있다). 답이 소수인 유형과 자연수인 유형은 정해져 있다.
//  - 그림은 적힌 대로 그린다: 원은 참 원이고 지름은 중심을 지나며, 원과 정사각형·정육각형이 맞닿는 자리는 좌표로 셈한다. 그림 속 수는 그림 설명(aria-label)에도 적는다.
//  - 서술형·작도는 싣지 않는다. 고르기나 수 답으로 바꿀 수 있는 것은 바꾸었다(지름과 원주 표시하기 → 굵은 선이 원주인 그림 고르기,
//    자 위에 굴린 자리에 표시하기 → 화살표 고르기, 잘못된 문장 고쳐 쓰기 → 옳지 않은 설명 고르기).
//
// 뺀 것과 까닭(6-2-5b.js, 6-2-5c.js 의 것까지 여기에 모아 적는다)
//  - 부채꼴(중학교 1학년): 원의 반·4분의 1이 아닌 조각의 넓이와 둘레 — 10조각·16조각으로 나눈 한 조각(①54), 원의 4분의 3(심51·68), 정삼각형의 꼭짓점에 그린 60°짜리 조각(③64)
//  - 비례·반비례로 푸는 것: 앞바퀴와 뒷바퀴의 바퀴 수(③30 심28)
//  - 곧은 부분과 굽은 부분을 하나씩 가려 더하는 경우 따지기: 색칠한 부분의 둘레(①32 ②60~62·64 ③51 심67), 끈으로 묶은 통(②63 심69), 원 4개로 만든 도형의 둘레(심68),
//    트랙의 안쪽 선과 바깥쪽 선(심70). 반원·원의 4분의 1·운동장 모양처럼 곧은 변이 한눈에 보이는 둘레만 실력에 실었다.
//  - 간격(②27·45), 조건을 잇달아 거꾸로 푸는 것(②65 ③57 심45·46·65·71, 원의 넓이에서 정사각형의 한 변을 찾는 심53의 변형)
//  - 넓이에서 반지름을 거쳐 원주까지 가는 것(②47 심40, ①48의 변형): 넓이 → 반지름은 같은 수를 두 번 곱해 25·36·49·64·100이 되는 수만 실력에 한 유형으로 실었다.
//  - 셈이 네 단계를 넘는 것: 반원끼리 더하고 빼기(①55 ②60 ③62 심60), 큰 원에서 작은 원 둘 빼기(심59), 색칠한 두 부분의 넓이 견주기(③56),
//    지름을 늘린 원과 처음 원의 넓이의 차(③47의 대표), 원주가 낀 넓이의 차례(①44·②48·③45·심41의 변형), 잎·꽃잎 모양(①60 심57·58)
//  - 뜻 없는 셈(두 값을 따로 구해 더하거나 빼기만 하는 것): 두 원의 원주·지름·반지름의 합과 차(①26 ②31 ③19·26 심19·21·27), 두 원의 넓이의 합과 차(①45 ②50 ③44 심43),
//    가로와 세로의 합(심35의 대표), 여러 셈 결과의 크기 견주기(③11의 변형, 심12), 답을 모두 더하거나 곱하는 놀이(③24의 변형), 같은 원 여러 개의 넓이(심37),
//    마름모와 원의 둘레 견주기(심18 — 다른 도형과 원을 견주는 일은 같은 길이의 끈으로 만든 원과 정사각형으로 실력에 실었다)
//  - 답에 원이 쓰이지 않는 옮겨 붙이기(②58 ③55의 직사각형, 심62): 옮기고 나면 직사각형·삼각형의 넓이(5-1)이다. 반원 둘을 모아 원 하나로 보는 것은 실었다.
//  - 작도(①3 ②2 ③2, 수직선에 나타내기), 서술형(①16 ②18·38 심10, 알게 된 것·까닭 쓰기), 재어 보는 활동과 놀이(②67)
//  - 수집본에 그림이 없어 얼개를 알 수 없는 것(①59 ②66 ③58, ①31·②30·③18의 그림 속 수): 지어내지 않았다.
// 묻는 말: 수나 값은 「~은?/~는?」, 양은 「몇 ~인가?」. 수와 단위 기호는 띄어 쓴다(31.4 cm, 78.5 cm²).
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, N, M, C, D, LABELS, lines, table } = B.kit;
  const G = B.kit.geo;
  const RATIO = '6수03-15', FIND = '6수03-16';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  const TAGS = ['가', '나', '다', '라'], THREE = LABELS.slice(0, 3);
  const ORDERS = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];
  const SIGNS = ['&gt;', '=', '&lt;'];

  // ── 수 ──────────────────────────────────────────────────────
  // 소수는 100배 한 자연수로 셈하고 글로 적을 때만 소수로 바꾼다: h(3140) = '31.4', h(7850) = '78.5', h(31400) = '314'.
  const str = (n, k) => { const t = String(n).padStart(k + 1, '0'); return (t.slice(0, -k) + '.' + t.slice(-k)).replace(/0+$/, '').replace(/\.$/, ''); };
  const h = (n) => str(n, 2);
  // 원주율: s 는 글에 적는 꼴, n 은 100배 한 수
  const P314 = { s: '3.14', n: 314 }, P31 = { s: '3.1', n: 310 }, P3 = { s: '3', n: 300 };
  const note = (text, p) => `${text} (원주율: ${(p || P314).s})`;
  const calc = (expr, unseen) => ({ calc: [[expr, 0]], unseen: unseen || [] });
  // 답 칸: 소수 칸(100배 한 수를 받는다)과 자연수 칸
  const dIn = (label, n100, unit) => ({ label, answer: Number(h(n100)), unit, decimal: true });
  const nIn = (label, n, unit) => ({ label, answer: n, unit });
  const ansD = (text, n100, o) => D(text, Number(h(n100)), o);
  // 소수 뒤 토씨: 끝자리 숫자를 마지막에 읽는다(3.14는, 31.4가).
  const BATCHIM = [true, true, false, true, false, false, true, true, true, false];
  const dj = (text, pair) => { const [yes, no] = pair.split('/'); return text + (BATCHIM[Number(String(text).slice(-1))] ? yes : no); };
  // 답이 1000 미만인 소수가 되는 수: 지름 × 3.14(원주), 반지름 × 반지름 × 3.14(넓이)
  const okC = (dia) => dia % 50 !== 0 && dia <= 318;
  const okA = (r) => r % 10 !== 0 && r <= 17;
  // 거꾸로 구하는 문항의 답은 자연수이다. 검사가 식 글(원주 ÷ 3.14)을 그대로 셈하므로, 그 셈이 뜬 소수 오차 없이 떨어지는 수만 쓴다.
  const backD = (dia) => Number(h(dia * 314)) / 3.14 === dia;
  const backR = (r) => Number(h(r * 628)) / 3.14 / 2 === r;

  // ── 보기 짜기 ────────────────────────────────────────────────
  // 설명 고르기: want 가 true 이면 옳은 것 하나와 틀린 것 셋, false 이면 옳은 것 셋과 틀린 것 하나
  function say(d, text, trues, falses, want, explain, figure) {
    const rows = d.shuffle(want ? [[d.pick(trues), true]].concat(d.shuffle(falses).slice(0, 3).map((t) => [t, false])) : d.shuffle(trues).slice(0, 3).map((t) => [t, true]).concat([[d.pick(falses), false]]));
    return C(text, rows.map((r) => r[0]), rows.findIndex((r) => r[1] === want), { figure, explain, facts: { truth: rows.map((r) => r[1]), want } });
  }
  // 낱말·식 하나 고르기
  function pickWord(d, text, want, others, explain, figure) {
    const options = d.shuffle([want].concat(others));
    return C(text, options, options.indexOf(want), { figure, explain, facts: { truth: options.map((o) => o === want), want: true } });
  }
  // 차례 고르기 보기: 값의 차례를 바르게 적은 것 하나와 틀린 것 셋
  function orderChoice(d, values, descending) {
    const right = values.map((_, i) => i).sort((p, q) => (descending ? values[q] - values[p] : values[p] - values[q]));
    const list = d.shuffle(d.shuffle(ORDERS.filter((o) => o.join() !== right.join())).slice(0, 3).concat([right]));
    return { list, right, options: list.map((o) => o.map((i) => THREE[i]).join(', ')), answer: list.findIndex((o) => o.join() === right.join()) };
  }
  const tagged = (list, tags) => lines(list.map((html, i) => '<span class="mb-tag mb-tag-short">' + (tags || LABELS)[i] + '</span>' + html));
  const versus = (left, right) => `<div class="mb-versus"><span>${left}</span><span class="mb-ring"></span><span>${right}</span></div>`;

  // ── 그림 ─────────────────────────────────────────────────────
  // 좌표는 geometry.js 의 판과 같다(한 칸 22px, 둘레 여백 16px, 세로는 아래로 커진다). 각도는 오른쪽이 0°이고 시계 반대쪽으로 커진다.
  const U = 22, PAD = 16, RAD = Math.PI / 180;
  const f2 = (v) => Math.round(v * 100) / 100, px = (v) => f2(PAD + v * U), at = (p) => px(p[0]) + ' ' + px(p[1]);
  const on = (c, r, deg) => [c[0] + r * Math.cos(deg * RAD), c[1] - r * Math.sin(deg * RAD)];
  const mid = (p, q, t) => { const k = t == null ? 0.5 : t; return [p[0] + (q[0] - p[0]) * k, p[1] + (q[1] - p[1]) * k]; };
  // 칠: 색칠한 부분은 옅은 노랑, 견줄 것이 하나 더 있으면 옅은 파랑. 경계선은 class(mb-poly)의 짙은 선 그대로다.
  const TINT = 'fill:rgba(251,191,36,0.42)', BLUE = 'fill:rgba(96,165,250,0.4)', WHITE = 'fill:#fff', CREAM = 'fill:#fff8e1', CLEAR = 'fill:none';
  const disk = (c, r, css) => `<circle class="mb-poly" style="${css || CREAM}" cx="${px(c[0])}" cy="${px(c[1])}" r="${f2(r * U)}"/>`;
  const poly = (pts, css) => `<polygon class="mb-poly" style="${css || WHITE}" points="${pts.map((p) => px(p[0]) + ',' + px(p[1])).join(' ')}"/>`;
  // 굽은 변이 있는 도형. 조각: ['M', 점], ['L', 점], ['A', 반지름, 끝점, 화면에서 시계 방향이면 1]. 호는 모두 반 바퀴 이하다.
  const path = (cmds, css) => `<path class="mb-poly" style="${css || WHITE}" d="${cmds.map((c) => (c[0] === 'A' ? `A${f2(c[1] * U)} ${f2(c[1] * U)} 0 0 ${c[3] ? 1 : 0} ${at(c[2])}` : c[0] + at(c[1]))).join('')}Z"/>`;
  const seg = (p, q) => G.line(p, q), thin = (p, q) => G.line(p, q, 'mb-line is-thin'), dash = (p, q) => G.line(p, q, 'mb-line is-cut');
  const bold = (p, q) => G.line(p, q).replace('class="mb-line"', 'class="mb-line" style="stroke:#1d4ed8;stroke-width:3.6"');
  const word = (p, v) => G.text(p, v, 'mb-label is-length');
  const small = (p, v) => G.text(p, v, 'mb-label is-small');
  // 글 너비의 반(칸): 길이 글(「12 cm」)의 글자 수로 어림한다.
  const half = (v) => String(v).length * 0.155;
  // 선분 p–q 의 옆에 글을 적는다(선 위에 얹지 않는다). toward: 글을 둘 쪽에 있는 점, t: 선분을 따라간 자리(0~1)
  function beside(p, q, value, toward, t, gap) {
    const m = mid(p, q, t), L = Math.hypot(q[0] - p[0], q[1] - p[1]);
    let n = [-(q[1] - p[1]) / L, (q[0] - p[0]) / L];
    if ((toward[0] - m[0]) * n[0] + (toward[1] - m[1]) * n[1] < 0) n = [-n[0], -n[1]];
    const off = half(value) * Math.abs(n[0]) + 0.3 * Math.abs(n[1]) + (gap == null ? 0.17 : gap);
    return word([m[0] + n[0] * off, m[1] + n[1] * off], value);
  }
  // 치수선: 선분 p–q 와 나란히, 점 inside 의 반대쪽으로 off 만큼 떨어진 가는 선과 양 끝 눈금, 그 바깥에 글
  function dim(p, q, inside, value, off) {
    const L = Math.hypot(q[0] - p[0], q[1] - p[1]), m = mid(p, q), o = off == null ? 0.4 : off;
    let n = [-(q[1] - p[1]) / L, (q[0] - p[0]) / L];
    if ((inside[0] - m[0]) * n[0] + (inside[1] - m[1]) * n[1] > 0) n = [-n[0], -n[1]];
    const a = [p[0] + n[0] * o, p[1] + n[1] * o], b = [q[0] + n[0] * o, q[1] + n[1] * o], tick = (c) => thin([c[0] - n[0] * 0.16, c[1] - n[1] * 0.16], [c[0] + n[0] * 0.16, c[1] + n[1] * 0.16]);
    return thin(a, b) + tick(a) + tick(b) + beside(a, b, value, [m[0] + n[0] * (o + 2), m[1] + n[1] * (o + 2)]);
  }
  // 판: 휴대폰 너비를 넘지 않게 배율을 누른다.
  const draw = (cols, rows, parts, label, scale) => G.board(cols, rows, parts, { grid: false, scale: Math.min(scale || 1.1, 296 / (32 + cols * U)), label });
  const squareOf = (c, R) => [[c[0] - R, c[1] - R], [c[0] + R, c[1] - R], [c[0] + R, c[1] + R], [c[0] - R, c[1] + R]];
  const diamondOf = (c, R) => [[c[0], c[1] - R], [c[0] + R, c[1]], [c[0], c[1] + R], [c[0] - R, c[1]]];

  // 원 하나와 지름(o.d) 또는 반지름(o.r). 길이 글은 선분 위쪽에 적는다. o.names: 점 이름(중심 ㅇ, 원 위의 점 ㄱ·ㄴ)을 적는다. o.deg: 선분의 방향
  function circleFig(o) {
    const c = [3, 3], R = 2.2, deg = o.deg || 0, p = on(c, R, deg), q = on(c, R, deg + 180), up = [c[0], c[1] - 9];
    const parts = [disk(c, R)];
    if (o.d != null) parts.push(seg(q, p), G.point(p), G.point(q), o.d ? beside(c, p, o.d, up, 0.52) : '');
    else parts.push(seg(c, p), G.point(p), o.r ? beside(c, p, o.r, up, 0.5) : '');
    parts.push(G.point(c));
    // 지름의 두 끝은 왼쪽이 ㄱ, 오른쪽이 ㄴ이다.
    if (o.names) parts.push(G.text([c[0] - 0.12, c[1] + 0.46], 'ㅇ'), o.d != null ? G.text(G.beyond(c, p[0] < q[0] ? p : q, 0.42), 'ㄱ') + G.text(G.beyond(c, p[0] < q[0] ? q : p, 0.42), 'ㄴ') : G.text(G.beyond(c, p, 0.42), 'ㄱ'));
    return draw(6, 6, parts, o.label);
  }
  // 작은 원 그림 셋 가운데 하나: 반지름('r'), 지름('d'), 원주('c')를 굵은 선으로 나타낸다.
  function partFig(kind) {
    const c = [2, 2], R = 1.5, a = on(c, R, 25), b = on(c, R, 205), SAID = { r: '원의 중심과 원 위의 한 점을 이은 선분', d: '원의 중심을 지나고 원 위의 두 점을 이은 선분', c: '원의 둘레' };
    const ring = kind === 'c' ? disk(c, R, 'fill:#fff8e1;stroke:#1d4ed8;stroke-width:3.6') : disk(c, R);
    return G.board(4, 4, [ring, kind === 'r' ? bold(c, a) : kind === 'd' ? bold(b, a) : '', G.point(c)], { grid: false, scale: 0.95, label: `원. 굵은 선: ${SAID[kind]}` });
  }
  // 원 안에 꼭 맞는 정육각형과 원 밖에 꼭 맞는 정사각형. 정육각형의 한 변은 원의 반지름, 정사각형의 한 변은 원의 지름과 같다.
  function hexsqFig(dia) {
    const c = [3, 3], R = 2.1, hex = [0, 60, 120, 180, 240, 300].map((a) => on(c, R, a)), sq = squareOf(c, R);
    return draw(6, 6.9, [poly(sq, WHITE), disk(c, R), poly(hex, BLUE), word([c[0], hex[1][1] + 0.42], `${dia / 2} cm`), dim(sq[3], sq[2], c, `${dia} cm`, 0.4)],
      `원 안에 꼭 맞는 정육각형(한 변 ${dia / 2} cm)과 원 밖에 꼭 맞는 정사각형(한 변 ${dia} cm). 원의 지름은 ${dia} cm`);
  }
  // 자와, 자의 눈금 0에 놓인 원(지름 dia cm). spots: 화살표가 가리키는 눈금(cm). 자는 max cm까지 그린다.
  function rollFig(dia, spots, max) {
    const u = 10.4 / max, r = (dia * u) / 2, x0 = 1.15, y0 = 2.4, X = (v) => x0 + v * u, parts = [thin([X(0), y0], [X(max), y0])];
    for (let v = 0; v <= max; v += 1) parts.push(thin([X(v), y0], [X(v), y0 + 0.22]), small([X(v), y0 + 0.6], v));
    parts.push(disk([X(0), y0 - r], r));
    spots.forEach((s, i) => parts.push(`<path d="M${px(X(s))} ${px(y0 - 0.08)}l-4.5 -9h9z" style="fill:#c2410c"/>`, G.text([X(s), y0 - 0.86], LABELS[i])));
    const place = (s) => (Number.isInteger(s) ? `눈금 ${s}` : `눈금 ${josa(Math.floor(s), '과/와')} ${Math.floor(s) + 1} 사이`);
    return draw(x0 + 10.4 + 0.6, 3.4, parts, `자의 눈금 0에 놓인 원(지름 ${dia} cm)과 화살표. ${spots.map((s, i) => `${LABELS[i]} ${place(s)}`).join(', ')}`, 1);
  }
  // 곧게 편 끈과 그 위에 이어 놓은 접시 3개. 끈의 길이는 접시의 지름의 3.14배로 그린다.
  function stringFig() {
    const R = 1.05, x0 = 0.5, y = 2.75, L = 2 * R * 3.14, parts = [0, 1, 2].map((i) => disk([x0 + R + i * 2 * R, y - R], R));
    parts.push(seg([x0, y], [x0 + L, y]), thin([x0, y - 0.2], [x0, y + 0.2]), thin([x0 + L, y - 0.2], [x0 + L, y + 0.2]), word([x0 + L / 2, y + 0.5], '곧게 편 끈'));
    return draw(x0 * 2 + L, 3.5, parts, '곧게 편 끈 위에 접시 3개를 겹치지 않게 이어 놓았다. 끈이 조금 남는다');
  }
  // 원(반지름 r cm)과 원주를 곧게 편 선분(길이 글 c). 선분의 길이는 그림 속 원의 원주와 같게 그린다.
  function unrollFig(r, c) {
    const R = 1.6, L = 2 * R * Math.PI, x0 = 0.4, o = [x0 + L / 2, 1.8], y = 4.25;
    return draw(x0 * 2 + L, 5.2, [disk(o, R), seg(o, [o[0] + R, o[1]]), G.point(o), word([o[0] + R * 0.47, o[1] - 0.45], `${r} cm`), seg([x0, y], [x0 + L, y]), thin([x0, y - 0.2], [x0, y + 0.2]), thin([x0 + L, y - 0.2], [x0 + L, y + 0.2]), word([x0 + L / 2, y + 0.5], `${c} cm`)],
      `반지름이 ${r} cm인 원과, 이 원의 원주를 곧게 편 길이 ${c} cm인 선분`, 1);
  }

  // 6-2-5b.js, 6-2-5c.js 가 같은 도구를 쓴다(이 파일이 먼저 불린다).
  B.kit.circle625 = { TAGS, THREE, ORDERS, SIGNS, str, h, P314, P31, P3, note, calc, dIn, nIn, ansD, dj, okC, okA, backD, backR, say, pickWord, orderChoice, tagged, versus,
    U, RAD, f2, px, at, on, mid, TINT, BLUE, WHITE, CREAM, CLEAR, disk, poly, path, seg, thin, dash, bold, word, small, half, beside, dim, draw, squareOf, diamondOf, circleFig };

  const THINGS = ['접시', '시계', '쟁반', '거울', '냄비 뚜껑'];
  // 잰 원주(글)와 지름: (원주) ÷ (지름)이 나누어떨어지지 않는다.
  const MEASURED = [['22', 7], ['34.5', 11], ['50.3', 16], ['25.2', 8], ['47', 15], ['37.7', 12], ['28.3', 9], ['18.9', 6], ['44', 14], ['40.8', 13], ['53.5', 17], ['66', 21], ['56.4', 18], ['75.5', 24], ['110', 35]];

  B.addUnit({
    id: '6-2-5', grade: 6, semester: 2, no: 5, title: '원의 넓이', version: 1,
    groups: [
      {
        id: 'rel', title: '원주와 지름의 관계', standard: RATIO,
        types: [
          T('rel-word', '원의 둘레를 나타내는 낱말', '①1 ②1 ③1 심1', (d) => pickWord(d, '원의 둘레를 무엇이라고 하는가?', '원주', ['지름', '반지름', '원의 중심'], '원의 둘레를 원주라고 한다.')),
          T('rel-pick', '그림에서 원주 찾기', '①2 ②1 ③3', (d) => {
            const kinds = d.shuffle(['r', 'd', 'c']), SAID = { r: '반지름', d: '지름', c: '원주' };
            return C('굵은 선으로 나타낸 것이 원주인 그림은?', TAGS.slice(0, 3), kinds.indexOf('c'), {
              figure: G.tiles(kinds.map((kind, i) => [TAGS[i], partFig(kind)])),
              explain: `원주는 원의 둘레이다. ${kinds.map((kind, i) => `${TAGS[i]}는 ${i === 2 ? josa(SAID[kind], '을/를') : SAID[kind]}`).join(', ')} 굵은 선으로 나타냈다.`,
              facts: { truth: kinds.map((kind) => kind === 'c'), want: true }
            });
          }),
          T('rel-talk', '원주와 지름의 관계에 대한 설명', '①5 ②3 ③3 심4', (d) => say(d, '원주와 지름에 대한 설명으로 옳지 않은 것은?',
            ['원의 지름이 길어지면 원주도 길어진다.', '원주가 짧아지면 원의 지름도 짧아진다.', '원주는 지름의 3배보다 길고 4배보다 짧다.', '원의 크기가 같으면 원주도 같다.'],
            ['원의 지름과 원주는 길이가 같다.', '원의 지름이 길어져도 원주는 변하지 않는다.', '원의 지름이 길어지면 원주는 짧아진다.', '원의 중심을 지나는 선분을 원주라고 한다.'], false,
            '원주는 원의 둘레이고, 지름의 3배보다 길고 4배보다 짧다. 지름이 길어지면 원주도 길어지고, 지름이 짧아지면 원주도 짧아진다.')),
          T('rel-longer', '셈하지 않고 원주가 가장 긴 원 찾기', '①6 ③4·5 심13', (d) => {
            // 반지름으로 적힌 원은 적힌 수가 가장 작다. 지름으로 고쳐야 견줄 수 있다.
            const [a, b, c] = d.until(() => [d.int(9, 19), d.int(5, 11), d.int(9, 19)], ([x, y, z]) => new Set([x, y * 2, z]).size === 3 && y < Math.min(x, z) && Math.abs(y * 2 - Math.max(x, z)) <= 4);
            const rows = d.shuffle([[`지름이 ${a} cm인 원`, a, String(a)], [`반지름이 ${b} cm인 원`, b * 2, `${b}*2`], [`지름이 ${c} cm인 원`, c, String(c)]]), best = Math.max(...rows.map((r) => r[1]));
            return C('원주가 가장 긴 원은?', rows.map((r) => r[0]), rows.findIndex((r) => r[1] === best), {
              explain: `지름이 길수록 원주도 길다. 반지름이 ${b} cm인 원의 지름은 ${b} × 2 = ${b * 2}(cm)이므로 세 원의 지름은 ${rows.map((r) => r[1] + ' cm').join(', ')}이다. 지름이 가장 긴 원의 원주가 가장 길다.`,
              facts: { choose: { exprs: rows.map((r) => r[2]), rule: 'max' }, unseen: [2] }
            });
          }),
          T('rel-hexsq', '정육각형과 정사각형의 둘레로 원주의 범위 알기', '①7 ②4 ③6 심2', (d, n) => {
            const dia = d.int(2, 10) * 2;
            if (n === 0) return M(`지름이 ${dia} cm인 원 안에 정육각형을, 원 밖에 정사각형을 꼭 맞게 그렸다. 정육각형의 둘레와 정사각형의 둘레는 각각 몇 cm인가?`, [nIn('정육각형', dia * 3, 'cm'), nIn('정사각형', dia * 4, 'cm')], {
              figure: hexsqFig(dia), explain: `정육각형의 둘레는 ${dia / 2} × 6 = ${dia * 3}(cm), 정사각형의 둘레는 ${dia} × 4 = ${dia * 4}(cm)이다. 원주는 정육각형의 둘레보다 길고 정사각형의 둘레보다 짧다.`,
              facts: { calc: [[`${dia / 2}*6`, 0], [`${dia}*4`, 1]], unseen: [6, 4] }
            });
            return M('원 안에 정육각형을, 원 밖에 정사각형을 꼭 맞게 그렸다. 두 도형의 둘레가 원의 지름의 몇 배인지 알아보고, ㉠, ㉡에 알맞은 수를 구하시오.', [nIn('㉠', 3), nIn('㉡', 4)], {
              figure: hexsqFig(dia) + lines(['(정육각형의 둘레) &lt; (원주) &lt; (정사각형의 둘레)', '(원의 지름) × ㉠ &lt; (원주) &lt; (원의 지름) × ㉡']),
              explain: `정육각형의 둘레는 ${dia / 2} × 6 = ${dia * 3}(cm)로 지름의 ${dia * 3} ÷ ${dia} = 3(배)이고, 정사각형의 둘레는 ${dia} × 4 = ${dia * 4}(cm)로 지름의 4배이다. 원주는 지름의 3배보다 길고 4배보다 짧다.`,
              facts: { calc: [[`${dia / 2}*6/${dia}`, 0], [`${dia}*4/${dia}`, 1]], unseen: [6, 4] }
            });
          }, { count: 2 }),
          T('rel-range', '원주의 범위를 길이로 말하기', '①8 ②5 ③7', (d, n) => {
            const v = n === 0 ? d.int(5, 19) : d.int(3, 12), dia = n === 0 ? v : v * 2;
            return M(`원주는 지름의 3배보다 길고 4배보다 짧다. ${n === 0 ? '지름' : '반지름'}이 ${v} cm인 원의 원주는 ㉠ cm보다 길고 ㉡ cm보다 짧다. ㉠, ㉡에 알맞은 수는?`, [nIn('㉠', dia * 3), nIn('㉡', dia * 4)], {
              explain: `${n === 0 ? '' : `지름은 ${v} × 2 = ${dia}(cm)이다. `}${dia} × 3 = ${dia * 3}, ${dia} × 4 = ${dia * 4}이므로 원주는 ${dia * 3} cm보다 길고 ${dia * 4} cm보다 짧다.`,
              facts: { calc: n === 0 ? [[`${v}*3`, 0], [`${v}*4`, 1]] : [[`${v}*2*3`, 0], [`${v}*2*4`, 1]], unseen: [2] }
            });
          }, { count: 2 }),
          T('rel-sign', '지름의 3배·4배와 원주의 크기 비교', '②5 ①8', (d) => {
            const k = d.pick([3, 4]);
            return C('한 원에서 두 길이를 비교하여 ○ 안에 알맞은 것은?', SIGNS, k === 4 ? 0 : 2, {
              figure: versus(`(원의 지름) × ${k}`, '(원주)'), explain: `원주는 지름의 3배보다 길고 4배보다 짧다. 그러므로 (원의 지름) × ${k}${k === 4 ? '는 원주보다 길다' : '은 원주보다 짧다'}.`,
              facts: { truth: [k === 4, false, k === 3], want: true }
            });
          }),
          T('rel-near', '원주와 가장 가까운 길이 고르기', '①9 ②6·7 ③8 심3', (d, n) => {
            // 원주는 지름의 3배 남짓이다. 반지름으로 주면 반지름의 3배(지름의 1.5배)를 고르기 쉽다.
            const v = n === 0 ? d.int(4, 15) : d.int(3, 9), dia = n === 0 ? v : v * 2, list = d.shuffle(n === 0 ? [dia, dia * 2, dia * 3, dia * 5] : [v * 2, v * 3, v * 6, v * 9]);
            return C(`${n === 0 ? '지름' : '반지름'}이 ${v} cm인 원이 있다. 이 원의 원주와 가장 가까운 길이는?`, list.map((x) => x + ' cm'), list.indexOf(dia * 3), {
              explain: `${n === 0 ? '' : `지름은 ${v} × 2 = ${dia}(cm)이다. `}원주는 지름의 3배보다 조금 길다. ${dia} × 3 = ${dia * 3}이므로 ${dia * 3} cm가 가장 가깝다.`,
              facts: { choose: { exprs: list.map(String), rule: 'nearest', target: (dia * 314) / 100 } }
            });
          }, { count: 2 }),
          T('rel-roll', '자 위에서 원을 한 바퀴 굴린 자리', '①9 ③8', (d) => {
            const dia = d.pick([1, 2]), far = d.shuffle([1, 2, 5, 6]).slice(0, 2).map((k) => k * dia), spots = far.concat([(dia * 314) / 100]).sort((x, y) => x - y), hit = spots.indexOf((dia * 314) / 100);
            return C(`지름이 ${dia} cm인 원을 자의 눈금 0에 맞추어 놓고 오른쪽으로 한 바퀴 굴렸다. 원이 닿는 자리로 가장 알맞은 것은?`, THREE, hit, {
              figure: rollFig(dia, spots, dia * 6), explain: `원이 한 바퀴 굴러간 거리는 원주와 같다. 원주는 지름의 3배보다 길고 4배보다 짧으므로 ${dia * 3} cm보다 길고 ${dia * 4} cm보다 짧다. 그 사이에 있는 화살표는 ${THREE[hit]}이다.`,
              facts: { closer: { expr: `${dia}*3.14`, estimates: spots }, truth: spots.map((s) => s > dia * 3 && s < dia * 4), want: true }
            });
          }),
          T('rel-string', '끈으로 잰 원주는 지름의 약 몇 배', '①9 ②8', () => N('원 모양 접시의 둘레를 끈으로 한 바퀴 두른 뒤 끈을 곧게 폈다. 편 끈 위에 같은 접시를 겹치지 않게 이어 놓았더니 그림과 같았다. 접시의 원주는 지름의 약 몇 배인가?', 3, {
            unit: '배', figure: stringFig(), explain: '끈의 길이는 접시의 원주와 같다. 끈 위에 접시가 3개 놓이고 조금 남으므로 원주는 지름의 3배보다 조금 길다. 약 3배이다.', facts: calc('3')
          })),
          T('rel-read', '그림에서 지름과 원주 읽기', '①4', (d) => {
            const r = d.int(2, 9);
            return M('원과, 그 원의 원주를 곧게 펴서 나타낸 선분이다. 원의 지름과 원주는 각각 몇 cm인가?', [nIn('지름', r * 2, 'cm'), dIn('원주', r * 628, 'cm')], {
              figure: unrollFig(r, h(r * 628)), explain: `지름은 반지름의 2배이므로 ${r} × 2 = ${r * 2}(cm)이다. 원주는 원의 둘레이므로 곧게 편 선분의 길이와 같은 ${h(r * 628)} cm이다.`,
              facts: { calc: [[`${r}*2`, 0], [h(r * 628), 1]], unseen: [2] }
            });
          })
        ]
      },
      {
        id: 'pi', title: '원주율', standard: RATIO,
        types: [
          T('pi-word', '원주율의 뜻', '①1 ②1 ③9 심1', (d) => pickWord(d, '원의 지름에 대한 원주의 비율을 무엇이라고 하는가?', '원주율', ['원주', '반지름', '원의 넓이'], '원의 지름에 대한 원주의 비율을 원주율이라고 한다. (원주율) = (원주) ÷ (지름)')),
          T('pi-formula', '원주율을 구하는 식', '①18 ②11 ③9 심1', (d) => pickWord(d, '원주율을 구하는 식으로 알맞은 것은?', '(원주) ÷ (지름)', ['(지름) ÷ (원주)', '(원주) ÷ (반지름)', '(원주) × (지름)'], '원주율은 원의 지름에 대한 원주의 비율이므로 (원주) ÷ (지름)으로 구한다.')),
          T('pi-ratio', '원주와 지름으로 원주율 구하기', '①10 ②8·12 ③10 심7', (d, n) => {
            // 첫째는 3.14로 떨어지는 값, 둘째는 덜 정밀하게 재어 3.1로 떨어지는 값이다.
            const p = n === 0 ? P314 : P31;
            if (n === 0) {
              const dia = d.until(() => d.int(6, 30), (v) => v % 10 !== 0), c = h(dia * p.n);
              return D(`지름이 ${dia} cm인 원 모양 접시의 원주를 재었더니 ${c} cm였다. 이 접시의 원주는 지름의 몇 배인가?`, Number(p.s), { unit: '배', explain: `(원주) ÷ (지름) = ${c} ÷ ${dia} = ${p.s}이므로 ${p.s}배이다.`, facts: calc(`${c}/${dia}`) });
            }
            const r = d.until(() => d.int(4, 15), (v) => v % 5 !== 0), c = h(r * 2 * p.n);
            return D(`반지름이 ${r} cm인 원 모양 시계의 원주는 ${c} cm이다. 이 시계의 (원주) ÷ (지름)의 값은?`, Number(p.s), { explain: `지름은 ${r} × 2 = ${r * 2}(cm)이다. (원주) ÷ (지름) = ${c} ÷ ${r * 2} = ${p.s}`, facts: calc(`${c}/(${r}*2)`, [2]) });
          }, { count: 2 }),
          T('pi-table', '표에서 원주율이 일정함 알기', '①11 ②13 ③10', (d) => {
            const dias = d.until(() => d.shuffle([3, 4, 5, 6, 7, 8, 9, 11, 12, 15]).slice(0, 3).sort((x, y) => x - y), (list) => list[2] - list[0] >= 4);
            return say(d, '원 가, 나, 다의 원주와 지름을 재어 표로 나타내었다. 세 원의 (원주) ÷ (지름)을 구해 보고 알 수 있는 것은?',
              ['원의 크기가 달라도 (원주) ÷ (지름)은 같다.'], ['원이 커지면 (원주) ÷ (지름)도 커진다.', '원이 커지면 (원주) ÷ (지름)은 작아진다.', '(원주) ÷ (지름)은 원의 지름과 같다.'], true,
              `${dias.map((v) => `${h(v * 314)} ÷ ${v} = 3.14`).join(', ')}이다. 원의 크기와 관계없이 (원주) ÷ (지름)은 일정하다. 이 값을 원주율이라고 한다.`,
              table(['원', '원주(cm)', '지름(cm)'], dias.map((v, i) => [TAGS[i], h(v * 314), v])));
          }),
          T('pi-round', '원주율을 반올림하여 나타내기', '①12 ②15', () => M('원주율을 소수로 나타내면 3.1415926535…와 같이 끝없이 이어진다. 원주율을 반올림하여 ㉠ 일의 자리까지, ㉡ 소수 첫째 자리까지, ㉢ 소수 둘째 자리까지, ㉣ 소수 셋째 자리까지 나타내시오.',
            [nIn('㉠', 3), dIn('㉡', 310), dIn('㉢', 314), { label: '㉣', answer: 3.142, decimal: true }], {
              explain: '구하려는 자리 바로 아래 자리의 숫자가 5보다 작으면 버리고, 5이거나 5보다 크면 올린다. 3.1415…에서 차례로 3, 3.1, 3.14, 3.142이다(소수 넷째 자리 숫자가 5이므로 셋째 자리는 올린다).',
              facts: { calc: [['3', 0], ['3.1', 1], ['3.14', 2], ['3.142', 3]], unseen: [3.1, 3.14, 3.142] }
            })),
          T('pi-measure', '잰 값으로 원주율을 구해 반올림하기', '①13 ②14 ③11 심7', (d) => {
            // (원주) ÷ (지름)의 소수 셋째 자리까지를 자연수 셈으로 구해 반올림한다. 잰 값에 따라 3.13, 3.14, 3.15가 나온다.
            const [c, dia] = d.pick(MEASURED), t = Math.floor((Math.round(Number(c) * 10) * 100) / dia), r2 = Math.floor(t / 10) + (t % 10 >= 5 ? 1 : 0);
            return ansD(`원 모양 통의 지름과 원주를 재었더니 지름이 ${dia} cm, 원주가 ${c} cm였다. (원주) ÷ (지름)을 반올림하여 소수 둘째 자리까지 나타내면?`, r2, {
              explain: `${c} ÷ ${dia} = ${str(t, 3).padEnd(5, '0')}…이다. 소수 셋째 자리 숫자가 ${t % 10}이므로 ${t % 10 >= 5 ? '올려서' : '버려서'} ${h(r2)}이다.`,
              facts: calc(`((${c}/${dia})*100+0.5-((${c}/${dia})*100+0.5)%1)/100`, [100, 0.5, 1])
            });
          }),
          T('pi-same', '크기가 다른 두 원에서 같은 것', '①15 ③13 심6', (d) => pickWord(d, '크기가 서로 다른 두 원에서 항상 같은 것은?', '원주율', ['원주', '지름', '원의 넓이'], '원주율은 원의 크기와 관계없이 일정하다. 원이 커지면 지름, 원주, 넓이는 모두 커진다.')),
          T('pi-talk', '원주율에 대한 설명', '①15·16 ②10 ③13 심5', (d, n) => say(d, n === 0 ? '원주율에 대한 설명으로 옳지 않은 것은?' : '원주율에 대한 설명으로 옳은 것은?',
            ['원주율은 원의 지름에 대한 원주의 비율이다.', '원주율은 (원주) ÷ (지름)으로 구한다.', '원주율은 원의 크기와 관계없이 일정하다.', '원주율을 소수로 나타내면 끝없이 이어지므로 3, 3.1, 3.14 등으로 어림하여 쓴다.'],
            ['원의 지름이 2배가 되면 원주율도 2배가 된다.', '원주율은 원의 반지름에 대한 원주의 비율이다.', '원주율은 (지름) ÷ (원주)로 구한다.', '원이 클수록 원주율도 크다.', '원주율은 정확히 3.14이다.'], n === 1,
            '원주율은 원의 지름에 대한 원주의 비율로 (원주) ÷ (지름)이다. 원의 크기와 관계없이 일정하고, 소수로 나타내면 끝없이 이어지므로 3, 3.1, 3.14 등으로 어림하여 쓴다.'), { count: 2 }),
          T('pi-wrong', '원주를 잘못 잰 물건 찾기', '①17 ②17 ③14 심9', (d) => {
            const names = d.shuffle(THINGS).slice(0, 3), dias = d.shuffle([8, 12, 14, 15, 16, 18, 22, 24, 25, 26]).slice(0, 3), bad = d.int(0, 2), k = d.pick([28, 29, 34, 36]);
            const rows = names.map((name, i) => ({ name, dia: dias[i], c: i === bad ? str(dias[i] * k, 1) : h(dias[i] * 314) }));
            return C(note('세 물건의 지름과 원주를 재어 표로 나타내었다. 원주를 잘못 잰 물건은?'), names, bad, {
              figure: table(['물건', '지름(cm)', '원주(cm)'], rows.map((r) => [r.name, r.dia, r.c])),
              explain: `(원주) ÷ (지름)을 구하면 ${rows.map((r, i) => `${r.name} ${i === bad ? str(k, 1) : '3.14'}`).join(', ')}이다. 원주율은 원의 크기와 관계없이 3.14쯤이어야 하므로 ${names[bad]}의 원주를 잘못 잰 것이다.`,
              facts: { choose: { exprs: rows.map((r) => `${r.c}/${r.dia}`), rule: 'odd' } }
            });
          })
        ]
      },
      {
        id: 'circ', title: '원주와 지름 구하기', standard: FIND,
        types: [
          T('circ-formula', '원주와 지름을 구하는 식', '①18 ②11 ③15', (d, n) => (n === 0
            ? pickWord(d, '원주를 구하는 식 (원주) = ( ㉠ ) × (원주율)에서 ㉠에 알맞은 말은?', '지름', ['반지름', '원의 넓이', '원의 중심'], '원주율은 (원주) ÷ (지름)이므로 (원주) = (지름) × (원주율)이다.')
            : pickWord(d, '지름을 구하는 식 (지름) = ( ㉠ ) ÷ (원주율)에서 ㉠에 알맞은 말은?', '원주', ['반지름', '원의 넓이', '원의 중심'], '(원주) = (지름) × (원주율)이므로 (지름) = (원주) ÷ (원주율)이다.')), { count: 2 }),
          T('circ-expr', '원주를 구하는 식 고르기', '①41 ①19', (d) => {
            const dia = d.until(() => d.int(6, 24), (v) => v !== 10 && v !== 20);
            return pickWord(d, note(`지름이 ${dia} cm인 원의 원주를 구하는 식으로 알맞은 것은?`), `${dia} × 3.14`, [`${dia} × 2 × 3.14`, `${dia} × ${dia} × 3.14`, `${dia} ÷ 2 × 3.14`], `원주는 (지름) × (원주율)이다. ${dia} × 3.14 = ${h(dia * 314)}(cm)`);
          }),
          T('circ-d', '지름으로 원주 구하기', '①19 ②9·19 ③16 심14', (d, n) => {
            if (n === 0) {
              const dia = d.int(3, 25);
              return ansD(note('원의 지름이 그림과 같을 때, 원주는 몇 cm인가?'), dia * 314, {
                unit: 'cm', figure: circleFig({ d: `${dia} cm`, deg: d.pick([0, 20, 160]), label: `원의 중심을 지나는 지름 ${dia} cm` }), explain: `원주는 (지름) × (원주율)이다. ${dia} × 3.14 = ${h(dia * 314)}(cm)`, facts: calc(`${dia}*3.14`)
              });
            }
            if (n === 1) {
              const dia = d.until(() => d.int(12, 45), (v) => v % 10 !== 0);
              return ansD(note(`지름이 ${dia} cm인 원 모양 거울의 둘레는 몇 cm인가?`, P31), dia * 310, { unit: 'cm', explain: `원의 둘레가 원주이다. ${dia} × 3.1 = ${h(dia * 310)}(cm)`, facts: calc(`${dia}*3.1`) });
            }
            const dia = d.int(24, 60);
            return N(note(`지름이 ${dia} m인 대관람차가 한 바퀴 돌 때, 대관람차의 맨 바깥쪽에 탄 사람이 움직인 거리는 몇 m인가?`, P3), dia * 3, { unit: 'm', explain: `한 바퀴 돌 때 움직인 거리는 원주와 같다. ${dia} × 3 = ${dia * 3}(m)`, facts: calc(`${dia}*3`) });
          }, { count: 3 }),
          T('circ-r', '반지름으로 원주 구하기', '①20 ②20 ③17 심14', (d) => {
            const r = d.until(() => d.int(6, 40), (v) => v !== 25);
            return ansD(note(`반지름이 ${r} cm인 원 모양 표지판의 둘레는 몇 cm인가?`), r * 628, {
              unit: 'cm', explain: `지름은 ${r} × 2 = ${r * 2}(cm)이므로 원주는 ${r * 2} × 3.14 = ${h(r * 628)}(cm)이다.`, facts: calc(`${r}*2*3.14`, [2])
            });
          }),
          T('circ-rope', '줄로 그린 원의 원주', '①30 ②20 ③17 심14', (d) => {
            const r = d.int(3, 14);
            return ansD(note(`운동장에 막대를 꽂고 길이가 ${r} m인 줄의 한쪽 끝을 막대에 묶었다. 줄을 팽팽하게 당기면서 막대 둘레를 한 바퀴 돌아 원을 그렸다. 그린 원의 원주는 몇 m인가?`), r * 628, {
              unit: 'm', figure: circleFig({ r: `${r} m`, deg: d.pick([20, 160]), label: `가운데 막대에 묶은 길이 ${r} m인 줄로 그린 원. 줄은 원의 중심에서 원 위의 점까지 닿는다` }),
              explain: `줄의 길이가 원의 반지름이다. 지름은 ${r} × 2 = ${r * 2}(m)이므로 원주는 ${r * 2} × 3.14 = ${h(r * 628)}(m)이다.`, facts: calc(`${r}*2*3.14`, [2])
            });
          }),
          T('circ-c2d', '원주로 지름 구하기', '①21 ②21 ③20 심15', (d) => {
            const dia = d.until(() => d.int(4, 30), backD), c = h(dia * 314);
            return N(note(`원주가 ${c} cm인 원의 지름은 몇 cm인가?`), dia, { unit: 'cm', explain: `지름은 (원주) ÷ (원주율)이다. ${c} ÷ 3.14 = ${dia}(cm)`, facts: calc(`${c}/3.14`) });
          }),
          T('circ-c2r', '원주로 반지름 구하기', '①22 ②22·23 ③21·22 심15', (d, n) => {
            const r = d.until(() => d.int(3, n === 0 ? 25 : 12), backR), c = h(r * 628);
            return N(note(n === 0 ? `길이가 ${c} cm인 철사를 남김없이 구부려 원을 한 개 만들었다. 만든 원의 반지름은 몇 cm인가?` : `원주가 ${c} cm인 원을 그리려고 한다. 컴퍼스를 몇 cm만큼 벌려야 하는가?`), r, {
              unit: 'cm', explain: `${n === 0 ? '철사의 길이가 원주이다. ' : '컴퍼스는 원의 반지름만큼 벌린다. '}지름은 ${c} ÷ 3.14 = ${r * 2}(cm)이고 반지름은 ${r * 2} ÷ 2 = ${r}(cm)이다.`, facts: calc(`${c}/3.14/2`, [2])
            });
          }, { count: 2 }),
          T('circ-table', '곱할지 나눌지 가려 표의 빈칸 구하기', '①21 ③24', (d) => {
            const [a, b] = d.until(() => [d.int(4, 30), d.int(4, 30)], ([x, y]) => x !== y && x % 10 !== 0 && backD(y));
            return M(note('표의 ㉠, ㉡에 알맞은 수는?'), [dIn('㉠', a * 314), nIn('㉡', b)], {
              figure: table(['원', '지름(cm)', '원주(cm)'], [['가', a, '㉠'], ['나', '㉡', h(b * 314)]]),
              explain: `원 가의 원주는 ${a} × 3.14 = ${h(a * 314)}(cm)이고, 원 나의 지름은 ${h(b * 314)} ÷ 3.14 = ${b}(cm)이다.`, facts: { calc: [[`${a}*3.14`, 0], [`${h(b * 314)}/3.14`, 1]] }
            });
          }),
          T('circ-box', '원주로 꼭 맞는 상자의 크기 알기', '①29 ②33 ③23 심29', (d) => {
            const dia = d.until(() => d.int(12, 40), backD), c = h(dia * 314);
            return N(note(`원주가 ${c} cm인 원 모양 케이크를 밑면이 정사각형 모양인 상자에 담으려고 한다. 상자 밑면의 한 변의 길이는 적어도 몇 cm여야 하는가?`), dia, {
              unit: 'cm', explain: `케이크의 지름은 ${c} ÷ 3.14 = ${dia}(cm)이다. 상자 밑면의 한 변의 길이가 케이크의 지름과 같거나 그보다 길어야 하므로 적어도 ${dia} cm여야 한다.`, facts: calc(`${c}/3.14`)
            });
          }),
          T('circ-compare', '지름·반지름·원주로 적힌 원의 크기 비교', '①25 ②28·29 ③25 심17', (d, n) => {
            // 세 원의 지름(ad, b, c)은 서로 다르고 4 cm 안에서 몰려 있다. 반지름으로 적힌 원은 적힌 수가 가장 작고(반지름은 0.5 cm 단위일 수 있다), 원주로 적힌 원은 가장 크다.
            const [ad, b, c] = d.until(() => [d.int(8, 24), d.int(7, 24), d.int(7, 24)], ([x, y, z]) => new Set([x, y, z]).size === 3 && Math.max(x, y, z) - Math.min(x, y, z) <= 4 && y % 50 !== 0), a = h(ad * 50);
            const rows = [[`반지름이 ${a} cm인 원`, ad, `${a}*2`], [`원주가 ${h(b * 314)} cm인 원`, b, `${h(b * 314)}/3.14`], [`지름이 ${c} cm인 원`, c, String(c)]], order = d.shuffle([0, 1, 2]), shown = order.map((i) => rows[i]);
            const how = `지름으로 비교한다. 반지름이 ${a} cm인 원의 지름은 ${a} × 2 = ${ad}(cm), 원주가 ${h(b * 314)} cm인 원의 지름은 ${h(b * 314)} ÷ 3.14 = ${b}(cm)이다.`;
            if (n === 0) return C(note('가장 큰 원은?'), shown.map((r) => r[0]), shown.findIndex((r) => r[1] === Math.max(ad, b, c)), { explain: `${how} 지름이 가장 긴 원이 가장 크다.`, facts: { choose: { exprs: shown.map((r) => r[2]), rule: 'max' }, unseen: [2] } });
            const made = orderChoice(d, shown.map((r) => r[1]), true);
            return C(note('원주가 긴 원부터 차례로 나열한 것은?'), made.options, made.answer, {
              figure: tagged(shown.map((r) => r[0]), THREE), explain: `${how} 지름이 긴 원부터 차례로 쓰면 ${made.right.map((i) => THREE[i]).join(', ')}이다. 지름이 길수록 원주도 길다.`,
              facts: { choose: { exprs: shown.map((r) => r[2]), rule: 'descending', orders: made.list }, unseen: [2] }
            });
          }, { count: 2 })
        ]
      },
      {
        id: 'roll', title: '굴러간 거리', standard: FIND,
        types: [
          T('roll-one', '한 바퀴 굴러간 거리로 지름 구하기', '①21 심15', (d) => {
            const dia = d.until(() => d.int(30, 95), (v) => v % 5 === 0 && backD(v)), c = h(dia * 314);
            return N(note(`훌라후프를 한 바퀴 굴렸더니 ${c} cm만큼 굴러갔다. 이 훌라후프의 지름은 몇 cm인가?`), dia, { unit: 'cm', explain: `한 바퀴 굴러간 거리는 원주와 같다. 지름은 ${c} ÷ 3.14 = ${dia}(cm)이다.`, facts: calc(`${c}/3.14`) });
          }),
          T('roll-dist', '굴러간 거리 구하기', '①23 ②24 ③27 심24', (d, n) => {
            if (n === 0) {
              const [dia, k] = d.until(() => [d.int(10, 15) * 5, d.int(2, 6)], ([x, y]) => (x * y) % 50 !== 0 && x * y <= 318);
              return ansD(note(`지름이 ${dia} cm인 타이어를 ${k}바퀴 굴렸다. 타이어가 굴러간 거리는 몇 cm인가?`), dia * k * 314, {
                unit: 'cm', explain: `한 바퀴 굴러간 거리는 원주와 같은 ${dia} × 3.14 = ${h(dia * 314)}(cm)이다. ${k}바퀴 굴러간 거리는 ${h(dia * 314)} × ${k} = ${h(dia * k * 314)}(cm)이다.`, facts: calc(`${dia}*3.14*${k}`)
              });
            }
            if (n === 1) {
              const dia = d.pick([30, 40, 60, 70, 80, 90]), k = 100;
              return ansD(note(`지름이 ${dia} cm인 자전거 바퀴가 ${k}바퀴 굴렀다. 자전거가 나아간 거리는 몇 m인가?`), dia * k * 314 / 100, {
                unit: 'm', explain: `바퀴가 한 바퀴 굴러간 거리는 ${dia} × 3.14 = ${h(dia * 314)}(cm)이다. ${k}바퀴 굴러간 거리는 ${h(dia * 314)} × ${k} = ${h(dia * k * 314)}(cm)이고, 100 cm = 1 m이므로 ${h(dia * k * 314 / 100)} m이다.`,
                facts: calc(`${dia}*3.14*${k}/100`)
              });
            }
            const [r, k] = d.until(() => [d.pick([15, 20, 35, 45]), d.int(2, 3)], ([x, y]) => (x * 2 * y) % 50 !== 0 && x * 2 * y <= 318);
            return ansD(note(`반지름이 ${r} m인 원 모양 호수의 둘레를 따라 ${k}바퀴 걸었다. 걸은 거리는 몇 m인가?`), r * 2 * k * 314, {
              unit: 'm', explain: `호수의 지름은 ${r} × 2 = ${r * 2}(m)이므로 둘레는 ${r * 2} × 3.14 = ${h(r * 628)}(m)이다. ${k}바퀴 걸은 거리는 ${h(r * 628)} × ${k} = ${h(r * 2 * k * 314)}(m)이다.`, facts: calc(`${r}*2*3.14*${k}`, [2])
            });
          }, { count: 3 }),
          T('roll-turns', '굴러간 거리로 바퀴 수 구하기', '①24 ②26 ③28 심25', (d, n) => {
            if (n === 0) {
              const [dia, k] = d.until(() => [d.int(4, 14) * 5, d.int(3, 9)], ([x, y]) => Number(h(x * y * 314)) / (x * 3.14) === y);
              return N(note(`지름이 ${dia} cm인 바퀴가 ${h(dia * k * 314)} cm만큼 굴러갔다. 바퀴는 몇 바퀴 굴렀는가?`), k, {
                unit: '바퀴', explain: `한 바퀴 굴러간 거리는 원주와 같은 ${dia} × 3.14 = ${h(dia * 314)}(cm)이다. ${h(dia * k * 314)} ÷ ${h(dia * 314)} = ${k}(바퀴)`, facts: calc(`${h(dia * k * 314)}/(${dia}*3.14)`)
              });
            }
            const [dia, k] = d.until(() => d.pick([[50, 10], [50, 20], [50, 30], [100, 5], [100, 15], [100, 25], [120, 5], [60, 50], [40, 25], [80, 25]]), ([x, y]) => (Number(h(x * y * 314 / 100)) * 100) / (x * 3.14) === y), m = h(dia * k * 314 / 100);
            return N(note(`지름이 ${dia} cm인 바퀴를 굴려 ${m} m를 가려고 한다. 바퀴는 몇 바퀴 굴러야 하는가?`), k, {
              unit: '바퀴', explain: `한 바퀴 굴러간 거리는 ${dia} × 3.14 = ${h(dia * 314)}(cm)이다. ${m} m = ${h(dia * k * 314)} cm이므로 ${h(dia * k * 314)} ÷ ${h(dia * 314)} = ${k}(바퀴)이다.`, facts: calc(`${m}*100/(${dia}*3.14)`, [100])
            });
          }, { count: 2 })
        ]
      },
      { id: 'est', title: '원의 넓이 어림하기', standard: FIND, types: [] },
      { id: 'area', title: '원의 넓이 구하기', standard: FIND, types: [] },
      { id: 'mix', title: '여러 가지 원의 넓이', standard: FIND, types: [] }
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
