// 중학교 2학년 2학기 7단원 확률 — 뒤쪽 묶음(사건 A 또는 사건 B가 일어날 확률, 두 사건 A와 B가 동시에 일어날 확률, 연속하여 뽑는 경우의 확률, 도형에서의 확률).
// 단원 틀과 도구, 싣는 기준, 뺀 것과 까닭은 8-2-7a.js 에 있다. ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번, 심n = 심화꼴의 n번.
//  - 「또는」은 동시에 일어나지 않는 두 사건만 더한다(겹치는 두 조건은 실력에 한 유형). 「동시에」는 서로 영향을 주지 않는 두 사건의 확률을 곱한다.
//  - 한 번 곱하는 것, 일어나지 않을 확률을 한 번 쓰는 것, 두 갈래를 한 번 더하는 것(하나만 일어날 확률, 서로 다른 색, 같은 색)은 기본이다.
//  - 도형에서의 확률은 칸의 수의 비(등분한 원판, 색칠한 칸)와 넓이의 비(중심이 같은 원으로 나뉜 과녁)로 구한다. 돌 두 개를 던지는 꼴은 첫 번째와 두 번째를 밝혀 묻는다
//    (원문 은4-8은 「동시에」 던지고도 한 차례만 세어 답이 어긋났다).
// 묻는 말: 확률은 「~일 확률은?」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, name, nick, frac, table, C } = B.kit;
  const { range, lcm, Q, qadd, qmul, qcmp, tx, js, tail, nb, SG } = B.kit.mid;
  const G = B.kit.mgeo, K = B.kit.m827;
  const { T, sum, P, non, isP, DICE, pairsSaid, listSaid, red, two, mult, divOf, PRIME, ODD, EVEN, atLeast, atMost, TWO, ansP, kn, vf, PP, probs, wheelFig, wheelsFig, cellsFig, DOW, calendarFig, dayCount, bagsFig } = K;
  const WHEEL_NOTE = '(단, 바늘이 경계선을 가리키는 경우는 생각하지 않는다.)';
  // 흰 공과 검은 공이 든 두 주머니
  const twoBags = (d) => {
    const [w1, b1, w2, b2] = d.until(() => [d.int(2, 6), d.int(2, 6), d.int(2, 6), d.int(2, 6)], (v) => v[0] !== v[1] && v[2] !== v[3] && (v[0] !== v[2] || v[1] !== v[3]));
    return { w1, b1, w2, b2, n1: w1 + b1, n2: w2 + b2, lead: `주머니 A에는 흰 공 ${w1}개, 검은 공 ${b1}개가 들어 있고, 주머니 B에는 흰 공 ${w2}개, 검은 공 ${b2}개가 들어 있다. 두 주머니 A, B에서 공을 한 개씩 꺼낼 때` };
  };

  // ══ 사건 A 또는 사건 B가 일어날 확률 ══
  B.addTypes('8-2-7', 'or', [
    T('or-given', '두 확률을 주고 「또는」', '①41 ②44', (d) => {
      const [a, b] = d.until(() => [Q(d.int(1, 3), d.pick([3, 4, 5, 6, 8])), Q(d.int(1, 3), d.pick([4, 5, 6, 8, 10]))], ([x, y]) => isP(x) && isP(y) && x.q !== y.q && isP(qadd(x, y)) && qadd(x, y).q <= 40), s = qadd(a, b);
      const [x, y, lead] = d.pick([['팥빵', '크림빵', '어느 빵 상자에서 빵 한 개를 꺼낼 때'], ['딸기 맛 사탕', '포도 맛 사탕', '어느 사탕 상자에서 사탕 한 개를 꺼낼 때'], ['빨간 구슬', '파란 구슬', '여러 가지 색의 구슬이 들어 있는 주머니에서 구슬 한 개를 꺼낼 때']]);
      return ansP(`${lead}, ${josa(x, '이/가')} 나올 확률은 ${tx(a)}, ${josa(y, '이/가')} 나올 확률은 ${tx(b)}이다. 이때 ${x} 또는 ${josa(y, '이/가')} 나올 확률은?`, s, {
        explain: `${josa(x, '이/가')} 나오는 사건과 ${josa(y, '이/가')} 나오는 사건은 동시에 일어나지 않으므로 구하는 확률은 ${tx(a)} + ${tx(b)} = ${tx(s)}이다.`, facts: vf(`${js(a)}+${js(b)}`) });
    }),
    T('or-balls', '한 번 뽑기 — 동시에 일어나지 않는 두 수 조건', '①42 ②40', (d) => {
      const m = d.pick([15, 20, 24, 25, 30]), all = range(1, m);
      const [c1, c2] = d.until(() => d.shuffle([mult(4), mult(5), mult(6), mult(7), mult(9), divOf(14), divOf(25), divOf(9), PRIME, atMost(3), atLeast(m - 4)]).slice(0, 2), ([x, y]) => { const a = all.filter(x.ok), b = all.filter(y.ok); return a.length >= 2 && b.length >= 2 && !a.some(y.ok) && a.length + b.length <= m - 3; });
      const a = all.filter(c1.ok), b = all.filter(c2.ok);
      return ansP(`1부터 ${m}까지의 자연수가 하나씩 적힌 공 ${m}개가 들어 있는 주머니에서 공 한 개를 꺼낼 때, ${c1.n} 또는 ${c2.n}가 적힌 공이 나올 확률은?`, P(a.length + b.length, m), {
        explain: `${c1.n}는 ${listSaid(a, '개')}, ${c2.n}는 ${listSaid(b, '개')}이고 두 조건에 모두 맞는 수는 없다. 따라서 구하는 확률은 ${frac(a.length, m)} + ${frac(b.length, m)} = ${red(a.length + b.length, m)}이다.`, facts: { value: `${a.length}/${m}+${b.length}/${m}`, unseen: [a.length, b.length] } });
    }),
    T('or-bag', '한 번 뽑기 — 두 종류 가운데 하나', '①43 ②37', (d) => {
      const v = d.until(() => [d.int(2, 6), d.int(2, 6), d.int(2, 6)], (a) => new Set(a).size === 3), COL = ['빨간', '파란', '검은'], [i, j] = d.shuffle([0, 1, 2]).slice(0, 2), all = sum(v);
      return ansP(`빨간 볼펜 ${v[0]}자루, 파란 볼펜 ${v[1]}자루, 검은 볼펜 ${v[2]}자루가 들어 있는 필통에서 볼펜 한 자루를 꺼낼 때, ${COL[i]} 볼펜 또는 ${COL[j]} 볼펜이 나올 확률은?`, P(v[i] + v[j], all), {
        explain: `볼펜은 모두 ${all}자루이다. ${COL[i]} 볼펜이 나올 확률은 ${frac(v[i], all)}, ${COL[j]} 볼펜이 나올 확률은 ${frac(v[j], all)}이므로 구하는 확률은 ${frac(v[i], all)} + ${frac(v[j], all)} = ${red(v[i] + v[j], all)}이다.`, facts: { value: `(${v[i]}+${v[j]})/(${v.join('+')})` } });
    }),
    T('or-table', '조사한 표에서 두 항목 가운데 하나일 확률', '②38', (d) => {
      const S = d.pick([{ lead: '어느 반 학생들의 혈액형', head: '혈액형', items: ['A형', 'B형', 'O형', 'AB형'], ask: (x, y) => `그 학생의 혈액형이 ${x} 또는 ${y}일 확률은?` },
        { lead: '어느 반 학생들이 학교에 오는 방법', head: '방법', items: ['도보', '버스', '지하철', '자전거'], ask: (x, y) => `그 학생이 ${x} 또는 ${josa(y, '으로/로')} 학교에 오는 학생일 확률은? (단, 한 학생은 한 가지 방법으로만 학교에 온다.)` }]);
      const total = d.pick([28, 30, 32, 36]), v = d.until(() => { const a = [d.int(3, 13), d.int(3, 13), d.int(3, 13)]; return a.concat([total - sum(a)]); }, (a) => a[3] >= 3 && a[3] <= 13 && new Set(a).size === 4), [i, j] = d.shuffle([0, 1, 2, 3]).slice(0, 2).sort((x, y) => x - y);
      return ansP(`다음은 ${josa(S.lead, '을/를')} 조사하여 나타낸 표이다. 이 반 학생 중에서 한 명을 뽑을 때, ${S.ask(S.items[i], S.items[j])}`, P(v[i] + v[j], total), { figure: table([S.head, '학생 수(명)'], S.items.map((x, k) => [x, v[k]]).concat([['합계', total]])),
        explain: `표에서 ${josa(S.items[i], '은/는')} ${v[i]}명, ${josa(S.items[j], '은/는')} ${v[j]}명이고 전체 학생은 ${total}명이다. 한 학생이 두 항목에 함께 들지 않으므로 구하는 확률은 ${frac(v[i], total)} + ${frac(v[j], total)} = ${red(v[i] + v[j], total)}이다.`, facts: { value: `(${v[i]}+${v[j]})/${total}` } });
    }),
    T('or-calendar', '달력에서 정한 두 요일 가운데 하루를 고를 확률', '②39', (d) => {
      const [month, days] = d.pick([[3, 31], [4, 30], [6, 30], [7, 31], [8, 31], [9, 30], [11, 30], [12, 31]]), first = d.int(0, 6), [a, b] = d.shuffle(range(0, 6)).slice(0, 2).sort((x, y) => x - y), ca = dayCount(first, days, a), cb = dayCount(first, days, b);
      return ansP(`다음은 어느 해 ${month}월의 달력이다. 이 달력에서 하루를 고를 때, 고른 날이 ${DOW[a]}요일 또는 ${DOW[b]}요일일 확률은?`, P(ca + cb, days), { figure: calendarFig(month, first, days),
        explain: `날짜는 모두 ${days}일이고 ${DOW[a]}요일은 ${ca}일, ${DOW[b]}요일은 ${cb}일이다. 따라서 구하는 확률은 ${frac(ca, days)} + ${frac(cb, days)} = ${red(ca + cb, days)}이다.`, facts: { value: `(${ca}+${cb})/${days}`, unseen: [ca, cb] } });
    }),
    T('or-reciprocal', '눈의 수의 역수가 정수 또는 유한소수일 확률', '①8 ②42', (d) => {
      const [m, solid] = d.pick([[8, '정팔면체'], [12, '정십이면체'], [20, '정이십면체']]), fin = (v) => { let x = v; while (x % 2 === 0) x /= 2; while (x % 5 === 0) x /= 5; return x === 1; }, hit = range(2, m).filter(fin);
      // 다른 길: 2와 5만을 소인수로 갖는 수(1 포함)를 곱해 가며 센다.
      let other = 0; for (let x = 1; x <= m; x *= 2) for (let y = x; y <= m; y *= 5) other += 1;
      return ansP(`각 면에 1부터 ${m}까지의 자연수가 하나씩 적힌 ${solid} 모양의 주사위를 한 번 던질 때, 나오는 눈의 수의 역수가 정수 또는 유한소수일 확률은?`, P(hit.length + 1, m), {
        explain: `역수가 정수인 눈의 수는 1의 1가지이다. 역수가 유한소수이려면 눈의 수의 소인수가 2나 5뿐이어야 하므로 ${listSaid(hit)}이다. 따라서 구하는 확률은 ${frac(1, m)} + ${frac(hit.length, m)} = ${red(hit.length + 1, m)}이다.`, facts: kn(other, m) });
    }),
    T('or-dice', '두 주사위 — 합·곱이 「A 또는 B」', '①45·46 ②43 심5', (d, n) => {
      const add = (a, b) => a + b, mul = (a, b) => a * b, of = (f, v) => DICE.filter(([a, b]) => f(a, b) === v);
      if (n === 1) {
        // 합이 k의 배수 → 합의 값으로 갈라 센다.
        const k = d.int(3, 6), sums = range(2, 12).filter((s) => s % k === 0), parts = sums.map((s) => of(add, s).length), total = sum(parts);
        return ansP(`${TWO}, 나오는 두 눈의 수의 합이 ${k}의 배수일 확률은?`, P(total, 36), {
          explain: `두 눈의 수의 합이 ${k}의 배수인 경우는 합이 ${sums.join(', ')}인 경우이다. ${sums.map((s, i) => `합이 ${s}인 경우는 ${parts[i]}가지`).join(', ')}이므로 구하는 확률은 ${parts.map((p) => frac(p, 36)).join(' + ')} = ${red(total, 36)}이다.`, facts: kn(sum(sums.map((s) => 6 - Math.abs(7 - s))), 36) });
      }
      const f = n === 0 ? add : mul, word = n === 0 ? '합' : '곱';
      const [a, b] = d.until(() => d.shuffle(n === 0 ? [3, 4, 5, 6, 7, 8, 9, 10, 11] : [4, 6, 8, 10, 12, 15, 18, 20, 24, 30]).slice(0, 2).sort((x, y) => x - y), ([x, y]) => of(f, x).length + of(f, y).length >= 4), ha = of(f, a), hb = of(f, b);
      return ansP(`${TWO}, 나오는 두 눈의 수의 ${word}이 ${a} 또는 ${b}일 확률은?`, P(ha.length + hb.length, 36), {
        explain: `${word}이 ${a}인 경우는 ${pairsSaid(ha)}, ${word}이 ${b}인 경우는 ${pairsSaid(hb)}이고 두 사건은 동시에 일어나지 않는다. 따라서 구하는 확률은 ${frac(ha.length, 36)} + ${frac(hb.length, 36)} = ${red(ha.length + hb.length, 36)}이다.`, facts: kn(ha.length + hb.length, 36) });
    }, { count: 3 }),
    T('or-dice-number', '두 주사위의 눈으로 만든 두 자리 수가 「A 또는 B」', '②17', (d) => {
      const lo = d.pick([20, 30, 40]), hi = d.until(() => d.pick([30, 40, 50]), (v) => v > lo), [k1, k2] = d.bool() ? ['짝수', '홀수'] : ['홀수', '짝수'], par = (v, kind) => (v % 2 === 1) === (kind === '홀수');
      const all = DICE.map(([a, b]) => 10 * a + b), ha = all.filter((v) => v <= lo && par(v, k1)), hb = all.filter((v) => v >= hi && par(v, k2));
      return ansP(`빨간 주사위와 파란 주사위를 동시에 던져 빨간 주사위에서 나온 눈의 수를 십의 자리의 숫자, 파란 주사위에서 나온 눈의 수를 일의 자리의 숫자로 하는 두 자리 자연수를 만들 때, 만든 수가 ${lo} 이하의 ${k1} 또는 ${hi} 이상의 ${k2}일 확률은?`, P(ha.length + hb.length, 36), {
        explain: `만들 수 있는 수는 36개이다. ${lo} 이하의 ${k1}는 ${listSaid(ha, '개')}, ${hi} 이상의 ${k2}는 ${listSaid(hb, '개')}이므로 구하는 확률은 ${frac(ha.length, 36)} + ${frac(hb.length, 36)} = ${red(ha.length + hb.length, 36)}이다.`, facts: kn((lo / 10 - 1) * 3 + (7 - hi / 10) * 3, 36) });
    }),
    T('or-two-bags', '두 주머니에서 하나씩 꺼낸 수의 합이 「A 또는 B」', '②10', (d) => {
      const a0 = d.int(0, 2), b0 = d.int(a0 + 2, a0 + 4), As = range(a0, a0 + 2), Bs = range(b0, b0 + 3), all = []; for (const a of As) for (const b of Bs) all.push([a, b]);
      const s = d.int(a0 + b0 + 1, a0 + b0 + 3), h1 = all.filter(([a, b]) => a + b === s), h2 = all.filter(([a, b]) => a + b === s + 1);
      return ansP(`다음 그림과 같이 수가 하나씩 적힌 공이 들어 있는 두 주머니 A, B에서 공을 한 개씩 꺼낼 때, 꺼낸 두 공에 적힌 수의 합이 ${s} 또는 ${s + 1}일 확률은?`, P(h1.length + h2.length, 12), { figure: bagsFig([{ name: 'A', balls: As }, { name: 'B', balls: Bs }]),
        explain: `모든 경우의 수는 3 × 4 = 12이다. (A의 수, B의 수)로 나타내면 합이 ${s}인 경우는 ${pairsSaid(h1)}, 합이 ${s + 1}인 경우는 ${pairsSaid(h2)}이므로 구하는 확률은 ${frac(h1.length, 12)} + ${frac(h2.length, 12)} = ${red(h1.length + h2.length, 12)}이다.`, facts: kn(h1.length + h2.length, 12) });
    }),
    T('or-neither', '어느 쪽의 배수도 아닌 수가 나올 확률', '①30', (d) => {
      const [m, a, b] = d.until(() => [d.pick([20, 24, 25, 30]), d.int(4, 9), d.int(5, 9)], ([m0, a0, b0]) => a0 < b0 && lcm(a0, b0) > m0 && Math.floor(m0 / b0) >= 2), ka = Math.floor(m / a), kb = Math.floor(m / b), rest = range(1, m).filter((v) => v % a !== 0 && v % b !== 0).length;
      return ansP(`1부터 ${m}까지의 자연수가 하나씩 적힌 ${m}장의 카드 중에서 한 장을 뽑을 때, ${a}의 배수도 아니고 ${b}의 배수도 아닌 수가 적힌 카드가 나올 확률은?`, P(rest, m), {
        explain: `${a}의 배수는 ${ka}개, ${b}의 배수는 ${kb}개이고 ${m} 이하의 수 중에 두 수의 공배수는 없다. ${a}의 배수 또는 ${b}의 배수가 나올 확률은 ${frac(ka, m)} + ${frac(kb, m)} = ${red(ka + kb, m)}이므로 구하는 확률은 1 − ${tx(P(ka + kb, m))} = ${tx(P(rest, m))}이다.`, facts: vf(`1-(${ka}/${m}+${kb}/${m})`, [ka, kb]) });
    })
  ]);

  // ══ 두 사건 A와 B가 동시에 일어날 확률 ══
  const DIE_CONDS = [EVEN, ODD, mult(3), PRIME, divOf(6), divOf(4), atLeast(5), atMost(2), atMost(4)];
  const eyes = (c) => range(1, 6).filter(c.ok).length;
  B.addTypes('8-2-7', 'and', [
    T('and-coin-die', '동전과 주사위', '①47 ②45', (d) => {
      const side = d.pick(['앞면', '뒷면']), c = d.pick(DIE_CONDS), k = eyes(c), ans = qmul(P(1, 2), P(k, 6));
      return ansP(`동전 한 개와 주사위 한 개를 동시에 던질 때, 동전은 ${side}이 나오고 주사위는 ${c.eye}이 나올 확률은?`, ans, {
        explain: `동전의 ${side}이 나올 확률은 ${frac(1, 2)}, 주사위의 ${c.eye}이 나올 확률은 ${red(k, 6)}이다. 두 사건은 서로 영향을 주지 않으므로 구하는 확률은 ${frac(1, 2)} × ${tx(P(k, 6))} = ${tx(ans)}이다.`, facts: { value: `(1/2)*(${k}/6)`, unseen: [1, 2, k, 6] } });
    }),
    T('and-dice-two', '두 주사위가 저마다의 조건을 만족시킬 확률', '①48 ②46 심33', (d) => {
      const [c1, c2] = d.shuffle(DIE_CONDS).slice(0, 2), k1 = eyes(c1), k2 = eyes(c2), hit = DICE.filter(([a, b]) => c1.ok(a) && c2.ok(b)).length;
      return ansP(`두 개의 주사위 A, B를 동시에 던질 때, 주사위 A는 ${c1.eye}이 나오고 주사위 B는 ${c2.eye}이 나올 확률은?`, P(hit, 36), {
        explain: `주사위 A에서 ${c1.eye}이 나올 확률은 ${red(k1, 6)}, 주사위 B에서 ${c2.eye}이 나올 확률은 ${red(k2, 6)}이다. 두 사건은 서로 영향을 주지 않으므로 구하는 확률은 ${tx(P(k1, 6))} × ${tx(P(k2, 6))} = ${tx(P(hit, 36))}이다.`, facts: { value: `(${k1}/6)*(${k2}/6)`, unseen: [k1, k2, 6] } });
    }),
    T('and-both', '두 사람이 모두 성공할 확률', '①49 ②50', (d) => {
      const [A, Bn] = two(d), [p, q] = probs(d, 2), ans = qmul(p, q), a = name(A, '이/가'), b = name(Bn, '이/가');
      const text = d.pick([`어떤 시험에서 ${a} 합격할 확률은 ${tx(p)}, ${b} 합격할 확률은 ${tx(q)}이다. 두 사람이 모두 합격할 확률은?`, `${a} 어떤 문제를 맞힐 확률은 ${tx(p)}, ${b} 이 문제를 맞힐 확률은 ${tx(q)}이다. 두 사람이 모두 이 문제를 맞힐 확률은?`,
        `${a} 자유투를 성공할 확률은 ${tx(p)}, ${b} 자유투를 성공할 확률은 ${tx(q)}이다. 두 사람이 자유투를 한 번씩 던질 때, 두 사람 모두 성공할 확률은?`]);
      return ansP(text, ans, { explain: `두 사람의 결과는 서로 영향을 주지 않으므로 구하는 확률은 ${tx(p)} × ${tx(q)} = ${tx(ans)}이다.`, facts: vf(`${js(p)}*${js(q)}`) });
    }),
    T('and-one-not', '한쪽은 일어나고 다른 쪽은 일어나지 않을 확률', '①53 ②50·52 심34', (d) => {
      // 확률을 백분율로 준다(분수로 고쳐 계산한다).
      const [a, b] = d.until(() => [d.pick([20, 30, 40, 60, 70, 80]), d.pick([20, 25, 40, 50, 60, 75])], ([x, y]) => x !== y), k = d.int(0, 1), p = P(a, 100), q = P(b, 100), ans = qmul(p, non(q));
      const text = [`해바라기 씨앗의 싹이 날 확률은 ${a} %, 봉숭아 씨앗의 싹이 날 확률은 ${b} %이다. 두 씨앗을 한 개씩 심을 때, 해바라기 씨앗은 싹이 나고 봉숭아 씨앗은 싹이 나지 않을 확률은?`, `어느 지역에 토요일에 비가 올 확률은 ${a} %, 일요일에 비가 올 확률은 ${b} %이다. 토요일에는 비가 오고 일요일에는 비가 오지 않을 확률은?`][k];
      const what = ['봉숭아 씨앗의 싹이 나지 않을', '일요일에 비가 오지 않을'][k];
      return ansP(text, ans, { explain: `${a} % = ${tx(p)}, ${b} % = ${tx(q)}이다. ${what} 확률은 1 − ${tx(q)} = ${tx(non(q))}이므로 구하는 확률은 ${tx(p)} × ${tx(non(q))} = ${tx(ans)}이다.`, facts: vf(`(${a}/100)*(1-${b}/100)`) });
    }),
    T('and-neither', '둘 다 일어나지 않을 확률', '①54 ②50', (d) => {
      const [A, Bn] = two(d), [p, q] = probs(d, 2), ans = qmul(non(p), non(q));
      return ansP(`${name(A, '이/가')} 화살을 쏘아 과녁을 맞힐 확률은 ${tx(p)}, ${name(Bn, '이/가')} 과녁을 맞힐 확률은 ${tx(q)}이다. 두 사람이 화살을 한 번씩 쏠 때, 두 사람 모두 과녁을 맞히지 못할 확률은?`, ans, {
        explain: `${name(A, '이/가')} 맞히지 못할 확률은 1 − ${tx(p)} = ${tx(non(p))}, ${name(Bn, '이/가')} 맞히지 못할 확률은 1 − ${tx(q)} = ${tx(non(q))}이므로 구하는 확률은 ${tx(non(p))} × ${tx(non(q))} = ${tx(ans)}이다.`, facts: vf(`(1-${js(p)})*(1-${js(q)})`) });
    }),
    T('and-from-fail', '실패할 확률을 주고 둘 다 성공할 확률', '②51', (d) => {
      const [A, Bn] = two(d), [m, n] = d.until(() => [d.int(4, 10), d.int(4, 10)], ([x, y]) => x !== y), p = P(1, m), q = P(1, n), ans = qmul(non(p), non(q));
      return ansP(`${name(A, '과/와')} ${name(Bn, '이/가')} 만나기로 약속하였다. ${name(A, '이/가')} 약속을 지키지 않을 확률은 ${tx(p)}, ${name(Bn, '이/가')} 약속을 지키지 않을 확률은 ${tx(q)}일 때, 두 사람이 만날 확률은?`, ans, {
        explain: `두 사람이 만나려면 두 사람 모두 약속을 지켜야 한다. 약속을 지킬 확률은 각각 1 − ${tx(p)} = ${tx(non(p))}, 1 − ${tx(q)} = ${tx(non(q))}이므로 구하는 확률은 ${tx(non(p))} × ${tx(non(q))} = ${tx(ans)}이다.`, facts: vf(`(1-${js(p)})*(1-${js(q)})`) });
    }),
    T('and-repeat', '같은 일을 세 번 되풀이할 때 모두 성공할 확률', '①50 ②53', (d) => {
      const p = d.pick([Q(2, 3), Q(3, 4), Q(1, 5), Q(2, 5), Q(3, 5), Q(4, 5), Q(1, 2), Q(1, 3)]), ans = qmul(p, qmul(p, p));
      const text = d.pick([`자유투를 한 번 던져 성공할 확률이 ${tx(p)}인 농구 선수가 자유투를 세 번 던질 때, 세 번 모두 성공할 확률은?`, `한 타석에서 안타를 칠 확률이 ${tx(p)}인 야구 선수가 세 번의 타석에서 모두 안타를 칠 확률은?`]);
      return ansP(text, ans, { explain: `매번의 결과는 서로 영향을 주지 않으므로 구하는 확률은 ${tx(p)} × ${tx(p)} × ${tx(p)} = ${tx(ans)}이다.`, facts: vf(`${js(p)}*${js(p)}*${js(p)}`) });
    }),
    T('and-rate', '횟수의 비율로 확률을 정해 곱하기', '①51', (d) => {
      const [A, Bn] = two(d), [a, b] = d.until(() => [d.int(1, 5), d.int(1, 5)], ([x, y]) => x !== y), both = d.bool(), p = P(a, 10), q = P(b, 10), pa = both ? p : non(p), pb = both ? q : non(q), ans = qmul(pa, pb);
      return ansP(`${name(A, '은/는')} 10번에 ${a}번꼴로, ${name(Bn, '은/는')} 10번에 ${b}번꼴로 약속 시간에 늦는다. 두 사람이 만나기로 약속한 날, 두 사람 모두 약속 시간에 ${both ? '늦을' : '늦지 않을'} 확률은?`, ans, {
        explain: `${name(A, '이/가')} 늦을 확률은 ${red(a, 10)}, ${name(Bn, '이/가')} 늦을 확률은 ${red(b, 10)}이다. ${both ? '따라서 ' : `늦지 않을 확률은 각각 1 − ${tx(p)} = ${tx(pa)}, 1 − ${tx(q)} = ${tx(pb)}이므로 `}구하는 확률은 ${tx(pa)} × ${tx(pb)} = ${tx(ans)}이다.`,
        facts: vf(both ? `(${a}/10)*(${b}/10)` : `(1-${a}/10)*(1-${b}/10)`) });
    }),
    T('and-two-bags', '두 주머니에서 하나씩 — 둘 다 지정한 색', '①52 ②47·49', (d) => {
      const g = twoBags(d), white = d.bool(), col = white ? '흰' : '검은', k1 = white ? g.w1 : g.b1, k2 = white ? g.w2 : g.b2, ans = qmul(P(k1, g.n1), P(k2, g.n2));
      return ansP(`${g.lead}, 두 공이 모두 ${col} 공일 확률은?`, ans, {
        explain: `주머니 A에서 ${col} 공이 나올 확률은 ${red(k1, g.n1)}, 주머니 B에서 ${col} 공이 나올 확률은 ${red(k2, g.n2)}이므로 구하는 확률은 ${tx(P(k1, g.n1))} × ${tx(P(k2, g.n2))} = ${tx(ans)}이다.`,
        facts: { value: `(${k1}/(${g.w1}+${g.b1}))*(${k2}/(${g.w2}+${g.b2}))` } });
    }),
    T('and-rps', '가위바위보를 거듭할 때의 확률', '②54·65', (d) => {
      const [A, Bn] = two(d), k = d.int(0, 2), third = frac(1, 3);
      const ask = ['두 번 할 때, 첫 번째에는 비기고 두 번째에는 승부가 결정될 확률', `두 번 할 때, 첫 번째에는 ${name(A, '이/가')} 이기고 두 번째에는 비길 확률`, '세 번 할 때, 처음 두 번은 비기고 세 번째에 승부가 결정될 확률'][k];
      const parts = [[3, 6], [3, 3], [3, 3, 6]][k], ans = parts.reduce((x, v) => qmul(x, P(v, 9)), Q(1));
      const why = [`비길 확률은 ${frac(3, 9)} = ${third}, 승부가 결정될 확률은 1 − ${third} = ${frac(2, 3)}`, `${name(A, '이/가')} 이길 확률은 ${frac(3, 9)} = ${third}, 비길 확률도 ${third}`, `비길 확률은 ${frac(3, 9)} = ${third}, 승부가 결정될 확률은 1 − ${third} = ${frac(2, 3)}`][k];
      return ansP(`${name(A, '과/와')} ${name(Bn, '이/가')} 가위바위보를 ${ask}은?`, ans, { explain: `가위바위보를 한 번 할 때 ${why}이다. 따라서 구하는 확률은 ${parts.map((v) => tx(P(v, 9))).join(' × ')} = ${tx(ans)}이다.`, facts: { value: parts.map((v) => `(${v}/9)`).join('*'), unseen: [3, 6, 9] } });
    }),
    T('and-atleast', '적어도 한 사람은 성공할 확률', '①37·39 ②56 심28', (d) => {
      const [A, Bn] = two(d), [p, q] = probs(d, 2), none = qmul(non(p), non(q)), ans = non(none);
      return ansP(`${name(A, '이/가')} 어떤 문제를 맞힐 확률은 ${tx(p)}, ${name(Bn, '이/가')} 이 문제를 맞힐 확률은 ${tx(q)}이다. 두 사람이 이 문제를 풀 때, 적어도 한 사람은 문제를 맞힐 확률은?`, ans, {
        explain: `두 사람 모두 맞히지 못할 확률은 (1 − ${tx(p)}) × (1 − ${tx(q)}) = ${tx(non(p))} × ${tx(non(q))} = ${tx(none)}이므로 구하는 확률은 1 − ${tx(none)} = ${tx(ans)}이다.`, facts: vf(`1-(1-${js(p)})*(1-${js(q)})`) });
    }),
    T('and-not-both', '둘 다 해야 이루어지는 일이 이루어지지 않을 확률', '①40 ②55 심29', (d) => {
      const [A, Bn] = two(d), [p, q] = probs(d, 2), both = qmul(p, q), ans = non(both);
      return ansP(`${name(A, '과/와')} ${name(Bn, '이/가')} 한 모둠이 되어 저마다 문제를 하나씩 푼다. ${name(A, '이/가')} 문제를 맞힐 확률은 ${tx(p)}, ${name(Bn, '이/가')} 문제를 맞힐 확률은 ${tx(q)}이고, 두 사람이 모두 맞혀야 모둠이 다음 단계로 간다. 이 모둠이 다음 단계로 가지 못할 확률은?`, ans, {
        explain: `모둠이 다음 단계로 갈 확률은 ${tx(p)} × ${tx(q)} = ${tx(both)}이므로 가지 못할 확률은 1 − ${tx(both)} = ${tx(ans)}이다.`, facts: vf(`1-${js(p)}*${js(q)}`) });
    }),
    T('and-only-one', '두 일 가운데 하나만 일어날 확률', '①57·71 ②57·58 심36', (d, n) => {
      if (n === 0) {
        // 확률이 다른 두 일
        const [p, q] = probs(d, 2), x = qmul(p, non(q)), y = qmul(non(p), q), ans = qadd(x, y), k = d.int(0, 1);
        const text = [`어느 지역에 내일 비가 올 확률은 ${tx(p)}, 모레 비가 올 확률은 ${tx(q)}이다. 내일과 모레 중 하루만 비가 올 확률은?`, `어떤 시험에서 A가 합격할 확률은 ${tx(p)}, B가 합격할 확률은 ${tx(q)}이다. A, B 두 사람 중 한 사람만 합격할 확률은?`][k], [u, v] = [['내일만 비가 올', '모레만 비가 올'], ['A만 합격할', 'B만 합격할']][k];
        return ansP(text, ans, { explain: `${u} 확률은 ${tx(p)} × (1 − ${tx(q)}) = ${tx(x)}, ${v} 확률은 (1 − ${tx(p)}) × ${tx(q)} = ${tx(y)}이다. 두 사건은 동시에 일어나지 않으므로 구하는 확률은 ${tx(x)} + ${tx(y)} = ${tx(ans)}이다.`, facts: vf(`${js(p)}*(1-${js(q)})+(1-${js(p)})*${js(q)}`) });
      }
      // 같은 일을 두 번 할 때 한 번만(차례가 둘이다)
      const a = d.pick([20, 30, 40, 60, 70, 80]), p = P(a, 100), x = qmul(p, non(p)), ans = qadd(x, x);
      return ansP(`한 타석에서 안타를 칠 확률이 ${a} %인 야구 선수가 두 번의 타석에서 한 번만 안타를 칠 확률은?`, ans, {
        explain: `${a} % = ${tx(p)}이다. 첫 번째 타석에서만 안타를 칠 확률은 ${tx(p)} × (1 − ${tx(p)}) = ${tx(x)}이고, 두 번째 타석에서만 안타를 칠 확률도 (1 − ${tx(p)}) × ${tx(p)} = ${tx(x)}이다. 따라서 구하는 확률은 ${tx(x)} + ${tx(x)} = ${tx(ans)}이다.`, facts: vf(`2*(${a}/100)*(1-${a}/100)`, [2]) });
    }, { count: 2 }),
    T('and-bags-differ', '두 주머니에서 하나씩 꺼낼 때 색이 다를(같을) 확률', '①56 ②59', (d) => {
      const g = twoBags(d), same = d.bool(), x = same ? qmul(P(g.w1, g.n1), P(g.w2, g.n2)) : qmul(P(g.w1, g.n1), P(g.b2, g.n2)), y = same ? qmul(P(g.b1, g.n1), P(g.b2, g.n2)) : qmul(P(g.b1, g.n1), P(g.w2, g.n2)), ans = qadd(x, y);
      const told = same ? `두 공이 모두 흰 공일 확률은 ${frac(g.w1, g.n1)} × ${frac(g.w2, g.n2)} = ${tx(x)}, 모두 검은 공일 확률은 ${frac(g.b1, g.n1)} × ${frac(g.b2, g.n2)} = ${tx(y)}`
        : `A에서 흰 공, B에서 검은 공이 나올 확률은 ${frac(g.w1, g.n1)} × ${frac(g.b2, g.n2)} = ${tx(x)}, A에서 검은 공, B에서 흰 공이 나올 확률은 ${frac(g.b1, g.n1)} × ${frac(g.w2, g.n2)} = ${tx(y)}`;
      const hit = same ? g.w1 * g.w2 + g.b1 * g.b2 : g.w1 * g.b2 + g.b1 * g.w2;
      return ansP(`${g.lead}, 두 공의 색이 서로 ${same ? '같을' : '다를'} 확률은?`, ans, { explain: `${told}이다. 따라서 구하는 확률은 ${tx(x)} + ${tx(y)} = ${tx(ans)}이다.`, facts: kn(hit, g.n1 * g.n2) });
    }),
    T('and-two-branches', '동전의 면에 따라 주사위의 조건이 다른 두 갈래', '①55', (d) => {
      const [c1, c2] = d.shuffle([mult(3), PRIME, EVEN, divOf(4), atLeast(5), divOf(6)]).slice(0, 2), k1 = eyes(c1), k2 = eyes(c2), x = qmul(P(1, 2), P(k1, 6)), y = qmul(P(1, 2), P(k2, 6)), ans = qadd(x, y);
      return ansP(`동전 한 개와 주사위 한 개를 동시에 던질 때, 동전은 앞면이 나오고 주사위는 ${c1.eye}이 나오거나, 동전은 뒷면이 나오고 주사위는 ${c2.eye}이 나올 확률은?`, ans, {
        explain: `동전은 앞면, 주사위는 ${c1.eye}이 나올 확률은 ${frac(1, 2)} × ${tx(P(k1, 6))} = ${tx(x)}이고, 동전은 뒷면, 주사위는 ${c2.eye}이 나올 확률은 ${frac(1, 2)} × ${tx(P(k2, 6))} = ${tx(y)}이다. 두 사건은 동시에 일어나지 않으므로 구하는 확률은 ${tx(x)} + ${tx(y)} = ${tx(ans)}이다.`, facts: kn(k1 + k2, 12) });
    }),
    T('and-back', '확률에 맞는 상자의 공 개수 고르기', '심39', (d) => {
      // 곱에서 한쪽 확률을 되구한다: (A에서 노란 공일 확률) × (B에서 노란 공일 확률) = (주어진 확률)
      const [b, y] = d.until(() => [d.int(2, 8), d.int(2, 6)], ([b0, y0]) => Q(y0, b0 + y0).q <= 4), pa = Q(y, b + y);
      const pb = d.until(() => d.pick(PP), (x) => x.q <= 6 && new Set([x, qmul(pa, x), pa, non(x)].map((v) => v.p + '/' + v.q)).size === 4 && qmul(pa, x).q <= 12), joint = qmul(pa, pb);
      // 보기의 노란 공의 비율: pb(답) / joint(주어진 확률을 그대로 B 상자의 것으로 여긴다) / pa(A 상자와 같다고 여긴다) / 1 − pb(파란 공의 비율로 맞춘다)
      const box = (x) => { const t = x.q * d.until(() => d.int(1, 4), (k) => x.q * k >= 4 && x.q * k <= 24), yellow = t * x.p / x.q; return `파란 공 ${t - yellow}개, 노란 공 ${yellow}개`; };
      const opts = d.shuffle([pb, joint, pa, non(pb)]), at = opts.indexOf(pb), shown = opts.map(box);
      return C(`상자 A에는 파란 공 ${b}개, 노란 공 ${y}개가 들어 있다. 두 상자 A, B에서 공을 한 개씩 꺼낼 때 두 공이 모두 노란 공일 확률이 ${tx(joint)}이다. 다음 중 상자 B에 들어 있는 공으로 알맞은 것은?`, shown, at, {
        explain: `상자 A에서 노란 공이 나올 확률은 ${red(y, b + y)}이다. 상자 B에서 노란 공이 나올 확률은 ${tx(joint)} ÷ ${tx(pa)} = ${tx(pb)}이어야 하므로, 노란 공이 전체의 ${tx(pb)}인 「${shown[at]}」가 알맞다.`, facts: { truth: opts.map((x) => qcmp(qmul(pa, x), joint) === 0), want: true } });
    })
  ]);

  // ══ 연속하여 뽑는 경우의 확률 ══
  B.addTypes('8-2-7', 'draw', [
    T('draw-both', '연속하여 두 번 꺼낼 때 둘 다 지정한 색', '①62·63', (d, n) => {
      // 차례 0: 꺼낸 것을 다시 넣는다. 차례 1: 다시 넣지 않는다(두 번째에는 전체 개수와 남은 개수가 하나씩 줄어든다).
      const [w, b] = d.until(() => [d.int(2, 6), d.int(2, 6)], ([x, y]) => x !== y), all = w + b, white = d.bool(), k = white ? w : b, col = white ? '흰' : '검은', lead = `흰 공 ${w}개, 검은 공 ${b}개가 들어 있는 주머니에서`;
      if (n === 0) {
        const ans = qmul(P(k, all), P(k, all));
        return ansP(`${lead} 공 한 개를 꺼내 색을 확인하고 다시 넣은 다음 공 한 개를 또 꺼낼 때, 두 번 모두 ${col} 공이 나올 확률은?`, ans, {
          explain: `꺼낸 공을 다시 넣으므로 두 번 모두 ${all}개 중에서 꺼낸다. ${col} 공이 나올 확률은 매번 ${red(k, all)}이므로 구하는 확률은 ${tx(P(k, all))} × ${tx(P(k, all))} = ${tx(ans)}이다.`, facts: { value: `(${k}/(${w}+${b}))*(${k}/(${w}+${b}))` } });
      }
      const ans = qmul(P(k, all), P(k - 1, all - 1));
      return ansP(`${lead} 공을 한 개씩 연속하여 두 번 꺼낼 때, 두 번 모두 ${col} 공이 나올 확률은? (단, 꺼낸 공은 다시 넣지 않는다.)`, ans, {
        explain: `첫 번째에 ${col} 공이 나올 확률은 ${red(k, all)}이다. 꺼낸 공을 다시 넣지 않으므로 두 번째에는 남은 ${all - 1}개 중 ${col} 공이 ${k - 1}개이고 그 확률은 ${red(k - 1, all - 1)}이다. 따라서 구하는 확률은 ${tx(P(k, all))} × ${tx(P(k - 1, all - 1))} = ${tx(ans)}이다.`, facts: vf(`(${k}/(${w}+${b}))*((${k}-1)/(${w}+${b}-1))`) });
    }, { count: 2 }),
    T('draw-three', '다시 넣지 않고 세 번 — 모두 당첨', '①64', (d) => {
      const [n, k] = d.until(() => [d.int(7, 10), d.int(3, 5)], ([n0, k0]) => k0 < n0 - 2), ans = Q(k * (k - 1) * (k - 2), n * (n - 1) * (n - 2));
      return ansP(`${n}개의 제비 중에 당첨 제비가 ${k}개 들어 있다. 세 사람이 차례로 제비를 한 개씩 뽑을 때, 세 사람 모두 당첨 제비를 뽑을 확률은? (단, 뽑은 제비는 다시 넣지 않는다.)`, ans, {
        explain: `뽑은 제비를 다시 넣지 않으므로 뽑을 때마다 전체 제비와 당첨 제비가 하나씩 줄어든다. 구하는 확률은 ${frac(k, n)} × ${frac(k - 1, n - 1)} × ${frac(k - 2, n - 2)} = ${tx(ans)}이다.`, facts: vf(`(${k}/${n})*((${k}-1)/(${n}-1))*((${k}-2)/(${n}-2))`, [2]) });
    }),
    T('draw-one-only', '차례로 뽑을 때 한 사람만 당첨', '①70 ②61·62 심43', (d, n) => {
      // 차례 0: 다시 넣는다(앞사람은 당첨, 뒷사람은 아님). 차례 1: 다시 넣지 않는다(뒷사람만 당첨 — 전체는 줄고 당첨 제비는 그대로다).
      const [A, Bn] = two(d), [m, k] = d.until(() => [d.pick([8, 10, 12, 15, 20]), d.int(2, 5)], ([m0, k0]) => k0 * 2 < m0), lead = `${m}개의 제비 중에 당첨 제비가 ${k}개 들어 있다.`;
      if (n === 0) {
        const ans = qmul(P(k, m), P(m - k, m));
        return ansP(`${lead} ${name(A, '이/가')} 제비 한 개를 뽑아 확인하고 다시 넣은 다음 ${name(Bn, '이/가')} 제비 한 개를 뽑을 때, ${name(A, '은/는')} 당첨 제비를 뽑고 ${name(Bn, '은/는')} 당첨 제비를 뽑지 못할 확률은?`, ans, {
          explain: `뽑은 제비를 다시 넣으므로 두 사람 모두 ${m}개 중에서 뽑는다. ${name(A, '이/가')} 당첨 제비를 뽑을 확률은 ${red(k, m)}, ${name(Bn, '이/가')} 당첨 제비를 뽑지 못할 확률은 ${red(m - k, m)}이므로 구하는 확률은 ${tx(P(k, m))} × ${tx(P(m - k, m))} = ${tx(ans)}이다.`, facts: vf(`(${k}/${m})*(1-${k}/${m})`) });
      }
      const ans = qmul(P(m - k, m), P(k, m - 1));
      return ansP(`${lead} ${name(A, '이/가')} 먼저 한 개를 뽑고 이어서 ${name(Bn, '이/가')} 한 개를 뽑을 때, ${nick(Bn)}만 당첨 제비를 뽑을 확률은? (단, 뽑은 제비는 다시 넣지 않는다.)`, ans, {
        explain: `${name(A, '이/가')} 당첨 제비를 뽑지 못할 확률은 ${red(m - k, m)}이다. 이때 남은 ${m - 1}개 중 당첨 제비는 그대로 ${k}개이므로 ${name(Bn, '이/가')} 당첨 제비를 뽑을 확률은 ${red(k, m - 1)}이다. 따라서 구하는 확률은 ${tx(P(m - k, m))} × ${tx(P(k, m - 1))} = ${tx(ans)}이다.`, facts: vf(`((${m}-${k})/${m})*(${k}/(${m}-1))`) });
    }, { count: 2 }),
    T('draw-same-color', '다시 넣지 않고 두 번 꺼낼 때 같은(다른) 색일 확률', '①65·66 ②63 심44', (d) => {
      // 「서로 다를」은 한 사람만 당첨 제비를 뽑는 꼴(심44)과 같은 일이다: 차례가 둘이고, 두 번째에는 전체 개수가 하나 줄어든다.
      const [r, b] = d.until(() => [d.int(2, 6), d.int(2, 6)], ([x, y]) => x !== y), all = r + b, same = d.bool();
      const x = same ? qmul(P(r, all), P(r - 1, all - 1)) : qmul(P(r, all), P(b, all - 1)), y = same ? qmul(P(b, all), P(b - 1, all - 1)) : qmul(P(b, all), P(r, all - 1)), ans = qadd(x, y);
      const told = same ? `두 번 모두 빨간 공일 확률은 ${frac(r, all)} × ${frac(r - 1, all - 1)} = ${tx(x)}, 두 번 모두 파란 공일 확률은 ${frac(b, all)} × ${frac(b - 1, all - 1)} = ${tx(y)}`
        : `빨간 공, 파란 공의 차례로 나올 확률은 ${frac(r, all)} × ${frac(b, all - 1)} = ${tx(x)}, 파란 공, 빨간 공의 차례로 나올 확률은 ${frac(b, all)} × ${frac(r, all - 1)} = ${tx(y)}`;
      return ansP(`빨간 공 ${r}개, 파란 공 ${b}개가 들어 있는 주머니에서 공을 한 개씩 연속하여 두 번 꺼낼 때, 두 공의 색이 서로 ${same ? '같을' : '다를'} 확률은? (단, 꺼낸 공은 다시 넣지 않는다.)`, ans, {
        explain: `${told}이다. 따라서 구하는 확률은 ${tx(x)} + ${tx(y)} = ${tx(ans)}이다.`, facts: vf(same ? `(${r}*(${r}-1)+${b}*(${b}-1))/((${r}+${b})*(${r}+${b}-1))` : `(2*${r}*${b})/((${r}+${b})*(${r}+${b}-1))`, [2]) });
    }),
    T('draw-sum-parity', '다시 넣고 두 장 — 두 수의 합이 짝수(홀수)일 확률', '①67', (d) => {
      const m = d.pick([5, 7, 9]), even = d.bool(), odd = (m + 1) / 2, ev = (m - 1) / 2, hit = range(1, m).reduce((s, a) => s + range(1, m).filter((b) => (a + b) % 2 === (even ? 0 : 1)).length, 0);
      const told = even ? `합이 짝수이려면 두 수가 모두 홀수이거나 모두 짝수이어야 한다. 홀수는 ${odd}장, 짝수는 ${ev}장이므로 구하는 확률은 ${frac(odd, m)} × ${frac(odd, m)} + ${frac(ev, m)} × ${frac(ev, m)}`
        : `합이 홀수이려면 한 수는 홀수, 다른 수는 짝수이어야 한다. 홀수는 ${odd}장, 짝수는 ${ev}장이므로 구하는 확률은 ${frac(odd, m)} × ${frac(ev, m)} + ${frac(ev, m)} × ${frac(odd, m)}`;
      return ansP(`1부터 ${m}까지의 자연수가 하나씩 적힌 ${m}장의 카드 중에서 한 장을 뽑아 수를 확인하고 다시 넣은 다음 한 장을 또 뽑을 때, 뽑은 두 수의 합이 ${even ? '짝수' : '홀수'}일 확률은?`, P(hit, m * m), { explain: `${told} = ${tx(P(hit, m * m))}이다.`, facts: kn(even ? odd * odd + ev * ev : 2 * odd * ev, m * m) });
    }),
    T('draw-together', '동시에 두 개를 꺼낼 때 둘 다 지정한 것', '①63 심21', (d) => {
      const [m, k] = d.until(() => [d.pick([8, 9, 10, 12]), d.int(3, 5)], ([m0, k0]) => k0 * 2 <= m0), total = m * (m - 1) / 2, hit = k * (k - 1) / 2;
      return ansP(`${m}개의 제품 중에 불량품이 ${k}개 섞여 있다. 이 중에서 제품 2개를 동시에 꺼낼 때, 2개 모두 불량품일 확률은?`, P(hit, total), {
        explain: `${m}개 중에서 2개를 꺼내는 경우의 수는 ${m} × ${m - 1} ÷ 2 = ${total}이고, 불량품 ${k}개 중에서 2개를 꺼내는 경우의 수는 ${k} × ${k - 1} ÷ 2 = ${hit}이므로 구하는 확률은 ${red(hit, total)}이다. 한 개씩 차례로 꺼낸다고 보고 ${frac(k, m)} × ${frac(k - 1, m - 1)}로 구해도 같다.`, facts: vf(`(${k}/${m})*((${k}-1)/(${m}-1))`) });
    }),
    T('draw-remaining', '이미 뽑힌 카드를 뺀 나머지에서 뽑아 이길 확률', '②20', (d) => {
      const m = d.pick([15, 20, 25]), small = d.bool(), win = (v) => (small ? Math.min(...v) - 1 : m - Math.max(...v)), three = d.until(() => d.shuffle(range(1, m)).slice(0, 3), (v) => win(v) >= 2 && win(v) <= m - 6), k = win(three), edge = small ? Math.min(...three) : Math.max(...three);
      return ansP(`1부터 ${m}까지의 자연수가 하나씩 적힌 ${m}장의 카드를 네 사람이 차례로 한 장씩 뽑아, 가장 ${small ? '작은' : '큰'} 수를 뽑은 사람이 이기는 놀이를 한다. 먼저 뽑은 세 사람이 ${three[0]}, ${three[1]}, ${josa(three[2], '을/를')} 뽑았을 때, 네 번째로 뽑는 사람이 이길 확률은? (단, 뽑은 카드는 다시 넣지 않는다.)`, P(k, m - 3), {
        explain: `남은 카드는 ${m} − 3 = ${m - 3}(장)이다. 네 번째 사람이 이기려면 ${edge}보다 ${small ? '작은' : '큰'} 수를 뽑아야 하고, 그런 카드는 ${small ? `1부터 ${edge - 1}까지` : `${edge + 1}부터 ${m}까지`}의 ${k}장이 모두 남아 있다. 따라서 구하는 확률은 ${red(k, m - 3)}이다.`,
        facts: vf(small ? `(${edge}-1)/(${m}-3)` : `(${m}-${edge})/(${m}-3)`, [3]) });
    }),
    T('draw-all-same', '다시 넣으며 세 번 뽑아 모두 같은 수', '심40', (d) => {
      const m = d.int(3, 5), one = frac(1, m), each = frac(1, m * m * m);
      return ansP(`${range(1, m).join(', ')}${tail(m, '이/가')} 하나씩 적힌 ${m}장의 카드 중에서 한 장을 뽑아 수를 확인하고 다시 넣는 일을 세 번 되풀이할 때, 세 번 모두 같은 수가 적힌 카드가 나올 확률은?`, P(1, m * m), {
        explain: `세 번 모두 1이 적힌 카드가 나올 확률은 ${one} × ${one} × ${one} = ${each}이고, 세 번 모두 ${range(2, m).join(', ')}${tail(m, '이/가')} 적힌 카드가 나올 확률도 저마다 ${each}이다. 따라서 구하는 확률은 ${each} × ${m} = ${frac(1, m * m)}이다.`, facts: vf(`${m}*(1/${m})*(1/${m})*(1/${m})`) });
    })
  ]);

  // ══ 도형에서의 확률 ══
  const CELL_NOTE = '(단, 돌은 반드시 어느 한 칸 안에 놓인다.)';
  // 색칠한 칸을 고른다: 칸의 수의 비가 간단한 분수가 되게 한다.
  const cells = (d, sizes, maxQ) => { const [rows, cols] = d.pick(sizes), total = rows * cols, k = d.until(() => d.int(2, total - 2), (v) => Q(v, total).q <= maxQ); return { rows, cols, total, k, dark: d.shuffle(range(0, total - 1)).slice(0, k).sort((a, b) => a - b) }; };
  B.addTypes('8-2-7', 'shape', [
    T('shape-wheel-kind', '등분한 원판에서 바늘이 한 종류를 가리킬 확률', '②6', (d) => {
      const n = d.pick([6, 8]), v = d.int(2, Math.min(5, n - 2)), letters = d.shuffle(d.shuffle(['A', 'E', 'I', 'O', 'U']).slice(0, v).concat(d.shuffle(['B', 'C', 'D', 'G', 'H', 'K', 'P', 'S', 'T']).slice(0, n - v))), vowel = d.bool(), kind = vowel ? '모음' : '자음', hit = letters.filter((ch) => 'AEIOU'.includes(ch) === vowel);
      return ansP(`다음 그림과 같이 ${n}등분한 원판의 각 칸에 알파벳이 하나씩 적혀 있다. 이 원판을 돌려 멈추었을 때, 바늘이 가리키는 칸에 적힌 알파벳이 ${kind}일 확률은? ${WHEEL_NOTE}`, P(hit.length, n), { figure: wheelFig(letters),
        explain: `원판은 크기가 같은 ${n}칸으로 나뉘어 있고, ${kind}이 적힌 칸은 ${listSaid(hit, '칸')}이므로 구하는 확률은 ${red(hit.length, n)}이다.`, facts: kn(vowel ? v : n - v, n) });
    }),
    T('shape-wheel-or', '등분한 원판에 적힌 수가 「A 또는 B」', '①72 ②41', (d) => {
      const n = d.pick([8, 10, 12]), all = range(1, n);
      const [c1, c2] = d.until(() => d.shuffle([mult(3), mult(4), mult(5), mult(7), divOf(10), divOf(8), divOf(9), PRIME]).slice(0, 2), ([x, y]) => { const a = all.filter(x.ok), b = all.filter(y.ok); return a.length >= 1 && b.length >= 1 && !a.some(y.ok) && a.length + b.length >= 3 && a.length + b.length < n; });
      const a = all.filter(c1.ok), b = all.filter(c2.ok), labels = d.bool() ? all : d.shuffle(all);
      return ansP(`다음 그림과 같이 ${n}등분한 원판의 각 칸에 1부터 ${n}까지의 자연수가 하나씩 적혀 있다. 이 원판을 돌려 멈추었을 때, 바늘이 가리키는 칸에 적힌 수가 ${c1.n} 또는 ${c2.n}일 확률은? ${WHEEL_NOTE}`, P(a.length + b.length, n), { figure: wheelFig(labels),
        explain: `${c1.n}는 ${listSaid(a, '칸')}, ${c2.n}는 ${listSaid(b, '칸')}이고 두 조건에 모두 맞는 수는 없다. 따라서 구하는 확률은 ${frac(a.length, n)} + ${frac(b.length, n)} = ${red(a.length + b.length, n)}이다.`, facts: { value: `${a.length}/${n}+${b.length}/${n}`, unseen: [a.length, b.length] } });
    }),
    T('shape-two-wheels', '두 원판의 바늘이 저마다의 조건을 만족시킬 확률', '②48 심58', (d) => {
      const [m, n] = d.until(() => [d.int(4, 8), d.int(4, 8)], ([x, y]) => x !== y), c = d.pick([PRIME, EVEN, ODD, mult(3)]), a = range(1, m).filter(c.ok), b = range(1, n).filter(c.ok), ans = qmul(P(a.length, m), P(b.length, n));
      return ansP(`다음 그림과 같이 원판 A는 ${m}등분하여 1부터 ${m}까지의 자연수를, 원판 B는 ${n}등분하여 1부터 ${n}까지의 자연수를 각 칸에 하나씩 적었다. 두 원판을 돌려 멈추었을 때, 두 바늘이 가리키는 칸에 적힌 수가 모두 ${c.일} 확률은? ${WHEEL_NOTE}`, ans, { figure: wheelsFig(range(1, m), range(1, n)),
        explain: `원판 A에서 ${c.n}는 ${listSaid(a, '칸')}이므로 그 확률은 ${red(a.length, m)}이고, 원판 B에서 ${c.n}는 ${listSaid(b, '칸')}이므로 그 확률은 ${red(b.length, n)}이다. 따라서 구하는 확률은 ${tx(P(a.length, m))} × ${tx(P(b.length, n))} = ${tx(ans)}이다.`, facts: { value: `(${a.length}/${m})*(${b.length}/${n})`, unseen: [a.length, b.length] } });
    }),
    T('shape-cells-all', '색칠한 칸을 세 번 모두 맞힐 확률', '②69', (d) => {
      const g = cells(d, [[3, 3], [2, 4], [2, 3], [3, 4]], 4), p = P(g.k, g.total), ans = qmul(p, qmul(p, p));
      return ansP(`다음 그림과 같이 크기가 같은 정사각형 ${g.total}칸으로 이루어진 표적이 있다. 이 표적에 화살을 세 번 쏠 때, 세 번 모두 색칠한 칸을 맞힐 확률은? (단, 화살이 표적을 벗어나거나 경계선을 맞히는 경우는 생각하지 않는다.)`, ans, { figure: cellsFig(g.rows, g.cols, g.dark),
        explain: `칸의 크기가 모두 같으므로 화살 한 발이 색칠한 칸을 맞힐 확률은 ${red(g.k, g.total)}이다. 따라서 구하는 확률은 ${tx(p)} × ${tx(p)} × ${tx(p)} = ${tx(ans)}이다.`, facts: { value: `(${g.k}/${g.total})*(${g.k}/${g.total})*(${g.k}/${g.total})` } });
    }),
    T('shape-cells-stones', '색칠한 칸이 있는 판에 돌을 두 번 던질 때의 확률', '①73 심59', (d, n) => {
      // 차례 0: 적어도 한 번은 색칠한 칸. 차례 1: 첫 번째는 색칠한 칸, 두 번째는 색칠하지 않은 칸(던지는 차례를 밝혀 묻는다).
      const g = cells(d, n === 0 ? [[3, 3], [2, 5], [3, 4]] : [[4, 4], [3, 4], [2, 4]], n === 0 ? 5 : 8), p = P(g.k, g.total), lead = `다음 그림과 같이 크기가 같은 정사각형 ${g.total}칸으로 이루어진 판에 돌을 두 번 던질 때`;
      if (n === 0) {
        const none = qmul(non(p), non(p)), ans = non(none);
        return ansP(`${lead}, 적어도 한 번은 돌이 색칠한 칸에 놓일 확률은? ${CELL_NOTE}`, ans, { figure: cellsFig(g.rows, g.cols, g.dark),
          explain: `돌이 색칠하지 않은 칸에 놓일 확률은 ${red(g.total - g.k, g.total)}이므로 두 번 모두 색칠하지 않은 칸에 놓일 확률은 ${tx(non(p))} × ${tx(non(p))} = ${tx(none)}이다. 따라서 구하는 확률은 1 − ${tx(none)} = ${tx(ans)}이다.`, facts: vf(`1-(1-${g.k}/${g.total})*(1-${g.k}/${g.total})`) });
      }
      const ans = qmul(p, non(p));
      return ansP(`${lead}, 첫 번째 돌은 색칠한 칸에 놓이고 두 번째 돌은 색칠하지 않은 칸에 놓일 확률은? ${CELL_NOTE}`, ans, { figure: cellsFig(g.rows, g.cols, g.dark),
        explain: `돌이 색칠한 칸에 놓일 확률은 ${red(g.k, g.total)}, 색칠하지 않은 칸에 놓일 확률은 ${red(g.total - g.k, g.total)}이다. 따라서 구하는 확률은 ${tx(p)} × ${tx(non(p))} = ${tx(ans)}이다.`, facts: vf(`(${g.k}/${g.total})*(1-${g.k}/${g.total})`) });
    }, { count: 2 }),
    T('shape-target', '중심이 같은 원으로 나뉜 과녁에서 색칠한 부분을 맞힐 확률', '②70', (d) => {
      // ring 0: 가장 작은 원의 안쪽, 1: 가운데 고리, 2: 바깥 고리. 반지름의 비가 1 : 2 : 3 이므로 넓이의 비는 1 : 3 : 5 이다.
      const ring = d.int(0, 2), b = G.Board(), O = [0, 0], u = 22, DARK = 'fill:#94a3b8';
      [3, 2, 1].forEach((k) => b.disk(O, u * k, ring === k - 1 ? DARK : G.WHITE));
      b.seg(O, [3 * u, 0], 'thin');
      [['O', 0], ['C', u], ['B', 2 * u], ['A', 3 * u]].forEach(([nm, x]) => { b.dot([x, 0], 2.4); b.text(nm === 'A' ? [x + 10, 0] : [x + (nm === 'O' ? -7 : 8), 11], nm); });
      const where = ['가장 작은 원의 안쪽이', '점 C를 지나는 원과 점 B를 지나는 원 사이의 고리 모양이', '점 B를 지나는 원과 점 A를 지나는 원 사이의 고리 모양이'][ring], area = ['π', '4π − π = 3π', '9π − 4π = 5π'][ring], ans = P([1, 3, 5][ring], 9);
      return ansP(`다음 그림과 같이 중심이 O로 같은 세 원으로 이루어진 과녁이 있고, ${nb(`${SG('OC')} = ${SG('CB')} = ${SG('BA')}`)}이다. 이 과녁에 화살을 한 발 쏠 때, 색칠한 부분을 맞힐 확률은? (단, 화살이 과녁을 벗어나거나 경계선을 맞히는 경우는 생각하지 않는다.)`, ans, {
        figure: b.svg(`과녁: 중심이 O로 같은 세 원으로 이루어져 있다. 반지름 OA 위에 점 O에서 가까운 쪽부터 점 C, 점 B가 있고, 세 원은 저마다 점 C, 점 B, 점 A를 지난다. ${where} 색칠되어 있다.`),
        explain: `${SG('OC')}의 길이를 1이라 하면 세 원의 반지름의 길이는 1, 2, 3이므로 세 원의 넓이는 π, 4π, 9π이다. 색칠한 부분의 넓이는 ${area}이므로 구하는 확률은 ${frac([1, 3, 5][ring] + 'π', '9π')} = ${tx(ans)}이다.`,
        facts: { value: ['(1*1)/(3*3)', '(2*2-1*1)/(3*3)', '(3*3-2*2)/(3*3)'][ring], unseen: [1, 2, 3] } });
    })
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
