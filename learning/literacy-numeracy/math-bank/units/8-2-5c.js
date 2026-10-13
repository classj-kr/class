// 중학교 2학년 2학기 5단원 피타고라스 정리 — 실력 문항.
// 단원 틀과 그림 도구, 싣는 기준, 뺀 것과 까닭은 8-2-5a.js 에 있다. ref: ①n = 기본꼴_1의 n번, 심n = 심화꼴의 n번.
//
// 이 단원에서 아이들이 흔히 잘못 아는 것(실력 ①의 장치는 이 잘못을 가진 아이가 걸리게 만들었다)
//  - 구하는 변 x 가 늘 빗변이라고 여긴다. 직각의 자리가 정해지지 않았는데도 두 수의 제곱을 더하기만 하고, 주어진 긴 변이 빗변인 경우를 놓친다.
//  - 세 변의 길이를 적힌 차례대로 a² + b² = c² 에 넣는다. 가장 긴 변을 먼저 찾지 않아, 가장 긴 변이 끝에 적혀 있지 않으면 직각삼각형을 놓친다.
//  - 정사각형의 넓이와 한 변의 길이를 섞는다. 넓이가 64, 36인 두 정사각형에서 빗변의 길이를 8 + 6 = 14 나 64 + 36 = 100 이라고 한다(넓이의 합이 빗변의 제곱이다).
//  - 넓이가 같은 삼각형은 합동인 것뿐이라고 여긴다. 유클리드의 그림에서 밑변이 같고 평행선 사이에 놓인 삼각형의 넓이가 같다는 것을 쓰지 못한다.
//  - 그림에 직각삼각형이 보이지 않으면 멈춘다. 사다리꼴·평행사변형에 수선을 긋거나, 직사각형 안의 점에서 변에 평행한 선을 그어 직각삼각형을 만들지 못한다.
//  - 접은 종이에서 접기 전과 길이가 같은 변을 놓치고, 겉면을 따라가는 가장 짧은 길을 모서리를 따라가는 길로 셈한다(펼친 그림의 선분이다).
//
// 실력에는 ① 문제의 그림·말·수에 함정이 있어 배운 뜻을 정확히 대야 풀리는 문제와 ② 세 단계 넘게 이어 생각해야 풀리는 문제(직각삼각형을 넷 이어 붙인 사슬,
// 사다리꼴에 수선을 그어 대각선 구하기, 넓이에서 거꾸로 변을 찾아 사다리꼴의 넓이 구하기, 대각선에 내린 두 수선의 발 사이의 거리, 무게중심과 외심, 닮음으로 찾는 평행사변형의 수선,
// 초승달의 넓이에서 빗변에 내린 수선까지, 접은 종이, 직육면체의 겉면을 따라가는 가장 짧은 길, 두 대각선이 수직인 사각형, 직사각형 안의 한 점)만 실었다.
// 기본에서 하는 일을 고르기로 바꾼 것, 수만 키운 계산, 그림에서 답이 한눈에 보이는 것은 싣지 않았다.
// 묻는 말: 수나 값은 「~은?/~는?」, 양은 「몇 ~인가?」. 길이는 띄어 적는다(6 cm).
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, N, C } = B.kit;
  const { nb, tagged, gcd } = B.kit.mid;
  const { at, dirOf, mid, TINT, Board } = B.kit.mgeo;
  const K = B.kit.m825;
  const { UNIT, STD, X, seg, sq, cmL, xL, HALF, cmQ, areaQ, fracQ, cen, lay, polyFig, sqOn, euclidFig, fitsIn, twoTriFig, TWO_SAID, rectFig, semiFig, LUNE_SAID, notRight, three, SMALL } = K;
  // 실력 문항. 기본 자료에서만 나온 꼴은 ref 를 '①66' 처럼 ①로 시작하게 적는다.
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: (/^심/.test(ref) ? '수집본 심화 자료(' : '수집본 기본 자료(') + ref + ')', make }, more || {});
  const KEYS = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ'];
  const fr = (p, q) => { const g = gcd(p, q); return q / g === 1 ? String(p / g) : frac(p / g, q / g); };

  // ── 그림 ──
  // ∠C = 90°인 직각삼각형 ABC(C 가 위, AB 가 밑변)와 두 변 CA, CB 위의 정사각형(넓이 p, q), 빗변의 중점 M 과 선분 CM
  function medianFig(p, q) {
    const ca = Math.sqrt(p), cb = Math.sqrt(q), ab = Math.sqrt(p + q), m = { C: [p / ab, ca * cb / ab], A: [0, 0], B: [ab, 0], M: [ab / 2, 0] };
    const s1 = sqOn(m.C, m.A, m.B), s2 = sqOn(m.C, m.B, m.A), P = lay(Object.assign({ U1: s1[2], U2: s1[3], V1: s2[2], V2: s2[3] }, m), [204, 156]), b = Board();
    b.poly([P.C, P.A, P.U1, P.U2], TINT).poly([P.C, P.B, P.V1, P.V2], TINT).poly([P.A, P.B, P.C]).seg(P.C, P.M).corner(P.C, P.A, P.B, '').tick(P.A, P.M).tick(P.M, P.B);
    if (fitsIn(ca * P.k, p + ' cm²') && fitsIn(cb * P.k, q + ' cm²')) b.text(cen([P.C, P.A, P.U1, P.U2]), p + ' cm²', { blue: true }).text(cen([P.C, P.B, P.V1, P.V2]), q + ' cm²', { blue: true });
    b.angle(P.C, dirOf(P.C, P.V2), dirOf(P.C, P.U2), 'C', { arc: false, ink: true }).nameFree(P.A, 'A', [dirOf(P.A, P.C), dirOf(P.A, P.B), dirOf(P.A, P.U1)]).nameFree(P.B, 'B', [dirOf(P.B, P.C), dirOf(P.B, P.A), dirOf(P.B, P.V1)]).name(P.M, 'M', 270);
    return b;
  }
  // ∠A = 90°인 직각삼각형 ABC 와 빗변 BC 의 아래쪽에 그린 정사각형 BDEC. 색칠한 두 삼각형 ABD, ACE
  function underFig(c, bb) {
    const a = Math.sqrt(c * c + bb * bb), P = lay({ A: [c * c / a, c * bb / a], B: [0, 0], C: [a, 0], D: [0, -a], E: [a, -a] }, [150, 196]), b = Board(), g = cen([P.A, P.B, P.C]);
    b.poly([P.B, P.D, P.E, P.C]).poly([P.A, P.B, P.D], TINT).poly([P.A, P.C, P.E], TINT).poly([P.A, P.B, P.C]).corner(P.A, P.B, P.C, '');
    b.beside(P.A, P.B, cmL(c), g).beside(P.A, P.C, cmL(bb), g).name(P.A, 'A', 90).name(P.B, 'B', 180).name(P.C, 'C', 0).name(P.D, 'D', 225).name(P.E, 'E', 315);
    return b;
  }
  // 직각삼각형을 이어 붙인 사슬: OA 에 수직인 AB, OB 에 수직인 BC, … 길이가 모두 같은 선분 n + 1 개
  function chainFig(n, label) {
    const pts = [[0, 0], [1, 0]], names = 'OABCDEF';
    for (let i = 1; i <= n; i += 1) { const p = pts[i], L = Math.hypot(p[0], p[1]); pts.push([p[0] - p[1] / L, p[1] + p[0] / L]); }
    const model = {}; pts.forEach((p, i) => { model[names[i]] = p; });
    const P = lay(model, [204, 150]), b = Board(), O = P.O;
    for (let i = 1; i <= n + 1; i += 1) { b.seg(O, P[names[i]]); if (i <= n) b.seg(P[names[i]], P[names[i + 1]]).corner(P[names[i]], O, P[names[i + 1]], '').tick(P[names[i]], P[names[i + 1]]); }
    b.tick(O, P.A).beside(O, P.A, label, P.B, { t: 0.3 });
    b.name(O, 'O', 250).name(P.A, 'A', 315);
    for (let i = 2; i <= n + 1; i += 1) b.name(P[names[i]], names[i], dirOf(O, P[names[i]]));
    return b;
  }
  // 직육면체의 겨냥도(앞면 BFGC, 윗면 ABCD, 아랫면 EFGH)와, 꼭짓점 A 에서 모서리 DH, CG 를 지나 꼭짓점 F 에 이르는 가장 짧은 길. FG = w, GH = dd, DH = h
  function boxFig(w, dd, h) {
    const k = Math.min(150 / (w + 0.56 * dd), 150 / (h + 0.4 * dd)), dv = [dd * k * 0.56, -dd * k * 0.4], add = (p) => [p[0] + dv[0], p[1] + dv[1]], b = Board(), ROUTE = 'stroke:#1d4ed8;stroke-width:1.9';
    const F = [0, 0], G = [w * k, 0], Cc = [w * k, -h * k], Bb = [0, -h * k], E = add(F), Hh = add(G), D = add(Cc), A = add(Bb);
    const Pp = mid(D, Hh, w / (2 * w + dd)), Q = mid(Cc, G, (w + dd) / (2 * w + dd));
    b.seg(A, E, 'cut').seg(E, F, 'cut').seg(E, Hh, 'cut').poly([Bb, F, G, Cc]).poly([Bb, A, D, Cc]).poly([Cc, G, Hh, D]);
    b.seg(A, Pp, 'cut', ROUTE + ';stroke-dasharray:4 3').seg(Pp, Q, null, ROUTE).seg(Q, F, null, ROUTE);
    b.beside(F, G, cmL(w), Cc).beside(G, Hh, cmL(dd), Cc).beside(Hh, D, cmL(h), Cc);
    // 꼭짓점의 이름은 그 둘레의 선(모서리와 길)에서 가장 먼 쪽에 적는다. clear: 이름과 선 사이의 가장 좁은 틈
    const lines = [[A, E], [E, F], [E, Hh], [Bb, F], [F, G], [G, Cc], [Cc, Bb], [Bb, A], [A, D], [D, Cc], [G, Hh], [Hh, D], [A, Pp], [Pp, Q], [Q, F]];
    const gapTo = (p, [s, e]) => { const vx = e[0] - s[0], vy = e[1] - s[1], t = Math.max(0, Math.min(1, ((p[0] - s[0]) * vx + (p[1] - s[1]) * vy) / (vx * vx + vy * vy))); return Math.hypot(p[0] - s[0] - t * vx, p[1] - s[1] - t * vy); };
    let clear = 99;
    for (const [p, label] of [[A, 'A'], [Bb, 'B'], [Cc, 'C'], [D, 'D'], [E, 'E'], [F, 'F'], [G, 'G'], [Hh, 'H']]) {
      let best = 0, room = -1;
      for (let a = 0; a < 360; a += 15) { const spot = at(p, 12, a), r = Math.min(...lines.map((line) => gapTo(spot, line))); if (r > room + 0.01) { room = r; best = a; } }
      b.name(p, label, best, 12); clear = Math.min(clear, room);
    }
    b.clear = clear;
    return b;
  }

  B.addGroup(UNIT, {
    id: 'hard', title: '실력 문제', standard: STD,
    types: [
      // ── ① 문제의 그림·말·수에 함정이 있어 배운 뜻을 정확히 대야 풀리는 문제 ──
      H('hard-two-cases', '직각삼각형이 되게 하는 변의 길이를 제곱한 값 모두 찾기', '심27 ①39', (d) => {
        // 함정: 직각의 자리가 정해져 있지 않다. x 가 빗변인 경우와 주어진 긴 변이 빗변인 경우를 모두 따져야 한다.
        const [a, b] = d.until(() => [d.int(3, 12), d.int(5, 15)], ([u, v]) => v - u >= 2 && v <= 2.5 * u), lo = b * b - a * a, hi = a * a + b * b, slip = (b - a) * (b - a), right = `${lo}, ${hi}`;
        // 틀린 보기: hi 만 — x 를 빗변으로만 본 아이 / lo 만 — 주어진 긴 변을 빗변으로만 본 아이 / (b − a)², hi — 두 경우를 따졌지만 제곱의 차를 차의 제곱으로 셈한 아이
        const options = d.shuffle([String(hi), String(lo), right, `${slip}, ${hi}`]);
        return C(`세 변의 길이가 ${a} cm, ${b} cm, ${X} cm인 삼각형이 직각삼각형이 되도록 하는 ${sq(X)}의 값을 모두 고른 것은?`, options, options.indexOf(right), {
          explain: `가장 긴 변의 길이가 ${X} cm이면 ${sq(X)} = ${sq(a)} + ${sq(b)} = ${hi}이다. 가장 긴 변의 길이가 ${b} cm이면 ${sq(X)} + ${sq(a)} = ${sq(b)}에서 ${sq(X)} = ${b * b} − ${a * a} = ${lo}이다. ${sq(X)}의 값은 ${lo}, ${hi}이다.`,
          facts: { truth: options.map((o) => o === right), want: true }
        });
      }),
      H('hard-longest', '가장 긴 변을 찾아 직각삼각형 가려내기', '심26 ①36', (d) => {
        // 함정: 가장 긴 변이 끝에 적혀 있지 않다. 적힌 차례대로 앞의 두 수의 제곱을 더해 셋째 수의 제곱과 견주면 직각삼각형을 하나도 찾지 못한다.
        const unsort = ([a, b, c]) => d.pick([[c, a, b], [a, c, b], [c, b, a], [b, c, a]]);
        const rows = d.until(() => { const k = d.int(2, 3); return d.shuffle(d.shuffle(SMALL).slice(0, k).concat(Array.from({ length: 5 - k }, () => notRight(d)))); }, (list) => new Set(list.map((t) => t.slice().sort((x, y) => x - y).join())).size === 5).map((t) => unsort(t.slice().sort((x, y) => x - y)));
        const sorted = rows.map((t) => t.slice().sort((x, y) => x - y)), flags = sorted.map(([a, b, c]) => a * a + b * b === c * c), hits = KEYS.filter((_, i) => flags[i]);
        return N('세 변의 길이가 각각 다음과 같은 삼각형 중에서 직각삼각형인 것은 모두 몇 개인가?', hits.length, {
          unit: '개', figure: tagged(rows.map(three), KEYS.map((key) => key + '.')),
          explain: `가장 긴 변의 길이의 제곱을 나머지 두 변의 길이의 제곱의 합과 견준다. ${sorted.map(([a, b, c], i) => `${KEYS[i]}. ${sq(a)} + ${sq(b)} = ${a * a + b * b}, ${sq(c)} = ${c * c}`).join(' / ')}. 두 값이 같은 것은 ${hits.join(', ')}의 ${hits.length}개이다.`,
          facts: { count: flags }
        });
      }),
      H('hard-square-median', '두 정사각형의 넓이로 빗변의 중점까지의 거리 구하기', '심13', (d) => {
        // 함정: 넓이의 합이 빗변의 길이의 제곱이다. 한 변의 길이끼리 더하거나(8 + 6), 넓이의 합을 그대로 빗변의 길이로 삼으면 틀린다.
        const [u, v, c] = d.pick([[6, 8, 10], [8, 6, 10], [12, 16, 20], [16, 12, 20], [18, 24, 30], [24, 18, 30], [10, 24, 26], [24, 10, 26], [16, 30, 34], [30, 16, 34]]), p = u * u, q = v * v;
        return cmQ(`그림은 ∠C = 90°인 직각삼각형 ABC에서 두 변 AC, BC를 각각 한 변으로 하는 정사각형을 그린 것이다. 두 정사각형의 넓이가 차례로 ${p} cm², ${q} cm²이고 점 M이 변 AB의 중점일 때, ${seg('CM')}의 길이는?`, c / 2, {
          figure: medianFig(p, q).svg(`직각삼각형 ABC. ∠C에 직각 표시가 있고 변 AB가 빗변이다. 두 변 AC, BC 위에 정사각형이 삼각형의 바깥쪽으로 그려져 있고 색칠되어 있다. 변 AB의 중점 M과 꼭짓점 C를 이은 선분이 그어져 있고, 선분 AM과 선분 MB에 길이가 같다는 표시가 있다. 변 AC 위의 정사각형의 넓이 ${p} cm², 변 BC 위의 정사각형의 넓이 ${q} cm²`),
          explain: `${sq(seg('AC'))} = ${p}, ${sq(seg('BC'))} = ${q}이므로 ${sq(seg('AB'))} = ${p} + ${q} = ${c * c}이고 ${seg('AB')} = ${c} cm이다. 직각삼각형의 빗변의 중점은 외심이므로 ${seg('CM')} = ${seg('AM')} = ${seg('BM')} = ${HALF} × ${c} = ${c / 2}(cm)이다.`,
          facts: { calc: [[`(${p}+${q})**0.5/2`, 0]], unseen: [0.5, 2] }
        });
      }),
      H('hard-euclid', '유클리드의 그림에서 넓이가 같은 삼각형', '심14·16 ①27·29', (d, n) => {
        if (n === 0) {
          // 함정: 넓이가 같은 것은 합동인 삼각형뿐이라고 여기는 아이. 밑변이 같고 평행선 사이에 놓인 삼각형, 합동인 삼각형을 차례로 옮겨 가야 한다.
          const [c, bb] = d.pick([[3, 4], [4, 3], [5, 7], [7, 5], [2, 3], [3, 2]]), left = d.bool(), f = euclidFig(c, bb, { size: [200, 204] }), P = f.P, k = P.k, a = Math.sqrt(c * c + bb * bb);
          const L = [P.A[0], 0], M = [P.A[0], a * k];
          f.b.seg(P.A, M, 'thin').corner(L, left ? P.C : P.B, P.A, '');
          if (left) f.b.seg(P.E, P.C, 'thin').seg(P.A, P.H, 'thin'); else f.b.seg(P.G, P.B, 'thin').seg(P.A, P.I, 'thin');
          f.b.name(L, 'L', left ? 318 : 222, 12).name(M, 'M', 270);
          const base = left ? '△EBA' : '△GCA', same = left ? ['△EBC', '△ABH', '△LBH'] : ['△GCB', '△ACI', '△LCI'], odd = '△ABC', options = d.shuffle(same.concat([odd]));
          return C(`그림은 ∠A = 90°인 직각삼각형 ABC의 세 변을 각각 한 변으로 하는 정사각형 ADEB, ACGF, BHIC를 그린 것이다. 꼭짓점 A에서 변 BC에 내린 수선의 발을 L, 그 수선의 연장선이 변 HI와 만나는 점을 M이라 할 때, 다음 중 ${base}와 넓이가 같지 않은 것은? ${nb(`(단, ${seg('AB')} ≠ ${seg('AC')})`)}`, options, options.indexOf(odd), {
            figure: f.b.svg(`직각삼각형 ABC의 세 변 위에 정사각형 ADEB, ACGF, BHIC가 삼각형의 바깥쪽으로 그려져 있다. ∠A에 직각 표시가 있고 변 BC가 빗변이다. 꼭짓점 A에서 그은 수선이 변 BC와 점 L에서, 변 HI와 점 M에서 만난다. ${left ? '선분 EC와 선분 AH' : '선분 GB와 선분 AI'}가 그어져 있다`),
            explain: left
              ? `${seg('EB')} ∥ ${seg('DC')}이므로 밑변 EB가 같고 높이가 같아 △EBA = △EBC이다. △EBC와 △ABH에서 ${seg('EB')} = ${seg('AB')}, ${seg('BC')} = ${seg('BH')}, ∠EBC = ∠ABH이므로 △EBC ≡ △ABH이다. ${seg('BH')} ∥ ${seg('AM')}이므로 △ABH = △LBH이다. △EBA의 넓이는 ${HALF} × ${sq(seg('AB'))}이고 △ABC의 넓이는 ${HALF} × ${seg('AB')} × ${seg('AC')}이므로 ${seg('AB')} ≠ ${seg('AC')}이면 두 넓이는 다르다.`
              : `${seg('GC')} ∥ ${seg('FB')}이므로 밑변 GC가 같고 높이가 같아 △GCA = △GCB이다. △GCB와 △ACI에서 ${seg('GC')} = ${seg('AC')}, ${seg('CB')} = ${seg('CI')}, ∠GCB = ∠ACI이므로 △GCB ≡ △ACI이다. ${seg('CI')} ∥ ${seg('AM')}이므로 △ACI = △LCI이다. △GCA의 넓이는 ${HALF} × ${sq(seg('AC'))}이고 △ABC의 넓이는 ${HALF} × ${seg('AB')} × ${seg('AC')}이므로 ${seg('AB')} ≠ ${seg('AC')}이면 두 넓이는 다르다.`,
            facts: { truth: options.map((o) => o === odd), want: true }
          });
        }
        const [c, bb] = d.until(() => [d.int(3, 9), d.int(3, 9)], ([u, v]) => (u - v) % 2 === 0 && u !== v && Math.max(u, v) / Math.min(u, v) <= 2), a2 = c * c + bb * bb;
        return areaQ(`그림은 ∠A = 90°인 직각삼각형 ABC에서 변 BC를 한 변으로 하는 정사각형 BDEC를 그린 것이다. ${seg('AB')} = ${c} cm, ${seg('AC')} = ${bb} cm일 때, 색칠한 두 삼각형 ABD, ACE의 넓이의 합은?`, a2 / 2, {
          figure: underFig(c, bb).svg(`직각삼각형 ABC와, 변 BC의 아래쪽에 그린 정사각형 BDEC. ∠A에 직각 표시가 있다. 삼각형 ABD와 삼각형 ACE가 색칠되어 있다. AB = ${c} cm, AC = ${bb} cm`),
          explain: `꼭짓점 A에서 변 BC에 내린 수선의 발을 L이라 하면 △ABD는 밑변이 BD이고 높이가 ${seg('BL')}, △ACE는 밑변이 CE이고 높이가 ${seg('LC')}이다. ${seg('BD')} = ${seg('CE')} = ${seg('BC')}이므로 두 넓이의 합은 ${HALF} × ${seg('BC')} × (${seg('BL')} + ${seg('LC')}) = ${HALF} × ${sq(seg('BC'))}이다. ${sq(seg('BC'))} = ${sq(c)} + ${sq(bb)} = ${a2}이므로 넓이의 합은 ${a2 / 2} cm²이다.`,
          facts: { calc: [[`(${c}**2+${bb}**2)/2`, 0]], unseen: [2] }
        });
      }, { count: 2 }),

      // ── ② 세 단계 넘게 이어 생각해야 풀리는 문제 ──
      H('hard-chain', '직각삼각형을 이어 붙인 사슬', '심4 ①15·16', (d) => {
        const len = d.int(1, 4), ans = 5 * len * len;
        return N(`그림에서 ∠OAB = ∠OBC = ∠OCD = ∠ODE = 90°이고 ${seg('OA')} = ${seg('AB')} = ${seg('BC')} = ${seg('CD')} = ${seg('DE')} = ${len} cm일 때, ${sq(seg('OE'))}의 값은?`, ans, {
          figure: chainFig(4, cmL(len)).svg(`점 O를 함께 가지는 직각삼각형 OAB, OBC, OCD, ODE가 차례로 이어 붙어 있다. ∠OAB, ∠OBC, ∠OCD, ∠ODE에 직각 표시가 있고, 선분 OA, AB, BC, CD, DE에 길이가 같다는 표시가 있다. OA = ${len} cm`),
          explain: `${sq(seg('OB'))} = ${sq(len)} + ${sq(len)} = ${2 * len * len}, ${sq(seg('OC'))} = ${sq(seg('OB'))} + ${sq(len)} = ${3 * len * len}, ${sq(seg('OD'))} = ${sq(seg('OC'))} + ${sq(len)} = ${4 * len * len}, ${sq(seg('OE'))} = ${sq(seg('OD'))} + ${sq(len)} = ${ans}이다.`,
          facts: { calc: [[`5*${len}**2`, 0]], unseen: [5, 2] }
        });
      }),
      H('hard-trapezoid-diagonal', '사다리꼴에 수선을 그어 대각선의 길이 구하기', '①18 심6', (d) => {
        // AD = a, AB = c1, BC = bc, BD = x. 높이가 같은 두 직각삼각형을 잇는다.
        const w = d.until(() => {
          const [a, c1, bc, x] = d.pick([[9, 10, 15, 17], [11, 13, 16, 20], [7, 15, 16, 20], [4, 13, 9, 15], [12, 17, 20, 25], [11, 25, 18, 30], [8, 26, 18, 30], [22, 26, 32, 40], [14, 30, 32, 40], [6, 25, 21, 29], [18, 20, 30, 34]]), h = Math.round(Math.sqrt(x * x - bc * bc));
          const f = polyFig({ A: [bc - a, h], B: [0, 0], C: [bc, 0], D: [bc, h] }, { size: [176, 124], right: ['C', 'D'], nameAt: { A: 140, D: 40 }, sides: { DA: cmL(a), AB: cmL(c1), BC: cmL(bc) }, at: { AB: 0.62 } });
          f.b.seg(f.P.B, f.P.D).beside(f.P.B, f.P.D, xL('x'), f.P.A, { t: 0.56, gap: 3 });
          return { a, c1, bc, x, h, f };
        }, (v) => !v.f.b.clash()), { a, c1, bc, x, h } = w;
        return N(`그림과 같이 ∠C = ∠D = 90°인 사다리꼴 ABCD에서 ${X}의 값은?`, x, {
          figure: w.f.b.svg(`사다리꼴 ABCD와 대각선 BD. ∠C와 ∠D에 직각 표시가 있다. AD = ${a} cm, AB = ${c1} cm, BC = ${bc} cm, BD = x cm`),
          explain: `꼭짓점 A에서 변 BC에 내린 수선의 발을 H라 하면 ${seg('BH')} = ${bc} − ${a} = ${bc - a}(cm)이다. △ABH에서 ${sq(seg('AH'))} = ${sq(c1)} − ${sq(bc - a)} = ${h * h}이므로 ${seg('AH')} = ${h} cm이고 ${seg('DC')} = ${seg('AH')} = ${h} cm이다. △BCD에서 ${sq(X)} = ${sq(bc)} + ${sq(h)} = ${x * x}이고 ${sq(x)} = ${x * x}이므로 ${X} = ${x}이다.`,
          facts: { calc: [[`(${bc}**2+${c1}**2-(${bc}-${a})**2)**0.5`, 0]], unseen: [2, 0.5] }
        });
      }),
      H('hard-two-tri-back', '가운데 삼각형의 넓이로 사다리꼴의 넓이 구하기', '심20', (d) => {
        const [u, v, c] = d.pick([[6, 8, 10], [8, 6, 10], [12, 16, 20], [16, 12, 20], [10, 24, 26], [24, 10, 26], [18, 24, 30], [24, 18, 30], [16, 30, 34]]), area = c * c / 2, f = twoTriFig(u, v, { ab: cmL(u) });
        return areaQ(`그림에서 △ABC ≡ △CDE이고 세 점 B, C, D는 한 직선 위에 있다. ${seg('AB')} = ${u} cm이고 △ACE의 넓이가 ${area} cm²일 때, 사다리꼴 ABDE의 넓이는?`, (u + v) * (u + v) / 2, {
          figure: f.b.svg(`${TWO_SAID}. AB = ${u} cm`),
          explain: `△ABC ≡ △CDE이므로 ${seg('AC')} = ${seg('CE')}이고 ∠ACB + ∠DCE = ∠ACB + ∠BAC = 90°에서 ∠ACE = 90°이다. △ACE의 넓이는 ${HALF} × ${sq(seg('AC'))} = ${area}이므로 ${sq(seg('AC'))} = ${c * c}, ${seg('AC')} = ${c} cm이다. △ABC에서 ${sq(seg('BC'))} = ${sq(c)} − ${sq(u)} = ${v * v}이므로 ${seg('BC')} = ${v} cm이고 ${seg('DE')} = ${v} cm, ${seg('CD')} = ${u} cm이다. 사다리꼴 ABDE의 넓이는 ${HALF} × (${u} + ${v}) × (${v} + ${u}) = ${(u + v) * (u + v) / 2}(cm²)이다.`,
          facts: { calc: [[`(${u}+(2*${area}-${u}**2)**0.5)**2/2`, 0]], unseen: [2, 0.5] }
        });
      }),
      H('hard-two-feet', '대각선에 내린 두 수선의 발 사이의 거리', '심32 ①45·46', (d) => {
        const [h, wd, dg] = d.pick([[3, 4, 5], [6, 8, 10], [9, 12, 15], [12, 16, 20], [8, 15, 17]]), f = rectFig(wd, h, { footA: 'M', footC: 'N' });
        return fracQ(`그림과 같이 ${seg('AB')} = ${h} cm, ${seg('AD')} = ${wd} cm인 직사각형 ABCD의 두 꼭짓점 A, C에서 대각선 BD에 내린 수선의 발을 각각 M, N이라 할 때, ${seg('MN')}의 길이는?`, wd * wd - h * h, dg, 'cm', {
          figure: f.b.svg(`직사각형 ABCD와 대각선 BD. 꼭짓점 A에서 대각선 BD에 내린 수선의 발이 M, 꼭짓점 C에서 대각선 BD에 내린 수선의 발이 N이고 직각 표시가 있다. AB = ${h} cm, AD = ${wd} cm`),
          explain: `△ABD에서 ${sq(seg('BD'))} = ${sq(h)} + ${sq(wd)} = ${dg * dg}이므로 ${seg('BD')} = ${dg} cm이다. △ABD ∽ △MBA이므로 ${sq(seg('AB'))} = ${seg('BM')} × ${seg('BD')}에서 ${seg('BM')} = ${fr(h * h, dg)}(cm)이다. △ABM ≡ △CDN이므로 ${seg('DN')} = ${seg('BM')}이다. ${seg('MN')} = ${dg} − 2 × ${fr(h * h, dg)} = ${fr(wd * wd - h * h, dg)}(cm)이다.`,
          facts: { value: `(${wd}**2-${h}**2)/(${h}**2+${wd}**2)**0.5`, unseen: [2, 0.5] }
        });
      }),
      H('hard-centroid', '직각삼각형의 무게중심과 빗변의 중점', '심11 ①49', (d) => {
        const [ab, ac, bc] = d.pick([[9, 12, 15], [12, 9, 15], [18, 24, 30], [24, 18, 30], [15, 36, 39], [36, 15, 39], [24, 45, 51], [45, 24, 51]]), useGD = bc % 6 === 0 && d.bool(), given = useGD ? bc / 6 : bc / 3;
        const P = lay({ A: [ab * ab / bc, ab * ac / bc], B: [0, 0], C: [bc, 0], D: [bc / 2, 0] }, [196, 116]), b = Board(), g = cen([P.A, P.B, P.C]), G = mid(P.A, P.D, 2 / 3);
        b.poly([P.B, P.C, P.A]).seg(P.A, P.D).corner(P.A, P.B, P.C, '').dot(G).beside(P.A, P.C, cmL(ac), g);
        b.name(P.A, 'A', 90).name(P.B, 'B', 200).name(P.C, 'C', 340).name(P.D, 'D', 270).name(G, 'G', dirOf(P.A, P.D) + 90, 12);
        const lead = useGD ? `${seg('AD')} = 3 × ${seg('GD')}` : `${seg('AD')} = ${frac(3, 2)} × ${seg('AG')}`, twice = useGD ? `6 × ${seg('GD')}` : `3 × ${seg('AG')}`;
        return cmQ(`그림과 같이 ∠A = 90°인 직각삼각형 ABC에서 점 G는 △ABC의 무게중심이고, 직선 AG가 변 BC와 만나는 점을 D라 하자. ${seg('AC')} = ${ac} cm, ${useGD ? seg('GD') : seg('AG')} = ${given} cm일 때, ${seg('AB')}의 길이는?`, ab, {
          figure: b.svg(`직각삼각형 ABC. ∠A에 직각 표시가 있고 변 BC가 빗변이다. 꼭짓점 A와 변 BC 위의 점 D를 이은 선분 위에 점 G가 있다. AC = ${ac} cm`),
          explain: `무게중심은 중선을 꼭짓점으로부터 2 : 1로 나누므로 ${lead}이다. 점 D는 빗변 BC의 중점이고 직각삼각형의 빗변의 중점은 외심이므로 ${seg('BD')} = ${seg('CD')} = ${seg('AD')}이다. ${seg('BC')} = 2 × ${seg('AD')} = ${twice} = ${bc}(cm)이다. ${sq(seg('AB'))} = ${sq(bc)} − ${sq(ac)} = ${ab * ab}이므로 ${seg('AB')} = ${ab} cm이다.`,
          facts: { calc: [[`((${useGD ? 6 : 3}*${given})**2-${ac}**2)**0.5`, 0]], unseen: [useGD ? 6 : 3, 2, 0.5] }
        });
      }),
      H('hard-parallelogram', '평행사변형의 두 수선과 넓이', '심9', (d) => {
        // AB = ab, BE = be, AE = ae, AD = ad, DF = df, AF = af (△ABE ∽ △ADF)
        const [ab, be, ae, ad, df, af] = d.pick([[13, 5, 12, 26, 10, 24], [15, 9, 12, 20, 12, 16], [20, 12, 16, 25, 15, 20], [25, 15, 20, 30, 18, 24], [25, 15, 20, 35, 21, 28], [30, 18, 24, 35, 21, 28], [26, 10, 24, 39, 15, 36], [25, 7, 24, 50, 14, 48]]), ec = ad - be, fc = ab - df, area = (ec * ae + fc * af) / 2;
        const P = lay({ A: [be, ae], B: [0, 0], C: [ad, 0], D: [be + ad, ae], E: [be, 0], F: [be + ad - df * be / ab, ae - df * ae / ab] }, [204, 124]), b = Board(), g = cen([P.A, P.B, P.C, P.D]);
        b.poly([P.A, P.B, P.C, P.D]).poly([P.A, P.E, P.C, P.F], TINT).corner(P.E, P.C, P.A, '').corner(P.F, P.D, P.A, '');
        b.beside(P.A, P.B, cmL(ab), g).beside(P.A, P.D, cmL(ad), g).beside(P.D, P.F, cmL(df), g);
        b.name(P.A, 'A', 115).name(P.B, 'B', 225).name(P.C, 'C', 300).name(P.D, 'D', 45).name(P.E, 'E', 270).name(P.F, 'F', dirOf(P.A, P.F), 12);
        return areaQ(`그림과 같이 평행사변형 ABCD의 꼭짓점 A에서 두 변 BC, CD에 내린 수선의 발을 각각 E, F라 하자. ${seg('AB')} = ${ab} cm, ${seg('AD')} = ${ad} cm, ${seg('DF')} = ${df} cm일 때, □AECF의 넓이는?`, area, {
          figure: b.svg(`평행사변형 ABCD. 꼭짓점 A에서 변 BC에 내린 수선의 발이 E, 변 CD에 내린 수선의 발이 F이고 직각 표시가 있다. 사각형 AECF가 색칠되어 있다. AB = ${ab} cm, AD = ${ad} cm, DF = ${df} cm`),
          explain: `△ABE와 △ADF에서 ∠B = ∠D, ∠AEB = ∠AFD = 90°이므로 △ABE ∽ △ADF이다. ${nb(`${seg('BE')} : ${seg('DF')} = ${seg('AB')} : ${seg('AD')}`)}에서 ${seg('BE')} = ${be} cm이다. △ABE에서 ${sq(seg('AE'))} = ${sq(ab)} − ${sq(be)} = ${ae * ae}, ${seg('AE')} = ${ae} cm이고, △ADF에서 ${sq(seg('AF'))} = ${sq(ad)} − ${sq(df)} = ${af * af}, ${seg('AF')} = ${af} cm이다. ${seg('EC')} = ${ad} − ${be} = ${ec}(cm), ${seg('FC')} = ${ab} − ${df} = ${fc}(cm)이므로 □AECF의 넓이는 △AEC + △AFC = ${HALF} × ${ec} × ${ae} + ${HALF} × ${fc} × ${af} = ${area}(cm²)이다.`,
          facts: { calc: [[`((${ad}-${ab}*${df}/${ad})*(${ab}**2-(${ab}*${df}/${ad})**2)**0.5+(${ab}-${df})*(${ad}**2-${df}**2)**0.5)/2`, 0]], unseen: [2, 0.5] }
        });
      }),
      H('hard-lune-height', '초승달 모양의 넓이로 빗변에 내린 수선의 길이 구하기', '심24', (d) => {
        const [c, bb, a] = d.pick([[6, 8, 10], [8, 6, 10], [9, 12, 15], [12, 9, 15], [12, 16, 20], [16, 12, 20], [8, 15, 17], [5, 12, 13]]), area = c * bb / 2, f = semiFig(c, bb, 'lune', { foot: 'H' });
        return fracQ(`그림은 ∠A = 90°인 직각삼각형 ABC의 세 변을 각각 지름으로 하는 반원을 그린 것이다. ${seg('AB')} = ${c} cm이고 색칠한 부분의 넓이가 ${area} cm²일 때, 꼭짓점 A에서 변 BC에 내린 수선 AH의 길이는?`, c * bb, a, 'cm', {
          figure: f.b.svg(`${LUNE_SAID}. 꼭짓점 A에서 변 BC에 내린 수선의 발이 H이고 직각 표시가 있다. AB = ${c} cm`),
          explain: `색칠한 부분의 넓이는 △ABC의 넓이와 같으므로 ${HALF} × ${c} × ${seg('AC')} = ${area}에서 ${seg('AC')} = ${bb} cm이다. ${sq(seg('BC'))} = ${sq(c)} + ${sq(bb)} = ${a * a}이므로 ${seg('BC')} = ${a} cm이다. △ABC의 넓이를 빗변을 밑변으로 하여 나타내면 ${HALF} × ${a} × ${seg('AH')} = ${area}이므로 ${seg('AH')} = ${fr(2 * area, a)}(cm)이다.`,
          facts: { value: `2*${area}/(${c}**2+(2*${area}/${c})**2)**0.5`, unseen: [2, 0.5] }
        });
      }),
      H('hard-fold', '직사각형 모양의 종이 접기', '①64', (d) => {
        // AB = h, BC = w, AC′ = p, DE = (w − p) × p ÷ h
        const [h, w, p] = d.pick([[8, 10, 6], [16, 20, 12], [24, 30, 18], [36, 39, 15]]), dc = w - p, de = dc * p / h;
        const P = lay({ A: [0, h], B: [0, 0], C: [w, 0], D: [w, h], E: [w, h - de], K: [p, h] }, [190, 150]), b = Board(), g = cen([P.A, P.B, P.C, P.D]);
        b.poly([P.A, P.B, P.E, P.D], 'fill:rgba(251,191,36,0.2)').poly([P.B, P.E, P.K], 'fill:rgba(251,191,36,0.6)').seg(P.B, P.C, 'cut').seg(P.C, P.E, 'cut');
        b.beside(P.A, P.B, cmL(h), g).beside(P.B, P.C, cmL(w), g);
        b.name(P.A, 'A', 135).name(P.B, 'B', 225).name(P.C, 'C', 315).name(P.D, 'D', 45).name(P.E, 'E', 0).name(P.K, 'C′', 90);
        return cmQ(`그림과 같이 ${seg('AB')} = ${h} cm, ${seg('BC')} = ${w} cm인 직사각형 모양의 종이 ABCD를 ${seg('BE')}를 접는 선으로 하여 꼭짓점 C가 변 AD 위의 점 C′에 오도록 접었다. ${seg('DE')}의 길이는?`, de, {
          figure: b.svg(`직사각형 모양의 종이 ABCD를 선분 BE를 접는 선으로 하여 접은 그림. 점 E는 변 DC 위에 있고, 꼭짓점 C가 옮겨진 점 C′은 변 AD 위에 있다. 접힌 부분인 삼각형 BEC′이 짙게 색칠되어 있고, 접기 전의 변 BC와 선분 CE는 점선으로 그려져 있다. AB = ${h} cm, BC = ${w} cm`),
          explain: `접은 변이므로 ${seg('BC′')} = ${seg('BC')} = ${w} cm이다. △ABC′에서 ${sq(seg('AC′'))} = ${sq(w)} − ${sq(h)} = ${p * p}이므로 ${seg('AC′')} = ${p} cm, ${seg('DC′')} = ${w} − ${p} = ${dc}(cm)이다. ∠BC′E = ∠C = 90°이므로 ∠AC′B + ∠DC′E = 90°이다. △ABC′과 △DC′E에서 ∠A = ∠D = 90°, ∠ABC′ = 90° − ∠AC′B = ∠DC′E이므로 △ABC′ ∽ △DC′E이다. ${nb(`${seg('AB')} : ${seg('DC′')} = ${seg('AC′')} : ${seg('DE')}`)}에서 ${h} × ${seg('DE')} = ${dc} × ${p}이므로 ${seg('DE')} = ${de} cm이다.`,
          facts: { calc: [[`(${w}-(${w}**2-${h}**2)**0.5)*(${w}**2-${h}**2)**0.5/${h}`, 0]], unseen: [2, 0.5] }
        });
      }),
      H('hard-box-path', '직육면체의 겉면을 따라가는 가장 짧은 길', '①63 심47', (d) => {
        const v = d.until(() => { const set = d.pick([[6, 3, 8, 17], [4, 7, 8, 17], [5, 2, 5, 13], [3, 6, 5, 13], [4, 4, 9, 15], [5, 2, 9, 15], [9, 6, 10, 26], [7, 6, 15, 25], [6, 4, 12, 20], [8, 5, 20, 29]]); return { set, b: boxFig(set[0], set[1], set[2]) }; }, (x) => !x.b.clash() && x.b.clear >= 8.5), [w, dd, h, ans] = v.set, wide = 2 * w + dd;
        return cmQ(`그림과 같은 직육면체에서 ${seg('FG')} = ${w} cm, ${seg('GH')} = ${dd} cm, ${seg('DH')} = ${h} cm이다. 꼭짓점 A에서 겉면을 따라 두 모서리 DH, CG를 차례로 지나 꼭짓점 F에 이르는 가장 짧은 길의 길이는?`, ans, {
          figure: v.b.svg(`직육면체의 겨냥도. 윗면은 ABCD, 아랫면은 EFGH이고 꼭짓점 A, B, C, D의 아래에 차례로 E, F, G, H가 있다. FG = ${w} cm, GH = ${dd} cm, DH = ${h} cm이다. 꼭짓점 A에서 면 AEHD, 면 DHGC, 면 CGFB를 차례로 지나 꼭짓점 F에 이르는 선이 그려져 있다`),
          explain: `세 옆면 AEHD, DHGC, CGFB를 차례로 펼치면 가로의 길이가 ${w} + ${dd} + ${w} = ${wide}(cm), 세로의 길이가 ${h} cm인 직사각형이 되고, 가장 짧은 길은 이 직사각형의 대각선이다. ${sq(wide)} + ${sq(h)} = ${ans * ans}이고 ${sq(ans)} = ${ans * ans}이므로 가장 짧은 길의 길이는 ${ans} cm이다.`,
          facts: { calc: [[`((${w}+${dd}+${w})**2+${h}**2)**0.5`, 0]], unseen: [2, 0.5] }
        });
      }),
      H('hard-diagonals', '두 대각선이 수직으로 만나는 사각형', '①66', (d) => {
        const w = d.until(() => {
          const a = d.int(4, 9), bq = d.int(4, 9), c = d.int(4, 9), t = d.pick([0.5, 0.6, 0.7]) * Math.min(a, bq), od2 = c * c - bq * bq + t * t;
          if (od2 <= 0 || new Set([a, bq, c]).size < 3) return null;
          const oa = Math.sqrt(a * a - t * t), oc = Math.sqrt(bq * bq - t * t), od = Math.sqrt(od2), lens = [oa, t, oc, od];
          if (Math.min(...lens) / Math.max(...lens) < 0.34) return null;
          const P = lay({ A: [-oa, 0], B: [0, -t], C: [oc, 0], D: [0, od] }, [180, 150]), b = Board(), O = [0, 0];
          b.poly([P.A, P.B, P.C, P.D]).seg(P.A, P.C, 'thin').seg(P.B, P.D, 'thin').corner(O, P.C, P.D, '');
          b.beside(P.A, P.B, cmL(a), O).beside(P.B, P.C, cmL(bq), O).beside(P.C, P.D, cmL(c), O);
          b.name(P.A, 'A', 180).name(P.B, 'B', 270).name(P.C, 'C', 0).name(P.D, 'D', 90).angle(O, 180, 270, 'O', { arc: false, ink: true });
          return { a, bq, c, b };
        }, (v) => v && !v.b.clash()), { a, bq, c } = w, ans = a * a + c * c - bq * bq;
        return N(`그림과 같이 □ABCD의 두 대각선이 점 O에서 서로 수직으로 만난다. ${seg('AB')} = ${a} cm, ${seg('BC')} = ${bq} cm, ${seg('CD')} = ${c} cm일 때, ${sq(seg('AD'))}의 값은?`, ans, {
          figure: w.b.svg(`사각형 ABCD와 두 대각선 AC, BD. 두 대각선은 점 O에서 만나고 직각 표시가 있다. AB = ${a} cm, BC = ${bq} cm, CD = ${c} cm`),
          explain: `네 직각삼각형 OAB, OBC, OCD, ODA에서 ${sq(seg('AB'))} = ${sq(seg('OA'))} + ${sq(seg('OB'))}, ${sq(seg('CD'))} = ${sq(seg('OC'))} + ${sq(seg('OD'))}, ${sq(seg('BC'))} = ${sq(seg('OB'))} + ${sq(seg('OC'))}, ${sq(seg('AD'))} = ${sq(seg('OA'))} + ${sq(seg('OD'))}이다. ${nb(`${sq(seg('AB'))} + ${sq(seg('CD'))}`)}의 값과 ${nb(`${sq(seg('BC'))} + ${sq(seg('AD'))}`)}의 값은 모두 네 선분 OA, OB, OC, OD의 길이의 제곱의 합이므로 서로 같다. ${sq(seg('AD'))} = ${sq(a)} + ${sq(c)} − ${sq(bq)} = ${ans}이다.`,
          facts: { calc: [[`${a}**2+${c}**2-${bq}**2`, 0]], unseen: [2] }
        });
      }),
      H('hard-inner-point', '직사각형의 내부의 한 점에서 네 꼭짓점까지의 거리', '심41', (d) => {
        const w = d.until(() => {
          const ap = d.int(3, 9), bp = d.int(3, 9), cp = d.int(3, 9), u = d.pick([0.5, 0.6, 0.7]) * Math.min(ap, bp), s = Math.sqrt(ap * ap - u * u), t = Math.sqrt(bp * bp - u * u), v2 = cp * cp - t * t;
          if (v2 <= 0 || new Set([ap, bp, cp]).size < 3) return null;
          const v = Math.sqrt(v2), lens = [u, s, t, v], W = u + v, Hh = s + t;
          if (Math.min(...lens) / Math.max(...lens) < 0.4 || W / Hh > 1.7 || Hh / W > 1.15) return null;
          const P = lay({ A: [0, Hh], B: [0, 0], C: [W, 0], D: [W, Hh], P: [u, t] }, [190, 150]), b = Board();
          b.poly([P.A, P.B, P.C, P.D]).seg(P.P, P.A).seg(P.P, P.B).seg(P.P, P.C).seg(P.P, P.D).dot(P.P);
          b.beside(P.P, P.A, cmL(ap), P.B, { gap: 3 }).beside(P.P, P.B, cmL(bp), P.A, { gap: 3 }).beside(P.P, P.C, cmL(cp), P.B, { gap: 3 });
          b.name(P.A, 'A', 135).name(P.B, 'B', 225).name(P.C, 'C', 315).name(P.D, 'D', 45).angle(P.P, dirOf(P.P, P.D), dirOf(P.P, P.A), 'P', { arc: false, ink: true });
          return { ap, bp, cp, b };
        }, (v) => v && !v.b.clash()), { ap, bp, cp } = w, ans = ap * ap + cp * cp - bp * bp;
        return N(`그림과 같이 직사각형 ABCD의 내부에 점 P가 있다. ${seg('AP')} = ${ap} cm, ${seg('BP')} = ${bp} cm, ${seg('CP')} = ${cp} cm일 때, ${sq(seg('DP'))}의 값은?`, ans, {
          figure: w.b.svg(`직사각형 ABCD와 그 내부의 점 P. 점 P와 네 꼭짓점을 이은 선분이 그어져 있다. AP = ${ap} cm, BP = ${bp} cm, CP = ${cp} cm`),
          explain: `점 P를 지나고 변 AB에 평행한 직선과 변 AD에 평행한 직선을 그으면 직각삼각형이 네 개 생긴다. 점 P에서 네 변 AB, BC, CD, DA까지의 거리를 차례로 ${nb('㉠, ㉡, ㉢, ㉣')}이라 하면 ${sq(seg('AP'))} = ${sq('㉠')} + ${sq('㉣')}, ${sq(seg('CP'))} = ${sq('㉡')} + ${sq('㉢')}, ${sq(seg('BP'))} = ${sq('㉠')} + ${sq('㉡')}, ${sq(seg('DP'))} = ${sq('㉢')} + ${sq('㉣')}이므로 ${sq(seg('AP'))} + ${sq(seg('CP'))} = ${sq(seg('BP'))} + ${sq(seg('DP'))}이다. ${sq(seg('DP'))} = ${sq(ap)} + ${sq(cp)} − ${sq(bp)} = ${ans}이다.`,
          facts: { calc: [[`${ap}**2+${cp}**2-${bp}**2`, 0]], unseen: [2] }
        });
      })
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
