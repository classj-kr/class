"use strict";

// 비문학 자습 문항 (2026-09-17 교체)
//
// 예전(v2)에는 주제별 문장 조각을 조합해 896문항을 자동으로 만들었다.
// 그렇게 만든 문항은 지문이 논증 중간 토막이 되고, 정답이 교훈 같은
// 바른말이라 지문을 읽지 않아도 풀렸다. 지금은 지문·문제·선지·해설을
// 한 세트로 쓴 문항만 싣는다. 각 문항은 "지문 없이 선지만 보고 풀면
// 틀리고, 지문을 읽고 풀면 맞힌다"는 검사를 통과한 것이다.
// 영어 문항은 국어를 옮기지 않고 따로 썼다(scripts/reading-authoring/SPEC-en.md).
const fs = require("fs");
const path = require("path");

const LEVEL_PROFILES = Object.freeze({
  ko: Object.freeze({
    1: { focus: "사실 확인과 직접 적용", choiceCount: 4 },
    2: { focus: "추론과 인과 관계", choiceCount: 4 },
    3: { focus: "정보 종합과 조건 판단", choiceCount: 5 },
    4: { focus: "근거 적용과 범위 평가", choiceCount: 5 }
  }),
  en: Object.freeze({
    1: { focus: "초3~4 · 짧은 글 사실 찾기", choiceCount: 4 },
    2: { focus: "초5~6 · 사실과 까닭 찾기", choiceCount: 4 },
    3: { focus: "중1~2 · 중심 내용과 세부 정보", choiceCount: 5 },
    4: { focus: "중3 · 영어 선지로 내용 파악", choiceCount: 5 }
  })
});

function loadBank(track) {
  const file = path.join(__dirname, `reading-self-study-${track}-v1.json`);
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")).items : [];
}

function createSelfStudyItems() {
  return Object.keys(LEVEL_PROFILES).flatMap((track) => loadBank(track).map((item) => ({
    id: item.id,
    familyId: item.id,
    topicTitle: item.topicTitle,
    track,
    targetLevel: item.level,
    skillFocus: LEVEL_PROFILES[track][item.level].focus,
    questionType: item.questionType,
    passageText: item.passageText,
    promptText: item.promptText,
    choices: item.choices.slice(),
    correctIndex: item.correctIndex,
    explanation: item.explanation,
    ...(item.translation ? { translation: item.translation } : {}),
    ...(Array.isArray(item.vocab) ? { vocab: item.vocab.map((v) => ({ word: v.word, meaning: v.meaning })) } : {})
  })));
}

module.exports = { LEVEL_PROFILES, createSelfStudyItems };
