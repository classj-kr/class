// 한 단원의 문항을 글로 펼쳐 찍는다.  MATH_BANK_DIR=... node tools/question-bank/dump.cjs 3-2-4 [유형 이름 앞머리]
const fs = require('fs'), vm = require('vm'), path = require('path');
const dir = process.env.MATH_BANK_DIR || path.join(__dirname, '../../learning/literacy-numeracy/math-bank');
const c = { console }; c.globalThis = c; vm.createContext(c);
for (const f of ['engine.js', 'geometry.js'].concat(fs.readdirSync(path.join(dir, 'units')).sort().map((f) => 'units/' + f))) vm.runInContext(fs.readFileSync(path.join(dir, f), 'utf8'), c, { filename: f });
const B = c.MathBank, want = process.argv[2], prefix = process.argv[3] || '';
const flat = (h) => String(h || '').replace(/<span class="mb-box">([^<]*)<\/span>/g, '[$1]').replace(/<span class="mb-frac"><span>((?:[^<]|\[[^\]]*\])*)<\/span><span class="mb-frac-bar">\/<\/span><span>([^<]*)<\/span><\/span>/g, '($1/$2)').replace(/aria-label="([^"]*)"/g, '>{$1}<').replace(/<[^>]+>/g, ' ').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/\s+/g, ' ').trim();
for (const u of B.units()) {
  if (u.id !== want) continue;
  let n = 0;
  for (const g of u.groups) for (const lv of B.LEVELS) {
    const bank = B.bankOf(u, g.id, lv); if (!bank.length) continue;
    console.log('== ' + g.id + ' ' + g.title + ' (' + lv + ') ' + bank.length);
    for (const it of bank) {
      n += 1; if (prefix && !it.typeId.startsWith(prefix)) continue;
      const ans = it.choice ? '보기: ' + it.choice.options.map(flat).join(' | ') + ' → ' + (it.choice.answer + 1) : '답: ' + it.inputs.map((i) => (i.label || '') + (i.lead || '') + i.answer + (i.unit || '')).join(', ');
      console.log('- [' + it.typeId + '] ' + flat(it.text) + ' || ' + flat(it.figure).slice(0, 160) + ' || ' + ans + ' || ' + flat(it.explain).slice(0, 140));
    }
  }
  console.log('모두 ' + n);
}
