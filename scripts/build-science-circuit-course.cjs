const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../learning/inquiry/science-lab'),r=require('./science-circuit-course.cjs');
const file=path.join(root,'ohms-law/index.html');let html=fs.readFileSync(file,'utf8');
const strip=s=>s.replace(/\r\n/g,'\n').replace(/\?v=[\w.-]+/g,'');
const quiz='<!-- circuit-course-questions -->\n'+r.questions.map((q,i)=>require('./science-question-revision-utils.cjs').renderQuiz(q,i+5)).join('\n')+'\n<!-- /circuit-course-questions -->';
html=html.includes('<!-- circuit-course-questions -->')?html.replace(/<!-- circuit-course-questions -->[\s\S]*?<!-- \/circuit-course-questions -->/,quiz):html.replace(/(\s*<\/div>\s*<\/details>)/, '\n'+quiz+'$1');
const stage='<template id="circuitCourseStage">'+require('./science-circuit-stage.cjs')+'</template>';
html=html.includes('<template id="circuitCourseStage">')?html.replace(/<template id="circuitCourseStage">[\s\S]*?<\/template>/,stage):html.replace('    </main>',stage+'\n    </main>');
if(process.argv.includes('--check'))assert.equal(strip(fs.readFileSync(file,'utf8')),strip(html));else fs.writeFileSync(file,html);
