// 4학년 1학기 1단원 큰 수 — 단원 틀과 기본 문항(만, 다섯 자리 수, 천만까지, 억, 조).
// 수집해 둔 교과서 8종의 평가 자료(단원평가·형성평가·수학익힘·수행평가)에서 뽑은 문제 꼴 목록(기본꼴 1~3: 148·126·130꼴, 심화꼴 72꼴)과
// 꼴 목록을 만들 때 빠졌던 문서 뒷부분(덧문서)을 처음부터 끝까지 대조하여, 꼴마다 ① 몇 학년 무슨 단원 내용인가 ② 무엇을 하게 하는 문제인가를 따져서 실었다.
// (천재 박만구의 자료는 2단원 폴더에서 가져왔다. 뛰어 세기·크기 비교·수 만들기의 문항과 실력 문항은 4-1-1b.js에 있다.)
//
// 싣는 기준
//  - 하는 일이 다르면 다른 문제다. 같은 물음이라도 수의 크기(다섯 자리, 천만까지, 억, 조)가 다르면 차시가 달라 따로 싣고 facts.rule 에 그 이름을 단다.
//  - 숫자만 다르거나 상황만 다른 것은 한 번만 싣는다(자리마다 9개까지인 물건값의 합은 「자리마다 몇 개인 수」와,
//    10000원을 1000원짜리 지폐·100원짜리 동전으로 바꾸기(기본 ①10 ③7)는 「10000은 몇이 몇 개인 수」와 같은 문제).
//  - 색칠하기·수직선에 나타내기(작도), 다른 방법으로 설명하기·비교한 까닭 쓰기(서술형), 큰 수 찾아 조사하기·놀이는 싣지 않는다.
//  - 뜻 없는 셈(두 숫자가 나타내는 값의 합, 빈칸의 수끼리 더하기)은 싣지 않는다.
//  - t을 kg으로 바꾸어 남은 양(기본 ③9)은 3학년 2학기 「들이와 무게」의 단위 바꾸기가 어려움의 대부분이라 뺐다.
//  - 수직선에서 가장 가까운 수(기본 ②29)는 뽑은 글에 그림이 없어 모양을 알 수 없다.
// 수는 9000조를 넘기지 않는다(그보다 큰 수는 정확히 담지 못한다). 묻는 말: 수나 값을 물을 때는 "~은?/~는?", 양을 물을 때는 "몇 ~인가?" 로 맺는다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { LABELS, box, lines, numbers, chain, josa, say, cut, named, N, M, C } = B.kit;
  const NUM = '4수01-01', ORDER = '4수01-02';
  const T = (id, title, ref, make, more) => Object.assign({ id, level: '기본', title, source: '수집본 기본 자료(' + ref + ')', make }, more || {});
  const PLACES = ['일', '십', '백', '천', '만', '십만', '백만', '천만', '억', '십억', '백억', '천억', '조', '십조', '백조', '천조'];
  const pow = (k) => Number('1e' + k);
  const big = (jo, eok, man, one) => jo * 1e12 + eok * 1e8 + man * 1e4 + (one || 0);
  const digitAt = (n, k) => Math.floor(n / pow(k)) % 10;
  const dx = (n, k) => `((${n}-${n}%${pow(k)})/${pow(k)})%10`;      // 검사가 자리 숫자를 다시 셈하는 식
  const vx = (n, k) => `(${dx(n, k)})*${pow(k)}`;                   // 그 숫자가 나타내는 값
  const uniq = (d, len) => d.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, len);
  const toNum = (digits) => digits.reduce((n, v) => n * 10 + v, 0);
  // len 자리 수: 10^k 자리에만 숫자 t 가 있고 나머지 자리는 t 가 아닌(0도 아닌) 숫자이다. 열여섯 자리 수는 맨 앞을 8까지만 쓴다.
  function withDigit(d, len, t, k) {
    let n = 0;
    for (let i = len - 1; i >= 0; i -= 1) n = n * 10 + (i === k ? t : d.until(() => d.int(1, i === 15 ? 8 : 9), (v) => v !== t));
    return n;
  }
  const said = (n) => '「' + say(n) + '」' + josa(say(n), '이라고/라고').slice(say(n).length);
  const quote = (text) => lines([text]);
  const truthOf = (rows, want) => ({ truth: rows.map((row) => row[1]), want });

  B.addUnit({
    id: '4-1-1', grade: 4, semester: 1, no: 1, title: '큰 수', version: 1,
    groups: [
      {
        id: 'man', title: '만', standard: NUM,
        types: [
          T('man-thousands', '1000이 10개인 수', '①1 ②1 ③1', (d) => {
            const rows = d.shuffle([['10000, 만', true], ['1000, 천', false], ['100000, 십만', false], ['10000, 천만', false]]);
            return C('1000이 10개인 수를 바르게 쓰고 읽은 것은?', rows.map((row) => row[0]), rows.findIndex((row) => row[1]), { explain: '1000이 10개인 수는 10000이라 쓰고, 만이라고 읽는다.', facts: truthOf(rows, true) });
          }),
          T('man-more', '10000은 어떤 수보다 얼마 큰 수', '①2 ②2 ③2', (d) => {
            const gap = d.pick([1, 10, 100, 1000]);
            return N(`10000은 ${10000 - gap}보다 얼마 큰 수인가?`, gap, { explain: `${10000 - gap}보다 ${gap} 큰 수가 10000이다.`, facts: { calc: [[`10000-${10000 - gap}`, 0]] } });
          }),
          T('man-less', '10000보다 얼마 작은 수', '③3', (d) => {
            const gap = d.pick([1, 10, 100, 1000]);
            return N(`10000보다 ${gap} 작은 수는?`, 10000 - gap, { explain: `${10000 - gap}보다 ${gap} 큰 수가 10000이므로 10000보다 ${gap} 작은 수는 ${10000 - gap}이다.`, facts: { calc: [[`10000-${gap}`, 0]] } });
          }),
          T('man-count', '10000은 몇이 몇 개인 수', '①4', (d) => {
            const unit = d.pick([10, 100]);
            return N(`10000은 ${josa(unit, '이/가')} 몇 개인 수인가?`, 10000 / unit, { unit: '개', explain: `${josa(unit, '이/가')} ${10000 / unit}개이면 10000이다.`, facts: { calc: [[`10000/${unit}`, 0]] } });
          }),
          T('man-chain', '10배씩 커지는 수', '①5 ②9', () => N('10배씩 커지는 수를 차례로 쓴 것이다. 빈칸에 알맞은 수는?', 10000, {
            figure: chain(['10', '×10', '100', '×10', '1000', '×10', box()]), explain: '1000의 10배는 10000이다.', facts: { calc: [['1000*10', 0]] }
          })),
          T('man-say', '10000에 대한 설명', '①6 ②3 ③6 심1', (d) => {
            const rows = d.shuffle([['9999보다 1 큰 수이다.', true], ['1000이 10개인 수이다.', true], ['100이 100개인 수이다.', true], ['9000보다 100 큰 수이다.', false]]);
            return C('10000을 잘못 설명한 것은?', rows.map((row) => row[0]), rows.findIndex((row) => !row[1]), { explain: '9000보다 1000 큰 수가 10000이다. 9000보다 100 큰 수는 9100이다.', facts: truthOf(rows, false) });
          }),
          T('man-odd', '10000을 나타내는 것이 아닌 것', '①7', (d) => {
            const rows = d.shuffle([['1000이 10개인 수', '1000*10'], ['9990보다 10 큰 수', '9990+10'], ['9900보다 100 큰 수', '9900+100'], ['100이 10개인 수', '100*10']]);
            return C('10000을 나타내는 것이 아닌 것은?', rows.map((row) => row[0]), rows.findIndex((row) => row[1] === '100*10'), { explain: '100이 10개인 수는 1000이다. 나머지는 모두 10000을 나타낸다.', facts: { big: { odd: rows.map((row) => row[1]) } } });
          }),
          T('man-need', '10000원이 되려면 더 필요한 돈', '①9 ②5 ③8 심4', (d) => {
            const have = d.int(12, 97) * 100;
            return N(`저금통에 ${have}원이 있다. 10000원이 되려면 얼마가 더 있어야 하는가?`, 10000 - have, { unit: '원', explain: `10000 - ${have} = ${10000 - have}`, facts: { calc: [[`10000-${have}`, 0]] } });
          }),
          T('man-need-sum', '두 번 모은 돈으로 10000원까지 모자란 돈', '②6', (d) => {
            const a = d.int(3, 6) * 1000, b = d.int(1, 3) * 1000 + d.int(1, 9) * 100;
            return N(`지난달에 ${a}원, 이번 달에 ${b}원을 모았다. 10000원이 되려면 얼마를 더 모아야 하는가?`, 10000 - a - b, { unit: '원', explain: `모은 돈은 ${a} + ${b} = ${a + b}(원)이다. 10000 - ${a + b} = ${10000 - a - b}`, facts: { calc: [[`10000-(${a}+${b})`, 0]] } });
          }),
          T('man-pair', '합이 10000이 되는 두 수', '①11 심2', (d) => {
            const a = d.int(2, 8) * 1000 + 500, b = 10000 - a, rows = d.shuffle([[a, b], [a, b + 1000], [a, b - 1000], [a + 1000, b + 1000]]);
            return C('두 수의 합이 10000이 되는 것은?', rows.map(([x, y]) => `${x}, ${y}`), rows.findIndex(([x, y]) => x + y === 10000), { explain: `${a} + ${b} = 10000`, facts: { choose: { exprs: rows.map(([x, y]) => `${x}+${y}`), rule: 'equals', target: 10000 } } });
          }),
          T('man-row', '10000까지 뛰어 세기', '①3 ②4 ③4·5', (d) => {
            const step = d.pick([1, 10, 100, 1000]), list = [3, 2, 1].map((k) => 10000 - step * k);
            return N('규칙에 따라 수를 늘어놓았다. 빈칸에 알맞은 수는?', 10000, { figure: numbers(list.map(String).concat([box()])), explain: `${step}씩 커지는 규칙이다. ${10000 - step}보다 ${step} 큰 수는 10000이다.`, facts: { calc: [[`${list[2]}+${list[2]}-${list[1]}`, 0]] } });
          }),
          T('man-coins', '가진 돈으로 10000원까지 더 필요한 돈', '②7 ③10·11 심6', (d) => {
            // 100원짜리 동전이 10개를 넘는다
            const bills = d.int(5, 8), coins = d.int(11, 19), have = bills * 1000 + coins * 100;
            return N(`1000원짜리 지폐 ${bills}장과 100원짜리 동전 ${coins}개가 있다. 10000원이 되려면 얼마가 더 있어야 하는가?`, 10000 - have, { unit: '원', explain: `가진 돈은 ${bills * 1000} + ${coins * 100} = ${have}(원)이다. 10000 - ${have} = ${10000 - have}`, facts: { calc: [[`10000-(1000*${bills}+100*${coins})`, 0]] } });
          }),
          T('man-near', '10000에 가장 가까운 수', '심3', (d) => {
            // 자리 수가 같은 수(구천몇백)가 더 가깝다고 여기는 아이가 있다
            const s = d.int(1, 4) * 10, side = d.bool() ? 1 : -1, list = d.shuffle([10000 + side * s, 10000 - side * (s + d.int(2, 5) * 10), 10000 + side * (s + 100), 10000 - side * (s + 200)]);
            return C('10000에 가장 가까운 수는?', list.map(String), list.indexOf(10000 + side * s), { explain: `10000과의 차는 차례로 ${list.map((v) => Math.abs(v - 10000)).join(', ')}이다. 차가 가장 작은 수가 가장 가깝다.`, facts: { choose: { exprs: list.map(String), rule: 'nearest', target: 10000 } } });
          }),
          T('man-boxes', '한 상자에 든 수와 상자의 수', '심5', (d) => {
            const [per, n] = d.pick([[100, 100], [10, 1000]]);
            return N(`구슬이 한 상자에 ${per}개씩 들어 있다. ${n}상자에 들어 있는 구슬은 모두 몇 개인가?`, 10000, { unit: '개', explain: `${josa(per, '이/가')} ${n}개이면 10000이다.`, facts: { calc: [[`${per}*${n}`, 0]] } });
          })
        ]
      },
      {
        id: 'five', title: '다섯 자리 수', standard: NUM,
        types: [
          T('five-tens', '몇만은 10000이 몇 개인 수', '②10 ③17', (d) => {
            const k = d.int(2, 9);
            return N(`10000이 몇 개이면 ${josa(k * 10000, '이/가')} 되는가?`, k, { unit: '개', explain: `10000이 ${k}개이면 ${k * 10000}이다.`, facts: { calc: [[`${k * 10000}/10000`, 0]] } });
          }),
          T('five-thousands', '1000이 몇십 개인 수', '②11', (d) => {
            const k = d.int(2, 9) * 10;
            return N(`1000이 ${k}개이면 얼마인가?`, k * 1000, { explain: `1000이 10개이면 10000이므로 1000이 ${k}개이면 ${k * 1000}이다.`, facts: { calc: [[`1000*${k}`, 0]] } });
          }),
          T('five-odd', '몇만을 나타내는 것이 아닌 것', '②12', (d) => {
            const k = d.int(2, 9), rows = d.shuffle([[`10000이 ${k}개인 수`, `10000*${k}`], [`1000이 ${k * 10}개인 수`, `1000*${k * 10}`], [`100이 ${k * 100}개인 수`, `100*${k * 100}`], [`10이 ${k * 100}개인 수`, `10*${k * 100}`]]);
            return C(`${k}만을 나타내는 것이 아닌 것은?`, rows.map((row) => row[0]), rows.findIndex((row) => row[1] === `10*${k * 100}`), { explain: `10이 ${k * 100}개인 수는 ${k * 1000}이다. 나머지는 모두 ${k * 10000}을 나타낸다.`, facts: { big: { odd: rows.map((row) => row[1]) } } });
          }),
          T('five-compose', '자리마다 몇 개인 수', '①14 ②13 ③14·26 심7', (d) => {
            const ds = [d.int(2, 9), d.int(1, 9), d.int(1, 9), d.int(1, 9), d.int(1, 9)], n = toNum(ds);
            return N(`10000이 ${ds[0]}개, 1000이 ${ds[1]}개, 100이 ${ds[2]}개, 10이 ${ds[3]}개, 1이 ${ds[4]}개인 수는?`, n, { explain: `${ds[0] * 10000} + ${ds[1] * 1000} + ${ds[2] * 100} + ${ds[3] * 10} + ${ds[4]} = ${n}`, facts: { calc: [[`10000*${ds[0]}+1000*${ds[1]}+100*${ds[2]}+10*${ds[3]}+1*${ds[4]}`, 0]] } });
          }),
          T('five-compose-gap', '빈 자리가 있는 수', '②14 ③15', (d) => {
            // 틀린 보기: 숫자만 이어 쓴 것, 앞에서부터 채운 것, 0을 하나만 쓴 것
            const a = d.int(2, 9), c = d.int(1, 9), e = d.int(1, 9), n = a * 10000 + c * 100 + e, list = d.shuffle([n, a * 100 + c * 10 + e, a * 10000 + c * 1000 + e * 100, a * 1000 + c * 100 + e]);
            return C(`10000이 ${a}개, 100이 ${c}개, 1이 ${e}개인 수는?`, list.map(String), list.indexOf(n), { explain: `천의 자리와 십의 자리에는 0을 쓴다. ${a * 10000} + ${c * 100} + ${e} = ${n}`, facts: { pick: { expr: `10000*${a}+100*${c}+1*${e}`, options: list } } });
          }),
          T('five-money', '10장이 넘는 돈이 낀 금액', '①26·28 ②15·19 ③25·27 심10·11', (d) => {
            const a = d.int(2, 6), b = d.int(11, 19), c = d.int(1, 9), e = d.int(1, 9), n = a * 10000 + b * 1000 + c * 100 + e * 10;
            return N(`10000원짜리 지폐 ${a}장, 1000원짜리 지폐 ${b}장, 100원짜리 동전 ${c}개, 10원짜리 동전 ${e}개가 있다. 모두 얼마인가?`, n, { unit: '원', explain: `1000원짜리 지폐 ${b}장은 ${b * 1000}원이다. ${a * 10000} + ${b * 1000} + ${c * 100} + ${e * 10} = ${n}`, facts: { calc: [[`10000*${a}+1000*${b}+100*${c}+10*${e}`, 0]] } });
          }),
          T('five-decompose', '수를 자리마다 몇 개로 나타내기', '①13 ②16 ③16', (d) => {
            const ds = uniq(d, 5), n = toNum(ds), [i, j] = d.pick([[0, 2], [1, 3], [0, 3], [1, 4], [2, 4]]), UNIT = [10000, 1000, 100, 10, 1];
            const parts = UNIT.map((u, k) => `${u}이 ${k === i ? box(LABELS[0]) : k === j ? box(LABELS[1]) : ds[k]}개`);
            return M('㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: ds[i] }, { label: LABELS[1], answer: ds[j] }], {
              figure: quote(`${josa(n, '은/는')} ${parts.join(', ')}인 수이다.`), explain: `${n}의 ${PLACES[4 - i]}의 자리 숫자는 ${ds[i]}, ${PLACES[4 - j]}의 자리 숫자는 ${ds[j]}이다.`,
              facts: { calc: [[dx(n, 4 - i), 0], [dx(n, 4 - j), 1]], unseen: [pow(4 - i), pow(4 - j), 10] }
            });
          }),
          T('five-read', '다섯 자리 수 읽기', '①15·17·18 ②17 ③18', (d) => {
            // 천의 자리가 0인 수: 0의 자리를 잘못 읽은 보기를 넣는다
            const a = d.int(2, 9), b = d.int(1, 9), c = d.int(1, 9), e = d.int(1, 9), n = a * 10000 + b * 100 + c * 10 + e;
            const list = d.shuffle([n, a * 10000 + b * 1000 + c * 10 + e, a * 1000 + b * 100 + c * 10 + e, a * 100000 + b * 100 + c * 10 + e]);
            return C(`${josa(n, '을/를')} 바르게 읽은 것은?`, list.map(say), list.indexOf(n), { explain: `${josa(n, '은/는')} 10000이 ${a}개, 100이 ${b}개, 10이 ${c}개, 1이 ${e}개인 수이다. ${said(n)} 읽는다.`, facts: { rule: 'five', big: { size: n, names: { value: n, given: String(n) } } } });
          }),
          T('five-write', '읽은 수를 수로 쓰기', '①16 ②18 ③19', (d) => {
            const a = d.int(2, 9), b = d.int(1, 9), e = d.int(1, 9), n = a * 10000 + d.pick([b * 1000 + e * 10, b * 100 + e, b * 1000 + e]);
            return N('다음을 수로 쓰면?', n, { figure: quote(say(n)), explain: `읽지 않은 자리에는 0을 쓴다. ${say(n)} → ${n}`, facts: { rule: 'five', big: { size: n, shown: [[say(n), n]], written: [[say(n), 0]] } } });
          }),
          T('five-expand', '각 자리의 숫자가 나타내는 값의 합', '①19 ②21 ③21', (d) => {
            const ds = uniq(d, 5), n = toNum(ds), [i, j] = d.pick([[1, 3], [0, 2], [1, 4], [2, 3], [0, 3]]), UNIT = [10000, 1000, 100, 10, 1];
            const parts = UNIT.map((u, k) => (k === i ? box(LABELS[0]) : k === j ? box(LABELS[1]) : ds[k] * u));
            return M('㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: ds[i] * UNIT[i] }, { label: LABELS[1], answer: ds[j] * UNIT[j] }], {
              figure: quote(`${n} = ${parts.join(' + ')}`), explain: `${n} = ${UNIT.map((u, k) => ds[k] * u).join(' + ')}`, facts: { calc: [[vx(n, 4 - i), 0], [vx(n, 4 - j), 1]], unseen: [pow(4 - i), pow(4 - j), 10] }
            });
          }),
          T('five-expand-back', '자릿값의 합을 수로 쓰기', '①20', (d) => {
            const a = d.int(2, 9), b = d.int(1, 9), c = d.int(1, 9), e = d.int(1, 9), n = a * 10000 + b * 1000 + c * 10 + e;
            return N('다음이 나타내는 수는?', n, { figure: quote(`${a * 10000} + ${b * 1000} + ${c * 10} + ${e}`), explain: `백의 자리에는 0을 쓴다. ${n}`, facts: { calc: [[`${a * 10000}+${b * 1000}+${c * 10}+${e}`, 0]] } });
          }),
          T('five-digit-value', '숫자가 나타내는 값', '①22 ②22 ③23', (d) => {
            const ds = uniq(d, 5), n = toNum(ds), k = d.int(1, 4), t = digitAt(n, k);
            return N(`${n}에서 숫자 ${josa(t, '이/가')} 나타내는 값은?`, t * pow(k), { explain: `숫자 ${josa(t, '은/는')} ${PLACES[k]}의 자리 숫자이므로 ${josa(t * pow(k), '을/를')} 나타낸다.`, facts: { rule: 'five', big: { size: n }, calc: [[vx(n, k), 0]], unseen: [pow(k), 10] } });
          }),
          T('five-place-digit', '자리의 숫자와 그 숫자가 나타내는 값', '②20 ③22', (d) => {
            const ds = uniq(d, 5), n = toNum(ds), k = d.int(1, 4), t = digitAt(n, k);
            return M(`${n}에서 ${PLACES[k]}의 자리 숫자와 그 숫자가 나타내는 값은?`, [{ label: '숫자', answer: t }, { label: '나타내는 값', answer: t * pow(k) }], { explain: `${PLACES[k]}의 자리 숫자는 ${t}이고 ${josa(t * pow(k), '을/를')} 나타낸다.`, facts: { calc: [[dx(n, k), 0], [vx(n, k), 1]], unseen: [pow(k), 10] } });
          }),
          T('five-same-digit', '같은 숫자가 나타내는 값은 몇 배', '①23 ②47 심33', (d) => {
            const t = d.int(2, 9), [hi, lo] = d.pick([[4, 2], [4, 1], [3, 1], [3, 0], [4, 3], [2, 0]]);
            const n = toNum([4, 3, 2, 1, 0].map((k) => (k === hi || k === lo ? t : d.until(() => d.int(1, 9), (v) => v !== t))));
            return N(`${n}에서 ${PLACES[hi]}의 자리 숫자 ${josa(t, '이/가')} 나타내는 값은 ${PLACES[lo]}의 자리 숫자 ${josa(t, '이/가')} 나타내는 값의 몇 배인가?`, pow(hi - lo), {
              unit: '배', explain: `${PLACES[hi]}의 자리 숫자 ${josa(t, '은/는')} ${josa(t * pow(hi), '을/를')}, ${PLACES[lo]}의 자리 숫자 ${josa(t, '은/는')} ${josa(t * pow(lo), '을/를')} 나타낸다. ${josa(t * pow(hi), '은/는')} ${t * pow(lo)}의 ${pow(hi - lo)}배이다.`,
              facts: { calc: [[`(${vx(n, hi)})/(${vx(n, lo)})`, 0]], unseen: [pow(hi), pow(lo), 10] }
            });
          }),
          T('five-pick-by-digit', '자리 숫자로 수 고르기', '①24 ②25', (d) => {
            const t = d.int(1, 9), k = d.int(1, 3), places = d.shuffle([k].concat(d.shuffle([0, 1, 2, 3, 4].filter((p) => p !== k)).slice(0, 3))), list = places.map((p) => withDigit(d, 5, t, p));
            return C(`${PLACES[k]}의 자리 숫자가 ${t}인 수는?`, list.map(String), places.indexOf(k), { explain: `수마다 숫자 ${josa(t, '이/가')} 있는 자리를 찾는다. ${list[places.indexOf(k)]}의 ${PLACES[k]}의 자리 숫자가 ${t}이다.`, facts: { choose: { exprs: list.map((n) => dx(n, k)), rule: 'equals', target: t }, unseen: [pow(k), 10] } });
          }),
          T('five-say', '다섯 자리 수에 대한 설명', '②27 심27', (d) => {
            const ds = uniq(d, 5), n = toNum(ds);
            const rows = d.shuffle([[`만의 자리 숫자는 ${ds[0]}이다.`, true], [`숫자 ${josa(ds[1], '이/가')} 나타내는 값은 ${ds[1] * 1000}이다.`, true], [`숫자 ${josa(ds[2], '이/가')} 나타내는 값은 ${ds[2] * 10}이다.`, false], [`10000이 ${ds[0]}개, 1000이 ${ds[1]}개, 100이 ${ds[2]}개, 10이 ${ds[3]}개, 1이 ${ds[4]}개인 수이다.`, true]]);
            return C(`${n}에 대한 설명으로 옳지 않은 것은?`, rows.map((row) => row[0]), rows.findIndex((row) => !row[1]), { explain: `숫자 ${josa(ds[2], '은/는')} 백의 자리 숫자이므로 ${josa(ds[2] * 100, '을/를')} 나타낸다.`, facts: truthOf(rows, false) });
          }),
          T('five-cond', '자리 숫자로 설명한 수', '②28 ③28', (d) => {
            // 자리의 차례를 섞어 말한다. 천의 자리 숫자는 0이다.
            const ds = [d.int(1, 9), 0, d.int(1, 9), d.int(1, 9), d.int(1, 9)], n = toNum(ds), order = d.shuffle([0, 1, 2, 3, 4]);
            return N(`${order.map((i) => `${PLACES[4 - i]}의 자리 숫자가 ${ds[i]}`).join(', ')}인 다섯 자리 수는?`, n, { explain: `만의 자리부터 차례로 쓰면 ${n}이다.`, facts: { calc: [[`${ds[0]}*10000+${ds[2]}*100+${ds[3]}*10+${ds[4]}`, 0]], unseen: [10000, 100, 10] } });
          }),
          T('five-change', '다른 지폐로 바꾸기', '심6', (d) => {
            const k = d.int(2, 9);
            return N(`10000원짜리 지폐 ${k}장을 1000원짜리 지폐로만 바꾸면 몇 장인가?`, k * 10, { unit: '장', explain: `10000원짜리 지폐 1장은 1000원짜리 지폐 10장과 같다. ${k}장은 ${k * 10}장과 같다.`, facts: { calc: [[`10000*${k}/1000`, 0]] } });
          })
        ]
      },
      {
        id: 'tenman', title: '십만, 백만, 천만', standard: NUM,
        types: [
          T('tm-units', '10000이 10개, 100개, 1000개인 수', '①29 ②30 ③29', (d) => {
            const k = d.pick([10, 100, 1000]), list = d.shuffle([1e5, 1e6, 1e7, 1e8]);
            return C(`10000이 ${k}개인 수는?`, list.map(cut), list.indexOf(k * 10000), { explain: '10000이 10개이면 10만, 100개이면 100만, 1000개이면 1000만이다.', facts: { pick: { expr: `10000*${k}`, options: list } } });
          }),
          T('tm-chain', '10배씩 커지는 수(천만까지)', '①30 ②31', () => N('10배씩 커지는 수를 차례로 쓴 것이다. 빈칸에 알맞은 수를 숫자로 쓰면?', 1000000, {
            figure: chain(['1만', '×10', '10만', '×10', box(), '×10', '1000만']), explain: '10만의 10배는 100만이다. 100만은 1000000이라고 쓴다.', facts: { calc: [['100000*10', 0]], big: { shown: [['10만', 100000]] } }
          })),
          T('tm-zero-press', '0을 누르는 횟수', '①31', (d) => {
            const word = d.pick(['10만', '100만', '1000만']), n = { '10만': 1e5, '100만': 1e6, '1000만': 1e7 }[word], zeros = String(n).length - 1;
            return N(`계산기에 ${word}을 수로 나타내려고 한다. 1을 누른 다음 0을 몇 번 눌러야 하는가?`, zeros, { unit: '번', explain: `${word}을 수로 쓰면 ${n}이다. 0이 ${zeros}개이다.`, facts: { big: { zeros: [[word, 0]] } } });
          }),
          T('tm-count', '10000이 몇 개인 수 쓰기', '①32 ②32 ③30', (d) => {
            const k = d.int(1200, 9800);
            return N(`10000이 ${k}개인 수를 쓰면?`, k * 10000, { explain: `10000이 ${k}개이면 ${k}만이다. 수로 쓰면 ${k * 10000}이다.`, facts: { calc: [[`10000*${k}`, 0]] } });
          }),
          T('tm-bills', '만 원짜리 지폐의 수', '①33 ②33 심13', (d) => {
            const k = d.int(120, 980);
            return N(`${k * 10000}원을 만 원짜리 지폐로만 찾으면 지폐는 몇 장인가?`, k, { unit: '장', explain: `${josa(k * 10000, '은/는')} 10000이 ${k}개인 수이다.`, facts: { calc: [[`${k * 10000}/10000`, 0]], unseen: [10000] } });
          }),
          T('tm-compose', '만이 몇 개, 일이 몇 개인 수', '①34·35 ②34 ③35', (d) => {
            // 일이 두세 자리뿐이라 만 아래 네 자리를 0으로 채워야 한다
            const m = d.int(1200, 9800), o = d.bool() ? d.int(11, 99) : d.int(101, 999), n = m * 10000 + o;
            return N(`만이 ${m}개, 일이 ${o}개인 수는?`, n, { explain: `만이 ${m}개이면 ${m}만, 일이 ${o}개이면 ${o}이다. ${m}만 ${josa(o, '을/를')} 수로 쓰면 ${n}이다.`, facts: { calc: [[`${m}*10000+${o}`, 0]], unseen: [10000] } });
          }),
          T('tm-decompose', '수를 만과 일로 나타내기', '③34', (d) => {
            const m = d.int(1001, 9999), o = d.bool() ? d.int(11, 99) : d.int(101, 999), n = m * 10000 + o;
            return M('㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: m }, { label: LABELS[1], answer: o }], {
              figure: quote(`${josa(n, '은/는')} 만이 ${box(LABELS[0])}개, 일이 ${box(LABELS[1])}개인 수이다.`), explain: `일의 자리부터 네 자리씩 끊으면 ${cut(n)}이다.`, facts: { calc: [[`(${n}-${n}%10000)/10000`, 0], [`${n}%10000`, 1]], unseen: [10000] }
            });
          }),
          T('tm-over', '10개가 넘는 묶음이 낀 수(천만까지)', '①36 ②35 ③36', (d) => {
            // 틀린 보기: 숫자를 이어 쓴 것, 10을 넘는 부분을 버린 것, 한 자리 밀린 것
            const a = d.int(2, 8), b = d.int(11, 19), c = d.int(1, 9), n = (a * 100 + b * 10 + c) * 1e4, list = d.shuffle([n, (a * 1000 + b * 10 + c) * 1e4, (a * 100 + (b % 10) * 10 + c) * 1e4, (a * 100 + b * 10 + c) * 1e3]);
            return C(`100만이 ${a}개, 10만이 ${b}개, 1만이 ${c}개인 수는?`, list.map(cut), list.indexOf(n), { explain: `10만이 ${b}개이면 ${b * 10}만이다. ${a * 100}만 + ${b * 10}만 + ${c}만 = ${cut(n)}`, facts: { pick: { expr: `1000000*${a}+100000*${b}+10000*${c}`, options: list }, unseen: [1000000, 100000, 10000] } });
          }),
          T('tm-unit-find', '묶음의 단위 찾기', '②36', (d) => {
            const k = d.until(() => d.int(12, 98), (v) => v % 10 !== 0), n = k * 1e6, mult = d.pick([1, 10, 100]), count = k * mult, list = d.shuffle([1e4, 1e5, 1e6, 1e7]);
            return C('□ 안에 알맞은 수는?', list.map(cut), list.indexOf(n / count), { figure: quote(`${cut(n)}은 ${box()}이 ${count}개인 수이다.`), explain: `${cut(n / count)}이 ${count}개이면 ${cut(n)}이다.`, facts: { pick: { expr: `${n}/${count}`, options: list }, big: { shown: [[cut(n), n]] } } });
          }),
          T('tm-cut', '만 단위로 끊어 쓰기', '①37 ②39 ③33', (d) => {
            const m = d.int(1001, 9999), o = d.int(1, 9) * 100 + d.int(1, 9) * 10, n = m * 1e4 + o, list = d.shuffle([n, m * 1e4 + o * 10, Math.floor(m / 10) * 1e4 + (m % 10) * 1000 + o, m * 1e4 + o / 10]);
            return C(`${josa(n, '을/를')} 만 단위로 끊어 바르게 나타낸 것은?`, list.map(cut), list.indexOf(n), { explain: `일의 자리부터 네 자리씩 끊으면 ${m} / ${String(o).padStart(4, '0')}이다. ${cut(n)}이다.`, facts: { rule: 'tenman', big: { size: n, names: { value: n, given: String(n) } } } });
          }),
          T('tm-read', '천만까지의 수 읽기', '①38·40 ②37 ③31', (d) => {
            const a = d.int(2, 9), b = d.int(1, 9), c = d.int(1, 9), e = d.int(1, 9), n = (a * 1000 + b * 10 + c) * 1e4 + e * 1000;
            const list = d.shuffle([n, (a * 1000 + b * 100 + c) * 1e4 + e * 1000, (a * 100 + b * 10 + c) * 1e4 + e * 1000, (a * 1000 + b * 10 + c) * 1e4 + e * 100]);
            return C(`${josa(n, '을/를')} 바르게 읽은 것은?`, list.map(say), list.indexOf(n), { explain: `일의 자리부터 네 자리씩 끊으면 ${cut(n)}이다. ${said(n)} 읽는다.`, facts: { rule: 'tenman', big: { size: n, names: { value: n, given: String(n) } } } });
          }),
          T('tm-write', '읽은 수를 수로 쓰기(천만까지)', '①39 ②38 ③32', (d) => {
            const a = d.int(2, 9), b = d.int(1, 9), e = d.int(1, 9), n = (a * 1000 + b * 10) * 1e4 + d.pick([e * 1000, e * 100, e * 10]);
            return N('다음을 수로 쓰면?', n, { figure: quote(say(n)), explain: `${say(n)} → ${cut(n)} → ${n}`, facts: { rule: 'tenman', big: { size: n, shown: [[say(n), n]], written: [[say(n), 0]] } } });
          }),
          T('tm-same', '같은 수를 나타낸 것', '①41', (d) => {
            // 0의 개수를 하나 더 쓰거나 덜 쓴 것을 섞는다
            const a = d.int(12, 98) * 1e6, b = d.int(101, 999) * 1e4, c = d.int(11, 99) * 1e4, e = d.int(2, 9) * 1e7;
            const rows = d.shuffle([[cut(a), a, a], [cut(b), b * 10, b], [cut(c), c * 10, c], [cut(e), e / 10, e]]);
            return C('같은 수끼리 바르게 짝 지은 것은?', rows.map(([word, written]) => `${word}, ${written}`), rows.findIndex(([, written, real]) => written === real), { explain: `${cut(a)}은 10000이 ${a / 1e4}개인 수이므로 ${a}이다.`, facts: { claimed: rows.map(([, written, real]) => [String(real), written]), claimedWant: true } });
          }),
          T('tm-expand', '자릿값의 합(천만까지)', '①42 ②40 ③37', (d) => {
            const ds = uniq(d, 4), n = toNum(ds) * 1e4, [i, j] = d.pick([[1, 3], [0, 2], [1, 2], [0, 3]]), parts = ds.map((v, k) => (k === i ? box(LABELS[0]) : k === j ? box(LABELS[1]) : v * pow(7 - k)));
            return M('㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: ds[i] * pow(7 - i) }, { label: LABELS[1], answer: ds[j] * pow(7 - j) }], {
              figure: quote(`${n} = ${parts.join(' + ')}`), explain: `${n} = ${ds.map((v, k) => v * pow(7 - k)).join(' + ')}`, facts: { calc: [[vx(n, 7 - i), 0], [vx(n, 7 - j), 1]], unseen: [pow(7 - i), pow(7 - j), 10] }
            });
          }),
          T('tm-place-digit', '정해진 자리의 숫자(천만까지)', '①44 ②41', (d) => {
            const n = toNum(uniq(d, 8)), k = d.int(4, 7);
            return N(`${n}에서 ${PLACES[k]}의 자리 숫자는?`, digitAt(n, k), { explain: `일의 자리부터 네 자리씩 끊으면 ${cut(n)}이다. ${PLACES[k]}의 자리 숫자는 ${digitAt(n, k)}이다.`, facts: { rule: 'tenman', big: { size: n }, calc: [[dx(n, k), 0]], unseen: [pow(k), 10] } });
          }),
          T('tm-digit-value', '숫자가 나타내는 값(천만까지)', '①46 ②44 ③38', (d) => {
            const n = toNum(uniq(d, 8)), k = d.int(4, 7), t = digitAt(n, k);
            return N(`${n}에서 숫자 ${josa(t, '이/가')} 나타내는 값은?`, t * pow(k), { explain: `숫자 ${josa(t, '은/는')} ${PLACES[k]}의 자리 숫자이므로 ${josa(t * pow(k), '을/를')} 나타낸다.`, facts: { rule: 'tenman', big: { size: n }, calc: [[vx(n, k), 0]], unseen: [pow(k), 10] } });
          }),
          T('tm-digit-where', '숫자의 자리 이름(천만까지)', '①45 ②42 ③39', (d) => {
            const n = toNum(uniq(d, 8)), k = d.int(4, 7), t = digitAt(n, k);
            return C(`${n}에서 숫자 ${josa(t, '은/는')} 어느 자리 숫자인가?`, [4, 5, 6, 7].map((p) => PLACES[p] + '의 자리'), k - 4, { explain: `일의 자리부터 네 자리씩 끊으면 ${cut(n)}이다. 숫자 ${josa(t, '은/는')} ${PLACES[k]}의 자리 숫자이다.`, facts: { rule: 'tenman', big: { size: n }, choose: { exprs: [4, 5, 6, 7].map((p) => dx(n, p)), rule: 'equals', target: t }, unseen: [1e4, 1e5, 1e6, 1e7, 10] } });
          }),
          T('tm-value-find', '주어진 값을 나타내는 수 고르기', '①47 ②23·46', (d) => {
            const t = d.int(1, 9), places = d.shuffle([4, 5, 6, 7]), k = d.pick([4, 5, 6]), list = places.map((p) => withDigit(d, 8, t, p));
            return C(`숫자 ${josa(t, '이/가')} ${josa(t * pow(k), '을/를')} 나타내는 수는?`, list.map(String), places.indexOf(k), { explain: `${josa(t * pow(k), '은/는')} ${PLACES[k]}의 자리 숫자가 ${t}일 때 나타내는 값이다.`, facts: { choose: { exprs: list.map((n) => vx(n, k)), rule: 'equals', target: t * pow(k) }, unseen: [pow(k), 10] } });
          }),
          T('tm-digit-find', '자리 숫자로 수 고르기(천만까지)', '①48 ②43 ③40', (d) => {
            const t = d.int(1, 9), places = d.shuffle([4, 5, 6, 7]), k = d.pick([5, 6, 7]), list = places.map((p) => withDigit(d, 8, t, p));
            return C(`${PLACES[k]}의 자리 숫자가 ${t}인 수는?`, list.map(String), places.indexOf(k), { explain: `일의 자리부터 네 자리씩 끊어 자리를 찾는다. ${list[places.indexOf(k)]}의 ${PLACES[k]}의 자리 숫자가 ${t}이다.`, facts: { choose: { exprs: list.map((n) => dx(n, k)), rule: 'equals', target: t }, unseen: [pow(k), 10] } });
          }),
          T('tm-place-max', '자리 숫자가 가장 큰 수', '③41 심30', (d) => {
            const k = d.int(4, 6), tops = d.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 3), list = tops.map((t) => withDigit(d, 8, t, k));
            return C(`${PLACES[k]}의 자리 숫자가 가장 큰 수는?`, list.map(String), tops.indexOf(Math.max(...tops)), { explain: `${PLACES[k]}의 자리 숫자는 차례로 ${tops.join(', ')}이다.`, facts: { choose: { exprs: list.map((n) => dx(n, k)), rule: 'max' }, unseen: [pow(k), 10] } });
          }),
          T('tm-biggest-value', '숫자가 나타내는 값이 가장 큰 수', '②24·45 ③24·42 심28', (d) => {
            const t = d.int(1, 9), places = d.shuffle([3, 4, 5, 6, 7]).slice(0, 4), list = places.map((p) => withDigit(d, 8, t, p));
            return C(`숫자 ${josa(t, '이/가')} 나타내는 값이 가장 큰 수는?`, list.map(String), places.indexOf(Math.max(...places)), { explain: `숫자 ${josa(t, '이/가')} 가장 높은 자리에 있는 수를 찾는다. ${PLACES[Math.max(...places)]}의 자리에 있을 때 ${josa(t * pow(Math.max(...places)), '을/를')} 나타낸다.`, facts: { choose: { exprs: list.map((n, i) => vx(n, places[i])), rule: 'max' }, unseen: places.map(pow).concat([10]) } });
          }),
          T('tm-statements', '여덟 자리 수에 대한 설명', '①50 ②27 심15·27', (d) => {
            const ds = uniq(d, 5), m = toNum(ds.slice(0, 4)), n = m * 1e4 + ds[4] * 1000;
            const rows = d.shuffle([[`${said(n)} 읽는다.`, true], [`백만의 자리 숫자는 ${ds[0]}이다.`, false], [`숫자 ${josa(ds[2], '이/가')} 나타내는 값은 ${ds[2] * 1e4}이다.`, false], [`만이 ${Math.floor(m / 10)}개, 일이 ${ds[4] * 1000}개인 수이다.`, false]]);
            return C(`${n}에 대한 설명으로 옳은 것은?`, rows.map((row) => row[0]), rows.findIndex((row) => row[1]), { explain: `일의 자리부터 네 자리씩 끊으면 ${cut(n)}이다. 백만의 자리 숫자는 ${ds[1]}이고, 숫자 ${josa(ds[2], '은/는')} ${josa(ds[2] * 1e5, '을/를')} 나타내며, 만이 ${m}개인 수이다.`, facts: Object.assign(truthOf(rows, true), { rule: 'tenman', big: { size: n } }) });
          }),
          T('tm-swap', '두 자리의 숫자를 바꾼 수', '②52', (d) => {
            const n = toNum(uniq(d, 8)), [p, q] = d.pick([[7, 4], [6, 4], [7, 5], [6, 5], [7, 6]]), x = digitAt(n, p), y = digitAt(n, q), m = n - x * pow(p) - y * pow(q) + y * pow(p) + x * pow(q);
            return N(`${n}에서 ${PLACES[p]}의 자리 숫자와 ${PLACES[q]}의 자리 숫자를 서로 바꾸어 쓴 수는?`, m, {
              explain: `${PLACES[p]}의 자리 숫자 ${josa(x, '과/와')} ${PLACES[q]}의 자리 숫자 ${josa(y, '을/를')} 바꾸어 쓰면 ${m}이다.`,
              facts: { calc: [[`${n}-(${vx(n, p)})-(${vx(n, q)})+(${dx(n, p)})*${pow(q)}+(${dx(n, q)})*${pow(p)}`, 0]], unseen: [pow(p), pow(q), 10] }
            });
          }),
          T('tm-checks', '두 가지 수표의 수', '②51', (d) => {
            const a = d.int(2, 8), b = d.int(1, 9), n = a * 1e6 + b * 1e5;
            return N(`${n}원을 100만 원짜리 수표 ${a}장과 10만 원짜리 수표로 모두 찾았다. 10만 원짜리 수표는 몇 장인가?`, b, { unit: '장', explain: `100만 원짜리 수표 ${a}장은 ${a * 1e6}원이다. 남은 ${b * 1e5}원은 10만 원짜리 수표 ${b}장이다.`, facts: { calc: [[`(${n}-1000000*${a})/100000`, 0]], unseen: [1000000, 100000] } });
          }),
          T('tm-ten-people', '10배 한 수', '③48', (d) => {
            const k = d.int(12, 98) * 1e4;
            return N(`한 명이 ${k}원씩 10명이 돈을 모았다. 모은 돈은 모두 얼마인가?`, k * 10, { unit: '원', explain: `${k}의 10배는 ${k * 10}이다. 10배 하면 끝에 0이 하나 더 붙는다.`, facts: { calc: [[`${k}*10`, 0]] } });
          }),
          T('tm-times-odd', '몇 배 한 수 중 다른 하나', '③47 심42', (d) => {
            const k = d.int(2, 9), rows = d.shuffle([[`${k}만의 100배`, `${k}*10000*100`], [`${k * 10}만의 10배`, `${k * 10}*10000*10`], [`${k * 100}만`, `${k * 100}*10000`], [`${k * 1000}의 100배`, `${k * 1000}*100`]]);
            return C('나타내는 수가 나머지 셋과 다른 하나는?', rows.map((row) => row[0]), rows.findIndex((row) => row[1] === `${k * 1000}*100`), { explain: `${k * 1000}의 100배는 ${k * 10}만이다. 나머지는 모두 ${k * 100}만을 나타낸다.`, facts: { big: { odd: rows.map((row) => row[1]) } } });
          })
        ]
      },
      {
        id: 'eok', title: '억', standard: NUM,
        types: [
          T('eok-ten', '1000만이 10개인 수', '①52 ②53 ③49', (d) => {
            const list = d.shuffle([1e8, 1e9, 1e7, 1e10]);
            return C('1000만이 10개인 수는?', list.map(cut), list.indexOf(1e8), { explain: '1000만이 10개이면 1억이다. 1억은 100000000이라고 쓴다.', facts: { pick: { expr: '10000000*10', options: list }, unseen: [10000000] } });
          }),
          T('eok-more', '1억은 어떤 수보다 얼마 큰 수', '①53 ②54 ③51', (d) => {
            const gap = d.pick([1e7, 1e6, 1e5, 1e4]), base = 1e8 - gap, list = d.shuffle([1e7, 1e6, 1e5, 1e4]);
            return C(`1억은 ${cut(base)}보다 얼마 큰 수인가?`, list.map(cut), list.indexOf(gap), { explain: `${cut(base)}보다 ${cut(gap)} 큰 수가 1억이다.`, facts: { pick: { expr: `100000000-${base}`, options: list }, unseen: [100000000], big: { shown: [[cut(base), base]] } } });
          }),
          T('eok-less', '1억보다 얼마 작은 수', '③52', (d) => {
            const gap = d.pick([1e7, 1e6, 1e5, 1e4]), list = d.shuffle([9e7, 99e6, 999e5, 9999e4]);
            return C(`1억보다 ${cut(gap)} 작은 수는?`, list.map(cut), list.indexOf(1e8 - gap), { explain: `${cut(1e8 - gap)}보다 ${cut(gap)} 큰 수가 1억이다.`, facts: { pick: { expr: `100000000-${gap}`, options: list }, unseen: [100000000], big: { shown: [[cut(gap), gap]] } } });
          }),
          T('eok-chain', '10배씩 커지는 수(억)', '①54 ②56 ③50', (d) => {
            const list = d.shuffle([1e8, 1e12, 1e10, 1e4]);
            return C('10배씩 커지는 수를 차례로 쓴 것이다. ㉠에 알맞은 수는?', list.map(cut), list.indexOf(1e8), { figure: chain(['100만', '×10', '1000만', '×10', box(LABELS[0]), '×10', '10억']), explain: '1000만의 10배는 1억이다.', facts: { pick: { expr: '10000000*10', options: list }, unseen: [10000000] } });
          }),
          T('eok-same', '1억을 나타내는 것이 아닌 것', '①55 ②55 심22', (d) => {
            const rows = d.shuffle([['1000만이 10개인 수', '10000000*10'], ['9999만보다 1만 큰 수', '99990000+10000'], ['100만이 100개인 수', '1000000*100'], ['10만이 100개인 수', '100000*100']]);
            return C('1억을 나타내는 것이 아닌 것은?', rows.map((row) => row[0]), rows.findIndex((row) => row[1] === '100000*100'), { explain: '10만이 100개인 수는 1000만이다. 나머지는 모두 1억을 나타낸다.', facts: { big: { odd: rows.map((row) => row[1]) } } });
          }),
          T('eok-hundred', '몇백만이 100개인 수', '①56 ②57', (d) => {
            const k = d.int(2, 9), base = k * 1e6, list = d.shuffle([k * 1e8, k * 1e9, k * 1e7, k * 1e10]);
            return C(`${cut(base)}이 100개이면 얼마인가?`, list.map(cut), list.indexOf(k * 1e8), { explain: `100만이 100개이면 1억이므로 ${cut(base)}이 100개이면 ${cut(k * 1e8)}이다.`, facts: { pick: { expr: `${base}*100`, options: list }, big: { shown: [[cut(base), base]] } } });
          }),
          T('eok-times', '1억은 어떤 수의 몇 배', '③53', (d) => {
            const base = d.pick([1e7, 1e6, 1e5, 1e4]);
            return N(`1억은 ${cut(base)}의 몇 배인가?`, 1e8 / base, { unit: '배', explain: `${cut(base)}의 ${1e8 / base}배가 1억이다.`, facts: { calc: [[`100000000/${base}`, 0]], unseen: [100000000], big: { shown: [[cut(base), base]] } } });
          }),
          T('eok-how-times', '몇 배 하면 되는가', '심41', (d) => {
            const small = d.int(2, 9) * d.pick([1e6, 1e5]), mult = d.pick([100, 1000]), list = d.shuffle([10, 100, 1000, 10000]);
            return C(`${cut(small * mult)}은 ${cut(small)}의 몇 배인가?`, list.map((v) => v + '배'), list.indexOf(mult), { explain: `${cut(small)}의 10배는 ${cut(small * 10)}, 100배는 ${cut(small * 100)}, 1000배는 ${cut(small * 1000)}이다.`, facts: { pick: { expr: `${small * mult}/${small}`, options: list }, big: { shown: [[cut(small * mult), small * mult], [cut(small), small]] } } });
          }),
          T('eok-count', '1억이 몇 개인 수 쓰기', '②58 ③54', (d) => {
            const k = d.int(12, 980);
            return N(`1억이 ${k}개인 수를 쓰면?`, k * 1e8, { explain: `1억이 ${k}개이면 ${k}억이다. 수로 쓰면 ${k * 1e8}이다.`, facts: { calc: [[`100000000*${k}`, 0]], unseen: [100000000] } });
          }),
          T('eok-compose', '억이 몇 개, 만이 몇 개인 수', '①59 ③58', (d) => {
            // 만이 두세 자리뿐이라 억 아래 네 자리를 0으로 채워야 한다
            const e = d.int(12, 980), m = d.bool() ? d.int(11, 99) : d.int(101, 999), n = big(0, e, m), list = d.shuffle([n, e * 1e8 + m * 1e5, e * 1e7 + m * 1e4, e * 1e8 + m]);
            return C(`억이 ${e}개, 만이 ${m}개인 수는?`, list.map(String), list.indexOf(n), { explain: `${cut(n)}이다. 만 단위에도 네 자리를 채워 ${String(m).padStart(4, '0')}0000으로 쓴다.`, facts: { pick: { expr: `${e}*100000000+${m}*10000`, options: list }, unseen: [100000000, 10000] } });
          }),
          T('eok-decompose', '수를 억과 만으로 나타내기', '①60 ②59', (d) => {
            const e = d.int(120, 9800), m = d.bool() ? d.int(11, 99) : d.int(101, 999), n = big(0, e, m);
            return M('㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: e }, { label: LABELS[1], answer: m }], {
              figure: quote(`${josa(n, '은/는')} 억이 ${box(LABELS[0])}개, 만이 ${box(LABELS[1])}개인 수이다.`), explain: `일의 자리부터 네 자리씩 끊으면 ${cut(n)}이다.`, facts: { calc: [[`(${n}-${n}%100000000)/100000000`, 0], [`(${n}%100000000)/10000`, 1]], unseen: [100000000, 10000] }
            });
          }),
          T('eok-over', '10개가 넘는 묶음이 낀 수(억)', '①61 ③59 심10', (d) => {
            const a = d.int(2, 8), b = d.int(11, 19), c = d.int(1, 9), n = (a * 100 + b * 10 + c) * 1e8, list = d.shuffle([n, (a * 1000 + b * 10 + c) * 1e8, (a * 100 + (b % 10) * 10 + c) * 1e8, (a * 100 + b * 10 + c) * 1e7]);
            return C(`100억이 ${a}개, 10억이 ${b}개, 1억이 ${c}개인 수는?`, list.map(cut), list.indexOf(n), { explain: `10억이 ${b}개이면 ${b * 10}억이다. ${a * 100}억 + ${b * 10}억 + ${c}억 = ${cut(n)}`, facts: { pick: { expr: `10000000000*${a}+1000000000*${b}+100000000*${c}`, options: list }, unseen: [1e10, 1e9, 1e8] } });
          }),
          T('eok-cut', '억, 만 단위로 끊어 쓰기', '①62 ②62 ③57', (d) => {
            const e = d.int(1002, 8999), m = d.int(1, 9) * 100 + d.int(1, 9), n = big(0, e, m), list = d.shuffle([n, big(0, e, m * 10), big(0, Math.floor(e / 10), (e % 10) * 1000 + m), big(0, e, 0, m)]);
            return C(`${josa(n, '을/를')} 억, 만 단위로 끊어 바르게 나타낸 것은?`, list.map(cut), list.indexOf(n), { explain: `일의 자리부터 네 자리씩 끊으면 ${e} / ${String(m).padStart(4, '0')} / 0000이다. ${cut(n)}이다.`, facts: { rule: 'eok', big: { size: n, names: { value: n, given: String(n) } } } });
          }),
          T('eok-read', '억 단위 수 읽기', '①63 ②60 ③55', (d) => {
            const a = d.int(2, 9), c = d.int(1, 9), b = d.int(1, 9), n = big(0, a * 100 + c, b * 1000);
            const list = d.shuffle([n, big(0, a * 100 + c * 10, b * 1000), big(0, a * 100 + c, b * 100), big(0, a * 10 + c, b * 1000)]);
            return C(`${josa(n, '을/를')} 바르게 읽은 것은?`, list.map(say), list.indexOf(n), { explain: `일의 자리부터 네 자리씩 끊으면 ${cut(n)}이다. ${said(n)} 읽는다.`, facts: { rule: 'eok', big: { size: n, names: { value: n, given: String(n) } } } });
          }),
          T('eok-write', '읽은 수를 수로 쓰기(억)', '①64 ②61 ③56', (d) => {
            const n = big(0, d.int(2, 9) * 100 + d.int(1, 9), d.int(1, 9) * 1000 + d.int(1, 9) * 10);
            return N('다음을 수로 쓰면?', n, { figure: quote(say(n)), explain: `${say(n)} → ${cut(n)} → ${n}`, facts: { rule: 'eok', big: { size: n, shown: [[say(n), n]], written: [[say(n), 0]] } } });
          }),
          T('eok-expand', '자릿값의 합(억)', '①65 ②63 ③60', (d) => {
            const ds = uniq(d, 4), e = toNum(ds), [i, j] = d.pick([[1, 3], [0, 2], [1, 2], [0, 3]]), parts = ds.map((v, k) => (k === i ? box(LABELS[0]) : k === j ? box(LABELS[1]) : v * pow(3 - k) + '억'));
            return M('㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: ds[i] * pow(3 - i), unit: '억' }, { label: LABELS[1], answer: ds[j] * pow(3 - j), unit: '억' }], {
              figure: quote(`${e}억 = ${parts.join(' + ')}`), explain: `${e}억 = ${ds.map((v, k) => v * pow(3 - k) + '억').join(' + ')}`, facts: { calc: [[vx(e, 3 - i), 0], [vx(e, 3 - j), 1]], unseen: [pow(3 - i), pow(3 - j), 10] }
            });
          }),
          T('eok-place-digit', '정해진 자리의 숫자(억)', '①66 ②64', (d) => {
            const n = big(0, toNum(uniq(d, 4)), d.int(1001, 9999), d.int(1001, 9999)), k = d.int(8, 11);
            return N(`${n}에서 ${PLACES[k]}의 자리 숫자는?`, digitAt(n, k), { explain: `일의 자리부터 네 자리씩 끊으면 ${cut(n)}이다. ${PLACES[k]}의 자리 숫자는 ${digitAt(n, k)}이다.`, facts: { rule: 'eok', big: { size: n }, calc: [[dx(n, k), 0]], unseen: [pow(k), 10] } });
          }),
          T('eok-digit-where', '숫자의 자리 이름(억)', '①67 ②65', (d) => {
            const t = d.int(1, 9), k = d.int(8, 11), n = withDigit(d, 12, t, k);
            return C(`${n}에서 숫자 ${josa(t, '은/는')} 어느 자리 숫자인가?`, [8, 9, 10, 11].map((p) => PLACES[p] + '의 자리'), k - 8, { explain: `일의 자리부터 네 자리씩 끊으면 ${cut(n)}이다. 숫자 ${josa(t, '은/는')} ${PLACES[k]}의 자리 숫자이다.`, facts: { rule: 'eok', big: { size: n }, choose: { exprs: [8, 9, 10, 11].map((p) => dx(n, p)), rule: 'equals', target: t }, unseen: [1e8, 1e9, 1e10, 1e11, 10] } });
          }),
          T('eok-digit-value', '숫자가 나타내는 값(억)', '①68 ②66 ③63', (d) => {
            const t = d.int(1, 9), k = d.int(8, 11), n = withDigit(d, 12, t, k), list = d.shuffle([8, 9, 10, 11].map((p) => t * pow(p)));
            return C(`${n}에서 숫자 ${josa(t, '이/가')} 나타내는 값은?`, list.map(cut), list.indexOf(t * pow(k)), { explain: `일의 자리부터 네 자리씩 끊으면 ${cut(n)}이다. 숫자 ${josa(t, '은/는')} ${PLACES[k]}의 자리 숫자이므로 ${cut(t * pow(k))}을 나타낸다.`, facts: { rule: 'eok', big: { size: n }, pick: { expr: vx(n, k), options: list }, unseen: [pow(k), 10] } });
          }),
          T('eok-value-find', '주어진 값을 나타내는 수 고르기(억)', '①69 ③64', (d) => {
            const t = d.int(1, 9), places = d.shuffle([8, 9, 10, 11]), k = d.pick([8, 9, 10]), list = places.map((p) => withDigit(d, 12, t, p)), value = t * pow(k);
            return C(`숫자 ${josa(t, '이/가')} ${cut(value)}을 나타내는 수는?`, list.map(String), places.indexOf(k), { explain: `${cut(value)}은 ${PLACES[k]}의 자리 숫자가 ${t}일 때 나타내는 값이다.`, facts: { choose: { exprs: list.map((n) => vx(n, k)), rule: 'equals', target: value }, unseen: [pow(k), 10], big: { shown: [[cut(value), value]] } } });
          }),
          T('eok-statements', '억 단위 수에 대한 설명', '①71 ②69 ③62', (d) => {
            const ds = uniq(d, 5), e = toNum(ds.slice(0, 4)), m = ds[4] * 1000, n = big(0, e, m);
            const rows = d.shuffle([[`억이 ${e}개, 만이 ${m}개인 수이다.`, true], [`천억의 자리 숫자는 ${ds[1]}이다.`, false], [`숫자 ${josa(ds[2], '이/가')} 나타내는 값은 ${ds[2]}억이다.`, false], [`${said(big(0, e, 0, m))} 읽는다.`, false]]);
            return C(`${n}에 대한 설명으로 옳은 것은?`, rows.map((row) => row[0]), rows.findIndex((row) => row[1]), { explain: `일의 자리부터 네 자리씩 끊으면 ${cut(n)}이다. 천억의 자리 숫자는 ${ds[0]}이고, 숫자 ${josa(ds[2], '은/는')} ${ds[2] * 10}억을 나타내며, ${said(n)} 읽는다.`, facts: Object.assign(truthOf(rows, true), { rule: 'eok', big: { size: n } }) });
          }),
          T('eok-zeros', '수로 쓸 때 0의 개수(억)', '①72 ②49·71 ③45·66 심23', (d) => {
            const n = big(0, d.int(2, 9) * 100 + d.int(1, 9), d.int(1, 9) * 1000);
            return N(`${named(n, say(n), '을/를')} 수로 쓰면 0은 모두 몇 개인가?`, String(n).split('0').length - 1, { unit: '개', explain: `수로 쓰면 ${n}이다.`, facts: { big: { zeros: [[say(n), 0]] } } });
          }),
          T('eok-thousand-times', '몇만을 1000배 한 수', '③65', (d) => {
            const base = d.int(2, 9) * d.pick([1e5, 1e6]), list = d.shuffle([base * 1000, base * 100, base * 10000, base * 10]);
            return C(`${cut(base)}을 1000배 한 수는?`, list.map(cut), list.indexOf(base * 1000), { explain: `${cut(base)}의 10배는 ${cut(base * 10)}, 100배는 ${cut(base * 100)}, 1000배는 ${cut(base * 1000)}이다.`, facts: { pick: { expr: `${base}*1000`, options: list }, big: { shown: [[cut(base), base]] } } });
          }),
          T('eok-odd-notation', '적는 방법이 다른 같은 수', '심21', (d) => {
            const n = big(0, d.int(2, 9), d.int(1, 9) * 100), wrong = big(0, Math.floor(n / 1e8), (n % 1e8) / 1e4 * 10), list = d.shuffle([String(n), say(n), String(wrong)]);
            return C(`${named(n, cut(n), '과/와')} 같은 수가 아닌 것은?`, list, list.indexOf(String(wrong)), { explain: `${cut(n)}을 수로 쓰면 ${n}이고 ${said(n)} 읽는다. ${josa(wrong, '은/는')} ${cut(wrong)}이다.`, facts: { big: { oddNames: true, shown: [[cut(n), n]] } } });
          }),
          T('eok-mixed-value', '적는 방법이 다른 수에서 숫자의 값 비교', '②68·89 심35', (d) => {
            const t = d.int(1, 9), places = d.shuffle([4, 5, 6, 7, 8, 9]).slice(0, 3), ns = places.map((p) => withDigit(d, 10, t, p)), shown = [cut(ns[0]), String(ns[1]), cut(ns[2])];
            return C(`숫자 ${josa(t, '이/가')} 나타내는 값이 가장 큰 것은?`, shown, places.indexOf(Math.max(...places)), { explain: `숫자 ${josa(t, '이/가')} 나타내는 값은 차례로 ${places.map((p) => cut(t * pow(p))).join(', ')}이다.`, facts: { choose: { exprs: ns.map((n, i) => vx(n, places[i])), rule: 'max' }, unseen: places.map(pow).concat([10]), big: { shown: [[shown[0], ns[0]], [shown[2], ns[2]]] } } });
          }),
          T('eok-bundle-value', '묶음으로 말한 수에서 숫자의 값', '②48·70 심37', (d) => {
            const ds = uniq(d, 5), e = toNum(ds.slice(0, 4)), m = ds[4] * 1000, i = d.int(0, 3), t = ds[i], k = 11 - i, list = d.shuffle([8, 9, 10, 11].map((p) => t * pow(p)));
            return C(`억이 ${e}개, 만이 ${m}개인 수에서 숫자 ${josa(t, '이/가')} 나타내는 값은?`, list.map(cut), list.indexOf(t * pow(k)), { explain: `억이 ${e}개, 만이 ${m}개인 수는 ${cut(big(0, e, m))}이다. 숫자 ${josa(t, '은/는')} ${PLACES[k]}의 자리 숫자이다.`, facts: { pick: { expr: `(${dx(e, k - 8)})*${pow(k)}`, options: list }, unseen: [pow(k - 8), pow(k), 10] } });
          })
        ]
      },
      {
        id: 'jo', title: '조', standard: NUM,
        types: [
          T('jo-ten', '1000억이 10개인 수', '①73 ③67·71', (d) => {
            const list = d.shuffle([1e12, 1e13, 1e11, 1e10]);
            return C('1000억이 10개인 수는?', list.map(cut), list.indexOf(1e12), { explain: '1000억이 10개이면 1조이다. 1조는 1000000000000이라고 쓴다.', facts: { pick: { expr: '100000000000*10', options: list }, unseen: [1e11] } });
          }),
          T('jo-more', '1조는 어떤 수보다 얼마 큰 수', '①74 ②72 ③69', (d) => {
            const gap = d.pick([1e11, 1e10, 1e9, 1e8]), base = 1e12 - gap, list = d.shuffle([1e11, 1e10, 1e9, 1e8]);
            return C(`1조는 ${cut(base)}보다 얼마 큰 수인가?`, list.map(cut), list.indexOf(gap), { explain: `${cut(base)}보다 ${cut(gap)} 큰 수가 1조이다.`, facts: { pick: { expr: `1000000000000-${base}`, options: list }, unseen: [1e12], big: { shown: [[cut(base), base]] } } });
          }),
          T('jo-less', '1조보다 얼마 작은 수', '③70', (d) => {
            const gap = d.pick([1e11, 1e10, 1e9, 1e8]), list = d.shuffle([9e11, 99e10, 999e9, 9999e8]);
            return C(`1조보다 ${cut(gap)} 작은 수는?`, list.map(cut), list.indexOf(1e12 - gap), { explain: `${cut(1e12 - gap)}보다 ${cut(gap)} 큰 수가 1조이다.`, facts: { pick: { expr: `1000000000000-${gap}`, options: list }, unseen: [1e12], big: { shown: [[cut(gap), gap]] } } });
          }),
          T('jo-chain', '10배씩 커지는 수(조)', '①75 ③68', (d) => {
            const list = d.shuffle([1e12, 1e13, 1e8, 2e11]);
            return C('10배씩 커지는 수를 차례로 쓴 것이다. ㉠에 알맞은 수는?', list.map(cut), list.indexOf(1e12), { figure: chain(['10억', '×10', '100억', '×10', '1000억', '×10', box(LABELS[0])]), explain: '1000억의 10배는 1조이다.', facts: { pick: { expr: '100000000000*10', options: list }, unseen: [1e11] } });
          }),
          T('jo-10000', '10000배씩 커지는 수', '①76 ②75 심39', (d) => {
            const list = d.shuffle([1e12, 1e9, 1e11, 1e13]);
            return C('10000배씩 커지는 수를 차례로 쓴 것이다. ㉠에 알맞은 수는?', list.map(cut), list.indexOf(1e12), { figure: chain(['1', '×10000', '1만', '×10000', '1억', '×10000', box(LABELS[0])]), explain: '1의 10000배는 1만, 1만의 10000배는 1억, 1억의 10000배는 1조이다.', facts: { pick: { expr: '100000000*10000', options: list }, unseen: [1e8] } });
          }),
          T('jo-odd', '1조를 나타내는 것이 아닌 것', '①77 ②73 ③72 심22', (d) => {
            const rows = d.shuffle([['1000억이 10개인 수', '100000000000*10'], ['9999억보다 1억 큰 수', '999900000000+100000000'], ['100억이 100개인 수', '10000000000*100'], ['10억이 100개인 수', '1000000000*100']]);
            return C('1조를 나타내는 것이 아닌 것은?', rows.map((row) => row[0]), rows.findIndex((row) => row[1] === '1000000000*100'), { explain: '10억이 100개인 수는 1000억이다. 나머지는 모두 1조를 나타낸다.', facts: { big: { odd: rows.map((row) => row[1]) } } });
          }),
          T('jo-how-many', '몇억이 몇 개이면 1조', '②74 ③73', (d) => {
            const base = d.pick([1e11, 1e10, 1e9, 1e8]);
            return N(`${cut(base)}이 몇 개이면 1조가 되는가?`, 1e12 / base, { unit: '개', explain: `${cut(base)}이 ${1e12 / base}개이면 1조이다.`, facts: { calc: [[`1000000000000/${base}`, 0]], unseen: [1e12], big: { shown: [[cut(base), base]] } } });
          }),
          T('jo-count', '1조가 몇 개인 수 쓰기', '②76 ③74', (d) => {
            const k = d.int(12, 98);
            return N(`1조가 ${k}개인 수를 쓰면?`, k * 1e12, { explain: `1조가 ${k}개이면 ${k}조이다. 수로 쓰면 ${k * 1e12}이다.`, facts: { calc: [[`1000000000000*${k}`, 0]], unseen: [1e12] } });
          }),
          T('jo-compose', '조가 몇 개, 억이 몇 개인 수', '①79 ②79 ③79 심14', (d) => {
            const j = d.int(12, 98), e = d.bool() ? d.int(11, 99) : d.int(101, 999), n = big(j, e, 0), list = d.shuffle([n, big(j, e * 10, 0), j * 1e11 + e * 1e8, big(j, 0, e)]);
            return C(`조가 ${j}개, 억이 ${e}개인 수는?`, list.map(String), list.indexOf(n), { explain: `${cut(n)}이다. 억 단위에도 네 자리를 채워 쓴다.`, facts: { pick: { expr: `${j}*1000000000000+${e}*100000000`, options: list }, unseen: [1e12, 1e8] } });
          }),
          T('jo-decompose', '수를 조, 억, 만으로 나타내기', '①80 ②80 ③78', (d) => {
            const j = d.int(12, 980), e = d.int(11, 999), m = d.int(11, 999), n = big(j, e, m);
            return M('㉠, ㉡, ㉢에 알맞은 수는?', [{ label: LABELS[0], answer: j }, { label: LABELS[1], answer: e }, { label: LABELS[2], answer: m }], {
              figure: quote(`${josa(n, '은/는')} 조가 ${box(LABELS[0])}개, 억이 ${box(LABELS[1])}개, 만이 ${box(LABELS[2])}개인 수이다.`), explain: `일의 자리부터 네 자리씩 끊으면 ${cut(n)}이다.`,
              facts: { calc: [[`(${n}-${n}%1000000000000)/1000000000000`, 0], [`(${n}%1000000000000-${n}%100000000)/100000000`, 1], [`(${n}%100000000)/10000`, 2]], unseen: [1e12, 1e8, 1e4] }
            });
          }),
          T('jo-over', '10개가 넘는 묶음이 낀 수(조)', '①82 ②78 ③80·81', (d) => {
            // 틀린 보기: 1000억의 수를 그대로 조로 읽은 것, 한 자리 밀린 것, 숫자만 이어 쓴 것
            const a = d.int(11, 29), b = d.int(1, 9), n = a * 1e11 + b * 1e10, list = d.shuffle([n, a * 1e12 + b * 1e10, Math.floor(a / 10) * 1e12 + ((a % 10) * 100 + b * 10) * 1e8, (a * 10 + b) * 1e8]);
            return C(`1000억이 ${a}개, 100억이 ${b}개인 수는?`, list.map(cut), list.indexOf(n), { explain: `1000억이 10개이면 1조이다. 1000억이 ${a}개이면 ${cut(a * 1e11)}, 100억이 ${b}개이면 ${cut(b * 1e10)}이다.`, facts: { pick: { expr: `100000000000*${a}+10000000000*${b}`, options: list }, unseen: [1e11, 1e10] } });
          }),
          T('jo-10000-bundles', '몇억이 10000개인 수', '①83 ③80', (d) => {
            const k = d.int(2, 9) * d.pick([1, 10]), list = d.shuffle([k * 1e12, k * 1e11, k * 1e13, k * 1e10]);
            return C(`${k}억이 10000개이면 얼마인가?`, list.map(cut), list.indexOf(k * 1e12), { explain: `1억이 10000개이면 1조이므로 ${k}억이 10000개이면 ${k}조이다.`, facts: { pick: { expr: `${k}*100000000*10000`, options: list }, unseen: [1e8] } });
          }),
          T('jo-cut', '조, 억, 만 단위로 끊어 쓰기', '①84 ②83 ③77 심19', (d) => {
            const j = d.int(12, 98), e = d.int(1, 9) * 1000 + d.int(1, 9) * 10 + d.int(1, 9), m = d.int(1, 9) * 1000, n = big(j, e, m), list = d.shuffle([n, big(j, e, m / 10), big(j, Math.floor(e / 10), m), big(j, e, 0, m)]);
            return C(`${josa(n, '을/를')} 조, 억, 만 단위로 끊어 바르게 나타낸 것은?`, list.map(cut), list.indexOf(n), { explain: `일의 자리부터 네 자리씩 끊으면 ${j} / ${e} / ${m} / 0000이다. ${cut(n)}이다.`, facts: { rule: 'jo', big: { size: n, names: { value: n, given: String(n) } } } });
          }),
          T('jo-read', '조 단위 수 읽기', '①85·87·88 ②81 ③75', (d) => {
            const a = d.int(2, 8), c = d.int(1, 9), b = d.int(1, 9), n = big(a * 100 + c, b * 100, 0);
            const list = d.shuffle([n, big(a * 100 + c * 10, b * 100, 0), big(a * 100 + c, b * 1000, 0), big(a * 100 + c, 0, b * 100)]);
            return C(`${josa(n, '을/를')} 바르게 읽은 것은?`, list.map(say), list.indexOf(n), { explain: `일의 자리부터 네 자리씩 끊으면 ${cut(n)}이다. ${said(n)} 읽는다.`, facts: { rule: 'jo', big: { size: n, names: { value: n, given: String(n) } } } });
          }),
          T('jo-write', '읽은 수를 수로 쓰기(조)', '①86 ②82 ③76', (d) => {
            const j = d.int(2, 9) * 10, e = d.int(1, 9) * 100 + d.int(1, 9), n = big(j, e, 0), list = d.shuffle([n, n / 10, big(j, 0, e), big(j, e * 10, 0)]);
            return C('다음을 수로 바르게 쓴 것은?', list.map(String), list.indexOf(n), { figure: quote(say(n)), explain: `${say(n)} → ${cut(n)} → ${n}`, facts: { rule: 'jo', big: { size: n, shown: [[say(n), n]], names: { value: n, given: say(n) } } } });
          }),
          T('jo-both', '끊어 쓴 수를 수로 쓰기', '①89', (d) => {
            const n = big(d.int(2, 9), d.int(1, 9) * 100 + d.int(1, 9) * 10, 0);
            return N(`${named(n, cut(n), '을/를')} 수로 쓰면?`, n, { explain: `조 단위 아래로 억, 만, 일 단위에 네 자리씩 쓴다. ${n}`, facts: { big: { shown: [[cut(n), n]], written: [[cut(n), 0]] } } });
          }),
          T('jo-expand', '자릿값의 합(조)', '①90 ②84 ③82', (d) => {
            const ds = d.until(() => uniq(d, 4), (list) => list[0] <= 8), j = toNum(ds), [i, k] = d.pick([[1, 3], [0, 2], [1, 2], [0, 3]]), parts = ds.map((v, p) => (p === i ? box(LABELS[0]) : p === k ? box(LABELS[1]) : v * pow(3 - p) + '조'));
            return M('㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: ds[i] * pow(3 - i), unit: '조' }, { label: LABELS[1], answer: ds[k] * pow(3 - k), unit: '조' }], {
              figure: quote(`${j}조 = ${parts.join(' + ')}`), explain: `${j}조 = ${ds.map((v, p) => v * pow(3 - p) + '조').join(' + ')}`, facts: { calc: [[vx(j, 3 - i), 0], [vx(j, 3 - k), 1]], unseen: [pow(3 - i), pow(3 - k), 10] }
            });
          }),
          T('jo-place-name', '숫자의 자리 이름(조)', '①91 ②85·86', (d) => {
            const t = d.int(1, 8), k = d.int(12, 15), n = withDigit(d, 16, t, k);
            return C(`${n}에서 숫자 ${josa(t, '은/는')} 어느 자리 숫자인가?`, [12, 13, 14, 15].map((p) => PLACES[p] + '의 자리'), k - 12, { explain: `일의 자리부터 네 자리씩 끊으면 ${cut(n)}이다. 숫자 ${josa(t, '은/는')} ${PLACES[k]}의 자리 숫자이다.`, facts: { rule: 'jo', big: { size: n }, choose: { exprs: [12, 13, 14, 15].map((p) => dx(n, p)), rule: 'equals', target: t }, unseen: [1e12, 1e13, 1e14, 1e15, 10] } });
          }),
          T('jo-digit-value', '숫자가 나타내는 값(조)', '①92 ②87 ③83', (d) => {
            const t = d.int(1, 8), k = d.int(12, 15), n = withDigit(d, 16, t, k), list = d.shuffle([12, 13, 14, 15].map((p) => t * pow(p)));
            return C(`${n}에서 숫자 ${josa(t, '이/가')} 나타내는 값은?`, list.map(cut), list.indexOf(t * pow(k)), { explain: `일의 자리부터 네 자리씩 끊으면 ${cut(n)}이다. 숫자 ${josa(t, '은/는')} ${PLACES[k]}의 자리 숫자이므로 ${named(t * pow(k), cut(t * pow(k)), '을/를')} 나타낸다.`, facts: { rule: 'jo', big: { size: n }, pick: { expr: vx(n, k), options: list }, unseen: [pow(k), 10] } });
          }),
          T('jo-value-compare', '같은 숫자가 나타내는 값 비교', '①93·94 ②89', (d) => {
            const t = d.int(1, 9), [p, q] = d.shuffle(d.pick([[13, 12], [12, 10], [14, 11], [11, 9]])), ns = [withDigit(d, 15, t, p), withDigit(d, 15, t, q)];
            return C(`숫자 ${josa(t, '이/가')} 나타내는 값이 더 큰 수는?`, ns.map(String), p > q ? 0 : 1, { explain: `숫자 ${josa(t, '은/는')} ${ns[0]}에서 ${PLACES[p]}의 자리 숫자이고, ${ns[1]}에서 ${PLACES[q]}의 자리 숫자이다. 높은 자리에 있을수록 나타내는 값이 크다.`, facts: { choose: { exprs: [vx(ns[0], p), vx(ns[1], q)], rule: 'max' }, unseen: [pow(p), pow(q), 10] } });
          }),
          T('jo-zeros', '수로 쓸 때 0의 개수(조)', '①95 ②90', (d) => {
            const n = big(d.int(2, 9) * 10 + d.int(1, 9), d.int(1, 9) * 1000, 0);
            return N(`${named(n, say(n), '을/를')} 수로 쓰면 0은 모두 몇 개인가?`, String(n).split('0').length - 1, { unit: '개', explain: `수로 쓰면 ${n}이다.`, facts: { big: { zeros: [[say(n), 0]] } } });
          }),
          T('jo-times', '몇억을 1000배 한 수', '②91 ③86 심40', (d) => {
            const base = d.int(2, 9) * d.pick([1e9, 1e10]), list = d.shuffle([base * 1000, base * 100, base * 10000, base * 10]);
            return C(`${cut(base)}을 1000배 한 수는?`, list.map(cut), list.indexOf(base * 1000), { explain: `${cut(base)}의 10배는 ${cut(base * 10)}, 100배는 ${cut(base * 100)}, 1000배는 ${cut(base * 1000)}이다.`, facts: { pick: { expr: `${base}*1000`, options: list }, big: { shown: [[cut(base), base]] } } });
          }),
          T('jo-times-place', '몇 배 한 수에서 숫자의 자리', '③85', (d) => {
            const k = d.int(2, 9), mult = d.pick([10, 100, 1000]), result = k * 1e8 * mult, rows = [8, 9, 10, 11].map((p) => [PLACES[p] + '의 자리', digitAt(result, p) === k]);
            return C(`${k}억을 ${mult}배 한 수에서 숫자 ${josa(k, '은/는')} 어느 자리 숫자인가?`, rows.map((row) => row[0]), rows.findIndex((row) => row[1]), { explain: `${k}억의 ${mult}배는 ${cut(result)}이다. 숫자 ${josa(k, '은/는')} ${rows.find((row) => row[1])[0]} 숫자이다.`, facts: truthOf(rows, true) });
          })
        ]
      },
      // 아래 세 묶음의 문항은 4-1-1b.js가 채운다.
      { id: 'skip', title: '뛰어 세기', standard: ORDER, types: [] },
      { id: 'compare', title: '수의 크기 비교', standard: ORDER, types: [] },
      { id: 'make', title: '수 카드로 수 만들기', standard: ORDER, types: [] }
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
