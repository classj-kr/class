// hanja-modern-hun.json 표대로 옛말 훈을 지금 쓰는 말로 바꾼다.
//   node scripts/modernize_hanja_hun.mjs          (고친 곳 수만 보여 준다)
//   node scripts/modernize_hanja_hun.mjs --write  (파일에 쓴다)
// 고치는 곳: 한자 앱 차시 원본(뜻·훈음·설명 첫 문장·차시 뜻 줄·풀이·훈음 문제 보기), 훈음 표 두 개,
//           고사성어 한자 풀이, 교과서 단어 원고의 한자 풀이. 쪽은 각 앱의 만드는 도구로 다시 만든다.
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const write = process.argv.includes('--write');
const { map } = JSON.parse(fs.readFileSync(path.join(import.meta.dirname, 'hanja-modern-hun.json'), 'utf8'));
const counts = {};
const bump = (file, n = 1) => { counts[file] = (counts[file] || 0) + n; };
const save = (file, text) => { if (write) fs.writeFileSync(file, text, 'utf8'); };

// 1) 한자 앱 차시 원본
const lessonFiles = [1, 2, 3, 4, 5, 6, 7].map(n => path.join(import.meta.dirname, `hanja-v2-lessons-0${n}.json`));
const eumOf = {};
for (const file of lessonFiles) {
  const lessons = JSON.parse(fs.readFileSync(file, 'utf8'));
  for (const lesson of lessons) {
    const themeParts = String(lesson.theme || '').split(' · ');
    lesson.characters.forEach((item, k) => {
      const change = map[item.character];
      if (!change) return;
      const [from, to] = change;
      eumOf[item.character] = item.reading;
      if (item.meaning === from) { item.meaning = to; bump(file); }
      for (const form of item.hunEum || []) if (form.hun === from) { form.hun = to; bump(file); }
      if (typeof item.explanation === 'string' && item.explanation.includes(`“${from}”`)) {
        item.explanation = item.explanation.replaceAll(`“${from}”`, `“${to}”`);
        bump(file);
      }
      if (themeParts.length === lesson.characters.length && themeParts[k] === from) { themeParts[k] = to; bump(file); }
    });
    if (themeParts.length === lesson.characters.length) lesson.theme = themeParts.join(' · ');
  }
  save(file, `${JSON.stringify(lessons, null, 2)}\n`);
}

// 「훈 음」이 따옴표 안에 통째로 든 곳(풀이 ‘메 산’, 훈음 문제 보기 "넉 사", 훈음 표 값)을 바꾼다.
const pairs = Object.entries(map).map(([ch, [from, to]]) => ({ ch, from, to, eum: eumOf[ch] })).filter(p => p.eum);
const escape = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
function replaceQuoted(text, file) {
  for (const { from, to, eum } of pairs) {
    const re = new RegExp(`([‘"(])${escape(`${from} ${eum}`)}([’")])`, 'g');
    text = text.replace(re, (_, a, b) => { bump(file); return `${a}${to} ${eum}${b}`; });
  }
  return text;
}
for (const file of [...lessonFiles, path.join(import.meta.dirname, 'hanja-huneum-table.json'), path.join(import.meta.dirname, 'hanja-question-feedback-huneum.json')]) {
  const before = write ? fs.readFileSync(file, 'utf8') : fs.readFileSync(file, 'utf8');
  const after = replaceQuoted(before, file);
  if (after !== before) save(file, after);
}

// 2) 고사성어: 「四 (넉 사)」 꼴의 한자 풀이
const idioms = path.join(root, 'learning/literacy-numeracy/classical-chinese-idioms/idioms-data.js');
{
  let text = fs.readFileSync(idioms, 'utf8');
  for (const { ch, from, to, eum } of pairs) {
    const needle = `${ch} (${from} ${eum})`;
    if (text.includes(needle)) { bump(idioms, text.split(needle).length - 1); text = text.replaceAll(needle, `${ch} (${to} ${eum})`); }
  }
  save(idioms, text);
}

// 3) 교과서 단어 원고: "hanja": [["四", "넉 사"], ...]
const vocabRoot = path.join(root, 'tools/curriculum-vocabulary');
function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return entry.name.endsWith('.json') ? [full] : [];
  });
}
const byChar = Object.fromEntries(pairs.map(p => [p.ch, p]));
// 아직 커밋하지 않은 학기(다른 세션이 만드는 중)는 건드리지 않는다: --skip=2-1,2-2
const skip = (process.argv.find(arg => arg.startsWith('--skip=')) || '').slice(7).split(',').filter(Boolean);
for (const file of (fs.existsSync(vocabRoot) ? walk(vocabRoot) : []).filter(f => !skip.some(term => f.includes(`${path.sep}${term}${path.sep}`)))) {
  const text = fs.readFileSync(file, 'utf8');
  let changed = false;
  const fixed = text.replace(/\[\s*"([^"])"\s*,\s*"([^"]+)"\s*\]/g, (whole, ch, huneum) => {
    const p = byChar[ch];
    if (!p || huneum !== `${p.from} ${p.eum}`) return whole;
    changed = true;
    bump(file);
    return whole.replace(`"${huneum}"`, `"${p.to} ${p.eum}"`);
  });
  if (changed) save(file, fixed);
}

const missing = Object.keys(map).filter(ch => !eumOf[ch]);
console.log(write ? '고쳤습니다.' : '미리 보기(--write 로 씁니다).');
for (const [file, n] of Object.entries(counts)) console.log(`  ${path.relative(root, file)}: ${n}곳`);
if (missing.length) console.log(`  한자 앱에 없는 글자(표에서 뺄 것): ${missing.join(' ')}`);
