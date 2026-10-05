import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

// 관용구·속담처럼 공용 진행기(assets/learning-lesson.js)를 쓰는 차시 화면을 브라우저 없이 띄우는 도우미.
// pageDir 은 저장소 뿌리 기준 상대 경로로, 끝에 빗금을 붙인다(보기: "learning/literacy-numeracy/proverbs/").
// 차시 화면을 브라우저 없이 띄운다. index.html이 부르는 차례대로 이 앱의 파일과
// 공용 진행기(assets/learning-lesson.js)를 그대로 돌리고, 화면 요소와 학습 기록만 흉내 낸다.
// (2026-10-02 문제 내기·차시 목록·완료 표시가 app.js에서 공용 진행기로 옮겨 갔다.)
export async function openLessonPage(pageDir, sessions = []) {
  const html = fs.readFileSync(pageDir + "index.html", "utf8");
  const element = (extra = {}) => ({
    hidden: false, textContent: "", dataset: {}, children: [],
    classList: { add() {}, remove() {}, toggle() {} },
    append(...kids) { this.children.push(...kids); },
    replaceChildren(...kids) { this.children = kids; },
    setAttribute() {}, removeAttribute() {}, addEventListener() {},
    ...extra
  });
  const byId = new Map();
  const tabs = (name) => Array.from(
    html.matchAll(new RegExp(`class="${name}-tab[^"]*" data-${name}="([^"]+)"`, "g")),
    (match) => element({ dataset: { [name]: match[1] } })
  );
  const groups = { ".mode-tab": tabs("mode"), ".language-tab": tabs("language") };
  const page = {
    saves: [], results: 0,
    byId: (id) => sandbox.document.getElementById(id),
    tab: (selector, value) => groups[selector].find((tab) => Object.values(tab.dataset).includes(value)),
    lessonButtons: () => page.byId("lessonList").children
  };
  const records = {
    ready: Promise.resolve(),
    history: async () => ({ sessions, nextOffset: null }),
    start: async (session) => { page.session = session; return session; },
    save: async (payload) => { page.saves.push(payload); },
    showResult() { page.results += 1; }
  };
  const sandbox = {
    console, URLSearchParams, location: { search: "" },
    addEventListener() {},
    LearningRecords: { create: () => records },
    document: {
      body: element(),
      createElement: () => element(),
      // 실제 화면과 같이 index.html에 없는 id는 null로 돌려준다.
      getElementById(id) {
        if (!html.includes(`id="${id}"`)) return null;
        if (!byId.has(id)) byId.set(id, element());
        return byId.get(id);
      },
      querySelector: () => null,
      querySelectorAll: (selector) => groups[selector] || []
    }
  };
  sandbox.window = sandbox;
  vm.createContext(sandbox);
  for (const [, src] of html.matchAll(/<script src="([^"]+)"/g)) {
    const file = src.split("?")[0];
    // 배경 음악과 실제 기록 저장은 이 검사와 상관없다. 기록은 위의 흉내로 갈음한다.
    if (file.includes("/assets/sound/") || file.endsWith("/learning-records.js")) continue;
    const filePath = file.startsWith("/") ? file.slice(1) : pageDir + file;
    vm.runInContext(fs.readFileSync(filePath, "utf8"), sandbox, { filename: filePath });
    if (file.endsWith("/learning-lesson.js")) {
      const run = sandbox.runRecordedLessons;
      page.run = run;
      sandbox.runRecordedLessons = (config) => { page.config = config; page.ready = run(config); return page.ready; };
    }
  }
  assert.ok(page.ready, "app.js가 공용 진행기를 불러야 합니다");
  await page.ready;
  return page;
}
