// 중학교 1학년 2학기 3단원 평면도형의 성질 — 실력 문항.
// 단원 틀과 그림 판, 싣는 기준, 뺀 것과 까닭은 7-2-3a.js 에 있다. ref: ①n = 기본꼴_1의 n번, 심n = 심화꼴의 n번.
//
// 이 단원에서 아이들이 흔히 잘못 아는 것(실력 ①의 장치는 이 잘못을 가진 아이가 걸리게 만들었다)
//  - 다각형의 바깥쪽에 있는 각이면 외각이라고 여긴다. 바깥쪽으로 크게 벌어진 각(360° − 내각)이나 두 연장선이 이루는 각(내각의 맞꼭지각)을 외각으로 고른다.
//  - 삼각형의 외각을 그림에 적힌 두 내각의 합으로만 셈한다. 적힌 내각이 그 외각과 이웃한 내각인지 가리지 않는다.
//  - 한 꼭짓점에서 그을 수 있는 대각선의 개수(n − 3), 그때 생기는 삼각형의 개수(n − 2), 전체 대각선의 개수(n(n − 3)/2)를 뒤섞는다. 2로 나누는 것을 잊는다.
//  - 변도 두 꼭짓점을 이은 선분이므로 「모든 점을 서로 잇는 선분」을 셀 때 대각선의 개수만 답한다.
//  - 외각의 크기의 합도 변이 많을수록 커진다고 여긴다(언제나 360°이다). 내각의 크기의 합과 한 내각, 외각의 크기의 합과 한 외각을 섞는다.
//  - 변의 길이만 같거나 내각의 크기만 같아도 정다각형이라고 여긴다(마름모, 직사각형).
//  - 중심각의 크기가 2배이면 현의 길이도, 두 반지름과 현으로 이루어진 삼각형의 넓이도 2배라고 여긴다(정비례하는 것은 호의 길이와 부채꼴의 넓이뿐이다).
//  - 부채꼴과 활꼴을 서로 다른 도형으로만 안다(반원은 둘 다이다). 반지름을 현이라 하고, 지름보다 긴 현이 있다고 여긴다.
//  - 반지름의 길이가 2배이면 넓이도 2배라고 여긴다(넓이는 4배이다). 와이퍼처럼 고리의 한 부분인 도형의 넓이를 날의 길이를 반지름으로 하여 셈한다.
//  - 색칠한 부분의 둘레를 구할 때 호의 길이만 더하고 곧은 변을 빠뜨린다. 거꾸로 색칠한 부분의 경계가 아닌 선분(반원의 지름)을 더한다.
//
// 실력에는 ① 문제의 그림·말·수에 함정이 있어 배운 뜻을 정확히 대야 풀리는 문제와 ② 두 번 넘게 생각해야 풀리는 문제(다각형을 찾은 다음 다른 것 구하기,
// 한 내각과 한 외각의 비, 이등분선이 만나는 각, 이어진 이등변삼각형, 정다각형의 대각선·연장선이 이루는 각, 반지름으로 생긴 이등변삼각형과 평행선으로 호의 길이 구하기,
// 호의 길이와 넓이에서 반지름·중심각을 거꾸로 구하기, 사분원 안의 반원과 정사각형 안의 두 부채꼴)만 실었다.
// 기본에서 하는 일을 고르기로 바꾼 것, 수만 키운 계산, 그림에서 답이 한눈에 보이는 것은 싣지 않았다.
// (2026-10-13 다시 싣기: 파일 끝의 「다시 실은 꼴」에 선분이 엇갈린 그림의 각, 조각이 셋을 넘는 색칠한 부분, 돌리고 굴린 도형, 원이 도는 자리 따위를 덧붙였다.)
// 묻는 말: 수나 값은 「~은?/~는?」, 양은 「몇 ~인가?」. 각도는 수에 붙여 적고(108°) 길이는 띄어 적는다(6 cm).
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, josa, N, C } = B.kit;
  const { nb, V } = B.kit.mid;
  const K = B.kit.m723;
  const { UNIT, POLY, FAN, X, N_, gon, rgon, inSum, diagAll, inOf, exOf, REG, sg, degQ, cntQ, gonQ, rgonQ, CM, CM2, piN, piF, piPlus, piTwo, gcd, sayQ, RAD, at, dirOf, dist, XY, meet, awayFrom, arcTo, sv,
    TINT, WHITE, Board, polyOf, anglesOf, ALPHA, vnames, triOf, regOn, regPts, joined, sideFor, ring, mark, centre, FANS, RLS, qv } = K;
  // 실력 문항. 기본 자료에서만 나온 꼴은 ref 를 '기본 ①52' 처럼 적는다.
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: ref.startsWith('기본 ') ? '수집본 기본 자료(' + ref.slice(3) + ')' : '수집본 심화 자료(' + ref + ')', make }, more || {});
  const TAG = ['㉠', '㉡', '㉢', '㉣'], V_R = V('r'), BIG = { size: 15 };
  const sumOf = (list) => list.reduce((s, v) => s + v, 0);

  // ── 그림 ──
  // 정사각형 안의 두 부채꼴(마주 보는 두 꼭짓점이 중심, 한 변이 반지름). ears: 겹친 부분을 뺀 나머지 두 부분을 색칠한다(아니면 겹친 부분을 색칠한다).
  function leafFig(a, ears) {
    const S = 126, b = Board(), BL = [0, 0], BR = [S, 0], TR = [S, -S], TL = [0, -S];
    b.poly([BL, BR, TR, TL], ears ? TINT : WHITE).shape(`M${XY(TL)}${arcTo(BL, S, 90, 0)}${arcTo(TR, S, 270, 180)}Z`, [TL, BR], ears ? WHITE : TINT);
    b.dim(BL, BR, `${a} cm`, [S / 2, -S / 2], 10);
    return b.svg(`한 변의 길이가 ${a} cm인 정사각형. 마주 보는 두 꼭짓점을 각각 중심으로 하고 정사각형의 한 변을 반지름으로 하는 부채꼴 두 개가 정사각형의 내부에 그려져 있다. 두 부채꼴이 겹친 부분${ears ? '을 뺀 나머지 두 부분' : ''}이 색칠되어 있다`);
  }
  // 밑변 BC 가 가로로 놓인 삼각형 ABC(밑변의 길이 L)의 세 꼭짓점
  const baseTri = (bv, c, L) => { const pB = [0, 0], pC = [L, 0]; return { A: meet(pB, at(pB, 10, bv), pC, at(pC, 10, 180 - c)), B: pB, C: pC }; };
  // 그림의 점들을 [가로, 세로] 안에 꼭 맞게 짓는다. build(L): 밑변의 길이가 L 일 때의 점들({ 이름: 점 })
  function fitted(build, size) {
    const probe = Object.values(build(100)), xs = probe.map((p) => p[0]), ys = probe.map((p) => p[1]);
    return build(100 * Math.min(size[0] / (Math.max(...xs) - Math.min(...xs)), size[1] / (Math.max(...ys) - Math.min(...ys))));
  }

  B.addGroup(UNIT, {
    id: 'hard', title: '단원 종합', standard: POLY,
    types: [
      // ── ① 문제의 그림·말·수에 함정이 있어 배운 뜻을 정확히 대야 풀리는 문제 ──
      H('hard-all-links', '모든 점을 서로 잇는 선분의 개수', '심8', (d) => {
        // 함정: 대각선의 개수만 답하는 아이. 이웃한 두 점을 잇는 선분(변)도 세어야 한다. 거꾸로 n(n − 3)을 2로 나누지 않는 아이도 틀린다.
        const n = d.int(6, 12), w = d.pick([['도시', '곧은 도로'], ['섬', '곧은 다리'], ['정류장', '곧은 길']]);
        return cntQ(`${w[0]} ${n}곳이 ${gon(n)}의 꼭짓점 자리에 하나씩 있다. 두 ${w[0]} 사이마다 ${josa(w[1], '을/를')} 하나씩 모두 놓을 때, ${w[1]}의 개수는?`, diagAll(n) + n, {
          explain: `이웃하지 않는 두 ${josa(w[0], '을/를')} 잇는 것은 ${gon(n)}의 대각선이므로 ${frac(`${n} × (${n} − 3)`, 2)} = ${diagAll(n)}(개)이다. 이웃한 두 ${josa(w[0], '을/를')} 잇는 것은 ${gon(n)}의 변이므로 ${n}개이다. 모두 ${diagAll(n)} + ${n} = ${diagAll(n) + n}(개)이다.`,
          facts: { calc: [[`${n}*(${n}-3)/2+${n}`, 0]], unseen: [3, 2] }
        });
      }),
      H('hard-wiper', '와이퍼의 고무날이 지나간 부분의 넓이', '심56 / 기본 ①83', (d) => {
        // 함정: 고무날의 길이를 반지름으로 하는 부채꼴의 넓이를 답하는 아이. 고무날이 지나간 부분은 큰 부채꼴에서 작은 부채꼴을 뺀 띠이다.
        const [r0, L, t] = d.pick([[6, 24, 150], [6, 18, 120], [4, 20, 135], [6, 12, 120], [8, 16, 135], [6, 24, 120], [5, 15, 144], [4, 12, 135]]), R = r0 + L, sc = 104 / R, b = Board(), O = [0, 0], a0 = 90 - t / 2, a1 = 90 + t / 2, p = (len, a) => at(O, len * sc, a);
        b.shape(`M${XY(p(r0, a0))}L${XY(p(R, a0))}${arcTo(O, R * sc, a0, a1)}L${XY(p(r0, a1))}${arcTo(O, r0 * sc, a1, a0)}Z`, [p(r0, a0), p(R, a0), p(R, a1), p(r0, a1), p(R, 90)], TINT);
        b.seg(O, p(r0, a0), 'cut').seg(O, p(r0, a1), 'cut').dot(O).angle(O, a0, a1, '', { r: 8, square: false }).text([-24, 12], t + '°', { blue: true });
        b.dim(O, p(r0, a0), `${r0} cm`, p(R, 90), 9).dim(p(r0, a0), p(R, a0), `${L} cm`, p(R, 90), 9);
        const area = (R * R - r0 * r0) * t / 360;
        return piN(`자동차의 와이퍼가 회전축을 중심으로 ${t}°만큼 움직인다. 와이퍼의 고무날은 회전축에서 ${r0} cm 떨어진 곳부터 달려 있고 길이가 ${L} cm이다. 고무날이 지나간 부분의 넓이는?`, area, CM2, {
          figure: b.svg(`회전축을 중심으로 ${t}°만큼 벌어진 띠 모양이 색칠되어 있다. 띠의 안쪽 호는 회전축에서 ${r0} cm 떨어져 있고, 띠의 폭(고무날의 길이)은 ${L} cm이다`),
          explain: `고무날의 바깥쪽 끝은 회전축에서 ${r0} + ${L} = ${R}(cm) 떨어져 있다. 고무날이 지나간 부분은 반지름의 길이가 ${R} cm인 부채꼴에서 반지름의 길이가 ${r0} cm인 부채꼴을 뺀 것이므로 π × ${R}<sup>2</sup> × ${frac(t, 360)} − π × ${r0}<sup>2</sup> × ${frac(t, 360)} = ${area}π(${CM2})이다.`,
          facts: { calc: [[`((${r0}+${L})*(${r0}+${L})-${r0}*${r0})*${t}/360`, 0]], unseen: [360] }
        });
      }, { standard: FAN }),
      H('hard-ears', '곧은 변이 든 색칠한 부분의 둘레', '심61', (d) => {
        // 함정: 호의 길이만 더하는 아이(aπ), 정사각형의 둘레를 빠뜨리는 아이. 색칠한 두 부분의 둘레에는 호 2개와 정사각형의 변 4개가 모두 든다.
        const a = 2 * d.int(2, 6);
        return piPlus(`한 변의 길이가 ${a} cm인 정사각형의 내부에, 마주 보는 두 꼭짓점을 각각 중심으로 하고 정사각형의 한 변을 반지름으로 하는 부채꼴 두 개를 그렸다. 두 부채꼴이 겹친 부분을 뺀 나머지 두 부분(색칠한 부분)의 둘레의 길이의 합은?`, a, 4 * a, CM, {
          figure: leafFig(a, true),
          explain: `색칠한 두 부분은 저마다 정사각형의 변 2개와 호 1개로 둘러싸여 있다. 호 1개의 길이는 2π × ${a} × ${frac(90, 360)} = ${qv(a, 2)}π(cm)이다. 둘레의 길이의 합은 ${qv(a, 2)}π × 2 + ${a} × 4 = ${a}π + ${4 * a}(cm)이다.`,
          facts: { calc: [[`2*2*${a}*90/360`, 0], [`4*${a}`, 1]], unseen: [2, 90, 360, 4] }
        });
      }, { standard: FAN }),

      // ── ② 두 번 넘게 생각해야 풀리는 문제 ──
      H('hard-angle-words', '말로 준 각 사이의 관계로 내각의 크기 구하기', '심10·22', (d, n) => {
        if (n === 0) {
          const v = d.until(() => { const A = d.int(15, 40), p = d.pick([2, 3]), q = d.pick([1, 2, 3]); return { A, p, q, c: 180 - A * (1 + p + p * q) }; }, (w) => w.c !== 0 && Math.abs(w.c) <= 30 && w.q * w.p * w.A + w.c >= 30 && !(w.q === 1 && w.c === 0));
          const more = v.c > 0 ? `${v.c}°만큼 크다` : `${-v.c}°만큼 작다`, head = v.q === 1 ? '∠B의 크기보다' : `∠B의 크기의 ${v.q}배보다`;
          return degQ(`△ABC에서 ∠B의 크기는 ∠A의 크기의 ${v.p}배이고, ∠C의 크기는 ${head} ${more}. ∠A의 크기는?`, v.A, {
            explain: `∠A의 크기를 ${X}°라 하면 ∠B = ${v.p}${X}°, ∠C = (${v.p * v.q}${X} ${v.c > 0 ? '+' : '−'} ${Math.abs(v.c)})°이다. 세 내각의 크기의 합은 180°이므로 ${1 + v.p + v.p * v.q}${X} ${v.c > 0 ? '+' : '−'} ${Math.abs(v.c)} = 180에서 ${X} = ${v.A}이다.`,
            facts: { calc: [[`(180-(${v.c}))/(1+${v.p}+${v.p}*${v.q})`, 0]], unseen: [180, 1] }
          });
        }
        const m = d.pick([5, 6]), gap = m === 5 ? d.pick([5, 8, 10, 12, 15]) : d.pick([4, 6, 8, 10, 12]), mean = inSum(m) / m, big = mean + (m - 1) * gap / 2;
        return degQ(`${gon(m)}의 ${m === 5 ? '다섯' : '여섯'} 내각의 크기가 작은 것부터 차례로 ${gap}°씩 커진다. 가장 큰 내각의 크기는?`, big, {
          explain: `가장 작은 내각의 크기를 ${X}°라 하면 내각의 크기의 합은 ${m}${X} + ${gap * m * (m - 1) / 2} = ${inSum(m)}이다. ${X} = ${mean - (m - 1) * gap / 2}이므로 가장 큰 내각의 크기는 ${mean - (m - 1) * gap / 2}° + ${gap}° × ${m - 1} = ${big}°이다.`,
          facts: { calc: [[`${inSum(m)}/${m}+(${m}-1)*${gap}/2`, 0]], unseen: [inSum(m), m, 1, 2] }
        });
      }, { count: 2 }),
      H('hard-bisector-ext', '외각이 주어진 삼각형의 각의 이등분선', '심14 / 기본 ①23', (d) => {
        const draw = ([bv, e]) => {
          const a = e - bv, h = a / 2, t = triOf(a, bv, 180 - e, [185, 132]), b = Board(), D = [t.B[0] + dist(t.A, t.B) * Math.sin(h * RAD) / Math.sin((bv + h) * RAD), t.B[1]], E = [t.C[0] + 46, t.C[1]];
          b.poly([t.B, t.C, t.A]).seg(t.A, D).seg(t.C, E).corner(t.B, t.C, t.A, bv + '°').corner(t.C, E, t.A, e + '°').corner(D, t.C, t.A, sv('x'), { square: false });
          b.sym(t.A, (dirOf(t.A, t.B) + dirOf(t.A, D)) / 2, 'dot', 26).sym(t.A, (dirOf(t.A, D) + dirOf(t.A, t.C)) / 2, 'dot', 26);
          return b.name(t.A, 'A', 90).name(t.B, 'B', awayFrom(t.B, [t.A, t.C])).name(t.C, 'C', 270).name(D, 'D', 270).name(E, 'E', 270);
        };
        const [bv, e] = d.until(() => [5 * d.int(7, 12), 2 * d.int(50, 70)], (w) => (w[1] - w[0]) % 2 === 0 && w[1] - w[0] >= 50 && w[1] - w[0] <= 90 && 180 - w[1] >= 40 && !draw(w).clash()), a = e - bv, h = a / 2, x = bv + h, b = draw([bv, e]);
        return degQ(`△ABC에서 ∠A의 이등분선이 변 BC와 만나는 점을 D라 하고, 변 BC의 연장선 위에 점 E를 잡았다. ∠B = ${bv}°, ∠ACE = ${e}°일 때, ∠ADC의 크기는?`, x, {
          figure: b.svg(`삼각형 ABC와 선분 AD. 점 D는 변 BC 위에 있고, ∠BAD와 ∠DAC에 크기가 같다는 표시가 있다. 점 E는 변 BC를 점 C 쪽으로 늘인 선 위에 있다. ∠B = ${bv}°, ∠ACE = ${e}°, ∠ADC = x`),
          explain: `∠ACE는 △ABC의 외각이므로 ∠BAC = ${e}° − ${bv}° = ${a}°이고 ∠BAD = ${h}°이다. ∠ADC는 △ABD의 외각이므로 ∠ADC = ∠B + ∠BAD = ${bv}° + ${h}° = ${x}°이다.`,
          facts: { calc: [[`${bv}+(${e}-${bv})/2`, 0]], unseen: [2] }
        });
      }),
      H('hard-bisectors-in', '두 내각의 이등분선이 만나 이루는 각', '심15 / 기본 ①26', (d, n) => {
        const [a, bv, c] = d.until(() => { const A = 2 * d.int(20, 50), Bv = 2 * d.int(22, 38); return [A, Bv, 180 - A - Bv]; }, (w) => w[2] >= 44 && w[2] <= 80 && w[1] !== w[2]), x = 90 + a / 2;
        const t = fitted((L) => { const w = baseTri(bv, c, L); return Object.assign(w, { I: meet(w.B, at(w.B, 10, bv / 2), w.C, at(w.C, 10, 180 - c / 2)) }); }, [190, 140]), b = Board(), I = t.I;
        b.poly([t.B, t.C, t.A]).seg(t.B, I).seg(t.C, I);
        b.sym(t.B, bv / 4, 'dot', 34).sym(t.B, 3 * bv / 4, 'dot', 34).sym(t.C, 180 - c / 4, 'x', 34).sym(t.C, 180 - 3 * c / 4, 'x', 34);
        b.corner(t.A, t.B, t.C, n === 0 ? a + '°' : sv('x'), { square: false }).corner(I, t.B, t.C, n === 0 ? sv('x') : x + '°');
        b.name(t.A, 'A', 90).name(t.B, 'B', awayFrom(t.B, [t.A, t.C])).name(t.C, 'C', awayFrom(t.C, [t.A, t.B])).name(I, 'I', 90, 13);
        const said = `삼각형 ABC와 그 내부의 점 I. 선분 BI와 선분 CI가 그어져 있다. ∠ABI와 ∠IBC에 크기가 같다는 표시(●)가, ∠ACI와 ∠ICB에 크기가 같다는 표시(×)가 있다. `, lead = '△ABC에서 ∠B의 이등분선과 ∠C의 이등분선이 만나는 점을 I라 하자.';
        if (n === 0) return degQ(`${lead} ∠A = ${a}°일 때, ∠BIC의 크기는?`, x, {
          figure: b.svg(`${said}∠A = ${a}°, ∠BIC = x`),
          explain: `∠ABC + ∠ACB = 180° − ${a}° = ${180 - a}°이므로 ∠IBC + ∠ICB = ${180 - a}° ÷ 2 = ${(180 - a) / 2}°이다. △IBC에서 ∠BIC = 180° − ${(180 - a) / 2}° = ${x}°이다.`,
          facts: { calc: [[`180-(180-${a})/2`, 0]], unseen: [180, 2] }
        });
        return degQ(`${lead} ∠BIC = ${x}°일 때, ∠A의 크기는?`, a, {
          figure: b.svg(`${said}∠BIC = ${x}°, ∠A = x`),
          explain: `△IBC에서 ∠IBC + ∠ICB = 180° − ${x}° = ${180 - x}°이므로 ∠ABC + ∠ACB = ${180 - x}° × 2 = ${2 * (180 - x)}°이다. △ABC에서 ∠A = 180° − ${2 * (180 - x)}° = ${a}°이다.`,
          facts: { calc: [[`180-2*(180-${x})`, 0]], unseen: [180, 2] }
        });
      }, { count: 2 }),
      H('hard-bisector-in-out', '내각의 이등분선과 외각의 이등분선이 만나 이루는 각', '심16 / 기본 ①27', (d) => {
        const v = d.until(() => { const A = 2 * d.int(32, 46), Bv = 2 * d.int(22, 32); return { A, Bv, Cv: 180 - A - Bv }; }, (w) => w.Cv >= 40 && w.Cv <= 72), e = v.A / 2;
        const ext = 180 - v.Cv, t = fitted((L) => { const w = baseTri(v.Bv, v.Cv, L), E = meet(w.B, at(w.B, 10, v.Bv / 2), w.C, at(w.C, 10, ext / 2)); return Object.assign(w, { E, D: [Math.max(L * 1.45, E[0]), 0] }); }, [232, 150]), b = Board(), E = t.E, D = t.D;
        b.poly([t.B, t.C, t.A]).seg(t.C, D).seg(t.B, E).seg(t.C, E);
        b.sym(t.B, v.Bv / 4, 'dot', 36).sym(t.B, 3 * v.Bv / 4, 'dot', 36).sym(t.C, ext / 4, 'x', 24).sym(t.C, 3 * ext / 4, 'x', 24);
        b.corner(E, t.B, t.C, e + '°').corner(t.A, t.B, t.C, sv('x'), { square: false });
        b.name(t.A, 'A', awayFrom(t.A, [t.B, t.C])).name(t.B, 'B', awayFrom(t.B, [t.A, t.C])).name(t.C, 'C', 270).name(D, 'D', 270).name(E, 'E', awayFrom(E, [t.B, t.C]));
        return degQ(`△ABC에서 변 BC의 연장선 위에 점 D가 있다. ∠B의 이등분선과 ∠ACD의 이등분선이 만나는 점을 E라 하자. ∠BEC = ${e}°일 때, ∠A의 크기는?`, v.A, {
          figure: b.svg(`삼각형 ABC. 점 D는 변 BC를 점 C 쪽으로 늘인 선 위에 있다. 점 B에서 그은 선분과 점 C에서 그은 선분이 삼각형 밖의 점 E에서 만난다. ∠ABE와 ∠EBC에 크기가 같다는 표시(●)가, ∠ACE와 ∠ECD에 크기가 같다는 표시(×)가 있다. ∠BEC = ${e}°, ∠A = x`),
          explain: `∠EBC의 크기를 ●, ∠ECD의 크기를 ×라 하자. △EBC에서 × = ● + ${e}°이다. △ABC에서 ∠ACD = ∠A + ∠ABC이므로 2× = ∠A + 2●이다. 앞의 식을 2배 하면 2× = 2● + ${2 * e}°이므로 ∠A = ${2 * e}°이다.`,
          facts: { calc: [[`2*${e}`, 0]], unseen: [2] }
        });
      }),
      H('hard-bisectors-out', '두 외각의 이등분선이 만나 이루는 각', '심17', (d) => {
        const v = d.until(() => { const Bv = 2 * d.int(22, 40), Cv = 5 * d.int(8, 14); return { Bv, Cv, A: 180 - Bv - Cv }; }, (w) => w.A >= 45 && w.A <= 85), x = 90 - v.Bv / 2;
        const extA = v.Bv + v.Cv, extC = 180 - v.Cv;
        const t = fitted((L) => { const w = baseTri(v.Bv, v.Cv, L); return Object.assign(w, { P: at(w.A, 0.42 * L, v.Bv), Q: [L * 1.5, 0], D: meet(w.A, at(w.A, 10, (v.Bv - v.Cv) / 2), w.C, at(w.C, 10, extC / 2)) }); }, [226, 165]), b = Board(), pP = t.P, Q = t.Q, D = t.D;
        b.poly([t.B, t.C, t.A]).seg(t.A, pP).seg(t.C, Q).seg(t.A, D).seg(t.C, D);
        b.sym(t.A, -v.Cv + extA / 4, 'dot', 24).sym(t.A, -v.Cv + 3 * extA / 4, 'dot', 24).sym(t.C, extC / 4, 'x', 24).sym(t.C, 3 * extC / 4, 'x', 24);
        b.corner(t.B, t.C, t.A, v.Bv + '°').corner(D, t.A, t.C, sv('x'), { square: false });
        b.name(t.A, 'A', v.Bv + 90).name(t.B, 'B', awayFrom(t.B, [t.A, t.C])).name(t.C, 'C', 270).name(D, 'D', awayFrom(D, [t.A, t.C]));
        return degQ(`△ABC에서 ∠A의 외각의 이등분선과 ∠C의 외각의 이등분선이 만나는 점을 D라 하자. ∠B = ${v.Bv}°일 때, ∠ADC의 크기는?`, x, {
          figure: b.svg(`삼각형 ABC. 변 BA를 점 A 너머로, 변 BC를 점 C 너머로 늘인 선이 그어져 있다. 점 A에서 그은 선분과 점 C에서 그은 선분이 변 AC의 바깥쪽에 있는 점 D에서 만난다. ∠A의 외각을 둘로 나눈 두 각에 크기가 같다는 표시(●)가, ∠C의 외각을 둘로 나눈 두 각에 크기가 같다는 표시(×)가 있다. ∠B = ${v.Bv}°, ∠ADC = x`),
          explain: `△ABC의 외각의 크기의 합은 360°이고 ∠B의 외각의 크기는 180° − ${v.Bv}° = ${180 - v.Bv}°이므로 ∠A의 외각과 ∠C의 외각의 크기의 합은 360° − ${180 - v.Bv}° = ${180 + v.Bv}°이다. ∠DAC + ∠DCA = ${180 + v.Bv}° ÷ 2 = ${90 + v.Bv / 2}°이므로 △ADC에서 ∠ADC = 180° − ${90 + v.Bv / 2}° = ${x}°이다.`,
          facts: { calc: [[`180-(360-(180-${v.Bv}))/2`, 0]], unseen: [180, 360, 2] }
        });
      }),
      H('hard-iso-chain', '이등변삼각형이 이어진 그림에서 외각을 거듭 쓰기', '심18 / 기본 ①28', (d, n) => {
        if (n < 2) {
          const x = d.int(22, 36), s = 86, b = Board(), pB = [0, 0], pD = at(pB, s, x), pC = [2 * s * Math.cos(x * RAD), 0], pA = at(pB, s + 2 * s * Math.cos(2 * x * RAD), x), E = [pC[0] + 48, 0];
          b.seg(pB, pA).seg(pB, E).seg(pD, pC).seg(pC, pA).tick(pB, pD).tick(pD, pC).tick(pC, pA);
          b.corner(pB, pC, pD, n === 0 ? sv('x') : x + '°').corner(pC, E, pA, n === 0 ? 3 * x + '°' : sv('x'), { square: false });
          b.name(pA, 'A', awayFrom(pA, [pD, pC])).name(pB, 'B', 180).name(pC, 'C', 270).name(pD, 'D', x + 90).name(E, 'E', 270);
          const lead = `△ABC에서 점 D는 변 AB 위의 점이고 점 E는 변 BC의 연장선 위의 점이다. ${nb(`${sg('AC')} = ${sg('CD')} = ${sg('DB')}`)}이고`, said = '삼각형 ABC. 점 D는 변 AB 위에 있고 선분 CD가 그어져 있다. 점 E는 변 BC를 점 C 쪽으로 늘인 선 위에 있다. 선분 AC, 선분 CD, 선분 DB에 길이가 같다는 표시가 있다. ';
          const why = (v) => `${sg('DB')} = ${sg('DC')}이므로 ∠DCB = ∠B = ${v}이다. ∠ADC는 △DBC의 외각이므로 ${v} + ${v}이고, ${sg('CD')} = ${sg('CA')}이므로 ∠A = ∠ADC이다. ∠ACE는 △ABC의 외각이므로 ∠ACE = ∠B + ∠A이다.`;
          if (n === 0) return degQ(`${lead} ∠ACE = ${3 * x}°일 때, ∠B의 크기는?`, x, {
            figure: b.svg(`${said}∠ACE = ${3 * x}°, ∠B = x`),
            explain: `∠B = ∠${X}라 하자. ${why(`∠${X}`)} ∠${X} + 2∠${X} = ${3 * x}°에서 ∠${X} = ${x}°이다.`, facts: { calc: [[`${3 * x}/3`, 0]], unseen: [3], rule: 'iso-chain-back' }
          });
          return degQ(`${lead} ∠B = ${x}°일 때, ∠ACE의 크기는?`, 3 * x, {
            figure: b.svg(`${said}∠B = ${x}°, ∠ACE = x`),
            explain: `${why(`${x}°`)} ∠A = ${2 * x}°이므로 ∠ACE = ${x}° + ${2 * x}° = ${3 * x}°이다.`, facts: { calc: [[`${x}+2*${x}`, 0]], unseen: [2], rule: 'iso-chain-forward' }
          });
        }
        const x = d.int(18, 26), s = 74, b = Board(), pA = [0, 0], cx = Math.cos(x * RAD), pB = at(pA, s, x), pC = [2 * s * cx, 0], pD = at(pA, s + 2 * s * Math.cos(2 * x * RAD), x), pE = [2 * s * cx + 2 * s * Math.cos(3 * x * RAD), 0], F = at(pD, 42, x);
        b.seg(pA, F).seg(pA, [pE[0] + 20, 0]).seg(pB, pC).seg(pC, pD).seg(pD, pE).tick(pA, pB).tick(pB, pC).tick(pC, pD).tick(pD, pE);
        b.corner(pA, pC, pB, sv('x')).corner(pD, F, pE, 4 * x + '°');
        b.name(pA, 'A', 180).name(pB, 'B', x + 90).name(pC, 'C', 270).name(pD, 'D', x + 90).name(pE, 'E', 270).name(F, 'F', x + 90);
        return degQ(`∠A의 한 변 위에 세 점 B, D, F가, 다른 변 위에 두 점 C, E가 있다. ${nb(`${sg('AB')} = ${sg('BC')} = ${sg('CD')} = ${sg('DE')}`)}이고 ∠FDE = ${4 * x}°일 때, ∠A의 크기는?`, x, {
          figure: b.svg(`점 A에서 나간 두 반직선. 한 반직선 위에 점 B, D, F가, 다른 반직선 위에 점 C, E가 점 A에서 가까운 쪽부터 이 차례로 놓여 있다. 선분 BC, 선분 CD, 선분 DE가 두 반직선 사이를 번갈아 잇고, 선분 AB, BC, CD, DE에 길이가 같다는 표시가 있다. ∠FDE = ${4 * x}°, ∠A = x`),
          explain: `∠A = ∠${X}라 하자. △ABC에서 ∠BCA = ∠${X}이고 외각 ∠CBD = 2∠${X}이다. △BCD에서 ∠CDB = 2∠${X}이고, △ACD의 외각 ∠DCE = ∠${X} + 2∠${X} = 3∠${X}이다. △CDE에서 ∠DEC = 3∠${X}이고, △ADE의 외각 ∠FDE = ∠${X} + 3∠${X} = 4∠${X}이다. 4∠${X} = ${4 * x}°에서 ∠${X} = ${x}°이다.`,
          facts: { calc: [[`${4 * x}/4`, 0]], unseen: [4] }
        });
      }, { count: 3 }),
      H('hard-ratio-regular', '한 내각과 한 외각의 크기의 비로 정다각형 찾기', '심25 / 기본 ①49', (d) => {
        const m = d.pick([5, 8, 9, 10, 12, 15, 18, 20]), g = gcd(inOf(m), exOf(m)), p = inOf(m) / g, q = exOf(m) / g;
        return rgonQ(`한 내각의 크기와 한 외각의 크기의 비가 ${nb(`${p} : ${q}`)}인 정다각형은 정몇각형인가?`, m, {
          explain: `한 내각의 크기와 한 외각의 크기의 합은 180°이므로 한 외각의 크기는 180° × ${frac(q, `${p} + ${q}`)} = ${exOf(m)}°이다. 360° ÷ ${exOf(m)}° = ${m}이므로 ${rgon(m)}이다.`,
          facts: { calc: [[`360/(180*${q}/(${p}+${q}))`, 0]], unseen: [360, 180] }
        });
      }),
      H('hard-reg-diagonal', '정다각형의 대각선이 이루는 각', '심27 / 기본 ①50', (d, n) => {
        if (n === 0) {
          const m = d.pick([5, 9, 10, 12]), P = regPts(m, m === 5 ? 64 : m === 9 ? 46 : m === 10 ? 42 : 36), names = vnames(P), i0 = names.indexOf('A'), q = (k) => P[(i0 + k) % m], b = Board(), base = 180 / m, x = inOf(m) - base;
          b.poly(P).seg(q(0), q(2)).corner(q(2), q(0), q(3), sv('x'), { square: false });
          P.forEach((p, i) => b.name(p, names[i], awayFrom(p, [P[(i + m - 1) % m], P[(i + 1) % m]])));
          return degQ(`${rgon(m)} ${ALPHA.slice(0, m)}에서 대각선 AC를 그었다. ∠ACD의 크기는?`, x, {
            figure: b.svg(`${rgon(m)} ${ALPHA.slice(0, m)}. 꼭짓점 ${ALPHA.slice(0, m).split('').join(', ')}가 이 차례로 놓여 있고 대각선 AC가 그어져 있다. ∠ACD = x`),
            explain: `${rgon(m)}의 한 내각의 크기는 ${inOf(m)}°이다. △ABC는 ${sg('BA')} = ${sg('BC')}인 이등변삼각형이므로 ∠BCA = (180° − ${inOf(m)}°) ÷ 2 = ${base}°이다. ∠ACD = ${inOf(m)}° − ${base}° = ${x}°이다.`,
            facts: { calc: [[`180*(${m}-2)/${m}-(180-180*(${m}-2)/${m})/2`, 0]], unseen: [180, 2, m] }
          });
        }
        const m = d.pick([5, 6]), P = regPts(m, m === 5 ? 76 : 66), names = vnames(P), i0 = names.indexOf('A'), q = (k) => P[(i0 + k) % m], b = Board(), base = 180 / m, Q = meet(q(0), q(2), q(1), q(3)), small = d.bool(), ask = small ? 'APB' : 'APD', x = small ? 2 * base : 180 - 2 * base;
        b.poly(P).seg(q(0), q(2)).seg(q(1), q(3)).corner(Q, q(0), small ? q(1) : q(3), sv('x'), { square: false });
        P.forEach((p, i) => b.name(p, names[i], awayFrom(p, [P[(i + m - 1) % m], P[(i + 1) % m]])));
        b.name(Q, 'P', awayFrom(Q, [q(0), small ? q(1) : q(3)]), 13);
        return degQ(`${rgon(m)} ${ALPHA.slice(0, m)}에서 두 대각선 AC, BD가 만나는 점을 P라 할 때, ∠${ask}의 크기는?`, x, {
          figure: b.svg(`${rgon(m)} ${ALPHA.slice(0, m)}. 꼭짓점 ${ALPHA.slice(0, m).split('').join(', ')}가 이 차례로 놓여 있고, 대각선 AC와 대각선 BD가 점 P에서 만난다. ∠${ask} = x`),
          explain: `${rgon(m)}의 한 내각의 크기는 ${inOf(m)}°이다. △ABC와 △BCD는 이등변삼각형이므로 ∠PCB = ∠PBC = (180° − ${inOf(m)}°) ÷ 2 = ${base}°이다. ${small ? `∠APB는 △PBC의 외각이므로 ${base}° + ${base}° = ${x}°이다.` : `△PBC에서 ∠BPC = 180° − (${base}° + ${base}°) = ${x}°이고, ∠APD는 ∠BPC의 맞꼭지각이므로 ${x}°이다.`}`,
          facts: { calc: [[small ? `2*(180-180*(${m}-2)/${m})/2` : `180-2*(180-180*(${m}-2)/${m})/2`, 0]], unseen: [180, 2, m] }
        });
      }, { count: 2 }),
      H('hard-reg-gap', '맞댄 두 정다각형의 변을 늘여 만나는 각', '심29 / 기본 ①52', (d) => {
        const [m1, m2] = d.pick([[6, 5], [5, 6], [5, 4], [4, 5], [6, 4], [4, 6]]), s = Math.min(sideFor(m1, m2) * 0.9, 52), J = joined(m1, m2, s), b = J.b;
        const pA = J.S1, pB = J.L[2], pC = J.R[m2 - 1], Q = meet(J.L[3], pB, J.R[m2 - 2], pC), gap = 360 - inOf(m1) - inOf(m2), x = 360 - gap - exOf(m1) - exOf(m2);
        b.seg(pB, Q).seg(pC, Q).corner(Q, pB, pC, sv('x'), { square: false });
        b.name(pA, 'A', 90, 14).name(pB, 'B', awayFrom(pB, [J.L[3], Q, pA])).name(pC, 'C', awayFrom(pC, [J.R[m2 - 2], Q, pA])).name(Q, 'P', awayFrom(Q, [pB, pC]));
        return degQ(`한 변의 길이가 같은 ${rgon(m1)}과 ${rgon(m2)}을 한 변이 꼭 맞게 붙였다. 붙은 변의 한 끝 점 A와 이웃한 두 도형의 꼭짓점을 각각 B, C라 하고, 점 B, C에서 변 AB, AC가 아닌 변을 늘여 만나는 점을 P라 할 때, ∠BPC의 크기는?`, x, {
          figure: b.svg(`왼쪽의 ${rgon(m1)}과 오른쪽의 ${rgon(m2)}이 세로로 놓인 한 변을 함께 쓴다. 그 변의 위 끝 점이 A이고, 점 A와 이웃한 ${rgon(m1)}의 꼭짓점이 B, ${rgon(m2)}의 꼭짓점이 C이다. ${rgon(m1)}의 변 가운데 점 B에서 만나는 다른 변을 점 B 너머로 늘인 선과, ${rgon(m2)}의 변 가운데 점 C에서 만나는 다른 변을 점 C 너머로 늘인 선이 점 P에서 만난다. ∠BPC = x`),
          explain: `∠BAC = 360° − (${inOf(m1)}° + ${inOf(m2)}°) = ${gap}°이다. ∠ABP는 ${rgon(m1)}의 외각이므로 ${exOf(m1)}°, ∠ACP는 ${rgon(m2)}의 외각이므로 ${exOf(m2)}°이다. 사각형 ABPC의 내각의 크기의 합은 360°이므로 ∠BPC = 360° − (${gap}° + ${exOf(m1)}° + ${exOf(m2)}°) = ${x}°이다.`,
          facts: { calc: [[`360-(360-180*(${m1}-2)/${m1}-180*(${m2}-2)/${m2})-360/${m1}-360/${m2}`, 0]], unseen: [360, 180, 2, m1, m2] }
        });
      }),
      H('hard-ring', '정다각형을 이어 붙여 고리를 만들 때 필요한 개수', '심30', (d) => {
        const [m, inner] = d.pick([[5, 10], [6, 6], [8, 4]]), s = m === 5 ? 48 : m === 6 ? 42 : 36, b = Board(), R = s / (2 * Math.sin(Math.PI / inner)), Q = (k) => at([0, 0], R, 90 + (1.5 - k) * 360 / inner), bend = 360 - 2 * inOf(m);
        for (let k = 0; k < 3; k += 1) b.poly(regOn(Q(k), Q(k + 1), m));
        return cntQ(`합동인 ${rgon(m)}을 그림과 같이 이웃한 것끼리 한 변이 꼭 맞게 계속 이어 붙였더니 처음 ${rgon(m)}과 만나 고리 모양이 되었다. 고리를 이루는 ${rgon(m)}은 모두 몇 개인가?`, inner, {
          figure: b.svg(`합동인 ${rgon(m)} 3개가 나란히 놓여 이웃한 것끼리 한 변을 함께 쓴다. 세 ${rgon(m)}의 아래쪽 변이 하나씩 이어져 한쪽으로 꺾여 가는 선을 이룬다`),
          explain: `이웃한 두 ${rgon(m)}이 맞닿은 꼭짓점에서 고리의 안쪽에 생기는 각의 크기는 360° − ${inOf(m)}° × 2 = ${bend}°이다. 고리의 안쪽은 한 내각의 크기가 ${bend}°인 정다각형이고 그 한 외각의 크기는 ${180 - bend}°이므로 360° ÷ ${180 - bend}° = ${inner}에서 ${rgon(inner)}이다. ${rgon(m)}은 그 변마다 하나씩 있으므로 ${inner}개이다.`,
          facts: { calc: [[`360/(180-(360-2*(180*(${m}-2)/${m})))`, 0]], unseen: [360, 180, 2, m] }
        });
      }),
      H('hard-arc-to-angle', '호의 길이의 비로 이등변삼각형의 각 구하기', '심45', (d) => {
        const [p, q] = d.pick([[3, 2], [2, 1], [1, 2], [5, 4], [4, 5], [7, 2], [2, 7], [2, 3], [7, 8], [8, 7], [13, 5], [5, 13]]), boc = 180 * q / (p + q), x = boc / 2, c = ring(66);
        c.b.seg(c.pt(180), c.pt(0)).seg(c.O, c.pt(boc)).seg(c.pt(180), c.pt(boc)).corner(c.pt(boc), c.O, c.pt(180), sv('x'), { square: false });
        mark(c, 180, 'A'); mark(c, 0, 'C'); mark(c, boc, 'B'); centre(c, 270);
        return degQ(`선분 AC는 원 O의 지름이고 점 B는 원 O 위의 점이다. 호 AB와 호 BC의 길이의 비가 ${nb(`${p} : ${q}`)}일 때, ∠OBA의 크기는?`, x, {
          figure: c.b.svg('원 O의 지름 AC와 원 위의 점 B. 반지름 OB와 현 AB가 그어져 있다. ∠OBA = x'),
          explain: `호의 길이는 중심각의 크기에 정비례하므로 ∠AOB = 180° × ${frac(p, `${p} + ${q}`)} = ${180 - boc}°이다. ${sg('OA')} = ${sg('OB')}이므로 △OAB는 이등변삼각형이고 ∠OBA = (180° − ${180 - boc}°) ÷ 2 = ${x}°이다.`,
          facts: { calc: [[`(180-180*${p}/(${p}+${q}))/2`, 0]], unseen: [180, 2] }
        });
      }, { standard: FAN }),
      H('hard-parallel-arc', '평행선과 반지름으로 생긴 이등변삼각형으로 호의 길이 구하기', '심47·48 / 기본 ①67', (d, n) => {
        if (n === 0) {
          const [t, num, den] = d.pick([[36, 3, 1], [40, 5, 2], [45, 2, 1], [50, 8, 5]]), k = d.int(den === 1 ? 2 : 1, den === 5 ? 2 : 4), L = den * k, x = num * k, c = ring(78);
          c.b.seg(c.pt(180), c.pt(0)).seg(c.O, c.pt(t)).seg(c.pt(180), c.pt(2 * t)).arrow(c.pt(180), c.pt(2 * t), 0.5).arrow(c.O, c.pt(t), 0.6).angle(c.O, 0, t, t + '°', { r: 16 }).arcDim(c.O, c.R, 0, t, `${L} cm`);
          mark(c, 180, 'A'); mark(c, 0, 'B', -13); mark(c, t, 'C', 13); mark(c, 2 * t, 'D'); centre(c, 270);
          return N(`선분 AB는 원 O의 지름이고 ${nb(`${sg('AD')} ∥ ${sg('OC')}`)}이다. ∠COB = ${t}°이고 호 BC의 길이가 ${L} cm일 때, 호 AD의 길이는 몇 cm인가?`, x, {
            unit: 'cm', figure: c.b.svg(`원 O의 지름 AB와 원 위의 두 점 C, D. 반지름 OC와 현 AD가 그어져 있고 두 선분에 평행하다는 표시가 있다. ∠COB = ${t}°, 호 BC의 길이는 ${L} cm`),
            explain: `${sg('AD')} ∥ ${sg('OC')}이므로 ∠DAO = ∠COB = ${t}°(동위각)이다. 반지름 OD를 그으면 ${sg('OA')} = ${sg('OD')}이므로 ∠ODA = ${t}°이고 ∠AOD = 180° − ${2 * t}° = ${180 - 2 * t}°이다. 호의 길이는 중심각의 크기에 정비례하므로 ${t} : ${180 - 2 * t} = ${L} : (호 AD의 길이)에서 호 AD의 길이는 ${x} cm이다.`,
            facts: { calc: [[`${L}*(180-2*${t})/${t}`, 0]], unseen: [180, 2] }
          });
        }
        const u = d.pick([30, 36, 40, 45]), v = 180 - 2 * u, c = ring(66);
        c.b.seg(c.pt(180), c.pt(0)).seg(c.pt(180 - u), c.pt(u)).seg(c.O, c.pt(180 - u)).seg(c.O, c.pt(u)).arrow(c.pt(180), c.pt(0), 0.8).arrow(c.pt(180 - u), c.pt(u), 0.8).angle(c.O, u, 180 - u, v + '°', { r: 10 });
        mark(c, 180, 'A'); mark(c, 0, 'B'); mark(c, 180 - u, 'C'); mark(c, u, 'D'); centre(c, 270);
        return N(`선분 AB는 원 O의 지름이고 ${nb(`${sg('AB')} ∥ ${sg('CD')}`)}이다. ∠COD = ${v}°일 때, 원 O의 둘레의 길이는 호 AC의 길이의 몇 배인가?`, 360 / u, {
          unit: '배', figure: c.b.svg(`원 O의 지름 AB와 현 CD. 두 선분에 평행하다는 표시가 있다. 점 C는 점 A 쪽에, 점 D는 점 B 쪽에 있고 반지름 OC, OD가 그어져 있다. ∠COD = ${v}°`),
          explain: `${sg('OC')} = ${sg('OD')}이므로 ∠OCD = (180° − ${v}°) ÷ 2 = ${u}°이다. ${sg('AB')} ∥ ${sg('CD')}이므로 ∠AOC = ∠OCD = ${u}°(엇각)이다. 원의 둘레에 대한 중심각의 크기는 360°이므로 원의 둘레의 길이는 호 AC의 길이의 360 ÷ ${u} = ${360 / u}(배)이다.`,
          facts: { calc: [[`360/((180-${v})/2)`, 0]], unseen: [360, 180, 2] }
        });
      }, { count: 2, standard: FAN }),
      H('hard-secant-arc', '지름의 연장선과 현의 연장선이 만날 때의 호의 길이', '심50', (d) => {
        const p = d.pick([20, 22, 24, 25, 26, 28]), k = d.int(2, 12), L = 3 * k, c = ring(60), pP = [2 * c.R * Math.cos(p * RAD), 0], pD = c.pt(p), pC = c.pt(180 - 3 * p);
        c.b.seg(c.pt(180), pP).seg(pP, pC).seg(c.O, pC).seg(c.O, pD).tick(c.O, pD).tick(pD, pP).angle(pP, 180 - p, 180, '', { r: 30, square: false }).text([pP[0] - 27, 12], p + '°', { blue: true });
        c.b.arcDim(c.O, c.R, 180 - 3 * p, 180, `${L} cm`);
        mark(c, 180, 'A', 13); c.b.dot(c.pt(0)).name(c.pt(0), 'B', 55, 12); mark(c, 180 - 3 * p, 'C', -13); c.b.dot(pD).name(pD, 'D', p + 25, 12); c.b.name(pP, 'P', 0, 12); c.b.dot(c.O).name(c.O, 'O', 250, 12);
        return N(`원 O의 지름 AB의 연장선과 현 CD의 연장선이 점 P에서 만난다. ${nb(`${sg('OD')} = ${sg('PD')}`)}이고 ∠BPD = ${p}°, 호 AC의 길이가 ${L} cm일 때, 호 BD의 길이는 몇 cm인가?`, k, {
          unit: 'cm', figure: c.b.svg(`원 O의 지름 AB를 점 B 쪽으로 늘인 선과 현 CD를 점 D 쪽으로 늘인 선이 원 밖의 점 P에서 만난다. 반지름 OC, OD가 그어져 있고 선분 OD와 선분 PD에 길이가 같다는 표시가 있다. ∠BPD = ${p}°, 호 AC의 길이는 ${L} cm`),
          explain: `${sg('OD')} = ${sg('PD')}이므로 ∠DOP = ∠P = ${p}°이다. ∠ODC는 △DOP의 외각이므로 ${p}° + ${p}° = ${2 * p}°이고, ${sg('OC')} = ${sg('OD')}이므로 ∠OCD = ${2 * p}°이다. ∠AOC는 △OCP의 외각이므로 ${2 * p}° + ${p}° = ${3 * p}°이다. 호의 길이는 중심각의 크기에 정비례하므로 ${3 * p} : ${p} = ${L} : (호 BD의 길이)에서 호 BD의 길이는 ${k} cm이다.`,
          facts: { calc: [[`${L}*${p}/(2*${p}+${p})`, 0]], unseen: [2] }
        });
      }, { standard: FAN }),
      H('hard-chord-radius-sector', '반지름과 길이가 같은 현으로 생긴 부채꼴', '기본 ①58', (d) => {
        const r = d.pick([6, 12, 18]), c = ring(64), turn = d.int(-2, 2) * 10, a0 = 60 + turn, a1 = 120 + turn;
        c.b.fan(c.O, c.R, a0, a1, TINT).seg(c.pt(a0), c.pt(a1)).beside(c.O, c.pt(a1), `${r} cm`, c.pt(a0)).beside(c.pt(a1), c.pt(a0), `${r} cm`, c.pt(90 + turn), { plain: true, gap: 3 });
        mark(c, a1, 'A'); mark(c, a0, 'B'); centre(c, 270 + turn);
        return piN(`반지름의 길이가 ${r} cm인 원 O에서 현 AB의 길이가 ${r} cm일 때, 부채꼴 AOB의 넓이는?`, r * r / 6, CM2, {
          figure: c.b.svg(`원 O와 원 위의 두 점 A, B. 부채꼴 AOB가 색칠되어 있고 현 AB가 그어져 있다. 반지름 OA의 길이는 ${r} cm, 현 AB의 길이는 ${r} cm`),
          explain: `${sg('OA')} = ${sg('OB')} = ${sg('AB')}이므로 △OAB는 정삼각형이고 ∠AOB = 60°이다. 부채꼴 AOB의 넓이는 π × ${r}<sup>2</sup> × ${frac(60, 360)} = ${r * r / 6}π(${CM2})이다.`,
          facts: { calc: [[`${r}*${r}*(180/3)/360`, 0]], unseen: [180, 3, 360] }
        });
      }, { standard: FAN }),
      H('hard-band-from-arc', '호의 길이로 중심각을 찾아 띠의 넓이 구하기', '심57 / 기본 ①83', (d) => {
        const [R, k] = d.pick([[8, 2], [8, 3], [12, 2], [12, 3], [12, 4], [16, 2], [16, 4], [16, 6]]), r = R / 2, t = 360 * k / R, area = (R * R - r * r) * t / 360, sc = (t > 120 ? 128 : 150) / R, b = Board(), O = [0, 0], p = (len, a) => at(O, len * sc, a);
        b.shape(`M${XY(p(r, 0))}L${XY(p(R, 0))}${arcTo(O, R * sc, 0, t)}L${XY(p(r, t))}${arcTo(O, r * sc, t, 0)}Z`, [p(r, 0), p(R, 0), p(R, t), p(r, t), p(R, t / 2)], TINT);
        b.fan(O, r * sc, 0, t).tick(O, p(r, 0)).tick(p(r, 0), p(R, 0)).dim(O, p(R, 0), `${R} cm`, [0, -20], 25).text(at(O, r * sc + (K.textW(`${k}π cm`) / 2) * Math.abs(Math.cos(t / 2 * RAD)) + 7 * Math.abs(Math.sin(t / 2 * RAD)) + 5, t / 2), `${k}π cm`, { blue: true, plain: true });
        b.name(O, 'O', 215).name(p(r, 0), 'C', 270).name(p(R, 0), 'D', 270).name(p(r, t), 'B', t + 90).name(p(R, t), 'A', t + 90);
        return piN(`중심이 O로 같은 두 부채꼴 AOD, BOC가 있다. ${nb(`${sg('OC')} = ${sg('CD')}`)}이고 ${nb(`${sg('OD')} = ${R} cm`)}, 호 BC의 길이가 ${k}π cm일 때, 색칠한 부분의 넓이는?`, area, CM2, {
          figure: b.svg(`중심이 O로 같고 중심각이 같은 두 부채꼴. 큰 부채꼴 AOD의 반지름 OD의 길이는 ${R} cm이고, 작은 부채꼴 BOC의 꼭짓점 B는 반지름 OA 위에, 꼭짓점 C는 반지름 OD 위에 있다. 선분 OC와 선분 CD에 길이가 같다는 표시가 있다. 호 BC의 길이는 ${k}π cm이고, 큰 부채꼴에서 작은 부채꼴을 뺀 띠 모양이 색칠되어 있다`),
          explain: `${sg('OC')} = ${R} ÷ 2 = ${r}(cm)이다. 중심각의 크기를 ${X}°라 하면 2π × ${r} × ${frac(X, 360)} = ${k}π에서 ${X} = ${t}이다. 색칠한 부분의 넓이는 π × ${R}<sup>2</sup> × ${frac(t, 360)} − π × ${r}<sup>2</sup> × ${frac(t, 360)} = ${qv(R * R * t, 360)}π − ${qv(r * r * t, 360)}π = ${area}π(${CM2})이다.`,
          facts: { calc: [[`(${R}*${R}-(${R}/2)*(${R}/2))*(180*${k}/(${R}/2))/360`, 0]], unseen: [2, 180, 360] }
        });
      }, { standard: FAN }),
      H('hard-quarter-semi', '중심각의 크기가 90°인 부채꼴에서 반원을 뺀 부분', '기본 ①84', (d, n) => {
        const R = n === 0 ? d.pick([4, 8, 12]) : 2 * d.int(2, 6), S = 130, b = Board(), O = [0, 0], pA = [S, 0], pB = [0, -S], mc = [S / 2, 0];
        b.shape(`M${XY(O)}L${XY(pB)}${arcTo(O, S, 90, 0)}${arcTo(mc, S / 2, 0, 180)}Z`, [O, pA, pB, at(O, S, 45)], TINT).seg(O, pA).dim(O, pA, `${R} cm`, [S / 2, -30], 24);
        b.name(O, 'O', 200, 12).name(pA, 'A', 340, 12).name(pB, 'B', 90);
        const lead = `반지름의 길이가 ${R} cm이고 중심각의 크기가 90°인 부채꼴 AOB에서 반지름 OA를 지름으로 하는 반원을 잘라 내었다.`;
        const said = `중심각의 크기가 90°인 부채꼴 AOB. 반지름 OA는 가로로, 반지름 OB는 세로로 놓여 있고 반지름 OA의 길이는 ${R} cm이다. 반지름 OA를 지름으로 하는 반원이 부채꼴의 내부에 그려져 있고, 부채꼴에서 반원을 뺀 부분이 색칠되어 있다`;
        if (n === 0) return piN(`${lead} 색칠한 부분의 넓이는?`, R * R / 8, CM2, {
          figure: b.svg(said), explain: `부채꼴의 넓이는 π × ${R}<sup>2</sup> × ${frac(90, 360)} = ${R * R / 4}π(${CM2})이고, 반원의 반지름의 길이는 ${R / 2} cm이므로 반원의 넓이는 π × ${R / 2}<sup>2</sup> × ${frac(1, 2)} = ${R * R / 8}π(${CM2})이다. 색칠한 부분의 넓이는 ${R * R / 4}π − ${R * R / 8}π = ${R * R / 8}π(${CM2})이다.`,
          facts: { calc: [[`${R}*${R}*90/360-(${R}/2)*(${R}/2)/2`, 0]], unseen: [360, 2] }
        });
        // 함정: 색칠한 부분의 경계가 아닌 지름 OA 를 더하거나, 경계인 반지름 OB 를 빠뜨리는 아이
        return piPlus(`${lead} 색칠한 부분의 둘레의 길이는?`, R, R, CM, {
          figure: b.svg(said), explain: `색칠한 부분의 둘레는 부채꼴의 호, 반원의 호, 반지름 OB로 이루어진다. 2π × ${R} × ${frac(90, 360)} + 2π × ${R / 2} × ${frac(1, 2)} + ${R} = ${qv(R, 2)}π + ${qv(R, 2)}π + ${R} = ${R}π + ${R}(cm)이다. 반지름 OA는 색칠한 부분의 경계가 아니다.`,
          facts: { calc: [[`2*${R}*90/360+2*(${R}/2)/2`, 0], [`${R}`, 1]], unseen: [2, 360] }
        });
      }, { count: 2, standard: FAN }),
      H('hard-leaf', '정사각형 안에서 두 부채꼴이 겹친 부분', '기본 ①85', (d, n) => {
        const a = 2 * d.int(2, 6), lead = `한 변의 길이가 ${a} cm인 정사각형의 내부에, 마주 보는 두 꼭짓점을 각각 중심으로 하고 정사각형의 한 변을 반지름으로 하는 부채꼴 두 개를 그렸다.`;
        if (n === 0) {
          // 틀린 보기: 활꼴 하나만 구한 값, 정사각형에서 부채꼴 하나를 뺀 값, 직각삼각형을 한 번만 뺀 값
          const h = a * a / 2, q = a * a / 4, sq = a * a, right = `(${h}π − ${sq}) ${CM2}`, options = d.shuffle([right, `(${q}π − ${sq / 2}) ${CM2}`, `(${sq} − ${q}π) ${CM2}`, `(${h}π − ${sq / 2}) ${CM2}`]);
          return C(`${lead} 두 부채꼴이 겹친 부분(색칠한 부분)의 넓이는?`, options, options.indexOf(right), {
            figure: leafFig(a, false),
            explain: `정사각형의 대각선을 그으면 색칠한 부분은 넓이가 같은 활꼴 2개로 나뉜다. 활꼴 하나의 넓이는 부채꼴의 넓이에서 직각삼각형의 넓이를 뺀 π × ${a}<sup>2</sup> × ${frac(90, 360)} − ${frac(1, 2)} × ${a} × ${a} = ${q}π − ${sq / 2}(${CM2})이다. 색칠한 부분의 넓이는 (${q}π − ${sq / 2}) × 2 = ${h}π − ${sq}(${CM2})이다.`,
            facts: { truth: options.map((o) => o === right), want: true }
          });
        }
        return piN(`${lead} 두 부채꼴이 겹친 부분(색칠한 부분)의 둘레의 길이는?`, a, CM, {
          figure: leafFig(a, false),
          explain: `색칠한 부분의 둘레는 반지름의 길이가 ${a} cm이고 중심각의 크기가 90°인 부채꼴의 호 2개이다. (2π × ${a} × ${frac(90, 360)}) × 2 = ${a}π(cm)이다.`,
          facts: { calc: [[`2*2*${a}*90/360`, 0]], unseen: [2, 90, 360] }
        });
      }, { count: 2, standard: FAN }),
      H('hard-equal-pieces', '넓이가 같은 두 부분으로 직사각형의 변의 길이 구하기', '심64', (d) => {
        const r = d.pick([6, 10, 14]), S = 130, w = S * Math.PI / 4, b = Board(), pB = [0, 0], pA = [0, -S], pC = [w, 0], pD = [w, -S], pE = [S, 0], hF = Math.sqrt(S * S - w * w), pF = [w, -hF], aF = Math.atan2(hF, w) / RAD;
        b.shape(`M${XY(pA)}L${XY(pD)}L${XY(pF)}${arcTo(pB, S, aF, 90)}Z`, [pA, pD, pF], TINT).shape(`M${XY(pC)}L${XY(pE)}${arcTo(pB, S, 0, aF)}Z`, [pC, pE, pF], TINT);
        b.poly([pB, pC, pD, pA]).arc(pB, S, 0, 90).seg(pC, pE).dim(pB, pA, `${r} cm`, [w / 2, -S / 2], 11);
        b.text([w - 14, -S * 0.885], '㉠', { plain: true }).text([w + 13, -S * 0.2], '㉡', { plain: true });
        b.name(pA, 'A', 110, 12).name(pB, 'B', 250, 12).name(pC, 'C', 270).name(pD, 'D', 45).name(pE, 'E', 300, 12);
        return piF(`직사각형 ABCD와, 점 B를 중심으로 하고 반지름의 길이가 ${r} cm인 부채꼴 ABE를 그림과 같이 겹쳐 놓았다. 색칠한 두 부분 ㉠, ㉡의 넓이가 같을 때, 변 BC의 길이는?`, r / 2, 2, CM, {
          figure: b.svg(`직사각형 ABCD와 부채꼴 ABE. 변 AB는 세로로, 변 BC는 가로로 놓여 있고 변 AB의 길이는 ${r} cm이다. 부채꼴 ABE는 점 B가 중심이고 중심각의 크기가 90°이며, 점 E는 변 BC를 점 C 쪽으로 늘인 선 위에 있다. 부채꼴의 호는 점 A에서 시작하여 변 CD와 만난 다음 점 E에 이른다. 직사각형에서 부채꼴의 바깥에 있는 부분 ㉠과 부채꼴에서 직사각형의 바깥에 있는 부분 ㉡이 색칠되어 있다`),
          explain: `직사각형과 부채꼴이 겹친 부분에 ㉠을 더하면 직사각형이 되고 ㉡을 더하면 부채꼴이 된다. ㉠과 ㉡의 넓이가 같으므로 직사각형 ABCD의 넓이와 부채꼴 ABE의 넓이가 같다. ${r} × ${sg('BC')} = π × ${r}<sup>2</sup> × ${frac(90, 360)} = ${r * r / 4}π에서 ${sg('BC')} = ${frac(r / 2, 2)}π(cm)이다.`,
          facts: { value: `${r}*${r}*90/360/${r}`, unseen: [90, 360] }
        });
      }, { standard: FAN })
    ]
  });
  // ── 기본 묶음에 덧붙이는 꼴 ──
  // 받으면서 실력에서 기본으로 내린 꼴: 기본에서 하는 일을 다시 묻거나 한 번에 풀리는 것.
  const TB = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 자료(' + ref + ')', make }, more || {});
  B.addTypes('7-2-3', 'poly', [
    TB('poly-ext-spot', '표시한 각 가운데 외각 가려내기', '기본 ①3·4', (d) => {
      // 함정: 다각형의 바깥쪽에 있는 각이면 외각이라 여기는 아이는 바깥쪽으로 크게 벌어진 각(360° − 내각)을 고르고,
      //  연장선이 보이면 외각이라 여기는 아이는 두 연장선이 이루는 각(내각의 맞꼭지각)을 고른다. 외각은 한 변과, 그 변에 이웃한 변의 연장선이 이루는 각이다.
      const a = anglesOf(d, 4, (list) => list.every((v) => v !== 90 && v >= 65 && v <= 115)), g = polyOf(a, [118, 96]), P = g.pts, D = g.dirs, names = vnames(P), kinds = d.shuffle(['ext', 'out', 'in', 'vert']), b = Board();
      const din = (i) => D[(i + 3) % 4], order = [0, 1, 2, 3].sort((p, q) => names[p].localeCompare(names[q])), tagOf = {}, told = [];
      order.forEach((i, k) => { tagOf[i] = TAG[k]; });
      b.poly(P);
      order.forEach((i) => {
        const p = P[i], kind = kinds[i], tag = tagOf[i], out = D[i] + a[i] / 2 + 180, prev = names[(i + 3) % 4], next = names[(i + 1) % 4], me = names[i];
        if (kind === 'ext') { b.seg(p, at(p, 36, din(i))).angle(p, din(i), D[i], tag, BIG).name(p, me, din(i) - 90); told.push(`꼭짓점 ${me}: 변 ${prev}${me}를 ${me} 너머로 늘인 선과 변 ${me}${next}가 이루는 각에 ${tag}`); }
        else if (kind === 'out') { b.angle(p, din(i) + 180, D[i], tag, { r: 11, size: 15 }).name(p, me, out - 64, 22); told.push(`꼭짓점 ${me}: 두 변이 도형의 바깥쪽으로 크게 벌어져 이루는 각(한 바퀴에서 안쪽 각을 뺀 나머지)에 ${tag}`); }
        else if (kind === 'in') { b.angle(p, D[i], din(i) + 180, tag, BIG).name(p, me, out); told.push(`꼭짓점 ${me}: 두 변이 도형의 안쪽에서 이루는 각에 ${tag}`); }
        else { b.seg(p, at(p, 36, din(i))).seg(p, at(p, 36, D[i] + 180)).angle(p, D[i] + 180, din(i), tag, BIG).name(p, me, din(i) + (180 - a[i]) / 2, 15); told.push(`꼭짓점 ${me}: 두 변을 모두 ${me} 너머로 늘인 두 선이 이루는 각에 ${tag}`); }
      });
      const right = tagOf[kinds.indexOf('ext')], say = (kind) => tagOf[kinds.indexOf(kind)];
      return C('사각형 ABCD의 꼭짓점마다 각을 하나씩 표시하였다. ㉠~㉣ 가운데 사각형 ABCD의 외각인 것은?', TAG, TAG.indexOf(right), {
        figure: b.svg(`사각형 ABCD. ${told.join('. ')}`),
        explain: `외각은 한 변과, 그 변에 이웃한 변의 연장선이 이루는 각이다. ${right}이 외각이다. ${say('in')}은 내각, ${say('out')}은 360°에서 내각의 크기를 뺀 각, ${say('vert')}은 두 연장선이 이루는 각으로 내각의 맞꼭지각이다.`,
        facts: { truth: TAG.map((t) => t === right), want: true }
      });
    })
  ]);
  B.addTypes('7-2-3', 'tri', [
    TB('tri-ext-adjacent', '외각과 이웃한 내각이 적힌 삼각형', '심11·12·14 / 기본 ①19', (d) => {
      // 함정: 외각의 크기를 그림에 적힌 두 내각의 합으로 셈하는 아이(∠A + ∠ACB). 외각은 그와 이웃하지 않는 두 내각의 크기의 합이고, 이웃한 내각과는 합이 180°이다.
      const [a, c] = d.until(() => [5 * d.int(8, 14), 5 * d.int(9, 16)], (w) => 180 - w[0] - w[1] >= 40 && w[0] + w[1] !== 180 - w[1] && w[1] !== 90), x = 180 - c;
      const t = triOf(a, 180 - a - c, c, [150, 108]), b = Board(), D = [t.C[0] + 46, t.C[1]];
      b.poly([t.B, t.C, t.A]).seg(t.C, D).corner(t.A, t.B, t.C, a + '°').corner(t.C, t.A, t.B, c + '°').corner(t.C, D, t.A, sv('x'), { square: false });
      b.name(t.A, 'A', awayFrom(t.A, [t.B, t.C])).name(t.B, 'B', awayFrom(t.B, [t.A, t.C])).name(t.C, 'C', 270).name(D, 'D', 270);
      return degQ(`△ABC에서 변 BC의 연장선 위에 점 D가 있다. ∠A = ${a}°, ∠ACB = ${c}°일 때, ∠ACD의 크기는?`, x, {
        figure: b.svg(`삼각형 ABC. 점 D는 변 BC를 점 C 쪽으로 늘인 선 위에 있다. ∠A = ${a}°, ∠ACB = ${c}°, ∠ACD = x`),
        explain: `∠ACD는 ∠ACB의 외각이므로 ∠ACD = 180° − ${c}° = ${x}°이다. ∠ACD와 이웃하지 않는 두 내각은 ∠A와 ∠B이고, ∠B = 180° − ${a}° − ${c}° = ${180 - a - c}°이므로 ∠A + ∠B = ${x}°로 같다. ∠A + ∠ACB = ${a + c}°는 외각의 크기가 아니다.`,
        facts: { calc: [[`180-${c}`, 0]], unseen: [180] }
      });
    })
  ]);
  B.addTypes('7-2-3', 'sum', [
    TB('sum-number-claims', '대각선·내각·외각의 수를 뒤섞은 설명 가리기', '심2 / 기본 ①5', (d) => {
      // 함정: 틀린 보기는 저마다 한 가지 헷갈림으로 셈한 값이다 — n − 3과 n − 2를 바꾼다, 2로 나누지 않는다, 외각의 크기의 합을 내각의 크기의 합으로 적는다, 한 외각 자리에 한 내각을 적는다.
      const kinds = d.shuffle(['one', 'tri', 'all', 'in', 'ext', 'regext']).slice(0, 4), hit = d.int(0, 3);
      const rows = kinds.map((kind, i) => {
        const n = kind === 'regext' ? d.pick([8, 9, 10, 12]) : d.int(7, 12), ok = i === hit;
        const spec = {
          one: [`${gon(n)}의 한 꼭짓점에서 그을 수 있는 대각선은 `, '개이다.', n - 3, n - 2, `${n}-3`],
          tri: [`${gon(n)}의 한 꼭짓점에서 대각선을 모두 그으면 삼각형 `, '개로 나누어진다.', n - 2, n - 3, `${n}-2`],
          all: [`${gon(n)}의 대각선은 모두 `, '개이다.', diagAll(n), n * (n - 3), `${n}*(${n}-3)/2`],
          in: [`${gon(n)}의 내각의 크기의 합은 `, '°이다.', inSum(n), 180 * (n - 3), `180*(${n}-2)`],
          ext: [`${gon(n)}의 외각의 크기의 합은 `, '°이다.', 360, inSum(n), '360'],
          regext: [`${rgon(n)}의 한 외각의 크기는 `, '°이다.', exOf(n), inOf(n), `360/${n}`]
        }[kind];
        return { text: spec[0] + (ok ? spec[2] : spec[3]) + spec[1], fix: spec[0] + spec[2] + spec[1], expr: spec[4], said: ok ? spec[2] : spec[3] };
      });
      return C('다음 중 옳은 것은?', rows.map((r) => r.text), hit, {
        explain: `옳지 않은 것을 바르게 고치면 다음과 같다. ${rows.filter((_, i) => i !== hit).map((r) => r.fix).join(' ')}`,
        facts: { claimed: rows.map((r) => [r.expr, r.said]), claimedWant: true }
      });
    })
  ]);
  B.addTypes('7-2-3', 'regular', [
    TB('reg-claims', '변의 길이만 같거나 각의 크기만 같은 다각형과 정다각형', '기본 ①5·10·13 / 심1', (d) => {
      // 함정: 변의 길이만 같아도(마름모), 내각·외각의 크기만 같아도(직사각형) 정다각형이라 여기는 아이. 정다각형은 변의 길이와 내각의 크기가 모두 같아야 한다.
      const wantTrue = d.bool();
      return sayQ(d, `다음 중 ${wantTrue ? '옳은' : '옳지 않은'} 것은?`, [
        '정다각형은 모든 외각의 크기가 같다.', '정사각형은 정다각형이다.', '정다각형의 외각의 크기의 합은 360°이다.', '정다각형의 한 내각의 크기와 한 외각의 크기의 합은 180°이다.',
        '변의 개수가 많은 정다각형일수록 한 외각의 크기가 작다.', '변의 개수가 많은 정다각형일수록 한 내각의 크기가 크다.', '모든 변의 길이가 같고 모든 내각의 크기가 같은 다각형은 정다각형이다.'
      ], [
        ['모든 변의 길이가 같은 다각형은 정다각형이다.', '마름모는 네 변의 길이가 같지만 내각의 크기가 같지 않을 수 있으므로 정다각형이 아니다.', ['모든 변의 길이가 같고 모든 내각의 크기가 같은 다각형은 정다각형이다.']],
        ['모든 내각의 크기가 같은 다각형은 정다각형이다.', '직사각형은 네 내각의 크기가 같지만 변의 길이가 같지 않을 수 있으므로 정다각형이 아니다.', ['모든 변의 길이가 같고 모든 내각의 크기가 같은 다각형은 정다각형이다.']],
        ['모든 외각의 크기가 같은 다각형은 정다각형이다.', '직사각형은 외각의 크기가 모두 90°이지만 변의 길이가 같지 않을 수 있으므로 정다각형이 아니다.', ['정다각형은 모든 외각의 크기가 같다.', '모든 변의 길이가 같고 모든 내각의 크기가 같은 다각형은 정다각형이다.']],
        ['네 변의 길이가 모두 같은 사각형은 정사각형이다.', '마름모는 네 변의 길이가 같지만 네 내각의 크기가 같지 않으면 정사각형이 아니다.', ['모든 변의 길이가 같고 모든 내각의 크기가 같은 다각형은 정다각형이다.', '정사각형은 정다각형이다.']],
        ['정다각형의 한 내각의 크기는 한 외각의 크기보다 항상 크다.', '정삼각형은 한 내각의 크기가 60°, 한 외각의 크기가 120°이다.'],
        ['변의 개수가 많은 정다각형일수록 외각의 크기의 합이 크다.', '다각형의 외각의 크기의 합은 변의 개수와 상관없이 360°이다.', ['변의 개수가 많은 정다각형일수록 한 외각의 크기가 작다.', '정다각형의 외각의 크기의 합은 360°이다.']]
      ], wantTrue);
    })
  ]);
  B.addTypes('7-2-3', 'circle', [
    TB('circ-half-claims', '반원과 지름을 두고 원의 용어 가리기', '심41 / 기본 ①56·58', (d) => {
      // 함정: 부채꼴과 활꼴은 서로 다른 도형이라고만 아는 아이(반원은 둘 다이다), 반지름도 현이라 여기는 아이, 지름보다 긴 현이 있다고 여기는 아이.
      const wantTrue = d.bool();
      return sayQ(d, `다음 중 원의 현, 부채꼴, 활꼴에 대한 설명으로 ${wantTrue ? '옳은' : '옳지 않은'} 것은?`, [
        '한 원에서 길이가 가장 긴 현은 지름이다.', '중심각의 크기가 180°인 부채꼴은 반원이다.', '반원은 부채꼴이면서 활꼴이다.', '지름은 원의 중심을 지나는 현이다.', '활꼴의 현이 지름이면 그 활꼴은 반원이다.',
        '원 위의 두 점을 이은 선분은 모두 현이다.', '한 원에서 부채꼴의 중심각의 크기가 커지면 호의 길이도 길어진다.'
      ], [
        ['부채꼴이면서 활꼴인 도형은 없다.', '반원은 두 반지름과 호로 이루어진 부채꼴이면서 현(지름)과 호로 이루어진 활꼴이다.', ['반원은 부채꼴이면서 활꼴이다.', '중심각의 크기가 180°인 부채꼴은 반원이다.', '활꼴의 현이 지름이면 그 활꼴은 반원이다.']],
        ['부채꼴이면서 활꼴인 도형은 원이다.', '부채꼴이면서 활꼴인 도형은 반원이다.', ['반원은 부채꼴이면서 활꼴이다.', '중심각의 크기가 180°인 부채꼴은 반원이다.', '활꼴의 현이 지름이면 그 활꼴은 반원이다.']],
        ['한 원에는 지름보다 길이가 긴 현이 있다.', '한 원에서 길이가 가장 긴 현은 지름이다.', ['한 원에서 길이가 가장 긴 현은 지름이다.']],
        ['반지름은 현이다.', '현은 원 위의 두 점을 이은 선분이다. 반지름의 한 끝 점은 원의 중심이므로 반지름은 현이 아니다.'],
        ['활꼴은 두 반지름과 호로 이루어진 도형이다.', '활꼴은 현과 호로 이루어진 도형이다. 두 반지름과 호로 이루어진 도형은 부채꼴이다.'],
        ['중심각의 크기가 180°인 부채꼴은 원이다.', '중심각의 크기가 180°인 부채꼴은 반원이다.', ['중심각의 크기가 180°인 부채꼴은 반원이다.', '반원은 부채꼴이면서 활꼴이다.']]
      ], wantTrue);
    }, { standard: FAN })
  ]);
  B.addTypes('7-2-3', 'circle', [
    TB('circ-fig-claims', '그림의 원에서 현·활꼴·부채꼴·중심각 가리기', '심42 / 기본 ①57', (d) => {
      // 함정: 원의 중심에서 그은 선분 OC 도 현이라 여기는 아이, 현 BC 와 호 BC 로 이루어진 도형을 부채꼴이라 여기는 아이, 지름보다 긴 현이 있다고 여기는 아이, 중심각의 두 변과 호의 양 끝을 맞추지 못하는 아이.
      const c = ring(64), tilt = d.int(-15, 15), aC = tilt + d.int(55, 115), wantTrue = d.bool();
      c.b.seg(c.pt(180 + tilt), c.pt(tilt)).seg(c.O, c.pt(aC)).seg(c.pt(tilt), c.pt(aC));
      mark(c, 180 + tilt, 'A'); mark(c, tilt, 'B'); mark(c, aC, 'C'); centre(c, 270 + tilt);
      return sayQ(d, `원 O에서 선분 AB는 지름이고 점 C는 원 O 위의 점이다. 다음 중 ${wantTrue ? '옳은' : '옳지 않은'} 것은?`, [
        '선분 BC는 현이다.', '선분 AB는 원 O에서 길이가 가장 긴 현이다.', '∠BOC는 호 BC에 대한 중심각이다.', '현 BC와 호 BC로 이루어진 도형은 활꼴이다.', '두 반지름 OB, OC와 호 BC로 이루어진 도형은 부채꼴이다.', '∠AOC는 호 AC에 대한 중심각이다.'
      ], [
        ['원 O에는 선분 AB보다 길이가 긴 현이 있다.', '선분 AB는 지름이고, 지름은 길이가 가장 긴 현이다.', ['선분 AB는 원 O에서 길이가 가장 긴 현이다.']],
        ['현 BC와 호 BC로 이루어진 도형은 부채꼴이다.', '현과 호로 이루어진 도형은 활꼴이다.', ['현 BC와 호 BC로 이루어진 도형은 활꼴이다.', '두 반지름 OB, OC와 호 BC로 이루어진 도형은 부채꼴이다.']],
        ['두 반지름 OB, OC와 호 BC로 이루어진 도형은 활꼴이다.', '두 반지름과 호로 이루어진 도형은 부채꼴이다.', ['현 BC와 호 BC로 이루어진 도형은 활꼴이다.', '두 반지름 OB, OC와 호 BC로 이루어진 도형은 부채꼴이다.']],
        ['선분 OC는 현이다.', '현은 원 위의 두 점을 이은 선분이다. 점 O는 원 위의 점이 아니므로 선분 OC는 현이 아니다.'],
        ['∠BOC는 호 AC에 대한 중심각이다.', '호 AC에 대한 중심각은 ∠AOC이고, ∠BOC는 호 BC에 대한 중심각이다.', ['∠BOC는 호 BC에 대한 중심각이다.', '∠AOC는 호 AC에 대한 중심각이다.']]
      ], wantTrue, c.b.svg('원 O의 지름 AB와 원 위의 점 C. 반지름 OC와 현 BC가 그어져 있다'));
    }, { standard: FAN })
  ]);
  B.addTypes('7-2-3', 'central', [
    TB('central-chord-claims', '중심각의 크기에 정비례하는 것과 정비례하지 않는 것', '심43·44 / 기본 ①65', (d, n) => {
      // 함정: 중심각의 크기가 2배(3배)이면 현의 길이와 삼각형의 넓이도 2배(3배)라고 여기는 아이. 정비례하는 것은 호의 길이와 부채꼴의 넓이뿐이다.
      const wantTrue = d.bool();
      if (n === 0) {
        const t = d.int(30, 46), c = ring(66), aA = 90 + 1.5 * t, aB = 90 + 0.5 * t, aC = 90 - 1.5 * t;
        c.b.seg(c.O, c.pt(aA)).seg(c.O, c.pt(aB)).seg(c.O, c.pt(aC)).seg(c.pt(aA), c.pt(aB)).seg(c.pt(aB), c.pt(aC));
        c.b.sym(c.O, 90 + t, 'dot', 24).sym(c.O, 90, 'dot', 24).sym(c.O, 90 - t, 'dot', 24);
        mark(c, aA, 'A'); mark(c, aB, 'B'); mark(c, aC, 'C'); centre(c, 270);
        return sayQ(d, `원 O에서 ∠BOC = 2∠AOB이다. 다음 중 ${wantTrue ? '옳은' : '옳지 않은'} 것은?`, [
          '호 BC의 길이는 호 AB의 길이의 2배이다.', '부채꼴 BOC의 넓이는 부채꼴 AOB의 넓이의 2배이다.', '호 AC의 길이는 호 AB의 길이의 3배이다.', '부채꼴 AOC의 넓이는 부채꼴 AOB의 넓이의 3배이다.'
        ], [
          ['현 BC의 길이는 현 AB의 길이의 2배이다.', '현의 길이는 중심각의 크기에 정비례하지 않는다. 현 BC의 길이는 현 AB의 길이의 2배보다 짧다.'],
          ['삼각형 BOC의 넓이는 삼각형 AOB의 넓이의 2배이다.', '두 반지름과 현으로 이루어진 삼각형의 넓이는 중심각의 크기에 정비례하지 않는다.'],
          ['현 AC의 길이는 현 AB의 길이의 3배이다.', '현의 길이는 중심각의 크기에 정비례하지 않는다. 현 AC의 길이는 현 AB의 길이의 3배보다 짧다.'],
          ['호 AC의 길이는 호 AB의 길이의 2배이다.', '∠AOC = 3∠AOB이므로 호 AC의 길이는 호 AB의 길이의 3배이다.', ['호 AC의 길이는 호 AB의 길이의 3배이다.']]
        ], wantTrue, c.b.svg('원 O 위에 세 점 A, B, C가 이 차례로 놓여 있다. 반지름 OA, OB, OC와 현 AB, 현 BC가 그어져 있다. ∠AOB에는 점 1개, ∠BOC에는 점 2개가 찍혀 ∠BOC의 크기가 ∠AOB의 크기의 2배임을 나타낸다'));
      }
      return sayQ(d, `한 원에 대한 설명으로 ${wantTrue ? '옳은' : '옳지 않은'} 것은?`, [
        '중심각의 크기가 같은 두 부채꼴의 호의 길이는 같다.', '중심각의 크기가 같은 두 부채꼴의 넓이는 같다.', '부채꼴의 호의 길이는 중심각의 크기에 정비례한다.', '부채꼴의 넓이는 중심각의 크기에 정비례한다.', '호의 길이가 같은 두 부채꼴의 중심각의 크기는 같다.'
      ], [
        ['현의 길이는 중심각의 크기에 정비례한다.', '현의 길이는 중심각의 크기에 정비례하지 않는다. 정비례하는 것은 호의 길이와 부채꼴의 넓이이다.'],
        ['중심각의 크기가 2배가 되면 현의 길이도 2배가 된다.', '중심각의 크기가 2배가 되어도 현의 길이는 2배보다 짧다.'],
        ['중심각의 크기가 2배가 되면 두 반지름과 현으로 이루어진 삼각형의 넓이도 2배가 된다.', '두 반지름과 현으로 이루어진 삼각형의 넓이는 중심각의 크기에 정비례하지 않는다.'],
        ['중심각의 크기가 같아도 두 부채꼴의 호의 길이는 다를 수 있다.', '한 원에서 중심각의 크기가 같은 두 부채꼴의 호의 길이는 같다.', ['중심각의 크기가 같은 두 부채꼴의 호의 길이는 같다.', '호의 길이가 같은 두 부채꼴의 중심각의 크기는 같다.']],
        ['호의 길이가 2배가 되면 현의 길이도 2배가 된다.', '호의 길이가 2배이면 중심각의 크기가 2배이지만 현의 길이는 2배보다 짧다.']
      ], wantTrue);
    }, { count: 2, standard: FAN })
  ]);
  B.addTypes('7-2-3', 'diag', [
    TB('diag-chain', '대각선·삼각형의 개수로 다각형을 찾아 다른 것 구하기', '심4·5·6 / 기본 ①10·11·13·14', (d, n) => {
      if (n === 0) {
        // 함정: 삼각형의 개수 k 를 n − 3 으로 읽어 (k + 3)각형으로 셈하는 아이
        const m = d.int(9, 18), k = m - 2;
        return cntQ(`한 꼭짓점에서 대각선을 모두 그었더니 삼각형 ${k}개로 나누어진 다각형이 있다. 이 다각형의 대각선의 개수는?`, diagAll(m), {
          explain: `${N_}각형의 한 꼭짓점에서 대각선을 모두 그으면 삼각형 (${N_} − 2)개로 나누어진다. ${N_} − 2 = ${k}에서 ${N_} = ${m}이므로 ${gon(m)}이다. 대각선의 개수는 ${frac(`${m} × ${m - 3}`, 2)} = ${diagAll(m)}이다.`,
          facts: { calc: [[`(${k}+2)*(${k}+2-3)/2`, 0]], unseen: [2, 3] }
        });
      }
      if (n === 1) {
        const m = d.int(8, 15), k = diagAll(m);
        return cntQ(`대각선의 개수가 ${k}인 다각형의 한 꼭짓점에서 그을 수 있는 대각선의 개수는?`, m - 3, {
          explain: `${frac(`${N_}(${N_} − 3)`, 2)} = ${k}에서 ${N_}(${N_} − 3) = ${2 * k} = ${m} × ${m - 3}이므로 ${N_} = ${m}, ${gon(m)}이다. 한 꼭짓점에서 그을 수 있는 대각선은 ${m} − 3 = ${m - 3}(개)이다.`,
          facts: { calc: [[`(3+(9+8*${k})**0.5)/2-3`, 0]], unseen: [3, 9, 8, 0.5, 2] }
        });
      }
      if (n === 2) {
        const m = d.pick([5, 6, 7]), a = diagAll(m);
        return gonQ(`${gon(m)}의 대각선의 개수만큼 한 꼭짓점에서 대각선을 그을 수 있는 다각형은 몇 각형인가?`, a + 3, {
          explain: `${gon(m)}의 대각선의 개수는 ${frac(`${m} × ${m - 3}`, 2)} = ${a}이다. ${N_}각형의 한 꼭짓점에서 그을 수 있는 대각선은 (${N_} − 3)개이므로 ${N_} − 3 = ${a}에서 ${N_} = ${a + 3}, ${gon(a + 3)}이다.`,
          facts: { calc: [[`${m}*(${m}-3)/2+3`, 0]], unseen: [m, 3, 2] }
        });
      }
      const m = d.int(8, 16), s = 2 * m - 5;
      return gonQ(`어떤 다각형의 한 꼭짓점에서 그을 수 있는 대각선의 개수와 이때 생기는 삼각형의 개수의 합이 ${s}이다. 이 다각형은 몇 각형인가?`, m, {
        explain: `${N_}각형의 한 꼭짓점에서 그을 수 있는 대각선은 (${N_} − 3)개, 이때 생기는 삼각형은 (${N_} − 2)개이다. (${N_} − 3) + (${N_} − 2) = ${s}에서 2${N_} = ${s + 5}, ${N_} = ${m}이므로 ${gon(m)}이다.`,
        facts: { calc: [[`(${s}+5)/2`, 0]], unseen: [5, 2] }
      });
    }, { count: 4 })
  ]);
  B.addTypes('7-2-3', 'regular', [
    TB('reg-chain', '정다각형을 찾은 다음 다른 것 구하기', '심23 / 기본 ①34·46·47·48', (d, n) => {
      if (n === 0) {
        const m = d.pick(REG.filter((k) => k <= 20));
        return degQ(`내각의 크기의 합이 ${inSum(m)}°인 정다각형의 한 외각의 크기는?`, exOf(m), {
          explain: `180° × (${N_} − 2) = ${inSum(m)}°에서 ${N_} = ${m}이므로 ${rgon(m)}이다. 한 외각의 크기는 360° ÷ ${m} = ${exOf(m)}°이다.`, facts: { calc: [[`360/(${inSum(m)}/180+2)`, 0]], unseen: [360, 180, 2] }
        });
      }
      if (n === 1) {
        const m = d.pick([9, 10, 12, 15, 18, 20]);
        return degQ(`한 꼭짓점에서 그을 수 있는 대각선의 개수가 ${m - 3}인 정다각형의 한 내각의 크기는?`, inOf(m), {
          explain: `${N_} − 3 = ${m - 3}에서 ${N_} = ${m}이므로 ${rgon(m)}이다. 한 내각의 크기는 ${frac(`180° × (${m} − 2)`, m)} = ${inOf(m)}°이다.`, facts: { calc: [[`180*(${m - 3}+3-2)/(${m - 3}+3)`, 0]], unseen: [180, 3, 2] }
        });
      }
      if (n === 2) {
        const m = d.pick([8, 9, 10, 12, 15, 18, 20]);
        return cntQ(`한 내각의 크기가 ${inOf(m)}°인 정다각형의 대각선의 개수는?`, diagAll(m), {
          explain: `한 외각의 크기는 180° − ${inOf(m)}° = ${exOf(m)}°이므로 360° ÷ ${exOf(m)}° = ${m}에서 ${rgon(m)}이다. 대각선의 개수는 ${frac(`${m} × ${m - 3}`, 2)} = ${diagAll(m)}이다.`,
          facts: { calc: [[`(360/(180-${inOf(m)}))*(360/(180-${inOf(m)})-3)/2`, 0]], unseen: [360, 180, 3, 2] }
        });
      }
      const m = d.pick(REG.filter((k) => k <= 20));
      return degQ(`내각의 크기의 합과 외각의 크기의 합을 더한 값이 ${180 * m}°인 정다각형의 한 내각의 크기는?`, inOf(m), {
        explain: `한 꼭짓점에서 내각과 외각의 크기의 합은 180°이므로 180° × ${N_} = ${180 * m}°에서 ${N_} = ${m}, ${rgon(m)}이다. 한 내각의 크기는 ${frac(`180° × (${m} − 2)`, m)} = ${inOf(m)}°이다.`,
        facts: { calc: [[`180*(${180 * m}/180-2)/(${180 * m}/180)`, 0]], unseen: [180, 2] }
      });
    }, { count: 4 })
  ]);
  B.addTypes('7-2-3', 'sector', [
    TB('sector-chain', '반지름을 먼저 구해 넓이·둘레·중심각 구하기', '기본 ①74·78', (d, n) => {
      if (n < 2) {
        const [r, t] = d.pick(FANS), l = r * t / 180, s = r * r * t / 360, head = `중심각의 크기가 ${t}°이고 호의 길이가 ${l}π cm인 부채꼴의`, why = `반지름의 길이를 ${V_R} cm라 하면 2π × ${V_R} × ${frac(t, 360)} = ${l}π에서 ${V_R} = ${r}이다. `;
        if (n === 0) return piN(`${head} 넓이는?`, s, CM2, {
          explain: `${why}넓이는 ${frac(1, 2)} × ${r} × ${l}π = ${s}π(${CM2})이다.`, facts: { calc: [[`(180*${l}/${t})*${l}/2`, 0]], unseen: [180, 2] }
        });
        // 함정: 둘레를 호의 길이로만 답하는 아이. 부채꼴의 둘레에는 반지름 2개가 든다.
        return piPlus(`${head} 둘레의 길이는?`, l, 2 * r, CM, {
          explain: `${why}부채꼴의 둘레는 호와 반지름 2개로 이루어지므로 ${l}π + ${r} × 2 = ${l}π + ${2 * r}(cm)이다.`, facts: { calc: [[`${l}`, 0], [`2*180*${l}/${t}`, 1]], unseen: [2, 180] }
        });
      }
      const [r, k] = d.pick(RLS.filter(([p, q]) => (180 * q) % p === 0)), s = r * k / 2, t = 180 * k / r;
      return degQ(`호의 길이가 ${k}π cm이고 넓이가 ${s}π ${CM2}인 부채꼴의 중심각의 크기는?`, t, {
        explain: `반지름의 길이를 ${V_R} cm라 하면 ${frac(1, 2)} × ${V_R} × ${k}π = ${s}π에서 ${V_R} = ${r}이다. 중심각의 크기를 ${X}°라 하면 2π × ${r} × ${frac(X, 360)} = ${k}π에서 ${X} = ${t}이므로 ${t}°이다.`,
        facts: { calc: [[`180*${k}/(2*${s}/${k})`, 0]], unseen: [180, 2] }
      });
    }, { count: 3, standard: FAN })
  ]);

  // ── 다시 실은 꼴(2026-10-13) ──
  // 처음 지을 때 「볼록이 아닌 꼴」「복잡하게 변형된 도형」「꼬임·보조선·경우 따지기」라는 까닭으로 뺀 꼴을 다시 따져, 이 단원과 앞 단원·초등의 내용만으로 풀리는 것을 실었다.
  // 꼴마다의 판정은 references/textbooks/수학/_분석/7-2-3/싣기_대조표.md 의 「다시 싣기」에 모았다. 7-2-3a.js 머리의 「뺀 것과 까닭」 가운데 아래에 실린 꼴은 이 글이 이긴다.
  //  - 엇갈린 선분으로 이루어진 그림(별 모양, 변을 지우고 엇갈리게 그은 선분)은 다각형으로 다루지 않는다. 풀이는 그 안의 삼각형과 볼록한 다각형의 내각·외각만 쓴다.
  //  - 색칠한 부분은 조각이 셋을 넘거나 도형을 돌리고 굴리는 것까지 실었다. 답은 「□π」, 「(□π + □)」, π가 없는 수 가운데 하나이고 한 문항의 답의 꼴은 늘 같다.
  //  - 원이 변에 닿은 채 구르는 그림과 끈으로 묶은 원은 중학교 1학년 자료에서 그림으로 읽는 대로만 쓴다(곧은 부분은 중심을 이은 선분과 평행하다). 접선의 성질을 이름으로 쓰지 않는다.
  const { cm2Q, mid, range } = K;
  const RB = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 자료(' + ref + ')', make }, more || {});
  const M2 = 'm<sup>2</sup>';
  // 점들이 [가로, 세로] 안에 꼭 맞게 되는 배율
  const scaleOf = (pts, size) => { const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]); return Math.min(size[0] / (Math.max(...xs) - Math.min(...xs)), size[1] / (Math.max(...ys) - Math.min(...ys))); };
  const times = (p, k) => [p[0] * k, p[1] * k];
  // π의 계수가 k 인 글(1π 는 π 로 적는다)
  const kpi = (k) => (k === 1 ? '' : k) + 'π';

  // ── 기본 묶음에 덧붙이는 꼴 ──
  B.addTypes('7-2-3', 'tri', [
    RB('tri-inner-point', '삼각형의 내부의 한 점과 두 꼭짓점을 이어 생긴 각', '기본 ①25 / 심19', (d) => {
      // 삼각형 ABC와 삼각형 DBC, 두 삼각형의 내각의 크기의 합만 쓴다(오목한 사각형 ABDC의 내각으로 다루지 않는다).
      const draw = (w) => {
        const t = fitted((L) => { const g = baseTri(w.Bv, w.Cv, L); return Object.assign(g, { D: meet(g.B, at(g.B, 10, w.Bv - w.p), g.C, at(g.C, 10, 180 - (w.Cv - w.q))) }); }, [215, 165]), b = Board();
        b.poly([t.B, t.C, t.A]).seg(t.B, t.D).seg(t.C, t.D);
        b.corner(t.A, t.B, t.C, w.A + '°').corner(t.B, t.A, t.D, w.p + '°').corner(t.C, t.D, t.A, w.q + '°').corner(t.D, t.B, t.C, sv('x'), { square: false });
        return b.name(t.A, 'A', 90).name(t.B, 'B', awayFrom(t.B, [t.A, t.C])).name(t.C, 'C', awayFrom(t.C, [t.A, t.B])).name(t.D, 'D', 90, 12);
      };
      const v = d.until(() => { const A = 5 * d.int(10, 17), Bv = 5 * d.int(10, 15), p = 5 * d.int(5, 7), q = 5 * d.int(4, 7); return { A, Bv, Cv: 180 - A - Bv, p, q }; },
        (w) => w.Cv >= 50 && w.Cv <= 75 && w.Bv - w.p >= 20 && w.Cv - w.q >= 20 && w.p !== w.q && w.A + w.p + w.q <= 150 && !draw(w).clash());
      const rest = 180 - v.A - v.p - v.q, x = 180 - rest;
      return degQ(`△ABC의 내부에 점 D가 있다. ∠A = ${v.A}°, ∠ABD = ${v.p}°, ∠ACD = ${v.q}°일 때, ∠BDC의 크기는?`, x, {
        figure: draw(v).svg(`삼각형 ABC와 그 내부의 점 D. 선분 DB와 선분 DC가 그어져 있다. ∠A = ${v.A}°, ∠ABD = ${v.p}°, ∠ACD = ${v.q}°, ∠BDC = x`),
        explain: `△ABC의 세 내각의 크기의 합은 180°이므로 ∠DBC + ∠DCB = 180° − (${v.A}° + ${v.p}° + ${v.q}°) = ${rest}°이다. △DBC에서 ∠BDC = 180° − ${rest}° = ${x}°이다.`,
        facts: { calc: [[`180-(180-${v.A}-${v.p}-${v.q})`, 0]], unseen: [180] }
      });
    })
  ]);
  B.addTypes('7-2-3', 'central', [
    RB('central-area-tri', '부채꼴의 넓이로 중심각의 크기를 구해 삼각형의 두 내각의 크기의 합 구하기', '기본 ①68 / 심52', (d) => {
      const v = d.until(() => { const t = d.pick([40, 45, 60, 72, 80, 90, 100, 120]), g = gcd(t, 360), k = d.int(1, 4); return { t, s: k * t / g, S: k * 360 / g }; }, (w) => w.s >= 2 && w.S <= 72);
      const t = v.t, c = ring(50), a0 = 90 - t / 2, a1 = 90 + t / 2, far = Math.max(c.R + 58, (c.R + 22) / Math.cos(t / 2 * RAD)), pP = at(c.O, far, a1), pQ = at(c.O, far * 0.9, a0);
      c.b.fan(c.O, c.R, a0, a1, TINT).seg(c.pt(a1), pP).seg(c.pt(a0), pQ).seg(pP, pQ);
      c.b.corner(pP, c.O, pQ, sv('a'), { square: false }).corner(pQ, pP, c.O, sv('b'), { square: false });
      c.b.dot(c.pt(a1)).name(c.pt(a1), 'A', a1 + 52, 15).dot(c.pt(a0)).name(c.pt(a0), 'B', a0 - 52, 15).name(pP, 'P', awayFrom(pP, [c.O, pQ])).name(pQ, 'Q', awayFrom(pQ, [c.O, pP]));
      centre(c, 270);
      return degQ(`원 O의 넓이는 ${v.S}π ${CM2}이고 부채꼴 AOB의 넓이는 ${v.s}π ${CM2}이다. 반지름 OA, OB의 연장선 위에 각각 점 P, Q를 잡아 △OPQ를 만들 때, ∠OPQ + ∠OQP의 크기는?`, 180 - t, {
        figure: c.b.svg('원 O와 색칠한 부채꼴 AOB. 점 P는 반지름 OA를 점 A 너머로 늘인 선 위에, 점 Q는 반지름 OB를 점 B 너머로 늘인 선 위에 있고 선분 PQ가 그어져 있다. ∠OPQ = a, ∠OQP = b'),
        explain: `부채꼴의 넓이는 중심각의 크기에 정비례하므로 ∠AOB = 360° × ${frac(v.s, v.S)} = ${t}°이다. △OPQ의 세 내각의 크기의 합은 180°이므로 ∠OPQ + ∠OQP = 180° − ${t}° = ${180 - t}°이다.`,
        facts: { calc: [[`180-360*${v.s}/${v.S}`, 0]], unseen: [180, 360] }
      });
    }, { standard: FAN })
  ]);
  B.addTypes('7-2-3', 'sector', [
    RB('sector-ratio-area', '반원의 호에 대한 비로 중심각의 크기를 구해 부채꼴의 넓이 구하기', '기본 ①64', (d) => {
      const [AC, p, q] = d.pick([[20, 2, 5], [20, 1, 5], [20, 3, 5], [20, 4, 5], [8, 1, 4], [8, 3, 4], [12, 1, 3], [12, 2, 3], [12, 2, 9], [12, 4, 9], [12, 5, 9], [12, 7, 9], [12, 1, 6], [12, 5, 6], [16, 1, 4], [16, 3, 4]]);
      const r = AC / 2, aob = 180 * p / q, boc = 180 - aob, area = r * r * boc / 360, c = ring(64);
      c.b.fan(c.O, c.R, 0, boc, TINT).seg(c.pt(180), c.O);
      mark(c, 180, 'A'); mark(c, 0, 'C'); mark(c, boc, 'B'); centre(c, 270);
      return piN(`선분 AC는 원 O의 지름이고 ${nb(`${sg('AC')} = ${AC} cm`)}이다. 원 O 위의 점 B에 대하여 호 AB의 길이와 호 AC의 길이의 비가 ${nb(`${p} : ${q}`)}일 때, 부채꼴 BOC의 넓이는?`, area, CM2, {
        figure: c.b.svg(`원 O의 지름 AC와 원 위의 점 B. 반지름 OB가 그어져 있고 부채꼴 BOC가 색칠되어 있다. 지름 AC의 길이는 ${AC} cm`),
        explain: `호 AC는 원의 둘레의 절반이므로 그 중심각의 크기는 180°이다. 호의 길이는 중심각의 크기에 정비례하므로 ∠AOB = 180° × ${frac(p, q)} = ${aob}°이고 ∠BOC = 180° − ${aob}° = ${boc}°이다. 반지름의 길이는 ${r} cm이므로 부채꼴 BOC의 넓이는 π × ${r}<sup>2</sup> × ${frac(boc, 360)} = ${area}π(${CM2})이다.`,
        facts: { calc: [[`(${AC}/2)*(${AC}/2)*(180-180*${p}/${q})/360`, 0]], unseen: [2, 180, 360] }
      });
    }, { standard: FAN }),
    RB('sector-rest', '부채꼴의 넓이로 반지름의 길이를 구해 나머지 부채꼴의 둘레의 길이 구하기', '기본 ①77', (d) => {
      // 함정: 둘레를 호의 길이로만 답하는 아이, 잘라 낸 부채꼴의 호의 길이를 구하는 아이
      const [r, t] = d.pick([[6, 120], [6, 60], [6, 90], [6, 150], [12, 60], [12, 90], [12, 120], [12, 150], [12, 45], [12, 135], [9, 40], [9, 80], [9, 120], [9, 160], [4, 90], [4, 45], [4, 135], [8, 45], [8, 90], [8, 135], [10, 36], [10, 72], [10, 108], [10, 144], [3, 120]]);
      const s = r * r * t / 360, rest = 360 - t, arc = r * rest / 180, R = 62, b = Board(), O = [0, 0];
      b.fan(O, R, 90 + t / 2, 450 - t / 2, TINT).arc(O, R, 90 - t / 2, 90 + t / 2).dot(O).name(O, 'O', 270, 12);
      // 좁은 부채꼴에는 각도 글이 들어가지 않으므로 원의 위쪽에 적는다.
      if (t < 60) b.angle(O, 90 - t / 2, 90 + t / 2, '', { r: 18, square: false }).text([0, -R - 11], t + '°', { blue: true }); else b.angle(O, 90 - t / 2, 90 + t / 2, t + '°', { r: 13 });
      return piPlus(`원 O에서 중심각의 크기가 ${t}°인 부채꼴의 넓이가 ${s}π ${CM2}이다. 원 O에서 이 부채꼴을 잘라 내고 남은 부채꼴(색칠한 부분)의 둘레의 길이는?`, arc, 2 * r, CM, {
        figure: b.svg(`원 O가 두 반지름으로 두 부채꼴로 나뉘어 있다. 중심각의 크기가 ${t}°인 부채꼴은 색칠되어 있지 않고, 나머지 부채꼴이 색칠되어 있다`),
        explain: `원 O의 반지름의 길이를 ${V_R} cm라 하면 π × ${V_R}<sup>2</sup> × ${frac(t, 360)} = ${s}π에서 ${V_R}<sup>2</sup> = ${r * r}, ${V_R} = ${r}이다. 색칠한 부채꼴의 중심각의 크기는 360° − ${t}° = ${rest}°이므로 호의 길이는 2π × ${r} × ${frac(rest, 360)} = ${arc}π(cm)이다. 둘레는 호와 반지름 2개로 이루어지므로 ${arc}π + ${r} × 2 = ${arc}π + ${2 * r}(cm)이다.`,
        facts: { calc: [[`2*((360*${s}/${t})**0.5)*(360-${t})/360`, 0], [`2*(360*${s}/${t})**0.5`, 1]], unseen: [2, 360, 0.5] }
      });
    }, { standard: FAN })
  ]);

  // ── 실력 묶음에 덧붙이는 꼴: 다각형 쪽 ──
  // 볼록한 n각형(내각 a)의 변을 양쪽으로 늘여 만든 별 모양. 변 i(꼭짓점 i → i + 1)의 바깥쪽 끝 점 T[i] 의 각의 크기는 a[i] + a[i + 1] − 180 이다.
  function starFrom(a, size) {
    const n = a.length, g = polyOf(a, [100, 100]), P0 = g.pts, T0 = P0.map((_, i) => meet(P0[(i + n - 1) % n], P0[i], P0[(i + 2) % n], P0[(i + 1) % n])), k = scaleOf(T0, size);
    return { ok: g.ok, P: P0.map((p) => times(p, k)), T: T0.map((p) => times(p, k)), tips: a.map((v, i) => v + a[(i + 1) % n] - 180) };
  }
  // 별 모양을 그린다. labels[i]: 끝 점 T[i] 의 각에 적을 글, names: 끝 점의 이름(없으면 적지 않는다)
  function starFig(s, labels, names) {
    const n = s.T.length, b = Board();
    for (let j = 0; j < n; j += 1) b.seg(s.T[(j + n - 1) % n], s.T[(j + 1) % n]);
    s.T.forEach((p, i) => { b.corner(p, s.P[i], s.P[(i + 1) % n], labels[i], { square: false }); if (names) b.name(p, names[i], awayFrom(p, [s.P[i], s.P[(i + 1) % n]]), 10); });
    return b;
  }
  // 그림 판이 각의 글을 놓는 자리를 같은 셈으로 구한다(꼭짓점 v 에서 점 p 쪽 변과 점 q 쪽 변 사이의 각). 돌려주는 것: 글 상자 [x0, y0, x1, y1]
  function spotOf(v, p, q, label) {
    let a0 = dirOf(v, p), to = dirOf(v, q);
    if ((to - a0 + 360) % 360 >= 180) { const t = a0; a0 = to; to = t; }
    while (to <= a0) to += 360;
    const span = to - a0, m = a0 + span / 2, r = span < 40 ? 22 : span > 130 ? 11 : 15, w = K.textW(label) + 5, h = K.FS + 3, c0 = Math.cos(a0 * RAD), s0 = Math.sin(a0 * RAD), c1 = Math.cos(to * RAD), s1 = Math.sin(to * RAD);
    const fits = (dd) => { const c = at(v, dd, m); return [[-1, -1], [1, -1], [1, 1], [-1, 1]].every(([sx, sy]) => { const ux = c[0] + sx * w / 2 - v[0], uy = -(c[1] + sy * h / 2 - v[1]); return c0 * uy - s0 * ux >= 1.5 && s1 * ux - c1 * uy >= 1.5; }); };
    let dd = r + 2 + (w / 2) * Math.abs(Math.cos(m * RAD)) + (h / 2) * Math.abs(Math.sin(m * RAD));
    while (dd < 96 && !fits(dd)) dd += 2;
    const c = at(v, dd, m);
    return [c[0] - w / 2, c[1] - h / 2, c[0] + w / 2, c[1] + h / 2];
  }
  // 선분 a–b 가 글 상자를 지나는가
  const crosses = (box, a, b) => { const n = Math.ceil(dist(a, b) / 1.5); for (let i = 0; i <= n; i += 1) { const x = a[0] + (b[0] - a[0]) * i / n, y = a[1] + (b[1] - a[1]) * i / n; if (x > box[0] && x < box[2] && y > box[1] && y < box[3]) return true; } return false; };
  // 글 상자들의 가운데가 서로 gap 넘게 떨어져 있는가
  const apart = (boxes, gap) => boxes.every((p, i) => boxes.every((q, j) => j <= i || Math.hypot((p[0] + p[2] - q[0] - q[2]) / 2, (p[1] + p[3] - q[1] - q[3]) / 2) >= gap));
  // 별 모양에서 끝 각의 글이 그 끝을 지나지 않는 다른 선분에 걸리지 않는가
  const starClear = (s, labels) => { const n = s.T.length; return s.T.every((p, i) => { const box = spotOf(p, s.P[i], s.P[(i + 1) % n], labels[i]); return range(0, n - 1).every((j) => j === (i + n - 1) % n || j === (i + 1) % n || !crosses(box, s.T[(j + n - 1) % n], s.T[(j + 1) % n])); }); };
  // 점 q 가 다각형 P(화면에서 시계 반대쪽으로 도는 꼭짓점)의 안쪽에, 변에서 m 넘게 떨어져 있는가
  const insidePoly = (q, P, m) => P.every((p, i) => { const r = P[(i + 1) % P.length]; return ((r[0] - p[0]) * (q[1] - p[1]) - (r[1] - p[1]) * (q[0] - p[0])) / dist(p, r) < -m; });
  // 점 q 에서 a° 쪽으로 나아가 다각형 P 의 변에 닿을 때까지의 거리
  const roomOf = (q, a, P) => {
    const u = [Math.cos(a * RAD), -Math.sin(a * RAD)]; let best = 1e9;
    P.forEach((p, i) => { const r = P[(i + 1) % P.length], e = [r[0] - p[0], r[1] - p[1]], den = u[0] * e[1] - u[1] * e[0]; if (Math.abs(den) < 1e-9) return; const t = ((p[0] - q[0]) * e[1] - (p[1] - q[1]) * e[0]) / den, k = ((p[0] - q[0]) * u[1] - (p[1] - q[1]) * u[0]) / den; if (t > 1e-6 && k >= 0 && k <= 1) best = Math.min(best, t); });
    return best;
  };
  // 점 q 에서 선분 a–b 까지의 거리
  const segGap = (q, a, b) => { const L = dist(a, b), t = Math.max(0, Math.min(1, ((q[0] - a[0]) * (b[0] - a[0]) + (q[1] - a[1]) * (b[1] - a[1])) / (L * L))); return dist(q, [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]); };
  const KOR = ['', '한', '두', '세', '네', '다섯', '여섯', '일곱'];

  B.addTypes('7-2-3', 'hard', [
    H('hard-star-tips', '별 모양으로 엇갈린 선분에서 끝 각의 크기의 합', '심21·38 / 기본 ①29·43', (d, n) => {
      if (n === 0) {
        // 다섯 선분이 엇갈린 별 모양. 한 끝의 작은 삼각형에 나머지 네 끝 각을 외각 둘로 모으면 다섯 끝 각의 크기의 합이 180°이다.
        const v = d.until(() => { const a = [0, 1, 2, 3].map(() => d.int(98, 118)); a.push(540 - sumOf(a)); const s = starFrom(a, [236, 210]); return { a, s, ask: d.shuffle([0, 1, 2, 3, 4]).slice(0, 2) }; },
          (w) => w.a[4] >= 98 && w.a[4] <= 118 && w.s.ok && w.s.tips.every((t) => t >= 26 && t <= 50) && new Set(w.s.tips).size >= 4 && starClear(w.s, w.s.tips.map((t, i) => (w.ask.includes(i) ? 'x' : t + '°'))));
        const tips = v.s.tips, names = vnames(v.s.T), order = [0, 1, 2, 3, 4].sort((p, q) => names[p].localeCompare(names[q])), [ix, iy] = v.ask.slice().sort((p, q) => names[p].localeCompare(names[q]));
        const lab = (i) => (i === ix ? 'x' : i === iy ? 'y' : tips[i] + '°'), given = order.filter((i) => i !== ix && i !== iy), ans = tips[ix] + tips[iy];
        const b = starFig(v.s, tips.map((t, i) => (i === ix ? sv('x') : i === iy ? sv('y') : t + '°')), names);
        return degQ(`다섯 개의 선분 AC, CE, EB, BD, DA가 그림과 같이 만나고 있다. 뾰족한 다섯 끝의 각 가운데 세 각의 크기가 그림과 같을 때, ∠${X} + ∠${V('y')}의 크기는?`, ans, {
          figure: b.svg(`선분 다섯 개가 서로 엇갈려 뾰족한 끝이 다섯 개인 별 모양을 이룬다. 다섯 끝 A, B, C, D, E의 각의 크기는 차례로 ${order.map(lab).join(', ')}`),
          explain: `끝 A가 있는 작은 삼각형에서 ∠A가 아닌 두 각은 저마다 다른 삼각형의 외각이므로 그 크기는 ∠B + ∠D, ∠C + ∠E이다. 삼각형의 세 내각의 크기의 합은 180°이므로 ∠A + ∠B + ∠C + ∠D + ∠E = 180°이다. ∠${X} + ∠${V('y')} = 180° − (${given.map((i) => tips[i] + '°').join(' + ')}) = ${ans}°이다.`,
          facts: { calc: [[`180-${given.map((i) => tips[i]).join('-')}`, 0]], unseen: [180] }
        });
      }
      // 칠각형의 변을 늘여 만든 일곱 뿔 별: 작은 삼각형 7개의 내각에서 칠각형의 외각을 두 번 뺀다.
      const v = d.until(() => { const a = [0, 1, 2, 3, 4, 5].map(() => d.int(120, 137)); a.push(900 - sumOf(a)); return { a, s: starFrom(a, [232, 226]) }; }, (w) => w.a[6] >= 120 && w.a[6] <= 137 && w.s.ok && w.s.tips.every((t) => t >= 62 && t <= 92) && starClear(w.s, w.a.map(() => 'a')));
      const names = vnames(v.s.T), L = 'abcdefg', b = starFig(v.s, names.map((nm) => sv(L[ALPHA.indexOf(nm)])));
      const sum = L.split('').map((ch) => `∠${V(ch)}`).join(' + ');
      return degQ(`칠각형의 일곱 변을 양쪽으로 늘여 그림과 같은 도형을 만들었다. 뾰족한 일곱 끝의 각에 대하여 ${sum}의 크기는?`, 540, {
        figure: b.svg('칠각형의 변을 모두 양쪽으로 늘여 만든, 뾰족한 끝이 일곱 개인 별 모양. 끝마다 칠각형의 한 변을 밑변으로 하는 작은 삼각형이 있고, 일곱 끝의 각이 차례로 a, b, c, d, e, f, g이다'),
        explain: '뾰족한 끝이 있는 작은 삼각형 7개의 내각의 크기의 합은 180° × 7 = 1260°이다. 이 가운데 끝 각이 아닌 각은 가운데 칠각형의 외각이고 꼭짓점마다 2개씩 있으므로, 그 크기의 합은 360° × 2 = 720°이다. 일곱 끝 각의 크기의 합은 1260° − 720° = 540°이다.',
        facts: { calc: [['180*7-360*2', 0]], unseen: [180, 7, 360, 2] }
      });
    }, { count: 2 }),
    H('hard-crossed-sum', '엇갈린 두 선분에 보조선을 그어 각의 크기의 합 옮기기', '심33·34 / 기본 ①40·41', (d, n) => {
      // 볼록한 다각형의 밑변을 지우고, 그 두 끝 점에서 안쪽으로 그은 두 선분이 점 P(차례 2는 G)에서 엇갈린다. 지운 변을 다시 그으면 맞꼭지각으로 두 각의 크기의 합이 옮겨진다.
      // P[0] 은 밑변의 왼쪽 끝, P[1] 은 오른쪽 끝이고 al·be 는 두 선분이 밑변과 이루는 각이다.
      const m = n === 0 ? d.pick([4, 5, 5]) : 5, NM = m === 5 ? ['C', 'D', 'E', 'A', 'B'] : ['B', 'C', 'D', 'A'], L0 = NM[0], L1 = NM[1], all = NM.slice().sort().join('');
      const [lo, hi] = n === 2 ? [10, 30] : n === 1 ? [35, 55] : [25, 45], size = m === 4 ? [226, 150] : n === 2 ? [232, 188] : [214, 176];
      // 두 선분은 점 G 를 지나 다각형의 변에 닿기 전에 멈춘다(변에서 gapE 넘게 떨어진 곳까지). 안쪽 점은 변·꼭짓점·꼭짓점에 적는 각도 글(꼭짓점에서 32쯤 안쪽)에서 떨어져 있어야 한다.
      const gapE = n === 0 ? 26 : 22, least = n === 0 ? 46 : n === 1 ? 28 : 38;
      const clear = (q, f, tagGap) => insidePoly(q, f.P, n === 1 ? 22 : 18) && f.P.every((p) => dist(p, q) >= (n === 2 ? 38 : 44)) && f.tags.every((p) => dist(p, q) >= tagGap);
      // 첫 단계: 엇갈리는 점 G 와 점 U(차례 0이 아니면 W 까지)
      const base = (w, g) => {
        const P = g.pts, D = g.dirs, G = meet(P[0], at(P[0], 10, w.al), P[1], at(P[1], 10, 180 - w.be));
        if (!insidePoly(G, P, 13)) return null;
        const roomW = roomOf(G, 180 - w.be, P) - gapE, lu = Math.min(w.lu, roomOf(G, w.al, P) - gapE), lw = Math.min(w.lw, roomW);
        if (lu < least || (n !== 0 && lw < least)) return null;
        const f = { P, D, G, roomW, lu, U: at(G, lu, w.al), W: at(G, lw, 180 - w.be), T: null };
        f.tags = n === 1 ? [] : P.map((p, i) => at(p, 32, i === 0 ? (w.al + w.ang[0]) / 2 : i === 1 ? (D[1] + 180 - w.be) / 2 : D[i] + w.ang[i] / 2));
        // 각도 글은 다른 꼭짓점에서 나온 선분에 걸리지 않아야 한다.
        if (f.tags.some((p, i) => (i !== 0 && segGap(p, P[0], f.U) < 17) || (n !== 0 && i !== 1 && segGap(p, P[1], f.W) < 17))) return null;
        return clear(f.U, f, 27) && (n === 0 || (clear(f.W, f, 27) && dist(f.U, f.W) >= 44)) ? f : null;
      };
      // 둘째 단계: 차례 0은 끝 각 a 로 점 W 를, 차례 2는 두 각 r, x 로 점 T 를 정한다.
      const finish = (f0, w) => {
        if (n === 1) return f0;
        const f = Object.assign({}, f0);
        if (n === 0) {
          const lw = f.lu * Math.sin(w.a * RAD) / Math.sin((w.al + w.be - w.a) * RAD);
          if (lw < least || lw > f.roomW + 0.01) return null;
          f.W = at(f.G, lw, 180 - w.be);
          // 두 끝 각의 글 a, b 가 삼각형의 가운데에서 서로 붙지 않게 한다.
          return clear(f.W, f, 27) && dist(f.U, f.W) >= 60 && f.tags.every((p, i) => (i === 1 || segGap(p, f.P[1], f.W) >= 17) && segGap(p, f.U, f.W) >= 17) && apart([spotOf(f.U, f.G, f.W, 'a'), spotOf(f.W, f.U, f.G, 'b')], 36) ? f : null;
        }
        f.T = meet(f.U, at(f.U, 10, w.al + 180 - w.r), f.W, at(f.W, 10, w.x - w.be));
        return clear(f.T, f, 34) && dist(f.T, f.U) >= 52 && dist(f.T, f.W) >= 52 && f.tags.every((p) => segGap(p, f.U, f.T) >= 17 && segGap(p, f.W, f.T) >= 17) && apart([spotOf(f.U, f.G, f.T, w.r + '°'), spotOf(f.T, f.U, f.W, w.t + '°'), spotOf(f.W, f.T, f.G, 'x')], 34) ? f : null;
      };
      const draw = (w, f) => {
        const { P, D, G, U, W, T } = f, b = Board(), mark = w.ang.map((v, i) => (i === 0 ? v - w.al : i === 1 ? v - w.be : v));
        for (let i = 1; i < m; i += 1) b.seg(P[i], P[(i + 1) % m]);
        b.seg(P[0], U).seg(P[1], W);
        const sides = (i) => (i === 0 ? [w.al, w.ang[0]] : i === 1 ? [D[1], 180 - w.be] : [D[i], D[i] + w.ang[i]]);
        if (n === 1) {
          for (let i = 0; i < m; i += 1) b.fan(P[i], 15, sides(i)[0], sides(i)[1], TINT);
          b.angle(G, w.al, 180 - w.be, (180 - w.al - w.be) + '°').name(U, 'H', w.al).name(W, 'F', 180 - w.be).name(G, 'G', 270, 13);
        } else {
          for (let i = 0; i < m; i += 1) b.angle(P[i], sides(i)[0], sides(i)[1], mark[i] + '°');
          if (n === 0) b.seg(U, W).corner(U, G, W, sv('a'), { square: false }).corner(W, U, G, sv('b'), { square: false });
          else b.seg(U, T).seg(W, T).corner(U, G, T, w.r + '°').corner(T, U, W, w.t + '°').corner(W, T, G, sv('x'), { square: false }).name(U, 'F', awayFrom(U, [G, T])).name(T, 'G', awayFrom(T, [U, W])).name(W, 'H', awayFrom(W, [G, T]));
          b.name(G, 'P', 270, 13);
        }
        P.forEach((p, i) => b.name(p, NM[i], awayFrom(p, [P[(i + m - 1) % m], P[(i + 1) % m]])));
        return { b, mark };
      };
      // 다각형 하나를 뽑으면 그 안에 들어가는 각의 짝(al, be, 그리고 끝 각)을 모두 따져 보고 그 가운데 하나를 고른다(하나씩 뽑아 맞추면 너무 오래 걸린다).
      const steps = range(lo / 5, hi / 5).map((k) => 5 * k), pairs = steps.reduce((rows, al) => rows.concat(steps.map((be) => [al, be])), []);
      const v = d.until(() => {
        const ang = anglesOf(d, m), g = polyOf(ang, size), lw = d.int(n === 2 ? 0 : 30, n === 2 ? 14 : 42), list = [];
        const lus = n === 2 ? [44, 58, 72] : [d.int(n === 1 ? 32 : 56, n === 1 ? 44 : 92)], tries = d.shuffle(pairs.reduce((rows, pr) => rows.concat(lus.map((lu) => pr.concat([lu]))), []));
        for (const [al, be, lu] of tries) {
          if (ang[0] - al < 40 || ang[1] - be < 40) continue;
          const more = n === 0 ? range(5, 9).map((k) => ({ a: 5 * k })).filter((e) => al + be - e.a >= 25 && e.a !== al + be - e.a)
            : n === 2 ? range(14, 19).reduce((rows, i) => rows.concat(range(12, 17).map((j) => ({ r: 5 * i, t: 5 * j, x: 180 + al + be - 5 * i - 5 * j }))), []).filter((e) => e.x >= 35 && e.x <= 70 && e.x !== e.r && e.x !== e.t)
              : [{}];
          const w0 = { ang, al, be, lu, lw: n === 2 ? lu + lw : lw }, f0 = base(w0, g);
          if (!f0) continue;
          for (const e of more) { const w = Object.assign({}, w0, e), f = finish(f0, w); if (f) list.push(Object.assign(w, { f })); }
          if (list.length >= 8) break;
        }
        for (const w of d.shuffle(list).slice(0, 4)) if (!draw(w, w.f).b.clash()) return w;
        return null;
      }, (w) => Boolean(w));
      const { b, mark } = draw(v, v.f), sum = inSum(m), listed = NM.map((nm, i) => [nm, mark[i]]).sort((p, q) => p[0].localeCompare(q[0]));
      const cut = `${gon(m)} ${all}에서 변 ${L0}${L1}가 지워져 있다. `, at0 = `꼭짓점 ${L0}에서 이웃한 변과 선분 ${L0}`, at1 = `꼭짓점 ${L1}에서 이웃한 변과 선분 ${L1}`;
      const said = (pt) => listed.map(([nm, val]) => (nm === L0 ? `${at0}${pt}가 이루는 각 ${val}°` : nm === L1 ? `${at1}${pt}가 이루는 각 ${val}°` : `∠${nm} = ${val}°`)).join(', ');
      if (n === 0) {
        const ans = v.al + v.be;
        return degQ(`${gon(m)} ${all}의 변 ${L0}${L1}를 지우고, 두 점 ${L0}, ${L1}에서 그은 두 선분이 그림과 같이 점 P에서 엇갈리도록 하였다. ∠${V('a')} + ∠${V('b')}의 크기는?`, ans, {
          figure: b.svg(`${cut}점 ${L0}에서 그은 선분과 점 ${L1}에서 그은 선분이 ${gon(m)}의 안쪽 점 P에서 엇갈린 다음 더 뻗어 있고, 뻗은 두 끝을 이은 선분이 있어 점 P와 두 끝이 삼각형을 이룬다. 그 삼각형에서 두 끝의 각이 a, b이다. 표시된 각의 크기는 ${said('P')}`),
          explain: `선분 ${L0}${L1}를 그으면 △P${L0}${L1}와 ∠${V('a')}, ∠${V('b')}가 있는 삼각형은 점 P에서 맞꼭지각을 가지므로 ∠${V('a')} + ∠${V('b')} = ∠P${L0}${L1} + ∠P${L1}${L0}이다. ${gon(m)} ${all}의 내각의 크기의 합은 ${sum}°이고 표시된 ${KOR[m]} 각에 ∠P${L0}${L1}와 ∠P${L1}${L0}를 더하면 ${gon(m)}의 내각이 모두 채워진다. ∠${V('a')} + ∠${V('b')} = ${sum}° − (${listed.map((w) => w[1] + '°').join(' + ')}) = ${ans}°이다.`,
          facts: { calc: [[`${sum}-${listed.map((w) => w[1]).join('-')}`, 0]], unseen: [sum] }
        });
      }
      if (n === 1) {
        const gv = 180 - v.al - v.be, ans = 540 - (180 - gv);
        return degQ(`오각형 ABCDE의 변 CD를 지우고, 점 C에서 그은 선분 CH와 점 D에서 그은 선분 DF가 그림과 같이 점 G에서 엇갈리도록 하였다. ∠FGH = ${gv}°일 때, 색칠한 다섯 각의 크기의 합은?`, ans, {
          figure: b.svg(`${cut}점 C에서 그은 선분 CH와 점 D에서 그은 선분 DF가 오각형의 안쪽 점 G에서 엇갈린다. ∠FGH = ${gv}°이고, ∠A, ∠B, ∠BCH, ∠EDF, ∠E의 다섯 각이 색칠되어 있다`),
          explain: `선분 CD를 그으면 ∠CGD = ∠FGH = ${gv}°(맞꼭지각)이므로 △GCD에서 ∠GCD + ∠GDC = 180° − ${gv}° = ${180 - gv}°이다. 오각형 ABCDE의 내각의 크기의 합은 540°이고 색칠한 다섯 각에 ∠GCD와 ∠GDC를 더하면 오각형의 내각이 모두 채워진다. 색칠한 각의 크기의 합은 540° − ${180 - gv}° = ${ans}°이다.`,
          facts: { calc: [[`540-(180-${gv})`, 0]], unseen: [540, 180] }
        });
      }
      const rest = 540 - sumOf(mark), top = 180 - rest;
      return degQ(`오각형 ABCDE의 변 CD를 지우고, 두 점 C, D에서 그은 선분 CF, DH가 그림과 같이 점 P에서 엇갈리도록 한 다음 사각형 PFGH를 그렸다. ∠${X}의 크기는?`, v.x, {
        figure: b.svg(`${cut}점 C에서 그은 선분 CF와 점 D에서 그은 선분 DH가 오각형의 안쪽 점 P에서 엇갈리고, 선분 FG와 선분 GH가 그어져 사각형 PFGH를 이룬다. 표시된 각의 크기는 ${said('P')}, ∠PFG = ${v.r}°, ∠FGH = ${v.t}°, ∠GHP = x`),
        explain: `선분 CD를 그으면 오각형 ABCDE의 내각의 크기의 합이 540°이므로 ∠PCD + ∠PDC = 540° − (${listed.map((w) => w[1] + '°').join(' + ')}) = ${rest}°이다. △PCD에서 ∠CPD = 180° − ${rest}° = ${top}°이고 ∠FPH = ∠CPD = ${top}°(맞꼭지각)이다. 사각형 PFGH의 내각의 크기의 합은 360°이므로 ∠${X} = 360° − (${top}° + ${v.r}° + ${v.t}°) = ${v.x}°이다.`,
        facts: { calc: [[`360-(180-(540-${listed.map((w) => w[1]).join('-')}))-${v.r}-${v.t}`, 0]], unseen: [360, 180, 540] }
      });
    }, { count: 3 }),
    H('hard-ratio-count', '한 외각의 크기를 한 내각의 크기로 나눈 값이 자연수인 정다각형', '심26', () => {
      // 정n각형에서 (한 외각) ÷ (한 내각) = 2 ÷ (n − 2). 변의 개수를 하나씩 늘려 가며 모두 따져 본다.
      const hits = range(3, 360).filter((k) => 2 % (k - 2) === 0);
      return cntQ('정다각형 가운데 한 외각의 크기를 한 내각의 크기로 나눈 값이 자연수인 것은 모두 몇 개인가?', hits.length, {
        explain: `정${N_}각형의 한 외각의 크기는 ${frac('360°', N_)}, 한 내각의 크기는 ${frac(`180° × (${N_} − 2)`, N_)}이므로 나눈 값은 ${frac(2, `${N_} − 2`)}이다. 이 값이 자연수이려면 ${N_} − 2가 2의 약수 1, 2이어야 하므로 ${N_} = 3, 4이다. 정삼각형은 120° ÷ 60° = 2, 정사각형은 90° ÷ 90° = 1이고, 정오각형부터는 한 외각의 크기가 한 내각의 크기보다 작다. 모두 ${hits.length}개이다.`,
        facts: { calc: [[hits.map((k) => `(360/${k})/(360/${k})`).join('+'), 0]], unseen: [360].concat(hits) }
      });
    })
  ]);

  // 받는 쪽에서 실력에서 기본으로 내린 꼴(공식 한 번과 한 단계 잇기)
  B.addTypes('7-2-3', 'sum', [
    TB('sum-diag-pieces', '한 꼭짓점에서 그은 대각선으로 나누어진 도형으로 다각형 찾기', '심7', (d) => {
      // 대각선을 한 꼭짓점에서 그었으므로 나누어진 도형의 내각의 크기를 모두 더하면 처음 다각형의 내각의 크기의 합이다.
      const parts = d.pick([[3, 4, 5], [3, 3, 4], [3, 4, 4], [4, 4, 5], [3, 5, 5], [3, 4, 6], [4, 5, 5], [3, 5, 6], [4, 5, 6], [3, 3, 5], [3, 6, 6], [5, 5, 6], [4, 4, 6]]), m = sumOf(parts) - 4, kinds = [...new Set(parts)];
      const told = kinds.map((k) => `${gon(k)} ${parts.filter((p) => p === k).length}개`).join(', '), sums = parts.map((k) => inSum(k)), total = sumOf(sums);
      return gonQ(`어떤 다각형의 한 꼭짓점에서 대각선을 2개 그었더니 이 다각형이 ${told}로 나누어졌다. 이 다각형은 몇 각형인가?`, m, {
        explain: `대각선을 한 꼭짓점에서 그었으므로 나누어진 세 도형의 내각의 크기를 모두 더하면 처음 다각형의 내각의 크기의 합이 된다. ${sums.map((s) => s + '°').join(' + ')} = ${total}°이고 180° × (${N_} − 2) = ${total}°에서 ${N_} = ${m}이므로 ${gon(m)}이다.`,
        facts: { calc: [[`(${parts.map((k) => `180*(${k}-2)`).join('+')})/180+2`, 0]], unseen: [180, 3, 4, 5, 6] }
      });
    })
  ]);
  B.addTypes('7-2-3', 'regular', [
    TB('regular-parallel', '평행한 두 직선 사이에 놓인 정오각형', '심31', (d) => {
      // 꼭짓점 B를 지나는 평행선을 그으면 ∠ABC = 108°가 엇각 둘로 나뉜다.
      // (주어진 각이 47°보다 작으면 꼭짓점 D가, 61°보다 크면 꼭짓점 E가 직선에 닿은 것처럼 보인다.)
      const g = d.until(() => d.int(47, 61), (w) => w !== 54), x = 108 - g, s = 80, b = Board(), l = V('l'), mm = V('m');
      const pA = [0, 0], pB = at(pA, s, -g), pC = at(pB, s, -g - 72), pD = at(pC, s, -g - 144), pE = at(pD, s, -g - 216), xs = [pA, pB, pC, pD, pE].map((p) => p[0]), x0 = Math.min(...xs) - 22, x1 = Math.max(...xs) + 44;
      b.seg([x0, pA[1]], [x1, pA[1]]).seg([x0, pC[1]], [x1, pC[1]]).poly([pA, pB, pC, pD, pE]).angle(pA, -g, 0, g + '°').angle(pC, 0, 108 - g, sv('x'), { square: false });
      b.text([x1 + 8, pA[1]], sv('l'), { plain: true }).text([x1 + 9, pC[1]], sv('m'), { plain: true });
      b.name(pA, 'A', 90).name(pB, 'B', awayFrom(pB, [pA, pC])).name(pC, 'C', 270).name(pD, 'D', 180).name(pE, 'E', 180);
      return degQ(`서로 평행한 두 직선 ${l}, ${mm} 사이에 정오각형 ABCDE가 있다. 꼭짓점 A는 직선 ${l} 위에, 꼭짓점 C는 직선 ${mm} 위에 있고, 직선 ${l}과 변 AB가 이루는 각의 크기가 ${g}°이다. 직선 ${mm}과 변 BC가 이루는 각 ∠${X}의 크기는?`, x, {
        figure: b.svg(`평행한 두 직선 l, m 사이에 정오각형 ABCDE가 놓여 있다. 꼭짓점 A는 위쪽 직선 l 위에, 꼭짓점 C는 아래쪽 직선 m 위에 있고, 꼭짓점 B는 두 직선 사이에서 오른쪽으로 튀어나와 있다. 직선 l과 변 AB가 꼭짓점 A의 오른쪽에서 이루는 각의 크기는 ${g}°, 직선 m과 변 BC가 꼭짓점 C의 오른쪽에서 이루는 각이 x`),
        explain: `정오각형의 한 내각의 크기는 ${frac('180° × (5 − 2)', 5)} = 108°이다. 꼭짓점 B를 지나고 직선 ${l}에 평행한 직선을 그으면 평행선에서 엇각의 크기는 같으므로 ∠ABC는 크기가 ${g}°인 각과 크기가 ∠${X}인 각으로 나뉜다. ∠${X} = 108° − ${g}° = ${x}°이다.`,
        facts: { calc: [[`180*(5-2)/5-${g}`, 0]], unseen: [180, 5, 2] }
      });
    })
  ]);

  // ── 실력 묶음에 덧붙이는 꼴: 원과 부채꼴 쪽 ──
  // 계수가 p/q 인 π 의 글(약분해서 적는다): 3π, π, (2/3)π
  const piq = (p, q) => { const g = gcd(p, q); return q / g === 1 ? kpi(p / g) : frac(p / g, q / g) + 'π'; };
  // 시계의 문자판(반지름 R). 숫자는 원의 바깥에 작게 적는다. ang(h): h시 눈금의 방향(도), pt(h): 그 자리
  function clockFace(R) {
    const b = Board(), O = [0, 0], ang = (h) => 90 - 30 * h;
    b.disk(O, R);
    for (let h = 1; h <= 12; h += 1) b.seg(at(O, R - 5, ang(h)), at(O, R, ang(h)), 'thin').text(at(O, R + 12, ang(h)), `<tspan style="fill:#5b6770">${h}</tspan>`, { plain: true });
    return { b, O, R, ang, pt: (h) => at(O, R, ang(h)) };
  }
  // 선분 p–q 를 지름으로 하고 점 away 의 반대쪽으로 볼록한 반원. d: 경로 글, top: 가장 볼록한 점, pts: 그림의 크기를 재는 데 쓸 호 위의 점들
  const semiOn = (p, q, away) => { const m = mid(p, q), r = dist(p, q) / 2, a = dirOf(m, p), up = dist(at(m, r, a + 90), away) > dist(at(m, r, a - 90), away) ? 1 : -1; return { d: `M${XY(p)}${arcTo(m, r, a, a + 180 * up)}Z`, top: at(m, r, a + 90 * up), pts: range(0, 12).map((i) => at(m, r, a + 15 * i * up)) }; };
  const DASH = 'fill:none;stroke:#5b6770;stroke-width:1.1;stroke-dasharray:4 3';
  // 중심이 같은 두 호로 나눈 부채꼴(안쪽 부채꼴과 바깥 띠를 색칠한다): [중심각, 안쪽 반지름, 가운데 띠의 폭, 바깥 띠의 폭]. 세 호의 길이의 합의 π 계수가 자연수이고 치수 글이 서로 닿지 않는 것
  const SPLITS = [60, 90, 120, 135].reduce((all, t) => {
    for (const r1 of [2, 3, 4]) for (const w1 of [2, 3, 4]) for (const w2 of [2, 3, 4, 5]) { const R = r1 + w1 + w2, k = (t > 100 ? 128 : 150) / R; if (R <= 12 && ((3 * r1 + 2 * w1 + w2) * t) % 180 === 0 && (r1 + w1) * k >= 72 && (w1 + w2) * k >= 72 && r1 * k >= 26) all.push([t, r1, w1, w2]); }
    return all;
  }, []);

  B.addTypes('7-2-3', 'hard', [
    H('hard-parallel-double', '각의 크기를 모르는 채 평행선과 이등변삼각형으로 호의 길이 구하기', '심49 / 기본 ①67', (d) => {
      // 각의 크기가 하나도 주어지지 않는다. ∠AOB를 문자로 놓고 엇각, 이등변삼각형의 밑각, 외각을 차례로 써서 ∠COD = 2∠AOB를 얻는다.
      const th = d.int(28, 40), L = d.int(2, 9), back = d.bool(), c = ring(70), pA = c.pt(180 + th), pB = c.pt(180), pC = c.pt(2 * th);
      c.b.seg(pB, c.pt(0)).seg(pB, pC).seg(c.O, pA).arrow(pB, pC, 0.5).arrow(pA, c.O, 0.5);
      if (back) c.b.arcDim(c.O, c.R, 0, 2 * th, `${2 * L} cm`); else c.b.arcDim(c.O, c.R, 180, 180 + th, `${L} cm`);
      mark(c, 180 + th, 'A', back ? 0 : 13); mark(c, 180, 'B', back ? 0 : -13); mark(c, 2 * th, 'C', back ? 13 : 0); mark(c, 0, 'D', back ? -13 : 0); centre(c, [0, 180, 180 + th]);
      const given = back ? ['CD', 2 * L, 'AB', L] : ['AB', L, 'CD', 2 * L];
      return N(`선분 BD는 원 O의 지름이고 ${nb(`${sg('OA')} ∥ ${sg('BC')}`)}이다. 호 ${given[0]}의 길이가 ${given[1]} cm일 때, 호 ${given[2]}의 길이는 몇 cm인가?`, given[3], {
        unit: 'cm', figure: c.b.svg(`원 O의 지름 BD와 현 BC, 반지름 OA. 선분 OA와 현 BC에 평행하다는 표시가 있고, 점 A와 점 C는 지름 BD를 사이에 두고 서로 반대쪽에 있다. 호 ${given[0]}의 길이는 ${given[1]} cm`),
        explain: `∠AOB = ∠${X}라 하자. ${sg('OA')} ∥ ${sg('BC')}이므로 ∠OBC = ∠AOB = ∠${X}(엇각)이다. 반지름 OC를 그으면 ${sg('OB')} = ${sg('OC')}이므로 ∠OCB = ∠OBC = ∠${X}이다. ∠COD는 △OBC의 외각이므로 ∠${X} + ∠${X} = 2∠${X}이다. 호의 길이는 중심각의 크기에 정비례하므로 호 CD의 길이는 호 AB의 길이의 2배이다. 호 ${given[2]}의 길이는 ${back ? `${2 * L} ÷ 2` : `${L} × 2`} = ${given[3]}(cm)이다.`,
        facts: { calc: [[back ? `${2 * L}/2` : `2*${L}`, 0]], unseen: [2] }
      });
    }, { standard: FAN }),
    H('hard-perp-radius', '현에 수직인 반지름이 나눈 중심각', '심51', (d) => {
      // 삼각형의 합동을 쓰지 않는다: 이등변삼각형 OBC의 두 밑각의 크기가 같고 반지름 OD가 현 BC와 수직이므로, 두 직각삼각형의 나머지 각 ∠BOD와 ∠COD의 크기가 같다.
      const k = d.pick([2, 3, 4]), x = 180 / (k + 2), c = ring(76), pB = c.pt(0), pC = c.pt(2 * x), pM = mid(pB, pC);
      c.b.seg(c.pt(180), pB).seg(c.O, pC).seg(c.O, c.pt(x)).seg(pB, pC).corner(pM, c.O, pC, '');
      c.b.angle(c.O, 0, x, sv('x'), { r: 22, square: false }).angle(c.O, 2 * x, 180, `${k}${sv('x')}`, { r: 13, square: false });
      mark(c, 180, 'A'); mark(c, 0, 'B'); mark(c, 2 * x, 'C'); mark(c, x, 'D'); centre(c, 270);
      return degQ(`선분 AB는 원 O의 지름이고 두 점 C, D는 원 O 위의 점이다. ${nb(`${sg('OD')} ⊥ ${sg('BC')}`)}이고 ∠BOD = ∠${X}, ∠AOC = ${k}∠${X}일 때, ∠${X}의 크기는?`, x, {
        figure: c.b.svg(`원 O의 지름 AB와 원 위의 두 점 C, D. 반지름 OC, OD와 현 BC가 그어져 있고, 반지름 OD와 현 BC가 만나는 곳에 직각 표시가 있다. 점 D는 호 BC 위에 있다. ∠BOD = x, ∠AOC = ${k}x`),
        explain: `${sg('OB')} = ${sg('OC')}이므로 △OBC는 이등변삼각형이고 ∠OBC = ∠OCB이다. 반지름 OD와 현 BC가 만나는 점을 M이라 하면 △OBM과 △OCM은 한 각의 크기가 90°이고 다른 한 각의 크기가 서로 같으므로 나머지 각의 크기도 같다. 즉 ∠COD = ∠BOD = ∠${X}이다. ∠AOC + ∠COD + ∠BOD = 180°이므로 ${k}∠${X} + ∠${X} + ∠${X} = 180°, ∠${X} = ${x}°이다.`,
        facts: { calc: [[`180/(${k}+2)`, 0]], unseen: [180, 2] }
      });
    }, { standard: FAN }),
    H('hard-clock-arc', '시계의 시침과 분침 사이의 호의 길이', '심53', (d) => {
      // 30분일 때 시침은 두 숫자의 한가운데에 있다(숫자를 가리킨다고 보면 15°가 어긋난다).
      const [C, h] = d.until(() => [d.pick([24, 48, 72]), d.int(1, 12)], (w) => w[1] % 12 !== 5 && w[1] % 12 !== 6), hh = h % 12, next = hh + 1;
      const gaps = hh <= 4 ? 5 - hh : hh - 6, angle = 30 * gaps + 15, ans = C * angle / 360, f = clockFace(74), hourA = 75 - 30 * hh;
      f.b.arc(f.O, f.R, Math.min(hourA, -90), Math.max(hourA, -90), 'bold').seg(f.O, at(f.O, f.R * 0.86, -90)).seg(f.O, at(f.O, f.R * 0.56, hourA), null, 'stroke-width:2.8').dot(f.O, 3);
      return N(`둘레의 길이가 ${C} cm인 원 모양의 시계가 ${h}시 30분을 가리키고 있다. 시계의 둘레에서 시침이 가리키는 곳과 분침이 가리키는 곳 사이의 호 가운데 짧은 쪽(굵게 나타낸 호)의 길이는 몇 cm인가?`, ans, {
        unit: 'cm', figure: f.b.svg(`숫자 1부터 12까지가 둘레를 똑같이 나누는 원 모양의 시계. 긴 분침은 6을, 짧은 시침은 ${josa(h, '과/와')} ${next} 사이의 한가운데를 가리킨다. 두 바늘이 가리키는 곳 사이의 짧은 쪽 호가 굵게 그려져 있다`),
        explain: `숫자 눈금 한 칸에 대한 중심각의 크기는 360° ÷ 12 = 30°이다. 30분일 때 분침은 6을 가리키고, 시침은 ${josa(h, '과/와')} ${next} 사이의 한가운데를 가리킨다. 두 바늘이 이루는 각의 크기는 30° × ${gaps} + 15° = ${angle}°이다. 호의 길이는 중심각의 크기에 정비례하므로 ${C} × ${frac(angle, 360)} = ${ans}(cm)이다.`,
        facts: { calc: [[`${C}*(30*${gaps}+15)/360`, 0]], unseen: [gaps, 15, 360] }
      });
    }, { standard: FAN }),
    H('hard-clock-triangle', '시계의 눈금 위의 세 점을 이은 삼각형의 각', '심54', (d) => {
      // 원주각의 성질은 쓰지 않는다: 시계의 중심과 세 점을 이으면 이등변삼각형이 생기고, 그 밑각 둘을 더한다.
      const [g1, g2, g3] = d.pick([[3, 4, 5], [3, 5, 4], [4, 3, 5], [4, 5, 3], [5, 3, 4], [5, 4, 3], [2, 5, 5], [5, 2, 5], [5, 5, 2]]), hA = d.int(1, 12), hB = (hA + g1 - 1) % 12 + 1, hC = (hB + g2 - 1) % 12 + 1;
      const f = clockFace(70), pA = f.pt(hA), pB = f.pt(hB), pC = f.pt(hC), ans = 15 * g3, far = [[g1, hA + g1 / 2], [g2, hB + g2 / 2], [g3, hC + g3 / 2]].sort((p, q) => q[0] - p[0])[0][1];
      f.b.poly([pA, pB, pC]).corner(pB, pA, pC, sv('x'), { square: false }).dot(pA).dot(pB).dot(pC).dot(f.O).name(f.O, 'O', f.ang(far) + 180, 11);
      [[hA, 'A'], [hB, 'B'], [hC, 'C']].forEach(([h, nm]) => f.b.text(at(f.O, f.R + 31, f.ang(h)), nm));
      const ao = 30 * g1, bo = 30 * g2;
      return degQ(`그림은 숫자 12개가 둘레를 똑같이 나누는 원 모양의 시계의 문자판이다. ${hA}, ${hB}, ${josa(hC, '을/를')} 나타내는 눈금의 자리에 있는 원 위의 세 점을 차례로 A, B, C라 할 때, ∠ABC의 크기는?`, ans, {
        figure: f.b.svg(`숫자 1부터 12까지가 둘레를 똑같이 나누는 원 모양의 시계의 문자판과 그 중심 O. 숫자 ${hA}의 눈금 자리에 점 A, 숫자 ${hB}의 눈금 자리에 점 B, 숫자 ${hC}의 눈금 자리에 점 C가 있고 삼각형 ABC가 그려져 있다. ∠ABC = x`),
        explain: `눈금 한 칸에 대한 중심각의 크기는 360° ÷ 12 = 30°이다. 시계의 중심 O와 세 점을 이으면 ∠AOB = 30° × ${g1} = ${ao}°, ∠BOC = 30° × ${g2} = ${bo}°이다. ${sg('OA')} = ${sg('OB')} = ${sg('OC')}이므로 △OAB와 △OBC는 이등변삼각형이고 ∠OBA = (180° − ${ao}°) ÷ 2 = ${90 - ao / 2}°, ∠OBC = (180° − ${bo}°) ÷ 2 = ${90 - bo / 2}°이다. ∠ABC = ${90 - ao / 2}° + ${90 - bo / 2}° = ${ans}°이다.`,
        facts: { calc: [[`(180-30*${g1})/2+(180-30*${g2})/2`, 0]], unseen: [180, 30, 2, g1, g2] }
      });
    }, { standard: FAN }),
    H('hard-semi-iso-sector', '반원과 이등변삼각형이 만나 생긴 부채꼴의 넓이', '심55', (d) => {
      const [r, bv] = d.pick([[6, 55], [6, 60], [6, 65], [6, 70], [6, 75], [12, 55], [12, 60], [12, 65], [12, 70], [12, 75], [9, 55], [9, 65], [9, 75], [3, 65], [3, 75]]);
      const aod = 180 - 2 * bv, doe = 180 - 2 * aod, area = r * r * doe / 360, R = 46, b = Board(), O = [0, 0], pA = [-R, 0], pB = [R, 0], pC = [0, -R * Math.tan(bv * RAD)], pD = at(O, R, 2 * bv), pE = at(O, R, 180 - 2 * bv);
      b.fan(O, R, 180 - 2 * bv, 2 * bv, TINT).arc(O, R, 0, 180).seg(pA, pB).seg(pA, pC).seg(pB, pC).angle(pA, 0, bv, '', { r: 12, square: false }).text([-R - 19, -3], bv + '°', { blue: true }).dim(pA, pB, `${2 * r} cm`, pC, 24);
      b.dot(O).name(O, 'O', 270, 11).name(pA, 'A', 262, 12).name(pB, 'B', 340).name(pC, 'C', 90).name(pD, 'D', 2 * bv + 28, 12).name(pE, 'E', 152 - 2 * bv, 12);
      return piN(`지름의 길이가 ${2 * r} cm인 반원 O가 있다. 지름 AB를 밑변으로 하고 ${nb(`${sg('CA')} = ${sg('CB')}`)}인 이등변삼각형 CAB의 두 변 CA, CB가 반원의 호와 만나는 점을 각각 D, E라 하자. ∠CAB = ${bv}°일 때, 부채꼴 DOE의 넓이는?`, area, CM2, {
        figure: b.svg(`지름 AB의 길이가 ${2 * r} cm인 반원 O와, 지름 AB를 밑변으로 하는 이등변삼각형 CAB. 꼭짓점 C는 반원의 바깥 위쪽에 있고, 변 CA는 반원의 호와 점 D에서, 변 CB는 점 E에서 만난다. 부채꼴 DOE가 색칠되어 있다. 꼭짓점 A에 표시된 각 ∠CAB의 크기는 ${bv}°`),
        explain: `${sg('OA')} = ${sg('OD')}이므로 ∠ODA = ∠OAD = ${bv}°이고 ∠AOD = 180° − ${bv}° × 2 = ${aod}°이다. 같은 방법으로 ∠BOE = ${aod}°이므로 ∠DOE = 180° − ${aod}° × 2 = ${doe}°이다. 반지름의 길이는 ${r} cm이므로 부채꼴 DOE의 넓이는 π × ${r}<sup>2</sup> × ${frac(doe, 360)} = ${area}π(${CM2})이다.`,
        facts: { calc: [[`(${2 * r}/2)*(${2 * r}/2)*(180-2*(180-2*${bv}))/360`, 0]], unseen: [2, 180, 360] }
      });
    }, { standard: FAN }),
    H('hard-semicircles', '반원을 이어 붙인 도형의 둘레와 넓이', '기본 ①82 / 심60', (d, n) => {
      if (n === 0) {
        // 큰 반원에서 작은 반원 하나를 파내고 그 옆에 같은 반원을 붙인 꼴. 둘레는 호 셋이고, 넓이는 붙은 반원을 파인 곳으로 옮기면 큰 반원이다.
        const a = d.int(2, 6), R = 108, s = 54, b = Board(), O = [0, 0], c1 = [s, 0], c2 = [-s, 0];
        b.shape(`M${XY([-R, 0])}${arcTo(O, R, 180, 0)}${arcTo(c1, s, 0, 180)}${arcTo(c2, s, 0, -180)}Z`, [[-R, 0], [R, 0], [0, -R], [-s, s]], TINT).seg([-R, 0], [R, 0], 'thin');
        b.dim([-R, 0], O, `${2 * a} cm`, [-s, 40], 9).dim(O, [R, 0], `${2 * a} cm`, [s, -40], 9);
        return piTwo(`그림은 지름의 길이가 ${4 * a} cm인 반원과 지름의 길이가 ${2 * a} cm인 반원 2개로 이루어진 도형이다. 색칠한 부분의 둘레의 길이와 넓이는?`, [['둘레', 4 * a, CM], ['넓이', 2 * a * a, CM2]], {
          figure: b.svg(`지름의 길이가 ${4 * a} cm인 큰 반원이 지름의 위쪽에 있다. 지름의 오른쪽 절반 위에는 지름의 길이가 ${2 * a} cm인 작은 반원 모양으로 파인 곳이 있고, 지름의 왼쪽 절반 아래에는 지름의 길이가 ${2 * a} cm인 작은 반원이 붙어 있다. 큰 반원에서 파인 곳을 뺀 부분과 아래에 붙은 작은 반원이 색칠되어 있다`),
          explain: `색칠한 부분의 둘레는 큰 반원의 호 1개와 작은 반원의 호 2개이다. π × ${2 * a} + (π × ${a}) × 2 = ${4 * a}π(cm)이다. 파인 곳과 아래에 붙은 작은 반원은 합동이므로 붙은 반원을 파인 곳으로 옮기면 색칠한 부분은 큰 반원이 된다. 넓이는 π × ${2 * a}<sup>2</sup> × ${frac(1, 2)} = ${2 * a * a}π(${CM2})이다.`,
          facts: { calc: [[`${4 * a}/2+2*(${2 * a}/2)`, 0], [`(${4 * a}/2)*(${4 * a}/2)/2`, 1]], unseen: [2] }
        });
      }
      if (n === 1) {
        // 원의 지름을 둘로 나누어 한쪽 반원은 아래로 파내고 다른 쪽 반원은 위로 붙인 꼴(태극 무늬). 둘레는 호 셋, 넓이는 반원 셋을 더하고 뺀다.
        const [p, q] = d.pick([[3, 6], [2, 4], [4, 6], [4, 8], [6, 3], [4, 2], [6, 4], [3, 5], [5, 3], [4, 5], [5, 4]]), R = p + q, k = 78 / R, b = Board(), O = [0, 0], cp = [(-R + p) * k, 0], cq = [(R - q) * k, 0], pC = [(-R + 2 * p) * k, 0];
        b.disk(O, R * k).shape(`M${XY([-R * k, 0])}${arcTo(O, R * k, 180, 360)}${arcTo(cq, q * k, 0, 180)}${arcTo(cp, p * k, 0, -180)}Z`, [[-R * k, 0], [R * k, 0], [0, R * k]], TINT).seg([-R * k, 0], [R * k, 0], 'thin');
        b.dim([-R * k, 0], pC, `${2 * p} cm`, [cp[0], 40], 9).dim(pC, [R * k, 0], `${2 * q} cm`, [cq[0], -40], 9).dot([-R * k, 0]).dot([R * k, 0]).dot(pC).name([-R * k, 0], 'A', 180).name([R * k, 0], 'B', 0).text([pC[0] - 2, -24], 'C');
        const area = q * R;
        return piTwo(`선분 AB는 원의 지름이고 점 C는 지름 AB 위의 점이다. ${nb(`${sg('AC')} = ${2 * p} cm`)}, ${nb(`${sg('CB')} = ${2 * q} cm`)}이고 선분 AC, CB를 각각 지름으로 하는 두 반원을 그림과 같이 그렸다. 색칠한 부분의 둘레의 길이와 넓이는?`, [['둘레', 2 * R, CM], ['넓이', area, CM2]], {
          figure: b.svg(`지름이 AB인 원. 점 C는 지름 AB 위에 있고 선분 AC의 길이는 ${2 * p} cm, 선분 CB의 길이는 ${2 * q} cm이다. 선분 AC를 지름으로 하는 반원은 지름의 아래쪽에, 선분 CB를 지름으로 하는 반원은 지름의 위쪽에 그려져 있다. 원의 아래쪽 절반에서 선분 AC를 지름으로 하는 반원을 뺀 부분과 선분 CB를 지름으로 하는 반원이 색칠되어 있다`),
          explain: `원의 반지름의 길이는 (${2 * p} + ${2 * q}) ÷ 2 = ${R}(cm)이다. 색칠한 부분의 둘레는 원의 둘레의 절반과 두 반원의 호이므로 π × ${R} + π × ${p} + π × ${q} = ${2 * R}π(cm)이다. 넓이는 원의 넓이의 절반에 선분 CB를 지름으로 하는 반원의 넓이를 더하고 선분 AC를 지름으로 하는 반원의 넓이를 뺀 것이므로 π × ${R}<sup>2</sup> × ${frac(1, 2)} + π × ${q}<sup>2</sup> × ${frac(1, 2)} − π × ${p}<sup>2</sup> × ${frac(1, 2)} = ${area}π(${CM2})이다.`,
          facts: { calc: [[`(${2 * p}+${2 * q})/2+${2 * p}/2+${2 * q}/2`, 0], [`((${2 * p}+${2 * q})/2)*((${2 * p}+${2 * q})/2)/2+(${2 * q}/2)*(${2 * q}/2)/2-(${2 * p}/2)*(${2 * p}/2)/2`, 1]], unseen: [2] }
        });
      }
      // 지름을 셋으로 똑같이 나누어 위아래로 반원 넷을 그린 S자 띠: 둘레는 호 넷이다.
      const u = d.int(1, 4), AD = 6 * u, k = 26, b = Board(), pA = [-3 * k, 0], pB = [-k, 0], pC = [k, 0], pD = [3 * k, 0];
      b.disk([0, 0], 3 * k).shape(`M${XY(pA)}${arcTo(pB, 2 * k, 180, 0)}${arcTo([2 * k, 0], k, 180, 360)}${arcTo(pC, 2 * k, 0, -180)}${arcTo([-2 * k, 0], k, 0, 180)}Z`, [pA, pD], TINT).seg(pA, pD, 'thin').tick(pA, pB).tick(pB, pC).tick(pC, pD);
      b.dot(pA).dot(pB).dot(pC).dot(pD).name(pA, 'A', 180).name(pD, 'D', 0).name(pB, 'B', 225, 12).name(pC, 'C', 45, 12);
      return piN(`선분 AD는 원의 지름이고 ${nb(`${sg('AD')} = ${AD} cm`)}이다. 지름 AD 위의 두 점 B, C에 대하여 ${nb(`${sg('AB')} = ${sg('BC')} = ${sg('CD')}`)}이고, 선분 AB, AC, BD, CD를 각각 지름으로 하는 반원을 그림과 같이 그렸다. 색칠한 부분의 둘레의 길이는?`, 6 * u, CM, {
        figure: b.svg(`지름 AD의 길이가 ${AD} cm인 원. 지름 위에 점 A, B, C, D가 이 차례로 있고 선분 AB, BC, CD에 길이가 같다는 표시가 있다. 지름의 위쪽에는 선분 AB, AC를 지름으로 하는 반원이, 아래쪽에는 선분 BD, CD를 지름으로 하는 반원이 그려져 있다. 위쪽 두 반원 사이와 아래쪽 두 반원 사이를 이은 S자 모양의 띠가 색칠되어 있다`),
        explain: `${sg('AB')} = ${sg('BC')} = ${sg('CD')} = ${AD} ÷ 3 = ${2 * u}(cm)이다. 색칠한 부분의 둘레는 선분 AC, AB, BD, CD를 각각 지름으로 하는 반원의 호 4개이고, 그 지름의 길이는 차례로 ${4 * u} cm, ${2 * u} cm, ${4 * u} cm, ${2 * u} cm이다. 둘레의 길이는 π × ${2 * u} + π × ${u} + π × ${2 * u} + π × ${u} = ${6 * u}π(cm)이다.`,
        facts: { calc: [[`(2*${AD}/3)/2+(${AD}/3)/2+(2*${AD}/3)/2+(${AD}/3)/2`, 0]], unseen: [2, 3] }
      });
    }, { count: 3, standard: FAN }),
    H('hard-split-fan', '중심이 같은 호로 나눈 부채꼴에서 색칠한 두 부분의 둘레', '기본 ①83', (d) => {
      // 함정: 가운데 흰 띠와 맞닿은 호 2개도 색칠한 부분의 경계이다. 선분은 작은 부채꼴의 반지름 2개와 바깥 띠의 양옆 2개를 센다(가운데 띠의 양옆은 세지 않는다).
      const [t, r1, w1, w2] = d.pick(SPLITS), r2 = r1 + w1, R = r2 + w2, arcs = (r1 + r2 + R) * t / 180, straight = 2 * r1 + 2 * w2, k = (t > 100 ? 128 : 150) / R, b = Board(), O = [0, 0], p = (len, a) => at(O, len * k, a);
      b.shape(`M${XY(p(r2, 0))}L${XY(p(R, 0))}${arcTo(O, R * k, 0, t)}L${XY(p(r2, t))}${arcTo(O, r2 * k, t, 0)}Z`, [p(r2, 0), p(R, 0), p(R, t), p(r2, t), p(R, t / 2)], TINT).fan(O, r1 * k, 0, t, TINT).seg(p(r1, 0), p(r2, 0)).seg(p(r1, t), p(r2, t));
      b.angle(O, 0, t, '', { r: 8, square: false }).text([-24, 12], t + '°', { blue: true }).dim(O, p(r1, 0), `${r1} cm`, [0, -20]).dim(p(r1, 0), p(r2, 0), `${w1} cm`, [0, -20]).dim(p(r2, 0), p(R, 0), `${w2} cm`, [0, -20]);
      return piPlus(`중심각의 크기가 ${t}°인 부채꼴을 중심이 같은 두 호로 세 부분으로 나누고, 그림과 같이 그 가운데 두 부분을 색칠하였다. 색칠한 두 부분의 둘레의 길이의 합은?`, arcs, straight, CM, {
        figure: b.svg(`중심각의 크기가 ${t}°인 부채꼴이 중심이 같은 두 호로 세 부분으로 나뉘어 있다. 중심에서 첫째 호까지는 ${r1} cm, 첫째 호에서 둘째 호까지는 ${w1} cm, 둘째 호에서 바깥 호까지는 ${w2} cm이다. 가장 안쪽의 작은 부채꼴과 가장 바깥쪽의 띠가 색칠되어 있고 가운데 띠는 색칠되어 있지 않다`),
        explain: `색칠한 작은 부채꼴의 둘레는 호 1개와 반지름 2개, 색칠한 바깥 띠의 둘레는 호 2개와 길이가 ${w2} cm인 선분 2개이다. 세 호의 반지름의 길이는 ${r1} cm, ${r2} cm, ${R} cm이므로 호의 길이의 합은 2π × (${r1} + ${r2} + ${R}) × ${frac(t, 360)} = ${arcs}π(cm)이다. 선분의 길이의 합은 ${r1} × 2 + ${w2} × 2 = ${straight}(cm)이다. 둘레의 길이의 합은 ${arcs}π + ${straight}(cm)이다.`,
        facts: { calc: [[`2*(${r1}+(${r1}+${w1})+(${r1}+${w1}+${w2}))*${t}/360`, 0], [`2*${r1}+2*${w2}`, 1]], unseen: [2, 360] }
      });
    }, { standard: FAN }),
    H('hard-funnel', '정사각형 안의 반원과 두 부채꼴로 둘러싸인 부분의 넓이', '기본 ①86', (d) => {
      const h = d.int(2, 6), a = 2 * h, S = 128, b = Board(), BL = [0, 0], BR = [S, 0], TR = [S, -S], TL = [0, -S], ML = [0, -S / 2], MR = [S, -S / 2], C0 = [S / 2, -S / 2], half = qv(h * h, 2);
      b.poly([BL, BR, TR, TL], WHITE).shape(`M${XY(ML)}${arcTo(C0, S / 2, 180, 0)}Z`, [ML, MR, [S / 2, -S]], TINT).shape(`M${XY(ML)}L${XY(MR)}${arcTo(BR, S / 2, 90, 180)}${arcTo(BL, S / 2, 0, 90)}Z`, [ML, MR, [S / 2, 0]], TINT);
      b.dim(BL, BR, `${a} cm`, C0, 10).dim(BR, TR, `${a} cm`, C0, 10);
      return cm2Q(`한 변의 길이가 ${a} cm인 정사각형의 내부에 지름의 길이가 ${a} cm인 반원 1개와, 반지름의 길이가 ${h} cm이고 중심각의 크기가 90°인 부채꼴 2개를 그림과 같이 그렸다. 색칠한 부분의 넓이는 몇 ${CM2}인가?`, a * h, {
        figure: b.svg(`한 변의 길이가 ${a} cm인 정사각형. 위쪽 절반에는 정사각형의 가운데를 가로지르는 선분을 지름으로 하는 반원이 색칠되어 있다. 아래쪽 절반에는 아래의 두 꼭짓점을 각각 중심으로 하고 반지름의 길이가 ${h} cm인 부채꼴 2개가 색칠되지 않은 채 있고, 아래쪽 절반에서 두 부채꼴을 뺀 가운데 부분이 색칠되어 있다`),
        explain: `반원의 넓이는 π × ${h}<sup>2</sup> × ${frac(1, 2)} = ${half}π(${CM2})이다. 정사각형의 아래쪽 절반은 가로의 길이가 ${a} cm, 세로의 길이가 ${h} cm인 직사각형이고, 여기에서 부채꼴 2개의 넓이 (π × ${h}<sup>2</sup> × ${frac(90, 360)}) × 2 = ${half}π(${CM2})를 빼면 아래쪽에서 색칠한 부분의 넓이가 된다. 색칠한 부분의 넓이는 ${half}π + (${a * h} − ${half}π) = ${a * h}(${CM2})이다.`,
        facts: { calc: [[`${a}*${h}`, 0]] }
      });
    }, { standard: FAN }),
    H('hard-arcs-meet', '정사각형 안에서 두 호가 만나 생긴 부분의 둘레', '기본 ①87 / 심62', (d) => {
      // 두 호가 만나는 점과 아래 두 꼭짓점을 이으면 세 변이 모두 반지름인 정삼각형이다(60°, 30°).
      const a = d.pick([4, 6, 8, 12]), S = 132, b = Board(), pB = [0, 0], pC = [S, 0], pA = [0, -S], pD = [S, -S], pP = at(pB, S, 60);
      b.poly([pB, pC, pD, pA], WHITE).shape(`M${XY(pB)}L${XY(pA)}${arcTo(pB, S, 90, 60)}${arcTo(pC, S, 120, 180)}Z`, [pA, pB, pP], TINT).arc(pB, S, 0, 60).arc(pC, S, 90, 120).dim(pB, pC, `${a} cm`, pA, 10);
      b.dot(pP, 2.2).name(pP, 'P', 270, 13).name(pA, 'A', 135).name(pB, 'B', 225).name(pC, 'C', 315).name(pD, 'D', 45);
      return piPlus(`한 변의 길이가 ${a} cm인 정사각형 ABCD의 내부에 점 B를 중심으로 하는 호 AC와 점 C를 중심으로 하는 호 BD를 그리고, 두 호가 만나는 점을 P라 하자. 변 AB, 호 AP, 호 PB로 둘러싸인 부분(색칠한 부분)의 둘레의 길이는?`, a / 2, a, CM, {
        figure: b.svg(`한 변의 길이가 ${a} cm인 정사각형 ABCD. 꼭짓점 A는 왼쪽 위, B는 왼쪽 아래, C는 오른쪽 아래, D는 오른쪽 위에 있다. 점 B를 중심으로 하고 점 A에서 점 C까지 이르는 호와, 점 C를 중심으로 하고 점 D에서 점 B까지 이르는 호가 정사각형의 내부에 그려져 있고 두 호는 점 P에서 만난다. 변 AB, 호 AP, 호 PB로 둘러싸인 부분이 색칠되어 있다`),
        explain: `${sg('PB')} = ${sg('PC')} = ${sg('BC')}(두 호의 반지름)이므로 △PBC는 정삼각형이고 ∠PBC = ∠PCB = 60°이다. ∠ABP = 90° − 60° = 30°이므로 호 AP의 길이는 2π × ${a} × ${frac(30, 360)} = ${piq(a, 6)}(cm), 호 PB의 길이는 2π × ${a} × ${frac(60, 360)} = ${piq(a, 3)}(cm)이다. 둘레의 길이는 ${piq(a, 6)} + ${piq(a, 3)} + ${a} = ${a / 2}π + ${a}(cm)이다.`,
        facts: { calc: [[`2*${a}*(90-180/3)/360+2*${a}*(180/3)/360`, 0], [`${a}`, 1]], unseen: [2, 90, 180, 3, 360] }
      });
    }, { standard: FAN }),
    H('hard-vertex-circles', '정다각형의 꼭짓점마다 그린 원에서 다각형의 바깥 부분의 넓이', '기본 ①88', (d) => {
      // 원의 안쪽 부분은 중심각이 내각인 부채꼴이고, 그 중심각을 모두 모으면 내각의 크기의 합이다.
      const [m, r] = d.pick([[5, 2], [5, 4], [5, 6], [6, 1], [6, 2], [6, 3], [6, 5], [8, 1], [8, 2], [8, 4]]), s = m === 5 ? 80 : m === 6 ? 70 : 60, P = regPts(m, s), b = Board(), inn = inOf(m), all = r * r * m, inner = r * r * inSum(m) / 360, area = all - inner;
      P.forEach((p, i) => b.fan(p, s / 2, i * 360 / m + inn, i * 360 / m + 360, TINT));
      b.poly(P, WHITE);
      P.forEach((p, i) => b.arc(p, s / 2, i * 360 / m, i * 360 / m + inn, 'thin'));
      b.dim(P[0], P[1], `${2 * r} cm`, P[2], s / 2 + 8);
      return piN(`한 변의 길이가 ${2 * r} cm인 ${rgon(m)}의 꼭짓점마다 그 꼭짓점을 중심으로 하고 반지름의 길이가 ${r} cm인 원을 그렸다. 원 ${m}개의 내부 가운데 ${rgon(m)}의 외부에 있는 부분(색칠한 부분)의 넓이의 합은?`, area, CM2, {
        figure: b.svg(`한 변의 길이가 ${2 * r} cm인 ${rgon(m)}의 꼭짓점마다 그 꼭짓점을 중심으로 하고 반지름의 길이가 ${r} cm인 원이 그려져 있다. 이웃한 두 원은 변의 한가운데에서 닿는다. 원의 내부 가운데 ${rgon(m)}의 바깥에 있는 부분이 색칠되어 있다`),
        explain: `원 ${m}개의 넓이의 합은 π × ${r}<sup>2</sup> × ${m} = ${all}π(${CM2})이다. 원의 내부 가운데 ${rgon(m)}의 내부에 있는 부분은 중심각이 ${rgon(m)}의 내각인 부채꼴 ${m}개이고, 그 중심각의 크기의 합은 ${rgon(m)}의 내각의 크기의 합 180° × (${m} − 2) = ${inSum(m)}°이다. 이 부채꼴들의 넓이의 합은 π × ${r}<sup>2</sup> × ${frac(inSum(m), 360)} = ${inner}π(${CM2})이므로 색칠한 부분의 넓이의 합은 ${all}π − ${inner}π = ${area}π(${CM2})이다.`,
        facts: { calc: [[`${r}*${r}*${m}-${r}*${r}*180*(${m}-2)/360`, 0]], unseen: [180, 2, 360] }
      });
    }, { standard: FAN }),
    H('hard-spiral', '정육각형의 변을 늘여 이어 그린 세 부채꼴의 넓이', '기본 ①89', (d) => {
      // 반지름은 앞의 부채꼴에 한 변씩 이어 붙어 길어지고(a, 2a, 3a), 중심각은 모두 정육각형의 한 외각이다.
      const a = d.pick([3, 6, 9, 12]), s = 52, b = Board(), O = [0, 0], pA = at(O, s, 90), pB = at(O, s, 150), pC = at(O, s, 210), pD = at(O, s, 270), pE = at(O, s, 330), pF = at(O, s, 30);
      const pG = at(pE, s, 270), pH = at(pF, 2 * s, 330), pI = at(pA, 3 * s, 30), area = 7 * a * a / 3;
      b.fan(pE, s, 210, 270, TINT).fan(pF, 2 * s, 270, 330, TINT).fan(pA, 3 * s, 330, 390, TINT).poly([pA, pB, pC, pD, pE, pF], WHITE).beside(pB, pC, `${a} cm`, O);
      [[pA, 'A'], [pB, 'B'], [pC, 'C'], [pD, 'D'], [pE, 'E'], [pF, 'F']].forEach(([p, nm]) => b.name(p, nm, dirOf(p, O), 12));
      b.name(pG, 'G', 270).name(pH, 'H', 330).name(pI, 'I', 30);
      return piN(`한 변의 길이가 ${a} cm인 정육각형 ABCDEF에서 변 FE, AF, BA의 연장선을 긋고, 점 E, F, A를 각각 중심으로 하는 세 부채꼴 DEG, GFH, HAI를 그림과 같이 차례로 그렸다. 세 부채꼴의 넓이의 합은?`, area, CM2, {
        figure: b.svg(`한 변의 길이가 ${a} cm인 정육각형 ABCDEF. 점 G는 변 FE를 점 E 너머로, 점 H는 변 AF를 점 F 너머로, 점 I는 변 BA를 점 A 너머로 늘인 선 위에 있다. 점 E를 중심으로 하고 선분 ED를 반지름으로 하는 부채꼴 DEG, 점 F를 중심으로 하고 선분 FG를 반지름으로 하는 부채꼴 GFH, 점 A를 중심으로 하고 선분 AH를 반지름으로 하는 부채꼴 HAI가 색칠되어 있다`),
        explain: `세 부채꼴의 중심각은 모두 정육각형의 외각이므로 그 크기는 360° ÷ 6 = 60°이다. 반지름의 길이는 차례로 ${a} cm, ${a} + ${a} = ${2 * a}(cm), ${2 * a} + ${a} = ${3 * a}(cm)이다. 넓이의 합은 π × ${a}<sup>2</sup> × ${frac(60, 360)} + π × ${2 * a}<sup>2</sup> × ${frac(60, 360)} + π × ${3 * a}<sup>2</sup> × ${frac(60, 360)} = ${area}π(${CM2})이다.`,
        facts: { calc: [[`(${a}*${a}+(2*${a})*(2*${a})+(3*${a})*(3*${a}))*(360/6)/360`, 0]], unseen: [2, 3, 6, 360] }
      });
    }, { standard: FAN }),
    H('hard-turned-semicircle', '한 끝 점을 중심으로 회전시킨 반원', '심63 / 기본 ①90', (d) => {
      // 함정: 부채꼴 BAB′의 반지름은 반원의 지름이다(반원의 반지름으로 셈하면 넓이가 4분의 1이 된다).
      const [r, t] = d.pick([[3, 30], [3, 40], [3, 50], [3, 60], [6, 20], [6, 30], [6, 40], [6, 45], [6, 50], [6, 60], [9, 20], [9, 30], [9, 40], [9, 50], [12, 30], [12, 45]]), R = 96, b = Board(), pA = [0, 0], pB = [2 * R, 0], O1 = [R, 0], O2 = at(pA, R, t), pB2 = at(pA, 2 * R, t), area = r * r * t / 90;
      b.shape(`M${XY(pA)}${arcTo(O2, R, 180 + t, t)}${arcTo(pA, 2 * R, t, 0)}${arcTo(O1, R, 0, 180)}Z`, [pA, pB, pB2, at(O2, R, 90), at(O2, R, 180)], TINT).seg(pA, pB).seg(pA, pB2).dot(O1, 2.2).dot(O2, 2.2);
      b.angle(pA, 0, t, t + '°', { r: 28 }).dim(pA, O1, `${r} cm`, [R / 2, -40], 10).name(pA, 'A', 200).name(pB, 'B', 340).name(pB2, 'B′', t, 13);
      return piN(`그림은 지름이 AB이고 반지름의 길이가 ${r} cm인 반원을 점 A를 중심으로 ${t}°만큼 회전시켜 지름이 AB′인 반원으로 옮긴 것이다. 색칠한 부분의 넓이는?`, area, CM2, {
        figure: b.svg(`지름이 AB인 반원과, 이 반원을 점 A를 중심으로 시계 반대 방향으로 ${t}°만큼 회전시킨 지름이 AB′인 반원. 점 B에서 점 B′까지는 점 A를 중심으로 하는 호가 그어져 있다. 회전시킨 반원과 부채꼴 BAB′를 합친 도형에서 처음 반원을 뺀 부분이 색칠되어 있다. 반원의 반지름의 길이는 ${r} cm, ∠BAB′ = ${t}°`),
        explain: `색칠한 부분의 넓이는 (지름이 AB′인 반원의 넓이) + (부채꼴 BAB′의 넓이) − (지름이 AB인 반원의 넓이)이다. 두 반원은 합동이므로 색칠한 부분의 넓이는 부채꼴 BAB′의 넓이와 같다. 부채꼴 BAB′의 반지름은 반원의 지름이므로 그 길이는 ${r} × 2 = ${2 * r}(cm)이다. 넓이는 π × ${2 * r}<sup>2</sup> × ${frac(t, 360)} = ${area}π(${CM2})이다.`,
        facts: { calc: [[`(2*${r})*(2*${r})*${t}/360`, 0]], unseen: [2, 360] }
      });
    }, { standard: FAN }),
    H('hard-rolling', '도형의 둘레를 따라 한 바퀴 도는 원', '심71 / 기본 ①91·92', (d, n) => {
      if (n === 0) {
        const [a, r] = d.pick([[10, 2], [12, 2], [12, 3], [15, 3], [8, 2], [9, 2], [16, 4], [20, 4], [6, 1]]), k = 150 / a, b = Board(), P0 = [0, 0], P1 = [a * k, 0], P2 = at(P0, a * k, 60), touch = mid(P0, P2), Cc = at(touch, r * k, 150);
        b.poly([P0, P1, P2]).disk(Cc, r * k).dot(Cc, 2.2).seg(Cc, touch, 'thin').dim(P0, P1, `${a} cm`, P2, 10);
        K.outside(b, Cc, r * k, 165, `${r} cm`);
        return piPlus(`반지름의 길이가 ${r} cm인 원이 한 변의 길이가 ${a} cm인 정삼각형의 변에 닿은 채 그 둘레를 따라 바깥쪽으로 한 바퀴 돌아 제자리로 왔다. 원의 중심이 움직인 거리는?`, 2 * r, 3 * a, CM, {
          figure: b.svg(`한 변의 길이가 ${a} cm인 정삼각형과, 그 한 변에 바깥쪽에서 닿아 있는 반지름의 길이가 ${r} cm인 원`),
          explain: `원이 변을 따라 움직일 때 원의 중심은 변과 평행하게 변의 길이만큼 움직이므로, 곧게 움직인 거리의 합은 ${a} × 3 = ${3 * a}(cm)이다. 꼭짓점에서는 원의 중심이 그 꼭짓점을 중심으로 하고 반지름의 길이가 ${r} cm인 호를 그린다. 한 꼭짓점에서 호의 중심각의 크기는 360° − (90° + 90° + 60°) = 120°이므로 세 호를 모으면 원 하나가 되고, 그 길이의 합은 2π × ${r} = ${2 * r}π(cm)이다. 움직인 거리는 ${2 * r}π + ${3 * a}(cm)이다.`,
          facts: { calc: [[`2*${r}`, 0], [`3*${a}`, 1]], unseen: [2, 3] }
        });
      }
      const [w, h, r] = d.pick([[5, 3, 1], [6, 4, 1], [8, 6, 2], [7, 5, 1], [10, 6, 2], [9, 6, 2], [6, 4, 2], [8, 4, 2]]), k = 150 / w, b = Board(), P = [[0, 0], [w * k, 0], [w * k, -h * k], [0, -h * k]], Cc = [w * k * 0.32, -h * k - r * k], round = 2 * (w + h);
      b.poly(P).disk(Cc, r * k).dot(Cc, 2.2).seg(Cc, [Cc[0], -h * k], 'thin').dim(P[0], P[1], `${w} cm`, P[2], 10).dim(P[3], P[0], `${h} cm`, P[1], 10);
      K.outside(b, Cc, r * k, 0, `${r} cm`);
      return piPlus(`반지름의 길이가 ${r} cm인 원이 가로의 길이가 ${w} cm, 세로의 길이가 ${h} cm인 직사각형의 변에 닿은 채 그 둘레를 따라 바깥쪽으로 한 바퀴 돌아 제자리로 왔다. 원이 지나간 자리의 넓이는?`, 4 * r * r, 2 * r * round, CM2, {
        figure: b.svg(`가로의 길이가 ${w} cm, 세로의 길이가 ${h} cm인 직사각형과, 그 위쪽 변에 바깥쪽에서 닿아 있는 반지름의 길이가 ${r} cm인 원`),
        explain: `원이 변을 따라 움직일 때 지나간 자리는 한 변이 직사각형의 변이고 다른 한 변이 원의 지름 ${2 * r} cm인 직사각형이다. 네 변에서 그 넓이의 합은 (${w} + ${h} + ${w} + ${h}) × ${2 * r} = ${2 * r * round}(${CM2})이다. 꼭짓점에서 지나간 자리는 반지름의 길이가 ${2 * r} cm이고 중심각의 크기가 360° − (90° + 90° + 90°) = 90°인 부채꼴이고, 네 부채꼴을 모으면 반지름의 길이가 ${2 * r} cm인 원이 되므로 넓이의 합은 π × ${2 * r}<sup>2</sup> = ${4 * r * r}π(${CM2})이다. 지나간 자리의 넓이는 ${4 * r * r}π + ${2 * r * round}(${CM2})이다.`,
        facts: { calc: [[`(2*${r})*(2*${r})`, 0], [`2*(${w}+${h})*2*${r}`, 1]], unseen: [2] }
      });
    }, { count: 2, standard: FAN }),
    H('hard-rolling-sector', '부채꼴의 둘레를 따라 한 바퀴 도는 원이 지나간 자리', '심72', (d) => {
      // 모퉁이마다 원이 도는 각이 다르다: 호의 양 끝에서는 90°, 부채꼴의 중심에서는 180° − (중심각)이다.
      const [R, t, r] = d.pick([[6, 120, 2], [6, 120, 1], [6, 60, 1], [6, 90, 1], [6, 90, 2], [6, 150, 1], [6, 60, 2], [3, 120, 1], [9, 60, 2], [9, 120, 2], [9, 40, 2], [9, 80, 2], [12, 60, 2], [12, 90, 2], [12, 120, 2]]);
      const D2 = 2 * r, big = R + D2, coef = 4 * r * r + R * r * t / 90, flat = 4 * R * r, k = Math.min(18, 118 / big), b = Board(), O = [0, 0], a0 = 90 - t / 2, a1 = 90 + t / 2, at0 = 90 - t / 5, touch = at(O, R * k, at0), Cc = at(O, (R + r) * k, at0);
      b.fan(O, R * k, a0, a1).angle(O, a0, a1, t + '°', { r: 13 }).beside(O, at(O, R * k, a0), `${R} cm`, at(O, R * k / 2, 90)).disk(Cc, r * k).dot(Cc, 2.2).seg(Cc, touch, 'thin');
      K.outside(b, Cc, r * k, 20, `${r} cm`);
      return piPlus(`반지름의 길이가 ${r} cm인 원이 반지름의 길이가 ${R} cm이고 중심각의 크기가 ${t}°인 부채꼴의 둘레에 닿은 채 그 둘레를 따라 바깥쪽으로 한 바퀴 돌아 제자리로 왔다. 원이 지나간 자리의 넓이는?`, coef, flat, CM2, {
        figure: b.svg(`반지름의 길이가 ${R} cm이고 중심각의 크기가 ${t}°인 부채꼴과, 그 호에 바깥쪽에서 닿아 있는 반지름의 길이가 ${r} cm인 원`),
        explain: `원이 지나간 자리는 네 가지 조각으로 이루어진다. 호를 따라 움직일 때는 반지름의 길이가 ${R} + ${D2} = ${big}(cm)인 부채꼴에서 반지름의 길이가 ${R} cm인 부채꼴을 뺀 띠를 지나고, 그 넓이는 π × (${big}<sup>2</sup> − ${R}<sup>2</sup>) × ${frac(t, 360)} = ${piq((big * big - R * R) * t, 360)}(${CM2})이다. 두 반지름을 따라 움직일 때는 가로의 길이가 ${R} cm, 세로의 길이가 ${D2} cm인 직사각형 2개를 지나고, 그 넓이는 ${R} × ${D2} × 2 = ${flat}(${CM2})이다. 호의 양 끝에서는 반지름의 길이가 ${D2} cm이고 중심각의 크기가 90°인 부채꼴 2개를 지나고, 그 넓이는 (π × ${D2}<sup>2</sup> × ${frac(90, 360)}) × 2 = ${2 * r * r}π(${CM2})이다. 부채꼴의 중심에서는 반지름의 길이가 ${D2} cm이고 중심각의 크기가 360° − (90° + 90° + ${t}°) = ${180 - t}°인 부채꼴을 지나고, 그 넓이는 π × ${D2}<sup>2</sup> × ${frac(180 - t, 360)} = ${piq(D2 * D2 * (180 - t), 360)}(${CM2})이다. 모두 더하면 ${coef}π + ${flat}(${CM2})이다.`,
        facts: { calc: [[`(((${R}+2*${r})*(${R}+2*${r})-${R}*${R})*${t}+2*(2*${r})*(2*${r})*90+(2*${r})*(2*${r})*(180-${t}))/360`, 0], [`2*${R}*2*${r}`, 1]], unseen: [2, 90, 360, 180] }
      });
    }, { standard: FAN }),
    H('hard-rolled', '직선 위에서 굴린 도형의 한 점이 움직인 거리', '심74 / 기본 ①93', (d, n) => {
      const l = V('l');
      if (n === 0) {
        // 직사각형은 직선에 닿은 오른쪽 꼭짓점을 중심으로 90°씩 넘어간다. 꼭짓점 A는 회전의 중심까지의 거리(대각선, 두 변)를 반지름으로 하는 호를 그린다.
        const [w0, h0, dg] = d.pick([[3, 4, 5], [6, 8, 10], [9, 12, 15], [12, 16, 20]]), tall = d.bool(), w = tall ? w0 : h0, h = tall ? h0 : w0, k = 232 / (3 * w + 2 * h), W = w * k, Hh = h * k, b = Board(), end = 3 * W + 2 * Hh, coef = (w + h + dg) / 2;
        const box = (x, ww, hh, css) => b.poly([[x, 0], [x + ww, 0], [x + ww, -hh], [x, -hh]], css);
        b.seg([-8, 0], [end + 8, 0]);
        box(W, Hh, W, DASH); box(W + Hh, W, Hh, DASH); box(2 * W + Hh, Hh, W, DASH); box(2 * W + 2 * Hh, W, Hh, DASH); box(0, W, Hh);
        [[0, -Hh], [W + Hh, -W], [2 * W + Hh, 0], [2 * W + 2 * Hh, -Hh]].forEach((p) => b.dot(p, 3));
        b.name([0, -Hh], 'A', 135).name([0, 0], 'B', 225).name([W, 0], 'C', 270).name([W, -Hh], 'D', 125, 12).name([2 * W + 2 * Hh, -Hh], 'A', 60, 12).text([end + 17, 0], sv('l'), { plain: true });
        return piN(`그림과 같이 직사각형 ABCD를 직선 ${l} 위에서 미끄러지지 않게 오른쪽으로 한 바퀴 굴렸다. ${nb(`${sg('AB')} = ${h} cm`)}, ${nb(`${sg('AD')} = ${w} cm`)}, ${nb(`${sg('AC')} = ${dg} cm`)}일 때, 꼭짓점 A가 움직인 거리는?`, coef, CM, {
          figure: b.svg(`직선 l 위에 직사각형 ABCD가 변 BC를 직선에 붙이고 놓여 있다. 꼭짓점 A는 왼쪽 위, B는 왼쪽 아래, C는 오른쪽 아래, D는 오른쪽 위에 있다. 직사각형이 오른쪽으로 넘어가며 놓이는 네 자리가 점선으로 그려져 있고, 자리마다 꼭짓점 A가 있는 곳에 점이 찍혀 있다. 변 AB의 길이는 ${h} cm, 변 AD의 길이는 ${w} cm, 대각선 AC의 길이는 ${dg} cm`),
          explain: `직사각형은 꼭짓점 C, D, A, B를 차례로 중심으로 하여 90°씩 회전한다. 꼭짓점 A는 점 C를 중심으로 회전할 때 반지름의 길이가 ${dg} cm인 호를, 점 D를 중심으로 회전할 때 반지름의 길이가 ${w} cm인 호를, 점 B를 중심으로 회전할 때 반지름의 길이가 ${h} cm인 호를 그리고, 점 A를 중심으로 회전할 때에는 움직이지 않는다. 호의 중심각의 크기는 모두 90°이므로 움직인 거리는 2π × (${dg} + ${w} + ${h}) × ${frac(90, 360)} = ${coef}π(cm)이다.`,
          facts: { calc: [[`2*(${dg}+${w}+${h})*90/360`, 0]], unseen: [2, 90, 360] }
        });
      }
      // 부채꼴은 호의 한 끝을 중심으로 90° 회전하여 서고, 호가 직선 위를 구른 다음, 호의 다른 끝을 중심으로 90° 회전하여 눕는다. 마지막에 중심 O를 중심으로 회전할 때 점 O는 움직이지 않는다.
      const [r, t] = d.pick([[10, 90], [6, 90], [8, 90], [12, 90], [4, 90], [6, 60], [9, 60], [12, 60], [6, 120], [9, 120], [3, 120]]), len = 2 * Math.PI * t / 360, R = Math.min(54, 230 / (3 + len + (t > 90 ? 0.5 : 0))), b = Board(), arc = r * t / 180, coef = r + arc;
      const O0 = [0, 0], O3 = [2 * R + len * R, 0], end = 3 * R + len * R;
      b.seg([Math.min(0, R * Math.cos(t * RAD)) - 8, 0], [end + 8, 0]).fan(O3, R, 0, t, DASH).fan(O0, R, 0, t, TINT).dot(O0, 3).dot(O3, 3);
      b.name(O0, 'O', 250, 12).name([R, 0], 'A', 270).name(at(O0, R, t), 'B', t > 90 ? 150 : 90).name(O3, 'O', 270, 12).text([end + 17, 0], sv('l'), { plain: true });
      return piN(`그림과 같이 반지름의 길이가 ${r} cm이고 중심각의 크기가 ${t}°인 부채꼴 AOB를 직선 ${l} 위에서 미끄러지지 않게 오른쪽으로 한 바퀴 굴려 처음과 같은 모양으로 놓았다. 부채꼴의 중심 O가 움직인 거리는?`, coef, CM, {
        figure: b.svg(`직선 l 위에 부채꼴 AOB가 반지름 OA를 직선에 붙이고 놓여 있다. 부채꼴이 오른쪽으로 한 바퀴 굴러 처음과 같은 모양으로 놓인 마지막 자리가 점선으로 그려져 있고, 처음 자리와 마지막 자리의 중심 O에 점이 찍혀 있다`),
        explain: `부채꼴은 먼저 점 A를 중심으로 90° 회전하여 호가 직선에 닿고, 호가 직선 위를 구른 다음, 점 B를 중심으로 90° 회전하여 반지름 OB가 직선에 놓인다. 마지막으로 점 O를 중심으로 회전할 때 점 O는 움직이지 않는다. 점 A, B를 중심으로 회전할 때 점 O는 반지름의 길이가 ${r} cm이고 중심각의 크기가 90°인 호를 그리므로 (2π × ${r} × ${frac(90, 360)}) × 2 = ${r}π(cm)를 움직인다. 호가 구르는 동안 점 O는 직선과 평행하게 호 AB의 길이 2π × ${r} × ${frac(t, 360)} = ${arc}π(cm)만큼 움직인다. 움직인 거리는 ${r}π + ${arc}π = ${coef}π(cm)이다.`,
        facts: { calc: [[`2*2*${r}*90/360+2*${r}*${t}/360`, 0]], unseen: [2, 90, 360] }
      });
    }, { count: 2, standard: FAN }),
    H('hard-band-around', '서로 닿아 있는 원 세 개를 묶는 끈의 길이', '심69 / 기본 ①94', (d) => {
      // 끈의 곧은 부분은 두 원의 중심을 이은 선분과 평행하고 길이가 같다. 굽은 부분 셋을 모으면 원 하나가 된다.
      const r = d.int(2, 9), R = 44, g = 2.5, b = Board(), c1 = [-R, 0], c2 = [R, 0], c3 = [0, -R * Math.sqrt(3)], q = (c, a) => at(c, R + g, a);
      [c1, c2, c3].forEach((c) => b.disk(c, R).dot(c, 2.2));
      b.shape(`M${XY(q(c1, 270))}L${XY(q(c2, 270))}${arcTo(c2, R + g, 270, 390)}L${XY(q(c3, 30))}${arcTo(c3, R + g, 30, 150)}L${XY(q(c1, 150))}${arcTo(c1, R + g, 150, 270)}Z`, [q(c1, 180), q(c2, 0), q(c3, 90), q(c1, 270)], 'fill:none;stroke:#1d4ed8;stroke-width:2.4');
      b.seg(c1, at(c1, R, 180), 'thin').beside(c1, at(c1, R, 180), `${r} cm`, [c1[0], c1[1] + 30]);
      return piPlus(`밑면의 반지름의 길이가 ${r} cm인 원기둥 모양의 통 3개를 끈으로 팽팽하게 한 바퀴 묶었다. 그림은 이것을 위에서 본 것이다. 끈의 길이는? (단, 끈의 굵기와 매듭은 생각하지 않는다.)`, 2 * r, 6 * r, CM, {
        figure: b.svg(`반지름의 길이가 ${r} cm인 원 3개가 둘씩 서로 닿아 삼각형 모양으로 놓여 있고, 끈이 세 원의 바깥을 팽팽하게 한 바퀴 두르고 있다. 끈은 곧은 부분 3개와 원에 붙은 굽은 부분 3개로 이루어진다`),
        explain: `세 원의 중심을 이으면 한 변의 길이가 ${r} × 2 = ${2 * r}(cm)인 정삼각형이 된다. 끈의 곧은 부분은 저마다 정삼각형의 한 변과 평행하고 길이가 같으므로 그 합은 ${2 * r} × 3 = ${6 * r}(cm)이다. 끈의 굽은 부분은 반지름의 길이가 ${r} cm인 호이고, 한 원에서 그 중심각의 크기는 360° − (90° + 90° + 60°) = 120°이다. 세 호를 모으면 원 하나가 되므로 길이의 합은 2π × ${r} = ${2 * r}π(cm)이다. 끈의 길이는 ${2 * r}π + ${6 * r}(cm)이다.`,
        facts: { calc: [[`2*${r}`, 0], [`3*2*${r}`, 1]], unseen: [2] }
      });
    }, { standard: FAN }),
    H('hard-tethered', '벽에 맨 끈으로 움직일 수 있는 부분의 넓이', '심73', (d) => {
      // 벽의 바깥쪽 반원에, 끈이 벽의 양 끝에 걸린 뒤 남은 길이를 반지름으로 하는 부채꼴(90°) 둘을 더한다. 남은 끈은 옆 벽보다 짧아 다음 모퉁이에 닿지 않는다.
      const [L, p, q] = d.pick([[4, 2, 2], [6, 2, 4], [6, 4, 4], [6, 2, 2], [8, 2, 6], [8, 4, 6], [8, 4, 4], [8, 6, 6], [10, 4, 6], [6, 4, 2], [8, 6, 2], [8, 6, 4], [10, 6, 4], [10, 6, 8], [10, 8, 6]]), lp = L - p, lq = L - q, w = p + q, h = Math.max(lp, lq) + d.int(1, 2);
      const half = L * L / 2, fans = (lp * lp + lq * lq) / 4, coef = half + fans, k = Math.min(150 / w, 104 / h), b = Board(), TL = [0, -h * k], TR = [w * k, -h * k], BL = [0, 0], BR = [w * k, 0], pP = [p * k, 0];
      b.poly([BL, BR, TR, TL], TINT).text([w * k * (p >= q ? 0.24 : 0.76), -h * k / 2], '창고', { plain: true }).dot(pP, 3).name(pP, 'P', 90, 12).dim(BL, pP, `${p} m`, TL, 10).dim(pP, BR, `${q} m`, TL, 10).dim(BL, TL, `${h} m`, BR, 10);
      return piN(`가로의 길이가 ${w} m, 세로의 길이가 ${h} m인 직사각형 모양의 창고가 있다. 창고의 가로 벽 위의 점 P에 길이가 ${L} m인 끈으로 염소를 매어 놓았다. 점 P가 그 벽의 왼쪽 끝에서 ${p} m, 오른쪽 끝에서 ${q} m 떨어져 있을 때, 창고의 바깥에서 염소가 움직일 수 있는 부분의 넓이는? (단, 끈의 매듭과 염소의 크기는 생각하지 않는다.)`, coef, M2, {
        figure: b.svg(`위에서 본 직사각형 모양의 창고. 가로의 길이는 ${w} m, 세로의 길이는 ${h} m이다. 점 P는 아래쪽 가로 벽 위에 있고 그 벽의 왼쪽 끝에서 ${p} m, 오른쪽 끝에서 ${q} m 떨어져 있다`),
        explain: `점 P가 있는 벽의 바깥쪽에서는 점 P를 중심으로 하고 반지름의 길이가 ${L} m인 반원의 내부를 움직일 수 있으므로 그 넓이는 π × ${L}<sup>2</sup> × ${frac(1, 2)} = ${half}π(${M2})이다. 끈이 벽의 왼쪽 끝에 걸리면 남은 끈의 길이는 ${L} − ${p} = ${lp}(m), 오른쪽 끝에 걸리면 ${L} − ${q} = ${lq}(m)이고, 세로 벽의 길이 ${h} m보다 짧으므로 끈은 다음 모퉁이에 닿지 않는다. 벽의 양 끝을 각각 중심으로 하고 중심각의 크기가 90°인 두 부채꼴의 내부를 더 움직일 수 있으므로 그 넓이는 π × ${lp}<sup>2</sup> × ${frac(90, 360)} + π × ${lq}<sup>2</sup> × ${frac(90, 360)} = ${fans}π(${M2})이다. 움직일 수 있는 부분의 넓이는 ${half}π + ${fans}π = ${coef}π(${M2})이다.`,
        facts: { calc: [[`${L}*${L}/2+(${L}-${p})*(${L}-${p})/4+(${L}-${q})*(${L}-${q})/4`, 0]], unseen: [2, 4] }
      });
    }, { standard: FAN }),
    H('hard-equal-rect', '색칠한 부분과 직사각형의 넓이가 같을 때 변의 길이', '심65', (d) => {
      // 틀린 보기: 부채꼴의 넓이를 반원의 넓이로 셈한 값, 삼각형의 넓이를 더한 값, 삼각형의 밑변을 변 BC로만 셈한 값
      const a = d.pick([2, 4, 6, 8]), h = a / 2, Hh = 118, Wd = Hh * (Math.PI / 2 - 1), b = Board(), pB = [0, 0], pA = [0, -Hh], pC = [Wd, 0], pD = [Wd, -Hh], pE = [Wd + Hh, 0], hx = (h === 1 ? '' : h) + X, ax = a + X;
      b.shape(`M${XY(pA)}L${XY(pD)}${arcTo(pC, Hh, 90, 0)}Z`, [pA, pD, pE], TINT).poly([pB, pC, pD, pA]).seg(pC, pE).dim(pB, pA, `${a} cm`, pC, 11);
      b.name(pA, 'A', 135).name(pB, 'B', 225).name(pC, 'C', 270).name(pD, 'D', 80).name(pE, 'E', 315);
      const right = `(${kpi(h)} − ${a}) cm`, options = d.shuffle([right, `(${kpi(a)} − ${a}) cm`, `(${kpi(h)} + ${a}) cm`, `${kpi(h)} cm`]), quarter = kpi(a * a / 4), tri = a * a / 2;
      return C(`${nb(`${sg('AB')} = ${a} cm`)}인 직사각형 ABCD와, 점 C를 중심으로 하고 변 CD를 반지름으로 하는 부채꼴 DCE가 있다. 점 E는 변 BC의 연장선 위에 있고 ∠DCE = 90°이다. 선분 AE를 그었을 때 그림에서 색칠한 부분의 넓이가 직사각형 ABCD의 넓이와 같다면, 변 BC의 길이는?`, options, options.indexOf(right), {
        figure: b.svg(`직사각형 ABCD와 부채꼴 DCE. 변 AB는 세로로, 변 BC는 가로로 놓여 있고 변 AB의 길이는 ${a} cm이다. 점 E는 변 BC를 점 C 너머로 늘인 선 위에 있고 선분 AE가 그어져 있다. 직사각형과 부채꼴을 합친 도형에서 삼각형 ABE를 뺀 부분, 곧 변 AD와 호 DE와 선분 AE로 둘러싸인 부분이 색칠되어 있다`),
        explain: `변 BC의 길이를 ${X} cm라 하면 직사각형 ABCD의 넓이는 ${ax}, 부채꼴 DCE의 넓이는 π × ${a}<sup>2</sup> × ${frac(90, 360)} = ${quarter}, △ABE의 넓이는 ${frac(1, 2)} × ${a} × (${X} + ${a}) = ${hx} + ${tri}이다. 색칠한 부분의 넓이는 ${ax} + ${quarter} − (${hx} + ${tri}) = ${hx} + ${quarter} − ${tri}이고 이것이 ${ax}와 같으므로 ${hx} = ${quarter} − ${tri}이다. ${X} = ${kpi(h)} − ${a}이므로 변 BC의 길이는 (${kpi(h)} − ${a}) cm이다.`,
        facts: { truth: options.map((o) => o === right), want: true }
      });
    }, { standard: FAN }),
    H('hard-lunes', '직각삼각형의 세 변을 지름으로 하는 반원으로 생긴 초승달 모양', '심67·68', (d, n) => {
      const [p, q, c] = d.pick([[6, 8, 10], [12, 16, 20], [10, 24, 26], [18, 24, 30], [8, 6, 10], [16, 12, 20]]), k = 150 / c, b = Board(), pB = [0, 0], pC = [c * k, 0], pA = [p * p / c * k, -p * q / c * k];
      const s1 = semiOn(pA, pB, pC), s2 = semiOn(pA, pC, pB), s3 = semiOn(pB, pC, [c * k / 2, 1000]);
      b.shape(s1.d, s1.pts, TINT).shape(s2.d, s2.pts, TINT).shape(s3.d, s3.pts, WHITE).poly([pB, pC, pA]).corner(pA, pB, pC, '');
      b.beside(pA, pB, `${p} cm`, s1.top, { gap: 4 }).beside(pA, pC, `${q} cm`, s2.top, { gap: 4 }).beside(pB, pC, `${c} cm`, pA);
      const lead = `그림은 세 변의 길이가 ${p} cm, ${q} cm, ${c} cm인 직각삼각형의 각 변을 지름으로 하는 반원을 그린 것이다.`;
      const said = `세 변의 길이가 ${p} cm, ${q} cm, ${c} cm인 직각삼각형. 길이가 ${c} cm인 가장 긴 변을 지름으로 하는 반원은 직각인 꼭짓점을 지나도록 삼각형 쪽에 그려져 있고, 나머지 두 변을 지름으로 하는 반원은 삼각형의 바깥쪽에 그려져 있다. 작은 두 반원의 내부 가운데 큰 반원의 외부에 있는 초승달 모양의 두 부분이 색칠되어 있다`;
      if (n === 0) return cm2Q(`${lead} 색칠한 부분의 넓이는 몇 ${CM2}인가?`, p * q / 2, {
        figure: b.svg(said),
        explain: `색칠한 부분의 넓이는 (작은 두 반원의 넓이) + (직각삼각형의 넓이) − (큰 반원의 넓이)이다. 작은 두 반원의 넓이의 합은 π × ${p / 2}<sup>2</sup> × ${frac(1, 2)} + π × ${q / 2}<sup>2</sup> × ${frac(1, 2)} = ${piq(p * p + q * q, 8)}(${CM2})이고 큰 반원의 넓이는 π × ${c / 2}<sup>2</sup> × ${frac(1, 2)} = ${piq(c * c, 8)}(${CM2})로 서로 같다. 색칠한 부분의 넓이는 직각삼각형의 넓이 ${frac(1, 2)} × ${p} × ${q} = ${p * q / 2}(${CM2})와 같다.`,
        facts: { calc: [[`${p}*${q}/2`, 0]], unseen: [2] }
      });
      return piN(`${lead} 색칠한 부분의 둘레의 길이는?`, (p + q + c) / 2, CM, {
        figure: b.svg(said),
        explain: `색칠한 두 부분의 둘레는 세 반원의 호로 이루어진다. 세 반원의 반지름의 길이는 ${p / 2} cm, ${q / 2} cm, ${c / 2} cm이므로 둘레의 길이는 π × ${p / 2} + π × ${q / 2} + π × ${c / 2} = ${(p + q + c) / 2}π(cm)이다.`,
        facts: { calc: [[`${p}/2+${q}/2+${c}/2`, 0]], unseen: [2] }
      });
    }, { count: 2, standard: FAN })
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
