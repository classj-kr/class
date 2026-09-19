const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.join(__dirname, "..", "learning", "literacy-numeracy", "sentence-building");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const css = fs.readFileSync(path.join(root, "styles.css"), "utf8");
const curriculumSource = fs.readFileSync(path.join(root, "curriculum.js"), "utf8");
const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
const hub = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");

assert.match(html, /<title>문장 고르기 \| ClassJ<\/title>/);
assert.match(html, /2022 개정 국어과 성취기준/);
assert.doesNotMatch(html, /교육과정 원문|course-intro/);
assert.match(html, /id="courseScreen"/);
assert.match(html, /id="lessonList"/);
assert.match(html, /id="lessonMeta" class="teacher-meta"/);
assert.match(html, /id="lessonScreen"[^>]*hidden/);
assert.match(html, /id="resultScreen"[^>]*hidden/);
assert.match(html, /curriculum\.js/);
assert.doesNotMatch(html, /practice-extra\.js/);
assert.match(html, /app\.js/);

assert.match(css, /grid-template-columns:\s*repeat\(4/);
assert.match(css, /\.unit-header h2[^}]*font-size:\s*13px/);
assert.match(css, /\.lesson-card strong[^}]*font-size:\s*15px/);
assert.match(css, /--exam-font:\s*"KoPubWorld Batang"/);
assert.match(css, /\.choice-button[\s\S]*?font-family:\s*var\(--exam-font\)/);
assert.doesNotMatch(css, /\.course-intro|\.grade-band|\.lesson-card-copy/);
assert.match(css, /\.rubric-list/);
assert.match(css, /\.multi-guide/);
assert.match(css, /@media \(max-width: 480px\)/);

assert.match(app, /joyclass-sentence-building-progress-v2/);
assert.match(app, /selectedChoices/);
assert.match(app, /task\.answers/);
assert.match(app, /task\.shuffleOptions === false/);
assert.match(app, /task\.minChars/);
assert.match(app, /task\.criteria/);
assert.match(app, /rubric-checkbox/);
assert.match(app, /rubricChecks\.some/);
assert.match(app, /교사용.*lesson\.gradeBand/);
assert.doesNotMatch(app, /grade-band|lesson-card-copy|unit\.subtitle/);
assert.match(app, /sitebackrequest/);
assert.doesNotMatch(app, /AudioContext|confetti|celebrate/);

const context = { window: {} };
vm.createContext(context);
vm.runInContext(curriculumSource, context);
const course = context.window.SENTENCE_COURSE;
assert.ok(course);
assert.equal(course.version, 2);
assert.equal(course.units.length, 6);
assert.equal(course.lessons.length, 24);
assert.equal(new Set(course.lessons.map((item) => item.id)).size, 24);
assert.match(course.source.notice, /2022-33/);
assert.match(course.source.url, /moe\.go\.kr/);

const requiredStandards = [
    "4국03-01", "4국03-02", "4국03-03", "4국03-04", "4국03-05", "4국04-03", "4국04-04",
    "6국03-01", "6국03-02", "6국03-03", "6국03-04", "6국03-05", "6국03-06",
    "6국04-01", "6국04-04", "6국04-05", "6국04-06"
];
assert.deepEqual(Object.keys(course.standards).sort(), requiredStandards.sort());

const unitIds = new Set(course.units.map((unit) => unit.id));
const usedStandards = new Set();
for (const [lessonIndex, item] of course.lessons.entries()) {
    const where = `lesson ${lessonIndex + 1}`;
    assert.ok(unitIds.has(item.unit), `${where}: unknown unit`);
    assert.ok(item.title && item.goal && item.gradeBand, `${where}: missing metadata`);
    assert.equal(item.tasks.length, 6, `${where}: expected six substantial tasks`);
    assert.ok(item.standards.length >= 1, `${where}: missing achievement standard`);
    item.standards.forEach((code) => {
        assert.ok(course.standards[code], `${where}: unknown standard ${code}`);
        usedStandards.add(code);
    });
    assert.equal(new Set(item.tasks.map((task) => task.scene)).size, item.tasks.length, `${where}: duplicate scenes`);
    assert.equal(item.tasks.filter((task) => task.type === "multi").length, 1, `${where}: one multi-select task required`);
    assert.equal(item.tasks.filter((task) => task.type === "order").length, 1, `${where}: one ordering task required`);
    assert.equal(item.tasks.filter((task) => task.type === "write").length, 1, `${where}: one writing task required`);

    for (const [taskIndex, task] of item.tasks.entries()) {
        const taskWhere = `${where}, task ${taskIndex + 1}`;
        assert.ok(["choice", "multi", "order", "write"].includes(task.type), `${taskWhere}: invalid type`);
        assert.ok(task.prompt && task.scene && task.hint && task.explain, `${taskWhere}: missing copy`);
        if (task.type === "choice") {
            assert.ok(task.options.length >= 4, `${taskWhere}: too few choices`);
            assert.ok(Number.isInteger(task.answer) && task.answer >= 0 && task.answer < task.options.length, `${taskWhere}: invalid answer`);
            const optionLengths = task.options.map((option) => option.length);
            const longestDistractor = Math.max(...optionLengths.filter((_, index) => index !== task.answer));
            assert.ok(optionLengths[task.answer] <= longestDistractor, `${taskWhere}: correct answer is the uniquely longest option`);
        }
        if (task.type === "multi") {
            assert.ok(task.options.length >= 4, `${taskWhere}: too few choices`);
            assert.ok(task.answers.length >= 2, `${taskWhere}: multi-select needs multiple answers`);
            assert.ok(task.answers.length < task.options.length, `${taskWhere}: selecting every option must not be correct`);
            assert.equal(new Set(task.answers).size, task.answers.length, `${taskWhere}: duplicate answers`);
            task.answers.forEach((answer) => assert.ok(Number.isInteger(answer) && answer >= 0 && answer < task.options.length, `${taskWhere}: invalid multi answer`));
        }
        if (task.type === "choice" || task.type === "multi") {
            const optionLengths = task.options.map((option) => option.length);
            if (Math.min(...optionLengths) > 1) {
                assert.ok(Math.max(...optionLengths) - Math.min(...optionLengths) < 15, `${taskWhere}: option lengths reveal a visual clue`);
            }
        }
        if (task.type === "order") {
            assert.equal(task.tokens.length, task.answer.length, `${taskWhere}: token count mismatch`);
            assert.deepEqual([...task.tokens].sort(), [...task.answer].sort(), `${taskWhere}: answer tokens mismatch`);
        }
        if (task.type === "write") {
            assert.ok(task.minSentences >= 3, `${taskWhere}: writing target too low`);
            assert.ok(task.minChars >= 70, `${taskWhere}: character target too low`);
            assert.ok(task.criteria.length >= 3, `${taskWhere}: writing rubric too thin`);
            assert.ok(task.placeholder, `${taskWhere}: missing writing scaffold`);
        }
    }
}

assert.ok(requiredStandards.every((code) => usedStandards.has(code)), "Every selected achievement standard must be taught by at least one lesson.");

const numberedReferenceTasks = course.lessons.flatMap((item) => item.tasks).filter((task) =>
    task.type === "choice" && task.options.every((option) => /^[①②③④⑤]$/.test(option))
);
assert.equal(numberedReferenceTasks.length, 3, "expected three numbered-sentence choice tasks");
numberedReferenceTasks.forEach((task) => {
    assert.deepEqual([...task.options], ["①", "②", "③", "④", "⑤"]);
    assert.equal(task.shuffleOptions, false, "numbered-sentence choices must keep their printed order");
    ["①", "②", "③", "④", "⑤"].forEach((label) => assert.match(task.scene, new RegExp(label)));
});

assert.ok(course.lessons.slice(0, 12).every((item) => item.gradeBand === "3~4학년군"));
assert.ok(course.lessons.slice(12).every((item) => item.gradeBand === "5~6학년군"));

const lesson20 = course.lessons[19];
assert.equal(lesson20.id, "citation-source");
assert.ok(lesson20.standards.includes("6국03-02"));
assert.match(JSON.stringify(lesson20), /출처/);
assert.doesNotMatch(JSON.stringify(lesson20), /민지가 사과를 먹었다/);

const firstTask = course.lessons[0].tasks[0];
assert.match(firstTask.scene, /때:.*사람:.*장소:.*발견한 것:.*처리:/);
assert.ok(!firstTask.scene.includes(firstTask.options[firstTask.answer]), "First task must require composing facts, not visual sentence matching.");

const finalLesson = course.lessons.at(-1);
const finalWriting = finalLesson.tasks.find((task) => task.type === "write");
assert.equal(finalLesson.id, "integrated-writing");
assert.ok(finalWriting.minSentences >= 8);
assert.ok(finalWriting.minChars >= 280);
assert.ok(finalWriting.criteria.length >= 8);
assert.doesNotMatch(`${finalWriting.prompt} ${finalWriting.scene}`, /그림|[🌳🧺👨‍👩‍👧‍👦☀️🥪🍎🐕]/u);

assert.match(hub, /data-access-group="grammar"/);
assert.match(hub, /<strong>문법<\/strong><small>\(Grammar\)<\/small>/);
assert.match(hub, /learning\/literacy-numeracy\/spelling\//);
assert.match(hub, /learning\/literacy-numeracy\/sentence-building\//);
assert.match(hub, /<strong>문장 고르기<\/strong><small>\(Sentence Choice\)<\/small>/);
assert.doesNotMatch(hub, /<strong>문장 만들기<\/strong>/);
assert.equal((hub.match(/href="learning\/literacy-numeracy\/sentence-building\/"/g) || []).length, 1);

console.log("sentence-building-contract: ok");
