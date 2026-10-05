import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { openLessonPage } from "./helpers/lesson-page.mjs";

const pageDir = "learning/literacy-numeracy/proverbs/";
const html = fs.readFileSync(pageDir + "index.html", "utf8");
const app = fs.readFileSync(pageDir + "app.js", "utf8");
const styles = fs.readFileSync(pageDir + "styles.css", "utf8");


// 차시 목록에 그려진 줄 하나에서 제목·개수·표시를 읽는다.
const lessonRow = (button) => ({
  title: button.children[1].children[0].textContent,
  count: Number.parseInt(button.children[2].textContent, 10),
  badge: button.children[2].children.map((mark) => mark.textContent).join("")
});

test("속담은 고정 개수가 아닌 내용별 차시 학습으로 진행된다", async () => {
  for (const id of ["lessonOverview", "lessonList", "learningShell", "backToLessons", "currentLessonTitle"]) assert.match(html, new RegExp(`id="${id}"`));
  assert.doesNotMatch(app, /BATCH_SIZE|다음 5개|5개 학습|세상살이의 지혜/);

  // 실제 화면을 띄워 차시 목록을 읽는다. 끝낸 차시는 기록에서 받아 「완료」로 표시한다.
  // (2026-10-02 「0 / 10 완료」 한 줄 요약은 없어지고 차시마다 표시가 붙는다.)
  const page = await openLessonPage(pageDir, [
    { contentKey: "ko:0", status: "completed" },
    { contentKey: "en:1", status: "completed" },
    { contentKey: "en:2", status: "active" }
  ]);
  const rows = {};
  for (const language of ["ko", "en"]) {
    page.tab(".language-tab", language).onclick();
    rows[language] = Array.from(page.lessonButtons(), lessonRow);
  }
  assert.equal(rows.ko[0].title, "말의 힘과 소통");
  assert.ok(rows.en.some((row) => row.title === "Hope and well-being"));
  const counts = { ko: rows.ko.map((row) => row.count), en: rows.en.map((row) => row.count) };
  assert.equal(counts.ko.length, 16);
  assert.equal(counts.en.length, 9);
  assert.equal(counts.ko.reduce((sum, count) => sum + count, 0), 111);
  assert.equal(counts.en.reduce((sum, count) => sum + count, 0), 50);
  assert.ok(counts.ko.every((count) => count > 0 && count <= 11), counts.ko.join(","));
  assert.ok(counts.en.every((count) => count > 0 && count <= 9), counts.en.join(","));
  assert.deepEqual(rows.ko.map((row) => row.badge).filter(Boolean), ["완료"]);
  assert.equal(rows.ko[0].badge, "완료");
  assert.deepEqual(rows.en.slice(0, 4).map((row) => row.badge), ["", "완료", "진행 중", ""]);

  // 차시를 열면 그 차시 속담만큼 문제가 나오고, 끝까지 풀면 목록에 「완료」가 붙는다.
  page.tab(".language-tab", "ko").onclick();
  await page.lessonButtons()[3].onclick();
  assert.equal(page.byId("currentLessonTitle").textContent, rows.ko[3].title);
  const { quiz } = page.session.checkpoint;
  assert.equal(quiz.length, counts.ko[3]);
  await page.tab(".mode-tab", "quiz").onclick();
  for (const question of quiz) {
    await page.byId("choices").children[question.answer].onclick();
    await page.byId("nextQuestion").onclick();
  }
  assert.equal(page.saves.at(-1).complete, true);
  assert.equal(page.results, 1);
  assert.equal(page.byId("learningShell").hidden, true);
  assert.equal(lessonRow(page.lessonButtons()[3]).badge, "완료");
  assert.match(styles, /\.lesson-item/);
});
