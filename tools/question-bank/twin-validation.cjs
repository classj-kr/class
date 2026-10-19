'use strict';
// 기존 독립 계산·도형 검사를 수정하지 않고 문항별 검사 함수만 재사용한다.
// ‘60개 씨앗 이상’ 같은 표본 수 검사는 수집 단계에서만 생략한다. 문항의 수학 검사는 모두 그대로 실행한다.
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm'), assert = require('node:assert/strict');
const filename = path.resolve(__dirname, '../../tests/math-bank-units.test.cjs');
function createValidator() {
  let collecting = false;
  const tests = [], checks = [];
  const wrappedFs = new Proxy(fs, { get(target, prop) {
    if (prop !== 'readdirSync') return target[prop];
    return (dir, ...args) => { const files = fs.readdirSync(dir, ...args); return path.basename(dir) === 'units' ? files.filter(f => /^(?:[1-9]-[12]|10-1)-\d+[a-z]\.js$/.test(f)) : files; };
  } });
  const wrappedAssert = new Proxy(assert, { get(target, prop) { return prop === 'ok' ? (...args) => { if (!collecting) assert.ok(...args); } : target[prop]; } });
  const nativeRequire = require('node:module').createRequire(filename);
  const context = { console, process, __dirname: path.dirname(filename), __filename: filename, __collect: visit => checks.push(visit), require: id => {
    if (id === 'node:test') return (name, fn) => tests.push({ name, fn });
    if (id === 'node:fs') return wrappedFs;
    if (id === 'node:assert/strict') return wrappedAssert;
    return nativeRequire(id);
  } };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(filename, 'utf8') + '\n everyItem = visit => __collect(visit); globalThis.__bank = B; globalThis.__validate = (item, at) => { for (const check of globalThis.__checks) check(local(item), at); };', context, { filename });
  collecting = true;
  for (const test of tests) if (!/맨 위|은행:|토씨 붙이기|도형 움직이기/.test(test.name)) test.fn();
  collecting = false; context.__checks = checks;
  assert.equal(checks.length, 6, '기존의 여섯 문항 검사 갈래를 모두 사용한다');
  return { B: context.__bank, validate: (item, at) => context.__validate(item, at) };
}
module.exports = { createValidator };
