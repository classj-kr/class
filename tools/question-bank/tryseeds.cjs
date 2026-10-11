// 유형마다 씨앗 여러 개로 만들어 보고, 못 만드는 유형과 오래 걸리는 유형을 찍는다.  node tools/question-bank/tryseeds.cjs 3-1-5
const path = require('path'), fs = require('fs'), vm = require('vm');
const dir = process.env.MATH_BANK_DIR || path.join(__dirname, '../../learning/literacy-numeracy/math-bank');
const ctx = { console }; ctx.globalThis = ctx; vm.createContext(ctx);
for (const f of ['engine.js', 'geometry.js'].concat(fs.readdirSync(path.join(dir, 'units')).sort().map((f) => 'units/' + f))) vm.runInContext(fs.readFileSync(path.join(dir, f), 'utf8'), ctx, { filename: f });
const B = ctx.MathBank, want = process.argv[2];
const seeds = Array.from({ length: 60 }, (_, i) => i * 7919 + 13);
for (const unit of B.units()) {
  if (want && unit.id !== want) continue;
  for (const group of unit.groups) for (const type of group.types) {
    let failed = 0; const t0 = Date.now(); let message = '';
    for (const seed of seeds) { try { type.make(new B.Dice(seed), 0); } catch (e) { failed += 1; message = e.message + ' ' + String(e.stack).split('\n')[1].trim().slice(0, 80); } }
    const ms = Date.now() - t0;
    if (failed || ms > 400) console.log(type.id, '실패', failed, '/', seeds.length, ms + 'ms', message);
  }
}
console.log('끝');
