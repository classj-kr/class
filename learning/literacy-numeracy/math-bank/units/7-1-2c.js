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
//
// 2026-10-13 다시 실은 꼴(실력 묶음의 끝 hard-abs-cond-pair 부터 hard-mix-fracpow 까지, 기본은 파일 끝의 sub-ends-between · sub-net-opposite · div-recip-back)
//  처음 지을 때 「조건 풀이·경우 따지기」「수 퍼즐」「요령이 드는 긴 합·곱」「지나치게 복잡한 계산」「거꾸로 두 번」이라는 까닭으로 뺀 꼴을 다시 보아,
//  이 단원과 앞 단원(소인수분해)에서 배운 것만으로 풀리는 것은 모두 실었다(사용자: 「수학실력에 필요해보이는문제는 다 넣어」).
//  그대로 빼 둔 것: 부등식 풀이 꼴(①33 심21)·지수법칙(심42)·절댓값이 든 방정식(심64)은 상위 학년, 새로 약속한 이항연산(심57·58·59)은 교육과정의 금,
//  따로 구한 값을 다시 셈하는 것은 뜻 없는 셈, 음수가 나오지 않는 것은 하위 학년 문제, 그림을 알 수 없는 것(②51 심61·62).
//  「x보다 크지 않은 정수 가운데 가장 큰 수 [x]」(심56)는 두 수를 셈하는 이항연산이 아니라 대소 관계의 뜻을 대는 기호여서 실었다.
//  긴 식은 휴대폰 한 줄(17em 안팎)에 들어가게 길이를 재어 고르고, 이어지는 긴 합·곱은 두 줄로 적는다(longEx).
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

  // ══ 다시 실은 꼴(2026-10-13)에 쓰는 도구 ══
  const { emOf, fit, tagged, plain, okKind, biggest, commonTold } = K;
  const { mixed, name, NAMES, lines } = B.kit;
  const CONDS = ['㈎', '㈏', '㈐', '㈑'];
  // 검사 식에 적는 정수(음수는 괄호에 넣는다)
  const e = (v) => (v < 0 ? '(' + v + ')' : String(v));
  // 수 목록 뒤의 토씨: 마지막 수의 끝소리에 맞춘다.
  const listJ = (list, pair) => list.map(iq).join(', ') + tail(Math.abs(list[list.length - 1]), pair);
  // 세 문자의 대소를 고르는 보기. names: 문자 글 셋, asc: 작은 것부터 놓은 차례(names 의 번호).
  const ORDERS = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];
  function orderChoice(d, names, asc) {
    const right = asc.join(), rows = d.shuffle([asc].concat(d.shuffle(ORDERS.filter((o) => o.join() !== right)).slice(0, 3)));
    return { options: rows.map((o) => nb(o.map((i) => names[i]).join(` ${LT} `))), at: rows.findIndex((o) => o.join() === right), truth: rows.map((o) => o.join() === right) };
  }
  // 가로·세로 세 칸인 표. cells: 아홉 칸에 적는 글(위 줄 왼쪽부터), said: 그림 설명에 적는 글.
  function gridFig(cells, said) {
    const td = (h) => `<td style="width:3em;height:3em;padding:0;background:#fff;font-weight:600;font-size:1.05rem">${h}</td>`;
    const row = (r) => '<tr>' + [0, 1, 2].map((c) => td(cells[3 * r + c])).join('') + '</tr>', told = (r) => [0, 1, 2].map((c) => said[3 * r + c]).join(', ');
    return `<div class="mb-table-wrap"><table class="mb-table" aria-label="가로 세 칸, 세로 세 칸인 표. 첫째 줄은 왼쪽부터 ${told(0)} / 둘째 줄은 ${told(1)} / 셋째 줄은 ${told(2)}"><tbody>${row(0)}${row(1)}${row(2)}</tbody></table></div>`;
  }
  // 삼각형의 세 꼭짓점과 세 변의 가운데에 수를 하나씩 놓은 그림. v: 꼭짓점(위, 왼쪽 아래, 오른쪽 아래)의 글, m: 변의 가운데(왼쪽 변, 아래 변, 오른쪽 변)의 글.
  // 변은 동그라미와 동그라미 사이에만 긋는다(선이 수를 지나지 않게).
  function triFig(v, m) {
    const R = 17, P3 = [[110, 24], [32, 150], [188, 150]], mid = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2], M3 = [mid(P3[0], P3[1]), mid(P3[1], P3[2]), mid(P3[2], P3[0])];
    const link = (p, q) => { const len = Math.hypot(q[0] - p[0], q[1] - p[1]), ux = (q[0] - p[0]) / len, uy = (q[1] - p[1]) / len; return `<line x1="${(p[0] + ux * R).toFixed(1)}" y1="${(p[1] + uy * R).toFixed(1)}" x2="${(q[0] - ux * R).toFixed(1)}" y2="${(q[1] - uy * R).toFixed(1)}" style="stroke:#5b6770;stroke-width:1.4"/>`; };
    const node = (p, label) => `<circle cx="${p[0]}" cy="${p[1]}" r="${R}" style="fill:#fff;stroke:#1f2933;stroke-width:1.3"/><text x="${p[0]}" y="${p[1] + 5}" text-anchor="middle" style="font-size:14.5px;font-weight:600;fill:#1f2933">${label}</text>`;
    return `<svg class="mb-geo" viewBox="0 0 220 174" width="220" role="img" aria-label="삼각형의 세 꼭짓점과 세 변의 가운데에 수가 하나씩 놓인 그림. 왼쪽 변에는 위에서부터 ${v[0]}, ${m[0]}, ${v[1]} / 아래 변에는 왼쪽부터 ${v[1]}, ${m[1]}, ${v[2]} / 오른쪽 변에는 위에서부터 ${v[0]}, ${m[2]}, ${v[2]}">`
      + [[P3[0], M3[0]], [M3[0], P3[1]], [P3[1], M3[1]], [M3[1], P3[2]], [P3[2], M3[2]], [M3[2], P3[0]]].map(([p, q]) => link(p, q)).join('') + P3.map((p, i) => node(p, v[i])).join('') + M3.map((p, i) => node(p, m[i])).join('') + '</svg>';
  }
  // 정육면체의 전개도: 가운데 줄에 네 면, 그 위와 아래에 한 면씩. row: 가운데 줄의 글 넷, up·down: [붙은 칸의 번호(0~3), 글].
  function netFig(row, up, down) {
    const s = 40, x0 = 6, y0 = 6, NTH = ['첫째', '둘째', '셋째', '넷째'];
    const cell = (c, r, label) => `<rect x="${x0 + c * s}" y="${y0 + r * s}" width="${s}" height="${s}" style="fill:#fff;stroke:#1f2933;stroke-width:1.2"/><text x="${x0 + c * s + s / 2}" y="${y0 + r * s + s / 2 + 5}" text-anchor="middle" style="font-size:14.5px;font-weight:600;fill:#1f2933">${label}</text>`;
    return `<svg class="mb-geo" viewBox="0 0 ${4 * s + 12} ${3 * s + 12}" width="${4 * s + 12}" role="img" aria-label="정육면체의 전개도. 가운데 줄에 네 면이 왼쪽부터 ${row.join(', ')}의 차례로 붙어 있다. 가운데 줄의 ${NTH[up[0]]} 면 위쪽에 붙은 면에는 ${up[1]}, ${NTH[down[0]]} 면 아래쪽에 붙은 면에는 ${down[1]}">`
      + cell(up[0], 0, up[1]) + row.map((label, c) => cell(c, 1, label)).join('') + cell(down[0], 2, down[1]) + '</svg>';
  }
  // 길게 이어지는 식: 앞의 몇 항과 끝의 몇 항만 적고 가운데는 ⋯ 로 줄인다. 한 줄에 들어가지 않으면 끝 항들을 둘째 줄로 내려 적는다.
  function longEx(head, tailTerms, op) {
    // 괄호에 든 분수가 이어지는 식은 너비 어림(emOf)보다 한 할쯤 넓게 그려지므로 그만큼 더해 글씨 크기를 정한다.
    const mark = ` <i>${op}</i> `, one = head.concat(['⋯'], tailTerms).join(mark);
    if (emOf(one) <= 15.4) return ex(one, emOf(one) * 0.12);
    const first = head.concat(['⋯']).join(mark), second = `<i>${op}</i> ` + tailTerms.join(mark), style = fit(Math.max(emOf(first), emOf(second) + 1.6) * 1.12), span = (h) => `<span class="mb-expr"${style}>${h}</span>`;
    return lines([span(first), `<span style="display:inline-block;padding-left:1.6em">${span(second)}</span>`]);
  }

  B.addGroup('7-1-2', {
    id: 'hard', title: '단원 종합', standard: STD5,
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
      }),

      // ══ 다시 실은 꼴(2026-10-13) ══
      // 처음 지을 때 「조건 풀이·경우 따지기」「수 퍼즐」「요령이 드는 긴 합·곱」「지나치게 복잡한 계산」「거꾸로 두 번」이라는 까닭으로 뺀 꼴을 다시 보고 덧붙였다
      // (사용자: 「수학실력에 필요해보이는문제는 다 넣어」). 상위 학년·뒤 단원의 내용이 있어야 풀리는 것, 사칙계산 이외의 이항연산, 뜻 없는 셈, 그림을 알 수 없는 것은 그대로 빼 두었다.
      // 판정은 references/textbooks/수학/_분석/7-1-2/싣기_대조표.md 의 「2026-10-13 다시 싣기」에 있다.
      // ── ① 문제의 말·조건에 함정이 있어 뜻을 정확히 대야 풀리는 문제 ──
      H('hard-abs-cond-pair', '절댓값과 대소 조건으로 두 정수 정하기', '기본 ①24', (d) => {
        // 함정: 「절댓값이 1보다 작은 정수」로 0을 떠올리지 못하는 아이, 절댓값이 1인 두 수 가운데 하나를 대소 조건으로 고르지 못하는 아이.
        const swap = d.bool(), less = d.bool(), a = V('a'), b = V('b'), p = swap ? b : a, q = swap ? a : b, pv = less ? -1 : 1, vals = swap ? [0, pv] : [pv, 0];
        const rows = [`${p}의 절댓값은 1이다.`, d.bool() ? `${p}의 절댓값은 ${q}의 절댓값보다 크다.` : `${q}의 절댓값은 ${p}의 절댓값보다 작다.`, `${p}는 ${q}보다 ${less ? '작다' : '크다'}.`];
        return M(`두 정수 ${a}, ${b}가 다음 조건을 모두 만족시킬 때, ${a}, ${b}의 값은?`, [{ label: a, answer: vals[0], signed: true }, { label: b, answer: vals[1], signed: true }], {
          figure: tagged(rows, CONDS), shown: `${nb(`${a} = ${iq(vals[0])}`)}, ${nb(`${b} = ${iq(vals[1])}`)}`,
          explain: `㈎에서 ${p}는 1 또는 −1이다. ㈏에서 ${q}의 절댓값은 1보다 작고, 절댓값이 1보다 작은 정수는 0뿐이므로 ${nb(`${q} = 0`)}이다. ㈐에서 ${p}는 0보다 ${less ? '작으므로' : '크므로'} ${nb(`${p} = ${iq(pv)}`)}이다.`,
          facts: { calc: vals.map((v, i) => [v < 0 ? '-1' : String(v), i]), unseen: [0] }
        });
      }, { standard: STD4 }),
      H('hard-floor', '「크지 않은 정수 가운데 가장 큰 수」로 약속한 기호가 있는 계산', '심56', (d) => {
        // 함정: [−3.5]를 −3이라 하는 아이(소수점 아래를 떼기만 한다). −3.5보다 크지 않은 정수는 −4, −5, …이고 그 가운데 가장 큰 수는 −4이다.
        const x = V('x'), low = (t) => Math.floor(fl(t));
        const negD = () => dc(-d.until(() => d.int(11, 69), (t) => t % 10 !== 0)), negF = () => qneg(fr(d, [2, 3, 4, 5], 3)), posF = () => d.until(() => fr(d, [2, 3, 4, 5], 8), (t) => fl(t) > 1);
        const xs = d.until(() => (d.bool() ? [negD(), posF(), negF(), posF()] : [negF(), posF(), negD(), posF()]), (list) => { const f = list.map(low); return distinct(list.map(qabs)) && f[2] % f[3] === 0 && f[3] > 1 && Math.abs(f[0] * f[1]) <= 40 && f[0] * f[1] - f[2] / f[3] !== 0; });
        const f = xs.map(low), br = (t) => `[${tx(t)}]`, sum = [S(Q(f[0])), '*', S(Q(f[1])), '-', S(Q(f[2])), '/', S(Q(f[3]))];
        // 검사 식: 정수만 쓰는 버림. 분수 p/q 는 (p − (p를 q로 나눈 나머지)) ÷ q, 소수는 소수 부분을 뺀다(음수의 나머지는 q나 1을 더해 양수로 맞춘다).
        const lowJs = (t) => (t.d ? `(${js(t)}-(((${js(t)}%1)+1)%1))` : `((${e(t.p)}-(((${e(t.p)}%${t.q})+${t.q})%${t.q}))/${t.q})`), F = xs.map(lowJs);
        return ansV(`[${x}]는 ${x}보다 크지 않은 정수 가운데 가장 큰 수를 나타낸다. 다음을 계산하시오.`, val(sum), 'int', {
          figure: ex(`${br(xs[0])} <i>×</i> ${br(xs[1])} <i>−</i> ${br(xs[2])} <i>÷</i> ${br(xs[3])}`),
          explain: `${xs.map((t, i) => `${br(t)} = ${iq(f[i])}`).join(', ')}이다. ${tx(xs[0])}보다 크지 않은 정수 가운데 가장 큰 수는 ${josaNum(f[0] + 1, '이/가')} 아니라 ${iq(f[0])}이다. ${chainOf(sum)}이다.`,
          facts: { value: `${F[0]}*${F[1]}-${F[2]}/${F[3]}`, unseen: [1], rule: 'floor-sign' }
        });
      }, { standard: STD4 }),
      H('hard-pow-any-n', '홀짝을 모르는 자연수 n이 지수인 −1의 거듭제곱', '심32 / 기본 ①65', (d) => {
        // 함정: n이 홀수인지 짝수인지 모르면 값을 구할 수 없다고 여기는 아이. 2 × n은 언제나 짝수이고, n과 n + 1은 홀짝이 서로 다르며, n과 n + 2는 홀짝이 같다.
        const nn = V('n'), near = d.bool(), pw = (h) => `(−1)${sup(h)}`, s = pm(d);
        // [글, n = 1일 때의 지수(검사 식), 계수]. 짝을 이루는 두 항은 합이 늘 0이 되게 계수를 맞춘다.
        const pair = near ? [[pw(nn), '1', s], [pw(`${nn}+1`), '(1+1)', s]] : [[pw(nn), '1', s], [pw(`${nn}+2`), '(1+2)', -s]];
        const fixed = [[pw(`2×${nn}`), '(2*1)', pm(d)], [pw(`2×${nn}+1`), '(2*1+1)', pm(d)]], terms = d.shuffle(pair.concat(fixed)), v = fixed[0][2] - fixed[1][2];
        return ansV(`${nn}이 자연수일 때, 다음 식의 값은?`, Q(v), 'int', {
          figure: ex(terms.map((t, i) => (i === 0 ? (t[2] < 0 ? MINUS : '') : ` <i>${t[2] < 0 ? MINUS : '+'}</i> `) + t[0]).join(''), 1.8),
          explain: `−1을 짝수 번 곱하면 1, 홀수 번 곱하면 −1이다. 2 × ${nn}은 짝수, 2 × ${nn} + 1은 홀수이므로 ${fixed[0][0]} = 1, ${fixed[1][0]} = −1이다. `
            + (near ? `${nn}과 ${nn} + 1은 하나가 홀수이면 다른 하나는 짝수이므로 ${pair[0][0]}과 ${pair[1][0]}은 하나가 1이면 다른 하나는 −1이고, 두 수의 합은 늘 0이다.` : `${nn}과 ${nn} + 2는 둘 다 홀수이거나 둘 다 짝수이므로 ${pair[0][0]}과 ${pair[1][0]}의 값은 같고, 두 수의 차는 늘 0이다.`)
            + ` 따라서 식의 값은 ${fixed[0][2] < 0 ? MINUS : ''}1 ${fixed[1][2] < 0 ? MINUS : '+'} (−1) = ${iq(v)}이다.`,
          facts: { value: terms.map((t, i) => (t[2] < 0 ? '-' : i ? '+' : '') + `((-1)**${t[1]})`).join('') }
        });
      }),
      H('hard-three-order', '절댓값과 대소 조건으로 세 수의 크기 순서 정하기', '심20 / 기본 ②22', (d, n) => {
        // x 는 절댓값이 정해진 수이다. 절댓값이 같은 두 수 가운데 조건에 맞는 것을 고르고(함정: 둘 다 된다고 여기거나 부호를 거꾸로 고른다), 나머지 조건을 대소로 옮긴다.
        const L = ['a', 'b', 'c'].map(V), [xi, yi, zi] = d.shuffle([0, 1, 2]), x = L[xi], y = L[yi], z = L[zi], k = d.int(2, 6), flip = d.bool();
        const both = (i, j) => (i < j ? `${L[i]}와 ${L[j]}` : `${L[j]}와 ${L[i]}`), line = (asc) => nb(asc.map((i) => L[i]).join(` ${LT} `));
        const text = `서로 다른 세 ${n === 0 ? '수' : '정수'} ${L.join(', ')}가 다음 조건을 모두 만족시킬 때, 세 수의 대소 관계를 바르게 나타낸 것은?`;
        if (n === 0) {
          // 같은 쪽에 있는 두 수 x, y 와 반대쪽의 z: 「이하」와 절댓값으로 x 를 정하면 y 는 그보다 작다.
          const m = flip ? d.int(-3, k - 1) : d.int(-k + 1, 3), edge = iq(flip ? k : -k), asc = flip ? [zi, xi, yi] : [yi, xi, zi], pick = orderChoice(d, L, asc);
          const rows = [`${both(xi, yi)}는 ${edge} ${flip ? '이상' : '이하'}이다.`, `${x}의 절댓값은 ${k}이다.`, `${z}는 ${iq(m)}보다 ${flip ? '작다' : '크다'}.`];
          return C(text, pick.options, pick.at, {
            figure: tagged(rows, CONDS),
            explain: `㈎, ㈏에서 ${x}는 ${edge} ${flip ? '이상' : '이하'}이고 절댓값이 ${k}이므로 ${nb(`${x} = ${edge}`)}이다. ${y}는 ${edge} ${flip ? '이상' : '이하'}이고 ${x}와 다른 수이므로 ${nb(flip ? `${x} ${LT} ${y}` : `${y} ${LT} ${x}`)}이다. `
              + `㈐에서 ${z}는 ${iq(m)}보다 ${flip ? '작고' : '크고'} ${josaNum(m, '은/는')} ${edge}보다 ${flip ? '작으므로' : '크므로'} ${nb(flip ? `${z} ${LT} ${x}` : `${x} ${LT} ${z}`)}이다. 따라서 ${line(asc)}이다.`,
            facts: { truth: pick.truth, want: true, rule: 'three-order-edge' }
          });
        }
        // 절댓값이 같은 두 수 가운데 한쪽 끝보다 큰(작은) 것을 고르고, 「더 가깝다」를 대소로 옮긴다.
        const far = iq(flip ? k : -k), near = iq(flip ? -k : k), asc = flip ? [yi, zi, xi] : [xi, zi, yi], pick = orderChoice(d, L, asc), side = flip ? '왼쪽' : '오른쪽';
        const rows = [`${both(xi, yi)}는 ${far}보다 ${flip ? '작다' : '크다'}.`, `${z}는 ${near}보다 ${flip ? '작다' : '크다'}.`, `${x}의 절댓값은 ${far}의 절댓값과 같다.`, `수직선에서 ${z}를 나타내는 점은 ${y}를 나타내는 점보다 ${far}${tail(k, '을/를')} 나타내는 점에 더 가깝다.`];
        return C(text, pick.options, pick.at, {
          figure: tagged(rows, CONDS),
          explain: `㈎, ㈐에서 ${x}는 절댓값이 ${k}이고 ${far}보다 ${flip ? '작으므로' : '크므로'} ${nb(`${x} = ${near}`)}이다. ㈏에서 ${z}는 ${near}보다 ${flip ? '작으므로' : '크므로'} ${nb(flip ? `${z} ${LT} ${x}` : `${x} ${LT} ${z}`)}이다. `
            + `㈎, ㈏에서 ${y}, ${z}를 나타내는 점은 모두 ${far}${tail(k, '을/를')} 나타내는 점의 ${side}에 있으므로, 그 점에 더 가까운 ${z}가 ${y}보다 ${flip ? '크다' : '작다'}. 따라서 ${line(asc)}이다.`,
          facts: { truth: pick.truth, want: true, rule: 'three-order-near' }
        });
      }, { count: 2, standard: STD4 }),

      // ── ② 세 단계 넘게 이어 생각해야 풀리는 문제 ──
      H('hard-between-fracs', '두 유리수 사이에 있는, 분모가 정해진 기약분수의 개수', '심18 / 기본 ①18', (d) => {
        // 두 끝을 정해진 분모로 통분하고(음수 쪽 끝을 거꾸로 대기 쉽다), 사이에 있는 분자를 늘어놓은 다음, 약분되는 것과 0을 뺀다.
        const [D, q1, q2, p1, p2] = d.pick([[6, 3, 2, 2, 3], [10, 5, 2, 2, 5], [12, 4, 3, 2, 3], [14, 7, 2, 2, 7], [15, 3, 5, 3, 5], [12, 3, 4, 2, 3], [10, 2, 5, 2, 5], [14, 2, 7, 2, 7]]);
        const [lo, hi] = d.until(() => [Q(-co(d, q1, 1, 2 * q1 - 1), q1), Q(co(d, q2, 1, 2 * q2 - 1), q2)], ([s, t]) => { const all = range(s.p * D / q1 + 1, t.p * D / q2 - 1), n = all.filter((k) => gcd(k, D) === 1).length; return n >= 4 && n <= 9 && all.length <= 20; });
        const from = lo.p * D / q1 + 1, to = hi.p * D / q2 - 1, ok = range(from, to).filter((k) => gcd(k, D) === 1);
        return N(`${tj(lo, '과/와')} ${tx(hi)} 사이에 있는 정수가 아닌 유리수 가운데 분모가 ${D}인 기약분수는 모두 몇 개인가?`, ok.length, {
          unit: '개',
          explain: `분모를 ${D}${tail(D, '으로/로')} 통분하면 ${tx(lo)} = ${MINUS}${frac(-lo.p * D / q1, D)}, ${tx(hi)} = ${frac(hi.p * D / q2, D)}이다. 두 수 사이에 있고 분모가 ${D}인 분수의 분자는 ${iq(from)}부터 ${iq(to)}까지의 정수이다. 이 가운데 분자가 0이거나 분모 ${D}${tail(D, '과/와')} 공약수가 있어 약분되는 것을 빼면, 분자는 ${ok.map(iq).join(', ')}의 ${ok.length}개이다.`,
          facts: { digit: { template: `(${lo.p * D / q1})<□<${hi.p * D / q2}>0<(□%${p1})*(□%${p1})*(□%${p2})*(□%${p2})`, lo: -45, hi: 45, ask: 'count' } }
        });
      }, { standard: STD4 }),
      H('hard-abs-ratio', '절댓값의 배와 두 점 사이의 거리·곱의 부호로 두 수 구하기', '심13·14', (d, n) => {
        const a = V('a'), b = V('b'), k = d.int(2, 4);
        if (n === 0) {
          // 부호가 다르므로 0을 나타내는 점이 두 점 사이에 있다. 거리를 (1 + k)로 나누어 작은 절댓값을 구하고, 큰 절댓값을 구한 다음 부호를 붙인다.
          const u = d.int(2, 6), dist = (k + 1) * u, aPos = d.bool(), aBig = d.bool(), big = aBig ? a : b, small = aBig ? b : a;
          const va = (aPos ? 1 : -1) * (aBig ? k * u : u), vb = (aPos ? -1 : 1) * (aBig ? u : k * u);
          const expr = (v) => (v < 0 ? '-' : '') + (Math.abs(v) === u ? `${dist}/(${k}+1)` : `${k}*${dist}/(${k}+1)`);
          return M(`두 수 ${a}, ${b}에 대하여 ${nb(aPos ? `${b} ${LT} 0 ${LT} ${a}` : `${a} ${LT} 0 ${LT} ${b}`)}이고, ${big}의 절댓값은 ${small}의 절댓값의 ${k}배이다. 수직선에서 ${a}, ${b}를 나타내는 두 점 사이의 거리가 ${dist}일 때, ${a}, ${b}의 값은?`, [{ label: a, answer: va, signed: true }, { label: b, answer: vb, signed: true }], {
            shown: `${nb(`${a} = ${iq(va)}`)}, ${nb(`${b} = ${iq(vb)}`)}`,
            explain: `${a}, ${b}의 부호가 다르므로 0을 나타내는 점은 두 점 사이에 있고, 두 점 사이의 거리는 두 수의 절댓값의 합이다. ${big}의 절댓값이 ${small}의 절댓값의 ${k}배이므로 거리 ${dist}${tail(dist, '은/는')} ${small}의 절댓값의 ${k + 1}배이다. ${small}의 절댓값은 ${dist} ÷ ${k + 1} = ${u}, ${big}의 절댓값은 ${u} × ${k} = ${k * u}이다. 부호를 붙이면 ${nb(`${a} = ${iq(va)}`)}, ${nb(`${b} = ${iq(vb)}`)}이다.`,
            facts: { calc: [[expr(va), 0], [expr(vb), 1]], unseen: [1] }
          });
        }
        // 절댓값이 정해지면 두 경우(부호가 서로 반대)가 나오지만 몫은 어느 경우에나 같다.
        const t = d.int(2, 5), m = k * t, swap = d.bool(), big = swap ? b : a, small = swap ? a : b;
        return ansV(`두 수 ${a}, ${b}에 대하여 ${big}의 절댓값은 ${small}의 절댓값의 ${k}배이고, 수직선에서 ${big}를 나타내는 점과 0을 나타내는 점 사이의 거리는 ${m}이다. ${nb(`${a} × ${b} ${LT} 0`)}일 때, ${nb(`${big} ÷ ${small}`)}의 값은?`, Q(-k), 'int', {
          explain: `${big}의 절댓값은 ${m}이므로 ${small}의 절댓값은 ${m} ÷ ${k} = ${t}이다. 곱이 음수이므로 두 수의 부호는 서로 다르다. ${nb(`${big} = ${m}`)}, ${nb(`${small} = −${t}`)}이거나 ${nb(`${big} = −${m}`)}, ${nb(`${small} = ${t}`)}이고, 어느 경우에나 ${nb(`${big} ÷ ${small} = −(${m} ÷ ${t}) = −${k}`)}이다.`,
          facts: { value: `${m}/(-(${m}/${k}))` }
        });
      }, { count: 2, standard: STD4 }),
      H('hard-zero-order', '곱이 0인 조건과 합·절댓값 조건으로 세 수의 크기 순서 정하기', '심55', (d) => {
        // x × y 가 0이 아니므로 x 는 0이 아니고, x × z = 0 에서 z = 0 이다. 부호가 다른 두 수의 합의 부호는 절댓값이 큰 수의 부호이다.
        const L = ['a', 'b', 'c'].map(V), [xi, yi, zi] = d.shuffle([0, 1, 2]), x = L[xi], y = L[yi], z = L[zi], xBig = d.bool(), sumNeg = d.bool();
        const big = xBig ? xi : yi, small = xBig ? yi : xi, asc = [sumNeg ? big : small, zi, sumNeg ? small : big], pick = orderChoice(d, L, asc);
        const mul = (i, j, op) => (i < j ? `${L[i]} ${op} ${L[j]}` : `${L[j]} ${op} ${L[i]}`), xz = mul(xi, zi, '×'), xy = mul(xi, yi, '×');
        const rows = [`${mul(xi, zi, '<i>×</i>')} <i>=</i> 0`, `${mul(xi, yi, '<i>×</i>')} <i>${LT}</i> 0`, `|${x}| <i>${xBig ? GT : LT}</i> |${y}|`, `${L[0]} <i>+</i> ${L[1]} <i>+</i> ${L[2]} <i>${sumNeg ? LT : GT}</i> 0`];
        return C(`세 수 ${L.join(', ')}가 다음을 모두 만족시킬 때, 세 수의 대소 관계를 바르게 나타낸 것은?`, pick.options, pick.at, {
          figure: taggedEx(rows, CONDS),
          explain: `${nb(xy)}가 0이 아니므로 ${x}는 0이 아니다. ${nb(`${xz} = 0`)}이므로 ${nb(`${z} = 0`)}이다. ${nb(xy)}가 음수이므로 ${x}, ${y}의 부호는 서로 다르고, ${nb(`${z} = 0`)}이므로 ${x}, ${y}의 합은 ${sumNeg ? '음수' : '양수'}이다. `
            + `부호가 다른 두 수의 합의 부호는 절댓값이 큰 수의 부호와 같으므로 절댓값이 큰 ${L[big]}가 ${sumNeg ? '음수' : '양수'}, ${L[small]}가 ${sumNeg ? '양수' : '음수'}이다. 따라서 ${nb(asc.map((i) => L[i]).join(` ${LT} `))}이다.`,
          facts: { truth: pick.truth, want: true }
        });
      }),
      H('hard-magic', '가로·세로·대각선의 합이 같은 표의 빈칸', '심60 / 기본 ①56 ②52', (d, n) => {
        // 세 수가 모두 주어진 줄에서 한 줄의 합을 먼저 구하고, 빈칸이 하나뿐인 줄을 차례로 찾아 뺄셈으로 채운다(음수를 빼는 뺄셈이 섞인다).
        const make = (c, a, b) => [c - b, c + a + b, c - a, c - a + b, c, c + a - b, c + a, c - a - b, c + b], sg = (t) => (t < 0 ? `(${iq(t)})` : iq(t));
        if (n === 0) {
          const form = d.int(0, 1), ASK = [[2, 3, 7], [0, 3, 8]][form], SHOWN = [[0, 1, 4, 8], [2, 4, 6, 7]][form];
          const g = d.until(() => make(d.int(-3, 3), pm(d) * d.int(1, 5), pm(d) * d.int(1, 5)), (v) => new Set(v).size === 9 && v.every((t) => Math.abs(t) <= 12) && SHOWN.some((i) => v[i] < 0) && ASK.some((i) => v[i] < 0) && ASK.some((i) => v[i] > 0));
          const T3 = 3 * g[4], cell = (i, blank) => (SHOWN.includes(i) ? iq(g[i]) : ASK.includes(i) ? LAB[ASK.indexOf(i)] : blank), m2 = (p, q) => `${iq(T3)} − ${sg(p)} − ${sg(q)} = ${iq(T3 - p - q)}`;
          const sum = form === 0 ? `(${e(g[0])}+${e(g[4])}+${e(g[8])})` : `(${e(g[2])}+${e(g[4])}+${e(g[6])})`;
          const first = form === 0 ? `${sum}-${e(g[0])}-${e(g[1])}` : `${sum}-${e(g[6])}-${e(g[7])}`;   // 합 다음에 바로 구하는 칸(㉠ 또는 ㉢)
          const calc = form === 0 ? [[first, 0], [`${sum}-${e(g[0])}-(${sum}-(${first})-${e(g[4])})`, 1], [`${sum}-${e(g[1])}-${e(g[4])}`, 2]]
            : [[`${sum}-${e(g[4])}-(${first})`, 0], [`${sum}-(${sum}-${e(g[4])}-(${first}))-${e(g[6])}`, 1], [first, 2]];
          return M('다음 표에서 가로, 세로, 대각선에 놓인 세 수의 합이 모두 같을 때, ㉠, ㉡, ㉢에 알맞은 수는?', ASK.map((i, k) => ({ label: LAB[k], answer: g[i], signed: true })), {
            figure: gridFig(range(0, 8).map((i) => cell(i, '')), range(0, 8).map((i) => cell(i, '빈칸'))),
            explain: form === 0
              ? `한 대각선의 세 수가 모두 주어졌으므로 한 줄의 합은 ${sg(g[0])} + ${sg(g[4])} + ${sg(g[8])} = ${iq(T3)}이다. 첫째 가로줄에서 ㉠ = ${m2(g[0], g[1])}, 둘째 세로줄에서 ㉢ = ${m2(g[1], g[4])}이다. 다른 대각선에서 왼쪽 아래 칸의 수는 ${m2(g[2], g[4])}이므로 첫째 세로줄에서 ㉡ = ${m2(g[0], g[6])}이다.`
              : `한 대각선의 세 수가 모두 주어졌으므로 한 줄의 합은 ${sg(g[2])} + ${sg(g[4])} + ${sg(g[6])} = ${iq(T3)}이다. 셋째 가로줄에서 ㉢ = ${m2(g[6], g[7])}이다. 다른 대각선에서 ㉠ = ${m2(g[4], g[8])}, 첫째 세로줄에서 ㉡ = ${m2(g[0], g[6])}이다.`,
            facts: { calc }
          });
        }
        // 분수: 대각선에서 합을 구하고, 다른 줄의 빈칸 하나를 채운 다음 ㉠을 구한다.
        const den = d.pick([4, 6, 8, 10, 12]), ask = d.pick([3, 7]), SHOWN = [0, 2, 4, 8];
        const g = d.until(() => make(d.int(-5, 5), pm(d) * d.int(1, 5), pm(d) * d.int(1, 5)).map((t) => Q(t, den)), (v) => distinct(v) && SHOWN.every((i) => v[i].q > 1 && v[i].q <= 12 && Math.abs(fl(v[i])) < 2) && SHOWN.filter((i) => v[i].p < 0).length >= 2 && SHOWN.some((i) => v[i].p > 0) && okKind(v[ask], 'frac') && v[ask].q <= 12 && v[ask === 3 ? 5 : 1].p !== 0);
        const total = qadd(qadd(g[0], g[4]), g[8]), sum = `(${js(g[0])}+${js(g[4])}+${js(g[8])})`;
        const cell = (i, blank, show) => (SHOWN.includes(i) ? show(g[i]) : i === ask ? LAB[0] : blank);
        return ansV('다음 표에서 가로, 세로, 대각선에 놓인 세 수의 합이 모두 같을 때, ㉠에 알맞은 수는?', g[ask], 'frac', {
          figure: gridFig(range(0, 8).map((i) => cell(i, '', tx)), range(0, 8).map((i) => cell(i, '빈칸', (t) => plain(t)))),
          explain: `한 대각선의 세 수가 모두 주어졌으므로 한 줄의 합은 ${commonTold([S(g[0]), '+', S(g[4]), '+', S(g[8])])}이다. `
            + (ask === 3 ? `셋째 세로줄에서 가운데 칸의 수는 ${commonTold([S(total), '-', S(g[2]), '-', S(g[8])])}이므로 둘째 가로줄에서 ㉠ = ${commonTold([S(total), '-', S(g[4]), '-', S(g[5])])}이다.`
              : `첫째 가로줄에서 가운데 칸의 수는 ${commonTold([S(total), '-', S(g[0]), '-', S(g[2])])}이므로 둘째 세로줄에서 ㉠ = ${commonTold([S(total), '-', S(g[1]), '-', S(g[4])])}이다.`),
          facts: { value: ask === 3 ? `${sum}-${js(g[4])}-(${sum}-${js(g[2])}-${js(g[8])})` : `${sum}-(${sum}-${js(g[0])}-${js(g[2])})-${js(g[4])}` }
        });
      }, { count: 2 }),
      H('hard-tri-product', '삼각형의 각 변에 놓인 세 수의 곱이 같을 때의 빈칸', '기본 ①73', (d) => {
        // 세 수가 모두 주어진 변에서 곱을 구하고, 빈칸이 하나인 변에서 ㉡을, 그 값을 넣어 ㉠을 구한다. 나눗셈마다 부호를 따져야 한다.
        const [v1, v2, w, t] = d.until(() => [pm(d) * d.int(1, 5), pm(d) * d.int(1, 5), pm(d) * d.int(1, 4), pm(d) * d.int(2, 3)], ([p, q, r, s]) => Math.abs(p) !== Math.abs(q) && Math.abs(p) > 1 && Math.abs(q) > 1 && Math.abs(r) > 1 && [p, q, r * s, p * s].some((k) => k < 0) && Math.abs(r * s) <= 12 && Math.abs(p * q * r * s) <= 200 && new Set([p, q, r * s, p * s].map(Math.abs)).size >= 3 && r !== s * q);
        const m12 = w * t, m23 = v1 * t, first = w, second = t * v2, P = v1 * m12 * v2, f = d.int(0, 2), swap = d.bool(), A = swap ? (f + 1) % 3 : f, Bv = swap ? f : (f + 1) % 3, O = (f + 2) % 3;
        // 변 i 는 꼭짓점 i 와 i + 1 을 잇는다. 세 수가 다 찬 변은 f, ㉠은 A 와 ㉡을 잇는 변의 가운데, m23 은 다른 변의 가운데에 놓는다.
        const sideAO = swap ? (f + 1) % 3 : (f + 2) % 3, sideBO = swap ? (f + 2) % 3 : (f + 1) % 3, vs = [], ms = [], sg = (k) => (k < 0 ? `(${iq(k)})` : iq(k));
        vs[A] = iq(v1); vs[Bv] = iq(v2); vs[O] = LAB[1]; ms[f] = iq(m12); ms[sideAO] = LAB[0]; ms[sideBO] = iq(m23);
        const prod = `(${e(v1)}*${e(m12)}*${e(v2)})`, lower = `${prod}/(${e(m23)}*${e(v2)})`;
        return M('다음 그림에서 삼각형의 각 변에 놓인 세 수의 곱이 모두 같을 때, ㉠, ㉡에 알맞은 수는?', [{ label: LAB[0], answer: second, signed: true }, { label: LAB[1], answer: first, signed: true }], {
          figure: triFig(vs, ms),
          explain: `세 수가 모두 주어진 변에서 ${sg(v1)} × ${sg(m12)} × ${sg(v2)} = ${iq(P)}이므로 각 변에 놓인 세 수의 곱은 ${iq(P)}이다. ㉡ × ${sg(m23)} × ${sg(v2)} = ${iq(P)}에서 ㉡ × ${sg(m23 * v2)} = ${iq(P)}이므로 ㉡ = ${sg(P)} ÷ ${sg(m23 * v2)} = ${iq(first)}이다. `
            + `${sg(v1)} × ㉠ × ${sg(first)} = ${iq(P)}에서 ㉠ × ${sg(v1 * first)} = ${iq(P)}이므로 ㉠ = ${sg(P)} ÷ ${sg(v1 * first)} = ${iq(second)}이다.`,
          facts: { calc: [[`${prod}/(${e(v1)}*(${lower}))`, 0], [lower, 1]] }
        });
      }),
      H('hard-long-product', '규칙적으로 이어지는 긴 곱', '기본 ①72 ②68', (d, n) => {
        // 곱의 부호는 음수의 개수로 정하고(개수를 세는 것이 고비이다), 절댓값의 곱은 이웃한 분수의 분모와 분자를 약분하여 구한다.
        if (n === 0) {
          const alt = d.bool(), last = alt ? d.pick([20, 24, 30, 36, 40, 50, 60]) : d.pick([15, 20, 21, 25, 30, 35, 40, 50]), sign = (k) => (alt && k % 2 === 0 ? 1 : -1);
          const term = (k) => px(Q(sign(k) * k, k + 1)), many = alt ? last / 2 : last - 1, v = Q(many % 2 ? -1 : 1, last);
          return ansV('다음을 계산하시오.', v, 'frac', {
            figure: longEx([1, 2, 3].map(term), alt ? [term(last - 2), term(last - 1)] : [term(last - 1)], '×'),
            explain: (alt ? `음수는 분자가 홀수인 ${term(1)}, ${term(3)}, …, ${term(last - 1)}의 ${many}개이다.` : `곱하는 수 ${last - 1}개가 모두 음수이다.`) + ` 음수가 ${many % 2 ? '홀수' : '짝수'} 개이므로 곱의 부호는 ${many % 2 ? MINUS : '+'}이다. 절댓값의 곱 ${frac(1, 2)} × ${frac(2, 3)} × ${frac(3, 4)} × ⋯ × ${frac(last - 1, last)}에서 앞 분수의 분모와 바로 뒤 분수의 분자를 차례로 약분하면 ${frac(1, last)}이 남는다. 따라서 ${tx(v)}이다.`,
            facts: { value: range(1, last - 1).map((k) => `(${sign(k) < 0 ? '-' : ''}${k}/${k + 1})`).join('*'), unseen: range(1, last), rule: 'long-product-chain' }
          });
        }
        // 괄호 안을 먼저 계산해야 규칙이 보인다.
        const m = d.int(6, 14), dens = range(1, m).map((k) => 2 * k + 1), term = (q) => `(${frac(2, q)} <i>−</i> 1)`, v = Q(m % 2 ? -1 : 1, 2 * m + 1), inner = (q) => `(${MINUS}${frac(q - 2, q)})`;
        return ansV('다음을 계산하시오.', v, 'frac', {
          figure: longEx(dens.slice(0, 3).map(term), [term(dens[m - 1])], '×'),
          explain: `괄호 안을 먼저 계산하면 ${inner(3)} × ${inner(5)} × ${inner(7)} × ⋯ × ${inner(2 * m + 1)}이다. 곱하는 수는 분모가 3, 5, 7, …, ${2 * m + 1}인 ${m}개이고 모두 음수이므로 곱의 부호는 ${m % 2 ? MINUS : '+'}이다. 절댓값의 곱은 앞 분수의 분모와 바로 뒤 분수의 분자를 차례로 약분하면 ${frac(1, 2 * m + 1)}이 남는다. 따라서 ${tx(v)}이다.`,
          facts: { value: dens.map((q) => `(2/${q}-1)`).join('*'), unseen: dens.concat([1, 2]), rule: 'long-product-paren' }
        });
      }, { count: 2 }),
      H('hard-pair-sum', '둘씩 묶어 구하는 긴 합', '기본 ②37·90 / 심65', (d, n) => {
        // 덧셈의 교환법칙·결합법칙으로 둘씩 묶으면 묶음마다 합이 같다. 묶음의 수를 세어 곱한다.
        if (n === 0) {
          const q = d.pick([11, 13, 17, 19]), m = d.int(4, Math.min(8, (q - 1) / 2)), s = pm(d), term = (k) => px(Q((k % 2 ? s : -s) * k, q)), v = Q(-s * m, q), one = Q(-s, q);
          return ansV('다음을 계산하시오.', v, 'frac', {
            figure: longEx([1, 2, 3].map(term), [term(2 * m - 1), term(2 * m)], '+'),
            explain: `앞에서부터 두 수씩 묶으면 {${term(1)} + ${term(2)}} + {${term(3)} + ${term(4)}} + ⋯ + {${term(2 * m - 1)} + ${term(2 * m)}}이고, 묶음마다 합이 ${tx(one)}이다. 더하는 수가 ${2 * m}개이므로 묶음은 ${m}개이다. ${px(one)} × ${m} = ${tx(v)}이다.`,
            facts: { value: range(1, 2 * m).map((k) => `(${(k % 2 ? s : -s) < 0 ? '-' : ''}${k}/${q})`).join('+'), unseen: range(1, 2 * m), rule: 'pair-sum-frac' }
          });
        }
        if (n === 1) {
          // 두 합을 따로 구하지 않고 짝 지어 뺀다.
          const N2 = d.pick([50, 100, 200, 300, 400, 500]), m = N2 / 2, oddFirst = d.bool(), A = V('A'), Bn = V('B'), v = oddFirst ? -m : m;
          return ansV(`1부터 ${N2}까지의 자연수 가운데 홀수의 합을 ${A}, 짝수의 합을 ${Bn}라 할 때, ${nb(oddFirst ? `${A} − ${Bn}` : `${Bn} − ${A}`)}의 값은?`, Q(v), 'int', {
            explain: oddFirst ? `${A} − ${Bn} = (1 + 3 + 5 + ⋯ + ${N2 - 1}) − (2 + 4 + 6 + ⋯ + ${N2})에서 홀수와 그다음 짝수를 짝 지으면 (1 − 2) + (3 − 4) + (5 − 6) + ⋯ + (${N2 - 1} − ${N2})이다. 괄호마다 값이 −1이고 괄호는 ${m}개이므로 (−1) × ${m} = ${iq(v)}이다.`
              : `${Bn} − ${A} = (2 + 4 + 6 + ⋯ + ${N2}) − (1 + 3 + 5 + ⋯ + ${N2 - 1})에서 짝수와 그 앞의 홀수를 짝 지으면 (2 − 1) + (4 − 3) + (6 − 5) + ⋯ + (${N2} − ${N2 - 1})이다. 괄호마다 값이 1이고 괄호는 ${m}개이므로 1 × ${m} = ${iq(v)}이다.`,
            facts: { value: oddFirst ? `-(${N2}/2)` : `${N2}/2`, unseen: [2] }
          });
        }
        // −1의 거듭제곱: 둘씩 묶으면 0이고, 더하는 수가 홀수 개이면 마지막 수 하나가 남는다.
        const from = d.int(1, 2), last = d.pick([99, 100, 101, 999, 1000, 1001, 2025, 2026]), many = last - from + 1, v = many % 2 ? (last % 2 ? -1 : 1) : 0, pw = (k) => (k === 1 ? '(−1)' : `(−1)${sup(k)}`);
        return ansV('다음을 계산하시오.', Q(v), 'int', {
          figure: longEx([from, from + 1, from + 2].map(pw), [pw(last)], '+'),
          explain: `−1을 홀수 번 곱하면 −1, 짝수 번 곱하면 1이므로 더하는 수는 ${from === 1 ? '−1, 1, −1, 1' : '1, −1, 1, −1'}, …이다. 앞에서부터 두 수씩 묶으면 묶음마다 합이 0이다. 더하는 수는 모두 ${many}개이므로 `
            + (many % 2 ? `마지막 수 ${pw(last)} = ${iq(v)} 하나가 남는다. 합은 ${iq(v)}이다.` : '남는 수 없이 모두 묶인다. 합은 0이다.'),
          facts: { value: from === 1 ? `((-1)**${last}-1)/2` : `((-1)**${last}+1)/2`, unseen: [1, 2], rule: 'pair-sum-power' }
        });
      }, { count: 3 }),
      H('hard-cycle-sum', '되풀이되는 수들의 긴 합', '심67', (d) => {
        // 되풀이되는 마디의 합을 구하고, 마디가 몇 번 되풀이되는지와 남는 수를 나눗셈으로 구한 다음 더한다.
        const [len, last] = d.until(() => [d.int(4, 6), d.pick([50, 99, 100, 101, 150, 200, 250, 500, 999, 1000, 1001])], ([l, k]) => k % l !== 0);
        const cyc = d.until(() => range(1, len).map(() => nz(d, -4, 4)), (list) => { const s = list.reduce((x, y) => x + y, 0); return list.filter((k) => k < 0).length >= 2 && list.some((k) => k > 0) && s !== 0 && Math.abs(s) <= 6 && new Set(list).size >= 3; });
        const one = cyc.reduce((x, y) => x + y, 0), times = Math.floor(last / len), rest = cyc.slice(0, last % len), part = rest.reduce((x, y) => x + y, 0), v = one * times + part, sg = (k) => (k < 0 ? `(${iq(k)})` : iq(k));
        return ansV(`다음과 같이 ${len}개의 수 ${listJ(cyc, '이/가')} 이 차례대로 되풀이되어 놓여 있다. 첫 번째 수부터 ${last}번째 수까지의 합은?`, Q(v), 'int', {
          figure: ex(cyc.concat(cyc.slice(0, 2)).map(iq).join(', ') + ', ⋯'),
          explain: `되풀이되는 ${len}개의 수의 합은 ${cyc.map(sg).join(' + ')} = ${iq(one)}이다. ${last} = ${len} × ${times} + ${rest.length}이므로 ${last}번째 수까지에는 이 ${len}개의 수가 ${times}번 되풀이되고, 이어서 ${rest.length > 1 ? `${rest.map(iq).join(', ')}의 ${rest.length}개가` : `${josaNum(rest[0], '이/가')} 하나`} 더 놓인다. 합은 ${sg(one)} × ${times} + ${rest.length > 1 ? `{${rest.map(sg).join(' + ')}}` : sg(part)} = ${iq(one * times)} + ${sg(part)} = ${iq(v)}이다.`,
          facts: { value: `(${cyc.map(e).join('+')})*((${last}-${last}%${len})/${len})+(${rest.map(e).join('+')})` }
        });
      }),
      H('hard-telescope', '두 분수의 차로 고쳐 지워 가는 합', '심66', (d) => {
        // 주어진 등식처럼 분수마다 두 분수의 차로 고치면, 이웃한 두 수의 합이 0이 되어(−1/3 + 1/3) 처음 수와 마지막 수만 남는다.
        const k0 = d.int(1, 3), last = d.until(() => d.int(k0 + 5, 14), (t) => okKind(qsub(Q(1, k0), Q(1, t + 1)), 'frac')), v = qsub(Q(1, k0), Q(1, last + 1)), h = k0 + 1;
        const term = (k) => frac(1, k * (k + 1)), split = (k) => `${frac(1, k * (k + 1))} = ${k === 1 ? '1' : frac(1, k)} − ${frac(1, k + 1)}`;
        return ansV(`${nb(`${frac(1, h * (h + 1))} = ${frac(1, h)} − ${frac(1, h + 1)}`)}임을 이용하여 다음을 계산하시오.`, v, 'frac', {
          figure: longEx(range(k0, k0 + 3).map(term), [term(last)], '+'),
          explain: `${split(k0)}, ${split(k0 + 1)}, ${split(k0 + 2)}, …, ${split(last)}이다. 이것을 차례로 더하면 ${MINUS}${frac(1, k0 + 1)}${tail(1, '과/와')} +${frac(1, k0 + 1)}, ${MINUS}${frac(1, k0 + 2)}${tail(1, '과/와')} +${frac(1, k0 + 2)}처럼 이웃한 두 수의 합이 0이 되어 처음 수와 마지막 수만 남는다. ${k0 === 1 ? '1' : frac(1, k0)} − ${frac(1, last + 1)} = ${tx(v)}이다.`,
          facts: { value: range(k0, last).map((k) => `1/${k * (k + 1)}`).join('+'), unseen: range(k0, last).map((k) => k * (k + 1)).concat([1]), rule: 'telescope' }
        });
      }),
      H('hard-box-mix', '거꾸로 두 번 계산하는 □가 있는 혼합 계산', '심48 / 기본 ①90', (d, n) => {
        // □가 없는 덩이를 먼저 계산하고, 덧셈·뺄셈을 거꾸로 한 번, 곱셈·나눗셈을 거꾸로 한 번 계산한다.
        if (n === 0) {
          const r = d.until(() => {
            const known = d.pick([
              () => [U(fr(d, [2, 3, 4, 6], 2)), '/', S(qneg(fr(d, [2, 3, 4], 2)))],
              () => [S(qneg(fr(d, [2, 3, 5], 2))), '*', U(fr(d, [2, 3, 4], 2))],
              () => [W(Q(-1, d.pick([2, 3])), 2), '/', S(qneg(fr(d, [2, 3, 4, 6], 1)))]
            ])(), c = d.bool() ? Q(d.int(2, 9)) : fr(d, [2, 3, 4], 5), x = signedQ(pm(d), fr(d, [2, 3, 4, 5], 3)), byMul = d.bool(), minus = d.bool();
            const k = val(known), t = byMul ? qmul(c, x) : qdiv(c, x), R = minus ? qsub(k, t) : qadd(k, t);
            return { known, c, x, byMul, minus, k, t, R, h: `${html(known)} <i>${minus ? MINUS : '+'}</i> ${tx(c)} <i>${byMul ? '×' : '÷'}</i> ${box()} <i>=</i> ${tx(R)}` };
          }, (m) => m.R.p !== 0 && m.R.q <= 12 && Math.abs(m.R.p) <= 60 && m.k.q <= 12 && m.t.q <= 12 && Math.abs(m.t.p) <= 60 && qcmp(qabs(m.k), qabs(m.R)) !== 0 && emOf(m.h) <= 18);
          const lhs = r.minus ? `((${jsx(r.known)})-${js(r.R)})` : `(${js(r.R)}-(${jsx(r.known)}))`, op = r.byMul ? '×' : '÷';
          return ansV('□ 안에 알맞은 수는?', r.x, 'frac', {
            figure: ex(r.h),
            explain: `□가 없는 곳을 먼저 계산하면 ${chainOf(r.known)}이다. ${px(r.k)} ${r.minus ? MINUS : '+'} ${tx(r.c)} ${op} □ = ${tx(r.R)}에서 ${tx(r.c)} ${op} □ = ${r.minus ? subTold(r.k, r.R) : subTold(r.R, r.k)}이다. 따라서 □ = ${r.byMul ? divTold(r.t, r.c) : divTold(r.c, r.t)}이다.`,
            facts: { value: r.byMul ? `${lhs}/${js(r.c)}` : `${js(r.c)}/${lhs}`, rule: 'box-mix-frac' }
          });
        }
        const r = d.until(() => {
          const b = d.pick([2, 3]);
          const one = d.pick([() => [W(Q(-2), 3)], () => [W(Q(-3), 2)], () => [WN(Q(d.int(2, 4)), 2)], () => [W(Q(-2), 4)]])();
          const two = d.pick([
            () => [S(Q(-1, b)), '/', U(Q(1, b * d.int(2, 3))), '-', W(Q(-2), 2)],
            () => [W(Q(-2), 3), '+', U(Q(d.int(1, 2))), '/', S(Q(-1, 2))],
            () => [U(Q(1, 2)), '*', S(Q(-2 * d.int(2, 4))), '-', W(Q(-d.int(2, 3)), 2)],
            () => [W(Q(-3), 2), '*', S(Q(-d.pick([1, 2]), 3)), '+', U(Q(d.int(1, 2)))]
          ])();
          const x = pm(d) * d.int(2, 6), minus = d.bool(), v1 = val(one), v2 = val(two), t = qmul(Q(x), v2), R = minus ? qsub(v1, t) : qadd(v1, t);
          return { one, two, x, minus, v1, v2, t, R, h: `${html(one)} <i>${minus ? MINUS : '+'}</i> ${box()} <i>×</i> {${html(two)}} <i>=</i> ${tx(R)}` };
        }, (m) => isInt(m.v1) && isInt(m.v2) && m.v1.p !== 0 && Math.abs(m.v2.p) >= 2 && Math.abs(m.v2.p) <= 13 && m.R.p !== 0 && Math.abs(m.R.p) <= 99 && emOf(m.h) <= 18.6);
        return ansV('□ 안에 알맞은 수는?', Q(r.x), 'int', {
          figure: ex(r.h),
          explain: `□가 없는 두 곳을 먼저 계산하면 ${chainOf(r.one)}, ${chainOf(r.two)}이다. ${px(r.v1)} ${r.minus ? MINUS : '+'} □ × ${px(r.v2)} = ${tx(r.R)}에서 □ × ${px(r.v2)} = ${r.minus ? subTold(r.v1, r.R) : subTold(r.R, r.v1)}이다. 따라서 □ = ${divTold(r.t, r.v2)}이다.`,
          facts: { value: `${r.minus ? `((${jsx(r.one)})-${js(r.R)})` : `(${js(r.R)}-(${jsx(r.one)}))`}/(${jsx(r.two)})`, rule: 'box-mix-int' }
        });
      }, { count: 2 }),
      H('hard-three-ints', '곱·합·절댓값 조건에 맞는 세 정수', '심43·63 / 기본 ②89', (d, n) => {
        const a = V('a'), b = V('b'), c = V('c'), sg = (k) => (k < 0 ? `(${iq(k)})` : iq(k));
        if (n === 0) {
          // 소인수분해로 절댓값을 정하고(절댓값이 모두 1보다 크다), 곱의 부호로 음수의 개수를 추린 다음, 합의 범위로 어느 수가 음수인지 정한다.
          const [p, q, r] = d.pick([[2, 3, 5], [2, 3, 7], [2, 5, 7], [2, 3, 11], [2, 5, 11], [2, 7, 11], [3, 5, 7], [2, 3, 13], [3, 5, 11]]), negP = d.bool();
          const pats = negP ? [[-1, 1, 1], [1, -1, 1], [1, 1, -1], [-1, -1, -1]] : [[1, 1, 1], [1, -1, -1], [-1, 1, -1], [-1, -1, 1]], trio = (s) => [s[0] * p, s[1] * q, s[2] * r], sums = pats.map((s) => trio(s).reduce((x, y) => x + y, 0));
          const [at, lo, hi] = d.until(() => { const i = d.int(0, 3); return [i, sums[i] - d.int(0, 3), sums[i] + d.int(1, 4)]; }, ([i, from, to]) => to - from >= 3 && sums.filter((s) => s >= from && s < to).length === 1 && pats[i].some((s) => s > 0));
          const vals = trio(pats[at]).sort((x, y) => x - y), P = (negP ? -1 : 1) * p * q * r;
          return M('세 정수가 다음 조건을 모두 만족시킨다. 세 정수를 작은 수부터 차례대로 ㉠, ㉡, ㉢이라 할 때, ㉠, ㉡, ㉢의 값은?', vals.map((v, i) => ({ label: LAB[i], answer: v, signed: true })), {
            figure: tagged([`세 수의 곱은 ${iq(P)}이다.`, '세 수의 절댓값은 모두 1보다 크다.', `세 수의 합은 ${iq(lo)} 이상 ${iq(hi)} 미만이다.`], CONDS),
            explain: `${p * q * r} = ${p} × ${q} × ${r}이고 세 수의 절댓값이 모두 1보다 크므로 세 수의 절댓값은 ${p}, ${q}, ${r}이다. 곱이 ${negP ? '음수이므로 음수는 1개 또는 3개' : '양수이므로 음수는 없거나 2개'}이다. 그때의 합은 ${pats.map((s, i) => `${trio(s).map(sg).join(' + ')} = ${iq(sums[i])}`).join(', ')}이다. 이 가운데 ${iq(lo)} 이상 ${iq(hi)} 미만인 것은 ${iq(sums[at])}뿐이므로 세 수는 ${vals.map(iq).join(', ')}이다.`,
            facts: { calc: vals.map((v, i) => [e(v), i]), unseen: [p, q, r] }
          });
        }
        if (n === 1) {
          // 절댓값의 차례와 곱으로 절댓값의 짝을 추리고, 곱의 부호와 합으로 부호를 정한다. 조건에 맞는 것이 하나뿐인지는 모든 경우를 따져 확인하고 싣는다.
          const TRI = [[1, 2, 6], [1, 3, 4], [1, 2, 9], [1, 3, 6], [1, 2, 10], [1, 4, 5], [1, 3, 8], [1, 4, 6], [2, 3, 4], [1, 5, 6], [2, 3, 5], [1, 2, 8]];
          // 곱이 k 이고 서로 다른 세 자연수(작은 것부터)의 짝 전부
          const triples = (k) => { const out = []; for (let z = 1; z * z * z < k; z += 1) for (let y = z + 1; z * y * y < k; y += 1) if (k % (z * y) === 0 && k / (z * y) > y) out.push([z, y, k / (z * y)]); return out; };
          const fits = (P, S) => { const out = []; for (let x = -Math.abs(P); x <= Math.abs(P); x += 1) for (let y = -Math.abs(P); y <= Math.abs(P); y += 1) { if (!x || !y || P % (x * y)) continue; const z = P / (x * y); if (Math.abs(z) < Math.abs(y) && Math.abs(y) < Math.abs(x) && x + y + z === S) out.push([x, y, z]); } return out; };
          const vals = d.until(() => { const [z, y, x] = d.pick(TRI); return [pm(d) * x, pm(d) * y, pm(d) * z]; }, (v) => { const P = v[0] * v[1] * v[2], S = v[0] + v[1] + v[2]; return v.some((k) => k < 0) && S !== 0 && fits(P, S).length === 1 && triples(Math.abs(P)).length >= 2 && triples(Math.abs(P)).length <= 4; });
          const P = vals[0] * vals[1] * vals[2], S = vals[0] + vals[1] + vals[2], same = triples(Math.abs(P));
          return M(`세 정수 ${a}, ${b}, ${c}가 다음을 모두 만족시킬 때, ${a}, ${b}, ${c}의 값은?`, [a, b, c].map((label, i) => ({ label, answer: vals[i], signed: true })), {
            figure: taggedEx([`|${c}| <i>${LT}</i> |${b}| <i>${LT}</i> |${a}|`, `${a} <i>×</i> ${b} <i>×</i> ${c} <i>=</i> ${iq(P)}`, `${a} <i>+</i> ${b} <i>+</i> ${c} <i>=</i> ${iq(S)}`], CONDS),
            shown: [a, b, c].map((label, i) => nb(`${label} = ${iq(vals[i])}`)).join(', '),
            explain: `곱의 절댓값이 ${Math.abs(P)}이고 절댓값이 서로 다른 세 정수이므로 (|${a}|, |${b}|, |${c}|)는 ${same.map((t) => `(${t[2]}, ${t[1]}, ${t[0]})`).join(', ')} 가운데 하나이다. 곱이 ${P < 0 ? '음수이므로 음수는 1개 또는 3개' : '양수이므로 음수는 없거나 2개'}이다. 부호를 붙여 합이 ${josaNum(S, '이/가')} 되는 것은 ${vals.map(sg).join(' + ')} = ${iq(S)}뿐이므로 ${[a, b, c].map((label, i) => nb(`${label} = ${iq(vals[i])}`)).join(', ')}이다.`,
            facts: { calc: vals.map((v, i) => [e(v), i]), unseen: vals.map(Math.abs), rule: 'three-ints-abs-order' }
          });
        }
        // 부호와 대소가 주어진다. 절댓값이 주어진 수를 먼저 정하고, 남은 두 수의 곱을 나눗셈으로 구해 대소에 맞게 나눈다.
        const k = d.int(2, 5), m = d.pick([4, 9, 25]), mirror = d.bool(), vals = mirror ? [-m, -1, k] : [-k, 1, m], P = vals[0] * vals[1] * vals[2], root = m === 4 ? 2 : m === 9 ? 3 : 5;
        return M(`세 정수 ${a}, ${b}, ${c}가 다음을 모두 만족시킬 때, ${a}, ${b}, ${c}의 값은?`, [a, b, c].map((label, i) => ({ label, answer: vals[i], signed: true })), {
          figure: taggedEx([mirror ? `${a} <i>${LT}</i> ${b} <i>${LT}</i> 0 <i>${LT}</i> ${c}` : `${a} <i>${LT}</i> 0 <i>${LT}</i> ${b} <i>${LT}</i> ${c}`, `${a} <i>×</i> ${b} <i>×</i> ${c} <i>=</i> ${iq(P)}`, `|${mirror ? c : a}| <i>=</i> ${k}`], CONDS),
          shown: [a, b, c].map((label, i) => nb(`${label} = ${iq(vals[i])}`)).join(', '),
          explain: mirror
            ? `${nb(`|${c}| = ${k}`)}이고 ${c}는 양수이므로 ${nb(`${c} = ${k}`)}이다. ${nb(`${a} × ${b} × ${k} = ${iq(P)}`)}이므로 ${nb(`${a} × ${b} = ${iq(P)} ÷ ${k} = ${m}`)}이다. ${a}, ${b}는 ${nb(`${a} ${LT} ${b} ${LT} 0`)}인 정수이므로 ${nb(`${a} = −${m}`)}, ${nb(`${b} = −1`)}이다. ${nb(`${a} = ${b} = −${root}`)}${tail(root, '은/는')} ${nb(`${a} ${LT} ${b}`)}에 맞지 않는다.`
            : `${nb(`|${a}| = ${k}`)}이고 ${a}는 음수이므로 ${nb(`${a} = −${k}`)}이다. ${nb(`(−${k}) × ${b} × ${c} = ${iq(P)}`)}이므로 ${nb(`${b} × ${c} = (${iq(P)}) ÷ (−${k}) = ${m}`)}이다. ${b}, ${c}는 ${nb(`0 ${LT} ${b} ${LT} ${c}`)}인 정수이므로 ${nb(`${b} = 1`)}, ${nb(`${c} = ${m}`)}이다. ${nb(`${b} = ${c} = ${root}`)}${tail(root, '은/는')} ${nb(`${b} ${LT} ${c}`)}에 맞지 않는다.`,
          facts: { calc: vals.map((v, i) => [e(v), i]), unseen: [1, m], rule: 'three-ints-sign-given' }
        });
      }, { count: 3 }),
      H('hard-dice-min', '합이 0인 수가 마주 보는 상자에서 세 수로 만든 뺄셈식의 가장 작은(큰) 값', '심28', (d) => {
        // 마주 보는 면의 수를 구하고(부호만 반대), □ − □ − □ 가 가장 작으려면 가장 작은 수에서 나머지를 빼야 함을 따진 다음 계산한다.
        const small = d.bool(), xs = d.until(() => d.shuffle([Q(pm(d) * d.int(1, 5)), signedQ(pm(d), fr(d, [2, 3, 4, 5], 2)), Q(pm(d) * d.int(1, 5))]), (list) => distinct(list.map(qabs)) && list.some((t) => t.p < 0) && list.some((t) => t.p > 0));
        const ys = xs.map(qneg).sort((p, q) => (small ? qcmp(p, q) : qcmp(q, p))), sum = [S(ys[0]), '-', S(ys[1]), '-', S(ys[2])], v = val(sum);
        return ansV(`상자의 여섯 면에 수가 하나씩 적혀 있고, 마주 보는 면에 적힌 두 수의 합은 0이다. 서로 마주 보지 않는 세 면에 적힌 수가 ${xs.map(tx).join(', ')}일 때, 나머지 세 면에 적힌 수를 한 번씩 써넣어 ${nb(`${box()} − ${box()} − ${box()}`)}를 계산한 값 가운데 가장 ${small ? '작은' : '큰'} 값은?`, v, 'frac', {
          explain: `합이 0인 두 수는 절댓값이 같고 부호가 반대이므로 나머지 세 면에 적힌 수는 ${xs.map((t) => tx(qneg(t))).join(', ')}이다. 빼는 두 수는 어느 것을 먼저 빼도 값이 같으므로 맨 앞에 놓는 수만 정하면 된다. 가장 ${small ? '작은' : '큰'} 값을 얻으려면 가장 ${small ? '작은' : '큰'} 수 ${tx(ys[0])}에서 나머지 두 수를 뺀다. ${commonTold(sum)}이다.`,
          facts: { value: `${js(ys[0])}-${js(ys[1])}-${js(ys[2])}` }
        });
      }),
      H('hard-calc-count', '혼합 계산의 값에 대하여 정수의 개수 세기', '심46·47 / 기본 ②85', (d, n) => {
        // 여러 겹의 괄호와 거듭제곱이 있는 식을 계산한 다음, 그 값을 기준으로 정수를 센다(−19/2보다 큰 첫 정수는 −9, 음수가 아닌 정수에는 0이 든다, −2²은 −4).
        const int = (lo, hi) => Q(d.int(lo, hi));
        if (n === 0) {
          const list = d.until(() => d.pick([
            () => [U(Q(-d.int(2, 6))), '-', G([U(int(1, 4)), '+', U(Q(d.pick([3, 5, 7, 9]))), '/', G([U(fr(d, [2, 3, 4], 2)), '-', W(Q(-1), 3)], '{'), '*', U(Q(1, 2))], '[')],
            () => [W(Q(-2), 3), '+', G([U(Q(1, d.pick([2, 3]))), '-', U(fr(d, [2, 3, 4], 2)), '*', G([U(int(2, 4)), '-', W(Q(-1), 2)], '{')], '[')],
            () => [U(Q(-d.int(2, 6))), '+', G([U(fr(d, [2, 3, 4], 2)), '-', W(Q(-d.int(2, 3)), 2)], '{'), '/', U(int(2, 4))]
          ])(), (ex1) => { const v = val(ex1); return v.q > 1 && v.q <= 6 && fl(v) < -2 && fl(v) > -12 && biggest(ex1) <= 60 && emOf(html(ex1)) <= 15.6; });
          const v = val(list), first = Math.ceil(fl(v)), A = V('A');
          return N(`${A}가 다음과 같을 때, ${A}보다 큰 음의 정수는 모두 몇 개인가?`, -first, {
            unit: '개', figure: ex(`${A} <i>=</i> ${html(list)}`),
            explain: `${chainOf(list)}이므로 ${nb(`${A} = ${tx(v)}`)}이다. ${tj(v, '은/는')} ${josaNum(first - 1, '과/와')} ${iq(first)} 사이의 수이므로 ${A}보다 큰 정수 가운데 가장 작은 수는 ${iq(first)}이다. ${A}보다 큰 음의 정수는 ${iq(first)}부터 −1까지의 ${-first}개이다.`,
            facts: { digit: { template: `(${jsx(list)})<□<0`, lo: -20, hi: 5, ask: 'count' }, rule: 'calc-count-neg' }
          });
        }
        if (n === 1) {
          const list = d.until(() => d.pick([
            () => [G([G([U(fr(d, [2, 3, 4], 1)), '-', U(fr(d, [2, 3], 2))]), '*', S(Q(-d.int(2, 4))), '+', U(Q(1))], '{'), '/', S(Q(-1, d.pick([2, 3, 4])))],
            () => [U(int(2, 5)), '-', G([W(Q(-1, 2), 2), '-', U(fr(d, [2, 3, 4], 2))], '{'), '*', U(int(2, 3))],
            () => [W(Q(-d.int(2, 3)), 2), '*', G([U(Q(1)), '-', U(fr(d, [2, 3, 4, 6], 1))], '{'), '+', S(qneg(fr(d, [2, 3], 1)))]
          ])(), (ex1) => { const v = val(ex1); return v.q > 1 && v.q <= 6 && fl(v) > 1 && fl(v) < 8 && biggest(ex1) <= 60 && emOf(html(ex1)) <= 15.6; });
          const v = val(list), last = Math.floor(fl(v)), A = V('A');
          return N(`${A}가 다음과 같을 때, ${A}보다 작은 수 가운데 음수가 아닌 정수는 모두 몇 개인가?`, last + 1, {
            unit: '개', figure: ex(`${A} <i>=</i> ${html(list)}`),
            explain: `${chainOf(list)}이므로 ${nb(`${A} = ${tx(v)}`)}이다. 음수가 아닌 정수는 0과 양의 정수이다. ${A}보다 작은 정수 가운데 가장 큰 수는 ${last}이므로 0부터 ${last}까지의 ${last + 1}개이다.`,
            facts: { digit: { template: `(-1)<□<(${jsx(list)})`, lo: -5, hi: 12, ask: 'count' }, rule: 'calc-count-nonneg' }
          });
        }
        const divs = (k) => range(1, k).filter((t) => k % t === 0);
        const list = d.until(() => d.pick([
          () => [W(Q(-d.int(3, 5)), 2), '+', W(Q(-1), d.int(2, 5)), '-', W(int(2, 3), 2), '-', U(int(2, 6)), '/', S(Q(-1, 2))],
          () => [WN(int(2, 4), 2), '+', W(Q(-d.int(2, 3)), 2), '*', U(int(2, 4)), '-', U(int(1, 5)), '/', S(Q(-1, d.pick([2, 4])))],
          () => [W(Q(-2), 3), '*', S(Q(-d.int(2, 4))), '-', U(int(3, 9)), '+', W(Q(-3), 2)]
        ])(), (ex1) => { const v = val(ex1); return v.q === 1 && v.p >= 6 && v.p <= 60 && divs(v.p).length >= 4 && emOf(html(ex1)) <= 15.6; });
        const v = val(list).p, all = divs(v), a = V('a');
        return N(`${a}가 다음과 같을 때, ${a}의 약수는 모두 몇 개인가?`, all.length, {
          unit: '개', figure: ex(`${a} <i>=</i> ${html(list)}`),
          explain: `${chainOf(list)}이므로 ${nb(`${a} = ${v}`)}이다. ${v}의 약수는 ${all.join(', ')}의 ${all.length}개이다.`,
          facts: { digit: { template: `0<□<(${jsx(list)})+1>(${jsx(list)})%□<1`, lo: 1, hi: 80, ask: 'count' }, rule: 'calc-count-divisors' }
        });
      }, { count: 3 }),
      H('hard-wrong-two', '두 계산을 모두 거꾸로 한 계산 바로잡기', '기본 ②49', (d) => {
        // 잘못 계산한 식을 두 번 되돌려 어떤 수를 구하고, 다시 두 번 바르게 계산한다(되돌릴 때와 바르게 계산할 때 음수를 빼는 계산이 섞인다).
        const [p, q, w, x, v] = d.until(() => { const pp = Q(pm(d) * d.int(2, 6)), qq = signedQ(pm(d), fr(d, [3, 4, 5, 7], 2)), ww = d.bool() ? Q(pm(d) * d.int(1, 5)) : signedQ(pm(d), Q(d.int(1, 2 * qq.q - 1), qq.q)), xx = qsub(qadd(ww, pp), qq); return [pp, qq, ww, xx, qsub(qadd(xx, pp), qq)]; },
          (r) => r[2].p !== 0 && r[3].p !== 0 && okKind(r[4], 'frac') && r[4].q <= 12 && (r[0].p < 0 || r[1].p < 0 || r[2].p < 0));
        return ansV(`어떤 수에 ${tj(p, '을/를')} 더하고 ${tj(q, '을/를')} 빼야 할 것을 잘못하여 ${tj(p, '을/를')} 빼고 ${tj(q, '을/를')} 더하였더니 ${tj(w, '이/가')} 되었다. 바르게 계산한 값은?`, v, 'frac', {
          explain: `어떤 수를 □라 하면 □ − ${px(p)} + ${px(q)} = ${tx(w)}이다. 더한 수는 빼고 뺀 수는 더하여 되돌리면 □ = ${commonTold([S(w), '+', S(p), '-', S(q)])}이다. 바르게 계산하면 ${commonTold([S(x), '+', S(p), '-', S(q)])}이다.`,
          facts: { value: `${js(w)}+${js(p)}-${js(q)}+${js(p)}-${js(q)}` }
        });
      }),
      H('hard-card-zero', '세 수의 합이 0에 더 가까워지게 하는 카드', '기본 ②38', (d) => {
        // 먼저 뽑은 사람의 합과 0 사이의 거리(절댓값)를 구하고, 그보다 절댓값이 작은 합이 되는 수를 모두 찾은 다음, 이미 뽑힌 카드를 뺀다.
        const [who, other] = d.shuffle(NAMES).slice(0, 2), all = range(-4, 4), fit = (cards, sB, sA) => cards.filter((k) => Math.abs(sB + k) < Math.abs(sA));
        const [A, Bc] = d.until(() => { const deal = d.shuffle(all); return [deal.slice(0, 3), deal.slice(3, 5)]; }, ([p, q]) => { const sA = p[0] + p[1] + p[2], sB = q[0] + q[1], taken = p.concat(q), left = all.filter((k) => !taken.includes(k)), ok = fit(left, sB, sA); return Math.abs(sA) >= 1 && Math.abs(sA) <= 3 && ok.length >= 2 && ok.length <= 3 && fit(taken, sB, sA).length >= 1 && !p.includes(0) && !q.includes(0); });
        const sA = A[0] + A[1] + A[2], sB = Bc[0] + Bc[1], taken = A.concat(Bc), cand = fit(all, sB, sA), gone = cand.filter((k) => taken.includes(k)), ok = cand.filter((k) => !taken.includes(k)), sg = (k) => (k < 0 ? `(${iq(k)})` : iq(k));
        return N(`−4부터 4까지의 정수가 하나씩 적힌 카드 9장이 있다. 두 사람이 이 카드를 3장씩 뽑아, 뽑은 카드에 적힌 세 수의 합이 0에 더 가까운 사람이 이기는 놀이를 한다. ${name(who, '이/가')} ${listJ(A, '이/가')} 적힌 카드를 뽑았고, ${name(other, '은/는')} ${listJ(Bc, '이/가')} 적힌 카드를 뽑은 다음 한 장을 더 뽑는다. ${name(other, '이/가')} 이기게 되는 세 번째 카드는 모두 몇 장인가? (단, 한 번 뽑은 카드는 다시 뽑지 않는다.)`, ok.length, {
          unit: '장',
          explain: `${who}의 합은 ${A.map(sg).join(' + ')} = ${iq(sA)}이고, 0을 나타내는 점까지의 거리는 ${Math.abs(sA)}이다. ${other}의 두 수의 합은 ${Bc.map(sg).join(' + ')} = ${iq(sB)}이므로, 세 번째 수를 더한 합의 절댓값이 ${Math.abs(sA)}보다 작아야 한다. 그런 수는 ${cand.map(iq).join(', ')}이고, 이 가운데 이미 뽑힌 ${gone.map(iq).join(', ')}${tail(Math.abs(gone[gone.length - 1]), '을/를')} 빼면 ${ok.map(iq).join(', ')}의 ${ok.length}장이다.`,
          facts: { digit: { template: `(${e(sB)}+□)*(${e(sB)}+□)<${e(sA)}*${e(sA)}>0<${taken.map((k) => `(□-${e(k)})*(□-${e(k)})`).join('*')}`, lo: -4, hi: 4, ask: 'count' } }
        });
      }),
      H('hard-mix-fracpow', '분수의 분모에 거듭제곱이 있고 대분수와 소수가 섞인 혼합 계산', '심44', (d) => {
        // 분모의 거듭제곱 → 분수의 제곱 → 나눗셈 → 대분수와 소수의 차의 제곱 → 덧셈의 차례로 계산한다. (−3)²은 9이고, 괄호 안의 차는 음수일 수 있다.
        const r = d.until(() => {
          const b = d.pick([2, 3]), a = co(d, b, 1, 4), c = d.int(2, 6), k = d.pick([2, 3, 5, 7]), w = d.int(2, 4), u = d.until(() => d.int(0, 6), (t) => t !== w), decFirst = d.bool();
          return { b, a, c, k, w, u, decFirst, first: Q(a * a * k, b * b * c), sq: (u - w) * (u - w) };
        }, (m) => m.first.q > 1 && m.first.q <= 12 && m.first.p <= 40 && m.sq <= 9 && m.a !== m.c && gcd(m.c, m.k) === 1 && m.c % m.b !== 0);
        const { b, a, c, k, w, u, decFirst, first, sq } = r, B2 = b * b, dec = dc(10 * u + 5), pw = `(−${b})${sup(2)}`, v = qadd(first, Q(sq)), diff = decFirst ? u - w : w - u;
        const h = `(${frac(a, pw)})${sup(2)} <i>÷</i> ${frac(c, `${k} × ${pw}`)} <i>+</i> (${decFirst ? `${tx(dec)} <i>−</i> ${mixed(w, 1, 2)}` : `${mixed(w, 1, 2)} <i>−</i> ${tx(dec)}`})${sup(2)}`;
        return ansV('다음을 계산하시오.', v, 'frac', {
          figure: `<span class="mb-expr" style="font-size:0.95rem">${h}</span>`,
          explain: `${pw} = ${B2}이므로 (${frac(a, pw)})${sup(2)} = (${frac(a, B2)})${sup(2)} = ${tx(Q(a * a, B2 * B2))}, ${frac(c, `${k} × ${pw}`)} = ${tx(Q(c, k * B2))}이다. ${mixed(w, 1, 2)} = ${w}.5이므로 괄호 안의 차는 ${iq(diff)}이고 그 제곱은 ${sq}이다. ${tx(Q(a * a, B2 * B2))} ÷ ${tx(Q(c, k * B2))} + ${sq} = ${tx(Q(a * a, B2 * B2))} × ${tx(Q(k * B2, c))} + ${sq} = ${tx(first)} + ${sq} = ${tx(v)}이다.`,
          facts: { value: `((${a}/((-${b})**2))**2)/(${c}/(${k}*((-${b})**2)))+(${decFirst ? `${u}.5-(${w}+1/2)` : `(${w}+1/2)-${u}.5`})**2`, rule: 'mix-fracpow' }
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

  // ══ 다시 실은 꼴(2026-10-13) — 기본 묶음의 끝에 붙이는 것 ══
  // 다시 본 꼴 가운데 두 단계 안팎으로 풀리는 것은 기본에 둔다(위의 「기본 묶음에 덧붙이는 꼴」은 그대로 두고 그 뒤에 붙인다).
  B.addTypes('7-1-2', 'sub', [
    T('sub-ends-between', '「~만큼 작은 수」와 「~만큼 큰 수」 사이에 있는 정수의 개수', '②10', (d) => {
      // 두 끝을 저마다 뺄셈과 덧셈으로 구한 다음 그 사이의 정수를 센다(원문은 풀이 과정을 쓰는 문제 — 개수로 바꾸었다).
      const [x, y, u, v, lo, hi] = d.until(() => { const xx = Q(d.int(-6, 3)), yy = signedQ(pm(d), fr(d, [2, 3, 4], 4)), uu = Q(d.int(-6, 3)), vv = signedQ(pm(d), fr(d, [2, 3, 4], 4)), p = qsub(xx, yy), q = qadd(uu, vv); return qcmp(p, q) < 0 ? [xx, yy, uu, vv, p, q] : [xx, yy, uu, vv, q, p]; },
        (r) => { const n = Math.ceil(fl(r[5])) - Math.floor(fl(r[4])) - 1; return r[4].q > 1 && r[5].q > 1 && n >= 2 && n <= 6 && fl(r[4]) < -1 && (r[1].p < 0 || r[3].p < 0) && r[0].p !== 0 && r[2].p !== 0 && qcmp(r[1], r[3]) !== 0; });
      const first = Math.floor(fl(lo)) + 1, last = Math.ceil(fl(hi)) - 1, count = last - first + 1, e1 = `${js(x)}-${js(y)}`, e2 = `${js(u)}+${js(v)}`, smallFirst = qcmp(qsub(x, y), qadd(u, v)) < 0;
      return N(`${tx(x)}보다 ${tx(y)}만큼 작은 수와 ${tx(u)}보다 ${tx(v)}만큼 큰 수 사이에 있는 정수는 모두 몇 개인가?`, count, {
        unit: '개',
        explain: `${tx(x)}보다 ${tx(y)}만큼 작은 수는 ${subTold(x, y)}이고, ${tx(u)}보다 ${tx(v)}만큼 큰 수는 ${addTold(u, v)}이다. ${tj(lo, '과/와')} ${tx(hi)} 사이에 있는 정수는 ${range(first, last).map(iq).join(', ')}의 ${count}개이다.`,
        facts: { digit: { template: smallFirst ? `(${e1})<□<(${e2})` : `(${e2})<□<(${e1})`, lo: -20, hi: 20, ask: 'count' } }
      });
    }),
    T('sub-net-opposite', '전개도에서 마주 보는 면에 적힌 두 수의 합이 정해진 정육면체', '심27', (d) => {
      // 전개도에서 마주 보는 면을 찾고(가운데 줄에서는 한 칸 건너 있는 두 면, 위와 아래에 붙은 두 면), 합에서 주어진 수를 뺀다.
      const [total, known] = d.until(() => [-d.int(2, 9), [nz(d, -9, 9), nz(d, -9, 9), nz(d, -9, 9)]], ([s, ks]) => { const rest = ks.map((k) => s - k); return new Set(ks.concat(rest)).size === 6 && ks.some((k) => k < 0) && ks.some((k) => k > 0) && rest.every((k) => Math.abs(k) <= 20); });
      const up = d.int(0, 3), down = d.int(0, 3), flips = [d.bool(), d.bool(), d.bool()];
      // 자리: 0 위, 1~4 가운데 줄, 5 아래. 마주 보는 짝은 (1, 3), (2, 4), (0, 5). 짝마다 한쪽에 주어진 수를, 다른 쪽에 빈칸을 놓는다.
      const PAIRS = [[1, 3], [2, 4], [0, 5]], cells = [], asked = [];
      PAIRS.forEach(([p, q], i) => { const [shown, blank] = flips[i] ? [q, p] : [p, q]; cells[shown] = { v: known[i] }; cells[blank] = { ask: i }; });
      [0, 1, 2, 3, 4, 5].forEach((at) => { if (cells[at].ask != null) { cells[at].label = LAB[asked.length]; asked.push(cells[at].ask); } });
      const text = (c) => (c.label || iq(c.v));
      return M(`다음 전개도를 접어서 만든 정육면체에서 마주 보는 면에 적힌 두 수의 합이 모두 ${iq(total)}일 때, ㉠, ㉡, ㉢에 알맞은 수는?`, asked.map((i, k) => ({ label: LAB[k], answer: total - known[i], signed: true })), {
        figure: netFig([1, 2, 3, 4].map((at) => text(cells[at])), [up, text(cells[0])], [down, text(cells[5])]),
        explain: `전개도를 접으면 가운데 줄에서는 한 칸 건너 있는 두 면이, 위와 아래에 붙은 두 면이 서로 마주 본다. ${asked.map((i, k) => `${LAB[k]}이 적힌 면은 ${iq(known[i])}${tail(Math.abs(known[i]), '이/가')} 적힌 면과 마주 보므로 ${LAB[k]} = ${subTold(Q(total), Q(known[i]))}`).join(', ')}이다.`,
        facts: { calc: asked.map((i, k) => [`${e(total)}-${e(known[i])}`, k]) }
      });
    })
  ]);
  B.addTypes('7-1-2', 'div', [
    T('div-recip-back', '나눈 수의 역수가 주어졌을 때 처음 수 구하기', '①78', (d) => {
      // 역수의 뜻을 거꾸로 댄 다음(역수가 r 인 수는 r 의 역수), 나눗셈을 거꾸로 계산한다. 원문은 분수 꼴 문자식(x/2)으로 적혀 있어 글로 풀어 썼다.
      const [k, r, back, v] = d.until(() => { const kk = Q(pm(d) * d.int(2, 6)), rr = d.bool() ? signedQ(pm(d), fr(d, [2, 3, 4, 5], 3)) : Q(pm(d) * d.int(2, 9)), bb = qdiv(Q(1), rr); return [kk, rr, bb, qmul(bb, kk)]; }, (m) => okKind(m[3], 'frac') && m[3].q <= 12 && (m[0].p < 0 || m[1].p < 0));
      return ansV(`어떤 수를 ${tj(k, '으로/로')} 나눈 수의 역수가 ${tx(r)}일 때, 어떤 수는?`, v, 'frac', {
        explain: `역수가 ${tx(r)}인 수는 ${tx(r)}의 역수인 ${tx(back)}이다. 어떤 수를 ${tj(k, '으로/로')} 나눈 수가 ${tx(back)}이므로 어떤 수는 ${mulTold(back, k)}이다.`,
        facts: { value: `(1/${js(r)})*${js(k)}`, unseen: [1] }
      });
    })
  ]);

  // 정수 뒤 토씨(음수는 절댓값으로 맞춘다)
  function josaNum(n, pair) { return iq(n) + tail(Math.abs(n), pair); }
})(typeof window !== 'undefined' ? window : globalThis);
