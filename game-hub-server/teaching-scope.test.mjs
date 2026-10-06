import assert from "node:assert/strict";
import test from "node:test";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { parseGrades, parseTeachingScope, formatTeachingScope, normalizePairs, coversPair } = require("./teaching-scope.js");

test("담당 학년 칸: 쉼표·가운뎃점·물결·'학년' 다 읽는다", () => {
  assert.deepEqual(parseGrades("3,4,5,6"), [3, 4, 5, 6]);
  assert.deepEqual(parseGrades("3·4"), [3, 4]);
  assert.deepEqual(parseGrades("3~6"), [3, 4, 5, 6]);
  assert.deepEqual(parseGrades("5학년, 6학년"), [5, 6]);
  assert.deepEqual(parseGrades(" 6 "), [6]);
  assert.deepEqual(parseGrades(""), []);
  assert.deepEqual(parseGrades("0, 13, x"), []);
});

test("담당 과목 칸: 과목마다 괄호 학년, 괄호가 없으면 담당 학년을 따른다", () => {
  assert.deepEqual(parseTeachingScope("3,4,5,6", "음악, 영어"), {
    pairs: [{ grade: 3, subject: "음악" }, { grade: 4, subject: "음악" }, { grade: 5, subject: "음악" }, { grade: 6, subject: "음악" },
      { grade: 3, subject: "영어" }, { grade: 4, subject: "영어" }, { grade: 5, subject: "영어" }, { grade: 6, subject: "영어" }],
    subjects: ["음악", "영어"]
  });
  assert.deepEqual(parseTeachingScope("", "음악(3,4), 영어(5,6)").pairs, [{ grade: 3, subject: "음악" }, { grade: 4, subject: "음악" }, { grade: 5, subject: "영어" }, { grade: 6, subject: "영어" }]);
  assert.deepEqual(parseTeachingScope("5,6", "음악(3·4), 영어").pairs, [{ grade: 3, subject: "음악" }, { grade: 4, subject: "음악" }, { grade: 5, subject: "영어" }, { grade: 6, subject: "영어" }]);
  // 학년 없이 과목만 적으면 과목은 남고 짝은 없다(아직 어느 학년도 못 고친다).
  assert.deepEqual(parseTeachingScope("", "체육"), { pairs: [], subjects: ["체육"] });
  assert.deepEqual(parseTeachingScope("6", "바른 생활 (1)").pairs, [{ grade: 1, subject: "바른 생활" }]);
  assert.deepEqual(parseTeachingScope("3", "음악, 음악").subjects, ["음악"]);
  assert.deepEqual(parseTeachingScope("3", ""), { pairs: [], subjects: [] });
});

test("짝 목록 → 명단 칸 글: 학년이 같으면 한 번만, 다르면 괄호", () => {
  assert.deepEqual(formatTeachingScope(parseTeachingScope("3,4,5,6", "음악, 영어").pairs), { gradeText: "3,4,5,6", subjectText: "음악, 영어" });
  assert.deepEqual(formatTeachingScope([{ grade: 3, subject: "음악" }, { grade: 4, subject: "음악" }, { grade: 5, subject: "영어" }, { grade: 6, subject: "영어" }]), { gradeText: "3,4,5,6", subjectText: "음악(3,4), 영어(5,6)" });
  assert.deepEqual(formatTeachingScope([]), { gradeText: "", subjectText: "" });
  assert.deepEqual(formatTeachingScope('[{"grade":"6","subject":"영어"}]'), { gradeText: "6", subjectText: "영어" });
});

test("짝 품기: 띄어쓰기는 무시, 학년은 숫자로 견준다", () => {
  const pairs = normalizePairs([{ grade: 6, subject: "영어" }, { grade: "1", subject: "바른 생활" }, { grade: 99, subject: "x" }, { grade: 2, subject: "" }]);
  assert.deepEqual(pairs, [{ grade: 6, subject: "영어" }, { grade: 1, subject: "바른 생활" }]);
  assert.equal(coversPair(pairs, "6", "영어"), true);
  assert.equal(coversPair(pairs, 1, "바른생활"), true);
  assert.equal(coversPair(pairs, 5, "영어"), false);
  assert.equal(coversPair(pairs, 6, "수학"), false);
});
