const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),base=path.join(root,'docs/science-lab-audit-2026-10-11');
const scope=require('./science-experiment-scope.cjs'),reviews=require(path.join(base,'remaining-procedure-review.cjs'));
const inventory=require('./audit_science_curriculum.cjs'),manifest=require('../tmp/science-audit-2026-10-11/manifest-all.json');
const activities=inventory.sections.flatMap(s=>s.activities.map((a,i)=>({id:s.standards[0].code.slice(0,-3)+'#'+(i+1),title:a.text.replace(/^•\s*/,''),line:a.line})));
const compact=s=>s.normalize('NFKC').replace(/[\u0000-\u001f\s]/g,'');
const rows=reviews.map(r=>{
 const activity=activities.find(a=>a.id===r.id);assert(activity,r.id);
 assert.equal(r.kind==='excluded',Boolean(scope.exclusions[r.id]),r.id+': policy and evidence disagree');
 if(!r.sourceId){assert.equal(r.kind,'unresolved');return{...r,...activity,source:null,review:'교육과정만 확인 · 해당 학교급 교과서 절차 미확인'};}
 const source=manifest.find(s=>s.sha256.startsWith(r.sourceId));assert(source,r.id);
 const extracted=JSON.parse(fs.readFileSync(path.join(root,source.extractedFile),'utf8'));
 const pages=r.pages.map(page=>{const p=extracted.pages.find(p=>p.pdfPage===page);assert(p?.text.trim(),r.id+': '+page);return p;});
 const text=compact(pages.map(p=>p.text).join('\n'));
 for(const anchor of r.anchors)assert(text.includes(compact(anchor)),r.id+': source anchor absent: '+anchor);
 return{...r,...activity,source:{id:r.sourceId,path:source.path,pages:r.pages,pageTextHashes:pages.map(p=>({page:p.pdfPage,sha256:crypto.createHash('sha256').update(p.text).digest('hex')}))},review:'기재한 쪽의 활동 절차 추출문 대조 · 그림·수식 전체 검증 및 출판사 전수 대조 아님'};
});
assert.equal(new Set(rows.map(r=>r.id)).size,rows.length);
const summary={reviewedCandidates:rows.length,textbookProceduresReviewed:rows.filter(r=>r.source).length,excluded:rows.filter(r=>r.kind==='excluded').length,experimentMeasurementObservation:rows.filter(r=>['experiment','measurement','observation'].includes(r.kind)).length,dataAnalysis:rows.filter(r=>r.kind==='data-analysis').length,unresolved:rows.filter(r=>r.kind==='unresolved').length,requiredExperimentTotal:null};
const labels={experiment:'실험 절차',measurement:'직접 측정',observation:'직접 관찰', 'data-analysis':'관측 자료 해석 (실험 수와 별도)',excluded:'독립 실험 앱에서 제외',unresolved:'해당 교과서 절차 미확인'};
const ref=r=>r.source?`[${r.source.id} PDF ${r.pages.join(', ')}쪽](../../${r.source.path.replaceAll('\\','/').replaceAll(' ','%20')})`:`[교육과정 ${r.line}행](../../${inventory.reference}#L${r.line})`;
const md=['# 남은 21개 후보의 교과서 절차 대조','',
 `후보 ${summary.reviewedCandidates}개 중 ${summary.textbookProceduresReviewed}개는 기재한 교과서 쪽의 절차를 대조했다. ${summary.excluded}개는 독립 실험 앱에서 추가 제외한다. 나머지는 실험·측정·관찰 ${summary.experimentMeasurementObservation}개, 관측 자료 해석 ${summary.dataAnalysis}개, 해당 교과서 절차 미확인 ${summary.unresolved}개다.`,'',
 '**직접 실험·관측·측정과 관측 자료 해석을 따로 기록한다. 이 판정은 앱 구현 완료나 필수실험 총수 확정이 아니다.** 현장 관찰·화학 반응이 포함된 복합 활동에서는 그 절차를 남기되 발표·토론·지도 게시·대본 작성 기능은 만들지 않는다.','',
 '| 활동 | 판정 | 확인한 원문 절차 | 남길 범위 | 제외할 범위 | 근거 |','|---|---|---|---|---|---|',
 ...rows.map(r=>`| ${r.id} · ${r.title} | ${labels[r.kind]} | ${r.procedure} | ${r.keep||'—'} | ${r.omit} | ${ref(r)} |`),'',
 '중학교 수온·염분 실시간 자료 활동(9과18#2)은 이번 수집 자료 검색에서 해당 교과서 절차를 찾지 못했다. 고교 해양 자료가 있다는 이유로 중학교 원문 대조 완료로 판정하지 않았다.','',
 '조석은 확인한 교과서가 조석 예보표를 사용한다. 예보와 실측을 동일시하지 않는다. 이번 대조는 추출문에서 활동 단계와 준비물을 확인한 것으로, 도표·수식의 시각 검증이나 평가자료·다른 출판사 전수 대조 완료가 아니다.',''].join('\n');
for(const[name,text]of [['remaining-procedure-review.json',JSON.stringify({summary,rows},null,2)+'\n'],['remaining-procedure-review.md',md]]){const p=path.join(base,name);if(process.argv.includes('--check'))assert.equal(fs.readFileSync(p,'utf8').replace(/\r\n/g,'\n'),text);else fs.writeFileSync(p,text);}
console.log(JSON.stringify(summary));
