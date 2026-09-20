const {edit,replace,apply,lab}=require('./science-scope-patch.cjs');
edit('docs/science-lab-audit-2026-09-20/current-activity-overrides.cjs',s=>s+"\n// Evidence-backed additions from the current required experiment implementation.\nfor(const r of require('./required-gap-review.cjs'))for(const id of r.activities){const entry={id,slugs:[r.slug],status:r.status,note:r.note};const i=module.exports.findIndex(x=>x.id===id);if(i<0)module.exports.push(entry);else module.exports[i]=entry;}\n");
edit('docs/science-lab-audit-2026-09-20/current-review.cjs',s=>s+"\nfor(const r of require('./required-gap-review.cjs')){const entry=module.exports.find(x=>x.slug===r.slug);entry.current+='; 추가 실험: '+r.title+' (조건 조작·관찰 기록·확인 문제)';}\n");
edit('scripts/build-current-science-audit.cjs',s=>{
 s=replace(s,"out+'/required-core-review.cjs'","out+'/required-gap-review.cjs',out+'/required-core-review.cjs'");
 s=replace(s,"- 전자석: 초6 circuit-bulbs.","- 추가 필수 탐구: 기존 앱에 18개 실험 패널을 연결하고 조건별 관찰 기록과 확인 문제를 추가했다. [추가 구현 범위](required-gap.md)를 확인한다.\\n- 전자석: 초6 circuit-bulbs.");
 return s;
});
edit(lab+'required-experiments.js',s=>replace(s,'if(records.length>12)records.shift();',''));
apply();
