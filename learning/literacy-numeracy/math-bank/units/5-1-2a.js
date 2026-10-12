// 5학년 1학기 2단원 약수와 배수 — 단원 틀과 기본 문항(약수, 배수, 약수와 배수의 관계, 공약수와 최대공약수, 최대공약수 구하는 방법).
// 수집해 둔 교과서 9종의 평가 자료에서 뽑은 문제 꼴 목록(기본꼴 1~3: 88·113·98꼴, 심화꼴 91꼴)을 처음부터 끝까지 대조하여,
// 꼴마다 ① 몇 학년 무슨 단원 내용인가 ② 무엇을 주고 무엇을 묻는가를 따져서 실었다. 꼴 번호는 ①n = 기본꼴_1의 n번, ②n, ③n, 심n.
// (공배수와 최소공배수, 최소공배수 구하는 방법, 활용 문장제의 기본 문항과 실력 문항은 5-1-2b.js에 있다.)
//
// 싣는 기준
//  - 답은 모두 코드로 셈한다(약수 목록, 최대공약수, 최소공배수, 범위 안의 배수의 수, 고르기 문항의 참·거짓).
//  - 「모두 쓰시오」는 칸 수가 답을 알려 주므로 「모두 몇 개인가」「아닌 것은」「모두 고른 것은」「몇째 수는」으로 바꾸어 묻는다.
//    개수를 문제에서 정해 준 것(가장 작은 수부터 3개)만 수를 여럿 적게 한다.
//  - 두 수는 100 안쪽이다. 한쪽이 다른 쪽의 배수인 쌍(6과 18), 공약수가 1뿐인 쌍(8과 15), 그 밖의 쌍은 구조가 달라 따로 싣는다(facts.rule).
//  - 최대공약수는 구하는 길마다 따로 싣는다: 약수를 늘어놓아 찾기, 곱셈식에서 공통인 부분 읽기(「소수」「소인수분해」라는 낱말은 쓰지 않는다),
//    공약수로 나누는 셈(틀을 읽기, 빈칸 채우기, 덜 나눈 셈 바로잡기). 「공약수는 최대공약수의 약수」를 써서 푸는 꼴도 따로 싣는다.
//  - 숫자만 다르거나 상황만 다른 것은 한 번만 싣는다. 잇기(②37·53 ③31·55)는 짝마다 따져 고르는 문항과 하는 일이 같다.
//  - 낱말 쓰기(①3·31 ②30 ③1·26·36)는 알맞은 말을 고르는 문항으로, 「모두 구하기」(①2 ②4 ③4)는 바르게 쓴 것 고르기와 개수 묻기로 바꾸었다.
//
// 뺀 것과 까닭
//  - 두 수를 여러 수의 곱(소인수의 곱)으로 나타내어 최대공약수·최소공배수·공약수의 수를 구하는 것: 교육과정이 「평가에서 소인수의 곱으로 나타내어
//    구하는 방법은 다루지 않는다」고 했다(2026-10-12 받을 때 걷어 냄). 두 수의 곱 하나로 나타낸 식과 공약수로 나누는 셈은 실었다.
//  - 같은 두 수로 「나누어 주기」와 「다시 만나기」를 한 문제에 붙인 것: 기본 문제 둘을 붙였을 뿐이라 실력이 아니다.
//  - 3·9·4의 배수 판정법: 자리 숫자의 합으로 3의 배수 만들기(③24)
//  - 넓이(5-1 뒤 단원): 넓이가 정해진 직사각형의 변(①44)
//  - 경우 따지기·조건 풀이가 어려움의 대부분인 것: 수 카드로 만든 수 가운데 배수의 수(①30 ③25), 수 카드로 약수와 배수의 관계 만들기(심28),
//    수 카드로 만든 「세 번째로 작은 수」의 약수(심10), 약수의 합이 정해진 수 찾기(①41 ③82 심34·35), 조건 넷(①42 변형 ②91 변형 ③81 변형),
//    띠가 같은 사람의 나이(③83), 비밀번호(③84)
//  - 간격 세기·3학년 나눗셈 그대로인 문장제: 일정한 간격으로 떠나는 버스의 횟수(①27 ②96 ③23 심17), 몇 번째 알람(심18 ②97 변형),
//    색종이 50장으로 모빌 몇 개(①29 변형)
//  - 작도·서술형·열린 답: 수직선에 배수 나타내기(①19 ②26), 까닭 쓰기(②16 ③11·35 심11), 관계가 되게 빈칸 채우기(①43 ③34),
//    조건에 맞게 카드 채우기(③56), 관계 설명하기(③46 — 뜻은 cd-say 로 묻는다)
//  - 뜻 없는 셈·억지로 이은 셈: 배수를 찾아 그 수의 약수의 개수(심9), 약수의 합과 가까운 배수의 합·차(심19), 9와 12 가운데 배수가 더 많은 수(①16 변형)
//  - 꼬임(가려진 칸 여럿을 되짚기): 나눗셈 틀에서 처음 두 수 되짚기(①58 ②55 변형 심50), 곱셈식의 가려진 곳(②63 심51)
//  - 앞 학년 되짚기·읽을거리: 곱셈·나눗셈 준비 학습(②113 ③97), 완전수·부족수·과잉수(③98), 바구니·건전지 수 표(①14 변형 ③15 변형)
//  - 4학년 「규칙 찾기」와 같은 것: 배수를 늘어놓은 줄의 가운데 빈칸(②19 ③17 변형 — 어떤 수의 배수인지 묻는 ml-of-what 에 합쳤다)
// 묻는 말: 수나 값을 물으면 "~은?/~는?", 양을 물으면 "몇 ~인가?" 로 맺는다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { LABELS, NAMES, box, lines, numbers, josa, name, N, M, C } = B.kit;
  const U = '5-1-2', DIV = '6수01-04', MUL = '6수01-05';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  const ORD = ['첫째', '둘째', '셋째', '넷째', '다섯째', '여섯째', '일곱째', '여덟째', '아홉째', '열째'];
  const range = (n, from) => Array.from({ length: n }, (_, i) => i + (from || 0));
  const sum = (list) => list.reduce((s, v) => s + v, 0);
  const asc = (list) => list.slice().sort((x, y) => x - y);
  const gcd = (a, b) => (b ? gcd(b, a % b) : a);
  const lcm = (a, b) => (a * b) / gcd(a, b);
  const divs = (n) => range(n, 1).filter((k) => n % k === 0);
  // 더 쪼갤 수 없을 때까지 곱으로 나타낸 수들: factors(12) → [2, 2, 3]
  const factors = (n) => { const out = []; let m = n; for (let p = 2; m > 1; p += 1) while (m % p === 0) { out.push(p); m /= p; } return out; };
  const times = (list) => list.join(' × ');
  const rest = (a, b) => (a % b ? ` … ${a % b}` : '');
  const truthOf = (rows, want) => ({ truth: rows.map((row) => row[1]), want });
  // 참·거짓이 붙은 보기 가운데 하나만 참(거짓)인 고르기 문항. 참·거짓은 코드로 셈하여 넣는다.
  const CT = (text, rows, want, o) => C(text, rows.map((row) => row[0]), rows.findIndex((row) => row[1] === want), Object.assign({}, o, { facts: Object.assign(truthOf(rows, want), o.facts || {}) }));
  const swap = (d, pair) => (d.bool() ? pair : [pair[1], pair[0]]);
  // 한 줄로 놓인 수
  const seq = (list) => '<div class="mb-numbers" style="gap:6px 14px;padding:8px 12px">' + list.map((v) => '<span style="font-size:1.1rem">' + v + '</span>').join('') + '</div>';
  // 글이 긴 줄(약수·배수를 늘어놓은 줄, 문장)은 글씨를 조금 줄여 적는다.
  const notes = (rows) => '<div class="mb-lines" style="font-size:1rem">' + rows.map((row) => '<div>' + row + '</div>').join('') + '</div>';
  // 약수가 6~10개인 수(약수를 늘어놓기 알맞은 수)
  const RICH = range(69, 12).filter((n) => divs(n).length >= 6 && divs(n).length <= 10);
  const SIX = [12, 18, 20, 28, 32, 44, 45, 50];   // 약수가 꼭 6개인 수
  // 두 수 고르기(작은 수가 앞). kind: 'general'(공약수가 1보다 크고 서로 약수·배수가 아니다) | 'nested'(한쪽이 다른 쪽의 배수) | 'coprime'(공약수가 1뿐)
  function pairOf(d, kind, o) {
    const m = Object.assign({ min: 4, max: 96, maxL: 400, gMin: 2, gMax: 24 }, o || {});
    if (kind === 'nested') return d.until(() => { const a = d.int(m.min, 24); return [a, a * d.int(2, 6)]; }, ([, b]) => b <= m.max);
    if (kind === 'coprime') return d.until(() => [d.int(3, 14), d.int(4, 16)], ([a, b]) => a < b && gcd(a, b) === 1 && a * b <= m.maxL);
    return d.until(() => { const g = d.int(m.gMin, Math.min(m.gMax, 16)); return [g * d.int(2, 7), g * d.int(3, 9)]; },
      ([a, b]) => a < b && a >= m.min && b <= m.max && b % a !== 0 && gcd(a, b) >= m.gMin && gcd(a, b) <= m.gMax && lcm(a, b) <= m.maxL && (!m.ok || m.ok(a, b)));
  }

  // ── 그림 ─────────────────────────────────────────────────────
  // 수 배열표. 칸은 모두 같은 모양이고, on(수)이 참인 칸은 색칠한다.
  function numGrid(cells, cols, on) {
    const rows = [];
    for (let i = 0; i < cells.length; i += cols) rows.push(cells.slice(i, i + cols));
    const td = (v) => '<td style="padding:5px 0;width:2.2em;font-weight:400;background:' + (on && on(v) ? '#fde68a' : '#fff') + '">' + v + '</td>';
    return '<div class="mb-table-wrap"><table class="mb-table"><tbody>' + rows.map((row) => '<tr>' + row.map(td).join('') + '</tr>').join('') + '</tbody></table></div>';
  }
  // 공약수로 나누는 셈. rows: [[나누는 수, 왼쪽 수, 오른쪽 수], …], last: 맨 아래에 남은 두 몫. 칸에 box() 를 넣으면 빈칸이다.
  function ladder(rows, last) {
    const cell = 'padding:4px 12px;text-align:center;min-width:2.6em', ink = '2px solid var(--ink, #1f2933)';
    const body = rows.map(([k, a, b]) => '<tr><td style="padding:4px 8px 4px 4px;text-align:right;min-width:1.8em">' + k + '</td><td style="' + cell + ';border-left:' + ink + ';border-bottom:' + ink + '">' + a + '</td><td style="' + cell + ';border-bottom:' + ink + '">' + b + '</td></tr>').join('');
    return '<table role="img" aria-label="공약수로 나누는 셈" style="border-collapse:collapse;font-size:1.2rem;font-variant-numeric:tabular-nums;line-height:1.4"><tbody>' + body
      + '<tr><td></td><td style="' + cell + '">' + last[0] + '</td><td style="' + cell + '">' + last[1] + '</td></tr></tbody></table>';
  }
  // 공약수로 나누는 셈의 차례: 작은 공약수부터 거듭 나눈다. steps 를 주면 그만큼만 나누고 멈춘다.
  function ladderOf(a, b, steps) {
    const rows = []; let x = a, y = b;
    for (const p of factors(gcd(a, b)).slice(0, steps || 99)) { rows.push([p, x, y]); x /= p; y /= p; }
    return { rows, last: [x, y], by: rows.map((row) => row[0]) };
  }

  B.addUnit({
    id: '5-1-2', grade: 5, semester: 1, no: 2, title: '약수와 배수', version: 1,
    groups: [
      { id: 'div', title: '약수', standard: DIV, types: [] },
      { id: 'mul', title: '배수', standard: MUL, types: [] },
      { id: 'rel', title: '약수와 배수의 관계', standard: DIV, types: [] },
      { id: 'cd', title: '공약수와 최대공약수', standard: DIV, types: [] },
      { id: 'gw', title: '최대공약수 구하는 방법', standard: DIV, types: [] },
      { id: 'cm', title: '공배수와 최소공배수', standard: MUL, types: [] },
      { id: 'lw', title: '최소공배수 구하는 방법', standard: MUL, types: [] },
      { id: 'use', title: '최대공약수와 최소공배수의 활용', standard: DIV, types: [] }
    ]
  });

  // ── 약수 ─────────────────────────────────────────────────────
  B.addTypes(U, 'div', [
    T('dv-word', '약수와 배수의 뜻', '①3 ③1', (d) => {
      const n = d.pick([6, 8, 10, 12, 15]);
      const rows = d.shuffle([['약수, 배수', true], ['배수, 약수', false], ['약수, 공약수', false], ['공배수, 배수', false]]);
      return CT('㉠, ㉡에 알맞은 말을 차례로 쓴 것은?', rows, true, {
        figure: lines([`${josa(n, '을/를')} 나누어떨어지게 하는 수 → ${n}의 ${box(LABELS[0])}`, `${josa(n, '을/를')} 1배, 2배, 3배 … 한 수 → ${n}의 ${box(LABELS[1])}`]),
        explain: `${josa(n, '을/를')} 나누어떨어지게 하는 수는 ${n}의 약수이고, ${josa(n, '을/를')} 1배, 2배, 3배 … 한 수는 ${n}의 배수이다.`
      });
    }),
    T('dv-fill', '나눗셈식으로 약수 구하기', '①1 ②2 ③3 심1', (d) => {
      const n = d.pick(SIX), list = divs(n), [i, j] = d.pick([[1, 3], [2, 4], [1, 4], [2, 3]]);
      const row = (k, at) => `${n} ÷ ${at === i ? box(LABELS[0]) : at === j ? box(LABELS[1]) : k} = ${n / k}`;
      return M(`${n}의 약수를 구하려고 ${josa(n, '을/를')} 나누어떨어지게 하는 수를 차례로 찾았다. ㉠, ㉡에 알맞은 수는?`, [{ label: LABELS[0], answer: list[i] }, { label: LABELS[1], answer: list[j] }], {
        figure: lines(list.map(row)), explain: `${n} ÷ ${list[i]} = ${n / list[i]}, ${n} ÷ ${list[j]} = ${n / list[j]}이다. ${n}의 약수는 ${list.join(', ')}이다.`,
        facts: { calc: [[`${n}/${n / list[i]}`, 0], [`${n}/${n / list[j]}`, 1]] }
      });
    }),
    T('dv-rest', '나머지가 있는 식이 섞인 나눗셈식', '①1 ②1 ③2 심1', (d) => {
      const n = d.pick([6, 8, 9, 10]), list = divs(n);
      return N(`나눗셈식을 보고 ${n}의 약수를 모두 찾으면 몇 개인가?`, list.length, {
        unit: '개', figure: '<div class="mb-lines" style="grid-template-columns:1fr 1fr;gap:6px 18px;font-size:1.02rem">' + range(n, 1).map((k) => `<div>${n} ÷ ${k} = ${Math.floor(n / k)}${rest(n, k)}</div>`).join('') + '</div>',
        explain: `나누어떨어지는 식의 나누는 수가 ${n}의 약수이다. ${n}의 약수는 ${list.join(', ')}이고 모두 ${list.length}개이다.`, facts: { count: range(n, 1).map((k) => n % k === 0) }
      });
    }),
    T('dv-all', '약수를 모두 구한 것', '①2 ②4 ③4 심1', (d) => {
      // 틀린 보기: 1과 자기 자신을 뺀 것, 자기 자신을 뺀 것, 1을 뺀 것
      const n = d.pick(SIX), list = divs(n);
      const rows = d.shuffle([[list.join(', '), true], [list.slice(1, -1).join(', '), false], [list.slice(0, -1).join(', '), false], [list.slice(1).join(', '), false]]);
      return CT(`${n}의 약수를 모두 쓴 것은?`, rows, true, { explain: `${n} ÷ 1 = ${n}, ${n} ÷ ${n} = 1이므로 ${josa(1, '과/와')} ${n}도 ${n}의 약수이다. ${n}의 약수는 ${list.join(', ')}이다.` });
    }),
    T('dv-count', '약수의 개수', '①7 ②10 ③6 심7', (d) => {
      const n = d.pick(RICH.filter((v) => divs(v).length >= 8)), list = divs(n);
      return N(`${n}의 약수는 모두 몇 개인가?`, list.length, { unit: '개', explain: `${n}의 약수는 ${list.join(', ')}이다.`, facts: { count: range(n, 1).map((k) => n % k === 0) } });
    }),
    T('dv-not', '약수가 아닌 것 고르기', '①4 ②8 ③5 심2', (d) => {
      // 틀린 수는 약수처럼 보이는 수(그 수와 공약수가 있는 수)로 고른다.
      const n = d.pick(RICH), list = divs(n), odd = d.pick(range(n - 3, 2).filter((k) => n % k !== 0 && gcd(k, n) > 1));
      const rows = d.shuffle(d.shuffle(list).slice(0, 4).concat([odd]).map((k) => [String(k), n % k === 0]));
      return CT(`${n}의 약수가 아닌 것은?`, rows, false, { explain: `${n} ÷ ${odd} = ${Math.floor(n / odd)}${rest(n, odd)}이므로 ${josa(odd, '은/는')} ${n}의 약수가 아니다.` });
    }),
    T('dv-among-count', '수 가운데 약수의 개수', '②7 ③5 심2', (d) => {
      const n = d.pick(RICH), yes = d.shuffle(divs(n).filter((k) => k > 1)).slice(0, d.int(3, 4)), no = d.shuffle(range(n - 3, 2).filter((k) => n % k !== 0)).slice(0, 7 - yes.length), shown = d.shuffle(yes.concat(no));
      return N(`다음 수 가운데 ${n}의 약수는 모두 몇 개인가?`, yes.length, { unit: '개', figure: numbers(shown), explain: `이 가운데 ${n}의 약수는 ${asc(yes).join(', ')}이다.`, facts: { count: shown.map((k) => n % k === 0) } });
    }),
    T('dv-left-right', '왼쪽 수가 오른쪽 수의 약수인 짝', '①5·36 ②9·16 ③11 심2·11', (d) => {
      // 틀린 보기: 두 수의 자리가 뒤바뀐 짝(오른쪽 수가 왼쪽 수의 약수), 나누어떨어지지 않는 짝
      const [a, m] = d.until(() => [d.int(4, 15), d.int(3, 8)], ([x, y]) => x * y >= 30 && x * y <= 98);
      const [c, k] = d.until(() => [d.int(3, 13), d.int(3, 7)], ([x, y]) => x * y >= 30 && x * y <= 98 && x !== a);
      const wrong = () => d.until(() => [d.int(4, 15), d.int(30, 98)], ([x, y]) => y % x !== 0);
      const pairs = d.until(() => [[a, a * m], [c * k, c], wrong(), wrong()], (list) => new Set(list.map(String)).size === 4);
      const rows = d.shuffle(pairs.map(([x, y]) => [`(${x}, ${y})`, y % x === 0]));
      return CT('왼쪽 수가 오른쪽 수의 약수인 것은?', rows, true, { explain: `${a * m} ÷ ${a} = ${m}이므로 ${josa(a, '은/는')} ${a * m}의 약수이다. (${c * k}, ${c})에서는 오른쪽 수가 왼쪽 수의 약수이다.` });
    }),
    T('dv-nth', '몇째 약수', '③8 심25', (d, n) => {
      const v = d.pick(RICH), list = divs(v);
      if (n === 0) {
        const k = d.pick([3, 4]);
        return N(`${v}의 약수를 작은 수부터 차례로 쓸 때 ${ORD[k]} 수는?`, list[k], { explain: `${v}의 약수를 작은 수부터 쓰면 ${list.join(', ')}이다. ${ORD[k]} 수는 ${list[k]}이다.`, facts: { calc: [[`${v}/${v / list[k]}`, 0]], unseen: [v / list[k]] } });
      }
      const second = list[list.length - 2];
      return N(`${v}의 약수 중 둘째로 큰 수는?`, second, { explain: `${v}의 약수는 ${list.join(', ')}이다. 가장 큰 수는 ${v}이고 둘째로 큰 수는 ${second}이다.`, facts: { calc: [[`${v}/${list[1]}`, 0]], unseen: [list[1]] } });
    }, { count: 2 }),
    T('dv-min-max', '가장 작은 약수와 가장 큰 약수', '②14·15 ③8·13 심4', (d) => {
      const n = d.until(() => d.int(14, 98), (v) => divs(v).length >= 4);
      return M(`${n}의 약수 중 가장 작은 수와 가장 큰 수는?`, [{ label: '가장 작은 수', answer: 1 }, { label: '가장 큰 수', answer: n }], {
        explain: `1은 모든 수의 약수이므로 가장 작은 약수는 1이다. ${n} ÷ ${n} = 1이므로 ${n}도 ${n}의 약수이고, 가장 큰 약수는 ${n}이다.`, facts: { calc: [[`${n}/${n}`, 0], [`${n}`, 1]] }
      });
    }),
    T('dv-sum', '약수의 합', '①10 ②13 ③9 심5', (d) => {
      const n = d.pick([8, 10, 14, 15, 16, 21, 22, 26, 27, 33, 34, 35, 39]), list = divs(n);
      return N(`${n}의 약수를 모두 더한 값은?`, sum(list), { explain: `${n}의 약수는 ${list.join(', ')}이다. ${list.join(' + ')} = ${sum(list)}`, facts: { calc: [[list.join('+'), 0]], unseen: list.filter((k) => k !== n) } });
    }),
    T('dv-count-most', '약수가 가장 많은 수', '①8 ②11 ③7 심6', (d) => {
      const list = d.until(() => d.shuffle(range(40, 9)).slice(0, 3), (xs) => new Set(xs.map((x) => divs(x).length)).size === 3), counts = list.map((x) => divs(x).length);
      return C('약수의 개수가 가장 많은 수는?', list.map(String), counts.indexOf(Math.max(...counts)), { explain: list.map((x, i) => `${x}의 약수는 ${counts[i]}개`).join(', ') + '이다.', facts: { rank: { values: counts, nth: 1 } } });
    }),
    T('dv-count-order', '약수의 개수가 많은 차례', '①9 ②11 ③7 심6', (d) => {
      // 틀린 보기: 큰 수일수록 약수가 많다고 여겨 수의 크기 차례로 쓴 것
      const list = d.until(() => d.shuffle(range(40, 9)).slice(0, 3), (xs) => { const c = xs.map((x) => divs(x).length); return new Set(c).size === 3 && c.indexOf(Math.max(...c)) !== xs.indexOf(Math.max(...xs)); });
      const counts = list.map((x) => divs(x).length), by = (key) => [0, 1, 2].sort((x, y) => key[y] - key[x]), right = by(counts), size = by(list);
      const others = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]].filter((p) => p.join() !== right.join() && p.join() !== size.join());
      const orders = d.shuffle([right, size].concat(d.shuffle(others).slice(0, 2)));
      return C('약수의 개수가 많은 수부터 차례로 쓴 것은?', orders.map((o) => o.map((i) => list[i]).join(', ')), orders.findIndex((o) => o.join() === right.join()), {
        figure: numbers(list), explain: list.map((x, i) => `${x}의 약수는 ${counts[i]}개`).join(', ') + '이다. 수가 크다고 약수가 많은 것은 아니다.', facts: { choose: { exprs: counts.map(String), rule: 'descending', orders }, unseen: counts }
      });
    }),
    T('dv-count-odd', '약수의 개수가 다른 수', '①8 ②12 심6', (d) => {
      const list = d.until(() => d.shuffle(range(40, 9)).slice(0, 3), (xs) => new Set(xs.map((x) => divs(x).length)).size === 2 && xs.every((x) => divs(x).length >= 3)), counts = list.map((x) => divs(x).length);
      return C('약수의 개수가 나머지 둘과 다른 수는?', list.map(String), counts.findIndex((c) => counts.filter((v) => v === c).length === 1), {
        explain: list.map((x, i) => `${x}의 약수는 ${counts[i]}개`).join(', ') + '이다.', facts: { choose: { exprs: counts.map(String), rule: 'odd' }, unseen: counts }
      });
    }),
    T('dv-list-blank', '약수를 늘어놓은 줄의 빈칸', '②5 심3', (d) => {
      // 약수는 곱해서 그 수가 되는 것끼리 짝을 이룬다. 짝이 자기 자신인 칸(6 × 6 = 36의 6)은 가리지 않는다.
      const [n, i] = d.until(() => { const v = d.pick(RICH); return [v, d.int(2, divs(v).length - 2)]; }, ([v, at]) => divs(v).length - 1 - at !== at);
      const list = divs(n), mate = list[list.length - 1 - i];
      return N('어떤 수의 약수를 작은 수부터 차례로 모두 쓴 것이다. □ 안에 알맞은 수는?', list[i], {
        figure: seq(list.map((k, at) => (at === i ? box() : k))), explain: `가장 큰 약수가 그 수이므로 어떤 수는 ${n}이다. ${mate} × □ = ${n}이므로 □ = ${n} ÷ ${mate} = ${list[i]}이다.`, facts: { calc: [[`${n}/${mate}`, 0]] }
      });
    }),
    T('dv-list-number', '약수를 보고 어떤 수 찾기', '②6 ③10 ①2 심3', (d) => {
      const n = d.until(() => d.int(15, 95), (v) => divs(v).length >= 4 && divs(v).length <= 6), list = divs(n), shown = d.until(() => d.shuffle(list), (xs) => xs[0] !== n && xs[xs.length - 1] !== n);
      return N('어떤 수의 약수를 차례 없이 모두 쓴 것이다. 어떤 수는?', n, { figure: seq(shown), explain: `어떤 수의 약수 중 가장 큰 수는 그 수 자신이다. 가장 큰 수가 ${n}이므로 어떤 수는 ${n}이다.`, facts: { calc: [[`${list[1]}*${n / list[1]}`, 0]] } });
    }),
    T('dv-say', '약수에 대한 설명', '①11 ③12', (d) => {
      // 틀린 말: 1과 자기 자신을 빼고 센 것, 자기 자신을 빼고 더한 것, 자기 자신을 빼고 가장 큰 수를 찾은 것
      const n = d.pick(SIX), list = divs(n), total = sum(list), slip = d.pick(['count', 'sum', 'max']);
      const rows = d.shuffle([
        [`${n}의 약수는 모두 ${slip === 'count' ? list.length - 2 : list.length}개이다.`, slip !== 'count'],
        [`${n}의 약수를 모두 더하면 ${slip === 'sum' ? total - n : total}이다.`, slip !== 'sum'],
        [`${n}의 약수 중 가장 큰 수는 ${slip === 'max' ? list[list.length - 2] : n}이다.`, slip !== 'max'],
        [`${n}의 약수 중 가장 작은 수는 1이다.`, true]
      ]);
      const why = { count: `${n}의 약수는 ${list.join(', ')}이고 모두 ${list.length}개이다. ${josa(1, '과/와')} ${n}도 ${n}의 약수이다.`, sum: `${n}도 ${n}의 약수이므로 함께 더한다. ${list.join(' + ')} = ${total}`, max: `${n} ÷ ${n} = 1이므로 ${n}의 약수 중 가장 큰 수는 ${n}이다.` }[slip];
      return CT(`${n}의 약수에 대한 설명으로 옳지 않은 것은?`, rows, false, { explain: why });
    }),
    T('dv-share-ways', '남김없이 똑같이 나누어 주는 방법의 수', '①12 ②94 ③14 심8', (d) => {
      const [thing, unit] = d.pick([['연필', '자루'], ['사탕', '개'], ['색종이', '장'], ['구슬', '개']]), n = d.pick([18, 20, 28, 32, 40, 42, 45, 50, 54]), list = divs(n).filter((k) => k > 1);
      return N(`${thing} ${n}${josa(unit, '을/를')} 2명 이상의 친구에게 남김없이 똑같이 나누어 주려고 한다. 나누어 줄 수 있는 친구 수는 모두 몇 가지인가?`, list.length, {
        unit: '가지', explain: `친구 수는 ${n}의 약수 가운데 2 이상인 수이다. ${list.join('명, ')}명으로 ${list.length}가지이다.`, facts: { count: range(n - 1, 2).map((k) => n % k === 0) }
      });
    }),
    T('dv-share-cannot', '똑같이 나누어 줄 수 없는 사람 수', '①12 ②95 심8', (d) => {
      const [thing, unit] = d.pick([['초콜릿', '개'], ['색종이', '장'], ['공책', '권'], ['귤', '개']]), n = d.pick([24, 28, 30, 36, 40, 42, 48, 54, 56, 60]);
      const bad = d.pick(range(n, 1).filter((k) => k >= 4 && k <= n / 2 && n % k !== 0 && gcd(k, n) > 1)), good = d.shuffle(divs(n).filter((k) => k > 1 && k < n)).slice(0, 3);
      const rows = d.shuffle(good.concat([bad]).map((k) => [`${k}명`, n % k === 0]));
      return CT(`${thing} ${n}${josa(unit, '을/를')} 남김없이 똑같이 나누어 줄 수 없는 사람 수는?`, rows, false, { explain: `${n} ÷ ${bad} = ${Math.floor(n / bad)}${rest(n, bad)}이므로 ${bad}명에게는 남김없이 똑같이 나누어 줄 수 없다. 사람 수는 ${n}의 약수여야 한다.` });
    }),
    T('dv-in-range', '범위에 드는 약수', '②88 ③79 심30', (d) => {
      // 십의 자리가 같은 수 가운데 약수가 하나뿐인 범위를 고른다.
      const [n, x] = d.until(() => { const v = d.pick(RICH); return [v, d.pick(divs(v))]; }, ([v, k]) => k >= 11 && k < v && k % 10 !== 0 && divs(v).filter((q) => Math.floor(q / 10) === Math.floor(k / 10) && q % 10 !== 0).length === 1);
      const lo = Math.floor(x / 10) * 10, hi = lo + 10;
      return N(`${n}의 약수 중 ${lo}보다 크고 ${hi}보다 작은 수는?`, x, { explain: `${n}의 약수는 ${divs(n).join(', ')}이다. 이 중 ${lo}보다 크고 ${hi}보다 작은 수는 ${x}이다.`, facts: { calc: [[`${n}/${n / x}`, 0]], unseen: [n / x] } });
    }),
    T('dv-even-count', '약수 가운데 짝수', '②88', (d) => {
      const n = d.pick([12, 18, 20, 28, 30, 36, 42, 44, 50, 54, 66, 70]), list = divs(n), even = list.filter((k) => k % 2 === 0);
      return N(`${n}의 약수 중 짝수는 모두 몇 개인가?`, even.length, { unit: '개', explain: `${n}의 약수는 ${list.join(', ')}이다. 이 중 짝수는 ${even.join(', ')}이다.`, facts: { count: list.map((k) => k % 2 === 0) } });
    })
  ]);

  // ── 배수 ─────────────────────────────────────────────────────
  // 어떤 수에 가장 가까운 배수: 못 미치는 쪽이 답인 것과 넘는 쪽이 답인 것은 따져 보는 일이 달라 따로 싣는다.
  const nearOf = (d, side) => d.until(() => [d.int(6, 19), d.pick([50, 100, 150, 200])], ([k, t]) => t % k !== 0 && (t % k) * 2 !== k && (side === 'below') === ((t % k) * 2 < k));
  const nearItem = (side) => (d) => {
    const [k, t] = nearOf(d, side), low = t - (t % k), ans = side === 'below' ? low : low + k;
    return N(`${k}의 배수 중 ${t}에 가장 가까운 수는?`, ans, {
      explain: `${t} ÷ ${k} = ${Math.floor(t / k)}${rest(t, k)}이므로 ${t}보다 작은 배수 중 가장 큰 수는 ${low}, ${t}보다 큰 배수 중 가장 작은 수는 ${low + k}이다. ${t} − ${low} = ${t - low}, ${low + k} − ${t} = ${low + k - t}이므로 ${josa(ans, '이/가')} 더 가깝다.`,
      facts: { calc: [[side === 'below' ? `${t}-${t}%${k}` : `${t}-${t}%${k}+${k}`, 0]], rule: side }
    });
  };
  B.addTypes(U, 'mul', [
    T('ml-first', '배수를 작은 수부터 쓰기', '①14·15·24 ②17·18 ③15·16 심12', (d) => {
      const k = d.int(6, 19);
      return M(`${k}의 배수를 가장 작은 수부터 차례로 3개 쓰시오.`, [0, 1, 2].map((i) => ({ label: ORD[i], answer: k * (i + 1) })), {
        explain: `${k}의 배수는 ${josa(k, '을/를')} 1배, 2배, 3배 … 한 수이다. ${k} × 1 = ${k}, ${k} × 2 = ${2 * k}, ${k} × 3 = ${3 * k}`, facts: { calc: [[`${k}*1`, 0], [`${k}*2`, 1], [`${k}*3`, 2]], unseen: [1, 2] }
      });
    }),
    T('ml-of-what', '어떤 수의 배수인지 찾기', '①15 ②19·20 ③17·18 심14', (d) => {
      const k = d.int(6, 19);
      return N('어떤 수의 배수를 가장 작은 수부터 차례로 쓴 것이다. ㉠에 알맞은 수는?', k, {
        figure: seq([box(LABELS[0]), 2 * k, 3 * k, 4 * k, '…']), explain: `${3 * k} − ${2 * k} = ${k}씩 커지므로 ${k}의 배수이다. 어떤 수의 배수 중 가장 작은 수는 그 수 자신이므로 ㉠은 ${k}이다.`, facts: { calc: [[`${3 * k}-${2 * k}`, 0]] }
      });
    }),
    T('ml-nth', '몇째 배수', '①14·21 ②17·21 ③15·17 심14', (d) => {
      const k = d.int(6, 17), n = d.int(11, 19);
      return N(`${k}의 배수를 가장 작은 수부터 차례로 쓸 때 ${n}번째 수는?`, k * n, { figure: seq([k, 2 * k, 3 * k, 4 * k, '…']), explain: `${k}의 배수는 ${josa(k, '을/를')} 1배, 2배, 3배 … 한 수이다. ${n}번째 수는 ${k} × ${n} = ${k * n}이다.`, facts: { calc: [[`${k}*${n}`, 0]] } });
    }),
    T('ml-nth-day', '며칠마다 하는 일의 몇째 날', '②97', (d) => {
      const who = d.pick(NAMES), k = d.pick([3, 4, 5, 6]), n = d.int(4, Math.floor(30 / k)), month = d.pick([4, 6, 9, 11]);
      return N(`${name(who, '은/는')} ${k}일마다 한 번씩 도서관에 간다. ${month}월 ${k}일에 처음 갔다면 ${n}번째로 가는 날은 ${month}월 며칠인가?`, k * n, {
        lead: `${month}월`, unit: '일', explain: `${k}일마다 가므로 가는 날의 날짜는 ${k}의 배수이다. ${n}번째로 가는 날은 ${k} × ${n} = ${k * n}(일)이다.`, facts: { calc: [[`${k}*${n}`, 0]] }
      });
    }),
    T('ml-not', '배수가 아닌 것 고르기', '①16 ②23 ③19 심13', (d) => {
      const k = d.pick([6, 7, 8, 9, 12, 13, 14]), yes = d.shuffle(range(8, 2)).slice(0, 4).map((m) => k * m), bad = d.until(() => k * d.int(3, 8) + d.pick([-2, -1, 1, 2]), (x) => x % k !== 0);
      const rows = d.shuffle(yes.concat([bad]).map((x) => [String(x), x % k === 0]));
      return CT(`${k}의 배수가 아닌 것은?`, rows, false, { explain: `${bad} ÷ ${k} = ${Math.floor(bad / k)}${rest(bad, k)}이므로 ${josa(bad, '은/는')} ${k}의 배수가 아니다.` });
    }),
    T('ml-among-count', '수 가운데 배수의 개수', '①16 ②22·24 ③19 심13', (d) => {
      const k = d.pick([6, 7, 8, 9, 12, 13]), yes = d.shuffle(range(6, 2)).slice(0, d.int(3, 4)).map((m) => k * m), no = d.shuffle(range(7 * k - 10, 10).filter((x) => x % k !== 0)).slice(0, 8 - yes.length), shown = d.shuffle(yes.concat(no));
      return N(`다음 수 가운데 ${k}의 배수는 모두 몇 개인가?`, yes.length, { unit: '개', figure: numbers(shown), explain: `이 가운데 ${k}의 배수는 ${asc(yes).join(', ')}이다.`, facts: { count: shown.map((x) => x % k === 0) } });
    }),
    T('ml-left-right', '왼쪽 수가 오른쪽 수의 배수인 짝', '①17', (d) => {
      // 틀린 보기: 두 수의 자리가 뒤바뀐 짝(오른쪽 수가 왼쪽 수의 배수), 나누어떨어지지 않는 짝
      const [a, m] = d.until(() => [d.int(4, 15), d.int(3, 8)], ([x, y]) => x * y >= 30 && x * y <= 98);
      const [c, k] = d.until(() => [d.int(3, 13), d.int(3, 7)], ([x, y]) => x * y >= 30 && x * y <= 98 && x !== a);
      const wrong = () => d.until(() => [d.int(30, 98), d.int(4, 15)], ([x, y]) => x % y !== 0);
      const pairs = d.until(() => [[a * m, a], [c, c * k], wrong(), wrong()], (list) => new Set(list.map(String)).size === 4);
      const rows = d.shuffle(pairs.map(([x, y]) => [`(${x}, ${y})`, x % y === 0]));
      return CT('왼쪽 수가 오른쪽 수의 배수인 것은?', rows, true, { explain: `${a * m} = ${a} × ${m}이므로 ${josa(a * m, '은/는')} ${a}의 배수이다. (${c}, ${c * k})에서는 오른쪽 수가 왼쪽 수의 배수이다.` });
    }),
    T('ml-grid', '수 배열표에서 배수 찾기', '①18 ②25 ③19 심13', (d) => {
      const k = d.pick([4, 6, 8, 9]), cells = range(35, d.int(11, 30)), hits = cells.filter((x) => x % k === 0);
      return N(`수 배열표에서 ${k}의 배수는 모두 몇 개인가?`, hits.length, { unit: '개', figure: numGrid(cells, 7), explain: `${k}의 배수는 ${hits.join(', ')}이다.`, facts: { count: cells.map((x) => x % k === 0) } });
    }),
    T('ml-count-upto', '몇까지의 수 가운데 배수의 수', '①20 ②27 ③20 심16', (d) => {
      const k = d.pick([6, 7, 8, 9, 11, 12, 13]), top = d.pick([50, 60, 80, 100, 150, 200]), q = Math.floor(top / k);
      return N(`1부터 ${top}까지의 자연수 중 ${k}의 배수는 모두 몇 개인가?`, q, { unit: '개', explain: `${top} ÷ ${k} = ${q}${rest(top, k)}이므로 ${k}의 배수는 ${k} × 1부터 ${k} × ${q}까지 ${q}개이다.`, facts: { calc: [[`(${top}-${top}%${k})/${k}`, 0]] } });
    }),
    T('ml-count-two-digit', '두 자리 수 가운데 배수의 수', '②27 ③20 심16', (d) => {
      const k = d.pick([7, 8, 9, 11, 12, 13, 14, 15, 17]), all = Math.floor(99 / k), one = Math.floor(9 / k);
      return N(`두 자리 수 중 ${k}의 배수는 모두 몇 개인가?`, all - one, {
        unit: '개', explain: `99 ÷ ${k} = ${all}${rest(99, k)}이므로 1부터 99까지의 수 중 ${k}의 배수는 ${all}개이다. ` + (one ? `이 중 한 자리 수 ${josa(k, '은/는')} 뺀다. ${all} − ${one} = ${all - one}(개)` : '이 수들은 모두 두 자리 수이다.'),
        facts: { calc: [[`(99-99%${k})/${k}-(9-9%${k})/${k}`, 0]], unseen: [99, 9] }
      });
    }),
    T('ml-count-between', '두 수 사이에 있는 배수의 수', '①18·20 ②27 심16', (d) => {
      const k = d.pick([6, 7, 8, 9, 12]), lo = d.pick([20, 30, 40, 50]), hi = lo + d.pick([30, 40, 50]), inside = range(hi - lo - 1, lo + 1), hits = inside.filter((x) => x % k === 0);
      return N(`${lo}보다 크고 ${hi}보다 작은 수 중 ${k}의 배수는 모두 몇 개인가?`, hits.length, {
        unit: '개', explain: `${lo}보다 크고 ${hi}보다 작은 ${k}의 배수는 ${hits.join(', ')}이다.`, facts: { calc: [[`(${hi - 1}-${hi - 1}%${k})/${k}-(${lo}-${lo}%${k})/${k}`, 0]], unseen: [hi - 1], count: inside.map((x) => x % k === 0) }
      });
    }),
    T('ml-in-range', '범위에 드는 배수', '③22 ②90', (d) => {
      // 십의 자리가 같은 수 가운데 배수는 하나뿐이다(11보다 큰 수의 배수).
      const [k, m] = d.until(() => [d.int(11, 19), d.int(3, 7)], ([x, y]) => (x * y) % 10 !== 0 && x * y <= 98), x = k * m, lo = Math.floor(x / 10) * 10, hi = lo + 10;
      return N(`${k}의 배수 중 ${lo}보다 크고 ${hi}보다 작은 수는?`, x, { explain: `${k} × ${m - 1} = ${k * (m - 1)}, ${k} × ${m} = ${x}, ${k} × ${m + 1} = ${k * (m + 1)}이다. ${lo}보다 크고 ${hi}보다 작은 수는 ${x}이다.`, facts: { calc: [[`${k}*${m}`, 0]], unseen: [m] } });
    }),
    T('ml-pack', '묶어 담은 물건의 수', '①29 ②98', (d) => {
      const [thing, pack] = d.pick([['과자', '봉지'], ['귤', '상자'], ['구슬', '주머니'], ['사탕', '통']]);
      const [k, m] = d.until(() => [d.int(12, 18), d.int(3, 7)], ([x, y]) => (x * y) % 10 !== 0 && x * y <= 98), x = k * m, lo = Math.floor(x / 10) * 10, hi = lo + 10;
      return N(`${josa(thing, '을/를')} 한 ${pack}에 ${k}개씩 남김없이 담았다. ${thing}의 수가 ${lo}개보다 많고 ${hi}개보다 적을 때 ${josa(thing, '을/를')} 담은 ${pack}의 수는?`, m, {
        unit: pack, explain: `${thing}의 수는 ${k}의 배수이다. ${k}의 배수 중 ${lo}보다 크고 ${hi}보다 작은 수는 ${k} × ${m} = ${x}이므로 ${m}${pack}에 담았다.`, facts: { calc: [[`${x}/${k}`, 0]], unseen: [x] }
      });
    }),
    T('ml-odd', '범위에 드는 홀수인 배수', '②90 심29', (d) => {
      const [k, lo, hi] = d.until(() => { const lo = d.pick([10, 15, 20, 25, 30, 40]); return [d.pick([3, 5, 7, 9]), lo, lo + d.pick([10, 15, 20])]; },
        ([x, p, q]) => { const all = range(q - p - 1, p + 1).filter((v) => v % x === 0); return all.length >= 2 && all.filter((v) => v % 2 === 1).length === 1; });
      const all = range(hi - lo - 1, lo + 1).filter((v) => v % k === 0), x = all.find((v) => v % 2 === 1);
      return N(`${lo}보다 크고 ${hi}보다 작은 ${k}의 배수 중 홀수는?`, x, { explain: `${lo}보다 크고 ${hi}보다 작은 ${k}의 배수는 ${all.join(', ')}이다. 이 중 홀수는 ${x}이다.`, facts: { calc: [[`${k}*${x / k}`, 0]], unseen: [x / k] } });
    }),
    T('ml-near-below', '어떤 수에 가장 가까운 배수(못 미치는 쪽)', '①22 ②28 ③21 심15', nearItem('below')),
    T('ml-near-above', '어떤 수에 가장 가까운 배수(넘는 쪽)', '①22 ③21 심15', nearItem('above')),
    T('ml-max-two-digit', '가장 큰 두 자리 배수', '①23 ②29 ③22', (d) => {
      const k = d.pick([12, 13, 14, 15, 16, 17, 18, 19, 21, 23, 24]), q = Math.floor(99 / k), x = k * q;
      return N(`${k}의 배수 중 가장 큰 두 자리 수는?`, x, { explain: `99 ÷ ${k} = ${q}${rest(99, k)}이므로 ${k} × ${q} = ${josa(x, '이/가')} 가장 큰 두 자리 수이다. ${k} × ${q + 1} = ${josa(x + k, '은/는')} 세 자리 수이다.`, facts: { calc: [[`99-99%${k}`, 0]], unseen: [99] } });
    }),
    T('ml-month', '한 달 동안 가는 날의 수', '①28 ②25', (d) => {
      const who = d.pick(NAMES), k = d.pick([4, 6, 7, 8, 9]), month = d.pick([4, 6, 9, 11]), hits = range(30, 1).filter((x) => x % k === 0);
      return N(`${name(who, '은/는')} ${k}일마다 한 번씩 수영장에 간다. ${month}월 ${k}일에 처음 갔다면 ${month}월 한 달 동안 수영장에 모두 몇 번 가는가? (${month}월은 30일까지 있다.)`, hits.length, {
        unit: '번', explain: `가는 날의 날짜는 30까지의 수 중 ${k}의 배수인 ${hits.join(', ')}이다.`, facts: { calc: [[`(30-30%${k})/${k}`, 0]] }
      });
    }),
    T('ml-say', '배수에 대한 설명', '①25', (d) => {
      // 틀린 말: 자기 자신은 배수가 아니라고 여긴 것, 가장 작은 배수를 1이라고 한 것(약수와 섞은 것), 배수에 끝이 있다고 여긴 것
      const k = d.int(4, 9), m = d.int(7, 12), slip = d.pick(['self', 'one', 'end']);
      const many = [`${k}의 배수는 셀 수 없이 많다.`, true], member = [`${josa(k * m, '은/는')} ${k}의 배수이다.`, true], first = [`${k}의 배수 중 가장 작은 수는 ${k}이다.`, true], own = [`${josa(k, '은/는')} ${k}의 배수이다.`, true];
      const rows = d.shuffle({
        self: [many, member, first, [`${josa(k, '은/는')} ${k}의 배수가 아니다.`, false]],
        one: [many, member, own, [`${k}의 배수 중 가장 작은 수는 1이다.`, false]],
        end: [first, member, own, [`${k}의 배수 중 가장 큰 수는 ${k * 100}이다.`, false]]
      }[slip]);
      const why = { self: `${k} × 1 = ${k}이므로 ${k}도 ${k}의 배수이다.`, one: `${k}의 배수 중 가장 작은 수는 ${k} × 1 = ${k}이다. 1은 ${k}의 약수이다.`, end: `${k} × 101 = ${k * 101}처럼 더 큰 배수가 끝없이 있으므로 가장 큰 배수는 없다.` }[slip];
      return CT(`${k}의 배수에 대한 설명으로 옳지 않은 것은?`, rows, false, { explain: why });
    })
  ]);

  // ── 약수와 배수의 관계 ───────────────────────────────────────
  B.addTypes(U, 'rel', [
    T('rl-words', '곱셈식에서 약수와 배수', '①31 ②30 ③26 심20', (d) => {
      const [a, b] = d.until(() => [d.int(3, 9), d.int(4, 13)], ([x, y]) => x < y), n = a * b;
      const rows = d.shuffle([['약수, 배수', true], ['배수, 약수', false], ['약수, 약수', false], ['배수, 배수', false]]);
      return CT('곱셈식을 보고 ㉠, ㉡에 알맞은 말을 차례로 쓴 것은?', rows, true, {
        figure: lines([`${n} = ${a} × ${b}`, `${josa(a, '과/와')} ${josa(b, '은/는')} ${n}의 ${box(LABELS[0])}이다.`, `${josa(n, '은/는')} ${josa(a, '과/와')} ${b}의 ${box(LABELS[1])}이다.`]),
        explain: `${n} = ${a} × ${b}이므로 ${josa(n, '은/는')} ${josa(a, '으로/로')}도 ${josa(b, '으로/로')}도 나누어떨어진다. ${josa(a, '과/와')} ${josa(b, '은/는')} ${n}의 약수이고, ${josa(n, '은/는')} ${josa(a, '과/와')} ${b}의 배수이다.`
      });
    }),
    T('rl-fill', '곱셈식으로 약수와 배수 찾기', '①32 ②3·31 ③27 심20', (d) => {
      const n = d.pick([18, 20, 28, 32, 44, 45, 50, 52, 63, 68, 75]), list = divs(n);
      return M('곱셈식을 보고 ㉠, ㉡에 알맞은 수를 구하시오.', [{ label: LABELS[0], answer: list[3] }, { label: LABELS[1], answer: list[4] }], {
        unordered: true, figure: lines([`${n} = 1 × ${n}`, `${n} = ${list[1]} × ${list[4]}`, `${n} = ${list[2]} × ${list[3]}`, `${josa(n, '은/는')} 1, ${list[1]}, ${list[2]}, ${box(LABELS[0])}, ${box(LABELS[1])}, ${n}의 배수이다.`]),
        explain: `곱셈식에 나온 수는 모두 ${n}의 약수이고, ${josa(n, '은/는')} 이 수들의 배수이다. ${josa(n, '은/는')} ${list.join(', ')}의 배수이다.`, facts: { calc: [[`${n}/${list[2]}`, 0], [`${n}/${list[1]}`, 1]] }
      });
    }),
    T('rl-say', '곱셈식을 보고 한 설명', '①33 ②32·41 ③28 심20', (d) => {
      // 틀린 보기: 약수와 배수를 거꾸로 말한 것, 곱셈식에 함께 나온 두 수를 약수와 배수의 관계라고 여긴 것
      const [a, b] = d.until(() => [d.int(3, 9), d.int(4, 13)], ([x, y]) => x < y && y % x !== 0), n = a * b;
      const rows = d.shuffle([[`${josa(a, '은/는')} ${n}의 약수이다.`, true], [`${josa(n, '은/는')} ${a}의 약수이다.`, false], [`${josa(b, '은/는')} ${n}의 배수이다.`, false], [`${josa(a, '과/와')} ${josa(b, '은/는')} 약수와 배수의 관계이다.`, false]]);
      return CT(`${n} = ${a} × ${josa(b, '을/를')} 보고 한 설명으로 옳은 것은?`, rows, true, {
        explain: `${n} = ${a} × ${b}이므로 ${josa(a, '과/와')} ${josa(b, '은/는')} ${n}의 약수이고, ${josa(n, '은/는')} ${josa(a, '과/와')} ${b}의 배수이다. ${josa(b, '은/는')} ${josa(a, '으로/로')} 나누어떨어지지 않는다.`
      });
    }),
    T('rl-say-three', '여러 수의 곱으로 나타낸 식을 보고 한 설명', '②32 심20', (d) => {
      // 틀린 보기: 곱셈식에 적힌 수만 약수라고 여긴 것
      const [p, q, r] = d.pick([[2, 3, 5], [2, 3, 7], [3, 3, 5], [2, 5, 5], [2, 2, 7], [2, 5, 7], [3, 3, 7], [2, 2, 5], [2, 3, 3], [3, 5, 5]]), n = p * q * r, seen = [...new Set([p, q, r])];
      const only = seen.length === 2 ? `${josa(seen[0], '과/와')} ${seen[1]}` : seen.join(', ');
      const rows = d.shuffle([[`${josa(p, '은/는')} ${n}의 약수이다.`, true], [`${p} × ${josa(r, '은/는')} ${n}의 약수이다.`, true], [`${josa(n, '은/는')} ${r}의 배수이다.`, true], [`${n}의 약수는 ${only}뿐이다.`, false]]);
      return CT(`${n} = ${p} × ${q} × ${josa(r, '을/를')} 보고 한 설명으로 옳지 않은 것은?`, rows, false, {
        explain: `${p} × ${q} = ${p * q}, ${p} × ${r} = ${p * r}처럼 곱셈식의 수를 곱한 수도 ${n}의 약수이고, ${josa(1, '과/와')} ${n}도 ${n}의 약수이다. ${n}의 약수는 ${divs(n).join(', ')}이다.`
      });
    }),
    T('rl-div-say', '나눗셈식을 보고 한 설명', '①11 ②30', (d) => {
      // 틀린 보기: 나누는 수와 몫을 약수와 배수의 관계라고 여긴 것
      const [a, b] = d.until(() => [d.int(4, 9), d.int(5, 12)], ([x, y]) => x < y && y % x !== 0), n = a * b;
      const rows = d.shuffle([[`${josa(a, '은/는')} ${n}의 약수이다.`, true], [`${josa(n, '은/는')} ${b}의 배수이다.`, true], [`${josa(b, '은/는')} ${n}의 약수이다.`, true], [`${josa(a, '은/는')} ${b}의 약수이다.`, false]]);
      return CT(`${n} ÷ ${a} = ${josa(b, '을/를')} 보고 한 설명으로 옳지 않은 것은?`, rows, false, {
        explain: `${n} ÷ ${a} = ${b}에서 ${josa(a, '과/와')} ${josa(b, '은/는')} 모두 ${n}의 약수이다. ${josa(b, '은/는')} ${josa(a, '으로/로')} 나누어떨어지지 않으므로 ${josa(a, '은/는')} ${b}의 약수가 아니다.`
      });
    }),
    T('rl-expr', '관계를 곱셈식으로 나타내기', '①34 ③29 심21', (d) => {
      const a = d.int(4, 9), m = d.int(6, 13), n = a * m;
      return N(`${josa(a, '은/는')} ${n}의 약수이고, ${josa(n, '은/는')} ${a}의 배수이다. 이 관계를 곱셈식으로 나타낼 때 □ 안에 알맞은 수는?`, m, { figure: lines([`${a} × ${box()} = ${n}`]), explain: `${n} ÷ ${a} = ${m}이므로 ${a} × ${m} = ${n}이다.`, facts: { calc: [[`${n}/${a}`, 0]] } });
    }),
    T('rl-pair', '약수와 배수의 관계인 두 수', '①35 ②33·34·37 ③30·31 심22', (d) => {
      // 큰 수가 앞에 오는 짝도 섞는다. 틀린 짝은 공약수는 있지만 나누어떨어지지 않는 두 수.
      const [a, m] = d.until(() => [d.int(4, 13), d.int(3, 8)], ([x, y]) => x * y <= 98), wrong = () => d.until(() => [d.int(4, 13), d.int(20, 98)], ([x, y]) => y % x !== 0 && gcd(x, y) > 1);
      const pairs = d.until(() => [[a, a * m], wrong(), wrong(), wrong()], (list) => new Set(list.map(String)).size === 4).map((p) => swap(d, p));
      const rows = d.shuffle(pairs.map(([x, y]) => [`(${x}, ${y})`, x % y === 0 || y % x === 0]));
      return CT('두 수가 약수와 배수의 관계인 것은?', rows, true, { explain: `${a * m} ÷ ${a} = ${m}이므로 ${josa(a, '은/는')} ${a * m}의 약수이고 ${josa(a * m, '은/는')} ${a}의 배수이다. 나머지는 큰 수가 작은 수로 나누어떨어지지 않는다.` });
    }),
    T('rl-three', '세 수 가운데 관계인 두 수', '②36', (d) => {
      const [a, m, c] = d.until(() => [d.int(4, 13), d.int(3, 8), d.int(10, 60)], ([x, y, z]) => x * y <= 98 && z !== x && (x * y) % z !== 0 && z % x !== 0 && x % z !== 0 && z % (x * y) !== 0);
      return M('세 수 가운데 약수와 배수의 관계인 두 수는?', [{ answer: a }, { answer: a * m }], {
        unordered: true, figure: numbers(d.shuffle([a, a * m, c])), explain: `${a * m} ÷ ${a} = ${m}이므로 ${josa(a, '과/와')} ${josa(a * m, '은/는')} 약수와 배수의 관계이다. ${josa(c, '은/는')} 두 수와 나누어떨어지는 관계가 아니다.`,
        facts: { calc: [[`${a * m}/${m}`, 0], [`${a}*${m}`, 1]], unseen: [m] }
      });
    }),
    T('rl-pairs-count', '수 여럿에서 관계인 짝의 수', '①38 심23', (d) => {
      const pool = [4, 5, 6, 7, 8, 9, 10, 12, 14, 15, 16, 18, 20, 21, 24, 27, 28, 30, 32, 35, 36], related = ([x, y]) => x % y === 0 || y % x === 0;
      const pairsOf = (xs) => xs.reduce((all, x, i) => all.concat(xs.slice(i + 1).map((y) => [x, y])), []);
      const list = d.until(() => d.shuffle(pool).slice(0, 4), (xs) => { const c = pairsOf(xs).filter(related).length; return c >= 2 && c <= 4; }), pairs = pairsOf(asc(list)), hits = pairs.filter(related);
      return N('네 수 가운데 두 수를 골라 약수와 배수의 관계인 짝을 만들려고 한다. 만들 수 있는 짝은 모두 몇 쌍인가?', hits.length, {
        unit: '쌍', figure: numbers(list), explain: `큰 수가 작은 수로 나누어떨어지는 짝을 찾는다. ${hits.map(([x, y]) => `(${x}, ${y})`).join(', ')}이다.`, facts: { count: pairs.map(related) }
      });
    }),
    T('rl-with-count', '한 수와 약수·배수의 관계인 수', '①37 ②35 ③32 심23', (d) => {
      // 약수 쪽과 배수 쪽을 모두 보아야 한다. 그 수 자신도 약수이면서 배수이다.
      const n = d.pick([12, 14, 15, 16, 18, 20, 24]), self = d.bool();
      const yes = d.shuffle(divs(n).filter((k) => k > 1 && k < n)).slice(0, 2).concat(d.shuffle([2, 3, 4].map((m) => n * m).filter((x) => x <= 99)).slice(0, d.int(1, 2)), self ? [n] : []);
      const no = d.shuffle(range(97, 3).filter((x) => x % n !== 0 && n % x !== 0 && gcd(x, n) > 1)).slice(0, 8 - yes.length), shown = d.shuffle(yes.concat(no));
      return N(`다음 수 가운데 ${josa(n, '과/와')} 약수와 배수의 관계인 수는 모두 몇 개인가?`, yes.length, {
        unit: '개', figure: numbers(shown), explain: `${n}의 약수이거나 ${n}의 배수인 수를 찾는다. 알맞은 수는 ${asc(yes).join(', ')}이다.` + (self ? ` ${josa(n, '은/는')} ${n}의 약수이면서 배수이다.` : ''),
        facts: { count: shown.map((x) => x % n === 0 || n % x === 0) }
      });
    }),
    T('rl-of-count', '□의 배수에서 □에 들어갈 수', '①39 ②39 ③33 심25', (d) => {
      const n = d.pick([16, 21, 22, 25, 26, 27, 33, 34, 35, 39, 49, 51, 55, 57, 81]), list = divs(n);
      return N(`「${josa(n, '은/는')} □의 배수이다.」에서 □에 들어갈 수 있는 자연수는 모두 몇 개인가?`, list.length, {
        unit: '개', explain: `${josa(n, '이/가')} □의 배수이면 □는 ${n}의 약수이다. ${n}의 약수는 ${list.join(', ')}이다.`, facts: { count: range(n, 1).map((k) => n % k === 0) }
      });
    }),
    T('rl-of-which', '□의 약수에서 □에 들어갈 수', '①6', (d) => {
      // 틀린 보기: 그 수의 약수를 고른 것(약수와 배수를 거꾸로 읽은 것), 배수에서 조금 어긋난 수
      const k = d.pick([6, 8, 9, 12, 14, 15]), m = d.int(3, 6), part = d.pick(divs(k).filter((x) => x > 1 && x < k));
      const near = d.until(() => [k * d.int(2, 6) + d.pick([-2, 2, 3]), k * d.int(2, 6) + d.pick([-3, -1, 1])], ([x, y]) => x % k !== 0 && y % k !== 0 && x !== y);
      const rows = d.shuffle([k * m, part, near[0], near[1]].map((x) => [String(x), x % k === 0]));
      return CT(`「${josa(k, '은/는')} □의 약수이다.」에서 □에 들어갈 수 있는 수는?`, rows, true, { explain: `${josa(k, '이/가')} □의 약수이면 □는 ${k}의 배수이다. ${k} × ${m} = ${k * m}` });
    }),
    T('rl-both-box', '두 문장의 □에 함께 들어갈 수', '①40 ②38 심26', (d) => {
      // 틀린 보기: 한 수의 배수이기만 한 수
      const [a, b] = d.pick([[3, 7], [4, 9], [5, 6], [5, 9], [4, 7], [3, 8], [5, 8], [6, 7], [4, 6], [6, 9], [6, 8]]), L = lcm(a, b), x = L * (2 * L <= 99 && d.bool() ? 2 : 1);
      const onlyA = d.shuffle(range(12, 2).map((m) => a * m).filter((v) => v % b !== 0 && v <= 99)).slice(0, 2), onlyB = d.pick(range(10, 2).map((m) => b * m).filter((v) => v % a !== 0 && v <= 99));
      const rows = d.shuffle([x, onlyA[0], onlyA[1], onlyB].map((v) => [String(v), v % a === 0 && v % b === 0]));
      return CT('두 문장의 □에 함께 들어갈 수 있는 수는?', rows, true, {
        figure: lines([`${josa(a, '과/와')} ${josa(b, '은/는')} □의 약수이다.`, `□는 ${josa(a, '과/와')} ${b}의 배수이다.`]), explain: `□는 ${a}의 배수이면서 ${b}의 배수이다. ${x} ÷ ${a} = ${x / a}, ${x} ÷ ${b} = ${x / b}`
      });
    }),
    T('rl-div-mul-count', '약수이면서 배수인 수', '②89 ③80 심32', (d) => {
      const [n, k] = d.until(() => [d.pick(RICH), d.pick([3, 4, 5, 6, 7, 9])], ([v, x]) => { const c = divs(v).filter((q) => q % x === 0).length; return c >= 2 && c <= 5; }), list = divs(n), hits = list.filter((q) => q % k === 0);
      return N(`${n}의 약수 중 ${k}의 배수는 모두 몇 개인가?`, hits.length, { unit: '개', explain: `${n}의 약수는 ${list.join(', ')}이다. 이 중 ${k}의 배수는 ${hits.join(', ')}이다.`, facts: { count: list.map((q) => q % k === 0) } });
    }),
    T('rl-all-multiples', '어떤 수의 배수는 모두 다른 수의 배수', '①26 ②42 ③35 심27', (d) => {
      // 틀린 보기: 그 수의 배수를 고른 것(거꾸로 생각한 것), 공약수는 있지만 약수가 아닌 수
      const n = d.pick([12, 15, 18, 20, 24]), yes = d.pick(divs(n).filter((x) => x > 1 && x < n)), no = d.shuffle(range(n - 3, 2).filter((x) => n % x !== 0 && gcd(x, n) > 1)).slice(0, 2);
      const rows = d.shuffle([yes, 2 * n, no[0], no[1]].map((x) => [String(x), n % x === 0]));
      return CT(`「${n}의 배수는 모두 □의 배수이다.」에서 □에 들어갈 수 있는 수는?`, rows, true, { explain: `${n} = ${yes} × ${n / yes}이므로 ${n}의 배수는 모두 ${yes}의 배수이다. □에는 ${n}의 약수가 들어간다. ${josa(n, '은/는')} ${2 * n}의 배수가 아니다.` });
    }),
    T('rl-all-divisors', '어떤 수의 약수는 모두 다른 수의 약수', '②42', (d) => {
      // 틀린 보기: 그 수의 약수를 고른 것(거꾸로 생각한 것), 배수에서 조금 어긋난 수
      const n = d.pick([6, 8, 9, 10, 12]), m = d.int(2, 4), part = d.pick(divs(n).filter((x) => x > 1 && x < n)), no = d.shuffle(range(3 * n, n + 1).filter((x) => x % n !== 0 && gcd(x, n) > 1)).slice(0, 2);
      const rows = d.shuffle([n * m, part, no[0], no[1]].map((x) => [String(x), x % n === 0]));
      return CT(`「${n}의 약수는 모두 □의 약수이다.」에서 □에 들어갈 수 있는 수는?`, rows, true, { explain: `${n * m} = ${n} × ${m}이므로 ${n}의 약수는 모두 ${n * m}의 약수이다. □에는 ${n}의 배수가 들어간다. ${n}의 약수 ${josa(n, '은/는')} ${part}의 약수가 아니다.` });
    }),
    T('rl-say-general', '약수와 배수의 성질', '②15·40 ③13', (d) => {
      // 틀린 말: 약수와 배수의 끝을 거꾸로 안 것, 1과 자기 자신을 거꾸로 안 것, 큰 수일수록 약수가 많다고 여긴 것
      const right = d.pick(['어떤 수의 배수는 셀 수 없이 많다.', '1은 모든 자연수의 약수이다.', '어떤 수의 약수 중 가장 큰 수는 그 수 자신이다.', '어떤 수의 배수 중 가장 작은 수는 그 수 자신이다.']);
      const wrong = d.shuffle(['어떤 수의 약수는 셀 수 없이 많다.', '1은 모든 자연수의 배수이다.', '어떤 수의 배수 중 가장 작은 수는 1이다.', '수가 클수록 약수의 개수가 많다.', '어떤 수는 자기 자신의 배수가 아니다.']).slice(0, 3);
      const rows = d.shuffle([[right, true]].concat(wrong.map((text) => [text, false])));
      return CT('약수와 배수에 대한 설명으로 옳은 것은?', rows, true, { explain: '약수는 1부터 그 수 자신까지이고 개수에 끝이 있다. 배수는 그 수 자신부터 시작하여 끝없이 있다. 16의 약수는 5개, 17의 약수는 2개이므로 수가 크다고 약수가 많은 것은 아니다.' });
    })
  ]);

  // ── 공약수와 최대공약수 ──────────────────────────────────────
  B.addTypes(U, 'cd', [
    T('cd-word', '공약수와 최대공약수의 뜻', '①3 ③36', (d) => {
      const [a, b] = d.pick([[8, 12], [12, 18], [12, 20], [18, 24], [16, 24], [20, 30]]), g = gcd(a, b);
      const rows = d.shuffle([['공약수, 최대공약수', true], ['공배수, 최소공배수', false], ['공약수, 최소공배수', false], ['최대공약수, 공약수', false]]);
      return CT('㉠, ㉡에 알맞은 말을 차례로 쓴 것은?', rows, true, {
        figure: lines([`${josa(a, '과/와')} ${b}의 공통된 약수 ${divs(g).join(', ')} → ${josa(a, '과/와')} ${b}의 ${box(LABELS[0])}`, `${box(LABELS[0])} 중 가장 큰 수 ${g} → ${josa(a, '과/와')} ${b}의 ${box(LABELS[1])}`]),
        explain: '두 수의 공통된 약수를 공약수라 하고, 공약수 중 가장 큰 수를 최대공약수라고 한다.'
      });
    }),
    T('cd-lists', '약수를 늘어놓아 공약수와 최대공약수 찾기', '①45·46·49 ②43·44·48 ③37·38 심36', (d) => {
      const [a, b] = pairOf(d, 'general', { min: 8, max: 60, ok: (x, y) => divs(x).length <= 9 && divs(y).length <= 9 }), g = gcd(a, b), common = divs(g);
      return M(`두 수의 약수를 보고 ${josa(a, '과/와')} ${b}의 공약수의 개수와 최대공약수를 구하시오.`, [{ label: '공약수', answer: common.length, unit: '개' }, { label: '최대공약수', answer: g }], {
        figure: notes([`${a}의 약수: ${divs(a).join(', ')}`, `${b}의 약수: ${divs(b).join(', ')}`]), explain: `두 줄에 모두 있는 수는 ${common.join(', ')}이고, 이 중 가장 큰 수 ${josa(g, '이/가')} 최대공약수이다.`,
        facts: { count: divs(a).map((k) => b % k === 0), calc: [[`${a}/${a / g}`, 1]] }
      });
    }),
    T('cd-count', '공약수의 개수', '①48 ②45·47 ③39 심36', (d) => {
      const [a, b] = swap(d, pairOf(d, 'general', { max: 72, ok: (x, y) => divs(gcd(x, y)).length >= 3 })), common = divs(gcd(a, b));
      return N(`${a}의 약수이면서 ${b}의 약수인 수는 모두 몇 개인가?`, common.length, {
        unit: '개', explain: `${a}의 약수는 ${divs(a).join(', ')}이고, ${b}의 약수는 ${divs(b).join(', ')}이다. 공통된 약수는 ${common.join(', ')}이다.`, facts: { count: range(Math.min(a, b), 1).map((k) => a % k === 0 && b % k === 0) }
      });
    }),
    T('cd-not', '공약수가 아닌 것 고르기', '①47 ②46 ③40 심37', (d) => {
      // 틀린 수: 두 수 가운데 한 수만의 약수
      const [a, b] = swap(d, pairOf(d, 'general', { max: 72, ok: (x, y) => divs(gcd(x, y)).length >= 4 })), common = divs(gcd(a, b));
      const lone = divs(a).filter((k) => b % k !== 0).concat(divs(b).filter((k) => a % k !== 0)), small = lone.filter((k) => k < Math.min(a, b)), bad = d.pick(small.length ? small : lone);
      const rows = d.shuffle(d.shuffle(common).slice(0, 4).concat([bad]).map((k) => [String(k), a % k === 0 && b % k === 0]));
      const [has, lacks] = a % bad === 0 ? [a, b] : [b, a];
      return CT(`${josa(a, '과/와')} ${b}의 공약수가 아닌 것은?`, rows, false, { explain: `${josa(bad, '은/는')} ${has}의 약수이지만 ${lacks}의 약수는 아니다. ${josa(a, '과/와')} ${b}의 공약수는 ${common.join(', ')}이다.` });
    }),
    T('cd-pick-set', '공약수를 모두 고른 것', '②46 심37', (d) => {
      // 틀린 보기: 한 수만의 약수를 넣은 것, 1을 빠뜨린 것, 가장 큰 공약수를 빠뜨린 것
      const [a, b] = pairOf(d, 'general', { max: 60, ok: (x, y) => [3, 4].includes(divs(gcd(x, y)).length) }), common = divs(gcd(a, b));
      const onlyA = divs(a).filter((k) => b % k !== 0)[0], onlyB = divs(b).filter((k) => a % k !== 0)[0], none = d.pick(range(18, 3).filter((k) => a % k !== 0 && b % k !== 0));
      const shown = d.shuffle(common.concat([onlyA, onlyB, none])), same = (list) => asc(list).join(', ') === common.join(', ');
      const rows = d.shuffle([common, common.concat([onlyA]), common.slice(1), common.slice(0, -1)].map((list) => [asc(list).join(', '), same(list)]));
      return CT(`다음 수 가운데 ${josa(a, '과/와')} ${b}의 공약수를 모두 고른 것은?`, rows, true, {
        figure: numbers(shown), explain: `${a}의 약수이면서 ${b}의 약수인 수는 ${common.join(', ')}이다. 1은 모든 수의 약수이므로 언제나 공약수이다. ${josa(onlyA, '은/는')} ${a}의 약수이지만 ${b}의 약수는 아니다.`
      });
    }),
    T('cd-divide-both', '두 수를 모두 나누어떨어지게 하는 가장 큰 수', '①57 ②60 ③50·85 심37', (d) => {
      const [a, b] = swap(d, pairOf(d, 'general', { gMin: 3 })), g = gcd(a, b);
      return N(`${josa(a, '과/와')} ${josa(b, '을/를')} 어떤 수로 나누면 모두 나누어떨어진다. 어떤 수 중 가장 큰 수는?`, g, {
        explain: `어떤 수는 ${josa(a, '과/와')} ${b}의 공약수이다. 공약수 ${divs(g).join(', ')} 중 가장 큰 수는 최대공약수 ${g}이다.`, facts: { calc: [[`${a}/${a / g}`, 0], [`${b}/${b / g}`, 0]], unseen: [a / g, b / g] }
      });
    }),
    T('cd-g-count', '최대공약수를 알 때 공약수의 개수', '①54·55 ②56·57 ③43·44 심40·41', (d) => {
      const g = d.pick([12, 18, 20, 24, 28, 30, 32, 36, 40, 42, 45]), list = divs(g);
      return N(`어떤 두 수의 최대공약수가 ${g}이다. 두 수의 공약수는 모두 몇 개인가?`, list.length, { unit: '개', explain: `두 수의 공약수는 최대공약수 ${g}의 약수와 같다. ${g}의 약수는 ${list.join(', ')}이다.`, facts: { count: range(g, 1).map((k) => g % k === 0) } });
    }),
    T('cd-g-not', '최대공약수를 알 때 공약수가 아닌 것', '②58·59 심40', (d) => {
      const g = d.pick([12, 16, 18, 20, 24, 28, 30]), bad = d.pick(range(g - 3, 2).filter((k) => g % k !== 0 && gcd(k, g) > 1));
      const rows = d.shuffle(d.shuffle(divs(g).filter((k) => k > 1 && k < g)).slice(0, 3).concat([g, bad]).map((k) => [String(k), g % k === 0]));
      return CT(`어떤 두 수의 최대공약수가 ${g}이다. 두 수의 공약수가 아닌 것은?`, rows, false, { explain: `두 수의 공약수는 최대공약수 ${g}의 약수이다. ${josa(bad, '은/는')} ${g}의 약수가 아니다.` });
    }),
    T('cd-g-sum', '최대공약수를 알 때 공약수의 합', '①48·55 ③42 심42', (d) => {
      const g = d.pick([6, 8, 9, 10, 14, 15, 21, 22, 25, 27]), list = divs(g);
      return N(`어떤 두 수의 최대공약수가 ${g}이다. 두 수의 공약수를 모두 더한 값은?`, sum(list), { explain: `두 수의 공약수는 최대공약수 ${g}의 약수 ${list.join(', ')}이다. ${list.join(' + ')} = ${sum(list)}`, facts: { calc: [[list.join('+'), 0]], unseen: list.filter((k) => k !== g) } });
    }),
    T('cd-cards', '공약수를 모두 적은 카드', '③45', (d) => {
      const g = d.pick(SIX), others = d.shuffle(divs(g).filter((k) => k > 1)), at = d.int(1, others.length - 1), shown = others.slice(0, at).concat(['△'], others.slice(at));
      return M('어떤 두 수의 공약수를 차례 없이 모두 적은 것이다. △에 알맞은 수와 두 수의 최대공약수는?', [{ label: '△', answer: 1 }, { label: '최대공약수', answer: g }], {
        figure: seq(shown), explain: `1은 모든 수의 약수이므로 언제나 공약수이다. 적힌 수에 1이 없으므로 △는 1이다. 공약수 중 가장 큰 수 ${josa(g, '이/가')} 최대공약수이다.`, facts: { calc: [[`${g}/${g}`, 0], [`${g}`, 1]] }
      });
    }),
    T('cd-say', '공약수에 대한 설명', '①54·56 ②56·61 ③46·47 심46', (d) => {
      // 틀린 말: 최대공약수보다 작은 공약수를 가장 큰 수라고 한 것, 1을 빼고 센 것, 공약수를 더 작은 수의 약수와 같다고 한 것
      const [a, b] = swap(d, pairOf(d, 'general', { max: 72, ok: (x, y) => divs(gcd(x, y)).length >= 4 })), g = gcd(a, b), list = divs(g), lower = list[list.length - 2], slip = d.pick(['max', 'count', 'same']);
      const rows = d.shuffle([
        ['공약수 중 가장 작은 수는 1이다.', true],
        [`공약수 중 가장 큰 수는 ${slip === 'max' ? lower : g}이다.`, slip !== 'max'],
        [`공약수는 모두 ${slip === 'count' ? list.length - 1 : list.length}개이다.`, slip !== 'count'],
        [`공약수는 ${slip === 'same' ? lower : g}의 약수와 같다.`, slip !== 'same']
      ]);
      return CT(`${josa(a, '과/와')} ${b}의 공약수에 대한 설명으로 옳지 않은 것은?`, rows, false, { explain: `${josa(a, '과/와')} ${b}의 공약수는 ${list.join(', ')}의 ${list.length}개이다. 가장 큰 공약수는 ${g}이고, 공약수는 최대공약수 ${g}의 약수와 같다.` });
    })
  ]);

  // ── 최대공약수 구하는 방법 ───────────────────────────────────
  // 두 수의 최대공약수: 구조가 다른 세 가지 쌍
  const gcdItem = (kind) => (d) => {
    const [a, b] = swap(d, pairOf(d, kind)), g = gcd(a, b), small = Math.min(a, b), big = Math.max(a, b);
    const why = {
      general: `${a} = ${g} × ${a / g}, ${b} = ${g} × ${b / g}이고 ${josa(a / g, '과/와')} ${b / g}의 공약수는 1뿐이다. 최대공약수는 ${g}이다.`,
      nested: `${big} = ${small} × ${big / small}이므로 ${josa(small, '은/는')} ${big}의 약수이다. 두 수의 최대공약수는 작은 수 ${small}이다.`,
      coprime: `${small}의 약수는 ${divs(small).join(', ')}이고, ${big}의 약수는 ${divs(big).join(', ')}이다. 공약수가 1뿐이므로 최대공약수는 1이다.`
    }[kind];
    return N(`${josa(a, '과/와')} ${b}의 최대공약수는?`, g, { explain: why, facts: { calc: [[`${a}/${a / g}`, 0], [`${b}/${b / g}`, 0]], unseen: [a / g, b / g], rule: kind } });
  };
  // 공약수로 나누는 셈에 쓸 두 수: 최대공약수를 두 번(steps 번) 나누어 구하는 쌍
  const ladderPair = (d, steps, o) => pairOf(d, 'general', Object.assign({ ok: (x, y) => factors(gcd(x, y)).length === steps }, o || {}));
  B.addTypes(U, 'gw', [
    T('gw-two-products', '두 수의 곱으로 나타내어 최대공약수 구하기', '①49 ②48 ③48', (d) => {
      const [g, p, q] = d.until(() => [d.int(4, 16), d.int(2, 5), d.int(3, 7)], ([x, y, z]) => y < z && gcd(y, z) === 1 && x * z <= 96), a = g * p, b = g * q;
      return N(`곱셈식을 보고 ${josa(a, '과/와')} ${b}의 최대공약수를 구하면?`, g, {
        figure: lines([`${a} = ${g} × ${p}`, `${b} = ${g} × ${q}`]), explain: `두 곱셈식에 공통으로 들어 있는 수는 ${g}이고, 남은 ${josa(p, '과/와')} ${q}의 공약수는 1뿐이다. 최대공약수는 ${g}이다.`, facts: { calc: [[`${a}/${p}`, 0], [`${b}/${q}`, 0]] }
      });
    }),
    T('gw-ladder-read', '공약수로 나누는 셈을 보고 최대공약수 구하기', '①51 ②50·51 ③49 심38', (d) => {
      const [a, b] = ladderPair(d, d.pick([2, 3])), L = ladderOf(a, b);
      return N(`${josa(a, '과/와')} ${b}의 최대공약수를 구하려고 두 수를 공약수로 나누었다. 최대공약수는?`, gcd(a, b), {
        figure: ladder(L.rows, L.last), explain: `밑에 남은 ${josa(L.last[0], '과/와')} ${L.last[1]}의 공약수가 1뿐이므로 나눈 공약수를 모두 곱한다. ${times(L.by)} = ${gcd(a, b)}`, facts: { calc: [[L.by.join('*'), 0]] }
      });
    }),
    T('gw-ladder-blank', '공약수로 나누는 셈의 빈칸', '①51 ②50 ③49 심38', (d) => {
      const [a, b] = ladderPair(d, 2), L = ladderOf(a, b), [p1, p2] = L.by, [x, y] = L.last;
      return M('두 수를 공약수로 나누었다. ㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: p2 }, { label: LABELS[1], answer: y }], {
        figure: ladder([[p1, a, b], [box(LABELS[0]), a / p1, b / p1]], [x, box(LABELS[1])]), explain: `${a / p1} ÷ ㉠ = ${x}이므로 ㉠은 ${p2}이다. ㉡은 ${b / p1} ÷ ${p2} = ${y}이다.`,
        facts: { calc: [[`${a / p1}/${x}`, 0], [`${b / p1}/(${a / p1}/${x})`, 1]] }
      });
    }),
    T('gw-ladder-top', '공약수로 나누는 셈의 처음 수', '②55 ③51', (d) => {
      const [a, b] = ladderPair(d, 2), L = ladderOf(a, b), [p1, p2] = L.by;
      return N('두 수를 공약수로 나누었다. ㉠에 알맞은 수는?', a, {
        figure: ladder([[p1, box(LABELS[0]), b], [p2, a / p1, b / p1]], L.last), explain: `㉠ ÷ ${p1} = ${a / p1}이므로 ㉠ = ${a / p1} × ${p1} = ${a}이다.`, facts: { calc: [[`${a / p1}*${p1}`, 0]] }
      });
    }),
    T('gw-ladder-short', '덜 나눈 셈 바로잡기(최대공약수)', '③52·53 심49', (d) => {
      // 공약수가 더 있는데 나누기를 멈춘 셈. 나눈 수만 곱하면 최대공약수보다 작다.
      const [a, b] = ladderPair(d, 3), L = ladderOf(a, b, 2), all = factors(gcd(a, b));
      return N(`${josa(a, '과/와')} ${b}의 최대공약수를 구하려고 두 수를 공약수로 나누다가 멈추었다. 두 수의 최대공약수는?`, gcd(a, b), {
        figure: ladder(L.rows, L.last), explain: `밑에 남은 ${josa(L.last[0], '과/와')} ${josa(L.last[1], '은/는')} ${josa(all[2], '으로/로')} 더 나눌 수 있다. 최대공약수는 ${times(all)} = ${gcd(a, b)}이다.`, facts: { calc: [[all.join('*'), 0]], unseen: [all[2]] }
      });
    }),
    T('gw-gcd-general', '두 수의 최대공약수', '①52 ②51·52 ③50', gcdItem('general')),
    T('gw-gcd-nested', '한쪽이 다른 쪽의 배수인 두 수의 최대공약수', '①52 ②49·52 ③50', gcdItem('nested')),
    T('gw-gcd-coprime', '공약수가 1뿐인 두 수의 최대공약수', '①52 ③50', gcdItem('coprime')),
    T('gw-compare', '최대공약수의 크기 비교', '①53 ②53·54 ③53·54·55 심43', (d) => {
      const trio = d.until(() => [pairOf(d, 'general'), pairOf(d, d.pick(['general', 'nested'])), pairOf(d, 'general')], (ps) => new Set(ps.map(([a, b]) => gcd(a, b))).size === 3 && new Set(ps.map(String)).size === 3), gs = trio.map(([a, b]) => gcd(a, b));
      return C('두 수의 최대공약수가 가장 큰 것은?', trio.map(([a, b]) => `(${a}, ${b})`), gs.indexOf(Math.max(...gs)), {
        explain: trio.map(([a, b], i) => `(${a}, ${b})의 최대공약수는 ${gs[i]}`).join(', ') + '이다.', facts: { rank: { values: gs, nth: 1 } }
      });
    }),
    T('gw-is-k', '최대공약수가 정해진 두 수', '③55 ②53', (d) => {
      // 틀린 보기: 그 수가 들어 있지만 최대공약수는 더 작은 짝, 둘 다 그 수의 배수이지만 최대공약수는 더 큰 짝
      const k = d.pick([6, 8, 9, 12]);
      const pairs = d.until(() => [
        d.until(() => [k * d.int(1, 4), k * d.int(2, 7)], ([x, y]) => x < y && y <= 96 && gcd(x, y) === k),
        d.until(() => [k, d.int(k + 1, 4 * k)], ([x, y]) => gcd(x, y) > 1 && gcd(x, y) < k),
        d.pick([[2 * k, 4 * k], [2 * k, 6 * k], [4 * k, 6 * k]].filter(([, y]) => y <= 96)),
        d.until(() => pairOf(d, 'general'), ([x, y]) => gcd(x, y) !== k)
      ], (list) => new Set(list.map(String)).size === 4);
      const rows = d.shuffle(pairs.map(([x, y]) => [`(${x}, ${y})`, gcd(x, y) === k]));
      return CT(`두 수의 최대공약수가 ${k}인 것은?`, rows, true, { explain: pairs.map(([x, y]) => `(${x}, ${y})의 최대공약수는 ${gcd(x, y)}`).join(', ') + `이다. 두 수가 모두 ${k}의 배수이어도 최대공약수는 더 클 수 있다.` });
    })
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
