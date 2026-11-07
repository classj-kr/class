// 고등학교 확률과 통계 1단원 「여러 가지 순열과 중복조합」(11-3-1) — 뒤쪽 묶음
// (중복조합의 수와 고르기·나누어 주기, 방정식·부등식의 정수해, 다항식의 항의 개수, 크기 차례가 정해진 순서쌍·함수).
// 싣는 기준과 뺀 것은 11-3-1a.js 머리 주석에 모아 두었다. 도구는 11-3-1a.js 가 내보낸 B.kit.u31x 를 쓴다.
// 중복조합의 수는 언제나 ₙHᵣ = ₙ₊ᵣ₋₁Cᵣ 로 셈하고, 풀이에는 바꾸어 놓는 과정(1씩 먼저 주기, 2X + 1 꼴, 지수의 합)을 적는다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, lines, N, M, C } = B.kit;
  const { range, V, nb, tail } = B.kit.mid;
  const { nP, nC, nPi, nH, jh, pw } = B.kit.hs;
  const K = B.kit.u31x;
  const { UNIT, S2, sum, hits, nCr, nHr, same, cart, seqs, multis, tally, told, listJ, KN, prodS, combS, hS, powS, sameS, eqDigit, T, vk, vn, vr, vf, fx, setOf, upto, sameT } = K;
  const vx = V('x'), vy = V('y'), vz = V('z'), vw = V('w'), va = V('a'), vb = V('b'), vc = V('c');
  // ₙHᵣ = ₙ₊ᵣ₋₁Cᵣ = 값
  const hT = (n, r) => `${nH(n, r)} = ${nC(n + r - 1, r)} = ${nHr(n, r)}`;
  const eqT = (vars, rhs) => nb(vars.join(' + ') + ' = ' + rhs);
  const VARS = (k) => [vx, vy, vz, vw].slice(0, k);
  const pairT = (vars) => '(' + vars.join(', ') + ')';

  // ════════════════ 중복조합의 수와 고르기·나누어 주기 ════════════════
  const DRINKS = ['사이다', '콜라', '오렌지 주스', '우유', '식혜', '녹차'];
  const BREADS = ['단팥빵', '크림빵', '소보로빵', '식빵', '모카빵'];
  const hcombTypes = [
    T('h-value', 'ₙHᵣ의 값', '②1', (d) => {
      const [a, b] = d.pick([[2, 8], [2, 9], [3, 5], [3, 6], [4, 5], [4, 7], [3, 7], [2, 6]]);
      return M(`${jh(nH(a, b), '과/와')} ${nH(b, a)}의 값을 차례로 구하시오.`, [{ label: nH(a, b) + ' =', answer: nHr(a, b) }, { label: nH(b, a) + ' =', answer: nHr(b, a) }], {
        explain: `서로 다른 ${vn}개에서 ${vr}개를 택하는 중복조합의 수는 ${nH(vn, vr)} = ${nC('n+r-1', vr)}이다. ${hT(a, b)}, ${hT(b, a)}이다. 중복을 허용하므로 ${jh(vr, '이/가')} ${vn}보다 커도 된다.`,
        facts: { calc: [[hS(a, b), 0], [hS(b, a), 1]] }
      });
    }),
    T('h-inverse', 'ₙHᵣ = k에서 n이나 r 구하기', '②2', (d, n) => {
      if (n === 0) {
        const r = d.int(2, 3), k = d.until(() => d.int(3, 12), (x) => nHr(x, r) <= 999), v = nHr(k, r);
        const tpl = r === 2 ? '(□+1)*□/2' : '(□+2)*(□+1)*□/6';
        return N(`${nH(vk, r)} = ${v}일 때, 자연수 ${vk}의 값은?`, k, {
          explain: `${nH(vk, r)} = ${nC('k+' + (r - 1), r)} = ${r === 2 ? nb(`(${vk} + 1)${vk}/2`) : nb(`(${vk} + 2)(${vk} + 1)${vk}/6`)} = ${v}이므로 ${r === 2 ? nb(`(${vk} + 1)${vk} = ${2 * v}`) : nb(`(${vk} + 2)(${vk} + 1)${vk} = ${6 * v}`)}이다. ${r === 2 ? `${2 * v} = ${k + 1} × ${k}` : `${6 * v} = ${k + 2} × ${k + 1} × ${k}`}이므로 ${vk} = ${k}이다.`,
          facts: eqDigit(tpl, v, 1, 15)
        });
      }
      const m = d.int(3, 4), k = d.until(() => d.int(2, 10), (x) => nHr(m, x) <= 999), v = nHr(m, k);
      const tpl = m === 3 ? '(□+2)*(□+1)/2' : '(□+3)*(□+2)*(□+1)/6';
      return N(`${nH(m, vk)} = ${v}일 때, 자연수 ${vk}의 값은?`, k, {
        explain: `${nH(m, vk)} = ${nC('k+' + (m - 1), vk)} = ${nC('k+' + (m - 1), m - 1)} = ${m === 3 ? nb(`(${vk} + 2)(${vk} + 1)/2`) : nb(`(${vk} + 3)(${vk} + 2)(${vk} + 1)/6`)} = ${v}이다. ${m === 3 ? `${2 * v} = ${k + 2} × ${k + 1}` : `${6 * v} = ${k + 3} × ${k + 2} × ${k + 1}`}이므로 ${vk} = ${k}이다.`,
        facts: eqDigit(tpl, v, 1, 15)
      });
    }, { count: 2 }),
    T('h-vs-c', 'ₙCᵣ와 ₙHᵣ 가르기 — 서로 다른 종류로·중복을 허용하여', '②3', (d) => {
      const [n0, r] = d.until(() => [d.int(4, 7), d.int(2, 4)], ([a, b]) => b < a), [thing, unitW] = d.pick([['연필', '자루'], ['공책', '권'], ['볼펜', '자루']]);
      return M(`어느 문구점에서 파는 서로 다른 ${n0}종류의 ${thing} 중에서 ${r}${josa(unitW, '을/를')} 사려고 한다. 서로 다른 종류의 ${thing}을 사는 경우의 수와 중복을 허용하여 사는 경우의 수를 차례로 구하시오. (단, 각 종류의 ${thing}은 ${r}${unitW} 이상씩 있다.)`, [{ label: '서로 다른 종류', answer: nCr(n0, r), unit: '가지' }, { label: '중복 허용', answer: nHr(n0, r), unit: '가지' }], {
        explain: `서로 다른 종류로 사는 경우는 서로 다른 ${n0}개에서 ${r}개를 택하는 조합이므로 ${nC(n0, r)} = ${nCr(n0, r)}(가지)이다. 같은 종류를 여러 개 사도 되면 중복조합이므로 ${hT(n0, r)}(가지)이다.`,
        facts: { calc: [[combS(n0, r), 0], [hS(n0, r), 1]] }
      });
    }),
    T('h-which', '순열·중복순열·조합·중복조합 가르기', '②4', (d, n) => {
      if (n === 0) {
        const [n0, r] = d.until(() => [d.int(4, 7), d.int(2, 3)], ([a, b]) => b < a), kind = d.int(0, 3);
        const sits = [
          `서로 다른 ${n0}명의 학생 중에서 ${r}명을 뽑아 일렬로 세우는 경우의 수`,
          `${n0}개의 숫자 ${told(range(1, n0))} 중에서 중복을 허용하여 ${r}자리의 비밀번호를 만드는 경우의 수`,
          `서로 다른 ${n0}종류의 꽃 중에서 서로 다른 ${r}종류를 한 송이씩 고르는 경우의 수`,
          `${n0}종류의 사탕 중에서 중복을 허용하여 ${r}개를 고르는 경우의 수 (단, 종류마다 ${r}개 이상씩 있고, 같은 종류의 사탕끼리는 구별하지 않는다.)`
        ];
        const syms = [nP(n0, r), nPi(n0, r), nC(n0, r), nH(n0, r)], order = d.shuffle([0, 1, 2, 3]);
        const why = ['순서를 따지고 중복을 허용하지 않으므로 순열', '순서를 따지고 중복을 허용하므로 중복순열', '순서를 따지지 않고 중복을 허용하지 않으므로 조합', '순서를 따지지 않고 중복을 허용하므로 중복조합'][kind];
        return C(`다음을 나타낸 것은?<br>${sits[kind]}`, order.map((i) => syms[i]), order.indexOf(kind), {
          explain: `${why}이다. 따라서 ${syms[kind]}이다. (${nP(vn, vr)}: 순서 ○·중복 ×, ${nPi(vn, vr)}: 순서 ○·중복 ○, ${nC(vn, vr)}: 순서 ×·중복 ×, ${nH(vn, vr)}: 순서 ×·중복 ○)`,
          facts: { truth: order.map((i) => i === kind), want: true }
        });
      }
      const [b0, r] = d.until(() => [d.int(3, 4), d.int(5, 8)], ([a, b]) => a ** b <= 9999 && b - a >= 1);
      return M(`구슬 ${r}개를 서로 다른 상자 ${b0}개에 남김없이 나누어 담으려고 한다. 다음 세 경우의 수를 차례로 구하시오.`, [{ label: '⑴', answer: b0 ** r, unit: '가지' }, { label: '⑵', answer: nHr(b0, r), unit: '가지' }, { label: '⑶', answer: nHr(b0, r - b0), unit: '가지' }], {
        figure: lines([`⑴ 서로 다른 구슬 ${r}개를 담고, 빈 상자가 있어도 된다.`, `⑵ 같은 구슬 ${r}개를 담고, 빈 상자가 있어도 된다.`, `⑶ 같은 구슬 ${r}개를 담고, 빈 상자가 없어야 한다.`]),
        explain: `⑴ 구슬마다 담길 상자를 고르므로 중복순열 ${nPi(b0, r)} = ${pw(b0, r)} = ${b0 ** r}(가지)이다. ⑵ 상자마다 담기는 구슬의 개수만 정하면 되므로 중복조합 ${hT(b0, r)}(가지)이다. ⑶ 먼저 상자마다 1개씩 담고 남은 ${r - b0}개를 나누어 담으므로 ${hT(b0, r - b0)}(가지)이다.`,
        facts: { calc: [[powS(b0, r), 0], [hS(b0, r), 1], [hS(b0, r - b0), 2]] }
      });
    }, { count: 2 }),
    T('h-pick', '종류에서 중복을 허용하여 고르기', '②5', (d, n) => {
      if (n === 0) {
        const [n0, r] = d.until(() => [d.int(3, 5), d.int(4, 8)], ([a, b]) => nHr(a, b) <= 9999), list = d.pick([DRINKS, BREADS]).slice(0, n0), drink = DRINKS.includes(list[0]);
        const last = list[n0 - 1], unitW = drink ? '병' : '개';
        return N(`${told(list.slice(0, -1).concat([josa(last, '이/가')]))} 각각 ${r}${unitW} 이상씩 있다. 이 중에서 ${r}${josa(unitW, '을/를')} 사는 경우의 수는? (단, 같은 종류끼리는 서로 구별하지 않고, 사지 않는 종류가 있을 수 있다.)`, nHr(n0, r), {
          unit: '가지',
          explain: `서로 다른 ${n0}종류에서 중복을 허용하여 ${r}개를 택하는 중복조합의 수이므로 ${hT(n0, r)}(가지)이다.`,
          facts: { calc: [[hS(n0, r), 0]] }
        });
      }
      const n0 = d.int(3, 4), r = d.int(4, 6), stock = d.shuffle([r].concat(range(1, n0 - 1).map(() => r + d.int(1, 3)))), names = 'ABCD'.slice(0, n0).split('');
      return N(`${names.map((x, i) => `${x} 과자 ${stock[i]}개`).join(', ')}가 있다. 이 중에서 과자 ${r}개를 고르는 경우의 수는? (단, 같은 종류의 과자끼리는 서로 구별하지 않고, 고르지 않는 종류가 있을 수 있다.)`, nHr(n0, r), {
        unit: '가지',
        explain: `어느 종류든 ${r}개 이상 있으므로 한 종류에서 ${r}개를 모두 골라도 모자라지 않는다. 따라서 서로 다른 ${n0}종류에서 ${r}개를 택하는 중복조합의 수 ${hT(n0, r)}(가지)이다.`,
        facts: { calc: [[hS(n0, r), 0]] }
      });
    }, { count: 2 }),
    T('h-give', '같은 물건을 서로 다른 사람·곳에 나누어 주기', '②6', (d) => {
      const [p, r] = d.until(() => [d.int(3, 5), d.int(4, 9)], ([a, b]) => nHr(a, b) <= 9999 && b > a);
      const ctx = d.pick([
        { thing: '젤리', to: `학생 ${p}명에게`, verb: '나누어 주는', note: '젤리를 받지 못하는 학생이 있을 수 있다.', who: `학생 ${p}명` },
        { thing: '사탕', to: `어린이 ${p}명에게`, verb: '나누어 주는', note: '사탕을 받지 못하는 어린이가 있을 수 있다.', who: `어린이 ${p}명` },
        { thing: '마카롱', to: `서로 다른 접시 ${p}개에`, verb: '나누어 담는', note: '빈 접시가 있을 수 있다.', who: `접시 ${p}개` },
        { thing: '공', to: `서로 다른 상자 ${p}개에`, verb: '나누어 넣는', note: '빈 상자가 있을 수 있다.', who: `상자 ${p}개` }]);
      return N(`같은 종류의 ${ctx.thing} ${r}개를 ${ctx.to} 남김없이 ${ctx.verb} 경우의 수는? (단, ${ctx.note})`, nHr(p, r), {
        unit: '가지',
        explain: `${ctx.thing}끼리는 서로 같으므로 받는 쪽마다 몇 개를 받는지만 정하면 된다. ${ctx.who} 가운데에서 중복을 허용하여 ${r}번 택하는 중복조합의 수이므로 ${hT(p, r)}(가지)이다.`,
        facts: { calc: [[hS(p, r), 0]] }
      });
    }),
    T('h-atleast', '적어도 하나(k개)씩 — 먼저 나누어 주고 나머지를 중복조합', '②7', (d, n) => {
      if (n === 0) {
        const [p, k, r] = d.until(() => [d.int(3, 4), d.int(1, 3), d.int(6, 16)], ([a, b, c]) => c - a * b >= 2 && nHr(a, c - a * b) <= 9999), [thing, ppl] = d.pick([['볼펜', '학생'], ['수학책', '가방'], ['사탕', '어린이']]);
        const bag = ppl === '가방', rest = r - p * k;
        return N(bag ? `같은 종류의 ${thing} ${r}권을 서로 다른 ${ppl} ${p}개에 나누어 담으려고 한다. 가방마다 ${thing}을 적어도 ${k}권씩 담는 경우의 수는?` : `같은 종류의 ${thing} ${r}개를 ${ppl} ${p}명에게 남김없이 나누어 줄 때, 각 ${ppl}에게 적어도 ${k}개씩 나누어 주는 경우의 수는?`, nHr(p, rest), {
          unit: '가지',
          explain: `먼저 ${bag ? '가방마다' : ppl + '마다'} ${k}${bag ? '권' : '개'}씩 ${bag ? '담고' : '나누어 주고'}, 남은 ${rest}${bag ? '권을 가방 ' + p + '개에' : '개를 ' + p + '명에게'} 중복을 허용하여 나누면 된다. 따라서 ${hT(p, rest)}(가지)이다.`,
          facts: { calc: [[hS(p, rest), 0]] }
        });
      }
      const allKinds = d.bool();
      if (allKinds) {
        const [p, r, s] = d.until(() => [d.int(3, 4), d.int(5, 9), d.int(4, 6)], ([a, b, c]) => b - a >= 2 && b - a + 1 <= c), cols = ['빨간색', '파란색', '노란색', '초록색'].slice(0, p), rest = r - p;
        return N(`${cols.join(', ')} 색종이가 각각 ${s}장씩 들어 있는 상자에서 ${r}장의 색종이를 꺼낼 때, ${KN[p]} 가지 색이 적어도 한 장씩 들어 있도록 꺼내는 경우의 수는? (단, 같은 색의 색종이끼리는 서로 구별하지 않는다.)`, nHr(p, rest), {
          unit: '가지',
          explain: `먼저 색마다 1장씩 꺼낸 뒤 나머지 ${rest}장을 ${p}가지 색에서 중복을 허용하여 꺼내면 된다. 한 색이 가장 많아도 ${rest + 1}장이라 ${s}장을 넘지 않는다. 따라서 ${hT(p, rest)}(가지)이다.`,
          facts: { calc: [[hS(p, rest), 0]] }
        });
      }
      const [p, r] = d.until(() => [d.int(3, 5), d.int(4, 7)], ([a, b]) => nHr(a, b - 1) <= 9999), fruits = ['사과', '배', '오렌지', '바나나', '귤'].slice(0, p), s = r + d.int(0, 2);
      return N(`${told(fruits)}${josa(fruits[p - 1], '이/가').slice(fruits[p - 1].length)} 각각 ${s}개씩 있다. 이 중에서 ${r}개를 골라 과일 바구니를 만들 때, ${fruits[0]}가 적어도 1개 들어 있는 경우의 수는? (단, 같은 종류의 과일끼리는 서로 구별하지 않는다.)`, nHr(p, r - 1), {
        unit: '가지',
        explain: `먼저 ${fruits[0]} 1개를 고르고, 나머지 ${r - 1}개를 ${p}종류에서 중복을 허용하여 고르면 된다. 따라서 ${hT(p, r - 1)}(가지)이다. (모든 경우 ${nH(p, r)}에서 ${fruits[0]}가 없는 경우 ${jh(nH(p - 1, r), '을/를')} 빼도 ${nHr(p, r)} − ${nHr(p - 1, r)} = ${josa(nHr(p, r - 1), '으로/로')} 같다.)`,
        facts: { calc: [[hS(p, r - 1), 0]] }
      });
    }, { count: 2 }),
    T('h-kinds', '두 종류 이상의 같은 물건을 나누어 담기 — 종류마다 중복조합을 곱함', '②9 심8', (d, n) => {
      if (n === 0) {
        const [p, c0, u, m] = d.until(() => [d.int(2, 3), d.int(3, 6), d.int(5, 9), d.int(1, 2)], ([a, b, c, e]) => c - a * e >= 1 && nHr(a, b) * nHr(a, c - a * e) <= 9999);
        const rest = u - p * m, x = nHr(p, c0), y = nHr(p, rest);
        return N(`당근 ${c0}개와 오이 ${u}개를 서로 다른 장바구니 ${p}개에 남김없이 나누어 담으려고 한다. 장바구니마다 오이를 적어도 ${m}개씩 넣을 때, 나누어 담는 경우의 수는? (단, 같은 종류의 채소끼리는 서로 구별하지 않는다.)`, x * y, {
          unit: '가지',
          explain: `당근을 나누어 담는 경우는 ${hT(p, c0)}(가지)이다. 오이는 장바구니마다 ${m}개씩 먼저 넣고 남은 ${rest}개를 나누어 담으므로 ${hT(p, rest)}(가지)이다. 따라서 ${x} × ${y} = ${x * y}(가지)이다.`,
          facts: { calc: [[`${hS(p, c0)}*${hS(p, rest)}`, 0]] }
        });
      }
      const [p, a, b, c] = d.until(() => [d.int(2, 3), d.int(3, 5), d.int(2, 3), d.int(1, 2)], ([q, x, y, z]) => x > y && y > z && nHr(q, x) * nHr(q, y) * nHr(q, z) <= 9999 && nHr(q, x) * nHr(q, y) * nHr(q, z) >= 30);
      const xa = nHr(p, a), xb = nHr(p, b), xc = nHr(p, c), ans = xa * xb * xc;
      return N(`같은 종류의 주스 ${a}병, 같은 종류의 생수 ${b}병, 같은 종류의 우유 ${c}병을 ${p}명에게 남김없이 나누어 주는 경우의 수는? (단, 1병도 받지 못하는 사람이 있을 수 있다.)`, ans, {
        unit: '가지',
        explain: `종류마다 따로 나누어 준다. 주스는 ${hT(p, a)}, 생수는 ${hT(p, b)}, 우유는 ${hT(p, c)}(가지)이므로 ${xa} × ${xb} × ${xc} = ${ans}(가지)이다. 세 종류를 한데 섞어 ${jh(nH(p, a + b + c), '으로/로')} 세면 종류가 다른 병을 같은 것으로 보게 되어 틀린다.`,
        facts: { calc: [[`${hS(p, a)}*${hS(p, b)}*${hS(p, c)}`, 0]] }
      });
    }, { count: 2 })
  ];

  // ════════════════ 방정식·부등식의 정수해 ════════════════
  const heqTypes = [
    T('heq-nonneg', '방정식의 음이 아닌 정수해의 개수', '②10', (d) => {
      const [k, s] = d.until(() => [d.int(3, 4), d.int(5, 12)], ([a, b]) => nHr(a, b) <= 9999), vs = VARS(k);
      return N(`방정식 ${eqT(vs, s)}${tail(s, '을/를')} 만족시키는 음이 아닌 정수 ${told(vs)}의 순서쌍 ${pairT(vs)}의 개수는?`, nHr(k, s), {
        unit: '개',
        explain: `해 하나는 ${KN[k]} 문자 ${told(vs)} 중에서 중복을 허용하여 ${s}개를 택한 것과 같다(${vx} = 2이면 ${vx}를 2번 택한 것으로 본다). 따라서 ${hT(k, s)}(개)이다.`,
        facts: { calc: [[hS(k, s), 0]] }
      });
    }),
    T('heq-pos', '방정식의 양의 정수해의 개수', '②11', (d) => {
      const [k, s] = d.until(() => [d.int(3, 4), d.int(6, 16)], ([a, b]) => b - a >= 2 && nHr(a, b - a) <= 9999), vs = VARS(k);
      const XS = ['X', 'Y', 'Z', 'W'].slice(0, k).map((c) => V(c));
      return N(`방정식 ${eqT(vs, s)}${tail(s, '을/를')} 만족시키는 자연수 ${told(vs)}의 순서쌍 ${pairT(vs)}의 개수는?`, nHr(k, s - k), {
        unit: '개',
        explain: `${vs.map((v, i) => nb(`${v} = ${XS[i]} + 1`)).join(', ')}로 놓으면 ${told(XS)}는 음이 아닌 정수이고 ${eqT(XS, s - k)}이다. 따라서 ${hT(k, s - k)}(개)이다.`,
        facts: { calc: [[hS(k, s - k), 0]] }
      });
    }),
    T('heq-lower', '미지수마다 아래 한계가 다른 정수해', '②12 심5', (d, n) => {
      const XS = ['X', 'Y', 'Z', 'W'].map((c) => V(c));
      if (n === 0) {
        const lo = d.until(() => [d.int(1, 4), d.int(1, 4), d.int(1, 4)], (l) => new Set(l).size >= 2), s = sum(lo) + d.int(4, 13), rest = s - sum(lo), vs = VARS(3);
        return N(`방정식 ${eqT(vs, s)}${tail(s, '을/를')} 만족시키는 정수 ${told(vs)} 중에서 ${nb(`${vx} ≥ ${lo[0]}`)}, ${nb(`${vy} ≥ ${lo[1]}`)}, ${nb(`${vz} ≥ ${lo[2]}`)}인 순서쌍 ${pairT(vs)}의 개수는?`, nHr(3, rest), {
          unit: '개',
          explain: `${vs.map((v, i) => nb(`${v} = ${XS[i]} + ${lo[i]}`)).join(', ')}${tail(lo[2], '으로/로')} 놓으면 ${told(XS.slice(0, 3))}는 음이 아닌 정수이고 ${eqT(XS.slice(0, 3), rest)}이다. 따라서 ${hT(3, rest)}(개)이다.`,
          facts: { calc: [[hS(3, rest), 0]] }
        });
      }
      const [k, t, s] = d.until(() => [d.int(3, 4), d.int(1, 2), d.int(2, 7)], ([a, b, c]) => nHr(a, c + a * b) <= 9999), vs = VARS(k), rest = s + k * t;
      return N(`방정식 ${eqT(vs, s)}${tail(s, '을/를')} 만족시키는 −${t} 이상의 정수 ${told(vs)}의 순서쌍 ${pairT(vs)}의 개수는?`, nHr(k, rest), {
        unit: '개',
        explain: `${vs.map((v, i) => nb(`${v} = ${XS[i]} − ${t}`)).join(', ')}로 놓으면 ${told(XS.slice(0, k))}는 음이 아닌 정수이고 ${eqT(XS.slice(0, k), s + ' + ' + k * t)}, 곧 ${eqT(XS.slice(0, k), rest)}이다. 따라서 ${hT(k, rest)}(개)이다.`,
        facts: { calc: [[hS(k, rest), 0]] }
      });
    }, { count: 2 }),
    T('heq-parity', '홀수·짝수 조건이 붙은 정수해', '②13', (d, n) => {
      const XS = ['X', 'Y', 'Z', 'W'].map((c) => V(c));
      if (n === 0) {
        const s = d.pick(range(7, 21).filter((v) => v % 2 === 1)), rest = (s - 3) / 2, vs = VARS(3);
        return N(`방정식 ${eqT(vs, s)}${tail(s, '을/를')} 만족시키는 자연수 ${told(vs)} 중에서 ${told(vs)}가 모두 홀수인 순서쌍 ${pairT(vs)}의 개수는?`, nHr(3, rest), {
          unit: '개',
          explain: `${vs.map((v, i) => nb(`${v} = 2${XS[i]} + 1`)).join(', ')}(${told(XS.slice(0, 3))}는 음이 아닌 정수)로 놓으면 ${nb(`2(${XS.slice(0, 3).join(' + ')}) + 3 = ${s}`)}, 곧 ${eqT(XS.slice(0, 3), rest)}이다. 따라서 ${hT(3, rest)}(개)이다.`,
          facts: { calc: [[hS(3, rest), 0]] }
        });
      }
      const four = d.bool();
      if (four) {
        const s = d.pick(range(10, 20).filter((v) => v % 2 === 0)), rest = (s - 6) / 2, vs = VARS(4);
        return N(`방정식 ${eqT(vs, s)}${tail(s, '을/를')} 만족시키는 자연수 ${told(vs)} 중에서 ${told(vs.slice(0, 2))}는 홀수이고 ${told(vs.slice(2))}는 짝수인 순서쌍 ${pairT(vs)}의 개수는?`, nHr(4, rest), {
          unit: '개',
          explain: `홀수인 자연수는 1 이상, 짝수인 자연수는 2 이상이다. ${nb(`${vx} = 2${XS[0]} + 1`)}, ${nb(`${vy} = 2${XS[1]} + 1`)}, ${nb(`${vz} = 2${XS[2]} + 2`)}, ${nb(`${vw} = 2${XS[3]} + 2`)}로 놓으면 ${nb(`2(${XS.join(' + ')}) + 6 = ${s}`)}, 곧 ${eqT(XS, rest)}이다. 따라서 ${hT(4, rest)}(개)이다.`,
          facts: { calc: [[hS(4, rest), 0]] }
        });
      }
      const s = d.pick(range(8, 20).filter((v) => v % 2 === 0)), rest = (s - 4) / 2, vs = VARS(3);
      return N(`방정식 ${eqT(vs, s)}${tail(s, '을/를')} 만족시키는 자연수 ${told(vs)} 중에서 ${vx}는 짝수이고 ${told(vs.slice(1))}는 홀수인 순서쌍 ${pairT(vs)}의 개수는?`, nHr(3, rest), {
        unit: '개',
        explain: `짝수인 자연수는 2 이상이므로 ${nb(`${vx} = 2${XS[0]} + 2`)}, ${nb(`${vy} = 2${XS[1]} + 1`)}, ${nb(`${vz} = 2${XS[2]} + 1`)}로 놓으면 ${nb(`2(${XS.slice(0, 3).join(' + ')}) + 4 = ${s}`)}, 곧 ${eqT(XS.slice(0, 3), rest)}이다. 따라서 ${hT(3, rest)}(개)이다.`,
        facts: { calc: [[hS(3, rest), 0]] }
      });
    }, { count: 2 }),
    T('heq-ineq', '부등식 x + y + z ≤ n의 음이 아닌 정수해', '②14', (d) => {
      const s = d.int(3, 8), vs = VARS(3), all = cart([range(0, s), range(0, s), range(0, s)]), flags = all.map((t) => sum(t) <= s), parts = range(0, s).reverse().map((v) => nHr(3, v));
      return N(`부등식 ${nb(vs.join(' + ') + ' ≤ ' + s)}${tail(s, '을/를')} 만족시키는 음이 아닌 정수 ${told(vs)}의 순서쌍 ${pairT(vs)}의 개수는?`, hits(flags), {
        unit: '개',
        explain: `${nb(vs.join(' + '))}의 값이 ${s}, ${s - 1}, …, 0인 경우로 나누어 센다. 합이 ${s}인 해는 ${nH(3, s)} = ${nHr(3, s)}(개)이고, 같은 방법으로 ${parts.join(' + ')} = ${hits(flags)}(개)이다. (남는 양을 ${vw}로 놓아 ${eqT([vx, vy, vz, vw], s)}의 음이 아닌 정수해 ${nH(4, s)} = ${nHr(4, s)}(개)로 세어도 같다.)`,
        facts: { count: flags }
      });
    }),
    T('heq-coef', '계수가 붙은 미지수가 낀 방정식', '②15', (d) => {
      const [c, s] = d.until(() => [d.int(3, 6), d.int(8, 16)], ([a, b]) => Math.floor(b / a) >= 2 && Math.floor(b / a) <= 3 && sum(range(0, Math.floor(b / a)).map((w) => nHr(3, b - a * w))) <= 9999);
      const ws = range(0, Math.floor(s / c)), parts = ws.map((w) => nHr(3, s - c * w)), ans = sum(parts);
      return N(`방정식 ${nb(`${vx} + ${vy} + ${vz} + ${c}${vw} = ${s}`)}${tail(s, '을/를')} 만족시키는 음이 아닌 정수 ${told(VARS(4))}의 순서쌍 ${pairT(VARS(4))}의 개수는?`, ans, {
        unit: '개',
        explain: `${vw}의 값으로 나누어 센다. ` + ws.map((w, i) => `${vw} = ${w}이면 ${eqT(VARS(3), s - c * w)}이므로 ${nH(3, s - c * w)} = ${parts[i]}(개)`).join(', ') + `이다. 따라서 ${parts.join(' + ')} = ${ans}(개)이다.`,
        facts: { calc: [[ws.map((w) => hS(3, s - c * w)).join('+'), 0]] }
      });
    }),
    T('heq-digits', '자리 숫자의 합이 정해진 수', '②16', (d) => {
      const s = d.int(5, 10), odd = d.bool(), all = range(100, 999), dig = (v) => [Math.floor(v / 100), Math.floor(v / 10) % 10, v % 10];
      const flags = all.map((v) => { const [a, b, c] = dig(v); return a + b + c === s && a % 2 === (odd ? 1 : 0); });
      const heads = range(1, 9).filter((a) => a % 2 === (odd ? 1 : 0) && a <= s), parts = heads.map((a) => s - a + 1);
      return N(`다음 조건을 모두 만족시키는 세 자리의 자연수의 개수는?`, hits(flags), {
        unit: '개',
        figure: lines([`㈎ 각 자리의 숫자의 합은 ${s}이다.`, `㈏ 백의 자리의 숫자는 ${odd ? '홀수' : '짝수'}이다.`]),
        explain: `백의 자리의 숫자를 ${vx}, 십의 자리의 숫자를 ${vy}, 일의 자리의 숫자를 ${vz}라 하면 ${eqT(VARS(3), s)}이다. ` + heads.map((a, i) => `${vx} = ${a}이면 ${eqT([vy, vz], s - a)}의 음이 아닌 정수해 ${nH(2, s - a)} = ${parts[i]}(개)`).join(', ') + `이다(${vy}, ${vz}는 9를 넘지 않는다). 따라서 ${parts.join(' + ')} = ${hits(flags)}(개)이다.`,
        facts: { count: flags }
      });
    }),
    T('heq-product', '곱이 정해진 세 자연수 — 지수의 합으로 바꾸기', '②17', (d) => {
      const [p, m] = d.until(() => [d.pick([2, 3]), d.int(5, 12)], ([a, b]) => a ** b <= 9999), K0 = p ** m, rest = m - 3, XS = ['x', 'y', 'z'].map((c) => V(c));
      return N(`1이 아닌 세 자연수 ${va}, ${vb}, ${vc}에 대하여 ${nb(`${va}${vb}${vc} = ${K0}`)}일 때, 순서쌍 (${va}, ${vb}, ${vc})의 개수는?`, nHr(3, rest), {
        unit: '개',
        explain: `${K0} = ${pw(p, m)}이므로 ${va}, ${vb}, ${vc}는 모두 ${p}의 거듭제곱이다. ${nb(`${va} = ${p}<sup>${XS[0]}</sup>`)}, ${nb(`${vb} = ${p}<sup>${XS[1]}</sup>`)}, ${nb(`${vc} = ${p}<sup>${XS[2]}</sup>`)}이라 하면 1이 아니므로 ${told(XS)}는 자연수이고 ${eqT(XS, m)}이다. 자연수해의 개수는 ${hT(3, rest)}(개)이다.`,
        facts: { calc: [[hS(3, rest), 0]] }
      });
    })
  ];

  // ════════════════ 다항식의 항의 개수 ════════════════
  const LETTERS = ['a', 'b', 'c', 'd', 'e'];
  const coefT = (c, ch, first) => (c === 1 ? (first ? '' : ' + ') : c === -1 ? (first ? '−' : ' − ') : c > 0 ? (first ? '' : ' + ') + c : (first ? '−' : ' − ') + (-c)) + V(ch);
  const htermTypes = [
    T('hterm-count', '전개식의 서로 다른 항의 개수', '②18', (d, n) => {
      const [k, m] = d.until(() => [d.int(3, 5), d.int(3, 8)], ([a, b]) => nHr(a, b) <= 9999), ls = LETTERS.slice(0, k);
      const coefs = n === 0 ? ls.map(() => 1) : d.until(() => ls.map(() => d.pick([1, 2, 3, -1, -2, -3])), (l) => l.some((c) => c !== 1) && l.some((c) => c < 0));
      const inner = ls.map((ch, i) => coefT(coefs[i], ch, i === 0)).join('');
      return N(`다항식 ${nb('(' + inner + ')<sup>' + m + '</sup>')}의 전개식에서 서로 다른 항의 개수는?`, nHr(k, m), {
        unit: '개',
        explain: `전개식의 각 항은 ${told(ls.map((ch) => V(ch)))}의 ${k}개 문자 중에서 중복을 허용하여 ${m}개를 택해 곱한 꼴(문자 부분)이다.${n === 1 ? ' 계수가 붙어 있어도 문자 부분이 같은 항끼리 모이므로 항의 개수는 달라지지 않는다.' : ''} 따라서 ${hT(k, m)}(개)이다.`,
        facts: { calc: [[hS(k, m), 0]] }
      });
    }, { count: 2 }),
    T('hterm-inverse', '항의 개수로 지수 n 구하기', '②19', (d) => {
      const k = d.int(3, 4), m = d.until(() => d.int(3, 10), (x) => nHr(k, x) <= 999), T0 = nHr(k, m), ls = LETTERS.slice(0, k).map((ch) => V(ch));
      const tpl = k === 3 ? '(□+2)*(□+1)/2' : '(□+3)*(□+2)*(□+1)/6';
      return N(`다항식 ${nb('(' + ls.join(' + ') + ')<sup>' + vn + '</sup>')}의 전개식에서 서로 다른 항의 개수가 ${T0}일 때, 자연수 ${vn}의 값은?`, m, {
        explain: `서로 다른 항의 개수는 ${nH(k, vn)} = ${nC('n+' + (k - 1), vn)} = ${nC('n+' + (k - 1), k - 1)}이다. ${k === 3 ? nb(`(${vn} + 2)(${vn} + 1)/2 = ${T0}`) : nb(`(${vn} + 3)(${vn} + 2)(${vn} + 1)/6 = ${T0}`)}에서 ${k === 3 ? `${2 * T0} = ${m + 2} × ${m + 1}` : `${6 * T0} = ${m + 3} × ${m + 2} × ${m + 1}`}이므로 ${vn} = ${m}이다.`,
        facts: eqDigit(tpl, T0, 1, 15)
      });
    }),
    T('hterm-product', '두 다항식 곱의 항의 개수', '②20', (d) => {
      const [k1, m1, k2, m2] = d.until(() => [d.int(2, 3), d.int(4, 9), d.int(3, 4), d.int(3, 7)], ([a, b, c, e]) => nHr(a, b) * nHr(c, e) <= 9999), A = ['a', 'b', 'c'].slice(0, k1).map((ch) => V(ch)), P = ['p', 'q', 'r', 's'].slice(0, k2).map((ch) => V(ch));
      const x = nHr(k1, m1), y = nHr(k2, m2);
      return N(`다항식 ${nb('(' + A.join(' + ') + ')<sup>' + m1 + '</sup>(' + P.join(' + ') + ')<sup>' + m2 + '</sup>')}의 전개식에서 서로 다른 항의 개수는?`, x * y, {
        unit: '개',
        explain: `${nb('(' + A.join(' + ') + ')<sup>' + m1 + '</sup>')}의 서로 다른 항은 ${hT(k1, m1)}(개), ${nb('(' + P.join(' + ') + ')<sup>' + m2 + '</sup>')}의 서로 다른 항은 ${hT(k2, m2)}(개)이다. 두 다항식의 문자가 겹치지 않으므로 항끼리 곱한 것은 모두 서로 다르고, ${x} × ${y} = ${x * y}(개)이다.`,
        facts: { calc: [[`${hS(k1, m1)}*${hS(k2, m2)}`, 0]] }
      });
    }),
    T('hterm-odd', '차수 조건이 붙은 항의 개수', '②21', (d) => {
      const m = d.pick(range(7, 21).filter((v) => v % 2 === 1)), rest = (m - 3) / 2, ls = ['x', 'y', 'z'].map((ch) => V(ch)), E = ['p', 'q', 'r'].map((ch) => V(ch));
      return N(`다항식 ${nb('(' + ls.join(' + ') + ')<sup>' + m + '</sup>')}의 전개식에서 ${told(ls)}의 차수가 모두 홀수인 서로 다른 항의 개수는?`, nHr(3, rest), {
        unit: '개',
        explain: `항 ${nb(`${ls[0]}<sup>${E[0]}</sup>${ls[1]}<sup>${E[1]}</sup>${ls[2]}<sup>${E[2]}</sup>`)}의 개수는 ${eqT(E, m)}${tail(m, '을/를')} 만족시키는 홀수 ${told(E)}의 순서쌍의 개수와 같다. `
          + `${nb(`${E[0]} = 2${V('a')} + 1`)}, ${nb(`${E[1]} = 2${V('b')} + 1`)}, ${nb(`${E[2]} = 2${V('c')} + 1`)}(${V('a')}, ${V('b')}, ${V('c')}는 음이 아닌 정수)로 놓으면 ${eqT([V('a'), V('b'), V('c')], rest)}이므로 ${hT(3, rest)}(개)이다.`,
        facts: { calc: [[hS(3, rest), 0]] }
      });
    })
  ];

  // ════════════════ 크기 차례가 정해진 순서쌍·함수 ════════════════
  const hfunTypes = [
    T('hfun-triple', 'a ≤ b ≤ c ≤ n인 자연수의 순서쌍', '②22', (d) => {
      const k = d.int(3, 4), m = d.until(() => d.int(5, 10), (x) => (x ** k <= 6000)), vs = [va, vb, vc, V('d')].slice(0, k), all = seqs(range(1, m), k), flags = all.map((t) => t.every((v, i) => i === 0 || t[i - 1] <= v));
      return N(`${nb('1 ≤ ' + vs.join(' ≤ ') + ' ≤ ' + m)}인 자연수 ${told(vs)}의 순서쌍 ${pairT(vs)}의 개수는?`, hits(flags), {
        unit: '개',
        explain: `1부터 ${m}까지의 자연수 중에서 중복을 허용하여 ${k}개를 택하면, 작은 수부터 차례로 ${told(vs)}에 넣는 방법은 한 가지뿐이다. 따라서 ${hT(m, k)}(개)이다.`,
        facts: { count: flags }
      });
    }),
    T('hfun-parity', '크기 차례가 정해진 순서쌍과 합의 홀짝', '②23', (d) => {
      const m = d.int(6, 10), even = d.bool(), all = multis(range(1, m), 3), flags = all.map((t) => sum(t) % 2 === (even ? 0 : 1));
      const E0 = range(1, m).filter((v) => v % 2 === 0).length, O0 = m - E0;
      const [p1, p2, s1, s2] = even ? [nHr(E0, 3), nHr(O0, 2) * E0, `셋 다 짝수인 경우 ${nH(E0, 3)} = ${nHr(E0, 3)}(개)`, `홀수 둘·짝수 하나인 경우 ${nH(O0, 2)} × ${E0} = ${nHr(O0, 2) * E0}(개)`]
        : [nHr(O0, 3), nHr(E0, 2) * O0, `셋 다 홀수인 경우 ${nH(O0, 3)} = ${nHr(O0, 3)}(개)`, `짝수 둘·홀수 하나인 경우 ${nH(E0, 2)} × ${O0} = ${nHr(E0, 2) * O0}(개)`];
      return N(`${nb(`1 ≤ ${va} ≤ ${vb} ≤ ${vc} ≤ ${m}`)}인 세 자연수 ${va}, ${vb}, ${vc}에 대하여 ${nb(`${va} + ${vb} + ${vc}`)}의 값이 ${even ? '짝수' : '홀수'}가 되는 순서쌍 (${va}, ${vb}, ${vc})의 개수는?`, hits(flags), {
        unit: '개',
        explain: `1부터 ${m}까지 짝수는 ${E0}개, 홀수는 ${O0}개이다. 합이 ${even ? '짝수' : '홀수'}인 것은 ${s1}와 ${s2}이다(고른 세 수를 작은 수부터 넣는다). 따라서 ${p1} + ${p2} = ${hits(flags)}(개)이다.`,
        facts: { count: flags }
      });
    }),
    T('hfun-incr', '증가하는(f(x₁) ≤ f(x₂)) 함수의 개수', '②24', (d, n) => {
      if (n === 0) {
        const [p, q] = d.until(() => [d.int(3, 5), d.int(3, 7)], ([a, b]) => a !== b && nHr(b, a) <= 9999);
        return N(`두 집합 X = ${upto(p)}, Y = ${upto(q)}에 대하여 X의 임의의 두 원소 ${V('x')}<sub>1</sub>, ${V('x')}<sub>2</sub>에 대하여 ${nb(`${V('x')}<sub>1</sub> &lt; ${V('x')}<sub>2</sub>`)}이면 ${nb(`${vf}(${V('x')}<sub>1</sub>) ≤ ${vf}(${V('x')}<sub>2</sub>)`)}인 함수 ${vf}: X → Y의 개수는?`, nHr(q, p), {
          unit: '개',
          explain: `Y의 원소 중에서 중복을 허용하여 ${p}개를 택한 뒤 X의 원소 1, 2, …에 작은 수부터 차례로 대응시키면 함수가 하나 정해진다. 따라서 ${hT(q, p)}(개)이다.`,
          facts: { calc: [[hS(q, p), 0]] }
        });
      }
      const [p, lo, hi] = d.until(() => [d.int(4, 6), d.int(2, 3), d.int(4, 6)], ([a, b, c]) => c - b >= 1 && c <= a && nHr(c - b + 1, a) <= 9999), cnt = hi - lo + 1;
      return N(`집합 X = ${upto(p)}에 대하여 X의 임의의 두 원소 ${V('x')}<sub>1</sub>, ${V('x')}<sub>2</sub>에 대하여 ${nb(`${V('x')}<sub>1</sub> &lt; ${V('x')}<sub>2</sub>`)}이면 ${nb(`${lo} ≤ ${vf}(${V('x')}<sub>1</sub>) ≤ ${vf}(${V('x')}<sub>2</sub>) ≤ ${hi}`)}인 함수 ${vf}: X → X의 개수는?`, nHr(cnt, p), {
        unit: '개',
        explain: `함숫값은 ${told(range(lo, hi))}의 ${cnt}개 가운데에서만 나온다. 이 ${cnt}개에서 중복을 허용하여 ${p}개를 택해 작은 수부터 차례로 대응시키면 되므로 ${hT(cnt, p)}(개)이다.`,
        facts: { calc: [[hS(cnt, p), 0]] }
      });
    }, { count: 2 }),
    T('hfun-partial', '일부 원소에만 크기 조건이 붙은 함수', '②25 심7', (d) => {
      const p = d.int(4, 5), X = range(1, p), trio = d.shuffle(X).slice(0, 3).sort((x, y) => x - y), free = X.filter((v) => !trio.includes(v)), all = seqs(X, p);
      const flags = all.map((t) => t[trio[0] - 1] <= t[trio[1] - 1] && t[trio[1] - 1] <= t[trio[2] - 1]), a = nHr(p, 3), b = p ** free.length;
      return N(`집합 X = ${upto(p)}에 대하여 ${nb(`${fx(trio[0])} ≤ ${fx(trio[1])} ≤ ${fx(trio[2])}`)}를 만족시키는 함수 ${vf}: X → X의 개수는?`, hits(flags), {
        unit: '개',
        explain: `${jh(told(trio.map(fx)), '은/는')} X의 원소 중에서 중복을 허용하여 3개를 택해 작은 수부터 차례로 대응시키면 되므로 ${hT(p, 3)}(가지)이다. 조건이 없는 ${told(free.map(fx))}${free.length > 1 ? '는 각각' : '는'} X의 원소 ${p}개 가운데 하나이므로 ${free.length > 1 ? `${nPi(p, free.length)} = ${pw(p, free.length)} = ${b}` : p}(가지)이다. 따라서 ${a} × ${b} = ${hits(flags)}(개)이다.`,
        facts: { count: flags }
      });
    }),
    T('hfun-fixed', '함숫값 하나가 정해진 증가 함수', '②26', (d) => {
      const [m, k, v] = d.until(() => { const a = d.int(5, 7); return [a, d.int(2, a - 1), d.int(2, a - 1)]; }, ([a, b, c]) => nHr(c, b - 1) * nHr(a - c + 1, a - b) <= 9999);
      const left = nHr(v, k - 1), right = nHr(m - v + 1, m - k);
      return N(`집합 X = ${upto(m)}에 대하여 다음 조건을 모두 만족시키는 함수 ${vf}: X → X의 개수는?`, left * right, {
        unit: '개',
        figure: lines([`㈎ ${fx(k)} = ${v}`, `㈏ X의 임의의 두 원소 ${va}, ${vb}에 대하여 ${nb(`${va} &lt; ${vb}`)}이면 ${nb(`${fx(va)} ≤ ${fx(vb)}`)}`]),
        explain: `${k === 2 ? fx(1) : `${fx(1)}부터 ${fx(k - 1)}까지`}는 ${told(range(1, v))}에서 중복을 허용하여 ${k - 1}개를 택해 작은 수부터 대응시키므로 ${hT(v, k - 1)}(가지), ${k + 1 === m ? fx(m) : `${fx(k + 1)}부터 ${fx(m)}까지`}는 ${told(range(v, m))}에서 중복을 허용하여 ${m - k}개를 택하므로 ${hT(m - v + 1, m - k)}(가지)이다. 따라서 ${left} × ${right} = ${left * right}(개)이다.`,
        facts: { calc: [[`${hS(v, k - 1)}*${hS(m - v + 1, m - k)}`, 0]] }
      });
    })
  ];

  B.addGroup(UNIT, { id: 'hcomb', title: '중복조합 — 고르기와 나누어 주기', standard: S2, types: hcombTypes });
  B.addGroup(UNIT, { id: 'heq', title: '중복조합 — 방정식·부등식의 정수해', standard: S2, types: heqTypes });
  B.addGroup(UNIT, { id: 'hterm', title: '중복조합 — 다항식의 항의 개수', standard: S2, types: htermTypes });
  B.addGroup(UNIT, { id: 'hfun', title: '중복조합 — 크기 차례가 정해진 순서쌍·함수', standard: S2, types: hfunTypes });
})(typeof window !== 'undefined' ? window : globalThis);
