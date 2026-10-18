// 중학교 3학년 2학기 5단원 산포도 — 뒤쪽 묶음(분산과 표준편차의 뜻, 두 자료의 분포 비교, 평균·분산의 조건과 바꾼 자료).
// 단원 틀과 도구, 싣는 기준, 뺀 것과 까닭은 9-2-5a.js 에 있다. ref: ①n = 기본꼴_1의 n번, 심n = 심화꼴의 n번.
// 「변량에 같은 수를 더하거나 곱한 자료의 평균·분산」은 이 단원에서 배우는 내용이라 한 번 바꾸는 것(더하기 ①65, 곱하고 더하기 심15, 거꾸로 한 번 ①66)은 기본 묶음에 두었다.
// 묻는 말: 수나 값은 「~은?/~는?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, nick, NAMES, lines, N, M, C } = B.kit;
  const { MINUS, range, Q, V, sup, nb, rt, claimQ } = B.kit.mid;
  const K = B.kit.m925;
  const { UNIT, T, sum, ssOf, varOf, isSq, devs, fx, sgn, amt, vtext, sdText, sqSum, told, js, varExpr, stripH, seal, dataFig, tbl, dotFig, pickClaim } = K;

  // ═══ 분산과 표준편차의 뜻 ═══
  const YES = [
    '편차는 각 변량에서 평균을 뺀 값이다.', '편차의 합은 항상 0이다.', '평균보다 큰 변량의 편차는 양수이다.', '평균보다 작은 변량의 편차는 음수이다.',
    '편차의 절댓값이 클수록 그 변량은 평균에서 멀리 떨어져 있다.', '분산은 편차를 제곱한 값의 평균이다.', '표준편차는 분산의 음이 아닌 제곱근이다.',
    '분산이 작을수록 변량들이 평균을 중심으로 모여 있다.', '표준편차의 단위는 변량의 단위와 같다.', '산포도는 변량들이 흩어져 있는 정도를 하나의 수로 나타낸 값이다.',
    '변량이 모두 같으면 표준편차는 0이다.'
  ];
  // [틀린 문장, 바로잡은 말, 함께 싣지 않을 옳은 문장]
  const NO = [
    ['편차는 평균에서 각 변량을 뺀 값이다.', '편차는 각 변량에서 평균을 뺀 값이다.', '편차는 각 변량에서 평균을 뺀 값이다.'],
    ['편차의 합은 변량의 개수와 같다.', '편차의 합은 항상 0이다.', '편차의 합은 항상 0이다.'],
    ['평균보다 작은 변량의 편차는 양수이다.', '평균보다 작은 변량의 편차는 음수이다.', '평균보다 작은 변량의 편차는 음수이다.'],
    ['분산은 편차의 평균이다.', '분산은 편차를 제곱한 값의 평균이다. 편차의 평균은 늘 0이다.', '분산은 편차를 제곱한 값의 평균이다.'],
    ['분산이 클수록 변량들이 평균을 중심으로 모여 있다.', '분산이 클수록 변량들이 평균에서 멀리 흩어져 있다.', '분산이 작을수록 변량들이 평균을 중심으로 모여 있다.'],
    ['변량들이 평균 가까이에 모여 있을수록 산포도는 커진다.', '변량들이 평균 가까이에 모여 있을수록 산포도는 작아진다.', '분산이 작을수록 변량들이 평균을 중심으로 모여 있다.'],
    // 소2-02 보기 ④를 바로잡은 것: 평균에서 떨어진 정도는 편차의 절댓값으로 본다.
    ['편차가 작을수록 그 변량은 평균에 가까이 있다.', '편차가 −10인 변량은 편차가 1인 변량보다 평균에서 멀다. 평균에서 떨어진 정도는 편차의 절댓값으로 본다.', '편차의 절댓값이 클수록 그 변량은 평균에서 멀리 떨어져 있다.'],
    ['표준편차의 단위는 변량의 단위를 제곱한 것이다.', '표준편차의 단위는 변량의 단위와 같다.', '표준편차의 단위는 변량의 단위와 같다.'],
    ['표준편차는 분산을 2로 나눈 값이다.', '표준편차는 분산의 음이 아닌 제곱근이다.', '표준편차는 분산의 음이 아닌 제곱근이다.'],
    ['변량이 모두 같으면 표준편차는 1이다.', '변량이 모두 같으면 편차가 모두 0이므로 분산과 표준편차는 0이다.', '변량이 모두 같으면 표준편차는 0이다.']
  ];
  const KOR = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ'];
  // 보기 ㄱ~ㄹ 가운데 옳은 것을 모두 고른 것(답이 아닌 조합 넷과 함께 낸다)
  function allTrue(d, text, yes, no, nTrue) {
    const bad = d.shuffle(no).slice(0, 4 - nTrue), clash = bad.map((r) => r[2]);
    const good = d.shuffle(yes.filter((s) => !clash.includes(s))).slice(0, nTrue);
    const rows = d.shuffle(good.map((s) => [s, true]).concat(bad.map((r) => [r[0], false, r[1]])));
    const right = rows.map((r, i) => (r[1] ? KOR[i] : null)).filter(Boolean).join(', ');
    const combos = [];
    for (let mask = 1; mask < 15; mask += 1) combos.push(range(0, 3).filter((i) => mask & (1 << i)).map((i) => KOR[i]).join(', '));
    const opts = d.shuffle([right].concat(d.shuffle(combos.filter((c) => c !== right)).slice(0, 4)));
    return C(text, opts, opts.indexOf(right), {
      figure: lines(rows.map((r, i) => `${KOR[i]}. ${r[0]}`)),
      explain: `옳은 것은 ${right}이다. ` + rows.map((r, i) => (r[1] ? '' : `${KOR[i]}: ${r[2]}`)).filter(Boolean).join(' '),
      facts: { truth: opts.map((o) => o === right), want: true }
    });
  }

  const MEAN = [
    T('mean-claims', '편차·분산·표준편차의 뜻', '①51', (d, n) => (n === 0
      ? claimQ(d, '편차, 분산, 표준편차에 대한 설명으로 옳지 않은 것은?', YES, NO, false)
      : allTrue(d, '보기에서 편차, 분산, 표준편차에 대한 설명으로 옳은 것을 모두 고른 것은?', YES, NO, d.pick([2, 2, 3]))), { count: 2 }),
    T('mean-one-data', '한 자료의 평균·분산·표준편차·편차에 대한 설명 가리기', '①52', (d) => {
      const n = d.pick([8, 10]), m = d.int(7, 10), dv = devs(d, n, 3, (a) => { const s = ssOf(a); return s % n === 0 && s / n >= 2 && s / n <= 9; }), list = dv.map((e) => m + e);
      const ss = ssOf(dv), v = ss / n, sdT = sdText(Q(v)), wantTrue = d.bool();
      const rows = [
        [`평균은 ${m}이다.`, `평균은 ${m + 1}이다.`, `평균은 ${sum(list)} ÷ ${n} = ${m}이다.`],
        [`분산은 ${v}이다.`, `분산은 ${ss}이다.`, `분산은 편차의 제곱의 합 ${josa(ss, '을/를')} 변량의 개수 ${josa(n, '으로/로')} 나눈 ${v}이다.`],
        [`표준편차는 ${sdT}이다.`, `표준편차는 ${v}이다.`, `표준편차는 분산의 음이 아닌 제곱근이므로 ${rt(v)}${isSq(v) ? ' = ' + Math.sqrt(v) : sdT === rt(v) ? '' : ' = ' + sdT}이다.`],
        ['편차의 총합은 0이다.', `편차의 총합은 ${n}이다.`, '편차의 총합은 항상 0이다.'],
        [`편차의 제곱의 합은 ${ss}이다.`, `편차의 제곱의 합은 ${v}이다.`, `편차는 차례로 ${dv.map(sgn).join(', ')}이므로 편차의 제곱의 합은 ${ss}이다.`]
      ];
      return pickClaim(d, `다음 자료에 대한 설명으로 ${wantTrue ? '옳은' : '옳지 않은'} 것은?`, rows, wantTrue, { figure: dataFig(list, '') });
    }),
    T('mean-table-even', '평균·표준편차 표에서 가장 고른 것 고르기', '①53', (d) => {
      // 평균이 가장 높은 것은 답이 아니다(평균으로 고르면 틀린다).
      const c = d.pick([
        { lead: '다음은 학생 5명의 10회에 걸친 수학 성적의 평균과 표준편차를 나타낸 표이다.', who: '학생', unit: '점', base: [80, 95], ask: ['성적이 가장 고른 학생은?', '성적이 가장 고르지 않은 학생은?'] },
        { lead: '다음은 다섯 반의 과학 성적의 평균과 표준편차를 나타낸 표이다.', who: '반', unit: '점', base: [68, 78], ask: ['성적이 가장 고른 반은?', '성적이 평균을 중심으로 가장 흩어져 있는 반은?'] },
        { lead: '다음은 학생 5명의 일주일 동안의 수면 시간의 평균과 표준편차를 나타낸 표이다.', who: '학생', unit: '시간', base: [6, 9], ask: ['수면 시간이 가장 규칙적인 학생은?', '수면 시간이 가장 불규칙적인 학생은?'] }
      ]);
      const small = d.bool(), names = ['A', 'B', 'C', 'D', 'E'];
      const [means, sds] = d.until(() => [names.map(() => d.int(c.base[0], c.base[1])), names.map(() => d.int(3, 30) / 10)], ([ms, ss]) => {
        if (new Set(ss).size !== 5) return false;
        const at = ss.indexOf(small ? Math.min(...ss) : Math.max(...ss)), top = ms.indexOf(Math.max(...ms));
        return ms.filter((x) => x === Math.max(...ms)).length === 1 && top !== at;
      });
      const at = sds.indexOf(small ? Math.min(...sds) : Math.max(...sds)), label = (s) => (c.who === '반' ? s + '반' : s);
      return C(`${c.lead} ${c.ask[small ? 0 : 1]}`, names.map(label), at, {
        figure: tbl([c.who].concat(names), [[`평균(${c.unit})`].concat(means), [`표준편차(${c.unit})`].concat(sds.map(fx))], { tight: true }),
        explain: `표준편차가 작을수록 평균을 중심으로 모여 있어 고르고, 클수록 흩어져 있다. 평균의 크기와는 상관이 없다. 표준편차가 가장 ${small ? '작은' : '큰'} 것은 ${label(names[at])}(${fx(sds[at])})이다.`,
        facts: { choose: { exprs: sds.map(fx), rule: small ? 'min' : 'max' } }
      });
    }),
    T('mean-two-claims', '평균이 같은 두 반의 표준편차로 우수함·고름 판단하기', '①54', (d) => {
      // 표준편차의 짝: 하나는 근호가 있어 제곱(분산)으로 견주어야 한다. [분산 A, 분산 B]
      const pair = d.shuffle(d.pick([[18, 16], [12, 9], [10, 9], [3, 5], [8, 9], [15, 16], [27, 25], [20, 16], [7, 8], [24, 25]]));
      const [vA, vB] = pair, m = d.int(65, 85), tight = vA < vB ? 'A' : 'B', loose = tight === 'A' ? 'B' : 'A', wantTrue = d.bool();
      const rows = [
        [`A반의 분산이 B반의 분산보다 ${vA > vB ? '크다' : '작다'}.`, `A반의 분산이 B반의 분산보다 ${vA > vB ? '작다' : '크다'}.`, `분산은 표준편차의 제곱이므로 A반은 ${vA}, B반은 ${vB}이다.`],
        ['어느 반의 성적이 더 우수하다고 말할 수 없다.', `${loose}반의 성적이 ${tight}반의 성적보다 우수하다.`, '두 반의 평균이 같으므로 어느 반이 더 우수하다고 말할 수 없다.'],
        [`${tight}반의 성적이 ${loose}반의 성적보다 고르다.`, `${loose}반의 성적이 ${tight}반의 성적보다 고르다.`, `분산이 작은 ${tight}반의 성적이 더 고르다.`],
        [`${tight}반의 점수가 평균 가까이에 더 모여 있다.`, `${loose}반의 점수가 평균 가까이에 더 모여 있다.`, `표준편차가 작은 ${tight}반의 점수가 평균 가까이에 더 모여 있다.`],
        ['두 반의 편차의 합은 같다.', `편차의 합은 ${loose}반이 더 크다.`, '편차의 합은 두 반 모두 0이다.']
      ];
      return pickClaim(d, `다음은 두 반 A, B의 수학 성적의 평균과 표준편차를 나타낸 표이다. 이 표에 대한 설명으로 ${wantTrue ? '옳은' : '옳지 않은'} 것은?`, rows, wantTrue, {
        figure: tbl(['반', 'A', 'B'], [['평균(점)', m, m], ['표준편차(점)', sdText(Q(vA)), sdText(Q(vB))]])
      });
    }),
    T('mean-two-sums', '학생 수가 같은 두 반의 편차의 합·편차의 제곱의 합', '①55', (d) => {
      const n = d.pick([20, 25, 30, 40]), m = d.int(65, 85), [sA, sB] = d.until(() => [d.int(2, 6), d.int(2, 6)], ([x, y]) => x !== y), wantTrue = d.pick([false, false, true]);
      const tight = sA < sB ? 'A' : 'B', loose = tight === 'A' ? 'B' : 'A', ssA = n * sA * sA;
      const rows = [
        ['두 반의 점수의 총합은 같다.', `${loose}반의 점수의 총합이 ${tight}반보다 크다.`, `평균과 학생 수가 같으므로 점수의 총합은 두 반 모두 ${m} × ${n} = ${m * n}(점)이다.`],
        [`두 반 전체의 평균은 ${m}점이다.`, `두 반 전체의 평균은 ${m}점보다 크다.`, `두 반의 점수의 총합 ${m * n * 2}점을 ${n * 2}명으로 나누면 ${m}점이다.`],
        ['두 반의 편차의 합은 같다.', `편차의 합은 ${loose}반이 ${tight}반보다 크다.`, '편차의 합은 두 반 모두 0이다.'],
        [`A반의 편차의 제곱의 합은 ${ssA}이다.`, `A반의 편차의 제곱의 합은 ${n * sA}이다.`, `(편차의 제곱의 합) = (분산) × (학생 수)이므로 A반은 ${sA}${sup(2)} × ${n} = ${ssA}이다.`],
        [`${tight}반의 점수가 ${loose}반의 점수보다 고르다.`, `${loose}반의 점수가 ${tight}반의 점수보다 고르다.`, `표준편차가 작은 ${tight}반의 점수가 더 고르다.`],
        [`편차의 제곱의 합은 ${loose}반이 ${tight}반보다 크다.`, `편차의 제곱의 합은 ${tight}반이 ${loose}반보다 크다.`, `학생 수가 같으므로 분산이 큰 ${loose}반의 편차의 제곱의 합이 더 크다.`]
      ];
      return pickClaim(d, `A반과 B반의 학생은 각각 ${n}명이고, 어느 시험에서 두 반의 수학 점수의 평균은 모두 ${m}점, 표준편차는 A반이 ${sA}점, B반이 ${sB}점이었다. 다음 중 ${wantTrue ? '옳은' : '옳지 않은'} 것은?`, rows, wantTrue);
    })
  ];

  // ═══ 두 자료의 분포 비교 ═══
  const CMP = [
    T('cmp-two', '두 자료의 분산을 구하여 더 고른 쪽 정하기', '①56', (d) => {
      const c = d.pick([
        { lead: (n) => `두 버스 A, B에 탄 승객 ${n}명씩에게 버스를 기다린 시간을 조사하였다.`, unit: '분', name: (s) => s + ' 버스', ask: '기다린 시간이 더 고른 버스', base: [4, 9], k: 4, ns: [5, 7] },
        { lead: (n) => `두 양궁 선수 A, B가 화살을 ${n}발씩 쏘아 얻은 점수를 조사하였다.`, unit: '점', name: (s) => '선수 ' + s, ask: '점수가 더 고른 선수', base: [7, 8], k: 2, ns: [6, 7] },
        { lead: (n) => `두 상자 A, B에 담긴 사과 ${n}개씩의 무게를 조사하였다.`, unit: 'g', name: (s) => s + ' 상자', ask: '사과의 무게가 더 고른 상자', base: [190, 230], k: 8, ns: [5] },
        { lead: (n) => `두 단체 A, B가 ${n}일 동안 모집한 후원자의 수를 조사하였다.`, unit: '명', name: (s) => s + ' 단체', ask: '날마다 모집한 후원자의 수가 더 고른 단체', base: [8, 12], k: 4, ns: [5, 6] }
      ]);
      const n = d.pick(c.ns), m = d.int(c.base[0], c.base[1]);
      const da = devs(d, n, c.k, (a) => a.some((v) => v !== 0)), db = devs(d, n, c.k, (b) => { const x = ssOf(da), y = ssOf(b); return x !== y && Math.abs(x - y) * 4 <= Math.max(x, y) * 3; });
      const A = da.map((e) => m + e), Bv = db.map((e) => m + e), vA = varOf(A), vB = varOf(Bv), win = ssOf(da) < ssOf(db) ? 'A' : 'B';
      const opts = d.shuffle([['A', vA], ['A', vB], ['B', vA], ['B', vB]]), text = (o) => `${c.name(o[0])}, 분산 ${vtext(o[1])}`;
      const right = opts.findIndex((o) => o[0] === win && o[1] === (win === 'A' ? vA : vB));
      return C(`${c.lead(n)} ${c.ask}와 그 분산을 바르게 짝지은 것은?`, opts.map(text), right, {
        figure: `<div style="display:grid;gap:3px;max-width:100%"><div style="text-align:right;font-size:0.88rem;color:#52606d">(단위: ${c.unit})</div>${tbl(null, [['A'].concat(A), ['B'].concat(Bv)], { tight: true })}</div>`,
        explain: `두 자료의 평균은 모두 ${amt(m, c.unit)}이다. A의 분산은 (${sqSum(da)}) ÷ ${n} = ${vtext(vA)}, B의 분산은 (${sqSum(db)}) ÷ ${n} = ${vtext(vB)}이다. 분산이 작을수록 고르므로 답은 ${c.name(win)}이고 그 분산은 ${vtext(win === 'A' ? vA : vB)}이다.`,
        facts: { truth: opts.map((_, i) => i === right), want: true }
      });
    }),
    T('cmp-least', '여러 자료의 표준편차를 구하여 가장 작은(큰) 것 고르기', '①56 ①57', (d) => {
      // 네 사람의 점수는 평균이 모두 같고 분산이 모두 다르다.
      const small = d.bool(), m = d.int(6, 9), names = ['A', 'B', 'C', 'D'];
      const sets = d.until(() => names.map(() => devs(d, 5, 5, (a) => a.some((v) => v !== 0))), (all) => new Set(all.map(ssOf)).size === 4).map((dv) => dv.map((e) => m + e));
      const vs = sets.map((l) => ssOf(l.map((x) => x - m)) / 5), at = vs.indexOf(small ? Math.min(...vs) : Math.max(...vs));
      return seal(C(`다음은 네 사람 A, B, C, D가 공 던지기를 5번씩 하여 얻은 점수이다. 네 사람의 점수의 평균은 모두 ${m}점이다. 점수의 표준편차가 가장 ${small ? '작은' : '큰'} 사람은?`, names, at, {
        figure: lines(sets.map((l, i) => `<strong>${names[i]}</strong> &nbsp; ${l.join(', ')}`)),
        explain: `평균이 ${m}점이므로 네 사람의 분산은 차례로 ${vs.map(fx).join(', ')}이다. 분산이 ${small ? '작을' : '클'}수록 표준편차도 ${small ? '작으므로' : '크므로'} 답은 ${names[at]}이다.`,
        facts: { choose: { exprs: sets.map((l) => varExpr(l)), rule: small ? 'min' : 'max' } }
      }));
    }),
    T('cmp-graph-talk', '점 그래프 셋과 대화에서 잘못 말한 것 찾기', '①58', (d) => {
      const items = d.pick([['색상', '가격', '반응 속도'], ['맛', '양', '가격'], ['화질', '음질', '무게']]), m = d.int(5, 6), names = ['A', 'B', 'C', 'D', 'E'];
      // 세 항목의 분산은 모두 정수이고 서로 다르다. 한 항목은 반쯤 변량이 모두 같다(표준편차 0).
      const flat = d.bool();
      const dvs = d.until(() => items.map((_, i) => (flat && i === 1 ? [0, 0, 0, 0, 0] : devs(d, 5, 4, (a) => ssOf(a) % 5 === 0 && a.some((v) => v !== 0)))), (all) => new Set(all.map(ssOf)).size === 3);
      const data = dvs.map((dv) => dv.map((e) => m + e)), vs = dvs.map((dv) => ssOf(dv) / 5), big = vs.indexOf(Math.max(...vs)), low = vs.indexOf(Math.min(...vs));
      const say = (i) => `${items[i]}의 만족도`, sdT = (v) => (v === 0 ? '0' : sdText(Q(v)));
      const pool = [
        ['그래프만 보고도 세 항목 가운데 표준편차가 가장 큰 것을 찾을 수 있다.', null, '점들이 평균의 점선에서 가장 멀리 흩어진 항목의 표준편차가 가장 크다.'],
        [`${say(big)}의 분산은 ${vs[big]}이다.`, `${say(low)}의 분산은 ${vs[big]}이다.`, `분산이 ${vs[big]}인 것은 ${say(big)}이다.`],
        [`${say(low)}의 표준편차는 ${sdT(vs[low])}점이다.`, `${say(big)}의 표준편차는 ${sdT(vs[low])}점이다.`, `${say(low)}의 분산은 ${vs[low]}이므로 표준편차는 ${sdT(vs[low])}점이다.`],
        [`${say(low)}가 가장 고르다.`, `${say(big)}가 가장 고르다.`, `분산이 가장 작은 ${say(low)}가 가장 고르다.`]
      ];
      const who = d.shuffle(NAMES).slice(0, 3).map(nick), rows = d.shuffle(pool).slice(0, 3);
      const wrongAt = d.until(() => d.int(0, 2), (i) => rows[i][1] !== null);
      const said = rows.map((r, i) => (i === wrongAt ? r[1] : r[0]));
      const fig = (i) => dotFig(data[i], { names, lo: 0, hi: 10, step: 1, major: 2, mean: m, title: items[i], xname: '고객', yname: '만족도(점)', yunit: '점', xunit: '고객', h: 150 });
      return C(`다음 그래프는 어느 제품의 ${items.join(', ')}에 대하여 고객 5명의 만족도를 각각 점으로 나타낸 것이다. 세 항목의 만족도의 평균은 모두 ${m}점이다. 그래프를 보고 나눈 대화에서 잘못 말한 학생은?`, who, wrongAt, {
        figure: lines([fig(0), fig(1), fig(2)].concat(said.map((s, i) => `<strong>${who[i]}</strong>: ${s}`))),
        explain: `세 항목의 분산은 차례로 ${vs.join(', ')}이다. ${who[wrongAt]}의 말이 틀렸다. ${rows[wrongAt][2]}`,
        facts: { truth: said.map((_, i) => i !== wrongAt), want: false }
      });
    })
  ];

  // ═══ 평균·분산의 조건과 바꾼 자료 ═══
  const LET = ['a', 'b', 'c', 'd', 'e'];
  const letters = (k) => LET.slice(0, k).map(V).join(', ');
  const shifted = (k, f) => LET.slice(0, k).map((L) => nb(f(V(L)))).join(', ');
  const COND = [
    T('cond-sumsq', '평균과 분산으로 두 변량의 제곱의 합 구하기', '①60', (d) => {
      const n = d.pick([4, 5]), m = d.int(3, 8);
      const dv = devs(d, n, Math.min(4, m - 1), (a) => { const s = ssOf(a); return (s * 10) % n === 0 && a.some((v) => v !== 0); });
      const list = dv.map((e) => m + e), [i, j] = d.shuffle(range(0, n - 1)).slice(0, 2).sort((x, y) => x - y), v = ssOf(dv) / n;
      const known = list.filter((_, t) => t !== i && t !== j), a = list[i], b = list[j], shown = list.map((x, t) => (t === i ? V('a') : t === j ? V('b') : String(x)));
      const sumE = `${n}*${m}-(${known.join('+')})`;
      return seal(N(`자료 ${shown.join(', ')}의 평균이 ${m}, 분산이 ${fx(v)}일 때, ${nb(`${V('a')}${sup(2)} + ${V('b')}${sup(2)}`)}의 값은?`, a * a + b * b, {
        explain: `평균이 ${m}이므로 ${V('a')} + ${V('b')} = ${n} × ${m} − ${sum(known)} = ${a + b}이다. 분산이 ${fx(v)}이므로 편차의 제곱의 합은 ${fx(v * n)}이고, ${known.map((x) => `(${x} − ${m})${sup(2)}`).join(' + ')} + (${V('a')} − ${m})${sup(2)} + (${V('b')} − ${m})${sup(2)} = ${fx(v * n)}이다. 펼치면 ${nb(`${V('a')}${sup(2)} + ${V('b')}${sup(2)}`)} − ${2 * m}(${V('a')} + ${V('b')}) + ${2 * m * m} = ${fx(v * n - ssOf(known.map((x) => x - m)))}이므로 ${nb(`${V('a')}${sup(2)} + ${V('b')}${sup(2)}`)} = ${a * a + b * b}이다.`,
        facts: { calc: [[`${n}*${fx(v)}-(${known.map((x) => `(${x}-${m})**2`).join('+')})+2*${m}*(${sumE})-2*${m}*${m}`, 0]] }
      }));
    }),
    T('cond-shift', '모든 변량에 같은 수를 더한(뺀) 자료의 평균과 분산', '①65', (d) => {
      const k = d.pick([3, 4, 5]), m = d.int(6, 15), h = d.until(() => d.int(1, 9) * d.pick([-1, 1]), (x) => m + x >= 1), t = d.pick([2, 3, 5, 6, 7, 4, 9, 16]), sd = isSq(t) ? String(Math.sqrt(t)) : rt(t);
      const f = (x) => (h < 0 ? `${x} ${MINUS} ${-h}` : `${x} + ${h}`);
      return seal(M(`자료 ${letters(k)}의 평균이 ${m}, 표준편차가 ${sd}일 때, 자료 ${shifted(k, f)}의 평균과 분산을 각각 구하시오.`, [{ label: '평균', answer: m + h, signed: true }, { label: '분산', answer: t }], {
        explain: `모든 변량${h < 0 ? `에서 ${josa(-h, '을/를')} 빼면` : `에 ${josa(h, '을/를')} 더하면`} 평균도 ${Math.abs(h)}만큼 ${h < 0 ? '줄어' : '늘어'} ${m + h}이다. 각 변량의 편차는 그대로이므로 분산도 그대로 ${isSq(t) ? sd : '(' + sd + ')'}${sup(2)} = ${t}이다.`,
        facts: { calc: [[h < 0 ? `${m}-${-h}` : `${m}+${h}`, 0], [isSq(t) ? `${Math.sqrt(t)}*${Math.sqrt(t)}` : String(t), 1]] }
      }));
    }),
    T('cond-scale', '몇 배 하고 같은 수를 더한 자료의 평균과 표준편차', '심15', (d) => {
      const p = d.int(2, 5), q = d.int(1, 9) * d.pick([-1, 1]), m = d.int(8, 60), s = d.int(2, 9);
      const f = (x) => `${p}${x} ${q < 0 ? MINUS : '+'} ${Math.abs(q)}`;
      return seal(M(`변량 ${letters(5)}의 평균이 ${m}, 표준편차가 ${s}일 때, 변량 ${shifted(5, f)}의 평균과 표준편차를 각각 구하시오.`, [{ label: '평균', answer: p * m + q, signed: true }, { label: '표준편차', answer: p * s }], {
        explain: `각 변량을 ${p}배 하고 ${Math.abs(q)}만큼 ${q < 0 ? '빼면' : '더하면'} 평균은 ${p} × ${m} ${q < 0 ? MINUS : '+'} ${Math.abs(q)} = ${p * m + q}이다. 편차는 모두 ${p}배가 되고 ${q < 0 ? '뺀' : '더한'} 수는 편차에 남지 않으므로 분산은 ${p}${sup(2)} = ${p * p}배, 표준편차는 ${p}배인 ${p} × ${s} = ${p * s}이다.`,
        facts: { calc: [[q < 0 ? `${p}*${m}-${-q}` : `${p}*${m}+${q}`, 0], [`${p}*${s}`, 1]] }
      }));
    }),
    T('cond-back', '바꾼 자료의 표준편차로 원래 자료의 표준편차 구하기', '①66', (d) => {
      const p = d.int(2, 5), q = d.int(1, 9) * d.pick([-1, 1]), m = d.int(6, 30), s = d.int(2, 7), S = p * s;
      const f = (x) => `${p}${x} ${q < 0 ? MINUS : '+'} ${Math.abs(q)}`;
      return seal(M(`자료 ${letters(5)}의 평균은 ${m}이고, 자료 ${shifted(5, f)}의 표준편차는 ${S}이다. 자료 ${shifted(5, f)}의 평균과 자료 ${letters(5)}의 표준편차를 각각 구하시오.`, [{ label: '평균', answer: p * m + q, signed: true }, { label: '표준편차', answer: s }], {
        explain: `${shifted(1, f)}, …의 평균은 ${p} × ${m} ${q < 0 ? MINUS : '+'} ${Math.abs(q)} = ${p * m + q}이다. 각 변량을 ${p}배 하면 표준편차도 ${p}배가 되고 ${q < 0 ? '뺀' : '더한'} 수는 표준편차를 바꾸지 않으므로 ${V('a')}, ${V('b')}, …의 표준편차는 ${S} ÷ ${p} = ${s}이다.`,
        facts: { calc: [[q < 0 ? `${p}*${m}-${-q}` : `${p}*${m}+${q}`, 0], [`${S}/${p}`, 1]] }
      }));
    })
  ];

  B.addTypes(UNIT, 'mean', MEAN);
  B.addTypes(UNIT, 'cmp', CMP);
  B.addTypes(UNIT, 'cond', COND);
})(typeof window !== 'undefined' ? window : globalThis);
