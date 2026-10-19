// 10-1-1 다항식의 연산 — 실력 문항. 틀과 식 글 도구는 10-1-1a.js(B.kit.m1011)에 있다.
// 이 단원에서 아이들이 흔히 잘못 아는 것
//  - 나머지는 나누는 식보다 차수가 낮아야 한다는 것을 잊는다: A = BQ + R 꼴의 등식을 보면 R을 그대로 나머지로 읽는다(②31·②33·②34).
//  - 나누는 식을 상수배 하면 몫과 나머지가 함께 바뀐다고 여긴다: x − 2/3 과 3x − 2 로 나눈 나머지는 같고 몫만 1/3배가 된다(②32).
//  - 거듭제곱의 전개식에서 계수를 셀 때 (x + 2)³의 모든 항을 짝짓지 않고 한두 짝만 본다(①24).
//  - 겹치는 부분을 빼고 더하는 셈에서 겹친 부분을 몇 번 뺐는지 세지 않는다(②16).
//  - a + b의 값을 근호로 구할 때 양수라는 조건을 쓰지 않는다(②8), 세 문자의 식을 a + b + c, ab + bc + ca, abc로 바꾸지 못하고 펼치다 만다(②12).
// 실력에 둔 까닭: ①은 문제의 장치 때문에 배운 뜻을 정확히 대야 풀리는 것, ②는 세 단계 넘게 이어 생각해야 풀리는 것이다. 유형마다 적었다.
// 보기를 쓸 때 틀린 보기마다 어떤 잘못에서 나오는지 주석으로 달았다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { frac, C } = B.kit;
  const { MINUS, gcd, nb, V, sup, nz, poly, linAns, radAns, rt, sqParts } = B.kit.mid;
  const { STD, UNIT, retry, xv, pPow, pMul, coefOf, ph, pt, ej, pc, jn, jd, sd, numQ1 } = B.kit.m1011;
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: (ref.startsWith('심') ? '수집본 심화 자료(' : '수집본 기본 자료(') + ref + ')', make: retry(make) }, more || {});
  const Xv = V('x'), va = V('a'), vb = V('b'), vc = V('c');
  const X2 = Xv + sup(2), X3 = Xv + sup(3);
  const rad = (q, m) => (q === 1 ? '' : String(q)) + rt(m);
  // 보기 넷 가운데 하나: rows = [[글, 참인가]] 를 섞어 고르기 문항으로
  function pick4(d, text, rows, o) {
    if (new Set(rows.map((r) => r[0])).size !== rows.length || rows.filter((r) => r[1]).length !== 1) return null;
    const order = d.shuffle(rows.map((_, i) => i));
    return C(text, order.map((i) => rows[i][0]), order.findIndex((i) => rows[i][1]), { figure: o.figure, explain: o.explain, facts: Object.assign({ truth: order.map((i) => rows[i][1]), want: true }, o.rule ? { rule: o.rule } : {}) });
  }

  const hardTypes = [
    // ② 네 단계: (x + k)³ 을 펴고, x¹⁰ 이 되는 세 짝을 고르고, x⁹ 의 계수를 따로 셈하고, 모은다.
    H('hard-cube-coef', '세제곱 전개식의 계수를 문자로 나타내기', '①24', (d) => {
      const k = d.int(1, 3), top = d.int(2, 5), Psrc = `1+2x+3x^2+${top}x^3`, P = xv(Psrc), P3 = pPow(P, 3);
      const a = coefOf(P3, { x: 7 }).p, b = coefOf(P3, { x: 8 }).p, c9 = top ** 3, target = coefOf(pPow(pMul(xv(`x+${k}`), P), 3), { x: 10 }).p;
      const show = ([u, v, w]) => nb(poly([[u, va], [v, vb], [w, '']]));
      const cands = [
        [1, 3 * k, 3 * k * k * c9],        // 바른 식
        [1, 3 * k, c9],                    // x⁹ 짝에서 (x + k)³ 의 계수 3k² 를 빠뜨림
        [1, 3 * k, 0],                     // x⁹ 의 짝을 놓침
        [k ** 3, 3 * k * k, 3 * k * c9],   // (x + k)³ 의 계수를 거꾸로 짝지음
        [1, k, k * k * c9]                 // (x + k)³ 을 x³ + kx² + k²x + k³ 으로 잘못 폄
      ];
      const rows = cands.map((cf) => [show(cf), cf[0] * a + cf[1] * b + cf[2] === target]);
      if (!rows[0][1]) throw new Error('바른 식이 맞지 않는다');
      const kept = [rows[0]].concat(d.shuffle(rows.slice(1).filter((r) => !r[1])).slice(0, 3));
      return pick4(d, `${nb(`(${ph(P)})${sup(3)}`)}을 전개한 식에서 ${Xv}${sup(7)}의 계수를 ${va}, ${Xv}${sup(8)}의 계수를 ${vb}라 할 때, ${nb(`{(${Xv} + ${k})(${ph(P)})}${sup(3)}`)}을 전개한 식에서 ${Xv}${sup(10)}의 계수를 ${va}, ${vb}로 나타낸 것은?`, kept, {
        explain: `${nb(`{(${Xv} + ${k})(${ph(P)})}${sup(3)} = (${Xv} + ${k})${sup(3)}(${ph(P)})${sup(3)}`)}이고 ${nb(`(${Xv} + ${k})${sup(3)} = ${ph(xv(`(x+${k})^3`))}`)}이다. ${Xv}${sup(10)}은 ${X3} × (${Xv}${sup(7)}의 항), ${3 * k}${X2} × (${Xv}${sup(8)}의 항), ${3 * k * k}${Xv} × (${Xv}${sup(9)}의 항)에서 나온다. ${nb(`(${ph(P)})${sup(3)}`)}에서 ${Xv}${sup(9)}의 계수는 ${top}${sup(3)} = ${c9}이므로 구하는 계수는 ${show(cands[0])}이다.`
      });
    }),
    // ② 네 단계: 두 식을 더하고 빼서 a² + b², ab → 양수라서 a + b 하나 → 세제곱의 합.
    H('hard-two-quads', '두 이차식의 값으로 세제곱의 합(양수 조건)', '②8', (d) => {
      const s = d.int(3, 6), p = d.int(1, Math.floor(s * s / 4)), A1 = s * s - p, A2 = s * s - 3 * p;
      if (A2 <= 0 || s * s === 4 * p) return null;
      return numQ1(`두 양수 ${va}, ${vb}에 대하여 ${nb(`${va}${sup(2)} + ${va}${vb} + ${vb}${sup(2)} = ${A1}`)}, ${nb(`${va}${sup(2)} − ${va}${vb} + ${vb}${sup(2)} = ${A2}`)}일 때, ${nb(`${va}${sup(3)} + ${vb}${sup(3)}`)}의 값은?`, s * A2, {
        calc: `((3*${A1}-${A2})/2)*${A2}/${s}`, derived: [2, 3, s],
        explain: `두 식을 더하고 빼면 ${nb(`${va}${sup(2)} + ${vb}${sup(2)} = ${(A1 + A2) / 2}`)}, ${nb(`${va}${vb} = ${p}`)}이다. ${nb(`(${va} + ${vb})${sup(2)} = ${(A1 + A2) / 2} + 2 × ${p} = ${s * s}`)}이고 ${va}, ${vb}가 양수이므로 ${nb(`${va} + ${vb} = ${s}`)}이다. 따라서 ${nb(`${va}${sup(3)} + ${vb}${sup(3)} = (${va} + ${vb})(${va}${sup(2)} − ${va}${vb} + ${vb}${sup(2)}) = ${s} × ${A2}`)} = ${s * A2}이다.`
      });
    }),
    // ② 세 단계 넘게: 펼쳐서 a + b + c, ab + bc + ca, abc 로 바꾸어야 한다.
    H('hard-abc-chain', '세 문자의 대칭식의 값', '②12', (d, n) => {
      if (n === 0) {
        const s = nz(d, -5, 5), q = nz(d, -8, 8);
        if (s * s <= 3 * q) return null;
        return numQ1(`${nb(`${va} + ${vb} + ${vc} = ${sd(s)}`)}, ${nb(`${va}${vb} + ${vb}${vc} + ${vc}${va} = ${sd(q)}`)}일 때, ${nb(`(${va} − ${vb})(${vb} − ${vc})`)} + ${nb(`(${vb} − ${vc})(${vc} − ${va})`)} + ${nb(`(${vc} − ${va})(${va} − ${vb})`)}의 값은?`, 3 * q - s * s, {
          calc: `3*${jn(q)}-${jn(s)}*${jn(s)}`, derived: [3], rule: 'abc-diff',
          explain: `펼쳐서 모으면 주어진 식은 ${nb(`(${va}${vb} + ${vb}${vc} + ${vc}${va}) − (${va}${sup(2)} + ${vb}${sup(2)} + ${vc}${sup(2)})`)}이다. ${nb(`${va}${sup(2)} + ${vb}${sup(2)} + ${vc}${sup(2)} = ${jd(s)}${sup(2)} − 2 × ${jd(q)} = ${s * s - 2 * q}`)}이므로 값은 ${sd(q)} − ${jd(s * s - 2 * q)} = ${sd(3 * q - s * s)}이다.`
        });
      }
      if (n === 1) {
        // (x + y)(y + z)(z + x) = (s − z)(s − x)(s − y) = sq − r
        const s = nz(d, -4, 4), q = nz(d, -15, 10), r = nz(d, -30, 30), disc = 18 * s * q * r - 4 * s * s * s * r + s * s * q * q - 4 * q * q * q - 27 * r * r;
        if (disc <= 0 || s * q - r === 0) return null;
        const X = V('x'), Y = V('y'), Z = V('z');
        return numQ1(`${nb(`${X} + ${Y} + ${Z} = ${sd(s)}`)}, ${nb(`${X}${Y} + ${Y}${Z} + ${Z}${X} = ${sd(q)}`)}, ${nb(`${X}${Y}${Z} = ${sd(r)}`)}일 때, ${nb(`(${X} + ${Y})(${Y} + ${Z})(${Z} + ${X})`)}의 값은?`, s * q - r, {
          calc: `${jn(s)}*${jn(q)}-${jn(r)}`, rule: 'abc-prod',
          explain: `${nb(`${X} + ${Y} = ${sd(s)} − ${Z}`)}처럼 바꾸면 주어진 식은 ${nb(`(${sd(s)} − ${X})(${sd(s)} − ${Y})(${sd(s)} − ${Z})`)}이다. 펼치면 ${nb(`${jd(s)}${sup(3)} − ${jd(s)}${sup(2)}(${X} + ${Y} + ${Z}) + ${jd(s)}(${X}${Y} + ${Y}${Z} + ${Z}${X}) − ${X}${Y}${Z}`)} = ${nb(`${jd(s)} × ${jd(q)} − ${jd(r)}`)} = ${sd(s * q - r)}이다.`
        });
      }
      // (x + y)(y + z) + (y + z)(z + x) + (z + x)(x + y) = s² + q, q = (s² − t)/2
      const s = d.int(2, 9), t = d.int(4, 60);
      if ((s * s - t) % 2 || 3 * t < s * s || s * s === t) return null;
      const q = (s * s - t) / 2, X = V('x'), Y = V('y'), Z = V('z');
      return numQ1(`${nb(`${X} + ${Y} + ${Z} = ${s}`)}, ${nb(`${X}${sup(2)} + ${Y}${sup(2)} + ${Z}${sup(2)} = ${t}`)}일 때, ${nb(`(${X} + ${Y})(${Y} + ${Z})`)} + ${nb(`(${Y} + ${Z})(${Z} + ${X})`)} + ${nb(`(${Z} + ${X})(${X} + ${Y})`)}의 값은?`, s * s + q, {
        calc: `${s}*${s}+(${s}*${s}-${t})/2`, derived: [2], rule: 'abc-pairs',
        explain: `${nb(`${X}${Y} + ${Y}${Z} + ${Z}${X} = ${frac(`${s}${sup(2)} − ${t}`, 2)} = ${sd(q)}`)}이다. ${nb(`${X} + ${Y} = ${s} − ${Z}`)}처럼 바꾸어 펼치면 주어진 식은 ${nb(`3 × ${s}${sup(2)} − 2 × ${s} × ${s} + (${X}${Y} + ${Y}${Z} + ${Z}${X})`)} = ${nb(`${s * s} + (${sd(q)})`)} = ${s * s + q}이다.`
      });
    }, { count: 3 }),
    // ① 잘라 낸 자리에 생긴 세 면이 없어진 세 면과 같아 겉넓이는 그대로이고, 모서리는 6이 는다.
    H('hard-cut-corner', '모퉁이를 잘라 낸 입체로 처음 직육면체의 대각선', '심4', (d) => {
      const [a, b, c] = d.pick([[3, 4, 10], [2, 2, 4], [2, 4, 6], [3, 3, 6], [4, 4, 4], [2, 6, 8], [3, 5, 8], [5, 5, 10], [2, 3, 7], [4, 6, 6]]);
      const sum2 = a * a + b * b + c * c, [u, w] = sqParts(sum2), S = 2 * (a * b + b * c + c * a), L = 4 * (a + b + c) + 6;
      if (u < 2 || w < 2) return null;
      return radAns(`모든 모서리의 길이가 1보다 긴 직육면체 모양의 나무토막이 있다. 이 나무토막의 한 모퉁이에서 한 모서리의 길이가 1인 정육면체 모양을 잘라 내었다. 남은 입체도형의 겉넓이가 ${S}이고 모든 모서리의 길이의 합이 ${L}일 때, 처음 직육면체의 대각선의 길이는?`, u, w, {
        explain: `처음 직육면체의 세 모서리의 길이를 ${va}, ${vb}, ${vc}라 하자. 잘라 낸 자리에 새로 생긴 세 면은 없어진 세 면과 넓이가 같으므로 겉넓이는 그대로 ${nb(`2(${va}${vb} + ${vb}${vc} + ${vc}${va}) = ${S}`)}이다. 모서리는 세 모서리가 1씩 짧아지고 길이가 1인 모서리 9개가 새로 생기므로 ${nb(`4(${va} + ${vb} + ${vc}) + 6 = ${L}`)}, ${nb(`${va} + ${vb} + ${vc} = ${(L - 6) / 4}`)}이다. ${nb(`${va}${sup(2)} + ${vb}${sup(2)} + ${vc}${sup(2)} = ${(L - 6) / 4}${sup(2)} − ${S} = ${sum2}`)}이므로 대각선의 길이는 ${rt(sum2)} = ${rad(u, w)}이다.`,
        facts: { calc: [[`(((${L}-6)/4)*((${L}-6)/4)-${S})/(${u}*${w})`, 0], [`(((${L}-6)/4)*((${L}-6)/4)-${S})/(${u}*${u})`, 1]], derived: [4, 6, u, w] }
      });
    }),
    // ① 세 구멍이 겹치는 가운데 정육면체를 세 번 뺐으므로 두 번 더한다.
    H('hard-holes', '세 방향으로 구멍을 뚫은 정육면체의 부피', '②16', (d) => {
      const k = d.int(1, 4);
      return linAns(`한 모서리의 길이가 ${nb(`${Xv} + ${k}`)}인 정육면체 모양의 나무토막이 있다. 각 면의 한가운데에서 맞은편 면까지, 밑면이 한 변의 길이가 ${Xv}인 정사각형인 사각기둥 모양의 구멍을 뚫으려고 한다. 앞뒤, 좌우, 위아래의 세 방향으로 구멍을 하나씩 뚫었을 때, 남은 입체도형의 부피를 ${Xv}에 대한 식으로 나타내면?`, 3 * k * k, k ** 3, Xv, {
        explain: `정육면체의 부피 ${nb(`(${Xv} + ${k})${sup(3)}`)}에서 구멍 하나의 부피 ${ej(nb(`${X2}(${Xv} + ${k})`), '을/를')} 세 번 뺀다. 세 구멍이 겹치는 가운데의 한 모서리가 ${Xv}인 정육면체는 세 번 빠졌으므로 두 번 더한다. ${nb(`(${Xv} + ${k})${sup(3)} − 3${X2}(${Xv} + ${k}) + 2${X3}`)} = ${ph(xv(`(x+${k})^3-3x^2(x+${k})+2x^3`))}이다.`,
        facts: { calc: [[`3*${k}*${k}`, 0], [`${k}*${k}*${k}`, 1]], derived: [3] }
      });
    }),
    // ① 큰 나누는 식의 몫 부분은 작은 식으로도 나누어떨어지므로 나머지만 다시 나눈다.
    H('hard-rem-again', '나머지를 다시 나누어 다른 나머지 구하기', '②31', (d, n) => {
      if (n === 0) {
        // A ÷ (x² + c)(x − e) 의 나머지 αx² + βx + γ → A ÷ (x² + c) 의 나머지 βx + (γ − αc)
        const c = d.int(1, 5), e = nz(d, -4, 4), al = nz(d, -4, 4), be = nz(d, -5, 5), ga = nz(d, -6, 6), r0 = ga - al * c;
        if (r0 === 0) return null;
        return linAns(`다항식 ${V('A')}를 ${ej(nb(`(${X2} + ${c})(${ph(xv(pc([1, -e])))})`), '으로/로')} 나누었을 때의 나머지가 ${pt(xv(pc([al, be, ga])))}이다. ${V('A')}를 ${ej(nb(`${X2} + ${c}`), '으로/로')} 나누었을 때의 나머지는?`, be, r0, Xv, {
          explain: `몫을 ${V('Q')}(${Xv})라 하면 ${nb(`${V('A')} = (${X2} + ${c})(${ph(xv(pc([1, -e])))})${V('Q')}(${Xv}) + (${ph(xv(pc([al, be, ga])))})`)}이다. 앞부분은 ${ej(nb(`${X2} + ${c}`), '으로/로')} 나누어떨어지므로 ${pt(xv(pc([al, be, ga])))}만 ${ej(nb(`${X2} + ${c}`), '으로/로')} 나누면 된다. ${nb(`${ph(xv(pc([al, be, ga])))} = (${X2} + ${c}) × ${jd(al)} + ${ph(xv(pc([be, r0])))}`)}이므로 나머지는 ${pt(xv(pc([be, r0])))}이다.`,
          facts: { calc: [[jn(be), 0], [`${jn(ga)}-${jn(al)}*${c}`, 1]], rule: 'again-big' }
        });
      }
      // P = (x − p)Q + r1, Q = (x − q)Q1 + r2 → P = (x − p)(x − q)Q1 + r2 x + (r1 − p r2)
      const p = nz(d, -4, 4), q = nz(d, -4, 4), r1 = nz(d, -6, 6), r2 = nz(d, -5, 5), c0 = r1 - p * r2;
      if (p === q || c0 === 0) return null;
      const L1 = pt(xv(pc([1, -p]))), L2 = pt(xv(pc([1, -q])));
      return linAns(`다항식 ${V('P')}(${Xv})를 ${ej(L1, '으로/로')} 나누었을 때의 몫은 ${V('Q')}(${Xv}), 나머지는 ${sd(r1)}이고, ${V('Q')}(${Xv})를 ${ej(L2, '으로/로')} 나누었을 때의 나머지는 ${sd(r2)}이다. ${V('P')}(${Xv})를 ${ej(nb(`(${ph(xv(pc([1, -p])))})(${ph(xv(pc([1, -q])))})`), '으로/로')} 나누었을 때의 나머지는?`, r2, c0, Xv, {
        explain: `${V('Q')}(${Xv})를 ${ej(L2, '으로/로')} 나눈 몫을 ${V('Q')}₁(${Xv})라 하면 ${nb(`${V('P')}(${Xv}) = (${ph(xv(pc([1, -p])))}){(${ph(xv(pc([1, -q])))})${V('Q')}₁(${Xv}) ${r2 < 0 ? MINUS : '+'} ${Math.abs(r2)}} ${r1 < 0 ? MINUS : '+'} ${Math.abs(r1)}`)} = ${nb(`(${ph(xv(pc([1, -p])))})(${ph(xv(pc([1, -q])))})${V('Q')}₁(${Xv}) + ${ph(xv(pc([r2, c0])))}`)}이다. 따라서 나머지는 ${pt(xv(pc([r2, c0])))}이다.`,
        facts: { calc: [[jn(r2), 0], [`${jn(r1)}-${jn(p)}*${jn(r2)}`, 1]], rule: 'again-chain' }
      });
    }, { count: 2 }),
    // ① x − m/n 과 nx − m 은 상수배 차이: 몫은 1/n 배, 나머지는 그대로.
    H('hard-div-scale', '나누는 식을 상수배 했을 때 몫과 나머지', '②32', (d) => {
      const nn = d.int(2, 4), m = d.until(() => d.int(1, 7), (v) => gcd(v, nn) === 1 && v !== nn), s = d.pick([1, -1]);
      const Qx = `${V('Q')}(${Xv})`, R = V('R'), lin = (k) => nb(`${Xv} ${s > 0 ? MINUS : '+'} ${frac(m, k)}`);
      const big = nb(`${nn}${Xv} ${s > 0 ? MINUS : '+'} ${m}`);
      const rows = [
        [`몫: ${nb(frac(1, nn) + Qx)}, 나머지: ${R}`, true],
        [`몫: ${nb(nn + Qx)}, 나머지: ${R}`, false],          // 나누는 식을 키운 만큼 몫도 키움
        [`몫: ${nb(frac(1, nn) + Qx)}, 나머지: ${nb(frac(R, nn))}`, false],   // 나머지도 함께 나눔
        [`몫: ${Qx}, 나머지: ${nb(nn + R)}`, false]            // 몫은 그대로 두고 나머지를 키움
      ];
      return pick4(d, `다항식 ${V('P')}(${Xv})를 ${ej(lin(nn), '으로/로')} 나누었을 때의 몫을 ${Qx}, 나머지를 ${R}이라 할 때, ${V('P')}(${Xv})를 ${ej(big, '으로/로')} 나누었을 때의 몫과 나머지는?`, rows, {
        explain: `${nb(`${V('P')}(${Xv}) = (${Xv} ${s > 0 ? MINUS : '+'} ${frac(m, nn)})${Qx} + ${R}`)}이고 ${nb(`${Xv} ${s > 0 ? MINUS : '+'} ${frac(m, nn)} = ${frac(1, nn)}(${nn}${Xv} ${s > 0 ? MINUS : '+'} ${m})`)}이므로 ${nb(`${V('P')}(${Xv}) = (${nn}${Xv} ${s > 0 ? MINUS : '+'} ${m}) × ${frac(1, nn)}${Qx} + ${R}`)}이다. 따라서 몫은 ${nb(frac(1, nn) + Qx)}, 나머지는 ${R}이다.`
      });
    }),
    // ① A = BQ + R 을 넣고 B 로 묶으면 남는 kR 은 B 보다 차수가 낮아 그대로 나머지이다.
    H('hard-div-combo', 'A + pB + qR을 B로 나눈 나머지', '②33', (d) => {
      const p = d.int(2, 5), q = d.int(2, 6), R = V('R'), co = (k) => nb((k === 1 ? '' : k) + R);
      const rows = [
        [co(q + 1), true],
        [co(q), false],          // A 에 든 R 을 빠뜨림
        [R, false],              // A 를 B 로 나눈 나머지를 그대로 씀
        [co(p + q + 1), false],  // pB 도 나머지에 더함
        [co(p + q), false]
      ];
      const kept = [rows[0]].concat(d.shuffle(rows.slice(1)).slice(0, 3));
      return pick4(d, `다항식 ${V('A')}를 다항식 ${V('B')}로 나누었을 때의 나머지를 ${R}이라 할 때, ${ej(nb(`${V('A')} + ${p}${V('B')} + ${q}${R}`), '을/를')} ${V('B')}로 나누었을 때의 나머지는?`, kept, {
        explain: `몫을 ${V('Q')}라 하면 ${nb(`${V('A')} = ${V('B')}${V('Q')} + ${R}`)}이므로 ${nb(`${V('A')} + ${p}${V('B')} + ${q}${R} = ${V('B')}(${V('Q')} + ${p}) + ${q + 1}${R}`)}이다. ${R}의 차수는 ${V('B')}의 차수보다 낮으므로 ${co(q + 1)}도 그렇다. 따라서 나머지는 ${co(q + 1)}이다.`
      });
    }),
    // ① xP(x) = (ax − b)xQ(x) + Rx 에서 Rx 는 ax − b 와 차수가 같아 한 번 더 나누어야 한다.
    H('hard-div-xp', 'xP(x)를 나눈 몫', '②34', (d) => {
      const a = d.int(2, 4), b = d.until(() => d.int(2, 7), (v) => gcd(v, a) === 1);
      const Qx = `${V('Q')}(${Xv})`, R = V('R'), xQ = nb(`${Xv}${Qx}`);
      const rows = [
        [nb(`${Xv}${Qx} + ${frac(R, a)}`), true],
        [xQ, false],                                  // Rx 를 나머지로 둠
        [nb(`${Xv}${Qx} + ${R}`), false],             // R 을 나누는 식의 계수로 나누지 않음
        [nb(`${Xv}${Qx} + ${frac(b + R, a)}`), false] // 나머지(bR/a)를 몫에 적음
      ];
      const div = nb(`${a}${Xv} − ${b}`);
      return pick4(d, `다항식 ${V('P')}(${Xv})를 ${ej(div, '으로/로')} 나누었을 때의 몫을 ${Qx}, 나머지를 ${R}이라 할 때, ${nb(`${Xv}${V('P')}(${Xv})`)}를 ${ej(div, '으로/로')} 나누었을 때의 몫은?`, rows, {
        explain: `${nb(`${Xv}${V('P')}(${Xv}) = (${a}${Xv} − ${b})${Xv}${Qx} + ${R}${Xv}`)}이다. ${R}${Xv}는 ${ej(div, '과/와')} 차수가 같으므로 한 번 더 나누면 ${nb(`${R}${Xv} = (${a}${Xv} − ${b}) × ${frac(R, a)} + ${frac(b + R, a)}`)}이다. 따라서 몫은 ${nb(`${Xv}${Qx} + ${frac(R, a)}`)}, 나머지는 ${frac(b + R, a)}이다.`
      });
    })
  ];
  B.addGroup(UNIT, { id: 'hard', title: '실력 문제', standard: STD, types: hardTypes });
})(typeof window !== 'undefined' ? window : globalThis);
