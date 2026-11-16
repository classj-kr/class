// 학기마다 도식 파일을 한 문맥에서 과목별로 차례로 실행해 본다(브라우저처럼 맨 바깥 const/let 이 파일끼리 부딪치면 둘째 파일이 죽는다).
// node tools/curriculum-vocabulary/check-figures.cjs [학기 …]
const fs = require('fs'), path = require('path'), vm = require('vm');
const dir = path.resolve(__dirname, '../../learning/literacy-numeracy/curriculum-vocabulary');
const terms = process.argv.slice(2).length ? process.argv.slice(2) : fs.readdirSync(path.join(dir, 'figures')).filter((n) => /^\d-\d$/.test(n)).sort();
let bad = 0;
for (const term of terms) {
  const files = fs.readdirSync(path.join(dir, 'figures', term)).filter((n) => n.endsWith('.js')).sort();
  const groups = {};
  for (const f of files) (groups[f.split(/[-.]/)[0]] ||= []).push(f);
  for (const [code, list] of Object.entries(groups)) {
    const window = { document: { createElement: () => ({ style: {}, setAttribute() {}, append() {}, appendChild() {} }), head: { append() {}, appendChild() {} }, querySelector: () => null }, matchMedia: () => ({ matches: false }) };
    window.window = window; window.self = window;
    const ctx = vm.createContext(window);
    vm.runInContext(fs.readFileSync(path.join(dir, 'figures', 'kit.js'), 'utf8'), ctx, { filename: 'kit.js' });
    for (const f of list) {
      try { vm.runInContext(fs.readFileSync(path.join(dir, 'figures', term, f), 'utf8'), ctx, { filename: `${term}/${f}` }); }
      catch (e) { bad++; console.log(`${term}/${f}: ${e.message}`); }
    }
  }
}
console.log(bad ? `문제 ${bad}곳` : `도식 파일 ${terms.join(' ')} 문제 0곳`);
process.exitCode = bad ? 1 : 0;
