'use strict';
// 얼음에 갇히지 않는다: 배도 탐험대도 얼음 안에서 적도 쪽으로는 언제나 빠져나올 수 있어야 한다.
// 그리고 해안·얼음에 뱃머리가 박히면 그 자리에 서지 않고 옆으로 비껴 가야 한다.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ShipMotion = require('../lib/ship-motion.js');
const Terrain = require('../public/js/terrain.js');

const sea = (over) => ShipMotion.canEnter({ mode: 'sea', nextType: 'sea', nextPassable: true, frozenAhead: false, trapped: false, hereLat: 60, nextLat: 61, ...over });

// 보통 항해: 바다는 가고, 뭍과 얼음은 못 간다.
assert.equal(sea(), true, '열린 바다는 갈 수 있어야 함');
assert.equal(sea({ nextType: 'ice', nextPassable: false }), false, '얼음 바다로는 들어갈 수 없어야 함');
assert.equal(sea({ nextType: 'coast' }), false, '배는 뭍으로 갈 수 없어야 함');
assert.equal(sea({ frozenAhead: true }), false, '그 계절에 언 바다로는 갈 수 없어야 함');

// 얼음에 갇힌 배: 적도 쪽으로는 나갈 수 있고, 더 깊이는 못 들어간다.
const trappedNorth = { mode: 'sea', trapped: true, hereLat: 78, nextPassable: false };
assert.equal(ShipMotion.canEnter({ ...trappedNorth, nextType: 'ice', nextLat: 77.5, frozenAhead: false }), true, '갇힌 배는 남쪽(적도 쪽)으로 나올 수 있어야 함');
assert.equal(ShipMotion.canEnter({ ...trappedNorth, nextType: 'sea', nextLat: 77.5, frozenAhead: true }), true, '언 바다라도 적도 쪽이면 나올 수 있어야 함');
assert.equal(ShipMotion.canEnter({ ...trappedNorth, nextType: 'ice', nextLat: 78.5, frozenAhead: false }), false, '갇힌 배가 더 북쪽으로 들어가면 안 됨');
assert.equal(ShipMotion.canEnter({ ...trappedNorth, nextType: 'coast', nextLat: 77.5, frozenAhead: false }), false, '배가 뭍으로 올라가면 안 됨');
// 남극도 같다(적도 쪽은 북쪽이다).
const trappedSouth = { mode: 'sea', trapped: true, hereLat: -70, nextType: 'ice', nextPassable: false, frozenAhead: false };
assert.equal(ShipMotion.canEnter({ ...trappedSouth, nextLat: -69.5 }), true, '남극에 갇힌 배는 북쪽으로 나올 수 있어야 함');
assert.equal(ShipMotion.canEnter({ ...trappedSouth, nextLat: -70.5 }), false, '남극에서 더 남쪽으로 들어가면 안 됨');

// 얼음 땅에 올라선 탐험대도 같은 방법으로 빠져나온다.
const onIce = { mode: 'land', trapped: true, hereLat: 82, nextType: 'ice', nextPassable: false, frozenAhead: false };
assert.equal(ShipMotion.canEnter({ ...onIce, nextLat: 81.5 }), true, '얼음 땅의 탐험대도 적도 쪽으로 걸어 나올 수 있어야 함');
assert.equal(ShipMotion.canEnter({ ...onIce, nextLat: 82.5 }), false, '탐험대가 얼음 안쪽으로 더 가면 안 됨');
assert.equal(ShipMotion.canEnter({ ...onIce, nextType: 'sea', nextLat: 81.5 }), false, '탐험대가 바다로 걸어 들어가면 안 됨');
// 갇히지 않은 탐험대는 얼음을 밟지 못한다.
assert.equal(ShipMotion.canEnter({ mode: 'land', trapped: false, hereLat: 79, nextType: 'ice', nextPassable: false, nextLat: 80 }), false, '평소에는 얼음 땅으로 들어갈 수 없어야 함');

// 비껴 가기: 조금씩 틀어 보다가, 옆으로도 못 가면 뒤쪽까지 돌린다(피오르 안쪽에서 빠져나오는 유일한 길).
const angles = ShipMotion.slideAngles(1);
const magnitudes = angles.map(Math.abs);
assert.deepEqual(magnitudes, [...magnitudes].sort((a, b) => a - b), '작게 틀어 보고 나서 크게 틀어야 함');
assert.ok(magnitudes[0] < Math.PI / 4, '먼저 조금만 틀어야 함');
assert.ok(magnitudes[magnitudes.length - 1] > Math.PI / 2, '끝내 막히면 뒤로도 돌 수 있어야 함');
assert.deepEqual(ShipMotion.slideAngles(-1).map((a) => Math.sign(a)), [-1, 1, -1, 1, -1, 1, -1, 1, -1, 1], '돌던 쪽을 이어서 돌아야 함');

// 서버가 이 규칙을 쓰고 있는가. 손으로 몰 때도 비껴 가야 한다.
const server = fs.readFileSync(path.join(__dirname, '..', 'server.js'), 'utf8');
assert.match(server, /ShipMotion\.canEnter\(/, '서버가 같은 규칙을 써야 함');
assert.match(server, /ShipMotion\.slideAngles\(p\.slideSign\)/, '서버가 같은 비껴 가기를 써야 함');
assert.match(server, /if \(!moved\) \{/, '손으로 몰 때도 비껴 가야 함');
const page = fs.readFileSync(path.join(__dirname, '..', 'public', 'index.html'), 'utf8');
assert.match(page, /if\(!moved\)for\(const angle of/, '학생 화면도 비껴 가야 함(서버와 어긋나면 배가 덜컥거린다)');
assert.match(page, /iceSlowdownAt/, '학생 화면도 얼음 앞에서 느려져야 함');

// 얼음 앞에서 느려지는 폭: 다 와서도 3분의 1은 남아야 빠져나올 수 있다.
assert.ok(Terrain.ICE_SLOW.floor >= 0.25 && Terrain.ICE_SLOW.floor < 0.5, '얼음 속 속도는 3분의 1쯤이어야 함');

console.log(`v85 ice escape unit ok · 비껴가기 ${angles.length}방향 · 얼음 속 속도 ${Terrain.ICE_SLOW.floor}`);
