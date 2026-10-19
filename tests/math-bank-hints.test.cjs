'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const context = {}; context.globalThis = context;
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../learning/literacy-numeracy/math-bank/hints.js'), 'utf8'), context);
const hintFor = context.MathBankHints.forItem;

test('힌트는 정답·보기의 정답 위치·해설을 읽지 않는다', () => {
  const item = { typeTitle: '원기둥에 꼭 맞게 들어가는 구와 원뿔' };
  for (const key of ['explain', 'shown', 'inputs', 'facts', 'figure', 'choice']) Object.defineProperty(item, key, { get() { throw new Error('힌트에서 읽으면 안 되는 풀이 데이터: ' + key); } });
  const hint = hintFor(item);
  assert.match(hint, /구와 원뿔.*각각 식/);
  assert.doesNotMatch(hint, /정답|답:|1\s*:\s*2\s*:\s*3/);
});

test('묶음보다 개별 유형을 우선하여 풀이 방향을 안내한다', () => {
  const hint = hintFor({ typeTitle: '원뿔의 겉넓이' }, { title: '뿔의 겉넓이와 부피' });
  assert.match(hint, /겉으로 드러나는 면/);
  assert.doesNotMatch(hint, /높이를 찾아/);
  assert.match(hintFor({ typeTitle: '구의 부피(자연수 계수)' }), /지름.*반지름/);
});

test('분수의 곱셈과 나눗셈은 덧셈 안내와 구분한다', () => {
  assert.match(hintFor({ typeTitle: '분수의 곱셈' }), /분자끼리.*분모끼리/);
  assert.match(hintFor({ typeTitle: '분수의 나눗셈' }), /역수/);
});

test('유형에서 방향을 찾지 못하면 묶음의 개념을 쓰고, 해설은 복사하지 않는다', () => {
  assert.match(hintFor({ typeTitle: '두 식을 비교하기', explain: '정답은 98765이다.' }, { title: '일차부등식' }), /부등호/);
  const fallback = hintFor({ typeTitle: '다른 유형', choice: { answer: 2 }, explain: '정답은 98765이다.' });
  assert.match(fallback, /보기마다 같은 기준/);
  assert.doesNotMatch(fallback, /98765/);
});

test('문항별로 작성한 힌트가 있으면 이를 사용한다', () => {
  assert.equal(hintFor({ hint: '  반지름과 모선의 위치를 확인해 보세요.  ', typeTitle: '원뿔의 겉넓이' }), '반지름과 모선의 위치를 확인해 보세요.');
});
