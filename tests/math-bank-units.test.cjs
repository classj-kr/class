// 수학 문제은행의 문항을 씨앗 수백 개로 만들어, 답과 조건을 엔진과 다른 길로 다시 셈해 맞춰 본다.
//   node --test tests/math-bank-units.test.cjs
// 문항은 저장된 글이 아니라 만들어 내는 것이라, 한 번 눈으로 본 것으로는 모자라다. 여기서는
//  - 답이 맞는가(식을 따로 계산), 답이 하나뿐인가(가려진 숫자·□ 범위·고르기 문항은 모든 경우를 따져 본다)
//  - 묶음 이름대로인가(받아올림·받아내림 횟수)
//  - 글이 멀쩡한가(undefined·NaN, 잘못 붙은 토씨)
// 를 본다.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const ROOT = path.join(__dirname, '..');
const APP = path.join(ROOT, 'learning/literacy-numeracy/math-bank');
const context = { console }; context.globalThis = context;
vm.createContext(context);
for (const file of ['engine.js', ...fs.readdirSync(path.join(APP, 'units')).filter((f) => f.endsWith('.js')).sort().map((f) => 'units/' + f)]) {
  vm.runInContext(fs.readFileSync(path.join(APP, file), 'utf8'), context, { filename: file });
}
const B = context.MathBank;
const SEEDS = Array.from({ length: 160 }, (_, i) => i * 7919 + 13);

// 엔진과 따로 쓴 셈
function carries(a, b) { let n = 0, c = 0; const at = []; for (let i = 0; i < 3; i += 1) { c = (a % 10) + (b % 10) + c >= 10 ? 1 : 0; n += c; at.push(c); a = Math.trunc(a / 10); b = Math.trunc(b / 10); } return { n, at }; }
function borrows(a, b) { let n = 0, c = 0; for (let i = 0; i < 3; i += 1) { c = (a % 10) - (b % 10) - c < 0 ? 1 : 0; n += c; a = Math.trunc(a / 10); b = Math.trunc(b / 10); } return n; }
const calc = (a, op, b) => (op === '+' ? a + b : a - b);
const strip = (html) => String(html || '').replace(/<svg[\s\S]*?<\/svg>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/\s+/g, ' ').trim();
const pairsOf = (list) => { const out = []; for (let i = 0; i < list.length; i += 1) for (let j = i + 1; j < list.length; j += 1) out.push([list[i], list[j]]); return out; };

function everyItem(visit) {
  for (const unit of B.units()) for (const group of unit.groups) for (const level of B.LEVELS) {
    if (B.typesOf(group, level).length === 0) continue;
    for (const seed of SEEDS) for (const item of B.makeRound(unit, group.id, level, seed)) visit(item, { unit, group, level, seed });
  }
}
const where = (item, at) => `${at.unit.id} ${at.group.id} ${item.key} (seed ${at.seed}): ${strip(item.text)} ${strip(item.figure)}`;

test('모든 문항이 온전한 모양이고 글이 멀쩡하다', () => {
  let made = 0;
  everyItem((item, at) => {
    made += 1;
    const label = where(item, at);
    assert.ok(typeof item.text === 'string' && strip(item.text).length >= 6, label);
    for (const part of [item.text, item.figure, item.explain]) assert.doesNotMatch(String(part || ''), /undefined|NaN|null|\[object/, label);
    // 잘못 붙은 토씨: 받침 없는 수 뒤의 을·은·이·과, 받침 있는 수 뒤의 를·는·가·와 를 수 읽기로 따진다.
    for (const m of strip(item.text + ' ' + (item.figure || '') + ' ' + (item.explain || '')).matchAll(/(\d+)(을|를|은|는|이|가|과|와)(?=[\s,.])/g)) {
      const batchim = [true, true, false, true, false, false, true, true, true, false][Number(m[1]) % 10];
      assert.equal('을은이과'.includes(m[2]), batchim, `토씨 "${m[0]}" — ${label}`);
    }
    assert.ok(/^\d수\d\d-\d\d$/.test(item.standard), label);
    // 말투는 수능 문체: "~세요 / ~습니다 / ~인가요" 를 쓰지 않는다.
    assert.doesNotMatch(strip(item.text + ' ' + (item.figure || '') + ' ' + (item.explain || '')), /세요|습니다|입니다|인가요|나요\?|해요|예요|어요/, '말투: ' + label);
    if (item.choice) {
      assert.ok(item.choice.options.length >= 3 && Number.isInteger(item.choice.answer) && item.choice.answer >= 0 && item.choice.answer < item.choice.options.length, label);
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
    }
  });
  assert.ok(made > 10000, '문항 수: ' + made);
});

test('같은 씨앗이면 같은 문항, 다른 씨앗이면 다른 수', () => {
  const unit = B.findUnit('3-1-1');
  const a = JSON.stringify(B.makeRound(unit, 'mix', '기본', 4242));
  assert.equal(JSON.stringify(B.makeRound(unit, 'mix', '기본', 4242)), a);
  assert.notEqual(JSON.stringify(B.makeRound(unit, 'mix', '기본', 4243)), a);
  // 한 판 안에서 같은 식이 되풀이되지 않는다.
  for (const seed of SEEDS.slice(0, 40)) for (const group of unit.groups) {
    const seen = new Set();
    for (const item of B.makeRound(unit, group.id, '기본', seed)) {
      if (!item.facts || !item.facts.op || item.facts.masks) continue;
      const key = item.facts.a + item.facts.op + item.facts.b;
      assert.ok(!seen.has(key), `${group.id} seed ${seed}: ${key} 가 두 번 나왔다`);
      seen.add(key);
    }
  }
});

test('계산 문항: 답이 맞고, 묶음 이름대로 받아올림·받아내림이 일어난다', () => {
  const RULE = {
    add0: (a, b) => carries(a, b).n === 0,
    add1: (a, b) => carries(a, b).n === 1 && carries(a, b).at[2] === 0,
    add2: (a, b) => carries(a, b).n >= 2,
    sub0: (a, b) => borrows(a, b) === 0,
    sub1: (a, b) => borrows(a, b) === 1,
    sub2: (a, b) => borrows(a, b) === 2
  };
  const seen = {};
  everyItem((item, at) => {
    const f = item.facts || {};
    if (!f.op || f.masks) return;
    const label = where(item, at);
    assert.ok(f.a >= 100 && f.a <= 999 && f.b >= 100 && f.b <= 999, label);
    if (f.op === '-') assert.ok(f.a > f.b, label);
    assert.equal(item.inputs[item.inputs.length - 1].answer, calc(f.a, f.op, f.b), label);
    const rule = RULE[at.group.id];
    if (rule) assert.ok(rule(f.a, f.b), '묶음 조건에 안 맞는 수: ' + label);
    if (f.parts) f.parts.forEach((p, i) => assert.equal(item.inputs[i].answer, p[0] + p[1], label));
    if (f.wrong !== undefined) assert.notEqual(f.wrong, f.a - f.b, '틀린 답이 정답과 같다: ' + label);
    if (f.digits) {
      // 세 장으로 만들 수 있는 세 자리 수를 모두 늘어놓고 가장 큰 것과 가장 작은 것을 고른다.
      const made = permutations(f.digits).filter((n) => n >= 100);
      assert.equal(f.a, Math.max(...made), label);
      assert.equal(f.b, Math.min(...made), label);
      assert.equal(new Set(f.digits).size, 3, label);
    }
    if (f.three) assert.deepEqual([f.a, f.b], [Math.max(...f.three), Math.min(...f.three)], label);
    (seen[at.group.id] = seen[at.group.id] || new Set()).add(carries(f.a, f.b).n + '/' + borrows(Math.max(f.a, f.b), Math.min(f.a, f.b)));
  });
  // 받아올림이 두 번인 것과 세 번인 것, 십의 자리가 0인 뺄셈이 실제로 섞여 나온다.
  assert.ok(seen.add2.has('2/0') || [...seen.add2].some((k) => k.startsWith('2/')), '받아올림 두 번');
  assert.ok([...seen.add2].some((k) => k.startsWith('3/')), '받아올림 세 번');
});
function permutations(digits) {
  const out = [];
  for (let i = 0; i < 3; i += 1) for (let j = 0; j < 3; j += 1) for (let k = 0; k < 3; k += 1) if (i !== j && j !== k && i !== k) out.push(digits[i] * 100 + digits[j] * 10 + digits[k]);
  return out;
}

test('가려진 숫자: 가린 자리를 모든 숫자로 바꿔 보아도 맞는 경우는 하나뿐이다', () => {
  let checked = 0;
  everyItem((item, at) => {
    const f = item.facts || {};
    if (!f.masks) return;
    checked += 1;
    const label = where(item, at);
    const rows = [String(f.a), String(f.b), String(calc(f.a, f.op, f.b))];
    assert.equal(new Set(f.masks.map((m) => m.place)).size, f.masks.length, '한 자리에 둘을 가렸다: ' + label);
    let solutions = 0;
    const total = 10 ** f.masks.length;
    for (let code = 0; code < total; code += 1) {
      const trial = rows.map((r) => r.split(''));
      f.masks.forEach((m, i) => { trial[m.row][trial[m.row].length - 1 - m.place] = String(Math.trunc(code / 10 ** i) % 10); });
      if (trial.some((r) => r[0] === '0')) continue;
      const [a, b, c] = trial.map((r) => Number(r.join('')));
      if (calc(a, f.op, b) === c) solutions += 1;
    }
    assert.equal(solutions, 1, label);
    f.masks.forEach((m, i) => assert.equal(item.inputs[i].answer, Number(rows[m.row][rows[m.row].length - 1 - m.place]), label));
  });
  assert.ok(checked > 500);
});

test('고르기·범위·어림 문항: 모든 경우를 따져 답이 하나이고 표시된 답과 같다', () => {
  const counts = {};
  everyItem((item, at) => {
    const f = item.facts || {};
    const label = where(item, at);
    const tally = (name) => { counts[name] = (counts[name] || 0) + 1; };
    if (f.compare) {
      const [left, right] = f.compare.map(([a, op, b]) => calc(a, op, b));
      assert.equal(item.choice.answer, left > right ? 0 : left === right ? 1 : 2, label); tally('compare');
    }
    if (f.best) {
      const values = f.best.map(([a, op, b]) => calc(a, op, b));
      assert.equal(values.filter((v) => v === Math.max(...values)).length, 1, label);
      assert.equal(item.choice.answer, values.indexOf(Math.max(...values)), label);
      assert.ok(values.every((v) => v > 0), label); tally('best');
    }
    if (f.range) {
      let largest = -1;
      for (let x = 100; x <= 999; x += 1) if (f.range === 'a-x>c' ? f.a - x > f.c : f.a + x < f.c) largest = x;
      assert.equal(item.inputs[0].answer, largest, label);
      assert.ok(largest >= 100, label); tally('range');
    }
    if (f.estimate) {
      const round = (n) => Math.round(n / 100) * 100;
      for (const n of [f.a, f.b]) assert.ok(Math.abs(n - round(n)) >= 2 && Math.abs(n - round(n)) <= 12, '몇백에 가깝지 않다: ' + label);
      const right = calc(round(f.a), f.estimate, round(f.b));
      assert.ok(right > 0, label);
      if (f.options) { assert.equal(f.options.filter((v) => v === right).length, 1, label); assert.equal(f.options[item.choice.answer], right, label); assert.ok(f.options.every((v) => v > 0), label); }
      else assert.equal(item.inputs[item.inputs.length - 1].answer, right, label);
      if (item.inputs && item.inputs.length === 3) assert.deepEqual([item.inputs[0].answer, item.inputs[1].answer], [round(f.a), round(f.b)], label);
      tally('estimate');
    }
    if (f.budget) {
      const affordable = pairsOf(f.prices).filter(([x, y]) => x + y <= f.budget);
      assert.equal(affordable.length, 1, label);
      assert.ok(pairsOf(f.prices).every(([x, y]) => Math.abs(x + y - f.budget) >= 20), '1000원에 너무 가까운 짝: ' + label);
      const chosen = f.pairs[item.choice.answer];
      assert.equal(chosen[0] + chosen[1] <= f.budget, true, label);
      assert.equal(f.pairs.filter(([x, y]) => x + y <= f.budget).length, 1, label); tally('budget');
    }
    if (f.inverse) {
      const x = item.inputs[0].answer;
      const holds = { 'x+b=a': x + f.b === f.a, 'b+x=a': f.b + x === f.a, 'a-x=c': f.a - x === f.c, 'x-b=c': x - f.b === f.c }[f.inverse];
      assert.equal(holds, true, label); tally('inverse');
    }
    if (f.wrong === 'sub-for-add') { assert.equal(f.x - f.b, f.c, label); assert.equal(item.inputs[0].answer, f.x + f.b, label); tally('wrong'); }
    if (f.wrong === 'add-for-sub') { assert.equal(f.x + f.b, f.c, label); assert.equal(item.inputs[0].answer, f.x - f.b, label); assert.ok(f.x - f.b > 0, label); tally('wrong'); }
    if (f.two) { assert.equal(item.inputs[0].answer, f.total - f.a - f.b, label); assert.ok(f.rest >= 100 && f.total <= 999, label); tally('two'); }
    if (f.target) {
      const hits = pairsOf(f.four).filter(([x, y]) => x + y === f.target);
      assert.equal(hits.length, 1, label);
      const chosen = f.pairs[item.choice.answer];
      assert.equal(chosen[0] + chosen[1], f.target, label);
      assert.equal(f.pairs.filter(([x, y]) => x + y === f.target).length, 1, label); tally('pair');
    }
    if (f.three && Array.isArray(f.three) && typeof f.three[1] === 'string') {
      const [a, , b, , c] = f.three;
      assert.equal(item.inputs[0].answer, a + b - c, label); assert.ok(a + b - c > 0, label); tally('three');
    }
  });
  for (const name of ['compare', 'best', 'range', 'estimate', 'budget', 'inverse', 'wrong', 'two', 'pair', 'three']) assert.ok(counts[name] > 100, name + ' 문항이 검사되지 않았다');
});

test('토씨 붙이기', () => {
  const { josa, name } = B.kit;
  assert.deepEqual([josa(352, '을/를'), josa(350, '을/를'), josa(201, '을/를'), josa(476, '이/가'), josa(209, '은/는'), josa(390, '은/는')], ['352를', '350을', '201을', '476이', '209는', '390은']);
  assert.deepEqual([josa(300, '으로/로'), josa(201, '으로/로'), josa(203, '으로/로'), josa('물감', '과/와'), josa('가위', '과/와')], ['300으로', '201로', '203으로', '물감과', '가위와']);
  assert.deepEqual([name('서연', '은/는'), name('지우', '은/는'), name('서연', '이/가'), name('지우', '이/가')], ['서연이는', '지우는', '서연이가', '지우가']);
});
