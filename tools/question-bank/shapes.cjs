// 한 단원에서 「수를 지운 글」이 같은 문항을 모두 찾아 찍는다(검사는 첫 번째에서 멈춘다).  node tools/question-bank/shapes.cjs 4-1-1
const fs = require('fs'), vm = require('vm'), path = require('path');
const dir = process.env.MATH_BANK_DIR || path.join(__dirname, '../../learning/literacy-numeracy/math-bank');
const c = { console }; c.globalThis = c; vm.createContext(c);
for (const f of ['engine.js', 'geometry.js'].concat(fs.readdirSync(path.join(dir, 'units')).sort().map((f) => 'units/' + f))) vm.runInContext(fs.readFileSync(path.join(dir, f), 'utf8'), c, { filename: f });
const B = c.MathBank, strip = (html) => String(html || '').replace(/<svg[\s\S]*?<\/svg>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/\s+/g, ' ').trim();
for (const unit of B.units()) {
  if (unit.id !== process.argv[2]) continue;
  const seen = new Map();
  for (const group of unit.groups) for (const level of B.LEVELS) for (const item of B.bankOf(unit, group.id, level)) {
    const shape = strip(item.text + ' ' + (item.figure || '')).replace(/\d+/g, '#'), rule = item.facts && item.facts.rule, tag = rule === true ? 'group:' + group.id : rule ? 'rule:' + rule : null;
    const before = seen.get(shape) || [];
    for (const other of before) if (!tag || !other.tag || other.tag === tag) console.log(`같은 꼴: ${item.typeId}(${tag}) 와 ${other.id}(${other.tag}) — ${shape.slice(0, 90)}`);
    seen.set(shape, before.concat([{ id: item.typeId, tag }]));
  }
}
console.log('끝');
