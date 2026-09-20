const {edit,replace,apply,lab}=require('./science-scope-patch.cjs');
const updates=new Map(require('./science-exam-choice-review.cjs').split('\n').map(line=>{const [id,...fields]=line.split('|');if(![2,5].includes(fields.length))throw Error(id+' invalid field count');return[id,fields];}));
const seen=new Set();
for(const part of ['elementary','middle','high','interpretation'])edit(lab+'exam-bank-'+part+'.js',s=>s.split('\n').map(line=>{const fields=line.split('|'),id=fields[0],u=updates.get(id);if(!u)return line;seen.add(id);if(u.length===5)return[id,...u].join('|');fields[3]=u[0];fields[4]=u[1];return fields.join('|');}).join('\n'));
if(seen.size!==updates.size)throw Error('Unmatched items: '+[...updates.keys()].filter(k=>!seen.has(k)));
apply();console.log(seen.size+' revised questions; remaining items reviewed and retained');
