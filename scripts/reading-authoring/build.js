"use strict";
// node build.js check    -> 형식 검사 + 선지 순서 확정 + 풀이지 생성
// node build.js publish  -> 검사 통과본을 저장소 데이터 파일로 쓴다
const fs = require("fs");
const path = require("path");

const DIR = __dirname;
const OUT = path.resolve(__dirname, "../../game-hub-server/data/reading-self-study-ko-v1.json");
const CHOICES = { 1: 4, 2: 4, 3: 5, 4: 5 };
const CUE = /(항상|절대|전혀|반드시|오직|무조건|완전히)/u;

function hash(text) {
  let h = 2166136261;
  for (const ch of text) { h ^= ch.codePointAt(0); h = Math.imul(h, 16777619) >>> 0; }
  return h;
}

const problems = [];
const all = [];
for (const level of [1, 2, 3, 4]) {
  const file = path.join(DIR, `level${level}.json`);
  if (!fs.existsSync(file)) continue;
  const items = JSON.parse(fs.readFileSync(file, "utf8"));
  const titles = new Set();
  items.forEach((item, order) => {
    const where = `${item.id}`;
    const bad = (msg) => problems.push(`${where}: ${msg}`);
    if (!new RegExp(`^K${level}-\\d{2}$`).test(item.id)) bad("id 형식");
    if (titles.has(item.topicTitle)) bad(`소재 중복 ${item.topicTitle}`);
    titles.add(item.topicTitle);
    if (!Array.isArray(item.choices) || item.choices.length !== CHOICES[level]) bad(`선지 수 ${item.choices?.length}`);
    if (!(item.correctIndex >= 0 && item.correctIndex < item.choices.length)) bad("correctIndex");
    if (new Set(item.choices).size !== item.choices.length) bad("선지 중복");
    if (!item.explanation || /[①-⑤]|선지|\d번(은|이|을|도|과)?\s*(정답|오답)/.test(item.explanation)) bad("해설 비었거나 번호 언급");
    const answer = item.choices[item.correctIndex];
    if (item.passageText.includes(answer.replace(/[.]$/, ""))) bad("정답이 지문 복사");
    item.choices.forEach((choice, i) => {
      if (i !== item.correctIndex && CUE.test(choice)) bad(`오답 극단어: ${choice}`);
      if (level === 1 && !/(니다\.?|니까\?)$/.test(choice.trim())) bad(`1급 선지 습니다체 아님: ${choice}`);
      if (level > 1 && /니다\.?$/.test(choice.trim())) bad(`${level}급 선지가 습니다체: ${choice}`);
    });
    const sentences = item.passageText.split(/(?<=[.?!])\s+/).filter(Boolean);
    if (level === 1) sentences.forEach((s) => { if (!/(니다|니까)[.?!]?["”']?$/.test(s.trim())) bad(`1급 지문 습니다체 아님: ${s}`); });
    if (level === 1 && !/(요\.|니다\.|니까\?)$/.test(item.promptText.trim())) bad("1급 발문 어미");
    if (level === 4 && item.passageText.length > 430) bad(`지문 길이 ${item.passageText.length}`);
    const lengths = item.choices.map((c) => c.length);
    const others = lengths.filter((_, i) => i !== item.correctIndex);
    if (answer.length > Math.max(...others) * 1.25) bad(`정답만 김 (${answer.length} vs ${Math.max(...others)})`);
    all.push({ ...item, level, order });
  });
}

// 선지 순서 확정: 급마다 정답 자리를 고르게 돌린다.
const finalItems = [];
for (const level of [1, 2, 3, 4]) {
  const items = all.filter((item) => item.level === level)
    .sort((a, b) => hash(a.id) - hash(b.id));
  items.forEach((item, rank) => {
    const n = item.choices.length;
    const target = rank % n;
    const answer = item.choices[item.correctIndex];
    const wrong = item.choices.filter((_, i) => i !== item.correctIndex)
      .sort((a, b) => hash(item.id + a) - hash(item.id + b));
    wrong.splice(target, 0, answer);
    finalItems.push({ ...item, choices: wrong, correctIndex: target });
  });
}
finalItems.sort((a, b) => a.id.localeCompare(b.id));

const mode = process.argv[2] || "check";
if (mode === "check") {
  fs.writeFileSync(path.join(DIR, "shuffled.json"), JSON.stringify(finalItems, null, 2));
  for (const level of [1, 2, 3, 4]) {
    const set = finalItems.filter((item) => item.level === level);
    const blind = set.map((item) =>
      `[${item.id}] ${item.promptText}\n` + item.choices.map((c, i) => `${i + 1}. ${c}`).join("\n")
    ).join("\n\n");
    const full = set.map((item) =>
      `[${item.id}] (${item.topicTitle})\n${item.passageText}\n\n${item.promptText}\n`
      + item.choices.map((c, i) => `${i + 1}. ${c}`).join("\n")
    ).join("\n\n-----\n\n");
    fs.writeFileSync(path.join(DIR, `blind${level}.txt`), blind);
    fs.writeFileSync(path.join(DIR, `full${level}.txt`), full);
  }
  const key = Object.fromEntries(finalItems.map((item) => [item.id, item.correctIndex + 1]));
  fs.writeFileSync(path.join(DIR, "answer-key.json"), JSON.stringify(key, null, 2));
  console.log(`문항 ${finalItems.length}개`);
  console.log(problems.length ? `문제 ${problems.length}건:\n` + problems.join("\n") : "형식 문제 없음");
} else if (mode === "publish") {
  if (problems.length) { console.error(problems.join("\n")); process.exit(1); }
  const excluded = new Set(JSON.parse(fs.readFileSync(path.join(DIR, "excluded.json"), "utf8")));
  const published = finalItems.filter((item) => !excluded.has(item.id)).map((item) => ({
    id: item.id,
    level: item.level,
    topicTitle: item.topicTitle,
    questionType: item.questionType,
    passageText: item.passageText,
    promptText: item.promptText,
    choices: item.choices,
    correctIndex: item.correctIndex,
    explanation: item.explanation
  }));
  fs.writeFileSync(OUT, JSON.stringify({ schemaVersion: 1, items: published }, null, 2) + "\n");
  console.log(`저장 ${published.length}개 -> ${OUT}`);
}
