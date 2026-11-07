// 고등학교 2학년 확률과 통계 3단원 확률의 개념과 활용 — 뒤쪽 묶음(확률의 덧셈정리, 여사건의 확률).
// 싣는 기준과 뺀 것은 11-3-3a.js 머리에 모아 적었다. 단원 안의 도구(검사 근거 seal, 세는 도구, 글 도구)는 a 파일이 B.kit.u33x 로 내보낸 것을 쓴다.
// ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번, 심n = 심화꼴의 n번.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, frac, lines, table, N } = B.kit;
  const { MINUS, Q, qadd, qsub, range, nb, tail, V, gcd } = B.kit.mid;
  const { ms, nC, nPi, pr } = B.kit.hs;
  const {
    sumA, fact, nCr, nPr, combos, cart, isPrime, inter, union, roster, combS, permS, factS, qS, fq, fqj, eqF, lj, who,
    T, probQ, oneQ, S2, S3
  } = B.kit.u33x;
  const ONE = Q(1, 1);
  const PE = (name, q) => nb(`${pr(name)} = ${fq(q)}`);                                   // P(A) = 2/5
  const D2 = cart([range(1, 6), range(1, 6)]);

  // 두 사건의 확률을 정수 모형(전체 D0 칸 가운데 A·B·A∩B 칸 수)으로 짓는다. 분모가 1이 되는 확률(0·1)은 피한다.
  function model(d, ok) {
    return d.until(() => {
      const D0 = d.pick([6, 8, 9, 10, 12, 14, 15, 16, 18, 20, 24, 30]), nA = d.int(2, D0 - 2), nB = d.int(2, D0 - 2), nAB = d.int(1, Math.min(nA, nB) - 1);
      return { D0, nA, nB, nAB, pA: Q(nA, D0), pB: Q(nB, D0), pAB: Q(nAB, D0), pU: Q(nA + nB - nAB, D0), pN: Q(D0 - nA - nB + nAB, D0) };
    }, (m) => m.nA + m.nB - m.nAB < m.D0 && [m.pA, m.pB, m.pAB, m.pU].every((q) => q.q > 1) && (!ok || ok(m)));
  }
  // 서로 배반인 두 사건
  function exModel(d) {
    return d.until(() => { const D0 = d.pick([8, 9, 10, 12, 14, 15, 16, 18, 20]), nA = d.int(1, D0 - 3), nB = d.int(1, D0 - 2); return { D0, nA, nB, pA: Q(nA, D0), pB: Q(nB, D0), pU: Q(nA + nB, D0) }; },
      (m) => m.nA + m.nB < m.D0 && m.pA.q > 1 && m.pB.q > 1 && m.pU.q > 1);
  }

  // ════════════════ 확률의 덧셈정리 ════════════════
  const addTypes = [
    T('add-formula', '덧셈정리 — P(A), P(B), P(A∩B), P(A∪B) 가운데 셋으로 나머지', '②34', (d, n) => {
      const m = model(d);
      if (n === 0) {
        return probQ(`두 사건 A, B에 대하여 ${PE('A', m.pA)}, ${PE('B', m.pB)}, ${PE('A∩B', m.pAB)}일 때, ${pr('A∪B')}의 값은?`, m.pU.p, m.pU.q, `${qS(m.pA)}+${qS(m.pB)}-${qS(m.pAB)}`, {
          explain: `확률의 덧셈정리에 의하여 ${nb(`${pr('A∪B')} = ${pr('A')} + ${pr('B')} ${MINUS} ${pr('A∩B')}`)} = ${fq(m.pA)} + ${fq(m.pB)} ${MINUS} ${fq(m.pAB)} = ${fq(m.pU)}이다.`
        });
      }
      return probQ(`두 사건 A, B에 대하여 ${PE('A', m.pA)}, ${PE('B', m.pB)}, ${PE('A∪B', m.pU)}일 때, ${pr('A∩B')}의 값은?`, m.pAB.p, m.pAB.q, `${qS(m.pA)}+${qS(m.pB)}-${qS(m.pU)}`, {
        explain: `${nb(`${pr('A∪B')} = ${pr('A')} + ${pr('B')} ${MINUS} ${pr('A∩B')}`)}이므로 ${nb(`${pr('A∩B')} = ${pr('A')} + ${pr('B')} ${MINUS} ${pr('A∪B')}`)} = ${fq(m.pA)} + ${fq(m.pB)} ${MINUS} ${fq(m.pU)} = ${fq(m.pAB)}이다.`
      });
    }, { count: 2, standard: S2 }),
    T('add-exclusive', '배반사건의 덧셈정리 — 한 사건의 확률과 그 여사건의 확률', '②35', (d, n) => {
      const m = exModel(d), pBc = qsub(ONE, m.pB);
      const head = `두 사건 A, B가 서로 배반사건이고 ${PE('A', m.pA)}, ${PE('A∪B', m.pU)}일 때,`;
      const step = `A, B가 서로 배반이므로 ${nb(`${pr('A∪B')} = ${pr('A')} + ${pr('B')}`)}이고 ${nb(`${pr('B')} = ${fq(m.pU)} ${MINUS} ${fq(m.pA)} = ${fq(m.pB)}`)}이다.`;
      if (n === 0) return probQ(`${head} ${pr('B')}의 값은?`, m.pB.p, m.pB.q, `${qS(m.pU)}-${qS(m.pA)}`, { explain: step });
      return probQ(`${head} ${pr('B^C')}의 값은?`, pBc.p, pBc.q, `1-(${qS(m.pU)}-${qS(m.pA)})`, { explain: `${step} 따라서 ${nb(`${pr('B^C')} = 1 ${MINUS} ${pr('B')} = ${fq(pBc)}`)}이다.` });
    }, { count: 2, standard: S2 }),
    T('add-demorgan', '여사건 꼴로 준 값으로 P(A∪B)·P(A) + P(B)', '②36', (d, n) => {
      const m = model(d), pX = qsub(ONE, m.pAB);
      const why = `${nb(`${ms('A^C∪B^C')} = ${ms('(A∩B)^C')}`)}이므로 ${nb(`${pr('A∩B')} = 1 ${MINUS} ${pr('A^C∪B^C')}`)} = 1 ${MINUS} ${fq(pX)} = ${fq(m.pAB)}이다.`;
      if (n === 0) {
        return probQ(`두 사건 A, B에 대하여 ${PE('A', m.pA)}, ${PE('B', m.pB)}, ${PE('A^C∪B^C', pX)}일 때, ${pr('A∪B')}의 값은?`, m.pU.p, m.pU.q, `${qS(m.pA)}+${qS(m.pB)}-(1-${qS(pX)})`, {
          explain: `${why} 따라서 ${nb(`${pr('A∪B')} = ${fq(m.pA)} + ${fq(m.pB)} ${MINUS} ${fq(m.pAB)} = ${fq(m.pU)}`)}이다.`
        });
      }
      const s = qadd(m.pA, m.pB);
      return probQ(`두 사건 A, B에 대하여 ${PE('A∪B', m.pU)}, ${PE('A^C∪B^C', pX)}일 때, ${nb(pr('A') + ' + ' + pr('B'))}의 값은?`, s.p, s.q, `${qS(m.pU)}+(1-${qS(pX)})`, {
        explain: `${why} ${nb(`${pr('A∪B')} = ${pr('A')} + ${pr('B')} ${MINUS} ${pr('A∩B')}`)}이므로 ${nb(`${pr('A')} + ${pr('B')} = ${pr('A∪B')} + ${pr('A∩B')}`)} = ${fq(m.pU)} + ${fq(m.pAB)} = ${fq(s)}이다.`
      });
    }, { count: 2, standard: S2 }),
    T('add-only', 'A만 일어날 확률 P(A∩Bᶜ)', '②37', (d) => {
      const m = model(d, (x) => x.pN.q > 1 && x.nA - x.nAB > 0), only = Q(m.nA - m.nAB, m.D0);
      return probQ(`두 사건 A, B에 대하여 ${PE('A', m.pA)}, ${PE('B', m.pB)}, ${PE('A^C∩B^C', m.pN)}일 때, ${pr('A∩B^C')}의 값은?`, only.p, only.q, `${qS(m.pA)}-(${qS(m.pA)}+${qS(m.pB)}-(1-${qS(m.pN)}))`, {
        explain: `${nb(`${ms('A^C∩B^C')} = ${ms('(A∪B)^C')}`)}이므로 ${nb(`${pr('A∪B')} = 1 ${MINUS} ${fq(m.pN)} = ${fq(m.pU)}`)}, ${nb(`${pr('A∩B')} = ${fq(m.pA)} + ${fq(m.pB)} ${MINUS} ${fq(m.pU)} = ${fq(m.pAB)}`)}이다. 따라서 ${nb(`${pr('A∩B^C')} = ${pr('A')} ${MINUS} ${pr('A∩B')}`)} = ${fq(m.pA)} ${MINUS} ${fq(m.pAB)} = ${fq(only)}이다.`
      });
    }, { standard: S2 }),
    T('add-fill', 'P(Aᶜ∩Bᶜ) = 1 − P(A) − P(B) + P(A∩B)를 잇는 과정의 빈칸', '②39', (d, n) => {
      const bx = (t) => '<span class="mb-box">' + t + '</span>';
      const steps = n === 0
        ? [`${pr('A^C∩B^C')} = ${pr(bx('가'))}`, `= 1 ${MINUS} ${pr('A∪B')}`, `= 1 ${MINUS} {${pr('A')} + ${pr('B')} ${MINUS} ${pr('A∩B')}}`, `= 1 ${MINUS} ${pr('A')} ${MINUS} ${pr('B')} + ${pr('A∩B')}`]
        : [`${pr('A^C∩B^C')} = ${pr('(A∪B)^C')}`, `= 1 ${MINUS} ${pr('A∪B')}`, `= 1 ${MINUS} {${pr('A')} + ${pr('B')} ${MINUS} ${bx('나')}}`, `= 1 ${MINUS} ${pr('A')} ${MINUS} ${pr('B')} + ${pr('A∩B')}`];
      const rows = n === 0
        ? [{ h: ms('(A∪B)^C'), ok: true }, { h: ms('(A∩B)^C'), ok: false }, { h: ms('A∪B'), ok: false }, { h: ms('A∩B'), ok: false }, { h: ms('A^C∪B'), ok: false }]
        : [{ h: pr('A∩B'), ok: true }, { h: pr('A∪B'), ok: false }, { h: nb(pr('A') + pr('B')), ok: false }, { h: pr('A^C∩B^C'), ok: false }, { h: pr('A^C∪B^C'), ok: false }];
      return oneQ(d, `다음은 두 사건 A, B에 대하여 ${pr('A^C∩B^C')} = 1 ${MINUS} ${pr('A')} ${MINUS} ${pr('B')} + ${pr('A∩B')}임을 보이는 과정이다. ${n === 0 ? '(가)' : '(나)'}에 알맞은 것은?`, rows, true, {
        figure: lines(steps.map((s) => nb(s))),
        explain: n === 0 ? `A도 B도 일어나지 않는 사건은 A∪B가 일어나지 않는 사건이므로 ${nb(`${ms('A^C∩B^C')} = ${ms('(A∪B)^C')}`)}이다. 이어서 여사건의 확률과 덧셈정리를 쓴다.`
          : `확률의 덧셈정리 ${nb(`${pr('A∪B')} = ${pr('A')} + ${pr('B')} ${MINUS} ${pr('A∩B')}`)}를 넣은 줄이므로 빈칸은 ${pr('A∩B')}이다.`
      });
    }, { count: 2, standard: S2 }),
    T('add-ratio', '비율로 준 두 성질 — 둘 중 하나라도 가질 확률', '②40', (d) => {
      const m = model(d);
      const [a, b, c, ask] = d.pick([
        ['어느 도서관이 가진 책 중에서 제목에 한글이 들어간 책은 전체의', '영어가 들어간 책은 전체의', '한글과 영어가 모두 들어간 책은 전체의', '이 도서관의 책 중에서 임의로 1권을 택할 때, 제목에 한글 또는 영어가 들어간 책일 확률은?'],
        ['어느 모임에서 A 영화를 본 사람은 전체의', 'B 영화를 본 사람은 전체의', '두 영화를 모두 본 사람은 전체의', '이 모임에서 임의로 1명을 택할 때, 이 사람이 A 영화 또는 B 영화를 보았을 확률은?'],
        ['어느 공장에서 만든 음료 중에서 설탕이 들어 있는 것은 전체의', '과일 향이 나는 것은 전체의', '설탕이 들어 있고 과일 향이 나는 것은 전체의', '이 공장에서 만든 음료 1개를 임의로 택할 때, 설탕이 들어 있거나 과일 향이 나는 것일 확률은?']
      ]);
      return probQ(`${a} ${fq(m.pA)}, ${b} ${fq(m.pB)}, ${c} ${fq(m.pAB)}이다. ${ask}`, m.pU.p, m.pU.q, `${qS(m.pA)}+${qS(m.pB)}-${qS(m.pAB)}`, {
        explain: `앞의 성질을 가진 사건을 A, 뒤의 성질을 가진 사건을 B라 하면 ${PE('A', m.pA)}, ${PE('B', m.pB)}, ${PE('A∩B', m.pAB)}이다. 따라서 ${nb(`${pr('A∪B')} = ${fq(m.pA)} + ${fq(m.pB)} ${MINUS} ${fq(m.pAB)} = ${fq(m.pU)}`)}이다.`
      });
    }, { standard: S2 }),
    T('add-people', '인원으로 준 두 모임 — 둘 중 하나라도 속할 확률', '②41', (d) => {
      const [all, a, b, ab] = d.until(() => { const t = d.int(25, 40), x = d.int(8, 20), y = d.int(8, 20); return [t, x, y, d.int(2, Math.min(x, y) - 2)]; }, ([t, x, y, z]) => x + y - z < t && Q(x + y - z, t).q > 1);
      const [g, p1, p2, p12, ask] = d.pick([
        ['어느 학급 학생', '자전거로 등교하는 학생', '버스로 등교하는 학생', '자전거와 버스를 모두 이용하여 등교하는 학생', '자전거 또는 버스로 등교하는 학생'],
        ['어느 역사 동아리 학생', '백제 역사 탐방에 참가한 학생', '신라 역사 탐방에 참가한 학생', '두 탐방에 모두 참가한 학생', '두 탐방 중 어느 하나에라도 참가한 학생'],
        ['어느 학급 학생', '방과 후 수업으로 수학을 신청한 학생', '과학을 신청한 학생', '수학과 과학을 모두 신청한 학생', '수학 또는 과학을 신청한 학생']
      ]);
      const u = a + b - ab;
      return probQ(`${g} ${all}명 중에서 ${p1}은 ${a}명, ${p2}은 ${b}명, ${p12}은 ${ab}명이다. 이 중에서 임의로 1명을 뽑을 때, ${ask}일 확률은?`, u, all, `(${a}+${b}-${ab})/${all}`, {
        explain: `${ask}의 수는 ${a} + ${b} ${MINUS} ${ab} = ${u}(명)이므로 구하는 확률은 ${eqF(u, all)}이다. (확률의 덧셈정리로 ${frac(a, all)} + ${frac(b, all)} ${MINUS} ${frac(ab, all)}${tail(ab, '을/를')} 셈해도 같다.)`
      });
    }, { standard: S2 }),
    T('add-multiple', '배수·약수 두 조건 가운데 하나라도 — 겹치는 것 빼기', '②42', (d, n) => {
      if (n === 0) {
        const [p, q, N0] = d.until(() => { const a = d.int(2, 7), b = d.int(2, 9); return [Math.min(a, b), Math.max(a, b), d.int(30, 60)]; }, ([a, b, t]) => a !== b && b % a !== 0 && a * b / gcd(a, b) <= t / 2);
        const l = p * q / gcd(p, q), fa = Math.floor(N0 / p), fb = Math.floor(N0 / q), fc = Math.floor(N0 / l), u = fa + fb - fc;
        return probQ(`1부터 ${N0}까지의 자연수가 각각 하나씩 적힌 공 ${N0}개가 들어 있는 상자에서 임의로 1개의 공을 꺼낼 때, 공에 적힌 수가 ${p}의 배수 또는 ${q}의 배수일 확률은?`, u, N0, `((${N0}-${N0}%${p})/${p}+(${N0}-${N0}%${q})/${q}-(${N0}-${N0}%${l})/${l})/${N0}`, {
          explain: `${p}의 배수가 나오는 사건을 A, ${q}의 배수가 나오는 사건을 B라 하면 A∩B는 ${l}의 배수가 나오는 사건이다. ${nb(`n(A) = ${fa}`)}, ${nb(`n(B) = ${fb}`)}, ${nb(`n(A∩B) = ${fc}`)}이므로 ${nb(`${pr('A∪B')} = ${frac(fa, N0)} + ${frac(fb, N0)} ${MINUS} ${frac(fc, N0)}`)} = ${fq(Q(u, N0))}이다.`
        });
      }
      const m = d.pick([12, 20]), S = range(1, m);
      const P1 = [['짝수', (x) => x % 2 === 0], ['홀수', (x) => x % 2 === 1], ['3의 배수', (x) => x % 3 === 0], ['4의 배수', (x) => x % 4 === 0]];
      const P2 = [6, 8, 10, 12, 16, 18, 20].filter((k) => k <= m).map((k) => [k + '의 약수', (x) => k % x === 0]);
      const [a, b] = d.until(() => [d.pick(P1), d.pick(P2)], ([x, y]) => { const A = S.filter(x[1]), Bs = S.filter(y[1]), c = inter(A, Bs); return c.length >= 1 && c.length < Math.min(A.length, Bs.length); });
      const A = S.filter(a[1]), Bs = S.filter(b[1]), c = inter(A, Bs), u = A.length + Bs.length - c.length;
      return probQ(`각 면에 1부터 ${m}까지의 자연수가 하나씩 적힌 정${m === 12 ? '십이' : '이십'}면체 모양의 주사위 한 개를 던질 때, 나온 수가 ${a[0]}이거나 ${b[0]}일 확률은?`, u, m, `(${A.length}+${Bs.length}-${c.length})/${m}`, {
        explain: `${a[0]}는 ${roster(A)}, ${b[0]}는 ${roster(Bs)}이고 두 사건에 모두 드는 수는 ${roster(c)}이다. 따라서 구하는 확률은 ${frac(A.length, m)} + ${frac(Bs.length, m)} ${MINUS} ${frac(c.length, m)} = ${fq(Q(u, m))}이다.`
      });
    }, { count: 2, standard: S2 }),
    T('add-disjoint', '겹치지 않는 두 조건 — 배반사건의 확률은 더하기만', '②43', (d, n) => {
      if (n === 0) {
        const N0 = d.int(30, 60), a = d.int(5, 15), b = d.int(N0 - 22, N0 - 5), k2 = N0 - b + 1;
        return probQ(`1부터 ${N0}까지의 자연수가 각각 하나씩 적힌 공 ${N0}개가 들어 있는 상자에서 임의로 1개의 공을 꺼낼 때, 공에 적힌 수가 ${a} 이하이거나 ${b} 이상일 확률은?`, a + k2, N0, `(${a}+(${N0}-${b}+1))/${N0}`, {
          explain: `${a} 이하인 수는 ${a}개, ${b} 이상인 수는 ${b}부터 ${N0}까지 ${k2}개이다. 두 사건은 동시에 일어나지 않는 배반사건이므로 구하는 확률은 ${frac(a, N0)} + ${frac(k2, N0)} = ${fq(Q(a + k2, N0))}이다.`
        });
      }
      const N0 = d.int(9, 12), S = range(1, N0);
      const [j, k] = d.until(() => [d.int(3, 10), d.int(3, 6)], ([x, y]) => { const A = S.filter((v) => x % v === 0), Bs = S.filter((v) => v % y === 0); return x <= N0 && A.length >= 2 && Bs.length >= 2 && !inter(A, Bs).length; });
      const A = S.filter((v) => j % v === 0), Bs = S.filter((v) => v % k === 0);
      return probQ(`1부터 ${N0}까지의 자연수가 각각 하나씩 적힌 카드 ${N0}장 중에서 임의로 1장을 뽑을 때, 카드에 적힌 수가 ${j}의 약수이거나 ${k}의 배수일 확률은?`, A.length + Bs.length, N0, `(${A.length}+${Bs.length})/${N0}`, {
        explain: `${j}의 약수는 ${roster(A)}, ${k}의 배수는 ${roster(Bs)}로 겹치는 수가 없으므로 두 사건은 서로 배반이다. 따라서 구하는 확률은 ${frac(A.length, N0)} + ${frac(Bs.length, N0)} = ${fq(Q(A.length + Bs.length, N0))}이다.`
      });
    }, { count: 2, standard: S2 }),
    T('add-same', '모두 같은 종류(같은 색)일 확률 — 배반사건의 합', '②44', (d, n) => {
      if (n === 0) {
        const [k1, k2, unit, item, ask] = d.pick([['남학생', '여학생', '명', '청소 당번 2명을 뽑을 때', '2명 모두 남학생이거나 2명 모두 여학생일'], ['빨간색 볼펜', '파란색 볼펜', '자루', '볼펜 2자루를 동시에 꺼낼 때', '꺼낸 볼펜 2자루가 같은 색일']]);
        const a = d.int(3, 7), b = d.int(3, 6), top = nCr(a, 2) + nCr(b, 2), all = nCr(a + b, 2);
        const where = k1 === '남학생' ? `어느 동아리에 ${k1} ${a}${unit}, ${k2} ${b}${unit}이 있다. 이 중에서 임의로 ${item},` : `${k1} ${a}${unit}와 ${k2} ${b}${unit}가 들어 있는 필통에서 임의로 ${item},`;
        return probQ(`${where} ${ask} 확률은?`, top, all, `${combS(a, 2)}/${combS(a + b, 2)}+${combS(b, 2)}/${combS(a + b, 2)}`, {
          explain: `모두 ${k1}인 사건과 모두 ${k2}인 사건은 서로 배반이므로 구하는 확률은 ${frac(nC(a, 2), nC(a + b, 2))} + ${frac(nC(b, 2), nC(a + b, 2))} = ${frac(nCr(a, 2), all)} + ${frac(nCr(b, 2), all)} = ${fq(Q(top, all))}이다.`
        });
      }
      const colors = ['흰 공', '빨간 공', '파란 공', '노란 공'], k = d.int(3, 4), cnt = [1].concat(range(2, k).map(() => d.int(2, 5)));
      const tot = sumA(cnt), parts = cnt.map((c) => nCr(c, 2)), top = sumA(parts), all = nCr(tot, 2);
      return probQ(`${cnt.map((c, i) => `${colors[i]} ${c}개`).join(', ')}가 들어 있는 상자에서 임의로 2개의 공을 동시에 꺼낼 때, 같은 색의 공을 꺼낼 확률은?`, top, all, `(${cnt.slice(1).map((c) => combS(c, 2)).join('+')})/${combS(tot, 2)}`, {
        explain: `흰 공은 1개뿐이라 흰 공 2개를 꺼낼 수는 없다. 색마다 2개를 꺼내는 사건은 서로 배반이므로 ${cnt.slice(1).map((c, i) => `${colors[i + 1]} 2개 ${nC(c, 2)} = ${parts[i + 1]}가지`).join(', ')}를 더한 ${top}가지가 조건을 만족시킨다. 모든 경우는 ${nC(tot, 2)} = ${all}(가지)이므로 구하는 확률은 ${eqF(top, all)}이다.`
      });
    }, { count: 2, standard: S2 }),
    T('add-diffcolor', '서로 다른 색 2개를 꺼낼 확률(색이 셋)', '②46', (d) => {
      const r = d.int(2, 4), y = d.int(1, 3), b = d.int(1, 2), tot = r + y + b, top = r * y + r * b + y * b, all = nCr(tot, 2);
      return probQ(`빨간 공 ${r}개, 노란 공 ${y}개, 파란 공 ${b}개가 들어 있는 주머니에서 임의로 2개의 공을 동시에 꺼낼 때, 서로 다른 색의 공 2개를 꺼낼 확률은?`, top, all, `(${r}*${y}+${r}*${b}+${y}*${b})/${combS(tot, 2)}`, {
        explain: `빨간 공과 노란 공, 빨간 공과 파란 공, 노란 공과 파란 공을 꺼내는 세 사건은 서로 배반이다. 모든 경우는 ${nC(tot, 2)} = ${all}(가지)이므로 구하는 확률은 ${frac(r * y, all)} + ${frac(r * b, all)} + ${frac(y * b, all)} = ${fq(Q(top, all))}이다.`
      });
    }, { standard: S2 }),
    T('add-same-back', '같은 성별일 확률로 인원 구하기', '②47', (d) => {
      const [t, x] = d.until(() => { const t0 = d.int(12, 36); return [t0, d.int(Math.floor(t0 / 2) + 1, t0 - 2)]; }, ([t0, x0]) => Q(nCr(x0, 2) + nCr(t0 - x0, 2), nCr(t0, 2)).q <= 400);
      const q = Q(nCr(x, 2) + nCr(t - x, 2), nCr(t, 2)), V0 = q.p * t * (t - 1), X = V('x');
      return N(`어느 동아리 학생 ${t}명 중에서 대표 2명을 뽑을 때, 2명 모두 남학생이거나 2명 모두 여학생일 확률이 ${fq(q)}이다. 이 동아리의 남학생은 몇 명인가? (단, 남학생이 여학생보다 많다.)`, x, {
        unit: '명',
        explain: `남학생 수를 ${X}라 하면 두 사건은 서로 배반이므로 ${frac(nC('x', 2), nC(t, 2))} + ${frac(nC(nb(`${t}${MINUS}${X}`), 2), nC(t, 2))} = ${fq(q)}이다. 이것을 정리하면 ${X} = ${t - x} 또는 ${X} = ${x}이고, 남학생이 더 많으므로 ${x}명이다.`,
        facts: { digit: { template: `${V0 - 1}<(□*(□-1)+(${t}-□)*(${t}-□-1))*${q.q}<${V0 + 1}`, lo: Math.floor(t / 2) + 1, hi: t, ask: 'min' } }
      });
    }, { standard: S2 }),
    T('add-arrange', '나열·함수에서 「A 또는 B」 — 겹치는 것 빼기', '②48', (d, n) => {
      if (n === 0) {
        const [word, L] = d.pick([['MONSTERS', 'S'], ['SPRINGS', 'S'], ['PUZZLE', 'Z'], ['SCHOOL', 'O'], ['BUTTON', 'T'], ['DINNER', 'N'], ['SUMMER', 'M'], ['BOTTLE', 'T'], ['APPLE', 'P'], ['GREEN', 'E'], ['PLANNER', 'N'], ['KITTENS', 'T'], ['PARROTS', 'R']]);
        const k = word.length, all = fact(k) / 2, one = fact(k - 1), both = fact(k - 2), top = 2 * one - both;
        return probQ(`영어 단어 ‘${word}’에 있는 ${k}개의 문자를 모두 일렬로 나열할 때, ${lj(L, '을/를')} 맨 앞에 놓거나 맨 뒤에 놓을 확률은?`, top, all, `(${factS(k - 1)}*2-${factS(k - 2)})/(${factS(k)}/2)`, {
          explain: `${L}는 두 개이므로 모든 경우는 ${frac(k + '!', '2!')} = ${all}(가지)이다. ${lj(L, '을/를')} 맨 앞에 놓는 사건을 A, 맨 뒤에 놓는 사건을 B라 하면 ${nb(`n(A) = n(B) = ${k - 1}! = ${one}`)}, ${nb(`n(A∩B) = ${k - 2}! = ${both}`)}이다. 따라서 ${nb(`${pr('A∪B')} = ${frac(one, all)} + ${frac(one, all)} ${MINUS} ${frac(both, all)}`)} = ${fq(Q(top, all))}이다.`.replace(`${L}는`, lj(L, '은/는'))
        });
      }
      const m = d.int(3, 5), i = d.int(1, m), j = d.int(1, m), X = V('X'), Y = V('Y'), f = V('f'), all = m ** 3, top = 2 * m * m - m;
      return probQ(`두 집합 ${X} = {${V('a')}, ${V('b')}, ${V('c')}}, ${Y} = ${roster(range(1, m))}에 대하여 ${X}에서 ${Y}로의 함수 ${f} 중에서 임의로 하나를 택할 때, ${nb(ms(`f(a) = ${i}`))} 또는 ${nb(ms(`f(b) = ${j}`))}일 확률은?`, top, all, `(${m}**2*2-${m})/${m}**3`, {
        explain: `모든 함수는 ${nPi(m, 3)} = ${all}(개)이다. ${nb(ms(`f(a) = ${i}`))}인 사건을 A, ${nb(ms(`f(b) = ${j}`))}인 사건을 B라 하면 ${nb(`n(A) = n(B) = ${m}<sup>2</sup> = ${m * m}`)}, ${nb(`n(A∩B) = ${m}`)}이다. 따라서 ${nb(`${pr('A∪B')} = ${frac(m * m, all)} + ${frac(m * m, all)} ${MINUS} ${frac(m, all)}`)} = ${fq(Q(top, all))}이다.`
      });
    }, { count: 2, standard: S2 }),
    T('add-quadint', '이차방정식이 정수해를 가질 확률 — 배수 조건과 덧셈정리', '②50', (d) => {
      const [p, q] = d.pick([[2, 3], [3, 4], [2, 5], [3, 5], [4, 5]]), N0 = d.pick([60, 80, 90, 100, 120]);
      const fa = Math.floor(N0 / p), fb = Math.floor(N0 / q), fc = Math.floor(N0 / (p * q)), u = fa + fb - fc, a = V('a'), x = V('x');
      return probQ(`1부터 ${N0}까지의 자연수 중에서 임의로 하나를 택하여 ${a}라 할 때, ${x}에 대한 이차방정식 ${nb(ms(`${p * q}x^2 - ${p + q}ax + a^2 = 0`))}이 적어도 하나의 정수해를 가질 확률은?`, u, N0, `((${N0}-${N0}%${p})/${p}+(${N0}-${N0}%${q})/${q}-(${N0}-${N0}%${p * q})/${p * q})/${N0}`, {
        explain: `${nb(ms(`(${p}x - a)(${q}x - a) = 0`))}이므로 ${nb(`${x} = ${frac(a, p)}`)} 또는 ${nb(`${x} = ${frac(a, q)}`)}이다. 정수해가 있으려면 ${a}가 ${p}의 배수 또는 ${q}의 배수이어야 한다. ${p}의 배수는 ${fa}개, ${q}의 배수는 ${fb}개, ${p * q}의 배수는 ${fc}개이므로 구하는 확률은 ${frac(fa, N0)} + ${frac(fb, N0)} ${MINUS} ${frac(fc, N0)} = ${fq(Q(u, N0))}이다.`
      });
    }, { standard: S2 }),
    T('add-abs', '두 눈의 수 — 절댓값 식이거나 두 눈이 같을 확률', '심3', (d) => {
      const [c, t] = d.pick([[3, 2], [4, 2], [3, 4], [4, 4], [2, 2]]);
      const A = D2.filter(([x, y]) => Math.abs(x - c) + Math.abs(y - c) === t), Bs = D2.filter(([x, y]) => x === y), AB = A.filter(([x, y]) => x === y), u = A.length + Bs.length - AB.length;
      const list = (l) => l.map((p) => '(' + p.join(', ') + ')').join(', ');
      return probQ(`한 개의 주사위를 두 번 던져서 나오는 눈의 수를 차례로 ${V('a')}, ${V('b')}라 할 때, ${nb(ms(`|a - ${c}| + |b - ${c}| = ${t}`))}이거나 ${nb(ms('a = b'))}일 확률은?`, u, 36, `(${A.length}+6-${AB.length})/36`, {
        explain: `${nb(ms(`|a - ${c}| + |b - ${c}| = ${t}`))}인 사건을 A, ${nb(ms('a = b'))}인 사건을 B라 하면 A의 순서쌍은 ${list(A)}의 ${A.length}개, B는 6개, A∩B는 ${list(AB)}의 ${AB.length}개이다. 따라서 ${nb(`${pr('A∪B')} = ${frac(A.length, 36)} + ${frac(6, 36)} ${MINUS} ${frac(AB.length, 36)}`)} = ${fq(Q(u, 36))}이다.`
      });
    }, { standard: S2 })
  ];

  // ════════════════ 여사건의 확률 ════════════════
  const compTypes = [
    T('comp-basic', '여사건의 확률 P(Aᶜ) = 1 − P(A)', '②35', (d) => {
      const p = d.until(() => Q(d.int(1, 11), d.int(3, 12)), (q) => q.p < q.q && q.q > 1), c = qsub(ONE, p);
      return probQ(`사건 A에 대하여 ${PE('A', p)}일 때, ${pr('A^C')}의 값은?`, c.p, c.q, `1-${qS(p)}`, { explain: `${nb(`${pr('A^C')} = 1 ${MINUS} ${pr('A')}`)} = 1 ${MINUS} ${fq(p)} = ${fq(c)}이다.` });
    }, { standard: S3 }),
    T('comp-atleast', '「적어도 하나」 — 한 종류만 뽑힐 확률을 뺌', '②51', (d) => {
      const a = d.int(3, 8), b = d.int(3, 8), r = d.int(2, Math.min(3, b)), all = nCr(a + b, r), none = nCr(b, r);
      const [text, rest] = d.pick([
        [`어느 학급의 남학생 ${a}명, 여학생 ${b}명 중에서 임의로 대표 ${r}명을 뽑을 때, 남학생이 적어도 1명 이상 뽑힐 확률은?`, `여학생만 ${r}명 뽑는 사건`],
        [`딸기 맛 사탕 ${a}개와 사과 맛 사탕 ${b}개가 들어 있는 상자에서 임의로 ${r}개를 동시에 꺼낼 때, 딸기 맛 사탕을 적어도 1개 이상 꺼낼 확률은?`, `사과 맛 사탕만 ${r}개 꺼내는 사건`],
        [`수학여행 후보지로 정한 서울 지역 ${b}곳, 경기 지역 ${a}곳 중에서 임의로 ${r}곳을 고를 때, 경기 지역이 적어도 1곳 이상 포함될 확률은?`, `서울 지역만 ${r}곳 고르는 사건`],
        [`운동장 음수대의 수도꼭지 ${a + b}개 중 ${a}개가 제대로 작동한다. 이 중에서 임의로 ${r}개를 틀었을 때, 적어도 1개 이상 제대로 작동할 확률은?`, `작동하지 않는 수도꼭지만 ${r}개 트는 사건`]
      ]);
      return probQ(text, all - none, all, `1-${combS(b, r)}/${combS(a + b, r)}`, {
        explain: `여사건은 ${rest}이고 그 확률은 ${frac(nC(b, r), nC(a + b, r))} = ${frac(none, all)}이다. 따라서 구하는 확률은 1 ${MINUS} ${frac(none, all)} = ${fq(Q(all - none, all))}이다.`
      });
    }, { standard: S3 }),
    T('comp-named', '정해진 두 사람 가운데 적어도 한 명', '②52', (d, n) => {
      const [p1, p2] = who(d, 2);
      if (n === 0) {
        const t = d.int(6, 10), r = d.int(2, Math.min(4, t - 3)), all = nCr(t, r), none = nCr(t - 2, r);
        return probQ(`${josa(p1, '과/와')} ${josa(p2, '을/를')} 포함한 ${t}명의 학생 중에서 임의로 대표 ${r}명을 뽑을 때, ${josa(p1, '과/와')} ${p2} 중 적어도 한 명이 대표로 뽑힐 확률은?`, all - none, all, `1-${combS(t - 2, r)}/${combS(t, r)}`, {
          explain: `여사건은 두 사람이 모두 뽑히지 않는 사건, 즉 나머지 ${t - 2}명 중에서 ${r}명을 뽑는 사건이므로 그 확률은 ${frac(nC(t - 2, r), nC(t, r))} = ${frac(none, all)}이다. 따라서 구하는 확률은 1 ${MINUS} ${frac(none, all)} = ${fq(Q(all - none, all))}이다.`
        });
      }
      const k = d.int(3, 4), all = nCr(2 * k, k), none = nCr(2 * k - 2, k);
      return probQ(`${josa(p1, '과/와')} ${josa(p2, '을/를')} 포함한 ${2 * k}명의 학생이 임의로 ${k}명씩 나누어 각각 버스와 기차를 타려고 한다. ${josa(p1, '과/와')} ${p2} 중 적어도 한 명이 버스를 탈 확률은?`, all - none, all, `1-${combS(2 * k - 2, k)}/${combS(2 * k, k)}`, {
        explain: `버스를 탈 ${k}명을 고르는 경우는 ${nC(2 * k, k)} = ${all}(가지)이다. 여사건은 두 사람이 모두 기차를 타는 사건, 즉 나머지 ${2 * k - 2}명 중에서 버스를 탈 ${k}명을 고르는 사건이므로 ${nC(2 * k - 2, k)} = ${none}(가지)이다. 따라서 구하는 확률은 1 ${MINUS} ${frac(none, all)} = ${fq(Q(all - none, all))}이다.`
      });
    }, { count: 2, standard: S3 }),
    T('comp-coin-dice', '동전·두 주사위의 여사건', '②53', (d, n) => {
      if (n === 0) {
        const k = d.int(2, 5), face = d.pick(['앞면', '뒷면']), other = face === '앞면' ? '뒷면' : '앞면';
        return probQ(`서로 다른 ${k}개의 동전을 동시에 던질 때, ${face}이 적어도 1개 이상 나올 확률은?`, 2 ** k - 1, 2 ** k, `1-1/2**${k}`, {
          explain: `여사건은 ${k}개 모두 ${other}이 나오는 사건이고 그 확률은 ${frac(1, 2 ** k)}이다. 따라서 구하는 확률은 1 ${MINUS} ${frac(1, 2 ** k)} = ${frac(2 ** k - 1, 2 ** k)}이다.`
        });
      }
      if (n === 1) {
        const kind = d.pick(['notprime', 'differ', 'notsum']);
        if (kind === 'notprime') {
          const hit = D2.filter(([x, y]) => isPrime(x * y));
          return probQ('서로 다른 두 개의 주사위를 동시에 던질 때, 나오는 두 눈의 수의 곱이 소수가 아닐 확률은?', 36 - hit.length, 36, `1-${hit.length}/36`, {
            explain: `여사건은 곱이 소수인 사건이다. 곱이 소수이려면 한 눈이 1이고 다른 눈이 소수여야 하므로 ${hit.map((p) => '(' + p.join(', ') + ')').join(', ')}의 ${hit.length}가지이다. 따라서 구하는 확률은 1 ${MINUS} ${frac(hit.length, 36)} = ${fq(Q(36 - hit.length, 36))}이다.`
          });
        }
        if (kind === 'differ') {
          return probQ('서로 다른 두 개의 주사위를 동시에 던질 때, 서로 다른 눈의 수가 나올 확률은?', 30, 36, '1-6/36', {
            explain: `여사건은 두 눈의 수가 같은 사건이고 (1, 1), (2, 2), …, (6, 6)의 6가지이다. 따라서 구하는 확률은 1 ${MINUS} ${frac(6, 36)} = ${frac(5, 6)}이다.`
          });
        }
        const s = d.int(4, 10), hit = D2.filter(([x, y]) => x + y === s);
        return probQ(`서로 다른 두 개의 주사위를 동시에 던질 때, 나오는 두 눈의 수의 합이 ${s}가 아닐 확률은?`.replace(`${s}가`, josa(s, '이/가')), 36 - hit.length, 36, `1-${hit.length}/36`, {
          explain: `여사건은 합이 ${s}인 사건이고 ${hit.map((p) => '(' + p.join(', ') + ')').join(', ')}의 ${hit.length}가지이다. 따라서 구하는 확률은 1 ${MINUS} ${frac(hit.length, 36)} = ${fq(Q(36 - hit.length, 36))}이다.`
        });
      }
      const k = d.int(4, 7);
      return probQ(`서로 다른 ${k}개의 동전을 동시에 던질 때, 나온 앞면의 수와 뒷면의 수의 차가 ${k - 1} 이하일 확률은?`, 2 ** k - 2, 2 ** k, `1-2/2**${k}`, {
        explain: `앞면이 ${V('h')}개이면 차는 ${nb(`|${V('h')} ${MINUS} (${k} ${MINUS} ${V('h')})|`)}이고 ${k}보다 클 수 없다. 차가 ${k - 1} 이하가 아닌 것은 차가 ${k}인 경우, 즉 모두 앞면이거나 모두 뒷면인 2가지뿐이다. 따라서 구하는 확률은 1 ${MINUS} ${frac(2, 2 ** k)} = ${fq(Q(2 ** k - 2, 2 ** k))}이다.`
      });
    }, { count: 3, standard: S3 }),
    T('comp-alldiff', '「적어도 둘이 같다」 — 모두 다른 경우를 뺌', '②54', (d, n) => {
      if (n === 0) {
        const m = d.int(3, 6), r = d.int(3, Math.min(4, m)), all = m ** r, diff = nPr(m, r);
        return probQ(`1부터 ${m}까지의 자연수가 각각 하나씩 적힌 공 ${m}개가 들어 있는 상자에서 공을 임의로 1개씩 ${r}번 꺼낼 때, 적어도 2번 이상 같은 수가 적힌 공을 꺼낼 확률은? (단, 꺼낸 공은 상자에 다시 넣는다.)`, all - diff, all, `1-${permS(m, r)}/${m}**${r}`, {
          explain: `여사건은 ${r}번 모두 다른 수가 적힌 공을 꺼내는 사건이고 그 확률은 ${frac(nP2(m, r), `${m}<sup>${r}</sup>`)} = ${frac(diff, all)}이다. 따라서 구하는 확률은 1 ${MINUS} ${frac(diff, all)} = ${fq(Q(all - diff, all))}이다.`
        });
      }
      const m = d.pick([4, 6, 8]), all = m ** 3, diff = nPr(m, 3);
      const dice = m === 6 ? '한 개의 주사위를 세 번 던져 나온 눈의 수' : `각 면에 1부터 ${m}까지의 자연수가 하나씩 적힌 정${m === 4 ? '사' : '팔'}면체 모양의 주사위 한 개를 세 번 던져 ${m === 4 ? '바닥에 닿는 면에 적힌 수' : '나온 수'}`;
      return probQ(`${dice}를 차례로 ${V('x')}, ${V('y')}, ${V('z')}라 할 때, ${nb(ms('(x - y)(y - z)(z - x) = 0'))}일 확률은?`, all - diff, all, `1-${permS(m, 3)}/${m}**3`, {
        explain: `곱이 0이려면 ${V('x')}, ${V('y')}, ${V('z')} 중 어느 둘이 같아야 하므로 여사건은 세 수가 모두 다른 사건이다. 그 경우는 ${nP2(m, 3)} = ${diff}(가지)이고 모든 경우는 ${m}<sup>3</sup> = ${all}(가지)이므로 구하는 확률은 1 ${MINUS} ${frac(diff, all)} = ${fq(Q(all - diff, all))}이다.`
      });
    }, { count: 2, standard: S3 }),
    T('comp-positive', '두 수의 합의 부호 — 적은 쪽을 세어 뺌', '②55', (d) => {
      const a = d.int(2, 4), b = d.int(3, 5), nums = range(-a, b), pos = d.bool(), all = nCr(nums.length, 2);
      const two = combos(nums, 2), bad = two.filter(([x, y]) => (pos ? x + y <= 0 : x + y >= 0));
      const sn = (v) => (v < 0 ? MINUS + -v : String(v));
      return probQ(`${nums.length}개의 수 ${nums.map(sn).join(', ')}가 각각 하나씩 적힌 공 ${nums.length}개가 들어 있는 주머니에서 임의로 2개의 공을 동시에 꺼낼 때, 공에 적힌 두 수의 합이 ${pos ? '양수' : '음수'}일 확률은?`.replace(`${sn(b)}가`, josa(b, '이/가')), all - bad.length, all, `1-${bad.length}/${combS(nums.length, 2)}`, {
        explain: `모든 경우는 ${nC(nums.length, 2)} = ${all}(가지)이다. 여사건은 합이 ${pos ? '0 또는 음수' : '0 또는 양수'}인 사건이고 ${bad.map(([x, y]) => `(${sn(x)}, ${sn(y)})`).join(', ')}의 ${bad.length}가지이다. 따라서 구하는 확률은 1 ${MINUS} ${frac(bad.length, all)} = ${fq(Q(all - bad.length, all))}이다.`
      });
    }, { standard: S3 }),
    T('comp-both-kinds', '두 종류를 각각 적어도 하나씩 뽑을 확률', '②57', (d) => {
      const a = d.int(5, 9), b = d.int(4, 7), r = d.int(3, Math.min(5, b)), all = nCr(a + b, r), na = nCr(a, r), nb0 = nCr(b, r), top = all - na - nb0;
      return probQ(`숫자 카드 ${a}장과 문자 카드 ${b}장이 들어 있는 상자에서 임의로 카드 ${r}장을 동시에 뽑을 때, 숫자 카드와 문자 카드를 각각 적어도 1장 이상씩 뽑을 확률은?`, top, all, `1-${combS(a, r)}/${combS(a + b, r)}-${combS(b, r)}/${combS(a + b, r)}`, {
        explain: `숫자 카드만 뽑는 사건을 A, 문자 카드만 뽑는 사건을 B라 하면 구하는 사건은 ${ms('A^C∩B^C')}이고 A∩B = ∅이다. ${nb(`${pr('A')} = ${frac(na, all)}`)}, ${nb(`${pr('B')} = ${frac(nb0, all)}`)}이므로 ${nb(`${pr('A^C∩B^C')} = 1 ${MINUS} ${pr('A')} ${MINUS} ${pr('B')}`)} = ${fq(Q(top, all))}이다.`
      });
    }, { standard: S3 }),
    T('comp-atleast-k', '「적어도 k개」 — 0개·1개를 뺌', '②58', (d) => {
      const tot = d.int(8, 12), w = d.int(3, 5), r = d.int(3, 5), all = nCr(tot, r), z = nCr(tot - w, r), one = w * nCr(tot - w, r - 1), top = all - z - one;
      return probQ(`당첨 제비 ${w}개를 포함한 ${tot}개의 제비 중에서 임의로 ${r}개의 제비를 동시에 꺼낼 때, 당첨 제비가 적어도 2개 이상 포함될 확률은?`, top, all, `1-(${combS(tot - w, r)}+${w}*${combS(tot - w, r - 1)})/${combS(tot, r)}`, {
        explain: `여사건은 당첨 제비가 0개 또는 1개인 사건이다. 0개인 경우는 ${nC(tot - w, r)} = ${z}(가지), 1개인 경우는 ${nC(w, 1)} × ${nC(tot - w, r - 1)} = ${one}(가지)이고 모든 경우는 ${nC(tot, r)} = ${all}(가지)이다. 따라서 구하는 확률은 1 ${MINUS} ${frac(z + one, all)} = ${fq(Q(top, all))}이다.`
      });
    }, { standard: S3 }),
    T('comp-coprime', 'n과 서로소일 확률 — 두 배수의 합사건의 여사건', '②59', (d) => {
      const [p, q] = d.pick([[2, 3], [2, 5], [3, 5], [3, 7], [2, 7], [5, 7]]), N0 = d.int(50, 100), k = p * q;
      const fa = Math.floor(N0 / p), fb = Math.floor(N0 / q), fc = Math.floor(N0 / k), u = fa + fb - fc;
      return probQ(`1부터 ${N0}까지의 자연수가 각각 하나씩 적힌 공 ${N0}개가 들어 있는 주머니에서 임의로 한 개의 공을 꺼낼 때, 꺼낸 공에 적힌 수가 ${josa(k, '과/와')} 서로소일 확률은?`, N0 - u, N0, `1-((${N0}-${N0}%${p})/${p}+(${N0}-${N0}%${q})/${q}-(${N0}-${N0}%${k})/${k})/${N0}`, {
        explain: `${josa(k, '과/와')} 서로소인 수는 ${p}의 배수도 ${q}의 배수도 아닌 수이다. ${p}의 배수인 사건을 A, ${q}의 배수인 사건을 B라 하면 ${nb(`${pr('A∪B')} = ${frac(fa, N0)} + ${frac(fb, N0)} ${MINUS} ${frac(fc, N0)} = ${fq(Q(u, N0))}`)}이므로 구하는 확률은 ${nb(`${pr('A^C∩B^C')} = 1 ${MINUS} ${pr('A∪B')}`)} = ${fq(Q(N0 - u, N0))}이다.`
      });
    }, { standard: S3 }),
    T('comp-back', '「적어도」의 확률로 개수 구하기', '②60', (d) => {
      const [t, x] = d.until(() => { const t0 = d.int(8, 16); return [t0, d.int(2, t0 - 3)]; }, ([t0, x0]) => Q(nCr(t0, 2) - nCr(t0 - x0, 2), nCr(t0, 2)).q <= 200);
      const q = Q(nCr(t, 2) - nCr(t - x, 2), nCr(t, 2)), c = qsub(ONE, q), V0 = c.p * t * (t - 1), X = V('x');
      const [k1, k2, unit, ask] = d.pick([['여학생', '남학생', '명', `이 중에서 임의로 2명의 대표를 뽑을 때, 여학생이 적어도 1명 이상 뽑힐 확률이 ${fq(q)}이다. 여학생은 몇 명인가?`], ['빨간 공', '파란 공', '개', `이 주머니에서 임의로 2개의 공을 동시에 꺼낼 때, 적어도 한 개가 빨간 공일 확률이 ${fq(q)}이다. 빨간 공은 몇 개인가?`]]);
      const lead = unit === '명' ? `${t}명의 학생 중 일부는 여학생이고 나머지는 남학생이다.` : `주머니에 빨간 공과 파란 공이 모두 ${t}개 들어 있다.`;
      return N(`${lead} ${ask}`, x, {
        unit,
        explain: `${k1}의 수를 ${X}라 하면 여사건은 2${unit} 모두 ${k2}인 사건이므로 ${frac(nC(nb(`${t}${MINUS}${X}`), 2), nC(t, 2))} = 1 ${MINUS} ${fq(q)} = ${fq(c)}이다. 정리하면 ${nb(`(${t} ${MINUS} ${X})(${t - 1} ${MINUS} ${X}) = ${(t - x) * (t - x - 1)}`)}이고, 이것을 만족시키는 ${X}는 ${x}이다.`,
        facts: { digit: { template: `${V0 - 1}<(${t}-□)*(${t}-□-1)*${c.q}<${V0 + 1}`, lo: 1, hi: t - 2, ask: 'min' } }
      });
    }, { standard: S3 })
  ];
  // ₙPᵣ(공용 도구를 a 파일과 같이 쓴다)
  function nP2(n, r) { return B.kit.hs.nP(n, r); }

  B.addGroup('11-3-3', { id: 'add', title: '확률의 덧셈정리', standard: S2, types: addTypes });
  B.addGroup('11-3-3', { id: 'comp', title: '여사건의 확률', standard: S3, types: compTypes });
})(typeof window !== 'undefined' ? window : globalThis);
