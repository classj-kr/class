// Generate a bounded, honest evidence inventory from locally collected sources.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),out='docs/science-lab-audit-2026-10-11';
const manifest=JSON.parse(fs.readFileSync(path.join(root,'tmp/science-audit-2026-10-11/manifest.json'),'utf8'));
const reviews=require('../'+out+'/source-review.cjs');
const map=require('../learning/inquiry/science-lab/curriculum-map.js');
const bank=require('../learning/inquiry/science-lab/exam-bank.js');
const sha=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const sources=manifest.map(({extractedFile,...source})=>{
 if(source.error)throw Error('Source extraction failed: '+source.path);
 if(sha(fs.readFileSync(path.join(root,source.path)))!==source.sha256)throw Error('Source changed: '+source.path);
 return {...source,id:source.sha256.slice(0,16),status:'indexed-only'};
});
const review=reviews.map(([id,locators,apps,principle,method])=>{
 const source=sources.find(s=>s.id===id);if(!source)throw Error('Unknown source '+id);
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
 reviewedEvidence:review.filter(r=>r.apps.includes(slug)).map(r=>r.id),
 contentVerdict:'No whole-app scientific certification; source review is limited to the listed principles.',
}));
const summary={date:'2026-10-11',apps:apps.length,originalQuestions:apps.reduce((n,a)=>n+a.originalQuestions,0),examQuestions:bank.questions.length,
 sources:sources.length,pdfs:sources.filter(s=>s.kind==='pdf').length,assessmentDocuments:sources.filter(s=>s.kind==='hwp').length,
 pdfPages:sources.reduce((n,s)=>n+(s.kind==='pdf'?s.pages:0),0),reviewedSources:new Set(review.map(r=>r.id)).size,reviewRecords:review.length,appsWithSelectedSourceReview:apps.filter(a=>a.reviewedEvidence.length).length};
fs.writeFileSync(path.join(root,out,'evidence-index.json'),JSON.stringify({summary,sources,review,apps},null,2)+'\n');
const fileLink=(label,file)=>`[${label}](<${path.join(root,file).replaceAll('\\','/')}>)`;
const lines=['# 교과서·평가자료 근거 대조표','','이 표는 적힌 원리와 발췌 범위의 대조 기록이다. 앱 전체나 수집 자료 전체의 정확성 인증이 아니다. 전체 목록·해시·앱별 미대조 항목은 evidence-index.json에 기록했다.','','| 앱 | 원문 | 위치 | 대조한 원리 | 방법 |','|---|---|---|---|---|'];
for(const r of review){const source=sources.find(s=>s.id===r.id);lines.push(`| ${r.apps.join(', ')} | ${fileLink(path.basename(source.path),source.path)} | ${r.locatorType}: ${r.locators.join(', ')} | ${r.principle} | ${r.method} |`);}
fs.writeFileSync(path.join(root,out,'source-comparison.md'),lines.join('\n')+'\n');
console.log(JSON.stringify(summary));
