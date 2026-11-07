// 고등학교 2학년 확률과 통계 3단원 확률의 개념과 활용 — 실력 문항.
// 이 단원에서 아이들이 흔히 잘못 아는 것
//  - 근원사건이 일어날 가능성이 같은지 보지 않고 센다(눈이 고르지 않은 주사위의 「1」을 한 가지로 센다, 자기 것을 뽑지 못하는 경우를 대충 센다).
//  - 「꺼낸 것」만 보고 「남은 것」으로 바꾸어 보지 못한다. 한 사람에게 나누어 주면 다른 사람의 몫도 정해진다는 것을 놓친다.
//  - 배반사건이면 P(A) + P(B) = P(A∪B) ≤ 1이라는 것을 확률의 범위를 구하는 데 쓰지 못한다.
//  - 두 조건의 합사건에서 겹치는 경우(A∩B)를 빠뜨리거나 두 번 센다. 셋이 모두 같은 경우가 있는지 따지지 않고 「둘이 같은 경우 × 3」으로 센다.
//  - A ⊂ B ⊂ C 를 고를 때 순서까지 정해진다는 것과 원소의 개수가 늘어나야 한다는 것을 놓친다.
// 실력에 둔 것: ① 상황의 장치 때문에 배운 뜻을 정확히 대야 풀리는 것, ② 세 단계 넘게 이어 생각해야 풀리는 것뿐이다. 웬만한 것은 기본에 두었다.
// ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번, 심n = 심화꼴의 n번.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, frac } = B.kit;
  const { MINUS, Q, range, nb, V } = B.kit.mid;
  const { ms, nC, nP, nH, pr } = B.kit.hs;
  const { sumA, fact, nCr, perms, combos, cart, combS, factS, qS, fq, eqF, roster, who, H, probQ, S1, S2, S3 } = B.kit.u33x;

  const hardTypes = [
    H('hard-ineq-dice', '주사위 세 번 — 이차부등식이 모든 실수에서 성립할 확률', '①11', (d) => {
      const m = d.pick([4, 6]), strict = d.bool(), a = V('a'), b = V('b'), c = V('c'), x = V('x');
      const all = cart([range(1, m), range(1, m), range(1, m)]), ok = ([p, q, r]) => (strict ? q * q < 4 * p * r : q * q <= 4 * p * r);
      const per = range(1, m).map((q) => all.filter((t) => t[1] === q && ok(t)).length), hit = sumA(per);
      const dice = m === 6 ? '한 개의 주사위를 세 번 던져서 나오는 눈의 수' : '각 면에 1부터 4까지의 자연수가 하나씩 적힌 정사면체 모양의 주사위 한 개를 세 번 던져서 바닥에 닿는 면에 적힌 수';
      return probQ(`${dice}를 차례로 ${a}, ${b}, ${c}라 할 때, ${x}에 대한 이차부등식 ${nb(ms(`ax^2 + bx + c ${strict ? '>' : '>='} 0`))}이 모든 실수 ${x}에 대하여 성립할 확률은?`, hit, m ** 3, `(${per.join('+')})/${m}**3`, {
        explain: `${a} &gt; 0이므로 모든 실수 ${x}에 대하여 성립하려면 판별식이 ${strict ? '0보다 작아야' : '0 이하여야'} 한다. 즉 ${nb(ms(`b^2 ${strict ? '<' : '<='} 4ac`))}이다. ${b}의 값으로 나누어 ${nb(ms(`ac ${strict ? '>' : '>='}`) + ' ' + frac(V('b') + '<sup>2</sup>', 4))}인 순서쌍 (${a}, ${c})를 세면 ` + range(1, m).map((q) => `${b} = ${q}일 때 ${per[q - 1]}가지`).join(', ')
          + `이므로 모두 ${hit}가지이다. 모든 경우는 ${m}<sup>3</sup> = ${m ** 3}(가지)이므로 구하는 확률은 ${eqF(hit, m ** 3)}이다.`
      });
    }, { standard: S1 }),
    H('hard-derange', '모두 자기 것을 가져가지 못할 확률', '①23', (d) => {
      const k = d.int(3, 5), names = ['A', 'B', 'C', 'D', 'E'].slice(0, k), item = d.pick(['우산', '모자', '필통']);
      const der = perms(range(0, k - 1), k).filter((p) => p.every((v, i) => v !== i)).length, each = der / (k - 1);
      const kor = ['', '', '두', '세', '네', '다섯'][k];
      return probQ(`${kor} 사람 ${names.join(', ')}가 각자 ${item}을 하나씩 가져와 한곳에 모았다. ${kor} 사람이 ${item}을 임의로 하나씩 다시 가져갈 때, ${kor} 사람 모두 자기가 가져온 ${item}을 가져가지 못할 확률은?`.replace(/필통을/g, '필통을').replace(/우산을/g, '우산을').replace(/모자을/g, '모자를'), der, fact(k), `${der}/${factS(k)}`, {
        explain: `모든 경우는 ${k}! = ${fact(k)}(가지)이다. A가 가져갈 수 있는 것은 자기 것이 아닌 ${k - 1}가지이고, 어느 것을 가져가든 나머지 사람이 모두 남의 것을 가져가는 경우를 수형도로 세면 ${each}가지씩이다. 따라서 조건을 만족시키는 경우는 ${k - 1} × ${each} = ${der}(가지)이므로 구하는 확률은 ${eqF(der, fact(k))}이다.`
      });
    }, { standard: S1 }),
    H('hard-split-parity', '카드를 둘로 나누어 줄 때 두 사람의 합이 모두 홀수(짝수)', '①24', (d) => {
      const m = d.pick([4, 6]), odd = d.bool(), [p1, p2] = who(d, 2), half = m / 2;
      const ks = range(0, m).filter((k) => (odd ? k % 2 === 1 : k % 2 === 0)), terms = ks.map((k) => nCr(m, k) * nCr(m, m - k)), top = sumA(terms), all = nCr(2 * m, m);
      return probQ(`1부터 ${2 * m}까지의 자연수가 각각 하나씩 적힌 카드 ${2 * m}장을 ${josa(p1, '과/와')} ${p2}에게 임의로 ${m}장씩 나누어 줄 때, 두 사람이 받은 카드에 적힌 수의 합이 각각 ${odd ? '홀수' : '짝수'}일 확률은?`, top, all, `(${ks.map((k) => `${combS(m, k)}*${combS(m, m - k)}`).join('+')})/${combS(2 * m, m)}`, {
        explain: `홀수가 적힌 카드와 짝수가 적힌 카드는 ${m}장씩이다. 합이 ${odd ? '홀수' : '짝수'}이려면 홀수 카드를 ${odd ? '홀수' : '짝수'} 장 받아야 한다. ${josa(p1, '이/가')} 홀수 카드를 ${V('k')}장 받으면 ${josa(p2, '은/는')} ${m} ${MINUS} ${V('k')}장 받고, ${m}이 짝수이므로 ${V('k')}가 ${odd ? '홀수' : '짝수'}이면 ${m} ${MINUS} ${V('k')}도 ${odd ? '홀수' : '짝수'}이다. 따라서 ${p1}의 몫만 정하면 되고, 그 경우는 ${ks.map((k) => `${nC(m, k)} × ${nC(m, m - k)}`).join(' + ')} = ${top}(가지)이다. 모든 경우는 ${nC(2 * m, m)} = ${all}(가지)이므로 구하는 확률은 ${eqF(top, all)}이다.`.replace(`${m}이 짝수`, josa(m, '이/가') + ' 짝수')
      });
    }, { standard: S1 }),
    H('hard-swap-bags', '두 주머니의 공을 2개씩 바꾸어 넣은 뒤 흰 공이 더 많을 확률', '①25', (d) => {
      const pick = d.until(() => { const w1 = d.int(1, 3), b1 = d.int(2, 4), w2 = d.int(2, 4), b2 = d.int(1, 3); return { w1, b1, w2, b2 }; }, ({ w1, b1, w2, b2 }) => {
        let good = 0, cases = 0;
        for (let x = 0; x <= 2; x += 1) for (let y = 0; y <= 2; y += 1) { const w = nCr(w1, x) * nCr(b1, 2 - x) * nCr(w2, y) * nCr(b2, 2 - y); if (w && w1 - x + y > w2 - y + x) { good += w; cases += 1; } }
        return cases >= 2 && good > 0 && good < nCr(w1 + b1, 2) * nCr(w2 + b2, 2) && Q(good, nCr(w1 + b1, 2) * nCr(w2 + b2, 2)).q <= 2000;
      });
      const { w1, b1, w2, b2 } = pick, list = [];
      for (let x = 0; x <= 2; x += 1) for (let y = 0; y <= 2; y += 1) { const w = nCr(w1, x) * nCr(b1, 2 - x) * nCr(w2, y) * nCr(b2, 2 - y); if (w && w1 - x + y > w2 - y + x) list.push({ x, y, w }); }
      const all = nCr(w1 + b1, 2) * nCr(w2 + b2, 2), top = sumA(list.map((c) => c.w));
      const said = (k, n) => (k === 2 ? '흰 공 2개' : k === 1 ? '흰 공 1개와 검은 공 1개' : '검은 공 2개');
      return probQ(`주머니 X에는 흰 공 ${w1}개, 검은 공 ${b1}개가 들어 있고, 주머니 Y에는 흰 공 ${w2}개, 검은 공 ${b2}개가 들어 있다. 두 주머니에서 각각 임의로 2개의 공을 동시에 꺼내어 서로 다른 주머니에 넣을 때, 흰 공이 주머니 Y보다 주머니 X에 더 많이 들어 있을 확률은?`, top, all,
        `(${list.map((c) => `${combS(w1, c.x)}*${combS(b1, 2 - c.x)}*${combS(w2, c.y)}*${combS(b2, 2 - c.y)}`).join('+')})/(${combS(w1 + b1, 2)}*${combS(w2 + b2, 2)})`, {
          explain: `X에서 흰 공 ${V('p')}개, Y에서 흰 공 ${V('q')}개를 꺼내면 바꾼 뒤 X의 흰 공은 ${nb(`${w1} ${MINUS} ${V('p')} + ${V('q')}`)}개, Y의 흰 공은 ${nb(`${w2} ${MINUS} ${V('q')} + ${V('p')}`)}개이다. 모든 경우는 ${nC(w1 + b1, 2)} × ${nC(w2 + b2, 2)} = ${all}(가지)이고, X의 흰 공이 더 많은 것은 `
            + list.map((c) => `X에서 ${said(c.x)}, Y에서 ${said(c.y)}를 꺼내는 ${c.w}가지`).join(', ') + `이다. 따라서 구하는 확률은 ${eqF(top, all)}이다.`
        });
    }, { standard: S1 }),
    H('hard-exclusive-min', '배반사건의 확률의 범위 — 확률의 최솟값', '②38', (d) => {
      const p = d.pick([2, 3]), r = d.until(() => Q(d.int(4, 20), d.pick([3, 4, 5, 6, 8])), (q) => q.q > 1 && q.p > q.q && q.p < p * q.q && Q(q.p - q.q, q.q * (p - 1)).q > 1);
      const lo = Q(r.p - r.q, r.q * (p - 1)), hi = Q(r.p, r.q * p);
      return probQ(`두 사건 A, B가 서로 배반이고 ${nb(`${p}${pr('A')} + ${pr('B')} = ${fq(r)}`)}일 때, ${pr('A')}의 최솟값은?`, lo.p, lo.q, `(${qS(r)}-1)/(${p}-1)`, {
        explain: `A, B가 서로 배반이므로 ${nb(`${pr('A')} + ${pr('B')} = ${pr('A∪B')} ≤ 1`)}이다. ${nb(`${pr('B')} = ${fq(r)} ${MINUS} ${p}${pr('A')}`)}를 넣으면 ${nb(`${fq(r)} ${MINUS} ${p - 1 === 1 ? '' : p - 1}${pr('A')} ≤ 1`)}이므로 ${nb(`${pr('A')} ≥ ${fq(lo)}`)}이다. 이때 ${nb(`${pr('B')} = ${fq(Q(r.p * lo.q - p * lo.p * r.q, r.q * lo.q))} ≥ 0`)}이므로 가능하다(${pr('B')} ≥ 0에서 ${nb(`${pr('A')} ≤ ${fq(hi)}`)}). 따라서 최솟값은 ${fq(lo)}이다.`
      });
    }, { standard: S2 }),
    H('hard-remain', '꺼내고 남은 것의 색이 모두 같을 확률', '②45', (d) => {
      const a = d.int(3, 5), b = d.int(3, 5), k = d.pick([2, 3]), t = a + b, top = nCr(a, k) + nCr(b, k), all = nCr(t, k);
      return probQ(`서랍 안에 흰색 티셔츠 ${a}장, 검은색 티셔츠 ${b}장이 들어 있다. 이 서랍에서 임의로 티셔츠 ${t - k}장을 꺼낼 때, 남아 있는 티셔츠 ${k}장의 색이 모두 같을 확률은?`, top, all, `(${combS(a, k)}+${combS(b, k)})/${combS(t, k)}`, {
        explain: `꺼낼 ${t - k}장을 고르는 것은 남길 ${k}장을 고르는 것과 같다(${nb(`${nC(t, t - k)} = ${nC(t, k)}`)}). 남은 ${k}장이 모두 흰색인 경우 ${nC(a, k)} = ${nCr(a, k)}(가지)와 모두 검은색인 경우 ${nC(b, k)} = ${nCr(b, k)}(가지)는 동시에 일어나지 않으므로 구하는 확률은 ${frac(top, all)}${Q(top, all).q !== all ? ' = ' + fq(Q(top, all)) : ''}이다.`
      });
    }, { standard: S2 }),
    H('hard-sides', '양옆 조건 둘의 합사건 — 겹치는 경우를 나누어 세기', '②49', (d) => {
      const COL = ['검은색', '빨간색', '파란색', '초록색', '노란색'];
      const pens = d.shuffle(COL).slice(0, 3), pencils = d.until(() => d.shuffle(COL).slice(0, 3), (pc) => pc.filter((c) => pens.includes(c)).length >= 1);
      const c1 = d.pick(pens), c2 = d.pick(pencils.filter((c) => c !== c1).length ? pencils.filter((c) => c !== c1) : pencils);
      const items = pens.map((c) => ({ c, pen: true })).concat(pencils.map((c) => ({ c, pen: false })));
      const p1 = items.findIndex((it) => it.pen && it.c === c1), p2 = items.findIndex((it) => !it.pen && it.c === c2);
      const all = perms(range(0, 5), 6);
      const side = (arr, i, wantPen) => { const at = arr.indexOf(i); return at > 0 && at < 5 && items[arr[at - 1]].pen === wantPen && items[arr[at + 1]].pen === wantPen; };
      let nA = 0, nB = 0, nAB = 0, near = 0;
      for (const arr of all) { const a = side(arr, p1, false), b = side(arr, p2, true); if (a) nA += 1; if (b) nB += 1; if (a && b) { nAB += 1; if (Math.abs(arr.indexOf(p1) - arr.indexOf(p2)) === 1) near += 1; } }
      const top = nA + nB - nAB;
      const s = (list) => list.join(', ');
      return probQ(`${s(pens)}의 볼펜 3자루와 ${s(pencils)}의 색연필 3자루를 모두 임의로 일렬로 나열할 때, ${c1} 볼펜의 양옆에 색연필이 놓이거나 ${c2} 색연필의 양옆에 볼펜이 놓일 확률은?`, top, 720, `(${nA}+${nB}-${nAB})/${factS(6)}`, {
        explain: `${c1} 볼펜의 양옆에 색연필이 놓이는 사건을 A, ${c2} 색연필의 양옆에 볼펜이 놓이는 사건을 B라 하자. A는 색연필 2자루를 골라 양옆에 놓고 셋을 한 묶음으로 보면 ${nP(3, 2)} × 4! = ${nA}(가지)이고, B도 같은 방법으로 ${nB}가지이다. `
          + `A∩B는 ${c1} 볼펜과 ${c2} 색연필이 이웃하는 경우(${c1} 볼펜도 볼펜이고 ${c2} 색연필도 색연필이므로 서로의 한쪽 옆이 될 수 있다) ${near}가지와 이웃하지 않는 경우 ${nAB - near}가지를 더한 ${nAB}가지이다. `
          + `모든 경우는 6! = 720(가지)이므로 구하는 확률은 ${nb(`${frac(nA, 720)} + ${frac(nB, 720)} ${MINUS} ${frac(nAB, 720)}`)} = ${fq(Q(top, 720))}이다.`
      });
    }, { standard: S2 }),
    H('hard-uneven-die', '눈이 고르지 않은 주사위 두 번 — 합이 k 이상일 확률', '②56', (d) => {
      const pick = d.until(() => { const v = d.int(1, 2), rest = d.shuffle(range(1, 6).filter((x) => x !== v)).slice(0, 3).sort((x, y) => x - y); return { v, rest, k: d.int(4, 6) }; }, ({ v, rest, k }) => {
        const faces = [v, v, v].concat(rest), pairs = cart([faces, faces]), bad = pairs.filter(([x, y]) => x + y < k).length, sums = new Set(pairs.filter(([x, y]) => x + y < k).map(([x, y]) => x + y));
        return bad >= 9 && bad < 30 && sums.size >= 2 && sums.size <= 3;
      });
      const { v, rest, k } = pick, faces = [v, v, v].concat(rest), pairs = cart([faces, faces]), badList = pairs.filter(([x, y]) => x + y < k);
      const sums = [...new Set(badList.map(([x, y]) => x + y))].sort((x, y) => x - y), per = sums.map((s) => badList.filter(([x, y]) => x + y === s).length), bad = badList.length;
      return probQ(`세 면에 ${v}이 하나씩 적혀 있고, 나머지 세 면에는 ${rest.join(', ')}가 하나씩 적혀 있는 정육면체 모양의 주사위를 두 번 던질 때, 나온 두 수의 합이 ${k} 이상일 확률은?`.replace(`${v}이`, josa(v, '이/가')).replace(`${rest[2]}가`, josa(rest[2], '이/가')), 36 - bad, 36, `1-${bad}/36`, {
        explain: `여섯 면이 나올 가능성은 같으므로 면의 순서쌍 36가지로 센다(${josa(v, '은/는')} 세 면이라 ${josa(v, '이/가')} 나올 확률은 ${frac(3, 6)}이다). 여사건은 합이 ${k}보다 작은 사건이고, ` + sums.map((s, i) => `합이 ${s}인 경우 ${per[i]}가지`).join(', ')
          + `이다. 따라서 구하는 확률은 1 ${MINUS} ${frac(bad, 36)} = ${fq(Q(36 - bad, 36))}이다.`
      });
    }, { standard: S3 }),
    H('hard-no-adjacent', '같은 문자끼리 이웃하지 않을 확률 — 덧셈정리와 여사건', '②61', (d) => {
      const s = d.int(1, 3), letters = ['a', 'a', 'b', 'b'].concat(['c', 'd', 'e'].slice(0, s)), n = letters.length;
      const all = fact(n) / 4, one = fact(n - 1) / 2, both = fact(n - 2), top = all - (2 * one - both);
      return probQ(`${n}개의 문자 ${letters.map((ch) => V(ch)).join(', ')}를 모두 일렬로 나열할 때, 같은 문자끼리는 이웃하지 않을 확률은?`, top, all, `1-(${factS(n - 1)}/2*2-${factS(n - 2)})/(${factS(n)}/4)`, {
        explain: `모든 경우는 ${frac(n + '!', '2!2!')} = ${all}(가지)이다. ${V('a')}끼리 이웃하는 사건을 A, ${V('b')}끼리 이웃하는 사건을 B라 하면 ${nb(`n(A) = n(B) = ${frac((n - 1) + '!', '2!')} = ${one}`)}, ${nb(`n(A∩B) = ${n - 2}! = ${both}`)}이다. 구하는 사건은 ${ms('A^C∩B^C')}이므로 ${nb(`${pr('A^C∩B^C')} = 1 ${MINUS} ${pr('A∪B')}`)} = 1 ${MINUS} ${frac(`${one} + ${one} ${MINUS} ${both}`, all)} = ${fq(Q(top, all))}이다.`
      });
    }, { standard: S3 }),
    H('hard-same-sum', '두 사람이 각자 뽑은 두 장의 합이 같을 확률', '심4', (d) => {
      const m = d.pick([4, 5, 6]), two = combos(range(1, m), 2), sums = [...new Set(two.map(([x, y]) => x + y))].sort((x, y) => x - y), cnt = sums.map((s) => two.filter(([x, y]) => x + y === s).length);
      const top = sumA(cnt.map((c) => c * c)), all = nCr(m, 2) ** 2;
      const groups = [...new Set(cnt)].sort((x, y) => x - y).map((c) => [c, sums.filter((s, i) => cnt[i] === c)]);
      return probQ(`두 주머니 A와 B에는 1부터 ${m}까지의 자연수가 하나씩 적혀 있는 카드 ${m}장이 각각 들어 있다. 갑은 주머니 A에서, 을은 주머니 B에서 각자 임의로 두 장의 카드를 꺼내어 가진다. 갑이 가진 두 장의 카드에 적힌 수의 합과 을이 가진 두 장의 카드에 적힌 수의 합이 같을 확률은?`, top, all, `(${cnt.map((c) => `${c}**2`).join('+')})/${combS(m, 2)}**2`, {
        explain: `모든 경우는 ${nC(m, 2)} × ${nC(m, 2)} = ${all}(가지)이다. 두 장의 합이 ` + groups.map(([c, list]) => `${list.join(', ')}인 경우는 ${c}가지씩`).join(', ')
          + `이므로 두 사람의 합이 같은 경우는 합마다 경우의 수를 제곱하여 더한 ${cnt.map((c) => `${c}<sup>2</sup>`).join(' + ')} = ${top}(가지)이다. 따라서 구하는 확률은 ${eqF(top, all)}이다.`
      });
    }, { standard: S1 }),
    H('hard-subset-chain', '부분집합 셋을 뽑아 나열할 때 A ⊂ B ⊂ C일 확률', '심5', (d) => {
      const n = d.pick([3, 4]), withEmpty = d.bool(), lo = withEmpty ? 0 : 1, F = 2 ** n - (withEmpty ? 0 : 1), all = F * (F - 1) * (F - 2);
      const triples = [];
      for (let a = lo; a <= n; a += 1) for (let b = a + 1; b <= n; b += 1) for (let c = b + 1; c <= n; c += 1) triples.push({ a, b, c, w: nCr(n, a) * nCr(n - a, b - a) * nCr(n - b, c - b) });
      const top = sumA(triples.map((t) => t.w)), X = V('X');
      return probQ(`집합 ${X} = ${roster(range(1, n))}의 ${withEmpty ? '모든' : '공집합이 아닌 모든'} 부분집합 ${F}개 중에서 임의로 서로 다른 세 부분집합을 뽑아 임의로 일렬로 나열하고, 나열된 순서대로 A, B, C라 할 때, ${nb(ms('A ⊂ B ⊂ C'))}일 확률은?`, top, all, `(${triples.map((t) => `${combS(n, t.a)}*${combS(n - t.a, t.b - t.a)}*${combS(n - t.b, t.c - t.b)}`).join('+')})/(${F}*${F - 1}*${F - 2})`, {
        explain: `서로 다른 세 집합이 ${nb(ms('A ⊂ B ⊂ C'))}이면 원소의 개수가 ${nb(ms('n(A) < n(B) < n(C)'))}이다. 모든 경우는 ${nP(F, 3)} = ${all}(가지)이다. 원소의 개수로 나누어 세면 `
          + triples.map((t) => `(${t.a}, ${t.b}, ${t.c})일 때 ${nC(n, t.a)} × ${nC(n - t.a, t.b - t.a)} × ${nC(n - t.b, t.c - t.b)} = ${t.w}(가지)`).join(', ') + `이므로 모두 ${top}가지이다. 따라서 구하는 확률은 ${eqF(top, all)}이다.`
      });
    }, { standard: S1 }),
    H('hard-distinct-sol', '음이 아닌 정수해 하나를 고를 때 셋이 모두 다를 확률', '심7', (d) => {
      const N0 = d.int(6, 12), all = nCr(N0 + 2, 2), e = N0 % 3 === 0 ? 1 : 0, xy = Math.floor(N0 / 2) + 1, same = 3 * (xy - e) + e, top = all - same;
      const x = V('x'), y = V('y'), z = V('z');
      return probQ(`방정식 ${nb(ms(`x + y + z = ${N0}`))}을 만족시키는 음이 아닌 정수 ${x}, ${y}, ${z}의 모든 순서쌍 (${x}, ${y}, ${z}) 중에서 임의로 한 개를 선택할 때, ${nb(ms('(x - y)(y - z)(z - x) != 0'))}일 확률은?`.replace(`${N0}</span>을`, `${N0}</span>${josa(N0, '을/를').slice(String(N0).length)}`), top, all, `1-(3*(${Math.floor(N0 / 2)}+1-${e})+${e})/${combS(N0 + 2, 2)}`, {
        explain: `순서쌍은 모두 ${nH(3, N0)} = ${nC(N0 + 2, 2)} = ${all}(개)이다. 여사건은 어느 둘이 같은 경우이다. ${nb(ms('x = y'))}인 순서쌍은 ${nb(ms(`2x + z = ${N0}`))}에서 ${x} = 0, 1, …, ${Math.floor(N0 / 2)}의 ${xy}개`
          + (e ? `이고, 그중 (${N0 / 3}, ${N0 / 3}, ${N0 / 3})은 셋이 모두 같다. 셋이 모두 같은 것을 한 번만 세면 3 × ${xy - 1} + 1 = ${same}(개)` : `이고, ${josa(N0, '은/는')} 3의 배수가 아니라 셋이 모두 같은 순서쌍은 없으므로 3 × ${xy} = ${same}(개)`)
          + `이다. 따라서 구하는 확률은 1 ${MINUS} ${frac(same, all)} = ${fq(Q(top, all))}이다.`
      });
    }, { standard: S1 })
  ];

  B.addGroup('11-3-3', { id: 'hard', title: '실력 문제', standard: S1, types: hardTypes });
})(typeof window !== 'undefined' ? window : globalThis);
