'use strict';
// 키를 누르고 있는 동안 입력을 되풀이해 보내지 않으면, 그 한 번이 유실됐을 때
// 화면만 앞서 가다 스냅샷마다 제자리로 끌려온다(2026-09-18 수업에서 "오뚜기"로 터짐).
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const student = fs.readFileSync(path.join(__dirname, '..', 'public', 'index.html'), 'utf8');

assert.match(student, /function anyKeyHeld\(\)/, '누르고 있는 키를 보는 함수가 있어야 한다');
assert.match(student, /setInterval\(\(\)=>\{if\(joined&&anyKeyHeld\(\)\)sendInput\(\)\},\s*(\d{2,3})\)/, '키를 누르고 있는 동안 입력을 되풀이해 보내야 한다');
const gap = Number(student.match(/setInterval\(\(\)=>\{if\(joined&&anyKeyHeld\(\)\)sendInput\(\)\},\s*(\d{2,3})\)/)[1]);
assert.ok(gap > 0 && gap <= 400, `되풀이 간격이 너무 깁니다: ${gap}ms`);
assert.match(student, /socket\.on\('connect',\(\)=>\{if\(joined&&anyKeyHeld\(\)\)sendInput\(\)\}\)/, '다시 붙었을 때도 눌린 키를 알려야 한다');

console.log(JSON.stringify({ ok: true, resendEveryMs: gap }));
