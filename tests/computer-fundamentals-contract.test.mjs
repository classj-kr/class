import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import vm from "node:vm";

const read = (relativePath) => fs.readFileSync(new URL(`../${relativePath}`, import.meta.url), "utf8");
const exists = (relativePath) => fs.existsSync(new URL(`../${relativePath}`, import.meta.url));
const courseRoot = "learning/inquiry/information-computing/computer-fundamentals";
const portal = read("index.html");
const coursePage = read(`${courseRoot}/index.html`);
const lessonPage = read(`${courseRoot}/lessons/index.html`);
// 차시마다 제 파일만 받도록 쪼개 두었다. 검사는 예전처럼 앱 전체를 한 덩어리로 놓고 본다.
const labsDir = new URL(`../${courseRoot}/lessons/labs/`, import.meta.url);
const labFiles = fs.readdirSync(labsDir).sort();
const readLabs = (extension) => labFiles
  .filter((file) => file.endsWith(extension))
  .map((file) => read(`${courseRoot}/lessons/labs/${file}`))
  .join("\n");
const detailDir = new URL(`../${courseRoot}/lessons/detail/`, import.meta.url);
const detailFiles = fs.readdirSync(detailDir).sort();
const detailSource = detailFiles.map((file) => read(`${courseRoot}/lessons/detail/${file}`)).join("\n");
const conceptLabSource = `${read(`${courseRoot}/lessons/lab-shared.js`)}\n${readLabs(".js")}`;
const lessonSource = `${read(`${courseRoot}/lessons/shell.js`)}\n${detailSource}\n${conceptLabSource}`;
const lessonStyles = `${read(`${courseRoot}/lessons/shell.css`)}\n${readLabs(".css")}`;
const systemLessonStyles = lessonStyles;
const conceptLabStyles = lessonStyles;
const curriculum = read(`${courseRoot}/CURRICULUM.md`);
const glossary = read(`${courseRoot}/GLOSSARY-KO-EN.md`);
const foundationFiles = [
  "foundation-core.js",
  "lab-shared.js",
  ...labFiles.filter((file) => file.endsWith(".js")).map((file) => `labs/${file}`),
  "foundation-compact.js",
  // 다시 쓴 문항은 차시별 파일에 흩어져 있다. 검사에서는 모두 읽어 원래 문항 위에 덮는다.
  ...fs.readdirSync(new URL(`../${courseRoot}/lessons/reviews/`, import.meta.url)).sort().map((file) => `reviews/${file}`),
  "foundation-b.js",
  "foundation-c.js",
  "foundation-d.js",
  "foundation-e.js",
  "foundation-fg.js",
  "foundation-h.js",
  "foundation-ij.js"
];
const foundationSources = foundationFiles.map((file) => read(`${courseRoot}/lessons/${file}`));
const context = vm.createContext({ window: {} });
for (let index = 0; index < foundationFiles.length; index += 1) {
  vm.runInContext(foundationSources[index], context, { filename: foundationFiles[index] });
}
const generatedLessons = context.window.COMPUTER_FOUNDATION_LESSONS;
const detailedContext = vm.createContext({
  window: {},
  document: { body: { dataset: { courseRoot: "true" } } },
  a04ConversionMarkup: () => '<section data-a04-lab="concept"></section>',
  a05DigitizerMarkup: () => '<section data-a05-lab="concept"></section>'
});
detailedContext.window.COMPUTER_IMAGE_ASSET = (name) => `assets/images/${name}`;
detailedContext.window.COMPUTER_A04 = { markup: () => '<section data-a04-lab="concept"></section>' };
detailedContext.window.COMPUTER_A05 = { markup: () => '<section data-a05-lab="concept"></section>' };
for (const file of detailFiles) {
  vm.runInContext(read(`${courseRoot}/lessons/detail/${file}`), detailedContext, { filename: file });
}
const detailedLessons = detailedContext.window.COMPUTER_DETAILED_LESSONS;
assert.equal(detailedLessons.length, 6, "앞 여섯 차시가 제 파일에서 읽혀야 합니다");
const allLessons = [...detailedLessons, ...generatedLessons].sort((left, right) => left.number - right.number);
for (const [lessonId, questionIndex, question] of context.window.COMPUTER_REVIEWED_QUESTIONS || []) {
  const target = allLessons.find((lesson) => lesson.id === lessonId);
  if (target?.questions?.[questionIndex]) {
    const concept = target.number <= 6 ? target.questions[questionIndex].concept : question.concept;
    target.questions[questionIndex] = { ...question, concept };
  }
}
const componentImages = ["cpu", "ram", "gpu", "ssd", "hdd", "motherboard", "psu", "cooling"];
const childishAbsoluteTrap = /무조건|항상|전부 다|모든|자동으로|저절로|오직|친구만|정보만|동안에만|RAM에만|화면에만|파일만|이름만|주소만|기기에서만|한 번만/;

test("the information and computing menu keeps both course links", () => {
  assert.match(portal, /data-access-group="information-computing"/);
  assert.match(portal, /learning\/inquiry\/information-computing\/computer-fundamentals\//);
  assert.match(portal, /learning\/inquiry\/information-computing\/typing\//);
  assert.doesNotMatch(portal, /learning\/basics\/typing\//);
  assert.match(portal, /rel="icon" href="favicon\.ico"/);
  assert.match(coursePage, /rel="icon" href="\.\.\/\.\.\/\.\.\/\.\.\/favicon\.ico"/);
  assert.match(lessonPage, /rel="icon" href="\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/favicon\.ico"/);
});

test("typing practice returns to its own menu before leaving the page", () => {
  const typingPage = read("learning/inquiry/information-computing/typing/index.html");
  const typingScript = read("learning/inquiry/information-computing/typing/app.js");
  assert.match(typingScript, /sitebackrequest[^\n]+if\(\$\('#typingHome'\)\.hidden\)/);
  assert.doesNotMatch(typingScript, /sitebackrequest[^\n]+if\(!\$\('#typingHome'\)\.hidden\)/);
  assert.match(typingPage, /app\.js\?v=20260910-fix-back-navigation/);
});

test("the first lesson names the process directly without promotional copy", () => {
  const firstLesson = detailedLessons.find((lesson) => lesson.id === "a01");
  assert.equal(firstLesson.workedExample.title, "입력부터 저장까지의 처리 과정");
  assert.equal(firstLesson.workedExample.intro, "카메라로 들어온 데이터는 처리된 뒤 화면에 출력되고 파일로 저장됩니다.");
  assert.doesNotMatch(JSON.stringify(firstLesson.workedExample), /1초|외울 네 단어|One Second/);
});
test("the 36-lesson core course is loaded in dependency order", () => {
  assert.equal(generatedLessons.length, 30);
  assert.equal(new Set(generatedLessons.map((lesson) => lesson.id)).size, 30);
  for (const id of ["a01", "a02", "a03", "a04", "a05", "b01"]) {
    assert.match(lessonSource, new RegExp(`id: "${id}"`));
  }
  for (const id of ["b02", "c01", "d01", "e01", "f01", "g01", "h01", "i01", "j03"]) {
    assert.ok(generatedLessons.some((lesson) => lesson.id === id), `${id} should be generated`);
  }
  assert.match(lessonSource, /window\.COMPUTER_DETAILED_LESSONS[\s\S]{0,160}window\.COMPUTER_FOUNDATION_LESSONS/);
  assert.match(lessonSource, /window\.COMPUTER_LESSON_INDEX/);
  assert.match(lessonPage, /id="lessonTitle"/);
  // 첫 화면은 차시 목록이다. 차례표와 목록 그리는 것만 받고 차시 내용은 하나도 받지 않는다.
  assert.match(coursePage, /id="lessonList" class="course-modules"/);
  assert.doesNotMatch(coursePage, /id="lessonTitle"/);
  assert.match(coursePage, /<script src="lessons\/index-data\.js\?v=[^"]*" defer><\/script>/);
  assert.match(coursePage, /<script src="lessons\/course-index\.js\?v=[^"]*" defer><\/script>/);
  assert.equal((coursePage.match(/<script /g) || []).length, 2, "첫 화면은 차례표와 목록 그리는 것만 부른다");
  assert.match(read(`${courseRoot}/lessons/index-data.js`), /window\.COMPUTER_CORE_MODULES/);
  // 차시 화면은 boot.js 한 줄만 두고, 그 차시에 필요한 파일은 boot.js가 차례대로 넣는다.
  assert.match(lessonPage, /<script src="[^"]*boot\.js\?v=/);
  assert.equal((lessonPage.match(/<script /g) || []).length, 1, "차시 화면은 boot.js 하나만 부른다");
  const boot = read(`${courseRoot}/lessons/boot.js`);
  const order = ["foundation-core.js", "index-data.js", "lab-shared.js", "shell.js"];
  let cursor = -1;
  for (const file of order) {
    const at = boot.indexOf(file);
    assert.ok(at > cursor, `${file}이 차례를 지켜야 합니다`);
    cursor = at;
  }
});

test("all generated lessons except the direct manipulation lesson use a specific concept visual", () => {
  // 차시마다 제 그림 파일을 하나씩 가진다. h04만 예전 그림 코드를 그대로 쓴다.
  const expectedIds = Array.from(generatedLessons, (lesson) => lesson.id).sort();
  const labIds = labFiles.filter((file) => file.endsWith(".js")).map((file) => file.replace(".js", ""));
  for (const id of expectedIds) {
    assert.ok(labIds.includes(id), `${id} needs its own lab file`);
  }
  for (const lesson of generatedLessons.filter((item) => item.id !== "d01")) {
    assert.match(lesson.visual, new RegExp(`visual-${lesson.id}`), `${lesson.id} needs its own concept diagram`);
    assert.doesNotMatch(lesson.visual, /concept-relationship-board/, `${lesson.id} must not fall back to the generic card board`);
  }
  const mobileLesson = generatedLessons.find((lesson) => lesson.id === "b02");
  assert.match(mobileLesson.visual, /smartphone-internals-exploded-768\.webp/);
  assert.match(mobileLesson.visual, /tablet-internals-exploded-768\.webp/);
  for (const selector of [
    ".lesson-specific-figure", ".visual-process", ".file-explorer", ".network-map",
    ".context-illustration", ".os-workbench", ".gesture-lab", ".display-lab", ".image-workbench",
    ".browser-state-lab", ".answer-journey-scene", ".debug-lab", ".media-capture-lab",
    ".actual-compression-lab"
  ]) {
    assert.ok(lessonStyles.includes(selector), `${selector} needs visual styling`);
  }
});

test("all 36 lessons use an illustration, a task simulation, or direct manipulation instead of one repeated card pattern", () => {
  const directManipulation = [
    "a01", "a02", "a03", "a04", "a05", "b01", "b02", "b03", "c01", "c02", "c03", "c04", "d01", "d02", "d03", "e01", "e02", "e03", "e04", "e05", "f01", "f02", "f03",
    "g01", "g02", "g03", "h01", "h02", "h03", "h04", "h05", "i01", "i02", "j01", "j02", "j03"
  ];
  const illustratedSequence = [];
  const concreteModel = [];
  const covered = [...directManipulation, ...illustratedSequence, ...concreteModel].sort();
  assert.deepEqual(covered, Array.from(allLessons, (lesson) => lesson.id).sort());
  const premiumSelectors = {
    b02: "data-mobile-anatomy", b03: "data-port-lab",
    c01: "data-request-relay", c02: "data-os-lab", c03: "data-program-lab", c04: "data-settings-lab",
    d01: "data-pointer-lab", d02: "data-gesture-lab", d03: "data-clipboard-lab",
    e01: "data-path-lab", e02: "data-format-lab", e03: "data-file-operation-lab", e04: "data-reference-lab", e05: "data-storage-lab",
    f01: "data-pixel-lab", f02: "data-color-lab", f03: "data-media-lab",
    g01: "data-sampling-lab", g02: "data-bit-lab", g03: "data-compression-lab",
    h01: "data-network-journey", h02: "data-request-lab", h03: "data-browser-lab", h05: "data-transfer-lab", i01: "data-account-lab",
    i02: "data-evidence-lab", j01: "data-algorithm-lab", j02: "data-control-lab", j03: "data-debug-lab"
  };
  const expectedPremium = [
    "b02", "b03", "c01", "c02", "c03", "c04", "d01", "d02", "d03", "e01", "e02", "e03", "e04", "e05", "f01", "f02",
    "f03", "g01", "g02", "g03", "h01", "h02", "h03", "h05", "i01", "i02", "j01", "j02", "j03"
  ].sort();
  assert.deepEqual(Array.from(context.window.COMPUTER_PREMIUM_VISUAL_IDS).sort(), expectedPremium);
  for (const [id, selector] of Object.entries(premiumSelectors)) {
    const lesson = generatedLessons.find((item) => item.id === id);
    assert.match(lesson.visual, new RegExp(selector), `${id} needs a task-specific visual lab`);
  }
  assert.match(conceptLabSource, /window\.COMPUTER_SETUP_CONCEPT_LABS/);
  assert.match(lessonSource, /window\.COMPUTER_SETUP_CONCEPT_LABS\?\.\(\)/);
  assert.match(conceptLabSource, /value="혜성의 꼬리는 왜 생길까\?"/, "H03 needs a working default search query");
  assert.match(conceptLabSource, /혜성의 꼬리는 어떻게 생길까\?/, "H03 needs a reliable comet result");
  assert.match(conceptLabSource, /혜성은 빨리 달려서 꼬리가 뒤로 생긴다/, "H03 needs a contrasting unsupported result");
  assert.match(conceptLabSource, /data-browser-suggestion="혜성"/, "H03 needs visible supported-topic controls");
  for (const selector of ["data-a01-lab", "data-a02-lab", "data-a03-lab", "data-a04-lab", "data-a05-lab"]) {
    assert.match(lessonSource, new RegExp(selector), `${selector} needs a direct foundation lab`);
  }
  for (const setupName of ["setupA01SignalLab", "setupA02CooperationLab", "setupA03CompatibilityLab", "setupA04ConversionLab", "setupA05DigitizerLab"]) {
    assert.match(lessonSource, new RegExp(`function ${setupName}\\(`), `${setupName} needs a stateful setup`);
  }
  const foundationIllustrations = {
    a01: "a01-input-process-output-storage-illustration-v1",
    a02: "a02-hardware-software-cooperation-illustration-v1",
    a03: "a03-device-os-app-layers-illustration-v1"
  };
  for (const [id, stem] of Object.entries(foundationIllustrations)) {
    const lesson = detailedLessons.find((item) => item.id === id);
    assert.match(lesson.visual, /foundation-context-figure/, `${id} needs a visible contextual illustration`);
    assert.match(lesson.visual, new RegExp(`${stem}-768\\.webp`), `${id} needs its 768px contextual illustration`);
    assert.match(lesson.visual, new RegExp(`${stem}-1536\\.webp`), `${id} needs its 1536px contextual illustration`);
  }
  assert.match(systemLessonStyles, /\.foundation-lab-heading\.has-context/);
  for (const stem of ["a04-analog-digital-representation-illustration-v1", "a05-sound-sampling-data-illustration-v1"]) {
    assert.match(lessonSource, new RegExp(`${stem}-768\\.webp`));
    assert.match(lessonSource, new RegExp(`${stem}-1536\\.webp`));
  }
  for (const selector of ["data-a04-capture", "data-a04-bin", "data-a05-rate", "data-a05-bits", "data-a05-code", "data-a05-total-bits"]) {
    assert.match(lessonSource, new RegExp(selector), `${selector} needs a visible state or control`);
  }
  const networkIllustrations = {
    h01: "h01-device-router-internet-illustration-v1",
    h02: "h02-browser-dns-server-journey-illustration-v1"
  };
  for (const [id, stem] of Object.entries(networkIllustrations)) {
    const lesson = generatedLessons.find((item) => item.id === id);
    assert.match(lesson.visual, /lab-context-figure/, `${id} needs a visible compact network illustration`);
    assert.match(lesson.visual, new RegExp(`${stem}-768\\.webp`), `${id} needs its 768px network illustration`);
    assert.match(lesson.visual, new RegExp(`${stem}-1536\\.webp`), `${id} needs its 1536px network illustration`);
  }
  assert.match(conceptLabStyles, /\.network-path-heading\.has-context/);
  for (const selector of ["data-reference-action", "data-account-name", "data-account-code", "data-permission-attempt", "data-privacy-audience", "data-license-purpose", "data-footprint-action", "data-screen-distance", "data-control-move", "data-control-robot", "data-control-score"]) {
    assert.match(conceptLabSource, new RegExp(selector), `${selector} needs a state-changing control`);
  }
  assert.match(conceptLabSource, /let runCount = 0;/, "J02 needs an execution counter independent from score and placeholder rows");
  assert.match(conceptLabSource, /const runNumber = \+\+runCount;/, "J02 must number failed and successful runs in one sequence");
  assert.match(conceptLabSource, /runCount = 0;\s*running = false;/, "J02 reset must clear its execution counter");
  const fullStackLesson = generatedLessons.find((item) => item.id === "h04");
  assert.match(fullStackLesson.visual, /data-stack-lab/);
  assert.match(fullStackLesson.visual, /data-stack-answer="3"/);
  assert.match(fullStackLesson.visual, /data-stack-request/);
  assert.match(fullStackLesson.visual, /data-stack-db-score/);
  assert.match(fullStackLesson.visual, /class="stack-state-evidence"/);
  assert.match(fullStackLesson.visual, /POST \/answers/);
  assert.match(fullStackLesson.visual, /data-stack-node="1,6"/);
  assert.match(fullStackLesson.visual, /data-stack-node="4"/);
  assert.doesNotMatch(fullStackLesson.visual, /class="full-stack-map"/);
  assert.match(lessonSource, /function setupConceptSequences\(\)/);
  assert.match(lessonSource, /function setupFullStackLab\(\)/);
  assert.match(lessonSource, /프론트엔드가 \{ answer \}라는 약속된 이름으로 답을 요청 봉투에 담아 서버로 보냈습니다/);
  assert.match(lessonStyles, /\.concept-overview\.has-stack-lab \{ grid-template-columns: 1fr; \}/);
  assert.match(lessonStyles, /\.stack-answer-choices/);
  assert.match(lessonStyles, /\.stack-database\.is-active/);
  assert.match(lessonStyles, /\.stack-state-evidence/);
  assert.doesNotMatch(lessonStyles, /\.lesson-specific-board \{[\s\S]{0,120}min-height: 330px/);
});

test("every generated lesson has substantive bilingual content, manipulation, and six questions", () => {
  for (const lesson of generatedLessons) {
    assert.ok(lesson.title && lesson.english, `${lesson.id} needs a bilingual title`);
    assert.ok(lesson.details.length >= 4, `${lesson.id} needs four concept explanations`);
    assert.ok(lesson.workedExample.steps.length >= 4, `${lesson.id} needs a four-step example`);
    assert.ok(lesson.comparisons.cards.length >= 4, `${lesson.id} needs four comparisons`);
    assert.equal(lesson.questions.length, 6, `${lesson.id} needs six scenario questions`);
    for (const question of lesson.questions) {
      assert.equal(question.options.length, 4, `${lesson.id} question needs four options`);
      assert.ok(question.answer >= 0 && question.answer < question.options.length);
      assert.ok(question.explanation.length >= 20, `${lesson.id} needs a reasoned explanation`);
      assert.doesNotMatch(question.options.join(" "), childishAbsoluteTrap);
    }
  }
});

test("all 36 lessons have complete render data without undefined text", () => {
  assert.equal(detailedLessons.length, 6);
  assert.equal(allLessons.length, 36);
  assert.deepEqual(allLessons.map((lesson) => lesson.number), Array.from({ length: 36 }, (_, index) => index + 1));
  assert.equal(new Set(allLessons.map((lesson) => lesson.id)).size, 36);
  const wrongQuizLengths = allLessons.filter((lesson) => lesson.questions.length !== 6).map((lesson) => `${lesson.id}:${lesson.questions.length}`);
  assert.deepEqual(wrongQuizLengths, [], "every lesson needs exactly six scenario questions");
  for (const lesson of allLessons) {
    assert.ok(lesson.title && lesson.english, `${lesson.id} needs a bilingual title`);
    assert.ok(lesson.conceptTitle, `${lesson.id} needs a relationship statement`);
    assert.match(lesson.conceptTitle, /니다\.$/, `${lesson.id} core principle must use polite student-facing Korean`);
    assert.ok(lesson.workedExample.steps.length >= 4, `${lesson.id} needs at least four operation steps`);
    for (const step of lesson.workedExample.steps) {
      assert.equal(step.length, 3, `${lesson.id} operation steps need title, English, and explanation`);
      assert.ok(step.every((value) => typeof value === "string" && value.trim() && value !== "undefined"));
      assert.match(step[1], /[A-Za-z]/, `${lesson.id} operation step needs an English label`);
      assert.doesNotMatch(step[1], /^Step \d+$/, `${lesson.id} needs a semantic English step label, not a number placeholder`);
    }
    assert.ok(lesson.comparisons.cards.length >= 4, `${lesson.id} needs four comparison cards`);
    for (const card of lesson.comparisons.cards) {
      assert.ok(card.length >= 3, `${lesson.id} comparison cards need three fields`);
      assert.ok(card.every((value) => value !== undefined && value !== "undefined"));
    }
    assert.doesNotMatch(JSON.stringify(lesson), /"undefined"/);
  }
  const mobileLesson = allLessons.find((lesson) => lesson.id === "b02");
  assert.equal(mobileLesson.deviceComparison.cards.length, 4);
  assert.equal(mobileLesson.activity.type, "none", "B02는 개념 화면의 실험 장치가 조작을 맡는다");
  for (const device of ["desktop-hardware-cutaway", "chromebook-internals-exploded", "tablet-internals-exploded", "smartphone-internals-exploded"]) {
    assert.ok(mobileLesson.deviceComparison.cards.some((card) => card.image.includes(device)));
  }
  const packetLesson = allLessons.find((lesson) => lesson.id === "h01");
  assert.ok(packetLesson.details.some((detail) => detail[1] === "Packet"), "H01 must define Packet before assessing it");
});

test("every lesson activity and assessment is internally consistent", () => {
  const itemIds = [];
  for (const lesson of allLessons) {
    assert.ok(["sort", "analog", "sampling", "none"].includes(lesson.activity?.type), `${lesson.id} uses an unknown activity type`);
    if (lesson.activity.type !== "none") {
      assert.ok(lesson.activity.title && lesson.activity.instruction && lesson.activity.success, `${lesson.id} activity needs complete directions and feedback`);
    }
    if (lesson.activity.type === "sort") {
      const categoryIds = new Set(lesson.activity.categories.map((category) => category.id));
      assert.ok(categoryIds.size >= 2, `${lesson.id} needs at least two activity categories`);
      assert.ok(lesson.activity.items.length >= 6, `${lesson.id} needs at least six draggable items`);
      for (const item of lesson.activity.items) {
        assert.ok(item.id && item.label && item.english, `${lesson.id} activity items need bilingual labels`);
        assert.ok(categoryIds.has(item.category), `${lesson.id}:${item.id} points to a missing category`);
      }
      assert.equal(new Set(lesson.activity.items.map((item) => item.id)).size, lesson.activity.items.length, `${lesson.id} activity item ids must be unique`);
    }
    const prompts = lesson.questions.map((question) => question.prompt || question.text);
    assert.ok(prompts.every(Boolean), `${lesson.id} questions need prompts`);
    assert.equal(new Set(prompts).size, lesson.questions.length, `${lesson.id} question prompts must be unique`);
    for (const question of lesson.questions) {
      const prompt = question.prompt || question.text;
      const term = question.term || question.concept;
      assert.equal(question.options.length, 4, `${lesson.id} question needs four choices`);
      assert.equal(new Set(question.options).size, 4, `${lesson.id} choices must be distinct`);
      assert.ok(Number.isInteger(question.answer) && question.answer >= 0 && question.answer < 4, `${lesson.id} needs a valid answer index`);
      assert.ok(term && question.explanation.length >= 20, `${lesson.id} needs a term and reasoned feedback`);
      assert.match(term, /[A-Za-z]/, `${lesson.id} question concept needs an English term`);
      assert.doesNotMatch(question.options.join(" "), childishAbsoluteTrap);
    }
  }

});

test("every referenced WebP lesson visual exists in the course assets", () => {
  const imageNames = [];
  const collectWebpAssets = (value) => {
    if (Array.isArray(value)) {
      value.forEach(collectWebpAssets);
      return;
    }
    if (value && typeof value === "object") {
      Object.values(value).forEach(collectWebpAssets);
      return;
    }
    if (typeof value !== "string") return;
    if (!value.includes("<") && /[A-Za-z0-9-]+\.webp$/.test(value)) {
      imageNames.push(value.match(/([A-Za-z0-9-]+\.webp)$/)[1]);
    }
    for (const match of value.matchAll(/(?:src|srcset)="[^"]*?([A-Za-z0-9-]+\.webp)/g)) {
      imageNames.push(match[1]);
    }
  };
  collectWebpAssets(allLessons);
  assert.ok(imageNames.length >= 20, "the lessons should use a substantial set of visual assets");
  for (const imageName of new Set(imageNames)) {
    assert.ok(exists(`${courseRoot}/assets/images/${imageName}`), `${imageName} should exist`);
  }
});
test("the curriculum presents ten progressive modules instead of an unimplemented outline", () => {
  for (const moduleCode of ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]) {
    assert.match(curriculum, new RegExp(`### ${moduleCode}\\.`));
  }
  assert.match(curriculum, /B02 \| 스마트폰과 태블릿의 구조/);
  assert.match(curriculum, /H04 \| 온라인 문제의 제출과 채점/);
  assert.match(curriculum, /J03 \| 프로그램 오류와 디버깅/);
  assert.match(lessonPage, /id="lessonList" class="course-modules"/);
  assert.match(lessonSource, /<details class="course-module"/);
  assert.match(lessonStyles, /\.course-module summary/);
});

test("every B01 component close-up is visible through an image tab and detailed panel", () => {
  for (const name of componentImages) {
    const asset = `${courseRoot}/assets/images/component-${name}-768.webp`;
    assert.ok(exists(asset), `${asset} should exist`);
    assert.match(lessonSource, new RegExp(`component-${name}-768\\.webp`));
  }
  assert.match(lessonSource, /class="component-tabs"/);
  assert.match(lessonSource, /<img src="\${part\.image}"/);
  assert.match(lessonSource, /Name and Origin/);
  assert.match(lessonStyles, /\.component-tabs button img/);
  assert.match(lessonStyles, /grid-auto-flow: column/);
  assert.match(lessonStyles, /overflow-x: auto/);
  assert.match(lessonSource, /showPart\(index, true\)/);
  assert.match(lessonSource, /partPanel\.scrollIntoView/);
});

test("activities support touch, pointer, and keyboard while feedback waits for submit", () => {
  assert.match(lessonSource, /document\.addEventListener\("pointermove", moveDrag/);
  assert.match(lessonSource, /탭 방식: 카드와 분류 칸을 차례로 누르기/);
  assert.match(lessonSource, /event\.key === "Enter" \|\| event\.key === " "/);
  assert.match(lessonSource, /submitAnswer\.addEventListener\("click"/);
  const submitHandler = lessonSource.slice(lessonSource.indexOf('submitAnswer.addEventListener("click"'));
  assert.match(submitHandler, /quizFeedback\.textContent = question\.explanation/);
  assert.match(lessonPage, /id="submitAnswer"[^>]*disabled>답 확인/);
});

test("lesson 13 teaches pointer states through direct manipulation before classification", () => {
  const lesson = allLessons.find((item) => item.id === "d01");
  assert.equal(lesson.title, "포인터·텍스트 커서·클릭·드래그는 어떻게 다를까?");
  assert.equal(lesson.english, "How Are the Pointer, Text Cursor, Click, and Drag Different?");
  assert.equal(lesson.workedExample.steps.length, 4);
  assert.equal(lesson.activity.type, "none", "D01은 개념 화면의 포인터 실험이 조작을 맡는다");
  assert.match(lessonSource, /function pointerConceptLabMarkup\(\)/);
  assert.match(lessonSource, /data-pointer-workspace/);
  assert.match(lessonSource, /data-demo-text/);
  assert.match(lessonSource, /data-demo-button/);
  assert.match(lessonSource, /data-demo-file/);
  assert.match(lessonSource, /data-demo-folder/);
  assert.match(lessonSource, /setPointerCapture/);
  assert.match(lessonSource, /folder\.addEventListener\("click"/);
  assert.doesNotMatch(coursePage, /id="startActivityTop"/);
  assert.doesNotMatch(lessonPage, /id="startActivityTop"/);
  assert.match(lessonStyles, /\.pointer-concept-lab/);
  assert.match(lessonStyles, /\.demo-file\.is-in-folder/);
  assert.match(lessonStyles, /grid-template-columns: repeat\(var\(--story-columns, 3\)/);
});

test("the primary Chromebook and iPad breakpoints preserve touch-sized controls", () => {
  assert.match(lessonStyles, /@media \(max-width: 800px\)/);
  assert.doesNotMatch(lessonStyles, /@media \(max-width: 760px\)/);
  assert.match(lessonStyles, /min-height: 44px/);
  assert.match(lessonStyles, /touch-action: none/);
  assert.match(lessonStyles, /\.sort-zone-grid \{ grid-template-columns: 1fr; \}/);
  assert.match(lessonStyles, /\.story-steps,[\s\S]*\.comparison-grid \{ grid-template-columns: 1fr; \}/);
  assert.match(lessonStyles, /\.visual-process \{ grid-template-columns: 1fr; gap: 9px; \}/);
  assert.match(lessonStyles, /\.touch-screen-demo \{ grid-template-columns: repeat\(2, minmax\(0, 1fr\)\); \}/);
  assert.match(lessonStyles, /\.network-map \{ grid-template-columns: 1fr \.45fr 1fr; \}/);
});

test("mobile and Chromebook interiors are project assets used in device comparisons", () => {
  for (const name of ["smartphone", "chromebook", "tablet"]) {
    for (const width of [768, 1536]) {
      assert.ok(exists(`${courseRoot}/assets/images/${name}-internals-exploded-${width}.webp`));
    }
    assert.ok(exists(`${courseRoot}/assets/source/${name}-internals-exploded-v1.png`));
  }
  assert.match(lessonSource, /class="device-comparison-grid"/);
  assert.match(lessonSource, /스마트폰.*SoC/s);
  assert.match(lessonStyles, /\.device-comparison-grid/);
  assert.match(lessonStyles, /\.concept-relationship-board/);
});

test("the bilingual glossary covers every core vocabulary family", () => {
  const requiredTerms = [
    "아날로그", "디지털", "하드웨어", "소프트웨어", "입력", "처리", "출력", "저장",
    "중앙 처리 장치", "그래픽 처리 장치", "RAM·주기억장치", "솔리드 스테이트 드라이브", "하드 디스크 드라이브", "메인보드", "시스템 온 칩", "장치 드라이버",
    "운영체제", "Windows", "ChromeOS", "Android", "iOS", "iPadOS", "프로그램", "프로세스", "창", "탭", "설정", "제어판", "권한", "업데이트",
    "포인터", "텍스트 커서", "드래그 앤 드롭", "탭", "길게 누르기", "스와이프", "핀치", "키보드 단축키", "클립보드",
    "드라이브", "폴더", "파일", "경로", "확장자", "파일 형식", "아이콘", "원본", "바로가기 아이콘", "북마크", "즐겨찾기", "클라우드 저장소", "동기화", "백업", "압축 파일",
    "픽셀", "해상도", "화면 크기", "픽셀 밀도", "표시 배율", "RGB", "래스터 이미지", "벡터 이미지", "스크린샷", "화면 녹화", "샘플링", "프레임",
    "이진수", "비트", "바이트", "킬로바이트", "메가바이트", "기가바이트", "테라바이트", "문자 인코딩", "압축", "데이터 전송률",
    "네트워크", "Wi-Fi", "공유기", "인터넷", "클라이언트", "서버", "URL", "DNS", "요청", "응답", "브라우저", "검색 엔진", "웹사이트", "웹페이지", "링크",
    "프론트엔드", "백엔드", "API", "데이터베이스", "다운로드", "업로드", "쿠키", "캐시", "호스팅", "배포",
    "사용자 계정", "로그인", "인증", "2단계 인증", "역할", "피싱", "개인정보", "저작권", "라이선스", "디지털 발자국",
    "문제 분해", "순서", "알고리즘", "추적", "테스트", "이벤트", "조건", "분기", "반복", "버그", "디버깅", "상태"
  ];
  for (const term of requiredTerms) {
    assert.match(glossary, new RegExp(term));
  }
});

test("quiz totals follow each lesson and answer positions are shuffled", () => {
  assert.match(lessonPage, /id="scoreTotal"/);
  assert.match(lessonSource, /lesson\.questions\.length \* 0\.8/);
  assert.match(lessonSource, /presentedOptions/);
  assert.match(lessonSource, /Math\.random/);
});

test("student-facing copy names the content without promotional filler", () => {
  const studentFacingCopy = [coursePage, lessonPage, lessonSource, ...foundationSources].join("\n");
  for (const phrase of ["헷갈리지 않기", "쉽게 비유하면", "한눈에 비교", "원리 보기", "직접 확인하기", "앞의 개념을 이해하면"] ) {
    assert.doesNotMatch(studentFacingCopy, new RegExp(phrase));
  }
  for (const label of ["개념 설명", "핵심 원리", "핵심 용어", "개념 비교", "동작 순서", "명칭과 어원"]) {
    assert.match(studentFacingCopy, new RegExp(label));
  }
  assert.doesNotMatch(studentFacingCopy, /이\(가\)|을\(를\)|은\(는\)/, "student copy must not use mechanical particle placeholders");
});

test("A02 shows one clear goal and a matching software-hardware pair", () => {
  const a02 = detailedLessons.find((lesson) => lesson.id === "a02");
  assert.match(a02.visual, /data-a02-task="display"/);
  assert.match(a02.visual, /화면에 파란 원 보기/);
  assert.match(a02.visual, /스피커로 ‘도’ 듣기/);
  assert.match(a02.visual, /문서 한 장 인쇄하기/);
  assert.match(a02.visual, /결과를 고르면 필요한 프로그램과 물리 장치가 한 쌍으로 나타납니다/);
  assert.doesNotMatch(a02.visual, /data-a02-command=/);
  assert.doesNotMatch(a02.visual, /data-a02-hardware=/);
  assert.doesNotMatch(lessonSource, /연결 규칙 불일치/);
  assert.match(lessonSource, /const tasks = \{/);
  assert.match(lessonSource, /프로그램이 꺼져 있습니다/);
  assert.match(lessonSource, /장치가 연결되어 있지 않습니다/);
  assert.match(systemLessonStyles, /font-size: clamp\(18px, 1\.75vw, 21px\)/);
});

test("generic sort lessons continue directly to questions while real experiments keep three stages", () => {
  assert.match(lessonSource, /const hasActivityStage = lesson\.activity\.type !== "none"/);
  assert.match(lessonSource, /if \(!hasActivityStage\) \{\s*resetQuiz\(\);\s*showStage\("quiz", "문제 풀이 2 \/ 2"\)/);
  assert.match(lessonSource, /hasActivityStage \? "장면·원리 1 \/ 3" : "장면·원리 1 \/ 2"/);
  assert.match(lessonSource, /"직접 조작 2 \/ 3"/);
  // 조작 단계를 가진 차시는 여섯이다. 개념을 실제로 갈라 보아야 풀리는 넷과, 재고 비교하는 둘.
  assert.deepEqual(
    allLessons.filter((lesson) => lesson.activity.type !== "none").map((lesson) => lesson.id).sort(),
    ["a04", "a05", "c01", "c03", "e02", "g01"]
  );
  assert.deepEqual(
    allLessons.filter((lesson) => lesson.activity.type === "sort").map((lesson) => lesson.id).sort(),
    ["c01", "c03", "e02", "g01"]
  );
});

test("G01 uses one classification axis and keeps binary and conversion in their proper hierarchy", () => {
  const g01 = allLessons.find((lesson) => lesson.id === "g01");
  assert.deepEqual(
    Array.from(g01.activity.categories, ({ id, label }) => [id, label]),
    [["analog", "아날로그"], ["digital", "디지털"]]
  );
  assert.ok(g01.activity.items.every((item) => ["analog", "digital"].includes(item.category)));
  assert.match(g01.conceptTitle, /이진 표현은 디지털의 한 방식/);
  assert.match(g01.activity.instruction, /연속적으로 변하는지, 구분된 단계나 기호로 표현되는지/);
  assert.match(g01.activity.success, /변환은 분류 항목이 아니라/);
});

test("a wrong choice is disabled for retry without revealing the correct answer", () => {
  const handler = lessonSource.slice(
    lessonSource.indexOf('submitAnswer.addEventListener("click"'),
    lessonSource.indexOf('nextQuestion.addEventListener("click"')
  );
  const wrongBranch = handler.slice(handler.indexOf("if (!correct)"), handler.indexOf("if (!questionHadWrong)"));
  assert.match(wrongBranch, /chosenButton\.disabled = true/);
  assert.match(wrongBranch, /selectedOption = -1/);
  assert.match(wrongBranch, /submitAnswer\.disabled = true/);
  assert.match(wrongBranch, /return;/);
  assert.doesNotMatch(wrongBranch, /question\.explanation/);
  assert.doesNotMatch(wrongBranch, /is-answer/);
});

test("secondary explanations use one progressive disclosure instead of three always-open card walls", () => {
  assert.match(lessonPage, /<details class="concept-reference">/);
  assert.match(lessonPage, /동작 순서·개념 비교·비유/);
  assert.match(lessonPage, /<div id="conceptStory"><\/div>/);
  assert.match(lessonPage, /<div id="conceptCompare"><\/div>/);
  assert.match(lessonPage, /<div id="conceptAnalogy"><\/div>/);
  assert.match(lessonStyles, /\.concept-reference > summary/);
  assert.match(lessonStyles, /min-height: 56px/);
  assert.match(lessonStyles, /\.concept-reference \.story-steps li/);
  assert.match(lessonStyles, /\.concept-reference \.comparison-grid article/);
  assert.match(lessonSource, /has-premium-visual/);
  assert.match(lessonStyles, /\.concept-overview\.has-premium-visual/);
});

test("corrected concept models keep their real hierarchy, sequence, and distinctions", () => {
  const c02 = allLessons.find((lesson) => lesson.id === "c02");
  assert.deepEqual(Array.from(c02.details, (entry) => entry[0]), ["Windows", "ChromeOS", "Android", "iOS", "iPadOS"]);
  assert.match(c02.visual, /data-os-choice="ios"/, "C02는 개념 화면에서 다섯 운영체제를 눌러 본다");
  assert.match(c02.visual, /data-os-choice="ipados"/);
  const c03 = allLessons.find((lesson) => lesson.id === "c03");
  assert.match(conceptLabSource, /실행 중인 프로세스 <small>Running Process<\/small>/);
  assert.match(conceptLabSource, /그림 앱 프로세스/);
  assert.doesNotMatch(conceptLabSource, /<h3>RAM <small>Running Process<\/small>/);
  assert.doesNotMatch(c03.questions[1].explanation, /RAM에\s*(?:실행 중인\s*)?프로세스를|RAM에[^.]*프로세스가 생/);
  assert.match(c03.questions[1].explanation, /CPU 시간을 배정해 프로세스를 시작/);
  const h01 = allLessons.find((lesson) => lesson.id === "h01");
  assert.doesNotMatch(h01.questions[2].text, /이동통신|기지국/);
  assert.match(h01.questions[2].explanation, /기기.+공유기/);
  assert.match(conceptLabSource, /data-algo-trace="open"/);
  assert.match(conceptLabSource, /data-algo-trace="select"/);
  assert.match(conceptLabSource, /data-algo-trace="destination"/);
  assert.match(conceptLabSource, /data-algo-trace="move"/);
  assert.match(conceptLabSource, /data-algo-trace="verify"/);
  assert.match(conceptLabSource, /data-file-moved/);
  assert.doesNotMatch(conceptLabSource, /sandwich/);
  assert.match(conceptLabSource, /기기 저장소\/민준\/그림\/여행/);
  assert.match(conceptLabSource, /실제 구분 기호는 운영체제에 따라/);
  assert.match(conceptLabStyles, /data-path-stage="drive"\] \.user-folder/);
  assert.match(conceptLabStyles, /data-path-stage="user"\] \.pictures-folder/);
  assert.match(conceptLabStyles, /data-path-stage="pictures"\] \.trip-folder/);
  assert.match(conceptLabStyles, /data-path-stage="trip"\] \.beach-file/);
  assert.match(conceptLabStyles, /data-path-stage="file"\] \.beach-file/);
  assert.match(conceptLabSource, /바다\.jpg/);
  assert.match(conceptLabSource, /data-transfer-mode-choice="cookie"/);
  assert.match(conceptLabSource, /data-transfer-mode-choice="cache"/);
  assert.match(conceptLabSource, /data-transfer-mode-choice="deploy"/);
  assert.match(conceptLabSource, /data-cookie-store/);
  assert.match(conceptLabSource, /data-cache-count/);
  assert.match(conceptLabSource, /data-deploy-server/);
  assert.doesNotMatch(conceptLabSource, /<progress/);
  assert.match(conceptLabSource, /이 실험의 기록 규칙:/);
  assert.match([conceptLabSource, ...foundationSources].join("\n"), /UTF-8/);
  assert.match(conceptLabSource, /canvas\.toBlob/);
});

test("new lesson tools expose real state changes and primary-device layout rules", () => {
  for (const section of ["privacy", "display", "update", "power"]) {
    assert.ok(conceptLabSource.includes('data-settings-panel="' + section + '"'));
  }
  assert.match(conceptLabSource, /data-update-check/);
  assert.match(conceptLabSource, /chooseSection\("privacy"\)/);
  assert.match(conceptLabSource, /data-power-action="shutdown"/);
  assert.match(conceptLabSource, /data-reference-marker/);
  assert.match(conceptLabSource, /data-browser-search-form/);
  assert.match(conceptLabSource, /data-browser-back/);
  assert.match(conceptLabSource, /data-gesture-surface role="button" tabindex="0"/);
  assert.match(conceptLabSource, /surface\.addEventListener\("pointerdown"/);
  assert.match(conceptLabSource, /pinchDelta >= 24/);
  assert.match(conceptLabSource, /data-audio-sample-choice="24"/);
  assert.match(conceptLabSource, /data-bit-place/);
  assert.match(conceptLabSource, /data-unit-index/);
  assert.match(conceptLabSource, /1 KiB = 1024 B/);
  assert.match(conceptLabSource, /data-citizenship-choice="copyright"/);
  assert.match(conceptLabSource, /data-profile-change/);
  assert.match(conceptLabSource, /표시 이름을 바꾸어도 계정 ID와 로그인 권한은 그대로/);
  assert.match(conceptLabSource, /let evidenceSolved = false/);
  assert.match(conceptLabSource, /footprint\.original = true/);
  assert.doesNotMatch(conceptLabSource, /footprint = \{ original: true, friend: false, log: true \}/);
  assert.match(conceptLabSource, /let waitingForRest = false/);
  assert.match(conceptLabSource, /data-debug-code/);
  assert.match(conceptLabSource, /data-debug-case="missing"/);
  assert.match(conceptLabSource, /if \(!reproduced\)/);
  assert.match(conceptLabSource, /baseFolder === "\/picture\/" && !reproduced/);
  assert.match(conceptLabSource, /normalizedBaseFolder !== "\/pictures\/"/);
  assert.match(conceptLabSource, /const exact = normalizedBaseFolder === "\/pictures\/"/);
  assert.match(conceptLabSource, /evidenceCheck\.disabled = selected\.length !== 3/);
  assert.doesNotMatch(conceptLabSource, /classList\.toggle\("is-wrong", button\.dataset\.evidenceCorrect/);
  assert.match(conceptLabSource, /선택한 사진 <small>Selected Input<\/small>/);
  assert.doesNotMatch(conceptLabSource, /data-debug-code value="\/picture\/cat\.webp"/);
  assert.match(conceptLabSource, /testedCases\.add\("cat"\)/);
  assert.match(conceptLabSource, /data-debug-flow="storage"/);
  assert.match(conceptLabSource, /testedCases\.size === caseButtons\.length/);
  assert.doesNotMatch(conceptLabSource, /data-debug-fix/);
  assert.doesNotMatch(conceptLabStyles, /data-debug-stage="success"\]\s+\.debug-observation li/);
  assert.match(conceptLabSource, /data-algo-verify/);
  assert.match(conceptLabSource, /data-control-move="1"/);
  assert.match(conceptLabSource, /data-control-robot/);
  assert.match(conceptLabSource, /data-flow-step="condition"/);
  assert.match(conceptLabSource, /robot\.addEventListener\("click", runCheck\)/);
  assert.match(conceptLabSource, /starIndex \+= 1/);
  assert.match(conceptLabSource, /resetButton\.focus\(\)/);
  assert.match(conceptLabSource, /남은 별 0개/);
  assert.match(conceptLabSource, /data-port-lab/);
  assert.match(conceptLabSource, /data-request-relay/);
  assert.match(conceptLabSource, /data-program-lab/);
  assert.match(conceptLabSource, /data-clipboard-lab/);
  assert.match(conceptLabSource, /data-display-mode/);
  assert.match(conceptLabSource, /data-image-panel-choice/);
  assert.match(conceptLabSource, /canvas\.toBlob/);
  assert.match(conceptLabStyles, /@media \(min-width: 821px\)/);
  assert.match(conceptLabStyles, /@media \(max-width: 820px\)/);
  assert.match(conceptLabStyles, /@media \(min-width: 821px\) and \(max-width: 1100px\)[\s\S]{0,240}\.visual-program-process \.concept-lab-split/);
  assert.match(conceptLabStyles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(conceptLabStyles, /\[data-mobile-marker\]/);
  assert.match(conceptLabStyles, /input\[type="range"\][\s\S]{0,180}min-height: 44px/);
  assert.match(conceptLabSource, /srcset=/);
  assert.match(conceptLabSource, /<figcaption><b>관찰 <small>Observe<\/small><\/b>/);
  assert.match(conceptLabSource, /768w/);
  assert.match(conceptLabSource, /1536w/);
  assert.match(conceptLabSource, /data-os-choice="ios"/);
  assert.match(conceptLabSource, /data-os-choice="ipados"/);
  assert.match(conceptLabSource, /data-account-status role="status" aria-live="polite"/);
  assert.match(conceptLabSource, /data-algo-status role="status" aria-live="polite"/);
  assert.match(lessonSource, /function focusFirstQuizOption\(\)/);
  assert.match(lessonSource, /chosenButton\.disabled = true;[\s\S]{0,500}focusFirstQuizOption\(\)/);
  assert.match(lessonSource, /renderQuestion\(\);\s*focusFirstQuizOption\(\);/);
  assert.match(lessonSource, /focusStageHeading\("activity"\)/);
  assert.match(lessonSource, /showStage\("result", "차시 완료"\);\s*focusStageHeading\("result"\);/);
  assert.match(lessonSource, /실험 시작 <small>Start Experiment<\/small>/);
  assert.match(lessonSource, /문제 풀기 <small>Continue to Questions<\/small>/);
  assert.match(lessonSource, /다음 차시 <small>Next Lesson<\/small>/);
  assert.match(lessonPage, /차시 목록 <small>Course Lessons<\/small>/);
  assert.match(lessonPage, /처음부터 <small>Reset<\/small>/);
  assert.match(conceptLabSource, /정확히 3개가 되도록 선택을 줄이세요/);
});
