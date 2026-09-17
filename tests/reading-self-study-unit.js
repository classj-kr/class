"use strict";

const assert = require("assert");
const {
  LEVEL_PROFILES,
  createSelfStudyItems
} = require("../game-hub-server/data/reading-self-study-v3");

const items = createSelfStudyItems();
assert(items.length >= 40, "self-study bank should not be nearly empty");
assert.equal(new Set(items.map((item) => item.id)).size, items.length);
assert(items.every((item) => item.track === "ko"), "English self-study reading was retired");

const normalize = (value) => String(value).normalize("NFC").trim().replace(/\s+/g, " ");

for (let level = 1; level <= 4; level += 1) {
  const set = items.filter((item) => item.targetLevel === level);
  const profile = LEVEL_PROFILES[level];
  // 3·4급은 아직 작성 중이라 비어 있을 수 있다. 문항이 있으면 20개 이상이어야 한다.
  if (!set.length && level >= 3) continue;
  assert(set.length >= 20, `K${level} should have at least 20 items`);
  assert(set.every((item) => item.skillFocus === profile.focus));
  assert.equal(new Set(set.map((item) => normalize(item.passageText))).size, set.length,
    `K${level} should not repeat a passage`);
  assert.equal(new Set(set.map((item) => item.topicTitle)).size, set.length,
    `K${level} should not repeat a topic`);
  const positions = Array.from({ length: profile.choiceCount }, (_, index) =>
    set.filter((item) => item.correctIndex === index).length);
  assert(Math.max(...positions) - Math.min(...positions) <= 3,
    `K${level} should keep answer positions balanced: ${positions}`);
}

for (const item of items) {
  assert.equal(item.choices.length, LEVEL_PROFILES[item.targetLevel].choiceCount, item.id);
  assert(Number.isInteger(item.correctIndex));
  assert(item.correctIndex >= 0 && item.correctIndex < item.choices.length);
  assert.equal(new Set(item.choices).size, item.choices.length, `${item.id} repeats a choice`);
  assert(item.explanation.length > 0);
  assert(!/[①-⑤]|선지|\d번(은|이|을|도|과)?\s*(정답|오답)/.test(item.explanation), `${item.id} explanation names a choice number, but choices are shuffled`);

  const answer = item.choices[item.correctIndex];
  assert(!item.passageText.includes(answer.replace(/\.$/, "")), `${item.id} copies its answer from the passage`);

  item.choices.forEach((choice, index) => {
    if (index === item.correctIndex) return;
    assert(!/(항상|절대|전혀|반드시|오직|무조건|완전히)/u.test(choice),
      `${item.id} gives away a wrong choice with an extreme word: ${choice}`);
  });

  // 1급(초3~4)은 지문과 선지를 모두 습니다체로 쓴다.
  if (item.targetLevel === 1) {
    item.choices.forEach((choice) =>
      assert(/니다\.?$/.test(choice.trim()), `${item.id} choice is not 습니다체: ${choice}`));
    item.passageText.split(/(?<=[.?!])\s+/).filter(Boolean).forEach((sentence) =>
      assert(/(니다|니까)[.?!]?["”']?$/.test(sentence.trim()), `${item.id} passage is not 습니다체: ${sentence}`));
  } else {
    item.choices.forEach((choice) =>
      assert(!/니다\.?$/.test(choice.trim()), `${item.id} choice should use the -다 register: ${choice}`));
  }
}

console.log("Reading self-study unit: OK");
