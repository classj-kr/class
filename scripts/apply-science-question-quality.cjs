const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const lab=path.resolve(__dirname,'../learning/inquiry/science-lab'),entries=require('./science-question-quality.cjs'),reader=require('./review-science-questions.cjs'),before=reader.read(),check=process.argv.includes('--check');
const {revise,reviseTransfer,renderQuiz}=require('./science-question-revision-utils.cjs');
const metadata={misconceptions:{},followups:{}};
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
for(const [slug,qs]of Object.entries(require(path.join(lab,'assessment-content.js')).followups))metadata.followups[slug]=(authoredFollowups[slug]||qs).map(reviseTransfer);
const file=path.join(lab,'question-quality-content.js'),content=`/* Editorial feedback for revised choices; interpreted only after correction. */\n(function(root){const data=${JSON.stringify(metadata,null,2)};if(typeof module!=='undefined')module.exports=data;else root.scienceQualityContent=data;})(typeof window==='undefined'?globalThis:window);\n`;
if(check)assert.equal(fs.readFileSync(file,'utf8').replace(/\r\n/g,'\n'),content);else fs.writeFileSync(file,content);
console.log(JSON.stringify({revised:entries.length,check}));
