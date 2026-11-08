// 그림 명세(extra/*.json 의 img)를 사용자가 그대로 복사해 쓸 프롬프트 문서로 묶는다.
// node tools/curriculum-vocabulary/make-prompts.mjs 5-2
import fs from 'node:fs';
import path from 'node:path';

const term = process.argv[2] || '5-2';
const here = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1'));
const dir = path.join(here, term);
const books = [['kor', '국어'], ['soc', '사회'], ['sci', '과학']];
const style = 'Children\'s textbook illustration for Korean 5th graders. Soft, warm digital painting with clean outlines, gentle shading and bright natural colors (not neon). Uncluttered background, one clear focal point, 16:9 landscape. Do not put any text, letters, numbers, labels or writing anywhere in the image.';
// 생성기는 이름을 모른다. 첫 번째로 나올 때는 생김새를, 그다음은 짧은 가리킴말을 넣는다.
const cast = {
  HARIN: ['a Korean girl (shoulder-length black hair with a yellow hairband, mint-green cardigan)', 'the girl'],
  DOYUN: ['a Korean boy (short black hair, round glasses, navy hoodie)', 'the boy'],
  TEACHER: ['a Korean woman teacher in her 30s in a beige blazer', 'the teacher']
};
const castOut = (text) => {
  for (const [name, [full, short]] of Object.entries(cast)) {
    let first = true;
    text = text.replace(new RegExp(name + "(?![A-Za-z])", 'g'), () => (first ? (first = false, full) : short));
  }
  // 문장 첫머리에 들어간 a/the 는 대문자로.
  return text.replace(/(^|[.!?]\s+)(a|the) /g, (m, p, a) => p + a[0].toUpperCase() + a.slice(1) + ' ');
};
const extra = {};
// build.mjs 와 같은 차례: kor.json 먼저, kor-g.json 같은 덧붙임 파일은 나중에 칸마다 덮어쓴다.
// 덧붙임 파일 차례: <과목>.json → <과목>-x.json 같은 화면 글 → <과목>-g/-h.json(도식 칸 글, 언제나 마지막에 이김)
const rank = (name) => /-[g-j]\.json$/.test(name) ? 2 : /-[a-z]\.json$/.test(name) ? 1 : 0;
for (const name of fs.readdirSync(path.join(dir, 'extra')).filter(n => n.endsWith('.json') && !n.startsWith('senses') && !n.startsWith('rel') && !n.startsWith('foils')).sort((a, b) => rank(a) - rank(b) || a.localeCompare(b))) {
  const code = name.replace(/(-[a-z])?\.json$/, '');
  for (const [unit, words] of Object.entries(JSON.parse(fs.readFileSync(path.join(dir, 'extra', name), 'utf8')))) for (const [w, row] of Object.entries(words)) extra[`${code}/${unit}/${w}`] = { ...extra[`${code}/${unit}/${w}`], ...row };
}
const lines = [`# 교과 단어 ${term} 그림 프롬프트`, '',
  '만든 그림은 파일 이름을 아래 굵은 이름(예: kor-4-01)으로 시작하게 저장해 E:/webprojects/curriculum-images/' + term + '/ 폴더에 넣으면 된다. 뒤에 다른 말이 붙어도 괜찮다(kor-4-01 토의.png).',
  '각 칸의 글을 통째로 복사해 붙여 넣으면 화풍 문단까지 함께 들어간다. 그림 속에 글자가 생기면 다시 만든다.', ''];
let count = 0, missing = [], drawn = [];
for (const [code, subject] of books) {
  const book = JSON.parse(fs.readFileSync(path.join(dir, code + '.json'), 'utf8'));
  lines.push(`## ${subject}`, '');
  for (const unit of book.units) {
    lines.push(`### ${unit.title}`, '');
    unit.words.forEach((word, i) => {
      const id = `${code}-${unit.id}-${String(i + 1).padStart(2, '0')}`;
      const row = extra[`${code}/${unit.id}/${word.w}`];
      if (row?.fig) { drawn.push(id + ' ' + word.w); return; }   // 코드로 그린 도식이 있는 낱말은 그림을 만들지 않는다
      if (!row?.img) { missing.push(id + ' ' + word.w); return; }
      lines.push(`**${id}** ${word.w} — ${row.imgKo}`, '', '```text', `${style}\n\n${castOut(row.img)}`, '```', '');
      count++;
    });
  }
}
fs.writeFileSync(path.join(dir, 'IMAGE-PROMPTS.md'), lines.join('\n'));
console.log(`프롬프트 ${count}개`, drawn.length ? `
도식이 있어 뺀 것: ${drawn.join(', ')}` : '', missing.length ? `\n명세 없음: ${missing.join(', ')}` : '');
