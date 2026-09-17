"use strict";

// 비문학 자습 문항 (2026-09-17 교체)
//
// 예전(v2)에는 주제별 문장 조각을 조합해 896문항을 자동으로 만들었다.
// 그렇게 만든 문항은 지문이 논증 중간 토막이 되고, 정답이 교훈 같은
// 바른말이라 지문을 읽지 않아도 풀렸다. 지금은 지문·문제·선지·해설을
// 한 세트로 쓴 문항만 싣는다. 각 문항은 "지문 없이 선지만 보고 풀면
// 틀리고, 지문을 읽고 풀면 맞힌다"는 검사를 통과한 것이다.
// 영어 비문학은 폐지했다.
const BANK = require("./reading-self-study-ko-v1.json");

const LEVEL_PROFILES = Object.freeze({
  1: { focus: "사실 확인과 직접 적용", choiceCount: 4 },
  2: { focus: "추론과 인과 관계", choiceCount: 4 },
  3: { focus: "정보 종합과 조건 판단", choiceCount: 5 },
  4: { focus: "근거 적용과 범위 평가", choiceCount: 5 }
});

function createSelfStudyItems() {
  return BANK.items.map((item) => ({
    id: item.id,
    familyId: item.id,
    topicTitle: item.topicTitle,
    track: "ko",
    targetLevel: item.level,
    skillFocus: LEVEL_PROFILES[item.level].focus,
    questionType: item.questionType,
    passageText: item.passageText,
    promptText: item.promptText,
    choices: item.choices.slice(),
    correctIndex: item.correctIndex,
    explanation: item.explanation
  }));
}

module.exports = { LEVEL_PROFILES, createSelfStudyItems };
