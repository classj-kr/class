// 중학교 3학년 1학기 1단원 제곱근과 실수 — 뒤쪽 묶음(제곱근의 대소 관계, 무리수와 실수, 수직선 위의 무리수, 실수의 대소 관계).
// 싣는 기준과 뺀 것은 9-1-1a.js 머리에 모아 적었다. 이 파일은 9-1-1a.js 의 단원 안 도구(B.kit.m911)를 쓴다.
// ref: ①n = 기본꼴_1의 n번, 심n = 심화꼴의 n번.
//  - 대소 비교의 답은 고르기([>, =, <])로 받는다. 검사는 두 수의 값을 **0.5 로 다시 셈해 견준다(facts.choose 'compare'). 음수끼리는 부호를 뺀 두 수를 거꾸로 견주고,
//    음수가 섞인 수는 글에 없는 수 10을 더해 양수로 만든 식으로 견준다(unseen 10).
//  - 무리수인가는 근호 안이 유리수의 제곱인가로 코드가 가린다(√0.4 는 무리수, √0.49 는 유리수). 순환마디가 9인 순환소수(0.9̇)는 쓰지 않는다(8-1-1과 같은 교육과정의 금).
//  - 수직선 그림은 9-1-1a.js 의 rline 으로 그린다: 단위 정사각형·모눈 위의 선분·비스듬한 정사각형과, 꼭짓점을 중심으로 대각선(변)을 반지름으로 그은 호.
//    그림 설명(aria-label)에는 정수 눈금과 도형의 꼭짓점이 놓인 칸을 적고, 답인 수는 적지 않는다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, frac, numbers, table, N, M, C, inline, box } = B.kit;
  const { MINUS, GT, LT, range, gcd, Q, tx, nb, tail, V, sup, ex, claimQ, rep, SG } = B.kit.mid;
  const K9 = B.kit.m911;
  const { rt, rq, STD7, STD8, STD9, RT, U5, M_, R, J, neg, sq, par, isSquare, ratSquare, tenth, tenthSq, num, rad, sText, sVal, sJs, rootAns, abcAns, ABC_NOTE, rline } = K9;
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  const nonSq = (d, lo, hi) => d.until(() => d.int(lo, hi), (v) => !isSquare(v));
  const REL = (a, b) => (a > b ? GT : LT);
  const OFF = 10;
  const posJs = (list) => `${OFF}+(${sJs(list)})`;   // 음수가 섞인 수를 양수로 옮긴 식(검사용)
  const ORD = ['', '첫', '둘', '셋', '넷', '다섯', '여섯'];
  const tj = (n, pair) => tx(Q(n)) + tail(Math.abs(n), pair);   // 정수와 토씨
  // 식(항의 배열) 뒤의 토씨: 마지막 항이 근호면 근호 안의 수, 수면 그 수의 끝소리
  const lastJ = (list, pair) => { const t = list[list.length - 1]; return t.n ? J(t.n, pair) : tail(t.c, pair); };

  // ── 수 목록에 쓰는 수 ── { h 글, kind 'nat' | 'zero' | 'negint' | 'frac' | 'irr', v 값, why 가리는 말(유리수는 값, 무리수는 까닭) }
  const say = (h, kind, v, why) => ({ h, kind, v, why, rat: kind !== 'irr' });
  const MAKERS = {
    sqInt: (d) => { const k = d.int(2, 12); return say(R(k * k), 'nat', k, `${R(k * k)} = ${k}`); },
    negSqInt: (d) => { const k = d.int(2, 12); return say(neg(R(k * k)), 'negint', -k, `${neg(R(k * k))} = ${MINUS}${k}`); },
    sqFrac: (d) => { const [p, q] = d.until(() => [d.int(1, 7), d.int(2, 9)], ([a, b]) => a < b && gcd(a, b) === 1); return say(rq(p * p, q * q), 'frac', p / q, `${rq(p * p, q * q)} = ${frac(p, q)}`); },
    sqDec: (d) => { const t = d.until(() => d.int(2, 19), (v) => v % 10 !== 0), s = d.pick([1, -1]); return say((s < 0 ? MINUS : '') + R(tenthSq(t)), 'frac', s * t / 10, `${(s < 0 ? MINUS : '') + R(tenthSq(t))} = ${s < 0 ? MINUS : ''}${M_(tenth(t))}`); },
    absDec: (d) => { const t = d.pick(['3.14', '1.2', '0.5', '2.7']); return say(rt(sq(par(MINUS + t))), 'frac', Number(t), `${rt(sq(par(MINUS + t)))} = ${t}`); },
    repDec: (d) => { const [h, c] = d.pick([['0.', '5'], ['2.1', '7'], ['0.', '41'], ['1.', '4'], ['0.2', '3']]); return say(rep(h, c), 'frac', Number(h + c), `${rep(h, c)}${tail(Number(c.slice(-1)), '은/는')} 순환소수`); },
    finDec: (d) => { const t = d.pick(['−0.35', '3.14', '1.5', '−0.5', '2.25']); return say(t, 'frac', Number(t.replace(MINUS, '-')), `${t}${tail(Number(t.slice(-1)), '은/는')} 유한소수`); },
    sumInt: (d) => { const k = d.int(2, 5), m = d.int(1, 4), s = d.pick([1, -1]), v = s > 0 ? k + m : m - k, h = s > 0 ? `${R(k * k)} + ${m}` : `${m} ${MINUS} ${R(k * k)}`; return say(h, v > 0 ? 'nat' : v === 0 ? 'zero' : 'negint', v, `${h} = ${tx(Q(v))}`); },
    divInt: (d) => { const k = d.pick([3, 5, 7]), m = d.pick([2, 4]); return say(neg(frac(k, R(m * m))), 'frac', -k / m, `${neg(frac(k, R(m * m)))} = ${MINUS}${frac(k, m)}`); },
    zero: () => say('0', 'zero', 0, '0은 정수'),
    natPlain: (d) => { const k = d.int(2, 9); return say(String(k), 'nat', k, `${tj(k, '은/는')} 자연수`); },
    negPlain: (d) => { const k = d.int(2, 9); return say(MINUS + k, 'negint', -k, `${tj(-k, '은/는')} 음의 정수`); },
    rootInt: (d) => { const n = nonSq(d, 2, 30); return say(R(n), 'irr', Math.sqrt(n), `${R(n)}${tail(n, '은/는')} 근호 안이 제곱인 수가 아닌 수`); },
    negRoot: (d) => { const n = nonSq(d, 2, 30); return say(neg(R(n)), 'irr', -Math.sqrt(n), `${neg(R(n))}${tail(n, '은/는')} 근호 안이 제곱인 수가 아닌 수`); },
    rootFrac: (d) => { const [p, q] = d.pick([[1, 7], [2, 3], [5, 8], [1, 3], [3, 4], [2, 9], [1, 10]]); return say(rq(p, q), 'irr', Math.sqrt(p / q), `${rq(p, q)}${tail(p, '은/는')} 근호 안이 유리수의 제곱이 아닌 수`); },
    rootDec: (d) => { const t = d.pick([1, 2, 4, 9, 16, 25, 36, 49]); return say(R(tenth(t)), 'irr', Math.sqrt(t / 10), `${R(tenth(t))}${J(tenth(t), '은/는')} 근호 안이 유리수의 제곱이 아닌 수`); },
    rootPlus: (d) => { const n = nonSq(d, 2, 20), k = d.int(1, 4), f = d.int(0, 2), list = f === 0 ? [rad(n), num(k)] : f === 1 ? [num(k), rad(n, -1)] : [rad(n), num(-k)]; return say(sText(list), 'irr', sVal(list), `${sText(list)}${lastJ(list, '은/는')} 무리수에 유리수를 더한 수`); },
    pi: (d) => { const k = d.pick(['π', '2π', MINUS + 'π', MINUS + '2π']); return say(k, 'irr', (k.includes('2') ? 2 : 1) * Math.PI * (k.startsWith(MINUS) ? -1 : 1), `${k}는 순환소수가 아닌 무한소수`); },
    cube: (d) => { const k = d.pick([2, 3, 5]); return say(rt(k + sup(3)), 'irr', Math.sqrt(k ** 3), `${rt(k + sup(3))} = ${R(k ** 3)}${tail(k ** 3, '은/는')} 근호 안이 제곱인 수가 아닌 수`); },
    rootOver: (d) => { const k = d.pick([2, 3, 5]); return say(frac(R(k), k), 'irr', Math.sqrt(k) / k, `${frac(R(k), k)}${tail(k, '은/는')} 무리수를 0이 아닌 유리수로 나눈 수`); }
  };
  const RAT_KEYS = ['sqInt', 'negSqInt', 'sqFrac', 'sqDec', 'absDec', 'repDec', 'finDec', 'sumInt', 'divInt'], IRR_KEYS = ['rootInt', 'negRoot', 'rootFrac', 'rootDec', 'rootPlus', 'pi', 'cube', 'rootOver'];
  const pickRows = (d, keys, n) => d.shuffle(keys).slice(0, n).map((k) => MAKERS[k](d));
  const distinctH = (rows) => new Set(rows.map((r) => r.h)).size === rows.length;
  const KIND = { nat: '자연수', zero: '0', negint: '음의 정수', frac: '정수가 아닌 유리수', irr: '무리수' };

  // ── 두 실수 a ± √b 의 짝(교과서 9-1-1의 꼴) ── [왼쪽 식, 오른쪽 식]
  function realPair(d) {
    const f = d.int(0, 7), sw = (l, r) => (d.bool() ? [l, r] : [r, l]);
    if (f === 0) { const a = d.int(3, 7), b = d.int(1, a - 1), n = nearSq(d, a - b); return sw([num(a)], [num(b), rad(n)]); }
    if (f === 1) { const k = d.int(3, 7), m = d.int(1, k - 2), n = nearSq(d, k - m); return sw([num(k), rad(n, -1)], [num(m)]); }
    if (f === 2) { const [n, m] = d.until(() => [nonSq(d, 2, 20), nonSq(d, 2, 20)], ([x, y]) => x !== y), k = d.int(1, 5); return sw([rad(n), num(k)], [rad(m), num(k)]); }
    if (f === 3) { const k = d.int(2, 4), m = nearSq(d, k), n = d.until(() => nonSq(d, 2, 15), (v) => v !== m); return sw([num(k), rad(n)], [rad(m), rad(n)]); }
    if (f === 4) { const k = d.int(2, 4), m = nearSq(d, k), n = d.until(() => nonSq(d, 2, 15), (v) => v !== m); return sw([rad(n), rad(m, -1)], [rad(n), num(-k)]); }
    if (f === 5) { const k = d.int(2, 4), m = nearSq(d, k), n = d.until(() => nonSq(d, 2, 15), (v) => v !== m); return sw([rad(m, -1), rad(n, -1)], [rad(n, -1), num(-k)]); }
    if (f === 6) { const n = nonSq(d, 2, 15), [k, j] = d.until(() => [d.int(-5, 5), d.int(-5, 5)], ([x, y]) => x !== y && x !== 0 && y !== 0); return sw([num(k), rad(n)], [num(j), rad(n)]); }
    const k = d.int(1, 4), j = d.int(1, 3), n = nearSq(d, k + j); return sw([num(k)], [rad(n), num(-j)]);
  }
  // k² 바로 옆의 제곱이 아닌 수(k² ± 1, ± 2)
  function nearSq(d, k) { return d.until(() => k * k + d.pick([-2, -1, 1, 2]), (v) => v >= 2 && !isSquare(v)); }
  const showPair = (l, r) => `${sText(l)} ${box()} ${sText(r)}`;
  const diffWord = (l, r) => `(${sText(l)}) ${MINUS} (${sText(r)}) ${sVal(l) > sVal(r) ? GT : LT} 0`;

  B.addGroup('9-1-1', {
    id: 'order', title: '제곱근의 대소 관계', standard: STD7,
    types: [
      T('ord-two', '두 수의 대소 비교', '①35', (d) => {
        // 근호가 없는 수는 근호를 씌워(3 = √9) 견준다. 음수끼리는 근호 안의 수가 클수록 작다. 0.3과 √0.1처럼 1보다 작은 수는 제곱하면 작아진다.
        const f = d.int(0, 4);
        let c;
        if (f === 0) { const k = d.int(2, 9), n = nearSq(d, k); c = { L: String(k), R: R(n), jl: `${k}`, jr: `${n}${RT}`, vl: k, vr: Math.sqrt(n), why: `${k} = ${R(k * k)}이고 ${k * k} ${REL(k * k, n)} ${n}이므로 ${k} ${REL(k * k, n)} ${R(n)}` }; }
        else if (f === 1) {
          const [p, q] = d.pick([[2, 5], [1, 4], [3, 4], [2, 3], [1, 3], [3, 5]]), o = d.pick([Q(p * p + 1, q * q), Q(p * p - 1, q * q), Q(p * p * 2 + 1, q * q * 2), Q(p * p * 2 - 1, q * q * 2)].filter((x) => x.p > 0 && !ratSquare(x)));
          c = { L: frac(p, q), R: rq(o.p, o.q), jl: `${p}/${q}`, jr: `(${o.p}/${o.q})${RT}`, vl: p / q, vr: Math.sqrt(o.p / o.q), why: `${frac(p, q)} = ${rq(p * p, q * q)}이고 ${frac(p * p, q * q)} ${REL(p * p / (q * q), o.p / o.q)} ${frac(o.p, o.q)}이므로 ${frac(p, q)} ${REL(p * p / (q * q), o.p / o.q)} ${rq(o.p, o.q)}` };
        } else if (f === 2) {
          const t = d.pick([2, 3, 4, 5, 6, 7]), oth = d.until(() => d.int(1, 60), (v) => v !== t * t && v % 10 !== 0 && Math.abs(v - t * t) <= 12), os = (oth / 100).toFixed(2), ts = (t * t / 100).toFixed(2);
          c = { L: `0.${t}`, R: rt(os), jl: `0.${t}`, jr: `${os}${RT}`, vl: t / 10, vr: Math.sqrt(oth / 100), why: `0.${t} = ${rt(ts)}이고 ${ts} ${REL(t * t, oth)} ${os}이므로 0.${t} ${REL(t * t, oth)} ${rt(os)}` };
        } else if (f === 3) { const k = d.int(2, 9), n = nearSq(d, k); c = { L: MINUS + k, R: neg(R(n)), jl: `${k}`, jr: `${n}${RT}`, vl: k, vr: Math.sqrt(n), neg: true, why: `${k} = ${R(k * k)}이고 ${k * k} ${REL(k * k, n)} ${n}이므로 ${k} ${REL(k * k, n)} ${R(n)}이다. 음수끼리는 절댓값이 큰 수가 작으므로 ${MINUS}${k} ${REL(n, k * k)} ${neg(R(n))}` }; }
        else { const [n, m] = d.until(() => [nonSq(d, 2, 30), nonSq(d, 2, 30)], ([x, y]) => x !== y); c = { L: neg(R(n)), R: neg(R(m)), jl: `${n}${RT}`, jr: `${m}${RT}`, vl: Math.sqrt(n), vr: Math.sqrt(m), neg: true, why: `${n} ${REL(n, m)} ${m}이므로 ${R(n)} ${REL(n, m)} ${R(m)}이다. 음수끼리는 절댓값이 큰 수가 작으므로 ${neg(R(n))} ${REL(m, n)} ${neg(R(m))}` }; }
        const swap = d.bool(), [l, r, jl, jr, vl, vr] = swap ? [c.R, c.L, c.jr, c.jl, c.vr, c.vl] : [c.L, c.R, c.jl, c.jr, c.vl, c.vr];
        // 음수끼리는 부호를 뗀 두 수를 거꾸로 견준다: −x 와 −y 의 대소는 y 와 x 의 대소와 같다.
        const exprs = c.neg ? [jr, jl] : [jl, jr], big = c.neg ? vr > vl : vl > vr;
        return C('두 수의 대소를 비교할 때, □ 안에 알맞은 부등호는?', [GT, '=', LT], big ? 0 : 2, {
          figure: ex(`${l} ${box()} ${r}`), explain: `${c.why}이다. 따라서 ${l} ${big ? GT : LT} ${r}이다.`,
          facts: { choose: { exprs, rule: 'compare' }, unseen: U5 }
        });
      }),
      T('ord-sort', '여러 수를 차례로 늘어놓기', '①36', (d, n) => {
        if (n === 0) {
          // 정수와 무리수(양수·음수)를 함께 늘어놓는다. 근호를 씌우거나 어림하여 견준다.
          const rows = d.until(() => d.shuffle([
            { h: '0', v: 0 }, (() => { const k = d.int(2, 5); return { h: MINUS + k, v: -k }; })(), (() => { const k = d.int(2, 5); return { h: String(k), v: k }; })(),
            (() => { const m = nonSq(d, 2, 24); return { h: neg(R(m)), v: -Math.sqrt(m) }; })(), (() => { const m = nonSq(d, 2, 24); return { h: R(m), v: Math.sqrt(m) }; })(), (() => { const m = nonSq(d, 2, 24); return { h: R(m), v: Math.sqrt(m) }; })()
          ]), (list) => distinctH(list) && list.every((a, i) => list.every((b, j) => i === j || Math.abs(a.v - b.v) > 0.05)));
          const k = d.int(2, 5), sorted = rows.slice().sort((a, b) => a.v - b.v), want = sorted[k - 1];
          return C(`다음 수를 작은 것부터 차례로 늘어놓을 때, ${ORD[k]}째에 오는 수는?`, rows.map((r) => r.h), rows.indexOf(want), {
            figure: numbers(rows.map((r) => r.h)),
            explain: `음수는 0보다 작고, 양수끼리·음수끼리는 근호를 씌워 근호 안의 수를 견준다. 작은 것부터 ${sorted.map((r) => r.h).join(', ')}이므로 ${ORD[k]}째는 ${want.h}이다.`,
            facts: { rank: { values: rows.map((r) => r.v), nth: rows.length - k + 1 } }
          });
        }
        // 근호를 없애면 모두 유리수가 되는 수: √(0.3²), √(9/4), 0.4̇9̇, (−√(9/10))², √(1/16)
        const rows = d.until(() => {
          const t = d.pick([3, 4, 6, 7]), [p, q] = d.pick([[9, 4], [16, 9], [25, 4]]), [rh, rc, num9, den9] = d.pick([['0.', '49', 49, 99], ['0.', '7', 7, 9], ['0.', '36', 36, 99]]), [sp, sq2] = d.pick([[9, 10], [7, 10], [3, 5]]), w = d.pick([16, 25, 36]);
          return d.shuffle([
            { h: rt(sq(`0.${t}`)), v: t / 10, why: `${rt(sq(`0.${t}`))} = 0.${t}` }, { h: rq(p, q), v: Math.sqrt(p / q), why: `${rq(p, q)} = ${frac(Math.sqrt(p), Math.sqrt(q))}` },
            { h: rep(rh, rc), v: num9 / den9, why: `${rep(rh, rc)} = ${frac(num9, den9)}` }, { h: sq(par(neg(rq(sp, sq2)))), v: sp / sq2, why: `${sq(par(neg(rq(sp, sq2))))} = ${frac(sp, sq2)}` },
            { h: rq(1, w), v: 1 / Math.sqrt(w), why: `${rq(1, w)} = ${frac(1, Math.sqrt(w))}` }
          ]);
        }, (list) => list.every((a, i) => list.every((b, j) => i === j || Math.abs(a.v - b.v) > 0.01)));
        const k = d.int(2, 4), sorted = rows.slice().sort((a, b) => b.v - a.v), want = sorted[k - 1];
        return C(`다음 수를 큰 것부터 차례로 늘어놓을 때, ${ORD[k]}째에 오는 수는?`, rows.map((r) => r.h), rows.indexOf(want), {
          figure: numbers(rows.map((r) => r.h)),
          explain: `${rows.map((r) => r.why).join(', ')}이다. 큰 것부터 ${sorted.map((r) => r.h).join(', ')}이므로 ${ORD[k]}째는 ${want.h}이다.`,
          facts: { rank: { values: rows.map((r) => r.v), nth: k } }
        });
      }, { count: 2 }),
      T('ord-extreme', '가장 큰(작은) 수 고르기', '①37', (d, n) => {
        const big = d.bool();
        if (n === 0) {
          // 근호와 분수가 섞인 꼴: √(a/b), a/√b, √a/b, a/b 를 제곱하여 견준다.
          const [a, b] = d.until(() => [d.int(2, 5), d.int(3, 11)], ([x, y]) => x < y && gcd(x, y) === 1 && !isSquare(x) && !isSquare(y));
          const rows = d.shuffle([{ h: rq(a, b), js: `(${a}/${b})${RT}`, s: frac(a, b), v: Math.sqrt(a / b) }, { h: frac(a, R(b)), js: `${a}/(${b}${RT})`, s: frac(a * a, b), v: a / Math.sqrt(b) }, { h: frac(R(a), b), js: `(${a}${RT})/${b}`, s: frac(a, b * b), v: Math.sqrt(a) / b }, { h: frac(a, b), js: `${a}/${b}`, s: frac(a * a, b * b), v: a / b }]);
          const vals = rows.map((r) => r.v), best = big ? Math.max(...vals) : Math.min(...vals), at2 = vals.indexOf(best);
          return C(`다음 중 가장 ${big ? '큰' : '작은'} 수는?`, rows.map((r) => r.h), at2, {
            explain: `모두 양수이므로 제곱하여 견준다. 제곱하면 차례로 ${rows.map((r) => r.s).join(', ')}이고 가장 ${big ? '큰' : '작은'} 것은 ${rows[at2].s}이므로 가장 ${big ? '큰' : '작은'} 수는 ${rows[at2].h}이다.`,
            facts: { choose: { exprs: rows.map((r) => r.js), rule: big ? 'max' : 'min' }, unseen: U5, rule: 'extreme-root' }
          });
        }
        // 소수·분수·근호가 섞인 꼴: √0.75, 1/3, √0.09, 0.5, √0.64
        const rows = d.until(() => d.shuffle([
          (() => { const t = d.pick(['0.75', '0.5', '0.3', '0.6', '0.8']); return { h: rt(t), js: `${t}${RT}`, v: Math.sqrt(Number(t)) }; })(),
          (() => { const [p, q] = d.pick([[1, 3], [2, 3], [1, 4], [3, 4]]); return { h: frac(p, q), js: `${p}/${q}`, v: p / q }; })(),
          (() => { const t = d.pick([3, 4, 6, 7]); return { h: R(tenthSq(t)), js: `${(t * t / 100).toFixed(2)}${RT}`, v: t / 10 }; })(),
          (() => { const t = d.pick(['0.5', '0.4', '0.7']); return { h: t, js: t, v: Number(t) }; })(),
          (() => { const t = d.pick([8, 9, 5]); return { h: R(tenthSq(t)), js: `${(t * t / 100).toFixed(2)}${RT}`, v: t / 10 }; })()
        ]), (list) => { const vs = list.map((r) => r.v), best = big ? Math.max(...vs) : Math.min(...vs); return distinctH(list) && vs.filter((v) => Math.abs(v - best) < 0.02).length === 1; });
        const vals = rows.map((r) => r.v), best = big ? Math.max(...vals) : Math.min(...vals), at2 = vals.indexOf(best);
        const dec = (v) => { const s = v.toFixed(3); return Math.abs(v * 1000 - Math.round(v * 1000)) < 1e-9 ? String(Number(s)) : s + '…'; };
        return C(`다음 중 가장 ${big ? '큰' : '작은'} 수는?`, rows.map((r) => r.h), at2, {
          explain: `소수로 나타내어 견준다. ${rows.map((r) => `${r.h} = ${dec(r.v)}`).join(', ')}이므로 가장 ${big ? '큰' : '작은'} 수는 ${rows[at2].h}이다.`,
          facts: { choose: { exprs: rows.map((r) => r.js), rule: big ? 'max' : 'min' }, unseen: U5, rule: 'extreme-dec' }
        });
      }, { count: 2 }),
      T('ord-between', '두 정수 사이에 있는 수의 개수', '①38', (d) => {
        // 끝 수와 같은 √k² (예: √16 = 4)는 「사이」에 들지 않는다.
        const k = d.int(2, 6), lo2 = k * k, hi2 = (k + 1) * (k + 1);
        const list = d.until(() => range(1, 6).map(() => d.int(Math.max(2, lo2 - 5), hi2 + 4)), (l) => new Set(l).size === 6 && l.some((v) => v === lo2 || v === hi2) && l.filter((v) => v > lo2 && v < hi2).length >= 2 && l.some((v) => v < lo2 || v > hi2)).sort((a, b) => a - b);
        const flags = list.map((v) => v > lo2 && v < hi2), hit = list.filter((v, i) => flags[i]);
        return N(`다음 수 가운데 ${tj(k, '과/와')} ${k + 1} 사이에 있는 수는 모두 몇 개인가?`, hit.length, {
          unit: '개', figure: numbers(list.map((v) => R(v))),
          explain: `${k} = ${R(lo2)}, ${k + 1} = ${R(hi2)}이므로 근호 안의 수가 ${lo2}보다 크고 ${hi2}보다 작은 수를 센다(${R(lo2)}, ${R(hi2)}${tail(hi2, '은/는')} 두 수와 같다). ${hit.map((v) => R(v)).join(', ')}의 ${hit.length}개이다.`,
          facts: { count: flags }
        });
      }),
      T('ord-ineq', 'a < √(식) < b 를 만족하는 자연수의 개수', '①39', (d, n) => {
        const x = V('x');
        if (n === 0) {
          // 각 변을 제곱한다: a < √(kx) < b ⇔ a² < kx < b², 또는 a < √(x + c) < b ⇔ a² < x + c < b²
          const plus = d.bool(), a = d.int(2, 5), b = a + d.int(1, 2), k = d.pick([2, 3, 5]), c = d.int(1, 3);
          const inside = plus ? `${x} + ${c}` : `${k}${x}`, tpl = plus ? `${a}*${a}<□+${c}<${b}*${b}` : `${a}*${a}<${k}*□<${b}*${b}`;
          const ok = range(1, b * b).filter((v) => (plus ? a * a < v + c && v + c < b * b : a * a < k * v && k * v < b * b));
          return N(`${a} ${LT} ${rt(inside)} ${LT} ${tj(b, '을/를')} 만족시키는 자연수 ${x}는 모두 몇 개인가?`, ok.length, {
            unit: '개', explain: `각 변을 제곱하면 ${a * a} ${LT} ${inside} ${LT} ${b * b}이다. 이를 만족시키는 자연수 ${x}는 ${ok[0]}부터 ${ok[ok.length - 1]}까지 ${ok.length}개이다.`,
            facts: { digit: { template: tpl, lo: 1, hi: b * b, ask: 'count' }, rule: plus ? 'ineq-plus' : 'ineq-times' }
          });
        }
        // 한쪽 끝에 등호가 있고 다른 끝이 소수: 2 ≤ √x < 3.2 ⇔ 4 ≤ x < 10.24
        const a = d.int(2, 4), t = d.until(() => d.int(a * 10 + 3, a * 10 + 17), (v) => v % 10 !== 0), top = (t / 10).toFixed(1), tt = (t * t / 100).toFixed(2), ok = range(1, 200).filter((v) => a * a <= v && v * 100 < t * t);
        return N(`${a} ≤ ${rt(x)} ${LT} ${top}${tail(t % 10, '을/를')} 만족시키는 자연수 ${x}는 모두 몇 개인가?`, ok.length, {
          unit: '개', explain: `각 변을 제곱하면 ${a * a} ≤ ${x} ${LT} ${tt}이다. ${x} = ${a * a}${tail(a * a, '은/는')} 들어가고 ${tt}보다 작은 자연수까지이므로 ${ok[0]}부터 ${ok[ok.length - 1]}까지 ${ok.length}개이다.`,
          facts: { digit: { template: `${a}*${a}-1<□<${top}*${top}`, lo: 1, hi: 200, ask: 'count' } }
        });
      }, { count: 2 }),
      T('ord-ints', '√a < x < √b 를 만족하는 자연수의 합', '①40', (d) => {
        const [a, b] = d.until(() => [nonSq(d, 2, 30), nonSq(d, 10, 80)], ([p, q]) => { const xs = range(1, 10).filter((v) => p < v * v && v * v < q); return xs.length >= 2 && xs.length <= 5; });
        const xs = range(1, 10).filter((v) => a < v * v && v * v < b), x = V('x'), total = xs.reduce((s, v) => s + v, 0);
        return N(`${R(a)} ${LT} ${x} ${LT} ${R(b)}${tail(b, '을/를')} 만족시키는 자연수 ${x}의 값을 모두 더하면?`, total, {
          explain: `각 변을 제곱하면 ${a} ${LT} ${x}${sup(2)} ${LT} ${b}이다. ${xs.map((v) => `${v}${sup(2)} = ${v * v}`).join(', ')}이므로 ${x} = ${xs.join(', ')}이고, 합은 ${total}이다.`,
          facts: { calc: [[xs.map((v) => `(${v * v})${RT}`).join('+'), 0]], unseen: U5.concat(xs.map((v) => v * v)) }
        });
      }),
      T('ord-cannot', '√a < x/k < √b 에서 x 가 될 수 없는 수', '①41', (d) => {
        const k = d.pick([2, 3]), [a, b] = d.until(() => [d.int(5, 40), d.int(20, 120)], ([p, q]) => { const xs = range(1, 60).filter((v) => p * k * k < v * v && v * v < q * k * k); return xs.length >= 4 && xs.length <= 7 && !isSquare(p * k * k) && !isSquare(q * k * k); });
        const xs = range(1, 60).filter((v) => a * k * k < v * v && v * v < b * k * k), low = d.bool(), out = low ? xs[0] - 1 : xs[xs.length - 1] + 1;
        const rows = d.shuffle(d.shuffle(xs).slice(0, 4).concat([out])), x = V('x');
        return C(`부등식 ${R(a)} ${LT} ${frac(x, k)} ${LT} ${R(b)}${tail(b, '을/를')} 만족시키는 자연수 ${x}가 될 수 없는 것은?`, rows.map(String), rows.indexOf(out), {
          explain: `각 변을 제곱하면 ${a} ${LT} ${frac(x + sup(2), k * k)} ${LT} ${b}, 곧 ${a * k * k} ${LT} ${x}${sup(2)} ${LT} ${b * k * k}이다. ${x} = ${xs.join(', ')}이므로 될 수 없는 것은 ${out}이다.`,
          facts: { choose: { exprs: rows.map((v) => `${v}*${v}`), rule: low ? 'onlyBelow' : 'onlyAbove', target: low ? a * k * k : b * k * k } }
        });
      }),
      T('ord-neg', '음의 제곱근이 든 부등식', '①42', (d) => {
        // −b < −√(kx) < −a 의 각 변에 −1을 곱하면 a < √(kx) < b (부등호의 방향이 바뀐다)
        const k = d.pick([2, 3]), a = d.int(2, 3), b = a + d.int(1, 2), x = V('x');
        const xs = range(1, b * b).filter((v) => a * a < k * v && k * v < b * b), total = xs.reduce((s, v) => s + v, 0);
        return N(`${MINUS}${b} ${LT} ${MINUS}${rt(k + x)} ${LT} ${MINUS}${tj(a, '을/를')} 만족시키는 자연수 ${x}의 값을 모두 더하면?`, total, {
          explain: `각 변에 ${MINUS}1을 곱하면 부등호의 방향이 바뀌어 ${a} ${LT} ${rt(k + x)} ${LT} ${b}이고, 제곱하면 ${a * a} ${LT} ${k}${x} ${LT} ${b * b}이다. ${x} = ${xs.join(', ')}이므로 합은 ${total}이다.`,
          facts: { calc: [[xs.join('+'), 0]], unseen: xs }
        });
      }),
      T('ord-le', '한쪽 끝에 ≤ 가 있는 부등식의 가장 큰 수와 가장 작은 수', '①43', (d) => {
        // a < √(x − c) ≤ b ⇔ a² + c < x ≤ b² + c. 등호가 있는 쪽 끝은 들어간다.
        const a = d.int(2, 4), b = a + 1, c = d.int(1, 6), x = V('x');
        return M(`${a} ${LT} ${rt(`${x} ${MINUS} ${c}`)} ≤ ${tj(b, '을/를')} 만족시키는 자연수 ${x} 가운데 가장 큰 수와 가장 작은 수를 차례로 구하시오.`, [{ answer: b * b + c, label: '가장 큰 수' }, { answer: a * a + c + 1, label: '가장 작은 수' }], {
          explain: `각 변을 제곱하면 ${a * a} ${LT} ${x} ${MINUS} ${c} ≤ ${b * b}, 곧 ${a * a + c} ${LT} ${x} ≤ ${b * b + c}이다. 가장 큰 수는 ${b * b + c}, 가장 작은 수는 ${a * a + c + 1}이다.`,
          facts: { calc: [[`${b}*${b}+${c}`, 0], [`${a}*${a}+${c}+1`, 1]], unseen: [1] }
        });
      }),
      T('ord-count-below', '√x 보다 작은(√x 이하인) 자연수의 개수', '①44', (d) => {
        // √49보다 작은 자연수는 6개, √49 이하인 자연수는 7개이다.
        const below = d.bool(), X = d.bool() ? d.pick([16, 25, 36, 49, 64, 81]) : nonSq(d, 10, 90), k = Math.floor(Math.sqrt(X)), n = below && isSquare(X) ? k - 1 : k;
        return N(`${R(X)}${below ? '보다 작은' : ' 이하인'} 자연수는 모두 몇 개인가?`, n, {
          unit: '개', explain: `${isSquare(X) ? `${R(X)} = ${k}` : `${k} = ${R(k * k)} ${LT} ${R(X)} ${LT} ${R((k + 1) * (k + 1))} = ${k + 1}`}이므로 ${R(X)}${below ? '보다 작은' : ' 이하인'} 자연수는 1부터 ${n}까지 ${n}개이다.`,
          facts: { digit: { template: below ? `□*□<${X}` : `□*□<${X}+1`, lo: 1, hi: X, ask: 'count' }, rule: below ? 'below' : 'atmost' }
        });
      }),
      T('ord-count-back', '√x 이하의 자연수가 n개인 x 의 개수', '①45', (d) => {
        // √x 이하의 자연수가 n개 ⇔ n ≤ √x < n + 1 ⇔ n² ≤ x < (n + 1)²
        const k = d.int(2, 6), x = V('x');
        return N(`자연수 ${x}에 대하여 ${rt(x)} 이하의 자연수가 ${k}개일 때, ${x}는 모두 몇 개인가?`, 2 * k + 1, {
          unit: '개', explain: `${rt(x)} 이하의 자연수가 1, 2, …, ${k}의 ${k}개이려면 ${k} ≤ ${rt(x)} ${LT} ${k + 1}, 곧 ${k * k} ≤ ${x} ${LT} ${(k + 1) * (k + 1)}이다. ${x}는 ${k * k}부터 ${(k + 1) * (k + 1) - 1}까지 ${2 * k + 1}개이다.`,
          facts: { digit: { template: `${k}*${k}-1<□<(${k}+1)*(${k}+1)`, lo: 1, hi: (k + 2) * (k + 2), ask: 'count' } }
        });
      }),
      T('ord-both', '두 부등식을 함께 만족하는 자연수', '①46', (d) => {
        const x = V('x'), [a, k, m, c, e] = d.until(() => [d.int(3, 5), d.pick([2, 3]), d.pick([3, 4, 5]), d.int(10, 40), d.int(41, 90)], ([a1, k1, m1, c1, e1]) => {
          const one = range(1, 60).filter((v) => a1 * a1 < k1 * v && k1 * v < (a1 + 1) * (a1 + 1)), two = range(1, 60).filter((v) => c1 < m1 * v && m1 * v < e1), ok = one.filter((v) => two.includes(v));
          return ok.length >= 2 && ok.length < one.length && ok.length < two.length && !isSquare(c1) && !isSquare(e1);
        });
        const b = a + 1, ok = range(1, 60).filter((v) => a * a < k * v && k * v < b * b && c < m * v && m * v < e);
        return N(`두 부등식 ${nb(`${a} ${LT} ${rt(k + x)} ${LT} ${b}`)}, ${nb(`${R(c)} ${LT} ${rt(m + x)} ${LT} ${R(e)}`)}${tail(e, '을/를')} 모두 만족시키는 자연수 ${x}는 모두 몇 개인가?`, ok.length, {
          unit: '개', explain: `첫째 식을 제곱하면 ${a * a} ${LT} ${k}${x} ${LT} ${b * b}, 둘째 식을 제곱하면 ${c} ${LT} ${m}${x} ${LT} ${e}이다. 두 식을 모두 만족시키는 자연수 ${x}는 ${ok.join(', ')}의 ${ok.length}개이다.`,
          facts: { digitBoth: { templates: [`${a}*${a}<${k}*□`, `${k}*□<${b}*${b}`, `${c}<${m}*□`, `${m}*□<${e}`], lo: 1, hi: 60 } }
        });
      })
    ]
  });

  B.addGroup('9-1-1', {
    id: 'irr', title: '무리수와 실수', standard: STD8,
    types: [
      T('irr-pick', '무리수(순환소수가 아닌 무한소수) 고르기', '①48', (d) => {
        // 근호가 있어도 근호 안이 유리수의 제곱이면 유리수이다(√0.49 = 0.7). √0.4 는 무리수이다.
        const ask = d.pick(['무리수인 것은', '유리수가 아닌 실수는', '소수로 나타낼 때 순환소수가 아닌 무한소수가 되는 것은']);
        const rows = d.until(() => d.shuffle(pickRows(d, IRR_KEYS, 1).concat(pickRows(d, RAT_KEYS, 4))), distinctH);
        const at2 = rows.findIndex((r) => !r.rat);
        return C(`다음 중 ${ask}?`, rows.map((r) => r.h), at2, {
          explain: `${rows.filter((r) => r.rat).map((r) => r.why).join(', ')}이므로 모두 유리수이다. ${rows[at2].why}이므로 무리수이다.`,
          facts: { truth: rows.map((r) => !r.rat), want: true }
        });
      }),
      T('irr-count', '무리수의 개수', '①49', (d) => {
        const nIrr = d.int(2, 4), rows = d.until(() => d.shuffle(pickRows(d, IRR_KEYS, nIrr).concat(pickRows(d, RAT_KEYS, 7 - nIrr))), distinctH);
        return N('다음 수 가운데 무리수는 모두 몇 개인가?', nIrr, {
          unit: '개', figure: numbers(rows.map((r) => r.h)),
          explain: `${rows.filter((r) => r.rat).map((r) => r.why).join(', ')}이므로 유리수이다. 무리수는 ${rows.filter((r) => !r.rat).map((r) => r.h).join(', ')}의 ${nIrr}개이다.`,
          facts: { count: rows.map((r) => !r.rat) }
        });
      }),
      T('irr-rational', '근호 안이 순환소수인 수 가운데 유리수 고르기', '①50', (d) => {
        // 근호 안의 순환소수를 분수로 고치면 제곱인 수가 될 수 있다: √0.4̇ = √(4/9) = 2/3
        const [h, c, num9, root] = d.pick([['0.', '4', 4, frac(2, 3)], ['1.', '7', 16, frac(4, 3)], ['2.', '7', 25, frac(5, 3)], ['0.', '1', 1, frac(1, 3)], ['5.', '4', 49, frac(7, 3)]]);
        const right = { h: rt(rep(h, c)), why: `${rt(rep(h, c))} = ${rq(num9, 9)} = ${root}` };
        const irr = d.until(() => pickRows(d, ['rootPlus', 'rootOver', 'rootDec', 'rootFrac', 'cube'], 3).concat([(() => { const [hh, cc, v] = d.pick([['0.', '5', 5], ['0.', '2', 2], ['1.', '2', 11]]); return { h: rt(rep(hh, cc)), why: `${rt(rep(hh, cc))} = ${rq(v, 9)}${tail(v, '은/는')} 근호 안이 유리수의 제곱이 아닌 수` }; })()]), distinctH);
        const rows = d.shuffle([right].concat(irr));
        return C('다음 중 무리수가 아닌 실수는?', rows.map((r) => r.h), rows.indexOf(right), {
          explain: `${right.why}이므로 유리수이다. ${irr.map((r) => r.why).join(', ')}이므로 무리수이다.`,
          facts: { truth: rows.map((r) => r === right), want: true }
        });
      }),
      T('irr-group', '무리수만으로 이루어진 묶음 고르기', '①51', (d) => {
        const groups = d.until(() => d.shuffle([{ rows: pickRows(d, IRR_KEYS, 3), ok: true }].concat(range(1, 4).map(() => ({ rows: d.shuffle(pickRows(d, IRR_KEYS, 2).concat(pickRows(d, RAT_KEYS, 1))), ok: false })))),
          (gs) => gs.every((g) => distinctH(g.rows)) && new Set(gs.map((g) => g.rows.map((r) => r.h).join())).size === 5);
        const at2 = groups.findIndex((g) => g.ok);
        return C('다음 중 무리수로만 이루어진 것은?', groups.map((g) => g.rows.map((r) => r.h).join(', ')), at2, {
          explain: `${groups.filter((g) => !g.ok).map((g) => g.rows.find((r) => r.rat).why).join(', ')}이므로 유리수가 섞여 있다. 무리수로만 이루어진 것은 ${groups[at2].rows.map((r) => r.h).join(', ')}이다.`,
          facts: { truth: groups.map((g) => g.ok), want: true }
        });
      }),
      T('irr-diagram', '실수 분류도의 빈칸에 해당하는 수', '①52', (d) => {
        const spot = d.pick(['irr', 'frac', 'negint', 'nat']);
        const want = { irr: IRR_KEYS, frac: ['sqFrac', 'sqDec', 'absDec', 'repDec', 'divInt'], negint: ['negSqInt'], nat: ['sqInt'] }[spot];
        const others = ['sqInt', 'negSqInt', 'sqFrac', 'sqDec', 'divInt', 'rootInt', 'rootDec', 'rootFrac', 'repDec', 'zero'];
        const rows = d.until(() => d.shuffle([MAKERS[d.pick(want)](d)].concat(d.shuffle(others).slice(0, 4).map((k) => MAKERS[k](d)))), (list) => distinctH(list) && list.filter((r) => r.kind === spot).length === 1);
        const at2 = rows.findIndex((r) => r.kind === spot);
        return C('다음은 실수를 분류한 것이다. □에 해당하는 수는?', rows.map((r) => r.h), at2, {
          figure: tree(spot),
          explain: `□는 ${KIND[spot]}의 자리이다. ${rows[at2].why}이므로 □에 해당하는 수는 ${rows[at2].h}이다. 나머지는 ${rows.filter((r, i) => i !== at2).map((r) => `${r.h}(${KIND[r.kind]})`).join(', ')}이다.`,
          facts: { truth: rows.map((r) => r.kind === spot), want: true }
        });
      }),
      T('irr-classify', '자연수·정수·유리수의 개수', '①53', (d) => {
        // √9 = 3은 자연수, −√16 = −4는 정수, 1.4̇는 유리수이다.
        const ask = d.pick(['nat', 'int', 'rat']), WORD = { nat: '자연수', int: '정수', rat: '유리수' }, hit = (r) => (ask === 'nat' ? r.kind === 'nat' : ask === 'int' ? ['nat', 'zero', 'negint'].includes(r.kind) : r.rat);
        const rows = d.until(() => d.shuffle(['sqInt', 'negSqInt', 'zero', 'sqFrac', 'repDec', 'natPlain', 'negPlain', 'rootInt', 'pi', 'divInt', 'sumInt']).slice(0, 7).map((k) => MAKERS[k](d)), (list) => distinctH(list) && list.filter(hit).length >= 2 && list.filter(hit).length < 7);
        const flags = rows.map(hit);
        return N(`다음 수 가운데 ${WORD[ask]}는 모두 몇 개인가?`, flags.filter(Boolean).length, {
          unit: '개', figure: numbers(rows.map((r) => r.h)),
          explain: `${rows.map((r) => `${r.h}(${KIND[r.kind]})`).join(', ')}이다. ${WORD[ask]}는 ${rows.filter(hit).map((r) => r.h).join(', ')}의 ${flags.filter(Boolean).length}개이다.`,
          facts: { count: flags }
        });
      }),
      T('irr-claims', '실수의 분류에 대한 설명', '①54', (d) => {
        const yes = ['유한소수는 유리수이다.', '순환소수는 유리수이다.', '무리수는 순환소수가 아닌 무한소수이다.', '실수는 유리수와 무리수로 이루어져 있다.', '정수가 아닌 유리수는 유한소수나 순환소수로 나타낼 수 있다.', '무리수는 분자, 분모가 정수인 분수로 나타낼 수 없다.', '근호를 사용하여 나타낸 수 가운데에는 유리수도 있다.'];
        const no = [
          ['실수 중에는 유리수도 무리수도 아닌 수가 있다.', '실수는 유리수와 무리수로만 이루어져 있다.', yes[3]],
          ['실수 중 정수가 아닌 수는 모두 무리수이다.', '정수가 아닌 유리수도 있다.', ''],
          ['순환소수는 무리수이다.', '순환소수는 분수로 나타낼 수 있으므로 유리수이다.', yes[1]],
          ['무한소수는 모두 무리수이다.', '순환소수는 무한소수이지만 유리수이다.', ''],
          ['근호를 사용하여 나타낸 수는 모두 무리수이다.', `${R(4)} = 2처럼 근호 안의 수가 유리수의 제곱이면 유리수이다.`, yes[6]],
          ['유한소수 중에는 무리수도 있다.', '유한소수는 분수로 나타낼 수 있으므로 모두 유리수이다.', yes[0]]
        ];
        const want = d.bool();
        return claimQ(d, `실수에 대한 다음 설명 가운데 ${want ? '옳은' : '옳지 않은'} 것은?`, yes, no, want);
      }),
      T('irr-dense', '수의 사이와 수직선에 대한 설명', '①55', (d) => {
        const yes = ['서로 다른 두 유리수 사이에는 무수히 많은 유리수가 있다.', '서로 다른 두 무리수 사이에는 무수히 많은 무리수가 있다.', '서로 다른 두 자연수 사이에는 무리수가 있다.', '모든 무리수는 수직선 위의 점으로 나타낼 수 있다.', '수직선은 실수를 나타내는 점들로 완전히 메울 수 있다.', '서로 다른 두 무리수 사이에는 무수히 많은 유리수가 있다.'];
        const no = [
          ['서로 다른 두 자연수 사이에는 무리수가 없다.', `1과 2 사이에도 ${R(2)}, ${R(3)} 같은 무리수가 있다.`, yes[2]],
          ['서로 다른 두 유리수 사이에는 유리수만 있다.', '두 유리수 사이에는 무리수도 있다.', ''],
          ['수직선은 유리수에 대응하는 점들로 완전히 메울 수 있다.', `${R(2)} 같은 무리수에 대응하는 점이 남으므로 유리수만으로는 수직선을 메울 수 없다.`, yes[4]],
          ['서로 다른 두 무리수 사이에는 유리수가 유한개 있다.', '두 무리수 사이에는 무수히 많은 유리수가 있다.', yes[5]],
          ['서로 다른 두 자연수 사이에는 무수히 많은 정수가 있다.', '두 자연수 사이에 있는 정수는 유한개이다.', ''],
          ['무리수는 수직선 위에 나타낼 수 없다.', '한 변의 길이가 1인 정사각형의 대각선을 옮기는 것처럼 무리수도 수직선 위에 나타낼 수 있다.', yes[3]]
        ];
        const want = d.bool();
        return claimQ(d, `수와 수직선에 대한 다음 설명 가운데 ${want ? '옳은' : '옳지 않은'} 것은?`, yes, no, want);
      }),
      T('irr-between-claims', '두 무리수 사이에 있는 수에 대한 설명', '①56', (d) => {
        // 어림하여 두 수 사이의 정수를 센다. 무리수·유리수는 두 수 사이에 무수히 많다.
        const [negLeft, a, b] = d.until(() => [d.bool(), nonSq(d, 2, 15), nonSq(d, 2, 30)], ([nl, a1, b1]) => {
          const lo1 = nl ? -Math.sqrt(a1) : Math.sqrt(a1), hi1 = Math.sqrt(b1), ints1 = range(Math.ceil(lo1), Math.floor(hi1)).filter((v) => v > lo1 && v < hi1);
          return a1 !== b1 && hi1 - lo1 > 1 && ints1.length >= 1 && ints1.length <= 5;
        });
        const lo = negLeft ? -Math.sqrt(a) : Math.sqrt(a), hi = Math.sqrt(b), Lh = negLeft ? neg(R(a)) : R(a), Rh = R(b);
        const ints = range(Math.ceil(lo), Math.floor(hi)).filter((v) => v > lo && v < hi), nats = ints.filter((v) => v > 0);
        const inside = d.pick(ints), outside = Math.floor(hi) + 1;
        const yes = [`정수는 ${ints.length}개 있다.`, `자연수는 ${nats.length}개 있다.`, '무리수는 무수히 많이 있다.', '유리수는 무수히 많이 있다.', `${tj(inside, '은/는')} 두 수 사이에 있다.`, `${Rh} ${MINUS} 0.01은 두 수 사이에 있다.`];
        const no = [
          [`정수는 ${ints.length + 1}개 있다.`, `두 수 사이의 정수는 ${ints.map((v) => tx(Q(v))).join(', ')}의 ${ints.length}개이다.`, yes[0]],
          [`자연수는 ${nats.length + 1}개 있다.`, nats.length ? `두 수 사이의 자연수는 ${nats.join(', ')}의 ${nats.length}개이다.` : '두 수 사이에는 자연수가 없다.', yes[1]],
          ['무리수는 하나뿐이다.', '두 수 사이에는 무리수가 무수히 많다.', yes[2]],
          ['유리수는 유한개 있다.', '두 수 사이에는 유리수가 무수히 많다.', yes[3]],
          [`${tj(outside, '은/는')} 두 수 사이에 있다.`, `${outside} = ${R(outside * outside)}이고 ${outside * outside} ${GT} ${b}이므로 ${tj(outside, '은/는')} ${Rh}보다 크다.`, ''],
          [`${Lh} ${MINUS} 0.01은 두 수 사이에 있다.`, `${Lh} ${MINUS} 0.01은 ${Lh}보다 작으므로 두 수 사이에 있지 않다.`, '']
        ];
        const want = d.bool();
        return claimQ(d, `수직선 위에서 두 수 ${Lh}${tail(a, '과/와')} ${Rh} 사이에 있는 수에 대한 설명으로 ${want ? '옳은' : '옳지 않은'} 것은?`, yes, no, want);
      }),
      T('irr-not-between', '두 무리수 사이에 있지 않은 수', '①57', (d) => {
        const a = nonSq(d, 2, 10), b = d.until(() => nonSq(d, 8, 30), (v) => Math.sqrt(v) - Math.sqrt(a) > 1), below = d.bool();
        const opt = (c, sgn, eps) => ({ h: `${R(c)} ${sgn < 0 ? MINUS : '+'} ${eps}`, js: `${c}${RT}${sgn < 0 ? '-' : '+'}${eps}` });
        const ins = d.shuffle([opt(a, 1, '0.1'), opt(b, -1, '0.1'), opt(b, -1, '0.01'), opt(a, 1, '0.01')]).slice(0, 3).concat([{ h: frac(`${R(a)} + ${R(b)}`, 2), js: `(${a}${RT}+${b}${RT})/2` }]);
        const out = Object.assign(below ? opt(a, -1, '0.01') : opt(b, 1, '0.1'), { out: true });
        const rows = d.shuffle(ins.concat([out])), at2 = rows.indexOf(out);
        return C(`${R(a)} = ${Math.sqrt(a).toFixed(3)}…, ${R(b)} = ${Math.sqrt(b).toFixed(3)}…일 때, 다음 중 두 수 ${R(a)}${tail(a, '과/와')} ${R(b)} 사이에 있지 않은 수는?`, rows.map((r) => r.h), at2, {
          explain: `${out.h}${below ? `${tail(1, '은/는')} ${R(a)}보다 작다` : `${tail(1, '은/는')} ${R(b)}보다 크다`}. ${frac(`${R(a)} + ${R(b)}`, 2)}${tail(b, '은/는')} 두 수의 한가운데에 있는 수이고, 나머지도 두 수 사이에 있다.`,
          facts: { choose: { exprs: rows.map((r) => r.js), rule: below ? 'onlyBelow' : 'onlyAbove', target: below ? Math.sqrt(a) : Math.sqrt(b) }, unseen: U5 }
        });
      }),
      T('irr-expr', '문자에 무리수를 넣은 식이 유리수인가', '①58', (d) => {
        // 제곱하면 근호가 없어진다(b = √2 이면 b² = 2). 0이 아닌 유리수와 무리수의 합·곱은 무리수이다.
        const want = d.bool(), a = V('a'), b = V('b');
        let rows, head;
        if (d.bool()) {
          const k = d.int(2, 5), m = d.pick([2, 3, 5, 6, 7]);
          head = `${a} = ${MINUS}${k}, ${b} = ${R(m)}`;
          rows = [[`${a} ${MINUS} ${b}`, false], [`${a}${b}`, false], [frac(a, b), false], [`${a} + ${b}${sup(2)}`, true], [`${a}${sup(2)} + ${b}`, false], [`${a}${sup(2)} ${MINUS} ${b}${sup(2)}`, true], [`${b}${sup(2)} ÷ ${a}`, true], [`(${a}${b})${sup(2)}`, true], [`${a}${b}${sup(2)}`, true]];
        } else {
          const m = d.pick([2, 3, 5, 6, 7]), q = d.pick([2, 3, 4]);
          head = `${a} = ${R(m)}`;
          rows = [[`${a} ${MINUS} ${R(m)}`, true], [`${frac(1, m * q)}${a}${sup(2)}`, true], [rt(sq(a)), false], [frac(a, q), false], [`${MINUS}${q}${a}`, false], [`${a} + ${q}`, false], [`${a}${sup(2)} + ${q}`, true], [`${a} × ${a}`, true], [`${a}${sup(2)} ÷ ${q}`, true]];
        }
        const list = d.shuffle(d.shuffle(rows.filter((r) => r[1] === want)).slice(0, 1).concat(d.shuffle(rows.filter((r) => r[1] !== want)).slice(0, 4))), at2 = list.findIndex((r) => r[1] === want);
        return C(`${head}일 때, 다음 중 ${want ? '유리수' : '무리수'}인 것은?`, list.map((r) => r[0]), at2, {
          explain: `값을 넣어 셈하면 ${list.map((r) => `${r[0]}${r[1] ? '(유리수)' : '(무리수)'}`).join(', ')}이다. 제곱하면 근호가 없어지고, 0이 아닌 유리수와 무리수의 합·차·곱·몫은 무리수이다.`,
          facts: { truth: list.map((r) => r[1] === want), want: true }
        });
      }),
      T('irr-approx', '제곱근의 어림 범위를 제곱으로 찾기', '①59', (d) => {
        // 1.41² < 2 < 1.42² 이므로 1.41 < √2 < 1.42. 제곱한 값의 표를 보고 √N 이 들어가는 칸을 찾는다.
        const n = nonSq(d, 2, 30), r = Math.sqrt(n), t0 = Math.floor(r * 10), ts = [t0 - 1, t0, t0 + 1, t0 + 2], f1 = (t) => (t / 10).toFixed(1), f2 = (t) => (t * t / 100).toFixed(2);
        const opts = [[0, 1], [1, 2], [2, 3]].map(([i, j]) => ({ h: `${f1(ts[i])}${tail(ts[i] % 10, '과/와')} ${f1(ts[j])} 사이`, ok: i === 1 }));
        opts.push({ h: `${f1(ts[3] + 1)}보다 크다`, ok: false });
        const rows = d.shuffle(opts), at2 = rows.findIndex((o) => o.ok);
        return C(`다음 표는 몇 개의 수를 제곱한 값이다. 이 표를 보고 ${R(n)}의 값의 범위를 바르게 말한 것은?`, rows.map((o) => o.h), at2, {
          figure: table([V('x'), V('x') + sup(2)], ts.map((t) => [f1(t), f2(t)])),
          explain: `${f2(ts[1])} ${LT} ${n} ${LT} ${f2(ts[2])}, 곧 ${f1(ts[1])}${sup(2)} ${LT} (${R(n)})${sup(2)} ${LT} ${f1(ts[2])}${sup(2)}이므로 ${f1(ts[1])} ${LT} ${R(n)} ${LT} ${f1(ts[2])}이다.`,
          facts: { truth: rows.map((o) => o.ok), want: true }
        });
      }),
      T('irr-paper', '똑같이 잘라도 모양이 같은 직사각형', '①60', (d) => {
        // A4 용지처럼 긴 변을 n 등분한 조각이 처음 직사각형과 닮음이면 (긴 변) : (짧은 변) = √n : 1
        const n = d.pick([2, 2, 3, 5]), Wd = 150, Ht = Wd / Math.sqrt(n), bd = B.kit.mgeo.Board();
        bd.poly([[0, 0], [Wd, 0], [Wd, -Ht], [0, -Ht]], 'fill:rgba(251,191,36,0.3)');
        for (let i = 1; i < n; i += 1) bd.seg([Wd * i / n, 0], [Wd * i / n, -Ht], 'cut');
        bd.dim([0, -Ht], [0, 0], '1', [Wd, -Ht / 2], 10);
        const word = { 2: '이등분', 3: '삼등분', 5: '오등분' }[n];
        return rootAns(`짧은 변의 길이가 1인 직사각형을 긴 변이 ${word}되도록 똑같이 ${n}조각으로 잘랐더니, 자른 직사각형 한 조각이 처음 직사각형과 닮음이었다. 처음 직사각형의 긴 변의 길이는?`, n, {
          figure: bd.svg(`짧은 변의 길이가 1인 직사각형을 긴 변을 ${n}등분하는 점선으로 ${n}조각으로 나누었다`),
          explain: `처음 직사각형의 긴 변의 길이를 ${V('a')}라 하면 한 조각의 두 변은 1과 ${frac(V('a'), n)}이다. 닮음이므로 ${V('a')} : 1 = 1 : ${frac(V('a'), n)}, ${V('a')}${sup(2)} = ${n}이고 ${V('a')} ${GT} 0이므로 ${V('a')} = ${R(n)}이다.`,
          facts: { calc: [[String(n), 0]] }
        });
      })
    ]
  });

  // 실수 분류도(□ 자리 하나)
  function tree(spot) {
    const X0 = 6, X1 = 56, X2 = 118, X3 = 170, Y = { nat: 18, zero: 40, negint: 62, int: 40, frac: 90, rat: 64, irr: 124, real: 94 };
    const label = (x, y, key, text) => (spot === key ? `<rect x="${x - 1}" y="${y - 10}" width="34" height="20" rx="3" style="fill:#fff;stroke:#1f2933;stroke-width:1.5"/>` : `<text class="mb-label" style="font-size:13px" x="${x}" y="${y}" dominant-baseline="central">${text}</text>`);
    const brace = (x, y0, y1, ym) => `<path d="M${x + 7} ${y0}H${x}V${y1}H${x + 7}M${x - 5} ${ym}H${x}" style="fill:none;stroke:#1f2933;stroke-width:1.2"/>`;
    const out = label(X0, Y.real, 'real', '실수') + brace(X1 - 10, Y.rat, Y.irr, Y.real) + label(X1, Y.rat, 'rat', '유리수') + label(X1, Y.irr, 'irr', '무리수')
      + brace(X2 - 10, Y.int, Y.frac, Y.rat) + label(X2, Y.int, 'int', '정수') + label(X2, Y.frac, 'frac', '정수가 아닌 유리수')
      + brace(X3 - 10, Y.nat, Y.negint, Y.int) + label(X3, Y.nat, 'nat', '양의 정수(자연수)') + label(X3, Y.zero, 'zero', '0') + label(X3, Y.negint, 'negint', '음의 정수');
    const said = '실수의 분류: 실수는 유리수와 무리수, 유리수는 정수와 정수가 아닌 유리수, 정수는 양의 정수(자연수), 0, 음의 정수로 나뉜다. 이 가운데 한 자리가 □로 비어 있다';
    return `<svg class="mb-geo" viewBox="0 0 292 140" width="292" role="img" aria-label="${said}">${out}</svg>`;
  }

  // ── 수직선 위의 무리수 ──
  const SQ2 = Math.SQRT2;
  const sq4 = (x0, x1, h) => [[x0, 0], [x1, 0], [x1, h], [x0, h]];
  B.addGroup('9-1-1', {
    id: 'line', title: '수직선 위의 무리수', standard: STD8,
    types: [
      T('line-square', '단위 정사각형의 대각선을 옮긴 점', '①62', (d) => {
        // 한 변이 1인 정사각형의 대각선의 길이는 √2이다. 중심이 c 이면 오른쪽 점은 c + √2, 왼쪽 점은 c − √2
        const p = d.until(() => d.int(-3, 3), (v) => v !== 0 && v !== -1), useA = d.bool(), c = useA ? p : p + 1, right = d.bool();
        const lo = Math.min(p, Math.floor(c - 1.5)), hi = Math.max(p + 1, Math.ceil(c + 1.5)), corner = useA ? [p + 1, 1] : [p, 1], a0 = useA ? 45 : 135;
        const fig = rline(lo, hi, {
          rows: 1, headroom: 16, labels: range(lo, hi).filter((v) => v !== p && v !== p + 1), polys: [{ pts: sq4(p, p + 1, 1) }], segs: [[c, 0, corner[0], corner[1]]],
          arcs: [{ c: [c, 0], r: SQ2, a0, a1: 0 }, { c: [c, 0], r: SQ2, a0, a1: 180 }],
          points: [{ at: c - SQ2, name: 'P', side: -1 }, { at: c + SQ2, name: 'Q', side: 1 }],
          names: [{ p: [p, 0], name: 'A', a: 270, gap: 15 }, { p: [p + 1, 0], name: 'B', a: 270, gap: 15 }, { p: [p + 1, 1], name: 'C', a: 45, gap: 11 }, { p: [p, 1], name: 'D', a: 135, gap: 11 }],
          say: `수직선 위의 두 점 A(${tx(Q(p))}), B(${tx(Q(p + 1))})를 이은 선분을 한 변으로 하는 정사각형 ABCD가 수직선 위쪽에 있다. 점 ${useA ? 'A' : 'B'}를 중심으로 하고 대각선 ${useA ? 'AC' : 'BD'}를 반지름으로 하는 원이 수직선과 만나는 점이 왼쪽에 P, 오른쪽에 Q이다`
        });
        const ask = right ? 'Q' : 'P', s = right ? 1 : -1;
        return abcAns(`수직선 위의 두 점 A(${tx(Q(p))}), B(${tx(Q(p + 1))})에 대하여 ${SG('AB')}를 한 변으로 하는 정사각형 ABCD가 있다. ${SG(useA ? 'AC' : 'BD')} = ${SG(useA ? 'AP' : 'BP')} = ${SG(useA ? 'AQ' : 'BQ')}일 때, 점 ${ask}가 나타내는 수는? ${ABC_NOTE}`, c, s, 2, {
          figure: fig, explain: `한 변의 길이가 1인 정사각형의 대각선의 길이는 ${rt(`1${sup(2)} + 1${sup(2)}`)} = ${R(2)}이다. 점 ${ask}는 점 ${useA ? 'A' : 'B'}(${tx(Q(c))})에서 ${right ? '오른쪽' : '왼쪽'}으로 ${R(2)}만큼 간 점이므로 ${sText([num(c), rad(2, s)])}이다.`,
          facts: { calc: [[String(c), 0], [right ? '1' : '0-1', 1], ['1*1+1*1', 2]], unseen: [0, 1] }
        });
      }),
      T('line-pick', '여러 정사각형 그림에서 주어진 수의 점 고르기', '①63', (d) => {
        // 정사각형마다 어느 꼭짓점을 중심으로 어느 쪽으로 돌렸는지 보고 점의 수를 셈한다(왼쪽 아래 꼭짓점 → 오른쪽으로 +√2, 오른쪽 아래 꼭짓점 → 왼쪽으로 −√2).
        const nSq = 5, lo = d.int(-3, -1);
        const pts = d.until(() => range(0, nSq - 1).map((i) => (d.bool() ? { c: lo + i, s: 1 } : { c: lo + i + 1, s: -1 })).map((q) => Object.assign(q, { v: q.c + q.s * SQ2 })),
          (l) => l.some((q) => q.s > 0) && l.some((q) => q.s < 0) && l.every((q, i) => l.every((w, j) => i === j || Math.abs(q.v - w.v) > 0.45)));
        const named = pts.slice().sort((x, y) => x.v - y.v).map((q, i) => Object.assign({}, q, { name: 'ABCDE'[i] }));
        const want = d.pick(named), hi = lo + nSq + 2;
        const fig = rline(lo - 1, hi, {
          rows: 1, headroom: 14, polys: range(0, nSq - 1).map((i) => ({ pts: sq4(lo + i, lo + i + 1, 1) })),
          arcs: pts.map((q) => ({ c: [q.c, 0], r: SQ2, a0: q.s > 0 ? 45 : 135, a1: q.s > 0 ? 0 : 180 })),
          points: named.map((q) => ({ at: q.v, name: q.name, side: q.s })),
          say: `수직선 위에 한 변의 길이가 1인 정사각형 ${nSq}개가 ${tx(Q(lo))}부터 ${tx(Q(lo + nSq))}까지 이어 놓여 있다. 왼쪽 것부터 정사각형마다 ${pts.map((q, i) => `${i + 1}번째는 ${tx(Q(q.c))}인 꼭짓점을 중심으로 대각선을 ${q.s > 0 ? '오른쪽' : '왼쪽'}으로 돌렸다`).join(', ')}. 돌린 끝의 점을 왼쪽부터 A, B, C, D, E라 하였다`
        });
        const target = sText([num(want.c), rad(2, want.s)]);
        return C(`다음 그림과 같이 수직선 위에 한 변의 길이가 1인 정사각형 ${nSq}개가 있다. 각 점은 정사각형의 대각선을 반지름으로 하는 원이 수직선과 만나는 점이다. ${target}에 대응하는 점은?`, named.map((q) => '점 ' + q.name), named.indexOf(want), {
          figure: fig, explain: `대각선의 길이는 ${R(2)}이다. ${named.map((q) => `점 ${q.name}는 ${tx(Q(q.c))}에서 ${q.s > 0 ? '오른쪽' : '왼쪽'}으로 ${R(2)}만큼 간 ${sText([num(q.c), rad(2, q.s)])}`).join(', ')}이므로 ${target}에 대응하는 점은 ${want.name}이다.`,
          facts: { truth: named.map((q) => q === want), want: true }
        });
      }),
      T('line-dist', '정사각형의 대각선을 옮긴 두 점 사이의 거리', '①64', (d) => {
        // 한 변이 √2인 정사각형의 대각선은 2이다. P 와 Q 사이의 거리는 대각선 둘의 합에서 한 변을 빼거나(겹칠 때) 더한다.
        const b = d.int(-2, 1), inward = d.bool(), c = b + SQ2, P = inward ? c - 2 : b - 2, Qp = inward ? b + 2 : c + 2;
        const fig = rline(b - 3, b + 4, {
          rows: 2, headroom: 8, labels: [], polys: [{ pts: sq4(b, c, SQ2) }],
          segs: [[b, 0, c, SQ2, 'dash'], [c, 0, b, SQ2, 'dash']],
          arcs: inward ? [{ c: [c, 0], r: 2, a0: 135, a1: 180 }, { c: [b, 0], r: 2, a0: 45, a1: 0 }] : [{ c: [b, 0], r: 2, a0: 45, a1: 180 }, { c: [c, 0], r: 2, a0: 135, a1: 0 }],
          points: [{ at: P, name: 'P', side: -1 }, { at: Qp, name: 'Q', side: 1 }],
          names: [{ p: [b, 0], name: 'B', a: 270, gap: 14 }, { p: [c, 0], name: 'C', a: 270, gap: 14 }, { p: [c, SQ2], name: 'D', a: 45, gap: 11 }, { p: [b, SQ2], name: 'A', a: 135, gap: 11 }],
          say: `한 변의 길이가 루트 2인 정사각형 ABCD의 변 BC가 수직선 위에 있다(B가 왼쪽). ${inward ? '점 C를 중심으로 하고 대각선 CA를 반지름으로 하는 원이 수직선과 왼쪽에서 만나는 점이 P, 점 B를 중심으로 하고 대각선 BD를 반지름으로 하는 원이 수직선과 오른쪽에서 만나는 점이 Q' : '점 B를 중심으로 하고 대각선 BD를 반지름으로 하는 원이 수직선과 왼쪽에서 만나는 점이 P, 점 C를 중심으로 하고 대각선 CA를 반지름으로 하는 원이 수직선과 오른쪽에서 만나는 점이 Q'}이다`
        });
        const rel = inward ? `${SG('CA')} = ${SG('CP')}, ${SG('BD')} = ${SG('BQ')}` : `${SG('BD')} = ${SG('BP')}, ${SG('CA')} = ${SG('CQ')}`;
        return abcAns(`다음 그림과 같이 한 변의 길이가 ${R(2)}인 정사각형 ABCD의 한 변 BC가 수직선 위에 있다. ${rel}일 때, 두 점 P, Q 사이의 거리는? ${ABC_NOTE}`, 4, inward ? -1 : 1, 2, {
          figure: fig, explain: `대각선의 길이는 ${rt(`(${R(2)})${sup(2)} + (${R(2)})${sup(2)}`)} = ${R(4)} = 2이다. ${inward ? `${SG('PC')} = 2, ${SG('BQ')} = 2이고 두 선분은 ${SG('BC')} = ${R(2)}만큼 겹치므로 ${SG('PQ')} = 2 + 2 ${MINUS} ${R(2)} = 4 ${MINUS} ${R(2)}` : `${SG('PB')} = 2, ${SG('CQ')} = 2이고 그 사이에 ${SG('BC')} = ${R(2)}가 있으므로 ${SG('PQ')} = 2 + ${R(2)} + 2 = 4 + ${R(2)}`}이다.`,
          facts: { calc: [['2+2', 0], [inward ? '0-1' : '1', 1], ['2', 2]], unseen: [0, 1] }
        });
      }),
      T('line-grid-seg', '모눈종이의 선분을 수직선으로 옮긴 점', '①65 ①66', (d) => {
        // 모눈의 선분은 직각삼각형의 빗변이다: 가로 m칸, 세로 n칸이면 길이는 √(m² + n²).
        const [m, n] = d.pick([[1, 2], [2, 1], [1, 3], [3, 1], [2, 3], [3, 2]]), s = d.pick([1, -1]), p = d.until(() => d.int(-2, 2), (v) => v !== 0), len2 = m * m + n * n;
        const end = [p + s * m, n], pt = p + s * Math.sqrt(len2), lo = Math.floor(Math.min(p - 1, pt - 1, end[0] - 1)), hi = Math.ceil(Math.max(p + 1, pt + 1, end[0] + 1));
        const fig = rline(lo, hi, {
          rows: n, grid: true, headroom: 14, segs: [[p, 0, end[0], end[1]]], arcs: [{ c: [p, 0], r: Math.sqrt(len2), a0: Math.atan2(n, s * m) * 180 / Math.PI, a1: s > 0 ? 0 : 180 }],
          points: [{ at: pt, name: 'P', side: s }], names: [{ p: [p, 0], name: 'A', a: s > 0 ? 125 : 55, gap: 11 }, { p: end, name: 'B', a: 90, gap: 10 }],
          say: `한 눈금의 길이가 1인 모눈종이 위에 수직선이 있다. 점 A는 수직선 위의 ${tx(Q(p))}이고, 점 B는 A에서 ${s > 0 ? '오른쪽' : '왼쪽'}으로 ${m}칸, 위로 ${n}칸 간 곳이다. 점 A를 중심으로 하고 선분 AB를 반지름으로 하는 원이 수직선과 ${s > 0 ? '오른쪽' : '왼쪽'}에서 만나는 점이 P이다`
        });
        return abcAns(`다음 그림은 한 눈금의 길이가 1인 모눈종이 위에 수직선과 선분 AB를 그린 것이다. ${SG('AB')} = ${SG('AP')}일 때, 점 P가 나타내는 수는? ${ABC_NOTE}`, p, s, len2, {
          figure: fig, explain: `${SG('AB')}는 가로 ${m}, 세로 ${n}인 직각삼각형의 빗변이므로 ${SG('AB')} = ${rt(`${m}${sup(2)} + ${n}${sup(2)}`)} = ${R(len2)}이다. 점 P는 A(${tx(Q(p))})에서 ${s > 0 ? '오른쪽' : '왼쪽'}으로 ${R(len2)}만큼 간 점이므로 ${sText([num(p), rad(len2, s)])}이다.`,
          facts: { calc: [[String(p), 0], [s > 0 ? '1' : '0-1', 1], [`${m}*${m}+${n}*${n}`, 2]], unseen: [0, 1] }
        });
      }),
      T('line-grid-square', '모눈종이의 비스듬한 정사각형을 수직선으로 옮긴 점', '①67', (d) => {
        // 정사각형의 넓이(큰 정사각형 − 네 직각삼각형)에서 한 변의 길이를 구하고, 그 길이만큼 옮긴다.
        const [m, n] = d.pick([[2, 1], [1, 2], [3, 1], [1, 3], [3, 2], [2, 3]]), p = d.until(() => d.int(-1, 2), (v) => v !== 0), area = m * m + n * n;
        const A = [p, 0], Bq = [p + m, n], Dq = [p - n, m], Cq = [p + m - n, m + n], right = d.bool(), side = Math.sqrt(area);
        const lo = Math.floor(Math.min(p - side, Dq[0])) - 1, hi = Math.ceil(Math.max(p + side, Bq[0])) + 1;
        const fig = rline(lo, hi, {
          rows: m + n, grid: true, headroom: 14, polys: [{ pts: [A, Bq, Cq, Dq] }],
          arcs: [{ c: A, r: side, a0: Math.atan2(n, m) * 180 / Math.PI, a1: 0 }, { c: A, r: side, a0: Math.atan2(m, -n) * 180 / Math.PI, a1: 180 }],
          points: [{ at: p - side, name: 'P', side: -1 }, { at: p + side, name: 'Q', side: 1 }],
          names: [{ p: A, name: 'A', a: (() => { const tb = Math.atan2(n, m) * 180 / Math.PI, td = Math.atan2(m, -n) * 180 / Math.PI; return 180 - td > tb ? (td + 180) / 2 : tb / 2; })(), gap: 14 }, { p: Bq, name: 'B', a: Math.atan2(n, m) * 180 / Math.PI, gap: 11 }, { p: Cq, name: 'C', a: Math.atan2(m + n, m - n) * 180 / Math.PI, gap: 11 }, { p: Dq, name: 'D', a: Math.atan2(m, -n) * 180 / Math.PI, gap: 11 }],
          say: `한 눈금의 길이가 1인 모눈종이 위에 수직선과 정사각형 ABCD가 있다. 꼭짓점 A는 수직선 위의 ${tx(Q(p))}이고, B는 A에서 오른쪽으로 ${m}칸·위로 ${n}칸, D는 A에서 왼쪽으로 ${n}칸·위로 ${m}칸 간 곳이다. 점 A를 중심으로 AD를 반지름으로 하는 원이 왼쪽에서 만나는 점이 P, AB를 반지름으로 하는 원이 오른쪽에서 만나는 점이 Q이다`
        });
        const ask = right ? 'Q' : 'P';
        return abcAns(`다음 그림은 한 눈금의 길이가 1인 모눈종이 위에 수직선과 정사각형 ABCD를 그린 것이다. ${SG('AD')} = ${SG('AP')}, ${SG('AB')} = ${SG('AQ')}일 때, 점 ${ask}가 나타내는 수는? ${ABC_NOTE}`, p, right ? 1 : -1, area, {
          figure: fig, explain: `정사각형 ABCD의 넓이는 ${m + n} × ${m + n} ${MINUS} 4 × ${frac(m * n, 2)} = ${area}이므로 한 변의 길이는 ${R(area)}이다. 점 ${ask}는 A(${tx(Q(p))})에서 ${right ? '오른쪽' : '왼쪽'}으로 ${R(area)}만큼 간 점이므로 ${sText([num(p), rad(area, right ? 1 : -1)])}이다.`,
          facts: { calc: [[String(p), 0], [right ? '1' : '0-1', 1], [`(${m}+${n})*(${m}+${n})-4*${m}*${n}/2`, 2]], unseen: [0, 1, 4, 2] }
        });
      }),
      T('line-order', '수직선 위의 세 점에 수를 대응시키기', '①68', (d) => {
        const forms = () => d.pick([
          () => [num(d.until(() => d.int(-2, 2), (v) => v !== 0)), rad(nonSq(d, 2, 10), d.pick([1, -1]))], () => [rad(nonSq(d, 2, 10)), rad(nonSq(d, 2, 10), -1)], () => [rad(nonSq(d, 2, 15))], () => [rad(nonSq(d, 2, 10)), num(-d.int(1, 3))]
        ])();
        const rows = d.until(() => [forms(), forms(), forms()], (l) => { const v = l.map(sVal).sort((a, b) => a - b); return new Set(l.map((x) => sText(x))).size === 3 && v[1] - v[0] > 0.35 && v[2] - v[1] > 0.35 && v[0] > -4 && v[2] < 4 && l.every((x) => x.length < 2 || x[0].c !== x[1].c); });
        const vals = rows.map(sVal), sorted = rows.slice().sort((a, b) => sVal(a) - sVal(b)), lo = Math.floor(Math.min(...vals)) - 1, hi = Math.ceil(Math.max(...vals)) + 1;
        const between = (v) => `${tj(Math.floor(v), '과/와')} ${tx(Q(Math.floor(v) + 1))} 사이`;
        const fig = rline(lo, hi, { points: sorted.map((r, i) => ({ at: sVal(r), name: 'ABC'[i], side: 1 })), headroom: 8, say: `수직선 위에 세 점이 왼쪽부터 A, B, C의 차례로 있다. ${sorted.map((r, i) => `점 ${'ABC'[i]}는 ${between(sVal(r))}`).join(', ')}에 있다` });
        const perms = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]], rightPerm = sorted.map((r) => rows.indexOf(r));
        const list = d.shuffle(d.shuffle(perms.filter((pm) => pm.join() !== rightPerm.join())).slice(0, 4).concat([rightPerm])), at2 = list.findIndex((pm) => pm.join() === rightPerm.join());
        return C(`세 수 ${rows.map((r) => sText(r)).join(', ')}에 대응하는 점이 다음 수직선 위의 세 점 A, B, C 중 하나일 때, 바르게 짝 지은 것은?`, list.map((pm) => pm.map((k, i) => `${'ABC'[i]}: ${sText(rows[k])}`).join(', ')), at2, {
          figure: fig, explain: `세 수의 대소를 견주면 ${sorted.map((r) => sText(r)).join(` ${LT} `)}이다. 수직선에서 왼쪽에 있을수록 작으므로 A: ${sText(sorted[0])}, B: ${sText(sorted[1])}, C: ${sText(sorted[2])}이다.`,
          facts: { truth: list.map((pm) => pm.join() === rightPerm.join()), want: true }
        });
      }),
      T('line-left', '수직선에서 가장 왼쪽(오른쪽)에 있는 수', '①69', (d) => {
        const left = d.bool();
        const rows = d.until(() => d.shuffle([
          [num(-d.int(1, 3)), rad(nonSq(d, 2, 8))], [num(-d.int(1, 3)), rad(nonSq(d, 2, 8))], [num(d.int(1, 3)), rad(nonSq(d, 2, 8), -1)], [num(0)], [num(-d.int(1, 2)), rad(nonSq(d, 2, 8))]
        ]), (l) => { const v = l.map(sVal), best = left ? Math.min(...v) : Math.max(...v); return new Set(l.map((x) => sText(x))).size === 5 && v.filter((x) => Math.abs(x - best) < 0.05).length === 1; });
        const vals = rows.map(sVal), best = left ? Math.min(...vals) : Math.max(...vals), at2 = vals.indexOf(best);
        const approx = (v) => (v === 0 ? '0' : `${v < 0 ? MINUS : ''}${Math.abs(v).toFixed(2)}…`);
        return C(`다음 수를 수직선 위에 나타낼 때, 가장 ${left ? '왼쪽' : '오른쪽'}에 있는 수는?`, rows.map((r) => sText(r)), at2, {
          explain: `수직선에서 ${left ? '왼쪽' : '오른쪽'}에 있을수록 ${left ? '작은' : '큰'} 수이다. ${rows.filter((r) => sVal(r) !== 0).map((r) => `${sText(r)} = ${approx(sVal(r))}`).join(', ')}이므로 가장 ${left ? '작은' : '큰'} 수는 ${sText(rows[at2])}이다.`,
          facts: { choose: { exprs: rows.map(posJs), rule: left ? 'min' : 'max' }, unseen: U5.concat([OFF, 0]) }
        });
      }),
      T('line-reverse', '옮긴 점의 수에서 꼭짓점의 수 거꾸로 찾기', '심30', (d) => {
        // 점 P = (C가 나타내는 수) − √2 이므로 C를 먼저 구하고, B는 C보다 1 작다.
        const cc = d.int(-2, 5), fromC = d.bool(), b = cc - 1;
        const pv = fromC ? cc - SQ2 : b + SQ2, given = fromC ? [num(cc), rad(2, -1)] : [num(b), rad(2)];
        const fig = rline(b - 2, cc + 2, {
          rows: 1, headroom: 14, labels: [], polys: [{ pts: sq4(b, cc, 1) }], segs: fromC ? [[cc, 0, b, 1, 'dash']] : [[b, 0, cc, 1, 'dash']],
          arcs: fromC ? [{ c: [cc, 0], r: SQ2, a0: 135, a1: 180 }] : [{ c: [b, 0], r: SQ2, a0: 45, a1: 0 }],
          points: [{ at: pv, name: 'P', side: fromC ? -1 : 1 }],
          names: [{ p: [b, 0], name: 'B', a: 270, gap: 14 }, { p: [cc, 0], name: 'C', a: 270, gap: 14 }, { p: [cc, 1], name: 'D', a: 45, gap: 11 }, { p: [b, 1], name: 'A', a: 135, gap: 11 }],
          say: `수직선 위에 한 변의 길이가 1인 정사각형 ABCD의 변 BC가 있다(B가 왼쪽, 정수 눈금의 수는 적혀 있지 않다). 점 ${fromC ? 'C를 중심으로 대각선 CA' : 'B를 중심으로 대각선 BD'}를 반지름으로 하는 원이 수직선과 ${fromC ? '왼쪽' : '오른쪽'}에서 만나는 점이 P이다`
        });
        return N(`다음 그림과 같이 수직선 위의 사각형 ABCD는 한 변의 길이가 1인 정사각형이다. ${fromC ? `${SG('CA')} = ${SG('CP')}` : `${SG('BD')} = ${SG('BP')}`}이고 점 P가 나타내는 수가 ${sText(given)}일 때, 점 ${fromC ? 'B' : 'C'}가 나타내는 수는?`, fromC ? b : cc, {
          signed: true, figure: fig,
          explain: `대각선의 길이는 ${R(2)}이다. ${fromC ? `점 P는 C에서 왼쪽으로 ${R(2)}만큼 간 점이므로 C는 ${tx(Q(cc))}이고, B는 C에서 왼쪽으로 1만큼 간 ${tx(Q(b))}이다.` : `점 P는 B에서 오른쪽으로 ${R(2)}만큼 간 점이므로 B는 ${tx(Q(b))}이고, C는 B에서 오른쪽으로 1만큼 간 ${tx(Q(cc))}이다.`}`,
          facts: { calc: [[fromC ? `(${cc})-1` : `(${b})+1`, 0]], unseen: [0] }
        });
      }),
      T('line-claims', '두 꼭짓점에서 대각선을 옮긴 두 점에 대한 설명', '심29', (d) => {
        // P = (B) − √2, Q = (A) + √2. 두 수의 합에서는 √2가 지워진다.
        const p = d.until(() => d.int(-2, 4), (v) => v !== 0 && v !== -1), A = p, Bv = p + 1, Pv = [num(Bv), rad(2, -1)], Qv = [num(A), rad(2)];
        const fig = rline(p - 1, p + 3, {
          rows: 1, headroom: 14, labels: range(p - 1, p + 3).filter((v) => v !== A && v !== Bv), polys: [{ pts: sq4(A, Bv, 1) }], segs: [[Bv, 0, A, 1, 'dash'], [A, 0, Bv, 1, 'dash']],
          arcs: [{ c: [Bv, 0], r: SQ2, a0: 135, a1: 180 }, { c: [A, 0], r: SQ2, a0: 45, a1: 0 }],
          points: [{ at: Bv - SQ2, name: 'P', side: -1 }, { at: A + SQ2, name: 'Q', side: 1 }],
          names: [{ p: [A, 0], name: 'A', a: 270, gap: 15 }, { p: [Bv, 0], name: 'B', a: 270, gap: 15 }, { p: [Bv, 1], name: 'C', a: 45, gap: 11 }, { p: [A, 1], name: 'D', a: 135, gap: 11 }],
          say: `수직선 위의 두 점 A(${tx(Q(p))}), B(${tx(Q(p + 1))})를 이은 선분을 한 변으로 하는 정사각형 ABCD가 있다. 점 B를 중심으로 대각선 BD를 반지름으로 하는 원이 수직선과 왼쪽에서 만나는 점이 P, 점 A를 중심으로 대각선 AC를 반지름으로 하는 원이 수직선과 오른쪽에서 만나는 점이 Q이다`
        });
        const yes = [`점 P가 나타내는 수는 ${sText(Pv)}이다.`, `점 Q가 나타내는 수는 ${sText(Qv)}이다.`, `(점 P가 나타내는 수) + (점 Q가 나타내는 수) = ${2 * p + 1}이다.`, `${SG('AQ')} = ${R(2)}이다.`, `${SG('PA')} = ${R(2)} ${MINUS} 1이다.`];
        const no = [
          [`점 P가 나타내는 수는 ${sText([num(A), rad(2, -1)])}이다.`, `점 P는 B(${tx(Q(Bv))})에서 왼쪽으로 ${R(2)}만큼 간 ${sText(Pv)}이다.`, yes[0]],
          [`점 Q가 나타내는 수는 ${sText([num(Bv), rad(2)])}이다.`, `점 Q는 A(${tx(Q(A))})에서 오른쪽으로 ${R(2)}만큼 간 ${sText(Qv)}이다.`, yes[1]],
          [`(점 P가 나타내는 수) + (점 Q가 나타내는 수) = ${2 * p}이다.`, `두 수의 합은 ${tx(Q(Bv))} + ${A < 0 ? par(tx(Q(A))) : A} = ${2 * p + 1}이다(${R(2)}는 지워진다).`, yes[2]],
          [`${SG('AQ')} = 1 + ${R(2)}이다.`, `${SG('AQ')} = ${SG('AC')} = ${R(2)}이다.`, yes[3]],
          [`${SG('PA')} = 1 ${MINUS} ${R(2)}이다.`, `${SG('PA')} = ${SG('BP')} ${MINUS} ${SG('BA')} = ${R(2)} ${MINUS} 1이다.`, yes[4]]
        ];
        const want = d.bool();
        const item = claimQ(d, `다음 그림과 같이 수직선 위의 두 점 A(${tx(Q(p))}), B(${tx(Q(p + 1))})에 대하여 ${SG('AB')}를 한 변으로 하는 정사각형 ABCD가 있다. ${SG('BD')} = ${SG('BP')}, ${SG('AC')} = ${SG('AQ')}일 때, 다음 중 ${want ? '옳은' : '옳지 않은'} 것은?`, yes, no, want);
        item.figure = fig;
        return item;
      }),
      T('line-roll', '원을 굴려 옮긴 점', '심31', (d) => {
        // 원을 한 바퀴 굴리면 굴러간 거리는 원의 둘레(2πr)와 같다.
        const r = d.int(1, 2), p = d.until(() => d.int(-2, 2), (v) => v !== 0), turns = d.pick([1, 2]), right = d.bool(), dist2 = 2 * r * turns;
        const fig = rline(p - 5, p + 5, {
          u: 25, rows: 2 * r, headroom: 10, circles: [{ c: [p, r], r }], arrows: [{ from: [p + (right ? 0.5 : -0.5), 2 * r + 0.3], to: [p + (right ? 2 : -2), 2 * r + 0.3] }],
          points: [{ at: p, name: 'A', side: right ? -1 : 1 }],
          say: `반지름의 길이가 ${r}인 원이 수직선 위의 점 A(${tx(Q(p))})에 닿아 있고, 화살표는 ${right ? '오른쪽' : '왼쪽'}을 가리킨다`
        });
        return inline(`다음 그림과 같이 반지름의 길이가 ${r}인 원이 수직선 위의 점 A(${tx(Q(p))})에 닿아 있다. 이 원을 수직선을 따라 ${right ? '오른쪽' : '왼쪽'}으로 ${turns === 1 ? '한' : '두'} 바퀴 굴렸을 때, 처음에 점 A에 닿아 있던 원 위의 점이 다시 수직선에 닿는 곳이 나타내는 수는? (단, 원주율은 π이다.)`, '{0} {1}π', [{ answer: p, signed: true }, { answer: right ? dist2 : -dist2, signed: true }], {
          shown: `${tx(Q(p))} ${right ? '+' : MINUS} ${dist2}π`, figure: fig,
          explain: `반지름이 ${r}인 원의 둘레는 2π × ${r} = ${2 * r}π이므로 ${turns === 1 ? '한' : '두'} 바퀴 굴리면 ${dist2}π만큼 움직인다. 그 점은 ${tx(Q(p))}에서 ${right ? '오른쪽' : '왼쪽'}으로 ${dist2}π만큼 간 ${tx(Q(p))} ${right ? '+' : MINUS} ${dist2}π이다.`,
          facts: { calc: [[String(p), 0], [`${right ? '' : '0-'}2*${r}*${turns}`, 1]], unseen: [0, 2, 1] }
        });
      })
    ]
  });

  B.addGroup('9-1-1', {
    id: 'real', title: '실수의 대소 관계', standard: STD9,
    types: [
      T('real-two', '두 실수의 대소 비교', '①70', (d) => {
        // 두 수의 차의 부호를 본다. 같은 항은 지우고, 남은 수는 근호를 씌워 견준다.
        const [l, r] = realPair(d), big = sVal(l) > sVal(r);
        return C('두 실수의 대소를 비교할 때, □ 안에 알맞은 부등호는?', [GT, '=', LT], big ? 0 : 2, {
          figure: ex(showPair(l, r)), explain: `두 수의 차를 보면 ${diffWord(l, r)}이므로 ${sText(l)} ${big ? GT : LT} ${sText(r)}이다.`,
          facts: { choose: { exprs: [posJs(l), posJs(r)], rule: 'compare' }, unseen: U5.concat([OFF]) }
        });
      }),
      T('real-pick', '대소 관계가 옳은(옳지 않은) 것 고르기', '①71', (d) => {
        const want = d.bool();
        const rows = d.until(() => range(1, 5).map(() => { const [l, r] = realPair(d), said = d.bool() ? '<' : '>'; return { l, r, said, ok: said === '<' ? sVal(l) < sVal(r) : sVal(l) > sVal(r) }; }), (list) => list.filter((x) => x.ok === want).length === 1 && new Set(list.map((x) => sText(x.l) + sText(x.r))).size === 5);
        const at2 = rows.findIndex((x) => x.ok === want);
        return C(`다음 중 두 실수의 대소 관계가 ${want ? '옳은' : '옳지 않은'} 것은?`, rows.map((x) => `${sText(x.l)} ${x.said === '<' ? LT : GT} ${sText(x.r)}`), at2, {
          explain: `두 수의 차의 부호로 견주면 ${rows.map((x) => `${sText(x.l)} ${sVal(x.l) < sVal(x.r) ? LT : GT} ${sText(x.r)}`).join(', ')}이다.`,
          facts: Object.assign({ truth: rows.map((x) => x.ok), want }, want ? {} : { biggerClaims: rows.map((x, i) => (x.said === '<' ? [sJs(x.r), sJs(x.l), i] : [sJs(x.l), sJs(x.r), i])) })
        });
      }),
      T('real-odd-sign', '□ 안 부등호의 방향이 다른 하나', '①72', (d) => {
        const rows = d.until(() => range(1, 5).map(() => { const [l, r] = realPair(d); return { l, r, gt: sVal(l) > sVal(r) }; }), (list) => { const g = list.filter((x) => x.gt).length; return (g === 1 || g === 4) && new Set(list.map((x) => sText(x.l) + sText(x.r))).size === 5; });
        const lone = rows.filter((x) => x.gt).length === 1, at2 = rows.findIndex((x) => x.gt === lone);
        return C('다음 중 □ 안에 알맞은 부등호의 방향이 나머지 넷과 다른 것은?', rows.map((x) => showPair(x.l, x.r)), at2, {
          explain: `${rows.map((x) => `${sText(x.l)} ${x.gt ? GT : LT} ${sText(x.r)}`).join(', ')}이므로 방향이 다른 것은 ${showPair(rows[at2].l, rows[at2].r)}이다.`,
          facts: { truth: rows.map((x) => x.gt === lone), want: true }
        });
      }),
      T('real-three', '세 실수의 대소', '①73', (d) => {
        const L3 = ['a', 'b', 'c'];
        const xs = d.until(() => {
          const n = nonSq(d, 2, 15), m = d.until(() => nonSq(d, 2, 15), (v) => v !== n), k = d.int(1, 3), j = d.int(1, 4), f = d.int(0, 2);
          if (f === 0) return d.shuffle([[rad(n), num(k)], [rad(m), num(k + j)], [rad(m), num(k)]]);
          if (f === 1) return d.shuffle([[rad(m), rad(n)], [rad(m), num(k)], [num(d.int(2, 4)), rad(n)]]);
          return d.shuffle([[rad(n, -1), num(j)], [num(j), rad(m, -1)], [num(-d.int(2, 3))]]);
        }, (l) => { const v = l.map(sVal); return v.every((a, i) => v.every((b, q) => i === q || Math.abs(a - b) > 0.08)); });
        const vals = xs.map(sVal), right = [0, 1, 2].sort((p, q) => vals[p] - vals[q]);
        const perms = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]], list = d.shuffle(d.shuffle(perms.filter((pm) => pm.join() !== right.join())).slice(0, 4).concat([right]));
        return C(`세 수 ${xs.map((x, i) => `${V(L3[i])} = ${sText(x)}`).join(', ')}의 대소 관계를 바르게 나타낸 것은?`, list.map((pm) => pm.map((i) => V(L3[i])).join(` ${LT} `)), list.findIndex((pm) => pm.join() === right.join()), {
          explain: `두 수씩 차의 부호를 보면 ${[[0, 1], [1, 2], [0, 2]].map(([p, q]) => `${V(L3[p])} ${MINUS} ${V(L3[q])} ${vals[p] > vals[q] ? GT : LT} 0`).join(', ')}이므로 ${right.map((i) => V(L3[i])).join(` ${LT} `)}이다.`,
          facts: { choose: { exprs: xs.map(posJs), rule: 'ascending', orders: list }, unseen: U5.concat([OFF]) }
        });
      }),
      T('real-neg', '음수(양수)인 것 고르기', '①74', (d) => {
        const neg1 = d.bool();
        const mk = () => d.pick([() => { const n = nonSq(d, 2, 15), k = d.int(1, 4); return [rad(n), num(-k)]; }, () => { const n = nonSq(d, 2, 15), k = d.int(1, 4); return [num(k), rad(n, -1)]; }, () => { const [n, m] = d.until(() => [nonSq(d, 2, 15), nonSq(d, 2, 15)], ([x, y]) => x !== y); return [rad(n), rad(m, -1)]; }, () => { const n = nonSq(d, 2, 15), k = d.int(1, 4); return [rad(n, -1), num(k)]; }])();
        const rows = d.until(() => range(1, 5).map(mk), (l) => { const v = l.map(sVal); return v.filter((x) => (neg1 ? x < 0 : x > 0)).length === 1 && v.every((x) => Math.abs(x) > 0.05) && new Set(l.map((x) => sText(x))).size === 5; });
        const at2 = rows.findIndex((x) => (neg1 ? sVal(x) < 0 : sVal(x) > 0));
        return C(`다음 중 ${neg1 ? '음수' : '양수'}인 것은?`, rows.map((x) => sText(x)), at2, {
          explain: `두 항의 크기를 근호를 씌워 견준다. ${rows.map((x) => `${sText(x)} ${sVal(x) > 0 ? GT : LT} 0`).join(', ')}이다.`,
          facts: { choose: { exprs: rows.map(posJs), rule: neg1 ? 'onlyBelow' : 'onlyAbove', target: OFF }, unseen: U5.concat([OFF]) }
        });
      }),
      T('real-ints', '두 무리수 사이에 있는 정수의 개수', '①75', (d) => {
        const [p, a, q, b] = d.until(() => [d.int(-1, 3), nonSq(d, 2, 20), d.int(-1, 3), nonSq(d, 2, 20)], ([p1, a1, q1, b1]) => p1 - Math.sqrt(a1) < -0.5 && q1 + Math.sqrt(b1) > 1.5);
        const lowL = p === 0 ? [rad(a, -1)] : [num(p), rad(a, -1)], highL = q === 0 ? [rad(b)] : [num(q), rad(b)];
        const lo = p - Math.sqrt(a), hi = q + Math.sqrt(b), ints = range(Math.ceil(lo), Math.floor(hi)), fa = Math.floor(Math.sqrt(a)), fb = Math.floor(Math.sqrt(b));
        return N(`두 수 ${sText(lowL)}${tail(a, '과/와')} ${sText(highL)} 사이에 있는 정수는 모두 몇 개인가?`, ints.length, {
          unit: '개', explain: `${fa} ${LT} ${R(a)} ${LT} ${fa + 1}이므로 ${tx(Q(Math.floor(lo)))} ${LT} ${sText(lowL)} ${LT} ${tx(Q(Math.ceil(lo)))}이고, ${fb} ${LT} ${R(b)} ${LT} ${fb + 1}이므로 ${tx(Q(Math.floor(hi)))} ${LT} ${sText(highL)} ${LT} ${tx(Q(Math.floor(hi) + 1))}이다. 그 사이의 정수는 ${ints.map((v) => tx(Q(v))).join(', ')}의 ${ints.length}개이다.`,
          facts: { digit: { template: `${p}-${a}${RT}<□<${q}+${b}${RT}`, lo: Math.floor(lo) - 2, hi: Math.ceil(hi) + 2, ask: 'count' } }
        });
      }),
      T('real-frac-part', '정수 부분과 소수 부분으로 만든 식의 값', '①76', (d) => {
        // √n 의 정수 부분 a 는 a ≤ √n < a + 1 인 정수이고, 소수 부분은 b = √n − a 이다. a + b = √n 이므로 (a + b)² = n.
        const n = nonSq(d, 3, 50), a = Math.floor(Math.sqrt(n)), k = d.int(2, 5), form = d.int(0, 1), A = V('a'), Bb = V('b');
        const expr = form === 0 ? `${k}${A} ${MINUS} (${A} + ${Bb})${sup(2)}` : `${Bb}(${Bb} + 2${A})`, v = form === 0 ? k * a - n : n - a * a;
        return N(`${R(n)}의 정수 부분을 ${A}, 소수 부분을 ${Bb}라 할 때, ${expr}의 값은?`, v, {
          signed: true,
          explain: `${a} = ${R(a * a)} ${LT} ${R(n)} ${LT} ${R((a + 1) * (a + 1))} = ${a + 1}이므로 ${A} = ${a}, ${Bb} = ${R(n)} ${MINUS} ${a}이다. ${form === 0 ? `${A} + ${Bb} = ${R(n)}이므로 ${expr} = ${k * a} ${MINUS} ${n} = ${tx(Q(v))}이다.` : `${expr} = ${Bb}${sup(2)} + 2${A}${Bb} = (${A} + ${Bb})${sup(2)} ${MINUS} ${A}${sup(2)} = ${n} ${MINUS} ${a * a} = ${tx(Q(v))}이다.`}`,
          facts: form === 0 ? { value: `${k}*(${n}${RT}-${n}${RT}%1)-(${n}${RT})**2`, unseen: U5.concat([1, 2]), rule: 'frac-part-a' } : { value: `(${n}${RT}%1)*(${n}${RT}%1+2*(${n}${RT}-${n}${RT}%1))`, unseen: U5.concat([1, 2]), rule: 'frac-part-b' }
        });
      })
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
