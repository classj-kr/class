'use strict';
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const root = path.join(__dirname, '..');
const cities = JSON.parse(fs.readFileSync(path.join(root, 'data', 'catalog', 'original-cities.json'), 'utf8'));
const catalog = JSON.parse(fs.readFileSync(path.join(root, 'public', 'data', 'library-books.json'), 'utf8'));
const student = fs.readFileSync(path.join(root, 'public', 'index.html'), 'utf8');
const server = fs.readFileSync(path.join(root, 'server.js'), 'utf8');
const finalQuiz = require(path.join(root, 'lib', 'final-quiz.js'));

assert.equal(cities.length, 229, '원작 225곳 + 새로 넣은 4곳');
assert.equal(cities.filter((city) => city.hasLibrary).length, 40, '원작 자료의 역사적 도서관 표시는 40곳으로 보존한다');
const liveCities = cities.filter((city) => !city.retired);
assert.equal(catalog.version, 80);
assert.equal(catalog.libraryCityCount, liveCities.length);
assert.equal(catalog.books.length, 109);
assert.equal(catalog.sectionCount, catalog.books.reduce((sum, book) => sum + book.sections.length, 0));
assert.equal(catalog.collections.length, 13);

const common = catalog.books.filter((book) => book.shelves.includes('공통'));
assert.equal(common.length, 5);
const collectionByLabel = new Map(catalog.collections.map((collection) => [collection.label, collection]));
const assigned = new Set();
const kilwa = cities.find((city) => city.name === '킬와');

assert.ok(kilwa, '킬와 도시 자료를 찾을 수 있어야 한다');
assert.equal(kilwa.region, '동아프리카', '킬와의 실제 지역은 동아프리카여야 한다');

for (const city of liveCities) {
  const shelf = finalQuiz.libraryShelfForCity(city);
  assert.notEqual(shelf, '공통', `${city.name}에 지역 장서가 배정되지 않았다`);
  const collection = collectionByLabel.get(shelf);
  assert.ok(collection, `${city.name}의 ${shelf} 장서 묶음을 찾지 못했다`);
  assert.ok(collection.cityIds.includes(city.id), `${city.name}이 ${shelf} 도서관 목록에 없다`);
  assert.ok(!assigned.has(city.id), `${city.name}이 여러 도서관 묶음에 중복 배정됐다`);
  assigned.add(city.id);
  const regional = catalog.books.filter((book) => book.shelves.includes(shelf));
  assert.equal(regional.length, 8, `${shelf} 지역 장서는 8권이어야 한다`);
  assert.equal(new Set([...regional, ...common].map((book) => book.id)).size, 13, `${city.name} 도서관은 13권이어야 한다`);
}
assert.equal(assigned.size, liveCities.length);
assert.equal(catalog.collections.reduce((sum, collection) => sum + collection.cityIds.length, 0), liveCities.length);
const shelfOf = (name) => finalQuiz.libraryShelfForCity(cities.find((city) => city.name === name));
assert.equal(shelfOf('팀북투'), '서아프리카');
assert.equal(shelfOf('킬와'), '동아프리카');
assert.equal(shelfOf('말라카'), '동남아시아');
assert.equal(shelfOf('모스크바'), '동유럽');
assert.equal(shelfOf('카이로'), '중근동·북아프리카');
for (const book of catalog.books) {
  for (const text of [book.intro, ...book.sections.map((section) => section.text)]) {
    if (book.shelves.some((shelf) => ['서아프리카', '동아프리카', '동남아시아', '동유럽'].includes(shelf))) assert.match(text.trim(), /\.$/, `${book.id}: 문장이 마침표로 끝나야 한다`);
  }
}

assert.match(student, /const LIBRARY_SHELF_BY_REGION=Object\.freeze/);
assert.match(student, /function libraryRegionLabelForCity\(city\)\{return String\(city\?\.region\|\|city\?\.libraryRegion\|\|'공통'\)\}/);
// 도시 단추는 좁은 화면에서 잘리지 않게 '도서관'만 쓰고, 어느 지역 도서관인지는 열린 창 제목에서 보여 준다.
assert.match(student, /libraryBtn\.textContent='도서관'/);
assert.match(student, /libraryTitle\.textContent=`\$\{serverSelf\?\.currentCityName\|\|'도시'\} 도서관 · \$\{regionLabel\}`/);
assert.doesNotMatch(student, /libraryTitle\.textContent=`[^`]*\$\{shelfLabel\}`/);
assert.match(student, /return \{\.\.\.catalogCity,libraryRegion:libraryShelfForCity\(catalogCity\),hasLibrary:true\}/);
assert.match(student, /libraryBtn\.hidden=false/);
assert.match(student, /book\.shelves\.includes\(shelf\)/);
assert.doesNotMatch(student, /이 도시는 원작 기준 도서관이 없습니다/);
assert.match(student, /fetch\('\/learn\/world-voyage\/data\/library-books\.json\?v=80'/);
assert.match(server, /hasLibrary: true/);
assert.match(server, /libraryRegion: FinalQuiz\.libraryShelfForCity\(place\)/);
assert.match(server, /facilities: \[\.\.\.new Set/);

console.log(JSON.stringify({
  ok: true,
  libraryCities: assigned.size,
  collections: catalog.collections.map((collection) => ({ label: collection.label, cities: collection.cityIds.length })),
  booksPerLibrary: 13
}));
