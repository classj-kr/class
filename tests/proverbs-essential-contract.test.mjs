import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import vm from "node:vm";
import { openLessonPage } from "./helpers/lesson-page.mjs";

const pageDir = "learning/literacy-numeracy/proverbs/";
const html = fs.readFileSync(pageDir + "index.html", "utf8");


function loadBanks() {
  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync("learning/literacy-numeracy/proverbs/proverbs-data.js", "utf8"), context);
  vm.runInNewContext(fs.readFileSync("learning/literacy-numeracy/proverbs/proverbs-essential-additions.js", "utf8"), context);
  return context.window.PROVERB_BANKS;
}

test("수능 대비 필수 한국 속담이 완성형 자료로 추가된다", () => {
  const banks = loadBanks();
  assert.equal(banks.ko.length, 111);
  assert.equal(banks.en.length, 50);
  assert.equal(new Set(banks.ko.map((item) => item.proverb)).size, banks.ko.length);
  for (const item of banks.ko) {
    assert.ok(item.proverb && item.meaning && item.example && item.question, item.proverb);
  }
  const titles = new Set(banks.ko.map((item) => item.proverb));
  for (const title of ["가는 날이 장날", "고양이 목에 방울 달기", "백문이 불여일견", "아 다르고 어 다르다", "열 길 물속은 알아도 한 길 사람 속은 모른다", "입은 비뚤어져도 말은 바로 해라"]) assert.ok(titles.has(title), title);
});

test("뜻이 비슷한 속담은 서로의 오답으로 나오지 않는다", async () => {
  const context = { window: {} };
  for (const file of ["proverbs-data.js", "proverbs-essential-additions.js", "proverbs-lookalikes.js"]) {
    vm.runInNewContext(fs.readFileSync("learning/literacy-numeracy/proverbs/" + file, "utf8"), context);
  }
  for (const deck of Object.values(context.window.PROVERB_BANKS)) {
    const byProverb = new Map(deck.map((item) => [item.proverb, item]));
    for (const item of deck) {
      assert.ok(Array.isArray(item.lookalikes), item.proverb);
      for (const other of item.lookalikes) {
        assert.ok(byProverb.get(other).lookalikes.includes(item.proverb), item.proverb + " ↔ " + other);
      }
    }
  }
  const ko = new Map(context.window.PROVERB_BANKS.ko.map((item) => [item.proverb, item]));
  assert.ok(ko.get("가재는 게 편").lookalikes.includes("팔은 안으로 굽는다"));
  assert.ok(html.indexOf("proverbs-lookalikes.js") > html.indexOf("proverbs-essential-additions.js"));
  assert.ok(html.indexOf("proverbs-lookalikes.js") < html.indexOf("app.js"));

  // 실제 화면에서 우리말·영어 차시를 모두 열어, 만들어진 보기에 헷갈리는 속담이 없는지 본다.
  // (2026-10-02 보기 만들기는 app.js에서 공용 진행기 assets/learning-lesson.js로 옮겨 갔다.)
  const page = await openLessonPage(pageDir);
  const decks = page.config.decks;
  for (const language of ["ko", "en"]) {
    assert.equal(decks[language].length, context.window.PROVERB_BANKS[language].length);
    assert.ok(decks[language].some((item) => item.lookalikes.length > 0), language);
    page.tab(".language-tab", language).onclick();
    let questions = 0;
    for (const button of page.lessonButtons()) {
      await button.onclick();
      for (const quiz of page.session.checkpoint.quiz) {
        const proverb = quiz.item.proverb;
        assert.equal(quiz.choices.length, 3, proverb);
        assert.equal(new Set(quiz.choices).size, 3, proverb);
        assert.equal(quiz.choices[quiz.answer], proverb);
        for (const choice of quiz.choices) {
          assert.ok(!quiz.item.lookalikes.includes(choice), proverb + " 문제에 " + choice);
        }
        questions += 1;
      }
      await page.byId("backToLessons").onclick();
    }
    assert.equal(questions, decks[language].length, language);
  }

  // 보기는 무작위로 뽑히므로 위 검사만으로는 우연히 지나칠 수 있다.
  // 은행을 '정답과 그 헷갈리는 속담들'만으로 줄이면 오답으로 낼 것이 하나도 없어야 한다.
  for (const deck of [decks.ko, decks.en]) {
    for (const item of deck.filter((entry) => entry.lookalikes.length > 0)) {
      const rivals = item.lookalikes.map((proverb) => deck.find((entry) => entry.proverb === proverb));
      await page.run({
        ...page.config,
        decks: { ko: [item, ...rivals] },
        lessons: { ko: [{ title: "", copy: "" }] },
        lessonFor: (entry) => (entry === item ? 0 : 1)
      });
      await page.lessonButtons()[0].onclick();
      assert.deepEqual(Array.from(page.session.checkpoint.quiz[0].choices), [item.proverb], item.proverb);
    }
  }
});
