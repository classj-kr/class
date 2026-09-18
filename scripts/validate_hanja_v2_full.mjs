import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const lessonRoot = path.join(root, 'learning', 'literacy-numeracy', 'hanja-meaning', 'v2');
const files = ['hanja-v2-lessons-01.json', 'hanja-v2-lessons-02.json', 'hanja-v2-lessons-03.json', 'hanja-v2-lessons-04.json', 'hanja-v2-lessons-05.json', 'hanja-v2-lessons-06.json', 'hanja-v2-lessons-07.json'];
const lessons = files.flatMap((name) => JSON.parse(fs.readFileSync(path.join(import.meta.dirname, name), 'utf8')));
const curriculum = JSON.parse(fs.readFileSync(path.join(import.meta.dirname, 'hanja-curriculum-v2.json'), 'utf8'));
const standard = JSON.parse(fs.readFileSync(path.join(import.meta.dirname, 'hanja-grade6-300.json'), 'utf8'));
const strokes = JSON.parse(fs.readFileSync(path.join(import.meta.dirname, 'hanja-strokes.json'), 'utf8'));
const expansionSelection = JSON.parse(fs.readFileSync(path.join(import.meta.dirname, 'hanja-csat-expansion-selection.json'), 'utf8'));
// 문제를 낼 수 없는 글자와 그 까닭
const noQuestion = JSON.parse(fs.readFileSync(path.join(import.meta.dirname, 'hanja-no-question-characters.json'), 'utf8')).characters;
// 우리말에서 쓰이는 낱말이 한둘뿐이라 보기를 셋까지 못 채우는 글자
const fewExamples = JSON.parse(fs.readFileSync(path.join(import.meta.dirname, 'hanja-few-example-characters.json'), 'utf8')).characters;
const subjectBatch = JSON.parse(fs.readFileSync(path.join(import.meta.dirname, 'hanja-v2-lessons-07.json'), 'utf8'));
const subjectCharacters = new Set(subjectBatch.flatMap((lesson) => lesson.characters.map((item) => item.character)));
const expectedCharacterCount = 310 + [...expansionSelection.characters].length + subjectCharacters.size;
const errors = [];
const normalize = (character) => ({ 强: '強' }[character] || character);
const allCharacters = new Set();
let examples = 0;
let questions = 0;
let hanjaFeedback = 0;
let nonHanjaFeedback = 0;

if (curriculum.lessons.length !== lessons.length) errors.push('커리큘럼 차시 수가 수업 데이터와 다릅니다.');

for (const [lessonIndex, lesson] of lessons.entries()) {
  const number = lessonIndex + 1;
  const slug = String(number).padStart(3, '0');
  const lessonCharacters = lesson.characters.map((item) => item.character);
  if (lessonCharacters.length < 2 || lessonCharacters.length > 3) errors.push(`${slug}: 한 차시는 2~3자여야 합니다.`);
  if (new Set(lessonCharacters).size !== lessonCharacters.length) errors.push(`${slug}: 한 차시 안에 같은 글자가 반복됩니다.`);
  if (lesson.term !== lessonCharacters.join('')) errors.push(`${slug}: term과 글자 카드의 순서가 다릅니다.`);
  // 문제는 글자마다 하나씩이되, 우리말에 같은 소리 다른 한자가 없어 문제가 성립하지 않는 글자는 문제 없이 가르친다
  if (lesson.questions.length > lesson.characters.length) errors.push(`${slug}: 문제가 글자 수보다 많습니다.`);
  const questionTargets = lesson.questions.map((question) => question.target);
  if (new Set(questionTargets).size !== questionTargets.length) errors.push(`${slug}: 한 글자에 문제가 둘 이상입니다.`);
  for (const character of lesson.characters) {
    if (questionTargets.includes(character.character)) continue;
    if (!noQuestion[character.character]) errors.push(`${slug} ${character.character}: 문제가 없는데 까닭이 적혀 있지 않습니다.`);
  }
  if (curriculum.lessons[lessonIndex]?.term !== lesson.term) errors.push(`${slug}: 커리큘럼 term이 다릅니다.`);
  lessonCharacters.forEach((character) => {
    const normalized = normalize(character);
    if (allCharacters.has(normalized)) errors.push(`${slug} ${character}: 다른 차시에 이미 배치된 글자입니다.`);
    allCharacters.add(normalized);
  });

  for (const character of lesson.characters) {
    if (!Array.isArray(character.hunEum) || character.hunEum.length === 0) errors.push(`${slug} ${character.character}: 훈음이 없습니다.`);
    if (!Array.isArray(strokes[character.character]) || strokes[character.character].length === 0) errors.push(`${slug} ${character.character}: 필순이 없습니다.`);
    const leastExamples = fewExamples[character.character] ? 1 : 3;
    if (!Array.isArray(character.examples) || character.examples.length < leastExamples) {
      errors.push(`${slug} ${character.character}: 예문이 ${leastExamples}개 미만입니다.`);
    }
    examples += character.examples.length;
    for (const [term, hanja, sentence] of character.examples || []) {
      if (![...hanja].includes(character.character)) errors.push(`${slug} ${character.character}: ${term}의 한자어에 목표 글자가 없습니다.`);
      if (!sentence.includes(term)) errors.push(`${slug} ${character.character}: ${term} 예문에 낱말이 없습니다.`);
      if (/^자료에서 .+의 의미와 쓰임|^두 글에서 .+사용된 맥락|^발표문에서 .+관련된 근거|^문장의 앞뒤를 살펴|__MISSING_EXAMPLE__/.test(sentence)) errors.push(`${slug} ${character.character}: ${term}에 자동 생성 상투 문형이 남았습니다.`);
      if (/[?？]/.test(sentence) || !/(다|요|니다)\.$/.test(sentence)) errors.push(`${slug} ${character.character}: ${term} 예문이 완결된 서술문이 아닙니다.`);
    }
  }

  for (const question of lesson.questions) {
    questions += 1;
    const character = lesson.characters.find((item) => item.character === question.target);
    if (!character) { errors.push(`${slug}: 문제 목표 글자가 카드에 없습니다.`); continue; }
    // 같은 소리 다른 한자 낱말이 없는 글자의 훈음 고르기 문제: 보기 넷이 서로 다른 훈음이고 정답이 목표 글자의 훈음
    if (question.type === 'huneum') {
      const huTarget = lesson.characters.find((item) => item.character === question.target);
      const huRight = (huTarget?.hunEum || []).map((item) => `${item.hun} ${item.eum}`)[0];
      if (question.options.length !== 4 || new Set(question.options.map((option) => option[0])).size !== 4) errors.push(`${slug} ${question.target}: 훈음 보기는 서로 다른 넷이어야 합니다.`);
      if (question.options[question.answer]?.[0] !== huRight) errors.push(`${slug} ${question.target}: 정답이 목표 글자의 훈음이 아닙니다.`);
      if (!question.note.startsWith(`‘${question.target}’`)) errors.push(`${slug} ${question.target}: 훈음 문제 해설은 목표 글자로 시작해야 합니다.`);
      continue;
    }
    const leastOptions = fewExamples[question.target] ? 3 : 4;
    if (question.options.length !== 4 && question.options.length !== leastOptions) {
      errors.push(`${slug} ${question.target}: 보기가 ${leastOptions}개가 아닙니다.`);
    }
    if (new Set(question.options.map((option) => option[0])).size !== question.options.length) errors.push(`${slug} ${question.target}: 같은 보기 낱말이 반복됩니다.`);
    const contains = question.options.map((option) => [...option[1]].includes(question.target));
    if (contains.filter(Boolean).length !== question.options.length - 1) {
      errors.push(`${slug} ${question.target}: 목표 한자가 없는 보기는 하나여야 합니다.`);
    }
    if (contains[question.answer] !== false) errors.push(`${slug} ${question.target}: 정답 번호가 목표 한자가 없는 보기를 가리키지 않습니다.`);
    const correctWord = question.options[question.answer]?.[0] || '';
    if (!question.note.startsWith(`‘${correctWord}’`)) errors.push(`${slug} ${question.target}: 정답 해설이 정답 낱말로 시작하지 않습니다.`);
    if (/글자가 쓰입니다|쓰이지 않습니다|·/.test(question.note)) errors.push(`${slug} ${question.target}: 예전 나열식 해설이 남았습니다.`);
    if (/’[을를] 씁니다\.$/.test(question.note)) hanjaFeedback += 1;
    else if (/(?:한자음이 아닙니다|외래어이므로 한자를 쓰지 않습니다)\.$/.test(question.note)) nonHanjaFeedback += 1;
    else errors.push(`${slug} ${question.target}: 정답 해설 형식이 올바르지 않습니다.`);
    const readings = character.reading.split('·').filter(Boolean);
    // 우리말에 같은 소리 다른 한자가 없는 글자(冷·層)는 정답 보기만 소리가 다를 수 있다
    const soundChecked = question.noHomophone ? question.options.slice(0, 3) : question.options;
    for (const option of soundChecked) {
      if (!readings.some((reading) => option[0].includes(reading))) errors.push(`${slug} ${question.target}: ${option[0]}에 표시 독음이 없습니다.`);
      if (!option[2].includes(`{{${option[0]}}}`)) errors.push(`${slug} ${question.target}: ${option[0]} 밑줄 표시가 없습니다.`);
    }
  }

  const pagePath = path.join(lessonRoot, slug, 'index.html');
  if (!fs.existsSync(pagePath)) { errors.push(`${slug}: 페이지가 없습니다.`); continue; }
  const html = fs.readFileSync(pagePath, 'utf8');
  if (!html.includes(`${number} / ${lessons.length}`)) errors.push(`${slug}: 전체 차시 표시가 틀렸습니다.`);
  if ((html.match(/class="meaning-card"/g) || []).length !== lesson.characters.length) errors.push(`${slug}: 뜻 카드 수가 다릅니다.`);
  if ((html.match(/class="question" data-answer=/g) || []).length !== lesson.questions.length) errors.push(`${slug}: 문제 카드 수가 다릅니다.`);
  if ((html.match(/class="stroke-set"/g) || []).length !== lesson.characters.length) errors.push(`${slug}: 획순 글자 그룹 수가 다릅니다.`);
  if ((html.match(/class="stroke-set"[^>]* hidden/g) || []).length !== lesson.characters.length - 1) errors.push(`${slug}: 처음 선택하지 않은 획순 그룹이 숨겨지지 않았습니다.`);
  if (!html.includes('.stroke-set[hidden]{display:none}') || !html.includes("toggleAttribute('hidden'")) errors.push(`${slug}: SVG 획순 그룹 전환 장치가 없습니다.`);
  if (!html.includes("feedback.textContent='다시 생각해 보세요.'") || !html.includes("feedback.textContent='맞았습니다. '+q.dataset.note")) errors.push(`${slug}: 정답·오답 해설 동작이 올바르지 않습니다.`);
  if (/<details|펼쳐 보기|>더 보기</.test(html)) errors.push(`${slug}: 예문을 감추는 펼치기 UI가 있습니다.`);
  if (/MISSING|\uFFFD/.test(html)) errors.push(`${slug}: 깨진 데이터 표지가 있습니다.`);
}

const missingStandard = [...standard.characters].map(normalize).filter((character) => !allCharacters.has(character));
if (missingStandard.length) errors.push(`공식 300자 누락: ${[...new Set(missingStandard)].join('')}`);
if (allCharacters.size !== expectedCharacterCount) errors.push(`전체 고유 글자: ${allCharacters.size} (예상 ${expectedCharacterCount})`);
const expectedQuestions = allCharacters.size - Object.keys(noQuestion).length;
if (questions !== expectedQuestions) errors.push(`전체 문제: ${questions} (예상 ${expectedQuestions} = 글자 ${allCharacters.size} - 문제를 낼 수 없는 글자 ${Object.keys(noQuestion).length})`);

const progress = fs.readFileSync(path.join(lessonRoot, 'index.html'), 'utf8');
const progressLinks = [...progress.matchAll(/class="lesson-item" href="\.\/(\d{3})\//g)].map((match) => match[1]);
if (progressLinks.length !== lessons.length) errors.push(`진도표 링크: ${progressLinks.length} (예상 ${lessons.length})`);
if (!progress.includes(`${lessons.length}차시 · ${allCharacters.size}자`)) errors.push('진도표의 전체 차시·글자 수가 틀렸습니다.');

const stageSize = 14;
const stageCount = Math.ceil(lessons.length / stageSize);
const stageQuizLinks = [...progress.matchAll(/class="stage-quiz" href="\.\/quiz\/(\d{2})\//g)].map((match) => match[1]);
if (stageQuizLinks.length !== stageCount) errors.push(`단계 문제 풀기 링크: ${stageQuizLinks.length} (예상 ${stageCount})`);
if (/\d+~\d+차시 · \d+개/.test(progress)) errors.push('단계 머리말에 불필요한 차시 범위·개수 표시가 남았습니다.');
if (!progress.includes('class="stage-toggle"') || !progress.includes('class="stage-quiz"')) errors.push('단계 열기와 문제 풀기 버튼이 분리되지 않았습니다.');
if ((progress.match(/class="stage-toggle"[^>]*aria-expanded="true"/g) || []).length !== 0) errors.push('진도표에서 단계가 자동으로 펼쳐집니다.');
if ((progress.match(/class="lesson-list"[^>]* hidden/g) || []).length !== stageCount) errors.push('진도표의 모든 단계 목록이 처음에 닫혀 있지 않습니다.');

let stageQuizQuestions = 0;
for (let stageIndex = 0; stageIndex < stageCount; stageIndex += 1) {
  const stageNumber = stageIndex + 1;
  const stageSlug = String(stageNumber).padStart(2, '0');
  const stageLessons = lessons.slice(stageIndex * stageSize, (stageIndex + 1) * stageSize);
  const expectedQuestions = stageLessons.reduce((sum, lesson) => sum + lesson.questions.length, 0);
  const quizPath = path.join(lessonRoot, 'quiz', stageSlug, 'index.html');
  if (!fs.existsSync(quizPath)) { errors.push(`${stageNumber}단계: 문제 풀기 페이지가 없습니다.`); continue; }
  const quizHtml = fs.readFileSync(quizPath, 'utf8');
  const dataMatch = quizHtml.match(/<script type="application\/json" id="quiz-data">([\s\S]*?)<\/script>/);
  if (!dataMatch) { errors.push(`${stageNumber}단계: 문제 데이터가 없습니다.`); continue; }
  let quizData;
  try { quizData = JSON.parse(dataMatch[1]); } catch { errors.push(`${stageNumber}단계: 문제 데이터 JSON이 깨졌습니다.`); continue; }
  stageQuizQuestions += quizData.length;
  if (quizData.length !== expectedQuestions) errors.push(`${stageNumber}단계: 문제 ${quizData.length}개 (예상 ${expectedQuestions}개)`);
  const expectedSource = stageLessons.flatMap((lesson) => lesson.questions.map((question) => ({
    target: question.target,
    note: question.note,
    options: question.options.map((option, optionIndex) => ({ word: option[0], sentence: option[2], correct: optionIndex === question.answer }))
  })));
  for (const [questionIndex, expected] of expectedSource.entries()) {
    const actual = quizData[questionIndex];
    if (!actual || actual.target !== expected.target || actual.note !== expected.note || JSON.stringify(actual.options) !== JSON.stringify(expected.options)) errors.push(`${stageNumber}단계 ${questionIndex + 1}번: 원본 문제·선지 내용이 달라졌습니다.`);
  }
  for (const question of quizData) {
    const wanted = fewExamples[question.target] ? 3 : 4;
    if (question.options.length !== 4 && question.options.length !== wanted) {
      errors.push(`${stageNumber}단계 ${question.target}: 선지가 ${wanted}개가 아닙니다.`);
    }
    if (question.options.filter((option) => option.correct).length !== 1) errors.push(`${stageNumber}단계 ${question.target}: 정답 선지가 정확히 하나가 아닙니다.`);
  }
  if (!quizHtml.includes('questions=shuffle(source)') || !quizHtml.includes('options:shuffle(question.options)')) errors.push(`${stageNumber}단계: 문제·선지 순서 무작위화가 없습니다.`);
  if (!quizHtml.includes("feedback.textContent='다시 생각해 보세요.';return") || !quizHtml.includes("feedback.textContent='맞았습니다. '+question.note")) errors.push(`${stageNumber}단계: 정답·오답 해설 동작이 올바르지 않습니다.`);
}
if (stageQuizQuestions !== questions) errors.push(`단계 문제 총합: ${stageQuizQuestions} (예상 ${questions})`);
const carLesson = lessons.find((lesson) => lesson.characters.some((item) => item.character === '車'));
const carQuestion = carLesson?.questions.find((question) => question.target === '車');
const carTerms = carQuestion?.options.map((option) => option[0]) || [];
for (const term of ['전차', '주차장', '자전거', '차이']) if (!carTerms.includes(term)) errors.push(`車 문제에 ${term} 보기가 없습니다.`);
const long = lessons.flatMap((lesson) => lesson.characters).find((item) => item.character === '長');
if (!long?.hunEum?.some((item) => item.hun.includes('길')) || !long?.hunEum?.some((item) => /어른|우두머리/.test(item.hun))) errors.push('長의 길다·어른/대표자 뜻이 함께 설명되지 않았습니다.');

const report = {
  lessons: lessons.length,
  uniqueCharacters: allCharacters.size,
  officialGrade6Characters: [...new Set([...standard.characters].map(normalize))].length,
  missingStandard,
  characterPlacements: lessons.reduce((sum, lesson) => sum + lesson.characters.length, 0),
  examples,
  questions,
  hanjaFeedback,
  nonHanjaFeedback,
  progressLinks: progressLinks.length,
  stageQuizLinks: stageQuizLinks.length,
  stageQuizQuestions,
  errors
};
console.log(JSON.stringify(report, null, 2));
if (errors.length) process.exitCode = 1;
