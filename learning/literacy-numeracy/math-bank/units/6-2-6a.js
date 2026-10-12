// 6학년 2학기 6단원 원기둥, 원뿔, 구 — 단원 틀, 그림 도구(겨냥 그림·전개도·돌리는 그림·본 모양·재는 그림), 기본 문항(원기둥, 원기둥의 전개도).
// 수집해 둔 교과서 9종의 평가 자료에서 뽑은 문제 꼴 목록(기본꼴 1~3: 71·63·67꼴, 심화꼴 63꼴)을 번호마다 따져서 실었다.
// 꼴마다 「실음(유형 이름) / 뺌(까닭) / 미룸」을 가른 대조표는 references/textbooks/수학/_분석/6-2-6/싣기_대조표.md 에 있다.
// (원뿔·구·돌려서 만든 입체도형의 기본 문항은 6-2-6b.js, 본 모양·비교하기의 기본 문항과 실력 문항은 6-2-6c.js 에 있다.)
// ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2, ③n = 기본꼴_3, 심n = 심화꼴.
//
// 영역: 도형과 측정 가운데 도형. 원기둥·원뿔·구의 뜻, 구성 요소, 성질, 원기둥의 전개도가 이 단원의 일이다.
//   6수03-07 원기둥, 원뿔, 구를 이해하고, 구성 요소와 성질을 탐구하고 설명할 수 있다.
//   6수03-08 원기둥의 전개도를 그릴 수 있다.
//   교육과정: 「입체도형의 전개도에 대한 평가는 전개도가 될 수 있는 것과 될 수 없는 것을 구별하는 데 중점을 둔다.」
//             「각뿔과 원뿔의 전개도는 다루지 않는다.」 「한 직선을 중심으로 직사각형, 직각삼각형, 반원을 돌리는 활동을 통하여 원기둥, 원뿔, 구를 만들어 보게 한다.」
//   이 영역의 용어는 「원기둥, 원뿔, 구, 모선, 밑면, 옆면, 전개도」까지다. 회전체·회전축·단면은 중학교 용어라 쓰지 않고 「돌려서 만든 입체도형」이라고 쓴다.
//
// 싣는 기준
//  - 뜻·구성 요소·성질 그 자체를 묻는다. 주는 것(글·겨냥 그림·전개도·돌리는 그림·본 모양), 묻는 것, 도형(원기둥인가 원뿔인가 구인가)이 다르면 다른 문제다.
//    길이나 이름만 다른 것은 한 번만 싣는다.
//  - 길이는 그림에서 가려 읽는 것(높이인가 모선인가, 반지름인가 지름인가)과 반지름·지름을 한 번 바꾸는 것까지 싣는다.
//    셈하는 것은 원주를 한 번 구하거나(옆면의 가로 = 밑면의 지름 × 원주율) 한 번 거꾸로 구하는 것(옆면의 가로 ÷ 원주율 = 밑면의 지름)뿐이다.
//    읽은 길이 둘을 더하거나 빼는 덤 셈은 떼어 내고 읽기만 묻는다.
//  - 뜻을 대어 가리는 문제의 풀이는 뜻의 조건만 적는다(두 밑면이 서로 평행하고 합동인 원인가, 옆면이 굽은 면인가). 다른 도형의 이름을 끌어들이지 않는다.
//  - 그림은 셈하여 그린다. 원기둥은 위아래 밑면을 같은 크기의 타원으로, 옆 선은 두 타원의 끝을 잇는 평행한 선분으로, 아래 밑면의 보이지 않는 반쪽은 점선으로 그린다.
//    원뿔의 옆 선은 꼭짓점에서 밑면 타원에 그은 접선이고, 높이는 꼭짓점에서 밑면의 중심까지 점선과 직각 표시로 그린다. 길이를 적은 그림은 적힌 수의 비율대로 그린다.
//    전개도는 옆면의 가로를 밑면의 둘레(지름 × 원주율)에 맞추어 그린다.
//  - 서술형·작도는 싣지 않는다. 고르기나 수 답으로 바꿀 수 있는 것은 바꾸었다(밑면 색칠하기 → 밑면인 면 고르기, 전개도 그리기 → 전개도의 선분의 길이·알맞은 전개도 고르기,
//    돌려 만든 입체도형 그리기 → 만들어지는 입체도형 고르기, 본 모양 그리기 → 본 모양 고르기·잘못 그린 본 모양).
//
// 뺀 것과 까닭(단원 전체)
//  - 넓이를 구하는 것(①58·60·61·62·65·66·69 ②27·47·56 ③61~64·67 심27·28·40~43·52·54·55·58·60): 옆면의 넓이·전개도의 넓이·롤러로 칠한 넓이는 원기둥의 겉넓이(중학교),
//    밑면의 넓이·본 모양의 넓이·돌리기 전 평면도형의 넓이는 원의 넓이·다각형의 넓이(측정)의 일이다. 넓이는 한 번도 싣지 않았다.
//  - 둘레를 여러 단계로 셈하는 것(①59·63·64·71 ②25·26·55 ③65·66 심26·29·30·36~39·53·56·61): 옆면의 둘레·전개도의 둘레·본 모양의 둘레·돌리기 전 도형의 둘레는
//    원주를 구한 뒤 다시 더하는 길이 셈(측정)이다.
//  - 원주만 셈하는 문장제(①67·68·70 ②46·63 ③50 심45·51·59·62): 밑면의 둘레·통에 두른 띠·굴러간 거리는 「원주율과 원의 넓이」 단원의 일이다.
//    이 단원이 묻는 「옆면의 가로 = 밑면의 둘레」는 전개도 문항으로 싣는다.
//  - 읽은 길이 둘의 합·차(①12 ②11·24·33 ③49·60 심11): 덤 셈을 떼고 읽기만 싣는다(높이·모선의 길이·밑면의 지름 읽기).
//  - 뜻 없는 셈(②59의 변형 ③59 심13): 구성 요소의 수를 더하고 곱하는 것. 수가 다른 하나를 가리는 문항만 실었다.
//  - 조건을 거꾸로 풀어 길이를 찾는 것(①69 ②26 심30·37·55·63), 원뿔의 전개도, 구를 자른 면(①66 ②56): 방정식 꼴이거나 교육과정이 다루지 않는다고 한 것, 중학교 내용이다.
//  - 색칠하기·그리기(①8·21·44 ②14·28·48·53 ③11·13·20·28·32·51 심35), 까닭·같은 점 쓰기(①5·15·55 ②20·60 ③18·58 심22), 놀이판(③5): 고르기로 바꿀 수 있는 것은 바꾸어 실었다.
// 묻는 말: 수나 값은 「~은?/~는?」, 양은 「몇 ~인가?」. 수와 단위 기호는 띄어 쓴다(7 cm).
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, N, M, C, D } = B.kit;
  const G = B.kit.geo;
  const SOLID = '6수03-07', NET = '6수03-08';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  const TAGS = ['가', '나', '다', '라', '마', '바'], MARKS = ['㉠', '㉡', '㉢', '㉣', '㉤'];
  const cm = (v) => v + ' cm';
  const fixed = (...values) => ({ calc: values.map((v, i) => [String(v), i]), unseen: values });
  // 길이 하나를 답하는 문항: 자연수이면 자연수 칸, 소수이면 소수 칸
  const Len = (text, value, o) => (Number.isInteger(value) ? N(text, value, o) : D(text, value, o));
  const field = (label, answer) => Object.assign({ label, answer, unit: 'cm' }, Number.isInteger(answer) ? {} : { decimal: true });

  // ── 보기 짜기 ────────────────────────────────────────────────
  // 여럿을 고르는 문제의 보기: 맞는 묶음 하나와, 거기서 하나를 빼거나 더하거나 바꾼 틀린 묶음 셋
  function setOptions(d, labels, flags, join) {
    const key = (list) => list.join(join || ', '), right = labels.filter((_, i) => flags[i]), pool = [];
    labels.forEach((_, i) => { const flipped = labels.filter((__, j) => (j === i ? !flags[j] : flags[j])); if (flipped.length) pool.push(flipped); });
    labels.forEach((_, i) => labels.forEach((__, j) => { if (flags[i] && !flags[j]) pool.push(labels.filter((___, k) => (k === i ? false : k === j ? true : flags[k]))); }));
    const out = [right], seen = new Set([key(right)]);
    for (const cand of d.shuffle(pool)) { if (out.length === 4) break; if (!seen.has(key(cand))) { seen.add(key(cand)); out.push(cand); } }
    const list = d.shuffle(out);
    return { options: list.map(key), answer: list.findIndex((o) => key(o) === key(right)), sets: list };
  }
  // 설명 고르기: want 가 true 이면 옳은 것 하나와 틀린 것 셋, false 이면 옳은 것 셋과 틀린 것 하나. 틀린 설명은 [틀린 말, 바로잡는 말]로 적는다.
  function say(d, text, trues, falses, want, lead, figure) {
    const wrong = d.shuffle(falses).slice(0, want ? 3 : 1), rows = d.shuffle((want ? [d.pick(trues)] : d.shuffle(trues).slice(0, 3)).map((t) => [t, true]).concat(wrong.map((f) => [f[0], false])));
    return C(text, rows.map((r) => r[0]), rows.findIndex((r) => r[1] === want), {
      figure, explain: [lead].concat(wrong.map((f) => f[1])).filter(Boolean).join(' '), facts: { truth: rows.map((r) => r[1]), want }
    });
  }
  // 낱말 하나 고르기
  function pickWord(d, text, want, others, explain, figure) {
    const options = d.shuffle([want].concat(others));
    return C(text, options, options.indexOf(want), { figure, explain, facts: { truth: options.map((o) => o === want), want: true } });
  }
  // 차례로 쓴 것 고르기: 맞는 차례 하나와 다른 차례 셋
  function pickOrder(d, right, pool) {
    const key = (list) => list.join(', '), seen = new Set([key(right)]), out = [right];
    for (const cand of d.shuffle(pool)) { if (out.length === 4) break; if (!seen.has(key(cand))) { seen.add(key(cand)); out.push(cand); } }
    const list = d.shuffle(out);
    return { options: list.map(key), answer: list.findIndex((o) => key(o) === key(right)), truth: list.map((o) => key(o) === key(right)) };
  }
  const perms3 = (list) => [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]].map((p) => p.map((i) => list[i]));

  // ── 그림(픽셀 단위) ──────────────────────────────────────────
  // 눈높이: 평평하게 놓인 원(반지름 r)은 가로 반지름 r, 세로 반지름 r × TILT 인 타원으로 보인다. 화면에서 아래쪽이 앞이다.
  const RAD = Math.PI / 180, TILT = 0.3;
  const f1 = (n) => Math.round(n * 10) / 10;
  const xy = (p) => f1(p[0]) + ' ' + f1(p[1]);
  const ptsOf = (list) => list.map((p) => f1(p[0]) + ',' + f1(p[1])).join(' ');
  const CREAM = '#fff8e1', YELLOW = 'rgba(251,191,36,0.55)', BLUE = 'rgba(96,165,250,0.4)', RED = '#dc2626', PALE = '#dbeafe', INK = '#1e293b';
  const isMark = (text) => /^[㉠-㉤]$/.test(text);
  // 글의 너비(어림): 한글·기호는 글자 크기만큼, 숫자·로마자는 그 0.58배
  const wide = (text, size) => Array.from(String(text)).reduce((s, ch) => s + (/[0-9a-zA-Z]/.test(ch) ? 0.58 : ch === ' ' || ch === '.' ? 0.3 : 1), 0) * (size || 12);
  // 선분. kind: ''(실선), 'dash'(점선), 'thin'(가는 선). css 로 빛깔·굵기를 바꾼다.
  const stroke = (p, q, kind, css) => '<line class="mb-line' + (kind === 'dash' ? ' is-cut' : kind === 'thin' ? ' is-thin' : '') + '"' + (css ? ' style="' + css + '"' : '') + ' x1="' + f1(p[0]) + '" y1="' + f1(p[1]) + '" x2="' + f1(q[0]) + '" y2="' + f1(q[1]) + '"/>';
  const curve = (d, kind, css) => '<path class="mb-line' + (kind === 'dash' ? ' is-cut' : kind === 'thin' ? ' is-thin' : '') + '" style="fill:none' + (css ? ';' + css : '') + '" d="' + d + '"/>';
  const blob = (d, color) => '<path d="' + d + 'Z" style="fill:' + color + ';stroke:none"/>';
  const fill = (list, color) => '<polygon points="' + ptsOf(list) + '" style="fill:' + color + ';stroke:none"/>';
  const dot = (p, r, color) => '<circle cx="' + f1(p[0]) + '" cy="' + f1(p[1]) + '" r="' + (r || 2.4) + '" style="fill:' + (color || INK) + '"/>';
  const word = (p, text, kind) => '<text class="mb-label' + (kind ? ' ' + kind : '') + '"' + (isMark(text) ? ' style="font-size:15px"' : '') + ' x="' + f1(p[0]) + '" y="' + f1(p[1]) + '" text-anchor="middle" dominant-baseline="central">' + text + '</text>';
  const BOLD = 'stroke:' + RED + ';stroke-width:3.2';
  // 타원(가운데 c, 반지름 rx·ry) 위의 점. t 는 오른쪽 끝에서 앞쪽(화면 아래)으로 도는 각(도). lean 은 오른쪽으로 갈수록 위로 올라가는 기울기(비스듬히 잘린 면)
  const onEll = (c, rx, ry, t, lean) => [c[0] + rx * Math.cos(t * RAD), c[1] + ry * Math.sin(t * RAD) - (lean || 0) * rx * Math.cos(t * RAD)];
  // 타원의 호(t0 → t1)를 잘게 나눈 길
  function arcD(c, rx, ry, t0, t1, lean) {
    const n = Math.max(8, Math.ceil(Math.abs(t1 - t0) / 5)); let out = '';
    for (let k = 0; k <= n; k += 1) out += (k ? 'L' : 'M') + xy(onEll(c, rx, ry, t0 + (t1 - t0) * k / n, lean));
    return out;
  }
  const tail = (d) => 'L' + d.slice(1);
  // 그릴 것을 모으며 차지한 자리를 재어, 끝에 꼭 맞는 크기의 그림으로 낸다.
  function canvas() {
    const parts = []; let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    const see = (x, y) => { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); };
    const cv = {
      add: (html) => { parts.push(html); return cv; },
      point: (p) => see(p[0], p[1]),
      box: (c, hw, hh) => { see(c[0] - hw, c[1] - hh); see(c[0] + hw, c[1] + hh); },
      // 글(가운데 c). kind: ''(이름), 'is-length'(길이)
      write: (c, text, kind) => { const size = isMark(text) ? 15 : kind === 'is-length' ? 12 : 13; parts.push(word(c, text, kind)); cv.box(c, wide(text, size) / 2 + 1, size / 2 + 2); return cv; },
      size: () => [x1 - x0, y1 - y0],
      // 너비가 64px 에 못 미치는 그림은 양옆 여백을 넓힌다(화면 검사가 너무 좁은 그림을 떨어뜨린다).
      out: (label, pad) => {
        const m = pad == null ? 6 : pad, side = Math.max(m, (64 - (x1 - x0)) / 2), w = x1 - x0 + side * 2, h = y1 - y0 + m * 2;
        return '<svg class="mb-geo" viewBox="' + f1(x0 - side) + ' ' + f1(y0 - m) + ' ' + f1(w) + ' ' + f1(h) + '" width="' + Math.ceil(w) + '" role="img" aria-label="' + label + '">' + parts.join('') + '</svg>';
      }
    };
    return cv;
  }
  const one = (draw, label, pad) => { const cv = canvas(); draw(cv); return cv.out(label, pad); };
  const tiles = (list, labels) => G.tiles(list.map((svg, i) => [(labels || TAGS)[i], svg]));
  // 가리키는 선: spot(작은 점)에서 at(글 자리) 쪽으로 가는 선을 긋고 글을 적는다.
  function leader(cv, at, spot, text) {
    const dx = at[0] - spot[0], dy = at[1] - spot[1], L = Math.hypot(dx, dy), gap = isMark(text) ? 10 : 9;
    cv.add(stroke(spot, [at[0] - dx / L * gap, at[1] - dy / L * gap], 'thin') + dot(spot, 2));
    cv.write(at, text);
  }
  // 길이를 나타내는 선: p–q 를 긋고 두 끝에 짧은 금을 긋는다.
  function span(cv, p, q) {
    const L = Math.hypot(q[0] - p[0], q[1] - p[1]), n = [-(q[1] - p[1]) / L * 4, (q[0] - p[0]) / L * 4];
    cv.add(stroke(p, q, 'thin') + stroke([p[0] - n[0], p[1] - n[1]], [p[0] + n[0], p[1] + n[1]], 'thin') + stroke([q[0] - n[0], q[1] - n[1]], [q[0] + n[0], q[1] + n[1]], 'thin'));
    cv.point(p); cv.point(q);
  }
  // 양 끝에 화살촉이 달린 선(p–q 의 길이를 나타낸다). 가운데에 글을 적고 그 자리의 선은 비운다.
  function arrowSpan(cv, p, q, text, kind) {
    const L = Math.hypot(q[0] - p[0], q[1] - p[1]), u = [(q[0] - p[0]) / L, (q[1] - p[1]) / L], n = [-u[1], u[0]], m = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
    const size = isMark(text) ? 15 : 12, gap = (Math.abs(u[0]) * wide(text, size) + Math.abs(u[1]) * size) / 2 + 4;
    const head = (tip, s) => fill([tip, [tip[0] + u[0] * 6 * s + n[0] * 3, tip[1] + u[1] * 6 * s + n[1] * 3], [tip[0] + u[0] * 6 * s - n[0] * 3, tip[1] + u[1] * 6 * s - n[1] * 3]], '#475569');
    cv.add(stroke(p, [m[0] - u[0] * gap, m[1] - u[1] * gap], 'thin') + stroke([m[0] + u[0] * gap, m[1] + u[1] * gap], q, 'thin') + head(p, 1) + head(q, -1));
    cv.point(p); cv.point(q); cv.write(m, text, kind);
  }
  // 선분 p–q 옆(side: 1 이면 진행 방향의 오른쪽, -1 이면 왼쪽)에 글을 적는다.
  function beside(cv, p, q, side, text, kind, at) {
    const L = Math.hypot(q[0] - p[0], q[1] - p[1]), n = [-(q[1] - p[1]) / L * side, (q[0] - p[0]) / L * side], t = at == null ? 0.5 : at;
    const size = isMark(text) ? 15 : kind === 'is-length' ? 12 : 13, hw = wide(text, size) / 2 + 1, hh = size / 2 + 1, far = 4 + hw * Math.abs(n[0]) + hh * Math.abs(n[1]);
    cv.write([p[0] + (q[0] - p[0]) * t + n[0] * far, p[1] + (q[1] - p[1]) * t + n[1] * far], text, kind);
  }
  // 직각 표시: 점 v 에서 a 쪽, b 쪽으로 한 변이 s 인 작은 네모
  function corner(v, a, b, s) {
    const size = s || 7, ua = [a[0] - v[0], a[1] - v[1]], ub = [b[0] - v[0], b[1] - v[1]], la = Math.hypot(ua[0], ua[1]), lb = Math.hypot(ub[0], ub[1]);
    const p1 = [v[0] + ua[0] / la * size, v[1] + ua[1] / la * size], p3 = [v[0] + ub[0] / lb * size, v[1] + ub[1] / lb * size], p2 = [p1[0] + p3[0] - v[0], p1[1] + p3[1] - v[1]];
    return '<polyline class="mb-mark" points="' + ptsOf([p1, p2, p3]) + '"/>';
  }

  // ── 그림: 원기둥·원뿔·구와 닮은 도형들 ───────────────────────
  // 원기둥. top: 윗면의 가운데, rx: 밑면의 반지름, h: 높이. o: { side, top, bottom(아랫면을 비쳐 보이게 칠함): 빛깔, bare: 윗면의 뒤쪽 선을 긋지 않는다(위에 다른 도형이 놓일 때) }
  function addCyl(cv, top, rx, h, o) {
    const opt = o || {}, ry = rx * TILT, bot = [top[0], top[1] + h], L = top[0] - rx, R = top[0] + rx;
    cv.box([top[0], top[1] + h / 2], rx, h / 2 + ry);
    cv.add(blob('M' + xy([L, top[1]]) + 'L' + xy([L, bot[1]]) + tail(arcD(bot, rx, ry, 180, 0)) + 'L' + xy([R, top[1]]) + tail(arcD(top, rx, ry, 0, 180)), opt.side || CREAM));
    cv.add(blob(arcD(top, rx, ry, 0, 360), opt.top || CREAM));
    if (opt.bottom) cv.add(blob(arcD(bot, rx, ry, 0, 360), opt.bottom));
    cv.add(curve(arcD(bot, rx, ry, 180, 360), 'dash') + curve(arcD(bot, rx, ry, 180, 0)) + stroke([L, top[1]], [L, bot[1]]) + stroke([R, top[1]], [R, bot[1]]) + curve(arcD(top, rx, ry, 180, 0)));
    if (!opt.bare) cv.add(curve(arcD(top, rx, ry, 180, 360)));
    return { top, bot, rx, ry, h };
  }
  // 원뿔. apex: 꼭짓점, rx: 밑면의 반지름, h: 높이. 옆 선은 꼭짓점에서 밑면 타원에 그은 접선이다(닿는 점은 타원의 양 끝보다 조금 뒤쪽).
  function addCone(cv, apex, rx, h, o) {
    const opt = o || {}, ry = rx * TILT, base = [apex[0], apex[1] + h], a = Math.asin(Math.min(0.98, ry / h)) / RAD, tR = onEll(base, rx, ry, -a), tL = onEll(base, rx, ry, 180 + a);
    cv.box([apex[0], apex[1] + (h + ry) / 2], rx, (h + ry) / 2);
    cv.add(blob('M' + xy(apex) + 'L' + xy(tL) + tail(arcD(base, rx, ry, 180 + a, -a)), opt.side || CREAM));
    if (opt.bottom) cv.add(blob(arcD(base, rx, ry, 0, 360), opt.bottom));
    if (!opt.bare) cv.add(curve(arcD(base, rx, ry, 180 + a, 360 - a), 'dash'));
    cv.add(curve(arcD(base, rx, ry, 180 + a, -a)) + stroke(apex, tL) + stroke(apex, tR));
    return { apex, base, rx, ry, h, tL, tR };
  }
  // 구. c: 중심, R: 반지름. 가운데를 두르는 원은 앞쪽 반은 가는 실선, 뒤쪽 반은 점선으로 긋는다.
  function addSphere(cv, c, R, o) {
    const opt = o || {};
    cv.box(c, R, R);
    cv.add('<circle class="mb-poly" cx="' + f1(c[0]) + '" cy="' + f1(c[1]) + '" r="' + f1(R) + '"' + (opt.fill ? ' style="fill:' + opt.fill + '"' : '') + '/>');
    cv.add(curve(arcD(c, R, R * TILT, 180, 360), 'dash') + curve(arcD(c, R, R * TILT, 180, 0), 'thin'));
    return { c, R };
  }
  // 위아래 원의 크기가 다른 도형(원뿔의 윗부분을 밑면과 평행하게 잘라 낸 모양). r1: 위, r2: 아래
  function addFrustum(cv, top, r1, r2, h) {
    const ry1 = r1 * TILT, ry2 = r2 * TILT, bot = [top[0], top[1] + h], s = r2 > r1 ? 1 : -1, a = s * Math.asin(Math.min(0.98, ry2 * Math.abs(r2 - r1) / (h * r2))) / RAD;
    cv.box([top[0], top[1] + h / 2], Math.max(r1, r2), h / 2 + Math.max(ry1, ry2));
    cv.add(blob('M' + xy(onEll(top, r1, ry1, 180 + a)) + 'L' + xy(onEll(bot, r2, ry2, 180 + a)) + tail(arcD(bot, r2, ry2, 180 + a, -a)) + 'L' + xy(onEll(top, r1, ry1, -a)) + tail(arcD(top, r1, ry1, -a, 180 + a)), CREAM));
    cv.add(blob(arcD(top, r1, ry1, 0, 360), CREAM));
    cv.add(curve(arcD(bot, r2, ry2, 180 + a, 360 - a), 'dash') + curve(arcD(bot, r2, ry2, 180 + a, -a)) + stroke(onEll(top, r1, ry1, 180 + a), onEll(bot, r2, ry2, 180 + a)) + stroke(onEll(top, r1, ry1, -a), onEll(bot, r2, ry2, -a)) + curve(arcD(top, r1, ry1, 0, 360)));
  }
  // 윗면이 비스듬히 잘린 둥근 기둥(두 면이 평행하지 않다). lean: 윗면이 오른쪽으로 갈수록 올라가는 기울기
  function addSlant(cv, top, rx, h, lean) {
    const ry = rx * TILT, bot = [top[0], top[1] + h], L = top[0] - rx, R = top[0] + rx, yL = top[1] + lean * rx, yR = top[1] - lean * rx;
    cv.box([top[0], top[1] + h / 2], rx, h / 2 + ry); cv.point([R, yR - ry]); cv.point([L, yL - ry]);
    cv.add(blob('M' + xy([L, yL]) + 'L' + xy([L, bot[1]]) + tail(arcD(bot, rx, ry, 180, 0)) + 'L' + xy([R, yR]) + tail(arcD(top, rx, ry, 0, 180, lean)), CREAM));
    cv.add(blob(arcD(top, rx, ry, 0, 360, lean), CREAM));
    cv.add(curve(arcD(bot, rx, ry, 180, 360), 'dash') + curve(arcD(bot, rx, ry, 180, 0)) + stroke([L, yL], [L, bot[1]]) + stroke([R, yR], [R, bot[1]]) + curve(arcD(top, rx, ry, 0, 360, lean)));
  }
  // 눕혀 놓은 원기둥. c: 왼쪽 밑면의 가운데, R: 밑면의 반지름, len: 높이(가로로 놓인다). 오른쪽 밑면이 보인다.
  function addLying(cv, c, R, len) {
    const ex = R * TILT, r = [c[0] + len, c[1]];
    cv.box([c[0] + len / 2, c[1]], len / 2 + ex, R);
    cv.add(blob('M' + xy([c[0], c[1] - R]) + tail(arcD(c, ex, R, 270, 90)) + 'L' + xy([r[0], r[1] + R]) + tail(arcD(r, ex, R, 90, -90)), CREAM));
    cv.add(curve(arcD(c, ex, R, -90, 90), 'dash') + curve(arcD(c, ex, R, 270, 90)) + stroke([c[0], c[1] - R], [r[0], r[1] - R]) + stroke([c[0], c[1] + R], [r[0], r[1] + R]));
    cv.add(blob(arcD(r, ex, R, 0, 360), CREAM) + curve(arcD(r, ex, R, 0, 360)));
    return { left: c, right: r, ex, R, len };
  }
  // 공을 반으로 자른 모양(평평한 면이 위)
  function addBowl(cv, c, R) {
    cv.box([c[0], c[1] + R / 2 - R * TILT / 2], R, R / 2 + R * TILT / 2);
    cv.add(blob(arcD(c, R, R, 180, 0), CREAM) + curve(arcD(c, R, R, 180, 0)) + blob(arcD(c, R, R * TILT, 0, 360), CREAM) + curve(arcD(c, R, R * TILT, 0, 360)));
  }
  // 옆으로 길쭉한 둥근 도형(달걀 모양)
  function addEgg(cv, c, a, b) {
    cv.box(c, a, b);
    cv.add(blob(arcD(c, a, b, 0, 360), CREAM) + curve(arcD(c, a, b, 0, 360)) + curve(arcD(c, a, b * TILT, 180, 360), 'dash') + curve(arcD(c, a, b * TILT, 180, 0), 'thin'));
  }
  // 면이 평평한 입체도형. verts: [x, y(안쪽), z(위)](px), faces: 꼭짓점 번호의 고리. 원기둥과 같은 눈높이로 본다.
  function addPoly(cv, at, verts, faces) {
    const sub3 = (p, q) => [p[0] - q[0], p[1] - q[1], p[2] - q[2]], dot3 = (p, q) => p[0] * q[0] + p[1] * q[1] + p[2] * q[2];
    const cross3 = (p, q) => [p[1] * q[2] - p[2] * q[1], p[2] * q[0] - p[0] * q[2], p[0] * q[1] - p[1] * q[0]];
    const avg = (list) => [0, 1, 2].map((i) => list.reduce((s, p) => s + p[i], 0) / list.length), heart = avg(verts);
    const seen = faces.map((ring) => { let n = cross3(sub3(verts[ring[1]], verts[ring[0]]), sub3(verts[ring[2]], verts[ring[0]])); if (dot3(n, sub3(avg(ring.map((v) => verts[v])), heart)) < 0) n = n.map((x) => -x); return dot3(n, [0, -1, TILT]) > 1e-9; });
    const P = verts.map(([x, y, z]) => [at[0] + x, at[1] - (z + y * TILT)]), sides = new Map();
    P.forEach(cv.point);
    faces.forEach((ring, f) => { if (seen[f]) cv.add(fill(ring.map((v) => P[v]), CREAM)); ring.forEach((v, i) => { const w = ring[(i + 1) % ring.length], key = Math.min(v, w) + '-' + Math.max(v, w); sides.set(key, (sides.get(key) || false) || seen[f]); }); });
    for (const pass of [false, true]) sides.forEach((shown, key) => { if (shown !== pass) return; const [v, w] = key.split('-').map(Number); cv.add(stroke(P[v], P[w], shown ? '' : 'dash')); });
  }
  const ngon = (n, R, turn) => Array.from({ length: n }, (_, i) => [R * Math.cos((turn + 360 * i / n) * RAD), R * Math.sin((turn + 360 * i / n) * RAD)]);
  function prismOf(n, R, H, turn) {
    const base = ngon(n, R, turn), ring = base.map((_, i) => i);
    return { verts: base.map(([x, y]) => [x, y, 0]).concat(base.map(([x, y]) => [x, y, H])), faces: [ring, ring.map((i) => i + n)].concat(ring.map((i) => [i, (i + 1) % n, (i + 1) % n + n, i + n])) };
  }
  function pyramidOf(n, R, H, turn) {
    const base = ngon(n, R, turn), ring = base.map((_, i) => i);
    return { verts: base.map(([x, y]) => [x, y, 0]).concat([[0, 0, H]]), faces: [ring].concat(ring.map((i) => [i, (i + 1) % n, n])) };
  }
  const GON = { 3: '삼각형', 4: '사각형', 5: '오각형', 6: '육각형' }, TURN = { 3: -84, 4: -62, 5: -80, 6: -8 };
  const SAID = {
    cyl: '위와 아래의 면이 크기가 같은 원이고 옆이 굽은 기둥 모양의 도형', lying: '옆으로 놓인, 마주 보는 두 면이 크기가 같은 원이고 옆이 굽은 기둥 모양의 도형', cone: '아래의 면이 원이고 위가 뾰족한 도형', ball: '공 모양의 도형',
    frustum: '위의 원이 아래의 원보다 작고 옆이 굽은 도형', slant: '위의 면이 비스듬히 기울어진 둥근 기둥 모양의 도형', bowl: '공을 반으로 자른 모양의 도형', egg: '옆으로 길쭉한 둥근 도형'
  };
  // 작은 그림 칸에 넣는 입체도형들. k: 크기(기본 1). kind: 'cyl' | 'cone' | 'ball' | 그 밖(닮았지만 아닌 것)
  const ART = {
    cylTall: { kind: 'cyl', art: (k) => one((cv) => addCyl(cv, [0, 0], 21 * (k || 1), 56 * (k || 1)), SAID.cyl) },
    cylMid: { kind: 'cyl', art: (k) => one((cv) => addCyl(cv, [0, 0], 27 * (k || 1), 42 * (k || 1)), SAID.cyl) },
    cylWide: { kind: 'cyl', art: (k) => one((cv) => addCyl(cv, [0, 0], 33 * (k || 1), 26 * (k || 1)), SAID.cyl) },
    cylFlat: { kind: 'cyl', art: (k) => one((cv) => addCyl(cv, [0, 0], 34 * (k || 1), 11 * (k || 1)), SAID.cyl) },
    cylLying: { kind: 'cyl', art: (k) => one((cv) => addLying(cv, [0, 0], 21 * (k || 1), 44 * (k || 1)), SAID.lying) },
    coneTall: { kind: 'cone', art: (k) => one((cv) => addCone(cv, [0, 0], 23 * (k || 1), 60 * (k || 1)), SAID.cone) },
    coneWide: { kind: 'cone', art: (k) => one((cv) => addCone(cv, [0, 0], 32 * (k || 1), 38 * (k || 1)), SAID.cone) },
    ball: { kind: 'ball', art: (k) => one((cv) => addSphere(cv, [0, 0], 30 * (k || 1)), SAID.ball) },
    ballSmall: { kind: 'ball', art: (k) => one((cv) => addSphere(cv, [0, 0], 19 * (k || 1)), SAID.ball) },
    frustum: { kind: 'frustum', art: (k) => one((cv) => addFrustum(cv, [0, 0], 19 * (k || 1), 31 * (k || 1), 46 * (k || 1)), SAID.frustum) },
    slant: { kind: 'slant', art: (k) => one((cv) => addSlant(cv, [0, 0], 25 * (k || 1), 50 * (k || 1), 0.42), SAID.slant) },
    bowl: { kind: 'bowl', art: (k) => one((cv) => addBowl(cv, [0, 0], 31 * (k || 1)), SAID.bowl) },
    egg: { kind: 'egg', art: (k) => one((cv) => addEgg(cv, [0, 0], 34 * (k || 1), 22 * (k || 1)), SAID.egg) }
  };
  [3, 4, 6].forEach((n) => { ART['prism' + n] = { kind: 'prism', sides: n, art: (k) => one((cv) => { const p = prismOf(n, 27 * (k || 1), 44 * (k || 1), TURN[n]); addPoly(cv, [0, 0], p.verts, p.faces); }, `위와 아래의 면이 ${GON[n]}인 기둥 모양의 도형`) }; });
  [3, 4, 5].forEach((n) => { ART['pyr' + n] = { kind: 'pyramid', sides: n, art: (k) => one((cv) => { const p = pyramidOf(n, 29 * (k || 1), 54 * (k || 1), TURN[n]); addPoly(cv, [0, 0], p.verts, p.faces); }, `아래의 면이 ${GON[n]}이고 위가 뾰족한 도형`) }; });
  const pickArt = (d, keys, n) => d.shuffle(keys).slice(0, n).map((key) => Object.assign({ key }, ART[key]));

  // ── 그림: 길이·이름을 적은 겨냥 그림 ─────────────────────────
  // 원기둥. o: { r: 반지름 글, d: 지름 글, h: 높이 글, tint: addCyl 의 빛깔, label }
  function cylFig(rx, h, o) {
    const cv = canvas(), s = addCyl(cv, [0, 0], rx, h, o.tint);
    if (o.d) { cv.add(stroke([-rx, 0], [rx, 0], 'thin') + dot([0, 0], 2)); cv.write([0, -s.ry - 9], o.d, 'is-length'); }
    if (o.r) { cv.add(stroke([0, 0], [rx, 0], 'thin') + dot([0, 0], 2)); cv.write([rx / 2 + 3, -s.ry - 8], o.r, 'is-length'); }
    if (o.h) cv.write([rx + 5 + wide(o.h, isMark(o.h) ? 15 : 12) / 2, h / 2], o.h, 'is-length');
    return cv.out(o.label);
  }
  // 원뿔. o: { h: 높이 글, l: 모선 글, r: 반지름 글, d: 지름 글, lSide: 모선 글을 적는 쪽(1 오른쪽, -1 왼쪽), inner: 높이 선과 반지름 선만 긋는다, names: [꼭짓점, 왼쪽 끝, 오른쪽 끝]의 이름, label }
  function coneFig(rx, h, o) {
    const cv = canvas(), s = addCone(cv, [0, 0], rx, h), center = [0, h];
    if (o.h || o.r || o.inner) cv.add(stroke([0, 0], center, 'dash') + stroke(center, [rx, h], 'dash') + corner(center, [0, 0], [rx, h]) + dot(center, 2));
    if (o.d) cv.add(stroke([-rx, h], [rx, h], 'dash') + dot(center, 2));
    if (o.h) { const lw = wide(o.h, isMark(o.h) ? 15 : 12), t = Math.min(0.8, Math.max(0.56, (lw + 8) / rx)); cv.write([-4 - lw / 2, h * t], o.h, 'is-length'); }
    if (o.r) cv.write([rx / 2 + 2, h + s.ry * 0.87 + 9], o.r, 'is-length');
    if (o.d) cv.write([0, h + s.ry + 9], o.d, 'is-length');
    if (o.l) { if ((o.lSide || 1) > 0) beside(cv, [0, 0], s.tR, -1, o.l, 'is-length'); else beside(cv, [0, 0], s.tL, 1, o.l, 'is-length'); }
    if (o.names) { cv.add(dot([0, 0]) + dot(s.tL) + dot(s.tR)); cv.write([0, -11], o.names[0]); cv.write([s.tL[0] - 10, s.tL[1] + 5], o.names[1]); cv.write([s.tR[0] + 10, s.tR[1] + 5], o.names[2]); }
    return cv.out(o.label);
  }
  // 구. o: { r: 반지름 글(중심에서 오른쪽 위로 그은 선), d: 중심을 지나는 선분의 글, label }
  function sphereFig(R, o) {
    const cv = canvas(); addSphere(cv, [0, 0], R);
    const p = onEll([0, 0], R, R, -40), q = onEll([0, 0], R, R, 140);
    if (o.r) { cv.add(stroke([0, 0], p) + dot([0, 0])); beside(cv, [0, 0], p, -1, o.r, 'is-length'); }
    if (o.d) { cv.add(stroke(q, p) + dot([0, 0])); beside(cv, [0, 0], p, -1, o.d, 'is-length', 0.5); }
    return cv.out(o.label);
  }

  // ── 그림: 원기둥의 전개도 ────────────────────────────────────
  // r: 밑면의 반지름, w: 옆면의 가로, h: 옆면의 세로(px).
  // kind: 'ok'(두 원이 옆면의 위와 아래 가운데), 'offset'(두 원의 자리가 어긋남 — 전개도가 된다), 'size'(두 원의 크기가 다름), 'side'(두 원이 옆면의 같은 쪽), 'trap'(옆면이 사다리꼴),
  //       'one'(원이 하나), 'adjacent'(두 원이 옆면의 이웃한 두 변에). 작은 그림 칸(netTile)에서는 'turned'(옆으로 돌린 전개도), 'sideTurned'(옆으로 돌린 'side')도 쓴다.
  // o: { kind, turned(옆으로 돌려 그린다), names(옆면의 꼭짓점 ㄱㄴㄷㄹ), wText·hText·rText·dText(가로·세로·반지름·지름 글), bold: 'w'|'h'(굵게 긋는 변), faces: [위 원, 옆면, 아래 원]에 적는 글, label }
  function netFig(r, w, h, o) {
    const opt = o || {}, kind = opt.kind || 'ok', cv = canvas(), tf = opt.turned ? (p) => [p[1], p[0]] : (p) => p;
    const e = kind === 'trap' ? w * 0.12 : 0, quad = [[e, 0], [0, h], [w, h], [w - e, 0]];
    const circles = kind === 'offset' ? [[[w * 0.27, -r], r], [[w * 0.73, h + r], r]]
      : kind === 'size' ? [[[w / 2, -r], r], [[w / 2, h + r * 0.6], r * 0.6]]
      : kind === 'side' ? [[[w * 0.26, -r], r], [[w * 0.74, -r], r]]
      : kind === 'one' ? [[[w / 2, -r], r]]
      : kind === 'adjacent' ? [[[w / 2, -r], r], [[w + r, h / 2], r]]
      : [[[w / 2, -r], r], [[w / 2, h + r], r]];
    quad.map(tf).forEach(cv.point);
    cv.add('<polygon class="mb-poly" points="' + ptsOf(quad.map(tf)) + '"/>');
    circles.forEach(([c, rad]) => { const p = tf(c); cv.box(p, rad, rad); cv.add('<circle class="mb-poly" cx="' + f1(p[0]) + '" cy="' + f1(p[1]) + '" r="' + f1(rad) + '"/>'); });
    if (opt.bold === 'w') cv.add(stroke([0, h], [w, h], '', BOLD));
    if (opt.bold === 'h') cv.add(stroke([w, 0], [w, h], '', BOLD));
    if (opt.names) [[[-8, -8], 'ㄱ'], [[-8, h + 8], 'ㄴ'], [[w + 8, h + 8], 'ㄷ'], [[w + 8, -8], 'ㄹ']].forEach(([p, name]) => cv.write(p, name));
    if (opt.faces) { cv.write([w / 2, -r], opt.faces[0]); cv.write([w / 2, h / 2], opt.faces[1]); cv.write([w / 2, h + r], opt.faces[2]); }
    const top = circles[0][0];
    if (opt.rText) { cv.add(stroke(top, [top[0] + r, top[1]], 'thin') + dot(top, 2)); cv.write([top[0] + r + 5 + wide(opt.rText, isMark(opt.rText) ? 15 : 12) / 2, top[1] - 1], opt.rText, 'is-length'); }
    if (opt.dText) { cv.add(stroke([top[0] - r, top[1]], [top[0] + r, top[1]], 'thin') + dot(top, 2)); cv.write([top[0] + r + 5 + wide(opt.dText, 12) / 2, top[1] - 1], opt.dText, 'is-length'); }
    if (opt.wText) arrowSpan(cv, [4, h / 2], [w - 4, h / 2], opt.wText, isMark(opt.wText) ? '' : 'is-length');
    if (opt.hText) cv.write([w + (opt.names ? 8 : 5) + wide(opt.hText, isMark(opt.hText) ? 15 : 12) / 2, h / 2], opt.hText, 'is-length');
    return cv.out(opt.label || '원 2개와 사각형 1개를 이어 붙인 그림', 5);
  }
  // 작은 그림 칸에 넣는 전개도(진짜와 가짜). why: 전개도가 되지 않는 까닭, note: 전개도가 되는 그림에서 눈여겨볼 점
  const NETS = {
    ok: { net: true, said: '직사각형의 위와 아래에 크기가 같은 원이 하나씩 붙은 그림' },
    offset: { net: true, said: '직사각형의 위와 아래에 크기가 같은 원이 하나씩, 서로 어긋난 자리에 붙은 그림', note: '두 원이 붙은 자리가 어긋나 있어도 직사각형의 마주 보는 두 변에 하나씩 붙어 있다' },
    turned: { net: true, said: '직사각형의 왼쪽과 오른쪽에 크기가 같은 원이 하나씩 붙은 그림', note: '옆으로 돌려 그렸을 뿐 두 원이 직사각형의 마주 보는 두 변에 하나씩 붙어 있다' },
    size: { net: false, said: '직사각형의 위와 아래에 크기가 다른 원이 하나씩 붙은 그림', why: '두 밑면의 크기가 다르다' },
    side: { net: false, said: '직사각형의 위쪽 변에 크기가 같은 원 2개가 나란히 붙은 그림', why: '두 밑면이 옆면의 같은 쪽에 있어 접으면 서로 겹친다' },
    trap: { net: false, said: '사다리꼴의 위와 아래에 크기가 같은 원이 하나씩 붙은 그림', why: '옆면이 직사각형이 아니다' },
    one: { net: false, said: '직사각형의 위에 원이 하나만 붙은 그림', why: '밑면이 1개뿐이다' },
    adjacent: { net: false, said: '직사각형의 위쪽 변과 오른쪽 변에 크기가 같은 원이 하나씩 붙은 그림', why: '두 밑면이 옆면의 이웃한 두 변에 붙어 있어 마주 보지 않는다' },
    sideTurned: { net: false, said: '직사각형의 왼쪽 변에 크기가 같은 원 2개가 나란히 붙은 그림', why: '두 밑면이 옆면의 같은 쪽에 있어 접으면 서로 겹친다' }
  };
  const netTile = (key, r) => { const rad = r || 9, turned = key === 'turned' || key === 'sideTurned'; return netFig(rad, rad * 6.28, rad * 2.9, { kind: key === 'turned' ? 'ok' : key === 'sideTurned' ? 'side' : key, turned, label: NETS[key].said }); };
  // 길이를 적는 전개도: 옆면의 가로를 150px 로 잡고 밑면의 지름(dia)과 높이(height)의 비율대로 그린다. pi: 그림에 쓰는 원주율
  const netOf = (dia, height, pi, o) => { const k = 150 / (dia * pi); return netFig(dia * k / 2, 150, height * k, o); };

  // ── 그림: 평면도형을 한 변을 중심으로 돌리는 그림 ────────────
  // kind: 'rect'(직사각형) | 'tri'(직각삼각형) | 'half'(반원). a: 중심에서 뻗은 쪽의 길이(반원은 반지름), b: 중심이 되는 변의 길이(px).
  // 굵은 선이 중심이고 그 둘레에 도는 방향을 화살표로 그린다. flat 이면 가로로 놓인 변(아래쪽)이 중심이다.
  // o: { flat, aText, bText, cText(빗변), dText(반원의 지름), rText(반원의 반지름), label }
  function spin(kind, a, b, o) {
    const opt = o || {}, cv = canvas(), len = kind === 'half' ? a * 2 : b, at = opt.flat ? (p) => [p[1], -p[0]] : (p) => p;
    const shape = kind === 'rect' ? [[0, 0], [a, 0], [a, b], [0, b]] : kind === 'tri' ? [[0, 0], [0, b], [a, b]] : null;
    if (shape) { shape.map(at).forEach(cv.point); cv.add('<polygon class="mb-poly" points="' + ptsOf(shape.map(at)) + '"/>'); }
    else { cv.box([a / 2, a], a / 2, a); cv.add('<path class="mb-poly" d="' + arcD([0, a], a, a, -90, 90) + 'Z"/>'); }
    if (kind === 'tri') cv.add(corner(at([0, b]), at([0, 0]), at([a, b])));
    // 중심이 되는 선과 도는 방향
    const p0 = at([0, -20]), p1 = at([0, len + 14]), hub = at([0, -11]), ring = opt.flat ? [4.5, 11] : [11, 4.5];
    cv.add(stroke(p0, p1, '', 'stroke-width:2.6')); cv.point(p0); cv.point(p1);
    const sweep = opt.flat ? [-40, 250] : [230, -60], tip = onEll(hub, ring[0], ring[1], sweep[1]), before = onEll(hub, ring[0], ring[1], sweep[1] + (sweep[1] > sweep[0] ? -24 : 24));
    const ux = tip[0] - before[0], uy = tip[1] - before[1], ul = Math.hypot(ux, uy), nx = -uy / ul, ny = ux / ul;
    cv.add(curve(arcD(hub, ring[0], ring[1], sweep[0], sweep[1]), '', 'stroke:#2563eb;stroke-width:1.4') + fill([[tip[0] + ux / ul * 4, tip[1] + uy / ul * 4], [tip[0] + nx * 3.4, tip[1] + ny * 3.4], [tip[0] - nx * 3.4, tip[1] - ny * 3.4]], '#2563eb'));
    cv.box(hub, ring[0] + 4, ring[1] + 4);
    const kindOf = (text) => (isMark(text) ? '' : 'is-length'), half = (text) => wide(text, isMark(text) ? 15 : 12) / 2;
    if (!opt.flat) {
      if (kind === 'rect') { if (opt.aText) cv.write([a / 2 + 2, b + 11], opt.aText, kindOf(opt.aText)); if (opt.bText) cv.write([a + 6 + half(opt.bText), b / 2], opt.bText, kindOf(opt.bText)); }
      if (kind === 'tri') {
        if (opt.aText) cv.write([a / 2 + 2, b + 11], opt.aText, kindOf(opt.aText));
        if (opt.bText) cv.write([-7 - half(opt.bText), b / 2], opt.bText, kindOf(opt.bText));
        if (opt.cText) beside(cv, [0, 0], [a, b], -1, opt.cText, kindOf(opt.cText));
      }
      if (kind === 'half') {
        if (opt.dText) { span(cv, [-8, 0], [-8, a * 2]); cv.write([-14 - half(opt.dText), a], opt.dText, kindOf(opt.dText)); }
        if (opt.rText) { cv.add(stroke([0, a], [a, a], 'thin') + dot([0, a], 2)); cv.write([a / 2 + 4, a - 9], opt.rText, kindOf(opt.rText)); }
      }
    } else {
      if (opt.bText) cv.write([b / 2, 12], opt.bText, kindOf(opt.bText));
      if (kind === 'rect' && opt.aText) cv.write([b + 6 + half(opt.aText), -a / 2], opt.aText, kindOf(opt.aText));
      if (kind === 'tri') { if (opt.aText) cv.write([b + 6 + half(opt.aText), -a / 2 - 6], opt.aText, kindOf(opt.aText)); if (opt.cText) beside(cv, [0, 0], [b, -a], -1, opt.cText, kindOf(opt.cText)); }
    }
    return cv.out(opt.label);
  }

  // ── 그림: 위·앞·옆에서 본 모양 ──────────────────────────────
  // kind: 'circle'(지름 w) | 'rect'(가로 w, 세로 h) | 'tri'(밑변 w, 높이 h 인 이등변삼각형). o: { rText, dText, wText, hText, sText(삼각형의 비스듬한 변), label }
  function flatView(kind, w, h, o) {
    const opt = o || {}, cv = canvas(), half = (text) => wide(text, 12) / 2;
    if (kind === 'circle') {
      cv.box([0, 0], w / 2, w / 2); cv.add('<circle class="mb-poly" cx="0" cy="0" r="' + f1(w / 2) + '"/>');
      if (opt.rText) { cv.add(stroke([0, 0], [w / 2, 0], 'thin') + dot([0, 0], 2)); cv.write([w / 4 + 1, -12], opt.rText, 'is-length'); }
      if (opt.dText) { cv.add(stroke([-w / 2, 0], [w / 2, 0], 'thin') + dot([0, 0], 2)); cv.write([0, -12], opt.dText, 'is-length'); }
    } else if (kind === 'rect') {
      cv.box([0, 0], w / 2, h / 2); cv.add('<rect class="mb-poly" x="' + f1(-w / 2) + '" y="' + f1(-h / 2) + '" width="' + f1(w) + '" height="' + f1(h) + '"/>');
      if (opt.wText) cv.write([0, h / 2 + 10], opt.wText, 'is-length');
      if (opt.hText) cv.write([w / 2 + 5 + half(opt.hText), 0], opt.hText, 'is-length');
    } else {
      const pts = [[0, -h / 2], [-w / 2, h / 2], [w / 2, h / 2]]; pts.forEach(cv.point); cv.add('<polygon class="mb-poly" points="' + ptsOf(pts) + '"/>');
      if (opt.wText) cv.write([0, h / 2 + 10], opt.wText, 'is-length');
      if (opt.sText) beside(cv, pts[0], pts[2], -1, opt.sText, 'is-length');
    }
    return cv.out(opt.label, 5);
  }
  const VIEW = { 원: () => flatView('circle', 50, 50, { label: '원' }), 직사각형: () => flatView('rect', 50, 62, { label: '직사각형' }), 삼각형: () => flatView('tri', 52, 62, { label: '삼각형' }) };

  // ── 그림: 자를 대어 재는 그림 ───────────────────────────────
  // 자: a 에서 b 까지, 진행 방향의 오른쪽(side 1)·왼쪽(-1)으로 너비 9px. 눈금은 a–b 쪽 변에 긋는다.
  function rulerBar(cv, a, b, side) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n = [-u[1] * side, u[0] * side], W = 10, out = (p, k) => [p[0] + n[0] * k, p[1] + n[1] * k];
    const body = [a, b, out(b, W), out(a, W)]; body.forEach(cv.point);
    let html = '<polygon points="' + ptsOf(body) + '" style="fill:' + PALE + ';stroke:#475569;stroke-width:1"/>';
    for (let k = 0, i = 0; k <= L + 0.01; k += 6, i += 1) { const p = [a[0] + u[0] * k, a[1] + u[1] * k]; html += stroke(p, out(p, i % 5 === 0 ? 5 : 3), '', 'stroke:#475569;stroke-width:0.8'); }
    cv.add(html);
  }
  // 삼각자(직각을 낀 두 변이 p 에서 a 쪽, b 쪽으로 놓인다)
  const setSquare = (cv, p, a, b) => { [p, a, b].forEach(cv.point); cv.add('<polygon points="' + ptsOf([p, a, b]) + '" style="fill:rgba(148,163,184,0.35);stroke:#475569;stroke-width:1"/>'); };
  // what: 'cyl-h'(원기둥의 높이) | 'cyl-d'(원기둥의 밑면의 지름) | 'cone-h'(원뿔의 높이) | 'cone-l'(모선의 길이) | 'cone-d'(원뿔의 밑면의 지름). text: 잰 길이 글(없으면 적지 않는다)
  function measure(what, rx, h, text) {
    const cv = canvas(), ry = rx * TILT, half = text ? wide(text, 12) / 2 : 0;
    if (what === 'cyl-h' || what === 'cyl-d') {
      addCyl(cv, [0, 0], rx, h);
      if (what === 'cyl-h') { rulerBar(cv, [rx + 3, h], [rx + 3, 0], 1); if (text) cv.write([rx + 18 + half, h / 2], text, 'is-length'); }
      else { setSquare(cv, [-rx, h + ry + 6], [-rx, h - 16], [-rx - 13, h + ry + 6]); setSquare(cv, [rx, h + ry + 6], [rx, h - 16], [rx + 13, h + ry + 6]); rulerBar(cv, [-rx, h + ry + 6], [rx, h + ry + 6], 1); if (text) cv.write([0, h + ry + 26], text, 'is-length'); }
      return cv.out(what === 'cyl-h' ? '원기둥 옆에 자를 곧게 세워 위의 면에서 아래의 면까지를 재는 그림' + (text ? '. 잰 길이 ' + text : '') : '원기둥의 아래의 면 양쪽 끝에 삼각자를 대고 그 사이를 자로 재는 그림' + (text ? '. 잰 길이 ' + text : ''));
    }
    const s = addCone(cv, [0, 0], rx, h);
    if (what === 'cone-h') {
      // 원뿔 옆에 자를 곧게 세우고, 꼭짓점에 삼각자를 올려 높이를 읽는다.
      rulerBar(cv, [rx + 5, h], [rx + 5, -4], 1); setSquare(cv, [rx + 5, 0], [-12, 0], [rx + 5, -20]);
      if (text) cv.write([rx + 20 + half, h / 2], text, 'is-length');
      return cv.out('원뿔 옆에 자를 곧게 세우고 꼭짓점 높이에 삼각자를 대어 바닥에서 꼭짓점 높이까지를 재는 그림' + (text ? '. 잰 길이 ' + text : ''));
    }
    if (what === 'cone-l') {
      const L = Math.hypot(s.tR[0], s.tR[1]), n = [s.tR[1] / L, -s.tR[0] / L], a = [s.tR[0] + n[0] * 2, s.tR[1] + n[1] * 2], b = [n[0] * 2, n[1] * 2];
      rulerBar(cv, a, b, 1);
      if (text) cv.write([(a[0] + b[0]) / 2 + n[0] * (16 + half * Math.abs(n[0])) + 2, (a[1] + b[1]) / 2 + n[1] * 16 - 4], text, 'is-length');
      return cv.out('원뿔의 옆면에 자를 대어 밑면의 둘레의 한 점에서 꼭짓점까지를 재는 그림' + (text ? '. 잰 길이 ' + text : ''));
    }
    setSquare(cv, [-rx, h + ry + 6], [-rx, h - 16], [-rx - 13, h + ry + 6]); setSquare(cv, [rx, h + ry + 6], [rx, h - 16], [rx + 13, h + ry + 6]); rulerBar(cv, [-rx, h + ry + 6], [rx, h + ry + 6], 1);
    if (text) cv.write([0, h + ry + 26], text, 'is-length');
    return cv.out('원뿔의 밑면 양쪽 끝에 삼각자를 대고 그 사이를 자로 재는 그림' + (text ? '. 잰 길이 ' + text : ''));
  }

  // ── 원주를 셈하는 문항의 수 ──────────────────────────────────
  // 답이 소수 첫째 자리 안에서 떨어지고(자연수이면 자연수 칸에 적는다), 거꾸로 나눌 때도 꼭 떨어지는 지름만 쓴다.
  const WHEELS = { 3.14: [5, 10, 15, 20, 25, 30], 3.1: [4, 6, 8, 12, 14, 16, 18], 3: [4, 5, 6, 7, 8, 9, 12] };
  // pi: 원주율, even: 지름이 짝수(반지름이 자연수)인 것만. 돌려주는 것: { pi, dia, around(원주) }
  function wheel(d, pi, even) { const dia = d.pick(WHEELS[pi].filter((v) => !even || v % 2 === 0)); return { pi, dia, around: Math.round(pi * dia * 10) / 10 }; }
  // 그림의 비율이 고르게, 지름의 0.6~1.5배인 높이(지름·반지름과 다른 수)
  const heightFor = (d, dia) => d.until(() => d.int(Math.ceil(dia * 0.6), Math.floor(dia * 1.5)), (v) => v !== dia && v * 2 !== dia && v >= 3);

  // 6-2-6b.js, 6-2-6c.js 가 같은 도구를 쓴다(이 파일이 먼저 불린다).
  B.kit.round626 = { T, TAGS, MARKS, cm, fixed, Len, field, setOptions, say, pickWord, pickOrder, perms3, RAD, TILT, f1, xy, ptsOf, CREAM, YELLOW, BLUE, RED, PALE, BOLD, isMark, wide, stroke, curve, blob, fill, dot, word, onEll, arcD, tail,
    canvas, one, tiles, leader, span, arrowSpan, beside, corner, addCyl, addCone, addSphere, addFrustum, addSlant, addLying, addBowl, addEgg, addPoly, prismOf, pyramidOf, GON, TURN, SAID, ART, pickArt,
    cylFig, coneFig, sphereFig, netFig, NETS, netTile, netOf, spin, flatView, VIEW, rulerBar, setSquare, measure, WHEELS, wheel, heightFor };

  B.addUnit({
    id: '6-2-6', grade: 6, semester: 2, no: 6, title: '원기둥, 원뿔, 구', version: 1,
    groups: [
      { id: 'cyl', title: '원기둥', standard: SOLID, types: [] },
      { id: 'net', title: '원기둥의 전개도', standard: NET, types: [] },
      { id: 'cone', title: '원뿔', standard: SOLID, types: [] },
      { id: 'sphere', title: '구', standard: SOLID, types: [] },
      { id: 'turn', title: '돌려서 만든 입체도형', standard: SOLID, types: [] },
      { id: 'view', title: '위, 앞, 옆에서 본 모양', standard: SOLID, types: [] },
      { id: 'compare', title: '원기둥, 원뿔, 구 비교하기', standard: SOLID, types: [] }
    ]
  });

  // ── 원기둥 ───────────────────────────────────────────────────
  // 원기둥이 아닌 까닭: 뜻의 조건(두 밑면이 서로 평행하고 합동인 원, 옆면이 굽은 면) 가운데 어긋난 것만 적는다.
  const NOT_CYL = { cone: '밑면이 1개뿐이다', ball: '밑면이 없다', frustum: '두 밑면의 크기가 다르다', slant: '두 밑면이 서로 평행하지 않다', prism: '밑면이 원이 아니다', pyramid: '밑면이 원이 아니다' };
  const CYL_LEAD = '원기둥은 두 밑면이 서로 평행하고 합동인 원이고 옆면이 굽은 면이다. ';
  B.kit.round626.NOT_CYL = NOT_CYL; B.kit.round626.CYL_LEAD = CYL_LEAD;
  B.addTypes('6-2-6', 'cyl', [
    T('cyl-name', '원기둥의 뜻', '①4 ②3 ③6', (d) => pickWord(d, '서로 평행하고 합동인 두 원을 밑면으로 하고 옆면이 굽은 면인 기둥 모양의 입체도형을 무엇이라고 하는가?', '원기둥', ['원뿔', '구', '각기둥'],
      '서로 평행하고 합동인 두 원을 밑면으로 하고 옆면이 굽은 면인 기둥 모양의 입체도형을 원기둥이라고 한다.')),
    T('cyl-find', '여러 입체도형 가운데 원기둥 고르기', '①1 ②1 ③1 심1', (d) => {
      // 위아래 원의 크기가 다른 도형을 꼭 하나 넣는다. 눕혀 놓은 원기둥·비스듬히 잘린 도형이 섞인 그림은 실력에 있다.
      const k = d.pick([2, 3]), rest = ['frustum'].concat(d.shuffle([d.pick(['prism3', 'prism4', 'prism6']), d.pick(['coneTall', 'coneWide']), 'ball']).slice(0, 4 - k));
      const items = d.shuffle(pickArt(d, ['cylTall', 'cylMid', 'cylWide'], k).concat(pickArt(d, rest, rest.length))), labels = TAGS.slice(0, 5), flags = items.map((it) => it.kind === 'cyl'), made = setOptions(d, labels, flags);
      return C('입체도형 가운데 원기둥을 모두 고른 것은?', made.options, made.answer, {
        figure: tiles(items.map((it) => it.art())),
        explain: CYL_LEAD + items.map((it, i) => (flags[i] ? '' : `${labels[i]}는 ${NOT_CYL[it.kind]}. `)).join('') + `원기둥은 ${labels.filter((_, i) => flags[i]).join(', ')}이다.`,
        facts: { sets: { labels, flags, options: made.sets } }
      });
    }),
    T('cyl-why-not', '원기둥이 아닌 까닭', '①5 ②5 ③8 심2', (d, n) => {
      // 까닭 쓰기를 까닭 고르기로 바꾸었다. 그림마다 어긋난 조건이 하나뿐이게 보기를 짠다.
      const ask = (text, figure, right, wrong, explain) => { const rows = d.shuffle([[right, true]].concat(wrong.map((w) => [w, false]))); return C(text, rows.map((r) => r[0]), rows.findIndex((r) => r[1]), { figure, explain, facts: { truth: rows.map((r) => r[1]), want: true } }); };
      if (n === 0) return ask('다음 입체도형이 원기둥이 아닌 까닭으로 알맞은 것은?', ART.frustum.art(1.8), '두 밑면이 합동이 아니다.', ['두 밑면이 서로 평행하지 않다.', '밑면이 원이 아니다.', '옆면이 굽은 면이 아니다.'],
        '이 도형은 두 밑면이 서로 평행한 원이고 옆면이 굽은 면이지만, 위에 있는 원이 아래에 있는 원보다 작다. 원기둥은 두 밑면이 합동이어야 한다.');
      if (n === 1) return ask('다음 입체도형은 기둥 모양이지만 원기둥이 아니다. 그 까닭으로 알맞은 것은?', ART['prism' + d.pick([3, 6])].art(1.8), '밑면이 원이 아니다.', ['두 밑면이 서로 평행하지 않다.', '두 밑면이 합동이 아니다.', '밑면이 2개가 아니다.'],
        '이 도형은 두 밑면이 서로 평행하고 합동이지만 밑면이 다각형이다. 원기둥은 밑면이 원이어야 한다.');
      return ask('다음 입체도형을 원기둥이라고 할 수 없는 까닭으로 알맞은 것은?', ART.slant.art(1.8), '두 밑면이 서로 평행하지 않다.', ['밑면이 2개가 아니다.', '옆면이 굽은 면이 아니다.', '옆면이 2개이다.'],
        '이 도형은 위에 있는 면이 비스듬히 기울어져 있어서 아래에 있는 면과 평행하지 않다. 원기둥은 두 밑면이 서로 평행해야 한다.');
    }, { count: 3 }),
    T('cyl-word', '밑면, 옆면, 높이의 뜻', '①6 ②7 ③9 심6', (d) => {
      const [said, want, more] = d.pick([['서로 평행하고 합동인 두 면', '밑면', '두 밑면과 만나는 굽은 면은 옆면, 두 밑면 사이의 거리는 높이이다.'], ['두 밑면과 만나는 굽은 면', '옆면', '서로 평행하고 합동인 두 면은 밑면, 두 밑면 사이의 거리는 높이이다.'], ['두 밑면 사이의 거리', '높이', '서로 평행하고 합동인 두 면은 밑면, 두 밑면과 만나는 굽은 면은 옆면이다.']]);
      return pickWord(d, `원기둥에서 ${josa(said, '을/를')} 무엇이라고 하는가?`, want, ['밑면', '옆면', '높이'].filter((w) => w !== want).concat(['모선']), `원기둥에서 ${josa(said, '을/를')} ${josa(want, '이라고/라고')} 한다. ${more}`);
    }),
    T('cyl-base-prop', '두 밑면의 성질', '①6 ②7 ③9', (d) => {
      const rows = d.shuffle([['서로 평행하고 합동인 원이다.', true], ['서로 수직이고 합동인 원이다.', false], ['서로 평행하고 크기가 다른 원이다.', false], ['서로 평행하고 합동인 다각형이다.', false]]);
      return C('원기둥의 두 밑면에 대한 설명으로 옳은 것은?', rows.map((r) => r[0]), rows.findIndex((r) => r[1]), { explain: '원기둥의 두 밑면은 서로 평행하고 합동인 원이다. 두 밑면은 계속 늘여도 만나지 않고, 포개었을 때 완전히 겹친다.', facts: { truth: rows.map((r) => r[1]), want: true } });
    }),
    T('cyl-parts-point', '그림에서 밑면, 옆면, 높이 찾기', '①7 ②6 ③10 심6', (d) => {
      const WORDS = ['밑면', '옆면', '높이'], order = d.shuffle(WORDS), mark = (w) => MARKS[order.indexOf(w)], rx = 46, h = d.pick([76, 90]), ry = rx * TILT, made = pickOrder(d, order, perms3(WORDS));
      return C('원기둥에서 ㉠, ㉡, ㉢이 가리키는 부분의 이름을 차례로 쓴 것은?', made.options, made.answer, {
        figure: one((cv) => {
          addCyl(cv, [0, 0], rx, h, { top: YELLOW });
          leader(cv, [-rx - 6, -ry - 16], [-rx * 0.3, -2], mark('밑면'));
          leader(cv, [-rx - 24, h * 0.56], [-rx * 0.4, h * 0.56], mark('옆면'));
          span(cv, [rx + 14, 0], [rx + 14, h]); cv.write([rx + 28, h / 2], mark('높이'));
        }, `원기둥. ${mark('밑면')}은 색칠한 위의 면, ${mark('옆면')}은 옆을 둘러싼 굽은 면, ${mark('높이')}은 위의 면과 아래의 면 사이의 거리를 가리킨다.`),
        explain: `${mark('밑면')}은 서로 평행하고 합동인 두 면 가운데 하나이므로 밑면, ${mark('옆면')}은 두 밑면과 만나는 굽은 면이므로 옆면, ${mark('높이')}은 두 밑면 사이의 거리이므로 높이이다.`, facts: { truth: made.truth, want: true }
      });
    }),
    T('cyl-count', '밑면과 옆면의 수', '①6 ②12 ③9·59', () => M('원기둥의 밑면과 옆면은 각각 몇 개인가?', [{ label: '밑면', answer: 2, unit: '개' }, { label: '옆면', answer: 1, unit: '개' }], {
      figure: ART.cylMid.art(1.5), explain: '원기둥에서 서로 평행하고 합동인 두 면이 밑면이므로 밑면은 2개이다. 두 밑면과 만나는 굽은 면인 옆면은 1개이다.', facts: fixed(2, 1)
    })),
    T('cyl-base-pick', '밑면인 면 고르기', '①8 ②8·14 ③11', (d) => {
      // 밑면 색칠하기를 고르기로 바꾸었다. 「아래에 놓인 면만 밑면」이라고 보는 아이는 아래의 면 하나만 고른다.
      const rx = 46, h = 78, ry = rx * TILT, labels = ['가', '나', '다'], [top, side, bottom] = d.shuffle(labels), flags = labels.map((x) => x !== side), made = setOptions(d, labels, flags);
      return C('원기둥에서 밑면을 모두 고른 것은?', made.options, made.answer, {
        figure: one((cv) => {
          addCyl(cv, [0, 0], rx, h, { bottom: 'rgba(148,163,184,0.3)' });
          leader(cv, [rx + 20, -ry - 14], [rx * 0.3, -2], top); leader(cv, [-rx - 22, h * 0.45], [-rx * 0.4, h * 0.45], side); leader(cv, [rx + 20, h + ry + 14], [rx * 0.3, h + ry * 0.4], bottom);
        }, `원기둥. 위에 있는 면에 ${top}, 옆을 둘러싼 굽은 면에 ${side}, 아래에 있는 면에 ${bottom}를 적었다.`),
        explain: `원기둥에서 서로 평행하고 합동인 두 면이 밑면이다. 위에 있는 면 ${top}와 아래에 있는 면 ${bottom}가 밑면이고, 옆을 둘러싼 굽은 면 ${side}는 옆면이다.`, facts: { sets: { labels, flags, options: made.sets } }
      });
    }),
    T('cyl-height-seg', '높이를 나타내는 선분', '②8 ③13', (d) => {
      // 높이 긋기를 고르기로 바꾸었다. 점의 이름은 한 바퀴 돌며 붙이거나 위아래로 짝지어 붙인다.
      const rx = 44, h = 82, [tl, tr, bl, br] = d.bool() ? ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ'] : ['ㄱ', 'ㄹ', 'ㄴ', 'ㄷ'], P = { [tl]: [-rx, 0], [tr]: [rx, 0], [bl]: [-rx, h], [br]: [rx, h] };
      const seg = (a, b) => '선분 ' + [a, b].sort().join(''), rows = [[tl, tr, false], [tl, bl, true], [tl, br, false], [tr, br, true], [bl, br, false]].sort((x, y) => (seg(x[0], x[1]) < seg(y[0], y[1]) ? -1 : 1));
      const labels = rows.map((r) => seg(r[0], r[1])), flags = rows.map((r) => r[2]), made = setOptions(d, labels, flags);
      return C('원기둥에서 높이를 나타내는 선분을 모두 고른 것은?', made.options, made.answer, {
        figure: one((cv) => {
          addCyl(cv, [0, 0], rx, h);
          cv.add(stroke(P[tl], P[tr], 'thin') + stroke(P[bl], P[br], 'dash') + stroke(P[tl], P[br], 'dash') + [tl, tr, bl, br].map((name) => dot(P[name])).join(''));
          cv.write([-rx - 10, -4], tl); cv.write([rx + 10, -4], tr); cv.write([-rx - 10, h + 4], bl); cv.write([rx + 10, h + 4], br);
        }, `원기둥. 위에 있는 면의 지름의 양 끝이 점 ${tl}, ${tr}이고, 점 ${tl}의 바로 아래에 점 ${bl}, 점 ${tr}의 바로 아래에 점 ${br}이 있다. 선분 ${[tl, br].sort().join('')}은 비스듬히 그었다.`),
        explain: `두 밑면 사이의 거리가 높이이다. 두 밑면에 수직인 ${seg(tl, bl)}과 ${seg(tr, br)}의 길이가 높이이다. ${seg(tl, tr)}과 ${seg(bl, br)}은 밑면의 지름이고, ${seg(tl, br)}은 비스듬히 그은 선분이라서 높이보다 길다.`,
        facts: { sets: { labels, flags, options: made.sets } }
      });
    }),
    T('cyl-read', '밑면의 지름(반지름)과 높이 읽기', '①9 ②9·10 ③12 심7', (d) => {
      const r = d.int(2, 9), h = d.until(() => d.int(Math.max(3, r), r * 3), (v) => v !== r && v !== r * 2), giveR = d.bool(), k = 40 / r;
      if (giveR) return M('원기둥의 밑면의 지름과 높이는 각각 몇 cm인가?', [{ label: '밑면의 지름', answer: r * 2, unit: 'cm' }, { label: '높이', answer: h, unit: 'cm' }], {
        figure: cylFig(40, h * k, { r: cm(r), h: cm(h), label: `원기둥. 밑면의 반지름 ${r} cm, 높이 ${h} cm` }),
        explain: `밑면의 반지름이 ${r} cm이므로 밑면의 지름은 ${r} × 2 = ${r * 2}(cm)이다. 두 밑면 사이의 거리인 높이는 ${h} cm이다.`, facts: { calc: [[`${r}*2`, 0], [String(h), 1]], unseen: [2] }
      });
      return M('원기둥의 밑면의 반지름과 높이는 각각 몇 cm인가?', [{ label: '밑면의 반지름', answer: r, unit: 'cm' }, { label: '높이', answer: h, unit: 'cm' }], {
        figure: cylFig(40, h * k, { d: cm(r * 2), h: cm(h), label: `원기둥. 밑면의 지름 ${r * 2} cm, 높이 ${h} cm` }),
        explain: `밑면의 지름이 ${r * 2} cm이므로 밑면의 반지름은 ${r * 2} ÷ 2 = ${r}(cm)이다. 두 밑면 사이의 거리인 높이는 ${h} cm이다.`, facts: { calc: [[`${r * 2}/2`, 0], [String(h), 1]], unseen: [2] }
      });
    }),
    T('cyl-measure', '원기둥의 무엇을 재는 그림인가', '①10', (d) => {
      const what = d.pick(['cyl-h', 'cyl-d']), want = what === 'cyl-h' ? '높이' : '밑면의 지름';
      return pickWord(d, '원기둥에 자를 대어 길이를 재고 있다. 원기둥의 무엇을 재는 그림인가?', want, ['높이', '밑면의 지름', '밑면의 반지름', '밑면의 둘레'].filter((w) => w !== want),
        what === 'cyl-h' ? '자를 원기둥 옆에 곧게 세워 위의 밑면에서 아래의 밑면까지를 재고 있다. 두 밑면 사이의 거리인 높이를 재는 그림이다.' : '밑면의 양쪽 끝에 삼각자를 대고 그 사이를 재고 있다. 밑면인 원에서 가장 긴 길이인 밑면의 지름을 재는 그림이다.', measure(what, 36, 60));
    }),
    T('cyl-say', '원기둥에 대한 설명', '①11 ②13 ③14 심15', (d, n) => say(d, n === 0 ? '원기둥에 대한 설명으로 옳지 않은 것은?' : '원기둥에 대한 설명으로 옳은 것은?',
      ['두 밑면은 서로 평행하다.', '두 밑면은 합동인 원이다.', '옆면은 굽은 면이다.', '밑면은 2개이다.', '두 밑면 사이의 거리를 높이라고 한다.', '꼭짓점이 없다.', '한 원기둥에서 높이는 어디에서 재어도 같다.'],
      [['두 밑면은 서로 수직이다.', '두 밑면은 서로 평행하다.'], ['밑면은 1개이다.', '밑면은 2개이다.'], ['옆면은 평평한 면이다.', '옆면은 굽은 면이다.'], ['두 밑면의 크기는 서로 다르다.', '두 밑면은 합동이다.'], ['밑면은 다각형이다.', '밑면은 원이다.'],
        ['옆면은 2개이다.', '옆면은 1개이다.'], ['꼭짓점이 2개 있다.', '원기둥에는 꼭짓점이 없다.'], ['두 밑면에 평행한 선분의 길이를 높이라고 한다.', '높이는 두 밑면에 수직인 선분의 길이이다.']],
      n === 1, n === 1 ? '원기둥은 서로 평행하고 합동인 두 원을 밑면으로 하고, 옆면이 굽은 면이다.' : ''), { count: 2 })
  ]);

  // ── 원기둥의 전개도 ──────────────────────────────────────────
  const NET_LEAD = '원기둥의 전개도는 합동인 원 2개와 직사각형 1개로 이루어지고, 두 원은 직사각형을 사이에 두고 마주 보는 자리에 붙어 있다. ';
  B.kit.round626.NET_LEAD = NET_LEAD;
  const NAMED_NET = '원기둥의 전개도. 옆면인 직사각형의 꼭짓점은 왼쪽 위부터 시계 반대 방향으로 ㄱ, ㄴ, ㄷ, ㄹ이다.';
  B.addTypes('6-2-6', 'net', [
    T('net-word', '전개도의 뜻', '①13 ②15 ③15', (d) => pickWord(d, '원기둥을 잘라서 펼쳐 놓은 그림을 원기둥의 무엇이라고 하는가?', '전개도', ['겨냥도', '밑면', '옆면'], '원기둥을 잘라서 펼쳐 놓은 그림을 원기둥의 전개도라고 한다.')),
    T('net-faces', '전개도에서 밑면과 옆면의 모양', '①13 ②15 ③16 심31', (d) => {
      const right = '원, 직사각형', options = d.shuffle([right, '직사각형, 원', '원, 원', '원, 삼각형']);
      return C('원기둥의 전개도에서 밑면의 모양과 옆면의 모양을 차례로 쓴 것은?', options, options.indexOf(right), { explain: '원기둥을 잘라서 펼치면 두 밑면은 원 모양이고, 굽은 면이던 옆면은 직사각형 모양이 된다.', facts: { truth: options.map((o) => o === right), want: true } });
    }),
    T('net-parts', '전개도에서 옆면이 되는 부분', '①13 ③20 심31', (d) => {
      const labels = ['가', '나', '다'], [top, side, bottom] = d.shuffle(labels);
      return C('원기둥의 전개도에서 옆면은?', labels, labels.indexOf(side), {
        figure: netFig(22, 138, 46, { faces: [top, side, bottom], label: `원기둥의 전개도. 위에 있는 원에 ${top}, 가운데 직사각형에 ${side}, 아래에 있는 원에 ${bottom}를 적었다.` }),
        explain: `원기둥의 전개도에서 옆면은 직사각형 모양이고 밑면은 원 모양이다. 직사각형 모양인 ${side}가 옆면이고, 원 모양인 ${top}와 ${bottom}는 밑면이다.`, facts: { truth: labels.map((x) => x === side), want: true }
      });
    }),
    T('net-can', '원기둥의 전개도가 될 수 있는 것과 없는 것', '①14 ②19 ③17 심32', (d, n) => {
      // 교육과정이 평가의 중점으로 꼽은 꼴. 가짜는 눈으로 가릴 수 있는 것만 쓴다(원의 크기가 뚜렷이 다르다, 두 원이 같은 쪽에 있다, 옆면이 사다리꼴이다, 원이 하나뿐이다).
      const labels = TAGS.slice(0, 4);
      if (n === 0) {
        const keys = d.shuffle([d.pick(['ok', 'offset'])].concat(d.shuffle(['size', 'side', 'trap', 'one']).slice(0, 3))), at = keys.findIndex((key) => NETS[key].net);
        return C('원기둥의 전개도가 될 수 있는 것은?', labels, at, {
          figure: tiles(keys.map((key) => netTile(key))), explain: NET_LEAD + keys.map((key, i) => (NETS[key].net ? '' : `${labels[i]}는 ${NETS[key].why}. `)).join('') + `전개도가 될 수 있는 것은 ${labels[at]}이다.`,
          facts: { kindPick: { kinds: keys.map((key) => (NETS[key].net ? 'net' : key)), target: 'net' } }
        });
      }
      const k = d.pick([2, 3]), keys = d.shuffle(d.shuffle(['ok', 'offset']).slice(0, 4 - k).concat(d.shuffle(['size', 'side', 'trap', 'one']).slice(0, k))), flags = keys.map((key) => !NETS[key].net), made = setOptions(d, labels, flags);
      return C('원기둥의 전개도가 될 수 없는 것을 모두 고른 것은?', made.options, made.answer, {
        figure: tiles(keys.map((key) => netTile(key))), explain: NET_LEAD + keys.map((key, i) => (NETS[key].net ? '' : `${labels[i]}는 ${NETS[key].why}. `)).join('') + `전개도가 될 수 없는 것은 ${labels.filter((_, i) => flags[i]).join(', ')}이다.`,
        facts: { sets: { labels, flags, options: made.sets } }
      });
    }, { count: 2 }),
    T('net-why-not', '원기둥의 전개도가 아닌 까닭', '①15 ②20 ③18·19 심32', (d, n) => {
      // 까닭 쓰기를 까닭 고르기로 바꾸었다.
      const key = n === 0 ? d.pick(['size', 'trap']) : 'side', right = { size: '두 밑면이 합동이 아니다.', trap: '옆면이 직사각형이 아니다.', side: '접으면 두 밑면이 서로 겹친다.' }[key];
      const rows = d.shuffle((n === 0 ? ['두 밑면이 합동이 아니다.', '옆면이 직사각형이 아니다.', '밑면이 2개가 아니다.', '밑면이 원이 아니다.'] : [right, '두 밑면이 합동이 아니다.', '옆면이 직사각형이 아니다.', '밑면이 원이 아니다.']).map((text) => [text, text === right]));
      const why = { size: '두 원의 크기가 다르다. 원기둥의 두 밑면은 합동이므로 전개도의 두 원도 합동이어야 한다.', trap: '옆면이 사다리꼴 모양이다. 원기둥의 옆면을 펼치면 직사각형이 되어야 한다.', side: '두 원이 직사각형의 같은 변에 붙어 있어서, 접으면 두 원이 같은 쪽에서 겹치고 반대쪽에는 밑면이 없다. 두 밑면은 옆면을 사이에 두고 마주 보는 자리에 있어야 한다.' }[key];
      return C(n === 0 ? '다음 그림이 원기둥의 전개도가 아닌 까닭으로 알맞은 것은?' : '다음 그림을 접어서 원기둥을 만들 수 없는 까닭으로 알맞은 것은?', rows.map((r) => r[0]), rows.findIndex((r) => r[1]), {
        figure: netTile(key, 17), explain: '이 그림은 ' + why, facts: { truth: rows.map((r) => r[1]), want: true }
      });
    }, { count: 2 }),
    T('net-same-seg', '밑면의 둘레·높이와 길이가 같은 선분', '①16 ②18 ③21', (d) => {
      const around = d.bool(), labels = ['선분 ㄱㄴ', '선분 ㄴㄷ', '선분 ㄷㄹ', '선분 ㄱㄹ'], flags = around ? [false, true, false, true] : [true, false, true, false], made = setOptions(d, labels, flags);
      return C(`원기둥의 전개도에서 ${around ? '밑면의 둘레' : '원기둥의 높이'}와 길이가 같은 선분을 모두 고른 것은?`, made.options, made.answer, {
        figure: netFig(23.9, 150, 48, { names: true, label: NAMED_NET }),
        explain: around ? '옆면의 가로는 밑면의 둘레와 같다. 옆면인 직사각형 ㄱㄴㄷㄹ에서 가로인 선분 ㄴㄷ과 선분 ㄱㄹ의 길이가 밑면의 둘레와 같다.' : '옆면의 세로는 원기둥의 높이와 같다. 옆면인 직사각형 ㄱㄴㄷㄹ에서 세로인 선분 ㄱㄴ과 선분 ㄷㄹ의 길이가 원기둥의 높이와 같다.',
        facts: { sets: { labels, flags, options: made.sets } }
      });
    }),
    T('net-match-word', '옆면의 가로·세로와 길이가 같은 것', '①17 ②17 ③22', (d, n) => (n === 0
      ? pickWord(d, '원기둥의 전개도에서 굵게 그은 옆면의 가로와 길이가 같은 것은?', '밑면의 둘레', ['밑면의 지름', '밑면의 반지름', '원기둥의 높이'], '전개도를 접으면 옆면의 가로가 밑면인 원의 둘레를 한 바퀴 감싼다. 그래서 옆면의 가로는 밑면의 둘레와 길이가 같다.',
        netFig(23.9, 150, 48, { bold: 'w', label: '원기둥의 전개도. 옆면인 직사각형의 가로를 굵게 그었다.' }))
      : pickWord(d, '원기둥의 전개도에서 굵게 그은 옆면의 세로와 길이가 같은 것은?', '원기둥의 높이', ['밑면의 지름', '밑면의 반지름', '밑면의 둘레'], '전개도를 접으면 옆면의 세로가 두 밑면 사이에 곧게 선다. 그래서 옆면의 세로는 원기둥의 높이와 길이가 같다.',
        netFig(23.9, 150, 48, { bold: 'h', label: '원기둥의 전개도. 옆면인 직사각형의 세로를 굵게 그었다.' }))), { count: 2 }),
    T('net-match-circle', '옆면의 가로와 길이가 같은 원의 둘레', '③24', (d) => {
      const r = d.int(3, 9), h = d.until(() => d.int(4, 15), (v) => v !== r && v !== r * 2 && v * 2 !== r), right = `반지름이 ${r} cm인 원의 둘레`;
      const options = d.shuffle([right, `지름이 ${r} cm인 원의 둘레`, `반지름이 ${h} cm인 원의 둘레`, `지름이 ${h} cm인 원의 둘레`]);
      return C(`밑면의 반지름이 ${r} cm이고 높이가 ${h} cm인 원기둥의 전개도를 그렸다. 이 전개도에서 옆면의 가로와 길이가 같은 것은?`, options, options.indexOf(right), {
        explain: `옆면의 가로는 밑면의 둘레와 같다. 밑면은 반지름이 ${r} cm인 원이므로 옆면의 가로는 반지름이 ${r} cm인 원의 둘레와 같다. 높이 ${h} cm는 옆면의 세로이다.`, facts: { truth: options.map((o) => o === right), want: true }
      });
    }),
    T('net-say', '원기둥의 전개도에 대한 설명', '②16 ③23 심31', (d, n) => say(d, n === 0 ? '원기둥의 전개도에 대한 설명으로 옳지 않은 것은?' : '원기둥의 전개도에 대한 설명으로 옳은 것은?',
      ['밑면은 원 모양이다.', '밑면은 2개이다.', '두 밑면은 합동이다.', '옆면은 직사각형 모양이다.', '옆면의 가로는 밑면의 둘레와 같다.', '옆면의 세로는 원기둥의 높이와 같다.', '옆면은 1개이다.'],
      [['밑면은 직사각형 모양이다.', '밑면은 원 모양이다.'], ['옆면의 가로는 원기둥의 높이와 같다.', '옆면의 가로는 밑면의 둘레와 같다.'], ['옆면의 세로는 밑면의 둘레와 같다.', '옆면의 세로는 원기둥의 높이와 같다.'], ['옆면의 가로는 밑면의 지름과 같다.', '옆면의 가로는 밑면의 둘레와 같다.'],
        ['옆면의 세로는 밑면의 지름과 같다.', '옆면의 세로는 원기둥의 높이와 같다.'], ['옆면은 2개이다.', '옆면은 1개이다.'], ['두 밑면의 크기는 서로 다르다.', '두 밑면은 합동이다.']],
      n === 1, n === 1 ? '원기둥의 전개도는 합동인 원 모양의 밑면 2개와 직사각형 모양의 옆면 1개로 이루어진다.' : '',
      netFig(18, 113, 38, { label: '원기둥의 전개도. 직사각형의 위와 아래에 크기가 같은 원이 하나씩 붙어 있다.' })), { count: 2 }),
    T('net-read', '전개도에서 높이와 밑면의 둘레 읽기', '①18 ②22', (d) => {
      const dia = d.pick([6, 8, 10, 12, 14]), around = dia * 3, h = d.until(() => heightFor(d, dia), (v) => v !== around);
      return M('원기둥의 전개도이다. 이 전개도를 접어서 만든 원기둥의 높이와 한 밑면의 둘레는 각각 몇 cm인가?', [{ label: '높이', answer: h, unit: 'cm' }, { label: '한 밑면의 둘레', answer: around, unit: 'cm' }], {
        figure: netOf(dia, h, 3, { wText: cm(around), hText: cm(h), label: `원기둥의 전개도. 옆면의 가로 ${around} cm, 세로 ${h} cm` }),
        explain: `옆면의 세로는 원기둥의 높이와 같고, 옆면의 가로는 밑면의 둘레와 같다. 높이는 ${h} cm, 한 밑면의 둘레는 ${around} cm이다.`, facts: { calc: [[String(h), 0], [String(around), 1]] }
      });
    }),
    T('net-copy', '원기둥의 길이를 전개도에 옮기기', '①19 ②21 ③25 심33', (d) => {
      const r = d.int(2, 7), h = heightFor(d, r * 2);
      return M('원기둥과 그 전개도이다. ㉠, ㉡의 길이는 각각 몇 cm인가?', [{ label: '㉠', answer: r, unit: 'cm' }, { label: '㉡', answer: h, unit: 'cm' }], {
        figure: cylFig(30, h * 30 / r, { r: cm(r), h: cm(h), label: `원기둥. 밑면의 반지름 ${r} cm, 높이 ${h} cm` }) + netOf(r * 2, h, 3.14, { rText: '㉠', hText: '㉡', label: '원기둥의 전개도. 밑면인 원의 반지름에 ㉠, 옆면인 직사각형의 세로에 ㉡' }),
        explain: `전개도의 원은 원기둥의 밑면이므로 ㉠은 밑면의 반지름 ${r} cm이다. 옆면의 세로는 원기둥의 높이와 같으므로 ㉡은 ${h} cm이다.`, facts: { calc: [[String(r), 0], [String(h), 1]] }
      });
    }),
    T('net-fill', '옆면의 가로 구하기', '①19·21 ②21·28 ③26·28 심33·35', (d, n) => {
      // 전개도 그리기를 「옆면의 가로는 몇 cm로 그려야 하는가」로 바꾸었다. 원주를 한 번 구한다.
      if (n === 0) {
        const w = wheel(d, 3.14), h = heightFor(d, w.dia);
        return Len('원기둥과 그 전개도이다. ㉠의 길이는 몇 cm인가? (원주율: 3.14)', w.around, {
          unit: 'cm', figure: cylFig(30, h * 60 / w.dia, { d: cm(w.dia), h: cm(h), label: `원기둥. 밑면의 지름 ${w.dia} cm, 높이 ${h} cm` }) + netOf(w.dia, h, 3.14, { wText: '㉠', label: '원기둥의 전개도. 옆면인 직사각형의 가로에 ㉠' }),
          explain: `옆면의 가로는 밑면의 둘레와 같다. 밑면의 지름이 ${w.dia} cm이므로 ${w.dia} × 3.14 = ${w.around}(cm)이다.`, facts: { calc: [[`${w.dia}*3.14`, 0]] }
        });
      }
      const w = wheel(d, 3.1, true), r = w.dia / 2, h = heightFor(d, w.dia);
      return Len(`밑면의 반지름이 ${r} cm이고 높이가 ${h} cm인 원기둥의 전개도를 그리려고 한다. 옆면의 가로는 몇 cm로 그려야 하는가? (원주율: 3.1)`, w.around, {
        unit: 'cm', explain: `옆면의 가로는 밑면의 둘레와 같게 그린다. 밑면의 지름이 ${r} × 2 = ${w.dia}(cm)이므로 ${w.dia} × 3.1 = ${w.around}(cm)로 그린다. 높이 ${h} cm는 옆면의 세로이다.`, facts: { calc: [[`${r}*2*3.1`, 0]], unseen: [2] }
      });
    }, { count: 2 }),
    T('net-back', '옆면의 가로에서 밑면의 지름 구하기', '①20 ②23 ③27 심34', (d) => {
      const w = wheel(d, 3.14), h = heightFor(d, w.dia);
      return N('원기둥의 전개도이다. 이 전개도를 접어서 만든 원기둥의 밑면의 지름은 몇 cm인가? (원주율: 3.14)', w.dia, {
        unit: 'cm', figure: netOf(w.dia, h, 3.14, { wText: cm(w.around), hText: cm(h), label: `원기둥의 전개도. 옆면의 가로 ${w.around} cm, 세로 ${h} cm` }),
        explain: `옆면의 가로는 밑면의 둘레와 같다. (밑면의 지름) × 3.14 = ${w.around}이므로 밑면의 지름은 ${w.around} ÷ 3.14 = ${w.dia}(cm)이다. 옆면의 세로 ${h} cm는 원기둥의 높이이다.`, facts: { calc: [[`${w.around}/3.14`, 0]] }
      });
    })
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
