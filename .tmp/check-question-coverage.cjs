const fs=require('node:fs'),path=require('node:path');
const {createQuestions}=require('../learning/inquiry/age-of-exploration/lib/study-question-builder');
const pool=JSON.parse(fs.readFileSync(path.join(__dirname,'study-content-analysis.json')));
let failures=0;
for(const p of pool){try{createQuestions(p,[]);}catch(error){failures++;console.log(JSON.stringify({id:p.id,name:p.name,text:p.text}));}}
console.log({total:pool.length,failures});
