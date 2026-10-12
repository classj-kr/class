const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const reader=require('./review-science-questions.cjs'),entries=require('./science-question-quality-refinements.cjs');
const dir=path.resolve(__dirname,'../docs/science-lab-audit-2026-10-12/course-practices');
const before=JSON.parse(fs.readFileSync(path.join(dir,'question-refinement-before.json'),'utf8')),current=reader.read();
assert.equal(entries.length,33);assert.equal(new Set(entries.map(e=>e.id)).size,entries.length);
const questions=entries.map(e=>{const q=current.find(q=>q.id===e.id),old=before.find(q=>q.id===e.id);assert(q&&old,e.id);
 assert.equal(q.question,e.question);assert.equal(q.why,e.why);assert.equal(q.choices.find(c=>c.id===q.answer).text,e.correct);
 assert.deepEqual(q.choices.filter(c=>c.id!==q.answer).map(c=>c.text).sort(),e.wrong.slice().sort());
 if(e.misconceptions)assert.equal(e.misconceptions.length,e.wrong.length);
 return{id:e.id,slug:q.slug,sha256:reader.digest(q),before:old,after:q,misconceptions:e.misconceptions};
});
const allTransfer=Object.values(require('../learning/inquiry/science-lab/assessment-content.js').followups).flat();
const transferQuestions=entries.transfer.map(e=>{const q=allTransfer.find(q=>q.id===e.id);assert(q,e.id);assert.equal(q.question,e.question);assert.equal(q.choices[q.answer],e.correct);assert.deepEqual(q.choices.filter((_,i)=>i!==q.answer).sort(),e.wrong.slice().sort());assert.equal(q.why,e.why);return{id:e.id,sha256:reader.digest(q),after:q};});
const report={date:'2026-10-12',scope:'33 base/bank and 2 transfer stems and distractor sets individually re-read after length/parallelism review. Newly authored examples; no empirical student calibration or complete source census claim.',questions,transferQuestions,
 checks:['Recrystallization: max(40−20,0)=20 g A, max(2−6,0)=0 g B, independent-solubility assumption explicit.','Factorial controls: compare one variable at a time; no second valid comparison offered.','Benedict: positive reagent control; maltose is reducing, starch negative under the stated test.','Mendel: Rr×Rr has P(round)=3/4 regardless of an earlier sample of eight.','Solubility normalized to water mass: 20/50×100=40, not solution mass.','Observed sugar table preserved: 29−20=9 g; observation not extrapolated to all substances.','Redshift: (505−500)/500=0.01, no nonrelativistic velocity assumption needed.','Closed-system water: vapor 30 g, total 100 g; compensation point: 6−6=0 with both processes continuing.','Metamorphic sequence options all contain four rocks; neural paths all contain five nodes; no option wins by merely containing every step.','Brine boiling specifies unsaturated solution before salt crystallization; neurotransmitter question limited to immediate stimulation, not clinical effects.']};
const file=path.join(dir,'question-refinement-review.json'),body=JSON.stringify(report,null,2)+'\n';
if(process.argv.includes('--check'))assert.equal(fs.readFileSync(file,'utf8').replace(/\r\n/g,'\n'),body);else fs.writeFileSync(file,body);
