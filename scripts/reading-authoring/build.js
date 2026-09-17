"use strict";
// node build.js check    -> 형식 검사 + 선지 순서 확정 + 풀이지 생성
// node build.js publish  -> 검사 통과본을 저장소 데이터 파일로 쓴다
const fs = require("fs");
const path = require("path");

const DIR = __dirname;
const OUT = {
  ko: path.resolve(__dirname, "../../game-hub-server/data/reading-self-study-ko-v1.json"),
  en: path.resolve(__dirname, "../../game-hub-server/data/reading-self-study-en-v1.json")
};
const TRACKS = {
  ko: { prefix: "K", file: (n) => `level${n}.json`, blind: (n) => `blind${n}.txt`, full: (n) => `full${n}.txt` },
  en: { prefix: "E", file: (n) => `en${n}.json`, blind: (n) => `blindE${n}.txt`, full: (n) => `fullE${n}.txt` }
};
const CHOICES = { 1: 4, 2: 4, 3: 5, 4: 5 };
const EN_WORDS = { 1: [20, 40], 2: [40, 70], 3: [70, 110], 4: [100, 150] };
const CUE = /(항상|절대|전혀|반드시|오직|무조건|완전히)/u;
const CUE_EN = /\b(always|never|only|all|none|every|completely)\b/i;
const HANGUL = /[가-힣]/;

function hash(text) {
  let h = 2166136261;
  for (const ch of text) { h ^= ch.codePointAt(0); h = Math.imul(h, 16777619) >>> 0; }
  return h;
}

const problems = [];
const all = [];
for (const [track, spec] of Object.entries(TRACKS)) {
  for (const level of [1, 2, 3, 4]) {
    const file = path.join(DIR, spec.file(level));
    if (!fs.existsSync(file)) continue;
    const items = JSON.parse(fs.readFileSync(file, "utf8"));
    const titles = new Set();
    items.forEach((item, order) => {
      const bad = (msg) => problems.push(`${item.id}: ${msg}`);
      if (!new RegExp(`^${spec.prefix}${level}-\\d{2}$`).test(item.id)) bad("id 형식");
      if (titles.has(item.topicTitle)) bad(`소재 중복 ${item.topicTitle}`);
      titles.add(item.topicTitle);
      if (!Array.isArray(item.choices) || item.choices.length !== CHOICES[level]) bad(`선지 수 ${item.choices?.length}`);
      if (!(item.correctIndex >= 0 && item.correctIndex < item.choices.length)) bad("correctIndex");
      if (new Set(item.choices).size !== item.choices.length) bad("선지 중복");
      if (!item.explanation || /[①-⑤]|선지|\d번(은|이|을|도|과)?\s*(정답|오답)/.test(item.explanation)) bad("해설 비었거나 번호 언급");
      const answer = item.choices[item.correctIndex];
      if (item.passageText.includes(answer.replace(/[.?]$/, ""))) bad("정답이 지문 복사");
      const englishChoices = track === "en" && level === 4;
      item.choices.forEach((choice, i) => {
        const c = choice.trim();
        if (i !== item.correctIndex && (englishChoices ? CUE_EN : CUE).test(c)) bad(`오답 극단어: ${c}`);
        if (track === "ko") {
          if (level === 1 && !/(니다\.?|니까\?)$/.test(c)) bad(`1급 선지 습니다체 아님: ${c}`);
          if (level > 1 && /니다\.?$/.test(c)) bad(`${level}급 선지가 습니다체: ${c}`);
        } else if (englishChoices) {
          if (HANGUL.test(c)) bad(`E4 선지에 한글: ${c}`);
        } else {
          if (!HANGUL.test(c)) bad(`E${level} 선지가 우리말 아님: ${c}`);
          if (level === 1 && !/(니다\.?|니까\?)$/.test(c)) bad(`E1 선지 습니다체 아님: ${c}`);
          if (level > 1 && /니다\.?$/.test(c)) bad(`E${level} 선지가 습니다체: ${c}`);
        }
      });
      if (track === "ko") {
        const sentences = item.passageText.split(/(?<=[.?!])\s+/).filter(Boolean);
        if (level === 1) sentences.forEach((s) => { if (!/(니다|니까)[.?!]?["”']?$/.test(s.trim())) bad(`1급 지문 습니다체 아님: ${s}`); });
        if (level === 1 && !/(요\.|니다\.|니까\?)$/.test(item.promptText.trim())) bad("1급 발문 어미");
        if (level === 4 && item.passageText.length > 430) bad(`지문 길이 ${item.passageText.length}`);
      } else {
        if (HANGUL.test(item.passageText)) bad("영어 지문에 한글");
        if (!HANGUL.test(item.promptText)) bad("발문이 우리말 아님");
        const words = (item.passageText.match(/[A-Za-z]+(?:['’-][A-Za-z]+)*/g) || []).length;
        const [lo, hi] = EN_WORDS[level];
        if (words < lo || words > hi) bad(`낱말 수 ${words} (기준 ${lo}~${hi})`);
        if (!item.translation || !HANGUL.test(item.translation)) bad("우리말 해석 없음");
        if (!Array.isArray(item.vocab) || item.vocab.length < 3) bad("낱말 풀이 3개 미만");
        else item.vocab.forEach((v) => { if (!v?.word || !v?.meaning || !HANGUL.test(v.meaning)) bad(`낱말 풀이 형식: ${JSON.stringify(v)}`); });
      }
      const lengths = item.choices.map((c) => c.length);
      const others = lengths.filter((_, i) => i !== item.correctIndex);
      if (answer.length > Math.max(...others) * 1.25) bad(`정답만 김 (${answer.length} vs ${Math.max(...others)})`);
      all.push({ ...item, track, level, order });
    });
  }
}

// 선지 순서 확정: 트랙·급마다 정답 자리를 고르게 돌린다.
const finalItems = [];
for (const track of Object.keys(TRACKS)) {
  for (const level of [1, 2, 3, 4]) {
    const items = all.filter((item) => item.track === track && item.level === level)
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
}
finalItems.sort((a, b) => a.id.localeCompare(b.id));

const mode = process.argv[2] || "check";
if (mode === "check") {
  fs.writeFileSync(path.join(DIR, "shuffled.json"), JSON.stringify(finalItems, null, 2));
  for (const [track, spec] of Object.entries(TRACKS)) {
    for (const level of [1, 2, 3, 4]) {
      const set = finalItems.filter((item) => item.track === track && item.level === level);
      if (!set.length) continue;
      const blind = set.map((item) =>
        `[${item.id}] ${item.promptText}\n` + item.choices.map((c, i) => `${i + 1}. ${c}`).join("\n")
      ).join("\n\n");
      const full = set.map((item) =>
        `[${item.id}] (${item.topicTitle})\n${item.passageText}\n\n${item.promptText}\n`
        + item.choices.map((c, i) => `${i + 1}. ${c}`).join("\n")
      ).join("\n\n-----\n\n");
      fs.writeFileSync(path.join(DIR, spec.blind(level)), blind);
      fs.writeFileSync(path.join(DIR, spec.full(level)), full);
    }
  }
  const key = Object.fromEntries(finalItems.map((item) => [item.id, item.correctIndex + 1]));
  fs.writeFileSync(path.join(DIR, "answer-key.json"), JSON.stringify(key, null, 2));
  console.log(`문항 ${finalItems.length}개`);
  console.log(problems.length ? `문제 ${problems.length}건:\n` + problems.join("\n") : "형식 문제 없음");
} else if (mode === "publish") {
  if (problems.length) { console.error(problems.join("\n")); process.exit(1); }
  const excluded = new Set(JSON.parse(fs.readFileSync(path.join(DIR, "excluded.json"), "utf8")));
  for (const track of Object.keys(TRACKS)) {
    const published = finalItems.filter((item) => item.track === track && !excluded.has(item.id)).map((item) => ({
      id: item.id,
      level: item.level,
      topicTitle: item.topicTitle,
      questionType: item.questionType,
      passageText: item.passageText,
      promptText: item.promptText,
      choices: item.choices,
      correctIndex: item.correctIndex,
      explanation: item.explanation,
      ...(track === "en" ? { translation: item.translation, vocab: item.vocab } : {})
    }));
    if (!published.length) continue;
    fs.writeFileSync(OUT[track], JSON.stringify({ schemaVersion: 1, items: published }, null, 2) + "\n");
    console.log(`저장 ${published.length}개 -> ${OUT[track]}`);
  }
}
