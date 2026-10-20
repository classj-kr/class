// 고등학교 1학년 2학기 공통수학2 Ⅲ-1 「함수」 — 실력 문항.
// 단원 틀과 도구, 싣는 기준, 뺀 것과 까닭은 10-2-6a.js 에 있다. ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번, 심n = 심화꼴의 n번.
//
// 이 단원에서 아이들이 흔히 잘못 아는 것(실력 ①의 장치는 이 잘못을 가진 아이가 걸리게 만들었다)
//  - 항등함수는 식이 f(x) = x 여야 한다고 여긴다(정의역의 원소마다 f(x) = x 이기만 하면 된다).
//  - 함수와 그 역함수의 그래프의 교점은 언제나 직선 y = x 위에 있다고 여긴다(y = −x + b 는 역함수와 일치한다).
//  - f = f⁻¹(곧 f ∘ f 가 항등함수)인 일대일대응은 원소 두 개씩 서로 바꾸거나 제자리에 있다는 것을 놓친다.
//  - 이차함수에서 서로 다른 두 수의 함숫값이 같으면 두 수의 가운데가 축이라는 것을 놓친다.
//  - 역함수가 존재하는 조각 함수는 일대일대응이므로 두 조각이 이어져야 한다는 것을 놓친다. 조각마다 푼 해가 그 조각의 범위에 드는지 따지지 않는다.
//  - (f ∘ g)⁻¹ 를 f⁻¹ ∘ g⁻¹ 로 차례를 그대로 둔다. f⁻¹(g(x)) = 2x 같은 식의 양쪽에 f 를 씌우면 f⁻¹ 이 지워진다는 것을 쓰지 못한다.
//
// 실력에는 ① 문제의 식·그림·상황에 함정이 있어 뜻을 정확히 대야 풀리는 문제와 ② 세 단계 넘게 이어 생각해야 풀리는 문제만 실었다.
// 수집본 기본 문서에 여러 번 나오는 꼴(세 함수의 조건 맞추기, 되풀이 조건으로 정한 함수, 이차함수가 구간에서 일대일대응, 역함수 성질로 줄이는 합성값,
// 역함수·합성의 조건으로 함수 구하기)은 기본 묶음에 두었다.
// 「꼬여 있다」「경우를 따져야 한다」는 까닭으로 빼지 않은 것: 조건이 붙은 일대일대응의 개수(①28), f = f⁻¹인 일대일대응의 개수(①29), 두 일대일대응의 일부 값(②41), 원소마다 조건이 붙은 함수의 개수(심5).
// 묻는 말: 수나 값은 「~은?/~는?」, 양은 「몇 ~인가?」, 시키는 말은 「~하시오.」 문자는 값을 물으면 「상수 a」, 범위·최댓값·최솟값을 물으면 「실수 a」로 부른다(맨 「수 a」는 쓰지 않는다).
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, lines, frac, N, M, C, inline } = B.kit;
  const { LAB, MINUS, GE, LE, GT, LT, range, Q, qadd, qsub, qmul, qdiv, qneg, isInt, fl, mag, tx, nb, js, V, sup, nz, pm, ansV, asQ, poly, plain, rt } = B.kit.mid;
  const K6 = B.kit.m1026;
  const { S1, S2, S3, sourceOf, X, Y, FN, GN, HN, A, BB, CC, K, MM, NN, X2, SX, SY, iq, jn, sgn, is, isj, iv, at, cat, setOf, jw, P, pv, pshow, fdef, pjs, pw, vals, pickRows } = K6;
  const retry = (make) => (d, n) => { for (let i = 0; i < 400; i += 1) { const v = make(d, n); if (v) return v; } throw new Error('문항을 만들지 못했다'); };
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: ref.startsWith('기본 ') ? '수집본 기본 자료(' + ref.slice(3) + ')' : sourceOf(ref), make: retry(make) }, more || {});
  const tm = (k, v) => poly([[k, v || '']]);
  const cf = (k) => { const q = asQ(k); return q.p === q.q ? '' : q.p === -q.q ? MINUS : tx(q); };
  const cx2 = (fs) => cat(fs, X);
  const pAt = (p, v) => poly(p.map((c, i) => [c, i === 0 ? '' : i === 1 ? v : v + sup(i)]).reverse());   // 문자 v 로 적은 다항식
  // {1, …, n}의 순열 전부
  function perms(list) { if (list.length <= 1) return [list.slice()]; const out = []; list.forEach((v, i) => { for (const p of perms(list.slice(0, i).concat(list.slice(i + 1)))) out.push([v].concat(p)); }); return out; }
  const fmt = (v) => String(Number(v.toFixed(4)));
  const dec = (v) => (v < 0 ? MINUS : '') + fmt(Math.abs(v));

  B.addGroup('10-2-6', {
    id: 'hard', title: '단원 종합', standard: S3,
    types: [
      // ── ① 식·그림·상황에 함정이 있어 뜻을 정확히 대야 풀리는 문제 ──
      H('hard-identity-piece', '항등함수가 되는 조각 함수의 상수', '심4', (d) => {
        // 함정: 항등함수이려면 식이 x 여야 한다고 여기는 아이(정의역이 두 원소뿐이라 이차식이어도 원소마다 f(x) = x 이면 된다).
        const u = d.int(-4, -1), v = d.int(1, 4), p = d.pick([2, 3, -1, -2]), q = d.int(-3, 3), a = u - p * u, b = v - v * v - q * v;
        if (a === 0 || b === 0) return null;
        return vals(`집합 ${is(SX, setOf([u, v]))}에 대하여 ${SX}에서 ${SX}로의 함수 ${FN}(${X}) = ${pw([[nb(`${tm(p, X)} + ${A}`), `${X} ${LT} 0`], [nb(`${poly([[1, X2], [q, X]])} + ${BB}`), `${X} ${GE} 0`]])}가 항등함수일 때, 상수 ${A}, ${BB}의 값은?`, [[A, a], [BB, b]], {
          explain: `항등함수는 정의역의 원소마다 ${is(at(FN, X), X)}이면 된다(식이 ${X}일 필요는 없다). ${is(at(FN, u), u)}에서 ${nb(`${iq(p * u)} + ${A} = ${iq(u)}`)}, ${is(A, a)}이고, ${is(at(FN, v), v)}에서 ${nb(`${iq(v * v + q * v)} + ${BB} = ${iq(v)}`)}, ${is(BB, b)}이다.`,
          facts: { calc: [[`${jn(u)}-${jn(p)}*${jn(u)}`, 0], [`${jn(v)}-${jn(v)}*${jn(v)}${q ? (q > 0 ? '-' : '+') + Math.abs(q) + '*' + jn(v) : ''}`, 1]], unseen: [1] }
        });
      }, { standard: S1 }),
      H('hard-line-inverse-meet', 'y = ax + b와 역함수 그래프의 교점 위치', '기본 ②49', (d, n) => {
        // 함정: 함수와 역함수의 그래프의 교점은 늘 y = x 위에 있다고 여기는 아이(기울기가 −1이면 두 그래프가 일치한다).
        const b1 = nz(d, -6, 6), b2 = nz(d, -6, 6), b3 = nz(d, -6, 6), b4 = nz(d, -6, 6), a3 = d.pick([2, 3, Q(1, 2)]), a4 = d.pick([-2, -3, Q(-1, 2)]);
        const rows = n === 0
          ? [[nb(`${Y} = ${pshow(P(b1, -1))}`), true], [nb(`${Y} = ${pshow(P(b2, 1))}`), false], [nb(`${Y} = ${pshow(P(b3, a3))}`), false], [nb(`${Y} = ${pshow(P(b4, a4))}`), false]]
          : [[nb(`${Y} = ${pshow(P(b1, 1))}`), true], [nb(`${Y} = ${pshow(P(b2, -1))}`), false], [nb(`${Y} = ${pshow(P(b3, a3))}`), false], [nb(`${Y} = ${pshow(P(b4, a4))}`), false]];
        const ask = n === 0 ? `그 역함수의 그래프와 직선 ${is(Y, X)} 위에 있지 않은 점에서도 만나는 것은?` : '그 역함수의 그래프와 만나지 않는 것은?';
        return pickRows(d, `다음 일차함수 가운데 ${ask}`, rows, {
          explain: `기울기가 ${MINUS}1인 직선 ${is(Y, nb(`${MINUS}${X} + ${BB}`))}의 역함수는 자기 자신이므로 두 그래프가 일치하여 ${is(Y, X)} 밖의 점에서도 만난다. 기울기가 1이고 ${Y}절편이 0이 아닌 직선은 역함수의 그래프와 평행하여 만나지 않는다. 나머지 일차함수는 역함수의 그래프와 직선 ${is(Y, X)} 위의 한 점에서만 만난다.`
        });
      }, { count: 2 }),
      H('hard-sym-axis-comp', '이차함수의 합성값이 같을 때 상수', '심3', (d) => {
        // 함정: (f∘f)(p) = (f∘f)(q)에서 f(p) = f(q)로만 보는 아이(f(p) ≠ f(q)이면 두 값이 축에 대칭이다).
        const h = d.int(-2, 3), p = d.int(-2, 5), q = p + 2 * d.int(1, 3), aNum = 2 * h - p * p - q * q + 2 * h * (p + q);
        if (p + q === 2 * h || aNum % 2 !== 0) return null;
        const a = aNum / 2, f = (x) => x * x - 2 * h * x + a, r = d.until(() => d.int(-3, 6), (v) => v !== p && v !== q);
        if (a === 0 || h === 0) return null;
        return N(`함수 ${nb(`${FN}(${X}) = ${poly([[1, X2], [-2 * h, X]])} + ${A}`)}가 ${is(cat([FN, FN], p), cat([FN, FN], q))}를 만족시킬 때, ${at(FN, r)}의 값은? (단, ${A}는 상수이다.)`, f(r), { signed: true,
          explain: `${is(at(FN, p), poly([[1, A], [p * p - 2 * h * p, '']]))}, ${is(at(FN, q), poly([[1, A], [q * q - 2 * h * q, '']]))}이므로 ${jw(at(FN, p), '과/와')} ${jw(at(FN, q), '은/는')} 서로 다르다. 그런데 ${nb(`${FN}(${at(FN, p)}) = ${FN}(${at(FN, q)})`)}이므로 서로 다른 두 수 ${at(FN, p)}, ${jw(at(FN, q), '의')} 함숫값이 같다. 따라서 두 수는 축 ${is(X, h)}에 대하여 대칭이다. ${nb(`${at(FN, p)} + ${at(FN, q)} = ${2 * h}`)}에서 ${is(A, a)}이므로 ${is(at(FN, r), f(r))}이다.`,
          facts: { value: `${jn(r)}*${jn(r)}-2*${jn(h)}*${jn(r)}+(2*${jn(h)}-${jn(p)}*${jn(p)}-${jn(q)}*${jn(q)}+2*${jn(h)}*(${jn(p)}+${jn(q)}))/2`, unseen: [2, Math.abs(h)] }
        });
      }, { standard: S2 }),
      H('hard-inv-of-g', 'f⁻¹(g(x)) = mx에서 g(k)', '심7', (d) => {
        // 함정: f⁻¹ 의 식을 먼저 구하려는 아이. 양쪽에 f 를 씌우면 g(x) = f(mx)이다.
        const c = nz(d, -6, 6), m = d.pick([2, 3]), k = d.int(1, 4), v = m * m * k * k + c;
        return N(`${nb(`${X} ${GE} 0`)}에서 정의된 함수 ${fdef(FN, P(c, 0, 1))}의 치역은 ${nb(`{${Y} | ${Y} ${GE} ${iq(c)}}`)}이다. 함수 ${jw(GN, '이/가')} ${nb(`${X} ${GE} 0`)}인 모든 실수 ${X}에 대하여 ${is(at(iv(FN), at(GN, X)), `${m}${X}`)}를 만족시킬 때, ${at(GN, k)}의 값은?`, v, { signed: true,
          explain: `${is(at(iv(FN), at(GN, X)), `${m}${X}`)}의 양쪽에 ${jw(FN, '을/를')} 합성하면 ${is(at(FN, at(iv(FN), at(GN, X))), at(FN, `${m}${X}`))}, 곧 ${is(at(GN, X), at(FN, `${m}${X}`))}이다. 따라서 ${is(at(GN, k), at(FN, m * k))} = ${iq(v)}이다.`,
          facts: { value: `${m}*${k}*${m}*${k}+${jn(c)}` }
        });
      }),
      H('hard-quad-inverse-two', '이차함수와 그 역함수의 그래프가 두 점에서 만나는 조건', '심6', (d) => {
        // 함정: 판별식만 보고 정의역의 끝(꼭짓점이 y = x 위인가)을 따지지 않는 아이.
        const c = d.int(1, 4), lo = Q(4 * c - 1, 4);
        const range_ = (l, r) => nb(`${l} ${K} ${r}`);
        const rows = [[range_(`${tx(lo)} ${LT}`, `${LE} ${c}`), true], [range_(`${tx(lo)} ${LT}`, `${LT} ${c}`), false], [range_(`${tx(lo)} ${LE}`, `${LE} ${c}`), false], [nb(`${K} ${GT} ${tx(lo)}`), false]];
        return pickRows(d, `정의역이 ${nb(`{${X} | ${X} ${GE} ${K}}`)}, 공역이 ${nb(`{${Y} | ${Y} ${GE} ${c}}`)}인 함수 ${nb(`${FN}(${X}) = (${X} ${MINUS} ${K})${sup(2)} + ${c}`)}의 역함수를 ${GN}라 하자. 두 함수 ${is(Y, at(FN, X))}, ${is(Y, at(GN, X))}의 그래프가 서로 다른 두 점에서 만나도록 하는 실수 ${jw(K, '의')} 값의 범위는?`, rows, {
          explain: `${FN}는 증가하므로 두 그래프의 교점은 ${is(Y, at(FN, X))}와 직선 ${is(Y, X)}의 교점이다. 꼭짓점 ${nb(`(${K}, ${c})`)}가 직선 ${is(Y, X)}보다 아래에 있으면 교점은 하나뿐이므로 ${nb(`${K} ${LE} ${c}`)}이어야 한다. 또 ${nb(`(${X} ${MINUS} ${K})${sup(2)} + ${c} = ${X}`)}가 서로 다른 두 실근을 가져야 하므로 판별식에서 ${nb(`4${K} ${MINUS} ${4 * c - 1} ${GT} 0`)}, ${nb(`${K} ${GT} ${tx(lo)}`)}이다. 따라서 ${range_(`${tx(lo)} ${LT}`, `${LE} ${c}`)}이다.`
        });
      }),
      H('hard-piece-inverse-cond', '조건으로 조각 함수를 정한 뒤 역함숫값', '기본 ②25', (d) => {
        // 함정: 역함수가 존재하므로 두 조각이 이어져야 한다는 것을 놓치는 아이.
        const t = d.int(1, 3), a = nz(d, -6, 6), b = d.int(2, 4), c = b * t - t - a, q = t + d.int(1, 6), p = q + a;
        if (c === 0) return null;
        const xm = t - d.int(1, 4), m = b * xm - c;
        return N(`실수 전체의 집합에서 정의된 함수 ${FN}(${X}) = ${pw([[nb(`${X} + ${A}`), `${X} ${GE} ${t}`], [nb(`${BB}${X} ${sgn(-c)}`), `${X} ${LT} ${t}`]])}의 역함수가 존재하고 ${is(at(iv(FN), p), q)}일 때, ${at(iv(FN), m)}의 값은? (단, ${A}, ${BB}는 상수이다.)`, xm, { signed: true,
          explain: `${is(at(iv(FN), p), q)}에서 ${is(at(FN, q), p)}, ${nb(`${q} + ${A} = ${iq(p)}`)}이므로 ${is(A, a)}이다. 역함수가 존재하면 ${FN}는 일대일대응이므로 두 직선은 ${is(X, t)}에서 이어져야 한다. ${nb(`${t} ${sgn(a)} = ${tm(t, BB)} ${sgn(-c)}`)}에서 ${is(BB, b)}이다. ${is(at(FN, t), t + a)}이므로 ${jw(iq(m), '은/는')} ${nb(`${X} ${LT} ${t}`)}인 쪽에서 나온다. ${nb(`${b}${X} ${sgn(-c)} = ${iq(m)}`)}에서 ${is(X, xm)}이다.`,
          facts: { value: `(${jn(m)}+${jn(c)})/((${t}+${jn(p)}-${q}+${jn(c)})/${t})`, unseen: [Math.abs(c), t] }
        });
      }, { standard: S3 }),
      H('hard-involution-count', 'f ∘ f가 항등함수(f = f⁻¹)인 일대일대응의 개수', '기본 ①29', (d, n) => {
        // 함정: f = f⁻¹ 이면 원소 두 개씩 서로 바꾸거나 제자리에 있다는 것을 놓치고 일대일대응을 모두 세는 아이.
        if (n === 0) {
          const k = d.pick([4, 5]), xs = range(1, k), pairs = k * (k - 1) / 2, two = k === 4 ? 3 : 15, total = 1 + pairs + two;
          return N(`집합 ${is(SX, setOf(xs))}에 대하여 ${SX}에서 ${SX}로의 일대일대응 ${FN} 가운데 ${SX}의 모든 원소 ${X}에 대하여 ${is(cx2([FN, FN]), X)}를 만족시키는 것의 개수는?`, total, {
            explain: `${is(cx2([FN, FN]), X)}이면 ${is(FN, iv(FN))}이므로 ${is(at(FN, A), BB)}이면 ${is(at(FN, BB), A)}이다. 곧 원소는 제자리에 있거나 두 개씩 서로 바뀐다. 모두 제자리 1개, 한 쌍만 바뀌는 것 ${pairs}개, 두 쌍이 바뀌는 것 ${two}개이므로 ${1 + pairs + two}개이다.`,
            facts: { value: `1+${pairs}+${two}`, unseen: [1, pairs, two], rule: 'invol-all' }
          });
        }
        const xs = d.pick([[1, 3, 5, 7], [1, 2, 3, 4], [2, 4, 6, 8], [1, 2, 4, 8]]), invols = perms([0, 1, 2, 3]).filter((p) => p.every((v, i) => p[v] === i));
        const c = d.until(() => { const [i, j] = d.shuffle([0, 1, 2, 3]).slice(0, 2), dd = d.pick([-6, -4, -3, -2, -1, 1, 2, 3, 4, 6]); return { i, j, dd, sols: invols.filter((p) => xs[p[i]] - xs[p[j]] === dd) }; }, (v) => v.sols.length >= 2 && v.sols.length <= 4);
        const show = (p) => nb('(' + xs.map((_, i) => xs[p[i]]).join(', ') + ')');
        return N(`집합 ${is(SX, setOf(xs))}에 대하여 ${SX}에서 ${SX}로의 일대일대응 ${FN}가 ${is(FN, iv(FN))}, ${jw(is(nb(`${at(FN, xs[c.i])} ${MINUS} ${at(FN, xs[c.j])}`), c.dd), '을/를')} 만족시킬 때, 함수 ${jw(FN, '의')} 개수는?`, c.sols.length, {
          explain: `${is(FN, iv(FN))}이면 원소는 제자리에 있거나 두 개씩 서로 바뀐다. 이런 일대일대응 10개 가운데 조건을 만족시키는 것을 ${nb(`(${xs.map((x) => at(FN, x)).join(', ')})`)}로 적으면 ${c.sols.map(show).join(', ')}의 ${c.sols.length}개이다.`,
          facts: { value: String(c.sols.length), unseen: [c.sols.length], rule: 'invol-cond' }
        });
      }, { count: 2, standard: S3 }),
      // ── ② 세 단계 넘게 이어 생각해야 풀리는 문제 ──
      H('hard-bij-avoid', '조건이 붙은 일대일대응의 개수', '기본 ①28', (d) => {
        const all = perms([1, 2, 3, 4]), k = d.pick([2, 2, 3]);
        const cells = d.until(() => { const cs = []; while (cs.length < k) { const c0 = [d.int(1, 4), d.int(1, 4)]; if (!cs.some((x) => x[0] === c0[0] && x[1] === c0[1])) cs.push(c0); } return cs; }, (cs) => true);
        const ok = all.filter((p) => cells.every(([i, j]) => p[i - 1] !== j)).length;
        const singles = 6 * k, pairs = [], idx = range(0, k - 1);
        for (const i of idx) for (const j of idx) if (i < j) pairs.push(cells[i][0] !== cells[j][0] && cells[i][1] !== cells[j][1] ? 2 : 0);
        const pairSum = pairs.reduce((s, v) => s + v, 0), triple = k === 3 && new Set(cells.map((x) => x[0])).size === 3 && new Set(cells.map((x) => x[1])).size === 3 ? 1 : 0;
        if (24 - singles + pairSum - triple !== ok) return null;
        return N(`집합 ${is(SX, setOf([1, 2, 3, 4]))}에 대하여 ${SX}에서 ${SX}로의 일대일대응 ${FN} 가운데 ${jw(cells.map(([i, j]) => nb(`${at(FN, i)} ≠ ${j}`)).join(', '), '을/를')} 모두 만족시키는 것의 개수는?`, ok, {
          explain: `일대일대응은 모두 4 × 3 × 2 × 1 = 24개이다. 조건 하나를 어기는 것(${FN}의 값 하나가 정해짐)은 각각 6개이고, 두 조건을 함께 어기는 것은 두 원소의 값이 서로 다른 칸일 때만 2개씩 있${triple ? '고, 세 조건을 모두 어기는 것은 1개이다' : '다'}. 따라서 ${nb(`24 ${MINUS} ${singles} + ${pairSum}${triple ? ' ' + MINUS + ' 1' : ''} = ${ok}`)}개이다.`,
          facts: { value: `24-${singles}+${pairSum}-${triple}`, unseen: [24, singles, pairSum, triple] }
        });
      }, { standard: S1 }),
      H('hard-count-cond-func', '원소마다 조건이 붙은 함수의 개수', '심5', (d) => {
        const n = d.pick([4, 5]), xs = range(1, n), k = d.int(n - 1, n + 2), ways = xs.map((x) => xs.filter((y) => x + y >= k).length), total = ways.reduce((s, v) => s * v, 1);
        if (ways.some((w) => w === 0) || total > 9999 || ways.every((w) => w === n)) return null;
        return N(`집합 ${is(SX, setOf(xs))}에 대하여 ${SX}에서 ${SX}로의 함수 ${FN} 가운데 ${SX}의 모든 원소 ${X}에 대하여 ${jw(nb(`${X} + ${at(FN, X)} ${GE} ${k}`), '을/를')} 만족시키는 함수의 개수는?`, total, {
          explain: `원소마다 될 수 있는 함숫값의 개수를 센다. ${xs.map((x, i) => `${jw(at(FN, x), '은/는')} ${Math.max(1, k - x)} 이상인 ${ways[i]}가지`).join(', ')}이므로 곱의 법칙에 의하여 ${ways.join(' × ')} = ${total}개이다.`,
          facts: { value: ways.join('*'), unseen: ways }
        });
      }, { standard: S1 }),
      H('hard-comp-equation', '조각 함수 합성 방정식의 해', '기본 ②11', (d) => {
        const r = d.int(2, 6), q = d.int(2, 4), m = d.int(1, 5), g = (x) => Math.abs(x) - m;
        // f(t) = −t + r (t ≥ 1), t² − q² (t < 1): 근은 t = r, t = −q
        const roots = [r, -q], sols = [];
        for (const t of roots) { const s = t + m; if (s > 0) sols.push(-s, s); else if (s === 0) sols.push(0); }
        if (sols.length < 2) return null;
        const big = Math.max(...sols);
        return M(`두 함수 ${FN}(${X}) = ${pw([[pshow(P(r, -1)), `${X} ${GE} 1`], [pshow(P(-q * q, 0, 1)), `${X} ${LT} 1`]])}, ${nb(`${GN}(${X}) = |${X}| ${sgn(-m)}`)}에 대하여 방정식 ${is(cx2([FN, GN]), 0)}의 서로 다른 실근의 개수와 가장 큰 실근은?`, [{ lead: '실근의 개수:', answer: sols.length, unit: '개' }, { lead: '가장 큰 실근:', answer: big, signed: true }], {
          shown: `${sols.length}개, ${iq(big)}`,
          explain: `${is(at(FN, V('t')), 0)}을 풀면 ${nb(`${V('t')} ${GE} 1`)}에서 ${is(V('t'), r)}, ${nb(`${V('t')} ${LT} 1`)}에서 ${nb(`${V('t')}${sup(2)} = ${q * q}`)}이므로 ${is(V('t'), -q)}(${jw(is(V('t'), q), '은/는')} 범위 밖)이다. ${is(at(GN, X), r)}에서 ${nb(`|${X}| = ${r + m}`)}, ${is(at(GN, X), -q)}에서 ${nb(`|${X}| = ${iq(m - q)}`)}이므로 실근은 ${[...new Set(sols)].sort((u, v) => u - v).map(iq).join(', ')}이다.`,
          facts: { calc: [[String(sols.length), 0], [`${r}+${m}`, 1]], unseen: [sols.length] }
        });
      }, { standard: S2 }),
      H('hard-comp-case', '조각 함수 합성값의 조건으로 상수', '기본 ②12', (d) => {
        const t = d.int(1, 2), p = d.pick([-2, -3, 2, -1]), q0 = nz(d, -5, 5), r = nz(d, -5, 5), a0 = d.int(-6, t - 1), S = r + a0 + a0 * a0 + r;
        // 이차의 경우 a² + a + 2r − S = 0 의 다른 근 −1 − a0 는 t 이상(버림), 일차의 경우 해는 t 미만(버림)
        if (-1 - a0 < t || a0 === 0) return null;
        const lin = p === -1 ? null : Q(S - r - q0, 1 + p);
        if (p === -1 && r + q0 === S) return null;
        if (lin && fl(lin) >= t) return null;
        return N(`두 함수 ${nb(`${FN}(${X}) = ${X} + ${A}`)}, ${GN}(${X}) = ${pw([[pshow(P(q0, p)), `${X} ${GE} ${t}`], [pshow(P(r, 0, 1)), `${X} ${LT} ${t}`]])}에 대하여 ${jw(is(nb(`${cat([FN, GN], 0)} + ${cat([GN, FN], 0)}`), S), '을/를')} 만족시키는 상수 ${jw(A, '의')} 값은?`, a0, { signed: true,
          explain: `${is(cat([FN, GN], 0), at(FN, at(GN, 0)))} = ${at(FN, r)} = ${nb(`${iq(r)} + ${A}`)}, ${is(cat([GN, FN], 0), at(GN, A))}이다. ${nb(`${A} ${GE} ${t}`)}이면 ${lin ? `${nb(`(${iq(r)} + ${A}) + (${pAt(P(q0, p), A)}) = ${iq(S)}`)}에서 ${is(A, tx(lin))}인데 범위에 맞지 않는다` : `${jw(nb(`(${iq(r)} + ${A}) + (${pAt(P(q0, p), A)}) = ${iq(S)}`), '은/는')} ${A}가 지워져 ${jw(nb(`${iq(r + q0)} = ${iq(S)}`), '이/가')} 되므로 성립하지 않는다`}. ${nb(`${A} ${LT} ${t}`)}이면 ${nb(`(${iq(r)} + ${A}) + (${A}${sup(2)} ${sgn(r)}) = ${iq(S)}`)}, ${nb(`(${A} ${sgn(-a0)})(${A} ${sgn(1 + a0)}) = 0`)}에서 ${nb(`${A} ${LT} ${t}`)}인 것은 ${is(A, a0)}이다.`,
          facts: { value: jn(a0), unseen: [Math.abs(a0)] }
        });
      }, { standard: S2 }),
      H('hard-mileage', '합성한 뒤 방정식(자동차 연비)', '기본 ②16', (d) => {
        const al = d.pick([200, 300, 400, 600]), be = d.pick([50, 60, 70]), mins = d.until(() => d.int(2, 9), (v) => (al * v) % 60 === 0), xs = be + al * mins / 60;
        const ga = d.pick([0.002, 0.003, 0.004, 0.005]), Rm = d.pick([18.5, 20.5, 21.5, 22.5]), c1 = 2 * ga * xs, c0 = Rm - ga * xs * xs, T = d.pick([0.15, 0.2, 0.25]);
        if (c0 <= 0 || mins / 60 > T || be + al * T > 140) return null;
        return N(`어느 자동차의 주행 검사를 시작한 지 ${V('t')}시간 후의 속도 ${V('v')} km/h는 ${nb(`${V('v')}(${V('t')}) = ${al}${V('t')} + ${be}`)} (${nb(`0 ${LE} ${V('t')} ${LE} ${fmt(T)}`)})이고, 속도가 ${X} km/h일 때의 연비 ${V('r')} km/L는 ${nb(`${V('r')}(${X}) = ${MINUS}${fmt(ga)}${X2} + ${fmt(c1)}${X} + ${fmt(c0)}`)} (${nb(`${be} ${LE} ${X} ${LE} 140`)})이다. 연비가 ${fmt(Rm)} km/L가 되는 것은 검사를 시작한 지 몇 분 후인가?`, mins, { unit: '분',
          explain: `${V('t')}시간 후의 연비는 합성함수 ${nb(`${V('r')}(${V('v')}(${V('t')}))`)}이다. ${is(nb(`${V('r')}(${X})`), nb(`${MINUS}${fmt(ga)}(${X} ${MINUS} ${fmt(xs)})${sup(2)} + ${fmt(Rm)}`))}이므로 연비가 ${jw(fmt(Rm), '이/가')} 되는 것은 속도가 ${fmt(xs)} km/h일 때뿐이다. ${nb(`${al}${V('t')} + ${be} = ${fmt(xs)}`)}에서 ${is(V('t'), fmt(mins / 60))}시간, 곧 ${mins}분 후이다.`,
          facts: { value: `(${fmt(c1)}/(2*${fmt(ga)})-${be})/${al}*60`, unseen: [2, 60] }
        });
      }, { standard: S2 }),
      H('hard-inv-chain-piece', '조각 함수에서 (g ∘ f⁻¹ ∘ g⁻¹)(a) = k', '기본 ②39', (d) => {
        const c = d.int(-2, 4), p = d.int(1, 3), q = 1 + c - p, s = d.pick([-1, 2, -2]), m = nz(d, -5, 6);
        const f = (x) => (x >= 1 ? x * x + c : p * x + q), u = d.int(-3, 3), gx = (x) => s * x + m, k = gx(u), a = gx(f(u));
        if (Math.abs(a) > 60 || q === 0) return null;
        return N(`두 함수 ${FN}(${X}) = ${pw([[pshow(P(c, 0, 1)), `${X} ${GE} 1`], [pshow(P(q, p)), `${X} ${LT} 1`]])}, ${fdef(GN, P(m, s))}에 대하여 ${jw(is(nb(`(${GN} ∘ ${iv(FN)} ∘ ${iv(GN)})(${A})`), k), '을/를')} 만족시키는 상수 ${jw(A, '의')} 값은?`, a, { signed: true,
          explain: `${is(nb(`${GN}(${iv(FN)}(${iv(GN)}(${A})))`), k)}이므로 ${is(nb(`${iv(FN)}(${iv(GN)}(${A}))`), at(iv(GN), k))} = ${iq(u)}이다. 그러면 ${is(at(iv(GN), A), at(FN, u))} = ${iq(f(u))}이고(${u >= 1 ? `${nb(`${iq(u)} ${GE} 1`)}이므로 첫째 식` : `${nb(`${iq(u)} ${LT} 1`)}이므로 둘째 식`}), ${is(A, at(GN, f(u)))} = ${iq(a)}이다.`,
          facts: { value: u >= 1 ? `${s}*(${jn(u)}*${jn(u)}+${jn(c)})+${jn(m)}` : `${s}*(${p}*${jn(u)}+${jn(q)})+${jn(m)}`, unseen: [Math.abs(u), 1, Math.abs(s), 0] }
        });
      }, { standard: S3 }),
      H('hard-two-bij', '두 일대일대응의 일부 값으로 나머지 값', '기본 ②41', (d) => {
        const ps = perms([1, 2, 3, 4]);
        const c = d.until(() => {
          const f = d.pick(ps), g = d.pick(ps), clues = [], pool = d.shuffle([
            ...[1, 2, 3, 4].map((i) => ({ h: is(at(FN, i), f[i - 1]), ok: (F, G) => F[i - 1] === f[i - 1], key: 'f' + i })),
            ...[1, 2, 3, 4].map((i) => ({ h: is(at(GN, i), g[i - 1]), ok: (F, G) => G[i - 1] === g[i - 1], key: 'g' + i })),
            ...[1, 2, 3, 4].map((i) => ({ h: is(cat([GN, FN], i), g[f[i - 1] - 1]), ok: (F, G) => G[F[i - 1] - 1] === g[f[i - 1] - 1], key: 'gf' + i })),
            ...[1, 2, 3, 4].map((i) => ({ h: is(cat([FN, GN], i), f[g[i - 1] - 1]), ok: (F, G) => F[G[i - 1] - 1] === f[g[i - 1] - 1], key: 'fg' + i }))
          ]);
          const count = (cl) => { let n0 = 0; for (const F of ps) for (const G of ps) if (cl.every((x) => x.ok(F, G))) n0 += 1; return n0; };
          for (const x of pool) { clues.push(x); if (count(clues) === 1) break; if (clues.length >= 6) return null; }
          if (count(clues) !== 1 || clues.length < 4) return null;
          const asked = [1, 2, 3, 4].map((i) => ({ i, k: 'f' + i })).filter((x) => !clues.some((cl) => cl.key === x.k));
          const askG = [1, 2, 3, 4].filter((i) => !clues.some((cl) => cl.key === 'gf' + i));
          if (!asked.length || !askG.length) return null;
          return { f, g, clues, i1: d.pick(asked).i, i2: d.pick(askG) };
        }, (v) => v);
        return M(`집합 ${is(SX, setOf([1, 2, 3, 4]))}에 대하여 ${SX}에서 ${SX}로의 두 함수 ${FN}, ${GN}가 모두 일대일대응이고 다음 조건을 모두 만족시킨다. ${at(FN, c.i1)}, ${cat([GN, FN], c.i2)}의 값은?`, [{ lead: at(FN, c.i1) + ' =', answer: c.f[c.i1 - 1] }, { lead: cat([GN, FN], c.i2) + ' =', answer: c.g[c.f[c.i2 - 1] - 1] }], {
          figure: lines(c.clues.map((x) => x.h)),
          shown: `${is(at(FN, c.i1), c.f[c.i1 - 1])}, ${is(cat([GN, FN], c.i2), c.g[c.f[c.i2 - 1] - 1])}`,
          explain: `일대일대응이므로 함숫값 1, 2, 3, 4가 한 번씩만 나온다. 조건을 차례로 맞추면 ${[1, 2, 3, 4].map((i) => is(at(FN, i), c.f[i - 1])).join(', ')}이고 ${[1, 2, 3, 4].map((i) => is(at(GN, i), c.g[i - 1])).join(', ')}인 경우뿐이다. 따라서 ${is(at(FN, c.i1), c.f[c.i1 - 1])}, ${is(cat([GN, FN], c.i2), at(GN, c.f[c.i2 - 1]))} = ${c.g[c.f[c.i2 - 1] - 1]}이다.`,
          facts: { calc: [[String(c.f[c.i1 - 1]), 0], [String(c.g[c.f[c.i2 - 1] - 1]), 1]], unseen: [c.f[c.i1 - 1], c.g[c.f[c.i2 - 1] - 1]] }
        });
      }, { standard: S3 }),
      H('hard-inv-sum-const', '역함수와의 합이 상수함수', '기본 ②42', (d) => {
        const n = 5, xs = range(1, n), ps = perms(xs), good = ps.filter((p) => xs.every((x) => p[x - 1] + (p.indexOf(x) + 1) === n + 1));
        const c = d.until(() => { const s = d.int(1, n), v = d.int(1, n), sols = good.filter((p) => p[s - 1] === v); return { s, v, sols }; }, (o) => o.sols.length === 1 && o.v !== o.s && o.v + o.s !== n + 1);
        const f = c.sols[0], fi = (y) => f.indexOf(y) + 1, [i, j] = d.until(() => [d.int(1, n), d.int(1, n)], ([u, w]) => u !== c.s && w !== c.v && u !== w);
        return M(`집합 ${is(SX, setOf(xs))}에 대하여 ${SX}에서 ${SX}로의 두 함수 ${FN}, ${GN}가 다음 조건을 모두 만족시킨다. ${is(at(FN, c.s), c.v)}일 때, ${at(FN, i)}, ${at(GN, j)}의 값은?`, [{ lead: at(FN, i) + ' =', answer: f[i - 1] }, { lead: at(GN, j) + ' =', answer: fi(j) }], {
          figure: lines([`(가) 함수 ${FN}의 역함수는 함수 ${GN}이다.`, `(나) 함수 ${nb(`${at(FN, X)} + ${at(GN, X)}`)}는 상수함수이다.`]),
          shown: `${is(at(FN, i), f[i - 1])}, ${is(at(GN, j), fi(j))}`,
          explain: `${FN}, ${GN}는 일대일대응이므로 ${FN}의 값의 합과 ${GN}의 값의 합이 모두 15이고, 상수는 ${nb('30 ÷ 5 = 6')}이다. 곧 ${is(nb(`${at(FN, X)} + ${at(GN, X)}`), 6)}이다. ${is(at(FN, c.s), c.v)}에서 ${is(at(GN, c.v), c.s)}이므로 ${is(at(FN, c.v), 6 - c.s)}이고, 이렇게 이어 가면 ${xs.map((x) => is(at(FN, x), f[x - 1])).join(', ')}이다. 따라서 ${is(at(FN, i), f[i - 1])}, ${is(at(GN, j), fi(j))}이다.`,
          facts: { calc: [[String(f[i - 1]), 0], [String(fi(j)), 1]], unseen: [f[i - 1], fi(j)] }
        });
      }, { standard: S3 }),
      H('hard-triangle-area', '함수·역함수 그래프와 축의 교점으로 만든 삼각형의 넓이', '기본 ②46', (d) => {
        const t = d.int(3, 6), m = t * (t - 1), area = (m * m + 2 * m * t) / 2;
        return N(`함수 ${fdef(FN, P(-m, 0, 1))} (${nb(`${X} ${GE} 0`)})의 그래프가 ${Y}축과 만나는 점을 A, 함수 ${is(Y, at(iv(FN), X))}의 그래프가 ${X}축과 만나는 점을 B, 두 함수 ${is(Y, at(FN, X))}, ${is(Y, at(iv(FN), X))}의 그래프의 교점을 C라 할 때, 삼각형 ABC의 넓이는?`, area, {
          explain: `A${nb(`(0, ${iq(-m)})`)}이고, B는 A를 직선 ${is(Y, X)}에 대하여 대칭이동한 점 ${nb(`(${iq(-m)}, 0)`)}이다. ${FN}는 증가하므로 교점 C는 ${nb(`${X2} ${MINUS} ${m} = ${X}`)}의 양수 해 ${is(X, t)}에서 ${nb(`(${t}, ${t})`)}이다. 삼각형 ABC의 넓이는 삼각형 OAC, OBC, OAB의 넓이의 합 ${nb(`${frac(1, 2)} × ${m} × ${t} + ${frac(1, 2)} × ${m} × ${t} + ${frac(1, 2)} × ${m} × ${m}`)} = ${area}이다.`,
          facts: { value: `${m}*${t}+${m}*${m}/2`, unseen: [t, 2] }
        });
      }, { standard: S3 }),
      H('hard-enclosed-area', '조각 함수와 역함수 그래프로 둘러싸인 넓이', '기본 ②47', (d) => {
        const c = d.until(() => { const p = d.int(2, 5), q = d.int(2, 5), t = d.int(-1, 2), s = t - d.int(1, 3); return { p, q, t, s }; }, (v) => v.s > -v.p && v.t < v.q && v.t > -v.p && v.s < v.q);
        const m1 = Q(c.s + c.p, c.t + c.p), m2 = Q(c.q - c.s, c.q - c.t), b1 = qsub(Q(c.s), qmul(m1, Q(c.t))), b2 = qsub(Q(c.s), qmul(m2, Q(c.t)));
        if (m1.q > 4 || m2.q > 4 || b1.q > 4 || b2.q > 4) return null;
        const area = (c.p + c.q) * (c.t - c.s);
        return N(`함수 ${FN}(${X}) = ${pw([[pshow(P(b2, m2)), `${X} ${GE} ${iq(c.t)}`], [pshow(P(b1, m1)), `${X} ${LT} ${iq(c.t)}`]])}의 그래프와 그 역함수 ${is(Y, at(iv(FN), X))}의 그래프로 둘러싸인 부분의 넓이는?`, area, {
          explain: `두 그래프는 직선 ${is(Y, X)}에 대하여 대칭이므로 교점은 ${is(Y, at(FN, X))}와 ${is(Y, X)}의 교점 ${nb(`(${iq(-c.p)}, ${iq(-c.p)})`)}, ${nb(`(${c.q}, ${c.q})`)}이고, 둘러싸인 넓이는 ${is(Y, at(FN, X))}와 ${is(Y, X)}로 둘러싸인 삼각형(꺾인 점 ${nb(`(${iq(c.t)}, ${iq(c.s)})`)})의 넓이의 2배이다. 두 교점 사이 거리는 ${nb(`${c.p + c.q}${rt(2)}`)}, 꺾인 점과 ${is(Y, X)} 사이 거리는 ${nb(`${frac(c.t - c.s, 2)}${rt(2)}`)}이므로 넓이는 ${nb(`2 × ${frac(1, 2)} × ${c.p + c.q}${rt(2)} × ${frac(c.t - c.s, 2)}${rt(2)}`)} = ${area}이다.`,
          facts: { value: `(${c.p}+${c.q})*(${jn(c.t)}-${jn(c.s)})`, unseen: [c.p, c.q, Math.abs(c.t), Math.abs(c.s)] }
        });
      }, { standard: S3 }),
      H('hard-min-segment', '함수·역함수 그래프 사이 선분의 길이의 최솟값', '기본 ②48', (d) => {
        const k = d.pick([Q(1, 2), Q(1), Q(1, 4), Q(2)]), c = d.int(1, 4), v = qsub(Q(c), qdiv(Q(1), qmul(Q(4), k)));
        if (v.p <= 0) return null;
        const radQ = (q) => nb(`${q.p === 1 && q.q === 1 ? '' : tx(q)}${rt(2)}`);
        const rows = [[radQ(v), true], [radQ(qdiv(v, Q(2))), false], [radQ(qmul(v, Q(2))), false], [nb(tx(v)), false]];
        return pickRows(d, `함수 ${nb(`${FN}(${X}) = ${pshow(P(c, 0, k))}`)} (${nb(`${X} ${GE} 0`)})의 그래프와 그 역함수 ${is(Y, at(iv(FN), X))}의 그래프가 직선 ${is(Y, nb(`${MINUS}${X} + ${NN}`))}과 만나는 점을 각각 A, B라 하자. ${NN}의 값이 ${nb(`${NN} ${GE} ${c}`)}에서 변할 때, 선분 AB의 길이의 최솟값은?`, rows, {
          explain: `두 그래프는 직선 ${is(Y, X)}에 대하여 대칭이고 직선 ${is(Y, nb(`${MINUS}${X} + ${NN}`))}은 ${is(Y, X)}에 수직이므로 A, B는 ${is(Y, X)}에 대하여 대칭이고, AB는 점 A와 직선 ${is(Y, X)} 사이 거리의 2배이다. 점 A의 ${X}좌표를 ${A}라 하면 그 거리는 ${nb(`(${pAt(P(c, -1, k), A)}) ÷ ${rt(2)}`)}이고, ${pAt(P(c, -1, k), A)}의 최솟값은 ${is(A, tx(qdiv(Q(1), qmul(Q(2), k))))}일 때 ${tx(v)}이다. 따라서 AB의 최솟값은 ${nb(`2 × ${tx(v)} ÷ ${rt(2)}`)} = ${radQ(v)}이다.`
        });
      }, { standard: S3 })
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
