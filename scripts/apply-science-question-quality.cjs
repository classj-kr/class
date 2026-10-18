const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const lab=path.resolve(__dirname,'../learning/inquiry/science-lab'),allEntries=require('./science-question-quality.cjs'),reader=require('./review-science-questions.cjs'),before=reader.read(),check=process.argv.includes('--check');
const selection=process.argv.find(a=>a.startsWith('--ids=')),ids=selection?new Set(selection.slice(6).split(',').filter(Boolean)):null;
if(ids){assert(ids.size,'--ids requires at least one base/bank question');for(const id of ids)assert(allEntries.some(e=>e.id===id),'Unknown question '+id);}
const entries=ids?allEntries.filter(e=>ids.has(e.id)):allEntries;
const {revise,reviseTransfer,renderQuiz}=require('./science-question-revision-utils.cjs');
// A focused revision must preserve other independently revised questions and followups.
const metadata=ids?structuredClone(require(path.join(lab,'question-quality-content.js'))):{misconceptions:{},followups:{}};
const authoredAssessments=require(path.join(lab,'experiment-questions.js'));
function write(file,text){if(check)assert.equal(fs.readFileSync(file,'utf8').replace(/\r\n/g,'\n'),text.replace(/\r\n/g,'\n'),file);else if(fs.readFileSync(file,'utf8')!==text)fs.writeFileSync(file,text);}
for(const e of entries){const old=before.find(q=>q.id===e.id);assert(old,e.id);const next=revise({answer:old.choices.findIndex(c=>c.id===old.answer),concept:authoredAssessments.misconceptions[e.id]?.concept},e),{answer:index,choices}=next;
 if(e.id.includes('#q')){
  const file=path.join(lab,old.slug,'index.html'),n=Number(e.id.split('#q')[1]),answer='abcd'[index];let i=0;
  const result=fs.readFileSync(file,'utf8').replace(/<article class="quiz-card" data-answer="[a-d]">[\s\S]*?<\/article>/g,card=>{
   if(++i!==n)return card;
   return renderQuiz(next,n);
  });write(file,result);
  metadata.misconceptions[e.id]={concept:next.concept||require(path.join(lab,'curriculum-map.js'))[old.slug].title+' · '+n+'번',feedback:Object.fromEntries(Object.entries(next.feedback).map(([j,v])=>['abcd'[Number(j)],v]))};
 }else{
  let found=0;for(const part of ['elementary','middle','high','interpretation']){const file=path.join(lab,'exam-bank-'+part+'.js'),src=fs.readFileSync(file,'utf8');const result=src.split('\n').map(line=>{if(!line.startsWith(e.id+'|'))return line;found++;const fields=line.trimEnd().split('|');fields[1]=e.question;fields.splice(2,3,e.correct,...e.wrong);fields[5]=e.why;return fields.join('|');}).join('\n');if(result!==src)write(file,result);}assert.equal(found,1,e.id);
 }
}
// Registered authoring data must win over the previous generated quality file.
// Otherwise changing checks (or deleting an old transfer item) silently keeps
// the stale generated version through assessment-content's runtime merge.
const authoredFollowups=authoredAssessments.followups;
if(!ids)for(const [slug,qs]of Object.entries(require(path.join(lab,'assessment-content.js')).followups))metadata.followups[slug]=(authoredFollowups[slug]||qs).map(reviseTransfer);
// Keep the new outcome questions in the canonical authoring path as well as
// focused core-result revisions; unrelated focused revisions stay untouched.
if(!ids||process.argv.includes('--core-results'))for(const [slug,qs]of Object.entries(require('./science-core-result-questions.cjs').followups)){
 const byId=new Map((metadata.followups[slug]||[]).map(q=>[q.id,q]));
 for(const q of qs)byId.set(q.id,q);
 metadata.followups[slug]=[...byId.values()];
}
const file=path.join(lab,'question-quality-content.js'),content=`/* Editorial feedback for revised choices; interpreted only after correction. */\n(function(root){const data=${JSON.stringify(metadata,null,2)};if(typeof module!=='undefined')module.exports=data;else root.scienceQualityContent=data;})(typeof window==='undefined'?globalThis:window);\n`;
if(check)assert.equal(fs.readFileSync(file,'utf8').replace(/\r\n/g,'\n'),content);else fs.writeFileSync(file,content);
console.log(JSON.stringify({revised:entries.length,check}));
