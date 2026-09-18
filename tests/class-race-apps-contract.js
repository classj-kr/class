// 학급 순위전에 낼 수 있는 앱들의 문제 묶음 검사.
//
// 앱을 붙일 때 실수하는 자리는 늘 같다. 보기 수가 넘거나, 정답이 보기에 없거나,
// 문장이 서버가 받는 길이를 넘거나, 차시 하나가 한 판에 낼 수 있는 수를 넘는다.
// 그래서 이 검사는 글자만 보지 않고 변환기를 실제로 돌려 나온 문제를 잰다.
// 브라우저가 없으므로 window·document·fetch 를 흉내 내어 apps.js 를 돌린다.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.join(__dirname, "..");
const appsSource = fs.readFileSync(path.join(root, "learning", "class-race", "apps.js"), "utf8");
// 한 판에 낼 수 있는 문제 수는 서버(quizrace.js)가 정한다. 여기에 다시 적지 않고 읽어 온다.
const { MAX_QUESTIONS } = require(path.join(root, "game-hub-server", "quizrace.js"));
assert.ok(Number.isInteger(MAX_QUESTIONS) && MAX_QUESTIONS > 0, "서버에서 한 판의 문제 수 상한을 찾지 못했다.");

// 서버가 문제를 받아 줄 때 쓰는 잣대(quizrace.js 의 cleanQuestion)와 같은 값이어야 한다.
const LIMITS = { id: 80, category: 40, prompt: 120, sentence: 400, choice: 120 };
const ID_PATTERN = /^[a-z0-9_:-]+$/i;

const sandbox = { console };
sandbox.window = sandbox;
sandbox.globalThis = sandbox;
sandbox.document = { createElement: () => ({}), head: { append() {} } };
sandbox.__loadLocalScript = (url) => {
  const file = path.join(root, url.replace(/^\//, "").split("?")[0]);
  assert.ok(fs.existsSync(file), `앱이 부르는 파일이 없다: ${url}`);
  vm.runInContext(fs.readFileSync(file, "utf8"), sandbox, { filename: file });
};
sandbox.fetch = async (url) => {
  const file = path.join(root, url.replace(/^\//, "").split("?")[0]);
  assert.ok(fs.existsSync(file), `앱이 부르는 파일이 없다: ${url}`);
  return { ok: true, json: async () => JSON.parse(fs.readFileSync(file, "utf8")) };
};
vm.createContext(sandbox);

// script 태그를 붙이는 대신 그 자리에서 파일을 읽어 돌린다.
const patched = appsSource.replace(
  'const script = document.createElement("script");',
  "__loadLocalScript(url); resolve(); return;"
);
assert.notEqual(patched, appsSource, "apps.js 가 script 태그로 자료를 부르는 자리를 찾지 못했다.");
vm.runInContext(patched, sandbox, { filename: "apps.js" });

const registry = sandbox.window.ClassRaceApps;
assert.ok(registry, "ClassRaceApps 를 만들지 못했다.");

// 국어만 있던 목록을 넓혔다. 줄어들면 알아채야 한다.
const EXPECTED = ["spelling", "proverbs", "idioms", "cci", "hanja", "mathox", "english"];
// 흉내 낸 창에서 온 배열이라 deepEqual 은 모양이 같아도 어긋난다. 글자로 견준다.
const listed = registry.list();
assert.equal(listed.map((app) => app.id).join(" "), EXPECTED.join(" "),
  "앱 목록이 달라졌다. 뺐다면 이 줄도 함께 고칠 것.");
listed.forEach((app) => {
  assert.ok(app.title && app.title.length <= 12, `앱 이름이 비었거나 너무 길다: ${app.id}`);
});

(async () => {
  let grandTotal = 0;
  for (const info of listed) {
    const bank = await registry.load(info.id);
    const questions = [...bank.questions.values()];
    assert.ok(questions.length >= 100, `${info.title}: 문항이 ${questions.length}개뿐이다.`);
    grandTotal += questions.length;

    for (const question of questions) {
      const where = `${info.title} ${question.id}`;
      assert.match(String(question.id), ID_PATTERN, `${where}: id 에 쓸 수 없는 글자가 있다.`);
      assert.ok(String(question.id).length <= LIMITS.id, `${where}: id 가 길다.`);
      assert.ok(question.sentence && question.sentence.length <= LIMITS.sentence, `${where}: 문장이 비었거나 길다.`);
      assert.ok((question.prompt || "").length <= LIMITS.prompt, `${where}: 물음말이 길다.`);
      assert.ok((question.category || "").length <= LIMITS.category, `${where}: 갈래 이름이 길다.`);
      assert.ok(question.choices.length >= 2 && question.choices.length <= 4, `${where}: 보기가 ${question.choices.length}개다.`);
      assert.ok(question.choices.every((choice) => choice && choice.length <= LIMITS.choice), `${where}: 보기가 비었거나 길다.`);
      assert.equal(new Set(question.choices).size, question.choices.length, `${where}: 보기가 겹친다.`);
      assert.ok(question.choices.includes(question.answer), `${where}: 정답이 보기에 없다.`);
    }

    for (const lesson of bank.lessons) {
      assert.ok(lesson.ids.length > 0, `${info.title} ${lesson.title}: 빈 차시다.`);
      assert.ok(lesson.ids.length <= MAX_QUESTIONS,
        `${info.title} ${lesson.title}: ${lesson.ids.length}문제라 한 판(${MAX_QUESTIONS}문제)에 다 못 낸다.`);
      lesson.ids.forEach((id) => {
        assert.ok(bank.questions.has(id), `${info.title} ${lesson.title}: 없는 문제를 가리킨다 (${id}).`);
      });
    }
  }

  assert.ok(grandTotal >= 5000, `모든 앱을 합쳐 ${grandTotal}문항뿐이다.`);
  console.log(`Class race apps contract: OK (${listed.length}개 앱 · ${grandTotal}문항)`);
})();
