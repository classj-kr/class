const assert = require('node:assert/strict');
const fs = require('node:fs');

const curriculum = fs.readFileSync('references/moe/2022-revised-curriculum/extracted/09-science.txt', 'utf8');
const catalog = fs.readFileSync('learning/inquiry/science-lab/index.html', 'utf8');
const elementaryPage = fs.readFileSync('learning/inquiry/science-lab/circuit-bulbs/index.html', 'utf8');
const elementaryApp = fs.readFileSync('learning/inquiry/science-lab/circuit-bulbs/app.js', 'utf8');
const middlePage = fs.readFileSync('learning/inquiry/science-lab/ohms-law/index.html', 'utf8');

assert.match(curriculum, /\[6과15-01\][^\r\n]*전지와 전구, 전선을 연결/);
assert.match(curriculum, /\[6과15-02\][^\r\n]*전지 한 개[^\r\n]*전지 두 개를 직렬연결/);
assert.match(curriculum, /\[6과15-03\][^\r\n]*전자석/);
assert.match(curriculum, /전구의 직렬연결과 병렬연결은 다루지 않고/);
assert.match(curriculum, /전지의 연결 방향에 따라 전자석의 극이 달라지는 현상/);
assert.match(curriculum, /영구 자석과의 차이를 비교/);
assert.match(curriculum, /\[9과14-03\][^\r\n]*저항의 직렬연결과 병렬연결/);

assert.match(catalog, /data-standards="6과15-01 6과15-02 6과15-03" href="circuit-bulbs\/"/);
assert.match(catalog, /href="circuit-bulbs\/"[^>]*><b>초6<\/b><span>전기 회로와 전자석<\/span>/);
assert.match(catalog, /data-standards="9과14-02 9과14-03" href="ohms-law\/"/);
assert.match(catalog, /전류·전압·저항 — 직렬·병렬/);

assert.match(elementaryPage, /data-curriculum-standards="6과15-01 6과15-02 6과15-03"/);
assert.match(elementaryPage, /직렬로 연결한 전지 수/);
assert.match(elementaryPage, /min="1" max="2"/);
assert.match(elementaryPage, /data-circuit="closed"/);
assert.match(elementaryPage, /data-circuit="open"/);
assert.match(elementaryPage, /data-direction="forward"/);
assert.match(elementaryPage, /data-direction="reverse"/);
assert.match(elementaryPage, /id="powerBtn"/);
assert.match(elementaryPage, /id="compareBtn"/);
assert.match(elementaryPage, /전자석 사용 사례/);
assert.doesNotMatch(elementaryPage, /전구를 직렬|전구를 병렬|전구 수/);

assert.match(elementaryApp, /function circuitState\(\)/);
assert.match(elementaryApp, /function magnetState\(\)/);
assert.match(elementaryApp, /leftPole/);
assert.match(elementaryApp, /rightPole/);
assert.match(elementaryApp, /magnetPower/);
assert.match(elementaryApp, /comparePermanent/);
assert.doesNotThrow(() => new Function(elementaryApp));

assert.match(middlePage, /저항의 직렬·병렬 연결/);
assert.match(middlePage, /data-wiring="series"/);
assert.match(middlePage, /data-wiring="parallel"/);

console.log('science lab 2022 curriculum contract: validated');
