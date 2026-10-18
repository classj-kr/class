// The explicit editorial map is the semantic review. These checks verify its
// references against published content; matching IDs alone cannot prove science.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {rows}=require('./science-outcome-inventory.cjs'),additions=require('./science-outcome-question-additions.cjs');
const dir=path.resolve(__dirname,'../docs/science-lab-audit-2026-10-18/core-results-full');
const before=JSON.parse(fs.readFileSync(path.join(dir,'before.json'),'utf8'));
const lines=require('./science-outcome-review-data.cjs').split('\n');
const contexts={
 'ohms-law':{middle:[0,1,2,4,5,6,7],'high-elective':[0,1,2,3]},
 'ride-acceleration':{'high-common':[0,2,3,4],'high-elective':[1,5,6,7]},
 'dna-structure':{'high-common':[0,1,2,3],'high-elective':[0,3,4,5]},
 'telescope-observation':{middle:[0,1,2,3],'high-elective':[3,4,5,6,7]},
};
function extraQuestions(r){return r.extra.flatMap(e=>e.samples.filter(s=>s.check).map(s=>({...s.check,location:e.id==='observation'?'observation':'required',experiment:e.id,state:s.state,observed:s.text})));}
function questions(r){return [...r.routes.flatMap(t=>t.questions.map(q=>({...q,location:q.id.includes('#q')?'base':'bank',school:t.school}))),...extraQuestions(r)];}
const allAdditions=Object.values(additions).flat(),addedIds=new Set(allAdditions.map(q=>q.id));
for(const q of allAdditions){assert.equal(new Set(q.choices).size,3,q.id);assert(q.choices[q.answer],q.id);assert.equal(Object.keys(q.feedback).length,2,q.id);assert.equal(q.checks.length,0,'new result is not evidence of another item mastery');}
assert.equal(new Set(lines.map(s=>s.split('|')[0])).size,rows.length);
const apps=rows.map(r=>{
 const line=lines.find(l=>l.startsWith(r.slug+'|'));assert(line,r.slug);
 const available=new Map(questions(r).map(q=>[q.id,q])),old=new Set(questions(before.find(b=>b.slug===r.slug)).map(q=>q.id));
 const outcomes=line.split('|')[1].split(';').map((s,index)=>{
  const [result,ids]=s.split('~'),references=ids.split(',').map(id=>/^[#@]/.test(id)?r.slug+id:id);
  assert(result&&references.length,r.slug);
  for(const id of references)assert(available.has(id),r.slug+' missing '+id);
  const routes=r.routes.filter(t=>!contexts[r.slug]||contexts[r.slug][t.school].includes(index)).map(t=>{
   const live=new Set([...t.questions.map(q=>q.id),...(!t.standalone?extraQuestions(r).map(q=>q.id):[])]);
   const accessible=references.filter(id=>live.has(id));assert(accessible.length,`${r.slug}/${t.school}: ${result}`);
   return{school:t.school,questionIds:accessible};
  });
  assert(routes.length,r.slug+' unmapped result '+result);
  return{index:index+1,result,neededNewQuestion:references.some(id=>!old.has(id)),routes,questions:references.map(id=>({...available.get(id),added:addedIds.has(id)}))};
 });
 return{slug:r.slug,title:r.title,current:r.current,displayedResults:r.results,modes:r.modes,procedures:r.procedures,extra:r.extra.map(e=>({id:e.id,title:e.title,states:e.samples.length,results:[...new Set(e.samples.map(s=>s.text))]})),routes:r.routes.map(t=>({school:t.school,standalone:t.standalone,questions:t.questions.map(q=>q.id)})),outcomes};
});
const linkedIds=new Set(apps.flatMap(a=>a.outcomes.flatMap(o=>o.questions.map(q=>q.id))));
for(const q of allAdditions)assert(linkedIds.has(q.id),'unmapped addition '+q.id);
const scope={apps:apps.length,routes:rows.reduce((n,r)=>n+r.routes.length,0),outcomes:apps.reduce((n,a)=>n+a.outcomes.length,0),addedQuestions:allAdditions.length,changedApps:Object.keys(additions).length,outcomesNeedingNewQuestions:apps.flatMap(a=>a.outcomes).filter(o=>o.neededNewQuestion).length,missingReferences:0,missingApplicableRoutes:0};
const sources=['scripts/science-outcome-inventory.cjs','scripts/science-outcome-review-data.cjs','scripts/science-outcome-question-additions.cjs','learning/inquiry/science-lab/question-quality-content.js','learning/inquiry/science-lab/curriculum-map.js'].map(file=>({file,sha256:crypto.createHash('sha256').update(fs.readFileSync(path.resolve(__dirname,'..',file))).digest('hex')}));
const report={scope,method:'Implemented apparatus controls, displayed observations and procedure outcomes were compared with what each question actually asks. The editorial mapping is explicit; the assertions check actual published references and course routing, not semantic correctness by keyword.',limitations:'196 is the implemented-app inventory, not a certified census of required 2022 curriculum experiments. Browser/device emulation is separate evidence from this question review.',sources,apps};
fs.writeFileSync(path.join(dir,'coverage.json'),JSON.stringify(report,null,2)+'\n');
const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const html=`<!doctype html><html lang="ko"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>196개 실험 핵심 결과·문항 대조</title><style>body{font:16px/1.7 system-ui,sans-serif;color:#173043;background:#f3f6fa;margin:0}main{max-width:1100px;margin:auto;padding:32px 20px}h1{font-size:26px}h2{font-size:22px}details{background:white;border:1px solid #c7d3dd;border-radius:12px;margin:14px 0;padding:16px}summary{cursor:pointer;font-weight:700;min-height:44px}li{margin:12px 0}a{color:#075789}small{font-size:14px}code{overflow-wrap:anywhere}blockquote{margin:12px 0;border-left:3px solid #85aabb;padding-left:16px}.new{color:#8d3e12}.options{color:#334c60}</style><main><h1>196개 실험 핵심 결과·문항 대조</h1><p>${scope.apps}개 실험 · ${scope.routes}개 학교급 경로 · ${scope.outcomes}개 결과 항목 · ${scope.addedQuestions}개 보완 문항 (${scope.changedApps}개 실험)</p><p>각 결과에서 학생이 실제로 판단해야 하는 내용과 문제의 정답·오답을 대조했다. 아래 연결은 문항 수나 단어 일치에 따른 자동 판정이 아니다. 실험 도중의 확인 문제도 포함하고, 별도 학교급 화면에서 숨겨진 문제는 해당 화면의 근거로 세지 않았다.</p><p>범위는 현재 구현된 196개 실험이다. 교육과정 전체의 필수실험 수를 확정한 자료는 아니다. 동작·가독성 검사 결과는 별도 파일에 기록한다.</p><p><a href="coverage.json">전체 대조 데이터</a> · <a href="before.json">보완 전 문항과 관찰 결과</a></p>${apps.map(a=>`<details><summary>${escape(a.title)} · ${a.outcomes.length}개 결과</summary><p><a href="/learning/inquiry/science-lab/${a.slug}/">실험 열기</a> · <code>${a.slug}</code></p>${a.current?`<p>${escape(a.current)}</p>`:''}<ol>${a.outcomes.map(o=>`<li><strong>${escape(o.result)}</strong> ${o.neededNewQuestion?'<span class="new">보완</span>':''}<p><small>${o.routes.map(t=>escape(t.school)+': '+t.questionIds.map(escape).join(', ')).join('<br>')}</small></p>${o.questions.map(q=>`<blockquote><small>${escape(q.id)}${q.added?' · 추가':''}</small><p>${escape(q.question)}</p><p class="options">${q.choices.map((c,i)=>`${i+1}. ${escape(c)}`).join('<br>')}</p><p>정답: ${escape(q.choices[q.answer])}<br>${escape(q.why)}</p></blockquote>`).join('')}</li>`).join('')}</ol></details>`).join('')}</main></html>`;
fs.writeFileSync(path.join(dir,'index.html'),html);
console.log(JSON.stringify(scope));
module.exports=report;
