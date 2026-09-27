import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import vm from "node:vm";

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

test("뜻이 비슷한 속담은 서로의 오답으로 나오지 않는다", () => {
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
  const app = fs.readFileSync("learning/literacy-numeracy/proverbs/app.js", "utf8");
  const html = fs.readFileSync("learning/literacy-numeracy/proverbs/index.html", "utf8");
  assert.match(app, /lookalikes\.includes\(deck\[i\]\.proverb\)/);
  assert.ok(html.indexOf("proverbs-lookalikes.js") > html.indexOf("proverbs-essential-additions.js"));
  assert.ok(html.indexOf("proverbs-lookalikes.js") < html.indexOf("app.js"));
});
