// Read question content independently of browser grading; preserve the authored review snapshot.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),base=path.join(root,'learning/inquiry/science-lab');
const clean=s=>s.replace(/<[^>]*>/g,' ').replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/\s+/g,' ').trim();
const escape=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
function read(){
 const rows=[];for(const slug of Object.keys(require(path.join(base,'curriculum-map.js')))){
  const html=fs.readFileSync(path.join(base,slug,'index.html'),'utf8');let n=0;
  for(const [,answer,card]of html.matchAll(/<article class="quiz-card" data-answer="([a-d])">([\s\S]*?)<\/article>/g)){
   const choices=[...card.matchAll(/<label><input[^>]*value="([a-d])"[^>]*>([\s\S]*?)<\/label>/g)].map(([,id,text])=>({id,text:clean(text)}));
   rows.push({id:slug+'#q'+(++n),slug,question:clean(card.match(/<h3>([\s\S]*?)<\/h3>/)[1]),choices,answer,why:clean(card.match(/<p class="answer-explanation"[^>]*>([\s\S]*?)<\/p>/)[1])});
  }assert.equal(n,4,slug);
 }
 for(const q of require(path.join(base,'exam-bank.js')).questions)rows.push({id:q.id,slug:q.host,question:q.question,choices:q.choices.map((text,id)=>({id:String(id),text})),answer:String(q.answer),why:q.why,data:q.data});
 return rows;
}
const digest=q=>crypto.createHash('sha256').update(JSON.stringify(q)).digest('hex');
function apply(){
 const before=new Map(read().map(q=>[q.id,q])),corrections=require('../docs/science-lab-audit-2026-10-11/question-corrections.cjs');
 assert.equal(new Set(corrections.map(r=>r[0])).size,corrections.length);
 for(const [id,patch]of corrections){const q=before.get(id);assert(q,id);
  if(id.includes('#q')){
   const file=path.join(base,q.slug,'index.html');let n=0;
   const html=fs.readFileSync(file,'utf8').replace(/<article class="quiz-card" data-answer="[a-d]">[\s\S]*?<\/article>/g,card=>{
    if(++n!==Number(id.split('#q')[1]))return card;
    if(patch.question)card=card.replace(/(<h3>)[\s\S]*?(<\/h3>)/,(_,a,b)=>a+escape(patch.question)+b);
    if(patch.why)card=card.replace(/(<p class="answer-explanation"[^>]*>)[\s\S]*?(<\/p>)/,(_,a,b)=>a+escape(patch.why)+b);
    for(const [key,value]of Object.entries(patch.choices||{}))card=card.replace(new RegExp('(<label><input[^>]*value="'+key+'"[^>]*>)[\\s\\S]*?(</label>)'),(_,a,b)=>a+' '+escape(value)+b);
    return card;
   });fs.writeFileSync(file,html);
  }else{
   let found=0;for(const part of ['elementary','middle','high','interpretation']){
    const file=path.join(base,'exam-bank-'+part+'.js'),source=fs.readFileSync(file,'utf8');
    const output=source.split('\n').map(line=>{if(!line.startsWith(id+'|'))return line;found++;const fields=line.trimEnd().split('|');
     if(patch.question)fields[1]=patch.question;if(patch.why)fields[5]=patch.why;
     for(const [key,value]of Object.entries(patch.choices||{})){const old=q.choices.find(c=>c.id===key).text,index=fields.indexOf(old,2);assert(index>=2&&index<=4,id);fields[index]=value;}
     assert(fields.every(s=>!/[|`]/.test(s)),id);return fields.join('|');}).join('\n');if(output!==source)fs.writeFileSync(file,output);
   }assert.equal(found,1,id);
  }
 }console.log('Applied '+corrections.length+' authored question corrections');
}
module.exports={read,digest};
if(require.main===module){
 if(process.argv.includes('--apply'))apply();
 else {const rows=read(),snapshot=require('../docs/science-lab-audit-2026-10-11/question-review.json'),restored=require('../docs/science-lab-audit-2026-10-11/restored-question-review.json'),reviews=[...snapshot.questions,...restored.questions];assert.equal(rows.length,reviews.length);
  assert.equal(new Set(reviews.map(q=>q.id)).size,reviews.length);
  for(const q of rows){const reviewed=reviews.find(r=>r.id===q.id);assert(reviewed,'Unreviewed '+q.id);assert.equal(digest(q),reviewed.sha256,'Question changed after review: '+q.id);assert.equal(new Set(q.choices.map(c=>c.text)).size,q.choices.length);assert(q.choices.some(c=>c.id===q.answer));}
  console.log(rows.length+' question contents match the reviewed snapshots; this check does not independently prove scientific correctness.');
 }
}
