// 3학년 1학기 1단원 덧셈과 뺄셈.
// 묶음은 배우는 차례(교과서의 차시가 아니라 내용 덩어리)이고, 묶음마다 기본과 실력 두 수준이 있다.
// 웬만한 문제는 기본에 두고, 여러 단계를 거치거나 조건이 얽힌 문제만 실력에 둔다.
// 문항은 모두 새로 쓴 것이다. 수는 씨앗에서 뽑으므로 풀 때마다 달라진다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { carryPlaces, borrowPlaces, count, plain, josa, name, NAMES, LABELS, box, expr, column, chars, blocks, cards } = B.kit;
  const CALC = '4수01-03', EST = '4수01-08';

  // ── 수 고르기 ────────────────────────────────────────────────
  const addPair = (d, rule) => d.pair((a, b) => plain(a) && plain(b) && a !== b && rule(carryPlaces(a, b), a, b));
  const subPair = (d, rule) => d.pair((a, b) => plain(a) && plain(b) && a - b >= 11 && rule(borrowPlaces(a, b), a, b));
  const ADD = {
    none: (c) => count(c) === 0,
    ones: (c) => c[0] && !c[1] && !c[2],
    tens: (c) => !c[0] && c[1] && !c[2],
    once: (c) => count(c) === 1 && !c[2],
    twice: (c) => c[0] && c[1] && !c[2],
    thrice: (c) => count(c) === 3,
    many: (c) => count(c) >= 2
  };
  const SUB = {
    none: (b) => count(b) === 0,
    ones: (b) => b[0] && !b[1],
    tens: (b) => !b[0] && b[1],
    once: (b) => count(b) === 1,
    twice: (b) => count(b) === 2,
    zeroTens: (b, a) => count(b) === 2 && Math.floor(a / 10) % 10 === 0
  };
  const result = (a, op, b) => (op === '+' ? a + b : a - b);
  const shown = (a, op, b) => expr(a, op, b, '=', result(a, op, b));

  // ── 여러 유형이 함께 쓰는 꼴 ──────────────────────────────────
  const rowItem = (a, op, b) => ({ text: '계산해 보세요.', figure: expr(a, op, b, '=', box()), inputs: [{ answer: result(a, op, b) }], explain: shown(a, op, b), facts: { op, a, b } });
  const colItem = (a, op, b) => ({ text: '세로로 계산해 보세요.', figure: column(chars(a), op, chars(b)), inputs: [{ answer: result(a, op, b) }], explain: shown(a, op, b), facts: { op, a, b } });
  const wordItem = (text, unit, a, op, b) => ({ text, inputs: [{ answer: result(a, op, b), unit }], explain: shown(a, op, b), facts: { op, a, b } });

  // 문장제: 모두 얼마(덧셈)
  function sumStory(d, a, b) {
    const who = d.pick(NAMES);
    return d.pick([
      () => wordItem(`텃밭에서 방울토마토를 지난주에 ${a}개, 이번 주에 ${b}개 땄습니다. 두 주 동안 딴 방울토마토는 모두 몇 개인가요?`, '개', a, '+', b),
      () => wordItem(`${name(who, '은/는')} 줄넘기를 아침에 ${a}번, 저녁에 ${b}번 했습니다. ${name(who, '이/가')} 하루 동안 한 줄넘기는 모두 몇 번인가요?`, '번', a, '+', b),
      () => wordItem(`${name(who, '은/는')} 어제 ${a}걸음, 오늘 ${b}걸음 걸었습니다. 이틀 동안 걸은 걸음은 모두 몇 걸음인가요?`, '걸음', a, '+', b),
      () => wordItem(`과학관에 오전에 ${a}명, 오후에 ${b}명이 들어왔습니다. 하루 동안 과학관에 들어온 사람은 모두 몇 명인가요?`, '명', a, '+', b),
      () => wordItem(`빨간 리본은 ${a}cm, 노란 리본은 ${b}cm입니다. 두 리본을 겹치지 않게 이어 붙이면 길이는 모두 몇 cm인가요?`, 'cm', a, '+', b),
      () => wordItem(`우리 반은 헌 종이를 ${a}장, 옆 반은 ${b}장 모았습니다. 두 반이 모은 헌 종이는 모두 몇 장인가요?`, '장', a, '+', b)
    ])();
  }
  // 문장제: 남은 것(뺄셈)
  function restStory(d, a, b) {
    const who = d.pick(NAMES);
    return d.pick([
      () => wordItem(`빵집에서 아침에 빵을 ${a}개 구웠습니다. 그 가운데 ${b}개를 팔았다면 남은 빵은 몇 개인가요?`, '개', a, '-', b),
      () => wordItem(`미술실 서랍에 색종이가 ${a}장 들어 있습니다. 만들기 시간에 ${b}장을 꺼내 썼다면 서랍에 남은 색종이는 몇 장인가요?`, '장', a, '-', b),
      () => wordItem(`${name(who, '이/가')} 맞추는 퍼즐은 모두 ${a}조각입니다. 지금까지 ${b}조각을 맞추었다면 더 맞추어야 하는 퍼즐은 몇 조각인가요?`, '조각', a, '-', b),
      () => wordItem(`집에서 공원까지는 ${a}m입니다. 집에서 출발해 ${b}m를 걸어왔다면 공원까지 남은 거리는 몇 m인가요?`, 'm', a, '-', b),
      () => wordItem(`주차장에 자리가 ${a}칸 있습니다. 차가 ${b}대 서 있다면 비어 있는 자리는 몇 칸인가요?`, '칸', a, '-', b)
    ])();
  }
  // 문장제: 얼마나 더(비교 뺄셈)
  function moreStory(d, a, b) {
    const [one, two] = d.shuffle(NAMES).slice(0, 2);
    return d.pick([
      () => wordItem(`운동장에 3학년이 ${a}명, 4학년이 ${b}명 모였습니다. 3학년은 4학년보다 몇 명 더 많은가요?`, '명', a, '-', b),
      () => wordItem(`${name(one, '은/는')} 구슬을 ${a}개, ${name(two, '은/는')} ${b}개 모았습니다. ${name(one, '이/가')} 모은 구슬은 ${name(two, '이/가')} 모은 구슬보다 몇 개 더 많은가요?`, '개', a, '-', b),
      () => wordItem(`산책길 가 길은 ${a}m, 나 길은 ${b}m입니다. 가 길은 나 길보다 몇 m 더 긴가요?`, 'm', a, '-', b),
      () => wordItem(`사과나무에서 사과를 ${a}개, 배나무에서 배를 ${b}개 땄습니다. 사과는 배보다 몇 개 더 많이 땄나요?`, '개', a, '-', b)
    ])();
  }

  // 가려진 숫자: 세로셈의 숫자 몇 개를 ㉠㉡…으로 가린다. 한 자리(일·십·백)에 하나씩만 가려 답이 하나로 정해지게 한다.
  function hiddenDigits(d, a, op, b, howMany) {
    const rows = [chars(a), chars(b), chars(result(a, op, b))];
    const places = d.shuffle([0, 1, 2]).slice(0, howMany).sort((x, y) => y - x);   // 0 = 일의 자리
    const inputs = [], masks = [];
    places.forEach((place, i) => {
      // 가릴 줄: 위(0)·아래(1)·결과(2). 그 자리에 숫자가 있는 줄만 고른다.
      const row = d.until(() => d.int(0, 2), (r) => rows[r].length > place);
      const at = rows[row].length - 1 - place;
      inputs.push({ label: LABELS[i], answer: Number(rows[row][at]) });
      masks.push({ row, place });
      rows[row][at] = box(LABELS[i]);
    });
    const names = inputs.map((input) => input.label);
    return {
      text: (names.length === 2 ? names.join('과 ') : names.join(', ')) + '에 알맞은 숫자를 구해 보세요.',
      figure: column(rows[0], op, rows[1], rows[2]),
      inputs, explain: shown(a, op, b), facts: { op, a, b, masks }
    };
  }

  // 수 카드 세 장으로 만드는 가장 큰 수와 가장 작은 수
  function cardItem(d, op) {
    const digits = d.until(() => d.shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 3), (list) => {
      const sorted = list.slice().sort((x, y) => y - x);
      const big = Number(sorted.join(''));
      const up = list.slice().sort((x, y) => x - y);
      const small = up[0] === 0 ? Number('' + up[1] + up[0] + up[2]) : Number(up.join(''));
      return (op === '+' ? ADD.many(carryPlaces(big, small)) : SUB.twice(borrowPlaces(big, small))) && big - small >= 11;
    });
    const down = digits.slice().sort((x, y) => y - x), up = digits.slice().sort((x, y) => x - y);
    const big = Number(down.join(''));
    const small = up[0] === 0 ? Number('' + up[1] + up[0] + up[2]) : Number(up.join(''));
    return {
      text: `수 카드 세 장을 한 번씩만 써서 세 자리 수를 만듭니다. 가장 큰 수와 가장 작은 수를 만들어 ${op === '+' ? '두 수를 더하면' : '큰 수에서 작은 수를 빼면'} 얼마인가요?`,
      figure: cards(digits),
      inputs: [{ answer: result(big, op, small) }],
      explain: `가장 큰 수는 ${big}, 가장 작은 수는 ${small}입니다. ` + shown(big, op, small),
      facts: { op, a: big, b: small, digits }
    };
  }

  // 어림셈에 쓰는 수: 몇백에 가까운 수
  const nearHundred = (d, lo, hi) => { const h = d.int(lo, hi) * 100; return h + d.pick([-1, 1]) * d.int(2, 12); };
  const toHundred = (n) => Math.round(n / 100) * 100;

  B.addUnit({
    id: '3-1-1', grade: 3, semester: 1, no: 1, title: '덧셈과 뺄셈',
    groups: [
      {
        id: 'add0', title: '받아올림이 없는 덧셈', standard: CALC,
        types: [
          { id: 'add0-row', level: '기본', title: '가로셈', count: 2, make: (d) => { const [a, b] = addPair(d, ADD.none); return rowItem(a, '+', b); } },
          { id: 'add0-col', level: '기본', title: '세로셈', count: 2, make: (d) => { const [a, b] = addPair(d, ADD.none); return colItem(a, '+', b); } },
          {
            id: 'add0-blocks', level: '기본', title: '수 모형 보고 더하기',
            make: (d) => {
              const [a, b] = addPair(d, (c, x, y) => ADD.none(c) && x + y < 700);
              return { text: '수 모형 가와 나가 나타내는 두 수를 더하면 얼마인가요?', figure: blocks(a, '가') + blocks(b, '나'), inputs: [{ answer: a + b }], explain: shown(a, '+', b), facts: { op: '+', a, b } };
            }
          },
          {
            id: 'add0-parts', level: '기본', title: '같은 자리끼리 더하기',
            make: (d) => {
              const [a, b] = addPair(d, (c, x, y) => ADD.none(c) && !/0/.test('' + x + y));
              const A = chars(a).map(Number), Bd = chars(b).map(Number);
              const parts = [[A[0] * 100, Bd[0] * 100], [A[1] * 10, Bd[1] * 10], [A[2], Bd[2]]];
              return {
                text: `${a} + ${josa(b, '을/를')} 같은 자리끼리 나누어 더하려고 합니다. ㉠, ㉡, ㉢, ㉣에 알맞은 수를 구해 보세요.`,
                figure: '<div class="mb-lines">'
                  + ['백의 자리', '십의 자리', '일의 자리'].map((label, i) => `<div><span class="mb-tag">${label}</span>${expr(parts[i][0], '+', parts[i][1], '=', box(LABELS[i]))}</div>`).join('')
                  + `<div><span class="mb-tag">모두</span>${expr(a, '+', b, '=', box(LABELS[3]))}</div></div>`,
                inputs: [...parts.map((p, i) => ({ label: LABELS[i], answer: p[0] + p[1] })), { label: LABELS[3], answer: a + b }],
                explain: shown(a, '+', b), facts: { op: '+', a, b, parts }
              };
            }
          },
          { id: 'add0-word', level: '기본', title: '문장제(모두 얼마)', make: (d) => { const [a, b] = addPair(d, ADD.none); return sumStory(d, a, b); } }
        ]
      },
      {
        id: 'add1', title: '받아올림이 한 번 있는 덧셈', standard: CALC,
        types: [
          { id: 'add1-row', level: '기본', title: '가로셈', count: 2, make: (d, n) => { const [a, b] = addPair(d, n === 0 ? ADD.ones : ADD.tens); return rowItem(a, '+', b); } },
          { id: 'add1-col', level: '기본', title: '세로셈', count: 2, make: (d, n) => { const [a, b] = addPair(d, n === 0 ? ADD.ones : ADD.tens); return colItem(a, '+', b); } },
          {
            id: 'add1-blocks', level: '기본', title: '수 모형 보고 더하기',
            make: (d) => {
              const [a, b] = addPair(d, (c, x, y) => ADD.ones(c) && x + y < 700);
              return { text: '수 모형 가와 나가 나타내는 두 수를 더하면 얼마인가요?', figure: blocks(a, '가') + blocks(b, '나'), inputs: [{ answer: a + b }], explain: shown(a, '+', b), facts: { op: '+', a, b } };
            }
          },
          {
            id: 'add1-compare', level: '기본', title: '계산 결과 비교',
            make: (d) => {
              const [a, b] = addPair(d, ADD.once);
              const [c, e] = d.until(() => addPair(d, ADD.once), ([x, y]) => Math.abs(x + y - (a + b)) <= 40 && x !== a && x !== b);
              const left = a + b, right = c + e;
              return {
                text: '두 덧셈의 계산 결과를 비교하여 ○ 안에 알맞은 기호를 골라 보세요.',
                figure: `<div class="mb-versus">${expr(a, '+', b)}<span class="mb-ring"></span>${expr(c, '+', e)}</div>`,
                choice: { options: ['&gt;', '=', '&lt;'], answer: left > right ? 0 : left === right ? 1 : 2 },
                explain: `${shown(a, '+', b)}, ${shown(c, '+', e)}`,
                facts: { compare: [[a, '+', b], [c, '+', e]] }
              };
            }
          },
          { id: 'add1-word', level: '기본', title: '문장제(모두 얼마)', make: (d) => { const [a, b] = addPair(d, ADD.once); return sumStory(d, a, b); } },
          { id: 'add1-hide', level: '실력', title: '가려진 숫자 찾기', count: 2, make: (d) => { const [a, b] = addPair(d, ADD.once); return hiddenDigits(d, a, '+', b, 2); } }
        ]
      },
      {
        id: 'add2', title: '받아올림이 여러 번 있는 덧셈', standard: CALC,
        types: [
          { id: 'add2-row', level: '기본', title: '가로셈', count: 2, make: (d, n) => { const [a, b] = addPair(d, n === 0 ? ADD.twice : ADD.thrice); return rowItem(a, '+', b); } },
          { id: 'add2-col', level: '기본', title: '세로셈', count: 2, make: (d, n) => { const [a, b] = addPair(d, n === 0 ? ADD.twice : ADD.thrice); return colItem(a, '+', b); } },
          {
            id: 'add2-best', level: '기본', title: '계산 결과가 가장 큰 것',
            make: (d) => {
              const pairs = d.until(() => [addPair(d, ADD.many), addPair(d, ADD.many), addPair(d, ADD.many)], (list) => {
                const sums = list.map(([x, y]) => x + y);
                return new Set(sums).size === 3 && Math.max(...sums) - Math.min(...sums) <= 150;
              });
              const sums = pairs.map(([x, y]) => x + y);
              return {
                text: '계산 결과가 가장 큰 것을 골라 보세요.',
                figure: '<div class="mb-lines">' + pairs.map(([x, y], i) => `<div><span class="mb-tag">${LABELS[i]}</span>${expr(x, '+', y)}</div>`).join('') + '</div>',
                choice: { options: LABELS.slice(0, 3), answer: sums.indexOf(Math.max(...sums)) },
                explain: pairs.map(([x, y], i) => `${LABELS[i]} ${shown(x, '+', y)}`).join(', '),
                facts: { best: pairs.map(([x, y]) => [x, '+', y]) }
              };
            }
          },
          { id: 'add2-word', level: '기본', title: '문장제(모두 얼마)', make: (d) => { const [a, b] = addPair(d, ADD.many); return sumStory(d, a, b); } },
          { id: 'add2-cards', level: '실력', title: '수 카드로 만든 수의 합', make: (d) => cardItem(d, '+') },
          { id: 'add2-hide', level: '실력', title: '가려진 숫자 찾기', count: 2, make: (d) => { const [a, b] = addPair(d, ADD.twice); return hiddenDigits(d, a, '+', b, 3); } }
        ]
      },
      {
        id: 'sub0', title: '받아내림이 없는 뺄셈', standard: CALC,
        types: [
          { id: 'sub0-row', level: '기본', title: '가로셈', count: 2, make: (d) => { const [a, b] = subPair(d, SUB.none); return rowItem(a, '-', b); } },
          { id: 'sub0-col', level: '기본', title: '세로셈', count: 2, make: (d) => { const [a, b] = subPair(d, SUB.none); return colItem(a, '-', b); } },
          {
            id: 'sub0-blocks', level: '기본', title: '수 모형 보고 빼기',
            make: (d) => {
              const [a, b] = subPair(d, (bw, x) => SUB.none(bw) && x < 700);
              return { text: `수 모형이 나타내는 수에서 ${josa(b, '을/를')} 빼면 얼마인가요?`, figure: blocks(a), inputs: [{ answer: a - b }], explain: shown(a, '-', b), facts: { op: '-', a, b } };
            }
          },
          {
            id: 'sub0-gap', level: '기본', title: '두 수의 차',
            make: (d) => {
              const [a, b] = subPair(d, SUB.none);
              const pair = d.shuffle([a, b]);
              return { text: '큰 수에서 작은 수를 빼면 얼마인가요?', figure: `<div class="mb-numbers"><span>${pair[0]}</span><span>${pair[1]}</span></div>`, inputs: [{ answer: a - b }], explain: shown(a, '-', b), facts: { op: '-', a, b } };
            }
          },
          { id: 'sub0-word', level: '기본', title: '문장제(남은 것)', make: (d) => { const [a, b] = subPair(d, SUB.none); return restStory(d, a, b); } }
        ]
      },
      {
        id: 'sub1', title: '받아내림이 한 번 있는 뺄셈', standard: CALC,
        types: [
          { id: 'sub1-row', level: '기본', title: '가로셈', count: 2, make: (d, n) => { const [a, b] = subPair(d, n === 0 ? SUB.ones : SUB.tens); return rowItem(a, '-', b); } },
          { id: 'sub1-col', level: '기본', title: '세로셈', count: 2, make: (d, n) => { const [a, b] = subPair(d, n === 0 ? SUB.ones : SUB.tens); return colItem(a, '-', b); } },
          {
            id: 'sub1-compare', level: '기본', title: '계산 결과 비교',
            make: (d) => {
              const [a, b] = subPair(d, SUB.once);
              const [c, e] = d.until(() => subPair(d, SUB.once), ([x, y]) => Math.abs(x - y - (a - b)) <= 40 && x !== a);
              const left = a - b, right = c - e;
              return {
                text: '두 뺄셈의 계산 결과를 비교하여 ○ 안에 알맞은 기호를 골라 보세요.',
                figure: `<div class="mb-versus">${expr(a, '-', b)}<span class="mb-ring"></span>${expr(c, '-', e)}</div>`,
                choice: { options: ['&gt;', '=', '&lt;'], answer: left > right ? 0 : left === right ? 1 : 2 },
                explain: `${shown(a, '-', b)}, ${shown(c, '-', e)}`,
                facts: { compare: [[a, '-', b], [c, '-', e]] }
              };
            }
          },
          { id: 'sub1-word', level: '기본', title: '문장제(얼마나 더)', make: (d) => { const [a, b] = subPair(d, SUB.once); return moreStory(d, a, b); } },
          { id: 'sub1-hide', level: '실력', title: '가려진 숫자 찾기', count: 2, make: (d) => { const [a, b] = subPair(d, (bw, x, y) => SUB.once(bw) && x - y >= 100); return hiddenDigits(d, a, '-', b, 2); } }
        ]
      },
      {
        id: 'sub2', title: '받아내림이 두 번 있는 뺄셈', standard: CALC,
        types: [
          { id: 'sub2-row', level: '기본', title: '가로셈', count: 2, make: (d, n) => { const [a, b] = subPair(d, n === 0 ? SUB.twice : SUB.zeroTens); return rowItem(a, '-', b); } },
          { id: 'sub2-col', level: '기본', title: '세로셈', count: 2, make: (d, n) => { const [a, b] = subPair(d, n === 0 ? SUB.twice : SUB.zeroTens); return colItem(a, '-', b); } },
          {
            id: 'sub2-fix', level: '기본', title: '잘못된 계산 바로잡기',
            make: (d) => {
              const [a, b] = subPair(d, (bw, x, y) => SUB.twice(bw) && x - y >= 100);
              // 받아내림을 하지 않고 자리마다 큰 숫자에서 작은 숫자를 뺀 잘못된 답
              const wrong = chars(a).map((ch, i) => Math.abs(Number(ch) - Number(chars(b)[i]))).join('');
              return {
                text: '아래 계산은 받아내림을 하지 않아 틀렸습니다. 바르게 계산하면 얼마인가요?',
                figure: column(chars(a), '-', chars(b), wrong.split('')),
                inputs: [{ answer: a - b }], explain: shown(a, '-', b), facts: { op: '-', a, b, wrong: Number(wrong) }
              };
            }
          },
          { id: 'sub2-word', level: '기본', title: '문장제(남은 것)', make: (d) => { const [a, b] = subPair(d, SUB.twice); return restStory(d, a, b); } },
          { id: 'sub2-cards', level: '실력', title: '수 카드로 만든 수의 차', make: (d) => cardItem(d, '-') },
          {
            id: 'sub2-range', level: '실력', title: '□에 들어갈 수 있는 수', count: 2,
            make: (d, n) => {
              if (n === 0) {
                // a − □ > c  →  □ < a − c
                const [a, c] = subPair(d, (bw, x, y) => SUB.twice(bw) && x - y >= 150);
                const limit = a - c;
                return {
                  text: '□ 안에 들어갈 수 있는 세 자리 수 가운데 가장 큰 수를 구해 보세요.',
                  figure: expr(a, '-', box(), '<i>&gt;</i>', c),
                  inputs: [{ answer: limit - 1 }],
                  explain: `${shown(a, '-', c)}이므로 □는 ${limit}보다 작아야 합니다. 가장 큰 수는 ${limit - 1}입니다.`,
                  facts: { range: 'a-x>c', a, c }
                };
              }
              // a + □ < c  →  □ < c − a
              const [c, a] = subPair(d, (bw, x, y) => SUB.twice(bw) && x - y >= 150);
              const limit = c - a;
              return {
                text: '□ 안에 들어갈 수 있는 세 자리 수 가운데 가장 큰 수를 구해 보세요.',
                figure: expr(a, '+', box(), '<i>&lt;</i>', c),
                inputs: [{ answer: limit - 1 }],
                explain: `${shown(c, '-', a)}이므로 □는 ${limit}보다 작아야 합니다. 가장 큰 수는 ${limit - 1}입니다.`,
                facts: { range: 'a+x<c', a, c }
              };
            }
          }
        ]
      },
      {
        id: 'est', title: '어림셈', standard: EST,
        types: [
          {
            id: 'est-sum', level: '기본', title: '몇백으로 어림해 더하기',
            make: (d) => {
              const a = nearHundred(d, 2, 5), b = d.until(() => nearHundred(d, 1, 4), (x) => toHundred(x) !== toHundred(a));
              return {
                text: `${a} + ${josa(b, '을/를')} 어림셈으로 구하려고 합니다. ㉠, ㉡, ㉢에 알맞은 수를 구해 보세요.`,
                figure: `<div class="mb-lines"><div>${josa(a, '은/는')} 약 ${box(LABELS[0])}</div><div>${josa(b, '은/는')} 약 ${box(LABELS[1])}</div><div>두 수의 합은 약 ${box(LABELS[2])}</div></div>`,
                inputs: [{ label: LABELS[0], answer: toHundred(a) }, { label: LABELS[1], answer: toHundred(b) }, { label: LABELS[2], answer: toHundred(a) + toHundred(b) }],
                explain: `${josa(a, '은/는')} ${toHundred(a)}에, ${josa(b, '은/는')} ${toHundred(b)}에 가깝습니다. ` + expr(toHundred(a), '+', toHundred(b), '=', toHundred(a) + toHundred(b)),
                facts: { estimate: '+', a, b }
              };
            }
          },
          {
            id: 'est-diff', level: '기본', title: '몇백으로 어림해 빼기',
            make: (d) => {
              const a = nearHundred(d, 5, 9), b = nearHundred(d, 1, 3);
              return {
                text: `${a} − ${josa(b, '을/를')} 어림셈으로 구하려고 합니다. ㉠, ㉡, ㉢에 알맞은 수를 구해 보세요.`,
                figure: `<div class="mb-lines"><div>${josa(a, '은/는')} 약 ${box(LABELS[0])}</div><div>${josa(b, '은/는')} 약 ${box(LABELS[1])}</div><div>두 수의 차는 약 ${box(LABELS[2])}</div></div>`,
                inputs: [{ label: LABELS[0], answer: toHundred(a) }, { label: LABELS[1], answer: toHundred(b) }, { label: LABELS[2], answer: toHundred(a) - toHundred(b) }],
                explain: `${josa(a, '은/는')} ${toHundred(a)}에, ${josa(b, '은/는')} ${toHundred(b)}에 가깝습니다. ` + expr(toHundred(a), '-', toHundred(b), '=', toHundred(a) - toHundred(b)),
                facts: { estimate: '-', a, b }
              };
            }
          },
          {
            id: 'est-pick', level: '기본', title: '어림한 값 고르기', count: 2,
            make: (d, n) => {
              const op = n === 0 ? '+' : '-';
              const a = op === '+' ? nearHundred(d, 2, 5) : nearHundred(d, 6, 9), b = nearHundred(d, 1, 3);
              const right = result(toHundred(a), op, toHundred(b));
              const shift = d.int(0, 2);   // 정답이 놓일 자리
              const options = [0, 1, 2].map((i) => right + (i - shift) * 100);
              return {
                text: '계산 결과는 약 얼마인가요? 어림셈으로 구해 알맞은 것을 골라 보세요.',
                figure: expr(a, op, b),
                choice: { options: options.map((v) => '약 ' + v), answer: shift },
                explain: `${josa(a, '은/는')} 약 ${toHundred(a)}, ${josa(b, '은/는')} 약 ${toHundred(b)}입니다. ` + expr(toHundred(a), op, toHundred(b), '=', right),
                facts: { estimate: op, a, b, options }
              };
            }
          },
          {
            id: 'est-word', level: '기본', title: '문장제(약 얼마)',
            make: (d) => {
              const a = nearHundred(d, 2, 5), b = nearHundred(d, 1, 4);
              const sum = toHundred(a) + toHundred(b);
              const made = d.pick([
                [`공연장에 어른이 ${a}명, 어린이가 ${b}명 들어왔습니다. 들어온 사람은 약 몇 명인지 어림셈으로 구해 보세요.`, '명'],
                [`농장에서 오전에 달걀을 ${a}개, 오후에 ${b}개 거두었습니다. 하루 동안 거둔 달걀은 약 몇 개인지 어림셈으로 구해 보세요.`, '개'],
                [`첫째 날에 ${a}m, 둘째 날에 ${b}m를 헤엄쳤습니다. 이틀 동안 헤엄친 거리는 약 몇 m인지 어림셈으로 구해 보세요.`, 'm']
              ]);
              return { text: made[0], inputs: [{ answer: sum, unit: made[1], lead: '약' }], explain: `${josa(a, '은/는')} 약 ${toHundred(a)}, ${josa(b, '은/는')} 약 ${toHundred(b)}입니다. ` + expr(toHundred(a), '+', toHundred(b), '=', sum), facts: { estimate: '+', a, b } };
            }
          },
          {
            id: 'est-budget', level: '실력', title: '정해진 돈으로 살 수 있는 두 가지', count: 2,
            make: (d) => {
              const goods = d.shuffle(['색연필', '공책 묶음', '물감', '스케치북', '가위', '필통', '줄자', '색종이 묶음']).slice(0, 4);
              const price = (lo, hi) => d.int(lo, hi) * 10;
              const cheap = d.until(() => [price(41, 49), price(41, 49)], ([x, y]) => x !== y);
              const dear = d.until(() => [price(61, 79), price(61, 79)], ([x, y]) => x !== y);
              const prices = [cheap[0], cheap[1], dear[0], dear[1]];
              const order = d.shuffle([0, 1, 2, 3]);                       // 물건을 늘어놓는 차례
              const list = order.map((k, i) => ({ name: goods[i], price: prices[k], kind: k }));
              const of = (kind) => list.find((row) => row.kind === kind);
              const pairs = d.shuffle([[0, 1], [0, 2], [1, 3], [2, 3]]);   // 싼 것 둘만 1000원 안쪽이다
              return {
                text: '1000원으로 서로 다른 물건 두 가지를 사려고 합니다. 살 수 있는 것을 골라 보세요.',
                figure: '<div class="mb-prices">' + list.map((row) => `<span><b>${row.name}</b>${row.price}원</span>`).join('') + '</div>',
                choice: { options: pairs.map(([x, y]) => `${of(x).name}, ${of(y).name}`), answer: pairs.findIndex(([x, y]) => x === 0 && y === 1) },
                explain: `${josa(of(0).name, '과/와')} ${of(1).name}의 값을 더하면 ${expr(of(0).price, '+', of(1).price, '=', cheap[0] + cheap[1])}(원)이라 1000원으로 살 수 있습니다. 다른 짝은 모두 1000원을 넘습니다.`,
                facts: { budget: 1000, prices: list.map((row) => row.price), pairs: pairs.map(([x, y]) => [of(x).price, of(y).price]) }
              };
            }
          }
        ]
      },
      {
        id: 'mix', title: '덧셈과 뺄셈 섞어 풀기', standard: CALC,
        types: [
          {
            id: 'mix-calc', level: '기본', title: '섞은 계산', count: 4,
            make: (d, n) => {
              if (n % 2 === 0) { const [a, b] = addPair(d, (c) => count(c) >= 1); return n === 0 ? rowItem(a, '+', b) : colItem(a, '+', b); }
              const [a, b] = subPair(d, (bw) => count(bw) >= 1); return n === 1 ? rowItem(a, '-', b) : colItem(a, '-', b);
            }
          },
          {
            id: 'mix-inverse', level: '기본', title: '□ 구하기', count: 2,
            make: (d, n) => {
              const [a, b] = subPair(d, (bw) => count(bw) >= 1);   // a − b = c,  b + c = a
              const c = a - b;
              const form = n === 0 ? d.pick(['x+b=a', 'b+x=a']) : d.pick(['a-x=c', 'x-b=c']);
              const made = {
                'x+b=a': [expr(box(), '+', b, '=', a), c, shown(a, '-', b)],
                'b+x=a': [expr(b, '+', box(), '=', a), c, shown(a, '-', b)],
                'a-x=c': [expr(a, '-', box(), '=', c), b, shown(a, '-', c)],
                'x-b=c': [expr(box(), '-', b, '=', c), a, shown(c, '+', b)]
              }[form];
              return { text: '□에 들어갈 수는 얼마인가요?', figure: made[0], inputs: [{ answer: made[1] }], explain: made[2], facts: { inverse: form, a, b, c } };
            }
          },
          {
            id: 'mix-ends', level: '기본', title: '가장 큰 수와 가장 작은 수',
            make: (d) => {
              const op = d.pick(['+', '-']);
              const three = d.until(() => [d.int(100, 999), d.int(100, 999), d.int(100, 999)], (list) => {
                const sorted = list.slice().sort((x, y) => x - y);
                return list.every(plain) && sorted[1] - sorted[0] >= 20 && sorted[2] - sorted[1] >= 20
                  && (op === '+' ? count(carryPlaces(sorted[2], sorted[0])) >= 1 : count(borrowPlaces(sorted[2], sorted[0])) >= 1);
              });
              const big = Math.max(...three), small = Math.min(...three);
              return {
                text: `세 수 가운데 가장 큰 수와 가장 작은 수를 골라 ${op === '+' ? '두 수를 더하면' : '큰 수에서 작은 수를 빼면'} 얼마인가요?`,
                figure: '<div class="mb-numbers">' + three.map((v) => `<span>${v}</span>`).join('') + '</div>',
                inputs: [{ answer: result(big, op, small) }],
                explain: `가장 큰 수는 ${big}, 가장 작은 수는 ${small}입니다. ` + shown(big, op, small),
                facts: { op, a: big, b: small, three }
              };
            }
          },
          {
            id: 'mix-best', level: '기본', title: '계산 결과가 가장 큰 것',
            make: (d) => {
              const add = () => ['+', addPair(d, (c) => count(c) >= 1 && !c[2])];
              const sub = () => ['-', subPair(d, (bw) => count(bw) >= 1)];
              const rows = d.until(() => [add(), sub(), d.bool() ? add() : sub()], (list) => {
                const values = list.map(([op, [x, y]]) => result(x, op, y));
                return new Set(values).size === 3 && Math.max(...values) - Math.min(...values) <= 300;
              });
              const order = d.shuffle(rows);
              const values = order.map(([op, [x, y]]) => result(x, op, y));
              return {
                text: '계산 결과가 가장 큰 것을 골라 보세요.',
                figure: '<div class="mb-lines">' + order.map(([op, [x, y]], i) => `<div><span class="mb-tag">${LABELS[i]}</span>${expr(x, op, y)}</div>`).join('') + '</div>',
                choice: { options: LABELS.slice(0, 3), answer: values.indexOf(Math.max(...values)) },
                explain: order.map(([op, [x, y]], i) => `${LABELS[i]} ${shown(x, op, y)}`).join(', '),
                facts: { best: order.map(([op, [x, y]]) => [x, op, y]) }
              };
            }
          },
          {
            id: 'mix-word', level: '기본', title: '문장제', count: 2,
            make: (d, n) => {
              if (n === 0) { const [a, b] = addPair(d, (c) => count(c) >= 1); return sumStory(d, a, b); }
              const [a, b] = subPair(d, (bw) => count(bw) >= 1);
              return d.bool() ? restStory(d, a, b) : moreStory(d, a, b);
            }
          },
          {
            id: 'mix-wrong', level: '실력', title: '잘못 계산한 어떤 수', count: 2,
            make: (d, n) => {
              if (n === 0) {
                // 더해야 하는데 뺐다: x − b = c  →  x = c + b, 바른 값 x + b
                const [x, b] = subPair(d, (bw, p, q) => count(bw) >= 1 && p + q <= 1500 && q >= 120);
                const c = x - b;
                return {
                  text: `어떤 수에 ${josa(b, '을/를')} 더하려다가 실수로 빼서 ${josa(c, '이/가')} 나왔습니다. 처음에 하려던 계산의 답은 얼마인가요?`,
                  inputs: [{ answer: x + b }],
                  explain: `어떤 수는 ${expr(c, '+', b, '=', x)}입니다. 바르게 계산하면 ${shown(x, '+', b)}입니다.`,
                  facts: { wrong: 'sub-for-add', x, b, c }
                };
              }
              // 빼야 하는데 더했다: x + b = c  →  x = c − b, 바른 값 x − b
              const [x, b] = subPair(d, (bw, p, q) => count(bw) >= 1 && p + q <= 999 && p - q >= 50 && q >= 120);
              const c = x + b;
              return {
                text: `어떤 수에서 ${josa(b, '을/를')} 빼려다가 실수로 더해서 ${josa(c, '이/가')} 나왔습니다. 처음에 하려던 계산의 답은 얼마인가요?`,
                inputs: [{ answer: x - b }],
                explain: `어떤 수는 ${expr(c, '-', b, '=', x)}입니다. 바르게 계산하면 ${shown(x, '-', b)}입니다.`,
                facts: { wrong: 'add-for-sub', x, b, c }
              };
            }
          },
          {
            id: 'mix-two', level: '실력', title: '두 번 계산하는 문장제',
            make: (d) => {
              const [a, b] = addPair(d, (c, x, y) => count(c) >= 1 && x + y <= 800);
              const rest = d.int(105, 990 - (a + b) > 105 ? Math.min(398, 990 - (a + b)) : 105);
              const total = a + b + rest;
              const made = d.pick([
                [`체육 창고에 공이 모두 ${total}개 있습니다. 그 가운데 축구공이 ${a}개, 농구공이 ${b}개이고 나머지는 배구공입니다. 배구공은 몇 개인가요?`, '개'],
                [`도서실에 책이 모두 ${total}권 있습니다. 그 가운데 동화책이 ${a}권, 과학책이 ${b}권이고 나머지는 만화책입니다. 만화책은 몇 권인가요?`, '권'],
                [`꽃밭에 꽃이 모두 ${total}송이 피었습니다. 그 가운데 튤립이 ${a}송이, 수선화가 ${b}송이이고 나머지는 팬지입니다. 팬지는 몇 송이인가요?`, '송이']
              ]);
              return {
                text: made[0], inputs: [{ answer: rest, unit: made[1] }],
                explain: `${shown(a, '+', b)}, ${expr(total, '-', a + b, '=', rest)}`,
                facts: { two: true, total, a, b, rest }
              };
            }
          },
          {
            id: 'mix-pair', level: '실력', title: '합이 되는 두 수 찾기',
            make: (d) => {
              const four = d.until(() => [d.int(120, 880), d.int(120, 880), d.int(120, 880), d.int(120, 880)], (list) => {
                if (!list.every(plain) || new Set(list).size < 4) return false;
                const sums = [];
                for (let i = 0; i < 4; i += 1) for (let j = i + 1; j < 4; j += 1) sums.push(list[i] + list[j]);
                // 여섯 합이 모두 달라야 답이 하나다. 일의 자리만 보고 찍지 못하게 일의 자리가 같은 합이 하나 더 있게 한다.
                return new Set(sums).size === 6 && sums.filter((s) => s % 10 === (list[0] + list[1]) % 10).length >= 2 && count(carryPlaces(list[0], list[1])) >= 1;
              });
              const target = four[0] + four[1];
              const shownList = d.shuffle(four);
              const pairs = d.shuffle([[four[0], four[1]], [four[0], four[2]], [four[1], four[3]], [four[2], four[3]]]);
              return {
                text: `네 수 가운데 두 수를 골라 더했더니 ${josa(target, '이/가')} 되었습니다. 더한 두 수를 골라 보세요.`,
                figure: '<div class="mb-numbers">' + shownList.map((v) => `<span>${v}</span>`).join('') + '</div>',
                choice: { options: pairs.map(([x, y]) => `${x}, ${y}`), answer: pairs.findIndex(([x, y]) => x === four[0] && y === four[1]) },
                explain: shown(four[0], '+', four[1]),
                facts: { target, four, pairs }
              };
            }
          },
          {
            id: 'mix-three', level: '실력', title: '세 수의 계산',
            make: (d) => {
              const [a, b] = addPair(d, (c, x, y) => count(c) >= 1 && x + y <= 999);
              const c = d.until(() => d.int(110, a + b - 20), (v) => plain(v) && count(borrowPlaces(a + b, v)) >= 1);
              return {
                text: '앞에서부터 차례대로 계산해 보세요.',
                figure: expr(a, '+', b, '-', c, '=', box()),
                inputs: [{ answer: a + b - c }],
                explain: `${shown(a, '+', b)}, ${shown(a + b, '-', c)}`,
                facts: { three: [a, '+', b, '-', c] }
              };
            }
          }
        ]
      }
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
