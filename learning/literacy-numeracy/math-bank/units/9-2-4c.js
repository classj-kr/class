// 중학교 3학년 2학기 4단원 원주각 — 실력 문항.
// 단원 틀과 원 그림 도구, 싣는 기준, 뺀 것과 까닭은 9-2-4a.js 에 있다. ref: ①n = 기본꼴_1의 n번, 심n = 심화꼴의 n번.
//
// 이 단원에서 아이들이 흔히 잘못 아는 것(실력 ①의 장치는 이 잘못을 가진 아이가 걸리게 만들었다)
//  - 원주각이 보는 호를 잘못 고른다: 작은 호 위의 점에서 본 원주각은 큰 호를 보고(둔각), 접선과 현이 이루는 각은 「그 각의 안쪽에 있는 호」에 대한 원주각과 같다.
//  - 내접사각형의 외각을 이웃한 내각과 같다고 여긴다. 외각은 그 내각의 대각과 같다. 두 원에 걸친 그림에서는 이것을 두 번 쓴다.
//  - 네 점이 한 원 위에 있으려면 원이 그려져 있어야 한다고 여긴다. 같은 쪽에서 한 선분을 같은 각(직각 둘도)으로 바라보면 네 점은 한 원 위에 있다.
//  - 두 원이 접하는 그림에서 한 원의 각을 다른 원으로 옮기지 못한다. 접점에서 그은 공통 접선이 두 원의 접선과 현이 이루는 각을 잇는다.
//  - 반원을 이루는 여러 호의 원주각의 합이 90°라는 것, 길이가 같은 호 사이의 두 현이 평행하다는 것을 그림에서 읽지 못한다.
//
// 실력에는 ① 그림·조건에 함정이 있어 배운 뜻을 정확히 대야 풀리는 문제(hard-semi-three, hard-two-circles-cyc, hard-orthocenter, hard-tangents-xy, hard-tan-parallel,
// hard-inner-circles)와 ② 세 단계 넘게 이어 생각해야 풀리는 문제만 실었다. 수집본 기본 문서에 여러 번 나오는 꼴(원의 안·밖의 두 교점, 내접 오각형, 지름의 연장선과 접선)은
// 단계가 많아도 기본에 두었다(9-2-4a.js·9-2-4b.js).
// 묻는 말: 수나 값은 「~은?/~는?」, 양은 「몇 ~인가?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, N } = B.kit;
  const { nb, rt } = B.kit.mid;
  const { RAD, at, dirOf, dist, mid, meet, sv, Board, awayFrom } = B.kit.mgeo;
  const K = B.kit.m924;
  const { UNIT, S19, retry, sourceOf, X, Y, HALF, sg, deg, gcd, degQ, degs, radQ, radPlusQ, Circ, even, sure, angAt, angOf, reach, foot } = K;
  // 실력 문항. 기본 자료에서만 나온 꼴은 ref 를 '①12'처럼, 심화 자료의 꼴은 '심3'처럼 적는다.
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: sourceOf(ref), make: retry(make) }, more || {});
  // 점 x 를 지나고 방향이 u(단위 벡터)인 직선이 원(중심 o, 반지름 r)과 만나는 다른 한 점(x 는 원 위의 점)
  const second = (x, u, o) => { const t = -2 * ((x[0] - o[0]) * u[0] + (x[1] - o[1]) * u[1]); return [x[0] + t * u[0], x[1] + t * u[1]]; };
  const unit = (p, q) => { const L = dist(p, q); return [(q[0] - p[0]) / L, (q[1] - p[1]) / L]; };
  // 점 c 를 중심으로 점 p 를 a° 돌린 점(화면에서 시계 반대쪽)
  const spinPt = (p, a, c) => at(c, dist(c, p), dirOf(c, p) + a);
  const T_HEAD = '그림에서 직선 AT는 원 O의 접선이고 점 A는 접점이다. ';

  const hard = [
    H('hard-chord-trig', '중심과 원 위의 세 점이 이루는 사각형에서 현의 길이', '①12', (d) => {
      // 현 AB가 중심 O에 가까이(반지름의 0.26배) 지나간다: AB를 가로로 눕히고 원을 크게 그려 O와 AB 사이에 150°를 적을 틈을 낸다.
      const a = d.pick([4, 6, 8, 10, 12]), k = a / 2, flip = d.bool() ? 1 : -1, turn = d.int(-3, 3);
      // 현 AC의 길이 글은 현 AB와 헷갈리지 않게 AC의 바깥쪽(활꼴 안)에 적는다.
      const S = Circ(112).center().on({ C: 90 - flip * 15 + turn, A: 90 + flip * 75 + turn, B: 90 - flip * 75 + turn }).seg('OA OB AC CB AB').ang('ABC', deg(45)).ang('AOB', '150°', { r: 10 });
      S.b.beside(S.P.A, S.P.C, `${a} cm`, S.O, { gap: 3 });
      S.names();
      sure(angOf(S, 'ABC'), 45); sure(angOf(S, 'AOB'), 150);
      return radPlusQ(`그림과 같이 원 O 위의 세 점 A, B, C와 원의 중심 O를 꼭짓점으로 하는 □AOBC에서 ${sg('AC')} = ${a} cm, ∠ABC = 45°, ∠AOB = 150°일 때, ${sg('AB')}의 길이는?`, k, k, 3, 'cm', {
        figure: S.svg(`원 O 위의 세 점 A, B, C와 중심 O로 이루어진 사각형 AOBC. 점 C는 ∠AOB의 안쪽에 있는 호 AB 위에 있고 현 AB가 그어져 있다. 현 AC의 길이는 ${a} cm, ∠ABC = 45°, ∠AOB = 150°`),
        explain: `∠AOC = 2 × 45° = 90°이므로 ∠COB = 150° − 90° = 60°이고 ∠CAB = ${HALF} × 60° = 30°이다. 점 C에서 ${sg('AB')}에 수선 CH를 그으면 ${sg('CH')} = ${HALF} × ${a} = ${k}(cm), ${sg('AH')} = ${k}${rt(3)} cm이다. △CHB는 직각이등변삼각형이므로 ${sg('HB')} = ${k} cm이고 ${sg('AB')} = (${k} + ${k}${rt(3)}) cm이다.`,
        facts: { calc: [[`${a}/2`, 0], [`${a}/2`, 1], ['3', 2]], unseen: [2, 3] }
      });
    }),
    H('hard-semi-three', '반원을 셋으로 나눈 호에 대한 원주각', '①20', (d) => {
      const v = d.until(() => ({ a: d.int(18, 40), b: d.int(18, 40) }), (w) => { const x = 90 - w.a - w.b; return x >= 18 && x <= 40 && new Set([w.a, w.b, x]).size === 3; }), x = 90 - v.a - v.b, turn = d.int(-8, 8);
      const aC = 180 - 2 * x + turn;
      const S = Circ().center().on({ A: 180 + turn, B: turn, C: aC, D: 2 * v.a + turn, E: aC + 180 }).seg('AB AD BC CE DE').ang('BAD', deg(v.a)).ang('CED', deg(v.b)).ang('ABC', sv('x'), { square: false }).names();
      sure(angOf(S, 'BAD'), v.a); sure(angOf(S, 'CED'), v.b); sure(angOf(S, 'ABC'), x);
      return degQ(`그림과 같이 선분 AB는 원 O의 지름이고 세 점 C, D, E는 원 위의 점이다. ∠BAD = ${v.a}°, ∠CED = ${v.b}°일 때, ∠${X}의 크기는?`, x, {
        figure: S.svg(`원 O의 지름 AB. 지름의 위쪽 반원 위에 점 A 쪽부터 C, D가 있고, 점 E는 아래쪽 반원 위에 있다. 현 AD, BC, DE와 선분 CE가 그어져 있고 선분 CE는 점 O를 지난다. ∠BAD = ${v.a}°, ∠CED = ${v.b}°, ∠ABC = x`),
        explain: `∠ABC, ∠CED, ∠BAD는 각각 호 AC, 호 CD, 호 DB에 대한 원주각이다. 세 호를 합하면 반원이고 반원에 대한 원주각은 90°이므로 ∠${X} + ${v.b}° + ${v.a}° = 90°, ∠${X} = ${x}°이다.`,
        facts: { calc: [[`90-${v.a}-${v.b}`, 0]], unseen: [90] }
      });
    }),
    H('hard-three-equal', '길이가 같은 세 호와 원 밖에서 만나는 두 직선', '①30', (d, n) => {
      const turn = d.int(-6, 6);
      if (n === 0) {
        const e = d.until(() => 4 * d.int(7, 11), (v) => { const th = 90 - 3 * v / 2, ph = (360 - th) / 3, aA = 180 + th / 2; return reach(aA + ph, aA, aA + 2 * ph, aA + 3 * ph) <= 2.4; }), th = 90 - 3 * e / 2, ph = (360 - th) / 3, x = th / 2, aA = 180 + th / 2 + turn;
        const S = Circ().on({ A: aA, B: aA + ph, C: aA + 2 * ph, D: aA + 3 * ph });
        S.put({ E: meet(S.P.B, S.P.A, S.P.C, S.P.D) }).seg('EB EC BD').arcTick(aA, aA + ph).arcTick(aA + ph, aA + 2 * ph).arcTick(aA + 2 * ph, aA + 3 * ph).ang('AED', deg(e)).ang('ABD', sv('x'), { square: false }).names();
        sure(angOf(S, 'AED'), e); sure(angOf(S, 'ABD'), x);
        return degQ(`그림과 같이 원 위의 네 점 A, B, C, D에 대하여 호 AB, 호 BC, 호 CD의 길이가 모두 같고, 두 현 BA, CD의 연장선의 교점을 E라 하자. ∠AED = ${e}°일 때, ∠${X}의 크기는?`, x, {
          figure: S.svg(`원 위의 네 점 A, B, C, D. 호 AB, 호 BC, 호 CD에 길이가 같다는 표시가 있다. 현 BA와 현 CD를 늘인 직선이 원 밖의 점 E에서 만나고 현 BD가 그어져 있다. ∠AED = ${e}°, ∠ABD = x`),
          explain: `세 호 AB, BC, CD에 대한 원주각을 ∠a라 하면 호 AD에 대한 원주각은 ∠${X}이고, 원 전체에 대한 원주각의 합은 180°이므로 3∠a + ∠${X} = 180°이다. 현 AC를 그으면 ∠BAC는 △EAC의 외각이므로 ∠a = ${e}° + ∠${X}(∠ACD = ∠${X})이다. 두 식에서 ∠${X} = ${x}°이다.`,
          facts: { calc: [[`(180-3*${e})/4`, 0]], unseen: [180, 3, 4] }
        });
      }
      const e = d.until(() => even(d, 24, 60), (v) => { const ph = 90 - v / 2; return reach(360 - 3 * ph / 2, 360 - ph / 2, 3 * ph / 2, ph / 2) <= 2.4; }), ph = 90 - e / 2, x = 90 + e / 2;
      const S = Circ().on({ B: 360 - ph / 2 + turn, C: ph / 2 + turn, D: 3 * ph / 2 + turn, A: 360 - 3 * ph / 2 + turn });
      S.put({ E: meet(S.P.A, S.P.B, S.P.D, S.P.C) }).seg('EA ED BC').arcTick(360 - 3 * ph / 2 + turn, 360 - ph / 2 + turn).arcTick(360 - ph / 2 + turn, ph / 2 + turn).arcTick(ph / 2 + turn, 3 * ph / 2 + turn).ang('BEC', deg(e)).ang('ABC', sv('x'), { square: false }).names();
      sure(angOf(S, 'BEC'), e); sure(angOf(S, 'ABC'), x);
      return degQ(`그림과 같이 원 위의 네 점 A, B, C, D에 대하여 호 AB, 호 BC, 호 CD의 길이가 모두 같고, 두 현 AB, DC의 연장선의 교점을 E라 하자. ∠BEC = ${e}°일 때, ∠${X}의 크기는?`, x, {
        figure: S.svg(`원 위의 네 점 A, B, C, D. 호 AB, 호 BC, 호 CD에 길이가 같다는 표시가 있다. 현 AB와 현 DC를 늘인 직선이 원 밖의 점 E에서 만나고 현 BC가 그어져 있다. ∠BEC = ${e}°, ∠ABC = x`),
        explain: `세 호에 대한 원주각을 ∠a라 하면 △ABC에서 ∠BAC = ∠BCA = ∠a이므로 ∠${X} = 180° − 2∠a이고, 같은 방법으로 ∠BCD = 180° − 2∠a이다. △EBC에서 ∠EBC = ∠ECB = 2∠a이므로 ${e}° = 180° − 4∠a, ∠a = ${(180 - e) / 4}°이다. ∠${X} = 180° − 2 × ${(180 - e) / 4}° = ${x}°이다.`,
        facts: { calc: [[`180-2*(180-${e})/4`, 0]], unseen: [180, 2, 4] }
      });
    }, { count: 2 }),
    H('hard-equal-parallel', '길이가 같은 두 호 사이의 평행한 두 현', '①32', (d) => {
      const v = d.until(() => ({ u: d.int(50, 68), w: d.int(28, 48), t: d.int(30, 100) }), (q) => { const c = 180 - q.u - q.w + q.t; return q.t <= 2 * q.u - 30 && Math.abs(q.t - q.u) >= 12 && c % 2 === 0 && c >= 70 && c <= 160; }), c = 180 - v.u - v.w + v.t, x = c / 2;
      const S = Circ().center().on({ A: 90 + v.u, B: 90 - v.u, C: 270 - v.w, D: 270 + v.w, E: 90 + v.u - v.t });
      S.put({ P: meet(S.P.A, S.P.B, S.P.D, S.P.E) }).seg('AB CD DE OC OE').arcTick(90 + v.u, 270 - v.w).arcTick(270 + v.w, 450 - v.u).ang('COE', deg(c), { r: 12 }).ang('APE', sv('x'), { square: false }).names();
      sure(angOf(S, 'COE'), c); sure(angOf(S, 'APE'), x);
      return degQ(`그림과 같이 원 O에서 호 AC와 호 BD의 길이가 같고, 현 DE가 현 AB와 점 P에서 만난다. ∠COE = ${c}°일 때, ∠${X}의 크기는?`, x, {
        figure: S.svg(`원 O 위의 다섯 점 A, B, C, D, E. 호 AC와 호 BD에 길이가 같다는 표시가 있다. 현 AB, CD, DE와 반지름 OC, OE가 그어져 있고 현 DE와 현 AB가 점 P에서 만난다. ∠COE = ${c}°, ∠APE = x`),
        explain: `호 AC와 호 BD의 길이가 같으므로 그 원주각 ∠ADC와 ∠BAD의 크기가 같고, 엇각의 크기가 같으므로 ${sg('AB')} ∥ ${sg('CD')}이다. ∠${X} = ∠BPD(맞꼭지각) = ∠CDP(엇각) = ∠CDE이고, ∠CDE는 호 CE에 대한 원주각이므로 ${HALF} × ${c}° = ${x}°이다.`,
        facts: { calc: [[`${c}/2`, 0]], unseen: [2] }
      });
    }),
    H('hard-pentagon-equal', '원에 내접하는 오각형의 같은 두 변과 같은 두 각', '①46', (d) => {
      const a = even(d, 50, 78), x = 3 * a / 2, aA = 160 + d.int(-10, 10);
      const S = Circ().on({ A: aA, B: aA + a, C: aA + 2 * a, D: aA + 3 * a, E: aA + 3 * a + (360 - 3 * a) / 2 }).seg('AB BC CD DE EA AD').tick('AB BC').ang('BAD', deg(a)).ang('CDA', deg(a)).ang('AED', sv('x'), { square: false }).names();
      sure(angOf(S, 'BAD'), a); sure(angOf(S, 'CDA'), a); sure(angOf(S, 'AED'), x);
      return degQ(`그림과 같이 원에 내접하는 오각형 ABCDE에서 ${sg('AB')} = ${sg('BC')}이고 ∠BAD = ∠CDA = ${a}°일 때, ∠${X}의 크기는?`, x, {
        figure: S.svg(`원에 내접하는 오각형 ABCDE와 대각선 AD. 변 AB와 변 BC에 길이가 같다는 표시가 있다. ∠BAD = ${a}°, ∠CDA = ${a}°, ∠AED = x`),
        explain: `∠BAD와 ∠CDA는 각각 호 BCD, 호 CBA에 대한 원주각이고 크기가 같으므로 두 호의 길이가 같고, 호 CD와 호 AB의 길이가 같다. ${sg('AB')} = ${sg('BC')}이므로 호 AB와 호 BC의 길이도 같다. 세 호 AB, BC, CD에 대한 원주각은 각각 ${HALF} × ${a}° = ${a / 2}°이고, ∠AED는 호 ABCD에 대한 원주각이므로 3 × ${a / 2}° = ${x}°이다.`,
        facts: { calc: [[`3*${a}/2`, 0]], unseen: [3, 2] }
      });
    }),
    H('hard-tan-cyc-three', '접선과 내접사각형의 세 각을 잇기', '①58', (d, n) => {
      const turn = d.int(-5, 5);
      if (n === 0) {
        const v = d.until(() => ({ p: d.int(28, 48), q: d.int(40, 70), t: d.int(28, 50) }), (w) => { const y = 180 - w.p - w.q - w.t; return y >= 22 && y <= 56 && new Set([w.p, w.q, w.t, y]).size === 4; });
        const x = v.p + v.q, y = 180 - x - v.t, aC = 270 + turn, aD = aC + 2 * v.t, aA = aD + 2 * v.p, aB = aA + 2 * v.q;
        const S = Circ().center().on({ A: aA, B: aB, C: aC, D: aD });
        S.tangent('C', 70, 50, 'T', '').seg('AB BC CD DA BD').ang('ABD', deg(v.p)).ang('ADB', deg(v.q)).ang('DCT', deg(v.t)).ang('BCD', sv('x'), { square: false }).ang('BDC', sv('y'), { square: false }).names();
        sure(angOf(S, 'ABD'), v.p); sure(angOf(S, 'ADB'), v.q); sure(angOf(S, 'DCT'), v.t); sure(angOf(S, 'BCD'), x); sure(angOf(S, 'BDC'), y);
        return degs(`그림에서 직선 CT는 원 O의 접선이고 점 C는 접점이다. □ABCD가 원 O에 내접하고 ∠ABD = ${v.p}°, ∠ADB = ${v.q}°, ∠DCT = ${v.t}°일 때, ∠${X}, ∠${Y}의 크기를 차례로 구하시오.`, [['∠x', x], ['∠y', y]], {
          figure: S.svg(`원 O에 내접하는 사각형 ABCD와 대각선 BD. 점 C에서의 접선 위에 점 T가 있고 점 D는 점 T 쪽에 있다. ∠ABD = ${v.p}°, ∠ADB = ${v.q}°, ∠DCT = ${v.t}°, ∠BCD = x, ∠BDC = y`),
          explain: `△ABD에서 ∠BAD = 180° − (${v.p}° + ${v.q}°) = ${180 - x}°이므로 대각인 ∠${X} = 180° − ${180 - x}° = ${x}°이다. ∠DBC는 ∠DCT의 안쪽에 있는 호 DC에 대한 원주각이므로 ${v.t}°이다. △BCD에서 ∠${Y} = 180° − (${x}° + ${v.t}°) = ${y}°이다.`,
          facts: { calc: [[`180-(180-${v.p}-${v.q})`, 0], [`180-(${v.p}+${v.q})-${v.t}`, 1]], unseen: [180] }
        });
      }
      const v = d.until(() => ({ b: d.int(30, 46), dd: d.int(60, 80), x: d.int(18, 40) }), (w) => { const e = w.dd + w.b - w.x; return e - w.b >= 18 && e <= 100; }), e = v.dd + v.b - v.x;
      const aA = 270 + turn, aB = aA + 2 * v.b, aC = aB + 2 * (e - v.b), aD = aB + 2 * v.dd;
      const S = Circ().center().on({ A: aA, B: aB, C: aC, D: aD });
      S.tangent('A', 70, 50, 'T', '').seg('AB BC CD DA BD').ang('BAT', deg(v.b)).ang('BAD', deg(v.dd)).ang('ADC', deg(e)).ang('CBD', sv('x'), { square: false }).names();
      sure(angOf(S, 'BAT'), v.b); sure(angOf(S, 'BAD'), v.dd); sure(angOf(S, 'ADC'), e); sure(angOf(S, 'CBD'), v.x);
      return degQ(`${T_HEAD}□ABCD가 원 O에 내접하고 ∠BAT = ${v.b}°, ∠BAD = ${v.dd}°, ∠ADC = ${e}°일 때, ∠${X}의 크기는?`, v.x, {
        figure: S.svg(`원 O에 내접하는 사각형 ABCD와 대각선 BD. 점 A에서의 접선 위에 점 T가 있고 점 B는 점 T 쪽에 있다. ∠BAT = ${v.b}°, ∠BAD = ${v.dd}°, ∠ADC = ${e}°, ∠CBD = x`),
        explain: `∠ADB는 ∠BAT의 안쪽에 있는 호 AB에 대한 원주각이므로 ${v.b}°이고 ∠BDC = ${e}° − ${v.b}° = ${e - v.b}°이다. 대각의 크기의 합은 180°이므로 ∠BCD = 180° − ${v.dd}° = ${180 - v.dd}°이다. △BCD에서 ∠${X} = 180° − (${180 - v.dd}° + ${e - v.b}°) = ${v.x}°이다.`,
        facts: { calc: [[`180-(180-${v.dd})-(${e}-${v.b})`, 0]], unseen: [180] }
      });
    }, { count: 2 }),
    H('hard-tan-diam-more', '지름과 접선, 원 위의 다른 점으로 각을 잇기', '①66', (d, n) => {
      const turn = d.int(-5, 5);
      if (n === 0) {
        const v = d.until(() => ({ s: d.int(24, 44), t: d.int(56, 80) }), (w) => w.s + w.t - 90 >= 10 && w.s + w.t - 90 <= 30), x = v.s + v.t - 90;
        const S = Circ().center().on({ B: 270 + turn, A: 270 - 2 * v.s + turn, D: 90 - 2 * v.s + turn, C: 270 + 2 * v.t + turn });
        S.tangent('B', 70, 70, 'Q', 'P').seg('BA BC AD AC BD').ang('PBA', deg(v.s)).ang('CBQ', deg(v.t)).ang('CAD', sv('x'), { square: false }).names();
        sure(angOf(S, 'PBA'), v.s); sure(angOf(S, 'CBQ'), v.t); sure(angOf(S, 'CAD'), x);
        return degQ(`그림에서 직선 PQ는 원 O의 접선이고 점 B는 접점이다. 선분 AD는 원 O의 지름이고 ∠PBA = ${v.s}°, ∠CBQ = ${v.t}°일 때, ∠${X}의 크기는?`, x, {
          figure: S.svg(`원 O의 지름 AD와 원 위의 두 점 B, C. 점 B에서의 접선 PQ가 그어져 있고 점 A는 점 P 쪽에, 점 C는 점 Q 쪽에 있다. 현 BA, BC, AC, BD가 그어져 있다. ∠PBA = ${v.s}°, ∠CBQ = ${v.t}°, ∠CAD = x`),
          explain: `∠ADB는 ∠PBA의 안쪽에 있는 호 AB에 대한 원주각이므로 ${v.s}°이다. ∠ABD는 반원에 대한 원주각이므로 90°이고 ∠BAD = 90° − ${v.s}° = ${90 - v.s}°이다. ∠DBQ는 그 안쪽에 있는 호 BD에 대한 원주각 ∠BAD와 크기가 같으므로 ${90 - v.s}°이고, ∠DBC = ${v.t}° − ${90 - v.s}° = ${x}°이다. ∠${X} = ∠DBC = ${x}°(호 CD에 대한 원주각)이다.`,
          facts: { calc: [[`${v.t}-(90-${v.s})`, 0]], unseen: [90] }
        });
      }
      const t = d.int(15, 28), x = 3 * t;
      const S = Circ().center().on({ B: 270 + turn, C: 270 + 2 * t + turn, A: 90 + 2 * t + turn, D: 90 - 2 * t + turn });
      S.tangent('B', 70, 50, 'T', '').put({ P: meet(S.P.A, S.P.C, S.P.B, S.P.D) }).seg('AB BC AC BD AD').ang('CBT', deg(t)).ang('APD', sv('x'), { square: false }).names();
      S.b.arrow(S.P.A, S.P.D); S.b.arrow(S.P.B, at(S.P.B, 50, turn));
      sure(angOf(S, 'CBT'), t); sure(angOf(S, 'APD'), x); sure(Math.abs(S.P.A[1] - S.P.D[1]) < 0.01 ? 0 : 1, Math.abs(Math.sin(turn * RAD)) > 0.001 ? 1 : 0);
      return degQ(`그림에서 직선 BT는 원 O의 접선이고 점 B는 접점이다. 선분 AC는 원 O의 지름이고 ${sg('AD')}와 직선 BT는 평행하다. 두 현 AC, BD의 교점을 P라 하자. ∠CBT = ${t}°일 때, ∠${X}의 크기는?`, x, {
        figure: S.svg(`원 O의 지름 AC와 원 위의 두 점 B, D. 점 B에서의 접선 위에 점 T가 있고 현 AD와 접선에 평행하다는 표시가 있다. 현 AB, BC, BD, AD가 그어져 있고 현 BD가 지름 AC와 점 P에서 만난다. ∠CBT = ${t}°, ∠APD = x`),
        explain: `∠BAC는 ∠CBT의 안쪽에 있는 호 BC에 대한 원주각이므로 ${t}°이고, ∠ABC = 90°(반원)이므로 ∠ACB = ${90 - t}°이다. ∠ADB = ∠ACB = ${90 - t}°(호 AB)이고 ${sg('AD')} ∥ BT이므로 ∠DBT = ${90 - t}°(엇각), ∠CBD = ${90 - t}° − ${t}° = ${90 - 2 * t}°이다. ∠CAD = ∠CBD = ${90 - 2 * t}°(호 CD)이므로 △APD에서 ∠${X} = 180° − (${90 - t}° + ${90 - 2 * t}°) = ${x}°이다.`,
        facts: { calc: [[`180-(90-${t})-(90-2*${t})`, 0]], unseen: [180, 90, 2] }
      });
    }, { count: 2 }),
    H('hard-tan-similar', '접선과 현이 이루는 각과 닮음으로 현의 길이 구하기', '①74', (d) => {
      const [dd, h, k, m] = d.pick([[8, 6, 4, 3], [10, 5, 5, 2], [12, 9, 6, 3], [9, 6, 3, 6], [8, 4, 4, 2], [10, 8, 4, 5], [12, 8, 4, 6], [14, 7, 7, 2], [6, 4, 2, 6], [10, 6, 2, 15]]);
      const R = 72, th = Math.asin(2 * h / dd - 1) / RAD, side = d.bool() ? 1 : -1, aA = side > 0 ? th : 180 - th;
      const S = Circ(R).center().on({ A: aA, B: aA + 180, C: 270 });
      const pH = [S.P.A[0], R];
      S.put({ H: pH }).seg('AB AC BC AH').names({ H: 270 });
      S.b.seg([Math.min(pH[0], 0) - 30, R], [Math.max(pH[0], 0) + 30, R]);
      S.right('AHC');
      S.lenText(S.P.A, pH, `${h} cm`);
      sure(dist(S.P.A, pH) / dist(S.P.A, S.P.B), h / dd); sure(angAt(S.P.C, S.P.A, pH), angOf(S, 'ABC'));
      return radQ(`그림에서 직선 HC는 지름의 길이가 ${dd} cm인 원 O의 접선이고 점 C는 접점이다. 지름 AB의 한 끝 점 A에서 직선 HC에 내린 수선의 발을 H라 하자. ${sg('AH')} = ${h} cm일 때, ${sg('AC')}의 길이는?`, k, m, 'cm', {
        figure: S.svg(`원 O의 지름 AB와 원 위의 점 C에서의 접선. 점 A에서 접선에 내린 수선의 발이 H이고 ∠AHC에 직각 표시가 있다. 현 AC, BC가 그어져 있다. 선분 AH의 길이는 ${h} cm`),
        explain: `∠ACH는 그 안쪽에 있는 호 AC에 대한 원주각 ∠ABC와 크기가 같고, ∠AHC = ∠ACB = 90°이므로 △ACH ∽ △ABC(AA 닮음)이다. ${sg('AH')} : ${sg('AC')} = ${sg('AC')} : ${sg('AB')}에서 ${sg('AC')}<sup>2</sup> = ${h} × ${dd} = ${h * dd}이고 ${sg('AC')} = ${k}${rt(m)} cm이다.`,
        facts: { calc: [[`(${dd}*${h}/${m})**0.5`, 0], [`${m}`, 1]], unseen: [m, 0.5] }
      });
    }),
    H('hard-semi-bisect', '반원과 접선, 각의 이등분선', '심3', (d) => {
      const x = even(d, 26, 40), R = 84, e = 135 - x / 2, S = Circ(R, { hide: true });
      const pA = [-R, 0], pB = [R, 0], pP = [R, -2 * R * Math.tan(x * RAD)];
      S.b.arc([0, 0], R, 0, 180); S.b.dot([0, 0]);
      const pC = foot(pB, pA, pP), bis = (dirOf(pP, pA) + dirOf(pP, pB)) / 2, pD = meet(pP, at(pP, 10, bis), pA, pB), pE = meet(pP, pD, pC, pB);
      S.put({ A: pA, B: pB, P: pP, C: pC, D: pD, E: pE, O: [0, 0] }).seg('AB PB PA CB PD').right('PBA').ang('CED', deg(e), { r: 11 }).ang('PAB', sv('x'), { square: false });
      S.b.sym(pP, (dirOf(pP, pA) + bis) / 2, 'dot', 30); S.b.sym(pP, (dirOf(pP, pB) + bis) / 2, 'dot', 30);
      S.names({ O: 270 });
      sure(angOf(S, 'CED'), e); sure(angOf(S, 'PAB'), x); sure(dist(pC, [0, 0]), R);
      return degQ(`그림과 같이 선분 AB는 반원 O의 지름이고 직선 PB는 점 B에서 반원에 접한다. 선분 PA가 반원과 만나는 점을 C, ∠APB의 이등분선이 선분 BC, AB와 만나는 점을 각각 E, D라 하자. ∠CED = ${e}°일 때, ∠${X}의 크기는?`, x, {
        figure: S.svg(`지름이 AB인 반원 O와 점 B에서의 접선 위의 점 P. ∠PBA에 직각 표시가 있다. 선분 PA가 반원과 점 C에서 만나고 현 CB가 그어져 있다. ∠APB를 이등분하는 선분 PD가 현 CB와 점 E에서 만난다. ∠CED = ${e}°, ∠PAB = x`),
        explain: `∠ACB는 반원에 대한 원주각이므로 90°이고 ∠PCE = 90°이다. ∠APD = ∠DPB = ∠a라 하면 ∠CED는 △CEP의 외각이므로 ${e}° = 90° + ∠a, ∠a = ${e - 90}°이다. △PAB에서 ∠PBA = 90°이므로 ∠${X} = 90° − 2 × ${e - 90}° = ${x}°이다.`,
        facts: { calc: [[`90-2*(${e}-90)`, 0]], unseen: [90, 2] }
      });
    }),
    H('hard-equal-arcs-central', '길이가 같은 세 호와 중심각·원주각', '심4', (d) => {
      const v = d.until(() => ({ c1: even(d, 70, 130), e2: d.int(14, 30) }), (w) => { const ph = (360 - w.c1 - 2 * w.e2) / 3; return Number.isInteger(ph) && ph % 2 === 0 && ph >= 50 && ph <= 86; }), ph = (360 - v.c1 - 2 * v.e2) / 3, x = ph / 2;
      const aA = 200 + d.int(-10, 10), on = { A: aA, B: aA + ph, C: aA + 2 * ph, D: aA + 3 * ph, E: aA + 3 * ph + 2 * v.e2 };
      const S = Circ().center().on(on).seg('OA OE CE CD EA EB').arcTick(on.A, on.B).arcTick(on.B, on.C).arcTick(on.C, on.D).ang('AOE', deg(v.c1), { r: 12 }).ang('ECD', deg(v.e2)).ang('AEB', sv('x'), { square: false }).names();
      sure(angOf(S, 'AOE'), v.c1); sure(angOf(S, 'ECD'), v.e2); sure(angOf(S, 'AEB'), x);
      return degQ(`그림과 같이 원 O에서 호 AB, 호 BC, 호 CD의 길이가 모두 같고 ∠AOE = ${v.c1}°, ∠ECD = ${v.e2}°일 때, ∠${X}의 크기는?`, x, {
        figure: S.svg(`원 O 위에 다섯 점 A, B, C, D, E가 이 차례로 있다. 호 AB, 호 BC, 호 CD에 길이가 같다는 표시가 있다. 반지름 OA, OE와 현 CE, CD, EA, EB가 그어져 있다. ∠AOE = ${v.c1}°, ∠ECD = ${v.e2}°, ∠AEB = x`),
        explain: `원 전체에 대한 원주각의 크기의 합은 180°이다. 호 EA에 대한 원주각은 ${HALF} × ${v.c1}° = ${v.c1 / 2}°, 호 DE에 대한 원주각은 ∠ECD = ${v.e2}°이므로 길이가 같은 세 호 AB, BC, CD에 대한 원주각의 합은 180° − ${v.c1 / 2}° − ${v.e2}° = ${3 * x}°이고 ∠${X} = ${3 * x}° ÷ 3 = ${x}°이다.`,
        facts: { calc: [[`(180-${v.c1}/2-${v.e2})/3`, 0]], unseen: [180, 2, 3] }
      });
    }),
    H('hard-ratio-area', '세 내각의 비와 외접원의 반지름으로 삼각형의 넓이 구하기', '심7', (d) => {
      const shape = d.pick([[45, 60, 75], [30, 75, 75]]), angs = d.shuffle(shape), R0 = d.pick([4, 6, 8]), g = angs.reduce((m, v) => gcd(m, v), 0), ratio = angs.map((v) => v / g);
      const [aA, aB, aC] = angs, sA = 270 - aA, sC = 270 + aA, posA = sC + 2 * aB;
      const S = Circ().center().on({ A: posA, B: sA, C: sC }).seg('AB BC CA OA OB OC').names();
      sure(angOf(S, 'BAC'), aA); sure(angOf(S, 'ABC'), aB);
      const rat = shape[0] === 45 ? [3 * R0 * R0 / 4, R0 * R0 / 4] : [R0 * R0 / 2, R0 * R0 / 4];
      const part = (c) => (c === 90 ? `${HALF} × ${R0} × ${R0} = ${R0 * R0 / 2}` : c === 120 || c === 60 ? `${HALF} × ${R0} × ${R0 / 2}${rt(3)} = ${R0 * R0 / 4}${rt(3)}` : `${HALF} × ${R0} × ${R0 / 2} = ${R0 * R0 / 4}`);
      return radPlusQ(`그림과 같이 원 O는 △ABC의 외접원이다. ∠A : ∠B : ∠C = ${nb(ratio.join(' : '))}이고 원 O의 반지름의 길이가 ${R0} cm일 때, △ABC의 넓이는?`, rat[0], rat[1], 3, 'cm²', {
        figure: S.svg('원 O에 내접하는 삼각형 ABC. 점 O는 삼각형의 내부에 있고 반지름 OA, OB, OC가 그어져 있다'),
        explain: `세 내각의 합이 180°이므로 ∠A = ${aA}°, ∠B = ${aB}°, ∠C = ${aC}°이고, 중심각은 ∠BOC = ${2 * aA}°, ∠COA = ${2 * aB}°, ∠AOB = ${2 * aC}°이다. 두 반지름과 현으로 이루어진 삼각형의 넓이는 한 반지름을 밑변으로 하고 높이를 30°·60°·90°인 삼각형으로 구한다: △OBC = ${part(2 * aA)}, △OCA = ${part(2 * aB)}, △OAB = ${part(2 * aC)}(cm²). 모두 더하면 (${rat[0]} + ${rat[1]}${rt(3)}) cm²이다.`,
        facts: { calc: shape[0] === 45 ? [[`3*${R0}*${R0}/4`, 0], [`${R0}*${R0}/4`, 1], ['3', 2]] : [[`${R0}*${R0}/2`, 0], [`${R0}*${R0}/4`, 1], ['3', 2]], unseen: [2, 3, 4] }
      });
    }),
    H('hard-diam-chain', '수직인 두 지름과 길이의 비가 이어진 호', '심8', (d) => {
      const k = d.pick([3, 5, 9]), a = 90 / k, g = d.until(() => d.pick([36, 40, 45, 54, 60, 72]), (v) => Math.abs(v - 2 * a) >= 10), gg = gcd(a, g), turn = 0;
      const S = Circ(92).center().on({ B: 0 + turn, C: 90 + turn, A: 180 + turn, D: 270 + turn, E: 180 - a + turn, F: 2 * a + turn, G: g + turn });
      S.put({ H: meet(S.P.A, S.P.B, S.P.D, S.P.G) }).seg('AB CD BF FE ED DB DG GC CH').right('BOC').ang('BFE', sv('x'), { square: false }).ang('GCH', sv('y'), { square: false }).names({ O: 135 });
      const x = 90 + a / 2;
      sure(angOf(S, 'BFE'), x); sure(angOf(S, 'GCH'), g);
      return degs(`그림과 같이 원 O의 두 지름 AB, CD가 서로 수직이다. 호 AC 위의 점 E와 호 BC 위의 두 점 F, G를 호 AE의 길이가 호 BF의 길이의 ${HALF}, 호 BG의 길이의 ${frac(a / gg, g / gg)}, 호 BC의 길이의 ${frac(1, k)}이 되도록 잡고, 두 선분 AB, DG의 교점을 H라 하자. ∠${X} = ∠BFE, ∠${Y} = ∠GCH일 때, ∠${X}, ∠${Y}의 크기를 차례로 구하시오.`, [['∠x', x], ['∠y', g]], {
        figure: S.svg('원 O의 서로 수직인 두 지름 AB, CD. 점 E는 호 AC 위에, 점 F, G는 호 BC 위에 있다. 선분 BF, FE, ED, DB, DG, GC가 그어져 있고 선분 DG가 지름 AB와 점 H에서 만나며 선분 CH가 그어져 있다. ∠BFE = x, ∠GCH = y'),
        explain: `호 BC에 대한 중심각은 90°이므로 호 AE, BF, BG에 대한 중심각은 각각 ${a}°, ${2 * a}°, ${g}°이다. ∠BOE = 180° − ${a}° = ${180 - a}°이므로 ∠BDE = ${(180 - a) / 2}°이고, □BFED가 원에 내접하므로 ∠${X} = 180° − ${(180 - a) / 2}° = ${x}°이다. ∠COG = ${90 - g}°이므로 ∠CDG = ${(90 - g) / 2}°이다. 점 H는 ${sg('CD')}의 수직이등분선 AB 위에 있으므로 ${sg('HC')} = ${sg('HD')}이고 ∠DCH = ${(90 - g) / 2}°이다. ∠CGD = 90°(반원)이므로 ∠DCG = 90° − ${(90 - g) / 2}°이고 ∠${Y} = ∠DCG − ∠DCH = ${g}°이다.`,
        facts: { calc: [[`90+90/${k}/2`, 0], [`90/${k}*${g / gg}/${a / gg}`, 1]], unseen: [90, 2] }
      });
    }),
    H('hard-two-circles-cyc', '두 점에서 만나는 두 원과 두 내접사각형', '심9', (d) => {
      const a = d.int(58, 86), u = 40, h = 40, vv = d.int(26, 34), O1 = [-u, 0], O2 = [vv, 0], r1 = Math.hypot(u, h), r2 = Math.hypot(vv, h), pC = [0, -h], pD = [0, h];
      const phD = dirOf(O1, pD), pB = at(O1, r1, phD + 2 * a), pF = second(pC, unit(pB, pC), O2);
      // 점 A 는 점 B 와 점 D 사이의 왼쪽 호 위에서, 직선 AD 가 오른쪽 원과 다시 만나는 점 E 가 사각형 DCFE 의 꼭짓점 차례를 지키는 자리로 고른다.
      const { pA, pE } = d.until(() => { const q = at(O1, r1, phD + 2 * a + d.int(30, 330 - 2 * a)); return { pA: q, pE: second(pD, unit(q, pD), O2) }; }, (w) => Math.abs(angAt(w.pE, pD, pF) - (180 - a)) < 0.05 && dist(w.pA, pD) > 30 && dist(w.pA, pB) > 30 && dist(w.pE, pF) > 30);
      const S = Circ(1, { hide: true });
      S.b.disk(O1, r1); S.b.disk(O2, r2);
      S.put({ A: pA, B: pB, C: pC, D: pD, E: pE, F: pF }).seg('BF AE AB EF CD').ang('DAB', deg(a)).ang('DEF', sv('x'), { square: false }).names({ A: dirOf(O1, pA), B: dirOf(O1, pB), E: dirOf(O2, pE), F: dirOf(O2, pF), C: 90, D: 270 });
      sure(angOf(S, 'DAB'), a); sure(angOf(S, 'DEF'), 180 - a); sure(dist(pE, O2), r2);
      return degQ(`그림과 같이 두 원이 두 점 C, D에서 만나고, 세 점 B, C, F와 세 점 A, D, E가 각각 한 직선 위에 있다. ∠DAB = ${a}°일 때, ∠${X}의 크기는?`, 180 - a, {
        figure: S.svg(`두 점 C, D에서 만나는 두 원. 왼쪽 원 위에 점 A, B가, 오른쪽 원 위에 점 E, F가 있다. 직선 BF는 점 C를, 직선 AE는 점 D를 지난다. 현 AB, EF, CD가 그어져 있다. ∠DAB = ${a}°, ∠DEF = x`),
        explain: `□ABCD는 왼쪽 원에 내접하므로 그 외각 ∠DCF는 내대각 ∠DAB와 크기가 같은 ${a}°이다. □DCFE는 오른쪽 원에 내접하므로 ∠${X} = 180° − ${a}° = ${180 - a}°이다.`,
        facts: { calc: [[`180-${a}`, 0]], unseen: [180] }
      });
    }),
    H('hard-orthocenter', '두 수선의 발과 한 원 위의 네 점', '심11', (d) => {
      const v = d.until(() => ({ p: d.int(18, 40), q: d.int(18, 40) }), (w) => Math.abs(w.p - w.q) >= 4 && w.p + w.q >= 50 && w.p + w.q <= 76), x = v.p + v.q, angB = x, angC = 90 - v.q;
      const pB = [0, 0], pC = [200, 0], pA = meet(pB, at(pB, 10, angB), pC, at(pC, 10, 180 - angC));
      const pE = foot(pB, pA, pC), pF = foot(pC, pA, pB), S = Circ(1, { hide: true });
      S.put({ A: pA, B: pB, C: pC, E: pE, F: pF, H: meet(pB, pE, pC, pF) }).seg('AB BC CA BE CF EF').right('BEC BFC').ang('ABE', deg(v.p)).ang('EBC', deg(v.q)).ang('AEF', sv('x'), { square: false }).names();
      sure(angOf(S, 'ABE'), v.p); sure(angOf(S, 'EBC'), v.q); sure(angOf(S, 'AEF'), x);
      return degQ(`그림과 같이 △ABC의 두 꼭짓점 B, C에서 대변에 내린 수선의 발을 각각 E, F라 하고 두 선분 BE, CF의 교점을 H라 하자. ∠ABE = ${v.p}°, ∠EBC = ${v.q}°일 때, ∠${X}의 크기는?`, x, {
        figure: S.svg(`삼각형 ABC. 꼭짓점 B에서 변 CA에 내린 수선 BE와 꼭짓점 C에서 변 AB에 내린 수선 CF가 점 H에서 만난다. ∠BEC와 ∠BFC에 직각 표시가 있고 선분 EF가 그어져 있다. ∠ABE = ${v.p}°, ∠EBC = ${v.q}°, ∠AEF = x`),
        explain: `∠BEC = ∠BFC = 90°이고 두 점 E, F는 직선 BC에 대하여 같은 쪽에 있으므로 네 점 B, C, E, F는 한 원 위에 있다. □BCEF가 원에 내접하므로 그 외각 ∠AEF는 내대각 ∠FBC와 크기가 같고, ∠${X} = ${v.p}° + ${v.q}° = ${x}°이다.`,
        facts: { calc: [[`${v.p}+${v.q}`, 0]] }
      });
    }),
    H('hard-rotate', '합동인 두 삼각형과 한 원 위의 네 점', '심12', (d) => {
      const th = even(d, 40, 70), gm = 90 + th / 2, v = d.until(() => ({ al: d.int(15, 40) }), (w) => { const be = 90 - th / 2 - w.al; return be >= 15 && Math.abs(be - w.al) >= 4; }), al = v.al, be = 90 - th / 2 - al;
      const b0 = 70, a0 = b0 * Math.sin(al * RAD) / Math.sin(be * RAD), pC = [0, 0], pB = [-a0, 0], pA = at(pC, b0, 180 - gm);
      const cands = [th, -th].map((t) => ({ t, C2: spinPt(pC, t, pA), B2: spinPt(pB, t, pA) })), pick = cands.find((c) => Math.abs(c.C2[1]) < 1e-6 && c.C2[0] > 0) || cands[0];
      const cen0 = (() => { const m1 = mid(pA, pB), m2 = mid(pA, pick.C2), p1 = [m1[0] + (pB[1] - pA[1]), m1[1] - (pB[0] - pA[0])], p2 = [m2[0] + (pick.C2[1] - pA[1]), m2[1] - (pick.C2[0] - pA[0])]; return meet(m1, p1, m2, p2); })();
      // 지나는 원의 반지름이 84 px 가 되게 키운다.
      const k = 84 / dist(cen0, pA), sc = (q) => [(q[0] - cen0[0]) * k, (q[1] - cen0[1]) * k];
      const S = Circ(84, { hide: true });
      S.b.disk([0, 0], 84, 'fill:none;stroke-dasharray:4 3');
      S.put({ A: sc(pA), B: sc(pB), C: sc(pC), Y: sc(pick.C2), Z: sc(pick.B2) }).seg('AB BC CA AZ ZY YA CY');
      sure(Math.abs(dist([0, 0], S.P.Z) - 84) < 0.01 ? 1 : 0, 1, '네 점이 한 원 위');
      sure(angOf(S, 'CAY'), th); sure(angOf(S, 'ACB'), gm); sure(angOf(S, 'BYZ'), th);
      S.ang('CAY', deg(th)).ang('ACB', sv('x'), { square: false }).names({ Y: null, Z: null, C: 270 });
      S.b.name(S.P.Y, 'C′', awayFrom(S.P.Y, [S.P.A, S.P.C, S.P.Z]), 12); S.b.name(S.P.Z, 'B′', awayFrom(S.P.Z, [S.P.A, S.P.Y]), 12);
      return degQ(`그림과 같이 △ABC ≡ △AB′C′이고 ∠BAB′ = ∠CAC′ = ${th}°이다. 세 점 B, C, C′이 한 직선 위에 있고 네 점 A, B, B′, C′이 한 원 위에 있을 때, ∠${X}의 크기는?`, gm, {
        figure: S.svg(`삼각형 ABC와 그와 합동인 삼각형 AB′C′. 세 점 B, C, C′이 한 직선 위에 있고 네 점 A, B, B′, C′을 지나는 원이 점선으로 그려져 있다. ∠CAC′ = ${th}°, ∠ACB = x`),
        explain: `${sg('AC')} = ${sg('AC′')}이므로 ∠AC′C = (180° − ${th}°) ÷ 2 = ${90 - th / 2}°이다. 네 점 A, B, B′, C′이 한 원 위에 있으므로 ∠BC′B′ = ∠BAB′ = ${th}°(호 BB′에 대한 원주각)이다. ∠AC′B′ = ${90 - th / 2}° + ${th}° = ${gm}°이고, 두 삼각형이 합동이므로 ∠${X} = ∠AC′B′ = ${gm}°이다.`,
        facts: { calc: [[`(180-${th})/2+${th}`, 0]], unseen: [180, 2] }
      });
    }),
    H('hard-tangents-xy', '두 점에서 그은 접선과 내접사각형', '심13', (d) => {
      const dl = d.int(70, 110), turn = d.int(-6, 6), aA = 270 - dl + turn, aC = 270 + dl + turn, aD = 90 + turn + d.int(-Math.floor((180 - dl) * 0.5), Math.floor((180 - dl) * 0.5));
      const S = Circ().center().on({ A: aA, B: 270 + turn + d.int(-15, 15), C: aC, D: aD }).seg('AB BC CD DA');
      const tip = (n, len) => { const p = S.P[n], e1 = at(p, len, S.A[n] + 90), e2 = at(p, len, S.A[n] - 90); return dist(e1, S.P.D) < dist(e2, S.P.D) ? [e1, e2] : [e2, e1]; };
      const [la, la2] = tip('A', 60), [mc, mc2] = tip('C', 60);
      S.put({ L: la, M: mc });
      S.b.seg(la, la2); S.b.seg(mc, mc2);
      S.b.text(at(la, 10, dirOf(la2, la)), sv('l')); S.b.text(at(mc, 10, dirOf(mc2, mc)), sv('m'));
      S.ang('ADC', deg(dl)).ang('LAD', sv('x'), { square: false }).ang('MCD', sv('y'), { square: false }).names({ L: null, M: null });
      sure(angOf(S, 'ADC'), dl); sure(angOf(S, 'LAD') + angOf(S, 'MCD'), 180 - dl);
      return degQ(`그림과 같이 □ABCD가 원 O에 내접하고 두 직선 l, m은 각각 점 A, C에서 원 O에 접한다. ∠ADC = ${dl}°일 때, ∠${X} + ∠${Y}의 크기는? (단, ∠${X}는 직선 l과 현 AD가, ∠${Y}는 직선 m과 현 CD가 이루는 각이다.)`, 180 - dl, {
        figure: S.svg(`원 O에 내접하는 사각형 ABCD와 점 A에서의 접선 l, 점 C에서의 접선 m. ∠ADC = ${dl}°, 접선 l과 현 AD가 이루는 각 x, 접선 m과 현 CD가 이루는 각 y(두 각 모두 점 D 쪽)`),
        explain: `현 AC를 그으면 ∠${X}는 그 안쪽에 있는 호 AD에 대한 원주각 ∠ACD와, ∠${Y}는 그 안쪽에 있는 호 CD에 대한 원주각 ∠CAD와 크기가 같다. △ACD에서 ∠${X} + ∠${Y} = ∠ACD + ∠CAD = 180° − ${dl}° = ${180 - dl}°이다.`,
        facts: { calc: [[`180-${dl}`, 0]], unseen: [180] }
      });
    }),
    H('hard-tan-parallel', '접선과 평행한 현이 만드는 같은 각', '심14', (d) => {
      const s = d.int(20, 40), turn = d.int(-5, 5);
      const S = Circ().center().on({ D: 270 + turn, B: 270 - 2 * s + turn, C: 270 + 2 * s + turn, A: 90 + turn + d.int(-25, 25) });
      S.tangent('D', 72, 72, 'T', '').seg('BC AB AC AD').ang('DAC', deg(s)).ang('BAD', sv('x'), { square: false }).names();
      S.b.arrow(S.P.B, S.P.C); S.b.arrow(at(S.P.D, 60, 180 + turn), S.P.D);
      sure(angOf(S, 'DAC'), s); sure(angOf(S, 'BAD'), s);
      return degQ(`그림에서 직선 DT는 원 O의 접선이고 점 D는 접점이다. 현 BC가 직선 DT와 평행하고 ∠DAC = ${s}°일 때, ∠${X}의 크기는?`, s, {
        figure: S.svg(`원 O 위의 네 점 A, B, C, D와 점 D에서의 접선 위의 점 T. 현 BC와 접선에 평행하다는 표시가 있다. 현 AB, AC, AD가 그어져 있고 점 D는 점 A의 반대쪽 호 BC 위에 있다. ∠DAC = ${s}°, ∠BAD = x`),
        explain: `현 CD를 그으면 ∠CDT는 그 안쪽에 있는 호 CD에 대한 원주각 ∠CAD와 크기가 같으므로 ${s}°이다. ${sg('BC')} ∥ DT이므로 ∠BCD = ∠CDT = ${s}°(엇각)이고, ∠${X}와 ∠BCD는 호 BD에 대한 원주각이므로 ∠${X} = ${s}°이다.`,
        facts: { calc: [[`${s}`, 0]] }
      });
    }),
    H('hard-tan-bisector', '외접원의 접선과 각의 이등분선', '심15', (d) => {
      const pos = (w) => ({ B: 270 - w.al, C: 270 + w.al, A: 270 + w.al + 2 * w.be });
      const v = d.until(() => ({ al: even(d, 40, 76), be: d.int(24, 44) }), (w) => { const gm = 180 - w.al - w.be, p = pos(w), u = (q) => at([0, 0], 1, q), tA = u(p.A), m = meet(u(p.B), u(p.C), tA, at(tA, 1, p.A + 90)); return gm - w.be >= 24 && gm <= 100 && Math.hypot(m[0], m[1]) <= 2.2; }), x = (180 - v.al) / 2, p = pos(v), R = 70;
      const S = Circ(R).center().on({ A: p.A, B: p.B, C: p.C });
      const pD = meet(S.P.B, S.P.C, S.P.A, at(S.P.A, 10, p.A + 90)), bis = (() => { const a1 = dirOf(pD, S.P.A), a2 = dirOf(pD, S.P.B); let m = (a1 + a2) / 2; if (Math.abs(a1 - a2) > 180) m += 180; return m; })();
      const pE = meet(pD, at(pD, 10, bis), S.P.A, S.P.B);
      S.put({ D: pD, E: pE }).seg('AB AC BD AD DE').ang('AED', sv('x'), { square: false }).ang('BAC', deg(v.al), { far: 0 }).names();
      S.b.sym(pD, (dirOf(pD, S.P.A) + bis) / 2 + (Math.abs(dirOf(pD, S.P.A) - bis) > 180 ? 180 : 0), 'dot', 34); S.b.sym(pD, (dirOf(pD, S.P.B) + bis) / 2 + (Math.abs(dirOf(pD, S.P.B) - bis) > 180 ? 180 : 0), 'dot', 34);
      sure(angOf(S, 'BAC'), v.al); sure(angOf(S, 'AED'), x); sure(angOf(S, 'ADE'), angOf(S, 'EDB')); sure(angOf(S, 'OAD'), 90);
      return degQ(`그림과 같이 ${sg('AB')} > ${sg('AC')}인 △ABC의 외접원 O 위의 점 A에서 그은 접선이 변 BC의 연장선과 만나는 점을 D, ∠ADB의 이등분선이 변 AB와 만나는 점을 E라 하자. ∠BAC = ${v.al}°일 때, ∠${X}의 크기는?`, x, {
        figure: S.svg(`원 O에 내접하는 삼각형 ABC. 점 A에서의 접선과 변 BC를 점 C 너머로 늘인 직선이 점 D에서 만난다. ∠ADB를 이등분하는 선분 DE가 변 AB와 점 E에서 만난다(같은 각 표시). ∠BAC = ${v.al}°, ∠AED = x`),
        explain: `∠CAD는 그 안쪽에 있는 호 AC에 대한 원주각 ∠ABC와 크기가 같으므로 ∠CAD = ∠ABC = ∠a라 하고, ∠ADE = ∠EDB = ∠b라 하자. △ABD에서 (${v.al}° + ∠a) + ∠a + 2∠b = 180°이므로 ∠a + ∠b = ${x}°이다. ∠AED는 △EBD의 외각이므로 ∠${X} = ∠a + ∠b = ${x}°이다.`,
        facts: { calc: [[`(180-${v.al})/2`, 0]], unseen: [180, 2] }
      });
    }),
    H('hard-tan-area', '접선과 현이 이루는 각으로 직각삼각형의 넓이 구하기', '심16', (d) => {
      const dd = d.pick([4, 8, 12]), R = 64, turn = d.int(-6, 6);
      const S = Circ(R).center().on({ A: 180 + turn, B: turn, C: 120 + turn });
      S.put({ P: at(S.O, 2 * R, 180 + turn) }).seg('PB CA CB').ray('PC', 30).ang('APC', deg(30), { far: 0, side: -1 }).names();
      sure(angOf(S, 'APC'), 30); sure(angOf(S, 'OCP'), 90);
      return radQ(`그림에서 직선 PC는 원 O의 접선이고 점 C는 접점이다. 지름 AB의 연장선이 점 P를 지나고 ${sg('PA')} = ${dd / 2} cm, ${sg('AB')} = ${dd} cm, ∠APC = 30°일 때, △ABC의 넓이는?`, dd * dd / 8, 3, 'cm²', {
        figure: S.svg('원 O의 지름 AB를 점 A 너머로 늘인 직선 위의 점 P에서 그은 접선 PC. 현 CA, CB가 그어져 있다. ∠APC = 30°'),
        explain: `∠ACP = ∠ABC = ∠a(접선과 현이 이루는 각)라 하면 ∠ACB = 90°이므로 △PBC에서 30° + (∠a + 90°) + ∠a = 180°, ∠a = 30°이다. 직각삼각형 ABC에서 ${sg('AC')} = ${HALF}${sg('AB')} = ${dd / 2} cm, ${sg('BC')} = ${dd / 2}${rt(3)} cm이므로 넓이는 ${HALF} × ${dd / 2} × ${dd / 2}${rt(3)} = ${dd * dd / 8}${rt(3)}(cm²)이다.`,
        facts: { calc: [[`${dd}*${dd}/8`, 0], ['3', 1]], unseen: [8, 3] }
      });
    }),
    H('hard-tan-ratio', '두 접선과 호의 길이의 비', '심17', (d) => {
      const v = d.until(() => ({ k: d.pick([2, 3]), t: d.int(50, 66) }), (w) => (180 - w.t) % (w.k + 1) === 0 && w.k * (180 - w.t) / (w.k + 1) <= 110), x = v.k * (180 - v.t) / (v.k + 1), R = 58, ab = 2 * (180 - v.t) / (v.k + 1);
      const aB = 180 - v.t, aC = 180 + v.t, aA = aB - ab, aD = (aC + aA + 360) / 2;
      const S = Circ(R).center().on({ A: aA, B: aB, C: aC, D: aD });
      S.put({ P: at(S.O, R / Math.cos(v.t * RAD), 180) }).seg('PB PC AB AC BC').dot('D').ang('BCP', deg(v.t)).ang('ABC', sv('x'), { square: false }).names();
      sure(angOf(S, 'BCP'), v.t); sure(angOf(S, 'ABC'), x); sure(angOf(S, 'OBP'), 90);
      return degQ(`그림과 같이 원 O 밖의 한 점 P에서 원 O에 그은 두 접선의 접점을 B, C라 하자. 원 위의 점 A에 대하여 호 ADC의 길이가 호 AB의 길이의 ${v.k}배이고 ∠BCP = ${v.t}°일 때, ∠${X}의 크기는?`, x, {
        figure: S.svg(`원 O 밖의 점 P에서 그은 두 접선 PB, PC. 점 A는 점 P에서 먼 쪽의 원 위에 있고 점 D는 점 B를 지나지 않는 호 AC 위에 있다. 현 AB, AC, BC가 그어져 있다. 호 AB는 점 C를 지나지 않는 호이다. ∠BCP = ${v.t}°, ∠ABC = x`),
        explain: `∠BAC는 ∠BCP의 안쪽에 있는 호 BC에 대한 원주각이므로 ${v.t}°이다. ∠ABC는 호 ADC에, ∠ACB는 호 AB에 대한 원주각이므로 ∠ABC = ${v.k}∠ACB이다. △ABC에서 ${v.k + 1}∠ACB = 180° − ${v.t}°, ∠ACB = ${(180 - v.t) / (v.k + 1)}°이고 ∠${X} = ${x}°이다.`,
        facts: { calc: [[`${v.k}*(180-${v.t})/(${v.k}+1)`, 0]], unseen: [180, 1] }
      });
    }),
    H('hard-inner-circles', '내접하는 두 원과 큰 원의 현', '심19', (d) => {
      const v = d.until(() => ({ b: d.int(36, 66), c: d.int(36, 66) }), (w) => Math.abs(w.b - w.c) >= 6 && (180 - w.b - w.c) % 2 === 0 && 180 - w.b - w.c >= 50 && 180 - w.b - w.c <= 96), a = 180 - v.b - v.c, x = a / 2, R = 80;
      const S = Circ(R).on({ B: 270 - a, C: 270 + a, A: 270 + a + 2 * v.b });
      const pD = meet(S.P.A, at(S.P.A, 10, (dirOf(S.P.A, S.P.B) + dirOf(S.P.A, S.P.C)) / 2), S.P.B, S.P.C), O2 = meet(S.P.A, [0, 0], pD, [pD[0], pD[1] - 10]), r = dist(O2, S.P.A);
      S.b.disk(O2, r);
      S.put({ D: pD }).seg('AB AC BC AD').ang('ABC', deg(v.b)).ang('ACB', deg(v.c)).ang('BAD', sv('x'), { square: false }).names();
      sure(dist(O2, pD), r); sure(angOf(S, 'BAD'), x); sure(angOf(S, 'ABC'), v.b);
      return degQ(`그림과 같이 큰 원과 작은 원이 점 A에서 내접하고, 큰 원의 현 BC가 작은 원과 점 D에서 접한다. ∠ABC = ${v.b}°, ∠ACB = ${v.c}°일 때, ∠${X}의 크기는?`, x, {
        figure: S.svg(`점 A에서 내접하는 큰 원과 작은 원. 큰 원 위의 점 B, C를 이은 현 BC가 작은 원과 점 D에서 접한다. 현 AB, AC와 선분 AD가 그어져 있다. ∠ABC = ${v.b}°, ∠ACB = ${v.c}°, ∠BAD = x`),
        explain: `점 A에서 두 원의 공통인 접선 AS를 긋고, 현 AB가 작은 원과 만나는 점을 E라 하자. 큰 원에서 ∠SAB = ∠ACB = ${v.c}°이고, 작은 원에서 ∠ADE = ∠SAE = ${v.c}°이다. 직선 BC는 작은 원의 접선이므로 ∠EDB = ∠EAD = ∠${X}이다. △ABD에서 ∠${X} + ${v.b}° + (${v.c}° + ∠${X}) = 180°이므로 ∠${X} = ${x}°이다.`,
        facts: { calc: [[`(180-${v.b}-${v.c})/2`, 0]], unseen: [180, 2] }
      });
    }),
    H('hard-touch-diam', '지름에 접하면서 큰 원에 내접하는 작은 원', '심20', (d) => {
      const a = d.int(15, 36), R = 80, pP = at([0, 0], R, 2 * a), t = 1 / (1 + Math.sin(2 * a * RAD)), O2 = [pP[0] * t, pP[1] * t], r = R * (1 - t), pQ = [O2[0], 0], x = 45 + a;
      const S = Circ(R).center().on({ A: 180, B: 0, P: 2 * a });
      S.b.disk(O2, r);
      S.put({ Q: pQ }).seg('AB PA PB PQ').ang('PAB', deg(a)).ang('PQB', sv('x'), { square: false }).names({ Q: 270, O: 230 });
      sure(dist(O2, pQ), r); sure(angOf(S, 'PQB'), x);
      return degQ(`그림과 같이 선분 AB를 지름으로 하는 원 O와 작은 원이 점 P에서 내접하고, 작은 원은 지름 AB와 점 Q에서 접한다. ∠PAB = ${a}°일 때, ∠${X}의 크기는?`, x, {
        figure: S.svg(`지름이 AB인 원 O와 그 안에서 점 P에 접하는 작은 원. 작은 원은 지름 AB와 점 Q에서 접한다. 현 PA, PB와 선분 PQ가 그어져 있다. ∠PAB = ${a}°, ∠PQB = x`),
        explain: `점 P에서 두 원의 공통인 접선을 그어 직선 AB와 만나는 점을 C라 하자. ∠CPB = ∠PAB = ${a}°(접선과 현)이고 ∠APB = 90°이므로 ∠PBA = ${90 - a}°이다. ∠PBA는 △CPB의 외각이므로 ∠C = ${90 - a}° − ${a}° = ${90 - 2 * a}°이다. ${sg('CP')}와 ${sg('CQ')}는 점 C에서 작은 원에 그은 두 접선이므로 길이가 같고 ∠${X} = (180° − ${90 - 2 * a}°) ÷ 2 = ${x}°이다.`,
        facts: { calc: [[`(180-(90-2*${a}))/2`, 0]], unseen: [180, 90, 2] }
      });
    }),
    H('hard-common-tangent', '두 원의 공통인 접선과 접선·현이 이루는 각', '심21', (d) => {
      // 작은 원이 너무 작으면 이름 O, A가 몰린다: 그림에서 작은 원의 반지름이 17 px 이상이 되게 고른다.
      const v = d.until(() => ({ ph: d.pick([60, 75]), r1: d.int(2, 6), r2: d.int(3, 8) }), (w) => w.r1 < w.r2 && (w.ph === 60 || (w.r1 + w.r2) % 3 === 0) && (w.ph === 60 ? w.r1 + w.r2 <= 9 : (w.r1 + w.r2) / 3 >= 2)
        && w.r1 * 150 / ((w.r1 + w.r2) * Math.tan((180 - 2 * w.ph) * RAD) + w.r1 + w.r2) >= 17);
      const k = v.ph === 60 ? v.r1 + v.r2 : (v.r1 + v.r2) / 3, sAB = (v.r1 + v.r2) * Math.tan((180 - 2 * v.ph) * RAD), u = 150 / (sAB + v.r1 + v.r2);
      const pB = [0, 0], O2 = [0, v.r2 * u], pA = [-sAB * u, 0], O1 = [-sAB * u, -v.r1 * u], uu = unit(O1, O2), pC = [O2[0] + uu[0] * v.r2 * u, O2[1] + uu[1] * v.r2 * u];
      const S = Circ(1, { hide: true });
      S.b.disk(O1, v.r1 * u); S.b.disk(O2, v.r2 * u);
      S.put({ A: pA, B: pB, C: pC }); S.P.O1 = O1; S.P.O2 = O2;
      S.b.seg([pA[0] - v.r1 * u - 14, 0], [v.r2 * u + 14, 0]); S.b.seg(O1, pC); S.b.seg(pB, pC); S.b.seg(O1, pA, 'thin'); S.b.seg(O2, pB, 'thin');
      S.b.dot(O1); S.b.dot(O2);
      const toward = angAt(pB, [10, 0], pC) === v.ph ? [10, 0] : [-10, 0];
      sure(angAt(pB, toward, pC), v.ph); sure(angAt(O2, pB, O1), 180 - 2 * v.ph);
      S.put({ L: toward }).ang('LBC', deg(v.ph));
      S.b.text(at([v.r2 * u + 14, 0], 8, 0), sv('l'));
      const way = (p, list) => list.map((q) => dirOf(p, q));
      S.nameAt(pA, 'A', way(pA, [[-1, 0], [1, 0], O1]).concat(dirOf(O1, pA) + 90, dirOf(O1, pA) - 90)).nameAt(pB, 'B', way(pB, [[-1, 0], [1, 0], O2, pC]).concat(dirOf(O2, pB) + 90, dirOf(O2, pB) - 90));
      S.nameAt(pC, 'C', way(pC, [O1, pB]).concat(dirOf(O2, pC) + 90, dirOf(O2, pC) - 90)).nameAt(O1, 'O', way(O1, [pA, O2])).nameAt(O2, 'O′', way(O2, [pB, pC, O1]));
      return radQ(`그림과 같이 반지름의 길이가 각각 ${v.r1} cm, ${v.r2} cm인 두 원 O, O′이 직선 l의 서로 다른 쪽에 있고 직선 l은 두 원에 동시에 접한다. 직선 l이 두 원과 접하는 점을 각각 A, B라 하고 선분 OO′의 연장선이 원 O′과 만나는 점을 C라 하자. 직선 l과 현 BC가 이루는 각의 크기가 ${v.ph}°일 때, ${sg('AB')}의 길이는?`, k, 3, 'cm', {
        figure: S.svg(`직선 l의 위쪽에 원 O가, 아래쪽에 원 O′이 있고 직선 l은 두 원과 각각 점 A, B에서 접한다. 반지름 OA, O′B가 그어져 있다. 선분 OO′을 늘인 직선이 원 O′과 점 C에서 만나고 현 BC가 그어져 있다. 직선 l과 현 BC가 이루는 각의 크기는 ${v.ph}°`),
        explain: `직선 l과 현 BC가 이루는 각은 그 안쪽에 있는 호 BC에 대한 원주각과 크기가 같으므로 호 BC에 대한 중심각 ∠BO′C = 2 × ${v.ph}° = ${2 * v.ph}°이고 ∠BO′O = 180° − ${2 * v.ph}° = ${180 - 2 * v.ph}°이다. 점 O에서 직선 O′B에 수선 OH를 그으면 사각형 OABH는 직사각형이고 ${sg('O′H')} = ${v.r2} + ${v.r1} = ${v.r1 + v.r2}(cm), ${sg('OH')} = ${sg('AB')}이다. 직각삼각형 OO′H에서 ∠OO′H = ${180 - 2 * v.ph}°이므로 ${sg('AB')} = ${v.ph === 60 ? `${rt(3)} × ${v.r1 + v.r2}` : `${v.r1 + v.r2} ÷ ${rt(3)}`} = ${k}${rt(3)}(cm)이다.`,
        facts: { calc: [[v.ph === 60 ? `${v.r1}+${v.r2}` : `(${v.r1}+${v.r2})/3`, 0], ['3', 1]], unseen: [3] }
      });
    })
  ];

  B.addGroup(UNIT, { id: 'hard', title: '단원 종합', standard: S19, types: hard });
})(typeof window !== 'undefined' ? window : globalThis);
