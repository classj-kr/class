const {edit,replace,apply,lab}=require('./science-scope-patch.cjs');
edit(lab+'exam-bank.js',s=>{
 s=replace(s,".map((line,index)=>{",".map(line=>{");
 s=replace(s,'const original=[correct,wrong1,wrong2],shift=index%3,choices=original.slice(shift).concat(original.slice(0,shift));',`const choices=[correct,wrong1,wrong2];
 let seed=2166136261;for(const ch of id)seed=Math.imul(seed^ch.charCodeAt(0),16777619)>>>0;
 const random=()=>{seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;return seed>>>0;};
 for(let i=choices.length-1;i>0;i--){const j=random()%(i+1);[choices[i],choices[j]]=[choices[j],choices[i]];}`);return s;
});
edit(lab+'exam-review.js',s=>replace(s,"name+'.js?v=2'","name+'.js?v=3'"));
edit(lab+'exam-scope.js',s=>replace(s,'exam-review.js?v=3','exam-review.js?v=4'));
edit('scripts/audit-science-layout.cjs',s=>replace(s,"new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort()","(new URL(r.request().url()).hostname==='127.0.0.1'||process.env.SCIENCE_LIVE_FONTS&&['fonts.googleapis.com','fonts.gstatic.com'].includes(new URL(r.request().url()).hostname))?r.continue():r.abort()"));
edit('tests/science-exam-editorial.test.cjs',s=>replace(s,"const wrong=bank.questions.flatMap", "const counts=[0,0,0];bank.questions.forEach(q=>counts[q.answer]++);assert(counts.every(n=>n>50));assert(bank.questions.slice(3,20).some((q,i)=>q.answer!==bank.questions[i].answer),'answer positions must not repeat every three items');\n const wrong=bank.questions.flatMap"));
edit('docs/science-lab-audit-2026-09-20/exam-readiness.md',s=>replace(s,'- 교육과정 코드와 문항 수는 유지했다.','- 정답 위치가 3문항마다 반복되던 순서를 문항 ID에 따른 섞기로 바꿨다. 새로고침해도 같은 문항의 선택지 순서는 유지된다.\n- 교육과정 코드와 문항 수는 유지했다.'));
apply();
