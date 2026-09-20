const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const corrections=require('../docs/science-lab-audit-2026-09-20/exam-question-corrections.cjs');
test('30 reviewed original questions preserve correct choices, conditions and explanations',()=>{
 assert.equal(corrections.length,30);
 for(const [slug,n,question,choices,answer,why] of corrections){
  const html=fs.readFileSync(path.resolve(__dirname,'../learning/inquiry/science-lab',slug,'index.html'),'utf8');
  const cards=[...html.matchAll(/<article class="quiz-card"[\s\S]*?<\/article>/g)];assert.equal(cards.length,4,slug);
  const card=cards[n-1][0];assert(card.includes('<h3>'+question+'</h3>'),slug+' question '+n);assert(card.includes('data-answer="'+answer+'"'));
  for(const choice of choices)assert(card.includes(choice));assert(card.includes(why));assert.equal(choices.length,4);
 }
 const q=(slug,n)=>corrections.find(r=>r[0]===slug&&r[1]===n);
 assert.match(q('combustion',4)[5],/산소/);assert.match(q('force-motion',4)[2],/직선/);
 assert.match(q('state-change',2)[2],/보통 기압.*순수/);assert.match(q('cell-membrane',1)[2],/부피가 같은/);
 assert.match(q('seasons',4)[5],/서로 다른 위도/);assert.match(q('earth-system',1)[5],/황산염/);
});
