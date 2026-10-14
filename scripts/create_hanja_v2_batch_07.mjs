import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const read = (p) => JSON.parse(fs.readFileSync(path.join(root, p), 'utf8'));

const plan = read('scripts/hanja-v2-subject-stages-plan.json');
const noHomophoneDecoys = read('scripts/hanja-no-homophone-decoys.json').decoys;
const noQuestion = read('scripts/hanja-no-question-characters.json').characters;
const extraExamples = read('scripts/hanja-extra-examples.json').examples;
const fewExamples = read('scripts/hanja-few-example-characters.json').characters;
const db = read('references/dictionaries/worddb.json');
const subjectWords = read('scripts/hanja-subject-word-weights.json');
const hunEumTable = read('scripts/hanja-huneum-table.json');
const learned = new Set(fs.readFileSync(path.join(root, 'learning/literacy-numeracy/hanja-meaning/v2/index.html'), 'utf8').match(/[\u4e00-\u9fff]/g));

/* 글자마다 자리를 맞춰 세어 음을 얻는다 */
const soundCount = new Map();
for (const records of Object.values(db)) {
  for (const record of records) {
    for (let i = 0; i < record.hanja.length; i += 1) {
      const character = record.hanja[i];
      if (!soundCount.has(character)) soundCount.set(character, new Map());
      const bucket = soundCount.get(character);
      bucket.set(record.term[i], (bucket.get(record.term[i]) || 0) + 1);
    }
  }
}
/* 두음 법칙으로 갈리는 소리(려·여, 라·나, 량·양)는 한 번만 나와도 살린다 */
const initialOf = (syllable) => Math.floor((syllable.charCodeAt(0) - 0xac00) / 588);
const restOf = (syllable) => (syllable.charCodeAt(0) - 0xac00) % 588;
const softInitials = new Set([2, 5, 11]); // ㄴ, ㄹ, ㅇ
const isHeadSoundPair = (a, b) =>
  restOf(a) === restOf(b) && softInitials.has(initialOf(a)) && softInitials.has(initialOf(b));

function readingsOf(character) {
  const bucket = soundCount.get(character);
  if (!bucket) return [];
  const sorted = [...bucket].sort((a, b) => b[1] - a[1]);
  const main = sorted[0][0];
  const kept = sorted
    .filter(([s, n]) => n >= Math.max(2, sorted[0][1] * 0.05) || isHeadSoundPair(s, main))
    .map(([s]) => s);
  // 드물게 쓰이는 글자는 낱말이 하나뿐이라 잣대에 걸린다. 으뜸 소리는 언제나 남긴다.
  return kept.length ? kept : [main];
}

const hun = new Map();
for (const stage of Object.values(plan)) {
  for (const [term, theme] of stage.lessons) {
    const parts = theme.split(' · ');
    [...term].forEach((character, i) => hun.set(character, parts[i]));
  }
}
function hunEumOf(character) {
  if (hun.has(character)) return { text: `${hun.get(character)} ${readingsOf(character)[0]}`, tier: 0 };
  if (hunEumTable.curated[character]) return { text: hunEumTable.curated[character], tier: 0 };
  if (hunEumTable.extra[character]) return { text: hunEumTable.extra[character], tier: 1 };
  return null;
}

/* 아이가 읽을 글에 올리지 않을 낱말 */
const banned = new Set(['고려장', '처형', '극형', '사형', '피살', '피격', '사살', '총살', '학살', '살해', '자살', '타살',
  '시신', '시체', '사체', '부검', '강간', '성폭행', '매춘', '마약', '도박', '자해', '폭행', '고문', '참수', '유괴',
  '인신매매', '밀매', '밀수', '음주', '흡연', '담배', '술집', '유흥', '도살', '도축', '기생충', '변태', '음란',
  '화형', '천형', '참형', '태형', '전축', '수라장', '기라성', '난자', '배란', '명란',
  '감자', '배교', '선혈', '아수라장', '삼라만상', '실탄', '육탄', '타계', '무극',
  '계장', '강력계', '복리', '음복', '만난', '위정', '인책', '자책', '오욕', '기생',
  // 사전에 실린 단층은 單層(한 층짜리 집)뿐이라, 과학의 단층(斷層)과 헷갈린다
  '단층',
  // 아이가 쓸 일 없는 옛말·한자 성어
  '배금주의', '중과부적', '섬섬옥수', '십년감수', '미수', '강술', '고희', '희대', '영락', '다과',
  '기상천외', '기인', '공덕', '군율', '중생', '사비', '외상', '내상', '화상', '위약', '안일',
  // 飛行으로 읽히기 쉬워 헷갈린다
  '비행',
  '능지처참', '수전노', '매국노', '간증', '정염', '단말마', '소주', '건달', '괴수', '유괴']);

/* 파생형까지 막아야 하는 말 (단말마적·소주병처럼 뒤에 붙어 빠져나간다) */
const bannedParts = ['단말마', '소주', '능지', '수전노', '매국노', '간증', '정염', '건달', '유괴', '괴수', '사형', '학살'];
const isBanned = (record) =>
  banned.has(record.term) ||
  bannedForms.has(`${record.term}|${record.hanja}`) ||
  bannedParts.some((part) => record.term.includes(part));

/* 같은 한글인데 다른 한자를 쓰는 뜻은 헷갈리므로 그 짝만 막는다 */
const bannedForms = new Set([
  '배상|拜上',   // 賠償(19단계)과 헷갈린다
  '기술|技術',   // 述을 가르치는 자리에서는 記述만 쓴다
]);
/* 예문 문장에도 같은 잣대를 댄다 */
const heavy = /사형|처형|살인|살해|자살|시신|시체|음주|흡연|담배|마약|도박|성폭|강간|매춘|낙태|폭행|고문|학살|유괴|밀수|밀매|도살|도축|죄수|복역|징역|범인|피범벅|참수/;
const usableSentence = (sentence) =>
  !heavy.test(sentence) && !/[?？]/.test(sentence) && /(다|요|니다)\.$/.test(sentence);
const levelBonus = (level) => (level === '초급' ? 3 : level === '중급' ? 2 : 1);
/* 교과 빈도는 한자 표기가 같을 때만 인정한다 — 구형(舊型)의 빈도를 구형(求刑)이 빌려 쓰지 않도록 */
const corpusWeight = (record) => (subjectWords[record.term]?.hanja === record.hanja ? subjectWords[record.term].weight : 0);
const score = (record) =>
  corpusWeight(record) * 20 +
  (corpusWeight(record) ? 8 : 0) +
  (record.term.length === 2 ? 2 : 0) +
  levelBonus(record.level);
const byChar = new Map();
for (const records of Object.values(db)) {
  for (const record of records) {
    record.ex = record.ex.filter(usableSentence);
    if (!record.ex.length || record.term.length < 2 || record.term.length > 4) continue;
    if (isBanned(record)) continue;
    for (const character of new Set(record.hanja)) {
      if (!byChar.has(character)) byChar.set(character, []);
      byChar.get(character).push(record);
    }
  }
}
const unknownIn = (record, acquired) => [...record.hanja].filter((c) => !learned.has(c) && !acquired.has(c)).length;
const overlaps = (term, chosen) => chosen.some((t) => t.includes(term) || term.includes(t));

/* 같은 소리인데 다른 한자를 쓰는 낱말 — 문제의 정답이 된다 */
function distractorFor(character, sounds, avoid) {
  const found = [];
  for (const records of Object.values(db)) {
    for (const record of records) {
      if (!record.ex.length || record.term.length < 2 || record.term.length > 3) continue;
      if (isBanned(record) || record.hanja.includes(character)) continue;
      for (let i = 0; i < record.term.length; i += 1) {
        if (!sounds.includes(record.term[i])) continue;
        const other = record.hanja[i];
        const hunEum = hunEumOf(other);
        if (!hunEum || avoid.has(record.term)) continue;
        found.push({ record, hunEum: hunEum.text, tier: hunEum.tier });
        break;
      }
    }
  }
  found.sort((a, b) => a.tier - b.tier || score(b.record) - score(a.record));
  return found[0] || null;
}

const hasFinal = (word) => {
  const code = word.at(-1).charCodeAt(0) - 0xac00;
  return code >= 0 && code <= 11171 && code % 28 !== 0;
};
const objectParticle = (word) => (hasFinal(word) ? '을' : '를');
const topicParticle = (word) => (hasFinal(word) ? '은' : '는');
const mark = (sentence, term) => sentence.replaceAll(term, `{{${term}}}`).replace(/\{\{\{\{/g, '{{').replace(/\}\}\}\}/g, '}}');
const option = (record) => [record.term, record.hanja, mark(record.ex[0], record.term)];

const lessons = [];
const acquired = new Set();
const problems = [];
for (const stage of Object.values(plan)) {
  for (const [term, theme] of stage.lessons) {
    const characters = [...term];
    characters.forEach((c) => acquired.add(c));
    const lessonCharacters = [];
    const questions = [];
    for (const character of characters) {
      const sounds = readingsOf(character);
      const pool = [
        ...(byChar.get(character) || []),
        // 사전에 예문이 없어 직접 적은 보기도 같은 잣대로 줄 세운다
        ...(extraExamples[character] || []).map(([word, hanja, sentence]) => ({
          term: word, hanja, level: '', ex: [sentence],
        })),
      ].sort((a, b) => unknownIn(a, acquired) - unknownIn(b, acquired) || score(b) - score(a));
      const picked = [];
      for (const pass of [1, 2]) {
        for (const record of pool) {
          if (picked.length === 4) break;
          if (picked.some((r) => r.term === record.term)) continue;
          if (pass === 1 && overlaps(record.term, picked.map((r) => r.term))) continue;
          picked.push(record);
        }
      }
      if (picked.length < 3 && !fewExamples[character]) {
        problems.push(`${term}:${character} 예문 낱말 ${picked.length}개인데 까닭이 안 적힘`);
      }
      const words = picked.map((r) => `${r.term}(${r.hanja})`).join('·');
      lessonCharacters.push({
        character,
        reading: sounds.slice(0, 2).join('·'),
        meaning: hun.get(character),
        hunEum: sounds.slice(0, 2).map((eum) => ({ hun: hun.get(character), eum })),
        explanation: `핵심 뜻은 ‘${hun.get(character)}’입니다. ${words}에서 이 글자가 맡는 뜻과 쓰임을 예문으로 익힙니다.`,
        examples: picked.map((r) => [r.term, r.hanja, r.ex[0]])
      });
      const avoid = new Set(picked.map((r) => r.term));
      const decoy = distractorFor(character, sounds.slice(0, 2), avoid);
      /* 드물게 쓰이는 글자는 보기 낱말이 둘뿐이라 보기 3개짜리 문제로 낸다 */
      const options = picked.slice(0, 3).map(option);
      if (options.length < 2) {
        if (!noQuestion[character]) problems.push(`${term}:${character} 보기 낱말이 하나뿐인데 까닭이 안 적힘`);
        continue;
      }
      if (decoy) {
        options.push(option(decoy.record));
        questions.push({
          target: character,
          answer: options.length - 1,
          note: `‘${decoy.record.term}’에는 ‘${decoy.hunEum}’${objectParticle(decoy.hunEum)} 씁니다.`,
          options
        });
        continue;
      }
      /* 우리말에 같은 소리 다른 한자가 아예 없는 글자는 따로 마련한 오답을 쓰고,
         그런 낱말조차 없으면 문제를 억지로 만들지 않고 뜻과 예문만 가르친다 */
      const spare = noHomophoneDecoys[character];
      if (!spare) {
        if (!noQuestion[character]) problems.push(`${term}:${character} 오답으로 쓸 낱말이 없는데 까닭이 안 적힘`);
        continue;
      }
      options.push([spare.term, spare.hanja, mark(spare.sentence, spare.term)]);
      questions.push({
        target: character,
        answer: options.length - 1,
        noHomophone: true,
        note: spare.kind === 'loanword'
          ? `‘${spare.term}’${topicParticle(spare.term)} 외래어이므로 한자를 쓰지 않습니다.`
          : `‘${spare.term}’에서 ‘${readingsOf(character)[0]}’은 한자음이 아닙니다.`,
        options
      });
    }
    lessons.push({
      term,
      reading: characters.map((c) => readingsOf(c).slice(0, 2).join('·')).join(' · '),
      theme,
      characters: lessonCharacters,
      questions
    });
  }
}
fs.writeFileSync(path.join(root, 'scripts/hanja-v2-lessons-07.json'), `${JSON.stringify(lessons, null, 2)}\n`);
console.log(JSON.stringify({ lessons: lessons.length, characters: lessons.reduce((s, l) => s + l.characters.length, 0), problems }, null, 2));
