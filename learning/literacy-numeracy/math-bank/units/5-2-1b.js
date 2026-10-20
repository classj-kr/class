// 5학년 2학기 1단원 수의 범위와 어림하기 — 올림·버림·반올림의 기본 문항(올림, 버림, 반올림, 세 방법 비교, 어림하기 전의 수, 생활 속 어림)과 실력 문항.
// 꼴 목록(기본꼴 1~3: 75·83·84꼴, 심화꼴 74꼴)을 꼴마다 따져서 실었다. 꼴 번호는 ①n = 기본꼴_1의 n번, ②n, ③n, 심n.
// 꼴마다 「실음(유형 이름) / 뺌(까닭)」을 가른 대조표는 references/textbooks/수학/_분석/5-2-1/싣기_대조표.md 에 있다.
//
// 이 단원에서 아이들이 흔히 잘못 아는 것
//   ① 경계의 수: 「이상·이하」에 그 수가 들고 「초과·미만」에 들지 않는다는 것을 바꾸어 안다. ●와 ○를 바꾸어 읽는다.
//   ② 「~면 탈 수 없다」「~은 내지 않는다」처럼 뒤집어 말한 기준에서 경계의 수를 반대쪽에 넣는다.
//   ③ 올림은 바로 아래 자리 숫자만 본다(5.027을 소수 첫째 자리까지 올림하여 5.0이라고 한다). 아래 수가 0인데도 올린다(3600 → 3700).
//   ④ 반올림하여 9가 10이 될 때 윗자리로 넘기지 못한다(4996 → 4990, 49100). 아래 자리부터 거듭 반올림한다(3.648 → 3.65 → 3.7).
//   ⑤ 올림·버림은 수가 아니라 상황이 정한다는 것을 놓친다(남김없이 담는 상자는 올림, 가득 채워 파는 상자는 버림).
//   ⑥ 어림한 수에서 처음 수를 되짚을 때 끝의 수를 틀린다(올림하여 780이 되는 가장 큰 수는 780, 반올림하여 3200이 되는 수는 3150 이상 3250 미만).
// 이 가운데 기본에서 하는 일(어림 한 번, 뜻 되묻기, 표에서 값 하나 읽기)을 고르기로 바꾸고 틀린 보기에 실수 답을 넣은 것은 실력이 아니므로
// 기본 묶음에 실었다(up-wrong, dn-wrong, rd-wrong, mix-say, rd-impossible, life-table-fee, life-table-grade …).
//
// 실력 문항의 잣대: 어려움이 보기가 아니라 문제의 장치에서 나와야 한다.
//   ㉮ 상황·수·그림 자체에 함정이 있어 뜻을 정확히 대야 풀리는 문제 — 이상·이하·초과·미만이 섞인 요금표의 경계 나이, 뒤집어 말한 기준,
//      ●와 ○가 섞인 수직선에서 자연수 세기, 내지 않는 범위의 나머지, 바로 아래 자리가 0인 소수의 올림, 윗자리로 이어 넘어가는 반올림, 거듭 반올림한 잘못,
//      모두 담는 상자와 가득 채워 파는 상자, 두 자리까지 반올림한 수가 같아지는 수, 자리 수가 정해진 수 가운데 세기, 자리 숫자의 범위, 자기 자신이 끝의 수가 되는 올림·버림,
//      더한 무게가 경계에 걸리는 요금표.
//   ㉯ 두 번 넘게 생각해야 풀리는 문제 — 개수나 결과에서 경계 되짚기, 같은 범위를 다른 말로, 두 기준을 함께 만족하는 범위, 반올림한 값으로 기준에 드는 사람 세기,
//      반올림하기 전 수의 범위, 어림한 사람 수로 준비물 구하기, 운행 횟수로 사람 수의 범위, 범위와 어림을 함께 만족하는 수, 어림한 뒤 값 곱하기,
//      버림에 이은 올림, 따로 버림과 모아서 버림, 두 가게의 묶음 값.
//
// 싣는 기준
//  - 어림 방법(올림·버림·반올림), 나타내는 자리(십·백·천·만, 일의 자리, 소수 첫째·둘째 자리), 수의 얼개(아래 수가 0, 가운데 0, 윗자리로 넘어감)가
//    다르면 다른 문제다. 글이 같은 꼴이 되는 것은 facts.rule 에 서로 다른 이름을 달고, 그 얼개는 수를 뽑는 코드가 지킨다.
//  - 소수는 10배·100배·1000배 한 자연수로 셈하고 글에 적을 때만 소수로 적는다. 답이 자연수가 되는 것(일의 자리까지)은 자연수 답 칸으로 받는다.
//    2.0처럼 끝이 0인 소수가 답이 되는 수는 뽑지 않는다(답 칸이 2.0과 2를 가르지 못한다).
//  - 문장제는 10·100·1000씩 묶는 상황만 쓴다(구하려는 자리까지 올림·버림하는 일). 40명씩·45명씩 묶는 것은 나눗셈의 나머지 처리라 싣지 않는다.
//  - 사람은 이름으로만 적고, 가게·시설의 이름은 짓지 않는다.
//
// 뺀 것과 까닭
//  - 조건 풀이·경우 따지기가 어려움의 대부분인 것: 어림 조건 둘·셋에 맞는 수(①64 ②65 심60), 어림 조건과 자리 숫자 조건(심61), 수 카드로 만든 수 가운데
//    어림값이 정해진 수 세기·모두 만들기(③80 심62), 수 카드로 5000에 가장 가까운 수 만들기(심46), 올림과 반올림이 같아지는 숫자 모두(②64 심51)
//  - 중학교 부등식 꼴: 곱한 뒤 버림한 값으로 어떤 수 찾기(①65 심58)
//  - 4-1 나눗셈의 나머지 처리(자리 어림이 아니다): 묶음이 20·40·45·50·7인 올림(②81 ③78 심66), 30개씩 담아 파는 값(①70의 변형), 24인승 버스 대수로 사람 수(②82 — 10명씩으로 바꾸어 실었다)
//  - 5-1-6(둘레): 직사각형 텃밭의 둘레를 반올림(①48의 변형 심48)
//  - 뜻 없는 셈: 어림한 두 수의 합·차(①51 ②51 ③47 심42), 가장 큰 수와 가장 작은 수의 합·차(①60의 변형 ③56 심53 — 끝의 수를 따로 묻는다),
//    수 카드로 만든 수를 두 자리로 어림한 차(①63), 찾은 수를 다시 어림(심55), 범위의 끝 수를 어림(②67), 두 사람이 낸 돈의 합(①67의 변형)
//  - 어림은 크기 차례를 뒤집지 않으므로 어림할 것 없이 풀리는 것: 어림한 결과가 가장 큰 수 고르기(①54), 어느 자리까지 버림해야 가장 작은가(①57 ②50의 변형)
//  - 혼합 계산이 일의 대부분인 것: 동전 세 가지를 지폐로(②80의 변형), 거스름돈까지 구하기(②78의 변형)
//  - 답 칸이 받지 못하는 것: 반올림·버림한 값이 2.0, 46.0처럼 끝이 0인 소수가 되는 수(②42 ③42의 변형)
//  - 서술형·열린 답·활동: 어떻게 어림했는지 글로 쓰기(②54 심44의 글 쓰기 — 방법 고르기는 실었다), 틀린 말 고쳐 쓰기(②46·77 ③52의 변형), 스스로 만든 수 어림(심47),
//    내 물건 설명하기·재기·놀이(③44·83·84)
//  - 그림을 알 수 없고 하는 일이 같은 것: 저울·온도계 눈금 읽고 반올림(②56 ③68의 변형 — 자 그림 rd-ruler 와 하는 일이 같다)
//  - 같은 일: 어림한 수를 보기에서 고르기(③40)는 어림 한 번을 고르기로 바꾼 것이고, 방법·자리·답을 차례로 채우기(①73)는 use-which-method 와 use-up-buy 를 이은 것,
//    세 어림과 값 잇기(②44의 변형)는 mix-three 와, 어림하면 백의 자리 숫자가 9가 되는 수(②48의 변형)는 up-becomes 와 하는 일이 같다.
//    곱한 뒤 묶음으로 사기(심67)는 use-up-after-times 와, 금액을 구해 지폐로 바꾸고 남는 돈(심70)은 use-dn-left 와, 올림한 횟수에 시간 곱하기(②78의 변형 심68)는 hd-buy-cost 와,
//    어림한 수의 범위에 곱하기(②83)는 hd-prepare 와, 반올림으로 올라간 자리의 가려진 숫자(심50의 변형)는 back-digit-up 과 얼개가 같아 하나씩만 실었다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { LABELS, NAMES, lines, tagged, numbers, table, cards, ruler, josa, name, N, M, C, D } = B.kit;
  const { TAGS, ints, some, pickNames, W, COMBOS, inside, two, dj, CT, setItem, rangeLine, twoLine, stack, listTable, inRow, rowText } = B.kit.range521;
  const U = '5-2-1', RANGE = '6수01-02', ROUND = '6수01-03';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  // 실력 문항의 꼴 번호는 심화꼴 번호다. 기본 자료에만 있는 꼴은 '기본 ②55'처럼 적는다. HR 은 어림 쪽 성취기준을 단 실력 문항.
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: ref.startsWith('기본 ') ? '수집본 기본 자료(' + ref.slice(3) + ')' : '수집본 심화 자료(' + ref + ')', make }, more || {});
  const HR = (id, title, ref, make, more) => H(id, title, ref, make, Object.assign({ standard: ROUND }, more || {}));
  const MARKS = ['㉠', '㉡', '㉢', '㉣', '㉤'];
  const ORDERS = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];
  const num = (ds) => ds.reduce((n, v) => n * 10 + v, 0);
  // 자리마다 숫자의 범위를 주어 수를 만든다: pickNum(d, [1, 9], [0, 8], [1, 9]) → 세 자리 수
  const pickNum = (d, ...spans) => num(spans.map(([lo, hi]) => d.int(lo, hi)));

  // ── 어림 ─────────────────────────────────────────────────────
  // p: 나타내려는 자리의 크기(10 → 십의 자리까지). 엔진 쪽은 올림·내림 함수로 셈하고, 검사가 따로 셈할 식(X)은 나머지 셈으로 적는다.
  const DO = { up: (n, p) => Math.ceil(n / p) * p, down: (n, p) => Math.floor(n / p) * p, half: (n, p) => Math.floor((n + p / 2) / p) * p };
  const KO = { up: '올림', down: '버림', half: '반올림' }, METHODS = ['up', 'down', 'half'];
  const PN = { 1: '일', 10: '십', 100: '백', 1000: '천', 10000: '만' };
  const to = (m, p) => `${KO[m]}하여 ${PN[p]}의 자리까지`;
  const X = { down: (n, p) => `(${n}-${n}%${p})`, up: (n, p) => `(${n}+${p}-1-(${n}+${p}-1)%${p})`, half: (n, p) => `(${n}+${p}/2-(${n}+${p}/2)%${p})` };
  // 소수는 10배·100배·1000배 한 자연수 n(소수점 아래 k자리)으로 셈하고 글에 적을 때만 소수로 적는다. fx(2481, 3) → '2.481'
  const P10 = [1, 10, 100, 1000];
  const fx = (n, k) => { const t = String(n).padStart(k + 1, '0'); return k ? t.slice(0, -k) + '.' + t.slice(-k) : t; };
  const DP = ['일의 자리', '소수 첫째 자리', '소수 둘째 자리', '소수 셋째 자리'];
  // 소수 j째 자리까지(0이면 일의 자리까지) 어림한 값: 적는 글과 답 칸에 넣는 수
  const dr = (m, n, k, j) => { const p = P10[k - j], r = DO[m](n, p); return { text: fx(r / p, j), value: r / P10[k] }; };
  // 검사가 따로 셈할 식. 소수에 1000을 곱한 값이 아주 조금 어긋나도 자리가 바뀌지 않게 0.5를 더해 둔다.
  const XD = (m, text, k, j) => { const p = P10[k - j], c = m === 'down' ? 0.5 : m === 'up' ? p - 0.5 : p / 2 + 0.5, base = `(${text}*${P10[k]}+${c})`; return `(${base}-${base}%${p})/${P10[k]}`; };
  // 식에 쓴 수 가운데 문제 글에 없는 수(자리의 크기 10·100 따위)를 밝힌다. shown: 글에 적힌 수.
  const unseenOf = (exprs, shown) => { const seen = new Set((shown || []).map(String)), out = []; for (const e of exprs) for (const tok of e.match(/\d+(?:\.\d+)?/g) || []) if (!seen.has(tok) && !out.includes(Number(tok))) out.push(Number(tok)); return out; };
  const calcF = (rows, shown, more) => Object.assign({ calc: rows, unseen: unseenOf(rows.map((row) => row[0]), shown) }, more || {});
  const chooseF = (exprs, shown, more) => ({ choose: Object.assign({ exprs }, more), unseen: unseenOf(exprs, shown) });
  // 풀이 글
  const why = (m, n, p) => {
    const r = DO[m](n, p), low = n % p;
    if (m !== 'half' && low === 0) return `${PN[p]}의 자리 아래 수가 0이므로 ${n} 그대로이다.`;
    if (m === 'up') return `${PN[p]}의 자리 아래 수 ${josa(low, '을/를')} ${josa(p, '으로/로')} 보고 올리면 ${r}이다.`;
    if (m === 'down') return `${PN[p]}의 자리 아래 수 ${josa(low, '을/를')} 0으로 보고 버리면 ${r}이다.`;
    const digit = Math.floor(n / (p / 10)) % 10;
    return `${PN[p / 10]}의 자리 숫자가 ${digit}이므로 ${digit >= 5 ? '올리면' : '버리면'} ${r}이다.`;
  };
  const whyD = (m, n, k, j) => {
    const p = P10[k - j], res = dr(m, n, k, j);
    if (m === 'up') return `${DP[j]} 아래에 0이 아닌 수가 있으므로 올리면 ${res.text}이다.`;
    if (m === 'down') return `${DP[j]} 아래 수를 버리면 ${res.text}이다.`;
    const digit = Math.floor(n / (p / 10)) % 10;
    return `${DP[j + 1]} 숫자가 ${digit}이므로 ${digit >= 5 ? '올리면' : '버리면'} ${res.text}이다.`;
  };
  // 소수 세 자리 수: 자연수 부분과 소수점 아래 숫자 셋으로 만든다(1000배 한 수).
  const deci = (w, a, b, c) => w * 1000 + a * 100 + b * 10 + c;
  const orderChoice = (d, values, labels, descending) => {
    const right = values.map((_, i) => i).sort((p, q) => (descending ? values[q] - values[p] : values[p] - values[q]));
    const list = d.shuffle(d.shuffle(ORDERS.filter((o) => o.join() !== right.join())).slice(0, 3).concat([right]));
    return { list, options: list.map((o) => o.map((i) => labels[i]).join(', ')), answer: list.findIndex((o) => o.join() === right.join()) };
  };

  // ── 올림 ─────────────────────────────────────────────────────
  B.addTypes(U, 'up', [
    T('up-nat-th', '올림하여 십의 자리, 백의 자리까지 나타내기', '①37 ②37 ③36 심34', (d) => {
      const n = pickNum(d, [1, 9], [1, 8], [1, 8], [1, 9]);
      return M(`${josa(n, '을/를')} 올림하여 십의 자리까지, 백의 자리까지 나타내면?`, [{ label: '십의 자리까지', answer: DO.up(n, 10) }, { label: '백의 자리까지', answer: DO.up(n, 100) }], {
        explain: why('up', n, 10) + ' ' + why('up', n, 100), facts: calcF([[X.up(n, 10), 0], [X.up(n, 100), 1]], [n], { rule: 'plain' })
      });
    }),
    T('up-nat-thousand', '올림하여 천의 자리까지 나타내기', '①37 ②37 심34', (d) => {
      const n = pickNum(d, [1, 8], [1, 9], [0, 9], [0, 9]);
      return N(`${josa(n, '을/를')} 올림하여 천의 자리까지 나타내면?`, DO.up(n, 1000), { explain: why('up', n, 1000), facts: calcF([[X.up(n, 1000), 0]], [n], { rule: 'plain' }) });
    }),
    T('up-nat-man', '올림하여 만의 자리까지 나타내기', '①37 ②37', (d) => {
      const n = pickNum(d, [1, 8], [0, 9], [1, 9], [0, 9], [0, 9]);
      return N(`${josa(n, '을/를')} 올림하여 만의 자리까지 나타내면?`, DO.up(n, 10000), { explain: why('up', n, 10000), facts: calcF([[X.up(n, 10000), 0]], [n], { rule: 'plain' }) });
    }),
    T('up-exact', '아래 수가 0인 수의 올림', '①37 ③43', (d) => {
      const p = d.pick([10, 100]), n = p === 10 ? pickNum(d, [1, 9], [1, 9], [1, 9]) * 10 : pickNum(d, [1, 9], [1, 9]) * 100;
      return N(`${josa(n, '을/를')} 올림하여 ${PN[p]}의 자리까지 나타내면?`, n, { explain: why('up', n, p) + ' 올릴 수가 없으면 올리지 않는다.', facts: calcF([[X.up(n, p), 0]], [n], { rule: 'exact' }) });
    }),
    T('up-zero-mid', '가운데 0이 낀 수의 올림', '②37 ③43 심34', (d) => {
      const n = pickNum(d, [1, 9], [0, 8], [0, 0], [1, 9]);
      return N(`${josa(n, '을/를')} 올림하여 백의 자리까지 나타내면?`, DO.up(n, 100), { explain: `십의 자리 숫자가 0이어도 백의 자리 아래 수 ${josa(n % 100, '은/는')} 0이 아니다. ` + why('up', n, 100), facts: calcF([[X.up(n, 100), 0]], [n], { rule: 'zeroMid' }) });
    }),
    T('up-carry', '올림하여 윗자리로 넘어가는 수', '③43 심34', (d) => {
      const n = pickNum(d, [1, 8], [9, 9], [0, 9], [1, 9]);
      return N(`${josa(n, '을/를')} 올림하여 백의 자리까지 나타내면?`, DO.up(n, 100), { explain: why('up', n, 100) + ' 백의 자리 숫자 9에 1을 올리면 천의 자리로 넘어간다.', facts: calcF([[X.up(n, 100), 0]], [n], { rule: 'carry' }) });
    }),
    T('up-deci-1', '소수를 올림하여 소수 첫째 자리까지 나타내기', '①38 ②40 ③42 심36', (d) => {
      const n = deci(d.int(1, 40), d.int(0, 8), d.int(1, 9), d.int(1, 9)), t = fx(n, 3);
      return D(`${dj(t, '을/를')} 올림하여 소수 첫째 자리까지 나타내면?`, dr('up', n, 3, 1).value, { explain: whyD('up', n, 3, 1), facts: calcF([[XD('up', t, 3, 1), 0]], [t], { rule: 'plain' }) });
    }),
    T('up-deci-2', '소수를 올림하여 소수 둘째 자리까지 나타내기', '①38 ②40 ③42 심36', (d) => {
      const n = deci(d.int(1, 40), d.int(0, 9), d.int(0, 8), d.int(1, 9)), t = fx(n, 3);
      return D(`${dj(t, '을/를')} 올림하여 소수 둘째 자리까지 나타내면?`, dr('up', n, 3, 2).value, { explain: whyD('up', n, 3, 2), facts: calcF([[XD('up', t, 3, 2), 0]], [t], { rule: 'plain' }) });
    }),
    T('up-deci-0', '소수를 올림하여 일의 자리까지 나타내기', '①38 ②43 심36', (d) => {
      const n = deci(d.int(1, 40), d.int(0, 9), d.int(0, 9), d.int(1, 9)), t = fx(n, 3);
      return N(`${dj(t, '을/를')} 올림하여 일의 자리까지 나타내면?`, DO.up(n, 1000) / 1000, { explain: whyD('up', n, 3, 0), facts: calcF([[XD('up', t, 3, 0), 0]], [t], { rule: 'plain' }) });
    }),
    T('up-wrong', '잘못 올림한 것 찾기', '①45 ②46 ③52 심39', (d) => {
      // 틀린 보기: 아래 수가 0인데도 올린 것 / 십의 자리 숫자가 0이라고 올리지 않은 것 / 십의 자리까지만 올린 것
      const slip = d.pick(['exact', 'zero', 'tens']), exact = () => pickNum(d, [1, 9], [1, 8]) * 100, plain = () => pickNum(d, [1, 9], [0, 8], [1, 9], [1, 9]);
      const n0 = slip === 'exact' ? exact() : slip === 'zero' ? pickNum(d, [1, 9], [0, 8], [0, 0], [1, 9]) : pickNum(d, [1, 9], [0, 8], [1, 8], [1, 9]);
      const bad = [n0, slip === 'exact' ? n0 + 100 : slip === 'zero' ? n0 - n0 % 100 : DO.up(n0, 10)];
      const goods = d.until(() => [plain(), plain(), slip === 'exact' ? plain() : exact()], (list) => new Set(list.concat([n0])).size === 4).map((n) => [n, DO.up(n, 100)]);
      const rows = d.shuffle([bad].concat(goods));
      return C('올림하여 백의 자리까지 나타낸 것으로 옳지 않은 것은?', rows.map(([n, said]) => `${n} → ${said}`), rows.indexOf(bad), { explain: why('up', n0, 100), facts: { claimed: rows.map(([n, said]) => [X.up(n, 100), said]), claimedWant: false } });
    }),
    T('up-becomes', '올림하면 주어진 수가 되는 수 모두 고르기', '①52 ②48 ③49 심37', (d) => {
      const t = pickNum(d, [1, 9], [1, 9]) * 100, list = d.shuffle([t - 100, t - 99, t - d.int(11, 89), t, t + 1, t - 100 - d.int(1, 50)]), flags = list.map((v) => DO.up(v, 100) === t);
      return setItem(d, `올림하여 백의 자리까지 나타내면 ${josa(t, '이/가')} 되는 수를 모두 고른 것은?`, list, flags, list.indexOf(d.bool() ? t : t - 100), {
        figure: numbers(list), explain: `올림하여 백의 자리까지 나타내면 ${josa(t, '이/가')} 되는 수는 ${t - 100} 초과 ${t} 이하인 수이다. ${t}도 포함되고 ${josa(t - 100, '은/는')} 포함되지 않는다.`
      });
    }),
    T('up-odd-one', '올림한 수가 다른 하나', '①53 ②47 심38', (d) => {
      const t = d.int(3, 8) * 1000, odd = d.pick([t - 1000, t + d.int(1, 9)]), list = d.shuffle([t, t - d.int(2, 499), t - 1000 + d.int(1, 9), odd]), exprs = list.map((v) => X.up(v, 1000));
      return C('올림하여 천의 자리까지 나타낸 수가 나머지 셋과 다른 것은?', list.map(String), list.indexOf(odd), {
        explain: list.map((v) => `${v} → ${DO.up(v, 1000)}`).join(', ') + '이다. 아래 수가 0이면 그대로이고, 1이라도 있으면 올린다.', facts: chooseF(exprs, list, { rule: 'odd' })
      });
    })
  ]);

  // ── 버림 ─────────────────────────────────────────────────────
  B.addTypes(U, 'down', [
    T('dn-nat-th', '버림하여 십의 자리, 백의 자리까지 나타내기', '①39 ②38 ③37 심34', (d) => {
      const n = pickNum(d, [1, 9], [1, 9], [1, 9], [1, 9]);
      return M(`${josa(n, '을/를')} 버림하여 십의 자리까지, 백의 자리까지 나타내면?`, [{ label: '십의 자리까지', answer: DO.down(n, 10) }, { label: '백의 자리까지', answer: DO.down(n, 100) }], {
        explain: why('down', n, 10) + ' ' + why('down', n, 100), facts: calcF([[X.down(n, 10), 0], [X.down(n, 100), 1]], [n], { rule: 'plain' })
      });
    }),
    T('dn-nat-thousand', '버림하여 천의 자리까지 나타내기', '①39 ②38', (d) => {
      const n = pickNum(d, [1, 9], [1, 9], [0, 9], [0, 9]);
      return N(`${josa(n, '을/를')} 버림하여 천의 자리까지 나타내면?`, DO.down(n, 1000), { explain: why('down', n, 1000), facts: calcF([[X.down(n, 1000), 0]], [n], { rule: 'plain' }) });
    }),
    T('dn-nat-man', '버림하여 만의 자리까지 나타내기', '①39 ②38 ③37', (d) => {
      const n = pickNum(d, [1, 9], [0, 9], [5, 9], [0, 9], [0, 9], [1, 9]);
      return N(`${josa(n, '을/를')} 버림하여 만의 자리까지 나타내면?`, DO.down(n, 10000), { explain: why('down', n, 10000), facts: calcF([[X.down(n, 10000), 0]], [n], { rule: 'plain' }) });
    }),
    T('dn-zero', '가운데 0이 낀 수의 버림', '②38 ③43', (d) => {
      const n = pickNum(d, [1, 9], [1, 9], [0, 0], [1, 9]);
      return M(`${josa(n, '을/를')} 버림하여 십의 자리까지, 백의 자리까지 나타내면?`, [{ label: '십의 자리까지', answer: DO.down(n, 10) }, { label: '백의 자리까지', answer: DO.down(n, 100) }], {
        explain: `${why('down', n, 10)} ${why('down', n, 100)} 십의 자리 숫자가 0이므로 두 수가 같다.`, facts: calcF([[X.down(n, 10), 0], [X.down(n, 100), 1]], [n], { rule: 'zero' })
      });
    }),
    T('dn-deci-1', '소수를 버림하여 소수 첫째 자리까지 나타내기', '①40 ②41 ③42 심36', (d) => {
      const n = deci(d.int(1, 40), d.int(1, 9), d.int(0, 9), d.int(1, 9)), t = fx(n, 3);
      return D(`${dj(t, '을/를')} 버림하여 소수 첫째 자리까지 나타내면?`, dr('down', n, 3, 1).value, { explain: whyD('down', n, 3, 1), facts: calcF([[XD('down', t, 3, 1), 0]], [t]) });
    }),
    T('dn-deci-2', '소수를 버림하여 소수 둘째 자리까지 나타내기', '①40 ②41 ③42 심36', (d) => {
      const n = deci(d.int(0, 40), d.int(0, 9), d.int(1, 9), d.int(1, 9)), t = fx(n, 3);
      return D(`${dj(t, '을/를')} 버림하여 소수 둘째 자리까지 나타내면?`, dr('down', n, 3, 2).value, { explain: whyD('down', n, 3, 2), facts: calcF([[XD('down', t, 3, 2), 0]], [t]) });
    }),
    T('dn-deci-0', '소수를 버림하여 일의 자리까지 나타내기', '①40 ②43 ③42', (d) => {
      const n = deci(d.int(2, 60), d.int(5, 9), d.int(0, 9), d.int(1, 9)), t = fx(n, 3);
      return N(`${dj(t, '을/를')} 버림하여 일의 자리까지 나타내면?`, DO.down(n, 1000) / 1000, { explain: whyD('down', n, 3, 0), facts: calcF([[XD('down', t, 3, 0), 0]], [t]) });
    }),
    T('dn-wrong', '잘못 버림한 것 찾기', '①45 ②46 ③52 심39', (d) => {
      // 틀린 보기: 반올림한 것(십의 자리 숫자가 5 이상이라고 올림) / 십의 자리까지만 버림한 것
      const slip = d.pick(['half', 'tens']), plain = () => pickNum(d, [1, 9], [0, 9], [0, 9], [1, 9]);
      const n0 = slip === 'half' ? pickNum(d, [1, 9], [0, 8], [5, 9], [0, 9]) : pickNum(d, [1, 9], [0, 9], [1, 9], [1, 9]), bad = [n0, slip === 'half' ? DO.up(n0, 100) : DO.down(n0, 10)];
      const goods = d.until(() => [plain(), plain(), pickNum(d, [1, 9], [0, 9], [6, 9], [1, 9])], (list) => new Set(list.concat([n0])).size === 4).map((n) => [n, DO.down(n, 100)]);
      const rows = d.shuffle([bad].concat(goods));
      return C('버림하여 백의 자리까지 나타낸 것으로 옳지 않은 것은?', rows.map(([n, said]) => `${n} → ${said}`), rows.indexOf(bad), { explain: why('down', n0, 100) + ' 버림은 아래 수가 얼마이든 버린다.', facts: { claimed: rows.map(([n, said]) => [X.down(n, 100), said]), claimedWant: false } });
    }),
    T('dn-becomes', '버림하면 주어진 수가 되는 수의 개수', '①52 ②48 ③49 심37', (d) => {
      const t = pickNum(d, [1, 9], [1, 9]) * 100, list = d.shuffle([t - 1, t, t + d.int(11, 89), d.bool() ? t + 99 : t + 101, t + 100, t - d.int(11, 89)]), hit = list.filter((v) => DO.down(v, 100) === t);
      return N(`버림하여 백의 자리까지 나타내면 ${josa(t, '이/가')} 되는 수는 모두 몇 개인가?`, hit.length, {
        unit: '개', figure: numbers(list), explain: `버림하여 백의 자리까지 나타내면 ${josa(t, '이/가')} 되는 수는 ${t} 이상 ${t + 100} 미만인 수이다. 이 범위에 드는 수는 ${hit.join(', ')}이다.`, facts: { count: list.map((v) => DO.down(v, 100) === t) }
      });
    }),
    T('dn-becomes-deci', '버림하면 주어진 소수가 되는 수 모두 고르기', '②48 ③49', (d) => {
      const w = d.int(1, 30), a = d.int(2, 8), k = () => d.int(1, 9), t = w * 10 + a;
      const list = d.until(() => d.shuffle([deci(w, a, d.int(1, 8), k()), deci(w, a, 9, k()), deci(w, a + 1, 0, k()), deci(w, a - 1, 9, k()), deci(w, a + 1, k(), k())]), (xs) => new Set(xs).size === 5);
      const texts = list.map((v) => fx(v, 3)), flags = list.map((v) => DO.down(v, 100) === t * 100);
      return setItem(d, `버림하여 소수 첫째 자리까지 나타내면 ${dj(fx(t, 1), '이/가')} 되는 수를 모두 고른 것은?`, texts, flags, list.findIndex((v) => DO.down(v, 100) === (t - 1) * 100), {
        figure: numbers(texts), explain: `버림하면 소수 첫째 자리 아래 수를 버리므로 ${fx(t, 1)} 이상 ${fx(t + 1, 1)} 미만인 수가 ${dj(fx(t, 1), '이/가')} 된다. 이 범위에 드는 수는 ${texts.filter((_, i) => flags[i]).join(', ')}이다.`
      });
    }),
    T('dn-odd-deci', '버림한 소수가 다른 하나', '③48', (d) => {
      const w = d.int(1, 30), a = d.int(2, 8), k = () => d.int(1, 9), odd = d.bool() ? deci(w, a - 1, d.int(8, 9), k()) : deci(w, a + 1, 0, k());
      const list = d.until(() => d.shuffle([deci(w, a, d.int(1, 4), k()), deci(w, a, d.int(5, 9), k()), deci(w, a, 0, k()), odd]), (xs) => new Set(xs).size === 4), texts = list.map((v) => fx(v, 3)), exprs = texts.map((t) => XD('down', t, 3, 1));
      return C('버림하여 소수 첫째 자리까지 나타낸 수가 나머지 셋과 다른 것은?', texts, list.indexOf(odd), {
        explain: list.map((v) => `${fx(v, 3)} → ${dr('down', v, 3, 1).text}`).join(', ') + '이다.', facts: chooseF(exprs, texts, { rule: 'odd' })
      });
    })
  ]);

  // ── 반올림 ───────────────────────────────────────────────────
  B.addTypes(U, 'round', [
    T('rd-word', '올림·버림·반올림의 뜻', '②36 ③35 심33', (d) => {
      const defs = d.shuffle([['구하려는 자리의 아래 수를 올려서 나타내는 방법', '올림'], ['구하려는 자리의 아래 수를 버려서 나타내는 방법', '버림'], ['구하려는 자리 바로 아래 자리의 숫자가 0, 1, 2, 3, 4이면 버리고 5, 6, 7, 8, 9이면 올려서 나타내는 방법', '반올림']]);
      const right = defs.map((x) => x[1]), names = ['올림', '버림', '반올림'], others = d.shuffle(ORDERS.map((o) => o.map((i) => names[i])).filter((p) => p.join() !== right.join())).slice(0, 3);
      return CT('㉠, ㉡, ㉢에 알맞은 어림 방법의 이름을 차례로 쓴 것은?', d.shuffle([[right.join(', '), true]].concat(others.map((p) => [p.join(', '), false]))), true, {
        figure: tagged(defs.map((x) => x[0])), explain: '아래 수를 올려서 나타내면 올림, 버려서 나타내면 버림이다. 바로 아래 자리의 숫자가 5보다 작으면 버리고 5와 같거나 크면 올리는 방법은 반올림이다.'
      });
    }),
    T('rd-nat-th', '반올림하여 십의 자리, 백의 자리까지 나타내기', '①41 ②39 ③38 심34', (d) => {
      const n = pickNum(d, [1, 9], [1, 8], [1, 4], [5, 5]);
      return M(`${josa(n, '을/를')} 반올림하여 십의 자리까지, 백의 자리까지 나타내면?`, [{ label: '십의 자리까지', answer: DO.half(n, 10) }, { label: '백의 자리까지', answer: DO.half(n, 100) }], {
        explain: why('half', n, 10) + ' ' + why('half', n, 100), facts: calcF([[X.half(n, 10), 0], [X.half(n, 100), 1]], [n], { rule: 'plain' })
      });
    }),
    T('rd-nat-thousand', '반올림하여 천의 자리까지 나타내기', '①41 ②39 ③38', (d) => {
      const n = pickNum(d, [1, 8], [0, 9], [0, 9], [1, 9]);
      return N(`${josa(n, '을/를')} 반올림하여 천의 자리까지 나타내면?`, DO.half(n, 1000), { explain: why('half', n, 1000), facts: calcF([[X.half(n, 1000), 0]], [n]) });
    }),
    T('rd-nat-man', '생활 속 큰 수를 반올림하여 만의 자리까지 나타내기', '①46 ②39·57 ③38·66', (d) => {
      const n = pickNum(d, [1, 8], [0, 8], [0, 9], [1, 9], [0, 9], [0, 9]);
      return N(`어느 도시의 인구는 ${n}명이다. 이 도시의 인구를 반올림하여 만의 자리까지 나타내면 몇 명인가?`, DO.half(n, 10000), { unit: '명', explain: why('half', n, 10000), facts: calcF([[X.half(n, 10000), 0]], [n]) });
    }),
    T('rd-carry', '반올림하여 윗자리로 넘어가는 수', '①41 ③43', (d) => {
      const n = pickNum(d, [1, 8], [9, 9], [5, 9], [0, 9]);
      return N(`${josa(n, '을/를')} 반올림하여 백의 자리까지 나타내면?`, DO.half(n, 100), { explain: why('half', n, 100) + ' 백의 자리 숫자 9에 1을 올리면 천의 자리로 넘어간다.', facts: calcF([[X.half(n, 100), 0]], [n], { rule: 'carry' }) });
    }),
    T('rd-deci-1', '소수를 반올림하여 소수 첫째 자리까지 나타내기', '①42 ②42 ③41 심36', (d) => {
      const [b, c] = d.until(() => [d.int(0, 9), d.int(0, 9)], ([x, y]) => x + y > 0 && !(x === 4 && y >= 5)), n = deci(d.int(1, 40), d.int(1, 8), b, c), t = fx(n, 3);
      return D(`${dj(t, '을/를')} 반올림하여 소수 첫째 자리까지 나타내면?`, dr('half', n, 3, 1).value, { explain: whyD('half', n, 3, 1), facts: calcF([[XD('half', t, 3, 1), 0]], [t]) });
    }),
    T('rd-deci-2', '소수를 반올림하여 소수 둘째 자리까지 나타내기', '①42 ②42 ③41 심36', (d) => {
      const n = deci(d.int(1, 40), d.int(0, 9), d.int(1, 8), d.int(1, 9)), t = fx(n, 3);
      return D(`${dj(t, '을/를')} 반올림하여 소수 둘째 자리까지 나타내면?`, dr('half', n, 3, 2).value, { explain: whyD('half', n, 3, 2), facts: calcF([[XD('half', t, 3, 2), 0]], [t]) });
    }),
    T('rd-deci-0', '소수를 반올림하여 일의 자리까지 나타내기', '①42 ②43 ③41 심36', (d) => {
      const [a, b] = d.until(() => [d.int(0, 9), d.int(1, 9)], ([x, y]) => !(x === 4 && y >= 5)), n = d.int(3, 80) * 100 + a * 10 + b, t = fx(n, 2);
      return N(`${dj(t, '을/를')} 반올림하여 일의 자리까지 나타내면?`, DO.half(n, 100) / 100, { explain: whyD('half', n, 2, 0), facts: calcF([[XD('half', t, 2, 0), 0]], [t]) });
    }),
    T('rd-deci-tens', '소수를 반올림하여 십의 자리까지 나타내기', '②43 ③67', (d) => {
      const n = num([d.int(1, 9), d.int(0, 8), d.pick([0, 1, 2, 3, 5, 6, 7, 8, 9]), d.int(1, 9)]), t = fx(n, 1), unit = Math.floor(n / 10) % 10, ans = DO.half(n, 100) / 10;
      return N(`${dj(t, '을/를')} 반올림하여 십의 자리까지 나타내면?`, ans, { explain: `일의 자리 숫자가 ${unit}이므로 ${unit >= 5 ? '올리면' : '버리면'} ${ans}이다. 소수점 아래 수는 보지 않는다.`, facts: calcF([[XD('half', t, 1, -1), 0]], [t]) });
    }),
    T('rd-wrong', '잘못 반올림한 것 찾기', '①45 ②46 ③52', (d) => {
      // 틀린 보기: 일의 자리 숫자 5를 버린 것 / 일의 자리 숫자 4를 올린 것
      const slip = d.pick(['five', 'four']), n0 = slip === 'five' ? pickNum(d, [1, 9], [0, 9], [0, 8], [5, 5]) : pickNum(d, [1, 9], [0, 9], [0, 8], [4, 4]), bad = [n0, slip === 'five' ? DO.down(n0, 10) : DO.up(n0, 10)];
      const goods = d.until(() => [pickNum(d, [1, 9], [0, 9], [1, 9]) * 10, pickNum(d, [1, 9], [0, 9], [0, 8], [6, 9]), slip === 'five' ? pickNum(d, [1, 9], [0, 9], [0, 8], [1, 4]) : pickNum(d, [1, 9], [0, 9], [0, 8], [5, 5])], (list) => new Set(list.concat([n0])).size === 4).map((n) => [n, DO.half(n, 10)]);
      const rows = d.shuffle([bad].concat(goods));
      return C('반올림하여 십의 자리까지 나타낸 것으로 옳지 않은 것은?', rows.map(([n, said]) => `${n} → ${said}`), rows.indexOf(bad), { explain: why('half', n0, 10) + ' 5는 올린다.', facts: { claimed: rows.map(([n, said]) => [X.half(n, 10), said]), claimedWant: false } });
    }),
    T('rd-becomes', '반올림하면 주어진 수가 되는 수 모두 고르기', '①52 ②48 심37', (d) => {
      const t = pickNum(d, [1, 9], [0, 9], [1, 9]) * 10, list = d.shuffle([t - 5, t - 6, t + 4, t + 5, t, t + d.int(6, 9)]), flags = list.map((v) => DO.half(v, 10) === t);
      return setItem(d, `반올림하여 십의 자리까지 나타내면 ${josa(t, '이/가')} 되는 수를 모두 고른 것은?`, list, flags, list.indexOf(d.bool() ? t + 5 : t - 5), {
        figure: numbers(list), explain: `반올림하여 십의 자리까지 나타내면 ${josa(t, '이/가')} 되는 수는 ${t - 5} 이상 ${t + 5} 미만인 수이다. ${t - 5}는 올려서 ${t}, ${josa(t + 5, '은/는')} 올려서 ${t + 10}이 된다.`
      });
    }),
    T('rd-odd-one', '반올림한 수가 다른 하나', '①53 ③48 심38', (d) => {
      const t = d.int(12, 88) * 1000, odd = d.bool() ? t - 500 - d.int(1, 90) : t + 500 + d.int(0, 90), list = d.shuffle([t - 500 + d.int(0, 90), t + d.int(100, 499), t - d.int(1, 400), odd]), exprs = list.map((v) => X.half(v, 1000));
      return C('반올림하여 천의 자리까지 나타낸 수가 나머지 셋과 다른 것은?', list.map(String), list.indexOf(odd), { explain: list.map((v) => `${v} → ${DO.half(v, 1000)}`).join(', ') + '이다. 백의 자리 숫자가 5 이상이면 올리고 4 이하이면 버린다.', facts: chooseF(exprs, list, { rule: 'odd' }) });
    }),
    T('rd-impossible', '반올림하여 나타낼 수 없는 수', '①56 ②53', (d) => {
      // 틀린 보기: 백의 자리까지 버림한 수(십의 자리 숫자가 5 이상인데 올리지 않음)
      const n = pickNum(d, [1, 8], [1, 8], [5, 8], [1, 9]), rows = d.shuffle([[10, DO.half(n, 10)], [100, DO.half(n, 100)], [1000, DO.half(n, 1000)], [100, DO.down(n, 100)]]);
      return C(`${josa(n, '을/를')} 반올림하여 나타낼 수 없는 수는?`, rows.map(([, v]) => String(v)), rows.findIndex(([p, v]) => v !== DO.half(n, p)), {
        explain: `십의 자리까지 ${DO.half(n, 10)}, 백의 자리까지 ${DO.half(n, 100)}, 천의 자리까지 ${DO.half(n, 1000)}이다. ${josa(DO.down(n, 100), '은/는')} 버림하여 백의 자리까지 나타낸 수이다.`, facts: { claimed: rows.map(([p, v]) => [X.half(n, p), v]), claimedWant: false }
      });
    }),
    T('rd-which-place-max', '어느 자리까지 반올림할 때 가장 큰가', '②50 심41', (d) => {
      const n = d.until(() => pickNum(d, [1, 8], [0, 9], [0, 9], [1, 9]), (v) => new Set([10, 100, 1000].map((p) => DO.half(v, p))).size === 3), vals = [10, 100, 1000].map((p) => DO.half(n, p)), exprs = [10, 100, 1000].map((p) => X.half(n, p));
      return C(`${josa(n, '을/를')} 반올림하여 십의 자리, 백의 자리, 천의 자리까지 각각 나타낼 때 가장 큰 수가 되는 것은?`, ['십의 자리까지', '백의 자리까지', '천의 자리까지'], vals.indexOf(Math.max(...vals)), {
        explain: `십의 자리까지 ${vals[0]}, 백의 자리까지 ${vals[1]}, 천의 자리까지 ${vals[2]}이다. 가장 큰 수는 ${Math.max(...vals)}이다.`, facts: chooseF(exprs, [n], { rule: 'max' })
      });
    }),
    T('rd-life-height', '잰 값을 반올림하여 일의 자리까지 나타내기', '①46 ②57 ③67', (d) => {
      const n = num([1, d.int(2, 5), d.int(0, 8), d.int(1, 9)]), t = fx(n, 1), who = d.pick(NAMES), ans = DO.half(n, 10) / 10;
      return N(`${who}의 키는 ${t} cm이다. 키를 반올림하여 일의 자리까지 나타내면 몇 cm인가?`, ans, { unit: 'cm', explain: `소수 첫째 자리 숫자가 ${n % 10}이므로 ${n % 10 >= 5 ? '올리면' : '버리면'} ${ans} cm이다.`, facts: calcF([[XD('half', t, 1, 0), 0]], [t]) });
    }),
    T('rd-ruler', '자로 잰 길이를 반올림하기', '①47 ②56 ③68 심49', (d) => {
      const c = d.int(3, 5), k = d.int(1, 9), ans = k >= 5 ? c + 1 : c, expr = `(${c}*10+${k}+5-(${c}*10+${k}+5)%10)/10`;
      return N('자 위에 놓인 색 막대의 길이를 반올림하여 일의 자리까지 나타내면 몇 cm인가?', ans, {
        unit: 'cm', figure: ruler(0, c * 10 + k, c + 2), explain: `색 막대의 길이는 ${c}.${k} cm이다. 소수 첫째 자리 숫자가 ${k}이므로 ${k >= 5 ? '올리면' : '버리면'} ${ans} cm이다.`, facts: calcF([[expr, 0]], [0, c, k])
      });
    }),
    T('rd-after-sum', '더한 값을 반올림하기', '①48 ②58 ③76 심48', (d) => {
      const [a, b] = d.until(() => [pickNum(d, [1, 4], [0, 9], [0, 9], [1, 9]), pickNum(d, [1, 4], [0, 9], [0, 9], [1, 9])], ([x, y]) => (x + y) % 100 !== 0), s = a + b;
      return N(`어느 박물관에 어제 ${a}명, 오늘 ${b}명이 입장하였다. 이틀 동안 입장한 사람 수를 반올림하여 백의 자리까지 나타내면 몇 명인가?`, DO.half(s, 100), {
        unit: '명', explain: `${a} + ${b} = ${s}(명)이다. ${why('half', s, 100)}`, facts: calcF([[X.half(`(${a}+${b})`, 100), 0]], [a, b])
      });
    }),
    T('rd-unit', '단위를 바꾸어 반올림하기', '①49 ③69 심49', (d) => {
      const n = d.until(() => pickNum(d, [1, 4], [0, 9], [0, 9], [1, 9]), (v) => !(Math.floor(v / 10) % 10 === 4 && v % 10 >= 5)), tenth = Math.floor(n / 10) % 10, ans = DO.half(n, 100) / 100;
      return N(`높이가 ${n} cm인 건물이 있다. 이 건물의 높이는 몇 m인지 반올림하여 일의 자리까지 나타내면?`, ans, { unit: 'm', explain: `${n} cm = ${fx(n, 2)} m이다. 소수 첫째 자리 숫자가 ${tenth}이므로 ${tenth >= 5 ? '올리면' : '버리면'} ${ans} m이다.`, facts: calcF([[`${X.half(n, 100)}/100`, 0]], [n]) });
    })
  ]);

  // ── 올림, 버림, 반올림 비교하기 ──────────────────────────────
  B.addTypes(U, 'mix', [
    T('mix-three', '한 수를 세 방법으로 어림하기', '①43 ②44 ③39 심35', (d) => {
      const n = pickNum(d, [1, 8], [1, 9], [0, 9], [1, 9]);
      return M(`${josa(n, '을/를')} 올림, 버림, 반올림하여 천의 자리까지 나타내면?`, METHODS.map((m) => ({ label: KO[m], answer: DO[m](n, 1000) })), {
        explain: `올림하면 ${DO.up(n, 1000)}, 버림하면 ${DO.down(n, 1000)}이다. 백의 자리 숫자가 ${Math.floor(n / 100) % 10}이므로 반올림하면 ${DO.half(n, 1000)}이다.`, facts: calcF(METHODS.map((m, i) => [X[m](n, 1000), i]), [n])
      });
    }),
    T('mix-three-deci', '소수를 세 방법으로 어림하기', '①43 ②44 심36', (d) => {
      const n = d.int(1, 40) * 100 + d.int(1, 8) * 10 + d.int(1, 9), t = fx(n, 2);
      return M(`${dj(t, '을/를')} 올림, 버림, 반올림하여 소수 첫째 자리까지 나타내면?`, METHODS.map((m) => ({ label: KO[m], answer: dr(m, n, 2, 1).value, decimal: true })), {
        explain: `올림하면 ${dr('up', n, 2, 1).text}, 버림하면 ${dr('down', n, 2, 1).text}이다. 소수 둘째 자리 숫자가 ${n % 10}이므로 반올림하면 ${dr('half', n, 2, 1).text}이다.`, facts: calcF(METHODS.map((m, i) => [XD(m, t, 2, 1), i]), [t])
      });
    }),
    T('mix-three-places', '방법과 자리를 바꾸어 가며 어림하기', '①43 ③44', (d) => {
      const n = pickNum(d, [1, 8], [1, 8], [1, 8], [1, 8], [1, 9], [1, 9]), places = d.shuffle([100, 1000, 10000]);
      return M(`${josa(n, '을/를')} 다음과 같이 어림하여 나타내면?`, METHODS.map((m, i) => ({ label: to(m, places[i]), answer: DO[m](n, places[i]) })), {
        explain: METHODS.map((m, i) => `${to(m, places[i])} 나타내면 ${DO[m](n, places[i])}`).join(', ') + '이다.', facts: calcF(METHODS.map((m, i) => [X[m](n, places[i]), i]), [n])
      });
    }),
    T('mix-which-place', '어느 자리까지 나타낸 것인가', '②45', (d) => {
      const m = d.pick(METHODS), p = d.pick([10, 100, 1000]), n = d.until(() => pickNum(d, [1, 8], [1, 8], [1, 8], [1, 8]), (v) => new Set([10, 100, 1000].map((q) => DO[m](v, q))).size === 3), r = DO[m](n, p);
      return C(`${josa(n, '을/를')} ${KO[m]}하여 어느 자리까지 나타내었더니 ${josa(r, '이/가')} 되었다. 어느 자리까지 나타낸 것인가?`, ['십의 자리', '백의 자리', '천의 자리'], [10, 100, 1000].indexOf(p), {
        explain: `${josa(r, '은/는')} ${PN[p]}의 자리 아래가 모두 0이다. ${josa(n, '을/를')} ${to(m, p)} 나타내면 ${r}이다.`, facts: chooseF([10, 100, 1000].map((q) => X[m](n, q)), [n], { rule: 'equals', target: r })
      });
    }),
    T('mix-which-place-deci', '소수를 어느 자리까지 나타낸 것인가', '①44', (d) => {
      const m = d.pick(METHODS), j = d.int(0, 2), n = deci(d.int(1, 30), d.int(1, 8), d.int(1, 8), d.int(1, 8)), t = fx(n, 3), res = dr(m, n, 3, j);
      return C(`${dj(t, '을/를')} ${KO[m]}하여 어느 자리까지 나타내었더니 ${dj(res.text, '이/가')} 되었다. 어느 자리까지 나타낸 것인가?`, DP.slice(0, 3), j, {
        explain: `${dj(t, '을/를')} ${KO[m]}하여 ${DP[j]}까지 나타내면 ${res.text}이다.`, facts: chooseF([0, 1, 2].map((q) => XD(m, t, 3, q)), [t], { rule: 'equals', target: res.value })
      });
    }),
    T('mix-say', '바르게 어림한 것 찾기', '①45 ②46 ③52 심39', (d) => {
      // 틀린 말: 올림을 버림으로, 버림을 반올림으로, 반올림을 버림으로, 올림을 반올림으로 한 것
      const t = d.int(0, 3), n1 = deci(d.int(1, 30), d.int(1, 8), d.int(1, 4), d.int(1, 9)), n2 = pickNum(d, [1, 9], [0, 8], [5, 9], [1, 9]), n3 = deci(d.int(1, 30), d.int(0, 9), d.int(1, 8), d.int(5, 9)), n4 = pickNum(d, [1, 9], [0, 9], [0, 8], [1, 4]);
      const said = (i, right, wrong) => (i === t ? right : wrong), s1 = said(0, dr('up', n1, 3, 1), dr('down', n1, 3, 1)), s2 = said(1, DO.down(n2, 100), DO.half(n2, 100)), s3 = said(2, dr('half', n3, 3, 2), dr('down', n3, 3, 2)), s4 = said(3, DO.up(n4, 10), DO.half(n4, 10));
      const rows = d.shuffle([
        [`${dj(fx(n1, 3), '을/를')} 올림하여 소수 첫째 자리까지 나타내면 ${s1.text}이다.`, XD('up', fx(n1, 3), 3, 1), s1.value, t === 0], [`${josa(n2, '을/를')} 버림하여 백의 자리까지 나타내면 ${s2}이다.`, X.down(n2, 100), s2, t === 1],
        [`${dj(fx(n3, 3), '을/를')} 반올림하여 소수 둘째 자리까지 나타내면 ${s3.text}이다.`, XD('half', fx(n3, 3), 3, 2), s3.value, t === 2], [`${josa(n4, '을/를')} 올림하여 십의 자리까지 나타내면 ${s4}이다.`, X.up(n4, 10), s4, t === 3]
      ]);
      const fixed = [`${fx(n1, 3)} → ${dr('up', n1, 3, 1).text}(올림)`, `${n2} → ${DO.down(n2, 100)}(버림)`, `${fx(n3, 3)} → ${dr('half', n3, 3, 2).text}(반올림)`, `${n4} → ${DO.up(n4, 10)}(올림)`];
      return C('바르게 어림한 것은?', rows.map((row) => row[0]), rows.findIndex((row) => row[3]), {
        explain: `바르게 어림하면 ${fixed.join(', ')}이다.`, facts: { claimed: rows.map((row) => [row[1], row[2]]), claimedWant: true }
      });
    }),
    T('mix-compare', '어림한 두 수의 크기 비교', '①50 ②49 ③45 심40', (d) => {
      const base = pickNum(d, [1, 8], [1, 8]) * 100, [a, b] = d.until(() => [base + d.int(11, 89), base + d.int(11, 89)], ([x, y]) => x !== y && x % 10 !== 0 && y % 10 !== 0);
      const [k1, k2] = d.until(() => [[d.pick(METHODS), d.pick([10, 100])], [d.pick(METHODS), d.pick([10, 100])]], ([p, q]) => p.join() !== q.join()), va = DO[k1[0]](a, k1[1]), vb = DO[k2[0]](b, k2[1]);
      return C('㉠과 ㉡의 크기를 바르게 비교한 것은?', ['㉠ &gt; ㉡', '㉠ = ㉡', '㉠ &lt; ㉡'], va > vb ? 0 : va === vb ? 1 : 2, {
        figure: tagged([`${josa(a, '을/를')} ${to(k1[0], k1[1])} 나타낸 수`, `${josa(b, '을/를')} ${to(k2[0], k2[1])} 나타낸 수`]), explain: `㉠은 ${va}, ㉡은 ${vb}이다.`, facts: chooseF([X[k1[0]](a, k1[1]), X[k2[0]](b, k2[1])], [a, b], { rule: 'compare' })
      });
    }),
    T('mix-compare-deci', '어림한 두 소수의 크기 비교', '①50 ②49 ③45 심40', (d) => {
      const w = d.int(1, 30), a0 = d.int(1, 8), [x, y] = d.until(() => [deci(w, a0, d.int(1, 8), d.int(1, 8)), deci(w, a0, d.int(1, 8), d.int(1, 8))], ([p, q]) => p !== q);
      const [k1, k2] = d.until(() => [[d.pick(METHODS), d.int(1, 2)], [d.pick(METHODS), d.int(1, 2)]], ([p, q]) => p.join() !== q.join()), ra = DO[k1[0]](x, P10[3 - k1[1]]), rb = DO[k2[0]](y, P10[3 - k2[1]]);
      return C('㉠과 ㉡의 크기를 바르게 비교한 것은?', ['㉠ &gt; ㉡', '㉠ = ㉡', '㉠ &lt; ㉡'], ra > rb ? 0 : ra === rb ? 1 : 2, {
        figure: tagged([`${dj(fx(x, 3), '을/를')} ${KO[k1[0]]}하여 ${DP[k1[1]]}까지 나타낸 수`, `${dj(fx(y, 3), '을/를')} ${KO[k2[0]]}하여 ${DP[k2[1]]}까지 나타낸 수`]),
        explain: `㉠은 ${dr(k1[0], x, 3, k1[1]).text}, ㉡은 ${dr(k2[0], y, 3, k2[1]).text}이다.`, facts: chooseF([XD(k1[0], fx(x, 3), 3, k1[1]), XD(k2[0], fx(y, 3), 3, k2[1])], [fx(x, 3), fx(y, 3)], { rule: 'compare' })
      });
    }),
    T('mix-order', '어림한 세 수의 차례', '①50 ②50 ③46 심40', (d) => {
      const base = pickNum(d, [1, 8], [1, 8]) * 100, kinds = d.shuffle([['up', 100], ['down', 10], ['half', 10]]);
      const ns = d.until(() => kinds.map(() => base + d.int(11, 89)), (list) => new Set(list).size === 3 && new Set(list.map((n, i) => DO[kinds[i][0]](n, kinds[i][1]))).size === 3), vals = ns.map((n, i) => DO[kinds[i][0]](n, kinds[i][1]));
      const pick = orderChoice(d, vals, LABELS, true), exprs = ns.map((n, i) => X[kinds[i][0]](n, kinds[i][1]));
      return C('어림하여 나타낸 수가 큰 것부터 차례로 쓴 것은?', pick.options, pick.answer, {
        figure: tagged(ns.map((n, i) => `${josa(n, '을/를')} ${to(kinds[i][0], kinds[i][1])} 나타낸 수`)), explain: vals.map((v, i) => `${LABELS[i]} ${v}`).join(', ') + '이다.', facts: chooseF(exprs, ns, { rule: 'descending', orders: pick.list })
      });
    }),
    T('mix-up-eq-down', '올림한 수와 버림한 수가 같은 수', '①55 ②52 ③51 심43', (d) => {
      const right = pickNum(d, [1, 9], [1, 9]) * 100;
      const list = d.until(() => d.shuffle([right, pickNum(d, [1, 9], [0, 9], [1, 9]) * 10, pickNum(d, [1, 9], [0, 9], [1, 9]) * 10, pickNum(d, [1, 9], [0, 9], [0, 9], [1, 9]), pickNum(d, [1, 9], [0, 9], [0, 0], [1, 9])]), (xs) => new Set(xs).size === 5);
      return C('올림하여 백의 자리까지 나타낸 수와 버림하여 백의 자리까지 나타낸 수가 같은 것은?', list.map(String), list.indexOf(right), {
        explain: `백의 자리 아래 수가 0인 수는 올릴 것도 버릴 것도 없으므로 올림한 수와 버림한 수가 같다. 백의 자리 아래가 모두 0인 수는 ${right}이다.`, facts: { claimed: list.map((n) => [X.up(n, 100), DO.down(n, 100)]), claimedWant: true }
      });
    }),
    T('mix-rd-eq', '반올림한 수와 올림(버림)한 수가 같은 수', '①55', (d) => {
      const other = d.pick(['up', 'down']), tens = (hit) => (hit === (other === 'up') ? [5, 9] : [0, 4]), make = (hit) => pickNum(d, [1, 9], [0, 8], tens(hit), [1, 9]);
      const right = make(true), list = d.until(() => d.shuffle([right, make(false), make(false), make(false)]), (xs) => new Set(xs).size === 4);
      return C(`반올림하여 백의 자리까지 나타낸 수와 ${KO[other]}하여 백의 자리까지 나타낸 수가 같은 것은?`, list.map(String), list.indexOf(right), {
        explain: `십의 자리 숫자가 ${other === 'up' ? '5 이상이면 반올림할 때 올리므로 올림한 수와 같다' : '4 이하이면 반올림할 때 버리므로 버림한 수와 같다'}. ${right}의 십의 자리 숫자는 ${Math.floor(right / 10) % 10}이다.`, facts: { claimed: list.map((n) => [X.half(n, 100), DO[other](n, 100)]), claimedWant: true }
      });
    }),
    T('mix-cards-becomes', '방법이 섞인 어림 가운데 주어진 수가 되는 것', '③50 심37·38', (d) => {
      const t = pickNum(d, [1, 8], [1, 8]) * 100;
      const pool = [[t + d.int(1, 9), 'up'], [t - d.int(11, 49), 'down'], [t + d.int(11, 49), 'half'], [t - d.int(11, 49), 'up'], [t + d.int(11, 49), 'down'], [t - d.int(51, 89), 'half']];
      const rows = d.until(() => some(d, pool, 5), (list) => new Set(list.map((r) => r[0])).size === 5), flags = rows.map(([n, m]) => DO[m](n, 100) === t);
      return setItem(d, `어림하여 나타낸 수가 ${t}인 것을 모두 고른 것은?`, MARKS, flags, flags.indexOf(false), {
        figure: tagged(rows.map(([n, m]) => `${josa(n, '을/를')} ${to(m, 100)} 나타낸 수`), MARKS), explain: rows.map(([n, m], i) => `${MARKS[i]} ${DO[m](n, 100)}`).join(', ') + '이다.'
      });
    }),
    T('mix-methods-set', '어림한 방법이 될 수 있는 것 모두 고르기', '②54 ③58 심44', (d) => {
      const n = d.until(() => pickNum(d, [1, 9], [0, 8], [0, 9], [0, 9]), (v) => v % 100 !== 0 && v % 100 !== 50), r = d.bool() ? DO.up(n, 100) : DO.down(n, 100), names = METHODS.map((m) => KO[m]), flags = METHODS.map((m) => DO[m](n, 100) === r);
      const sets = [['올림'], ['버림'], ['반올림'], ['올림', '반올림'], ['버림', '반올림']], right = names.filter((_, i) => flags[i]).join(', ');
      return C(`${josa(n, '을/를')} 어림하여 백의 자리까지 나타내었더니 ${josa(r, '이/가')} 되었다. 어림한 방법이 될 수 있는 것을 모두 고른 것은?`, sets.map((s) => s.join(', ')), sets.findIndex((s) => s.join(', ') === right), {
        explain: `백의 자리까지 올림하면 ${DO.up(n, 100)}, 버림하면 ${DO.down(n, 100)}, 반올림하면 ${DO.half(n, 100)}이다. ${josa(r, '이/가')} 되는 방법은 ${right}이다.`, facts: { sets: { labels: names, flags, options: sets } }
      });
    }),
    T('mix-method-table', '어림한 값을 보고 방법 찾기', '①58 ②54', (d) => {
      // 세 수를 한 방법으로 어림한 값이 되는 방법은 하나뿐이게 한다(반올림이면 올라간 수와 내려간 수가 섞인다).
      const m = d.pick(METHODS), fits = (list, x) => list.every((n) => DO[x](n, 10) === DO[m](n, 10));
      const list = d.until(() => [0, 1, 2].map(() => d.int(11, 49) * 10 + d.int(1, 9)), (xs) => new Set(xs.map((n) => Math.floor(n / 10))).size === 3 && METHODS.filter((x) => fits(xs, x)).length === 1);
      return CT('세 수를 같은 방법으로 어림하여 일의 자리까지 나타내었다. 어림한 방법은?', METHODS.map((x) => [KO[x], fits(list, x)]), true, {
        figure: table(['처음 수', '어림한 수'], list.map((n) => [fx(n, 1), String(DO[m](n, 10) / 10)])),
        explain: m === 'half' ? '소수 첫째 자리 숫자가 5 이상인 수는 올리고 4 이하인 수는 버렸으므로 반올림이다.' : m === 'up' ? '소수 첫째 자리 숫자가 4 이하인 수도 올렸으므로 올림이다.' : '소수 첫째 자리 숫자가 5 이상인 수도 버렸으므로 버림이다.'
      });
    }),
    T('mix-three-people', '세 사람이 다르게 어림한 수', '③74', (d) => {
      const k = d.int(3, 9) * 1000, who = pickNames(d, 3);
      const [n, kinds] = d.pick([[k - d.int(1, 49), [['up', 1000], ['down', 100], ['half', 100]]], [k + d.int(1, 49), [['up', 1000], ['down', 100], ['half', 100]]], [k + d.int(51, 99), [['down', 1000], ['half', 1000], ['up', 100]]]]);
      const order = d.shuffle(kinds), vals = order.map(([m, p]) => DO[m](n, p)), exprs = order.map(([m, p]) => X[m](n, p));
      return C(`${josa(n, '을/를')} 세 사람이 다음과 같이 어림하여 나타내었다. 어림한 수가 나머지 두 사람과 다른 사람은?`, who, vals.findIndex((v) => vals.filter((x) => x === v).length === 1), {
        figure: lines(order.map(([m, p], i) => `${who[i]}: ${to(m, p)} 나타낸다.`)), explain: order.map(([m, p], i) => `${who[i]} ${vals[i]}`).join(', ') + '이다.', facts: chooseF(exprs, [n], { rule: 'odd' })
      });
    }),
    T('mix-nearest', '실제 값에 가장 가까운 어림', '③75', (d) => {
      const n = d.until(() => pickNum(d, [1, 9], [1, 8], [5, 9], [0, 9]), (v) => v % 100 !== 50), order = d.shuffle([['up', 1000], ['down', 100], ['half', 100]]), vals = order.map(([m, p]) => DO[m](n, p)), gaps = vals.map((v) => Math.abs(v - n));
      return C(`어느 공연의 관람객은 ${n}명이다. 관람객 수를 다음과 같이 어림하였을 때 실제 관람객 수와 가장 가까운 것은?`, LABELS.slice(0, 3), gaps.indexOf(Math.min(...gaps)), {
        figure: tagged(order.map(([m, p]) => `${to(m, p)} 나타낸 수`)), explain: vals.map((v, i) => `${LABELS[i]} ${v}`).join(', ') + `이다. ${josa(n, '과/와')}의 차가 가장 작은 것은 반올림한 ${DO.half(n, 100)}이다.`, facts: chooseF(order.map(([m, p]) => X[m](n, p)), [n], { rule: 'nearest', target: n })
      });
    }),
    T('mix-cards', '수 카드로 만든 수를 어림하기', '①63 ②66 ③79 심45', (d) => {
      const digits = some(d, [1, 2, 3, 4, 5, 6, 7, 8, 9], 4), [word, m, desc] = d.pick([['가장 큰', 'down', true], ['가장 작은', 'up', false], ['가장 큰', 'half', true]]);
      const sorted = digits.slice().sort((x, y) => (desc ? y - x : x - y)), n = num(sorted), expr = `(${sorted[0]}*1000+${sorted[1]}*100+${sorted[2]}*10+${sorted[3]})`;
      return N(`수 카드 4장을 한 번씩만 사용하여 만들 수 있는 ${word} 네 자리 수를 ${to(m, 100)} 나타내면?`, DO[m](n, 100), {
        figure: cards(digits), explain: `${word} 네 자리 수는 ${n}이다. ${why(m, n, 100)}`, facts: calcF([[X[m](expr, 100), 0]], digits)
      });
    })
  ]);

  // ── 어림하기 전의 수 ─────────────────────────────────────────
  B.addTypes(U, 'back', [
    T('back-dn-max', '버림하면 주어진 수가 되는 가장 큰 자연수', '①59 ②60 ③53 심52', (d) => {
      const t = pickNum(d, [1, 9], [1, 9]) * 100;
      return N(`버림하여 백의 자리까지 나타내면 ${josa(t, '이/가')} 되는 자연수 중 가장 큰 수는?`, t + 99, { explain: `백의 자리 아래 수를 버려서 ${josa(t, '이/가')} 되는 수는 ${t}부터 ${t + 99}까지이다. ${josa(t + 100, '은/는')} 버림하면 ${t + 100}이다.`, facts: { range: { ineq: `(x-x%100)<${t + 1}`, lo: t, hi: t + 200, want: 'max' } } });
    }),
    T('back-up-min', '올림하면 주어진 수가 되는 가장 작은 자연수', '①59 ②60 ③54 심52', (d) => {
      const t = pickNum(d, [1, 9], [1, 9]) * 100;
      return N(`올림하여 백의 자리까지 나타내면 ${josa(t, '이/가')} 되는 자연수 중 가장 작은 수는?`, t - 99, { explain: `백의 자리 아래 수를 올려서 ${josa(t, '이/가')} 되는 수는 ${t - 99}부터 ${t}까지이다. ${josa(t - 100, '은/는')} 올림하여도 ${t - 100}이다.`, facts: { range: { ineq: `(x+99-(x+99)%100)>${t - 1}`, lo: t - 200, hi: t, want: 'min' } } });
    }),
    T('back-rd-min', '반올림하면 주어진 수가 되는 가장 작은 자연수', '①60 ②60 ③55 심53', (d) => {
      const t = pickNum(d, [1, 9], [0, 9], [1, 9]) * 10;
      return N(`반올림하여 십의 자리까지 나타내면 ${josa(t, '이/가')} 되는 자연수 중 가장 작은 수는?`, t - 5, { explain: `일의 자리 숫자가 5 이상이면 올린다. ${josa(t - 5, '은/는')} 올려서 ${t}, ${josa(t - 6, '은/는')} 버려서 ${josa(t - 10, '이/가')} 되므로 가장 작은 수는 ${t - 5}이다.`, facts: { range: { ineq: `(x+5-(x+5)%10)>${t - 1}`, lo: t - 20, hi: t, want: 'min' } } });
    }),
    T('back-range-line', '어림하면 주어진 수가 되는 수의 범위를 나타낸 수직선', '①61 ②59 심54', (d) => {
      const m = d.pick(['down', 'up']), t = pickNum(d, [1, 9], [1, 9]) * 10, ticks = [t - 10, t, t + 10];
      // 틀린 보기: 올림과 버림의 범위를 바꾼 것, ●와 ○를 바꾼 것
      const forms = d.shuffle([{ i: 1, j: 2, lo: 'ge', hi: 'lt' }, { i: 0, j: 1, lo: 'gt', hi: 'le' }, { i: 1, j: 2, lo: 'gt', hi: 'le' }, { i: 0, j: 1, lo: 'ge', hi: 'lt' }]);
      const fits = (f) => ints(t - 15, t + 15).every((v) => inside(v, { lo: f.lo, a: ticks[f.i], hi: f.hi, b: ticks[f.j] }) === (DO[m](v, 10) === t));
      return CT(`${KO[m]}하여 십의 자리까지 나타내면 ${josa(t, '이/가')} 되는 수의 범위를 수직선에 바르게 나타낸 것은?`, LABELS.map((label, i) => [label, fits(forms[i])]), true, {
        figure: stack(forms.map((f, i) => twoLine(ticks, f.i, f.j, f.lo, f.hi, LABELS[i]))),
        explain: m === 'down' ? `버림하여 ${josa(t, '이/가')} 되는 수는 ${t} 이상 ${t + 10} 미만인 수이다. ${t}에 ●, ${t + 10}에 ○로 표시한다.` : `올림하여 ${josa(t, '이/가')} 되는 수는 ${t - 10} 초과 ${t} 이하인 수이다. ${t - 10}에 ○, ${t}에 ●로 표시한다.`
      });
    }),
    T('back-count', '반올림하면 주어진 수가 되는 자연수의 개수', '②61', (d) => {
      const t = pickNum(d, [1, 9], [1, 9]) * 10;
      return N(`반올림하여 십의 자리까지 나타내면 ${josa(t, '이/가')} 되는 자연수는 모두 몇 개인가?`, 10, { unit: '개', explain: `일의 자리 숫자가 5 이상이면 올리고 4 이하이면 버린다. ${t - 5}부터 ${t + 4}까지의 자연수 10개이다.`, facts: { count: ints(t - 10, t + 10).map((v) => DO.half(v, 10) === t) } });
    }),
    T('back-digit-dn', '버림한 수를 보고 가려진 숫자 찾기', '①62 ②62 심50', (d) => {
      const a = d.int(1, 9), x = d.int(1, 9), rest = pickNum(d, [1, 9], [0, 9], [1, 9]), t = (a * 10 + x) * 1000, s = `${a}□${rest}`;
      return N(`다섯 자리 수 ${dj(s, '을/를')} 버림하여 천의 자리까지 나타내면 ${t}이다. □ 안에 알맞은 숫자는?`, x, { explain: `버림하면 천의 자리 아래 수만 0이 되고 천의 자리 숫자는 그대로이다. ${t}의 천의 자리 숫자가 ${x}이므로 □ 안의 숫자는 ${x}이다.`, facts: { digit: { template: `${t - 1}<(${s}-${s}%1000)<${t + 1}`, lo: 0, hi: 9, ask: 'min' } } });
    }),
    T('back-digit-up', '올림한 수를 보고 가려진 숫자 찾기', '①62 ②62 심50', (d) => {
      const a = d.int(1, 9), x = d.int(0, 8), rest = d.int(11, 99), t = (a * 10 + x + 1) * 100, s = `${a}□${rest}`;
      return N(`네 자리 수 ${dj(s, '을/를')} 올림하여 백의 자리까지 나타내면 ${t}이다. □ 안에 알맞은 숫자는?`, x, { explain: `백의 자리 아래 수 ${josa(rest, '을/를')} 올렸으므로 백의 자리 숫자가 1 커졌다. ${t}의 백의 자리 숫자가 ${x + 1}이므로 □ 안의 숫자는 ${x}이다.`, facts: { digit: { template: `${t - 1}<(${s}+100-1-(${s}+100-1)%100)<${t + 1}`, lo: 0, hi: 9, ask: 'min' } } });
    }),
    T('back-digit-rd', '반올림한 수를 보고 가려진 숫자의 범위 찾기', '①62 ②62 ③57 심50', (d) => {
      const abc = pickNum(d, [1, 9], [0, 9], [0, 8]), goesUp = d.bool(), t = abc * 10 + (goesUp ? 10 : 0), s = `${abc}□`;
      return N(`네 자리 수 ${s}를 반올림하여 십의 자리까지 나타내면 ${t}이다. □ 안에 들어갈 수 있는 숫자 중 가장 ${goesUp ? '작은' : '큰'} 수는?`, goesUp ? 5 : 4, {
        explain: goesUp ? `십의 자리 숫자가 1 커졌으므로 일의 자리에서 올린 것이다. □ 안에는 5, 6, 7, 8, 9가 들어갈 수 있고 가장 작은 수는 5이다.` : `십의 자리 숫자가 그대로이므로 일의 자리에서 버린 것이다. □ 안에는 0, 1, 2, 3, 4가 들어갈 수 있고 가장 큰 수는 4이다.`,
        facts: { digit: { template: `${t - 1}<(${s}+10/2-(${s}+10/2)%10)<${t + 1}`, lo: 0, hi: 9, ask: goesUp ? 'min' : 'max' } }
      });
    }),
    T('back-password', '어림한 수를 보고 처음 수 찾기', '①62 ②63 심50', (d) => {
      const m = d.pick(['up', 'half']), cd = m === 'up' ? d.int(11, 99) : d.int(51, 99), t = pickNum(d, [1, 9], [1, 9]) * 100 + 100, who = d.pick(NAMES), ans = t - 100 + cd;
      return N(`${who}의 사물함 비밀번호는 네 자리 수 □□${cd}이다. 이 수를 ${KO[m]}하여 백의 자리까지 나타내면 ${t}일 때 비밀번호는?`, ans, {
        explain: `백의 자리 아래 수 ${josa(cd, '을/를')} ${m === 'up' ? '올렸으므로' : '반올림하면 올리므로'} 백의 자리까지의 수는 ${t}보다 100 작은 ${t - 100}이었다. 비밀번호는 ${ans}이다.`, facts: calcF([[`${t}-100+${cd}`, 0]], [t, cd])
      });
    })
  ]);

  // ── 생활 속 올림, 버림, 반올림 ────────────────────────────────
  const tens = (d, lo, hi) => d.until(() => d.int(lo, hi), (v) => v % 10 !== 0);
  const hundreds = (d, lo, hi) => d.until(() => d.int(lo, hi), (v) => v % 100 !== 0);
  B.addTypes(U, 'use', [
    T('use-up-rides', '모두 태우는 데 필요한 횟수', '①66 ②71 ③61 심65', (d) => {
      const n = tens(d, 31, 98), ans = DO.up(n, 10) / 10;
      return N(`한 번에 10명까지 탈 수 있는 놀이 기구가 있다. 학생 ${n}명이 모두 타려면 놀이 기구를 적어도 몇 번 운행해야 하는가?`, ans, {
        unit: '번', explain: `10명씩 ${ans - 1}번 타면 ${n % 10}명이 남는다. 남은 ${n % 10}명도 타야 하므로 ${josa(n, '을/를')} 올림하여 ${DO.up(n, 10)}명으로 보고 ${ans}번 운행한다.`, facts: calcF([[`${X.up(n, 10)}/10`, 0]], [n, 10])
      });
    }),
    T('use-up-two-sizes', '한 수를 두 가지 묶음으로 모두 담기', '①66', (d) => {
      const n = d.until(() => d.int(2101, 8899), (v) => v % 100 !== 0), a = DO.up(n, 100) / 100, b = DO.up(n, 1000) / 1000;
      return M(`구슬 ${n}개를 모두 담으려고 한다. 한 봉지에 100개씩 담을 때와 한 상자에 1000개씩 담을 때 봉지와 상자는 각각 적어도 몇 개 필요한가?`, [{ label: '봉지', answer: a, unit: '개' }, { label: '상자', answer: b, unit: '개' }], {
        explain: `남는 구슬도 담아야 하므로 올림한다. 100개씩 담으면 ${DO.up(n, 100)}개로 보아 ${a}봉지, 1000개씩 담으면 ${DO.up(n, 1000)}개로 보아 ${b}상자가 필요하다.`, facts: calcF([[`${X.up(n, 100)}/100`, 0], [`${X.up(n, 1000)}/1000`, 1]], [n, 100, 1000])
      });
    }),
    T('use-up-buy', '묶음으로만 살 때 사야 하는 수', '①66 ②70 ③60 심65', (d) => {
      const n = tens(d, 111, 398);
      return N(`학생 ${n}명에게 공책을 한 권씩 나누어 주려고 한다. 공책을 10권씩 묶음으로만 판다면 공책을 적어도 몇 권 사야 하는가?`, DO.up(n, 10), {
        unit: '권', explain: `${DO.down(n, 10)}권을 사면 ${n % 10}권이 모자란다. 모자라지 않게 ${josa(n, '을/를')} 올림하여 십의 자리까지 나타낸 ${DO.up(n, 10)}권을 산다.`, facts: calcF([[X.up(n, 10), 0]], [n, 10])
      });
    }),
    T('use-up-pay', '지폐로만 낼 때 내야 하는 돈', '①67 ②72 ③62', (d) => {
      const n = d.until(() => d.int(112, 889) * 100, (v) => v % 1000 !== 0);
      return M(`${n}원짜리 물건을 사려고 한다. 1000원짜리 지폐로만 낼 때와 10000원짜리 지폐로만 낼 때 내야 하는 돈은 각각 적어도 얼마인가?`, [{ label: '1000원짜리', answer: DO.up(n, 1000), unit: '원' }, { label: '10000원짜리', answer: DO.up(n, 10000), unit: '원' }], {
        explain: `모자라지 않게 내야 하므로 올림한다. 1000원짜리로는 ${DO.up(n, 1000)}원, 10000원짜리로는 ${DO.up(n, 10000)}원을 낸다.`, facts: calcF([[X.up(n, 1000), 0], [X.up(n, 10000), 1]], [n, 1000, 10000])
      });
    }),
    T('use-up-pay-count', '지폐로만 낼 때 필요한 지폐 수', '①67 ②72', (d) => {
      const n = d.until(() => d.int(112, 889) * 100, (v) => v % 10000 !== 0), ans = DO.up(n, 10000) / 10000;
      return N(`${n}원짜리 책을 10000원짜리 지폐로만 사려고 한다. 지폐를 적어도 몇 장 내야 하는가?`, ans, {
        unit: '장', explain: `${ans - 1}장으로는 ${(ans - 1) * 10000}원이라 모자란다. ${josa(n, '을/를')} 올림하여 ${DO.up(n, 10000)}원으로 보고 ${ans}장을 낸다.`, facts: calcF([[`${X.up(n, 10000)}/10000`, 0]], [n, 10000])
      });
    }),
    T('use-up-after-times', '값을 구한 뒤 지폐로만 내기', '①67 ②73 ③76', (d) => {
      const [p, k] = d.until(() => [d.int(8, 29) * 100, d.int(2, 4)], ([x, y]) => (x * y) % 1000 !== 0), cost = p * k;
      return N(`한 개에 ${p}원인 음료수 ${k}개를 사고 1000원짜리 지폐로만 값을 내려고 한다. 적어도 얼마를 내야 하는가?`, DO.up(cost, 1000), {
        unit: '원', explain: `음료수의 값은 ${p} × ${k} = ${cost}(원)이다. 모자라지 않게 올림하여 천의 자리까지 나타낸 ${DO.up(cost, 1000)}원을 낸다.`, facts: calcF([[X.up(`(${p}*${k})`, 1000), 0]], [p, k, 1000])
      });
    }),
    T('use-up-after-sum', '더한 뒤 모두 태우기', '②80 ③76', (d) => {
      const [a, b] = d.until(() => [d.int(61, 119), d.int(61, 119)], ([x, y]) => (x + y) % 10 !== 0 && x !== y), s = a + b, ans = DO.up(s, 10) / 10;
      return N(`5학년 ${a}명과 6학년 ${b}명이 한 척에 10명까지 탈 수 있는 배에 모두 타려고 한다. 배는 적어도 몇 척 필요한가?`, ans, {
        unit: '척', explain: `모두 ${a} + ${b} = ${s}(명)이다. 남는 사람도 타야 하므로 ${josa(s, '을/를')} 올림하여 ${DO.up(s, 10)}명으로 보면 ${ans}척이 필요하다.`, facts: calcF([[`${X.up(`(${a}+${b})`, 10)}/10`, 0]], [a, b, 10])
      });
    }),
    T('use-dn-sell', '묶어서 팔 수 있는 수', '①68 ②74 ③63 심69', (d) => {
      const n = hundreds(d, 1101, 8899);
      return N(`사탕 ${n}개를 한 상자에 100개씩 담아 팔려고 한다. 상자에 담아 팔 수 있는 사탕은 최대 몇 개인가?`, DO.down(n, 100), {
        unit: '개', explain: `100개가 안 되는 ${n % 100}개는 상자에 담아 팔 수 없다. ${josa(n, '을/를')} 버림하여 백의 자리까지 나타낸 ${DO.down(n, 100)}개를 팔 수 있다.`, facts: calcF([[X.down(n, 100), 0]], [n, 100])
      });
    }),
    T('use-dn-boxes', '묶어서 팔 수 있는 묶음 수', '①68 ②75 ③64 심69', (d) => {
      const n = tens(d, 211, 698), ans = DO.down(n, 10) / 10;
      return N(`귤 ${n}개를 한 봉지에 10개씩 담아 팔려고 한다. 팔 수 있는 귤은 최대 몇 봉지인가?`, ans, {
        unit: '봉지', explain: `10개가 안 되는 ${n % 10}개는 팔 수 없다. ${josa(n, '을/를')} 버림하여 ${DO.down(n, 10)}개로 보면 ${ans}봉지이다.`, facts: calcF([[`${X.down(n, 10)}/10`, 0]], [n, 10])
      });
    }),
    T('use-dn-ribbon-unit', '단위를 바꾸어 만들 수 있는 수 구하기', '①68 ②75 ③64 심69', (d) => {
      const n = hundreds(d, 311, 989), ans = DO.down(n, 100) / 100;
      return N(`선물 상자 한 개를 묶는 데 끈이 1 m 필요하다. 끈 ${n} cm로 묶을 수 있는 선물 상자는 최대 몇 개인가?`, ans, {
        unit: '개', explain: `1 m = 100 cm이다. 100 cm가 안 되는 ${n % 100} cm로는 상자를 묶을 수 없다. ${josa(n, '을/를')} 버림하여 ${DO.down(n, 100)} cm로 보면 ${ans}개이다.`, facts: calcF([[`${X.down(n, 100)}/100`, 0]], [n])
      });
    }),
    T('use-dn-exchange', '지폐로 바꿀 수 있는 돈', '①68 ②74 ③65 심69', (d) => {
      const n = d.until(() => d.int(1211, 6899) * 10, (v) => v % 1000 !== 0);
      return N(`저금통에 모은 동전 ${n}원을 1000원짜리 지폐로 바꾸려고 한다. 지폐로 바꿀 수 있는 돈은 최대 얼마인가?`, DO.down(n, 1000), {
        unit: '원', explain: `1000원이 안 되는 ${n % 1000}원은 지폐로 바꿀 수 없다. ${josa(n, '을/를')} 버림하여 천의 자리까지 나타낸 ${DO.down(n, 1000)}원을 바꿀 수 있다.`, facts: calcF([[X.down(n, 1000), 0]], [n, 1000])
      });
    }),
    T('use-dn-left', '모아서 묶고 남는 수', '①69 ②80', (d) => {
      const [a, b] = d.until(() => [d.int(311, 789), d.int(311, 789)], ([x, y]) => (x + y) % 100 !== 0 && x !== y), s = a + b;
      return M(`사과를 어제 ${a}개, 오늘 ${b}개 땄다. 이 사과를 모아 한 상자에 100개씩 담아 팔려고 한다. 팔 수 있는 사과는 최대 몇 상자이고, 상자에 담지 못하고 남는 사과는 몇 개인가?`, [{ label: '상자', answer: DO.down(s, 100) / 100, unit: '상자' }, { label: '남는 사과', answer: s % 100, unit: '개' }], {
        explain: `사과는 모두 ${a} + ${b} = ${s}(개)이다. ${josa(s, '을/를')} 버림하여 ${DO.down(s, 100)}개로 보면 ${DO.down(s, 100) / 100}상자이고, ${s % 100}개가 남는다.`, facts: calcF([[`${X.down(`(${a}+${b})`, 100)}/100`, 0], [`(${a}+${b})%100`, 1]], [a, b, 100])
      });
    }),
    T('use-rd-about', '실제 값에 가깝게 어림하기', '①71 ②76', (d) => {
      const n = d.until(() => d.int(11011, 68989), (v) => v % 100 !== 50 && v % 100 !== 0);
      return N(`어느 마을에 사는 사람은 ${n}명이다. 실제 사람 수와 가장 가깝게 어림하여 백의 자리까지 나타내면 몇 명인가?`, DO.half(n, 100), {
        unit: '명', explain: `실제 수와 가장 가깝게 어림하려면 반올림한다. ${why('half', n, 100)}`, facts: calcF([[X.half(n, 100), 0]], [n])
      });
    }),
    T('use-which-method', '상황에 알맞은 어림 방법', '①72 ②68 ③70 심63', (d, n) => {
      const names = ['올림', '버림', '반올림'];
      if (n === 0) {
        const k = tens(d, 31, 98);
        return CT(`달걀 ${k}개를 한 판에 10개씩 모두 담으려고 한다. 필요한 판의 수를 구하려면 달걀의 수를 어떻게 어림해야 하는가?`, names.map((w) => [w, w === '올림']), true, { explain: `10개가 안 되는 ${k % 10}개도 담아야 하므로 올림하여 ${DO.up(k, 10)}개로 본다. 판은 ${DO.up(k, 10) / 10}개 필요하다.` });
      }
      const k = hundreds(d, 311, 989);
      return CT(`색종이 ${k}장을 100장씩 묶어서 팔려고 한다. 팔 수 있는 색종이의 수를 구하려면 색종이의 수를 어떻게 어림해야 하는가?`, names.map((w) => [w, w === '버림']), true, { explain: `100장이 안 되는 ${k % 100}장은 묶어서 팔 수 없으므로 버림하여 ${DO.down(k, 100)}장으로 본다.` });
    }, { count: 2 }),
    T('use-method-done', '이미 어림한 일을 보고 방법 찾기', '③71', (d) => {
      const names = ['올림', '버림', '반올림'];
      if (d.bool()) {
        const p = d.until(() => d.int(11, 48) * 100, (v) => v % 1000 !== 0 && v % 1000 < 500), k = DO.up(p, 1000) / 1000;
        return CT(`${p}원짜리 공책을 사려고 1000원짜리 지폐 ${k}장을 냈다. 공책값을 어떻게 어림하여 돈을 낸 것인가?`, names.map((w) => [w, w === '올림']), true, { explain: `${p}원을 ${k * 1000}원으로 보았다. 천의 자리 아래 수 ${josa(p % 1000, '을/를')} 올린 것이므로 올림이다. 반올림하면 ${DO.half(p, 1000)}원이라 모자란다.` });
      }
      const n = d.until(() => d.int(21011, 68989), (v) => v % 10 >= 5);
      return CT(`수도 요금이 ${n}원 나왔는데 10원이 안 되는 돈은 받지 않아 ${DO.down(n, 10)}원을 냈다. 요금을 어떻게 어림한 것인가?`, names.map((w) => [w, w === '버림']), true, { explain: `십의 자리 아래 수 ${josa(n % 10, '을/를')} 버렸으므로 버림이다. 반올림하면 ${DO.half(n, 10)}원이다.` });
    }),
    T('use-rd-situation', '반올림으로 어림하는 경우', '③73 ①74', (d) => {
      const rows = d.shuffle([
        [`몸무게 ${d.int(31, 48)}.${d.int(1, 9)} kg을 1 kg 단위로 가까운 쪽의 눈금을 읽어 나타낼 때`, true],
        [`동전 ${d.int(21, 68) * 1000 + d.int(1, 9) * 100 + d.int(1, 9) * 10}원을 10000원짜리 지폐로 바꿀 때 바꿀 수 있는 돈`, false],
        [`학생 ${tens(d, 21, 38)}명에게 하나씩 줄 지우개를 10개 묶음으로만 살 때 사야 하는 수`, false],
        [`끈 ${hundreds(d, 311, 989)} cm를 1 m씩 잘라 상자를 묶을 때 묶을 수 있는 상자의 수`, false]
      ]);
      return CT('반올림으로 어림해야 하는 경우는?', LABELS.map((label, i) => [label, rows[i][1]]), true, { figure: tagged(rows.map((row) => row[0])), explain: '가까운 쪽의 눈금을 읽는 것은 반올림이다. 지폐로 바꿀 수 있는 돈과 묶을 수 있는 상자의 수는 버림, 모자라지 않게 사야 하는 수는 올림으로 구한다.' });
    }),
    T('use-odd-method', '어림 방법이 다른 경우', '①74 ②69 ③72 심64', (d) => {
      const money = () => d.until(() => d.int(112, 489) * 100, (v) => v % 1000 !== 0);
      const UP = [`${money()}원짜리 물건을 사면서 1000원짜리 지폐로만 낼 때 내야 하는 돈`, `학생 ${tens(d, 31, 98)}명이 한 번에 10명까지 타는 배에 모두 탈 때 배가 다녀야 하는 횟수`, `공책 ${tens(d, 111, 398)}권이 필요할 때 10권씩 묶음으로만 파는 공책을 사야 하는 수`];
      const DOWN = [`동전 ${money()}원을 1000원짜리 지폐로 바꿀 때 바꿀 수 있는 돈`, `달걀 ${hundreds(d, 1101, 4899)}개를 100개씩 상자에 담아 팔 때 팔 수 있는 달걀의 수`, `끈 ${hundreds(d, 311, 989)} cm를 1 m씩 잘라 상자를 묶을 때 묶을 수 있는 상자의 수`];
      const oddUp = d.bool(), rows = d.shuffle(some(d, oddUp ? DOWN : UP, 2).map((s) => [s, false]).concat([[d.pick(oddUp ? UP : DOWN), true]]));
      return CT('어림하는 방법이 나머지 둘과 다른 경우는?', LABELS.slice(0, 3).map((label, i) => [label, rows[i][1]]), true, {
        figure: tagged(rows.map((row) => row[0])), explain: `모자라지 않게 내거나 모두 태우거나 사야 할 때는 올림, 지폐로 바꾸거나 묶어서 팔거나 만들 때는 버림으로 구한다. ${LABELS[rows.findIndex((row) => row[1])]}만 ${oddUp ? '올림' : '버림'}이고 나머지는 ${oddUp ? '버림' : '올림'}이다.`
      });
    })
  ]);

  // ── 실력 문제 ────────────────────────────────────────────────
  B.addGroup(U, {
    id: 'hard', title: '단원 종합', standard: RANGE,
    types: [
      // ㉮ 상황·수·그림에 함정이 있어 뜻을 정확히 대야 풀리는 문제
      H('hd-fee-mixed', '이상·이하·초과·미만이 섞인 요금표와 경계 나이', '28·31', (d) => {
        // 가족의 나이는 모두 구간의 경계나 그 바로 옆이다(64·65세, 18·19세, 12·13세, 6·7세).
        const fees = d.pick([[1500, 2000, 3000], [1000, 2500, 4000], [2000, 3000, 5000]]), rows = [{ lo: 'ge', a: 7, hi: 'le', b: 12 }, { lo: 'gt', a: 12, hi: 'lt', b: 19 }, { lo: 'ge', a: 19, hi: 'lt', b: 65 }];
        const ages = [d.pick([64, 65]), d.int(36, 49), d.pick([18, 19]), d.pick([12, 13]), d.pick([6, 7])], feeOf = (age) => { const at = rows.findIndex((row) => inRow(age, row)); return at < 0 ? 0 : fees[at]; }, paid = ages.map(feeOf), total = paid.reduce((s, v) => s + v, 0);
        return N(`어느 식물원의 입장료이다. 7세 미만과 65세 이상은 입장료를 내지 않는다. 나이가 ${ages.join('세, ')}세인 가족 5명의 입장료는 모두 얼마인가?`, total, {
          unit: '원', figure: table(['나이', '입장료'], rows.map((row, i) => [rowText(row, '세'), `${fees[i]}원`])),
          explain: ages.map((age, i) => `${age}세 ${paid[i] ? paid[i] + '원' : '0원'}`).join(', ') + `이다. 모두 ${total}원이다.`, facts: calcF([[paid.filter((v) => v > 0).join('+'), 0]], fees)
        });
      }),
      H('hd-cannot-ride', '탈 수 없는 기준에서 탈 수 있는 사람 수', '4', (d) => {
        const a = d.pick([120, 125, 130]), b = a + d.pick([30, 35, 40]), who = pickNames(d, 6), k = () => d.int(1, 9);
        const hs = d.shuffle([String(a), String(b), `${a}.${k()}`, String(b - d.int(1, 9)), String(a - d.int(2, 9)), d.bool() ? String(a + d.int(5, 20)) : `${b}.${k()}`]), can = (h) => !(Number(h) <= a) && !(Number(h) >= b), hit = who.filter((_, i) => can(hs[i]));
        return N(`키가 ${a} cm 이하이거나 ${b} cm 이상인 사람은 탈 수 없는 놀이 기구가 있다. 학생 6명 가운데 이 놀이 기구를 탈 수 있는 학생은 모두 몇 명인가?`, hit.length, {
          unit: '명', figure: listTable(['이름', '키(cm)'], who.map((w, i) => [w, hs[i]])), explain: `탈 수 있는 키는 ${a} cm 초과 ${b} cm 미만이다. 키가 ${a} cm인 학생과 ${b} cm인 학생은 탈 수 없다. 탈 수 있는 학생은 ${hit.join(', ')}이다.`, facts: { count: hs.map(can) }
        });
      }),
      H('hd-line-count', '●와 ○가 섞인 수직선의 범위에 드는 자연수의 개수', '21', (d) => {
        const [lo, hi] = d.pick(COMBOS.slice(1)), a = d.int(12, 80), b = a + d.int(4, 6), r = { lo, a, hi, b }, list = ints(a, b).filter((v) => inside(v, r));
        return N('수직선에 나타낸 수의 범위에 포함되는 자연수는 모두 몇 개인가?', list.length, {
          unit: '개', figure: twoLine(ints(a - 1, b + 1), 1, b - a + 1, lo, hi), explain: `수직선은 ${two(r)}인 수를 나타낸다. ○로 표시한 수는 포함되지 않는다. 범위에 포함되는 자연수는 ${list.join(', ')}이다.`, facts: { count: ints(a - 1, b + 1).map((v) => inside(v, r)) }
        });
      }),
      H('hd-two-lines', '두 수직선의 범위에 모두 드는 자연수', '24', (d) => {
        const a = d.int(12, 80), c = a + d.int(2, 3), b = c + d.int(2, 3), e = b + d.int(2, 3), ticks = ints(a, e), r1 = { lo: d.pick(['ge', 'gt']), a, hi: d.pick(['le', 'lt']), b }, r2 = { lo: d.pick(['ge', 'gt']), a: c, hi: d.pick(['le', 'lt']), b: e };
        const list = ticks.filter((v) => inside(v, r1) && inside(v, r2));
        return N('두 수직선 ㉠, ㉡에 나타낸 수의 범위에 모두 포함되는 자연수는 몇 개인가?', list.length, {
          unit: '개', figure: stack([twoLine(ticks, 0, b - a, r1.lo, r1.hi, LABELS[0]), twoLine(ticks, c - a, e - a, r2.lo, r2.hi, LABELS[1])]),
          explain: `㉠은 ${two(r1)}인 수, ㉡은 ${two(r2)}인 수이다. 두 범위에 모두 드는 수는 ${c} ${W[r2.lo]} ${b} ${W[r1.hi]}인 수이고, 이 범위의 자연수는 ${list.join(', ')}이다.`, facts: { count: ticks.map((v) => inside(v, r1) && inside(v, r2)) }
        });
      }),
      H('hd-pay-range', '내지 않는 범위에서 내는 범위 말하기', '26', (d) => {
        const a = d.pick([5, 6, 7]), b = d.pick([65, 70]), pays = (v) => !(v <= a) && !(v >= b);
        // 보기: 이상–이하(「이하·이상」의 낱말을 그대로 옮긴 아이), 초과–이하·이상–미만(한쪽 끝만 뒤집은 아이), 초과–미만(정답)
        return CT(`나이가 ${a}세 이하이거나 ${b}세 이상이면 입장료를 내지 않는 미술관이 있다. 입장료를 내는 나이의 범위는?`, d.shuffle(COMBOS.map(([lo, hi]) => [two({ lo, a, hi, b }, '세'), ints(0, 100).every((v) => inside(v, { lo, a, hi, b }) === pays(v))])), true, {
          explain: `${a}세는 내지 않으므로 내는 나이는 ${a}세 초과이고, ${b}세도 내지 않으므로 ${b}세 미만이다. 「이하」의 나머지는 「초과」, 「이상」의 나머지는 「미만」이다.`
        });
      }),
      HR('hd-up-deci-zero', '바로 아래 자리 숫자가 0인 소수의 올림', '36', (d) => {
        const n = deci(d.int(1, 40), d.int(0, 8), 0, d.int(1, 9)), t = fx(n, 3);
        return D(`${dj(t, '을/를')} 올림하여 소수 첫째 자리까지 나타내면?`, dr('up', n, 3, 1).value, { explain: `소수 둘째 자리 숫자가 0이어도 소수 셋째 자리에 ${dj(String(n % 10), '이/가')} 있다. 소수 첫째 자리 아래 수가 0이 아니므로 올리면 ${dr('up', n, 3, 1).text}이다.`, facts: calcF([[XD('up', t, 3, 1), 0]], [t], { rule: 'zeroBelow' }) });
      }),
      HR('hd-rd-chain', '올린 수가 윗자리로 이어 넘어가는 반올림', '34 기본 ③43', (d) => {
        const n = pickNum(d, [1, 9], [9, 9], [9, 9], [5, 9]);
        return M(`${josa(n, '을/를')} 반올림하여 십의 자리까지, 백의 자리까지 나타내면?`, [{ label: '십의 자리까지', answer: DO.half(n, 10) }, { label: '백의 자리까지', answer: DO.half(n, 100) }], {
          explain: `일의 자리 숫자가 ${n % 10}이므로 올리면 십의 자리 9가 10이 되어 백의 자리, 천의 자리로 차례로 넘어간다. 십의 자리까지 나타내면 ${DO.half(n, 10)}이다. 십의 자리 숫자가 9이므로 백의 자리까지 나타내어도 ${DO.half(n, 100)}이다.`, facts: calcF([[X.half(n, 10), 0], [X.half(n, 100), 1]], [n], { rule: 'chain' })
        });
      }),
      HR('hd-rd-twice', '거듭 반올림한 잘못', '기본 ②55', (d) => {
        const n = deci(d.int(1, 40), d.int(1, 8), 4, d.int(5, 9)), t = fx(n, 3), who = d.pick(NAMES), right = dr('half', n, 3, 1), step = dr('half', n, 3, 2), wrong = fx(Math.floor(n / 100) + 1, 1);
        return D(`${dj(t, '을/를')} 반올림하여 소수 첫째 자리까지 나타내려고 한다. ${name(who, '은/는')} 먼저 소수 둘째 자리까지 나타내어 ${dj(step.text, '을/를')} 얻고, 이 수를 다시 반올림하여 ${dj(wrong, '이라고/라고')} 답하였다. 바르게 구한 답은?`, right.value, {
          explain: `반올림은 구하려는 자리 바로 아래 자리의 숫자만 본다. ${t}의 소수 둘째 자리 숫자가 4이므로 버리면 ${right.text}이다. 아래 자리부터 거듭 반올림하면 안 된다.`, facts: calcF([[XD('half', t, 3, 1), 0]], [t])
        });
      }),
      HR('hd-box-vs-sell', '모두 담는 상자 수와 팔 수 있는 상자 수', '65·69', (d) => {
        const n = tens(d, 211, 698);
        return M(`귤 ${n}개를 한 상자에 10개씩 담으려고 한다. 귤을 모두 담는 데 필요한 상자 수와, 10개를 다 채운 상자만 팔 때 팔 수 있는 상자 수는?`, [{ label: '모두 담는 상자', answer: DO.up(n, 10) / 10, unit: '상자' }, { label: '팔 수 있는 상자', answer: DO.down(n, 10) / 10, unit: '상자' }], {
          explain: `모두 담으려면 남는 ${n % 10}개도 담아야 하므로 올림하여 ${DO.up(n, 10) / 10}상자가 필요하다. 팔 때는 ${n % 10}개가 든 상자는 팔 수 없으므로 버림하여 ${DO.down(n, 10) / 10}상자를 판다.`, facts: calcF([[`${X.up(n, 10)}/10`, 0], [`${X.down(n, 10)}/10`, 1]], [n, 10])
        });
      }),
      HR('hd-same-two-places', '십의 자리까지와 백의 자리까지 반올림한 수가 같은 수', '43', (d) => {
        // 정답: 십의 자리가 9이고 일의 자리가 5 이상(이어 올라감)이거나, 십의 자리가 0이고 일의 자리가 4 이하(둘 다 버림)인 수
        // 보기: 십의 자리 5~8(백의 자리까지에서만 올라감), 몇십으로 끝나는 수(십의 자리까지는 그대로라고 고르는 아이), 십의 자리 9·일의 자리 4 이하(9를 보고 고르는 아이), 십의 자리 0·일의 자리 5 이상
        const right = d.bool() ? pickNum(d, [1, 8], [0, 8], [9, 9], [5, 9]) : pickNum(d, [1, 9], [1, 9], [0, 0], [1, 4]);
        const WRONG = [() => pickNum(d, [1, 9], [0, 8], [5, 8], [1, 9]), () => pickNum(d, [1, 9], [0, 9], [1, 4]) * 10, () => pickNum(d, [1, 9], [0, 8], [9, 9], [1, 4]), () => pickNum(d, [1, 9], [0, 9], [0, 0], [5, 9])];
        const list = d.until(() => d.shuffle([right].concat(some(d, WRONG, 3).map((make) => make()))), (xs) => new Set(xs).size === 4);
        return C('반올림하여 십의 자리까지 나타낸 수와 반올림하여 백의 자리까지 나타낸 수가 같은 것은?', list.map(String), list.indexOf(right), {
          explain: `${josa(right, '은/는')} 십의 자리까지 나타내어도, 백의 자리까지 나타내어도 ${DO.half(right, 100)}이다. 나머지는 ` + list.filter((v) => v !== right).map((v) => `${v} → ${DO.half(v, 10)}, ${DO.half(v, 100)}`).join(' / ') + '으로 서로 다르다.',
          facts: { claimed: list.map((n) => [X.half(n, 10), DO.half(n, 100)]), claimedWant: true }
        });
      }),
      HR('hd-back-digits-count', '자리 수가 정해진 수 가운데 어림하면 주어진 수가 되는 수', '기본 ②61', (d) => {
        const S = d.pick([{ m: 'half', p: 10, t: 100, digits: 3 }, { m: 'half', p: 100, t: 1000, digits: 4 }, { m: 'half', p: 10, t: 1000, digits: 4 }, { m: 'up', p: 10, t: 100, digits: 2 }, { m: 'up', p: 100, t: 1000, digits: 3 }]);
        const cand = ints(S.t - S.p, S.t + S.p), hit = cand.filter((v) => DO[S.m](v, S.p) === S.t && String(v).length === S.digits);
        return N(`${to(S.m, S.p)} 나타내면 ${josa(S.t, '이/가')} 되는 ${['', '', '두', '세', '네'][S.digits]} 자리 수는 모두 몇 개인가?`, hit.length, {
          unit: '개', explain: `${to(S.m, S.p)} 나타내면 ${josa(S.t, '이/가')} 되는 자연수는 ${S.m === 'half' ? `${S.t - S.p / 2}부터 ${S.t + S.p / 2 - 1}까지` : `${S.t - S.p + 1}부터 ${S.t}까지`}이다. 이 가운데 ${['', '', '두', '세', '네'][S.digits]} 자리 수는 ${hit[0]}부터 ${hit[hit.length - 1]}까지의 ${hit.length}개이다.`,
          facts: { count: cand.map((v) => DO[S.m](v, S.p) === S.t && String(v).length === S.digits) }
        });
      }),
      H('hd-digit-range', '자리 숫자의 범위로 가장 큰(작은) 수 만들기', '27 기본 ①21', (d) => {
        const a = d.int(1, 4), b = a + d.int(2, 4), c = d.int(0, 4), e = c + d.int(2, 4), [lo1, hi1] = d.pick(COMBOS.slice(1)), [lo2, hi2] = d.pick(COMBOS.slice(1)), big = d.bool();
        const tensDigit = big ? (hi1 === 'le' ? b : b - 1) : (lo1 === 'ge' ? a : a + 1), ones = big ? (hi2 === 'le' ? e : e - 1) : (lo2 === 'ge' ? c : c + 1);
        const expr = big ? `(${b}${hi1 === 'le' ? '' : '-1'})*10+${e}${hi2 === 'le' ? '' : '-1'}` : `(${a}${lo1 === 'ge' ? '' : '+1'})*10+${c}${lo2 === 'ge' ? '' : '+1'}`;
        return N(`십의 자리 숫자는 ${a} ${W[lo1]} ${b} ${W[hi1]}이고, 일의 자리 숫자는 ${c} ${W[lo2]} ${e} ${W[hi2]}인 두 자리 수 중 가장 ${big ? '큰' : '작은'} 수는?`, tensDigit * 10 + ones, {
          explain: big ? `십의 자리 숫자는 ${b} ${W[hi1]}이므로 가장 큰 숫자는 ${tensDigit}, 일의 자리 숫자는 ${e} ${W[hi2]}이므로 가장 큰 숫자는 ${ones}이다.` : `십의 자리 숫자는 ${a} ${W[lo1]}이므로 가장 작은 숫자는 ${tensDigit}, 일의 자리 숫자는 ${c} ${W[lo2]}이므로 가장 작은 숫자는 ${ones}이다.`,
          facts: calcF([[expr, 0]], big ? [b, e] : [a, c])
        });
      }),
      HR('hd-back-ends-self', '어림하여도 그대로인 수가 끝의 수가 되는 경우', '52', (d) => {
        const m = d.pick(['up', 'down']), t = pickNum(d, [1, 9], [1, 9]) * 10;
        return N(`${KO[m]}하여 십의 자리까지 나타내면 ${josa(t, '이/가')} 되는 자연수 중 가장 ${m === 'up' ? '큰' : '작은'} 수는?`, t, {
          explain: m === 'up' ? `${josa(t, '은/는')} 일의 자리가 0이라 올림하여도 ${t}이다. ${josa(t + 1, '은/는')} 올림하면 ${josa(t + 10, '이/가')} 되므로 가장 큰 수는 ${t}이다.` : `${josa(t, '은/는')} 일의 자리가 0이라 버림하여도 ${t}이다. ${josa(t - 1, '은/는')} 버림하면 ${josa(t - 10, '이/가')} 되므로 가장 작은 수는 ${t}이다.`,
          facts: { range: m === 'up' ? { ineq: `(x+9-(x+9)%10)<${t + 1}`, lo: t - 20, hi: t + 20, want: 'max' } : { ineq: `(x-x%10)>${t - 1}`, lo: t - 20, hi: t + 20, want: 'min' } }
        });
      }),
      H('hd-box-weight', '더한 무게가 경계에 걸리는 요금표', '30 기본 ②29', (d) => {
        const fees = d.pick([[4000, 5000, 6500], [3500, 4500, 6000], [3000, 4000, 5500]]), rows = [{ hi: 'le', b: 5 }, { lo: 'gt', a: 5, hi: 'le', b: 10 }, { lo: 'gt', a: 10, hi: 'le', b: 20 }], total = d.pick([5, 10, 20]), y = d.int(3, 8), x = total * 10 - y, at = rows.findIndex((row) => inRow(total, row));
        // 보기: 다음 칸의 요금(더한 무게가 「이하」에 들지 않는다고 본 아이), 그 밖의 칸
        return CT(`택배 요금이다. 무게가 ${fx(x, 1)} kg인 물건을 무게가 0.${y} kg인 상자에 담아 보내려고 한다. 내야 하는 요금은?`, fees.map((f, i) => [`${f}원`, i === at]), true, {
          figure: table(['무게', '요금'], rows.map((row, i) => [rowText(row, 'kg'), `${fees[i]}원`])), explain: `물건과 상자의 무게는 ${fx(x, 1)} + 0.${y} = ${total}(kg)이다. ${total} kg은 「${rowText(rows[at], 'kg')}」에 포함되므로 요금은 ${fees[at]}원이다.`
        });
      }),

      // ㉯ 두 번 넘게 생각해야 풀리는 문제
      H('hd-count-to-bound', '자연수의 개수로 경계의 수 찾기', '8', (d) => {
        const k = d.int(4, 9);
        if (d.bool()) return N(`□ 미만인 자연수는 모두 ${k}개이다. □ 안에 알맞은 자연수는?`, k + 1, { explain: `□ 미만인 자연수는 1부터 세어 ${k}개이므로 1, 2, …, ${k}이다. □는 포함되지 않으므로 ${k}보다 1 큰 ${k + 1}이다.`, facts: calcF([[`${k}+1`, 0]], [k]) });
        return N(`□ 이하인 두 자리 수는 모두 ${k}개이다. □ 안에 알맞은 자연수는?`, 9 + k, { explain: `두 자리 수는 10부터이다. 10부터 세어 ${k}개이면 ${ints(10, 9 + k).join(', ')}이고, □도 포함되므로 □는 ${9 + k}이다.`, facts: calcF([[`10+${k}-1`, 0]], [k]) });
      }),
      H('hd-line-end', '자연수의 개수로 수직선의 끝 수 찾기', '25', (d) => {
        const [lo, hi] = d.pick(COMBOS), a = d.int(12, 80), k = d.int(4, 7), first = lo === 'ge' ? a : a + 1, last = first + k - 1, ans = hi === 'le' ? last : last + 1;
        return N(`수직선에 나타낸 수의 범위에 포함되는 자연수는 모두 ${k}개이다. ㉠에 알맞은 자연수는?`, ans, {
          figure: rangeLine(['', String(a), '', '', '㉠', ''], { at: 1, on: lo === 'ge' }, { at: 4, on: hi === 'le' }),
          explain: `${a}에 ${lo === 'ge' ? '●' : '○'}로 표시했으므로 가장 작은 자연수는 ${first}이다. ${first}부터 ${k}개이면 가장 큰 자연수는 ${last}이다. ㉠에 ${hi === 'le' ? `●로 표시했으므로 ㉠은 ${last}이다.` : `○로 표시했으므로 ㉠은 ${last}보다 1 큰 ${ans}이다.`}`,
          facts: calcF([[`${a}${lo === 'ge' ? '' : '+1'}+${k}-1${hi === 'le' ? '' : '+1'}`, 0]], [a, k])
        });
      }),
      H('hd-find-limit', '결과를 보고 기준의 수 찾기', '10 기본 ①33', (d) => {
        if (d.bool()) {
          const t = d.pick([6, 7, 8]), ages = d.shuffle([t - 2, t - 1, t, t + 3, t + 6]);
          return N(`나이가 ${ages.join('세, ')}세인 어린이 5명이 놀이공원에 갔다. 「□세 미만은 입장료를 내지 않는다.」는 안내에 따라 ${t - 2}세와 ${t - 1}세인 어린이만 입장료를 내지 않았다. □ 안에 알맞은 자연수는?`, t, {
            explain: `${t - 1}세는 내지 않았으므로 □는 ${t - 1}보다 크다. ${t}세는 냈으므로 ${josa(t, '은/는')} □ 미만이 아니다. □는 ${t}이다.`, facts: calcF([[`${t - 1}+1`, 0]], [t - 1])
          });
        }
        const t = d.int(18, 30), list = d.shuffle([t + d.int(2, 6), t, t - 1, t - d.int(3, 6), t - d.int(7, 10)]), top = Math.max(...list);
        return N(`제기차기를 하여 ${list.join('번, ')}번을 찬 학생 5명 가운데 ${top}번과 ${t}번을 찬 학생만 상품을 받았다. 「□번 이상 찬 학생에게 상품을 준다.」의 □ 안에 알맞은 자연수는?`, t, {
          explain: `${t}번을 찬 학생은 받았으므로 □는 ${josa(t, '과/와')} 같거나 작다. ${t - 1}번을 찬 학생은 받지 못했으므로 □는 ${t - 1}보다 크다. □는 ${t}이다.`, facts: calcF([[`${t - 1}+1`, 0]], [t - 1])
        });
      }),
      H('hd-same-range', '같은 자연수의 범위를 다른 말로 나타내기', '23', (d) => {
        const [[lo1, hi1], [lo2, hi2]] = d.pick([[['gt', 'le'], ['ge', 'lt']], [['ge', 'lt'], ['gt', 'le']], [['gt', 'lt'], ['ge', 'le']], [['ge', 'le'], ['gt', 'lt']]]), a = d.int(12, 60), b = a + d.int(8, 20);
        const first = lo1 === 'gt' ? a + 1 : a, last = hi1 === 'le' ? b : b - 1, p = lo2 === 'ge' ? first : first - 1, q = hi2 === 'le' ? last : last + 1;
        return M(`「${a} ${W[lo1]} ${b} ${W[hi1]}인 자연수」와 「㉠ ${W[lo2]} ㉡ ${W[hi2]}인 자연수」는 같은 수들을 나타낸다. ㉠, ㉡에 알맞은 자연수는?`, [{ label: LABELS[0], answer: p }, { label: LABELS[1], answer: q }], {
          explain: `${a} ${W[lo1]} ${b} ${W[hi1]}인 자연수는 ${first}부터 ${last}까지이다. ${first}부터이므로 ${p} ${W[lo2]}, ${last}까지이므로 ${q} ${W[hi2]}이다.`,
          facts: calcF([[p === a ? `${a}` : p > a ? `${a}+1` : `${a}-1`, 0], [q === b ? `${b}` : q > b ? `${b}+1` : `${b}-1`, 1]], [a, b])
        });
      }),
      H('hd-two-rides', '두 기준을 함께 만족하는 범위', '기본 ①30', (d) => {
        const c = d.pick([110, 115, 120]), a = c + d.pick([5, 10]), e = a + d.pick([10, 15, 20]), b = e + d.pick([10, 20, 30]), r1 = { lo: d.pick(['ge', 'gt']), a, hi: d.pick(['le', 'lt']), b }, r2 = { lo: d.pick(['ge', 'gt']), a: c, hi: d.pick(['le', 'lt']), b: e };
        // 보기: 두 끝의 낱말을 서로 바꾸어 쓴 아이, 두 기구의 앞쪽(뒤쪽) 낱말을 그대로 옮긴 아이
        return CT(`키가 ${two(r1, 'cm')}인 사람만 타는 놀이 기구와 키가 ${two(r2, 'cm')}인 사람만 타는 놀이 기구가 있다. 두 놀이 기구를 모두 탈 수 있는 키의 범위는?`, d.shuffle(COMBOS.map(([lo, hi]) => [two({ lo, a, hi, b: e }, 'cm'), lo === r1.lo && hi === r2.hi])), true, {
          explain: `두 기구를 모두 타려면 ${a} cm ${W[r1.lo]}이면서 ${e} cm ${W[r2.hi]}이어야 한다. 아래 끝은 더 큰 쪽 ${a} cm의 기준을, 위 끝은 더 작은 쪽 ${e} cm의 기준을 따른다.`
        });
      }),
      HR('hd-round-then-count', '반올림한 값으로 기준에 드는 사람 세기', '기본 ②57', (d) => {
        const b = d.pick([35, 40, 45]), who = pickNames(d, 5);
        const ws = d.shuffle([(b - 1) * 10 + d.int(5, 9), (b - 1) * 10 + d.int(1, 4), b * 10 + d.int(1, 4), (b - 2) * 10 + d.int(5, 9), d.bool() ? (b + 1) * 10 + d.int(1, 9) : (b - 2) * 10 + d.int(1, 4)]), ok = (w) => DO.half(w, 10) / 10 >= b, hit = who.filter((_, i) => ok(ws[i]));
        return N(`학생 5명의 몸무게를 반올림하여 일의 자리까지 나타내었을 때 ${b} kg 이상인 학생은 모두 몇 명인가?`, hit.length, {
          unit: '명', figure: table(['이름', '몸무게(kg)'], who.map((w, i) => [w, fx(ws[i], 1)])), explain: `반올림하면 ${who.map((w, i) => `${w} ${DO.half(ws[i], 10) / 10}`).join(', ')}(kg)이다. ${b} kg과 같거나 무거운 학생은 ${hit.join(', ')}이다.`, facts: { count: ws.map(ok) }
        });
      }),
      HR('hd-back-rd-deci', '반올림하면 주어진 소수가 되는 수의 두 끝', '53', (d) => {
        const t = d.int(1, 30) * 10 + d.int(1, 9), tt = fx(t, 1);
        return M(`반올림하여 소수 첫째 자리까지 나타내면 ${dj(tt, '이/가')} 되는 소수 두 자리 수 중 가장 작은 수와 가장 큰 수는?`, [{ label: '가장 작은 수', answer: (t * 10 - 5) / 100, decimal: true }, { label: '가장 큰 수', answer: (t * 10 + 4) / 100, decimal: true }], {
          explain: `소수 둘째 자리 숫자가 5 이상이면 올리므로 가장 작은 수는 ${fx(t * 10 - 5, 2)}이다. 소수 둘째 자리 숫자가 4 이하이면 버리므로 가장 큰 수는 ${fx(t * 10 + 4, 2)}이다.`, facts: calcF([[`${tt}-0.05`, 0], [`${tt}+0.04`, 1]], [tt])
        });
      }),
      HR('hd-back-rd-range', '반올림하기 전 수의 범위', '54', (d) => {
        const t = pickNum(d, [1, 9], [1, 9]) * 100;
        return M(`어느 공연의 관람객 수를 반올림하여 백의 자리까지 나타내었더니 ${t}명이었다. 실제 관람객 수의 범위는 몇 명 이상 몇 명 미만인가?`, [{ answer: t - 50, unit: '명 이상' }, { answer: t + 50, unit: '명 미만' }], {
          explain: `${t - 50}명부터 올려서 ${t}명이 되고, ${t + 50}명은 올려서 ${t + 100}명이 된다. 실제 관람객 수는 ${t - 50}명 이상 ${t + 50}명 미만이다.`, facts: calcF([[`${t}-50`, 0], [`${t}+50`, 1]], [t])
        });
      }),
      HR('hd-prepare', '어림한 사람 수로 모자라지 않게 준비하기', '56 기본 ①75', (d) => {
        const t = d.pick([20, 30, 40]), k = d.int(2, 4);
        return N(`어느 반 학생 수를 반올림하여 십의 자리까지 나타내면 ${t}명이다. 학생이 몇 명이든 모자라지 않게 모든 학생에게 연필을 ${k}자루씩 주려면 연필은 적어도 몇 자루 있어야 하는가?`, (t + 4) * k, {
          unit: '자루', explain: `반올림하여 ${t}명이 되는 학생 수는 ${t - 5}명부터 ${t + 4}명까지이다. 가장 많은 ${t + 4}명에게 맞추면 ${t + 4} × ${k} = ${(t + 4) * k}(자루)이다.`, facts: calcF([[`(${t}+4)*${k}`, 0]], [t, k])
        });
      }),
      HR('hd-rides-range', '운행 횟수로 사람 수의 범위 구하기', '57 기본 ②82', (d) => {
        const k = d.int(6, 19);
        return M(`학생들이 한 번에 10명까지 탈 수 있는 놀이 기구를 모두 타려면 놀이 기구를 적어도 ${k}번 운행해야 한다. 학생 수의 범위는 몇 명 이상 몇 명 이하인가?`, [{ answer: 10 * (k - 1) + 1, unit: '명 이상' }, { answer: 10 * k, unit: '명 이하' }], {
          explain: `${k - 1}번으로는 ${10 * (k - 1)}명까지 탈 수 있으므로 학생은 ${10 * (k - 1) + 1}명 이상이다. ${k}번으로 ${10 * k}명까지 탈 수 있으므로 ${10 * k}명 이하이다.`, facts: calcF([[`10*(${k}-1)+1`, 0], [`10*${k}`, 1]], [10, k])
        });
      }),
      HR('hd-range-and-round', '수의 범위와 어림을 함께 만족하는 자연수', '59 기본 ③59', (d) => {
        const m = d.pick(METHODS), t = d.int(2, 8) * 10;
        const r = d.until(() => { const a = t + d.int(-12, 6); return { lo: d.pick(['ge', 'gt']), a, hi: d.pick(['le', 'lt']), b: a + d.int(7, 11) }; }, (x) => { const all = ints(x.a, x.b).filter((v) => inside(v, x)), hit = all.filter((v) => DO[m](v, 10) === t); return hit.length >= 2 && hit.length <= all.length - 2; });
        const cand = ints(r.a - 1, r.b + 1), hit = cand.filter((v) => inside(v, r) && DO[m](v, 10) === t);
        return N(`${two(r)}인 자연수 가운데 ${to(m, 10)} 나타내면 ${josa(t, '이/가')} 되는 수는 모두 몇 개인가?`, hit.length, {
          unit: '개', explain: `${to(m, 10)} 나타내면 ${josa(t, '이/가')} 되는 자연수는 ${m === 'down' ? `${t}부터 ${t + 9}까지` : m === 'up' ? `${t - 9}부터 ${t}까지` : `${t - 5}부터 ${t + 4}까지`}이다. 이 가운데 ${two(r)}인 수는 ${hit.join(', ')}이다.`, facts: { count: cand.map((v) => inside(v, r) && DO[m](v, 10) === t) }
        });
      }),
      HR('hd-buy-cost', '올림하여 산 뒤 값 구하기', '기본 ①70 ②78 ③77', (d) => {
        const n = hundreds(d, 211, 889), p = d.pick([800, 1200, 1500]), meters = DO.up(n, 100) / 100;
        return N(`선물을 포장하는 데 리본이 ${n} cm 필요하다. 리본은 1 m 단위로만 팔고 1 m의 값은 ${p}원이다. 리본을 사는 데 드는 돈은 적어도 얼마인가?`, meters * p, {
          unit: '원', explain: `1 m = 100 cm이다. 모자라지 않게 ${josa(n, '을/를')} 올림하여 ${DO.up(n, 100)} cm, 곧 ${meters} m를 사야 한다. ${p} × ${meters} = ${meters * p}(원)`, facts: calcF([[`${X.up(n, 100)}/100*${p}`, 0]], [n, p, 1])
        });
      }),
      HR('hd-sell-income', '버림하여 판 뒤 받는 돈 구하기', '71', (d) => {
        const n = tens(d, 61, 298), p = d.pick([3000, 4000, 5000]), bags = DO.down(n, 10) / 10;
        return N(`쿠키 ${n}개를 한 봉지에 10개씩 담아 한 봉지에 ${p}원씩 받고 팔려고 한다. 쿠키를 팔아서 받을 수 있는 돈은 최대 얼마인가?`, bags * p, {
          unit: '원', explain: `10개가 안 되는 ${n % 10}개는 팔 수 없으므로 ${josa(n, '을/를')} 버림하여 ${DO.down(n, 10)}개, 곧 ${bags}봉지를 판다. ${p} × ${bags} = ${bags * p}(원)`, facts: calcF([[`${X.down(n, 10)}/10*${p}`, 0]], [n, p, 10])
        });
      }),
      HR('hd-bracelets', '적은 쪽에 맞추어 만들고 모두 담기', '72', (d) => {
        const [a, b] = d.until(() => [d.int(1211, 1989), d.int(1211, 1989)], ([x, y]) => Math.abs(x - y) >= 30 && Math.min(x, y) % 10 !== 0 && Math.floor(Math.min(x, y) / 10) % 10 !== 0), low = Math.min(a, b), made = DO.down(low, 10) / 10, boxes = DO.up(made, 10) / 10;
        return M(`큰 구슬 10개와 작은 구슬 10개로 팔찌 한 개를 만든다. 큰 구슬 ${a}개와 작은 구슬 ${b}개로 팔찌를 될 수 있는 대로 많이 만들고, 만든 팔찌를 한 상자에 10개씩 모두 담으려고 한다. 만들 수 있는 팔찌 수와 필요한 상자 수는?`, [{ label: '팔찌', answer: made, unit: '개' }, { label: '상자', answer: boxes, unit: '개' }], {
          explain: `더 적은 구슬 ${low}개에 맞춘다. 10개가 안 되는 구슬로는 만들 수 없으므로 버림하여 ${made}개를 만든다. 팔찌 ${made}개를 모두 담으려면 올림하여 ${boxes}상자가 필요하다.`,
          facts: calcF([[`${X.down(low, 10)}/10`, 0], [`${X.up(`(${X.down(low, 10)}/10)`, 10)}/10`, 1]], [a, b, 10])
        });
      }),
      HR('hd-stamps', '따로 버림할 때와 모아서 버림할 때', '73', (d) => {
        const list = d.until(() => [0, 1, 2, 3].map(() => tens(d, 12, 48)), (xs) => new Set(xs).size === 4 && xs.reduce((s, v) => s + (v % 10), 0) >= 10), total = list.reduce((s, v) => s + v, 0), apart = list.reduce((s, v) => s + Math.floor(v / 10), 0), sumExpr = `(${list.join('+')})`;
        return M(`빈 병 10개를 모아 오면 칭찬 도장을 1개 찍어 준다. 네 사람이 모은 빈 병은 ${list.join('개, ')}개이다. 각자 따로 도장을 받을 때 네 사람이 받는 도장 수의 합과, 빈 병을 모두 모아서 받을 때의 도장 수는?`, [{ label: '따로 받을 때', answer: apart, unit: '개' }, { label: '모아서 받을 때', answer: Math.floor(total / 10), unit: '개' }], {
          explain: `따로 받으면 ${list.map((v) => Math.floor(v / 10)).join(' + ')} = ${apart}(개)이다. 모으면 빈 병이 ${total}개이므로 ${Math.floor(total / 10)}개이다. 따로 받을 때 버려지는 낱개가 모이면 10개가 넘는다.`,
          facts: calcF([[list.map((v) => `${X.down(v, 10)}/10`).join('+'), 0], [`${X.down(sumExpr, 10)}/10`, 1]], list.concat([10]))
        });
      }),
      HR('hd-two-shops', '묶음의 크기가 다른 두 가게의 값 비교', '74', (d) => {
        const [n, p, q] = d.until(() => [hundreds(d, 211, 689), d.pick([250, 300, 350]), d.pick([2300, 2500, 2800, 3200])], ([x, y, z]) => {
          const g = Math.abs(DO.up(x, 10) / 10 * y - DO.up(x, 100) / 100 * z), g2 = Math.abs(DO.down(x, 10) / 10 * y - DO.down(x, 100) / 100 * z); return x % 10 !== 0 && g > 0 && g2 > 0 && g !== g2;
        });
        const costs = [DO.up(n, 10) / 10 * p, DO.up(n, 100) / 100 * q], cheap = costs[0] < costs[1] ? 0 : 1, gap = Math.abs(costs[0] - costs[1]), gap2 = Math.abs(DO.down(n, 10) / 10 * p - DO.down(n, 100) / 100 * q);
        // 보기: 싼 가게를 거꾸로 고른 아이, 모자라는데도 버림하여 묶음 수를 센 아이
        const options = d.shuffle([[cheap, gap], [1 - cheap, gap], [cheap, gap2], [1 - cheap, gap2]]), shop = ['가', '나'];
        return C(`색종이 ${n}장이 필요하다. 가 가게는 10장 묶음을 ${p}원에, 나 가게는 100장 묶음을 ${q}원에 팔고, 두 가게 모두 묶음으로만 판다. 더 싸게 살 수 있는 가게와 두 가게에서 사는 값의 차를 바르게 쓴 것은?`, options.map(([who, g]) => `${shop[who]} 가게, ${g}원`), options.findIndex(([who, g]) => who === cheap && g === gap), {
          explain: `가 가게에서는 ${DO.up(n, 10)}장을 사야 하므로 ${DO.up(n, 10) / 10}묶음, ${costs[0]}원이다. 나 가게에서는 ${DO.up(n, 100)}장을 사야 하므로 ${DO.up(n, 100) / 100}묶음, ${costs[1]}원이다. ${shop[cheap]} 가게가 ${gap}원 더 싸다.`,
          facts: { who: { exprs: [`${X.up(n, 10)}/10*${p}`, `${X.up(n, 100)}/100*${q}`], values: costs, options, smaller: true }, unseen: unseenOf([`${X.up(n, 10)}/10*${p}`, `${X.up(n, 100)}/100*${q}`], [n, p, q, 10, 100]) }
        });
      })
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
