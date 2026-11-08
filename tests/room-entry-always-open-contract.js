// 방번호 입구은 늘 열어 두는 버튼이다.
//
// 반마다 공개 여부를 정하는 버튼도 아니고, 전체 사용 중지를 걸 버튼도 아니다.
// 공개 설정 모드에서 눌러도 서버에 아무것도 보내지 않고, 잠금 표시도 붙지 않는다.
// 이 검사는 첫 화면 코드가 그 약속을 지키는지 글자로 확인한다.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const indexHtml = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");

// 1. 버튼에 표가 붙어 있어야 한다.
const raceLink = indexHtml.match(/<a[^>]*href="\/room\/"[^>]*>/);
assert.ok(raceLink, "방번호 입구 링크를 찾지 못했다.");
assert.match(raceLink[0], /data-always-open="true"/,
  "방번호 입구은 늘 열어 두는 버튼으로 표시해야 한다.");

// One shared handler protects the room link in both settings modes.
assert.match(indexHtml, /const configurable = link\.dataset\.alwaysOpen !== 'true'/);
assert.match(indexHtml, /if \(!selectedLink \|\| selectedLink\.dataset\.alwaysOpen === 'true'\) return;[\s\S]*?api\(global \? '\/api\/admin\/home-content-access' : '\/api\/teacher\/home-content-access'/);
console.log("Room entry always open contract: OK");
