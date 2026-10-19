// 고등학교 1학년 공통수학1 Ⅳ-1 행렬과 그 연산 — 단원 틀·도구와 앞쪽 묶음(행렬의 뜻, 두 행렬이 서로 같을 조건,
// 행렬의 덧셈·뺄셈·실수배, 덧셈·뺄셈·실수배와 등식, 덧셈·뺄셈·실수배의 활용).
// 수집해 둔 천재 T셀파 공통수학1 두 종(홍진곤, 전인태 — 2022 개정)의 교과서·평가 자료에서 뽑은 문제 꼴 목록(기본꼴_1: ①1~①46, 기본꼴_2: ②47~②71 —
// 기본꼴_2 는 기본꼴_1 에 이어 쓴 것이라 번호가 이어진다. 심화 문서는 없다)을 꼴마다 따져서 실었다.
// 꼴마다 「실음(유형 이름) / 바꿈 / 겹침 / 뺌(까닭)」을 가른 대조표는 references/textbooks/수학/_분석/10-1-8/싣기_대조표.md 에 있다.
// (행렬의 곱셈, 단위행렬·거듭제곱과 섞인 계산, 곱셈이 낀 등식, 곱셈의 활용은 10-1-8b.js 에, 실력 문항은 10-1-8c.js 에 있다.)
// 영역은 공통수학1의 행렬. 성취기준은 10공수1-04-01(행렬의 뜻을 알고, 실생활 상황을 행렬로 표현할 수 있다),
// 10공수1-04-02(행렬의 연산을 수행하고, 관련된 문제를 해결할 수 있다)이다.
//
// 싣는 기준
//  - 하는 일이 다르면 다른 문제다: 주는 것(행렬·성분의 식 a_ij·표·그림·등식), 묻는 것(성분·행렬·미지수·고르기·빈칸), 계산의 꼴(덧셈·뺄셈·실수배·곱의 꼴)이
//    다르면 따로 싣는다. 수만 다른 것은 한 번만 싣는다. 계산 문항은 구조가 다를 때만 따로 싣고 facts.rule 에 이름을 단다.
//  - 교육과정(2022 원문): 행렬의 덧셈, 뺄셈, 실수배 및 곱셈을 다루고, 곱셈은 행과 열의 수가 각각 2를 넘지 않는 범위에서만 한다.
//    덧셈·뺄셈·실수배에는 크기 제한이 없으므로 3×3, 3×2 행렬도 쓴다. 대수적 구조의 성질을 일반화한 법칙(문자로 증명)은 다루지 않는다.
//    「지나치게 복잡한 연산 문제는 다루지 않는다」는 까닭으로 수집본의 꼴을 빼지 않고, 그런 꼴은 실력에 실었다(과제 글).
//  - 답: 답이 행렬이면 행렬 모양의 틀 안에 성분마다 칸을 둔다(inline). 음수가 될 수 있는 칸에는 모두 부호 단추를 단다.
//    개수·0과 1로 적는 성분·「양수」라고 정한 미지수만 단추 없이 받는다. 한 유형 안에서는 씨앗이 바뀌어도 칸의 모양이 같다.
//    답이 행렬일 때 성분이 분수가 되지 않게 수를 고른다(분수 성분 칸은 칸 모양이 답을 흘린다). 분수인 값 하나는 분수 칸(F)으로 받는다.
//    원문의 「모든 성분의 합」「a + b의 값」「xyz의 값」처럼 따로 구한 값을 뜻 없이 더하거나 곱하는 꼴은 행렬이나 값을 칸마다 따로 받는다.
//    성분 하나하나가 정해지지 않고 합만 정해지는 것(근과 계수의 관계로 셈하는 대칭식, 두 경우가 나오는 x² + y²)은 원문대로 합을 묻는다.
//  - 행렬은 이 파일의 mat 으로 짓는다(소괄호 둘 사이에 성분을 칸 맞춰 놓는다. 괄호는 글줄 높이에 맞춰 늘어나는 작은 그림이다).
//    행렬 바로 뒤에는 토씨를 붙이지 않는다(「…)에 대하여」「…)의」만 쓴다 — 읽을 때 토씨가 무엇에 붙는지 흐려진다).
//  - 답은 모두 코드가 셈한다. 꼴 목록에 적힌 원문 답은 따르지 않는다.
//
// 뺀 것과 까닭(10-1-8b.js, 10-1-8c.js 의 것까지 여기에 모아 적는다. 꼴마다의 판정은 대조표에 있다)
//  - 교육과정이 못 박은 것: 행이나 열이 3인 행렬의 곱셈(①36의 3×1·1×3 변형, ②70 — 원문 「행과 열의 수가 각각 2를 넘지 않는 범위에서 곱셈」).
//    정의되는 곱 가리기에 2×3·3×2 행렬이 낀 것(①32의 전중10, ①33)은 행렬의 크기를 2 이하로 바꾸어 실었다.
//  - 서술형 전용: 연산의 성질을 셈으로 「확인하시오」(②71 — 양변을 셈하는 일은 덧셈·실수배·단위행렬 유형과 같다), 행과 열이 나타내는 것 설명(①10의 일부 → 고르기로).
//  - 겹침: 행렬 카드놀이(②67 — 곱이 정의되는 차례를 가려 곱을 셈하는 일은 mul-defined·mul-*), √3A(①20의 변형 — 실수배와 같은 일),
//    영수증으로 만든 2×1 행렬(②63의 변형 — life-calc 와 같은 일), 근과 계수의 관계로 AB 의 성분 합(②68의 홍중12 — pow-alpha 와 같은 일),
//    세트 메뉴 4×3 가격표(①28의 변형 — 두 표의 차), A + B·A − B 로 구한 두 행렬의 A² − B²(①26의 변형 홍소3-4 — addeq-sys 와 pow-mixed 를 잇는 일).
//  - 수를 바꾼 것: 원문대로면 답이 늘 같은 ①34(행렬의 수), ②57(행렬), ②58(식의 계수와 성분 규칙). 금액·개수는 답 칸 한도(네 자리) 안으로 줄였다.
//  - 공학 도구로만 셈하는 것: 인구 이동에서 「100만 명을 넘는 해」(②65의 끝 — 1년 뒤 인구까지만 실었다).
// 묻는 말: 수나 값은 「~은?/~는?」, 시키는 말은 「~하시오.」
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, name, NAMES, box, frac, lines, table, N, M, C, F, inline } = B.kit;
  const { MINUS, gcd, Q, tx, nb, tail, tj, V, sup, nz, poly, ansV, sys } = B.kit.mid;
  const S1 = '10공수1-04-01', S2 = '10공수1-04-02', UNIT = '10-1-8';
  const sourceOf = (ref) => '수집본 기본 자료(' + ref + ')';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: sourceOf(ref), make }, more || {});

  // ── 수 ──
  const sn = (n) => (n < 0 ? MINUS + Math.abs(n) : String(n));               // 화면에 적는 수
  const pn = (n) => (n < 0 ? '(' + sn(n) + ')' : sn(n));                       // 식 속의 수(음수는 괄호)
  const jn = (n) => (n < 0 ? '(' + n + ')' : String(n));                       // 검사 식에 적는 수
  const nj = (n, pair) => sn(n) + tail(Math.abs(n), pair);                    // 수 뒤의 토씨(크기의 끝소리)
  const range = (lo, hi) => Array.from({ length: hi - lo + 1 }, (_, i) => lo + i);
  const nzs = (d, lo, hi, n) => Array.from({ length: n }, () => nz(d, lo, hi));
  // 계수를 붙인 문자: 1 은 적지 않고 −1 은 −만
  const cf = (k, h) => (k === 1 ? h : k === -1 ? MINUS + h : sn(k) + h);

  // ── 문자와 토씨 ──
  // 문자 이름의 끝소리: 엘·엠·엔·알만 받침이 있다. 위첨자(거듭제곱) 뒤는 「제곱」이라 받침이 있다.
  const hasB = (letter) => 'lmnrLMNR'.includes(letter);
  function pj(letter, pair) {
    if (!pair.includes('/')) return pair;
    const [w, wo] = pair.split('/');
    if (pair === '으로/로') return hasB(letter) && !'lL'.includes(letter) ? '으로' : '로';
    return hasB(letter) ? w : wo;
  }
  const Vj = (name, pair) => V(name) + pj(name[name.length - 1], pair);      // 행렬 이름·문자 + 토씨
  const SQ = (pair) => pair.split('/')[0];                                     // 거듭제곱 뒤의 토씨
  const sub = (i, j) => '<sub>' + i + (j == null ? '' : j) + '</sub>';
  const aij = (nm) => V(nm || 'a') + '<sub>' + V('i') + V('j') + '</sub>';    // a_ij
  const ent2 = (nm, i, j) => V(nm || 'a') + sub(i, j);                         // a_12
  const ej = (nm, i, j, pair) => ent2(nm, i, j) + tail(j, pair);               // a_21은(첨자의 끝 숫자로 읽는다)
  const IJ = `(${V('i')}, ${V('j')})`;

  // ── 행렬 ──
  // 성분: 수(정수·소수), 유리수 { p, q }, 글(문자가 든 식).
  const ent = (v) => (typeof v === 'number' ? sn(v) : v && typeof v === 'object' && 'p' in v ? tx(v) : String(v));
  // 글줄 높이에 맞춰 늘어나는 소괄호(작은 그림). 글로 옮길 때는 사라진다.
  const PAR = (side) => `<svg class="mb-inline" aria-hidden="true" viewBox="0 0 6 40" preserveAspectRatio="none" style="width:6px;height:auto;align-self:stretch;flex:none;overflow:visible"><path d="${side === 'l' ? 'M5.2 1.2C0.8 9 0.8 31 5.2 38.8' : 'M0.8 1.2C5.2 9 5.2 31 0.8 38.8'}" style="fill:none;stroke:currentColor;stroke-width:1.3;vector-effect:non-scaling-stroke"/></svg>`;
  const gridOf = (cells, cols, cg, rg, pad) => `<span style="display:inline-grid;grid-template-columns:repeat(${cols},auto);column-gap:${cg};row-gap:${rg};align-items:center;justify-items:center;padding:${pad}">${cells.join(' ')}</span>`;
  // 행렬: rows 는 성분의 2차 배열. 성분 사이에 빈칸을 넣어 글로 옮겨도 수가 붙지 않게 한다.
  function mat(rows) {
    const cells = rows.flat().map((v) => '<span data-e style="white-space:nowrap">' + ent(v) + '</span>');
    return `<span class="mb-mat" data-m="${rows.length}x${rows[0].length}" style="display:inline-flex;align-items:stretch;vertical-align:middle;line-height:1.3;white-space:nowrap">${PAR('l')}${gridOf(cells, rows[0].length, '0.8em', '0.06em', '0.08em 0.28em')}${PAR('r')}</span>`;
  }
  // 답 칸을 넣는 행렬 틀: rows 는 '{0}' 따위의 2차 배열
  function matSlots(rows) {
    const cells = rows.flat().map((s) => '<span data-e>' + s + '</span>');
    return `<span class="mb-mat" data-m="${rows.length}x${rows[0].length}" style="display:inline-flex;align-items:stretch;vertical-align:middle;line-height:1.2">${PAR('l')}${gridOf(cells, rows[0].length, '6px', '6px', '4px 3px')}${PAR('r')}</span>`;
  }
  // 이름을 붙인 행렬 A = (…)
  const nm = (n, rows) => `<span style="white-space:nowrap">${V(n)} = ${mat(rows)}</span>`;
  // 그림 자리에 놓는 식들(그림 자리는 줄을 바꾸어 늘어놓는다)
  const FIG = 'font-size:1.12rem;line-height:1.7';
  const show = (...parts) => parts.map((h) => `<span style="${FIG}">${h}</span>`).join('');
  const rowsOf = (list) => lines(list.map((h) => `<span style="${FIG}">${h}</span>`));
  // 이름을 위에 적은 표(표의 머리 칸은 줄을 바꾸지 않으니 짧게 두고, 긴 이름은 표 위에 적는다)
  const capt = (title, tbl) => `<div><div style="font-size:0.95rem;font-weight:600;margin-bottom:4px">${title}</div>${tbl}</div>`;

  // ── 행렬의 셈(정수) ──
  const madd = (A, Bm) => A.map((r, i) => r.map((v, j) => v + Bm[i][j]));
  const msub = (A, Bm) => A.map((r, i) => r.map((v, j) => v - Bm[i][j]));
  const msc = (k, A) => A.map((r) => r.map((v) => k * v));
  const mmul = (A, Bm) => A.map((r) => Bm[0].map((_, j) => r.reduce((s, v, k) => s + v * Bm[k][j], 0)));
  const same = (A, Bm) => A.length === Bm.length && A[0].length === Bm[0].length && A.every((r, i) => r.every((v, j) => v === Bm[i][j]));
  const EYE = [[1, 0], [0, 1]];
  const maxAbs = (A) => Math.max(...A.flat().map((v) => Math.abs(v)));
  // 검사 식: 칸마다 같은 꼴의 2차 배열
  const cAdd = (A, Bm, op) => A.map((r, i) => r.map((v, j) => `${jn(v)}${op || '+'}${jn(Bm[i][j])}`));
  const cMul = (A, Bm) => A.map((r) => Bm[0].map((_, j) => r.map((v, k) => `${jn(v)}*${jn(Bm[k][j])}`).join('+')));
  const cOf = (A) => A.map((r) => r.map(jn));
  // 수 고르기: r×c 행렬, 성분은 lo~hi(zeroOK 가 아니면 0이 아닌 수)
  const rm = (d, r, c, lo, hi, zeroOK) => Array.from({ length: r }, () => Array.from({ length: c }, () => (zeroOK ? d.int(lo, hi) : nz(d, lo, hi))));

  // ── 문항 도구 ──
  // 검사 식 끝에 +0 을 붙인다: 음수와 0의 곱은 자바스크립트에서 −0 이 되어 0 인 답과 엄격히 견주면 어긋난다.
  const z0 = (e) => '(' + e + ')+0';
  // 답이 행렬인 문항: 성분마다 칸(행렬 모양의 틀 안). calc 는 칸마다의 검사 식(2차 배열). 칸에는 부호 단추를 단다(signed: false 이면 뺀다).
  function matQ(text, lead, ans, o) {
    const opt = o || {}; let k = 0;
    const slots = ans.map((row) => row.map(() => '{' + (k++) + '}'));
    const inputs = ans.flat().map((v) => (opt.signed === false ? { answer: v } : { answer: v, signed: true }));
    const facts = Object.assign({}, opt.calc ? { calc: opt.calc.flat().map((e, i) => [z0(e), i]), unseen: [0].concat(opt.unseen || []) } : opt.unseen ? { unseen: opt.unseen } : {}, opt.rule ? { rule: opt.rule } : {}, opt.check ? { check: opt.check } : {});
    const head = lead ? nb(lead + ' =') + ' ' : '';
    return inline(text, head + matSlots(slots), inputs, { shown: head + mat(ans), figure: opt.figure, explain: opt.explain, facts });
  }
  // 수 여러 칸(문자 이름표). rows: [이름표, 답, 검사 식(없으면 null), 부호 단추(기본 true)]
  function vals(text, rows, o) {
    const opt = o || {}, calc = rows.map(([, , e], i) => [e && z0(e), i]).filter(([e]) => e);
    return M(text, rows.map(([label, answer, , s]) => Object.assign({ label, answer }, s === false ? {} : { signed: true })), {
      figure: opt.figure, explain: opt.explain, unordered: opt.unordered,
      facts: Object.assign(calc.length ? { calc, unseen: [0].concat(opt.unseen || []) } : opt.unseen ? { unseen: opt.unseen } : {}, opt.rule ? { rule: opt.rule } : {}, opt.check ? { check: opt.check } : {})
    });
  }
  const eqL = (v) => V(v) + ' =';
  // 수 하나(부호 단추)
  const num1 = (text, answer, o) => N(text, answer, { signed: o.signed !== false, figure: o.figure, explain: o.explain, facts: Object.assign(o.calc ? { calc: [[z0(o.calc), 0]], unseen: [0].concat(o.unseen || []) } : o.unseen ? { unseen: o.unseen } : {}, o.rule ? { rule: o.rule } : {}, o.check ? { check: o.check } : {}) });
  // 고르기: rows 는 [보기 글, 맞는가]. 맞는 것이 꼭 하나여야 한다.
  function pickOne(d, text, rows, o) {
    const shuffled = d.shuffle(rows), at = shuffled.findIndex((r) => r[1]);
    if (shuffled.filter((r) => r[1]).length !== 1) throw new Error('맞는 보기가 하나가 아니다');
    if (new Set(shuffled.map((r) => String(r[0]).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim())).size !== shuffled.length) throw new Error('보기가 겹친다');
    return C(text, shuffled.map((r) => r[0]), at, { figure: o.figure, explain: o.explain, facts: Object.assign({ truth: shuffled.map((r) => r[1]), want: true }, o.rule ? { rule: o.rule } : {}) });
  }
  const UNIT_E = ' (단, ' + Vj('E', '은/는') + ' 단위행렬이다.)';
  const UNIT_O = ' (단, ' + Vj('O', '은/는') + ' 영행렬이다.)';

  // ════════════════════════════════════════════════════════════════
  // ── 행렬의 뜻 ──
  const RULES = [
    { h: () => `2${V('i')}`, f: (i) => 2 * i, s: (i) => `2*${i}` },
    { h: () => poly([[1, V('i')], [1, V('j')]]), f: (i, j) => i + j, s: (i, j) => `${i}+${j}` },
    { h: () => `2${V('i')}${V('j')}`, f: (i, j) => 2 * i * j, s: (i, j) => `2*${i}*${j}` },
    { h: () => poly([[1, V('i') + sup(2)], [-2, V('j')]]), f: (i, j) => i * i - 2 * j, s: (i, j) => `${i}*${i}-2*${j}` },
    { h: () => `${V('i')}${V('j')}`, f: (i, j) => i * j, s: (i, j) => `${i}*${j}` },
    { h: () => poly([[1, V('i')], [-1, V('j')]]), f: (i, j) => i - j, s: (i, j) => `${i}-${j}` },
    { h: () => poly([[3, V('i')], [-1, V('j')]]), f: (i, j) => 3 * i - j, s: (i, j) => `3*${i}-${j}` },
    { h: () => poly([[1, V('i')], [2, V('j')]]), f: (i, j) => i + 2 * j, s: (i, j) => `${i}+2*${j}` },
    { h: () => poly([[1, V('j') + sup(2)], [-1, V('i')]]), f: (i, j) => j * j - i, s: (i, j) => `${j}*${j}-${i}` }
  ];
  const meaningTypes = [
    T('mean-size', '행과 열의 개수', '①1', (d) => {
      const [m, n] = d.pick([[1, 3], [1, 4], [2, 1], [2, 3], [2, 4], [3, 1], [3, 2], [3, 3], [4, 1], [4, 2], [3, 4]]);
      const A = rm(d, m, n, -9, 9, true);
      return M(`다음 행렬이 ${V('m')}×${V('n')} 행렬일 때, ${V('m')}, ${V('n')}의 값은?`, [{ label: eqL('m'), answer: m }, { label: eqL('n'), answer: n }], {
        figure: show(mat(A)), explain: `가로줄인 행이 ${m}개, 세로줄인 열이 ${n}개이므로 ${V('m')} = ${m}, ${V('n')} = ${n}이다.`, facts: { check: { shape: [m, n] } }
      });
    }),
    T('mean-entry', '(i, j) 성분과 열 읽기', '①2', (d, n) => {
      if (n === 0) {
        const [r, c] = d.pick([[3, 3], [2, 3], [3, 2]]), A = rm(d, r, c, -9, 9, true), i = d.int(1, r), j = d.int(1, c);
        return num1(`행렬 ${Vj('A', '의')} (${i}, ${j}) 성분은?`, A[i - 1][j - 1], {
          figure: show(nm('A', A)), calc: jn(A[i - 1][j - 1]), rule: 'entry-one',
          explain: `제${i}행과 제${j}열이 만나는 자리의 성분이므로 ${sn(A[i - 1][j - 1])}이다.`
        });
      }
      if (n === 1) {
        // a_ij 기호로 두 성분 읽기(원문의 「a12 + a14 + a23」은 성분을 칸마다 묻는다)
        const [r, c] = d.pick([[3, 3], [2, 4]]), A = rm(d, r, c, -9, 9, true);
        const cells = range(1, r).flatMap((i) => range(1, c).map((j) => [i, j])).filter(([i, j]) => i !== j);
        const [p, q] = d.shuffle(cells).slice(0, 2).sort((x, y) => x[0] - y[0] || x[1] - y[1]);
        return vals(`행렬 ${Vj('A', '의')} ${IJ} 성분을 ${aij()}라 할 때, ${ent2('a', p[0], p[1])}, ${ent2('a', q[0], q[1])}의 값은?`,
          [[ent2('a', p[0], p[1]) + ' =', A[p[0] - 1][p[1] - 1], jn(A[p[0] - 1][p[1] - 1])], [ent2('a', q[0], q[1]) + ' =', A[q[0] - 1][q[1] - 1], jn(A[q[0] - 1][q[1] - 1])]], {
          figure: show(nm('A', A)), rule: 'entry-aij',
          explain: `${ej('a', p[0], p[1], '은/는')} 제${p[0]}행과 제${p[1]}열이 만나는 자리의 성분 ${sn(A[p[0] - 1][p[1] - 1])}, ${ej('a', q[0], q[1], '은/는')} 제${q[0]}행과 제${q[1]}열이 만나는 자리의 성분 ${sn(A[q[0] - 1][q[1] - 1])}이다.`
        });
      }
      const r = 3, c = d.pick([2, 3]), A = rm(d, r, c, -9, 9, true), j = d.int(1, c), col = A.map((row) => [row[j - 1]]);
      return matQ(`행렬 ${Vj('A', '의')} 제${j}열을 구하시오.`, null, col, {
        figure: show(nm('A', A)), calc: cOf(col), rule: 'entry-col',
        explain: `열은 세로줄이다. 왼쪽에서 ${j}번째 세로줄의 성분을 위에서부터 차례로 적으면 ${mat(col)}이다.`
      });
    }, { count: 3 }),
    T('mean-where', '수가 놓인 자리 말하기', '①3', (d) => {
      const A = d.until(() => rm(d, 2, 3, -9, 9, true), (X) => new Set(X.flat()).size === 6);
      const i = d.int(1, 2), j = d.int(1, 3), v = A[i - 1][j - 1];
      return M(`행렬 ${V('A')}에서 ${nj(v, '은/는')} 제몇 행 제몇 열의 성분인가?`, [{ lead: '제', answer: i, unit: '행' }, { lead: '제', answer: j, unit: '열' }], {
        figure: show(nm('A', A)), explain: `${nj(v, '은/는')} 위에서 ${i}번째 가로줄(제${i}행)과 왼쪽에서 ${j}번째 세로줄(제${j}열)이 만나는 자리에 있다.`,
        facts: { check: { at: [i, j] } }
      });
    }),
    T('mean-rowsum', '한 행·한 열의 성분의 합', '①4', (d) => {
      const [r, c] = d.pick([[2, 3], [3, 3], [3, 2]]), A = rm(d, r, c, -9, 9, true), i = d.int(1, r), j = d.int(1, c);
      const row = A[i - 1], col = A.map((x) => x[j - 1]);
      return vals(`행렬 ${Vj('A', '의')} 제${i}행의 모든 성분의 합과 제${j}열의 모든 성분의 합은?`, [[`제${i}행의 합`, row.reduce((s, v) => s + v, 0), row.map(jn).join('+')], [`제${j}열의 합`, col.reduce((s, v) => s + v, 0), col.map(jn).join('+')]], {
        figure: show(nm('A', A)),
        explain: `제${i}행은 ${mat([row])}이므로 그 합은 ${row.map(pn).join(' + ')} = ${sn(row.reduce((s, v) => s + v, 0))}, 제${j}열은 ${mat(col.map((v) => [v]))}이므로 그 합은 ${col.map(pn).join(' + ')} = ${sn(col.reduce((s, v) => s + v, 0))}이다.`
      });
    }),
    T('mean-sumcond', '행·열의 합 조건으로 미지수 구하기', '①5', (d, n) => {
      const X = V('x'), Y = V('y');
      if (n === 0) {
        // (a, x + b, cx + d / x², x + e, f): 제1행의 합 = 제2열의 합 → (c − 1)x = e − a − d
        const [x, a, b, dd, c, f] = d.until(() => [nz(d, -6, 6), nz(d, -9, 9), nz(d, -6, 6), nz(d, -9, 9), d.pick([2, 3]), nz(d, -9, 9)], ([xx, aa, , d2, cc]) => { const e = xx * (cc - 1) + aa + d2; return e !== 0 && Math.abs(e) <= 15; });
        const e = x * (c - 1) + a + dd;
        const A = [[a, poly([[1, X], [b, '']]), poly([[c, X], [dd, '']])], [X + sup(2), poly([[1, X], [e, '']]), f]];
        return num1(`다음 행렬의 제1행의 모든 성분의 합과 제2열의 모든 성분의 합이 같을 때, 실수 ${Vj('x', '의')} 값은?`, x, {
          figure: show(mat(A)), calc: `(${jn(e)}-${jn(a)}-${jn(dd)})/(${c}-1)`, unseen: [1], rule: 'row-col',
          explain: `제1행의 합은 ${nb(`${sn(a)} + (${poly([[1, X], [b, '']])}) + (${poly([[c, X], [dd, '']])})`)}, 제2열의 합은 ${nb(`(${poly([[1, X], [b, '']])}) + (${poly([[1, X], [e, '']])})`)}이다. 두 식이 같으므로 ${nb(`${poly([[c, X], [a + dd, '']])}`)} = ${nb(`${poly([[1, X], [e, '']])}`)}, ${X} = ${sn(x)}이다.`
        });
      }
      // (x + py, x − py / x + qy, ux − wy): 제1행의 합 2x, 제2행의 합 (1 + u)x + (q − w)y → (2, 1) 성분
      const [x, y, p, q, u, w] = d.until(() => [nz(d, -5, 5), nz(d, -5, 5), d.int(1, 3), d.int(1, 3), d.int(1, 3), d.int(1, 2)], ([, , , qq, , ww]) => qq !== ww);
      const S1v = 2 * x, S2v = (1 + u) * x + (q - w) * y, ans = x + q * y;
      const A = [[poly([[1, X], [p, Y]]), poly([[1, X], [-p, Y]])], [poly([[1, X], [q, Y]]), poly([[u, X], [-w, Y]])]];
      return num1(`행렬 ${Vj('A', '의')} 제1행의 모든 성분의 합이 ${sn(S1v)}이고, 제2행의 모든 성분의 합이 ${sn(S2v)}일 때, 행렬 ${Vj('A', '의')} (2, 1) 성분은? (단, ${X}, ${Vj('y', '은/는')} 실수이다.)`, ans, {
        figure: show(nm('A', A)), calc: `${jn(S1v)}/2+${q}*((${jn(S2v)}-(1+${u})*${jn(S1v)}/2)/(${q}-${w}))`, unseen: [1, 2], rule: 'two-rows',
        explain: `제1행의 합은 ${nb(`2${X}`)} = ${nb(`${sn(S1v)}`)}이므로 ${X} = ${sn(x)}, 제2행의 합은 ${nb(poly([[1 + u, X], [q - w, Y]]) + ' = ' + sn(S2v))}이므로 ${Y} = ${sn(y)}이다. (2, 1) 성분은 ${nb(poly([[1, X], [q, Y]]) + ' = ' + sn(ans))}이다.`
      });
    }, { count: 2 }),
    T('mean-rule', 'a_ij 식으로 행렬 만들기', '①6', (d) => {
      const [r, c] = d.pick([[2, 2], [3, 2]]);
      const kind = d.pick(['lin', 'prod', 'sq']);
      const [p, q, k] = [nz(d, -3, 3), nz(d, -3, 3), d.int(-5, 5)];
      const f = kind === 'lin' ? (i, j) => p * i + q * j + k : kind === 'prod' ? (i, j) => p * i * j + k : (i, j) => p * i * i + q * j + k;
      const s = kind === 'lin' ? (i, j) => `${jn(p)}*${i}+${jn(q)}*${j}+${jn(k)}` : kind === 'prod' ? (i, j) => `${jn(p)}*${i}*${j}+${jn(k)}` : (i, j) => `${jn(p)}*${i}*${i}+${jn(q)}*${j}+${jn(k)}`;
      const h = kind === 'lin' ? poly([[p, V('i')], [q, V('j')], [k, '']]) : kind === 'prod' ? poly([[p, V('i') + V('j')], [k, '']]) : poly([[p, V('i') + sup(2)], [q, V('j')], [k, '']]);
      const A = range(1, r).map((i) => range(1, c).map((j) => f(i, j))), calc = range(1, r).map((i) => range(1, c).map((j) => s(i, j)));
      return matQ(`${r}×${c} 행렬 ${Vj('A', '의')} ${IJ} 성분 ${aij()}가 ${nb(`${aij()} = ${h}`)}일 때, 행렬 ${Vj('A', '을/를')} 구하시오.`, V('A'), A, {
        calc, unseen: [0, 1, 2, 3],
        explain: `${ent2('a', 1, 1)} = ${sn(f(1, 1))}, ${ent2('a', 1, 2)} = ${sn(f(1, 2))}, ${ent2('a', 2, 1)} = ${sn(f(2, 1))}처럼 ${V('i')}에 행의 번호, ${V('j')}에 열의 번호를 넣어 셈하면 ${V('A')} = ${mat(A)}이다.`
      });
    }),
    T('mean-cases', '경우로 나뉜 a_ij', '①7', (d, n) => {
      const I = V('i'), J = V('j'), GE = ' ≥ ', LT = ' &lt; ', GT = ' &gt; ', LE = ' ≤ ';
      if (n === 0) {
        const [f1, f2] = d.until(() => [d.pick(RULES), d.pick(RULES)], ([u, w]) => u !== w);
        const strict = d.bool();   // 참이면 i > j / i ≤ j, 아니면 i ≥ j / i < j
        const low = (i, j) => (strict ? i > j : i >= j);
        const A = [1, 2].map((i) => [1, 2].map((j) => (low(i, j) ? f1.f(i, j) : f2.f(i, j))));
        const calc = [1, 2].map((i) => [1, 2].map((j) => (low(i, j) ? f1.s(i, j) : f2.s(i, j))));
        const cond = sys([`${f1.h()} (${I}${strict ? GT : GE}${J})`, `${f2.h()} (${I}${strict ? LE : LT}${J})`]);
        return matQ(`2×2 행렬 ${Vj('A', '의')} ${IJ} 성분 ${aij()}가 다음과 같을 때, 행렬 ${Vj('A', '을/를')} 구하시오.`, V('A'), A, {
          figure: show(`${aij()} = ${cond}`), calc, unseen: [1, 2, 3],
          explain: `${ent2('a', 1, 1)}, ${ej('a', 2, 2, '은/는')} ${I} = ${J}이므로 ${nb(`${I}${strict ? LE : GE}${J}`)}의 식, ${ej('a', 2, 1, '은/는')} ${I}${GT}${J}이므로 ${nb(`${I}${strict ? GT : GE}${J}`)}의 식, ${ej('a', 1, 2, '은/는')} ${I}${LT}${J}이므로 ${nb(`${I}${strict ? LE : LT}${J}`)}의 식으로 셈한다. ${V('A')} = ${mat(A)}이다.`
        });
      }
      // 3×3, 세 경우(i < j, i = j, i > j): 고르기. 틀린 보기는 위아래 식을 바꾼 것, 대각선에 다른 식을 쓴 것, i 와 j 를 바꾼 것이다.
      const build = (up, diag, low) => range(1, 3).map((i) => range(1, 3).map((j) => (i < j ? up(i, j) : i === j ? diag(i, j) : low(i, j))));
      const choose = () => {
        const [fu, fd, fl] = d.until(() => [d.pick(RULES), d.pick(RULES), d.pick(RULES)], ([a, b, c]) => a !== b && b !== c && a !== c);
        const right = build(fu.f, fd.f, fl.f);
        const wrongs = [build(fl.f, fd.f, fu.f), build(fu.f, fu.f, fl.f), build((i, j) => fu.f(j, i), fd.f, (i, j) => fl.f(j, i)), build(fu.f, fl.f, fl.f)];
        const kept = [];
        for (const w of wrongs) if (!same(w, right) && !kept.some((k) => same(k, w)) && maxAbs(w) <= 40) kept.push(w);
        return { fu, fd, fl, right, kept };
      };
      const { fu, fd, fl, right, kept } = d.until(choose, (o) => o.kept.length >= 3 && maxAbs(o.right) <= 40);
      const cond = sys([`${fu.h()} (${I}${LT}${J})`, `${fd.h()} (${I} = ${J})`, `${fl.h()} (${I}${GT}${J})`]);
      return pickOne(d, `3×3 행렬 ${Vj('A', '의')} ${IJ} 성분 ${aij()}가 다음과 같을 때, 행렬 ${Vj('A', '은/는')}?`, [[mat(right), true]].concat(kept.slice(0, 3).map((w) => [mat(w), false])), {
        figure: show(`${aij()} = ${cond}`),
        explain: `대각선 위쪽(${I}${LT}${J})의 성분은 ${nb(fu.h())}, 대각선(${I} = ${J})의 성분은 ${nb(fd.h())}, 대각선 아래쪽(${I}${GT}${J})의 성분은 ${nb(fl.h())}의 식으로 셈한다. 이를테면 ${ent2('a', 1, 3)} = ${sn(right[0][2])}, ${ent2('a', 3, 1)} = ${sn(right[2][0])}이므로 ${V('A')} = ${mat(right)}이다.`
      });
    }, { count: 2 }),
    T('mean-transpose', '다른 칸을 가리키는 성분', '①8', (d, n) => {
      const I = V('i'), J = V('j');
      if (n === 0) {
        // a_ij = (−1)^i + pj + k, b_ij = a_ji
        const [p, k] = [nz(d, -4, 4), d.int(-5, 5)];
        const f = (i, j) => (i % 2 ? -1 : 1) + p * j + k;
        const A = [1, 2].map((i) => [1, 2].map((j) => f(i, j))), Bm = [1, 2].map((i) => [1, 2].map((j) => A[j - 1][i - 1]));
        const rule = `(${MINUS}1)${sup(I)}` + (p < 0 ? ` ${MINUS} ` : ' + ') + cf(Math.abs(p), J) + (k ? (k < 0 ? ` ${MINUS} ` : ' + ') + Math.abs(k) : '');
        return matQ(`2×2 행렬 ${Vj('A', '의')} ${IJ} 성분 ${aij()}가 ${nb(`${aij()} = ${rule}`)}이다. ${IJ} 성분 ${aij('b')}가 ${nb(`${aij('b')} = ${V('a')}<sub>${J}${I}</sub>`)}인 행렬 ${Vj('B', '을/를')} 구하시오.`, V('B'), Bm, {
          calc: [1, 2].map((i) => [1, 2].map((j) => `(-1)**${j}+${jn(p)}*${i}+${jn(k)}`)), unseen: [0, 1, 2], rule: 'swap-2',
          explain: `${V('A')} = ${mat(A)}이다. ${ent2('b', 1, 2)} = ${ent2('a', 2, 1)}, ${ent2('b', 2, 1)} = ${ent2('a', 1, 2)}처럼 행과 열을 바꾼 자리의 성분을 가져오므로 ${V('B')} = ${mat(Bm)}이다.`
        });
      }
      // 3×3: 대각선 아래는 f(i, j), 대각선은 g(i), 대각선 위는 a_ji
      const [fl, fd] = d.until(() => [d.pick(RULES), d.pick([{ h: () => V('i') + sup(2), f: (i) => i * i, s: (i) => `${i}*${i}` }, { h: () => `2${V('i')}`, f: (i) => 2 * i, s: (i) => `2*${i}` }, { h: () => poly([[1, V('i')], [-4, '']]), f: (i) => i - 4, s: (i) => `${i}-4` }])], ([a]) => [[2, 1], [3, 1], [3, 2]].every(([i, j]) => Math.abs(a.f(i, j)) <= 30));
      const A = range(1, 3).map((i) => range(1, 3).map((j) => (i > j ? fl.f(i, j) : i === j ? fd.f(i) : fl.f(j, i))));
      const cond = sys([`${fl.h()} (${I} &gt; ${J})`, `${fd.h()} (${I} = ${J})`, `${V('a')}<sub>${J}${I}</sub> (${I} &lt; ${J})`]);
      return vals(`3×3 행렬 ${Vj('A', '의')} ${IJ} 성분 ${aij()}가 다음과 같을 때, ${ent2('a', 1, 2)}, ${ent2('a', 1, 3)}, ${ent2('a', 2, 3)}의 값은?`,
        [[ent2('a', 1, 2) + ' =', A[0][1], fl.s(2, 1)], [ent2('a', 1, 3) + ' =', A[0][2], fl.s(3, 1)], [ent2('a', 2, 3) + ' =', A[1][2], fl.s(3, 2)]], {
        figure: show(`${aij()} = ${cond}`), unseen: [1, 2, 3, 4], rule: 'swap-3',
        explain: `${ent2('a', 1, 2)} = ${ent2('a', 2, 1)} = ${sn(A[1][0])}, ${ent2('a', 1, 3)} = ${ent2('a', 3, 1)} = ${sn(A[2][0])}, ${ent2('a', 2, 3)} = ${ent2('a', 3, 2)} = ${sn(A[2][1])}이다. 대각선 위의 성분은 행과 열을 바꾼 자리(대각선 아래)의 성분과 같다.`
      });
    }, { count: 2 }),
    T('mean-const', 'a_ij 식의 상수 구하기', '①9', (d) => {
      const I = V('i'), J = V('j'), K = V('k');
      if (d.bool()) {
        // 3×2, a_ij = i² + pj + k, 제2열의 합 S → 3k = S − Σ(i² + 2p)
        const [p, k] = [d.int(1, 3), nz(d, -6, 6)], S = [1, 2, 3].reduce((s, i) => s + i * i + 2 * p + k, 0);
        return num1(`3×2 행렬 ${Vj('A', '의')} ${IJ} 성분 ${aij()}가 ${nb(`${aij()} = ${I}${sup(2)} + ${cf(p, J)} + ${K}`)}이고, 행렬 ${Vj('A', '의')} 제2열의 모든 성분의 합이 ${sn(S)}일 때, 상수 ${Vj('k', '의')} 값은?`, k, {
          calc: `(${jn(S)}-(1+${p}*2)-(4+${p}*2)-(9+${p}*2))/3`, unseen: [1, 2, 3, 4, 9],
          explain: `제2열의 성분은 ${ent2('a', 1, 2)} = ${1 + 2 * p} + ${K}, ${ent2('a', 2, 2)} = ${4 + 2 * p} + ${K}, ${ent2('a', 3, 2)} = ${9 + 2 * p} + ${K}이다. 합은 ${nb(`${14 + 6 * p} + 3${K}`)} = ${nb(`${sn(S)}`)}이므로 ${K} = ${sn(k)}이다.`
        });
      }
      // 2×2, a_ij = (−1)^i + kj + c, 모든 성분의 합 S → 6k + 4c = S
      const [k, c] = [nz(d, -5, 5), d.int(-5, 5)], S = 6 * k + 4 * c;
      return num1(`2×2 행렬 ${Vj('A', '의')} ${IJ} 성분 ${aij()}가 ${nb(`${aij()} = (${MINUS}1)${sup(I)} + ${K}${J}` + (c ? (c < 0 ? ` ${MINUS} ` : ' + ') + Math.abs(c) : ''))}이고, 행렬 ${Vj('A', '의')} 모든 성분의 합이 ${sn(S)}일 때, 상수 ${Vj('k', '의')} 값은?`, k, {
        calc: `(${jn(S)}-4*${jn(c)})/6`, unseen: [4, 6, 0],
        explain: `${(c ? '' : '')}네 성분은 ${nb(`${ent2('a', 1, 1)}`)} = ${nb(`${MINUS}1 + ${K}${c ? (c < 0 ? ' ' + MINUS + ' ' : ' + ') + Math.abs(c) : ''}`)}, ${nb(`${ent2('a', 1, 2)}`)} = ${nb(`${MINUS}1 + 2${K}${c ? (c < 0 ? ' ' + MINUS + ' ' : ' + ') + Math.abs(c) : ''}`)}, ${nb(`${ent2('a', 2, 1)}`)} = ${nb(`1 + ${K}${c ? (c < 0 ? ' ' + MINUS + ' ' : ' + ') + Math.abs(c) : ''}`)}, ${nb(`${ent2('a', 2, 2)}`)} = ${nb(`1 + 2${K}${c ? (c < 0 ? ' ' + MINUS + ' ' : ' + ') + Math.abs(c) : ''}`)}이다. 합은 ${nb(`6${K}${c ? (c < 0 ? ' ' + MINUS + ' ' : ' + ') + Math.abs(4 * c) : ''}`)} = ${nb(`${sn(S)}`)}이므로 ${K} = ${sn(k)}이다.`
      });
    }),
    T('mean-life', '자료를 행렬로 나타내기', '①10', (d, n) => {
      if (n === 0) {
        // 표의 행·열 그대로 또는 바꾸어 행렬로
        const [kind] = d.shuffle([['마을', ['가', '나', '다'], ['맑은 날', '비 온 날'], '일'], ['학급', ['1반', '2반', '3반'], ['남학생', '여학생'], '명']]);
        const [, rowsN, colsN, unit] = kind, vals0 = rowsN.map(() => colsN.map(() => d.int(2, 29)));
        const flip = d.bool(), A = flip ? colsN.map((_, j) => rowsN.map((__, i) => vals0[i][j])) : vals0;
        const tbl = table([`(단위: ${unit})`].concat(colsN), rowsN.map((rn, i) => [rn].concat(vals0[i].map(String))));
        const rr = flip ? `행은 ${colsN.join('·')}, 열은 ${kind[0]}(${rowsN.join(', ')})` : `행은 ${kind[0]}(${rowsN.join(', ')}), 열은 ${colsN.join('·')}`;
        return matQ(`다음 표의 수를 ${A.length}×${A[0].length} 행렬 ${Vj('A', '으로/로')} 나타내려고 한다. ${rr}의 차례로 할 때, 행렬 ${Vj('A', '을/를')} 구하시오.`, V('A'), A, {
          figure: tbl, calc: cOf(A), signed: false, rule: 'table',
          explain: flip ? `표의 가로줄과 세로줄을 바꾸어 적는다. 표의 첫째 열이 행렬의 제1행이 되므로 ${V('A')} = ${mat(A)}이다.` : `표의 가로줄을 행렬의 행으로 그대로 옮기면 ${V('A')} = ${mat(A)}이다.`
        });
      }
      if (n === 1) {
        // 성분이 나타내는 것 고르기
        const schools = ['A 학교', 'B 학교'], balls = ['농구공', '배구공', '축구공'];
        const v = schools.map(() => balls.map(() => d.int(3, 15)));
        const flip = d.bool(), P = flip ? balls.map((_, j) => schools.map((__, i) => v[i][j])) : v;
        const i = d.int(1, P.length), j = d.int(1, P[0].length);
        const say = (s, b) => `${schools[s]}의 ${balls[b]} 수`;
        const right = flip ? say(j - 1, i - 1) : say(i - 1, j - 1);
        const pool = [];
        for (let s = 0; s < 2; s += 1) for (let b = 0; b < 3; b += 1) pool.push(say(s, b));
        const wrongs = d.shuffle(pool.filter((t) => t !== right)).slice(0, 3);
        const tbl = capt('(단위: 개)', table([''].concat(balls), schools.map((s, k) => [s].concat(v[k].map(String)))));
        return pickOne(d, `다음 표는 두 학교가 가진 공의 수이다. 이 표의 수를 ${flip ? '행은 공의 종류(농구공, 배구공, 축구공), 열은 학교(A, B)' : '행은 학교(A, B), 열은 공의 종류(농구공, 배구공, 축구공)'}의 차례로 하여 행렬 ${Vj('P', '으로/로')} 나타낼 때, 행렬 ${Vj('P', '의')} (${i}, ${j}) 성분이 나타내는 것은?`,
          [[right, true]].concat(wrongs.map((w) => [w, false])), {
          figure: tbl, explain: `제${i}행은 ${flip ? balls[i - 1] : schools[i - 1]}, 제${j}열은 ${flip ? schools[j - 1] : balls[j - 1]}이므로 (${i}, ${j}) 성분은 ${right}이다.`
        });
      }
      // 흩어진 쪽지를 학년×활동 행렬로
      const acts = ['도서관 봉사', '급식 도우미', '안전 지킴이'], grades = ['1학년', '2학년', '3학년'];
      const A = grades.map(() => acts.map(() => d.int(1, 6)));
      const cards = acts.map((a, j) => `${a}: ` + d.shuffle([0, 1, 2]).map((g) => `${grades[g]} ${A[g][j]}명`).join(', '));
      return matQ(`다음은 어느 학교에서 봉사 활동에 지원한 학생 수를 활동마다 적은 쪽지이다. 행을 학년(1학년, 2학년, 3학년), 열을 활동(${acts.join(', ')})의 차례로 하는 3×3 행렬 ${Vj('A', '으로/로')} 나타내시오.`, V('A'), A, {
        figure: lines(cards), calc: cOf(A), signed: false, rule: 'cards',
        explain: `쪽지마다 학년의 차례가 섞여 있으니 학년을 찾아 자리에 맞게 적는다. 제1열은 ${acts[0]}, 제2열은 ${acts[1]}, 제3열은 ${acts[2]}의 지원자 수이므로 ${V('A')} = ${mat(A)}이다.`
      });
    }, { count: 3 }),
    T('mean-seat', '상태를 0과 1로 나타낸 행렬', '①11', (d) => {
      const r = d.pick([2, 3]), c = 3;
      const grid = d.until(() => range(1, r).map(() => range(1, c).map(() => (d.bool() ? 1 : 0))), (g) => { const ones = g.flat().filter(Boolean).length; return ones >= 2 && ones <= r * c - 2; });
      // 좌석 그림: 예약을 마친 자리는 색칠, 예약할 수 있는 자리는 흰색
      const W = 40, H = 30, gap = 10, x0 = 22, y0 = 40, w = x0 + c * W + (c - 1) * gap + 10, h = y0 + r * H + (r - 1) * gap + 10;
      let body = `<rect x="${x0}" y="6" width="${c * W + (c - 1) * gap}" height="16" rx="4" style="fill:#e5e7eb"/><text x="${x0 + (c * W + (c - 1) * gap) / 2}" y="18" text-anchor="middle" style="font-size:12px;fill:#1f2933">앞</text>`;
      grid.forEach((row, i) => row.forEach((v, j) => { body += `<rect x="${x0 + j * (W + gap)}" y="${y0 + i * (H + gap)}" width="${W}" height="${H}" rx="6" style="fill:${v ? '#fff' : '#f59e0b'};stroke:#1f2933;stroke-width:1.4"/>`; }));
      const legend = `<rect x="${w + 6}" y="${y0}" width="16" height="12" rx="3" style="fill:#f59e0b;stroke:#1f2933;stroke-width:1"/><text x="${w + 26}" y="${y0 + 10.5}" style="font-size:12px;fill:#1f2933">예약 완료</text>`
        + `<rect x="${w + 6}" y="${y0 + 22}" width="16" height="12" rx="3" style="fill:#fff;stroke:#1f2933;stroke-width:1"/><text x="${w + 26}" y="${y0 + 32.5}" style="font-size:12px;fill:#1f2933">예약 가능</text>`;
      const said = `열람실 좌석: 앞에서부터 ${r}줄, 줄마다 ${c}자리. ` + grid.map((row, i) => `${i + 1}째 줄은 왼쪽부터 ` + row.map((v) => (v ? '예약 가능' : '예약 완료')).join(', ')).join('. ') + '.';
      const fig = `<svg class="mb-geo" viewBox="0 0 ${w + 90} ${h}" width="${w + 90}" role="img" aria-label="${said}">${body}${legend}</svg>`;
      return matQ(`그림은 어느 열람실의 좌석 예약 현황이다. 예약을 마친 자리는 0, 예약할 수 있는 자리는 1로 나타낼 때, 좌석 예약 현황을 ${r}×${c} 행렬 ${Vj('A', '으로/로')} 나타내시오. (단, 앞에서부터 줄의 차례를 행의 차례로, 왼쪽부터 자리의 차례를 열의 차례로 한다.)`, V('A'), grid, {
        figure: fig, signed: false, check: { grid },
        explain: `색칠한 자리(예약 완료)는 0, 흰 자리(예약 가능)는 1로 적으면 ${V('A')} = ${mat(grid)}이다.`
      });
    }),
    T('mean-shape', '같은 꼴인 행렬 고르기', '①12', (d) => {
      const SH = [[2, 3], [3, 2], [1, 3], [3, 1], [1, 2], [2, 1], [2, 2]];
      const [r, c] = d.pick(SH.filter(([x, y]) => x !== y));
      const others = d.shuffle(SH.filter(([x, y]) => !(x === r && y === c) && !(x === c && y === r))).slice(0, 2);
      const mk = ([x, y]) => mat(rm(d, x, y, -5, 9, true));
      const A = rm(d, r, c, -5, 9, true);
      return pickOne(d, `다음 중 행렬 ${Vj('A', '과/와')} 같은 꼴인 행렬은?`, [[mk([r, c]), true], [mk([c, r]), false]].concat(others.map((s) => [mk(s), false])), {
        figure: show(nm('A', A)), explain: `행렬 ${Vj('A', '은/는')} ${r}×${c} 행렬이다. 같은 꼴은 행의 개수와 열의 개수가 각각 같은 것이므로 ${r}×${c} 행렬을 고른다. 성분의 개수가 같아도 ${c}×${r} 행렬은 같은 꼴이 아니다.`
      });
    })
  ];

  // ── 두 행렬이 서로 같을 조건 ──
  const equalTypes = [
    T('eq-direct', '성분끼리 바로 놓는 같을 조건', '①13', (d) => {
      const [a0, b0, c0, p, w, q] = [nz(d, -9, 9), nz(d, -6, 6), nz(d, -6, 6), nz(d, -9, 9), nz(d, -9, 9), d.pick([2, 3, 4, -2, -3])];
      const m = a0 + p, u = 2 * b0 + w, k = q * c0, same0 = nz(d, -9, 9);
      const Aa = V('a'), Bb = V('b'), Cc = V('c');
      // 왼쪽 성분, 오른쪽 성분: a + p = m, u − b = b + w, k = qc, 같은 수
      const L = [poly([[1, Aa], [p, '']]), poly([[u, ''], [-1, Bb]]), sn(k), sn(same0)], R = [sn(m), poly([[1, Bb], [w, '']]), poly([[q, Cc]]), sn(same0)];
      const order = d.shuffle([0, 1, 2, 3]), Lm = [[L[order[0]], L[order[1]]], [L[order[2]], L[order[3]]]], Rm = [[R[order[0]], R[order[1]]], [R[order[2]], R[order[3]]]];
      return vals(`다음 등식을 만족시키는 실수 ${Aa}, ${Bb}, ${Vj('c', '의')} 값은?`, [[eqL('a'), a0, `${jn(m)}-${jn(p)}`], [eqL('b'), b0, `(${jn(u)}-${jn(w)})/2`], [eqL('c'), c0, `${jn(k)}/${jn(q)}`]], {
        figure: show(`${mat(Lm)} = ${mat(Rm)}`), unseen: [0, 2],
        explain: `대응하는 성분이 각각 같아야 하므로 ${nb(`${poly([[1, Aa], [p, '']])}`)} = ${nb(`${sn(m)}`)}, ${nb(`${poly([[u, ''], [-1, Bb]])}`)} = ${nb(`${poly([[1, Bb], [w, '']])}`)}, ${nb(`${sn(k)}`)} = ${nb(`${poly([[q, Cc]])}`)}이다. 따라서 ${Aa} = ${sn(a0)}, ${Bb} = ${sn(b0)}, ${Cc} = ${sn(c0)}이다.`
      });
    }),
    T('eq-system', '연립방정식이 되는 같을 조건', '①14', (d, n) => {
      const X = V('x'), Y = V('y'), Z = V('z');
      if (n === 0) {
        const [x, y, p, q, r] = d.until(() => [nz(d, -6, 6), nz(d, -6, 6), nz(d, -3, 3), d.int(1, 3), nz(d, -3, 3)], ([, , pp, qq, rr]) => rr - pp * qq !== 0);
        const s1 = x + p * y, s2 = q * x + r * y, [k1, k2] = [nz(d, -9, 9), nz(d, -9, 9)];
        const L = [[poly([[1, X], [p, Y]]), k1], [k2, poly([[q, X], [r, Y]])]], R = [[s1, k1], [k2, s2]];
        const det = `(${jn(r)}-${jn(p)}*${q})`;
        return vals(`다음 등식을 만족시키는 실수 ${X}, ${Vj('y', '의')} 값은?`, [[eqL('x'), x, `(${jn(s1)}*${jn(r)}-${jn(p)}*${jn(s2)})/${det}`], [eqL('y'), y, `(${jn(s2)}-${q}*${jn(s1)})/${det}`]], {
          figure: show(`${mat(L)} = ${mat(R)}`), unseen: [1], rule: 'eq-sys2',
          explain: `대응하는 성분이 같으므로 ${sys([`${poly([[1, X], [p, Y]])} = ${sn(s1)}`, `${poly([[q, X], [r, Y]])} = ${sn(s2)}`])}이다. 이를 연립하여 풀면 ${X} = ${sn(x)}, ${Y} = ${sn(y)}이다.`
        });
      }
      // 미지수 셋을 차례로: ax = s0, y + z = s1, by + z = s2
      const [x, y, z, a, b, k] = d.until(() => [nz(d, -6, 6), nz(d, -6, 6), nz(d, -6, 6), d.pick([2, 3, 4, -2, -3]), d.pick([2, 3, -1, -2]), nz(d, -9, 9)], ([, yy, zz, , bb]) => yy + zz !== 0 && bb * yy + zz !== 0);
      const s0 = a * x, s1 = y + z, s2 = b * y + z;
      const L = [[poly([[a, X]]), k], [poly([[1, Y], [1, Z]]), poly([[b, Y], [1, Z]])]], R = [[s0, k], [s1, s2]];
      return vals(`다음 등식을 만족시키는 실수 ${X}, ${Y}, ${Vj('z', '의')} 값은?`, [[eqL('x'), x, `${jn(s0)}/${jn(a)}`], [eqL('y'), y, `(${jn(s2)}-${jn(s1)})/(${jn(b)}-1)`], [eqL('z'), z, `${jn(s1)}-(${jn(s2)}-${jn(s1)})/(${jn(b)}-1)`]], {
        figure: show(`${mat(L)} = ${mat(R)}`), unseen: [1], rule: 'eq-sys3',
        explain: `대응하는 성분이 같으므로 ${nb(`${poly([[a, X]])}`)} = ${nb(`${sn(s0)}`)}에서 ${X} = ${sn(x)}이다. ${nb(`${poly([[1, Y], [1, Z]])}`)} = ${nb(`${sn(s1)}`)}, ${nb(`${poly([[b, Y], [1, Z]])}`)} = ${nb(`${sn(s2)}`)}${tail(Math.abs(s2), '을/를')} 연립하여 풀면 ${Y} = ${sn(y)}, ${Z} = ${sn(z)}이다.`
      });
    }, { count: 2 }),
    T('eq-quad', '이차식이 낀 같을 조건(근 고르기)', '①15', (d) => {
      const X = V('x'), Y = V('y');
      const [r1, r2, s, k, m] = d.until(() => [d.int(1, 6), d.int(-6, -1), d.int(-3, 5), nz(d, -9, 9), nz(d, -9, 9)], ([a, b, ss]) => a + b !== 0 && a + ss >= 1);
      const p = -(r1 + r2), q = -r1 * r2, y = r1 + s;
      const L = [[poly([[1, X + sup(2)], [p, X]]), k], [m, Y]], R = [[q, k], [m, poly([[1, X], [s, '']])]];
      return vals(`다음 등식을 만족시키는 양수 ${X}, ${Vj('y', '의')} 값은?`, [[eqL('x'), r1, null, false], [eqL('y'), y, null, false]], {
        figure: show(`${mat(L)} = ${mat(R)}`), check: { quad: [1, p, -q], pick: 'positive', y: [1, s] },
        explain: `${nb(`${poly([[1, X + sup(2)], [p, X]])}`)} = ${nb(`${q}`)}에서 ${nb(`(${poly([[1, X], [-r1, '']])})(${poly([[1, X], [-r2, '']])})`)} = ${nb(`0`)}이므로 ${X} = ${r1} 또는 ${X} = ${sn(r2)}이다. ${Vj('x', '은/는')} 양수이므로 ${X} = ${r1}이고, ${nb(`${Y}`)} = ${nb(`${poly([[1, X], [s, '']])}`)} = ${nb(`${y}`)}이다.`
      });
    }),
    T('eq-ident', '같을 조건에서 합·곱을 얻어 식의 값', '①17', (d, n) => {
      const X = V('x'), Y = V('y');
      // 묻는 식: s = x + y, p = xy 의 값과 그 값을 검사 식에 적는 글(ss, ps)
      const askOf = (s, p, ss, ps) => { const S = ss || jn(s), P = ps || jn(p); return d.pick([
        { h: `${X}${sup(2)} + ${Y}${sup(2)}`, v: s * s - 2 * p, c: `${S}*${S}-2*${P}`, how: `(${X} + ${Y})${sup(2)} − 2${X}${Y}` },
        { h: `${X}${sup(3)} + ${Y}${sup(3)}`, v: s ** 3 - 3 * p * s, c: `${S}*${S}*${S}-3*${P}*${S}`, how: `(${X} + ${Y})${sup(3)} − 3${X}${Y}(${X} + ${Y})` }
      ]); };
      if (n === 0) {
        if (d.bool()) {
          // (x + y, k / m, xy) = (s, k / m, p)
          const [s, p] = d.until(() => [nz(d, -5, 5), nz(d, -8, 8)], ([ss, pp]) => { const D = ss * ss - 4 * pp; return D > 0 && !Number.isInteger(Math.sqrt(D)); });
          const [k, m] = [nz(d, -9, 9), nz(d, -9, 9)], ask = askOf(s, p);
          return num1(`다음 등식을 만족시키는 실수 ${X}, ${Vj('y', '에')} 대하여 ${ask.h}의 값은?`, ask.v, {
            figure: show(`${mat([[poly([[1, X], [1, Y]]), k], [m, X + Y]])} = ${mat([[s, k], [m, p]])}`), calc: ask.c, unseen: [2, 3], rule: 'ident-sum',
            explain: `대응하는 성분이 같으므로 ${nb(`${X} + ${Y}`)} = ${nb(`${sn(s)}`)}, ${nb(`${X}${Y}`)} = ${nb(`${sn(p)}`)}이다. ${nb(`${ask.h}`)} = ${nb(`${ask.how}`)} = ${sn(ask.v)}이다.`
          });
        }
        // (α, 1 / 2α − 2t, β) = (t + β, 1 / 2β, r/α): α − β = t, αβ = r
        const Al = V('α'), Be = V('β');
        const [t, r] = d.until(() => [d.int(1, 6), nz(d, -6, 9)], ([tt, rr]) => tt * tt + 4 * rr > 0);
        const ask = d.pick([{ h: `${Al}${sup(3)} − ${Be}${sup(3)}`, v: t ** 3 + 3 * r * t, c: `${t}*${t}*${t}+3*${jn(r)}*${t}`, how: `(${Al} − ${Be})${sup(3)} + 3${Al}${Be}(${Al} − ${Be})` }, { h: `${Al}${sup(2)} + ${Be}${sup(2)}`, v: t * t + 2 * r, c: `${t}*${t}+2*${jn(r)}`, how: `(${Al} − ${Be})${sup(2)} + 2${Al}${Be}` }]);
        return num1(`다음 등식을 만족시키는 실수 ${Al}, ${Vj('β', '에')} 대하여 ${ask.h}의 값은?`, ask.v, {
          figure: show(`${mat([[Al, 1], [poly([[2, Al], [-2 * t, '']]), Be]])} = ${mat([[poly([[1, Be], [t, '']]), 1], [`2${Be}`, frac(sn(r), Al)]])}`), calc: ask.c, unseen: [2, 3], rule: 'ident-diff',
          explain: `대응하는 성분이 같으므로 ${nb(`${Al}`)} = ${nb(`${t} + ${Be}`)}, ${nb(`${Be}`)} = ${nb(`${frac(sn(r), Al)}`)}이다. 곧 ${nb(`${Al} − ${Be}`)} = ${nb(`${t}`)}, ${nb(`${Al}${Be}`)} = ${nb(`${sn(r)}`)}이므로 ${nb(`${ask.h}`)} = ${nb(`${ask.how}`)} = ${sn(ask.v)}이다.`
        });
      }
      if (n === 1) {
        // (x, c1 / m1, c2) − (a, c3 / m2, c4) = (−y, c1 − c3 / xy, c2 − c4): x + y = a, xy = m1 − m2
        const [a, p] = d.until(() => [nz(d, -6, 6), nz(d, -8, 8)], ([aa, pp]) => { const D = aa * aa - 4 * pp; return D > 0 && !Number.isInteger(Math.sqrt(D)); });
        const [c1, c3, c2, c4] = d.until(() => nzs(d, -9, 9, 4), ([u1, u3, u2, u4]) => u1 !== u3 && u2 !== u4);
        const m2 = d.int(2, 9), m1 = p + m2, ask = askOf(a, p, null, `(${jn(m1)}-${m2})`);
        return num1(`다음 등식을 만족시키는 실수 ${X}, ${Vj('y', '에')} 대하여 ${ask.h}의 값은?`, ask.v, {
          figure: show(`${mat([[X, c1], [m1, c2]])} − ${mat([[a, c3], [m2, c4]])} = ${mat([[MINUS + Y, c1 - c3], [X + Y, c2 - c4]])}`), calc: ask.c, unseen: [2, 3], rule: 'ident-sub',
          explain: `좌변은 ${mat([[poly([[1, X], [-a, '']]), c1 - c3], [m1 - m2, c2 - c4]])}이므로 ${nb(`${poly([[1, X], [-a, '']])}`)} = ${nb(`${MINUS}${Y}`)}, ${nb(`${sn(m1 - m2)}`)} = ${nb(`${X}${Y}`)}이다. 곧 ${nb(`${X} + ${Y}`)} = ${nb(`${sn(a)}`)}, ${nb(`${X}${Y}`)} = ${nb(`${sn(p)}`)}이므로 ${nb(`${ask.h}`)} = ${nb(`${ask.how}`)} = ${sn(ask.v)}이다.`
        });
      }
      // (a, a² / c, a³) + (b, b² / −c, b³) = (s, t / 0, k): a + b = s, a² + b² = t → k = a³ + b³
      const Aa = V('a'), Bb = V('b'), K = V('k');
      const [s, p, c] = d.until(() => [nz(d, -4, 4), nz(d, -9, 3), nz(d, -9, 9)], ([ss, pp]) => ss * ss - 4 * pp > 0);
      const t = s * s - 2 * p, k = s ** 3 - 3 * p * s;
      return num1(`다음 등식을 만족시키는 실수 ${Aa}, ${Bb}, ${Vj('k', '에')} 대하여 ${Vj('k', '의')} 값은?`, k, {
        figure: show(`${mat([[Aa, Aa + sup(2)], [c, Aa + sup(3)]])} + ${mat([[Bb, Bb + sup(2)], [-c, Bb + sup(3)]])} = ${mat([[s, t], [0, K]])}`),
        calc: `${jn(s)}*${jn(s)}*${jn(s)}-3*((${jn(s)}*${jn(s)}-${jn(t)})/2)*${jn(s)}`, unseen: [2, 3], rule: 'ident-add',
        explain: `대응하는 성분이 같으므로 ${nb(`${Aa} + ${Bb}`)} = ${nb(`${sn(s)}`)}, ${nb(`${Aa}${sup(2)} + ${Bb}${sup(2)}`)} = ${nb(`${t}`)}이다. ${nb(`${Aa}${sup(2)} + ${Bb}${sup(2)}`)} = ${nb(`(${Aa} + ${Bb})${sup(2)} − 2${Aa}${Bb}`)}에서 ${nb(`${Aa}${Bb}`)} = ${nb(`${sn(p)}`)}이므로 ${nb(`${K}`)} = ${nb(`${Aa}${sup(3)} + ${Bb}${sup(3)}`)} = ${nb(`(${Aa} + ${Bb})${sup(3)} − 3${Aa}${Bb}(${Aa} + ${Bb})`)} = ${sn(k)}이다.`
      });
    }, { count: 3 })
  ];

  // ── 덧셈·뺄셈·실수배 ──
  const ER = (A) => mat(A);
  const addTypes = [
    T('add-calc', '행렬의 덧셈과 뺄셈', '①18', (d, n) => {
      const A = rm(d, 2, 2, -9, 9), Bm = d.until(() => rm(d, 2, 2, -9, 9), (X) => X.flat().filter((v) => v < 0).length >= 2);
      const op = n === 0 ? '+' : '-', Rm = n === 0 ? madd(A, Bm) : msub(A, Bm);
      return matQ('다음을 계산하시오.', null, Rm, {
        figure: show(`${ER(A)} ${n === 0 ? '+' : MINUS} ${ER(Bm)}`), calc: cAdd(A, Bm, op), rule: n === 0 ? 'add' : 'sub',
        explain: `대응하는 성분끼리 ${n === 0 ? '더하면' : '빼면'} ${mat(A.map((r, i) => r.map((v, j) => nb(`${sn(v)} ${n === 0 ? '+' : MINUS} ${pn(Bm[i][j])}`))))} = ${mat(Rm)}이다.`
      });
    }, { count: 2 }),
    T('add-steps', '계산 과정의 빈칸', '①19', (d, n) => {
      const L = ['㉠', '㉡', '㉢', '㉣', '㉤'];
      if (n === 0) {
        const A = rm(d, 2, 2, -9, 9), Bm = rm(d, 2, 2, -9, 9), plus = d.bool(), op = plus ? '+' : MINUS, Rm = plus ? madd(A, Bm) : msub(A, Bm);
        const mid = [[`${box('㉠')} ${op} ${pn(Bm[0][0])}`, `${sn(A[0][1])} ${op} ${box('㉡')}`], [`${sn(A[1][0])} ${op} ${pn(Bm[1][0])}`, `${box('㉢')} ${op} ${pn(Bm[1][1])}`]];
        const last = [[Rm[0][0], box('㉣')], [box('㉤'), Rm[1][1]]];
        return vals('다음은 두 행렬의 ' + (plus ? '덧셈' : '뺄셈') + '을 계산하는 과정이다. ㉠~㉤에 알맞은 수는?', [[L[0], A[0][0], jn(A[0][0])], [L[1], Bm[0][1], jn(Bm[0][1])], [L[2], A[1][1], jn(A[1][1])], [L[3], Rm[0][1], `${jn(A[0][1])}${plus ? '+' : '-'}${jn(Bm[0][1])}`], [L[4], Rm[1][0], `${jn(A[1][0])}${plus ? '+' : '-'}${jn(Bm[1][0])}`]], {
          figure: rowsOf([`${ER(A)} ${op} ${ER(Bm)}`, `= ${mat(mid)}`, `= ${mat(last)}`]), rule: plus ? 'steps-add' : 'steps-sub',
          explain: `대응하는 성분끼리 ${plus ? '더한다' : '뺀다'}. ㉠ = ${sn(A[0][0])}, ㉡ = ${sn(Bm[0][1])}, ㉢ = ${sn(A[1][1])}이고 ㉣ = ${nb(`${sn(A[0][1])} ${op} ${pn(Bm[0][1])}`)} = ${sn(Rm[0][1])}, ㉤ = ${nb(`${sn(A[1][0])} ${op} ${pn(Bm[1][0])}`)} = ${sn(Rm[1][0])}이다.`
        });
      }
      const k = d.pick([-4, -3, -2, 2, 3, 4]), A = rm(d, 2, 2, -9, 9), Rm = msc(k, A);
      const mid = [[`${sn(k)} × ${pn(A[0][0])}`, `${sn(k)} × ${box('㉠')}`], [`${sn(k)} × ${pn(A[1][0])}`, `${sn(k)} × ${box('㉡')}`]];
      return vals('다음은 행렬의 실수배를 계산하는 과정이다. ㉠~㉣에 알맞은 수는?', [[L[0], A[0][1], jn(A[0][1])], [L[1], A[1][1], jn(A[1][1])], [L[2], Rm[0][1], `${jn(k)}*${jn(A[0][1])}`], [L[3], Rm[1][1], `${jn(k)}*${jn(A[1][1])}`]], {
        figure: rowsOf([`${sn(k)}${ER(A)}`, `= ${mat(mid)}`, `= ${mat([[Rm[0][0], box('㉢')], [Rm[1][0], box('㉣')]])}`]), rule: 'steps-scalar',
        explain: `모든 성분에 ${nj(k, '을/를')} 곱한다. ㉠ = ${sn(A[0][1])}, ㉡ = ${sn(A[1][1])}이고 ㉢ = ${nb(`${sn(k)} × ${pn(A[0][1])}`)} = ${sn(Rm[0][1])}, ㉣ = ${nb(`${sn(k)} × ${pn(A[1][1])}`)} = ${sn(Rm[1][1])}이다.`
      });
    }, { count: 2 }),
    T('add-scalar', '행렬의 실수배', '①20', (d, n) => {
      if (n === 0) {
        const k = d.pick([-4, -3, -2, 2, 3, 4]), [r] = d.pick([[2], [3]]), A = rm(d, r, 2, -9, 9), Rm = msc(k, A);
        return matQ(`행렬 ${Vj('A', '에')} 대하여 ${cf(k, V('A'))}${pj('A', '을/를')} 구하시오.`, cf(k, V('A')), Rm, {
          figure: show(nm('A', A)), calc: A.map((row) => row.map((v) => `${jn(k)}*${jn(v)}`)), rule: 'scalar-int',
          explain: `행렬 ${Vj('A', '의')} 모든 성분에 ${nj(k, '을/를')} 곱하면 ${cf(k, V('A'))} = ${mat(Rm)}이다.`
        });
      }
      const m = d.pick([2, 3, 4]), p = d.pick(range(1, m * 2).filter((v) => gcd(v, m) === 1 && v !== m)), sgn = d.pick([1, -1]);
      const A = rm(d, 2, 2, -4, 4).map((row) => row.map((v) => v * m)), Rm = A.map((row) => row.map((v) => (sgn * p * v) / m));
      const coef = (sgn < 0 ? MINUS : '') + frac(p, m);
      return matQ(`행렬 ${Vj('A', '에')} 대하여 ${coef}${V('A')}${pj('A', '을/를')} 구하시오.`, coef + V('A'), Rm, {
        figure: show(nm('A', A)), calc: A.map((row) => row.map((v) => `(${sgn < 0 ? '-' : ''}${p}*${jn(v)})/${m}`)), rule: 'scalar-frac',
        explain: `모든 성분에 ${coef}${tail(p, '을/를')} 곱하면 ${coef}${V('A')} = ${mat(Rm)}이다.`
      });
    }, { count: 2 }),
    T('add-mix', '실수배를 섞은 식', '①21', (d, n) => {
      const Aa = V('A'), Bb = V('B'), lin2 = (a, b) => poly([[a, Aa], [b, Bb]]);
      if (n === 0) {
        const [p, q] = d.until(() => [d.pick([-3, -2, 2, 3]), nz(d, -3, 3)], ([pp, qq]) => Math.abs(qq) !== 1 || pp !== 1);
        const A = rm(d, 2, 2, -6, 6), Bm = rm(d, 2, 2, -6, 6), Rm = madd(msc(p, A), msc(q, Bm)), ex = lin2(p, q);
        return matQ(`두 행렬 ${Aa}, ${Vj('B', '에')} 대하여 ${ex}${pj('B', '을/를')} 구하시오.`, ex, Rm, {
          figure: show(nm('A', A), nm('B', Bm)), calc: A.map((r, i) => r.map((v, j) => `${jn(p)}*${jn(v)}+${jn(q)}*${jn(Bm[i][j])}`)), rule: 'mix-plain', unseen: [1],
          explain: `${ex} = ${mat(msc(p, A))} + ${mat(msc(q, Bm))} = ${mat(Rm)}이다.`
        });
      }
      // 식을 먼저 정리한다: 세 가지 꼴
      const form = d.int(0, 2);
      let text, cA, cB, calcOf, unseen = [1], den = 1;
      if (form === 0) {
        // k(A + mB) + uA − vB
        const [k, m, u, v] = d.until(() => [d.int(2, 3), d.pick([1, 2, 3, -2]), d.int(1, 3), d.int(2, 6)], ([kk, mm, uu, vv]) => kk * mm - vv !== 0 && kk + uu !== 0 && kk * mm !== vv);
        text = `${k}(${lin2(1, m)}) + ${cf(u, Aa)} ${MINUS} ${cf(v, Bb)}`; cA = k + u; cB = k * m - v;
        calcOf = (a, b) => `${k}*(${jn(a)}+${jn(m)}*${jn(b)})+${u}*${jn(a)}-${v}*${jn(b)}`;
      } else if (form === 1) {
        // k(A − B) − (mA + B)
        const [k, m] = d.until(() => [d.int(2, 4), d.int(1, 3)], ([kk, mm]) => kk !== mm);
        text = `${k}(${lin2(1, -1)}) ${MINUS} (${lin2(m, 1)})`; cA = k - m; cB = -k - 1;
        calcOf = (a, b) => `${k}*(${jn(a)}-${jn(b)})-(${m}*${jn(a)}+${jn(b)})`;
      } else {
        // (1/n)(pA − B) − r(A − (1/(rn))B) = (p/n − r)A
        const nn = d.pick([2, 3]), r = d.int(1, 3), p = d.until(() => d.int(1, 7), (pp) => pp % nn !== 0 && pp - r * nn !== 0);
        den = nn; text = `${frac(1, nn)}(${lin2(p, -1)}) ${MINUS} ${r === 1 ? '' : r}(${Aa} ${MINUS} ${frac(1, r * nn)}${Bb})`; cA = { p: p - r * nn, q: nn }; cB = 0;
        calcOf = (a, b) => `(${p}*${jn(a)}-${jn(b)})/${nn}-${r}*${jn(a)}+${jn(b)}/${nn}`;
      }
      const mult = den, A = rm(d, 2, 2, -4, 4).map((row) => row.map((v) => v * mult)), Bm = rm(d, 2, 2, -4, 4).map((row) => row.map((v) => v * mult));
      const fa = typeof cA === 'number' ? cA : cA.p / cA.q;
      const Rm = A.map((r, i) => r.map((v, j) => Math.round(fa * v + cB * Bm[i][j])));
      const simple = typeof cA === 'number' ? lin2(cA, cB) : (cA.p < 0 ? MINUS : '') + frac(Math.abs(cA.p), cA.q) + Aa;
      return matQ(`두 행렬 ${Aa}, ${Vj('B', '에')} 대하여 ${nb(text)}${pj('B', '을/를')} 구하시오.`, null, Rm, {
        figure: show(nm('A', A), nm('B', Bm)), calc: A.map((r, i) => r.map((v, j) => calcOf(v, Bm[i][j]))), unseen, rule: 'mix-form' + form,
        explain: `식을 먼저 정리하면 ${nb(text)} = ${simple}이므로 ${mat(Rm)}이다.`
      });
    }, { count: 2 }),
    T('add-alpha', '문자 성분의 실수배와 근과 계수의 관계', '①22', (d) => {
      const X = V('x'), Al = V('α'), Be = V('β');
      const [s, p] = d.until(() => [nz(d, -6, 6), nz(d, -6, 6)], ([ss, pp]) => { const D = ss * ss - 4 * pp; return D > 0 && !Number.isInteger(Math.sqrt(D)); });
      const Rm = [[s, s * s - 2 * p], [0, 2 * p]];
      return matQ(`이차방정식 ${nb(poly([[1, X + sup(2)], [-s, X], [p, '']]) + ' = 0')}의 두 근을 ${Al}, ${Be}라 할 때, 다음 행렬을 구하시오.`, null, Rm, {
        figure: show(`${Al}${mat([[1, Al], [0, Be]])} + ${Be}${mat([[1, Be], [0, Al]])}`), calc: [[jn(s), `${jn(s)}*${jn(s)}-2*${jn(p)}`], ['0', `2*${jn(p)}`]], unseen: [0, 2],
        explain: `두 행렬의 합은 ${mat([[`${Al} + ${Be}`, `${Al}${sup(2)} + ${Be}${sup(2)}`], [0, `2${Al}${Be}`]])}이다. 근과 계수의 관계에서 ${nb(`${Al} + ${Be}`)} = ${nb(`${sn(s)}`)}, ${nb(`${Al}${Be}`)} = ${nb(`${sn(p)}`)}이고 ${nb(`${Al}${sup(2)} + ${Be}${sup(2)}`)} = ${nb(`(${Al} + ${Be})${sup(2)} − 2${Al}${Be}`)} = ${nb(`${sn(s * s - 2 * p)}`)}이므로 ${mat(Rm)}이다.`
      });
    })
  ];

  // ── 덧셈·뺄셈·실수배와 등식 ──
  const Xn = V('X');
  const addEqTypes = [
    T('addeq-unknown', '덧셈·뺄셈 등식의 미지수', '①23', (d, n) => {
      const X = V('x'), Y = V('y');
      if (n === 0) {
        const plus = d.bool(), op = plus ? '+' : MINUS;
        const [x, y] = [nz(d, -9, 9), nz(d, -9, 9)], A0 = rm(d, 2, 2, -9, 9), Bm0 = rm(d, 2, 2, -9, 9);
        A0[0][1] = x; Bm0[1][1] = y;
        const Rm = plus ? madd(A0, Bm0) : msub(A0, Bm0);
        const Ash = A0.map((r, i) => r.map((v, j) => (i === 0 && j === 1 ? X : v))), Bsh = Bm0.map((r, i) => r.map((v, j) => (i === 1 && j === 1 ? Y : v)));
        return vals(`다음 등식을 만족시키는 실수 ${X}, ${Vj('y', '의')} 값은?`, [[eqL('x'), x, plus ? `${jn(Rm[0][1])}-${jn(Bm0[0][1])}` : `${jn(Rm[0][1])}+${jn(Bm0[0][1])}`], [eqL('y'), y, plus ? `${jn(Rm[1][1])}-${jn(A0[1][1])}` : `${jn(A0[1][1])}-${jn(Rm[1][1])}`]], {
          figure: show(`${mat(Ash)} ${op} ${mat(Bsh)} = ${mat(Rm)}`), rule: 'unknown-direct',
          explain: `좌변의 (1, 2) 성분은 ${nb(`${X} ${op} ${pn(Bm0[0][1])}`)}, (2, 2) 성분은 ${nb(`${sn(A0[1][1])} ${op} ${Y}`)}이다. 우변과 같아야 하므로 ${X} = ${sn(x)}, ${Y} = ${sn(y)}이다.`
        });
      }
      if (n === 1) {
        // (x, k1 / k2, m) + (y, k3 / k4, px) = (s, k1 + k3 / k2 + k4, y + t)
        const [x, y, p, m] = d.until(() => [nz(d, -6, 6), nz(d, -6, 6), d.pick([-3, -2, 2, 3]), nz(d, -9, 9)], ([xx, yy, pp, mm]) => xx + yy !== 0 && mm + pp * xx - yy !== 0);
        const [k1, k2, k3, k4] = nzs(d, -9, 9, 4), s = x + y, t = m + p * x - y;
        return vals(`다음 등식을 만족시키는 실수 ${X}, ${Vj('y', '의')} 값은?`, [[eqL('x'), x, `(${jn(s)}-${jn(m)}+${jn(t)})/(1+${jn(p)})`], [eqL('y'), y, `${jn(s)}-(${jn(s)}-${jn(m)}+${jn(t)})/(1+${jn(p)})`]], {
          figure: show(`${mat([[X, k1], [k2, m]])} + ${mat([[Y, k3], [k4, poly([[p, X]])]])} = ${mat([[s, k1 + k3], [k2 + k4, poly([[1, Y], [t, '']])]])}`), unseen: [1], rule: 'unknown-sys',
          explain: `대응하는 성분이 같으므로 ${nb(`${X} + ${Y}`)} = ${nb(`${sn(s)}`)}, ${nb(`${poly([[p, X], [m, '']])}`)} = ${nb(`${poly([[1, Y], [t, '']])}`)}이다. 이를 연립하여 풀면 ${X} = ${sn(x)}, ${Y} = ${sn(y)}이다.`
        });
      }
      // A + B 의 모든 성분의 합이 S 일 때 a
      const a = nz(d, -9, 9), A0 = rm(d, 2, 2, -9, 9, true), Bm0 = rm(d, 2, 2, -9, 9, true); A0[0][0] = a;
      const S = madd(A0, Bm0).flat().reduce((s, v) => s + v, 0);
      const Ash = A0.map((r, i) => r.map((v, j) => (i === 0 && j === 0 ? V('a') : v)));
      const rest = A0.flat().slice(1).concat(Bm0.flat());
      return num1(`두 행렬 ${V('A')}, ${Vj('B', '에')} 대하여 행렬 ${nb(`${V('A')} + ${V('B')}`)}의 모든 성분의 합이 ${sn(S)}일 때, 실수 ${Vj('a', '의')} 값은?`, a, {
        figure: show(nm('A', Ash), nm('B', Bm0)), calc: `${jn(S)}-(${rest.map(jn).join('+')})`, rule: 'unknown-sum',
        explain: `${nb(`${V('A')} + ${V('B')}`)}의 모든 성분의 합은 ${nb(`${V('a')} + (${sn(rest.reduce((s, v) => s + v, 0))})`)}이므로 ${nb(`${V('a')}`)} = ${nb(`${sn(S)} − (${sn(rest.reduce((s, v) => s + v, 0))})`)} = ${sn(a)}이다.`
      });
    }, { count: 3 }),
    T('addeq-x', '행렬 X 구하기', '①24', (d, n) => {
      const A = rm(d, 2, 2, -9, 9), Rm0 = rm(d, 2, 2, -9, 9);
      if (n === 0) {
        const left = d.bool(), Xv = msub(Rm0, A);
        return matQ(`다음 등식을 만족시키는 행렬 ${Vj('X', '을/를')} 구하시오.`, Xn, Xv, {
          figure: show(left ? `${Xn} + ${mat(A)} = ${mat(Rm0)}` : `${mat(A)} + ${Xn} = ${mat(Rm0)}`), calc: cAdd(Rm0, A, '-'), rule: 'x-add',
          explain: `${nb(`${Xn}`)} = ${nb(`${mat(Rm0)} − ${mat(A)}`)} = ${mat(Xv)}이다.`
        });
      }
      const Xv = msub(A, Rm0);
      return matQ(`다음 등식을 만족시키는 행렬 ${Vj('X', '을/를')} 구하시오.`, Xn, Xv, {
        figure: show(`${mat(A)} ${MINUS} ${Xn} = ${mat(Rm0)}`), calc: cAdd(A, Rm0, '-'), rule: 'x-sub',
        explain: `${Xn}${pj('X', '을/를')} 우변으로, 우변의 행렬을 좌변으로 옮기면 ${nb(`${Xn}`)} = ${nb(`${mat(A)} − ${mat(Rm0)}`)} = ${mat(Xv)}이다.`
      });
    }, { count: 2 }),
    T('addeq-kx', '실수배가 낀 행렬 X 구하기', '①25', (d, n) => {
      const Aa = V('A'), Bb = V('B');
      if (n === 0) {
        // kX = A + qB
        const [k, q, X0, Bm, A] = d.until(() => { const kk = d.pick([2, 3, -2, -3]), qq = d.pick([-3, -2, 2, 3]), X1 = rm(d, 2, 2, -5, 5), B1 = rm(d, 2, 2, -5, 5); return [kk, qq, X1, B1, msub(msc(kk, X1), msc(qq, B1))]; }, (v) => maxAbs(v[4]) <= 30);
        return matQ(`두 행렬 ${Aa}, ${Vj('B', '에')} 대하여 등식 ${nb(`${cf(k, Xn)} = ${poly([[1, Aa], [q, Bb]])}`)}${pj('B', '을/를')} 만족시키는 행렬 ${Vj('X', '을/를')} 구하시오.`, Xn, X0, {
          figure: show(nm('A', A), nm('B', Bm)), calc: A.map((r, i) => r.map((v, j) => `(${jn(v)}+${jn(q)}*${jn(Bm[i][j])})/${jn(k)}`)), rule: 'kx-one',
          explain: `${nb(poly([[1, Aa], [q, Bb]]))} = ${mat(madd(A, msc(q, Bm)))}이므로 모든 성분을 ${nj(k, '으로/로')} 나누면 ${Xn} = ${mat(X0)}이다.`
        });
      }
      // A − mX = n(B − X) → (n − m)X = nB − A
      const [m, nn, X0, Bm, A] = d.until(() => {
        const [mm, n2] = d.until(() => [d.int(1, 4), d.int(1, 4)], ([u, w]) => Math.abs(w - u) >= 1 && Math.abs(w - u) <= 2);
        const X1 = rm(d, 2, 2, -5, 5), B1 = rm(d, 2, 2, -5, 5); return [mm, n2, X1, B1, msub(msc(n2, B1), msc(n2 - mm, X1))];
      }, (v) => maxAbs(v[4]) <= 30);
      const lhs = `${Aa} ${MINUS} ${cf(m, Xn)}`, rhs = nn === 1 ? `${Bb} ${MINUS} ${Xn}` : `${nn}(${Bb} ${MINUS} ${Xn})`;
      return matQ(`두 행렬 ${Aa}, ${Vj('B', '에')} 대하여 등식 ${nb(`${lhs} = ${rhs}`)}${pj('X', '을/를')} 만족시키는 행렬 ${Vj('X', '을/를')} 구하시오.`, Xn, X0, {
        figure: show(nm('A', A), nm('B', Bm)), calc: A.map((r, i) => r.map((v, j) => `(${nn}*${jn(Bm[i][j])}-${jn(v)})/(${nn}-${m})`)), unseen: [1], rule: 'kx-both',
        explain: `괄호를 풀고 ${Xn}${pj('X', '이/가')} 있는 항을 한쪽으로 모으면 ${nb(`${cf(nn - m, Xn)}`)} = ${nb(`${poly([[nn, Bb], [-1, Aa]])}`)}이다. ${nb(poly([[nn, Bb], [-1, Aa]]))} = ${mat(msub(msc(nn, Bm), A))}이므로 ${Xn} = ${mat(X0)}이다.`
      });
    }, { count: 2 }),
    T('addeq-sys', '두 행렬의 연립 등식', '①26', (d) => {
      const [[a1, b1], [a2, b2]] = d.pick([[[1, 1], [1, -1]], [[1, -1], [2, 1]], [[3, 1], [2, -1]], [[1, -3], [2, -1]], [[2, 1], [3, -1]], [[2, 1], [1, -1]]]);
      const [nA, nB] = d.pick([['A', 'B'], ['X', 'Y']]), Aa = V(nA), Bb = V(nB);
      const A0 = rm(d, 2, 2, -6, 6), B0 = rm(d, 2, 2, -6, 6), P = madd(msc(a1, A0), msc(b1, B0)), Qm = madd(msc(a2, A0), msc(b2, B0));
      const wantA = d.bool(), ans = wantA ? A0 : B0, det = `(${jn(a1)}*${jn(b2)}-${jn(a2)}*${jn(b1)})`;
      const calc = P.map((r, i) => r.map((v, j) => (wantA ? `(${jn(b2)}*${jn(v)}-${jn(b1)}*${jn(Qm[i][j])})/${det}` : `(${jn(a1)}*${jn(Qm[i][j])}-${jn(a2)}*${jn(v)})/${det}`)));
      return matQ(`두 2×2 행렬 ${Aa}, ${Vj(nB, '이/가')} 다음 두 등식을 만족시킬 때, 행렬 ${Vj(wantA ? nA : nB, '을/를')} 구하시오.`, V(wantA ? nA : nB), ans, {
        figure: rowsOf([`${poly([[a1, Aa], [b1, Bb]])} = ${mat(P)}`, `${poly([[a2, Aa], [b2, Bb]])} = ${mat(Qm)}`]), calc, unseen: [1],
        explain: `두 등식을 연립방정식처럼 한 행렬을 지워서 푼다. ${Aa} = ${mat(A0)}, ${Bb} = ${mat(B0)}이다.`
      });
    }),
    T('addeq-comb', '일차결합의 계수 구하기', '①27', (d, n) => {
      const X = V('x'), Y = V('y'), Aa = V('A'), Bb = V('B'), Cc = V('C');
      if (n === 0) {
        const [x, y] = [nz(d, -5, 5), nz(d, -5, 5)];
        const [a, b] = d.until(() => [rm(d, 2, 1, -5, 5), rm(d, 2, 1, -5, 5)], ([u, w]) => u[0][0] * w[1][0] - w[0][0] * u[1][0] !== 0);
        const c = madd(msc(x, a), msc(y, b)), det = `(${jn(a[0][0])}*${jn(b[1][0])}-${jn(b[0][0])}*${jn(a[1][0])})`;
        return vals(`세 행렬 ${V('A')}, ${V('B')}, ${Vj('C', '에')} 대하여 ${nb(`${Cc} = ${X}${Aa} + ${Y}${Bb}`)}일 때, 실수 ${X}, ${Vj('y', '의')} 값은?`, [[eqL('x'), x, `(${jn(c[0][0])}*${jn(b[1][0])}-${jn(b[0][0])}*${jn(c[1][0])})/${det}`], [eqL('y'), y, `(${jn(a[0][0])}*${jn(c[1][0])}-${jn(c[0][0])}*${jn(a[1][0])})/${det}`]], {
          figure: show(nm('A', a), nm('B', b), nm('C', c)), rule: 'comb-col',
          explain: `${nb(`${X}${Aa} + ${Y}${Bb}`)} = ${mat([[poly([[a[0][0], X], [b[0][0], Y]])], [poly([[a[1][0], X], [b[1][0], Y]])]])}이므로 성분을 비교하여 연립하면 ${X} = ${sn(x)}, ${Y} = ${sn(y)}이다.`
        });
      }
      const [x, y] = [nz(d, -4, 4), nz(d, -4, 4)];
      const [a, b] = d.until(() => [rm(d, 2, 2, -4, 4), rm(d, 2, 2, -4, 4)], ([u, w]) => u[0][0] * w[0][1] - w[0][0] * u[0][1] !== 0);
      const c = madd(msc(x, a), msc(y, b)), det = `(${jn(a[0][0])}*${jn(b[0][1])}-${jn(b[0][0])}*${jn(a[0][1])})`;
      const xs = `(${jn(c[0][0])}*${jn(b[0][1])}-${jn(b[0][0])}*${jn(c[0][1])})/${det}`, ys = `(${jn(a[0][0])}*${jn(c[0][1])}-${jn(c[0][0])}*${jn(a[0][1])})/${det}`;
      const P = V('p'), Qv = V('q');
      return vals(`세 행렬 ${V('A')}, ${V('B')}, ${Vj('C', '에')} 대하여 ${nb(`${X}${Aa} + ${Y}${Bb} = ${Cc}`)}일 때, 실수 ${X}, ${Y}, ${P}, ${Vj('q', '의')} 값은?`,
        [[eqL('x'), x, xs], [eqL('y'), y, ys], [eqL('p'), c[1][0], `${xs}*${jn(a[1][0])}+${ys}*${jn(b[1][0])}`], [eqL('q'), c[1][1], `${xs}*${jn(a[1][1])}+${ys}*${jn(b[1][1])}`]], {
        figure: show(nm('A', a), nm('B', b), nm('C', [[c[0][0], c[0][1]], [P, Qv]])), rule: 'comb-2x2',
        explain: `제1행의 성분을 비교하면 ${nb(`${poly([[a[0][0], X], [b[0][0], Y]])}`)} = ${nb(`${sn(c[0][0])}`)}, ${nb(`${poly([[a[0][1], X], [b[0][1], Y]])}`)} = ${nb(`${sn(c[0][1])}`)}이므로 ${X} = ${sn(x)}, ${Y} = ${sn(y)}이다. 제2행에서 ${P} = ${sn(c[1][0])}, ${Qv} = ${sn(c[1][1])}이다.`
      });
    }, { count: 2 })
  ];

  // ── 덧셈·뺄셈·실수배의 활용 ──
  const WORDS = ['LOVE', 'HOME', 'GIFT', 'BOOK', 'CAKE', 'STAR', 'MOON', 'FISH', 'KING', 'TREE', 'BLUE', 'RAIN', 'SNOW', 'BIRD', 'LION', 'MILK', 'ROSE', 'SHIP', 'GOLD', 'WIND', 'DOOR', 'FROG', 'BEAR', 'DUCK', 'LAMP', 'SAND'];
  const code = (ch) => ch.charCodeAt(0) - 64;
  const wordMat = (w) => [[code(w[0]), code(w[1])], [code(w[2]), code(w[3])]];
  // 알파벳과 수의 대응표(아홉 칸씩 세 줄)
  function letterTable() {
    const L = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)), cell = 'style="padding:2px 5px;font-size:0.92rem;text-align:center;border:1px solid #8a96a3"';
    let rows = '';
    for (let s = 0; s < 26; s += 9) {
      const part = L.slice(s, s + 9);
      rows += '<tr>' + part.map((ch) => `<td ${cell}><b>${ch}</b></td>`).join('') + '</tr><tr>' + part.map((ch) => `<td ${cell}>${code(ch)}</td>`).join('') + '</tr>';
    }
    return `<table class="mb-table" style="border-collapse:collapse" aria-label="A부터 Z까지 차례로 1부터 26까지 대응시킨 표">${rows}</table>`;
  }
  const addLifeTypes = [
    T('life-add', '두 표를 합치거나 빼기', '①28', (d, n) => {
      if (n === 0) {
        const [p1, p2] = d.shuffle(NAMES).slice(0, 2), items = ['교통비', '간식비'];
        const A = rm(d, 2, 2, 5, 40, true), Bm = rm(d, 2, 2, 5, 40, true), Rm = madd(A, Bm);
        const tb = (X, mon) => table([`${mon}(천 원)`, p1, p2], items.map((it, i) => [it, String(X[i][0]), String(X[i][1])]));
        return matQ(`다음은 ${name(p1, '과/와')} ${name(p2, '의/의')} 1월, 2월 지출을 나타낸 표이다. 1월의 표를 행렬 ${Vj('A', '으로/로')}, 2월의 표를 행렬 ${Vj('B', '으로/로')} 나타낼 때(행은 항목, 열은 사람), 두 달 동안의 지출을 나타내는 행렬 ${nb(`${V('A')} + ${V('B')}`)}를 구하시오.`, `${V('A')} + ${V('B')}`, Rm, {
          figure: tb(A, '1월') + tb(Bm, '2월'), calc: cAdd(A, Bm), signed: false, rule: 'life-sum',
          explain: `같은 자리의 금액끼리 더하면 ${nb(`${V('A')} + ${V('B')}`)} = ${mat(Rm)}이다.`
        });
      }
      if (n === 1) {
        const [p1, p2] = d.shuffle(NAMES).slice(0, 2), goal = d.pick([30000, 32000, 35000]);
        const days = d.until(() => [0, 1, 2].map(() => [d.int(70, 130) * 100, d.int(70, 130) * 100]), (ds) => [0, 1].every((k) => { const rest = goal - ds.reduce((s, r) => s + r[k], 0); return rest > 0 && rest <= 9999; }));
        const D = [[goal], [goal]], sum = [0, 1].map((k) => days.reduce((s, r) => s + r[k], 0)), Rm = [[goal - sum[0]], [goal - sum[1]]];
        const tbl = table(['(단위: 걸음)', p1, p2], days.map((r, i) => [`${i + 1}일`, String(r[0]), String(r[1])]));
        return matQ(`다음은 ${name(p1, '과/와')} ${name(p2, '이/가')} 3일 동안 걸은 걸음 수이다. 1일, 2일, 3일의 걸음 수를 차례로 2×1 행렬 ${V('A')}, ${V('B')}, ${Vj('C', '으로/로')}(제1행은 ${p1}, 제2행은 ${p2}), 두 사람의 목표 걸음 수를 행렬 ${Vj('D', '으로/로')} 나타낼 때, 목표를 이루려고 4일째에 더 걸어야 하는 걸음 수를 나타내는 행렬 ${nb(`${V('D')} − (${V('A')} + ${V('B')} + ${V('C')})`)}를 구하시오.`, null, Rm, {
          figure: tbl + show(nm('D', D)), calc: [[`${goal}-${days[0][0]}-${days[1][0]}-${days[2][0]}`], [`${goal}-${days[0][1]}-${days[1][1]}-${days[2][1]}`]], signed: false, rule: 'life-left',
          explain: `${nb(`${V('A')} + ${V('B')} + ${V('C')}`)} = ${mat([[sum[0]], [sum[1]]])}이므로 ${nb(`${V('D')} − (${V('A')} + ${V('B')} + ${V('C')})`)} = ${mat(Rm)}이다.`
        });
      }
      const pct = d.pick([20, 40, 50]), step = pct === 50 ? 1000 : 500;
      const A = rm(d, 2, 2, 4, 18, true).map((r) => r.map((v) => v * step)), Rm = A.map((r) => r.map((v) => (v * (100 - pct)) / 100));
      const tbl = table(['(단위: 원)', '체험관', '박물관'], [['어른', String(A[0][0]), String(A[0][1])], ['어린이', String(A[1][0]), String(A[1][1])]]);
      return matQ(`다음은 어느 지역의 관광지 입장료이다. 입장료를 표와 같은 차례로 2×2 행렬 ${Vj('A', '으로/로')} 나타낼 때, 지역 주민이 입장료의 ${pct} %를 할인받아 내는 금액을 나타내는 행렬을 구하시오.`, null, Rm, {
        figure: tbl, calc: A.map((r) => r.map((v) => `${v}*(100-${pct})/100`)), unseen: [100], signed: false, rule: 'life-discount',
        explain: `${pct} %를 할인받으면 입장료의 ${(100 - pct) / 100}배를 낸다. ${nb(`${(100 - pct) / 100}${V('A')}`)} = ${mat(Rm)}이다.`
      });
    }, { count: 3 }),
    T('life-compare', '연산 결과로 비교해 고르기', '①29', (d, n) => {
      const who = d.shuffle(NAMES).slice(0, 4);
      // 1차, 2차 기록(m, 소수 둘째 자리)
      const [a, b] = d.until(() => { const first = [0, 1, 2, 3].map(() => d.int(26, 44) * 5); const gain = [0, 1, 2, 3].map(() => d.int(1, 8) * 5); return [first, first.map((v, i) => v + gain[i])]; },
        ([x, y]) => new Set(y.map((v, i) => v - x[i])).size === 4 && new Set(y.map((v, i) => v + x[i])).size === 4);
      const m = (v) => (v / 100).toFixed(2), A = [[m(a[0]), m(a[1])], [m(a[2]), m(a[3])]], Bm = [[m(b[0]), m(b[1])], [m(b[2]), m(b[3])]];
      const head = `네 학생 ${who.join(', ')}의 제자리멀리뛰기 1차 기록과 2차 기록을 각각 행렬 ${V('A')}, ${Vj('B', '으로/로')} 나타냈다. 두 행렬의 (1, 1), (1, 2), (2, 1), (2, 2) 성분은 차례로 ${who.join(', ')}의 기록이다(단위: m).`;
      const fig = show(nm('A', A), nm('B', Bm));
      if (n === 0) {
        const diff = b.map((v, i) => v - a[i]), best = diff.indexOf(Math.max(...diff));
        return C(`${head} 행렬 ${nb(`${V('B')} − ${V('A')}`)}를 이용할 때, 1차 기록보다 2차 기록이 가장 많이 늘어난 학생은?`, who, best, {
          figure: fig, explain: `${nb(`${V('B')} − ${V('A')}`)} = ${mat([[m(diff[0]), m(diff[1])], [m(diff[2]), m(diff[3])]])}에서 가장 큰 성분은 ${m(diff[best])}이므로 ${who[best]}이다.`,
          facts: { choose: { exprs: [0, 1, 2, 3].map((i) => `${m(b[i])}-${m(a[i])}`), rule: 'max' } }
        });
      }
      const avg = b.map((v, i) => v + a[i]), best = avg.indexOf(Math.max(...avg));
      return C(`${head} 행렬 ${nb(`${frac(1, 2)}(${V('A')} + ${V('B')})`)}를 이용할 때, 두 기록의 평균이 가장 큰 학생은?`, who, best, {
        figure: fig, explain: `${nb(`${frac(1, 2)}(${V('A')} + ${V('B')})`)} = ${mat([[0, 1], [2, 3]].map((r) => r.map((i) => String(Number((avg[i] / 200).toFixed(3))))))}에서 가장 큰 성분은 ${who[best]}의 평균이다.`,
        facts: { choose: { exprs: [0, 1, 2, 3].map((i) => `(${m(a[i])}+${m(b[i])})/2`), rule: 'max' }, unseen: [2] }
      });
    }, { count: 2 }),
    T('life-code-add', '덧셈으로 만든 암호', '①30', (d, n) => {
      const K = d.until(() => rm(d, 2, 2, -7, 7), (X) => X.flat().some((v) => v < 0));
      const intro = `표와 같이 A부터 Z까지의 알파벳에 1부터 26까지의 자연수를 차례로 대응시키고, 네 글자 영어 낱말의 글자에 대응하는 수를 차례로 (1, 1), (1, 2), (2, 1), (2, 2) 성분으로 하는 행렬 ${V('A')}에 열쇠 행렬 ${Vj('M', '을/를')} 더한 행렬 ${nb(`${V('A')} + ${V('M')}`)}${pj('M', '을/를')} 암호로 쓴다.`;
      const fig = letterTable() + show(nm('M', K));
      if (n === 0) {
        const w = d.pick(WORDS), A = wordMat(w), Rm = madd(A, K);
        return matQ(`${intro} 낱말 ${w}의 암호를 구하시오.`, null, Rm, {
          figure: fig, calc: cAdd(A, K), rule: 'code-add',
          explain: `${w}${pj(w, '은/는')} ${A.flat().join(', ')}에 대응하므로 ${V('A')} = ${mat(A)}이고 암호는 ${nb(`${V('A')} + ${V('M')}`)} = ${mat(Rm)}이다.`
        });
      }
      const words = d.shuffle(WORDS).slice(0, 4), w = words[0], Rm = madd(wordMat(w), K);
      return pickOne(d, `${intro} 암호가 ${mat(Rm)}일 때, 원래 낱말은?`, words.map((x, i) => [x, i === 0]), {
        figure: fig, explain: `${nb(`${V('A')}`)} = ${nb(`${mat(Rm)} − ${V('M')}`)} = ${mat(wordMat(w))}이고 ${wordMat(w).flat().join(', ')}${tail(code(w[3]), '은/는')} ${w.split('').join(', ')}이다.`
      });
    }, { count: 2 })
  ];

  B.kit.m1018 = {
    S1, S2, UNIT, T, sourceOf, sn, pn, jn, nj, range, nzs, cf, hasB, pj, Vj, SQ, sub, aij, ent2, ej, IJ, ent, PAR, gridOf, mat, matSlots, nm, FIG, show, rowsOf, capt,
    madd, msub, msc, mmul, same, EYE, maxAbs, cAdd, cMul, cOf, rm, matQ, vals, eqL, num1, pickOne, UNIT_E, UNIT_O, WORDS, code, wordMat, letterTable
  };

  B.addUnit({
    id: '10-1-8', grade: 10, semester: 1, no: 8, title: '행렬과 그 연산', version: 1,
    groups: [
      { id: 'meaning', title: '행렬의 뜻', standard: S1, types: meaningTypes },
      { id: 'equal', title: '두 행렬이 서로 같을 조건', standard: S1, types: equalTypes },
      { id: 'addsub', title: '행렬의 덧셈, 뺄셈, 실수배', standard: S2, types: addTypes },
      { id: 'addeq', title: '덧셈, 뺄셈, 실수배와 등식', standard: S2, types: addEqTypes },
      { id: 'addlife', title: '덧셈, 뺄셈, 실수배의 활용', standard: S2, types: addLifeTypes }
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
