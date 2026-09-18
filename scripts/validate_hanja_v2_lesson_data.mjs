import fs from 'node:fs';
import path from 'node:path';

const files = ['hanja-v2-lessons-01.json', 'hanja-v2-lessons-02.json', 'hanja-v2-lessons-03.json', 'hanja-v2-lessons-04.json', 'hanja-v2-lessons-05.json', 'hanja-v2-lessons-06.json', 'hanja-v2-lessons-07.json'];
const lessons = files.flatMap((name) => JSON.parse(fs.readFileSync(path.join(import.meta.dirname, name), 'utf8')));
const fewExamples = JSON.parse(fs.readFileSync(path.join(import.meta.dirname, 'hanja-few-example-characters.json'), 'utf8')).characters;
const errors = [];

for (const [lessonIndex, lesson] of lessons.entries()) {
  if ([...lesson.term].length < 2 || [...lesson.term].length > 3) {
    errors.push(`${lesson.term}: 중심 한자어는 2~3글자여야 합니다.`);
  }
  // 같은 소리 다른 한자가 우리말에 없는 글자는 문제를 억지로 만들지 않고 뜻과 예문만 가르친다
  if (lesson.questions.length > lesson.characters.length) {
    errors.push(`${lesson.term}: 문제가 구성 글자 수보다 많습니다.`);
  }
  for (const [questionIndex, question] of lesson.questions.entries()) {
    // 같은 소리 다른 한자 낱말이 없는 글자의 훈음 고르기 문제: 보기 넷이 서로 다른 훈음이고 정답이 목표 글자의 훈음
    if (question.type === 'huneum') {
      const huTarget = lesson.characters.find((item) => item.character === question.target);
      const huRight = (huTarget?.hunEum || []).map((item) => `${item.hun} ${item.eum}`)[0];
      if (question.options.length !== 4 || new Set(question.options.map((option) => option[0])).size !== 4) errors.push(`${lesson.term} Q${questionIndex + 1}: 훈음 보기는 서로 다른 넷이어야 합니다.`);
      if (question.options[question.answer]?.[0] !== huRight) errors.push(`${lesson.term} Q${questionIndex + 1}: 정답이 목표 글자의 훈음이 아닙니다.`);
      if (!question.note.startsWith(`‘${question.target}’`)) errors.push(`${lesson.term} Q${questionIndex + 1}: 훈음 문제 해설은 목표 글자로 시작해야 합니다.`);
      continue;
    }
    // 우리말에서 쓰이는 낱말이 둘뿐인 글자는 보기를 셋까지만 채울 수 있다
    const leastOptions = fewExamples[question.target] ? 3 : 4;
    if (question.options.length !== 4 && question.options.length !== leastOptions) {
      errors.push(`${lesson.term} Q${questionIndex + 1}: 보기는 ${leastOptions}개여야 합니다.`);
    }
    const containing = question.options.map((option) => [...option[1]].includes(question.target));
    const nonContaining = containing.filter((value) => !value).length;
    if (nonContaining !== 1) errors.push(`${lesson.term} Q${questionIndex + 1}: 목표 한자가 없는 보기는 정확히 하나여야 합니다.`);
    const targetCharacter = lesson.characters.find((item) => item.character === question.target);
    const readings = (targetCharacter?.reading || '').split('·').filter(Boolean);
    // 우리말에 같은 소리 다른 한자가 아예 없는 글자(冷·層)는 소리가 다른 보기를 쓸 수밖에 없다
    if (!question.noHomophone && !question.options.every((option) => readings.some((reading) => option[0].includes(reading)))) {
      errors.push(`${lesson.term} Q${questionIndex + 1}: 모든 보기에 목표 글자의 독음이 드러나야 합니다.`);
    }
    if (question.noHomophone && !question.options.slice(0, 3).every((option) => readings.some((reading) => option[0].includes(reading)))) {
      errors.push(`${lesson.term} Q${questionIndex + 1}: 정답을 뺀 보기에는 목표 글자의 독음이 드러나야 합니다.`);
    }
    if (containing[question.answer] !== false) errors.push(`${lesson.term} Q${questionIndex + 1}: 정답은 목표 한자가 없는 보기여야 합니다.`);
    if (!question.options.every((option) => option[2].includes(`{{${option[0]}}}`))) {
      errors.push(`${lesson.term} Q${questionIndex + 1}: 모든 문장에 밑줄 표시 대상이 필요합니다.`);
    }
  }
}

console.log(JSON.stringify({ lessons: lessons.length, questions: lessons.reduce((sum, lesson) => sum + lesson.questions.length, 0), errors }, null, 2));
if (errors.length) process.exitCode = 1;
