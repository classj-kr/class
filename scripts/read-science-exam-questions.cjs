// Read-only content review, including the original fixed question bank.
const fs=require('node:fs'),map=require('../learning/inquiry/science-lab/curriculum-map.js');
const grades=(process.argv.find(a=>a.startsWith('--grades='))||'--grades=초3,초4,초5,초6').slice(9).split(',');
const clean=s=>(s||'').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();
for(const[slug,app]of Object.entries(map)){
 if(!app.grades.some(g=>grades.includes(g)))continue;
 const html=fs.readFileSync('learning/inquiry/science-lab/'+slug+'/index.html','utf8');console.log('\n'+slug);
 for(const match of html.matchAll(/<article class="quiz-card"[\s\S]*?<\/article>/g)){
  const s=match[0];console.log(clean(s.match(/<h3>([\s\S]*?)<\/h3>/)?.[1]),'정답',s.match(/data-answer="([^"]+)/)?.[1],clean(s.match(/class="answer-explanation"[^>]*>([\s\S]*?)<\/p>/)?.[1]));
 }
}
