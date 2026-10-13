// 중학교 2학년 2학기 3단원 도형의 닮음 — 실력 문항.
// 단원 틀과 그림 도구, 싣는 기준, 뺀 것과 까닭은 8-2-3a.js 에 있다. ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번, 심n = 심화꼴의 n번.
//
// 이 단원에서 아이들이 흔히 잘못 아는 것(실력 ①의 장치는 이 잘못을 가진 아이가 걸리게 만들었다)
//  - 「두 마름모·두 이등변삼각형·두 직사각형은 닮은 도형이 아니다」라고만 외워, 한 내각이나 꼭지각이 같다는 조건이 붙어도 아니라고 한다.
//    거꾸로 「길이가 같다」「넓이가 같다」는 말이 붙으면 닮은 도형이라고 여긴다.
//  - 닮음의 기호를 그림에 놓인 차례나 알파벳 차례로 읽는다. 두 삼각형의 놓인 방향이 다르면 같은 자리에 있는 변끼리 짝 짓는다.
//  - 한 각을 같이 쓰는 겹친 두 삼각형은 언제나 「작은 삼각형의 변이 큰 삼각형의 밑변과 나란한 꼴」이라고 여겨 AB : AD = AC : AE 로 식을 세운다(같은 각의 표시가 엇갈려 있으면 대응이 뒤집힌다).
//  - 닮음비를 넓이의 비로 답한다(반으로 접은 종이). 넓이의 비·부피의 비에 닮음비를 그대로 쓴다(40 %로 복사한 그림의 넓이를 40 %라 하고, 지름이 1.5배인 부침개의 양을 1.5배라 한다).
//  - 자른 뿔에서 닮음비를 「잘린 두 조각의 길이의 비」로 쓴다(8 : 6). 닮은 것은 꼭짓점을 같이 쓰는 작은 뿔과 처음 뿔이므로 꼭짓점부터 잰 길이의 비(8 : 14)를 써야 한다.
//    층으로 잘린 조각의 부피의 비를 1 : 8 : 27 로 답한다(조각은 뿔에서 뿔을 뺀 것이다).
//  - 직사각형에서 잘라 낸 직사각형이 처음 것과 닮은 도형일 때 긴 변끼리가 아니라 그림에서 나란한 변끼리 대응시킨다.
//
// 실력에는 ① 문제의 그림·말·수에 함정이 있어 배운 뜻을 정확히 대야 풀리는 문제와 ② 세 단계 넘게 이어 생각해야 풀리는 문제(그릇을 채우는 데 더 드는 물,
// 닮음에서 얻은 각으로 방정식 세우기, 정삼각형 안의 60°, 세 각이 같게 그은 선분이 만드는 삼각형, 삼각형에 꼭 끼인 마름모, 직각삼각형에 수선을 거듭 긋기,
// 직사각형의 대각선과 수선, 각의 이등분선과 수선, 한 번 접은 직사각형과 정삼각형)만 실었다. 「닮은 삼각형을 찾아 길이 하나 구하기」「닮음 조건 고르기」는 기본에 있다.
// 묻는 말: 수나 값은 「~은?/~는?」, 양은 「몇 ~인가?」. 각도는 수에 붙여 적고(60°) 길이는 띄어 적는다(6 cm).
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, C } = B.kit;
  const { V, SG, sup, gcd } = B.kit.mid;
  const { RAD, at, dirOf, dist, mid, meet, sv, Board } = B.kit.mgeo;
  const K = B.kit.m823;
  const { UNIT, S12, S13, SIM, PAR, cm, tri, quad, RATIO, lenQ, degQ, areaQ, volQ, piQ, ratioQ, fracQ, sayQ, go, lerp, toward, foot, asa, ren, rot, flip, scale, level, figs, tidy,
    FACE, coneOn, sectionOn, blue, cupFig, acosd, altTri, fitted } = K;
  // 실력 문항. 기본 자료에서만 나온 꼴은 ref 를 '기본 ①2' 처럼 적는다.
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: ref.startsWith('기본 ') ? '수집본 기본 자료(' + ref.slice(3) + ')' : '수집본 심화 자료(' + ref + ')', make }, more || {});
  const PLANE = { standard: S12 };
  const deg = (p, q) => Math.atan2(q[1] - p[1], q[0] - p[0]) / RAD;   // 수학 좌표에서 p 에서 q 를 바라보는 방향
  // 화면의 점 p 둘레에서, 이름을 적어도 선분들(segs)에 가장 덜 닿는 방향(도)
  const segGap = (p, a, b) => { const t = Math.max(0, Math.min(1, ((p[0] - a[0]) * (b[0] - a[0]) + (p[1] - a[1]) * (b[1] - a[1])) / ((b[0] - a[0]) ** 2 + (b[1] - a[1]) ** 2))); return Math.hypot(p[0] - a[0] - t * (b[0] - a[0]), p[1] - a[1] - t * (b[1] - a[1])); };
  const clearDir = (p, segs, gap) => { let best = 0, far = -1; for (let a = 0; a < 360; a += 10) { const c = at(p, gap, a), near = Math.min(...segs.map(([u, v]) => segGap(c, u, v))); if (near > far) { far = near; best = a; } } return best; };

  const COND_TRUE = ['한 변의 길이가 같은 두 정사각형', '꼭지각의 크기가 같은 두 이등변삼각형', '한 내각의 크기가 같은 두 마름모', '한 예각의 크기가 같은 두 직각삼각형', '중심각의 크기가 같은 두 부채꼴',
    '반지름의 길이가 다른 두 원', '한 모서리의 길이가 같은 두 정사면체', '가로와 세로의 길이의 비가 같은 두 직사각형'];
  const COND_FALSE = [
    ['반지름의 길이가 같은 두 부채꼴', '반지름의 길이가 같아도 중심각의 크기가 다르면 닮은 도형이 아니다.'], ['넓이가 같은 두 직사각형', '넓이가 같아도 가로와 세로의 길이의 비가 다르면 닮은 도형이 아니다.'],
    ['한 변의 길이가 같은 두 마름모', '한 변의 길이가 같아도 내각의 크기가 다르면 닮은 도형이 아니다.'], ['밑변의 길이가 같은 두 이등변삼각형', '밑변의 길이가 같아도 꼭지각의 크기가 다르면 닮은 도형이 아니다.'],
    ['둘레의 길이가 같은 두 직사각형', '둘레의 길이가 같아도 가로와 세로의 길이의 비가 다르면 닮은 도형이 아니다.'], ['높이가 같은 두 원기둥', '높이가 같아도 밑면의 반지름의 길이가 다르면 닮은 도형이 아니다.'],
    ['한 내각의 크기가 같은 두 평행사변형', '내각의 크기가 같아도 이웃한 두 변의 길이의 비가 다르면 닮은 도형이 아니다.'], ['빗변의 길이가 같은 두 직각삼각형', '빗변의 길이가 같아도 직각이 아닌 각의 크기가 다르면 닮은 도형이 아니다.']
  ];

  // 삼각형 ABC 의 세 꼭짓점에서 변 AB, BC, CA 와 th° 를 이루게 그은 세 반직선이 만드는 안쪽 삼각형 DEF(D: A·C 에서 그은 것의 교점, E: A·B, F: B·C)
  function innerTri(t, th) {
    const ray = (p, q) => go(p, 1, deg(p, q) + th), a = ray(t.A, t.B), b = ray(t.B, t.C), c = ray(t.C, t.A);
    return { D: meet(t.A, a, t.C, c), E: meet(t.A, a, t.B, b), F: meet(t.B, b, t.C, c) };
  }
  // 안쪽 삼각형과 삼각형 ABC 의 닮음비가 k : 1 이 되는 각 th 를 이분법으로 찾는다(th 가 커질수록 안쪽 삼각형이 작아진다).
  function innerAt(t, k) {
    const cot = (v, p, q) => { const a = Math.atan2(p[1] - v[1], p[0] - v[0]) - Math.atan2(q[1] - v[1], q[0] - v[0]); return 1 / Math.tan(Math.abs(a) > Math.PI ? 2 * Math.PI - Math.abs(a) : Math.abs(a)); };
    let lo = 0.01, hi = Math.atan(1 / (cot(t.A, t.B, t.C) + cot(t.B, t.C, t.A) + cot(t.C, t.A, t.B))) / RAD - 0.01;
    for (let i = 0; i < 50; i += 1) { const m = (lo + hi) / 2, s = innerTri(t, m); if (dist(s.D, s.E) / dist(t.A, t.B) > k) lo = m; else hi = m; }
    return (lo + hi) / 2;
  }

  B.addGroup(UNIT, {
    id: 'hard', title: '실력 문제', standard: S13,
    types: [
      // ── ① 문제의 그림·말·수에 함정이 있어 배운 뜻을 정확히 대야 풀리는 문제 ──
      H('hard-always-cond', '조건이 붙은 두 도형이 항상 닮은 도형인지 가리기', '기본 ①2', (d) => {
        // 함정: 「마름모·이등변삼각형은 닮은 도형이 아니다」라고만 외운 아이, 「길이·넓이가 같다」는 말에 끌리는 아이
        const wantTrue = d.bool();
        return sayQ(d, `다음 중 두 도형이 항상 서로 닮은 도형${wantTrue ? '인' : '이라고 할 수 없는'} 것은?`, COND_TRUE, COND_FALSE, wantTrue);
      }, PLANE),
      H('hard-ratio-sides', '각의 표시로 대응변을 찾아 닮음비 나타내기', '심1', tidy((d) => {
        // 함정: 같은 자리에 놓인 변끼리, 또는 알파벳 차례(a : d)로 짝 짓는 아이. 대응변은 크기가 같은 각의 맞은편에서 찾는다.
        const [av, bv] = d.until(() => [5 * d.int(9, 15), 5 * d.int(10, 16)], (w) => { const c = 180 - w[0] - w[1]; return c >= 40 && Math.min(Math.abs(w[0] - w[1]), Math.abs(w[0] - c), Math.abs(w[1] - c)) >= 15; });
        const to = d.pick(['EFD', 'FDE']), of = (s) => to['ABC'.indexOf(s)], t = asa(10, bv, 180 - av - bv), k = d.pick([0.62, 0.7, 1.4, 1.5]), rest = (s) => 'DEF'.replace(s, '').split('');
        const letter = { EF: 'd', DF: 'e', DE: 'f' }, side = (s) => [of(s[0]), of(s[1])].sort().join(''), pA = of('A'), pB = of('B');
        const f = figs([{ P: t, order: 'ABC', sides: [['B', 'C', sv('a')], ['C', 'A', sv('b')], ['A', 'B', sv('c')]], marks: [['A', 'B', 'C', 'dot'], ['B', 'C', 'A', 'x']] },
          { P: rot(ren(scale(d.bool() ? flip(t) : t, k), 'ABC', to), d.pick([130, 180, 230])), order: 'DEF', sides: [['E', 'F', sv('d')], ['F', 'D', sv('e')], ['D', 'E', sv('f')]], marks: [[pA].concat(rest(pA), ['dot']), [pB].concat(rest(pB), ['x'])] }], { w: 190, h: 110, gap: 50 });
        const opts = ['d', 'e', 'f'].map((s) => `${V('a')} : ${V(s)}`), hit = ['d', 'e', 'f'].indexOf(letter[side('BC')]);
        return C(`그림의 두 삼각형은 서로 닮은 도형이고, 같은 표시를 한 각의 크기는 서로 같다. ${tri('ABC')}와 ${tri('DEF')}의 닮음비를 바르게 나타낸 것은?`, opts, hit, {
          figure: f.b.svg(`서로 다른 방향으로 놓인 두 삼각형 ABC와 DEF. 삼각형 ABC에서 변 BC의 길이 a, 변 CA의 길이 b, 변 AB의 길이 c이고 ∠A에 ● 표시, ∠B에 × 표시가 있다. 삼각형 DEF에서 변 EF의 길이 d, 변 FD의 길이 e, 변 DE의 길이 f이고 ∠${pA}에 ● 표시, ∠${pB}에 × 표시가 있다`),
          explain: `∠A = ∠${pA}, ∠B = ∠${pB}이므로 점 A, B, C의 대응점은 차례로 ${pA}, ${pB}, ${of('C')}이다. 닮음비는 대응변의 길이의 비이고 ${SG('BC')}의 대응변은 ${SG(side('BC'))}이므로 닮음비는 ${opts[hit]}이다.`,
          facts: { truth: opts.map((_, i) => i === hit), want: true }
        });
      }), PLANE),
      H('hard-paper', '반으로 거듭 접은 종이의 닮음비', '심3', (d) => {
        // 함정: 넓이의 비(반씩 줄어든다)를 닮음비로 답하는 아이. 닮음비는 변의 길이의 비다.
        const folds = d.pick([4, 6]), from = folds === 4 ? d.int(2, 4) : d.int(0, 2), opts = folds === 4 ? ['2 : 1', '4 : 1', '8 : 1', '16 : 1'] : ['4 : 1', '6 : 1', '8 : 1', '64 : 1'], right = folds === 4 ? '4 : 1' : '8 : 1';
        return C(`A${from} 용지를 반으로 접을 때마다 A${from + 1} 용지, A${from + 2} 용지, …와 크기가 같아지고, 이 용지들은 모두 서로 닮은 도형이다. A${from} 용지와 A${from + folds} 용지의 닮음비는?`, opts, opts.indexOf(right), {
          explain: `반으로 한 번 접으면 넓이가 ${frac(1, 2)}배가 되므로 두 번 접으면 넓이가 ${frac(1, 4)}배가 된다. 넓이의 비가 4 : 1인 닮은 두 도형의 닮음비는 2 : 1이므로 두 번 접을 때마다 변의 길이는 ${frac(1, 2)}배가 된다. ${folds}번 접으면 변의 길이는 ${frac(1, 2 ** (folds / 2))}배가 되므로 닮음비는 ${right}이다. (${2 ** folds} : 1은 넓이의 비이다.)`,
          facts: { truth: opts.map((o) => o === right), want: true }
        });
      }, PLANE),
      H('hard-cut-rect', '잘라 낸 직사각형이 처음 직사각형과 닮은 도형일 때', '기본 ①10', (d) => {
        // 함정: 그림에서 나란한 변끼리(AB와 BE, AD와 EF) 대응시키는 아이. 기호의 차례로 AB ↔ BC, BC ↔ CF 를 읽어야 한다.
        const [n, m, t] = d.pick([[3, 2, 1], [3, 2, 2], [3, 2, 3], [4, 3, 1], [4, 3, 2], [5, 4, 1], [5, 3, 1], [2, 1, 3], [2, 1, 4], [2, 1, 5]]), BC = n * m * t, BE = m * m * t, AB = n * n * t;
        const f = figs([{ P: { A: [0, AB], B: [0, 0], C: [BC, 0], D: [BC, AB], E: [0, BE], F: [BC, BE] }, order: 'ABCD', segs: [['E', 'F']], sides: [['A', 'D', cm(BC)], ['B', 'E', cm(BE), { in: 'C' }]], at: { E: 180, F: 0, A: 135, B: 225, C: 315, D: 45 } }], { w: 150, h: 150 });
        return lenQ(`그림과 같이 직사각형 ABCD의 두 변 AB, DC 위에 각각 점 E, F를 잡아 ${SG('EF')} ${PAR} ${SG('BC')}가 되게 하였다. ${quad('ABCD')} ${SIM} ${quad('BCFE')}이고 ${SG('AD')} = ${cm(BC)}, ${SG('BE')} = ${cm(BE)}일 때, ${SG('DF')}의 길이는?`, AB - BE, {
          figure: f.b.svg(`세로가 더 긴 직사각형 ABCD. 점 E는 변 AB 위에, 점 F는 변 DC 위에 있고 선분 EF는 변 BC와 평행하다. 변 AD = ${cm(BC)}, 선분 BE = ${cm(BE)}`),
          explain: `${quad('ABCD')} ${SIM} ${quad('BCFE')}에서 ${SG('AB')}의 대응변은 ${SG('BC')}, ${SG('BC')}의 대응변은 ${SG('CF')}이다. ${SG('BC')} = ${SG('AD')} = ${cm(BC)}, ${SG('CF')} = ${SG('BE')} = ${cm(BE)}이므로 ${SG('AB')} : ${BC} = ${BC} : ${BE}에서 ${SG('AB')} = ${cm(AB)}이다. ${SG('DC')} = ${SG('AB')}이므로 ${SG('DF')} = ${AB} − ${BE} = ${AB - BE}(cm)이다.`,
          facts: { calc: [[`${BC}*${BC}/${BE}-${BE}`, 0]] }
        });
      }, PLANE),
      H('hard-pizza', '값이 같을 때 양이 더 많은 쪽 고르기', '심7', (d) => {
        // 함정: 지름의 비로 양을 견주는 아이(지름이 1.5배이면 양도 1.5배). 두께가 같으면 양은 넓이에 정비례한다.
        const [m, n, c] = d.pick([[2, 3, 2], [2, 3, 3], [1, 2, 4], [3, 4, 2], [3, 5, 3], [3, 5, 2], [1, 2, 3], [1, 2, 5], [4, 5, 2]]), g = d.pick(n >= 4 ? [6, 8] : [10, 12]), d1 = m * g, d2 = n * g, P = d.pick([3000, 4000, 5000]), x = c * m * m, y = n * n;
        const opts = [`작은 부침개 ${c}장`, '양이 서로 같다', '큰 부침개 1장'];
        return C(`어느 가게에서 두께가 같은 원 모양의 부침개를 판다. 지름의 길이가 ${cm(d1)}인 작은 부침개는 한 장에 ${P}원, 지름의 길이가 ${cm(d2)}인 큰 부침개는 한 장에 ${c * P}원이다. ${c * P}원으로 작은 부침개 ${c}장을 살 때와 큰 부침개 1장을 살 때, 부침개의 양이 더 많은 쪽은?`, opts, x > y ? 0 : x === y ? 1 : 2, {
          explain: `두 원은 항상 닮은 도형이고 닮음비는 ${d1} : ${d2} = ${m} : ${n}이므로 부침개 한 장의 넓이의 비는 ${m * m} : ${n * n}이다. 작은 부침개 ${c}장과 큰 부침개 1장의 넓이의 비는 (${m * m} × ${c}) : ${n * n} = ${x} : ${y}이므로 ${x > y ? `작은 부침개 ${c}장의 양이 더 많다` : x === y ? '양이 서로 같다' : '큰 부침개 1장의 양이 더 많다'}.`,
          facts: { choose: { exprs: [`${c}*${d1}*${d1}`, `${d2}*${d2}`], rule: 'compare' } }
        });
      }, PLANE),
      H('hard-layers', '높이를 삼등분하여 자른 원뿔의 조각의 부피', '심9', (d) => {
        // 함정: 조각의 부피의 비를 1 : 8 : 27 로 쓰는 아이. 조각은 큰 원뿔에서 작은 원뿔을 뺀 것이다(1 : 7 : 19).
        const part = { A: [1, '1'], B: [7, '(2*2*2-1)'], C: [19, '(3*3*3-2*2*2)'] }, [from, to] = d.pick([['A', 'B'], ['A', 'C'], ['C', 'B'], ['B', 'C'], ['C', 'A'], ['B', 'A']]), t = d.int(2, 9), given = part[from][0] * t, ans = part[to][0] * t;
        const b = Board(), co = coneOn(b, [0, 0], 60, 150); sectionOn(b, co, 1 / 3); sectionOn(b, co, 2 / 3);
        b.text([0, 31], 'A').text([0, 75], 'B').text([0, 122], 'C');
        return volQ(`그림과 같이 원뿔을 높이를 삼등분하는 두 점을 각각 지나고 밑면에 평행한 두 평면으로 잘라, 위에서부터 차례로 세 입체도형 A, B, C로 나누었다. 입체도형 ${from}의 부피가 ${given} cm³일 때, 입체도형 ${to}의 부피는?`, ans, {
          figure: b.svg('원뿔과, 밑면에 평행한 두 단면. 두 단면은 원뿔의 높이를 삼등분한다. 세 조각은 위에서부터 A(작은 원뿔), B, C이다'),
          explain: `꼭짓점을 같이 쓰는 세 원뿔은 서로 닮은 도형이고 닮음비는 1 : 2 : 3이므로 부피의 비는 1 : 8 : 27이다. 세 입체도형 A, B, C의 부피의 비는 1 : (8 − 1) : (27 − 8) = 1 : 7 : 19이다. ${given} × ${frac(part[to][0], part[from][0])} = ${ans}(cm³)이다.`,
          facts: { calc: [[`${given}*${part[to][1]}/${part[from][1]}`, 0]], unseen: [1, 2, 3] }
        });
      }, PLANE),
      H('hard-balls', '상자에 꼭 맞게 넣은 구들의 겉넓이의 합의 비', '심10', (d) => {
        // 함정: 구 하나끼리의 겉넓이의 비(k² : 1)만 답하거나, 개수의 비(1 : k³)로 답하는 아이
        const k = d.pick([2, 3]), n = k ** 3, b = Board(), S = 96, x0 = S + 44;
        b.poly([[0, 0], [S, 0], [S, S], [0, S]]).disk([S / 2, S / 2], S / 2, FACE).poly([[x0, 0], [x0 + S, 0], [x0 + S, S], [x0, S]]);
        for (let i = 0; i < k; i += 1) for (let j = 0; j < k; j += 1) b.disk([x0 + (i + 0.5) * S / k, (j + 0.5) * S / k], S / (2 * k), FACE);
        b.text([S / 2, S + 14], 'A').text([x0 + S / 2, S + 14], 'B');
        return ratioQ(`크기가 같은 정육면체 모양의 두 상자 A, B가 있다. 상자 A에는 구 1개가 꼭 맞게 들어 있고, 상자 B에는 크기가 같은 구 ${n}개가 가로, 세로, 높이로 ${k}개씩 꼭 맞게 들어 있다. 그림은 두 상자를 앞에서 본 모양이다. 상자 A에 든 구의 겉넓이와 상자 B에 든 구 ${n}개의 겉넓이의 합의 비를 ${RATIO}`, 1, k, {
          figure: b.svg(`앞에서 본 두 상자 A, B. 상자 A에는 상자에 꼭 맞는 원 1개가, 상자 B에는 크기가 같은 원이 가로로 ${k}개, 세로로 ${k}개 보인다`),
          explain: `상자 A의 구와 상자 B의 구 하나의 반지름의 길이의 비는 ${k} : 1이므로 겉넓이의 비는 ${k * k} : 1이다. 상자 B에는 구가 ${n}개 있으므로 겉넓이의 합의 비는 ${k * k} : ${n} = 1 : ${k}이다.`,
          facts: { calc: [['1', 0], [`${n}/(${k}*${k})`, 1]], unseen: [1] }
        });
      }, PLANE),
      H('hard-flip-claims', '한 각을 같이 쓰고 대응이 뒤집힌 두 삼각형에 대한 설명 가리기', '심13', (d) => {
        // 함정: 선분 DE가 변 BC와 나란하다고 여겨 AB : AD = AC : AE 로 식을 세우는 아이. ∠C = ∠ADE 이므로 점 C의 대응점은 점 D다.
        const [v, f] = fitted(d, () => { const [m, k] = d.pick([[1, 2], [2, 3], [2, 5], [1, 3], [3, 4]]); return { m, k, p: d.int(3, 9), q: d.int(3, 9), s: d.int(3, 9) }; },
          (w) => { const ca = (w.p * w.p + w.q * w.q - w.s * w.s) / (2 * w.p * w.q); return w.p !== w.q && ca > 0.2 && ca < 0.8 && w.k * w.p - w.m * w.q >= 2 && w.k * w.q - w.m * w.p >= 2 && w.k * Math.max(w.p, w.q, w.s) <= 27 && w.m * Math.min(w.p, w.q) >= 3; },
          (w) => {
            const al = acosd((w.p * w.p + w.q * w.q - w.s * w.s) / (2 * w.p * w.q)), A0 = [0, 0];
            const P = level({ A: A0, B: go(A0, w.k * w.p, 270 - al / 2), C: go(A0, w.k * w.q, 270 + al / 2), D: go(A0, w.m * w.q, 270 - al / 2), E: go(A0, w.m * w.p, 270 + al / 2) }, 'B', 'C');
            return figs([{ P, order: 'ABC', segs: [['D', 'E']], marks: [['C', 'A', 'B'], ['D', 'A', 'E']], sides: [['A', 'D', cm(w.m * w.q)], ['D', 'B', cm(w.k * w.p - w.m * w.q)], ['A', 'E', cm(w.m * w.p)], ['B', 'C', cm(w.k * w.s)]] }], { w: 180, h: 132 });
          });
        const AE = v.m * v.p, AD = v.m * v.q, AB = v.k * v.p, AC = v.k * v.q, BC = v.k * v.s, DE = v.m * v.s, DB = AB - AD, naive = BC * AD / AB, wrong = Number.isInteger(naive) && naive !== DE ? naive : DE + 1, wantTrue = d.bool();
        const yes = [`${tri('ABC')} ${SIM} ${tri('AED')}`, '∠ABC = ∠AED', `${SG('AB')} : ${SG('AE')} = ${SG('BC')} : ${SG('ED')}`, `${SG('AC')} = ${cm(AC)}`, `${SG('DE')} = ${cm(DE)}`];
        const no = [
          [`${SG('AB')} : ${SG('AD')} = ${SG('AC')} : ${SG('AE')}`, `∠C = ∠ADE이므로 점 C의 대응점은 점 D, 점 B의 대응점은 점 E이다. ${SG('AB')}의 대응변은 ${SG('AE')}, ${SG('AC')}의 대응변은 ${SG('AD')}이므로 ${SG('AB')} : ${SG('AE')} = ${SG('AC')} : ${SG('AD')}이다.`],
          [`${tri('ABC')} ${SIM} ${tri('ADE')}`, `∠A는 공통이고 ∠C = ∠ADE이므로 점 C의 대응점은 점 D이다. ${tri('ABC')} ${SIM} ${tri('AED')} (AA 닮음)이다.`, [yes[0]]],
          [`${SG('DE')} = ${cm(wrong)}`, `${SG('AB')} : ${SG('AE')} = ${AB} : ${AE} = ${v.k} : ${v.m}이므로 ${BC} : ${SG('ED')} = ${v.k} : ${v.m}에서 ${SG('DE')} = ${cm(DE)}이다.`, [yes[4]]],
          ['∠ABC = ∠ADE', `∠ADE와 크기가 같은 각은 ∠C이다. ${tri('ABC')} ${SIM} ${tri('AED')}이므로 ∠ABC = ∠AED이다.`, [yes[1]]]
        ];
        return sayQ(d, `그림의 ${tri('ABC')}에서 점 D는 변 AB 위에, 점 E는 변 AC 위에 있고 ∠C = ∠ADE이다. ${SG('AD')} = ${cm(AD)}, ${SG('DB')} = ${cm(DB)}, ${SG('AE')} = ${cm(AE)}, ${SG('BC')} = ${cm(BC)}일 때, 다음 중 ${wantTrue ? '옳은' : '옳지 않은'} 것은?`, yes, no, wantTrue,
          f.b.svg(`삼각형 ABC. 점 D는 변 AB 위에, 점 E는 변 AC 위에 있고 선분 DE가 그어져 있다. ∠C와 ∠ADE에 같은 표시가 있다. 선분 AD = ${cm(AD)}, 선분 DB = ${cm(DB)}, 선분 AE = ${cm(AE)}, 변 BC = ${cm(BC)}`));
      }),

      // ── ② 세 단계 넘게 이어 생각해야 풀리는 문제 ──
      H('hard-golden', '닮음에서 얻은 각으로 이등변삼각형의 각의 크기 구하기', '기본 ①26', (d) => {
        const t = asa(10, 72, 72), pD = meet(t.C, go(t.C, 1, 144), t.A, t.B), ask = d.pick(['A', 'ABC', 'BDC']), ans = ask === 'A' ? 36 : 72, x = V('x');
        const f = figs([{ P: { A: t.A, B: t.B, C: t.C, D: pD }, order: 'ABC', segs: [['C', 'D']], marks: [['C', 'B', 'D'], ['C', 'D', 'A']], ticks: [['A', 'B', 1], ['A', 'C', 1]], at: { D: 160 } }], { w: 130, h: 170 });
        return degQ(`그림과 같이 ${SG('AB')} = ${SG('AC')}인 이등변삼각형 ABC에서 ∠C의 이등분선이 변 AB와 만나는 점을 D라 하자. ${tri('ABC')} ${SIM} ${tri('CDB')}일 때, ∠${ask}의 크기는?`, ans, {
          figure: f.b.svg('변 AB와 변 AC의 길이가 같은 이등변삼각형 ABC. 점 D는 변 AB 위에 있고 선분 CD가 ∠C를 이등분한다. ∠BCD와 ∠ACD에 같은 표시가 있다'),
          explain: `${tri('ABC')} ${SIM} ${tri('CDB')}이므로 ∠A = ∠DCB이다. ∠A = ${x}°라 하면 ∠DCB = ${x}°이고, 선분 CD가 ∠C의 이등분선이므로 ∠ACB = 2${x}°이다. ${SG('AB')} = ${SG('AC')}이므로 ∠ABC = ∠ACB = 2${x}°이다. 세 내각의 크기의 합에서 ${x} + 2${x} + 2${x} = 180, ${x} = 36이다. ${ask === 'A' ? '∠A = 36°이다.' : ask === 'ABC' ? '∠ABC = 2 × 36° = 72°이다.' : '∠BDC의 대응각은 ∠ABC이므로 ∠BDC = 2 × 36° = 72°이다.'}`,
          facts: { calc: [[ask === 'A' ? '180/5' : '2*180/5', 0]], unseen: [180, 5, 2] }
        });
      }),
      H('hard-equi-60', '정삼각형 안의 60°가 만드는 닮은 두 삼각형', '기본 ②40', (d) => {
        const [BE, EC] = d.pick([[4, 12], [12, 4], [3, 6], [6, 3], [6, 12], [12, 6], [10, 15], [15, 10], [5, 20]]), s = BE + EC, DB = BE * EC / s;
        const f = figs([{ P: { A: [s / 2, s * Math.sqrt(3) / 2], B: [0, 0], C: [s, 0], D: go([0, 0], DB, 60), E: [BE, 0] }, order: 'ABC', segs: [['D', 'E'], ['A', 'E']], angles: [['E', 'D', 'A', '60°']], dims: [['B', 'E', cm(BE), 25, 'A'], ['E', 'C', cm(EC), 25, 'A']], at: { E: 270 } }], { w: 170, h: 150 });
        return lenQ(`그림과 같이 정삼각형 ABC의 두 변 AB, BC 위에 각각 점 D, E를 잡았더니 ∠AED = 60°였다. ${SG('BE')} = ${cm(BE)}, ${SG('EC')} = ${cm(EC)}일 때, ${SG('BD')}의 길이는?`, DB, {
          figure: f.b.svg(`정삼각형 ABC. 점 D는 변 AB 위에, 점 E는 변 BC 위에 있고 선분 DE와 선분 AE가 그어져 있다. ∠AED = 60°, 선분 BE = ${cm(BE)}, 선분 EC = ${cm(EC)}`),
          explain: `∠B = ∠C = 60°이다. ${tri('DBE')}에서 ∠BDE + ∠BED = 120°이고, 점 E에서 ∠BED + 60° + ∠AEC = 180°이므로 ∠BDE = ∠AEC이다. 따라서 ${tri('DBE')} ${SIM} ${tri('ECA')} (AA 닮음)이다. ${SG('AC')} = ${BE} + ${EC} = ${s}(cm)이므로 ${SG('DB')} : ${SG('EC')} = ${SG('BE')} : ${SG('CA')}에서 ${SG('DB')} : ${EC} = ${BE} : ${s}, ${SG('BD')} = ${cm(DB)}이다.`,
          facts: { calc: [[`${BE}*${EC}/(${BE}+${EC})`, 0]] }
        });
      }),
      H('hard-inner-tri', '세 각이 같게 그은 세 선분이 만드는 삼각형의 둘레의 길이', '기본 ②41 심19 심20', (d) => {
        const [c0, a0, b0] = d.pick([[4, 5, 6], [5, 6, 7], [6, 5, 7], [6, 7, 8], [5, 7, 8], [4, 6, 7], [6, 7, 5]]), [m, n] = d.pick([[1, 2], [1, 3], [2, 5]]), AB = n * c0, BC = n * a0, CA = n * b0, DE = m * c0;
        const t0 = { A: null, B: [0, 0], C: [BC, 0] }; t0.A = [(BC * BC + AB * AB - CA * CA) / (2 * BC), Math.sqrt(AB * AB - ((BC * BC + AB * AB - CA * CA) / (2 * BC)) ** 2)];
        const s = innerTri(t0, innerAt(t0, m / n));
        const f = figs([{ P: { A: t0.A, B: t0.B, C: t0.C, D: s.D, E: s.E, F: s.F }, order: 'ABC', hide: 'DEF', segs: [['A', 'E'], ['B', 'F'], ['C', 'D']], marks: [['A', 'B', 'E'], ['B', 'C', 'F'], ['C', 'A', 'D']], sides: [['A', 'B', cm(AB)], ['B', 'C', cm(BC)], ['C', 'A', cm(CA)]] }], { w: 200, h: 150 }), q = f.Q[0];
        // 안쪽 삼각형의 꼭짓점 이름은 둘레의 선분에 가장 덜 닿는 쪽에 적는다.
        const segs = [[q.A, q.B], [q.B, q.C], [q.C, q.A], [q.A, q.E], [q.B, q.F], [q.C, q.D]];
        for (const k of ['D', 'E', 'F']) f.b.name(q[k], k, clearDir(q[k], segs, 13), 13);
        const ans = m * (c0 + a0 + b0);
        return lenQ(`그림의 ${tri('ABC')}에서 ∠BAE = ∠CBF = ∠ACD이고 ${SG('AB')} = ${cm(AB)}, ${SG('BC')} = ${cm(BC)}, ${SG('CA')} = ${cm(CA)}, ${SG('DE')} = ${cm(DE)}일 때, ${tri('DEF')}의 둘레의 길이는?`, ans, {
          figure: f.b.svg(`삼각형 ABC의 안쪽에 삼각형 DEF가 있다. 꼭짓점 A에서 그은 선분 위에 점 D, E가 차례로, 꼭짓점 B에서 그은 선분 위에 점 E, F가 차례로, 꼭짓점 C에서 그은 선분 위에 점 F, D가 차례로 있다. ∠BAE, ∠CBF, ∠ACD에 같은 표시가 있다. 변 AB = ${cm(AB)}, 변 BC = ${cm(BC)}, 변 CA = ${cm(CA)}`),
          explain: `${tri('ABE')}에서 ∠DEF = ∠BAE + ∠ABE = ∠CBF + ∠ABE = ∠ABC이고, 같은 방법으로 ${tri('BCF')}에서 ∠EFD = ∠BCA이다. 따라서 ${tri('ABC')} ${SIM} ${tri('DEF')} (AA 닮음)이고 닮음비는 ${SG('AB')} : ${SG('DE')} = ${AB} : ${DE} = ${n} : ${m}이다. ${tri('ABC')}의 둘레의 길이가 ${AB + BC + CA} cm이므로 ${tri('DEF')}의 둘레의 길이는 ${AB + BC + CA} × ${frac(m, n)} = ${ans}(cm)이다.`,
          facts: { calc: [[`${DE}*(${AB}+${BC}+${CA})/${AB}`, 0]] }
        });
      }),
      H('hard-rhombus', '삼각형에 꼭 끼인 마름모의 한 변의 길이', '심18', (d) => {
        const [c, a] = d.pick([[12, 6], [15, 10], [18, 9], [10, 15], [6, 3], [20, 30], [21, 28], [24, 12], [30, 20]]), x = c * a / (c + a), be = d.pick([58, 64, 70]), B0 = [0, 0], pD = go(B0, x, be), X0 = V('x');
        const f = figs([{ P: { A: go(B0, c, be), B: B0, C: [a, 0], D: pD, E: [x, 0], F: [pD[0] + x, pD[1]] }, order: 'ABC', segs: [['D', 'F'], ['F', 'E']], ticks: [['B', 'D', 1], ['B', 'E', 1], ['D', 'F', 1], ['F', 'E', 1]], dims: [['A', 'B', cm(c), 25, 'C'], ['B', 'C', cm(a), 25, 'A']], at: { E: 270 } }], { w: 180, h: 150 });
        return lenQ(`그림의 ${tri('ABC')}에서 세 점 D, E, F는 각각 변 AB, BC, CA 위의 점이고 ${quad('DBEF')}는 마름모이다. ${SG('AB')} = ${cm(c)}, ${SG('BC')} = ${cm(a)}일 때, 마름모 DBEF의 한 변의 길이는?`, x, {
          figure: f.b.svg(`삼각형 ABC. 점 D는 변 AB 위에, 점 E는 변 BC 위에, 점 F는 변 CA 위에 있고 사각형 DBEF의 네 변에 길이가 같다는 표시가 있다. 변 AB = ${cm(c)}, 변 BC = ${cm(a)}`),
          explain: `마름모의 한 변의 길이를 ${X0} cm라 하면 ${SG('AD')} = (${c} − ${X0}) cm, ${SG('DF')} = ${X0} cm이다. ${SG('DF')} ${PAR} ${SG('BC')}이므로 ∠ADF = ∠B(동위각)이고 ∠A는 공통이다. ${tri('ABC')} ${SIM} ${tri('ADF')} (AA 닮음)이므로 ${SG('AB')} : ${SG('AD')} = ${SG('BC')} : ${SG('DF')}에서 ${c} : (${c} − ${X0}) = ${a} : ${X0}이다. ${c}${X0} = ${a}(${c} − ${X0}), ${c + a}${X0} = ${c * a}, ${X0} = ${x}이다.`,
          facts: { calc: [[`${c}*${a}/(${c}+${a})`, 0]] }
        });
      }),
      H('hard-median-alt', '직각삼각형의 수선과 빗변의 중점, 다시 그은 수선', '심21 심22', (d) => {
        const [p, q] = d.pick([[12, 3], [3, 12], [9, 4], [4, 9], [2, 8], [8, 2], [16, 9], [9, 16], [4, 16], [16, 4]]), h = Math.sqrt(p * q), P = altTri(p, q), g = gcd(2 * p * q, p + q), am = (p + q) % 2 === 0 ? String((p + q) / 2) : frac(p + q, 2);
        P.M = [(p + q) / 2, 0]; P.H = foot(P.D, P.A, P.M);
        const f = figs([{ P, order: 'ABC', segs: [['A', 'D'], ['A', 'M'], ['D', 'H']], right: [['A', 'B', 'C'], ['D', 'A', p < q ? 'B' : 'C'], ['H', 'D', 'A']], ticks: [['B', 'M', 2], ['M', 'C', 2]], dims: [['B', 'D', cm(p), 25, 'A'], ['D', 'C', cm(q), 25, 'A']], at: { D: 270, M: 270, H: deg(P.D, P.H) } }], { w: 200, h: 124 });
        return fracQ(`그림과 같이 ∠A = 90°인 직각삼각형 ABC에서 점 M은 변 BC의 중점이고, 꼭짓점 A에서 변 BC에 내린 수선의 발을 D, 점 D에서 선분 AM에 내린 수선의 발을 H라 하자. ${SG('BD')} = ${cm(p)}, ${SG('DC')} = ${cm(q)}일 때, ${SG('AH')}의 길이는?`, 2 * p * q, p + q, 'cm', {
          figure: f.b.svg(`∠A가 직각인 삼각형 ABC. 점 M은 변 BC의 중점, 점 D는 꼭짓점 A에서 변 BC에 내린 수선의 발, 점 H는 점 D에서 선분 AM에 내린 수선의 발이다. 선분 BD = ${cm(p)}, 선분 DC = ${cm(q)}`),
          explain: `${tri('ABD')} ${SIM} ${tri('CAD')}이므로 ${SG('AD')}${sup(2)} = ${SG('BD')} × ${SG('CD')} = ${p * q}, ${SG('AD')} = ${cm(h)}이다. 직각삼각형의 빗변의 중점 M은 외심이므로 ${SG('AM')} = ${SG('BM')} = ${am}(cm)이다. ∠AHD = ∠ADM = 90°, ∠DAM은 공통이므로 ${tri('AHD')} ${SIM} ${tri('ADM')} (AA 닮음)이고 ${SG('AD')}${sup(2)} = ${SG('AH')} × ${SG('AM')}이다. ${SG('AH')} = ${p * q} ÷ ${am} = ${frac(2 * p * q / g, (p + q) / g)}(cm)이다.`,
          facts: { value: `${p}*${q}/((${p}+${q})/2)`, unseen: [2] }
        });
      }),
      H('hard-circum', '직각삼각형의 수선의 발에서 다시 내린 수선과 외접원의 넓이', '심23', (d) => {
        const [BC, AC, CD] = d.pick([[12, 18, 8], [6, 9, 4], [12, 24, 6], [20, 25, 16], [18, 27, 12], [24, 36, 16], [8, 16, 4], [16, 32, 8]]), r = CD / 2, pA = [0, Math.sqrt(AC * AC - BC * BC)], pD = foot([0, 0], pA, [BC, 0]);
        const f = figs([{ P: { A: pA, B: [0, 0], C: [BC, 0], D: pD, E: [pD[0], 0] }, order: 'ABC', segs: [['B', 'D'], ['D', 'E']], right: [['B', 'A', 'C'], ['D', 'B', 'C'], ['E', 'D', 'C']], dims: [['B', 'C', cm(BC), 25, 'A'], ['A', 'C', cm(AC), 25, 'B']], at: { E: 270 } }], { w: 180, h: 130 });
        return piQ(`그림과 같이 ∠B = 90°인 직각삼각형 ABC의 꼭짓점 B에서 변 AC에 내린 수선의 발을 D, 점 D에서 변 BC에 내린 수선의 발을 E라 하자. ${SG('BC')} = ${cm(BC)}, ${SG('AC')} = ${cm(AC)}일 때, ${tri('DEC')}의 외접원의 넓이는?`, r * r, 'cm²', {
          figure: f.b.svg(`∠B가 직각인 삼각형 ABC. 점 D는 꼭짓점 B에서 변 AC에 내린 수선의 발, 점 E는 점 D에서 변 BC에 내린 수선의 발이다. 변 BC = ${cm(BC)}, 변 AC = ${cm(AC)}`),
          explain: `∠C는 공통이고 ∠ABC = ∠BDC = 90°이므로 ${tri('ABC')} ${SIM} ${tri('BDC')} (AA 닮음)이다. ${SG('AC')} : ${SG('BC')} = ${SG('BC')} : ${SG('DC')}에서 ${AC} : ${BC} = ${BC} : ${SG('DC')}, ${SG('DC')} = ${cm(CD)}이다. ${tri('DEC')}는 ∠E = 90°인 직각삼각형이므로 외접원의 지름은 빗변 DC이다. 반지름의 길이가 ${cm(r)}이므로 넓이는 ${r * r}π cm²이다.`,
          facts: { calc: [[`(${BC}*${BC}/${AC}/2)*(${BC}*${BC}/${AC}/2)`, 0]], unseen: [2] }
        });
      }),
      H('hard-rect-diag', '직사각형의 대각선에 내린 두 수선의 발 사이의 거리', '심24', (d) => {
        const [AB, AD, BD] = d.pick([[6, 8, 10], [9, 12, 15], [12, 16, 20], [18, 24, 30], [21, 28, 35]]), P = { A: [0, AB], B: [0, 0], C: [AD, 0], D: [AD, AB] }, BM = AB * AB / BD, g = gcd(AD * AD - AB * AB, BD), g2 = gcd(AB * AB, BD);
        P.M = foot(P.A, P.B, P.D); P.N = foot(P.C, P.B, P.D);
        const f = figs([{ P, order: 'ABCD', segs: [['B', 'D'], ['A', 'M'], ['C', 'N']], right: [['M', 'A', 'D'], ['N', 'C', 'B']], sides: [['A', 'B', cm(AB)], ['A', 'D', cm(AD)]], at: { M: deg(P.A, P.M), N: deg(P.C, P.N), A: 135, B: 225, C: 315, D: 45 } }], { w: 200, h: 140 });
        return fracQ(`그림과 같이 ${SG('AB')} = ${cm(AB)}, ${SG('AD')} = ${cm(AD)}, ${SG('BD')} = ${cm(BD)}인 직사각형 ABCD의 두 꼭짓점 A, C에서 대각선 BD에 내린 수선의 발을 각각 M, N이라 하자. ${SG('MN')}의 길이는?`, AD * AD - AB * AB, BD, 'cm', {
          figure: f.b.svg(`직사각형 ABCD와 대각선 BD. 점 M은 꼭짓점 A에서, 점 N은 꼭짓점 C에서 대각선 BD에 내린 수선의 발이다. 대각선 위에 점 B, M, N, D가 차례로 있다. 변 AB = ${cm(AB)}, 변 AD = ${cm(AD)}, 대각선 BD = ${cm(BD)}`),
          explain: `∠ABM은 공통이고 ∠BAD = ∠BMA = 90°이므로 ${tri('ABD')} ${SIM} ${tri('MBA')} (AA 닮음)이다. ${SG('AB')} : ${SG('MB')} = ${SG('BD')} : ${SG('BA')}에서 ${AB} : ${SG('BM')} = ${BD} : ${AB}, ${SG('BM')} = ${frac(AB * AB / g2, BD / g2)}(cm)이다. ${tri('ABM')} ≡ ${tri('CDN')}이므로 ${SG('DN')} = ${SG('BM')}이다. ${SG('MN')} = ${BD} − 2 × ${frac(AB * AB / g2, BD / g2)} = ${frac((AD * AD - AB * AB) / g, BD / g)}(cm)이다.`,
          facts: { value: `${BD}-2*${AB}*${AB}/${BD}`, unseen: [2] }
        });
      }),
      H('hard-bisect-right', '각의 이등분선과 수선이 있는 직각삼각형', '기본 ②49', tidy((d) => {
        const [AC, BD, BE, CD] = d.pick([[6, 5, 4, 3], [12, 10, 8, 6], [18, 15, 12, 9], [12, 5, 3, 4], [24, 10, 6, 8], [15, 26, 24, 10]]), BC = CD + BD, AB = AC + BE, P = { A: [0, AC], B: [BC, 0], C: [0, 0], D: [CD, 0] };
        P.E = foot(P.D, P.A, P.B);
        const f = figs([{ P, order: 'ACB', segs: [['A', 'D'], ['D', 'E']], right: [['C', 'A', 'B'], ['E', 'D', 'B']], marks: [['A', 'C', 'D'], ['A', 'D', 'B']], sides: [['A', 'C', cm(AC)], ['E', 'B', cm(BE), { in: 'C' }]], dims: [['D', 'B', cm(BD), 25, 'A']], at: { D: 270, E: deg(P.D, P.E) } }], { w: 200, h: 130 });
        return lenQ(`그림과 같이 ∠C = 90°인 직각삼각형 ABC에서 ∠A의 이등분선이 변 BC와 만나는 점을 D, 점 D에서 변 AB에 내린 수선의 발을 E라 하자. ${SG('AC')} = ${cm(AC)}, ${SG('BD')} = ${cm(BD)}, ${SG('BE')} = ${cm(BE)}일 때, ${SG('CD')}의 길이는?`, CD, {
          figure: f.b.svg(`∠C가 직각인 삼각형 ABC. 점 D는 변 BC 위에 있고 선분 AD가 ∠A를 이등분한다. 점 E는 점 D에서 변 AB에 내린 수선의 발이다. ∠CAD와 ∠DAB에 같은 표시가 있다. 변 AC = ${cm(AC)}, 선분 BD = ${cm(BD)}, 선분 BE = ${cm(BE)}`),
          explain: `${tri('ACD')}와 ${tri('AED')}는 빗변 AD가 공통이고 ∠CAD = ∠EAD인 직각삼각형이므로 합동이다. ${SG('AE')} = ${SG('AC')} = ${cm(AC)}, ${SG('CD')} = ${SG('ED')}이고 ${SG('AB')} = ${AC} + ${BE} = ${AB}(cm)이다. ∠B는 공통이고 ∠ACB = ∠DEB = 90°이므로 ${tri('ABC')} ${SIM} ${tri('DBE')} (AA 닮음)이다. ${SG('AB')} : ${SG('DB')} = ${SG('AC')} : ${SG('DE')}에서 ${AB} : ${BD} = ${AC} : ${SG('DE')}, ${SG('DE')} = ${cm(CD)}이므로 ${SG('CD')} = ${cm(CD)}이다.`,
          facts: { calc: [[`${AC}*${BD}/(${AC}+${BE})`, 0]] }
        });
      })),
      H('hard-fold-rect', '직사각형을 접어 꼭짓점이 변 위에 오게 할 때', '기본 ①44 ②50 심27 심28', (d) => {
        const [AF, AE, DC, FD] = d.pick([[3, 4, 9, 12], [6, 8, 18, 24], [4, 3, 8, 6], [8, 6, 16, 12], [12, 9, 24, 18], [24, 10, 36, 15]]), w = AF + FD, P = { A: [0, DC], B: [0, 0], C: [w, 0], D: [w, DC], E: [0, DC - AE], F: [AF, DC] };
        const f = figs([{ P, order: '', fills: [['EFC']], segs: [['A', 'D'], ['D', 'C'], ['A', 'E'], ['E', 'F'], ['F', 'C'], ['E', 'C'], ['E', 'B', 'cut'], ['B', 'C', 'cut']], right: [['A', 'E', 'F'], ['D', 'F', 'C'], ['F', 'E', 'C']], sides: [['A', 'F', cm(AF), { in: 'B' }], ['A', 'E', cm(AE), { in: 'D' }], ['D', 'C', cm(DC), { in: 'A' }]], at: { A: 135, B: 225, C: 315, D: 45, E: 180, F: 62 } }], { w: 200, h: 130 });
        return lenQ(`그림은 직사각형 ABCD를 선분 EC를 접는 선으로 하여 꼭짓점 B가 변 AD 위의 점 F에 오도록 접은 것이다. ${SG('AF')} = ${cm(AF)}, ${SG('AE')} = ${cm(AE)}, ${SG('DC')} = ${cm(DC)}일 때, ${SG('FD')}의 길이는?`, FD, {
          figure: f.b.svg(`직사각형 ABCD. 점 E는 변 AB 위에, 점 F는 변 AD 위에 있다. 삼각형 EBC를 선분 EC로 접어 옮긴 삼각형 EFC가 색칠되어 있고, 접기 전의 변 EB와 변 BC는 점선이다. 선분 AF = ${cm(AF)}, 선분 AE = ${cm(AE)}, 변 DC = ${cm(DC)}`),
          explain: `접은 각이므로 ∠EFC = ∠B = 90°이다. ∠AFE + ∠DFC = 90°이고 ${tri('AEF')}에서 ∠AFE + ∠AEF = 90°이므로 ∠AEF = ∠DFC이다. ∠A = ∠D = 90°이므로 ${tri('AEF')} ${SIM} ${tri('DFC')} (AA 닮음)이다. ${SG('AE')} : ${SG('DF')} = ${SG('AF')} : ${SG('DC')}에서 ${AE} : ${SG('FD')} = ${AF} : ${DC}, ${SG('FD')} = ${cm(FD)}이다.`,
          facts: { calc: [[`${AE}*${DC}/${AF}`, 0]] }
        });
      }),
      H('hard-fold-equi', '정삼각형을 접어 꼭짓점이 변 위에 오게 할 때', '기본 ②52 심25', (d) => {
        const [s, fv, t] = d.pick([[15, 3, 7], [15, 5, 7], [28, 7, 13], [28, 8, 13], [20, 15, 13], [21, 15, 13]]), g = s - fv, x = t * g / (s - t), pA = [s / 2, s * Math.sqrt(3) / 2], gg = gcd(t * g, s - t);
        const P = { A: pA, B: [0, 0], C: [s, 0], D: toward(pA, [0, 0], t), E: toward(pA, [s, 0], x), F: [fv, 0] };
        const f = figs([{ P, order: '', fills: [['DEF']], segs: [['B', 'C'], ['B', 'D'], ['C', 'E'], ['D', 'F'], ['E', 'F'], ['D', 'E'], ['A', 'D', 'cut'], ['A', 'E', 'cut']], sides: [['A', 'D', cm(t), { in: 'C' }]], dims: [['B', 'F', cm(fv), 25, 'A'], ['F', 'C', cm(g), 25, 'A']], at: { A: 90, B: 210, C: 330, D: 160, E: 20, F: 270 } }], { w: 180, h: 160 });
        return fracQ(`그림은 한 변의 길이가 ${cm(s)}인 정삼각형 ABC 모양의 종이를 선분 DE를 접는 선으로 하여 꼭짓점 A가 변 BC 위의 점 F에 오도록 접은 것이다. ${SG('BF')} = ${cm(fv)}, ${SG('FC')} = ${cm(g)}, ${SG('AD')} = ${cm(t)}일 때, ${SG('AE')}의 길이는?`, t * g, s - t, 'cm', {
          figure: f.b.svg(`정삼각형 ABC. 점 D는 변 AB 위에, 점 E는 변 AC 위에, 점 F는 변 BC 위에 있다. 삼각형 ADE를 선분 DE로 접어 옮긴 삼각형 FDE가 색칠되어 있고, 접기 전의 변 AD와 변 AE는 점선이다. 선분 BF = ${cm(fv)}, 선분 FC = ${cm(g)}, 선분 AD = ${cm(t)}`),
          explain: `접은 변과 접은 각은 같으므로 ${SG('DF')} = ${SG('AD')} = ${cm(t)}, ${SG('EF')} = ${SG('AE')}, ∠DFE = ∠A = 60°이다. ∠B = ∠C = 60°이고 ∠BDF + ∠BFD = 120°, ∠BFD + 60° + ∠CFE = 180°이므로 ∠BDF = ∠CFE이다. ${tri('DBF')} ${SIM} ${tri('FCE')} (AA 닮음)이고 ${SG('DB')} = ${s} − ${t} = ${s - t}(cm)이므로 ${SG('DB')} : ${SG('FC')} = ${SG('DF')} : ${SG('FE')}에서 ${s - t} : ${g} = ${t} : ${SG('FE')}이다. ${SG('AE')} = ${SG('FE')} = ${frac(t * g / gg, (s - t) / gg)}(cm)이다.`,
          facts: { value: `${t}*${g}/(${s}-${t})` }
        });
      }),
      H('hard-perp-bisector', '직사각형의 대각선의 수직이등분선이 변과 만나는 점', '기본 ①46', (d) => {
        const [AO, BC, BE] = d.pick([[15, 25, 7], [20, 32, 7], [18, 27, 3], [12, 18, 2], [24, 36, 4]]), AB = Math.sqrt(4 * AO * AO - BC * BC), CE = BC - BE;
        const P = { A: [0, AB], B: [0, 0], C: [BC, 0], D: [BC, AB], E: [BE, 0], F: [BC - BE, AB], O: [BC / 2, AB / 2] };
        const f = figs([{ P, order: 'ABCD', segs: [['A', 'C'], ['E', 'F']], right: [['O', 'E', 'C']], ticks: [['A', 'O', 2], ['O', 'C', 2]], sides: [['A', 'O', cm(AO), { in: 'B', t: 0.4 }]], dims: [['B', 'C', cm(BC), 25, 'A']], at: { A: 135, B: 225, C: 315, D: 45, E: 270, F: 90, O: 0 }, gapOf: { O: 14 } }], { w: 210, h: 140 });
        return lenQ(`그림과 같이 직사각형 ABCD의 대각선 AC의 중점 O를 지나고 대각선 AC에 수직인 직선이 두 변 BC, AD와 만나는 점을 각각 E, F라 하자. ${SG('AO')} = ${cm(AO)}, ${SG('BC')} = ${cm(BC)}일 때, ${SG('BE')}의 길이는?`, BE, {
          figure: f.b.svg(`직사각형 ABCD와 대각선 AC. 점 O는 대각선 AC의 중점이고, 점 O를 지나고 대각선 AC에 수직인 선분 EF의 끝 점 E는 변 BC 위에, 점 F는 변 AD 위에 있다. 선분 AO = ${cm(AO)}, 변 BC = ${cm(BC)}`),
          explain: `${SG('AC')} = 2 × ${AO} = ${2 * AO}(cm)이다. ∠ACB는 공통이고 ∠EOC = ∠ABC = 90°이므로 ${tri('COE')} ${SIM} ${tri('CBA')} (AA 닮음)이다. ${SG('CO')} : ${SG('CB')} = ${SG('CE')} : ${SG('CA')}에서 ${AO} : ${BC} = ${SG('CE')} : ${2 * AO}, ${SG('CE')} = ${cm(CE)}이다. ${SG('BE')} = ${BC} − ${CE} = ${BE}(cm)이다.`,
          facts: { calc: [[`${BC}-2*${AO}*${AO}/${BC}`, 0]], unseen: [2] }
        });
      })
    ]
  });
  // ── 기본 묶음에 덧붙이는 꼴 ──
  // 받으면서 실력에서 기본으로 내린 꼴: 기본에서 하는 일을 다시 묻거나 한 번에 풀리는 것.
  const TB = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 자료(' + ref + ')', make }, more || {});
  B.addTypes('8-2-3', 'ratio', [
    TB('ratio-copy', '축소·확대하여 복사한 그림의 넓이', '기본 ②20', (d) => {
      // 함정: 넓이도 같은 비율(40 %)로 줄어든다고 여기는 아이. 넓이의 비는 닮음비의 제곱의 비다.
      const [p, list] = d.pick([[40, [225, 125, 75, 50, 175]], [60, [75, 125, 50, 150, 175]], [80, [75, 125, 50, 150]], [150, [48, 36, 60, 20, 80]], [120, [75, 50, 125]], [20, [125, 75, 150, 225]]]), S = d.pick(list), ans = S * p * p / 10000, g = gcd(100, p), word = p < 100 ? '축소' : '확대';
      return areaQ(`넓이가 ${S} cm²인 그림을 복사기로 ${p} %로 ${word}하여 복사하였다. 복사한 그림의 넓이는? (단, ${p} %로 ${word}하면 그림의 가로와 세로의 길이가 각각 처음의 ${p} %가 된다.)`, ans, {
        explain: `처음 그림과 복사한 그림은 닮은 도형이고 닮음비는 100 : ${p} = ${100 / g} : ${p / g}이다. 넓이의 비는 ${100 / g}${sup(2)} : ${p / g}${sup(2)} = ${(100 / g) ** 2} : ${(p / g) ** 2}이므로 복사한 그림의 넓이는 ${S} × ${frac((p / g) ** 2, (100 / g) ** 2)} = ${ans}(cm²)이다.`,
        facts: { calc: [[`${S}*${p}*${p}/(100*100)`, 0]], unseen: [100] }
      });
    }, PLANE)
  ]);
  B.addTypes('8-2-3', 'solid', [
    TB('solid-cut-cone', '밑면에 평행하게 자른 원뿔에서 처음 원뿔의 밑면의 반지름', '심5', (d) => {
      // 함정: 잘린 두 조각의 모선의 길이의 비(l1 : l2)를 닮음비로 쓰는 아이. 닮은 것은 잘린 작은 원뿔과 처음 원뿔이다.
      // 모선과 반지름의 길이의 비 u : v 에 맞추어 원뿔을 그린다(그림에서 잰 길이의 비가 적힌 수와 같다).
      const [a, bb] = d.pick([[2, 5], [3, 5], [2, 3], [3, 4], [4, 7], [3, 7], [1, 3], [4, 5]]), [u, v] = d.pick([[2, 1], [3, 1], [3, 2], [4, 2], [5, 2], [5, 3]]), l1 = a * u, l2 = (bb - a) * u, r = a * v, R = bb * v;
      const slope = Math.sqrt(u * u - v * v) / v, rx = Math.min(68, 118 / slope), b = Board(), co = coneOn(b, [0, 0], rx, rx * slope), sec = sectionOn(b, co, a / bb);
      b.seg(sec.c, sec.L, 'thin').dot(sec.c, 2).text([sec.L[0] - 22, sec.c[1]], cm(r), blue).beside(co.apex, sec.R, cm(l1), co.c).beside(sec.R, co.R, cm(l2), co.c);
      return lenQ(`그림과 같이 원뿔을 밑면에 평행한 평면으로 잘랐다. 원뿔의 꼭짓점에서 단면까지의 모선의 길이가 ${cm(l1)}, 단면에서 밑면까지의 모선의 길이가 ${cm(l2)}이고 단면의 반지름의 길이가 ${cm(r)}일 때, 처음 원뿔의 밑면의 반지름의 길이는?`, R, {
        figure: b.svg(`원뿔과, 밑면에 평행한 단면. 모선 위에서 꼭짓점부터 단면까지 ${cm(l1)}, 단면부터 밑면까지 ${cm(l2)}. 단면인 원의 반지름의 길이 ${cm(r)}`),
        explain: `단면 위쪽의 작은 원뿔과 처음 원뿔은 닮은 도형이다. 닮음비는 모선의 길이의 비이므로 ${l1} : (${l1} + ${l2}) = ${a} : ${bb}이다. ${r} : (밑면의 반지름의 길이) = ${a} : ${bb}에서 밑면의 반지름의 길이는 ${R} cm이다.`,
        facts: { calc: [[`${r}*(${l1}+${l2})/${l1}`, 0]] }
      });
    }, PLANE)
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
