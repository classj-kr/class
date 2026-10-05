'use strict';
// 키를 누르고 있는 동안 입력을 되풀이해 보내지 않으면, 그 한 번이 유실됐을 때
// 화면만 앞서 가다 스냅샷마다 제자리로 끌려온다(2026-09-18 수업에서 "오뚜기"로 터짐).
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const student = fs.readFileSync(path.join(__dirname, '..', 'public', 'index.html'), 'utf8').replace(/\r\n/g, '\n');
const server = fs.readFileSync(path.join(__dirname, '..', 'server.js'), 'utf8').replace(/\r\n/g, '\n');

assert.match(student, /function anyKeyHeld\(\)/, '누르고 있는 키를 보는 함수가 있어야 한다');
assert.match(student, /setInterval\(\(\)=>\{if\(joined&&anyKeyHeld\(\)\)sendInput\(\)\},\s*(\d{2,3})\)/, '키를 누르고 있는 동안 입력을 되풀이해 보내야 한다');
const gap = Number(student.match(/setInterval\(\(\)=>\{if\(joined&&anyKeyHeld\(\)\)sendInput\(\)\},\s*(\d{2,3})\)/)[1]);
assert.ok(gap > 0 && gap <= 400, `되풀이 간격이 너무 깁니다: ${gap}ms`);
// 끊겼다 다시 붙을 때(970866aa8부터): 서버가 배를 세우므로 화면도 눌린 키를 지워 함께 멈추고,
// 접속을 되살린 뒤 지금 키 상태를 한 번 알린다. 누르고 있던 글쇠는 되풀이되는 keydown 이 다시 켠다.
assert.match(server, /socket\.on\('disconnect', \(\) => \{\s*const player = playerForSocket\(socket\);\s*if \(player\?\.resumeToken\) \{\s*stopPlayer\(player\);/, '끊긴 학생의 배는 서버가 세워야 한다');
assert.match(student, /socket\.on\('disconnect',\(\)=>\{[^\n]*for\(const k in keys\)keys\[k\]=false/, '끊기면 눌린 키를 지워 서버와 같이 멈춰야 한다');
assert.match(student, /socket\.on\('connect',\(\)=>\{if\(joined\)\{restoreVoyagerConnection\(\);return\}/, '다시 붙으면 접속을 되살려야 한다');
const finishJoin = student.slice(student.indexOf('function finishJoin(result,resumed=false){'), student.indexOf('\nfunction joinRoom('));
assert.match(finishJoin, /sendInput\(\);\s*\}\s*$/, '접속을 되살린 뒤 지금 키 상태를 알려야 한다');
// 화면 패드는 pointerdown 이 한 번뿐이라 글쇠처럼 저절로 되살아나지 않는다. 아직 누르고 있는 단추는 다시 붙을 때 되살린다.
assert.match(finishJoin, /rearmHeldPad\(\);sendInput\(\);\s*\}\s*$/, '다시 붙었을 때 누르고 있던 화면 패드 단추를 되살려야 한다');
assert.match(student, /function rearmHeldPad\(\)\{if\(!canTravelNow\(\)\|\|\(mode!=='sea'&&mode!=='land'\)\)return;for\(const b of document\.querySelectorAll\('#pad button\.held\[data-dir\]'\)\)if\(b\.dataset\.dir in keys\)keys\[b\.dataset\.dir\]=true\}/, '되살리기는 움직일 수 있을 때, 눌린 표시가 남은 단추만 대상으로 한다');
assert.match(student, /if\(!keys\[keyMap\[e\.key\]\]\)setDir\(keyMap\[e\.key\],true\)/, '지워진 키는 되풀이 keydown 이 다시 켜야 한다');

console.log(JSON.stringify({ ok: true, resendEveryMs: gap }));
