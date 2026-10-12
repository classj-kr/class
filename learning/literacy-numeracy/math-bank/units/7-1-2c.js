// 중학교 1학년 1학기 2단원 정수와 유리수 — 실력 문항.
// 단원 틀과 도구, 싣는 기준, 뺀 것과 까닭은 7-1-2a.js 에 있다. ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번, 심n = 심화꼴의 n번.
//
// 이 단원에서 아이들이 흔히 잘못 아는 것(실력 ①의 장치는 이 잘못을 가진 아이가 걸리게 만들었다)
//  - 분수 꼴로 적힌 수는 정수가 아니라고 여긴다(6/2 = 3, −9/3 = −3은 정수이다). 0을 양수나 자연수로 세거나 빠뜨린다. 정수는 유리수가 아니라고 여긴다.
//  - 부호는 양 자체에 붙는다고 여긴다. 기준이 바뀌면 같은 양도 다른 수가 된다는 것을 놓친다.
//  - 절댓값이 같은 두 수 사이의 거리를 그대로 절댓값으로 읽는다(거리 8이면 ±8). 「절댓값이 3 이하인 정수」에서 음수나 0을 빠뜨린다.
//  - 음수도 절댓값이 큰 쪽이 크다고 여긴다(−2.5 > −7/3). 음의 분수 옆의 정수를 거꾸로 댄다(−19/2보다 큰 첫 정수를 −10이라 한다).
//  - 「초과」와 「이상」, 「크다」와 「크거나 같다」의 끝을 가리지 못하고, 「작지 않다」를 「크다」로만 옮긴다. 「음이 아닌 정수」에서 0을 뺀다.
//  - −가 붙은 문자는 음수라고 여긴다(a가 음수이면 −a는 양수이다). 큰 값을 얻으려면 큰 수에서 작은 수를 빼야 한다고만 여긴다(음수를 빼면 커진다).
//  - (−2)²과 −2²을 같은 수로 여기고, 괄호 밖의 −를 먼저 붙인다. 지수가 크거나 문자이면 값을 구할 수 없다고 여긴다(짝수 번·홀수 번만 보면 된다).
//  - 역수를 구하며 부호를 바꾼다. 0의 역수를 0이라 하고, 0.3의 역수를 3이라 한다.
//  - 뺄셈과 나눗셈에서도 자리를 바꾸거나 뒤의 두 수를 먼저 계산한다(12 ÷ 4 × 3을 12 ÷ 12로). 분배법칙으로 묶을 때 빼는 수의 부호를 놓친다.
//  - 부호가 다른 두 수의 합의 부호를 「항상」 한쪽으로 정한다(절댓값이 큰 쪽의 부호를 따른다).
//
// 실력에는 ① 문제의 수·말·식에 함정이 있어 뜻을 정확히 대야 풀리는 문제와 ② 두 번 넘게 생각해야 풀리는 문제(두 점의 한가운데, 간격이 같은 점,
// 어떤 수를 한 번 거꾸로 구해 바르게 계산하기, 넷 가운데 셋을 뽑은 곱, 부호 조건 둘로 부호 정하기, 틀린 문제 수부터 구하는 점수, 한쪽을 먼저 계산하는 □)만 실었다.
// 기본에서 하는 계산 한 번을 고르기로 바꾼 것, 수만 키운 계산은 싣지 않았다.
// 묻는 말: 수나 값은 「~은?/~는?」, 양은 「몇 ~인가?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { box, frac, numbers, N, M, C } = B.kit;
  const K = B.kit.m712;
  const { STD3, STD4, STD5, LAB, MINUS, GT, LT, LE, range, gcd, lcm, Q, dc, plainQ, qadd, qsub, qmul, qdiv, qneg, qabs, qcmp, isInt, fl, mag, tx, sx, px, nb, tail, lastOf, tj, js, V, sup,
    P, U, S, G, W, WN, MN, val, valT, html, inl, jsx, chainOf, ex, taggedEx, proc, nz, pm, co, fr, distinct, ansV, calcQ, addTold, subTold, mulTold, divTold, listOf, named, claimQ } = K;
  // 실력 문항. 기본 자료에서만 나온 꼴은 ref 를 '기본 ②52' 처럼 적는다.
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: ref.startsWith('기본 ') ? '수집본 기본 자료(' + ref.slice(3) + ')' : '수집본 심화 자료(' + ref + ')', make }, more || {});
  const OPS = { '+': '+', '-': MINUS, '*': '×', '/': '÷' }, ORD = ['', '첫', '두', '세', '네', '다섯'];
  const signedQ = (s, x) => (s < 0 ? qneg(x) : x);
  const iq = (n) => tx(Q(n));
  // 간격이 같은 점들: 눈금 없이 점만 찍고, 양 끝 점 아래에 수를 적는다.
  function gapLine(names, left, right) {
    const n = names.length, u = 240 / (n - 1), x = (i) => 30 + i * u, y = 28;
    let out = `<line class="mb-axis" x1="13" y1="${y}" x2="287" y2="${y}"/><path d="M6 ${y}l7 -3.6v7.2z" style="fill:#1f2933"/><path d="M294 ${y}l-7 -3.6v7.2z" style="fill:#1f2933"/>`;
    names.forEach((name, i) => { out += `<circle class="mb-dot" cx="${x(i)}" cy="${y}" r="3.3"/><text class="mb-km-label" style="font-size:13.5px" x="${x(i)}" y="${y - 10}" text-anchor="middle">${name}</text>`; });
    out += `<text class="mb-axis-label" style="font-size:12.5px" x="${x(0)}" y="${y + 19}" text-anchor="middle">${iq(left)}</text><text class="mb-axis-label" style="font-size:12.5px" x="${x(n - 1)}" y="${y + 19}" text-anchor="middle">${iq(right)}</text>`;
    return `<svg class="mb-numberline" viewBox="0 0 300 54" width="300" role="img" aria-label="수직선 위에 점 ${names.join(', ')}가 왼쪽부터 같은 간격으로 놓여 있다. 점 ${names[0]}는 ${iq(left)}, 점 ${names[n - 1]}는 ${iq(right)}${tail(Math.abs(right), '을/를')} 나타낸다">${out}</svg>`;
  }

  B.addGroup('7-1-2', {
    id: 'hard', title: '실력 문제', standard: STD5,
    types: [
      // ── ① 문제의 수·말·식에 함정이 있어 뜻을 정확히 대야 풀리는 문제 ──
      H('hard-kind-count', '약분하면 정수가 되는 분수와 0이 섞인 수 목록에서 종류별 개수 세기', '심4·5 / 기본 ①6 ②3·4', (d, n) => {
        // 함정: 분수 꼴이면 정수가 아니라고 여기는 아이(6/2 = 3, −9/3 = −3은 정수), 0을 빼거나 자연수로 세는 아이.
        //  「음수가 아닌 정수」는 0과 양의 정수, 「자연수가 아닌 정수」는 0과 음의 정수이다.
        const list = d.until(() => listOf(d, { pi: 1, ni: 1, zero: 1, pf: 1, nf: 1, pd: d.int(0, 1), nd: 1, fk: 2 }), (rows) => { const fk = rows.filter((c) => c.fake); return fk.some((c) => c.v.p > 0) && fk.some((c) => c.v.p < 0); });
        const flags = list.map((c) => [!isInt(c.v), isInt(c.v) && c.v.p >= 0, isInt(c.v) && c.v.p <= 0][n]), k = flags.filter(Boolean).length;
        const word = ['정수가 아닌 유리수', '음수가 아닌 정수', '자연수가 아닌 정수'][n], means = ['정수가 아닌 유리수는 약분하여도 정수가 되지 않는 분수와 소수이다', '음수가 아닌 정수는 0과 양의 정수이다', '자연수가 아닌 정수는 0과 음의 정수이다'][n];
        const fk = list.filter((c) => c.fake).map((c) => `${c.show} = ${tx(c.v)}`).join(', ');
        return N(`다음 수 가운데 ${word}의 개수는?`, k, { unit: '개', figure: numbers(list.map((c) => c.show)), explain: `${fk}이므로 이 수들은 정수이다. ${means}. ${word}는 ${named(list, flags)}의 ${k}개이다.`, facts: { count: flags } });
      }, { count: 3, standard: STD3 }),
      H('hard-list-claims', '0과 약분하면 정수가 되는 분수가 섞인 수 목록에 대한 설명 가리기', '심5 / 기본 ①7', (d) => {
        // 함정: 틀린 보기는 저마다 한 가지 잘못으로 센 값이다 — 0을 양수로 센다, 분수 꼴인 정수를 정수에서 뺀다, 정수를 유리수에서 뺀다, 음의 정수를 음의 유리수에서 뺀다.
        const list = listOf(d, { pi: 1, ni: d.int(1, 2), zero: 1, pf: 1, nf: 1, pd: d.int(0, 1), nd: d.int(0, 1), fk: 1 });
        const all = list.length, count = (test) => list.filter((c) => test(c.v)).length, ints = count(isInt), pos = count((v) => v.p > 0), neg = count((v) => v.p < 0), negInt = count((v) => v.p < 0 && isInt(v));
        const claims = d.shuffle([['양수는', pos, pos + 1], ['정수는', ints, ints - 1], ['유리수는', all, all - ints + 1], ['음의 유리수는', neg, neg - negInt], ['정수가 아닌 유리수는', all - ints, all - ints + 1]]).slice(0, 4), rightAt = d.int(0, 3);
        const f = list.find((c) => c.fake);
        return C('다음 수에 대한 설명으로 옳은 것은?', claims.map(([word, yes, no], i) => `${word} ${i === rightAt ? yes : no}개이다.`), rightAt, {
          figure: numbers(list.map((c) => c.show)),
          explain: `${f.show} = ${tx(f.v)}${tail(Math.abs(f.v.p), '은/는')} 정수이고, 0은 양수도 음수도 아닌 정수이다. 정수도 모두 유리수이다. 양수는 ${pos}개, 음의 유리수는 ${neg}개, 정수는 ${ints}개, 정수가 아닌 유리수는 ${all - ints}개, 유리수는 ${all}개이다.`,
          facts: { truth: claims.map((c, i) => i === rightAt), want: true }
        });
      }, { standard: STD3 }),
      H('hard-shift-base', '기준을 바꾸어 부호로 나타내기', '심2', (d) => {
        // 함정: 처음 기준으로 본 값(양수)을 그대로 답하는 아이, 두 기준의 차를 답하는 아이. 기준이 바뀌면 같은 양도 다른 수가 된다.
        const c = d.pick([{ head: '어느 시험에서', unit: '점', as: '으로', is: '은', lo: 12, hi: 15 }, { head: '키를 잴 때', unit: 'cm', as: '로', is: '는', lo: 28, hi: 31 }]), sp = c.unit === 'cm' ? ' ' : '';
        const old = 5 * d.int(c.lo, c.hi), nw = old + d.pick([10, 15]), x = old + d.int(2, nw - old - 2), up = old + d.until(() => d.int(2, 9), (v) => old + v !== x), down = old - d.int(2, 9), u = sp + c.unit;
        return N(`${c.head} ${old}${u}${tail(c.unit === 'cm' ? 2 : 1, '을/를')} 기준으로 하여 ${up}${u}${c.is} +${up - old}${u}, ${down}${u}${c.is} −${old - down}${u}${c.as} 나타내었다. 기준을 ${nw}${u}${c.as} 바꿀 때, ${x}${u}${tail(c.unit === 'cm' ? 2 : 1, '을/를')} 부호 +, −를 사용하여 나타내면?`, x - nw, {
          unit: c.unit, signed: true,
          explain: `기준보다 큰 양은 +, 작은 양은 −로 나타낸다. 기준이 ${nw}${u}이면 ${x}${u}${c.is} 기준보다 ${nw - x}${u}만큼 작으므로 −${nw - x}${u}이다. 처음 기준으로 나타낸 +${x - old}${u}와 다르다.`,
          facts: { value: `${x}-${nw}` }
        });
      }, { standard: STD3 }),
      H('hard-abs-pair-dist', '절댓값이 같은 두 수 사이의 거리로 두 수 구하기', '심10 / 기본 ①23 ②13', (d, n) => {
        // 함정: 두 점 사이의 거리를 그대로 절댓값으로 여겨 ±(거리)라고 답하는 아이. 두 점은 0을 나타내는 점에서 같은 거리만큼 떨어져 있으므로 절댓값은 거리의 절반이다.
        const lead = '절댓값이 같고 부호가 서로 다른 두 수를 수직선 위에 점으로 나타내면 두 점 사이의 거리가';
        if (n === 0) {
          const k = d.int(2, 9), dist = 2 * k;
          return M(`${lead} ${dist}이다. 두 수 가운데 작은 수와 큰 수는?`, [{ label: '작은 수', answer: -k, signed: true }, { label: '큰 수', answer: k, signed: true }], {
            explain: `두 점은 0을 나타내는 점의 양쪽에 같은 거리만큼 떨어져 있다. 0을 나타내는 점에서 한 점까지의 거리는 ${dist} ÷ 2 = ${k}이므로 두 수는 −${k}${tail(k, '과/와')} +${k}이다.`,
            facts: { calc: [[`-${dist}/2`, 0], [`${dist}/2`, 1]], unseen: [2] }
          });
        }
        const dist = 2 * d.int(1, 7) + 1, v = Q(-dist, 2);
        return ansV(`${lead} ${dist}이다. 두 수 가운데 작은 수는?`, v, 'frac', {
          explain: `두 점은 0을 나타내는 점의 양쪽에 같은 거리만큼 떨어져 있다. 0을 나타내는 점에서 한 점까지의 거리는 ${dist} ÷ 2 = ${frac(dist, 2)}이므로 두 수는 ${tj(v, '과/와')} +${frac(dist, 2)}이고, 작은 수는 ${tx(v)}이다.`,
          facts: { value: `(-${dist}/2)`, unseen: [2] }
        });
      }, { count: 2, standard: STD4 }),
      H('hard-abs-range-count', '절댓값의 범위에 드는 정수의 개수', '기본 ①21 ②14', (d, n) => {
        // 함정: 양수만 세는 아이(음수를 빠뜨림), 0을 빠뜨리는 아이, 「이하」「미만」「이상」의 끝을 가리지 못하는 아이.
        const k = d.int(2, 6), a = d.int(2, 4), b = a + d.int(2, 3), form = n === 1 ? 2 : d.int(0, 1);
        const text = [`절댓값이 ${k} 이하인 정수는 모두 몇 개인가?`, `절댓값이 ${k}보다 작은 정수는 모두 몇 개인가?`, `절댓값이 ${a} 이상 ${b} 미만인 정수는 모두 몇 개인가?`][form];
        const lo = form === 2 ? a : 0, hi = form === 0 ? k : form === 1 ? k - 1 : b - 1, ok = range(-hi, hi).filter((v) => Math.abs(v) >= lo);
        return N(text, ok.length, {
          unit: '개',
          explain: `절댓값이 ${range(lo, hi).join(', ')}인 정수를 모두 센다. 절댓값이 0인 정수는 0 하나뿐이고, 절댓값이 0이 아닌 정수는 양수와 음수 두 개씩이다. ${ok.map(iq).join(', ')}의 ${ok.length}개이다.`,
          facts: { digit: { template: [`□*□<${k}*${k}+1`, `□*□<${k}*${k}`, `${a}*${a}-1<□*□<${b}*${b}`][form], lo: -9, hi: 9, ask: 'count' }, rule: 'abs-range-' + n }
        });
      }, { count: 2, standard: STD4 }),
      H('hard-neg-rank', '서로 가까운 음수들의 크기 비교', '심15·16 / 기본 ①25·29', (d) => {
        // 함정: 음수도 절댓값이 큰 쪽이 크다고 여기는 아이는 가장 큰 수와 가장 작은 수를 거꾸로 고른다. 분자·분모의 크기만 보는 아이도 틀린다.
        const base = d.int(1, 4), tenth = () => dc(-(10 * base + d.int(1, 9))), part = () => { const q = d.pick([3, 4, 6]); return Q(-(base * q + co(d, q, 1, q - 1)), q); };
        const list = d.until(() => d.shuffle([tenth(), tenth(), part(), part()]), (rows) => { const vs = rows.map(fl).sort((x, y) => x - y); return distinct(rows) && vs[1] - vs[0] < 0.2 && vs[3] - vs[2] < 0.2 && vs[1] - vs[0] > 0.01 && vs[3] - vs[2] > 0.01; });
        const small = d.bool(), values = list.map(fl), at = values.indexOf(small ? Math.min(...values) : Math.max(...values)), L = list.reduce((m, x) => lcm(m, x.q), 1);
        return C(`다음 수 가운데 가장 ${small ? '작은' : '큰'} 수는?`, list.map(tx), at, {
          explain: `음수끼리는 절댓값이 큰 수가 작다. 절댓값을 통분하면 차례로 ${list.map((x) => frac(Math.abs(x.p) * L / x.q, L)).join(', ')}이다. 절댓값이 가장 ${small ? '큰' : '작은'} ${tj(list[at], '이/가')} 가장 ${small ? '작은' : '큰'} 수이다.`,
          facts: { rank: { values, nth: small ? 4 : 1 } }
        });
      }, { standard: STD4 }),
      H('hard-boundary', '「크다」와 「크거나 같다」가 섞인 범위의 끝 가리기', '심19 / 기본 ②21', (d, n) => {
        // 함정: 두 끝을 모두 넣거나 모두 빼는 아이. 「크다·초과·작다·미만」은 그 수를 넣지 않고, 「크거나 같다·이상·작거나 같다·이하」는 넣는다.
        const a = -d.int(2, 6), b = d.int(1, 5), strictLow = d.bool(), words = d.bool();
        const said = strictLow ? (words ? `${iq(a)}보다 크고 ${b}보다 작거나 같은` : `${iq(a)} 초과 ${b} 이하인`) : (words ? `${iq(a)}보다 크거나 같고 ${b}보다 작은` : `${iq(a)} 이상 ${b} 미만인`);
        const inside = (v) => (strictLow ? v > a && v <= b : v >= a && v < b), ok = range(a, b).filter(inside);
        if (n === 0) {
          const out = strictLow ? a : b, shown = d.shuffle([a, b].concat(d.shuffle(range(a + 1, b - 1)).slice(0, 2)));
          return C(`다음 중 ${said} 정수가 아닌 것은?`, shown.map(iq), shown.indexOf(out), {
            explain: `${said} 정수는 ${ok.map(iq).join(', ')}이다. ${iq(out)}${tail(Math.abs(out), '은/는')} ${strictLow ? `${iq(a)}보다 크지 않으므로` : `${b}보다 작지 않으므로`} 이 범위에 들지 않는다.`,
            facts: { truth: shown.map((v) => !inside(v)), want: true, rule: 'boundary-pick' }
          });
        }
        return N(`${said} 정수는 모두 몇 개인가?`, ok.length, {
          unit: '개', explain: `${strictLow ? `${iq(a)}${tail(-a, '은/는')} 넣지 않고 ${josaNum(b, '은/는')} 넣는다` : `${iq(a)}${tail(-a, '은/는')} 넣고 ${josaNum(b, '은/는')} 넣지 않는다`}. ${ok.map(iq).join(', ')}의 ${ok.length}개이다.`,
          facts: { digit: { template: strictLow ? `(${a})<□<${b}+1` : `(${a})-1<□<${b}`, lo: -12, hi: 12, ask: 'count' }, rule: 'boundary-count' }
        });
      }, { count: 2, standard: STD4 }),
      H('hard-not-less', '「작지 않다」「크지 않다」를 부등호로 나타내기', '기본 ①31·32 ②20·21', (d, n) => {
        // 함정: 「작지 않다」를 「크다」(>)로, 「크지 않다」를 「작다」(<)로만 옮기는 아이. 같은 경우가 들어간다(≥, ≤).
        const a = d.bool() ? Q(-d.int(1, 9)) : qneg(fr(d, [2, 3, 4], 3)), b = Q(d.int(1, 9)), name = V('x'), A = tx(a), Bt = tx(b);
        if (n === 0) {
          const [lo, up] = d.until(() => [d.pick([[`${A}보다 작지 않고`, LE], [`${A}보다 크고`, LT]]), d.pick([[`${Bt}보다 크지 않다`, LE], [`${Bt}보다 작다`, LT]])], ([p, q]) => p[1] === LE || q[1] === LE);
          const combos = d.shuffle([[LT, LT], [LE, LT], [LT, LE], [LE, LE]]);
          return C(`「${name}는 ${lo[0]} ${up[0]}.」를 부등호를 사용하여 나타낸 것은?`, combos.map(([s1, s2]) => `${A} ${s1} ${name} ${s2} ${Bt}`), combos.findIndex(([s1, s2]) => s1 === lo[1] && s2 === up[1]), {
            explain: `「작지 않다」는 크거나 같다는 뜻이므로 ≥, 「크지 않다」는 작거나 같다는 뜻이므로 ≤로 나타낸다. ${A} ${lo[1]} ${name} ${up[1]} ${Bt}이다.`,
            facts: { truth: combos.map(([s1, s2]) => s1 === lo[1] && s2 === up[1]), want: true, rule: 'not-less-to' }
          });
        }
        // 식을 나타낸 문장 셋과, 한쪽 끝을 반대로 옮긴 문장 하나
        const lowIn = d.bool(), ineq = lowIn ? `${A} ${LE} ${name} ${LT} ${Bt}` : `${A} ${LT} ${name} ${LE} ${Bt}`;
        const good = lowIn ? [`${name}는 ${A} 이상이고 ${Bt} 미만이다.`, `${name}는 ${A}보다 작지 않고 ${Bt}보다 작다.`, `${name}는 ${A}보다 크거나 같고 ${Bt}보다 작다.`] : [`${name}는 ${A} 초과이고 ${Bt} 이하이다.`, `${name}는 ${A}보다 크고 ${Bt}보다 크지 않다.`, `${name}는 ${A}보다 크고 ${Bt}보다 작거나 같다.`];
        const bad = lowIn ? d.pick([`${name}는 ${A}보다 크고 ${Bt}보다 크지 않다.`, `${name}는 ${A}보다 작지 않고 ${Bt}보다 크지 않다.`]) : d.pick([`${name}는 ${A}보다 작지 않고 ${Bt}보다 작다.`, `${name}는 ${A}보다 작지 않고 ${Bt}보다 크지 않다.`]);
        const rows = d.shuffle(good.concat([bad]));
        return C(`${ineq}${tail(lastOf(b), '을/를')} 나타낸 문장이 아닌 것은?`, rows, rows.indexOf(bad), {
          explain: `「작지 않다」는 크거나 같다(≥), 「크지 않다」는 작거나 같다(≤)는 뜻이다. 「${bad}」는 ${ineq}${tail(lastOf(b), '과/와')} 한쪽 끝이 다르다.`,
          facts: { truth: rows.map((r) => r !== bad), want: false, rule: 'not-less-from' }
        });
      }, { count: 2, standard: STD4 }),
      H('hard-neg-letter', '음수를 나타내는 문자로 된 식의 부호 판단', '심51 / 기본 ①92', (d) => {
        // 함정: −가 붙어 있으면 음수라고 여기는 아이(a가 음수이면 −a는 양수), 음수의 제곱을 음수로 여기는 아이. −a²과 (−a)²도 가려야 한다.
        const a = V('a');
        // [식, 까닭]
        const POS = [[`−${a}`, '음수의 부호를 바꾼 수'], [`${a}${sup(2)}`, '음수를 두 번 곱한 수'], [`(−${a})${sup(2)}`, `양수 −${a}를 두 번 곱한 수`], [`−${a}${sup(3)}`, `음수 ${a}${sup(3)}의 부호를 바꾼 수`], [`|${a}|`, '절댓값'], [`(−${a})${sup(3)}`, `양수 −${a}를 세 번 곱한 수`]];
        const NEG = [[`${a}${sup(3)}`, '음수를 세 번 곱한 수'], [`−(−${a})`, `양수 −${a}의 부호를 바꾼 수`], [`−${a}${sup(2)}`, `양수 ${a}${sup(2)}의 부호를 바꾼 수`], [`−|${a}|`, '절댓값의 부호를 바꾼 수'], [`−(−${a})${sup(2)}`, `양수 (−${a})${sup(2)}의 부호를 바꾼 수`]];
        const many = d.int(2, 3), rows = d.shuffle(d.shuffle(POS).slice(0, many).map((s) => [s[0], true, s[1]]).concat(d.shuffle(NEG).slice(0, 5 - many).map((s) => [s[0], false, s[1]])));
        return N(`${a}가 음수일 때, 다음 중 값이 양수인 것은 모두 몇 개인가?`, many, {
          unit: '개', figure: taggedEx(rows.map((r) => r[0])),
          explain: `${a}가 음수이면 −${a}는 양수이다. ${rows.map((r, i) => `${LAB[i]}은 ${r[2]}이므로 ${r[1] ? '양수' : '음수'}`).join(', ')}이다. 값이 양수인 것은 ${rows.map((r, i) => (r[1] ? LAB[i] : '')).filter(Boolean).join(', ')}의 ${many}개이다.`,
          facts: { count: rows.map((r) => r[1]) }
        });
      }),
      H('hard-abs-diff', '절댓값이 정해진 두 수의 차가 가장 크거나 작은 경우', '심26 / 기본 ①53 ②50', (d, n) => {
        // 함정: 가장 큰 차를 얻으려고 큰 수에서 작은 수를 빼기만 하는 아이(9 − 4). 음수를 빼면 커지므로 양수에서 음수를 빼야 가장 크고, 음수에서 양수를 빼야 가장 작다.
        const [p, q] = d.until(() => [d.int(2, 9), d.int(2, 9)], ([x, y]) => x !== y), a = V('a'), b = V('b'), big = n === 0;
        const lead = `두 수 ${a}, ${b}의 절댓값이 각각 ${p}, ${q}일 때,`, diff = nb(`${a} − ${b}`);
        const why = `${a}는 ${p} 또는 −${p}, ${b}는 ${q} 또는 −${q}이다. 음수를 빼는 것은 그 절댓값을 더하는 것과 같으므로 ${a} − ${b}는 ${a} = ${p}, ${b} = −${q}일 때 가장 크고, ${a} = −${p}, ${b} = ${q}일 때 가장 작다.`;
        if (n === 0) {
          const cases = d.shuffle([[p, q], [p, -q], [-p, q], [-p, -q]]), values = cases.map(([x, y]) => x - y), at = values.indexOf(big ? Math.max(...values) : Math.min(...values));
          return C(`${lead} ${diff}의 값이 가장 ${big ? '큰' : '작은'} 경우는?`, cases.map(([x, y]) => `${a} = ${iq(x)}, ${b} = ${iq(y)}`), at, {
            explain: `${why} 값은 차례로 ${cases.map(([x, y]) => `${px(Q(x))} − ${px(Q(y))} = ${iq(x - y)}`).join(', ')}이다.`,
            facts: { rank: { values, nth: big ? 1 : 4 }, rule: 'abs-diff-pick' }
          });
        }
        const v = big ? p + q : -(p + q);
        return N(`${lead} ${diff}의 값 가운데 가장 ${big ? '큰' : '작은'} 값은?`, v, {
          signed: true, explain: `${why} 가장 ${big ? '큰' : '작은'} 값은 ${big ? `${p} − (−${q}) = ${p} + ${q}` : `(−${p}) − ${q}`} = ${iq(v)}이다.`,
          facts: { value: big ? `${p}-(-${q})` : `(-${p})-${q}`, rule: 'abs-diff-value' }
        });
      }, { count: 2 }),
      H('hard-pow-letter', '지수가 문자인 −1의 거듭제곱', '심32 / 기본 ①65', (d) => {
        // 함정: 지수가 문자라서 값을 구할 수 없다고 여기는 아이, n이 홀수이면 n + 1도 홀수로 다루는 아이. −1을 짝수 번 곱하면 1, 홀수 번 곱하면 −1이다.
        const odd = d.bool(), nn = V('n'), k = odd ? 1 : 2, ops = d.until(() => [d.pick(['+', '-']), d.pick(['+', '-'])], (o) => o.includes('-')), sign = (e) => (e % 2 ? -1 : 1);
        const v = sign(k) + (ops[0] === '+' ? 1 : -1) * sign(k + 1) + (ops[1] === '+' ? 1 : -1) * sign(k + 2), terms = [`(−1)${sup(nn)}`, `(−1)${sup(nn + ' + 1')}`, `(−1)${sup(nn + ' + 2')}`];
        const parity = (e) => ((k + e) % 2 ? '홀수' : '짝수');
        return N(`${nn}이 ${odd ? '홀수' : '짝수'}일 때, 다음 식의 값은?`, v, {
          signed: true, figure: ex(`${terms[0]} <i>${OPS[ops[0]]}</i> ${terms[1]} <i>${OPS[ops[1]]}</i> ${terms[2]}`),
          explain: `−1을 짝수 번 곱하면 1, 홀수 번 곱하면 −1이다. ${nn}이 ${parity(0)}이면 ${nn} + 1은 ${parity(1)}, ${nn} + 2는 ${parity(2)}이므로 ${iq(sign(k))} ${OPS[ops[0]]} ${px(Q(sign(k + 1)))} ${OPS[ops[1]]} ${px(Q(sign(k + 2)))} = ${iq(v)}이다.`,
          facts: { value: `(-1)**${k}${ops[0]}(-1)**(${k}+1)${ops[1]}(-1)**(${k}+2)` }
        });
      }),
      H('hard-sign-count', '값을 구하지 않고 곱의 부호 가리기', '기본 ②61 / 심40·54', (d) => {
        // 함정: 거듭제곱을 끝까지 계산하려는 아이는 풀 수 없다. 곱의 부호는 음수를 곱한 횟수로만 정해진다. −7²⁰처럼 괄호가 없으면 지수와 상관없이 음수이다.
        const big = (odd) => 2 * d.int(5, 60) + (odd ? 1 : 0), base = () => d.int(2, 99), pw = (b, e) => `(−${b})${sup(e)}`, part = (q) => frac(co(d, q, 1, q - 1), q);
        const makers = [
          () => { const e = big(d.bool()); return [pw(base(), e), e % 2 === 1]; },
          () => [`−${base()}${sup(big(d.bool()))}`, true],
          () => { const e = big(d.bool()); return [`(−${d.int(2, 9)}) <i>×</i> (−${part(5)})${sup(e)}`, e % 2 === 0]; },
          () => { const e1 = big(d.bool()), e2 = big(d.bool()); return [`${pw(d.int(2, 9), e1)} <i>×</i> ${pw(d.int(2, 9), e2)}`, (e1 + e2) % 2 === 1]; },
          () => { const e = big(d.bool()); return [`−${pw(base(), e)}`, e % 2 === 0]; },
          () => [`${part(7)} <i>×</i> (−${d.int(2, 9)}${sup(big(d.bool()))})`, true],
          () => { const e1 = big(d.bool()), e2 = big(d.bool()); return [`(−${part(4)})${sup(e1)} <i>×</i> (−1)${sup(e2)}`, (e1 + e2) % 2 === 1]; }
        ];
        const rows = d.until(() => d.shuffle(makers).slice(0, 5).map((make) => make()), (list) => { const k = list.filter((r) => r[1]).length; return k >= 2 && k <= 3; }), k = rows.filter((r) => r[1]).length;
        return N('다음 중 계산 결과가 음수인 것은 모두 몇 개인가?', k, {
          unit: '개', figure: taggedEx(rows.map((r) => r[0])),
          explain: `값을 구하지 않고 부호만 본다. 음수를 짝수 번 곱하면 양수, 홀수 번 곱하면 음수이다. 괄호 없이 −가 붙은 거듭제곱은 양수를 거듭 곱한 다음 −를 붙인 수이므로 음수이다. 계산 결과가 음수인 것은 ${rows.map((r, i) => (r[1] ? LAB[i] : '')).filter(Boolean).join(', ')}의 ${k}개이다.`,
          facts: { count: rows.map((r) => r[1]) }
        });
      }),
      H('hard-dist-factor', '부호나 자리가 달라 보이는 수를 분배법칙으로 묶어 계산하기', '기본 ①67 ②63', (d) => {
        // 함정: 묶을 때 빼는 것을 더하는 것으로 바꾸는 아이(17 × (−23) − 17 × 77 을 17 × (−23 + 77)로), 자리가 바뀌었거나 부호가 반대인 수(7과 −7)를 공통으로 곱한 수로 보지 못하는 아이.
        const a = d.until(() => d.int(12, 39), (v) => v % 10 !== 0), b = d.until(() => d.int(13, 87), (v) => v % 10 !== 0 && v !== 50), c = 100 - b, form = d.int(0, 2), A = Q(a), nA = Q(-a);
        const list = form === 0 ? [U(A), '*', U(Q(-b)), '-', U(A), '*', U(Q(c))] : form === 1 ? [P(nA), '*', U(Q(b)), '+', U(Q(c)), '*', U(nA)] : [U(Q(b)), '*', U(nA), '-', U(Q(c)), '*', U(A)];
        const how = form === 0 ? `${a}${tail(a, '으로/로')} 묶으면 ${inl(list)} = ${a} × {(−${b}) − ${c}} = ${a} × (−100)`
          : form === 1 ? `곱셈의 교환법칙으로 ${c} × (−${a}) = (−${a}) × ${c}이므로 ${inl(list)} = (−${a}) × (${b} + ${c}) = (−${a}) × 100`
            : `${c} × ${a}${tail(a, '을/를')} 빼는 것은 ${c} × (−${a})${tail(a, '을/를')} 더하는 것과 같으므로 ${inl(list)} = (${b} + ${c}) × (−${a}) = 100 × (−${a})`;
        return calcQ(list, 'int', { rule: 'hard-dist-factor', explain: `분배법칙을 이용하여 공통으로 곱해진 수로 묶는다. ${how} = ${tx(val(list))}이다.` });
      }),
      H('hard-dist-letters', '분배법칙을 거꾸로 써서 문자가 나타내는 수의 곱 구하기', '심41', (d) => {
        // 함정: 주어진 두 수를 그냥 더하거나 큰 수에서 작은 수를 빼는 아이. a × (b + c) = a × b + a × c 에서 a × c 를 뺄셈으로 구한다.
        const [p, s] = d.until(() => [nz(d, -15, 15), nz(d, -15, 15)], ([x, y]) => x < 0 && x !== y && Math.abs(x) !== Math.abs(y)), plus = d.bool(), a = V('a'), b = V('b'), c = V('c'), v = plus ? s - p : p - s;
        return N(`세 수 ${a}, ${b}, ${c}에 대하여 ${nb(`${a} × ${b} = ${iq(p)}`)}, ${nb(`${a} × (${b} ${plus ? '+' : MINUS} ${c}) = ${iq(s)}`)}일 때, ${nb(`${a} × ${c}`)}의 값은?`, v, {
          signed: true,
          explain: `분배법칙에 의하여 ${a} × (${b} ${plus ? '+' : MINUS} ${c}) = ${a} × ${b} ${plus ? '+' : MINUS} ${a} × ${c}이다. ${px(Q(p))} ${plus ? '+' : MINUS} ${a} × ${c} = ${iq(s)}이므로 ${a} × ${c} = ${plus ? subTold(Q(s), Q(p)) : subTold(Q(p), Q(s))}이다.`,
          facts: { value: plus ? `${js(Q(s))}-${js(Q(p))}` : `${js(Q(p))}-${js(Q(s))}` }
        });
      }),
      H('hard-letter-extreme', '부호가 정해진 두 문자로 된 식 가운데 가장 작은(큰) 수', '심50 / 기본 ①92', (d) => {
        // 함정: 음수인 문자가 가장 작다고 여기는 아이. (음수) − (양수)는 그 음수보다도 작고, (양수) − (음수)는 그 양수보다도 크다. 합의 크기는 두 수 사이에 있다.
        const swap = d.bool(), a = V(swap ? 'b' : 'a'), b = V(swap ? 'a' : 'b'), small = d.bool(), low = `${b} − ${a}`, high = `${a} − ${b}`, right = small ? low : high;
        const rows = d.shuffle([a, b, high, `${a} + ${b}`, low]);
        return C(`${swap ? `${nb(`${b} ${LT} 0`)}, ${nb(`${a} ${GT} 0`)}` : `${nb(`${a} ${GT} 0`)}, ${nb(`${b} ${LT} 0`)}`}일 때, 다음 중 가장 ${small ? '작은' : '큰'} 수는?`, rows, rows.indexOf(right), {
          explain: `${a}는 양수, ${b}는 음수이다. ${low}는 음수 ${b}에서 양수를 뺀 수이므로 ${b}보다 작고, ${high}는 양수 ${a}에서 음수를 뺀 수이므로 ${a}보다 크다. ${a} + ${b}는 ${b}보다 크고 ${a}보다 작다. 가장 ${small ? '작은' : '큰'} 수는 ${right}이다.`,
          facts: { truth: rows.map((r) => r === right), want: true }
        });
      }),
      H('hard-always', '두 수의 곱과 부호가 항상 같은 식 가리기', '심53', (d) => {
        // 함정: 합과 차의 부호도 곱을 따른다고 여기는 아이, 제곱이나 절댓값이 붙은 수의 부호를 놓치는 아이.
        const a = V('a'), b = V('b');
        const YES = [`${a} ÷ ${b}`, `(−${a}) × (−${b})`, `${a}${sup(3)} × ${b}${sup(3)}`, `${b} ÷ ${a}`], NO = [`${a} + ${b}`, `${a} − ${b}`, `|${a}| × |${b}|`, `(−${a}) × ${b}`, `${a}${sup(2)} × ${b}`, `${a} × ${b}${sup(2)}`];
        const right = d.pick(YES), rows = d.shuffle([right].concat(d.shuffle(NO).slice(0, 3)));
        return C(`0이 아닌 두 수 ${a}, ${b}에 대하여 다음 중 ${nb(`${a} × ${b}`)}와 부호가 항상 같은 것은?`, rows, rows.indexOf(right), {
          explain: `두 수의 부호가 같으면 곱과 몫이 모두 양수이고, 부호가 다르면 곱과 몫이 모두 음수이다. 부호를 둘 다 바꾸어 곱하거나 홀수 번 거듭 곱하여도 부호는 그대로이다. ${right}의 부호는 ${a} × ${b}의 부호와 항상 같다. 합과 차의 부호는 두 수의 크기에 따라 달라지고, 제곱이나 절댓값은 음수가 될 수 없다.`,
          facts: { truth: rows.map((r) => r === right), want: true, rule: 'always-same' }
        });
      }),

      // ── ② 두 번 넘게 생각해야 풀리는 문제 ──
      H('hard-midpoint', '수직선에서 두 점으로부터 같은 거리에 있는 점', '기본 ①15', (d) => {
        // 두 점 사이의 거리(음수를 빼는 뺄셈)를 구하고, 그 절반만큼 옮긴다.
        const [a, b] = d.until(() => [-d.int(1, 11), d.bool() ? d.int(1, 11) : -d.int(1, 11)], ([x, y]) => y - x >= 4 && (y - x) % 2 === 0 && x + y !== 0), gap = b - a, v = a + gap / 2;
        return N(`수직선에서 ${tj(Q(a), '을/를')} 나타내는 점 A와 ${tj(Q(b), '을/를')} 나타내는 점 B로부터 같은 거리에 있는 점이 나타내는 수는?`, v, {
          signed: true,
          explain: `두 점 사이의 거리는 ${px(Q(b))} − ${px(Q(a))} = ${gap}이고, 그 절반은 ${gap / 2}이다. 구하는 점은 점 A에서 오른쪽으로 ${gap / 2}만큼 간 점이므로 ${px(Q(a))} + ${gap / 2} = ${iq(v)}${tail(Math.abs(v), '을/를')} 나타낸다.`,
          facts: { value: `(${js(Q(a))}+${js(Q(b))})/2`, unseen: [2] }
        });
      }, { standard: STD4 }),
      H('hard-equal-gaps', '수직선에서 간격이 같은 점들이 나타내는 수', '심9', (d) => {
        // 두 끝 점 사이의 거리(음수를 빼는 뺄셈)를 간격의 수로 나누고, 왼쪽 끝에서부터 더해 간다.
        const [a, b] = d.until(() => [-d.int(2, 8), d.int(1, 9)], ([x, y]) => (y - x) % 3 !== 0), k = d.int(1, 2), gap = Q(b - a, 3), v = qadd(Q(a), qmul(gap, Q(k))), name = ['B', 'C'][k - 1];
        return ansV(`수직선 위의 네 점 A, B, C, D가 같은 간격으로 놓여 있다. 점 A가 ${iq(a)}, 점 D가 ${josaNum(b, '을/를')} 나타낼 때, 점 ${name}가 나타내는 수는?`, v, 'frac', {
          figure: gapLine(['A', 'B', 'C', 'D'], a, b),
          explain: `점 A와 점 D 사이의 거리는 ${b} − (${iq(a)}) = ${b - a}이고, 간격이 3개이므로 한 간격은 ${tx(gap)}이다. 점 ${name}는 점 A에서 오른쪽으로 ${k === 1 ? tx(gap) : `${tx(gap)} × 2 = ${tx(qmul(gap, Q(2)))}`}만큼 간 점이므로 ${addTold(Q(a), qmul(gap, Q(k)))}${tail(lastOf(v), '을/를')} 나타낸다.`,
          facts: { value: `${js(Q(a))}+(${b}-${js(Q(a))})/3${k === 2 ? '*2' : ''}`, unseen: [3, 2] }
        });
      }, { standard: STD4 }),
      H('hard-wrong-add', '더할 것을 빼거나 뺄 것을 더한 계산 바로잡기', '심24 / 기본 ①52 ②49', (d) => {
        // 어떤 수를 거꾸로 한 번 구한 다음 바르게 계산한다. 어떤 수를 구하고 멈추는 아이, 잘못 계산한 값을 어떤 수로 보는 아이가 틀린다.
        const mustSub = d.bool();
        const [m, w, x, v] = d.until(() => { const q = d.pick([2, 3, 4, 5, 6]), mm = Q(-co(d, q, 1, 2 * q - 1), q), ww = d.bool() ? Q(pm(d) * co(d, q, 1, 2 * q - 1), q) : signedQ(pm(d), fr(d, [2, 3, 4, 6], 2)), xx = mustSub ? qsub(ww, mm) : qadd(ww, mm); return [mm, ww, xx, mustSub ? qsub(xx, mm) : qadd(xx, mm)]; },
          (r) => r[3].q > 1 && r[3].q <= 12 && lcm(r[0].q, r[1].q) <= 12 && r[2].p !== 0 && qcmp(qabs(r[0]), qabs(r[1])) !== 0);
        const text = mustSub ? `어떤 수에서 ${tj(m, '을/를')} 빼야 할 것을 잘못하여 더하였더니 ${tj(w, '이/가')} 되었다. 바르게 계산한 값은?` : `어떤 수에 ${tj(m, '을/를')} 더해야 할 것을 잘못하여 빼었더니 ${tj(w, '이/가')} 되었다. 바르게 계산한 값은?`;
        return ansV(text, v, 'frac', {
          explain: mustSub ? `어떤 수를 □라 하면 □ + ${px(m)} = ${tx(w)}이므로 □ = ${subTold(w, m)}이다. 바르게 계산하면 ${subTold(x, m)}이다.` : `어떤 수를 □라 하면 □ − ${px(m)} = ${tx(w)}이므로 □ = ${addTold(w, m)}이다. 바르게 계산하면 ${addTold(x, m)}이다.`,
          facts: { value: mustSub ? `${js(w)}-${js(m)}-${js(m)}` : `${js(w)}+${js(m)}+${js(m)}` }
        });
      }),
      H('hard-wrong-div', '나눌 것을 곱하거나 곱할 것을 나눈 계산 바로잡기', '심39 / 기본 ②78 ①84', (d) => {
        // 어떤 수를 거꾸로 한 번 구한 다음 바르게 계산한다. 음의 분수로 두 번 나누거나 두 번 곱한다(부호는 그대로, 크기만 달라진다).
        const mustDiv = d.bool(), [p, q] = d.until(() => [d.int(1, 3), d.int(2, 5)], ([x, y]) => gcd(x, y) === 1 && x !== y), m = Q(-p, q), c = pm(d) * d.int(1, 4);
        const w = Q(mustDiv ? c * p * p : c * q * q), x = mustDiv ? qdiv(w, m) : qmul(w, m), v = mustDiv ? qdiv(x, m) : qmul(x, m);
        const text = mustDiv ? `어떤 수를 ${tj(m, '으로/로')} 나누어야 할 것을 잘못하여 곱하였더니 ${tj(w, '이/가')} 되었다. 바르게 계산한 값은?` : `어떤 수에 ${tj(m, '을/를')} 곱해야 할 것을 잘못하여 나누었더니 ${tj(w, '이/가')} 되었다. 바르게 계산한 값은?`;
        return ansV(text, v, 'int', {
          explain: mustDiv ? `어떤 수를 □라 하면 □ × ${px(m)} = ${tx(w)}이므로 □ = ${divTold(w, m)}이다. 바르게 계산하면 ${divTold(x, m)}이다.` : `어떤 수를 □라 하면 □ ÷ ${px(m)} = ${tx(w)}이므로 □ = ${mulTold(w, m)}이다. 바르게 계산하면 ${mulTold(x, m)}이다.`,
          facts: { value: mustDiv ? `${js(w)}/${js(m)}/${js(m)}` : `${js(w)}*${js(m)}*${js(m)}` }
        });
      }),
      H('hard-pick-three', '네 수에서 세 수를 뽑아 곱한 값이 가장 큰(작은) 경우', '심40 / 기본 ①71 ②67', (d, n) => {
        // 곱의 부호를 음수의 개수로 먼저 정하고(가장 크려면 음수 2개, 가장 작으려면 음수 1개), 그다음 절댓값이 크게 되도록 뽑는다.
        const big = n === 0, [n1, n2, p1, p2] = d.until(() => [-d.int(2, 9), -d.int(2, 9), d.int(2, 9), d.int(2, 9)], (r) => new Set(r.map(Math.abs)).size === 4);
        const pick = big ? [n1, n2, Math.max(p1, p2)] : [Math.min(n1, n2), p1, p2], v = pick.reduce((s, x) => s * x, 1), list = d.shuffle([n1, n2, p1, p2]), chosen = [S(Q(pick[0])), '*', S(Q(pick[1])), '*', S(Q(pick[2]))];
        return N(`네 수 ${list.map(iq).join(', ')} 가운데 서로 다른 세 수를 뽑아 곱한 값 중 가장 ${big ? '큰' : '작은'} 수는?`, v, {
          signed: true,
          explain: big ? `곱이 가장 크려면 곱이 양수이어야 하므로 음수 두 개를 모두 뽑고, 양수는 절댓값이 큰 ${Math.max(p1, p2)}${tail(Math.max(p1, p2), '을/를')} 뽑는다. ${inl(chosen)} = ${iq(v)}이다.`
            : `곱이 가장 작으려면 곱이 음수이어야 하므로 음수는 하나만 뽑는다. 절댓값이 큰 음수 ${iq(Math.min(n1, n2))}${tail(-Math.min(n1, n2), '과/와')} 양수 두 개를 뽑는다. ${inl(chosen)} = ${iq(v)}이다.`,
          facts: { value: jsx(chosen), rule: 'pick-three-' + n }
        });
      }, { count: 2 }),
      H('hard-sign-cond', '곱·합·대소 조건으로 문자가 나타내는 수의 부호 정하기', '심52 / 기본 ①93', (d, n) => {
        // 곱(몫)의 부호로 두 수의 부호가 같은지 다른지를 먼저 정하고, 합의 부호나 대소로 어느 쪽이 음수인지 정한다.
        const a = V('a'), b = V('b'), c = V('c'), sg = (name, s) => `${name} ${s > 0 ? GT : LT} 0`;
        if (n === 0) {
          const [conds, right, why] = d.pick([
            [[`${a} × ${b} ${GT} 0`, `${a} + ${b} ${LT} 0`], [-1, -1], '곱이 양수이므로 두 수의 부호가 같고, 합이 음수이므로 두 수는 모두 음수이다.'],
            [[`${a} × ${b} ${LT} 0`, `${a} ${LT} ${b}`], [-1, 1], '곱이 음수이므로 두 수의 부호가 다르고, 작은 수가 음수이다.'],
            [[`${a} × ${b} ${LT} 0`, `${a} − ${b} ${GT} 0`], [1, -1], `곱이 음수이므로 두 수의 부호가 다르고, ${a} − ${b}가 양수이므로 ${a}가 ${b}보다 크다. 큰 수가 양수이다.`],
            [[`${a} ÷ ${b} ${GT} 0`, `${a} + ${b} ${LT} 0`], [-1, -1], '몫이 양수이므로 두 수의 부호가 같고, 합이 음수이므로 두 수는 모두 음수이다.'],
            [[`${a} × ${b} ${LT} 0`, `${a} ${GT} ${b}`], [1, -1], '곱이 음수이므로 두 수의 부호가 다르고, 큰 수가 양수이다.']
          ]);
          const rows = d.shuffle([[1, 1], [1, -1], [-1, 1], [-1, -1]]);
          return C(`두 수 ${a}, ${b}에 대하여 ${conds.map(nb).join(', ')}일 때, ${a}, ${b}의 부호를 바르게 나타낸 것은?`, rows.map(([s, t]) => `${sg(a, s)}, ${sg(b, t)}`), rows.findIndex((r) => r.join() === right.join()), {
            explain: `${why} ${sg(a, right[0])}, ${sg(b, right[1])}이다.`, facts: { truth: rows.map((r) => r.join() === right.join()), want: true, rule: 'sign-cond-two' }
          });
        }
        if (n === 1) {
          const [conds, right, why] = d.pick([
            [[`${a} ${LT} ${b}`, `${a} × ${b} ${LT} 0`, `${a} × ${c} ${GT} 0`], [-1, 1, -1], `${a} × ${b}가 음수이므로 ${a}, ${b}의 부호가 다르고, 작은 수 ${a}가 음수이다. ${a} × ${c}가 양수이므로 ${c}의 부호는 ${a}와 같다.`],
            [[`${a} ${GT} ${b}`, `${a} × ${b} ${LT} 0`, `${b} × ${c} ${GT} 0`], [1, -1, -1], `${a} × ${b}가 음수이므로 ${a}, ${b}의 부호가 다르고, 큰 수 ${a}가 양수이다. ${b} × ${c}가 양수이므로 ${c}의 부호는 ${b}와 같다.`],
            [[`${a} × ${b} ${GT} 0`, `${a} + ${b} ${LT} 0`, `${a} × ${c} ${LT} 0`], [-1, -1, 1], `${a} × ${b}가 양수이므로 ${a}, ${b}의 부호가 같고, 합이 음수이므로 둘 다 음수이다. ${a} × ${c}가 음수이므로 ${c}의 부호는 ${a}와 다르다.`]
          ]);
          const others = d.shuffle([[1, 1, 1], [1, 1, -1], [1, -1, 1], [1, -1, -1], [-1, 1, 1], [-1, 1, -1], [-1, -1, 1], [-1, -1, -1]].filter((r) => r.join() !== right.join())).slice(0, 3), rows = d.shuffle([right].concat(others));
          return C(`세 수 ${a}, ${b}, ${c}에 대하여 ${conds.map(nb).join(', ')}일 때, ${a}, ${b}, ${c}의 부호를 바르게 나타낸 것은?`, rows.map(([s, t, u]) => `${sg(a, s)}, ${sg(b, t)}, ${sg(c, u)}`), rows.findIndex((r) => r.join() === right.join()), {
            explain: `${why} ${sg(a, right[0])}, ${sg(b, right[1])}, ${sg(c, right[2])}이다.`, facts: { truth: rows.map((r) => r.join() === right.join()), want: true, rule: 'sign-cond-three' }
          });
        }
        // 절댓값이 정해진 두 수: 곱이 음수이면 부호가 다르고, 합의 부호는 절댓값이 큰 수의 부호와 같다.
        const [x, y] = d.until(() => [fr(d, [2, 3, 4, 5], 1), fr(d, [3, 5, 7], 1)], ([p, q]) => p.q !== q.q && qcmp(p, q) !== 0), sumNeg = d.bool(), bigFirst = qcmp(x, y) > 0;
        const right = (sumNeg === bigFirst) ? [-1, 1] : [1, -1], rows = d.shuffle([[1, 1], [1, -1], [-1, 1], [-1, -1]]), show2 = ([s, t]) => `${tx(signedQ(s, x))}, ${tx(signedQ(t, y))}`;
        return C(`두 수의 절댓값이 차례로 ${mag(x)}, ${mag(y)}이다. 두 수의 곱은 음수이고 합은 ${sumNeg ? '음수' : '양수'}일 때, 두 수를 차례대로 쓴 것은?`, rows.map(show2), rows.findIndex((r) => r.join() === right.join()), {
          explain: `곱이 음수이므로 두 수의 부호가 다르다. 부호가 다른 두 수의 합의 부호는 절댓값이 큰 수의 부호와 같다. 절댓값은 ${mag(bigFirst ? x : y)}${tail(lastOf(bigFirst ? x : y), '이/가')} 더 크고 합이 ${sumNeg ? '음수' : '양수'}이므로 두 수는 ${show2(right)}이다.`,
          facts: { truth: rows.map((r) => r.join() === right.join()), want: true, rule: 'sign-cond-abs' }
        });
      }, { count: 3 }),
      H('hard-score', '맞히면 얻고 틀리면 잃는 점수 계산', '기본 ②87', (d) => {
        // 틀린 문제의 수를 먼저 구하고, 얻은 점수와 잃은 점수를 곱셈으로 구하여 더한다.
        const [total, right, gain, loss] = d.until(() => [d.pick([10, 12, 15, 20]), d.int(3, 12), d.int(3, 6), d.int(2, 5)], (r) => r[1] < r[0] - 2 && r[2] > r[3] && r[2] * r[1] !== r[3] * (r[0] - r[1])), wrong = total - right, v = gain * right - loss * wrong;
        return N(`퀴즈 대회에서 0점으로 시작하여 한 문제를 맞히면 +${gain}점, 틀리면 −${loss}점을 받는다. ${total}문제 가운데 ${right}문제를 맞히고 나머지를 모두 틀린 학생의 점수는 몇 점인가?`, v, {
          unit: '점', signed: true, explain: `틀린 문제는 ${total} − ${right} = ${wrong}(문제)이다. 점수는 (+${gain}) × ${right} + (−${loss}) × ${wrong} = ${gain * right} + (−${loss * wrong}) = ${iq(v)}(점)이다.`,
          facts: { value: `${gain}*${right}+(-${loss})*(${total}-${right})` }
        });
      }),
      H('hard-box-muldiv', '한쪽을 먼저 계산하는 □가 있는 곱셈·나눗셈 식', '기본 ②77 / 심38', (d) => {
        // □ 앞의 식을 먼저 계산하여 (수) × □ = (수) 꼴로 만든 다음 거꾸로 한 번 계산한다.
        const [known, x, r] = d.until(() => { const e = [W(Q(-1, d.pick([2, 3])), 2), '/', S(qneg(fr(d, [3, 5, 10], 1)))], k = Q(pm(d) * d.int(2, 30)); return [e, k, qmul(val(e), k)]; }, (m) => m[2].q <= 6 && Math.abs(m[2].p) <= 60 && Math.abs(m[2].p) > 1), k = val(known);
        return ansV('□ 안에 알맞은 수는?', x, 'int', {
          figure: ex(`${html(known)} <i>×</i> ${box()} <i>=</i> ${tx(r)}`),
          explain: `□ 앞의 식을 먼저 계산하면 ${chainOf(known)}이다. ${px(k)} × □ = ${tx(r)}이므로 □ = ${divTold(r, k)}이다.`,
          facts: { value: `${js(r)}/(${jsx(known)})` }
        });
      }),
      H('hard-box-recip', '곱이 1인 수가 마주 보는 상자에서 세 수의 곱', '심34', (d) => {
        // 곱이 1인 두 수는 서로 역수이다. 역수의 부호는 처음 수와 같으므로 음수의 개수는 그대로이다.
        const xs = d.until(() => d.shuffle([Q(pm(d) * d.int(2, 5)), signedQ(pm(d), fr(d, [2, 3, 4, 5], 1.5)), Q(pm(d) * d.int(2, 5))]), (list) => { const v = qdiv(Q(1), list.reduce(qmul)); return v.q > 1 && v.q <= 60 && distinct(list.map(qabs)) && list.some((x) => x.p < 0); });
        const ys = xs.map((x) => qdiv(Q(1), x)), list = [S(ys[0]), '*', S(ys[1]), '*', S(ys[2])];
        return ansV(`상자의 여섯 면에 수가 하나씩 적혀 있고, 마주 보는 면에 적힌 두 수의 곱은 1이다. 서로 마주 보지 않는 세 면에 적힌 수가 ${xs.map(tx).join(', ')}일 때, 나머지 세 면에 적힌 수의 곱은?`, val(list), 'frac', {
          explain: `곱이 1인 두 수는 서로 역수이다. 나머지 세 면에 적힌 수는 ${xs.map(tx).join(', ')}의 역수인 ${ys.map(tx).join(', ')}이다. ${chainOf(list)}이다.`,
          facts: { value: xs.map((x) => `(1/${js(x)})`).join('*'), unseen: [1] }
        });
      })
    ]
  });

  // ── 기본 묶음에 덧붙이는 꼴 ──
  // 수집본 기본 문서에 나오고 기본에서 하는 일을 다시 묻는 꼴은 실력이 아니라 기본 묶음에 싣는다(견주기, 설명 가리기, 틀린 줄 찾기, 한쪽 끝만 있는 정수 세기, 이어 더하는 문장제).
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  B.addTypes('7-1-2', 'order', [
    T('order-count-ints', '음의 분수보다 큰 음의 정수, 음이 아닌 정수의 개수', '②85 심46', (d, n) => {
      // 함정: −19/2보다 큰 첫 정수를 −10으로 대는 아이(음수 쪽에서는 절댓값이 작은 쪽이 크다), 「음수가 아닌 정수」에서 0을 빼는 아이.
      if (n === 0) {
        const x = d.until(() => Q(-d.int(7, 39), d.pick([2, 3, 4])), (v) => v.q > 1 && fl(v) > -11), first = Math.ceil(fl(x)), k = -first;
        return N(`${tx(x)}보다 큰 음의 정수는 모두 몇 개인가?`, k, {
          unit: '개', explain: `${tj(x, '은/는')} ${iq(first - 1)}${tail(1 - first, '과/와')} ${iq(first)} 사이의 수이므로 ${tx(x)}보다 큰 정수 가운데 가장 작은 수는 ${iq(first)}이다. ${iq(first)}부터 −1까지의 ${k}개이다.`,
          facts: { digit: { template: `(${x.p})<□*${x.q}<0`, lo: -15, hi: 5, ask: 'count' }, rule: 'count-neg-ints' }
        });
      }
      const y = d.until(() => Q(d.int(5, 29), d.pick([2, 3, 4, 5])), (v) => v.q > 1 && fl(v) < 7), last = Math.floor(fl(y));
      return N(`${tx(y)}보다 작은 정수 가운데 음수가 아닌 것은 모두 몇 개인가?`, last + 1, {
        unit: '개', explain: `음수가 아닌 정수는 0과 양의 정수이다. ${tx(y)}보다 작은 정수 가운데 가장 큰 수는 ${last}이므로 0부터 ${last}까지의 ${last + 1}개이다.`,
        facts: { digit: { template: `(-1)*${y.q}<□*${y.q}<${y.p}`, lo: -5, hi: 10, ask: 'count' }, rule: 'count-nonneg-ints' }
      });
    }, { count: 2, standard: STD4 })
  ]);
  B.addTypes('7-1-2', 'sub', [
    T('sub-change-chain', '변화량을 이어 더하는 문장제', '①54 ②43', (d) => {
      // 오르는 것은 더하고 내리는 것은 뺀다. 음수에서 시작하여 0을 넘나든다.
      if (d.bool()) {
        const [t0, up, down] = d.until(() => [-d.int(2, 9), d.int(5, 14), d.int(5, 16)], (r) => r[0] + r[1] > 0 && r[0] + r[1] - r[2] < 0 && r[1] !== r[2]), v = t0 + up - down;
        return N(`어느 날 새벽의 기온은 ${iq(t0)} °C였다. 낮에는 새벽보다 ${up} °C 올랐고, 밤에는 낮보다 ${down} °C 내려갔다. 밤의 기온은 몇 °C인가?`, v, {
          unit: '°C', signed: true, explain: `올라간 기온은 더하고 내려간 기온은 뺀다. 낮의 기온은 ${px(Q(t0))} + ${up} = ${iq(t0 + up)} (°C), 밤의 기온은 ${px(Q(t0 + up))} − ${down} = ${iq(v)} (°C)이다.`,
          facts: { value: `${js(Q(t0))}+${up}-${down}`, rule: 'chain-temp' }
        });
      }
      const [h0, up, down] = d.until(() => [-10 * d.int(8, 30), 10 * d.int(3, 12), 10 * d.int(3, 15)], (r) => r[1] !== r[2] && r[0] + r[1] < 0), v = h0 + up - down;
      return N(`바다의 수면을 0 m로 하여 수면보다 높은 곳은 +, 낮은 곳은 −로 나타낸다. ${iq(h0)} m에 있던 잠수정이 ${up} m 올라간 다음 ${down} m 내려갔다. 잠수정이 있는 곳을 부호를 사용하여 나타내면 몇 m인가?`, v, {
        unit: 'm', signed: true, explain: `올라간 거리는 더하고 내려간 거리는 뺀다. ${px(Q(h0))} + ${up} − ${down} = ${px(Q(h0 + up))} − ${down} = ${iq(v)} (m)이다.`,
        facts: { value: `${js(Q(h0))}+${up}-${down}`, rule: 'chain-depth' }
      });
    })
  ]);
  B.addTypes('7-1-2', 'mul', [
    T('mul-pow-rank', '괄호가 있는 거듭제곱과 없는 거듭제곱의 값 견주기', '①63 ②58 심30·31', (d, n) => {
      // 함정: (−2)²과 −2²을 같은 수로 여기는 아이, 괄호 밖의 −를 먼저 붙여 −(−2)³을 음수로 여기는 아이.
      //  괄호 안의 음수를 거듭 곱한 다음(짝수 번이면 양수, 홀수 번이면 음수) 괄호 밖의 −를 붙인다.
      const RULE = '괄호가 있으면 음수를 거듭 곱하고(짝수 번이면 양수, 홀수 번이면 음수), 괄호가 없으면 양수를 거듭 곱한 다음 −를 붙인다. ';
      if (n === 0) {
        const a = d.int(2, 3), rows = d.shuffle([W(Q(-a), 2), WN(Q(a), 2), W(Q(-a), 3), MN(W(Q(-a), 3))]), values = rows.map((t) => valT(t).p), big = d.bool();
        return C(`다음 중 가장 ${big ? '큰' : '작은'} 수는?`, rows.map((t) => inl([t])), values.indexOf(big ? Math.max(...values) : Math.min(...values)), {
          explain: `${RULE}차례로 ${rows.map((t) => `${inl([t])} = ${tx(valT(t))}`).join(', ')}이다.`, facts: { rank: { values, nth: big ? 1 : 4 }, rule: 'pow-rank' }
        });
      }
      if (n === 1) {
        const one = Q(1), NEG = [WN(one, 2), MN(W(Q(-1), 2)), W(Q(-1), 3), WN(one, 3), W(Q(-1), 5)], POS = [W(Q(-1), 2), MN(W(Q(-1), 3)), W(Q(-1), 4), MN(W(Q(-1), 5))];
        const oddPos = d.bool(), many = d.shuffle(oddPos ? NEG : POS).slice(0, 3), odd = d.pick(oddPos ? POS : NEG), rows = d.shuffle(many.concat([odd]));
        return C('다음 중 계산 결과가 나머지 셋과 다른 하나는?', rows.map((t) => inl([t])), rows.indexOf(odd), {
          explain: `${RULE}차례로 ${rows.map((t) => `${inl([t])} = ${tx(valT(t))}`).join(', ')}이다.`, facts: { truth: rows.map((t) => t === odd), want: true, rule: 'pow-odd' }
        });
      }
      const a = d.int(2, 3), rows = d.shuffle([U(Q(a)), W(Q(-1, a), 2), WN(Q(a), 2), W(Q(-a), 2), MN(W(Q(-1, a), 2))]), values = rows.map((t) => fl(valT(t))), small = d.bool(), k = d.int(2, 4);
      const sorted = rows.slice().sort((x, y) => (small ? 1 : -1) * (fl(valT(x)) - fl(valT(y))));
      return C(`다음 수를 ${small ? '작은' : '큰'} 수부터 차례대로 놓을 때, ${ORD[k]} 번째에 오는 수는?`, rows.map((t) => inl([t])), rows.indexOf(sorted[k - 1]), {
        explain: `${RULE}${rows.filter((t) => t.k !== 'u').map((t) => `${inl([t])} = ${tx(valT(t))}`).join(', ')}이다. ${small ? '작은' : '큰'} 수부터 놓으면 ${sorted.map((t) => inl([t])).join(', ')}이다.`,
        facts: { rank: { values, nth: small ? 6 - k : k }, rule: 'pow-order' }
      });
    }, { count: 3 })
  ]);
  B.addTypes('7-1-2', 'div', [
    T('div-recip-claims', '역수에 대한 설명 가리기', '①76 ②71·72 심33', (d) => {
      // 함정: 역수를 구하며 부호를 바꾸는 아이, 0의 역수를 0이라 하는 아이, 소수의 숫자만 뒤집는 아이(0.3 → 3), −1을 빠뜨리는 아이.
      const a = d.int(2, 9), f = fr(d, [3, 5, 7], 2), t = d.pick([3, 7, 9]), r = qdiv(Q(1), f), wantTrue = d.bool();
      const YES = ['1의 역수는 1이다.', '−1의 역수는 −1이다.', `${tx(qneg(f))}의 역수는 ${tx(qneg(r))}이다.`, '0의 역수는 없다.', `0.${t}의 역수는 ${frac(10, t)}이다.`, `−${a}의 역수는 −${frac(1, a)}이다.`];
      const NO = [
        ['0의 역수는 0이다.', '0에 어떤 수를 곱하여도 1이 될 수 없으므로 0의 역수는 없다.', '0의 역수는 없다.'],
        [`−${a}의 역수는 ${frac(1, a)}이다.`, `(−${a}) × ${frac(1, a)} = −1이다. −${a}의 역수는 −${frac(1, a)}이다.`, `−${a}의 역수는 −${frac(1, a)}이다.`],
        [`0.${t}의 역수는 ${t}이다.`, `0.${t} = ${frac(t, 10)}이므로 0.${t}의 역수는 ${frac(10, t)}이다.`, `0.${t}의 역수는 ${frac(10, t)}이다.`],
        [`${tx(f)}의 역수는 ${tx(qneg(r))}이다.`, `역수의 부호는 처음 수의 부호와 같다. ${tx(f)}의 역수는 ${tx(r)}이다.`, `${tx(qneg(f))}의 역수는 ${tx(qneg(r))}이다.`],
        ['역수가 자기 자신과 같은 수는 1뿐이다.', '−1의 역수도 −1이다.', '−1의 역수는 −1이다.'],
        ['어떤 수와 그 수의 역수를 더하면 1이 된다.', '어떤 수와 그 수의 역수를 곱하면 1이 된다.']
      ];
      return claimQ(d, `역수에 대한 설명으로 ${wantTrue ? '옳은' : '옳지 않은'} 것은?`, YES, NO, wantTrue);
    })
  ]);
  B.addTypes('7-1-2', 'mix', [
    T('mix-first-wrong', '계산 과정에서 처음으로 틀린 곳 찾기', '①80 ②75 심36·37', (d, n) => {
      // 함정: 뺄셈·나눗셈에서도 뒤의 두 수를 먼저 계산하는 아이(결합법칙은 덧셈·곱셈에서만 성립한다), 부호가 다른 두 수의 합을 절댓값의 합으로 구하는 아이,
      //  곱의 부호를 음수의 개수로 정하지 않는 아이. 틀린 줄 다음은 틀린 값으로 바르게 이어 간다.
      const at = d.int(0, 2);
      if (n === 0) {
        const x = d.int(2, 9), y = d.int(11, 19), z = d.until(() => d.int(2, 9), (v) => x + v !== y && v !== x), v = x - y + z, first = [U(Q(x)), '-', U(Q(y)), '+', U(Q(z))], added = [P(Q(x)), '+', P(Q(-y)), '+', P(Q(z))];
        const rows = at === 0 ? [`${x} <i>−</i> (${y} <i>+</i> ${z})`, `${x} <i>−</i> ${y + z}`, iq(x - y - z)]
          : at === 1 ? [html(added), html([P(Q(x)), '+', P(Q(-(y + z)))]), iq(x - y - z)]
            : [html(added), html([P(Q(x + z)), '+', P(Q(-y))]), iq(-(x + z + y))];
        const why = at === 0 ? `뺄셈에서는 뒤의 두 수를 먼저 더하면 값이 달라진다. ${x} − ${y} + ${z}${tail(z, '은/는')} 앞에서부터 계산하거나 덧셈으로 고쳐서 계산한다.`
          : at === 1 ? `(−${y}) + (+${z})${tail(z, '은/는')} 부호가 다른 두 수의 합이므로 절댓값의 차에 절댓값이 큰 수의 부호를 붙인 −${y - z}이다.`
            : `(+${x + z}) + (−${y})${tail(y, '은/는')} 부호가 다른 두 수의 합이므로 절댓값의 차 ${Math.abs(x + z - y)}에 절댓값이 큰 수의 부호를 붙인다.`;
        return C('다음 계산 과정에서 처음으로 틀린 곳은?', LAB.slice(0, 3), at, {
          figure: proc([{ h: html(first) }].concat(rows.map((h, i) => ({ h, mark: LAB[i] })))), explain: `${why} 바르게 계산하면 ${chainOf(added)}이다.`,
          facts: { truth: [0, 1, 2].map((i) => i === at), want: true, rule: 'first-wrong-add' }
        });
      }
      const [x, y, z] = d.until(() => { const b = pm(d) * d.pick([2, 3, 4, 6]), c = pm(d) * d.pick([2, 3]); return [pm(d) * Math.abs(b * c) * d.int(1, 3), b, c]; }, (r) => r.some((k) => k < 0) && Math.abs(r[0]) <= 48);
      const v = x / y * z, s = v < 0 ? MINUS : '+', bad = v < 0 ? '+' : MINUS, m = `${Math.abs(x)} × ${frac(1, Math.abs(y))} × ${Math.abs(z)}`, first = [P(Q(x)), '/', P(Q(y)), '*', P(Q(z))], recip = html([P(Q(x)), '*', P(Q(1, y)), '*', P(Q(z))]);
      const rows = at === 0 ? [`${px(Q(x))} <i>÷</i> {${px(Q(y))} <i>×</i> ${px(Q(z))}}`, html([P(Q(x)), '/', P(Q(y * z))]), tx(Q(x, y * z))]
        : at === 1 ? [recip, `${bad}(${m.replace(/×/g, '<i>×</i>')})`, tx(Q(-v))]
          : [recip, `${s}(${m.replace(/×/g, '<i>×</i>')})`, tx(Q(x, y * z))];
      const why = at === 0 ? '나눗셈에서는 뒤의 두 수를 먼저 곱하면 값이 달라진다. 곱셈과 나눗셈이 섞여 있는 식은 앞에서부터 차례대로 계산하거나 나눗셈을 역수의 곱셈으로 고쳐서 계산한다.'
        : at === 1 ? `음수가 ${[x, y, z].filter((k) => k < 0).length}개이므로 곱의 부호는 ${s}이다.` : `${m}의 값은 ${Math.abs(v)}이다. 역수로 고친 수는 ${frac(1, Math.abs(y))} 하나뿐이다.`;
      return C('다음 계산 과정에서 처음으로 틀린 곳은?', LAB.slice(0, 3), at, {
        figure: proc([{ h: html(first) }].concat(rows.map((h, i) => ({ h, mark: LAB[i] })))), explain: `${why} 바르게 계산하면 ${inl(first)} = ${inl([P(Q(x)), '*', P(Q(1, y)), '*', P(Q(z))])} = ${s}(${m}) = ${iq(v)}이다.`,
        facts: { truth: [0, 1, 2].map((i) => i === at), want: true, rule: 'first-wrong-mul' }
      });
    }, { count: 2 })
  ]);

  // 정수 뒤 토씨(음수는 절댓값으로 맞춘다)
  function josaNum(n, pair) { return iq(n) + tail(Math.abs(n), pair); }
})(typeof window !== 'undefined' ? window : globalThis);
