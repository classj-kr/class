/*
 * 단계별 문제 풀기 화면(v2/quiz/NN/)에 심어 둔 문항을 한 파일로 모은다.
 *   node _build-race-data.js
 * 학급 순위전(learning/class-race)이 이 파일 하나만 읽으면 되도록 한다.
 * 문제를 고친 뒤에는 이 도구를 다시 돌려야 순위전에도 반영된다.
 * 이 파일은 어느 페이지에서도 불러 쓰지 않는 도구다.
 */
const fs = require("fs");
const path = require("path");

const quizRoot = path.join(__dirname, "v2", "quiz");
const outFile = path.join(quizRoot, "race-data.js");

const stages = fs.readdirSync(quizRoot)
  .filter((name) => /^\d+$/.test(name))
  .sort((a, b) => Number(a) - Number(b));

const questions = [];
const problems = [];
// 순위전은 예문 없이 낱말만 보여 준다. 흔한 다른 한자 표기 때문에 뜻이 갈리는 문항은 뺀다(단계 문제에는 그대로 둔다).
const excluded = new Set(JSON.parse(fs.readFileSync(path.join(__dirname, "race-exclude.json"), "utf8")).items.map((item) => `${item.target}|${item.answer}`));
let skipped = 0;

for (const stage of stages) {
  const file = path.join(quizRoot, stage, "index.html");
  if (!fs.existsSync(file)) { problems.push(`${stage}단계: index.html 이 없다`); continue; }
  const html = fs.readFileSync(file, "utf8");
  const block = html.match(/<script type="application\/json"[^>]*>([\s\S]*?)<\/script>/);
  if (!block) { problems.push(`${stage}단계: 문항 묶음을 찾지 못했다`); continue; }

  let items;
  try {
    items = JSON.parse(block[1]);
  } catch (error) {
    problems.push(`${stage}단계: 문항 묶음을 읽지 못했다 (${error.message})`);
    continue;
  }

  items.forEach((item, index) => {
    const options = Array.isArray(item.options) ? item.options : [];
    const correct = options.filter((option) => option.correct);
    if (options.length < 2 || options.length > 4) {
      problems.push(`${stage}단계 ${index + 1}번: 보기가 ${options.length}개`);
      return;
    }
    if (correct.length !== 1) {
      problems.push(`${stage}단계 ${index + 1}번: 정답이 ${correct.length}개`);
      return;
    }
    const words = options.map((option) => String(option.word || "").trim());
    if (words.some((word) => !word) || new Set(words).size !== words.length) {
      problems.push(`${stage}단계 ${index + 1}번: 보기 낱말이 비었거나 겹친다`);
      return;
    }
    if (excluded.has(`${item.target}|${correct[0].word}`)) { skipped += 1; return; }
    questions.push({
      id: `hj-${Number(stage)}-${index + 1}`,
      stage: Number(stage),
      target: String(item.target || ""),
      reading: String(item.reading || ""),
      prompt: String(item.prompt || "").trim(),
      note: String(item.note || "").trim(),
      words,
      answer: String(correct[0].word || "").trim()
    });
  });
}

if (problems.length) {
  console.log("\n어긋난 문항:");
  problems.forEach((line) => console.log(" -", line));
}

const body = [
  "/*",
  " * 단계별 문제 풀기 화면에서 모은 한자 문항. 학급 순위전이 읽는다.",
  " * 손으로 고치지 말 것 — `node ../../_build-race-data.js` 로 다시 만든다.",
  " * 문항 모양: { id, stage, target, reading, prompt, note, words[], answer }",
  " */",
  "window.HANJA_RACE = " + JSON.stringify(questions, null, 1) + ";",
  ""
].join("\n");

fs.writeFileSync(outFile, body);
const stageCount = new Set(questions.map((question) => question.stage)).size;
console.log(`\n${stageCount}단계 · ${questions.length}문항 (예문 없이 뜻이 갈려 뺀 문항 ${skipped}) → ${path.relative(process.cwd(), outFile)}`);
