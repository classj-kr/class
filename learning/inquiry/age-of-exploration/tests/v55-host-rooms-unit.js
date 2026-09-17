'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'..');
const server=fs.readFileSync(path.join(root,'server.js'),'utf8');
const html=fs.readFileSync(path.join(root,'public/index.html'),'utf8');
const teacher=fs.readFileSync(path.join(root,'public/teacher.html'),'utf8');

// 서버: 누구나 방을 만들고, 방장 표로만 방장 권한을 되찾는다
assert.match(server,/socket\.on\('createRoom'/);
assert.match(server,/socket\.on\('hostStartFree'/);
assert.match(server,/function hashHostToken\(/);
assert.match(server,/hashHostToken\(hostToken\)/);
assert.match(server,/function isValidClassCode\(value\) \{\s*return \/\^\\d\{4\}\$\/\.test\(/);
assert.doesNotMatch(server,/TEACHER_PIN/);
assert.doesNotMatch(server,/joinSolo/);
assert.doesNotMatch(server,/socket\.on\('teacherCreateClass'/);

// 학생 화면: 방 만들기/들어가기, 자유 항해/도착 경주 고르기, 방장 출발 버튼
assert.match(html,/data-entry-mode="create"/);
assert.match(html,/data-entry-mode="join"/);
assert.match(html,/data-room-type="free"/);
assert.match(html,/data-room-type="race"/);
assert.match(html,/socket\.emit\('createRoom'/);
assert.match(html,/hostStartBtn/);
assert.doesNotMatch(html,/joinSolo/);

// 현황판: 방 만들기와 방장 표를 쓰고 교사 비밀번호는 없다
assert.match(teacher,/createRoom/);
assert.match(teacher,/hostToken/);
assert.doesNotMatch(teacher,/\bpin\b/i);

console.log(JSON.stringify({ok:true,createRoom:true,hostStartFree:true,hostTokenHashed:true,fourDigitRooms:true,teacherPinRemoved:true,soloRemoved:true}));
