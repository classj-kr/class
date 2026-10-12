const parse=s=>s.split('\n').filter(Boolean).map(line=>{
 const [id,question,correct,...tail]=line.split('|'),why=tail.pop();return{id,question,correct,wrong:tail,why};
});
const original=['physics','chemistry-life','life-earth','restored','bank','additional'].flatMap(name=>parse(require('./science-question-quality-'+name+'.cjs')));
if(new Set(original.map(e=>e.id)).size!==original.length)throw Error('Duplicate editorial revision');
const entries=[...new Map([...original,...require('./science-question-quality-refinements.cjs')].map(e=>[e.id,e])).values()];
// Read the authored (correct-first) rows, not the runtime shuffled choices.
const bankExplanations=require('./science-bank-explanation-revisions.cjs');
const bankRows=['elementary','middle','high','interpretation'].flatMap(part=>{
 const source=require('../learning/inquiry/science-lab/exam-bank-'+part+'.js');
 return parse(typeof source==='string'?source:source.rows);
});
for(const [id,why] of Object.entries(bankExplanations)){
 if(id==='stems')continue;
 let entry=entries.find(e=>e.id===id);
 if(!entry){const row=bankRows.find(e=>e.id===id);if(!row)throw Error('Missing bank revision '+id);entry={...row,wrong:[...row.wrong]};entries.push(entry);}
 entry.why=why;if(bankExplanations.stems[id])entry.question=bankExplanations.stems[id];
}
entries.transfer=[...new Map([...parse(require('./science-question-quality-transfer.cjs')),...require('./science-question-quality-refinements.cjs').transfer].map(e=>[e.id,e])).values()];
if(new Set(entries.map(e=>e.id)).size!==entries.length)throw Error('Duplicate editorial revision');
for(const e of [...entries,...entries.transfer]){if(!e.question||!e.why||e.wrong.length<2||e.wrong.length>3)throw Error('Invalid editorial revision '+e.id);if(new Set([e.correct,...e.wrong]).size!==e.wrong.length+1)throw Error('Duplicate choices '+e.id);}
module.exports=entries;
