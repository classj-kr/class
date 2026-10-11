// 수학 문제은행의 문항을 엔진과 다른 길로 다시 셈해 답과 조건을 맞춰 본다.
//   node --test tests/math-bank-units.test.cjs
// 은행에 실린 문항(유형마다 하나)은 물론이고, 유형을 만드는 코드가 어떤 수에서도 옳은지 보려고
// 유형마다 씨앗 수십 개로 더 만들어 같은 검사를 한다. 여기서는
//  - 답이 맞는가(식을 따로 계산), 답이 하나뿐인가(가려진 숫자·□ 범위·고르기 문항은 모든 경우를 따져 본다)
//  - 묶음 이름대로인가(받아올림·받아내림 횟수)
//  - 글이 멀쩡한가(undefined·NaN, 잘못 붙은 토씨, 말투)
//  - 같은 문제가 두 번 실리지 않았는가
// 를 본다.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const ROOT = path.join(__dirname, '..');
// MATH_BANK_DIR: 일부러 흠을 낸 사본으로 이 검사가 짖는지 볼 때 쓴다(원본을 건드리지 않으려고).
const APP = process.env.MATH_BANK_DIR || path.join(ROOT, 'learning/literacy-numeracy/math-bank');
const context = { console }; context.globalThis = context;
vm.createContext(context);
for (const file of ['engine.js', ...fs.readdirSync(path.join(APP, 'units')).filter((f) => f.endsWith('.js')).sort().map((f) => 'units/' + f)]) {
  vm.runInContext(fs.readFileSync(path.join(APP, file), 'utf8'), context, { filename: file });
}
const B = context.MathBank;
const EXTRA_SEEDS = Array.from({ length: 60 }, (_, i) => i * 7919 + 13);

// ── 엔진과 따로 쓴 셈 ──────────────────────────────────────────
function carries(a, b) { let n = 0, c = 0; const at = []; for (let i = 0; i < 3; i += 1) { c = (a % 10) + (b % 10) + c >= 10 ? 1 : 0; n += c; at.push(c); a = Math.trunc(a / 10); b = Math.trunc(b / 10); } return { n, at }; }
function borrows(a, b) { let n = 0, c = 0; for (let i = 0; i < 3; i += 1) { c = (a % 10) - (b % 10) - c < 0 ? 1 : 0; n += c; a = Math.trunc(a / 10); b = Math.trunc(b / 10); } return n; }
const calc = (a, op, b) => (op === '+' ? a + b : a - b);
// 식 글("345+278-(120-15)")을 셈한다. 숫자와 + - * ( ) 만 받는다.
function evaluate(text) {
  assert.match(text, /^[\d+\-*() ]+$/, '식이 아니다: ' + text);
  return Function('"use strict"; return (' + text + ');')();
}
const strip = (html) => String(html || '').replace(/<svg[\s\S]*?<\/svg>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/\s+/g, ' ').trim();
const pairsOf = (list) => { const out = []; for (let i = 0; i < list.length; i += 1) for (let j = i + 1; j < list.length; j += 1) out.push([list[i], list[j]]); return out; };
const hundred = (n) => Math.round(n / 100) * 100;
// 수 카드에서 세 장을 골라 만들 수 있는 세 자리 수 전부
function threeDigit(digits) {
  const out = new Set();
  for (let i = 0; i < digits.length; i += 1) for (let j = 0; j < digits.length; j += 1) for (let k = 0; k < digits.length; k += 1) {
    if (i !== j && j !== k && i !== k && digits[i] !== 0) out.add(digits[i] * 100 + digits[j] * 10 + digits[k]);
  }
  return [...out].sort((x, y) => x - y);
}

// 엔진은 따로 만든 실행 틀(vm) 안에서 돈다. 거기서 나온 배열·객체는 견주기 전에 이쪽 것으로 옮겨 담는다.
const local = (value) => JSON.parse(JSON.stringify(value));

// ── 문항 모으기 ────────────────────────────────────────────────
// 은행에 실린 문항과, 같은 유형을 다른 씨앗으로 더 만든 문항을 차례로 넘긴다.
function everyItem(visit, extra = true) {
  for (const unit of B.units()) for (const group of unit.groups) for (const level of B.LEVELS) {
    for (const item of local(B.bankOf(unit, group.id, level))) visit(item, { unit, group, level, seed: 'bank' });
    if (!extra) continue;
    for (const type of B.typesOf(group, level)) for (let n = 0; n < (type.count || 1); n += 1) for (const seed of EXTRA_SEEDS) {
      const made = type.make(new B.Dice(seed + n * 101), n);
      visit(local(Object.assign({ key: type.id + '#' + (n + 1), typeId: type.id, level: type.level, standard: type.standard || group.standard }, made)), { unit, group, level, seed });
    }
  }
}
const where = (item, at) => `${at.unit.id} ${at.group.id} ${item.key} (seed ${at.seed}): ${strip(item.text)} ${strip(item.figure)}`;
const answerAt = (item, i) => item.inputs[i].answer;

test('모든 문항이 온전한 모양이고 글이 멀쩡하다', () => {
  let made = 0;
  everyItem((item, at) => {
    made += 1;
    const label = where(item, at);
    assert.ok(typeof item.text === 'string' && strip(item.text).length >= 6, label);
    const whole = strip(item.text + ' ' + (item.figure || '') + ' ' + (item.explain || '') + ' ' + (item.choice ? item.choice.options.join(' ') : ''));
    for (const part of [item.text, item.figure, item.explain]) assert.doesNotMatch(String(part || ''), /undefined|NaN|null|\[object/, label);
    // 잘못 붙은 토씨: 받침 없는 수 뒤의 을·은·이·과, 받침 있는 수 뒤의 를·는·가·와 를 수 읽기로 따진다.
    for (const m of whole.matchAll(/(\d+)(을|를|은|는|이|가|과|와)(?=[\s,.])/g)) {
      const batchim = [true, true, false, true, false, false, true, true, true, false][Number(m[1]) % 10];
      assert.equal('을은이과'.includes(m[2]), batchim, `토씨 "${m[0]}" — ${label}`);
    }
    // 낱말 뒤 토씨가 겹쳐 붙은 것(사과을, 배추은 …)
    assert.doesNotMatch(whole, /[가-힣](을를|를을|은는|는은)(?=[\s,.])/, label);
    assert.ok(/^\d수\d\d-\d\d$/.test(item.standard), label);
    // 말투는 수능 문체: "~세요 / ~습니다 / ~인가요" 를 쓰지 않는다.
    assert.doesNotMatch(whole, /세요|습니다|입니다|인가요|나요\?|해요|예요|어요|까요/, '말투: ' + label);
    assert.ok(item.explain && strip(item.explain).length > 3, '풀이가 없다: ' + label);
    if (item.choice) {
      assert.ok(item.choice.options.length >= 2 && Number.isInteger(item.choice.answer) && item.choice.answer >= 0 && item.choice.answer < item.choice.options.length, label);
      assert.equal(new Set(item.choice.options.map(strip)).size, item.choice.options.length, '보기가 겹친다: ' + label);
      assert.equal(B.isCorrect(item, item.choice.answer), true, label);
      assert.equal(B.isCorrect(item, (item.choice.answer + 1) % item.choice.options.length), false, label);
    } else {
      assert.ok(Array.isArray(item.inputs) && item.inputs.length >= 1, label);
      for (const input of item.inputs) assert.ok(Number.isInteger(input.answer) && input.answer >= 0 && input.answer <= 9999, label);
      const answers = item.inputs.map((input) => String(input.answer));
      assert.equal(B.isCorrect(item, answers), true, label);
      assert.equal(B.isCorrect(item, answers.map((v, i) => (i === 0 ? String(Number(v) + 1) : v))), false, label);
      assert.equal(B.isCorrect(item, answers.map(() => '')), false, label);
      if (item.unordered) assert.equal(B.isCorrect(item, answers.slice().reverse()), true, label);
    }
    // 검사할 거리가 하나도 없는 문항은 답을 믿을 수 없다.
    assert.ok(Object.keys(item.facts || {}).length > 0, '다시 셈할 근거(facts)가 없다: ' + label);
  });
  assert.ok(made > 2000, '문항 수: ' + made);
});

test('은행: 같은 문제가 두 번 실리지 않고, 회차가 문항을 빠짐없이 나눈다', () => {
  for (const unit of B.units()) {
    const seen = new Map(), keys = new Set();
    for (const group of unit.groups) for (const level of B.LEVELS) {
      const bank = local(B.bankOf(unit, group.id, level)), rounds = B.roundCount(unit, group.id, level);
      const dealt = [];
      for (let no = 1; no <= rounds; no += 1) {
        const items = local(B.makeRound(unit, group.id, level, no));
        assert.ok(items.length >= 1 && items.length <= 16, `${unit.id} ${group.id} ${level} ${no}회: ${items.length}문항`);
        dealt.push(...items.map((item) => item.key));
      }
      assert.deepEqual(dealt.slice().sort(), bank.map((item) => item.key).sort(), `${unit.id} ${group.id} ${level}`);
      assert.deepEqual(local(B.makeRound(unit, group.id, level, rounds + 1)), []);
      for (const item of bank) {
        assert.ok(!keys.has(item.key), '열쇠가 겹친다: ' + item.key); keys.add(item.key);
        // 수를 지우고 본 글이 같으면 수만 다른 같은 문제다. 받아올림·받아내림 조건이 걸린 계산 문제(facts.rule)만
        // 묶음이 다를 때 같은 꼴을 허락한다(묶음마다 조건이 다르다).
        const shape = strip(item.text + ' ' + (item.figure || '')).replace(/\d+/g, '#');
        const before = seen.get(shape), ruled = Boolean(item.facts && item.facts.rule);
        if (before) assert.ok(ruled && before.ruled && before.groups.every((g) => g !== group.id), `같은 꼴이 두 번: ${item.key} 와 ${before.key} — ${shape}`);
        seen.set(shape, { key: item.key, ruled, groups: (before ? before.groups : []).concat([group.id]) });
      }
    }
  }
});

test('계산: 식을 따로 셈한 값이 답과 같고, 묶음 이름대로 받아올림·받아내림이 일어난다', () => {
  const RULE = {
    add0: (a, b) => carries(a, b).n === 0,
    add1: (a, b) => carries(a, b).n === 1 && carries(a, b).at[2] === 0,
    add2: (a, b) => carries(a, b).n >= 2,
    sub0: (a, b) => borrows(a, b) === 0,
    sub1: (a, b) => borrows(a, b) === 1,
    sub2: (a, b) => borrows(a, b) === 2
  };
  let checked = 0;
  everyItem((item, at) => {
    const f = item.facts || {}, label = where(item, at);
    for (const [text, i] of f.calc || []) { assert.equal(answerAt(item, i), evaluate(text), `${text} — ${label}`); assert.ok(evaluate(text) > 0, label); checked += 1; }
    if (f.pair) {
      const [a, op, b] = f.pair;
      assert.ok(a >= 100 && a <= 999 && b >= 100 && b <= 999, label);
      if (op === '-') assert.ok(a > b, label);
      if (f.rule && RULE[at.group.id]) assert.ok(RULE[at.group.id](a, b), '묶음 조건에 안 맞는 수: ' + label);
      if (f.wrong !== undefined) assert.notEqual(f.wrong, calc(a, op, b), '틀린 답이 정답과 같다: ' + label);
      if (f.carryValue) { const c = carries(a, b).at; assert.equal(answerAt(item, 0), f.carryValue, label); assert.equal(c[f.carryValue === 10 ? 0 : 1], 1, label); }
    }
    if (f.parts) f.parts.forEach(([text, i]) => assert.equal(answerAt(item, i), evaluate(text), label));
  });
  assert.ok(checked > 1000);
});

test('가려진 숫자: 가린 자리를 모든 숫자로 바꿔 보아도 맞는 경우는 하나뿐이다', () => {
  let checked = 0;
  everyItem((item, at) => {
    const f = item.facts || {};
    if (!f.masks) return;
    checked += 1;
    const label = where(item, at);
    const [a, op, b] = f.pair;
    const rows = [String(a), String(b), String(calc(a, op, b))];
    let solutions = 0;
    const total = 10 ** f.masks.length;
    for (let code = 0; code < total; code += 1) {
      const trial = rows.map((r) => r.split(''));
      f.masks.forEach((m, i) => { trial[m.row][trial[m.row].length - 1 - m.place] = String(Math.trunc(code / 10 ** i) % 10); });
      if (trial.some((r) => r[0] === '0')) continue;
      const [x, y, z] = trial.map((r) => Number(r.join('')));
      if (calc(x, op, y) === z) solutions += 1;
    }
    assert.equal(solutions, 1, label);
    const hidden = f.masks.map((m) => Number(rows[m.row][rows[m.row].length - 1 - m.place]));
    if (f.maskAsk === 'sum') assert.equal(answerAt(item, 0), hidden.reduce((s, v) => s + v, 0), label);
    else if (f.maskAsk === 'numbers') assert.equal(answerAt(item, 0), a + b, label);
    else hidden.forEach((v, i) => assert.equal(answerAt(item, i), v, label));
    // 글에 적힌 차례(윗줄부터, 왼쪽부터)대로 ㉠㉡㉢이 붙는다.
    const order = f.masks.map((m) => m.row * 10 - m.place);
    assert.deepEqual(order, order.slice().sort((x, y) => x - y), '가린 자리의 차례: ' + label);
  });
  assert.ok(checked > 100);
});

test('고르기·범위·수 카드·어림: 모든 경우를 따져 답이 하나이고 표시된 답과 같다', () => {
  const counts = {};
  everyItem((item, at) => {
    const f = item.facts || {};
    const label = where(item, at);
    const tally = (name) => { counts[name] = (counts[name] || 0) + 1; };
    if (f.choose) {
      const values = f.choose.exprs.map(evaluate), rule = f.choose.rule;
      assert.ok(values.every((v) => v > 0), label);
      if (rule === 'compare') assert.equal(item.choice.answer, values[0] > values[1] ? 0 : values[0] === values[1] ? 1 : 2, label);
      else if (rule === 'max' || rule === 'min') {
        const best = rule === 'max' ? Math.max(...values) : Math.min(...values);
        assert.equal(values.filter((v) => v === best).length, 1, label);
        assert.equal(item.choice.answer, values.indexOf(best), label);
      } else if (rule === 'equals') {
        assert.equal(values.filter((v) => v === f.choose.target).length, 1, label);
        assert.equal(item.choice.answer, values.indexOf(f.choose.target), label);
      } else if (rule === 'nearest') {
        const gaps = values.map((v) => Math.abs(v - f.choose.target));
        assert.equal(gaps.filter((g) => g === Math.min(...gaps)).length, 1, label);
        assert.equal(item.choice.answer, gaps.indexOf(Math.min(...gaps)), label);
      } else if (rule === 'ascending' || rule === 'descending') {
        assert.equal(new Set(values).size, values.length, label);
        const right = values.map((_, i) => i).sort((x, y) => (rule === 'ascending' ? values[x] - values[y] : values[y] - values[x]));
        const hits = f.choose.orders.filter((o) => o.join() === right.join());
        assert.equal(hits.length, 1, label);
        assert.equal(f.choose.orders[item.choice.answer].join(), right.join(), label);
      } else if (rule === 'countAbove' || rule === 'countBelow') {
        assert.ok(values.every((v) => v !== f.choose.target), label);
        const hit = values.filter((v) => (rule === 'countAbove' ? v > f.choose.target : v < f.choose.target)).length;
        assert.equal(answerAt(item, 0), hit, label);
        assert.ok(hit >= 1 && hit < values.length, label);
      } else if (rule === 'same') {
        // 계산 결과가 같은 두 식 찾기: 같은 값은 꼭 한 쌍
        const same = pairsOf(values.map((v, i) => [v, i])).filter(([x, y]) => x[0] === y[0]);
        assert.equal(same.length, 1, label);
        assert.deepEqual(f.choose.pairsShown[item.choice.answer].slice().sort(), [same[0][0][1], same[0][1][1]].sort(), label);
        assert.equal(f.choose.pairsShown.filter((p) => values[p[0]] === values[p[1]]).length, 1, label);
      } else assert.fail('모르는 고르기 규칙 ' + rule + ': ' + label);
      tally('choose:' + rule);
    }
    if (f.range) {
      const holds = (x) => { const m = f.range.ineq.replace(/x/g, String(x)).match(/^(.+)([<>])(.+)$/); return m[2] === '<' ? evaluate(m[1]) < evaluate(m[3]) : evaluate(m[1]) > evaluate(m[3]); };
      const ok = []; for (let x = f.range.lo; x <= f.range.hi; x += 1) if (holds(x)) ok.push(x);
      assert.ok(ok.length >= 1, label);
      assert.equal(ok[ok.length - 1] - ok[0] + 1, ok.length, '끊긴 범위: ' + label);
      assert.equal(answerAt(item, 0), f.range.want === 'min' ? ok[0] : ok[ok.length - 1], label);
      // 구하는 쪽 끝이 탐색 범위의 끝과 같으면 조건이 답을 정한 것이 아니다.
      assert.notEqual(answerAt(item, 0), f.range.want === 'min' ? f.range.lo : f.range.hi, '범위 끝에 걸린 답: ' + label);
      tally('range');
    }
    if (f.digit) {
      const holds = (x) => { const parts = f.digit.template.replace(/□/g, String(x)).split(/([<>])/); for (let i = 1; i < parts.length; i += 2) { const l = evaluate(parts[i - 1]), r = evaluate(parts[i + 1]); if (!(parts[i] === '<' ? l < r : l > r)) return false; } return true; };
      const ok = []; for (let x = f.digit.lo; x <= f.digit.hi; x += 1) if (holds(x)) ok.push(x);
      assert.ok(ok.length >= 1 && ok.length <= f.digit.hi - f.digit.lo, label);
      if (f.digit.ask === 'count') assert.equal(answerAt(item, 0), ok.length, label);
      else if (f.digit.ask === 'max') assert.equal(answerAt(item, 0), ok[ok.length - 1], label);
      else if (f.digit.ask === 'min') assert.equal(answerAt(item, 0), ok[0], label);
      else assert.fail('digit.ask 가 없다: ' + label);
      tally('digit');
    }
    if (f.cardSpec) {
      const all = threeDigit(f.cardSpec.digits), big = all[all.length - 1], small = all[0];
      assert.equal(new Set(f.cardSpec.digits).size, f.cardSpec.digits.length, label);
      const want = { 'max+min': [big + small], 'max-min': [big - small], 'max+second': [big + all[all.length - 2]], 'max-second': [big - all[all.length - 2]], both: [big + small, big - small] }[f.cardSpec.which];
      want.forEach((v, i) => assert.equal(answerAt(item, i), v, label));
      tally('cards');
    }
    if (f.cardCond) {
      const all = threeDigit(f.cardCond.digits);
      const low = all.filter((v) => v % 10 === f.cardCond.onesIs)[0], high = all.filter((v) => Math.trunc(v / 10) % 10 === f.cardCond.tensIs).pop();
      assert.equal(answerAt(item, 0), Math.abs(high - low), label); assert.ok(high !== low, label); tally('cardCond');
    }
    if (f.zeroTens) {
      const all = threeDigit(f.zeroTens).filter((v) => Math.trunc(v / 10) % 10 === 0);
      assert.ok(all.length >= 3, label);
      assert.equal(answerAt(item, 0), all[all.length - 1] - all[1], label); tally('zeroTens');
    }
    if (f.placeDigits) {
      const all = Array.from({ length: 900 }, (_, i) => i + 100);
      const big = all.filter((v) => Math.trunc(v / 100) === f.placeDigits[0]).pop(), small = all.filter((v) => Math.trunc(v / 10) % 10 === f.placeDigits[1])[0];
      assert.equal(answerAt(item, 0), big - small, label); assert.ok(big > small, label); tally('place');
    }
    if (f.compose) {
      const [x, y] = f.compose.map(([h, t, o]) => h * 100 + t * 10 + o);
      assert.equal(answerAt(item, 0), calc(x, f.composeOp, y), label); assert.ok(calc(x, f.composeOp, y) > 0, label);
      assert.ok(f.compose.every(([, t, o]) => t >= 10 || o >= 10), '그냥 자릿값 읽기다: ' + label); tally('compose');
    }
    if (f.tableRank) {
      const sorted = f.tableRank.values.slice().sort((x, y) => y - x);
      assert.equal(new Set(sorted).size, sorted.length, label);
      assert.equal(answerAt(item, 0), sorted[f.tableRank.a] - sorted[f.tableRank.b], label); tally('tableRank');
    }
    if (f.sums) {
      const [p, q] = f.sums.map((row) => row.reduce((s, v) => s + v, 0));
      assert.notEqual(p, q, label);
      assert.equal(answerAt(item, item.inputs.length - 1), Math.abs(p - q), label); tally('sums');
    }
    if (f.pairs) {
      const all = pairsOf(f.pairs.numbers), want = f.pairs.want;
      assert.equal(new Set(f.pairs.numbers).size, f.pairs.numbers.length, label);
      if (want === 'diff') {
        const hits = all.filter(([x, y]) => Math.abs(x - y) === f.pairs.target);
        assert.equal(hits.length, 1, label);
        assert.deepEqual([answerAt(item, 0), answerAt(item, 1)], [Math.max(...hits[0]), Math.min(...hits[0])], label);
      } else if (want === 'sum') {
        const hits = all.filter(([x, y]) => x + y === f.pairs.target);
        assert.equal(hits.length, 1, label);
        assert.deepEqual([answerAt(item, 0), answerAt(item, 1)].sort(), hits[0].slice().sort(), label);
        assert.equal(item.unordered, true, label);
        // 일의 자리만 보고는 못 고르게, 일의 자리 합이 같은 짝이 하나 더 있다.
        assert.ok(all.filter(([x, y]) => (x + y) % 10 === f.pairs.target % 10).length >= 2, '일의 자리만 보면 풀린다: ' + label);
      } else if (want === 'maxDiff') assert.equal(answerAt(item, 0), Math.max(...f.pairs.numbers) - Math.min(...f.pairs.numbers), label);
      else if (want === 'maxSum') { const s = f.pairs.numbers.slice().sort((x, y) => y - x); assert.equal(answerAt(item, 0), s[0] + s[1], label); }
      else if (want === 'near') {
        const gaps = all.map(([x, y]) => Math.abs(x + y - f.pairs.target)).sort((x, y) => x - y);
        assert.ok(gaps[1] > gaps[0], label);
        assert.equal(Math.abs(answerAt(item, 0) - f.pairs.target), gaps[0], label);
        assert.ok(all.some(([x, y]) => x + y === answerAt(item, 0)), label);
      } else assert.fail('모르는 두 수 고르기 ' + want);
      tally('pairs:' + want);
    }
    if (f.ends3) { const s = f.ends3.slice().sort((x, y) => x - y); assert.equal(answerAt(item, 0), s[2] + s[0] - s[1], label); tally('ends3'); }
    if (f.ends) { assert.equal(new Set(f.ends).size, f.ends.length, label); tally('ends'); }
    if (f.sumDiff) { const [sum, known] = f.sumDiff, other = sum - known; assert.ok(other >= 100 && other <= 999 && other !== known, label); assert.equal(answerAt(item, 0), Math.abs(known - other), label); tally('sumDiff'); }
    if (f.torn) {
      const cands = [f.torn.known + f.torn.diff, f.torn.known - f.torn.diff].filter((v) => v >= 100 && v <= 999 && Math.trunc(v / 100) === f.torn.hundreds);
      assert.equal(cands.length, 1, label);
      assert.equal(answerAt(item, 0), f.torn.known + cands[0], label); tally('torn');
    }
    if (f.estimate) {
      const [a, op, b] = f.estimate;
      for (const n of [a, b]) assert.ok(n >= 100 && Math.abs(n - hundred(n)) >= 1 && Math.abs(n - hundred(n)) <= 20, '몇백에 가깝지 않다: ' + label);
      const right = calc(hundred(a), op, hundred(b));
      assert.ok(right > 0, label);
      if (f.options) { assert.equal(f.options.filter((v) => v === right).length, 1, label); assert.equal(f.options[item.choice.answer], right, label); assert.ok(f.options.every((v) => v > 0), label); }
      else if (item.inputs.length === 3) assert.deepEqual(item.inputs.map((i) => i.answer), [hundred(a), hundred(b), right], label);
      else assert.equal(answerAt(item, 0), right, label);
      tally('estimate');
    }
    if (f.estimateExpr) {
      const [a, , b] = f.estimateExpr;
      const hits = f.options.filter(([x, y]) => x === hundred(a) && y === hundred(b));
      assert.equal(hits.length, 1, label);
      assert.deepEqual(f.options[item.choice.answer], [hundred(a), hundred(b)], label); tally('estimateExpr');
    }
    if (f.judge) {
      // 넉넉한가를 묻는 문항: need ≤ have 인지를 실제 값으로 따진다. 맞는 보기는 하나다.
      const need = evaluate(f.judge.need), have = evaluate(f.judge.have), can = need <= have;
      const right = f.judge.options.filter((o) => o[0] === f.judge.shown && o[1] === can);
      assert.equal(right.length, 1, label);
      assert.deepEqual(Array.from(f.judge.options[item.choice.answer]), Array.from(right[0]), label);
      assert.ok(Math.abs(need - have) >= 5, '아슬아슬한 판단: ' + label); tally('judge');
    }
    if (f.budget) {
      const affordable = pairsOf(f.prices).filter(([x, y]) => x + y <= f.budget);
      assert.equal(affordable.length, 1, label);
      assert.ok(pairsOf(f.prices).every(([x, y]) => Math.abs(x + y - f.budget) >= 20), '1000원에 너무 가까운 짝: ' + label);
      const chosen = f.pairs2[item.choice.answer];
      assert.equal(chosen[0] + chosen[1] <= f.budget, true, label);
      assert.equal(f.pairs2.filter(([x, y]) => x + y <= f.budget).length, 1, label); tally('budget');
    }
    if (f.inverse) {
      const [form, a, b, c] = f.inverse, x = answerAt(item, 0);
      assert.equal({ 'x+b=a': x + b === a, 'b+x=a': b + x === a, 'a-x=c': a - x === c, 'x-b=c': x - b === c }[form], true, label); tally('inverse');
    }
    if (f.match) {
      // 식과 결과 짝 짓기: 차례대로 맞는 보기는 하나다.
      const values = f.match.exprs.map(evaluate);
      const hits = f.match.options.filter((o) => Array.from(o).join() === values.join());
      assert.equal(hits.length, 1, label);
      assert.equal(Array.from(f.match.options[item.choice.answer]).join(), values.join(), label);
      assert.equal(new Set(values).size, values.length, label); tally('match');
    }
    if (f.inside) {
      const picked = f.inside.list.filter(([kind]) => kind === f.inside.kind).map(([, value]) => value);
      assert.equal(picked.length, 2, label);
      assert.equal(answerAt(item, 0), picked[0] + picked[1], label); tally('inside');
    }
    if (f.marks) {
      // 받아내림 표시: 일의 자리에서만 받아내림 → 십의 자리 위에는 하나 줄어든 수, 일의 자리 위에는 10
      const [a, b] = f.marks;
      assert.ok(a % 10 < b % 10 && Math.trunc(a / 10) % 10 - 1 >= Math.trunc(b / 10) % 10, label);
      assert.deepEqual(item.inputs.map((i) => i.answer), [Math.trunc(a / 10) % 10 - 1, 10, a - b], label); tally('marks');
    }
    if (f.places) {
      const [[h, t, o], op, b] = f.places;
      assert.ok([h, t, o].every((v) => v >= 1 && v <= 9), label);
      assert.equal(answerAt(item, 0), calc(h * 100 + t * 10 + o, op, b), label); tally('places');
    }
    if (f.who) {
      const [x, y] = f.who.values, winner = x > y ? 0 : 1, gap = Math.abs(x - y);
      assert.notEqual(x, y, label);
      const hits = f.who.options.filter(([who, n]) => who === winner && n === gap);
      assert.equal(hits.length, 1, label);
      assert.deepEqual(Array.from(f.who.options[item.choice.answer]), [winner, gap], label);
      assert.ok(f.who.options.every(([, n]) => n > 0), label); tally('who');
    }
    if (f.aboveValue) {
      // 받아내림이 두 번: 십의 자리 위에 고쳐 적은 수는 (십의 자리 수 - 1 + 10)이고 그 값은 10배
      const [a, b] = f.aboveValue, t = Math.trunc(a / 10) % 10;
      assert.equal(borrows(a, b), 2, label); assert.ok(t >= 1, label);
      assert.equal(answerAt(item, 0), (t - 1 + 10) * 10, label); tally('above');
    }
    if (f.estimateTens) {
      const [a, op, b] = f.estimateTens, ten = (n) => Math.round(n / 10) * 10;
      for (const n of [a, b]) assert.ok(n % 10 !== 5 && n % 10 !== 0, label);
      assert.equal(answerAt(item, 0), calc(ten(a), op, ten(b)), label); assert.ok(calc(ten(a), op, ten(b)) > 0, label); tally('estimateTens');
    }
    if (f.estimateChoose) {
      const values = f.estimateChoose.rows.map(([a, op, b]) => calc(hundred(a), op, hundred(b)));
      for (const [a, , b] of f.estimateChoose.rows) for (const n of [a, b]) assert.ok(n >= 100 && Math.abs(n - hundred(n)) <= 45, '몇백으로 어림하기 애매한 수: ' + label);
      const hit = values.map((v) => (f.estimateChoose.want === 'below' ? v < f.estimateChoose.target : v > f.estimateChoose.target));
      assert.equal(hit.filter(Boolean).length, 1, label);
      assert.equal(item.choice.answer, hit.indexOf(true), label);
      assert.ok(values.every((v) => v > 0 && v !== f.estimateChoose.target), label); tally('estimateChoose');
    }
    if (f.closer) {
      const real = evaluate(f.closer.expr), gaps = f.closer.estimates.map((v) => Math.abs(v - real));
      assert.equal(gaps.filter((g) => g === Math.min(...gaps)).length, 1, label);
      assert.equal(item.choice.answer, gaps.indexOf(Math.min(...gaps)), label); tally('closer');
    }
    if (f.claimed) {
      const good = f.claimed.map(([text, said]) => evaluate(text) === said);
      assert.equal(good.filter((g) => g === f.claimedWant).length, 1, label);
      assert.equal(item.choice.answer, good.indexOf(f.claimedWant), label); tally('claimed');
    }
  });
  for (const name of Object.keys(counts)) assert.ok(counts[name] >= 30, name + ' 문항이 거의 검사되지 않았다');
  assert.ok(Object.keys(counts).length >= 25, '검사한 갈래: ' + Object.keys(counts).join(', '));
});

test('토씨 붙이기', () => {
  const { josa, name } = B.kit;
  assert.deepEqual([josa(352, '을/를'), josa(350, '을/를'), josa(201, '을/를'), josa(476, '이/가'), josa(209, '은/는'), josa(390, '은/는')], ['352를', '350을', '201을', '476이', '209는', '390은']);
  assert.deepEqual([josa(300, '으로/로'), josa(201, '으로/로'), josa(203, '으로/로'), josa('물감', '과/와'), josa('가위', '과/와')], ['300으로', '201로', '203으로', '물감과', '가위와']);
  assert.deepEqual([name('서연', '은/는'), name('지우', '은/는'), name('서연', '이/가'), name('지우', '이/가'), name('서연', '과/와'), name('지우', '과/와')], ['서연이는', '지우는', '서연이가', '지우가', '서연이와', '지우와']);
});
