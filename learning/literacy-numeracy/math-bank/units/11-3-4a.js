// 고등학교 확률과 통계 Ⅱ-2 「조건부확률」 — 단원 틀·도구와 앞쪽 묶음(조건부확률, 확률의 곱셈정리).
// 수집해 둔 천재 T셀파 확률과 통계(전인태, 2022 개정)의 교과서·평가 자료에서 뽑은 문제 꼴 목록(기본꼴_1: 26꼴, 기본꼴_2: 27꼴, 심화꼴: 6꼴)을 꼴마다 따져서 실었다.
// 꼴마다 「실음 / 바꿈 / 겹침 / 뺌(까닭)」을 가른 대조표는 references/textbooks/수학/_분석/11-3-4/싣기_대조표.md 에 있다.
// (사건의 독립과 종속, 독립시행의 확률은 11-3-4b.js 에, 실력 문항은 11-3-4c.js 에 있다.)
// ref: ①n = 기본꼴_1의 n번, ②n = 기본꼴_2의 n번, 심n = 심화꼴의 n번.
// 성취기준: [12확통02-04] 조건부확률을 이해하고, 이를 실생활과 연결하여 문제를 해결할 수 있다. [12확통02-05] 사건의 독립과 종속을 이해하고, 이를 판단할 수 있다.
//  [12확통02-06] 확률의 곱셈정리를 이해하고, 이를 활용하여 문제를 해결할 수 있다.
//
// 싣는 기준
//  - 하는 일이 다르면 다른 문제다: 주는 것(확률 값·주사위·표·비율 글·주머니), 묻는 것(P(B∣A)·P(A∣B)·P(A∩B)·전체 확률·원인 쪽 확률·독립 판정·개수),
//    셈의 구조(나눔 한 번, 곱했다 나눔, 여사건을 거침, 갈래를 더함, 거꾸로 구함)가 다르면 따로 싣는다.
//  - 교육과정: 「조건부확률은 … 사건의 시간적 순서나 인과관계로 해석하지 않도록 한다」는 ①15가 그대로 묻는다.
//    「세 사건 이상에서 서로 배반이거나 서로 독립임을 가정한 복잡한 문제는 다루지 않는다」는 정도를 말하는 줄이라 세 사람이 서로 독립인 꼴(②13·14·15)도 실었다.
//  - 학년이 다른 단원(중2 확률 8-2-7, 고1 경우의 수 10-1-7)과 같은 일인 꼴(①16, ②11·12·13·17·21)도 싣는다(사용자 결정). 같은 과목(확률과 통계)의
//    다른 단원과 겹치는 ①18·②12·심6은 이 단원에 두었고(11-3-3에서 뺐다), 독립시행의 기본 꼴(②16~18)은 11-3-5(이항분포)와 겹쳐도 여기에 둔다.
//  - 답: 확률은 분수 칸(qAns — 부호 단추 없이, 크기가 같은 분수도 맞게 친다). 소수 둘째 자리 이상의 답과 9999를 넘는 답은 내지 않는다 —
//    원문의 소수 확률(0.8, 0.76, 0.97, 0.9999, 0.006088)은 분수나 백분율로 바꾸어 냈다. 개수·자연수는 수 칸, 판정·설명·증명의 빈칸은 고르기다.
//    고르기의 참·거짓은 손으로 적지 않고 코드로 셈한다(원소를 세어 본 확률, 여러 값을 넣어 본 식, 모든 경우를 따라가 본 결과).
//  - 원문이 따로 구한 값을 더한 곳(p + q)은 분수 칸으로 바로 묻는다. 원문이 a/6⁵ 꼴로 물은 곳은 그 꼴을 살렸다.
//  - 원문 오류는 바로잡아 셈했다: 승부차기 4 : 5(②26)는 5/1024, 상자 셋에서 구슬 2개(①21)는 문제 글대로 2개를 꺼낸 확률, 차시 학습지의 P(B)가 어긋난 ①1은 P(B) 하나로 맞췄다.
//  - 수와 상황은 새로 썼다. 늘 같은 답이 나오는 꼴(②27 — 원문 수로는 두 갈래 값이 같아 늘 3/8)은 갈래 값이 다르게 수를 바꾸었다.
//
// 뺀 것과 까닭(11-3-4b.js, 11-3-4c.js 의 것까지 여기에 모아 적는다. 꼴마다의 판정은 대조표에 있다)
//  - 뺀 꼴은 없다. 심1(두 기준 표에서 조건부확률 — 수능 3점)은 ①10과 같은 일이라 ①10 유형에 함께 적었다(겹침).
//  - 꼴 목록에서 이미 건너뛴 것(대단원 진단 평가, 중단원 1의 문제, 고리 만들기 프로젝트, 중간기말 2회의 통계 문제)은 다른 단원 몫이다.
// 묻는 말: 확률·값은 「~은?/~는?」, 개수는 「몇 ~인가?」, 판정은 「~인가?」로 고르기. 문자는 값을 물으면 「상수 a」.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, frac, lines, table, N, M, C, NAMES, name } = B.kit;
  const { MINUS, Q, qadd, qsub, qmul, qdiv, qcmp, tx, tj, nb, V, gcd } = B.kit.mid;
  const { ms, pr, nC, jh, qAns, svgm } = B.kit.hs;
  const UNIT = '11-3-4', STD4 = '12확통02-04', STD5 = '12확통02-05', STD6 = '12확통02-06';

  // ── 수와 글 ──
  const num = (n) => (n < 0 ? MINUS + Math.abs(n) : String(n));
  const jq = (q) => (q.q === 1 ? (q.p < 0 ? '(' + q.p + ')' : String(q.p)) : '(' + q.p + '/' + q.q + ')');   // 검사 식에 적는 유리수
  const inside = (q) => q.p > 0 && q.p < q.q;                                         // 0보다 크고 1보다 작다
  const fair = (...qs) => qs.every((q) => q.p * 5 >= q.q && q.p * 5 <= q.q * 4);          // 1/5 ~ 4/5 사이(너무 치우친 확률을 피한다)
  const one = Q(1);
  const comp = (q) => qsub(one, q);
  const comb = (n, r) => { if (r < 0 || r > n) return 0; let v = 1; for (let i = 1; i <= r; i += 1) v = (v * (n - r + i)) / i; return Math.round(v); };
  const isPrime = (x) => x > 1 && Array.from({ length: x - 2 }, (_, i) => i + 2).every((k) => x % k !== 0);
  const setH = (list) => nb('{' + list.join(', ') + '}');
  const eqv = (h, q) => nb(h + ' = ' + tx(q));
  const PA = pr('A'), PB = pr('B'), PAB = pr('A∩B'), PBgA = pr('B', 'A'), PAgB = pr('A', 'B');
  const TWO = '두 사건 A, B에 대하여';
  const PROBS = [Q(1, 2), Q(1, 3), Q(2, 3), Q(1, 4), Q(3, 4), Q(1, 5), Q(2, 5), Q(3, 5), Q(4, 5), Q(1, 6), Q(5, 6), Q(2, 7), Q(3, 7), Q(3, 8), Q(5, 8), Q(2, 9), Q(4, 9), Q(5, 9), Q(3, 10), Q(7, 10)];
  // 표본공간을 넷으로 나눈 원소 수: [A∩B, A∩Bᶜ, Aᶜ∩B, Aᶜ∩Bᶜ] — 모두 1 이상이고 합이 T
  const cells = (d, T) => d.until(() => { const x = d.int(1, T - 3), y = d.int(1, T - x - 2), z = d.int(1, T - x - y - 1); return [x, y, z, T - x - y - z]; }, (v) => v[3] >= 1);
  const TOTALS = [10, 12, 15, 20, 24, 30, 36, 40, 60];
  // 그림 칸에 적는 확률 값 여럿
  const given = (rows) => rows.map(([h, q]) => eqv(h, q)).join(', ');

  // ── 검사 근거 마무리(11-1-7a.js 와 같은 방법) ──
  const stripH = (html) => String(html || '').replace(/<svg[\s\S]*?<\/svg>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/\s+/g, ' ').trim();
  function visibleNumbers(item) {
    const seen = stripH([item.text, item.figure || ''].concat(item.choice ? item.choice.options : []).join(' | ').replace(/<svg[^>]*aria-label="([^"]*)"[\s\S]*?<\/svg>/g, ' $1 ').replace(/<table[^>]*aria-label="([^"]*)"[^>]*>/g, ' $1 | '));
    return new Set((seen.match(/\d+/g) || []).concat(seen.match(/\d+\.\d+/g) || [], seen.replace(/(\d) (?=\d)/g, '$1').match(/\d+/g) || []));
  }
  // 다시 셈하는 식의 수 가운데 글에 보이지 않는 수를 facts.unseen 에 밝힌다. 밝히기로 한 수(facts.derived — 세어서 얻은 원소 수, 조합의 수 따위)가 아닌 수가 나오면 오류를 낸다.
  function seal(item) {
    const f = item.facts || {};
    if (f.calc) f.calc = f.calc.map(([t, i]) => [/\+0$/.test(t) ? t : '(' + t + ')+0', i]);
    if (f.value !== undefined && !/\+0$/.test(f.value)) f.value = '(' + f.value + ')+0';
    const derived = new Set((f.derived || []).map(Number).concat([0, 1])), shown = visibleNumbers(item), out = new Set(f.unseen || []);
    const exprs = (f.calc || []).map(([t]) => t).concat(f.value !== undefined ? [f.value] : [], f.pick ? [f.pick.expr] : []);
    for (const t of exprs) for (const n of String(t).match(/\d+(?:\.\d+)?/g) || []) {
      if (shown.has(n)) continue;
      if (!derived.has(Number(n)) && !out.has(Number(n))) throw new Error('검사 식의 수 ' + n + ' 이 글에도 밝힌 수에도 없다: ' + t);
      out.add(Number(n));
    }
    delete f.derived;
    if (out.size) f.unseen = [...out]; else delete f.unseen;
    item.facts = f;
    return item;
  }
  // 만들기가 null 을 돌려주면(조건에 맞지 않는 수) 다시 만든다.
  const retry = (make) => (d, n) => { for (let i = 0; i < 4000; i += 1) { const item = make(d, n); if (item) return seal(item); } throw new Error('조건에 맞는 문항을 만들지 못했다'); };
  const srcOf = (ref) => (/[①②]/.test(ref) ? '수집본 기본 자료(' : '수집본 심화 자료(') + ref + ')';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: srcOf(ref), make: retry(make) }, more || {});
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: srcOf(ref), make: retry(make) }, more || {});

  // ── 답 칸 ──
  const factsOf = (o, base) => Object.assign(base, o.derived ? { derived: o.derived } : {}, o.unseen ? { unseen: o.unseen } : {}, o.rule ? { rule: o.rule } : {});
  // 확률(분수 칸, 부호 단추 없이). o.value: 다시 셈하는 식
  const prQ = (text, q, o) => qAns(text, q, { figure: o.figure, explain: o.explain, facts: factsOf(o, { value: o.value }) });
  // 자연수 하나(개수, n 따위)
  const intQ = (text, n, o) => N(text, n, { unit: o.unit, figure: o.figure, explain: o.explain, facts: factsOf(o, { value: o.value }) });
  // 하나 고르기: rows 는 { h 글, ok 참인가 }. ok 가 want 인 것이 꼭 하나다(참·거짓은 코드가 셈한 값이다).
  function oneQ(d, text, rows, want, o) {
    const list = o.keep ? rows.slice() : d.shuffle(rows);
    if (list.filter((r) => r.ok === want).length !== 1) return null;
    if (new Set(list.map((r) => stripH(r.h))).size !== list.length) return null;
    const at = list.findIndex((r) => r.ok === want);
    return C(text, list.map((r) => r.h), at, { figure: o.figure, explain: o.explain, facts: Object.assign({ truth: list.map((r) => r.ok), want }, o.rule ? { rule: o.rule } : {}) });
  }
  // 「옳은 것만을 있는 대로 고른 것」: rows 는 { h 글, ok 옳은가 }. 옳은 묶음 하나와 하나를 빼거나 더하거나 바꾼 묶음을 섞는다(10-2-5a.js 의 setsQ 와 같은 방법).
  const GA = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ'];
  const bogi = (list) => lines(list.map((h, i) => '<span class="mb-tag mb-tag-short">' + GA[i] + '.</span> ' + h));
  function setsQ(d, text, rows, o) {
    const labels = GA.slice(0, rows.length), flags = rows.map((r) => Boolean(r.ok));
    if (!flags.some(Boolean) || flags.every(Boolean)) return null;
    const key = (s) => s.join('|'), right = labels.filter((_, i) => flags[i]), cand = [];
    for (let m = 1; m < (1 << labels.length); m += 1) cand.push(labels.filter((_, k) => (m >> k) & 1));
    const out = [right], seen = new Set([key(right)]);
    for (const c of d.shuffle(cand)) { if (out.length === 5) break; if (!seen.has(key(c))) { seen.add(key(c)); out.push(c); } }
    const sets = out.sort((a, b) => a.length - b.length || key(a).localeCompare(key(b)));
    return C(text, sets.map((s) => s.join(', ')), sets.findIndex((s) => key(s) === key(right)), {
      figure: (o.figure || '') + bogi(rows.map((r) => r.h)), explain: o.explain + ` 따라서 옳은 것은 ${right.join(', ')}이다.`,
      facts: Object.assign({ sets: { labels, flags, options: sets } }, o.rule ? { rule: o.rule } : {})
    });
  }

  // ── 그림: 수형도(가지마다 확률을 적는다) ──
  // branches: [[x1, y1, x2, y2, 가지 글, 글 x, 글 y]] 선분과 그 글(글 자리는 선에 닿지 않게 손으로 정한다), ends: [[x, y, 끝 글]]. 글은 svgm 글.
  function treeFig(branches, ends, label) {
    let out = '';
    for (const [x1, y1, x2, y2] of branches) out += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#1f2933" stroke-width="1.4"/>`;
    for (const [, , , , t, lx, ly] of branches) if (t) out += `<text x="${lx}" y="${ly}" text-anchor="middle" style="font-size:14px">${svgm(t)}</text>`;
    for (const [x, y, t] of ends) out += `<text x="${x}" y="${y}" style="font-size:15px">${svgm(t)}</text>`;
    return `<svg viewBox="0 0 290 140" width="290" height="140" role="img" aria-label="${label}" style="max-width:100%">${out}</svg>`;
  }
  // 사건의 기호(P 없이): ev('A^C') → Aᶜ, ev('B∣A') → B∣A
  const ev = (s) => s.split('∣').map((t) => ms(t)).join('<span class="mb-fn mb-mid">∣</span>');

  // 다른 파일(b·c)이 함께 쓰는 도구
  B.kit.u1134 = {
    UNIT, STD4, STD5, STD6, num, jq, inside, one, comp, comb, setH, eqv, PA, PB, PAB, PBgA, PAgB, TWO, PROBS, cells, TOTALS, given,
    stripH, seal, retry, srcOf, T, H, prQ, intQ, oneQ, setsQ, bogi, treeFig, ev, isPrime
  };

  B.addUnit({
    id: '11-3-4', grade: 11, semester: 3, no: 4, title: '조건부확률', version: 1,
    groups: [
      { id: 'cond', title: '조건부확률', standard: STD4, types: [] },
      { id: 'mult', title: '확률의 곱셈정리', standard: STD6, types: [] },
      { id: 'indep', title: '사건의 독립과 종속', standard: STD5, types: [] },
      { id: 'trial', title: '독립시행의 확률', standard: STD6, types: [] }
    ]
  });

  // ── 한 번의 시행에서 쓰는 수 조건(주사위·카드) ──
  function conds(top) {
    const out = [
      { h: '홀수', ok: (x) => x % 2 === 1 }, { h: '짝수', ok: (x) => x % 2 === 0 }, { h: '소수', ok: isPrime }
    ];
    for (const k of [3, 4, 5]) if (k * 2 <= top) out.push({ h: k + '의 배수', ok: (x) => x % k === 0 });
    for (const k of [6, 8, 10, 12, 18, 20]) if (k <= top + 6 && k >= 6) out.push({ h: k + '의 약수', ok: (x) => k % x === 0 });
    for (const k of [3, 4, 5, 6, 7, 8]) if (k > 2 && k < top - 1) { out.push({ h: k + ' 이상인 수', ok: (x) => x >= k }); out.push({ h: k + ' 이하인 수', ok: (x) => x <= k }); }
    return out;
  }
  const SPACES = [
    { top: 6, lead: '한 개의 주사위를 한 번 던져서 나온 눈의 수가', it: '그 수가' },
    { top: 8, lead: '각 면에 1부터 8까지의 자연수가 하나씩 적힌 정팔면체 모양의 주사위를 한 번 던져서 바닥에 닿은 면에 적힌 수가', it: '그 수가' },
    { top: 12, lead: '각 면에 1부터 12까지의 자연수가 하나씩 적힌 정십이면체 모양의 주사위를 한 번 던져서 바닥에 닿은 면에 적힌 수가', it: '그 수가' },
    { top: 10, lead: '1부터 10까지의 자연수가 하나씩 적힌 카드 10장 중에서 한 장을 뽑았더니 카드에 적힌 수가', it: '그 수가' },
    { top: 15, lead: '1부터 15까지의 자연수가 하나씩 적힌 공 15개가 들어 있는 주머니에서 공 한 개를 꺼냈더니 공에 적힌 수가', it: '그 수가' }
  ];
  const cut = (h) => h.replace(/인 수$/, '');   // 「4 이상인 수」 → 「4 이상」(조건 뒤에 「인 수」를 다시 붙일 때)
  const isWord = (c) => /인 수$/.test(c.h);
  const be = (c) => (isWord(c) ? cut(c.h) + '인' : c.h + '인');   // 「홀수인」, 「4 이상인」

  // ════════════════════════════════════════════════════════════════
  // ── 조건부확률 ──
  B.addTypes(UNIT, 'cond', [
    T('cond-def', '확률 값으로 조건부확률 구하기', '①1', (d, n) => {
      const Tt = d.pick(TOTALS), [x, y, z] = cells(d, Tt);
      const pA = Q(x + y, Tt), pB = Q(x + z, Tt), pAB = Q(x, Tt);
      if (qcmp(pA, pB) === 0 || !fair(pA, pB)) return null;
      if (n === 0) {
        const ans = qdiv(pAB, pA);
        return prQ(`${TWO} ${eqv(PA, pA)}, ${eqv(PAB, pAB)}일 때, ${PBgA}의 값은?`, ans, {
          explain: `${PBgA} = ${PAB} ÷ ${PA} = ${tx(pAB)} ÷ ${tx(pA)} = ${tx(ans)}이다.`, value: `${jq(pAB)}/${jq(pA)}`
        });
      }
      const ans = qdiv(pAB, pB);
      return prQ(`${TWO} ${eqv(PA, pA)}, ${eqv(PB, pB)}, ${eqv(PAB, pAB)}일 때, ${PAgB}의 값은?`, ans, {
        explain: `${PAgB}는 사건 B가 일어났을 때의 확률이므로 ${PB}로 나눈다. ${PAgB} = ${PAB} ÷ ${PB} = ${tx(pAB)} ÷ ${tx(pB)} = ${tx(ans)}이다.`, value: `${jq(pAB)}/${jq(pB)}`
      });
    }, { count: 2 }),

    T('cond-mult', '조건부확률로 두 사건이 함께 일어날 확률 구하기', '①2', (d) => {
      const pA = d.pick(PROBS), pBA = d.pick(PROBS), ans = qmul(pA, pBA);
      if (ans.q > 60) return null;
      return prQ(`${TWO} ${eqv(PA, pA)}, ${eqv(PBgA, pBA)}일 때, ${PAB}의 값은?`, ans, {
        explain: `확률의 곱셈정리에 의하여 ${PAB} = ${PA}${PBgA} = ${tx(pA)} × ${tx(pBA)} = ${tx(ans)}이다.`, value: `${jq(pA)}*${jq(pBA)}`
      });
    }),

    T('cond-swap', '한쪽 조건부확률에서 다른 쪽 조건부확률 구하기', '①3', (d, n) => {
      const Tt = d.pick(TOTALS), [x, y, z] = cells(d, Tt);
      const pA = Q(x + y, Tt), pB = Q(x + z, Tt), pAB = Q(x, Tt);
      if (qcmp(pA, pB) === 0 || !fair(pA, pB)) return null;
      if (n === 0) {
        const pBA = qdiv(pAB, pA), ans = qdiv(pAB, pB);
        return prQ(`${TWO} ${eqv(PA, pA)}, ${eqv(PB, pB)}, ${eqv(PBgA, pBA)}일 때, ${PAgB}의 값은?`, ans, {
          explain: `${PAB} = ${PA}${PBgA} = ${tx(pA)} × ${tx(pBA)} = ${tx(pAB)}이므로 ${PAgB} = ${PAB} ÷ ${PB} = ${tx(pAB)} ÷ ${tx(pB)} = ${tx(ans)}이다.`,
          value: `${jq(pA)}*${jq(pBA)}/${jq(pB)}`
        });
      }
      const pAB2 = qdiv(pAB, pB), ans = qdiv(pAB, pA);
      return prQ(`${TWO} ${eqv(pr('A^C'), comp(pA))}, ${eqv(pr('B^C'), comp(pB))}, ${eqv(PAgB, pAB2)}일 때, ${PBgA}의 값은?`, ans, {
        explain: `${PA} = 1 ${MINUS} ${tx(comp(pA))} = ${tx(pA)}, ${PB} = 1 ${MINUS} ${tx(comp(pB))} = ${tx(pB)}이다. ${PAB} = ${PB}${PAgB} = ${tx(pB)} × ${tx(pAB2)} = ${tx(pAB)}이므로 ${PBgA} = ${tx(pAB)} ÷ ${tx(pA)} = ${tx(ans)}이다.`,
        value: `(1-${jq(comp(pB))})*${jq(pAB2)}/(1-${jq(comp(pA))})`
      });
    }, { count: 2 }),

    T('cond-union', '합사건의 확률로 조건부확률 구하기', '①4', (d) => {
      const Tt = d.pick(TOTALS), [x, y, z] = cells(d, Tt);
      const pA = Q(x + y, Tt), pB = Q(x + z, Tt), pAB = Q(x, Tt), pU = Q(x + y + z, Tt), askB = d.bool();
      if (qcmp(pA, pB) === 0 || !fair(pA, pB)) return null;
      const ans = askB ? qdiv(pAB, pA) : qdiv(pAB, pB), whatH = askB ? PBgA : PAgB, under = askB ? PA : PB, underQ = askB ? pA : pB;
      return prQ(`${TWO} ${eqv(PA, pA)}, ${eqv(PB, pB)}, ${eqv(pr('A∪B'), pU)}일 때, ${whatH}의 값은?`, ans, {
        explain: `${PAB} = ${PA} + ${PB} ${MINUS} ${pr('A∪B')} = ${tx(pA)} + ${tx(pB)} ${MINUS} ${tx(pU)} = ${tx(pAB)}이므로 ${whatH} = ${tx(pAB)} ÷ ${tx(underQ)} = ${tx(ans)}이다.`,
        value: `(${jq(pA)}+${jq(pB)}-${jq(pU)})/${jq(underQ)}`
      });
    }),

    T('cond-comp', '여사건끼리의 조건부확률 구하기', '①5', (d) => {
      const Tt = d.pick(TOTALS), [x, y, z, w] = cells(d, Tt);
      const pA = Q(x + y, Tt), pB = Q(x + z, Tt), pAB = Q(x, Tt), pNone = Q(w, Tt), ans = qdiv(pNone, comp(pA));
      if (!fair(pA, pB)) return null;
      return prQ(`${TWO} ${eqv(PA, pA)}, ${eqv(PB, pB)}, ${eqv(PAB, pAB)}일 때, ${pr('B^C', 'A^C')}의 값은?`, ans, {
        explain: `${pr('A^C∩B^C')} = ${pr('(A∪B)^C')} = 1 ${MINUS} (${tx(pA)} + ${tx(pB)} ${MINUS} ${tx(pAB)}) = ${tx(pNone)}이고 ${pr('A^C')} = 1 ${MINUS} ${tx(pA)} = ${tx(comp(pA))}이다. 따라서 ${pr('B^C', 'A^C')} = ${tx(pNone)} ÷ ${tx(comp(pA))} = ${tx(ans)}이다.`,
        value: `(1-${jq(pA)}-${jq(pB)}+${jq(pAB)})/(1-${jq(pA)})`
      });
    }),

    T('cond-acb', '사건 B의 확률과 곱사건의 확률로 P(Aᶜ∣B) 구하기', '①6', (d) => {
      const Tt = d.pick(TOTALS), [x, , z] = cells(d, Tt);
      const pB = Q(x + z, Tt), pAB = Q(x, Tt), ans = qdiv(qsub(pB, pAB), pB);
      if (!fair(pB)) return null;
      return prQ(`${TWO} ${eqv(PB, pB)}, ${eqv(PAB, pAB)}일 때, ${pr('A^C', 'B')}의 값은?`, ans, {
        explain: `${pr('A^C∩B')} = ${PB} ${MINUS} ${PAB} = ${tx(pB)} ${MINUS} ${tx(pAB)} = ${tx(qsub(pB, pAB))}이므로 ${pr('A^C', 'B')} = ${tx(qsub(pB, pAB))} ÷ ${tx(pB)} = ${tx(ans)}이다.`,
        value: `(${jq(pB)}-${jq(pAB)})/${jq(pB)}`
      });
    }),

    T('cond-split', '두 곱사건의 확률로 P(A∣B) 구하기', '①7', (d) => {
      const Tt = d.pick(TOTALS), [x, , z] = cells(d, Tt);
      const pAB = Q(x, Tt), pAcB = Q(z, Tt), pB = Q(x + z, Tt), ans = qdiv(pAB, pB);
      if (!fair(pB)) return null;
      if (qcmp(pAB, pAcB) === 0) return null;
      return prQ(`${TWO} ${eqv(PAB, pAB)}, ${eqv(pr('A^C∩B'), pAcB)}일 때, ${PAgB}의 값은?`, ans, {
        explain: `${PB} = ${PAB} + ${pr('A^C∩B')} = ${tx(pAB)} + ${tx(pAcB)} = ${tx(pB)}이므로 ${PAgB} = ${tx(pAB)} ÷ ${tx(pB)} = ${tx(ans)}이다.`,
        value: `${jq(pAB)}/(${jq(pAB)}+${jq(pAcB)})`
      });
    }),

    T('cond-die', '주사위·카드 한 번 — 조건 아래에서의 확률', '①8', (d) => {
      const sp = d.pick(SPACES), all = Array.from({ length: sp.top }, (_, i) => i + 1), pool = conds(sp.top);
      const [c1, c2] = d.shuffle(pool).slice(0, 2);
      if (c1.h === c2.h || (c1.h === '홀수' && c2.h === '짝수') || (c1.h === '짝수' && c2.h === '홀수')) return null;
      const A = all.filter(c1.ok), AB = A.filter(c2.ok);
      if (A.length < 2 || AB.length < 1 || AB.length === A.length || A.length === sp.top) return null;
      const ans = Q(AB.length, A.length);
      return prQ(`${sp.lead} ${be(c1)} 것을 알았을 때, ${sp.it} ${isWord(c2) ? cut(c2.h) : c2.h}일 확률은?`, ans, {
        explain: `${c1.h}는 ${setH(A)}의 ${A.length}개이고, 그 가운데 ${c2.h}는 ${setH(AB)}의 ${AB.length}개이다. 따라서 구하는 확률은 ${frac(AB.length, A.length)}${ans.q !== A.length ? ' = ' + tx(ans) : ''}이다.`,
        value: `${AB.length}/${A.length}`, derived: [AB.length, A.length]
      });
    }),

    T('cond-twodice', '두 주사위의 순서쌍에서 조건부확률 구하기', '①9', (d) => {
      const k = d.int(7, 10), s = d.int(4, 9);
      const AS = [
        { h: '첫 번째 나온 눈의 수가 두 번째 나온 눈의 수보다 큰', ok: (a, b) => a > b },
        { h: '두 눈의 수가 서로 다른', ok: (a, b) => a !== b },
        { h: `두 눈의 수의 합이 ${k} 이상인`, ok: (a, b) => a + b >= k },
        { h: '두 눈의 수의 곱이 짝수인', ok: (a, b) => (a * b) % 2 === 0 }
      ];
      const BS = [
        { h: '두 눈의 수의 합이 짝수인', ok: (a, b) => (a + b) % 2 === 0 },
        { h: `두 눈의 수의 합이 ${s}인`, ok: (a, b) => a + b === s },
        { h: '첫 번째 나온 눈의 수가 홀수인', ok: (a, b) => a % 2 === 1 },
        { h: '두 눈의 수의 차가 1인', ok: (a, b) => Math.abs(a - b) === 1 }
      ];
      const ca = d.pick(AS), cb = d.pick(BS), pairs = [];
      for (let a = 1; a <= 6; a += 1) for (let b = 1; b <= 6; b += 1) pairs.push([a, b]);
      const nA = pairs.filter(([a, b]) => ca.ok(a, b)).length, nB = pairs.filter(([a, b]) => cb.ok(a, b)).length, nAB = pairs.filter(([a, b]) => ca.ok(a, b) && cb.ok(a, b)).length;
      if (nAB < 1 || nAB === nA || nAB === nB) return null;
      const askB = d.bool(), ans = askB ? Q(nAB, nA) : Q(nAB, nB), whatH = askB ? PBgA : PAgB;
      return prQ(`한 개의 주사위를 두 번 던질 때, ${ca.h} 사건을 A, ${cb.h} 사건을 B라 하자. ${whatH}의 값은?`, ans, {
        explain: `36가지 순서쌍 가운데 사건 A는 ${nA}가지, 사건 B는 ${nB}가지, 사건 A∩B는 ${nAB}가지이다. 따라서 ${whatH} = ${frac(nAB, askB ? nA : nB)}${ans.q !== (askB ? nA : nB) ? ' = ' + tx(ans) : ''}이다.`,
        value: `${nAB}/${askB ? nA : nB}`, derived: [nAB, nA, nB, 36]
      });
    }),

    T('cond-table', '두 기준으로 나눈 표에서 조건부확률 구하기', '①10 심1', (d, n) => {
      if (n === 0) {
        // rows: [표에 적는 이름, 학생을 가리키는 말]
        const SETS = [
          { rows: [['A형', '혈액형이 A형인 학생'], ['B형', '혈액형이 B형인 학생'], ['O형', '혈액형이 O형인 학생'], ['AB형', '혈액형이 AB형인 학생']], lead: '어느 학급 학생들의 혈액형을 조사하여 나타낸 표이다.' },
          { rows: [['봄', '봄을 좋아하는 학생'], ['여름', '여름을 좋아하는 학생'], ['가을', '가을을 좋아하는 학생'], ['겨울', '겨울을 좋아하는 학생']], lead: '어느 학년 학생들이 가장 좋아하는 계절을 하나씩 조사하여 나타낸 표이다.' },
          { rows: [['문화 체험', '문화 체험을 고른 학생'], ['생태 연구', '생태 연구를 고른 학생']], lead: '어느 학교 학생들이 체험 활동 두 가지 가운데 하나씩 고른 결과를 나타낸 표이다.' },
          { rows: [['걸어서', '걸어서 등교하는 학생'], ['버스', '버스로 등교하는 학생'], ['자전거', '자전거로 등교하는 학생']], lead: '어느 학년 학생들의 등교 방법을 조사하여 나타낸 표이다. 학생마다 한 가지 방법으로만 등교한다.' }
        ];
        const set = d.pick(SETS), big = set.rows.length === 2, cnt = set.rows.map(() => [d.int(big ? 20 : 2, big ? 70 : 9), d.int(big ? 20 : 2, big ? 70 : 9)]);
        const rowT = cnt.map(([a, b]) => a + b), colT = [cnt.reduce((s, r) => s + r[0], 0), cnt.reduce((s, r) => s + r[1], 0)], all = colT[0] + colT[1];
        const i = d.int(0, set.rows.length - 1), j = d.int(0, 1), byRow = d.bool(), cell = cnt[i][j], under = byRow ? rowT[i] : colT[j];
        const sex = ['남학생', '여학생'][j], kind = set.rows[i][1];
        const ans = Q(cell, under);
        if (!inside(ans)) return null;
        const fig = '<div style="font-size:0.95rem">(단위: 명)</div>' + table(['구분', '남학생', '여학생', '합계'], set.rows.map((r, k) => [r[0], String(cnt[k][0]), String(cnt[k][1]), String(rowT[k])]).concat([['합계', String(colT[0]), String(colT[1]), String(all)]]));
        const condH = byRow ? kind : sex, askH = byRow ? sex : kind;
        return prQ(`다음은 ${set.lead} 이 학생들 가운데 임의로 뽑은 한 명이 ${condH}일 때, 이 학생이 ${askH}일 확률은?`, ans, {
          figure: fig,
          explain: `조건이 되는 ${condH}은 ${under}명이고, 그 가운데 ${askH}은 ${cell}명이다. 분모는 전체 ${all}명이 아니라 ${under}명이다. 따라서 구하는 확률은 ${frac(cell, under)}${ans.q !== under ? ' = ' + tx(ans) : ''}이다.`,
          value: `${cell}/${under}`
        });
      }
      if (n === 1) {
        // 표의 빈칸 a, b, c 를 채운 뒤 조건부확률(1·2학년 × 남녀)
        const T1 = d.pick([20, 24, 30, 36, 40]), T2 = d.pick([20, 24, 30, 36, 40]), a = d.int(4, T1 - 4), c = d.int(4, T2 - 4), b = T1 - a, f2 = T2 - c;
        const Mm = a + c, Ff = b + f2;
        if (a === c || b === f2) return null;
        const ans = Q(a, Mm);
        const fig = '<div style="font-size:0.95rem">(단위: 명)</div>' + table(['구분', '남학생', '여학생', '합계'], [['1학년', V('a'), V('b'), String(T1)], ['2학년', V('c'), String(f2), String(T2)], ['합계', String(Mm), String(Ff), String(T1 + T2)]]);
        return prQ(`다음은 어느 캠프에 참가한 1학년과 2학년 학생 ${T1 + T2}명을 학년과 성별로 나눈 표이다. 이 학생들 가운데 임의로 뽑은 한 명이 남학생일 때, 이 학생이 1학년일 확률은? (단, ${V('a')}, ${V('b')}, ${V('c')}는 상수이다.)`, ans, {
          figure: fig,
          explain: `2학년에서 ${V('c')} = ${T2} ${MINUS} ${f2} = ${c}이고, 남학생 합계에서 ${V('a')} = ${Mm} ${MINUS} ${c} = ${a}이다. 따라서 구하는 확률은 ${frac(a, Mm)}${ans.q !== Mm ? ' = ' + tx(ans) : ''}이다.`,
          value: `(${Mm}-(${T2}-${f2}))/${Mm}`
        });
      }
      // 표 없이 글로 준 두 기준
      const m = d.pick([40, 50, 60, 70, 80]), f = d.pick([30, 40, 50, 60]), p = d.int(5, Math.floor(m / 2)), q = d.int(3, Math.floor(f / 2));
      const W = d.pick([['안경을 낀', '안경을 낀 학생'], ['동아리에 가입한', '동아리에 가입한 학생'], ['방과 후 수업을 신청한', '방과 후 수업을 신청한 학생']]);
      const ans = Q(q, p + q);
      if (p === q) return null;
      return prQ(`남학생 ${m}명과 여학생 ${f}명 가운데 ${W[0]} 학생은 남학생 ${p}명, 여학생 ${q}명이다. 이 학생들 가운데 임의로 뽑은 한 명이 ${W[1]}일 때, 이 학생이 여학생일 확률은?`, ans, {
        explain: `${W[1]}은 ${p} + ${q} = ${p + q}명이고 그 가운데 여학생은 ${q}명이므로 구하는 확률은 ${frac(q, p + q)}${ans.q !== p + q ? ' = ' + tx(ans) : ''}이다.`,
        value: `${q}/(${p}+${q})`
      });
    }, { count: 3 }),

    T('cond-ratio', '전체에 대한 두 비율로 조건부확률 구하기', '①11', (d, n) => {
      const S = d.pick([
        ['어느 고등학교에서 1학년 학생은 전체 학생의', '1학년 여학생은 전체 학생의', '이 학교 학생 가운데 임의로 뽑은 한 명이 1학년일 때, 이 학생이 여학생일 확률은?', '1학년', '1학년 여학생'],
        ['어느 학교에서 봉사 활동을 신청한 학생은 전체 학생의', '봉사 활동을 신청한 2학년 학생은 전체 학생의', '이 학교 학생 가운데 임의로 뽑은 한 명이 봉사 활동을 신청한 학생일 때, 이 학생이 2학년일 확률은?', '신청한 학생', '신청한 2학년 학생'],
        ['어느 동네 주민 가운데 도서관 회원은 전체 주민의', '도서관 회원인 초등학생은 전체 주민의', '이 동네 주민 가운데 임의로 뽑은 한 명이 도서관 회원일 때, 이 주민이 초등학생일 확률은?', '도서관 회원', '도서관 회원인 초등학생']
      ]);
      if (n === 0) {
        const a = d.pick([20, 25, 30, 40, 45, 50, 60, 64, 75, 80]), b = d.pick([5, 8, 10, 12, 15, 16, 18, 20, 24, 25, 30, 36, 40]);
        if (b >= a) return null;
        const ans = Q(b, a);
        return prQ(`${S[0]} ${a} %이고, ${S[1]} ${b} %이다. ${S[2]}`, ans, {
          explain: `${S[3]}인 사건을 A, 구하는 쪽인 사건을 B라 하면 ${eqv(PA, Q(a, 100))}, ${eqv(PAB, Q(b, 100))}이다. 따라서 ${PBgA} = ${tx(Q(b, 100))} ÷ ${tx(Q(a, 100))} = ${tx(ans)}이다.`,
          value: `(${b}/100)/(${a}/100)`, derived: [100]
        });
      }
      const pA = d.pick([Q(1, 2), Q(2, 3), Q(3, 4), Q(3, 5), Q(4, 5), Q(5, 6), Q(2, 5)]), pAB = d.pick([Q(1, 4), Q(1, 5), Q(1, 6), Q(1, 3), Q(2, 9), Q(3, 10), Q(1, 8)]);
      if (qcmp(pAB, pA) >= 0) return null;
      const ans = qdiv(pAB, pA);
      if (ans.q > 30) return null;
      return prQ(`${S[0]} ${tx(pA)}이고, ${S[1]} ${tx(pAB)}이다. ${S[2]}`, ans, {
        explain: `${S[3]}인 사건을 A, 구하는 쪽인 사건을 B라 하면 ${eqv(PA, pA)}, ${eqv(PAB, pAB)}이다. ${S[4]}의 비율은 전체에 대한 것이므로 ${PAB}이다. 따라서 ${PBgA} = ${tx(pAB)} ÷ ${tx(pA)} = ${tx(ans)}이다.`,
        value: `${jq(pAB)}/${jq(pA)}`
      });
    }, { count: 2 }),

    T('cond-of', '「이 중에서」의 비율로 두 사건이 함께 일어날 확률 구하기', '①12', (d) => {
      const S = d.pick([
        ['어느 마을에서 걷기 운동에 참여하는 주민은 전체 주민의', '이 중에서 고등학생의 비율은', '이 마을 주민 가운데 임의로 한 명을 뽑을 때, 이 주민이 걷기 운동에 참여하는 고등학생일 확률은?'],
        ['어느 학교에서 수학 동아리에 가입한 학생은 전체 학생의', '이 중에서 1학년의 비율은', '이 학교 학생 가운데 임의로 한 명을 뽑을 때, 이 학생이 수학 동아리에 가입한 1학년일 확률은?'],
        ['어느 회사 직원 가운데 자전거로 출근하는 직원은 전체 직원의', '이 중에서 여자의 비율은', '이 회사 직원 가운데 임의로 한 명을 뽑을 때, 이 직원이 자전거로 출근하는 여자일 확률은?']
      ]);
      const p = d.pick(PROBS), q = d.pick(PROBS), ans = qmul(p, q);
      if (ans.q > 60) return null;
      return prQ(`${S[0]} ${tx(p)}이고, ${S[1]} ${tx(q)}이다. ${S[2]}`, ans, {
        explain: `「이 중에서」의 비율은 앞 사건이 일어났을 때의 조건부확률이다. 따라서 구하는 확률은 ${tx(p)} × ${tx(q)} = ${tx(ans)}이다.`,
        value: `${jq(p)}*${jq(q)}`
      });
    }),

    T('cond-three', '세 비율이 얽힌 글을 표로 정리해 조건부확률 구하기', '①13', (d, n) => {
      const Tt = d.pick([30, 36, 40, 45, 48, 54, 60, 72, 90]), [x, y, z, w] = cells(d, Tt);
      const nice = (q) => q.q <= 30 && q.p * 10 >= q.q && q.p * 10 <= q.q * 9;   // 분모가 크지 않고 1/10 ~ 9/10 사이
      if (n === 0) {
        // x: 남·안경, y: 남·안경 아님, z: 여·안경, w: 여·안경 아님
        const pM = Q(x + y, Tt), pMG = Q(x, Tt), r = Q(w, y + w), ans = Q(x, x + z);
        if (![pM, pMG, r, ans].every(nice) || !inside(r) || !inside(ans)) return null;
        return prQ(`어느 고등학교에서 남학생은 전체 학생의 ${tx(pM)}이고, 안경을 쓴 남학생은 전체 학생의 ${tx(pMG)}이다. 또, 안경을 쓰지 않은 학생의 ${tj(r, '은/는')} 여학생이다. 이 학교 학생 가운데 임의로 뽑은 한 명이 안경을 쓴 학생일 때, 이 학생이 남학생일 확률은?`, ans, {
          explain: `안경을 쓰지 않은 남학생은 전체의 ${tx(pM)} ${MINUS} ${tx(pMG)} = ${tx(Q(y, Tt))}이고, 이것이 안경을 쓰지 않은 학생의 1 ${MINUS} ${tx(r)} = ${tx(comp(r))}이므로 안경을 쓰지 않은 학생은 전체의 ${tx(Q(y + w, Tt))}, 안경을 쓴 학생은 전체의 ${tx(Q(x + z, Tt))}이다. 따라서 구하는 확률은 ${tx(pMG)} ÷ ${tx(Q(x + z, Tt))} = ${tx(ans)}이다.`,
          value: `${jq(pMG)}/(1-(${jq(pM)}-${jq(pMG)})/(1-${jq(r)}))`
        });
      }
      if (n === 1) {
        // x: 여·콜라, y: 여·사이다, z: 남·콜라, w: 남·사이다
        const pF = Q(x + y, Tt), pFC = Q(x, Tt), k = Q(z, z + w), ans = Q(y, y + w);
        if (![pF, pFC, k, ans].every(nice) || !inside(k) || !inside(ans)) return null;
        return prQ(`어느 식당에서는 손님에게 콜라와 사이다 가운데 한 잔을 준다. 이 식당 손님의 ${tj(pF, '은/는')} 여자이고, 콜라를 고른 여자 손님은 전체 손님의 ${tx(pFC)}이다. 또, 콜라를 고른 남자 손님은 전체 남자 손님의 ${tx(k)}이다. 이 식당 손님 가운데 임의로 뽑은 한 명이 사이다를 골랐을 때, 이 손님이 여자일 확률은?`, ans, {
          explain: `사이다를 고른 여자 손님은 전체의 ${tx(pF)} ${MINUS} ${tx(pFC)} = ${tx(Q(y, Tt))}, 사이다를 고른 남자 손님은 전체의 (1 ${MINUS} ${tx(pF)}) × (1 ${MINUS} ${tx(k)}) = ${tx(Q(w, Tt))}이다. 따라서 구하는 확률은 ${tx(Q(y, Tt))} ÷ ${tx(Q(y + w, Tt))} = ${tx(ans)}이다.`,
          value: `(${jq(pF)}-${jq(pFC)})/((${jq(pF)}-${jq(pFC)})+(1-${jq(pF)})*(1-${jq(k)}))`
        });
      }
      // x: 이용·남, y: 이용·여, z: 이용 안 함·남, w: 이용 안 함·여
      const pU = Q(x + y, Tt), pM = Q(x + z, Tt), t = Q(z, x + z), ans = Q(x, x + y);
      if (![pU, pM, t, ans].every(nice) || !inside(t) || !inside(ans)) return null;
      return prQ(`어느 비행기 승객 가운데 자동 출입국 심사를 이용한 승객은 전체의 ${tx(pU)}이고, 남자 승객은 전체의 ${tx(pM)}이다. 또, 이 비행기 승객 가운데 임의로 뽑은 한 명이 남자일 때, 이 승객이 자동 출입국 심사를 이용하지 않았을 확률은 ${tx(t)}이다. 임의로 뽑은 한 명이 자동 출입국 심사를 이용했을 때, 이 승객이 남자일 확률은?`, ans, {
        explain: `남자이면서 자동 출입국 심사를 이용한 승객은 전체의 ${tx(pM)} × (1 ${MINUS} ${tx(t)}) = ${tx(Q(x, Tt))}이다. 따라서 구하는 확률은 ${tx(Q(x, Tt))} ÷ ${tx(pU)} = ${tx(ans)}이다.`,
        value: `${jq(pM)}*(1-${jq(t)})/${jq(pU)}`
      });
    }, { count: 3 }),

    T('cond-meaning', '조건부확률의 뜻 — 옳은 설명 고르기', '①15', (d, n) => {
      const TRUE = [
        `${PBgA}는 사건 A를 새로운 표본공간으로 보고, 그 안에서 사건 A∩B가 일어날 확률이다.`,
        `${PA} = ${PB}이면 ${PBgA} = ${PAgB}이다.`,
        `${PBgA}와 ${PAgB}를 구하는 식의 분자는 모두 ${PAB}이다.`
      ];
      const FALSE = [
        `${PBgA}는 사건 A가 먼저 일어난 뒤에 사건 B가 일어날 확률이다.`,
        `두 조건부확률 ${PBgA}와 ${PAgB}는 항상 같다.`,
        `${PBgA}는 사건 A가 원인이 되어 사건 B가 일어날 확률이다.`
      ];
      const why = '조건부확률 P(B∣A)는 사건 A가 일어났다는 조건 아래에서 B가 일어날 확률로, 사건이 일어나는 시간의 차례나 원인과 결과를 뜻하지 않는다. 또, P(B∣A) = P(A∩B) ÷ P(A), P(A∣B) = P(A∩B) ÷ P(B)이므로 P(A)와 P(B)가 다르면 두 값은 다르다.';
      if (n === 0) {
        const t = d.pick(TRUE), rows = [{ h: t, ok: true }].concat(FALSE.map((h) => ({ h, ok: false })));
        return oneQ(d, `${TWO} 0 &lt; ${PA}, 0 &lt; ${PB}일 때, 조건부확률에 대한 설명으로 옳은 것은?`, rows, true, { explain: why });
      }
      const f = d.pick(FALSE), rows = [{ h: f, ok: false }].concat(TRUE.map((h) => ({ h, ok: true })));
      return oneQ(d, `${TWO} 0 &lt; ${PA}, 0 &lt; ${PB}일 때, 조건부확률에 대한 설명으로 옳지 않은 것은?`, rows, false, { explain: why });
    }, { count: 2 })
  ]);

  // ════════════════════════════════════════════════════════════════
  // ── 확률의 곱셈정리 ──
  // 낱말: end 「꺼낸다」, and 「꺼내고」, will 「꺼낼」, did 「꺼냈을」, now 「꺼내는」
  const PULL = { end: '꺼낸다', and: '꺼내고', will: '꺼낼', did: '꺼냈을', now: '꺼내는' }, DRAW = { end: '뽑는다', and: '뽑고', will: '뽑을', did: '뽑았을', now: '뽑는' };
  const KINDS = [
    { a: '흰 공', b: '검은 공', bag: '주머니', v: PULL },
    { a: '낱말 카드', b: '숫자 카드', bag: '상자', v: DRAW },
    { a: '레몬 맛 사탕', b: '포도 맛 사탕', bag: '봉지', v: PULL },
    { a: '빨간 구슬', b: '파란 구슬', bag: '상자', v: PULL }
  ];
  const twoNames = (d) => d.shuffle(NAMES.slice()).slice(0, 2);
  const NOBACK = '(단, 꺼낸 것은 다시 넣지 않는다.)';

  B.addTypes(UNIT, 'mult', [
    T('mult-draw', '다시 넣지 않고 차례로 두 번 — 확률의 곱셈정리', '①16', (d, n) => {
      const K = d.pick(KINDS), a = d.int(2, 7), b = d.int(2, 7), [p1, p2] = twoNames(d), tot = a + b;
      if (a === b) return null;
      const firstA = d.bool(), secondA = d.bool(), f = firstA ? K.a : K.b, s = secondA ? K.a : K.b;
      const nf = firstA ? a : b, ns = (secondA ? a : b) - (firstA === secondA ? 1 : 0);
      if (ns < 1) return null;
      const lead = `${K.bag}에 ${K.a} ${a}개와 ${K.b} ${b}개가 들어 있다. ${name(p1, '과/와')} ${name(p2, '이/가')} 차례로 이 ${K.bag}에서 임의로 하나씩 ${K.v.end}.`;
      if (n === 0) {
        const ans = Q(nf * ns, tot * (tot - 1));
        return prQ(`${lead} ${name(p1, '이/가')} ${josa(f, '을/를')} ${K.v.and}, ${name(p2, '이/가')} ${josa(s, '을/를')} ${K.v.will} 확률은? ${NOBACK}`, ans, {
          explain: `${name(p1, '이/가')} ${josa(f, '을/를')} ${K.v.now} 사건을 A, ${name(p2, '이/가')} ${josa(s, '을/를')} ${K.v.now} 사건을 B라 하면 ${eqv(PA, Q(nf, tot))}, ${eqv(PBgA, Q(ns, tot - 1))}이다. 따라서 ${PAB} = ${tx(Q(nf, tot))} × ${tx(Q(ns, tot - 1))} = ${tx(ans)}이다.`,
          value: `${nf}/(${a}+${b})*${ns}/(${a}+${b}-1)`, derived: [nf, ns]
        });
      }
      const ans = Q(ns, tot - 1);
      return prQ(`${lead} ${name(p1, '이/가')} ${josa(f, '을/를')} ${K.v.did} 때, ${name(p2, '이/가')} ${josa(s, '을/를')} ${K.v.will} 확률은? ${NOBACK}`, ans, {
        explain: `${name(p1, '이/가')} 하나를 ${K.v.and} 나면 ${K.bag}에는 ${tot - 1}개가 남고, 그 가운데 ${josa(s, '은/는')} ${ns}개이다. 따라서 구하는 조건부확률은 ${frac(ns, tot - 1)}${ans.q !== tot - 1 ? ' = ' + tx(ans) : ''}이다.`,
        value: `${ns}/(${a}+${b}-1)`, derived: [ns]
      });
    }, { count: 2 }),

    T('mult-turns', '번갈아 꺼내 먼저 흰 공을 꺼내는 사람이 이기는 놀이', '①17', (d) => {
      const w = d.int(1, 3), k = d.int(2, 4), [p1, p2] = twoNames(d), askFirst = d.bool(), tot = w + k;
      if (w === k) return null;
      // 차례 i(0부터)에 처음으로 흰 공이 나올 확률: 앞의 i번은 검은 공
      const terms = [];
      for (let i = 0; i <= k; i += 1) {
        const fs = [];
        for (let j = 0; j < i; j += 1) fs.push([k - j, tot - j]);
        if (w !== tot - i) fs.push([w, tot - i]);   // 남은 공이 모두 흰 공이면 그 차례의 확률 1 은 적지 않는다
        terms.push({ i, fs, q: fs.reduce((acc, [p, q]) => qmul(acc, Q(p, q)), one) });
      }
      const mine = terms.filter((t) => t.i % 2 === (askFirst ? 0 : 1)), ans = mine.reduce((acc, t) => qadd(acc, t.q), Q(0));
      if (!inside(ans) || mine.length < 2) return null;
      const who = askFirst ? p1 : p2;
      const expr = mine.map((t) => t.fs.map(([p, q]) => `${p}/${q}`).join('*')).join('+');
      const derived = [...new Set(expr.match(/\d+/g).map(Number))];
      return prQ(`주머니에 흰 공 ${w}개와 검은 공 ${k}개가 들어 있다. ${name(p1, '이/가')} 먼저 시작하여 ${name(p1, '과/와')} ${name(p2, '이/가')} 번갈아 이 주머니에서 공을 하나씩 꺼내고, 흰 공을 먼저 꺼내는 사람이 이긴다. ${name(who, '이/가')} 이길 확률은? ${NOBACK}`, ans, {
        explain: `${name(who, '은/는')} ${mine.map((t) => (t.i + 1) + '번째').join(', ')} 차례에 처음으로 흰 공이 나오면 이긴다. 이 확률은 차례마다 ${mine.map((t) => t.fs.map(([p, q]) => frac(p, q)).join(' × ')).join(', ')}이므로 모두 더하면 ${tx(ans)}이다.`,
        value: expr, derived
      });
    }),

    T('mult-move', '공을 옮긴 뒤 꺼낼 때의 확률', '①19', (d) => {
      const a1 = d.int(1, 5), b1 = d.int(1, 5), a2 = d.int(1, 5), b2 = d.int(1, 5), askW = d.bool();
      if (a1 === b1 && a2 === b2) return null;
      const n1 = a1 + b1, n2 = a2 + b2 + 1, ans = askW ? qadd(qmul(Q(a1, n1), Q(a2 + 1, n2)), qmul(Q(b1, n1), Q(a2, n2))) : qadd(qmul(Q(a1, n1), Q(b2, n2)), qmul(Q(b1, n1), Q(b2 + 1, n2)));
      const col = askW ? '흰 공' : '검은 공';
      const ww = askW ? [a2 + 1, a2] : [b2, b2 + 1];
      return prQ(`주머니 A에는 흰 공 ${a1}개와 검은 공 ${b1}개가, 주머니 B에는 흰 공 ${a2}개와 검은 공 ${b2}개가 들어 있다. 주머니 A에서 임의로 공 한 개를 꺼내 주머니 B에 넣은 다음, 주머니 B에서 임의로 공 한 개를 꺼낼 때, 이 공이 ${col}일 확률은?`, ans, {
        explain: `A에서 흰 공을 옮기면 B에서 ${col}일 확률은 ${frac(ww[0], n2)}, 검은 공을 옮기면 ${frac(ww[1], n2)}이다. 따라서 구하는 확률은 ${frac(a1, n1)} × ${frac(ww[0], n2)} + ${frac(b1, n1)} × ${frac(ww[1], n2)} = ${tx(ans)}이다.`,
        value: `${a1}/(${a1}+${b1})*${ww[0]}/(${a2}+${b2}+1)+${b1}/(${a1}+${b1})*${ww[1]}/(${a2}+${b2}+1)`, derived: [ww[0], ww[1]]
      });
    }),

    T('mult-total', '갈래 둘 — 조건부확률로 전체 확률 구하기', '①20', (d, n) => {
      if (n === 0) {
        const S = d.pick([
          ['어느 농구 선수가 자유투를 두 번 던진다. 첫 번째 자유투를 성공할 확률은', '첫 번째를 성공했을 때 두 번째를 성공할 확률은', '첫 번째를 실패했을 때 두 번째를 실패할 확률은', '이 선수가 두 번째 자유투를 성공할 확률은?', '성공'],
          ['지우가 퀴즈 두 문제를 차례로 푼다. 첫 번째 문제를 맞힐 확률은', '첫 번째를 맞혔을 때 두 번째를 맞힐 확률은', '첫 번째를 틀렸을 때 두 번째를 틀릴 확률은', '지우가 두 번째 문제를 맞힐 확률은?', '맞힘']
        ]);
        const p = d.pick(PROBS), q = d.pick(PROBS), r = d.pick(PROBS), ans = qadd(qmul(p, q), qmul(comp(p), comp(r)));
        if (ans.q > 100 || !inside(ans) || qcmp(q, comp(r)) === 0) return null;   // q = 1 − r 이면 첫 번째 결과와 상관없어 셈이 사라진다
        return prQ(`${S[0]} ${tx(p)}이다. ${S[1]} ${tx(q)}이고, ${S[2]} ${tx(r)}이다. ${S[3]}`, ans, {
          explain: `첫 번째가 실패일 때 두 번째가 ${S[4] === '성공' ? '성공' : '맞힘'}일 확률은 1 ${MINUS} ${tx(r)} = ${tx(comp(r))}이다. 따라서 구하는 확률은 ${tx(p)} × ${tx(q)} + ${tx(comp(p))} × ${tx(comp(r))} = ${tx(ans)}이다.`,
          value: `${jq(p)}*${jq(q)}+(1-${jq(p)})*(1-${jq(r)})`
        });
      }
      if (n === 1) {
        const x = d.pick([100, 150, 200, 250, 300]), y = d.pick([400, 600, 700, 750, 800, 900]), a = d.pick([Q(9, 10), Q(19, 20), Q(4, 5), Q(17, 20), Q(7, 10)]), b = d.pick([Q(9, 10), Q(4, 5), Q(17, 20), Q(19, 20), Q(7, 10)]);
        const pA = Q(x, x + y), ans = qadd(qmul(pA, a), qmul(comp(pA), comp(b)));
        if (ans.q > 1000) return null;
        return prQ(`어느 진단 시약은 질병에 걸린 사람을 걸렸다고 진단할 확률이 ${tx(a)}이고, 질병에 걸리지 않은 사람을 걸리지 않았다고 진단할 확률이 ${tx(b)}이다. 질병에 걸린 사람 ${x}명과 걸리지 않은 사람 ${y}명 가운데 임의로 한 명을 뽑아 이 시약을 쓸 때, 질병에 걸렸다고 진단할 확률은?`, ans, {
          explain: `걸린 사람일 확률은 ${frac(x, x + y)}${pA.q !== x + y ? ' = ' + tx(pA) : ''}이다. 걸리지 않은 사람을 걸렸다고 진단할 확률은 1 ${MINUS} ${tx(b)} = ${tx(comp(b))}이므로 구하는 확률은 ${tx(pA)} × ${tx(a)} + ${tx(comp(pA))} × ${tx(comp(b))} = ${tx(ans)}이다.`,
          value: `${x}/(${x}+${y})*${jq(a)}+${y}/(${x}+${y})*(1-${jq(b)})`
        });
      }
      // 수형도의 빈칸에 알맞은 기호
      const fig = treeFig([[40, 84, 122, 52, 'P(A)', 66, 54], [40, 84, 122, 120, 'P(➊)', 66, 126], [150, 48, 232, 30, 'P(➋)', 182, 26], [150, 56, 232, 76, 'P(B^C ∣ A)', 196, 90]],
        [[2, 89, '검사'], [128, 58, 'A'], [128, 126, 'A^C'], [238, 35, 'B'], [238, 83, 'B^C']],
        '수형도: 처음에서 A로 가는 가지에 P(A), A^C로 가는 가지에 P(➊)이 적혀 있다. A에서 B로 가는 가지에 P(➋), B^C로 가는 가지에 P(B^C ∣ A)가 적혀 있다.');
      const RIGHT = 'A^C|B∣A', opts = [['A^C', 'B∣A'], ['A^C', 'A∣B'], ['B', 'B∣A'], ['A^C', 'B'], ['B^C', 'A∣B']];
      const rows = opts.map(([u, v]) => ({ h: `➊ ${ev(u)}, ➋ ${ev(v)}`, ok: u + '|' + v === RIGHT }));
      return oneQ(d, '어느 검사는 1차 검사에서 양성이 나온 사람만 2차 검사를 하고, 1차 검사에서 음성이 나온 사람은 음성으로 본다. 1차 검사에서 양성이 나오는 사건을 A, 2차 검사에서 양성이 나오는 사건을 B라 할 때, 다음은 각 경우의 확률을 나타낸 수형도이다. ➊, ➋에 알맞은 것을 차례로 나열한 것은?', rows, true, {
        figure: fig, explain: `처음에서 갈라지는 두 가지는 A와 그 여사건이므로 ➊은 ${ev('A^C')}이다. A에서 B로 가는 가지의 확률은 A가 일어났을 때 B가 일어날 확률이므로 ➋는 ${ev('B∣A')}이다.`
      });
    }, { count: 3 }),

    T('mult-three', '갈래 셋 — 전체 확률 구하기', '①21', (d, n) => {
      if (n === 0) {
        // 상자 셋 가운데 하나를 골라 구슬 2개를 꺼낼 때 흰 구슬이 적어도 하나 나올 확률
        const boxes = Array.from({ length: 3 }, () => { const t = d.int(2, 4), w = d.int(0, t); return { t, w }; });
        const pAt = (b) => Q(comb(b.t, 2) - comb(b.t - b.w, 2), comb(b.t, 2));
        const each = boxes.map(pAt), ans = each.reduce((acc, q) => qadd(acc, qmul(Q(1, 3), q)), Q(0));
        if (!inside(ans) || new Set(boxes.map((b) => b.t + ':' + b.w)).size < 3 || each.filter((q) => inside(q)).length < 1) return null;
        const desc = (b) => (b.w === 0 ? `파란 구슬 ${b.t}개` : b.w === b.t ? `흰 구슬 ${b.t}개` : `흰 구슬 ${b.w}개와 파란 구슬 ${b.t - b.w}개`);
        const expr = each.map((q) => `1/3*${jq(q)}`).join('+');
        return prQ(`상자 A에는 ${desc(boxes[0])}, 상자 B에는 ${desc(boxes[1])}, 상자 C에는 ${desc(boxes[2])}가 들어 있다. 세 상자 가운데 하나를 임의로 골라 그 상자에서 구슬 2개를 동시에 꺼낼 때, 흰 구슬이 적어도 한 개 나올 확률은?`, ans, {
          explain: `상자를 고를 확률은 저마다 ${frac(1, 3)}이다. 고른 상자에서 흰 구슬이 적어도 한 개 나올 확률은 A, B, C에서 차례로 ${each.map((q) => tx(q)).join(', ')}이다(1에서 파란 구슬만 2개 나올 확률을 뺀다). 따라서 구하는 확률은 ${frac(1, 3)} × (${each.map((q) => tx(q)).join(' + ')}) = ${tx(ans)}이다.`,
          value: expr, derived: [3, ...each.flatMap((q) => [q.p, q.q])]
        });
      }
      const sizes = [d.pick([20, 30, 40]), d.pick([20, 30, 40, 50]), d.pick([20, 30, 40])], rates = [d.pick([Q(1, 5), Q(1, 4), Q(3, 10), Q(2, 5)]), d.pick([Q(1, 10), Q(1, 5), Q(3, 10), Q(1, 2)]), d.pick([Q(2, 5), Q(1, 2), Q(3, 5), Q(1, 4)])];
      if (sizes.some((s, i) => (s * rates[i].p) % rates[i].q !== 0)) return null;
      const tot = sizes[0] + sizes[1] + sizes[2], likes = sizes.map((s, i) => (s * rates[i].p) / rates[i].q), ans = Q(likes[0] + likes[1] + likes[2], tot);
      return prQ(`어느 고등학교 1학년 학생의 ${tx(rates[0])}, 2학년 학생의 ${tx(rates[1])}, 3학년 학생의 ${tj(rates[2], '이/가')} 수학을 좋아한다. 이 학교 1학년 ${sizes[0]}명, 2학년 ${sizes[1]}명, 3학년 ${sizes[2]}명 가운데 임의로 한 명을 뽑을 때, 이 학생이 수학을 좋아할 확률은?`, ans, {
        explain: `학년마다 수학을 좋아하는 학생은 ${likes.join('명, ')}명이다. 확률로 적으면 ${sizes.map((s, i) => `${frac(s, tot)} × ${tx(rates[i])}`).join(' + ')} = ${tx(ans)}이다.`,
        value: `(${sizes.map((s, i) => `${s}*${jq(rates[i])}`).join('+')})/(${sizes.join('+')})`
      });
    }, { count: 2 }),

    T('mult-bayes', '결과를 보고 원인 쪽일 확률 구하기', '①22', (d, n) => {
      if (n === 0) {
        const S = d.pick([['귤', '오렌지', '과일'], ['흰 공', '검은 공', '공'], ['딸기 맛 사탕', '사과 맛 사탕', '사탕']]);
        const x1 = d.int(1, 6), y1 = d.int(1, 6), x2 = d.int(1, 6), y2 = d.int(1, 6), askB = d.bool();
        const n1 = x1 + y1, n2 = x2 + y2, top = qmul(Q(1, 2), Q(askB ? x2 : x1, askB ? n2 : n1)), all = qadd(qmul(Q(1, 2), Q(x1, n1)), qmul(Q(1, 2), Q(x2, n2))), ans = qdiv(top, all);
        if (!inside(ans) || x1 * n2 === x2 * n1) return null;
        const box = askB ? 'B' : 'A';
        return prQ(`상자 A에는 ${S[0]} ${x1}개와 ${S[1]} ${y1}개가, 상자 B에는 ${S[0]} ${x2}개와 ${S[1]} ${y2}개가 들어 있다. 두 상자 가운데 하나를 임의로 골라 그 상자에서 ${S[2]} 한 개를 꺼냈더니 ${S[0]}이었다. 이 ${josa(S[0], '이/가')} 상자 ${box}에서 나왔을 확률은?`, ans, {
          explain: `상자 A를 고르고 ${josa(S[0], '을/를')} 꺼낼 확률은 ${frac(1, 2)} × ${frac(x1, n1)}, 상자 B를 고르고 꺼낼 확률은 ${frac(1, 2)} × ${frac(x2, n2)}이다. ${josa(S[0], '이/가')} 나올 확률은 그 합 ${tx(all)}이므로 구하는 확률은 ${tx(top)} ÷ ${tx(all)} = ${tx(ans)}이다.`,
          value: `(1/2*${askB ? x2 : x1}/(${askB ? `${x2}+${y2}` : `${x1}+${y1}`}))/(1/2*${x1}/(${x1}+${y1})+1/2*${x2}/(${x2}+${y2}))`, derived: [2]
        });
      }
      const a = d.pick([60, 70, 75, 80, 85, 90]), b = d.pick([80, 85, 90, 95]);
      const top = Q(a * b, 10000), all = Q(a * b + (100 - a) * (100 - b), 10000), ans = qdiv(top, all);
      return prQ(`어느 도시에서 밤에 지나가는 차량의 ${a} %는 자가용이고 나머지는 영업용이다. 이 도시의 시민이 밤에 지나가는 차량의 종류를 바르게 알아볼 확률은 ${b} %이다. 이 도시의 한 시민이 밤에 지나가는 차량을 자가용으로 알아보았을 때, 이 차량이 실제로 자가용일 확률은?`, ans, {
        explain: `자가용을 자가용으로 알아볼 확률은 ${tx(Q(a, 100))} × ${tx(Q(b, 100))}, 영업용을 자가용으로 잘못 알아볼 확률은 ${tx(Q(100 - a, 100))} × ${tx(Q(100 - b, 100))}이다. 따라서 구하는 확률은 ${tx(top)} ÷ ${tx(all)} = ${tx(ans)}이다.`,
        value: `(${a}/100*${b}/100)/(${a}/100*${b}/100+(100-${a})/100*(100-${b})/100)`, derived: [100]
      });
    }, { count: 2 }),

    T('mult-comb', '동시에 꺼낸 결과의 조건부확률 — 조건 사건을 세어', '①24', (d, n) => {
      if (n === 0) {
        const Nn = d.pick([12, 18, 20, 24, 30]), cards = Array.from({ length: Nn }, (_, i) => i + 1).filter((x) => Nn % x === 0), k = d.pick([2, 3, 4, 6]);
        const pairs = [];
        for (let i = 0; i < cards.length; i += 1) for (let j = i + 1; j < cards.length; j += 1) pairs.push([cards[i], cards[j]]);
        if (cards.length > 8) return null;
        const A = pairs.filter(([s]) => k % s === 0), AB = A.filter(([s, t]) => isPrime(s) || isPrime(t));
        if (A.length < 3 || AB.length < 1 || AB.length === A.length) return null;
        const ans = Q(AB.length, A.length);
        return prQ(`${Nn}의 약수가 하나씩 적힌 카드 ${cards.length}장이 들어 있는 상자에서 임의로 카드 2장을 동시에 꺼낸다. 꺼낸 두 카드에 적힌 수 가운데 작은 수가 ${k}의 약수일 때, 두 수 가운데 적어도 하나가 소수일 확률은?`, ans, {
          explain: `작은 수가 ${k}의 약수인 경우는 ${A.map(([s, t]) => nb(`(${s}, ${t})`)).join(', ')}의 ${A.length}가지이고, 그 가운데 소수가 있는 경우는 ${AB.length}가지이다. 따라서 구하는 확률은 ${frac(AB.length, A.length)}${ans.q !== A.length ? ' = ' + tx(ans) : ''}이다.`,
          value: `${AB.length}/${A.length}`, derived: [AB.length, A.length]
        });
      }
      if (n === 1) {
        const W = d.int(3, 6), K = d.int(3, 6), r = 3, c = d.pick([1, 2]), t = d.int(1, 2);
        const ok = (m, k) => c * m >= k;
        let nA = 0, nAB = 0; const parts = [];
        for (let m = 0; m <= r; m += 1) { const k = r - m; if (m > W || k > K || !ok(m, k)) continue; const v = comb(W, m) * comb(K, k); nA += v; parts.push([m, k, v]); if (k === t) nAB += v; }
        if (nAB < 1 || nAB === nA || parts.length < 2) return null;
        const ans = Q(nAB, nA), cond = c === 1 ? `${V('m')} ≥ ${V('n')}` : `2${V('m')} ≥ ${V('n')}`;
        return prQ(`흰 공 ${W}개와 검은 공 ${K}개가 들어 있는 주머니에서 임의로 공 ${r}개를 동시에 꺼낼 때, 꺼낸 흰 공과 검은 공의 개수를 각각 ${V('m')}, ${V('n')}이라 하자. ${nb(cond)}일 때, ${nb(V('n') + ' = ' + t)}일 확률은?`, ans, {
          explain: `${nb(cond)}인 경우는 ${parts.map(([m, k, v]) => nb(`${V('m')} = ${m}, ${V('n')} = ${k}`) + `(${v}가지)`).join(', ')}이고 모두 ${nA}가지이다. 그 가운데 ${nb(V('n') + ' = ' + t)}인 경우는 ${nAB}가지이므로 구하는 확률은 ${frac(nAB, nA)}${ans.q !== nA ? ' = ' + tx(ans) : ''}이다.`,
          value: `${nAB}/${nA}`, derived: [nAB, nA], rule: 'mn' + c
        });
      }
      const a = d.int(8, 15), b = d.int(8, 15), d1 = d.int(1, 4), d2 = d.int(1, 4), askA = d.bool();
      if (d1 === d2) return null;
      const ans = Q(askA ? d1 : d2, d1 + d2), co = askA ? 'A' : 'B';
      return prQ(`두 회사 A, B의 제품을 조사하였더니 A 회사 제품 ${a}개 가운데 ${d1}개, B 회사 제품 ${b}개 가운데 ${d2}개가 불량품이었다. 조사한 제품 ${a + b}개 가운데 임의로 3개를 택하였더니 불량품이 1개 들어 있었을 때, 이 불량품이 ${co} 회사 제품일 확률은?`, ans, {
        explain: `불량품 1개와 정상품 2개를 고르는 경우의 수는 ${nb(nC(d1 + d2, 1) + ' × ' + nC(a + b - d1 - d2, 2))}이고, 그 가운데 불량품이 ${co} 회사 것인 경우의 수는 ${nb(nC(askA ? d1 : d2, 1) + ' × ' + nC(a + b - d1 - d2, 2))}이다. 정상품을 고르는 경우의 수가 약분되므로 구하는 확률은 ${frac(askA ? d1 : d2, d1 + d2)}${ans.q !== d1 + d2 ? ' = ' + tx(ans) : ''}이다.`,
        value: `${askA ? d1 : d2}/(${d1}+${d2})`
      });
    }, { count: 3 }),

    T('mult-atleast', '조건 사건이 「적어도 하나」 — 여사건으로 세어 조건부확률', '①25', (d) => {
      const w = d.int(1, 3), k = d.int(1, 2), g = d.int(3, 6), tot = w + k + g;
      const all = comb(tot, 2), nA = all - comb(g, 2), nAB = all - comb(tot - k, 2), ans = Q(nAB, nA);
      if (!inside(ans)) return null;
      return prQ(`흰 공 ${w}개, 검은 공 ${k}개, 회색 공 ${g}개가 들어 있는 주머니에서 임의로 공 2개를 동시에 꺼내, 흰 공 또는 검은 공이 적어도 한 개 나오면 당첨이다. 은호가 이 추첨에서 당첨되었을 때, 검은 공이 나왔을 확률은?`, ans, {
        explain: `당첨되지 않는 것은 회색 공만 2개 나올 때이므로 당첨되는 경우의 수는 ${nC(tot, 2)} ${MINUS} ${nC(g, 2)} = ${nA}이다. 검은 공이 적어도 한 개 나오는 경우의 수는 ${nC(tot, 2)} ${MINUS} ${nC(tot - k, 2)} = ${nAB}이고 이때는 늘 당첨이다. 따라서 구하는 확률은 ${frac(nAB, nA)}${ans.q !== nA ? ' = ' + tx(ans) : ''}이다.`,
        value: `${nAB}/${nA}`, derived: [nAB, nA]
      });
    })
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
