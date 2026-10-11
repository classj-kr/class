// 3학년 1학기 1단원 덧셈과 뺄셈 — 단원 틀과 기본 문항.
// 문항의 꼴은 수집해 둔 교과서 10종의 평가 자료(단원평가·형성평가·수학익힘의 기본 문서)에 나온 문제를 하나씩 따른 것이다.
// 꼴과 조건은 그대로 두고 수와 문장만 바꾼다. 실력 문항은 3-1-1b.js 에 있다(심화·실력·서술형 문서의 문제).
// 말투는 수능 문체다: "~을 구하시오.", "~은?", "~이다". "~세요 / ~습니다"는 쓰지 않는다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { carryPlaces, plain, josa, name, NAMES, LABELS, box, expr, column, chars, blocks, addPair, subPair, ADD, SUB, result, shown } = B.kit;
  const CALC = '4수01-03', EST = '4수01-08';
  const BASIC = '교과서 10종 단원평가·형성평가·수학익힘(기본)';

  // 문항 꼴 세 가지: 수 하나, 수 여럿, 고르기
  const N = (text, answer, o) => ({ text, figure: o.figure, inputs: [{ answer, unit: o.unit, lead: o.lead }], explain: o.explain || '', facts: o.facts || {} });
  const M = (text, inputs, o) => ({ text, figure: o.figure, inputs, explain: o.explain || '', facts: o.facts || {} });
  const C = (text, options, answer, o) => ({ text, figure: o.figure, choice: { options, answer }, explain: o.explain || '', facts: o.facts || {} });
  const E = (a, op, b) => `${a}${op}${b}`;
  const nick = (who) => name(who, '은/는').slice(0, -1);   // 서연이, 지우
  const lines = (rows) => '<div class="mb-lines">' + rows.map((row) => `<div>${row}</div>`).join('') + '</div>';
  const tagged = (list) => lines(list.map((html, i) => `<span class="mb-tag mb-tag-short">${LABELS[i]}</span>${html}`));
  const numbers = (list) => '<div class="mb-numbers">' + list.map((v) => `<span>${v}</span>`).join('') + '</div>';

  // ── 문장제(수집본의 상황을 따른다) ────────────────────────────
  const story = (text, unit, a, op, b) => N(text, result(a, op, b), { unit, explain: shown(a, op, b), facts: { calc: [[E(a, op, b), 0]], pair: [a, op, b] } });
  function sumStory(d, a, b) {
    const who = d.pick(NAMES);
    return d.pick([
      () => story(`${nick(who)}네 학교의 남학생은 ${a}명, 여학생은 ${b}명이다. ${nick(who)}네 학교의 학생은 모두 몇 명인가?`, '명', a, '+', b),
      () => story(`도서관에 동화책이 ${a}권, 역사책이 ${b}권 있다. 도서관에 있는 동화책과 역사책은 모두 몇 권인가?`, '권', a, '+', b),
      () => story(`행복 과수원에서 수확한 사과는 ${a}개, 건강 과수원에서 수확한 사과는 ${b}개이다. 두 과수원에서 수확한 사과는 모두 몇 개인가?`, '개', a, '+', b),
      () => story(`${name(who, '은/는')} 동화책을 어제 ${a}쪽, 오늘 ${b}쪽 읽었다. ${name(who, '이/가')} 어제와 오늘 읽은 동화책은 모두 몇 쪽인가?`, '쪽', a, '+', b),
      () => story(`집에서 학교까지의 거리는 ${a}m이고, 학교에서 도서관까지의 거리는 ${b}m이다. 집에서 학교를 지나 도서관까지의 거리는 몇 m인가?`, 'm', a, '+', b),
      () => story(`공연장 1층에 ${a}명, 2층에 ${b}명의 관람객이 입장하였다. 공연을 관람하는 관람객은 모두 몇 명인가?`, '명', a, '+', b),
      () => story(`도서관에 책이 ${a}권 있었다. 책을 ${b}권 더 들여왔을 때, 도서관의 책은 모두 몇 권인가?`, '권', a, '+', b),
      () => story(`과자 가게에 딸기 맛 과자가 ${a}개 있고, 초코 맛 과자는 딸기 맛 과자보다 ${b}개 더 많다. 초코 맛 과자는 몇 개인가?`, '개', a, '+', b)
    ])();
  }
  function restStory(d, a, b) {
    const who = d.pick(NAMES);
    return d.pick([
      () => story(`농장에서 닭을 ${a}마리 키우고 있었는데 그중 ${b}마리를 팔았다. 농장에 남은 닭은 몇 마리인가?`, '마리', a, '-', b),
      () => story(`${name(who, '은/는')} 전체가 ${a}쪽인 동화책을 ${b}쪽까지 읽었다. 책을 다 읽으려면 몇 쪽을 더 읽어야 하는가?`, '쪽', a, '-', b),
      () => story(`길이가 ${a}cm인 색 테이프 중 ${b}cm를 사용하였다. 남은 색 테이프의 길이는 몇 cm인가?`, 'cm', a, '-', b),
      () => story(`탑승할 수 있는 인원이 ${a}명인 비행기에 현재 ${b}명이 탑승하였다. 이 비행기에 더 탑승할 수 있는 인원은 몇 명인가?`, '명', a, '-', b),
      () => story(`${name(who, '은/는')} 딱지를 ${a}장 가지고 있었는데 딱지치기를 하여 ${b}장을 잃었다. ${name(who, '이/가')} 가진 딱지는 몇 장인가?`, '장', a, '-', b)
    ])();
  }
  function moreStory(d, a, b) {
    const [one, two] = d.shuffle(NAMES).slice(0, 2);
    return d.pick([
      () => story(`도서관에 동화책이 ${a}권, 위인전이 ${b}권 있다. 동화책은 위인전보다 몇 권 더 많은가?`, '권', a, '-', b),
      () => story(`영화관의 관람객이 어제는 ${b}명, 오늘은 ${a}명이었다. 오늘 관람객은 어제 관람객보다 몇 명 더 많은가?`, '명', a, '-', b),
      () => story(`귤 농장에서 귤을 어제는 ${b}개, 오늘은 ${a}개 땄다. 오늘은 어제보다 몇 개를 더 땄는가?`, '개', a, '-', b),
      () => story(`파란색 테이프의 길이는 ${a}cm, 노란색 테이프의 길이는 ${b}cm이다. 두 테이프의 길이의 차는 몇 cm인가?`, 'cm', a, '-', b),
      () => story(`학교에서 ${nick(one)}네 집까지의 거리는 ${a}m이고, 학교에서 ${nick(two)}네 집까지의 거리는 ${b}m이다. ${nick(two)}네 집은 ${nick(one)}네 집보다 학교에서 몇 m 더 가까운가?`, 'm', a, '-', b),
      () => story(`${name(one, '이/가')} 가진 구슬은 ${a}개이고, ${name(two, '이/가')} 가진 구슬은 ${nick(one)}보다 ${b}개 더 적다. ${name(two, '이/가')} 가진 구슬은 몇 개인가?`, '개', a, '-', b),
      () => story(`목련 마을에는 ${a}가구, 매화 마을에는 ${b}가구가 산다. 목련 마을은 매화 마을보다 몇 가구 더 많은가?`, '가구', a, '-', b)
    ])();
  }

  // ── 계산 묶음의 기본 문항 ─────────────────────────────────────
  // rules: 그 묶음의 받아올림·받아내림 조건 이름들(문항 차례에 따라 돌려 쓴다).
  function basics(g, op, rules, more) {
    const pick = op === '+' ? addPair : subPair, RULE = op === '+' ? ADD : SUB;
    const pair = (d, n, extra) => pick(d, (flags, a, b) => RULE[rules[n % rules.length]](flags, a, b) && (!extra || extra(a, b)));
    const calc = (a, b) => ({ calc: [[E(a, op, b), 0]], pair: [a, op, b], rule: true });
    const big = op === '+' ? '큰' : '작은';
    const list = [
      { id: g + '-row', level: '기본', title: '가로셈', count: 3, source: BASIC, make: (d, n) => { const [a, b] = pair(d, n); return N('다음을 계산하시오.', result(a, op, b), { figure: expr(a, op, b, '=', box()), explain: shown(a, op, b), facts: calc(a, b) }); } },
      { id: g + '-col', level: '기본', title: '세로셈', count: 3, source: BASIC, make: (d, n) => { const [a, b] = pair(d, n + 1); return N('다음을 계산하시오.', result(a, op, b), { figure: column(chars(a), op, chars(b)), explain: shown(a, op, b), facts: calc(a, b) }); } },
      { id: g + '-step', level: '기본', title: `몇만큼 더 ${big} 수`, source: BASIC, make: (d, n) => { const [a, b] = pair(d, n); return N(`${a}보다 ${b}만큼 더 ${big} 수를 구하시오.`, result(a, op, b), { explain: shown(a, op, b), facts: calc(a, b) }); } },
      {
        id: g + '-gap', level: '기본', title: op === '+' ? '두 수의 합' : '두 수의 차', source: BASIC,
        make: (d, n) => { const [a, b] = pair(d, n + 1); return N(`두 수의 ${op === '+' ? '합을' : '차를'} 구하시오.`, result(a, op, b), { figure: numbers(d.shuffle([a, b])), explain: shown(a, op, b), facts: calc(a, b) }); }
      },
      {
        id: g + '-blocks', level: '기본', title: '수 모형이 나타내는 수', source: BASIC,
        make: (d, n) => { const [a, b] = pair(d, n, (x, y) => x < 700 && (op === '-' || x + y < 1000)); return N(`수 모형이 나타내는 수보다 ${b}만큼 더 ${big} 수를 구하시오.`, result(a, op, b), { figure: blocks(a), explain: shown(a, op, b), facts: calc(a, b) }); }
      }
    ];
    return list.concat(more(pair, calc));
  }
  // 두 계산 결과의 크기 비교
  const compareType = (g, op, rule) => ({
    id: g + '-compare', level: '기본', title: '계산 결과 비교', source: BASIC,
    make: (d) => {
      const pick = op === '+' ? addPair : subPair;
      const [a, b] = pick(d, rule);
      const [c, e] = d.until(() => pick(d, rule), ([x, y]) => Math.abs(result(x, op, y) - result(a, op, b)) <= 40 && x !== a);
      const left = result(a, op, b), right = result(c, op, e);
      return C('두 계산 결과의 크기를 비교할 때, ○ 안에 알맞은 것은?', ['&gt;', '=', '&lt;'], left > right ? 0 : left === right ? 1 : 2,
        { figure: `<div class="mb-versus">${expr(a, op, b)}<span class="mb-ring"></span>${expr(c, op, e)}</div>`, explain: `${shown(a, op, b)}, ${shown(c, op, e)}`, facts: { choose: { exprs: [E(a, op, b), E(c, op, e)], rule: 'compare' } } });
    }
  });
  // 계산 결과가 가장 큰(작은) 것 / 계산 결과가 얼마인 것
  const three = (d, op, rule, spread) => d.until(() => { const pick = op === '+' ? addPair : subPair; return [pick(d, rule), pick(d, rule), pick(d, rule)]; }, (list) => {
    const values = list.map(([x, y]) => result(x, op, y));
    return new Set(values).size === 3 && Math.max(...values) - Math.min(...values) <= spread;
  });
  const bestType = (g, op, rule) => ({
    id: g + '-best', level: '기본', title: '계산 결과가 가장 큰(작은) 것', source: BASIC,
    make: (d, n, v) => {
      const pairs = three(d, op, rule, 150), values = pairs.map(([x, y]) => result(x, op, y));
      const want = v % 2 === 0 ? 'max' : 'min';
      return C(`계산 결과가 가장 ${want === 'max' ? '큰' : '작은'} 것은?`, LABELS.slice(0, 3), values.indexOf(want === 'max' ? Math.max(...values) : Math.min(...values)),
        { figure: tagged(pairs.map(([x, y]) => expr(x, op, y))), explain: pairs.map(([x, y], i) => `${LABELS[i]} ${shown(x, op, y)}`).join(', '), facts: { choose: { exprs: pairs.map(([x, y]) => E(x, op, y)), rule: want } } });
    }
  });
  const findType = (g, op, rule) => ({
    id: g + '-find', level: '기본', title: '계산 결과 찾기', source: BASIC,
    make: (d) => {
      const pairs = three(d, op, rule, 60), values = pairs.map(([x, y]) => result(x, op, y));
      const at = d.int(0, 2);
      return C(`계산 결과가 ${values[at]}인 것은?`, LABELS.slice(0, 3), at,
        { figure: tagged(pairs.map(([x, y]) => expr(x, op, y))), explain: pairs.map(([x, y], i) => `${LABELS[i]} ${shown(x, op, y)}`).join(', '), facts: { choose: { exprs: pairs.map(([x, y]) => E(x, op, y)), rule: 'equals', target: values[at] } } });
    }
  });
  // 잘못 계산한 것 바로잡기: 받아올림한 수를 더하지 않았거나, 받아내림을 하지 않은 답을 보여 준다.
  const fixType = (g, op, rule) => ({
    id: g + '-fix', level: '기본', title: '잘못된 계산 바로잡기', source: BASIC,
    make: (d) => {
      const pick = op === '+' ? addPair : subPair;
      const [a, b] = pick(d, (flags, x, y) => rule(flags, x, y) && (op === '+' || x - y >= 100));
      const A = chars(a).map(Number), Bd = chars(b).map(Number);
      const wrong = op === '+' ? A.map((v, i) => (i === 0 ? v + Bd[i] : (v + Bd[i]) % 10)).join('') : A.map((v, i) => Math.abs(v - Bd[i])).join('');
      return N(op === '+' ? '다음은 받아올림한 수를 더하지 않아 잘못 계산한 것이다. 바르게 계산한 값을 구하시오.' : '다음은 받아내림을 하지 않아 잘못 계산한 것이다. 바르게 계산한 값을 구하시오.', result(a, op, b),
        { figure: column(chars(a), op, chars(b), wrong.split('')), explain: shown(a, op, b), facts: { calc: [[E(a, op, b), 0]], pair: [a, op, b], rule: true, wrong: Number(wrong) } });
    }
  });
  // 받아올림한 수 1이 실제로 나타내는 값
  const carryType = (g, rule) => ({
    id: g + '-carry', level: '기본', title: '받아올림한 수가 나타내는 값', source: BASIC,
    make: (d, n, v) => {
      const fromOnes = v % 2 === 0;
      const [a, b] = addPair(d, (c, x, y) => rule(c, x, y) && (fromOnes ? c[0] : c[1]) && x + y < 1000);
      const above = fromOnes ? [box(1), ''] : [box(1), '', ''];
      return N('덧셈식에서 □ 안의 수 1이 실제로 나타내는 값은 얼마인가?', fromOnes ? 10 : 100,
        { figure: column(chars(a), '+', chars(b), chars(a + b), above), explain: fromOnes ? '일의 자리에서 받아올림한 수이므로 10을 나타낸다.' : '십의 자리에서 받아올림한 수이므로 100을 나타낸다.', facts: { carryValue: fromOnes ? 10 : 100, pair: [a, '+', b] } });
    }
  });
  const wordType = (g, title, countOf, make) => ({ id: g + '-word', level: '기본', title, count: countOf, source: BASIC, make });

  // ── 어림셈에 쓰는 수 ─────────────────────────────────────────
  const nearHundred = (d, lo, hi) => { const h = d.int(lo, hi) * 100; return h + d.pick([-1, 1]) * d.int(2, 12); };
  const toHundred = (n) => Math.round(n / 100) * 100;

  B.addUnit({
    id: '3-1-1', grade: 3, semester: 1, no: 1, title: '덧셈과 뺄셈',
    groups: [
      {
        id: 'add0', title: '받아올림이 없는 덧셈', standard: CALC,
        types: basics('add0', '+', ['none'], (pair) => [
          findType('add0', '+', ADD.none),
          wordType('add0', '문장제', 2, (d) => { const [a, b] = pair(d, 0); return sumStory(d, a, b); })
        ])
      },
      {
        id: 'add1', title: '받아올림이 한 번 있는 덧셈', standard: CALC,
        types: basics('add1', '+', ['ones', 'tens'], (pair) => [
          compareType('add1', '+', ADD.once), findType('add1', '+', ADD.once), fixType('add1', '+', ADD.once), carryType('add1', ADD.once),
          wordType('add1', '문장제', 2, (d, n) => { const [a, b] = pair(d, n); return sumStory(d, a, b); })
        ])
      },
      {
        id: 'add2', title: '받아올림이 여러 번 있는 덧셈', standard: CALC,
        types: basics('add2', '+', ['twice', 'thrice', 'many'], (pair) => [
          compareType('add2', '+', ADD.many), bestType('add2', '+', ADD.many), fixType('add2', '+', ADD.twice), carryType('add2', ADD.twice),
          wordType('add2', '문장제', 2, (d, n) => { const [a, b] = pair(d, n); return sumStory(d, a, b); })
        ])
      },
      {
        id: 'sub0', title: '받아내림이 없는 뺄셈', standard: CALC,
        types: basics('sub0', '-', ['none'], (pair) => [
          findType('sub0', '-', SUB.none),
          wordType('sub0', '문장제', 2, (d, n) => { const [a, b] = pair(d, 0); return n === 0 ? restStory(d, a, b) : moreStory(d, a, b); })
        ])
      },
      {
        id: 'sub1', title: '받아내림이 한 번 있는 뺄셈', standard: CALC,
        types: basics('sub1', '-', ['ones', 'tens'], (pair) => [
          compareType('sub1', '-', SUB.once), bestType('sub1', '-', SUB.once), fixType('sub1', '-', SUB.once),
          wordType('sub1', '문장제', 2, (d, n) => { const [a, b] = pair(d, n); return n === 0 ? restStory(d, a, b) : moreStory(d, a, b); })
        ])
      },
      {
        id: 'sub2', title: '받아내림이 두 번 있는 뺄셈', standard: CALC,
        types: basics('sub2', '-', ['twice', 'zeroTens'], (pair) => [
          compareType('sub2', '-', SUB.twice), bestType('sub2', '-', SUB.twice), fixType('sub2', '-', SUB.twice),
          wordType('sub2', '문장제', 2, (d, n) => { const [a, b] = pair(d, n); return n === 0 ? restStory(d, a, b) : moreStory(d, a, b); })
        ])
      },
      {
        id: 'est', title: '어림셈', standard: EST,
        types: [
          {
            id: 'est-sum', level: '기본', title: '몇백으로 어림하여 더하기', count: 2, source: BASIC,
            make: (d) => {
              const a = nearHundred(d, 2, 6), b = d.until(() => nearHundred(d, 1, 4), (x) => toHundred(x) !== toHundred(a));
              const ra = toHundred(a), rb = toHundred(b);
              return M(`${a} + ${josa(b, '이/가')} 약 얼마인지 어림셈으로 구하려고 한다. ㉠, ㉡, ㉢에 알맞은 수를 구하시오.`,
                [{ label: LABELS[0], answer: ra }, { label: LABELS[1], answer: rb }, { label: LABELS[2], answer: ra + rb }],
                { figure: lines([`${josa(a, '은/는')} 약 ${box(LABELS[0])}`, `${josa(b, '은/는')} 약 ${box(LABELS[1])}`, `${a} + ${josa(b, '은/는')} 약 ${box(LABELS[2])}`]), explain: `${josa(a, '은/는')} ${ra}에, ${josa(b, '은/는')} ${rb}에 가깝다. ` + expr(ra, '+', rb, '=', ra + rb), facts: { estimate: [a, '+', b] } });
            }
          },
          {
            id: 'est-diff', level: '기본', title: '몇백으로 어림하여 빼기', count: 2, source: BASIC,
            make: (d) => {
              const a = nearHundred(d, 5, 9), b = nearHundred(d, 1, 3), ra = toHundred(a), rb = toHundred(b);
              return M(`${a} − ${josa(b, '이/가')} 약 얼마인지 어림셈으로 구하려고 한다. ㉠, ㉡, ㉢에 알맞은 수를 구하시오.`,
                [{ label: LABELS[0], answer: ra }, { label: LABELS[1], answer: rb }, { label: LABELS[2], answer: ra - rb }],
                { figure: lines([`${josa(a, '은/는')} 약 ${box(LABELS[0])}`, `${josa(b, '은/는')} 약 ${box(LABELS[1])}`, `${a} − ${josa(b, '은/는')} 약 ${box(LABELS[2])}`]), explain: `${josa(a, '은/는')} ${ra}에, ${josa(b, '은/는')} ${rb}에 가깝다. ` + expr(ra, '-', rb, '=', ra - rb), facts: { estimate: [a, '-', b] } });
            }
          },
          {
            id: 'est-pick', level: '기본', title: '어림셈으로 구한 값 고르기', count: 2, source: BASIC,
            make: (d, n) => {
              const op = n === 0 ? '+' : '-';
              const a = op === '+' ? nearHundred(d, 2, 5) : nearHundred(d, 6, 9), b = nearHundred(d, 1, 3);
              const right = result(toHundred(a), op, toHundred(b)), shift = d.int(0, 2);
              const options = [0, 1, 2].map((i) => right + (i - shift) * 100);
              return C('다음 계산 결과를 어림셈으로 구한 값은?', options.map((v) => '약 ' + v), shift,
                { figure: expr(a, op, b), explain: `${josa(a, '은/는')} 약 ${toHundred(a)}, ${josa(b, '은/는')} 약 ${toHundred(b)}이다. ` + expr(toHundred(a), op, toHundred(b), '=', right), facts: { estimate: [a, op, b], options } });
            }
          },
          {
            id: 'est-expr', level: '기본', title: '어림셈을 하기 위한 식', source: BASIC,
            make: (d, n, v) => {
              const op = v % 2 === 0 ? '-' : '+';
              const a = d.int(op === '-' ? 4 : 2, op === '-' ? 9 : 5) * 100 - d.int(5, 20), b = d.int(1, 3) * 100 + d.int(5, 20);
              const ra = toHundred(a), rb = toHundred(b);
              const options = d.shuffle([[ra, rb], [ra - 100, rb], [ra, rb + 100]]);
              return C('다음 계산을 어림셈으로 구할 때, 어림셈을 하기 위한 식으로 알맞은 것은?', options.map(([x, y]) => expr(x, op, y)), options.findIndex(([x, y]) => x === ra && y === rb),
                { figure: expr(a, op, b), explain: `${josa(a, '은/는')} 약 ${ra}, ${josa(b, '은/는')} 약 ${rb}이다.`, facts: { estimateExpr: [a, op, b], options } });
            }
          },
          {
            id: 'est-word', level: '기본', title: '어림셈 문장제', count: 2, source: BASIC,
            make: (d, n) => {
              if (n === 0) {
                const a = nearHundred(d, 2, 5), b = d.until(() => nearHundred(d, 1, 4), (x) => x !== a), sum = toHundred(a) + toHundred(b);
                const [text, unit] = d.pick([
                  [`빨간색 끈 ${a}cm와 파란색 끈 ${b}cm를 사용하였다. 사용한 끈은 약 몇 cm인지 어림셈으로 구하시오.`, 'cm'],
                  [`동물원에 어른이 ${a}명, 어린이가 ${b}명 입장하였다. 입장한 사람은 약 몇 명인지 어림셈으로 구하시오.`, '명']
                ]);
                return N(text, sum, { unit, lead: '약', explain: `${josa(a, '은/는')} 약 ${toHundred(a)}, ${josa(b, '은/는')} 약 ${toHundred(b)}이다. ` + expr(toHundred(a), '+', toHundred(b), '=', sum), facts: { estimate: [a, '+', b] } });
              }
              const a = nearHundred(d, 5, 9), b = nearHundred(d, 1, 3), diff = toHundred(a) - toHundred(b);
              const [text, unit] = d.pick([
                [`끈 ${a}cm 중에서 ${b}cm를 사용하였다. 남은 끈의 길이는 약 몇 cm인지 어림셈으로 구하시오.`, 'cm'],
                [`구슬 ${a}개 중에서 ${b}개를 친구에게 주었다. 남은 구슬은 약 몇 개인지 어림셈으로 구하시오.`, '개']
              ]);
              return N(text, diff, { unit, lead: '약', explain: `${josa(a, '은/는')} 약 ${toHundred(a)}, ${josa(b, '은/는')} 약 ${toHundred(b)}이다. ` + expr(toHundred(a), '-', toHundred(b), '=', diff), facts: { estimate: [a, '-', b] } });
            }
          },
          {
            id: 'est-budget', level: '기본', title: '정해진 돈으로 살 수 있는 두 가지', source: BASIC,
            make: (d) => {
              const goods = d.shuffle(['보드게임', '곰 인형', '장난감 자동차', '로봇', '퍼즐', '팽이', '요요', '공깃돌']).slice(0, 4);
              const price = (lo, hi) => d.int(lo, hi) * 10;
              const cheap = d.until(() => [price(41, 49), price(41, 49)], ([x, y]) => x !== y);
              const dear = d.until(() => [price(61, 79), price(61, 79)], ([x, y]) => x !== y);
              const prices = [cheap[0], cheap[1], dear[0], dear[1]];
              const order = d.shuffle([0, 1, 2, 3]);
              const list = order.map((k, i) => ({ name: goods[i], price: prices[k], kind: k }));
              const of = (kind) => list.find((row) => row.kind === kind);
              const pairs = d.shuffle([[0, 1], [0, 2], [1, 3], [2, 3]]);
              return C('알뜰 장터에서 1000원으로 장난감을 두 가지 사려고 한다. 살 수 있는 것은?', pairs.map(([x, y]) => `${of(x).name}, ${of(y).name}`), pairs.findIndex(([x, y]) => x === 0 && y === 1),
                { figure: '<div class="mb-prices">' + list.map((row) => `<span><b>${row.name}</b>${row.price}원</span>`).join('') + '</div>', explain: `두 장난감의 값의 합이 1000원을 넘지 않아야 한다. ${josa(of(0).name, '과/와')} ${of(1).name}의 값의 합은 ${expr(of(0).price, '+', of(1).price, '=', cheap[0] + cheap[1])}(원)이다.`, facts: { budget: 1000, prices: list.map((row) => row.price), pairs: pairs.map(([x, y]) => [of(x).price, of(y).price]) } });
            }
          }
        ]
      },
      {
        id: 'mix', title: '덧셈과 뺄셈 섞어 풀기', standard: CALC,
        types: [
          {
            id: 'mix-calc', level: '기본', title: '덧셈과 뺄셈', count: 4, source: BASIC,
            make: (d, n) => {
              const op = n % 2 === 0 ? '+' : '-';
              const [a, b] = op === '+' ? addPair(d, ADD.any) : subPair(d, SUB.any);
              return N('다음을 계산하시오.', result(a, op, b), { figure: n < 2 ? expr(a, op, b, '=', box()) : column(chars(a), op, chars(b)), explain: shown(a, op, b), facts: { calc: [[E(a, op, b), 0]] } });
            }
          },
          {
            id: 'mix-inverse', level: '기본', title: '□ 안에 알맞은 수', count: 2, source: BASIC,
            make: (d, n) => {
              const [a, b] = subPair(d, SUB.any), c = a - b;   // a − b = c
              const form = n === 0 ? d.pick(['x+b=a', 'b+x=a']) : d.pick(['a-x=c', 'x-b=c']);
              const made = { 'x+b=a': [expr(box(), '+', b, '=', a), c, shown(a, '-', b), E(a, '-', b)], 'b+x=a': [expr(b, '+', box(), '=', a), c, shown(a, '-', b), E(a, '-', b)], 'a-x=c': [expr(a, '-', box(), '=', c), b, shown(a, '-', c), E(a, '-', c)], 'x-b=c': [expr(box(), '-', b, '=', c), a, shown(c, '+', b), E(c, '+', b)] }[form];
              return N('□ 안에 알맞은 수를 구하시오.', made[1], { figure: made[0], explain: made[2], facts: { calc: [[made[3], 0]], inverse: [form, a, b, c] } });
            }
          },
          {
            id: 'mix-what', level: '기본', title: '어떤 수 구하기', count: 2, source: BASIC,
            make: (d, n) => {
              const [a, b] = subPair(d, SUB.any), c = a - b;
              return n === 0
                ? N(`어떤 수에 ${josa(b, '을/를')} 더하였더니 ${josa(a, '이/가')} 되었다. 어떤 수를 구하시오.`, c, { explain: shown(a, '-', b), facts: { calc: [[E(a, '-', b), 0]] } })
                : N(`어떤 수에서 ${josa(b, '을/를')} 빼었더니 ${josa(c, '이/가')} 되었다. 어떤 수를 구하시오.`, a, { explain: shown(c, '+', b), facts: { calc: [[E(c, '+', b), 0]] } });
            }
          },
          {
            id: 'mix-both', level: '기본', title: '두 수의 합과 차', source: BASIC,
            make: (d) => {
              const [a, b] = subPair(d, (bw, x, y) => SUB.any(bw) && ADD.any(carryPlaces(x, y)));
              return M('두 수의 합과 차를 각각 구하시오.', [{ label: '합', answer: a + b }, { label: '차', answer: a - b }], { figure: numbers(d.shuffle([a, b])), explain: `${shown(a, '+', b)}, ${shown(a, '-', b)}`, facts: { calc: [[E(a, '+', b), 0], [E(a, '-', b), 1]] } });
            }
          },
          {
            id: 'mix-ends', level: '기본', title: '가장 큰 수와 가장 작은 수', source: BASIC,
            make: (d, n, v) => {
              const op = v % 2 === 0 ? '-' : '+';
              const list = d.until(() => Array.from({ length: d.int(4, 5) }, () => d.int(100, 999)), (xs) => {
                const sorted = xs.slice().sort((x, y) => x - y);
                return xs.every(plain) && sorted.every((x, i) => i === 0 || x - sorted[i - 1] >= 15);
              });
              const big = Math.max(...list), small = Math.min(...list);
              return N(`가장 큰 수와 가장 작은 수의 ${op === '+' ? '합을' : '차를'} 구하시오.`, result(big, op, small), { figure: numbers(list), explain: `가장 큰 수는 ${big}, 가장 작은 수는 ${small}이다. ` + shown(big, op, small), facts: { calc: [[E(big, op, small), 0]], ends: list } });
            }
          },
          {
            id: 'mix-right', level: '기본', title: '계산 결과가 바른 것', source: BASIC,
            make: (d) => {
              const rows = [['+', addPair(d, ADD.any)], ['-', subPair(d, SUB.any)], ['+', addPair(d, ADD.once)]];
              const good = d.int(0, 2);
              const said = rows.map(([op, [a, b]], i) => result(a, op, b) + (i === good ? 0 : d.pick([-10, -1, 1, 10])));
              return C('계산 결과가 바른 것은?', LABELS.slice(0, 3), good,
                { figure: tagged(rows.map(([op, [a, b]], i) => expr(a, op, b, '=', said[i]))), explain: rows.map(([op, [a, b]], i) => `${LABELS[i]} ${shown(a, op, b)}`).join(', '), facts: { claimed: rows.map(([op, [a, b]], i) => [E(a, op, b), said[i]]) } });
            }
          },
          {
            id: 'mix-word', level: '기본', title: '문장제', count: 3, source: BASIC,
            make: (d, n) => {
              if (n === 0) { const [a, b] = addPair(d, ADD.any); return sumStory(d, a, b); }
              const [a, b] = subPair(d, SUB.any);
              return n === 1 ? restStory(d, a, b) : moreStory(d, a, b);
            }
          }
        ]
      }
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
