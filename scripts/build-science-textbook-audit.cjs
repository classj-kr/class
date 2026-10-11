// Generate a bounded, honest evidence inventory from locally collected sources.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),out='docs/science-lab-audit-2026-10-11';
const all=process.argv.includes('--all');
const manifest=JSON.parse(fs.readFileSync(path.join(root,'tmp/science-audit-2026-10-11/'+(all?'manifest-all.json':'manifest.json')),'utf8'));
const reviews=['source-review.cjs',...(all?['source-review-expanded.cjs','source-review-life-earth.cjs']:[])].flatMap(f=>require('../'+out+'/'+f));
const map=require('../learning/inquiry/science-lab/curriculum-map.js');
const bank=require('../learning/inquiry/science-lab/exam-bank.js');
const activityTools=require('./science-activity-tools.cjs');
const sha=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const sources=manifest.map(({extractedFile,...source})=>{
 if(sha(fs.readFileSync(path.join(root,source.path)))!==source.sha256)throw Error('Source changed: '+source.path);
 const extracted=JSON.parse(fs.readFileSync(path.join(root,extractedFile),'utf8'));
 const texts=source.kind==='pdf'?(extracted.pages||[]).map(p=>p.text):(extracted.paragraphs||[]);
 const blankTextUnits=texts.filter(t=>!String(t||'').trim()).length;
 return {...source,id:source.sha256.slice(0,16),blankTextUnits,textUnits:texts.length,hasExtractedText:texts.some(t=>String(t||'').trim()),status:source.error?'extraction-failed':'indexed-only'};
});
const review=reviews.map(([id,locators,apps,principle,method])=>{
 const source=sources.find(s=>s.id===id);if(!source)throw Error('Unknown source '+id);
 if(source.error)throw Error('Reviewed source has extraction error: '+id);
 const raw=manifest.find(s=>s.sha256===source.sha256);
 const extracted=JSON.parse(fs.readFileSync(path.join(root,raw.extractedFile),'utf8'));
 for(const n of locators)if(!(source.kind==='pdf'?extracted.pages[n-1]?.text:extracted.paragraphs[n-1]))throw Error('Invalid source locator '+id+':'+n);
 for(const slug of apps)if(!map[slug])throw Error('Unknown app '+slug);
 source.status='selected-passages-reviewed';
 return{id,locators,locatorType:source.kind==='pdf'?'PDF page':'extracted paragraph (figures/formulas may be absent)',apps,principle,method};
});
const apps=Object.entries(map).map(([slug,app])=>({slug,title:app.title,grades:app.grades,standards:app.codes,
 originalQuestions:[...fs.readFileSync(path.join(root,'learning/inquiry/science-lab',slug,'index.html'),'utf8').matchAll(/class="quiz-card"/g)].length,
 linkedExamQuestions:bank.forApp(slug,map).map(q=>q.id),
 reviewedEvidence:[...new Set(review.filter(r=>r.apps.includes(slug)).map(r=>r.id))],
 contentVerdict:'No whole-app scientific certification; source review is limited to the listed principles.',
}));
const activityReviews=Object.entries(activityTools).map(([activityId,tool])=>{
 const source=sources.find(s=>s.id===tool.source.id);if(!source||source.error)throw Error('Invalid activity source '+activityId);
 const extracted=JSON.parse(fs.readFileSync(path.join(root,manifest.find(s=>s.sha256===source.sha256).extractedFile),'utf8'));
 for(const page of tool.source.pages)if(!extracted.pages?.find(p=>p.pdfPage===page&&p.text.trim()))throw Error('Invalid activity page '+activityId+':'+page);
 return{activityId,tool:tool.tool,title:tool.title,kind:tool.kind||'모형',sourceId:source.id,pages:tool.source.pages,path:source.path,remaining:tool.remaining,verdict:'해당 단계에 한정한 지원 · 전체 활동 완료 판정 아님'};
});
const summary={date:'2026-10-11',apps:apps.length,originalQuestions:apps.reduce((n,a)=>n+a.originalQuestions,0),examQuestions:bank.questions.length,
 sourcePaths:sources.reduce((n,s)=>n+1+(s.aliases?.length||0),0),duplicatePaths:sources.reduce((n,s)=>n+(s.aliases?.length||0),0),sources:sources.length,extractedSources:sources.filter(s=>!s.error).length,extractionErrors:sources.filter(s=>s.error).length,documentsWithoutText:sources.filter(s=>!s.hasExtractedText).length,blankPdfPages:sources.filter(s=>s.kind==='pdf').reduce((n,s)=>n+s.blankTextUnits,0),pdfs:sources.filter(s=>s.kind==='pdf').length,assessmentDocuments:sources.filter(s=>s.kind==='hwp').length,
 pdfPages:sources.reduce((n,s)=>n+(s.kind==='pdf'?s.pages:0),0),reviewedSources:new Set(review.map(r=>r.id)).size,reviewRecords:review.length,appsWithSelectedSourceReview:apps.filter(a=>a.reviewedEvidence.length).length,receiptClassifiedSources:sources.filter(s=>s.revisionEvidence?.receipt).length,activityReviewRecords:activityReviews.length,activityReviewSources:new Set(activityReviews.map(r=>r.sourceId)).size};
fs.writeFileSync(path.join(root,out,'evidence-index.json'),JSON.stringify({summary,sources,review,activityReviews,apps},null,2)+'\n');
const fileLink=(label,file)=>`[${label}](<${path.join(root,file).replaceAll('\\','/')}>)`;
const lines=['# 교과서·평가자료 근거 대조표','','이 표는 적힌 원리와 발췌 범위의 대조 기록이다. 앱 전체나 수집 자료 전체의 정확성 인증이 아니다. 전체 목록·해시·앱별 미대조 항목은 evidence-index.json에 기록했다.','','| 앱 | 원문 | 위치 | 대조한 원리 | 방법 |','|---|---|---|---|---|'];
for(const r of review){const source=sources.find(s=>s.id===r.id);lines.push(`| ${r.apps.join(', ')} | ${fileLink(path.basename(source.path),source.path)} | ${r.locatorType}: ${r.locators.join(', ')} | ${r.principle} | ${r.method} |`);}
lines.push('','## 추가 탐구·분석·조사 도구의 원문 범위','','새 도구의 근거 페이지와 남는 범위다. 모형·자료 분석·조사 활동지는 구분하며 전체 교과서 활동 이수나 과학적 무결성 판정으로 계산하지 않는다.','','| 활동 | 도구 유형 | 원문 | PDF 쪽 | 남는 범위 |','|---|---|---|---|---|');
for(const r of activityReviews)lines.push(`| ${r.activityId} · ${r.title} | ${r.kind} | ${fileLink(path.basename(r.path),r.path)} | ${r.pages.join(', ')} | ${r.remaining} |`);
fs.writeFileSync(path.join(root,out,'source-comparison.md'),lines.join('\n')+'\n');
console.log(JSON.stringify(summary));
