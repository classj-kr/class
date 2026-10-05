import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { openLessonPage } from "./helpers/lesson-page.mjs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const data = require("../learning/literacy-numeracy/idiomatic-expressions/idiomatic-expressions-data.js");
const pageDir = "learning/literacy-numeracy/idiomatic-expressions/";
const html = fs.readFileSync(pageDir + "index.html", "utf8");
const app = fs.readFileSync(pageDir + "app.js", "utf8");
const styles = fs.readFileSync(pageDir + "styles.css", "utf8");
const menu = fs.readFileSync("index.html", "utf8");


test("관용구 핵심 학습 은행은 선별된 완성형 자료다", () => {
  assert.equal(data.length, 110);
  assert.equal(new Set(data.map((item) => item.expression)).size, data.length);
  for (const item of data) {
    assert.ok(item.expression.length >= 3, item.expression);
    assert.ok(item.category.length >= 3, item.expression);
    assert.ok(item.meaning.endsWith("."), item.expression);
    assert.ok(item.example.endsWith("요."), item.expression);
    assert.ok(item.question.endsWith("요."), item.expression);
    assert.ok(Number.isInteger(item.lesson), item.expression);
  }
  assert.deepEqual(
    Array.from({ length: 11 }, (_, lesson) => data.filter((item) => item.lesson === lesson).length),
    [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10]
  );
  const expressions = data.map((item) => item.expression).join("\n");
  assert.doesNotMatch(expressions, /누워서 떡 먹기|가뭄에 콩 나듯|갈수록 태산|천 리 길도/);
});

test("뜻이 비슷한 관용어는 서로의 오답으로 나오지 않는다", async () => {
  const byExpression = new Map(data.map((item) => [item.expression, item]));
  for (const item of data) {
    assert.ok(Array.isArray(item.lookalikes), item.expression);
    for (const other of item.lookalikes) {
      assert.ok(byExpression.get(other).lookalikes.includes(item.expression), item.expression + " ↔ " + other);
    }
  }
  assert.ok(byExpression.get("골머리를 썩이다").lookalikes.includes("머리를 굴리다"));
  assert.ok(byExpression.get("기가 막히다").lookalikes.includes("기가 차다"));

  // 실제 화면에서 모든 차시를 열어, 만들어진 보기에 헷갈리는 표현이 없는지 본다.
  const page = await openLessonPage(pageDir);
  const bank = page.config.decks.ko;
  assert.equal(bank.length, data.length);
  assert.ok(bank.some((item) => item.lookalikes.length > 0));
  let questions = 0;
  for (const button of page.lessonButtons()) {
    await button.onclick();
    for (const quiz of page.session.checkpoint.quiz) {
      const expression = quiz.item.expression;
      assert.equal(quiz.choices.length, 3, expression);
      assert.equal(new Set(quiz.choices).size, 3, expression);
      assert.equal(quiz.choices[quiz.answer], expression);
      for (const choice of quiz.choices) {
        assert.ok(!quiz.item.lookalikes.includes(choice), expression + " 문제에 " + choice);
      }
      questions += 1;
    }
    await page.byId("backToLessons").onclick();
  }
  assert.equal(questions, data.length);

  // 보기는 무작위로 뽑히므로 위 검사만으로는 우연히 지나칠 수 있다.
  // 은행을 '정답과 그 헷갈리는 표현들'만으로 줄이면 오답으로 낼 것이 하나도 없어야 한다.
  for (const item of bank.filter((entry) => entry.lookalikes.length > 0)) {
    const rivals = item.lookalikes.map((expression) => bank.find((entry) => entry.expression === expression));
    await page.run({
      ...page.config,
      decks: { ko: [item, ...rivals] },
      lessons: { ko: [{ title: "", copy: "" }] },
      lessonFor: (entry) => (entry === item ? 0 : 1)
    });
    await page.lessonButtons()[0].onclick();
    assert.deepEqual(Array.from(page.session.checkpoint.quiz[0].choices), [item.expression], item.expression);
  }
});

test("관용구 화면과 메인 메뉴가 내용별 차시 학습에 연결된다", async () => {
  assert.match(menu, /href="learning\/literacy-numeracy\/idiomatic-expressions\/"/);
  assert.match(menu, /<strong>관용어<\/strong>/);
  // 2026-09-09 관용어·속담·한자성어는 메인 메뉴의 「어휘」 묶음으로 합쳐졌다.
  assert.match(menu, /data-access-group="vocabulary"/);
  assert.match(menu, /<strong>어휘<\/strong>/);
  const vocabularyPaths = (menu.match(/data-access-group="vocabulary">\s*<summary[^>]*data-content-paths="([^"]+)"/) || [])[1] || "";
  for (const folder of ["idiomatic-expressions", "proverbs", "classical-chinese-idioms"]) {
    assert.ok(vocabularyPaths.split("|").includes(`learning/literacy-numeracy/${folder}/`), folder);
    assert.match(menu, new RegExp(`<a href="learning/literacy-numeracy/${folder}/"[^>]*data-access-parent="vocabulary"`), folder);
  }
  // 끝난 뒤의 결과(맞힌 수)는 화면의 #score가 아니라 학습 기록 창이 보여 준다(2026-10-02).
  for (const id of [
    "studyView", "quizView", "expression", "meaning", "example", "question",
    "choices", "feedback", "previous", "next", "nextQuestion"
  ]) {
    assert.match(html, new RegExp("id=\\\"" + id + "\\\""), id);
  }
  assert.match(html, /id="lessonOverview"/);
  assert.match(html, /id="lessonList"/);
  assert.match(html, /id="backToLessons"/);
  assert.match(app, /const LESSONS =/);
  assert.match(app, /1차시 · 감정과 반응/);
  assert.doesNotMatch(app, /BATCH_SIZE = 5/);

  // 차시 목록: 열한 차시가 열 개씩, 끝낸 차시와 하던 차시에는 표시가 붙는다.
  const page = await openLessonPage(pageDir, [
    { contentKey: "ko:0", status: "completed" },
    { contentKey: "ko:1", status: "active" }
  ]);
  const badge = (button) => button.children[2].children.map((mark) => mark.textContent).join("");
  const buttons = page.lessonButtons();
  assert.equal(buttons.length, 11);
  assert.equal(buttons[0].children[1].children[0].textContent, "1차시 · 감정과 반응");
  for (const button of buttons) assert.equal(button.children[2].textContent, "10개");
  assert.deepEqual(Array.from(buttons.slice(0, 4), badge), ["완료", "진행 중", "", ""]);

  // 셋째 차시를 열어 공부 화면 → 문제 화면 → 끝까지 풀기.
  await buttons[2].onclick();
  const lessonItems = data.filter((item) => item.lesson === 2);
  assert.equal(page.byId("lessonOverview").hidden, true);
  assert.equal(page.byId("learningShell").hidden, false);
  assert.equal(page.byId("quizView").hidden, true);
  assert.equal(page.byId("expression").textContent, lessonItems[0].expression);
  assert.equal(page.byId("meaning").textContent, lessonItems[0].meaning);

  await page.tab(".mode-tab", "quiz").onclick();
  assert.equal(page.byId("studyView").hidden, true);
  assert.equal(page.byId("quizView").hidden, false);
  // 문제를 푸는 동안에는 제목줄을 숨긴다(2026-09-05 중복 제목줄 제거).
  assert.match(html, /id="quizTitle"/);
  assert.equal(page.byId("quizTitle").hidden, true);

  const { quiz } = page.session.checkpoint;
  assert.equal(quiz.length, 10);
  for (const question of quiz) {
    assert.equal(page.byId("question").textContent, question.item.question);
    assert.equal(page.byId("choices").children.length, 3);
    assert.equal(page.byId("nextQuestion").disabled, true);
    await page.byId("choices").children[question.answer].onclick();
    // 맞히면 그 표현의 뜻을 풀이로 보여 준다.
    assert.ok(page.byId("feedback").textContent.includes(question.item.meaning), question.item.expression);
    assert.equal(page.byId("nextQuestion").disabled, false);
    await page.byId("nextQuestion").onclick();
  }
  // 마지막 문제까지 풀면 완료로 저장하고, 결과 창을 띄우고, 목록에 「완료」가 붙는다.
  assert.equal(page.saves.at(-1).complete, true);
  assert.equal(page.results, 1);
  assert.equal(page.byId("lessonOverview").hidden, false);
  assert.equal(page.byId("learningShell").hidden, true);
  assert.equal(badge(page.lessonButtons()[2]), "완료");

  assert.match(styles, /min-height:\s*48px/);
  assert.match(styles, /@media \(max-width: 520px\)/);
});
