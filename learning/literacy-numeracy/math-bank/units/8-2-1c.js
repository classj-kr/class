// 중학교 2학년 2학기 1단원 삼각형의 성질 — 실력 문항.
// 단원 틀과 그림 도구, 싣는 기준, 뺀 것과 까닭은 8-2-1a.js 에 있다. ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번, 심n = 심화꼴의 n번.
//
// 이 단원에서 아이들이 흔히 잘못 아는 것(실력 ①의 장치는 이 잘못을 가진 아이가 걸리게 만들었다)
//  - 그림에서 아래쪽에 나란히 놓인 두 각을 밑각으로 여긴다. 밑각은 길이가 같은 두 변의 맞은편에 있는 두 각이다(삼각형이 돌려져 있으면 한 밑각이 위에 있다).
//  - 직각삼각형이면 변 하나와 각 하나만 같아도 RHA, 변 둘만 같아도 RHS 라고 한다. 두 조건은 빗변의 길이가 같을 때만 쓴다
//    (빗변이 아닌 변과 그 한 끝의 예각이 같으면 ASA, 직각을 낀 두 변이 같으면 SAS 이다).
//  - 직각이등변삼각형의 꼭짓점을 지나는 직선에 내린 두 수선은 「길이를 더하면 두 수선의 발 사이의 거리」라고 외운다. 직선이 삼각형을 가로지르면 빼야 한다.
//  - 외심과 내심의 성질을 바꿔 안다: 외심은 세 변의 수직이등분선의 교점이고 세 꼭짓점까지의 거리가 같다. 내심은 세 내각의 이등분선의 교점이고 세 변까지의 거리가 같다.
//    중점 표시만 있거나 직각 표시만 있는 선분(중선·높이)을 수직이등분선으로 읽는다.
//  - 외심은 늘 삼각형의 안에 있다고 여긴다. 둔각삼각형의 외심은 밖에 있고 직각삼각형의 외심은 빗변의 중점이다(밖에 있어도 세 꼭짓점까지의 거리는 같다).
//  - ∠BOC = 2∠A(외심)와 ∠BIC = 90° + ½∠A(내심)를 뒤섞는다. 한 그림에 두 점이 함께 있으면 어느 점이 어느 삼각형의 무엇인지부터 가려야 한다.
//
// 실력에는 ① 문제의 그림·말·수에 함정이 있어 배운 뜻을 정확히 대야 풀리는 문제와 ② 세 단계 넘게 이어 생각해야 풀리는 문제(이웃한 이등변삼각형 세 겹, 접은 종이,
// 합동으로 길이를 옮긴 다음 넓이 구하기, 넓이를 두 가지로 나타내기, 외접원과 내접원의 반지름을 모두 구하기, 외심과 내심이 만드는 각)만 실었다.
// 밑각 하나 구하기, RHA·RHS 고르기, 외심·내심에서 각 하나 구하기처럼 한두 번에 끝나는 것은 기본에 있다.
// 2026-10-13: 처음 지을 때 금·꼬임·보조선 여럿·답이 식·중1 셈이라는 까닭으로 뺐던 꼴 열둘을 다시 따져 실력 묶음의 끝에 덧붙였다(hard-chain-five ~ hard-trapezoid-mid, 모두 ②).
// 같은 날 기본에 덧붙인 셋(bis-outer, in-nested, in-perimeter-area)은 8-2-1a.js·8-2-1b.js 의 묶음 끝에 있다.
// 묻는 말: 수나 값은 「~은?/~는?」, 양은 「몇 ~인가?」. 각도는 수에 붙여 적고(56°) 길이는 띄어 적는다(6 cm).
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { C } = B.kit;
  const { nb } = B.kit.mid;
  const { RAD, at, dirOf, dist, mid, meet, sv, TINT } = B.kit.mgeo;
  const K = B.kit.m821;
  const { UNIT, ISO, CEN, X, SYM, HALF, sg, deg, cm, eq, degQ, cmQ, cm2Q, fracQ, piQ, pickOne, foot, along, perpAt, circumOf, inOf, baseTri, isoTri, sssTri, fitPts, scene, isoScene, ISO_SAY,
    rtHyp, rtLegs, laid, sideBySide, gridBoard, lineScene, squareScene, SQUARE_SAY, cutScene, onCircle, circPts, inPts, inPtsSides, oiAngles, oiPts, O_SAY, incircleScene, sideLen } = K;
  // 실력 문항. 기본 자료에서만 나온 꼴은 ref 를 '기본 ①11' 처럼 적는다.
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: ref.startsWith('기본 ') ? '수집본 기본 자료(' + ref.slice(3) + ')' : '수집본 심화 자료(' + ref + ')', make }, more || {});
  const PAPER = 'fill:#eef2f6', FLAP = 'fill:rgba(148,163,184,0.5)';

  // ── 외심·내심인 그림 고르기 ──
  // 같은 삼각형 안의 점 P 와 표시. kind 에 따라 점 P 의 자리와 그은 선분, 표시가 다르다.
  const MARKS = {
    perp: { is: 'O', say: '점 P와 두 변의 중점을 이은 선분이 그 변과 수직으로 만난다(중점의 양쪽에 길이가 같다는 표시, 중점에 직각 표시)', why: '두 변의 수직이등분선이 만나는 점이므로 외심이다.' },
    vert: { is: 'O', say: '점 P와 세 꼭짓점을 이은 세 선분에 길이가 같다는 표시가 있다', why: '세 꼭짓점까지의 거리가 같은 점이므로 외심이다.' },
    angle: { is: 'I', say: '점 P와 두 꼭짓점을 이은 선분이 그 꼭짓점의 각을 크기가 같은 두 각으로 나눈다(같은 각 표시)', why: '두 내각의 이등분선이 만나는 점이므로 내심이다.' },
    side: { is: 'I', say: '점 P에서 세 변에 그은 세 선분에 직각 표시와 길이가 같다는 표시가 있다', why: '세 변까지의 거리가 같은 점이므로 내심이다.' },
    median: { is: '', say: '두 꼭짓점과 맞은편 변의 중점을 이은 두 선분이 점 P에서 만난다(중점의 양쪽에 길이가 같다는 표시만 있고 직각 표시는 없다)', why: '꼭짓점과 맞은편 변의 중점을 이은 선분은 그 변과 수직이라고 할 수 없으므로 외심도 내심도 아니다.' },
    height: { is: '', say: '두 꼭짓점에서 맞은편 변에 그은 두 선분이 점 P에서 만난다(변과 만나는 곳에 직각 표시만 있고 길이가 같다는 표시는 없다)', why: '꼭짓점에서 맞은편 변에 내린 수선은 그 변을 이등분한다고 할 수 없으므로 외심도 내심도 아니다.' },
    mixed: { is: '', say: '점 P와 한 변의 중점을 이은 선분(중점의 양쪽에 길이가 같다는 표시만 있다)과 점 P에서 다른 한 변에 그은 선분(직각 표시만 있다)이 있다', why: '한 변에는 중점 표시만, 다른 변에는 직각 표시만 있으므로 수직이등분선이라고 할 수 없다. 외심도 내심도 아니다.' }
  };
  function markCell(kind, T) {
    const { A, B: pB, C: pC } = T, P = { A, B: pB, C: pC };
    if (kind === 'perp' || kind === 'vert') P.P = circumOf(A, pB, pC);
    else if (kind === 'angle' || kind === 'side') P.P = inOf(A, pB, pC);
    else if (kind === 'height') P.P = meet(pB, foot(pB, A, pC), pC, foot(pC, A, pB));
    else P.P = [(A[0] + pB[0] + pC[0]) / 3, (A[1] + pB[1] + pC[1]) / 3];
    if (kind === 'perp') Object.assign(P, { m: mid(A, pB), n: mid(pB, pC) });
    if (kind === 'side') Object.assign(P, { m: foot(P.P, A, pB), n: foot(P.P, pB, pC), k: foot(P.P, pC, A) });
    if (kind === 'median') Object.assign(P, { m: mid(A, pC), n: mid(A, pB) });
    if (kind === 'height') Object.assign(P, { m: foot(pB, A, pC), n: foot(pC, A, pB) });
    if (kind === 'mixed') Object.assign(P, { m: mid(A, pB), n: foot(P.P, pB, pC) });
    const draw = (S) => {
      S.poly('BCA');
      if (kind === 'perp') S.seg('Pm Pn').right('PmA PnB').tick('Am mB').tick('Bn nC', 2);
      if (kind === 'vert') S.seg('PA PB PC').tick('PA PB PC');
      if (kind === 'angle') S.seg('BP CP').same('ABP PBC', 'dot', 20).same('BCP PCA', 'x', 20);
      if (kind === 'side') S.seg('Pm Pn Pk').right('PmA PnB PkC').tick('Pm Pn Pk');
      if (kind === 'median') S.seg('Bm Cn').tick('Am mC').tick('An nB', 2);
      if (kind === 'height') S.seg('Bm Cn').right('BmC CnB');
      if (kind === 'mixed') S.seg('Pm Pn').tick('Am mB').right('PnB');
      S.dot('P').names({ A: null, B: null, C: null });
    };
    return { P, draw };
  }

  // ∠C = 90°인 직각삼각형 ABC(BC = a, CA = b, AB = c)의 내접원 그림. 접점 D(AB), E(BC), F(CA)
  const rtIn = (a, b, c, size) => inPtsSides(a, b, c, { feet: true, size: size || (b / a > 0.9 ? [180, 170] : [225, 150]) });

  // ── 다시 실은 꼴(처음 지을 때 뺐다가 2026-10-13에 덧붙인 것 — 실력 묶음의 끝에 있다)이 쓰는 도구 ──
  const V = B.kit.mid.V, frac = B.kit.frac, Y = V('y'), Z = V('z');
  const { scaled, angleAt } = K;
  // ∠C 가 직각이 아닌 직각삼각형에서 L × cos C × tan(C/2) = k 가 되는 작은 쪽 ∠C(도). 빗변 L 위에 BC 와 같은 길이를 잡고 세운 수선의 길이가 k 이다.
  // 각의 안쪽을 다른 선이 지나가 글을 넣을 자리가 없을 때 쓴다: 각 표시(호)는 안쪽에 긋고, 크기는 변 vq 의 바깥에 적어 호의 끝과 짧은 가는 선으로 잇는다. name: 'pvq'
  const angOut = (S, name, label, r, far) => {
    const v = S.P[name[1]], a = dirOf(v, S.P[name[0]]), c = dirOf(v, S.P[name[2]]), n = c + ((a - c + 360) % 360 < 180 ? -90 : 90), e = at(v, r, c), reach = far || 22;
    const half = (B.kit.mgeo.textW(label) / 2) * Math.abs(Math.cos(n * RAD)) + 7 * Math.abs(Math.sin(n * RAD));
    S.ang(name, '', { r, square: false });
    S.b.seg(e, at(e, reach - half - 2, n), 'thin').text(at(e, reach, n), label, { blue: true });
    return S;
  };
  const cutAngle = (L, k) => { let lo = 8, hi = 51.8; for (let i = 0; i < 60; i += 1) { const m = (lo + hi) / 2; if (L * Math.cos(m * RAD) * Math.tan(m * RAD / 2) < k) lo = m; else hi = m; } return (lo + hi) / 2; };

  B.addGroup(UNIT, {
    id: 'hard', title: '실력 문제', standard: ISO,
    types: [
      // ── ① 문제의 그림·말·수에 함정이 있어 배운 뜻을 정확히 대야 풀리는 문제 ──
      H('hard-trapezoid', '사다리꼴 안의 두 이등변삼각형', '심13', (d) => {
        // 함정: 두 이등변삼각형이 모두 비스듬히 놓여 있다. △DAC 의 밑각은 ∠DAC, ∠DCA 이고 △CAB 의 밑각은 ∠CAB, ∠B 이다.
        const g = 4 * d.int(25, 30), m = (180 - g) / 2, x = (180 - m) / 2, pD = [100, 0], pC = at(pD, 100, 180 + g), P0 = { A: [0, 0], D: pD, C: pC, B: [pC[0] - dist([0, 0], pC), pC[1]] };
        const S = scene(fitPts(P0, [225, 150]));
        S.poly('ABCD').seg('AC').tick('AD CD').tick('AC BC', 2).arrow('AD', 0.78).arrow('BC', 0.8).ang('ADC', deg(g)).ang('ABC', sv('x')).names();
        return degQ(`${nb(`${sg('AD')} ∥ ${sg('BC')}`)}인 사다리꼴 ABCD에서 ${eq('AC', 'BC')}, ${eq('AD', 'CD')}이다. ∠D = ${g}°일 때, ∠B의 크기는?`, x, {
          figure: S.svg(`사다리꼴 ABCD와 대각선 AC. 변 AD가 위쪽에, 변 BC가 아래쪽에 있고 두 변에 평행하다는 표시가 있다. 변 AD와 변 CD에 길이가 같다는 표시(한 줄), 대각선 AC와 변 BC에 길이가 같다는 표시(두 줄)가 있다. ∠D = ${g}°, ∠B = x`),
          explain: `${eq('DA', 'DC')}이므로 △DAC에서 ∠DAC = ∠DCA = (180° − ${g}°) ÷ 2 = ${m}°이다. ${sg('AD')} ∥ ${sg('BC')}이므로 ∠ACB = ∠DAC = ${m}°(엇각)이다. ${eq('CA', 'CB')}이므로 △CAB에서 꼭지각이 ∠ACB이고 ∠B = (180° − ${m}°) ÷ 2 = ${x}°이다.`,
          facts: { calc: [[`(180-(180-${g})/2)/2`, 0]], unseen: [180, 2] }
        });
      }),
      H('hard-rt-other', '빗변이 아닌 변의 길이가 같은 두 직각삼각형의 합동 조건', '기본 ①30 ②24', (d, n) => {
        // 함정: 직각삼각형이면 RHA·RHS 부터 대는 아이. 길이가 같다고 표시된 변이 빗변이 아니면 RHA·RHS 를 쓸 수 없다.
        const al = d.pick([34, 38, 52, 56]), S = scene(sideBySide([laid(rtHyp(10, al), { R: 'C', U: 'A', W: 'B' }, 0, d.bool()), laid(rtHyp(10, al), { R: 'F', U: 'D', W: 'E' }, d.pick([90, 180, 270]), d.bool())], [225, 105]));
        S.poly('ABC').poly('DEF').right('ACB DFE');
        const text = '그림의 두 직각삼각형 ABC와 DEF에서 같은 표시를 한 변의 길이와 각의 크기가 각각 같다. 두 삼각형이 합동임을 설명할 때 이용하는 합동 조건은?';
        if (n === 0) {
          S.tick('AC DF').same('BAC EDF', 'dot', 24).names();
          return pickOne(d, text, 'ASA 합동', ['RHA 합동', 'RHS 합동', 'SAS 합동'], {
            figure: S.svg('직각삼각형 ABC: ∠C에 직각 표시가 있다. 직각삼각형 DEF: ∠F에 직각 표시가 있다. 변 AC와 변 DF에 길이가 같다는 표시가 있고, ∠A와 ∠D에 크기가 같다는 표시가 있다'),
            explain: `길이가 같은 변 ${sg('AC')}, ${sg('DF')}는 직각을 낀 변이고 빗변이 아니므로 RHA 합동, RHS 합동을 쓸 수 없다. ${eq('AC', 'DF')}이고 그 양 끝 각의 크기가 ∠A = ∠D, ∠C = ∠F = 90°로 각각 같으므로 △ABC ≡ △DEF (ASA 합동)이다.`, rule: 'rt-other-asa'
          });
        }
        S.tick('AC DF').tick('BC EF', 2).names();
        return pickOne(d, text, 'SAS 합동', ['RHS 합동', 'RHA 합동', 'ASA 합동'], {
          figure: S.svg('직각삼각형 ABC: ∠C에 직각 표시가 있다. 직각삼각형 DEF: ∠F에 직각 표시가 있다. 변 AC와 변 DF에 길이가 같다는 표시(한 줄), 변 BC와 변 EF에 길이가 같다는 표시(두 줄)가 있다'),
          explain: `길이가 같은 두 쌍의 변은 모두 직각을 낀 변이고 빗변이 아니므로 RHS 합동을 쓸 수 없다. ${eq('AC', 'DF')}, ${eq('BC', 'EF')}이고 그 끼인각의 크기가 ∠C = ∠F = 90°로 같으므로 △ABC ≡ △DEF (SAS 합동)이다.`, rule: 'rt-other-sas'
        });
      }, { count: 2 }),
      H('hard-line-through', '직각이등변삼각형을 가로지르는 직선에 내린 두 수선', '심30 / 기본 ①34', (d) => {
        // 함정: 「두 수선의 길이의 합이 두 수선의 발 사이의 거리」라고 외운 아이. 직선이 삼각형을 가로지르면 두 수선의 발이 점 A 의 같은 쪽에 놓여 차가 된다.
        const [p, q] = d.until(() => [d.int(6, 12), d.int(4, 8)], (w) => w[0] - w[1] >= 2 && w[0] / w[1] <= 2.2), S = lineScene(p, q, true, [215, 180]);
        S.len('BD', cm(p), 'E', { t: 0.8 }).len('CE', cm(q), 'A').names({ A: [125, 12], D: 270, E: 90 });
        return cmQ(`∠A = 90°이고 ${eq('AB', 'AC')}인 직각이등변삼각형 ABC의 꼭짓점 A를 지나는 직선 ${B.kit.mid.V('l')}이 변 BC와 만난다. 두 꼭짓점 B, C에서 직선 ${B.kit.mid.V('l')}에 내린 수선의 발을 각각 D, E라 하자. ${nb(`${sg('BD')} = ${p} cm`)}, ${nb(`${sg('CE')} = ${q} cm`)}일 때, ${sg('DE')}의 길이는?`, p - q, {
          figure: S.svg(`직각이등변삼각형 ABC. ∠A에 직각 표시가 있고 변 AB와 변 AC에 길이가 같다는 표시가 있다. 꼭짓점 A를 지나는 직선 l이 삼각형을 가로질러 변 BC와 만나고, 점 B는 직선 l의 위쪽에, 점 C는 아래쪽에 있다. 직선 l 위에 세 점 A, D, E가 이 차례로 놓여 있고 선분 BD와 선분 CE는 직선 l과 수직으로 만난다. 선분 BD의 길이는 ${p} cm, 선분 CE의 길이는 ${q} cm`),
          explain: `△ABD와 △CAE에서 ∠ADB = ∠CEA = 90°, ${eq('AB', 'CA')}, ∠DBA = 90° − ∠DAB = ∠EAC이므로 △ABD ≡ △CAE (RHA 합동)이다. ${eq('AE', 'BD')} = ${p} cm, ${eq('AD', 'CE')} = ${q} cm이고 두 점 D, E는 점 A의 같은 쪽에 있으므로 ${sg('DE')} = ${sg('AE')} − ${sg('AD')} = ${p} − ${q} = ${p - q}(cm)이다.`,
          facts: { calc: [[`${p}-${q}`, 0]] }
        });
      }),
      H('hard-obtuse', '둔각삼각형의 외심', '심43 / 기본 ①55', (d, n) => {
        // 함정: 외심이 삼각형 밖에 있다. 밖에 있어도 세 꼭짓점까지의 거리가 같으므로 이등변삼각형 셋으로 푼다(∠OBA = ∠ABC + ∠OBC).
        if (n === 0) {
          const v = d.until(() => ({ b: d.int(26, 46), c: d.int(24, 42) }), (w) => w.b + w.c >= 58 && w.b + w.c <= 76 && Math.abs(w.b - w.c) >= 5), t = 90 - v.b - v.c;
          const S = scene(circPts(180 - v.b - v.c, v.b, { size: [235, 150] }));
          S.poly('BCA').seg('OA OB OC').dot('O').ang('ABC', deg(v.b)).ang('ACB', deg(v.c)).ang('BOC', '', { r: 13, square: false }).names({ O: 270 });
          return degQ(`점 O는 △ABC의 외심이다. ∠ABC = ${v.b}°, ∠ACB = ${v.c}°일 때, ∠BOC의 크기는?`, 2 * (v.b + v.c), {
            figure: S.svg(`삼각형 ABC와 그 외부의 점 O. 점 O는 변 BC의 아래쪽에 있고 선분 OA, OB, OC가 그어져 있다. 선분 OA는 변 BC를 가로지른다. ∠ABC = ${v.b}°, ∠ACB = ${v.c}°이고 ∠BOC에 각 표시가 있다`),
            explain: `${nb(`${sg('OA')} = ${sg('OB')} = ${sg('OC')}`)}이다. ∠OBC = ∠OCB = ∠${X}라 하면 △OAB에서 ∠OAB = ∠OBA = ${v.b}° + ∠${X}, △OAC에서 ∠OAC = ∠OCA = ${v.c}° + ∠${X}이다. △ABC에서 (${v.b}° + ∠${X}) + (${v.c}° + ∠${X}) + ${v.b}° + ${v.c}° = 180°이므로 ∠${X} = ${t}°이다. △OBC에서 ∠BOC = 180° − ${t}° × 2 = ${2 * (v.b + v.c)}°이다.`,
            facts: { calc: [[`180-(180-2*${v.b}-2*${v.c})/2*2`, 0]], unseen: [180, 2] }
          });
        }
        const v = d.until(() => { const t = d.int(13, 20), b = d.int(26, 46); return { t, b, c: 90 - t - b }; }, (w) => w.c >= 24 && w.c <= 46 && Math.abs(w.b - w.c) >= 5), y = v.c + v.t;
        const S = scene(circPts(90 + v.t, v.b, { size: [235, 150] }));
        S.poly('BCA').seg('OA OB OC').dot('O').ang('ABC', deg(v.b)).ang('OBC', '', { r: 44, square: false }).names({ O: 270 });
        { const p = at(S.P.B, 58, dirOf(S.P.B, S.P.O)); S.b.text([p[0], p[1] + 12], deg(v.t), { blue: true }); }
        return degQ(`점 O는 △ABC의 외심이다. ∠ABC = ${v.b}°, ∠OBC = ${v.t}°일 때, ∠BAC의 크기는?`, 90 + v.t, {
          figure: S.svg(`삼각형 ABC와 그 외부의 점 O. 점 O는 변 BC의 아래쪽에 있고 선분 OA, OB, OC가 그어져 있다. 선분 OA는 변 BC를 가로지른다. ∠ABC = ${v.b}°, ∠OBC = ${v.t}°`),
          explain: `${nb(`${sg('OA')} = ${sg('OB')} = ${sg('OC')}`)}이다. △OAB에서 ∠OAB = ∠OBA = ${v.b}° + ${v.t}° = ${v.b + v.t}°이고, △OBC에서 ∠OCB = ${v.t}°이다. ∠OAC = ∠OCA = ∠${X}라 하면 ∠ACB = ∠${X} − ${v.t}°이므로 △ABC에서 (${v.b + v.t}° + ∠${X}) + ${v.b}° + (∠${X} − ${v.t}°) = 180°, ∠${X} = ${y}°이다. ∠BAC = ${v.b + v.t}° + ${y}° = ${90 + v.t}°이다.`,
          facts: { calc: [[`${v.b}+${v.t}+(180-2*${v.b})/2`, 0]], unseen: [180, 2] }
        });
      }, { count: 2, standard: CEN }),
      H('hard-right-oi', '직각삼각형의 외심과 내심이 이루는 각', '심58', (d) => {
        // 함정: 외심을 삼각형 안에서 찾는 아이. 직각삼각형의 외심은 빗변의 중점이므로 OA = OB 이다.
        const a = d.int(62, 68), x = a - 45, P0 = { B: [0, 0], A: [0, -100], C: [100 * Math.tan(a * RAD), 0] };
        P0.O = mid(P0.A, P0.C); P0.I = inOf(P0.A, P0.B, P0.C);
        const S = scene(fitPts(P0, [245, 125]));
        S.poly('BCA').seg('BO BI').right('ABC').dot('OI').ang('BAC', deg(a)).ang('IBO', sv('x'), { r: 40 }).names({ I: 100 });
        return degQ(`∠B = 90°인 직각삼각형 ABC에서 두 점 O, I는 각각 △ABC의 외심, 내심이다. ∠A = ${a}°일 때, ∠IBO의 크기는?`, x, {
          figure: S.svg(`직각삼각형 ABC. ∠B에 직각 표시가 있다. 점 O는 변 AC 위에 있고 점 I는 삼각형의 내부에 있다. 선분 BO, BI가 그어져 있다. ∠A = ${a}°, ∠IBO = x`),
          explain: `직각삼각형의 외심은 빗변의 중점이므로 ${eq('OA', 'OB')}이고 ∠OBA = ∠A = ${a}°이다. 점 I는 내심이므로 ${sg('BI')}는 ∠B의 이등분선이고 ∠IBA = 90° ÷ 2 = 45°이다. ∠IBO = ${a}° − 45° = ${x}°이다.`,
          facts: { calc: [[`${a}-90/2`, 0]], unseen: [90, 2] }
        });
      }, { standard: CEN }),
      H('hard-median-height', '직각삼각형의 빗변의 중점과 높이 사이의 각', '심38 / 기본 ①57', (d) => {
        // 함정: 「외심」이라는 말이 없다. 빗변의 중점 M 이 외심임을 알아야 MA = MB 를 쓸 수 있다.
        const bq = d.int(24, 36), x = 90 - 2 * bq, P0 = { B: [0, 0], C: [100, 0], A: at([0, 0], 100 * Math.cos(bq * RAD), bq), M: [50, 0] };
        P0.H = foot(P0.A, P0.B, P0.C);
        const S = scene(fitPts(P0, [235, 130]));
        S.poly('BCA').seg('AM AH').right('BAC AHB').tick('BM MC').ang('ABC', deg(bq)).ang('MAH', sv('x'), { r: 30 }).names();
        return degQ(`∠A = 90°인 직각삼각형 ABC에서 점 M은 빗변 BC의 중점이고, 꼭짓점 A에서 변 BC에 내린 수선의 발을 H라 하자. ∠B = ${bq}°일 때, ∠MAH의 크기는?`, x, {
          figure: S.svg(`직각삼각형 ABC. ∠A에 직각 표시가 있다. 변 BC 위에 점 B, M, H, C가 이 차례로 놓여 있고 선분 BM과 선분 MC에 길이가 같다는 표시가 있다. 선분 AM, AH가 그어져 있고 ∠AHB에 직각 표시가 있다. ∠B = ${bq}°, ∠MAH = x`),
          explain: `직각삼각형의 빗변의 중점은 외심이므로 ${eq('MA', 'MB')}이고 ∠MAB = ∠B = ${bq}°이다. △ABH에서 ∠BAH = 90° − ${bq}° = ${90 - bq}°이다. ∠MAH = ${90 - bq}° − ${bq}° = ${x}°이다.`,
          facts: { calc: [[`90-${bq}-${bq}`, 0]], unseen: [90] }
        });
      }, { standard: CEN }),
      H('hard-oi-boc', '외심과 내심이 함께 있는 그림에서 외심이 이루는 각', '심59', (d) => {
        // 함정: 점 I 에 대한 조건으로 ∠BIC 를 구해 답하는 아이, ∠BOC = 90° + ½∠A 로 섞어 쓰는 아이.
        const draw = (w) => scene(oiPts(w[0], w[1], [225, 200])).poly('BCA').seg('OB OC IB IC').dot('OI').ang('IBC', deg(w[1] / 2)).ang('ICB', deg(w[2] / 2)).ang('BOC', '', { r: 9, square: false }).names({ O: 'AB|AC', I: [90, 9] });
        const [al, be, ga] = d.until(() => oiAngles(d), (w) => w[0] >= 44 && !draw(w).clash()), q = be / 2, r = ga / 2, S = draw([al, be, ga]);
        return degQ(`두 점 O, I는 각각 △ABC의 외심, 내심이다. ∠IBC = ${q}°, ∠ICB = ${r}°일 때, ∠BOC의 크기는?`, 2 * al, {
          figure: S.svg(`삼각형 ABC와 그 내부의 두 점 O, I. 선분 OB, OC와 선분 IB, IC가 그어져 있다. 점 I가 점 O보다 변 BC에 가깝다. ∠IBC = ${q}°, ∠ICB = ${r}°이고 ∠BOC에 각 표시가 있다`),
          explain: `점 I가 내심이므로 ∠ABC = ${q}° × 2 = ${be}°, ∠ACB = ${r}° × 2 = ${ga}°이고 ∠A = 180° − (${be}° + ${ga}°) = ${al}°이다. 점 O가 외심이므로 ∠BOC = 2∠A = ${2 * al}°이다.`,
          facts: { calc: [[`2*(180-2*${q}-2*${r})`, 0]], unseen: [2, 180] }
        });
      }, { standard: CEN }),
      H('hard-o-incenter', '외심과 두 꼭짓점이 이루는 삼각형의 내심', '기본 ②70', (d) => {
        // 함정: 점 I 를 △ABC 의 내심으로 읽는 아이(∠BIC = 90° + ½∠A 로 풀면 틀린다). 점 I 는 △OBC 의 내심이다.
        const al = d.int(44, 58), g = al + 90, be = d.until(() => d.int(52, 78), (v) => 180 - al - v >= 50 && 180 - al - v <= 78 && Math.abs(2 * v + al - 180) >= 8), P0 = onCircle(al, be);
        P0.I = inOf(P0.O, P0.B, P0.C);
        const S = scene(fitPts(P0, [215, 170]));
        S.poly('BCA').seg('OB OC IB IC').dot('OI').ang('BIC', '', { r: 9, square: false }).ang('BAC', sv('x'), { square: false }).names({ I: [90, 10] });
        return degQ(`점 O는 △ABC의 외심이고 점 I는 △OBC의 내심이다. ∠BIC = ${g}°일 때, ∠A의 크기는?`, al, {
          figure: S.svg('삼각형 ABC와 그 내부의 점 O. 선분 OB, OC가 그어져 있고, 삼각형 OBC의 내부에 점 I가 있다. 선분 IB, IC가 그어져 있고 ∠BIC에 각 표시가 있다. ∠A = x'),
          explain: `점 I가 △OBC의 내심이므로 ∠OBC + ∠OCB = (180° − ${g}°) × 2 = ${2 * (180 - g)}°이고 ∠BOC = 180° − ${2 * (180 - g)}° = ${2 * al}°이다. 점 O가 △ABC의 외심이므로 ∠A = ∠BOC ÷ 2 = ${al}°이다.`,
          facts: { calc: [[`(180-(180-${g})*2)/2`, 0]], unseen: [180, 2] }
        });
      }, { standard: CEN }),

      // ── ② 세 단계 넘게 이어 생각해야 풀리는 문제 ──
      H('hard-chain-closed', '세 이등변삼각형이 한 삼각형을 이룰 때의 각', '기본 ①11', (d) => {
        const ask = d.pick([['∠A', 36, 'BAC'], ['∠ADC', 108, 'ADC']]), S = isoScene(36, (P) => ({ D: meet(P.C, at(P.C, 10, 144), P.A, P.B) }), [128, 178], 0.82);
        S.seg('CD').tick('AD DC BC', 2).ang(ask[2], sv('x'), { square: false }).names();
        return degQ(`${eq('AB', 'AC')}인 이등변삼각형 ABC에서 변 AB 위의 점 D에 대하여 ${nb(`${sg('AD')} = ${sg('DC')} = ${sg('BC')}`)}일 때, ${ask[0]}의 크기는?`, ask[1], {
          figure: S.svg(`${ISO_SAY}점 D는 변 AB 위에 있고 선분 CD가 그어져 있다. 변 AB와 변 AC의 표시는 한 줄이고, 선분 AD, 선분 DC, 변 BC에 길이가 같다는 표시(두 줄)가 있다. ${ask[0]} = x`),
          explain: `∠A = ∠${X}라 하자. ${eq('DA', 'DC')}이므로 ∠DCA = ∠${X}이고 ∠BDC는 △ADC의 외각이므로 2∠${X}이다. ${eq('CD', 'CB')}이므로 ∠B = ∠BDC = 2∠${X}이고, ${eq('AB', 'AC')}이므로 ∠ACB = ∠B = 2∠${X}이다. △ABC에서 ∠${X} + 2∠${X} + 2∠${X} = 180°이므로 ∠${X} = 36°이다.${ask[1] === 108 ? ' ∠ADC = 180° − 36° × 2 = 108°이다.' : ''}`,
          facts: { calc: [[ask[1] === 36 ? '180/5' : '180-180/5*2', 0]], unseen: [180, 5, 2] }
        });
      }),
      H('hard-chain-three', '이웃한 이등변삼각형 세 겹과 한 내각', '기본 ①10 ②6', (d) => {
        const x = d.int(18, 25), w = 180 - 4 * x, c = (v) => Math.cos(v * RAD), P0 = { B: [0, 0], D: at([0, 0], 100, x), E: [200 * c(x), 0], A: at([0, 0], 100 + 200 * c(2 * x), x), C: [200 * c(x) + 200 * c(3 * x), 0] };
        const S = scene(fitPts(P0, [255, 120]));
        S.poly('BCA').seg('DE EA').tick('BD DE EA AC').ang('ABC', sv('x'), { r: 30 }).names();
        return degQ(`△ABC에서 변 AB 위의 점 D와 변 BC 위의 점 E에 대하여 ${nb(`${sg('BD')} = ${sg('DE')} = ${sg('EA')} = ${sg('AC')}`)}이다. ∠BAC = ${w}°일 때, ∠B의 크기는?`, x, {
          figure: S.svg('삼각형 ABC. 점 D는 변 AB 위에, 점 E는 변 BC 위에 있고 선분 DE와 선분 EA가 그어져 있다. 선분 BD, 선분 DE, 선분 EA, 변 AC에 길이가 같다는 표시가 있다. ∠B = x'),
          explain: `∠B = ∠${X}라 하자. ${eq('DB', 'DE')}이므로 ∠DEB = ∠${X}이고 ∠ADE = 2∠${X}(△DBE의 외각)이다. ${eq('ED', 'EA')}이므로 ∠EAD = 2∠${X}이고 ∠AEC = ∠${X} + 2∠${X} = 3∠${X}(△ABE의 외각)이다. ${eq('AE', 'AC')}이므로 ∠C = 3∠${X}이다. △ABC에서 ∠${X} + ${w}° + 3∠${X} = 180°이므로 ∠${X} = ${x}°이다.`,
          facts: { calc: [[`(180-${w})/4`, 0]], unseen: [180, 4] }
        });
      }),
      H('hard-shared-vertex', '꼭짓점을 함께 가진 두 이등변삼각형과 외각의 이등분선', '기본 ①13 ②7', (d) => {
        const be = 4 * d.int(12, 16), a = 180 - 2 * be, m = (180 - be) / 2, x = m / 2;
        const S = scene(fitPts((() => { const P = isoTri(a); P.D = at(P.C, 100, m); P.E = [Math.max(P.C[0] + 44, P.D[0] + 10), 0]; return P; })(), [245, 150]));
        S.poly('BCA').seg('CE BD CD').tick('AB AC', 1, 0.28).tick('CB CD', 2).same('ACD DCE', 'dot', 26).ang('BAC', deg(a)).ang('CDB', sv('x'), { r: 30 }).names({ C: 270, E: 270 });
        return degQ(`${eq('AB', 'AC')}인 이등변삼각형 ABC에서 변 BC의 연장선 위에 점 E가 있다. 점 D에 대하여 ${eq('CB', 'CD')}이고 ∠ACD = ∠DCE이다. ∠A = ${a}°일 때, ∠CDB의 크기는?`, x, {
          figure: S.svg(`삼각형 ABC. 변 AB와 변 AC에 길이가 같다는 표시(한 줄)가 있다. 점 E는 변 BC를 점 C 쪽으로 늘인 선 위에 있다. 점 D는 삼각형의 오른쪽 위에 있고 선분 CD와 선분 BD가 그어져 있다. 변 CB와 선분 CD에 길이가 같다는 표시(두 줄), ∠ACD와 ∠DCE에 크기가 같다는 표시가 있다. ∠A = ${a}°, ∠CDB = x`),
          explain: `${eq('AB', 'AC')}이므로 ∠ACB = (180° − ${a}°) ÷ 2 = ${be}°이고 ∠ACE = 180° − ${be}° = ${180 - be}°, ∠DCE = ${180 - be}° ÷ 2 = ${m}°이다. ${eq('CB', 'CD')}이므로 ∠CBD = ∠CDB이고, ∠DCE는 △CBD의 외각이므로 ∠CBD + ∠CDB = ${m}°이다. ∠CDB = ${m}° ÷ 2 = ${x}°이다.`,
          facts: { calc: [[`(180-(180-${a})/2)/2/2`, 0]], unseen: [180, 2] }
        });
      }),
      H('hard-two-iso-sum', '한 변 위의 점에서 양쪽으로 생긴 두 이등변삼각형 사이의 각', '심10', (d) => {
        const build = (w) => { const P = baseTri(w.b, w.c); return Object.assign(P, { E: [w.e, 0], D: along(P.B, P.A, w.e), F: along(P.C, P.A, 100 - w.e) }); };
        const v = d.until(() => { const a = 2 * d.int(26, 42), b = d.int(48, 72); return { a, b, c: 180 - a - b, e: d.int(44, 56) }; }, (w) => { if (w.c < 46 || w.c > 74 || Math.abs(w.b - w.c) < 5) return false; const P = build(w); return w.e < dist(P.A, P.B) * 0.82 && 100 - w.e < dist(P.A, P.C) * 0.82; }), x = 90 - v.a / 2;
        const S = scene(fitPts(build(v), [220, 160]));
        S.poly('BCA').seg('DE EF').tick('BD BE').tick('CE CF', 2).ang('BAC', deg(v.a)).ang('DEF', sv('x')).names();
        return degQ(`△ABC의 세 변 AB, BC, CA 위에 각각 점 D, E, F가 있고 ${eq('BD', 'BE')}, ${eq('CE', 'CF')}이다. ∠A = ${v.a}°일 때, ∠DEF의 크기는?`, x, {
          figure: S.svg(`삼각형 ABC. 점 D는 변 AB 위에, 점 E는 변 BC 위에, 점 F는 변 CA 위에 있고 선분 DE와 선분 EF가 그어져 있다. 선분 BD와 선분 BE에 길이가 같다는 표시(한 줄), 선분 CE와 선분 CF에 길이가 같다는 표시(두 줄)가 있다. ∠A = ${v.a}°, ∠DEF = x`),
          explain: `∠B + ∠C = 180° − ${v.a}° = ${180 - v.a}°이다. ${eq('BD', 'BE')}이므로 ∠BED = (180° − ∠B) ÷ 2, ${eq('CE', 'CF')}이므로 ∠CEF = (180° − ∠C) ÷ 2이다. ∠BED + ∠CEF = 180° − (∠B + ∠C) ÷ 2 = 180° − ${90 - v.a / 2}° = ${90 + v.a / 2}°이므로 ∠DEF = 180° − ${90 + v.a / 2}° = ${x}°이다.`,
          facts: { calc: [[`180-(180-(180-${v.a})/2)`, 0]], unseen: [180, 2] }
        });
      }),
      H('hard-iso-sas', '이등변삼각형의 세 변 위의 점이 만드는 합동과 각', '심11 / 기본 ①14', (d) => {
        const a = 2 * d.int(22, 34), bv = 90 - a / 2;
        const S = scene(fitPts((() => { const P = isoTri(a); return Object.assign(P, { E: [60, 0], D: along(P.B, P.A, 40), F: along(P.C, P.A, 60) }); })(), [185, 165]));
        S.poly('BCA').seg('DE EF FD').tick('AB AC', 1, 0.14).tick('BD CE', 2).tick('BE CF', 3).ang('BAC', deg(a)).ang('DEF', sv('x')).names();
        return degQ(`${eq('AB', 'AC')}인 이등변삼각형 ABC의 세 변 AB, BC, CA 위에 각각 점 D, E, F가 있고 ${eq('BD', 'CE')}, ${eq('BE', 'CF')}이다. ∠A = ${a}°일 때, ∠DEF의 크기는?`, bv, {
          figure: S.svg(`${ISO_SAY}점 D는 변 AB 위에, 점 E는 변 BC 위에, 점 F는 변 CA 위에 있고 삼각형 DEF가 그어져 있다. 선분 BD와 선분 CE에 길이가 같다는 표시(두 줄), 선분 BE와 선분 CF에 길이가 같다는 표시(세 줄)가 있다. ∠A = ${a}°, ∠DEF = x`),
          explain: `${eq('AB', 'AC')}이므로 ∠B = ∠C = (180° − ${a}°) ÷ 2 = ${bv}°이다. △BED와 △CFE에서 ${eq('BD', 'CE')}, ${eq('BE', 'CF')}, ∠B = ∠C이므로 △BED ≡ △CFE (SAS 합동)이고 ∠CEF = ∠BDE이다. ∠DEF = 180° − (∠BED + ∠CEF) = 180° − (∠BED + ∠BDE) = ∠B = ${bv}°이다.`,
          facts: { calc: [[`(180-${a})/2`, 0]], unseen: [180, 2], rule: 'hard-iso-sas' }
        });
      }),
      H('hard-square-iso', '정사각형의 한 변과 길이가 같은 선분으로 생긴 두 이등변삼각형', '심14', (d) => {
        const s = 140, draw = (w) => { const P0 = { A: [0, 0], D: [s, 0], B: [0, s], C: [s, s], E: at([0, 0], s, 180 - 2 * w) }; P0.F = meet(P0.E, P0.B, P0.A, P0.D); return scene(P0).poly('ABCD').seg('AE ED EB').tick('AD', 1, 0.1).tick('AE').ang('EDA', deg(w), { r: 18 }).ang('EFD', sv('x'), { r: 12 }).names({ F: [305, 13] }); };
        const g = d.until(() => d.int(60, 70), (w) => !draw(w).clash()), x = 135 - g, S = draw(g);
        return degQ(`정사각형 ABCD의 바깥에 ${eq('AD', 'AE')}인 점 E가 있고, 선분 EB와 변 AD가 만나는 점을 F라 하자. ∠EDF = ${g}°일 때, ∠EFD의 크기는?`, x, {
          figure: S.svg(`정사각형 ABCD. 꼭짓점 A는 왼쪽 위, B는 왼쪽 아래, C는 오른쪽 아래, D는 오른쪽 위에 있다. 점 E는 변 AD의 위쪽에 있고 선분 AE, ED, EB가 그어져 있다. 선분 EB는 변 AD와 점 F에서 만난다. 변 AD와 선분 AE에 길이가 같다는 표시가 있다. ∠EDF = ${g}°, ∠EFD = x`),
          explain: `${eq('AD', 'AE')}이므로 ∠AED = ∠ADE = ${g}°이고 ∠EAD = 180° − ${g}° × 2 = ${180 - 2 * g}°이다. 정사각형이므로 ${eq('AB', 'AD')}이고 ${eq('AB', 'AE')}이다. △ABE는 꼭지각이 ∠BAE = 90° + ${180 - 2 * g}° = ${270 - 2 * g}°인 이등변삼각형이므로 ∠AEB = (180° − ${270 - 2 * g}°) ÷ 2 = ${g - 45}°이다. ∠FED = ${g}° − ${g - 45}° = 45°이므로 △EFD에서 ∠EFD = 180° − (${g}° + 45°) = ${x}°이다.`,
          facts: { calc: [[`180-${g}-(${g}-(180-(90+180-${g}*2))/2)`, 0]], unseen: [180, 90, 2] }
        });
      }),
      H('hard-fold-triangle', '이등변삼각형 모양의 종이를 접어 생긴 각', '심16 / 기본 ①16 ②12', (d) => {
        const t = 3 * d.int(5, 12), x = (180 - 2 * t) / 3;
        const S = scene(fitPts((() => { const P = isoTri(x), D = mid(P.A, P.C); return Object.assign(P, { D, E: meet(D, perpAt(D, P.A, P.C), P.A, P.B) }); })(), [165, 175]));
        S.poly('EBCD', PAPER).poly('EDC', FLAP).seg('AE AD', 'cut').ang('ECB', deg(t), { r: 26 }).ang('EAD', sv('x'), { square: false }).names();
        return degQ(`${eq('AB', 'AC')}인 이등변삼각형 모양의 종이 ABC를 꼭짓점 A가 꼭짓점 C에 오도록 접었다. 접는 선이 두 변 AB, AC와 만나는 점을 각각 E, D라 하자. ∠ECB = ${t}°일 때, ∠A의 크기는?`, x, {
          figure: S.svg(`이등변삼각형 모양의 종이 ABC를 선분 ED를 접는 선으로 하여 접은 그림. 점 E는 변 AB 위에, 점 D는 변 AC 위에 있다. 접힌 부분은 삼각형 EDC에 겹쳐 있고, 접기 전의 변 AE, AD는 점선으로 남아 있다. ∠ECB = ${t}°, ∠A = x`),
          explain: `∠A = ∠${X}라 하자. 접은 각이므로 ∠ECD = ∠A = ∠${X}이고 ∠ACB = ∠${X} + ${t}°이다. ${eq('AB', 'AC')}이므로 ∠B = ∠ACB = ∠${X} + ${t}°이다. △ABC에서 ∠${X} + 2(∠${X} + ${t}°) = 180°이므로 3∠${X} = ${180 - 2 * t}°, ∠${X} = ${x}°이다.`,
          facts: { calc: [[`(180-2*${t})/3`, 0]], unseen: [180, 2, 3] }
        });
      }),
      H('hard-trisect-length', '크기가 같은 각을 좇아 이등변삼각형 둘을 찾는 길이 문제', '심18', (d) => {
        const [p, q] = d.pick([[6, 11], [5, 9], [4, 7], [6, 10], [7, 12], [7, 13], [8, 13], [8, 15], [5, 8]]), a = Math.acos((q - p) / (2 * p)) / RAD / 2;
        const S = scene(fitPts((() => { const P = baseTri(180 - 4 * a, a), from = dirOf(P.A, P.B); return Object.assign(P, { D: meet(P.A, at(P.A, 10, from + a), P.B, P.C), E: meet(P.A, at(P.A, 10, from + 2 * a), P.B, P.C) }); })(), [250, 140]));
        S.poly('BCA').seg('AD AE').same('BAD DAE EAC', 'dot', 32).same('ACB', 'dot', 34).len('AB', cm(p), 'C').dim('BC', cm(q), 'A', 24).names();
        return cmQ(`△ABC의 변 BC 위의 두 점 D, E에 대하여 ∠BAD = ∠DAE = ∠EAC = ∠C이다. ${nb(`${sg('AB')} = ${p} cm`)}, ${nb(`${sg('BC')} = ${q} cm`)}일 때, ${sg('AE')}의 길이는?`, q - p, {
          figure: S.svg(`삼각형 ABC. 변 BC 위에 점 B, D, E, C가 이 차례로 놓여 있고 선분 AD, AE가 그어져 있다. ∠BAD, ∠DAE, ∠EAC, ∠C에 크기가 같다는 표시가 있다. 변 AB의 길이는 ${p} cm, 변 BC의 길이는 ${q} cm`),
          explain: `∠EAC = ∠C이므로 △EAC는 ${eq('EA', 'EC')}인 이등변삼각형이다. ∠AEB는 △EAC의 외각이므로 ∠EAC + ∠C이고, 이것은 ∠BAE = ∠BAD + ∠DAE와 크기가 같다. 따라서 △BAE는 ${eq('BA', 'BE')}인 이등변삼각형이고 ${sg('BE')} = ${p} cm이다. ${sg('AE')} = ${sg('EC')} = ${q} − ${p} = ${q - p}(cm)이다.`,
          facts: { calc: [[`${q}-${p}`, 0]], rule: 'hard-trisect' }
        });
      }),
      H('hard-ext-perp', '등변의 연장선 위의 점에서 밑변에 내린 수선', '심19', (d) => {
        const m = d.int(4, 7), x = d.int(2, 5), n = m + 2 * x, be = d.int(50, 60), L = x + m, c = Math.cos(be * RAD), s = Math.sin(be * RAD);
        const P0 = { B: [0, 0], C: [2 * L * c, 0], A: [L * c, -L * s] };
        P0.D = along(P0.C, P0.A, L + x); P0.E = [P0.D[0], 0]; P0.F = meet(P0.D, P0.E, P0.A, P0.B);
        const S = scene(fitPts(P0, [165, 205]));
        S.poly('BCA').seg('AD DE').right('DEB').tick('AB', 1, 0.94).tick('AC', 1, 0.94).len('BF', cm(m), 'C').dim('CD', cm(n), 'B', 22).names({ F: [0, 12] });
        return cmQ(`${eq('AB', 'AC')}인 이등변삼각형 ABC에서 변 CA의 연장선 위의 점 D에서 변 BC에 내린 수선의 발을 E라 하고, 선분 DE와 변 AB가 만나는 점을 F라 하자. ${nb(`${sg('BF')} = ${m} cm`)}, ${nb(`${sg('CD')} = ${n} cm`)}일 때, ${sg('AD')}의 길이는?`, x, {
          figure: S.svg(`${ISO_SAY}점 D는 변 CA를 점 A 너머로 늘인 선 위에 있다. 점 E는 변 BC 위에 있고 선분 DE가 변 AB와 점 F에서 만난다. ∠DEB에 직각 표시가 있다. 선분 BF의 길이는 ${m} cm, 선분 CD의 길이는 ${n} cm`),
          explain: `${eq('AB', 'AC')}이므로 ∠B = ∠C이다. △DEC에서 ∠D = 90° − ∠C, △FBE에서 ∠BFE = 90° − ∠B이고 ∠AFD = ∠BFE(맞꼭지각)이므로 ∠D = ∠AFD이다. 따라서 △AFD는 ${eq('AD', 'AF')}인 이등변삼각형이다. ${sg('AD')} = ${X} cm라 하면 ${sg('AC')} = ${sg('AB')} = (${X} + ${m}) cm이고 ${sg('CD')} = (${X} + ${m}) + ${X} = ${n}에서 ${X} = ${x}이다.`,
          facts: { calc: [[`(${n}-${m})/2`, 0]], unseen: [2] }
        });
      }),
      H('hard-perp-sum', '밑변 위의 점에서 두 변에 내린 수선의 길이의 합', '심21', (d) => {
        const [c, area] = d.pick([[12, 48], [10, 40], [10, 30], [12, 54], [8, 24], [9, 36], [15, 90], [12, 60], [10, 45]]), apex = Math.asin(2 * area / (c * c)) / RAD, sum = 2 * area / c;
        const S = scene(fitPts((() => { const P = isoTri(apex); P.P = [d.pick([36, 40, 62, 66]), 0]; P.D = foot(P.P, P.A, P.B); P.E = foot(P.P, P.A, P.C); return P; })(), apex > 60 ? [215, 150] : [170, 170]));
        S.poly('BCA').seg('PD PE').right('PDB PEC').same('ABC ACB', 'dot', 20).len('AB', cm(c), 'C', { t: 0.3 }).names();
        return cmQ(`∠B = ∠C인 △ABC의 변 BC 위의 점 P에서 두 변 AB, AC에 내린 수선의 발을 각각 D, E라 하자. ${nb(`${sg('AB')} = ${c} cm`)}이고 △ABC의 넓이가 ${area} cm²일 때, ${sg('PD')} + ${sg('PE')}의 길이는?`, sum, {
          figure: S.svg(`삼각형 ABC. ∠B와 ∠C에 크기가 같다는 표시가 있다. 점 P는 변 BC 위에 있고 점 D는 변 AB 위에, 점 E는 변 AC 위에 있다. 선분 PD, PE가 그어져 있고 ∠PDB와 ∠PEC에 직각 표시가 있다. 변 AB의 길이는 ${c} cm`),
          explain: `∠B = ∠C이므로 ${eq('AC', 'AB')} = ${c} cm이다. 선분 AP를 그으면 △ABC의 넓이는 △ABP와 △APC의 넓이의 합이므로 ${HALF} × ${c} × ${sg('PD')} + ${HALF} × ${c} × ${sg('PE')} = ${area}이다. ${c / 2} × (${sg('PD')} + ${sg('PE')}) = ${area}에서 ${sg('PD')} + ${sg('PE')} = ${sum}(cm)이다.`,
          facts: { calc: [[`${area}*2/${c}`, 0]], unseen: [2] }
        });
      }),
      H('hard-perp-bisector', '빗변의 수직이등분선과 RHS 합동으로 정해지는 각', '기본 ②29', (d) => {
        const r3 = Math.sqrt(3), ask = d.pick([['∠B', 30, 'ABC'], ['∠BAC', 60, 'BAC']]), P0 = { C: [0, 0], B: [-100 * r3, 0], A: [0, -100], E: [-100 / r3, 0] };
        P0.D = mid(P0.A, P0.B);
        const S = scene(fitPts(P0, [235, 136]));
        S.poly('BCA').seg('DE AE').right('BCA EDB').tick('AD DB', 2).tick('CE DE').names();
        return degQ(`∠C = 90°인 직각삼각형 ABC에서 빗변 AB의 중점 D를 지나고 변 AB에 수직인 직선이 변 BC와 만나는 점을 E라 하자. ${eq('CE', 'DE')}일 때, ${ask[0]}의 크기는?`, ask[1], {
          figure: S.svg('직각삼각형 ABC. ∠C에 직각 표시가 있다. 점 D는 변 AB 위에 있고 선분 AD와 선분 DB에 길이가 같다는 표시(두 줄)가 있다. 점 E는 변 BC 위에 있고 선분 DE, AE가 그어져 있다. ∠EDB에 직각 표시가 있고 선분 CE와 선분 DE에 길이가 같다는 표시(한 줄)가 있다'),
          explain: `△AED와 △AEC에서 ∠ADE = ∠ACE = 90°, ${sg('AE')}는 공통, ${eq('DE', 'CE')}이므로 △AED ≡ △AEC (RHS 합동)이고 ∠DAE = ∠CAE이다. △EAD와 △EBD에서 ${eq('AD', 'BD')}, ∠ADE = ∠BDE = 90°, ${sg('DE')}는 공통이므로 △EAD ≡ △EBD (SAS 합동)이고 ∠B = ∠DAE이다. ∠B = ∠${X}라 하면 ∠BAC = 2∠${X}이고 ∠${X} + 2∠${X} = 90°이므로 ∠${X} = 30°이다.${ask[1] === 60 ? ' ∠BAC = 60°이다.' : ''}`,
          facts: { calc: [[ask[1] === 30 ? '90/3' : '90/3*2', 0]], unseen: [90, 3, 2] }
        });
      }),
      H('hard-line-area', '직각이등변삼각형과 꼭짓점을 지나는 직선: 삼각형의 넓이', '기본 ①34', (d) => {
        const [p, q] = d.pick([[8, 10], [6, 4], [5, 3], [7, 5], [7, 3], [8, 6], [9, 5], [8, 4], [6, 8], [4, 6]]), area = (p * p + q * q) / 2, S = lineScene(p, q, false);
        S.b.poly([S.P.A, S.P.B, S.P.C], TINT);
        S.len('BD', cm(p), 'A').len('DA', cm(q), 'B').names({ D: 90, A: 90, E: 90 });
        return cm2Q(`${K.LINE_HEAD} ${nb(`${sg('AD')} = ${q} cm`)}, ${nb(`${sg('BD')} = ${p} cm`)}일 때, △ABC의 넓이는?`, area, {
          figure: S.svg(`${K.LINE_SAY}삼각형 ABC가 색칠되어 있다. 선분 AD의 길이는 ${q} cm, 선분 BD의 길이는 ${p} cm`),
          explain: `△ABD ≡ △CAE (RHA 합동)이므로 ${eq('AE', 'BD')} = ${p} cm, ${eq('CE', 'AD')} = ${q} cm이다. 사다리꼴 DBCE의 넓이는 ${HALF} × (${p} + ${q}) × (${q} + ${p}) = ${(p + q) * (p + q) / 2}(cm²)이고 △ABD, △CAE의 넓이는 각각 ${HALF} × ${q} × ${p} = ${p * q / 2}(cm²)이다. △ABC의 넓이는 ${(p + q) * (p + q) / 2} − ${p * q / 2} × 2 = ${area}(cm²)이다.`,
          facts: { calc: [[`(${p}+${q})*(${q}+${p})/2-${q}*${p}/2*2`, 0]], unseen: [2] }
        });
      }),
      H('hard-square-area', '정사각형의 두 꼭짓점에서 내린 수선으로 생긴 삼각형의 넓이', '기본 ②26', (d) => {
        const [p, q] = d.pick([[4, 3], [6, 4], [7, 3], [8, 6], [8, 5], [7, 5], [5, 3], [9, 5]]), area = (p - q) * p / 2, S = squareScene(p, q);
        S.b.poly([S.P.A, S.P.F, S.P.G], TINT);
        S.len('AF', cm(p), 'D', { gap: 3, t: 0.75 }).len('CG', cm(q), 'E', { gap: 3 }).names({ G: 'EC', F: [dirOf(S.P.A, S.P.F), 13] });
        return cm2Q(`정사각형 ABCD의 변 CD 위에 점 E가 있다. 두 꼭짓점 A, C에서 선분 BE에 내린 수선의 발을 각각 F, G라 하자. ${nb(`${sg('AF')} = ${p} cm`)}, ${nb(`${sg('CG')} = ${q} cm`)}일 때, △AFG의 넓이는?`, area, {
          figure: S.svg(`${SQUARE_SAY}삼각형 AFG가 색칠되어 있다. 선분 AF의 길이는 ${p} cm, 선분 CG의 길이는 ${q} cm`),
          explain: `△ABF와 △BCG에서 ∠AFB = ∠BGC = 90°, ${eq('AB', 'BC')}, ∠ABF = 90° − ∠CBG = ∠BCG이므로 △ABF ≡ △BCG (RHA 합동)이다. ${eq('BF', 'CG')} = ${q} cm, ${eq('BG', 'AF')} = ${p} cm이므로 ${sg('FG')} = ${p} − ${q} = ${p - q}(cm)이다. △AFG는 ∠AFG = 90°인 직각삼각형이므로 넓이는 ${HALF} × ${p - q} × ${p} = ${area}(cm²)이다.`,
          facts: { calc: [[`(${p}-${q})*${p}/2`, 0]], unseen: [2] }
        });
      }),
      H('hard-isoright-area', '직각이등변삼각형에서 RHS 합동으로 옮긴 길이와 넓이', '심26 / 기본 ①38', (d) => {
        const k = 2 * d.int(1, 5), area = k * k / 2, S = cutScene(1, 1, Math.SQRT2);
        S.b.poly([S.P.D, S.P.B, S.P.E], TINT);
        S.tick('BC', 1, 0.24).len('EC', cm(k), 'A').names();
        return cm2Q(`∠C = 90°이고 ${eq('AC', 'BC')}인 직각이등변삼각형 ABC의 변 AB 위에 ${eq('AC', 'AD')}가 되도록 점 D를 잡고, 점 D를 지나고 변 AB에 수직인 직선이 변 BC와 만나는 점을 E라 하자. ${nb(`${sg('EC')} = ${k} cm`)}일 때, △DBE의 넓이는?`, area, {
          figure: S.svg(`직각이등변삼각형 ABC. ∠C에 직각 표시가 있고 변 AC, 변 BC, 선분 AD에 길이가 같다는 표시가 있다. 점 D는 변 AB 위에, 점 E는 변 BC 위에 있고 선분 DE와 선분 AE가 그어져 있다. ∠EDB에 직각 표시가 있고 삼각형 DBE가 색칠되어 있다. 선분 EC의 길이는 ${k} cm`),
          explain: `△ADE와 △ACE에서 ∠ADE = ∠ACE = 90°, ${sg('AE')}는 공통, ${eq('AD', 'AC')}이므로 △ADE ≡ △ACE (RHS 합동)이고 ${eq('DE', 'CE')} = ${k} cm이다. △ABC가 직각이등변삼각형이므로 ∠B = 45°이고, △DBE에서 ∠DEB = 45°이므로 ${eq('DB', 'DE')} = ${k} cm이다. △DBE의 넓이는 ${HALF} × ${k} × ${k} = ${area}(cm²)이다.`,
          facts: { calc: [[`${k}*${k}/2`, 0]], unseen: [2] }
        });
      }),
      H('hard-split-area', '넓이를 둘로 나누어 구하는 수선의 길이', '기본 ②35 ①41', (d) => {
        const [a, b, c] = d.pick([[6, 8, 10], [4, 3, 5], [3, 4, 5], [12, 5, 13], [5, 12, 13], [15, 8, 17], [8, 15, 17], [24, 7, 25], [12, 16, 20]]), P0 = { C: [0, 0], B: [-a, 0], A: [0, -b], D: [-a * b / (b + c), 0] };
        P0.E = foot(P0.D, P0.A, P0.B);
        const S = scene(fitPts(P0, b / a > 1 ? [150, 170] : [215, 150])), g = K.gcd(a * b, b + c);
        S.poly('BCA').seg('AD DE').right('BCA DEB').tick('CD DE').len('CA', cm(b), 'B').dim('BC', cm(a), 'A', 24).dim('AB', cm(c), 'C', 24).names();
        return fracQ(`∠C = 90°인 직각삼각형 ABC의 변 BC 위의 점 D에서 변 AB에 내린 수선의 발을 E라 하자. ${eq('CD', 'DE')}이고 ${nb(`${sg('AB')} = ${c} cm`)}, ${nb(`${sg('BC')} = ${a} cm`)}, ${nb(`${sg('CA')} = ${b} cm`)}일 때, ${sg('DE')}의 길이는?`, a * b, b + c, 'cm', {
          figure: S.svg(`직각삼각형 ABC. ∠C에 직각 표시가 있다. 점 D는 변 BC 위에, 점 E는 변 AB 위에 있고 선분 AD와 선분 DE가 그어져 있다. ∠DEB에 직각 표시가 있고 선분 CD와 선분 DE에 길이가 같다는 표시가 있다. 변 AB의 길이는 ${c} cm, 변 BC의 길이는 ${a} cm, 변 CA의 길이는 ${b} cm`),
          explain: `${sg('DE')} = ${sg('CD')} = ${X} cm라 하자. △ABC의 넓이는 △ABD와 △ADC의 넓이의 합이므로 ${HALF} × ${a} × ${b} = ${HALF} × ${c} × ${X} + ${HALF} × ${b} × ${X}이다. ${a * b} = ${b + c}${X}에서 ${X} = ${B.kit.frac(a * b / g, (b + c) / g)}이다.`,
          facts: { value: `${a}*${b}/(${c}+${b})` }
        });
      }),
      H('hard-circum-extend', '외심과 꼭짓점을 이은 선분의 연장선이 맞은편 변과 만날 때의 각', '기본 ②49', (d) => {
        const draw = (w) => { const P = circPts(90 - w.t, 90 - w.u / 2); P.D = meet(P.A, P.O, P.B, P.C); return scene(P).poly('BCA').seg('AD OC').dot('O').ang('DOC', deg(w.u), { r: 12 }).ang('OCD', deg(w.t)).ang('ABC', sv('x')).names({ O: [180, 11] }); };
        const v = d.until(() => ({ t: d.int(24, 36), u: 2 * d.int(30, 40) }), (w) => { const A = 90 - w.t, Bv = 90 - w.u / 2, Cv = w.t + w.u / 2; return Cv <= 80 && Math.abs(A - Bv) >= 5 && Math.abs(Bv - Cv) >= 5 && !draw(w).clash(); }), x = 90 - v.u / 2, S = draw(v);
        return degQ(`점 O는 △ABC의 외심이다. 선분 AO의 연장선이 변 BC와 만나는 점을 D라 하자. ∠DOC = ${v.u}°, ∠OCD = ${v.t}°일 때, ∠ABC의 크기는?`, x, {
          figure: S.svg(`삼각형 ABC와 그 내부의 점 O. 선분 AD가 점 O를 지나 변 BC 위의 점 D까지 그어져 있고 선분 OC가 그어져 있다. ∠DOC = ${v.u}°, ∠OCD = ${v.t}°, ∠ABC = x`),
          explain: `선분 OB를 그으면 ${nb(`${sg('OA')} = ${sg('OB')} = ${sg('OC')}`)}이다. △OBC에서 ∠OBC = ∠OCB = ${v.t}°이므로 ∠BOC = 180° − ${v.t}° × 2 = ${180 - 2 * v.t}°이고 ∠BOD = ${180 - 2 * v.t}° − ${v.u}° = ${180 - 2 * v.t - v.u}°이다. ∠BOD는 △OAB의 외각이고 ∠OAB = ∠OBA이므로 ∠OBA = ${180 - 2 * v.t - v.u}° ÷ 2 = ${90 - v.t - v.u / 2}°이다. ∠ABC = ${90 - v.t - v.u / 2}° + ${v.t}° = ${x}°이다.`,
          facts: { calc: [[`(180-${v.t}*2-${v.u})/2+${v.t}`, 0]], unseen: [180, 2] }
        });
      }, { standard: CEN }),
      H('hard-circum-height', '직각삼각형의 외심과 수선: 넓이를 두 가지로 나타내기', '기본 ①59', (d) => {
        const [m, n, h] = d.pick([[4, 16, 8], [2, 8, 4], [3, 27, 9], [8, 32, 16], [2, 18, 6], [6, 24, 12], [4, 36, 12]]), R = (m + n) / 2, od = R - m, P0 = { A: [0, 0], B: [m + n, 0], D: [m, 0], C: [m, -h], O: [R, 0] };
        P0.E = foot(P0.D, P0.O, P0.C);
        const S = scene(fitPts(P0, [205, 120])), g = K.gcd(od * h, R);
        S.poly('ABC').seg('CD OC DE').right('ACB CDB DEC').dot('O').dim('AD', cm(m), 'C', 24).dim('DB', cm(n), 'C', 24).names({ A: 270, D: 270, O: 270 });
        S.dim('CD', cm(h), 'B', dist(S.P.A, S.P.D) + 14);
        return fracQ(`∠C = 90°인 직각삼각형 ABC에서 점 O는 △ABC의 외심이다. 꼭짓점 C에서 변 AB에 내린 수선의 발을 D, 점 D에서 선분 OC에 내린 수선의 발을 E라 하자. ${nb(`${sg('AD')} = ${m} cm`)}, ${nb(`${sg('DB')} = ${n} cm`)}, ${nb(`${sg('CD')} = ${h} cm`)}일 때, ${sg('DE')}의 길이는?`, od * h, R, 'cm', {
          figure: S.svg(`직각삼각형 ABC. 변 AB가 아래쪽에 가로로 놓여 있고 ∠C에 직각 표시가 있다. 변 AB 위에 점 A, D, O, B가 이 차례로 놓여 있고 선분 CD, OC가 그어져 있다. 선분 CD의 길이는 삼각형의 왼쪽에 치수선으로 적혀 있다. 점 E는 선분 OC 위에 있고 선분 DE가 그어져 있다. ∠CDB와 ∠DEC에 직각 표시가 있다. 선분 AD의 길이는 ${m} cm, 선분 DB의 길이는 ${n} cm, 선분 CD의 길이는 ${h} cm`),
          explain: `${sg('AB')} = ${m} + ${n} = ${m + n}(cm)이고 직각삼각형의 외심은 빗변의 중점이므로 ${nb(`${sg('OA')} = ${sg('OC')}`)} = ${R} cm, ${sg('OD')} = ${R} − ${m} = ${od}(cm)이다. △OCD의 넓이를 두 가지로 나타내면 ${HALF} × ${sg('OD')} × ${sg('CD')} = ${HALF} × ${sg('OC')} × ${sg('DE')}이므로 ${od} × ${h} = ${R} × ${sg('DE')}이다. ${sg('DE')} = ${B.kit.frac(od * h / g, R / g)} cm이다.`,
          facts: { value: `((${m}+${n})/2-${m})*${h}/((${m}+${n})/2)`, unseen: [2] }
        });
      }, { standard: CEN }),
      H('hard-in-sum', '내심을 지나는 두 선분이 맞은편 변과 이루는 각의 크기의 합', '심47 / 기본 ②59', (d) => {
        const v = d.until(() => { const b = 2 * d.int(26, 38), a = d.int(48, 72); return { b, a, c: 180 - a - b }; }, (w) => w.c >= 44 && w.c <= 74 && Math.abs(w.a - w.c) >= 6), sum = 90 + 3 * v.b / 2;
        const S = scene(inPts(v.b, v.c, { more: (P) => ({ D: meet(P.A, P.I, P.B, P.C), E: meet(P.C, P.I, P.A, P.B) }) }));
        S.poly('BCA').seg('AD CE').dot('I').ang('ABC', deg(v.b)).ang('AEC', sv('x'), { square: false }).ang('ADC', sv('y'), { square: false }).names({ I: [0, 12] });
        return degQ(`점 I는 △ABC의 내심이다. 선분 AI, CI의 연장선이 두 변 BC, AB와 만나는 점을 각각 D, E라 하자. ∠B = ${v.b}°일 때, ∠AEC + ∠ADC의 크기는?`, sum, {
          figure: S.svg(`삼각형 ABC와 그 내부의 점 I. 선분 AD가 점 I를 지나 변 BC 위의 점 D까지, 선분 CE가 점 I를 지나 변 AB 위의 점 E까지 그어져 있다. ∠B = ${v.b}°, ∠AEC = x, ∠ADC = y`),
          explain: `∠AEC는 △EBC의 외각이므로 ∠B + ∠ECB이고, ∠ADC는 △ABD의 외각이므로 ∠B + ∠BAD이다. 점 I가 내심이므로 ∠ECB + ∠BAD = (∠C + ∠A) ÷ 2 = (180° − ${v.b}°) ÷ 2 = ${90 - v.b / 2}°이다. ∠AEC + ∠ADC = ${v.b}° × 2 + ${90 - v.b / 2}° = ${sum}°이다.`,
          facts: { calc: [[`${v.b}*2+(180-${v.b})/2`, 0]], unseen: [2, 180] }
        });
      }, { standard: CEN }),
      H('hard-incircle-quad', '직각삼각형의 내접원과 접점이 만드는 사각형의 넓이', '기본 ①74 ②67', (d) => {
        const [a, b, c] = d.pick([[12, 5, 13], [8, 6, 10], [15, 8, 17], [5, 12, 13], [8, 15, 17], [12, 9, 15]]), r = (a + b - c) / 2, area = r * (a - r), P = rtIn(a, b, c), Q = { A: P.A, B: P.B, C: P.C, I: P.I, D: P.D, E: P.E }, S = scene(Q);
        S.b.poly([Q.D, Q.B, Q.E, Q.I], TINT).disk(P.I, P.r);
        S.poly('BCA').seg('ID IE').right('BCA IDB IEB').dot('I').len('CA', cm(b), 'B'); sideLen(S, 'AB', 'D', cm(c), 'C'); sideLen(S, 'BC', 'E', cm(a), 'A'); S.names({ I: [70, 11] });
        return cm2Q(`점 I는 ∠C = 90°인 직각삼각형 ABC의 내심이고, 내접원이 두 변 AB, BC에 접하는 점을 각각 D, E라 하자. ${nb(`${sg('AB')} = ${c} cm`)}, ${nb(`${sg('BC')} = ${a} cm`)}, ${nb(`${sg('CA')} = ${b} cm`)}일 때, 사각형 DBEI의 넓이는?`, area, {
          figure: S.svg(`직각삼각형 ABC와 그 내접원. ∠C에 직각 표시가 있고 내접원의 중심은 I이다. 내접원이 변 AB에 접하는 점이 D, 변 BC에 접하는 점이 E이고 선분 ID, IE에 직각 표시가 있다. 사각형 DBEI가 색칠되어 있다. 변 AB의 길이는 ${c} cm, 변 BC의 길이는 ${a} cm, 변 CA의 길이는 ${b} cm`),
          explain: `△ABC의 넓이는 ${HALF} × ${a} × ${b} = ${a * b / 2}(cm²)이다. 내접원의 반지름의 길이를 ${B.kit.mid.V('r')} cm라 하면 ${HALF} × ${B.kit.mid.V('r')} × (${c} + ${a} + ${b}) = ${a * b / 2}에서 ${B.kit.mid.V('r')} = ${r}이다. 내접원이 변 CA에 접하는 점을 F라 하면 사각형 IECF는 한 변의 길이가 ${r} cm인 정사각형이므로 ${sg('CE')} = ${r} cm, ${sg('BE')} = ${a} − ${r} = ${a - r}(cm)이다. △IBD ≡ △IBE이므로 사각형 DBEI의 넓이는 ${HALF} × ${a - r} × ${r} × 2 = ${area}(cm²)이다.`,
          facts: { calc: [[`(${a}-${a}*${b}/(${c}+${a}+${b}))*(${a}*${b}/(${c}+${a}+${b}))`, 0]] }
        });
      }, { standard: CEN }),
      H('hard-tangent-area', '빗변의 길이와 내접원의 반지름으로 직각삼각형의 넓이 구하기', '심55 / 기본 ①74', (d) => {
        // 원문의 수(빗변 15, 반지름 4)로는 직각삼각형이 그려지지 않는다. 그려지는 수만 쓴다.
        const [a, b, c] = d.pick([[8, 6, 10], [15, 8, 17], [12, 9, 15], [16, 12, 20], [20, 15, 25], [24, 18, 30]]), r = (a + b - c) / 2, area = r * (r + c), P = rtIn(a, b, c), S = incircleScene(P);
        S.right('BCA').len('IE', cm(r), 'B', { gap: 3 }); sideLen(S, 'AB', 'D', cm(c), 'C'); S.names({ I: [150, 11] });
        return cm2Q(`∠C = 90°인 직각삼각형 ABC의 내접원이 세 변 AB, BC, CA에 접하는 점을 각각 D, E, F라 하고 내접원의 중심을 I라 하자. ${nb(`${sg('AB')} = ${c} cm`)}, ${nb(`${sg('IE')} = ${r} cm`)}일 때, △ABC의 넓이는?`, area, {
          figure: S.svg(`직각삼각형 ABC와 그 내접원. ∠C에 직각 표시가 있고 내접원의 중심은 I이다. 내접원이 변 AB, BC, CA에 접하는 점이 각각 D, E, F이고 선분 ID, IE, IF에 직각 표시가 있다. 변 AB의 길이는 ${c} cm, 선분 IE의 길이는 ${r} cm`),
          explain: `사각형 IECF는 한 변의 길이가 ${r} cm인 정사각형이므로 ${eq('CE', 'CF')} = ${r} cm이다. ${eq('AF', 'AD')}, ${eq('BE', 'BD')}이므로 ${sg('AF')} + ${sg('BE')} = ${sg('AD')} + ${sg('BD')} = ${sg('AB')} = ${c} cm이다. △ABC의 둘레의 길이는 ${c} + (${sg('BE')} + ${r}) + (${sg('AF')} + ${r}) = ${c} + ${c} + ${2 * r} = ${2 * (c + r)}(cm)이므로 넓이는 ${HALF} × ${r} × ${2 * (c + r)} = ${area}(cm²)이다.`,
          facts: { calc: [[`${r}*(${c}+${c}+${r}+${r})/2`, 0]], unseen: [2] }
        });
      }, { standard: CEN }),
      H('hard-two-circles', '직각삼각형의 외접원과 내접원의 넓이의 차', '기본 ②71 / 심60', (d) => {
        const [a, b, c] = d.pick([[8, 6, 10], [16, 12, 20], [24, 10, 26], [6, 8, 10], [12, 16, 20], [10, 24, 26], [24, 18, 30], [18, 24, 30]]), R = c / 2, r = (a + b - c) / 2, k = R * R - r * r, T0 = sssTri(a, b, c), O = mid(T0.A, T0.B);
        const P = fitPts(Object.assign(T0, { o: O, i: inOf(T0.A, T0.B, T0.C), n: [O[0], O[1] - R], s: [O[0], O[1] + R], w: [O[0] - R, O[1]], e: [O[0] + R, O[1]] }), [188, 188]), S = scene(P);
        S.b.disk(P.o, dist(P.o, P.A), TINT).disk(P.i, dist(P.i, foot(P.i, P.B, P.C)), 'fill:#fff');
        S.poly('BCA').right('BCA').len('AB', cm(c), 'C', { gap: 3 }).dim('BC', cm(a), 'A', (R - b / 2) * P.k + 8).dim('CA', cm(b), 'B', (R - a / 2) * P.k + 8).names();
        return piQ(`∠C = 90°인 직각삼각형 ABC에서 ${nb(`${sg('AB')} = ${c} cm`)}, ${nb(`${sg('BC')} = ${a} cm`)}, ${nb(`${sg('CA')} = ${b} cm`)}이다. △ABC의 외접원의 넓이에서 내접원의 넓이를 뺀 값은?`, k, 'cm²', {
          figure: S.svg(`직각삼각형 ABC와 그 외접원, 내접원. ∠C에 직각 표시가 있다. 외접원에서 내접원을 뺀 부분이 색칠되어 있다. 변 BC와 변 CA의 길이는 원 밖의 치수선으로 적혀 있다. 변 AB의 길이는 ${c} cm, 변 BC의 길이는 ${a} cm, 변 CA의 길이는 ${b} cm`),
          explain: `직각삼각형의 외심은 빗변의 중점이므로 외접원의 반지름의 길이는 ${c} ÷ 2 = ${R}(cm)이다. △ABC의 넓이는 ${HALF} × ${a} × ${b} = ${a * b / 2}(cm²)이므로 내접원의 반지름의 길이를 ${B.kit.mid.V('r')} cm라 하면 ${HALF} × ${B.kit.mid.V('r')} × (${c} + ${a} + ${b}) = ${a * b / 2}에서 ${B.kit.mid.V('r')} = ${r}이다. 넓이의 차는 ${R * R}π − ${r * r}π = ${k}π(cm²)이다.`,
          facts: { calc: [[`(${c}/2)*(${c}/2)-(${a}*${b}/(${c}+${a}+${b}))*(${a}*${b}/(${c}+${a}+${b}))`, 0]], unseen: [2] }
        });
      }, { standard: CEN }),
      H('hard-o-to-tangent', '직각삼각형의 외심과 내접원의 접점 사이의 거리', '심61', (d) => {
        const [a, b, c] = d.pick([[12, 5, 13], [5, 12, 13], [8, 15, 17], [15, 8, 17], [4, 3, 5], [3, 4, 5]]), ad = (b + c - a) / 2, num = Math.abs(b - a), P = rtIn(a, b, c);
        P.O = mid(P.A, P.B);
        const S = incircleScene(P);
        S.right('BCA').dot('O').len('CA', cm(b), 'B', { t: dist(P.C, P.F) / dist(P.C, P.A) < 0.5 ? 0.76 : 0.24 }); sideLen(S, 'AB', 'D', cm(c), 'C'); sideLen(S, 'BC', 'E', cm(a), 'A'); S.names({ I: [150, 11] });
        return fracQ(`∠C = 90°인 직각삼각형 ABC에서 점 O는 외심이고, 내접원이 변 AB에 접하는 점을 D라 하자. ${nb(`${sg('AB')} = ${c} cm`)}, ${nb(`${sg('BC')} = ${a} cm`)}, ${nb(`${sg('CA')} = ${b} cm`)}일 때, ${sg('OD')}의 길이는?`, num, 2, 'cm', {
          figure: S.svg(`직각삼각형 ABC와 그 내접원. ∠C에 직각 표시가 있고 내접원의 중심은 I이다. 내접원이 변 AB, BC, CA에 접하는 점이 각각 D, E, F이고 선분 ID, IE, IF에 직각 표시가 있다. 점 O는 변 AB 위에 있다. 변 AB의 길이는 ${c} cm, 변 BC의 길이는 ${a} cm, 변 CA의 길이는 ${b} cm`),
          explain: `내접원이 두 변 BC, CA에 접하는 점을 각각 E, F라 하자. ${sg('AD')} = ${sg('AF')} = ${X} cm라 하면 ${sg('BE')} = ${sg('BD')} = (${c} − ${X}) cm, ${sg('CE')} = ${sg('CF')} = (${b} − ${X}) cm이다. ${sg('BC')} = (${c} − ${X}) + (${b} − ${X}) = ${a}에서 ${X} = ${ad}이다. 직각삼각형의 외심은 빗변의 중점이므로 ${sg('AO')} = ${B.kit.frac(c, 2)} cm이다. ${sg('OD')} = ${a > b ? `${B.kit.frac(c, 2)} − ${ad}` : `${ad} − ${B.kit.frac(c, 2)}`} = ${B.kit.frac(num, 2)}(cm)이다.`,
          facts: { value: a > b ? `${c}/2-(${b}+${c}-${a})/2` : `(${b}+${c}-${a})/2-${c}/2`, unseen: [2] }
        });
      }, { standard: CEN }),
      H('hard-iso-oi', '이등변삼각형의 외심과 내심이 이루는 각', '심57 / 기본 ①77 ②69', (d) => {
        const a = 4 * d.int(6, 10), x = 45 - 3 * a / 4, P0 = isoTri(a);
        P0.O = circumOf(P0.A, P0.B, P0.C); P0.I = inOf(P0.A, P0.B, P0.C);
        const S = scene(fitPts(P0, [150, 200]));
        S.poly('BCA').tick('AB AC', 1, 0.55).seg('OB OC IB IC').dot('OI').ang('BAC', deg(a)).ang('OBI', sv('x'), { r: 40, d: 52 }).names({ I: [270, 11] });
        return degQ(`${eq('AB', 'AC')}인 이등변삼각형 ABC에서 두 점 O, I는 각각 △ABC의 외심, 내심이다. ∠A = ${a}°일 때, ∠OBI의 크기는?`, x, {
          figure: S.svg(`${ISO_SAY}삼각형의 내부에 두 점 O, I가 있고 점 O가 점 I보다 위에 있다. 선분 OB, OC와 선분 IB, IC가 그어져 있다. ∠A = ${a}°, ∠OBI = x`),
          explain: `${eq('AB', 'AC')}이므로 ∠ABC = (180° − ${a}°) ÷ 2 = ${90 - a / 2}°이다. 점 I가 내심이므로 ∠IBC = ${90 - a / 2}° ÷ 2 = ${45 - a / 4}°이다. 점 O가 외심이므로 ∠BOC = 2∠A = ${2 * a}°이고 ${eq('OB', 'OC')}이므로 ∠OBC = (180° − ${2 * a}°) ÷ 2 = ${90 - a}°이다. ∠OBI = ${90 - a}° − ${45 - a / 4}° = ${x}°이다.`,
          facts: { calc: [[`(180-2*${a})/2-(180-${a})/2/2`, 0]], unseen: [180, 2] }
        });
      }, { standard: CEN }),

      // ── 다시 실은 꼴(2026-10-13) ──
      // 처음 지을 때 「금·꼬임·보조선 여럿·답이 식·중1 셈이 주가 된다·그림을 모른다」는 까닭으로 뺐던 꼴을 다시 따져 실었다(꼴마다의 판정은 대조표에 있다).
      // 모두 이 단원과 앞 단원·앞 학년의 내용만으로 풀린다: 접선과 반지름이 수직인 것은 이 단원(내심)에서, 호의 길이와 중심각은 중1에서, 연립방정식은 중2 1학기에 배운다.
      H('hard-chain-five', '이웃한 이등변삼각형 다섯 겹', '심9', (d) => {
        const ask = d.pick([['∠C', 20], ['∠B', 80]]), c = (v) => Math.cos(v * RAD), L = 1 / (2 * Math.sin(10 * RAD));
        const S = scene(fitPts({ C: [0, 0], F: [1, 0], D: [1 + 2 * c(40), 0], B: [L, 0], E: at([0, 0], 2 * c(20), 20), A: at([0, 0], L, 20) }, [256, 100]));
        S.poly('CBA').seg('FE ED DA').tick('CF FE ED DA AB').names();
        return degQ(`${eq('CA', 'CB')}인 이등변삼각형 ABC에서 변 CB 위의 두 점 F, D와 변 CA 위의 점 E에 대하여 ${nb(`${sg('AB')} = ${sg('AD')} = ${sg('DE')} = ${sg('EF')} = ${sg('FC')}`)}일 때, ${ask[0]}의 크기는?`, ask[1], {
          figure: S.svg('삼각형 ABC. 꼭짓점 C가 왼쪽에 있고 변 CB가 아래쪽에 가로로 놓여 있다. 변 CB 위에 점 C, F, D, B가 이 차례로 놓여 있고 점 E는 변 CA 위에 있다. 선분 FE, ED, DA가 그어져 있고 선분 CF, 선분 FE, 선분 ED, 선분 DA, 변 AB에 길이가 같다는 표시가 있다'),
          explain: `∠C = ∠${X}라 하자. ${eq('FC', 'FE')}이므로 ∠FEC = ∠${X}이고 ∠EFD = 2∠${X}(△FCE의 외각)이다. ${eq('EF', 'ED')}이므로 ∠EDF = 2∠${X}이고 ∠DEA = ∠${X} + 2∠${X} = 3∠${X}(△ECD의 외각)이다. ${eq('DE', 'DA')}이므로 ∠DAE = 3∠${X}이고 ∠ADB = ∠${X} + 3∠${X} = 4∠${X}(△ACD의 외각)이다. ${eq('AD', 'AB')}이므로 ∠B = 4∠${X}이고, ${eq('CA', 'CB')}이므로 ∠CAB = ∠B = 4∠${X}이다. △ABC에서 ∠${X} + 4∠${X} + 4∠${X} = 180°이므로 ∠${X} = 20°이다.${ask[1] === 80 ? ' ∠B = 4 × 20° = 80°이다.' : ''}`,
          facts: { calc: [[ask[1] === 20 ? '180/9' : '180/9*4', 0]], unseen: [180, 9, 4] }
        });
      }),
      H('hard-inscribed-equi', '이등변삼각형의 세 변 위에 꼭짓점이 있는 정삼각형: 세 각 사이의 관계식', '심15', (d) => {
        // ∠y, ∠z 를 정하면 밑각의 크기가 60° + ∠y − ∠z 로 정해진다. 점 B 를 중심으로 키워 점 F 가 변 CA 위에 오게 한다.
        const build = (w) => {
          const be = 60 + w.y - w.z, T = baseTri(be, be), E1 = [1, 0], D1 = meet(E1, at(E1, 1, 180 - w.y), T.B, T.A), F1 = at(E1, dist(E1, D1), 120 - w.y), F = meet(T.B, F1, T.C, T.A), e = F[0] / F1[0];
          return Object.assign(T, { E: [e, 0], D: [D1[0] * e, D1[1] * e], F });
        };
        // 틀린 보기의 식이 이 그림에서 우연히 맞지 않게 ∠y, ∠z 를 고른다.
        const v = d.until(() => ({ y: d.int(63, 84), z: d.int(46, 76) }), (w) => {
          const be = 60 + w.y - w.z, x = 2 * w.y - w.z;
          if (be < 62 || be > 76 || Math.abs(w.y - w.z) < 6 || x < 62 || x > 104 || Math.abs(w.y - 2 * w.z + 60) < 4) return false;
          const Q = build(w), tD = dist(Q.B, Q.D) / dist(Q.B, Q.A), tF = dist(Q.C, Q.F) / dist(Q.C, Q.A);
          return Q.E[0] > 30 && Q.E[0] < 70 && tD > 0.3 && tD < 0.72 && tF > 0.3 && tF < 0.72;
        });
        const P = fitPts(build(v), [200, 175]), S = scene(P), x = angleAt(P.D, P.A, P.F);
        S.poly('BCA').poly('DEF').tick('AB', 1, dist(P.A, P.D) / dist(P.A, P.B) / 2).tick('AC', 1, dist(P.A, P.F) / dist(P.A, P.C) / 2).tick('DE EF FD', 2).ang('ADF', sv('x')).ang('DEB', sv('y')).ang('EFC', sv('z')).names();
        const rows = d.shuffle([[`2∠${Y} − ∠${Z}`, 2 * v.y - v.z], [`2∠${Z} − ∠${Y}`, 2 * v.z - v.y], [`∠${Y} − ∠${Z} + 60°`, v.y - v.z + 60], [`∠${Y} + ∠${Z} − 60°`, v.y + v.z - 60]]), truth = rows.map((row) => Math.abs(row[1] - x) < 1e-6);
        return C(`${eq('AB', 'AC')}인 이등변삼각형 ABC의 세 변 AB, BC, CA 위에 각각 점 D, E, F가 있고 △DEF는 정삼각형이다. ∠ADF = ∠${X}, ∠DEB = ∠${Y}, ∠EFC = ∠${Z}라 할 때, ∠${X}를 ∠${Y}, ∠${Z}에 대한 식으로 나타낸 것은?`, rows.map((row) => row[0]), truth.indexOf(true), {
          figure: S.svg(`${ISO_SAY}점 D는 변 AB 위에, 점 E는 변 BC 위에, 점 F는 변 CA 위에 있고 삼각형 DEF가 그어져 있다. 삼각형 DEF의 세 변에 길이가 같다는 표시(두 줄)가 있다. ∠ADF = x, ∠DEB = y, ∠EFC = z`),
          explain: `∠DEB + 60° + ∠FEC = 180°이므로 ∠FEC = 120° − ∠${Y}이고, △FEC에서 ∠C = 180° − ∠${Z} − (120° − ∠${Y}) = 60° + ∠${Y} − ∠${Z}이다. 같은 방법으로 ∠BDE = 120° − ∠${X}이고, △DBE에서 ∠B = 180° − ∠${Y} − (120° − ∠${X}) = 60° + ∠${X} − ∠${Y}이다. ${eq('AB', 'AC')}이므로 ∠B = ∠C이고 60° + ∠${X} − ∠${Y} = 60° + ∠${Y} − ∠${Z}에서 ∠${X} = 2∠${Y} − ∠${Z}이다.`,
          facts: { truth, want: true }
        });
      }),
      H('hard-turned-parallel', '삼각형을 돌려 생긴 평행선과 두 이등변삼각형', '심20', (d) => {
        // 점 A 를 중심으로 ∠B 의 크기만큼 돌리면 AB ∥ DE 가 되고 선분 AD, DE 가 변 BC 와 만난다(∠B 가 60°보다 작을 때). ∠B 의 크기는 문제에 주지 않는다.
        const [p, q] = d.pick([[11, 14], [9, 12], [10, 14], [8, 11], [12, 15], [10, 13], [9, 13], [12, 16], [8, 12], [11, 15]]), be = d.int(42, 52), pA = at([0, 0], p, be), pD = at(pA, p, 2 * be + 180);
        const P0 = { B: [0, 0], C: [q, 0], A: pA, D: pD, E: at(pD, q, be) };
        P0.F = meet(pA, pD, P0.B, P0.C); P0.G = meet(pD, P0.E, P0.B, P0.C);
        const S = scene(fitPts(P0, [250, 160]));
        S.poly('BCA').poly('ADE').arrow('BA', 0.42).arrow('DE', 0.72).len('AB', cm(p), 'C').dim('BC', cm(q), 'A', S.P.D[1] - S.P.B[1] + 13).names({ D: [205, 12] });
        return cmQ(`△ADE는 △ABC를 점 A를 중심으로 ${nb(`${sg('AB')} ∥ ${sg('DE')}`)}가 될 때까지 돌린 것이다(두 점 B, C가 옮겨진 점이 각각 D, E이다). 변 BC가 두 선분 AD, DE와 만나는 점을 각각 F, G라 하자. ${nb(`${sg('AB')} = ${p} cm`)}, ${nb(`${sg('BC')} = ${q} cm`)}일 때, ${sg('CG')}의 길이는?`, q - p, {
          figure: S.svg(`삼각형 ABC와 삼각형 ADE. 삼각형 ADE는 삼각형 ABC를 점 A를 중심으로 돌린 것이다. 변 BC가 아래쪽에 가로로 놓여 있고 꼭짓점 A는 변 BC의 위쪽에, 점 D는 변 BC의 아래쪽에 있다. 변 BC 위에 점 B, F, G, C가 이 차례로 놓여 있고 선분 AD는 점 F를, 선분 DE는 점 G를 지난다. 변 AB와 선분 DE에 평행하다는 표시가 있다. 변 AB의 길이는 ${p} cm, 변 BC의 길이는 ${q} cm`),
          explain: `돌린 도형은 처음 도형과 합동이므로 ${eq('AD', 'AB')} = ${p} cm이고 ∠ADE = ∠B이다. ${sg('AB')} ∥ ${sg('DE')}이므로 ∠BAF = ∠ADE(엇각)이고 ∠BAF = ∠B이다. 따라서 △FAB는 ${eq('FA', 'FB')}인 이등변삼각형이다. 또 ∠FGD = ∠B(엇각)이므로 ∠FGD = ∠FDG이고 △FDG는 ${eq('FD', 'FG')}인 이등변삼각형이다. ${sg('BG')} = ${sg('BF')} + ${sg('FG')} = ${sg('AF')} + ${sg('FD')} = ${sg('AD')} = ${p} cm이므로 ${sg('CG')} = ${q} − ${p} = ${q - p}(cm)이다.`,
          facts: { calc: [[`${q}-${p}`, 0]], rule: 'hard-turned' }
        });
      }),
      H('hard-rhs-ratio', 'RHS 합동으로 옮긴 길이가 높이인 삼각형의 넓이와 선분의 길이의 비', '심27', (d) => {
        // 원문의 수(DB = 5, △DCF = 10, 1 : 4)로는 직각삼각형이 그려지지 않는다. 그려지는 수만 쓴다. [DB, CF, AC ÷ CF]
        const [db, cf, k] = d.pick([[3, 4, 3], [4, 5, 3], [4, 4, 4], [5, 6, 3], [5, 4, 5], [6, 5, 4], [6, 4, 5], [6, 7, 3], [6, 6, 4], [7, 6, 4], [8, 7, 4], [8, 6, 5], [8, 8, 4]]), L = k * cf, area = cf * db / 2, cc = cutAngle(L, db), a = L * Math.cos(cc * RAD);
        const P0 = { B: [0, 0], C: [a, 0], A: [0, -L * Math.sin(cc * RAD)], D: [0, -db] };
        P0.E = along(P0.C, P0.A, a); P0.F = along(P0.C, P0.A, cf);
        const P = fitPts(P0, [232, 160]), S = scene(P);
        S.b.poly([P.D, P.C, P.F], TINT);
        S.poly('BCA').seg('DE DC DF').right('ABC DEA').len('DB', cm(db), 'C').names();
        return cmQ(`∠B = 90°인 직각삼각형 ABC의 변 AC 위에 ${eq('BC', 'EC')}가 되도록 점 E를 잡고, 점 E를 지나고 변 AC에 수직인 직선이 변 AB와 만나는 점을 D라 하자. 변 AC 위의 점 F에 대하여 ${nb(`${sg('CF')} : ${sg('AC')} = 1 : ${k}`)}이고 △DCF의 넓이가 ${area} cm², ${nb(`${sg('DB')} = ${db} cm`)}일 때, ${sg('AF')}의 길이는?`, L - cf, {
          figure: S.svg(`직각삼각형 ABC. ∠B에 직각 표시가 있다. 점 D는 변 AB 위에 있고, 변 AC 위에 점 C, F, E, A가 이 차례로 놓여 있다. 선분 DE, DC, DF가 그어져 있고 ∠DEA에 직각 표시가 있다. 삼각형 DCF가 색칠되어 있다. 선분 DB의 길이는 ${db} cm`),
          explain: `△DBC와 △DEC에서 ∠DBC = ∠DEC = 90°, ${sg('DC')}는 공통, ${eq('BC', 'EC')}이므로 △DBC ≡ △DEC (RHS 합동)이고 ${eq('DE', 'DB')} = ${db} cm이다. △DCF에서 변 CF를 밑변으로 보면 높이는 ${sg('DE')}이므로 ${HALF} × ${sg('CF')} × ${db} = ${area}에서 ${sg('CF')} = ${cf} cm이다. ${nb(`${sg('CF')} : ${sg('AC')} = 1 : ${k}`)}이므로 ${sg('AC')} = ${cf} × ${k} = ${L}(cm)이고 ${sg('AF')} = ${L} − ${cf} = ${L - cf}(cm)이다.`,
          facts: { calc: [[`${area}*2/${db}*${k}-${area}*2/${db}`, 0]], unseen: [2] }
        });
      }),
      H('hard-square-bisectors', '정사각형의 두 변 위의 점과 각을 이등분하는 두 선분', '심31', (d) => {
        // 원문 글에는 「□ABCD」뿐이지만 풀이는 정사각형으로 푼다. 정사각형이라고 밝혀 싣는다. [BE, BF, EF]
        const [p, q, h] = d.pick([[3, 4, 5], [4, 3, 5], [6, 8, 10], [8, 6, 10], [5, 12, 13], [12, 5, 13], [9, 12, 15], [12, 9, 15], [8, 15, 17], [15, 8, 17]]), s = (p + q + h) / 2, u = 150 / s;
        const S = scene({ A: [0, 0], B: [0, 150], C: [150, 150], D: [150, 0], E: [0, 150 - p * u], F: [q * u, 150] });
        S.poly('ABCD').seg('DE DF EF').same('AED DEF', 'dot', 22).same('EFD DFC', 'x', 22).len('EB', cm(p), 'C').len('BF', cm(q), 'A').len('EF', cm(h), 'B', { gap: 3 }).names({ F: [295, 12] });
        return cmQ(`정사각형 ABCD의 두 변 AB, BC 위에 각각 점 E, F가 있고 ∠AED = ∠DEF, ∠EFD = ∠DFC이다. ${nb(`${sg('BE')} = ${p} cm`)}, ${nb(`${sg('BF')} = ${q} cm`)}, ${nb(`${sg('EF')} = ${h} cm`)}일 때, 정사각형 ABCD의 한 변의 길이는?`, s, {
          figure: S.svg(`정사각형 ABCD. 꼭짓점 A는 왼쪽 위, B는 왼쪽 아래, C는 오른쪽 아래, D는 오른쪽 위에 있다. 점 E는 변 AB 위에, 점 F는 변 BC 위에 있고 선분 DE, DF, EF가 그어져 있다. ∠AED와 ∠DEF에 크기가 같다는 표시가, ∠EFD와 ∠DFC에 크기가 같다는 표시가 있다. 선분 BE의 길이는 ${p} cm, 선분 BF의 길이는 ${q} cm, 선분 EF의 길이는 ${h} cm`),
          explain: `점 D에서 선분 EF에 내린 수선의 발을 G라 하자. △DAE와 △DGE에서 ∠DAE = ∠DGE = 90°, ${sg('DE')}는 공통, ∠AED = ∠GED이므로 △DAE ≡ △DGE (RHA 합동)이고 ${eq('AE', 'GE')}이다. 같은 방법으로 △DCF ≡ △DGF (RHA 합동)이고 ${eq('CF', 'GF')}이다. ${sg('AE')} = ${V('a')} cm, ${sg('CF')} = ${V('b')} cm라 하면 ${sg('EF')} = ${sg('GE')} + ${sg('GF')}에서 ${V('a')} + ${V('b')} = ${h}이고, ${eq('AB', 'BC')}에서 ${p} + ${V('a')} = ${q} + ${V('b')}이다. 두 식을 연립하여 풀면 ${V('a')} = ${s - p}, ${V('b')} = ${s - q}이므로 한 변의 길이는 ${p} + ${s - p} = ${s}(cm)이다.`,
          facts: { calc: [[`(${p}+${q}+${h})/2`, 0]], unseen: [2] }
        });
      }),
      H('hard-two-altitudes', '두 수선이 만나는 점과 직각이등변삼각형으로 찾는 합동', '심33', (d) => {
        // 직각삼각형이라고 RHA·RHS 부터 대면 막힌다. 길이가 같은 AE, BE 는 빗변이 아니므로 ASA 합동이다.
        const [p, q] = d.pick([[6, 4], [5, 3], [7, 5], [8, 4], [9, 6], [7, 3], [8, 5], [6, 3], [7, 4], [9, 5]]), h = (p + q + Math.sqrt((p + q) * (p + q) + 4 * p * q)) / 2;
        const P0 = { B: [0, 0], C: [p + q, 0], D: [p, 0], A: [p, -h] };
        P0.E = foot(P0.B, P0.A, P0.C); P0.F = meet(P0.A, P0.D, P0.B, P0.E);
        const S = scene(fitPts(P0, [165, 188]));
        S.poly('BCA').seg('AD BE').right('ADB BEC').len('BD', cm(p), 'A', { t: 0.42 }).len('DC', cm(q), 'A', { t: 0.6 });
        angOut(S, 'BAC', deg(45), 22, 24).names();
        return cmQ(`△ABC의 두 꼭짓점 A, B에서 변 BC, AC에 내린 수선의 발을 각각 D, E라 하고, 두 선분 AD, BE가 만나는 점을 F라 하자. ∠BAC = 45°, ${nb(`${sg('BD')} = ${p} cm`)}, ${nb(`${sg('CD')} = ${q} cm`)}일 때, ${sg('AF')}의 길이는?`, p + q, {
          figure: S.svg(`삼각형 ABC. 점 D는 변 BC 위에, 점 E는 변 AC 위에 있고 선분 AD와 선분 BE가 삼각형의 내부의 점 F에서 만난다. ∠ADB와 ∠BEC에 직각 표시가 있다. ∠BAC = 45°(각의 크기는 변 AC의 바깥쪽에 적혀 있다), 선분 BD의 길이는 ${p} cm, 선분 CD의 길이는 ${q} cm`),
          explain: `△ABE에서 ∠AEB = 90°, ∠BAE = 45°이므로 ∠ABE = 45°이고 △ABE는 ${eq('AE', 'BE')}인 직각이등변삼각형이다. △ADC에서 ∠DAC = 90° − ∠C, △BEC에서 ∠EBC = 90° − ∠C이므로 ∠EAF = ∠EBC이다. △AEF와 △BEC에서 ${eq('AE', 'BE')}, ∠AEF = ∠BEC = 90°, ∠EAF = ∠EBC이므로 △AEF ≡ △BEC (ASA 합동)이다. ${sg('AF')} = ${sg('BC')} = ${p} + ${q} = ${p + q}(cm)이다.`,
          facts: { calc: [[`${p}+${q}`, 0]], rule: 'hard-two-altitudes' }
        });
      }),
      H('hard-arc-ratio', '외접원의 호의 길이의 비로 삼각형의 한 내각의 크기 구하기', '심41', (d) => {
        // 호의 길이와 중심각의 정비례는 중1에서 배웠다(7-2-3 central-ratio 는 중심각까지만 묻는다). 여기서는 외접원의 중심이 외심임을 써서 내각까지 간다.
        const [a, bq, c] = d.shuffle(d.pick([[3, 4, 5], [4, 5, 6], [5, 6, 7], [5, 7, 8], [9, 10, 11], [7, 11, 12], [11, 12, 13]])), u = 360 / (a + bq + c), aob = a * u, boc = bq * u, coa = c * u, x = boc / 2, R = 80;
        const P = scaled(onCircle(boc / 2, coa / 2), R / 100), S = scene(P), far = [['A', 'B', aob], ['B', 'C', boc], ['C', 'A', coa]].sort((m, n) => n[2] - m[2])[0];
        S.b.disk(P.O, R);
        S.poly('BCA').dot('O').names({ O: [dirOf(mid(P[far[0]], P[far[1]]), P.O), 12] });
        return degQ(`원 O가 △ABC에 외접한다. 호 AB, 호 BC, 호 CA의 길이의 비가 ${nb(`${a} : ${bq} : ${c}`)}일 때, ∠BAC의 크기는?`, x, {
          figure: S.svg('원 O와 원 위에 세 꼭짓점이 있는 삼각형 ABC. 점 O는 삼각형의 내부에 있다'),
          explain: `호의 길이는 중심각의 크기에 정비례하므로 ∠AOB : ∠BOC : ∠COA = ${a} : ${bq} : ${c}이고 ∠AOB = 360° × ${frac(a, `${a} + ${bq} + ${c}`)} = ${aob}°, ∠COA = 360° × ${frac(c, `${a} + ${bq} + ${c}`)} = ${coa}°이다. 원 O가 △ABC의 외접원이므로 ${nb(`${sg('OA')} = ${sg('OB')} = ${sg('OC')}`)}이고 △OAB, △OCA는 이등변삼각형이다. ∠OAB = (180° − ${aob}°) ÷ 2 = ${90 - aob / 2}°, ∠OAC = (180° − ${coa}°) ÷ 2 = ${90 - coa / 2}°이므로 ∠BAC = ${90 - aob / 2}° + ${90 - coa / 2}° = ${x}°이다.`,
          facts: { calc: [[`(180-360*${a}/(${a}+${bq}+${c}))/2+(180-360*${c}/(${a}+${bq}+${c}))/2`, 0]], unseen: [180, 360, 2] }
        });
      }, { standard: CEN }),
      H('hard-circum-nested', '외심과 두 꼭짓점이 이루는 삼각형의 외심', '심44 / 기본 ①60', (d) => {
        // 원문 글에는 조건이 없지만 두 자료의 풀이가 모두 ∠AOC 를 △OAB 의 외각으로 셈한다(점 O 가 변 BC 위). 그 조건을 글에 밝혀 싣는다.
        // 점 O′ 이 △AOC 의 안쪽에 넉넉히 들어오게 ∠B 는 38° 까지만 쓴다.
        const be = d.int(31, 38), x = 180 - 2 * be, R = 125, co = Math.cos(be * RAD), si = Math.sin(be * RAD);
        const P = { B: [0, 0], C: [2 * R, 0], O: [R, 0], A: [2 * R * co * co, -2 * R * co * si] };
        P.o = circumOf(P.A, P.O, P.C);
        const S = scene(P);
        S.poly('BCA').seg('OA oO oC').dot('Oo').ang('ABC', deg(be)).ang('OoC', sv('x'), { square: false }).names({ O: 270 });
        S.b.name(P.o, 'O′', dirOf(P.o, P.A), 13);
        return degQ(`△ABC의 외심 O가 변 BC 위에 있고, 점 O′은 △AOC의 외심이다. ∠B = ${be}°일 때, ∠OO′C의 크기는?`, x, {
          figure: S.svg(`삼각형 ABC. 점 O는 변 BC 위에 있고 선분 OA가 그어져 있다. 점 O′은 삼각형 AOC의 내부에 있고 선분 O′O, O′C가 그어져 있다. ∠B = ${be}°, ∠OO′C = x`),
          explain: `점 O가 △ABC의 외심이므로 ${nb(`${sg('OA')} = ${sg('OB')} = ${sg('OC')}`)}이다. △OAB에서 ∠OAB = ∠B = ${be}°이므로 ∠AOC = ${be}° + ${be}° = ${2 * be}°(△OAB의 외각)이고, △OAC에서 ∠OAC = (180° − ${2 * be}°) ÷ 2 = ${90 - be}°이다. 점 O′이 △AOC의 외심이므로 선분 O′A를 그으면 △O′AO, △O′OC, △O′CA는 모두 이등변삼각형이고, △AOC의 세 내각의 크기의 합은 2 × (∠O′AO + ∠O′AC + ∠O′OC)이다. ∠O′AO + ∠O′AC = ∠OAC = ${90 - be}°이므로 ∠O′OC = ∠${X}라 하면 2 × (${90 - be}° + ∠${X}) = 180°, ∠${X} = ${be}°이다. △O′OC에서 ∠OO′C = 180° − ${be}° × 2 = ${x}°이다.`,
          facts: { calc: [[`180-${be}*2`, 0]], unseen: [180, 2], rule: 'hard-circum-nested' }
        });
      }, { standard: CEN }),
      H('hard-two-incenters', '이웃한 두 삼각형의 내심을 지나는 두 직선이 만나 이루는 각', '심51', (d) => {
        const draw = (w) => {
          const A = [0, 0], pB = [100, 0], pC = meet(A, at(A, 10, w.e / 2), pB, at(pB, 10, 180 - w.b)), D = [dist(A, pC) / (2 * Math.cos(w.e / 2 * RAD)), 0];
          const P = fitPts({ A, B: pB, C: pC, D, I: inOf(D, pB, pC), i: inOf(A, D, pC), P: inOf(A, pB, pC) }, [244, 150]), S = scene(P);
          S.poly('ABC').seg('CD AP BP').tick('DA').tick('DC', 1, 0.74).dot('IiP').ang('BDC', deg(w.e)).ang('IPi', '', { r: 10, square: false });
          angOut(S, 'CBA', deg(w.b), 30, 17).names({ I: [dirOf(P.B, P.P) - 90, 11], P: 90 });
          S.b.name(P.i, 'I′', dirOf(P.A, P.P) + 90, 12);
          return S;
        };
        // 점 P 가 선분 CD 에서 넉넉히 떨어지게 고른다(∠C 의 이등분선과 선분 CD 사이의 각 90° − ¾∠BDC − ½∠ABC 가 11° 이상).
        const v = d.until(() => ({ b: 2 * d.int(15, 22), e: 4 * d.int(18, 21) }), (w) => 90 - 0.75 * w.e - w.b / 2 >= 11 && !draw(w).clash()), x = 180 - v.b / 2 - v.e / 4, S = draw(v);
        return degQ(`△ABC의 변 AB 위의 점 D에 대하여 ${eq('DA', 'DC')}이고 ∠ABC = ${v.b}°, ∠BDC = ${v.e}°이다. 두 점 I, I′은 각각 △DBC, △ADC의 내심이고, 선분 BI의 연장선과 선분 AI′의 연장선이 만나는 점을 P라 할 때, ∠IPI′의 크기는?`, x, {
          figure: S.svg(`삼각형 ABC. 변 AB가 아래쪽에 가로로 놓여 있고 점 D는 변 AB 위에 있다. 선분 CD가 그어져 있고 선분 DA와 선분 DC에 길이가 같다는 표시가 있다. 점 I는 삼각형 DBC의 내부에, 점 I′은 삼각형 ADC의 내부에 있다. 점 B에서 점 I를 지나 그은 선분과 점 A에서 점 I′을 지나 그은 선분이 점 P에서 만난다. ∠ABC = ${v.b}°(각의 크기는 변 AB의 아래쪽에 적혀 있다), ∠BDC = ${v.e}°이고 ∠IPI′에 각 표시가 있다`),
          explain: `점 I가 △DBC의 내심이므로 ∠IBD = ${v.b}° ÷ 2 = ${v.b / 2}°이다. ${eq('DA', 'DC')}이므로 ∠DAC = ∠DCA이고, ∠BDC는 △ADC의 외각이므로 ∠DAC = ${v.e}° ÷ 2 = ${v.e / 2}°이다. 점 I′이 △ADC의 내심이므로 ∠I′AD = ${v.e / 2}° ÷ 2 = ${v.e / 4}°이다. △ABP에서 ∠IPI′ = ∠APB = 180° − (${v.e / 4}° + ${v.b / 2}°) = ${x}°이다.`,
          facts: { calc: [[`180-(${v.e}/2/2+${v.b}/2)`, 0]], unseen: [180, 2] }
        });
      }, { standard: CEN }),
      H('hard-incircle-arc', '직각삼각형의 내심과 두 꼭짓점을 이은 선분이 내접원에서 자르는 호의 길이', '심54', (d) => {
        // [BC, CA, AB]: ∠A = 90°. 호의 길이 (3r/4)π 를 분수 칸으로 받으므로 내접원의 반지름의 길이 r 가 4의 배수가 아닌 것만 쓴다.
        const [a, b, c] = d.pick([[5, 3, 4], [5, 4, 3], [10, 6, 8], [10, 8, 6], [13, 5, 12], [13, 12, 5], [15, 9, 12], [15, 12, 9], [17, 8, 15], [17, 15, 8], [25, 15, 20], [25, 20, 15], [29, 20, 21], [29, 21, 20]]), r = (b + c - a) / 2, area = b * c / 2, g = K.gcd(3 * r, 4);
        const P = inPtsSides(a, b, c, { size: [228, 150] });
        Object.assign(P, { D: along(P.I, P.B, P.r), E: along(P.I, P.C, P.r) });
        const S = scene(P), aB = dirOf(P.I, P.B), aC = dirOf(P.I, P.C);
        S.b.disk(P.I, P.r).arc(P.I, P.r, aB, aC, 'bold');
        S.poly('BCA').seg('IB IC').right('BAC').dot('IDE').len('AB', cm(c), 'C').len('CA', cm(b), 'B').len('BC', cm(a), 'A').names({ D: [aB + 220, 15.5], E: [aC + 140, 15.5], I: 90 });
        return fracQ(`∠A = 90°인 직각삼각형 ABC의 내심을 I라 하고, 두 선분 IB, IC가 내접원과 만나는 점을 각각 D, E라 하자. ${nb(`${sg('AB')} = ${c} cm`)}, ${nb(`${sg('BC')} = ${a} cm`)}, ${nb(`${sg('CA')} = ${b} cm`)}일 때, 굵게 나타낸 호 DE의 길이는?`, 3 * r, 4, 'π cm', {
          figure: S.svg(`직각삼각형 ABC와 그 내접원. ∠A에 직각 표시가 있고 내접원의 중심은 I이다. 선분 IB가 내접원과 만나는 점이 D, 선분 IC가 내접원과 만나는 점이 E이고, 내접원의 호 가운데 ∠BIC의 안쪽에 있는 호 DE가 굵게 그려져 있다. 변 AB의 길이는 ${c} cm, 변 BC의 길이는 ${a} cm, 변 CA의 길이는 ${b} cm`),
          explain: `△ABC의 넓이는 ${HALF} × ${c} × ${b} = ${area}(cm²)이다. 내접원의 반지름의 길이를 ${V('r')} cm라 하면 ${HALF} × ${V('r')} × (${c} + ${a} + ${b}) = ${area}에서 ${V('r')} = ${r}이다. 점 I가 내심이므로 ∠IBC + ∠ICB = (180° − 90°) ÷ 2 = 45°이고 ∠BIC = 180° − 45° = 135°이다. 호 DE는 반지름의 길이가 ${r} cm이고 중심각의 크기가 135°인 부채꼴의 호이므로 그 길이는 2π × ${r} × ${frac(135, 360)} = ${frac(3 * r / g, 4 / g)}π(cm)이다.`,
          facts: { value: `2*(${c}*${b}/(${c}+${a}+${b}))*(180-(180-90)/2)/360`, unseen: [2, 180, 360] }
        });
      }, { standard: CEN }),
      H('hard-tangent-incenter', '원 밖의 한 점에서 그은 두 접선이 이루는 삼각형의 내심', '심62', (d) => {
        // 접선이 그 접점을 지나는 반지름과 수직이라는 것은 이 단원(삼각형의 내심)에서 배운다. 내심이 원 위에 있음은 이등변삼각형이 되는 조건으로 밝힌다.
        // 내심 I 는 그림에 찍지 않는다(찍으면 원 위에 있는 것이 보여 답이 드러난다).
        const [a, r] = d.pick([[10, 4], [9, 4], [11, 4], [12, 5], [8, 3], [7, 3], [14, 5], [9, 3], [13, 6], [15, 6]]), R = 60, th = Math.acos(r / a) / RAD;
        const P = { O: [0, 0], P: [a * R / r, 0], A: at([0, 0], R, th), B: at([0, 0], R, -th) }, S = scene(P);
        S.b.disk(P.O, R);
        S.seg('PA PB AB').seg('OA OB OP', 'thin').right('OAP OBP').dot('O').len('OA', cm(r), 'B', { gap: 3 }).dim('OP', cm(a), 'A', R + 26).names();
        return cmQ(`원 O 밖의 한 점 P에서 원 O에 그은 두 접선의 접점을 각각 A, B라 하자. 원 O의 반지름의 길이가 ${r} cm이고 ${nb(`${sg('OP')} = ${a} cm`)}일 때, △PAB의 내심 I에 대하여 ${sg('PI')}의 길이는?`, a - r, {
          figure: S.svg(`원 O와 원 밖의 점 P. 점 P에서 원 O에 그은 두 접선이 원과 만나는 점이 A, B이고 선분 PA, PB, AB가 그어져 있다. 반지름 OA, OB와 선분 OP가 가는 선으로 그어져 있고 ∠OAP와 ∠OBP에 직각 표시가 있다. 반지름 OA의 길이는 ${r} cm, 선분 OP의 길이는 ${a} cm`),
          explain: `△PAO와 △PBO에서 ∠PAO = ∠PBO = 90°, ${sg('OP')}는 공통, ${eq('OA', 'OB')}이므로 △PAO ≡ △PBO (RHS 합동)이다. ${eq('PA', 'PB')}이고 ${sg('OP')}는 이등변삼각형 PAB의 꼭지각 ∠APB의 이등분선이므로 내심 I는 선분 OP 위에 있고 ${nb(`${sg('OP')} ⊥ ${sg('AB')}`)}이다. 두 선분 OP, AB가 만나는 점을 Q라 하면 ∠OAI = 90° − ∠PAI이고 △AQI에서 ∠OIA = 90° − ∠IAQ이다. ${sg('AI')}는 ∠PAB의 이등분선이므로 ∠PAI = ∠IAQ이고 ∠OAI = ∠OIA이다. 따라서 △OAI는 ${eq('OI', 'OA')} = ${r} cm인 이등변삼각형이고 ${sg('PI')} = ${a} − ${r} = ${a - r}(cm)이다.`,
          facts: { calc: [[`${a}-${r}`, 0]], rule: 'hard-tangent-incenter' }
        });
      }, { standard: CEN }),
      H('hard-trapezoid-mid', '사다리꼴의 한 변의 중점에서 내린 수선과 삼각형의 넓이', '기본 ①43', (d) => {
        const [u, w, t] = d.pick([[20, 30, 10], [6, 10, 4], [5, 9, 4], [7, 11, 4], [8, 14, 5], [4, 8, 3], [6, 12, 5], [4, 10, 3], [6, 14, 4], [5, 11, 4], [8, 16, 5], [10, 18, 6], [12, 20, 7], [10, 16, 5]]), area = (u + w) * t / 2, xa = (w - u) * d.pick([0.22, 0.3]);
        const P0 = { B: [0, 0], C: [w, 0], A: [xa, -2 * t], D: [xa + u, -2 * t] };
        P0.P = mid(P0.D, P0.C); P0.H = [P0.P[0], 0];
        const P = fitPts(P0, [222, 150]), S = scene(P);
        S.b.poly([P.A, P.B, P.P], TINT);
        S.poly('ABCD').seg('AP BP PH').right('PHC').tick('DP PC').arrow('AD', 0.76).arrow('BC', 0.3).len('AD', cm(u), 'B').dim('BC', cm(w), 'A', 24).len('PH', cm(t), 'C', { gap: 3 }).names();
        return cm2Q(`${nb(`${sg('AD')} ∥ ${sg('BC')}`)}인 사다리꼴 ABCD에서 변 DC의 중점을 P라 하고, 점 P에서 변 BC에 내린 수선의 발을 H라 하자. ${nb(`${sg('AD')} = ${u} cm`)}, ${nb(`${sg('BC')} = ${w} cm`)}, ${nb(`${sg('PH')} = ${t} cm`)}일 때, △ABP의 넓이는?`, area, {
          figure: S.svg(`사다리꼴 ABCD. 변 AD가 위쪽에, 변 BC가 아래쪽에 있고 두 변에 평행하다는 표시가 있다. 점 P는 변 DC 위에 있고 선분 DP와 선분 PC에 길이가 같다는 표시가 있다. 점 H는 변 BC 위에 있고 선분 PH가 그어져 있다. ∠PHC에 직각 표시가 있다. 선분 AP, BP가 그어져 있고 삼각형 ABP가 색칠되어 있다. 변 AD의 길이는 ${u} cm, 변 BC의 길이는 ${w} cm, 선분 PH의 길이는 ${t} cm`),
          explain: `변 AD의 연장선과 선분 HP의 연장선이 만나는 점을 E라 하자. △DPE와 △CPH에서 ∠DEP = ∠CHP = 90°, ${eq('DP', 'CP')}, ∠DPE = ∠CPH(맞꼭지각)이므로 △DPE ≡ △CPH (RHA 합동)이고 ${eq('PE', 'PH')} = ${t} cm이다. 사다리꼴 ABCD의 높이는 ${t} + ${t} = ${2 * t}(cm)이므로 넓이는 ${HALF} × (${u} + ${w}) × ${2 * t} = ${(u + w) * t}(cm²)이다. △APD의 넓이는 ${HALF} × ${u} × ${t} = ${u * t / 2}(cm²), △PBC의 넓이는 ${HALF} × ${w} × ${t} = ${w * t / 2}(cm²)이므로 △ABP의 넓이는 ${(u + w) * t} − ${u * t / 2} − ${w * t / 2} = ${area}(cm²)이다.`,
          facts: { calc: [[`(${u}+${w})*(${t}+${t})/2-${u}*${t}/2-${w}*${t}/2`, 0]], unseen: [2] }
        });
      })
    ]
  });
  // ── 기본 묶음에 덧붙이는 꼴 ──
  // 받으면서 실력에서 기본으로 내린 꼴: 기본에서 하는 일을 다시 묻거나 한 번에 풀리는 것.
  const TB = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 자료(' + ref + ')', make }, more || {});
  B.addTypes('8-2-1', 'iso', [
    TB('iso-rotated', '아래쪽에 나란히 놓인 두 각이 밑각이 아닌 이등변삼각형', '심2 / 기본 ①3', (d, n) => {
      // 함정: 그림에서 아래쪽에 놓인 ∠B, ∠C 를 밑각으로 여기는 아이. 길이가 같은 두 변은 BA, BC 이므로 밑각은 ∠A 와 ∠C 이다.
      if (n === 0) {
        // 잘못 읽어도(∠B = ∠C) 자연수 각이 나오는 비만 쓴다.
        const [a, b0, bv] = d.pick([[2, 1, 36], [1, 2, 90], [2, 5, 100], [5, 2, 30], [7, 4, 40], [4, 7, 84]]), S = scene(fitPts({ B: [0, 0], C: [100, 0], A: at([0, 0], 100, bv) }, [205, 150]));
        S.poly('BCA').tick('BA BC').names();
        return degQ(`△ABC에서 ${eq('BA', 'BC')}이고 ${nb(`∠A : ∠B = ${a} : ${b0}`)}일 때, ∠B의 크기는?`, bv, {
          figure: S.svg('삼각형 ABC. 변 BC가 아래쪽에 가로로 놓여 있고 꼭짓점 A가 위에 있다. 변 BA와 변 BC에 길이가 같다는 표시가 있다'),
          explain: `길이가 같은 두 변이 ${sg('BA')}, ${sg('BC')}이므로 꼭지각은 ∠B이고 밑각은 ∠A와 ∠C이다. ∠C = ∠A이므로 ${nb(`∠A : ∠B : ∠C = ${a} : ${b0} : ${a}`)}이다. ∠B = 180° × ${B.kit.frac(b0, `${a} + ${b0} + ${a}`)} = ${bv}°이다.`,
          facts: { calc: [[`180*${b0}/(${a}+${b0}+${a})`, 0]], unseen: [180] }
        });
      }
      const bq = d.until(() => 2 * d.int(15, 40), (v) => Math.abs(v - 60) >= 6), x = 90 + bq / 2;
      const S = scene(fitPts((() => { const P = { B: [0, 0], C: [100, 0], A: at([0, 0], 100, bq) }; P.D = along(P.C, P.A, dist(P.C, P.A) + 36); return P; })(), [205, 165]));
      S.poly('BCA').seg('AD').tick('BA BC').ang('ABC', deg(bq)).ang('BAD', sv('x'), { square: false }).names();
      return degQ(`△ABC에서 ${eq('BA', 'BC')}이고 변 CA의 연장선 위에 점 D가 있다. ∠B = ${bq}°일 때, ∠BAD의 크기는?`, x, {
        figure: S.svg(`삼각형 ABC. 변 BC가 아래쪽에 가로로 놓여 있고 꼭짓점 A가 위에 있다. 변 BA와 변 BC에 길이가 같다는 표시가 있다. 점 D는 변 CA를 점 A 너머로 늘인 선 위에 있다. ∠B = ${bq}°, ∠BAD = x`),
        explain: `길이가 같은 두 변이 ${sg('BA')}, ${sg('BC')}이므로 꼭지각은 ∠B이고 밑각은 ∠BAC와 ∠C이다. ∠BAC = (180° − ${bq}°) ÷ 2 = ${90 - bq / 2}°이므로 ∠BAD = 180° − ${90 - bq / 2}° = ${x}°이다.`,
        facts: { calc: [[`180-(180-${bq})/2`, 0]], unseen: [180, 2] }
      });
    }, { count: 2 })
  ]);
  B.addTypes('8-2-1', 'both', [
    TB('both-which-center', '그림의 표시를 보고 외심·내심인 점 고르기', '기본 ②38 ①61', (d, n) => {
      // 함정: 중점 표시만 있는 선분(중선), 직각 표시만 있는 선분(높이)을 수직이등분선으로 읽는 아이. 외심과 내심의 표시를 바꿔 아는 아이.
      const [bq, cq] = d.pick([[68, 50], [54, 72], [62, 46], [48, 70], [58, 44]]), T = fitPts(baseTri(bq, cq), [104, 84]);
      const right = n === 0 ? d.pick(['perp', 'vert']) : d.pick(['angle', 'side']);
      const wrongs = n === 0 ? [d.pick(['angle', 'side']), d.pick(['median', 'height']), 'mixed'] : [d.pick(['perp', 'vert']), 'height', d.pick(['median', 'mixed'])];
      const kinds = d.shuffle([right].concat(wrongs)), hit = kinds.indexOf(right), want = n === 0 ? '외심' : '내심';
      const b = gridBoard(kinds.map((kind) => markCell(kind, T)), { pad: 40, shift: 4 });
      return C(`다음 ㉠~㉣은 같은 삼각형의 내부에 점 P를 잡고 선분과 표시를 그려 넣은 것이다. 점 P가 삼각형의 ${want}인 것은?`, SYM.slice(0, 4), hit, {
        figure: b.svg('모양이 같은 삼각형 네 개와 그 내부의 점 P. ' + kinds.map((kind, i) => `${SYM[i]}: ${MARKS[kind].say}`).join('. ')),
        explain: kinds.map((kind, i) => `${SYM[i]}: ${MARKS[kind].why}`).join(' '),
        facts: { truth: kinds.map((kind) => kind === right), want: true, rule: n === 0 ? 'which-o' : 'which-i' }
      });
    }, { count: 2, standard: CEN })
  ]);
  B.addTypes('8-2-1', 'bis', [
    TB('bis-ratio-area', '각의 이등분선으로 나누어진 두 삼각형의 넓이', '심29', (d) => {
      // 원문의 수(AB = 6, AC = 9, 넓이 12)로는 삼각형이 그려지지 않는다. 그려지는 수만 쓴다.
      const [c, b, h] = d.pick([[8, 12, 4], [10, 15, 4], [6, 10, 3], [8, 10, 4], [9, 12, 4], [10, 14, 4], [12, 15, 6], [6, 8, 3]]), apex = Math.asin((b + c) * h / (b * c)), a = Math.sqrt(b * b + c * c - 2 * b * c * Math.cos(apex)), s1 = c * h / 2, s2 = b * h / 2;
      const S = scene(fitPts((() => { const P = sssTri(a, b, c); P.D = mid(P.B, P.C, c / (b + c)); return P; })(), [220, 160]));
      S.poly('BCA').seg('AD').same('BAD DAC', 'dot', 30).len('AB', cm(c), 'C').len('AC', cm(b), 'B').names();
      return cm2Q(`△ABC에서 ∠A의 이등분선이 변 BC와 만나는 점을 D라 하자. ${nb(`${sg('AB')} = ${c} cm`)}, ${nb(`${sg('AC')} = ${b} cm`)}이고 △ABD의 넓이가 ${s1} cm²일 때, △ADC의 넓이는?`, s2, {
        figure: S.svg(`삼각형 ABC. 점 D는 변 BC 위에 있고 선분 AD가 그어져 있다. ∠BAD와 ∠DAC에 크기가 같다는 표시가 있다. 변 AB의 길이는 ${c} cm, 변 AC의 길이는 ${b} cm`),
        explain: `점 D에서 두 변 AB, AC에 내린 수선의 발을 각각 E, F라 하면 각의 이등분선 위의 점에서 그 각의 두 변까지의 거리는 같으므로 ${eq('DE', 'DF')}이다. △ABD의 넓이는 ${HALF} × ${c} × ${sg('DE')} = ${s1}이므로 ${sg('DE')} = ${h} cm이다. △ADC의 넓이는 ${HALF} × ${b} × ${h} = ${s2}(cm²)이다.`,
        facts: { calc: [[`${b}*(${s1}*2/${c})/2`, 0]], unseen: [2] }
      });
    })
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
