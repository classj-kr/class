// 학급 순위전은 늘 열어 두는 버튼이다.
//
// 반마다 공개 여부를 정하는 버튼도 아니고, 전체 사용 중지를 걸 버튼도 아니다.
// 공개 설정 모드에서 눌러도 서버에 아무것도 보내지 않고, 잠금 표시도 붙지 않는다.
// 이 검사는 첫 화면 코드가 그 약속을 지키는지 글자로 확인한다.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const indexHtml = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");

// 1. 버튼에 표가 붙어 있어야 한다.
const raceLink = indexHtml.match(/<a[^>]*href="learning\/class-race\/"[^>]*>/);
assert.ok(raceLink, "학급 순위전 링크를 찾지 못했다.");
assert.match(raceLink[0], /data-always-open="true"/,
  "학급 순위전은 늘 열어 두는 버튼으로 표시해야 한다.");

// 2. 잠금 표시를 그리는 곳에서 먼저 걸러야 한다.
assert.match(indexHtml, /hubLinks\.forEach\(\(link\) => \{[\s\S]{0,400}?link\.dataset\.alwaysOpen === 'true'/,
  "잠금 표시를 그릴 때 늘 열어 두는 버튼을 먼저 걸러야 한다.");

// 3. 우리 반 공개 설정과 전체 사용 중지, 두 모드 모두에서 눌러도 저장하지 않아야
//    한다. 두 곳 다 막았는지 세어 본다.
const guards = indexHtml.match(/selectedLink\.dataset\.alwaysOpen === 'true'/g) || [];
assert.equal(guards.length, 2,
  "우리 반 공개 설정과 전체 사용 중지 두 곳 모두에서 늘 열어 두는 버튼을 걸러야 한다.");

// 4. 거른 자리가 저장 요청보다 앞에 있어야 한다. 뒤에 있으면 이미 보낸 뒤다.
//    묶음 버튼(하위 메뉴를 함께 여는 상위 버튼)을 다루는 곳에도 같은 주소가 나오니,
//    링크 하나를 다루는 두 가지 만 잘라서 본다.
for (const [marker, api] of [
  ['if (globalContentAccessEditing && selectedLink', '/api/admin/home-content-access'],
  ['if (contentAccessEditing && selectedLink', '/api/teacher/home-content-access']
]) {
  const at = indexHtml.indexOf(marker);
  assert.ok(at > -1, marker + ' 를 찾지 못했다.');
  const block = indexHtml.slice(at, at + 1600);
  const guardAt = block.indexOf("selectedLink.dataset.alwaysOpen === 'true'");
  const apiAt = block.indexOf(api);
  assert.ok(guardAt > -1, api + ' 를 다루는 곳에 거르는 자리가 없다.');
  assert.ok(apiAt > -1, api + ' 를 그 자리에서 찾지 못했다.');
  assert.ok(guardAt < apiAt, api + ' 로 저장하기 전에 늘 열어 두는 버튼을 걸러야 한다.');
}

console.log("Class race always open contract: OK");
