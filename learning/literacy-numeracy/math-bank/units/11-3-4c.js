// 고등학교 확률과 통계 Ⅱ-2 「조건부확률」 — 실력 문항.
// 단원 틀과 도구, 싣는 기준, 뺀 것과 까닭은 11-3-4a.js 에 있다. ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번, 심n = 심화꼴의 n번.
//
// 이 단원에서 아이들이 흔히 잘못 아는 것(실력 ①의 장치는 이 잘못을 가진 아이가 걸리게 만들었다)
//  - 「k번째에서 검사가 끝난다」를 k번째에 불량품이 나오는 것으로만 보고, 그 앞에 나머지 불량품이 모두 나와 있어야 한다는 것을 놓친다.
//  - 「먼저 k번 이기면 우승」에서 g번째 경기에 우승이 정해질 확률을 셀 때 g판 가운데 k판을 이기는 경우(ₘCₖ)를 모두 센다(마지막 판은 우승자가 이긴 판이다).
//  - 승부차기 (n − 1) : n 에서 실축한 쪽이 마지막에 실축해야만 한다고 여긴다(앞 팀의 실축이 몇 번째이든 승부는 끝까지 간다 — 원문 풀이도 이 잘못을 했다).
//  - 두 사건이 독립이면 P(A∣B) = P(A)인데, 이것을 주어진 P(A∣B) = P(B)와 잇지 못한다.
//  - 「같은 수가 적힌 공이 있다」를 3끼리 있는 경우와 4끼리 있는 경우로 나누어 더하면서 둘 다인 경우를 두 번 센다.
//
// 실력에는 ① 문제의 장치에 함정이 있어 뜻을 정확히 대야 풀리는 문제와 ② 세 단계 넘게 이어 생각해야 풀리는 문제만 실었다.
// 대단원 기출 모의고사(수능·모의평가·학력평가)의 다섯 꼴(심2~6)은 실력에 두었다. 심1(두 기준 표의 조건부확률)은 기본 ①10과 같은 일이라 기본에 있다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, frac, lines } = B.kit;
  const { MINUS, Q, qadd, qsub, qmul, qdiv, qcmp, tx, tj, nb, V } = B.kit.mid;
  const { ms, pr, nC, jh } = B.kit.hs;
  const K = B.kit.u1134;
  const { UNIT, STD4, STD5, STD6, num, jq, inside, one, comp, comb, setH, eqv, PA, PB, PAB, PBgA, PAgB, H, prQ, intQ, qpow, bino, small, term, termH, sumQ } = K;
  const fx = (p, q) => (Q(p, q).q === q ? frac(p, q) : frac(p, q) + ' = ' + tx(Q(p, q)));

  B.addGroup(UNIT, {
    id: 'hard', title: '실력 문제', standard: STD4,
    types: [
      // ── ① 장치에 함정이 있어 뜻을 정확히 대야 풀리는 문제 ──
      H('hard-stop', '차례로 검사할 때 k번째에 검사가 끝날 확률', '①18', (d) => {
        // 함정: k번째에 불량품이 나올 확률만 셈하는 아이. 앞 k − 1개 가운데 불량품이 꼭 (불량품 수 − 1)개여야 한다.
        const nn = d.int(8, 12), dd = d.int(2, 3), k = d.int(dd + 1, nn - 1);
        const before = Q(comb(dd, dd - 1) * comb(nn - dd, k - dd), comb(nn, k - 1)), last = Q(1, nn - k + 1), ans = qmul(before, last);
        if (!small(ans)) return null;
        return prQ(`불량품 ${dd}개를 포함한 제품 ${nn}개가 있다. 불량품을 모두 찾을 때까지 제품을 한 개씩 차례로 검사할 때, ${k}번째에서 검사가 끝날 확률은? (단, 한 번 검사한 제품은 다시 검사하지 않는다.)`, ans, {
          explain: `${k}번째에서 끝나려면 ${k - 1}번째까지 불량품 ${dd - 1}개와 정상품 ${k - dd}개가 나오고, ${k}번째에 남은 불량품이 나와야 한다. 앞의 확률은 ${nb(nC(dd, dd - 1) + ' × ' + nC(nn - dd, k - dd))} ÷ ${nC(nn, k - 1)} = ${tx(before)}이고, 그때 남은 ${nn - k + 1}개 가운데 불량품은 1개이므로 구하는 확률은 ${tx(before)} × ${frac(1, nn - k + 1)} = ${tx(ans)}이다.`,
          value: `${comb(dd, dd - 1)}*${comb(nn - dd, k - dd)}/${comb(nn, k - 1)}*1/(${nn}-${k}+1)`, derived: [comb(dd, dd - 1), comb(nn - dd, k - dd), comb(nn, k - 1)]
        });
      }, { standard: STD6 }),

      H('hard-decide', '먼저 k번 이기면 우승하는 경기 — 정한 경기에서 우승이 정해질 확률', '②24', (d) => {
        // 함정: g판 가운데 k판을 이기는 경우 ₉Cₖ 를 모두 세는 아이. 마지막 g번째 판은 우승자가 이겨야 한다.
        const k = d.int(3, 4), g = d.int(k + 1, 2 * k - 1), p = d.pick([Q(1, 2), Q(1, 2), Q(2, 3), Q(1, 3)]);
        const c = comb(g - 1, k - 1), ans = qmul(Q(c), qadd(qmul(qpow(p, k), qpow(comp(p), g - k)), qmul(qpow(comp(p), k), qpow(p, g - k))));
        if (!small(ans)) return null;
        const eq = p.p * 2 === p.q;
        return prQ(`두 선수 A, B가 경기를 하여 먼저 ${k}번 이기는 선수가 우승한다. ${eq ? '두 선수가 한 경기에서 이길 확률은 서로 같다' : `한 경기에서 A가 이길 확률은 ${tx(p)}이다`}. ${g}번째 경기에서 우승자가 정해질 확률은? (단, 비기는 경우는 없다.)`, ans, {
          explain: `A가 ${g}번째 경기에서 우승하려면 ${g - 1}번째 경기까지 A가 ${k - 1}번, B가 ${g - k}번 이기고 ${g}번째 경기를 A가 이겨야 한다(${g}판 가운데 아무 ${k}판이 아니다). 그 확률은 ${nC(g - 1, k - 1)} × (${tx(p)})<sup>${k}</sup> × (${tx(comp(p))})${g - k === 1 ? '' : '<sup>' + (g - k) + '</sup>'}이고, B가 우승하는 경우도 같은 방법으로 더하면 구하는 확률은 ${tx(ans)}이다.`,
          value: `${c}*(${jq(p)}**${k}*(1-${jq(p)})**${g - k}+(1-${jq(p)})**${k}*${jq(p)}**${g - k})`, derived: [c, k, g - k, p.p, p.q]
        });
      }, { standard: STD6 }),

      H('hard-pk', '번갈아 차는 승부차기 — 한 골 차로 끝날 확률', '②26', (d) => {
        // 함정: 앞 팀(A)이 마지막 차례에 실축해야만 (n − 1) : n 이 된다고 여기는 아이. A의 실축이 몇 번째이든 승부는 끝까지 간다.
        const [nn, p] = d.pick([[3, Q(1, 2)], [4, Q(1, 2)], [5, Q(1, 2)], [3, Q(2, 3)], [4, Q(2, 3)], [3, Q(3, 4)]]);
        // 모든 경우를 따라가 본다: 승부가 정해지면 바로 끝내는 규칙과 끝까지 차는 규칙 모두에서 (n − 1) : n, B 승리로 끝나는 확률
        const run = (stop) => {
          let total = Q(0);
          for (let code = 0; code < 1 << (2 * nn); code += 1) {
            let a = 0, b = 0, prob = one, ended = false;
            for (let t = 0; t < 2 * nn && !ended; t += 1) {
              const hit = (code >> t) & 1, aTurn = t % 2 === 0;
              prob = qmul(prob, hit ? p : comp(p));
              if (hit) { if (aTurn) a += 1; else b += 1; }
              const aLeft = nn - Math.floor((t + 2) / 2), bLeft = nn - Math.floor((t + 1) / 2);
              if (stop && (a + aLeft < b || b + bLeft < a)) ended = true;
              if (ended || t === 2 * nn - 1) { if (a === nn - 1 && b === nn && (t === 2 * nn - 1)) total = qadd(total, prob); ended = true; }
            }
          }
          return total;
        };
        const ans = qmul(Q(nn), qmul(qpow(p, 2 * nn - 1), comp(p)));
        if (qcmp(run(true), ans) !== 0 || qcmp(run(false), ans) !== 0 || !small(ans)) return null;
        const eq = p.p * 2 === p.q;
        return prQ(`두 팀 A, B가 승부차기를 한다. 두 팀은 ${nn}명씩 A팀부터 한 명씩 번갈아 차고, 모든 선수가 공을 넣을 확률은 ${tx(p)}이다. 이 승부차기가 ${nn - 1} : ${josa(nn, '으로/로')} B팀의 승리로 끝날 확률은?`, ans, {
          explain: `B팀은 ${nn}번 모두 넣고 A팀은 ${nn}번 가운데 한 번만 못 넣어야 한다. A팀이 몇 번째에 못 넣더라도 A팀은 B팀과 한 골 차 안에 있어 마지막 차례까지 승부가 정해지지 않으므로, A팀이 못 넣는 차례는 ${nn}가지 모두 된다. 따라서 구하는 확률은 ${nC(nn, nn - 1)} × (${tx(p)})<sup>${nn - 1}</sup> × ${tx(comp(p))} × (${tx(p)})<sup>${nn}</sup> = ${tx(ans)}이다.${eq ? '' : ''}`,
          value: `${nn}*${jq(p)}**(2*${nn}-1)*(1-${jq(p)})`, derived: [2, p.p, p.q]
        });
      }, { standard: STD6 }),

      H('hard-pp', '독립과 P(A∣B) = P(B)로 P(A) 구하기', '심4', (d) => {
        // 함정: 독립이면 P(A∣B) = P(A)라는 것을 주어진 조건과 잇지 못하는 아이.
        const c = d.pick([Q(1, 2), Q(1, 3), Q(2, 3), Q(1, 4), Q(3, 4), Q(2, 5), Q(3, 5), Q(4, 5), Q(1, 5), Q(5, 6)]), s = qmul(c, c);
        return prQ(`두 사건 A와 B는 서로 독립이고 ${nb(PAgB + ' = ' + PB)}, ${eqv(PAB, s)}일 때, ${PA}의 값은?`, c, {
          explain: `두 사건이 서로 독립이므로 ${PAgB} = ${PA}이다. 조건에서 ${PA} = ${PB}이고 ${PAB} = ${PA}${PB} = {${PA}}<sup>2</sup> = ${tx(s)}이므로 ${PA} = ${tx(c)}이다.`,
          value: `${jq(s)}**0.5`, derived: [0.5]
        });
      }, { standard: STD5 }),

      H('hard-samenum', '같은 수가 적힌 공이 있을 때의 조건부확률', '심3', (d) => {
        // 함정: 「같은 수가 있다」를 두 수 각각의 경우로 나누어 더하면서 둘 다인 경우를 두 번 세는 아이.
        const [wTop, bLo, bTop] = d.pick([[4, 3, 6], [5, 4, 8], [4, 2, 5], [5, 3, 7]]), t = d.int(1, 3);
        const balls = [];
        for (let x = 1; x <= wTop; x += 1) balls.push({ c: 'w', x });
        for (let x = bLo; x <= bTop; x += 1) balls.push({ c: 'b', x });
        let nA = 0, nAB = 0;
        const L = balls.length;
        for (let i = 0; i < L; i += 1) for (let j = i + 1; j < L; j += 1) for (let k = j + 1; k < L; k += 1) for (let m = k + 1; m < L; m += 1) {
          const set = [balls[i], balls[j], balls[k], balls[m]], xs = set.map((s) => s.x);
          if (new Set(xs).size === 4) continue;
          nA += 1;
          if (set.filter((s) => s.c === 'b').length === t) nAB += 1;
        }
        const ans = Q(nAB, nA);
        if (!inside(ans)) return null;
        const same = [];
        for (let x = bLo; x <= wTop; x += 1) same.push(x);
        return prQ(`주머니에 숫자 ${Array.from({ length: wTop }, (_, i) => i + 1).join(', ')}이 하나씩 적힌 흰 공 ${wTop}개와 숫자 ${Array.from({ length: bTop - bLo + 1 }, (_, i) => bLo + i).join(', ')}이 하나씩 적힌 검은 공 ${bTop - bLo + 1}개가 들어 있다. 이 주머니에서 임의로 공 4개를 동시에 꺼낼 때, 꺼낸 공에 적힌 수 가운데 같은 것이 있었다. 이때 꺼낸 공 가운데 검은 공이 ${t}개일 확률은?`.replace(/(\d)이 하나씩/g, (m0, dg) => dg + josa(Number(dg), '이/가').slice(1) + ' 하나씩'), ans, {
          explain: `같은 수가 있으려면 ${same.join(', ')} 가운데 어떤 수가 적힌 흰 공과 검은 공이 함께 나와야 한다. 수마다 그런 경우를 세어 더한 뒤 두 수가 함께 짝을 이루는 경우를 한 번 빼면 모두 ${nA}가지이다. 그 가운데 검은 공이 ${t}개인 경우를 같은 방법으로 세면 ${nAB}가지이므로 구하는 확률은 ${fx(nAB, nA)}이다.`,
          value: `${nAB}/${nA}`, derived: [nAB, nA]
        });
      }, { standard: STD4 }),

      // ── ② 세 단계 넘게 이어 생각해야 풀리는 문제 ──
      H('hard-venn', '벤 다이어그램 인원과 성별 조건이 겹친 조건부확률', '①14', (d) => {
        const Tt = d.pick([120, 150, 160, 180, 200, 240]), half = d.int(30, Math.floor(Tt * 0.4)), nA = 2 * half;
        const nAB = d.int(10, nA - 10), nBonly = d.int(10, Tt - nA - 10), w = Tt - nA - nBonly, fr = d.pick([Q(1, 2), Q(2, 5), Q(3, 5), Q(1, 3), Q(2, 3), Q(1, 4), Q(3, 4), Q(3, 10), Q(7, 10)]);
        if (w < 5 || (nAB * fr.p) % fr.q !== 0) return null;
        const fAB = (nAB * fr.p) / fr.q, mAB = nAB - fAB, mOnly = half - mAB, fOnly = half - fAB, nOnly = nA - nAB, nB = nAB + nBonly, askM = d.bool();
        if (mOnly < 3 || fOnly < 3 || mOnly === fOnly) return null;
        const ans = Q(askM ? mOnly : fOnly, nOnly);
        const NAB = `(${nA}+${nB}-(${Tt}-${w}))`;
        return prQ(`어느 학교 학생 ${Tt}명을 대상으로 체험 학습 장소 A, B에 대한 선호를 조사하였더니 A를 선호하는 학생이 ${nA}명, B를 선호하는 학생이 ${nB}명, A와 B를 모두 선호하지 않는 학생이 ${w}명이었다. A를 선호하는 학생 가운데 남학생 수와 여학생 수는 같고, 이 학생들 가운데 임의로 뽑은 한 명이 A와 B를 모두 선호하는 학생일 때 이 학생이 여학생일 확률은 ${tx(fr)}이다. 임의로 뽑은 한 명이 A는 선호하고 B는 선호하지 않는 학생일 때, 이 학생이 ${askM ? '남학생' : '여학생'}일 확률은?`, ans, {
          explain: `A 또는 B를 선호하는 학생은 ${Tt} ${MINUS} ${w} = ${Tt - w}명이므로 A와 B를 모두 선호하는 학생은 ${nA} + ${nB} ${MINUS} ${Tt - w} = ${nAB}명이고, A만 선호하는 학생은 ${nOnly}명이다. 모두 선호하는 학생 가운데 여학생은 ${nAB} × ${tx(fr)} = ${fAB}명, 남학생은 ${mAB}명이다. A를 선호하는 남학생과 여학생은 ${half}명씩이므로 A만 선호하는 ${askM ? '남학생은 ' + half + ' ' + MINUS + ' ' + mAB + ' = ' + mOnly : '여학생은 ' + half + ' ' + MINUS + ' ' + fAB + ' = ' + fOnly}명이다. 따라서 구하는 확률은 ${fx(askM ? mOnly : fOnly, nOnly)}이다.`,
          value: askM ? `(${nA}/2-${NAB}*(1-${jq(fr)}))/(${nA}-${NAB})` : `(${nA}/2-${NAB}*${jq(fr)})/(${nA}-${NAB})`, derived: [2]
        });
      }, { standard: STD4 }),

      H('hard-backmove', '공을 옮긴 뒤 나온 결과로 옮긴 공의 색을 거꾸로 구하기', '①23', (d) => {
        const w1 = d.int(1, 4), b1 = d.int(1, 4), w2 = d.int(1, 4), b2 = d.int(1, 4), seeB = d.bool(), askB = d.bool();
        if (w1 === b1 || w2 === b2) return null;
        const n1 = w1 + b1, n2 = w2 + b2 + 1;
        const pW = Q(w1, n1), pBk = Q(b1, n1), seeGivenW = Q(seeB ? b2 : w2 + 1, n2), seeGivenB = Q(seeB ? b2 + 1 : w2, n2);
        const both = [qmul(pW, seeGivenW), qmul(pBk, seeGivenB)], all = qadd(both[0], both[1]), ans = qdiv(askB ? both[1] : both[0], all);
        if (!inside(ans) || !small(ans)) return null;
        const see = seeB ? '검은 공' : '흰 공', ask = askB ? '검은 공' : '흰 공';
        const nW = seeB ? b2 : w2 + 1, nB2 = seeB ? b2 + 1 : w2;
        return prQ(`상자 A에는 흰 공 ${w1}개와 검은 공 ${b1}개가, 상자 B에는 흰 공 ${w2}개와 검은 공 ${b2}개가 들어 있다. 상자 A에서 임의로 공 한 개를 꺼내 상자 B에 넣은 다음, 상자 B에서 임의로 공 한 개를 꺼냈더니 ${see}이었다. 이때 상자 A에서 꺼낸 공이 ${ask}이었을 확률은?`, ans, {
          explain: `A에서 흰 공을 옮기고 B에서 ${see}이 나올 확률은 ${frac(w1, n1)} × ${frac(nW, n2)} = ${tx(both[0])}, 검은 공을 옮기고 ${see}이 나올 확률은 ${frac(b1, n1)} × ${frac(nB2, n2)} = ${tx(both[1])}이다. ${see}이 나올 확률은 ${tx(all)}이므로 구하는 확률은 ${tx(askB ? both[1] : both[0])} ÷ ${tx(all)} = ${tx(ans)}이다.`,
          value: `(${askB ? b1 : w1}/(${w1}+${b1})*${askB ? nB2 : nW}/(${w2}+${b2}+1))/(${w1}/(${w1}+${b1})*${nW}/(${w2}+${b2}+1)+${b1}/(${w1}+${b1})*${nB2}/(${w2}+${b2}+1))`, derived: [nW, nB2]
        });
      }, { standard: STD6 }),

      H('hard-colorn', '같은 색일 때 빨간색일 확률로 공의 개수 거꾸로 구하기', '①26', (d) => {
        const [Nn, k] = d.pick([[10, 2], [12, 2], [12, 3], [14, 2], [15, 2]]), maxN = Math.ceil(Nn / k) - 1, n = d.int(1, maxN);
        const rOf = (x) => Q(k * x * x, k * x * x + (Nn - x) * (Nn - k * x)), r = rOf(n);
        if (Array.from({ length: maxN }, (_, i) => i + 1).filter((x) => qcmp(rOf(x), r) === 0).length !== 1 || 2 * r.p === r.q || r.q > 99) return null;
        // (2pk − qk)n² − pN(k + 1)n + pN² = 0 의 두 근 가운데 n
        const p = r.p, q = r.q, a2 = k * (2 * p - q), b1 = p * Nn * (k + 1), disc = b1 * b1 - 4 * a2 * p * Nn * Nn;
        const roots = [1, -1].map((s) => (b1 + s * Math.sqrt(disc)) / (2 * a2)), sign = Math.abs(roots[0] - n) < 1e-9 ? '+' : '-';
        if (Math.abs(roots[sign === '+' ? 0 : 1] - n) > 1e-9) return null;
        return intQ(`빨간 공 ${V('n')}개와 파란 공 (${Nn} ${MINUS} ${V('n')})개가 들어 있는 주머니 A와 빨간 공 ${k}${V('n')}개와 파란 공 (${Nn} ${MINUS} ${k}${V('n')})개가 들어 있는 주머니 B가 있다. 두 주머니에서 공을 한 개씩 임의로 꺼냈더니 두 공의 색이 같았을 때, 그 색이 빨간색일 확률이 ${tx(r)}이다. 자연수 ${V('n')}의 값은? (단, 두 주머니에는 빨간 공과 파란 공이 모두 들어 있다.)`, n, {
          explain: `두 주머니에서 꺼내는 일은 서로 영향을 주지 않으므로 둘 다 빨간 공일 확률은 ${frac(V('n'), Nn)} × ${frac(k + V('n'), Nn)}, 둘 다 파란 공일 확률은 ${frac('(' + Nn + ' ' + MINUS + ' ' + V('n') + ')', Nn)} × ${frac('(' + Nn + ' ' + MINUS + ' ' + k + V('n') + ')', Nn)}이다. 같은 색일 때 빨간색일 확률은 ${frac(k + V('n') + '<sup>2</sup>', k + V('n') + '<sup>2</sup> + (' + Nn + ' ' + MINUS + ' ' + V('n') + ')(' + Nn + ' ' + MINUS + ' ' + k + V('n') + ')')}이고, 이것이 ${tj(r, '이/가')} 되는 자연수 ${V('n')}은 ${n}이다(빨간 공과 파란 공이 모두 있으려면 ${V('n')} ≤ ${maxN}).`,
          value: `((${p}*${Nn}*(${k}+1))${sign}((${p}*${Nn}*(${k}+1))**2-4*${k}*(2*${p}-${q})*${p}*${Nn}**2)**0.5)/(2*${k}*(2*${p}-${q}))`, derived: [2, 4, 0.5]
        });
      }, { standard: STD6 }),

      H('hard-msum', '두 사건이 독립이 되는 m의 값 모두 구하기', '심5', (d) => {
        const [top, lead] = d.pick([[6, '한 개의 주사위를 한 번 던진다.'], [8, '각 면에 1부터 8까지의 자연수가 하나씩 적힌 정팔면체 모양의 주사위를 한 번 던진다.'], [12, '각 면에 1부터 12까지의 자연수가 하나씩 적힌 정십이면체 모양의 주사위를 한 번 던진다.']]);
        const A = d.pick([['홀수', (x) => x % 2 === 1], ['짝수', (x) => x % 2 === 0], ['소수', (x) => [2, 3, 5, 7, 11].includes(x)]]);
        const all = Array.from({ length: top }, (_, i) => i + 1), setA = all.filter(A[1]);
        const good = [];
        for (let m = 1; m <= top; m += 1) { const Bm = all.filter((x) => m % x === 0), AB = Bm.filter(A[1]); if (AB.length * top === setA.length * Bm.length) good.push(m); }
        if (good.length < 1 || good.length > 5) return null;
        const sumM = good.reduce((s, m) => s + m, 0);
        return intQ(`${lead} 나온 수가 ${A[0]}인 사건을 A, ${top} 이하의 자연수 ${V('m')}에 대하여 나온 수가 ${V('m')}의 약수인 사건을 B라 하자. 두 사건 A와 B가 서로 독립이 되도록 하는 모든 ${V('m')}의 값의 합은?`, sumM, {
          explain: `A = ${setH(setA)}이므로 ${eqv(PA, Q(setA.length, top))}이다. ${V('m')} = 1, 2, …, ${top}마다 B와 A∩B를 적어 ${PAB} = ${PA}${PB}인지 보면 독립이 되는 ${V('m')}은 ${good.join(', ')}이다(예: ${V('m')} = ${good[0]}이면 B = ${setH(all.filter((x) => good[0] % x === 0))}). 따라서 구하는 합은 ${sumM}이다.`,
          value: good.join('+'), derived: good
        });
      }, { standard: STD5 }),

      H('hard-func', '조건을 만족시키는 함수 가운데 두 함숫값이 같을 확률', '심2', (d) => {
        const Nn = d.pick([6, 7, 8]), M = Math.floor(Nn / 2), [i, j] = d.shuffle(Array.from({ length: M }, (_, t) => t + 1)).slice(0, 2).sort((x, y) => x - y);
        const a = 2 * i - 1, b = 2 * j - 1, C2 = comb(Nn, 2), sq = Array.from({ length: Nn - 1 }, (_, t) => (Nn - 1 - t) ** 2), top = sq.reduce((s, v) => s + v, 0), ans = Q(top, C2 * C2);
        return prQ(`집합 ${nb('X = {1, 2, 3, …, ' + Nn + '}')}에 대하여 X에서 X로의 함수 ${V('f')} 가운데 임의로 하나를 택한다. 택한 함수 ${V('f')}가 ${M} 이하의 모든 자연수 ${V('n')}에 대하여 ${nb(ms('f(2n - 1) < f(2n)'))}을 만족시킬 때, ${nb(ms(`f(${a}) = f(${b})`))}일 확률은?`, ans, {
          explain: `조건은 ${Array.from({ length: M }, (_, t) => nb(ms(`f(${2 * t + 1}) < f(${2 * t + 2})`))).join(', ')}이다. 짝마다 1부터 ${Nn}까지에서 서로 다른 두 수를 고르면 작은 수가 앞이 되므로 ${nC(Nn, 2)} = ${C2}가지씩이다. ${nb(ms(`f(${a}) = f(${b}) = k`))}이면 ${nb(ms(`f(${a + 1})`))}, ${nb(ms(`f(${b + 1})`))}은 k보다 큰 수에서 저마다 (${Nn} ${MINUS} k)가지이므로 다른 짝은 약분되고 구하는 확률은 ${nb('(' + sq.map((v, t) => (Nn - 1 - t) + '<sup>2</sup>').join(' + ') + ')')} ÷ ${C2}<sup>2</sup> = ${tx(ans)}이다.`,
          value: `(${sq.join('+')})/${C2}**2`, derived: sq.concat([C2])
        });
      }, { standard: STD4 }),

      H('hard-coin', '동전을 여러 번 던질 때 앞면의 수와 이웃한 앞면 조건', '심6', (d) => {
        const nn = d.int(6, 8), h = d.int(2, 4);
        let cnt = 0;
        for (let code = 0; code < 1 << nn; code += 1) {
          const bits = Array.from({ length: nn }, (_, t) => (code >> t) & 1), heads = bits.reduce((s, v) => s + v, 0);
          if (heads >= h && bits.some((v, t) => t > 0 && v && bits[t - 1])) cnt += 1;
        }
        const ans = Q(cnt, 2 ** nn);
        if (!inside(ans)) return null;
        // 앞면이 m번일 때 이웃하지 않게 놓는 경우의 수: 뒷면 사이와 양 끝 (n − m + 1)자리에서 m자리 고르기
        const rows = [];
        for (let m = h; m <= nn; m += 1) { const apart = comb(nn - m + 1, m); rows.push(`앞면이 ${m}번이면 ${comb(nn, m)} ${MINUS} ${apart} = ${comb(nn, m) - apart}가지`); }
        return prQ(`한 개의 동전을 ${nn}번 던질 때, 다음 조건을 모두 만족시킬 확률은?`, ans, {
          figure: lines([`(가) 앞면이 ${h}번 이상 나온다.`, '(나) 앞면이 연속해서 나오는 경우가 있다.']),
          explain: `앞면이 이웃하지 않게 나오는 경우는 뒷면 사이와 양 끝 자리에서 앞면 자리를 고르는 수이다. ${rows.join(', ')}이므로 모두 ${cnt}가지이다. 따라서 구하는 확률은 ${fx(cnt, 2 ** nn)}이다.`,
          value: `${cnt}/2**${nn}`, derived: [cnt, 2]
        });
      }, { standard: STD6 })
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
