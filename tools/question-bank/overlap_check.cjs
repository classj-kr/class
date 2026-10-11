// 문제은행에 새로 쓴 문장이 수집해 둔 출판사 자료의 문장과 겹치지 않는지 대조한다(로컬 전용).
//   node tools/question-bank/overlap_check.cjs <수집본에서 뽑은 txt 폴더> [단원 id]
// 수는 #, 사람 이름은 ○으로 바꾸고 빈칸을 뗀 뒤, 내 문장에서 수집본에도 그대로 있는 가장 긴 토막의 길이를 잰다.
// "계산해 보세요" 같은 지시문은 어느 교과서에나 있는 말이라 겹쳐도 된다. 봐야 하는 것은 문장제처럼
// 상황을 지어 쓴 문장이 길게 겹치는 경우다. 수집본이 없는 곳(배포 서버, 다른 컴퓨터)에서는 돌릴 수 없다.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const corpusDir = process.argv[2];
const unitId = process.argv[3] || null;
if (!corpusDir || !fs.existsSync(corpusDir)) { console.error('수집본 txt 폴더를 주세요.'); process.exit(2); }

const APP = path.join(__dirname, '../../learning/literacy-numeracy/math-bank');
const context = { console }; context.globalThis = context; vm.createContext(context);
for (const file of ['engine.js', ...fs.readdirSync(path.join(APP, 'units')).filter((f) => f.endsWith('.js')).map((f) => 'units/' + f)]) vm.runInContext(fs.readFileSync(path.join(APP, file), 'utf8'), context);
const B = context.MathBank;

const NAMES = new RegExp(B.kit.NAMES.join('|'), 'g');
const squash = (text) => String(text).replace(/\[수식: ([^\]]*)\]/g, '$1').replace(/<svg[\s\S]*?<\/svg>/g, '').replace(/<[^>]+>/g, '').replace(/&gt;|&lt;/g, '').replace(/\d[\d,]*/g, '#').replace(/\s+/g, '');

// 수집본을 한 줄로 붙인다.
let corpus = '';
(function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) walk(full);
    else if (name.endsWith('.txt')) corpus += squash(fs.readFileSync(full, 'utf8')) + '\u0001';
  }
})(corpusDir);

// 내 문장: 은행에 실린 문항의 물음을 문장 단위로 모은다.
const mine = new Map();   // 문장 -> 유형
for (const unit of B.units()) {
  if (unitId && unit.id !== unitId) continue;
  for (const group of unit.groups) for (const level of B.LEVELS) {
    for (const item of B.bankOf(unit, group.id, level)) {
      const plain = String(item.text).replace(/<[^>]+>/g, '').replace(NAMES, '○');
      for (const sentence of plain.split(/(?<=[.?])\s+/)) { const key = squash(sentence); if (key.length >= 8 && !mine.has(key)) mine.set(key, item.typeId); }
    }
  }
}

// 가장 길게 겹치는 토막
function longestShared(sentence) {
  let best = '';
  for (let start = 0; start < sentence.length; start += 1) {
    let size = best.length + 1;
    while (start + size <= sentence.length && corpus.includes(sentence.slice(start, start + size))) size += 1;
    if (size - 1 > best.length) best = sentence.slice(start, start + size - 1);
  }
  return best;
}
const rows = [...mine].map(([sentence, typeId]) => { const shared = longestShared(sentence); return { typeId, sentence, shared, ratio: shared.length / sentence.length }; });
rows.sort((a, b) => b.shared.length - a.shared.length);
console.log(`내 문장 ${rows.length}개, 수집본 ${corpus.length}자.`);
console.log('가장 길게 겹치는 것부터(겹친 글자 수 / 문장 길이):');
for (const row of rows.slice(0, 25)) console.log(`${String(row.shared.length).padStart(3)} / ${String(row.sentence.length).padStart(3)}  [${row.typeId}] ${row.sentence}\n        겹친 토막: ${row.shared}`);
const whole = rows.filter((row) => row.ratio >= 0.9);
console.log(`\n통째로(90% 이상) 겹치는 문장 ${whole.length}개: ` + whole.map((row) => row.sentence).join(' | '));
