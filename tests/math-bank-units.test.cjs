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
for (const file of [...['engine.js', 'geometry.js', 'middle.js'].filter((f) => fs.existsSync(path.join(APP, f))), ...fs.readdirSync(path.join(APP, 'units')).filter((f) => f.endsWith('.js')).sort().map((f) => 'units/' + f)]) {
  vm.runInContext(fs.readFileSync(path.join(APP, file), 'utf8'), context, { filename: file });
}
const B = context.MathBank;
const EXTRA_SEEDS = Array.from({ length: 60 }, (_, i) => i * 7919 + 13);

// ── 엔진과 따로 쓴 셈 ──────────────────────────────────────────
function carries(a, b) { let n = 0, c = 0; const at = []; for (let i = 0; i < 3; i += 1) { c = (a % 10) + (b % 10) + c >= 10 ? 1 : 0; n += c; at.push(c); a = Math.trunc(a / 10); b = Math.trunc(b / 10); } return { n, at }; }
function borrows(a, b) { let n = 0, c = 0; for (let i = 0; i < 3; i += 1) { c = (a % 10) - (b % 10) - c < 0 ? 1 : 0; n += c; a = Math.trunc(a / 10); b = Math.trunc(b / 10); } return n; }
const calc = (a, op, b) => (op === '+' ? a + b : a - b);
// 식 글("345+278-(120-15)", "56/7", 나머지 "47%6")을 셈한다. 숫자와 + - * / % ( ) 만 받는다.
function evaluate(text) {
  assert.match(text, /^[\d+\-*\/%(). ]+$/, '식이 아니다: ' + text);
  return Function('"use strict"; return (' + text + ');')();
}
const strip = (html) => String(html || '').replace(/<svg[\s\S]*?<\/svg>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/\s+/g, ' ').trim();
const pairsOf = (list) => { const out = []; for (let i = 0; i < list.length; i += 1) for (let j = i + 1; j < list.length; j += 1) out.push([list[i], list[j]]); return out; };
const hundred = (n) => Math.round(n / 100) * 100;
// 나눗셈 세로셈의 과정에 적히는 수를 엔진과 따로 밟아 본다: 앞에서부터 한 자리씩 붙여 가다 나눌 수 있으면 빼는 수를 적고,
// 그 아래에는 남은 수 옆에 다음에 나눌 수 있을 때까지 아래 자리 숫자를 내려 쓴 수를 적는다.
function longRows(a, b) {
  const s = String(a), rows = []; let cur = 0;
  for (let i = 0; i < s.length; i += 1) {
    cur = cur * 10 + Number(s[i]);
    if (cur < b) continue;
    rows.push(cur - (cur % b)); cur %= b;
    let shown = String(cur), j = i;
    while (j < s.length - 1 && Number(shown) < b) { j += 1; shown += s[j]; }
    rows.push(Number(shown));
  }
  return rows;
}
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
// 답이 네 자리를 넘는 단원(4학년 1학기 큰 수). 9000조를 넘는 수는 자바스크립트가 정확히 못 담으니 쓰지 않는다.
const BIG_NUMBER_UNITS = new Set(['4-1-1', '4-1-3', '4-1-6', '5-1-1', '5-1-6', '5-2-1', '6-1-4', '6-1-5', '6-1-6', '6-2-4']);
// 소수 둘째·셋째 자리까지 답하는 단원
const FINE_DECIMAL_UNITS = new Set(['4-2-3', '5-2-1', '5-2-4', '6-1-3', '6-1-4', '6-1-6', '6-2-3', '6-2-5', '7-2-5']);
const answerAt = (item, i) => item.inputs[i].answer;

test('맨 위 드롭다운: 학기 목록(terms.js)이 실린 단원과 같고, 기출 화면도 그 파일을 읽는다', () => {
  // 단원을 짓는 사본(MATH_BANK_DIR)에는 아직 등록하지 않은 단원이 있으므로 보지 않는다.
  if (process.env.MATH_BANK_DIR) return;
  const own = {}; own.globalThis = own;
  vm.runInNewContext(fs.readFileSync(path.join(APP, 'terms.js'), 'utf8'), own, { filename: 'terms.js' });
  const T = own.MathBankTerms;
  const terms = [...new Set(B.units().map((u) => u.grade + '-' + u.semester))];
  assert.deepEqual(JSON.parse(JSON.stringify(T.TERMS)), terms, 'terms.js 의 TERMS 를 실린 단원에 맞춘다(add_part.py 가 고친다)');
  assert.equal(T.label('3-2'), '초 3학년 2학기');
  assert.equal(T.label('7-1'), '중 1학년 1학기');
  assert.equal(T.PAST.label, '평가원·수능 기출');
  if (!process.env.MATH_BANK_DIR) {
    const page = fs.readFileSync(path.join(ROOT, 'learning/literacy-numeracy/csat-math/index.html'), 'utf8');
    assert.match(page, /<select[^>]*data-math-terms="\.\.\/math-bank\/"/, '기출 화면에 같은 드롭다운이 있다');
    assert.match(page, /\.\.\/math-bank\/terms\.js\?v=[0-9-]+/, '기출 화면이 terms.js 를 읽는다');
  }
});

test('모든 문항이 온전한 모양이고 글이 멀쩡하다', () => {
  let made = 0;
  everyItem((item, at) => {
    made += 1;
    const label = where(item, at);
    assert.ok(typeof item.text === 'string' && strip(item.text).length >= 4, label);
    const whole = strip(item.text + ' ' + (item.figure || '') + ' ' + (item.explain || '') + ' ' + (item.choice ? item.choice.options.join(' ') : ''));
    for (const part of [item.text, item.figure, item.explain]) assert.doesNotMatch(String(part || ''), /undefined|NaN|null|\[object/, label);
    // 잘못 붙은 토씨: 받침 없는 수 뒤의 을·은·이·과, 받침 있는 수 뒤의 를·는·가·와 를 수 읽기로 따진다.
    for (const m of whole.matchAll(/(\d+)(을|를|은|는|이|가|과|와)(?=[\s,.])/g)) {
      // 몇 조로 끝나는 수(삼조)만 0으로 끝나도 받침이 없다.
      const batchim = !(Number(m[1]) >= 1e12 && Number(m[1]) % 1e12 === 0) && [true, true, false, true, false, false, true, true, true, false][Number(m[1]) % 10];
      assert.equal('을은이과'.includes(m[2]), batchim, `토씨 "${m[0]}" — ${label}`);
    }
    // 낱말 뒤 토씨가 겹쳐 붙은 것(사과을, 배추은 …)
    assert.doesNotMatch(whole, /[가-힣](을를|를을|은는|는은)(?=[\s,.])/, label);
    assert.ok(/^\d수\d\d-\d\d$/.test(item.standard), label);
    // 말투는 수능 문체: "~세요 / ~습니다 / ~인가요" 를 쓰지 않는다.
    assert.doesNotMatch(whole, /세요|습니다|입니다|인가요|나요\?|해요|예요|어요|까요/, '말투: ' + label);
    assert.ok(item.explain && strip(item.explain).length > 3, '풀이가 없다: ' + label);
    // 수와 단위 기호는 띄어 쓴다(1 km, 7 km 741 m). 빈칸과 단위 기호도 띄어 쓴다(□ mm). 그림 속 글과 그림 설명(aria-label)도 본다.
    const spaced = [item.text, item.figure, item.explain].concat(item.choice ? item.choice.options : []).map((part) => String(part || '').replace(/<span class="mb-box">[^<]*<\/span>/g, '□').replace(/aria-label="([^"]*)"/g, '> $1 <').replace(/<[^>]+>/g, ' ')).join(' | ');
    assert.doesNotMatch(spaced, /(?:\d|□)(?:mm|cm|km|kg|mL|m|g|L|t)(?![A-Za-z])/, '수(빈칸)와 단위를 붙여 썼다: ' + label);
    if (item.choice) {
      assert.ok(item.choice.options.length >= 2 && Number.isInteger(item.choice.answer) && item.choice.answer >= 0 && item.choice.answer < item.choice.options.length, label);
      assert.equal(new Set(item.choice.options.map(strip)).size, item.choice.options.length, '보기가 겹친다: ' + label);
      assert.equal(B.isCorrect(item, item.choice.answer), true, label);
      assert.equal(B.isCorrect(item, (item.choice.answer + 1) % item.choice.options.length), false, label);
    } else {
      assert.ok(Array.isArray(item.inputs) && item.inputs.length >= 1, label);
      // 소수 칸(decimal)은 소수 첫째 자리까지인 수이고 자연수가 아니다(소수 두·세 자리 수를 배우는 단원은 셋째 자리까지). 나머지 칸은 자연수.
      for (const input of item.inputs) {
        // 부등호 칸(rel)의 답은 네 기호 가운데 하나다.
        if (input.rel) { assert.ok(['<', '<=', '>', '>='].includes(input.answer), '부등호 칸의 답: ' + label); continue; }
        // 부호가 있는 칸(signed)만 음수를 받는다. 크기의 잣대는 같다.
        const size = Math.abs(input.answer);
        assert.ok(input.signed || input.answer >= 0, '부호 없는 칸의 답이 음수다: ' + label);
        if (input.decimal) { const fine = FINE_DECIMAL_UNITS.has(at.unit.id), scale = fine ? 1000 : 10; assert.ok(Math.abs(size * scale - Math.round(size * scale)) < 1e-6 && !Number.isInteger(size) && size > 0 && size < (fine ? 1000 : 100), label); }
        else assert.ok(Number.isInteger(size) && size <= (BIG_NUMBER_UNITS.has(at.unit.id) ? 9e15 : 9999), label);
      }
      // 분수 답: 분자·분모 두 칸(대분수는 자연수 칸까지 세 칸), 더 줄일 수 없는 분수(같은 크기의 다른 분수가 답이 되지 않게).
      // 진분수가 기본이고, improper 인 문항만 가분수(분자가 분모보다 크다)를 받는다. 대분수의 분수 부분은 진분수다.
      if (item.fraction) {
        const values = item.inputs.map((input) => input.answer), [top, bottom] = values.slice(-2), common = (x, y) => (y ? common(y, x % y) : x);
        assert.ok(item.inputs.length === (item.mixed ? 3 : 2) && top >= 1 && bottom >= 2 && (item.improper && !item.mixed ? top > bottom : top < bottom) && common(top, bottom) === 1 && (!item.mixed || values[0] >= 1), '분수 답: ' + label);
      }
      const answers = item.inputs.map((input) => String(input.answer));
      if (item.fraction) assert.ok(!item.negative || item.signed, '음의 분수인데 부호 칸이 없다: ' + label);
      if (item.negative) answers[0] = '-' + answers[0];
      assert.equal(B.isCorrect(item, answers), true, label);
      // 부호가 있는 답: 부호를 뒤집으면 틀리다(0은 부호가 없다).
      const flipped = answers.map((v, i) => ((item.inputs[i].signed && Number(v) !== 0) || (item.fraction && item.signed && i === 0) ? (v.startsWith('-') ? v.slice(1) : '-' + v) : v));
      if (flipped.some((v, i) => v !== answers[i])) assert.equal(B.isCorrect(item, flipped), false, '부호를 뒤집은 답: ' + label);
      assert.equal(B.isCorrect(item, answers.map((v, i) => (i === 0 ? String(Number(v) + 1) : v))), false, label);
      assert.equal(B.isCorrect(item, answers.map(() => '')), false, label);
      // 부등호 칸: 다른 기호를 고르면 틀리다.
      if (item.inputs.some((input) => input.rel)) assert.equal(B.isCorrect(item, answers.map((v, i) => (item.inputs[i].rel ? (v === '<' ? '>' : '<') : v))), false, '부등호를 바꾼 답: ' + label);
      // 식 속에 끼워 넣는 칸(template): 자리 표시가 칸마다 꼭 하나씩 있고, 틀렸을 때 보일 답 글(shown)이 있다.
      if (item.template) { item.inputs.forEach((input, i) => assert.equal(item.template.split('{' + i + '}').length, 2, 'template 의 {' + i + '} 자리: ' + label)); assert.ok(item.shown, 'shown 이 없다: ' + label); }
      if (item.unordered) assert.equal(B.isCorrect(item, answers.slice().reverse()), true, label);
      // 칸 묶음(blocks, 인수분해한 괄호 따위): 묶음의 크기가 같고, 첫 두 묶음을 통째로 바꾸어 적어도 맞다.
      if (item.blocks) {
        assert.ok(item.blocks.length >= 2 && item.blocks.every((block) => block.length === item.blocks[0].length), '칸 묶음의 크기가 같아야 한다: ' + label);
        const swapped = answers.slice();
        item.blocks[0].forEach((i, j) => { swapped[i] = answers[item.blocks[1][j]]; swapped[item.blocks[1][j]] = answers[i]; });
        assert.equal(B.isCorrect(item, swapped), true, '묶음째 바꾼 답: ' + label);
      }
      // 크기가 같은 다른 분수(분자·분모를 두 배 한 것)는 anyForm 인 문항만 받는다.
      if (item.fraction) assert.equal(B.isCorrect(item, answers.map((v, i) => (i >= answers.length - 2 ? String(Number(v) * 2) : v))), Boolean(item.anyForm), '같은 크기의 다른 분수: ' + label);
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
        // 수를 지우고 본 글이 같으면 수만 다른 같은 문제다. 계산 조건이 걸린 계산 문제(facts.rule)만 같은 꼴을 허락한다:
        // 조건의 이름이 서로 다르거나(내림이 있는가, 몫이 몇 자리인가 …), 이름 없이 묶음마다 조건이 다른 경우(rule: true)이다.
        const shape = strip(item.text + ' ' + (item.figure || '')).replace(/\d+/g, '#');
        const before = seen.get(shape), rule = item.facts && item.facts.rule, tag = rule === true ? 'group:' + group.id : rule ? 'rule:' + rule : null;
        if (before) assert.ok(tag && before.tags.every((t) => t && t !== tag), `같은 꼴이 두 번: ${item.key} 와 ${before.key} — ${shape}`);
        seen.set(shape, { key: item.key, tags: (before ? before.tags : []).concat([tag]) });
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
  const TABLE_DIVISION = new Set(['3-1-3']);
  // 3학년 1학기 곱셈은 (두 자리 수)×(한 자리 수)까지다. 묶음 이름대로 올림이 일어나는지도 본다.
  const SMALL_MUL = new Set(['3-1-4']);
  const DIV_UNITS = new Set(['3-2-2']);
  // 3학년 2학기 곱셈은 (세 자리 수)×(한 자리 수)와 (두 자리 수)×(두 자리 수)까지다.
  const GRADE3_MUL = new Set(['3-2-1']);
  const inGrade3 = (x, y) => x >= 0 && y >= 0 && ((Math.min(x, y) <= 9 && Math.max(x, y) <= 999) || (x <= 99 && y <= 99));
  const ups = (a, b) => { const ones = (a % 10) * b, tens = Math.trunc(a / 10) * b + Math.trunc(ones / 10); return [ones >= 10, tens >= 10]; };
  const MUL_RULE = {
    tens: (a) => a % 10 === 0,
    plain: (a, b) => a % 10 !== 0 && !ups(a, b)[0] && !ups(a, b)[1],
    upper: (a, b) => a % 10 !== 0 && !ups(a, b)[0] && ups(a, b)[1],
    ones: (a, b) => ups(a, b)[0] && !ups(a, b)[1],
    both: (a, b) => ups(a, b)[0] && ups(a, b)[1]
  };
  let muls = 0;
  // 앞의 두 단원은 수가 그림(세로셈 칸·수 모형·길 그림) 안에 들어 있어 글만 읽어서는 맞춰 볼 수 없다.
  const NUMBERS_IN_DRAWINGS = new Set(['3-1-1', '3-1-2']);
  let checked = 0, divisions = 0;
  everyItem((item, at) => {
    const f = item.facts || {}, label = where(item, at);
    for (const [text, i] of f.calc || []) {
      if (item.inputs[i].decimal) assert.equal(Math.round(answerAt(item, i) * 1000), Math.round(evaluate(text) * 1000), `${text} — ${label}`); else assert.equal(answerAt(item, i), evaluate(text), `${text} — ${label}`);
      assert.ok(evaluate(text) > 0 || item.inputs[i].signed, label); checked += 1;
    }
    // facts.value: 답 하나의 값을 식으로 다시 셈한다(정수와 유리수의 계산). 분수 답은 부호와 대분수까지 합친 값으로 견준다. 거듭제곱은 ** 로 적는다.
    if (f.value !== undefined) {
      const valueOf = () => { const v = item.inputs.map((input) => input.answer); if (!item.fraction) return v[0]; const size = (item.mixed ? v[0] : 0) + v[v.length - 2] / v[v.length - 1]; return item.negative ? -size : size; };
      assert.ok(item.fraction || item.inputs.length === 1, 'value 는 답이 하나인 문항에만 쓴다: ' + label);
      assert.ok(Math.abs(valueOf() - evaluate(f.value)) < 1e-9, `${f.value} = ${evaluate(f.value)} 인데 답은 ${valueOf()} — ${label}`); checked += 1;
    }
    // 답을 다시 셈하는 식의 수는 문제에 적힌 수여야 한다(글과 식이 따로 놀면 답을 맞춰 본 것이 아니다).
    // 글에 숫자로 적히지 않는 수(일주일의 7 따위)는 facts.unseen 에 밝혀 둔다.
    // 고르기·견주기 문항의 식(choose.exprs, who.exprs)도 같은 잣대로 본다.
    // 단위 바꾸기(unit)·시간(clock) 식도 본다. 시간 식의 3600·60 은 초로 바꾸는 수라 글에 없어도 된다.
    const timed = Boolean(f.clock || f.clockExprs);
    const recomputed = (f.calc || []).map(([text]) => text).concat(f.value !== undefined ? [f.value] : [], (f.who && f.who.exprs) || [], (f.choose && f.choose.exprs) || [], (f.unit || []).map((u) => u.expr), (f.clock || []).map((c) => c.expr), f.pick ? [f.pick.expr] : []);
    if (recomputed.length && !NUMBERS_IN_DRAWINGS.has(at.unit.id)) {
      // 그림은 그림 설명(aria-label)에 적힌 수로 읽는다. 세로셈은 숫자가 칸마다 떨어져 있으니 붙여 읽은 것도 함께 본다.
      // 나눗셈 세로셈(표)은 숫자가 칸마다 떨어져 있으니 표의 설명 글도 함께 읽는다.
      const seen = strip([item.text, item.figure || ''].concat(item.choice ? item.choice.options : []).join(' | ').replace(/<svg[^>]*aria-label="([^"]*)"[\s\S]*?<\/svg>/g, ' $1 ').replace(/<table[^>]*aria-label="([^"]*)"[^>]*>/g, ' $1 | '));
      const shown = new Set((seen.match(/\d+/g) || []).concat(seen.match(/\d+\.\d+/g) || [], seen.replace(/(\d) (?=\d)/g, '$1').match(/\d+/g) || []));
      // 읽은 말·끊어 쓴 말로 적힌 큰 수는 facts.big.shown 에 [적힌 글, 값]으로 밝힌다(「큰 수」 검사가 그 글을 다시 읽어 값과 맞춰 본다).
      const worded = new Set(((f.big && f.big.shown) || []).map(([, value]) => String(value)));
      for (const text of recomputed) for (const n of text.match(/\d+(?:\.\d+)?/g)) assert.ok(shown.has(n) || worded.has(n) || (f.unseen || []).includes(Number(n)) || (timed && (n === '3600' || n === '60')), `식의 수 ${n} 이 문제에 없다(${text}) — ${label}`);
    }
    if (f.pair) {
      const [a, op, b] = f.pair;
      assert.ok(a >= 100 && a <= 999 && b >= 100 && b <= 999, label);
      if (op === '-') assert.ok(a > b, label);
      if (f.rule && RULE[at.group.id]) assert.ok(RULE[at.group.id](a, b), '묶음 조건에 안 맞는 수: ' + label);
      if (f.wrong !== undefined) assert.notEqual(f.wrong, calc(a, op, b), '틀린 답이 정답과 같다: ' + label);
      if (f.carryValue) { const c = carries(a, b).at; assert.equal(answerAt(item, 0), f.carryValue, label); assert.equal(c[f.carryValue === 10 ? 0 : 1], 1, label); }
    }
    if (f.parts) f.parts.forEach(([text, i]) => assert.equal(answerAt(item, i), evaluate(text), label));
    if (f.mul) {
      const [a, b] = f.mul;
      assert.ok(a >= 10 && a <= 99 && b >= 2 && b <= 9, label);
      if (MUL_RULE[at.group.id]) assert.ok(MUL_RULE[at.group.id](a, b), '묶음 조건에 안 맞는 곱셈: ' + label);
      if (f.wrongValue !== undefined) { assert.notEqual(f.wrongValue, a * b, '틀린 답이 정답과 같다: ' + label); assert.ok(f.wrongValue > 0, label); }
    }
    if (f.divide) {
      // 나눗셈: 몫과 나머지를 다시 셈한다. 나누어떨어지면 몫 한 칸, 아니면 몫과 나머지 두 칸. 묶음 이름대로인지도 본다.
      const [a, b] = f.divide, q = Math.trunc(a / b), r = a % b;
      assert.ok(b >= 2 && b <= 9 && a >= b && a <= 999, label);
      if (!f.divideFree) assert.deepEqual(item.inputs.map((i) => i.answer), r === 0 && item.inputs.length === 1 ? [q] : [q, r], label);
      const tens = Math.trunc(a / 10), hundreds = Math.trunc(a / 100), noZero = !String(q).includes('0');
      const RULE = {
        tensPlain: () => a % 10 === 0 && a <= 90 && r === 0 && tens % b === 0,
        tensDown: () => a % 10 === 0 && a <= 90 && r === 0 && tens % b !== 0 && tens > b,
        plain: () => a <= 99 && a % 10 !== 0 && r === 0 && tens % b === 0,
        down: () => a <= 99 && r === 0 && tens % b !== 0 && tens > b,
        rest1: () => a <= 99 && r !== 0 && q >= 2 && q <= 9,
        restPlain: () => a <= 99 && r !== 0 && tens % b === 0 && (a % 10) > b,
        restDown: () => a <= 99 && r !== 0 && tens % b !== 0 && tens > b,
        hundreds: () => a % 100 === 0 && r === 0 && hundreds % b === 0,
        full: () => a >= 100 && r === 0 && hundreds >= b && noZero,
        short: () => a >= 100 && r === 0 && hundreds < b,
        zero: () => a >= 100 && r === 0 && hundreds >= b && !noZero,
        restFull: () => a >= 100 && r !== 0 && hundreds >= b && noZero,
        restShort: () => a >= 100 && r !== 0 && hundreds < b
      }[f.rule];
      if (f.rule) assert.ok(RULE, '모르는 나눗셈 조건 ' + f.rule + ': ' + label);
      if (f.rule) assert.ok(RULE(), '묶음 조건(' + f.rule + ')에 안 맞는 나눗셈: ' + label);
    }
    if (DIV_UNITS.has(at.unit.id)) {
      // 3학년 2학기 나눗셈은 한 자리 수로 나눈다. 글·그림·풀이의 모든 나눗셈을 본다.
      const whole = strip([item.text, item.figure, item.explain].concat(item.choice ? item.choice.options : []).join(' | ').replace(/<span class="mb-box">[^<]*<\/span>/g, '□'));
      for (const m of whole.matchAll(/(\d+) ÷ (\d+)/g)) { assert.ok(Number(m[2]) >= 2 && Number(m[2]) <= 9 && Number(m[1]) <= 999, `한 자리 수로 나누는 범위를 넘는 나눗셈 ${m[0]} — ${label}`); divisions += 1; }
    }
    if (f.mulAny) {
      const [a, b] = f.mulAny;
      assert.ok(inGrade3(a, b), '3학년 범위를 넘는 곱셈: ' + label);
      if (f.wrongProduct !== undefined) { assert.notEqual(f.wrongProduct, a * b, '틀린 답이 정답과 같다: ' + label); assert.ok(f.wrongProduct > 0, label); }
      if (f.carry3) assert.ok((a % 10) * b >= 10, '일의 자리에서 올림이 없다: ' + label);
    }
    if (f.rule === 'fewCarries' || f.rule === 'manyCarries') {
      // (두 자리 수)×(두 자리 수): 일의 자리 숫자를 곱할 때 올림이 일어나는 횟수(곱하는 수의 일의 자리, 십의 자리)
      const [a, b] = f.mulAny, n = ((a % 10) * (b % 10) >= 10 ? 1 : 0) + ((a % 10) * Math.trunc(b / 10) >= 10 ? 1 : 0);
      assert.ok(a >= 11 && a <= 99 && b >= 11 && b <= 99 && (f.rule === 'manyCarries' ? n === 2 : n <= 1), '올림 횟수가 이름과 다르다: ' + label);
    }
    if (GRADE3_MUL.has(at.unit.id)) {
      const whole = strip([item.text, item.figure, item.explain].concat(item.choice ? item.choice.options : []).join(' | ').replace(/<span class="mb-box">[^<]*<\/span>/g, '□'));
      for (const m of whole.matchAll(/(\d+) × (\d+)/g)) { assert.ok(inGrade3(Number(m[1]), Number(m[2])), `3학년 범위를 넘는 곱셈 ${m[0]} — ${label}`); muls += 1; }
    }
    if (SMALL_MUL.has(at.unit.id)) {
      const whole = strip([item.text, item.figure, item.explain].concat(item.choice ? item.choice.options : []).join(' | ').replace(/<span class="mb-box">[^<]*<\/span>/g, '□'));
      for (const m of whole.matchAll(/(\d+) × (\d+)/g)) {
        const x = Number(m[1]), y = Number(m[2]);
        assert.ok(Math.min(x, y) <= 9 && Math.max(x, y) <= 99 && x >= 1 && y >= 1, `(두 자리 수)×(한 자리 수)를 넘는 곱셈 ${m[0]} — ${label}`); muls += 1;
      }
    }
    // 3학년 1학기 나눗셈은 곱셈구구 범위뿐이다: 글·그림·풀이에 적힌 나눗셈은 모두 나머지가 없고 나누는 수와 몫이 2~9.
    if (TABLE_DIVISION.has(at.unit.id)) {
      // 빈칸은 □ 로 남겨 두어야 빈칸 뒤의 수가 앞 식에 붙어 읽히지 않는다.
      const whole = strip([item.text, item.figure, item.explain].concat(item.choice ? item.choice.options : []).join(' | ').replace(/<span class="mb-box">[^<]*<\/span>/g, '□'));
      for (const m of whole.matchAll(/(\d+) ÷ (\d+)/g)) {
        const a = Number(m[1]), b = Number(m[2]);
        assert.ok(b >= 2 && b <= 9 && a % b === 0 && a / b >= 2 && a / b <= 9, `곱셈구구 밖의 나눗셈 ${m[0]} — ${label}`); divisions += 1;
      }
    }
  });
  assert.ok(checked > 1000);
  assert.ok(divisions > 1000, '나눗셈 검사 수: ' + divisions);
  assert.ok(muls > 1500, '곱셈 검사 수: ' + muls);
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
      } else if (rule === 'onlyAbove' || rule === 'onlyBelow') {
        // 기준 수보다 큰(작은) 것은 하나뿐이고, 기준 수와 같은 값은 없다.
        const hit = values.map((v) => (rule === 'onlyAbove' ? v > f.choose.target : v < f.choose.target));
        assert.ok(values.every((v) => v !== f.choose.target), label);
        assert.equal(hit.filter(Boolean).length, 1, label);
        assert.equal(item.choice.answer, hit.indexOf(true), label);
      } else if (rule === 'odd') {
        // 값이 나머지와 다른 하나 찾기: 하나만 다르고 나머지는 모두 같다.
        const even = values.map((v) => Math.round(v * 1e6) / 1e6), lone = even.filter((v) => even.filter((w) => w === v).length === 1);
        assert.equal(lone.length, 1, label); assert.equal(new Set(even).size, 2, label);
        assert.equal(item.choice.answer, even.indexOf(lone[0]), label);
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
      if (f.who.exprs) assert.deepEqual(f.who.values, f.who.exprs.map(evaluate), label);
      // smaller: 값이 작은 쪽이 이기는 물음(더 빨리 들어온 사람)
      const [x, y] = f.who.values, winner = (f.who.smaller ? x < y : x > y) ? 0 : 1, gap = Math.abs(x - y);
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
    if (f.remainders) {
      // 나눗셈 여러 개: 나누어떨어지는 것은 하나뿐인가(zero), 몫과 나머지를 바르게 적은 것은 하나뿐인가(right).
      const rows = f.remainders;
      const good = f.want === 'zero' ? rows.map(([a, b]) => a % b === 0) : rows.map(([a, b], i) => f.said[i][0] * b + f.said[i][1] === a && f.said[i][1] >= 0 && f.said[i][1] < b);
      assert.ok(f.want === 'zero' || f.want === 'right', label);
      assert.equal(good.filter(Boolean).length, 1, label); assert.equal(item.choice.answer, good.indexOf(true), label); tally('remainders');
    }
    if (f.only) {
      // 보기 가운데 기준 이상(이하)인 수는 하나뿐이고 그것이 답이다.
      const hit = f.only.values.map((v) => (f.only.test === 'atLeast' ? v >= f.only.target : v <= f.only.target));
      assert.ok(f.only.test === 'atLeast' || f.only.test === 'atMost', label);
      assert.equal(hit.filter(Boolean).length, 1, label); assert.equal(item.choice.answer, hit.indexOf(true), label); tally('only');
    }
    if (f.pick) {
      // 수 보기 가운데 식의 값과 같은 것은 하나뿐이다.
      assert.equal(new Set(f.pick.options).size, f.pick.options.length, label);
      assert.equal(item.choice.answer, f.pick.options.indexOf(evaluate(f.pick.expr)), label); assert.ok(item.choice.answer >= 0, label); tally('pick');
    }
    if (f.longDiv) {
      // 세로셈 과정의 빈칸: 과정을 따로 밟아 그 줄의 수와 견준다. 'quot' 은 몫.
      const { a, b, asks } = f.longDiv, rows = longRows(a, b);
      assert.ok(b >= 2 && b <= 9 && a <= 999, label);
      asks.forEach((ask, i) => assert.equal(answerAt(item, i), ask === 'quot' ? Math.trunc(a / b) : rows[ask], `세로셈 ${a}÷${b} ${ask} — ${label}`));
      assert.equal(asks.length, item.inputs.length, label); tally('longDiv');
    }
    if (f.divCards) {
      // 수 카드 세 장: 가장 큰 두 자리 수를 만들어 남은 수로 나눈다(나누어떨어지게 낸다).
      const [x, y, z] = f.divCards.slice().sort((p, q) => q - p);
      assert.ok(new Set(f.divCards).size === 3 && z >= 2 && (x * 10 + y) % z === 0, label);
      assert.equal(answerAt(item, 0), (x * 10 + y) / z, label); tally('divCards');
    }
    if (f.nearHundred) { const [a, h] = f.nearHundred; assert.ok(hundred(a) === h && a !== h && Math.abs(a - h) <= 15, label); tally('nearHundred'); }
    if (f.wrongDivide) {
      // 잘못 나눈 수 바로잡기: 어떤 수를 되찾아 바른 수로 나눈다.
      const { right, wrong, q, r } = f.wrongDivide, x = wrong * q + r;
      assert.ok(r >= 1 && r < wrong && right !== wrong && right >= 2 && right <= 9 && wrong <= 9 && x <= 999, label);
      assert.deepEqual(local(item.inputs.map((i) => i.answer)), [Math.trunc(x / right), x % right], label); tally('wrongDivide');
    }
    if (f.enough) { const { a, b, n, fits } = f.enough; assert.ok(a !== n * b && (a <= n * b) === fits && Math.abs(a - n * b) <= 15 && (n * b) % 100 === 0, label); tally('enough'); }
    if (f.restTalk) { const { a, b, saidQ, saidR } = f.restTalk; assert.ok(saidQ * b + saidR === a && saidR >= b && saidQ >= 1, label); tally('restTalk'); }
    if (f.tensEstimate) {
      // 두 수를 각각 가장 가까운 몇십으로 어림해 곱한다(끝자리가 5인 수는 내지 않는다).
      const [a, b] = f.tensEstimate, ra = Math.round(a / 10) * 10, rb = Math.round(b / 10) * 10;
      assert.ok(a % 10 !== 5 && b % 10 !== 5 && a % 10 !== 0 && b % 10 !== 0, label);
      assert.deepEqual(item.inputs.map((i) => i.answer), [ra, rb, ra * rb], label); tally('tensEstimate');
    }
    if (f.twoCards) {
      // 수 카드 넷으로 만드는 두 자리 수를 모두 만들어 가장 큰 수와 가장 작은 수를 찾는다.
      const all = []; f.twoCards.forEach((x, i) => f.twoCards.forEach((y, j) => { if (i !== j && x !== 0) all.push(x * 10 + y); }));
      assert.equal(new Set(f.twoCards).size, 4, label);
      assert.equal(answerAt(item, 0), Math.max(...all) * Math.min(...all), label); assert.ok(Math.max(...all) <= 99 && Math.min(...all) >= 10, label); tally('twoCards');
    }
    if (f.bigCards) {
      const { digits, by } = f.bigCards, all = threeDigit(digits);
      assert.equal(new Set(digits).size, 3, label); assert.ok(by >= 2 && by <= 9, label);
      assert.equal(answerAt(item, 0), Math.max(...all) * by, label); tally('bigCards');
    }
    if (f.minusForms) {
      // 나눗셈식 a÷k=n 을 뺄셈식으로: k를 n번 빼어 0이 되는 식은 하나뿐이다.
      const { a, k, n, forms } = f.minusForms, good = forms.map(([sub, times]) => sub === k && times === n);
      assert.ok(a === k * n && k !== n, label); assert.equal(new Set(forms.map(String)).size, forms.length, label);
      assert.ok(forms.every(([sub, times]) => a - sub * times >= 0), label);
      assert.equal(good.filter(Boolean).length, 1, label); assert.equal(item.choice.answer, good.indexOf(true), label); tally('minusForms');
    }
    if (f.pickTriple) {
      // 다섯 수에서 두 수의 곱이 다른 한 수가 되는 세 수는 한 가지뿐이고, 그 곱이 답이다.
      const list = f.pickTriple, found = [];
      list.forEach((x, i) => list.forEach((y, j) => list.forEach((z, k) => { if (i < j && k !== i && k !== j && x * y === z) found.push(z); })));
      assert.equal(new Set(list).size, 5, label); assert.equal(found.length, 1, label); assert.equal(answerAt(item, 0), found[0], label); tally('pickTriple');
    }
    if (f.tablePick) {
      // b단 곱셈구구에 나누어지는 수가 들어 있는 나눗셈은 하나뿐이다.
      const hit = f.tablePick.rows.map(([x]) => x % f.tablePick.b === 0 && x / f.tablePick.b <= 9);
      assert.equal(hit.filter(Boolean).length, 1, label); assert.equal(item.choice.answer, hit.indexOf(true), label); tally('tablePick');
    }
    if (f.limit) {
      // 두 재료로 만들 수 있는 수는 두 몫 가운데 작은 쪽이다.
      const quotients = f.limit.pairs.map(([x, y]) => x / y), least = Math.min(...quotients);
      assert.ok(quotients.every(Number.isInteger) && quotients[0] !== quotients[1], label);
      assert.equal(new Set(f.limit.options).size, f.limit.options.length, label); assert.equal(item.choice.answer, f.limit.options.indexOf(least), label); tally('limit');
    }
    if (f.tileOdd) {
      // 그림 셋 가운데 둘은 (나눈 수, 색칠한 수)가 같고 하나만 다르다.
      const keys = f.tileOdd.map(String), lone = keys.filter((k) => keys.filter((other) => other === k).length === 1);
      assert.equal(lone.length, 1, label); assert.equal(new Set(keys).size, 2, label); assert.equal(item.choice.answer, keys.indexOf(lone[0]), label); tally('tileOdd');
    }
    if (f.circlePoints) {
      // 원 안의 점 가운데 원의 중심에 놓인 점은 하나뿐이다.
      const { center, points } = f.circlePoints, hit = points.map(({ p }) => Math.hypot(p[0] - center[0], p[1] - center[1]) < 1e-6);
      assert.equal(hit.filter(Boolean).length, 1, label); assert.equal(item.choice.answer, hit.indexOf(true), label); tally('circlePoints');
    }
    if (f.circleSegs || f.circleTalk) {
      // 원과 선분: 좌표로 반지름(중심과 원 위의 점), 지름(원 위의 두 점, 길이가 반지름의 2배)을 다시 가린다.
      const { center, r } = f.circleSegs || f.circleTalk, dist = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]), near = (x, y) => Math.abs(x - y) < 1e-6;
      const kind = (p, q) => { const dp = dist(p, center), dq = dist(q, center); if ((near(dp, 0) && near(dq, r)) || (near(dq, 0) && near(dp, r))) return 'radius'; if (near(dp, r) && near(dq, r)) return near(dist(p, q), 2 * r) ? 'diameter' : 'chord'; return 'other'; };
      if (f.circleSegs) {
        const { segs, want } = f.circleSegs, lens = segs.map((g) => dist(g.p, g.q));
        const hit = want === 'longest' ? lens.map((v) => near(v, Math.max(...lens))) : segs.map((g) => kind(g.p, g.q) === want);
        assert.ok(['radius', 'diameter', 'longest'].includes(want), label);
        assert.equal(hit.filter(Boolean).length, 1, label); assert.equal(item.choice.answer, hit.indexOf(true), label);
        if (want === 'longest') assert.equal(kind(segs[hit.indexOf(true)].p, segs[hit.indexOf(true)].q), 'diameter', label);
        tally('circleSegs');
      } else {
        const { points, claims } = f.circleTalk, seg = (name) => [points[name[0]], points[name[1]]];
        const truth = claims.map(([what, x, y]) => ({ radius: () => kind(...seg(x)) === 'radius', notDiameter: () => kind(...seg(x)) !== 'diameter', same: () => near(dist(...seg(x)), dist(...seg(y))) }[what]()));
        assert.deepEqual(truth, f.truth, label); tally('circleTalk');
      }
    }
    if (f.farthest) {
      // 누름 못에서 가장 먼 구멍은 하나뿐이다.
      const far = f.farthest.holes.map((x) => Math.abs(x - f.farthest.pin)), hit = far.map((v) => v === Math.max(...far));
      assert.equal(hit.filter(Boolean).length, 1, label); assert.equal(item.choice.answer, hit.indexOf(true), label); tally('farthest');
    }
    if (f.sequence) {
      // 차례 늘어놓기: 적힌 줄(ranks: 그 줄이 몇째 단계인가)을 단계 차례로 읽은 것이 답이다.
      const { ranks, options } = f.sequence, right = ranks.map((_, step) => ranks.indexOf(step)).join();
      assert.equal(options.filter((o) => o.join() === right).length, 1, label); assert.equal(options[item.choice.answer].join(), right, label); tally('sequence');
    }
    if (f.pins) {
      // 컴퍼스의 침을 꽂을 곳: 서로 다른 원의 중심의 수(원의 수보다 적어야 함정이 된다).
      const spots = new Set(f.pins.centers.map((c) => c.map((v) => v.toFixed(3)).join()));
      assert.ok(spots.size < f.pins.centers.length, label); assert.equal(answerAt(item, 0), spots.size, label); tally('pins');
    }
    if (f.designs) { assert.equal(new Set(f.designs.shown).size, 3, label); assert.equal(item.choice.answer, f.designs.shown.indexOf(f.designs.want), label); tally('designs'); }
    if (f.picto) {
      // 그림그래프: 그림 설명에 적힌 그림의 종류와 개수로 줄마다 수를 다시 읽는다(그림이 없는 줄은 null).
      const m = item.figure.match(/aria-label="그림그래프: ([^"]*)"/);
      assert.ok(m, '그림그래프가 없다: ' + label);
      const read = m[1].split(' / ').map((row) => (row.includes('그림 없음') ? null : [...row.matchAll(/(\d+)짜리 (\d+)개/g)].reduce((sum, x) => sum + Number(x[1]) * Number(x[2]), 0)));
      assert.deepEqual(read, f.picto.shown, label);
      // 작은 그림이 큰 그림 하나만큼 모여 있으면 안 된다(큰 그림으로 바꾸어 그려야 한다).
      for (const row of m[1].split(' / ')) { const parts = [...row.matchAll(/(\d+)짜리 (\d+)개/g)].map((x) => [Number(x[1]), Number(x[2])]); parts.forEach(([unit, n], i) => { if (i > 0) assert.ok(unit * n < parts[i - 1][0], '바꾸어 그려야 하는 그림: ' + label); }); }
      tally('picto');
    }
    if (f.rank) {
      // 여러 수 가운데 n번째로 큰 수의 자리(수는 모두 다르다)
      const { values, nth } = f.rank, sorted = values.slice().sort((x, y) => y - x);
      assert.equal(new Set(values).size, values.length, label); assert.equal(item.choice.answer, values.indexOf(sorted[nth - 1]), label); tally('rank');
    }
    if (f.tallyOf) {
      // 낱낱의 자료를 세어 표로: 목록에서 그 낱말의 수를 다시 센다.
      assert.equal(answerAt(item, 0), f.tallyOf.list.filter((word) => word === f.tallyOf.target).length, label); tally('tallyOf');
    }
    if (f.scale) {
      // 그림의 단위 고르기: 작은 단위는 모든 수를 나누어떨어지게 하는 가장 큰 10·100…이고, 큰 단위는 그 10배이다.
      const { values, options } = f.scale, small = [1000, 100, 10, 1].find((u) => values.every((v) => v % u === 0)), hit = options.map(([big, low]) => low === small && big === small * 10);
      assert.ok(Math.max(...values) >= small * 10, label); assert.equal(hit.filter(Boolean).length, 1, label); assert.equal(item.choice.answer, hit.indexOf(true), label); tally('scale');
    }
    if (f.mismatch) {
      // 표와 그림그래프가 다른 줄은 하나뿐이다.
      const hit = f.mismatch.table.map((v, i) => v !== f.mismatch.drawn[i]);
      assert.equal(hit.filter(Boolean).length, 1, label); assert.equal(item.choice.answer, hit.indexOf(true), label); tally('mismatch');
    }
    if (f.pictoTalk) {
      // 그림그래프를 두고 한 말: 수로 다시 따진다.
      const { values, claims } = f.pictoTalk, order = values.slice().sort((x, y) => y - x);
      const truth = claims.map(([what, i, x]) => ({ value: () => values[i] === x, more: () => values[i] > values[x], most: () => values[i] === order[0], least: () => values[i] === order[order.length - 1], total: () => values.reduce((s, v) => s + v, 0) === i }[what]()));
      assert.deepEqual(truth, f.truth, label); tally('pictoTalk');
    }
    if (f.symbolTrap) {
      // 그림의 수가 가장 많은 줄이 수가 가장 큰 줄은 아니다.
      const { values, symbols } = f.symbolTrap;
      assert.notEqual(values.indexOf(Math.max(...values)), symbols.indexOf(Math.max(...symbols)), label); tally('symbolTrap');
    }
    if (f.partOf) {
      // 부분은 전체의 얼마: 전체를 group 개씩 묶으면 total/group 묶음, 부분은 part/group 묶음이다.
      const { total, group, part } = f.partOf;
      assert.ok(total % group === 0 && part % group === 0 && part > 0 && part < total, label);
      assert.deepEqual(item.inputs.map((i) => i.answer), [part / group, total / group], label); tally('partOf');
    }
    if (f.fracKinds) {
      // 분수 여럿 가운데 진분수(분자 < 분모)·가분수(분자 >= 분모)의 수
      const { list, want } = f.fracKinds, hit = list.filter(([n, d]) => (want === 'proper' ? n < d : n >= d)).length;
      assert.ok(want === 'proper' || want === 'improper', label); assert.ok(hit >= 1 && hit < list.length, label); assert.equal(answerAt(item, 0), hit, label); tally('fracKinds');
    }
    if (f.between) {
      // 두 수 사이에 있는 수는 보기 가운데 하나뿐이다.
      const lo = evaluate(f.between.low), hi = evaluate(f.between.high), hit = f.between.exprs.map((x) => evaluate(x) > lo && evaluate(x) < hi);
      assert.ok(lo < hi, label); assert.equal(hit.filter(Boolean).length, 1, label); assert.equal(item.choice.answer, hit.indexOf(true), label); tally('between');
    }
    if (f.partTalk) { const { total, group, part } = f.partTalk; assert.ok(total % group === 0 && part % group === 0 && part < total, label); assert.equal(f.choose.target, (part / group) / (total / group), label); tally('partTalk'); }
    if (f.unitRule) {
      // 큰 단위와 작은 단위(1000배)로 적은 두 양의 셈: 이름대로 받아올림·받아내림이 일어나는가. 작은 단위의 수는 1~999.
      const { op, a, b, carry } = f.unitRule;
      for (const part of [a[1], b[1]]) assert.ok(part >= 1 && part <= 999, label);
      assert.equal(op === '+' ? a[1] + b[1] >= 1000 : a[1] < b[1], carry, '받아올림·받아내림이 이름과 다르다: ' + label);
      if (op === '-') assert.ok(a[0] * 1000 + a[1] > b[0] * 1000 + b[1], label);
      tally('unitRule');
    }
    if (f.levels) {
      // 같은 그릇에 옮겨 담은 물의 높이: 그림 설명의 칸 수로 가장 높은(낮은) 것을 다시 찾는다.
      const m = item.figure.match(/aria-label="같은 그릇에 옮겨 담은 물의 높이: ([^"]*)"/), heights = m[1].split(', ').map((part) => Number(part.match(/(\d+)칸/)[1]));
      const best = f.levels === 'most' ? Math.max(...heights) : Math.min(...heights);
      assert.equal(heights.filter((h) => h === best).length, 1, label); assert.equal(item.choice.answer, heights.indexOf(best), label); tally('levels');
    }
    if (f.claimed) {
      const good = f.claimed.map(([text, said]) => evaluate(text) === said);
      assert.equal(good.filter((g) => g === f.claimedWant).length, 1, label);
      assert.equal(item.choice.answer, good.indexOf(f.claimedWant), label); tally('claimed');
    }
    if (f.minus) {
      // 같은 수를 거듭 빼어 0 만들기: a 에서 k 를 빼어 가며 센 횟수가 n
      // 그림의 뺄셈식을 읽어 빼는 횟수가 n 인지도 본다. hidden 이면 빼는 수가 △ 로 가려져 있고 그 수를 묻는다.
      const { a, k, n, hidden } = f.minus; let left = a, times = 0;
      while (left > 0) { left -= k; times += 1; }
      assert.equal(left, 0, label); assert.equal(times, n, label); assert.ok(n >= 2, label);
      const terms = strip(item.figure).split('= 0')[0].split('−').map((s) => s.trim());
      assert.deepEqual(terms, [String(a)].concat(Array.from({ length: n }, () => (hidden ? '△' : String(k)))), label);
      assert.deepEqual(item.inputs.map((i) => i.answer), hidden ? [k] : [k, n], label); tally('minus');
    }
    if (f.triple) {
      // 수 카드 넷 가운데 셋으로 곱셈식 만들기: 곱셈식이 되는 세 수는 한 벌뿐이고, 남는 수가 답이다.
      assert.equal(new Set(f.triple).size, 4, label);
      const made = [];
      for (const z of f.triple) for (const [x, y] of pairsOf(f.triple.filter((v) => v !== z))) if (x * y === z) made.push([x, y, z]);
      assert.equal(made.length, 1, label);
      assert.equal(answerAt(item, 0), f.triple.find((v) => !made[0].includes(v)), label); tally('triple');
    }
    if (f.times) {
      // a ÷ b 의 몫을 구하는 곱셈식: 곱이 a 이고 b 가 들어 있는 보기는 하나뿐이다. 보기의 곱셈식은 모두 옳은 식이다.
      const { a, b, options } = f.times;
      const hits = options.filter(([x, y]) => x * y === a && (x === b || y === b));
      assert.equal(hits.length, 1, label);
      assert.deepEqual(Array.from(options[item.choice.answer]), Array.from(hits[0]), label);
      assert.ok(options.every(([x, y]) => x >= 2 && x <= 9 && y >= 2 && y <= 9), label); tally('times');
    }
    if (f.unit) {
      // 큰 단위와 작은 단위로 나누어 적기: 값을 base 로 나눈 몫과 나머지
      for (const { expr, base, at: [i, j] } of f.unit) {
        const value = evaluate(expr);
        assert.ok(value > base && value % base !== 0, label);
        assert.equal(answerAt(item, i), Math.trunc(value / base), label); assert.equal(answerAt(item, j), value % base, label);
      }
      tally('unit');
    }
    if (f.clock) {
      // 시간 계산: 식을 초로 셈한 뒤 시·분·초로 다시 나눈다.
      for (const { expr, parts, at: start } of f.clock) {
        const total = evaluate(expr);
        assert.ok(total > 0, label);
        const want = parts === 'hms' ? [Math.trunc(total / 3600), Math.trunc((total % 3600) / 60), total % 60] : [Math.trunc(total / 60), total % 60];
        if (parts === 'ms') assert.ok(total < 3600, label); else assert.ok(want[0] >= 1 && want[0] <= 23, label);
        assert.deepEqual(item.inputs.slice(start, start + want.length).map((i) => i.answer), want, label);
        if (f.wrongClock) assert.notDeepEqual(f.wrongClock, want, '틀린 값이 바른 값과 같다: ' + label);
      }
      tally('clock');
    }
    if (f.timeRule) {
      // 계산 문항은 초에서 받아올림(받아내림)이 꼭 일어난다. 분·초는 1~59.
      const { op, a, b } = f.timeRule;
      for (const part of [a[1], a[2], b[1], b[2]]) assert.ok(part >= 1 && part <= 59, label);
      assert.ok(op === '+' ? a[2] + b[2] >= 60 : a[2] < b[2], '받아올림·받아내림이 없다: ' + label); tally('timeRule');
    }
    if (f.timePlain) {
      // 받아올림·받아내림이 없는 시간 셈: 분끼리, 초끼리 셈해도 60을 넘거나 모자라지 않는다.
      const { op, a, b } = f.timePlain;
      assert.ok(op === '+' ? a[1] + b[1] < 60 && a[2] + b[2] < 60 : a[1] >= b[1] && a[2] >= b[2] && a[0] > b[0], '받아올림·받아내림이 있다: ' + label); tally('timePlain');
    }
    if (f.timeMasks) {
      // 빈칸이 있는 시간 셈: 빈칸(null)에 모든 수를 넣어 보아도 맞는 경우는 하나뿐이다. 답은 윗줄부터, 왼쪽부터.
      const { op, a, b, r } = f.timeMasks, sec = ([h, m, s]) => h * 3600 + m * 60 + s, holes = [];
      a.forEach((v, i) => { if (v === null) holes.push(['a', i]); }); b.forEach((v, i) => { if (v === null) holes.push(['b', i]); });
      const found = [], limit = (i) => (i === 0 ? 24 : 60), trial = { a: a.slice(), b: b.slice() };
      const walk = (k) => {
        if (k === holes.length) { if ((op === '+' ? sec(trial.a) + sec(trial.b) : sec(trial.a) - sec(trial.b)) === sec(r)) found.push(holes.map(([row, i]) => trial[row][i])); return; }
        const [row, i] = holes[k];
        for (let v = 0; v < limit(i); v += 1) { trial[row][i] = v; walk(k + 1); }
      };
      walk(0);
      assert.equal(found.length, 1, '빈칸에 맞는 경우가 하나가 아니다: ' + label);
      assert.deepEqual(item.inputs.map((i) => i.answer), found[0], label); tally('timeMasks');
    }
    if (f.ruler) {
      // 자 그림: 그림 설명에 적힌 두 끝의 자리로 길이를 다시 잰다.
      const ends = [...item.figure.matchAll(/눈금 (\d+)(?:에서 작은 눈금 (\d+)칸 더 간 곳)?/g)].map((m) => Number(m[1]) * 10 + Number(m[2] || 0));
      assert.equal(ends.length, 2, label);
      const length = ends[1] - ends[0];
      assert.ok(length > 10 && length % 10 !== 0, label);
      if (f.ruler === 'decimal') assert.equal(Math.round(answerAt(item, 0) * 10), length, label);
      else assert.deepEqual(item.inputs.map((i) => i.answer), [Math.trunc(length / 10), length % 10], label);
      tally('ruler');
    }
    if (f.kmLine) {
      const m = item.figure.match(/화살표는 (\d+) km에서 작은 눈금 (\d+)칸 더 간 곳/);
      assert.ok(m && Number(m[2]) >= 1 && Number(m[2]) <= 9, label);
      assert.deepEqual(item.inputs.map((i) => i.answer), [Number(m[1]), Number(m[2]) * 100], label); tally('kmLine');
    }
    if (f.clockFace) {
      // 초까지 읽는 시계: 그림 설명의 시각이 답이고, 바늘 셋이 서로 겹치거나 붙어 있지 않다.
      const m = item.figure.match(/aria-label="시계 (\d+)시 (\d+)분 (\d+)초"/);
      assert.ok(m, label);
      const [hour, minute, second] = m.slice(1).map(Number), apart = (p, q) => { const gap = Math.abs(p - q) % 360; return Math.min(gap, 360 - gap); };
      assert.deepEqual(item.inputs.map((i) => i.answer), [hour, minute, second], label);
      assert.ok(minute % 5 === 0 && second % 5 === 0 && minute !== second, label);
      assert.ok(apart(hour * 30 + minute / 2, minute * 6) >= 20 && apart(hour * 30 + minute / 2, second * 6) >= 20, '바늘이 붙어 있다: ' + label); tally('clockFace');
    }
    // ── 분수와 소수 ──
    const piecesIn = (html) => [...String(html || '').matchAll(/aria-label="(?:원|사각형)을 (똑같이|크기가 다르게) (\d+)조각으로 나누고 (\d+)조각을 색칠"/g)].map((m) => ({ equal: m[1] === '똑같이', n: Number(m[2]), shaded: Number(m[3]) }));
    if (f.mixedPieces) {
      // 색칠한 그림 여럿으로 나타낸 수: 조각 수는 모두 같고, 색칠한 조각을 모두 세어 가분수의 분자와 대분수를 다시 읽는다.
      const shapes = piecesIn(item.figure), n = shapes[0].n, total = shapes.reduce((s, x) => s + x.shaded, 0);
      assert.ok(shapes.length >= 2 && shapes.every((x) => x.equal && x.n === n) && total > n && total % n !== 0, label);
      const want = { mixed: [Math.trunc(total / n), total % n], both: [Math.trunc(total / n), total % n, total], improper: [total] }[f.mixedPieces];
      assert.deepEqual(item.inputs.map((i) => i.answer), want, label); tally('mixedPieces');
    }
    if (f.pieceRead) {
      // 색칠한 그림 하나: 그림 설명의 조각 수와 색칠한 수로 답을 다시 읽는다.
      const shapes = piecesIn(item.figure);
      assert.equal(shapes.length, 1, label); assert.ok(shapes[0].equal && shapes[0].shaded >= 1 && shapes[0].shaded < shapes[0].n, label);
      const { n, shaded } = shapes[0];
      const want = { parts: [n, shaded], shaded: [shaded, n], more: [f.target - shaded] }[f.pieceRead];
      if (f.pieceRead === 'decimal') { assert.equal(n, 10, label); assert.equal(Math.round(answerAt(item, 0) * 10), shaded, label); }
      else assert.deepEqual(item.inputs.map((i) => i.answer), want, label);
      if (f.pieceRead === 'more') assert.ok(f.target > shaded && f.target < n, label);
      tally('pieceRead');
    }
    if (f.pieceCount) {
      // 똑같이 나눈 조각의 수: 그림 설명의 조각 수가 답이다.
      const shapes = piecesIn(item.figure);
      assert.equal(shapes.length, 1, label); assert.ok(shapes[0].equal, label); assert.equal(answerAt(item, 0), shapes[0].n, label); tally('pieceCount');
    }
    if (f.tilePick) {
      // 보기 그림 넷 가운데 「똑같이 n조각, 색칠 k조각」인 것은 하나뿐이다.
      const shapes = piecesIn(item.figure), hits = shapes.map((s) => s.equal && s.n === f.tilePick.n && s.shaded === f.tilePick.shaded);
      assert.equal(shapes.length, 4, label); assert.equal(hits.filter(Boolean).length, 1, label);
      assert.equal(item.choice.answer, hits.indexOf(true), label); assert.ok(shapes.some((s) => !s.equal), '똑같이 나누지 않은 보기가 없다: ' + label); tally('tilePick');
    }
    if (f.squarePick) {
      const counts = [...item.figure.matchAll(/작은 정사각형 (\d+)개를 이어 붙인 모양/g)].map((m) => Number(m[1]));
      assert.equal(counts[0], 1, label); assert.equal(counts.slice(1).filter((v) => v === f.squarePick).length, 1, label);
      assert.equal(item.choice.answer, counts.slice(1).indexOf(f.squarePick), label); tally('squarePick');
    }
    if (f.fracList) {
      assert.equal(new Set(f.fracList.map((r) => r.join('/'))).size, f.fracList.length, label);
      assert.ok(f.fracList.every(([k, n]) => k >= 1 && k < n), label);
      const units = f.fracList.filter(([k]) => k === 1).length;
      assert.ok(units >= 1 && units < f.fracList.length, label); assert.equal(answerAt(item, 0), units, label); tally('fracList');
    }
    if (f.minOf) { assert.equal(new Set(f.minOf).size, f.minOf.length, label); assert.equal(answerAt(item, 0), Math.min(...f.minOf), label); tally('minOf'); }
    if (f.tenths) {
      // 소수는 0.1이 몇 개인 수인가: 글에 적힌 소수 그대로 다시 센다.
      for (const [said, i] of f.tenths) { assert.match(said, /^\d+\.\d$/, label); assert.ok(strip(item.text + ' ' + (item.figure || '')).includes(said), label); assert.equal(answerAt(item, i), Number(said.replace('.', '')), label); }
      tally('tenths');
    }
    if (f.tenthRead) {
      const m = item.figure.match(/화살표는 (\d+)에서 작은 눈금 (\d+)칸 더 간 곳/);
      assert.ok(m && Number(m[2]) >= 1 && Number(m[2]) <= 9, label);
      assert.equal(Math.round(answerAt(item, 0) * 10), Number(m[1]) * 10 + Number(m[2]), label); tally('tenthRead');
    }
    if (f.deciCards) {
      const sorted = f.deciCards.slice().sort((x, y) => y - x);
      assert.equal(new Set(sorted).size, sorted.length, label); assert.ok(sorted.every((v) => v >= 1 && v <= 9), label);
      assert.equal(Math.round(answerAt(item, 0) * 10), sorted[0] * 10 + sorted[1], label); tally('deciCards');
    }
    if (f.unitBetween) {
      // 1/a 보다 크고 1/b 보다 작은 단위분수: 분모를 하나씩 넣어 센다.
      const [a, b] = f.unitBetween; let count = 0;
      for (let bottom = 2; bottom <= 200; bottom += 1) if (1 / bottom > 1 / a && 1 / bottom < 1 / b) count += 1;
      assert.ok(count >= 1, label); assert.equal(answerAt(item, 0), count, label); tally('unitBetween');
    }
    if (f.digitBoth) {
      // 두 식을 모두 맞게 하는 숫자의 개수
      const holds = (template, x) => { const parts = template.replace(/□/g, String(x)).split(/([<>])/); return parts[1] === '<' ? evaluate(parts[0]) < evaluate(parts[2]) : evaluate(parts[0]) > evaluate(parts[2]); };
      let count = 0;
      for (let x = f.digitBoth.lo; x <= f.digitBoth.hi; x += 1) if (f.digitBoth.templates.every((template) => holds(template, x))) count += 1;
      assert.ok(count >= 1, label); assert.equal(answerAt(item, 0), count, label); tally('digitBoth');
    }
    if (f.onePiece) {
      const m = item.figure.match(/가로로 (\d+)칸, 세로로 (\d+)칸이 들어가는 크기/);
      assert.ok(m, label); assert.equal(answerAt(item, 0), Number(m[1]) * Number(m[2]), label); tally('onePiece');
    }
    if (f.mapSteps) { assert.equal(item.choice.answer, f.mapSteps - 1, label); tally('mapSteps'); }
    if (f.rulerPick) {
      // 자 그림의 두 끝으로 길이를 다시 재어 보기에서 그 길이가 하나뿐인지, 끝 눈금 그대로 읽은 보기가 함정으로 들어 있는지 본다.
      const ends = [...item.figure.matchAll(/눈금 (\d+)(?:에서 작은 눈금 (\d+)칸 더 간 곳)?/g)].map((m) => Number(m[1]) * 10 + Number(m[2] || 0)), length = ends[1] - ends[0];
      assert.ok(ends[0] > 0, label); assert.equal(f.rulerPick.filter((v) => v === length).length, 1, label); assert.equal(new Set(f.rulerPick).size, f.rulerPick.length, label);
      assert.equal(f.rulerPick[item.choice.answer], length, label); assert.ok(f.rulerPick.includes(ends[1]), '끝 눈금을 그대로 읽은 보기가 없다: ' + label); tally('rulerPick');
    }
    if (f.biggerPiece) { const { cuts, more } = f.biggerPiece; assert.ok(cuts[more] < cuts[1 - more], label); assert.equal(f.truth.filter(Boolean).length, 1, label); tally('biggerPiece'); }
    if (f.drawn) { const { segment, line } = f.drawn; assert.ok(segment[1] - segment[0] > (line[1] - line[0]) * 2, '선분을 직선보다 길게 그려야 함정이 된다: ' + label); tally('drawn'); }
    if (f.divMeans) { const [a, b, q] = f.divMeans; assert.ok(a === b * q && b !== q, label); tally('divMeans'); }
    if (f.timeKinds) {
      // 시각 ± 시간 = 시각, 시각 − 시각 = 시간, 시간 ± 시간 = 시간. 결과가 시각인 것은 하나뿐이다.
      const clocky = f.timeKinds.map(([x, , y]) => (x === 'at') !== (y === 'at'));
      assert.ok(f.timeKinds.every(([x, op, y]) => !(x === 'at' && y === 'at' && op === '+') && !(x === 'span' && y === 'at')), label);
      assert.equal(clocky.filter(Boolean).length, 1, label); assert.equal(item.choice.answer, clocky.indexOf(true), label); tally('timeKinds');
    }
    if (f.secFacts) {
      const { m, s, k } = f.secFacts, whole = strip(item.choice.options.join(' | '));
      const said = Number(whole.match(new RegExp(m + '분 ' + s + '초는 (\\d+)초이다'))[1]), hand = Number(whole.match(/가리키면 (\d+)초를 나타낸다/)[1]);
      assert.equal((said === m * 60 + s) !== (hand === k * 5), true, '틀린 설명이 하나가 아니다: ' + label);
      assert.equal(f.truth[item.choice.answer], false, label); tally('secFacts');
    }
    if (f.biggerClaims) {
      for (const [big, small, at] of f.biggerClaims) assert.equal(evaluate(big) > evaluate(small), f.truth[at], label);
      assert.equal(f.biggerClaims.filter(([, , at]) => !f.truth[at]).length, 1, label); tally('biggerClaims');
    }
    if (f.tenthFacts) { const { w, j, said, slip } = f.tenthFacts; assert.equal(said === w * 10 + j, !slip, label); assert.ok(w !== j, label); tally('tenthFacts'); }
    if (f.repeatAdd) {
      // 같은 수를 거듭 더한 식 → 곱셈식: 그림의 덧셈식에 a 가 n 번 적혀 있다.
      const { a, n } = f.repeatAdd;
      assert.deepEqual(strip(item.figure).split('=')[0].split('+').map((s) => s.trim()), Array.from({ length: n }, () => String(a)), label);
      assert.deepEqual(item.inputs.map((i) => i.answer), [n, a * n], label); assert.ok(n >= 2, label); tally('repeatAdd');
    }
    if (f.carry) {
      // 일의 자리 곱에서 올림한 수와 그 수가 나타내는 값
      const [a, b] = f.carry, up = Math.trunc(((a % 10) * b) / 10);
      assert.ok(up >= 1, label); assert.deepEqual(item.inputs.map((i) => i.answer), [up, up * 10], label); tally('carry');
    }
    if (f.mulEnds2) {
      const big = Math.max(...f.mulEnds2), small = Math.min(...f.mulEnds2);
      assert.equal(new Set(f.mulEnds2).size, f.mulEnds2.length, label); assert.ok(big <= 99 && small >= 10, label);
      assert.equal(answerAt(item, 0), big * small, label); tally('mulEnds2');
    }
    if (f.hundredEstimate) {
      // 가까운 몇백으로 어림: 몇백에서 20 안쪽으로 떨어진 수만 쓴다.
      const [a, b] = f.hundredEstimate, about = Math.round(a / 100) * 100;
      assert.ok(Math.abs(a - about) >= 1 && Math.abs(a - about) <= 20, label);
      assert.deepEqual(item.inputs.map((i) => i.answer), [about, about * b], label); tally('hundredEstimate');
    }
    if (f.zeros) { const [a, b] = f.zeros; assert.equal((a * b) % 10, 0, label); assert.ok(a * b < 100, label); tally('zeros'); }
    if (f.zeroMiddle) { const [a, b] = f.zeroMiddle; assert.equal(Math.trunc(a / 10) % 10, 0, label); assert.ok(a >= 101 && b >= 2, label); tally('zeroMiddle'); }
    if (f.mulEnds) {
      const big = Math.max(...f.mulEnds), small = Math.min(...f.mulEnds);
      assert.equal(new Set(f.mulEnds).size, f.mulEnds.length, label);
      assert.ok(big >= 10 && big <= 99 && small >= 2 && small <= 9, label);
      assert.equal(answerAt(item, 0), big * small, label); tally('mulEnds');
    }
    if (f.mulEstimate) {
      // 가까운 몇십으로 어림: 일의 자리가 5 이면 어느 쪽인지 갈리므로 쓰지 않는다.
      const [a, b] = f.mulEstimate, about = Math.round(a / 10) * 10;
      assert.ok(a % 10 !== 5 && a % 10 !== 0 && about >= 10, label);
      assert.deepEqual(item.inputs.map((i) => i.answer), [about, about * b], label); tally('mulEstimate');
    }
    if (f.mulMasks) {
      // 숫자가 가려진 곱셈: 가린 자리(?)에 모든 숫자를 넣어 보아도 맞는 경우는 하나뿐이다. 답은 위에서 아래, 왼쪽에서 오른쪽 차례.
      const frame = f.mulMasks.a + '|' + f.mulMasks.b + '|' + f.mulMasks.p, holes = [...frame].filter((ch) => ch === '?').length, found = [];
      for (let code = 0; code < 10 ** holes; code += 1) {
        const fill = String(code).padStart(holes, '0').split(''); let k = 0;
        const [a, b, p] = frame.replace(/\?/g, () => fill[k++]).split('|');
        if (a[0] === '0' || p[0] === '0') continue;
        if (Number(a) * Number(b) === Number(p)) found.push(fill.map(Number));
      }
      assert.equal(found.length, 1, '가려진 곱셈의 답이 하나가 아니다: ' + label);
      assert.deepEqual(item.inputs.map((i) => i.answer), found[0], label); tally('mulMasks');
    }
    if (f.mulCards) {
      // 수 카드 세 장으로 만드는 (몇십몇)×(몇)의 가장 큰 곱
      const [p, q, r] = f.mulCards, all = [[p, q, r], [p, r, q], [q, p, r], [q, r, p], [r, p, q], [r, q, p]].map(([x, y, z]) => (x * 10 + y) * z);
      assert.equal(new Set(f.mulCards).size, 3, label); assert.ok(f.mulCards.every((v) => v >= 1 && v <= 9), label);
      assert.equal(answerAt(item, 0), Math.max(...all), label); tally('mulCards');
    }
    if (f.divEnds) {
      const big = Math.max(...f.divEnds), small = Math.min(...f.divEnds);
      assert.equal(new Set(f.divEnds).size, f.divEnds.length, label);
      assert.equal(big % small, 0, label); assert.equal(answerAt(item, 0), big / small, label);
      // 가장 큰 수·가장 작은 수가 아닌 짝으로 나누어도 같은 답이 나오면 조건이 답을 가르지 못한다.
      assert.ok(pairsOf(f.divEnds).filter(([x, y]) => Math.max(x, y) / Math.min(x, y) === big / small).length === 1, '다른 짝도 같은 몫: ' + label); tally('divEnds');
    }
  });
  for (const name of Object.keys(counts)) assert.ok(counts[name] >= 30, name + ' 문항이 거의 검사되지 않았다');
  assert.ok(Object.keys(counts).length >= 25, '검사한 갈래: ' + Object.keys(counts).join(', '));
});

// ── 도형 문항 ────────────────────────────────────────────────
// 엔진의 판정을 쓰지 않고 여기서 따로 셈한다(내적이 0이면 직각).
const gsub = (p, q) => [p[0] - q[0], p[1] - q[1]];
const gdot = (u, v) => u[0] * v[0] + u[1] * v[1];
const gcross = (u, v) => u[0] * v[1] - u[1] * v[0];
const rightAngle = (v, p, q) => gdot(gsub(p, v), gsub(q, v)) === 0;
// 직각은 아닌데 직각처럼 보이는 각(76°~104°)
function almostRight(v, p, q) { const a = gsub(p, v), b = gsub(q, v), d = gdot(a, b); return d !== 0 && (d * d) / (gdot(a, a) * gdot(b, b)) < 0.06; }
const cornersOf = (points) => points.map((v, i) => [v, points[(i + points.length - 1) % points.length], points[(i + 1) % points.length]]);
const rightCorners = (points) => cornersOf(points).filter(([v, p, q]) => rightAngle(v, p, q)).length;
const hasAlmostRight = (points) => cornersOf(points).some(([v, p, q]) => almostRight(v, p, q));
const isRect = (points) => points.length === 4 && rightCorners(points) === 4;
const isSq = (points) => isRect(points) && gdot(gsub(points[0], points[1]), gsub(points[0], points[1])) === gdot(gsub(points[1], points[2]), gsub(points[1], points[2]));
const isRightTri = (points) => points.length === 3 && rightCorners(points) === 1;
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

test('도형: 그림의 좌표로 다시 따져 답이 하나이고 표시된 답과 같다', () => {
  const counts = {};
  everyItem((item, at) => {
    const f = item.facts || {}, label = where(item, at);
    const tally = (name) => { counts[name] = (counts[name] || 0) + 1; };
    if (f.count) { assert.equal(answerAt(item, 0), f.count.filter(Boolean).length, label); assert.ok(f.count.some(Boolean) && !f.count.every(Boolean), label); tally('count'); }
    if (f.kindPick) { assert.equal(f.kindPick.kinds.filter((k) => k === f.kindPick.target).length, 1, label); assert.equal(item.choice.answer, f.kindPick.kinds.indexOf(f.kindPick.target), label); tally('kindPick'); }
    if (f.lineName) {
      // 반직선은 시작하는 점부터 읽어야 맞고, 선분·직선은 차례가 달라도 같은 선이다.
      const ok = f.lineName.options.map(([kind, a, b]) => kind === f.lineName.kind && (kind === '반직선' ? a === f.lineName.from && b === f.lineName.to : [a, b].sort().join() === [f.lineName.from, f.lineName.to].sort().join()));
      assert.equal(ok.filter(Boolean).length, 1, label); assert.equal(item.choice.answer, ok.indexOf(true), label); tally('lineName');
    }
    if (f.segments) { assert.equal(answerAt(item, 0), f.segments.closed ? f.segments.points.length : f.segments.points.length - 1, label); tally('segments'); }
    if (f.sameRay) {
      // 한 직선 위에 차례로 놓인 점들: 시작점이 같고 뻗는 쪽이 같은 반직선만 같은 반직선이다.
      const { order, ray, options } = f.sameRay, at = (n) => order.indexOf(n), side = (r) => Math.sign(at(r[1]) - at(r[0]));
      const same = options.map((r) => r[0] === ray[0] && side(r) === side(ray) && r !== ray);
      assert.ok(options.every((r) => at(r[0]) >= 0 && at(r[1]) >= 0 && r[0] !== r[1]), label);
      assert.equal(same.filter(Boolean).length, 1, label); assert.equal(item.choice.answer, same.indexOf(true), label); tally('sameRay');
    }
    if (f.drawnAngle) {
      // 각 ㄱㄴㄷ을 그린 그림: 꼭짓점에 가운데 글자가 적힌 그림은 하나뿐이다.
      const { name, tops } = f.drawnAngle;
      assert.equal(new Set(tops).size, 3, label); assert.ok(tops.every((x) => name.includes(x)), label);
      assert.equal(item.choice.answer, tops.indexOf(name[1]), label); tally('drawnAngle');
    }
    if (f.shapeCounts) {
      // 도형의 뜻에서 나오는 수: [변, 꼭짓점, 직각]
      const want = { 직각삼각형: [3, 3, 1], 직사각형: [4, 4, 4], 정사각형: [4, 4, 4] }[f.shapeCounts];
      assert.ok(want && item.text.includes(f.shapeCounts), label); assert.deepEqual(item.inputs.map((i) => i.answer), want, label); tally('shapeCounts');
    }
    if (f.rayClaims) {
      // 각의 변은 꼭짓점(가운데 글자)에서 시작해 양 끝 점을 지나는 두 반직선이다.
      for (const claim of f.rayClaims) {
        const [p, v, q] = claim.angle.split(''), ok = claim.rays.every((ray) => ray[0] === v && (ray[1] === p || ray[1] === q)) && claim.rays[0] !== claim.rays[1];
        assert.equal(ok, f.truth[claim.at], label);
      }
      assert.equal(f.rayClaims.filter((claim) => !f.truth[claim.at]).length, 1, label); tally('rayClaims');
    }
    if (f.angleTalk) {
      // 한 변 위에 점이 여럿 있는 각: 점이 어느 변 위에 있는지로 설명의 참·거짓을 다시 따진다. 틀린 설명은 하나뿐이다.
      const { vertex, sides, claims } = f.angleTalk, sideOf = (point) => sides.findIndex((list) => list.includes(point));
      const isAngle = (name) => name[1] === vertex && sideOf(name[0]) >= 0 && sideOf(name[2]) >= 0 && sideOf(name[0]) !== sideOf(name[2]);
      const sameAngle = (x, y) => isAngle(x) && isAngle(y) && [sideOf(x[0]), sideOf(x[2])].sort().join() === [sideOf(y[0]), sideOf(y[2])].sort().join();
      const isRay = (ray) => ray[0] === vertex && sideOf(ray[1]) >= 0;
      const truth = claims.map(([kind, x, y]) => ({
        vertex: () => isAngle(x) && y === vertex,
        sameAngle: () => sameAngle(x, y),
        sides: () => isAngle(x) && y.every(isRay) && [sideOf(y[0][1]), sideOf(y[1][1])].sort().join() === [sideOf(x[0]), sideOf(x[2])].sort().join(),
        bigger: () => !sameAngle(x, y) && false,
        sameRay: () => isRay(x) && isRay(y) && sideOf(x[1]) === sideOf(y[1])
      }[kind])());
      assert.equal(truth.filter((ok) => !ok).length, 1, label); assert.equal(item.choice.answer, truth.indexOf(false), label);
      assert.ok(sides.some((list) => list.length >= 2), '한 변 위에 점이 둘 있어야 함정이 된다: ' + label); tally('angleTalk');
    }
    if (f.cornerClaims) {
      // 「각 XYZ은 직각이다」「삼각형 XYZ은 직각삼각형이다」를 좌표로 따진다. 틀린 말은 하나이고, 그 각은 직각처럼 보이지도 않는다.
      const P = f.cornerClaims.points, truth = f.cornerClaims.rows.map(([kind, names]) => { const pts = names.split('').map((n) => P[n]); return kind === 'triangle' ? isRightTri(pts) : rightAngle(pts[1], pts[0], pts[2]); });
      assert.equal(truth.filter((ok) => !ok).length, 1, label); assert.equal(item.choice.answer, truth.indexOf(false), label);
      const [, names] = f.cornerClaims.rows[truth.indexOf(false)], pts = names.split('').map((n) => P[n]);
      assert.ok(!almostRight(pts[1], pts[0], pts[2]), '직각처럼 보이는 각: ' + label); tally('cornerClaims');
    }
    if (f.rectCount) {
      // 모눈종이의 사각형 가운데 네 각이 모두 직각인 것을 센다. 정사각형이 꼭 섞여 있고, 직각처럼 보이는 각은 없다.
      assert.equal(f.rectCount.length, 4, label); assert.equal(answerAt(item, 0), f.rectCount.filter(isRect).length, label);
      assert.ok(f.rectCount.some(isSq), '정사각형이 없다: ' + label); assert.ok(!f.rectCount.some(hasAlmostRight), label); tally('rectCount');
    }
    if (f.truth) { assert.equal(f.truth.filter((t) => t === f.want).length, 1, label); assert.equal(item.choice.answer, f.truth.indexOf(f.want), label); tally('truth'); }
    if (f.sets) {
      let flags = f.sets.flags;
      if (f.prop) {
        const check = { rightTriangle: isRightTri, rectangle: isRect, square: isSq }[f.prop];
        flags = f.polys.map(check);
        assert.deepEqual(flags, f.sets.flags, label);
        for (const points of f.polys) if (!check(points) || f.prop === 'rightTriangle') assert.ok(!hasAlmostRight(points), '직각처럼 보이는 각: ' + label);
      }
      const right = f.sets.labels.filter((_, i) => flags[i]);
      assert.ok(right.length >= 1 && right.length < f.sets.labels.length, label);
      assert.equal(f.sets.options.filter((o) => same(o, right)).length, 1, label);
      assert.ok(same(f.sets.options[item.choice.answer], right), label);
      assert.equal(new Set(f.sets.options.map((o) => o.join())).size, f.sets.options.length, label); tally('sets:' + (f.prop || 'kind'));
    }
    if (f.readAngle) {
      const [v, p, q] = f.readAngle.names;
      const ok = f.readAngle.options.map((o) => o[1] === v && [o[0], o[2]].sort().join() === [p, q].sort().join());
      assert.equal(ok.filter(Boolean).length, 1, label); assert.equal(item.choice.answer, ok.indexOf(true), label); tally('readAngle');
    }
    if (f.mostAngles) { const top = Math.max(...f.mostAngles); assert.equal(f.mostAngles.filter((n) => n === top).length, 1, label); assert.equal(item.choice.answer, f.mostAngles.indexOf(top), label); tally('mostAngles'); }
    if (f.anglePick) {
      const ok = f.anglePick.map(([v, p, q]) => rightAngle(v, p, q));
      assert.equal(ok.filter(Boolean).length, 1, label); assert.equal(item.choice.answer, ok.indexOf(true), label);
      assert.ok(f.anglePick.every(([v, p, q]) => !almostRight(v, p, q)), '직각처럼 보이는 각: ' + label); tally('anglePick');
    }
    if (f.rightCount) {
      assert.equal(answerAt(item, 0), rightCorners(f.rightCount), label); assert.ok(!hasAlmostRight(f.rightCount), label);
      // 오목한 도형은 안쪽으로 꺾인 곳을 직각으로 셀지 헷갈리므로 볼록한 도형만 쓴다.
      const turns = cornersOf(f.rightCount).map(([v, p, q]) => Math.sign(gcross(gsub(v, p), gsub(q, v))));
      assert.ok(turns.every((t) => t === turns[0] && t !== 0), '볼록하지 않은 도형: ' + label); tally('rightCount');
    }
    if (f.clocks) { const ok = f.clocks.map((h) => h % 12 === 3 || h % 12 === 9); assert.equal(ok.filter(Boolean).length, 1, label); assert.equal(item.choice.answer, ok.indexOf(true), label); assert.equal(new Set(f.clocks).size, 4, label); tally('clocks'); }
    if (f.raysRight) {
      const { v, ends, options } = f.raysRight;
      const ok = options.map(([i, j]) => rightAngle(v, ends[i], ends[j]));
      assert.equal(ok.filter(Boolean).length, 1, label); assert.equal(item.choice.answer, ok.indexOf(true), label);
      let rights = 0;
      for (const [x, y] of pairsOf(ends)) { if (rightAngle(v, x, y)) rights += 1; assert.ok(!almostRight(v, x, y), '직각처럼 보이는 각: ' + label); }
      assert.equal(rights, 1, label); tally('raysRight');
    }
    if (f.triPoint) {
      const { a, b, candidates } = f.triPoint, ok = candidates.map((c) => isRightTri([a, b, c]));
      assert.equal(ok.filter(Boolean).length, 1, label); assert.equal(item.choice.answer, ok.indexOf(true), label);
      candidates.forEach((c, i) => { assert.notEqual(gcross(gsub(b, a), gsub(c, a)), 0, '한 줄에 놓인 점: ' + label); if (!ok[i]) assert.ok(!hasAlmostRight([a, b, c]), '직각처럼 보이는 각: ' + label); });
      tally('triPoint');
    }
    if (f.tangram) { assert.equal(f.tangram.length, 7, label); assert.equal(answerAt(item, 0), f.tangram.filter(isRightTri).length, label); assert.equal(answerAt(item, 0), 5, label); tally('tangram'); }
    if (f.rectMove) {
      const [A, Bp, D] = f.rectMove.fixed, ok = f.rectMove.candidates.map((c) => isRect([A, Bp, c, D]));
      assert.equal(ok.filter(Boolean).length, 1, label); assert.equal(item.choice.answer, ok.indexOf(true), label); tally('rectMove');
    }
    if (f.rectSides) { assert.deepEqual(item.inputs.map((i) => i.answer), f.rectSides, label); assert.ok(f.rectSides[0] > f.rectSides[1], label); tally('rectSides'); }
    if (f.squareSum) { assert.equal(answerAt(item, 0), f.squareSum + f.squareSum + f.squareSum + f.squareSum, label); tally('squareSum'); }
    if (f.names) {
      assert.ok(isSq(f.names.points), label);
      const ok = f.names.options.map((o) => same(o.slice().sort(), ['사각형', '직사각형', '정사각형'].sort()));
      assert.equal(ok.filter(Boolean).length, 1, label); assert.equal(item.choice.answer, ok.indexOf(true), label); tally('names');
    }
    if (f.propSum) {
      const TABLE = { 직각삼각형: { 직각: 1, 변: 3, 꼭짓점: 3 }, 직사각형: { 직각: 4, 변: 4, 꼭짓점: 4 }, 정사각형: { 직각: 4, 변: 4, 꼭짓점: 4 } };
      assert.equal(answerAt(item, 0), f.propSum.reduce((sum, [shape, prop]) => sum + TABLE[shape][prop], 0), label); tally('propSum');
    }
    if (f.choose2) {
      const n = f.choose2.length;
      for (let i = 0; i < n; i += 1) for (let j = i + 1; j < n; j += 1) for (let k = j + 1; k < n; k += 1) assert.notEqual(gcross(gsub(f.choose2[j], f.choose2[i]), gsub(f.choose2[k], f.choose2[i])), 0, '한 줄에 놓인 세 점: ' + label);
      assert.equal(answerAt(item, 0), pairsOf(f.choose2).length, label); tally('choose2');
    }
    if (f.rayAngles) {
      // 반직선들이 서로 다른 쪽으로 뻗고 반 바퀴 안에 모여 있으면 두 개씩 짝지은 것이 모두 각이다.
      for (const [a, b] of pairsOf(f.rayAngles)) assert.ok(gcross(a, b) !== 0, label);
      assert.equal(answerAt(item, 0), pairsOf(f.rayAngles).length, label); tally('rayAngles');
    }
    if (f.time) {
      const hits = []; for (let h = f.time.lo + 1; h < f.time.hi; h += 1) if (h % 12 === 3 || h % 12 === 9) hits.push(h);
      assert.deepEqual(hits, [answerAt(item, 0)], label); tally('time');
    }
    if (f.named) {
      const ok = f.named.options.map((names) => !isRightTri(names.split('').map((n) => f.named.points[n])));
      assert.equal(ok.filter(Boolean).length, 1, label); assert.equal(item.choice.answer, ok.indexOf(true), label);
      // 직각삼각형이 아닌 보기에 직각처럼 보이는 각이 있으면 안 된다.
      f.named.options.forEach((names, i) => { if (ok[i]) assert.ok(!hasAlmostRight(names.split('').map((n) => f.named.points[n])), '직각처럼 보이는 각: ' + label); });
      tally('named');
    }
    if (f.lattice) {
      // 그어진 선 위에 세 변이 모두 놓이는 삼각형을 빠짐없이 찾아 직각삼각형을 센다.
      const { nodes, lines } = f.lattice, together = (i, j) => lines.some((line) => line.includes(i) && line.includes(j));
      let right = 0;
      for (let i = 0; i < nodes.length; i += 1) for (let j = i + 1; j < nodes.length; j += 1) for (let k = j + 1; k < nodes.length; k += 1) {
        if (!together(i, j) || !together(j, k) || !together(i, k)) continue;
        if (gcross(gsub(nodes[j], nodes[i]), gsub(nodes[k], nodes[i])) === 0) continue;
        const tri = [nodes[i], nodes[j], nodes[k]];
        if (isRightTri(tri)) right += 1; else assert.ok(!hasAlmostRight(tri), '직각처럼 보이는 각: ' + label);
      }
      assert.equal(answerAt(item, 0), right, label); assert.ok(right >= 2, label); tally('lattice');
    }
    if (f.pieces) { assert.deepEqual(item.inputs.map((i) => i.answer), [f.pieces.filter(isRect).length, f.pieces.filter(isSq).length], label); assert.ok(f.pieces.filter(isSq).length >= 1 && f.pieces.filter(isRect).length > f.pieces.filter(isSq).length, label); tally('pieces'); }
    if (f.bigSquare) { assert.equal(answerAt(item, 0), Math.min(...f.bigSquare), label); assert.notEqual(f.bigSquare[0], f.bigSquare[1], label); tally('bigSquare'); }
    if (f.gridRects) {
      const [rows, cols] = f.gridRects; let n = 0;
      for (let r0 = 0; r0 < rows; r0 += 1) for (let r1 = r0 + 1; r1 <= rows; r1 += 1) for (let c0 = 0; c0 < cols; c0 += 1) for (let c1 = c0 + 1; c1 <= cols; c1 += 1) n += 1;
      assert.equal(answerAt(item, 0), n, label); tally('gridRects');
    }
    if (f.joined) { const [s, k] = f.joined; let long = 0; for (let i = 0; i < k; i += 1) long += s; assert.equal(answerAt(item, 0), long + s + long + s, label); tally('joined'); }
    if (f.twoSquares) { const [a, total] = f.twoSquares, big = total - a; assert.ok(big > a, label); assert.equal(answerAt(item, 0), big - a, label); tally('twoSquares'); }
  });
  for (const name of Object.keys(counts)) assert.ok(counts[name] >= 30, name + ' 문항이 거의 검사되지 않았다');
  assert.ok(Object.keys(counts).length >= 20, '검사한 갈래: ' + Object.keys(counts).join(', '));
});

// ── 큰 수(4학년 1학기) ─────────────────────────────────────────
// 읽은 말·끊어 쓴 말을 엔진과 따로 다시 읽는다: '삼억 이백오십육만' → 302560000, '3억 256만' → 302560000, '302560000' → 그대로.
function valueOf(text) {
  const DIG = { 일: 1, 이: 2, 삼: 3, 사: 4, 오: 5, 육: 6, 칠: 7, 팔: 8, 구: 9 }, SMALL = { 십: 10, 백: 100, 천: 1000 }, BIG = { 만: 1e4, 억: 1e8, 조: 1e12 };
  let total = 0, group = 0, digit = 0, number = '';
  const flush = () => { if (number) { group += Number(number); number = ''; } };
  for (const ch of strip(text).replace(/[\s,]/g, '')) {
    if (/\d/.test(ch)) number += ch;
    else if (DIG[ch]) digit = DIG[ch];
    else if (SMALL[ch]) { group += (digit || 1) * SMALL[ch]; digit = 0; }
    else if (BIG[ch]) { flush(); group += digit; total += (group || 1) * BIG[ch]; group = 0; digit = 0; }
    else assert.fail('수로 읽을 수 없는 글: ' + text);
  }
  flush();
  return total + group + digit;
}
// 수 카드를 모두 한 번씩(twice 면 두 번씩) 써서 만들 수 있는 수 전부. 맨 앞에 0은 오지 못한다.
function cardNumbers(digits, twice) {
  const pool = twice ? digits.concat(digits) : digits.slice(), out = new Set();
  const walk = (left, made) => {
    if (!left.length) { out.add(Number(made)); return; }
    const tried = new Set();
    left.forEach((d, i) => { if (tried.has(d) || (made === '' && d === 0)) return; tried.add(d); walk(left.slice(0, i).concat(left.slice(i + 1)), made + d); });
  };
  walk(pool, '');
  return [...out].sort((x, y) => x - y);
}

test('큰 수: 읽은 말·끊어 쓴 말을 다시 읽고, □·수 카드는 모든 경우를 따진다', () => {
  const counts = {};
  // 큰 수 단원의 근거는 facts.big 아래에 모아 적는다(다른 단원의 facts 이름과 섞이지 않게).
  // 같은 물음을 수의 크기만 바꿔 여러 차시에서 묻는다(다섯 자리 수, 천만까지, 억, 조). facts.rule 에 그 이름을 달고 facts.big.size 에 수를 밝힌다.
  const SIZE = { five: [1e4, 1e5], tenman: [1e5, 1e8], eok: [1e8, 1e12], jo: [1e12, 9e15] };
  const boxes = (html) => strip(String(html || '').replace(/<span class="mb-box">[^<]*<\/span>/g, '□')).replace(/\s/g, '');
  everyItem((item, at) => {
    const f = item.facts || {}, g = f.big || {}, label = where(item, at);
    const tally = (name) => { counts[name] = (counts[name] || 0) + 1; };
    const visible = strip([item.text, item.figure || ''].concat(item.choice ? item.choice.options : []).join(' | '));
    if (BIG_NUMBER_UNITS.has(at.unit.id)) for (const m of visible.matchAll(/\d{17,}/g)) assert.fail('수가 너무 길다: ' + m[0] + ' — ' + label);
    if (g.shown) {
      for (const [text, value] of g.shown) { assert.equal(valueOf(text), value, `적힌 글 「${text}」의 값 — ${label}`); assert.ok(visible.includes(strip(text)), `「${text}」가 문제에 없다 — ${label}`); assert.ok(value < 9e15, label); }
      tally('shown');
    }
    if (g.size) { const range = SIZE[f.rule]; assert.ok(range && g.size >= range[0] && g.size < range[1], `수의 크기가 「${f.rule}」에 안 맞는다: ${g.size} — ${label}`); assert.ok(visible.replace(/\s/g, '').includes(String(g.size)) || (g.shown || []).some(([, v]) => v === g.size), label); tally('size'); }
    // 읽은 말·끊어 쓴 말을 수로 쓴 답
    if (g.written) { for (const [text, i] of g.written) { assert.equal(valueOf(text), answerAt(item, i), label); assert.ok(visible.includes(strip(text)), label); } tally('written'); }
    // 수를 적은 보기 가운데 그 수와 값이 같은 것이 하나뿐이고 그것이 답이다(읽기 고르기, 끊어 쓰기 고르기, 수로 쓰기 고르기).
    if (g.names) {
      assert.equal(valueOf(g.names.given), g.names.value, label); assert.ok(visible.includes(strip(g.names.given)), label);
      const hits = item.choice.options.map((option) => valueOf(option) === g.names.value);
      assert.equal(hits.filter(Boolean).length, 1, '값이 같은 보기가 하나가 아니다: ' + label); assert.equal(item.choice.answer, hits.indexOf(true), label); tally('names');
    }
    // 나타내는 수가 다른 하나: 식(odd) 또는 보기 글(oddNames)의 값이 하나만 다르고 그것이 답이다.
    if (g.odd || g.oddNames) {
      const values = g.odd ? g.odd.map(evaluate) : item.choice.options.map(valueOf), alone = values.map((v) => values.filter((w) => w === v).length === 1);
      assert.ok(values.length >= 3 && values.length === item.choice.options.length, label); assert.equal(alone.filter(Boolean).length, 1, label); assert.equal(item.choice.answer, alone.indexOf(true), label); tally('odd');
    }
    // □가 하나 든 수와 다른 수의 크기 비교: □에 0~9를 넣어 보고 되는 숫자의 수(count)·가장 큰 것(max)·가장 작은 것(min)을 다시 구한다.
    if (g.boxed) {
      const { left, right, op, ask } = g.boxed, fits = [];
      assert.ok(boxes(item.text + ' ' + (item.figure || '')).includes(left) && boxes(item.text + ' ' + (item.figure || '')).includes(right), '□가 든 수가 문제에 없다: ' + label);
      for (let d = 0; d <= 9; d += 1) { const l = Number(left.replace('□', d)), r = Number(right.replace('□', d)); assert.notEqual(l, r, label); if (op === '>' ? l > r : l < r) fits.push(d); }
      assert.ok((op === '>' || op === '<') && fits.length >= 1 && fits.length <= 9, label);
      assert.equal(answerAt(item, 0), ask === 'count' ? fits.length : ask === 'max' ? Math.max(...fits) : Math.min(...fits), label); assert.ok(['count', 'max', 'min'].includes(ask), label); tally('boxed');
    }
    // □가 든 두 수: □마다 0~9를 따로 넣어 보아 언제나 큰지, 언제나 작은지, 넣는 숫자에 따라 다른지 가린다.
    if (g.boxedPair) {
      const { left, right, signs } = g.boxedPair; let more = 0, less = 0;
      assert.ok(boxes(item.text + ' ' + (item.figure || '')).includes(left) && boxes(item.text + ' ' + (item.figure || '')).includes(right), label);
      for (let a = 0; a <= 9; a += 1) for (let b = 0; b <= 9; b += 1) { const l = Number(left.replace('□', a)), r = Number(right.replace('□', b)); if (l > r) more += 1; else if (l < r) less += 1; }
      assert.equal(signs[item.choice.answer], more === 100 ? '>' : less === 100 ? '<' : '?', label); assert.equal(signs.length, item.choice.options.length, label); tally('boxedPair');
    }
    // 수 카드로 만드는 수: 만들 수 있는 수를 모두 만들어 조건에 맞는 것을 다시 고른다.
    if (g.cardsMake) {
      const { digits, rule, fixed, target, twice } = g.cardsMake;
      const all = cardNumbers(digits, twice).filter((n) => (fixed || []).every(([power, d]) => Math.floor(n / power) % 10 === d));
      assert.ok(all.length >= 2, label);
      for (const d of digits) assert.ok(visible.includes(String(d)), label);
      let want;
      if (rule === 'max') want = all[all.length - 1]; else if (rule === 'min') want = all[0]; else if (rule === 'secondMax') want = all[all.length - 2]; else if (rule === 'secondMin') want = all[1];
      else if (rule === 'maxBelow') want = Math.max(...all.filter((n) => n < target)); else if (rule === 'minAbove') want = Math.min(...all.filter((n) => n > target));
      else if (rule === 'nearest') { const gaps = all.map((n) => Math.abs(n - target)), best = Math.min(...gaps); assert.equal(gaps.filter((g) => g === best).length, 1, label); want = all[gaps.indexOf(best)]; }
      else assert.fail('모르는 규칙 ' + rule);
      assert.ok(Number.isFinite(want), label);
      if (item.choice) assert.equal(valueOf(item.choice.options[item.choice.answer]), want, label); else assert.equal(answerAt(item, 0), want, label);
      tally('cardsMake');
    }
    // 수로 쓸 때 0의 개수
    if (g.zeros) { for (const [text, i] of g.zeros) { assert.equal(String(valueOf(text)).split('0').length - 1, answerAt(item, i), label); assert.ok(visible.includes(strip(text)), label); } tally('zeros'); }
    // 수로 쓸 때 0이 가장 많은 보기 고르기
    if (g.zerosMost) {
      const zeros = item.choice.options.map((option) => String(valueOf(option)).split('0').length - 1), top = Math.max(...zeros);
      assert.equal(zeros.filter((z) => z === top).length, 1, label); assert.equal(item.choice.answer, zeros.indexOf(top), label); tally('zeros');
    }
    // 기준보다 큰(작은) 것의 수
    if (g.countIf) {
      const { values, test: kind, target, i } = g.countIf;
      assert.ok(values.every((v) => v !== target) && (kind === 'above' || kind === 'below'), label);
      assert.equal(answerAt(item, i), values.filter((v) => (kind === 'above' ? v > target : v < target)).length, label); tally('countIf');
    }
  });
  if (B.units().some((unit) => BIG_NUMBER_UNITS.has(unit.id))) {
    for (const name of ['shown', 'size', 'written', 'names', 'odd', 'boxed', 'cardsMake', 'zeros']) assert.ok((counts[name] || 0) >= 30, name + ' 문항이 거의 검사되지 않았다');
  }
});

test('토씨 붙이기', () => {
  const { josa, name, say, cut, named } = B.kit;
  assert.deepEqual([josa(3000000000000, '은/는'), josa(30000, '은/는'), josa(300000000, '을/를'), josa(2000000000000, '으로/로'), josa(20000, '으로/로')], ['3000000000000는', '30000은', '300000000을', '2000000000000로', '20000으로']);
  assert.deepEqual([say(10000), say(12345), say(100000000), say(302560000), say(1000000000000), say(40300000000000), say(1111)], ['만', '만 이천삼백사십오', '일억', '삼억 이백오십육만', '일조', '사십조 삼천억', '천백십일']);
  assert.deepEqual([cut(302560000), cut(40300000000012), named(3000000000000, '3조', '은/는'), named(302560000, '3억 256만', '을/를'), named(50000, '5만', '으로/로')], ['3억 256만', '40조 3000억 12', '3조는', '3억 256만을', '5만으로']);
  assert.deepEqual([josa(352, '을/를'), josa(350, '을/를'), josa(201, '을/를'), josa(476, '이/가'), josa(209, '은/는'), josa(390, '은/는')], ['352를', '350을', '201을', '476이', '209는', '390은']);
  assert.deepEqual([josa(300, '으로/로'), josa(201, '으로/로'), josa(203, '으로/로'), josa('물감', '과/와'), josa('가위', '과/와')], ['300으로', '201로', '203으로', '물감과', '가위와']);
  assert.deepEqual([name('서연', '은/는'), name('지우', '은/는'), name('서연', '이/가'), name('지우', '이/가'), name('서연', '과/와'), name('지우', '과/와')], ['서연이는', '지우는', '서연이가', '지우가', '서연이와', '지우와']);
});

test('도형 움직이기: 뒤집기·돌리기를 거듭한 결과와 디지털 숫자', () => {
  const G = B.kit.geo;
  if (!G.flip) return; // 옛 사본(도구가 생기기 전의 geometry.js)으로 돌릴 때
  const L = [[1, 1], [2, 1], [2, 3], [4, 3], [4, 4], [1, 4]], side = (p) => G.flip(p, 5, 5, 'side'), updown = (p) => G.flip(p, 5, 5, 'updown');
  // 같은 쪽으로 두 번 뒤집으면 처음과 같고, 한 번 뒤집으면 달라진다. 네 번 돌리면 처음과 같다.
  assert.ok(G.samePoints(side(side(L)), L) && G.samePoints(updown(updown(L)), L) && !G.samePoints(side(L), L) && !G.samePoints(updown(L), L));
  assert.ok(G.samePoints(G.turn(L, 5, 4), L) && !G.samePoints(G.turn(L, 5, 1), L) && !G.samePoints(G.turn(L, 5, 2), L));
  // 시계 반대 방향 90°는 시계 방향 270°와 같고, 반 바퀴는 옆으로 한 번·위로 한 번 뒤집은 것과 같다.
  assert.ok(G.samePoints(G.turn(L, 5, -1), G.turn(L, 5, 3)) && G.samePoints(G.turn(L, 5, 2), updown(side(L))));
  // 시계 방향 90°: 위쪽 가운데 점이 오른쪽 가운데로 간다.
  assert.equal(JSON.stringify(G.turn([[2.5, 0]], 5, 1)), '[[5,2.5]]');
  // 디지털 숫자: 옆으로·위로 뒤집으면 2와 5가 바뀌고, 반 바퀴 돌리면 6과 9가 바뀐다. 숫자가 아닌 모양은 null.
  const moved = (n, way) => G.segText(G.segNumber(n, way));
  assert.deepEqual([moved('205', 'side'), moved('205', 'updown'), moved('619', 'half'), moved('180', 'half'), moved('52', 'side'), moved('34', 'side'), moved('7', 'updown'), moved('3', 'updown')], ['205', '502', '619', '081', '52', null, null, '3']);
  for (let d = 0; d <= 9; d += 1) for (const way of ['side', 'updown', 'half']) assert.equal(G.segMove(G.segMove(G.SEGMENTS[d], way), way), G.SEGMENTS[d], `${d} ${way} 두 번`);
});
