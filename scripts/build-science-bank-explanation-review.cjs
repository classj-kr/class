// Snapshot of the 241 bank items manually re-read on 2026-10-12.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const reader=require('./review-science-questions.cjs'),patch=require('./science-bank-explanation-revisions.cjs');
const dir=path.resolve(__dirname,'../docs/science-lab-audit-2026-10-12/course-practices');
const before=require(path.join(dir,'bank-explanation-before.json')).questions;
const after=reader.read().filter(q=>!q.id.includes('#q'));
assert.equal(before.length,241);assert.equal(after.length,241);
const changed=[];
for(const q of after){
 const old=before.find(r=>r.id===q.id);assert(old,q.id);
 const expected={...old,...(patch[q.id]?{why:patch[q.id]}:{}),...(patch.stems[q.id]?{question:patch.stems[q.id]}:{})};
 assert.deepEqual(q,expected,'Unintended bank change: '+q.id);
 if(reader.digest(old)!==reader.digest(q))changed.push({id:q.id,before:old,after:q});
}
assert.equal(changed.length,103);
const report={date:'2026-10-12',scope:'All 241 displayed bank items were manually re-read for question, choices, key and explanation alignment. This records that editorial pass; it does not establish complete textbook coverage or empirical student diagnostic validity.',
 findings:['4과13-03 explained navigation by constellations instead of distinguishing stars and planets.','9과15-02 explained the Milky Way instead of distinguishing nebulae and star clusters.','Other revised explanations were generic, tangential or addressed assessment-authoring scope instead of the particular answer.','The incline item now states equal height and negligible friction; the spectrum item requires several matching characteristic lines.'],
 explanationChanges:103,stemChanges:2,choiceAndKeyChanges:0,
 questions:after.map(q=>({id:q.id,sha256:reader.digest(q),after:q})),changes:changed};
const file=path.join(dir,'bank-explanation-review.json'),body=JSON.stringify(report,null,2)+'\n';
if(process.argv.includes('--check'))assert.equal(fs.readFileSync(file,'utf8').replace(/\r\n/g,'\n'),body);else fs.writeFileSync(file,body);
console.log(JSON.stringify({read:after.length,explanations:103,stems:2,choicesOrKeys:0,check:process.argv.includes('--check')}));
