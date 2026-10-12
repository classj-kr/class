const fs=require('fs'),path=require('path'),assert=require('node:assert/strict');
const base=path.resolve(__dirname,'../docs/science-lab-audit-2026-10-11');
const coverage=require(path.join(base,'activity-coverage.json')),plans=require('./science-remaining-activities.cjs'),scope=require('./science-experiment-scope.cjs'),tools=require('./science-activity-tools.cjs');
const procedureReview=require(path.join(base,'remaining-procedure-review.json'));
const procedureById=Object.fromEntries(procedureReview.rows.map(r=>[r.id,r]));
const remaining=coverage.rows.filter(r=>r.labScope.status!=='excluded'&&!r.slugs.length&&!r.tool);
assert.deepEqual(remaining.map(r=>r.id).sort(),plans.candidates.map(r=>r[0]).sort(),'Preserve the complete review inventory without treating it as an implementation queue');
const directIds=plans.experimentGroups.flatMap(g=>g.activities);
const partition=[...directIds,...plans.referenceActivities,...plans.unresolvedActivities];
assert.equal(new Set(partition).size,partition.length,'Every candidate belongs to exactly one review group');
assert.deepEqual(partition.slice().sort(),remaining.map(r=>r.id).sort());
for(const id of directIds)assert(['experiment','measurement','observation'].includes(procedureById[id]?.kind),id);
for(const id of plans.referenceActivities)assert.equal(procedureById[id]?.kind,'data-analysis',id);
for(const id of plans.unresolvedActivities)assert.equal(procedureById[id]?.kind,'unresolved',id);
const map=require('../learning/inquiry/science-lab/curriculum-map.js');
for(const group of plans.experimentGroups)for(const slug of group.relatedApps){
 assert(map[slug],group.id+': unknown related app '+slug);
 assert(fs.existsSync(path.resolve(__dirname,'../learning/inquiry/science-lab',slug,'index.html')),slug);
}
const rows=remaining.map(r=>{const [,method,next]=plans.candidates.find(p=>p[0]===r.id);const workGroup=plans.experimentGroups.find(g=>g.activities.includes(r.id));const queue=workGroup?'experiment-review':plans.referenceActivities.includes(r.id)?'reference-only':'source-unresolved';return{id:r.id,title:r.text,sourceLine:r.line,method,next,queue,workGroup:workGroup?.id||null,sourceCandidate:procedureById[r.id]?.source||tools[r.id]?.source||null,procedureKind:procedureById[r.id]?.kind||'unresolved',status:queue==='reference-only'?'자료 해석 참고 · 독립 실험 구현 목록에서 제외':queue==='source-unresolved'?'해당 교과서 절차 미확인 · 구현 목록에 넣지 않음':'기재한 교과서 절차 대조 · 구현 미완료 · 필수실험 총수 확정 아님'};});
const excluded=coverage.rows.filter(r=>r.labScope.status==='excluded').map(r=>({id:r.id,title:r.text,sourceLine:r.line,reason:r.labScope.reason,sourceCandidate:procedureById[r.id]?.source||tools[r.id]?.source||null}));
const counts={};for(const r of rows)counts[r.method]=(counts[r.method]||0)+1;
const workGroups=plans.experimentGroups.map(g=>({...g,mandatoryStatus:'unconfirmed',implementationStatus:'review',sourceActivities:g.activities.map(id=>({id,source:procedureById[id].source})),relatedAppEvidence:g.relatedApps.map(slug=>({slug,path:'learning/inquiry/science-lab/'+slug+'/index.html',sha256:require('node:crypto').createHash('sha256').update(fs.readFileSync(path.resolve(__dirname,'../learning/inquiry/science-lab',slug,'index.html'))).digest('hex')}))}));
const resolvedGroups=plans.resolvedGroups.map(g=>({...g,implementationStatus:'virtual-practice',mandatoryStatus:'unconfirmed',sourceActivities:g.activities.map(id=>({id,source:procedureById[id].source})),boundary:g.remaining}));
const linkedAppGaps=require('../docs/science-lab-audit-2026-10-12/course-practices/heading-recall-review.cjs').documents.filter(r=>r.implementation==='보완 필요').map(r=>{
 const activity=coverage.rows.find(a=>a.id===r.activity);assert(activity&&activity.labScope.status!=='excluded',r.activity);
 return{id:r.activity,title:activity.text,relatedApps:activity.slugs,source:{id:r.sourceId,pages:r.pages},missingProcedure:r.decision,status:'원문에서 확인한 기존 연결 앱의 절차 누락 · 구현 보완 필요'};
});
const sourceOnlyProcedures=require('../docs/science-lab-audit-2026-10-12/course-practices/heading-recall-review.cjs').documents.flatMap(r=>(r.procedureCandidates||[]).map(p=>({...p,sourceId:r.sourceId,mandatoryStatus:'unconfirmed',status:'공통 탐구 기능 연습 · 기존 활동 중복 및 필수 범위 대조 대기'})));
const workSummary={...plans.summary,sourceReviewedLinkedAppGaps:linkedAppGaps.length,sourceOnlyProcedureCandidates:sourceOnlyProcedures.length};
const result={scope:scope.policy,requiredExperimentTotal:null,apps:coverage.apps,remainingCandidates:rows.length,excludedNonExperiments:excluded.length,retiredApps:scope.retiredApps,methodCounts:counts,procedureReview:procedureReview.summary,workSummary,workGroups,linkedAppGaps,sourceOnlyProcedures,resolvedGroups,referenceActivities:plans.referenceActivities,unresolvedActivities:plans.unresolvedActivities,rows,excluded};
const ref=r=>`[${r.id}](../../${coverage.basis}#L${r.sourceLine})`;
const md=['# 실험 범위 정리와 남은 검토 후보','',scope.policy,'',
 '**교육과정에 있는 모든 탐구활동을 실험으로 구현하지 않는다. 아래 제외 항목은 교육과정에서 삭제한 것이 아니라 사용자가 요청한 실험실의 범위 밖으로 분리한 것이다.**','',
 `첫 정리에서 미연결 비실험 과제 24개를 뺐고, 남은 21개 원문 절차 대조에서 5개를 추가 제외했다. 전체 제외 기록은 ${excluded.length}개다. 남은 ${rows.length}개는 실험·측정·관찰 ${workSummary.experimentActivityRows}개, 관측 자료 해석 ${workSummary.referenceOnly}개, 해당 교과서 절차 미확인 ${workSummary.sourceUnresolved}개로 구분한다. 필수실험 확정 수가 아니다. [21개 후보의 원문 쪽·절차·판정](remaining-procedure-review.md).`,'',
 `**미연결 ${rows.length}개를 신규 실험 목록으로 사용하지 않는다.** 실험·측정·관찰 ${directIds.length}개 활동은 공통 절차를 묶은 ${workGroups.length}개 검토 묶음으로 정리했다. 자료 해석 ${plans.referenceActivities.length}개는 참고 목록, 원문 미확인 ${plans.unresolvedActivities.length}개는 근거 확인 목록으로 분리했다. 검토 묶음의 수는 새 앱 수나 필수실험 수가 아니다.`,'',
 '생활 기록 계산인 ‘하루 에너지 섭취·소비 비교’ 앱(energy-budget)을 학생용 경로·목록·문항에서 철회했다. 미래엔 세포와 물질대사 PDF 60~61쪽(인쇄 58~59쪽)은 조사·자료 분석으로 명시한다. 이전 HTML은 retired-non-experiments/energy-budget/index.html에 보존한다. 원본 교과서·평가자료는 유지한다.','',
 '## 구현 대상에서 제외','',
 '| 원문 활동 | 내용 | 제외 사유 |','|---|---|---|',...excluded.map(r=>`| ${ref(r)} | ${r.title} | ${r.reason} |`),'',
 '## 직접 실험·관측·측정의 공통 절차 검토','',
 '과목별 학습 범위는 보존하되 같은 장치·절차마다 페이지를 복제하지 않는다. 기존 앱 연결은 재사용 검토 근거이며 해당 활동의 구현 완료 판정이 아니다. 과학마술은 특정 반응을 의무 지정한 활동이 아니므로 별도 앱을 만들지 않는다.','',
 '| 검토 묶음 | 원문 활동 | 처리 | 공통 절차 | 남은 차이 |','|---|---|---|---|---|',...workGroups.map(g=>`| ${g.title} | ${g.activities.map(id=>ref(rows.find(r=>r.id===id))).join(', ')} | ${g.approach}${g.relatedApps.length?' · '+g.relatedApps.map(slug=>`[${slug}](../../learning/inquiry/science-lab/${slug}/index.html)`).join(', '):''} | ${g.sharedProcedure} | ${g.remaining} |`),'',
 '## 기존 앱 연결 뒤에도 남은 절차 누락','',
 '관련 단원 앱이 이미 연결되어 있어도 교과서의 측정·조작 절차가 없으면 완료로 간주하지 않는다. 다음 항목은 제목 추출 누락을 다시 읽어 확인했다.','',
 '| 원문 활동 | 기존 앱 | 대조한 원문 | 보완할 절차 |','|---|---|---|---|',...linkedAppGaps.map(r=>`| ${r.id} ${r.title} | ${r.relatedApps.join(', ')} | ${r.source.id} PDF ${r.source.pages.join(', ')}쪽 | ${r.missingProcedure} |`),'',
 '## 제목 없는 공통 탐구 기능 연습','',
 '자동 제목 추출에서 빠진 실제 관찰·측정 절차를 보존한다. 단원 도입의 공통 기능 연습을 곧바로 별도 필수실험이나 신규 앱으로 세지 않는다.','',
 '| 활동 | 원문 | 종류 | 판정 |','|---|---|---|---|',...sourceOnlyProcedures.map(r=>`| ${r.title} | ${r.sourceId} PDF ${r.pages.join(', ')}쪽 | ${r.kind} | ${r.status} |`),'',
 '## 원문 절차를 연결한 가상 실험','',
 '실제 현장 수행·실측 자료 제출 완료와 구분한다. 필수실험 총수 확정이나 수집 교과서 전수 대조 완료를 뜻하지 않는다.','',
 '| 활동 묶음 | 원문 활동 | 구현 | 해석 경계 |','|---|---|---|---|',...resolvedGroups.map(g=>`| ${g.title} | ${g.activities.join(', ')} | ${g.relatedApps.map(slug=>`[${slug}](../../learning/inquiry/science-lab/${slug}/index.html)`).join(', ')} | ${g.remaining} |`),'',
 '## 자료 해석 참고 — 독립 실험 구현 목록에서 제외','',
 '| 원문 활동 | 내용 | 자료 조건 |','|---|---|---|',...rows.filter(r=>r.queue==='reference-only').map(r=>`| ${ref(r)} | ${r.title} | ${r.next} |`),'',
 '## 원문 확인 대기 — 구현 목록에 넣지 않음','',
 '| 원문 활동 | 내용 | 확인할 근거 |','|---|---|---|',...rows.filter(r=>r.queue==='source-unresolved').map(r=>`| ${ref(r)} | ${r.title} | ${r.next} |`),'',
 '전체 수집 교과서의 실험 전수 대조·출판사별 중복 판정은 미완료다. 이 범위 정리는 전체 구현 또는 과학적 정확성의 검증 완료를 의미하지 않는다.',''].join('\n');
for(const [name,text]of [['gap-triage.json',JSON.stringify(result,null,2)+'\n'],['gap-triage.md',md]]){const p=path.join(base,name);if(process.argv.includes('--check'))assert.equal(fs.readFileSync(p,'utf8').replace(/\r\n/g,'\n'),text);else fs.writeFileSync(p,text);}
console.log(JSON.stringify({excluded:excluded.length,remainingCandidates:rows.length,...workSummary,retiredApps:Object.keys(scope.retiredApps)}));
