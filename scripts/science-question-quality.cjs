const parse=s=>s.split('\n').filter(Boolean).map(line=>{
 const [id,question,correct,...tail]=line.split('|'),why=tail.pop();return{id,question,correct,wrong:tail,why};
});
const entries=['physics','chemistry-life','life-earth','restored','bank','additional'].flatMap(name=>parse(require('./science-question-quality-'+name+'.cjs')));
entries.transfer=parse(require('./science-question-quality-transfer.cjs'));
if(new Set(entries.map(e=>e.id)).size!==entries.length)throw Error('Duplicate editorial revision');
for(const e of [...entries,...entries.transfer]){if(!e.question||!e.why||e.wrong.length<2||e.wrong.length>3)throw Error('Invalid editorial revision '+e.id);if(new Set([e.correct,...e.wrong]).size!==e.wrong.length+1)throw Error('Duplicate choices '+e.id);}
module.exports=entries;
