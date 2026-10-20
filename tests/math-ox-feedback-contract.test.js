const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const root = path.join(__dirname, "..");
const app = fs.readFileSync(
  path.join(root, "learning", "literacy-numeracy", "math-bank", "concept-ox-view.js"),
  "utf8"
);
const dataSource = fs.readFileSync(
  path.join(root, "learning", "literacy-numeracy", "math-ox", "data.js"),
  "utf8"
);
const index = fs.readFileSync(
  path.join(root, "learning", "literacy-numeracy", "math-bank", "index.html"),
  "utf8"
);

function loadQuestions() {
  const marker = "window.MATH_OX_DATA = ";
  const start = dataSource.indexOf(marker);
  const end = dataSource.indexOf("\n];", start);
  return vm.runInNewContext(`(${dataSource.slice(start + marker.length, end + 2)})`, Object.create(null));
}

test("통합 OX의 단원 선택과 문항 결과음은 구분한다", () => {
  assert.match(index, /concept-ox-view\.js/);
  assert.match(app, /list\.dataset\.sfxFeedback = 'none'/);
  assert.doesNotMatch(index, /<select[^>]+data-sfx="none"/);
});

test("답 버튼은 클릭음 대신 정답 여부에 맞는 결과음만 재생한다", () => {
  assert.match(app, /\['O', 'X'\]/);
  assert.match(app, /button\.dataset\.sfx = 'none'/);
  assert.match(app, /ClassGameSfx\?\.play\(correct \? 'success' : 'error'\)/);
});

test("세 자리 수 덧셈 문항은 자연스러운 문장과 읽기 쉬운 예시를 쓴다", () => {
  const question = loadQuestions().find((item) => item.id === 277);
  assert.equal(question.prompt, "두 개의 세 자리 수를 더하면, 그 합도 세 자리 수이다.");
  assert.match(question.reason, /999\+999=1998/);
  assert.doesNotMatch(question.prompt, /두 세 자리 수/);
});
