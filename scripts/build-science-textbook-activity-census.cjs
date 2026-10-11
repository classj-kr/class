// A reproducible review queue, not a claim that extracted headings are all experiments.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),out=path.join(root,'docs/science-lab-audit-2026-10-11');
const manifest=JSON.parse(fs.readFileSync(path.join(root,'tmp/science-audit-2026-10-11/manifest-all.json'),'utf8'));
const tools=require('./science-activity-tools.cjs');
const normalized=s=>s.normalize('NFKC').replace(/[\u0000-\u001f]/g,'').replace(/\s+/g,'').replace(/[·ㆍ:：()（）]/g,'');
const generic=/^(?:탐구|활동|실험)?(?:목표|과정|수행|설계|평가|정리|준비|결론|자료수집|자료분석|공유|발표|토의|토론|스스로|배운내용|생각열기|문제인식|문제발견|실력|해결|더알아|탐구문제|결과및)/;
const documents=[],candidates=[];
for(const file of manifest){
 const sourceId=file.sha256.slice(0,16),basename=path.basename(file.path);
 const primary=file.kind==='pdf'&&(/교과서/.test(file.path)||/과학PDF__/.test(basename))&&!/교육과정|진도|교과서선정/.test(basename);
 const activitySheet=file.kind!=='pdf'&&/탐구.?활동지|실험.?활동지/.test(basename);
 if(!primary&&!activitySheet)continue;
 const data=JSON.parse(fs.readFileSync(path.join(root,file.extractedFile),'utf8'));
 const doc={sourceId,path:file.path,role:primary?(/교사용/.test(basename)?'교사용 교과서 PDF':'교과서 PDF'):'탐구 활동지',pages:file.pages||null,error:file.error||null,revisionEvidence:file.revisionEvidence||{kind:'explicit-2022-path'},candidateCount:0};
 const found=new Map();
 if(primary){for(const page of data.pages||[]){
  const t=page.text||'',compact=normalized(t);
  if(!/(?:준비물|탐구과정|탐구수행|과정및결과|탐구설계|문제인식|활동목표)/.test(compact))continue;
  const lines=t.split(/\r?\n/).map(x=>x.trim().replace(/[\u0000-\u001f]/g,'')).filter(Boolean);
  for(const [i,line]of lines.entries()){
   if(line.length<7||line.length>85||!/(?:하기|해\s*보기|알아보기)$/.test(line)||/^\d+[. )]|^•|^➡/.test(line))continue;
   const key=normalized(line);if(generic.test(key)||/써보|생각해|이야기해|말해보|설명해|정리해/.test(key))continue;
   if(!found.has(key))found.set(key,{sourceId,title:line,pages:[],status:'제목 후보 · 활동 범위 수동 대조 필요'});
   const r=found.get(key);if(!r.pages.includes(page.pdfPage))r.pages.push(page.pdfPage);
  }
 }}else if(!file.error){found.set(basename,{sourceId,title:basename.replace(/__[a-f0-9]+\.(?:hwp|hwpx)$/i,''),pages:[],status:'활동지 파일 · 본문 단계 수동 대조 필요'});}
 for(const c of found.values()){
  c.id='book-'+crypto.createHash('sha256').update(sourceId+'\n'+normalized(c.title)).digest('hex').slice(0,16);
  c.samePageTools=Object.entries(tools).filter(([,r])=>r.source.id===sourceId&&r.source.pages.some(p=>c.pages.includes(p))).map(([id])=>id);
  // Being on a reviewed page is not proof of a one-to-one activity match.
  c.implementationVerdict='미판정';candidates.push(c);
 }
 doc.candidateCount=found.size;documents.push(doc);
}
const summary={scope:'2022 자료만; 추출 후보는 필수실험 수 또는 완료 수가 아님',indexedUniqueSources:manifest.length,textbookPDFs:documents.filter(d=>d.role.includes('PDF')).length,activitySheets:documents.filter(d=>d.role==='탐구 활동지').length,titleCandidates:candidates.filter(c=>c.pages.length).length,activitySheetCandidates:candidates.filter(c=>!c.pages.length).length,primaryDocumentsWithoutCandidates:documents.filter(d=>d.role.includes('PDF')&&!d.candidateCount).length,completedActivityVerdicts:0,receiptClassifiedSources:manifest.filter(s=>s.revisionEvidence?.receipt).length};
const result={summary,limitations:['페이지 텍스트에서 찾은 제목 후보이며, 여러 쪽으로 갈라진 제목·이미지 제목·다른 명칭의 활동은 빠질 수 있다.','동일 활동의 출판사별·교사용 판본 중복은 아직 수동 판정 전이다. 후보 수를 독립적인 필수실험 총수로 쓰지 않는다.','같은 쪽의 기존 도구는 검토 참고 링크이며 활동 충족 판정이 아니다.','교육과정의 261개 활동과 이 교과서 제목 후보는 집계 단위가 다르다.'],documents,candidates};
const fileLink=(label,p)=>`[${label}](<${path.join(root,p).replaceAll('\\','/')}>)`;
const md=['# 수집 교과서의 탐구 목록 대조 대기표','','**전체 교과서 탐구 구현 완료로 판정하지 않는다. 104개 앱이나 교육과정의 261개 항목으로 출판사별 교과서 탐구를 모두 포함했다고 주장할 수 없다.**','',...result.limitations.map(t=>'- '+t),'',`색인 ${summary.indexedUniqueSources}개 자료에서 교과서 PDF ${summary.textbookPDFs}개와 탐구 활동지 ${summary.activitySheets}개를 분리했다. 파일명에 연도가 없더라도 2022 수집 기록으로 확인된 고유 자료 ${summary.receiptClassifiedSources}개가 전체 색인에 포함된다.`,`PDF 제목 후보 ${summary.titleCandidates}건, 활동지 파일 후보 ${summary.activitySheetCandidates}건이다. 제목 후보가 없는 교과서 PDF ${summary.primaryDocumentsWithoutCandidates}개도 제외하지 않고 아래 문서 목록에 남겼다. 이 숫자는 필수실험 수가 아니다.`,'','## 문서별 추출·검토 범위','','| 자료 | 종류 | PDF 쪽수 | 제목/파일 후보 | 확인 필요 |','|---|---|---:|---:|---|',...documents.map(d=>`| ${fileLink(path.basename(d.path),d.path)} | ${d.role} | ${d.pages||'—'} | ${d.candidateCount} | ${d.error?'추출 오류':!d.candidateCount?'이미지·제목·범위 확인':'후보 제목과 실제 활동 단계 대조'} |`),'','후보별 제목·원문 쪽수·같은 쪽의 관련 도구는 [JSON 대조 목록](textbook-activity-census.json)에 보존한다. 자동 일치로 완료 판정을 부여하지 않는다.',''];
for(const [name,body]of [['textbook-activity-census.json',JSON.stringify(result,null,2)+'\n'],['textbook-activity-census.md',md.join('\n')]]){const p=path.join(out,name);if(process.argv.includes('--check'))assert.equal(fs.readFileSync(p,'utf8').replace(/\r\n/g,'\n'),body);else fs.writeFileSync(p,body);}
console.log(JSON.stringify(summary));
