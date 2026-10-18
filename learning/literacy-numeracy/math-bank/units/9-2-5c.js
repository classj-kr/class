// 중학교 3학년 2학기 5단원 산포도 — 실력 문항.
// 단원 틀과 도구, 싣는 기준, 뺀 것과 까닭은 9-2-5a.js 에 있다. ref: ①n = 기본꼴_1의 n번(기본 자료에서 온 꼴), 심n = 심화꼴의 n번.
//
// 이 단원에서 아이들이 흔히 잘못 아는 것(실력 ①의 장치는 이 잘못을 가진 아이가 걸리게 만들었다)
//  - 중앙값의 편차를 0으로 본다(중앙값을 평균으로 착각한다). 편차를 크기순으로 놓으면 가운데 편차가 중앙값의 편차이다.
//  - 「편차의 최댓값」을 주면 모르는 변량이 가장 크다고 먼저 놓는다. 가장 큰 변량이 무엇인지부터 갈라 보아야 한다.
//  - 평균이 같은 두 집단을 합친 표준편차를 두 표준편차의 평균으로 구한다. 합친 분산은 편차의 제곱의 합을 모두 더해 전체 개수로 나눈 것이다.
//  - 변량 둘을 더 넣으면 분산도 그대로라고 여긴다. 평균은 그대로여도 편차의 제곱의 합과 개수가 함께 바뀐다.
//  - 모든 변량을 몇 배 하고 같은 수를 더하면 표준편차에도 그 수를 더한다. 더한 수는 편차에 남지 않는다.
//  - 직육면체의 모서리 12개가 세 길이로 4개씩이라는 것을 놓친다. 12개의 평균·분산은 세 길이의 평균·분산과 같은데, 세 길이만 더해 12로 나누는 잘못을 한다.
//
// 실력에는 ① 문제의 수·조건에 함정이 있어 배운 뜻을 정확히 대야 풀리는 문제와 ② 세 단계 넘게 이어 생각해야 풀리는 문제만 실었다.
// 수집본 기본 문서에 여러 번 나오는 꼴(평균과 분산으로 a² + b² 구하기, 편차·분산·표준편차 구하기)은 기본 묶음에 있다.
// 묻는 말: 수나 값은 「~은?/~는?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, frac, lines, numbers, N, M, C } = B.kit;
  const { MINUS, range, gcd, Q, V, sup, nb, rt, sqParts, ex } = B.kit.mid;
  const K = B.kit.m925;
  const { STD, UNIT, sourceOf, sum, srt, ssOf, varOf, isSq, devs, sdOf, fx, sgn, nj, amt, vtext, sdText, outTold, sdTold, sqSum, told, devTold, plusList, pe, js, varExpr, stripH, seal, radBox, dataFig, tbl, devTable, ABC } = K;
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: sourceOf(ref), make }, more || {});
  const LET = ['a', 'b', 'c', 'd', 'e'];
  const letters = (k) => LET.slice(0, k).map(V).join(', ');
  const ax = (p, q) => nb((p === 0 ? '' : (p === 1 ? '' : p) + V('a')) + (p === 0 ? String(q) : q === 0 ? '' : ` + ${q}`));   // pa + q 의 글

  B.addGroup(UNIT, {
    id: 'hard', title: '실력 문제', standard: STD,
    types: [
      // ── ① 문제의 수·조건에 함정이 있어 뜻을 정확히 대야 풀리는 문제 ──
      H('hard-dev-order', '편차 넷과 중앙값으로 평균 구하기', '①39', (d) => {
        // 함정: 중앙값의 편차를 0으로 보면 평균 = 중앙값이 된다. 보이지 않는 다섯째 편차를 넣어 크기순으로 놓아야 가운데 편차가 나온다.
        const c = d.pick([{ who: '복숭아', what: '무게', unit: 'g', cnt: '개', base: [240, 270] }, { who: '감자', what: '무게', unit: 'g', cnt: '개', base: [150, 190] }, { who: '학생', what: '키', unit: 'cm', cnt: '명', base: [150, 166] }]);
        const n = 5, m = d.int(c.base[0], c.base[1]);
        const [dv, hide] = d.until(() => [devs(d, n, 6), d.int(0, n - 1)], ([a, h]) => {
          const s = srt(a), med = s[2], shown = srt(a.filter((_, i) => i !== h));
          return med !== 0 && (shown[1] + shown[2]) / 2 !== med && new Set(a).size >= 4;
        });
        const medDev = srt(dv)[2], med = m + medDev, shown = dv.filter((_, i) => i !== hide);
        const calc = medDev === dv[hide] && srt(shown).indexOf(medDev) < 0 ? `${med}+(${shown.map(js).join('+')})` : `${med}-(${js(medDev)})`;
        return seal(N(`다음은 ${c.who} ${n}${c.cnt}의 ${c.what} 가운데 ${n - 1}${c.cnt}의 ${c.what}에 대한 편차를 조사하여 나타낸 것이다. ${c.who} ${n}${c.cnt}의 ${c.what}의 중앙값이 ${amt(med, c.unit)}일 때, ${c.who} ${n}${c.cnt}의 ${c.what}의 평균은?`, m, {
          unit: c.unit, figure: `<div style="display:grid;gap:4px;max-width:100%"><div style="text-align:right;font-size:0.88rem;color:#52606d">(단위: ${c.unit})</div>${numbers(shown.map(sgn))}</div>`,
          explain: `편차의 합은 0이므로 나머지 하나의 편차는 ${sgn(dv[hide])}이다. 편차는 (변량) − (평균)이라 변량이 클수록 크므로, 편차를 크기순으로 놓은 ${srt(dv).map(sgn).join(', ')}의 가운데 값 ${nj(medDev, '이/가')} 중앙값의 편차이다. 따라서 평균은 ${med} − ${pe(medDev)} = ${amt(m, c.unit)}이다.`,
          facts: { calc: [[calc, 0]] }
        }));
      }),
      H('hard-merge', '평균이 같은 두 집단을 합친 표준편차', '심9', (d) => {
        // 함정: 두 표준편차의 평균(또는 학생 수로 가중한 평균)을 고르게 한다. 합친 분산은 편차의 제곱의 합을 모두 더해 전체 학생 수로 나눈 것이다.
        const [n1, n2, sA, sB] = d.until(() => [d.pick([10, 15, 20, 25, 30]), d.pick([10, 15, 20, 25, 30]), d.int(1, 6), d.int(1, 6)], ([a, b, x, y]) => {
          if (x === y || Math.abs(x - y) < 2) return false;
          const v = Q(a * x * x + b * y * y, a + b), { c } = sdOf(v), L = [sdText(v), vtext(Q(a * x + b * y, a + b)), vtext(Q(x + y, 2)), sdText(Q(x * x + y * y, 2)), String(x + y)].map(stripH);
          return c <= 6 && new Set(L).size === 5;
        });
        const m = d.int(65, 80), v = Q(n1 * sA * sA + n2 * sB * sB, n1 + n2);
        const list = [sdText(v), vtext(Q(n1 * sA + n2 * sB, n1 + n2)), vtext(Q(sA + sB, 2)), sdText(Q(sA * sA + sB * sB, 2)), String(sA + sB)];
        const opts = d.shuffle(list.map((t) => t + '점'));
        return C(`A반 ${n1}명과 B반 ${n2}명의 수학 점수의 평균은 모두 ${m}점이고, 표준편차는 A반이 ${sA}점, B반이 ${sB}점이다. 두 반 전체 ${n1 + n2}명의 수학 점수의 표준편차는?`, opts, opts.indexOf(list[0] + '점'), {
          explain: `편차의 제곱의 합은 (분산) × (학생 수)이므로 A반은 ${sA}${sup(2)} × ${n1} = ${n1 * sA * sA}, B반은 ${sB}${sup(2)} × ${n2} = ${n2 * sB * sB}이다. 두 반의 평균이 같으므로 편차도 그대로여서 전체의 분산은 (${n1 * sA * sA} + ${n2 * sB * sB}) ÷ ${n1 + n2} = ${vtext(v)}이고, 표준편차는 ${sdTold(v)}(점)이다. 표준편차끼리 평균을 내면 안 된다.`,
          facts: { truth: opts.map((o) => o === list[0] + '점'), want: true }
        });
      }),
      H('hard-add-two', '평균 둘레에 두 변량을 더 넣은 자료의 표준편차', '①62', (d) => {
        // 함정: 새로 넣은 두 변량이 평균에서 같은 거리만큼 떨어져 있어 평균은 그대로이지만, 편차의 제곱의 합과 개수가 바뀌어 분산이 달라진다.
        const [k, v, t] = d.until(() => [d.pick([3, 4]), d.int(2, 12), d.int(1, 6)], ([kk, vv, tt]) => { const all = kk * vv + 2 * tt * tt; return all % (kk + 2) === 0 && isSq(all / (kk + 2)) && all / (kk + 2) !== vv; });
        const m = d.int(t + 4, 20), s = Math.sqrt((k * v + 2 * t * t) / (k + 2)), lo = m - t, hi = m + t, first = d.bool();
        const items = [first ? lo : hi].concat(LET.slice(0, k).map(V), [first ? hi : lo]);
        return seal(N(`자료 ${letters(k)}의 평균이 ${m}이고 분산이 ${v}일 때, 자료 ${items.join(', ')}의 표준편차는?`, s, {
          explain: `(${letters(k)}의 합) = ${k} × ${m} = ${k * m}이므로 새 자료의 평균은 (${lo} + ${k * m} + ${hi}) ÷ ${k + 2} = ${josa(m, '으로/로')} 그대로이다. ${letters(k)}의 편차의 제곱의 합은 ${v} × ${k} = ${k * v}이고, ${lo}, ${hi}의 편차는 ${MINUS}${t}, ${t}이므로 새 자료의 분산은 (${k * v} + ${t * t} + ${t * t}) ÷ ${k + 2} = ${s * s}, 표준편차는 ${s}이다.`,
          facts: { calc: [[`((${k}*${v}+(${lo}-${m})**2+(${hi}-${m})**2)/(${k}+2))**0.5`, 0]] }
        }));
      }),
      H('hard-standardize', '평균을 빼고 표준편차로 나눈 자료의 평균과 표준편차', '심16', (d) => {
        // 함정: 표준편차에도 m 을 빼거나, 나눈 S 를 평균에 남긴다. 편차의 합이 0이라 평균은 0, 편차가 모두 1/S 배라 표준편차는 1이다.
        const n = d.pick([5, 8, 10, 20]), k = d.pick([2, 3]), X = (i) => `${V('x')}<sub>${i}</sub>`, mm = V('m'), S = V('S');
        const forms = [
          { f: (x) => nb(frac(`${x} ${MINUS} ${mm}`, S)), ans: '0, 1', why: `평균은 (편차의 합) ÷ ${S} ÷ ${n} = 0이고, 각 값의 편차가 원래 편차의 ${nb(frac(1, S))}배이므로 표준편차는 ${S} × ${nb(frac(1, S))} = 1이다.` },
          { f: (x) => nb(`${x} ${MINUS} ${mm}`), ans: `0, ${S}`, why: `각 값은 원래 변량의 편차이므로 평균은 0이고, 모든 변량에서 같은 수를 뺐으므로 표준편차는 ${S} 그대로이다.` },
          { f: (x) => nb(frac(x, S)), ans: `${nb(frac(mm, S))}, 1`, why: `평균은 ${nb(frac(mm, S))}이고, 편차가 모두 ${nb(frac(1, S))}배가 되므로 표준편차는 1이다.` },
          { f: (x) => nb(frac(`${k}(${x} ${MINUS} ${mm})`, S)), ans: `0, ${k}`, why: `평균은 0이고, 편차가 원래 편차의 ${nb(frac(k, S))}배이므로 표준편차는 ${S} × ${nb(frac(k, S))} = ${k}이다.` }
        ];
        const F = d.pick(forms), pool = ['0, 1', `0, ${S}`, `${nb(frac(mm, S))}, 1`, `0, ${k}`, `${mm}, ${S}`, `1, ${S}`, `${mm}, ${nb(frac(S, n))}`, `0, ${nb(frac(1, k))}`];
        const opts = d.shuffle([F.ans].concat(d.shuffle(pool.filter((p) => p !== F.ans)).slice(0, 4)));
        return C(`변량 ${X(1)}, ${X(2)}, …, ${X(n)}의 평균이 ${mm}, 표준편차가 ${S}일 때, 변량 ${F.f(X(1))}, ${F.f(X(2))}, …, ${F.f(X(n))}의 평균과 표준편차를 차례로 나열한 것은? (단, ${nb(`${S} &gt; 0`)})`, opts, opts.indexOf(F.ans), {
          explain: F.why,
          facts: { truth: opts.map((o) => o === F.ans), want: true }
        });
      }),
      H('hard-box', '직육면체의 모서리 12개의 평균과 분산으로 부피 구하기', '심11', (d) => {
        // 함정: 모서리 12개는 세 길이가 4개씩이라, 12개의 평균·분산은 세 길이의 평균·분산과 같다.
        const [p, a, b] = d.until(() => [d.int(2, 9), d.int(2, 12), d.int(2, 12)], ([x, y, z]) => (x + y + z) % 3 === 0 && y < z && new Set([x, y, z]).size === 3 && ssOf([x, y, z].map((t) => t - (x + y + z) / 3)) > 0);
        const m = (p + a + b) / 3, ssq = ssOf([p, a, b].map((t) => t - m)), v = Q(ssq, 3), S = 3 * m - p, Q2 = ssq - (p - m) ** 2 + 2 * m * S - 2 * m * m;
        const vE = v.q === 1 ? `3*${v.p}` : `${v.p}*3/${v.q}`;
        return seal(N(`가로, 세로, 높이가 각각 ${p}, ${V('a')}, ${V('b')}인 직육면체에서 12개의 모서리의 길이의 평균이 ${m}, 분산이 ${vtext(v)}일 때, 이 직육면체의 부피는?`, p * a * b, {
          explain: `모서리는 길이가 ${p}, ${V('a')}, ${V('b')}인 것이 4개씩이다. 평균에서 (4 × ${p} + 4${V('a')} + 4${V('b')}) ÷ 12 = ${m}이므로 ${V('a')} + ${V('b')} = ${S}이다. 분산에서 4{(${p} − ${m})${sup(2)} + (${V('a')} − ${m})${sup(2)} + (${V('b')} − ${m})${sup(2)}} ÷ 12 = ${vtext(v)}이므로 (${V('a')} − ${m})${sup(2)} + (${V('b')} − ${m})${sup(2)} = ${ssq - (p - m) ** 2}이고, 펼치면 ${nb(`${V('a')}${sup(2)} + ${V('b')}${sup(2)}`)} = ${Q2}이다. (${V('a')} + ${V('b')})${sup(2)} = ${nb(`${V('a')}${sup(2)} + ${V('b')}${sup(2)}`)} + 2${V('a')}${V('b')}에서 ${V('a')}${V('b')} = ${a * b}이므로 부피는 ${p} × ${a * b} = ${p * a * b}이다.`,
          facts: { calc: [[`${p}*((3*${m}-${p})**2-(${vE}-(${p}-${m})**2+2*${m}*(3*${m}-${p})-2*${m}*${m}))/2`, 0]] }
        }));
      }),
      // ── ② 세 단계 넘게 이어 생각해야 풀리는 문제 ──
      H('hard-dev-max', '편차의 최댓값으로 모르는 변량 구하기', '①38', (d) => {
        // 가장 큰 변량이 모르는 변량인지 다른 변량인지 갈라 본다. 모르는 변량이 가장 크다고 놓으면 자연수가 나오지 않는다.
        const n = 5;
        const [vals, at] = d.until(() => [Array.from({ length: n }, () => d.int(2, 14)), d.int(0, n - 1)], ([v, i]) => {
          if (sum(v) % n !== 0 || new Set(v).size !== n) return false;
          const m = sum(v) / n, top = Math.max(...v);
          if (v[i] === top || top - m < 2) return false;
          const known = v.filter((_, j) => j !== i), S = sum(known), Dm = top - m;
          // 자연수 a 가운데 편차의 최댓값이 Dm 인 것은 하나뿐이고, a 가 가장 크다고 놓으면 자연수가 아니다.
          const hits = range(1, 200).filter((a) => n * Math.max(a, ...known) - (S + a) === n * Dm);
          return hits.length === 1 && hits[0] === v[i] && (n * Dm + S) % (n - 1) !== 0;
        });
        const known = vals.filter((_, j) => j !== at), S = sum(known), top = Math.max(...known), m = sum(vals) / n, D = top - m;
        return seal(N(`다음 자료의 편차의 최댓값이 ${D}일 때, 자연수 ${V('a')}의 값은?`, vals[at], {
          figure: numbers(vals.map((x, j) => (j === at ? V('a') : String(x)))),
          explain: `평균은 ${nb(frac(`${S} + ${V('a')}`, n))}이다. ${V('a')}가 가장 큰 변량이라면 ${V('a')} − ${nb(frac(`${S} + ${V('a')}`, n))} = ${D}에서 ${V('a')} = ${nb(frac(n * D + S, n - 1) + josa(n * D + S, '으로/로').slice(String(n * D + S).length))} 자연수가 아니다. 따라서 가장 큰 변량은 ${top}이고, ${top} − ${nb(frac(`${S} + ${V('a')}`, n))} = ${D}에서 ${S} + ${V('a')} = ${n * (top - D)}, ${V('a')} = ${vals[at]}이다. 이때 평균은 ${m}이고 ${V('a')} = ${josa(vals[at], '은/는')} ${top}보다 작다.`,
          facts: { calc: [[`${n}*(${top}-${D})-(${known.join('+')})`, 0]] }
        }));
      }),
      H('hard-var-a', '분산이 주어진 자료에서 양수 a 구하기', '①59', (d) => {
        // 변량이 a 의 일차식이다. 평균이 a + q̄ 꼴이 되게 a 의 계수의 합을 변량의 개수와 같게 한다. 분산 = (A a² + B a + C) ÷ 5 를 풀면 양수인 근은 하나뿐이다.
        const n = 5;
        const pick = d.until(() => {
          const ps = d.shuffle(d.pick([[1, 0, 2, 1, 1], [2, 0, 1, 1, 1], [2, 2, 0, 0, 1], [0, 1, 1, 2, 1]])), qs = Array.from({ length: n }, () => d.int(0, 6)), a = d.int(2, 6);
          return { ps, qs, a };
        }, ({ ps, qs, a }) => {
          if (sum(qs) % n !== 0) return false;
          const qb = sum(qs) / n, A = sum(ps.map((p) => (p - 1) ** 2)), Bc = 2 * sum(ps.map((p, i) => (p - 1) * (qs[i] - qb))), Cc = sum(qs.map((q) => (q - qb) ** 2));
          const tot = A * a * a + Bc * a + Cc, other = -Bc / A - a;
          return tot % n === 0 && other <= 0 && qs.every((q, i) => ps[i] !== 0 || q >= 1) && new Set(ps.map((p, i) => p * a + qs[i])).size === n;
        });
        const { ps, qs, a } = pick, qb = sum(qs) / n, A = sum(ps.map((p) => (p - 1) ** 2)), Bc = 2 * sum(ps.map((p, i) => (p - 1) * (qs[i] - qb))), Cc = sum(qs.map((q) => (q - qb) ** 2)), v = (A * a * a + Bc * a + Cc) / n;
        const devText = ps.map((p, i) => { const c1 = p - 1, c0 = qs[i] - qb; return nb((c1 === 0 ? '' : (c1 === -1 ? MINUS : c1 === 1 ? '' : c1) + V('a')) + (c1 === 0 ? sgn(c0) : c0 === 0 ? '' : (c0 < 0 ? ` ${MINUS} ` : ' + ') + Math.abs(c0))); });
        return seal(N(`다음 자료의 분산이 ${v}일 때, 양수 ${V('a')}의 값은?`, a, {
          figure: numbers(ps.map((p, i) => ax(p, qs[i]))),
          explain: `평균은 ${nb(V('a') + (qb === 0 ? '' : ` + ${qb}`))}이므로 편차는 차례로 ${devText.join(', ')}이다. 편차의 제곱의 합은 ${nb(`${A}${V('a')}${sup(2)}${Bc === 0 ? '' : (Bc < 0 ? ` ${MINUS} ` : ' + ') + Math.abs(Bc) + V('a')} + ${Cc}`)}이고 이것이 ${v} × ${n} = ${v * n}이므로, 이 이차방정식을 풀면 양수인 해는 ${V('a')} = ${a}이다.`,
          facts: { calc: [[`(-(${js(Bc)})+((${js(Bc)})**2-4*${A}*(${Cc}-${n}*${v}))**0.5)/(2*${A})`, 0]] }
        }));
      }),
      H('hard-product', '두 변량을 더한 자료의 평균·분산으로 두 변량의 곱 구하기', '①61', (d) => {
        const [known, a, b] = d.until(() => [srt([d.int(3, 15), d.int(3, 15), d.int(3, 15)]), d.int(2, 15), d.int(2, 15)], ([ks, x, y]) => {
          const all = ks.concat([x, y]); if (sum(all) % 5 !== 0 || x === y || new Set(ks).size !== 3) return false;
          const m = sum(all) / 5, ss = ssOf(all.map((t) => t - m)); return ss % 5 === 0 && ss > 0;
        });
        const all = known.concat([a, b]), m = sum(all) / 5, v = ssOf(all.map((t) => t - m)) / 5, S = a + b, Q2 = a * a + b * b;
        const sE = `5*${m}-(${known.join('+')})`, qE = `5*${v}-(${known.map((x) => `(${x}-${m})**2`).join('+')})+2*${m}*(${sE})-2*${m}*${m}`;
        return seal(N(`3개의 변량 ${known.join(', ')}에 2개의 변량을 더 넣어 5개의 변량의 평균과 분산을 구하였더니 평균이 ${m}, 분산이 ${v}이었다. 더 넣은 2개의 변량의 곱은?`, a * b, {
          signed: true,
          explain: `더 넣은 두 변량을 ${V('a')}, ${V('b')}라 하면 평균에서 ${V('a')} + ${V('b')} = 5 × ${m} − ${sum(known)} = ${S}이다. 분산에서 ${known.map((x) => `(${x} − ${m})${sup(2)}`).join(' + ')} + (${V('a')} − ${m})${sup(2)} + (${V('b')} − ${m})${sup(2)} = ${5 * v}이고, 펼쳐 ${V('a')} + ${V('b')} = ${josa(S, '을/를')} 넣으면 ${nb(`${V('a')}${sup(2)} + ${V('b')}${sup(2)}`)} = ${Q2}이다. (${V('a')} + ${V('b')})${sup(2)} = ${nb(`${V('a')}${sup(2)} + ${V('b')}${sup(2)}`)} + 2${V('a')}${V('b')}에서 ${S * S} = ${Q2} + 2${V('a')}${V('b')}, ${V('a')}${V('b')} = ${a * b}이다.`,
          facts: { calc: [[`((${sE})**2-(${qE}))/2`, 0]] }
        }));
      }),
      H('hard-mean-median', '평균과 중앙값이 같은 자료에서 두 변량을 구한 뒤 표준편차 구하기', '①63', (d) => {
        // 크기순으로 놓은 편차의 가운데가 0이고(그 변량이 a 나 b), 다른 모르는 변량은 나머지 넷 가운데 하나이다. 알려 준 세 변량에는 중앙값이 없으므로 (a, b)는 하나로 정해진다.
        const [M0, dv, oi] = d.until(() => [d.int(5, 10), devs(d, 5, 5, (t) => { const s = ssOf(t); return srt(t)[2] === 0 && new Set(t).size === 5 && s % 5 === 0 && isSq(s / 5); }), d.pick([0, 1, 3, 4])], ([Mv, t]) => Mv + Math.min(...t) >= 1);
        const sorted = srt(dv).map((e) => M0 + e), other = sorted[oi], known = sorted.filter((_, i) => i !== 2 && i !== oi), a = Math.max(other, M0), b = Math.min(other, M0);
        const all = known.concat([a, b]), s = Math.sqrt(ssOf(all.map((t) => t - M0)) / 5), order = d.shuffle([0, 1, 2, 3, 4]), shown = order.map((i) => (i < 3 ? String(known[i]) : i === 3 ? V('a') : V('b')));
        const which = a === M0 ? 'a' : 'b';
        return seal(N(`자료 ${shown.join(', ')}의 평균과 중앙값이 모두 ${M0}일 때, 이 자료의 표준편차는? (단, ${nb(`${V('a')} &gt; ${V('b')}`)})`, s, {
          explain: `평균이 ${M0}이므로 ${V('a')} + ${V('b')} = 5 × ${M0} − ${sum(known)} = ${a + b}이다. ${known.join(', ')} 가운데 ${josa(M0, '이/가')} 없으므로 중앙값 ${josa(M0, '은/는')} ${V('a')}, ${V('b')} 가운데 하나이고, ${nb(`${V('a')} &gt; ${V('b')}`)}에서 ${V(which)} = ${M0}, ${V(which === 'a' ? 'b' : 'a')} = ${other}이다. 편차는 ${all.map((t) => sgn(t - M0)).join(', ')}이므로 ${devTold(all.map((t) => t - M0))} 표준편차는 ${s}이다.`,
          facts: { calc: [[`(${varExpr(all)})**0.5`, 0]] }
        }));
      }),
      H('hard-int-devs', '편차 둘을 모를 때 표준편차와 정수 조건으로 평균 구하기', '①64', (d) => {
        const c = d.pick([{ who: '학생', what: '앉은키', unit: 'cm', cnt: '명', base: [76, 84] }, { who: '학생', what: '키', unit: 'cm', cnt: '명', base: [150, 165] }, { who: '사과', what: '무게', unit: 'g', cnt: '개', base: [200, 240] }]);
        const n = 5, [dv, u, w] = d.until(() => { const a = devs(d, n, 5); const [i, j] = d.shuffle(range(0, n - 1)).slice(0, 2).sort((x, y) => x - y); return [a, i, j]; }, ([a, i, j]) => {
          const s = ssOf(a); return s % n === 0 && s / n >= 2 && a[i] !== a[j] && a[i] > a[j] && a.filter((_, t) => t !== i && t !== j).some((x) => x !== 0);
        });
        const m = d.int(c.base[0], c.base[1]), v = ssOf(dv) / n, known = dv.filter((_, t) => t !== u && t !== w), vB = m + dv[u], sdT = isSq(v) ? String(Math.sqrt(v)) : rt(v);
        const s0 = `-(${known.map(js).join('+')})`, t0 = `5*${v}-(${known.map((e) => js(e) + '**2').join('+')})`;
        return seal(N(`다음은 ${c.who} ${n}${c.cnt}의 ${c.what}에 대한 편차를 조사하여 나타낸 표인데, ${c.who} ${ABC[u]}와 ${ABC[w]}의 편차는 알지 못한다. ${c.what}의 표준편차가 ${sdT} ${c.unit}이고, ${c.who} ${ABC[u]}의 ${c.what}${josa(c.what, '이/가').slice(c.what.length)} ${amt(vB, c.unit)}로 ${c.who} ${ABC[w]}보다 클 때, ${c.what}의 평균은? (단, 편차는 모두 정수이다.)`, m, {
          unit: c.unit, figure: devTable(c, dv.map((e, t) => (t === u || t === w ? '' : sgn(e)))),
          explain: `${ABC[u]}, ${ABC[w]}의 편차를 ${V('x')}, ${V('y')}라 하면 편차의 합에서 ${V('x')} + ${V('y')} = ${sgn(dv[u] + dv[w])}이고, 분산이 ${v}이므로 ${known.map(sqTermPlain).join(' + ')} + ${V('x')}${sup(2)} + ${V('y')}${sup(2)} = ${5 * v}, ${nb(`${V('x')}${sup(2)} + ${V('y')}${sup(2)}`)} = ${dv[u] ** 2 + dv[w] ** 2}이다. 두 식을 만족하는 정수는 ${sgn(dv[u])}, ${sgn(dv[w])}이고 ${ABC[u]}가 더 크므로 ${V('x')} = ${sgn(dv[u])}이다. 따라서 평균은 ${vB} − ${pe(dv[u])} = ${amt(m, c.unit)}이다.`,
          facts: { calc: [[`${vB}-((${s0})+(2*(${t0})-(${s0})**2)**0.5)/2`, 0]] }
        }));
      }),
      H('hard-square-mean', '평균과 표준편차로 제곱한 자료의 평균 구하기', '①67', (d) => {
        const k = d.pick([3, 4, 5]), m = d.int(1, 6), s = d.int(2, 5);
        return N(`자료 ${letters(k)}의 평균이 ${m}이고 표준편차가 ${s}일 때, 자료 ${LET.slice(0, k).map((L) => V(L) + sup(2)).join(', ')}의 평균은?`, s * s + m * m, {
          explain: `편차의 제곱의 합은 ${s}${sup(2)} × ${k} = ${s * s * k}이다. (${V('a')} − ${m})${sup(2)} + … = (${V('a')}${sup(2)} + …) − ${2 * m}(${V('a')} + …) + ${k} × ${m}${sup(2)}이고 ${V('a')} + … = ${k * m}이므로 ${V('a')}${sup(2)} + … = ${s * s * k} + ${2 * m * k * m} − ${k * m * m} = ${k * (s * s + m * m)}이다. 따라서 평균은 ${k * (s * s + m * m)} ÷ ${k} = ${s * s + m * m}이다.`,
          facts: { calc: [[`${s}*${s}+${m}*${m}`, 0]] }
        });
      }),
      H('hard-misread', '잘못 본 두 변량을 바로잡은 자료의 표준편차', '심10', (d) => {
        // 잘못 본 자료의 평균·분산에서 a + b 와 a² + b² 를 꺼내 원래 자료의 분산을 다시 셈한다.
        const [x1, x2, y1, y2, a, b] = d.until(() => [d.int(1, 9), d.int(1, 9), d.int(1, 12), d.int(1, 12), d.int(1, 12), d.int(1, 12)], ([p, q, r, s, u, w]) => {
          if (p === r || q === s || p === q || r === s) return false;
          const bad = [r, s, u, w], good = [p, q, u, w]; if (sum(bad) % 4 !== 0 || sum(good) % 4 !== 0) return false;
          const vb = ssOf(bad.map((t) => t - sum(bad) / 4)) / 4, vg = ssOf(good.map((t) => t - sum(good) / 4)) / 4;
          return (vb * 10) % 1 === 0 && vb > 0 && Number.isInteger(vg) && vg >= 2 && sqParts(vg)[0] === 1 && Math.abs(vb - vg) >= 1;
        });
        const bad = [y1, y2, a, b], good = [x1, x2, a, b], Mb = sum(bad) / 4, vb = ssOf(bad.map((t) => t - Mb)) / 4, Mg = sum(good) / 4, vg = ssOf(good.map((t) => t - Mg)) / 4;
        const sdb = isSq(vb) ? String(Math.sqrt(vb)) : rt(fx(vb));
        const S = `4*${Mb}-(${y1}+${y2})`, Q2 = `4*${fx(vb)}-((${y1}-${Mb})**2+(${y2}-${Mb})**2)+2*${Mb}*(${S})-2*${Mb}*${Mb}`, Mg_ = `((${x1}+${x2}+(${S}))/4)`;
        return radBox(`4개의 변량 ${x1}, ${x2}, ${V('a')}, ${V('b')}에서 ${x1}, ${josa(x2, '을/를')} 각각 ${y1}, ${josa(y2, '으로/로')} 잘못 보고 평균과 표준편차를 구하였더니 평균이 ${Mb}, 표준편차가 ${sdb}이었다. 원래 변량의 표준편차는?`, 1, vg, '', `((${x1}-${Mg_})**2+(${x2}-${Mg_})**2+(${Q2})-2*${Mg_}*(${S})+2*${Mg_}**2)/4`, {
          explain: `잘못 본 자료에서 ${V('a')} + ${V('b')} = 4 × ${Mb} − ${y1 + y2} = ${a + b}이고, (${y1} − ${Mb})${sup(2)} + (${y2} − ${Mb})${sup(2)} + (${V('a')} − ${Mb})${sup(2)} + (${V('b')} − ${Mb})${sup(2)} = ${fx(4 * vb)}에서 ${nb(`${V('a')}${sup(2)} + ${V('b')}${sup(2)}`)} = ${a * a + b * b}이다. 원래 자료의 평균은 (${x1} + ${x2} + ${a + b}) ÷ 4 = ${Mg}이고, 분산은 {(${x1} − ${Mg})${sup(2)} + (${x2} − ${Mg})${sup(2)} + ${nb(`${V('a')}${sup(2)} + ${V('b')}${sup(2)}`)} − ${2 * Mg}(${V('a')} + ${V('b')}) + 2 × ${Mg}${sup(2)}} ÷ 4 = ${vg}이므로 표준편차는 ${rt(vg)}이다.`
        });
      }),
      H('hard-two-values', '평균과 분산으로 모르는 두 변량 구하기', '심14', (d) => {
        const c = d.pick([{ who: '학생', what: '가지고 있는 펜의 수', unit: '개' }, { who: '학생', what: '일주일 동안 읽은 책의 수', unit: '권' }, { who: '선수', what: '넣은 골의 수', unit: '골' }]);
        const [known, x, y] = d.until(() => [[d.int(1, 12), d.int(1, 12), d.int(1, 12)], d.int(1, 10), d.int(1, 10)], ([ks, p, q]) => {
          const all = ks.concat([p, q]); if (!(p < q) || sum(all) % 5 !== 0) return false;
          const m = sum(all) / 5, ss = ssOf(all.map((t) => t - m)); if (ss % 5 !== 0) return false;
          // 같은 평균·분산을 주는 다른 짝(p' < q')이 없다.
          return range(0, 30).filter((pp) => { const qq = 5 * m - sum(ks) - pp; return qq > pp && ssOf(ks.concat([pp, qq]).map((t) => t - m)) === ss; }).length === 1;
        });
        const all = known.concat([x, y]), m = sum(all) / 5, v = ssOf(all.map((t) => t - m)) / 5;
        const sE = `5*${m}-(${known.join('+')})-2*${m}`, tE = `5*${v}-(${known.map((t) => `(${t}-${m})**2`).join('+')})`;
        return seal(M(`다음은 ${c.who} 5명의 ${josa(c.what, '을/를')} 조사하여 나타낸 것이다. 이 자료의 평균이 ${amt(m, c.unit)}, 분산이 ${v}일 때, ${V('x')}, ${V('y')}의 값을 각각 구하시오. (단, ${nb(`${V('x')} &lt; ${V('y')}`)})`, [{ label: V('x'), answer: x }, { label: V('y'), answer: y }], {
          figure: numbers(known.concat([V('x'), V('y')]).map(String)),
          explain: `평균에서 ${V('x')} + ${V('y')} = 5 × ${m} − ${sum(known)} = ${x + y}이다. 분산에서 ${known.map((t) => `(${t} − ${m})${sup(2)}`).join(' + ')} + (${V('x')} − ${m})${sup(2)} + (${V('y')} − ${m})${sup(2)} = ${5 * v}이므로 (${V('x')} − ${m})${sup(2)} + (${V('y')} − ${m})${sup(2)} = ${(x - m) ** 2 + (y - m) ** 2}이다. ${V('y')} = ${x + y} − ${V('x')}를 넣어 풀면 ${V('x')} = ${x}, ${V('y')} = ${y} (또는 그 반대)이고, ${nb(`${V('x')} &lt; ${V('y')}`)}이므로 ${V('x')} = ${x}, ${V('y')} = ${y}이다.`,
          facts: { calc: [[`${m}+((${sE})-(2*(${tE})-(${sE})**2)**0.5)/2`, 0], [`${m}+((${sE})+(2*(${tE})-(${sE})**2)**0.5)/2`, 1]] }
        }));
      }),
      H('hard-pair-products', '평균·표준편차와 곱셈 공식으로 ab, bc, ca의 평균 구하기', '심17', (d) => {
        const m = d.int(3, 9), s = d.pick([2, 4]), ab = 3 * m * m - 3 * s * s / 2;
        const A = V('a'), Bv = V('b'), Cv = V('c');
        return N(`세 수 ${A}, ${Bv}, ${Cv}의 평균이 ${m}, 표준편차가 ${s}일 때, 다음 식을 이용하여 세 수 ${A}${Bv}, ${Bv}${Cv}, ${Cv}${A}의 평균을 구하면?`, m * m - s * s / 2, {
          signed: true,
          figure: lines([ex(`(${A} + ${Bv} + ${Cv})${sup(2)} <i>=</i> ${A}${sup(2)} + ${Bv}${sup(2)} + ${Cv}${sup(2)}`), ex(`<span style="display:inline-block;width:2.2em"></span>+ 2(${A}${Bv} + ${Bv}${Cv} + ${Cv}${A})`)]),
          explain: `${A} + ${Bv} + ${Cv} = ${3 * m}이고, 편차의 제곱의 합 (${A} − ${m})${sup(2)} + (${Bv} − ${m})${sup(2)} + (${Cv} − ${m})${sup(2)} = ${s}${sup(2)} × 3 = ${3 * s * s}이다. 펼치면 ${nb(`${A}${sup(2)} + ${Bv}${sup(2)} + ${Cv}${sup(2)}`)} − ${2 * m} × ${3 * m} + ${3 * m * m} = ${3 * s * s}이므로 ${nb(`${A}${sup(2)} + ${Bv}${sup(2)} + ${Cv}${sup(2)}`)} = ${3 * s * s + 3 * m * m}이다. 따라서 ${A}${Bv} + ${Bv}${Cv} + ${Cv}${A} = (${9 * m * m} − ${3 * s * s + 3 * m * m}) ÷ 2 = ${ab}이고, 평균은 ${ab} ÷ 3 = ${m * m - s * s / 2}이다.`,
          facts: { calc: [[`((3*${m})**2-(3*${s}*${s}+3*${m}*${m}))/2/3`, 0]], unseen: [3, 2] }
        });
      })
    ]
  });
  function sqTermPlain(e) { return (e < 0 ? `(${MINUS}${-e})` : String(e)) + sup(2); }
})(typeof window !== 'undefined' ? window : globalThis);
