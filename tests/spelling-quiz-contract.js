const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

// 한글 맞춤법 앱 검사. 학급 모드는 2026-09-05부터 공용 학급 순위전(learning/class-race)으로 옮겨 갔다.
const root = path.resolve(__dirname, "..");
const spellingDir = path.join(root, "learning", "literacy-numeracy", "spelling");
const htmlPath = path.join(spellingDir, "index.html");
const questionsPath = path.join(spellingDir, "questions.js");
const extraQuestionsPath = path.join(spellingDir, "questions-extra.js");
const lessonsPath = path.join(spellingDir, "lessons.js");
const questionDeckPath = path.join(spellingDir, "question-deck.js");
const appPath = path.join(spellingDir, "app.js");
const stylesPath = path.join(spellingDir, "styles.css");
const bgmPath = path.join(spellingDir, "assets", "sound", "bgm.ogg");
const hubPath = path.join(root, "index.html");

for (const filePath of [htmlPath, questionsPath, extraQuestionsPath, lessonsPath, questionDeckPath, appPath, stylesPath, bgmPath]) {
    assert.ok(fs.existsSync(filePath), `Missing spelling quiz file: ${filePath}`);
}
for (const removed of ["teacher.html", "teacher.js", "teacher.css"]) {
    assert.ok(!fs.existsSync(path.join(spellingDir, removed)), `${removed} should be gone: class mode lives in learning/class-race now.`);
}
assert.ok(fs.statSync(bgmPath).size > 0, "Spelling background music must not be empty.");

const questionsSource = fs.readFileSync(questionsPath, "utf8");
const extraQuestionsSource = fs.readFileSync(extraQuestionsPath, "utf8");
const questionContext = { window: {} };
vm.createContext(questionContext);
vm.runInContext(questionsSource, questionContext, { filename: questionsPath });
vm.runInContext(extraQuestionsSource, questionContext, { filename: extraQuestionsPath });

const questions = questionContext.window.SPELLING_QUESTIONS;
assert.ok(Array.isArray(questions), "Question bank must be an array.");
assert.strictEqual(questions.length, 354, "Question bank should contain 354 questions.");

for (const requiredId of [
    "danhap", "damhap", "jiyang-avoid", "jihyang-aim", "bangjeung", "banjeung",
    "heojeom",
    "an-haetda", "natda-better", "natda-happen", "nahda-birth",
    "ttida-have", "ttuida-notice", "jotda-follow", "jjotda-chase"
]) {
    assert.ok(questions.some((question) => question.id === requiredId), `Missing meaning distinction question: ${requiredId}`);
}

const ids = new Set();
for (const question of questions) {
    assert.ok(question.id && typeof question.id === "string", "Every question needs an id.");
    assert.match(question.id, /^[a-z0-9_-]+$/i, `${question.id}: id must be safe for class ranking messages.`);
    assert.ok(!ids.has(question.id), `Duplicate question id: ${question.id}`);
    ids.add(question.id);

    for (const key of ["category", "prompt", "sentence", "answer", "explanation"]) {
        assert.ok(typeof question[key] === "string" && question[key].trim(), `${question.id}: missing ${key}`);
    }

    assert.ok(question.sentence.includes("___"), `${question.id}: sentence must contain a blank.`);
    assert.ok(Array.isArray(question.choices), `${question.id}: choices must be an array.`);
    assert.ok(question.choices.length >= 2 && question.choices.length <= 4, `${question.id}: invalid choice count.`);
    assert.strictEqual(new Set(question.choices).size, question.choices.length, `${question.id}: duplicate choices.`);
    assert.strictEqual(
        question.choices.filter((choice) => choice === question.answer).length,
        1,
        `${question.id}: answer must appear exactly once in choices.`
    );
}

const html = fs.readFileSync(htmlPath, "utf8");
for (const requiredId of [
    "classRaceLink",
    "lessonScreen",
    "lessonList",
    "quizScreen",
    "resultScreen",
    "questionText",
    "choiceList",
    "feedback",
    "nextButton",
    "bgm",
    "missedList"
]) {
    assert.ok(html.includes(`id="${requiredId}"`), `Missing required element #${requiredId}`);
}
for (const removedId of [
    "classModeButton", "lobbyScreen", "joinCode", "classRankArea", "classRankingList",
    "modeScreen", "lessonModeButton", "personalModeButton", "personalScreen", "studyScreen"
]) {
    assert.ok(!html.includes(`id="${removedId}"`), `#${removedId} belongs to the shared class race page, or to a removed screen, not the spelling app.`);
}
assert.ok(!html.includes('class="mode-panel"') && !html.includes(' mode-panel"'), "The mode-choice screen should be gone; the lesson list is the home screen now.");

// 로컬 .js/.css는 서버가 24시간 캐시한다(no-cache는 html뿐). 버전 물음표가 없으면
// 오늘 이 파일을 고쳐도 어제 접속한 브라우저는 옛 파일을 계속 쓴다 — 그래서 물음표를 필수로 검사한다.
assert.ok(/href="styles\.css\?v=[^"]+"/.test(html), "Quiz stylesheet must carry a cache-busting version.");
assert.ok(/src="questions\.js\?v=[^"]+"/.test(html), "Question bank must carry a cache-busting version.");
assert.ok(/src="questions-extra\.js\?v=[^"]+"/.test(html), "Expanded question bank must carry a cache-busting version.");
assert.ok(/src="lessons\.js\?v=[^"]+"/.test(html), "Lesson table must carry a cache-busting version.");
assert.ok(/src="question-deck\.js\?v=[^"]+"/.test(html), "No-repeat question deck must carry a cache-busting version.");
assert.ok(/src="\.\.\/\.\.\/\.\.\/assets\/sound\/music-control\.js(\?[^"]*)?"/.test(html), "Shared MUSIC/SFX control is not linked.");
assert.ok(/src="app\.js\?v=[^"]+"/.test(html), "Quiz app must carry a cache-busting version.");
assert.ok(html.includes('src="/learning/literacy-numeracy/spelling/assets/sound/bgm.ogg"'), "Personal mode background music is not linked.");
assert.ok(html.includes("loop preload=\"auto\""), "Spelling background music should loop.");
assert.ok(!html.includes("game-network.js"), "The spelling app no longer talks to the classroom network; the class race page does.");
assert.ok(!html.includes("multiplayer-lobby.js"), "The spelling app no longer hosts a lobby; the class race page does.");
assert.ok(html.includes('href="../../class-race/"'), "The class race link must send students to the shared class race.");
assert.ok(html.includes("나의 오답노트"), "Personal wrong-answer notebook is missing.");
assert.ok(html.includes('id="lessonScreen"'), "The lesson list should be the primary first-screen content.");
assert.ok(!html.includes('class="title-block"'), "The advertising-style title hero should be removed.");
assert.ok(!html.includes('id="playerGreeting"'), "The promotional greeting should be removed.");
assert.ok(!html.includes('id="lessonTitle"') && !html.includes('class="lesson-tools"'), "The lesson screen should open straight into the list, without a separate title/button header.");
assert.ok(!/id="personalStartButton"/.test(html), "The random-10 entry point must live inside the lesson list, not a static header button.");
assert.ok(!/\b230문제/.test(html), "Question counts must come from data-question-count, not a hard-coded number.");
assert.ok(html.includes("한국어 어문 규범"), "Official language norms source should be visible.");
assert.ok(html.includes("표준국어대사전"), "Standard dictionary source should be visible.");

const appSource = fs.readFileSync(appPath, "utf8");
new vm.Script(appSource, { filename: appPath });
assert.ok(appSource.includes("SESSION_SIZE = 10"), "A random round should contain 10 questions.");
assert.ok(appSource.includes("classPlayerName"), "Player name handoff should be supported.");
assert.ok(appSource.includes("localStorage"), "Best score should be stored locally.");
assert.ok(appSource.includes("PERSONAL_DECK_KEY"), "Personal mode should avoid repeats until the question deck is exhausted.");
assert.ok(appSource.includes("LESSON_PROGRESS_KEY"), "Lesson completion should be stored locally.");
assert.ok(!appSource.includes("SPELLING_ACTION"), "Class ranking traffic must not live in the spelling app any more.");
assert.ok(!appSource.includes("ClassroomMultiplayerLobby"), "The spelling app must not create a lobby any more.");
assert.ok(!appSource.includes("bgmToggle"), "Spelling must not keep a separate legacy music toggle.");
assert.ok(appSource.includes('addEventListener("sitebackrequest"'), "The shared back button must return to the lesson list instead of leaving the site from a quiz or result screen.");
assert.ok(appSource.includes("buildRandomCard"), "The random-10 entry must be rendered as the first card of the lesson list.");

const hub = fs.readFileSync(hubPath, "utf8");
assert.ok(/href="learning\/literacy-numeracy\/spelling\/(?:index\.html)?"/.test(hub), "Hub is missing the spelling quiz link.");
assert.ok(hub.includes("한글 맞춤법"), "Hub is missing the Korean orthography title.");
assert.ok(hub.includes("(Korean Spelling)"), "Hub is missing the English subtitle.");
assert.ok(hub.includes('href="learning/class-race/"'), "Hub is missing the shared class race link.");

console.log(`Spelling quiz contract passed (${questions.length} questions).`);
