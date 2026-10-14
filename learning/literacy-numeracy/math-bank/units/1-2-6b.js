// 1학년 2학기 6단원 덧셈과 뺄셈(3) — 나머지 기본 문항(빈칸에 알맞은 수, 수를 골라 계산하기, 규칙이 있는 덧셈과 뺄셈,
// 덧셈식과 뺄셈식 만들기, 문장제)과 실력 문항.
//
// 이 단원에서 아이들이 흔히 잘못 아는 것(실력 문항은 여기서 나온다)
//  - 34 + 5 를 세로로 쓸 때 5를 3 아래에 맞추어 84 라고 한다. 4 + 53 처럼 한 자리 수가 앞에 오면 4를 5에 더해 93 이라고 한다.
//  - 「몇십」과 「몇」을 가리지 않는다: 40 + 3, 40 + 30, 43 + 30 을 같은 것으로 본다. 30 + 40 을 7 이나 700 이라고 쓴다.
//  - 낱말만 보고 식을 고른다: 「더 많다」가 있으면 무조건 더하거나(몇 개 더 많은가 → 뺄셈), 「남은」이 있으면 무조건 뺀다.
//    「몇 개를 더 모아야 하는가」는 「더」가 있어도 뺄셈이고, 「먹은 것」을 물어도 뺄셈이다(처음 것 − 남은 것).
//  - 덜어 낸 그림에서 남은 것만 세어 그 수에서 다시 뺀다(전체가 얼마인지 보지 않는다).
//  - 수 모형이 가지런하지 않으면 10개씩 묶음과 낱개를 가려 세지 못한다.
//
// 실력에 실은 것은 두 갈래다.
//  ① 문제의 상황·그림에 함정이 있어 배운 뜻을 정확히 대야 풀리는 것: h-align(2), h-front, h-mix3, h-more, h-left, h-pic-expr, h-scatter, h-need, h-gap, h-gave, h-hide(2)
//  ② 두 번 넘게 생각해야 풀리는 것: h-cards
// 싣지 않은 꼴과 까닭은 1-2-6a.js 머리에 적었다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { josa, name, nick, NAMES, LABELS, box, expr, column, chars, cards, chain, table, lines, numbers, N, M, C, E, result, shown } = B.kit;
  const { UNIT, CALC, MEAN, T, tens, ones, noCarry, noBorrow, two, ADD, SUB, why, calcFacts, fix, bundles, tiles } = B.kit.g126;
  const H = (id, title, ref, make, more) => Object.assign({ id, level: '실력', title, source: '수집본 ' + (/^심/.test(ref) ? '심화' : '기본') + ' 자료(' + ref + ')', make }, more || {});
  const distinct = (xs) => new Set(xs).size === xs.length;
  const tag = (word) => `<span class="mb-tag">${word}</span>`;
  // 한 번 계산하는 문장제
  const word = (text, unit, a, op, b, how) => N(text, result(a, op, b), { unit, explain: (how ? how + ' ' : '') + why(a, op, b), facts: { calc: [[E(a, op, b), 0]] } });

  // ── 그림 ─────────────────────────────────────────────────────
  // 두 자리 수가 놓이는 화살표 칸은 좁게 그린다(칸 셋이 휴대폰 한 줄에 들어가게).
  const slim = (html) => html.replace(/class="mb-node"/g, 'class="mb-node" style="min-width:2.2em;padding:5px 4px"').replace(/class="mb-step"/g, 'class="mb-step" style="min-width:3em;padding:0 3px 12px"');
  // 한 줄로 놓인 수와, 옆에 있는 두 수 사이의 빈칸
  function between(list, tags) {
    const gap = 68, r = 15, x = (i) => 22 + i * gap, y = 24, width = 44 + (list.length - 1) * gap;
    let out = `<line class="mb-axis" x1="${x(0)}" y1="${y}" x2="${x(list.length - 1)}" y2="${y}"/>`;
    list.forEach((v, i) => { out += `<circle class="mb-shape" cx="${x(i)}" cy="${y}" r="${r}"/><text x="${x(i)}" y="${y + 4.6}" text-anchor="middle" style="font-size:13px;font-weight:700;fill:#1f2933">${v}</text>`; });
    for (let i = 0; i + 1 < list.length; i += 1) {
      const cx = x(i) + gap / 2;
      out += `<rect x="${cx - 11}" y="${y - 11}" width="22" height="22" rx="3" style="fill:#fff;stroke:#1f2933;stroke-width:1.5"/><text x="${cx}" y="${y + 4.4}" text-anchor="middle" style="font-size:12px;font-weight:600;fill:#1f2933">${tags[i]}</text>`;
    }
    return `<svg class="mb-numberline" viewBox="0 0 ${width} 48" width="${Math.round(width * 1.14)}" role="img" aria-label="한 줄로 놓인 수: ${list.join(', ')}. 옆에 있는 두 수 사이마다 빈칸 ${tags.slice(0, list.length - 1).join(', ')}">${out}</svg>`;
  }
  // 수가 하나씩 적힌 모양들. list: [['circle' | 'triangle' | 'square', 수], …] — 그림 설명에 모양과 수를 적는다.
  function shapeNums(list) {
    const SIGN = { circle: '○', triangle: '△', square: '□' };
    let out = '';
    list.forEach(([kind, value], i) => {
      const cx = 22 + i * 42;
      if (kind === 'circle') out += `<circle class="mb-shape" cx="${cx}" cy="22" r="17"/>`;
      else if (kind === 'triangle') out += `<path class="mb-shape" d="M${cx} 3L${cx + 20} 39H${cx - 20}Z"/>`;
      else out += `<rect class="mb-shape" x="${cx - 17}" y="5" width="34" height="34"/>`;
      out += `<text class="mb-shape-text" x="${cx}" y="${kind === 'triangle' ? 33.5 : 25.5}" text-anchor="middle">${value}</text>`;
    });
    return `<svg class="mb-shapes" viewBox="0 0 ${list.length * 42 + 2} 42" width="${list.length * 70 + 4}" role="img" aria-label="모양에 적힌 수: ${list.map(([kind, value]) => SIGN[kind] + ' 모양 ' + value).join(', ')}">${out}</svg>`;
  }
  // 이름과 수가 적힌 물건들
  const goods = (rows) => '<div class="mb-prices">' + rows.map(([what, n]) => `<span><b>${what}</b>${n}개</span>`).join('') + '</div>';
  const KINDS = [['지우개', '풀', '가위'], ['사과', '귤', '감'], ['감자', '양파', '오이'], ['사탕', '젤리', '과자']];
  // 섞여 놓인 수 모형: 낱개를 한두 개씩 갈라 십 모형 사이사이에 높이를 달리하여 놓는다.
  function scattered(t, o, d, label) {
    const parts = []; let rest = o;
    while (rest > 0) { const c = Math.min(rest, d.int(1, 2)); parts.push(c); rest -= c; }
    const gaps = d.until(() => parts.map(() => d.int(0, t)), (list) => list.some((g) => g < t) && new Set(list).size >= Math.min(2, list.length));
    let x = 4, body = '';
    for (let g = 0; g <= t; g += 1) {
      parts.forEach((c, i) => {
        if (gaps[i] !== g) return;
        const y0 = d.pick([7, 16, 25]);
        for (let k = 0; k < c; k += 1) body += `<rect class="mb-one" x="${fix(x)}" y="${fix(y0 + k * 7.4)}" width="5.4" height="5.4" rx="1"/>`;
        x += 8.6;
      });
      if (g < t) {
        let ticks = '';
        for (let k = 1; k < 10; k += 1) ticks += `<path d="M${fix(x)} ${fix(6 + k * 3.4)}h5"/>`;
        body += `<g class="mb-rod"><rect x="${fix(x)}" y="6" width="5" height="34" rx="1"/>${ticks}</g>`;
        x += 8.6;
      }
    }
    const width = Math.max(x + 3, 60);
    return `<figure class="mb-blocks"><figcaption>${label}</figcaption><svg viewBox="0 0 ${fix(width)} 46" width="${Math.round(width * 2.1)}" role="img" aria-label="수 모형: 십 모형 ${t}개와 일 모형 ${o}개가 섞여 놓여 있다">${body}</svg></figure>`;
  }

  // ── 빈칸에 알맞은 수: 수 상자, 화살표, 표 ─────────────────────
  B.addGroup(UNIT, {
    id: 'box', title: '빈칸에 알맞은 수', standard: CALC,
    types: [
      T('box-sum', '두 수의 합', '①41', (d) => {
        const [a, b] = ADD.f(d);
        return N('두 수의 합은?', a + b, { figure: numbers([a, b]), explain: why(a, '+', b), facts: calcFacts(a, '+', b, 'box-sum') });
      }),
      T('box-diff', '두 수의 차', '①42', (d) => {
        const [a, b] = SUB.f(d);
        return N('두 수의 차는?', a - b, { figure: numbers([b, a]), explain: '큰 수에서 작은 수를 뺀다. ' + why(a, '-', b), facts: calcFacts(a, '-', b, 'box-diff') });
      }),
      T('box-arrow', '화살표를 따라 계산하기', '①43 심4', (d) => {
        const [a, b] = SUB.f(d);
        return N('□ 안에 알맞은 수는?', a - b, { figure: chain([a, '-' + b, box()]), explain: why(a, '-', b), facts: calcFacts(a, '-', b, 'box-arrow') });
      }),
      T('box-fork', '한 수에 몇십과 몇을 더하기', '①43', (d) => {
        // 24 → +30, 24 → +3
        const a = d.int(1, 5) * 10 + d.int(1, 5), k = d.int(2, 4);
        return M('㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: a + k * 10 }, { label: LABELS[1], answer: a + k }], {
          figure: lines([chain([a, '+' + k * 10, box(LABELS[0])]), chain([a, '+' + k, box(LABELS[1])])]),
          explain: `${josa(k * 10, '은/는')} 10개씩 묶음끼리 더하고, ${josa(k, '은/는')} 낱개끼리 더한다. ${shown(a, '+', k * 10)}, ${shown(a, '+', k)}`,
          facts: { calc: [[E(a, '+', k * 10), 0], [E(a, '+', k), 1]] }
        });
      }),
      T('box-chain', '화살표를 따라 차례로 계산하기', '①47 심7', (d) => {
        // 23 → +36 → ㉠ → −12 → ㉡. 칸마다 답하므로 한 번에 한 가지 계산만 한다.
        const [a, b] = ADD.f(d), s = a + b, c = d.int(1, tens(s) - 1) * 10 + d.int(1, ones(s));
        return M('㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: s }, { label: LABELS[1], answer: s - c }], {
          figure: slim(chain([a, '+' + b, box(LABELS[0]), '-' + c, box(LABELS[1])])),
          explain: `${shown(a, '+', b)}, ${shown(s, '-', c)}`,
          facts: { calc: [[`${a}+${b}`, 0], [`${a}+${b}-${c}`, 1]] }
        });
      }),
      T('box-same-add', '여러 수에 같은 수 더하기', '①44 심5', (d) => {
        // 34, 44, 54 에 11 을 더한다.
        const kt = d.int(1, 3), ko = d.int(1, 4), k = kt * 10 + ko, x = d.int(1, 7 - kt) * 10 + d.int(1, 9 - ko), list = [x, x + 10, x + 20];
        return M(`수에 ${josa(k, '을/를')} 더하여 빈칸에 쓴다. ㉠, ㉡, ㉢에 알맞은 수는?`, list.map((v, i) => ({ label: LABELS[i], answer: v + k })), {
          figure: table(['수', '+' + k], list.map((v, i) => [v, box(LABELS[i])])),
          explain: list.map((v) => shown(v, '+', k)).join(', '),
          facts: { calc: list.map((v, i) => [E(v, '+', k), i]) }
        });
      }),
      T('box-same-sub', '여러 수에서 같은 수 빼기', '심5', (d) => {
        // 87, 88, 89 에서 12 를 뺀다.
        const kt = d.int(1, 3), ko = d.int(1, 5), k = kt * 10 + ko, x = d.int(kt + 1, 9) * 10 + d.int(ko, 7), list = [x, x + 1, x + 2];
        return M(`수에서 ${josa(k, '을/를')} 빼어 빈칸에 쓴다. ㉠, ㉡, ㉢에 알맞은 수는?`, list.map((v, i) => ({ label: LABELS[i], answer: v - k })), {
          figure: table(['수', '−' + k], list.map((v, i) => [v, box(LABELS[i])])),
          explain: list.map((v) => shown(v, '-', k)).join(', '),
          facts: { calc: list.map((v, i) => [E(v, '-', k), i]) }
        });
      }),
      T('box-table', '두 수의 합을 표에 채우기', '①45 심6', (d) => {
        const rows = d.until(() => [d.int(1, 3) * 10 + d.int(1, 4), d.int(1, 3) * 10 + d.int(1, 4)], distinct);
        const cols = d.until(() => [d.int(1, 5) * 10 + d.int(1, 5), d.int(1, 5) * 10 + d.int(1, 5)], distinct);
        const cells = [[rows[0], cols[0]], [rows[0], cols[1]], [rows[1], cols[0]], [rows[1], cols[1]]];
        return M('왼쪽의 수와 위쪽의 수를 더하여 빈칸에 쓴다. ㉠, ㉡, ㉢, ㉣에 알맞은 수는?', cells.map(([p, q], i) => ({ label: LABELS[i], answer: p + q })), {
          figure: table(['+', cols[0], cols[1]], [[rows[0], box(LABELS[0]), box(LABELS[1])], [rows[1], box(LABELS[2]), box(LABELS[3])]]),
          explain: cells.map(([p, q], i) => `${LABELS[i]} ${shown(p, '+', q)}`).join(', '),
          facts: { calc: cells.map(([p, q], i) => [E(p, '+', q), i]) }
        });
      }),
      T('box-between', '옆에 있는 두 수의 차', '①46', (d) => {
        // 어느 두 수를 빼도 받아내림이 없게, 큰 수일수록 낱개의 수도 크거나 같게 고른다.
        const list = d.until(() => {
          const ts = d.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 4).sort((p, q) => p - q), os = Array.from({ length: 4 }, () => d.int(0, 9)).sort((p, q) => p - q);
          return d.shuffle(ts.map((t, i) => t * 10 + os[i]));
        }, (xs) => new Set(xs.map(ones)).size >= 3);
        const pairs = [0, 1, 2].map((i) => [Math.max(list[i], list[i + 1]), Math.min(list[i], list[i + 1])]);
        return M('두 수 사이의 빈칸에 두 수의 차를 쓴다. ㉠, ㉡, ㉢에 알맞은 수는?', pairs.map(([p, q], i) => ({ label: LABELS[i], answer: p - q })), {
          figure: between(list, LABELS),
          explain: '큰 수에서 작은 수를 뺀다. ' + pairs.map(([p, q], i) => `${LABELS[i]} ${shown(p, '-', q)}`).join(', '),
          facts: { calc: pairs.map(([p, q], i) => [E(p, '-', q), i]) }
        });
      })
    ]
  });

  // ── 수를 골라 계산하기 ────────────────────────────────────────
  B.addGroup(UNIT, {
    id: 'pick', title: '수를 골라 계산하기', standard: CALC,
    types: [
      T('pick-ends-sum', '가장 큰 수와 가장 작은 수의 합', '①48 심24 심37', (d) => {
        const list = d.until(() => [d.int(41, 88), d.int(3, 39), d.int(12, 80), d.int(12, 80)], (xs) => distinct(xs) && Math.max(...xs) === xs[0] && Math.min(...xs) === xs[1] && noCarry(xs[0], xs[1]));
        const [big, small] = list;
        return N('가장 큰 수와 가장 작은 수의 합은?', big + small, {
          figure: numbers(d.shuffle(list)), explain: `가장 큰 수는 ${big}, 가장 작은 수는 ${small}이다. ` + shown(big, '+', small),
          facts: { ends: list, calc: [[E(big, '+', small), 0]] }
        });
      }),
      T('pick-ends-diff', '가장 큰 수와 가장 작은 수의 차', '①49 심25', (d) => {
        const list = d.until(() => [d.int(51, 99), d.int(11, 45), d.int(12, 90), d.int(12, 90), d.int(12, 90)], (xs) => distinct(xs) && Math.max(...xs) === xs[0] && Math.min(...xs) === xs[1] && noBorrow(xs[0], xs[1]));
        const [big, small] = list;
        return N('가장 큰 수와 가장 작은 수의 차는?', big - small, {
          figure: numbers(d.shuffle(list)), explain: `가장 큰 수는 ${big}, 가장 작은 수는 ${small}이다. ` + shown(big, '-', small),
          facts: { ends: list, calc: [[E(big, '-', small), 0]] }
        });
      }),
      T('pick-shape-sum', '같은 모양에 적힌 수의 합', '①50 심26', (d) => {
        const [a, b] = ADD.f(d), others = d.until(() => [d.int(11, 88), d.int(11, 88)], (xs) => distinct(xs.concat([a, b])));
        const list = d.shuffle([['circle', a], ['circle', b], ['triangle', others[0]], ['square', others[1]]]);
        return N('○ 모양에 적힌 두 수의 합은?', a + b, {
          figure: shapeNums(list), explain: `○ 모양에 적힌 수는 ${a}, ${b}이다. ` + shown(a, '+', b),
          facts: { inside: { kind: 'circle', list }, calc: [[E(a, '+', b), 0]] }
        });
      }),
      T('pick-shape-diff', '같은 모양에 적힌 수의 차', '심26', (d) => {
        const [a, b] = SUB.f(d), others = d.until(() => [d.int(11, 88), d.int(11, 88)], (xs) => distinct(xs.concat([a, b])));
        const list = d.shuffle([['triangle', a], ['triangle', b], ['circle', others[0]], ['square', others[1]]]);
        return N('△ 모양에 적힌 두 수의 차는?', a - b, {
          figure: shapeNums(list), explain: `△ 모양에 적힌 수는 ${a}, ${b}이다. 큰 수에서 작은 수를 뺀다. ` + shown(a, '-', b),
          facts: { calc: [[E(a, '-', b), 0]] }
        });
      }),
      T('pick-best-sum', '두 수를 골라 합이 가장 큰 덧셈식 만들기', '①51', (d) => {
        // 어느 두 수를 더해도 받아올림이 없다(숫자가 모두 5 이하이고 같은 자리에 5가 둘 있지 않다).
        const list = d.until(() => Array.from({ length: 5 }, () => d.int(0, 5) * 10 + d.int(0, 5)), (xs) => distinct(xs) && xs.every((x) => x >= 3) && xs.filter((x) => x < 10).length <= 1 && xs.every((x, i) => xs.every((y, j) => i === j || noCarry(x, y))));
        const s = list.slice().sort((p, q) => q - p);
        return N('두 수를 골라 합이 가장 큰 덧셈식을 만든다. 그 합은?', s[0] + s[1], {
          figure: numbers(list), explain: `가장 큰 수 ${josa(s[0], '과/와')} 둘째로 큰 수 ${josa(s[1], '을/를')} 더한다. ` + shown(s[0], '+', s[1]),
          facts: { pairs: { numbers: list, want: 'maxSum' }, calc: [[E(s[0], '+', s[1]), 0]] }
        });
      }),
      T('pick-two-bags', '두 주머니에서 수를 골라 차 구하기', '심27', (d) => {
        const top = d.int(5, 9) * 10 + d.int(2, 9), low = d.int(1, tens(top) - 2) * 10 + d.int(0, ones(top));
        const first = d.until(() => [top, d.int(10, top - 1), d.int(10, top - 1), d.int(10, top - 1)], distinct);
        const second = d.until(() => [low, d.int(low + 1, 95), d.int(low + 1, 95), d.int(low + 1, 95)], distinct);
        return N('가 주머니에서 가장 큰 수를, 나 주머니에서 가장 작은 수를 골랐다. 고른 두 수의 차는?', top - low, {
          figure: lines([tag('가 주머니') + d.shuffle(first).join(', '), tag('나 주머니') + d.shuffle(second).join(', ')]),
          explain: `가 주머니에서 가장 큰 수는 ${top}, 나 주머니에서 가장 작은 수는 ${low}이다. ` + shown(top, '-', low),
          facts: { calc: [[E(top, '-', low), 0]] }
        });
      })
    ]
  });

  // ── 규칙이 있는 덧셈과 뺄셈 ───────────────────────────────────
  B.addGroup(UNIT, {
    id: 'pat', title: '규칙이 있는 덧셈과 뺄셈', standard: CALC,
    types: [
      T('pat-add', '더하는 수가 커지는 덧셈식', '①57', (d, n) => {
        // 0: 42 + 10, 42 + 20, 42 + 30 (더하는 수가 10씩)   1: 22 + 14, 22 + 15, 22 + 16 (더하는 수가 1씩)
        let a, bs;
        if (n === 0) { const k = d.int(1, 3); a = d.int(1, 7 - k) * 10 + d.int(1, 9); bs = [k, k + 1, k + 2].map((v) => v * 10); }
        else { const [p, q] = two(d, 9), bo = d.int(1, 4); a = p * 10 + d.int(1, 7 - bo); bs = [0, 1, 2].map((v) => q * 10 + bo + v); }
        const step = bs[1] - bs[0];
        return M('덧셈을 하시오. 합은 몇씩 커지는가?', bs.map((b, i) => ({ label: LABELS[i], answer: a + b })).concat([{ label: '합은', answer: step, unit: '씩 커진다' }]), {
          figure: lines(bs.map((b, i) => expr(a, '+', b, '=', box(LABELS[i])))),
          explain: bs.map((b) => shown(a, '+', b)).join(', ') + `이다. 더하는 수가 ${step}씩 커지면 합도 ${step}씩 커진다.`,
          facts: { calc: bs.map((b, i) => [E(a, '+', b), i]).concat([[E(bs[1], '-', bs[0]), 3]]), rule: n === 0 ? 'pat-add-10' : 'pat-add-1' }
        });
      }, { count: 2 }),
      T('pat-sub', '한 수만 달라지는 뺄셈식', '①58', (d, n) => {
        if (n === 0) {
          // 34 − 12, 35 − 12, 36 − 12: 같은 수를 뺄 때 처음 수가 1씩 커지면 차도 1씩 커진다.
          const bt = d.int(1, 5), bo = d.int(1, 5), b = bt * 10 + bo, a = d.int(bt + 1, 9) * 10 + d.int(bo, 7), list = [a, a + 1, a + 2];
          return M('뺄셈을 하시오. 차는 몇씩 커지는가?', list.map((v, i) => ({ label: LABELS[i], answer: v - b })).concat([{ label: '차는', answer: 1, unit: '씩 커진다' }]), {
            figure: lines(list.map((v, i) => expr(v, '-', b, '=', box(LABELS[i])))),
            explain: list.map((v) => shown(v, '-', b)).join(', ') + '이다. 같은 수를 뺄 때, 처음 수가 1씩 커지면 차도 1씩 커진다.',
            facts: { calc: list.map((v, i) => [E(v, '-', b), i]).concat([[E(list[1], '-', list[0]), 3]]), rule: 'pat-sub-up' }
          });
        }
        // 67 − 10, 67 − 20, 67 − 30: 빼는 수가 10씩 커지면 차는 10씩 작아진다.
        const k = d.int(1, 3), a = d.int(k + 3, 9) * 10 + d.int(1, 9), bs = [k, k + 1, k + 2].map((v) => v * 10);
        return M('뺄셈을 하시오. 차는 몇씩 작아지는가?', bs.map((b, i) => ({ label: LABELS[i], answer: a - b })).concat([{ label: '차는', answer: 10, unit: '씩 작아진다' }]), {
          figure: lines(bs.map((b, i) => expr(a, '-', b, '=', box(LABELS[i])))),
          explain: bs.map((b) => shown(a, '-', b)).join(', ') + '이다. 빼는 수가 10씩 커지면 차는 10씩 작아진다.',
          facts: { calc: bs.map((b, i) => [E(a, '-', b), i]).concat([[E(bs[1], '-', bs[0]), 3]]), rule: 'pat-sub-down' }
        });
      }, { count: 2 }),
      T('pat-same', '두 수가 달라져도 합이 같은 덧셈식', '심8', (d) => {
        // 57 + 2, 55 + 4, 53 + 6: 한 수가 2씩 작아지고 다른 수가 2씩 커지면 합은 같다.
        const s = d.pick([1, 2]), b = d.int(1, 3), a = d.int(1, 9) * 10 + d.int(2 * s + 1, 9 - b);
        const rows = [0, 1, 2].map((i) => [a - s * i, b + s * i]);
        return M('덧셈을 하시오.', rows.map(([x, y], i) => ({ label: LABELS[i], answer: x + y })), {
          figure: lines(rows.map(([x, y], i) => expr(x, '+', y, '=', box(LABELS[i])))),
          explain: rows.map(([x, y]) => shown(x, '+', y)).join(', ') + `이다. 한 수가 ${s}씩 작아지고 다른 수가 ${s}씩 커지면 합은 같다.`,
          facts: { calc: rows.map(([x, y], i) => [E(x, '+', y), i]), rule: 'pat-same' }
        });
      })
    ]
  });

  // ── 그림을 보고 덧셈식과 뺄셈식 만들기 ────────────────────────
  B.addGroup(UNIT, {
    id: 'make', title: '덧셈식과 뺄셈식 만들기', standard: MEAN,
    types: [
      T('make-add', '모두 몇 개인지 덧셈식으로 나타내기', '①60 심33', (d) => {
        // 세 가지 가운데 물음에 맞는 두 가지를 고른다.
        const [one, other, extra] = d.shuffle(d.pick(KINDS)), [x, y] = ADD.f(d), z = d.until(() => d.int(2, 9), (v) => v !== ones(y));
        return M(`${josa(one, '과/와')} ${josa(other, '은/는')} 모두 몇 개인지 덧셈식으로 나타내었다. ㉠, ㉡에 알맞은 수는?`, [{ label: LABELS[0], answer: y }, { label: LABELS[1], answer: x + y }], {
          figure: goods(d.shuffle([[one, x], [other, y], [extra, z]])) + expr(x, '+', box(LABELS[0]), '=', box(LABELS[1])),
          explain: `${one} ${x}개와 ${other} ${y}개를 더한다. ` + shown(x, '+', y),
          facts: { calc: [[String(y), 0], [E(x, '+', y), 1]] }
        });
      }),
      T('make-sub', '몇 개 더 많은지 뺄셈식으로 나타내기', '①61 심34 심38', (d) => {
        const [one, other, extra] = d.shuffle(d.pick(KINDS)), [x, z] = SUB.a(d), y = d.until(() => d.int(11, 38), (v) => v !== x);
        return M(`${josa(one, '은/는')} ${extra}보다 몇 개 더 많은지 뺄셈식으로 나타내었다. ㉠, ㉡, ㉢에 알맞은 수는?`, [{ label: LABELS[0], answer: x }, { label: LABELS[1], answer: z }, { label: LABELS[2], answer: x - z }], {
          figure: goods(d.shuffle([[one, x], [other, y], [extra, z]])) + expr(box(LABELS[0]), '-', box(LABELS[1]), '=', box(LABELS[2])),
          explain: `${one} ${x}개에서 ${extra} ${z}개를 뺀다. ` + shown(x, '-', z),
          facts: { calc: [[String(x), 0], [String(z), 1], [E(x, '-', z), 2]] }
        });
      }),
      T('make-sign', '물음에 알맞은 식 고르기', '①62', (d, n) => {
        // 0: 모두 몇 개(덧셈)   1: 몇 개 더 많은가(뺄셈). 보기의 식은 모두 받아올림·받아내림이 없다.
        const [one, other, extra] = d.shuffle(d.pick(KINDS)), xt = d.int(3, 7), xo = d.int(2, 7), x = xt * 10 + xo;
        const part = () => d.int(1, Math.min(xt - 1, 9 - xt)) * 10 + d.int(1, Math.min(xo, 9 - xo));
        const [y, z] = d.until(() => [part(), part()], distinct);
        const op = n === 0 ? '+' : '-', list = d.shuffle([[x, op, y], [x, op === '+' ? '-' : '+', y], [x, op, z]]);
        const text = n === 0 ? `${josa(one, '과/와')} ${josa(other, '은/는')} 모두 몇 개인지 구하는 식은?` : `${josa(one, '은/는')} ${other}보다 몇 개 더 많은지 구하는 식은?`;
        return C(text, list.map(([p, o, q]) => expr(p, o, q)), list.findIndex(([, o, q]) => o === op && q === y), {
          figure: goods(d.shuffle([[one, x], [other, y], [extra, z]])),
          explain: (n === 0 ? '모두 몇 개인지는 덧셈으로 구한다. ' : '몇 개 더 많은지는 뺄셈으로 구한다. ') + shown(x, op, y),
          facts: { choose: { exprs: list.map(([p, o, q]) => E(p, o, q)), rule: 'equals', target: result(x, op, y) } }
        });
      }, { count: 2 }),
      T('make-count', '그림을 세어 뺄셈식으로 나타내기', '①60 ①61', (d) => {
        // 노란색 16개, 파란색 12개: 10개씩 묶음의 수가 같아 차가 몇이다.
        const t = d.int(1, 3), ao = d.int(3, 9), bo = d.int(1, ao - 2), a = t * 10 + ao, b = t * 10 + bo;
        return M('노란색 구슬은 파란색 구슬보다 몇 개 더 많은지 뺄셈식으로 나타내었다. ㉠, ㉡, ㉢에 알맞은 수는?', [{ label: LABELS[0], answer: a }, { label: LABELS[1], answer: b }, { label: LABELS[2], answer: a - b }], {
          figure: bundles([{ n: a }, { n: b, tone: 1 }], '구슬') + expr(box(LABELS[0]), '-', box(LABELS[1]), '=', box(LABELS[2])),
          explain: `노란색 구슬은 ${a}개, 파란색 구슬은 ${b}개이다. ` + shown(a, '-', b),
          facts: { calc: [[`${t}*10+${ao}`, 0], [`${t}*10+${bo}`, 1], [`${t}*10+${ao}-${t}*10-${bo}`, 2]] }
        });
      })
    ]
  });

  // ── 문장제: 한 번 계산한다. 유형마다 얼개가 다르다 ────────────
  B.addGroup(UNIT, {
    id: 'word', title: '덧셈과 뺄셈의 활용', standard: MEAN,
    types: [
      T('word-join', '문장제: 두 가지를 모두(합치기)', '①64 심39', (d) => {
        const [a, b] = ADD.f(d);
        return word(`꽃밭에 빨간 꽃이 ${a}송이, 노란 꽃이 ${b}송이 피어 있다. 꽃밭에 핀 꽃은 모두 몇 송이인가?`, '송이', a, '+', b);
      }),
      T('word-grow', '문장제: 더 생김(늘어나기)', '①65', (d) => {
        const [a, b] = d.until(() => ADD.a(d), ([x]) => x < 40);
        return word(`버스에 ${a}명이 타고 있다. 정류장에서 ${b}명이 더 탔다. 버스에 탄 사람은 모두 몇 명인가?`, '명', a, '+', b);
      }),
      T('word-take', '문장제: 남은 것(덜어 내기)', '①66 심40', (d) => {
        const who = d.pick(NAMES), [a, b] = SUB.f(d);
        return word(`${name(who, '은/는')} 딱지를 ${a}장 가지고 있다. 그중 ${b}장을 동생에게 주었다. 남은 딱지는 몇 장인가?`, '장', a, '-', b);
      }),
      T('word-more', '문장제: 몇 개 더 많은가(비교하기)', '①67', (d) => {
        const [a, b] = SUB.m(d);
        return word(`책꽂이에 그림책이 ${a}권, 만화책이 ${b}권 있다. 그림책은 만화책보다 몇 권 더 많은가?`, '권', a, '-', b);
      }),
      T('word-fewer', '문장제: 몇 개 더 적은가(비교하기)', '①67 심34', (d) => {
        // 작은 수를 먼저 말한다. 「더 적은」도 큰 수에서 작은 수를 뺀다.
        const [one, other] = d.shuffle(NAMES).slice(0, 2), [big, small] = SUB.f(d);
        return word(`줄넘기를 ${name(one, '은/는')} ${small}번, ${name(other, '은/는')} ${big}번 넘었다. ${name(one, '은/는')} ${nick(other)}보다 몇 번 더 적게 넘었는가?`, '번', big, '-', small, '큰 수에서 작은 수를 뺀다.');
      }),
      T('word-who', '문장제: 누가 몇 개 더', '①68', (d) => {
        // 틀린 보기는 사람을 바꾼 것과, 빼지 않고 더한 것이다(두 수는 더해도 받아올림이 없다).
        const [one, other] = d.shuffle(NAMES).slice(0, 2), st = d.int(1, 4), so = d.int(1, 4), big = d.int(st + 1, 9 - st) * 10 + d.int(so, 9 - so), small = st * 10 + so;
        const values = d.bool() ? [big, small] : [small, big], winner = values[0] > values[1] ? 0 : 1, gap = big - small, sum = big + small;
        const list = d.shuffle([[winner, gap], [1 - winner, gap], [winner, sum], [1 - winner, sum]]);
        return C(`색종이를 ${name(one, '은/는')} ${values[0]}장, ${name(other, '은/는')} ${values[1]}장 가지고 있다. 누가 몇 장 더 많이 가지고 있는가?`, list.map(([who, k]) => `${[one, other][who]}, ${k}장`), list.findIndex(([who, k]) => who === winner && k === gap), {
          explain: `${name([one, other][winner], '이/가')} 더 많이 가지고 있다. ` + shown(big, '-', small),
          facts: { who: { values, options: list } }
        });
      }),
      T('word-less-side', '문장제: 더 적은 쪽의 수', '심41', (d) => {
        const [a, b] = SUB.a(d);
        return word(`바구니에 사과가 ${a}개 있다. 배는 사과보다 ${b}개 더 적다. 배는 몇 개인가?`, '개', a, '-', b);
      }),
      T('word-table', '문장제: 가장 많은 것과 가장 적은 것의 차', '심25', (d) => {
        const who = d.shuffle(NAMES).slice(0, 3);
        const [hi, lo, mid] = d.until(() => [d.int(31, 59), d.int(12, 38), d.int(12, 58)], ([p, q, r]) => p > r && r > q && noBorrow(p, q) && tens(p) > tens(q));
        const rows = d.shuffle([hi, lo, mid]).map((v, i) => [who[i], v]);
        return N('세 사람이 훌라후프를 돌린 수이다. 가장 많이 돌린 사람은 가장 적게 돌린 사람보다 몇 번 더 돌렸는가?', hi - lo, {
          unit: '번', figure: table(['이름', '돌린 수(번)'], rows),
          explain: `가장 많이 돌린 수는 ${hi}번, 가장 적게 돌린 수는 ${lo}번이다. ` + shown(hi, '-', lo),
          facts: { ends: [hi, lo, mid], calc: [[E(hi, '-', lo), 0]] }
        });
      })
    ]
  });

  // ── 실력 문제 ────────────────────────────────────────────────
  B.addGroup(UNIT, {
    id: 'hard', title: '실력 문제', standard: CALC,
    types: [
      H('h-align', '수를 잘못 맞추어 쓴 세로셈 가리기', '①36 심14', (d, n) => {
        const who = d.shuffle(NAMES).slice(0, 3);
        if (n === 0) {
          // 34 + 5: 39(바름) · 84(5를 10개씩 묶음의 수 아래에 씀 — 낱개만 본 아이는 못 가린다) · 89(5를 두 곳에 다 더함)
          const [a, b] = d.until(() => ADD.a(d), ([x, y]) => tens(x) + y <= 9);
          const kinds = d.shuffle([{ said: a + b, bottom: [String(b)] }, { said: (tens(a) + b) * 10 + ones(a), bottom: [String(b), ''] }, { said: (tens(a) + b) * 10 + ones(a) + b, bottom: [String(b)] }]);
          return C(`세 사람이 ${a} + ${josa(b, '을/를')} 계산하였다. 바르게 계산한 사람은?`, who, kinds.findIndex((k) => k.said === a + b), {
            figure: tiles(kinds.map((k, i) => [who[i], column(chars(a), '+', k.bottom, chars(k.said))])),
            explain: `${josa(b, '은/는')} 낱개의 수이므로 낱개 ${josa(ones(a), '과/와')} 더하고, 10개씩 묶음 ${tens(a)}개는 그대로 쓴다. ` + shown(a, '+', b),
            facts: { claimed: kinds.map((k) => [E(a, '+', b), k.said]), claimedWant: true, rule: 'h-align-ones' }
          });
        }
        // 30 + 40: 70(바름) · 700(0을 두 번 씀) · 7(0을 빠뜨림)
        const [a, b] = ADD.t(d), s = tens(a) + tens(b);
        const kinds = d.shuffle([a + b, s * 100, s]);
        return C(`세 사람이 ${a} + ${josa(b, '을/를')} 계산하였다. 바르게 계산한 사람은?`, who, kinds.indexOf(a + b), {
          figure: tiles(kinds.map((said, i) => [who[i], column(chars(a), '+', chars(b), chars(said))])),
          explain: `10개씩 묶음끼리 더하면 ${tens(a)} + ${tens(b)} = ${s}이고 낱개는 없다. 10개씩 묶음 ${s}개는 ${s * 10}이다.`,
          facts: { claimed: kinds.map((said) => [E(a, '+', b), said]), claimedWant: true, rule: 'h-align-tens' }
        });
      }, { count: 2 }),
      H('h-front', '앞에 놓인 몇과 몇십 가려 더하기', '①3 심2', (d) => {
        // 4 + 53 과 40 + 53: 4를 5에 더해 93 이라고 하는 아이는 ㉠에서 걸린다.
        const k = d.int(2, 4), a = d.int(1, 9 - k) * 10 + d.int(1, 9 - k);
        return M('㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: k + a }, { label: LABELS[1], answer: k * 10 + a }], {
          figure: lines([expr(k, '+', a, '=', box(LABELS[0])), expr(k * 10, '+', a, '=', box(LABELS[1]))]),
          explain: `${josa(k, '은/는')} 낱개끼리 더하고, ${josa(k * 10, '은/는')} 10개씩 묶음끼리 더한다. ${shown(k, '+', a)}, ${shown(k * 10, '+', a)}`,
          facts: { calc: [[E(k, '+', a), 0], [E(k * 10, '+', a), 1]] }
        });
      }),
      H('h-mix3', '몇십과 몇을 가려 더하기', '①2 ①4 ①7', (d) => {
        // 40 + 3, 40 + 30, 43 + 30
        const [t, u] = d.until(() => two(d, 9), ([p, q]) => p !== q && q >= 2), rows = d.shuffle([[t * 10, u], [t * 10, u * 10], [t * 10 + u, u * 10]]);
        return M('㉠, ㉡, ㉢에 알맞은 수는?', rows.map(([x, y], i) => ({ label: LABELS[i], answer: x + y })), {
          figure: lines(rows.map(([x, y], i) => expr(x, '+', y, '=', box(LABELS[i])))),
          explain: rows.map(([x, y]) => shown(x, '+', y)).join(', ') + '이다. 몇십은 10개씩 묶음끼리, 몇은 낱개끼리 더한다.',
          facts: { calc: rows.map(([x, y], i) => [E(x, '+', y), i]) }
        });
      }),
      H('h-more', '「더 많다」가 나오는 두 문장 가리기', '①67 ①69', (d) => {
        // 같은 두 수로: 몇 개 더 많은가(뺄셈)와, 몇 개 더 많이 있다 → 몇 개인가(덧셈)
        const st = d.int(1, 4), so = d.int(1, 4), a = d.int(st + 1, 9 - st) * 10 + d.int(so, 9 - so), b = st * 10 + so;
        return M('㉠, ㉡에 알맞은 수는?', [{ label: LABELS[0], answer: a - b }, { label: LABELS[1], answer: a + b }], {
          figure: lines([`빨간 구슬은 ${a}개, 파란 구슬은 ${b}개이다. 빨간 구슬은 파란 구슬보다 ${box(LABELS[0])}개 더 많다.`, `노란 구슬은 ${a}개이다. 초록 구슬은 노란 구슬보다 ${b}개 더 많다. 초록 구슬은 ${box(LABELS[1])}개이다.`]),
          explain: `㉠은 두 수의 차이므로 ${shown(a, '-', b)}, ㉡은 ${a}보다 ${b}만큼 더 큰 수이므로 ${shown(a, '+', b)}`,
          facts: { calc: [[E(a, '-', b), 0], [E(a, '+', b), 1]] }
        });
      }, { standard: MEAN }),
      H('h-left', '「남은」이 나오는 덧셈 상황', '①64 ①66', (d) => {
        const [a, b] = ADD.f(d);
        return N(`잔치가 끝나고 떡이 ${a}개, 과자가 ${b}개 남았다. 남은 떡과 과자는 몇 개인가?`, a + b, {
          unit: '개', explain: '남은 떡의 수와 남은 과자의 수를 더한다. ' + shown(a, '+', b), facts: { calc: [[E(a, '+', b), 0]] }
        });
      }, { standard: MEAN }),
      H('h-scatter', '섞여 놓인 수 모형이 나타내는 두 수의 합', '①22 심11', (d) => {
        const [at, bt] = two(d, 6), [ao, bo] = d.until(() => two(d, 9), ([p, q]) => p <= 5 && q <= 5 && p + q >= 4), a = at * 10 + ao, b = bt * 10 + bo;
        return N('두 수 모형이 나타내는 수의 합은?', a + b, {
          figure: scattered(at, ao, d, '가') + scattered(bt, bo, d, '나'),
          explain: `가는 10개씩 묶음 ${at}개와 낱개 ${ao}개이므로 ${a}, 나는 10개씩 묶음 ${bt}개와 낱개 ${bo}개이므로 ${b}이다. ` + shown(a, '+', b),
          facts: { calc: [[`${at}*10+${ao}+${bt}*10+${bo}`, 0]], unseen: [10] }
        });
      }),
      H('h-need', '더 모아야 하는 수', '심36', (d) => {
        const [a, b] = SUB.f(d);
        return N(`붙임딱지 ${a}장을 모으려고 한다. 지금까지 ${b}장을 모았다. 몇 장을 더 모아야 하는가?`, a - b, {
          unit: '장', explain: '모으려는 수에서 지금까지 모은 수를 뺀다. ' + shown(a, '-', b), facts: { calc: [[E(a, '-', b), 0]] }
        });
      }, { standard: MEAN }),
      H('h-gap', '차를 알 때 작은 쪽의 수', '심42', (d) => {
        // 누가 더 많은지는 스스로 정해야 한다(선생님이 더 많다).
        const who = d.pick(NAMES), age = d.int(7, 9), a = d.int(2, 5) * 10 + d.int(age, 9), gap = a - age;
        return N(`선생님은 ${a}살이다. 선생님과 ${nick(who)}의 나이의 차는 ${gap}살이다. ${name(who, '은/는')} 몇 살인가?`, age, {
          unit: '살', explain: `선생님의 나이가 더 많으므로 ${a}에서 ${josa(gap, '을/를')} 뺀다. ` + shown(a, '-', gap), facts: { calc: [[E(a, '-', gap), 0]] }
        });
      }, { standard: MEAN }),
      H('h-gave', '남은 수를 알 때 덜어 낸 수', '심43', (d) => {
        const who = d.pick(NAMES), [a, left] = SUB.f(d);
        return N(`딸기가 ${a}개 있었다. ${name(who, '이/가')} 몇 개를 먹었더니 ${left}개가 남았다. ${name(who, '이/가')} 먹은 딸기는 몇 개인가?`, a - left, {
          unit: '개', explain: '처음에 있던 딸기의 수에서 남은 딸기의 수를 뺀다. ' + shown(a, '-', left), facts: { calc: [[E(a, '-', left), 0]] }
        });
      }, { standard: MEAN }),
      H('h-hide', '세로셈의 가려진 수', '심31 심32', (d, n) => {
        // 한 곳만 가린다. 낱개끼리(또는 10개씩 묶음끼리) 보면 바로 보인다.
        const op = n === 0 ? '+' : '-', [a, b] = op === '+' ? ADD.f(d) : SUB.f(d), r = result(a, op, b), low = d.bool();
        const bottom = chars(b); bottom[low ? 1 : 0] = box();
        const answer = low ? ones(b) : tens(b), [x, y] = low ? [ones(a), ones(r)] : [tens(a), tens(r)], where = low ? '낱개끼리' : '10개씩 묶음끼리';
        return N('□ 안에 알맞은 수는?', answer, {
          figure: column(chars(a), op, bottom, chars(r)),
          explain: op === '+' ? `${where} 더하면 ${x} + □ = ${y}이므로 □ 안에 알맞은 수는 ${answer}이다.` : `${where} 빼면 ${x} − □ = ${y}이므로 □ 안에 알맞은 수는 ${answer}이다.`,
          facts: { calc: [[op === '+' ? `${y}-${x}` : `${x}-${y}`, 0]], rule: 'h-hide' + op }
        });
      }, { count: 2 }),
      H('h-cards', '수 카드로 만든 가장 큰 수와 가장 작은 수의 합', '①56', (d) => {
        // 1, 3, 5 → 53 + 13. 두 수를 더해도 받아올림이 없게 고른다.
        const b = d.int(2, 4), c = d.int(1, b - 1), a = d.int(b + 1, 9 - c), big = a * 10 + b, small = c * 10 + b;
        return N('수 카드 3장 가운데 2장을 골라 몇십몇을 만든다. 만들 수 있는 가장 큰 수와 가장 작은 수의 합은?', big + small, {
          figure: cards(d.shuffle([a, b, c])), explain: `가장 큰 수는 ${big}, 가장 작은 수는 ${small}이다. ` + shown(big, '+', small),
          facts: { calc: [[`${a}*10+${b}+${c}*10+${b}`, 0]], unseen: [10] }
        });
      })
    ]
  });
})(typeof window !== 'undefined' ? window : globalThis);
