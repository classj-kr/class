// 3학년 1학기 1단원 덧셈과 뺄셈 — 실력 문항.
// 수집해 둔 평가 자료 가운데 심화·실력 단원평가, 차시별 심화 문제, 수학익힘 심화, 서술형 평가에 나온 문제를 하나씩 따른다.
// (YBM 단원심화평가 1~4회·수학익힘유사 심화 02~07, 동아 단원평가 심화, 디딤돌 단원평가 심화·문장제 서술형,
//  미래엔 단원평가 심화 1~3회, 비상 실력 문제·차시별 심화, 아이스크림 심화 1~4, 지학사 실력 1~2회·서술형, 천재 단원평가 심화·서술형)
// 꼴과 조건은 그대로 두고 수와 문장만 바꾼다. 묶음은 그 문제가 실린 차시를 따른다.
// 문제 만들기·이유 쓰기처럼 답을 자동으로 맞출 수 없는 문제는 싣지 않는다.
(function (root) {
  'use strict';
  const B = root.MathBank;
  const { carryPlaces, borrowPlaces, count, plain, josa, name, NAMES, LABELS, box, expr, column, chars, cards, chain, table, route, tapes, addPair, subPair, ADD, SUB, result, shown } = B.kit;
  const EST = '4수01-08';
  const UNIT = '3-1-1';

  const N = (text, answer, o) => ({ text, figure: o.figure, inputs: [{ answer, unit: o.unit, lead: o.lead }], explain: o.explain || '', facts: o.facts || {} });
  const M = (text, inputs, o) => ({ text, figure: o.figure, inputs, unordered: o.unordered || false, explain: o.explain || '', facts: o.facts || {} });
  const C = (text, options, answer, o) => ({ text, figure: o.figure, choice: { options, answer }, explain: o.explain || '', facts: o.facts || {} });
  const E = (a, op, b) => `${a}${op}${b}`;
  const nick = (who) => name(who, '은/는').slice(0, -1);
  const lines = (rows) => '<div class="mb-lines">' + rows.map((row) => `<div>${row}</div>`).join('') + '</div>';
  const tagged = (list, tags) => lines(list.map((html, i) => `<span class="mb-tag mb-tag-short">${(tags || LABELS)[i]}</span>${html}`));
  const numbers = (list) => '<div class="mb-numbers">' + list.map((v) => `<span>${v}</span>`).join('') + '</div>';
  const three = (d, lo, hi) => d.until(() => d.int(lo, hi), plain);
  const T = (id, title, source, make, countOf) => ({ id, level: '실력', title, source, make, count: countOf || 1 });

  // ── 가려진 숫자(벌레 먹은 셈) ────────────────────────────────
  // 한 자리(일·십·백)에 하나씩만 가려 답이 하나로 정해지게 한다. sumOnly 면 가린 숫자들의 합을 묻는다.
  function hidden(d, a, op, b, howMany, sumOnly) {
    const rows = [chars(a), chars(b), chars(result(a, op, b))];
    const places = d.shuffle([0, 1, 2]).slice(0, howMany).sort((x, y) => y - x);
    const inputs = [], masks = [];
    places.forEach((place, i) => {
      const row = d.until(() => d.int(0, 2), (r) => rows[r].length > place);
      const at = rows[row].length - 1 - place;
      inputs.push({ label: LABELS[i], answer: Number(rows[row][at]) });
      masks.push({ row, place });
      rows[row][at] = box(sumOnly ? '' : LABELS[i]);
    });
    const figure = column(rows[0], op, rows[1], rows[2]);
    if (sumOnly) {
      const total = inputs.reduce((s, x) => s + x.answer, 0);
      return N('□ 안에 들어갈 수의 합을 구하시오.', total, { figure, explain: shown(a, op, b) + `이므로 □ 안의 수는 ${inputs.map((x) => x.answer).join(', ')}이다.`, facts: { masks, pair: [a, op, b], maskSum: true } });
    }
    return M(inputs.map((x) => x.label).join(', ') + '에 알맞은 숫자를 구하시오.', inputs, { figure, explain: shown(a, op, b), facts: { masks, pair: [a, op, b] } });
  }

  // ── □에 들어갈 수 있는 수의 범위 ─────────────────────────────
  function range(d, form) {
    if (form === 'A-B<x') {
      const [a, b] = subPair(d, SUB.any), v = a - b;
      return N('□ 안에 들어갈 수 있는 수 중 가장 작은 수를 구하시오.', v + 1, { figure: expr(a, '-', b, '<i>&lt;</i>', box()), explain: `${shown(a, '-', b)}이므로 □는 ${v}보다 커야 한다. 가장 작은 수는 ${v + 1}이다.`, facts: { range: { ineq: `${a}-${b}<x`, want: 'min', lo: 1, hi: 1999 } } });
    }
    if (form === 'A+B>x') {
      const [a, b] = addPair(d, ADD.any), v = a + b;
      return N('□ 안에 들어갈 수 있는 수 중 가장 큰 수를 구하시오.', v - 1, { figure: expr(a, '+', b, '<i>&gt;</i>', box()), explain: `${shown(a, '+', b)}이므로 □는 ${v}보다 작아야 한다. 가장 큰 수는 ${v - 1}이다.`, facts: { range: { ineq: `${a}+${b}>x`, want: 'max', lo: 1, hi: 1999 } } });
    }
    if (form === 'A-x<C') {
      const [a, c] = subPair(d, (bw, x, y) => SUB.any(bw) && x - y >= 100), v = a - c;
      return N('□ 안에 들어갈 수 있는 자연수 중 가장 작은 수를 구하시오.', v + 1, { figure: expr(a, '-', box(), '<i>&lt;</i>', c), explain: `${shown(a, '-', c)}이므로 □는 ${v}보다 커야 한다. 가장 작은 수는 ${v + 1}이다.`, facts: { range: { ineq: `${a}-x<${c}`, want: 'min', lo: 1, hi: a } } });
    }
    if (form === 'A-x>C') {
      const [a, c] = subPair(d, (bw, x, y) => SUB.any(bw) && x - y >= 150), v = a - c;
      return N('□ 안에 들어갈 수 있는 수 중 가장 큰 세 자리 수를 구하시오.', v - 1, { figure: expr(a, '-', box(), '<i>&gt;</i>', c), explain: `${shown(a, '-', c)}이므로 □는 ${v}보다 작아야 한다. 가장 큰 세 자리 수는 ${v - 1}이다.`, facts: { range: { ineq: `${a}-x>${c}`, want: 'max', lo: 100, hi: 999 } } });
    }
    if (form === 'A+B<C-x') {
      const [a, b] = addPair(d, (c, x, y) => ADD.any(c) && x + y <= 900);
      const c = d.until(() => d.int(a + b + 6, Math.min(999, a + b + 90)), plain), v = c - (a + b);
      return N('□ 안에 들어갈 수 있는 수 중 가장 큰 수를 구하시오.', v - 1, { figure: expr(a, '+', b, '<i>&lt;</i>', c, '-', box()), explain: `${shown(a, '+', b)}이고 ${shown(c, '-', a + b)}이므로 □는 ${v}보다 작아야 한다. 가장 큰 수는 ${v - 1}이다.`, facts: { range: { ineq: `${a}+${b}<${c}-x`, want: 'max', lo: 1, hi: 999 } } });
    }
    // 'A-B<x+C': 가장 작은 세 자리 수
    const [a, b] = subPair(d, (bw, x, y) => SUB.any(bw) && x - y >= 400);
    const c = d.until(() => d.int(110, a - b - 120), plain), v = a - b - c;
    return N('□ 안에 들어갈 수 있는 수 중 가장 작은 세 자리 수를 구하시오.', v + 1, { figure: expr(a, '-', b, '<i>&lt;</i>', box(), '+', c), explain: `${shown(a, '-', b)}이고 ${shown(a - b, '-', c)}이므로 □는 ${v}보다 커야 한다. 가장 작은 세 자리 수는 ${v + 1}이다.`, facts: { range: { ineq: `${a}-${b}<x+${c}`, want: 'min', lo: 100, hi: 999 } } });
  }

  // ── 0부터 9까지의 수 중 □에 들어갈 수 있는 수 ─────────────────
  function digitSet(d, form) {
    if (form === 'ones') {
      // A > B − pq□  또는  A < B − pq□
      const pq = d.int(11, 48), bigger = d.bool(), t = d.int(2, 7);
      const b = d.until(() => d.int(pq * 10 + 150, 999), plain), a = b - (pq * 10 + t);
      const list = Array.from({ length: 10 }, (_, x) => x).filter((x) => (bigger ? x > t : x < t));
      return N('0부터 9까지의 수 중 □ 안에 들어갈 수 있는 수는 모두 몇 개인가?', list.length, { unit: '개', figure: expr(a, bigger ? '<i>&gt;</i>' : '<i>&lt;</i>', b, '-', `${pq}${box()}`), explain: `${expr(b, '-', a, '=', pq * 10 + t)}이므로 ${pq}□는 ${pq * 10 + t}보다 ${bigger ? '커야' : '작아야'} 한다. □ 안에 들어갈 수 있는 수는 ${list.join(', ')}이다.`, facts: { digit: { template: `${a}${bigger ? '>' : '<'}${b}-${pq}□`, lo: 0, hi: 9 } } });
    }
    if (form === 'tens') {
      // h□o + B < S
      const h = d.int(1, 4), o = d.int(1, 9), t = d.int(3, 8);
      const b = d.until(() => d.int(210, 560), (x) => plain(x) && (x % 10) + o < 10 && (Math.floor(x / 10) % 10) + 9 < 19), s = h * 100 + t * 10 + o + b;
      const list = Array.from({ length: t }, (_, x) => x);
      return N('0부터 9까지의 수 중 □ 안에 들어갈 수 있는 수는 모두 몇 개인가?', list.length, { unit: '개', figure: expr(`${h}${box()}${o}`, '+', b, '<i>&lt;</i>', s), explain: `${expr(s, '-', b, '=', s - b)}이므로 ${h}□${o}는 ${s - b}보다 작아야 한다. □ 안에 들어갈 수 있는 수는 ${list.join(', ')}이다.`, facts: { digit: { template: `${h}□${o}+${b}<${s}`, lo: 0, hi: 9 } } });
    }
    // 'hundreds': L < □r + B < U (1부터 9까지)
    const r = d.int(12, 88), b = three(d, 310, 690), lo = d.int(2, 4), hi = d.int(lo + 1, Math.min(9, lo + 4));
    const low = lo * 100 + r + b - d.int(5, 95), high = hi * 100 + r + b + d.int(5, 95);
    const list = Array.from({ length: hi - lo + 1 }, (_, i) => lo + i);
    return N('1부터 9까지의 수 중 □ 안에 들어갈 수 있는 수는 모두 몇 개인가?', list.length, { unit: '개', figure: expr(low, '<i>&lt;</i>', `${box()}${r}`, '+', b, '<i>&lt;</i>', high), explain: `□${r}는 ${low - b}보다 크고 ${high - b}보다 작아야 한다. □ 안에 들어갈 수 있는 수는 ${list.join(', ')}이다.`, facts: { digit: { template: `${low}<□${r}+${b}<${high}`, lo: 1, hi: 9 } } });
  }

  // ── 수 카드 ─────────────────────────────────────────────────
  const permute3 = (digits) => { const out = []; digits.forEach((x, i) => digits.forEach((y, j) => digits.forEach((z, k) => { if (i !== j && j !== k && i !== k && x !== 0) out.push(x * 100 + y * 10 + z); }))); return [...new Set(out)].sort((p, q) => p - q); };
  const drawCards = (d, howMany, zero) => d.until(() => d.shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, howMany), (list) => (zero == null || list.includes(0) === zero));
  // which: 'max+min' 'max-min' 'max+second' 'both'(합과 차)
  function cardItem(d, howMany, which, zero) {
    const digits = drawCards(d, howMany, zero), all = permute3(digits);
    const big = all[all.length - 1], small = all[0], second = all[all.length - 2];
    const lead = howMany === 3 ? '수 카드 3장을 한 번씩만 사용하여 세 자리 수를 만든다.' : howMany === 6 && which === 'both' ? '수 카드 6장을 한 번씩 모두 사용하여 세 자리 수 2개를 만든다.' : `수 카드 ${howMany}장 중 3장을 골라 한 번씩만 사용하여 세 자리 수를 만든다.`;
    const spec = { digits, which };
    if (which === 'both') return M(`${lead} 만들 수 있는 가장 큰 수와 가장 작은 수의 합과 차를 각각 구하시오.`, [{ label: '합', answer: big + small }, { label: '차', answer: big - small }], { figure: cards(digits), explain: `가장 큰 수는 ${big}, 가장 작은 수는 ${small}이다. ${shown(big, '+', small)}, ${shown(big, '-', small)}`, facts: { cardSpec: spec } });
    if (which === 'max+second') return N(`${lead} 만들 수 있는 가장 큰 수와 두 번째로 큰 수의 합을 구하시오.`, big + second, { figure: cards(digits), explain: `가장 큰 수는 ${big}, 두 번째로 큰 수는 ${second}이다. ` + shown(big, '+', second), facts: { cardSpec: spec } });
    const op = which === 'max+min' ? '+' : '-';
    return N(`${lead} 만들 수 있는 가장 큰 수와 가장 작은 수의 ${op === '+' ? '합을' : '차를'} 구하시오.`, result(big, op, small), { figure: cards(digits), explain: `가장 큰 수는 ${big}, 가장 작은 수는 ${small}이다. ` + shown(big, op, small), facts: { cardSpec: spec } });
  }

  // ── 어떤 수(잘못 계산) ───────────────────────────────────────
  function wrong(d, form) {
    if (form === 'add->sub') {
      const [x, b] = subPair(d, (bw, p, q) => SUB.any(bw) && q >= 120 && p - q >= 100 && p + q <= 1500), c = x - b;
      return N(`어떤 수에 ${josa(b, '을/를')} 더해야 할 것을 잘못하여 뺐더니 ${josa(c, '이/가')} 되었다. 바르게 계산한 값을 구하시오.`, x + b, { explain: `어떤 수는 ${expr(c, '+', b, '=', x)}이다. 바르게 계산하면 ${shown(x, '+', b)}이다.`, facts: { calc: [[`${c}+${b}+${b}`, 0]] } });
    }
    if (form === 'sub->add') {
      const [x, b] = subPair(d, (bw, p, q) => SUB.any(bw) && q >= 120 && p - q >= 50 && p + q <= 999), c = x + b;
      return N(`어떤 수에서 ${josa(b, '을/를')} 빼야 할 것을 잘못하여 더했더니 ${josa(c, '이/가')} 되었다. 바르게 계산한 값을 구하시오.`, x - b, { explain: `어떤 수는 ${expr(c, '-', b, '=', x)}이다. 바르게 계산하면 ${shown(x, '-', b)}이다.`, facts: { calc: [[`${c}-${b}-${b}`, 0]] } });
    }
    if (form === 'swap') {
      // a 를 더해야 할 것을 십의 자리와 일의 자리 숫자를 바꾼 수를 더했다.
      const a = d.until(() => d.int(120, 598), (v) => plain(v) && v % 10 !== Math.floor(v / 10) % 10 && v % 10 !== 0);
      const turned = Math.floor(a / 100) * 100 + (a % 10) * 10 + Math.floor(a / 10) % 10;
      const x = d.until(() => d.int(120, 398), plain), c = x + turned;
      return N(`어떤 수에 ${josa(a, '을/를')} 더해야 할 것을 잘못하여 ${josa(turned, '을/를')} 더했더니 ${josa(c, '이/가')} 되었다. 바르게 계산한 값을 구하시오.`, x + a, { explain: `어떤 수는 ${expr(c, '-', turned, '=', x)}이다. 바르게 계산하면 ${shown(x, '+', a)}이다.`, facts: { calc: [[`${c}-${turned}+${a}`, 0]] } });
    }
    // 'from': A 에서 어떤 수를 빼야 하는데 더했다.
    const [a, x] = subPair(d, (bw, p, q) => SUB.any(bw) && q >= 120 && p - q >= 50 && p + q <= 999), c = a + x;
    return N(`${a}에서 어떤 수를 빼야 할 것을 잘못하여 더했더니 ${josa(c, '이/가')} 되었다. 바르게 계산한 값을 구하시오.`, a - x, { explain: `어떤 수는 ${expr(c, '-', a, '=', x)}이다. 바르게 계산하면 ${shown(a, '-', x)}이다.`, facts: { calc: [[`${a}-(${c}-${a})`, 0]] } });
  }

  // ── 100이 몇 개, 10이 몇 개, 1이 몇 개인 수 ───────────────────
  function composed(d) {
    const value = three(d, 215, 868);
    let h = Math.floor(value / 100), t = Math.floor(value / 10) % 10, o = value % 10;
    const style = d.pick(['ones', 'tens', 'noTens', 'both']);
    if ((style === 'ones' || style === 'both') && t >= 1) { t -= 1; o += 10; }
    if ((style === 'tens' || style === 'both') && h >= 2) { h -= 1; t += 10; }
    if (style === 'noTens') { o += t * 10; t = 0; }
    const text = [[100, h], [10, t], [1, o]].filter((p) => p[1] > 0).map(([unit, n]) => `${josa(unit, '이/가')} ${n}개`).join(', ') + '인 수';
    return { value, text, parts: [h, t, o] };
  }
  function composeItem(d, op) {
    const [x, y] = d.until(() => [composed(d), composed(d)], ([p, q]) => (op === '+' ? p.value + q.value <= 1500 : p.value - q.value >= 60) && p.value !== q.value);
    return N(`㉠과 ㉡이 나타내는 수의 ${op === '+' ? '합을' : '차를'} 구하시오.`, result(x.value, op, y.value), { figure: tagged([x.text, y.text]), explain: `㉠은 ${x.value}, ㉡은 ${y.value}이다. ` + shown(x.value, op, y.value), facts: { compose: [x.parts, y.parts], composeOp: op } });
  }

  // ── 표 ──────────────────────────────────────────────────────
  const distinct = (d, howMany, lo, hi, gap) => d.until(() => Array.from({ length: howMany }, () => d.int(lo, hi)), (xs) => xs.every(plain) && xs.every((x, i) => xs.every((y, j) => i === j || Math.abs(x - y) >= gap)));
  function tableItem(d, kind) {
    if (kind === 'grades') {
      const xs = distinct(d, 6, 105, 320, 6), sorted = xs.slice().sort((p, q) => q - p);
      return N('학년별 학생 수를 나타낸 표이다. 학생 수가 두 번째로 많은 학년과 학생 수가 가장 적은 학년의 학생 수의 차를 구하시오.', sorted[1] - sorted[5], { unit: '명', figure: table(['학년', '학생 수(명)'], xs.map((v, i) => [(i + 1) + '학년', v])), explain: `두 번째로 많은 학년은 ${sorted[1]}명, 가장 적은 학년은 ${sorted[5]}명이다. ` + shown(sorted[1], '-', sorted[5]), facts: { tableRank: { values: xs, a: 1, b: 5 } } });
    }
    if (kind === 'jump' || kind === 'jumpTwo') {
      const who = d.shuffle(NAMES).slice(0, 4), xs = distinct(d, 4, 150, 660, 12), sorted = xs.slice().sort((p, q) => q - p);
      const figure = table(['이름', ...who], [['줄넘기 기록(회)', ...xs]]);
      if (kind === 'jumpTwo') {
        const [i, j] = d.until(() => [d.int(0, 3), d.int(0, 3)], ([p, q]) => xs[p] > xs[q]);
        return N(`줄넘기 기록을 나타낸 표이다. ${name(who[i], '은/는')} ${nick(who[j])}보다 몇 회 더 많이 넘었는가?`, xs[i] - xs[j], { unit: '회', figure, explain: shown(xs[i], '-', xs[j]), facts: { calc: [[E(xs[i], '-', xs[j]), 0]] } });
      }
      return N('줄넘기 기록을 나타낸 표이다. 가장 많이 넘은 학생은 가장 적게 넘은 학생보다 몇 회 더 많이 넘었는가?', sorted[0] - sorted[3], { unit: '회', figure, explain: `가장 많이 넘은 기록은 ${sorted[0]}회, 가장 적게 넘은 기록은 ${sorted[3]}회이다. ` + shown(sorted[0], '-', sorted[3]), facts: { tableRank: { values: xs, a: 0, b: 3 } } });
    }
    if (kind === 'weekend') {
      const [a, b, c, e] = d.until(() => distinct(d, 4, 210, 690, 8), ([p, q, r, s]) => Math.abs(p + q - r - s) >= 20 && p + q <= 1400 && r + s <= 1400);
      const sat = a + b, sun = c + e;
      return N('주말 전시회 관람객 수를 나타낸 표이다. 관람객이 더 많은 요일은 다른 요일보다 관람객이 몇 명 더 많은가?', Math.abs(sat - sun), { unit: '명', figure: table(['', '토요일', '일요일'], [['남자(명)', a, c], ['여자(명)', b, e]]), explain: `토요일은 ${expr(a, '+', b, '=', sat)}(명), 일요일은 ${expr(c, '+', e, '=', sun)}(명)이다. ` + shown(Math.max(sat, sun), '-', Math.min(sat, sun)), facts: { calc: [[`${Math.max(sat, sun)}-${Math.min(sat, sun)}`, 0]], sums: [[a, b], [c, e]] } });
    }
    if (kind === 'pages') {
      const [one, two] = d.shuffle(NAMES).slice(0, 2);
      const [a, b, c, e] = d.until(() => distinct(d, 4, 112, 290, 5), ([p, q, r, s]) => Math.abs(p + q - r - s) >= 15);
      const x = a + b, y = c + e;
      return N(`${josa(one, '과/와')} ${name(two, '이/가')} 어제와 오늘 읽은 동화책의 쪽수를 나타낸 표이다. 이틀 동안 더 많이 읽은 사람은 다른 사람보다 몇 쪽 더 많이 읽었는가?`, Math.abs(x - y), { unit: '쪽', figure: table(['', '어제', '오늘'], [[one, a + '쪽', b + '쪽'], [two, c + '쪽', e + '쪽']]), explain: `${name(one, '은/는')} ${expr(a, '+', b, '=', x)}(쪽), ${name(two, '은/는')} ${expr(c, '+', e, '=', y)}(쪽)이다. ` + shown(Math.max(x, y), '-', Math.min(x, y)), facts: { calc: [[`${Math.max(x, y)}-${Math.min(x, y)}`, 0]], sums: [[a, b], [c, e]] } });
    }
    if (kind === 'teams') {
      const [a, b, c, e] = d.until(() => distinct(d, 4, 120, 290, 6), ([p, q, r, s]) => Math.abs(p + q - r - s) >= 12);
      const blue = a + b, white = c + e;
      return N('3학년 4개 반을 청팀과 백팀으로 나누어 콩 주머니 던져 넣기 경기를 하였다. 콩 주머니를 더 많이 넣은 팀은 다른 팀보다 몇 개 더 많이 넣었는가?', Math.abs(blue - white), { unit: '개', figure: table(['청팀', '', '백팀', ''], [['1반', a + '개', '2반', c + '개'], ['3반', b + '개', '4반', e + '개']]), explain: `청팀은 ${expr(a, '+', b, '=', blue)}(개), 백팀은 ${expr(c, '+', e, '=', white)}(개)이다. ` + shown(Math.max(blue, white), '-', Math.min(blue, white)), facts: { calc: [[`${Math.max(blue, white)}-${Math.min(blue, white)}`, 0]], sums: [[a, b], [c, e]] } });
    }
    // 'calories': 세 음식의 열량의 합
    const food = ['김밥', '돈가스', '닭강정', '김치', '샐러드'], who = d.pick(NAMES);
    const xs = [three(d, 240, 320), three(d, 180, 260), three(d, 190, 260), d.int(21, 38), d.int(52, 88)];
    const eaten = d.shuffle([0, 1, 2]).slice(0, 2).concat([d.pick([3, 4])]);
    const total = eaten.reduce((s, i) => s + xs[i], 0);
    return N(`음식별 1인분의 열량을 나타낸 표이다. ${name(who, '은/는')} ${eaten.map((i) => food[i] + ' 1인분').join(', ')}을 먹었다. ${name(who, '이/가')} 먹은 음식의 열량은 모두 몇 킬로칼로리인가?`, total, { unit: '킬로칼로리', figure: table(['음식', '열량(킬로칼로리)'], food.map((f, i) => [f, xs[i]])), explain: expr(xs[eaten[0]], '+', xs[eaten[1]], '+', xs[eaten[2]], '=', total), facts: { calc: [[eaten.map((i) => xs[i]).join('+'), 0]] } });
  }

  // ── 두 수 고르기 ─────────────────────────────────────────────
  const pairsOf = (list) => { const out = []; list.forEach((x, i) => list.forEach((y, j) => { if (i < j) out.push([x, y]); })); return out; };
  function pickTwo(d, kind) {
    if (kind === 'diff') {
      const list = d.until(() => distinct(d, 3, 320, 930, 30), (xs) => { const ds = pairsOf(xs).map(([x, y]) => Math.abs(x - y)); return new Set(ds).size === 3; });
      const [x, y] = d.pick(pairsOf(list)), big = Math.max(x, y), small = Math.min(x, y);
      return M('세 수 중 두 수를 골라 뺄셈식을 완성하려고 한다. ㉠, ㉡에 알맞은 수를 구하시오.', [{ label: LABELS[0], answer: big }, { label: LABELS[1], answer: small }], { figure: numbers(list) + expr(box(LABELS[0]), '-', box(LABELS[1]), '=', big - small), explain: shown(big, '-', small), facts: { pairs: { numbers: list, want: 'diff', target: big - small } } });
    }
    if (kind === 'sum') {
      const list = d.until(() => distinct(d, 4, 210, 520, 8), (xs) => { const ss = pairsOf(xs).map(([x, y]) => x + y); return new Set(ss).size === 6 && ss.filter((s) => s % 10 === (xs[0] + xs[1]) % 10).length >= 2; });
      const target = list[0] + list[1];
      return M(`네 수 중 두 수를 골라 합이 ${target}인 덧셈식을 완성하려고 한다. ㉠, ㉡에 알맞은 수를 구하시오.`, [{ label: LABELS[0], answer: list[0] }, { label: LABELS[1], answer: list[1] }], { unordered: true, figure: numbers(d.shuffle(list)) + expr(box(LABELS[0]), '+', box(LABELS[1]), '=', target), explain: shown(list[0], '+', list[1]), facts: { pairs: { numbers: list, want: 'sum', target } } });
    }
    if (kind === 'maxDiff') {
      const list = distinct(d, 4, 320, 930, 18), big = Math.max(...list), small = Math.min(...list);
      return N('네 수 중 두 수를 골라 차가 가장 큰 뺄셈식을 만들 때, 그 차를 구하시오.', big - small, { figure: numbers(list), explain: `가장 큰 수에서 가장 작은 수를 뺀다. ` + shown(big, '-', small), facts: { pairs: { numbers: list, want: 'maxDiff' } } });
    }
    if (kind === 'maxSum') {
      const list = distinct(d, d.pick([3, 4]), 320, 590, 9), sorted = list.slice().sort((p, q) => q - p);
      return N(`${list.length === 3 ? '세' : '네'} 수 중 두 수를 골라 합이 가장 큰 덧셈식을 만들 때, 그 합을 구하시오.`, sorted[0] + sorted[1], { figure: numbers(list), explain: `가장 큰 수와 두 번째로 큰 수를 더한다. ` + shown(sorted[0], '+', sorted[1]), facts: { pairs: { numbers: list, want: 'maxSum' } } });
    }
    if (kind === 'near') {
      const target = d.pick([500, 600, 700]);
      const list = d.until(() => distinct(d, 4, 160, 510, 12), (xs) => { const gaps = pairsOf(xs).map(([x, y]) => Math.abs(x + y - target)).sort((p, q) => p - q); return gaps[0] <= 25 && gaps[1] - gaps[0] >= 8; });
      const best = pairsOf(list).sort((p, q) => Math.abs(p[0] + p[1] - target) - Math.abs(q[0] + q[1] - target))[0];
      return N(`수 카드 4장 중 2장을 골라 두 수의 합이 ${target}에 가장 가까운 덧셈식을 만들 때, 그 합을 구하시오.`, best[0] + best[1], { figure: numbers(list), explain: `${shown(best[0], '+', best[1])}이 ${target}에 가장 가깝다.`, facts: { pairs: { numbers: list, want: 'near', target } } });
    }
    // 'complete': □ − a = □ 을 네 수에서 골라 완성
    const a = three(d, 140, 380);
    const list = d.until(() => distinct(d, 4, 120, 880, 15), (xs) => pairsOf(xs).filter(([x, y]) => Math.abs(x - y) === a).length === 1 && !xs.includes(a));
    const [x, y] = pairsOf(list).find(([p, q]) => Math.abs(p - q) === a), big = Math.max(x, y), small = Math.min(x, y);
    return M('네 수 중 알맞은 수를 골라 뺄셈식을 완성하려고 한다. ㉠, ㉡에 알맞은 수를 구하시오.', [{ label: LABELS[0], answer: big }, { label: LABELS[1], answer: small }], { figure: numbers(list) + expr(box(LABELS[0]), '-', a, '=', box(LABELS[1])), explain: shown(big, '-', a), facts: { pairs: { numbers: list, want: 'diff', target: a } } });
  }

  // ── 계산 결과 견주기 ─────────────────────────────────────────
  const mixedPair = (d) => (d.bool() ? ['+', addPair(d, (c, x, y) => ADD.any(c) && x + y <= 990)] : ['-', subPair(d, SUB.any)]);
  const valueOf = ([op, [a, b]]) => result(a, op, b);
  const exprOf = ([op, [a, b]]) => expr(a, op, b);
  const textOf = ([op, [a, b]]) => E(a, op, b);
  const solved = (rows) => rows.map((row, i) => `${LABELS[i]} ${shown(row[1][0], row[0], row[1][1])}`).join(', ');
  function nearest(d) {
    const target = d.pick([400, 500, 600, 700]);
    const rows = d.until(() => [mixedPair(d), mixedPair(d), mixedPair(d)], (list) => { const gaps = list.map((r) => Math.abs(valueOf(r) - target)); const s = gaps.slice().sort((p, q) => p - q); return s[0] <= 12 && s[1] - s[0] >= 3 && s[2] <= 40; });
    const gaps = rows.map((r) => Math.abs(valueOf(r) - target));
    return C(`계산 결과가 ${target}에 가장 가까운 것은?`, LABELS.slice(0, 3), gaps.indexOf(Math.min(...gaps)), { figure: tagged(rows.map(exprOf)), explain: solved(rows), facts: { choose: { exprs: rows.map(textOf), rule: 'nearest', target } } });
  }
  function ordered(d, ascending) {
    const rows = d.until(() => [mixedPair(d), mixedPair(d), mixedPair(d)], (list) => { const v = list.map(valueOf).sort((p, q) => p - q); return v[1] - v[0] >= 3 && v[2] - v[1] >= 3 && v[2] - v[0] <= 120; });
    const values = rows.map(valueOf);
    const rank = [0, 1, 2].sort((p, q) => (ascending ? values[p] - values[q] : values[q] - values[p]));
    const say = (order) => order.map((i) => LABELS[i]).join(', ');
    const options = d.shuffle([[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]].filter((o) => o.join() !== rank.join())).slice(0, 3).concat([rank]);
    const shuffled = d.shuffle(options);
    return C(`계산 결과가 ${ascending ? '작은' : '큰'} 것부터 차례대로 나열한 것은?`, shuffled.map(say), shuffled.findIndex((o) => o.join() === rank.join()), { figure: tagged(rows.map(exprOf)), explain: solved(rows), facts: { choose: { exprs: rows.map(textOf), rule: ascending ? 'ascending' : 'descending', orders: shuffled } } });
  }
  function countThose(d) {
    const target = d.pick([300, 400, 500]), above = d.bool();
    const rows = d.until(() => [mixedPair(d), mixedPair(d), mixedPair(d), mixedPair(d)], (list) => { const v = list.map(valueOf); const hit = v.filter((x) => (above ? x > target : x < target)).length; return hit >= 1 && hit <= 3 && v.every((x) => x !== target && Math.abs(x - target) <= 160); });
    const hits = rows.filter((r) => (above ? valueOf(r) > target : valueOf(r) < target)).length;
    return N(`계산 결과가 ${target}보다 ${above ? '큰' : '작은'} 것은 모두 몇 개인가?`, hits, { unit: '개', figure: tagged(rows.map(exprOf)), explain: solved(rows), facts: { choose: { exprs: rows.map(textOf), rule: above ? 'countAbove' : 'countBelow', target } } });
  }

  // ── 길 그림 ─────────────────────────────────────────────────
  function roadItem(d, kind) {
    if (kind === 'same') {
      const [q, r] = addPair(d, (c, x, y) => ADD.any(c) && x + y <= 990), p = d.until(() => d.int(120, q + r - 130), plain), x = q + r - p;
      return N('집에서 도서관을 거쳐 학교까지 가는 거리는 집에서 놀이터를 거쳐 학교까지 가는 거리와 같다. 집에서 도서관까지의 거리는 몇 m인가?', x, { unit: 'm', figure: route([['집', 0, 50], ['도서관', 50, 0, false], ['놀이터', 50, 100], ['학교', 100, 50]], [[0, 1, '?'], [1, 3, p + 'm'], [0, 2, q + 'm', 12], [2, 3, r + 'm', 12]], 70), explain: `놀이터를 거쳐 가는 거리는 ${expr(q, '+', r, '=', q + r)}(m)이다. ` + expr(q + r, '-', p, '=', x), facts: { calc: [[`${q}+${r}-${p}`, 0]] } });
    }
    if (kind === 'detour') {
      const [one, two] = d.shuffle(NAMES).slice(0, 2);
      const [a, b] = addPair(d, (c, x, y) => ADD.any(c) && x + y <= 990), c = d.until(() => d.int(Math.max(a, b) + 20, a + b - 60), plain);
      return N(`${josa(one, '과/와')} ${name(two, '은/는')} 영화관에서 만나기로 하였다. ${name(one, '은/는')} 집에서 출발하여 서점에 들러 영화관으로 가고, ${name(two, '은/는')} 집에서 바로 영화관으로 갈 때, 두 사람이 움직인 거리의 차는 몇 m인가?`, a + b - c, { unit: 'm', figure: route([['집', 0, 100], ['서점', 50, 0, false], ['영화관', 100, 100]], [[0, 1, a + 'm'], [1, 2, b + 'm'], [0, 2, c + 'm', 12]], 70), explain: `서점에 들러 가는 거리는 ${expr(a, '+', b, '=', a + b)}(m)이다. ` + expr(a + b, '-', c, '=', a + b - c), facts: { calc: [[`${a}+${b}-${c}`, 0]] } });
    }
    if (kind === 'overlap') {
      const total = three(d, 620, 940), x = d.int(110, 260), left = d.int(110, total - x - 120), p = left + x, q = total - left;
      return N(`집에서 공원까지의 거리는 ${total}m이다. 집에서 마트까지의 거리는 ${p}m이고 빵집에서 공원까지의 거리는 ${q}m일 때, 빵집에서 마트까지의 거리는 몇 m인가?`, x, { unit: 'm', figure: route([['집', 0, 50], ['빵집', 34, 50], ['마트', 62, 50], ['공원', 100, 50]], [[0, 1], [1, 2, '?'], [2, 3]], 40), explain: `${expr(p, '+', q, '=', p + q)}(m)에는 빵집에서 마트까지의 거리가 두 번 들어 있다. ` + expr(p + q, '-', total, '=', x), facts: { calc: [[`${p}+${q}-${total}`, 0]] } });
    }
    if (kind === 'hike') {
      const xs = distinct(d, 4, 135, 380, 6), total = xs.reduce((s, v) => s + v, 0), who = d.pick(NAMES);
      return N(`${name(who, '은/는')} 산 입구에서 약수터를 거쳐 산 정상까지 올라간 뒤, 산 정상에서 휴게소를 거쳐 산 입구로 내려왔다. ${name(who, '이/가')} 걸은 거리는 모두 몇 m인가?`, total, { unit: 'm', figure: route([['입구', 0, 50], ['약수터', 50, 0, false], ['휴게소', 50, 100], ['정상', 100, 50]], [[0, 1, xs[0] + 'm'], [1, 3, xs[1] + 'm'], [3, 2, xs[2] + 'm', 12], [2, 0, xs[3] + 'm', 12]], 70), explain: `올라간 거리는 ${expr(xs[0], '+', xs[1], '=', xs[0] + xs[1])}(m), 내려온 거리는 ${expr(xs[2], '+', xs[3], '=', xs[2] + xs[3])}(m)이다. ` + expr(xs[0] + xs[1], '+', xs[2] + xs[3], '=', total), facts: { calc: [[xs.join('+'), 0]] } });
    }
    if (kind === 'via') {
      const [a, b] = addPair(d, ADD.once), who = d.pick(NAMES);
      return N(`서울에서 경주까지의 거리는 ${a}km이고, 경주에서 통영까지의 거리는 ${b}km이다. ${nick(who)}네 가족이 서울에서 경주를 거쳐 통영까지 갔을 때, 이동한 거리는 모두 몇 km인가?`, a + b, { unit: 'km', explain: shown(a, '+', b), facts: { calc: [[E(a, '+', b), 0]] } });
    }
    // 'back': 학교까지 갔다가 문구점에 들렀다 다시 학교로
    const a = three(d, 310, 560), b = three(d, 115, 240), who = d.pick(NAMES);
    return N(`${name(who, '은/는')} 집에서 ${a}m 떨어진 학교 앞까지 갔다가 준비물을 가져오지 않은 것이 생각나서 학교에서 ${b}m 떨어진 문구점에 갔다. 문구점에서 준비물을 사고 다시 학교로 갔을 때, ${name(who, '이/가')} 이동한 거리는 모두 몇 m인가?`, a + b + b, { unit: 'm', explain: `${shown(a, '+', b)}, ${expr(a + b, '+', b, '=', a + b + b)}`, facts: { calc: [[`${a}+${b}+${b}`, 0]] } });
  }

  // ── 여러 번 계산하는 문장제 ───────────────────────────────────
  function steps(d, kind) {
    const who = d.pick(NAMES), [one, two] = d.shuffle(NAMES).slice(0, 2);
    if (kind === 'ride') {
      const a = three(d, 410, 880), b = three(d, 130, 290), c = three(d, 120, 310);
      const [place, verb] = d.pick([['지하철', '타고'], ['기차', '타고']]);
      return N(`${place}에 ${a}명이 ${verb} 있었다. 이번 역에서 ${b}명이 내리고 ${c}명이 새로 탔다. 지금 ${place}에 타고 있는 사람은 몇 명인가?`, a - b + c, { unit: '명', explain: `${shown(a, '-', b)}, ${expr(a - b, '+', c, '=', a - b + c)}`, facts: { calc: [[`${a}-${b}+${c}`, 0]] } });
    }
    if (kind === 'school') {
      const a = three(d, 260, 420), b = three(d, 240, 410), c = three(d, 105, 160), e = three(d, 102, 150);
      return N(`지난해 ${nick(who)}네 학교의 남학생은 ${a}명, 여학생은 ${b}명이었다. 올해 ${c}명이 졸업하고 ${e}명이 입학하였다. 올해 ${nick(who)}네 학교의 학생은 모두 몇 명인가?`, a + b - c + e, { unit: '명', explain: `${shown(a, '+', b)}, ${expr(a + b, '-', c, '=', a + b - c)}, ${expr(a + b - c, '+', e, '=', a + b - c + e)}`, facts: { calc: [[`${a}+${b}-${c}+${e}`, 0]] } });
    }
    if (kind === 'money') {
      const total = d.pick([800, 900, 950]), p = d.int(32, 48) * 10, q = d.int(12, 29) * 10;
      return N(`${name(who, '은/는')} ${total}원을 가지고 있다. ${p}원짜리 가위를 한 개 사고 저금통에 ${q}원을 넣었을 때, ${nick(who)}에게 남은 돈은 얼마인가?`, total - p - q, { unit: '원', explain: `${shown(total, '-', p)}, ${expr(total - p, '-', q, '=', total - p - q)}`, facts: { calc: [[`${total}-${p}-${q}`, 0]] } });
    }
    if (kind === 'more') {
      const [a, b] = addPair(d, (c, x, y) => ADD.any(c) && y <= 290 && x + y <= 990);
      const [thing, unit] = d.pick([['호박', '개'], ['사과', '개'], ['배추', '포기']]);
      return N(`${nick(who)}네 농장에서 작년에는 ${thing}을 ${a}${unit} 수확하였고, 올해는 작년보다 ${b}${unit} 더 많이 수확하였다. 작년과 올해 수확한 ${thing}은 모두 몇 ${unit}인가?`.replace('호박을', '호박을').replace('사과을', '사과를').replace('배추을', '배추를').replace('사과은', '사과는').replace('배추은', '배추는'), a + a + b, { unit, explain: `올해 수확한 양은 ${shown(a, '+', b)}(${unit})이다. ` + expr(a, '+', a + b, '=', a + a + b), facts: { calc: [[`${a}+${a}+${b}`, 0]] } });
    }
    if (kind === 'jumpMore') {
      const [a, b] = addPair(d, (c, x, y) => ADD.any(c) && y <= 240 && x + y <= 900);
      return N(`${name(who, '은/는')} 줄넘기를 어제는 ${a}회 하였고, 오늘은 어제보다 ${b}회 더 많이 하였다. ${name(who, '이/가')} 어제와 오늘 한 줄넘기는 모두 몇 회인가?`, a + a + b, { unit: '회', explain: `오늘은 ${shown(a, '+', b)}(회) 하였다. ` + expr(a, '+', a + b, '=', a + a + b), facts: { calc: [[`${a}+${a}+${b}`, 0]] } });
    }
    if (kind === 'less') {
      const [a, b] = subPair(d, (bw, x, y) => SUB.any(bw) && y <= 290 && x >= 520);
      return N(`${nick(who)}네 학교의 여학생은 ${a}명이고, 남학생은 여학생보다 ${b}명 더 적다. ${nick(who)}네 학교의 학생은 모두 몇 명인가?`, a + a - b, { unit: '명', explain: `남학생은 ${shown(a, '-', b)}(명)이다. ` + expr(a, '+', a - b, '=', a + a - b), facts: { calc: [[`${a}+${a}-${b}`, 0]] } });
    }
    if (kind === 'string') {
      const [a, b] = addPair(d, (c, x, y) => ADD.any(c) && x <= 480 && y <= 290);
      return N(`초록색 끈의 길이는 ${a}cm이고, 노란색 끈의 길이는 초록색 끈의 길이보다 ${b}cm 더 길다. 두 끈을 겹치는 부분 없이 길게 이어 붙였을 때, 전체 길이는 몇 cm인가?`, a + a + b, { unit: 'cm', explain: `노란색 끈의 길이는 ${shown(a, '+', b)}(cm)이다. ` + expr(a, '+', a + b, '=', a + a + b), facts: { calc: [[`${a}+${a}+${b}`, 0]] } });
    }
    if (kind === 'friend') {
      const [a, b] = addPair(d, (c, x, y) => ADD.any(c) && x + y <= 690), c = three(d, 110, 240);
      return N(`${name(one, '은/는')} 줄넘기를 어제 ${a}회, 오늘 ${b}회 넘었다. ${name(two, '은/는')} ${name(one, '이/가')} 이틀 동안 넘은 횟수보다 ${c}회 더 많이 넘었다. ${name(two, '이/가')} 넘은 줄넘기 횟수는 몇 회인가?`, a + b + c, { unit: '회', explain: `${shown(a, '+', b)}, ${expr(a + b, '+', c, '=', a + b + c)}`, facts: { calc: [[`${a}+${b}+${c}`, 0]] } });
    }
    if (kind === 'orchard') {
      const a = three(d, 420, 640), b = three(d, 110, 190), c = three(d, 130, 240);
      const second = a - b, third = second + c;
      return N(`㉮, ㉯, ㉰ 세 과수원이 있다. ㉮ 과수원에는 복숭아가 ${a}개 있고, ㉯ 과수원에는 ㉮ 과수원보다 복숭아가 ${b}개 더 적게 있다. ㉰ 과수원에는 ㉯ 과수원보다 복숭아가 ${c}개 더 많이 있다. 세 과수원에 있는 복숭아는 모두 몇 개인가?`, a + second + third, { unit: '개', explain: `㉯ 과수원은 ${shown(a, '-', b)}(개), ㉰ 과수원은 ${shown(second, '+', c)}(개)이다. ${expr(a, '+', second, '+', third, '=', a + second + third)}`, facts: { calc: [[`${a}+(${a}-${b})+(${a}-${b}+${c})`, 0]] } });
    }
    if (kind === 'books') {
      const xs = distinct(d, 4, 105, 190, 3);
      return N(`${name(one, '은/는')} 동화책을 ${xs[0]}쪽까지 읽었고, ${xs[1]}쪽을 더 읽어야 다 읽는다. ${name(two, '은/는')} 동화책을 ${xs[2]}쪽까지 읽었고, ${xs[3]}쪽을 더 읽어야 다 읽는다. 두 사람이 읽고 있는 동화책의 쪽수의 합은 몇 쪽인가?`, xs.reduce((s, v) => s + v, 0), { unit: '쪽', explain: `${shown(xs[0], '+', xs[1])}, ${shown(xs[2], '+', xs[3])}, ${expr(xs[0] + xs[1], '+', xs[2] + xs[3], '=', xs.reduce((s, v) => s + v, 0))}`, facts: { calc: [[xs.join('+'), 0]] } });
    }
    if (kind === 'left') {
      const [a, b] = subPair(d, SUB.any);
      const [c, e] = d.until(() => subPair(d, SUB.any), ([x, y]) => Math.abs(x - y - (a - b)) >= 12 && Math.abs(x - y - (a - b)) <= 120);
      const red = a - b, green = c - e;
      return C(`빨간 색종이 ${a}장 중 ${b}장을 사용하고, 초록 색종이 ${c}장 중 ${e}장을 사용하였다. 더 많이 남은 색종이는?`, ['빨간 색종이', '초록 색종이'], red > green ? 0 : 1, { explain: `빨간 색종이는 ${shown(a, '-', b)}(장), 초록 색종이는 ${shown(c, '-', e)}(장) 남았다.`, facts: { choose: { exprs: [E(a, '-', b), E(c, '-', e)], rule: 'max' } } });
    }
    if (kind === 'double') {
      const a = three(d, 126, 480);
      return N(`귤이 한 상자에 ${a}개씩 들어 있다. 2상자에 들어 있는 귤은 모두 몇 개인가?`, a + a, { unit: '개', explain: shown(a, '+', a), facts: { calc: [[`${a}+${a}`, 0]] } });
    }
    if (kind === 'unit') {
      const m = d.int(4, 8), c = d.int(1, 6) * 10, used = three(d, 150, 390);
      return N(`길이가 ${m}m ${c}cm인 색 테이프 중 선물을 포장하는 데 ${used}cm를 사용하였다. 남은 색 테이프는 몇 cm인가?`, m * 100 + c - used, { unit: 'cm', explain: `${m}m ${c}cm는 ${m * 100 + c}cm이다. ` + shown(m * 100 + c, '-', used), facts: { calc: [[`${m}*100+${c}-${used}`, 0]] } });
    }
    if (kind === 'ends') {
      const xs = distinct(d, 3, 160, 790, 40), sorted = xs.slice().sort((p, q) => q - p);
      return N('가장 큰 수와 가장 작은 수의 합에서 나머지 한 수를 뺀 값을 구하시오.', sorted[0] + sorted[2] - sorted[1], { figure: numbers(xs), explain: `${shown(sorted[0], '+', sorted[2])}, ${expr(sorted[0] + sorted[2], '-', sorted[1], '=', sorted[0] + sorted[2] - sorted[1])}`, facts: { ends3: xs } });
    }
    if (kind === 'after') {
      const [a, b] = subPair(d, (bw, x, y) => SUB.any(bw) && x - y >= 210), c = d.until(() => d.int(105, a - b - 30), plain);
      return N(`다음 계산 결과보다 ${c} 작은 수를 구하시오.`, a - b - c, { figure: expr(a, '-', b), explain: `${shown(a, '-', b)}, ${expr(a - b, '-', c, '=', a - b - c)}`, facts: { calc: [[`${a}-${b}-${c}`, 0]] } });
    }
    if (kind === 'dialog') {
      const [a, b] = addPair(d, (c, x, y) => ADD.any(c) && x <= 320 && y <= 320), c = three(d, 110, 240);
      return N(`${nick(one)}네 학교 3학년은 여학생이 ${a}명, 남학생이 ${b}명이다. ${nick(two)}네 학교 3학년은 ${nick(one)}네 학교 3학년보다 학생이 ${c}명 더 많다. ${nick(two)}네 학교 3학년 학생은 모두 몇 명인가?`, a + b + c, { unit: '명', explain: `${shown(a, '+', b)}, ${expr(a + b, '+', c, '=', a + b + c)}`, facts: { calc: [[`${a}+${b}+${c}`, 0]] } });
    }
    // 'triangle': 삼각형의 세 변의 길이의 합
    const xs = d.until(() => distinct(d, 3, 105, 290, 5), ([x, y, z]) => x + y > z + 20 && y + z > x + 20 && x + z > y + 20);
    return N(`세 변의 길이가 각각 ${xs[0]}cm, ${xs[1]}cm, ${xs[2]}cm인 삼각형이 있다. 이 삼각형의 세 변의 길이의 합은 몇 cm인가?`, xs[0] + xs[1] + xs[2], { unit: 'cm', explain: `${shown(xs[0], '+', xs[1])}, ${expr(xs[0] + xs[1], '+', xs[2], '=', xs[0] + xs[1] + xs[2])}`, facts: { calc: [[xs.join('+'), 0]] } });
  }

  // ── 묶음별 실력 문항 ─────────────────────────────────────────
  const YBM = 'YBM 수학익힘유사 문제(심화)', BS = '비상 차시별 심화 문제';
  B.addTypes(UNIT, 'add0', [
    T('add0-h-hide', '가려진 숫자 찾기', YBM + ' 02', (d) => { const [a, b] = addPair(d, ADD.none); return hidden(d, a, '+', b, 2); }, 2),
    T('add0-h-digit', '□에 들어갈 수 있는 수', YBM + ' 02', (d) => digitSet(d, 'tens')),
    T('add0-h-cards', '수 카드로 만든 수의 합', YBM + ' 02 · ' + BS, (d, n, v) => cardItem(d, v % 2 === 0 ? 3 : 6, 'max+min', v % 2 === 1 ? true : null)),
    T('add0-h-via', '거쳐 가는 거리', YBM + ' 02', (d) => { const [a, b] = addPair(d, ADD.none); return N(`집에서 서점까지의 거리는 ${a}m이고, 서점에서 도서관까지의 거리는 ${b}m이다. 집에서 서점을 거쳐 도서관까지의 거리는 몇 m인가?`, a + b, { unit: 'm', figure: route([['집', 0, 50], ['서점', 48, 50], ['도서관', 100, 50]], [[0, 1, a + 'm'], [1, 2, b + 'm']], 40), explain: shown(a, '+', b), facts: { calc: [[E(a, '+', b), 0]] } }); })
  ]);
  B.addTypes(UNIT, 'add1', [
    T('add1-h-compose', '몇 개인 수의 합', BS + ' · ' + YBM + ' 03', (d) => composeItem(d, '+'), 2),
    T('add1-h-hide', '가려진 숫자 찾기', YBM + ' 03', (d) => { const [a, b] = addPair(d, ADD.once); return hidden(d, a, '+', b, 2); }, 2),
    T('add1-h-balls', '합이 가장 크게 되는 두 수', YBM + ' 03', (d) => pickTwo(d, 'maxSum')),
    T('add1-h-via', '거쳐 가는 거리', YBM + ' 03', (d) => roadItem(d, 'via'))
  ]);
  B.addTypes(UNIT, 'add2', [
    T('add2-h-hide', '가려진 숫자 찾기', YBM + ' 04', (d, n) => { const [a, b] = addPair(d, n === 0 ? ADD.twice : ADD.thrice); return hidden(d, a, '+', b, 3); }, 2),
    T('add2-h-digit', '□에 들어갈 수 있는 수', YBM + ' 04', (d) => digitSet(d, 'hundreds')),
    T('add2-h-more', '더 많이 수확한 양까지 모두', BS + ' · YBM 단원심화평가', (d, n) => steps(d, n === 0 ? 'more' : 'jumpMore'), 2),
    T('add2-h-string', '더 긴 끈을 이어 붙인 길이', YBM + ' 04', (d) => steps(d, 'string')),
    T('add2-h-second', '가장 큰 수와 두 번째로 큰 수의 합', YBM + ' 04', (d) => cardItem(d, 3, 'max+second', null)),
    T('add2-h-hike', '오르내린 거리', YBM + ' 04 · 천재 단원 평가(심화)', (d) => roadItem(d, 'hike')),
    T('add2-h-double', '같은 수를 두 번 더하기', '미래엔 단원평가 심화', (d) => steps(d, 'double'))
  ]);
  B.addTypes(UNIT, 'sub0', [
    T('sub0-h-hide', '가려진 숫자 찾기', YBM + ' 05', (d) => { const [a, b] = subPair(d, (bw, x, y) => SUB.none(bw) && x - y >= 100); return hidden(d, a, '-', b, 2); }, 2),
    T('sub0-h-range', '□에 들어갈 수 있는 가장 큰 수', YBM + ' 05 · ' + BS, (d) => range(d, 'A-x>C')),
    T('sub0-h-order', '계산 결과가 큰 것부터', YBM + ' 05', (d) => ordered(d, false)),
    T('sub0-h-detour', '들러 간 거리와 바로 간 거리', YBM + ' 05 · 디딤돌 문장제 서술형', (d) => roadItem(d, 'detour'))
  ]);
  B.addTypes(UNIT, 'sub1', [
    T('sub1-h-table', '표에서 차 구하기', YBM + ' 06 · 아이스크림 심화', (d, n) => tableItem(d, n === 0 ? 'jumpTwo' : 'jump'), 2),
    T('sub1-h-after', '계산 결과보다 더 작은 수', YBM + ' 06', (d) => steps(d, 'after')),
    T('sub1-h-maxdiff', '차가 가장 크게 되는 두 수', YBM + ' 06 · 천재 단원 평가(심화)', (d) => pickTwo(d, 'maxDiff')),
    T('sub1-h-tape', '겹쳐 이어 붙인 길이', YBM + ' 06', (d) => { const a = three(d, 310, 480), k = three(d, 105, 190); return N(`길이가 ${a}cm인 리본 2개를 ${k}cm만큼 겹치게 이어 붙였다. 이어 붙인 리본의 전체 길이는 몇 cm인가?`, a + a - k, { unit: 'cm', figure: tapes(a + 'cm', a + 'cm', k + 'cm'), explain: `${shown(a, '+', a)}, ${expr(a + a, '-', k, '=', a + a - k)}`, facts: { calc: [[`${a}+${a}-${k}`, 0]] } }); }),
    T('sub1-h-complete', '수를 골라 뺄셈식 완성하기', BS, (d) => pickTwo(d, 'complete'))
  ]);
  B.addTypes(UNIT, 'sub2', [
    T('sub2-h-equation', '등식의 □', YBM + ' 07 · 천재 단원 평가(심화)', (d, n) => {
      const [a, b] = subPair(d, (bw, x, y) => SUB.twice(bw) && x - y >= 240), v = a - b;
      if (n === 0) { const c = d.until(() => d.int(110, v - 30), plain); return N('□ 안에 알맞은 수를 구하시오.', v - c, { figure: expr(a, '-', b, '=', box(), '+', c), explain: `${shown(a, '-', b)}, ${expr(v, '-', c, '=', v - c)}`, facts: { calc: [[`${a}-${b}-${c}`, 0]] } }); }
      const c = d.until(() => d.int(v + 105, Math.min(999, v + 420)), plain);
      return N('□ 안에 알맞은 수를 구하시오.', c - v, { figure: expr(a, '-', b, '=', c, '-', box()), explain: `${shown(a, '-', b)}, ${expr(c, '-', v, '=', c - v)}`, facts: { calc: [[`${c}-(${a}-${b})`, 0]] } });
    }, 2),
    T('sub2-h-erased', '지워진 숫자', YBM + ' 07 · 천재 단원 평가(심화)', (d) => {
      const [a, b] = subPair(d, (bw, x, y) => SUB.twice(bw) && x - y >= 100);
      const item = hidden(d, a, '-', b, 2);
      // 두 수에서만 가리고(차는 보여 준다) 문장을 수집본의 꼴로 바꾼다.
      const rows = [chars(a), chars(b)], masks = [{ row: 0, place: 1 }, { row: 1, place: 0 }];
      rows[0][1] = box(LABELS[0]); rows[1][2] = box(LABELS[1]);
      return M(`카드 2장에 세 자리 수를 하나씩 써 놓았는데 숫자가 하나씩 지워졌다. 두 수의 차가 ${a - b}일 때, ㉠, ㉡에 알맞은 숫자를 구하시오.`, [{ label: LABELS[0], answer: Number(String(a)[1]) }, { label: LABELS[1], answer: Number(String(b)[2]) }], { figure: `<div class="mb-numbers"><span>${rows[0].join('')}</span><span>${rows[1].join('')}</span></div>`, explain: item.explain, facts: { masks, pair: [a, '-', b] } });
    }),
    T('sub2-h-wrong', '잘못 계산한 어떤 수', YBM + ' 07 · ' + BS, (d, n) => wrong(d, n === 0 ? 'sub->add' : 'add->sub'), 2),
    T('sub2-h-cond', '조건에 맞는 수 카드의 수', YBM + ' 07', (d) => {
      const [one, two] = d.shuffle(NAMES).slice(0, 2);
      const made = d.until(() => { const digits = drawCards(d, 4, false), all = permute3(digits); const x = d.pick(digits), y = d.pick(digits); return { digits, x, y, low: all.filter((v) => v % 10 === x)[0], high: all.filter((v) => Math.floor(v / 10) % 10 === y).slice(-1)[0] }; }, (m) => m.x !== m.y && m.low !== m.high && Math.abs(m.high - m.low) >= 60);
      const big = Math.max(made.high, made.low), small = Math.min(made.high, made.low);
      return N(`수 카드 4장 중 3장을 뽑아 세 자리 수를 만든다. ${name(one, '은/는')} 일의 자리 수가 ${made.x}인 수 중 가장 작은 수를, ${name(two, '은/는')} 십의 자리 수가 ${made.y}인 수 중 가장 큰 수를 만들었다. 두 사람이 만든 수의 차를 구하시오.`, big - small, { figure: cards(made.digits), explain: `${name(one, '이/가')} 만든 수는 ${made.low}, ${name(two, '이/가')} 만든 수는 ${made.high}이다. ` + shown(big, '-', small), facts: { cardCond: { digits: made.digits, onesIs: made.x, tensIs: made.y } } });
    }),
    T('sub2-h-overlap', '겹치는 구간의 거리', YBM + ' 07 · 지학사 단원평가 실력', (d) => roadItem(d, 'overlap'))
  ]);
  B.addTypes(UNIT, 'est', [
    Object.assign(T('est-h-flip', '어림셈 문장제(뺄셈)', '비상 단원 평가 실력 문제', (d) => {
      const a = d.int(3, 6) * 100 - d.int(2, 9), b = d.int(1, 2) * 100 + d.int(1, 9), est = Math.round(a / 100) * 100 - Math.round(b / 100) * 100;
      return N(`앞면이 파란색이고 뒷면이 흰색인 판 ${a}개를 뒤집는 경기를 하였다. 경기가 끝난 후 파란색이 보이는 판이 ${b}개일 때, 흰색이 보이는 판은 약 몇 개인지 어림셈으로 구하시오.`, est, { unit: '개', lead: '약', explain: `${josa(a, '은/는')} 약 ${Math.round(a / 100) * 100}, ${josa(b, '은/는')} 약 ${Math.round(b / 100) * 100}이다. ` + expr(Math.round(a / 100) * 100, '-', Math.round(b / 100) * 100, '=', est), facts: { estimate: [a, '-', b] } });
    }), { standard: EST }),
    T('est-h-string', '어림한 값과 실제 값', '동아 단원평가 심화', (d) => {
      const a = d.int(5, 9) * 100 + d.int(5, 18), b = d.int(1, 3) * 100 - d.int(5, 18), who = d.pick(NAMES);
      const est = Math.round(a / 100) * 100 - Math.round(b / 100) * 100;
      return M(`${name(who, '은/는')} 끈 ${a}cm 중에서 ${b}cm를 사용하였다. 남은 끈의 길이를 어림셈으로 구한 값 ㉠과 실제로 남은 끈의 길이 ㉡을 구하시오.`, [{ label: LABELS[0], lead: '약', answer: est, unit: 'cm' }, { label: LABELS[1], answer: a - b, unit: 'cm' }], { explain: `어림셈: ${expr(Math.round(a / 100) * 100, '-', Math.round(b / 100) * 100, '=', est)}, 실제: ${shown(a, '-', b)}`, facts: { estimate: [a, '-', b], calc: [[E(a, '-', b), 1]] } });
    }),
    T('est-h-buy', '어림셈으로 살 수 있는지 판단하기', '미래엔 단원평가 심화', (d) => {
      const a = d.int(4, 7) * 100 - d.int(4, 15), b = d.int(6, 9) * 100 + d.int(4, 15);
      const ra = Math.round(a / 100) * 100, rb = Math.round(b / 100) * 100, can = d.bool(), money = ra + rb + (can ? 100 : -100);
      const right = can ? `어림하면 약 ${ra + rb}원이므로 살 수 있다.` : `어림하면 약 ${ra + rb}원이므로 살 수 없다.`;
      const options = d.shuffle([`어림하면 약 ${ra + rb}원이므로 살 수 있다.`, `어림하면 약 ${ra + rb}원이므로 살 수 없다.`, `어림하면 약 ${ra + rb - 200}원이므로 살 수 있다.`, `어림하면 약 ${ra + rb + 200}원이므로 살 수 없다.`]);
      return C(`마트에서 사탕 1개는 ${a}원, 젤리 1개는 ${b}원에 판다. ${money}원으로 사탕 1개와 젤리 1개를 살 수 있는지 어림셈으로 알아본 것으로 옳은 것은?`, options, options.indexOf(right), { explain: `${josa(a, '은/는')} 약 ${ra}, ${josa(b, '은/는')} 약 ${rb}이므로 ${expr(ra, '+', rb, '=', ra + rb)}(원)쯤이다. 실제 값은 ${shown(a, '+', b)}(원)이다.`, facts: { estimateJudge: { a, b, op: '+', limit: money, options } } });
    }),
    T('est-h-room', '남은 인원으로 판단하기', '미래엔 단원평가 심화', (d) => {
      const cap = d.pick([600, 700, 800, 900]), used = d.int(2, 4) * 100 + d.int(2, 9), left = cap - used, can = d.bool();
      const need = can ? left - d.int(8, 25) : left + d.int(8, 25), who = d.pick(NAMES);
      const say = (n, ok) => `남은 체험 인원이 ${n}명이므로 모두 체험할 수 ${ok ? '있다' : '없다'}.`;
      const options = d.shuffle([say(left, true), say(left, false), say(left + 100, true), say(left - 100, false)]);
      return C(`어느 갯벌은 하루에 ${cap}명이 체험할 수 있고, 지금까지 ${used}명이 체험하였다. ${nick(who)}네 학교 학생 ${need}명이 모두 갯벌 체험을 할 수 있는지 바르게 설명한 것은?`, options, options.indexOf(say(left, can)), { explain: `남은 체험 인원은 ${shown(cap, '-', used)}(명)이다. ${need}명은 ${left}명보다 ${can ? '적다' : '많다'}.`, facts: { roomJudge: { cap, used, need, options: options.map((o) => [Number(o.match(/\d+/)[0]), o.includes('있다')]) } } });
    }),
    T('est-h-ribbon', '단위를 바꾸어 남은 길이 구하기', '미래엔 단원평가 심화', (d) => {
      const m = d.int(6, 9), used = three(d, 310, 520);
      return N(`리본 ${m}m 중에서 ${used}cm를 잘라 사용하였다. 사용하고 남은 리본의 길이는 몇 cm인가?`, m * 100 - used, { unit: 'cm', explain: `${m}m는 ${m * 100}cm이다. ` + shown(m * 100, '-', used), facts: { calc: [[`${m}*100-${used}`, 0]] } });
    })
  ]);
  B.addTypes(UNIT, 'mix', [
    T('mix-h-chain', '차례로 계산하기', '아이스크림 심화 · 천재 단원 평가(심화)', (d, n) => {
      if (n === 0) {
        const [a, b] = addPair(d, (c, x, y) => ADD.any(c) && x + y <= 900), c = three(d, 120, 480);
        return M('㉠, ㉡에 알맞은 수를 구하시오.', [{ label: LABELS[0], answer: a + b }, { label: LABELS[1], answer: a + b + c }], { figure: chain([a, '+' + b, box(LABELS[0]), '+' + c, box(LABELS[1])]), explain: `${shown(a, '+', b)}, ${expr(a + b, '+', c, '=', a + b + c)}`, facts: { calc: [[`${a}+${b}`, 0], [`${a}+${b}+${c}`, 1]] } });
      }
      const a = d.pick([700, 800, 900]) + d.pick([0, 0, 13, 26, 41]), b = three(d, 120, 290), c = d.until(() => d.int(110, a - b - 40), plain);
      return M('㉠, ㉡에 알맞은 수를 구하시오.', [{ label: LABELS[0], answer: a - b }, { label: LABELS[1], answer: a - b - c }], { figure: chain([a, '-' + b, box(LABELS[0]), '-' + c, box(LABELS[1])]), explain: `${shown(a, '-', b)}, ${expr(a - b, '-', c, '=', a - b - c)}`, facts: { calc: [[`${a}-${b}`, 0], [`${a}-${b}-${c}`, 1]] } });
    }, 2),
    T('mix-h-chainback', '거꾸로 계산하여 빈칸 채우기', 'YBM 단원심화평가', (d) => {
      const [x, b] = subPair(d, SUB.any), mid = x - b, c = d.until(() => d.int(120, 980 - mid), plain), end = mid + c;
      return M('㉠, ㉡에 알맞은 수를 구하시오.', [{ label: LABELS[0], answer: x }, { label: LABELS[1], answer: mid }], { figure: chain([box(LABELS[0]), '-' + b, box(LABELS[1]), '+' + c, end]), explain: `㉡은 ${expr(end, '-', c, '=', mid)}, ㉠은 ${expr(mid, '+', b, '=', x)}이다.`, facts: { calc: [[`${end}-${c}+${b}`, 0], [`${end}-${c}`, 1]] } });
    }),
    T('mix-h-near', '어떤 수에 가장 가까운 계산 결과', 'YBM 단원심화평가', (d) => nearest(d)),
    T('mix-h-order', '계산 결과가 작은 것부터', 'YBM 단원심화평가 · 지학사 단원평가 실력', (d) => ordered(d, true)),
    T('mix-h-count', '조건에 맞는 계산 결과의 수', '동아 단원평가 심화 · 아이스크림 심화', (d) => countThose(d)),
    T('mix-h-range', '□에 들어갈 수 있는 수', 'YBM·동아·미래엔·천재 단원평가 심화, 지학사 서술형', (d, n) => range(d, ['A-B<x', 'A+B>x', 'A-x<C', 'A+B<C-x', 'A-B<x+C'][n]), 5),
    T('mix-h-digit', '0부터 9까지의 수 중 □에 들어갈 수 있는 수', '디딤돌 단원평가(심화) · YBM 서술형평가', (d) => digitSet(d, 'ones')),
    T('mix-h-hide', '가려진 숫자 찾기', '교과서 여러 종 단원평가 심화', (d, n) => { const op = n === 0 ? '+' : '-'; const [a, b] = op === '+' ? addPair(d, ADD.many) : subPair(d, (bw, x, y) => SUB.twice(bw) && x - y >= 100); return hidden(d, a, op, b, 3); }, 2),
    T('mix-h-hidesum', '가려진 숫자의 합', '아이스크림 심화', (d, n, v) => { const op = v % 2 === 0 ? '+' : '-'; const [a, b] = op === '+' ? addPair(d, ADD.many) : subPair(d, (bw, x, y) => SUB.any(bw) && x - y >= 100); return hidden(d, a, op, b, 3, true); }),
    T('mix-h-ride', '타고 내린 뒤의 사람 수', 'YBM 단원심화평가 · 미래엔 단원평가 심화', (d) => steps(d, 'ride')),
    T('mix-h-school', '졸업하고 입학한 뒤의 학생 수', '지학사 단원평가 실력', (d) => steps(d, 'school')),
    T('mix-h-money', '쓰고 저금한 뒤 남은 돈', '미래엔 단원평가 심화', (d) => steps(d, 'money')),
    T('mix-h-less', '더 적은 쪽까지 모두', 'YBM 단원심화평가', (d) => steps(d, 'less')),
    T('mix-h-friend', '이틀 동안의 횟수보다 더 많이', '아이스크림 심화', (d) => steps(d, 'friend')),
    T('mix-h-dialog', '두 학교의 학생 수', 'YBM 단원심화평가', (d) => steps(d, 'dialog')),
    T('mix-h-orchard', '세 과수원', '지학사 단원평가 실력', (d) => steps(d, 'orchard')),
    T('mix-h-books', '두 책의 쪽수', '디딤돌 문장제 서술형', (d) => steps(d, 'books')),
    T('mix-h-left', '더 많이 남은 것', '천재 단원 평가(심화)', (d) => steps(d, 'left')),
    T('mix-h-unit', 'm와 cm가 섞인 길이', '디딤돌 단원평가(심화)', (d) => steps(d, 'unit')),
    T('mix-h-ends', '가장 큰 수와 가장 작은 수의 합에서 나머지 빼기', '지학사 서술형평가', (d) => steps(d, 'ends')),
    T('mix-h-triangle', '세 변의 길이의 합', '아이스크림 심화', (d) => steps(d, 'triangle')),
    T('mix-h-six', '수 카드 6장으로 만든 두 수', 'YBM 단원심화평가', (d) => cardItem(d, 6, 'both', null)),
    T('mix-h-cards', '수 카드 중 3장으로 만든 수', '동아·미래엔·지학사·천재 단원평가 심화', (d, n) => cardItem(d, n === 0 ? 4 : 5, n === 0 ? 'max+min' : 'max-min', true), 2),
    T('mix-h-zero', '십의 자리 숫자가 0인 수', '디딤돌 단원평가(심화)', (d) => {
      const digits = d.until(() => [0, ...d.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 3)], () => true);
      const all = permute3(digits).filter((v) => Math.floor(v / 10) % 10 === 0), big = all[all.length - 1], second = all[1];
      return N('수 카드 4장 중 3장을 한 번씩 사용하여 십의 자리 숫자가 0인 세 자리 수를 만든다. 만들 수 있는 가장 큰 수와 두 번째로 작은 수의 차를 구하시오.', big - second, { figure: cards(d.shuffle(digits)), explain: `가장 큰 수는 ${big}, 두 번째로 작은 수는 ${second}이다. ` + shown(big, '-', second), facts: { zeroTens: digits } });
    }),
    T('mix-h-place', '자리 숫자가 정해진 수', '지학사 단원평가 실력', (d) => {
      const h = d.int(4, 9), t = d.int(1, 9), big = h * 100 + 99, small = 100 + t * 10;
      return N(`백의 자리 숫자가 ${h}인 세 자리 수 중 가장 큰 수와 십의 자리 숫자가 ${t}인 세 자리 수 중 가장 작은 수의 차를 구하시오.`, big - small, { explain: `백의 자리 숫자가 ${h}인 가장 큰 수는 ${big}, 십의 자리 숫자가 ${t}인 가장 작은 수는 ${small}이다. ` + shown(big, '-', small), facts: { placeDigits: [h, t] } });
    }),
    T('mix-h-wrong', '잘못 계산한 어떤 수', '교과서 여러 종 단원평가 심화·서술형', (d, n) => wrong(d, ['add->sub', 'sub->add', 'swap', 'from'][n]), 4),
    T('mix-h-sumdiff', '합이 주어진 두 수의 차', 'YBM 단원심화평가', (d) => {
      const [a, b] = d.until(() => subPair(d, SUB.any), ([x, y]) => ADD.any(carryPlaces(x, y)) && x + y <= 999 && x - y >= 20), known = d.pick([a, b]);
      return N(`두 수의 합이 ${a + b}일 때, 두 수의 차를 구하시오.`, a - b, { figure: numbers([known, box()]), explain: `다른 한 수는 ${expr(a + b, '-', known, '=', a + b - known)}이다. ` + shown(a, '-', b), facts: { sumDiff: [a + b, known] } });
    }),
    T('mix-h-torn', '찢어진 수 카드', '동아 단원평가 심화 · 지학사 단원평가 실력', (d) => {
      const made = d.until(() => { const [a, b] = subPair(d, SUB.any); const known = d.pick([a, b]); return { a, b, known, other: a + b - known, diff: a - b }; }, (m) => {
        const up = m.known + m.diff, down = m.known - m.diff, h = Math.floor(m.other / 100);
        return [up, down].filter((v) => v >= 100 && v <= 999 && Math.floor(v / 100) === h).length === 1 && ADD.any(carryPlaces(m.a, m.b)) && m.a + m.b <= 1500;
      });
      const h = Math.floor(made.other / 100);
      return N(`세 자리 수가 적힌 카드 2장 중 한 장이 찢어져서 백의 자리 숫자만 보인다. 두 수의 차가 ${made.diff}일 때, 두 수의 합을 구하시오.`, made.a + made.b, { figure: `<div class="mb-numbers"><span>${made.known}</span><span>${h}${box()}${box()}</span></div>`, explain: `찢어진 카드의 수는 ${made.other}이다. ` + shown(Math.max(made.known, made.other), '+', Math.min(made.known, made.other)), facts: { torn: { known: made.known, diff: made.diff, hundreds: h } } });
    }),
    T('mix-h-erasedsum', '지워진 숫자가 있는 두 수의 합', '천재 단원 평가(심화)', (d) => {
      const [a, b] = subPair(d, (bw, x, y) => SUB.twice(bw) && x - y >= 100 && x + y <= 1500);
      const top = chars(a), bottom = chars(b);
      top[1] = box(); bottom[2] = box();
      return N(`두 수의 차가 ${a - b}일 때, 두 수의 합을 구하시오.`, a + b, { figure: `<div class="mb-numbers"><span>${top.join('')}</span><span>${bottom.join('')}</span></div>`, explain: `두 수는 ${a}, ${b}이다. ` + shown(a, '+', b), facts: { masks: [{ row: 0, place: 1 }, { row: 1, place: 0 }], pair: [a, '-', b], maskAsk: 'sumOfNumbers' } });
    }),
    T('mix-h-compose', '몇 개인 수의 차', '아이스크림·지학사·천재 단원평가 심화', (d) => composeItem(d, '-')),
    T('mix-h-composesum', '몇 개인 수의 합', '디딤돌 단원평가(심화) · 미래엔 단원평가 심화', (d) => composeItem(d, '+')),
    T('mix-h-overlap', '겹쳐 이어 붙인 색 테이프', 'YBM 단원심화평가 · 디딤돌 단원평가(심화)', (d) => {
      const a = three(d, 260, 480), b = three(d, 240, 470), k = three(d, 105, 160);
      return N(`길이가 ${a}cm인 색 테이프와 ${b}cm인 색 테이프를 ${k}cm만큼 겹치게 이어 붙였다. 이어 붙인 색 테이프의 전체 길이는 몇 cm인가?`, a + b - k, { unit: 'cm', figure: tapes(a + 'cm', b + 'cm', k + 'cm'), explain: `${shown(a, '+', b)}, ${expr(a + b, '-', k, '=', a + b - k)}`, facts: { calc: [[`${a}+${b}-${k}`, 0]] } });
    }),
    T('mix-h-promise', '약속한 기호로 계산하기', 'YBM 단원심화평가 · 디딤돌 단원평가(심화)', (d, n) => {
      if (n === 0) {
        const [a, b] = addPair(d, (c, x, y) => ADD.any(c) && x + y <= 900);
        const [e, c] = d.until(() => subPair(d, SUB.any), ([x, y]) => Math.abs(x - y - (a + b)) >= 25);
        const one = a + b, two = e - c;
        return N('기호 ★, ▲에 대하여 가★나=가+나, 가▲나=나−가라고 약속할 때, ㉮와 ㉯의 차를 구하시오.', Math.abs(one - two), { figure: tagged([`${a}★${b}`, `${c}▲${e}`], ['㉮', '㉯']), explain: `㉮는 ${shown(a, '+', b)}, ㉯는 ${shown(e, '-', c)}이다. ` + shown(Math.max(one, two), '-', Math.min(one, two)), facts: { promise: ['star', a, b, c, e] } });
      }
      const a = three(d, 310, 620), b = three(d, 120, 190);
      return N('기호 ♥에 대하여 가♥나=가+나+나라고 약속할 때, 다음을 계산하시오.', a + b + b, { figure: `<span class="mb-expr">${a}♥${b}</span>`, explain: `${shown(a, '+', b)}, ${expr(a + b, '+', b, '=', a + b + b)}`, facts: { calc: [[`${a}+${b}+${b}`, 0]] } });
    }, 2),
    T('mix-h-road', '길 그림에서 거리 구하기', 'YBM 단원심화평가 · 지학사 서술형 · 천재 서술형', (d, n) => roadItem(d, ['same', 'back'][n]), 2),
    T('mix-h-table', '표를 보고 구하기', 'YBM 서술형평가 · 지학사 단원평가 실력 · 디딤돌 문장제 서술형', (d, n) => tableItem(d, ['grades', 'weekend', 'pages', 'teams', 'calories'][n]), 5),
    T('mix-h-pick', '두 수를 골라 식 완성하기', 'YBM·동아·미래엔·천재 단원평가 심화', (d, n) => pickTwo(d, ['diff', 'sum', 'near'][n]), 3),
    T('mix-h-symbols', '기호가 나타내는 수', '미래엔 단원평가 심화 · 천재 단원 평가(심화)', (d, n) => {
      if (n === 0) {
        const [dot, a] = subPair(d, (bw, x, y) => SUB.any(bw) && x - y >= 100 && x + y <= 999), b = dot + a;
        return N('▲에 알맞은 수를 구하시오.', dot - a, { figure: lines([expr('●', '+', a, '=', b), expr('●', '-', a, '=', '▲')]), explain: `●는 ${expr(b, '-', a, '=', dot)}이다. ` + shown(dot, '-', a), facts: { calc: [[`${b}-${a}-${a}`, 0]] } });
      }
      const [a, b] = addPair(d, (c, x, y) => ADD.any(c) && x + y <= 700), c = three(d, 120, 290);
      return N('같은 기호는 같은 수를 나타낼 때, ■에 알맞은 수를 구하시오.', a + b + c, { figure: lines([expr(a, '+', b, '=', '●'), expr('■', '-', '●', '=', c)]), explain: `●는 ${shown(a, '+', b)}이다. ` + expr(c, '+', a + b, '=', a + b + c), facts: { calc: [[`${a}+${b}+${c}`, 0]] } });
    }, 2),
    T('mix-h-equation', '양쪽이 같아지는 □', '천재 단원 평가(심화)', (d) => {
      const [a, b] = addPair(d, (c, x, y) => ADD.any(c) && x + y <= 700), c = three(d, 120, 290);
      return N('□ 안에 알맞은 수를 구하시오.', a + b + c, { figure: expr(a, '+', b, '=', box(), '-', c), explain: `${shown(a, '+', b)}, ${expr(a + b, '+', c, '=', a + b + c)}`, facts: { calc: [[`${a}+${b}+${c}`, 0]] } });
    })
  ]);
})(typeof window !== 'undefined' ? window : globalThis);
