'use strict';
const fs = require('node:fs'), path = require('node:path');
const { createValidator } = require('./twin-validation.cjs');
const T = require('../../learning/literacy-numeracy/math-bank/twins.js');
const { B, validate } = createValidator();
const target = path.resolve(__dirname, '../../learning/literacy-numeracy/math-bank/twins');
const report = { originals: 0, twins: 0, generated: 0, concept: 0, rejected: [], failures: [], terms: {} };
const checkOnly = process.argv.includes('--check');
const excludedFile = path.join(__dirname, 'twin-rejected-seeds.json');
const excluded = new Set((fs.existsSync(excludedFile) ? JSON.parse(fs.readFileSync(excludedFile, 'utf8')) : []).map(row => row.unit + ':' + row.key + ':' + row.seed));
const previousPlans = Object.fromEntries(fs.readdirSync(target).filter(file => file.endsWith('.json')).map(file => [file.slice(0, -5), JSON.parse(fs.readFileSync(path.join(target, file), 'utf8'))]));
fs.mkdirSync(target, { recursive: true });
for (const unit of B.units()) {
  const term = unit.grade + '-' + unit.semester;
  const plan = report.terms[term] ||= { format: 1, term, items: {} };
  for (const group of unit.groups) for (const type of group.types) for (let n = 0; n < (type.count || 1); n++) {
    const key = type.id + (type.count > 1 ? '#' + (n + 1) : '');
    const original = B.bankOf(unit, group.id, type.level).find(item => item.key === key);
    const entry = { original: T.fingerprint(original), n, variants: [] }, at = { unit, group, level: type.level, seed: 'twins' };
    const previous = previousPlans[term]?.items[unit.id + ':' + key];
    const keepLayout = spec => {
      if (previous?.original !== entry.original) return;
      const match = previous.variants.find(old => old.seed === spec.seed && old.mode === spec.mode && JSON.stringify(old.response) === JSON.stringify(spec.response) && JSON.stringify(old.other) === JSON.stringify(spec.other));
      if (match?.render) spec.render = match.render;
    };
    const seen = new Set([T.canonical(original)]);
    for (let attempt = 0; attempt < 150 && entry.variants.length < 3; attempt++) {
      const spec = { seed: (attempt + 1) * 7919 + n * 101 };
      if (excluded.has(unit.id + ':' + key + ':' + spec.seed)) continue;
      keepLayout(spec);
      try {
        const shape = T.canonical(T.construct(B, unit, group, original, entry, { ...spec, render: undefined }, entry.variants.length));
        if (seen.has(shape)) continue;
        const item = T.construct(B, unit, group, original, entry, spec, entry.variants.length);
        validate(item, at);
        spec.fingerprint = T.fingerprint(item); entry.variants.push(spec); seen.add(shape); report.generated++;
      } catch (error) { report.rejected.push({ unit: unit.id, key, seed: spec.seed, message: error.message.slice(0, 250) }); }
    }
    // 정의처럼 값이 고정되는 문항에는 제시한 답을 판단하는 개념 확인 변형을 준비한다.
    if (entry.variants.length < 3) {
      try {
        validate(original, at);
        const right = T.responseOf(original), candidates = original.choice
          ? original.choice.options.map((_, i) => i)
          : [right, ...[1, 2].map(delta => right.map((value, i) => i ? value : original.inputs[0].rel ? (value === '<' ? '>' : '<') : String(Number(value) + delta)))];
        const proposals = candidates.map(response => ({ mode: 'judge', response }));
        const wrong = candidates.find(response => !B.isCorrect(original, response));
        if (wrong !== undefined) proposals.push({ mode: 'pair', response: right, other: wrong });
        for (const spec of proposals) {
          if (entry.variants.length === 3) break;
          keepLayout(spec);
          const shape = T.canonical(T.construct(B, unit, group, original, entry, { ...spec, render: undefined }, entry.variants.length));
          if (seen.has(shape)) continue;
          const item = T.construct(B, unit, group, original, entry, spec, entry.variants.length);
          validate(item, at); spec.fingerprint = T.fingerprint(item); entry.variants.push(spec); seen.add(shape); report.concept++;
        }
      } catch (error) { report.failures.push({ unit: unit.id, key, message: error.message }); }
    }
    if (entry.variants.length !== 3) report.failures.push({ unit: unit.id, key, count: entry.variants.length });
    plan.items[unit.id + ':' + key] = entry; report.originals++; report.twins += entry.variants.length;
  }
  process.stdout.write(unit.id + ': ' + report.originals + ' originals, ' + report.twins + ' twins, ' + report.failures.length + ' failures\n');
}
for (const [term, plan] of Object.entries(report.terms)) {
  const filename = path.join(target, term + '.json'), text = JSON.stringify(plan);
  if (checkOnly && !require('node:util').isDeepStrictEqual(JSON.parse(fs.readFileSync(filename, 'utf8')), JSON.parse(text))) throw new Error(term + ' 검증 명세가 현재 문항과 다릅니다.');
  else fs.writeFileSync(filename, text);
}
const summary = { ...report, terms: Object.fromEntries(Object.entries(report.terms).map(([term, plan]) => [term, Object.keys(plan.items).length])) };
fs.mkdirSync(path.resolve(__dirname, '../../outputs/math-twins'), { recursive: true });
fs.writeFileSync(path.resolve(__dirname, '../../outputs/math-twins/validation.json'), JSON.stringify(summary, null, 2));
console.log(JSON.stringify({ ...summary, rejected: report.rejected.length, failures: report.failures.length }));
if (report.failures.length) process.exitCode = 1;
