"use strict";

const assert = require("assert");
const {
  LEVEL_PROFILES,
  createSelfStudyItems
} = require("../game-hub-server/data/reading-self-study-v3");

const items = createSelfStudyItems();
assert(items.length >= 20, "self-study bank should not be nearly empty");
assert.equal(new Set(items.map((item) => item.id)).size, items.length);
assert(items.every((item) => item.track in LEVEL_PROFILES), "unknown track");

const normalize = (value) => String(value).normalize("NFC").trim().replace(/\s+/g, " ");
const HANGUL = /[가-힣]/;

for (const track of Object.keys(LEVEL_PROFILES)) {
  const prefix = track === "ko" ? "K" : "E";
  for (let level = 1; level <= 4; level += 1) {
    const set = items.filter((item) => item.track === track && item.targetLevel === level);
    const profile = LEVEL_PROFILES[track][level];
    if (!set.length) continue;
    assert(set.length >= 20, `${prefix}${level} should have at least 20 items`);
    assert(set.every((item) => item.skillFocus === profile.focus));
    assert.equal(new Set(set.map((item) => normalize(item.passageText))).size, set.length,
      `${prefix}${level} should not repeat a passage`);
    assert.equal(new Set(set.map((item) => item.topicTitle)).size, set.length,
      `${prefix}${level} should not repeat a topic`);
    const positions = Array.from({ length: profile.choiceCount }, (_, index) =>
      set.filter((item) => item.correctIndex === index).length);
    assert(Math.max(...positions) - Math.min(...positions) <= 3,
      `${prefix}${level} should keep answer positions balanced: ${positions}`);
  }
}

for (const item of items) {
  const profile = LEVEL_PROFILES[item.track][item.targetLevel];
  assert.equal(item.choices.length, profile.choiceCount, item.id);
  assert(Number.isInteger(item.correctIndex));
  assert(item.correctIndex >= 0 && item.correctIndex < item.choices.length);
  assert.equal(new Set(item.choices).size, item.choices.length, `${item.id} repeats a choice`);
  assert(item.explanation.length > 0);
  assert(!/[①-⑤]|선지|\d번(은|이|을|도|과)?\s*(정답|오답)/.test(item.explanation), `${item.id} explanation names a choice number, but choices are shuffled`);

  const answer = item.choices[item.correctIndex];
  assert(!item.passageText.includes(answer.replace(/[.?]$/, "")), `${item.id} copies its answer from the passage`);

  const englishChoices = item.track === "en" && item.targetLevel === 4;
  item.choices.forEach((choice, index) => {
    if (index === item.correctIndex) return;
    const cue = englishChoices ? /\b(always|never|only|all|none|every|completely)\b/i : /(항상|절대|전혀|반드시|오직|무조건|완전히)/u;
    assert(!cue.test(choice), `${item.id} gives away a wrong choice with an extreme word: ${choice}`);
  });

  if (item.track === "ko") {
    // 1급(초3~4)은 지문과 선지를 모두 습니다체로 쓴다. 질문 선지는 '-니까?'.
    if (item.targetLevel === 1) {
      item.choices.forEach((choice) =>
        assert(/(니다\.?|니까\?)$/.test(choice.trim()), `${item.id} choice is not 습니다체: ${choice}`));
      item.passageText.split(/(?<=[.?!])\s+/).filter(Boolean).forEach((sentence) =>
        assert(/(니다|니까)[.?!]?["”']?$/.test(sentence.trim()), `${item.id} passage is not 습니다체: ${sentence}`));
    } else {
      item.choices.forEach((choice) =>
        assert(!/니다\.?$/.test(choice.trim()), `${item.id} choice should use the -다 register: ${choice}`));
    }
  } else {
    assert(!HANGUL.test(item.passageText), `${item.id} English passage contains Korean`);
    assert(HANGUL.test(item.translation || ""), `${item.id} needs a Korean translation`);
    assert(Array.isArray(item.vocab) && item.vocab.length >= 3, `${item.id} needs vocabulary notes`);
    item.choices.forEach((choice) =>
      assert(englishChoices ? !HANGUL.test(choice) : HANGUL.test(choice), `${item.id} choice language: ${choice}`));
  }
}

console.log("Reading self-study unit: OK");
