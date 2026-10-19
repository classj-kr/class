'use strict';
// 대상 학기만 읽는다. 고1 2학기와 수능 기출은 읽거나 변경하지 않는다.
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm'), crypto = require('node:crypto');
const dir = path.resolve(__dirname, '../../learning/literacy-numeracy/math-bank');
function loadBank() {
  const context = { console }; context.globalThis = context; vm.createContext(context);
  const files = ['engine.js', 'geometry.js', 'middle.js', ...fs.readdirSync(path.join(dir, 'units')).filter(f => /^(?:[1-9]-[12]|10-1)-\d+[a-z]\.js$/.test(f)).sort().map(f => 'units/' + f)];
  for (const file of files) vm.runInContext(fs.readFileSync(path.join(dir, file), 'utf8'), context, { filename: file });
  return context.MathBank;
}
function canonical(item) {
  const clean = value => String(value || '').replace(/\s+/g, ' ').replace(/\s(?:id|aria-describedby)="[^"]*"/g, '').replace(/url\(#[^)]+\)/g, 'url(#shape)').trim();
  return JSON.stringify([clean(item.text), clean(item.figure), (item.choice?.options || []).map(clean).sort(), clean(item.template)]);
}
function hash(text) { return crypto.createHash('sha256').update(text).digest('hex').slice(0, 16); }
module.exports = { loadBank, canonical, hash, dir };
if (require.main === module) {
  const B = loadBank(), limit = Number(process.argv[2] || 100), report = { total: 0, short: [], failures: [], byTerm: {} };
  for (const unit of B.units()) {
    const term = unit.grade + '-' + unit.semester; report.byTerm[term] ||= { total: 0, short: 0 };
    for (const group of unit.groups) for (const type of group.types) for (let n = 0; n < (type.count || 1); n++) {
      const key = type.id + (type.count > 1 ? '#' + (n + 1) : '');
      const original = B.bankOf(unit, group.id, type.level).find(it => it.key === key), seen = new Set([canonical(original)]);
      for (let i = 0; i < limit && seen.size < 4; i++) {
        try { seen.add(canonical(type.make(new B.Dice((i + 1) * 7919 + n * 101), n))); }
        catch (error) { report.failures.push({ unit: unit.id, key, seed: (i + 1) * 7919 + n * 101, error: error.message }); }
      }
      report.total++; report.byTerm[term].total++;
      if (seen.size < 4) { report.short.push({ unit: unit.id, group: group.id, key, n, available: seen.size - 1, title: type.title }); report.byTerm[term].short++; }
    }
    process.stdout.write(unit.id + ' ' + report.total + ' items, ' + report.short.length + ' short\n');
  }
  fs.mkdirSync(path.resolve(__dirname, '../../outputs/math-twins'), { recursive: true });
  fs.writeFileSync(path.resolve(__dirname, '../../outputs/math-twins/capacity.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ total: report.total, short: report.short.length, failures: report.failures.length, byTerm: report.byTerm }));
}
