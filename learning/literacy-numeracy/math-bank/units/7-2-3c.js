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
    id: 'hard', title: '실력 문제', standard: POLY,
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
})(typeof window !== 'undefined' ? window : globalThis);
